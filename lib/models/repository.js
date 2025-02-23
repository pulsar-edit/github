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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfeXViaWtpcmkiLCJfYWN0aW9uUGlwZWxpbmUiLCJfY29tcG9zaXRlR2l0U3RyYXRlZ3kiLCJfYXV0aG9yIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfYnJhbmNoIiwiX3JlcG9zaXRvcnlTdGF0ZXMiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJuIiwiX19wcm90b19fIiwiYSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImkiLCJzZXQiLCJvd25LZXlzIiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsIl90b1Byb3BlcnR5S2V5IiwidmFsdWUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIl90b1ByaW1pdGl2ZSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiVHlwZUVycm9yIiwiU3RyaW5nIiwiTnVtYmVyIiwiTUVSR0VfTUFSS0VSX1JFR0VYIiwiaW5pdGlhbFN0YXRlU3ltIiwiUmVwb3NpdG9yeSIsImNvbnN0cnVjdG9yIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJnaXRTdHJhdGVneSIsIm9wdGlvbnMiLCJnaXQiLCJDb21wb3NpdGVHaXRTdHJhdGVneSIsImNyZWF0ZSIsImVtaXR0ZXIiLCJFbWl0dGVyIiwibG9hZFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YiIsIm9uRGlkQ2hhbmdlU3RhdGUiLCJpc0xvYWRpbmciLCJkaXNwb3NlIiwiaXNEZXN0cm95ZWQiLCJwaXBlbGluZU1hbmFnZXIiLCJnZXROdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyIiwidHJhbnNpdGlvblRvIiwiTG9hZGluZyIsImFic2VudCIsIkFic2VudCIsImxvYWRpbmdHdWVzcyIsIkxvYWRpbmdHdWVzcyIsImFic2VudEd1ZXNzIiwiQWJzZW50R3Vlc3MiLCJ0cmFuc2l0aW9uIiwiY3VycmVudFN0YXRlIiwiU3RhdGVDb25zdHJ1Y3RvciIsInBheWxvYWQiLCJzdGF0ZSIsIm5leHRTdGF0ZSIsImVtaXQiLCJmcm9tIiwidG8iLCJzdGFydCIsImdldExvYWRQcm9taXNlIiwiaXNBYnNlbnQiLCJyZWplY3QiLCJFcnJvciIsInNldFByb21wdENhbGxiYWNrIiwiY2FsbGJhY2siLCJnZXRJbXBsZW1lbnRlcnMiLCJzdHJhdGVneSIsImdldFBpcGVsaW5lIiwiYWN0aW9uTmFtZSIsImFjdGlvbktleSIsImFjdGlvbktleXMiLCJleGVjdXRlUGlwZWxpbmVBY3Rpb24iLCJmbiIsImFyZ3MiLCJwaXBlbGluZSIsInJ1biIsIm9uRGlkRGVzdHJveSIsIm9uIiwib25EaWRVcGRhdGUiLCJvbkRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsIm9uUHVsbEVycm9yIiwiZGlkUHVsbEVycm9yIiwicGF0aEhhc01lcmdlTWFya2VycyIsInJlbGF0aXZlUGF0aCIsImNvbnRlbnRzIiwiZnMiLCJyZWFkRmlsZSIsInBhdGgiLCJqb2luIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJlbmNvZGluZyIsInRlc3QiLCJjb2RlIiwiZ2V0TWVyZ2VNZXNzYWdlIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsInNwbGl0IiwibGluZSIsInN0YXJ0c1dpdGgiLCJzZXRHaXREaXJlY3RvcnlQYXRoIiwiZ2l0RGlyZWN0b3J5UGF0aCIsIl9naXREaXJlY3RvcnlQYXRoIiwiaXNJblN0YXRlIiwic3RhdGVOYW1lIiwibmFtZSIsInRvU3RyaW5nIiwiZ2V0Q3VycmVudEJyYW5jaCIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJoZWFkIiwiZ2V0SGVhZEJyYW5jaCIsImlzUHJlc2VudCIsImRlc2NyaXB0aW9uIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiQnJhbmNoIiwiY3JlYXRlRGV0YWNoZWQiLCJnZXRVbnN0YWdlZENoYW5nZXMiLCJ1bnN0YWdlZEZpbGVzIiwiZ2V0U3RhdHVzQnVuZGxlIiwic29ydCIsIm1hcCIsImZpbGVQYXRoIiwic3RhdHVzIiwiZ2V0U3RhZ2VkQ2hhbmdlcyIsInN0YWdlZEZpbGVzIiwiZ2V0TWVyZ2VDb25mbGljdHMiLCJtZXJnZUNvbmZsaWN0RmlsZXMiLCJpc1BhcnRpYWxseVN0YWdlZCIsImZpbGVOYW1lIiwicyIsImdldFJlbW90ZUZvckJyYW5jaCIsImJyYW5jaE5hbWUiLCJnZXRDb25maWciLCJnZXRSZW1vdGVzIiwid2l0aE5hbWUiLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJoaXN0b3J5U2hhIiwiY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iIiwic2V0Q29uZmlnIiwiZ2V0Q29tbWl0dGVyIiwiY29tbWl0dGVyIiwieXViaWtpcmkiLCJlbWFpbCIsIkF1dGhvciIsIm51bGxBdXRob3IiLCJnZXRDdXJyZW50R2l0SHViUmVtb3RlIiwiY3VycmVudFJlbW90ZSIsInJlbW90ZXMiLCJnaXRIdWJSZW1vdGVzIiwicmVtb3RlIiwiaXNHaXRodWJSZXBvIiwic2VsZWN0ZWRSZW1vdGVOYW1lIiwic2l6ZSIsIkFycmF5IiwiaGFzR2l0SHViUmVtb3RlIiwiaG9zdCIsIm93bmVyIiwibWF0Y2hpbmdHaXRIdWJSZXBvc2l0b3J5IiwiZXhwb3J0cyIsImRlbGVnYXRlcyIsImRlbGVnYXRlIiwicHJvdG90eXBlIl0sInNvdXJjZXMiOlsicmVwb3NpdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCB7Z2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlcn0gZnJvbSAnLi4vYWN0aW9uLXBpcGVsaW5lJztcbmltcG9ydCBDb21wb3NpdGVHaXRTdHJhdGVneSBmcm9tICcuLi9jb21wb3NpdGUtZ2l0LXN0cmF0ZWd5JztcbmltcG9ydCBBdXRob3IsIHtudWxsQXV0aG9yfSBmcm9tICcuL2F1dGhvcic7XG5pbXBvcnQgQnJhbmNoIGZyb20gJy4vYnJhbmNoJztcbmltcG9ydCB7TG9hZGluZywgQWJzZW50LCBMb2FkaW5nR3Vlc3MsIEFic2VudEd1ZXNzfSBmcm9tICcuL3JlcG9zaXRvcnktc3RhdGVzJztcblxuY29uc3QgTUVSR0VfTUFSS0VSX1JFR0VYID0gL14oPnw8KXs3fSBcXFMrJC9tO1xuXG4vLyBJbnRlcm5hbCBvcHRpb24ga2V5cyB1c2VkIHRvIGRlc2lnbmF0ZSB0aGUgZGVzaXJlZCBpbml0aWFsIHN0YXRlIG9mIGEgUmVwb3NpdG9yeS5cbmNvbnN0IGluaXRpYWxTdGF0ZVN5bSA9IFN5bWJvbCgnaW5pdGlhbFN0YXRlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9zaXRvcnkge1xuICBjb25zdHJ1Y3Rvcih3b3JraW5nRGlyZWN0b3J5UGF0aCwgZ2l0U3RyYXRlZ3kgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLndvcmtpbmdEaXJlY3RvcnlQYXRoID0gd29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgdGhpcy5naXQgPSBnaXRTdHJhdGVneSB8fCBDb21wb3NpdGVHaXRTdHJhdGVneS5jcmVhdGUod29ya2luZ0RpcmVjdG9yeVBhdGgpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMub25EaWRDaGFuZ2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRpbmcoKSkge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5waXBlbGluZU1hbmFnZXIgPSBvcHRpb25zLnBpcGVsaW5lTWFuYWdlciB8fCBnZXROdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyKCk7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8ob3B0aW9uc1tpbml0aWFsU3RhdGVTeW1dIHx8IExvYWRpbmcpO1xuICB9XG5cbiAgc3RhdGljIGFic2VudChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogQWJzZW50LCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZGluZ0d1ZXNzKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFJlcG9zaXRvcnkobnVsbCwgbnVsbCwge1tpbml0aWFsU3RhdGVTeW1dOiBMb2FkaW5nR3Vlc3MsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIHN0YXRpYyBhYnNlbnRHdWVzcyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogQWJzZW50R3Vlc3MsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIC8vIFN0YXRlIG1hbmFnZW1lbnQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB0cmFuc2l0aW9uKGN1cnJlbnRTdGF0ZSwgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCkge1xuICAgIGlmIChjdXJyZW50U3RhdGUgIT09IHRoaXMuc3RhdGUpIHtcbiAgICAgIC8vIEF0dGVtcHRlZCB0cmFuc2l0aW9uIGZyb20gYSBub24tYWN0aXZlIHN0YXRlLCBtb3N0IGxpa2VseSBmcm9tIGFuIGFzeW5jaHJvbm91cyBzdGFydCgpIG1ldGhvZC5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0U3RhdGUgPSBuZXcgU3RhdGVDb25zdHJ1Y3Rvcih0aGlzLCAuLi5wYXlsb2FkKTtcbiAgICB0aGlzLnN0YXRlID0gbmV4dFN0YXRlO1xuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc3RhdGUnLCB7ZnJvbTogY3VycmVudFN0YXRlLCB0bzogdGhpcy5zdGF0ZX0pO1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXRlLnN0YXJ0KCk7XG4gIH1cblxuICB0cmFuc2l0aW9uVG8oU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24odGhpcy5zdGF0ZSwgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCk7XG4gIH1cblxuICBnZXRMb2FkUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0Fic2VudCgpID8gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdBbiBhYnNlbnQgcmVwb3NpdG9yeSB3aWxsIG5ldmVyIGxvYWQnKSkgOiB0aGlzLmxvYWRQcm9taXNlO1xuICB9XG5cbiAgLypcbiAgICogVXNlIGBjYWxsYmFja2AgdG8gcmVxdWVzdCB1c2VyIGlucHV0IGZyb20gYWxsIGdpdCBzdHJhdGVnaWVzLlxuICAgKi9cbiAgc2V0UHJvbXB0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLmdpdC5nZXRJbXBsZW1lbnRlcnMoKS5mb3JFYWNoKHN0cmF0ZWd5ID0+IHN0cmF0ZWd5LnNldFByb21wdENhbGxiYWNrKGNhbGxiYWNrKSk7XG4gIH1cblxuICAvLyBQaXBlbGluZVxuICBnZXRQaXBlbGluZShhY3Rpb25OYW1lKSB7XG4gICAgY29uc3QgYWN0aW9uS2V5ID0gdGhpcy5waXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5c1thY3Rpb25OYW1lXTtcbiAgICByZXR1cm4gdGhpcy5waXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUoYWN0aW9uS2V5KTtcbiAgfVxuXG4gIGV4ZWN1dGVQaXBlbGluZUFjdGlvbihhY3Rpb25OYW1lLCBmbiwgLi4uYXJncykge1xuICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5nZXRQaXBlbGluZShhY3Rpb25OYW1lKTtcbiAgICByZXR1cm4gcGlwZWxpbmUucnVuKGZuLCB0aGlzLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8vIEV2ZW50IHN1YnNjcmlwdGlvbiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXN0YXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRHbG9iYWxseUludmFsaWRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZ2xvYmFsbHktaW52YWxpZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uUHVsbEVycm9yKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbigncHVsbC1lcnJvcicsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRpZFB1bGxFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLmVtaXQoJ3B1bGwtZXJyb3InKTtcbiAgfVxuXG4gIC8vIFN0YXRlLWluZGVwZW5kZW50IGFjdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWN0aW9ucyB0aGF0IHVzZSBkaXJlY3QgZmlsZXN5c3RlbSBhY2Nlc3Mgb3Igb3RoZXJ3aXNlIGRvbid0IG5lZWQgYHRoaXMuZ2l0YCB0byBiZSBhdmFpbGFibGUuXG5cbiAgYXN5bmMgcGF0aEhhc01lcmdlTWFya2VycyhyZWxhdGl2ZVBhdGgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShwYXRoLmpvaW4odGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCByZWxhdGl2ZVBhdGgpLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgICAgcmV0dXJuIE1FUkdFX01BUktFUl9SRUdFWC50ZXN0KGNvbnRlbnRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBFSVNESVIgaW1wbGllcyB0aGlzIGlzIGEgc3VibW9kdWxlXG4gICAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJyB8fCBlLmNvZGUgPT09ICdFSVNESVInKSB7IHJldHVybiBmYWxzZTsgfSBlbHNlIHsgdGhyb3cgZTsgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldE1lcmdlTWVzc2FnZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShwYXRoLmpvaW4odGhpcy5nZXRHaXREaXJlY3RvcnlQYXRoKCksICdNRVJHRV9NU0cnKSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIHJldHVybiBjb250ZW50cy5zcGxpdCgvXFxuLykuZmlsdGVyKGxpbmUgPT4gbGluZS5sZW5ndGggPiAwICYmICFsaW5lLnN0YXJ0c1dpdGgoJyMnKSkuam9pbignXFxuJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGUtaW5kZXBlbmRlbnQgYWNjZXNzb3JzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIGdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICB9XG5cbiAgc2V0R2l0RGlyZWN0b3J5UGF0aChnaXREaXJlY3RvcnlQYXRoKSB7XG4gICAgdGhpcy5fZ2l0RGlyZWN0b3J5UGF0aCA9IGdpdERpcmVjdG9yeVBhdGg7XG4gIH1cblxuICBnZXRHaXREaXJlY3RvcnlQYXRoKCkge1xuICAgIGlmICh0aGlzLl9naXREaXJlY3RvcnlQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2l0RGlyZWN0b3J5UGF0aDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkge1xuICAgICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksICcuZ2l0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFic2VudC9Mb2FkaW5nL2V0Yy5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5TdGF0ZShzdGF0ZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBzdGF0ZU5hbWU7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFJlcG9zaXRvcnkoc3RhdGU9JHt0aGlzLnN0YXRlLmNvbnN0cnVjdG9yLm5hbWV9LCB3b3JrZGlyPVwiJHt0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCl9XCIpYDtcbiAgfVxuXG4gIC8vIENvbXBvdW5kIEdldHRlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWNjZXNzb3IgbWV0aG9kcyBmb3IgZGF0YSBkZXJpdmVkIGZyb20gb3RoZXIsIHN0YXRlLXByb3ZpZGVkIGdldHRlcnMuXG5cbiAgYXN5bmMgZ2V0Q3VycmVudEJyYW5jaCgpIHtcbiAgICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IHRoaXMuZ2V0QnJhbmNoZXMoKTtcbiAgICBjb25zdCBoZWFkID0gYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpO1xuICAgIGlmIChoZWFkLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gaGVhZDtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGF3YWl0IHRoaXMuZ2V0SGVhZERlc2NyaXB0aW9uKCk7XG4gICAgcmV0dXJuIEJyYW5jaC5jcmVhdGVEZXRhY2hlZChkZXNjcmlwdGlvbiB8fCAnbm8gYnJhbmNoJyk7XG4gIH1cblxuICBhc3luYyBnZXRVbnN0YWdlZENoYW5nZXMoKSB7XG4gICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModW5zdGFnZWRGaWxlcylcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZmlsZVBhdGggPT4geyByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IHVuc3RhZ2VkRmlsZXNbZmlsZVBhdGhdfTsgfSk7XG4gIH1cblxuICBhc3luYyBnZXRTdGFnZWRDaGFuZ2VzKCkge1xuICAgIGNvbnN0IHtzdGFnZWRGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzdGFnZWRGaWxlcylcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZmlsZVBhdGggPT4geyByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IHN0YWdlZEZpbGVzW2ZpbGVQYXRoXX07IH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0TWVyZ2VDb25mbGljdHMoKSB7XG4gICAgY29uc3Qge21lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZUNvbmZsaWN0RmlsZXMpLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IG1lcmdlQ29uZmxpY3RGaWxlc1tmaWxlUGF0aF19O1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaXNQYXJ0aWFsbHlTdGFnZWQoZmlsZU5hbWUpIHtcbiAgICBjb25zdCB7dW5zdGFnZWRGaWxlcywgc3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICBjb25zdCB1ID0gdW5zdGFnZWRGaWxlc1tmaWxlTmFtZV07XG4gICAgY29uc3QgcyA9IHN0YWdlZEZpbGVzW2ZpbGVOYW1lXTtcbiAgICByZXR1cm4gKHUgPT09ICdtb2RpZmllZCcgJiYgcyA9PT0gJ21vZGlmaWVkJykgfHxcbiAgICAgICh1ID09PSAnbW9kaWZpZWQnICYmIHMgPT09ICdhZGRlZCcpIHx8XG4gICAgICAodSA9PT0gJ2FkZGVkJyAmJiBzID09PSAnZGVsZXRlZCcpIHx8XG4gICAgICAodSA9PT0gJ2RlbGV0ZWQnICYmIHMgPT09ICdtb2RpZmllZCcpO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpIHtcbiAgICBjb25zdCBuYW1lID0gYXdhaXQgdGhpcy5nZXRDb25maWcoYGJyYW5jaC4ke2JyYW5jaE5hbWV9LnJlbW90ZWApO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRSZW1vdGVzKCkpLndpdGhOYW1lKG5hbWUpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBoaXN0b3J5U2hhID0gYXdhaXQgdGhpcy5jcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IoKTtcbiAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuc2V0Q29uZmlnKCdhdG9tR2l0aHViLmhpc3RvcnlTaGEnLCBoaXN0b3J5U2hhKTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbW1pdHRlcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBjb21taXR0ZXIgPSBhd2FpdCB5dWJpa2lyaSh7XG4gICAgICBlbWFpbDogdGhpcy5nZXRDb25maWcoJ3VzZXIuZW1haWwnLCBvcHRpb25zKSxcbiAgICAgIG5hbWU6IHRoaXMuZ2V0Q29uZmlnKCd1c2VyLm5hbWUnLCBvcHRpb25zKSxcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21taXR0ZXIubmFtZSAhPT0gbnVsbCAmJiBjb21taXR0ZXIuZW1haWwgIT09IG51bGxcbiAgICAgID8gbmV3IEF1dGhvcihjb21taXR0ZXIuZW1haWwsIGNvbW1pdHRlci5uYW1lKVxuICAgICAgOiBudWxsQXV0aG9yO1xuICB9XG5cbiAgLy8gdG9kbyAoQGFubnRodXJpdW0sIDMvMjAxOSk6IHJlZmFjdG9yIEdpdEh1YlRhYkNvbnRyb2xsZXIgZXRjIHRvIHVzZSB0aGlzIG1ldGhvZC5cbiAgYXN5bmMgZ2V0Q3VycmVudEdpdEh1YlJlbW90ZSgpIHtcbiAgICBsZXQgY3VycmVudFJlbW90ZSA9IG51bGw7XG5cbiAgICBjb25zdCByZW1vdGVzID0gYXdhaXQgdGhpcy5nZXRSZW1vdGVzKCk7XG5cbiAgICBjb25zdCBnaXRIdWJSZW1vdGVzID0gcmVtb3Rlcy5maWx0ZXIocmVtb3RlID0+IHJlbW90ZS5pc0dpdGh1YlJlcG8oKSk7XG4gICAgY29uc3Qgc2VsZWN0ZWRSZW1vdGVOYW1lID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2F0b21HaXRodWIuY3VycmVudFJlbW90ZScpO1xuICAgIGN1cnJlbnRSZW1vdGUgPSBnaXRIdWJSZW1vdGVzLndpdGhOYW1lKHNlbGVjdGVkUmVtb3RlTmFtZSk7XG5cbiAgICBpZiAoIWN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCkgJiYgZ2l0SHViUmVtb3Rlcy5zaXplKCkgPT09IDEpIHtcbiAgICAgIGN1cnJlbnRSZW1vdGUgPSBBcnJheS5mcm9tKGdpdEh1YlJlbW90ZXMpWzBdO1xuICAgIH1cbiAgICAvLyB0b2RvOiBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgbXVsdGlwbGUgcmVtb3RlcyBhcmUgYXZhaWxhYmxlIGFuZCBubyBjaG9zZW4gcmVtb3RlIGlzIHNldC5cbiAgICByZXR1cm4gY3VycmVudFJlbW90ZTtcbiAgfVxuXG5cbiAgYXN5bmMgaGFzR2l0SHViUmVtb3RlKGhvc3QsIG93bmVyLCBuYW1lKSB7XG4gICAgY29uc3QgcmVtb3RlcyA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpO1xuICAgIHJldHVybiByZW1vdGVzLm1hdGNoaW5nR2l0SHViUmVwb3NpdG9yeShvd25lciwgbmFtZSkubGVuZ3RoID4gMDtcbiAgfVxufVxuXG4vLyBUaGUgbWV0aG9kcyBuYW1lZCBoZXJlIHdpbGwgYmUgZGVsZWdhdGVkIHRvIHRoZSBjdXJyZW50IFN0YXRlLlxuLy9cbi8vIER1cGxpY2F0ZWQgaGVyZSByYXRoZXIgdGhhbiBqdXN0IHVzaW5nIGBleHBlY3RlZERlbGVnYXRlc2AgZGlyZWN0bHkgc28gdGhhdCB0aGlzIGZpbGUgaXMgZ3JlcC1mcmllbmRseSBmb3IgYW5zd2VyaW5nXG4vLyB0aGUgcXVlc3Rpb24gb2YgXCJ3aGF0IGFsbCBjYW4gYSBSZXBvc2l0b3J5IGRvIGV4YWN0bHlcIi5cbmNvbnN0IGRlbGVnYXRlcyA9IFtcbiAgJ2lzTG9hZGluZ0d1ZXNzJyxcbiAgJ2lzQWJzZW50R3Vlc3MnLFxuICAnaXNBYnNlbnQnLFxuICAnaXNMb2FkaW5nJyxcbiAgJ2lzRW1wdHknLFxuICAnaXNQcmVzZW50JyxcbiAgJ2lzVG9vTGFyZ2UnLFxuICAnaXNEZXN0cm95ZWQnLFxuXG4gICdpc1VuZGV0ZXJtaW5lZCcsXG4gICdzaG93R2l0VGFiSW5pdCcsXG4gICdzaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MnLFxuICAnc2hvd0dpdFRhYkxvYWRpbmcnLFxuICAnc2hvd1N0YXR1c0JhclRpbGVzJyxcbiAgJ2hhc0RpcmVjdG9yeScsXG4gICdpc1B1Ymxpc2hhYmxlJyxcblxuICAnaW5pdCcsXG4gICdjbG9uZScsXG4gICdkZXN0cm95JyxcbiAgJ3JlZnJlc2gnLFxuICAnb2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UnLFxuICAndXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZScsXG5cbiAgJ3N0YWdlRmlsZXMnLFxuICAndW5zdGFnZUZpbGVzJyxcbiAgJ3N0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0JyxcbiAgJ3N0YWdlRmlsZU1vZGVDaGFuZ2UnLFxuICAnc3RhZ2VGaWxlU3ltbGlua0NoYW5nZScsXG4gICdhcHBseVBhdGNoVG9JbmRleCcsXG4gICdhcHBseVBhdGNoVG9Xb3JrZGlyJyxcblxuICAnY29tbWl0JyxcblxuICAnbWVyZ2UnLFxuICAnYWJvcnRNZXJnZScsXG4gICdjaGVja291dFNpZGUnLFxuICAnbWVyZ2VGaWxlJyxcbiAgJ3dyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgnLFxuXG4gICdjaGVja291dCcsXG4gICdjaGVja291dFBhdGhzQXRSZXZpc2lvbicsXG5cbiAgJ3VuZG9MYXN0Q29tbWl0JyxcblxuICAnZmV0Y2gnLFxuICAncHVsbCcsXG4gICdwdXNoJyxcblxuICAnc2V0Q29uZmlnJyxcblxuICAnY3JlYXRlQmxvYicsXG4gICdleHBhbmRCbG9iVG9GaWxlJyxcblxuICAnY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iJyxcbiAgJ3VwZGF0ZURpc2NhcmRIaXN0b3J5JyxcbiAgJ3N0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icycsXG4gICdyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcycsXG4gICdwb3BEaXNjYXJkSGlzdG9yeScsXG4gICdjbGVhckRpc2NhcmRIaXN0b3J5JyxcbiAgJ2Rpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzJyxcblxuICAnZ2V0U3RhdHVzQnVuZGxlJyxcbiAgJ2dldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzJyxcbiAgJ2dldEZpbGVQYXRjaEZvclBhdGgnLFxuICAnZ2V0RGlmZnNGb3JGaWxlUGF0aCcsXG4gICdnZXRTdGFnZWRDaGFuZ2VzUGF0Y2gnLFxuICAncmVhZEZpbGVGcm9tSW5kZXgnLFxuXG4gICdnZXRMYXN0Q29tbWl0JyxcbiAgJ2dldENvbW1pdCcsXG4gICdnZXRSZWNlbnRDb21taXRzJyxcbiAgJ2lzQ29tbWl0UHVzaGVkJyxcblxuICAnZ2V0QXV0aG9ycycsXG5cbiAgJ2dldEJyYW5jaGVzJyxcbiAgJ2dldEhlYWREZXNjcmlwdGlvbicsXG5cbiAgJ2lzTWVyZ2luZycsXG4gICdpc1JlYmFzaW5nJyxcblxuICAnZ2V0UmVtb3RlcycsXG4gICdhZGRSZW1vdGUnLFxuXG4gICdnZXRBaGVhZENvdW50JyxcbiAgJ2dldEJlaGluZENvdW50JyxcblxuICAnZ2V0Q29uZmlnJyxcbiAgJ3Vuc2V0Q29uZmlnJyxcblxuICAnZ2V0QmxvYkNvbnRlbnRzJyxcblxuICAnaGFzRGlzY2FyZEhpc3RvcnknLFxuICAnZ2V0RGlzY2FyZEhpc3RvcnknLFxuICAnZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMnLFxuXG4gICdnZXRPcGVyYXRpb25TdGF0ZXMnLFxuXG4gICdzZXRDb21taXRNZXNzYWdlJyxcbiAgJ2dldENvbW1pdE1lc3NhZ2UnLFxuICAnZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUnLFxuICAnZ2V0Q2FjaGUnLFxuICAnYWNjZXB0SW52YWxpZGF0aW9uJyxcbl07XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgZGVsZWdhdGVzLmxlbmd0aDsgaSsrKSB7XG4gIGNvbnN0IGRlbGVnYXRlID0gZGVsZWdhdGVzW2ldO1xuXG4gIFJlcG9zaXRvcnkucHJvdG90eXBlW2RlbGVnYXRlXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVtkZWxlZ2F0ZV0oLi4uYXJncyk7XG4gIH07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFDLFNBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFNBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFJLGVBQUEsR0FBQUosT0FBQTtBQUNBLElBQUFLLHFCQUFBLEdBQUFOLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTSxPQUFBLEdBQUFDLHVCQUFBLENBQUFQLE9BQUE7QUFDQSxJQUFBUSxPQUFBLEdBQUFULHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUyxpQkFBQSxHQUFBVCxPQUFBO0FBQStFLFNBQUFVLHlCQUFBQyxDQUFBLDZCQUFBQyxPQUFBLG1CQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFGLHdCQUFBLFlBQUFBLENBQUFDLENBQUEsV0FBQUEsQ0FBQSxHQUFBRyxDQUFBLEdBQUFELENBQUEsS0FBQUYsQ0FBQTtBQUFBLFNBQUFKLHdCQUFBSSxDQUFBLEVBQUFFLENBQUEsU0FBQUEsQ0FBQSxJQUFBRixDQUFBLElBQUFBLENBQUEsQ0FBQUksVUFBQSxTQUFBSixDQUFBLGVBQUFBLENBQUEsdUJBQUFBLENBQUEseUJBQUFBLENBQUEsV0FBQUssT0FBQSxF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