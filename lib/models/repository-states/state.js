"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _commit = require("../commit");
var _branchSet = _interopRequireDefault(require("../branch-set"));
var _remoteSet = _interopRequireDefault(require("../remote-set"));
var _operationStates = require("../operation-states");
var _multiFilePatch = _interopRequireDefault(require("../patch/multi-file-patch"));
var _compositeGitStrategy = _interopRequireDefault(require("../../composite-git-strategy"));
var _keys = require("./cache/keys");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Map of registered subclasses to allow states to transition to one another without circular dependencies.
 * Subclasses of State should call `State.register` to add themselves here.
 */
const stateConstructors = new Map();

/**
 * Base class for Repository states. Implements default "null" behavior.
 */
class State {
  constructor(repository) {
    this.repository = repository;
  }
  static register(Subclass) {
    stateConstructors.set(Subclass.name, Subclass);
  }

  // This state has just been entered. Perform any asynchronous initialization that needs to occur.
  start() {
    return Promise.resolve();
  }

  // State probe predicates ////////////////////////////////////////////////////////////////////////////////////////////
  // Allow external callers to identify which state a Repository is in if necessary.

  isLoadingGuess() {
    return false;
  }
  isAbsentGuess() {
    return false;
  }
  isAbsent() {
    return false;
  }
  isLoading() {
    return false;
  }
  isEmpty() {
    return false;
  }
  isPresent() {
    return false;
  }
  isTooLarge() {
    return false;
  }
  isDestroyed() {
    return false;
  }

  // Behavior probe predicates /////////////////////////////////////////////////////////////////////////////////////////
  // Determine specific rendering behavior based on the current state.

  isUndetermined() {
    return false;
  }
  showGitTabInit() {
    return false;
  }
  showGitTabInitInProgress() {
    return false;
  }
  showGitTabLoading() {
    return false;
  }
  showStatusBarTiles() {
    return false;
  }
  hasDirectory() {
    return true;
  }
  isPublishable() {
    return false;
  }

  // Lifecycle actions /////////////////////////////////////////////////////////////////////////////////////////////////
  // These generally default to rejecting a Promise with an error.

  init() {
    return unsupportedOperationPromise(this, 'init');
  }
  clone(remoteUrl) {
    return unsupportedOperationPromise(this, 'clone');
  }
  destroy() {
    return this.transitionTo('Destroyed');
  }

  /* istanbul ignore next */
  refresh() {
    // No-op
  }

  /* istanbul ignore next */
  observeFilesystemChange(events) {
    this.repository.refresh();
  }

  /* istanbul ignore next */
  updateCommitMessageAfterFileSystemChange() {
    // this is only used in unit tests, we don't need no stinkin coverage
    this.repository.refresh();
  }

  // Git operations ////////////////////////////////////////////////////////////////////////////////////////////////////
  // These default to rejecting a Promise with an error stating that the operation is not supported in the current
  // state.

  // Staging and unstaging

  stageFiles(paths) {
    return unsupportedOperationPromise(this, 'stageFiles');
  }
  unstageFiles(paths) {
    return unsupportedOperationPromise(this, 'unstageFiles');
  }
  stageFilesFromParentCommit(paths) {
    return unsupportedOperationPromise(this, 'stageFilesFromParentCommit');
  }
  applyPatchToIndex(patch) {
    return unsupportedOperationPromise(this, 'applyPatchToIndex');
  }
  applyPatchToWorkdir(patch) {
    return unsupportedOperationPromise(this, 'applyPatchToWorkdir');
  }

  // Committing

  commit(message, options) {
    return unsupportedOperationPromise(this, 'commit');
  }

  // Merging

  merge(branchName) {
    return unsupportedOperationPromise(this, 'merge');
  }
  abortMerge() {
    return unsupportedOperationPromise(this, 'abortMerge');
  }
  checkoutSide(side, paths) {
    return unsupportedOperationPromise(this, 'checkoutSide');
  }
  mergeFile(oursPath, commonBasePath, theirsPath, resultPath) {
    return unsupportedOperationPromise(this, 'mergeFile');
  }
  writeMergeConflictToIndex(filePath, commonBaseSha, oursSha, theirsSha) {
    return unsupportedOperationPromise(this, 'writeMergeConflictToIndex');
  }

  // Checkout

  checkout(revision, options = {}) {
    return unsupportedOperationPromise(this, 'checkout');
  }
  checkoutPathsAtRevision(paths, revision = 'HEAD') {
    return unsupportedOperationPromise(this, 'checkoutPathsAtRevision');
  }

  // Reset

  undoLastCommit() {
    return unsupportedOperationPromise(this, 'undoLastCommit');
  }

  // Remote interactions

  fetch(branchName) {
    return unsupportedOperationPromise(this, 'fetch');
  }
  pull(branchName) {
    return unsupportedOperationPromise(this, 'pull');
  }
  push(branchName) {
    return unsupportedOperationPromise(this, 'push');
  }

  // Configuration

  async setConfig(optionName, value, options = {}) {
    await this.workdirlessGit().setConfig(optionName, value, options);
    this.didUpdate();
    if (options.global) {
      this.didGloballyInvalidate(() => _keys.Keys.config.eachWithSetting(optionName));
    }
  }
  unsetConfig(option) {
    return unsupportedOperationPromise(this, 'unsetConfig');
  }

  // Direct blob interactions

  createBlob({
    filePath,
    stdin
  } = {}) {
    return unsupportedOperationPromise(this, 'createBlob');
  }
  expandBlobToFile(absFilePath, sha) {
    return unsupportedOperationPromise(this, 'expandBlobToFile');
  }

  // Discard history

  createDiscardHistoryBlob() {
    return unsupportedOperationPromise(this, 'createDiscardHistoryBlob');
  }
  updateDiscardHistory() {
    return unsupportedOperationPromise(this, 'updateDiscardHistory');
  }
  storeBeforeAndAfterBlobs(filePaths, isSafe, destructiveAction, partialDiscardFilePath = null) {
    return unsupportedOperationPromise(this, 'storeBeforeAndAfterBlobs');
  }
  restoreLastDiscardInTempFiles(isSafe, partialDiscardFilePath = null) {
    return unsupportedOperationPromise(this, 'restoreLastDiscardInTempFiles');
  }
  popDiscardHistory(partialDiscardFilePath = null) {
    return unsupportedOperationPromise(this, 'popDiscardHistory');
  }
  clearDiscardHistory(partialDiscardFilePath = null) {
    return unsupportedOperationPromise(this, 'clearDiscardHistory');
  }
  discardWorkDirChangesForPaths(paths) {
    return unsupportedOperationPromise(this, 'discardWorkDirChangesForPaths');
  }

  // Accessors /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // When possible, these default to "empty" results when invoked in states that don't have information available, or
  // fail in a way that's consistent with the requested information not being found.

  // Index queries

  getStatusBundle() {
    return Promise.resolve({
      stagedFiles: {},
      unstagedFiles: {},
      mergeConflictFiles: {},
      branch: {
        oid: null,
        head: null,
        upstream: null,
        aheadBehind: {
          ahead: null,
          behind: null
        }
      }
    });
  }
  getStatusesForChangedFiles() {
    return Promise.resolve({
      stagedFiles: [],
      unstagedFiles: [],
      mergeConflictFiles: []
    });
  }
  getFilePatchForPath(filePath, options = {}) {
    return Promise.resolve(_multiFilePatch.default.createNull());
  }
  getDiffsForFilePath(filePath, options = {}) {
    return Promise.resolve([]);
  }
  getStagedChangesPatch() {
    return Promise.resolve(_multiFilePatch.default.createNull());
  }
  readFileFromIndex(filePath) {
    return Promise.reject(new Error(`fatal: Path ${filePath} does not exist (neither on disk nor in the index).`));
  }

  // Commit access

  getLastCommit() {
    return Promise.resolve(_commit.nullCommit);
  }
  getCommit() {
    return Promise.resolve(_commit.nullCommit);
  }
  getRecentCommits() {
    return Promise.resolve([]);
  }
  isCommitPushed(sha) {
    return false;
  }

  // Author information

  getAuthors() {
    return Promise.resolve([]);
  }

  // Branches

  getBranches() {
    return Promise.resolve(new _branchSet.default());
  }
  getHeadDescription() {
    return Promise.resolve('(no repository)');
  }

  // Merging and rebasing status

  isMerging() {
    return Promise.resolve(false);
  }
  isRebasing() {
    return Promise.resolve(false);
  }

  // Remotes

  getRemotes() {
    return Promise.resolve(new _remoteSet.default([]));
  }
  addRemote() {
    return unsupportedOperationPromise(this, 'addRemote');
  }
  getAheadCount(branchName) {
    return Promise.resolve(0);
  }
  getBehindCount(branchName) {
    return Promise.resolve(0);
  }
  getConfig(optionName, options) {
    return this.workdirlessGit().getConfig(optionName, options);
  }

  // Direct blob access

  getBlobContents(sha) {
    return Promise.reject(new Error(`fatal: Not a valid object name ${sha}`));
  }

  // Discard history

  hasDiscardHistory(partialDiscardFilePath = null) {
    return false;
  }
  getDiscardHistory(partialDiscardFilePath = null) {
    return [];
  }
  getLastHistorySnapshots(partialDiscardFilePath = null) {
    return null;
  }

  // Atom repo state

  getOperationStates() {
    return _operationStates.nullOperationStates;
  }
  setCommitMessage(message) {
    return unsupportedOperationPromise(this, 'setCommitMessage');
  }
  getCommitMessage() {
    return '';
  }
  fetchCommitMessageTemplate() {
    return unsupportedOperationPromise(this, 'fetchCommitMessageTemplate');
  }

  // Cache

  getCache() {
    return null;
  }
  acceptInvalidation() {
    return null;
  }

  // Internal //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Non-delegated methods that provide subclasses with convenient access to Repository properties.

  git() {
    return this.repository.git;
  }
  workdir() {
    return this.repository.getWorkingDirectoryPath();
  }

  // Call methods on the active Repository state, even if the state has transitioned beneath you.
  // Use this to perform operations within `start()` methods to guard against interrupted state transitions.
  current() {
    return this.repository.state;
  }

  // pipeline
  executePipelineAction(...args) {
    return this.repository.executePipelineAction(...args);
  }

  // Return a Promise that will resolve once the state transitions from Loading.
  getLoadPromise() {
    return this.repository.getLoadPromise();
  }
  getRemoteForBranch(branchName) {
    return this.repository.getRemoteForBranch(branchName);
  }
  saveDiscardHistory() {
    return this.repository.saveDiscardHistory();
  }

  // Initiate a transition to another state.
  transitionTo(stateName, ...payload) {
    const StateConstructor = stateConstructors.get(stateName);
    /* istanbul ignore if */
    if (StateConstructor === undefined) {
      throw new Error(`Attempt to transition to unrecognized state ${stateName}`);
    }
    return this.repository.transition(this, StateConstructor, ...payload);
  }

  // Event broadcast

  didDestroy() {
    return this.repository.emitter.emit('did-destroy');
  }
  didUpdate() {
    return this.repository.emitter.emit('did-update');
  }
  didGloballyInvalidate(spec) {
    return this.repository.emitter.emit('did-globally-invalidate', spec);
  }

  // Direct git access
  // Non-delegated git operations for internal use within states.

  workdirlessGit() {
    // We want to report config values from the global or system level, but never local ones (unless we're in the
    // present state, which overrides this).
    // The filesystem root is the most likely and convenient place for this to be true.
    const {
      root
    } = _path.default.parse(process.cwd());
    return _compositeGitStrategy.default.create(root);
  }

  /* istanbul ignore next */
  directResolveDotGitDir() {
    return Promise.resolve(null);
  }

  /* istanbul ignore next */
  directGetConfig(key, options = {}) {
    return Promise.resolve(null);
  }

  /* istanbul ignore next */
  directGetBlobContents() {
    return Promise.reject(new Error('Not a valid object name'));
  }

  /* istanbul ignore next */
  directInit() {
    return Promise.resolve();
  }

  /* istanbul ignore next */
  directClone(remoteUrl, options) {
    return Promise.resolve();
  }

  // Deferred operations
  // Direct raw git operations to the current state, even if the state has been changed. Use these methods within
  // start() methods.

  resolveDotGitDir() {
    return this.current().directResolveDotGitDir();
  }
  doInit(workdir) {
    return this.current().directInit();
  }
  doClone(remoteUrl, options) {
    return this.current().directClone(remoteUrl, options);
  }

  // Parse a DiscardHistory payload from the SHA recorded in config.
  async loadHistoryPayload() {
    const historySha = await this.current().directGetConfig('atomGithub.historySha');
    if (!historySha) {
      return {};
    }
    let blob;
    try {
      blob = await this.current().directGetBlobContents(historySha);
    } catch (e) {
      if (/Not a valid object name/.test(e.stdErr)) {
        return {};
      }
      throw e;
    }
    try {
      return JSON.parse(blob);
    } catch (e) {
      return {};
    }
  }

  // Debugging assistance.

  toString() {
    return this.constructor.name;
  }
}
exports.default = State;
function unsupportedOperationPromise(self, opName) {
  return Promise.reject(new Error(`${opName} is not available in ${self} state`));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NvbW1pdCIsIl9icmFuY2hTZXQiLCJfcmVtb3RlU2V0IiwiX29wZXJhdGlvblN0YXRlcyIsIl9tdWx0aUZpbGVQYXRjaCIsIl9jb21wb3NpdGVHaXRTdHJhdGVneSIsIl9rZXlzIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJzdGF0ZUNvbnN0cnVjdG9ycyIsIk1hcCIsIlN0YXRlIiwiY29uc3RydWN0b3IiLCJyZXBvc2l0b3J5IiwicmVnaXN0ZXIiLCJTdWJjbGFzcyIsInNldCIsIm5hbWUiLCJzdGFydCIsIlByb21pc2UiLCJyZXNvbHZlIiwiaXNMb2FkaW5nR3Vlc3MiLCJpc0Fic2VudEd1ZXNzIiwiaXNBYnNlbnQiLCJpc0xvYWRpbmciLCJpc0VtcHR5IiwiaXNQcmVzZW50IiwiaXNUb29MYXJnZSIsImlzRGVzdHJveWVkIiwiaXNVbmRldGVybWluZWQiLCJzaG93R2l0VGFiSW5pdCIsInNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcyIsInNob3dHaXRUYWJMb2FkaW5nIiwic2hvd1N0YXR1c0JhclRpbGVzIiwiaGFzRGlyZWN0b3J5IiwiaXNQdWJsaXNoYWJsZSIsImluaXQiLCJ1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UiLCJjbG9uZSIsInJlbW90ZVVybCIsImRlc3Ryb3kiLCJ0cmFuc2l0aW9uVG8iLCJyZWZyZXNoIiwib2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UiLCJldmVudHMiLCJ1cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlIiwic3RhZ2VGaWxlcyIsInBhdGhzIiwidW5zdGFnZUZpbGVzIiwic3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQiLCJhcHBseVBhdGNoVG9JbmRleCIsInBhdGNoIiwiYXBwbHlQYXRjaFRvV29ya2RpciIsImNvbW1pdCIsIm1lc3NhZ2UiLCJvcHRpb25zIiwibWVyZ2UiLCJicmFuY2hOYW1lIiwiYWJvcnRNZXJnZSIsImNoZWNrb3V0U2lkZSIsInNpZGUiLCJtZXJnZUZpbGUiLCJvdXJzUGF0aCIsImNvbW1vbkJhc2VQYXRoIiwidGhlaXJzUGF0aCIsInJlc3VsdFBhdGgiLCJ3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4IiwiZmlsZVBhdGgiLCJjb21tb25CYXNlU2hhIiwib3Vyc1NoYSIsInRoZWlyc1NoYSIsImNoZWNrb3V0IiwicmV2aXNpb24iLCJjaGVja291dFBhdGhzQXRSZXZpc2lvbiIsInVuZG9MYXN0Q29tbWl0IiwiZmV0Y2giLCJwdWxsIiwicHVzaCIsInNldENvbmZpZyIsIm9wdGlvbk5hbWUiLCJ2YWx1ZSIsIndvcmtkaXJsZXNzR2l0IiwiZGlkVXBkYXRlIiwiZ2xvYmFsIiwiZGlkR2xvYmFsbHlJbnZhbGlkYXRlIiwiS2V5cyIsImNvbmZpZyIsImVhY2hXaXRoU2V0dGluZyIsInVuc2V0Q29uZmlnIiwib3B0aW9uIiwiY3JlYXRlQmxvYiIsInN0ZGluIiwiZXhwYW5kQmxvYlRvRmlsZSIsImFic0ZpbGVQYXRoIiwic2hhIiwiY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iIiwidXBkYXRlRGlzY2FyZEhpc3RvcnkiLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJmaWxlUGF0aHMiLCJpc1NhZmUiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInBvcERpc2NhcmRIaXN0b3J5IiwiY2xlYXJEaXNjYXJkSGlzdG9yeSIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwiZ2V0U3RhdHVzQnVuZGxlIiwic3RhZ2VkRmlsZXMiLCJ1bnN0YWdlZEZpbGVzIiwibWVyZ2VDb25mbGljdEZpbGVzIiwiYnJhbmNoIiwib2lkIiwiaGVhZCIsInVwc3RyZWFtIiwiYWhlYWRCZWhpbmQiLCJhaGVhZCIsImJlaGluZCIsImdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzIiwiZ2V0RmlsZVBhdGNoRm9yUGF0aCIsIk11bHRpRmlsZVBhdGNoIiwiY3JlYXRlTnVsbCIsImdldERpZmZzRm9yRmlsZVBhdGgiLCJnZXRTdGFnZWRDaGFuZ2VzUGF0Y2giLCJyZWFkRmlsZUZyb21JbmRleCIsInJlamVjdCIsIkVycm9yIiwiZ2V0TGFzdENvbW1pdCIsIm51bGxDb21taXQiLCJnZXRDb21taXQiLCJnZXRSZWNlbnRDb21taXRzIiwiaXNDb21taXRQdXNoZWQiLCJnZXRBdXRob3JzIiwiZ2V0QnJhbmNoZXMiLCJCcmFuY2hTZXQiLCJnZXRIZWFkRGVzY3JpcHRpb24iLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiZ2V0UmVtb3RlcyIsIlJlbW90ZVNldCIsImFkZFJlbW90ZSIsImdldEFoZWFkQ291bnQiLCJnZXRCZWhpbmRDb3VudCIsImdldENvbmZpZyIsImdldEJsb2JDb250ZW50cyIsImhhc0Rpc2NhcmRIaXN0b3J5IiwiZ2V0RGlzY2FyZEhpc3RvcnkiLCJnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyIsImdldE9wZXJhdGlvblN0YXRlcyIsIm51bGxPcGVyYXRpb25TdGF0ZXMiLCJzZXRDb21taXRNZXNzYWdlIiwiZ2V0Q29tbWl0TWVzc2FnZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZ2V0Q2FjaGUiLCJhY2NlcHRJbnZhbGlkYXRpb24iLCJnaXQiLCJ3b3JrZGlyIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJjdXJyZW50Iiwic3RhdGUiLCJleGVjdXRlUGlwZWxpbmVBY3Rpb24iLCJhcmdzIiwiZ2V0TG9hZFByb21pc2UiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJzdGF0ZU5hbWUiLCJwYXlsb2FkIiwiU3RhdGVDb25zdHJ1Y3RvciIsImdldCIsInVuZGVmaW5lZCIsInRyYW5zaXRpb24iLCJkaWREZXN0cm95IiwiZW1pdHRlciIsImVtaXQiLCJzcGVjIiwicm9vdCIsInBhdGgiLCJwYXJzZSIsInByb2Nlc3MiLCJjd2QiLCJDb21wb3NpdGVHaXRTdHJhdGVneSIsImNyZWF0ZSIsImRpcmVjdFJlc29sdmVEb3RHaXREaXIiLCJkaXJlY3RHZXRDb25maWciLCJrZXkiLCJkaXJlY3RHZXRCbG9iQ29udGVudHMiLCJkaXJlY3RJbml0IiwiZGlyZWN0Q2xvbmUiLCJyZXNvbHZlRG90R2l0RGlyIiwiZG9Jbml0IiwiZG9DbG9uZSIsImxvYWRIaXN0b3J5UGF5bG9hZCIsImhpc3RvcnlTaGEiLCJibG9iIiwiZSIsInRlc3QiLCJzdGRFcnIiLCJKU09OIiwidG9TdHJpbmciLCJleHBvcnRzIiwic2VsZiIsIm9wTmFtZSJdLCJzb3VyY2VzIjpbInN0YXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtudWxsQ29tbWl0fSBmcm9tICcuLi9jb21taXQnO1xuaW1wb3J0IEJyYW5jaFNldCBmcm9tICcuLi9icmFuY2gtc2V0JztcbmltcG9ydCBSZW1vdGVTZXQgZnJvbSAnLi4vcmVtb3RlLXNldCc7XG5pbXBvcnQge251bGxPcGVyYXRpb25TdGF0ZXN9IGZyb20gJy4uL29wZXJhdGlvbi1zdGF0ZXMnO1xuaW1wb3J0IE11bHRpRmlsZVBhdGNoIGZyb20gJy4uL3BhdGNoL211bHRpLWZpbGUtcGF0Y2gnO1xuaW1wb3J0IENvbXBvc2l0ZUdpdFN0cmF0ZWd5IGZyb20gJy4uLy4uL2NvbXBvc2l0ZS1naXQtc3RyYXRlZ3knO1xuaW1wb3J0IHtLZXlzfSBmcm9tICcuL2NhY2hlL2tleXMnO1xuXG4vKipcbiAqIE1hcCBvZiByZWdpc3RlcmVkIHN1YmNsYXNzZXMgdG8gYWxsb3cgc3RhdGVzIHRvIHRyYW5zaXRpb24gdG8gb25lIGFub3RoZXIgd2l0aG91dCBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gKiBTdWJjbGFzc2VzIG9mIFN0YXRlIHNob3VsZCBjYWxsIGBTdGF0ZS5yZWdpc3RlcmAgdG8gYWRkIHRoZW1zZWx2ZXMgaGVyZS5cbiAqL1xuY29uc3Qgc3RhdGVDb25zdHJ1Y3RvcnMgPSBuZXcgTWFwKCk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgUmVwb3NpdG9yeSBzdGF0ZXMuIEltcGxlbWVudHMgZGVmYXVsdCBcIm51bGxcIiBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdGUge1xuICBjb25zdHJ1Y3RvcihyZXBvc2l0b3J5KSB7XG4gICAgdGhpcy5yZXBvc2l0b3J5ID0gcmVwb3NpdG9yeTtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3RlcihTdWJjbGFzcykge1xuICAgIHN0YXRlQ29uc3RydWN0b3JzLnNldChTdWJjbGFzcy5uYW1lLCBTdWJjbGFzcyk7XG4gIH1cblxuICAvLyBUaGlzIHN0YXRlIGhhcyBqdXN0IGJlZW4gZW50ZXJlZC4gUGVyZm9ybSBhbnkgYXN5bmNocm9ub3VzIGluaXRpYWxpemF0aW9uIHRoYXQgbmVlZHMgdG8gb2NjdXIuXG4gIHN0YXJ0KCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8vIFN0YXRlIHByb2JlIHByZWRpY2F0ZXMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gQWxsb3cgZXh0ZXJuYWwgY2FsbGVycyB0byBpZGVudGlmeSB3aGljaCBzdGF0ZSBhIFJlcG9zaXRvcnkgaXMgaW4gaWYgbmVjZXNzYXJ5LlxuXG4gIGlzTG9hZGluZ0d1ZXNzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzQWJzZW50R3Vlc3MoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNBYnNlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNMb2FkaW5nKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzVG9vTGFyZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNEZXN0cm95ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gQmVoYXZpb3IgcHJvYmUgcHJlZGljYXRlcyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBEZXRlcm1pbmUgc3BlY2lmaWMgcmVuZGVyaW5nIGJlaGF2aW9yIGJhc2VkIG9uIHRoZSBjdXJyZW50IHN0YXRlLlxuXG4gIGlzVW5kZXRlcm1pbmVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzaG93R2l0VGFiTG9hZGluZygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzaG93U3RhdHVzQmFyVGlsZXMoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFzRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNQdWJsaXNoYWJsZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBMaWZlY3ljbGUgYWN0aW9ucyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIFRoZXNlIGdlbmVyYWxseSBkZWZhdWx0IHRvIHJlamVjdGluZyBhIFByb21pc2Ugd2l0aCBhbiBlcnJvci5cblxuICBpbml0KCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2luaXQnKTtcbiAgfVxuXG4gIGNsb25lKHJlbW90ZVVybCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2Nsb25lJyk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25UbygnRGVzdHJveWVkJyk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICByZWZyZXNoKCkge1xuICAgIC8vIE5vLW9wXG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBvYnNlcnZlRmlsZXN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICB0aGlzLnJlcG9zaXRvcnkucmVmcmVzaCgpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZSgpIHtcbiAgICAvLyB0aGlzIGlzIG9ubHkgdXNlZCBpbiB1bml0IHRlc3RzLCB3ZSBkb24ndCBuZWVkIG5vIHN0aW5raW4gY292ZXJhZ2VcbiAgICB0aGlzLnJlcG9zaXRvcnkucmVmcmVzaCgpO1xuICB9XG5cbiAgLy8gR2l0IG9wZXJhdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBUaGVzZSBkZWZhdWx0IHRvIHJlamVjdGluZyBhIFByb21pc2Ugd2l0aCBhbiBlcnJvciBzdGF0aW5nIHRoYXQgdGhlIG9wZXJhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGluIHRoZSBjdXJyZW50XG4gIC8vIHN0YXRlLlxuXG4gIC8vIFN0YWdpbmcgYW5kIHVuc3RhZ2luZ1xuXG4gIHN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdzdGFnZUZpbGVzJyk7XG4gIH1cblxuICB1bnN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICd1bnN0YWdlRmlsZXMnKTtcbiAgfVxuXG4gIHN0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0KHBhdGhzKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnc3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQnKTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2hUb0luZGV4KHBhdGNoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnYXBwbHlQYXRjaFRvSW5kZXgnKTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2hUb1dvcmtkaXIocGF0Y2gpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdhcHBseVBhdGNoVG9Xb3JrZGlyJyk7XG4gIH1cblxuICAvLyBDb21taXR0aW5nXG5cbiAgY29tbWl0KG1lc3NhZ2UsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjb21taXQnKTtcbiAgfVxuXG4gIC8vIE1lcmdpbmdcblxuICBtZXJnZShicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnbWVyZ2UnKTtcbiAgfVxuXG4gIGFib3J0TWVyZ2UoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnYWJvcnRNZXJnZScpO1xuICB9XG5cbiAgY2hlY2tvdXRTaWRlKHNpZGUsIHBhdGhzKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY2hlY2tvdXRTaWRlJyk7XG4gIH1cblxuICBtZXJnZUZpbGUob3Vyc1BhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnbWVyZ2VGaWxlJyk7XG4gIH1cblxuICB3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICd3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4Jyk7XG4gIH1cblxuICAvLyBDaGVja291dFxuXG4gIGNoZWNrb3V0KHJldmlzaW9uLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjaGVja291dCcpO1xuICB9XG5cbiAgY2hlY2tvdXRQYXRoc0F0UmV2aXNpb24ocGF0aHMsIHJldmlzaW9uID0gJ0hFQUQnKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY2hlY2tvdXRQYXRoc0F0UmV2aXNpb24nKTtcbiAgfVxuXG4gIC8vIFJlc2V0XG5cbiAgdW5kb0xhc3RDb21taXQoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAndW5kb0xhc3RDb21taXQnKTtcbiAgfVxuXG4gIC8vIFJlbW90ZSBpbnRlcmFjdGlvbnNcblxuICBmZXRjaChicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnZmV0Y2gnKTtcbiAgfVxuXG4gIHB1bGwoYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3B1bGwnKTtcbiAgfVxuXG4gIHB1c2goYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3B1c2gnKTtcbiAgfVxuXG4gIC8vIENvbmZpZ3VyYXRpb25cblxuICBhc3luYyBzZXRDb25maWcob3B0aW9uTmFtZSwgdmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGF3YWl0IHRoaXMud29ya2Rpcmxlc3NHaXQoKS5zZXRDb25maWcob3B0aW9uTmFtZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgaWYgKG9wdGlvbnMuZ2xvYmFsKSB7XG4gICAgICB0aGlzLmRpZEdsb2JhbGx5SW52YWxpZGF0ZSgoKSA9PiBLZXlzLmNvbmZpZy5lYWNoV2l0aFNldHRpbmcob3B0aW9uTmFtZSkpO1xuICAgIH1cbiAgfVxuXG4gIHVuc2V0Q29uZmlnKG9wdGlvbikge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3Vuc2V0Q29uZmlnJyk7XG4gIH1cblxuICAvLyBEaXJlY3QgYmxvYiBpbnRlcmFjdGlvbnNcblxuICBjcmVhdGVCbG9iKHtmaWxlUGF0aCwgc3RkaW59ID0ge30pIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjcmVhdGVCbG9iJyk7XG4gIH1cblxuICBleHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdleHBhbmRCbG9iVG9GaWxlJyk7XG4gIH1cblxuICAvLyBEaXNjYXJkIGhpc3RvcnlcblxuICBjcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iJyk7XG4gIH1cblxuICB1cGRhdGVEaXNjYXJkSGlzdG9yeSgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICd1cGRhdGVEaXNjYXJkSGlzdG9yeScpO1xuICB9XG5cbiAgc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKGZpbGVQYXRocywgaXNTYWZlLCBkZXN0cnVjdGl2ZUFjdGlvbiwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMnKTtcbiAgfVxuXG4gIHJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzKGlzU2FmZSwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcycpO1xuICB9XG5cbiAgcG9wRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdwb3BEaXNjYXJkSGlzdG9yeScpO1xuICB9XG5cbiAgY2xlYXJEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NsZWFyRGlzY2FyZEhpc3RvcnknKTtcbiAgfVxuXG4gIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMnKTtcbiAgfVxuXG4gIC8vIEFjY2Vzc29ycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gV2hlbiBwb3NzaWJsZSwgdGhlc2UgZGVmYXVsdCB0byBcImVtcHR5XCIgcmVzdWx0cyB3aGVuIGludm9rZWQgaW4gc3RhdGVzIHRoYXQgZG9uJ3QgaGF2ZSBpbmZvcm1hdGlvbiBhdmFpbGFibGUsIG9yXG4gIC8vIGZhaWwgaW4gYSB3YXkgdGhhdCdzIGNvbnNpc3RlbnQgd2l0aCB0aGUgcmVxdWVzdGVkIGluZm9ybWF0aW9uIG5vdCBiZWluZyBmb3VuZC5cblxuICAvLyBJbmRleCBxdWVyaWVzXG5cbiAgZ2V0U3RhdHVzQnVuZGxlKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgc3RhZ2VkRmlsZXM6IHt9LFxuICAgICAgdW5zdGFnZWRGaWxlczoge30sXG4gICAgICBtZXJnZUNvbmZsaWN0RmlsZXM6IHt9LFxuICAgICAgYnJhbmNoOiB7XG4gICAgICAgIG9pZDogbnVsbCxcbiAgICAgICAgaGVhZDogbnVsbCxcbiAgICAgICAgdXBzdHJlYW06IG51bGwsXG4gICAgICAgIGFoZWFkQmVoaW5kOiB7YWhlYWQ6IG51bGwsIGJlaGluZDogbnVsbH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICBzdGFnZWRGaWxlczogW10sXG4gICAgICB1bnN0YWdlZEZpbGVzOiBbXSxcbiAgICAgIG1lcmdlQ29uZmxpY3RGaWxlczogW10sXG4gICAgfSk7XG4gIH1cblxuICBnZXRGaWxlUGF0Y2hGb3JQYXRoKGZpbGVQYXRoLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKE11bHRpRmlsZVBhdGNoLmNyZWF0ZU51bGwoKSk7XG4gIH1cblxuICBnZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgfVxuXG4gIGdldFN0YWdlZENoYW5nZXNQYXRjaCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKE11bHRpRmlsZVBhdGNoLmNyZWF0ZU51bGwoKSk7XG4gIH1cblxuICByZWFkRmlsZUZyb21JbmRleChmaWxlUGF0aCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYGZhdGFsOiBQYXRoICR7ZmlsZVBhdGh9IGRvZXMgbm90IGV4aXN0IChuZWl0aGVyIG9uIGRpc2sgbm9yIGluIHRoZSBpbmRleCkuYCkpO1xuICB9XG5cbiAgLy8gQ29tbWl0IGFjY2Vzc1xuXG4gIGdldExhc3RDb21taXQoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsQ29tbWl0KTtcbiAgfVxuXG4gIGdldENvbW1pdCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGxDb21taXQpO1xuICB9XG5cbiAgZ2V0UmVjZW50Q29tbWl0cygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgfVxuXG4gIGlzQ29tbWl0UHVzaGVkKHNoYSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEF1dGhvciBpbmZvcm1hdGlvblxuXG4gIGdldEF1dGhvcnMoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gIH1cblxuICAvLyBCcmFuY2hlc1xuXG4gIGdldEJyYW5jaGVzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJyYW5jaFNldCgpKTtcbiAgfVxuXG4gIGdldEhlYWREZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCcobm8gcmVwb3NpdG9yeSknKTtcbiAgfVxuXG4gIC8vIE1lcmdpbmcgYW5kIHJlYmFzaW5nIHN0YXR1c1xuXG4gIGlzTWVyZ2luZygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgfVxuXG4gIGlzUmViYXNpbmcoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gIH1cblxuICAvLyBSZW1vdGVzXG5cbiAgZ2V0UmVtb3RlcygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBSZW1vdGVTZXQoW10pKTtcbiAgfVxuXG4gIGFkZFJlbW90ZSgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdhZGRSZW1vdGUnKTtcbiAgfVxuXG4gIGdldEFoZWFkQ291bnQoYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoMCk7XG4gIH1cblxuICBnZXRCZWhpbmRDb3VudChicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgwKTtcbiAgfVxuXG4gIGdldENvbmZpZyhvcHRpb25OYW1lLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMud29ya2Rpcmxlc3NHaXQoKS5nZXRDb25maWcob3B0aW9uTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBEaXJlY3QgYmxvYiBhY2Nlc3NcblxuICBnZXRCbG9iQ29udGVudHMoc2hhKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgZmF0YWw6IE5vdCBhIHZhbGlkIG9iamVjdCBuYW1lICR7c2hhfWApKTtcbiAgfVxuXG4gIC8vIERpc2NhcmQgaGlzdG9yeVxuXG4gIGhhc0Rpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0RGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQXRvbSByZXBvIHN0YXRlXG5cbiAgZ2V0T3BlcmF0aW9uU3RhdGVzKCkge1xuICAgIHJldHVybiBudWxsT3BlcmF0aW9uU3RhdGVzO1xuICB9XG5cbiAgc2V0Q29tbWl0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnc2V0Q29tbWl0TWVzc2FnZScpO1xuICB9XG5cbiAgZ2V0Q29tbWl0TWVzc2FnZSgpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZScpO1xuICB9XG5cbiAgLy8gQ2FjaGVcblxuICBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFjY2VwdEludmFsaWRhdGlvbigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEludGVybmFsIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gTm9uLWRlbGVnYXRlZCBtZXRob2RzIHRoYXQgcHJvdmlkZSBzdWJjbGFzc2VzIHdpdGggY29udmVuaWVudCBhY2Nlc3MgdG8gUmVwb3NpdG9yeSBwcm9wZXJ0aWVzLlxuXG4gIGdpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmdpdDtcbiAgfVxuXG4gIHdvcmtkaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICB9XG5cbiAgLy8gQ2FsbCBtZXRob2RzIG9uIHRoZSBhY3RpdmUgUmVwb3NpdG9yeSBzdGF0ZSwgZXZlbiBpZiB0aGUgc3RhdGUgaGFzIHRyYW5zaXRpb25lZCBiZW5lYXRoIHlvdS5cbiAgLy8gVXNlIHRoaXMgdG8gcGVyZm9ybSBvcGVyYXRpb25zIHdpdGhpbiBgc3RhcnQoKWAgbWV0aG9kcyB0byBndWFyZCBhZ2FpbnN0IGludGVycnVwdGVkIHN0YXRlIHRyYW5zaXRpb25zLlxuICBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuc3RhdGU7XG4gIH1cblxuICAvLyBwaXBlbGluZVxuICBleGVjdXRlUGlwZWxpbmVBY3Rpb24oLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKC4uLmFyZ3MpO1xuICB9XG5cbiAgLy8gUmV0dXJuIGEgUHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSBvbmNlIHRoZSBzdGF0ZSB0cmFuc2l0aW9ucyBmcm9tIExvYWRpbmcuXG4gIGdldExvYWRQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZ2V0TG9hZFByb21pc2UoKTtcbiAgfVxuXG4gIGdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5nZXRSZW1vdGVGb3JCcmFuY2goYnJhbmNoTmFtZSk7XG4gIH1cblxuICBzYXZlRGlzY2FyZEhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5zYXZlRGlzY2FyZEhpc3RvcnkoKTtcbiAgfVxuXG4gIC8vIEluaXRpYXRlIGEgdHJhbnNpdGlvbiB0byBhbm90aGVyIHN0YXRlLlxuICB0cmFuc2l0aW9uVG8oc3RhdGVOYW1lLCAuLi5wYXlsb2FkKSB7XG4gICAgY29uc3QgU3RhdGVDb25zdHJ1Y3RvciA9IHN0YXRlQ29uc3RydWN0b3JzLmdldChzdGF0ZU5hbWUpO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChTdGF0ZUNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXR0ZW1wdCB0byB0cmFuc2l0aW9uIHRvIHVucmVjb2duaXplZCBzdGF0ZSAke3N0YXRlTmFtZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS50cmFuc2l0aW9uKHRoaXMsIFN0YXRlQ29uc3RydWN0b3IsIC4uLnBheWxvYWQpO1xuICB9XG5cbiAgLy8gRXZlbnQgYnJvYWRjYXN0XG5cbiAgZGlkRGVzdHJveSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKTtcbiAgfVxuXG4gIGRpZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICB9XG5cbiAgZGlkR2xvYmFsbHlJbnZhbGlkYXRlKHNwZWMpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmVtaXR0ZXIuZW1pdCgnZGlkLWdsb2JhbGx5LWludmFsaWRhdGUnLCBzcGVjKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBnaXQgYWNjZXNzXG4gIC8vIE5vbi1kZWxlZ2F0ZWQgZ2l0IG9wZXJhdGlvbnMgZm9yIGludGVybmFsIHVzZSB3aXRoaW4gc3RhdGVzLlxuXG4gIHdvcmtkaXJsZXNzR2l0KCkge1xuICAgIC8vIFdlIHdhbnQgdG8gcmVwb3J0IGNvbmZpZyB2YWx1ZXMgZnJvbSB0aGUgZ2xvYmFsIG9yIHN5c3RlbSBsZXZlbCwgYnV0IG5ldmVyIGxvY2FsIG9uZXMgKHVubGVzcyB3ZSdyZSBpbiB0aGVcbiAgICAvLyBwcmVzZW50IHN0YXRlLCB3aGljaCBvdmVycmlkZXMgdGhpcykuXG4gICAgLy8gVGhlIGZpbGVzeXN0ZW0gcm9vdCBpcyB0aGUgbW9zdCBsaWtlbHkgYW5kIGNvbnZlbmllbnQgcGxhY2UgZm9yIHRoaXMgdG8gYmUgdHJ1ZS5cbiAgICBjb25zdCB7cm9vdH0gPSBwYXRoLnBhcnNlKHByb2Nlc3MuY3dkKCkpO1xuICAgIHJldHVybiBDb21wb3NpdGVHaXRTdHJhdGVneS5jcmVhdGUocm9vdCk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBkaXJlY3RSZXNvbHZlRG90R2l0RGlyKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBkaXJlY3RHZXRDb25maWcoa2V5LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZGlyZWN0R2V0QmxvYkNvbnRlbnRzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIG9iamVjdCBuYW1lJykpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZGlyZWN0SW5pdCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBkaXJlY3RDbG9uZShyZW1vdGVVcmwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvLyBEZWZlcnJlZCBvcGVyYXRpb25zXG4gIC8vIERpcmVjdCByYXcgZ2l0IG9wZXJhdGlvbnMgdG8gdGhlIGN1cnJlbnQgc3RhdGUsIGV2ZW4gaWYgdGhlIHN0YXRlIGhhcyBiZWVuIGNoYW5nZWQuIFVzZSB0aGVzZSBtZXRob2RzIHdpdGhpblxuICAvLyBzdGFydCgpIG1ldGhvZHMuXG5cbiAgcmVzb2x2ZURvdEdpdERpcigpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50KCkuZGlyZWN0UmVzb2x2ZURvdEdpdERpcigpO1xuICB9XG5cbiAgZG9Jbml0KHdvcmtkaXIpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50KCkuZGlyZWN0SW5pdCgpO1xuICB9XG5cbiAgZG9DbG9uZShyZW1vdGVVcmwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50KCkuZGlyZWN0Q2xvbmUocmVtb3RlVXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgRGlzY2FyZEhpc3RvcnkgcGF5bG9hZCBmcm9tIHRoZSBTSEEgcmVjb3JkZWQgaW4gY29uZmlnLlxuICBhc3luYyBsb2FkSGlzdG9yeVBheWxvYWQoKSB7XG4gICAgY29uc3QgaGlzdG9yeVNoYSA9IGF3YWl0IHRoaXMuY3VycmVudCgpLmRpcmVjdEdldENvbmZpZygnYXRvbUdpdGh1Yi5oaXN0b3J5U2hhJyk7XG4gICAgaWYgKCFoaXN0b3J5U2hhKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgbGV0IGJsb2I7XG4gICAgdHJ5IHtcbiAgICAgIGJsb2IgPSBhd2FpdCB0aGlzLmN1cnJlbnQoKS5kaXJlY3RHZXRCbG9iQ29udGVudHMoaGlzdG9yeVNoYSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKC9Ob3QgYSB2YWxpZCBvYmplY3QgbmFtZS8udGVzdChlLnN0ZEVycikpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShibG9iKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgLy8gRGVidWdnaW5nIGFzc2lzdGFuY2UuXG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2Uoc2VsZiwgb3BOYW1lKSB7XG4gIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYCR7b3BOYW1lfSBpcyBub3QgYXZhaWxhYmxlIGluICR7c2VsZn0gc3RhdGVgKSk7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE9BQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFVBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFVBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLGdC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