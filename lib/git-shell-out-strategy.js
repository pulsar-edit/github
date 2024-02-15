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
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX29zIiwiX2NoaWxkX3Byb2Nlc3MiLCJfZnNFeHRyYSIsIl91dGlsIiwiX2VsZWN0cm9uIiwiX2V2ZW50S2l0IiwiX2R1Z2l0ZSIsIl93aGF0VGhlRGlmZiIsIl93aGF0VGhlU3RhdHVzIiwiX2dpdFByb21wdFNlcnZlciIsIl9naXRUZW1wRGlyIiwiX2FzeW5jUXVldWUiLCJfcmVwb3J0ZXJQcm94eSIsIl9oZWxwZXJzIiwiX2dpdFRpbWluZ3NWaWV3IiwiX2ZpbGUiLCJfd29ya2VyTWFuYWdlciIsIl9hdXRob3IiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIm93bktleXMiLCJlIiwiciIsInQiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTUFYX1NUQVRVU19PVVRQVVRfTEVOR1RIIiwiaGVhZGxlc3MiLCJleGVjUGF0aFByb21pc2UiLCJHaXRFcnJvciIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJtZXNzYWdlIiwic3RhY2siLCJleHBvcnRzIiwiTGFyZ2VSZXBvRXJyb3IiLCJJR05PUkVEX0dJVF9DT01NQU5EUyIsIkRJU0FCTEVfQ09MT1JfRkxBR1MiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwidW5zaGlmdCIsIkVYUEFORF9USUxERV9SRUdFWCIsIlJlZ0V4cCIsIkdpdFNoZWxsT3V0U3RyYXRlZ3kiLCJ3b3JraW5nRGlyIiwib3B0aW9ucyIsInF1ZXVlIiwiY29tbWFuZFF1ZXVlIiwicGFyYWxsZWxpc20iLCJNYXRoIiwibWF4Iiwib3MiLCJjcHVzIiwiQXN5bmNRdWV1ZSIsInByb21wdCIsInF1ZXJ5IiwiUHJvbWlzZSIsInJlamVjdCIsIndvcmtlck1hbmFnZXIiLCJyZW1vdGUiLCJnZXRDdXJyZW50V2luZG93IiwiaXNWaXNpYmxlIiwic2V0UHJvbXB0Q2FsbGJhY2siLCJleGVjIiwiYXJncyIsImRlZmF1bHRFeGVjQXJncyIsInN0ZGluIiwidXNlR2l0UHJvbXB0U2VydmVyIiwidXNlR3BnV3JhcHBlciIsInVzZUdwZ0F0b21Qcm9tcHQiLCJ3cml0ZU9wZXJhdGlvbiIsImNvbW1hbmROYW1lIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJkaWFnbm9zdGljc0VuYWJsZWQiLCJwcm9jZXNzIiwiZW52IiwiQVRPTV9HSVRIVUJfR0lUX0RJQUdOT1NUSUNTIiwiYXRvbSIsImNvbmZpZyIsImdldCIsImZvcm1hdHRlZEFyZ3MiLCJqb2luIiwidGltaW5nTWFya2VyIiwiR2l0VGltaW5nc1ZpZXciLCJnZW5lcmF0ZU1hcmtlciIsIm1hcmsiLCJyZXNvbHZlIiwiY2hpbGRQcm9jZXNzIiwiZXJyb3IiLCJzdGRvdXQiLCJ0cmltIiwiZXhlY1BhdGgiLCJnaXRQcm9tcHRTZXJ2ZXIiLCJwYXRoUGFydHMiLCJQQVRIIiwiR0lUX1RFUk1JTkFMX1BST01QVCIsIkdJVF9PUFRJT05BTF9MT0NLUyIsInBhdGgiLCJkZWxpbWl0ZXIiLCJnaXRUZW1wRGlyIiwiR2l0VGVtcERpciIsImVuc3VyZSIsImdldEdwZ1dyYXBwZXJTaCIsIkdpdFByb21wdFNlcnZlciIsInN0YXJ0IiwiQVRPTV9HSVRIVUJfVE1QIiwiZ2V0Um9vdFBhdGgiLCJBVE9NX0dJVEhVQl9BU0tQQVNTX1BBVEgiLCJub3JtYWxpemVHaXRIZWxwZXJQYXRoIiwiZ2V0QXNrUGFzc0pzIiwiQVRPTV9HSVRIVUJfQ1JFREVOVElBTF9QQVRIIiwiZ2V0Q3JlZGVudGlhbEhlbHBlckpzIiwiQVRPTV9HSVRIVUJfRUxFQ1RST05fUEFUSCIsImdldEF0b21IZWxwZXJQYXRoIiwiQVRPTV9HSVRIVUJfU09DS19BRERSIiwiZ2V0QWRkcmVzcyIsIkFUT01fR0lUSFVCX1dPUktESVJfUEFUSCIsIkFUT01fR0lUSFVCX0RVR0lURV9QQVRIIiwiZ2V0RHVnaXRlUGF0aCIsIkFUT01fR0lUSFVCX0tFWVRBUl9TVFJBVEVHWV9QQVRIIiwiZ2V0U2hhcmVkTW9kdWxlUGF0aCIsIkRJU1BMQVkiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9QQVRIIiwiQVRPTV9HSVRIVUJfT1JJR0lOQUxfR0lUX0FTS1BBU1MiLCJHSVRfQVNLUEFTUyIsIkFUT01fR0lUSFVCX09SSUdJTkFMX1NTSF9BU0tQQVNTIiwiU1NIX0FTS1BBU1MiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfU1NIX0NPTU1BTkQiLCJHSVRfU1NIX0NPTU1BTkQiLCJBVE9NX0dJVEhVQl9TUEVDX01PREUiLCJpblNwZWNNb2RlIiwiZ2V0QXNrUGFzc1NoIiwicGxhdGZvcm0iLCJnZXRTc2hXcmFwcGVyU2giLCJHSVRfU1NIIiwiY3JlZGVudGlhbEhlbHBlclNoIiwiZ2V0Q3JlZGVudGlhbEhlbHBlclNoIiwiQVRPTV9HSVRIVUJfR1BHX1BST01QVCIsIkdJVF9UUkFDRSIsIkdJVF9UUkFDRV9DVVJMIiwib3B0cyIsInN0ZGluRW5jb2RpbmciLCJQUklOVF9HSVRfVElNRVMiLCJjb25zb2xlIiwidGltZSIsImJlZm9yZVJ1biIsIm5ld0FyZ3NPcHRzIiwicHJvbWlzZSIsImNhbmNlbCIsImV4ZWN1dGVHaXRDb21tYW5kIiwiZXhwZWN0Q2FuY2VsIiwiYWRkIiwib25EaWRDYW5jZWwiLCJoYW5kbGVyUGlkIiwicmVzb2x2ZUtpbGwiLCJyZWplY3RLaWxsIiwiZXJyIiwic3RkZXJyIiwiZXhpdENvZGUiLCJzaWduYWwiLCJ0aW1pbmciLCJjYXRjaCIsImV4ZWNUaW1lIiwic3Bhd25UaW1lIiwiaXBjVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiZmluYWxpemUiLCJ0aW1lRW5kIiwidGVybWluYXRlIiwiZGlzcG9zZSIsImV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzIiwicmF3IiwicmVwbGFjZSIsInN1bW1hcnkiLCJ1bmRlZmluZWQiLCJsb2ciLCJoZWFkZXJTdHlsZSIsImdyb3VwQ29sbGFwc2VkIiwidXRpbCIsImluc3BlY3QiLCJicmVha0xlbmd0aCIsIkluZmluaXR5IiwiZ3JvdXBFbmQiLCJjb2RlIiwic3RkRXJyIiwic3RkT3V0IiwiY29tbWFuZCIsImluY2x1ZGVzIiwiaW5jcmVtZW50Q291bnRlciIsInBhcmFsbGVsIiwiZ3BnRXhlYyIsInNsaWNlIiwidGVzdCIsIm1hcmtlciIsIkFUT01fR0lUSFVCX0lOTElORV9HSVRfRVhFQyIsIldvcmtlck1hbmFnZXIiLCJnZXRJbnN0YW5jZSIsImlzUmVhZHkiLCJjaGlsZFBpZCIsInByb2Nlc3NDYWxsYmFjayIsImNoaWxkIiwicGlkIiwib24iLCJHaXRQcm9jZXNzIiwicmVxdWVzdCIsInJlc29sdmVEb3RHaXREaXIiLCJmcyIsInN0YXQiLCJvdXRwdXQiLCJkb3RHaXREaXIiLCJ0b05hdGl2ZVBhdGhTZXAiLCJpbml0Iiwic3RhZ2VGaWxlcyIsInBhdGhzIiwiY29uY2F0IiwibWFwIiwidG9HaXRQYXRoU2VwIiwiZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZVBhdGgiLCJnZXRDb25maWciLCJob21lRGlyIiwiaG9tZWRpciIsIl8iLCJ1c2VyIiwiZGlybmFtZSIsImlzQWJzb2x1dGUiLCJmaWxlRXhpc3RzIiwicmVhZEZpbGUiLCJlbmNvZGluZyIsInVuc3RhZ2VGaWxlcyIsImNvbW1pdCIsInN0YWdlRmlsZU1vZGVDaGFuZ2UiLCJmaWxlbmFtZSIsIm5ld01vZGUiLCJpbmRleFJlYWRQcm9taXNlIiwiZGV0ZXJtaW5lQXJncyIsImluZGV4Iiwib2lkIiwic3Vic3RyIiwic3RhZ2VGaWxlU3ltbGlua0NoYW5nZSIsImFwcGx5UGF0Y2giLCJwYXRjaCIsInNwbGljZSIsInJhd01lc3NhZ2UiLCJhbGxvd0VtcHR5IiwiYW1lbmQiLCJjb0F1dGhvcnMiLCJ2ZXJiYXRpbSIsIm1zZyIsInVuYm9yblJlZiIsIm1lc3NhZ2VCb2R5IiwibWVzc2FnZVN1YmplY3QiLCJnZXRIZWFkQ29tbWl0IiwidGVtcGxhdGUiLCJjb21tZW50Q2hhciIsInNwbGl0IiwibGluZSIsInN0YXJ0c1dpdGgiLCJjb25maWd1cmVkIiwibW9kZSIsImFkZENvQXV0aG9yc1RvTWVzc2FnZSIsInRyYWlsZXJzIiwiYXV0aG9yIiwidG9rZW4iLCJuYW1lIiwiZW1haWwiLCJtZXJnZVRyYWlsZXJzIiwiZ2V0U3RhdHVzQnVuZGxlIiwicmVzdWx0cyIsInBhcnNlU3RhdHVzIiwiZW50cnlUeXBlIiwiQXJyYXkiLCJpc0FycmF5IiwidXBkYXRlTmF0aXZlUGF0aFNlcEZvckVudHJpZXMiLCJlbnRyaWVzIiwiZW50cnkiLCJmaWxlUGF0aCIsIm9yaWdGaWxlUGF0aCIsImRpZmZGaWxlU3RhdHVzIiwic3RhZ2VkIiwidGFyZ2V0Iiwic3RhdHVzTWFwIiwiQSIsIk0iLCJEIiwiVSIsImZpbGVTdGF0dXNlcyIsIkxJTkVfRU5ESU5HX1JFR0VYIiwic3RhdHVzIiwicmF3RmlsZVBhdGgiLCJ1bnRyYWNrZWQiLCJnZXRVbnRyYWNrZWRGaWxlcyIsImdldERpZmZzRm9yRmlsZVBhdGgiLCJiYXNlQ29tbWl0IiwicmF3RGlmZnMiLCJwYXJzZURpZmYiLCJyYXdEaWZmIiwib2xkUGF0aCIsIm5ld1BhdGgiLCJhYnNQYXRoIiwiZXhlY3V0YWJsZSIsImlzRmlsZUV4ZWN1dGFibGUiLCJzeW1saW5rIiwiaXNGaWxlU3ltbGluayIsImNvbnRlbnRzIiwiYmluYXJ5IiwiaXNCaW5hcnkiLCJyZWFscGF0aCIsIkZpbGUiLCJtb2RlcyIsIkVYRUNVVEFCTEUiLCJTWU1MSU5LIiwiTk9STUFMIiwiYnVpbGRBZGRlZEZpbGVQYXRjaCIsImdldFN0YWdlZENoYW5nZXNQYXRjaCIsImRpZmZzIiwiZGlmZiIsImdldENvbW1pdCIsInJlZiIsImdldENvbW1pdHMiLCJpbmNsdWRlVW5ib3JuIiwiaGVhZENvbW1pdCIsImluY2x1ZGVQYXRjaCIsInNoYSIsImZpZWxkcyIsImNvbW1pdHMiLCJib2R5IiwiZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UiLCJBdXRob3IiLCJhdXRob3JEYXRlIiwicGFyc2VJbnQiLCJnZXRBdXRob3JzIiwiZGVsaW1pdGVyU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZm9ybWF0IiwiYW4iLCJhZSIsImNuIiwiY2UiLCJ0cmFpbGVyIiwibWF0Y2giLCJDT19BVVRIT1JfUkVHRVgiLCJjb21taXRNZXNzYWdlIiwicmVhZEZpbGVGcm9tSW5kZXgiLCJtZXJnZSIsImJyYW5jaE5hbWUiLCJpc01lcmdpbmciLCJhYm9ydE1lcmdlIiwiY2hlY2tvdXRTaWRlIiwic2lkZSIsImlzUmViYXNpbmciLCJhbGwiLCJzb21lIiwiY2xvbmUiLCJyZW1vdGVVcmwiLCJub0xvY2FsIiwiYmFyZSIsInJlY3Vyc2l2ZSIsInNvdXJjZVJlbW90ZU5hbWUiLCJyZW1vdGVOYW1lIiwiZmV0Y2giLCJwdWxsIiwicmVmU3BlYyIsImZmT25seSIsInNldFVwc3RyZWFtIiwiZm9yY2UiLCJyZXNldCIsInJldmlzaW9uIiwidmFsaWRUeXBlcyIsImRlbGV0ZVJlZiIsImNoZWNrb3V0IiwiY3JlYXRlTmV3Iiwic3RhcnRQb2ludCIsInRyYWNrIiwiZ2V0QnJhbmNoZXMiLCJoZWFkIiwidXBzdHJlYW1UcmFja2luZ1JlZiIsInVwc3RyZWFtUmVtb3RlTmFtZSIsInVwc3RyZWFtUmVtb3RlUmVmIiwicHVzaFRyYWNraW5nUmVmIiwicHVzaFJlbW90ZU5hbWUiLCJwdXNoUmVtb3RlUmVmIiwiYnJhbmNoIiwidXBzdHJlYW0iLCJ0cmFja2luZ1JlZiIsInJlbW90ZVJlZiIsImdldEJyYW5jaGVzV2l0aENvbW1pdCIsIm9wdGlvbiIsInNob3dMb2NhbCIsInNob3dSZW1vdGUiLCJwYXR0ZXJuIiwiY2hlY2tvdXRGaWxlcyIsImRlc2NyaWJlSGVhZCIsImxvY2FsIiwic2V0Q29uZmlnIiwicmVwbGFjZUFsbCIsImdsb2JhbCIsInVuc2V0Q29uZmlnIiwiZ2V0UmVtb3RlcyIsInVybCIsImFkZFJlbW90ZSIsImNyZWF0ZUJsb2IiLCJleHBhbmRCbG9iVG9GaWxlIiwiYWJzRmlsZVBhdGgiLCJ3cml0ZUZpbGUiLCJnZXRCbG9iQ29udGVudHMiLCJtZXJnZUZpbGUiLCJvdXJzUGF0aCIsImNvbW1vbkJhc2VQYXRoIiwidGhlaXJzUGF0aCIsInJlc3VsdFBhdGgiLCJjb25mbGljdCIsInJlc29sdmVkUmVzdWx0UGF0aCIsIndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgiLCJjb21tb25CYXNlU2hhIiwib3Vyc1NoYSIsInRoZWlyc1NoYSIsImdpdEZpbGVQYXRoIiwiZmlsZU1vZGUiLCJnZXRGaWxlTW9kZSIsImluZGV4SW5mbyIsImRlc3Ryb3kiLCJodW5rcyIsIm5vTmV3TGluZSIsImxpbmVzIiwib2xkU3RhcnRMaW5lIiwib2xkTGluZUNvdW50IiwibmV3U3RhcnRMaW5lIiwiaGVhZGluZyIsIm5ld0xpbmVDb3VudCIsIm9sZE1vZGUiXSwic291cmNlcyI6WyJnaXQtc2hlbGwtb3V0LXN0cmF0ZWd5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQge0dpdFByb2Nlc3N9IGZyb20gJ2R1Z2l0ZSc7XG5pbXBvcnQge3BhcnNlIGFzIHBhcnNlRGlmZn0gZnJvbSAnd2hhdC10aGUtZGlmZic7XG5pbXBvcnQge3BhcnNlIGFzIHBhcnNlU3RhdHVzfSBmcm9tICd3aGF0LXRoZS1zdGF0dXMnO1xuXG5pbXBvcnQgR2l0UHJvbXB0U2VydmVyIGZyb20gJy4vZ2l0LXByb21wdC1zZXJ2ZXInO1xuaW1wb3J0IEdpdFRlbXBEaXIgZnJvbSAnLi9naXQtdGVtcC1kaXInO1xuaW1wb3J0IEFzeW5jUXVldWUgZnJvbSAnLi9hc3luYy1xdWV1ZSc7XG5pbXBvcnQge2luY3JlbWVudENvdW50ZXJ9IGZyb20gJy4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtcbiAgZ2V0RHVnaXRlUGF0aCwgZ2V0U2hhcmVkTW9kdWxlUGF0aCwgZ2V0QXRvbUhlbHBlclBhdGgsXG4gIGV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlLCBmaWxlRXhpc3RzLCBpc0ZpbGVFeGVjdXRhYmxlLCBpc0ZpbGVTeW1saW5rLCBpc0JpbmFyeSxcbiAgbm9ybWFsaXplR2l0SGVscGVyUGF0aCwgdG9OYXRpdmVQYXRoU2VwLCB0b0dpdFBhdGhTZXAsIExJTkVfRU5ESU5HX1JFR0VYLCBDT19BVVRIT1JfUkVHRVgsXG59IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgR2l0VGltaW5nc1ZpZXcgZnJvbSAnLi92aWV3cy9naXQtdGltaW5ncy12aWV3JztcbmltcG9ydCBGaWxlIGZyb20gJy4vbW9kZWxzL3BhdGNoL2ZpbGUnO1xuaW1wb3J0IFdvcmtlck1hbmFnZXIgZnJvbSAnLi93b3JrZXItbWFuYWdlcic7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4vbW9kZWxzL2F1dGhvcic7XG5cbmNvbnN0IE1BWF9TVEFUVVNfT1VUUFVUX0xFTkdUSCA9IDEwMjQgKiAxMDI0ICogMTA7XG5cbmxldCBoZWFkbGVzcyA9IG51bGw7XG5sZXQgZXhlY1BhdGhQcm9taXNlID0gbnVsbDtcblxuZXhwb3J0IGNsYXNzIEdpdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExhcmdlUmVwb0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gIH1cbn1cblxuLy8gaWdub3JlZCBmb3IgdGhlIHB1cnBvc2VzIG9mIHVzYWdlIG1ldHJpY3MgdHJhY2tpbmcgYmVjYXVzZSB0aGV5J3JlIG5vaXN5XG5jb25zdCBJR05PUkVEX0dJVF9DT01NQU5EUyA9IFsnY2F0LWZpbGUnLCAnY29uZmlnJywgJ2RpZmYnLCAnZm9yLWVhY2gtcmVmJywgJ2xvZycsICdyZXYtcGFyc2UnLCAnc3RhdHVzJ107XG5cbmNvbnN0IERJU0FCTEVfQ09MT1JfRkxBR1MgPSBbXG4gICdicmFuY2gnLCAnZGlmZicsICdzaG93QnJhbmNoJywgJ3N0YXR1cycsICd1aScsXG5dLnJlZHVjZSgoYWNjLCB0eXBlKSA9PiB7XG4gIGFjYy51bnNoaWZ0KCctYycsIGBjb2xvci4ke3R5cGV9PWZhbHNlYCk7XG4gIHJldHVybiBhY2M7XG59LCBbXSk7XG5cbi8qKlxuICogRXhwYW5kIGNvbmZpZyBwYXRoIG5hbWUgcGVyXG4gKiBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWNvbmZpZyNnaXQtY29uZmlnLXBhdGhuYW1lXG4gKiB0aGlzIHJlZ2V4IGF0dGVtcHRzIHRvIGdldCB0aGUgc3BlY2lmaWVkIHVzZXIncyBob21lIGRpcmVjdG9yeVxuICogRXg6IG9uIE1hYyB+a3V5Y2hhY28vIGlzIGV4cGFuZGVkIHRvIHRoZSBzcGVjaWZpZWQgdXNlcuKAmXMgaG9tZSBkaXJlY3RvcnkgKC9Vc2Vycy9rdXljaGFjbylcbiAqIFJlZ2V4IHRyYW5zbGF0aW9uOlxuICogXn4gbGluZSBzdGFydHMgd2l0aCB0aWxkZVxuICogKFteXFxcXFxcXFwvXSopW1xcXFxcXFxcL10gY2FwdHVyZXMgbm9uLXNsYXNoIGNoYXJhY3RlcnMgYmVmb3JlIGZpcnN0IHNsYXNoXG4gKi9cbmNvbnN0IEVYUEFORF9USUxERV9SRUdFWCA9IG5ldyBSZWdFeHAoJ15+KFteXFxcXFxcXFwvXSopW1xcXFxcXFxcL10nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0U2hlbGxPdXRTdHJhdGVneSB7XG4gIHN0YXRpYyBkZWZhdWx0RXhlY0FyZ3MgPSB7XG4gICAgc3RkaW46IG51bGwsXG4gICAgdXNlR2l0UHJvbXB0U2VydmVyOiBmYWxzZSxcbiAgICB1c2VHcGdXcmFwcGVyOiBmYWxzZSxcbiAgICB1c2VHcGdBdG9tUHJvbXB0OiBmYWxzZSxcbiAgICB3cml0ZU9wZXJhdGlvbjogZmFsc2UsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih3b3JraW5nRGlyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLndvcmtpbmdEaXIgPSB3b3JraW5nRGlyO1xuICAgIGlmIChvcHRpb25zLnF1ZXVlKSB7XG4gICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IG9wdGlvbnMucXVldWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBhcmFsbGVsaXNtID0gb3B0aW9ucy5wYXJhbGxlbGlzbSB8fCBNYXRoLm1heCgzLCBvcy5jcHVzKCkubGVuZ3RoKTtcbiAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gbmV3IEFzeW5jUXVldWUoe3BhcmFsbGVsaXNtfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9tcHQgPSBvcHRpb25zLnByb21wdCB8fCAocXVlcnkgPT4gUHJvbWlzZS5yZWplY3QoKSk7XG4gICAgdGhpcy53b3JrZXJNYW5hZ2VyID0gb3B0aW9ucy53b3JrZXJNYW5hZ2VyO1xuXG4gICAgaWYgKGhlYWRsZXNzID09PSBudWxsKSB7XG4gICAgICBoZWFkbGVzcyA9ICFyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpLmlzVmlzaWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFByb3ZpZGUgYW4gYXN5bmNocm9ub3VzIGNhbGxiYWNrIHRvIGJlIHVzZWQgdG8gcmVxdWVzdCBpbnB1dCBmcm9tIHRoZSB1c2VyIGZvciBnaXQgb3BlcmF0aW9ucy5cbiAgICpcbiAgICogYHByb21wdGAgbXVzdCBiZSBhIGNhbGxhYmxlIHRoYXQgYWNjZXB0cyBhIHF1ZXJ5IG9iamVjdCBge3Byb21wdCwgaW5jbHVkZVVzZXJuYW1lfWAgYW5kIHJldHVybnMgYSBQcm9taXNlXG4gICAqIHRoYXQgZWl0aGVyIHJlc29sdmVzIHdpdGggYSByZXN1bHQgb2JqZWN0IGB7W3VzZXJuYW1lXSwgcGFzc3dvcmR9YCBvciByZWplY3RzIG9uIGNhbmNlbGxhdGlvbi5cbiAgICovXG4gIHNldFByb21wdENhbGxiYWNrKHByb21wdCkge1xuICAgIHRoaXMucHJvbXB0ID0gcHJvbXB0O1xuICB9XG5cbiAgLy8gRXhlY3V0ZSBhIGNvbW1hbmQgYW5kIHJlYWQgdGhlIG91dHB1dCB1c2luZyB0aGUgZW1iZWRkZWQgR2l0IGVudmlyb25tZW50XG4gIGFzeW5jIGV4ZWMoYXJncywgb3B0aW9ucyA9IEdpdFNoZWxsT3V0U3RyYXRlZ3kuZGVmYXVsdEV4ZWNBcmdzKSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSxuby1jb250cm9sLXJlZ2V4ICovXG4gICAgY29uc3Qge3N0ZGluLCB1c2VHaXRQcm9tcHRTZXJ2ZXIsIHVzZUdwZ1dyYXBwZXIsIHVzZUdwZ0F0b21Qcm9tcHQsIHdyaXRlT3BlcmF0aW9ufSA9IG9wdGlvbnM7XG4gICAgY29uc3QgY29tbWFuZE5hbWUgPSBhcmdzWzBdO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGNvbnN0IGRpYWdub3N0aWNzRW5hYmxlZCA9IHByb2Nlc3MuZW52LkFUT01fR0lUSFVCX0dJVF9ESUFHTk9TVElDUyB8fCBhdG9tLmNvbmZpZy5nZXQoJ2dpdGh1Yi5naXREaWFnbm9zdGljcycpO1xuXG4gICAgY29uc3QgZm9ybWF0dGVkQXJncyA9IGBnaXQgJHthcmdzLmpvaW4oJyAnKX0gaW4gJHt0aGlzLndvcmtpbmdEaXJ9YDtcbiAgICBjb25zdCB0aW1pbmdNYXJrZXIgPSBHaXRUaW1pbmdzVmlldy5nZW5lcmF0ZU1hcmtlcihgZ2l0ICR7YXJncy5qb2luKCcgJyl9YCk7XG4gICAgdGltaW5nTWFya2VyLm1hcmsoJ3F1ZXVlZCcpO1xuXG4gICAgYXJncy51bnNoaWZ0KC4uLkRJU0FCTEVfQ09MT1JfRkxBR1MpO1xuXG4gICAgaWYgKGV4ZWNQYXRoUHJvbWlzZSA9PT0gbnVsbCkge1xuICAgICAgLy8gQXR0ZW1wdCB0byBjb2xsZWN0IHRoZSAtLWV4ZWMtcGF0aCBmcm9tIGEgbmF0aXZlIGdpdCBpbnN0YWxsYXRpb24uXG4gICAgICBleGVjUGF0aFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgY2hpbGRQcm9jZXNzLmV4ZWMoJ2dpdCAtLWV4ZWMtcGF0aCcsIChlcnJvciwgc3Rkb3V0KSA9PiB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBPaCB3ZWxsXG4gICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoc3Rkb3V0LnRyaW0oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGV4ZWNQYXRoID0gYXdhaXQgZXhlY1BhdGhQcm9taXNlO1xuXG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goYXN5bmMgKCkgPT4ge1xuICAgICAgdGltaW5nTWFya2VyLm1hcmsoJ3ByZXBhcmUnKTtcbiAgICAgIGxldCBnaXRQcm9tcHRTZXJ2ZXI7XG5cbiAgICAgIGNvbnN0IHBhdGhQYXJ0cyA9IFtdO1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlBBVEgpIHtcbiAgICAgICAgcGF0aFBhcnRzLnB1c2gocHJvY2Vzcy5lbnYuUEFUSCk7XG4gICAgICB9XG4gICAgICBpZiAoZXhlY1BhdGgpIHtcbiAgICAgICAgcGF0aFBhcnRzLnB1c2goZXhlY1BhdGgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlbnYgPSB7XG4gICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICBHSVRfVEVSTUlOQUxfUFJPTVBUOiAnMCcsXG4gICAgICAgIEdJVF9PUFRJT05BTF9MT0NLUzogJzAnLFxuICAgICAgICBQQVRIOiBwYXRoUGFydHMuam9pbihwYXRoLmRlbGltaXRlciksXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnaXRUZW1wRGlyID0gbmV3IEdpdFRlbXBEaXIoKTtcblxuICAgICAgaWYgKHVzZUdwZ1dyYXBwZXIpIHtcbiAgICAgICAgYXdhaXQgZ2l0VGVtcERpci5lbnN1cmUoKTtcbiAgICAgICAgYXJncy51bnNoaWZ0KCctYycsIGBncGcucHJvZ3JhbT0ke2dpdFRlbXBEaXIuZ2V0R3BnV3JhcHBlclNoKCl9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1c2VHaXRQcm9tcHRTZXJ2ZXIpIHtcbiAgICAgICAgZ2l0UHJvbXB0U2VydmVyID0gbmV3IEdpdFByb21wdFNlcnZlcihnaXRUZW1wRGlyKTtcbiAgICAgICAgYXdhaXQgZ2l0UHJvbXB0U2VydmVyLnN0YXJ0KHRoaXMucHJvbXB0KTtcblxuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfVE1QID0gZ2l0VGVtcERpci5nZXRSb290UGF0aCgpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfQVNLUEFTU19QQVRIID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldEFza1Bhc3NKcygpKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0NSRURFTlRJQUxfUEFUSCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRDcmVkZW50aWFsSGVscGVySnMoKSk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9FTEVDVFJPTl9QQVRIID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnZXRBdG9tSGVscGVyUGF0aCgpKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1NPQ0tfQUREUiA9IGdpdFByb21wdFNlcnZlci5nZXRBZGRyZXNzKCk7XG5cbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1dPUktESVJfUEFUSCA9IHRoaXMud29ya2luZ0RpcjtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0RVR0lURV9QQVRIID0gZ2V0RHVnaXRlUGF0aCgpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfS0VZVEFSX1NUUkFURUdZX1BBVEggPSBnZXRTaGFyZWRNb2R1bGVQYXRoKCdrZXl0YXItc3RyYXRlZ3knKTtcblxuICAgICAgICAvLyBcInNzaFwiIHdvbid0IHJlc3BlY3QgU1NIX0FTS1BBU1MgdW5sZXNzOlxuICAgICAgICAvLyAoYSkgaXQncyBydW5uaW5nIHdpdGhvdXQgYSB0dHlcbiAgICAgICAgLy8gKGIpIERJU1BMQVkgaXMgc2V0IHRvIHNvbWV0aGluZyBub25lbXB0eVxuICAgICAgICAvLyBCdXQsIG9uIGEgTWFjLCBESVNQTEFZIGlzIHVuc2V0LiBFbnN1cmUgdGhhdCBpdCBpcyBzbyBvdXIgU1NIX0FTS1BBU1MgaXMgcmVzcGVjdGVkLlxuICAgICAgICBpZiAoIXByb2Nlc3MuZW52LkRJU1BMQVkgfHwgcHJvY2Vzcy5lbnYuRElTUExBWS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBlbnYuRElTUExBWSA9ICdhdG9tLWdpdGh1Yi1wbGFjZWhvbGRlcic7XG4gICAgICAgIH1cblxuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfUEFUSCA9IHByb2Nlc3MuZW52LlBBVEggfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfQVNLUEFTUyA9IHByb2Nlc3MuZW52LkdJVF9BU0tQQVNTIHx8ICcnO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfU1NIX0FTS1BBU1MgPSBwcm9jZXNzLmVudi5TU0hfQVNLUEFTUyB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX0dJVF9TU0hfQ09NTUFORCA9IHByb2Nlc3MuZW52LkdJVF9TU0hfQ09NTUFORCB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1NQRUNfTU9ERSA9IGF0b20uaW5TcGVjTW9kZSgpID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgICAgICBlbnYuU1NIX0FTS1BBU1MgPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0QXNrUGFzc1NoKCkpO1xuICAgICAgICBlbnYuR0lUX0FTS1BBU1MgPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0QXNrUGFzc1NoKCkpO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnKSB7XG4gICAgICAgICAgZW52LkdJVF9TU0hfQ09NTUFORCA9IGdpdFRlbXBEaXIuZ2V0U3NoV3JhcHBlclNoKCk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuR0lUX1NTSF9DT01NQU5EKSB7XG4gICAgICAgICAgZW52LkdJVF9TU0hfQ09NTUFORCA9IHByb2Nlc3MuZW52LkdJVF9TU0hfQ09NTUFORDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnYuR0lUX1NTSCA9IHByb2Nlc3MuZW52LkdJVF9TU0g7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjcmVkZW50aWFsSGVscGVyU2ggPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0Q3JlZGVudGlhbEhlbHBlclNoKCkpO1xuICAgICAgICBhcmdzLnVuc2hpZnQoJy1jJywgYGNyZWRlbnRpYWwuaGVscGVyPSR7Y3JlZGVudGlhbEhlbHBlclNofWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodXNlR3BnV3JhcHBlciAmJiB1c2VHaXRQcm9tcHRTZXJ2ZXIgJiYgdXNlR3BnQXRvbVByb21wdCkge1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfR1BHX1BST01QVCA9ICd0cnVlJztcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoZGlhZ25vc3RpY3NFbmFibGVkKSB7XG4gICAgICAgIGVudi5HSVRfVFJBQ0UgPSAndHJ1ZSc7XG4gICAgICAgIGVudi5HSVRfVFJBQ0VfQ1VSTCA9ICd0cnVlJztcbiAgICAgIH1cblxuICAgICAgbGV0IG9wdHMgPSB7ZW52fTtcblxuICAgICAgaWYgKHN0ZGluKSB7XG4gICAgICAgIG9wdHMuc3RkaW4gPSBzdGRpbjtcbiAgICAgICAgb3B0cy5zdGRpbkVuY29kaW5nID0gJ3V0ZjgnO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChwcm9jZXNzLmVudi5QUklOVF9HSVRfVElNRVMpIHtcbiAgICAgICAgY29uc29sZS50aW1lKGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVSdW4pIHtcbiAgICAgICAgICBjb25zdCBuZXdBcmdzT3B0cyA9IGF3YWl0IG9wdGlvbnMuYmVmb3JlUnVuKHthcmdzLCBvcHRzfSk7XG4gICAgICAgICAgYXJncyA9IG5ld0FyZ3NPcHRzLmFyZ3M7XG4gICAgICAgICAgb3B0cyA9IG5ld0FyZ3NPcHRzLm9wdHM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qge3Byb21pc2UsIGNhbmNlbH0gPSB0aGlzLmV4ZWN1dGVHaXRDb21tYW5kKGFyZ3MsIG9wdHMsIHRpbWluZ01hcmtlcik7XG4gICAgICAgIGxldCBleHBlY3RDYW5jZWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKGdpdFByb21wdFNlcnZlcikge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGdpdFByb21wdFNlcnZlci5vbkRpZENhbmNlbChhc3luYyAoe2hhbmRsZXJQaWR9KSA9PiB7XG4gICAgICAgICAgICBleHBlY3RDYW5jZWwgPSB0cnVlO1xuICAgICAgICAgICAgYXdhaXQgY2FuY2VsKCk7XG5cbiAgICAgICAgICAgIC8vIE9uIFdpbmRvd3MsIHRoZSBTU0hfQVNLUEFTUyBoYW5kbGVyIGlzIGV4ZWN1dGVkIGFzIGEgbm9uLWNoaWxkIHByb2Nlc3MsIHNvIHRoZSBiaW5cXGdpdC1hc2twYXNzLWF0b20uc2hcbiAgICAgICAgICAgIC8vIHByb2Nlc3MgZG9lcyBub3QgdGVybWluYXRlIHdoZW4gdGhlIGdpdCBwcm9jZXNzIGlzIGtpbGxlZC5cbiAgICAgICAgICAgIC8vIEtpbGwgdGhlIGhhbmRsZXIgcHJvY2VzcyAqYWZ0ZXIqIHRoZSBnaXQgcHJvY2VzcyBoYXMgYmVlbiBraWxsZWQgdG8gZW5zdXJlIHRoYXQgZ2l0IGRvZXNuJ3QgaGF2ZSBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gZmFsbCBiYWNrIHRvIEdJVF9BU0tQQVNTIGZyb20gdGhlIGNyZWRlbnRpYWwgaGFuZGxlci5cbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlS2lsbCwgcmVqZWN0S2lsbCkgPT4ge1xuICAgICAgICAgICAgICByZXF1aXJlKCd0cmVlLWtpbGwnKShoYW5kbGVyUGlkLCAnU0lHVEVSTScsIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikgeyByZWplY3RLaWxsKGVycik7IH0gZWxzZSB7IHJlc29sdmVLaWxsKCk7IH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7c3Rkb3V0LCBzdGRlcnIsIGV4aXRDb2RlLCBzaWduYWwsIHRpbWluZ30gPSBhd2FpdCBwcm9taXNlLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVyci5zaWduYWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7c2lnbmFsOiBlcnIuc2lnbmFsfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGltaW5nKSB7XG4gICAgICAgICAgY29uc3Qge2V4ZWNUaW1lLCBzcGF3blRpbWUsIGlwY1RpbWV9ID0gdGltaW5nO1xuICAgICAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICAgIHRpbWluZ01hcmtlci5tYXJrKCduZXh0dGljaycsIG5vdyAtIGV4ZWNUaW1lIC0gc3Bhd25UaW1lIC0gaXBjVGltZSk7XG4gICAgICAgICAgdGltaW5nTWFya2VyLm1hcmsoJ2V4ZWN1dGUnLCBub3cgLSBleGVjVGltZSAtIGlwY1RpbWUpO1xuICAgICAgICAgIHRpbWluZ01hcmtlci5tYXJrKCdpcGMnLCBub3cgLSBpcGNUaW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aW1pbmdNYXJrZXIuZmluYWxpemUoKTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52LlBSSU5UX0dJVF9USU1FUykge1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZChgZ2l0OiR7Zm9ybWF0dGVkQXJnc31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnaXRQcm9tcHRTZXJ2ZXIpIHtcbiAgICAgICAgICBnaXRQcm9tcHRTZXJ2ZXIudGVybWluYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChkaWFnbm9zdGljc0VuYWJsZWQpIHtcbiAgICAgICAgICBjb25zdCBleHBvc2VDb250cm9sQ2hhcmFjdGVycyA9IHJhdyA9PiB7XG4gICAgICAgICAgICBpZiAoIXJhdykgeyByZXR1cm4gJyc7IH1cblxuICAgICAgICAgICAgcmV0dXJuIHJhd1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXFx1MDAwMC91ZywgJzxOVUw+XFxuJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTAwMUYvdWcsICc8U0VQPicpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoaGVhZGxlc3MpIHtcbiAgICAgICAgICAgIGxldCBzdW1tYXJ5ID0gYGdpdDoke2Zvcm1hdHRlZEFyZ3N9XFxuYDtcbiAgICAgICAgICAgIGlmIChleGl0Q29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYGV4aXQgc3RhdHVzOiAke2V4aXRDb2RlfVxcbmA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNpZ25hbCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBleGl0IHNpZ25hbDogJHtzaWduYWx9XFxuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGRpbiAmJiBzdGRpbi5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgc3RkaW46XFxuJHtleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRpbil9XFxuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1bW1hcnkgKz0gJ3N0ZG91dDonO1xuICAgICAgICAgICAgaWYgKHN0ZG91dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSAnIDxlbXB0eT5cXG4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgXFxuJHtleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRvdXQpfVxcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5ICs9ICdzdGRlcnI6JztcbiAgICAgICAgICAgIGlmIChzdGRlcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gJyA8ZW1wdHk+XFxuJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYFxcbiR7ZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkZXJyKX1cXG5gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdW1tYXJ5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyU3R5bGUgPSAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiBibHVlOyc7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoYGdpdDoke2Zvcm1hdHRlZEFyZ3N9YCk7XG4gICAgICAgICAgICBpZiAoZXhpdENvZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWNleGl0IHN0YXR1cyVjICVkJywgaGVhZGVyU3R5bGUsICdmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogYmxhY2s7JywgZXhpdENvZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaWduYWwpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVjZXhpdCBzaWduYWwlYyAlcycsIGhlYWRlclN0eWxlLCAnZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6IGJsYWNrOycsIHNpZ25hbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgJyVjZnVsbCBhcmd1bWVudHMlYyAlcycsXG4gICAgICAgICAgICAgIGhlYWRlclN0eWxlLCAnZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6IGJsYWNrOycsXG4gICAgICAgICAgICAgIHV0aWwuaW5zcGVjdChhcmdzLCB7YnJlYWtMZW5ndGg6IEluZmluaXR5fSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHN0ZGluICYmIHN0ZGluLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWNzdGRpbicsIGhlYWRlclN0eWxlKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkaW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY3N0ZG91dCcsIGhlYWRlclN0eWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZG91dCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyVjc3RkZXJyJywgaGVhZGVyU3R5bGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkZXJyKSk7XG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV4aXRDb2RlICE9PSAwICYmICFleHBlY3RDYW5jZWwpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgR2l0RXJyb3IoXG4gICAgICAgICAgICBgJHtmb3JtYXR0ZWRBcmdzfSBleGl0ZWQgd2l0aCBjb2RlICR7ZXhpdENvZGV9XFxuc3Rkb3V0OiAke3N0ZG91dH1cXG5zdGRlcnI6ICR7c3RkZXJyfWAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBlcnIuY29kZSA9IGV4aXRDb2RlO1xuICAgICAgICAgIGVyci5zdGRFcnIgPSBzdGRlcnI7XG4gICAgICAgICAgZXJyLnN0ZE91dCA9IHN0ZG91dDtcbiAgICAgICAgICBlcnIuY29tbWFuZCA9IGZvcm1hdHRlZEFyZ3M7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUlHTk9SRURfR0lUX0NPTU1BTkRTLmluY2x1ZGVzKGNvbW1hbmROYW1lKSkge1xuICAgICAgICAgIGluY3JlbWVudENvdW50ZXIoY29tbWFuZE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoc3Rkb3V0KTtcbiAgICAgIH0pO1xuICAgIH0sIHtwYXJhbGxlbDogIXdyaXRlT3BlcmF0aW9ufSk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlLG5vLWNvbnRyb2wtcmVnZXggKi9cbiAgfVxuXG4gIGFzeW5jIGdwZ0V4ZWMoYXJncywgb3B0aW9ucykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjKGFyZ3Muc2xpY2UoKSwge1xuICAgICAgICB1c2VHcGdXcmFwcGVyOiB0cnVlLFxuICAgICAgICB1c2VHcGdBdG9tUHJvbXB0OiBmYWxzZSxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICgvZ3BnIGZhaWxlZC8udGVzdChlLnN0ZEVycikpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlYyhhcmdzLCB7XG4gICAgICAgICAgdXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLFxuICAgICAgICAgIHVzZUdwZ1dyYXBwZXI6IHRydWUsXG4gICAgICAgICAgdXNlR3BnQXRvbVByb21wdDogdHJ1ZSxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUdpdENvbW1hbmQoYXJncywgb3B0aW9ucywgbWFya2VyID0gbnVsbCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5BVE9NX0dJVEhVQl9JTkxJTkVfR0lUX0VYRUMgfHwgIVdvcmtlck1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5pc1JlYWR5KCkpIHtcbiAgICAgIG1hcmtlciAmJiBtYXJrZXIubWFyaygnbmV4dHRpY2snKTtcblxuICAgICAgbGV0IGNoaWxkUGlkO1xuICAgICAgb3B0aW9ucy5wcm9jZXNzQ2FsbGJhY2sgPSBjaGlsZCA9PiB7XG4gICAgICAgIGNoaWxkUGlkID0gY2hpbGQucGlkO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGNoaWxkLnN0ZGluLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEVycm9yIHdyaXRpbmcgdG8gc3RkaW46IGdpdCAke2FyZ3Muam9pbignICcpfSBpbiAke3RoaXMud29ya2luZ0Rpcn1cXG4ke29wdGlvbnMuc3RkaW59XFxuJHtlcnJ9YCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IEdpdFByb2Nlc3MuZXhlYyhhcmdzLCB0aGlzLndvcmtpbmdEaXIsIG9wdGlvbnMpO1xuICAgICAgbWFya2VyICYmIG1hcmtlci5tYXJrKCdleGVjdXRlJyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlLFxuICAgICAgICBjYW5jZWw6ICgpID0+IHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoIWNoaWxkUGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlcXVpcmUoJ3RyZWUta2lsbCcpKGNoaWxkUGlkLCAnU0lHVEVSTScsIGVyciA9PiB7XG4gICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7IHJlamVjdChlcnIpOyB9IGVsc2UgeyByZXNvbHZlKCk7IH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgd29ya2VyTWFuYWdlciA9IHRoaXMud29ya2VyTWFuYWdlciB8fCBXb3JrZXJNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgICByZXR1cm4gd29ya2VyTWFuYWdlci5yZXF1ZXN0KHtcbiAgICAgICAgYXJncyxcbiAgICAgICAgd29ya2luZ0RpcjogdGhpcy53b3JraW5nRGlyLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVzb2x2ZURvdEdpdERpcigpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZnMuc3RhdCh0aGlzLndvcmtpbmdEaXIpOyAvLyBmYWlscyBpZiBmb2xkZXIgZG9lc24ndCBleGlzdFxuICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsncmV2LXBhcnNlJywgJy0tcmVzb2x2ZS1naXQtZGlyJywgcGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgJy5naXQnKV0pO1xuICAgICAgY29uc3QgZG90R2l0RGlyID0gb3V0cHV0LnRyaW0oKTtcbiAgICAgIHJldHVybiB0b05hdGl2ZVBhdGhTZXAoZG90R2l0RGlyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydpbml0JywgdGhpcy53b3JraW5nRGlyXSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhZ2luZy9VbnN0YWdpbmcgZmlsZXMgYW5kIHBhdGNoZXMgYW5kIGNvbW1pdHRpbmdcbiAgICovXG4gIHN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7IH1cbiAgICBjb25zdCBhcmdzID0gWydhZGQnXS5jb25jYXQocGF0aHMubWFwKHRvR2l0UGF0aFNlcCkpO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpIHtcbiAgICBsZXQgdGVtcGxhdGVQYXRoID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2NvbW1pdC50ZW1wbGF0ZScpO1xuICAgIGlmICghdGVtcGxhdGVQYXRoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBob21lRGlyID0gb3MuaG9tZWRpcigpO1xuXG4gICAgdGVtcGxhdGVQYXRoID0gdGVtcGxhdGVQYXRoLnRyaW0oKS5yZXBsYWNlKEVYUEFORF9USUxERV9SRUdFWCwgKF8sIHVzZXIpID0+IHtcbiAgICAgIC8vIGlmIG5vIHVzZXIgaXMgc3BlY2lmaWVkLCBmYWxsIGJhY2sgdG8gdXNpbmcgdGhlIGhvbWUgZGlyZWN0b3J5LlxuICAgICAgcmV0dXJuIGAke3VzZXIgPyBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGhvbWVEaXIpLCB1c2VyKSA6IGhvbWVEaXJ9L2A7XG4gICAgfSk7XG4gICAgdGVtcGxhdGVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHRlbXBsYXRlUGF0aCk7XG5cbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZSh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgICB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCB0ZW1wbGF0ZVBhdGgpO1xuICAgIH1cblxuICAgIGlmICghYXdhaXQgZmlsZUV4aXN0cyh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY29tbWl0IHRlbXBsYXRlIHBhdGggc2V0IGluIEdpdCBjb25maWc6ICR7dGVtcGxhdGVQYXRofWApO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZnMucmVhZEZpbGUodGVtcGxhdGVQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICB9XG5cbiAgdW5zdGFnZUZpbGVzKHBhdGhzLCBjb21taXQgPSAnSEVBRCcpIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7IH1cbiAgICBjb25zdCBhcmdzID0gWydyZXNldCcsIGNvbW1pdCwgJy0tJ10uY29uY2F0KHBhdGhzLm1hcCh0b0dpdFBhdGhTZXApKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgc3RhZ2VGaWxlTW9kZUNoYW5nZShmaWxlbmFtZSwgbmV3TW9kZSkge1xuICAgIGNvbnN0IGluZGV4UmVhZFByb21pc2UgPSB0aGlzLmV4ZWMoWydscy1maWxlcycsICctcycsICctLScsIGZpbGVuYW1lXSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3VwZGF0ZS1pbmRleCcsICctLWNhY2hlaW5mbycsIGAke25ld01vZGV9LDxPSURfVEJEPiwke2ZpbGVuYW1lfWBdLCB7XG4gICAgICB3cml0ZU9wZXJhdGlvbjogdHJ1ZSxcbiAgICAgIGJlZm9yZVJ1bjogYXN5bmMgZnVuY3Rpb24gZGV0ZXJtaW5lQXJncyh7YXJncywgb3B0c30pIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBhd2FpdCBpbmRleFJlYWRQcm9taXNlO1xuICAgICAgICBjb25zdCBvaWQgPSBpbmRleC5zdWJzdHIoNywgNDApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9wdHMsXG4gICAgICAgICAgYXJnczogWyd1cGRhdGUtaW5kZXgnLCAnLS1jYWNoZWluZm8nLCBgJHtuZXdNb2RlfSwke29pZH0sJHtmaWxlbmFtZX1gXSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBzdGFnZUZpbGVTeW1saW5rQ2hhbmdlKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3JtJywgJy0tY2FjaGVkJywgZmlsZW5hbWVdLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2gocGF0Y2gsIHtpbmRleH0gPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2FwcGx5JywgJy0nXTtcbiAgICBpZiAoaW5kZXgpIHsgYXJncy5zcGxpY2UoMSwgMCwgJy0tY2FjaGVkJyk7IH1cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHtzdGRpbjogcGF0Y2gsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBjb21taXQocmF3TWVzc2FnZSwge2FsbG93RW1wdHksIGFtZW5kLCBjb0F1dGhvcnMsIHZlcmJhdGltfSA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnY29tbWl0J107XG4gICAgbGV0IG1zZztcblxuICAgIC8vIGlmIGFtZW5kaW5nIGFuZCBubyBuZXcgbWVzc2FnZSBpcyBwYXNzZWQsIHVzZSBsYXN0IGNvbW1pdCdzIG1lc3NhZ2UuIEVuc3VyZSB0aGF0IHdlIGRvbid0XG4gICAgLy8gbWFuZ2xlIGl0IGluIHRoZSBwcm9jZXNzLlxuICAgIGlmIChhbWVuZCAmJiByYXdNZXNzYWdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3Qge3VuYm9yblJlZiwgbWVzc2FnZUJvZHksIG1lc3NhZ2VTdWJqZWN0fSA9IGF3YWl0IHRoaXMuZ2V0SGVhZENvbW1pdCgpO1xuICAgICAgaWYgKHVuYm9yblJlZikge1xuICAgICAgICBtc2cgPSByYXdNZXNzYWdlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbXNnID0gYCR7bWVzc2FnZVN1YmplY3R9XFxuXFxuJHttZXNzYWdlQm9keX1gLnRyaW0oKTtcbiAgICAgICAgdmVyYmF0aW0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtc2cgPSByYXdNZXNzYWdlO1xuICAgIH1cblxuICAgIC8vIGlmIGNvbW1pdCB0ZW1wbGF0ZSBpcyB1c2VkLCBzdHJpcCBjb21tZW50ZWQgbGluZXMgZnJvbSBjb21taXRcbiAgICAvLyB0byBiZSBjb25zaXN0ZW50IHdpdGggY29tbWFuZCBsaW5lIGdpdC5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgICBpZiAodGVtcGxhdGUpIHtcblxuICAgICAgLy8gcmVzcGVjdGluZyB0aGUgY29tbWVudCBjaGFyYWN0ZXIgZnJvbSB1c2VyIHNldHRpbmdzIG9yIGZhbGwgYmFjayB0byAjIGFzIGRlZmF1bHQuXG4gICAgICAvLyBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWNvbmZpZyNnaXQtY29uZmlnLWNvcmVjb21tZW50Q2hhclxuICAgICAgbGV0IGNvbW1lbnRDaGFyID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2NvcmUuY29tbWVudENoYXInKTtcbiAgICAgIGlmICghY29tbWVudENoYXIpIHtcbiAgICAgICAgY29tbWVudENoYXIgPSAnIyc7XG4gICAgICB9XG4gICAgICBtc2cgPSBtc2cuc3BsaXQoJ1xcbicpLmZpbHRlcihsaW5lID0+ICFsaW5lLnN0YXJ0c1dpdGgoY29tbWVudENoYXIpKS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNsZWFudXAgbW9kZS5cbiAgICBpZiAodmVyYmF0aW0pIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1jbGVhbnVwPXZlcmJhdGltJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbmZpZ3VyZWQgPSBhd2FpdCB0aGlzLmdldENvbmZpZygnY29tbWl0LmNsZWFudXAnKTtcbiAgICAgIGNvbnN0IG1vZGUgPSAoY29uZmlndXJlZCAmJiBjb25maWd1cmVkICE9PSAnZGVmYXVsdCcpID8gY29uZmlndXJlZCA6ICdzdHJpcCc7XG4gICAgICBhcmdzLnB1c2goYC0tY2xlYW51cD0ke21vZGV9YCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGNvLWF1dGhvciBjb21taXQgdHJhaWxlcnMgaWYgbmVjZXNzYXJ5XG4gICAgaWYgKGNvQXV0aG9ycyAmJiBjb0F1dGhvcnMubGVuZ3RoID4gMCkge1xuICAgICAgbXNnID0gYXdhaXQgdGhpcy5hZGRDb0F1dGhvcnNUb01lc3NhZ2UobXNnLCBjb0F1dGhvcnMpO1xuICAgIH1cblxuICAgIGFyZ3MucHVzaCgnLW0nLCBtc2cudHJpbSgpKTtcblxuICAgIGlmIChhbWVuZCkgeyBhcmdzLnB1c2goJy0tYW1lbmQnKTsgfVxuICAgIGlmIChhbGxvd0VtcHR5KSB7IGFyZ3MucHVzaCgnLS1hbGxvdy1lbXB0eScpOyB9XG4gICAgcmV0dXJuIHRoaXMuZ3BnRXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFkZENvQXV0aG9yc1RvTWVzc2FnZShtZXNzYWdlLCBjb0F1dGhvcnMgPSBbXSkge1xuICAgIGNvbnN0IHRyYWlsZXJzID0gY29BdXRob3JzLm1hcChhdXRob3IgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9rZW46ICdDby1BdXRob3JlZC1CeScsXG4gICAgICAgIHZhbHVlOiBgJHthdXRob3IubmFtZX0gPCR7YXV0aG9yLmVtYWlsfT5gLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IG1lc3NhZ2UgZW5kcyB3aXRoIG5ld2xpbmUgZm9yIGdpdC1pbnRlcnByZXQgdHJhaWxlcnMgdG8gd29ya1xuICAgIGNvbnN0IG1zZyA9IGAke21lc3NhZ2UudHJpbSgpfVxcbmA7XG5cbiAgICByZXR1cm4gdHJhaWxlcnMubGVuZ3RoID8gdGhpcy5tZXJnZVRyYWlsZXJzKG1zZywgdHJhaWxlcnMpIDogbXNnO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbGUgU3RhdHVzIGFuZCBEaWZmc1xuICAgKi9cbiAgYXN5bmMgZ2V0U3RhdHVzQnVuZGxlKCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ3N0YXR1cycsICctLXBvcmNlbGFpbj12MicsICctLWJyYW5jaCcsICctLXVudHJhY2tlZC1maWxlcz1hbGwnLCAnLS1pZ25vcmUtc3VibW9kdWxlcz1kaXJ0eScsICcteiddO1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcbiAgICBpZiAob3V0cHV0Lmxlbmd0aCA+IE1BWF9TVEFUVVNfT1VUUFVUX0xFTkdUSCkge1xuICAgICAgdGhyb3cgbmV3IExhcmdlUmVwb0Vycm9yKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHBhcnNlU3RhdHVzKG91dHB1dCk7XG5cbiAgICBmb3IgKGNvbnN0IGVudHJ5VHlwZSBpbiByZXN1bHRzKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHRzW2VudHJ5VHlwZV0pKSB7XG4gICAgICAgIHRoaXMudXBkYXRlTmF0aXZlUGF0aFNlcEZvckVudHJpZXMocmVzdWx0c1tlbnRyeVR5cGVdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIHVwZGF0ZU5hdGl2ZVBhdGhTZXBGb3JFbnRyaWVzKGVudHJpZXMpIHtcbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgLy8gTm9ybWFsbHkgd2Ugd291bGQgYXZvaWQgbXV0YXRpbmcgcmVzcG9uc2VzIGZyb20gb3RoZXIgcGFja2FnZSdzIEFQSXMsIGJ1dCB3ZSBjb250cm9sXG4gICAgICAvLyB0aGUgYHdoYXQtdGhlLXN0YXR1c2AgbW9kdWxlIGFuZCBrbm93IHRoZXJlIGFyZSBubyBzaWRlIGVmZmVjdHMuXG4gICAgICAvLyBUaGlzIGlzIGEgaG90IGNvZGUgcGF0aCBhbmQgYnkgbXV0YXRpbmcgd2UgYXZvaWQgY3JlYXRpbmcgbmV3IG9iamVjdHMgdGhhdCB3aWxsIGp1c3QgYmUgR0MnZWRcbiAgICAgIGlmIChlbnRyeS5maWxlUGF0aCkge1xuICAgICAgICBlbnRyeS5maWxlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChlbnRyeS5maWxlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkub3JpZ0ZpbGVQYXRoKSB7XG4gICAgICAgIGVudHJ5Lm9yaWdGaWxlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChlbnRyeS5vcmlnRmlsZVBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGlmZkZpbGVTdGF0dXMob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnZGlmZicsICctLW5hbWUtc3RhdHVzJywgJy0tbm8tcmVuYW1lcyddO1xuICAgIGlmIChvcHRpb25zLnN0YWdlZCkgeyBhcmdzLnB1c2goJy0tc3RhZ2VkJyk7IH1cbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHsgYXJncy5wdXNoKG9wdGlvbnMudGFyZ2V0KTsgfVxuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcblxuICAgIGNvbnN0IHN0YXR1c01hcCA9IHtcbiAgICAgIEE6ICdhZGRlZCcsXG4gICAgICBNOiAnbW9kaWZpZWQnLFxuICAgICAgRDogJ2RlbGV0ZWQnLFxuICAgICAgVTogJ3VubWVyZ2VkJyxcbiAgICB9O1xuXG4gICAgY29uc3QgZmlsZVN0YXR1c2VzID0ge307XG4gICAgb3V0cHV0ICYmIG91dHB1dC50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBjb25zdCBbc3RhdHVzLCByYXdGaWxlUGF0aF0gPSBsaW5lLnNwbGl0KCdcXHQnKTtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJhd0ZpbGVQYXRoKTtcbiAgICAgIGZpbGVTdGF0dXNlc1tmaWxlUGF0aF0gPSBzdGF0dXNNYXBbc3RhdHVzXTtcbiAgICB9KTtcbiAgICBpZiAoIW9wdGlvbnMuc3RhZ2VkKSB7XG4gICAgICBjb25zdCB1bnRyYWNrZWQgPSBhd2FpdCB0aGlzLmdldFVudHJhY2tlZEZpbGVzKCk7XG4gICAgICB1bnRyYWNrZWQuZm9yRWFjaChmaWxlUGF0aCA9PiB7IGZpbGVTdGF0dXNlc1tmaWxlUGF0aF0gPSAnYWRkZWQnOyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVTdGF0dXNlcztcbiAgfVxuXG4gIGFzeW5jIGdldFVudHJhY2tlZEZpbGVzKCkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2xzLWZpbGVzJywgJy0tb3RoZXJzJywgJy0tZXhjbHVkZS1zdGFuZGFyZCddKTtcbiAgICBpZiAob3V0cHV0LnRyaW0oKSA9PT0gJycpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIG91dHB1dC50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLm1hcCh0b05hdGl2ZVBhdGhTZXApO1xuICB9XG5cbiAgYXN5bmMgZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwge3N0YWdlZCwgYmFzZUNvbW1pdH0gPSB7fSkge1xuICAgIGxldCBhcmdzID0gWydkaWZmJywgJy0tbm8tcHJlZml4JywgJy0tbm8tZXh0LWRpZmYnLCAnLS1uby1yZW5hbWVzJywgJy0tZGlmZi1maWx0ZXI9dSddO1xuICAgIGlmIChzdGFnZWQpIHsgYXJncy5wdXNoKCctLXN0YWdlZCcpOyB9XG4gICAgaWYgKGJhc2VDb21taXQpIHsgYXJncy5wdXNoKGJhc2VDb21taXQpOyB9XG4gICAgYXJncyA9IGFyZ3MuY29uY2F0KFsnLS0nLCB0b0dpdFBhdGhTZXAoZmlsZVBhdGgpXSk7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuXG4gICAgbGV0IHJhd0RpZmZzID0gW107XG4gICAgaWYgKG91dHB1dCkge1xuICAgICAgcmF3RGlmZnMgPSBwYXJzZURpZmYob3V0cHV0KVxuICAgICAgICAuZmlsdGVyKHJhd0RpZmYgPT4gcmF3RGlmZi5zdGF0dXMgIT09ICd1bm1lcmdlZCcpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhd0RpZmZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJhd0RpZmYgPSByYXdEaWZmc1tpXTtcbiAgICAgICAgaWYgKHJhd0RpZmYub2xkUGF0aCkge1xuICAgICAgICAgIHJhd0RpZmYub2xkUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyYXdEaWZmLm9sZFBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyYXdEaWZmLm5ld1BhdGgpIHtcbiAgICAgICAgICByYXdEaWZmLm5ld1BhdGggPSB0b05hdGl2ZVBhdGhTZXAocmF3RGlmZi5uZXdQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc3RhZ2VkICYmIChhd2FpdCB0aGlzLmdldFVudHJhY2tlZEZpbGVzKCkpLmluY2x1ZGVzKGZpbGVQYXRoKSkge1xuICAgICAgLy8gYWRkIHVudHJhY2tlZCBmaWxlXG4gICAgICBjb25zdCBhYnNQYXRoID0gcGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgZmlsZVBhdGgpO1xuICAgICAgY29uc3QgZXhlY3V0YWJsZSA9IGF3YWl0IGlzRmlsZUV4ZWN1dGFibGUoYWJzUGF0aCk7XG4gICAgICBjb25zdCBzeW1saW5rID0gYXdhaXQgaXNGaWxlU3ltbGluayhhYnNQYXRoKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUoYWJzUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIGNvbnN0IGJpbmFyeSA9IGlzQmluYXJ5KGNvbnRlbnRzKTtcbiAgICAgIGxldCBtb2RlO1xuICAgICAgbGV0IHJlYWxwYXRoO1xuICAgICAgaWYgKGV4ZWN1dGFibGUpIHtcbiAgICAgICAgbW9kZSA9IEZpbGUubW9kZXMuRVhFQ1VUQUJMRTtcbiAgICAgIH0gZWxzZSBpZiAoc3ltbGluaykge1xuICAgICAgICBtb2RlID0gRmlsZS5tb2Rlcy5TWU1MSU5LO1xuICAgICAgICByZWFscGF0aCA9IGF3YWl0IGZzLnJlYWxwYXRoKGFic1BhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9kZSA9IEZpbGUubW9kZXMuTk9STUFMO1xuICAgICAgfVxuXG4gICAgICByYXdEaWZmcy5wdXNoKGJ1aWxkQWRkZWRGaWxlUGF0Y2goZmlsZVBhdGgsIGJpbmFyeSA/IG51bGwgOiBjb250ZW50cywgbW9kZSwgcmVhbHBhdGgpKTtcbiAgICB9XG4gICAgaWYgKHJhd0RpZmZzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYmV0d2VlbiAwIGFuZCAyIGRpZmZzIGZvciAke2ZpbGVQYXRofSBidXQgZ290ICR7cmF3RGlmZnMubGVuZ3RofWApO1xuICAgIH1cbiAgICByZXR1cm4gcmF3RGlmZnM7XG4gIH1cblxuICBhc3luYyBnZXRTdGFnZWRDaGFuZ2VzUGF0Y2goKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFtcbiAgICAgICdkaWZmJywgJy0tc3RhZ2VkJywgJy0tbm8tcHJlZml4JywgJy0tbm8tZXh0LWRpZmYnLCAnLS1uby1yZW5hbWVzJywgJy0tZGlmZi1maWx0ZXI9dScsXG4gICAgXSk7XG5cbiAgICBpZiAoIW91dHB1dCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmZzID0gcGFyc2VEaWZmKG91dHB1dCk7XG4gICAgZm9yIChjb25zdCBkaWZmIG9mIGRpZmZzKSB7XG4gICAgICBpZiAoZGlmZi5vbGRQYXRoKSB7IGRpZmYub2xkUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChkaWZmLm9sZFBhdGgpOyB9XG4gICAgICBpZiAoZGlmZi5uZXdQYXRoKSB7IGRpZmYubmV3UGF0aCA9IHRvTmF0aXZlUGF0aFNlcChkaWZmLm5ld1BhdGgpOyB9XG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNaXNjZWxsYW5lb3VzIGdldHRlcnNcbiAgICovXG4gIGFzeW5jIGdldENvbW1pdChyZWYpIHtcbiAgICBjb25zdCBbY29tbWl0XSA9IGF3YWl0IHRoaXMuZ2V0Q29tbWl0cyh7bWF4OiAxLCByZWYsIGluY2x1ZGVVbmJvcm46IHRydWV9KTtcbiAgICByZXR1cm4gY29tbWl0O1xuICB9XG5cbiAgYXN5bmMgZ2V0SGVhZENvbW1pdCgpIHtcbiAgICBjb25zdCBbaGVhZENvbW1pdF0gPSBhd2FpdCB0aGlzLmdldENvbW1pdHMoe21heDogMSwgcmVmOiAnSEVBRCcsIGluY2x1ZGVVbmJvcm46IHRydWV9KTtcbiAgICByZXR1cm4gaGVhZENvbW1pdDtcbiAgfVxuXG4gIGFzeW5jIGdldENvbW1pdHMob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qge21heCwgcmVmLCBpbmNsdWRlVW5ib3JuLCBpbmNsdWRlUGF0Y2h9ID0ge1xuICAgICAgbWF4OiAxLFxuICAgICAgcmVmOiAnSEVBRCcsXG4gICAgICBpbmNsdWRlVW5ib3JuOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVQYXRjaDogZmFsc2UsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICAvLyBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWxvZyNfcHJldHR5X2Zvcm1hdHNcbiAgICAvLyAleDAwIC0gbnVsbCBieXRlXG4gICAgLy8gJUggLSBjb21taXQgU0hBXG4gICAgLy8gJWFlIC0gYXV0aG9yIGVtYWlsXG4gICAgLy8gJWFuID0gYXV0aG9yIGZ1bGwgbmFtZVxuICAgIC8vICVhdCAtIHRpbWVzdGFtcCwgVU5JWCB0aW1lc3RhbXBcbiAgICAvLyAlcyAtIHN1YmplY3RcbiAgICAvLyAlYiAtIGJvZHlcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJ2xvZycsXG4gICAgICAnLS1wcmV0dHk9Zm9ybWF0OiVIJXgwMCVhZSV4MDAlYW4leDAwJWF0JXgwMCVzJXgwMCViJXgwMCcsXG4gICAgICAnLS1uby1hYmJyZXYtY29tbWl0JyxcbiAgICAgICctLW5vLXByZWZpeCcsXG4gICAgICAnLS1uby1leHQtZGlmZicsXG4gICAgICAnLS1uby1yZW5hbWVzJyxcbiAgICAgICcteicsXG4gICAgICAnLW4nLFxuICAgICAgbWF4LFxuICAgICAgcmVmLFxuICAgIF07XG5cbiAgICBpZiAoaW5jbHVkZVBhdGNoKSB7XG4gICAgICBhcmdzLnB1c2goJy0tcGF0Y2gnLCAnLW0nLCAnLS1maXJzdC1wYXJlbnQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncy5jb25jYXQoJy0tJykpLmNhdGNoKGVyciA9PiB7XG4gICAgICBpZiAoL3Vua25vd24gcmV2aXNpb24vLnRlc3QoZXJyLnN0ZEVycikgfHwgL2JhZCByZXZpc2lvbiAnSEVBRCcvLnRlc3QoZXJyLnN0ZEVycikpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG91dHB1dCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBpbmNsdWRlVW5ib3JuID8gW3tzaGE6ICcnLCBtZXNzYWdlOiAnJywgdW5ib3JuUmVmOiB0cnVlfV0gOiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWVsZHMgPSBvdXRwdXQudHJpbSgpLnNwbGl0KCdcXDAnKTtcblxuICAgIGNvbnN0IGNvbW1pdHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkgKz0gNykge1xuICAgICAgY29uc3QgYm9keSA9IGZpZWxkc1tpICsgNV0udHJpbSgpO1xuICAgICAgbGV0IHBhdGNoID0gW107XG4gICAgICBpZiAoaW5jbHVkZVBhdGNoKSB7XG4gICAgICAgIGNvbnN0IGRpZmZzID0gZmllbGRzW2kgKyA2XTtcbiAgICAgICAgcGF0Y2ggPSBwYXJzZURpZmYoZGlmZnMudHJpbSgpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qge21lc3NhZ2U6IG1lc3NhZ2VCb2R5LCBjb0F1dGhvcnN9ID0gZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UoYm9keSk7XG5cbiAgICAgIGNvbW1pdHMucHVzaCh7XG4gICAgICAgIHNoYTogZmllbGRzW2ldICYmIGZpZWxkc1tpXS50cmltKCksXG4gICAgICAgIGF1dGhvcjogbmV3IEF1dGhvcihmaWVsZHNbaSArIDFdICYmIGZpZWxkc1tpICsgMV0udHJpbSgpLCBmaWVsZHNbaSArIDJdICYmIGZpZWxkc1tpICsgMl0udHJpbSgpKSxcbiAgICAgICAgYXV0aG9yRGF0ZTogcGFyc2VJbnQoZmllbGRzW2kgKyAzXSwgMTApLFxuICAgICAgICBtZXNzYWdlU3ViamVjdDogZmllbGRzW2kgKyA0XSxcbiAgICAgICAgbWVzc2FnZUJvZHksXG4gICAgICAgIGNvQXV0aG9ycyxcbiAgICAgICAgdW5ib3JuUmVmOiBmYWxzZSxcbiAgICAgICAgcGF0Y2gsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1pdHM7XG4gIH1cblxuICBhc3luYyBnZXRBdXRob3JzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHttYXgsIHJlZn0gPSB7bWF4OiAxLCByZWY6ICdIRUFEJywgLi4ub3B0aW9uc307XG5cbiAgICAvLyBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWxvZyNfcHJldHR5X2Zvcm1hdHNcbiAgICAvLyAleDFGIC0gZmllbGQgc2VwYXJhdG9yIGJ5dGVcbiAgICAvLyAlYW4gLSBhdXRob3IgbmFtZVxuICAgIC8vICVhZSAtIGF1dGhvciBlbWFpbFxuICAgIC8vICVjbiAtIGNvbW1pdHRlciBuYW1lXG4gICAgLy8gJWNlIC0gY29tbWl0dGVyIGVtYWlsXG4gICAgLy8gJSh0cmFpbGVyczp1bmZvbGQsb25seSkgLSB0aGUgY29tbWl0IG1lc3NhZ2UgdHJhaWxlcnMsIHNlcGFyYXRlZFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgbmV3bGluZXMgYW5kIHVuZm9sZGVkIChpLmUuIHByb3Blcmx5XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgYW5kIG9uZSB0cmFpbGVyIHBlciBsaW5lKS5cblxuICAgIGNvbnN0IGRlbGltaXRlciA9ICcxRic7XG4gICAgY29uc3QgZGVsaW1pdGVyU3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChkZWxpbWl0ZXIsIDE2KSk7XG4gICAgY29uc3QgZmllbGRzID0gWyclYW4nLCAnJWFlJywgJyVjbicsICclY2UnLCAnJSh0cmFpbGVyczp1bmZvbGQsb25seSknXTtcbiAgICBjb25zdCBmb3JtYXQgPSBmaWVsZHMuam9pbihgJXgke2RlbGltaXRlcn1gKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoW1xuICAgICAgICAnbG9nJywgYC0tZm9ybWF0PSR7Zm9ybWF0fWAsICcteicsICctbicsIG1heCwgcmVmLCAnLS0nLFxuICAgICAgXSk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQuc3BsaXQoJ1xcMCcpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgbGluZSkgPT4ge1xuICAgICAgICAgIGlmIChsaW5lLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYWNjOyB9XG5cbiAgICAgICAgICBjb25zdCBbYW4sIGFlLCBjbiwgY2UsIHRyYWlsZXJzXSA9IGxpbmUuc3BsaXQoZGVsaW1pdGVyU3RyaW5nKTtcbiAgICAgICAgICB0cmFpbGVyc1xuICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgLm1hcCh0cmFpbGVyID0+IHRyYWlsZXIubWF0Y2goQ09fQVVUSE9SX1JFR0VYKSlcbiAgICAgICAgICAgIC5maWx0ZXIobWF0Y2ggPT4gbWF0Y2ggIT09IG51bGwpXG4gICAgICAgICAgICAuZm9yRWFjaCgoW18sIG5hbWUsIGVtYWlsXSkgPT4geyBhY2NbZW1haWxdID0gbmFtZTsgfSk7XG5cbiAgICAgICAgICBhY2NbYWVdID0gYW47XG4gICAgICAgICAgYWNjW2NlXSA9IGNuO1xuXG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKC91bmtub3duIHJldmlzaW9uLy50ZXN0KGVyci5zdGRFcnIpIHx8IC9iYWQgcmV2aXNpb24gJ0hFQUQnLy50ZXN0KGVyci5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtZXJnZVRyYWlsZXJzKGNvbW1pdE1lc3NhZ2UsIHRyYWlsZXJzKSB7XG4gICAgY29uc3QgYXJncyA9IFsnaW50ZXJwcmV0LXRyYWlsZXJzJ107XG4gICAgZm9yIChjb25zdCB0cmFpbGVyIG9mIHRyYWlsZXJzKSB7XG4gICAgICBhcmdzLnB1c2goJy0tdHJhaWxlcicsIGAke3RyYWlsZXIudG9rZW59PSR7dHJhaWxlci52YWx1ZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7c3RkaW46IGNvbW1pdE1lc3NhZ2V9KTtcbiAgfVxuXG4gIHJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3Nob3cnLCBgOiR7dG9HaXRQYXRoU2VwKGZpbGVQYXRoKX1gXSk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VcbiAgICovXG4gIG1lcmdlKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5ncGdFeGVjKFsnbWVyZ2UnLCBicmFuY2hOYW1lXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBpc01lcmdpbmcoZG90R2l0RGlyKSB7XG4gICAgcmV0dXJuIGZpbGVFeGlzdHMocGF0aC5qb2luKGRvdEdpdERpciwgJ01FUkdFX0hFQUQnKSkuY2F0Y2goKCkgPT4gZmFsc2UpO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnbWVyZ2UnLCAnLS1hYm9ydCddLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGNoZWNrb3V0U2lkZShzaWRlLCBwYXRocykge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leGVjKFsnY2hlY2tvdXQnLCBgLS0ke3NpZGV9YCwgLi4ucGF0aHMubWFwKHRvR2l0UGF0aFNlcCldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWJhc2VcbiAgICovXG4gIGFzeW5jIGlzUmViYXNpbmcoZG90R2l0RGlyKSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGZpbGVFeGlzdHMocGF0aC5qb2luKGRvdEdpdERpciwgJ3JlYmFzZS1tZXJnZScpKSxcbiAgICAgIGZpbGVFeGlzdHMocGF0aC5qb2luKGRvdEdpdERpciwgJ3JlYmFzZS1hcHBseScpKSxcbiAgICBdKTtcbiAgICByZXR1cm4gcmVzdWx0cy5zb21lKHIgPT4gcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3RlIGludGVyYWN0aW9uc1xuICAgKi9cbiAgY2xvbmUocmVtb3RlVXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydjbG9uZSddO1xuICAgIGlmIChvcHRpb25zLm5vTG9jYWwpIHsgYXJncy5wdXNoKCctLW5vLWxvY2FsJyk7IH1cbiAgICBpZiAob3B0aW9ucy5iYXJlKSB7IGFyZ3MucHVzaCgnLS1iYXJlJyk7IH1cbiAgICBpZiAob3B0aW9ucy5yZWN1cnNpdmUpIHsgYXJncy5wdXNoKCctLXJlY3Vyc2l2ZScpOyB9XG4gICAgaWYgKG9wdGlvbnMuc291cmNlUmVtb3RlTmFtZSkgeyBhcmdzLnB1c2goJy0tb3JpZ2luJywgb3B0aW9ucy5yZW1vdGVOYW1lKTsgfVxuICAgIGFyZ3MucHVzaChyZW1vdGVVcmwsIHRoaXMud29ya2luZ0Rpcik7XG5cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBmZXRjaChyZW1vdGVOYW1lLCBicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2ZldGNoJywgcmVtb3RlTmFtZSwgYnJhbmNoTmFtZV0sIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBwdWxsKHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ3B1bGwnLCByZW1vdGVOYW1lLCBvcHRpb25zLnJlZlNwZWMgfHwgYnJhbmNoTmFtZV07XG4gICAgaWYgKG9wdGlvbnMuZmZPbmx5KSB7XG4gICAgICBhcmdzLnB1c2goJy0tZmYtb25seScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ncGdFeGVjKGFyZ3MsIHt1c2VHaXRQcm9tcHRTZXJ2ZXI6IHRydWUsIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBwdXNoKHJlbW90ZU5hbWUsIGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ3B1c2gnLCByZW1vdGVOYW1lIHx8ICdvcmlnaW4nLCBvcHRpb25zLnJlZlNwZWMgfHwgYHJlZnMvaGVhZHMvJHticmFuY2hOYW1lfWBdO1xuICAgIGlmIChvcHRpb25zLnNldFVwc3RyZWFtKSB7IGFyZ3MucHVzaCgnLS1zZXQtdXBzdHJlYW0nKTsgfVxuICAgIGlmIChvcHRpb25zLmZvcmNlKSB7IGFyZ3MucHVzaCgnLS1mb3JjZScpOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuZG8gT3BlcmF0aW9uc1xuICAgKi9cbiAgcmVzZXQodHlwZSwgcmV2aXNpb24gPSAnSEVBRCcpIHtcbiAgICBjb25zdCB2YWxpZFR5cGVzID0gWydzb2Z0J107XG4gICAgaWYgKCF2YWxpZFR5cGVzLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHlwZSAke3R5cGV9LiBNdXN0IGJlIG9uZSBvZjogJHt2YWxpZFR5cGVzLmpvaW4oJywgJyl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoWydyZXNldCcsIGAtLSR7dHlwZX1gLCByZXZpc2lvbl0pO1xuICB9XG5cbiAgZGVsZXRlUmVmKHJlZikge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWyd1cGRhdGUtcmVmJywgJy1kJywgcmVmXSk7XG4gIH1cblxuICAvKipcbiAgICogQnJhbmNoZXNcbiAgICovXG4gIGNoZWNrb3V0KGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2NoZWNrb3V0J107XG4gICAgaWYgKG9wdGlvbnMuY3JlYXRlTmV3KSB7XG4gICAgICBhcmdzLnB1c2goJy1iJyk7XG4gICAgfVxuICAgIGFyZ3MucHVzaChicmFuY2hOYW1lKTtcbiAgICBpZiAob3B0aW9ucy5zdGFydFBvaW50KSB7XG4gICAgICBpZiAob3B0aW9ucy50cmFjaykgeyBhcmdzLnB1c2goJy0tdHJhY2snKTsgfVxuICAgICAgYXJncy5wdXNoKG9wdGlvbnMuc3RhcnRQb2ludCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEJyYW5jaGVzKCkge1xuICAgIGNvbnN0IGZvcm1hdCA9IFtcbiAgICAgICclKG9iamVjdG5hbWUpJywgJyUoSEVBRCknLCAnJShyZWZuYW1lOnNob3J0KScsXG4gICAgICAnJSh1cHN0cmVhbSknLCAnJSh1cHN0cmVhbTpyZW1vdGVuYW1lKScsICclKHVwc3RyZWFtOnJlbW90ZXJlZiknLFxuICAgICAgJyUocHVzaCknLCAnJShwdXNoOnJlbW90ZW5hbWUpJywgJyUocHVzaDpyZW1vdGVyZWYpJyxcbiAgICBdLmpvaW4oJyUwMCcpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFsnZm9yLWVhY2gtcmVmJywgYC0tZm9ybWF0PSR7Zm9ybWF0fWAsICdyZWZzL2hlYWRzLyoqJ10pO1xuICAgIHJldHVybiBvdXRwdXQudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5tYXAobGluZSA9PiB7XG4gICAgICBjb25zdCBbXG4gICAgICAgIHNoYSwgaGVhZCwgbmFtZSxcbiAgICAgICAgdXBzdHJlYW1UcmFja2luZ1JlZiwgdXBzdHJlYW1SZW1vdGVOYW1lLCB1cHN0cmVhbVJlbW90ZVJlZixcbiAgICAgICAgcHVzaFRyYWNraW5nUmVmLCBwdXNoUmVtb3RlTmFtZSwgcHVzaFJlbW90ZVJlZixcbiAgICAgIF0gPSBsaW5lLnNwbGl0KCdcXDAnKTtcblxuICAgICAgY29uc3QgYnJhbmNoID0ge25hbWUsIHNoYSwgaGVhZDogaGVhZCA9PT0gJyonfTtcbiAgICAgIGlmICh1cHN0cmVhbVRyYWNraW5nUmVmIHx8IHVwc3RyZWFtUmVtb3RlTmFtZSB8fCB1cHN0cmVhbVJlbW90ZVJlZikge1xuICAgICAgICBicmFuY2gudXBzdHJlYW0gPSB7XG4gICAgICAgICAgdHJhY2tpbmdSZWY6IHVwc3RyZWFtVHJhY2tpbmdSZWYsXG4gICAgICAgICAgcmVtb3RlTmFtZTogdXBzdHJlYW1SZW1vdGVOYW1lLFxuICAgICAgICAgIHJlbW90ZVJlZjogdXBzdHJlYW1SZW1vdGVSZWYsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoYnJhbmNoLnVwc3RyZWFtIHx8IHB1c2hUcmFja2luZ1JlZiB8fCBwdXNoUmVtb3RlTmFtZSB8fCBwdXNoUmVtb3RlUmVmKSB7XG4gICAgICAgIGJyYW5jaC5wdXNoID0ge1xuICAgICAgICAgIHRyYWNraW5nUmVmOiBwdXNoVHJhY2tpbmdSZWYsXG4gICAgICAgICAgcmVtb3RlTmFtZTogcHVzaFJlbW90ZU5hbWUgfHwgKGJyYW5jaC51cHN0cmVhbSAmJiBicmFuY2gudXBzdHJlYW0ucmVtb3RlTmFtZSksXG4gICAgICAgICAgcmVtb3RlUmVmOiBwdXNoUmVtb3RlUmVmIHx8IChicmFuY2gudXBzdHJlYW0gJiYgYnJhbmNoLnVwc3RyZWFtLnJlbW90ZVJlZiksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYnJhbmNoO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0QnJhbmNoZXNXaXRoQ29tbWl0KHNoYSwgb3B0aW9uID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydicmFuY2gnLCAnLS1mb3JtYXQ9JShyZWZuYW1lKScsICctLWNvbnRhaW5zJywgc2hhXTtcbiAgICBpZiAob3B0aW9uLnNob3dMb2NhbCAmJiBvcHRpb24uc2hvd1JlbW90ZSkge1xuICAgICAgYXJncy5zcGxpY2UoMSwgMCwgJy0tYWxsJyk7XG4gICAgfSBlbHNlIGlmIChvcHRpb24uc2hvd1JlbW90ZSkge1xuICAgICAgYXJncy5zcGxpY2UoMSwgMCwgJy0tcmVtb3RlcycpO1xuICAgIH1cbiAgICBpZiAob3B0aW9uLnBhdHRlcm4pIHtcbiAgICAgIGFyZ3MucHVzaChvcHRpb24ucGF0dGVybik7XG4gICAgfVxuICAgIHJldHVybiAoYXdhaXQgdGhpcy5leGVjKGFyZ3MpKS50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpO1xuICB9XG5cbiAgY2hlY2tvdXRGaWxlcyhwYXRocywgcmV2aXNpb24pIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgYXJncyA9IFsnY2hlY2tvdXQnXTtcbiAgICBpZiAocmV2aXNpb24pIHsgYXJncy5wdXNoKHJldmlzaW9uKTsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncy5jb25jYXQoJy0tJywgcGF0aHMubWFwKHRvR2l0UGF0aFNlcCkpLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGRlc2NyaWJlSGVhZCgpIHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZXhlYyhbJ2Rlc2NyaWJlJywgJy0tY29udGFpbnMnLCAnLS1hbGwnLCAnLS1hbHdheXMnLCAnSEVBRCddKSkudHJpbSgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q29uZmlnKG9wdGlvbiwge2xvY2FsfSA9IHt9KSB7XG4gICAgbGV0IG91dHB1dDtcbiAgICB0cnkge1xuICAgICAgbGV0IGFyZ3MgPSBbJ2NvbmZpZyddO1xuICAgICAgaWYgKGxvY2FsKSB7IGFyZ3MucHVzaCgnLS1sb2NhbCcpOyB9XG4gICAgICBhcmdzID0gYXJncy5jb25jYXQob3B0aW9uKTtcbiAgICAgIG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gMSB8fCBlcnIuY29kZSA9PT0gMTI4KSB7XG4gICAgICAgIC8vIE5vIG1hdGNoaW5nIGNvbmZpZyBmb3VuZCBPUiAtLWxvY2FsIGNhbiBvbmx5IGJlIHVzZWQgaW5zaWRlIGEgZ2l0IHJlcG9zaXRvcnlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dC50cmltKCk7XG4gIH1cblxuICBzZXRDb25maWcob3B0aW9uLCB2YWx1ZSwge3JlcGxhY2VBbGwsIGdsb2JhbH0gPSB7fSkge1xuICAgIGxldCBhcmdzID0gWydjb25maWcnXTtcbiAgICBpZiAocmVwbGFjZUFsbCkgeyBhcmdzLnB1c2goJy0tcmVwbGFjZS1hbGwnKTsgfVxuICAgIGlmIChnbG9iYWwpIHsgYXJncy5wdXNoKCctLWdsb2JhbCcpOyB9XG4gICAgYXJncyA9IGFyZ3MuY29uY2F0KG9wdGlvbiwgdmFsdWUpO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICB1bnNldENvbmZpZyhvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnY29uZmlnJywgJy0tdW5zZXQnLCBvcHRpb25dLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlbW90ZXMoKSB7XG4gICAgbGV0IG91dHB1dCA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKFsnLS1nZXQtcmVnZXhwJywgJ15yZW1vdGVcXFxcLi4qXFxcXC51cmwkJ10sIHtsb2NhbDogdHJ1ZX0pO1xuICAgIGlmIChvdXRwdXQpIHtcbiAgICAgIG91dHB1dCA9IG91dHB1dC50cmltKCk7XG4gICAgICBpZiAoIW91dHB1dC5sZW5ndGgpIHsgcmV0dXJuIFtdOyB9XG4gICAgICByZXR1cm4gb3V0cHV0LnNwbGl0KCdcXG4nKS5tYXAobGluZSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXnJlbW90ZVxcLiguKilcXC51cmwgKC4qKSQvKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBtYXRjaFsxXSxcbiAgICAgICAgICB1cmw6IG1hdGNoWzJdLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH1cblxuICBhZGRSZW1vdGUobmFtZSwgdXJsKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3JlbW90ZScsICdhZGQnLCBuYW1lLCB1cmxdKTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUJsb2Ioe2ZpbGVQYXRoLCBzdGRpbn0gPSB7fSkge1xuICAgIGxldCBvdXRwdXQ7XG4gICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBvdXRwdXQgPSAoYXdhaXQgdGhpcy5leGVjKFsnaGFzaC1vYmplY3QnLCAnLXcnLCBmaWxlUGF0aF0sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pKS50cmltKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLnN0ZEVyciAmJiBlLnN0ZEVyci5tYXRjaCgvZmF0YWw6IENhbm5vdCBvcGVuIC4qOiBObyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5LykpIHtcbiAgICAgICAgICBvdXRwdXQgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0ZGluKSB7XG4gICAgICBvdXRwdXQgPSAoYXdhaXQgdGhpcy5leGVjKFsnaGFzaC1vYmplY3QnLCAnLXcnLCAnLS1zdGRpbiddLCB7c3RkaW4sIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSkpLnRyaW0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHN1cHBseSBmaWxlIHBhdGggb3Igc3RkaW4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIGFzeW5jIGV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2NhdC1maWxlJywgJy1wJywgc2hhXSk7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKGFic0ZpbGVQYXRoLCBvdXRwdXQsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgcmV0dXJuIGFic0ZpbGVQYXRoO1xuICB9XG5cbiAgYXN5bmMgZ2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWMoWydjYXQtZmlsZScsICctcCcsIHNoYV0pO1xuICB9XG5cbiAgYXN5bmMgbWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnbWVyZ2UtZmlsZScsICctcCcsIG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCxcbiAgICAgICctTCcsICdjdXJyZW50JywgJy1MJywgJ2FmdGVyIGRpc2NhcmQnLCAnLUwnLCAnYmVmb3JlIGRpc2NhcmQnLFxuICAgIF07XG4gICAgbGV0IG91dHB1dDtcbiAgICBsZXQgY29uZmxpY3QgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgR2l0RXJyb3IgJiYgZS5jb2RlID09PSAxKSB7XG4gICAgICAgIG91dHB1dCA9IGUuc3RkT3V0O1xuICAgICAgICBjb25mbGljdCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEludGVycHJldCBhIHJlbGF0aXZlIHJlc3VsdFBhdGggYXMgcmVsYXRpdmUgdG8gdGhlIHJlcG9zaXRvcnkgd29ya2luZyBkaXJlY3RvcnkgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlXG4gICAgLy8gb3RoZXIgYXJndW1lbnRzLlxuICAgIGNvbnN0IHJlc29sdmVkUmVzdWx0UGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLndvcmtpbmdEaXIsIHJlc3VsdFBhdGgpO1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShyZXNvbHZlZFJlc3VsdFBhdGgsIG91dHB1dCwge2VuY29kaW5nOiAndXRmOCd9KTtcblxuICAgIHJldHVybiB7ZmlsZVBhdGg6IG91cnNQYXRoLCByZXN1bHRQYXRoLCBjb25mbGljdH07XG4gIH1cblxuICBhc3luYyB3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpIHtcbiAgICBjb25zdCBnaXRGaWxlUGF0aCA9IHRvR2l0UGF0aFNlcChmaWxlUGF0aCk7XG4gICAgY29uc3QgZmlsZU1vZGUgPSBhd2FpdCB0aGlzLmdldEZpbGVNb2RlKGZpbGVQYXRoKTtcbiAgICBsZXQgaW5kZXhJbmZvID0gYDAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMFxcdCR7Z2l0RmlsZVBhdGh9XFxuYDtcbiAgICBpZiAoY29tbW9uQmFzZVNoYSkgeyBpbmRleEluZm8gKz0gYCR7ZmlsZU1vZGV9ICR7Y29tbW9uQmFzZVNoYX0gMVxcdCR7Z2l0RmlsZVBhdGh9XFxuYDsgfVxuICAgIGlmIChvdXJzU2hhKSB7IGluZGV4SW5mbyArPSBgJHtmaWxlTW9kZX0gJHtvdXJzU2hhfSAyXFx0JHtnaXRGaWxlUGF0aH1cXG5gOyB9XG4gICAgaWYgKHRoZWlyc1NoYSkgeyBpbmRleEluZm8gKz0gYCR7ZmlsZU1vZGV9ICR7dGhlaXJzU2hhfSAzXFx0JHtnaXRGaWxlUGF0aH1cXG5gOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ3VwZGF0ZS1pbmRleCcsICctLWluZGV4LWluZm8nXSwge3N0ZGluOiBpbmRleEluZm8sIHdyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBnZXRGaWxlTW9kZShmaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2xzLWZpbGVzJywgJy0tc3RhZ2UnLCAnLS0nLCB0b0dpdFBhdGhTZXAoZmlsZVBhdGgpXSk7XG4gICAgaWYgKG91dHB1dCkge1xuICAgICAgcmV0dXJuIG91dHB1dC5zbGljZSgwLCA2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhlY3V0YWJsZSA9IGF3YWl0IGlzRmlsZUV4ZWN1dGFibGUocGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgZmlsZVBhdGgpKTtcbiAgICAgIGNvbnN0IHN5bWxpbmsgPSBhd2FpdCBpc0ZpbGVTeW1saW5rKHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIGZpbGVQYXRoKSk7XG4gICAgICBpZiAoc3ltbGluaykge1xuICAgICAgICByZXR1cm4gRmlsZS5tb2Rlcy5TWU1MSU5LO1xuICAgICAgfSBlbHNlIGlmIChleGVjdXRhYmxlKSB7XG4gICAgICAgIHJldHVybiBGaWxlLm1vZGVzLkVYRUNVVEFCTEU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gRmlsZS5tb2Rlcy5OT1JNQUw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNvbW1hbmRRdWV1ZS5kaXNwb3NlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRBZGRlZEZpbGVQYXRjaChmaWxlUGF0aCwgY29udGVudHMsIG1vZGUsIHJlYWxwYXRoKSB7XG4gIGNvbnN0IGh1bmtzID0gW107XG4gIGlmIChjb250ZW50cykge1xuICAgIGxldCBub05ld0xpbmU7XG4gICAgbGV0IGxpbmVzO1xuICAgIGlmIChtb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTkspIHtcbiAgICAgIG5vTmV3TGluZSA9IGZhbHNlO1xuICAgICAgbGluZXMgPSBbYCske3RvR2l0UGF0aFNlcChyZWFscGF0aCl9YCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZSddO1xuICAgIH0gZWxzZSB7XG4gICAgICBub05ld0xpbmUgPSBjb250ZW50c1tjb250ZW50cy5sZW5ndGggLSAxXSAhPT0gJ1xcbic7XG4gICAgICBsaW5lcyA9IGNvbnRlbnRzLnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubWFwKGxpbmUgPT4gYCske2xpbmV9YCk7XG4gICAgfVxuICAgIGlmIChub05ld0xpbmUpIHsgbGluZXMucHVzaCgnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJyk7IH1cbiAgICBodW5rcy5wdXNoKHtcbiAgICAgIGxpbmVzLFxuICAgICAgb2xkU3RhcnRMaW5lOiAwLFxuICAgICAgb2xkTGluZUNvdW50OiAwLFxuICAgICAgbmV3U3RhcnRMaW5lOiAxLFxuICAgICAgaGVhZGluZzogJycsXG4gICAgICBuZXdMaW5lQ291bnQ6IG5vTmV3TGluZSA/IGxpbmVzLmxlbmd0aCAtIDEgOiBsaW5lcy5sZW5ndGgsXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvbGRQYXRoOiBudWxsLFxuICAgIG5ld1BhdGg6IHRvTmF0aXZlUGF0aFNlcChmaWxlUGF0aCksXG4gICAgb2xkTW9kZTogbnVsbCxcbiAgICBuZXdNb2RlOiBtb2RlLFxuICAgIHN0YXR1czogJ2FkZGVkJyxcbiAgICBodW5rcyxcbiAgfTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMs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