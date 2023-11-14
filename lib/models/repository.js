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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfeXViaWtpcmkiLCJfYWN0aW9uUGlwZWxpbmUiLCJfY29tcG9zaXRlR2l0U3RyYXRlZ3kiLCJfYXV0aG9yIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfYnJhbmNoIiwiX3JlcG9zaXRvcnlTdGF0ZXMiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJuIiwiX19wcm90b19fIiwiYSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImkiLCJzZXQiLCJvYmoiLCJvd25LZXlzIiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsIlR5cGVFcnJvciIsIk51bWJlciIsIk1FUkdFX01BUktFUl9SRUdFWCIsImluaXRpYWxTdGF0ZVN5bSIsIlJlcG9zaXRvcnkiLCJjb25zdHJ1Y3RvciIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwiZ2l0U3RyYXRlZ3kiLCJvcHRpb25zIiwiZ2l0IiwiQ29tcG9zaXRlR2l0U3RyYXRlZ3kiLCJjcmVhdGUiLCJlbWl0dGVyIiwiRW1pdHRlciIsImxvYWRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzdWIiLCJvbkRpZENoYW5nZVN0YXRlIiwiaXNMb2FkaW5nIiwiZGlzcG9zZSIsImlzRGVzdHJveWVkIiwicGlwZWxpbmVNYW5hZ2VyIiwiZ2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlciIsInRyYW5zaXRpb25UbyIsIkxvYWRpbmciLCJhYnNlbnQiLCJBYnNlbnQiLCJsb2FkaW5nR3Vlc3MiLCJMb2FkaW5nR3Vlc3MiLCJhYnNlbnRHdWVzcyIsIkFic2VudEd1ZXNzIiwidHJhbnNpdGlvbiIsImN1cnJlbnRTdGF0ZSIsIlN0YXRlQ29uc3RydWN0b3IiLCJwYXlsb2FkIiwic3RhdGUiLCJuZXh0U3RhdGUiLCJlbWl0IiwiZnJvbSIsInRvIiwic3RhcnQiLCJnZXRMb2FkUHJvbWlzZSIsImlzQWJzZW50IiwicmVqZWN0IiwiRXJyb3IiLCJzZXRQcm9tcHRDYWxsYmFjayIsImNhbGxiYWNrIiwiZ2V0SW1wbGVtZW50ZXJzIiwic3RyYXRlZ3kiLCJnZXRQaXBlbGluZSIsImFjdGlvbk5hbWUiLCJhY3Rpb25LZXkiLCJhY3Rpb25LZXlzIiwiZXhlY3V0ZVBpcGVsaW5lQWN0aW9uIiwiZm4iLCJhcmdzIiwicGlwZWxpbmUiLCJydW4iLCJvbkRpZERlc3Ryb3kiLCJvbiIsIm9uRGlkVXBkYXRlIiwib25EaWRHbG9iYWxseUludmFsaWRhdGUiLCJvblB1bGxFcnJvciIsImRpZFB1bGxFcnJvciIsInBhdGhIYXNNZXJnZU1hcmtlcnMiLCJyZWxhdGl2ZVBhdGgiLCJjb250ZW50cyIsImZzIiwicmVhZEZpbGUiLCJwYXRoIiwiam9pbiIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiZW5jb2RpbmciLCJ0ZXN0IiwiY29kZSIsImdldE1lcmdlTWVzc2FnZSIsImdldEdpdERpcmVjdG9yeVBhdGgiLCJzcGxpdCIsImxpbmUiLCJzdGFydHNXaXRoIiwic2V0R2l0RGlyZWN0b3J5UGF0aCIsImdpdERpcmVjdG9yeVBhdGgiLCJfZ2l0RGlyZWN0b3J5UGF0aCIsImlzSW5TdGF0ZSIsInN0YXRlTmFtZSIsIm5hbWUiLCJ0b1N0cmluZyIsImdldEN1cnJlbnRCcmFuY2giLCJicmFuY2hlcyIsImdldEJyYW5jaGVzIiwiaGVhZCIsImdldEhlYWRCcmFuY2giLCJpc1ByZXNlbnQiLCJkZXNjcmlwdGlvbiIsImdldEhlYWREZXNjcmlwdGlvbiIsIkJyYW5jaCIsImNyZWF0ZURldGFjaGVkIiwiZ2V0VW5zdGFnZWRDaGFuZ2VzIiwidW5zdGFnZWRGaWxlcyIsImdldFN0YXR1c0J1bmRsZSIsInNvcnQiLCJtYXAiLCJmaWxlUGF0aCIsInN0YXR1cyIsImdldFN0YWdlZENoYW5nZXMiLCJzdGFnZWRGaWxlcyIsImdldE1lcmdlQ29uZmxpY3RzIiwibWVyZ2VDb25mbGljdEZpbGVzIiwiaXNQYXJ0aWFsbHlTdGFnZWQiLCJmaWxlTmFtZSIsInMiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJicmFuY2hOYW1lIiwiZ2V0Q29uZmlnIiwiZ2V0UmVtb3RlcyIsIndpdGhOYW1lIiwic2F2ZURpc2NhcmRIaXN0b3J5IiwiaGlzdG9yeVNoYSIsImNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYiIsInNldENvbmZpZyIsImdldENvbW1pdHRlciIsImNvbW1pdHRlciIsInl1YmlraXJpIiwiZW1haWwiLCJBdXRob3IiLCJudWxsQXV0aG9yIiwiZ2V0Q3VycmVudEdpdEh1YlJlbW90ZSIsImN1cnJlbnRSZW1vdGUiLCJyZW1vdGVzIiwiZ2l0SHViUmVtb3RlcyIsInJlbW90ZSIsImlzR2l0aHViUmVwbyIsInNlbGVjdGVkUmVtb3RlTmFtZSIsInNpemUiLCJBcnJheSIsImhhc0dpdEh1YlJlbW90ZSIsImhvc3QiLCJvd25lciIsIm1hdGNoaW5nR2l0SHViUmVwb3NpdG9yeSIsImV4cG9ydHMiLCJkZWxlZ2F0ZXMiLCJkZWxlZ2F0ZSJdLCJzb3VyY2VzIjpbInJlcG9zaXRvcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuXG5pbXBvcnQge2dldE51bGxBY3Rpb25QaXBlbGluZU1hbmFnZXJ9IGZyb20gJy4uL2FjdGlvbi1waXBlbGluZSc7XG5pbXBvcnQgQ29tcG9zaXRlR2l0U3RyYXRlZ3kgZnJvbSAnLi4vY29tcG9zaXRlLWdpdC1zdHJhdGVneSc7XG5pbXBvcnQgQXV0aG9yLCB7bnVsbEF1dGhvcn0gZnJvbSAnLi9hdXRob3InO1xuaW1wb3J0IEJyYW5jaCBmcm9tICcuL2JyYW5jaCc7XG5pbXBvcnQge0xvYWRpbmcsIEFic2VudCwgTG9hZGluZ0d1ZXNzLCBBYnNlbnRHdWVzc30gZnJvbSAnLi9yZXBvc2l0b3J5LXN0YXRlcyc7XG5cbmNvbnN0IE1FUkdFX01BUktFUl9SRUdFWCA9IC9eKD58PCl7N30gXFxTKyQvbTtcblxuLy8gSW50ZXJuYWwgb3B0aW9uIGtleXMgdXNlZCB0byBkZXNpZ25hdGUgdGhlIGRlc2lyZWQgaW5pdGlhbCBzdGF0ZSBvZiBhIFJlcG9zaXRvcnkuXG5jb25zdCBpbml0aWFsU3RhdGVTeW0gPSBTeW1ib2woJ2luaXRpYWxTdGF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvc2l0b3J5IHtcbiAgY29uc3RydWN0b3Iod29ya2luZ0RpcmVjdG9yeVBhdGgsIGdpdFN0cmF0ZWd5ID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy53b3JraW5nRGlyZWN0b3J5UGF0aCA9IHdvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICAgIHRoaXMuZ2l0ID0gZ2l0U3RyYXRlZ3kgfHwgQ29tcG9zaXRlR2l0U3RyYXRlZ3kuY3JlYXRlKHdvcmtpbmdEaXJlY3RvcnlQYXRoKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICB0aGlzLmxvYWRQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLm9uRGlkQ2hhbmdlU3RhdGUoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkaW5nKCkpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgc3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucGlwZWxpbmVNYW5hZ2VyID0gb3B0aW9ucy5waXBlbGluZU1hbmFnZXIgfHwgZ2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlcigpO1xuICAgIHRoaXMudHJhbnNpdGlvblRvKG9wdGlvbnNbaW5pdGlhbFN0YXRlU3ltXSB8fCBMb2FkaW5nKTtcbiAgfVxuXG4gIHN0YXRpYyBhYnNlbnQob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUmVwb3NpdG9yeShudWxsLCBudWxsLCB7W2luaXRpYWxTdGF0ZVN5bV06IEFic2VudCwgLi4ub3B0aW9uc30pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRpbmdHdWVzcyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogTG9hZGluZ0d1ZXNzLCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICBzdGF0aWMgYWJzZW50R3Vlc3Mob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUmVwb3NpdG9yeShudWxsLCBudWxsLCB7W2luaXRpYWxTdGF0ZVN5bV06IEFic2VudEd1ZXNzLCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICAvLyBTdGF0ZSBtYW5hZ2VtZW50IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdHJhbnNpdGlvbihjdXJyZW50U3RhdGUsIFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpIHtcbiAgICBpZiAoY3VycmVudFN0YXRlICE9PSB0aGlzLnN0YXRlKSB7XG4gICAgICAvLyBBdHRlbXB0ZWQgdHJhbnNpdGlvbiBmcm9tIGEgbm9uLWFjdGl2ZSBzdGF0ZSwgbW9zdCBsaWtlbHkgZnJvbSBhbiBhc3luY2hyb25vdXMgc3RhcnQoKSBtZXRob2QuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFN0YXRlID0gbmV3IFN0YXRlQ29uc3RydWN0b3IodGhpcywgLi4ucGF5bG9hZCk7XG4gICAgdGhpcy5zdGF0ZSA9IG5leHRTdGF0ZTtcblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXN0YXRlJywge2Zyb206IGN1cnJlbnRTdGF0ZSwgdG86IHRoaXMuc3RhdGV9KTtcbiAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zdGFydCgpO1xuICB9XG5cbiAgdHJhbnNpdGlvblRvKFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uKHRoaXMuc3RhdGUsIFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpO1xuICB9XG5cbiAgZ2V0TG9hZFByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBYnNlbnQoKSA/IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignQW4gYWJzZW50IHJlcG9zaXRvcnkgd2lsbCBuZXZlciBsb2FkJykpIDogdGhpcy5sb2FkUHJvbWlzZTtcbiAgfVxuXG4gIC8qXG4gICAqIFVzZSBgY2FsbGJhY2tgIHRvIHJlcXVlc3QgdXNlciBpbnB1dCBmcm9tIGFsbCBnaXQgc3RyYXRlZ2llcy5cbiAgICovXG4gIHNldFByb21wdENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5naXQuZ2V0SW1wbGVtZW50ZXJzKCkuZm9yRWFjaChzdHJhdGVneSA9PiBzdHJhdGVneS5zZXRQcm9tcHRDYWxsYmFjayhjYWxsYmFjaykpO1xuICB9XG5cbiAgLy8gUGlwZWxpbmVcbiAgZ2V0UGlwZWxpbmUoYWN0aW9uTmFtZSkge1xuICAgIGNvbnN0IGFjdGlvbktleSA9IHRoaXMucGlwZWxpbmVNYW5hZ2VyLmFjdGlvbktleXNbYWN0aW9uTmFtZV07XG4gICAgcmV0dXJuIHRoaXMucGlwZWxpbmVNYW5hZ2VyLmdldFBpcGVsaW5lKGFjdGlvbktleSk7XG4gIH1cblxuICBleGVjdXRlUGlwZWxpbmVBY3Rpb24oYWN0aW9uTmFtZSwgZm4sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuZ2V0UGlwZWxpbmUoYWN0aW9uTmFtZSk7XG4gICAgcmV0dXJuIHBpcGVsaW5lLnJ1bihmbiwgdGhpcywgLi4uYXJncyk7XG4gIH1cblxuICAvLyBFdmVudCBzdWJzY3JpcHRpb24gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZENoYW5nZVN0YXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zdGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkR2xvYmFsbHlJbnZhbGlkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWdsb2JhbGx5LWludmFsaWRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvblB1bGxFcnJvcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3B1bGwtZXJyb3InLCBjYWxsYmFjayk7XG4gIH1cblxuICBkaWRQdWxsRXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5lbWl0KCdwdWxsLWVycm9yJyk7XG4gIH1cblxuICAvLyBTdGF0ZS1pbmRlcGVuZGVudCBhY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIEFjdGlvbnMgdGhhdCB1c2UgZGlyZWN0IGZpbGVzeXN0ZW0gYWNjZXNzIG9yIG90aGVyd2lzZSBkb24ndCBuZWVkIGB0aGlzLmdpdGAgdG8gYmUgYXZhaWxhYmxlLlxuXG4gIGFzeW5jIHBhdGhIYXNNZXJnZU1hcmtlcnMocmVsYXRpdmVQYXRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUocGF0aC5qb2luKHRoaXMuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSwgcmVsYXRpdmVQYXRoKSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIHJldHVybiBNRVJHRV9NQVJLRVJfUkVHRVgudGVzdChjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gRUlTRElSIGltcGxpZXMgdGhpcyBpcyBhIHN1Ym1vZHVsZVxuICAgICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcgfHwgZS5jb2RlID09PSAnRUlTRElSJykgeyByZXR1cm4gZmFsc2U7IH0gZWxzZSB7IHRocm93IGU7IH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRNZXJnZU1lc3NhZ2UoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUocGF0aC5qb2luKHRoaXMuZ2V0R2l0RGlyZWN0b3J5UGF0aCgpLCAnTUVSR0VfTVNHJyksIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgICByZXR1cm4gY29udGVudHMuc3BsaXQoL1xcbi8pLmZpbHRlcihsaW5lID0+IGxpbmUubGVuZ3RoID4gMCAmJiAhbGluZS5zdGFydHNXaXRoKCcjJykpLmpvaW4oJ1xcbicpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXRlLWluZGVwZW5kZW50IGFjY2Vzc29ycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcbiAgfVxuXG4gIHNldEdpdERpcmVjdG9yeVBhdGgoZ2l0RGlyZWN0b3J5UGF0aCkge1xuICAgIHRoaXMuX2dpdERpcmVjdG9yeVBhdGggPSBnaXREaXJlY3RvcnlQYXRoO1xuICB9XG5cbiAgZ2V0R2l0RGlyZWN0b3J5UGF0aCgpIHtcbiAgICBpZiAodGhpcy5fZ2l0RGlyZWN0b3J5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dpdERpcmVjdG9yeVBhdGg7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpIHtcbiAgICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCAnLmdpdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBYnNlbnQvTG9hZGluZy9ldGMuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc0luU3RhdGUoc3RhdGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY29uc3RydWN0b3IubmFtZSA9PT0gc3RhdGVOYW1lO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBSZXBvc2l0b3J5KHN0YXRlPSR7dGhpcy5zdGF0ZS5jb25zdHJ1Y3Rvci5uYW1lfSwgd29ya2Rpcj1cIiR7dGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpfVwiKWA7XG4gIH1cblxuICAvLyBDb21wb3VuZCBHZXR0ZXJzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIEFjY2Vzc29yIG1ldGhvZHMgZm9yIGRhdGEgZGVyaXZlZCBmcm9tIG90aGVyLCBzdGF0ZS1wcm92aWRlZCBnZXR0ZXJzLlxuXG4gIGFzeW5jIGdldEN1cnJlbnRCcmFuY2goKSB7XG4gICAgY29uc3QgYnJhbmNoZXMgPSBhd2FpdCB0aGlzLmdldEJyYW5jaGVzKCk7XG4gICAgY29uc3QgaGVhZCA9IGJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICBpZiAoaGVhZC5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGhlYWQ7XG4gICAgfVxuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBhd2FpdCB0aGlzLmdldEhlYWREZXNjcmlwdGlvbigpO1xuICAgIHJldHVybiBCcmFuY2guY3JlYXRlRGV0YWNoZWQoZGVzY3JpcHRpb24gfHwgJ25vIGJyYW5jaCcpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VW5zdGFnZWRDaGFuZ2VzKCkge1xuICAgIGNvbnN0IHt1bnN0YWdlZEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHVuc3RhZ2VkRmlsZXMpXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZpbGVQYXRoID0+IHsgcmV0dXJuIHtmaWxlUGF0aCwgc3RhdHVzOiB1bnN0YWdlZEZpbGVzW2ZpbGVQYXRoXX07IH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RhZ2VkQ2hhbmdlcygpIHtcbiAgICBjb25zdCB7c3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3RhZ2VkRmlsZXMpXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZpbGVQYXRoID0+IHsgcmV0dXJuIHtmaWxlUGF0aCwgc3RhdHVzOiBzdGFnZWRGaWxlc1tmaWxlUGF0aF19OyB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldE1lcmdlQ29uZmxpY3RzKCkge1xuICAgIGNvbnN0IHttZXJnZUNvbmZsaWN0RmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobWVyZ2VDb25mbGljdEZpbGVzKS5tYXAoZmlsZVBhdGggPT4ge1xuICAgICAgcmV0dXJuIHtmaWxlUGF0aCwgc3RhdHVzOiBtZXJnZUNvbmZsaWN0RmlsZXNbZmlsZVBhdGhdfTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGlzUGFydGlhbGx5U3RhZ2VkKGZpbGVOYW1lKSB7XG4gICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXMsIHN0YWdlZEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgY29uc3QgdSA9IHVuc3RhZ2VkRmlsZXNbZmlsZU5hbWVdO1xuICAgIGNvbnN0IHMgPSBzdGFnZWRGaWxlc1tmaWxlTmFtZV07XG4gICAgcmV0dXJuICh1ID09PSAnbW9kaWZpZWQnICYmIHMgPT09ICdtb2RpZmllZCcpIHx8XG4gICAgICAodSA9PT0gJ21vZGlmaWVkJyAmJiBzID09PSAnYWRkZWQnKSB8fFxuICAgICAgKHUgPT09ICdhZGRlZCcgJiYgcyA9PT0gJ2RlbGV0ZWQnKSB8fFxuICAgICAgKHUgPT09ICdkZWxldGVkJyAmJiBzID09PSAnbW9kaWZpZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKSB7XG4gICAgY29uc3QgbmFtZSA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKGBicmFuY2guJHticmFuY2hOYW1lfS5yZW1vdGVgKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpKS53aXRoTmFtZShuYW1lKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVEaXNjYXJkSGlzdG9yeSgpIHtcbiAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaGlzdG9yeVNoYSA9IGF3YWl0IHRoaXMuY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iKCk7XG4gICAgaWYgKHRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLnNldENvbmZpZygnYXRvbUdpdGh1Yi5oaXN0b3J5U2hhJywgaGlzdG9yeVNoYSk7XG4gIH1cblxuICBhc3luYyBnZXRDb21taXR0ZXIob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29tbWl0dGVyID0gYXdhaXQgeXViaWtpcmkoe1xuICAgICAgZW1haWw6IHRoaXMuZ2V0Q29uZmlnKCd1c2VyLmVtYWlsJywgb3B0aW9ucyksXG4gICAgICBuYW1lOiB0aGlzLmdldENvbmZpZygndXNlci5uYW1lJywgb3B0aW9ucyksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29tbWl0dGVyLm5hbWUgIT09IG51bGwgJiYgY29tbWl0dGVyLmVtYWlsICE9PSBudWxsXG4gICAgICA/IG5ldyBBdXRob3IoY29tbWl0dGVyLmVtYWlsLCBjb21taXR0ZXIubmFtZSlcbiAgICAgIDogbnVsbEF1dGhvcjtcbiAgfVxuXG4gIC8vIHRvZG8gKEBhbm50aHVyaXVtLCAzLzIwMTkpOiByZWZhY3RvciBHaXRIdWJUYWJDb250cm9sbGVyIGV0YyB0byB1c2UgdGhpcyBtZXRob2QuXG4gIGFzeW5jIGdldEN1cnJlbnRHaXRIdWJSZW1vdGUoKSB7XG4gICAgbGV0IGN1cnJlbnRSZW1vdGUgPSBudWxsO1xuXG4gICAgY29uc3QgcmVtb3RlcyA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpO1xuXG4gICAgY29uc3QgZ2l0SHViUmVtb3RlcyA9IHJlbW90ZXMuZmlsdGVyKHJlbW90ZSA9PiByZW1vdGUuaXNHaXRodWJSZXBvKCkpO1xuICAgIGNvbnN0IHNlbGVjdGVkUmVtb3RlTmFtZSA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdhdG9tR2l0aHViLmN1cnJlbnRSZW1vdGUnKTtcbiAgICBjdXJyZW50UmVtb3RlID0gZ2l0SHViUmVtb3Rlcy53aXRoTmFtZShzZWxlY3RlZFJlbW90ZU5hbWUpO1xuXG4gICAgaWYgKCFjdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpICYmIGdpdEh1YlJlbW90ZXMuc2l6ZSgpID09PSAxKSB7XG4gICAgICBjdXJyZW50UmVtb3RlID0gQXJyYXkuZnJvbShnaXRIdWJSZW1vdGVzKVswXTtcbiAgICB9XG4gICAgLy8gdG9kbzogaGFuZGxlIHRoZSBjYXNlIHdoZXJlIG11bHRpcGxlIHJlbW90ZXMgYXJlIGF2YWlsYWJsZSBhbmQgbm8gY2hvc2VuIHJlbW90ZSBpcyBzZXQuXG4gICAgcmV0dXJuIGN1cnJlbnRSZW1vdGU7XG4gIH1cblxuXG4gIGFzeW5jIGhhc0dpdEh1YlJlbW90ZShob3N0LCBvd25lciwgbmFtZSkge1xuICAgIGNvbnN0IHJlbW90ZXMgPSBhd2FpdCB0aGlzLmdldFJlbW90ZXMoKTtcbiAgICByZXR1cm4gcmVtb3Rlcy5tYXRjaGluZ0dpdEh1YlJlcG9zaXRvcnkob3duZXIsIG5hbWUpLmxlbmd0aCA+IDA7XG4gIH1cbn1cblxuLy8gVGhlIG1ldGhvZHMgbmFtZWQgaGVyZSB3aWxsIGJlIGRlbGVnYXRlZCB0byB0aGUgY3VycmVudCBTdGF0ZS5cbi8vXG4vLyBEdXBsaWNhdGVkIGhlcmUgcmF0aGVyIHRoYW4ganVzdCB1c2luZyBgZXhwZWN0ZWREZWxlZ2F0ZXNgIGRpcmVjdGx5IHNvIHRoYXQgdGhpcyBmaWxlIGlzIGdyZXAtZnJpZW5kbHkgZm9yIGFuc3dlcmluZ1xuLy8gdGhlIHF1ZXN0aW9uIG9mIFwid2hhdCBhbGwgY2FuIGEgUmVwb3NpdG9yeSBkbyBleGFjdGx5XCIuXG5jb25zdCBkZWxlZ2F0ZXMgPSBbXG4gICdpc0xvYWRpbmdHdWVzcycsXG4gICdpc0Fic2VudEd1ZXNzJyxcbiAgJ2lzQWJzZW50JyxcbiAgJ2lzTG9hZGluZycsXG4gICdpc0VtcHR5JyxcbiAgJ2lzUHJlc2VudCcsXG4gICdpc1Rvb0xhcmdlJyxcbiAgJ2lzRGVzdHJveWVkJyxcblxuICAnaXNVbmRldGVybWluZWQnLFxuICAnc2hvd0dpdFRhYkluaXQnLFxuICAnc2hvd0dpdFRhYkluaXRJblByb2dyZXNzJyxcbiAgJ3Nob3dHaXRUYWJMb2FkaW5nJyxcbiAgJ3Nob3dTdGF0dXNCYXJUaWxlcycsXG4gICdoYXNEaXJlY3RvcnknLFxuICAnaXNQdWJsaXNoYWJsZScsXG5cbiAgJ2luaXQnLFxuICAnY2xvbmUnLFxuICAnZGVzdHJveScsXG4gICdyZWZyZXNoJyxcbiAgJ29ic2VydmVGaWxlc3lzdGVtQ2hhbmdlJyxcbiAgJ3VwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UnLFxuXG4gICdzdGFnZUZpbGVzJyxcbiAgJ3Vuc3RhZ2VGaWxlcycsXG4gICdzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdCcsXG4gICdzdGFnZUZpbGVNb2RlQ2hhbmdlJyxcbiAgJ3N0YWdlRmlsZVN5bWxpbmtDaGFuZ2UnLFxuICAnYXBwbHlQYXRjaFRvSW5kZXgnLFxuICAnYXBwbHlQYXRjaFRvV29ya2RpcicsXG5cbiAgJ2NvbW1pdCcsXG5cbiAgJ21lcmdlJyxcbiAgJ2Fib3J0TWVyZ2UnLFxuICAnY2hlY2tvdXRTaWRlJyxcbiAgJ21lcmdlRmlsZScsXG4gICd3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4JyxcblxuICAnY2hlY2tvdXQnLFxuICAnY2hlY2tvdXRQYXRoc0F0UmV2aXNpb24nLFxuXG4gICd1bmRvTGFzdENvbW1pdCcsXG5cbiAgJ2ZldGNoJyxcbiAgJ3B1bGwnLFxuICAncHVzaCcsXG5cbiAgJ3NldENvbmZpZycsXG5cbiAgJ2NyZWF0ZUJsb2InLFxuICAnZXhwYW5kQmxvYlRvRmlsZScsXG5cbiAgJ2NyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYicsXG4gICd1cGRhdGVEaXNjYXJkSGlzdG9yeScsXG4gICdzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMnLFxuICAncmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMnLFxuICAncG9wRGlzY2FyZEhpc3RvcnknLFxuICAnY2xlYXJEaXNjYXJkSGlzdG9yeScsXG4gICdkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocycsXG5cbiAgJ2dldFN0YXR1c0J1bmRsZScsXG4gICdnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcycsXG4gICdnZXRGaWxlUGF0Y2hGb3JQYXRoJyxcbiAgJ2dldERpZmZzRm9yRmlsZVBhdGgnLFxuICAnZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoJyxcbiAgJ3JlYWRGaWxlRnJvbUluZGV4JyxcblxuICAnZ2V0TGFzdENvbW1pdCcsXG4gICdnZXRDb21taXQnLFxuICAnZ2V0UmVjZW50Q29tbWl0cycsXG4gICdpc0NvbW1pdFB1c2hlZCcsXG5cbiAgJ2dldEF1dGhvcnMnLFxuXG4gICdnZXRCcmFuY2hlcycsXG4gICdnZXRIZWFkRGVzY3JpcHRpb24nLFxuXG4gICdpc01lcmdpbmcnLFxuICAnaXNSZWJhc2luZycsXG5cbiAgJ2dldFJlbW90ZXMnLFxuICAnYWRkUmVtb3RlJyxcblxuICAnZ2V0QWhlYWRDb3VudCcsXG4gICdnZXRCZWhpbmRDb3VudCcsXG5cbiAgJ2dldENvbmZpZycsXG4gICd1bnNldENvbmZpZycsXG5cbiAgJ2dldEJsb2JDb250ZW50cycsXG5cbiAgJ2hhc0Rpc2NhcmRIaXN0b3J5JyxcbiAgJ2dldERpc2NhcmRIaXN0b3J5JyxcbiAgJ2dldExhc3RIaXN0b3J5U25hcHNob3RzJyxcblxuICAnZ2V0T3BlcmF0aW9uU3RhdGVzJyxcblxuICAnc2V0Q29tbWl0TWVzc2FnZScsXG4gICdnZXRDb21taXRNZXNzYWdlJyxcbiAgJ2ZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlJyxcbiAgJ2dldENhY2hlJyxcbiAgJ2FjY2VwdEludmFsaWRhdGlvbicsXG5dO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IGRlbGVnYXRlcy5sZW5ndGg7IGkrKykge1xuICBjb25zdCBkZWxlZ2F0ZSA9IGRlbGVnYXRlc1tpXTtcblxuICBSZXBvc2l0b3J5LnByb3RvdHlwZVtkZWxlZ2F0ZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVbZGVsZWdhdGVdKC4uLmFyZ3MpO1xuICB9O1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxRQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxTQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBSSxlQUFBLEdBQUFKLE9BQUE7QUFDQSxJQUFBSyxxQkFBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU0sT0FBQSxHQUFBQyx1QkFBQSxDQUFBUCxPQUFBO0FBQ0EsSUFBQVEsT0FBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVMsaUJBQUEsR0FBQVQsT0FBQTtBQUErRSxTQUFBVSx5QkFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxDQUFBLFdBQUFBLENBQUEsR0FBQUcsQ0FBQSxHQUFBRCxDQUFBLEtBQUFGLENBQUE7QUFBQSxTQUFBSix3QkFBQUksQ0FBQSxFQUFBRSxDQUFBLFNBQUFBLENBQUEsSUFBQUYsQ0FBQSxJQUFBQSxDQUFBLENBQUFJLFVBQUEs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