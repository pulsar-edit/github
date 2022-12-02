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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

} // ignored for the purposes of usage metrics tracking because they're noisy


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
  } // Execute a command and read the output using the embedded Git environment


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
        env.ATOM_GITHUB_KEYTAR_STRATEGY_PATH = (0, _helpers.getSharedModulePath)('keytar-strategy'); // "ssh" won't respect SSH_ASKPASS unless:
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
            await cancel(); // On Windows, the SSH_ASKPASS handler is executed as a non-child process, so the bin\git-askpass-atom.sh
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
    let msg; // if amending and no new message is passed, use last commit's message. Ensure that we don't
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
    } // if commit template is used, strip commented lines from commit
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
    } // Determine the cleanup mode.


    if (verbatim) {
      args.push('--cleanup=verbatim');
    } else {
      const configured = await this.getConfig('commit.cleanup');
      const mode = configured && configured !== 'default' ? configured : 'strip';
      args.push(`--cleanup=${mode}`);
    } // add co-author commit trailers if necessary


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
    }); // Ensure that message ends with newline for git-interpret trailers to work

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
    }, options); // https://git-scm.com/docs/git-log#_pretty_formats
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
    }, options); // https://git-scm.com/docs/git-log#_pretty_formats
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
    } // Interpret a relative resultPath as relative to the repository working directory for consistency with the
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5LmpzIl0sIm5hbWVzIjpbIk1BWF9TVEFUVVNfT1VUUFVUX0xFTkdUSCIsImhlYWRsZXNzIiwiZXhlY1BhdGhQcm9taXNlIiwiR2l0RXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIiwibWVzc2FnZSIsInN0YWNrIiwiTGFyZ2VSZXBvRXJyb3IiLCJJR05PUkVEX0dJVF9DT01NQU5EUyIsIkRJU0FCTEVfQ09MT1JfRkxBR1MiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwidW5zaGlmdCIsIkVYUEFORF9USUxERV9SRUdFWCIsIlJlZ0V4cCIsIkdpdFNoZWxsT3V0U3RyYXRlZ3kiLCJ3b3JraW5nRGlyIiwib3B0aW9ucyIsInF1ZXVlIiwiY29tbWFuZFF1ZXVlIiwicGFyYWxsZWxpc20iLCJNYXRoIiwibWF4Iiwib3MiLCJjcHVzIiwibGVuZ3RoIiwiQXN5bmNRdWV1ZSIsInByb21wdCIsInF1ZXJ5IiwiUHJvbWlzZSIsInJlamVjdCIsIndvcmtlck1hbmFnZXIiLCJyZW1vdGUiLCJnZXRDdXJyZW50V2luZG93IiwiaXNWaXNpYmxlIiwic2V0UHJvbXB0Q2FsbGJhY2siLCJleGVjIiwiYXJncyIsImRlZmF1bHRFeGVjQXJncyIsInN0ZGluIiwidXNlR2l0UHJvbXB0U2VydmVyIiwidXNlR3BnV3JhcHBlciIsInVzZUdwZ0F0b21Qcm9tcHQiLCJ3cml0ZU9wZXJhdGlvbiIsImNvbW1hbmROYW1lIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJkaWFnbm9zdGljc0VuYWJsZWQiLCJwcm9jZXNzIiwiZW52IiwiQVRPTV9HSVRIVUJfR0lUX0RJQUdOT1NUSUNTIiwiYXRvbSIsImNvbmZpZyIsImdldCIsImZvcm1hdHRlZEFyZ3MiLCJqb2luIiwidGltaW5nTWFya2VyIiwiR2l0VGltaW5nc1ZpZXciLCJnZW5lcmF0ZU1hcmtlciIsIm1hcmsiLCJyZXNvbHZlIiwiY2hpbGRQcm9jZXNzIiwiZXJyb3IiLCJzdGRvdXQiLCJ0cmltIiwiZXhlY1BhdGgiLCJwdXNoIiwiZ2l0UHJvbXB0U2VydmVyIiwicGF0aFBhcnRzIiwiUEFUSCIsIkdJVF9URVJNSU5BTF9QUk9NUFQiLCJHSVRfT1BUSU9OQUxfTE9DS1MiLCJwYXRoIiwiZGVsaW1pdGVyIiwiZ2l0VGVtcERpciIsIkdpdFRlbXBEaXIiLCJlbnN1cmUiLCJnZXRHcGdXcmFwcGVyU2giLCJHaXRQcm9tcHRTZXJ2ZXIiLCJzdGFydCIsIkFUT01fR0lUSFVCX1RNUCIsImdldFJvb3RQYXRoIiwiQVRPTV9HSVRIVUJfQVNLUEFTU19QQVRIIiwiZ2V0QXNrUGFzc0pzIiwiQVRPTV9HSVRIVUJfQ1JFREVOVElBTF9QQVRIIiwiZ2V0Q3JlZGVudGlhbEhlbHBlckpzIiwiQVRPTV9HSVRIVUJfRUxFQ1RST05fUEFUSCIsIkFUT01fR0lUSFVCX1NPQ0tfQUREUiIsImdldEFkZHJlc3MiLCJBVE9NX0dJVEhVQl9XT1JLRElSX1BBVEgiLCJBVE9NX0dJVEhVQl9EVUdJVEVfUEFUSCIsIkFUT01fR0lUSFVCX0tFWVRBUl9TVFJBVEVHWV9QQVRIIiwiRElTUExBWSIsIkFUT01fR0lUSFVCX09SSUdJTkFMX1BBVEgiLCJBVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfQVNLUEFTUyIsIkdJVF9BU0tQQVNTIiwiQVRPTV9HSVRIVUJfT1JJR0lOQUxfU1NIX0FTS1BBU1MiLCJTU0hfQVNLUEFTUyIsIkFUT01fR0lUSFVCX09SSUdJTkFMX0dJVF9TU0hfQ09NTUFORCIsIkdJVF9TU0hfQ09NTUFORCIsIkFUT01fR0lUSFVCX1NQRUNfTU9ERSIsImluU3BlY01vZGUiLCJnZXRBc2tQYXNzU2giLCJwbGF0Zm9ybSIsImdldFNzaFdyYXBwZXJTaCIsIkdJVF9TU0giLCJjcmVkZW50aWFsSGVscGVyU2giLCJnZXRDcmVkZW50aWFsSGVscGVyU2giLCJBVE9NX0dJVEhVQl9HUEdfUFJPTVBUIiwiR0lUX1RSQUNFIiwiR0lUX1RSQUNFX0NVUkwiLCJvcHRzIiwic3RkaW5FbmNvZGluZyIsIlBSSU5UX0dJVF9USU1FUyIsImNvbnNvbGUiLCJ0aW1lIiwiYmVmb3JlUnVuIiwibmV3QXJnc09wdHMiLCJwcm9taXNlIiwiY2FuY2VsIiwiZXhlY3V0ZUdpdENvbW1hbmQiLCJleHBlY3RDYW5jZWwiLCJhZGQiLCJvbkRpZENhbmNlbCIsImhhbmRsZXJQaWQiLCJyZXNvbHZlS2lsbCIsInJlamVjdEtpbGwiLCJyZXF1aXJlIiwiZXJyIiwic3RkZXJyIiwiZXhpdENvZGUiLCJzaWduYWwiLCJ0aW1pbmciLCJjYXRjaCIsImV4ZWNUaW1lIiwic3Bhd25UaW1lIiwiaXBjVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiZmluYWxpemUiLCJ0aW1lRW5kIiwidGVybWluYXRlIiwiZGlzcG9zZSIsImV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzIiwicmF3IiwicmVwbGFjZSIsInN1bW1hcnkiLCJ1bmRlZmluZWQiLCJsb2ciLCJoZWFkZXJTdHlsZSIsImdyb3VwQ29sbGFwc2VkIiwidXRpbCIsImluc3BlY3QiLCJicmVha0xlbmd0aCIsIkluZmluaXR5IiwiZ3JvdXBFbmQiLCJjb2RlIiwic3RkRXJyIiwic3RkT3V0IiwiY29tbWFuZCIsImluY2x1ZGVzIiwicGFyYWxsZWwiLCJncGdFeGVjIiwic2xpY2UiLCJlIiwidGVzdCIsIm1hcmtlciIsIkFUT01fR0lUSFVCX0lOTElORV9HSVRfRVhFQyIsIldvcmtlck1hbmFnZXIiLCJnZXRJbnN0YW5jZSIsImlzUmVhZHkiLCJjaGlsZFBpZCIsInByb2Nlc3NDYWxsYmFjayIsImNoaWxkIiwicGlkIiwib24iLCJHaXRQcm9jZXNzIiwicmVxdWVzdCIsInJlc29sdmVEb3RHaXREaXIiLCJmcyIsInN0YXQiLCJvdXRwdXQiLCJkb3RHaXREaXIiLCJpbml0Iiwic3RhZ2VGaWxlcyIsInBhdGhzIiwiY29uY2F0IiwibWFwIiwidG9HaXRQYXRoU2VwIiwiZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZVBhdGgiLCJnZXRDb25maWciLCJob21lRGlyIiwiaG9tZWRpciIsIl8iLCJ1c2VyIiwiZGlybmFtZSIsImlzQWJzb2x1dGUiLCJyZWFkRmlsZSIsImVuY29kaW5nIiwidW5zdGFnZUZpbGVzIiwiY29tbWl0Iiwic3RhZ2VGaWxlTW9kZUNoYW5nZSIsImZpbGVuYW1lIiwibmV3TW9kZSIsImluZGV4UmVhZFByb21pc2UiLCJkZXRlcm1pbmVBcmdzIiwiaW5kZXgiLCJvaWQiLCJzdWJzdHIiLCJzdGFnZUZpbGVTeW1saW5rQ2hhbmdlIiwiYXBwbHlQYXRjaCIsInBhdGNoIiwic3BsaWNlIiwicmF3TWVzc2FnZSIsImFsbG93RW1wdHkiLCJhbWVuZCIsImNvQXV0aG9ycyIsInZlcmJhdGltIiwibXNnIiwidW5ib3JuUmVmIiwibWVzc2FnZUJvZHkiLCJtZXNzYWdlU3ViamVjdCIsImdldEhlYWRDb21taXQiLCJ0ZW1wbGF0ZSIsImNvbW1lbnRDaGFyIiwic3BsaXQiLCJmaWx0ZXIiLCJsaW5lIiwic3RhcnRzV2l0aCIsImNvbmZpZ3VyZWQiLCJtb2RlIiwiYWRkQ29BdXRob3JzVG9NZXNzYWdlIiwidHJhaWxlcnMiLCJhdXRob3IiLCJ0b2tlbiIsInZhbHVlIiwibmFtZSIsImVtYWlsIiwibWVyZ2VUcmFpbGVycyIsImdldFN0YXR1c0J1bmRsZSIsInJlc3VsdHMiLCJlbnRyeVR5cGUiLCJBcnJheSIsImlzQXJyYXkiLCJ1cGRhdGVOYXRpdmVQYXRoU2VwRm9yRW50cmllcyIsImVudHJpZXMiLCJmb3JFYWNoIiwiZW50cnkiLCJmaWxlUGF0aCIsIm9yaWdGaWxlUGF0aCIsImRpZmZGaWxlU3RhdHVzIiwic3RhZ2VkIiwidGFyZ2V0Iiwic3RhdHVzTWFwIiwiQSIsIk0iLCJEIiwiVSIsImZpbGVTdGF0dXNlcyIsIkxJTkVfRU5ESU5HX1JFR0VYIiwic3RhdHVzIiwicmF3RmlsZVBhdGgiLCJ1bnRyYWNrZWQiLCJnZXRVbnRyYWNrZWRGaWxlcyIsInRvTmF0aXZlUGF0aFNlcCIsImdldERpZmZzRm9yRmlsZVBhdGgiLCJiYXNlQ29tbWl0IiwicmF3RGlmZnMiLCJyYXdEaWZmIiwiaSIsIm9sZFBhdGgiLCJuZXdQYXRoIiwiYWJzUGF0aCIsImV4ZWN1dGFibGUiLCJzeW1saW5rIiwiY29udGVudHMiLCJiaW5hcnkiLCJyZWFscGF0aCIsIkZpbGUiLCJtb2RlcyIsIkVYRUNVVEFCTEUiLCJTWU1MSU5LIiwiTk9STUFMIiwiYnVpbGRBZGRlZEZpbGVQYXRjaCIsImdldFN0YWdlZENoYW5nZXNQYXRjaCIsImRpZmZzIiwiZGlmZiIsImdldENvbW1pdCIsInJlZiIsImdldENvbW1pdHMiLCJpbmNsdWRlVW5ib3JuIiwiaGVhZENvbW1pdCIsImluY2x1ZGVQYXRjaCIsInNoYSIsImZpZWxkcyIsImNvbW1pdHMiLCJib2R5IiwiQXV0aG9yIiwiYXV0aG9yRGF0ZSIsInBhcnNlSW50IiwiZ2V0QXV0aG9ycyIsImRlbGltaXRlclN0cmluZyIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImZvcm1hdCIsImFuIiwiYWUiLCJjbiIsImNlIiwidHJhaWxlciIsIm1hdGNoIiwiQ09fQVVUSE9SX1JFR0VYIiwiY29tbWl0TWVzc2FnZSIsInJlYWRGaWxlRnJvbUluZGV4IiwibWVyZ2UiLCJicmFuY2hOYW1lIiwiaXNNZXJnaW5nIiwiYWJvcnRNZXJnZSIsImNoZWNrb3V0U2lkZSIsInNpZGUiLCJpc1JlYmFzaW5nIiwiYWxsIiwic29tZSIsInIiLCJjbG9uZSIsInJlbW90ZVVybCIsIm5vTG9jYWwiLCJiYXJlIiwicmVjdXJzaXZlIiwic291cmNlUmVtb3RlTmFtZSIsInJlbW90ZU5hbWUiLCJmZXRjaCIsInB1bGwiLCJyZWZTcGVjIiwiZmZPbmx5Iiwic2V0VXBzdHJlYW0iLCJmb3JjZSIsInJlc2V0IiwicmV2aXNpb24iLCJ2YWxpZFR5cGVzIiwiZGVsZXRlUmVmIiwiY2hlY2tvdXQiLCJjcmVhdGVOZXciLCJzdGFydFBvaW50IiwidHJhY2siLCJnZXRCcmFuY2hlcyIsImhlYWQiLCJ1cHN0cmVhbVRyYWNraW5nUmVmIiwidXBzdHJlYW1SZW1vdGVOYW1lIiwidXBzdHJlYW1SZW1vdGVSZWYiLCJwdXNoVHJhY2tpbmdSZWYiLCJwdXNoUmVtb3RlTmFtZSIsInB1c2hSZW1vdGVSZWYiLCJicmFuY2giLCJ1cHN0cmVhbSIsInRyYWNraW5nUmVmIiwicmVtb3RlUmVmIiwiZ2V0QnJhbmNoZXNXaXRoQ29tbWl0Iiwib3B0aW9uIiwic2hvd0xvY2FsIiwic2hvd1JlbW90ZSIsInBhdHRlcm4iLCJjaGVja291dEZpbGVzIiwiZGVzY3JpYmVIZWFkIiwibG9jYWwiLCJzZXRDb25maWciLCJyZXBsYWNlQWxsIiwiZ2xvYmFsIiwidW5zZXRDb25maWciLCJnZXRSZW1vdGVzIiwidXJsIiwiYWRkUmVtb3RlIiwiY3JlYXRlQmxvYiIsImV4cGFuZEJsb2JUb0ZpbGUiLCJhYnNGaWxlUGF0aCIsIndyaXRlRmlsZSIsImdldEJsb2JDb250ZW50cyIsIm1lcmdlRmlsZSIsIm91cnNQYXRoIiwiY29tbW9uQmFzZVBhdGgiLCJ0aGVpcnNQYXRoIiwicmVzdWx0UGF0aCIsImNvbmZsaWN0IiwicmVzb2x2ZWRSZXN1bHRQYXRoIiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsImNvbW1vbkJhc2VTaGEiLCJvdXJzU2hhIiwidGhlaXJzU2hhIiwiZ2l0RmlsZVBhdGgiLCJmaWxlTW9kZSIsImdldEZpbGVNb2RlIiwiaW5kZXhJbmZvIiwiZGVzdHJveSIsImh1bmtzIiwibm9OZXdMaW5lIiwibGluZXMiLCJvbGRTdGFydExpbmUiLCJvbGRMaW5lQ291bnQiLCJuZXdTdGFydExpbmUiLCJoZWFkaW5nIiwibmV3TGluZUNvdW50Iiwib2xkTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUtBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsd0JBQXdCLEdBQUcsT0FBTyxJQUFQLEdBQWMsRUFBL0M7QUFFQSxJ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QUFOLEdBQWUsQ0FBbEIsR0FBc0JtWCxLQUFLLENBQUNuWDtBQU4xQyxLQUFYO0FBUUQ7O0FBQ0QsU0FBTztBQUNMc1AsSUFBQUEsT0FBTyxFQUFFLElBREo7QUFFTEMsSUFBQUEsT0FBTyxFQUFFLDhCQUFnQnZCLFFBQWhCLENBRko7QUFHTHlKLElBQUFBLE9BQU8sRUFBRSxJQUhKO0FBSUx0TSxJQUFBQSxPQUFPLEVBQUUyQixJQUpKO0FBS0w4QixJQUFBQSxNQUFNLEVBQUUsT0FMSDtBQU1McUksSUFBQUE7QUFOSyxHQUFQO0FBUUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHtHaXRQcm9jZXNzfSBmcm9tICdkdWdpdGUnO1xuaW1wb3J0IHtwYXJzZSBhcyBwYXJzZURpZmZ9IGZyb20gJ3doYXQtdGhlLWRpZmYnO1xuaW1wb3J0IHtwYXJzZSBhcyBwYXJzZVN0YXR1c30gZnJvbSAnd2hhdC10aGUtc3RhdHVzJztcblxuaW1wb3J0IEdpdFByb21wdFNlcnZlciBmcm9tICcuL2dpdC1wcm9tcHQtc2VydmVyJztcbmltcG9ydCBHaXRUZW1wRGlyIGZyb20gJy4vZ2l0LXRlbXAtZGlyJztcbmltcG9ydCBBc3luY1F1ZXVlIGZyb20gJy4vYXN5bmMtcXVldWUnO1xuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyfSBmcm9tICcuL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7XG4gIGdldER1Z2l0ZVBhdGgsIGdldFNoYXJlZE1vZHVsZVBhdGgsIGdldEF0b21IZWxwZXJQYXRoLFxuICBleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSwgZmlsZUV4aXN0cywgaXNGaWxlRXhlY3V0YWJsZSwgaXNGaWxlU3ltbGluaywgaXNCaW5hcnksXG4gIG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgsIHRvTmF0aXZlUGF0aFNlcCwgdG9HaXRQYXRoU2VwLCBMSU5FX0VORElOR19SRUdFWCwgQ09fQVVUSE9SX1JFR0VYLFxufSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IEdpdFRpbWluZ3NWaWV3IGZyb20gJy4vdmlld3MvZ2l0LXRpbWluZ3Mtdmlldyc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL21vZGVscy9wYXRjaC9maWxlJztcbmltcG9ydCBXb3JrZXJNYW5hZ2VyIGZyb20gJy4vd29ya2VyLW1hbmFnZXInO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuL21vZGVscy9hdXRob3InO1xuXG5jb25zdCBNQVhfU1RBVFVTX09VVFBVVF9MRU5HVEggPSAxMDI0ICogMTAyNCAqIDEwO1xuXG5sZXQgaGVhZGxlc3MgPSBudWxsO1xubGV0IGV4ZWNQYXRoUHJvbWlzZSA9IG51bGw7XG5cbmV4cG9ydCBjbGFzcyBHaXRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMYXJnZVJlcG9FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICB9XG59XG5cbi8vIGlnbm9yZWQgZm9yIHRoZSBwdXJwb3NlcyBvZiB1c2FnZSBtZXRyaWNzIHRyYWNraW5nIGJlY2F1c2UgdGhleSdyZSBub2lzeVxuY29uc3QgSUdOT1JFRF9HSVRfQ09NTUFORFMgPSBbJ2NhdC1maWxlJywgJ2NvbmZpZycsICdkaWZmJywgJ2Zvci1lYWNoLXJlZicsICdsb2cnLCAncmV2LXBhcnNlJywgJ3N0YXR1cyddO1xuXG5jb25zdCBESVNBQkxFX0NPTE9SX0ZMQUdTID0gW1xuICAnYnJhbmNoJywgJ2RpZmYnLCAnc2hvd0JyYW5jaCcsICdzdGF0dXMnLCAndWknLFxuXS5yZWR1Y2UoKGFjYywgdHlwZSkgPT4ge1xuICBhY2MudW5zaGlmdCgnLWMnLCBgY29sb3IuJHt0eXBlfT1mYWxzZWApO1xuICByZXR1cm4gYWNjO1xufSwgW10pO1xuXG4vKipcbiAqIEV4cGFuZCBjb25maWcgcGF0aCBuYW1lIHBlclxuICogaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1jb25maWcjZ2l0LWNvbmZpZy1wYXRobmFtZVxuICogdGhpcyByZWdleCBhdHRlbXB0cyB0byBnZXQgdGhlIHNwZWNpZmllZCB1c2VyJ3MgaG9tZSBkaXJlY3RvcnlcbiAqIEV4OiBvbiBNYWMgfmt1eWNoYWNvLyBpcyBleHBhbmRlZCB0byB0aGUgc3BlY2lmaWVkIHVzZXLigJlzIGhvbWUgZGlyZWN0b3J5ICgvVXNlcnMva3V5Y2hhY28pXG4gKiBSZWdleCB0cmFuc2xhdGlvbjpcbiAqIF5+IGxpbmUgc3RhcnRzIHdpdGggdGlsZGVcbiAqIChbXlxcXFxcXFxcL10qKVtcXFxcXFxcXC9dIGNhcHR1cmVzIG5vbi1zbGFzaCBjaGFyYWN0ZXJzIGJlZm9yZSBmaXJzdCBzbGFzaFxuICovXG5jb25zdCBFWFBBTkRfVElMREVfUkVHRVggPSBuZXcgUmVnRXhwKCdefihbXlxcXFxcXFxcL10qKVtcXFxcXFxcXC9dJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFNoZWxsT3V0U3RyYXRlZ3kge1xuICBzdGF0aWMgZGVmYXVsdEV4ZWNBcmdzID0ge1xuICAgIHN0ZGluOiBudWxsLFxuICAgIHVzZUdpdFByb21wdFNlcnZlcjogZmFsc2UsXG4gICAgdXNlR3BnV3JhcHBlcjogZmFsc2UsXG4gICAgdXNlR3BnQXRvbVByb21wdDogZmFsc2UsXG4gICAgd3JpdGVPcGVyYXRpb246IGZhbHNlLFxuICB9XG5cbiAgY29uc3RydWN0b3Iod29ya2luZ0Rpciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy53b3JraW5nRGlyID0gd29ya2luZ0RpcjtcbiAgICBpZiAob3B0aW9ucy5xdWV1ZSkge1xuICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBvcHRpb25zLnF1ZXVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYXJhbGxlbGlzbSA9IG9wdGlvbnMucGFyYWxsZWxpc20gfHwgTWF0aC5tYXgoMywgb3MuY3B1cygpLmxlbmd0aCk7XG4gICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IG5ldyBBc3luY1F1ZXVlKHtwYXJhbGxlbGlzbX0pO1xuICAgIH1cblxuICAgIHRoaXMucHJvbXB0ID0gb3B0aW9ucy5wcm9tcHQgfHwgKHF1ZXJ5ID0+IFByb21pc2UucmVqZWN0KCkpO1xuICAgIHRoaXMud29ya2VyTWFuYWdlciA9IG9wdGlvbnMud29ya2VyTWFuYWdlcjtcblxuICAgIGlmIChoZWFkbGVzcyA9PT0gbnVsbCkge1xuICAgICAgaGVhZGxlc3MgPSAhcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKS5pc1Zpc2libGUoKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBQcm92aWRlIGFuIGFzeW5jaHJvbm91cyBjYWxsYmFjayB0byBiZSB1c2VkIHRvIHJlcXVlc3QgaW5wdXQgZnJvbSB0aGUgdXNlciBmb3IgZ2l0IG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIGBwcm9tcHRgIG11c3QgYmUgYSBjYWxsYWJsZSB0aGF0IGFjY2VwdHMgYSBxdWVyeSBvYmplY3QgYHtwcm9tcHQsIGluY2x1ZGVVc2VybmFtZX1gIGFuZCByZXR1cm5zIGEgUHJvbWlzZVxuICAgKiB0aGF0IGVpdGhlciByZXNvbHZlcyB3aXRoIGEgcmVzdWx0IG9iamVjdCBge1t1c2VybmFtZV0sIHBhc3N3b3JkfWAgb3IgcmVqZWN0cyBvbiBjYW5jZWxsYXRpb24uXG4gICAqL1xuICBzZXRQcm9tcHRDYWxsYmFjayhwcm9tcHQpIHtcbiAgICB0aGlzLnByb21wdCA9IHByb21wdDtcbiAgfVxuXG4gIC8vIEV4ZWN1dGUgYSBjb21tYW5kIGFuZCByZWFkIHRoZSBvdXRwdXQgdXNpbmcgdGhlIGVtYmVkZGVkIEdpdCBlbnZpcm9ubWVudFxuICBhc3luYyBleGVjKGFyZ3MsIG9wdGlvbnMgPSBHaXRTaGVsbE91dFN0cmF0ZWd5LmRlZmF1bHRFeGVjQXJncykge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUsbm8tY29udHJvbC1yZWdleCAqL1xuICAgIGNvbnN0IHtzdGRpbiwgdXNlR2l0UHJvbXB0U2VydmVyLCB1c2VHcGdXcmFwcGVyLCB1c2VHcGdBdG9tUHJvbXB0LCB3cml0ZU9wZXJhdGlvbn0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGNvbW1hbmROYW1lID0gYXJnc1swXTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBjb25zdCBkaWFnbm9zdGljc0VuYWJsZWQgPSBwcm9jZXNzLmVudi5BVE9NX0dJVEhVQl9HSVRfRElBR05PU1RJQ1MgfHwgYXRvbS5jb25maWcuZ2V0KCdnaXRodWIuZ2l0RGlhZ25vc3RpY3MnKTtcblxuICAgIGNvbnN0IGZvcm1hdHRlZEFyZ3MgPSBgZ2l0ICR7YXJncy5qb2luKCcgJyl9IGluICR7dGhpcy53b3JraW5nRGlyfWA7XG4gICAgY29uc3QgdGltaW5nTWFya2VyID0gR2l0VGltaW5nc1ZpZXcuZ2VuZXJhdGVNYXJrZXIoYGdpdCAke2FyZ3Muam9pbignICcpfWApO1xuICAgIHRpbWluZ01hcmtlci5tYXJrKCdxdWV1ZWQnKTtcblxuICAgIGFyZ3MudW5zaGlmdCguLi5ESVNBQkxFX0NPTE9SX0ZMQUdTKTtcblxuICAgIGlmIChleGVjUGF0aFByb21pc2UgPT09IG51bGwpIHtcbiAgICAgIC8vIEF0dGVtcHQgdG8gY29sbGVjdCB0aGUgLS1leGVjLXBhdGggZnJvbSBhIG5hdGl2ZSBnaXQgaW5zdGFsbGF0aW9uLlxuICAgICAgZXhlY1BhdGhQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGNoaWxkUHJvY2Vzcy5leGVjKCdnaXQgLS1leGVjLXBhdGgnLCAoZXJyb3IsIHN0ZG91dCkgPT4ge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgLy8gT2ggd2VsbFxuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKHN0ZG91dC50cmltKCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBleGVjUGF0aCA9IGF3YWl0IGV4ZWNQYXRoUHJvbWlzZTtcblxuICAgIHJldHVybiB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKGFzeW5jICgpID0+IHtcbiAgICAgIHRpbWluZ01hcmtlci5tYXJrKCdwcmVwYXJlJyk7XG4gICAgICBsZXQgZ2l0UHJvbXB0U2VydmVyO1xuXG4gICAgICBjb25zdCBwYXRoUGFydHMgPSBbXTtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5QQVRIKSB7XG4gICAgICAgIHBhdGhQYXJ0cy5wdXNoKHByb2Nlc3MuZW52LlBBVEgpO1xuICAgICAgfVxuICAgICAgaWYgKGV4ZWNQYXRoKSB7XG4gICAgICAgIHBhdGhQYXJ0cy5wdXNoKGV4ZWNQYXRoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZW52ID0ge1xuICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgICAgR0lUX1RFUk1JTkFMX1BST01QVDogJzAnLFxuICAgICAgICBHSVRfT1BUSU9OQUxfTE9DS1M6ICcwJyxcbiAgICAgICAgUEFUSDogcGF0aFBhcnRzLmpvaW4ocGF0aC5kZWxpbWl0ZXIpLFxuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2l0VGVtcERpciA9IG5ldyBHaXRUZW1wRGlyKCk7XG5cbiAgICAgIGlmICh1c2VHcGdXcmFwcGVyKSB7XG4gICAgICAgIGF3YWl0IGdpdFRlbXBEaXIuZW5zdXJlKCk7XG4gICAgICAgIGFyZ3MudW5zaGlmdCgnLWMnLCBgZ3BnLnByb2dyYW09JHtnaXRUZW1wRGlyLmdldEdwZ1dyYXBwZXJTaCgpfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodXNlR2l0UHJvbXB0U2VydmVyKSB7XG4gICAgICAgIGdpdFByb21wdFNlcnZlciA9IG5ldyBHaXRQcm9tcHRTZXJ2ZXIoZ2l0VGVtcERpcik7XG4gICAgICAgIGF3YWl0IGdpdFByb21wdFNlcnZlci5zdGFydCh0aGlzLnByb21wdCk7XG5cbiAgICAgICAgZW52LkFUT01fR0lUSFVCX1RNUCA9IGdpdFRlbXBEaXIuZ2V0Um9vdFBhdGgoKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0FTS1BBU1NfUEFUSCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2l0VGVtcERpci5nZXRBc2tQYXNzSnMoKSk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9DUkVERU5USUFMX1BBVEggPSBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGdpdFRlbXBEaXIuZ2V0Q3JlZGVudGlhbEhlbHBlckpzKCkpO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfRUxFQ1RST05fUEFUSCA9IG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoZ2V0QXRvbUhlbHBlclBhdGgoKSk7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9TT0NLX0FERFIgPSBnaXRQcm9tcHRTZXJ2ZXIuZ2V0QWRkcmVzcygpO1xuXG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9XT1JLRElSX1BBVEggPSB0aGlzLndvcmtpbmdEaXI7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9EVUdJVEVfUEFUSCA9IGdldER1Z2l0ZVBhdGgoKTtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0tFWVRBUl9TVFJBVEVHWV9QQVRIID0gZ2V0U2hhcmVkTW9kdWxlUGF0aCgna2V5dGFyLXN0cmF0ZWd5Jyk7XG5cbiAgICAgICAgLy8gXCJzc2hcIiB3b24ndCByZXNwZWN0IFNTSF9BU0tQQVNTIHVubGVzczpcbiAgICAgICAgLy8gKGEpIGl0J3MgcnVubmluZyB3aXRob3V0IGEgdHR5XG4gICAgICAgIC8vIChiKSBESVNQTEFZIGlzIHNldCB0byBzb21ldGhpbmcgbm9uZW1wdHlcbiAgICAgICAgLy8gQnV0LCBvbiBhIE1hYywgRElTUExBWSBpcyB1bnNldC4gRW5zdXJlIHRoYXQgaXQgaXMgc28gb3VyIFNTSF9BU0tQQVNTIGlzIHJlc3BlY3RlZC5cbiAgICAgICAgaWYgKCFwcm9jZXNzLmVudi5ESVNQTEFZIHx8IHByb2Nlc3MuZW52LkRJU1BMQVkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZW52LkRJU1BMQVkgPSAnYXRvbS1naXRodWItcGxhY2Vob2xkZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX1BBVEggPSBwcm9jZXNzLmVudi5QQVRIIHx8ICcnO1xuICAgICAgICBlbnYuQVRPTV9HSVRIVUJfT1JJR0lOQUxfR0lUX0FTS1BBU1MgPSBwcm9jZXNzLmVudi5HSVRfQVNLUEFTUyB8fCAnJztcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX09SSUdJTkFMX1NTSF9BU0tQQVNTID0gcHJvY2Vzcy5lbnYuU1NIX0FTS1BBU1MgfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9PUklHSU5BTF9HSVRfU1NIX0NPTU1BTkQgPSBwcm9jZXNzLmVudi5HSVRfU1NIX0NPTU1BTkQgfHwgJyc7XG4gICAgICAgIGVudi5BVE9NX0dJVEhVQl9TUEVDX01PREUgPSBhdG9tLmluU3BlY01vZGUoKSA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICAgICAgZW52LlNTSF9BU0tQQVNTID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldEFza1Bhc3NTaCgpKTtcbiAgICAgICAgZW52LkdJVF9BU0tQQVNTID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldEFza1Bhc3NTaCgpKTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICAgICAgICAgIGVudi5HSVRfU1NIX0NPTU1BTkQgPSBnaXRUZW1wRGlyLmdldFNzaFdyYXBwZXJTaCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52LkdJVF9TU0hfQ09NTUFORCkge1xuICAgICAgICAgIGVudi5HSVRfU1NIX0NPTU1BTkQgPSBwcm9jZXNzLmVudi5HSVRfU1NIX0NPTU1BTkQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW52LkdJVF9TU0ggPSBwcm9jZXNzLmVudi5HSVRfU1NIO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3JlZGVudGlhbEhlbHBlclNoID0gbm9ybWFsaXplR2l0SGVscGVyUGF0aChnaXRUZW1wRGlyLmdldENyZWRlbnRpYWxIZWxwZXJTaCgpKTtcbiAgICAgICAgYXJncy51bnNoaWZ0KCctYycsIGBjcmVkZW50aWFsLmhlbHBlcj0ke2NyZWRlbnRpYWxIZWxwZXJTaH1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVzZUdwZ1dyYXBwZXIgJiYgdXNlR2l0UHJvbXB0U2VydmVyICYmIHVzZUdwZ0F0b21Qcm9tcHQpIHtcbiAgICAgICAgZW52LkFUT01fR0lUSFVCX0dQR19QUk9NUFQgPSAndHJ1ZSc7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGRpYWdub3N0aWNzRW5hYmxlZCkge1xuICAgICAgICBlbnYuR0lUX1RSQUNFID0gJ3RydWUnO1xuICAgICAgICBlbnYuR0lUX1RSQUNFX0NVUkwgPSAndHJ1ZSc7XG4gICAgICB9XG5cbiAgICAgIGxldCBvcHRzID0ge2Vudn07XG5cbiAgICAgIGlmIChzdGRpbikge1xuICAgICAgICBvcHRzLnN0ZGluID0gc3RkaW47XG4gICAgICAgIG9wdHMuc3RkaW5FbmNvZGluZyA9ICd1dGY4JztcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuUFJJTlRfR0lUX1RJTUVTKSB7XG4gICAgICAgIGNvbnNvbGUudGltZShgZ2l0OiR7Zm9ybWF0dGVkQXJnc31gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlUnVuKSB7XG4gICAgICAgICAgY29uc3QgbmV3QXJnc09wdHMgPSBhd2FpdCBvcHRpb25zLmJlZm9yZVJ1bih7YXJncywgb3B0c30pO1xuICAgICAgICAgIGFyZ3MgPSBuZXdBcmdzT3B0cy5hcmdzO1xuICAgICAgICAgIG9wdHMgPSBuZXdBcmdzT3B0cy5vcHRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHtwcm9taXNlLCBjYW5jZWx9ID0gdGhpcy5leGVjdXRlR2l0Q29tbWFuZChhcmdzLCBvcHRzLCB0aW1pbmdNYXJrZXIpO1xuICAgICAgICBsZXQgZXhwZWN0Q2FuY2VsID0gZmFsc2U7XG4gICAgICAgIGlmIChnaXRQcm9tcHRTZXJ2ZXIpIHtcbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChnaXRQcm9tcHRTZXJ2ZXIub25EaWRDYW5jZWwoYXN5bmMgKHtoYW5kbGVyUGlkfSkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0Q2FuY2VsID0gdHJ1ZTtcbiAgICAgICAgICAgIGF3YWl0IGNhbmNlbCgpO1xuXG4gICAgICAgICAgICAvLyBPbiBXaW5kb3dzLCB0aGUgU1NIX0FTS1BBU1MgaGFuZGxlciBpcyBleGVjdXRlZCBhcyBhIG5vbi1jaGlsZCBwcm9jZXNzLCBzbyB0aGUgYmluXFxnaXQtYXNrcGFzcy1hdG9tLnNoXG4gICAgICAgICAgICAvLyBwcm9jZXNzIGRvZXMgbm90IHRlcm1pbmF0ZSB3aGVuIHRoZSBnaXQgcHJvY2VzcyBpcyBraWxsZWQuXG4gICAgICAgICAgICAvLyBLaWxsIHRoZSBoYW5kbGVyIHByb2Nlc3MgKmFmdGVyKiB0aGUgZ2l0IHByb2Nlc3MgaGFzIGJlZW4ga2lsbGVkIHRvIGVuc3VyZSB0aGF0IGdpdCBkb2Vzbid0IGhhdmUgYVxuICAgICAgICAgICAgLy8gY2hhbmNlIHRvIGZhbGwgYmFjayB0byBHSVRfQVNLUEFTUyBmcm9tIHRoZSBjcmVkZW50aWFsIGhhbmRsZXIuXG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZUtpbGwsIHJlamVjdEtpbGwpID0+IHtcbiAgICAgICAgICAgICAgcmVxdWlyZSgndHJlZS1raWxsJykoaGFuZGxlclBpZCwgJ1NJR1RFUk0nLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHsgcmVqZWN0S2lsbChlcnIpOyB9IGVsc2UgeyByZXNvbHZlS2lsbCgpOyB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge3N0ZG91dCwgc3RkZXJyLCBleGl0Q29kZSwgc2lnbmFsLCB0aW1pbmd9ID0gYXdhaXQgcHJvbWlzZS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGlmIChlcnIuc2lnbmFsKSB7XG4gICAgICAgICAgICByZXR1cm4ge3NpZ25hbDogZXJyLnNpZ25hbH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWluZykge1xuICAgICAgICAgIGNvbnN0IHtleGVjVGltZSwgc3Bhd25UaW1lLCBpcGNUaW1lfSA9IHRpbWluZztcbiAgICAgICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICB0aW1pbmdNYXJrZXIubWFyaygnbmV4dHRpY2snLCBub3cgLSBleGVjVGltZSAtIHNwYXduVGltZSAtIGlwY1RpbWUpO1xuICAgICAgICAgIHRpbWluZ01hcmtlci5tYXJrKCdleGVjdXRlJywgbm93IC0gZXhlY1RpbWUgLSBpcGNUaW1lKTtcbiAgICAgICAgICB0aW1pbmdNYXJrZXIubWFyaygnaXBjJywgbm93IC0gaXBjVGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGltaW5nTWFya2VyLmZpbmFsaXplKCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5QUklOVF9HSVRfVElNRVMpIHtcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoYGdpdDoke2Zvcm1hdHRlZEFyZ3N9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ2l0UHJvbXB0U2VydmVyKSB7XG4gICAgICAgICAgZ2l0UHJvbXB0U2VydmVyLnRlcm1pbmF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoZGlhZ25vc3RpY3NFbmFibGVkKSB7XG4gICAgICAgICAgY29uc3QgZXhwb3NlQ29udHJvbENoYXJhY3RlcnMgPSByYXcgPT4ge1xuICAgICAgICAgICAgaWYgKCFyYXcpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAgICAgICAgIHJldHVybiByYXdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcdTAwMDAvdWcsICc8TlVMPlxcbicpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHUwMDFGL3VnLCAnPFNFUD4nKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGhlYWRsZXNzKSB7XG4gICAgICAgICAgICBsZXQgc3VtbWFyeSA9IGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfVxcbmA7XG4gICAgICAgICAgICBpZiAoZXhpdENvZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBleGl0IHN0YXR1czogJHtleGl0Q29kZX1cXG5gO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaWduYWwpIHtcbiAgICAgICAgICAgICAgc3VtbWFyeSArPSBgZXhpdCBzaWduYWw6ICR7c2lnbmFsfVxcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RkaW4gJiYgc3RkaW4ubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYHN0ZGluOlxcbiR7ZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3RkaW4pfVxcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdW1tYXJ5ICs9ICdzdGRvdXQ6JztcbiAgICAgICAgICAgIGlmIChzdGRvdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gJyA8ZW1wdHk+XFxuJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN1bW1hcnkgKz0gYFxcbiR7ZXhwb3NlQ29udHJvbENoYXJhY3RlcnMoc3Rkb3V0KX1cXG5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VtbWFyeSArPSAnc3RkZXJyOic7XG4gICAgICAgICAgICBpZiAoc3RkZXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9ICcgPGVtcHR5Plxcbic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzdW1tYXJ5ICs9IGBcXG4ke2V4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGVycil9XFxuYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coc3VtbWFyeSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlclN0eWxlID0gJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogYmx1ZTsnO1xuXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKGBnaXQ6JHtmb3JtYXR0ZWRBcmdzfWApO1xuICAgICAgICAgICAgaWYgKGV4aXRDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVjZXhpdCBzdGF0dXMlYyAlZCcsIGhlYWRlclN0eWxlLCAnZm9udC13ZWlnaHQ6IG5vcm1hbDsgY29sb3I6IGJsYWNrOycsIGV4aXRDb2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2lnbmFsKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY2V4aXQgc2lnbmFsJWMgJXMnLCBoZWFkZXJTdHlsZSwgJ2ZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiBibGFjazsnLCBzaWduYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICclY2Z1bGwgYXJndW1lbnRzJWMgJXMnLFxuICAgICAgICAgICAgICBoZWFkZXJTdHlsZSwgJ2ZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiBibGFjazsnLFxuICAgICAgICAgICAgICB1dGlsLmluc3BlY3QoYXJncywge2JyZWFrTGVuZ3RoOiBJbmZpbml0eX0pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChzdGRpbiAmJiBzdGRpbi5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVjc3RkaW4nLCBoZWFkZXJTdHlsZSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGluKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWNzdGRvdXQnLCBoZWFkZXJTdHlsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhleHBvc2VDb250cm9sQ2hhcmFjdGVycyhzdGRvdXQpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY3N0ZGVycicsIGhlYWRlclN0eWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4cG9zZUNvbnRyb2xDaGFyYWN0ZXJzKHN0ZGVycikpO1xuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleGl0Q29kZSAhPT0gMCAmJiAhZXhwZWN0Q2FuY2VsKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IEdpdEVycm9yKFxuICAgICAgICAgICAgYCR7Zm9ybWF0dGVkQXJnc30gZXhpdGVkIHdpdGggY29kZSAke2V4aXRDb2RlfVxcbnN0ZG91dDogJHtzdGRvdXR9XFxuc3RkZXJyOiAke3N0ZGVycn1gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLmNvZGUgPSBleGl0Q29kZTtcbiAgICAgICAgICBlcnIuc3RkRXJyID0gc3RkZXJyO1xuICAgICAgICAgIGVyci5zdGRPdXQgPSBzdGRvdXQ7XG4gICAgICAgICAgZXJyLmNvbW1hbmQgPSBmb3JtYXR0ZWRBcmdzO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFJR05PUkVEX0dJVF9DT01NQU5EUy5pbmNsdWRlcyhjb21tYW5kTmFtZSkpIHtcbiAgICAgICAgICBpbmNyZW1lbnRDb3VudGVyKGNvbW1hbmROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHN0ZG91dCk7XG4gICAgICB9KTtcbiAgICB9LCB7cGFyYWxsZWw6ICF3cml0ZU9wZXJhdGlvbn0pO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSxuby1jb250cm9sLXJlZ2V4ICovXG4gIH1cblxuICBhc3luYyBncGdFeGVjKGFyZ3MsIG9wdGlvbnMpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlYyhhcmdzLnNsaWNlKCksIHtcbiAgICAgICAgdXNlR3BnV3JhcHBlcjogdHJ1ZSxcbiAgICAgICAgdXNlR3BnQXRvbVByb21wdDogZmFsc2UsXG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoL2dwZyBmYWlsZWQvLnRlc3QoZS5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWMoYXJncywge1xuICAgICAgICAgIHVzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSxcbiAgICAgICAgICB1c2VHcGdXcmFwcGVyOiB0cnVlLFxuICAgICAgICAgIHVzZUdwZ0F0b21Qcm9tcHQ6IHRydWUsXG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVHaXRDb21tYW5kKGFyZ3MsIG9wdGlvbnMsIG1hcmtlciA9IG51bGwpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuQVRPTV9HSVRIVUJfSU5MSU5FX0dJVF9FWEVDIHx8ICFXb3JrZXJNYW5hZ2VyLmdldEluc3RhbmNlKCkuaXNSZWFkeSgpKSB7XG4gICAgICBtYXJrZXIgJiYgbWFya2VyLm1hcmsoJ25leHR0aWNrJyk7XG5cbiAgICAgIGxldCBjaGlsZFBpZDtcbiAgICAgIG9wdGlvbnMucHJvY2Vzc0NhbGxiYWNrID0gY2hpbGQgPT4ge1xuICAgICAgICBjaGlsZFBpZCA9IGNoaWxkLnBpZDtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBjaGlsZC5zdGRpbi5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBFcnJvciB3cml0aW5nIHRvIHN0ZGluOiBnaXQgJHthcmdzLmpvaW4oJyAnKX0gaW4gJHt0aGlzLndvcmtpbmdEaXJ9XFxuJHtvcHRpb25zLnN0ZGlufVxcbiR7ZXJyfWApO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHByb21pc2UgPSBHaXRQcm9jZXNzLmV4ZWMoYXJncywgdGhpcy53b3JraW5nRGlyLCBvcHRpb25zKTtcbiAgICAgIG1hcmtlciAmJiBtYXJrZXIubWFyaygnZXhlY3V0ZScpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgY2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKCFjaGlsZFBpZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXF1aXJlKCd0cmVlLWtpbGwnKShjaGlsZFBpZCwgJ1NJR1RFUk0nLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgaWYgKGVycikgeyByZWplY3QoZXJyKTsgfSBlbHNlIHsgcmVzb2x2ZSgpOyB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHdvcmtlck1hbmFnZXIgPSB0aGlzLndvcmtlck1hbmFnZXIgfHwgV29ya2VyTWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgICAgcmV0dXJuIHdvcmtlck1hbmFnZXIucmVxdWVzdCh7XG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHdvcmtpbmdEaXI6IHRoaXMud29ya2luZ0RpcixcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlc29sdmVEb3RHaXREaXIoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZzLnN0YXQodGhpcy53b3JraW5nRGlyKTsgLy8gZmFpbHMgaWYgZm9sZGVyIGRvZXNuJ3QgZXhpc3RcbiAgICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ3Jldi1wYXJzZScsICctLXJlc29sdmUtZ2l0LWRpcicsIHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsICcuZ2l0JyldKTtcbiAgICAgIGNvbnN0IGRvdEdpdERpciA9IG91dHB1dC50cmltKCk7XG4gICAgICByZXR1cm4gdG9OYXRpdmVQYXRoU2VwKGRvdEdpdERpcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsnaW5pdCcsIHRoaXMud29ya2luZ0Rpcl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YWdpbmcvVW5zdGFnaW5nIGZpbGVzIGFuZCBwYXRjaGVzIGFuZCBjb21taXR0aW5nXG4gICAqL1xuICBzdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpOyB9XG4gICAgY29uc3QgYXJncyA9IFsnYWRkJ10uY29uY2F0KHBhdGhzLm1hcCh0b0dpdFBhdGhTZXApKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKSB7XG4gICAgbGV0IHRlbXBsYXRlUGF0aCA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdjb21taXQudGVtcGxhdGUnKTtcbiAgICBpZiAoIXRlbXBsYXRlUGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaG9tZURpciA9IG9zLmhvbWVkaXIoKTtcblxuICAgIHRlbXBsYXRlUGF0aCA9IHRlbXBsYXRlUGF0aC50cmltKCkucmVwbGFjZShFWFBBTkRfVElMREVfUkVHRVgsIChfLCB1c2VyKSA9PiB7XG4gICAgICAvLyBpZiBubyB1c2VyIGlzIHNwZWNpZmllZCwgZmFsbCBiYWNrIHRvIHVzaW5nIHRoZSBob21lIGRpcmVjdG9yeS5cbiAgICAgIHJldHVybiBgJHt1c2VyID8gcGF0aC5qb2luKHBhdGguZGlybmFtZShob21lRGlyKSwgdXNlcikgOiBob21lRGlyfS9gO1xuICAgIH0pO1xuICAgIHRlbXBsYXRlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcCh0ZW1wbGF0ZVBhdGgpO1xuXG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUodGVtcGxhdGVQYXRoKSkge1xuICAgICAgdGVtcGxhdGVQYXRoID0gcGF0aC5qb2luKHRoaXMud29ya2luZ0RpciwgdGVtcGxhdGVQYXRoKTtcbiAgICB9XG5cbiAgICBpZiAoIWF3YWl0IGZpbGVFeGlzdHModGVtcGxhdGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbW1pdCB0ZW1wbGF0ZSBwYXRoIHNldCBpbiBHaXQgY29uZmlnOiAke3RlbXBsYXRlUGF0aH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGZzLnJlYWRGaWxlKHRlbXBsYXRlUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhwYXRocywgY29tbWl0ID0gJ0hFQUQnKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpOyB9XG4gICAgY29uc3QgYXJncyA9IFsncmVzZXQnLCBjb21taXQsICctLSddLmNvbmNhdChwYXRocy5tYXAodG9HaXRQYXRoU2VwKSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIHN0YWdlRmlsZU1vZGVDaGFuZ2UoZmlsZW5hbWUsIG5ld01vZGUpIHtcbiAgICBjb25zdCBpbmRleFJlYWRQcm9taXNlID0gdGhpcy5leGVjKFsnbHMtZmlsZXMnLCAnLXMnLCAnLS0nLCBmaWxlbmFtZV0pO1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWyd1cGRhdGUtaW5kZXgnLCAnLS1jYWNoZWluZm8nLCBgJHtuZXdNb2RlfSw8T0lEX1RCRD4sJHtmaWxlbmFtZX1gXSwge1xuICAgICAgd3JpdGVPcGVyYXRpb246IHRydWUsXG4gICAgICBiZWZvcmVSdW46IGFzeW5jIGZ1bmN0aW9uIGRldGVybWluZUFyZ3Moe2FyZ3MsIG9wdHN9KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gYXdhaXQgaW5kZXhSZWFkUHJvbWlzZTtcbiAgICAgICAgY29uc3Qgb2lkID0gaW5kZXguc3Vic3RyKDcsIDQwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcHRzLFxuICAgICAgICAgIGFyZ3M6IFsndXBkYXRlLWluZGV4JywgJy0tY2FjaGVpbmZvJywgYCR7bmV3TW9kZX0sJHtvaWR9LCR7ZmlsZW5hbWV9YF0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShmaWxlbmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydybScsICctLWNhY2hlZCcsIGZpbGVuYW1lXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhcHBseVBhdGNoKHBhdGNoLCB7aW5kZXh9ID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydhcHBseScsICctJ107XG4gICAgaWYgKGluZGV4KSB7IGFyZ3Muc3BsaWNlKDEsIDAsICctLWNhY2hlZCcpOyB9XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7c3RkaW46IHBhdGNoLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgY29tbWl0KHJhd01lc3NhZ2UsIHthbGxvd0VtcHR5LCBhbWVuZCwgY29BdXRob3JzLCB2ZXJiYXRpbX0gPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2NvbW1pdCddO1xuICAgIGxldCBtc2c7XG5cbiAgICAvLyBpZiBhbWVuZGluZyBhbmQgbm8gbmV3IG1lc3NhZ2UgaXMgcGFzc2VkLCB1c2UgbGFzdCBjb21taXQncyBtZXNzYWdlLiBFbnN1cmUgdGhhdCB3ZSBkb24ndFxuICAgIC8vIG1hbmdsZSBpdCBpbiB0aGUgcHJvY2Vzcy5cbiAgICBpZiAoYW1lbmQgJiYgcmF3TWVzc2FnZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHt1bmJvcm5SZWYsIG1lc3NhZ2VCb2R5LCBtZXNzYWdlU3ViamVjdH0gPSBhd2FpdCB0aGlzLmdldEhlYWRDb21taXQoKTtcbiAgICAgIGlmICh1bmJvcm5SZWYpIHtcbiAgICAgICAgbXNnID0gcmF3TWVzc2FnZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IGAke21lc3NhZ2VTdWJqZWN0fVxcblxcbiR7bWVzc2FnZUJvZHl9YC50cmltKCk7XG4gICAgICAgIHZlcmJhdGltID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbXNnID0gcmF3TWVzc2FnZTtcbiAgICB9XG5cbiAgICAvLyBpZiBjb21taXQgdGVtcGxhdGUgaXMgdXNlZCwgc3RyaXAgY29tbWVudGVkIGxpbmVzIGZyb20gY29tbWl0XG4gICAgLy8gdG8gYmUgY29uc2lzdGVudCB3aXRoIGNvbW1hbmQgbGluZSBnaXQuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG5cbiAgICAgIC8vIHJlc3BlY3RpbmcgdGhlIGNvbW1lbnQgY2hhcmFjdGVyIGZyb20gdXNlciBzZXR0aW5ncyBvciBmYWxsIGJhY2sgdG8gIyBhcyBkZWZhdWx0LlxuICAgICAgLy8gaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1jb25maWcjZ2l0LWNvbmZpZy1jb3JlY29tbWVudENoYXJcbiAgICAgIGxldCBjb21tZW50Q2hhciA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdjb3JlLmNvbW1lbnRDaGFyJyk7XG4gICAgICBpZiAoIWNvbW1lbnRDaGFyKSB7XG4gICAgICAgIGNvbW1lbnRDaGFyID0gJyMnO1xuICAgICAgfVxuICAgICAgbXNnID0gbXNnLnNwbGl0KCdcXG4nKS5maWx0ZXIobGluZSA9PiAhbGluZS5zdGFydHNXaXRoKGNvbW1lbnRDaGFyKSkuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjbGVhbnVwIG1vZGUuXG4gICAgaWYgKHZlcmJhdGltKSB7XG4gICAgICBhcmdzLnB1c2goJy0tY2xlYW51cD12ZXJiYXRpbScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb25maWd1cmVkID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2NvbW1pdC5jbGVhbnVwJyk7XG4gICAgICBjb25zdCBtb2RlID0gKGNvbmZpZ3VyZWQgJiYgY29uZmlndXJlZCAhPT0gJ2RlZmF1bHQnKSA/IGNvbmZpZ3VyZWQgOiAnc3RyaXAnO1xuICAgICAgYXJncy5wdXNoKGAtLWNsZWFudXA9JHttb2RlfWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBjby1hdXRob3IgY29tbWl0IHRyYWlsZXJzIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChjb0F1dGhvcnMgJiYgY29BdXRob3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIG1zZyA9IGF3YWl0IHRoaXMuYWRkQ29BdXRob3JzVG9NZXNzYWdlKG1zZywgY29BdXRob3JzKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goJy1tJywgbXNnLnRyaW0oKSk7XG5cbiAgICBpZiAoYW1lbmQpIHsgYXJncy5wdXNoKCctLWFtZW5kJyk7IH1cbiAgICBpZiAoYWxsb3dFbXB0eSkgeyBhcmdzLnB1c2goJy0tYWxsb3ctZW1wdHknKTsgfVxuICAgIHJldHVybiB0aGlzLmdwZ0V4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhZGRDb0F1dGhvcnNUb01lc3NhZ2UobWVzc2FnZSwgY29BdXRob3JzID0gW10pIHtcbiAgICBjb25zdCB0cmFpbGVycyA9IGNvQXV0aG9ycy5tYXAoYXV0aG9yID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuOiAnQ28tQXV0aG9yZWQtQnknLFxuICAgICAgICB2YWx1ZTogYCR7YXV0aG9yLm5hbWV9IDwke2F1dGhvci5lbWFpbH0+YCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCBtZXNzYWdlIGVuZHMgd2l0aCBuZXdsaW5lIGZvciBnaXQtaW50ZXJwcmV0IHRyYWlsZXJzIHRvIHdvcmtcbiAgICBjb25zdCBtc2cgPSBgJHttZXNzYWdlLnRyaW0oKX1cXG5gO1xuXG4gICAgcmV0dXJuIHRyYWlsZXJzLmxlbmd0aCA/IHRoaXMubWVyZ2VUcmFpbGVycyhtc2csIHRyYWlsZXJzKSA6IG1zZztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxlIFN0YXR1cyBhbmQgRGlmZnNcbiAgICovXG4gIGFzeW5jIGdldFN0YXR1c0J1bmRsZSgpIHtcbiAgICBjb25zdCBhcmdzID0gWydzdGF0dXMnLCAnLS1wb3JjZWxhaW49djInLCAnLS1icmFuY2gnLCAnLS11bnRyYWNrZWQtZmlsZXM9YWxsJywgJy0taWdub3JlLXN1Ym1vZHVsZXM9ZGlydHknLCAnLXonXTtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG4gICAgaWYgKG91dHB1dC5sZW5ndGggPiBNQVhfU1RBVFVTX09VVFBVVF9MRU5HVEgpIHtcbiAgICAgIHRocm93IG5ldyBMYXJnZVJlcG9FcnJvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBwYXJzZVN0YXR1cyhvdXRwdXQpO1xuXG4gICAgZm9yIChjb25zdCBlbnRyeVR5cGUgaW4gcmVzdWx0cykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0c1tlbnRyeVR5cGVdKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZU5hdGl2ZVBhdGhTZXBGb3JFbnRyaWVzKHJlc3VsdHNbZW50cnlUeXBlXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICB1cGRhdGVOYXRpdmVQYXRoU2VwRm9yRW50cmllcyhlbnRyaWVzKSB7XG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIC8vIE5vcm1hbGx5IHdlIHdvdWxkIGF2b2lkIG11dGF0aW5nIHJlc3BvbnNlcyBmcm9tIG90aGVyIHBhY2thZ2UncyBBUElzLCBidXQgd2UgY29udHJvbFxuICAgICAgLy8gdGhlIGB3aGF0LXRoZS1zdGF0dXNgIG1vZHVsZSBhbmQga25vdyB0aGVyZSBhcmUgbm8gc2lkZSBlZmZlY3RzLlxuICAgICAgLy8gVGhpcyBpcyBhIGhvdCBjb2RlIHBhdGggYW5kIGJ5IG11dGF0aW5nIHdlIGF2b2lkIGNyZWF0aW5nIG5ldyBvYmplY3RzIHRoYXQgd2lsbCBqdXN0IGJlIEdDJ2VkXG4gICAgICBpZiAoZW50cnkuZmlsZVBhdGgpIHtcbiAgICAgICAgZW50cnkuZmlsZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAoZW50cnkuZmlsZVBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5Lm9yaWdGaWxlUGF0aCkge1xuICAgICAgICBlbnRyeS5vcmlnRmlsZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAoZW50cnkub3JpZ0ZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRpZmZGaWxlU3RhdHVzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2RpZmYnLCAnLS1uYW1lLXN0YXR1cycsICctLW5vLXJlbmFtZXMnXTtcbiAgICBpZiAob3B0aW9ucy5zdGFnZWQpIHsgYXJncy5wdXNoKCctLXN0YWdlZCcpOyB9XG4gICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7IGFyZ3MucHVzaChvcHRpb25zLnRhcmdldCk7IH1cbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG5cbiAgICBjb25zdCBzdGF0dXNNYXAgPSB7XG4gICAgICBBOiAnYWRkZWQnLFxuICAgICAgTTogJ21vZGlmaWVkJyxcbiAgICAgIEQ6ICdkZWxldGVkJyxcbiAgICAgIFU6ICd1bm1lcmdlZCcsXG4gICAgfTtcblxuICAgIGNvbnN0IGZpbGVTdGF0dXNlcyA9IHt9O1xuICAgIG91dHB1dCAmJiBvdXRwdXQudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5mb3JFYWNoKGxpbmUgPT4ge1xuICAgICAgY29uc3QgW3N0YXR1cywgcmF3RmlsZVBhdGhdID0gbGluZS5zcGxpdCgnXFx0Jyk7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyYXdGaWxlUGF0aCk7XG4gICAgICBmaWxlU3RhdHVzZXNbZmlsZVBhdGhdID0gc3RhdHVzTWFwW3N0YXR1c107XG4gICAgfSk7XG4gICAgaWYgKCFvcHRpb25zLnN0YWdlZCkge1xuICAgICAgY29uc3QgdW50cmFja2VkID0gYXdhaXQgdGhpcy5nZXRVbnRyYWNrZWRGaWxlcygpO1xuICAgICAgdW50cmFja2VkLmZvckVhY2goZmlsZVBhdGggPT4geyBmaWxlU3RhdHVzZXNbZmlsZVBhdGhdID0gJ2FkZGVkJzsgfSk7XG4gICAgfVxuICAgIHJldHVybiBmaWxlU3RhdHVzZXM7XG4gIH1cblxuICBhc3luYyBnZXRVbnRyYWNrZWRGaWxlcygpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydscy1maWxlcycsICctLW90aGVycycsICctLWV4Y2x1ZGUtc3RhbmRhcmQnXSk7XG4gICAgaWYgKG91dHB1dC50cmltKCkgPT09ICcnKSB7IHJldHVybiBbXTsgfVxuICAgIHJldHVybiBvdXRwdXQudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKS5tYXAodG9OYXRpdmVQYXRoU2VwKTtcbiAgfVxuXG4gIGFzeW5jIGdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIHtzdGFnZWQsIGJhc2VDb21taXR9ID0ge30pIHtcbiAgICBsZXQgYXJncyA9IFsnZGlmZicsICctLW5vLXByZWZpeCcsICctLW5vLWV4dC1kaWZmJywgJy0tbm8tcmVuYW1lcycsICctLWRpZmYtZmlsdGVyPXUnXTtcbiAgICBpZiAoc3RhZ2VkKSB7IGFyZ3MucHVzaCgnLS1zdGFnZWQnKTsgfVxuICAgIGlmIChiYXNlQ29tbWl0KSB7IGFyZ3MucHVzaChiYXNlQ29tbWl0KTsgfVxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbJy0tJywgdG9HaXRQYXRoU2VwKGZpbGVQYXRoKV0pO1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcblxuICAgIGxldCByYXdEaWZmcyA9IFtdO1xuICAgIGlmIChvdXRwdXQpIHtcbiAgICAgIHJhd0RpZmZzID0gcGFyc2VEaWZmKG91dHB1dClcbiAgICAgICAgLmZpbHRlcihyYXdEaWZmID0+IHJhd0RpZmYuc3RhdHVzICE9PSAndW5tZXJnZWQnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdEaWZmcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByYXdEaWZmID0gcmF3RGlmZnNbaV07XG4gICAgICAgIGlmIChyYXdEaWZmLm9sZFBhdGgpIHtcbiAgICAgICAgICByYXdEaWZmLm9sZFBhdGggPSB0b05hdGl2ZVBhdGhTZXAocmF3RGlmZi5vbGRQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmF3RGlmZi5uZXdQYXRoKSB7XG4gICAgICAgICAgcmF3RGlmZi5uZXdQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJhd0RpZmYubmV3UGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXN0YWdlZCAmJiAoYXdhaXQgdGhpcy5nZXRVbnRyYWNrZWRGaWxlcygpKS5pbmNsdWRlcyhmaWxlUGF0aCkpIHtcbiAgICAgIC8vIGFkZCB1bnRyYWNrZWQgZmlsZVxuICAgICAgY29uc3QgYWJzUGF0aCA9IHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIGZpbGVQYXRoKTtcbiAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBhd2FpdCBpc0ZpbGVFeGVjdXRhYmxlKGFic1BhdGgpO1xuICAgICAgY29uc3Qgc3ltbGluayA9IGF3YWl0IGlzRmlsZVN5bWxpbmsoYWJzUGF0aCk7XG4gICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKGFic1BhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgICBjb25zdCBiaW5hcnkgPSBpc0JpbmFyeShjb250ZW50cyk7XG4gICAgICBsZXQgbW9kZTtcbiAgICAgIGxldCByZWFscGF0aDtcbiAgICAgIGlmIChleGVjdXRhYmxlKSB7XG4gICAgICAgIG1vZGUgPSBGaWxlLm1vZGVzLkVYRUNVVEFCTEU7XG4gICAgICB9IGVsc2UgaWYgKHN5bWxpbmspIHtcbiAgICAgICAgbW9kZSA9IEZpbGUubW9kZXMuU1lNTElOSztcbiAgICAgICAgcmVhbHBhdGggPSBhd2FpdCBmcy5yZWFscGF0aChhYnNQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGUgPSBGaWxlLm1vZGVzLk5PUk1BTDtcbiAgICAgIH1cblxuICAgICAgcmF3RGlmZnMucHVzaChidWlsZEFkZGVkRmlsZVBhdGNoKGZpbGVQYXRoLCBiaW5hcnkgPyBudWxsIDogY29udGVudHMsIG1vZGUsIHJlYWxwYXRoKSk7XG4gICAgfVxuICAgIGlmIChyYXdEaWZmcy5sZW5ndGggPiAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGJldHdlZW4gMCBhbmQgMiBkaWZmcyBmb3IgJHtmaWxlUGF0aH0gYnV0IGdvdCAke3Jhd0RpZmZzLmxlbmd0aH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhd0RpZmZzO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoKCkge1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbXG4gICAgICAnZGlmZicsICctLXN0YWdlZCcsICctLW5vLXByZWZpeCcsICctLW5vLWV4dC1kaWZmJywgJy0tbm8tcmVuYW1lcycsICctLWRpZmYtZmlsdGVyPXUnLFxuICAgIF0pO1xuXG4gICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmcyA9IHBhcnNlRGlmZihvdXRwdXQpO1xuICAgIGZvciAoY29uc3QgZGlmZiBvZiBkaWZmcykge1xuICAgICAgaWYgKGRpZmYub2xkUGF0aCkgeyBkaWZmLm9sZFBhdGggPSB0b05hdGl2ZVBhdGhTZXAoZGlmZi5vbGRQYXRoKTsgfVxuICAgICAgaWYgKGRpZmYubmV3UGF0aCkgeyBkaWZmLm5ld1BhdGggPSB0b05hdGl2ZVBhdGhTZXAoZGlmZi5uZXdQYXRoKTsgfVxuICAgIH1cbiAgICByZXR1cm4gZGlmZnM7XG4gIH1cblxuICAvKipcbiAgICogTWlzY2VsbGFuZW91cyBnZXR0ZXJzXG4gICAqL1xuICBhc3luYyBnZXRDb21taXQocmVmKSB7XG4gICAgY29uc3QgW2NvbW1pdF0gPSBhd2FpdCB0aGlzLmdldENvbW1pdHMoe21heDogMSwgcmVmLCBpbmNsdWRlVW5ib3JuOiB0cnVlfSk7XG4gICAgcmV0dXJuIGNvbW1pdDtcbiAgfVxuXG4gIGFzeW5jIGdldEhlYWRDb21taXQoKSB7XG4gICAgY29uc3QgW2hlYWRDb21taXRdID0gYXdhaXQgdGhpcy5nZXRDb21taXRzKHttYXg6IDEsIHJlZjogJ0hFQUQnLCBpbmNsdWRlVW5ib3JuOiB0cnVlfSk7XG4gICAgcmV0dXJuIGhlYWRDb21taXQ7XG4gIH1cblxuICBhc3luYyBnZXRDb21taXRzKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHttYXgsIHJlZiwgaW5jbHVkZVVuYm9ybiwgaW5jbHVkZVBhdGNofSA9IHtcbiAgICAgIG1heDogMSxcbiAgICAgIHJlZjogJ0hFQUQnLFxuICAgICAgaW5jbHVkZVVuYm9ybjogZmFsc2UsXG4gICAgICBpbmNsdWRlUGF0Y2g6IGZhbHNlLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1sb2cjX3ByZXR0eV9mb3JtYXRzXG4gICAgLy8gJXgwMCAtIG51bGwgYnl0ZVxuICAgIC8vICVIIC0gY29tbWl0IFNIQVxuICAgIC8vICVhZSAtIGF1dGhvciBlbWFpbFxuICAgIC8vICVhbiA9IGF1dGhvciBmdWxsIG5hbWVcbiAgICAvLyAlYXQgLSB0aW1lc3RhbXAsIFVOSVggdGltZXN0YW1wXG4gICAgLy8gJXMgLSBzdWJqZWN0XG4gICAgLy8gJWIgLSBib2R5XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICdsb2cnLFxuICAgICAgJy0tcHJldHR5PWZvcm1hdDolSCV4MDAlYWUleDAwJWFuJXgwMCVhdCV4MDAlcyV4MDAlYiV4MDAnLFxuICAgICAgJy0tbm8tYWJicmV2LWNvbW1pdCcsXG4gICAgICAnLS1uby1wcmVmaXgnLFxuICAgICAgJy0tbm8tZXh0LWRpZmYnLFxuICAgICAgJy0tbm8tcmVuYW1lcycsXG4gICAgICAnLXonLFxuICAgICAgJy1uJyxcbiAgICAgIG1heCxcbiAgICAgIHJlZixcbiAgICBdO1xuXG4gICAgaWYgKGluY2x1ZGVQYXRjaCkge1xuICAgICAgYXJncy5wdXNoKCctLXBhdGNoJywgJy1tJywgJy0tZmlyc3QtcGFyZW50Jyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKGFyZ3MuY29uY2F0KCctLScpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgaWYgKC91bmtub3duIHJldmlzaW9uLy50ZXN0KGVyci5zdGRFcnIpIHx8IC9iYWQgcmV2aXNpb24gJ0hFQUQnLy50ZXN0KGVyci5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChvdXRwdXQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gaW5jbHVkZVVuYm9ybiA/IFt7c2hhOiAnJywgbWVzc2FnZTogJycsIHVuYm9yblJlZjogdHJ1ZX1dIDogW107XG4gICAgfVxuXG4gICAgY29uc3QgZmllbGRzID0gb3V0cHV0LnRyaW0oKS5zcGxpdCgnXFwwJyk7XG5cbiAgICBjb25zdCBjb21taXRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpICs9IDcpIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBmaWVsZHNbaSArIDVdLnRyaW0oKTtcbiAgICAgIGxldCBwYXRjaCA9IFtdO1xuICAgICAgaWYgKGluY2x1ZGVQYXRjaCkge1xuICAgICAgICBjb25zdCBkaWZmcyA9IGZpZWxkc1tpICsgNl07XG4gICAgICAgIHBhdGNoID0gcGFyc2VEaWZmKGRpZmZzLnRyaW0oKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHttZXNzYWdlOiBtZXNzYWdlQm9keSwgY29BdXRob3JzfSA9IGV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlKGJvZHkpO1xuXG4gICAgICBjb21taXRzLnB1c2goe1xuICAgICAgICBzaGE6IGZpZWxkc1tpXSAmJiBmaWVsZHNbaV0udHJpbSgpLFxuICAgICAgICBhdXRob3I6IG5ldyBBdXRob3IoZmllbGRzW2kgKyAxXSAmJiBmaWVsZHNbaSArIDFdLnRyaW0oKSwgZmllbGRzW2kgKyAyXSAmJiBmaWVsZHNbaSArIDJdLnRyaW0oKSksXG4gICAgICAgIGF1dGhvckRhdGU6IHBhcnNlSW50KGZpZWxkc1tpICsgM10sIDEwKSxcbiAgICAgICAgbWVzc2FnZVN1YmplY3Q6IGZpZWxkc1tpICsgNF0sXG4gICAgICAgIG1lc3NhZ2VCb2R5LFxuICAgICAgICBjb0F1dGhvcnMsXG4gICAgICAgIHVuYm9yblJlZjogZmFsc2UsXG4gICAgICAgIHBhdGNoLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb21taXRzO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXV0aG9ycyhvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7bWF4LCByZWZ9ID0ge21heDogMSwgcmVmOiAnSEVBRCcsIC4uLm9wdGlvbnN9O1xuXG4gICAgLy8gaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1sb2cjX3ByZXR0eV9mb3JtYXRzXG4gICAgLy8gJXgxRiAtIGZpZWxkIHNlcGFyYXRvciBieXRlXG4gICAgLy8gJWFuIC0gYXV0aG9yIG5hbWVcbiAgICAvLyAlYWUgLSBhdXRob3IgZW1haWxcbiAgICAvLyAlY24gLSBjb21taXR0ZXIgbmFtZVxuICAgIC8vICVjZSAtIGNvbW1pdHRlciBlbWFpbFxuICAgIC8vICUodHJhaWxlcnM6dW5mb2xkLG9ubHkpIC0gdGhlIGNvbW1pdCBtZXNzYWdlIHRyYWlsZXJzLCBzZXBhcmF0ZWRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IG5ld2xpbmVzIGFuZCB1bmZvbGRlZCAoaS5lLiBwcm9wZXJseVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkIGFuZCBvbmUgdHJhaWxlciBwZXIgbGluZSkuXG5cbiAgICBjb25zdCBkZWxpbWl0ZXIgPSAnMUYnO1xuICAgIGNvbnN0IGRlbGltaXRlclN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoZGVsaW1pdGVyLCAxNikpO1xuICAgIGNvbnN0IGZpZWxkcyA9IFsnJWFuJywgJyVhZScsICclY24nLCAnJWNlJywgJyUodHJhaWxlcnM6dW5mb2xkLG9ubHkpJ107XG4gICAgY29uc3QgZm9ybWF0ID0gZmllbGRzLmpvaW4oYCV4JHtkZWxpbWl0ZXJ9YCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgdGhpcy5leGVjKFtcbiAgICAgICAgJ2xvZycsIGAtLWZvcm1hdD0ke2Zvcm1hdH1gLCAnLXonLCAnLW4nLCBtYXgsIHJlZiwgJy0tJyxcbiAgICAgIF0pO1xuXG4gICAgICByZXR1cm4gb3V0cHV0LnNwbGl0KCdcXDAnKVxuICAgICAgICAucmVkdWNlKChhY2MsIGxpbmUpID0+IHtcbiAgICAgICAgICBpZiAobGluZS5sZW5ndGggPT09IDApIHsgcmV0dXJuIGFjYzsgfVxuXG4gICAgICAgICAgY29uc3QgW2FuLCBhZSwgY24sIGNlLCB0cmFpbGVyc10gPSBsaW5lLnNwbGl0KGRlbGltaXRlclN0cmluZyk7XG4gICAgICAgICAgdHJhaWxlcnNcbiAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgIC5tYXAodHJhaWxlciA9PiB0cmFpbGVyLm1hdGNoKENPX0FVVEhPUl9SRUdFWCkpXG4gICAgICAgICAgICAuZmlsdGVyKG1hdGNoID0+IG1hdGNoICE9PSBudWxsKVxuICAgICAgICAgICAgLmZvckVhY2goKFtfLCBuYW1lLCBlbWFpbF0pID0+IHsgYWNjW2VtYWlsXSA9IG5hbWU7IH0pO1xuXG4gICAgICAgICAgYWNjW2FlXSA9IGFuO1xuICAgICAgICAgIGFjY1tjZV0gPSBjbjtcblxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICgvdW5rbm93biByZXZpc2lvbi8udGVzdChlcnIuc3RkRXJyKSB8fCAvYmFkIHJldmlzaW9uICdIRUFEJy8udGVzdChlcnIuc3RkRXJyKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWVyZ2VUcmFpbGVycyhjb21taXRNZXNzYWdlLCB0cmFpbGVycykge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2ludGVycHJldC10cmFpbGVycyddO1xuICAgIGZvciAoY29uc3QgdHJhaWxlciBvZiB0cmFpbGVycykge1xuICAgICAgYXJncy5wdXNoKCctLXRyYWlsZXInLCBgJHt0cmFpbGVyLnRva2VufT0ke3RyYWlsZXIudmFsdWV9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3N0ZGluOiBjb21taXRNZXNzYWdlfSk7XG4gIH1cblxuICByZWFkRmlsZUZyb21JbmRleChmaWxlUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydzaG93JywgYDoke3RvR2l0UGF0aFNlcChmaWxlUGF0aCl9YF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlXG4gICAqL1xuICBtZXJnZShicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3BnRXhlYyhbJ21lcmdlJywgYnJhbmNoTmFtZV0sIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgaXNNZXJnaW5nKGRvdEdpdERpcikge1xuICAgIHJldHVybiBmaWxlRXhpc3RzKHBhdGguam9pbihkb3RHaXREaXIsICdNRVJHRV9IRUFEJykpLmNhdGNoKCgpID0+IGZhbHNlKTtcbiAgfVxuXG4gIGFib3J0TWVyZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ21lcmdlJywgJy0tYWJvcnQnXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBjaGVja291dFNpZGUoc2lkZSwgcGF0aHMpIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2NoZWNrb3V0JywgYC0tJHtzaWRlfWAsIC4uLnBhdGhzLm1hcCh0b0dpdFBhdGhTZXApXSk7XG4gIH1cblxuICAvKipcbiAgICogUmViYXNlXG4gICAqL1xuICBhc3luYyBpc1JlYmFzaW5nKGRvdEdpdERpcikge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBmaWxlRXhpc3RzKHBhdGguam9pbihkb3RHaXREaXIsICdyZWJhc2UtbWVyZ2UnKSksXG4gICAgICBmaWxlRXhpc3RzKHBhdGguam9pbihkb3RHaXREaXIsICdyZWJhc2UtYXBwbHknKSksXG4gICAgXSk7XG4gICAgcmV0dXJuIHJlc3VsdHMuc29tZShyID0+IHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW90ZSBpbnRlcmFjdGlvbnNcbiAgICovXG4gIGNsb25lKHJlbW90ZVVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnY2xvbmUnXTtcbiAgICBpZiAob3B0aW9ucy5ub0xvY2FsKSB7IGFyZ3MucHVzaCgnLS1uby1sb2NhbCcpOyB9XG4gICAgaWYgKG9wdGlvbnMuYmFyZSkgeyBhcmdzLnB1c2goJy0tYmFyZScpOyB9XG4gICAgaWYgKG9wdGlvbnMucmVjdXJzaXZlKSB7IGFyZ3MucHVzaCgnLS1yZWN1cnNpdmUnKTsgfVxuICAgIGlmIChvcHRpb25zLnNvdXJjZVJlbW90ZU5hbWUpIHsgYXJncy5wdXNoKCctLW9yaWdpbicsIG9wdGlvbnMucmVtb3RlTmFtZSk7IH1cbiAgICBhcmdzLnB1c2gocmVtb3RlVXJsLCB0aGlzLndvcmtpbmdEaXIpO1xuXG4gICAgcmV0dXJuIHRoaXMuZXhlYyhhcmdzLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgZmV0Y2gocmVtb3RlTmFtZSwgYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydmZXRjaCcsIHJlbW90ZU5hbWUsIGJyYW5jaE5hbWVdLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgcHVsbChyZW1vdGVOYW1lLCBicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydwdWxsJywgcmVtb3RlTmFtZSwgb3B0aW9ucy5yZWZTcGVjIHx8IGJyYW5jaE5hbWVdO1xuICAgIGlmIChvcHRpb25zLmZmT25seSkge1xuICAgICAgYXJncy5wdXNoKCctLWZmLW9ubHknKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ3BnRXhlYyhhcmdzLCB7dXNlR2l0UHJvbXB0U2VydmVyOiB0cnVlLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgcHVzaChyZW1vdGVOYW1lLCBicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydwdXNoJywgcmVtb3RlTmFtZSB8fCAnb3JpZ2luJywgb3B0aW9ucy5yZWZTcGVjIHx8IGByZWZzL2hlYWRzLyR7YnJhbmNoTmFtZX1gXTtcbiAgICBpZiAob3B0aW9ucy5zZXRVcHN0cmVhbSkgeyBhcmdzLnB1c2goJy0tc2V0LXVwc3RyZWFtJyk7IH1cbiAgICBpZiAob3B0aW9ucy5mb3JjZSkgeyBhcmdzLnB1c2goJy0tZm9yY2UnKTsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3VzZUdpdFByb21wdFNlcnZlcjogdHJ1ZSwgd3JpdGVPcGVyYXRpb246IHRydWV9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmRvIE9wZXJhdGlvbnNcbiAgICovXG4gIHJlc2V0KHR5cGUsIHJldmlzaW9uID0gJ0hFQUQnKSB7XG4gICAgY29uc3QgdmFsaWRUeXBlcyA9IFsnc29mdCddO1xuICAgIGlmICghdmFsaWRUeXBlcy5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGUgJHt0eXBlfS4gTXVzdCBiZSBvbmUgb2Y6ICR7dmFsaWRUeXBlcy5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5leGVjKFsncmVzZXQnLCBgLS0ke3R5cGV9YCwgcmV2aXNpb25dKTtcbiAgfVxuXG4gIGRlbGV0ZVJlZihyZWYpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjKFsndXBkYXRlLXJlZicsICctZCcsIHJlZl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEJyYW5jaGVzXG4gICAqL1xuICBjaGVja291dChicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhcmdzID0gWydjaGVja291dCddO1xuICAgIGlmIChvcHRpb25zLmNyZWF0ZU5ldykge1xuICAgICAgYXJncy5wdXNoKCctYicpO1xuICAgIH1cbiAgICBhcmdzLnB1c2goYnJhbmNoTmFtZSk7XG4gICAgaWYgKG9wdGlvbnMuc3RhcnRQb2ludCkge1xuICAgICAgaWYgKG9wdGlvbnMudHJhY2spIHsgYXJncy5wdXNoKCctLXRyYWNrJyk7IH1cbiAgICAgIGFyZ3MucHVzaChvcHRpb25zLnN0YXJ0UG9pbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4ZWMoYXJncywge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBnZXRCcmFuY2hlcygpIHtcbiAgICBjb25zdCBmb3JtYXQgPSBbXG4gICAgICAnJShvYmplY3RuYW1lKScsICclKEhFQUQpJywgJyUocmVmbmFtZTpzaG9ydCknLFxuICAgICAgJyUodXBzdHJlYW0pJywgJyUodXBzdHJlYW06cmVtb3RlbmFtZSknLCAnJSh1cHN0cmVhbTpyZW1vdGVyZWYpJyxcbiAgICAgICclKHB1c2gpJywgJyUocHVzaDpyZW1vdGVuYW1lKScsICclKHB1c2g6cmVtb3RlcmVmKScsXG4gICAgXS5qb2luKCclMDAnKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhbJ2Zvci1lYWNoLXJlZicsIGAtLWZvcm1hdD0ke2Zvcm1hdH1gLCAncmVmcy9oZWFkcy8qKiddKTtcbiAgICByZXR1cm4gb3V0cHV0LnRyaW0oKS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkubWFwKGxpbmUgPT4ge1xuICAgICAgY29uc3QgW1xuICAgICAgICBzaGEsIGhlYWQsIG5hbWUsXG4gICAgICAgIHVwc3RyZWFtVHJhY2tpbmdSZWYsIHVwc3RyZWFtUmVtb3RlTmFtZSwgdXBzdHJlYW1SZW1vdGVSZWYsXG4gICAgICAgIHB1c2hUcmFja2luZ1JlZiwgcHVzaFJlbW90ZU5hbWUsIHB1c2hSZW1vdGVSZWYsXG4gICAgICBdID0gbGluZS5zcGxpdCgnXFwwJyk7XG5cbiAgICAgIGNvbnN0IGJyYW5jaCA9IHtuYW1lLCBzaGEsIGhlYWQ6IGhlYWQgPT09ICcqJ307XG4gICAgICBpZiAodXBzdHJlYW1UcmFja2luZ1JlZiB8fCB1cHN0cmVhbVJlbW90ZU5hbWUgfHwgdXBzdHJlYW1SZW1vdGVSZWYpIHtcbiAgICAgICAgYnJhbmNoLnVwc3RyZWFtID0ge1xuICAgICAgICAgIHRyYWNraW5nUmVmOiB1cHN0cmVhbVRyYWNraW5nUmVmLFxuICAgICAgICAgIHJlbW90ZU5hbWU6IHVwc3RyZWFtUmVtb3RlTmFtZSxcbiAgICAgICAgICByZW1vdGVSZWY6IHVwc3RyZWFtUmVtb3RlUmVmLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGJyYW5jaC51cHN0cmVhbSB8fCBwdXNoVHJhY2tpbmdSZWYgfHwgcHVzaFJlbW90ZU5hbWUgfHwgcHVzaFJlbW90ZVJlZikge1xuICAgICAgICBicmFuY2gucHVzaCA9IHtcbiAgICAgICAgICB0cmFja2luZ1JlZjogcHVzaFRyYWNraW5nUmVmLFxuICAgICAgICAgIHJlbW90ZU5hbWU6IHB1c2hSZW1vdGVOYW1lIHx8IChicmFuY2gudXBzdHJlYW0gJiYgYnJhbmNoLnVwc3RyZWFtLnJlbW90ZU5hbWUpLFxuICAgICAgICAgIHJlbW90ZVJlZjogcHVzaFJlbW90ZVJlZiB8fCAoYnJhbmNoLnVwc3RyZWFtICYmIGJyYW5jaC51cHN0cmVhbS5yZW1vdGVSZWYpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJyYW5jaDtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEJyYW5jaGVzV2l0aENvbW1pdChzaGEsIG9wdGlvbiA9IHt9KSB7XG4gICAgY29uc3QgYXJncyA9IFsnYnJhbmNoJywgJy0tZm9ybWF0PSUocmVmbmFtZSknLCAnLS1jb250YWlucycsIHNoYV07XG4gICAgaWYgKG9wdGlvbi5zaG93TG9jYWwgJiYgb3B0aW9uLnNob3dSZW1vdGUpIHtcbiAgICAgIGFyZ3Muc3BsaWNlKDEsIDAsICctLWFsbCcpO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uLnNob3dSZW1vdGUpIHtcbiAgICAgIGFyZ3Muc3BsaWNlKDEsIDAsICctLXJlbW90ZXMnKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbi5wYXR0ZXJuKSB7XG4gICAgICBhcmdzLnB1c2gob3B0aW9uLnBhdHRlcm4pO1xuICAgIH1cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZXhlYyhhcmdzKSkudHJpbSgpLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKTtcbiAgfVxuXG4gIGNoZWNrb3V0RmlsZXMocGF0aHMsIHJldmlzaW9uKSB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IGFyZ3MgPSBbJ2NoZWNrb3V0J107XG4gICAgaWYgKHJldmlzaW9uKSB7IGFyZ3MucHVzaChyZXZpc2lvbik7IH1cbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MuY29uY2F0KCctLScsIHBhdGhzLm1hcCh0b0dpdFBhdGhTZXApKSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBkZXNjcmliZUhlYWQoKSB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmV4ZWMoWydkZXNjcmliZScsICctLWNvbnRhaW5zJywgJy0tYWxsJywgJy0tYWx3YXlzJywgJ0hFQUQnXSkpLnRyaW0oKTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbmZpZyhvcHRpb24sIHtsb2NhbH0gPSB7fSkge1xuICAgIGxldCBvdXRwdXQ7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBhcmdzID0gWydjb25maWcnXTtcbiAgICAgIGlmIChsb2NhbCkgeyBhcmdzLnB1c2goJy0tbG9jYWwnKTsgfVxuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KG9wdGlvbik7XG4gICAgICBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyLmNvZGUgPT09IDEgfHwgZXJyLmNvZGUgPT09IDEyOCkge1xuICAgICAgICAvLyBObyBtYXRjaGluZyBjb25maWcgZm91bmQgT1IgLS1sb2NhbCBjYW4gb25seSBiZSB1c2VkIGluc2lkZSBhIGdpdCByZXBvc2l0b3J5XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQudHJpbSgpO1xuICB9XG5cbiAgc2V0Q29uZmlnKG9wdGlvbiwgdmFsdWUsIHtyZXBsYWNlQWxsLCBnbG9iYWx9ID0ge30pIHtcbiAgICBsZXQgYXJncyA9IFsnY29uZmlnJ107XG4gICAgaWYgKHJlcGxhY2VBbGwpIHsgYXJncy5wdXNoKCctLXJlcGxhY2UtYWxsJyk7IH1cbiAgICBpZiAoZ2xvYmFsKSB7IGFyZ3MucHVzaCgnLS1nbG9iYWwnKTsgfVxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChvcHRpb24sIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5leGVjKGFyZ3MsIHt3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgdW5zZXRDb25maWcob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlYyhbJ2NvbmZpZycsICctLXVuc2V0Jywgb3B0aW9uXSwge3dyaXRlT3BlcmF0aW9uOiB0cnVlfSk7XG4gIH1cblxuICBhc3luYyBnZXRSZW1vdGVzKCkge1xuICAgIGxldCBvdXRwdXQgPSBhd2FpdCB0aGlzLmdldENvbmZpZyhbJy0tZ2V0LXJlZ2V4cCcsICdecmVtb3RlXFxcXC4uKlxcXFwudXJsJCddLCB7bG9jYWw6IHRydWV9KTtcbiAgICBpZiAob3V0cHV0KSB7XG4gICAgICBvdXRwdXQgPSBvdXRwdXQudHJpbSgpO1xuICAgICAgaWYgKCFvdXRwdXQubGVuZ3RoKSB7IHJldHVybiBbXTsgfVxuICAgICAgcmV0dXJuIG91dHB1dC5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL15yZW1vdGVcXC4oLiopXFwudXJsICguKikkLyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogbWF0Y2hbMV0sXG4gICAgICAgICAgdXJsOiBtYXRjaFsyXSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9XG5cbiAgYWRkUmVtb3RlKG5hbWUsIHVybCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWMoWydyZW1vdGUnLCAnYWRkJywgbmFtZSwgdXJsXSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVCbG9iKHtmaWxlUGF0aCwgc3RkaW59ID0ge30pIHtcbiAgICBsZXQgb3V0cHV0O1xuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgb3V0cHV0ID0gKGF3YWl0IHRoaXMuZXhlYyhbJ2hhc2gtb2JqZWN0JywgJy13JywgZmlsZVBhdGhdLCB7d3JpdGVPcGVyYXRpb246IHRydWV9KSkudHJpbSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZS5zdGRFcnIgJiYgZS5zdGRFcnIubWF0Y2goL2ZhdGFsOiBDYW5ub3Qgb3BlbiAuKjogTm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeS8pKSB7XG4gICAgICAgICAgb3V0cHV0ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGRpbikge1xuICAgICAgb3V0cHV0ID0gKGF3YWl0IHRoaXMuZXhlYyhbJ2hhc2gtb2JqZWN0JywgJy13JywgJy0tc3RkaW4nXSwge3N0ZGluLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pKS50cmltKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBzdXBwbHkgZmlsZSBwYXRoIG9yIHN0ZGluJyk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBhc3luYyBleHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydjYXQtZmlsZScsICctcCcsIHNoYV0pO1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShhYnNGaWxlUGF0aCwgb3V0cHV0LCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgIHJldHVybiBhYnNGaWxlUGF0aDtcbiAgfVxuXG4gIGFzeW5jIGdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjKFsnY2F0LWZpbGUnLCAnLXAnLCBzaGFdKTtcbiAgfVxuXG4gIGFzeW5jIG1lcmdlRmlsZShvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJ21lcmdlLWZpbGUnLCAnLXAnLCBvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsXG4gICAgICAnLUwnLCAnY3VycmVudCcsICctTCcsICdhZnRlciBkaXNjYXJkJywgJy1MJywgJ2JlZm9yZSBkaXNjYXJkJyxcbiAgICBdO1xuICAgIGxldCBvdXRwdXQ7XG4gICAgbGV0IGNvbmZsaWN0ID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIG91dHB1dCA9IGF3YWl0IHRoaXMuZXhlYyhhcmdzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEdpdEVycm9yICYmIGUuY29kZSA9PT0gMSkge1xuICAgICAgICBvdXRwdXQgPSBlLnN0ZE91dDtcbiAgICAgICAgY29uZmxpY3QgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnRlcnByZXQgYSByZWxhdGl2ZSByZXN1bHRQYXRoIGFzIHJlbGF0aXZlIHRvIHRoZSByZXBvc2l0b3J5IHdvcmtpbmcgZGlyZWN0b3J5IGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZVxuICAgIC8vIG90aGVyIGFyZ3VtZW50cy5cbiAgICBjb25zdCByZXNvbHZlZFJlc3VsdFBhdGggPSBwYXRoLnJlc29sdmUodGhpcy53b3JraW5nRGlyLCByZXN1bHRQYXRoKTtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUocmVzb2x2ZWRSZXN1bHRQYXRoLCBvdXRwdXQsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG5cbiAgICByZXR1cm4ge2ZpbGVQYXRoOiBvdXJzUGF0aCwgcmVzdWx0UGF0aCwgY29uZmxpY3R9O1xuICB9XG5cbiAgYXN5bmMgd3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSB7XG4gICAgY29uc3QgZ2l0RmlsZVBhdGggPSB0b0dpdFBhdGhTZXAoZmlsZVBhdGgpO1xuICAgIGNvbnN0IGZpbGVNb2RlID0gYXdhaXQgdGhpcy5nZXRGaWxlTW9kZShmaWxlUGF0aCk7XG4gICAgbGV0IGluZGV4SW5mbyA9IGAwIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBcXHQke2dpdEZpbGVQYXRofVxcbmA7XG4gICAgaWYgKGNvbW1vbkJhc2VTaGEpIHsgaW5kZXhJbmZvICs9IGAke2ZpbGVNb2RlfSAke2NvbW1vbkJhc2VTaGF9IDFcXHQke2dpdEZpbGVQYXRofVxcbmA7IH1cbiAgICBpZiAob3Vyc1NoYSkgeyBpbmRleEluZm8gKz0gYCR7ZmlsZU1vZGV9ICR7b3Vyc1NoYX0gMlxcdCR7Z2l0RmlsZVBhdGh9XFxuYDsgfVxuICAgIGlmICh0aGVpcnNTaGEpIHsgaW5kZXhJbmZvICs9IGAke2ZpbGVNb2RlfSAke3RoZWlyc1NoYX0gM1xcdCR7Z2l0RmlsZVBhdGh9XFxuYDsgfVxuICAgIHJldHVybiB0aGlzLmV4ZWMoWyd1cGRhdGUtaW5kZXgnLCAnLS1pbmRleC1pbmZvJ10sIHtzdGRpbjogaW5kZXhJbmZvLCB3cml0ZU9wZXJhdGlvbjogdHJ1ZX0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0RmlsZU1vZGUoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCB0aGlzLmV4ZWMoWydscy1maWxlcycsICctLXN0YWdlJywgJy0tJywgdG9HaXRQYXRoU2VwKGZpbGVQYXRoKV0pO1xuICAgIGlmIChvdXRwdXQpIHtcbiAgICAgIHJldHVybiBvdXRwdXQuc2xpY2UoMCwgNik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBhd2FpdCBpc0ZpbGVFeGVjdXRhYmxlKHBhdGguam9pbih0aGlzLndvcmtpbmdEaXIsIGZpbGVQYXRoKSk7XG4gICAgICBjb25zdCBzeW1saW5rID0gYXdhaXQgaXNGaWxlU3ltbGluayhwYXRoLmpvaW4odGhpcy53b3JraW5nRGlyLCBmaWxlUGF0aCkpO1xuICAgICAgaWYgKHN5bWxpbmspIHtcbiAgICAgICAgcmV0dXJuIEZpbGUubW9kZXMuU1lNTElOSztcbiAgICAgIH0gZWxzZSBpZiAoZXhlY3V0YWJsZSkge1xuICAgICAgICByZXR1cm4gRmlsZS5tb2Rlcy5FWEVDVVRBQkxFO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEZpbGUubW9kZXMuTk9STUFMO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jb21tYW5kUXVldWUuZGlzcG9zZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQWRkZWRGaWxlUGF0Y2goZmlsZVBhdGgsIGNvbnRlbnRzLCBtb2RlLCByZWFscGF0aCkge1xuICBjb25zdCBodW5rcyA9IFtdO1xuICBpZiAoY29udGVudHMpIHtcbiAgICBsZXQgbm9OZXdMaW5lO1xuICAgIGxldCBsaW5lcztcbiAgICBpZiAobW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LKSB7XG4gICAgICBub05ld0xpbmUgPSBmYWxzZTtcbiAgICAgIGxpbmVzID0gW2ArJHt0b0dpdFBhdGhTZXAocmVhbHBhdGgpfWAsICdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9OZXdMaW5lID0gY29udGVudHNbY29udGVudHMubGVuZ3RoIC0gMV0gIT09ICdcXG4nO1xuICAgICAgbGluZXMgPSBjb250ZW50cy50cmltKCkuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpLm1hcChsaW5lID0+IGArJHtsaW5lfWApO1xuICAgIH1cbiAgICBpZiAobm9OZXdMaW5lKSB7IGxpbmVzLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpOyB9XG4gICAgaHVua3MucHVzaCh7XG4gICAgICBsaW5lcyxcbiAgICAgIG9sZFN0YXJ0TGluZTogMCxcbiAgICAgIG9sZExpbmVDb3VudDogMCxcbiAgICAgIG5ld1N0YXJ0TGluZTogMSxcbiAgICAgIGhlYWRpbmc6ICcnLFxuICAgICAgbmV3TGluZUNvdW50OiBub05ld0xpbmUgPyBsaW5lcy5sZW5ndGggLSAxIDogbGluZXMubGVuZ3RoLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgb2xkUGF0aDogbnVsbCxcbiAgICBuZXdQYXRoOiB0b05hdGl2ZVBhdGhTZXAoZmlsZVBhdGgpLFxuICAgIG9sZE1vZGU6IG51bGwsXG4gICAgbmV3TW9kZTogbW9kZSxcbiAgICBzdGF0dXM6ICdhZGRlZCcsXG4gICAgaHVua3MsXG4gIH07XG59XG4iXX0=