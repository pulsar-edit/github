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
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfeXViaWtpcmkiLCJfYWN0aW9uUGlwZWxpbmUiLCJfY29tcG9zaXRlR2l0U3RyYXRlZ3kiLCJfYXV0aG9yIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfYnJhbmNoIiwiX3JlcG9zaXRvcnlTdGF0ZXMiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJuIiwiX19wcm90b19fIiwiYSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImkiLCJzZXQiLCJvYmoiLCJvd25LZXlzIiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTUVSR0VfTUFSS0VSX1JFR0VYIiwiaW5pdGlhbFN0YXRlU3ltIiwiUmVwb3NpdG9yeSIsImNvbnN0cnVjdG9yIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJnaXRTdHJhdGVneSIsIm9wdGlvbnMiLCJnaXQiLCJDb21wb3NpdGVHaXRTdHJhdGVneSIsImNyZWF0ZSIsImVtaXR0ZXIiLCJFbWl0dGVyIiwibG9hZFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YiIsIm9uRGlkQ2hhbmdlU3RhdGUiLCJpc0xvYWRpbmciLCJkaXNwb3NlIiwiaXNEZXN0cm95ZWQiLCJwaXBlbGluZU1hbmFnZXIiLCJnZXROdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyIiwidHJhbnNpdGlvblRvIiwiTG9hZGluZyIsImFic2VudCIsIkFic2VudCIsImxvYWRpbmdHdWVzcyIsIkxvYWRpbmdHdWVzcyIsImFic2VudEd1ZXNzIiwiQWJzZW50R3Vlc3MiLCJ0cmFuc2l0aW9uIiwiY3VycmVudFN0YXRlIiwiU3RhdGVDb25zdHJ1Y3RvciIsInBheWxvYWQiLCJzdGF0ZSIsIm5leHRTdGF0ZSIsImVtaXQiLCJmcm9tIiwidG8iLCJzdGFydCIsImdldExvYWRQcm9taXNlIiwiaXNBYnNlbnQiLCJyZWplY3QiLCJFcnJvciIsInNldFByb21wdENhbGxiYWNrIiwiY2FsbGJhY2siLCJnZXRJbXBsZW1lbnRlcnMiLCJzdHJhdGVneSIsImdldFBpcGVsaW5lIiwiYWN0aW9uTmFtZSIsImFjdGlvbktleSIsImFjdGlvbktleXMiLCJleGVjdXRlUGlwZWxpbmVBY3Rpb24iLCJmbiIsImFyZ3MiLCJwaXBlbGluZSIsInJ1biIsIm9uRGlkRGVzdHJveSIsIm9uIiwib25EaWRVcGRhdGUiLCJvbkRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsIm9uUHVsbEVycm9yIiwiZGlkUHVsbEVycm9yIiwicGF0aEhhc01lcmdlTWFya2VycyIsInJlbGF0aXZlUGF0aCIsImNvbnRlbnRzIiwiZnMiLCJyZWFkRmlsZSIsInBhdGgiLCJqb2luIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJlbmNvZGluZyIsInRlc3QiLCJjb2RlIiwiZ2V0TWVyZ2VNZXNzYWdlIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsInNwbGl0IiwibGluZSIsInN0YXJ0c1dpdGgiLCJzZXRHaXREaXJlY3RvcnlQYXRoIiwiZ2l0RGlyZWN0b3J5UGF0aCIsIl9naXREaXJlY3RvcnlQYXRoIiwiaXNJblN0YXRlIiwic3RhdGVOYW1lIiwibmFtZSIsInRvU3RyaW5nIiwiZ2V0Q3VycmVudEJyYW5jaCIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJoZWFkIiwiZ2V0SGVhZEJyYW5jaCIsImlzUHJlc2VudCIsImRlc2NyaXB0aW9uIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiQnJhbmNoIiwiY3JlYXRlRGV0YWNoZWQiLCJnZXRVbnN0YWdlZENoYW5nZXMiLCJ1bnN0YWdlZEZpbGVzIiwiZ2V0U3RhdHVzQnVuZGxlIiwic29ydCIsIm1hcCIsImZpbGVQYXRoIiwic3RhdHVzIiwiZ2V0U3RhZ2VkQ2hhbmdlcyIsInN0YWdlZEZpbGVzIiwiZ2V0TWVyZ2VDb25mbGljdHMiLCJtZXJnZUNvbmZsaWN0RmlsZXMiLCJpc1BhcnRpYWxseVN0YWdlZCIsImZpbGVOYW1lIiwicyIsImdldFJlbW90ZUZvckJyYW5jaCIsImJyYW5jaE5hbWUiLCJnZXRDb25maWciLCJnZXRSZW1vdGVzIiwid2l0aE5hbWUiLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJoaXN0b3J5U2hhIiwiY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iIiwic2V0Q29uZmlnIiwiZ2V0Q29tbWl0dGVyIiwiY29tbWl0dGVyIiwieXViaWtpcmkiLCJlbWFpbCIsIkF1dGhvciIsIm51bGxBdXRob3IiLCJnZXRDdXJyZW50R2l0SHViUmVtb3RlIiwiY3VycmVudFJlbW90ZSIsInJlbW90ZXMiLCJnaXRIdWJSZW1vdGVzIiwicmVtb3RlIiwiaXNHaXRodWJSZXBvIiwic2VsZWN0ZWRSZW1vdGVOYW1lIiwic2l6ZSIsIkFycmF5IiwiaGFzR2l0SHViUmVtb3RlIiwiaG9zdCIsIm93bmVyIiwibWF0Y2hpbmdHaXRIdWJSZXBvc2l0b3J5IiwiZXhwb3J0cyIsImRlbGVnYXRlcyIsImRlbGVnYXRlIl0sInNvdXJjZXMiOlsicmVwb3NpdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCB7Z2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlcn0gZnJvbSAnLi4vYWN0aW9uLXBpcGVsaW5lJztcbmltcG9ydCBDb21wb3NpdGVHaXRTdHJhdGVneSBmcm9tICcuLi9jb21wb3NpdGUtZ2l0LXN0cmF0ZWd5JztcbmltcG9ydCBBdXRob3IsIHtudWxsQXV0aG9yfSBmcm9tICcuL2F1dGhvcic7XG5pbXBvcnQgQnJhbmNoIGZyb20gJy4vYnJhbmNoJztcbmltcG9ydCB7TG9hZGluZywgQWJzZW50LCBMb2FkaW5nR3Vlc3MsIEFic2VudEd1ZXNzfSBmcm9tICcuL3JlcG9zaXRvcnktc3RhdGVzJztcblxuY29uc3QgTUVSR0VfTUFSS0VSX1JFR0VYID0gL14oPnw8KXs3fSBcXFMrJC9tO1xuXG4vLyBJbnRlcm5hbCBvcHRpb24ga2V5cyB1c2VkIHRvIGRlc2lnbmF0ZSB0aGUgZGVzaXJlZCBpbml0aWFsIHN0YXRlIG9mIGEgUmVwb3NpdG9yeS5cbmNvbnN0IGluaXRpYWxTdGF0ZVN5bSA9IFN5bWJvbCgnaW5pdGlhbFN0YXRlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9zaXRvcnkge1xuICBjb25zdHJ1Y3Rvcih3b3JraW5nRGlyZWN0b3J5UGF0aCwgZ2l0U3RyYXRlZ3kgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLndvcmtpbmdEaXJlY3RvcnlQYXRoID0gd29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgdGhpcy5naXQgPSBnaXRTdHJhdGVneSB8fCBDb21wb3NpdGVHaXRTdHJhdGVneS5jcmVhdGUod29ya2luZ0RpcmVjdG9yeVBhdGgpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMub25EaWRDaGFuZ2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRpbmcoKSkge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5waXBlbGluZU1hbmFnZXIgPSBvcHRpb25zLnBpcGVsaW5lTWFuYWdlciB8fCBnZXROdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyKCk7XG4gICAgdGhpcy50cmFuc2l0aW9uVG8ob3B0aW9uc1tpbml0aWFsU3RhdGVTeW1dIHx8IExvYWRpbmcpO1xuICB9XG5cbiAgc3RhdGljIGFic2VudChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogQWJzZW50LCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZGluZ0d1ZXNzKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFJlcG9zaXRvcnkobnVsbCwgbnVsbCwge1tpbml0aWFsU3RhdGVTeW1dOiBMb2FkaW5nR3Vlc3MsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIHN0YXRpYyBhYnNlbnRHdWVzcyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogQWJzZW50R3Vlc3MsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIC8vIFN0YXRlIG1hbmFnZW1lbnQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB0cmFuc2l0aW9uKGN1cnJlbnRTdGF0ZSwgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCkge1xuICAgIGlmIChjdXJyZW50U3RhdGUgIT09IHRoaXMuc3RhdGUpIHtcbiAgICAgIC8vIEF0dGVtcHRlZCB0cmFuc2l0aW9uIGZyb20gYSBub24tYWN0aXZlIHN0YXRlLCBtb3N0IGxpa2VseSBmcm9tIGFuIGFzeW5jaHJvbm91cyBzdGFydCgpIG1ldGhvZC5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0U3RhdGUgPSBuZXcgU3RhdGVDb25zdHJ1Y3Rvcih0aGlzLCAuLi5wYXlsb2FkKTtcbiAgICB0aGlzLnN0YXRlID0gbmV4dFN0YXRlO1xuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc3RhdGUnLCB7ZnJvbTogY3VycmVudFN0YXRlLCB0bzogdGhpcy5zdGF0ZX0pO1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXRlLnN0YXJ0KCk7XG4gIH1cblxuICB0cmFuc2l0aW9uVG8oU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb24odGhpcy5zdGF0ZSwgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCk7XG4gIH1cblxuICBnZXRMb2FkUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0Fic2VudCgpID8gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdBbiBhYnNlbnQgcmVwb3NpdG9yeSB3aWxsIG5ldmVyIGxvYWQnKSkgOiB0aGlzLmxvYWRQcm9taXNlO1xuICB9XG5cbiAgLypcbiAgICogVXNlIGBjYWxsYmFja2AgdG8gcmVxdWVzdCB1c2VyIGlucHV0IGZyb20gYWxsIGdpdCBzdHJhdGVnaWVzLlxuICAgKi9cbiAgc2V0UHJvbXB0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLmdpdC5nZXRJbXBsZW1lbnRlcnMoKS5mb3JFYWNoKHN0cmF0ZWd5ID0+IHN0cmF0ZWd5LnNldFByb21wdENhbGxiYWNrKGNhbGxiYWNrKSk7XG4gIH1cblxuICAvLyBQaXBlbGluZVxuICBnZXRQaXBlbGluZShhY3Rpb25OYW1lKSB7XG4gICAgY29uc3QgYWN0aW9uS2V5ID0gdGhpcy5waXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5c1thY3Rpb25OYW1lXTtcbiAgICByZXR1cm4gdGhpcy5waXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUoYWN0aW9uS2V5KTtcbiAgfVxuXG4gIGV4ZWN1dGVQaXBlbGluZUFjdGlvbihhY3Rpb25OYW1lLCBmbiwgLi4uYXJncykge1xuICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5nZXRQaXBlbGluZShhY3Rpb25OYW1lKTtcbiAgICByZXR1cm4gcGlwZWxpbmUucnVuKGZuLCB0aGlzLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8vIEV2ZW50IHN1YnNjcmlwdGlvbiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXN0YXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRHbG9iYWxseUludmFsaWRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZ2xvYmFsbHktaW52YWxpZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uUHVsbEVycm9yKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbigncHVsbC1lcnJvcicsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRpZFB1bGxFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLmVtaXQoJ3B1bGwtZXJyb3InKTtcbiAgfVxuXG4gIC8vIFN0YXRlLWluZGVwZW5kZW50IGFjdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWN0aW9ucyB0aGF0IHVzZSBkaXJlY3QgZmlsZXN5c3RlbSBhY2Nlc3Mgb3Igb3RoZXJ3aXNlIGRvbid0IG5lZWQgYHRoaXMuZ2l0YCB0byBiZSBhdmFpbGFibGUuXG5cbiAgYXN5bmMgcGF0aEhhc01lcmdlTWFya2VycyhyZWxhdGl2ZVBhdGgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShwYXRoLmpvaW4odGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCByZWxhdGl2ZVBhdGgpLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgICAgcmV0dXJuIE1FUkdFX01BUktFUl9SRUdFWC50ZXN0KGNvbnRlbnRzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBFSVNESVIgaW1wbGllcyB0aGlzIGlzIGEgc3VibW9kdWxlXG4gICAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJyB8fCBlLmNvZGUgPT09ICdFSVNESVInKSB7IHJldHVybiBmYWxzZTsgfSBlbHNlIHsgdGhyb3cgZTsgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldE1lcmdlTWVzc2FnZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShwYXRoLmpvaW4odGhpcy5nZXRHaXREaXJlY3RvcnlQYXRoKCksICdNRVJHRV9NU0cnKSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIHJldHVybiBjb250ZW50cy5zcGxpdCgvXFxuLykuZmlsdGVyKGxpbmUgPT4gbGluZS5sZW5ndGggPiAwICYmICFsaW5lLnN0YXJ0c1dpdGgoJyMnKSkuam9pbignXFxuJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGUtaW5kZXBlbmRlbnQgYWNjZXNzb3JzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIGdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICB9XG5cbiAgc2V0R2l0RGlyZWN0b3J5UGF0aChnaXREaXJlY3RvcnlQYXRoKSB7XG4gICAgdGhpcy5fZ2l0RGlyZWN0b3J5UGF0aCA9IGdpdERpcmVjdG9yeVBhdGg7XG4gIH1cblxuICBnZXRHaXREaXJlY3RvcnlQYXRoKCkge1xuICAgIGlmICh0aGlzLl9naXREaXJlY3RvcnlQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2l0RGlyZWN0b3J5UGF0aDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkge1xuICAgICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksICcuZ2l0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFic2VudC9Mb2FkaW5nL2V0Yy5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5TdGF0ZShzdGF0ZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBzdGF0ZU5hbWU7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFJlcG9zaXRvcnkoc3RhdGU9JHt0aGlzLnN0YXRlLmNvbnN0cnVjdG9yLm5hbWV9LCB3b3JrZGlyPVwiJHt0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCl9XCIpYDtcbiAgfVxuXG4gIC8vIENvbXBvdW5kIEdldHRlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWNjZXNzb3IgbWV0aG9kcyBmb3IgZGF0YSBkZXJpdmVkIGZyb20gb3RoZXIsIHN0YXRlLXByb3ZpZGVkIGdldHRlcnMuXG5cbiAgYXN5bmMgZ2V0Q3VycmVudEJyYW5jaCgpIHtcbiAgICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IHRoaXMuZ2V0QnJhbmNoZXMoKTtcbiAgICBjb25zdCBoZWFkID0gYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpO1xuICAgIGlmIChoZWFkLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gaGVhZDtcbiAgICB9XG5cbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGF3YWl0IHRoaXMuZ2V0SGVhZERlc2NyaXB0aW9uKCk7XG4gICAgcmV0dXJuIEJyYW5jaC5jcmVhdGVEZXRhY2hlZChkZXNjcmlwdGlvbiB8fCAnbm8gYnJhbmNoJyk7XG4gIH1cblxuICBhc3luYyBnZXRVbnN0YWdlZENoYW5nZXMoKSB7XG4gICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModW5zdGFnZWRGaWxlcylcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZmlsZVBhdGggPT4geyByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IHVuc3RhZ2VkRmlsZXNbZmlsZVBhdGhdfTsgfSk7XG4gIH1cblxuICBhc3luYyBnZXRTdGFnZWRDaGFuZ2VzKCkge1xuICAgIGNvbnN0IHtzdGFnZWRGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzdGFnZWRGaWxlcylcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZmlsZVBhdGggPT4geyByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IHN0YWdlZEZpbGVzW2ZpbGVQYXRoXX07IH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0TWVyZ2VDb25mbGljdHMoKSB7XG4gICAgY29uc3Qge21lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZUNvbmZsaWN0RmlsZXMpLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICByZXR1cm4ge2ZpbGVQYXRoLCBzdGF0dXM6IG1lcmdlQ29uZmxpY3RGaWxlc1tmaWxlUGF0aF19O1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaXNQYXJ0aWFsbHlTdGFnZWQoZmlsZU5hbWUpIHtcbiAgICBjb25zdCB7dW5zdGFnZWRGaWxlcywgc3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICBjb25zdCB1ID0gdW5zdGFnZWRGaWxlc1tmaWxlTmFtZV07XG4gICAgY29uc3QgcyA9IHN0YWdlZEZpbGVzW2ZpbGVOYW1lXTtcbiAgICByZXR1cm4gKHUgPT09ICdtb2RpZmllZCcgJiYgcyA9PT0gJ21vZGlmaWVkJykgfHxcbiAgICAgICh1ID09PSAnbW9kaWZpZWQnICYmIHMgPT09ICdhZGRlZCcpIHx8XG4gICAgICAodSA9PT0gJ2FkZGVkJyAmJiBzID09PSAnZGVsZXRlZCcpIHx8XG4gICAgICAodSA9PT0gJ2RlbGV0ZWQnICYmIHMgPT09ICdtb2RpZmllZCcpO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpIHtcbiAgICBjb25zdCBuYW1lID0gYXdhaXQgdGhpcy5nZXRDb25maWcoYGJyYW5jaC4ke2JyYW5jaE5hbWV9LnJlbW90ZWApO1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRSZW1vdGVzKCkpLndpdGhOYW1lKG5hbWUpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBoaXN0b3J5U2hhID0gYXdhaXQgdGhpcy5jcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IoKTtcbiAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuc2V0Q29uZmlnKCdhdG9tR2l0aHViLmhpc3RvcnlTaGEnLCBoaXN0b3J5U2hhKTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbW1pdHRlcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBjb21taXR0ZXIgPSBhd2FpdCB5dWJpa2lyaSh7XG4gICAgICBlbWFpbDogdGhpcy5nZXRDb25maWcoJ3VzZXIuZW1haWwnLCBvcHRpb25zKSxcbiAgICAgIG5hbWU6IHRoaXMuZ2V0Q29uZmlnKCd1c2VyLm5hbWUnLCBvcHRpb25zKSxcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21taXR0ZXIubmFtZSAhPT0gbnVsbCAmJiBjb21taXR0ZXIuZW1haWwgIT09IG51bGxcbiAgICAgID8gbmV3IEF1dGhvcihjb21taXR0ZXIuZW1haWwsIGNvbW1pdHRlci5uYW1lKVxuICAgICAgOiBudWxsQXV0aG9yO1xuICB9XG5cbiAgLy8gdG9kbyAoQGFubnRodXJpdW0sIDMvMjAxOSk6IHJlZmFjdG9yIEdpdEh1YlRhYkNvbnRyb2xsZXIgZXRjIHRvIHVzZSB0aGlzIG1ldGhvZC5cbiAgYXN5bmMgZ2V0Q3VycmVudEdpdEh1YlJlbW90ZSgpIHtcbiAgICBsZXQgY3VycmVudFJlbW90ZSA9IG51bGw7XG5cbiAgICBjb25zdCByZW1vdGVzID0gYXdhaXQgdGhpcy5nZXRSZW1vdGVzKCk7XG5cbiAgICBjb25zdCBnaXRIdWJSZW1vdGVzID0gcmVtb3Rlcy5maWx0ZXIocmVtb3RlID0+IHJlbW90ZS5pc0dpdGh1YlJlcG8oKSk7XG4gICAgY29uc3Qgc2VsZWN0ZWRSZW1vdGVOYW1lID0gYXdhaXQgdGhpcy5nZXRDb25maWcoJ2F0b21HaXRodWIuY3VycmVudFJlbW90ZScpO1xuICAgIGN1cnJlbnRSZW1vdGUgPSBnaXRIdWJSZW1vdGVzLndpdGhOYW1lKHNlbGVjdGVkUmVtb3RlTmFtZSk7XG5cbiAgICBpZiAoIWN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCkgJiYgZ2l0SHViUmVtb3Rlcy5zaXplKCkgPT09IDEpIHtcbiAgICAgIGN1cnJlbnRSZW1vdGUgPSBBcnJheS5mcm9tKGdpdEh1YlJlbW90ZXMpWzBdO1xuICAgIH1cbiAgICAvLyB0b2RvOiBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgbXVsdGlwbGUgcmVtb3RlcyBhcmUgYXZhaWxhYmxlIGFuZCBubyBjaG9zZW4gcmVtb3RlIGlzIHNldC5cbiAgICByZXR1cm4gY3VycmVudFJlbW90ZTtcbiAgfVxuXG5cbiAgYXN5bmMgaGFzR2l0SHViUmVtb3RlKGhvc3QsIG93bmVyLCBuYW1lKSB7XG4gICAgY29uc3QgcmVtb3RlcyA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpO1xuICAgIHJldHVybiByZW1vdGVzLm1hdGNoaW5nR2l0SHViUmVwb3NpdG9yeShvd25lciwgbmFtZSkubGVuZ3RoID4gMDtcbiAgfVxufVxuXG4vLyBUaGUgbWV0aG9kcyBuYW1lZCBoZXJlIHdpbGwgYmUgZGVsZWdhdGVkIHRvIHRoZSBjdXJyZW50IFN0YXRlLlxuLy9cbi8vIER1cGxpY2F0ZWQgaGVyZSByYXRoZXIgdGhhbiBqdXN0IHVzaW5nIGBleHBlY3RlZERlbGVnYXRlc2AgZGlyZWN0bHkgc28gdGhhdCB0aGlzIGZpbGUgaXMgZ3JlcC1mcmllbmRseSBmb3IgYW5zd2VyaW5nXG4vLyB0aGUgcXVlc3Rpb24gb2YgXCJ3aGF0IGFsbCBjYW4gYSBSZXBvc2l0b3J5IGRvIGV4YWN0bHlcIi5cbmNvbnN0IGRlbGVnYXRlcyA9IFtcbiAgJ2lzTG9hZGluZ0d1ZXNzJyxcbiAgJ2lzQWJzZW50R3Vlc3MnLFxuICAnaXNBYnNlbnQnLFxuICAnaXNMb2FkaW5nJyxcbiAgJ2lzRW1wdHknLFxuICAnaXNQcmVzZW50JyxcbiAgJ2lzVG9vTGFyZ2UnLFxuICAnaXNEZXN0cm95ZWQnLFxuXG4gICdpc1VuZGV0ZXJtaW5lZCcsXG4gICdzaG93R2l0VGFiSW5pdCcsXG4gICdzaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MnLFxuICAnc2hvd0dpdFRhYkxvYWRpbmcnLFxuICAnc2hvd1N0YXR1c0JhclRpbGVzJyxcbiAgJ2hhc0RpcmVjdG9yeScsXG4gICdpc1B1Ymxpc2hhYmxlJyxcblxuICAnaW5pdCcsXG4gICdjbG9uZScsXG4gICdkZXN0cm95JyxcbiAgJ3JlZnJlc2gnLFxuICAnb2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UnLFxuICAndXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZScsXG5cbiAgJ3N0YWdlRmlsZXMnLFxuICAndW5zdGFnZUZpbGVzJyxcbiAgJ3N0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0JyxcbiAgJ3N0YWdlRmlsZU1vZGVDaGFuZ2UnLFxuICAnc3RhZ2VGaWxlU3ltbGlua0NoYW5nZScsXG4gICdhcHBseVBhdGNoVG9JbmRleCcsXG4gICdhcHBseVBhdGNoVG9Xb3JrZGlyJyxcblxuICAnY29tbWl0JyxcblxuICAnbWVyZ2UnLFxuICAnYWJvcnRNZXJnZScsXG4gICdjaGVja291dFNpZGUnLFxuICAnbWVyZ2VGaWxlJyxcbiAgJ3dyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgnLFxuXG4gICdjaGVja291dCcsXG4gICdjaGVja291dFBhdGhzQXRSZXZpc2lvbicsXG5cbiAgJ3VuZG9MYXN0Q29tbWl0JyxcblxuICAnZmV0Y2gnLFxuICAncHVsbCcsXG4gICdwdXNoJyxcblxuICAnc2V0Q29uZmlnJyxcblxuICAnY3JlYXRlQmxvYicsXG4gICdleHBhbmRCbG9iVG9GaWxlJyxcblxuICAnY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iJyxcbiAgJ3VwZGF0ZURpc2NhcmRIaXN0b3J5JyxcbiAgJ3N0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icycsXG4gICdyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcycsXG4gICdwb3BEaXNjYXJkSGlzdG9yeScsXG4gICdjbGVhckRpc2NhcmRIaXN0b3J5JyxcbiAgJ2Rpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzJyxcblxuICAnZ2V0U3RhdHVzQnVuZGxlJyxcbiAgJ2dldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzJyxcbiAgJ2dldEZpbGVQYXRjaEZvclBhdGgnLFxuICAnZ2V0RGlmZnNGb3JGaWxlUGF0aCcsXG4gICdnZXRTdGFnZWRDaGFuZ2VzUGF0Y2gnLFxuICAncmVhZEZpbGVGcm9tSW5kZXgnLFxuXG4gICdnZXRMYXN0Q29tbWl0JyxcbiAgJ2dldENvbW1pdCcsXG4gICdnZXRSZWNlbnRDb21taXRzJyxcbiAgJ2lzQ29tbWl0UHVzaGVkJyxcblxuICAnZ2V0QXV0aG9ycycsXG5cbiAgJ2dldEJyYW5jaGVzJyxcbiAgJ2dldEhlYWREZXNjcmlwdGlvbicsXG5cbiAgJ2lzTWVyZ2luZycsXG4gICdpc1JlYmFzaW5nJyxcblxuICAnZ2V0UmVtb3RlcycsXG4gICdhZGRSZW1vdGUnLFxuXG4gICdnZXRBaGVhZENvdW50JyxcbiAgJ2dldEJlaGluZENvdW50JyxcblxuICAnZ2V0Q29uZmlnJyxcbiAgJ3Vuc2V0Q29uZmlnJyxcblxuICAnZ2V0QmxvYkNvbnRlbnRzJyxcblxuICAnaGFzRGlzY2FyZEhpc3RvcnknLFxuICAnZ2V0RGlzY2FyZEhpc3RvcnknLFxuICAnZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMnLFxuXG4gICdnZXRPcGVyYXRpb25TdGF0ZXMnLFxuXG4gICdzZXRDb21taXRNZXNzYWdlJyxcbiAgJ2dldENvbW1pdE1lc3NhZ2UnLFxuICAnZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUnLFxuICAnZ2V0Q2FjaGUnLFxuICAnYWNjZXB0SW52YWxpZGF0aW9uJyxcbl07XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgZGVsZWdhdGVzLmxlbmd0aDsgaSsrKSB7XG4gIGNvbnN0IGRlbGVnYXRlID0gZGVsZWdhdGVzW2ldO1xuXG4gIFJlcG9zaXRvcnkucHJvdG90eXBlW2RlbGVnYXRlXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVtkZWxlZ2F0ZV0oLi4uYXJncyk7XG4gIH07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFDLFNBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFNBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFJLGVBQUEsR0FBQUosT0FBQTtBQUNBLElBQUFLLHFCQUFBLEdBQUFOLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTSxPQUFBLEdBQUFDLHVCQUFBLENBQUFQLE9BQUE7QUFDQSxJQUFBUSxPQUFBLEdBQUFULHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUyxpQkFBQSxHQUFBVCxPQUFBO0FBQStFLFNBQUFVLHlCQUFBQyxDQUFBLDZCQUFBQyxPQUFBLG1CQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFGLHdCQUFBLFlBQUFBLENBQUFDLENBQUEsV0FBQUEsQ0FBQSxHQUFBRyxDQUFBLEdBQUFELENBQUEsS0FBQUYsQ0FBQTtBQUFBLFNBQUFKLHdCQUFBSSxDQUFBLEVBQUFFLENBQUEsU0FBQUEsQ0FBQSxJQUFBRixDQUFBLElBQUFBLENBQUEsQ0FBQUksVUFBQSxTQUFBSixDQUFBLGVBQUFBLENBQUEsdUJBQUFBLENBQUEseUJBQUFBLENBQUEs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