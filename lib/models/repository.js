"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _eventKit = require("event-kit");
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _yubikiri = _interopRequireDefault(require("yubikiri"));
var _actionPipeline = require("../action-pipeline");
var _compositeGitStrategy = _interopRequireDefault(require("../composite-git-strategy"));
var _author = _interopRequireWildcard(require("./author"));
var _branch = _interopRequireDefault(require("./branch"));
var _repositoryStates = require("./repository-states");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const MERGE_MARKER_REGEX = /^(>|<){7} \S+$/m;

// Internal option keys used to designate the desired initial state of a Repository.
const initialStateSym = Symbol('initialState');
class Repository {
  constructor(workingDirectoryPath, gitStrategy = null, options = {}) {
    this.workingDirectoryPath = workingDirectoryPath;
    this.git = gitStrategy || _compositeGitStrategy.default.create(workingDirectoryPath);
    this.emitter = new _eventKit.Emitter();
    this.loadPromise = new Promise(resolve => {
      const sub = this.onDidChangeState(() => {
        if (!this.isLoading()) {
          resolve();
          sub.dispose();
        } else if (this.isDestroyed()) {
          sub.dispose();
        }
      });
    });
    this.pipelineManager = options.pipelineManager || (0, _actionPipeline.getNullActionPipelineManager)();
    this.transitionTo(options[initialStateSym] || _repositoryStates.Loading);
  }
  static absent(options) {
    return new Repository(null, null, _objectSpread({
      [initialStateSym]: _repositoryStates.Absent
    }, options));
  }
  static loadingGuess(options) {
    return new Repository(null, null, _objectSpread({
      [initialStateSym]: _repositoryStates.LoadingGuess
    }, options));
  }
  static absentGuess(options) {
    return new Repository(null, null, _objectSpread({
      [initialStateSym]: _repositoryStates.AbsentGuess
    }, options));
  }

  // State management //////////////////////////////////////////////////////////////////////////////////////////////////

  transition(currentState, StateConstructor, ...payload) {
    if (currentState !== this.state) {
      // Attempted transition from a non-active state, most likely from an asynchronous start() method.
      return Promise.resolve();
    }
    const nextState = new StateConstructor(this, ...payload);
    this.state = nextState;
    this.emitter.emit('did-change-state', {
      from: currentState,
      to: this.state
    });
    if (!this.isDestroyed()) {
      this.emitter.emit('did-update');
    }
    return this.state.start();
  }
  transitionTo(StateConstructor, ...payload) {
    return this.transition(this.state, StateConstructor, ...payload);
  }
  getLoadPromise() {
    return this.isAbsent() ? Promise.reject(new Error('An absent repository will never load')) : this.loadPromise;
  }

  /*
   * Use `callback` to request user input from all git strategies.
   */
  setPromptCallback(callback) {
    this.git.getImplementers().forEach(strategy => strategy.setPromptCallback(callback));
  }

  // Pipeline
  getPipeline(actionName) {
    const actionKey = this.pipelineManager.actionKeys[actionName];
    return this.pipelineManager.getPipeline(actionKey);
  }
  executePipelineAction(actionName, fn, ...args) {
    const pipeline = this.getPipeline(actionName);
    return pipeline.run(fn, this, ...args);
  }

  // Event subscription ////////////////////////////////////////////////////////////////////////////////////////////////

  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }
  onDidChangeState(callback) {
    return this.emitter.on('did-change-state', callback);
  }
  onDidUpdate(callback) {
    return this.emitter.on('did-update', callback);
  }
  onDidGloballyInvalidate(callback) {
    return this.emitter.on('did-globally-invalidate', callback);
  }
  onPullError(callback) {
    return this.emitter.on('pull-error', callback);
  }
  didPullError() {
    return this.emitter.emit('pull-error');
  }

  // State-independent actions /////////////////////////////////////////////////////////////////////////////////////////
  // Actions that use direct filesystem access or otherwise don't need `this.git` to be available.

  async pathHasMergeMarkers(relativePath) {
    try {
      const contents = await _fsExtra.default.readFile(_path.default.join(this.getWorkingDirectoryPath(), relativePath), {
        encoding: 'utf8'
      });
      return MERGE_MARKER_REGEX.test(contents);
    } catch (e) {
      // EISDIR implies this is a submodule
      if (e.code === 'ENOENT' || e.code === 'EISDIR') {
        return false;
      } else {
        throw e;
      }
    }
  }
  async getMergeMessage() {
    try {
      const contents = await _fsExtra.default.readFile(_path.default.join(this.getGitDirectoryPath(), 'MERGE_MSG'), {
        encoding: 'utf8'
      });
      return contents.split(/\n/).filter(line => line.length > 0 && !line.startsWith('#')).join('\n');
    } catch (e) {
      return null;
    }
  }

  // State-independent accessors ///////////////////////////////////////////////////////////////////////////////////////

  getWorkingDirectoryPath() {
    return this.workingDirectoryPath;
  }
  setGitDirectoryPath(gitDirectoryPath) {
    this._gitDirectoryPath = gitDirectoryPath;
  }
  getGitDirectoryPath() {
    if (this._gitDirectoryPath) {
      return this._gitDirectoryPath;
    } else if (this.getWorkingDirectoryPath()) {
      return _path.default.join(this.getWorkingDirectoryPath(), '.git');
    } else {
      // Absent/Loading/etc.
      return null;
    }
  }
  isInState(stateName) {
    return this.state.constructor.name === stateName;
  }
  toString() {
    return `Repository(state=${this.state.constructor.name}, workdir="${this.getWorkingDirectoryPath()}")`;
  }

  // Compound Getters //////////////////////////////////////////////////////////////////////////////////////////////////
  // Accessor methods for data derived from other, state-provided getters.

  async getCurrentBranch() {
    const branches = await this.getBranches();
    const head = branches.getHeadBranch();
    if (head.isPresent()) {
      return head;
    }
    const description = await this.getHeadDescription();
    return _branch.default.createDetached(description || 'no branch');
  }
  async getUnstagedChanges() {
    const {
      unstagedFiles
    } = await this.getStatusBundle();
    return Object.keys(unstagedFiles).sort().map(filePath => {
      return {
        filePath,
        status: unstagedFiles[filePath]
      };
    });
  }
  async getStagedChanges() {
    const {
      stagedFiles
    } = await this.getStatusBundle();
    return Object.keys(stagedFiles).sort().map(filePath => {
      return {
        filePath,
        status: stagedFiles[filePath]
      };
    });
  }
  async getMergeConflicts() {
    const {
      mergeConflictFiles
    } = await this.getStatusBundle();
    return Object.keys(mergeConflictFiles).map(filePath => {
      return {
        filePath,
        status: mergeConflictFiles[filePath]
      };
    });
  }
  async isPartiallyStaged(fileName) {
    const {
      unstagedFiles,
      stagedFiles
    } = await this.getStatusBundle();
    const u = unstagedFiles[fileName];
    const s = stagedFiles[fileName];
    return u === 'modified' && s === 'modified' || u === 'modified' && s === 'added' || u === 'added' && s === 'deleted' || u === 'deleted' && s === 'modified';
  }
  async getRemoteForBranch(branchName) {
    const name = await this.getConfig(`branch.${branchName}.remote`);
    return (await this.getRemotes()).withName(name);
  }
  async saveDiscardHistory() {
    if (this.isDestroyed()) {
      return;
    }
    const historySha = await this.createDiscardHistoryBlob();
    if (this.isDestroyed()) {
      return;
    }
    await this.setConfig('atomGithub.historySha', historySha);
  }
  async getCommitter(options = {}) {
    const committer = await (0, _yubikiri.default)({
      email: this.getConfig('user.email', options),
      name: this.getConfig('user.name', options)
    });
    return committer.name !== null && committer.email !== null ? new _author.default(committer.email, committer.name) : _author.nullAuthor;
  }

  // todo (@annthurium, 3/2019): refactor GitHubTabController etc to use this method.
  async getCurrentGitHubRemote() {
    let currentRemote = null;
    const remotes = await this.getRemotes();
    const gitHubRemotes = remotes.filter(remote => remote.isGithubRepo());
    const selectedRemoteName = await this.getConfig('atomGithub.currentRemote');
    currentRemote = gitHubRemotes.withName(selectedRemoteName);
    if (!currentRemote.isPresent() && gitHubRemotes.size() === 1) {
      currentRemote = Array.from(gitHubRemotes)[0];
    }
    // todo: handle the case where multiple remotes are available and no chosen remote is set.
    return currentRemote;
  }
  async hasGitHubRemote(host, owner, name) {
    const remotes = await this.getRemotes();
    return remotes.matchingGitHubRepository(owner, name).length > 0;
  }
}

// The methods named here will be delegated to the current State.
//
// Duplicated here rather than just using `expectedDelegates` directly so that this file is grep-friendly for answering
// the question of "what all can a Repository do exactly".
exports.default = Repository;
const delegates = ['isLoadingGuess', 'isAbsentGuess', 'isAbsent', 'isLoading', 'isEmpty', 'isPresent', 'isTooLarge', 'isDestroyed', 'isUndetermined', 'showGitTabInit', 'showGitTabInitInProgress', 'showGitTabLoading', 'showStatusBarTiles', 'hasDirectory', 'isPublishable', 'init', 'clone', 'destroy', 'refresh', 'observeFilesystemChange', 'updateCommitMessageAfterFileSystemChange', 'stageFiles', 'unstageFiles', 'stageFilesFromParentCommit', 'stageFileModeChange', 'stageFileSymlinkChange', 'applyPatchToIndex', 'applyPatchToWorkdir', 'commit', 'merge', 'abortMerge', 'checkoutSide', 'mergeFile', 'writeMergeConflictToIndex', 'checkout', 'checkoutPathsAtRevision', 'undoLastCommit', 'fetch', 'pull', 'push', 'setConfig', 'createBlob', 'expandBlobToFile', 'createDiscardHistoryBlob', 'updateDiscardHistory', 'storeBeforeAndAfterBlobs', 'restoreLastDiscardInTempFiles', 'popDiscardHistory', 'clearDiscardHistory', 'discardWorkDirChangesForPaths', 'getStatusBundle', 'getStatusesForChangedFiles', 'getFilePatchForPath', 'getDiffsForFilePath', 'getStagedChangesPatch', 'readFileFromIndex', 'getLastCommit', 'getCommit', 'getRecentCommits', 'isCommitPushed', 'getAuthors', 'getBranches', 'getHeadDescription', 'isMerging', 'isRebasing', 'getRemotes', 'addRemote', 'getAheadCount', 'getBehindCount', 'getConfig', 'unsetConfig', 'getBlobContents', 'hasDiscardHistory', 'getDiscardHistory', 'getLastHistorySnapshots', 'getOperationStates', 'setCommitMessage', 'getCommitMessage', 'fetchCommitMessageTemplate', 'getCache', 'acceptInvalidation'];
for (let i = 0; i < delegates.length; i++) {
  const delegate = delegates[i];
  Repository.prototype[delegate] = function (...args) {
    return this.state[delegate](...args);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNRVJHRV9NQVJLRVJfUkVHRVgiLCJpbml0aWFsU3RhdGVTeW0iLCJTeW1ib2wiLCJSZXBvc2l0b3J5IiwiY29uc3RydWN0b3IiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdpdFN0cmF0ZWd5Iiwib3B0aW9ucyIsImdpdCIsIkNvbXBvc2l0ZUdpdFN0cmF0ZWd5IiwiY3JlYXRlIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJsb2FkUHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwic3ViIiwib25EaWRDaGFuZ2VTdGF0ZSIsImlzTG9hZGluZyIsImRpc3Bvc2UiLCJpc0Rlc3Ryb3llZCIsInBpcGVsaW5lTWFuYWdlciIsImdldE51bGxBY3Rpb25QaXBlbGluZU1hbmFnZXIiLCJ0cmFuc2l0aW9uVG8iLCJMb2FkaW5nIiwiYWJzZW50IiwiQWJzZW50IiwibG9hZGluZ0d1ZXNzIiwiTG9hZGluZ0d1ZXNzIiwiYWJzZW50R3Vlc3MiLCJBYnNlbnRHdWVzcyIsInRyYW5zaXRpb24iLCJjdXJyZW50U3RhdGUiLCJTdGF0ZUNvbnN0cnVjdG9yIiwicGF5bG9hZCIsInN0YXRlIiwibmV4dFN0YXRlIiwiZW1pdCIsImZyb20iLCJ0byIsInN0YXJ0IiwiZ2V0TG9hZFByb21pc2UiLCJpc0Fic2VudCIsInJlamVjdCIsIkVycm9yIiwic2V0UHJvbXB0Q2FsbGJhY2siLCJjYWxsYmFjayIsImdldEltcGxlbWVudGVycyIsImZvckVhY2giLCJzdHJhdGVneSIsImdldFBpcGVsaW5lIiwiYWN0aW9uTmFtZSIsImFjdGlvbktleSIsImFjdGlvbktleXMiLCJleGVjdXRlUGlwZWxpbmVBY3Rpb24iLCJmbiIsImFyZ3MiLCJwaXBlbGluZSIsInJ1biIsIm9uRGlkRGVzdHJveSIsIm9uIiwib25EaWRVcGRhdGUiLCJvbkRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsIm9uUHVsbEVycm9yIiwiZGlkUHVsbEVycm9yIiwicGF0aEhhc01lcmdlTWFya2VycyIsInJlbGF0aXZlUGF0aCIsImNvbnRlbnRzIiwiZnMiLCJyZWFkRmlsZSIsInBhdGgiLCJqb2luIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJlbmNvZGluZyIsInRlc3QiLCJlIiwiY29kZSIsImdldE1lcmdlTWVzc2FnZSIsImdldEdpdERpcmVjdG9yeVBhdGgiLCJzcGxpdCIsImZpbHRlciIsImxpbmUiLCJsZW5ndGgiLCJzdGFydHNXaXRoIiwic2V0R2l0RGlyZWN0b3J5UGF0aCIsImdpdERpcmVjdG9yeVBhdGgiLCJfZ2l0RGlyZWN0b3J5UGF0aCIsImlzSW5TdGF0ZSIsInN0YXRlTmFtZSIsIm5hbWUiLCJ0b1N0cmluZyIsImdldEN1cnJlbnRCcmFuY2giLCJicmFuY2hlcyIsImdldEJyYW5jaGVzIiwiaGVhZCIsImdldEhlYWRCcmFuY2giLCJpc1ByZXNlbnQiLCJkZXNjcmlwdGlvbiIsImdldEhlYWREZXNjcmlwdGlvbiIsIkJyYW5jaCIsImNyZWF0ZURldGFjaGVkIiwiZ2V0VW5zdGFnZWRDaGFuZ2VzIiwidW5zdGFnZWRGaWxlcyIsImdldFN0YXR1c0J1bmRsZSIsIk9iamVjdCIsImtleXMiLCJzb3J0IiwibWFwIiwiZmlsZVBhdGgiLCJzdGF0dXMiLCJnZXRTdGFnZWRDaGFuZ2VzIiwic3RhZ2VkRmlsZXMiLCJnZXRNZXJnZUNvbmZsaWN0cyIsIm1lcmdlQ29uZmxpY3RGaWxlcyIsImlzUGFydGlhbGx5U3RhZ2VkIiwiZmlsZU5hbWUiLCJ1IiwicyIsImdldFJlbW90ZUZvckJyYW5jaCIsImJyYW5jaE5hbWUiLCJnZXRDb25maWciLCJnZXRSZW1vdGVzIiwid2l0aE5hbWUiLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJoaXN0b3J5U2hhIiwiY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iIiwic2V0Q29uZmlnIiwiZ2V0Q29tbWl0dGVyIiwiY29tbWl0dGVyIiwieXViaWtpcmkiLCJlbWFpbCIsIkF1dGhvciIsIm51bGxBdXRob3IiLCJnZXRDdXJyZW50R2l0SHViUmVtb3RlIiwiY3VycmVudFJlbW90ZSIsInJlbW90ZXMiLCJnaXRIdWJSZW1vdGVzIiwicmVtb3RlIiwiaXNHaXRodWJSZXBvIiwic2VsZWN0ZWRSZW1vdGVOYW1lIiwic2l6ZSIsIkFycmF5IiwiaGFzR2l0SHViUmVtb3RlIiwiaG9zdCIsIm93bmVyIiwibWF0Y2hpbmdHaXRIdWJSZXBvc2l0b3J5IiwiZGVsZWdhdGVzIiwiaSIsImRlbGVnYXRlIiwicHJvdG90eXBlIl0sInNvdXJjZXMiOlsicmVwb3NpdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCB7Z2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlcn0gZnJvbSAnLi4vYWN0aW9uLXBpcGVsaW5lJztcbmltcG9ydCBDb21wb3NpdGVHaXRTdHJhdGVneSBmcm9tICcuLi9jb21wb3NpdGUtZ2l0LXN0cmF0ZWd5JztcbmltcG9ydCBBdXRob3IsIHtudWxsQXV0aG9yfSBmcm9tICcuL2F1dGhvcic7XG5pbXBvcnQgQnJhbmNoIGZyb20gJy4vYnJhbmNoJztcbmltcG9ydCB7TG9hZGluZywgQWJzZW50LCBMb2FkaW5nR3Vlc3MsIEFic2VudEd1ZXNzfSBmcm9tICcuL3JlcG9zaXRvcnktc3RhdGVzJztcblxuY29uc3QgTUVSR0VfTUFSS0VSX1JFR0VYID0gL14oPnw8KXs3fSBcXFMrJC9tO1xuXG4vLyBJbnRlcm5hbCBvcHRpb24ga2V5cyB1c2VkIHRvIGRlc2lnbmF0ZSB0aGUgZGVzaXJlZCBpbml0aWFsIHN0YXRlIG9mIGEgUmVwb3NpdG9yeS5cbmNvbnN0IGluaXRpYWxTdGF0ZVN5bSA9IFN5bWJvbCgnaW5pdGlhbFN0YXRlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9zaXRvcnkge1xuICBjb25zdHJ1Y3Rvcih3b3JraW5nRGlyZWN0b3J5UGF0aCwgZ2l0U3RyYXRlZ3kgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLndvcmtpbmdEaXJlY3RvcnlQYXRoID0gd29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgdGhpcy5naXQgPSBnaXRTdHJhdGVneSB8fCBDb21wb3NpdGVHaXRTdHJhdGVneS5jcmVhdGUod29ya2luZ0RpcmVjdG9yeVBhdGgpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMub25EaWRDaGFuZ2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRpbmcoKSkge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5waXBlbGluZU1hbmFnZXIgPSBvcHRpb25zLnBpcGVsaW5lTWFuYWdlciB8fCBnZXROdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyKCk7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8ob3B0aW9uc1tpbml0aWFsU3RhdGVTeW1dIHx8IExvYWRpbmcpO1xuICB9XG5cbiAgc3RhdGljIGFic2VudChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogQWJzZW50LCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZGluZ0d1ZXNzKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFJlcG9zaXRvcnkobnVsbCwgbnVsbCwge1tpbml0aWFsU3RhdGVTeW1dOiBMb2FkaW5nR3Vlc3MsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIHN0YXRpYyBhYnNlbnRHdWVzcyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogQWJzZW50R3Vlc3MsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIC8vIFN0YXRlIG1hbmFnZW1lbnQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB0cmFuc2l0aW9uKGN1cnJlbnRTdGF0ZSwgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCkge1xuICAgIGlmIChjdXJyZW50U3RhdGUgIT09IHRoaXMuc3RhdGUpIHtcbiAgICAgIC8vIEF0dGVtcHRlZCB0cmFuc2l0aW9uIGZyb20gYSBub24tYWN0aXZlIHN0YXRlLCBtb3N0IGxpa2VseSBmcm9tIGFuIGFzeW5jaHJvbm91cyBzdGFydCgpIG1ldGhvZC5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0U3RhdGUgPSBuZXcgU3RhdGVDb25zdHJ1Y3Rvcih0aGlzLCAuLi5wYXlsb2FkKTtcbiAgICB0aGlzLnN0YXRlID0gbmV4dFN0YXRlO1xuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc3RhdGUnLCB7ZnJvbTogY3VycmVudFN0YXRlLCB0bzogdGhpcy5zdGF0ZX0pO1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXRlLnN0YXJ0KCk7XG4gIH1cblxuICB0cmFuc2l0aW9uVG8oU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24odGhpcy5zdGF0ZSwgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCk7XG4gIH1cblxuICBnZXRMb2FkUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0Fic2VudCgpID8gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdBbiBhYnNlbnQgcmVwb3NpdG9yeSB3aWxsIG5ldmVyIGxvYWQnKSkgOiB0aGlzLmxvYWRQcm9taXNlO1xuICB9XG5cbiAgLypcbiAgICogVXNlIGBjYWxsYmFja2AgdG8gcmVxdWVzdCB1c2VyIGlucHV0IGZyb20gYWxsIGdpdCBzdHJhdGVnaWVzLlxuICAgKi9cbiAgc2V0UHJvbXB0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLmdpdC5nZXRJbXBsZW1lbnRlcnMoKS5mb3JFYWNoKHN0cmF0ZWd5ID0+IHN0cmF0ZWd5LnNldFByb21wdENhbGxiYWNrKGNhbGxiYWNrKSk7XG4gIH1cblxuICAvLyBQaXBlbGluZVxuICBnZXRQaXBlbGluZShhY3Rpb25OYW1lKSB7XG4gICAgY29uc3QgYWN0aW9uS2V5ID0gdGhpcy5waXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5c1thY3Rpb25OYW1lXTtcbiAgICByZXR1cm4gdGhpcy5waXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUoYWN0aW9uS2V5KTtcbiAgfVxuXG4gIGV4ZWN1dGVQaXBlbGluZUFjdGlvbihhY3Rpb25OYW1lLCBmbiwgLi4uYXJncykge1xuICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5nZXRQaXBlbGluZShhY3Rpb25OYW1lKTtcbiAgICByZXR1cm4gcGlwZWxpbmUucnVuKGZuLCB0aGlzLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8vIEV2ZW50IHN1YnNjcmlwdGlvbiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXN0YXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRHbG9iYWxseUludmFsaWRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZ2xvYmFsbHktaW52YWxpZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uUHVsbEVycm9yKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbigncHVsbC1lcnJvcicsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRpZFB1bGxFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLmVtaXQoJ3B1bGwtZXJyb3InKTtcbiAgfVxuXG4gIC8vIFN0YXRlLWluZGVwZW5kZW50IGFjdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWN0aW9ucyB0aGF0IHVzZSBkaXJlY3QgZmlsZXN5c3RlbSBhY2Nlc3Mgb3Igb3RoZXJ3aXNlIGRvbid0IG5lZWQgYHRoaXMuZ2l0YCB0byBiZSBhdmFpbGFibGUuXG5cbiAgYXN5bmMgcGF0aEhhc01lcmdlTWFya2VycyhyZWxhdGl2ZVBhdGgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShwYXRoLmpvaW4odGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCByZWxhdGl2ZVBhdGgpLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgICAgcmV0dXJuIE1FUkdFX01BUktFUl9SRUdFWC50ZXN0KGNvbnRlbnRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBFSVNESVIgaW1wbGllcyB0aGlzIGlzIGEgc3VibW9kdWxlXG4gICAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJyB8fCBlLmNvZGUgPT09ICdFSVNESVInKSB7IHJldHVybiBmYWxzZTsgfSBlbHNlIHsgdGhyb3cgZTsgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldE1lcmdlTWVzc2FnZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShwYXRoLmpvaW4odGhpcy5nZXRHaXREaXJlY3RvcnlQYXRoKCksICdNRVJHRV9NU0cnKSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIHJldHVybiBjb250ZW50cy5zcGxpdCgvXFxuLykuZmlsdGVyKGxpbmUgPT4gbGluZS5sZW5ndGggPiAwICYmICFsaW5lLnN0YXJ0c1dpdGgoJyMnKSkuam9pbignXFxuJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGUtaW5kZXBlbmRlbnQgYWNjZXNzb3JzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIGdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICB9XG5cbiAgc2V0R2l0RGlyZWN0b3J5UGF0aChnaXREaXJlY3RvcnlQYXRoKSB7XG4gICAgdGhpcy5fZ2l0RGlyZWN0b3J5UGF0aCA9IGdpdERpcmVjdG9yeVBhdGg7XG4gIH1cblxuICBnZXRHaXREaXJlY3RvcnlQYXRoKCkge1xuICAgIGlmICh0aGlzLl9naXREaXJlY3RvcnlQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2l0RGlyZWN0b3J5UGF0aDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkge1xuICAgICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksICcuZ2l0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFic2VudC9Mb2FkaW5nL2V0Yy5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5TdGF0ZShzdGF0ZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBzdGF0ZU5hbWU7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFJlcG9zaXRvcnkoc3RhdGU9JHt0aGlzLnN0YXRlLmNvbnN0cnVjdG9yLm5hbWV9LCB3b3JrZGlyPVwiJHt0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCl9XCIpYDtcbiAgfVxuXG4gIC8vIENvbXBvdW5kIEdldHRlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWNjZXNzb3IgbWV0aG9kcyBmb3IgZGF0YSBkZXJpdmVkIGZyb20gb3RoZXIsIHN0YXRlLXByb3ZpZGVkIGdldHRlcnMuXG5cbiAgYXN5bmMgZ2V0Q3VycmVudEJyYW5jaCgpIHtcbiAgICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IHRoaXMuZ2V0QnJhbmNoZXMoKTtcbiAgICBjb25zdCBoZWFkID0gYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpO1xuICAgIGlmIChoZWFkLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gaGVhZDtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGF3YWl0IHRoaXMuZ2V0SGVhZERlc2NyaXB0aW9uKCk7XG4gICAgcmV0dXJuIEJyYW5jaC5jcmVhdGVEZXRhY2hlZChkZXNjcmlwdGlvbiB8fCAnbm8gYnJhbmNoJyk7XG4gIH1cblxuICBhc3luYyBnZXRVbnN0YWdlZENoYW5nZXMoKSB7XG4gICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModW5zdGFnZWRGaWxlcylcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZmlsZVBhdGggPT4geyByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IHVuc3RhZ2VkRmlsZXNbZmlsZVBhdGhdfTsgfSk7XG4gIH1cblxuICBhc3luYyBnZXRTdGFnZWRDaGFuZ2VzKCkge1xuICAgIGNvbnN0IHtzdGFnZWRGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzdGFnZWRGaWxlcylcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZmlsZVBhdGggPT4geyByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IHN0YWdlZEZpbGVzW2ZpbGVQYXRoXX07IH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0TWVyZ2VDb25mbGljdHMoKSB7XG4gICAgY29uc3Qge21lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZUNvbmZsaWN0RmlsZXMpLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IG1lcmdlQ29uZmxpY3RGaWxlc1tmaWxlUGF0aF19O1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaXNQYXJ0aWFsbHlTdGFnZWQoZmlsZU5hbWUpIHtcbiAgICBjb25zdCB7dW5zdGFnZWRGaWxlcywgc3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICBjb25zdCB1ID0gdW5zdGFnZWRGaWxlc1tmaWxlTmFtZV07XG4gICAgY29uc3QgcyA9IHN0YWdlZEZpbGVzW2ZpbGVOYW1lXTtcbiAgICByZXR1cm4gKHUgPT09ICdtb2RpZmllZCcgJiYgcyA9PT0gJ21vZGlmaWVkJykgfHxcbiAgICAgICh1ID09PSAnbW9kaWZpZWQnICYmIHMgPT09ICdhZGRlZCcpIHx8XG4gICAgICAodSA9PT0gJ2FkZGVkJyAmJiBzID09PSAnZGVsZXRlZCcpIHx8XG4gICAgICAodSA9PT0gJ2RlbGV0ZWQnICYmIHMgPT09ICdtb2RpZmllZCcpO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpIHtcbiAgICBjb25zdCBuYW1lID0gYXdhaXQgdGhpcy5nZXRDb25maWcoYGJyYW5jaC4ke2JyYW5jaE5hbWV9LnJlbW90ZWApO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRSZW1vdGVzKCkpLndpdGhOYW1lKG5hbWUpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBoaXN0b3J5U2hhID0gYXdhaXQgdGhpcy5jcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IoKTtcbiAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuc2V0Q29uZmlnKCdhdG9tR2l0aHViLmhpc3RvcnlTaGEnLCBoaXN0b3J5U2hhKTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbW1pdHRlcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBjb21taXR0ZXIgPSBhd2FpdCB5dWJpa2lyaSh7XG4gICAgICBlbWFpbDogdGhpcy5nZXRDb25maWcoJ3VzZXIuZW1haWwnLCBvcHRpb25zKSxcbiAgICAgIG5hbWU6IHRoaXMuZ2V0Q29uZmlnKCd1c2VyLm5hbWUnLCBvcHRpb25zKSxcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21taXR0ZXIubmFtZSAhPT0gbnVsbCAmJiBjb21taXR0ZXIuZW1haWwgIT09IG51bGxcbiAgICAgID8gbmV3IEF1dGhvcihjb21taXR0ZXIuZW1haWwsIGNvbW1pdHRlci5uYW1lKVxuICAgICAgOiBudWxsQXV0aG9yO1xuICB9XG5cbiAgLy8gdG9kbyAoQGFubnRodXJpdW0sIDMvMjAxOSk6IHJlZmFjdG9yIEdpdEh1YlRhYkNvbnRyb2xsZXIgZXRjIHRvIHVzZSB0aGlzIG1ldGhvZC5cbiAgYXN5bmMgZ2V0Q3VycmVudEdpdEh1YlJlbW90ZSgpIHtcbiAgICBsZXQgY3VycmVudFJlbW90ZSA9IG51bGw7XG5cbiAgICBjb25zdCByZW1vdGVzID0gYXdhaXQgdGhpcy5nZXRSZW1vdGVzKCk7XG5cbiAgICBjb25zdCBnaXRIdWJSZW1vdGVzID0gcmVtb3Rlcy5maWx0ZXIocmVtb3RlID0+IHJlbW90ZS5pc0dpdGh1YlJlcG8oKSk7XG4gICAgY29uc3Qgc2VsZWN0ZWRSZW1vdGVOYW1lID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2F0b21HaXRodWIuY3VycmVudFJlbW90ZScpO1xuICAgIGN1cnJlbnRSZW1vdGUgPSBnaXRIdWJSZW1vdGVzLndpdGhOYW1lKHNlbGVjdGVkUmVtb3RlTmFtZSk7XG5cbiAgICBpZiAoIWN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCkgJiYgZ2l0SHViUmVtb3Rlcy5zaXplKCkgPT09IDEpIHtcbiAgICAgIGN1cnJlbnRSZW1vdGUgPSBBcnJheS5mcm9tKGdpdEh1YlJlbW90ZXMpWzBdO1xuICAgIH1cbiAgICAvLyB0b2RvOiBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgbXVsdGlwbGUgcmVtb3RlcyBhcmUgYXZhaWxhYmxlIGFuZCBubyBjaG9zZW4gcmVtb3RlIGlzIHNldC5cbiAgICByZXR1cm4gY3VycmVudFJlbW90ZTtcbiAgfVxuXG5cbiAgYXN5bmMgaGFzR2l0SHViUmVtb3RlKGhvc3QsIG93bmVyLCBuYW1lKSB7XG4gICAgY29uc3QgcmVtb3RlcyA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpO1xuICAgIHJldHVybiByZW1vdGVzLm1hdGNoaW5nR2l0SHViUmVwb3NpdG9yeShvd25lciwgbmFtZSkubGVuZ3RoID4gMDtcbiAgfVxufVxuXG4vLyBUaGUgbWV0aG9kcyBuYW1lZCBoZXJlIHdpbGwgYmUgZGVsZWdhdGVkIHRvIHRoZSBjdXJyZW50IFN0YXRlLlxuLy9cbi8vIER1cGxpY2F0ZWQgaGVyZSByYXRoZXIgdGhhbiBqdXN0IHVzaW5nIGBleHBlY3RlZERlbGVnYXRlc2AgZGlyZWN0bHkgc28gdGhhdCB0aGlzIGZpbGUgaXMgZ3JlcC1mcmllbmRseSBmb3IgYW5zd2VyaW5nXG4vLyB0aGUgcXVlc3Rpb24gb2YgXCJ3aGF0IGFsbCBjYW4gYSBSZXBvc2l0b3J5IGRvIGV4YWN0bHlcIi5cbmNvbnN0IGRlbGVnYXRlcyA9IFtcbiAgJ2lzTG9hZGluZ0d1ZXNzJyxcbiAgJ2lzQWJzZW50R3Vlc3MnLFxuICAnaXNBYnNlbnQnLFxuICAnaXNMb2FkaW5nJyxcbiAgJ2lzRW1wdHknLFxuICAnaXNQcmVzZW50JyxcbiAgJ2lzVG9vTGFyZ2UnLFxuICAnaXNEZXN0cm95ZWQnLFxuXG4gICdpc1VuZGV0ZXJtaW5lZCcsXG4gICdzaG93R2l0VGFiSW5pdCcsXG4gICdzaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MnLFxuICAnc2hvd0dpdFRhYkxvYWRpbmcnLFxuICAnc2hvd1N0YXR1c0JhclRpbGVzJyxcbiAgJ2hhc0RpcmVjdG9yeScsXG4gICdpc1B1Ymxpc2hhYmxlJyxcblxuICAnaW5pdCcsXG4gICdjbG9uZScsXG4gICdkZXN0cm95JyxcbiAgJ3JlZnJlc2gnLFxuICAnb2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UnLFxuICAndXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZScsXG5cbiAgJ3N0YWdlRmlsZXMnLFxuICAndW5zdGFnZUZpbGVzJyxcbiAgJ3N0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0JyxcbiAgJ3N0YWdlRmlsZU1vZGVDaGFuZ2UnLFxuICAnc3RhZ2VGaWxlU3ltbGlua0NoYW5nZScsXG4gICdhcHBseVBhdGNoVG9JbmRleCcsXG4gICdhcHBseVBhdGNoVG9Xb3JrZGlyJyxcblxuICAnY29tbWl0JyxcblxuICAnbWVyZ2UnLFxuICAnYWJvcnRNZXJnZScsXG4gICdjaGVja291dFNpZGUnLFxuICAnbWVyZ2VGaWxlJyxcbiAgJ3dyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgnLFxuXG4gICdjaGVja291dCcsXG4gICdjaGVja291dFBhdGhzQXRSZXZpc2lvbicsXG5cbiAgJ3VuZG9MYXN0Q29tbWl0JyxcblxuICAnZmV0Y2gnLFxuICAncHVsbCcsXG4gICdwdXNoJyxcblxuICAnc2V0Q29uZmlnJyxcblxuICAnY3JlYXRlQmxvYicsXG4gICdleHBhbmRCbG9iVG9GaWxlJyxcblxuICAnY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iJyxcbiAgJ3VwZGF0ZURpc2NhcmRIaXN0b3J5JyxcbiAgJ3N0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icycsXG4gICdyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcycsXG4gICdwb3BEaXNjYXJkSGlzdG9yeScsXG4gICdjbGVhckRpc2NhcmRIaXN0b3J5JyxcbiAgJ2Rpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzJyxcblxuICAnZ2V0U3RhdHVzQnVuZGxlJyxcbiAgJ2dldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzJyxcbiAgJ2dldEZpbGVQYXRjaEZvclBhdGgnLFxuICAnZ2V0RGlmZnNGb3JGaWxlUGF0aCcsXG4gICdnZXRTdGFnZWRDaGFuZ2VzUGF0Y2gnLFxuICAncmVhZEZpbGVGcm9tSW5kZXgnLFxuXG4gICdnZXRMYXN0Q29tbWl0JyxcbiAgJ2dldENvbW1pdCcsXG4gICdnZXRSZWNlbnRDb21taXRzJyxcbiAgJ2lzQ29tbWl0UHVzaGVkJyxcblxuICAnZ2V0QXV0aG9ycycsXG5cbiAgJ2dldEJyYW5jaGVzJyxcbiAgJ2dldEhlYWREZXNjcmlwdGlvbicsXG5cbiAgJ2lzTWVyZ2luZycsXG4gICdpc1JlYmFzaW5nJyxcblxuICAnZ2V0UmVtb3RlcycsXG4gICdhZGRSZW1vdGUnLFxuXG4gICdnZXRBaGVhZENvdW50JyxcbiAgJ2dldEJlaGluZENvdW50JyxcblxuICAnZ2V0Q29uZmlnJyxcbiAgJ3Vuc2V0Q29uZmlnJyxcblxuICAnZ2V0QmxvYkNvbnRlbnRzJyxcblxuICAnaGFzRGlzY2FyZEhpc3RvcnknLFxuICAnZ2V0RGlzY2FyZEhpc3RvcnknLFxuICAnZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMnLFxuXG4gICdnZXRPcGVyYXRpb25TdGF0ZXMnLFxuXG4gICdzZXRDb21taXRNZXNzYWdlJyxcbiAgJ2dldENvbW1pdE1lc3NhZ2UnLFxuICAnZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUnLFxuICAnZ2V0Q2FjaGUnLFxuICAnYWNjZXB0SW52YWxpZGF0aW9uJyxcbl07XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgZGVsZWdhdGVzLmxlbmd0aDsgaSsrKSB7XG4gIGNvbnN0IGRlbGVnYXRlID0gZGVsZWdhdGVzW2ldO1xuXG4gIFJlcG9zaXRvcnkucHJvdG90eXBlW2RlbGVnYXRlXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVtkZWxlZ2F0ZV0oLi4uYXJncyk7XG4gIH07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUErRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRS9FLE1BQU1BLGtCQUFrQixHQUFHLGlCQUFpQjs7QUFFNUM7QUFDQSxNQUFNQyxlQUFlLEdBQUdDLE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFFL0IsTUFBTUMsVUFBVSxDQUFDO0VBQzlCQyxXQUFXLENBQUNDLG9CQUFvQixFQUFFQyxXQUFXLEdBQUcsSUFBSSxFQUFFQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDbEUsSUFBSSxDQUFDRixvQkFBb0IsR0FBR0Esb0JBQW9CO0lBQ2hELElBQUksQ0FBQ0csR0FBRyxHQUFHRixXQUFXLElBQUlHLDZCQUFv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