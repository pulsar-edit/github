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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX29zIiwiX2NoaWxkX3Byb2Nlc3MiLCJfZnNFeHRyYSIsIl91dGlsIiwiX2VsZWN0cm9uIiwiX2V2ZW50S2l0IiwiX2R1Z2l0ZSIsIl93aGF0VGhlRGlmZiIsIl93aGF0VGhlU3RhdHVzIiwiX2dpdFByb21wdFNlcnZlciIsIl9naXRUZW1wRGlyIiwiX2FzeW5jUXVldWUiLCJfcmVwb3J0ZXJQcm94eSIsIl9oZWxwZXJzIiwiX2dpdFRpbWluZ3NWaWV3IiwiX2ZpbGUiLCJfd29ya2VyTWFuYWdlciIsIl9hdXRob3IiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIm93bktleXMiLCJvYmplY3QiLCJlbnVtZXJhYmxlT25seSIsImtleXMiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwiZm9yRWFjaCIsImtleSIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTUFYX1NUQVRVU19PVVRQVVRfTEVOR1RIIiwiaGVhZGxlc3MiLCJleGVjUGF0aFByb21pc2UiLCJHaXRFcnJvciIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJtZXNzYWdlIiwic3RhY2siLCJleHBvcnRzIiwiTGFyZ2VSZXBvRXJyb3IiLCJJR05PUkVEX0dJVF9DT01NQU5EUyIsIkRJU0FCTEVfQ09MT1JfRkxBR1MiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwidW5zaGlmdCIsIkVYUEFORF9USUxERV9SRUdFWCIsIlJlZ0V4cCIsIkdpdFNoZWxsT3V0U3RyYXRlZ3kiLCJ3b3JraW5nRGlyIiwib3B0aW9ucyIsInF1ZXVlIiwiY29tbWFuZFF1ZXVlIiwicGFyYWxsZWxpc20iLCJNYXRoIiwibWF4Iiwib3MiLCJjcHVzIiwiQXN5bmNRdWV1ZSIsInByb21wdCIsInF1ZXJ5IiwiUHJvbWlzZSIsInJlamVjdCIsIndvcmtlck1hbmFnZXIiLCJyZW1vdGUiLCJnZXRDdXJyZW50V2luZG93IiwiaXNWaXNpYmxlIiwic2V0UHJvbXB0Q2FsbGJhY2siLCJleGVjIiwiYXJncyIsImRlZmF1bHRFeGVjQXJncyIsInN0ZGluIiwidXNlR2l0UHJvbXB0U2VydmVyIiwidXNlR3BnV3JhcHBlciIsInVzZUdwZ0F0b21Qcm9tcHQiLCJ3cml0ZU9wZXJhdGlvbiIsImNvbW1hbmROYW1lIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJkaWFnbm9zdGljc0VuYWJsZWQiLCJwcm9jZXNzIiwiZW52IiwiQVRPTV9HSVRIVUJfR0lUX0RJQUdOT1NUSUNTIiwiYXRvbSIsImNvbmZpZyIsImdldCIsImZvcm1hdHRlZEFyZ3MiLCJqb2luIiwidGltaW5nTWFya2VyIiwiR2l0VGltaW5nc1ZpZXciLCJnZW5lcmF0ZU1hcmtlciIsIm1hcmsiLCJyZXNvbHZlIiwiY2hpbGRQcm9jZXNzIiwiZXJyb3IiLCJzdGRvdXQiLCJ0cmltIiwiZXhlY1BhdGgiLCJnaXRQcm9tcHRTZXJ2ZXIiLCJwYXRoUGFydHMiLCJQQVRIIiwiR0lUX1RFUk1JTkFMX1BST01QVCIsIkdJVF9PUFRJT05BTF9MT0NLUyIsInBhdGgiLCJkZWxpbWl0ZXIiLCJnaXRUZW1wRGlyIiwiR2l0VGVtcERpciIsImVuc3VyZSIsImdldEdwZ1dyYXBwZXJTaCIsIkdpdFByb21wdFNlcnZlciIsInN0YXJ0IiwiQVRPTV9HSVRIVUJfVE1QIiwiZ2V0Um9vdFBhdGgiLCJBVE9NX0dJVEhVQl9BU0tQQVNTX1BBVEgiLCJub3JtYWxpemVHaXRIZWxwZXJQYXRoIiwiZ2V0QXNrUGFzc0pzIiwiQVRPTV9HSVRIVUJfQ1JFREVOVElBTF9QQVRIIiwiZ2V0Q3JlZGVudGlhbEhlbHBlckpzIiwiQVRPTV9HSVRIVUJfRUxFQ1RST05fUEFUSCIsImdldEF0b21IZWxwZXJQYXRoIiwiQVRPTV9HSVRIVUJfU09DS19BRERSIiwiZ2V0QWRkcmVzcyIsIkFUT01fR0lUSFVCX1dPUktESVJfUEFUSCIsIkFUT01fR0lUSFVCX0RVR0lURV9QQVRIIiwiZ2V0RHVnaXRlUGF0aCIsIkFUT01fR0lUSFVCX0tFWVRBUl9TVFJBVEVHWV9QQVRIIiwiZ2V0U2hhcmVkTW9kdWxlUGF0aCIsIkRJU1BMQVkiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9QQVRIIiwiQVRPTV9HSVRIVUJfT1JJR0lOQUxfR0lUX0FTS1BBU1MiLCJHSVRfQVNLUEFTUyIsIkFUT01fR0lUSFVCX09SSUdJTkFMX1NTSF9BU0tQQVNTIiwiU1NIX0FTS1BBU1MiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfU1NIX0NPTU1BTkQiLCJHSVRfU1NIX0NPTU1BTkQiLCJBVE9NX0dJVEhVQl9TUEVDX01PREUiLCJpblNwZWNNb2RlIiwiZ2V0QXNrUGFzc1NoIiwicGxhdGZvcm0iLCJnZXRTc2hXcmFwcGVyU2giLCJHSVRfU1NIIiwiY3JlZGVudGlhbEhlbHBlclNoIiwiZ2V0Q3JlZGVudGlhbEhlbHBlclNoIiwiQVRPTV9HSVRIVUJfR1BHX1BST01QVCIsIkdJVF9UUkFDRSIsIkdJVF9UUkFDRV9DVVJMIiwib3B0cyIsInN0ZGluRW5jb2RpbmciLCJQUklOVF9HSVRfVElNRVMiLCJjb25zb2xlIiwidGltZSIsImJlZm9yZVJ1biIsIm5ld0FyZ3NPcHRzIiwicHJvbWlzZSIsImNhbmNlbCIsImV4ZWN1dGVHaXRDb21tYW5kIiwiZXhwZWN0Q2FuY2VsIiwiYWRkIiwib25EaWRDYW5jZWwiLCJoYW5kbGVyUGlkIiwicmVzb2x2ZUtpbGwiLCJyZWplY3RLaWxsIiwiZXJyIiwic3RkZXJyIiwiZXhpdENvZGUiLCJzaWduYWwiLCJ0aW1pbmciLCJjYXRjaCIsImV4ZWNUaW1lIiwic3Bhd25UaW1lIiwiaXBjVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiZmluYWxpemUiLCJ0aW1lRW5kIiwidGVybWluYXRlIiwiZGlzcG9zZSIsImV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzIiwicmF3IiwicmVwbGFjZSIsInN1bW1hcnkiLCJsb2ciLCJoZWFkZXJTdHlsZSIsImdyb3VwQ29sbGFwc2VkIiwidXRpbCIsImluc3BlY3QiLCJicmVha0xlbmd0aCIsIkluZmluaXR5IiwiZ3JvdXBFbmQiLCJjb2RlIiwic3RkRXJyIiwic3RkT3V0IiwiY29tbWFuZCIsImluY2x1ZGVzIiwiaW5jcmVtZW50Q291bnRlciIsInBhcmFsbGVsIiwiZ3BnRXhlYyIsInNsaWNlIiwiZSIsInRlc3QiLCJtYXJrZXIiLCJBVE9NX0dJVEhVQl9JTkxJTkVfR0lUX0VYRUMiLCJXb3JrZXJNYW5hZ2VyIiwiZ2V0SW5zdGFuY2UiLCJpc1JlYWR5IiwiY2hpbGRQaWQiLCJwcm9jZXNzQ2FsbGJhY2siLCJjaGlsZCIsInBpZCIsIm9uIiwiR2l0UHJvY2VzcyIsInJlcXVlc3QiLCJyZXNvbHZlRG90R2l0RGlyIiwiZnMiLCJzdGF0Iiwib3V0cHV0IiwiZG90R2l0RGlyIiwidG9OYXRpdmVQYXRoU2VwIiwiaW5pdCIsInN0YWdlRmlsZXMiLCJwYXRocyIsImNvbmNhdCIsIm1hcCIsInRvR2l0UGF0aFNlcCIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwidGVtcGxhdGVQYXRoIiwiZ2V0Q29uZmlnIiwiaG9tZURpciIsImhvbWVkaXIiLCJfIiwidXNlciIsImRpcm5hbWUiLCJpc0Fic29sdXRlIiwiZmlsZUV4aXN0cyIsInJlYWRGaWxlIiwiZW5jb2RpbmciLCJ1bnN0YWdlRmlsZXMiLCJjb21taXQiLCJzdGFnZUZpbGVNb2RlQ2hhbmdlIiwiZmlsZW5hbWUiLCJuZXdNb2RlIiwiaW5kZXhSZWFkUHJvbWlzZSIsImRldGVybWluZUFyZ3MiLCJpbmRleCIsIm9pZCIsInN1YnN0ciIsInN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UiLCJhcHBseVBhdGNoIiwicGF0Y2giLCJzcGxpY2UiLCJyYXdNZXNzYWdlIiwiYWxsb3dFbXB0eSIsImFtZW5kIiwiY29BdXRob3JzIiwidmVyYmF0aW0iLCJtc2ciLCJ1bmJvcm5SZWYiLCJtZXNzYWdlQm9keSIsIm1lc3NhZ2VTdWJqZWN0IiwiZ2V0SGVhZENvbW1pdCIsInRlbXBsYXRlIiwiY29tbWVudENoYXIiLCJzcGxpdCIsImxpbmUiLCJzdGFydHNXaXRoIiwiY29uZmlndXJlZCIsIm1vZGUiLCJhZGRDb0F1dGhvcnNUb01lc3NhZ2UiLCJ0cmFpbGVycyIsImF1dGhvciIsInRva2VuIiwibmFtZSIsImVtYWlsIiwibWVyZ2VUcmFpbGVycyIsImdldFN0YXR1c0J1bmRsZSIsInJlc3VsdHMiLCJwYXJzZVN0YXR1cyIsImVudHJ5VHlwZSIsIkFycmF5IiwiaXNBcnJheSIsInVwZGF0ZU5hdGl2ZVBhdGhTZXBGb3JFbnRyaWVzIiwiZW50cmllcyIsImVudHJ5IiwiZmlsZVBhdGgiLCJvcmlnRmlsZVBhdGgiLCJkaWZmRmlsZVN0YXR1cyIsInN0YWdlZCIsInN0YXR1c01hcCIsIkEiLCJNIiwiRCIsIlUiLCJmaWxlU3RhdHVzZXMiLCJMSU5FX0VORElOR19SRUdFWCIsInN0YXR1cyIsInJhd0ZpbGVQYXRoIiwidW50cmFja2VkIiwiZ2V0VW50cmFja2VkRmlsZXMiLCJnZXREaWZmc0ZvckZpbGVQYXRoIiwiYmFzZUNvbW1pdCIsInJhd0RpZmZzIiwicGFyc2VEaWZmIiwicmF3RGlmZiIsIm9sZFBhdGgiLCJuZXdQYXRoIiwiYWJzUGF0aCIsImV4ZWN1dGFibGUiLCJpc0ZpbGVFeGVjdXRhYmxlIiwic3ltbGluayIsImlzRmlsZVN5bWxpbmsiLCJjb250ZW50cyIsImJpbmFyeSIsImlzQmluYXJ5IiwicmVhbHBhdGgiLCJGaWxlIiwibW9kZXMiLCJFWEVDVVRBQkxFIiwiU1lNTElOSyIsIk5PUk1BTCIsImJ1aWxkQWRkZWRGaWxlUGF0Y2giLCJnZXRTdGFnZWRDaGFuZ2VzUGF0Y2giLCJkaWZmcyIsImRpZmYiLCJnZXRDb21taXQiLCJyZWYiLCJnZXRDb21taXRzIiwiaW5jbHVkZVVuYm9ybiIsImhlYWRDb21taXQiLCJpbmNsdWRlUGF0Y2giLCJzaGEiLCJmaWVsZHMiLCJjb21taXRzIiwiYm9keSIsImV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlIiwiQXV0aG9yIiwiYXV0aG9yRGF0ZSIsInBhcnNlSW50IiwiZ2V0QXV0aG9ycyIsImRlbGltaXRlclN0cmluZyIsImZyb21DaGFyQ29kZSIsImZvcm1hdCIsImFuIiwiYWUiLCJjbiIsImNlIiwidHJhaWxlciIsIm1hdGNoIiwiQ09fQVVUSE9SX1JFR0VYIiwiY29tbWl0TWVzc2FnZSIsInJlYWRGaWxlRnJvbUluZGV4IiwibWVyZ2UiLCJicmFuY2hOYW1lIiwiaXNNZXJnaW5nIiwiYWJvcnRNZXJnZSIsImNoZWNrb3V0U2lkZSIsInNpZGUiLCJpc1JlYmFzaW5nIiwiYWxsIiwic29tZSIsInIiLCJjbG9uZSIsInJlbW90ZVVybCIsIm5vTG9jYWwiLCJiYXJlIiwicmVjdXJzaXZlIiwic291cmNlUmVtb3RlTmFtZSIsInJlbW90ZU5hbWUiLCJmZXRjaCIsInB1bGwiLCJyZWZTcGVjIiwiZmZPbmx5Iiwic2V0VXBzdHJlYW0iLCJmb3JjZSIsInJlc2V0IiwicmV2aXNpb24iLCJ2YWxpZFR5cGVzIiwiZGVsZXRlUmVmIiwiY2hlY2tvdXQiLCJjcmVhdGVOZXciLCJzdGFydFBvaW50IiwidHJhY2siLCJnZXRCcmFuY2hlcyIsImhlYWQiLCJ1cHN0cmVhbVRyYWNraW5nUmVmIiwidXBzdHJlYW1SZW1vdGVOYW1lIiwidXBzdHJlYW1SZW1vdGVSZWYiLCJwdXNoVHJhY2tpbmdSZWYiLCJwdXNoUmVtb3RlTmFtZSIsInB1c2hSZW1vdGVSZWYiLCJicmFuY2giLCJ1cHN0cmVhbSIsInRyYWNraW5nUmVmIiwicmVtb3RlUmVmIiwiZ2V0QnJhbmNoZXNXaXRoQ29tbWl0Iiwib3B0aW9uIiwic2hvd0xvY2FsIiwic2hvd1JlbW90ZSIsInBhdHRlcm4iLCJjaGVja291dEZpbGVzIiwiZGVzY3JpYmVIZWFkIiwibG9jYWwiLCJzZXRDb25maWciLCJyZXBsYWNlQWxsIiwiZ2xvYmFsIiwidW5zZXRDb25maWciLCJnZXRSZW1vdGVzIiwidXJsIiwiYWRkUmVtb3RlIiwiY3JlYXRlQmxvYiIsImV4cGFuZEJsb2JUb0ZpbGUiLCJhYnNGaWxlUGF0aCIsIndyaXRlRmlsZSIsImdldEJsb2JDb250ZW50cyIsIm1lcmdlRmlsZSIsIm91cnNQYXRoIiwiY29tbW9uQmFzZVBhdGgiLCJ0aGVpcnNQYXRoIiwicmVzdWx0UGF0aCIsImNvbmZsaWN0IiwicmVzb2x2ZWRSZXN1bHRQYXRoIiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsImNvbW1vbkJhc2VTaGEiLCJvdXJzU2hhIiwidGhlaXJzU2hhIiwiZ2l0RmlsZVBhdGgiLCJmaWxlTW9kZSIsImdldEZpbGVNb2RlIiwiaW5kZXhJbmZvIiwiZGVzdHJveSIsImh1bmtzIiwibm9OZXdMaW5lIiwibGluZXMiLCJvbGRTdGFydExpbmUiLCJvbGRMaW5lQ291bnQiLCJuZXdTdGFydExpbmUiLCJoZWFkaW5nIiwibmV3TGluZUNvdW50Iiwib2xkTW9kZSJdLCJzb3VyY2VzIjpbImdpdC1zaGVsbC1vdXQtc3RyYXRlZ3kuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGNoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7R2l0UHJvY2Vzc30gZnJvbSAnZHVnaXRlJztcbmltcG9ydCB7cGFyc2UgYXMgcGFyc2VEaWZmfSBmcm9tICd3aGF0LXRoZS1kaWZmJztcbmltcG9ydCB7cGFyc2UgYXMgcGFyc2VTdGF0dXN9IGZyb20gJ3doYXQtdGhlLXN0YXR1cyc7XG5cbmltcG9ydCBHaXRQcm9tcHRTZXJ2ZXIgZnJvbSAnLi9naXQtcHJvbXB0LXNlcnZlcic7XG5pbXBvcnQgR2l0VGVtcERpciBmcm9tICcuL2dpdC10ZW1wLWRpcic7XG5pbXBvcnQgQXN5bmNRdWV1ZSBmcm9tICcuL2FzeW5jLXF1ZXVlJztcbmltcG9ydCB7aW5jcmVtZW50Q291bnRlcn0gZnJvbSAnLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge1xuICBnZXREdWdpdGVQYXRoLCBnZXRTaGFyZWRNb2R1bGVQYXRoLCBnZXRBdG9tSGVscGVyUGF0aCxcbiAgZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UsIGZpbGVFeGlzdHMsIGlzRmlsZUV4ZWN1dGFibGUsIGlzRmlsZVN5bWxpbmssIGlzQmluYXJ5LFxuICBub3JtYWxpemVHaXRIZWxwZXJQYXRoLCB0b05hdGl2ZVBhdGhTZXAsIHRvR2l0UGF0aFNlcCwgTElORV9FTkRJTkdfUkVHRVgsIENPX0FVVEhPUl9SRUdFWCxcbn0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBHaXRUaW1pbmdzVmlldyBmcm9tICcuL3ZpZXdzL2dpdC10aW1pbmdzLXZpZXcnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9tb2RlbHMvcGF0Y2gvZmlsZSc7XG5pbXBvcnQgV29ya2VyTWFuYWdlciBmcm9tICcuL3dvcmtlci1tYW5hZ2VyJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi9tb2RlbHMvYXV0aG9yJztcblxuY29uc3QgTUFYX1NUQVRVU19PVVRQVVRfTEVOR1RIID0gMTAyNCAqIDEwMjQgKiAxMDtcblxubGV0IGhlYWRsZXNzID0gbnVsbDtcbmxldCBleGVjUGF0aFByb21pc2UgPSBudWxsO1xuXG5leHBvcnQgY2xhc3MgR2l0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjaztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGFyZ2VSZXBvRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjaztcbiAgfVxufVxuXG4vLyBpZ25vcmVkIGZvciB0aGUgcHVycG9zZXMgb2YgdXNhZ2UgbWV0cmljcyB0cmFja2luZyBiZWNhdXNlIHRoZXkncmUgbm9pc3lcbmNvbnN0IElHTk9SRURfR0lUX0NPTU1BTkRTID0gWydjYXQtZmlsZScsICdjb25maWcnLCAnZGlmZicsICdmb3ItZWFjaC1yZWYnLCAnbG9nJywgJ3Jldi1wYXJzZScsICdzdGF0dXMnXTtcblxuY29uc3QgRElTQUJMRV9DT0xPUl9GTEFHUyA9IFtcbiAgJ2JyYW5jaCcsICdkaWZmJywgJ3Nob3dCcmFuY2gnLCAnc3RhdHVzJywgJ3VpJyxcbl0ucmVkdWNlKChhY2MsIHR5cGUpID0+IHtcbiAgYWNjLnVuc2hpZnQoJy1jJywgYGNvbG9yLiR7dHlwZX09ZmFsc2VgKTtcbiAgcmV0dXJuIGFjYztcbn0sIFtdKTtcblxuLyoqXG4gKiBFeHBhbmQgY29uZmlnIHBhdGggbmFtZSBwZXJcbiAqIGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXQtY29uZmlnI2dpdC1jb25maWctcGF0aG5hbWVcbiAqIHRoaXMgcmVnZXggYXR0ZW1wdHMgdG8gZ2V0IHRoZSBzcGVjaWZpZWQgdXNlcidzIGhvbWUgZGlyZWN0b3J5XG4gKiBFeDogb24gTWFjIH5rdXljaGFjby8gaXMgZXhwYW5kZWQgdG8gdGhlIHNwZWNpZmllZCB1c2Vy4oCZcyBob21lIGRpcmVjdG9yeSAoL1VzZXJzL2t1eWNoYWNvKVxuICogUmVnZXggdHJhbnNsYXRpb246XG4gKiBefiBsaW5lIHN0YXJ0cyB3aXRoIHRpbGRlXG4gKiAoW15cXFxcXFxcXC9dKilbXFxcXFxcXFwvXSBjYXB0dXJlcyBub24tc2xhc2ggY2hhcmFjdGVycyBiZWZvcmUgZmlyc3Qgc2xhc2hcbiAqL1xuY29uc3QgRVhQQU5EX1RJTERFX1JFR0VYID0gbmV3IFJlZ0V4cCgnXn4oW15cXFxcXFxcXC9dKilbXFxcXFxcXFwvXScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRTaGVsbE91dFN0cmF0ZWd5IHtcbiAgc3RhdGljIGRlZmF1bHRFeGVjQXJncyA9IHtcbiAgICBzdGRpbjogbnVsbCxcbiAgICB1c2VHaXRQcm9tcHRTZXJ2ZXI6IGZhbHNlLFxuICAgIHVzZUdwZ1dyYXBwZXI6IGZhbHNlLFxuICAgIHVzZUdwZ0F0b21Qcm9tcHQ6IGZhbHNlLFxuICAgIHdyaXRlT3BlcmF0aW9uOiBmYWxzZSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHdvcmtpbmdEaXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMud29ya2luZ0RpciA9IHdvcmtpbmdEaXI7XG4gICAgaWYgKG9wdGlvbnMucXVldWUpIHtcbiAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gb3B0aW9ucy5xdWV1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFyYWxsZWxpc20gPSBvcHRpb25zLnBhcmFsbGVsaXNtIHx8IE1hdGgubWF4KDMsIG9zLmNwdXMoKS5sZW5ndGgpO1xuICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBuZXcgQXN5bmNRdWV1ZSh7cGFyYWxsZWxpc219KTtcbiAgICB9XG5cbiAgICB0aGlzLnByb21wdCA9IG9wdGlvbnMucHJvbXB0IHx8IChxdWVyeSA9PiBQcm9taXNlLnJlamVjdCgpKTtcbiAgICB0aGlzLndvcmtlck1hbmFnZXIgPSBvcHRpb25zLndvcmtlck1hbmFnZXI7XG5cbiAgICBpZiAoaGVhZGxlc3MgPT09IG51bGwpIHtcbiAgICAgIGhlYWRsZXNzID0gIXJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkuaXNWaXNpYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogUHJvdmlkZSBhbiBhc3luY2hyb25vdXMgY2FsbGJhY2sgdG8gYmUgdXNlZCB0byByZXF1ZXN0IGlucHV0IGZyb20gdGhlIHVzZXIgZm9yIGdpdCBvcGVyYXRpb25zLlxuICAgKlxuICAgKiBgcHJvbXB0YCBtdXN0IGJlIGEgY2FsbGFibGUgdGhhdCBhY2NlcHRzIGEgcXVlcnkgb2JqZWN0IGB7cHJvbXB0LCBpbmNsdWRlVXNlcm5hbWV9YCBhbmQgcmV0dXJucyBhIFByb21pc2VcbiAgICogdGhhdCBlaXRoZXIgcmVzb2x2ZXMgd2l0aCBhIHJlc3VsdCBvYmplY3QgYHtbdXNlcm5hbWVdLCBwYXNzd29yZH1gIG9yIHJlamVjdHMgb24gY2FuY2VsbGF0aW9uLlxuICAgKi9cbiAgc2V0UHJvbXB0Q2FsbGJhY2socHJvbXB0KSB7XG4gICAgdGhpcy5wcm9tcHQgPSBwcm9tcHQ7XG4gIH1cblxuICAvLyBFeGVjdXRlIGEgY29tbWFuZCBhbmQgcmVhZCB0aGUgb3V0cHV0IHVzaW5nIHRoZSBlbWJlZGRlZCBHaXQgZW52aXJvbm1lbnRcbiAgYXN5bmMgZXhlYyhhcmdzLCBvcHRpb25zID0gR2l0U2hlbGxPdXRTdHJhdGVneS5kZWZhdWx0RXhlY0FyZ3MpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlLG5vLWNvbnRyb2wtcmVnZXggKi9cbiAgICBjb25zdCB7c3RkaW4sIHVzZUdpdFByb21wdFNlcnZlciwgdXNlR3BnV3JhcHBlciwgdXNlR3BnQXRvbVByb21wdCwgd3JpdGVPcGVyYXRpb259ID0gb3B0aW9ucztcbiAgICBjb25zdCBjb21tYW5kTmFtZSA9IGFyZ3NbMF07XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgY29uc3QgZGlhZ25vc3RpY3NFbmFibGVkID0gcHJvY2Vzcy5lbnYuQVRPTV9HSVRIVUJfR0lUX0RJQUdOT1NUSUNTIHx8IGF0b20uY29uZmlnLmdldCgnZ2l0aHViLmdpdERpYWdub3N0aWNzJyk7XG5cbiAgICBjb25zdCBmb3JtYXR0ZWRBcmdzID0gYGdpdCAke2FyZ3Muam9pbignICcpfSBpbiAke3RoaXMud29ya2luZ0Rpcn1gO1xuICAgIGNvbnN0IHRpbWluZ01hcmtlciA9IEdpdFRpbWluZ3NWaWV3LmdlbmVyYXRlTWFya2VyKGBnaXQgJHthcmdzLmpvaW4oJyAnKX1gKTtcbiAgICB0aW1pbmdNYXJrZXIubWFyaygncXVldWVkJyk7XG5cbiAgICBhcmdzLnVuc2hpZnQoLi4uRElTQUJMRV9DT0xPUl9GTEFHUyk7XG5cbiAgICBpZiAoZXhlY1BhdGhQcm9taXNlID09PSBudWxsKSB7XG4gICAgICAvLyBBdHRlbXB0IHRvIGNvbGxlY3QgdGhlIC0tZXhlYy1wYXRoIGZyb20gYSBuYXRpdmUgZ2l0IGluc3RhbGxhdGlvbi5cbiAgICAgIGV4ZWNQYXRoUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBjaGlsZFByb2Nlc3MuZXhlYygnZ2l0IC0tZXhlYy1wYXRoJywgKGVycm9yLCBzdGRvdXQpID0+IHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIE9oIHdlbGxcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShzdGRvdXQudHJpbSgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgZXhlY1BhdGggPSBhd2FpdCBleGVjUGF0aFByb21pc2U7XG5cbiAgICByZXR1cm4gdGhpcy5jb21tYW5kUXVldWUucHVzaChhc3luYyAoKSA9PiB7XG4gICAgICB0aW1pbmdNYXJrZXIubWFyaygncHJlcGFyZScpO1xuICAgICAgbGV0IGdpdFByb21wdFNlcnZlcjtcblxuICAgICAgY29uc3QgcGF0aFBhcnRzID0gW107XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuUEFUSCkge1xuICAgICAgICBwYXRoUGFydHMucHVzaChwcm9jZXNzLmVudi5QQVRIKTtcbiAgICAgIH1cbiAgICAgIGlmIChleGVjUGF0aCkge1xuICAgICAgICBwYXRoUGFydHMucHVzaChleGVjUGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVudiA9IHtcbiAgICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAgIEdJVF9URVJNSU5BTF9QUk9NUFQ6ICcwJyxcbiAgICAgICAgR0lUX09QVElPTkFMX0xPQ0tTOiAnMCcsXG4gICAgICAgIFBBVEg6IHBhdGhQYXJ0cy5qb2luKHBhdGguZGVsaW1pdGVyKSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdpdFRlbXBEaXIgPSBuZXcgR2l0VGVtcERpcigpO1xuXG4gICAgICBpZiAodXNlR3BnV3JhcHBlcikge1xuICAgICAgICBhd2FpdCBnaXRUZW1wRGlyLmVuc3VyZSgpO1xuICAgICAgICBhcmdzLnVuc2hpZnQoJy1jJywgYGdwZy5wcm9ncmFtPSR7Z2l0VGVtcERpci5nZXRHcGdXcmFwcGVyU2goKX1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVzZUdpdFByb21wdFNlcnZlcikge1xuICAgICAgICBnaXRQcm9tcHRTZXJ2ZXIgPSBuZXcgR2l0UHJvbXB0U2VydmVyKGdpdFRlbXBEaXIpO1xuICAgICAgICBhd2FpdCBnaXRQcm9tcHRTZXJ2ZXIuc3RhcnQodGhpcy5wcm9tcHQpO1xuXG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9UTVAgPSBnaXRUZW1wRGlyLmdldFJvb3RQYXRoKCk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9BU0tQQVNTX1BBVEggPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0QXNrUGFzc0pzKCkpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfQ1JFREVOVElBTF9QQVRIID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldENyZWRlbnRpYWxIZWxwZXJKcygpKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0VMRUNUUk9OX1BBVEggPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdldEF0b21IZWxwZXJQYXRoKCkpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfU09DS19BRERSID0gZ2l0UHJvbXB0U2VydmVyLmdldEFkZHJlc3MoKTtcblxuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfV09SS0RJUl9QQVRIID0gdGhpcy53b3JraW5nRGlyO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfRFVHSVRFX1BBVEggPSBnZXREdWdpdGVQYXRoKCk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9LRVlUQVJfU1RSQVRFR1lfUEFUSCA9IGdldFNoYXJlZE1vZHVsZVBhdGgoJ2tleXRhci1zdHJhdGVneScpO1xuXG4gICAgICAgIC8vIFwic3NoXCIgd29uJ3QgcmVzcGVjdCBTU0hfQVNLUEFTUyB1bmxlc3M6XG4gICAgICAgIC8vIChhKSBpdCdzIHJ1bm5pbmcgd2l0aG91dCBhIHR0eVxuICAgICAgICAvLyAoYikgRElTUExBWSBpcyBzZXQgdG8gc29tZXRoaW5nIG5vbmVtcHR5XG4gICAgICAgIC8vIEJ1dCwgb24gYSBNYWMsIERJU1BMQVkgaXMgdW5zZXQuIEVuc3VyZSB0aGF0IGl0IGlzIHNvIG91ciBTU0hfQVNLUEFTUyBpcyByZXNwZWN0ZWQuXG4gICAgICAgIGlmICghcHJvY2Vzcy5lbnYuRElTUExBWSB8fCBwcm9jZXNzLmVudi5ESVNQTEFZLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGVudi5ESVNQTEFZID0gJ2F0b20tZ2l0aHViLXBsYWNlaG9sZGVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9PUklHSU5BTF9QQVRIID0gcHJvY2Vzcy5lbnYuUEFUSCB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX0dJVF9BU0tQQVNTID0gcHJvY2Vzcy5lbnYuR0lUX0FTS1BBU1MgfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9PUklHSU5BTF9TU0hfQVNLUEFTUyA9IHByb2Nlc3MuZW52LlNTSF9BU0tQQVNTIHx8ICcnO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfR0lUX1NTSF9DT01NQU5EID0gcHJvY2Vzcy5lbnYuR0lUX1NTSF9DT01NQU5EIHx8ICcnO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfU1BFQ19NT0RFID0gYXRvbS5pblNwZWNNb2RlKCkgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgICAgIGVudi5TU0hfQVNLUEFTUyA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRBc2tQYXNzU2goKSk7XG4gICAgICAgIGVudi5HSVRfQVNLUEFTUyA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRBc2tQYXNzU2goKSk7XG5cbiAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdsaW51eCcpIHtcbiAgICAgICAgICBlbnYuR0lUX1NTSF9DT01NQU5EID0gZ2l0VGVtcERpci5nZXRTc2hXcmFwcGVyU2goKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5HSVRfU1NIX0NPTU1BTkQpIHtcbiAgICAgICAgICBlbnYuR0lUX1NTSF9DT01NQU5EID0gcHJvY2Vzcy5lbnYuR0lUX1NTSF9DT01NQU5EO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudi5HSVRfU1NIID0gcHJvY2Vzcy5lbnYuR0lUX1NTSDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNyZWRlbnRpYWxIZWxwZXJTaCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRDcmVkZW50aWFsSGVscGVyU2goKSk7XG4gICAgICAgIGFyZ3MudW5zaGlmdCgnLWMnLCBgY3JlZGVudGlhbC5oZWxwZXI9JHtjcmVkZW50aWFsSGVscGVyU2h9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1c2VHcGdXcmFwcGVyICYmIHVzZUdpdFByb21wdFNlcnZlciAmJiB1c2VHcGdBdG9tUHJvbXB0KSB7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9HUEdfUFJPTVBUID0gJ3RydWUnO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChkaWFnbm9zdGljc0VuYWJsZWQpIHtcbiAgICAgICAgZW52LkdJVF9UUkFDRSA9ICd0cnVlJztcbiAgICAgICAgZW52LkdJVF9UUkFDRV9DVVJMID0gJ3RydWUnO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3B0cyA9IHtlbnZ9O1xuXG4gICAgICBpZiAoc3RkaW4pIHtcbiAgICAgICAgb3B0cy5zdGRpbiA9IHN0ZGluO1xuICAgICAgICBvcHRzLnN0ZGluRW5jb2RpbmcgPSAndXRmOCc7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlBSSU5UX0dJVF9USU1FUykge1xuICAgICAgICBjb25zb2xlLnRpbWUoYGdpdDoke2Zvcm1hdHRlZEFyZ3N9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zLmJlZm9yZVJ1bikge1xuICAgICAgICAgIGNvbnN0IG5ld0FyZ3NPcHRzID0gYXdhaXQgb3B0aW9ucy5iZWZvcmVSdW4oe2FyZ3MsIG9wdHN9KTtcbiAgICAgICAgICBhcmdzID0gbmV3QXJnc09wdHMuYXJncztcbiAgICAgICAgICBvcHRzID0gbmV3QXJnc09wdHMub3B0cztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7cHJvbWlzZSwgY2FuY2VsfSA9IHRoaXMuZXhlY3V0ZUdpdENvbW1hbmQoYXJncywgb3B0cywgdGltaW5nTWFya2VyKTtcbiAgICAgICAgbGV0IGV4cGVjdENhbmNlbCA9IGZhbHNlO1xuICAgICAgICBpZiAoZ2l0UHJvbXB0U2VydmVyKSB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoZ2l0UHJvbXB0U2VydmVyLm9uRGlkQ2FuY2VsKGFzeW5jICh7aGFuZGxlclBpZH0pID0+IHtcbiAgICAgICAgICAgIGV4cGVjdENhbmNlbCA9IHRydWU7XG4gICAgICAgICAgICBhd2FpdCBjYW5jZWwoKTtcblxuICAgICAgICAgICAgLy8gT24gV2luZG93cywgdGhlIFNTSF9BU0tQQVNTIGhhbmRsZXIgaXMgZXhlY3V0ZWQgYXMgYSBub24tY2hpbGQgcHJvY2Vzcywgc28gdGhlIGJpblxcZ2l0LWFza3Bhc3MtYXRvbS5zaFxuICAgICAgICAgICAgLy8gcHJvY2VzcyBkb2VzIG5vdCB0ZXJtaW5hdGUgd2hlbiB0aGUgZ2l0IHByb2Nlc3MgaXMga2lsbGVkLlxuICAgICAgICAgICAgLy8gS2lsbCB0aGUgaGFuZGxlciBwcm9jZXNzICphZnRlciogdGhlIGdpdCBwcm9jZXNzIGhhcyBiZWVuIGtpbGxlZCB0byBlbnN1cmUgdGhhdCBnaXQgZG9lc24ndCBoYXZlIGFcbiAgICAgICAgICAgIC8vIGNoYW5jZSB0byBmYWxsIGJhY2sgdG8gR0lUX0FTS1BBU1MgZnJvbSB0aGUgY3JlZGVudGlhbCBoYW5kbGVyLlxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmVLaWxsLCByZWplY3RLaWxsKSA9PiB7XG4gICAgICAgICAgICAgIHJlcXVpcmUoJ3RyZWUta2lsbCcpKGhhbmRsZXJQaWQsICdTSUdURVJNJywgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7IHJlamVjdEtpbGwoZXJyKTsgfSBlbHNlIHsgcmVzb2x2ZUtpbGwoKTsgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtzdGRvdXQsIHN0ZGVyciwgZXhpdENvZGUsIHNpZ25hbCwgdGltaW5nfSA9IGF3YWl0IHByb21pc2UuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBpZiAoZXJyLnNpZ25hbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtzaWduYWw6IGVyci5zaWduYWx9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1pbmcpIHtcbiAgICAgICAgICBjb25zdCB7ZXhlY1RpbWUsIHNwYXduVGltZSwgaXBjVGltZX0gPSB0aW1pbmc7XG4gICAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgICAgdGltaW5nTWFya2VyLm1hcmsoJ25leHR0aWNrJywgbm93IC0gZXhlY1RpbWUgLSBzcGF3blRpbWUgLSBpcGNUaW1lKTtcbiAgICAgICAgICB0aW1pbmdNYXJrZXIubWFyaygnZXhlY3V0ZScsIG5vdyAtIGV4ZWNUaW1lIC0gaXBjVGltZSk7XG4gICAgICAgICAgdGltaW5nTWFya2VyLm1hcmsoJ2lwYycsIG5vdyAtIGlwY1RpbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRpbWluZ01hcmtlci5maW5hbGl6ZSgpO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuUFJJTlRfR0lUX1RJTUVTKSB7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdpdFByb21wdFNlcnZlcikge1xuICAgICAgICAgIGdpdFByb21wdFNlcnZlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKGRpYWdub3N0aWNzRW5hYmxlZCkge1xuICAgICAgICAgIGNvbnN0IGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzID0gcmF3ID0+IHtcbiAgICAgICAgICAgIGlmICghcmF3KSB7IHJldHVybiAnJzsgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmF3XG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHUwMDAwL3VnLCAnPE5VTD5cXG4nKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFx1MDAxRi91ZywgJzxTRVA+Jyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChoZWFkbGVzcykge1xuICAgICAgICAgICAgbGV0IHN1bW1hcnkgPSBgZ2l0OiR7Zm9ybWF0dGVkQXJnc31cXG5gO1xuICAgICAgICAgICAgaWYgKGV4aXRDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgZXhpdCBzdGF0dXM6ICR7ZXhpdENvZGV9XFxuYDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYGV4aXQgc2lnbmFsOiAke3NpZ25hbH1cXG5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ZGluICYmIHN0ZGluLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBzdGRpbjpcXG4ke2V4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGluKX1cXG5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VtbWFyeSArPSAnc3Rkb3V0Oic7XG4gICAgICAgICAgICBpZiAoc3Rkb3V0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9ICcgPGVtcHR5Plxcbic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBcXG4ke2V4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZG91dCl9XFxuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1bW1hcnkgKz0gJ3N0ZGVycjonO1xuICAgICAgICAgICAgaWYgKHN0ZGVyci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSAnIDxlbXB0eT5cXG4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgXFxuJHtleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRlcnIpfVxcbmA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN1bW1hcnkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJTdHlsZSA9ICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6IGJsdWU7JztcblxuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZChgZ2l0OiR7Zm9ybWF0dGVkQXJnc31gKTtcbiAgICAgICAgICAgIGlmIChleGl0Q29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY2V4aXQgc3RhdHVzJWMgJWQnLCBoZWFkZXJTdHlsZSwgJ2ZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiBibGFjazsnLCBleGl0Q29kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNpZ25hbCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWNleGl0IHNpZ25hbCVjICVzJywgaGVhZGVyU3R5bGUsICdmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogYmxhY2s7Jywgc2lnbmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAnJWNmdWxsIGFyZ3VtZW50cyVjICVzJyxcbiAgICAgICAgICAgICAgaGVhZGVyU3R5bGUsICdmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogYmxhY2s7JyxcbiAgICAgICAgICAgICAgdXRpbC5pbnNwZWN0KGFyZ3MsIHticmVha0xlbmd0aDogSW5maW5pdHl9KSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoc3RkaW4gJiYgc3RkaW4ubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY3N0ZGluJywgaGVhZGVyU3R5bGUpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRpbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVjc3Rkb3V0JywgaGVhZGVyU3R5bGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3Rkb3V0KSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWNzdGRlcnInLCBoZWFkZXJTdHlsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRlcnIpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXhpdENvZGUgIT09IDAgJiYgIWV4cGVjdENhbmNlbCkge1xuICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBHaXRFcnJvcihcbiAgICAgICAgICAgIGAke2Zvcm1hdHRlZEFyZ3N9IGV4aXRlZCB3aXRoIGNvZGUgJHtleGl0Q29kZX1cXG5zdGRvdXQ6ICR7c3Rkb3V0fVxcbnN0ZGVycjogJHtzdGRlcnJ9YCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGVyci5jb2RlID0gZXhpdENvZGU7XG4gICAgICAgICAgZXJyLnN0ZEVyciA9IHN0ZGVycjtcbiAgICAgICAgICBlcnIuc3RkT3V0ID0gc3Rkb3V0O1xuICAgICAgICAgIGVyci5jb21tYW5kID0gZm9ybWF0dGVkQXJncztcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghSUdOT1JFRF9HSVRfQ09NTUFORFMuaW5jbHVkZXMoY29tbWFuZE5hbWUpKSB7XG4gICAgICAgICAgaW5jcmVtZW50Q291bnRlcihjb21tYW5kTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShzdGRvdXQpO1xuICAgICAgfSk7XG4gICAgfSwge3BhcmFsbGVsOiAhd3JpdGVPcGVyYXRpb259KTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUsbm8tY29udHJvbC1yZWdleCAqL1xuICB9XG5cbiAgYXN5bmMgZ3BnRXhlYyhhcmdzLCBvcHRpb25zKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWMoYXJncy5zbGljZSgpLCB7XG4gICAgICAgIHVzZUdwZ1dyYXBwZXI6IHRydWUsXG4gICAgICAgIHVzZUdwZ0F0b21Qcm9tcHQ6IGZhbHNlLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKC9ncGcgZmFpbGVkLy50ZXN0KGUuc3RkRXJyKSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjKGFyZ3MsIHtcbiAgICAgICAgICB1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsXG4gICAgICAgICAgdXNlR3BnV3JhcHBlcjogdHJ1ZSxcbiAgICAgICAgICB1c2VHcGdBdG9tUHJvbXB0OiB0cnVlLFxuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBleGVjdXRlR2l0Q29tbWFuZChhcmdzLCBvcHRpb25zLCBtYXJrZXIgPSBudWxsKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52LkFUT01fR0lUSFVCX0lOTElORV9HSVRfRVhFQyB8fCAhV29ya2VyTWFuYWdlci5nZXRJbnN0YW5jZSgpLmlzUmVhZHkoKSkge1xuICAgICAgbWFya2VyICYmIG1hcmtlci5tYXJrKCduZXh0dGljaycpO1xuXG4gICAgICBsZXQgY2hpbGRQaWQ7XG4gICAgICBvcHRpb25zLnByb2Nlc3NDYWxsYmFjayA9IGNoaWxkID0+IHtcbiAgICAgICAgY2hpbGRQaWQgPSBjaGlsZC5waWQ7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgY2hpbGQuc3RkaW4ub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgRXJyb3Igd3JpdGluZyB0byBzdGRpbjogZ2l0ICR7YXJncy5qb2luKCcgJyl9IGluICR7dGhpcy53b3JraW5nRGlyfVxcbiR7b3B0aW9ucy5zdGRpbn1cXG4ke2Vycn1gKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBwcm9taXNlID0gR2l0UHJvY2Vzcy5leGVjKGFyZ3MsIHRoaXMud29ya2luZ0Rpciwgb3B0aW9ucyk7XG4gICAgICBtYXJrZXIgJiYgbWFya2VyLm1hcmsoJ2V4ZWN1dGUnKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2UsXG4gICAgICAgIGNhbmNlbDogKCkgPT4ge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmICghY2hpbGRQaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmVxdWlyZSgndHJlZS1raWxsJykoY2hpbGRQaWQsICdTSUdURVJNJywgZXJyID0+IHtcbiAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgIGlmIChlcnIpIHsgcmVqZWN0KGVycik7IH0gZWxzZSB7IHJlc29sdmUoKTsgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB3b3JrZXJNYW5hZ2VyID0gdGhpcy53b3JrZXJNYW5hZ2VyIHx8IFdvcmtlck1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICAgIHJldHVybiB3b3JrZXJNYW5hZ2VyLnJlcXVlc3Qoe1xuICAgICAgICBhcmdzLFxuICAgICAgICB3b3JraW5nRGlyOiB0aGlzLndvcmtpbmdEaXIsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZXNvbHZlRG90R2l0RGlyKCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBmcy5zdGF0KHRoaXMud29ya2luZ0Rpcik7IC8vIGZhaWxzIGlmIGZvbGRlciBkb2Vzbid0IGV4aXN0XG4gICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydyZXYtcGFyc2UnLCAnLS1yZXNvbHZlLWdpdC1kaXInLCBwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCAnLmdpdCcpXSk7XG4gICAgICBjb25zdCBkb3RHaXREaXIgPSBvdXRwdXQudHJpbSgpO1xuICAgICAgcmV0dXJuIHRvTmF0aXZlUGF0aFNlcChkb3RHaXREaXIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2luaXQnLCB0aGlzLndvcmtpbmdEaXJdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFnaW5nL1Vuc3RhZ2luZyBmaWxlcyBhbmQgcGF0Y2hlcyBhbmQgY29tbWl0dGluZ1xuICAgKi9cbiAgc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTsgfVxuICAgIGNvbnN0IGFyZ3MgPSBbJ2FkZCddLmNvbmNhdChwYXRocy5tYXAodG9HaXRQYXRoU2VwKSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCkge1xuICAgIGxldCB0ZW1wbGF0ZVBhdGggPSBhd2FpdCB0aGlzLmdldENvbmZpZygnY29tbWl0LnRlbXBsYXRlJyk7XG4gICAgaWYgKCF0ZW1wbGF0ZVBhdGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGhvbWVEaXIgPSBvcy5ob21lZGlyKCk7XG5cbiAgICB0ZW1wbGF0ZVBhdGggPSB0ZW1wbGF0ZVBhdGgudHJpbSgpLnJlcGxhY2UoRVhQQU5EX1RJTERFX1JFR0VYLCAoXywgdXNlcikgPT4ge1xuICAgICAgLy8gaWYgbm8gdXNlciBpcyBzcGVjaWZpZWQsIGZhbGwgYmFjayB0byB1c2luZyB0aGUgaG9tZSBkaXJlY3RvcnkuXG4gICAgICByZXR1cm4gYCR7dXNlciA/IHBhdGguam9pbihwYXRoLmRpcm5hbWUoaG9tZURpciksIHVzZXIpIDogaG9tZURpcn0vYDtcbiAgICB9KTtcbiAgICB0ZW1wbGF0ZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAodGVtcGxhdGVQYXRoKTtcblxuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKHRlbXBsYXRlUGF0aCkpIHtcbiAgICAgIHRlbXBsYXRlUGF0aCA9IHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIHRlbXBsYXRlUGF0aCk7XG4gICAgfVxuXG4gICAgaWYgKCFhd2FpdCBmaWxlRXhpc3RzKHRlbXBsYXRlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb21taXQgdGVtcGxhdGUgcGF0aCBzZXQgaW4gR2l0IGNvbmZpZzogJHt0ZW1wbGF0ZVBhdGh9YCk7XG4gICAgfVxuICAgIHJldHVybiBhd2FpdCBmcy5yZWFkRmlsZSh0ZW1wbGF0ZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gIH1cblxuICB1bnN0YWdlRmlsZXMocGF0aHMsIGNvbW1pdCA9ICdIRUFEJykge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTsgfVxuICAgIGNvbnN0IGFyZ3MgPSBbJ3Jlc2V0JywgY29tbWl0LCAnLS0nXS5jb25jYXQocGF0aHMubWFwKHRvR2l0UGF0aFNlcCkpO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBzdGFnZUZpbGVNb2RlQ2hhbmdlKGZpbGVuYW1lLCBuZXdNb2RlKSB7XG4gICAgY29uc3QgaW5kZXhSZWFkUHJvbWlzZSA9IHRoaXMuZXhlYyhbJ2xzLWZpbGVzJywgJy1zJywgJy0tJywgZmlsZW5hbWVdKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsndXBkYXRlLWluZGV4JywgJy0tY2FjaGVpbmZvJywgYCR7bmV3TW9kZX0sPE9JRF9UQkQ+LCR7ZmlsZW5hbWV9YF0sIHtcbiAgICAgIHdyaXRlT3BlcmF0aW9uOiB0cnVlLFxuICAgICAgYmVmb3JlUnVuOiBhc3luYyBmdW5jdGlvbiBkZXRlcm1pbmVBcmdzKHthcmdzLCBvcHRzfSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGF3YWl0IGluZGV4UmVhZFByb21pc2U7XG4gICAgICAgIGNvbnN0IG9pZCA9IGluZGV4LnN1YnN0cig3LCA0MCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb3B0cyxcbiAgICAgICAgICBhcmdzOiBbJ3VwZGF0ZS1pbmRleCcsICctLWNhY2hlaW5mbycsIGAke25ld01vZGV9LCR7b2lkfSwke2ZpbGVuYW1lfWBdLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsncm0nLCAnLS1jYWNoZWQnLCBmaWxlbmFtZV0sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXBwbHlQYXRjaChwYXRjaCwge2luZGV4fSA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnYXBwbHknLCAnLSddO1xuICAgIGlmIChpbmRleCkgeyBhcmdzLnNwbGljZSgxLCAwLCAnLS1jYWNoZWQnKTsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3N0ZGluOiBwYXRjaCwgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGNvbW1pdChyYXdNZXNzYWdlLCB7YWxsb3dFbXB0eSwgYW1lbmQsIGNvQXV0aG9ycywgdmVyYmF0aW19ID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydjb21taXQnXTtcbiAgICBsZXQgbXNnO1xuXG4gICAgLy8gaWYgYW1lbmRpbmcgYW5kIG5vIG5ldyBtZXNzYWdlIGlzIHBhc3NlZCwgdXNlIGxhc3QgY29tbWl0J3MgbWVzc2FnZS4gRW5zdXJlIHRoYXQgd2UgZG9uJ3RcbiAgICAvLyBtYW5nbGUgaXQgaW4gdGhlIHByb2Nlc3MuXG4gICAgaWYgKGFtZW5kICYmIHJhd01lc3NhZ2UubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCB7dW5ib3JuUmVmLCBtZXNzYWdlQm9keSwgbWVzc2FnZVN1YmplY3R9ID0gYXdhaXQgdGhpcy5nZXRIZWFkQ29tbWl0KCk7XG4gICAgICBpZiAodW5ib3JuUmVmKSB7XG4gICAgICAgIG1zZyA9IHJhd01lc3NhZ2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtc2cgPSBgJHttZXNzYWdlU3ViamVjdH1cXG5cXG4ke21lc3NhZ2VCb2R5fWAudHJpbSgpO1xuICAgICAgICB2ZXJiYXRpbSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1zZyA9IHJhd01lc3NhZ2U7XG4gICAgfVxuXG4gICAgLy8gaWYgY29tbWl0IHRlbXBsYXRlIGlzIHVzZWQsIHN0cmlwIGNvbW1lbnRlZCBsaW5lcyBmcm9tIGNvbW1pdFxuICAgIC8vIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBjb21tYW5kIGxpbmUgZ2l0LlxuICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5mZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuXG4gICAgICAvLyByZXNwZWN0aW5nIHRoZSBjb21tZW50IGNoYXJhY3RlciBmcm9tIHVzZXIgc2V0dGluZ3Mgb3IgZmFsbCBiYWNrIHRvICMgYXMgZGVmYXVsdC5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXQtY29uZmlnI2dpdC1jb25maWctY29yZWNvbW1lbnRDaGFyXG4gICAgICBsZXQgY29tbWVudENoYXIgPSBhd2FpdCB0aGlzLmdldENvbmZpZygnY29yZS5jb21tZW50Q2hhcicpO1xuICAgICAgaWYgKCFjb21tZW50Q2hhcikge1xuICAgICAgICBjb21tZW50Q2hhciA9ICcjJztcbiAgICAgIH1cbiAgICAgIG1zZyA9IG1zZy5zcGxpdCgnXFxuJykuZmlsdGVyKGxpbmUgPT4gIWxpbmUuc3RhcnRzV2l0aChjb21tZW50Q2hhcikpLmpvaW4oJ1xcbicpO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSB0aGUgY2xlYW51cCBtb2RlLlxuICAgIGlmICh2ZXJiYXRpbSkge1xuICAgICAgYXJncy5wdXNoKCctLWNsZWFudXA9dmVyYmF0aW0nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29uZmlndXJlZCA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdjb21taXQuY2xlYW51cCcpO1xuICAgICAgY29uc3QgbW9kZSA9IChjb25maWd1cmVkICYmIGNvbmZpZ3VyZWQgIT09ICdkZWZhdWx0JykgPyBjb25maWd1cmVkIDogJ3N0cmlwJztcbiAgICAgIGFyZ3MucHVzaChgLS1jbGVhbnVwPSR7bW9kZX1gKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgY28tYXV0aG9yIGNvbW1pdCB0cmFpbGVycyBpZiBuZWNlc3NhcnlcbiAgICBpZiAoY29BdXRob3JzICYmIGNvQXV0aG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICBtc2cgPSBhd2FpdCB0aGlzLmFkZENvQXV0aG9yc1RvTWVzc2FnZShtc2csIGNvQXV0aG9ycyk7XG4gICAgfVxuXG4gICAgYXJncy5wdXNoKCctbScsIG1zZy50cmltKCkpO1xuXG4gICAgaWYgKGFtZW5kKSB7IGFyZ3MucHVzaCgnLS1hbWVuZCcpOyB9XG4gICAgaWYgKGFsbG93RW1wdHkpIHsgYXJncy5wdXNoKCctLWFsbG93LWVtcHR5Jyk7IH1cbiAgICByZXR1cm4gdGhpcy5ncGdFeGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYWRkQ29BdXRob3JzVG9NZXNzYWdlKG1lc3NhZ2UsIGNvQXV0aG9ycyA9IFtdKSB7XG4gICAgY29uc3QgdHJhaWxlcnMgPSBjb0F1dGhvcnMubWFwKGF1dGhvciA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b2tlbjogJ0NvLUF1dGhvcmVkLUJ5JyxcbiAgICAgICAgdmFsdWU6IGAke2F1dGhvci5uYW1lfSA8JHthdXRob3IuZW1haWx9PmAsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgbWVzc2FnZSBlbmRzIHdpdGggbmV3bGluZSBmb3IgZ2l0LWludGVycHJldCB0cmFpbGVycyB0byB3b3JrXG4gICAgY29uc3QgbXNnID0gYCR7bWVzc2FnZS50cmltKCl9XFxuYDtcblxuICAgIHJldHVybiB0cmFpbGVycy5sZW5ndGggPyB0aGlzLm1lcmdlVHJhaWxlcnMobXNnLCB0cmFpbGVycykgOiBtc2c7XG4gIH1cblxuICAvKipcbiAgICogRmlsZSBTdGF0dXMgYW5kIERpZmZzXG4gICAqL1xuICBhc3luYyBnZXRTdGF0dXNCdW5kbGUoKSB7XG4gICAgY29uc3QgYXJncyA9IFsnc3RhdHVzJywgJy0tcG9yY2VsYWluPXYyJywgJy0tYnJhbmNoJywgJy0tdW50cmFja2VkLWZpbGVzPWFsbCcsICctLWlnbm9yZS1zdWJtb2R1bGVzPWRpcnR5JywgJy16J107XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuICAgIGlmIChvdXRwdXQubGVuZ3RoID4gTUFYX1NUQVRVU19PVVRQVVRfTEVOR1RIKSB7XG4gICAgICB0aHJvdyBuZXcgTGFyZ2VSZXBvRXJyb3IoKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcGFyc2VTdGF0dXMob3V0cHV0KTtcblxuICAgIGZvciAoY29uc3QgZW50cnlUeXBlIGluIHJlc3VsdHMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdHNbZW50cnlUeXBlXSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVOYXRpdmVQYXRoU2VwRm9yRW50cmllcyhyZXN1bHRzW2VudHJ5VHlwZV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgdXBkYXRlTmF0aXZlUGF0aFNlcEZvckVudHJpZXMoZW50cmllcykge1xuICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAvLyBOb3JtYWxseSB3ZSB3b3VsZCBhdm9pZCBtdXRhdGluZyByZXNwb25zZXMgZnJvbSBvdGhlciBwYWNrYWdlJ3MgQVBJcywgYnV0IHdlIGNvbnRyb2xcbiAgICAgIC8vIHRoZSBgd2hhdC10aGUtc3RhdHVzYCBtb2R1bGUgYW5kIGtub3cgdGhlcmUgYXJlIG5vIHNpZGUgZWZmZWN0cy5cbiAgICAgIC8vIFRoaXMgaXMgYSBob3QgY29kZSBwYXRoIGFuZCBieSBtdXRhdGluZyB3ZSBhdm9pZCBjcmVhdGluZyBuZXcgb2JqZWN0cyB0aGF0IHdpbGwganVzdCBiZSBHQydlZFxuICAgICAgaWYgKGVudHJ5LmZpbGVQYXRoKSB7XG4gICAgICAgIGVudHJ5LmZpbGVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKGVudHJ5LmZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5vcmlnRmlsZVBhdGgpIHtcbiAgICAgICAgZW50cnkub3JpZ0ZpbGVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKGVudHJ5Lm9yaWdGaWxlUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkaWZmRmlsZVN0YXR1cyhvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydkaWZmJywgJy0tbmFtZS1zdGF0dXMnLCAnLS1uby1yZW5hbWVzJ107XG4gICAgaWYgKG9wdGlvbnMuc3RhZ2VkKSB7IGFyZ3MucHVzaCgnLS1zdGFnZWQnKTsgfVxuICAgIGlmIChvcHRpb25zLnRhcmdldCkgeyBhcmdzLnB1c2gob3B0aW9ucy50YXJnZXQpOyB9XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuXG4gICAgY29uc3Qgc3RhdHVzTWFwID0ge1xuICAgICAgQTogJ2FkZGVkJyxcbiAgICAgIE06ICdtb2RpZmllZCcsXG4gICAgICBEOiAnZGVsZXRlZCcsXG4gICAgICBVOiAndW5tZXJnZWQnLFxuICAgIH07XG5cbiAgICBjb25zdCBmaWxlU3RhdHVzZXMgPSB7fTtcbiAgICBvdXRwdXQgJiYgb3V0cHV0LnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgIGNvbnN0IFtzdGF0dXMsIHJhd0ZpbGVQYXRoXSA9IGxpbmUuc3BsaXQoJ1xcdCcpO1xuICAgICAgY29uc3QgZmlsZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAocmF3RmlsZVBhdGgpO1xuICAgICAgZmlsZVN0YXR1c2VzW2ZpbGVQYXRoXSA9IHN0YXR1c01hcFtzdGF0dXNdO1xuICAgIH0pO1xuICAgIGlmICghb3B0aW9ucy5zdGFnZWQpIHtcbiAgICAgIGNvbnN0IHVudHJhY2tlZCA9IGF3YWl0IHRoaXMuZ2V0VW50cmFja2VkRmlsZXMoKTtcbiAgICAgIHVudHJhY2tlZC5mb3JFYWNoKGZpbGVQYXRoID0+IHsgZmlsZVN0YXR1c2VzW2ZpbGVQYXRoXSA9ICdhZGRlZCc7IH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmlsZVN0YXR1c2VzO1xuICB9XG5cbiAgYXN5bmMgZ2V0VW50cmFja2VkRmlsZXMoKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsnbHMtZmlsZXMnLCAnLS1vdGhlcnMnLCAnLS1leGNsdWRlLXN0YW5kYXJkJ10pO1xuICAgIGlmIChvdXRwdXQudHJpbSgpID09PSAnJykgeyByZXR1cm4gW107IH1cbiAgICByZXR1cm4gb3V0cHV0LnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubWFwKHRvTmF0aXZlUGF0aFNlcCk7XG4gIH1cblxuICBhc3luYyBnZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCB7c3RhZ2VkLCBiYXNlQ29tbWl0fSA9IHt9KSB7XG4gICAgbGV0IGFyZ3MgPSBbJ2RpZmYnLCAnLS1uby1wcmVmaXgnLCAnLS1uby1leHQtZGlmZicsICctLW5vLXJlbmFtZXMnLCAnLS1kaWZmLWZpbHRlcj11J107XG4gICAgaWYgKHN0YWdlZCkgeyBhcmdzLnB1c2goJy0tc3RhZ2VkJyk7IH1cbiAgICBpZiAoYmFzZUNvbW1pdCkgeyBhcmdzLnB1c2goYmFzZUNvbW1pdCk7IH1cbiAgICBhcmdzID0gYXJncy5jb25jYXQoWyctLScsIHRvR2l0UGF0aFNlcChmaWxlUGF0aCldKTtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG5cbiAgICBsZXQgcmF3RGlmZnMgPSBbXTtcbiAgICBpZiAob3V0cHV0KSB7XG4gICAgICByYXdEaWZmcyA9IHBhcnNlRGlmZihvdXRwdXQpXG4gICAgICAgIC5maWx0ZXIocmF3RGlmZiA9PiByYXdEaWZmLnN0YXR1cyAhPT0gJ3VubWVyZ2VkJyk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmF3RGlmZnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmF3RGlmZiA9IHJhd0RpZmZzW2ldO1xuICAgICAgICBpZiAocmF3RGlmZi5vbGRQYXRoKSB7XG4gICAgICAgICAgcmF3RGlmZi5vbGRQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJhd0RpZmYub2xkUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJhd0RpZmYubmV3UGF0aCkge1xuICAgICAgICAgIHJhd0RpZmYubmV3UGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyYXdEaWZmLm5ld1BhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzdGFnZWQgJiYgKGF3YWl0IHRoaXMuZ2V0VW50cmFja2VkRmlsZXMoKSkuaW5jbHVkZXMoZmlsZVBhdGgpKSB7XG4gICAgICAvLyBhZGQgdW50cmFja2VkIGZpbGVcbiAgICAgIGNvbnN0IGFic1BhdGggPSBwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCBmaWxlUGF0aCk7XG4gICAgICBjb25zdCBleGVjdXRhYmxlID0gYXdhaXQgaXNGaWxlRXhlY3V0YWJsZShhYnNQYXRoKTtcbiAgICAgIGNvbnN0IHN5bWxpbmsgPSBhd2FpdCBpc0ZpbGVTeW1saW5rKGFic1BhdGgpO1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShhYnNQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgICAgY29uc3QgYmluYXJ5ID0gaXNCaW5hcnkoY29udGVudHMpO1xuICAgICAgbGV0IG1vZGU7XG4gICAgICBsZXQgcmVhbHBhdGg7XG4gICAgICBpZiAoZXhlY3V0YWJsZSkge1xuICAgICAgICBtb2RlID0gRmlsZS5tb2Rlcy5FWEVDVVRBQkxFO1xuICAgICAgfSBlbHNlIGlmIChzeW1saW5rKSB7XG4gICAgICAgIG1vZGUgPSBGaWxlLm1vZGVzLlNZTUxJTks7XG4gICAgICAgIHJlYWxwYXRoID0gYXdhaXQgZnMucmVhbHBhdGgoYWJzUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb2RlID0gRmlsZS5tb2Rlcy5OT1JNQUw7XG4gICAgICB9XG5cbiAgICAgIHJhd0RpZmZzLnB1c2goYnVpbGRBZGRlZEZpbGVQYXRjaChmaWxlUGF0aCwgYmluYXJ5ID8gbnVsbCA6IGNvbnRlbnRzLCBtb2RlLCByZWFscGF0aCkpO1xuICAgIH1cbiAgICBpZiAocmF3RGlmZnMubGVuZ3RoID4gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBiZXR3ZWVuIDAgYW5kIDIgZGlmZnMgZm9yICR7ZmlsZVBhdGh9IGJ1dCBnb3QgJHtyYXdEaWZmcy5sZW5ndGh9YCk7XG4gICAgfVxuICAgIHJldHVybiByYXdEaWZmcztcbiAgfVxuXG4gIGFzeW5jIGdldFN0YWdlZENoYW5nZXNQYXRjaCgpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoW1xuICAgICAgJ2RpZmYnLCAnLS1zdGFnZWQnLCAnLS1uby1wcmVmaXgnLCAnLS1uby1leHQtZGlmZicsICctLW5vLXJlbmFtZXMnLCAnLS1kaWZmLWZpbHRlcj11JyxcbiAgICBdKTtcblxuICAgIGlmICghb3V0cHV0KSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZGlmZnMgPSBwYXJzZURpZmYob3V0cHV0KTtcbiAgICBmb3IgKGNvbnN0IGRpZmYgb2YgZGlmZnMpIHtcbiAgICAgIGlmIChkaWZmLm9sZFBhdGgpIHsgZGlmZi5vbGRQYXRoID0gdG9OYXRpdmVQYXRoU2VwKGRpZmYub2xkUGF0aCk7IH1cbiAgICAgIGlmIChkaWZmLm5ld1BhdGgpIHsgZGlmZi5uZXdQYXRoID0gdG9OYXRpdmVQYXRoU2VwKGRpZmYubmV3UGF0aCk7IH1cbiAgICB9XG4gICAgcmV0dXJuIGRpZmZzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1pc2NlbGxhbmVvdXMgZ2V0dGVyc1xuICAgKi9cbiAgYXN5bmMgZ2V0Q29tbWl0KHJlZikge1xuICAgIGNvbnN0IFtjb21taXRdID0gYXdhaXQgdGhpcy5nZXRDb21taXRzKHttYXg6IDEsIHJlZiwgaW5jbHVkZVVuYm9ybjogdHJ1ZX0pO1xuICAgIHJldHVybiBjb21taXQ7XG4gIH1cblxuICBhc3luYyBnZXRIZWFkQ29tbWl0KCkge1xuICAgIGNvbnN0IFtoZWFkQ29tbWl0XSA9IGF3YWl0IHRoaXMuZ2V0Q29tbWl0cyh7bWF4OiAxLCByZWY6ICdIRUFEJywgaW5jbHVkZVVuYm9ybjogdHJ1ZX0pO1xuICAgIHJldHVybiBoZWFkQ29tbWl0O1xuICB9XG5cbiAgYXN5bmMgZ2V0Q29tbWl0cyhvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7bWF4LCByZWYsIGluY2x1ZGVVbmJvcm4sIGluY2x1ZGVQYXRjaH0gPSB7XG4gICAgICBtYXg6IDEsXG4gICAgICByZWY6ICdIRUFEJyxcbiAgICAgIGluY2x1ZGVVbmJvcm46IGZhbHNlLFxuICAgICAgaW5jbHVkZVBhdGNoOiBmYWxzZSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIC8vIGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXQtbG9nI19wcmV0dHlfZm9ybWF0c1xuICAgIC8vICV4MDAgLSBudWxsIGJ5dGVcbiAgICAvLyAlSCAtIGNvbW1pdCBTSEFcbiAgICAvLyAlYWUgLSBhdXRob3IgZW1haWxcbiAgICAvLyAlYW4gPSBhdXRob3IgZnVsbCBuYW1lXG4gICAgLy8gJWF0IC0gdGltZXN0YW1wLCBVTklYIHRpbWVzdGFtcFxuICAgIC8vICVzIC0gc3ViamVjdFxuICAgIC8vICViIC0gYm9keVxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnbG9nJyxcbiAgICAgICctLXByZXR0eT1mb3JtYXQ6JUgleDAwJWFlJXgwMCVhbiV4MDAlYXQleDAwJXMleDAwJWIleDAwJyxcbiAgICAgICctLW5vLWFiYnJldi1jb21taXQnLFxuICAgICAgJy0tbm8tcHJlZml4JyxcbiAgICAgICctLW5vLWV4dC1kaWZmJyxcbiAgICAgICctLW5vLXJlbmFtZXMnLFxuICAgICAgJy16JyxcbiAgICAgICctbicsXG4gICAgICBtYXgsXG4gICAgICByZWYsXG4gICAgXTtcblxuICAgIGlmIChpbmNsdWRlUGF0Y2gpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1wYXRjaCcsICctbScsICctLWZpcnN0LXBhcmVudCcpO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzLmNvbmNhdCgnLS0nKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIGlmICgvdW5rbm93biByZXZpc2lvbi8udGVzdChlcnIuc3RkRXJyKSB8fCAvYmFkIHJldmlzaW9uICdIRUFEJy8udGVzdChlcnIuc3RkRXJyKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAob3V0cHV0ID09PSAnJykge1xuICAgICAgcmV0dXJuIGluY2x1ZGVVbmJvcm4gPyBbe3NoYTogJycsIG1lc3NhZ2U6ICcnLCB1bmJvcm5SZWY6IHRydWV9XSA6IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkcyA9IG91dHB1dC50cmltKCkuc3BsaXQoJ1xcMCcpO1xuXG4gICAgY29uc3QgY29tbWl0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSArPSA3KSB7XG4gICAgICBjb25zdCBib2R5ID0gZmllbGRzW2kgKyA1XS50cmltKCk7XG4gICAgICBsZXQgcGF0Y2ggPSBbXTtcbiAgICAgIGlmIChpbmNsdWRlUGF0Y2gpIHtcbiAgICAgICAgY29uc3QgZGlmZnMgPSBmaWVsZHNbaSArIDZdO1xuICAgICAgICBwYXRjaCA9IHBhcnNlRGlmZihkaWZmcy50cmltKCkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7bWVzc2FnZTogbWVzc2FnZUJvZHksIGNvQXV0aG9yc30gPSBleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZShib2R5KTtcblxuICAgICAgY29tbWl0cy5wdXNoKHtcbiAgICAgICAgc2hhOiBmaWVsZHNbaV0gJiYgZmllbGRzW2ldLnRyaW0oKSxcbiAgICAgICAgYXV0aG9yOiBuZXcgQXV0aG9yKGZpZWxkc1tpICsgMV0gJiYgZmllbGRzW2kgKyAxXS50cmltKCksIGZpZWxkc1tpICsgMl0gJiYgZmllbGRzW2kgKyAyXS50cmltKCkpLFxuICAgICAgICBhdXRob3JEYXRlOiBwYXJzZUludChmaWVsZHNbaSArIDNdLCAxMCksXG4gICAgICAgIG1lc3NhZ2VTdWJqZWN0OiBmaWVsZHNbaSArIDRdLFxuICAgICAgICBtZXNzYWdlQm9keSxcbiAgICAgICAgY29BdXRob3JzLFxuICAgICAgICB1bmJvcm5SZWY6IGZhbHNlLFxuICAgICAgICBwYXRjaCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY29tbWl0cztcbiAgfVxuXG4gIGFzeW5jIGdldEF1dGhvcnMob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qge21heCwgcmVmfSA9IHttYXg6IDEsIHJlZjogJ0hFQUQnLCAuLi5vcHRpb25zfTtcblxuICAgIC8vIGh0dHBzOi8vZ2l0LXNjbS5jb20vZG9jcy9naXQtbG9nI19wcmV0dHlfZm9ybWF0c1xuICAgIC8vICV4MUYgLSBmaWVsZCBzZXBhcmF0b3IgYnl0ZVxuICAgIC8vICVhbiAtIGF1dGhvciBuYW1lXG4gICAgLy8gJWFlIC0gYXV0aG9yIGVtYWlsXG4gICAgLy8gJWNuIC0gY29tbWl0dGVyIG5hbWVcbiAgICAvLyAlY2UgLSBjb21taXR0ZXIgZW1haWxcbiAgICAvLyAlKHRyYWlsZXJzOnVuZm9sZCxvbmx5KSAtIHRoZSBjb21taXQgbWVzc2FnZSB0cmFpbGVycywgc2VwYXJhdGVkXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBieSBuZXdsaW5lcyBhbmQgdW5mb2xkZWQgKGkuZS4gcHJvcGVybHlcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlZCBhbmQgb25lIHRyYWlsZXIgcGVyIGxpbmUpLlxuXG4gICAgY29uc3QgZGVsaW1pdGVyID0gJzFGJztcbiAgICBjb25zdCBkZWxpbWl0ZXJTdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGRlbGltaXRlciwgMTYpKTtcbiAgICBjb25zdCBmaWVsZHMgPSBbJyVhbicsICclYWUnLCAnJWNuJywgJyVjZScsICclKHRyYWlsZXJzOnVuZm9sZCxvbmx5KSddO1xuICAgIGNvbnN0IGZvcm1hdCA9IGZpZWxkcy5qb2luKGAleCR7ZGVsaW1pdGVyfWApO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbXG4gICAgICAgICdsb2cnLCBgLS1mb3JtYXQ9JHtmb3JtYXR9YCwgJy16JywgJy1uJywgbWF4LCByZWYsICctLScsXG4gICAgICBdKTtcblxuICAgICAgcmV0dXJuIG91dHB1dC5zcGxpdCgnXFwwJylcbiAgICAgICAgLnJlZHVjZSgoYWNjLCBsaW5lKSA9PiB7XG4gICAgICAgICAgaWYgKGxpbmUubGVuZ3RoID09PSAwKSB7IHJldHVybiBhY2M7IH1cblxuICAgICAgICAgIGNvbnN0IFthbiwgYWUsIGNuLCBjZSwgdHJhaWxlcnNdID0gbGluZS5zcGxpdChkZWxpbWl0ZXJTdHJpbmcpO1xuICAgICAgICAgIHRyYWlsZXJzXG4gICAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICAubWFwKHRyYWlsZXIgPT4gdHJhaWxlci5tYXRjaChDT19BVVRIT1JfUkVHRVgpKVxuICAgICAgICAgICAgLmZpbHRlcihtYXRjaCA9PiBtYXRjaCAhPT0gbnVsbClcbiAgICAgICAgICAgIC5mb3JFYWNoKChbXywgbmFtZSwgZW1haWxdKSA9PiB7IGFjY1tlbWFpbF0gPSBuYW1lOyB9KTtcblxuICAgICAgICAgIGFjY1thZV0gPSBhbjtcbiAgICAgICAgICBhY2NbY2VdID0gY247XG5cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoL3Vua25vd24gcmV2aXNpb24vLnRlc3QoZXJyLnN0ZEVycikgfHwgL2JhZCByZXZpc2lvbiAnSEVBRCcvLnRlc3QoZXJyLnN0ZEVycikpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1lcmdlVHJhaWxlcnMoY29tbWl0TWVzc2FnZSwgdHJhaWxlcnMpIHtcbiAgICBjb25zdCBhcmdzID0gWydpbnRlcnByZXQtdHJhaWxlcnMnXTtcbiAgICBmb3IgKGNvbnN0IHRyYWlsZXIgb2YgdHJhaWxlcnMpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS10cmFpbGVyJywgYCR7dHJhaWxlci50b2tlbn09JHt0cmFpbGVyLnZhbHVlfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHtzdGRpbjogY29tbWl0TWVzc2FnZX0pO1xuICB9XG5cbiAgcmVhZEZpbGVGcm9tSW5kZXgoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnc2hvdycsIGA6JHt0b0dpdFBhdGhTZXAoZmlsZVBhdGgpfWBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZVxuICAgKi9cbiAgbWVyZ2UoYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmdwZ0V4ZWMoWydtZXJnZScsIGJyYW5jaE5hbWVdLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGlzTWVyZ2luZyhkb3RHaXREaXIpIHtcbiAgICByZXR1cm4gZmlsZUV4aXN0cyhwYXRoLmpvaW4oZG90R2l0RGlyLCAnTUVSR0VfSEVBRCcpKS5jYXRjaCgoKSA9PiBmYWxzZSk7XG4gIH1cblxuICBhYm9ydE1lcmdlKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydtZXJnZScsICctLWFib3J0J10sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgY2hlY2tvdXRTaWRlKHNpZGUsIHBhdGhzKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWMoWydjaGVja291dCcsIGAtLSR7c2lkZX1gLCAuLi5wYXRocy5tYXAodG9HaXRQYXRoU2VwKV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYmFzZVxuICAgKi9cbiAgYXN5bmMgaXNSZWJhc2luZyhkb3RHaXREaXIpIHtcbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgZmlsZUV4aXN0cyhwYXRoLmpvaW4oZG90R2l0RGlyLCAncmViYXNlLW1lcmdlJykpLFxuICAgICAgZmlsZUV4aXN0cyhwYXRoLmpvaW4oZG90R2l0RGlyLCAncmViYXNlLWFwcGx5JykpLFxuICAgIF0pO1xuICAgIHJldHVybiByZXN1bHRzLnNvbWUociA9PiByKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdGUgaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjbG9uZShyZW1vdGVVcmwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2Nsb25lJ107XG4gICAgaWYgKG9wdGlvbnMubm9Mb2NhbCkgeyBhcmdzLnB1c2goJy0tbm8tbG9jYWwnKTsgfVxuICAgIGlmIChvcHRpb25zLmJhcmUpIHsgYXJncy5wdXNoKCctLWJhcmUnKTsgfVxuICAgIGlmIChvcHRpb25zLnJlY3Vyc2l2ZSkgeyBhcmdzLnB1c2goJy0tcmVjdXJzaXZlJyk7IH1cbiAgICBpZiAob3B0aW9ucy5zb3VyY2VSZW1vdGVOYW1lKSB7IGFyZ3MucHVzaCgnLS1vcmlnaW4nLCBvcHRpb25zLnJlbW90ZU5hbWUpOyB9XG4gICAgYXJncy5wdXNoKHJlbW90ZVVybCwgdGhpcy53b3JraW5nRGlyKTtcblxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3VzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSwgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGZldGNoKHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnZmV0Y2gnLCByZW1vdGVOYW1lLCBicmFuY2hOYW1lXSwge3VzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSwgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIHB1bGwocmVtb3RlTmFtZSwgYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsncHVsbCcsIHJlbW90ZU5hbWUsIG9wdGlvbnMucmVmU3BlYyB8fCBicmFuY2hOYW1lXTtcbiAgICBpZiAob3B0aW9ucy5mZk9ubHkpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1mZi1vbmx5Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdwZ0V4ZWMoYXJncywge3VzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSwgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIHB1c2gocmVtb3RlTmFtZSwgYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsncHVzaCcsIHJlbW90ZU5hbWUgfHwgJ29yaWdpbicsIG9wdGlvbnMucmVmU3BlYyB8fCBgcmVmcy9oZWFkcy8ke2JyYW5jaE5hbWV9YF07XG4gICAgaWYgKG9wdGlvbnMuc2V0VXBzdHJlYW0pIHsgYXJncy5wdXNoKCctLXNldC11cHN0cmVhbScpOyB9XG4gICAgaWYgKG9wdGlvbnMuZm9yY2UpIHsgYXJncy5wdXNoKCctLWZvcmNlJyk7IH1cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICAvKipcbiAgICogVW5kbyBPcGVyYXRpb25zXG4gICAqL1xuICByZXNldCh0eXBlLCByZXZpc2lvbiA9ICdIRUFEJykge1xuICAgIGNvbnN0IHZhbGlkVHlwZXMgPSBbJ3NvZnQnXTtcbiAgICBpZiAoIXZhbGlkVHlwZXMuaW5jbHVkZXModHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlICR7dHlwZX0uIE11c3QgYmUgb25lIG9mOiAke3ZhbGlkVHlwZXMuam9pbignLCAnKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3Jlc2V0JywgYC0tJHt0eXBlfWAsIHJldmlzaW9uXSk7XG4gIH1cblxuICBkZWxldGVSZWYocmVmKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3VwZGF0ZS1yZWYnLCAnLWQnLCByZWZdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCcmFuY2hlc1xuICAgKi9cbiAgY2hlY2tvdXQoYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnY2hlY2tvdXQnXTtcbiAgICBpZiAob3B0aW9ucy5jcmVhdGVOZXcpIHtcbiAgICAgIGFyZ3MucHVzaCgnLWInKTtcbiAgICB9XG4gICAgYXJncy5wdXNoKGJyYW5jaE5hbWUpO1xuICAgIGlmIChvcHRpb25zLnN0YXJ0UG9pbnQpIHtcbiAgICAgIGlmIChvcHRpb25zLnRyYWNrKSB7IGFyZ3MucHVzaCgnLS10cmFjaycpOyB9XG4gICAgICBhcmdzLnB1c2gob3B0aW9ucy5zdGFydFBvaW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0QnJhbmNoZXMoKSB7XG4gICAgY29uc3QgZm9ybWF0ID0gW1xuICAgICAgJyUob2JqZWN0bmFtZSknLCAnJShIRUFEKScsICclKHJlZm5hbWU6c2hvcnQpJyxcbiAgICAgICclKHVwc3RyZWFtKScsICclKHVwc3RyZWFtOnJlbW90ZW5hbWUpJywgJyUodXBzdHJlYW06cmVtb3RlcmVmKScsXG4gICAgICAnJShwdXNoKScsICclKHB1c2g6cmVtb3RlbmFtZSknLCAnJShwdXNoOnJlbW90ZXJlZiknLFxuICAgIF0uam9pbignJTAwJyk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydmb3ItZWFjaC1yZWYnLCBgLS1mb3JtYXQ9JHtmb3JtYXR9YCwgJ3JlZnMvaGVhZHMvKionXSk7XG4gICAgcmV0dXJuIG91dHB1dC50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLm1hcChsaW5lID0+IHtcbiAgICAgIGNvbnN0IFtcbiAgICAgICAgc2hhLCBoZWFkLCBuYW1lLFxuICAgICAgICB1cHN0cmVhbVRyYWNraW5nUmVmLCB1cHN0cmVhbVJlbW90ZU5hbWUsIHVwc3RyZWFtUmVtb3RlUmVmLFxuICAgICAgICBwdXNoVHJhY2tpbmdSZWYsIHB1c2hSZW1vdGVOYW1lLCBwdXNoUmVtb3RlUmVmLFxuICAgICAgXSA9IGxpbmUuc3BsaXQoJ1xcMCcpO1xuXG4gICAgICBjb25zdCBicmFuY2ggPSB7bmFtZSwgc2hhLCBoZWFkOiBoZWFkID09PSAnKid9O1xuICAgICAgaWYgKHVwc3RyZWFtVHJhY2tpbmdSZWYgfHwgdXBzdHJlYW1SZW1vdGVOYW1lIHx8IHVwc3RyZWFtUmVtb3RlUmVmKSB7XG4gICAgICAgIGJyYW5jaC51cHN0cmVhbSA9IHtcbiAgICAgICAgICB0cmFja2luZ1JlZjogdXBzdHJlYW1UcmFja2luZ1JlZixcbiAgICAgICAgICByZW1vdGVOYW1lOiB1cHN0cmVhbVJlbW90ZU5hbWUsXG4gICAgICAgICAgcmVtb3RlUmVmOiB1cHN0cmVhbVJlbW90ZVJlZixcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChicmFuY2gudXBzdHJlYW0gfHwgcHVzaFRyYWNraW5nUmVmIHx8IHB1c2hSZW1vdGVOYW1lIHx8IHB1c2hSZW1vdGVSZWYpIHtcbiAgICAgICAgYnJhbmNoLnB1c2ggPSB7XG4gICAgICAgICAgdHJhY2tpbmdSZWY6IHB1c2hUcmFja2luZ1JlZixcbiAgICAgICAgICByZW1vdGVOYW1lOiBwdXNoUmVtb3RlTmFtZSB8fCAoYnJhbmNoLnVwc3RyZWFtICYmIGJyYW5jaC51cHN0cmVhbS5yZW1vdGVOYW1lKSxcbiAgICAgICAgICByZW1vdGVSZWY6IHB1c2hSZW1vdGVSZWYgfHwgKGJyYW5jaC51cHN0cmVhbSAmJiBicmFuY2gudXBzdHJlYW0ucmVtb3RlUmVmKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBicmFuY2g7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hlc1dpdGhDb21taXQoc2hhLCBvcHRpb24gPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2JyYW5jaCcsICctLWZvcm1hdD0lKHJlZm5hbWUpJywgJy0tY29udGFpbnMnLCBzaGFdO1xuICAgIGlmIChvcHRpb24uc2hvd0xvY2FsICYmIG9wdGlvbi5zaG93UmVtb3RlKSB7XG4gICAgICBhcmdzLnNwbGljZSgxLCAwLCAnLS1hbGwnKTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbi5zaG93UmVtb3RlKSB7XG4gICAgICBhcmdzLnNwbGljZSgxLCAwLCAnLS1yZW1vdGVzJyk7XG4gICAgfVxuICAgIGlmIChvcHRpb24ucGF0dGVybikge1xuICAgICAgYXJncy5wdXNoKG9wdGlvbi5wYXR0ZXJuKTtcbiAgICB9XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmV4ZWMoYXJncykpLnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCk7XG4gIH1cblxuICBjaGVja291dEZpbGVzKHBhdGhzLCByZXZpc2lvbikge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBhcmdzID0gWydjaGVja291dCddO1xuICAgIGlmIChyZXZpc2lvbikgeyBhcmdzLnB1c2gocmV2aXNpb24pOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLmNvbmNhdCgnLS0nLCBwYXRocy5tYXAodG9HaXRQYXRoU2VwKSksIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZGVzY3JpYmVIZWFkKCkge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5leGVjKFsnZGVzY3JpYmUnLCAnLS1jb250YWlucycsICctLWFsbCcsICctLWFsd2F5cycsICdIRUFEJ10pKS50cmltKCk7XG4gIH1cblxuICBhc3luYyBnZXRDb25maWcob3B0aW9uLCB7bG9jYWx9ID0ge30pIHtcbiAgICBsZXQgb3V0cHV0O1xuICAgIHRyeSB7XG4gICAgICBsZXQgYXJncyA9IFsnY29uZmlnJ107XG4gICAgICBpZiAobG9jYWwpIHsgYXJncy5wdXNoKCctLWxvY2FsJyk7IH1cbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChvcHRpb24pO1xuICAgICAgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAxIHx8IGVyci5jb2RlID09PSAxMjgpIHtcbiAgICAgICAgLy8gTm8gbWF0Y2hpbmcgY29uZmlnIGZvdW5kIE9SIC0tbG9jYWwgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgYSBnaXQgcmVwb3NpdG9yeVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0LnRyaW0oKTtcbiAgfVxuXG4gIHNldENvbmZpZyhvcHRpb24sIHZhbHVlLCB7cmVwbGFjZUFsbCwgZ2xvYmFsfSA9IHt9KSB7XG4gICAgbGV0IGFyZ3MgPSBbJ2NvbmZpZyddO1xuICAgIGlmIChyZXBsYWNlQWxsKSB7IGFyZ3MucHVzaCgnLS1yZXBsYWNlLWFsbCcpOyB9XG4gICAgaWYgKGdsb2JhbCkgeyBhcmdzLnB1c2goJy0tZ2xvYmFsJyk7IH1cbiAgICBhcmdzID0gYXJncy5jb25jYXQob3B0aW9uLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIHVuc2V0Q29uZmlnKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydjb25maWcnLCAnLS11bnNldCcsIG9wdGlvbl0sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVtb3RlcygpIHtcbiAgICBsZXQgb3V0cHV0ID0gYXdhaXQgdGhpcy5nZXRDb25maWcoWyctLWdldC1yZWdleHAnLCAnXnJlbW90ZVxcXFwuLipcXFxcLnVybCQnXSwge2xvY2FsOiB0cnVlfSk7XG4gICAgaWYgKG91dHB1dCkge1xuICAgICAgb3V0cHV0ID0gb3V0cHV0LnRyaW0oKTtcbiAgICAgIGlmICghb3V0cHV0Lmxlbmd0aCkgeyByZXR1cm4gW107IH1cbiAgICAgIHJldHVybiBvdXRwdXQuc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9ecmVtb3RlXFwuKC4qKVxcLnVybCAoLiopJC8pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IG1hdGNoWzFdLFxuICAgICAgICAgIHVybDogbWF0Y2hbMl0sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfVxuXG4gIGFkZFJlbW90ZShuYW1lLCB1cmwpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsncmVtb3RlJywgJ2FkZCcsIG5hbWUsIHVybF0pO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlQmxvYih7ZmlsZVBhdGgsIHN0ZGlufSA9IHt9KSB7XG4gICAgbGV0IG91dHB1dDtcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG91dHB1dCA9IChhd2FpdCB0aGlzLmV4ZWMoWydoYXNoLW9iamVjdCcsICctdycsIGZpbGVQYXRoXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSkpLnRyaW0oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUuc3RkRXJyICYmIGUuc3RkRXJyLm1hdGNoKC9mYXRhbDogQ2Fubm90IG9wZW4gLio6IE5vIHN1Y2ggZmlsZSBvciBkaXJlY3RvcnkvKSkge1xuICAgICAgICAgIG91dHB1dCA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RkaW4pIHtcbiAgICAgIG91dHB1dCA9IChhd2FpdCB0aGlzLmV4ZWMoWydoYXNoLW9iamVjdCcsICctdycsICctLXN0ZGluJ10sIHtzdGRpbiwgd3JpdGVPcGVyYXRpb246IHRydWV9KSkudHJpbSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3Qgc3VwcGx5IGZpbGUgcGF0aCBvciBzdGRpbicpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgYXN5bmMgZXhwYW5kQmxvYlRvRmlsZShhYnNGaWxlUGF0aCwgc2hhKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsnY2F0LWZpbGUnLCAnLXAnLCBzaGFdKTtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoYWJzRmlsZVBhdGgsIG91dHB1dCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICByZXR1cm4gYWJzRmlsZVBhdGg7XG4gIH1cblxuICBhc3luYyBnZXRCbG9iQ29udGVudHMoc2hhKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlYyhbJ2NhdC1maWxlJywgJy1wJywgc2hhXSk7XG4gIH1cblxuICBhc3luYyBtZXJnZUZpbGUob3Vyc1BhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICdtZXJnZS1maWxlJywgJy1wJywgb3Vyc1BhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLFxuICAgICAgJy1MJywgJ2N1cnJlbnQnLCAnLUwnLCAnYWZ0ZXIgZGlzY2FyZCcsICctTCcsICdiZWZvcmUgZGlzY2FyZCcsXG4gICAgXTtcbiAgICBsZXQgb3V0cHV0O1xuICAgIGxldCBjb25mbGljdCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBHaXRFcnJvciAmJiBlLmNvZGUgPT09IDEpIHtcbiAgICAgICAgb3V0cHV0ID0gZS5zdGRPdXQ7XG4gICAgICAgIGNvbmZsaWN0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW50ZXJwcmV0IGEgcmVsYXRpdmUgcmVzdWx0UGF0aCBhcyByZWxhdGl2ZSB0byB0aGUgcmVwb3NpdG9yeSB3b3JraW5nIGRpcmVjdG9yeSBmb3IgY29uc2lzdGVuY3kgd2l0aCB0aGVcbiAgICAvLyBvdGhlciBhcmd1bWVudHMuXG4gICAgY29uc3QgcmVzb2x2ZWRSZXN1bHRQYXRoID0gcGF0aC5yZXNvbHZlKHRoaXMud29ya2luZ0RpciwgcmVzdWx0UGF0aCk7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKHJlc29sdmVkUmVzdWx0UGF0aCwgb3V0cHV0LCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuXG4gICAgcmV0dXJuIHtmaWxlUGF0aDogb3Vyc1BhdGgsIHJlc3VsdFBhdGgsIGNvbmZsaWN0fTtcbiAgfVxuXG4gIGFzeW5jIHdyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgoZmlsZVBhdGgsIGNvbW1vbkJhc2VTaGEsIG91cnNTaGEsIHRoZWlyc1NoYSkge1xuICAgIGNvbnN0IGdpdEZpbGVQYXRoID0gdG9HaXRQYXRoU2VwKGZpbGVQYXRoKTtcbiAgICBjb25zdCBmaWxlTW9kZSA9IGF3YWl0IHRoaXMuZ2V0RmlsZU1vZGUoZmlsZVBhdGgpO1xuICAgIGxldCBpbmRleEluZm8gPSBgMCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwXFx0JHtnaXRGaWxlUGF0aH1cXG5gO1xuICAgIGlmIChjb21tb25CYXNlU2hhKSB7IGluZGV4SW5mbyArPSBgJHtmaWxlTW9kZX0gJHtjb21tb25CYXNlU2hhfSAxXFx0JHtnaXRGaWxlUGF0aH1cXG5gOyB9XG4gICAgaWYgKG91cnNTaGEpIHsgaW5kZXhJbmZvICs9IGAke2ZpbGVNb2RlfSAke291cnNTaGF9IDJcXHQke2dpdEZpbGVQYXRofVxcbmA7IH1cbiAgICBpZiAodGhlaXJzU2hhKSB7IGluZGV4SW5mbyArPSBgJHtmaWxlTW9kZX0gJHt0aGVpcnNTaGF9IDNcXHQke2dpdEZpbGVQYXRofVxcbmA7IH1cbiAgICByZXR1cm4gdGhpcy5leGVjKFsndXBkYXRlLWluZGV4JywgJy0taW5kZXgtaW5mbyddLCB7c3RkaW46IGluZGV4SW5mbywgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEZpbGVNb2RlKGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsnbHMtZmlsZXMnLCAnLS1zdGFnZScsICctLScsIHRvR2l0UGF0aFNlcChmaWxlUGF0aCldKTtcbiAgICBpZiAob3V0cHV0KSB7XG4gICAgICByZXR1cm4gb3V0cHV0LnNsaWNlKDAsIDYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleGVjdXRhYmxlID0gYXdhaXQgaXNGaWxlRXhlY3V0YWJsZShwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCBmaWxlUGF0aCkpO1xuICAgICAgY29uc3Qgc3ltbGluayA9IGF3YWl0IGlzRmlsZVN5bWxpbmsocGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgZmlsZVBhdGgpKTtcbiAgICAgIGlmIChzeW1saW5rKSB7XG4gICAgICAgIHJldHVybiBGaWxlLm1vZGVzLlNZTUxJTks7XG4gICAgICB9IGVsc2UgaWYgKGV4ZWN1dGFibGUpIHtcbiAgICAgICAgcmV0dXJuIEZpbGUubW9kZXMuRVhFQ1VUQUJMRTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBGaWxlLm1vZGVzLk5PUk1BTDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY29tbWFuZFF1ZXVlLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEFkZGVkRmlsZVBhdGNoKGZpbGVQYXRoLCBjb250ZW50cywgbW9kZSwgcmVhbHBhdGgpIHtcbiAgY29uc3QgaHVua3MgPSBbXTtcbiAgaWYgKGNvbnRlbnRzKSB7XG4gICAgbGV0IG5vTmV3TGluZTtcbiAgICBsZXQgbGluZXM7XG4gICAgaWYgKG1vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSykge1xuICAgICAgbm9OZXdMaW5lID0gZmFsc2U7XG4gICAgICBsaW5lcyA9IFtgKyR7dG9HaXRQYXRoU2VwKHJlYWxwYXRoKX1gLCAnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vTmV3TGluZSA9IGNvbnRlbnRzW2NvbnRlbnRzLmxlbmd0aCAtIDFdICE9PSAnXFxuJztcbiAgICAgIGxpbmVzID0gY29udGVudHMudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5tYXAobGluZSA9PiBgKyR7bGluZX1gKTtcbiAgICB9XG4gICAgaWYgKG5vTmV3TGluZSkgeyBsaW5lcy5wdXNoKCdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTsgfVxuICAgIGh1bmtzLnB1c2goe1xuICAgICAgbGluZXMsXG4gICAgICBvbGRTdGFydExpbmU6IDAsXG4gICAgICBvbGRMaW5lQ291bnQ6IDAsXG4gICAgICBuZXdTdGFydExpbmU6IDEsXG4gICAgICBoZWFkaW5nOiAnJyxcbiAgICAgIG5ld0xpbmVDb3VudDogbm9OZXdMaW5lID8gbGluZXMubGVuZ3RoIC0gMSA6IGxpbmVzLmxlbmd0aCxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG9sZFBhdGg6IG51bGwsXG4gICAgbmV3UGF0aDogdG9OYXRpdmVQYXRoU2VwKGZpbGVQYXRoKSxcbiAgICBvbGRNb2RlOiBudWxsLFxuICAgIG5ld01vZGU6IG1vZGUsXG4gICAgc3RhdHVzOiAnYWRkZWQnLFxuICAgIGh1bmtzLFxuICB9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