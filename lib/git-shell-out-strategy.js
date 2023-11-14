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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX29zIiwiX2NoaWxkX3Byb2Nlc3MiLCJfZnNFeHRyYSIsIl91dGlsIiwiX2VsZWN0cm9uIiwiX2V2ZW50S2l0IiwiX2R1Z2l0ZSIsIl93aGF0VGhlRGlmZiIsIl93aGF0VGhlU3RhdHVzIiwiX2dpdFByb21wdFNlcnZlciIsIl9naXRUZW1wRGlyIiwiX2FzeW5jUXVldWUiLCJfcmVwb3J0ZXJQcm94eSIsIl9oZWxwZXJzIiwiX2dpdFRpbWluZ3NWaWV3IiwiX2ZpbGUiLCJfd29ya2VyTWFuYWdlciIsIl9hdXRob3IiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIm93bktleXMiLCJlIiwiciIsInQiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTUFYX1NUQVRVU19PVVRQVVRfTEVOR1RIIiwiaGVhZGxlc3MiLCJleGVjUGF0aFByb21pc2UiLCJHaXRFcnJvciIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJtZXNzYWdlIiwic3RhY2siLCJleHBvcnRzIiwiTGFyZ2VSZXBvRXJyb3IiLCJJR05PUkVEX0dJVF9DT01NQU5EUyIsIkRJU0FCTEVfQ09MT1JfRkxBR1MiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwidW5zaGlmdCIsIkVYUEFORF9USUxERV9SRUdFWCIsIlJlZ0V4cCIsIkdpdFNoZWxsT3V0U3RyYXRlZ3kiLCJ3b3JraW5nRGlyIiwib3B0aW9ucyIsInF1ZXVlIiwiY29tbWFuZFF1ZXVlIiwicGFyYWxsZWxpc20iLCJNYXRoIiwibWF4Iiwib3MiLCJjcHVzIiwiQXN5bmNRdWV1ZSIsInByb21wdCIsInF1ZXJ5IiwiUHJvbWlzZSIsInJlamVjdCIsIndvcmtlck1hbmFnZXIiLCJyZW1vdGUiLCJnZXRDdXJyZW50V2luZG93IiwiaXNWaXNpYmxlIiwic2V0UHJvbXB0Q2FsbGJhY2siLCJleGVjIiwiYXJncyIsImRlZmF1bHRFeGVjQXJncyIsInN0ZGluIiwidXNlR2l0UHJvbXB0U2VydmVyIiwidXNlR3BnV3JhcHBlciIsInVzZUdwZ0F0b21Qcm9tcHQiLCJ3cml0ZU9wZXJhdGlvbiIsImNvbW1hbmROYW1lIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJkaWFnbm9zdGljc0VuYWJsZWQiLCJwcm9jZXNzIiwiZW52IiwiQVRPTV9HSVRIVUJfR0lUX0RJQUdOT1NUSUNTIiwiYXRvbSIsImNvbmZpZyIsImdldCIsImZvcm1hdHRlZEFyZ3MiLCJqb2luIiwidGltaW5nTWFya2VyIiwiR2l0VGltaW5nc1ZpZXciLCJnZW5lcmF0ZU1hcmtlciIsIm1hcmsiLCJyZXNvbHZlIiwiY2hpbGRQcm9jZXNzIiwiZXJyb3IiLCJzdGRvdXQiLCJ0cmltIiwiZXhlY1BhdGgiLCJnaXRQcm9tcHRTZXJ2ZXIiLCJwYXRoUGFydHMiLCJQQVRIIiwiR0lUX1RFUk1JTkFMX1BST01QVCIsIkdJVF9PUFRJT05BTF9MT0NLUyIsInBhdGgiLCJkZWxpbWl0ZXIiLCJnaXRUZW1wRGlyIiwiR2l0VGVtcERpciIsImVuc3VyZSIsImdldEdwZ1dyYXBwZXJTaCIsIkdpdFByb21wdFNlcnZlciIsInN0YXJ0IiwiQVRPTV9HSVRIVUJfVE1QIiwiZ2V0Um9vdFBhdGgiLCJBVE9NX0dJVEhVQl9BU0tQQVNTX1BBVEgiLCJub3JtYWxpemVHaXRIZWxwZXJQYXRoIiwiZ2V0QXNrUGFzc0pzIiwiQVRPTV9HSVRIVUJfQ1JFREVOVElBTF9QQVRIIiwiZ2V0Q3JlZGVudGlhbEhlbHBlckpzIiwiQVRPTV9HSVRIVUJfRUxFQ1RST05fUEFUSCIsImdldEF0b21IZWxwZXJQYXRoIiwiQVRPTV9HSVRIVUJfU09DS19BRERSIiwiZ2V0QWRkcmVzcyIsIkFUT01fR0lUSFVCX1dPUktESVJfUEFUSCIsIkFUT01fR0lUSFVCX0RVR0lURV9QQVRIIiwiZ2V0RHVnaXRlUGF0aCIsIkFUT01fR0lUSFVCX0tFWVRBUl9TVFJBVEVHWV9QQVRIIiwiZ2V0U2hhcmVkTW9kdWxlUGF0aCIsIkRJU1BMQVkiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9QQVRIIiwiQVRPTV9HSVRIVUJfT1JJR0lOQUxfR0lUX0FTS1BBU1MiLCJHSVRfQVNLUEFTUyIsIkFUT01fR0lUSFVCX09SSUdJTkFMX1NTSF9BU0tQQVNTIiwiU1NIX0FTS1BBU1MiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfU1NIX0NPTU1BTkQiLCJHSVRfU1NIX0NPTU1BTkQiLCJBVE9NX0dJVEhVQl9TUEVDX01PREUiLCJpblNwZWNNb2RlIiwiZ2V0QXNrUGFzc1NoIiwicGxhdGZvcm0iLCJnZXRTc2hXcmFwcGVyU2giLCJHSVRfU1NIIiwiY3JlZGVudGlhbEhlbHBlclNoIiwiZ2V0Q3JlZGVudGlhbEhlbHBlclNoIiwiQVRPTV9HSVRIVUJfR1BHX1BST01QVCIsIkdJVF9UUkFDRSIsIkdJVF9UUkFDRV9DVVJMIiwib3B0cyIsInN0ZGluRW5jb2RpbmciLCJQUklOVF9HSVRfVElNRVMiLCJjb25zb2xlIiwidGltZSIsImJlZm9yZVJ1biIsIm5ld0FyZ3NPcHRzIiwicHJvbWlzZSIsImNhbmNlbCIsImV4ZWN1dGVHaXRDb21tYW5kIiwiZXhwZWN0Q2FuY2VsIiwiYWRkIiwib25EaWRDYW5jZWwiLCJoYW5kbGVyUGlkIiwicmVzb2x2ZUtpbGwiLCJyZWplY3RLaWxsIiwiZXJyIiwic3RkZXJyIiwiZXhpdENvZGUiLCJzaWduYWwiLCJ0aW1pbmciLCJjYXRjaCIsImV4ZWNUaW1lIiwic3Bhd25UaW1lIiwiaXBjVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiZmluYWxpemUiLCJ0aW1lRW5kIiwidGVybWluYXRlIiwiZGlzcG9zZSIsImV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzIiwicmF3IiwicmVwbGFjZSIsInN1bW1hcnkiLCJsb2ciLCJoZWFkZXJTdHlsZSIsImdyb3VwQ29sbGFwc2VkIiwidXRpbCIsImluc3BlY3QiLCJicmVha0xlbmd0aCIsIkluZmluaXR5IiwiZ3JvdXBFbmQiLCJjb2RlIiwic3RkRXJyIiwic3RkT3V0IiwiY29tbWFuZCIsImluY2x1ZGVzIiwiaW5jcmVtZW50Q291bnRlciIsInBhcmFsbGVsIiwiZ3BnRXhlYyIsInNsaWNlIiwidGVzdCIsIm1hcmtlciIsIkFUT01fR0lUSFVCX0lOTElORV9HSVRfRVhFQyIsIldvcmtlck1hbmFnZXIiLCJnZXRJbnN0YW5jZSIsImlzUmVhZHkiLCJjaGlsZFBpZCIsInByb2Nlc3NDYWxsYmFjayIsImNoaWxkIiwicGlkIiwib24iLCJHaXRQcm9jZXNzIiwicmVxdWVzdCIsInJlc29sdmVEb3RHaXREaXIiLCJmcyIsInN0YXQiLCJvdXRwdXQiLCJkb3RHaXREaXIiLCJ0b05hdGl2ZVBhdGhTZXAiLCJpbml0Iiwic3RhZ2VGaWxlcyIsInBhdGhzIiwiY29uY2F0IiwibWFwIiwidG9HaXRQYXRoU2VwIiwiZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZVBhdGgiLCJnZXRDb25maWciLCJob21lRGlyIiwiaG9tZWRpciIsIl8iLCJ1c2VyIiwiZGlybmFtZSIsImlzQWJzb2x1dGUiLCJmaWxlRXhpc3RzIiwicmVhZEZpbGUiLCJlbmNvZGluZyIsInVuc3RhZ2VGaWxlcyIsImNvbW1pdCIsInN0YWdlRmlsZU1vZGVDaGFuZ2UiLCJmaWxlbmFtZSIsIm5ld01vZGUiLCJpbmRleFJlYWRQcm9taXNlIiwiZGV0ZXJtaW5lQXJncyIsImluZGV4Iiwib2lkIiwic3Vic3RyIiwic3RhZ2VGaWxlU3ltbGlua0NoYW5nZSIsImFwcGx5UGF0Y2giLCJwYXRjaCIsInNwbGljZSIsInJhd01lc3NhZ2UiLCJhbGxvd0VtcHR5IiwiYW1lbmQiLCJjb0F1dGhvcnMiLCJ2ZXJiYXRpbSIsIm1zZyIsInVuYm9yblJlZiIsIm1lc3NhZ2VCb2R5IiwibWVzc2FnZVN1YmplY3QiLCJnZXRIZWFkQ29tbWl0IiwidGVtcGxhdGUiLCJjb21tZW50Q2hhciIsInNwbGl0IiwibGluZSIsInN0YXJ0c1dpdGgiLCJjb25maWd1cmVkIiwibW9kZSIsImFkZENvQXV0aG9yc1RvTWVzc2FnZSIsInRyYWlsZXJzIiwiYXV0aG9yIiwidG9rZW4iLCJuYW1lIiwiZW1haWwiLCJtZXJnZVRyYWlsZXJzIiwiZ2V0U3RhdHVzQnVuZGxlIiwicmVzdWx0cyIsInBhcnNlU3RhdHVzIiwiZW50cnlUeXBlIiwiQXJyYXkiLCJpc0FycmF5IiwidXBkYXRlTmF0aXZlUGF0aFNlcEZvckVudHJpZXMiLCJlbnRyaWVzIiwiZW50cnkiLCJmaWxlUGF0aCIsIm9yaWdGaWxlUGF0aCIsImRpZmZGaWxlU3RhdHVzIiwic3RhZ2VkIiwidGFyZ2V0Iiwic3RhdHVzTWFwIiwiQSIsIk0iLCJEIiwiVSIsImZpbGVTdGF0dXNlcyIsIkxJTkVfRU5ESU5HX1JFR0VYIiwic3RhdHVzIiwicmF3RmlsZVBhdGgiLCJ1bnRyYWNrZWQiLCJnZXRVbnRyYWNrZWRGaWxlcyIsImdldERpZmZzRm9yRmlsZVBhdGgiLCJiYXNlQ29tbWl0IiwicmF3RGlmZnMiLCJwYXJzZURpZmYiLCJyYXdEaWZmIiwiaSIsIm9sZFBhdGgiLCJuZXdQYXRoIiwiYWJzUGF0aCIsImV4ZWN1dGFibGUiLCJpc0ZpbGVFeGVjdXRhYmxlIiwic3ltbGluayIsImlzRmlsZVN5bWxpbmsiLCJjb250ZW50cyIsImJpbmFyeSIsImlzQmluYXJ5IiwicmVhbHBhdGgiLCJGaWxlIiwibW9kZXMiLCJFWEVDVVRBQkxFIiwiU1lNTElOSyIsIk5PUk1BTCIsImJ1aWxkQWRkZWRGaWxlUGF0Y2giLCJnZXRTdGFnZWRDaGFuZ2VzUGF0Y2giLCJkaWZmcyIsImRpZmYiLCJnZXRDb21taXQiLCJyZWYiLCJnZXRDb21taXRzIiwiaW5jbHVkZVVuYm9ybiIsImhlYWRDb21taXQiLCJpbmNsdWRlUGF0Y2giLCJzaGEiLCJmaWVsZHMiLCJjb21taXRzIiwiYm9keSIsImV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlIiwiQXV0aG9yIiwiYXV0aG9yRGF0ZSIsInBhcnNlSW50IiwiZ2V0QXV0aG9ycyIsImRlbGltaXRlclN0cmluZyIsImZyb21DaGFyQ29kZSIsImZvcm1hdCIsImFuIiwiYWUiLCJjbiIsImNlIiwidHJhaWxlciIsIm1hdGNoIiwiQ09fQVVUSE9SX1JFR0VYIiwiY29tbWl0TWVzc2FnZSIsInJlYWRGaWxlRnJvbUluZGV4IiwibWVyZ2UiLCJicmFuY2hOYW1lIiwiaXNNZXJnaW5nIiwiYWJvcnRNZXJnZSIsImNoZWNrb3V0U2lkZSIsInNpZGUiLCJpc1JlYmFzaW5nIiwiYWxsIiwic29tZSIsImNsb25lIiwicmVtb3RlVXJsIiwibm9Mb2NhbCIsImJhcmUiLCJyZWN1cnNpdmUiLCJzb3VyY2VSZW1vdGVOYW1lIiwicmVtb3RlTmFtZSIsImZldGNoIiwicHVsbCIsInJlZlNwZWMiLCJmZk9ubHkiLCJzZXRVcHN0cmVhbSIsImZvcmNlIiwicmVzZXQiLCJyZXZpc2lvbiIsInZhbGlkVHlwZXMiLCJkZWxldGVSZWYiLCJjaGVja291dCIsImNyZWF0ZU5ldyIsInN0YXJ0UG9pbnQiLCJ0cmFjayIsImdldEJyYW5jaGVzIiwiaGVhZCIsInVwc3RyZWFtVHJhY2tpbmdSZWYiLCJ1cHN0cmVhbVJlbW90ZU5hbWUiLCJ1cHN0cmVhbVJlbW90ZVJlZiIsInB1c2hUcmFja2luZ1JlZiIsInB1c2hSZW1vdGVOYW1lIiwicHVzaFJlbW90ZVJlZiIsImJyYW5jaCIsInVwc3RyZWFtIiwidHJhY2tpbmdSZWYiLCJyZW1vdGVSZWYiLCJnZXRCcmFuY2hlc1dpdGhDb21taXQiLCJvcHRpb24iLCJzaG93TG9jYWwiLCJzaG93UmVtb3RlIiwicGF0dGVybiIsImNoZWNrb3V0RmlsZXMiLCJkZXNjcmliZUhlYWQiLCJsb2NhbCIsInNldENvbmZpZyIsInJlcGxhY2VBbGwiLCJnbG9iYWwiLCJ1bnNldENvbmZpZyIsImdldFJlbW90ZXMiLCJ1cmwiLCJhZGRSZW1vdGUiLCJjcmVhdGVCbG9iIiwiZXhwYW5kQmxvYlRvRmlsZSIsImFic0ZpbGVQYXRoIiwid3JpdGVGaWxlIiwiZ2V0QmxvYkNvbnRlbnRzIiwibWVyZ2VGaWxlIiwib3Vyc1BhdGgiLCJjb21tb25CYXNlUGF0aCIsInRoZWlyc1BhdGgiLCJyZXN1bHRQYXRoIiwiY29uZmxpY3QiLCJyZXNvbHZlZFJlc3VsdFBhdGgiLCJ3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4IiwiY29tbW9uQmFzZVNoYSIsIm91cnNTaGEiLCJ0aGVpcnNTaGEiLCJnaXRGaWxlUGF0aCIsImZpbGVNb2RlIiwiZ2V0RmlsZU1vZGUiLCJpbmRleEluZm8iLCJkZXN0cm95IiwiaHVua3MiLCJub05ld0xpbmUiLCJsaW5lcyIsIm9sZFN0YXJ0TGluZSIsIm9sZExpbmVDb3VudCIsIm5ld1N0YXJ0TGluZSIsImhlYWRpbmciLCJuZXdMaW5lQ291bnQiLCJvbGRNb2RlIl0sInNvdXJjZXMiOlsiZ2l0LXNoZWxsLW91dC1zdHJhdGVneS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHtHaXRQcm9jZXNzfSBmcm9tICdkdWdpdGUnO1xuaW1wb3J0IHtwYXJzZSBhcyBwYXJzZURpZmZ9IGZyb20gJ3doYXQtdGhlLWRpZmYnO1xuaW1wb3J0IHtwYXJzZSBhcyBwYXJzZVN0YXR1c30gZnJvbSAnd2hhdC10aGUtc3RhdHVzJztcblxuaW1wb3J0IEdpdFByb21wdFNlcnZlciBmcm9tICcuL2dpdC1wcm9tcHQtc2VydmVyJztcbmltcG9ydCBHaXRUZW1wRGlyIGZyb20gJy4vZ2l0LXRlbXAtZGlyJztcbmltcG9ydCBBc3luY1F1ZXVlIGZyb20gJy4vYXN5bmMtcXVldWUnO1xuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyfSBmcm9tICcuL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7XG4gIGdldER1Z2l0ZVBhdGgsIGdldFNoYXJlZE1vZHVsZVBhdGgsIGdldEF0b21IZWxwZXJQYXRoLFxuICBleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSwgZmlsZUV4aXN0cywgaXNGaWxlRXhlY3V0YWJsZSwgaXNGaWxlU3ltbGluaywgaXNCaW5hcnksXG4gIG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgsIHRvTmF0aXZlUGF0aFNlcCwgdG9HaXRQYXRoU2VwLCBMSU5FX0VORElOR19SRUdFWCwgQ09fQVVUSE9SX1JFR0VYLFxufSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IEdpdFRpbWluZ3NWaWV3IGZyb20gJy4vdmlld3MvZ2l0LXRpbWluZ3Mtdmlldyc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL21vZGVscy9wYXRjaC9maWxlJztcbmltcG9ydCBXb3JrZXJNYW5hZ2VyIGZyb20gJy4vd29ya2VyLW1hbmFnZXInO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuL21vZGVscy9hdXRob3InO1xuXG5jb25zdCBNQVhfU1RBVFVTX09VVFBVVF9MRU5HVEggPSAxMDI0ICogMTAyNCAqIDEwO1xuXG5sZXQgaGVhZGxlc3MgPSBudWxsO1xubGV0IGV4ZWNQYXRoUHJvbWlzZSA9IG51bGw7XG5cbmV4cG9ydCBjbGFzcyBHaXRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXJnZVJlcG9FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICB9XG59XG5cbi8vIGlnbm9yZWQgZm9yIHRoZSBwdXJwb3NlcyBvZiB1c2FnZSBtZXRyaWNzIHRyYWNraW5nIGJlY2F1c2UgdGhleSdyZSBub2lzeVxuY29uc3QgSUdOT1JFRF9HSVRfQ09NTUFORFMgPSBbJ2NhdC1maWxlJywgJ2NvbmZpZycsICdkaWZmJywgJ2Zvci1lYWNoLXJlZicsICdsb2cnLCAncmV2LXBhcnNlJywgJ3N0YXR1cyddO1xuXG5jb25zdCBESVNBQkxFX0NPTE9SX0ZMQUdTID0gW1xuICAnYnJhbmNoJywgJ2RpZmYnLCAnc2hvd0JyYW5jaCcsICdzdGF0dXMnLCAndWknLFxuXS5yZWR1Y2UoKGFjYywgdHlwZSkgPT4ge1xuICBhY2MudW5zaGlmdCgnLWMnLCBgY29sb3IuJHt0eXBlfT1mYWxzZWApO1xuICByZXR1cm4gYWNjO1xufSwgW10pO1xuXG4vKipcbiAqIEV4cGFuZCBjb25maWcgcGF0aCBuYW1lIHBlclxuICogaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1jb25maWcjZ2l0LWNvbmZpZy1wYXRobmFtZVxuICogdGhpcyByZWdleCBhdHRlbXB0cyB0byBnZXQgdGhlIHNwZWNpZmllZCB1c2VyJ3MgaG9tZSBkaXJlY3RvcnlcbiAqIEV4OiBvbiBNYWMgfmt1eWNoYWNvLyBpcyBleHBhbmRlZCB0byB0aGUgc3BlY2lmaWVkIHVzZXLigJlzIGhvbWUgZGlyZWN0b3J5ICgvVXNlcnMva3V5Y2hhY28pXG4gKiBSZWdleCB0cmFuc2xhdGlvbjpcbiAqIF5+IGxpbmUgc3RhcnRzIHdpdGggdGlsZGVcbiAqIChbXlxcXFxcXFxcL10qKVtcXFxcXFxcXC9dIGNhcHR1cmVzIG5vbi1zbGFzaCBjaGFyYWN0ZXJzIGJlZm9yZSBmaXJzdCBzbGFzaFxuICovXG5jb25zdCBFWFBBTkRfVElMREVfUkVHRVggPSBuZXcgUmVnRXhwKCdefihbXlxcXFxcXFxcL10qKVtcXFxcXFxcXC9dJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFNoZWxsT3V0U3RyYXRlZ3kge1xuICBzdGF0aWMgZGVmYXVsdEV4ZWNBcmdzID0ge1xuICAgIHN0ZGluOiBudWxsLFxuICAgIHVzZUdpdFByb21wdFNlcnZlcjogZmFsc2UsXG4gICAgdXNlR3BnV3JhcHBlcjogZmFsc2UsXG4gICAgdXNlR3BnQXRvbVByb21wdDogZmFsc2UsXG4gICAgd3JpdGVPcGVyYXRpb246IGZhbHNlLFxuICB9XG5cbiAgY29uc3RydWN0b3Iod29ya2luZ0Rpciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy53b3JraW5nRGlyID0gd29ya2luZ0RpcjtcbiAgICBpZiAob3B0aW9ucy5xdWV1ZSkge1xuICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBvcHRpb25zLnF1ZXVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYXJhbGxlbGlzbSA9IG9wdGlvbnMucGFyYWxsZWxpc20gfHwgTWF0aC5tYXgoMywgb3MuY3B1cygpLmxlbmd0aCk7XG4gICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IG5ldyBBc3luY1F1ZXVlKHtwYXJhbGxlbGlzbX0pO1xuICAgIH1cblxuICAgIHRoaXMucHJvbXB0ID0gb3B0aW9ucy5wcm9tcHQgfHwgKHF1ZXJ5ID0+IFByb21pc2UucmVqZWN0KCkpO1xuICAgIHRoaXMud29ya2VyTWFuYWdlciA9IG9wdGlvbnMud29ya2VyTWFuYWdlcjtcblxuICAgIGlmIChoZWFkbGVzcyA9PT0gbnVsbCkge1xuICAgICAgaGVhZGxlc3MgPSAhcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKS5pc1Zpc2libGUoKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBQcm92aWRlIGFuIGFzeW5jaHJvbm91cyBjYWxsYmFjayB0byBiZSB1c2VkIHRvIHJlcXVlc3QgaW5wdXQgZnJvbSB0aGUgdXNlciBmb3IgZ2l0IG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIGBwcm9tcHRgIG11c3QgYmUgYSBjYWxsYWJsZSB0aGF0IGFjY2VwdHMgYSBxdWVyeSBvYmplY3QgYHtwcm9tcHQsIGluY2x1ZGVVc2VybmFtZX1gIGFuZCByZXR1cm5zIGEgUHJvbWlzZVxuICAgKiB0aGF0IGVpdGhlciByZXNvbHZlcyB3aXRoIGEgcmVzdWx0IG9iamVjdCBge1t1c2VybmFtZV0sIHBhc3N3b3JkfWAgb3IgcmVqZWN0cyBvbiBjYW5jZWxsYXRpb24uXG4gICAqL1xuICBzZXRQcm9tcHRDYWxsYmFjayhwcm9tcHQpIHtcbiAgICB0aGlzLnByb21wdCA9IHByb21wdDtcbiAgfVxuXG4gIC8vIEV4ZWN1dGUgYSBjb21tYW5kIGFuZCByZWFkIHRoZSBvdXRwdXQgdXNpbmcgdGhlIGVtYmVkZGVkIEdpdCBlbnZpcm9ubWVudFxuICBhc3luYyBleGVjKGFyZ3MsIG9wdGlvbnMgPSBHaXRTaGVsbE91dFN0cmF0ZWd5LmRlZmF1bHRFeGVjQXJncykge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUsbm8tY29udHJvbC1yZWdleCAqL1xuICAgIGNvbnN0IHtzdGRpbiwgdXNlR2l0UHJvbXB0U2VydmVyLCB1c2VHcGdXcmFwcGVyLCB1c2VHcGdBdG9tUHJvbXB0LCB3cml0ZU9wZXJhdGlvbn0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGNvbW1hbmROYW1lID0gYXJnc1swXTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBjb25zdCBkaWFnbm9zdGljc0VuYWJsZWQgPSBwcm9jZXNzLmVudi5BVE9NX0dJVEhVQl9HSVRfRElBR05PU1RJQ1MgfHwgYXRvbS5jb25maWcuZ2V0KCdnaXRodWIuZ2l0RGlhZ25vc3RpY3MnKTtcblxuICAgIGNvbnN0IGZvcm1hdHRlZEFyZ3MgPSBgZ2l0ICR7YXJncy5qb2luKCcgJyl9IGluICR7dGhpcy53b3JraW5nRGlyfWA7XG4gICAgY29uc3QgdGltaW5nTWFya2VyID0gR2l0VGltaW5nc1ZpZXcuZ2VuZXJhdGVNYXJrZXIoYGdpdCAke2FyZ3Muam9pbignICcpfWApO1xuICAgIHRpbWluZ01hcmtlci5tYXJrKCdxdWV1ZWQnKTtcblxuICAgIGFyZ3MudW5zaGlmdCguLi5ESVNBQkxFX0NPTE9SX0ZMQUdTKTtcblxuICAgIGlmIChleGVjUGF0aFByb21pc2UgPT09IG51bGwpIHtcbiAgICAgIC8vIEF0dGVtcHQgdG8gY29sbGVjdCB0aGUgLS1leGVjLXBhdGggZnJvbSBhIG5hdGl2ZSBnaXQgaW5zdGFsbGF0aW9uLlxuICAgICAgZXhlY1BhdGhQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGNoaWxkUHJvY2Vzcy5leGVjKCdnaXQgLS1leGVjLXBhdGgnLCAoZXJyb3IsIHN0ZG91dCkgPT4ge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgLy8gT2ggd2VsbFxuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKHN0ZG91dC50cmltKCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBleGVjUGF0aCA9IGF3YWl0IGV4ZWNQYXRoUHJvbWlzZTtcblxuICAgIHJldHVybiB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKGFzeW5jICgpID0+IHtcbiAgICAgIHRpbWluZ01hcmtlci5tYXJrKCdwcmVwYXJlJyk7XG4gICAgICBsZXQgZ2l0UHJvbXB0U2VydmVyO1xuXG4gICAgICBjb25zdCBwYXRoUGFydHMgPSBbXTtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5QQVRIKSB7XG4gICAgICAgIHBhdGhQYXJ0cy5wdXNoKHByb2Nlc3MuZW52LlBBVEgpO1xuICAgICAgfVxuICAgICAgaWYgKGV4ZWNQYXRoKSB7XG4gICAgICAgIHBhdGhQYXJ0cy5wdXNoKGV4ZWNQYXRoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZW52ID0ge1xuICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgICAgR0lUX1RFUk1JTkFMX1BST01QVDogJzAnLFxuICAgICAgICBHSVRfT1BUSU9OQUxfTE9DS1M6ICcwJyxcbiAgICAgICAgUEFUSDogcGF0aFBhcnRzLmpvaW4ocGF0aC5kZWxpbWl0ZXIpLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2l0VGVtcERpciA9IG5ldyBHaXRUZW1wRGlyKCk7XG5cbiAgICAgIGlmICh1c2VHcGdXcmFwcGVyKSB7XG4gICAgICAgIGF3YWl0IGdpdFRlbXBEaXIuZW5zdXJlKCk7XG4gICAgICAgIGFyZ3MudW5zaGlmdCgnLWMnLCBgZ3BnLnByb2dyYW09JHtnaXRUZW1wRGlyLmdldEdwZ1dyYXBwZXJTaCgpfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodXNlR2l0UHJvbXB0U2VydmVyKSB7XG4gICAgICAgIGdpdFByb21wdFNlcnZlciA9IG5ldyBHaXRQcm9tcHRTZXJ2ZXIoZ2l0VGVtcERpcik7XG4gICAgICAgIGF3YWl0IGdpdFByb21wdFNlcnZlci5zdGFydCh0aGlzLnByb21wdCk7XG5cbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1RNUCA9IGdpdFRlbXBEaXIuZ2V0Um9vdFBhdGgoKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0FTS1BBU1NfUEFUSCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRBc2tQYXNzSnMoKSk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9DUkVERU5USUFMX1BBVEggPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0Q3JlZGVudGlhbEhlbHBlckpzKCkpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfRUxFQ1RST05fUEFUSCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2V0QXRvbUhlbHBlclBhdGgoKSk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9TT0NLX0FERFIgPSBnaXRQcm9tcHRTZXJ2ZXIuZ2V0QWRkcmVzcygpO1xuXG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9XT1JLRElSX1BBVEggPSB0aGlzLndvcmtpbmdEaXI7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9EVUdJVEVfUEFUSCA9IGdldER1Z2l0ZVBhdGgoKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0tFWVRBUl9TVFJBVEVHWV9QQVRIID0gZ2V0U2hhcmVkTW9kdWxlUGF0aCgna2V5dGFyLXN0cmF0ZWd5Jyk7XG5cbiAgICAgICAgLy8gXCJzc2hcIiB3b24ndCByZXNwZWN0IFNTSF9BU0tQQVNTIHVubGVzczpcbiAgICAgICAgLy8gKGEpIGl0J3MgcnVubmluZyB3aXRob3V0IGEgdHR5XG4gICAgICAgIC8vIChiKSBESVNQTEFZIGlzIHNldCB0byBzb21ldGhpbmcgbm9uZW1wdHlcbiAgICAgICAgLy8gQnV0LCBvbiBhIE1hYywgRElTUExBWSBpcyB1bnNldC4gRW5zdXJlIHRoYXQgaXQgaXMgc28gb3VyIFNTSF9BU0tQQVNTIGlzIHJlc3BlY3RlZC5cbiAgICAgICAgaWYgKCFwcm9jZXNzLmVudi5ESVNQTEFZIHx8IHByb2Nlc3MuZW52LkRJU1BMQVkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZW52LkRJU1BMQVkgPSAnYXRvbS1naXRodWItcGxhY2Vob2xkZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX1BBVEggPSBwcm9jZXNzLmVudi5QQVRIIHx8ICcnO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfR0lUX0FTS1BBU1MgPSBwcm9jZXNzLmVudi5HSVRfQVNLUEFTUyB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX1NTSF9BU0tQQVNTID0gcHJvY2Vzcy5lbnYuU1NIX0FTS1BBU1MgfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfU1NIX0NPTU1BTkQgPSBwcm9jZXNzLmVudi5HSVRfU1NIX0NPTU1BTkQgfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9TUEVDX01PREUgPSBhdG9tLmluU3BlY01vZGUoKSA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICAgICAgZW52LlNTSF9BU0tQQVNTID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldEFza1Bhc3NTaCgpKTtcbiAgICAgICAgZW52LkdJVF9BU0tQQVNTID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldEFza1Bhc3NTaCgpKTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICAgICAgICAgIGVudi5HSVRfU1NIX0NPTU1BTkQgPSBnaXRUZW1wRGlyLmdldFNzaFdyYXBwZXJTaCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52LkdJVF9TU0hfQ09NTUFORCkge1xuICAgICAgICAgIGVudi5HSVRfU1NIX0NPTU1BTkQgPSBwcm9jZXNzLmVudi5HSVRfU1NIX0NPTU1BTkQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW52LkdJVF9TU0ggPSBwcm9jZXNzLmVudi5HSVRfU1NIO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3JlZGVudGlhbEhlbHBlclNoID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldENyZWRlbnRpYWxIZWxwZXJTaCgpKTtcbiAgICAgICAgYXJncy51bnNoaWZ0KCctYycsIGBjcmVkZW50aWFsLmhlbHBlcj0ke2NyZWRlbnRpYWxIZWxwZXJTaH1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVzZUdwZ1dyYXBwZXIgJiYgdXNlR2l0UHJvbXB0U2VydmVyICYmIHVzZUdwZ0F0b21Qcm9tcHQpIHtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0dQR19QUk9NUFQgPSAndHJ1ZSc7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGRpYWdub3N0aWNzRW5hYmxlZCkge1xuICAgICAgICBlbnYuR0lUX1RSQUNFID0gJ3RydWUnO1xuICAgICAgICBlbnYuR0lUX1RSQUNFX0NVUkwgPSAndHJ1ZSc7XG4gICAgICB9XG5cbiAgICAgIGxldCBvcHRzID0ge2Vudn07XG5cbiAgICAgIGlmIChzdGRpbikge1xuICAgICAgICBvcHRzLnN0ZGluID0gc3RkaW47XG4gICAgICAgIG9wdHMuc3RkaW5FbmNvZGluZyA9ICd1dGY4JztcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuUFJJTlRfR0lUX1RJTUVTKSB7XG4gICAgICAgIGNvbnNvbGUudGltZShgZ2l0OiR7Zm9ybWF0dGVkQXJnc31gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlUnVuKSB7XG4gICAgICAgICAgY29uc3QgbmV3QXJnc09wdHMgPSBhd2FpdCBvcHRpb25zLmJlZm9yZVJ1bih7YXJncywgb3B0c30pO1xuICAgICAgICAgIGFyZ3MgPSBuZXdBcmdzT3B0cy5hcmdzO1xuICAgICAgICAgIG9wdHMgPSBuZXdBcmdzT3B0cy5vcHRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCBjYW5jZWx9ID0gdGhpcy5leGVjdXRlR2l0Q29tbWFuZChhcmdzLCBvcHRzLCB0aW1pbmdNYXJrZXIpO1xuICAgICAgICBsZXQgZXhwZWN0Q2FuY2VsID0gZmFsc2U7XG4gICAgICAgIGlmIChnaXRQcm9tcHRTZXJ2ZXIpIHtcbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChnaXRQcm9tcHRTZXJ2ZXIub25EaWRDYW5jZWwoYXN5bmMgKHtoYW5kbGVyUGlkfSkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0Q2FuY2VsID0gdHJ1ZTtcbiAgICAgICAgICAgIGF3YWl0IGNhbmNlbCgpO1xuXG4gICAgICAgICAgICAvLyBPbiBXaW5kb3dzLCB0aGUgU1NIX0FTS1BBU1MgaGFuZGxlciBpcyBleGVjdXRlZCBhcyBhIG5vbi1jaGlsZCBwcm9jZXNzLCBzbyB0aGUgYmluXFxnaXQtYXNrcGFzcy1hdG9tLnNoXG4gICAgICAgICAgICAvLyBwcm9jZXNzIGRvZXMgbm90IHRlcm1pbmF0ZSB3aGVuIHRoZSBnaXQgcHJvY2VzcyBpcyBraWxsZWQuXG4gICAgICAgICAgICAvLyBLaWxsIHRoZSBoYW5kbGVyIHByb2Nlc3MgKmFmdGVyKiB0aGUgZ2l0IHByb2Nlc3MgaGFzIGJlZW4ga2lsbGVkIHRvIGVuc3VyZSB0aGF0IGdpdCBkb2Vzbid0IGhhdmUgYVxuICAgICAgICAgICAgLy8gY2hhbmNlIHRvIGZhbGwgYmFjayB0byBHSVRfQVNLUEFTUyBmcm9tIHRoZSBjcmVkZW50aWFsIGhhbmRsZXIuXG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZUtpbGwsIHJlamVjdEtpbGwpID0+IHtcbiAgICAgICAgICAgICAgcmVxdWlyZSgndHJlZS1raWxsJykoaGFuZGxlclBpZCwgJ1NJR1RFUk0nLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHsgcmVqZWN0S2lsbChlcnIpOyB9IGVsc2UgeyByZXNvbHZlS2lsbCgpOyB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge3N0ZG91dCwgc3RkZXJyLCBleGl0Q29kZSwgc2lnbmFsLCB0aW1pbmd9ID0gYXdhaXQgcHJvbWlzZS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGlmIChlcnIuc2lnbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4ge3NpZ25hbDogZXJyLnNpZ25hbH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWluZykge1xuICAgICAgICAgIGNvbnN0IHtleGVjVGltZSwgc3Bhd25UaW1lLCBpcGNUaW1lfSA9IHRpbWluZztcbiAgICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICB0aW1pbmdNYXJrZXIubWFyaygnbmV4dHRpY2snLCBub3cgLSBleGVjVGltZSAtIHNwYXduVGltZSAtIGlwY1RpbWUpO1xuICAgICAgICAgIHRpbWluZ01hcmtlci5tYXJrKCdleGVjdXRlJywgbm93IC0gZXhlY1RpbWUgLSBpcGNUaW1lKTtcbiAgICAgICAgICB0aW1pbmdNYXJrZXIubWFyaygnaXBjJywgbm93IC0gaXBjVGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGltaW5nTWFya2VyLmZpbmFsaXplKCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5QUklOVF9HSVRfVElNRVMpIHtcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoYGdpdDoke2Zvcm1hdHRlZEFyZ3N9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ2l0UHJvbXB0U2VydmVyKSB7XG4gICAgICAgICAgZ2l0UHJvbXB0U2VydmVyLnRlcm1pbmF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoZGlhZ25vc3RpY3NFbmFibGVkKSB7XG4gICAgICAgICAgY29uc3QgZXhwb3NlQ29udHJvbENoYXJhY3RlcnMgPSByYXcgPT4ge1xuICAgICAgICAgICAgaWYgKCFyYXcpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAgICAgICAgIHJldHVybiByYXdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTAwMDAvdWcsICc8TlVMPlxcbicpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHUwMDFGL3VnLCAnPFNFUD4nKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGhlYWRsZXNzKSB7XG4gICAgICAgICAgICBsZXQgc3VtbWFyeSA9IGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfVxcbmA7XG4gICAgICAgICAgICBpZiAoZXhpdENvZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBleGl0IHN0YXR1czogJHtleGl0Q29kZX1cXG5gO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaWduYWwpIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgZXhpdCBzaWduYWw6ICR7c2lnbmFsfVxcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RkaW4gJiYgc3RkaW4ubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYHN0ZGluOlxcbiR7ZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkaW4pfVxcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5ICs9ICdzdGRvdXQ6JztcbiAgICAgICAgICAgIGlmIChzdGRvdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gJyA8ZW1wdHk+XFxuJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYFxcbiR7ZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3Rkb3V0KX1cXG5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VtbWFyeSArPSAnc3RkZXJyOic7XG4gICAgICAgICAgICBpZiAoc3RkZXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9ICcgPGVtcHR5Plxcbic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBcXG4ke2V4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGVycil9XFxuYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coc3VtbWFyeSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlclN0eWxlID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogYmx1ZTsnO1xuXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfWApO1xuICAgICAgICAgICAgaWYgKGV4aXRDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVjZXhpdCBzdGF0dXMlYyAlZCcsIGhlYWRlclN0eWxlLCAnZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6IGJsYWNrOycsIGV4aXRDb2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY2V4aXQgc2lnbmFsJWMgJXMnLCBoZWFkZXJTdHlsZSwgJ2ZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiBibGFjazsnLCBzaWduYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICclY2Z1bGwgYXJndW1lbnRzJWMgJXMnLFxuICAgICAgICAgICAgICBoZWFkZXJTdHlsZSwgJ2ZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiBibGFjazsnLFxuICAgICAgICAgICAgICB1dGlsLmluc3BlY3QoYXJncywge2JyZWFrTGVuZ3RoOiBJbmZpbml0eX0pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChzdGRpbiAmJiBzdGRpbi5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVjc3RkaW4nLCBoZWFkZXJTdHlsZSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGluKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWNzdGRvdXQnLCBoZWFkZXJTdHlsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRvdXQpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY3N0ZGVycicsIGhlYWRlclN0eWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGVycikpO1xuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleGl0Q29kZSAhPT0gMCAmJiAhZXhwZWN0Q2FuY2VsKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IEdpdEVycm9yKFxuICAgICAgICAgICAgYCR7Zm9ybWF0dGVkQXJnc30gZXhpdGVkIHdpdGggY29kZSAke2V4aXRDb2RlfVxcbnN0ZG91dDogJHtzdGRvdXR9XFxuc3RkZXJyOiAke3N0ZGVycn1gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLmNvZGUgPSBleGl0Q29kZTtcbiAgICAgICAgICBlcnIuc3RkRXJyID0gc3RkZXJyO1xuICAgICAgICAgIGVyci5zdGRPdXQgPSBzdGRvdXQ7XG4gICAgICAgICAgZXJyLmNvbW1hbmQgPSBmb3JtYXR0ZWRBcmdzO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFJR05PUkVEX0dJVF9DT01NQU5EUy5pbmNsdWRlcyhjb21tYW5kTmFtZSkpIHtcbiAgICAgICAgICBpbmNyZW1lbnRDb3VudGVyKGNvbW1hbmROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHN0ZG91dCk7XG4gICAgICB9KTtcbiAgICB9LCB7cGFyYWxsZWw6ICF3cml0ZU9wZXJhdGlvbn0pO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSxuby1jb250cm9sLXJlZ2V4ICovXG4gIH1cblxuICBhc3luYyBncGdFeGVjKGFyZ3MsIG9wdGlvbnMpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlYyhhcmdzLnNsaWNlKCksIHtcbiAgICAgICAgdXNlR3BnV3JhcHBlcjogdHJ1ZSxcbiAgICAgICAgdXNlR3BnQXRvbVByb21wdDogZmFsc2UsXG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoL2dwZyBmYWlsZWQvLnRlc3QoZS5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWMoYXJncywge1xuICAgICAgICAgIHVzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSxcbiAgICAgICAgICB1c2VHcGdXcmFwcGVyOiB0cnVlLFxuICAgICAgICAgIHVzZUdwZ0F0b21Qcm9tcHQ6IHRydWUsXG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVHaXRDb21tYW5kKGFyZ3MsIG9wdGlvbnMsIG1hcmtlciA9IG51bGwpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuQVRPTV9HSVRIVUJfSU5MSU5FX0dJVF9FWEVDIHx8ICFXb3JrZXJNYW5hZ2VyLmdldEluc3RhbmNlKCkuaXNSZWFkeSgpKSB7XG4gICAgICBtYXJrZXIgJiYgbWFya2VyLm1hcmsoJ25leHR0aWNrJyk7XG5cbiAgICAgIGxldCBjaGlsZFBpZDtcbiAgICAgIG9wdGlvbnMucHJvY2Vzc0NhbGxiYWNrID0gY2hpbGQgPT4ge1xuICAgICAgICBjaGlsZFBpZCA9IGNoaWxkLnBpZDtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBjaGlsZC5zdGRpbi5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBFcnJvciB3cml0aW5nIHRvIHN0ZGluOiBnaXQgJHthcmdzLmpvaW4oJyAnKX0gaW4gJHt0aGlzLndvcmtpbmdEaXJ9XFxuJHtvcHRpb25zLnN0ZGlufVxcbiR7ZXJyfWApO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHByb21pc2UgPSBHaXRQcm9jZXNzLmV4ZWMoYXJncywgdGhpcy53b3JraW5nRGlyLCBvcHRpb25zKTtcbiAgICAgIG1hcmtlciAmJiBtYXJrZXIubWFyaygnZXhlY3V0ZScpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgY2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKCFjaGlsZFBpZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXF1aXJlKCd0cmVlLWtpbGwnKShjaGlsZFBpZCwgJ1NJR1RFUk0nLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgaWYgKGVycikgeyByZWplY3QoZXJyKTsgfSBlbHNlIHsgcmVzb2x2ZSgpOyB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHdvcmtlck1hbmFnZXIgPSB0aGlzLndvcmtlck1hbmFnZXIgfHwgV29ya2VyTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgICAgcmV0dXJuIHdvcmtlck1hbmFnZXIucmVxdWVzdCh7XG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHdvcmtpbmdEaXI6IHRoaXMud29ya2luZ0RpcixcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlc29sdmVEb3RHaXREaXIoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZzLnN0YXQodGhpcy53b3JraW5nRGlyKTsgLy8gZmFpbHMgaWYgZm9sZGVyIGRvZXNuJ3QgZXhpc3RcbiAgICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ3Jldi1wYXJzZScsICctLXJlc29sdmUtZ2l0LWRpcicsIHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsICcuZ2l0JyldKTtcbiAgICAgIGNvbnN0IGRvdEdpdERpciA9IG91dHB1dC50cmltKCk7XG4gICAgICByZXR1cm4gdG9OYXRpdmVQYXRoU2VwKGRvdEdpdERpcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnaW5pdCcsIHRoaXMud29ya2luZ0Rpcl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YWdpbmcvVW5zdGFnaW5nIGZpbGVzIGFuZCBwYXRjaGVzIGFuZCBjb21taXR0aW5nXG4gICAqL1xuICBzdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpOyB9XG4gICAgY29uc3QgYXJncyA9IFsnYWRkJ10uY29uY2F0KHBhdGhzLm1hcCh0b0dpdFBhdGhTZXApKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKSB7XG4gICAgbGV0IHRlbXBsYXRlUGF0aCA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdjb21taXQudGVtcGxhdGUnKTtcbiAgICBpZiAoIXRlbXBsYXRlUGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaG9tZURpciA9IG9zLmhvbWVkaXIoKTtcblxuICAgIHRlbXBsYXRlUGF0aCA9IHRlbXBsYXRlUGF0aC50cmltKCkucmVwbGFjZShFWFBBTkRfVElMREVfUkVHRVgsIChfLCB1c2VyKSA9PiB7XG4gICAgICAvLyBpZiBubyB1c2VyIGlzIHNwZWNpZmllZCwgZmFsbCBiYWNrIHRvIHVzaW5nIHRoZSBob21lIGRpcmVjdG9yeS5cbiAgICAgIHJldHVybiBgJHt1c2VyID8gcGF0aC5qb2luKHBhdGguZGlybmFtZShob21lRGlyKSwgdXNlcikgOiBob21lRGlyfS9gO1xuICAgIH0pO1xuICAgIHRlbXBsYXRlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcCh0ZW1wbGF0ZVBhdGgpO1xuXG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUodGVtcGxhdGVQYXRoKSkge1xuICAgICAgdGVtcGxhdGVQYXRoID0gcGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgdGVtcGxhdGVQYXRoKTtcbiAgICB9XG5cbiAgICBpZiAoIWF3YWl0IGZpbGVFeGlzdHModGVtcGxhdGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbW1pdCB0ZW1wbGF0ZSBwYXRoIHNldCBpbiBHaXQgY29uZmlnOiAke3RlbXBsYXRlUGF0aH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGZzLnJlYWRGaWxlKHRlbXBsYXRlUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhwYXRocywgY29tbWl0ID0gJ0hFQUQnKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpOyB9XG4gICAgY29uc3QgYXJncyA9IFsncmVzZXQnLCBjb21taXQsICctLSddLmNvbmNhdChwYXRocy5tYXAodG9HaXRQYXRoU2VwKSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIHN0YWdlRmlsZU1vZGVDaGFuZ2UoZmlsZW5hbWUsIG5ld01vZGUpIHtcbiAgICBjb25zdCBpbmRleFJlYWRQcm9taXNlID0gdGhpcy5leGVjKFsnbHMtZmlsZXMnLCAnLXMnLCAnLS0nLCBmaWxlbmFtZV0pO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWyd1cGRhdGUtaW5kZXgnLCAnLS1jYWNoZWluZm8nLCBgJHtuZXdNb2RlfSw8T0lEX1RCRD4sJHtmaWxlbmFtZX1gXSwge1xuICAgICAgd3JpdGVPcGVyYXRpb246IHRydWUsXG4gICAgICBiZWZvcmVSdW46IGFzeW5jIGZ1bmN0aW9uIGRldGVybWluZUFyZ3Moe2FyZ3MsIG9wdHN9KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gYXdhaXQgaW5kZXhSZWFkUHJvbWlzZTtcbiAgICAgICAgY29uc3Qgb2lkID0gaW5kZXguc3Vic3RyKDcsIDQwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcHRzLFxuICAgICAgICAgIGFyZ3M6IFsndXBkYXRlLWluZGV4JywgJy0tY2FjaGVpbmZvJywgYCR7bmV3TW9kZX0sJHtvaWR9LCR7ZmlsZW5hbWV9YF0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShmaWxlbmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydybScsICctLWNhY2hlZCcsIGZpbGVuYW1lXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhcHBseVBhdGNoKHBhdGNoLCB7aW5kZXh9ID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydhcHBseScsICctJ107XG4gICAgaWYgKGluZGV4KSB7IGFyZ3Muc3BsaWNlKDEsIDAsICctLWNhY2hlZCcpOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7c3RkaW46IHBhdGNoLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgY29tbWl0KHJhd01lc3NhZ2UsIHthbGxvd0VtcHR5LCBhbWVuZCwgY29BdXRob3JzLCB2ZXJiYXRpbX0gPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2NvbW1pdCddO1xuICAgIGxldCBtc2c7XG5cbiAgICAvLyBpZiBhbWVuZGluZyBhbmQgbm8gbmV3IG1lc3NhZ2UgaXMgcGFzc2VkLCB1c2UgbGFzdCBjb21taXQncyBtZXNzYWdlLiBFbnN1cmUgdGhhdCB3ZSBkb24ndFxuICAgIC8vIG1hbmdsZSBpdCBpbiB0aGUgcHJvY2Vzcy5cbiAgICBpZiAoYW1lbmQgJiYgcmF3TWVzc2FnZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHt1bmJvcm5SZWYsIG1lc3NhZ2VCb2R5LCBtZXNzYWdlU3ViamVjdH0gPSBhd2FpdCB0aGlzLmdldEhlYWRDb21taXQoKTtcbiAgICAgIGlmICh1bmJvcm5SZWYpIHtcbiAgICAgICAgbXNnID0gcmF3TWVzc2FnZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IGAke21lc3NhZ2VTdWJqZWN0fVxcblxcbiR7bWVzc2FnZUJvZHl9YC50cmltKCk7XG4gICAgICAgIHZlcmJhdGltID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbXNnID0gcmF3TWVzc2FnZTtcbiAgICB9XG5cbiAgICAvLyBpZiBjb21taXQgdGVtcGxhdGUgaXMgdXNlZCwgc3RyaXAgY29tbWVudGVkIGxpbmVzIGZyb20gY29tbWl0XG4gICAgLy8gdG8gYmUgY29uc2lzdGVudCB3aXRoIGNvbW1hbmQgbGluZSBnaXQuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG5cbiAgICAgIC8vIHJlc3BlY3RpbmcgdGhlIGNvbW1lbnQgY2hhcmFjdGVyIGZyb20gdXNlciBzZXR0aW5ncyBvciBmYWxsIGJhY2sgdG8gIyBhcyBkZWZhdWx0LlxuICAgICAgLy8gaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1jb25maWcjZ2l0LWNvbmZpZy1jb3JlY29tbWVudENoYXJcbiAgICAgIGxldCBjb21tZW50Q2hhciA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdjb3JlLmNvbW1lbnRDaGFyJyk7XG4gICAgICBpZiAoIWNvbW1lbnRDaGFyKSB7XG4gICAgICAgIGNvbW1lbnRDaGFyID0gJyMnO1xuICAgICAgfVxuICAgICAgbXNnID0gbXNnLnNwbGl0KCdcXG4nKS5maWx0ZXIobGluZSA9PiAhbGluZS5zdGFydHNXaXRoKGNvbW1lbnRDaGFyKSkuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjbGVhbnVwIG1vZGUuXG4gICAgaWYgKHZlcmJhdGltKSB7XG4gICAgICBhcmdzLnB1c2goJy0tY2xlYW51cD12ZXJiYXRpbScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb25maWd1cmVkID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2NvbW1pdC5jbGVhbnVwJyk7XG4gICAgICBjb25zdCBtb2RlID0gKGNvbmZpZ3VyZWQgJiYgY29uZmlndXJlZCAhPT0gJ2RlZmF1bHQnKSA/IGNvbmZpZ3VyZWQgOiAnc3RyaXAnO1xuICAgICAgYXJncy5wdXNoKGAtLWNsZWFudXA9JHttb2RlfWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBjby1hdXRob3IgY29tbWl0IHRyYWlsZXJzIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChjb0F1dGhvcnMgJiYgY29BdXRob3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIG1zZyA9IGF3YWl0IHRoaXMuYWRkQ29BdXRob3JzVG9NZXNzYWdlKG1zZywgY29BdXRob3JzKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goJy1tJywgbXNnLnRyaW0oKSk7XG5cbiAgICBpZiAoYW1lbmQpIHsgYXJncy5wdXNoKCctLWFtZW5kJyk7IH1cbiAgICBpZiAoYWxsb3dFbXB0eSkgeyBhcmdzLnB1c2goJy0tYWxsb3ctZW1wdHknKTsgfVxuICAgIHJldHVybiB0aGlzLmdwZ0V4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhZGRDb0F1dGhvcnNUb01lc3NhZ2UobWVzc2FnZSwgY29BdXRob3JzID0gW10pIHtcbiAgICBjb25zdCB0cmFpbGVycyA9IGNvQXV0aG9ycy5tYXAoYXV0aG9yID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuOiAnQ28tQXV0aG9yZWQtQnknLFxuICAgICAgICB2YWx1ZTogYCR7YXV0aG9yLm5hbWV9IDwke2F1dGhvci5lbWFpbH0+YCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCBtZXNzYWdlIGVuZHMgd2l0aCBuZXdsaW5lIGZvciBnaXQtaW50ZXJwcmV0IHRyYWlsZXJzIHRvIHdvcmtcbiAgICBjb25zdCBtc2cgPSBgJHttZXNzYWdlLnRyaW0oKX1cXG5gO1xuXG4gICAgcmV0dXJuIHRyYWlsZXJzLmxlbmd0aCA/IHRoaXMubWVyZ2VUcmFpbGVycyhtc2csIHRyYWlsZXJzKSA6IG1zZztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxlIFN0YXR1cyBhbmQgRGlmZnNcbiAgICovXG4gIGFzeW5jIGdldFN0YXR1c0J1bmRsZSgpIHtcbiAgICBjb25zdCBhcmdzID0gWydzdGF0dXMnLCAnLS1wb3JjZWxhaW49djInLCAnLS1icmFuY2gnLCAnLS11bnRyYWNrZWQtZmlsZXM9YWxsJywgJy0taWdub3JlLXN1Ym1vZHVsZXM9ZGlydHknLCAnLXonXTtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG4gICAgaWYgKG91dHB1dC5sZW5ndGggPiBNQVhfU1RBVFVTX09VVFBVVF9MRU5HVEgpIHtcbiAgICAgIHRocm93IG5ldyBMYXJnZVJlcG9FcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBwYXJzZVN0YXR1cyhvdXRwdXQpO1xuXG4gICAgZm9yIChjb25zdCBlbnRyeVR5cGUgaW4gcmVzdWx0cykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0c1tlbnRyeVR5cGVdKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZU5hdGl2ZVBhdGhTZXBGb3JFbnRyaWVzKHJlc3VsdHNbZW50cnlUeXBlXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICB1cGRhdGVOYXRpdmVQYXRoU2VwRm9yRW50cmllcyhlbnRyaWVzKSB7XG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIC8vIE5vcm1hbGx5IHdlIHdvdWxkIGF2b2lkIG11dGF0aW5nIHJlc3BvbnNlcyBmcm9tIG90aGVyIHBhY2thZ2UncyBBUElzLCBidXQgd2UgY29udHJvbFxuICAgICAgLy8gdGhlIGB3aGF0LXRoZS1zdGF0dXNgIG1vZHVsZSBhbmQga25vdyB0aGVyZSBhcmUgbm8gc2lkZSBlZmZlY3RzLlxuICAgICAgLy8gVGhpcyBpcyBhIGhvdCBjb2RlIHBhdGggYW5kIGJ5IG11dGF0aW5nIHdlIGF2b2lkIGNyZWF0aW5nIG5ldyBvYmplY3RzIHRoYXQgd2lsbCBqdXN0IGJlIEdDJ2VkXG4gICAgICBpZiAoZW50cnkuZmlsZVBhdGgpIHtcbiAgICAgICAgZW50cnkuZmlsZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAoZW50cnkuZmlsZVBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5Lm9yaWdGaWxlUGF0aCkge1xuICAgICAgICBlbnRyeS5vcmlnRmlsZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAoZW50cnkub3JpZ0ZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRpZmZGaWxlU3RhdHVzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2RpZmYnLCAnLS1uYW1lLXN0YXR1cycsICctLW5vLXJlbmFtZXMnXTtcbiAgICBpZiAob3B0aW9ucy5zdGFnZWQpIHsgYXJncy5wdXNoKCctLXN0YWdlZCcpOyB9XG4gICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7IGFyZ3MucHVzaChvcHRpb25zLnRhcmdldCk7IH1cbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG5cbiAgICBjb25zdCBzdGF0dXNNYXAgPSB7XG4gICAgICBBOiAnYWRkZWQnLFxuICAgICAgTTogJ21vZGlmaWVkJyxcbiAgICAgIEQ6ICdkZWxldGVkJyxcbiAgICAgIFU6ICd1bm1lcmdlZCcsXG4gICAgfTtcblxuICAgIGNvbnN0IGZpbGVTdGF0dXNlcyA9IHt9O1xuICAgIG91dHB1dCAmJiBvdXRwdXQudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgW3N0YXR1cywgcmF3RmlsZVBhdGhdID0gbGluZS5zcGxpdCgnXFx0Jyk7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyYXdGaWxlUGF0aCk7XG4gICAgICBmaWxlU3RhdHVzZXNbZmlsZVBhdGhdID0gc3RhdHVzTWFwW3N0YXR1c107XG4gICAgfSk7XG4gICAgaWYgKCFvcHRpb25zLnN0YWdlZCkge1xuICAgICAgY29uc3QgdW50cmFja2VkID0gYXdhaXQgdGhpcy5nZXRVbnRyYWNrZWRGaWxlcygpO1xuICAgICAgdW50cmFja2VkLmZvckVhY2goZmlsZVBhdGggPT4geyBmaWxlU3RhdHVzZXNbZmlsZVBhdGhdID0gJ2FkZGVkJzsgfSk7XG4gICAgfVxuICAgIHJldHVybiBmaWxlU3RhdHVzZXM7XG4gIH1cblxuICBhc3luYyBnZXRVbnRyYWNrZWRGaWxlcygpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydscy1maWxlcycsICctLW90aGVycycsICctLWV4Y2x1ZGUtc3RhbmRhcmQnXSk7XG4gICAgaWYgKG91dHB1dC50cmltKCkgPT09ICcnKSB7IHJldHVybiBbXTsgfVxuICAgIHJldHVybiBvdXRwdXQudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5tYXAodG9OYXRpdmVQYXRoU2VwKTtcbiAgfVxuXG4gIGFzeW5jIGdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIHtzdGFnZWQsIGJhc2VDb21taXR9ID0ge30pIHtcbiAgICBsZXQgYXJncyA9IFsnZGlmZicsICctLW5vLXByZWZpeCcsICctLW5vLWV4dC1kaWZmJywgJy0tbm8tcmVuYW1lcycsICctLWRpZmYtZmlsdGVyPXUnXTtcbiAgICBpZiAoc3RhZ2VkKSB7IGFyZ3MucHVzaCgnLS1zdGFnZWQnKTsgfVxuICAgIGlmIChiYXNlQ29tbWl0KSB7IGFyZ3MucHVzaChiYXNlQ29tbWl0KTsgfVxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbJy0tJywgdG9HaXRQYXRoU2VwKGZpbGVQYXRoKV0pO1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcblxuICAgIGxldCByYXdEaWZmcyA9IFtdO1xuICAgIGlmIChvdXRwdXQpIHtcbiAgICAgIHJhd0RpZmZzID0gcGFyc2VEaWZmKG91dHB1dClcbiAgICAgICAgLmZpbHRlcihyYXdEaWZmID0+IHJhd0RpZmYuc3RhdHVzICE9PSAndW5tZXJnZWQnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdEaWZmcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByYXdEaWZmID0gcmF3RGlmZnNbaV07XG4gICAgICAgIGlmIChyYXdEaWZmLm9sZFBhdGgpIHtcbiAgICAgICAgICByYXdEaWZmLm9sZFBhdGggPSB0b05hdGl2ZVBhdGhTZXAocmF3RGlmZi5vbGRQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmF3RGlmZi5uZXdQYXRoKSB7XG4gICAgICAgICAgcmF3RGlmZi5uZXdQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJhd0RpZmYubmV3UGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXN0YWdlZCAmJiAoYXdhaXQgdGhpcy5nZXRVbnRyYWNrZWRGaWxlcygpKS5pbmNsdWRlcyhmaWxlUGF0aCkpIHtcbiAgICAgIC8vIGFkZCB1bnRyYWNrZWQgZmlsZVxuICAgICAgY29uc3QgYWJzUGF0aCA9IHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIGZpbGVQYXRoKTtcbiAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBhd2FpdCBpc0ZpbGVFeGVjdXRhYmxlKGFic1BhdGgpO1xuICAgICAgY29uc3Qgc3ltbGluayA9IGF3YWl0IGlzRmlsZVN5bWxpbmsoYWJzUGF0aCk7XG4gICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKGFic1BhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgICBjb25zdCBiaW5hcnkgPSBpc0JpbmFyeShjb250ZW50cyk7XG4gICAgICBsZXQgbW9kZTtcbiAgICAgIGxldCByZWFscGF0aDtcbiAgICAgIGlmIChleGVjdXRhYmxlKSB7XG4gICAgICAgIG1vZGUgPSBGaWxlLm1vZGVzLkVYRUNVVEFCTEU7XG4gICAgICB9IGVsc2UgaWYgKHN5bWxpbmspIHtcbiAgICAgICAgbW9kZSA9IEZpbGUubW9kZXMuU1lNTElOSztcbiAgICAgICAgcmVhbHBhdGggPSBhd2FpdCBmcy5yZWFscGF0aChhYnNQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGUgPSBGaWxlLm1vZGVzLk5PUk1BTDtcbiAgICAgIH1cblxuICAgICAgcmF3RGlmZnMucHVzaChidWlsZEFkZGVkRmlsZVBhdGNoKGZpbGVQYXRoLCBiaW5hcnkgPyBudWxsIDogY29udGVudHMsIG1vZGUsIHJlYWxwYXRoKSk7XG4gICAgfVxuICAgIGlmIChyYXdEaWZmcy5sZW5ndGggPiAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGJldHdlZW4gMCBhbmQgMiBkaWZmcyBmb3IgJHtmaWxlUGF0aH0gYnV0IGdvdCAke3Jhd0RpZmZzLmxlbmd0aH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhd0RpZmZzO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoKCkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbXG4gICAgICAnZGlmZicsICctLXN0YWdlZCcsICctLW5vLXByZWZpeCcsICctLW5vLWV4dC1kaWZmJywgJy0tbm8tcmVuYW1lcycsICctLWRpZmYtZmlsdGVyPXUnLFxuICAgIF0pO1xuXG4gICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmcyA9IHBhcnNlRGlmZihvdXRwdXQpO1xuICAgIGZvciAoY29uc3QgZGlmZiBvZiBkaWZmcykge1xuICAgICAgaWYgKGRpZmYub2xkUGF0aCkgeyBkaWZmLm9sZFBhdGggPSB0b05hdGl2ZVBhdGhTZXAoZGlmZi5vbGRQYXRoKTsgfVxuICAgICAgaWYgKGRpZmYubmV3UGF0aCkgeyBkaWZmLm5ld1BhdGggPSB0b05hdGl2ZVBhdGhTZXAoZGlmZi5uZXdQYXRoKTsgfVxuICAgIH1cbiAgICByZXR1cm4gZGlmZnM7XG4gIH1cblxuICAvKipcbiAgICogTWlzY2VsbGFuZW91cyBnZXR0ZXJzXG4gICAqL1xuICBhc3luYyBnZXRDb21taXQocmVmKSB7XG4gICAgY29uc3QgW2NvbW1pdF0gPSBhd2FpdCB0aGlzLmdldENvbW1pdHMoe21heDogMSwgcmVmLCBpbmNsdWRlVW5ib3JuOiB0cnVlfSk7XG4gICAgcmV0dXJuIGNvbW1pdDtcbiAgfVxuXG4gIGFzeW5jIGdldEhlYWRDb21taXQoKSB7XG4gICAgY29uc3QgW2hlYWRDb21taXRdID0gYXdhaXQgdGhpcy5nZXRDb21taXRzKHttYXg6IDEsIHJlZjogJ0hFQUQnLCBpbmNsdWRlVW5ib3JuOiB0cnVlfSk7XG4gICAgcmV0dXJuIGhlYWRDb21taXQ7XG4gIH1cblxuICBhc3luYyBnZXRDb21taXRzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHttYXgsIHJlZiwgaW5jbHVkZVVuYm9ybiwgaW5jbHVkZVBhdGNofSA9IHtcbiAgICAgIG1heDogMSxcbiAgICAgIHJlZjogJ0hFQUQnLFxuICAgICAgaW5jbHVkZVVuYm9ybjogZmFsc2UsXG4gICAgICBpbmNsdWRlUGF0Y2g6IGZhbHNlLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1sb2cjX3ByZXR0eV9mb3JtYXRzXG4gICAgLy8gJXgwMCAtIG51bGwgYnl0ZVxuICAgIC8vICVIIC0gY29tbWl0IFNIQVxuICAgIC8vICVhZSAtIGF1dGhvciBlbWFpbFxuICAgIC8vICVhbiA9IGF1dGhvciBmdWxsIG5hbWVcbiAgICAvLyAlYXQgLSB0aW1lc3RhbXAsIFVOSVggdGltZXN0YW1wXG4gICAgLy8gJXMgLSBzdWJqZWN0XG4gICAgLy8gJWIgLSBib2R5XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICdsb2cnLFxuICAgICAgJy0tcHJldHR5PWZvcm1hdDolSCV4MDAlYWUleDAwJWFuJXgwMCVhdCV4MDAlcyV4MDAlYiV4MDAnLFxuICAgICAgJy0tbm8tYWJicmV2LWNvbW1pdCcsXG4gICAgICAnLS1uby1wcmVmaXgnLFxuICAgICAgJy0tbm8tZXh0LWRpZmYnLFxuICAgICAgJy0tbm8tcmVuYW1lcycsXG4gICAgICAnLXonLFxuICAgICAgJy1uJyxcbiAgICAgIG1heCxcbiAgICAgIHJlZixcbiAgICBdO1xuXG4gICAgaWYgKGluY2x1ZGVQYXRjaCkge1xuICAgICAgYXJncy5wdXNoKCctLXBhdGNoJywgJy1tJywgJy0tZmlyc3QtcGFyZW50Jyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MuY29uY2F0KCctLScpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgaWYgKC91bmtub3duIHJldmlzaW9uLy50ZXN0KGVyci5zdGRFcnIpIHx8IC9iYWQgcmV2aXNpb24gJ0hFQUQnLy50ZXN0KGVyci5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChvdXRwdXQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gaW5jbHVkZVVuYm9ybiA/IFt7c2hhOiAnJywgbWVzc2FnZTogJycsIHVuYm9yblJlZjogdHJ1ZX1dIDogW107XG4gICAgfVxuXG4gICAgY29uc3QgZmllbGRzID0gb3V0cHV0LnRyaW0oKS5zcGxpdCgnXFwwJyk7XG5cbiAgICBjb25zdCBjb21taXRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpICs9IDcpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBmaWVsZHNbaSArIDVdLnRyaW0oKTtcbiAgICAgIGxldCBwYXRjaCA9IFtdO1xuICAgICAgaWYgKGluY2x1ZGVQYXRjaCkge1xuICAgICAgICBjb25zdCBkaWZmcyA9IGZpZWxkc1tpICsgNl07XG4gICAgICAgIHBhdGNoID0gcGFyc2VEaWZmKGRpZmZzLnRyaW0oKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHttZXNzYWdlOiBtZXNzYWdlQm9keSwgY29BdXRob3JzfSA9IGV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlKGJvZHkpO1xuXG4gICAgICBjb21taXRzLnB1c2goe1xuICAgICAgICBzaGE6IGZpZWxkc1tpXSAmJiBmaWVsZHNbaV0udHJpbSgpLFxuICAgICAgICBhdXRob3I6IG5ldyBBdXRob3IoZmllbGRzW2kgKyAxXSAmJiBmaWVsZHNbaSArIDFdLnRyaW0oKSwgZmllbGRzW2kgKyAyXSAmJiBmaWVsZHNbaSArIDJdLnRyaW0oKSksXG4gICAgICAgIGF1dGhvckRhdGU6IHBhcnNlSW50KGZpZWxkc1tpICsgM10sIDEwKSxcbiAgICAgICAgbWVzc2FnZVN1YmplY3Q6IGZpZWxkc1tpICsgNF0sXG4gICAgICAgIG1lc3NhZ2VCb2R5LFxuICAgICAgICBjb0F1dGhvcnMsXG4gICAgICAgIHVuYm9yblJlZjogZmFsc2UsXG4gICAgICAgIHBhdGNoLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb21taXRzO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXV0aG9ycyhvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7bWF4LCByZWZ9ID0ge21heDogMSwgcmVmOiAnSEVBRCcsIC4uLm9wdGlvbnN9O1xuXG4gICAgLy8gaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1sb2cjX3ByZXR0eV9mb3JtYXRzXG4gICAgLy8gJXgxRiAtIGZpZWxkIHNlcGFyYXRvciBieXRlXG4gICAgLy8gJWFuIC0gYXV0aG9yIG5hbWVcbiAgICAvLyAlYWUgLSBhdXRob3IgZW1haWxcbiAgICAvLyAlY24gLSBjb21taXR0ZXIgbmFtZVxuICAgIC8vICVjZSAtIGNvbW1pdHRlciBlbWFpbFxuICAgIC8vICUodHJhaWxlcnM6dW5mb2xkLG9ubHkpIC0gdGhlIGNvbW1pdCBtZXNzYWdlIHRyYWlsZXJzLCBzZXBhcmF0ZWRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IG5ld2xpbmVzIGFuZCB1bmZvbGRlZCAoaS5lLiBwcm9wZXJseVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkIGFuZCBvbmUgdHJhaWxlciBwZXIgbGluZSkuXG5cbiAgICBjb25zdCBkZWxpbWl0ZXIgPSAnMUYnO1xuICAgIGNvbnN0IGRlbGltaXRlclN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoZGVsaW1pdGVyLCAxNikpO1xuICAgIGNvbnN0IGZpZWxkcyA9IFsnJWFuJywgJyVhZScsICclY24nLCAnJWNlJywgJyUodHJhaWxlcnM6dW5mb2xkLG9ubHkpJ107XG4gICAgY29uc3QgZm9ybWF0ID0gZmllbGRzLmpvaW4oYCV4JHtkZWxpbWl0ZXJ9YCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFtcbiAgICAgICAgJ2xvZycsIGAtLWZvcm1hdD0ke2Zvcm1hdH1gLCAnLXonLCAnLW4nLCBtYXgsIHJlZiwgJy0tJyxcbiAgICAgIF0pO1xuXG4gICAgICByZXR1cm4gb3V0cHV0LnNwbGl0KCdcXDAnKVxuICAgICAgICAucmVkdWNlKChhY2MsIGxpbmUpID0+IHtcbiAgICAgICAgICBpZiAobGluZS5sZW5ndGggPT09IDApIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgICAgICAgY29uc3QgW2FuLCBhZSwgY24sIGNlLCB0cmFpbGVyc10gPSBsaW5lLnNwbGl0KGRlbGltaXRlclN0cmluZyk7XG4gICAgICAgICAgdHJhaWxlcnNcbiAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgIC5tYXAodHJhaWxlciA9PiB0cmFpbGVyLm1hdGNoKENPX0FVVEhPUl9SRUdFWCkpXG4gICAgICAgICAgICAuZmlsdGVyKG1hdGNoID0+IG1hdGNoICE9PSBudWxsKVxuICAgICAgICAgICAgLmZvckVhY2goKFtfLCBuYW1lLCBlbWFpbF0pID0+IHsgYWNjW2VtYWlsXSA9IG5hbWU7IH0pO1xuXG4gICAgICAgICAgYWNjW2FlXSA9IGFuO1xuICAgICAgICAgIGFjY1tjZV0gPSBjbjtcblxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICgvdW5rbm93biByZXZpc2lvbi8udGVzdChlcnIuc3RkRXJyKSB8fCAvYmFkIHJldmlzaW9uICdIRUFEJy8udGVzdChlcnIuc3RkRXJyKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWVyZ2VUcmFpbGVycyhjb21taXRNZXNzYWdlLCB0cmFpbGVycykge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2ludGVycHJldC10cmFpbGVycyddO1xuICAgIGZvciAoY29uc3QgdHJhaWxlciBvZiB0cmFpbGVycykge1xuICAgICAgYXJncy5wdXNoKCctLXRyYWlsZXInLCBgJHt0cmFpbGVyLnRva2VufT0ke3RyYWlsZXIudmFsdWV9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3N0ZGluOiBjb21taXRNZXNzYWdlfSk7XG4gIH1cblxuICByZWFkRmlsZUZyb21JbmRleChmaWxlUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydzaG93JywgYDoke3RvR2l0UGF0aFNlcChmaWxlUGF0aCl9YF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlXG4gICAqL1xuICBtZXJnZShicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3BnRXhlYyhbJ21lcmdlJywgYnJhbmNoTmFtZV0sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgaXNNZXJnaW5nKGRvdEdpdERpcikge1xuICAgIHJldHVybiBmaWxlRXhpc3RzKHBhdGguam9pbihkb3RHaXREaXIsICdNRVJHRV9IRUFEJykpLmNhdGNoKCgpID0+IGZhbHNlKTtcbiAgfVxuXG4gIGFib3J0TWVyZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ21lcmdlJywgJy0tYWJvcnQnXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBjaGVja291dFNpZGUoc2lkZSwgcGF0aHMpIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2NoZWNrb3V0JywgYC0tJHtzaWRlfWAsIC4uLnBhdGhzLm1hcCh0b0dpdFBhdGhTZXApXSk7XG4gIH1cblxuICAvKipcbiAgICogUmViYXNlXG4gICAqL1xuICBhc3luYyBpc1JlYmFzaW5nKGRvdEdpdERpcikge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBmaWxlRXhpc3RzKHBhdGguam9pbihkb3RHaXREaXIsICdyZWJhc2UtbWVyZ2UnKSksXG4gICAgICBmaWxlRXhpc3RzKHBhdGguam9pbihkb3RHaXREaXIsICdyZWJhc2UtYXBwbHknKSksXG4gICAgXSk7XG4gICAgcmV0dXJuIHJlc3VsdHMuc29tZShyID0+IHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW90ZSBpbnRlcmFjdGlvbnNcbiAgICovXG4gIGNsb25lKHJlbW90ZVVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnY2xvbmUnXTtcbiAgICBpZiAob3B0aW9ucy5ub0xvY2FsKSB7IGFyZ3MucHVzaCgnLS1uby1sb2NhbCcpOyB9XG4gICAgaWYgKG9wdGlvbnMuYmFyZSkgeyBhcmdzLnB1c2goJy0tYmFyZScpOyB9XG4gICAgaWYgKG9wdGlvbnMucmVjdXJzaXZlKSB7IGFyZ3MucHVzaCgnLS1yZWN1cnNpdmUnKTsgfVxuICAgIGlmIChvcHRpb25zLnNvdXJjZVJlbW90ZU5hbWUpIHsgYXJncy5wdXNoKCctLW9yaWdpbicsIG9wdGlvbnMucmVtb3RlTmFtZSk7IH1cbiAgICBhcmdzLnB1c2gocmVtb3RlVXJsLCB0aGlzLndvcmtpbmdEaXIpO1xuXG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgZmV0Y2gocmVtb3RlTmFtZSwgYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydmZXRjaCcsIHJlbW90ZU5hbWUsIGJyYW5jaE5hbWVdLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgcHVsbChyZW1vdGVOYW1lLCBicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydwdWxsJywgcmVtb3RlTmFtZSwgb3B0aW9ucy5yZWZTcGVjIHx8IGJyYW5jaE5hbWVdO1xuICAgIGlmIChvcHRpb25zLmZmT25seSkge1xuICAgICAgYXJncy5wdXNoKCctLWZmLW9ubHknKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ3BnRXhlYyhhcmdzLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgcHVzaChyZW1vdGVOYW1lLCBicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydwdXNoJywgcmVtb3RlTmFtZSB8fCAnb3JpZ2luJywgb3B0aW9ucy5yZWZTcGVjIHx8IGByZWZzL2hlYWRzLyR7YnJhbmNoTmFtZX1gXTtcbiAgICBpZiAob3B0aW9ucy5zZXRVcHN0cmVhbSkgeyBhcmdzLnB1c2goJy0tc2V0LXVwc3RyZWFtJyk7IH1cbiAgICBpZiAob3B0aW9ucy5mb3JjZSkgeyBhcmdzLnB1c2goJy0tZm9yY2UnKTsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3VzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSwgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmRvIE9wZXJhdGlvbnNcbiAgICovXG4gIHJlc2V0KHR5cGUsIHJldmlzaW9uID0gJ0hFQUQnKSB7XG4gICAgY29uc3QgdmFsaWRUeXBlcyA9IFsnc29mdCddO1xuICAgIGlmICghdmFsaWRUeXBlcy5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGUgJHt0eXBlfS4gTXVzdCBiZSBvbmUgb2Y6ICR7dmFsaWRUeXBlcy5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjKFsncmVzZXQnLCBgLS0ke3R5cGV9YCwgcmV2aXNpb25dKTtcbiAgfVxuXG4gIGRlbGV0ZVJlZihyZWYpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsndXBkYXRlLXJlZicsICctZCcsIHJlZl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEJyYW5jaGVzXG4gICAqL1xuICBjaGVja291dChicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydjaGVja291dCddO1xuICAgIGlmIChvcHRpb25zLmNyZWF0ZU5ldykge1xuICAgICAgYXJncy5wdXNoKCctYicpO1xuICAgIH1cbiAgICBhcmdzLnB1c2goYnJhbmNoTmFtZSk7XG4gICAgaWYgKG9wdGlvbnMuc3RhcnRQb2ludCkge1xuICAgICAgaWYgKG9wdGlvbnMudHJhY2spIHsgYXJncy5wdXNoKCctLXRyYWNrJyk7IH1cbiAgICAgIGFyZ3MucHVzaChvcHRpb25zLnN0YXJ0UG9pbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hlcygpIHtcbiAgICBjb25zdCBmb3JtYXQgPSBbXG4gICAgICAnJShvYmplY3RuYW1lKScsICclKEhFQUQpJywgJyUocmVmbmFtZTpzaG9ydCknLFxuICAgICAgJyUodXBzdHJlYW0pJywgJyUodXBzdHJlYW06cmVtb3RlbmFtZSknLCAnJSh1cHN0cmVhbTpyZW1vdGVyZWYpJyxcbiAgICAgICclKHB1c2gpJywgJyUocHVzaDpyZW1vdGVuYW1lKScsICclKHB1c2g6cmVtb3RlcmVmKScsXG4gICAgXS5qb2luKCclMDAnKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2Zvci1lYWNoLXJlZicsIGAtLWZvcm1hdD0ke2Zvcm1hdH1gLCAncmVmcy9oZWFkcy8qKiddKTtcbiAgICByZXR1cm4gb3V0cHV0LnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubWFwKGxpbmUgPT4ge1xuICAgICAgY29uc3QgW1xuICAgICAgICBzaGEsIGhlYWQsIG5hbWUsXG4gICAgICAgIHVwc3RyZWFtVHJhY2tpbmdSZWYsIHVwc3RyZWFtUmVtb3RlTmFtZSwgdXBzdHJlYW1SZW1vdGVSZWYsXG4gICAgICAgIHB1c2hUcmFja2luZ1JlZiwgcHVzaFJlbW90ZU5hbWUsIHB1c2hSZW1vdGVSZWYsXG4gICAgICBdID0gbGluZS5zcGxpdCgnXFwwJyk7XG5cbiAgICAgIGNvbnN0IGJyYW5jaCA9IHtuYW1lLCBzaGEsIGhlYWQ6IGhlYWQgPT09ICcqJ307XG4gICAgICBpZiAodXBzdHJlYW1UcmFja2luZ1JlZiB8fCB1cHN0cmVhbVJlbW90ZU5hbWUgfHwgdXBzdHJlYW1SZW1vdGVSZWYpIHtcbiAgICAgICAgYnJhbmNoLnVwc3RyZWFtID0ge1xuICAgICAgICAgIHRyYWNraW5nUmVmOiB1cHN0cmVhbVRyYWNraW5nUmVmLFxuICAgICAgICAgIHJlbW90ZU5hbWU6IHVwc3RyZWFtUmVtb3RlTmFtZSxcbiAgICAgICAgICByZW1vdGVSZWY6IHVwc3RyZWFtUmVtb3RlUmVmLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGJyYW5jaC51cHN0cmVhbSB8fCBwdXNoVHJhY2tpbmdSZWYgfHwgcHVzaFJlbW90ZU5hbWUgfHwgcHVzaFJlbW90ZVJlZikge1xuICAgICAgICBicmFuY2gucHVzaCA9IHtcbiAgICAgICAgICB0cmFja2luZ1JlZjogcHVzaFRyYWNraW5nUmVmLFxuICAgICAgICAgIHJlbW90ZU5hbWU6IHB1c2hSZW1vdGVOYW1lIHx8IChicmFuY2gudXBzdHJlYW0gJiYgYnJhbmNoLnVwc3RyZWFtLnJlbW90ZU5hbWUpLFxuICAgICAgICAgIHJlbW90ZVJlZjogcHVzaFJlbW90ZVJlZiB8fCAoYnJhbmNoLnVwc3RyZWFtICYmIGJyYW5jaC51cHN0cmVhbS5yZW1vdGVSZWYpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJyYW5jaDtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEJyYW5jaGVzV2l0aENvbW1pdChzaGEsIG9wdGlvbiA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnYnJhbmNoJywgJy0tZm9ybWF0PSUocmVmbmFtZSknLCAnLS1jb250YWlucycsIHNoYV07XG4gICAgaWYgKG9wdGlvbi5zaG93TG9jYWwgJiYgb3B0aW9uLnNob3dSZW1vdGUpIHtcbiAgICAgIGFyZ3Muc3BsaWNlKDEsIDAsICctLWFsbCcpO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uLnNob3dSZW1vdGUpIHtcbiAgICAgIGFyZ3Muc3BsaWNlKDEsIDAsICctLXJlbW90ZXMnKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbi5wYXR0ZXJuKSB7XG4gICAgICBhcmdzLnB1c2gob3B0aW9uLnBhdHRlcm4pO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZXhlYyhhcmdzKSkudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKTtcbiAgfVxuXG4gIGNoZWNrb3V0RmlsZXMocGF0aHMsIHJldmlzaW9uKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IGFyZ3MgPSBbJ2NoZWNrb3V0J107XG4gICAgaWYgKHJldmlzaW9uKSB7IGFyZ3MucHVzaChyZXZpc2lvbik7IH1cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MuY29uY2F0KCctLScsIHBhdGhzLm1hcCh0b0dpdFBhdGhTZXApKSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBkZXNjcmliZUhlYWQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmV4ZWMoWydkZXNjcmliZScsICctLWNvbnRhaW5zJywgJy0tYWxsJywgJy0tYWx3YXlzJywgJ0hFQUQnXSkpLnRyaW0oKTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbmZpZyhvcHRpb24sIHtsb2NhbH0gPSB7fSkge1xuICAgIGxldCBvdXRwdXQ7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBhcmdzID0gWydjb25maWcnXTtcbiAgICAgIGlmIChsb2NhbCkgeyBhcmdzLnB1c2goJy0tbG9jYWwnKTsgfVxuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KG9wdGlvbik7XG4gICAgICBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLmNvZGUgPT09IDEgfHwgZXJyLmNvZGUgPT09IDEyOCkge1xuICAgICAgICAvLyBObyBtYXRjaGluZyBjb25maWcgZm91bmQgT1IgLS1sb2NhbCBjYW4gb25seSBiZSB1c2VkIGluc2lkZSBhIGdpdCByZXBvc2l0b3J5XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQudHJpbSgpO1xuICB9XG5cbiAgc2V0Q29uZmlnKG9wdGlvbiwgdmFsdWUsIHtyZXBsYWNlQWxsLCBnbG9iYWx9ID0ge30pIHtcbiAgICBsZXQgYXJncyA9IFsnY29uZmlnJ107XG4gICAgaWYgKHJlcGxhY2VBbGwpIHsgYXJncy5wdXNoKCctLXJlcGxhY2UtYWxsJyk7IH1cbiAgICBpZiAoZ2xvYmFsKSB7IGFyZ3MucHVzaCgnLS1nbG9iYWwnKTsgfVxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChvcHRpb24sIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgdW5zZXRDb25maWcob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2NvbmZpZycsICctLXVuc2V0Jywgb3B0aW9uXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBnZXRSZW1vdGVzKCkge1xuICAgIGxldCBvdXRwdXQgPSBhd2FpdCB0aGlzLmdldENvbmZpZyhbJy0tZ2V0LXJlZ2V4cCcsICdecmVtb3RlXFxcXC4uKlxcXFwudXJsJCddLCB7bG9jYWw6IHRydWV9KTtcbiAgICBpZiAob3V0cHV0KSB7XG4gICAgICBvdXRwdXQgPSBvdXRwdXQudHJpbSgpO1xuICAgICAgaWYgKCFvdXRwdXQubGVuZ3RoKSB7IHJldHVybiBbXTsgfVxuICAgICAgcmV0dXJuIG91dHB1dC5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL15yZW1vdGVcXC4oLiopXFwudXJsICguKikkLyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogbWF0Y2hbMV0sXG4gICAgICAgICAgdXJsOiBtYXRjaFsyXSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9XG5cbiAgYWRkUmVtb3RlKG5hbWUsIHVybCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydyZW1vdGUnLCAnYWRkJywgbmFtZSwgdXJsXSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVCbG9iKHtmaWxlUGF0aCwgc3RkaW59ID0ge30pIHtcbiAgICBsZXQgb3V0cHV0O1xuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgb3V0cHV0ID0gKGF3YWl0IHRoaXMuZXhlYyhbJ2hhc2gtb2JqZWN0JywgJy13JywgZmlsZVBhdGhdLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KSkudHJpbSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZS5zdGRFcnIgJiYgZS5zdGRFcnIubWF0Y2goL2ZhdGFsOiBDYW5ub3Qgb3BlbiAuKjogTm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeS8pKSB7XG4gICAgICAgICAgb3V0cHV0ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGRpbikge1xuICAgICAgb3V0cHV0ID0gKGF3YWl0IHRoaXMuZXhlYyhbJ2hhc2gtb2JqZWN0JywgJy13JywgJy0tc3RkaW4nXSwge3N0ZGluLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pKS50cmltKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBzdXBwbHkgZmlsZSBwYXRoIG9yIHN0ZGluJyk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBhc3luYyBleHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydjYXQtZmlsZScsICctcCcsIHNoYV0pO1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShhYnNGaWxlUGF0aCwgb3V0cHV0LCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgIHJldHVybiBhYnNGaWxlUGF0aDtcbiAgfVxuXG4gIGFzeW5jIGdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjKFsnY2F0LWZpbGUnLCAnLXAnLCBzaGFdKTtcbiAgfVxuXG4gIGFzeW5jIG1lcmdlRmlsZShvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJ21lcmdlLWZpbGUnLCAnLXAnLCBvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsXG4gICAgICAnLUwnLCAnY3VycmVudCcsICctTCcsICdhZnRlciBkaXNjYXJkJywgJy1MJywgJ2JlZm9yZSBkaXNjYXJkJyxcbiAgICBdO1xuICAgIGxldCBvdXRwdXQ7XG4gICAgbGV0IGNvbmZsaWN0ID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEdpdEVycm9yICYmIGUuY29kZSA9PT0gMSkge1xuICAgICAgICBvdXRwdXQgPSBlLnN0ZE91dDtcbiAgICAgICAgY29uZmxpY3QgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnRlcnByZXQgYSByZWxhdGl2ZSByZXN1bHRQYXRoIGFzIHJlbGF0aXZlIHRvIHRoZSByZXBvc2l0b3J5IHdvcmtpbmcgZGlyZWN0b3J5IGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZVxuICAgIC8vIG90aGVyIGFyZ3VtZW50cy5cbiAgICBjb25zdCByZXNvbHZlZFJlc3VsdFBhdGggPSBwYXRoLnJlc29sdmUodGhpcy53b3JraW5nRGlyLCByZXN1bHRQYXRoKTtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUocmVzb2x2ZWRSZXN1bHRQYXRoLCBvdXRwdXQsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG5cbiAgICByZXR1cm4ge2ZpbGVQYXRoOiBvdXJzUGF0aCwgcmVzdWx0UGF0aCwgY29uZmxpY3R9O1xuICB9XG5cbiAgYXN5bmMgd3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSB7XG4gICAgY29uc3QgZ2l0RmlsZVBhdGggPSB0b0dpdFBhdGhTZXAoZmlsZVBhdGgpO1xuICAgIGNvbnN0IGZpbGVNb2RlID0gYXdhaXQgdGhpcy5nZXRGaWxlTW9kZShmaWxlUGF0aCk7XG4gICAgbGV0IGluZGV4SW5mbyA9IGAwIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBcXHQke2dpdEZpbGVQYXRofVxcbmA7XG4gICAgaWYgKGNvbW1vbkJhc2VTaGEpIHsgaW5kZXhJbmZvICs9IGAke2ZpbGVNb2RlfSAke2NvbW1vbkJhc2VTaGF9IDFcXHQke2dpdEZpbGVQYXRofVxcbmA7IH1cbiAgICBpZiAob3Vyc1NoYSkgeyBpbmRleEluZm8gKz0gYCR7ZmlsZU1vZGV9ICR7b3Vyc1NoYX0gMlxcdCR7Z2l0RmlsZVBhdGh9XFxuYDsgfVxuICAgIGlmICh0aGVpcnNTaGEpIHsgaW5kZXhJbmZvICs9IGAke2ZpbGVNb2RlfSAke3RoZWlyc1NoYX0gM1xcdCR7Z2l0RmlsZVBhdGh9XFxuYDsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoWyd1cGRhdGUtaW5kZXgnLCAnLS1pbmRleC1pbmZvJ10sIHtzdGRpbjogaW5kZXhJbmZvLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0RmlsZU1vZGUoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydscy1maWxlcycsICctLXN0YWdlJywgJy0tJywgdG9HaXRQYXRoU2VwKGZpbGVQYXRoKV0pO1xuICAgIGlmIChvdXRwdXQpIHtcbiAgICAgIHJldHVybiBvdXRwdXQuc2xpY2UoMCwgNik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBhd2FpdCBpc0ZpbGVFeGVjdXRhYmxlKHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIGZpbGVQYXRoKSk7XG4gICAgICBjb25zdCBzeW1saW5rID0gYXdhaXQgaXNGaWxlU3ltbGluayhwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCBmaWxlUGF0aCkpO1xuICAgICAgaWYgKHN5bWxpbmspIHtcbiAgICAgICAgcmV0dXJuIEZpbGUubW9kZXMuU1lNTElOSztcbiAgICAgIH0gZWxzZSBpZiAoZXhlY3V0YWJsZSkge1xuICAgICAgICByZXR1cm4gRmlsZS5tb2Rlcy5FWEVDVVRBQkxFO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEZpbGUubW9kZXMuTk9STUFMO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jb21tYW5kUXVldWUuZGlzcG9zZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQWRkZWRGaWxlUGF0Y2goZmlsZVBhdGgsIGNvbnRlbnRzLCBtb2RlLCByZWFscGF0aCkge1xuICBjb25zdCBodW5rcyA9IFtdO1xuICBpZiAoY29udGVudHMpIHtcbiAgICBsZXQgbm9OZXdMaW5lO1xuICAgIGxldCBsaW5lcztcbiAgICBpZiAobW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LKSB7XG4gICAgICBub05ld0xpbmUgPSBmYWxzZTtcbiAgICAgIGxpbmVzID0gW2ArJHt0b0dpdFBhdGhTZXAocmVhbHBhdGgpfWAsICdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9OZXdMaW5lID0gY29udGVudHNbY29udGVudHMubGVuZ3RoIC0gMV0gIT09ICdcXG4nO1xuICAgICAgbGluZXMgPSBjb250ZW50cy50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLm1hcChsaW5lID0+IGArJHtsaW5lfWApO1xuICAgIH1cbiAgICBpZiAobm9OZXdMaW5lKSB7IGxpbmVzLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpOyB9XG4gICAgaHVua3MucHVzaCh7XG4gICAgICBsaW5lcyxcbiAgICAgIG9sZFN0YXJ0TGluZTogMCxcbiAgICAgIG9sZExpbmVDb3VudDogMCxcbiAgICAgIG5ld1N0YXJ0TGluZTogMSxcbiAgICAgIGhlYWRpbmc6ICcnLFxuICAgICAgbmV3TGluZUNvdW50OiBub05ld0xpbmUgPyBsaW5lcy5sZW5ndGggLSAxIDogbGluZXMubGVuZ3RoLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgb2xkUGF0aDogbnVsbCxcbiAgICBuZXdQYXRoOiB0b05hdGl2ZVBhdGhTZXAoZmlsZVBhdGgpLFxuICAgIG9sZE1vZGU6IG51bGwsXG4gICAgbmV3TW9kZTogbW9kZSxcbiAgICBzdGF0dXM6ICdhZGRlZCcsXG4gICAgaHVua3MsXG4gIH07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEs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