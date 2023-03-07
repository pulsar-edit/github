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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfeXViaWtpcmkiLCJfYWN0aW9uUGlwZWxpbmUiLCJfY29tcG9zaXRlR2l0U3RyYXRlZ3kiLCJfYXV0aG9yIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfYnJhbmNoIiwiX3JlcG9zaXRvcnlTdGF0ZXMiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJub2RlSW50ZXJvcCIsIldlYWtNYXAiLCJjYWNoZUJhYmVsSW50ZXJvcCIsImNhY2hlTm9kZUludGVyb3AiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0Iiwib3duS2V5cyIsIm9iamVjdCIsImVudW1lcmFibGVPbmx5Iiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsInN5bWJvbHMiLCJmaWx0ZXIiLCJzeW0iLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsInRhcmdldCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzb3VyY2UiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJNRVJHRV9NQVJLRVJfUkVHRVgiLCJpbml0aWFsU3RhdGVTeW0iLCJSZXBvc2l0b3J5IiwiY29uc3RydWN0b3IiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdpdFN0cmF0ZWd5Iiwib3B0aW9ucyIsImdpdCIsIkNvbXBvc2l0ZUdpdFN0cmF0ZWd5IiwiY3JlYXRlIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJsb2FkUHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwic3ViIiwib25EaWRDaGFuZ2VTdGF0ZSIsImlzTG9hZGluZyIsImRpc3Bvc2UiLCJpc0Rlc3Ryb3llZCIsInBpcGVsaW5lTWFuYWdlciIsImdldE51bGxBY3Rpb25QaXBlbGluZU1hbmFnZXIiLCJ0cmFuc2l0aW9uVG8iLCJMb2FkaW5nIiwiYWJzZW50IiwiQWJzZW50IiwibG9hZGluZ0d1ZXNzIiwiTG9hZGluZ0d1ZXNzIiwiYWJzZW50R3Vlc3MiLCJBYnNlbnRHdWVzcyIsInRyYW5zaXRpb24iLCJjdXJyZW50U3RhdGUiLCJTdGF0ZUNvbnN0cnVjdG9yIiwicGF5bG9hZCIsInN0YXRlIiwibmV4dFN0YXRlIiwiZW1pdCIsImZyb20iLCJ0byIsInN0YXJ0IiwiZ2V0TG9hZFByb21pc2UiLCJpc0Fic2VudCIsInJlamVjdCIsIkVycm9yIiwic2V0UHJvbXB0Q2FsbGJhY2siLCJjYWxsYmFjayIsImdldEltcGxlbWVudGVycyIsInN0cmF0ZWd5IiwiZ2V0UGlwZWxpbmUiLCJhY3Rpb25OYW1lIiwiYWN0aW9uS2V5IiwiYWN0aW9uS2V5cyIsImV4ZWN1dGVQaXBlbGluZUFjdGlvbiIsImZuIiwiYXJncyIsInBpcGVsaW5lIiwicnVuIiwib25EaWREZXN0cm95Iiwib24iLCJvbkRpZFVwZGF0ZSIsIm9uRGlkR2xvYmFsbHlJbnZhbGlkYXRlIiwib25QdWxsRXJyb3IiLCJkaWRQdWxsRXJyb3IiLCJwYXRoSGFzTWVyZ2VNYXJrZXJzIiwicmVsYXRpdmVQYXRoIiwiY29udGVudHMiLCJmcyIsInJlYWRGaWxlIiwicGF0aCIsImpvaW4iLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsImVuY29kaW5nIiwidGVzdCIsImUiLCJjb2RlIiwiZ2V0TWVyZ2VNZXNzYWdlIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsInNwbGl0IiwibGluZSIsInN0YXJ0c1dpdGgiLCJzZXRHaXREaXJlY3RvcnlQYXRoIiwiZ2l0RGlyZWN0b3J5UGF0aCIsIl9naXREaXJlY3RvcnlQYXRoIiwiaXNJblN0YXRlIiwic3RhdGVOYW1lIiwibmFtZSIsInRvU3RyaW5nIiwiZ2V0Q3VycmVudEJyYW5jaCIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJoZWFkIiwiZ2V0SGVhZEJyYW5jaCIsImlzUHJlc2VudCIsImRlc2NyaXB0aW9uIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiQnJhbmNoIiwiY3JlYXRlRGV0YWNoZWQiLCJnZXRVbnN0YWdlZENoYW5nZXMiLCJ1bnN0YWdlZEZpbGVzIiwiZ2V0U3RhdHVzQnVuZGxlIiwic29ydCIsIm1hcCIsImZpbGVQYXRoIiwic3RhdHVzIiwiZ2V0U3RhZ2VkQ2hhbmdlcyIsInN0YWdlZEZpbGVzIiwiZ2V0TWVyZ2VDb25mbGljdHMiLCJtZXJnZUNvbmZsaWN0RmlsZXMiLCJpc1BhcnRpYWxseVN0YWdlZCIsImZpbGVOYW1lIiwidSIsInMiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJicmFuY2hOYW1lIiwiZ2V0Q29uZmlnIiwiZ2V0UmVtb3RlcyIsIndpdGhOYW1lIiwic2F2ZURpc2NhcmRIaXN0b3J5IiwiaGlzdG9yeVNoYSIsImNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYiIsInNldENvbmZpZyIsImdldENvbW1pdHRlciIsImNvbW1pdHRlciIsInl1YmlraXJpIiwiZW1haWwiLCJBdXRob3IiLCJudWxsQXV0aG9yIiwiZ2V0Q3VycmVudEdpdEh1YlJlbW90ZSIsImN1cnJlbnRSZW1vdGUiLCJyZW1vdGVzIiwiZ2l0SHViUmVtb3RlcyIsInJlbW90ZSIsImlzR2l0aHViUmVwbyIsInNlbGVjdGVkUmVtb3RlTmFtZSIsInNpemUiLCJBcnJheSIsImhhc0dpdEh1YlJlbW90ZSIsImhvc3QiLCJvd25lciIsIm1hdGNoaW5nR2l0SHViUmVwb3NpdG9yeSIsImV4cG9ydHMiLCJkZWxlZ2F0ZXMiLCJkZWxlZ2F0ZSJdLCJzb3VyY2VzIjpbInJlcG9zaXRvcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuXG5pbXBvcnQge2dldE51bGxBY3Rpb25QaXBlbGluZU1hbmFnZXJ9IGZyb20gJy4uL2FjdGlvbi1waXBlbGluZSc7XG5pbXBvcnQgQ29tcG9zaXRlR2l0U3RyYXRlZ3kgZnJvbSAnLi4vY29tcG9zaXRlLWdpdC1zdHJhdGVneSc7XG5pbXBvcnQgQXV0aG9yLCB7bnVsbEF1dGhvcn0gZnJvbSAnLi9hdXRob3InO1xuaW1wb3J0IEJyYW5jaCBmcm9tICcuL2JyYW5jaCc7XG5pbXBvcnQge0xvYWRpbmcsIEFic2VudCwgTG9hZGluZ0d1ZXNzLCBBYnNlbnRHdWVzc30gZnJvbSAnLi9yZXBvc2l0b3J5LXN0YXRlcyc7XG5cbmNvbnN0IE1FUkdFX01BUktFUl9SRUdFWCA9IC9eKD58PCl7N30gXFxTKyQvbTtcblxuLy8gSW50ZXJuYWwgb3B0aW9uIGtleXMgdXNlZCB0byBkZXNpZ25hdGUgdGhlIGRlc2lyZWQgaW5pdGlhbCBzdGF0ZSBvZiBhIFJlcG9zaXRvcnkuXG5jb25zdCBpbml0aWFsU3RhdGVTeW0gPSBTeW1ib2woJ2luaXRpYWxTdGF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvc2l0b3J5IHtcbiAgY29uc3RydWN0b3Iod29ya2luZ0RpcmVjdG9yeVBhdGgsIGdpdFN0cmF0ZWd5ID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy53b3JraW5nRGlyZWN0b3J5UGF0aCA9IHdvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICAgIHRoaXMuZ2l0ID0gZ2l0U3RyYXRlZ3kgfHwgQ29tcG9zaXRlR2l0U3RyYXRlZ3kuY3JlYXRlKHdvcmtpbmdEaXJlY3RvcnlQYXRoKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICB0aGlzLmxvYWRQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLm9uRGlkQ2hhbmdlU3RhdGUoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkaW5nKCkpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgc3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucGlwZWxpbmVNYW5hZ2VyID0gb3B0aW9ucy5waXBlbGluZU1hbmFnZXIgfHwgZ2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlcigpO1xuICAgIHRoaXMudHJhbnNpdGlvblRvKG9wdGlvbnNbaW5pdGlhbFN0YXRlU3ltXSB8fCBMb2FkaW5nKTtcbiAgfVxuXG4gIHN0YXRpYyBhYnNlbnQob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUmVwb3NpdG9yeShudWxsLCBudWxsLCB7W2luaXRpYWxTdGF0ZVN5bV06IEFic2VudCwgLi4ub3B0aW9uc30pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRpbmdHdWVzcyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZXBvc2l0b3J5KG51bGwsIG51bGwsIHtbaW5pdGlhbFN0YXRlU3ltXTogTG9hZGluZ0d1ZXNzLCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICBzdGF0aWMgYWJzZW50R3Vlc3Mob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUmVwb3NpdG9yeShudWxsLCBudWxsLCB7W2luaXRpYWxTdGF0ZVN5bV06IEFic2VudEd1ZXNzLCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICAvLyBTdGF0ZSBtYW5hZ2VtZW50IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdHJhbnNpdGlvbihjdXJyZW50U3RhdGUsIFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpIHtcbiAgICBpZiAoY3VycmVudFN0YXRlICE9PSB0aGlzLnN0YXRlKSB7XG4gICAgICAvLyBBdHRlbXB0ZWQgdHJhbnNpdGlvbiBmcm9tIGEgbm9uLWFjdGl2ZSBzdGF0ZSwgbW9zdCBsaWtlbHkgZnJvbSBhbiBhc3luY2hyb25vdXMgc3RhcnQoKSBtZXRob2QuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFN0YXRlID0gbmV3IFN0YXRlQ29uc3RydWN0b3IodGhpcywgLi4ucGF5bG9hZCk7XG4gICAgdGhpcy5zdGF0ZSA9IG5leHRTdGF0ZTtcblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXN0YXRlJywge2Zyb206IGN1cnJlbnRTdGF0ZSwgdG86IHRoaXMuc3RhdGV9KTtcbiAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zdGFydCgpO1xuICB9XG5cbiAgdHJhbnNpdGlvblRvKFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uKHRoaXMuc3RhdGUsIFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpO1xuICB9XG5cbiAgZ2V0TG9hZFByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBYnNlbnQoKSA/IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignQW4gYWJzZW50IHJlcG9zaXRvcnkgd2lsbCBuZXZlciBsb2FkJykpIDogdGhpcy5sb2FkUHJvbWlzZTtcbiAgfVxuXG4gIC8qXG4gICAqIFVzZSBgY2FsbGJhY2tgIHRvIHJlcXVlc3QgdXNlciBpbnB1dCBmcm9tIGFsbCBnaXQgc3RyYXRlZ2llcy5cbiAgICovXG4gIHNldFByb21wdENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5naXQuZ2V0SW1wbGVtZW50ZXJzKCkuZm9yRWFjaChzdHJhdGVneSA9PiBzdHJhdGVneS5zZXRQcm9tcHRDYWxsYmFjayhjYWxsYmFjaykpO1xuICB9XG5cbiAgLy8gUGlwZWxpbmVcbiAgZ2V0UGlwZWxpbmUoYWN0aW9uTmFtZSkge1xuICAgIGNvbnN0IGFjdGlvbktleSA9IHRoaXMucGlwZWxpbmVNYW5hZ2VyLmFjdGlvbktleXNbYWN0aW9uTmFtZV07XG4gICAgcmV0dXJuIHRoaXMucGlwZWxpbmVNYW5hZ2VyLmdldFBpcGVsaW5lKGFjdGlvbktleSk7XG4gIH1cblxuICBleGVjdXRlUGlwZWxpbmVBY3Rpb24oYWN0aW9uTmFtZSwgZm4sIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuZ2V0UGlwZWxpbmUoYWN0aW9uTmFtZSk7XG4gICAgcmV0dXJuIHBpcGVsaW5lLnJ1bihmbiwgdGhpcywgLi4uYXJncyk7XG4gIH1cblxuICAvLyBFdmVudCBzdWJzY3JpcHRpb24gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZENoYW5nZVN0YXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zdGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkR2xvYmFsbHlJbnZhbGlkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWdsb2JhbGx5LWludmFsaWRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvblB1bGxFcnJvcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3B1bGwtZXJyb3InLCBjYWxsYmFjayk7XG4gIH1cblxuICBkaWRQdWxsRXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5lbWl0KCdwdWxsLWVycm9yJyk7XG4gIH1cblxuICAvLyBTdGF0ZS1pbmRlcGVuZGVudCBhY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIEFjdGlvbnMgdGhhdCB1c2UgZGlyZWN0IGZpbGVzeXN0ZW0gYWNjZXNzIG9yIG90aGVyd2lzZSBkb24ndCBuZWVkIGB0aGlzLmdpdGAgdG8gYmUgYXZhaWxhYmxlLlxuXG4gIGFzeW5jIHBhdGhIYXNNZXJnZU1hcmtlcnMocmVsYXRpdmVQYXRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUocGF0aC5qb2luKHRoaXMuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSwgcmVsYXRpdmVQYXRoKSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIHJldHVybiBNRVJHRV9NQVJLRVJfUkVHRVgudGVzdChjb250ZW50cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gRUlTRElSIGltcGxpZXMgdGhpcyBpcyBhIHN1Ym1vZHVsZVxuICAgICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcgfHwgZS5jb2RlID09PSAnRUlTRElSJykgeyByZXR1cm4gZmFsc2U7IH0gZWxzZSB7IHRocm93IGU7IH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRNZXJnZU1lc3NhZ2UoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUocGF0aC5qb2luKHRoaXMuZ2V0R2l0RGlyZWN0b3J5UGF0aCgpLCAnTUVSR0VfTVNHJyksIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgICByZXR1cm4gY29udGVudHMuc3BsaXQoL1xcbi8pLmZpbHRlcihsaW5lID0+IGxpbmUubGVuZ3RoID4gMCAmJiAhbGluZS5zdGFydHNXaXRoKCcjJykpLmpvaW4oJ1xcbicpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXRlLWluZGVwZW5kZW50IGFjY2Vzc29ycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcbiAgfVxuXG4gIHNldEdpdERpcmVjdG9yeVBhdGgoZ2l0RGlyZWN0b3J5UGF0aCkge1xuICAgIHRoaXMuX2dpdERpcmVjdG9yeVBhdGggPSBnaXREaXJlY3RvcnlQYXRoO1xuICB9XG5cbiAgZ2V0R2l0RGlyZWN0b3J5UGF0aCgpIHtcbiAgICBpZiAodGhpcy5fZ2l0RGlyZWN0b3J5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dpdERpcmVjdG9yeVBhdGg7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpIHtcbiAgICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCAnLmdpdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBYnNlbnQvTG9hZGluZy9ldGMuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc0luU3RhdGUoc3RhdGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY29uc3RydWN0b3IubmFtZSA9PT0gc3RhdGVOYW1lO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBSZXBvc2l0b3J5KHN0YXRlPSR7dGhpcy5zdGF0ZS5jb25zdHJ1Y3Rvci5uYW1lfSwgd29ya2Rpcj1cIiR7dGhpcy5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpfVwiKWA7XG4gIH1cblxuICAvLyBDb21wb3VuZCBHZXR0ZXJzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIEFjY2Vzc29yIG1ldGhvZHMgZm9yIGRhdGEgZGVyaXZlZCBmcm9tIG90aGVyLCBzdGF0ZS1wcm92aWRlZCBnZXR0ZXJzLlxuXG4gIGFzeW5jIGdldEN1cnJlbnRCcmFuY2goKSB7XG4gICAgY29uc3QgYnJhbmNoZXMgPSBhd2FpdCB0aGlzLmdldEJyYW5jaGVzKCk7XG4gICAgY29uc3QgaGVhZCA9IGJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICBpZiAoaGVhZC5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGhlYWQ7XG4gICAgfVxuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBhd2FpdCB0aGlzLmdldEhlYWREZXNjcmlwdGlvbigpO1xuICAgIHJldHVybiBCcmFuY2guY3JlYXRlRGV0YWNoZWQoZGVzY3JpcHRpb24gfHwgJ25vIGJyYW5jaCcpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VW5zdGFnZWRDaGFuZ2VzKCkge1xuICAgIGNvbnN0IHt1bnN0YWdlZEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHVuc3RhZ2VkRmlsZXMpXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZpbGVQYXRoID0+IHsgcmV0dXJuIHtmaWxlUGF0aCwgc3RhdHVzOiB1bnN0YWdlZEZpbGVzW2ZpbGVQYXRoXX07IH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RhZ2VkQ2hhbmdlcygpIHtcbiAgICBjb25zdCB7c3RhZ2VkRmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3RhZ2VkRmlsZXMpXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZpbGVQYXRoID0+IHsgcmV0dXJuIHtmaWxlUGF0aCwgc3RhdHVzOiBzdGFnZWRGaWxlc1tmaWxlUGF0aF19OyB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldE1lcmdlQ29uZmxpY3RzKCkge1xuICAgIGNvbnN0IHttZXJnZUNvbmZsaWN0RmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobWVyZ2VDb25mbGljdEZpbGVzKS5tYXAoZmlsZVBhdGggPT4ge1xuICAgICAgcmV0dXJuIHtmaWxlUGF0aCwgc3RhdHVzOiBtZXJnZUNvbmZsaWN0RmlsZXNbZmlsZVBhdGhdfTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGlzUGFydGlhbGx5U3RhZ2VkKGZpbGVOYW1lKSB7XG4gICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXMsIHN0YWdlZEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgY29uc3QgdSA9IHVuc3RhZ2VkRmlsZXNbZmlsZU5hbWVdO1xuICAgIGNvbnN0IHMgPSBzdGFnZWRGaWxlc1tmaWxlTmFtZV07XG4gICAgcmV0dXJuICh1ID09PSAnbW9kaWZpZWQnICYmIHMgPT09ICdtb2RpZmllZCcpIHx8XG4gICAgICAodSA9PT0gJ21vZGlmaWVkJyAmJiBzID09PSAnYWRkZWQnKSB8fFxuICAgICAgKHUgPT09ICdhZGRlZCcgJiYgcyA9PT0gJ2RlbGV0ZWQnKSB8fFxuICAgICAgKHUgPT09ICdkZWxldGVkJyAmJiBzID09PSAnbW9kaWZpZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKSB7XG4gICAgY29uc3QgbmFtZSA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKGBicmFuY2guJHticmFuY2hOYW1lfS5yZW1vdGVgKTtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpKS53aXRoTmFtZShuYW1lKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVEaXNjYXJkSGlzdG9yeSgpIHtcbiAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaGlzdG9yeVNoYSA9IGF3YWl0IHRoaXMuY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iKCk7XG4gICAgaWYgKHRoaXMuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLnNldENvbmZpZygnYXRvbUdpdGh1Yi5oaXN0b3J5U2hhJywgaGlzdG9yeVNoYSk7XG4gIH1cblxuICBhc3luYyBnZXRDb21taXR0ZXIob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29tbWl0dGVyID0gYXdhaXQgeXViaWtpcmkoe1xuICAgICAgZW1haWw6IHRoaXMuZ2V0Q29uZmlnKCd1c2VyLmVtYWlsJywgb3B0aW9ucyksXG4gICAgICBuYW1lOiB0aGlzLmdldENvbmZpZygndXNlci5uYW1lJywgb3B0aW9ucyksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29tbWl0dGVyLm5hbWUgIT09IG51bGwgJiYgY29tbWl0dGVyLmVtYWlsICE9PSBudWxsXG4gICAgICA/IG5ldyBBdXRob3IoY29tbWl0dGVyLmVtYWlsLCBjb21taXR0ZXIubmFtZSlcbiAgICAgIDogbnVsbEF1dGhvcjtcbiAgfVxuXG4gIC8vIHRvZG8gKEBhbm50aHVyaXVtLCAzLzIwMTkpOiByZWZhY3RvciBHaXRIdWJUYWJDb250cm9sbGVyIGV0YyB0byB1c2UgdGhpcyBtZXRob2QuXG4gIGFzeW5jIGdldEN1cnJlbnRHaXRIdWJSZW1vdGUoKSB7XG4gICAgbGV0IGN1cnJlbnRSZW1vdGUgPSBudWxsO1xuXG4gICAgY29uc3QgcmVtb3RlcyA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlcygpO1xuXG4gICAgY29uc3QgZ2l0SHViUmVtb3RlcyA9IHJlbW90ZXMuZmlsdGVyKHJlbW90ZSA9PiByZW1vdGUuaXNHaXRodWJSZXBvKCkpO1xuICAgIGNvbnN0IHNlbGVjdGVkUmVtb3RlTmFtZSA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCdhdG9tR2l0aHViLmN1cnJlbnRSZW1vdGUnKTtcbiAgICBjdXJyZW50UmVtb3RlID0gZ2l0SHViUmVtb3Rlcy53aXRoTmFtZShzZWxlY3RlZFJlbW90ZU5hbWUpO1xuXG4gICAgaWYgKCFjdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpICYmIGdpdEh1YlJlbW90ZXMuc2l6ZSgpID09PSAxKSB7XG4gICAgICBjdXJyZW50UmVtb3RlID0gQXJyYXkuZnJvbShnaXRIdWJSZW1vdGVzKVswXTtcbiAgICB9XG4gICAgLy8gdG9kbzogaGFuZGxlIHRoZSBjYXNlIHdoZXJlIG11bHRpcGxlIHJlbW90ZXMgYXJlIGF2YWlsYWJsZSBhbmQgbm8gY2hvc2VuIHJlbW90ZSBpcyBzZXQuXG4gICAgcmV0dXJuIGN1cnJlbnRSZW1vdGU7XG4gIH1cblxuXG4gIGFzeW5jIGhhc0dpdEh1YlJlbW90ZShob3N0LCBvd25lciwgbmFtZSkge1xuICAgIGNvbnN0IHJlbW90ZXMgPSBhd2FpdCB0aGlzLmdldFJlbW90ZXMoKTtcbiAgICByZXR1cm4gcmVtb3Rlcy5tYXRjaGluZ0dpdEh1YlJlcG9zaXRvcnkob3duZXIsIG5hbWUpLmxlbmd0aCA+IDA7XG4gIH1cbn1cblxuLy8gVGhlIG1ldGhvZHMgbmFtZWQgaGVyZSB3aWxsIGJlIGRlbGVnYXRlZCB0byB0aGUgY3VycmVudCBTdGF0ZS5cbi8vXG4vLyBEdXBsaWNhdGVkIGhlcmUgcmF0aGVyIHRoYW4ganVzdCB1c2luZyBgZXhwZWN0ZWREZWxlZ2F0ZXNgIGRpcmVjdGx5IHNvIHRoYXQgdGhpcyBmaWxlIGlzIGdyZXAtZnJpZW5kbHkgZm9yIGFuc3dlcmluZ1xuLy8gdGhlIHF1ZXN0aW9uIG9mIFwid2hhdCBhbGwgY2FuIGEgUmVwb3NpdG9yeSBkbyBleGFjdGx5XCIuXG5jb25zdCBkZWxlZ2F0ZXMgPSBbXG4gICdpc0xvYWRpbmdHdWVzcycsXG4gICdpc0Fic2VudEd1ZXNzJyxcbiAgJ2lzQWJzZW50JyxcbiAgJ2lzTG9hZGluZycsXG4gICdpc0VtcHR5JyxcbiAgJ2lzUHJlc2VudCcsXG4gICdpc1Rvb0xhcmdlJyxcbiAgJ2lzRGVzdHJveWVkJyxcblxuICAnaXNVbmRldGVybWluZWQnLFxuICAnc2hvd0dpdFRhYkluaXQnLFxuICAnc2hvd0dpdFRhYkluaXRJblByb2dyZXNzJyxcbiAgJ3Nob3dHaXRUYWJMb2FkaW5nJyxcbiAgJ3Nob3dTdGF0dXNCYXJUaWxlcycsXG4gICdoYXNEaXJlY3RvcnknLFxuICAnaXNQdWJsaXNoYWJsZScsXG5cbiAgJ2luaXQnLFxuICAnY2xvbmUnLFxuICAnZGVzdHJveScsXG4gICdyZWZyZXNoJyxcbiAgJ29ic2VydmVGaWxlc3lzdGVtQ2hhbmdlJyxcbiAgJ3VwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UnLFxuXG4gICdzdGFnZUZpbGVzJyxcbiAgJ3Vuc3RhZ2VGaWxlcycsXG4gICdzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdCcsXG4gICdzdGFnZUZpbGVNb2RlQ2hhbmdlJyxcbiAgJ3N0YWdlRmlsZVN5bWxpbmtDaGFuZ2UnLFxuICAnYXBwbHlQYXRjaFRvSW5kZXgnLFxuICAnYXBwbHlQYXRjaFRvV29ya2RpcicsXG5cbiAgJ2NvbW1pdCcsXG5cbiAgJ21lcmdlJyxcbiAgJ2Fib3J0TWVyZ2UnLFxuICAnY2hlY2tvdXRTaWRlJyxcbiAgJ21lcmdlRmlsZScsXG4gICd3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4JyxcblxuICAnY2hlY2tvdXQnLFxuICAnY2hlY2tvdXRQYXRoc0F0UmV2aXNpb24nLFxuXG4gICd1bmRvTGFzdENvbW1pdCcsXG5cbiAgJ2ZldGNoJyxcbiAgJ3B1bGwnLFxuICAncHVzaCcsXG5cbiAgJ3NldENvbmZpZycsXG5cbiAgJ2NyZWF0ZUJsb2InLFxuICAnZXhwYW5kQmxvYlRvRmlsZScsXG5cbiAgJ2NyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYicsXG4gICd1cGRhdGVEaXNjYXJkSGlzdG9yeScsXG4gICdzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMnLFxuICAncmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMnLFxuICAncG9wRGlzY2FyZEhpc3RvcnknLFxuICAnY2xlYXJEaXNjYXJkSGlzdG9yeScsXG4gICdkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocycsXG5cbiAgJ2dldFN0YXR1c0J1bmRsZScsXG4gICdnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcycsXG4gICdnZXRGaWxlUGF0Y2hGb3JQYXRoJyxcbiAgJ2dldERpZmZzRm9yRmlsZVBhdGgnLFxuICAnZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoJyxcbiAgJ3JlYWRGaWxlRnJvbUluZGV4JyxcblxuICAnZ2V0TGFzdENvbW1pdCcsXG4gICdnZXRDb21taXQnLFxuICAnZ2V0UmVjZW50Q29tbWl0cycsXG4gICdpc0NvbW1pdFB1c2hlZCcsXG5cbiAgJ2dldEF1dGhvcnMnLFxuXG4gICdnZXRCcmFuY2hlcycsXG4gICdnZXRIZWFkRGVzY3JpcHRpb24nLFxuXG4gICdpc01lcmdpbmcnLFxuICAnaXNSZWJhc2luZycsXG5cbiAgJ2dldFJlbW90ZXMnLFxuICAnYWRkUmVtb3RlJyxcblxuICAnZ2V0QWhlYWRDb3VudCcsXG4gICdnZXRCZWhpbmRDb3VudCcsXG5cbiAgJ2dldENvbmZpZycsXG4gICd1bnNldENvbmZpZycsXG5cbiAgJ2dldEJsb2JDb250ZW50cycsXG5cbiAgJ2hhc0Rpc2NhcmRIaXN0b3J5JyxcbiAgJ2dldERpc2NhcmRIaXN0b3J5JyxcbiAgJ2dldExhc3RIaXN0b3J5U25hcHNob3RzJyxcblxuICAnZ2V0T3BlcmF0aW9uU3RhdGVzJyxcblxuICAnc2V0Q29tbWl0TWVzc2FnZScsXG4gICdnZXRDb21taXRNZXNzYWdlJyxcbiAgJ2ZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlJyxcbiAgJ2dldENhY2hlJyxcbiAgJ2FjY2VwdEludmFsaWRhdGlvbicsXG5dO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IGRlbGVnYXRlcy5sZW5ndGg7IGkrKykge1xuICBjb25zdCBkZWxlZ2F0ZSA9IGRlbGVnYXRlc1tpXTtcblxuICBSZXBvc2l0b3J5LnByb3RvdHlwZVtkZWxlZ2F0ZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVbZGVsZWdhdGVdKC4uLmFyZ3MpO1xuICB9O1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxRQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxTQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBSSxlQUFBLEdBQUFKLE9BQUE7QUFDQSxJQUFBSyxxQkFBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU0sT0FBQSxHQUFBQyx1QkFBQSxDQUFBUCxPQUFBO0FBQ0EsSUFBQVEsT0FBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVMsaUJBQUEsR0FBQVQsT0FBQTtBQUErRSxTQUFBVSx5QkFBQUMsV0FBQSxlQUFBQyxPQUFBLGtDQUFBQyxpQkFBQSxPQUFBRCxPQUFBLFFBQUFFLGdCQUFBLE9BQUFGLE9BQUEsWUFBQUYsd0JBQUEsWUFBQUEsQ0FBQUMsV0FBQSxXQUFBQSxXQUFBLEdBQUFHLGdCQUFBLEdBQUFELGlCQUFBLEtBQUFGLFdBQUE7QUFBQSxTQUFBSix3QkFBQVEsR0FBQSxFQUFBSixXQUFBLFNBQUFBLFdBQUEsSUFBQUksR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsV0FBQUQsR0FBQSxRQUFBQSxHQUFBLG9CQUFBQSxHQUFBLHdCQUFBQSxHQUFBLDRCQUFBRSxPQUFBLEVBQUFGLEdBQUEsVUFBQUcsS0FBQSxHQUFBUix3QkFBQSxDQUFBQyxXQUFBLE9BQUFPLEtBQUEsSUFBQUEsS0FBQSxDQUFBQyxHQUFBLENBQUFKLEdBQUEsWUFBQUcsS0FBQSxDQUFBRSxHQUFBLENBQUFMLEdBQUEsU0FBQU0sTUFBQSxXQUFBQyxxQkFBQSxHQUFBQyxNQUFBLENBQUFDLGNBQUEsSUFBQUQsTUFBQSxDQUFBRSx3QkFBQSxXQUFBQyxHQUFBLElBQUFYLEdBQUEsUUFBQVcsR0FBQSxrQkFBQUgsTUFBQSxDQUFBSSxTQUFBLENBQUFDLGNBQUEsQ0FBQUMsSUFBQSxDQUFBZCxHQUFBLEVBQUFXLEdBQUEsU0FBQUksSUFBQSxHQUFBUixxQkFBQSxHQUFBQyxNQUFBLENBQUFFLHdCQUFBLENBQUFWLEdBQUEsRUFBQVcsR0FBQSxjQUFBSSxJQUFBLEtBQUFBLElBQUEsQ0FBQVYsR0FBQSxJQUFBVSxJQUFBLENBQUFDLEdBQUEsS0FBQVIsTUFBQSxDQUFBQyxjQUFBLENBQUFILE1BQUEsRUFBQUssR0FBQSxFQUFBSSxJQUFBLFlBQUFULE1BQUEsQ0FBQUssR0FBQSxJQUFBWCxHQUFBLENBQUFXLEdBQUEsU0FBQUwsTUFBQSxDQUFBSixPQUFBLEdBQUFGLEdBQUEsTUFBQUcsS0FBQSxJQUFBQSxLQUFBLENBQUFhLEdBQUEsQ0FBQWhCLEdBQUEsRUFBQU0sTUFBQSxZQUFBQSxNQUFBO0FBQUEsU0FBQXRCLHVCQUFBZ0IsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFpQixRQUFBQyxNQUFBLEVBQUFDLGNBQUEsUUFBQUMsSUFBQSxHQUFBWixNQUFBLENBQUFZLElBQUEsQ0FBQUYsTUFBQSxPQUFBVixNQUFBLENBQUFhLHFCQUFBLFFBQUFDLE9BQUEsR0FBQWQsTUFBQSxDQUFBYSxxQkFBQSxDQUFBSCxNQUFBLEdBQUFDLGNBQUEsS0FBQUcsT0FBQSxHQUFBQSxPQUFBLENBQUFDLE1BQUEsV0FBQUMsR0FBQSxXQUFBaEIsTUFBQSxDQUFBRSx3QkFBQSxDQUFBUSxNQUFBLEVBQUFNLEdBQUEsRUFBQUMsVUFBQSxPQUFBTCxJQUFBLENBQUFNLElBQUEsQ0FBQUMsS0FBQSxDQUFBUCxJQUFBLEVBQUFFLE9BQUEsWUFBQUYsSUFBQTtBQUFBLFNBQUFRLGNBQUFDLE1BQUEsYUFBQUMsQ0FBQSxNQUFBQSxDQUFBLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxFQUFBRixDQUFBLFVBQUFHLE1BQUEsV0FBQUYsU0FBQSxDQUFBRCxDQUFBLElBQUFDLFNBQUEsQ0FBQUQsQ0FBQSxRQUFBQSxDQUFBLE9BQUFiLE9BQUEsQ0FBQVQsTUFBQSxDQUFBeUIsTUFBQSxPQUFBQyxPQUFBLFdBQUF2QixHQUFBLElBQUF3QixlQUFBLENBQUFOLE1BQUEsRUFBQWxCLEdBQUEsRUFBQXNCLE1BQUEsQ0FBQXRCLEdBQUEsU0FBQUgsTUFBQSxDQUFBNEIseUJBQUEsR0FBQTVCLE1BQUEsQ0FBQTZCLGdCQUFBLENBQUFSLE1BQUEsRUFBQXJCLE1BQUEsQ0FBQTRCLHlCQUFBLENBQUFILE1BQUEsS0FBQWhCLE9BQUEsQ0FBQVQsTUFBQSxDQUFBeUIsTUFBQSxHQUFBQyxPQUFBLFdBQUF2QixHQUFBLElBQUFILE1BQUEsQ0FBQUMsY0FBQSxDQUFBb0IsTUFBQSxFQUFBbEIsR0FBQSxFQUFBSCxNQUFBLENBQUFFLHdCQUFBLENBQUF1QixNQUFBLEVBQUF0QixHQUFBLGlCQUFBa0IsTUFBQTtBQUFBLFNBQUFNLGdCQUFBbkMsR0FBQSxFQUFBVyxHQUFBLEVBQUEyQixLQUFBLElBQUEzQixHQUFBLEdBQUE0QixjQUFBLENBQUE1QixHQUFBLE9BQUFBLEdBQUEsSUFBQVgsR0FBQSxJQUFBUSxNQUFBLENBQUFDLGNBQUEsQ0FBQVQsR0FBQSxFQUFBVyxHQUFBLElBQUEyQixLQUFBLEVBQUFBLEtBQUEsRUFBQWIsVUFBQSxRQUFBZSxZQUFBLFFBQUFDLFFBQUEsb0JBQUF6QyxHQUFBLENBQUFXLEdBQUEsSUFBQTJCLEtBQUEsV0FBQXRDLEdBQUE7QUFBQSxTQUFBdUMsZUFBQUcsR0FBQSxRQUFBL0IsR0FBQSxHQUFBZ0MsWUFBQSxDQUFBRCxHQUFBLDJCQUFBL0IsR0FBQSxnQkFBQUEsR0FBQSxHQUFBaUMsTUFBQSxDQUFBakMsR0FBQTtBQUFBLFNBQUFnQyxhQUFBRSxLQUFBLEVBQUFDLElBQUEsZUFBQUQsS0FBQSxpQkFBQUEsS0FBQSxrQkFBQUEsS0FBQSxNQUFBRSxJQUFBLEdBQUFGLEtBQUEsQ0FBQUcsTUFBQSxDQUFBQyxXQUFBLE9BQUFGLElBQUEsS0FBQUcsU0FBQSxRQUFBQyxHQUFBLEdBQUFKLElBQUEsQ0FBQWpDLElBQUEsQ0FBQStCLEtBQUEsRUFBQUMsSUFBQSwyQkFBQUssR0FBQSxzQkFBQUEsR0FBQSxZQUFBQyxTQUFBLDREQUFBTixJQUFBLGdCQUFBRixNQUFBLEdBQUFTLE1BQUEsRUFBQVIsS0FBQTtBQUUvRSxNQUFNUyxrQkFBa0IsR0FBRyxpQkFBaUI7O0FBRTVDO0FBQ0EsTUFBTUMsZUFBZSxHQUFHUCxNQUFNLENBQUMsY0FBYyxDQUFDO0FBRS9CLE1BQU1RLFVBQVUsQ0FBQztFQUM5QkMsV0FBV0EsQ0FBQ0Msb0JBQW9CLEVBQUVDLFdBQVcsR0FBRyxJQUFJLEVBQUVDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNsRSxJQUFJLENBQUNGLG9CQUFvQixHQUFHQSxvQkFBb0I7SUFDaEQsSUFBSSxDQUFDRyxHQUFHLEdBQUdGLFdBQVcsSUFBSUcsNkJBQW9CLENBQUNDLE1BQU0sQ0FBQ0wsb0JBQW9CLENBQUM7SUFFM0UsSUFBSSxDQUFDTSxPQUFPLEdBQUcsSUFBSUMsaUJBQU8sRUFBRTtJQUU1QixJQUFJLENBQUNDLFdBQVcsR0FBRyxJQUFJQyxPQUFPLENBQUNDLE9BQU8sSUFBSTtNQUN4QyxNQUFNQyxHQUFHLEdBQUcsSUFBSSxDQUFDQyxnQkFBZ0IsQ0FBQyxNQUFNO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUNDLFNBQVMsRUFBRSxFQUFFO1VBQ3JCSCxPQUFPLEVBQUU7VUFDVEMsR0FBRyxDQUFDRyxPQUFPLEVBQUU7UUFDZixDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUNDLFdBQVcsRUFBRSxFQUFFO1VBQzdCSixHQUFHLENBQUNHLE9BQU8sRUFBRTtRQUNmO01BQ0YsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsSUFBSSxDQUFDRSxlQUFlLEdBQUdkLE9BQU8sQ0FBQ2MsZUFBZSxJQUFJLElBQUFDLDRDQUE0QixHQUFFO0lBQ2hGLElBQUksQ0FBQ0MsWUFBWSxDQUFDaEIsT0FBTyxDQUFDTCxlQUFlLENBQUMsSUFBSXNCLHlCQUFPLENBQUM7RUFDeEQ7RUFFQSxPQUFPQyxNQUFNQSxDQUFDbEIsT0FBTyxFQUFFO0lBQ3JCLE9BQU8sSUFBSUosVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUE1QixhQUFBO01BQUcsQ0FBQzJCLGVBQWUsR0FBR3dCO0lBQU0sR0FBS25CLE9BQU8sRUFBRTtFQUM1RTtFQUVBLE9BQU9vQixZQUFZQSxDQUFDcEIsT0FBTyxFQUFFO0lBQzNCLE9BQU8sSUFBSUosVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUE1QixhQUFBO01BQUcsQ0FBQzJCLGVBQWUsR0FBRzBCO0lBQVksR0FBS3JCLE9BQU8sRUFBRTtFQUNsRjtFQUVBLE9BQU9zQixXQUFXQSxDQUFDdEIsT0FBTyxFQUFFO0lBQzFCLE9BQU8sSUFBSUosVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUE1QixhQUFBO01BQUcsQ0FBQzJCLGVBQWUsR0FBRzRCO0lBQVcsR0FBS3ZCLE9BQU8sRUFBRTtFQUNqRjs7RUFFQTs7RUFFQXdCLFVBQVVBLENBQUNDLFlBQVksRUFBRUMsZ0JBQWdCLEVBQUUsR0FBR0MsT0FBTyxFQUFFO0lBQ3JELElBQUlGLFlBQVksS0FBSyxJQUFJLENBQUNHLEtBQUssRUFBRTtNQUMvQjtNQUNBLE9BQU9yQixPQUFPLENBQUNDLE9BQU8sRUFBRTtJQUMxQjtJQUVBLE1BQU1xQixTQUFTLEdBQUcsSUFBSUgsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUdDLE9BQU8sQ0FBQztJQUN4RCxJQUFJLENBQUNDLEtBQUssR0FBR0MsU0FBUztJQUV0QixJQUFJLENBQUN6QixPQUFPLENBQUMwQixJQUFJLENBQUMsa0JBQWtCLEVBQUU7TUFBQ0MsSUFBSSxFQUFFTixZQUFZO01BQUVPLEVBQUUsRUFBRSxJQUFJLENBQUNKO0lBQUssQ0FBQyxDQUFDO0lBQzNFLElBQUksQ0FBQyxJQUFJLENBQUNmLFdBQVcsRUFBRSxFQUFFO01BQ3ZCLElBQUksQ0FBQ1QsT0FBTyxDQUFDMEIsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUNqQztJQUVBLE9BQU8sSUFBSSxDQUFDRixLQUFLLENBQUNLLEtBQUssRUFBRTtFQUMzQjtFQUVBakIsWUFBWUEsQ0FBQ1UsZ0JBQWdCLEVBQUUsR0FBR0MsT0FBTyxFQUFFO0lBQ3pDLE9BQU8sSUFBSSxDQUFDSCxVQUFVLENBQUMsSUFBSSxDQUFDSSxLQUFLLEVBQUVGLGdCQUFnQixFQUFFLEdBQUdDLE9BQU8sQ0FBQztFQUNsRTtFQUVBTyxjQUFjQSxDQUFBLEVBQUc7SUFDZixPQUFPLElBQUksQ0FBQ0MsUUFBUSxFQUFFLEdBQUc1QixPQUFPLENBQUM2QixNQUFNLENBQUMsSUFBSUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMvQixXQUFXO0VBQy9HOztFQUVBO0FBQ0Y7QUFDQTtFQUNFZ0MsaUJBQWlCQSxDQUFDQyxRQUFRLEVBQUU7SUFDMUIsSUFBSSxDQUFDdEMsR0FBRyxDQUFDdUMsZUFBZSxFQUFFLENBQUNsRSxPQUFPLENBQUNtRSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0gsaUJBQWlCLENBQUNDLFFBQVEsQ0FBQyxDQUFDO0VBQ3RGOztFQUVBO0VBQ0FHLFdBQVdBLENBQUNDLFVBQVUsRUFBRTtJQUN0QixNQUFNQyxTQUFTLEdBQUcsSUFBSSxDQUFDOUIsZUFBZSxDQUFDK0IsVUFBVSxDQUFDRixVQUFVLENBQUM7SUFDN0QsT0FBTyxJQUFJLENBQUM3QixlQUFlLENBQUM0QixXQUFXLENBQUNFLFNBQVMsQ0FBQztFQUNwRDtFQUVBRSxxQkFBcUJBLENBQUNILFVBQVUsRUFBRUksRUFBRSxFQUFFLEdBQUdDLElBQUksRUFBRTtJQUM3QyxNQUFNQyxRQUFRLEdBQUcsSUFBSSxDQUFDUCxXQUFXLENBQUNDLFVBQVUsQ0FBQztJQUM3QyxPQUFPTSxRQUFRLENBQUNDLEdBQUcsQ0FBQ0gsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHQyxJQUFJLENBQUM7RUFDeEM7O0VBRUE7O0VBRUFHLFlBQVlBLENBQUNaLFFBQVEsRUFBRTtJQUNyQixPQUFPLElBQUksQ0FBQ25DLE9BQU8sQ0FBQ2dELEVBQUUsQ0FBQyxhQUFhLEVBQUViLFFBQVEsQ0FBQztFQUNqRDtFQUVBN0IsZ0JBQWdCQSxDQUFDNkIsUUFBUSxFQUFFO0lBQ3pCLE9BQU8sSUFBSSxDQUFDbkMsT0FBTyxDQUFDZ0QsRUFBRSxDQUFDLGtCQUFrQixFQUFFYixRQUFRLENBQUM7RUFDdEQ7RUFFQWMsV0FBV0EsQ0FBQ2QsUUFBUSxFQUFFO0lBQ3BCLE9BQU8sSUFBSSxDQUFDbkMsT0FBTyxDQUFDZ0QsRUFBRSxDQUFDLFlBQVksRUFBRWIsUUFBUSxDQUFDO0VBQ2hEO0VBRUFlLHVCQUF1QkEsQ0FBQ2YsUUFBUSxFQUFFO0lBQ2hDLE9BQU8sSUFBSSxDQUFDbkMsT0FBTyxDQUFDZ0QsRUFBRSxDQUFDLHlCQUF5QixFQUFFYixRQUFRLENBQUM7RUFDN0Q7RUFFQWdCLFdBQVdBLENBQUNoQixRQUFRLEVBQUU7SUFDcEIsT0FBTyxJQUFJLENBQUNuQyxPQUFPLENBQUNnRCxFQUFFLENBQUMsWUFBWSxFQUFFYixRQUFRLENBQUM7RUFDaEQ7RUFFQWlCLFlBQVlBLENBQUEsRUFBRztJQUNiLE9BQU8sSUFBSSxDQUFDcEQsT0FBTyxDQUFDMEIsSUFBSSxDQUFDLFlBQVksQ0FBQztFQUN4Qzs7RUFFQTtFQUNBOztFQUVBLE1BQU0yQixtQkFBbUJBLENBQUNDLFlBQVksRUFBRTtJQUN0QyxJQUFJO01BQ0YsTUFBTUMsUUFBUSxHQUFHLE1BQU1DLGdCQUFFLENBQUNDLFFBQVEsQ0FBQ0MsYUFBSSxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDQyx1QkFBdUIsRUFBRSxFQUFFTixZQUFZLENBQUMsRUFBRTtRQUFDTyxRQUFRLEVBQUU7TUFBTSxDQUFDLENBQUM7TUFDL0csT0FBT3ZFLGtCQUFrQixDQUFDd0UsSUFBSSxDQUFDUCxRQUFRLENBQUM7SUFDMUMsQ0FBQyxDQUFDLE9BQU9RLENBQUMsRUFBRTtNQUNWO01BQ0EsSUFBSUEsQ0FBQyxDQUFDQyxJQUFJLEtBQUssUUFBUSxJQUFJRCxDQUFDLENBQUNDLElBQUksS0FBSyxRQUFRLEVBQUU7UUFBRSxPQUFPLEtBQUs7TUFBRSxDQUFDLE1BQU07UUFBRSxNQUFNRCxDQUFDO01BQUU7SUFDcEY7RUFDRjtFQUVBLE1BQU1FLGVBQWVBLENBQUEsRUFBRztJQUN0QixJQUFJO01BQ0YsTUFBTVYsUUFBUSxHQUFHLE1BQU1DLGdCQUFFLENBQUNDLFFBQVEsQ0FBQ0MsYUFBSSxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDTyxtQkFBbUIsRUFBRSxFQUFFLFdBQVcsQ0FBQyxFQUFFO1FBQUNMLFFBQVEsRUFBRTtNQUFNLENBQUMsQ0FBQztNQUMxRyxPQUFPTixRQUFRLENBQUNZLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzVHLE1BQU0sQ0FBQzZHLElBQUksSUFBSUEsSUFBSSxDQUFDcEcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDb0csSUFBSSxDQUFDQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqRyxDQUFDLENBQUMsT0FBT0ksQ0FBQyxFQUFFO01BQ1YsT0FBTyxJQUFJO0lBQ2I7RUFDRjs7RUFFQTs7RUFFQUgsdUJBQXVCQSxDQUFBLEVBQUc7SUFDeEIsT0FBTyxJQUFJLENBQUNsRSxvQkFBb0I7RUFDbEM7RUFFQTRFLG1CQUFtQkEsQ0FBQ0MsZ0JBQWdCLEVBQUU7SUFDcEMsSUFBSSxDQUFDQyxpQkFBaUIsR0FBR0QsZ0JBQWdCO0VBQzNDO0VBRUFMLG1CQUFtQkEsQ0FBQSxFQUFHO0lBQ3BCLElBQUksSUFBSSxDQUFDTSxpQkFBaUIsRUFBRTtNQUMxQixPQUFPLElBQUksQ0FBQ0EsaUJBQWlCO0lBQy9CLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQ1osdUJBQXVCLEVBQUUsRUFBRTtNQUN6QyxPQUFPRixhQUFJLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUNDLHVCQUF1QixFQUFFLEVBQUUsTUFBTSxDQUFDO0lBQzFELENBQUMsTUFBTTtNQUNMO01BQ0EsT0FBTyxJQUFJO0lBQ2I7RUFDRjtFQUVBYSxTQUFTQSxDQUFDQyxTQUFTLEVBQUU7SUFDbkIsT0FBTyxJQUFJLENBQUNsRCxLQUFLLENBQUMvQixXQUFXLENBQUNrRixJQUFJLEtBQUtELFNBQVM7RUFDbEQ7RUFFQUUsUUFBUUEsQ0FBQSxFQUFHO0lBQ1QsT0FBUSxvQkFBbUIsSUFBSSxDQUFDcEQsS0FBSyxDQUFDL0IsV0FBVyxDQUFDa0YsSUFBSyxjQUFhLElBQUksQ0FBQ2YsdUJBQXVCLEVBQUcsSUFBRztFQUN4Rzs7RUFFQTtFQUNBOztFQUVBLE1BQU1pQixnQkFBZ0JBLENBQUEsRUFBRztJQUN2QixNQUFNQyxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUNDLFdBQVcsRUFBRTtJQUN6QyxNQUFNQyxJQUFJLEdBQUdGLFFBQVEsQ0FBQ0csYUFBYSxFQUFFO0lBQ3JDLElBQUlELElBQUksQ0FBQ0UsU0FBUyxFQUFFLEVBQUU7TUFDcEIsT0FBT0YsSUFBSTtJQUNiO0lBRUEsTUFBTUcsV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDQyxrQkFBa0IsRUFBRTtJQUNuRCxPQUFPQyxlQUFNLENBQUNDLGNBQWMsQ0FBQ0gsV0FBVyxJQUFJLFdBQVcsQ0FBQztFQUMxRDtFQUVBLE1BQU1JLGtCQUFrQkEsQ0FBQSxFQUFHO0lBQ3pCLE1BQU07TUFBQ0M7SUFBYSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUNDLGVBQWUsRUFBRTtJQUNwRCxPQUFPakosTUFBTSxDQUFDWSxJQUFJLENBQUNvSSxhQUFhLENBQUMsQ0FDOUJFLElBQUksRUFBRSxDQUNOQyxHQUFHLENBQUNDLFFBQVEsSUFBSTtNQUFFLE9BQU87UUFBQ0EsUUFBUTtRQUFFQyxNQUFNLEVBQUVMLGFBQWEsQ0FBQ0ksUUFBUTtNQUFDLENBQUM7SUFBRSxDQUFDLENBQUM7RUFDN0U7RUFFQSxNQUFNRSxnQkFBZ0JBLENBQUEsRUFBRztJQUN2QixNQUFNO01BQUNDO0lBQVcsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDTixlQUFlLEVBQUU7SUFDbEQsT0FBT2pKLE1BQU0sQ0FBQ1ksSUFBSSxDQUFDMkksV0FBVyxDQUFDLENBQzVCTCxJQUFJLEVBQUUsQ0FDTkMsR0FBRyxDQUFDQyxRQUFRLElBQUk7TUFBRSxPQUFPO1FBQUNBLFFBQVE7UUFBRUMsTUFBTSxFQUFFRSxXQUFXLENBQUNILFFBQVE7TUFBQyxDQUFDO0lBQUUsQ0FBQyxDQUFDO0VBQzNFO0VBRUEsTUFBTUksaUJBQWlCQSxDQUFBLEVBQUc7SUFDeEIsTUFBTTtNQUFDQztJQUFrQixDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUNSLGVBQWUsRUFBRTtJQUN6RCxPQUFPakosTUFBTSxDQUFDWSxJQUFJLENBQUM2SSxrQkFBa0IsQ0FBQyxDQUFDTixHQUFHLENBQUNDLFFBQVEsSUFBSTtNQUNyRCxPQUFPO1FBQUNBLFFBQVE7UUFBRUMsTUFBTSxFQUFFSSxrQkFBa0IsQ0FBQ0wsUUFBUTtNQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDO0VBQ0o7RUFFQSxNQUFNTSxpQkFBaUJBLENBQUNDLFFBQVEsRUFBRTtJQUNoQyxNQUFNO01BQUNYLGFBQWE7TUFBRU87SUFBVyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUNOLGVBQWUsRUFBRTtJQUNqRSxNQUFNVyxDQUFDLEdBQUdaLGFBQWEsQ0FBQ1csUUFBUSxDQUFDO0lBQ2pDLE1BQU1FLENBQUMsR0FBR04sV0FBVyxDQUFDSSxRQUFRLENBQUM7SUFDL0IsT0FBUUMsQ0FBQyxLQUFLLFVBQVUsSUFBSUMsQ0FBQyxLQUFLLFVBQVUsSUFDekNELENBQUMsS0FBSyxVQUFVLElBQUlDLENBQUMsS0FBSyxPQUFRLElBQ2xDRCxDQUFDLEtBQUssT0FBTyxJQUFJQyxDQUFDLEtBQUssU0FBVSxJQUNqQ0QsQ0FBQyxLQUFLLFNBQVMsSUFBSUMsQ0FBQyxLQUFLLFVBQVc7RUFDekM7RUFFQSxNQUFNQyxrQkFBa0JBLENBQUNDLFVBQVUsRUFBRTtJQUNuQyxNQUFNNUIsSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDNkIsU0FBUyxDQUFFLFVBQVNELFVBQVcsU0FBUSxDQUFDO0lBQ2hFLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQ0UsVUFBVSxFQUFFLEVBQUVDLFFBQVEsQ0FBQy9CLElBQUksQ0FBQztFQUNqRDtFQUVBLE1BQU1nQyxrQkFBa0JBLENBQUEsRUFBRztJQUN6QixJQUFJLElBQUksQ0FBQ2xHLFdBQVcsRUFBRSxFQUFFO01BQ3RCO0lBQ0Y7SUFFQSxNQUFNbUcsVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDQyx3QkFBd0IsRUFBRTtJQUN4RCxJQUFJLElBQUksQ0FBQ3BHLFdBQVcsRUFBRSxFQUFFO01BQ3RCO0lBQ0Y7SUFDQSxNQUFNLElBQUksQ0FBQ3FHLFNBQVMsQ0FBQyx1QkFBdUIsRUFBRUYsVUFBVSxDQUFDO0VBQzNEO0VBRUEsTUFBTUcsWUFBWUEsQ0FBQ25ILE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUMvQixNQUFNb0gsU0FBUyxHQUFHLE1BQU0sSUFBQUMsaUJBQVEsRUFBQztNQUMvQkMsS0FBSyxFQUFFLElBQUksQ0FBQ1YsU0FBUyxDQUFDLFlBQVksRUFBRTVHLE9BQU8sQ0FBQztNQUM1QytFLElBQUksRUFBRSxJQUFJLENBQUM2QixTQUFTLENBQUMsV0FBVyxFQUFFNUcsT0FBTztJQUMzQyxDQUFDLENBQUM7SUFFRixPQUFPb0gsU0FBUyxDQUFDckMsSUFBSSxLQUFLLElBQUksSUFBSXFDLFNBQVMsQ0FBQ0UsS0FBSyxLQUFLLElBQUksR0FDdEQsSUFBSUMsZUFBTSxDQUFDSCxTQUFTLENBQUNFLEtBQUssRUFBRUYsU0FBUyxDQUFDckMsSUFBSSxDQUFDLEdBQzNDeUMsa0JBQVU7RUFDaEI7O0VBRUE7RUFDQSxNQUFNQyxzQkFBc0JBLENBQUEsRUFBRztJQUM3QixJQUFJQyxhQUFhLEdBQUcsSUFBSTtJQUV4QixNQUFNQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUNkLFVBQVUsRUFBRTtJQUV2QyxNQUFNZSxhQUFhLEdBQUdELE9BQU8sQ0FBQ2hLLE1BQU0sQ0FBQ2tLLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxZQUFZLEVBQUUsQ0FBQztJQUNyRSxNQUFNQyxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQ25CLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQztJQUMzRWMsYUFBYSxHQUFHRSxhQUFhLENBQUNkLFFBQVEsQ0FBQ2lCLGtCQUFrQixDQUFDO0lBRTFELElBQUksQ0FBQ0wsYUFBYSxDQUFDcEMsU0FBUyxFQUFFLElBQUlzQyxhQUFhLENBQUNJLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtNQUM1RE4sYUFBYSxHQUFHTyxLQUFLLENBQUNsRyxJQUFJLENBQUM2RixhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUM7SUFDQTtJQUNBLE9BQU9GLGFBQWE7RUFDdEI7RUFHQSxNQUFNUSxlQUFlQSxDQUFDQyxJQUFJLEVBQUVDLEtBQUssRUFBRXJELElBQUksRUFBRTtJQUN2QyxNQUFNNEMsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDZCxVQUFVLEVBQUU7SUFDdkMsT0FBT2MsT0FBTyxDQUFDVSx3QkFBd0IsQ0FBQ0QsS0FBSyxFQUFFckQsSUFBSSxDQUFDLENBQUMzRyxNQUFNLEdBQUcsQ0FBQztFQUNqRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUFrSyxPQUFBLENBQUFoTSxPQUFBLEdBQUFzRCxVQUFBO0FBQ0EsTUFBTTJJLFNBQVMsR0FBRyxDQUNoQixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLFVBQVUsRUFDVixXQUFXLEVBQ1gsU0FBUyxFQUNULFdBQVcsRUFDWCxZQUFZLEVBQ1osYUFBYSxFQUViLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsMEJBQTBCLEVBQzFCLG1CQUFtQixFQUNuQixvQkFBb0IsRUFDcEIsY0FBYyxFQUNkLGVBQWUsRUFFZixNQUFNLEVBQ04sT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QseUJBQXlCLEVBQ3pCLDBDQUEwQyxFQUUxQyxZQUFZLEVBQ1osY0FBYyxFQUNkLDRCQUE0QixFQUM1QixxQkFBcUIsRUFDckIsd0JBQXdCLEVBQ3hCLG1CQUFtQixFQUNuQixxQkFBcUIsRUFFckIsUUFBUSxFQUVSLE9BQU8sRUFDUCxZQUFZLEVBQ1osY0FBYyxFQUNkLFdBQVcsRUFDWCwyQkFBMkIsRUFFM0IsVUFBVSxFQUNWLHlCQUF5QixFQUV6QixnQkFBZ0IsRUFFaEIsT0FBTyxFQUNQLE1BQU0sRUFDTixNQUFNLEVBRU4sV0FBVyxFQUVYLFlBQVksRUFDWixrQkFBa0IsRUFFbEIsMEJBQTBCLEVBQzFCLHNCQUFzQixFQUN0QiwwQkFBMEIsRUFDMUIsK0JBQStCLEVBQy9CLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsK0JBQStCLEVBRS9CLGlCQUFpQixFQUNqQiw0QkFBNEIsRUFDNUIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIsbUJBQW1CLEVBRW5CLGVBQWUsRUFDZixXQUFXLEVBQ1gsa0JBQWtCLEVBQ2xCLGdCQUFnQixFQUVoQixZQUFZLEVBRVosYUFBYSxFQUNiLG9CQUFvQixFQUVwQixXQUFXLEVBQ1gsWUFBWSxFQUVaLFlBQVksRUFDWixXQUFXLEVBRVgsZUFBZSxFQUNmLGdCQUFnQixFQUVoQixXQUFXLEVBQ1gsYUFBYSxFQUViLGlCQUFpQixFQUVqQixtQkFBbUIsRUFDbkIsbUJBQW1CLEVBQ25CLHlCQUF5QixFQUV6QixvQkFBb0IsRUFFcEIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQiw0QkFBNEIsRUFDNUIsVUFBVSxFQUNWLG9CQUFvQixDQUNyQjtBQUVELEtBQUssSUFBSXJLLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3FLLFNBQVMsQ0FBQ25LLE1BQU0sRUFBRUYsQ0FBQyxFQUFFLEVBQUU7RUFDekMsTUFBTXNLLFFBQVEsR0FBR0QsU0FBUyxDQUFDckssQ0FBQyxDQUFDO0VBRTdCMEIsVUFBVSxDQUFDNUMsU0FBUyxDQUFDd0wsUUFBUSxDQUFDLEdBQUcsVUFBUyxHQUFHeEYsSUFBSSxFQUFFO0lBQ2pELE9BQU8sSUFBSSxDQUFDcEIsS0FBSyxDQUFDNEcsUUFBUSxDQUFDLENBQUMsR0FBR3hGLElBQUksQ0FBQztFQUN0QyxDQUFDO0FBQ0gifQ==