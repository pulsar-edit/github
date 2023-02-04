"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LargeRepoError = exports.GitError = void 0;
var _path = _interopRequireDefault(require("path"));
var _os = _interopRequireDefault(require("os"));
var _child_process = _interopRequireDefault(require("child_process"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _util = _interopRequireDefault(require("util"));
var _electron = require("electron");
var _eventKit = require("event-kit");
var _dugite = require("dugite");
var _whatTheDiff = require("what-the-diff");
var _whatTheStatus = require("what-the-status");
var _gitPromptServer = _interopRequireDefault(require("./git-prompt-server"));
var _gitTempDir = _interopRequireDefault(require("./git-temp-dir"));
var _asyncQueue = _interopRequireDefault(require("./async-queue"));
var _reporterProxy = require("./reporter-proxy");
var _helpers = require("./helpers");
var _gitTimingsView = _interopRequireDefault(require("./views/git-timings-view"));
var _file = _interopRequireDefault(require("./models/patch/file"));
var _workerManager = _interopRequireDefault(require("./worker-manager"));
var _author = _interopRequireDefault(require("./models/author"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const MAX_STATUS_OUTPUT_LENGTH = 1024 * 1024 * 10;
let headless = null;
let execPathPromise = null;
class GitError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.stack = new Error().stack;
  }
}
exports.GitError = GitError;
class LargeRepoError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.stack = new Error().stack;
  }
}

// ignored for the purposes of usage metrics tracking because they're noisy
exports.LargeRepoError = LargeRepoError;
const IGNORED_GIT_COMMANDS = ['cat-file', 'config', 'diff', 'for-each-ref', 'log', 'rev-parse', 'status'];
const DISABLE_COLOR_FLAGS = ['branch', 'diff', 'showBranch', 'status', 'ui'].reduce((acc, type) => {
  acc.unshift('-c', `color.${type}=false`);
  return acc;
}, []);

/**
 * Expand config path name per
 * https://git-scm.com/docs/git-config#git-config-pathname
 * this regex attempts to get the specified user's home directory
 * Ex: on Mac ~kuychaco/ is expanded to the specified user’s home directory (/Users/kuychaco)
 * Regex translation:
 * ^~ line starts with tilde
 * ([^\\\\/]*)[\\\\/] captures non-slash characters before first slash
 */
const EXPAND_TILDE_REGEX = new RegExp('^~([^\\\\/]*)[\\\\/]');
class GitShellOutStrategy {
  constructor(workingDir, options = {}) {
    this.workingDir = workingDir;
    if (options.queue) {
      this.commandQueue = options.queue;
    } else {
      const parallelism = options.parallelism || Math.max(3, _os.default.cpus().length);
      this.commandQueue = new _asyncQueue.default({
        parallelism
      });
    }
    this.prompt = options.prompt || (query => Promise.reject());
    this.workerManager = options.workerManager;
    if (headless === null) {
      headless = !_electron.remote.getCurrentWindow().isVisible();
    }
  }

  /*
   * Provide an asynchronous callback to be used to request input from the user for git operations.
   *
   * `prompt` must be a callable that accepts a query object `{prompt, includeUsername}` and returns a Promise
   * that either resolves with a result object `{[username], password}` or rejects on cancellation.
   */
  setPromptCallback(prompt) {
    this.prompt = prompt;
  }

  // Execute a command and read the output using the embedded Git environment
  async exec(args, options = GitShellOutStrategy.defaultExecArgs) {
    /* eslint-disable no-console,no-control-regex */
    const {
      stdin,
      useGitPromptServer,
      useGpgWrapper,
      useGpgAtomPrompt,
      writeOperation
    } = options;
    const commandName = args[0];
    const subscriptions = new _eventKit.CompositeDisposable();
    const diagnosticsEnabled = process.env.ATOM_GITHUB_GIT_DIAGNOSTICS || atom.config.get('github.gitDiagnostics');
    const formattedArgs = `git ${args.join(' ')} in ${this.workingDir}`;
    const timingMarker = _gitTimingsView.default.generateMarker(`git ${args.join(' ')}`);
    timingMarker.mark('queued');
    args.unshift(...DISABLE_COLOR_FLAGS);
    if (execPathPromise === null) {
      // Attempt to collect the --exec-path from a native git installation.
      execPathPromise = new Promise(resolve => {
        _child_process.default.exec('git --exec-path', (error, stdout) => {
          /* istanbul ignore if */
          if (error) {
            // Oh well
            resolve(null);
            return;
          }
          resolve(stdout.trim());
        });
      });
    }
    const execPath = await execPathPromise;
    return this.commandQueue.push(async () => {
      timingMarker.mark('prepare');
      let gitPromptServer;
      const pathParts = [];
      if (process.env.PATH) {
        pathParts.push(process.env.PATH);
      }
      if (execPath) {
        pathParts.push(execPath);
      }
      const env = _objectSpread({}, process.env, {
        GIT_TERMINAL_PROMPT: '0',
        GIT_OPTIONAL_LOCKS: '0',
        PATH: pathParts.join(_path.default.delimiter)
      });
      const gitTempDir = new _gitTempDir.default();
      if (useGpgWrapper) {
        await gitTempDir.ensure();
        args.unshift('-c', `gpg.program=${gitTempDir.getGpgWrapperSh()}`);
      }
      if (useGitPromptServer) {
        gitPromptServer = new _gitPromptServer.default(gitTempDir);
        await gitPromptServer.start(this.prompt);
        env.ATOM_GITHUB_TMP = gitTempDir.getRootPath();
        env.ATOM_GITHUB_ASKPASS_PATH = (0, _helpers.normalizeGitHelperPath)(gitTempDir.getAskPassJs());
        env.ATOM_GITHUB_CREDENTIAL_PATH = (0, _helpers.normalizeGitHelperPath)(gitTempDir.getCredentialHelperJs());
        env.ATOM_GITHUB_ELECTRON_PATH = (0, _helpers.normalizeGitHelperPath)((0, _helpers.getAtomHelperPath)());
        env.ATOM_GITHUB_SOCK_ADDR = gitPromptServer.getAddress();
        env.ATOM_GITHUB_WORKDIR_PATH = this.workingDir;
        env.ATOM_GITHUB_DUGITE_PATH = (0, _helpers.getDugitePath)();
        env.ATOM_GITHUB_KEYTAR_STRATEGY_PATH = (0, _helpers.getSharedModulePath)('keytar-strategy');

        // "ssh" won't respect SSH_ASKPASS unless:
        // (a) it's running without a tty
        // (b) DISPLAY is set to something nonempty
        // But, on a Mac, DISPLAY is unset. Ensure that it is so our SSH_ASKPASS is respected.
        if (!process.env.DISPLAY || process.env.DISPLAY.length === 0) {
          env.DISPLAY = 'atom-github-placeholder';
        }
        env.ATOM_GITHUB_ORIGINAL_PATH = process.env.PATH || '';
        env.ATOM_GITHUB_ORIGINAL_GIT_ASKPASS = process.env.GIT_ASKPASS || '';
        env.ATOM_GITHUB_ORIGINAL_SSH_ASKPASS = process.env.SSH_ASKPASS || '';
        env.ATOM_GITHUB_ORIGINAL_GIT_SSH_COMMAND = process.env.GIT_SSH_COMMAND || '';
        env.ATOM_GITHUB_SPEC_MODE = atom.inSpecMode() ? 'true' : 'false';
        env.SSH_ASKPASS = (0, _helpers.normalizeGitHelperPath)(gitTempDir.getAskPassSh());
        env.GIT_ASKPASS = (0, _helpers.normalizeGitHelperPath)(gitTempDir.getAskPassSh());
        if (process.platform === 'linux') {
          env.GIT_SSH_COMMAND = gitTempDir.getSshWrapperSh();
        } else if (process.env.GIT_SSH_COMMAND) {
          env.GIT_SSH_COMMAND = process.env.GIT_SSH_COMMAND;
        } else {
          env.GIT_SSH = process.env.GIT_SSH;
        }
        const credentialHelperSh = (0, _helpers.normalizeGitHelperPath)(gitTempDir.getCredentialHelperSh());
        args.unshift('-c', `credential.helper=${credentialHelperSh}`);
      }
      if (useGpgWrapper && useGitPromptServer && useGpgAtomPrompt) {
        env.ATOM_GITHUB_GPG_PROMPT = 'true';
      }

      /* istanbul ignore if */
      if (diagnosticsEnabled) {
        env.GIT_TRACE = 'true';
        env.GIT_TRACE_CURL = 'true';
      }
      let opts = {
        env
      };
      if (stdin) {
        opts.stdin = stdin;
        opts.stdinEncoding = 'utf8';
      }

      /* istanbul ignore if */
      if (process.env.PRINT_GIT_TIMES) {
        console.time(`git:${formattedArgs}`);
      }
      return new Promise(async (resolve, reject) => {
        if (options.beforeRun) {
          const newArgsOpts = await options.beforeRun({
            args,
            opts
          });
          args = newArgsOpts.args;
          opts = newArgsOpts.opts;
        }
        const {
          promise,
          cancel
        } = this.executeGitCommand(args, opts, timingMarker);
        let expectCancel = false;
        if (gitPromptServer) {
          subscriptions.add(gitPromptServer.onDidCancel(async ({
            handlerPid
          }) => {
            expectCancel = true;
            await cancel();

            // On Windows, the SSH_ASKPASS handler is executed as a non-child process, so the bin\git-askpass-atom.sh
            // process does not terminate when the git process is killed.
            // Kill the handler process *after* the git process has been killed to ensure that git doesn't have a
            // chance to fall back to GIT_ASKPASS from the credential handler.
            await new Promise((resolveKill, rejectKill) => {
              require('tree-kill')(handlerPid, 'SIGTERM', err => {
                /* istanbul ignore if */
                if (err) {
                  rejectKill(err);
                } else {
                  resolveKill();
                }
              });
            });
          }));
        }
        const {
          stdout,
          stderr,
          exitCode,
          signal,
          timing
        } = await promise.catch(err => {
          if (err.signal) {
            return {
              signal: err.signal
            };
          }
          reject(err);
          return {};
        });
        if (timing) {
          const {
            execTime,
            spawnTime,
            ipcTime
          } = timing;
          const now = performance.now();
          timingMarker.mark('nexttick', now - execTime - spawnTime - ipcTime);
          timingMarker.mark('execute', now - execTime - ipcTime);
          timingMarker.mark('ipc', now - ipcTime);
        }
        timingMarker.finalize();

        /* istanbul ignore if */
        if (process.env.PRINT_GIT_TIMES) {
          console.timeEnd(`git:${formattedArgs}`);
        }
        if (gitPromptServer) {
          gitPromptServer.terminate();
        }
        subscriptions.dispose();

        /* istanbul ignore if */
        if (diagnosticsEnabled) {
          const exposeControlCharacters = raw => {
            if (!raw) {
              return '';
            }
            return raw.replace(/\u0000/ug, '<NUL>\n').replace(/\u001F/ug, '<SEP>');
          };
          if (headless) {
            let summary = `git:${formattedArgs}\n`;
            if (exitCode !== undefined) {
              summary += `exit status: ${exitCode}\n`;
            } else if (signal) {
              summary += `exit signal: ${signal}\n`;
            }
            if (stdin && stdin.length !== 0) {
              summary += `stdin:\n${exposeControlCharacters(stdin)}\n`;
            }
            summary += 'stdout:';
            if (stdout.length === 0) {
              summary += ' <empty>\n';
            } else {
              summary += `\n${exposeControlCharacters(stdout)}\n`;
            }
            summary += 'stderr:';
            if (stderr.length === 0) {
              summary += ' <empty>\n';
            } else {
              summary += `\n${exposeControlCharacters(stderr)}\n`;
            }
            console.log(summary);
          } else {
            const headerStyle = 'font-weight: bold; color: blue;';
            console.groupCollapsed(`git:${formattedArgs}`);
            if (exitCode !== undefined) {
              console.log('%cexit status%c %d', headerStyle, 'font-weight: normal; color: black;', exitCode);
            } else if (signal) {
              console.log('%cexit signal%c %s', headerStyle, 'font-weight: normal; color: black;', signal);
            }
            console.log('%cfull arguments%c %s', headerStyle, 'font-weight: normal; color: black;', _util.default.inspect(args, {
              breakLength: Infinity
            }));
            if (stdin && stdin.length !== 0) {
              console.log('%cstdin', headerStyle);
              console.log(exposeControlCharacters(stdin));
            }
            console.log('%cstdout', headerStyle);
            console.log(exposeControlCharacters(stdout));
            console.log('%cstderr', headerStyle);
            console.log(exposeControlCharacters(stderr));
            console.groupEnd();
          }
        }
        if (exitCode !== 0 && !expectCancel) {
          const err = new GitError(`${formattedArgs} exited with code ${exitCode}\nstdout: ${stdout}\nstderr: ${stderr}`);
          err.code = exitCode;
          err.stdErr = stderr;
          err.stdOut = stdout;
          err.command = formattedArgs;
          reject(err);
        }
        if (!IGNORED_GIT_COMMANDS.includes(commandName)) {
          (0, _reporterProxy.incrementCounter)(commandName);
        }
        resolve(stdout);
      });
    }, {
      parallel: !writeOperation
    });
    /* eslint-enable no-console,no-control-regex */
  }

  async gpgExec(args, options) {
    try {
      return await this.exec(args.slice(), _objectSpread({
        useGpgWrapper: true,
        useGpgAtomPrompt: false
      }, options));
    } catch (e) {
      if (/gpg failed/.test(e.stdErr)) {
        return await this.exec(args, _objectSpread({
          useGitPromptServer: true,
          useGpgWrapper: true,
          useGpgAtomPrompt: true
        }, options));
      } else {
        throw e;
      }
    }
  }
  executeGitCommand(args, options, marker = null) {
    if (process.env.ATOM_GITHUB_INLINE_GIT_EXEC || !_workerManager.default.getInstance().isReady()) {
      marker && marker.mark('nexttick');
      let childPid;
      options.processCallback = child => {
        childPid = child.pid;

        /* istanbul ignore next */
        child.stdin.on('error', err => {
          throw new Error(`Error writing to stdin: git ${args.join(' ')} in ${this.workingDir}\n${options.stdin}\n${err}`);
        });
      };
      const promise = _dugite.GitProcess.exec(args, this.workingDir, options);
      marker && marker.mark('execute');
      return {
        promise,
        cancel: () => {
          /* istanbul ignore if */
          if (!childPid) {
            return Promise.resolve();
          }
          return new Promise((resolve, reject) => {
            require('tree-kill')(childPid, 'SIGTERM', err => {
              /* istanbul ignore if */
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        }
      };
    } else {
      const workerManager = this.workerManager || _workerManager.default.getInstance();
      return workerManager.request({
        args,
        workingDir: this.workingDir,
        options
      });
    }
  }
  async resolveDotGitDir() {
    try {
      await _fsExtra.default.stat(this.workingDir); // fails if folder doesn't exist
      const output = await this.exec(['rev-parse', '--resolve-git-dir', _path.default.join(this.workingDir, '.git')]);
      const dotGitDir = output.trim();
      return (0, _helpers.toNativePathSep)(dotGitDir);
    } catch (e) {
      return null;
    }
  }
  init() {
    return this.exec(['init', this.workingDir]);
  }

  /**
   * Staging/Unstaging files and patches and committing
   */
  stageFiles(paths) {
    if (paths.length === 0) {
      return Promise.resolve(null);
    }
    const args = ['add'].concat(paths.map(_helpers.toGitPathSep));
    return this.exec(args, {
      writeOperation: true
    });
  }
  async fetchCommitMessageTemplate() {
    let templatePath = await this.getConfig('commit.template');
    if (!templatePath) {
      return null;
    }
    const homeDir = _os.default.homedir();
    templatePath = templatePath.trim().replace(EXPAND_TILDE_REGEX, (_, user) => {
      // if no user is specified, fall back to using the home directory.
      return `${user ? _path.default.join(_path.default.dirname(homeDir), user) : homeDir}/`;
    });
    templatePath = (0, _helpers.toNativePathSep)(templatePath);
    if (!_path.default.isAbsolute(templatePath)) {
      templatePath = _path.default.join(this.workingDir, templatePath);
    }
    if (!(await (0, _helpers.fileExists)(templatePath))) {
      throw new Error(`Invalid commit template path set in Git config: ${templatePath}`);
    }
    return await _fsExtra.default.readFile(templatePath, {
      encoding: 'utf8'
    });
  }
  unstageFiles(paths, commit = 'HEAD') {
    if (paths.length === 0) {
      return Promise.resolve(null);
    }
    const args = ['reset', commit, '--'].concat(paths.map(_helpers.toGitPathSep));
    return this.exec(args, {
      writeOperation: true
    });
  }
  stageFileModeChange(filename, newMode) {
    const indexReadPromise = this.exec(['ls-files', '-s', '--', filename]);
    return this.exec(['update-index', '--cacheinfo', `${newMode},<OID_TBD>,${filename}`], {
      writeOperation: true,
      beforeRun: async function determineArgs({
        args,
        opts
      }) {
        const index = await indexReadPromise;
        const oid = index.substr(7, 40);
        return {
          opts,
          args: ['update-index', '--cacheinfo', `${newMode},${oid},${filename}`]
        };
      }
    });
  }
  stageFileSymlinkChange(filename) {
    return this.exec(['rm', '--cached', filename], {
      writeOperation: true
    });
  }
  applyPatch(patch, {
    index
  } = {}) {
    const args = ['apply', '-'];
    if (index) {
      args.splice(1, 0, '--cached');
    }
    return this.exec(args, {
      stdin: patch,
      writeOperation: true
    });
  }
  async commit(rawMessage, {
    allowEmpty,
    amend,
    coAuthors,
    verbatim
  } = {}) {
    const args = ['commit'];
    let msg;

    // if amending and no new message is passed, use last commit's message. Ensure that we don't
    // mangle it in the process.
    if (amend && rawMessage.length === 0) {
      const {
        unbornRef,
        messageBody,
        messageSubject
      } = await this.getHeadCommit();
      if (unbornRef) {
        msg = rawMessage;
      } else {
        msg = `${messageSubject}\n\n${messageBody}`.trim();
        verbatim = true;
      }
    } else {
      msg = rawMessage;
    }

    // if commit template is used, strip commented lines from commit
    // to be consistent with command line git.
    const template = await this.fetchCommitMessageTemplate();
    if (template) {
      // respecting the comment character from user settings or fall back to # as default.
      // https://git-scm.com/docs/git-config#git-config-corecommentChar
      let commentChar = await this.getConfig('core.commentChar');
      if (!commentChar) {
        commentChar = '#';
      }
      msg = msg.split('\n').filter(line => !line.startsWith(commentChar)).join('\n');
    }

    // Determine the cleanup mode.
    if (verbatim) {
      args.push('--cleanup=verbatim');
    } else {
      const configured = await this.getConfig('commit.cleanup');
      const mode = configured && configured !== 'default' ? configured : 'strip';
      args.push(`--cleanup=${mode}`);
    }

    // add co-author commit trailers if necessary
    if (coAuthors && coAuthors.length > 0) {
      msg = await this.addCoAuthorsToMessage(msg, coAuthors);
    }
    args.push('-m', msg.trim());
    if (amend) {
      args.push('--amend');
    }
    if (allowEmpty) {
      args.push('--allow-empty');
    }
    return this.gpgExec(args, {
      writeOperation: true
    });
  }
  addCoAuthorsToMessage(message, coAuthors = []) {
    const trailers = coAuthors.map(author => {
      return {
        token: 'Co-Authored-By',
        value: `${author.name} <${author.email}>`
      };
    });

    // Ensure that message ends with newline for git-interpret trailers to work
    const msg = `${message.trim()}\n`;
    return trailers.length ? this.mergeTrailers(msg, trailers) : msg;
  }

  /**
   * File Status and Diffs
   */
  async getStatusBundle() {
    const args = ['status', '--porcelain=v2', '--branch', '--untracked-files=all', '--ignore-submodules=dirty', '-z'];
    const output = await this.exec(args);
    if (output.length > MAX_STATUS_OUTPUT_LENGTH) {
      throw new LargeRepoError();
    }
    const results = await (0, _whatTheStatus.parse)(output);
    for (const entryType in results) {
      if (Array.isArray(results[entryType])) {
        this.updateNativePathSepForEntries(results[entryType]);
      }
    }
    return results;
  }
  updateNativePathSepForEntries(entries) {
    entries.forEach(entry => {
      // Normally we would avoid mutating responses from other package's APIs, but we control
      // the `what-the-status` module and know there are no side effects.
      // This is a hot code path and by mutating we avoid creating new objects that will just be GC'ed
      if (entry.filePath) {
        entry.filePath = (0, _helpers.toNativePathSep)(entry.filePath);
      }
      if (entry.origFilePath) {
        entry.origFilePath = (0, _helpers.toNativePathSep)(entry.origFilePath);
      }
    });
  }
  async diffFileStatus(options = {}) {
    const args = ['diff', '--name-status', '--no-renames'];
    if (options.staged) {
      args.push('--staged');
    }
    if (options.target) {
      args.push(options.target);
    }
    const output = await this.exec(args);
    const statusMap = {
      A: 'added',
      M: 'modified',
      D: 'deleted',
      U: 'unmerged'
    };
    const fileStatuses = {};
    output && output.trim().split(_helpers.LINE_ENDING_REGEX).forEach(line => {
      const [status, rawFilePath] = line.split('\t');
      const filePath = (0, _helpers.toNativePathSep)(rawFilePath);
      fileStatuses[filePath] = statusMap[status];
    });
    if (!options.staged) {
      const untracked = await this.getUntrackedFiles();
      untracked.forEach(filePath => {
        fileStatuses[filePath] = 'added';
      });
    }
    return fileStatuses;
  }
  async getUntrackedFiles() {
    const output = await this.exec(['ls-files', '--others', '--exclude-standard']);
    if (output.trim() === '') {
      return [];
    }
    return output.trim().split(_helpers.LINE_ENDING_REGEX).map(_helpers.toNativePathSep);
  }
  async getDiffsForFilePath(filePath, {
    staged,
    baseCommit
  } = {}) {
    let args = ['diff', '--no-prefix', '--no-ext-diff', '--no-renames', '--diff-filter=u'];
    if (staged) {
      args.push('--staged');
    }
    if (baseCommit) {
      args.push(baseCommit);
    }
    args = args.concat(['--', (0, _helpers.toGitPathSep)(filePath)]);
    const output = await this.exec(args);
    let rawDiffs = [];
    if (output) {
      rawDiffs = (0, _whatTheDiff.parse)(output).filter(rawDiff => rawDiff.status !== 'unmerged');
      for (let i = 0; i < rawDiffs.length; i++) {
        const rawDiff = rawDiffs[i];
        if (rawDiff.oldPath) {
          rawDiff.oldPath = (0, _helpers.toNativePathSep)(rawDiff.oldPath);
        }
        if (rawDiff.newPath) {
          rawDiff.newPath = (0, _helpers.toNativePathSep)(rawDiff.newPath);
        }
      }
    }
    if (!staged && (await this.getUntrackedFiles()).includes(filePath)) {
      // add untracked file
      const absPath = _path.default.join(this.workingDir, filePath);
      const executable = await (0, _helpers.isFileExecutable)(absPath);
      const symlink = await (0, _helpers.isFileSymlink)(absPath);
      const contents = await _fsExtra.default.readFile(absPath, {
        encoding: 'utf8'
      });
      const binary = (0, _helpers.isBinary)(contents);
      let mode;
      let realpath;
      if (executable) {
        mode = _file.default.modes.EXECUTABLE;
      } else if (symlink) {
        mode = _file.default.modes.SYMLINK;
        realpath = await _fsExtra.default.realpath(absPath);
      } else {
        mode = _file.default.modes.NORMAL;
      }
      rawDiffs.push(buildAddedFilePatch(filePath, binary ? null : contents, mode, realpath));
    }
    if (rawDiffs.length > 2) {
      throw new Error(`Expected between 0 and 2 diffs for ${filePath} but got ${rawDiffs.length}`);
    }
    return rawDiffs;
  }
  async getStagedChangesPatch() {
    const output = await this.exec(['diff', '--staged', '--no-prefix', '--no-ext-diff', '--no-renames', '--diff-filter=u']);
    if (!output) {
      return [];
    }
    const diffs = (0, _whatTheDiff.parse)(output);
    for (const diff of diffs) {
      if (diff.oldPath) {
        diff.oldPath = (0, _helpers.toNativePathSep)(diff.oldPath);
      }
      if (diff.newPath) {
        diff.newPath = (0, _helpers.toNativePathSep)(diff.newPath);
      }
    }
    return diffs;
  }

  /**
   * Miscellaneous getters
   */
  async getCommit(ref) {
    const [commit] = await this.getCommits({
      max: 1,
      ref,
      includeUnborn: true
    });
    return commit;
  }
  async getHeadCommit() {
    const [headCommit] = await this.getCommits({
      max: 1,
      ref: 'HEAD',
      includeUnborn: true
    });
    return headCommit;
  }
  async getCommits(options = {}) {
    const {
      max,
      ref,
      includeUnborn,
      includePatch
    } = _objectSpread({
      max: 1,
      ref: 'HEAD',
      includeUnborn: false,
      includePatch: false
    }, options);

    // https://git-scm.com/docs/git-log#_pretty_formats
    // %x00 - null byte
    // %H - commit SHA
    // %ae - author email
    // %an = author full name
    // %at - timestamp, UNIX timestamp
    // %s - subject
    // %b - body
    const args = ['log', '--pretty=format:%H%x00%ae%x00%an%x00%at%x00%s%x00%b%x00', '--no-abbrev-commit', '--no-prefix', '--no-ext-diff', '--no-renames', '-z', '-n', max, ref];
    if (includePatch) {
      args.push('--patch', '-m', '--first-parent');
    }
    const output = await this.exec(args.concat('--')).catch(err => {
      if (/unknown revision/.test(err.stdErr) || /bad revision 'HEAD'/.test(err.stdErr)) {
        return '';
      } else {
        throw err;
      }
    });
    if (output === '') {
      return includeUnborn ? [{
        sha: '',
        message: '',
        unbornRef: true
      }] : [];
    }
    const fields = output.trim().split('\0');
    const commits = [];
    for (let i = 0; i < fields.length; i += 7) {
      const body = fields[i + 5].trim();
      let patch = [];
      if (includePatch) {
        const diffs = fields[i + 6];
        patch = (0, _whatTheDiff.parse)(diffs.trim());
      }
      const {
        message: messageBody,
        coAuthors
      } = (0, _helpers.extractCoAuthorsAndRawCommitMessage)(body);
      commits.push({
        sha: fields[i] && fields[i].trim(),
        author: new _author.default(fields[i + 1] && fields[i + 1].trim(), fields[i + 2] && fields[i + 2].trim()),
        authorDate: parseInt(fields[i + 3], 10),
        messageSubject: fields[i + 4],
        messageBody,
        coAuthors,
        unbornRef: false,
        patch
      });
    }
    return commits;
  }
  async getAuthors(options = {}) {
    const {
      max,
      ref
    } = _objectSpread({
      max: 1,
      ref: 'HEAD'
    }, options);

    // https://git-scm.com/docs/git-log#_pretty_formats
    // %x1F - field separator byte
    // %an - author name
    // %ae - author email
    // %cn - committer name
    // %ce - committer email
    // %(trailers:unfold,only) - the commit message trailers, separated
    //                           by newlines and unfolded (i.e. properly
    //                           formatted and one trailer per line).

    const delimiter = '1F';
    const delimiterString = String.fromCharCode(parseInt(delimiter, 16));
    const fields = ['%an', '%ae', '%cn', '%ce', '%(trailers:unfold,only)'];
    const format = fields.join(`%x${delimiter}`);
    try {
      const output = await this.exec(['log', `--format=${format}`, '-z', '-n', max, ref, '--']);
      return output.split('\0').reduce((acc, line) => {
        if (line.length === 0) {
          return acc;
        }
        const [an, ae, cn, ce, trailers] = line.split(delimiterString);
        trailers.split('\n').map(trailer => trailer.match(_helpers.CO_AUTHOR_REGEX)).filter(match => match !== null).forEach(([_, name, email]) => {
          acc[email] = name;
        });
        acc[ae] = an;
        acc[ce] = cn;
        return acc;
      }, {});
    } catch (err) {
      if (/unknown revision/.test(err.stdErr) || /bad revision 'HEAD'/.test(err.stdErr)) {
        return [];
      } else {
        throw err;
      }
    }
  }
  mergeTrailers(commitMessage, trailers) {
    const args = ['interpret-trailers'];
    for (const trailer of trailers) {
      args.push('--trailer', `${trailer.token}=${trailer.value}`);
    }
    return this.exec(args, {
      stdin: commitMessage
    });
  }
  readFileFromIndex(filePath) {
    return this.exec(['show', `:${(0, _helpers.toGitPathSep)(filePath)}`]);
  }

  /**
   * Merge
   */
  merge(branchName) {
    return this.gpgExec(['merge', branchName], {
      writeOperation: true
    });
  }
  isMerging(dotGitDir) {
    return (0, _helpers.fileExists)(_path.default.join(dotGitDir, 'MERGE_HEAD')).catch(() => false);
  }
  abortMerge() {
    return this.exec(['merge', '--abort'], {
      writeOperation: true
    });
  }
  checkoutSide(side, paths) {
    if (paths.length === 0) {
      return Promise.resolve();
    }
    return this.exec(['checkout', `--${side}`, ...paths.map(_helpers.toGitPathSep)]);
  }

  /**
   * Rebase
   */
  async isRebasing(dotGitDir) {
    const results = await Promise.all([(0, _helpers.fileExists)(_path.default.join(dotGitDir, 'rebase-merge')), (0, _helpers.fileExists)(_path.default.join(dotGitDir, 'rebase-apply'))]);
    return results.some(r => r);
  }

  /**
   * Remote interactions
   */
  clone(remoteUrl, options = {}) {
    const args = ['clone'];
    if (options.noLocal) {
      args.push('--no-local');
    }
    if (options.bare) {
      args.push('--bare');
    }
    if (options.recursive) {
      args.push('--recursive');
    }
    if (options.sourceRemoteName) {
      args.push('--origin', options.remoteName);
    }
    args.push(remoteUrl, this.workingDir);
    return this.exec(args, {
      useGitPromptServer: true,
      writeOperation: true
    });
  }
  fetch(remoteName, branchName) {
    return this.exec(['fetch', remoteName, branchName], {
      useGitPromptServer: true,
      writeOperation: true
    });
  }
  pull(remoteName, branchName, options = {}) {
    const args = ['pull', remoteName, options.refSpec || branchName];
    if (options.ffOnly) {
      args.push('--ff-only');
    }
    return this.gpgExec(args, {
      useGitPromptServer: true,
      writeOperation: true
    });
  }
  push(remoteName, branchName, options = {}) {
    const args = ['push', remoteName || 'origin', options.refSpec || `refs/heads/${branchName}`];
    if (options.setUpstream) {
      args.push('--set-upstream');
    }
    if (options.force) {
      args.push('--force');
    }
    return this.exec(args, {
      useGitPromptServer: true,
      writeOperation: true
    });
  }

  /**
   * Undo Operations
   */
  reset(type, revision = 'HEAD') {
    const validTypes = ['soft'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type ${type}. Must be one of: ${validTypes.join(', ')}`);
    }
    return this.exec(['reset', `--${type}`, revision]);
  }
  deleteRef(ref) {
    return this.exec(['update-ref', '-d', ref]);
  }

  /**
   * Branches
   */
  checkout(branchName, options = {}) {
    const args = ['checkout'];
    if (options.createNew) {
      args.push('-b');
    }
    args.push(branchName);
    if (options.startPoint) {
      if (options.track) {
        args.push('--track');
      }
      args.push(options.startPoint);
    }
    return this.exec(args, {
      writeOperation: true
    });
  }
  async getBranches() {
    const format = ['%(objectname)', '%(HEAD)', '%(refname:short)', '%(upstream)', '%(upstream:remotename)', '%(upstream:remoteref)', '%(push)', '%(push:remotename)', '%(push:remoteref)'].join('%00');
    const output = await this.exec(['for-each-ref', `--format=${format}`, 'refs/heads/**']);
    return output.trim().split(_helpers.LINE_ENDING_REGEX).map(line => {
      const [sha, head, name, upstreamTrackingRef, upstreamRemoteName, upstreamRemoteRef, pushTrackingRef, pushRemoteName, pushRemoteRef] = line.split('\0');
      const branch = {
        name,
        sha,
        head: head === '*'
      };
      if (upstreamTrackingRef || upstreamRemoteName || upstreamRemoteRef) {
        branch.upstream = {
          trackingRef: upstreamTrackingRef,
          remoteName: upstreamRemoteName,
          remoteRef: upstreamRemoteRef
        };
      }
      if (branch.upstream || pushTrackingRef || pushRemoteName || pushRemoteRef) {
        branch.push = {
          trackingRef: pushTrackingRef,
          remoteName: pushRemoteName || branch.upstream && branch.upstream.remoteName,
          remoteRef: pushRemoteRef || branch.upstream && branch.upstream.remoteRef
        };
      }
      return branch;
    });
  }
  async getBranchesWithCommit(sha, option = {}) {
    const args = ['branch', '--format=%(refname)', '--contains', sha];
    if (option.showLocal && option.showRemote) {
      args.splice(1, 0, '--all');
    } else if (option.showRemote) {
      args.splice(1, 0, '--remotes');
    }
    if (option.pattern) {
      args.push(option.pattern);
    }
    return (await this.exec(args)).trim().split(_helpers.LINE_ENDING_REGEX);
  }
  checkoutFiles(paths, revision) {
    if (paths.length === 0) {
      return null;
    }
    const args = ['checkout'];
    if (revision) {
      args.push(revision);
    }
    return this.exec(args.concat('--', paths.map(_helpers.toGitPathSep)), {
      writeOperation: true
    });
  }
  async describeHead() {
    return (await this.exec(['describe', '--contains', '--all', '--always', 'HEAD'])).trim();
  }
  async getConfig(option, {
    local
  } = {}) {
    let output;
    try {
      let args = ['config'];
      if (local) {
        args.push('--local');
      }
      args = args.concat(option);
      output = await this.exec(args);
    } catch (err) {
      if (err.code === 1 || err.code === 128) {
        // No matching config found OR --local can only be used inside a git repository
        return null;
      } else {
        throw err;
      }
    }
    return output.trim();
  }
  setConfig(option, value, {
    replaceAll,
    global
  } = {}) {
    let args = ['config'];
    if (replaceAll) {
      args.push('--replace-all');
    }
    if (global) {
      args.push('--global');
    }
    args = args.concat(option, value);
    return this.exec(args, {
      writeOperation: true
    });
  }
  unsetConfig(option) {
    return this.exec(['config', '--unset', option], {
      writeOperation: true
    });
  }
  async getRemotes() {
    let output = await this.getConfig(['--get-regexp', '^remote\\..*\\.url$'], {
      local: true
    });
    if (output) {
      output = output.trim();
      if (!output.length) {
        return [];
      }
      return output.split('\n').map(line => {
        const match = line.match(/^remote\.(.*)\.url (.*)$/);
        return {
          name: match[1],
          url: match[2]
        };
      });
    } else {
      return [];
    }
  }
  addRemote(name, url) {
    return this.exec(['remote', 'add', name, url]);
  }
  async createBlob({
    filePath,
    stdin
  } = {}) {
    let output;
    if (filePath) {
      try {
        output = (await this.exec(['hash-object', '-w', filePath], {
          writeOperation: true
        })).trim();
      } catch (e) {
        if (e.stdErr && e.stdErr.match(/fatal: Cannot open .*: No such file or directory/)) {
          output = null;
        } else {
          throw e;
        }
      }
    } else if (stdin) {
      output = (await this.exec(['hash-object', '-w', '--stdin'], {
        stdin,
        writeOperation: true
      })).trim();
    } else {
      throw new Error('Must supply file path or stdin');
    }
    return output;
  }
  async expandBlobToFile(absFilePath, sha) {
    const output = await this.exec(['cat-file', '-p', sha]);
    await _fsExtra.default.writeFile(absFilePath, output, {
      encoding: 'utf8'
    });
    return absFilePath;
  }
  async getBlobContents(sha) {
    return await this.exec(['cat-file', '-p', sha]);
  }
  async mergeFile(oursPath, commonBasePath, theirsPath, resultPath) {
    const args = ['merge-file', '-p', oursPath, commonBasePath, theirsPath, '-L', 'current', '-L', 'after discard', '-L', 'before discard'];
    let output;
    let conflict = false;
    try {
      output = await this.exec(args);
    } catch (e) {
      if (e instanceof GitError && e.code === 1) {
        output = e.stdOut;
        conflict = true;
      } else {
        throw e;
      }
    }

    // Interpret a relative resultPath as relative to the repository working directory for consistency with the
    // other arguments.
    const resolvedResultPath = _path.default.resolve(this.workingDir, resultPath);
    await _fsExtra.default.writeFile(resolvedResultPath, output, {
      encoding: 'utf8'
    });
    return {
      filePath: oursPath,
      resultPath,
      conflict
    };
  }
  async writeMergeConflictToIndex(filePath, commonBaseSha, oursSha, theirsSha) {
    const gitFilePath = (0, _helpers.toGitPathSep)(filePath);
    const fileMode = await this.getFileMode(filePath);
    let indexInfo = `0 0000000000000000000000000000000000000000\t${gitFilePath}\n`;
    if (commonBaseSha) {
      indexInfo += `${fileMode} ${commonBaseSha} 1\t${gitFilePath}\n`;
    }
    if (oursSha) {
      indexInfo += `${fileMode} ${oursSha} 2\t${gitFilePath}\n`;
    }
    if (theirsSha) {
      indexInfo += `${fileMode} ${theirsSha} 3\t${gitFilePath}\n`;
    }
    return this.exec(['update-index', '--index-info'], {
      stdin: indexInfo,
      writeOperation: true
    });
  }
  async getFileMode(filePath) {
    const output = await this.exec(['ls-files', '--stage', '--', (0, _helpers.toGitPathSep)(filePath)]);
    if (output) {
      return output.slice(0, 6);
    } else {
      const executable = await (0, _helpers.isFileExecutable)(_path.default.join(this.workingDir, filePath));
      const symlink = await (0, _helpers.isFileSymlink)(_path.default.join(this.workingDir, filePath));
      if (symlink) {
        return _file.default.modes.SYMLINK;
      } else if (executable) {
        return _file.default.modes.EXECUTABLE;
      } else {
        return _file.default.modes.NORMAL;
      }
    }
  }
  destroy() {
    this.commandQueue.dispose();
  }
}
exports.default = GitShellOutStrategy;
_defineProperty(GitShellOutStrategy, "defaultExecArgs", {
  stdin: null,
  useGitPromptServer: false,
  useGpgWrapper: false,
  useGpgAtomPrompt: false,
  writeOperation: false
});
function buildAddedFilePatch(filePath, contents, mode, realpath) {
  const hunks = [];
  if (contents) {
    let noNewLine;
    let lines;
    if (mode === _file.default.modes.SYMLINK) {
      noNewLine = false;
      lines = [`+${(0, _helpers.toGitPathSep)(realpath)}`, '\\ No newline at end of file'];
    } else {
      noNewLine = contents[contents.length - 1] !== '\n';
      lines = contents.trim().split(_helpers.LINE_ENDING_REGEX).map(line => `+${line}`);
    }
    if (noNewLine) {
      lines.push('\\ No newline at end of file');
    }
    hunks.push({
      lines,
      oldStartLine: 0,
      oldLineCount: 0,
      newStartLine: 1,
      heading: '',
      newLineCount: noNewLine ? lines.length - 1 : lines.length
    });
  }
  return {
    oldPath: null,
    newPath: (0, _helpers.toNativePathSep)(filePath),
    oldMode: null,
    newMode: mode,
    status: 'added',
    hunks
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNQVhfU1RBVFVTX09VVFBVVF9MRU5HVEgiLCJoZWFkbGVzcyIsImV4ZWNQYXRoUHJvbWlzZSIsIkdpdEVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm1lc3NhZ2UiLCJzdGFjayIsIkxhcmdlUmVwb0Vycm9yIiwiSUdOT1JFRF9HSVRfQ09NTUFORFMiLCJESVNBQkxFX0NPTE9SX0ZMQUdTIiwicmVkdWNlIiwiYWNjIiwidHlwZSIsInVuc2hpZnQiLCJFWFBBTkRfVElMREVfUkVHRVgiLCJSZWdFeHAiLCJHaXRTaGVsbE91dFN0cmF0ZWd5Iiwid29ya2luZ0RpciIsIm9wdGlvbnMiLCJxdWV1ZSIsImNvbW1hbmRRdWV1ZSIsInBhcmFsbGVsaXNtIiwiTWF0aCIsIm1heCIsIm9zIiwiY3B1cyIsImxlbmd0aCIsIkFzeW5jUXVldWUiLCJwcm9tcHQiLCJxdWVyeSIsIlByb21pc2UiLCJyZWplY3QiLCJ3b3JrZXJNYW5hZ2VyIiwicmVtb3RlIiwiZ2V0Q3VycmVudFdpbmRvdyIsImlzVmlzaWJsZSIsInNldFByb21wdENhbGxiYWNrIiwiZXhlYyIsImFyZ3MiLCJkZWZhdWx0RXhlY0FyZ3MiLCJzdGRpbiIsInVzZUdpdFByb21wdFNlcnZlciIsInVzZUdwZ1dyYXBwZXIiLCJ1c2VHcGdBdG9tUHJvbXB0Iiwid3JpdGVPcGVyYXRpb24iLCJjb21tYW5kTmFtZSIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiZGlhZ25vc3RpY3NFbmFibGVkIiwicHJvY2VzcyIsImVudiIsIkFUT01fR0lUSFVCX0dJVF9ESUFHTk9TVElDUyIsImF0b20iLCJjb25maWciLCJnZXQiLCJmb3JtYXR0ZWRBcmdzIiwiam9pbiIsInRpbWluZ01hcmtlciIsIkdpdFRpbWluZ3NWaWV3IiwiZ2VuZXJhdGVNYXJrZXIiLCJtYXJrIiwicmVzb2x2ZSIsImNoaWxkUHJvY2VzcyIsImVycm9yIiwic3Rkb3V0IiwidHJpbSIsImV4ZWNQYXRoIiwicHVzaCIsImdpdFByb21wdFNlcnZlciIsInBhdGhQYXJ0cyIsIlBBVEgiLCJHSVRfVEVSTUlOQUxfUFJPTVBUIiwiR0lUX09QVElPTkFMX0xPQ0tTIiwicGF0aCIsImRlbGltaXRlciIsImdpdFRlbXBEaXIiLCJHaXRUZW1wRGlyIiwiZW5zdXJlIiwiZ2V0R3BnV3JhcHBlclNoIiwiR2l0UHJvbXB0U2VydmVyIiwic3RhcnQiLCJBVE9NX0dJVEhVQl9UTVAiLCJnZXRSb290UGF0aCIsIkFUT01fR0lUSFVCX0FTS1BBU1NfUEFUSCIsIm5vcm1hbGl6ZUdpdEhlbHBlclBhdGgiLCJnZXRBc2tQYXNzSnMiLCJBVE9NX0dJVEhVQl9DUkVERU5USUFMX1BBVEgiLCJnZXRDcmVkZW50aWFsSGVscGVySnMiLCJBVE9NX0dJVEhVQl9FTEVDVFJPTl9QQVRIIiwiZ2V0QXRvbUhlbHBlclBhdGgiLCJBVE9NX0dJVEhVQl9TT0NLX0FERFIiLCJnZXRBZGRyZXNzIiwiQVRPTV9HSVRIVUJfV09SS0RJUl9QQVRIIiwiQVRPTV9HSVRIVUJfRFVHSVRFX1BBVEgiLCJnZXREdWdpdGVQYXRoIiwiQVRPTV9HSVRIVUJfS0VZVEFSX1NUUkFURUdZX1BBVEgiLCJnZXRTaGFyZWRNb2R1bGVQYXRoIiwiRElTUExBWSIsIkFUT01fR0lUSFVCX09SSUdJTkFMX1BBVEgiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfQVNLUEFTUyIsIkdJVF9BU0tQQVNTIiwiQVRPTV9HSVRIVUJfT1JJR0lOQUxfU1NIX0FTS1BBU1MiLCJTU0hfQVNLUEFTUyIsIkFUT01fR0lUSFVCX09SSUdJTkFMX0dJVF9TU0hfQ09NTUFORCIsIkdJVF9TU0hfQ09NTUFORCIsIkFUT01fR0lUSFVCX1NQRUNfTU9ERSIsImluU3BlY01vZGUiLCJnZXRBc2tQYXNzU2giLCJwbGF0Zm9ybSIsImdldFNzaFdyYXBwZXJTaCIsIkdJVF9TU0giLCJjcmVkZW50aWFsSGVscGVyU2giLCJnZXRDcmVkZW50aWFsSGVscGVyU2giLCJBVE9NX0dJVEhVQl9HUEdfUFJPTVBUIiwiR0lUX1RSQUNFIiwiR0lUX1RSQUNFX0NVUkwiLCJvcHRzIiwic3RkaW5FbmNvZGluZyIsIlBSSU5UX0dJVF9USU1FUyIsImNvbnNvbGUiLCJ0aW1lIiwiYmVmb3JlUnVuIiwibmV3QXJnc09wdHMiLCJwcm9taXNlIiwiY2FuY2VsIiwiZXhlY3V0ZUdpdENvbW1hbmQiLCJleHBlY3RDYW5jZWwiLCJhZGQiLCJvbkRpZENhbmNlbCIsImhhbmRsZXJQaWQiLCJyZXNvbHZlS2lsbCIsInJlamVjdEtpbGwiLCJyZXF1aXJlIiwiZXJyIiwic3RkZXJyIiwiZXhpdENvZGUiLCJzaWduYWwiLCJ0aW1pbmciLCJjYXRjaCIsImV4ZWNUaW1lIiwic3Bhd25UaW1lIiwiaXBjVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiZmluYWxpemUiLCJ0aW1lRW5kIiwidGVybWluYXRlIiwiZGlzcG9zZSIsImV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzIiwicmF3IiwicmVwbGFjZSIsInN1bW1hcnkiLCJ1bmRlZmluZWQiLCJsb2ciLCJoZWFkZXJTdHlsZSIsImdyb3VwQ29sbGFwc2VkIiwidXRpbCIsImluc3BlY3QiLCJicmVha0xlbmd0aCIsIkluZmluaXR5IiwiZ3JvdXBFbmQiLCJjb2RlIiwic3RkRXJyIiwic3RkT3V0IiwiY29tbWFuZCIsImluY2x1ZGVzIiwiaW5jcmVtZW50Q291bnRlciIsInBhcmFsbGVsIiwiZ3BnRXhlYyIsInNsaWNlIiwiZSIsInRlc3QiLCJtYXJrZXIiLCJBVE9NX0dJVEhVQl9JTkxJTkVfR0lUX0VYRUMiLCJXb3JrZXJNYW5hZ2VyIiwiZ2V0SW5zdGFuY2UiLCJpc1JlYWR5IiwiY2hpbGRQaWQiLCJwcm9jZXNzQ2FsbGJhY2siLCJjaGlsZCIsInBpZCIsIm9uIiwiR2l0UHJvY2VzcyIsInJlcXVlc3QiLCJyZXNvbHZlRG90R2l0RGlyIiwiZnMiLCJzdGF0Iiwib3V0cHV0IiwiZG90R2l0RGlyIiwidG9OYXRpdmVQYXRoU2VwIiwiaW5pdCIsInN0YWdlRmlsZXMiLCJwYXRocyIsImNvbmNhdCIsIm1hcCIsInRvR2l0UGF0aFNlcCIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwidGVtcGxhdGVQYXRoIiwiZ2V0Q29uZmlnIiwiaG9tZURpciIsImhvbWVkaXIiLCJfIiwidXNlciIsImRpcm5hbWUiLCJpc0Fic29sdXRlIiwiZmlsZUV4aXN0cyIsInJlYWRGaWxlIiwiZW5jb2RpbmciLCJ1bnN0YWdlRmlsZXMiLCJjb21taXQiLCJzdGFnZUZpbGVNb2RlQ2hhbmdlIiwiZmlsZW5hbWUiLCJuZXdNb2RlIiwiaW5kZXhSZWFkUHJvbWlzZSIsImRldGVybWluZUFyZ3MiLCJpbmRleCIsIm9pZCIsInN1YnN0ciIsInN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UiLCJhcHBseVBhdGNoIiwicGF0Y2giLCJzcGxpY2UiLCJyYXdNZXNzYWdlIiwiYWxsb3dFbXB0eSIsImFtZW5kIiwiY29BdXRob3JzIiwidmVyYmF0aW0iLCJtc2ciLCJ1bmJvcm5SZWYiLCJtZXNzYWdlQm9keSIsIm1lc3NhZ2VTdWJqZWN0IiwiZ2V0SGVhZENvbW1pdCIsInRlbXBsYXRlIiwiY29tbWVudENoYXIiLCJzcGxpdCIsImZpbHRlciIsImxpbmUiLCJzdGFydHNXaXRoIiwiY29uZmlndXJlZCIsIm1vZGUiLCJhZGRDb0F1dGhvcnNUb01lc3NhZ2UiLCJ0cmFpbGVycyIsImF1dGhvciIsInRva2VuIiwidmFsdWUiLCJuYW1lIiwiZW1haWwiLCJtZXJnZVRyYWlsZXJzIiwiZ2V0U3RhdHVzQnVuZGxlIiwicmVzdWx0cyIsInBhcnNlU3RhdHVzIiwiZW50cnlUeXBlIiwiQXJyYXkiLCJpc0FycmF5IiwidXBkYXRlTmF0aXZlUGF0aFNlcEZvckVudHJpZXMiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImVudHJ5IiwiZmlsZVBhdGgiLCJvcmlnRmlsZVBhdGgiLCJkaWZmRmlsZVN0YXR1cyIsInN0YWdlZCIsInRhcmdldCIsInN0YXR1c01hcCIsIkEiLCJNIiwiRCIsIlUiLCJmaWxlU3RhdHVzZXMiLCJMSU5FX0VORElOR19SRUdFWCIsInN0YXR1cyIsInJhd0ZpbGVQYXRoIiwidW50cmFja2VkIiwiZ2V0VW50cmFja2VkRmlsZXMiLCJnZXREaWZmc0ZvckZpbGVQYXRoIiwiYmFzZUNvbW1pdCIsInJhd0RpZmZzIiwicGFyc2VEaWZmIiwicmF3RGlmZiIsImkiLCJvbGRQYXRoIiwibmV3UGF0aCIsImFic1BhdGgiLCJleGVjdXRhYmxlIiwiaXNGaWxlRXhlY3V0YWJsZSIsInN5bWxpbmsiLCJpc0ZpbGVTeW1saW5rIiwiY29udGVudHMiLCJiaW5hcnkiLCJpc0JpbmFyeSIsInJlYWxwYXRoIiwiRmlsZSIsIm1vZGVzIiwiRVhFQ1VUQUJMRSIsIlNZTUxJTksiLCJOT1JNQUwiLCJidWlsZEFkZGVkRmlsZVBhdGNoIiwiZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoIiwiZGlmZnMiLCJkaWZmIiwiZ2V0Q29tbWl0IiwicmVmIiwiZ2V0Q29tbWl0cyIsImluY2x1ZGVVbmJvcm4iLCJoZWFkQ29tbWl0IiwiaW5jbHVkZVBhdGNoIiwic2hhIiwiZmllbGRzIiwiY29tbWl0cyIsImJvZHkiLCJleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSIsIkF1dGhvciIsImF1dGhvckRhdGUiLCJwYXJzZUludCIsImdldEF1dGhvcnMiLCJkZWxpbWl0ZXJTdHJpbmciLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJmb3JtYXQiLCJhbiIsImFlIiwiY24iLCJjZSIsInRyYWlsZXIiLCJtYXRjaCIsIkNPX0FVVEhPUl9SRUdFWCIsImNvbW1pdE1lc3NhZ2UiLCJyZWFkRmlsZUZyb21JbmRleCIsIm1lcmdlIiwiYnJhbmNoTmFtZSIsImlzTWVyZ2luZyIsImFib3J0TWVyZ2UiLCJjaGVja291dFNpZGUiLCJzaWRlIiwiaXNSZWJhc2luZyIsImFsbCIsInNvbWUiLCJyIiwiY2xvbmUiLCJyZW1vdGVVcmwiLCJub0xvY2FsIiwiYmFyZSIsInJlY3Vyc2l2ZSIsInNvdXJjZVJlbW90ZU5hbWUiLCJyZW1vdGVOYW1lIiwiZmV0Y2giLCJwdWxsIiwicmVmU3BlYyIsImZmT25seSIsInNldFVwc3RyZWFtIiwiZm9yY2UiLCJyZXNldCIsInJldmlzaW9uIiwidmFsaWRUeXBlcyIsImRlbGV0ZVJlZiIsImNoZWNrb3V0IiwiY3JlYXRlTmV3Iiwic3RhcnRQb2ludCIsInRyYWNrIiwiZ2V0QnJhbmNoZXMiLCJoZWFkIiwidXBzdHJlYW1UcmFja2luZ1JlZiIsInVwc3RyZWFtUmVtb3RlTmFtZSIsInVwc3RyZWFtUmVtb3RlUmVmIiwicHVzaFRyYWNraW5nUmVmIiwicHVzaFJlbW90ZU5hbWUiLCJwdXNoUmVtb3RlUmVmIiwiYnJhbmNoIiwidXBzdHJlYW0iLCJ0cmFja2luZ1JlZiIsInJlbW90ZVJlZiIsImdldEJyYW5jaGVzV2l0aENvbW1pdCIsIm9wdGlvbiIsInNob3dMb2NhbCIsInNob3dSZW1vdGUiLCJwYXR0ZXJuIiwiY2hlY2tvdXRGaWxlcyIsImRlc2NyaWJlSGVhZCIsImxvY2FsIiwic2V0Q29uZmlnIiwicmVwbGFjZUFsbCIsImdsb2JhbCIsInVuc2V0Q29uZmlnIiwiZ2V0UmVtb3RlcyIsInVybCIsImFkZFJlbW90ZSIsImNyZWF0ZUJsb2IiLCJleHBhbmRCbG9iVG9GaWxlIiwiYWJzRmlsZVBhdGgiLCJ3cml0ZUZpbGUiLCJnZXRCbG9iQ29udGVudHMiLCJtZXJnZUZpbGUiLCJvdXJzUGF0aCIsImNvbW1vbkJhc2VQYXRoIiwidGhlaXJzUGF0aCIsInJlc3VsdFBhdGgiLCJjb25mbGljdCIsInJlc29sdmVkUmVzdWx0UGF0aCIsIndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgiLCJjb21tb25CYXNlU2hhIiwib3Vyc1NoYSIsInRoZWlyc1NoYSIsImdpdEZpbGVQYXRoIiwiZmlsZU1vZGUiLCJnZXRGaWxlTW9kZSIsImluZGV4SW5mbyIsImRlc3Ryb3kiLCJodW5rcyIsIm5vTmV3TGluZSIsImxpbmVzIiwib2xkU3RhcnRMaW5lIiwib2xkTGluZUNvdW50IiwibmV3U3RhcnRMaW5lIiwiaGVhZGluZyIsIm5ld0xpbmVDb3VudCIsIm9sZE1vZGUiXSwic291cmNlcyI6WyJnaXQtc2hlbGwtb3V0LXN0cmF0ZWd5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQge0dpdFByb2Nlc3N9IGZyb20gJ2R1Z2l0ZSc7XG5pbXBvcnQge3BhcnNlIGFzIHBhcnNlRGlmZn0gZnJvbSAnd2hhdC10aGUtZGlmZic7XG5pbXBvcnQge3BhcnNlIGFzIHBhcnNlU3RhdHVzfSBmcm9tICd3aGF0LXRoZS1zdGF0dXMnO1xuXG5pbXBvcnQgR2l0UHJvbXB0U2VydmVyIGZyb20gJy4vZ2l0LXByb21wdC1zZXJ2ZXInO1xuaW1wb3J0IEdpdFRlbXBEaXIgZnJvbSAnLi9naXQtdGVtcC1kaXInO1xuaW1wb3J0IEFzeW5jUXVldWUgZnJvbSAnLi9hc3luYy1xdWV1ZSc7XG5pbXBvcnQge2luY3JlbWVudENvdW50ZXJ9IGZyb20gJy4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtcbiAgZ2V0RHVnaXRlUGF0aCwgZ2V0U2hhcmVkTW9kdWxlUGF0aCwgZ2V0QXRvbUhlbHBlclBhdGgsXG4gIGV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlLCBmaWxlRXhpc3RzLCBpc0ZpbGVFeGVjdXRhYmxlLCBpc0ZpbGVTeW1saW5rLCBpc0JpbmFyeSxcbiAgbm9ybWFsaXplR2l0SGVscGVyUGF0aCwgdG9OYXRpdmVQYXRoU2VwLCB0b0dpdFBhdGhTZXAsIExJTkVfRU5ESU5HX1JFR0VYLCBDT19BVVRIT1JfUkVHRVgsXG59IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgR2l0VGltaW5nc1ZpZXcgZnJvbSAnLi92aWV3cy9naXQtdGltaW5ncy12aWV3JztcbmltcG9ydCBGaWxlIGZyb20gJy4vbW9kZWxzL3BhdGNoL2ZpbGUnO1xuaW1wb3J0IFdvcmtlck1hbmFnZXIgZnJvbSAnLi93b3JrZXItbWFuYWdlcic7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4vbW9kZWxzL2F1dGhvcic7XG5cbmNvbnN0IE1BWF9TVEFUVVNfT1VUUFVUX0xFTkdUSCA9IDEwMjQgKiAxMDI0ICogMTA7XG5cbmxldCBoZWFkbGVzcyA9IG51bGw7XG5sZXQgZXhlY1BhdGhQcm9taXNlID0gbnVsbDtcblxuZXhwb3J0IGNsYXNzIEdpdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExhcmdlUmVwb0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gIH1cbn1cblxuLy8gaWdub3JlZCBmb3IgdGhlIHB1cnBvc2VzIG9mIHVzYWdlIG1ldHJpY3MgdHJhY2tpbmcgYmVjYXVzZSB0aGV5J3JlIG5vaXN5XG5jb25zdCBJR05PUkVEX0dJVF9DT01NQU5EUyA9IFsnY2F0LWZpbGUnLCAnY29uZmlnJywgJ2RpZmYnLCAnZm9yLWVhY2gtcmVmJywgJ2xvZycsICdyZXYtcGFyc2UnLCAnc3RhdHVzJ107XG5cbmNvbnN0IERJU0FCTEVfQ09MT1JfRkxBR1MgPSBbXG4gICdicmFuY2gnLCAnZGlmZicsICdzaG93QnJhbmNoJywgJ3N0YXR1cycsICd1aScsXG5dLnJlZHVjZSgoYWNjLCB0eXBlKSA9PiB7XG4gIGFjYy51bnNoaWZ0KCctYycsIGBjb2xvci4ke3R5cGV9PWZhbHNlYCk7XG4gIHJldHVybiBhY2M7XG59LCBbXSk7XG5cbi8qKlxuICogRXhwYW5kIGNvbmZpZyBwYXRoIG5hbWUgcGVyXG4gKiBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWNvbmZpZyNnaXQtY29uZmlnLXBhdGhuYW1lXG4gKiB0aGlzIHJlZ2V4IGF0dGVtcHRzIHRvIGdldCB0aGUgc3BlY2lmaWVkIHVzZXIncyBob21lIGRpcmVjdG9yeVxuICogRXg6IG9uIE1hYyB+a3V5Y2hhY28vIGlzIGV4cGFuZGVkIHRvIHRoZSBzcGVjaWZpZWQgdXNlcuKAmXMgaG9tZSBkaXJlY3RvcnkgKC9Vc2Vycy9rdXljaGFjbylcbiAqIFJlZ2V4IHRyYW5zbGF0aW9uOlxuICogXn4gbGluZSBzdGFydHMgd2l0aCB0aWxkZVxuICogKFteXFxcXFxcXFwvXSopW1xcXFxcXFxcL10gY2FwdHVyZXMgbm9uLXNsYXNoIGNoYXJhY3RlcnMgYmVmb3JlIGZpcnN0IHNsYXNoXG4gKi9cbmNvbnN0IEVYUEFORF9USUxERV9SRUdFWCA9IG5ldyBSZWdFeHAoJ15+KFteXFxcXFxcXFwvXSopW1xcXFxcXFxcL10nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0U2hlbGxPdXRTdHJhdGVneSB7XG4gIHN0YXRpYyBkZWZhdWx0RXhlY0FyZ3MgPSB7XG4gICAgc3RkaW46IG51bGwsXG4gICAgdXNlR2l0UHJvbXB0U2VydmVyOiBmYWxzZSxcbiAgICB1c2VHcGdXcmFwcGVyOiBmYWxzZSxcbiAgICB1c2VHcGdBdG9tUHJvbXB0OiBmYWxzZSxcbiAgICB3cml0ZU9wZXJhdGlvbjogZmFsc2UsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih3b3JraW5nRGlyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLndvcmtpbmdEaXIgPSB3b3JraW5nRGlyO1xuICAgIGlmIChvcHRpb25zLnF1ZXVlKSB7XG4gICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IG9wdGlvbnMucXVldWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBhcmFsbGVsaXNtID0gb3B0aW9ucy5wYXJhbGxlbGlzbSB8fCBNYXRoLm1heCgzLCBvcy5jcHVzKCkubGVuZ3RoKTtcbiAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gbmV3IEFzeW5jUXVldWUoe3BhcmFsbGVsaXNtfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9tcHQgPSBvcHRpb25zLnByb21wdCB8fCAocXVlcnkgPT4gUHJvbWlzZS5yZWplY3QoKSk7XG4gICAgdGhpcy53b3JrZXJNYW5hZ2VyID0gb3B0aW9ucy53b3JrZXJNYW5hZ2VyO1xuXG4gICAgaWYgKGhlYWRsZXNzID09PSBudWxsKSB7XG4gICAgICBoZWFkbGVzcyA9ICFyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpLmlzVmlzaWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFByb3ZpZGUgYW4gYXN5bmNocm9ub3VzIGNhbGxiYWNrIHRvIGJlIHVzZWQgdG8gcmVxdWVzdCBpbnB1dCBmcm9tIHRoZSB1c2VyIGZvciBnaXQgb3BlcmF0aW9ucy5cbiAgICpcbiAgICogYHByb21wdGAgbXVzdCBiZSBhIGNhbGxhYmxlIHRoYXQgYWNjZXB0cyBhIHF1ZXJ5IG9iamVjdCBge3Byb21wdCwgaW5jbHVkZVVzZXJuYW1lfWAgYW5kIHJldHVybnMgYSBQcm9taXNlXG4gICAqIHRoYXQgZWl0aGVyIHJlc29sdmVzIHdpdGggYSByZXN1bHQgb2JqZWN0IGB7W3VzZXJuYW1lXSwgcGFzc3dvcmR9YCBvciByZWplY3RzIG9uIGNhbmNlbGxhdGlvbi5cbiAgICovXG4gIHNldFByb21wdENhbGxiYWNrKHByb21wdCkge1xuICAgIHRoaXMucHJvbXB0ID0gcHJvbXB0O1xuICB9XG5cbiAgLy8gRXhlY3V0ZSBhIGNvbW1hbmQgYW5kIHJlYWQgdGhlIG91dHB1dCB1c2luZyB0aGUgZW1iZWRkZWQgR2l0IGVudmlyb25tZW50XG4gIGFzeW5jIGV4ZWMoYXJncywgb3B0aW9ucyA9IEdpdFNoZWxsT3V0U3RyYXRlZ3kuZGVmYXVsdEV4ZWNBcmdzKSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSxuby1jb250cm9sLXJlZ2V4ICovXG4gICAgY29uc3Qge3N0ZGluLCB1c2VHaXRQcm9tcHRTZXJ2ZXIsIHVzZUdwZ1dyYXBwZXIsIHVzZUdwZ0F0b21Qcm9tcHQsIHdyaXRlT3BlcmF0aW9ufSA9IG9wdGlvbnM7XG4gICAgY29uc3QgY29tbWFuZE5hbWUgPSBhcmdzWzBdO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGNvbnN0IGRpYWdub3N0aWNzRW5hYmxlZCA9IHByb2Nlc3MuZW52LkFUT01fR0lUSFVCX0dJVF9ESUFHTk9TVElDUyB8fCBhdG9tLmNvbmZpZy5nZXQoJ2dpdGh1Yi5naXREaWFnbm9zdGljcycpO1xuXG4gICAgY29uc3QgZm9ybWF0dGVkQXJncyA9IGBnaXQgJHthcmdzLmpvaW4oJyAnKX0gaW4gJHt0aGlzLndvcmtpbmdEaXJ9YDtcbiAgICBjb25zdCB0aW1pbmdNYXJrZXIgPSBHaXRUaW1pbmdzVmlldy5nZW5lcmF0ZU1hcmtlcihgZ2l0ICR7YXJncy5qb2luKCcgJyl9YCk7XG4gICAgdGltaW5nTWFya2VyLm1hcmsoJ3F1ZXVlZCcpO1xuXG4gICAgYXJncy51bnNoaWZ0KC4uLkRJU0FCTEVfQ09MT1JfRkxBR1MpO1xuXG4gICAgaWYgKGV4ZWNQYXRoUHJvbWlzZSA9PT0gbnVsbCkge1xuICAgICAgLy8gQXR0ZW1wdCB0byBjb2xsZWN0IHRoZSAtLWV4ZWMtcGF0aCBmcm9tIGEgbmF0aXZlIGdpdCBpbnN0YWxsYXRpb24uXG4gICAgICBleGVjUGF0aFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgY2hpbGRQcm9jZXNzLmV4ZWMoJ2dpdCAtLWV4ZWMtcGF0aCcsIChlcnJvciwgc3Rkb3V0KSA9PiB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBPaCB3ZWxsXG4gICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoc3Rkb3V0LnRyaW0oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGV4ZWNQYXRoID0gYXdhaXQgZXhlY1BhdGhQcm9taXNlO1xuXG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goYXN5bmMgKCkgPT4ge1xuICAgICAgdGltaW5nTWFya2VyLm1hcmsoJ3ByZXBhcmUnKTtcbiAgICAgIGxldCBnaXRQcm9tcHRTZXJ2ZXI7XG5cbiAgICAgIGNvbnN0IHBhdGhQYXJ0cyA9IFtdO1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlBBVEgpIHtcbiAgICAgICAgcGF0aFBhcnRzLnB1c2gocHJvY2Vzcy5lbnYuUEFUSCk7XG4gICAgICB9XG4gICAgICBpZiAoZXhlY1BhdGgpIHtcbiAgICAgICAgcGF0aFBhcnRzLnB1c2goZXhlY1BhdGgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlbnYgPSB7XG4gICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICBHSVRfVEVSTUlOQUxfUFJPTVBUOiAnMCcsXG4gICAgICAgIEdJVF9PUFRJT05BTF9MT0NLUzogJzAnLFxuICAgICAgICBQQVRIOiBwYXRoUGFydHMuam9pbihwYXRoLmRlbGltaXRlciksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnaXRUZW1wRGlyID0gbmV3IEdpdFRlbXBEaXIoKTtcblxuICAgICAgaWYgKHVzZUdwZ1dyYXBwZXIpIHtcbiAgICAgICAgYXdhaXQgZ2l0VGVtcERpci5lbnN1cmUoKTtcbiAgICAgICAgYXJncy51bnNoaWZ0KCctYycsIGBncGcucHJvZ3JhbT0ke2dpdFRlbXBEaXIuZ2V0R3BnV3JhcHBlclNoKCl9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1c2VHaXRQcm9tcHRTZXJ2ZXIpIHtcbiAgICAgICAgZ2l0UHJvbXB0U2VydmVyID0gbmV3IEdpdFByb21wdFNlcnZlcihnaXRUZW1wRGlyKTtcbiAgICAgICAgYXdhaXQgZ2l0UHJvbXB0U2VydmVyLnN0YXJ0KHRoaXMucHJvbXB0KTtcblxuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfVE1QID0gZ2l0VGVtcERpci5nZXRSb290UGF0aCgpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfQVNLUEFTU19QQVRIID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldEFza1Bhc3NKcygpKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0NSRURFTlRJQUxfUEFUSCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRDcmVkZW50aWFsSGVscGVySnMoKSk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9FTEVDVFJPTl9QQVRIID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnZXRBdG9tSGVscGVyUGF0aCgpKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1NPQ0tfQUREUiA9IGdpdFByb21wdFNlcnZlci5nZXRBZGRyZXNzKCk7XG5cbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1dPUktESVJfUEFUSCA9IHRoaXMud29ya2luZ0RpcjtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0RVR0lURV9QQVRIID0gZ2V0RHVnaXRlUGF0aCgpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfS0VZVEFSX1NUUkFURUdZX1BBVEggPSBnZXRTaGFyZWRNb2R1bGVQYXRoKCdrZXl0YXItc3RyYXRlZ3knKTtcblxuICAgICAgICAvLyBcInNzaFwiIHdvbid0IHJlc3BlY3QgU1NIX0FTS1BBU1MgdW5sZXNzOlxuICAgICAgICAvLyAoYSkgaXQncyBydW5uaW5nIHdpdGhvdXQgYSB0dHlcbiAgICAgICAgLy8gKGIpIERJU1BMQVkgaXMgc2V0IHRvIHNvbWV0aGluZyBub25lbXB0eVxuICAgICAgICAvLyBCdXQsIG9uIGEgTWFjLCBESVNQTEFZIGlzIHVuc2V0LiBFbnN1cmUgdGhhdCBpdCBpcyBzbyBvdXIgU1NIX0FTS1BBU1MgaXMgcmVzcGVjdGVkLlxuICAgICAgICBpZiAoIXByb2Nlc3MuZW52LkRJU1BMQVkgfHwgcHJvY2Vzcy5lbnYuRElTUExBWS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBlbnYuRElTUExBWSA9ICdhdG9tLWdpdGh1Yi1wbGFjZWhvbGRlcic7XG4gICAgICAgIH1cblxuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfUEFUSCA9IHByb2Nlc3MuZW52LlBBVEggfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfQVNLUEFTUyA9IHByb2Nlc3MuZW52LkdJVF9BU0tQQVNTIHx8ICcnO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfU1NIX0FTS1BBU1MgPSBwcm9jZXNzLmVudi5TU0hfQVNLUEFTUyB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX0dJVF9TU0hfQ09NTUFORCA9IHByb2Nlc3MuZW52LkdJVF9TU0hfQ09NTUFORCB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1NQRUNfTU9ERSA9IGF0b20uaW5TcGVjTW9kZSgpID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgICAgICBlbnYuU1NIX0FTS1BBU1MgPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0QXNrUGFzc1NoKCkpO1xuICAgICAgICBlbnYuR0lUX0FTS1BBU1MgPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0QXNrUGFzc1NoKCkpO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnKSB7XG4gICAgICAgICAgZW52LkdJVF9TU0hfQ09NTUFORCA9IGdpdFRlbXBEaXIuZ2V0U3NoV3JhcHBlclNoKCk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuR0lUX1NTSF9DT01NQU5EKSB7XG4gICAgICAgICAgZW52LkdJVF9TU0hfQ09NTUFORCA9IHByb2Nlc3MuZW52LkdJVF9TU0hfQ09NTUFORDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnYuR0lUX1NTSCA9IHByb2Nlc3MuZW52LkdJVF9TU0g7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjcmVkZW50aWFsSGVscGVyU2ggPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0Q3JlZGVudGlhbEhlbHBlclNoKCkpO1xuICAgICAgICBhcmdzLnVuc2hpZnQoJy1jJywgYGNyZWRlbnRpYWwuaGVscGVyPSR7Y3JlZGVudGlhbEhlbHBlclNofWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodXNlR3BnV3JhcHBlciAmJiB1c2VHaXRQcm9tcHRTZXJ2ZXIgJiYgdXNlR3BnQXRvbVByb21wdCkge1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfR1BHX1BST01QVCA9ICd0cnVlJztcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZGlhZ25vc3RpY3NFbmFibGVkKSB7XG4gICAgICAgIGVudi5HSVRfVFJBQ0UgPSAndHJ1ZSc7XG4gICAgICAgIGVudi5HSVRfVFJBQ0VfQ1VSTCA9ICd0cnVlJztcbiAgICAgIH1cblxuICAgICAgbGV0IG9wdHMgPSB7ZW52fTtcblxuICAgICAgaWYgKHN0ZGluKSB7XG4gICAgICAgIG9wdHMuc3RkaW4gPSBzdGRpbjtcbiAgICAgICAgb3B0cy5zdGRpbkVuY29kaW5nID0gJ3V0ZjgnO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChwcm9jZXNzLmVudi5QUklOVF9HSVRfVElNRVMpIHtcbiAgICAgICAgY29uc29sZS50aW1lKGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVSdW4pIHtcbiAgICAgICAgICBjb25zdCBuZXdBcmdzT3B0cyA9IGF3YWl0IG9wdGlvbnMuYmVmb3JlUnVuKHthcmdzLCBvcHRzfSk7XG4gICAgICAgICAgYXJncyA9IG5ld0FyZ3NPcHRzLmFyZ3M7XG4gICAgICAgICAgb3B0cyA9IG5ld0FyZ3NPcHRzLm9wdHM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qge3Byb21pc2UsIGNhbmNlbH0gPSB0aGlzLmV4ZWN1dGVHaXRDb21tYW5kKGFyZ3MsIG9wdHMsIHRpbWluZ01hcmtlcik7XG4gICAgICAgIGxldCBleHBlY3RDYW5jZWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKGdpdFByb21wdFNlcnZlcikge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGdpdFByb21wdFNlcnZlci5vbkRpZENhbmNlbChhc3luYyAoe2hhbmRsZXJQaWR9KSA9PiB7XG4gICAgICAgICAgICBleHBlY3RDYW5jZWwgPSB0cnVlO1xuICAgICAgICAgICAgYXdhaXQgY2FuY2VsKCk7XG5cbiAgICAgICAgICAgIC8vIE9uIFdpbmRvd3MsIHRoZSBTU0hfQVNLUEFTUyBoYW5kbGVyIGlzIGV4ZWN1dGVkIGFzIGEgbm9uLWNoaWxkIHByb2Nlc3MsIHNvIHRoZSBiaW5cXGdpdC1hc2twYXNzLWF0b20uc2hcbiAgICAgICAgICAgIC8vIHByb2Nlc3MgZG9lcyBub3QgdGVybWluYXRlIHdoZW4gdGhlIGdpdCBwcm9jZXNzIGlzIGtpbGxlZC5cbiAgICAgICAgICAgIC8vIEtpbGwgdGhlIGhhbmRsZXIgcHJvY2VzcyAqYWZ0ZXIqIHRoZSBnaXQgcHJvY2VzcyBoYXMgYmVlbiBraWxsZWQgdG8gZW5zdXJlIHRoYXQgZ2l0IGRvZXNuJ3QgaGF2ZSBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gZmFsbCBiYWNrIHRvIEdJVF9BU0tQQVNTIGZyb20gdGhlIGNyZWRlbnRpYWwgaGFuZGxlci5cbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlS2lsbCwgcmVqZWN0S2lsbCkgPT4ge1xuICAgICAgICAgICAgICByZXF1aXJlKCd0cmVlLWtpbGwnKShoYW5kbGVyUGlkLCAnU0lHVEVSTScsIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikgeyByZWplY3RLaWxsKGVycik7IH0gZWxzZSB7IHJlc29sdmVLaWxsKCk7IH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7c3Rkb3V0LCBzdGRlcnIsIGV4aXRDb2RlLCBzaWduYWwsIHRpbWluZ30gPSBhd2FpdCBwcm9taXNlLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVyci5zaWduYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7c2lnbmFsOiBlcnIuc2lnbmFsfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGltaW5nKSB7XG4gICAgICAgICAgY29uc3Qge2V4ZWNUaW1lLCBzcGF3blRpbWUsIGlwY1RpbWV9ID0gdGltaW5nO1xuICAgICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgIHRpbWluZ01hcmtlci5tYXJrKCduZXh0dGljaycsIG5vdyAtIGV4ZWNUaW1lIC0gc3Bhd25UaW1lIC0gaXBjVGltZSk7XG4gICAgICAgICAgdGltaW5nTWFya2VyLm1hcmsoJ2V4ZWN1dGUnLCBub3cgLSBleGVjVGltZSAtIGlwY1RpbWUpO1xuICAgICAgICAgIHRpbWluZ01hcmtlci5tYXJrKCdpcGMnLCBub3cgLSBpcGNUaW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aW1pbmdNYXJrZXIuZmluYWxpemUoKTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LlBSSU5UX0dJVF9USU1FUykge1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZChgZ2l0OiR7Zm9ybWF0dGVkQXJnc31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnaXRQcm9tcHRTZXJ2ZXIpIHtcbiAgICAgICAgICBnaXRQcm9tcHRTZXJ2ZXIudGVybWluYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChkaWFnbm9zdGljc0VuYWJsZWQpIHtcbiAgICAgICAgICBjb25zdCBleHBvc2VDb250cm9sQ2hhcmFjdGVycyA9IHJhdyA9PiB7XG4gICAgICAgICAgICBpZiAoIXJhdykgeyByZXR1cm4gJyc7IH1cblxuICAgICAgICAgICAgcmV0dXJuIHJhd1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXFx1MDAwMC91ZywgJzxOVUw+XFxuJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTAwMUYvdWcsICc8U0VQPicpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoaGVhZGxlc3MpIHtcbiAgICAgICAgICAgIGxldCBzdW1tYXJ5ID0gYGdpdDoke2Zvcm1hdHRlZEFyZ3N9XFxuYDtcbiAgICAgICAgICAgIGlmIChleGl0Q29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYGV4aXQgc3RhdHVzOiAke2V4aXRDb2RlfVxcbmA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNpZ25hbCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBleGl0IHNpZ25hbDogJHtzaWduYWx9XFxuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGRpbiAmJiBzdGRpbi5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgc3RkaW46XFxuJHtleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRpbil9XFxuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1bW1hcnkgKz0gJ3N0ZG91dDonO1xuICAgICAgICAgICAgaWYgKHN0ZG91dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSAnIDxlbXB0eT5cXG4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgXFxuJHtleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRvdXQpfVxcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5ICs9ICdzdGRlcnI6JztcbiAgICAgICAgICAgIGlmIChzdGRlcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gJyA8ZW1wdHk+XFxuJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYFxcbiR7ZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkZXJyKX1cXG5gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdW1tYXJ5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyU3R5bGUgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiBibHVlOyc7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoYGdpdDoke2Zvcm1hdHRlZEFyZ3N9YCk7XG4gICAgICAgICAgICBpZiAoZXhpdENvZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWNleGl0IHN0YXR1cyVjICVkJywgaGVhZGVyU3R5bGUsICdmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogYmxhY2s7JywgZXhpdENvZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaWduYWwpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVjZXhpdCBzaWduYWwlYyAlcycsIGhlYWRlclN0eWxlLCAnZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6IGJsYWNrOycsIHNpZ25hbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgJyVjZnVsbCBhcmd1bWVudHMlYyAlcycsXG4gICAgICAgICAgICAgIGhlYWRlclN0eWxlLCAnZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6IGJsYWNrOycsXG4gICAgICAgICAgICAgIHV0aWwuaW5zcGVjdChhcmdzLCB7YnJlYWtMZW5ndGg6IEluZmluaXR5fSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHN0ZGluICYmIHN0ZGluLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWNzdGRpbicsIGhlYWRlclN0eWxlKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkaW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY3N0ZG91dCcsIGhlYWRlclN0eWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZG91dCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyVjc3RkZXJyJywgaGVhZGVyU3R5bGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkZXJyKSk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV4aXRDb2RlICE9PSAwICYmICFleHBlY3RDYW5jZWwpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgR2l0RXJyb3IoXG4gICAgICAgICAgICBgJHtmb3JtYXR0ZWRBcmdzfSBleGl0ZWQgd2l0aCBjb2RlICR7ZXhpdENvZGV9XFxuc3Rkb3V0OiAke3N0ZG91dH1cXG5zdGRlcnI6ICR7c3RkZXJyfWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBlcnIuY29kZSA9IGV4aXRDb2RlO1xuICAgICAgICAgIGVyci5zdGRFcnIgPSBzdGRlcnI7XG4gICAgICAgICAgZXJyLnN0ZE91dCA9IHN0ZG91dDtcbiAgICAgICAgICBlcnIuY29tbWFuZCA9IGZvcm1hdHRlZEFyZ3M7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUlHTk9SRURfR0lUX0NPTU1BTkRTLmluY2x1ZGVzKGNvbW1hbmROYW1lKSkge1xuICAgICAgICAgIGluY3JlbWVudENvdW50ZXIoY29tbWFuZE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoc3Rkb3V0KTtcbiAgICAgIH0pO1xuICAgIH0sIHtwYXJhbGxlbDogIXdyaXRlT3BlcmF0aW9ufSk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlLG5vLWNvbnRyb2wtcmVnZXggKi9cbiAgfVxuXG4gIGFzeW5jIGdwZ0V4ZWMoYXJncywgb3B0aW9ucykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjKGFyZ3Muc2xpY2UoKSwge1xuICAgICAgICB1c2VHcGdXcmFwcGVyOiB0cnVlLFxuICAgICAgICB1c2VHcGdBdG9tUHJvbXB0OiBmYWxzZSxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICgvZ3BnIGZhaWxlZC8udGVzdChlLnN0ZEVycikpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlYyhhcmdzLCB7XG4gICAgICAgICAgdXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLFxuICAgICAgICAgIHVzZUdwZ1dyYXBwZXI6IHRydWUsXG4gICAgICAgICAgdXNlR3BnQXRvbVByb21wdDogdHJ1ZSxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUdpdENvbW1hbmQoYXJncywgb3B0aW9ucywgbWFya2VyID0gbnVsbCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5BVE9NX0dJVEhVQl9JTkxJTkVfR0lUX0VYRUMgfHwgIVdvcmtlck1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5pc1JlYWR5KCkpIHtcbiAgICAgIG1hcmtlciAmJiBtYXJrZXIubWFyaygnbmV4dHRpY2snKTtcblxuICAgICAgbGV0IGNoaWxkUGlkO1xuICAgICAgb3B0aW9ucy5wcm9jZXNzQ2FsbGJhY2sgPSBjaGlsZCA9PiB7XG4gICAgICAgIGNoaWxkUGlkID0gY2hpbGQucGlkO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGNoaWxkLnN0ZGluLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEVycm9yIHdyaXRpbmcgdG8gc3RkaW46IGdpdCAke2FyZ3Muam9pbignICcpfSBpbiAke3RoaXMud29ya2luZ0Rpcn1cXG4ke29wdGlvbnMuc3RkaW59XFxuJHtlcnJ9YCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IEdpdFByb2Nlc3MuZXhlYyhhcmdzLCB0aGlzLndvcmtpbmdEaXIsIG9wdGlvbnMpO1xuICAgICAgbWFya2VyICYmIG1hcmtlci5tYXJrKCdleGVjdXRlJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlLFxuICAgICAgICBjYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoIWNoaWxkUGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlcXVpcmUoJ3RyZWUta2lsbCcpKGNoaWxkUGlkLCAnU0lHVEVSTScsIGVyciA9PiB7XG4gICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7IHJlamVjdChlcnIpOyB9IGVsc2UgeyByZXNvbHZlKCk7IH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgd29ya2VyTWFuYWdlciA9IHRoaXMud29ya2VyTWFuYWdlciB8fCBXb3JrZXJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgICByZXR1cm4gd29ya2VyTWFuYWdlci5yZXF1ZXN0KHtcbiAgICAgICAgYXJncyxcbiAgICAgICAgd29ya2luZ0RpcjogdGhpcy53b3JraW5nRGlyLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVzb2x2ZURvdEdpdERpcigpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZnMuc3RhdCh0aGlzLndvcmtpbmdEaXIpOyAvLyBmYWlscyBpZiBmb2xkZXIgZG9lc24ndCBleGlzdFxuICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsncmV2LXBhcnNlJywgJy0tcmVzb2x2ZS1naXQtZGlyJywgcGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgJy5naXQnKV0pO1xuICAgICAgY29uc3QgZG90R2l0RGlyID0gb3V0cHV0LnRyaW0oKTtcbiAgICAgIHJldHVybiB0b05hdGl2ZVBhdGhTZXAoZG90R2l0RGlyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydpbml0JywgdGhpcy53b3JraW5nRGlyXSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhZ2luZy9VbnN0YWdpbmcgZmlsZXMgYW5kIHBhdGNoZXMgYW5kIGNvbW1pdHRpbmdcbiAgICovXG4gIHN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7IH1cbiAgICBjb25zdCBhcmdzID0gWydhZGQnXS5jb25jYXQocGF0aHMubWFwKHRvR2l0UGF0aFNlcCkpO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpIHtcbiAgICBsZXQgdGVtcGxhdGVQYXRoID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2NvbW1pdC50ZW1wbGF0ZScpO1xuICAgIGlmICghdGVtcGxhdGVQYXRoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBob21lRGlyID0gb3MuaG9tZWRpcigpO1xuXG4gICAgdGVtcGxhdGVQYXRoID0gdGVtcGxhdGVQYXRoLnRyaW0oKS5yZXBsYWNlKEVYUEFORF9USUxERV9SRUdFWCwgKF8sIHVzZXIpID0+IHtcbiAgICAgIC8vIGlmIG5vIHVzZXIgaXMgc3BlY2lmaWVkLCBmYWxsIGJhY2sgdG8gdXNpbmcgdGhlIGhvbWUgZGlyZWN0b3J5LlxuICAgICAgcmV0dXJuIGAke3VzZXIgPyBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGhvbWVEaXIpLCB1c2VyKSA6IGhvbWVEaXJ9L2A7XG4gICAgfSk7XG4gICAgdGVtcGxhdGVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHRlbXBsYXRlUGF0aCk7XG5cbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZSh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgICB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCB0ZW1wbGF0ZVBhdGgpO1xuICAgIH1cblxuICAgIGlmICghYXdhaXQgZmlsZUV4aXN0cyh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29tbWl0IHRlbXBsYXRlIHBhdGggc2V0IGluIEdpdCBjb25maWc6ICR7dGVtcGxhdGVQYXRofWApO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZnMucmVhZEZpbGUodGVtcGxhdGVQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICB9XG5cbiAgdW5zdGFnZUZpbGVzKHBhdGhzLCBjb21taXQgPSAnSEVBRCcpIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7IH1cbiAgICBjb25zdCBhcmdzID0gWydyZXNldCcsIGNvbW1pdCwgJy0tJ10uY29uY2F0KHBhdGhzLm1hcCh0b0dpdFBhdGhTZXApKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgc3RhZ2VGaWxlTW9kZUNoYW5nZShmaWxlbmFtZSwgbmV3TW9kZSkge1xuICAgIGNvbnN0IGluZGV4UmVhZFByb21pc2UgPSB0aGlzLmV4ZWMoWydscy1maWxlcycsICctcycsICctLScsIGZpbGVuYW1lXSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3VwZGF0ZS1pbmRleCcsICctLWNhY2hlaW5mbycsIGAke25ld01vZGV9LDxPSURfVEJEPiwke2ZpbGVuYW1lfWBdLCB7XG4gICAgICB3cml0ZU9wZXJhdGlvbjogdHJ1ZSxcbiAgICAgIGJlZm9yZVJ1bjogYXN5bmMgZnVuY3Rpb24gZGV0ZXJtaW5lQXJncyh7YXJncywgb3B0c30pIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBhd2FpdCBpbmRleFJlYWRQcm9taXNlO1xuICAgICAgICBjb25zdCBvaWQgPSBpbmRleC5zdWJzdHIoNywgNDApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9wdHMsXG4gICAgICAgICAgYXJnczogWyd1cGRhdGUtaW5kZXgnLCAnLS1jYWNoZWluZm8nLCBgJHtuZXdNb2RlfSwke29pZH0sJHtmaWxlbmFtZX1gXSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBzdGFnZUZpbGVTeW1saW5rQ2hhbmdlKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3JtJywgJy0tY2FjaGVkJywgZmlsZW5hbWVdLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2gocGF0Y2gsIHtpbmRleH0gPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2FwcGx5JywgJy0nXTtcbiAgICBpZiAoaW5kZXgpIHsgYXJncy5zcGxpY2UoMSwgMCwgJy0tY2FjaGVkJyk7IH1cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHtzdGRpbjogcGF0Y2gsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBjb21taXQocmF3TWVzc2FnZSwge2FsbG93RW1wdHksIGFtZW5kLCBjb0F1dGhvcnMsIHZlcmJhdGltfSA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnY29tbWl0J107XG4gICAgbGV0IG1zZztcblxuICAgIC8vIGlmIGFtZW5kaW5nIGFuZCBubyBuZXcgbWVzc2FnZSBpcyBwYXNzZWQsIHVzZSBsYXN0IGNvbW1pdCdzIG1lc3NhZ2UuIEVuc3VyZSB0aGF0IHdlIGRvbid0XG4gICAgLy8gbWFuZ2xlIGl0IGluIHRoZSBwcm9jZXNzLlxuICAgIGlmIChhbWVuZCAmJiByYXdNZXNzYWdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3Qge3VuYm9yblJlZiwgbWVzc2FnZUJvZHksIG1lc3NhZ2VTdWJqZWN0fSA9IGF3YWl0IHRoaXMuZ2V0SGVhZENvbW1pdCgpO1xuICAgICAgaWYgKHVuYm9yblJlZikge1xuICAgICAgICBtc2cgPSByYXdNZXNzYWdlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbXNnID0gYCR7bWVzc2FnZVN1YmplY3R9XFxuXFxuJHttZXNzYWdlQm9keX1gLnRyaW0oKTtcbiAgICAgICAgdmVyYmF0aW0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtc2cgPSByYXdNZXNzYWdlO1xuICAgIH1cblxuICAgIC8vIGlmIGNvbW1pdCB0ZW1wbGF0ZSBpcyB1c2VkLCBzdHJpcCBjb21tZW50ZWQgbGluZXMgZnJvbSBjb21taXRcbiAgICAvLyB0byBiZSBjb25zaXN0ZW50IHdpdGggY29tbWFuZCBsaW5lIGdpdC5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgICBpZiAodGVtcGxhdGUpIHtcblxuICAgICAgLy8gcmVzcGVjdGluZyB0aGUgY29tbWVudCBjaGFyYWN0ZXIgZnJvbSB1c2VyIHNldHRpbmdzIG9yIGZhbGwgYmFjayB0byAjIGFzIGRlZmF1bHQuXG4gICAgICAvLyBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWNvbmZpZyNnaXQtY29uZmlnLWNvcmVjb21tZW50Q2hhclxuICAgICAgbGV0IGNvbW1lbnRDaGFyID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2NvcmUuY29tbWVudENoYXInKTtcbiAgICAgIGlmICghY29tbWVudENoYXIpIHtcbiAgICAgICAgY29tbWVudENoYXIgPSAnIyc7XG4gICAgICB9XG4gICAgICBtc2cgPSBtc2cuc3BsaXQoJ1xcbicpLmZpbHRlcihsaW5lID0+ICFsaW5lLnN0YXJ0c1dpdGgoY29tbWVudENoYXIpKS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNsZWFudXAgbW9kZS5cbiAgICBpZiAodmVyYmF0aW0pIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1jbGVhbnVwPXZlcmJhdGltJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbmZpZ3VyZWQgPSBhd2FpdCB0aGlzLmdldENvbmZpZygnY29tbWl0LmNsZWFudXAnKTtcbiAgICAgIGNvbnN0IG1vZGUgPSAoY29uZmlndXJlZCAmJiBjb25maWd1cmVkICE9PSAnZGVmYXVsdCcpID8gY29uZmlndXJlZCA6ICdzdHJpcCc7XG4gICAgICBhcmdzLnB1c2goYC0tY2xlYW51cD0ke21vZGV9YCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNvLWF1dGhvciBjb21taXQgdHJhaWxlcnMgaWYgbmVjZXNzYXJ5XG4gICAgaWYgKGNvQXV0aG9ycyAmJiBjb0F1dGhvcnMubGVuZ3RoID4gMCkge1xuICAgICAgbXNnID0gYXdhaXQgdGhpcy5hZGRDb0F1dGhvcnNUb01lc3NhZ2UobXNnLCBjb0F1dGhvcnMpO1xuICAgIH1cblxuICAgIGFyZ3MucHVzaCgnLW0nLCBtc2cudHJpbSgpKTtcblxuICAgIGlmIChhbWVuZCkgeyBhcmdzLnB1c2goJy0tYW1lbmQnKTsgfVxuICAgIGlmIChhbGxvd0VtcHR5KSB7IGFyZ3MucHVzaCgnLS1hbGxvdy1lbXB0eScpOyB9XG4gICAgcmV0dXJuIHRoaXMuZ3BnRXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFkZENvQXV0aG9yc1RvTWVzc2FnZShtZXNzYWdlLCBjb0F1dGhvcnMgPSBbXSkge1xuICAgIGNvbnN0IHRyYWlsZXJzID0gY29BdXRob3JzLm1hcChhdXRob3IgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9rZW46ICdDby1BdXRob3JlZC1CeScsXG4gICAgICAgIHZhbHVlOiBgJHthdXRob3IubmFtZX0gPCR7YXV0aG9yLmVtYWlsfT5gLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IG1lc3NhZ2UgZW5kcyB3aXRoIG5ld2xpbmUgZm9yIGdpdC1pbnRlcnByZXQgdHJhaWxlcnMgdG8gd29ya1xuICAgIGNvbnN0IG1zZyA9IGAke21lc3NhZ2UudHJpbSgpfVxcbmA7XG5cbiAgICByZXR1cm4gdHJhaWxlcnMubGVuZ3RoID8gdGhpcy5tZXJnZVRyYWlsZXJzKG1zZywgdHJhaWxlcnMpIDogbXNnO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbGUgU3RhdHVzIGFuZCBEaWZmc1xuICAgKi9cbiAgYXN5bmMgZ2V0U3RhdHVzQnVuZGxlKCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ3N0YXR1cycsICctLXBvcmNlbGFpbj12MicsICctLWJyYW5jaCcsICctLXVudHJhY2tlZC1maWxlcz1hbGwnLCAnLS1pZ25vcmUtc3VibW9kdWxlcz1kaXJ0eScsICcteiddO1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcbiAgICBpZiAob3V0cHV0Lmxlbmd0aCA+IE1BWF9TVEFUVVNfT1VUUFVUX0xFTkdUSCkge1xuICAgICAgdGhyb3cgbmV3IExhcmdlUmVwb0Vycm9yKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHBhcnNlU3RhdHVzKG91dHB1dCk7XG5cbiAgICBmb3IgKGNvbnN0IGVudHJ5VHlwZSBpbiByZXN1bHRzKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHRzW2VudHJ5VHlwZV0pKSB7XG4gICAgICAgIHRoaXMudXBkYXRlTmF0aXZlUGF0aFNlcEZvckVudHJpZXMocmVzdWx0c1tlbnRyeVR5cGVdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHVwZGF0ZU5hdGl2ZVBhdGhTZXBGb3JFbnRyaWVzKGVudHJpZXMpIHtcbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgLy8gTm9ybWFsbHkgd2Ugd291bGQgYXZvaWQgbXV0YXRpbmcgcmVzcG9uc2VzIGZyb20gb3RoZXIgcGFja2FnZSdzIEFQSXMsIGJ1dCB3ZSBjb250cm9sXG4gICAgICAvLyB0aGUgYHdoYXQtdGhlLXN0YXR1c2AgbW9kdWxlIGFuZCBrbm93IHRoZXJlIGFyZSBubyBzaWRlIGVmZmVjdHMuXG4gICAgICAvLyBUaGlzIGlzIGEgaG90IGNvZGUgcGF0aCBhbmQgYnkgbXV0YXRpbmcgd2UgYXZvaWQgY3JlYXRpbmcgbmV3IG9iamVjdHMgdGhhdCB3aWxsIGp1c3QgYmUgR0MnZWRcbiAgICAgIGlmIChlbnRyeS5maWxlUGF0aCkge1xuICAgICAgICBlbnRyeS5maWxlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChlbnRyeS5maWxlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkub3JpZ0ZpbGVQYXRoKSB7XG4gICAgICAgIGVudHJ5Lm9yaWdGaWxlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChlbnRyeS5vcmlnRmlsZVBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGlmZkZpbGVTdGF0dXMob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnZGlmZicsICctLW5hbWUtc3RhdHVzJywgJy0tbm8tcmVuYW1lcyddO1xuICAgIGlmIChvcHRpb25zLnN0YWdlZCkgeyBhcmdzLnB1c2goJy0tc3RhZ2VkJyk7IH1cbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHsgYXJncy5wdXNoKG9wdGlvbnMudGFyZ2V0KTsgfVxuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcblxuICAgIGNvbnN0IHN0YXR1c01hcCA9IHtcbiAgICAgIEE6ICdhZGRlZCcsXG4gICAgICBNOiAnbW9kaWZpZWQnLFxuICAgICAgRDogJ2RlbGV0ZWQnLFxuICAgICAgVTogJ3VubWVyZ2VkJyxcbiAgICB9O1xuXG4gICAgY29uc3QgZmlsZVN0YXR1c2VzID0ge307XG4gICAgb3V0cHV0ICYmIG91dHB1dC50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBbc3RhdHVzLCByYXdGaWxlUGF0aF0gPSBsaW5lLnNwbGl0KCdcXHQnKTtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJhd0ZpbGVQYXRoKTtcbiAgICAgIGZpbGVTdGF0dXNlc1tmaWxlUGF0aF0gPSBzdGF0dXNNYXBbc3RhdHVzXTtcbiAgICB9KTtcbiAgICBpZiAoIW9wdGlvbnMuc3RhZ2VkKSB7XG4gICAgICBjb25zdCB1bnRyYWNrZWQgPSBhd2FpdCB0aGlzLmdldFVudHJhY2tlZEZpbGVzKCk7XG4gICAgICB1bnRyYWNrZWQuZm9yRWFjaChmaWxlUGF0aCA9PiB7IGZpbGVTdGF0dXNlc1tmaWxlUGF0aF0gPSAnYWRkZWQnOyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVTdGF0dXNlcztcbiAgfVxuXG4gIGFzeW5jIGdldFVudHJhY2tlZEZpbGVzKCkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2xzLWZpbGVzJywgJy0tb3RoZXJzJywgJy0tZXhjbHVkZS1zdGFuZGFyZCddKTtcbiAgICBpZiAob3V0cHV0LnRyaW0oKSA9PT0gJycpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIG91dHB1dC50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLm1hcCh0b05hdGl2ZVBhdGhTZXApO1xuICB9XG5cbiAgYXN5bmMgZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwge3N0YWdlZCwgYmFzZUNvbW1pdH0gPSB7fSkge1xuICAgIGxldCBhcmdzID0gWydkaWZmJywgJy0tbm8tcHJlZml4JywgJy0tbm8tZXh0LWRpZmYnLCAnLS1uby1yZW5hbWVzJywgJy0tZGlmZi1maWx0ZXI9dSddO1xuICAgIGlmIChzdGFnZWQpIHsgYXJncy5wdXNoKCctLXN0YWdlZCcpOyB9XG4gICAgaWYgKGJhc2VDb21taXQpIHsgYXJncy5wdXNoKGJhc2VDb21taXQpOyB9XG4gICAgYXJncyA9IGFyZ3MuY29uY2F0KFsnLS0nLCB0b0dpdFBhdGhTZXAoZmlsZVBhdGgpXSk7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuXG4gICAgbGV0IHJhd0RpZmZzID0gW107XG4gICAgaWYgKG91dHB1dCkge1xuICAgICAgcmF3RGlmZnMgPSBwYXJzZURpZmYob3V0cHV0KVxuICAgICAgICAuZmlsdGVyKHJhd0RpZmYgPT4gcmF3RGlmZi5zdGF0dXMgIT09ICd1bm1lcmdlZCcpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhd0RpZmZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJhd0RpZmYgPSByYXdEaWZmc1tpXTtcbiAgICAgICAgaWYgKHJhd0RpZmYub2xkUGF0aCkge1xuICAgICAgICAgIHJhd0RpZmYub2xkUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyYXdEaWZmLm9sZFBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyYXdEaWZmLm5ld1BhdGgpIHtcbiAgICAgICAgICByYXdEaWZmLm5ld1BhdGggPSB0b05hdGl2ZVBhdGhTZXAocmF3RGlmZi5uZXdQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc3RhZ2VkICYmIChhd2FpdCB0aGlzLmdldFVudHJhY2tlZEZpbGVzKCkpLmluY2x1ZGVzKGZpbGVQYXRoKSkge1xuICAgICAgLy8gYWRkIHVudHJhY2tlZCBmaWxlXG4gICAgICBjb25zdCBhYnNQYXRoID0gcGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgZmlsZVBhdGgpO1xuICAgICAgY29uc3QgZXhlY3V0YWJsZSA9IGF3YWl0IGlzRmlsZUV4ZWN1dGFibGUoYWJzUGF0aCk7XG4gICAgICBjb25zdCBzeW1saW5rID0gYXdhaXQgaXNGaWxlU3ltbGluayhhYnNQYXRoKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUoYWJzUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIGNvbnN0IGJpbmFyeSA9IGlzQmluYXJ5KGNvbnRlbnRzKTtcbiAgICAgIGxldCBtb2RlO1xuICAgICAgbGV0IHJlYWxwYXRoO1xuICAgICAgaWYgKGV4ZWN1dGFibGUpIHtcbiAgICAgICAgbW9kZSA9IEZpbGUubW9kZXMuRVhFQ1VUQUJMRTtcbiAgICAgIH0gZWxzZSBpZiAoc3ltbGluaykge1xuICAgICAgICBtb2RlID0gRmlsZS5tb2Rlcy5TWU1MSU5LO1xuICAgICAgICByZWFscGF0aCA9IGF3YWl0IGZzLnJlYWxwYXRoKGFic1BhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9kZSA9IEZpbGUubW9kZXMuTk9STUFMO1xuICAgICAgfVxuXG4gICAgICByYXdEaWZmcy5wdXNoKGJ1aWxkQWRkZWRGaWxlUGF0Y2goZmlsZVBhdGgsIGJpbmFyeSA/IG51bGwgOiBjb250ZW50cywgbW9kZSwgcmVhbHBhdGgpKTtcbiAgICB9XG4gICAgaWYgKHJhd0RpZmZzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYmV0d2VlbiAwIGFuZCAyIGRpZmZzIGZvciAke2ZpbGVQYXRofSBidXQgZ290ICR7cmF3RGlmZnMubGVuZ3RofWApO1xuICAgIH1cbiAgICByZXR1cm4gcmF3RGlmZnM7XG4gIH1cblxuICBhc3luYyBnZXRTdGFnZWRDaGFuZ2VzUGF0Y2goKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFtcbiAgICAgICdkaWZmJywgJy0tc3RhZ2VkJywgJy0tbm8tcHJlZml4JywgJy0tbm8tZXh0LWRpZmYnLCAnLS1uby1yZW5hbWVzJywgJy0tZGlmZi1maWx0ZXI9dScsXG4gICAgXSk7XG5cbiAgICBpZiAoIW91dHB1dCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmZzID0gcGFyc2VEaWZmKG91dHB1dCk7XG4gICAgZm9yIChjb25zdCBkaWZmIG9mIGRpZmZzKSB7XG4gICAgICBpZiAoZGlmZi5vbGRQYXRoKSB7IGRpZmYub2xkUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChkaWZmLm9sZFBhdGgpOyB9XG4gICAgICBpZiAoZGlmZi5uZXdQYXRoKSB7IGRpZmYubmV3UGF0aCA9IHRvTmF0aXZlUGF0aFNlcChkaWZmLm5ld1BhdGgpOyB9XG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNaXNjZWxsYW5lb3VzIGdldHRlcnNcbiAgICovXG4gIGFzeW5jIGdldENvbW1pdChyZWYpIHtcbiAgICBjb25zdCBbY29tbWl0XSA9IGF3YWl0IHRoaXMuZ2V0Q29tbWl0cyh7bWF4OiAxLCByZWYsIGluY2x1ZGVVbmJvcm46IHRydWV9KTtcbiAgICByZXR1cm4gY29tbWl0O1xuICB9XG5cbiAgYXN5bmMgZ2V0SGVhZENvbW1pdCgpIHtcbiAgICBjb25zdCBbaGVhZENvbW1pdF0gPSBhd2FpdCB0aGlzLmdldENvbW1pdHMoe21heDogMSwgcmVmOiAnSEVBRCcsIGluY2x1ZGVVbmJvcm46IHRydWV9KTtcbiAgICByZXR1cm4gaGVhZENvbW1pdDtcbiAgfVxuXG4gIGFzeW5jIGdldENvbW1pdHMob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qge21heCwgcmVmLCBpbmNsdWRlVW5ib3JuLCBpbmNsdWRlUGF0Y2h9ID0ge1xuICAgICAgbWF4OiAxLFxuICAgICAgcmVmOiAnSEVBRCcsXG4gICAgICBpbmNsdWRlVW5ib3JuOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVQYXRjaDogZmFsc2UsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICAvLyBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWxvZyNfcHJldHR5X2Zvcm1hdHNcbiAgICAvLyAleDAwIC0gbnVsbCBieXRlXG4gICAgLy8gJUggLSBjb21taXQgU0hBXG4gICAgLy8gJWFlIC0gYXV0aG9yIGVtYWlsXG4gICAgLy8gJWFuID0gYXV0aG9yIGZ1bGwgbmFtZVxuICAgIC8vICVhdCAtIHRpbWVzdGFtcCwgVU5JWCB0aW1lc3RhbXBcbiAgICAvLyAlcyAtIHN1YmplY3RcbiAgICAvLyAlYiAtIGJvZHlcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJ2xvZycsXG4gICAgICAnLS1wcmV0dHk9Zm9ybWF0OiVIJXgwMCVhZSV4MDAlYW4leDAwJWF0JXgwMCVzJXgwMCViJXgwMCcsXG4gICAgICAnLS1uby1hYmJyZXYtY29tbWl0JyxcbiAgICAgICctLW5vLXByZWZpeCcsXG4gICAgICAnLS1uby1leHQtZGlmZicsXG4gICAgICAnLS1uby1yZW5hbWVzJyxcbiAgICAgICcteicsXG4gICAgICAnLW4nLFxuICAgICAgbWF4LFxuICAgICAgcmVmLFxuICAgIF07XG5cbiAgICBpZiAoaW5jbHVkZVBhdGNoKSB7XG4gICAgICBhcmdzLnB1c2goJy0tcGF0Y2gnLCAnLW0nLCAnLS1maXJzdC1wYXJlbnQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncy5jb25jYXQoJy0tJykpLmNhdGNoKGVyciA9PiB7XG4gICAgICBpZiAoL3Vua25vd24gcmV2aXNpb24vLnRlc3QoZXJyLnN0ZEVycikgfHwgL2JhZCByZXZpc2lvbiAnSEVBRCcvLnRlc3QoZXJyLnN0ZEVycikpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG91dHB1dCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBpbmNsdWRlVW5ib3JuID8gW3tzaGE6ICcnLCBtZXNzYWdlOiAnJywgdW5ib3JuUmVmOiB0cnVlfV0gOiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWVsZHMgPSBvdXRwdXQudHJpbSgpLnNwbGl0KCdcXDAnKTtcblxuICAgIGNvbnN0IGNvbW1pdHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkgKz0gNykge1xuICAgICAgY29uc3QgYm9keSA9IGZpZWxkc1tpICsgNV0udHJpbSgpO1xuICAgICAgbGV0IHBhdGNoID0gW107XG4gICAgICBpZiAoaW5jbHVkZVBhdGNoKSB7XG4gICAgICAgIGNvbnN0IGRpZmZzID0gZmllbGRzW2kgKyA2XTtcbiAgICAgICAgcGF0Y2ggPSBwYXJzZURpZmYoZGlmZnMudHJpbSgpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge21lc3NhZ2U6IG1lc3NhZ2VCb2R5LCBjb0F1dGhvcnN9ID0gZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UoYm9keSk7XG5cbiAgICAgIGNvbW1pdHMucHVzaCh7XG4gICAgICAgIHNoYTogZmllbGRzW2ldICYmIGZpZWxkc1tpXS50cmltKCksXG4gICAgICAgIGF1dGhvcjogbmV3IEF1dGhvcihmaWVsZHNbaSArIDFdICYmIGZpZWxkc1tpICsgMV0udHJpbSgpLCBmaWVsZHNbaSArIDJdICYmIGZpZWxkc1tpICsgMl0udHJpbSgpKSxcbiAgICAgICAgYXV0aG9yRGF0ZTogcGFyc2VJbnQoZmllbGRzW2kgKyAzXSwgMTApLFxuICAgICAgICBtZXNzYWdlU3ViamVjdDogZmllbGRzW2kgKyA0XSxcbiAgICAgICAgbWVzc2FnZUJvZHksXG4gICAgICAgIGNvQXV0aG9ycyxcbiAgICAgICAgdW5ib3JuUmVmOiBmYWxzZSxcbiAgICAgICAgcGF0Y2gsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1pdHM7XG4gIH1cblxuICBhc3luYyBnZXRBdXRob3JzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHttYXgsIHJlZn0gPSB7bWF4OiAxLCByZWY6ICdIRUFEJywgLi4ub3B0aW9uc307XG5cbiAgICAvLyBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWxvZyNfcHJldHR5X2Zvcm1hdHNcbiAgICAvLyAleDFGIC0gZmllbGQgc2VwYXJhdG9yIGJ5dGVcbiAgICAvLyAlYW4gLSBhdXRob3IgbmFtZVxuICAgIC8vICVhZSAtIGF1dGhvciBlbWFpbFxuICAgIC8vICVjbiAtIGNvbW1pdHRlciBuYW1lXG4gICAgLy8gJWNlIC0gY29tbWl0dGVyIGVtYWlsXG4gICAgLy8gJSh0cmFpbGVyczp1bmZvbGQsb25seSkgLSB0aGUgY29tbWl0IG1lc3NhZ2UgdHJhaWxlcnMsIHNlcGFyYXRlZFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgbmV3bGluZXMgYW5kIHVuZm9sZGVkIChpLmUuIHByb3Blcmx5XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgYW5kIG9uZSB0cmFpbGVyIHBlciBsaW5lKS5cblxuICAgIGNvbnN0IGRlbGltaXRlciA9ICcxRic7XG4gICAgY29uc3QgZGVsaW1pdGVyU3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChkZWxpbWl0ZXIsIDE2KSk7XG4gICAgY29uc3QgZmllbGRzID0gWyclYW4nLCAnJWFlJywgJyVjbicsICclY2UnLCAnJSh0cmFpbGVyczp1bmZvbGQsb25seSknXTtcbiAgICBjb25zdCBmb3JtYXQgPSBmaWVsZHMuam9pbihgJXgke2RlbGltaXRlcn1gKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoW1xuICAgICAgICAnbG9nJywgYC0tZm9ybWF0PSR7Zm9ybWF0fWAsICcteicsICctbicsIG1heCwgcmVmLCAnLS0nLFxuICAgICAgXSk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQuc3BsaXQoJ1xcMCcpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgbGluZSkgPT4ge1xuICAgICAgICAgIGlmIChsaW5lLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICAgICAgICBjb25zdCBbYW4sIGFlLCBjbiwgY2UsIHRyYWlsZXJzXSA9IGxpbmUuc3BsaXQoZGVsaW1pdGVyU3RyaW5nKTtcbiAgICAgICAgICB0cmFpbGVyc1xuICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgLm1hcCh0cmFpbGVyID0+IHRyYWlsZXIubWF0Y2goQ09fQVVUSE9SX1JFR0VYKSlcbiAgICAgICAgICAgIC5maWx0ZXIobWF0Y2ggPT4gbWF0Y2ggIT09IG51bGwpXG4gICAgICAgICAgICAuZm9yRWFjaCgoW18sIG5hbWUsIGVtYWlsXSkgPT4geyBhY2NbZW1haWxdID0gbmFtZTsgfSk7XG5cbiAgICAgICAgICBhY2NbYWVdID0gYW47XG4gICAgICAgICAgYWNjW2NlXSA9IGNuO1xuXG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKC91bmtub3duIHJldmlzaW9uLy50ZXN0KGVyci5zdGRFcnIpIHx8IC9iYWQgcmV2aXNpb24gJ0hFQUQnLy50ZXN0KGVyci5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtZXJnZVRyYWlsZXJzKGNvbW1pdE1lc3NhZ2UsIHRyYWlsZXJzKSB7XG4gICAgY29uc3QgYXJncyA9IFsnaW50ZXJwcmV0LXRyYWlsZXJzJ107XG4gICAgZm9yIChjb25zdCB0cmFpbGVyIG9mIHRyYWlsZXJzKSB7XG4gICAgICBhcmdzLnB1c2goJy0tdHJhaWxlcicsIGAke3RyYWlsZXIudG9rZW59PSR7dHJhaWxlci52YWx1ZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7c3RkaW46IGNvbW1pdE1lc3NhZ2V9KTtcbiAgfVxuXG4gIHJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3Nob3cnLCBgOiR7dG9HaXRQYXRoU2VwKGZpbGVQYXRoKX1gXSk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VcbiAgICovXG4gIG1lcmdlKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5ncGdFeGVjKFsnbWVyZ2UnLCBicmFuY2hOYW1lXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBpc01lcmdpbmcoZG90R2l0RGlyKSB7XG4gICAgcmV0dXJuIGZpbGVFeGlzdHMocGF0aC5qb2luKGRvdEdpdERpciwgJ01FUkdFX0hFQUQnKSkuY2F0Y2goKCkgPT4gZmFsc2UpO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnbWVyZ2UnLCAnLS1hYm9ydCddLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGNoZWNrb3V0U2lkZShzaWRlLCBwYXRocykge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leGVjKFsnY2hlY2tvdXQnLCBgLS0ke3NpZGV9YCwgLi4ucGF0aHMubWFwKHRvR2l0UGF0aFNlcCldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWJhc2VcbiAgICovXG4gIGFzeW5jIGlzUmViYXNpbmcoZG90R2l0RGlyKSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGZpbGVFeGlzdHMocGF0aC5qb2luKGRvdEdpdERpciwgJ3JlYmFzZS1tZXJnZScpKSxcbiAgICAgIGZpbGVFeGlzdHMocGF0aC5qb2luKGRvdEdpdERpciwgJ3JlYmFzZS1hcHBseScpKSxcbiAgICBdKTtcbiAgICByZXR1cm4gcmVzdWx0cy5zb21lKHIgPT4gcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3RlIGludGVyYWN0aW9uc1xuICAgKi9cbiAgY2xvbmUocmVtb3RlVXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydjbG9uZSddO1xuICAgIGlmIChvcHRpb25zLm5vTG9jYWwpIHsgYXJncy5wdXNoKCctLW5vLWxvY2FsJyk7IH1cbiAgICBpZiAob3B0aW9ucy5iYXJlKSB7IGFyZ3MucHVzaCgnLS1iYXJlJyk7IH1cbiAgICBpZiAob3B0aW9ucy5yZWN1cnNpdmUpIHsgYXJncy5wdXNoKCctLXJlY3Vyc2l2ZScpOyB9XG4gICAgaWYgKG9wdGlvbnMuc291cmNlUmVtb3RlTmFtZSkgeyBhcmdzLnB1c2goJy0tb3JpZ2luJywgb3B0aW9ucy5yZW1vdGVOYW1lKTsgfVxuICAgIGFyZ3MucHVzaChyZW1vdGVVcmwsIHRoaXMud29ya2luZ0Rpcik7XG5cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBmZXRjaChyZW1vdGVOYW1lLCBicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2ZldGNoJywgcmVtb3RlTmFtZSwgYnJhbmNoTmFtZV0sIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBwdWxsKHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ3B1bGwnLCByZW1vdGVOYW1lLCBvcHRpb25zLnJlZlNwZWMgfHwgYnJhbmNoTmFtZV07XG4gICAgaWYgKG9wdGlvbnMuZmZPbmx5KSB7XG4gICAgICBhcmdzLnB1c2goJy0tZmYtb25seScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ncGdFeGVjKGFyZ3MsIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBwdXNoKHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ3B1c2gnLCByZW1vdGVOYW1lIHx8ICdvcmlnaW4nLCBvcHRpb25zLnJlZlNwZWMgfHwgYHJlZnMvaGVhZHMvJHticmFuY2hOYW1lfWBdO1xuICAgIGlmIChvcHRpb25zLnNldFVwc3RyZWFtKSB7IGFyZ3MucHVzaCgnLS1zZXQtdXBzdHJlYW0nKTsgfVxuICAgIGlmIChvcHRpb25zLmZvcmNlKSB7IGFyZ3MucHVzaCgnLS1mb3JjZScpOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuZG8gT3BlcmF0aW9uc1xuICAgKi9cbiAgcmVzZXQodHlwZSwgcmV2aXNpb24gPSAnSEVBRCcpIHtcbiAgICBjb25zdCB2YWxpZFR5cGVzID0gWydzb2Z0J107XG4gICAgaWYgKCF2YWxpZFR5cGVzLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZSAke3R5cGV9LiBNdXN0IGJlIG9uZSBvZjogJHt2YWxpZFR5cGVzLmpvaW4oJywgJyl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoWydyZXNldCcsIGAtLSR7dHlwZX1gLCByZXZpc2lvbl0pO1xuICB9XG5cbiAgZGVsZXRlUmVmKHJlZikge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWyd1cGRhdGUtcmVmJywgJy1kJywgcmVmXSk7XG4gIH1cblxuICAvKipcbiAgICogQnJhbmNoZXNcbiAgICovXG4gIGNoZWNrb3V0KGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2NoZWNrb3V0J107XG4gICAgaWYgKG9wdGlvbnMuY3JlYXRlTmV3KSB7XG4gICAgICBhcmdzLnB1c2goJy1iJyk7XG4gICAgfVxuICAgIGFyZ3MucHVzaChicmFuY2hOYW1lKTtcbiAgICBpZiAob3B0aW9ucy5zdGFydFBvaW50KSB7XG4gICAgICBpZiAob3B0aW9ucy50cmFjaykgeyBhcmdzLnB1c2goJy0tdHJhY2snKTsgfVxuICAgICAgYXJncy5wdXNoKG9wdGlvbnMuc3RhcnRQb2ludCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEJyYW5jaGVzKCkge1xuICAgIGNvbnN0IGZvcm1hdCA9IFtcbiAgICAgICclKG9iamVjdG5hbWUpJywgJyUoSEVBRCknLCAnJShyZWZuYW1lOnNob3J0KScsXG4gICAgICAnJSh1cHN0cmVhbSknLCAnJSh1cHN0cmVhbTpyZW1vdGVuYW1lKScsICclKHVwc3RyZWFtOnJlbW90ZXJlZiknLFxuICAgICAgJyUocHVzaCknLCAnJShwdXNoOnJlbW90ZW5hbWUpJywgJyUocHVzaDpyZW1vdGVyZWYpJyxcbiAgICBdLmpvaW4oJyUwMCcpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsnZm9yLWVhY2gtcmVmJywgYC0tZm9ybWF0PSR7Zm9ybWF0fWAsICdyZWZzL2hlYWRzLyoqJ10pO1xuICAgIHJldHVybiBvdXRwdXQudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5tYXAobGluZSA9PiB7XG4gICAgICBjb25zdCBbXG4gICAgICAgIHNoYSwgaGVhZCwgbmFtZSxcbiAgICAgICAgdXBzdHJlYW1UcmFja2luZ1JlZiwgdXBzdHJlYW1SZW1vdGVOYW1lLCB1cHN0cmVhbVJlbW90ZVJlZixcbiAgICAgICAgcHVzaFRyYWNraW5nUmVmLCBwdXNoUmVtb3RlTmFtZSwgcHVzaFJlbW90ZVJlZixcbiAgICAgIF0gPSBsaW5lLnNwbGl0KCdcXDAnKTtcblxuICAgICAgY29uc3QgYnJhbmNoID0ge25hbWUsIHNoYSwgaGVhZDogaGVhZCA9PT0gJyonfTtcbiAgICAgIGlmICh1cHN0cmVhbVRyYWNraW5nUmVmIHx8IHVwc3RyZWFtUmVtb3RlTmFtZSB8fCB1cHN0cmVhbVJlbW90ZVJlZikge1xuICAgICAgICBicmFuY2gudXBzdHJlYW0gPSB7XG4gICAgICAgICAgdHJhY2tpbmdSZWY6IHVwc3RyZWFtVHJhY2tpbmdSZWYsXG4gICAgICAgICAgcmVtb3RlTmFtZTogdXBzdHJlYW1SZW1vdGVOYW1lLFxuICAgICAgICAgIHJlbW90ZVJlZjogdXBzdHJlYW1SZW1vdGVSZWYsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoYnJhbmNoLnVwc3RyZWFtIHx8IHB1c2hUcmFja2luZ1JlZiB8fCBwdXNoUmVtb3RlTmFtZSB8fCBwdXNoUmVtb3RlUmVmKSB7XG4gICAgICAgIGJyYW5jaC5wdXNoID0ge1xuICAgICAgICAgIHRyYWNraW5nUmVmOiBwdXNoVHJhY2tpbmdSZWYsXG4gICAgICAgICAgcmVtb3RlTmFtZTogcHVzaFJlbW90ZU5hbWUgfHwgKGJyYW5jaC51cHN0cmVhbSAmJiBicmFuY2gudXBzdHJlYW0ucmVtb3RlTmFtZSksXG4gICAgICAgICAgcmVtb3RlUmVmOiBwdXNoUmVtb3RlUmVmIHx8IChicmFuY2gudXBzdHJlYW0gJiYgYnJhbmNoLnVwc3RyZWFtLnJlbW90ZVJlZiksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYnJhbmNoO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0QnJhbmNoZXNXaXRoQ29tbWl0KHNoYSwgb3B0aW9uID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydicmFuY2gnLCAnLS1mb3JtYXQ9JShyZWZuYW1lKScsICctLWNvbnRhaW5zJywgc2hhXTtcbiAgICBpZiAob3B0aW9uLnNob3dMb2NhbCAmJiBvcHRpb24uc2hvd1JlbW90ZSkge1xuICAgICAgYXJncy5zcGxpY2UoMSwgMCwgJy0tYWxsJyk7XG4gICAgfSBlbHNlIGlmIChvcHRpb24uc2hvd1JlbW90ZSkge1xuICAgICAgYXJncy5zcGxpY2UoMSwgMCwgJy0tcmVtb3RlcycpO1xuICAgIH1cbiAgICBpZiAob3B0aW9uLnBhdHRlcm4pIHtcbiAgICAgIGFyZ3MucHVzaChvcHRpb24ucGF0dGVybik7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5leGVjKGFyZ3MpKS50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpO1xuICB9XG5cbiAgY2hlY2tvdXRGaWxlcyhwYXRocywgcmV2aXNpb24pIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgYXJncyA9IFsnY2hlY2tvdXQnXTtcbiAgICBpZiAocmV2aXNpb24pIHsgYXJncy5wdXNoKHJldmlzaW9uKTsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncy5jb25jYXQoJy0tJywgcGF0aHMubWFwKHRvR2l0UGF0aFNlcCkpLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGRlc2NyaWJlSGVhZCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZXhlYyhbJ2Rlc2NyaWJlJywgJy0tY29udGFpbnMnLCAnLS1hbGwnLCAnLS1hbHdheXMnLCAnSEVBRCddKSkudHJpbSgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q29uZmlnKG9wdGlvbiwge2xvY2FsfSA9IHt9KSB7XG4gICAgbGV0IG91dHB1dDtcbiAgICB0cnkge1xuICAgICAgbGV0IGFyZ3MgPSBbJ2NvbmZpZyddO1xuICAgICAgaWYgKGxvY2FsKSB7IGFyZ3MucHVzaCgnLS1sb2NhbCcpOyB9XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQob3B0aW9uKTtcbiAgICAgIG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gMSB8fCBlcnIuY29kZSA9PT0gMTI4KSB7XG4gICAgICAgIC8vIE5vIG1hdGNoaW5nIGNvbmZpZyBmb3VuZCBPUiAtLWxvY2FsIGNhbiBvbmx5IGJlIHVzZWQgaW5zaWRlIGEgZ2l0IHJlcG9zaXRvcnlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dC50cmltKCk7XG4gIH1cblxuICBzZXRDb25maWcob3B0aW9uLCB2YWx1ZSwge3JlcGxhY2VBbGwsIGdsb2JhbH0gPSB7fSkge1xuICAgIGxldCBhcmdzID0gWydjb25maWcnXTtcbiAgICBpZiAocmVwbGFjZUFsbCkgeyBhcmdzLnB1c2goJy0tcmVwbGFjZS1hbGwnKTsgfVxuICAgIGlmIChnbG9iYWwpIHsgYXJncy5wdXNoKCctLWdsb2JhbCcpOyB9XG4gICAgYXJncyA9IGFyZ3MuY29uY2F0KG9wdGlvbiwgdmFsdWUpO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICB1bnNldENvbmZpZyhvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnY29uZmlnJywgJy0tdW5zZXQnLCBvcHRpb25dLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlbW90ZXMoKSB7XG4gICAgbGV0IG91dHB1dCA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKFsnLS1nZXQtcmVnZXhwJywgJ15yZW1vdGVcXFxcLi4qXFxcXC51cmwkJ10sIHtsb2NhbDogdHJ1ZX0pO1xuICAgIGlmIChvdXRwdXQpIHtcbiAgICAgIG91dHB1dCA9IG91dHB1dC50cmltKCk7XG4gICAgICBpZiAoIW91dHB1dC5sZW5ndGgpIHsgcmV0dXJuIFtdOyB9XG4gICAgICByZXR1cm4gb3V0cHV0LnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXnJlbW90ZVxcLiguKilcXC51cmwgKC4qKSQvKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBtYXRjaFsxXSxcbiAgICAgICAgICB1cmw6IG1hdGNoWzJdLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH1cblxuICBhZGRSZW1vdGUobmFtZSwgdXJsKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3JlbW90ZScsICdhZGQnLCBuYW1lLCB1cmxdKTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUJsb2Ioe2ZpbGVQYXRoLCBzdGRpbn0gPSB7fSkge1xuICAgIGxldCBvdXRwdXQ7XG4gICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBvdXRwdXQgPSAoYXdhaXQgdGhpcy5leGVjKFsnaGFzaC1vYmplY3QnLCAnLXcnLCBmaWxlUGF0aF0sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pKS50cmltKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLnN0ZEVyciAmJiBlLnN0ZEVyci5tYXRjaCgvZmF0YWw6IENhbm5vdCBvcGVuIC4qOiBObyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5LykpIHtcbiAgICAgICAgICBvdXRwdXQgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0ZGluKSB7XG4gICAgICBvdXRwdXQgPSAoYXdhaXQgdGhpcy5leGVjKFsnaGFzaC1vYmplY3QnLCAnLXcnLCAnLS1zdGRpbiddLCB7c3RkaW4sIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSkpLnRyaW0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHN1cHBseSBmaWxlIHBhdGggb3Igc3RkaW4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIGFzeW5jIGV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2NhdC1maWxlJywgJy1wJywgc2hhXSk7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKGFic0ZpbGVQYXRoLCBvdXRwdXQsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgcmV0dXJuIGFic0ZpbGVQYXRoO1xuICB9XG5cbiAgYXN5bmMgZ2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWMoWydjYXQtZmlsZScsICctcCcsIHNoYV0pO1xuICB9XG5cbiAgYXN5bmMgbWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnbWVyZ2UtZmlsZScsICctcCcsIG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCxcbiAgICAgICctTCcsICdjdXJyZW50JywgJy1MJywgJ2FmdGVyIGRpc2NhcmQnLCAnLUwnLCAnYmVmb3JlIGRpc2NhcmQnLFxuICAgIF07XG4gICAgbGV0IG91dHB1dDtcbiAgICBsZXQgY29uZmxpY3QgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgR2l0RXJyb3IgJiYgZS5jb2RlID09PSAxKSB7XG4gICAgICAgIG91dHB1dCA9IGUuc3RkT3V0O1xuICAgICAgICBjb25mbGljdCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEludGVycHJldCBhIHJlbGF0aXZlIHJlc3VsdFBhdGggYXMgcmVsYXRpdmUgdG8gdGhlIHJlcG9zaXRvcnkgd29ya2luZyBkaXJlY3RvcnkgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlXG4gICAgLy8gb3RoZXIgYXJndW1lbnRzLlxuICAgIGNvbnN0IHJlc29sdmVkUmVzdWx0UGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLndvcmtpbmdEaXIsIHJlc3VsdFBhdGgpO1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShyZXNvbHZlZFJlc3VsdFBhdGgsIG91dHB1dCwge2VuY29kaW5nOiAndXRmOCd9KTtcblxuICAgIHJldHVybiB7ZmlsZVBhdGg6IG91cnNQYXRoLCByZXN1bHRQYXRoLCBjb25mbGljdH07XG4gIH1cblxuICBhc3luYyB3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpIHtcbiAgICBjb25zdCBnaXRGaWxlUGF0aCA9IHRvR2l0UGF0aFNlcChmaWxlUGF0aCk7XG4gICAgY29uc3QgZmlsZU1vZGUgPSBhd2FpdCB0aGlzLmdldEZpbGVNb2RlKGZpbGVQYXRoKTtcbiAgICBsZXQgaW5kZXhJbmZvID0gYDAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMFxcdCR7Z2l0RmlsZVBhdGh9XFxuYDtcbiAgICBpZiAoY29tbW9uQmFzZVNoYSkgeyBpbmRleEluZm8gKz0gYCR7ZmlsZU1vZGV9ICR7Y29tbW9uQmFzZVNoYX0gMVxcdCR7Z2l0RmlsZVBhdGh9XFxuYDsgfVxuICAgIGlmIChvdXJzU2hhKSB7IGluZGV4SW5mbyArPSBgJHtmaWxlTW9kZX0gJHtvdXJzU2hhfSAyXFx0JHtnaXRGaWxlUGF0aH1cXG5gOyB9XG4gICAgaWYgKHRoZWlyc1NoYSkgeyBpbmRleEluZm8gKz0gYCR7ZmlsZU1vZGV9ICR7dGhlaXJzU2hhfSAzXFx0JHtnaXRGaWxlUGF0aH1cXG5gOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3VwZGF0ZS1pbmRleCcsICctLWluZGV4LWluZm8nXSwge3N0ZGluOiBpbmRleEluZm8sIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBnZXRGaWxlTW9kZShmaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2xzLWZpbGVzJywgJy0tc3RhZ2UnLCAnLS0nLCB0b0dpdFBhdGhTZXAoZmlsZVBhdGgpXSk7XG4gICAgaWYgKG91dHB1dCkge1xuICAgICAgcmV0dXJuIG91dHB1dC5zbGljZSgwLCA2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhlY3V0YWJsZSA9IGF3YWl0IGlzRmlsZUV4ZWN1dGFibGUocGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgZmlsZVBhdGgpKTtcbiAgICAgIGNvbnN0IHN5bWxpbmsgPSBhd2FpdCBpc0ZpbGVTeW1saW5rKHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIGZpbGVQYXRoKSk7XG4gICAgICBpZiAoc3ltbGluaykge1xuICAgICAgICByZXR1cm4gRmlsZS5tb2Rlcy5TWU1MSU5LO1xuICAgICAgfSBlbHNlIGlmIChleGVjdXRhYmxlKSB7XG4gICAgICAgIHJldHVybiBGaWxlLm1vZGVzLkVYRUNVVEFCTEU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gRmlsZS5tb2Rlcy5OT1JNQUw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNvbW1hbmRRdWV1ZS5kaXNwb3NlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRBZGRlZEZpbGVQYXRjaChmaWxlUGF0aCwgY29udGVudHMsIG1vZGUsIHJlYWxwYXRoKSB7XG4gIGNvbnN0IGh1bmtzID0gW107XG4gIGlmIChjb250ZW50cykge1xuICAgIGxldCBub05ld0xpbmU7XG4gICAgbGV0IGxpbmVzO1xuICAgIGlmIChtb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTkspIHtcbiAgICAgIG5vTmV3TGluZSA9IGZhbHNlO1xuICAgICAgbGluZXMgPSBbYCske3RvR2l0UGF0aFNlcChyZWFscGF0aCl9YCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZSddO1xuICAgIH0gZWxzZSB7XG4gICAgICBub05ld0xpbmUgPSBjb250ZW50c1tjb250ZW50cy5sZW5ndGggLSAxXSAhPT0gJ1xcbic7XG4gICAgICBsaW5lcyA9IGNvbnRlbnRzLnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubWFwKGxpbmUgPT4gYCske2xpbmV9YCk7XG4gICAgfVxuICAgIGlmIChub05ld0xpbmUpIHsgbGluZXMucHVzaCgnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJyk7IH1cbiAgICBodW5rcy5wdXNoKHtcbiAgICAgIGxpbmVzLFxuICAgICAgb2xkU3RhcnRMaW5lOiAwLFxuICAgICAgb2xkTGluZUNvdW50OiAwLFxuICAgICAgbmV3U3RhcnRMaW5lOiAxLFxuICAgICAgaGVhZGluZzogJycsXG4gICAgICBuZXdMaW5lQ291bnQ6IG5vTmV3TGluZSA/IGxpbmVzLmxlbmd0aCAtIDEgOiBsaW5lcy5sZW5ndGgsXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvbGRQYXRoOiBudWxsLFxuICAgIG5ld1BhdGg6IHRvTmF0aXZlUGF0aFNlcChmaWxlUGF0aCksXG4gICAgb2xkTW9kZTogbnVsbCxcbiAgICBuZXdNb2RlOiBtb2RlLFxuICAgIHN0YXR1czogJ2FkZGVkJyxcbiAgICBodW5rcyxcbiAgfTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFBcUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXJDLE1BQU1BLHdCQUF3QixHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUVqRCxJQUFJQyxRQUFRLEdBQUcsSUFBSTtBQUNuQixJQUFJQyxlQUFlLEdBQUcsSUFBSTtBQUVuQixNQUFNQyxRQUFRLFNBQVNDLEtBQUssQ0FBQztFQUNsQ0MsV0FBVyxDQUFDQyxPQUFPLEVBQUU7SUFDbkIsS0FBSyxDQUFDQSxPQUFPLENBQUM7SUFDZCxJQUFJLENBQUNBLE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNDLEtBQUssR0FBRyxJQUFJSCxLQUFLLEVBQUUsQ0FBQ0csS0FBSztFQUNoQztBQUNGO0FBQUM7QUFFTSxNQUFNQyxjQUFjLFNBQVNKLEtBQUssQ0FBQztFQUN4Q0MsV0FBVyxDQUFDQyxPQUFPLEVBQUU7SUFDbkIsS0FBSyxDQUFDQSxPQUFPLENBQUM7SUFDZCxJQUFJLENBQUNBLE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNDLEtBQUssR0FBRyxJQUFJSCxLQUFLLEVBQUUsQ0FBQ0csS0FBSztFQUNoQztBQUNGOztBQUVBO0FBQUE7QUFDQSxNQUFNRSxvQkFBb0IsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQztBQUV6RyxNQUFNQyxtQkFBbUIsR0FBRyxDQUMxQixRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUMvQyxDQUFDQyxNQUFNLENBQUMsQ0FBQ0MsR0FBRyxFQUFFQyxJQUFJLEtBQUs7RUFDdEJELEdBQUcsQ0FBQ0UsT0FBTyxDQUFDLElBQUksRUFBRyxTQUFRRCxJQUFLLFFBQU8sQ0FBQztFQUN4QyxPQUFPRCxHQUFHO0FBQ1osQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNRyxrQkFBa0IsR0FBRyxJQUFJQyxNQUFNLENBQUMsc0JBQXNCLENBQUM7QUFFOUMsTUFBTUMsbUJBQW1CLENBQUM7RUFTdkNaLFdBQVcsQ0FBQ2EsVUFBVSxFQUFFQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDcEMsSUFBSSxDQUFDRCxVQUFVLEdBQUdBLFVBQVU7SUFDNUIsSUFBSUMsT0FBTyxDQUFDQyxLQUFLLEVBQUU7TUFDakIsSUFBSSxDQUFDQyxZQUFZLEdBQUdGLE9BQU8sQ0FBQ0MsS0FBSztJQUNuQyxDQUFDLE1BQU07TUFDTCxNQUFNRSxXQUFXLEdBQUdILE9BQU8sQ0FBQ0csV0FBVyxJQUFJQyxJQUFJLENBQUNDLEdBQUcsQ0FBQyxDQUFDLEVBQUVDLFdBQUUsQ0FBQ0MsSUFBSSxFQUFFLENBQUNDLE1BQU0sQ0FBQztNQUN4RSxJQUFJLENBQUNOLFlBQVksR0FBRyxJQUFJTyxtQkFBVSxDQUFDO1FBQUNOO01BQVcsQ0FBQyxDQUFDO0lBQ25EO0lBRUEsSUFBSSxDQUFDTyxNQUFNLEdBQUdWLE9BQU8sQ0FBQ1UsTUFBTSxLQUFLQyxLQUFLLElBQUlDLE9BQU8sQ0FBQ0MsTUFBTSxFQUFFLENBQUM7SUFDM0QsSUFBSSxDQUFDQyxhQUFhLEdBQUdkLE9BQU8sQ0FBQ2MsYUFBYTtJQUUxQyxJQUFJaEMsUUFBUSxLQUFLLElBQUksRUFBRTtNQUNyQkEsUUFBUSxHQUFHLENBQUNpQyxnQkFBTSxDQUFDQyxnQkFBZ0IsRUFBRSxDQUFDQyxTQUFTLEVBQUU7SUFDbkQ7RUFDRjs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDRUMsaUJBQWlCLENBQUNSLE1BQU0sRUFBRTtJQUN4QixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtFQUN0Qjs7RUFFQTtFQUNBLE1BQU1TLElBQUksQ0FBQ0MsSUFBSSxFQUFFcEIsT0FBTyxHQUFHRixtQkFBbUIsQ0FBQ3VCLGVBQWUsRUFBRTtJQUM5RDtJQUNBLE1BQU07TUFBQ0MsS0FBSztNQUFFQyxrQkFBa0I7TUFBRUMsYUFBYTtNQUFFQyxnQkFBZ0I7TUFBRUM7SUFBYyxDQUFDLEdBQUcxQixPQUFPO0lBQzVGLE1BQU0yQixXQUFXLEdBQUdQLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDM0IsTUFBTVEsYUFBYSxHQUFHLElBQUlDLDZCQUFtQixFQUFFO0lBQy9DLE1BQU1DLGtCQUFrQixHQUFHQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsMkJBQTJCLElBQUlDLElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7SUFFOUcsTUFBTUMsYUFBYSxHQUFJLE9BQU1qQixJQUFJLENBQUNrQixJQUFJLENBQUMsR0FBRyxDQUFFLE9BQU0sSUFBSSxDQUFDdkMsVUFBVyxFQUFDO0lBQ25FLE1BQU13QyxZQUFZLEdBQUdDLHVCQUFjLENBQUNDLGNBQWMsQ0FBRSxPQUFNckIsSUFBSSxDQUFDa0IsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFDLENBQUM7SUFDM0VDLFlBQVksQ0FBQ0csSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUUzQnRCLElBQUksQ0FBQ3pCLE9BQU8sQ0FBQyxHQUFHSixtQkFBbUIsQ0FBQztJQUVwQyxJQUFJUixlQUFlLEtBQUssSUFBSSxFQUFFO01BQzVCO01BQ0FBLGVBQWUsR0FBRyxJQUFJNkIsT0FBTyxDQUFDK0IsT0FBTyxJQUFJO1FBQ3ZDQyxzQkFBWSxDQUFDekIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMwQixLQUFLLEVBQUVDLE1BQU0sS0FBSztVQUN0RDtVQUNBLElBQUlELEtBQUssRUFBRTtZQUNUO1lBQ0FGLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDYjtVQUNGO1VBRUFBLE9BQU8sQ0FBQ0csTUFBTSxDQUFDQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUM7TUFDSixDQUFDLENBQUM7SUFDSjtJQUNBLE1BQU1DLFFBQVEsR0FBRyxNQUFNakUsZUFBZTtJQUV0QyxPQUFPLElBQUksQ0FBQ21CLFlBQVksQ0FBQytDLElBQUksQ0FBQyxZQUFZO01BQ3hDVixZQUFZLENBQUNHLElBQUksQ0FBQyxTQUFTLENBQUM7TUFDNUIsSUFBSVEsZUFBZTtNQUVuQixNQUFNQyxTQUFTLEdBQUcsRUFBRTtNQUNwQixJQUFJcEIsT0FBTyxDQUFDQyxHQUFHLENBQUNvQixJQUFJLEVBQUU7UUFDcEJELFNBQVMsQ0FBQ0YsSUFBSSxDQUFDbEIsT0FBTyxDQUFDQyxHQUFHLENBQUNvQixJQUFJLENBQUM7TUFDbEM7TUFDQSxJQUFJSixRQUFRLEVBQUU7UUFDWkcsU0FBUyxDQUFDRixJQUFJLENBQUNELFFBQVEsQ0FBQztNQUMxQjtNQUVBLE1BQU1oQixHQUFHLHFCQUNKRCxPQUFPLENBQUNDLEdBQUc7UUFDZHFCLG1CQUFtQixFQUFFLEdBQUc7UUFDeEJDLGtCQUFrQixFQUFFLEdBQUc7UUFDdkJGLElBQUksRUFBRUQsU0FBUyxDQUFDYixJQUFJLENBQUNpQixhQUFJLENBQUNDLFNBQVM7TUFBQyxFQUNyQztNQUVELE1BQU1DLFVBQVUsR0FBRyxJQUFJQyxtQkFBVSxFQUFFO01BRW5DLElBQUlsQyxhQUFhLEVBQUU7UUFDakIsTUFBTWlDLFVBQVUsQ0FBQ0UsTUFBTSxFQUFFO1FBQ3pCdkMsSUFBSSxDQUFDekIsT0FBTyxDQUFDLElBQUksRUFBRyxlQUFjOEQsVUFBVSxDQUFDRyxlQUFlLEVBQUcsRUFBQyxDQUFDO01BQ25FO01BRUEsSUFBSXJDLGtCQUFrQixFQUFFO1FBQ3RCMkIsZUFBZSxHQUFHLElBQUlXLHdCQUFlLENBQUNKLFVBQVUsQ0FBQztRQUNqRCxNQUFNUCxlQUFlLENBQUNZLEtBQUssQ0FBQyxJQUFJLENBQUNwRCxNQUFNLENBQUM7UUFFeENzQixHQUFHLENBQUMrQixlQUFlLEdBQUdOLFVBQVUsQ0FBQ08sV0FBVyxFQUFFO1FBQzlDaEMsR0FBRyxDQUFDaUMsd0JBQXdCLEdBQUcsSUFBQUMsK0JBQXNCLEVBQUNULFVBQVUsQ0FBQ1UsWUFBWSxFQUFFLENBQUM7UUFDaEZuQyxHQUFHLENBQUNvQywyQkFBMkIsR0FBRyxJQUFBRiwrQkFBc0IsRUFBQ1QsVUFBVSxDQUFDWSxxQkFBcUIsRUFBRSxDQUFDO1FBQzVGckMsR0FBRyxDQUFDc0MseUJBQXlCLEdBQUcsSUFBQUosK0JBQXNCLEVBQUMsSUFBQUssMEJBQWlCLEdBQUUsQ0FBQztRQUMzRXZDLEdBQUcsQ0FBQ3dDLHFCQUFxQixHQUFHdEIsZUFBZSxDQUFDdUIsVUFBVSxFQUFFO1FBRXhEekMsR0FBRyxDQUFDMEMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDM0UsVUFBVTtRQUM5Q2lDLEdBQUcsQ0FBQzJDLHVCQUF1QixHQUFHLElBQUFDLHNCQUFhLEdBQUU7UUFDN0M1QyxHQUFHLENBQUM2QyxnQ0FBZ0MsR0FBRyxJQUFBQyw0QkFBbUIsRUFBQyxpQkFBaUIsQ0FBQzs7UUFFN0U7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJLENBQUMvQyxPQUFPLENBQUNDLEdBQUcsQ0FBQytDLE9BQU8sSUFBSWhELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDK0MsT0FBTyxDQUFDdkUsTUFBTSxLQUFLLENBQUMsRUFBRTtVQUM1RHdCLEdBQUcsQ0FBQytDLE9BQU8sR0FBRyx5QkFBeUI7UUFDekM7UUFFQS9DLEdBQUcsQ0FBQ2dELHlCQUF5QixHQUFHakQsT0FBTyxDQUFDQyxHQUFHLENBQUNvQixJQUFJLElBQUksRUFBRTtRQUN0RHBCLEdBQUcsQ0FBQ2lELGdDQUFnQyxHQUFHbEQsT0FBTyxDQUFDQyxHQUFHLENBQUNrRCxXQUFXLElBQUksRUFBRTtRQUNwRWxELEdBQUcsQ0FBQ21ELGdDQUFnQyxHQUFHcEQsT0FBTyxDQUFDQyxHQUFHLENBQUNvRCxXQUFXLElBQUksRUFBRTtRQUNwRXBELEdBQUcsQ0FBQ3FELG9DQUFvQyxHQUFHdEQsT0FBTyxDQUFDQyxHQUFHLENBQUNzRCxlQUFlLElBQUksRUFBRTtRQUM1RXRELEdBQUcsQ0FBQ3VELHFCQUFxQixHQUFHckQsSUFBSSxDQUFDc0QsVUFBVSxFQUFFLEdBQUcsTUFBTSxHQUFHLE9BQU87UUFFaEV4RCxHQUFHLENBQUNvRCxXQUFXLEdBQUcsSUFBQWxCLCtCQUFzQixFQUFDVCxVQUFVLENBQUNnQyxZQUFZLEVBQUUsQ0FBQztRQUNuRXpELEdBQUcsQ0FBQ2tELFdBQVcsR0FBRyxJQUFBaEIsK0JBQXNCLEVBQUNULFVBQVUsQ0FBQ2dDLFlBQVksRUFBRSxDQUFDO1FBRW5FLElBQUkxRCxPQUFPLENBQUMyRCxRQUFRLEtBQUssT0FBTyxFQUFFO1VBQ2hDMUQsR0FBRyxDQUFDc0QsZUFBZSxHQUFHN0IsVUFBVSxDQUFDa0MsZUFBZSxFQUFFO1FBQ3BELENBQUMsTUFBTSxJQUFJNUQsT0FBTyxDQUFDQyxHQUFHLENBQUNzRCxlQUFlLEVBQUU7VUFDdEN0RCxHQUFHLENBQUNzRCxlQUFlLEdBQUd2RCxPQUFPLENBQUNDLEdBQUcsQ0FBQ3NELGVBQWU7UUFDbkQsQ0FBQyxNQUFNO1VBQ0x0RCxHQUFHLENBQUM0RCxPQUFPLEdBQUc3RCxPQUFPLENBQUNDLEdBQUcsQ0FBQzRELE9BQU87UUFDbkM7UUFFQSxNQUFNQyxrQkFBa0IsR0FBRyxJQUFBM0IsK0JBQXNCLEVBQUNULFVBQVUsQ0FBQ3FDLHFCQUFxQixFQUFFLENBQUM7UUFDckYxRSxJQUFJLENBQUN6QixPQUFPLENBQUMsSUFBSSxFQUFHLHFCQUFvQmtHLGtCQUFtQixFQUFDLENBQUM7TUFDL0Q7TUFFQSxJQUFJckUsYUFBYSxJQUFJRCxrQkFBa0IsSUFBSUUsZ0JBQWdCLEVBQUU7UUFDM0RPLEdBQUcsQ0FBQytELHNCQUFzQixHQUFHLE1BQU07TUFDckM7O01BRUE7TUFDQSxJQUFJakUsa0JBQWtCLEVBQUU7UUFDdEJFLEdBQUcsQ0FBQ2dFLFNBQVMsR0FBRyxNQUFNO1FBQ3RCaEUsR0FBRyxDQUFDaUUsY0FBYyxHQUFHLE1BQU07TUFDN0I7TUFFQSxJQUFJQyxJQUFJLEdBQUc7UUFBQ2xFO01BQUcsQ0FBQztNQUVoQixJQUFJVixLQUFLLEVBQUU7UUFDVDRFLElBQUksQ0FBQzVFLEtBQUssR0FBR0EsS0FBSztRQUNsQjRFLElBQUksQ0FBQ0MsYUFBYSxHQUFHLE1BQU07TUFDN0I7O01BRUE7TUFDQSxJQUFJcEUsT0FBTyxDQUFDQyxHQUFHLENBQUNvRSxlQUFlLEVBQUU7UUFDL0JDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFFLE9BQU1qRSxhQUFjLEVBQUMsQ0FBQztNQUN0QztNQUVBLE9BQU8sSUFBSXpCLE9BQU8sQ0FBQyxPQUFPK0IsT0FBTyxFQUFFOUIsTUFBTSxLQUFLO1FBQzVDLElBQUliLE9BQU8sQ0FBQ3VHLFNBQVMsRUFBRTtVQUNyQixNQUFNQyxXQUFXLEdBQUcsTUFBTXhHLE9BQU8sQ0FBQ3VHLFNBQVMsQ0FBQztZQUFDbkYsSUFBSTtZQUFFOEU7VUFBSSxDQUFDLENBQUM7VUFDekQ5RSxJQUFJLEdBQUdvRixXQUFXLENBQUNwRixJQUFJO1VBQ3ZCOEUsSUFBSSxHQUFHTSxXQUFXLENBQUNOLElBQUk7UUFDekI7UUFDQSxNQUFNO1VBQUNPLE9BQU87VUFBRUM7UUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDQyxpQkFBaUIsQ0FBQ3ZGLElBQUksRUFBRThFLElBQUksRUFBRTNELFlBQVksQ0FBQztRQUMxRSxJQUFJcUUsWUFBWSxHQUFHLEtBQUs7UUFDeEIsSUFBSTFELGVBQWUsRUFBRTtVQUNuQnRCLGFBQWEsQ0FBQ2lGLEdBQUcsQ0FBQzNELGVBQWUsQ0FBQzRELFdBQVcsQ0FBQyxPQUFPO1lBQUNDO1VBQVUsQ0FBQyxLQUFLO1lBQ3BFSCxZQUFZLEdBQUcsSUFBSTtZQUNuQixNQUFNRixNQUFNLEVBQUU7O1lBRWQ7WUFDQTtZQUNBO1lBQ0E7WUFDQSxNQUFNLElBQUk5RixPQUFPLENBQUMsQ0FBQ29HLFdBQVcsRUFBRUMsVUFBVSxLQUFLO2NBQzdDQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUNILFVBQVUsRUFBRSxTQUFTLEVBQUVJLEdBQUcsSUFBSTtnQkFDakQ7Z0JBQ0EsSUFBSUEsR0FBRyxFQUFFO2tCQUFFRixVQUFVLENBQUNFLEdBQUcsQ0FBQztnQkFBRSxDQUFDLE1BQU07a0JBQUVILFdBQVcsRUFBRTtnQkFBRTtjQUN0RCxDQUFDLENBQUM7WUFDSixDQUFDLENBQUM7VUFDSixDQUFDLENBQUMsQ0FBQztRQUNMO1FBRUEsTUFBTTtVQUFDbEUsTUFBTTtVQUFFc0UsTUFBTTtVQUFFQyxRQUFRO1VBQUVDLE1BQU07VUFBRUM7UUFBTSxDQUFDLEdBQUcsTUFBTWQsT0FBTyxDQUFDZSxLQUFLLENBQUNMLEdBQUcsSUFBSTtVQUM1RSxJQUFJQSxHQUFHLENBQUNHLE1BQU0sRUFBRTtZQUNkLE9BQU87Y0FBQ0EsTUFBTSxFQUFFSCxHQUFHLENBQUNHO1lBQU0sQ0FBQztVQUM3QjtVQUNBekcsTUFBTSxDQUFDc0csR0FBRyxDQUFDO1VBQ1gsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUM7UUFFRixJQUFJSSxNQUFNLEVBQUU7VUFDVixNQUFNO1lBQUNFLFFBQVE7WUFBRUMsU0FBUztZQUFFQztVQUFPLENBQUMsR0FBR0osTUFBTTtVQUM3QyxNQUFNSyxHQUFHLEdBQUdDLFdBQVcsQ0FBQ0QsR0FBRyxFQUFFO1VBQzdCckYsWUFBWSxDQUFDRyxJQUFJLENBQUMsVUFBVSxFQUFFa0YsR0FBRyxHQUFHSCxRQUFRLEdBQUdDLFNBQVMsR0FBR0MsT0FBTyxDQUFDO1VBQ25FcEYsWUFBWSxDQUFDRyxJQUFJLENBQUMsU0FBUyxFQUFFa0YsR0FBRyxHQUFHSCxRQUFRLEdBQUdFLE9BQU8sQ0FBQztVQUN0RHBGLFlBQVksQ0FBQ0csSUFBSSxDQUFDLEtBQUssRUFBRWtGLEdBQUcsR0FBR0QsT0FBTyxDQUFDO1FBQ3pDO1FBQ0FwRixZQUFZLENBQUN1RixRQUFRLEVBQUU7O1FBRXZCO1FBQ0EsSUFBSS9GLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDb0UsZUFBZSxFQUFFO1VBQy9CQyxPQUFPLENBQUMwQixPQUFPLENBQUUsT0FBTTFGLGFBQWMsRUFBQyxDQUFDO1FBQ3pDO1FBRUEsSUFBSWEsZUFBZSxFQUFFO1VBQ25CQSxlQUFlLENBQUM4RSxTQUFTLEVBQUU7UUFDN0I7UUFDQXBHLGFBQWEsQ0FBQ3FHLE9BQU8sRUFBRTs7UUFFdkI7UUFDQSxJQUFJbkcsa0JBQWtCLEVBQUU7VUFDdEIsTUFBTW9HLHVCQUF1QixHQUFHQyxHQUFHLElBQUk7WUFDckMsSUFBSSxDQUFDQSxHQUFHLEVBQUU7Y0FBRSxPQUFPLEVBQUU7WUFBRTtZQUV2QixPQUFPQSxHQUFHLENBQ1BDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQzlCQSxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztVQUNqQyxDQUFDO1VBRUQsSUFBSXRKLFFBQVEsRUFBRTtZQUNaLElBQUl1SixPQUFPLEdBQUksT0FBTWhHLGFBQWMsSUFBRztZQUN0QyxJQUFJZ0YsUUFBUSxLQUFLaUIsU0FBUyxFQUFFO2NBQzFCRCxPQUFPLElBQUssZ0JBQWVoQixRQUFTLElBQUc7WUFDekMsQ0FBQyxNQUFNLElBQUlDLE1BQU0sRUFBRTtjQUNqQmUsT0FBTyxJQUFLLGdCQUFlZixNQUFPLElBQUc7WUFDdkM7WUFDQSxJQUFJaEcsS0FBSyxJQUFJQSxLQUFLLENBQUNkLE1BQU0sS0FBSyxDQUFDLEVBQUU7Y0FDL0I2SCxPQUFPLElBQUssV0FBVUgsdUJBQXVCLENBQUM1RyxLQUFLLENBQUUsSUFBRztZQUMxRDtZQUNBK0csT0FBTyxJQUFJLFNBQVM7WUFDcEIsSUFBSXZGLE1BQU0sQ0FBQ3RDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Y0FDdkI2SCxPQUFPLElBQUksWUFBWTtZQUN6QixDQUFDLE1BQU07Y0FDTEEsT0FBTyxJQUFLLEtBQUlILHVCQUF1QixDQUFDcEYsTUFBTSxDQUFFLElBQUc7WUFDckQ7WUFDQXVGLE9BQU8sSUFBSSxTQUFTO1lBQ3BCLElBQUlqQixNQUFNLENBQUM1RyxNQUFNLEtBQUssQ0FBQyxFQUFFO2NBQ3ZCNkgsT0FBTyxJQUFJLFlBQVk7WUFDekIsQ0FBQyxNQUFNO2NBQ0xBLE9BQU8sSUFBSyxLQUFJSCx1QkFBdUIsQ0FBQ2QsTUFBTSxDQUFFLElBQUc7WUFDckQ7WUFFQWYsT0FBTyxDQUFDa0MsR0FBRyxDQUFDRixPQUFPLENBQUM7VUFDdEIsQ0FBQyxNQUFNO1lBQ0wsTUFBTUcsV0FBVyxHQUFHLGlDQUFpQztZQUVyRG5DLE9BQU8sQ0FBQ29DLGNBQWMsQ0FBRSxPQUFNcEcsYUFBYyxFQUFDLENBQUM7WUFDOUMsSUFBSWdGLFFBQVEsS0FBS2lCLFNBQVMsRUFBRTtjQUMxQmpDLE9BQU8sQ0FBQ2tDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRUMsV0FBVyxFQUFFLG9DQUFvQyxFQUFFbkIsUUFBUSxDQUFDO1lBQ2hHLENBQUMsTUFBTSxJQUFJQyxNQUFNLEVBQUU7Y0FDakJqQixPQUFPLENBQUNrQyxHQUFHLENBQUMsb0JBQW9CLEVBQUVDLFdBQVcsRUFBRSxvQ0FBb0MsRUFBRWxCLE1BQU0sQ0FBQztZQUM5RjtZQUNBakIsT0FBTyxDQUFDa0MsR0FBRyxDQUNULHVCQUF1QixFQUN2QkMsV0FBVyxFQUFFLG9DQUFvQyxFQUNqREUsYUFBSSxDQUFDQyxPQUFPLENBQUN2SCxJQUFJLEVBQUU7Y0FBQ3dILFdBQVcsRUFBRUM7WUFBUSxDQUFDLENBQUMsQ0FDNUM7WUFDRCxJQUFJdkgsS0FBSyxJQUFJQSxLQUFLLENBQUNkLE1BQU0sS0FBSyxDQUFDLEVBQUU7Y0FDL0I2RixPQUFPLENBQUNrQyxHQUFHLENBQUMsU0FBUyxFQUFFQyxXQUFXLENBQUM7Y0FDbkNuQyxPQUFPLENBQUNrQyxHQUFHLENBQUNMLHVCQUF1QixDQUFDNUcsS0FBSyxDQUFDLENBQUM7WUFDN0M7WUFDQStFLE9BQU8sQ0FBQ2tDLEdBQUcsQ0FBQyxVQUFVLEVBQUVDLFdBQVcsQ0FBQztZQUNwQ25DLE9BQU8sQ0FBQ2tDLEdBQUcsQ0FBQ0wsdUJBQXVCLENBQUNwRixNQUFNLENBQUMsQ0FBQztZQUM1Q3VELE9BQU8sQ0FBQ2tDLEdBQUcsQ0FBQyxVQUFVLEVBQUVDLFdBQVcsQ0FBQztZQUNwQ25DLE9BQU8sQ0FBQ2tDLEdBQUcsQ0FBQ0wsdUJBQXVCLENBQUNkLE1BQU0sQ0FBQyxDQUFDO1lBQzVDZixPQUFPLENBQUN5QyxRQUFRLEVBQUU7VUFDcEI7UUFDRjtRQUVBLElBQUl6QixRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUNULFlBQVksRUFBRTtVQUNuQyxNQUFNTyxHQUFHLEdBQUcsSUFBSW5JLFFBQVEsQ0FDckIsR0FBRXFELGFBQWMscUJBQW9CZ0YsUUFBUyxhQUFZdkUsTUFBTyxhQUFZc0UsTUFBTyxFQUFDLENBQ3RGO1VBQ0RELEdBQUcsQ0FBQzRCLElBQUksR0FBRzFCLFFBQVE7VUFDbkJGLEdBQUcsQ0FBQzZCLE1BQU0sR0FBRzVCLE1BQU07VUFDbkJELEdBQUcsQ0FBQzhCLE1BQU0sR0FBR25HLE1BQU07VUFDbkJxRSxHQUFHLENBQUMrQixPQUFPLEdBQUc3RyxhQUFhO1VBQzNCeEIsTUFBTSxDQUFDc0csR0FBRyxDQUFDO1FBQ2I7UUFFQSxJQUFJLENBQUM3SCxvQkFBb0IsQ0FBQzZKLFFBQVEsQ0FBQ3hILFdBQVcsQ0FBQyxFQUFFO1VBQy9DLElBQUF5SCwrQkFBZ0IsRUFBQ3pILFdBQVcsQ0FBQztRQUMvQjtRQUNBZ0IsT0FBTyxDQUFDRyxNQUFNLENBQUM7TUFDakIsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxFQUFFO01BQUN1RyxRQUFRLEVBQUUsQ0FBQzNIO0lBQWMsQ0FBQyxDQUFDO0lBQy9CO0VBQ0Y7O0VBRUEsTUFBTTRILE9BQU8sQ0FBQ2xJLElBQUksRUFBRXBCLE9BQU8sRUFBRTtJQUMzQixJQUFJO01BQ0YsT0FBTyxNQUFNLElBQUksQ0FBQ21CLElBQUksQ0FBQ0MsSUFBSSxDQUFDbUksS0FBSyxFQUFFO1FBQ2pDL0gsYUFBYSxFQUFFLElBQUk7UUFDbkJDLGdCQUFnQixFQUFFO01BQUssR0FDcEJ6QixPQUFPLEVBQ1Y7SUFDSixDQUFDLENBQUMsT0FBT3dKLENBQUMsRUFBRTtNQUNWLElBQUksWUFBWSxDQUFDQyxJQUFJLENBQUNELENBQUMsQ0FBQ1IsTUFBTSxDQUFDLEVBQUU7UUFDL0IsT0FBTyxNQUFNLElBQUksQ0FBQzdILElBQUksQ0FBQ0MsSUFBSTtVQUN6Qkcsa0JBQWtCLEVBQUUsSUFBSTtVQUN4QkMsYUFBYSxFQUFFLElBQUk7VUFDbkJDLGdCQUFnQixFQUFFO1FBQUksR0FDbkJ6QixPQUFPLEVBQ1Y7TUFDSixDQUFDLE1BQU07UUFDTCxNQUFNd0osQ0FBQztNQUNUO0lBQ0Y7RUFDRjtFQUVBN0MsaUJBQWlCLENBQUN2RixJQUFJLEVBQUVwQixPQUFPLEVBQUUwSixNQUFNLEdBQUcsSUFBSSxFQUFFO0lBQzlDLElBQUkzSCxPQUFPLENBQUNDLEdBQUcsQ0FBQzJILDJCQUEyQixJQUFJLENBQUNDLHNCQUFhLENBQUNDLFdBQVcsRUFBRSxDQUFDQyxPQUFPLEVBQUUsRUFBRTtNQUNyRkosTUFBTSxJQUFJQSxNQUFNLENBQUNoSCxJQUFJLENBQUMsVUFBVSxDQUFDO01BRWpDLElBQUlxSCxRQUFRO01BQ1ovSixPQUFPLENBQUNnSyxlQUFlLEdBQUdDLEtBQUssSUFBSTtRQUNqQ0YsUUFBUSxHQUFHRSxLQUFLLENBQUNDLEdBQUc7O1FBRXBCO1FBQ0FELEtBQUssQ0FBQzNJLEtBQUssQ0FBQzZJLEVBQUUsQ0FBQyxPQUFPLEVBQUVoRCxHQUFHLElBQUk7VUFDN0IsTUFBTSxJQUFJbEksS0FBSyxDQUNaLCtCQUE4Qm1DLElBQUksQ0FBQ2tCLElBQUksQ0FBQyxHQUFHLENBQUUsT0FBTSxJQUFJLENBQUN2QyxVQUFXLEtBQUlDLE9BQU8sQ0FBQ3NCLEtBQU0sS0FBSTZGLEdBQUksRUFBQyxDQUFDO1FBQ3BHLENBQUMsQ0FBQztNQUNKLENBQUM7TUFFRCxNQUFNVixPQUFPLEdBQUcyRCxrQkFBVSxDQUFDakosSUFBSSxDQUFDQyxJQUFJLEVBQUUsSUFBSSxDQUFDckIsVUFBVSxFQUFFQyxPQUFPLENBQUM7TUFDL0QwSixNQUFNLElBQUlBLE1BQU0sQ0FBQ2hILElBQUksQ0FBQyxTQUFTLENBQUM7TUFDaEMsT0FBTztRQUNMK0QsT0FBTztRQUNQQyxNQUFNLEVBQUUsTUFBTTtVQUNaO1VBQ0EsSUFBSSxDQUFDcUQsUUFBUSxFQUFFO1lBQ2IsT0FBT25KLE9BQU8sQ0FBQytCLE9BQU8sRUFBRTtVQUMxQjtVQUVBLE9BQU8sSUFBSS9CLE9BQU8sQ0FBQyxDQUFDK0IsT0FBTyxFQUFFOUIsTUFBTSxLQUFLO1lBQ3RDcUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDNkMsUUFBUSxFQUFFLFNBQVMsRUFBRTVDLEdBQUcsSUFBSTtjQUMvQztjQUNBLElBQUlBLEdBQUcsRUFBRTtnQkFBRXRHLE1BQU0sQ0FBQ3NHLEdBQUcsQ0FBQztjQUFFLENBQUMsTUFBTTtnQkFBRXhFLE9BQU8sRUFBRTtjQUFFO1lBQzlDLENBQUMsQ0FBQztVQUNKLENBQUMsQ0FBQztRQUNKO01BQ0YsQ0FBQztJQUNILENBQUMsTUFBTTtNQUNMLE1BQU03QixhQUFhLEdBQUcsSUFBSSxDQUFDQSxhQUFhLElBQUk4SSxzQkFBYSxDQUFDQyxXQUFXLEVBQUU7TUFDdkUsT0FBTy9JLGFBQWEsQ0FBQ3VKLE9BQU8sQ0FBQztRQUMzQmpKLElBQUk7UUFDSnJCLFVBQVUsRUFBRSxJQUFJLENBQUNBLFVBQVU7UUFDM0JDO01BQ0YsQ0FBQyxDQUFDO0lBQ0o7RUFDRjtFQUVBLE1BQU1zSyxnQkFBZ0IsR0FBRztJQUN2QixJQUFJO01BQ0YsTUFBTUMsZ0JBQUUsQ0FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQ3pLLFVBQVUsQ0FBQyxDQUFDLENBQUM7TUFDaEMsTUFBTTBLLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ3RKLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRW9DLGFBQUksQ0FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUN2QyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUN0RyxNQUFNMkssU0FBUyxHQUFHRCxNQUFNLENBQUMxSCxJQUFJLEVBQUU7TUFDL0IsT0FBTyxJQUFBNEgsd0JBQWUsRUFBQ0QsU0FBUyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxPQUFPbEIsQ0FBQyxFQUFFO01BQ1YsT0FBTyxJQUFJO0lBQ2I7RUFDRjtFQUVBb0IsSUFBSSxHQUFHO0lBQ0wsT0FBTyxJQUFJLENBQUN6SixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDcEIsVUFBVSxDQUFDLENBQUM7RUFDN0M7O0VBRUE7QUFDRjtBQUNBO0VBQ0U4SyxVQUFVLENBQUNDLEtBQUssRUFBRTtJQUNoQixJQUFJQSxLQUFLLENBQUN0SyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQUUsT0FBT0ksT0FBTyxDQUFDK0IsT0FBTyxDQUFDLElBQUksQ0FBQztJQUFFO0lBQ3hELE1BQU12QixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzJKLE1BQU0sQ0FBQ0QsS0FBSyxDQUFDRSxHQUFHLENBQUNDLHFCQUFZLENBQUMsQ0FBQztJQUNwRCxPQUFPLElBQUksQ0FBQzlKLElBQUksQ0FBQ0MsSUFBSSxFQUFFO01BQUNNLGNBQWMsRUFBRTtJQUFJLENBQUMsQ0FBQztFQUNoRDtFQUVBLE1BQU13SiwwQkFBMEIsR0FBRztJQUNqQyxJQUFJQyxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUNDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztJQUMxRCxJQUFJLENBQUNELFlBQVksRUFBRTtNQUNqQixPQUFPLElBQUk7SUFDYjtJQUVBLE1BQU1FLE9BQU8sR0FBRy9LLFdBQUUsQ0FBQ2dMLE9BQU8sRUFBRTtJQUU1QkgsWUFBWSxHQUFHQSxZQUFZLENBQUNwSSxJQUFJLEVBQUUsQ0FBQ3FGLE9BQU8sQ0FBQ3hJLGtCQUFrQixFQUFFLENBQUMyTCxDQUFDLEVBQUVDLElBQUksS0FBSztNQUMxRTtNQUNBLE9BQVEsR0FBRUEsSUFBSSxHQUFHakksYUFBSSxDQUFDakIsSUFBSSxDQUFDaUIsYUFBSSxDQUFDa0ksT0FBTyxDQUFDSixPQUFPLENBQUMsRUFBRUcsSUFBSSxDQUFDLEdBQUdILE9BQVEsR0FBRTtJQUN0RSxDQUFDLENBQUM7SUFDRkYsWUFBWSxHQUFHLElBQUFSLHdCQUFlLEVBQUNRLFlBQVksQ0FBQztJQUU1QyxJQUFJLENBQUM1SCxhQUFJLENBQUNtSSxVQUFVLENBQUNQLFlBQVksQ0FBQyxFQUFFO01BQ2xDQSxZQUFZLEdBQUc1SCxhQUFJLENBQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDdkMsVUFBVSxFQUFFb0wsWUFBWSxDQUFDO0lBQ3pEO0lBRUEsSUFBSSxFQUFDLE1BQU0sSUFBQVEsbUJBQVUsRUFBQ1IsWUFBWSxDQUFDLEdBQUU7TUFDbkMsTUFBTSxJQUFJbE0sS0FBSyxDQUFFLG1EQUFrRGtNLFlBQWEsRUFBQyxDQUFDO0lBQ3BGO0lBQ0EsT0FBTyxNQUFNWixnQkFBRSxDQUFDcUIsUUFBUSxDQUFDVCxZQUFZLEVBQUU7TUFBQ1UsUUFBUSxFQUFFO0lBQU0sQ0FBQyxDQUFDO0VBQzVEO0VBRUFDLFlBQVksQ0FBQ2hCLEtBQUssRUFBRWlCLE1BQU0sR0FBRyxNQUFNLEVBQUU7SUFDbkMsSUFBSWpCLEtBQUssQ0FBQ3RLLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFBRSxPQUFPSSxPQUFPLENBQUMrQixPQUFPLENBQUMsSUFBSSxDQUFDO0lBQUU7SUFDeEQsTUFBTXZCLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTJLLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQ2hCLE1BQU0sQ0FBQ0QsS0FBSyxDQUFDRSxHQUFHLENBQUNDLHFCQUFZLENBQUMsQ0FBQztJQUNwRSxPQUFPLElBQUksQ0FBQzlKLElBQUksQ0FBQ0MsSUFBSSxFQUFFO01BQUNNLGNBQWMsRUFBRTtJQUFJLENBQUMsQ0FBQztFQUNoRDtFQUVBc0ssbUJBQW1CLENBQUNDLFFBQVEsRUFBRUMsT0FBTyxFQUFFO0lBQ3JDLE1BQU1DLGdCQUFnQixHQUFHLElBQUksQ0FBQ2hMLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOEssUUFBUSxDQUFDLENBQUM7SUFDdEUsT0FBTyxJQUFJLENBQUM5SyxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsYUFBYSxFQUFHLEdBQUUrSyxPQUFRLGNBQWFELFFBQVMsRUFBQyxDQUFDLEVBQUU7TUFDcEZ2SyxjQUFjLEVBQUUsSUFBSTtNQUNwQjZFLFNBQVMsRUFBRSxlQUFlNkYsYUFBYSxDQUFDO1FBQUNoTCxJQUFJO1FBQUU4RTtNQUFJLENBQUMsRUFBRTtRQUNwRCxNQUFNbUcsS0FBSyxHQUFHLE1BQU1GLGdCQUFnQjtRQUNwQyxNQUFNRyxHQUFHLEdBQUdELEtBQUssQ0FBQ0UsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDL0IsT0FBTztVQUNMckcsSUFBSTtVQUNKOUUsSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRyxHQUFFOEssT0FBUSxJQUFHSSxHQUFJLElBQUdMLFFBQVMsRUFBQztRQUN2RSxDQUFDO01BQ0g7SUFDRixDQUFDLENBQUM7RUFDSjtFQUVBTyxzQkFBc0IsQ0FBQ1AsUUFBUSxFQUFFO0lBQy9CLE9BQU8sSUFBSSxDQUFDOUssSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRThLLFFBQVEsQ0FBQyxFQUFFO01BQUN2SyxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUM7RUFDeEU7RUFFQStLLFVBQVUsQ0FBQ0MsS0FBSyxFQUFFO0lBQUNMO0VBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQzlCLE1BQU1qTCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO0lBQzNCLElBQUlpTCxLQUFLLEVBQUU7TUFBRWpMLElBQUksQ0FBQ3VMLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQztJQUFFO0lBQzVDLE9BQU8sSUFBSSxDQUFDeEwsSUFBSSxDQUFDQyxJQUFJLEVBQUU7TUFBQ0UsS0FBSyxFQUFFb0wsS0FBSztNQUFFaEwsY0FBYyxFQUFFO0lBQUksQ0FBQyxDQUFDO0VBQzlEO0VBRUEsTUFBTXFLLE1BQU0sQ0FBQ2EsVUFBVSxFQUFFO0lBQUNDLFVBQVU7SUFBRUMsS0FBSztJQUFFQyxTQUFTO0lBQUVDO0VBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3RFLE1BQU01TCxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDdkIsSUFBSTZMLEdBQUc7O0lBRVA7SUFDQTtJQUNBLElBQUlILEtBQUssSUFBSUYsVUFBVSxDQUFDcE0sTUFBTSxLQUFLLENBQUMsRUFBRTtNQUNwQyxNQUFNO1FBQUMwTSxTQUFTO1FBQUVDLFdBQVc7UUFBRUM7TUFBYyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUNDLGFBQWEsRUFBRTtNQUMzRSxJQUFJSCxTQUFTLEVBQUU7UUFDYkQsR0FBRyxHQUFHTCxVQUFVO01BQ2xCLENBQUMsTUFBTTtRQUNMSyxHQUFHLEdBQUksR0FBRUcsY0FBZSxPQUFNRCxXQUFZLEVBQUMsQ0FBQ3BLLElBQUksRUFBRTtRQUNsRGlLLFFBQVEsR0FBRyxJQUFJO01BQ2pCO0lBQ0YsQ0FBQyxNQUFNO01BQ0xDLEdBQUcsR0FBR0wsVUFBVTtJQUNsQjs7SUFFQTtJQUNBO0lBQ0EsTUFBTVUsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDcEMsMEJBQTBCLEVBQUU7SUFDeEQsSUFBSW9DLFFBQVEsRUFBRTtNQUVaO01BQ0E7TUFDQSxJQUFJQyxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUNuQyxTQUFTLENBQUMsa0JBQWtCLENBQUM7TUFDMUQsSUFBSSxDQUFDbUMsV0FBVyxFQUFFO1FBQ2hCQSxXQUFXLEdBQUcsR0FBRztNQUNuQjtNQUNBTixHQUFHLEdBQUdBLEdBQUcsQ0FBQ08sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDQyxNQUFNLENBQUNDLElBQUksSUFBSSxDQUFDQSxJQUFJLENBQUNDLFVBQVUsQ0FBQ0osV0FBVyxDQUFDLENBQUMsQ0FBQ2pMLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDaEY7O0lBRUE7SUFDQSxJQUFJMEssUUFBUSxFQUFFO01BQ1o1TCxJQUFJLENBQUM2QixJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDakMsQ0FBQyxNQUFNO01BQ0wsTUFBTTJLLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQ3hDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztNQUN6RCxNQUFNeUMsSUFBSSxHQUFJRCxVQUFVLElBQUlBLFVBQVUsS0FBSyxTQUFTLEdBQUlBLFVBQVUsR0FBRyxPQUFPO01BQzVFeE0sSUFBSSxDQUFDNkIsSUFBSSxDQUFFLGFBQVk0SyxJQUFLLEVBQUMsQ0FBQztJQUNoQzs7SUFFQTtJQUNBLElBQUlkLFNBQVMsSUFBSUEsU0FBUyxDQUFDdk0sTUFBTSxHQUFHLENBQUMsRUFBRTtNQUNyQ3lNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQ2EscUJBQXFCLENBQUNiLEdBQUcsRUFBRUYsU0FBUyxDQUFDO0lBQ3hEO0lBRUEzTCxJQUFJLENBQUM2QixJQUFJLENBQUMsSUFBSSxFQUFFZ0ssR0FBRyxDQUFDbEssSUFBSSxFQUFFLENBQUM7SUFFM0IsSUFBSStKLEtBQUssRUFBRTtNQUFFMUwsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUFFO0lBQ25DLElBQUk0SixVQUFVLEVBQUU7TUFBRXpMLElBQUksQ0FBQzZCLElBQUksQ0FBQyxlQUFlLENBQUM7SUFBRTtJQUM5QyxPQUFPLElBQUksQ0FBQ3FHLE9BQU8sQ0FBQ2xJLElBQUksRUFBRTtNQUFDTSxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUM7RUFDbkQ7RUFFQW9NLHFCQUFxQixDQUFDM08sT0FBTyxFQUFFNE4sU0FBUyxHQUFHLEVBQUUsRUFBRTtJQUM3QyxNQUFNZ0IsUUFBUSxHQUFHaEIsU0FBUyxDQUFDL0IsR0FBRyxDQUFDZ0QsTUFBTSxJQUFJO01BQ3ZDLE9BQU87UUFDTEMsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QkMsS0FBSyxFQUFHLEdBQUVGLE1BQU0sQ0FBQ0csSUFBSyxLQUFJSCxNQUFNLENBQUNJLEtBQU07TUFDekMsQ0FBQztJQUNILENBQUMsQ0FBQzs7SUFFRjtJQUNBLE1BQU1uQixHQUFHLEdBQUksR0FBRTlOLE9BQU8sQ0FBQzRELElBQUksRUFBRyxJQUFHO0lBRWpDLE9BQU9nTCxRQUFRLENBQUN2TixNQUFNLEdBQUcsSUFBSSxDQUFDNk4sYUFBYSxDQUFDcEIsR0FBRyxFQUFFYyxRQUFRLENBQUMsR0FBR2QsR0FBRztFQUNsRTs7RUFFQTtBQUNGO0FBQ0E7RUFDRSxNQUFNcUIsZUFBZSxHQUFHO0lBQ3RCLE1BQU1sTixJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFFLDJCQUEyQixFQUFFLElBQUksQ0FBQztJQUNqSCxNQUFNcUosTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDQyxJQUFJLENBQUM7SUFDcEMsSUFBSXFKLE1BQU0sQ0FBQ2pLLE1BQU0sR0FBRzNCLHdCQUF3QixFQUFFO01BQzVDLE1BQU0sSUFBSVEsY0FBYyxFQUFFO0lBQzVCO0lBRUEsTUFBTWtQLE9BQU8sR0FBRyxNQUFNLElBQUFDLG9CQUFXLEVBQUMvRCxNQUFNLENBQUM7SUFFekMsS0FBSyxNQUFNZ0UsU0FBUyxJQUFJRixPQUFPLEVBQUU7TUFDL0IsSUFBSUcsS0FBSyxDQUFDQyxPQUFPLENBQUNKLE9BQU8sQ0FBQ0UsU0FBUyxDQUFDLENBQUMsRUFBRTtRQUNyQyxJQUFJLENBQUNHLDZCQUE2QixDQUFDTCxPQUFPLENBQUNFLFNBQVMsQ0FBQyxDQUFDO01BQ3hEO0lBQ0Y7SUFFQSxPQUFPRixPQUFPO0VBQ2hCO0VBRUFLLDZCQUE2QixDQUFDQyxPQUFPLEVBQUU7SUFDckNBLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDQyxLQUFLLElBQUk7TUFDdkI7TUFDQTtNQUNBO01BQ0EsSUFBSUEsS0FBSyxDQUFDQyxRQUFRLEVBQUU7UUFDbEJELEtBQUssQ0FBQ0MsUUFBUSxHQUFHLElBQUFyRSx3QkFBZSxFQUFDb0UsS0FBSyxDQUFDQyxRQUFRLENBQUM7TUFDbEQ7TUFDQSxJQUFJRCxLQUFLLENBQUNFLFlBQVksRUFBRTtRQUN0QkYsS0FBSyxDQUFDRSxZQUFZLEdBQUcsSUFBQXRFLHdCQUFlLEVBQUNvRSxLQUFLLENBQUNFLFlBQVksQ0FBQztNQUMxRDtJQUNGLENBQUMsQ0FBQztFQUNKO0VBRUEsTUFBTUMsY0FBYyxDQUFDbFAsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ2pDLE1BQU1vQixJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQztJQUN0RCxJQUFJcEIsT0FBTyxDQUFDbVAsTUFBTSxFQUFFO01BQUUvTixJQUFJLENBQUM2QixJQUFJLENBQUMsVUFBVSxDQUFDO0lBQUU7SUFDN0MsSUFBSWpELE9BQU8sQ0FBQ29QLE1BQU0sRUFBRTtNQUFFaE8sSUFBSSxDQUFDNkIsSUFBSSxDQUFDakQsT0FBTyxDQUFDb1AsTUFBTSxDQUFDO0lBQUU7SUFDakQsTUFBTTNFLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ3RKLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBRXBDLE1BQU1pTyxTQUFTLEdBQUc7TUFDaEJDLENBQUMsRUFBRSxPQUFPO01BQ1ZDLENBQUMsRUFBRSxVQUFVO01BQ2JDLENBQUMsRUFBRSxTQUFTO01BQ1pDLENBQUMsRUFBRTtJQUNMLENBQUM7SUFFRCxNQUFNQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCakYsTUFBTSxJQUFJQSxNQUFNLENBQUMxSCxJQUFJLEVBQUUsQ0FBQ3lLLEtBQUssQ0FBQ21DLDBCQUFpQixDQUFDLENBQUNiLE9BQU8sQ0FBQ3BCLElBQUksSUFBSTtNQUMvRCxNQUFNLENBQUNrQyxNQUFNLEVBQUVDLFdBQVcsQ0FBQyxHQUFHbkMsSUFBSSxDQUFDRixLQUFLLENBQUMsSUFBSSxDQUFDO01BQzlDLE1BQU13QixRQUFRLEdBQUcsSUFBQXJFLHdCQUFlLEVBQUNrRixXQUFXLENBQUM7TUFDN0NILFlBQVksQ0FBQ1YsUUFBUSxDQUFDLEdBQUdLLFNBQVMsQ0FBQ08sTUFBTSxDQUFDO0lBQzVDLENBQUMsQ0FBQztJQUNGLElBQUksQ0FBQzVQLE9BQU8sQ0FBQ21QLE1BQU0sRUFBRTtNQUNuQixNQUFNVyxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUNDLGlCQUFpQixFQUFFO01BQ2hERCxTQUFTLENBQUNoQixPQUFPLENBQUNFLFFBQVEsSUFBSTtRQUFFVSxZQUFZLENBQUNWLFFBQVEsQ0FBQyxHQUFHLE9BQU87TUFBRSxDQUFDLENBQUM7SUFDdEU7SUFDQSxPQUFPVSxZQUFZO0VBQ3JCO0VBRUEsTUFBTUssaUJBQWlCLEdBQUc7SUFDeEIsTUFBTXRGLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ3RKLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUM5RSxJQUFJc0osTUFBTSxDQUFDMUgsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO01BQUUsT0FBTyxFQUFFO0lBQUU7SUFDdkMsT0FBTzBILE1BQU0sQ0FBQzFILElBQUksRUFBRSxDQUFDeUssS0FBSyxDQUFDbUMsMEJBQWlCLENBQUMsQ0FBQzNFLEdBQUcsQ0FBQ0wsd0JBQWUsQ0FBQztFQUNwRTtFQUVBLE1BQU1xRixtQkFBbUIsQ0FBQ2hCLFFBQVEsRUFBRTtJQUFDRyxNQUFNO0lBQUVjO0VBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQzdELElBQUk3TyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7SUFDdEYsSUFBSStOLE1BQU0sRUFBRTtNQUFFL04sSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUFFO0lBQ3JDLElBQUlnTixVQUFVLEVBQUU7TUFBRTdPLElBQUksQ0FBQzZCLElBQUksQ0FBQ2dOLFVBQVUsQ0FBQztJQUFFO0lBQ3pDN08sSUFBSSxHQUFHQSxJQUFJLENBQUMySixNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBQUUscUJBQVksRUFBQytELFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbEQsTUFBTXZFLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ3RKLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBRXBDLElBQUk4TyxRQUFRLEdBQUcsRUFBRTtJQUNqQixJQUFJekYsTUFBTSxFQUFFO01BQ1Z5RixRQUFRLEdBQUcsSUFBQUMsa0JBQVMsRUFBQzFGLE1BQU0sQ0FBQyxDQUN6QmdELE1BQU0sQ0FBQzJDLE9BQU8sSUFBSUEsT0FBTyxDQUFDUixNQUFNLEtBQUssVUFBVSxDQUFDO01BRW5ELEtBQUssSUFBSVMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSCxRQUFRLENBQUMxUCxNQUFNLEVBQUU2UCxDQUFDLEVBQUUsRUFBRTtRQUN4QyxNQUFNRCxPQUFPLEdBQUdGLFFBQVEsQ0FBQ0csQ0FBQyxDQUFDO1FBQzNCLElBQUlELE9BQU8sQ0FBQ0UsT0FBTyxFQUFFO1VBQ25CRixPQUFPLENBQUNFLE9BQU8sR0FBRyxJQUFBM0Ysd0JBQWUsRUFBQ3lGLE9BQU8sQ0FBQ0UsT0FBTyxDQUFDO1FBQ3BEO1FBQ0EsSUFBSUYsT0FBTyxDQUFDRyxPQUFPLEVBQUU7VUFDbkJILE9BQU8sQ0FBQ0csT0FBTyxHQUFHLElBQUE1Rix3QkFBZSxFQUFDeUYsT0FBTyxDQUFDRyxPQUFPLENBQUM7UUFDcEQ7TUFDRjtJQUNGO0lBRUEsSUFBSSxDQUFDcEIsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUNZLGlCQUFpQixFQUFFLEVBQUU1RyxRQUFRLENBQUM2RixRQUFRLENBQUMsRUFBRTtNQUNsRTtNQUNBLE1BQU13QixPQUFPLEdBQUdqTixhQUFJLENBQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDdkMsVUFBVSxFQUFFaVAsUUFBUSxDQUFDO01BQ3BELE1BQU15QixVQUFVLEdBQUcsTUFBTSxJQUFBQyx5QkFBZ0IsRUFBQ0YsT0FBTyxDQUFDO01BQ2xELE1BQU1HLE9BQU8sR0FBRyxNQUFNLElBQUFDLHNCQUFhLEVBQUNKLE9BQU8sQ0FBQztNQUM1QyxNQUFNSyxRQUFRLEdBQUcsTUFBTXRHLGdCQUFFLENBQUNxQixRQUFRLENBQUM0RSxPQUFPLEVBQUU7UUFBQzNFLFFBQVEsRUFBRTtNQUFNLENBQUMsQ0FBQztNQUMvRCxNQUFNaUYsTUFBTSxHQUFHLElBQUFDLGlCQUFRLEVBQUNGLFFBQVEsQ0FBQztNQUNqQyxJQUFJaEQsSUFBSTtNQUNSLElBQUltRCxRQUFRO01BQ1osSUFBSVAsVUFBVSxFQUFFO1FBQ2Q1QyxJQUFJLEdBQUdvRCxhQUFJLENBQUNDLEtBQUssQ0FBQ0MsVUFBVTtNQUM5QixDQUFDLE1BQU0sSUFBSVIsT0FBTyxFQUFFO1FBQ2xCOUMsSUFBSSxHQUFHb0QsYUFBSSxDQUFDQyxLQUFLLENBQUNFLE9BQU87UUFDekJKLFFBQVEsR0FBRyxNQUFNekcsZ0JBQUUsQ0FBQ3lHLFFBQVEsQ0FBQ1IsT0FBTyxDQUFDO01BQ3ZDLENBQUMsTUFBTTtRQUNMM0MsSUFBSSxHQUFHb0QsYUFBSSxDQUFDQyxLQUFLLENBQUNHLE1BQU07TUFDMUI7TUFFQW5CLFFBQVEsQ0FBQ2pOLElBQUksQ0FBQ3FPLG1CQUFtQixDQUFDdEMsUUFBUSxFQUFFOEIsTUFBTSxHQUFHLElBQUksR0FBR0QsUUFBUSxFQUFFaEQsSUFBSSxFQUFFbUQsUUFBUSxDQUFDLENBQUM7SUFDeEY7SUFDQSxJQUFJZCxRQUFRLENBQUMxUCxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQ3ZCLE1BQU0sSUFBSXZCLEtBQUssQ0FBRSxzQ0FBcUMrUCxRQUFTLFlBQVdrQixRQUFRLENBQUMxUCxNQUFPLEVBQUMsQ0FBQztJQUM5RjtJQUNBLE9BQU8wUCxRQUFRO0VBQ2pCO0VBRUEsTUFBTXFCLHFCQUFxQixHQUFHO0lBQzVCLE1BQU05RyxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUN0SixJQUFJLENBQUMsQ0FDN0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsQ0FDdEYsQ0FBQztJQUVGLElBQUksQ0FBQ3NKLE1BQU0sRUFBRTtNQUNYLE9BQU8sRUFBRTtJQUNYO0lBRUEsTUFBTStHLEtBQUssR0FBRyxJQUFBckIsa0JBQVMsRUFBQzFGLE1BQU0sQ0FBQztJQUMvQixLQUFLLE1BQU1nSCxJQUFJLElBQUlELEtBQUssRUFBRTtNQUN4QixJQUFJQyxJQUFJLENBQUNuQixPQUFPLEVBQUU7UUFBRW1CLElBQUksQ0FBQ25CLE9BQU8sR0FBRyxJQUFBM0Ysd0JBQWUsRUFBQzhHLElBQUksQ0FBQ25CLE9BQU8sQ0FBQztNQUFFO01BQ2xFLElBQUltQixJQUFJLENBQUNsQixPQUFPLEVBQUU7UUFBRWtCLElBQUksQ0FBQ2xCLE9BQU8sR0FBRyxJQUFBNUYsd0JBQWUsRUFBQzhHLElBQUksQ0FBQ2xCLE9BQU8sQ0FBQztNQUFFO0lBQ3BFO0lBQ0EsT0FBT2lCLEtBQUs7RUFDZDs7RUFFQTtBQUNGO0FBQ0E7RUFDRSxNQUFNRSxTQUFTLENBQUNDLEdBQUcsRUFBRTtJQUNuQixNQUFNLENBQUM1RixNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQzZGLFVBQVUsQ0FBQztNQUFDdlIsR0FBRyxFQUFFLENBQUM7TUFBRXNSLEdBQUc7TUFBRUUsYUFBYSxFQUFFO0lBQUksQ0FBQyxDQUFDO0lBQzFFLE9BQU85RixNQUFNO0VBQ2Y7RUFFQSxNQUFNc0IsYUFBYSxHQUFHO0lBQ3BCLE1BQU0sQ0FBQ3lFLFVBQVUsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDRixVQUFVLENBQUM7TUFBQ3ZSLEdBQUcsRUFBRSxDQUFDO01BQUVzUixHQUFHLEVBQUUsTUFBTTtNQUFFRSxhQUFhLEVBQUU7SUFBSSxDQUFDLENBQUM7SUFDdEYsT0FBT0MsVUFBVTtFQUNuQjtFQUVBLE1BQU1GLFVBQVUsQ0FBQzVSLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUM3QixNQUFNO01BQUNLLEdBQUc7TUFBRXNSLEdBQUc7TUFBRUUsYUFBYTtNQUFFRTtJQUFZLENBQUM7TUFDM0MxUixHQUFHLEVBQUUsQ0FBQztNQUNOc1IsR0FBRyxFQUFFLE1BQU07TUFDWEUsYUFBYSxFQUFFLEtBQUs7TUFDcEJFLFlBQVksRUFBRTtJQUFLLEdBQ2hCL1IsT0FBTyxDQUNYOztJQUVEO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxNQUFNb0IsSUFBSSxHQUFHLENBQ1gsS0FBSyxFQUNMLHlEQUF5RCxFQUN6RCxvQkFBb0IsRUFDcEIsYUFBYSxFQUNiLGVBQWUsRUFDZixjQUFjLEVBQ2QsSUFBSSxFQUNKLElBQUksRUFDSmYsR0FBRyxFQUNIc1IsR0FBRyxDQUNKO0lBRUQsSUFBSUksWUFBWSxFQUFFO01BQ2hCM1EsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLENBQUM7SUFDOUM7SUFFQSxNQUFNd0gsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDQyxJQUFJLENBQUMySixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQ3ZELEtBQUssQ0FBQ0wsR0FBRyxJQUFJO01BQzdELElBQUksa0JBQWtCLENBQUNzQyxJQUFJLENBQUN0QyxHQUFHLENBQUM2QixNQUFNLENBQUMsSUFBSSxxQkFBcUIsQ0FBQ1MsSUFBSSxDQUFDdEMsR0FBRyxDQUFDNkIsTUFBTSxDQUFDLEVBQUU7UUFDakYsT0FBTyxFQUFFO01BQ1gsQ0FBQyxNQUFNO1FBQ0wsTUFBTTdCLEdBQUc7TUFDWDtJQUNGLENBQUMsQ0FBQztJQUVGLElBQUlzRCxNQUFNLEtBQUssRUFBRSxFQUFFO01BQ2pCLE9BQU9vSCxhQUFhLEdBQUcsQ0FBQztRQUFDRyxHQUFHLEVBQUUsRUFBRTtRQUFFN1MsT0FBTyxFQUFFLEVBQUU7UUFBRStOLFNBQVMsRUFBRTtNQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7SUFDdkU7SUFFQSxNQUFNK0UsTUFBTSxHQUFHeEgsTUFBTSxDQUFDMUgsSUFBSSxFQUFFLENBQUN5SyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBRXhDLE1BQU0wRSxPQUFPLEdBQUcsRUFBRTtJQUNsQixLQUFLLElBQUk3QixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUc0QixNQUFNLENBQUN6UixNQUFNLEVBQUU2UCxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3pDLE1BQU04QixJQUFJLEdBQUdGLE1BQU0sQ0FBQzVCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ3ROLElBQUksRUFBRTtNQUNqQyxJQUFJMkosS0FBSyxHQUFHLEVBQUU7TUFDZCxJQUFJcUYsWUFBWSxFQUFFO1FBQ2hCLE1BQU1QLEtBQUssR0FBR1MsTUFBTSxDQUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQjNELEtBQUssR0FBRyxJQUFBeUQsa0JBQVMsRUFBQ3FCLEtBQUssQ0FBQ3pPLElBQUksRUFBRSxDQUFDO01BQ2pDO01BRUEsTUFBTTtRQUFDNUQsT0FBTyxFQUFFZ08sV0FBVztRQUFFSjtNQUFTLENBQUMsR0FBRyxJQUFBcUYsNENBQW1DLEVBQUNELElBQUksQ0FBQztNQUVuRkQsT0FBTyxDQUFDalAsSUFBSSxDQUFDO1FBQ1grTyxHQUFHLEVBQUVDLE1BQU0sQ0FBQzVCLENBQUMsQ0FBQyxJQUFJNEIsTUFBTSxDQUFDNUIsQ0FBQyxDQUFDLENBQUN0TixJQUFJLEVBQUU7UUFDbENpTCxNQUFNLEVBQUUsSUFBSXFFLGVBQU0sQ0FBQ0osTUFBTSxDQUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJNEIsTUFBTSxDQUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDdE4sSUFBSSxFQUFFLEVBQUVrUCxNQUFNLENBQUM1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk0QixNQUFNLENBQUM1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUN0TixJQUFJLEVBQUUsQ0FBQztRQUNoR3VQLFVBQVUsRUFBRUMsUUFBUSxDQUFDTixNQUFNLENBQUM1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3ZDakQsY0FBYyxFQUFFNkUsTUFBTSxDQUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QmxELFdBQVc7UUFDWEosU0FBUztRQUNURyxTQUFTLEVBQUUsS0FBSztRQUNoQlI7TUFDRixDQUFDLENBQUM7SUFDSjtJQUNBLE9BQU93RixPQUFPO0VBQ2hCO0VBRUEsTUFBTU0sVUFBVSxDQUFDeFMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQzdCLE1BQU07TUFBQ0ssR0FBRztNQUFFc1I7SUFBRyxDQUFDO01BQUl0UixHQUFHLEVBQUUsQ0FBQztNQUFFc1IsR0FBRyxFQUFFO0lBQU0sR0FBSzNSLE9BQU8sQ0FBQzs7SUFFcEQ7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOztJQUVBLE1BQU13RCxTQUFTLEdBQUcsSUFBSTtJQUN0QixNQUFNaVAsZUFBZSxHQUFHQyxNQUFNLENBQUNDLFlBQVksQ0FBQ0osUUFBUSxDQUFDL08sU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLE1BQU15TyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUseUJBQXlCLENBQUM7SUFDdEUsTUFBTVcsTUFBTSxHQUFHWCxNQUFNLENBQUMzUCxJQUFJLENBQUUsS0FBSWtCLFNBQVUsRUFBQyxDQUFDO0lBRTVDLElBQUk7TUFDRixNQUFNaUgsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDLENBQzdCLEtBQUssRUFBRyxZQUFXeVIsTUFBTyxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRXZTLEdBQUcsRUFBRXNSLEdBQUcsRUFBRSxJQUFJLENBQ3hELENBQUM7TUFFRixPQUFPbEgsTUFBTSxDQUFDK0MsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUN0QmhPLE1BQU0sQ0FBQyxDQUFDQyxHQUFHLEVBQUVpTyxJQUFJLEtBQUs7UUFDckIsSUFBSUEsSUFBSSxDQUFDbE4sTUFBTSxLQUFLLENBQUMsRUFBRTtVQUFFLE9BQU9mLEdBQUc7UUFBRTtRQUVyQyxNQUFNLENBQUNvVCxFQUFFLEVBQUVDLEVBQUUsRUFBRUMsRUFBRSxFQUFFQyxFQUFFLEVBQUVqRixRQUFRLENBQUMsR0FBR0wsSUFBSSxDQUFDRixLQUFLLENBQUNpRixlQUFlLENBQUM7UUFDOUQxRSxRQUFRLENBQ0xQLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDWHhDLEdBQUcsQ0FBQ2lJLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxLQUFLLENBQUNDLHdCQUFlLENBQUMsQ0FBQyxDQUM5QzFGLE1BQU0sQ0FBQ3lGLEtBQUssSUFBSUEsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUMvQnBFLE9BQU8sQ0FBQyxDQUFDLENBQUN2RCxDQUFDLEVBQUU0QyxJQUFJLEVBQUVDLEtBQUssQ0FBQyxLQUFLO1VBQUUzTyxHQUFHLENBQUMyTyxLQUFLLENBQUMsR0FBR0QsSUFBSTtRQUFFLENBQUMsQ0FBQztRQUV4RDFPLEdBQUcsQ0FBQ3FULEVBQUUsQ0FBQyxHQUFHRCxFQUFFO1FBQ1pwVCxHQUFHLENBQUN1VCxFQUFFLENBQUMsR0FBR0QsRUFBRTtRQUVaLE9BQU90VCxHQUFHO01BQ1osQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1YsQ0FBQyxDQUFDLE9BQU8wSCxHQUFHLEVBQUU7TUFDWixJQUFJLGtCQUFrQixDQUFDc0MsSUFBSSxDQUFDdEMsR0FBRyxDQUFDNkIsTUFBTSxDQUFDLElBQUkscUJBQXFCLENBQUNTLElBQUksQ0FBQ3RDLEdBQUcsQ0FBQzZCLE1BQU0sQ0FBQyxFQUFFO1FBQ2pGLE9BQU8sRUFBRTtNQUNYLENBQUMsTUFBTTtRQUNMLE1BQU03QixHQUFHO01BQ1g7SUFDRjtFQUNGO0VBRUFrSCxhQUFhLENBQUMrRSxhQUFhLEVBQUVyRixRQUFRLEVBQUU7SUFDckMsTUFBTTNNLElBQUksR0FBRyxDQUFDLG9CQUFvQixDQUFDO0lBQ25DLEtBQUssTUFBTTZSLE9BQU8sSUFBSWxGLFFBQVEsRUFBRTtNQUM5QjNNLElBQUksQ0FBQzZCLElBQUksQ0FBQyxXQUFXLEVBQUcsR0FBRWdRLE9BQU8sQ0FBQ2hGLEtBQU0sSUFBR2dGLE9BQU8sQ0FBQy9FLEtBQU0sRUFBQyxDQUFDO0lBQzdEO0lBQ0EsT0FBTyxJQUFJLENBQUMvTSxJQUFJLENBQUNDLElBQUksRUFBRTtNQUFDRSxLQUFLLEVBQUU4UjtJQUFhLENBQUMsQ0FBQztFQUNoRDtFQUVBQyxpQkFBaUIsQ0FBQ3JFLFFBQVEsRUFBRTtJQUMxQixPQUFPLElBQUksQ0FBQzdOLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRyxJQUFHLElBQUE4SixxQkFBWSxFQUFDK0QsUUFBUSxDQUFFLEVBQUMsQ0FBQyxDQUFDO0VBQzFEOztFQUVBO0FBQ0Y7QUFDQTtFQUNFc0UsS0FBSyxDQUFDQyxVQUFVLEVBQUU7SUFDaEIsT0FBTyxJQUFJLENBQUNqSyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUVpSyxVQUFVLENBQUMsRUFBRTtNQUFDN1IsY0FBYyxFQUFFO0lBQUksQ0FBQyxDQUFDO0VBQ3BFO0VBRUE4UixTQUFTLENBQUM5SSxTQUFTLEVBQUU7SUFDbkIsT0FBTyxJQUFBaUIsbUJBQVUsRUFBQ3BJLGFBQUksQ0FBQ2pCLElBQUksQ0FBQ29JLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDbEQsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO0VBQzFFO0VBRUFpTSxVQUFVLEdBQUc7SUFDWCxPQUFPLElBQUksQ0FBQ3RTLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRTtNQUFDTyxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUM7RUFDaEU7RUFFQWdTLFlBQVksQ0FBQ0MsSUFBSSxFQUFFN0ksS0FBSyxFQUFFO0lBQ3hCLElBQUlBLEtBQUssQ0FBQ3RLLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDdEIsT0FBT0ksT0FBTyxDQUFDK0IsT0FBTyxFQUFFO0lBQzFCO0lBRUEsT0FBTyxJQUFJLENBQUN4QixJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUcsS0FBSXdTLElBQUssRUFBQyxFQUFFLEdBQUc3SSxLQUFLLENBQUNFLEdBQUcsQ0FBQ0MscUJBQVksQ0FBQyxDQUFDLENBQUM7RUFDekU7O0VBRUE7QUFDRjtBQUNBO0VBQ0UsTUFBTTJJLFVBQVUsQ0FBQ2xKLFNBQVMsRUFBRTtJQUMxQixNQUFNNkQsT0FBTyxHQUFHLE1BQU0zTixPQUFPLENBQUNpVCxHQUFHLENBQUMsQ0FDaEMsSUFBQWxJLG1CQUFVLEVBQUNwSSxhQUFJLENBQUNqQixJQUFJLENBQUNvSSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUMsRUFDaEQsSUFBQWlCLG1CQUFVLEVBQUNwSSxhQUFJLENBQUNqQixJQUFJLENBQUNvSSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FDakQsQ0FBQztJQUNGLE9BQU82RCxPQUFPLENBQUN1RixJQUFJLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxDQUFDO0VBQzdCOztFQUVBO0FBQ0Y7QUFDQTtFQUNFQyxLQUFLLENBQUNDLFNBQVMsRUFBRWpVLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUM3QixNQUFNb0IsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQ3RCLElBQUlwQixPQUFPLENBQUNrVSxPQUFPLEVBQUU7TUFBRTlTLElBQUksQ0FBQzZCLElBQUksQ0FBQyxZQUFZLENBQUM7SUFBRTtJQUNoRCxJQUFJakQsT0FBTyxDQUFDbVUsSUFBSSxFQUFFO01BQUUvUyxJQUFJLENBQUM2QixJQUFJLENBQUMsUUFBUSxDQUFDO0lBQUU7SUFDekMsSUFBSWpELE9BQU8sQ0FBQ29VLFNBQVMsRUFBRTtNQUFFaFQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUFFO0lBQ25ELElBQUlqRCxPQUFPLENBQUNxVSxnQkFBZ0IsRUFBRTtNQUFFalQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFVBQVUsRUFBRWpELE9BQU8sQ0FBQ3NVLFVBQVUsQ0FBQztJQUFFO0lBQzNFbFQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDZ1IsU0FBUyxFQUFFLElBQUksQ0FBQ2xVLFVBQVUsQ0FBQztJQUVyQyxPQUFPLElBQUksQ0FBQ29CLElBQUksQ0FBQ0MsSUFBSSxFQUFFO01BQUNHLGtCQUFrQixFQUFFLElBQUk7TUFBRUcsY0FBYyxFQUFFO0lBQUksQ0FBQyxDQUFDO0VBQzFFO0VBRUE2UyxLQUFLLENBQUNELFVBQVUsRUFBRWYsVUFBVSxFQUFFO0lBQzVCLE9BQU8sSUFBSSxDQUFDcFMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFbVQsVUFBVSxFQUFFZixVQUFVLENBQUMsRUFBRTtNQUFDaFMsa0JBQWtCLEVBQUUsSUFBSTtNQUFFRyxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUM7RUFDdkc7RUFFQThTLElBQUksQ0FBQ0YsVUFBVSxFQUFFZixVQUFVLEVBQUV2VCxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDekMsTUFBTW9CLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRWtULFVBQVUsRUFBRXRVLE9BQU8sQ0FBQ3lVLE9BQU8sSUFBSWxCLFVBQVUsQ0FBQztJQUNoRSxJQUFJdlQsT0FBTyxDQUFDMFUsTUFBTSxFQUFFO01BQ2xCdFQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN4QjtJQUNBLE9BQU8sSUFBSSxDQUFDcUcsT0FBTyxDQUFDbEksSUFBSSxFQUFFO01BQUNHLGtCQUFrQixFQUFFLElBQUk7TUFBRUcsY0FBYyxFQUFFO0lBQUksQ0FBQyxDQUFDO0VBQzdFO0VBRUF1QixJQUFJLENBQUNxUixVQUFVLEVBQUVmLFVBQVUsRUFBRXZULE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUN6QyxNQUFNb0IsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFa1QsVUFBVSxJQUFJLFFBQVEsRUFBRXRVLE9BQU8sQ0FBQ3lVLE9BQU8sSUFBSyxjQUFhbEIsVUFBVyxFQUFDLENBQUM7SUFDNUYsSUFBSXZULE9BQU8sQ0FBQzJVLFdBQVcsRUFBRTtNQUFFdlQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQUU7SUFDeEQsSUFBSWpELE9BQU8sQ0FBQzRVLEtBQUssRUFBRTtNQUFFeFQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUFFO0lBQzNDLE9BQU8sSUFBSSxDQUFDOUIsSUFBSSxDQUFDQyxJQUFJLEVBQUU7TUFBQ0csa0JBQWtCLEVBQUUsSUFBSTtNQUFFRyxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUM7RUFDMUU7O0VBRUE7QUFDRjtBQUNBO0VBQ0VtVCxLQUFLLENBQUNuVixJQUFJLEVBQUVvVixRQUFRLEdBQUcsTUFBTSxFQUFFO0lBQzdCLE1BQU1DLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLENBQUNBLFVBQVUsQ0FBQzVMLFFBQVEsQ0FBQ3pKLElBQUksQ0FBQyxFQUFFO01BQzlCLE1BQU0sSUFBSVQsS0FBSyxDQUFFLGdCQUFlUyxJQUFLLHFCQUFvQnFWLFVBQVUsQ0FBQ3pTLElBQUksQ0FBQyxJQUFJLENBQUUsRUFBQyxDQUFDO0lBQ25GO0lBQ0EsT0FBTyxJQUFJLENBQUNuQixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUcsS0FBSXpCLElBQUssRUFBQyxFQUFFb1YsUUFBUSxDQUFDLENBQUM7RUFDcEQ7RUFFQUUsU0FBUyxDQUFDckQsR0FBRyxFQUFFO0lBQ2IsT0FBTyxJQUFJLENBQUN4USxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFd1EsR0FBRyxDQUFDLENBQUM7RUFDN0M7O0VBRUE7QUFDRjtBQUNBO0VBQ0VzRCxRQUFRLENBQUMxQixVQUFVLEVBQUV2VCxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDakMsTUFBTW9CLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUN6QixJQUFJcEIsT0FBTyxDQUFDa1YsU0FBUyxFQUFFO01BQ3JCOVQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQjtJQUNBN0IsSUFBSSxDQUFDNkIsSUFBSSxDQUFDc1EsVUFBVSxDQUFDO0lBQ3JCLElBQUl2VCxPQUFPLENBQUNtVixVQUFVLEVBQUU7TUFDdEIsSUFBSW5WLE9BQU8sQ0FBQ29WLEtBQUssRUFBRTtRQUFFaFUsSUFBSSxDQUFDNkIsSUFBSSxDQUFDLFNBQVMsQ0FBQztNQUFFO01BQzNDN0IsSUFBSSxDQUFDNkIsSUFBSSxDQUFDakQsT0FBTyxDQUFDbVYsVUFBVSxDQUFDO0lBQy9CO0lBRUEsT0FBTyxJQUFJLENBQUNoVSxJQUFJLENBQUNDLElBQUksRUFBRTtNQUFDTSxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUM7RUFDaEQ7RUFFQSxNQUFNMlQsV0FBVyxHQUFHO0lBQ2xCLE1BQU16QyxNQUFNLEdBQUcsQ0FDYixlQUFlLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUM5QyxhQUFhLEVBQUUsd0JBQXdCLEVBQUUsdUJBQXVCLEVBQ2hFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FDckQsQ0FBQ3RRLElBQUksQ0FBQyxLQUFLLENBQUM7SUFFYixNQUFNbUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDLENBQUMsY0FBYyxFQUFHLFlBQVd5UixNQUFPLEVBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2RixPQUFPbkksTUFBTSxDQUFDMUgsSUFBSSxFQUFFLENBQUN5SyxLQUFLLENBQUNtQywwQkFBaUIsQ0FBQyxDQUFDM0UsR0FBRyxDQUFDMEMsSUFBSSxJQUFJO01BQ3hELE1BQU0sQ0FDSnNFLEdBQUcsRUFBRXNELElBQUksRUFBRW5ILElBQUksRUFDZm9ILG1CQUFtQixFQUFFQyxrQkFBa0IsRUFBRUMsaUJBQWlCLEVBQzFEQyxlQUFlLEVBQUVDLGNBQWMsRUFBRUMsYUFBYSxDQUMvQyxHQUFHbEksSUFBSSxDQUFDRixLQUFLLENBQUMsSUFBSSxDQUFDO01BRXBCLE1BQU1xSSxNQUFNLEdBQUc7UUFBQzFILElBQUk7UUFBRTZELEdBQUc7UUFBRXNELElBQUksRUFBRUEsSUFBSSxLQUFLO01BQUcsQ0FBQztNQUM5QyxJQUFJQyxtQkFBbUIsSUFBSUMsa0JBQWtCLElBQUlDLGlCQUFpQixFQUFFO1FBQ2xFSSxNQUFNLENBQUNDLFFBQVEsR0FBRztVQUNoQkMsV0FBVyxFQUFFUixtQkFBbUI7VUFDaENqQixVQUFVLEVBQUVrQixrQkFBa0I7VUFDOUJRLFNBQVMsRUFBRVA7UUFDYixDQUFDO01BQ0g7TUFDQSxJQUFJSSxNQUFNLENBQUNDLFFBQVEsSUFBSUosZUFBZSxJQUFJQyxjQUFjLElBQUlDLGFBQWEsRUFBRTtRQUN6RUMsTUFBTSxDQUFDNVMsSUFBSSxHQUFHO1VBQ1o4UyxXQUFXLEVBQUVMLGVBQWU7VUFDNUJwQixVQUFVLEVBQUVxQixjQUFjLElBQUtFLE1BQU0sQ0FBQ0MsUUFBUSxJQUFJRCxNQUFNLENBQUNDLFFBQVEsQ0FBQ3hCLFVBQVc7VUFDN0UwQixTQUFTLEVBQUVKLGFBQWEsSUFBS0MsTUFBTSxDQUFDQyxRQUFRLElBQUlELE1BQU0sQ0FBQ0MsUUFBUSxDQUFDRTtRQUNsRSxDQUFDO01BQ0g7TUFDQSxPQUFPSCxNQUFNO0lBQ2YsQ0FBQyxDQUFDO0VBQ0o7RUFFQSxNQUFNSSxxQkFBcUIsQ0FBQ2pFLEdBQUcsRUFBRWtFLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUM1QyxNQUFNOVUsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFFLFlBQVksRUFBRTRRLEdBQUcsQ0FBQztJQUNqRSxJQUFJa0UsTUFBTSxDQUFDQyxTQUFTLElBQUlELE1BQU0sQ0FBQ0UsVUFBVSxFQUFFO01BQ3pDaFYsSUFBSSxDQUFDdUwsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQzVCLENBQUMsTUFBTSxJQUFJdUosTUFBTSxDQUFDRSxVQUFVLEVBQUU7TUFDNUJoVixJQUFJLENBQUN1TCxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxXQUFXLENBQUM7SUFDaEM7SUFDQSxJQUFJdUosTUFBTSxDQUFDRyxPQUFPLEVBQUU7TUFDbEJqVixJQUFJLENBQUM2QixJQUFJLENBQUNpVCxNQUFNLENBQUNHLE9BQU8sQ0FBQztJQUMzQjtJQUNBLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQ2xWLElBQUksQ0FBQ0MsSUFBSSxDQUFDLEVBQUUyQixJQUFJLEVBQUUsQ0FBQ3lLLEtBQUssQ0FBQ21DLDBCQUFpQixDQUFDO0VBQ2hFO0VBRUEyRyxhQUFhLENBQUN4TCxLQUFLLEVBQUVnSyxRQUFRLEVBQUU7SUFDN0IsSUFBSWhLLEtBQUssQ0FBQ3RLLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFBRSxPQUFPLElBQUk7SUFBRTtJQUN2QyxNQUFNWSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDekIsSUFBSTBULFFBQVEsRUFBRTtNQUFFMVQsSUFBSSxDQUFDNkIsSUFBSSxDQUFDNlIsUUFBUSxDQUFDO0lBQUU7SUFDckMsT0FBTyxJQUFJLENBQUMzVCxJQUFJLENBQUNDLElBQUksQ0FBQzJKLE1BQU0sQ0FBQyxJQUFJLEVBQUVELEtBQUssQ0FBQ0UsR0FBRyxDQUFDQyxxQkFBWSxDQUFDLENBQUMsRUFBRTtNQUFDdkosY0FBYyxFQUFFO0lBQUksQ0FBQyxDQUFDO0VBQ3RGO0VBRUEsTUFBTTZVLFlBQVksR0FBRztJQUNuQixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUNwVixJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTRCLElBQUksRUFBRTtFQUMxRjtFQUVBLE1BQU1xSSxTQUFTLENBQUM4SyxNQUFNLEVBQUU7SUFBQ007RUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDcEMsSUFBSS9MLE1BQU07SUFDVixJQUFJO01BQ0YsSUFBSXJKLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztNQUNyQixJQUFJb1YsS0FBSyxFQUFFO1FBQUVwVixJQUFJLENBQUM2QixJQUFJLENBQUMsU0FBUyxDQUFDO01BQUU7TUFDbkM3QixJQUFJLEdBQUdBLElBQUksQ0FBQzJKLE1BQU0sQ0FBQ21MLE1BQU0sQ0FBQztNQUMxQnpMLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ3RKLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBQ2hDLENBQUMsQ0FBQyxPQUFPK0YsR0FBRyxFQUFFO01BQ1osSUFBSUEsR0FBRyxDQUFDNEIsSUFBSSxLQUFLLENBQUMsSUFBSTVCLEdBQUcsQ0FBQzRCLElBQUksS0FBSyxHQUFHLEVBQUU7UUFDdEM7UUFDQSxPQUFPLElBQUk7TUFDYixDQUFDLE1BQU07UUFDTCxNQUFNNUIsR0FBRztNQUNYO0lBQ0Y7SUFFQSxPQUFPc0QsTUFBTSxDQUFDMUgsSUFBSSxFQUFFO0VBQ3RCO0VBRUEwVCxTQUFTLENBQUNQLE1BQU0sRUFBRWhJLEtBQUssRUFBRTtJQUFDd0ksVUFBVTtJQUFFQztFQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNsRCxJQUFJdlYsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQ3JCLElBQUlzVixVQUFVLEVBQUU7TUFBRXRWLElBQUksQ0FBQzZCLElBQUksQ0FBQyxlQUFlLENBQUM7SUFBRTtJQUM5QyxJQUFJMFQsTUFBTSxFQUFFO01BQUV2VixJQUFJLENBQUM2QixJQUFJLENBQUMsVUFBVSxDQUFDO0lBQUU7SUFDckM3QixJQUFJLEdBQUdBLElBQUksQ0FBQzJKLE1BQU0sQ0FBQ21MLE1BQU0sRUFBRWhJLEtBQUssQ0FBQztJQUNqQyxPQUFPLElBQUksQ0FBQy9NLElBQUksQ0FBQ0MsSUFBSSxFQUFFO01BQUNNLGNBQWMsRUFBRTtJQUFJLENBQUMsQ0FBQztFQUNoRDtFQUVBa1YsV0FBVyxDQUFDVixNQUFNLEVBQUU7SUFDbEIsT0FBTyxJQUFJLENBQUMvVSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFK1UsTUFBTSxDQUFDLEVBQUU7TUFBQ3hVLGNBQWMsRUFBRTtJQUFJLENBQUMsQ0FBQztFQUN6RTtFQUVBLE1BQU1tVixVQUFVLEdBQUc7SUFDakIsSUFBSXBNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ1csU0FBUyxDQUFDLENBQUMsY0FBYyxFQUFFLHFCQUFxQixDQUFDLEVBQUU7TUFBQ29MLEtBQUssRUFBRTtJQUFJLENBQUMsQ0FBQztJQUN6RixJQUFJL0wsTUFBTSxFQUFFO01BQ1ZBLE1BQU0sR0FBR0EsTUFBTSxDQUFDMUgsSUFBSSxFQUFFO01BQ3RCLElBQUksQ0FBQzBILE1BQU0sQ0FBQ2pLLE1BQU0sRUFBRTtRQUFFLE9BQU8sRUFBRTtNQUFFO01BQ2pDLE9BQU9pSyxNQUFNLENBQUMrQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUN4QyxHQUFHLENBQUMwQyxJQUFJLElBQUk7UUFDcEMsTUFBTXdGLEtBQUssR0FBR3hGLElBQUksQ0FBQ3dGLEtBQUssQ0FBQywwQkFBMEIsQ0FBQztRQUNwRCxPQUFPO1VBQ0wvRSxJQUFJLEVBQUUrRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1VBQ2Q0RCxHQUFHLEVBQUU1RCxLQUFLLENBQUMsQ0FBQztRQUNkLENBQUM7TUFDSCxDQUFDLENBQUM7SUFDSixDQUFDLE1BQU07TUFDTCxPQUFPLEVBQUU7SUFDWDtFQUNGO0VBRUE2RCxTQUFTLENBQUM1SSxJQUFJLEVBQUUySSxHQUFHLEVBQUU7SUFDbkIsT0FBTyxJQUFJLENBQUMzVixJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFZ04sSUFBSSxFQUFFMkksR0FBRyxDQUFDLENBQUM7RUFDaEQ7RUFFQSxNQUFNRSxVQUFVLENBQUM7SUFBQ2hJLFFBQVE7SUFBRTFOO0VBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3ZDLElBQUltSixNQUFNO0lBQ1YsSUFBSXVFLFFBQVEsRUFBRTtNQUNaLElBQUk7UUFDRnZFLE1BQU0sR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRTZOLFFBQVEsQ0FBQyxFQUFFO1VBQUN0TixjQUFjLEVBQUU7UUFBSSxDQUFDLENBQUMsRUFBRXFCLElBQUksRUFBRTtNQUM1RixDQUFDLENBQUMsT0FBT3lHLENBQUMsRUFBRTtRQUNWLElBQUlBLENBQUMsQ0FBQ1IsTUFBTSxJQUFJUSxDQUFDLENBQUNSLE1BQU0sQ0FBQ2tLLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxFQUFFO1VBQ2xGekksTUFBTSxHQUFHLElBQUk7UUFDZixDQUFDLE1BQU07VUFDTCxNQUFNakIsQ0FBQztRQUNUO01BQ0Y7SUFDRixDQUFDLE1BQU0sSUFBSWxJLEtBQUssRUFBRTtNQUNoQm1KLE1BQU0sR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTtRQUFDRyxLQUFLO1FBQUVJLGNBQWMsRUFBRTtNQUFJLENBQUMsQ0FBQyxFQUFFcUIsSUFBSSxFQUFFO0lBQ3BHLENBQUMsTUFBTTtNQUNMLE1BQU0sSUFBSTlELEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQztJQUNuRDtJQUNBLE9BQU93TCxNQUFNO0VBQ2Y7RUFFQSxNQUFNd00sZ0JBQWdCLENBQUNDLFdBQVcsRUFBRWxGLEdBQUcsRUFBRTtJQUN2QyxNQUFNdkgsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDdEosSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRTZRLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU16SCxnQkFBRSxDQUFDNE0sU0FBUyxDQUFDRCxXQUFXLEVBQUV6TSxNQUFNLEVBQUU7TUFBQ29CLFFBQVEsRUFBRTtJQUFNLENBQUMsQ0FBQztJQUMzRCxPQUFPcUwsV0FBVztFQUNwQjtFQUVBLE1BQU1FLGVBQWUsQ0FBQ3BGLEdBQUcsRUFBRTtJQUN6QixPQUFPLE1BQU0sSUFBSSxDQUFDN1EsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRTZRLEdBQUcsQ0FBQyxDQUFDO0VBQ2pEO0VBRUEsTUFBTXFGLFNBQVMsQ0FBQ0MsUUFBUSxFQUFFQyxjQUFjLEVBQUVDLFVBQVUsRUFBRUMsVUFBVSxFQUFFO0lBQ2hFLE1BQU1yVyxJQUFJLEdBQUcsQ0FDWCxZQUFZLEVBQUUsSUFBSSxFQUFFa1csUUFBUSxFQUFFQyxjQUFjLEVBQUVDLFVBQVUsRUFDeEQsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FDL0Q7SUFDRCxJQUFJL00sTUFBTTtJQUNWLElBQUlpTixRQUFRLEdBQUcsS0FBSztJQUNwQixJQUFJO01BQ0ZqTixNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUN0SixJQUFJLENBQUNDLElBQUksQ0FBQztJQUNoQyxDQUFDLENBQUMsT0FBT29JLENBQUMsRUFBRTtNQUNWLElBQUlBLENBQUMsWUFBWXhLLFFBQVEsSUFBSXdLLENBQUMsQ0FBQ1QsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUN6QzBCLE1BQU0sR0FBR2pCLENBQUMsQ0FBQ1AsTUFBTTtRQUNqQnlPLFFBQVEsR0FBRyxJQUFJO01BQ2pCLENBQUMsTUFBTTtRQUNMLE1BQU1sTyxDQUFDO01BQ1Q7SUFDRjs7SUFFQTtJQUNBO0lBQ0EsTUFBTW1PLGtCQUFrQixHQUFHcFUsYUFBSSxDQUFDWixPQUFPLENBQUMsSUFBSSxDQUFDNUMsVUFBVSxFQUFFMFgsVUFBVSxDQUFDO0lBQ3BFLE1BQU1sTixnQkFBRSxDQUFDNE0sU0FBUyxDQUFDUSxrQkFBa0IsRUFBRWxOLE1BQU0sRUFBRTtNQUFDb0IsUUFBUSxFQUFFO0lBQU0sQ0FBQyxDQUFDO0lBRWxFLE9BQU87TUFBQ21ELFFBQVEsRUFBRXNJLFFBQVE7TUFBRUcsVUFBVTtNQUFFQztJQUFRLENBQUM7RUFDbkQ7RUFFQSxNQUFNRSx5QkFBeUIsQ0FBQzVJLFFBQVEsRUFBRTZJLGFBQWEsRUFBRUMsT0FBTyxFQUFFQyxTQUFTLEVBQUU7SUFDM0UsTUFBTUMsV0FBVyxHQUFHLElBQUEvTSxxQkFBWSxFQUFDK0QsUUFBUSxDQUFDO0lBQzFDLE1BQU1pSixRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUNDLFdBQVcsQ0FBQ2xKLFFBQVEsQ0FBQztJQUNqRCxJQUFJbUosU0FBUyxHQUFJLCtDQUE4Q0gsV0FBWSxJQUFHO0lBQzlFLElBQUlILGFBQWEsRUFBRTtNQUFFTSxTQUFTLElBQUssR0FBRUYsUUFBUyxJQUFHSixhQUFjLE9BQU1HLFdBQVksSUFBRztJQUFFO0lBQ3RGLElBQUlGLE9BQU8sRUFBRTtNQUFFSyxTQUFTLElBQUssR0FBRUYsUUFBUyxJQUFHSCxPQUFRLE9BQU1FLFdBQVksSUFBRztJQUFFO0lBQzFFLElBQUlELFNBQVMsRUFBRTtNQUFFSSxTQUFTLElBQUssR0FBRUYsUUFBUyxJQUFHRixTQUFVLE9BQU1DLFdBQVksSUFBRztJQUFFO0lBQzlFLE9BQU8sSUFBSSxDQUFDN1csSUFBSSxDQUFDLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxFQUFFO01BQUNHLEtBQUssRUFBRTZXLFNBQVM7TUFBRXpXLGNBQWMsRUFBRTtJQUFJLENBQUMsQ0FBQztFQUM5RjtFQUVBLE1BQU13VyxXQUFXLENBQUNsSixRQUFRLEVBQUU7SUFDMUIsTUFBTXZFLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ3RKLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUE4SixxQkFBWSxFQUFDK0QsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNyRixJQUFJdkUsTUFBTSxFQUFFO01BQ1YsT0FBT0EsTUFBTSxDQUFDbEIsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxNQUFNO01BQ0wsTUFBTWtILFVBQVUsR0FBRyxNQUFNLElBQUFDLHlCQUFnQixFQUFDbk4sYUFBSSxDQUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQ3ZDLFVBQVUsRUFBRWlQLFFBQVEsQ0FBQyxDQUFDO01BQy9FLE1BQU0yQixPQUFPLEdBQUcsTUFBTSxJQUFBQyxzQkFBYSxFQUFDck4sYUFBSSxDQUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQ3ZDLFVBQVUsRUFBRWlQLFFBQVEsQ0FBQyxDQUFDO01BQ3pFLElBQUkyQixPQUFPLEVBQUU7UUFDWCxPQUFPTSxhQUFJLENBQUNDLEtBQUssQ0FBQ0UsT0FBTztNQUMzQixDQUFDLE1BQU0sSUFBSVgsVUFBVSxFQUFFO1FBQ3JCLE9BQU9RLGFBQUksQ0FBQ0MsS0FBSyxDQUFDQyxVQUFVO01BQzlCLENBQUMsTUFBTTtRQUNMLE9BQU9GLGFBQUksQ0FBQ0MsS0FBSyxDQUFDRyxNQUFNO01BQzFCO0lBQ0Y7RUFDRjtFQUVBK0csT0FBTyxHQUFHO0lBQ1IsSUFBSSxDQUFDbFksWUFBWSxDQUFDK0gsT0FBTyxFQUFFO0VBQzdCO0FBQ0Y7QUFBQztBQUFBLGdCQW5qQ29CbkksbUJBQW1CLHFCQUNiO0VBQ3ZCd0IsS0FBSyxFQUFFLElBQUk7RUFDWEMsa0JBQWtCLEVBQUUsS0FBSztFQUN6QkMsYUFBYSxFQUFFLEtBQUs7RUFDcEJDLGdCQUFnQixFQUFFLEtBQUs7RUFDdkJDLGNBQWMsRUFBRTtBQUNsQixDQUFDO0FBOGlDSCxTQUFTNFAsbUJBQW1CLENBQUN0QyxRQUFRLEVBQUU2QixRQUFRLEVBQUVoRCxJQUFJLEVBQUVtRCxRQUFRLEVBQUU7RUFDL0QsTUFBTXFILEtBQUssR0FBRyxFQUFFO0VBQ2hCLElBQUl4SCxRQUFRLEVBQUU7SUFDWixJQUFJeUgsU0FBUztJQUNiLElBQUlDLEtBQUs7SUFDVCxJQUFJMUssSUFBSSxLQUFLb0QsYUFBSSxDQUFDQyxLQUFLLENBQUNFLE9BQU8sRUFBRTtNQUMvQmtILFNBQVMsR0FBRyxLQUFLO01BQ2pCQyxLQUFLLEdBQUcsQ0FBRSxJQUFHLElBQUF0TixxQkFBWSxFQUFDK0YsUUFBUSxDQUFFLEVBQUMsRUFBRSw4QkFBOEIsQ0FBQztJQUN4RSxDQUFDLE1BQU07TUFDTHNILFNBQVMsR0FBR3pILFFBQVEsQ0FBQ0EsUUFBUSxDQUFDclEsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUk7TUFDbEQrWCxLQUFLLEdBQUcxSCxRQUFRLENBQUM5TixJQUFJLEVBQUUsQ0FBQ3lLLEtBQUssQ0FBQ21DLDBCQUFpQixDQUFDLENBQUMzRSxHQUFHLENBQUMwQyxJQUFJLElBQUssSUFBR0EsSUFBSyxFQUFDLENBQUM7SUFDMUU7SUFDQSxJQUFJNEssU0FBUyxFQUFFO01BQUVDLEtBQUssQ0FBQ3RWLElBQUksQ0FBQyw4QkFBOEIsQ0FBQztJQUFFO0lBQzdEb1YsS0FBSyxDQUFDcFYsSUFBSSxDQUFDO01BQ1RzVixLQUFLO01BQ0xDLFlBQVksRUFBRSxDQUFDO01BQ2ZDLFlBQVksRUFBRSxDQUFDO01BQ2ZDLFlBQVksRUFBRSxDQUFDO01BQ2ZDLE9BQU8sRUFBRSxFQUFFO01BQ1hDLFlBQVksRUFBRU4sU0FBUyxHQUFHQyxLQUFLLENBQUMvWCxNQUFNLEdBQUcsQ0FBQyxHQUFHK1gsS0FBSyxDQUFDL1g7SUFDckQsQ0FBQyxDQUFDO0VBQ0o7RUFDQSxPQUFPO0lBQ0w4UCxPQUFPLEVBQUUsSUFBSTtJQUNiQyxPQUFPLEVBQUUsSUFBQTVGLHdCQUFlLEVBQUNxRSxRQUFRLENBQUM7SUFDbEM2SixPQUFPLEVBQUUsSUFBSTtJQUNiM00sT0FBTyxFQUFFMkIsSUFBSTtJQUNiK0IsTUFBTSxFQUFFLE9BQU87SUFDZnlJO0VBQ0YsQ0FBQztBQUNIIn0=