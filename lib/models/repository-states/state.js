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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzdGF0ZUNvbnN0cnVjdG9ycyIsIk1hcCIsIlN0YXRlIiwiY29uc3RydWN0b3IiLCJyZXBvc2l0b3J5IiwicmVnaXN0ZXIiLCJTdWJjbGFzcyIsInNldCIsIm5hbWUiLCJzdGFydCIsIlByb21pc2UiLCJyZXNvbHZlIiwiaXNMb2FkaW5nR3Vlc3MiLCJpc0Fic2VudEd1ZXNzIiwiaXNBYnNlbnQiLCJpc0xvYWRpbmciLCJpc0VtcHR5IiwiaXNQcmVzZW50IiwiaXNUb29MYXJnZSIsImlzRGVzdHJveWVkIiwiaXNVbmRldGVybWluZWQiLCJzaG93R2l0VGFiSW5pdCIsInNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcyIsInNob3dHaXRUYWJMb2FkaW5nIiwic2hvd1N0YXR1c0JhclRpbGVzIiwiaGFzRGlyZWN0b3J5IiwiaXNQdWJsaXNoYWJsZSIsImluaXQiLCJ1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UiLCJjbG9uZSIsInJlbW90ZVVybCIsImRlc3Ryb3kiLCJ0cmFuc2l0aW9uVG8iLCJyZWZyZXNoIiwib2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UiLCJldmVudHMiLCJ1cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlIiwic3RhZ2VGaWxlcyIsInBhdGhzIiwidW5zdGFnZUZpbGVzIiwic3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQiLCJhcHBseVBhdGNoVG9JbmRleCIsInBhdGNoIiwiYXBwbHlQYXRjaFRvV29ya2RpciIsImNvbW1pdCIsIm1lc3NhZ2UiLCJvcHRpb25zIiwibWVyZ2UiLCJicmFuY2hOYW1lIiwiYWJvcnRNZXJnZSIsImNoZWNrb3V0U2lkZSIsInNpZGUiLCJtZXJnZUZpbGUiLCJvdXJzUGF0aCIsImNvbW1vbkJhc2VQYXRoIiwidGhlaXJzUGF0aCIsInJlc3VsdFBhdGgiLCJ3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4IiwiZmlsZVBhdGgiLCJjb21tb25CYXNlU2hhIiwib3Vyc1NoYSIsInRoZWlyc1NoYSIsImNoZWNrb3V0IiwicmV2aXNpb24iLCJjaGVja291dFBhdGhzQXRSZXZpc2lvbiIsInVuZG9MYXN0Q29tbWl0IiwiZmV0Y2giLCJwdWxsIiwicHVzaCIsInNldENvbmZpZyIsIm9wdGlvbk5hbWUiLCJ2YWx1ZSIsIndvcmtkaXJsZXNzR2l0IiwiZGlkVXBkYXRlIiwiZ2xvYmFsIiwiZGlkR2xvYmFsbHlJbnZhbGlkYXRlIiwiS2V5cyIsImNvbmZpZyIsImVhY2hXaXRoU2V0dGluZyIsInVuc2V0Q29uZmlnIiwib3B0aW9uIiwiY3JlYXRlQmxvYiIsInN0ZGluIiwiZXhwYW5kQmxvYlRvRmlsZSIsImFic0ZpbGVQYXRoIiwic2hhIiwiY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iIiwidXBkYXRlRGlzY2FyZEhpc3RvcnkiLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJmaWxlUGF0aHMiLCJpc1NhZmUiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInBvcERpc2NhcmRIaXN0b3J5IiwiY2xlYXJEaXNjYXJkSGlzdG9yeSIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwiZ2V0U3RhdHVzQnVuZGxlIiwic3RhZ2VkRmlsZXMiLCJ1bnN0YWdlZEZpbGVzIiwibWVyZ2VDb25mbGljdEZpbGVzIiwiYnJhbmNoIiwib2lkIiwiaGVhZCIsInVwc3RyZWFtIiwiYWhlYWRCZWhpbmQiLCJhaGVhZCIsImJlaGluZCIsImdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzIiwiZ2V0RmlsZVBhdGNoRm9yUGF0aCIsIk11bHRpRmlsZVBhdGNoIiwiY3JlYXRlTnVsbCIsImdldERpZmZzRm9yRmlsZVBhdGgiLCJnZXRTdGFnZWRDaGFuZ2VzUGF0Y2giLCJyZWFkRmlsZUZyb21JbmRleCIsInJlamVjdCIsIkVycm9yIiwiZ2V0TGFzdENvbW1pdCIsIm51bGxDb21taXQiLCJnZXRDb21taXQiLCJnZXRSZWNlbnRDb21taXRzIiwiaXNDb21taXRQdXNoZWQiLCJnZXRBdXRob3JzIiwiZ2V0QnJhbmNoZXMiLCJCcmFuY2hTZXQiLCJnZXRIZWFkRGVzY3JpcHRpb24iLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiZ2V0UmVtb3RlcyIsIlJlbW90ZVNldCIsImFkZFJlbW90ZSIsImdldEFoZWFkQ291bnQiLCJnZXRCZWhpbmRDb3VudCIsImdldENvbmZpZyIsImdldEJsb2JDb250ZW50cyIsImhhc0Rpc2NhcmRIaXN0b3J5IiwiZ2V0RGlzY2FyZEhpc3RvcnkiLCJnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyIsImdldE9wZXJhdGlvblN0YXRlcyIsIm51bGxPcGVyYXRpb25TdGF0ZXMiLCJzZXRDb21taXRNZXNzYWdlIiwiZ2V0Q29tbWl0TWVzc2FnZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZ2V0Q2FjaGUiLCJhY2NlcHRJbnZhbGlkYXRpb24iLCJnaXQiLCJ3b3JrZGlyIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJjdXJyZW50Iiwic3RhdGUiLCJleGVjdXRlUGlwZWxpbmVBY3Rpb24iLCJhcmdzIiwiZ2V0TG9hZFByb21pc2UiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJzdGF0ZU5hbWUiLCJwYXlsb2FkIiwiU3RhdGVDb25zdHJ1Y3RvciIsImdldCIsInVuZGVmaW5lZCIsInRyYW5zaXRpb24iLCJkaWREZXN0cm95IiwiZW1pdHRlciIsImVtaXQiLCJzcGVjIiwicm9vdCIsInBhdGgiLCJwYXJzZSIsInByb2Nlc3MiLCJjd2QiLCJDb21wb3NpdGVHaXRTdHJhdGVneSIsImNyZWF0ZSIsImRpcmVjdFJlc29sdmVEb3RHaXREaXIiLCJkaXJlY3RHZXRDb25maWciLCJrZXkiLCJkaXJlY3RHZXRCbG9iQ29udGVudHMiLCJkaXJlY3RJbml0IiwiZGlyZWN0Q2xvbmUiLCJyZXNvbHZlRG90R2l0RGlyIiwiZG9Jbml0IiwiZG9DbG9uZSIsImxvYWRIaXN0b3J5UGF5bG9hZCIsImhpc3RvcnlTaGEiLCJibG9iIiwiZSIsInRlc3QiLCJzdGRFcnIiLCJKU09OIiwidG9TdHJpbmciLCJzZWxmIiwib3BOYW1lIl0sInNvdXJjZXMiOlsic3RhdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge251bGxDb21taXR9IGZyb20gJy4uL2NvbW1pdCc7XG5pbXBvcnQgQnJhbmNoU2V0IGZyb20gJy4uL2JyYW5jaC1zZXQnO1xuaW1wb3J0IFJlbW90ZVNldCBmcm9tICcuLi9yZW1vdGUtc2V0JztcbmltcG9ydCB7bnVsbE9wZXJhdGlvblN0YXRlc30gZnJvbSAnLi4vb3BlcmF0aW9uLXN0YXRlcyc7XG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2ggZnJvbSAnLi4vcGF0Y2gvbXVsdGktZmlsZS1wYXRjaCc7XG5pbXBvcnQgQ29tcG9zaXRlR2l0U3RyYXRlZ3kgZnJvbSAnLi4vLi4vY29tcG9zaXRlLWdpdC1zdHJhdGVneSc7XG5pbXBvcnQge0tleXN9IGZyb20gJy4vY2FjaGUva2V5cyc7XG5cbi8qKlxuICogTWFwIG9mIHJlZ2lzdGVyZWQgc3ViY2xhc3NlcyB0byBhbGxvdyBzdGF0ZXMgdG8gdHJhbnNpdGlvbiB0byBvbmUgYW5vdGhlciB3aXRob3V0IGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAqIFN1YmNsYXNzZXMgb2YgU3RhdGUgc2hvdWxkIGNhbGwgYFN0YXRlLnJlZ2lzdGVyYCB0byBhZGQgdGhlbXNlbHZlcyBoZXJlLlxuICovXG5jb25zdCBzdGF0ZUNvbnN0cnVjdG9ycyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBSZXBvc2l0b3J5IHN0YXRlcy4gSW1wbGVtZW50cyBkZWZhdWx0IFwibnVsbFwiIGJlaGF2aW9yLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHJlcG9zaXRvcnkpIHtcbiAgICB0aGlzLnJlcG9zaXRvcnkgPSByZXBvc2l0b3J5O1xuICB9XG5cbiAgc3RhdGljIHJlZ2lzdGVyKFN1YmNsYXNzKSB7XG4gICAgc3RhdGVDb25zdHJ1Y3RvcnMuc2V0KFN1YmNsYXNzLm5hbWUsIFN1YmNsYXNzKTtcbiAgfVxuXG4gIC8vIFRoaXMgc3RhdGUgaGFzIGp1c3QgYmVlbiBlbnRlcmVkLiBQZXJmb3JtIGFueSBhc3luY2hyb25vdXMgaW5pdGlhbGl6YXRpb24gdGhhdCBuZWVkcyB0byBvY2N1ci5cbiAgc3RhcnQoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLy8gU3RhdGUgcHJvYmUgcHJlZGljYXRlcyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBBbGxvdyBleHRlcm5hbCBjYWxsZXJzIHRvIGlkZW50aWZ5IHdoaWNoIHN0YXRlIGEgUmVwb3NpdG9yeSBpcyBpbiBpZiBuZWNlc3NhcnkuXG5cbiAgaXNMb2FkaW5nR3Vlc3MoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNBYnNlbnRHdWVzcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0Fic2VudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0xvYWRpbmcoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNUb29MYXJnZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0Rlc3Ryb3llZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBCZWhhdmlvciBwcm9iZSBwcmVkaWNhdGVzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIERldGVybWluZSBzcGVjaWZpYyByZW5kZXJpbmcgYmVoYXZpb3IgYmFzZWQgb24gdGhlIGN1cnJlbnQgc3RhdGUuXG5cbiAgaXNVbmRldGVybWluZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2hvd0dpdFRhYkluaXQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2hvd0dpdFRhYkluaXRJblByb2dyZXNzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJMb2FkaW5nKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNob3dTdGF0dXNCYXJUaWxlcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYXNEaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1B1Ymxpc2hhYmxlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIExpZmVjeWNsZSBhY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gVGhlc2UgZ2VuZXJhbGx5IGRlZmF1bHQgdG8gcmVqZWN0aW5nIGEgUHJvbWlzZSB3aXRoIGFuIGVycm9yLlxuXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnaW5pdCcpO1xuICB9XG5cbiAgY2xvbmUocmVtb3RlVXJsKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY2xvbmUnKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvblRvKCdEZXN0cm95ZWQnKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJlZnJlc2goKSB7XG4gICAgLy8gTm8tb3BcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIG9ic2VydmVGaWxlc3lzdGVtQ2hhbmdlKGV2ZW50cykge1xuICAgIHRoaXMucmVwb3NpdG9yeS5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB1cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlKCkge1xuICAgIC8vIHRoaXMgaXMgb25seSB1c2VkIGluIHVuaXQgdGVzdHMsIHdlIGRvbid0IG5lZWQgbm8gc3RpbmtpbiBjb3ZlcmFnZVxuICAgIHRoaXMucmVwb3NpdG9yeS5yZWZyZXNoKCk7XG4gIH1cblxuICAvLyBHaXQgb3BlcmF0aW9ucyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIFRoZXNlIGRlZmF1bHQgdG8gcmVqZWN0aW5nIGEgUHJvbWlzZSB3aXRoIGFuIGVycm9yIHN0YXRpbmcgdGhhdCB0aGUgb3BlcmF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGN1cnJlbnRcbiAgLy8gc3RhdGUuXG5cbiAgLy8gU3RhZ2luZyBhbmQgdW5zdGFnaW5nXG5cbiAgc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3N0YWdlRmlsZXMnKTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3Vuc3RhZ2VGaWxlcycpO1xuICB9XG5cbiAgc3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQocGF0aHMpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdCcpO1xuICB9XG5cbiAgYXBwbHlQYXRjaFRvSW5kZXgocGF0Y2gpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdhcHBseVBhdGNoVG9JbmRleCcpO1xuICB9XG5cbiAgYXBwbHlQYXRjaFRvV29ya2RpcihwYXRjaCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2FwcGx5UGF0Y2hUb1dvcmtkaXInKTtcbiAgfVxuXG4gIC8vIENvbW1pdHRpbmdcblxuICBjb21taXQobWVzc2FnZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NvbW1pdCcpO1xuICB9XG5cbiAgLy8gTWVyZ2luZ1xuXG4gIG1lcmdlKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdtZXJnZScpO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdhYm9ydE1lcmdlJyk7XG4gIH1cblxuICBjaGVja291dFNpZGUoc2lkZSwgcGF0aHMpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjaGVja291dFNpZGUnKTtcbiAgfVxuXG4gIG1lcmdlRmlsZShvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdtZXJnZUZpbGUnKTtcbiAgfVxuXG4gIHdyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgoZmlsZVBhdGgsIGNvbW1vbkJhc2VTaGEsIG91cnNTaGEsIHRoZWlyc1NoYSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3dyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgnKTtcbiAgfVxuXG4gIC8vIENoZWNrb3V0XG5cbiAgY2hlY2tvdXQocmV2aXNpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NoZWNrb3V0Jyk7XG4gIH1cblxuICBjaGVja291dFBhdGhzQXRSZXZpc2lvbihwYXRocywgcmV2aXNpb24gPSAnSEVBRCcpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjaGVja291dFBhdGhzQXRSZXZpc2lvbicpO1xuICB9XG5cbiAgLy8gUmVzZXRcblxuICB1bmRvTGFzdENvbW1pdCgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICd1bmRvTGFzdENvbW1pdCcpO1xuICB9XG5cbiAgLy8gUmVtb3RlIGludGVyYWN0aW9uc1xuXG4gIGZldGNoKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdmZXRjaCcpO1xuICB9XG5cbiAgcHVsbChicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAncHVsbCcpO1xuICB9XG5cbiAgcHVzaChicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAncHVzaCcpO1xuICB9XG5cbiAgLy8gQ29uZmlndXJhdGlvblxuXG4gIGFzeW5jIHNldENvbmZpZyhvcHRpb25OYW1lLCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgYXdhaXQgdGhpcy53b3JrZGlybGVzc0dpdCgpLnNldENvbmZpZyhvcHRpb25OYW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICBpZiAob3B0aW9ucy5nbG9iYWwpIHtcbiAgICAgIHRoaXMuZGlkR2xvYmFsbHlJbnZhbGlkYXRlKCgpID0+IEtleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhvcHRpb25OYW1lKSk7XG4gICAgfVxuICB9XG5cbiAgdW5zZXRDb25maWcob3B0aW9uKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAndW5zZXRDb25maWcnKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBibG9iIGludGVyYWN0aW9uc1xuXG4gIGNyZWF0ZUJsb2Ioe2ZpbGVQYXRoLCBzdGRpbn0gPSB7fSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NyZWF0ZUJsb2InKTtcbiAgfVxuXG4gIGV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2V4cGFuZEJsb2JUb0ZpbGUnKTtcbiAgfVxuXG4gIC8vIERpc2NhcmQgaGlzdG9yeVxuXG4gIGNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYigpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2InKTtcbiAgfVxuXG4gIHVwZGF0ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3VwZGF0ZURpc2NhcmRIaXN0b3J5Jyk7XG4gIH1cblxuICBzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoZmlsZVBhdGhzLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3N0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icycpO1xuICB9XG5cbiAgcmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3Jlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzJyk7XG4gIH1cblxuICBwb3BEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3BvcERpc2NhcmRIaXN0b3J5Jyk7XG4gIH1cblxuICBjbGVhckRpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY2xlYXJEaXNjYXJkSGlzdG9yeScpO1xuICB9XG5cbiAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMocGF0aHMpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocycpO1xuICB9XG5cbiAgLy8gQWNjZXNzb3JzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBXaGVuIHBvc3NpYmxlLCB0aGVzZSBkZWZhdWx0IHRvIFwiZW1wdHlcIiByZXN1bHRzIHdoZW4gaW52b2tlZCBpbiBzdGF0ZXMgdGhhdCBkb24ndCBoYXZlIGluZm9ybWF0aW9uIGF2YWlsYWJsZSwgb3JcbiAgLy8gZmFpbCBpbiBhIHdheSB0aGF0J3MgY29uc2lzdGVudCB3aXRoIHRoZSByZXF1ZXN0ZWQgaW5mb3JtYXRpb24gbm90IGJlaW5nIGZvdW5kLlxuXG4gIC8vIEluZGV4IHF1ZXJpZXNcblxuICBnZXRTdGF0dXNCdW5kbGUoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICBzdGFnZWRGaWxlczoge30sXG4gICAgICB1bnN0YWdlZEZpbGVzOiB7fSxcbiAgICAgIG1lcmdlQ29uZmxpY3RGaWxlczoge30sXG4gICAgICBicmFuY2g6IHtcbiAgICAgICAgb2lkOiBudWxsLFxuICAgICAgICBoZWFkOiBudWxsLFxuICAgICAgICB1cHN0cmVhbTogbnVsbCxcbiAgICAgICAgYWhlYWRCZWhpbmQ6IHthaGVhZDogbnVsbCwgYmVoaW5kOiBudWxsfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgIHN0YWdlZEZpbGVzOiBbXSxcbiAgICAgIHVuc3RhZ2VkRmlsZXM6IFtdLFxuICAgICAgbWVyZ2VDb25mbGljdEZpbGVzOiBbXSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaEZvclBhdGgoZmlsZVBhdGgsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoTXVsdGlGaWxlUGF0Y2guY3JlYXRlTnVsbCgpKTtcbiAgfVxuXG4gIGdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG5cbiAgZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoTXVsdGlGaWxlUGF0Y2guY3JlYXRlTnVsbCgpKTtcbiAgfVxuXG4gIHJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgZmF0YWw6IFBhdGggJHtmaWxlUGF0aH0gZG9lcyBub3QgZXhpc3QgKG5laXRoZXIgb24gZGlzayBub3IgaW4gdGhlIGluZGV4KS5gKSk7XG4gIH1cblxuICAvLyBDb21taXQgYWNjZXNzXG5cbiAgZ2V0TGFzdENvbW1pdCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGxDb21taXQpO1xuICB9XG5cbiAgZ2V0Q29tbWl0KCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbENvbW1pdCk7XG4gIH1cblxuICBnZXRSZWNlbnRDb21taXRzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG5cbiAgaXNDb21taXRQdXNoZWQoc2hhKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gQXV0aG9yIGluZm9ybWF0aW9uXG5cbiAgZ2V0QXV0aG9ycygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgfVxuXG4gIC8vIEJyYW5jaGVzXG5cbiAgZ2V0QnJhbmNoZXMoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQnJhbmNoU2V0KCkpO1xuICB9XG5cbiAgZ2V0SGVhZERlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoJyhubyByZXBvc2l0b3J5KScpO1xuICB9XG5cbiAgLy8gTWVyZ2luZyBhbmQgcmViYXNpbmcgc3RhdHVzXG5cbiAgaXNNZXJnaW5nKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICB9XG5cbiAgaXNSZWJhc2luZygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgfVxuXG4gIC8vIFJlbW90ZXNcblxuICBnZXRSZW1vdGVzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IFJlbW90ZVNldChbXSkpO1xuICB9XG5cbiAgYWRkUmVtb3RlKCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2FkZFJlbW90ZScpO1xuICB9XG5cbiAgZ2V0QWhlYWRDb3VudChicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgwKTtcbiAgfVxuXG4gIGdldEJlaGluZENvdW50KGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDApO1xuICB9XG5cbiAgZ2V0Q29uZmlnKG9wdGlvbk5hbWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy53b3JrZGlybGVzc0dpdCgpLmdldENvbmZpZyhvcHRpb25OYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBibG9iIGFjY2Vzc1xuXG4gIGdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBmYXRhbDogTm90IGEgdmFsaWQgb2JqZWN0IG5hbWUgJHtzaGF9YCkpO1xuICB9XG5cbiAgLy8gRGlzY2FyZCBoaXN0b3J5XG5cbiAgaGFzRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXREaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldExhc3RIaXN0b3J5U25hcHNob3RzKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBBdG9tIHJlcG8gc3RhdGVcblxuICBnZXRPcGVyYXRpb25TdGF0ZXMoKSB7XG4gICAgcmV0dXJuIG51bGxPcGVyYXRpb25TdGF0ZXM7XG4gIH1cblxuICBzZXRDb21taXRNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdzZXRDb21taXRNZXNzYWdlJyk7XG4gIH1cblxuICBnZXRDb21taXRNZXNzYWdlKCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2ZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlJyk7XG4gIH1cblxuICAvLyBDYWNoZVxuXG4gIGdldENhY2hlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWNjZXB0SW52YWxpZGF0aW9uKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBOb24tZGVsZWdhdGVkIG1ldGhvZHMgdGhhdCBwcm92aWRlIHN1YmNsYXNzZXMgd2l0aCBjb252ZW5pZW50IGFjY2VzcyB0byBSZXBvc2l0b3J5IHByb3BlcnRpZXMuXG5cbiAgZ2l0KCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZ2l0O1xuICB9XG5cbiAgd29ya2RpcigpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCk7XG4gIH1cblxuICAvLyBDYWxsIG1ldGhvZHMgb24gdGhlIGFjdGl2ZSBSZXBvc2l0b3J5IHN0YXRlLCBldmVuIGlmIHRoZSBzdGF0ZSBoYXMgdHJhbnNpdGlvbmVkIGJlbmVhdGggeW91LlxuICAvLyBVc2UgdGhpcyB0byBwZXJmb3JtIG9wZXJhdGlvbnMgd2l0aGluIGBzdGFydCgpYCBtZXRob2RzIHRvIGd1YXJkIGFnYWluc3QgaW50ZXJydXB0ZWQgc3RhdGUgdHJhbnNpdGlvbnMuXG4gIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5zdGF0ZTtcbiAgfVxuXG4gIC8vIHBpcGVsaW5lXG4gIGV4ZWN1dGVQaXBlbGluZUFjdGlvbiguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5leGVjdXRlUGlwZWxpbmVBY3Rpb24oLi4uYXJncyk7XG4gIH1cblxuICAvLyBSZXR1cm4gYSBQcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIG9uY2UgdGhlIHN0YXRlIHRyYW5zaXRpb25zIGZyb20gTG9hZGluZy5cbiAgZ2V0TG9hZFByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5nZXRMb2FkUHJvbWlzZSgpO1xuICB9XG5cbiAgZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgfVxuXG4gIHNhdmVEaXNjYXJkSGlzdG9yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LnNhdmVEaXNjYXJkSGlzdG9yeSgpO1xuICB9XG5cbiAgLy8gSW5pdGlhdGUgYSB0cmFuc2l0aW9uIHRvIGFub3RoZXIgc3RhdGUuXG4gIHRyYW5zaXRpb25UbyhzdGF0ZU5hbWUsIC4uLnBheWxvYWQpIHtcbiAgICBjb25zdCBTdGF0ZUNvbnN0cnVjdG9yID0gc3RhdGVDb25zdHJ1Y3RvcnMuZ2V0KHN0YXRlTmFtZSk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKFN0YXRlQ29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0IHRvIHRyYW5zaXRpb24gdG8gdW5yZWNvZ25pemVkIHN0YXRlICR7c3RhdGVOYW1lfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LnRyYW5zaXRpb24odGhpcywgU3RhdGVDb25zdHJ1Y3RvciwgLi4ucGF5bG9hZCk7XG4gIH1cblxuICAvLyBFdmVudCBicm9hZGNhc3RcblxuICBkaWREZXN0cm95KCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpO1xuICB9XG5cbiAgZGlkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJyk7XG4gIH1cblxuICBkaWRHbG9iYWxseUludmFsaWRhdGUoc3BlYykge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZW1pdHRlci5lbWl0KCdkaWQtZ2xvYmFsbHktaW52YWxpZGF0ZScsIHNwZWMpO1xuICB9XG5cbiAgLy8gRGlyZWN0IGdpdCBhY2Nlc3NcbiAgLy8gTm9uLWRlbGVnYXRlZCBnaXQgb3BlcmF0aW9ucyBmb3IgaW50ZXJuYWwgdXNlIHdpdGhpbiBzdGF0ZXMuXG5cbiAgd29ya2Rpcmxlc3NHaXQoKSB7XG4gICAgLy8gV2Ugd2FudCB0byByZXBvcnQgY29uZmlnIHZhbHVlcyBmcm9tIHRoZSBnbG9iYWwgb3Igc3lzdGVtIGxldmVsLCBidXQgbmV2ZXIgbG9jYWwgb25lcyAodW5sZXNzIHdlJ3JlIGluIHRoZVxuICAgIC8vIHByZXNlbnQgc3RhdGUsIHdoaWNoIG92ZXJyaWRlcyB0aGlzKS5cbiAgICAvLyBUaGUgZmlsZXN5c3RlbSByb290IGlzIHRoZSBtb3N0IGxpa2VseSBhbmQgY29udmVuaWVudCBwbGFjZSBmb3IgdGhpcyB0byBiZSB0cnVlLlxuICAgIGNvbnN0IHtyb290fSA9IHBhdGgucGFyc2UocHJvY2Vzcy5jd2QoKSk7XG4gICAgcmV0dXJuIENvbXBvc2l0ZUdpdFN0cmF0ZWd5LmNyZWF0ZShyb290KTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGRpcmVjdFJlc29sdmVEb3RHaXREaXIoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGRpcmVjdEdldENvbmZpZyhrZXksIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBkaXJlY3RHZXRCbG9iQ29udGVudHMoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IGEgdmFsaWQgb2JqZWN0IG5hbWUnKSk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBkaXJlY3RJbml0KCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGRpcmVjdENsb25lKHJlbW90ZVVybCwgb3B0aW9ucykge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8vIERlZmVycmVkIG9wZXJhdGlvbnNcbiAgLy8gRGlyZWN0IHJhdyBnaXQgb3BlcmF0aW9ucyB0byB0aGUgY3VycmVudCBzdGF0ZSwgZXZlbiBpZiB0aGUgc3RhdGUgaGFzIGJlZW4gY2hhbmdlZC4gVXNlIHRoZXNlIG1ldGhvZHMgd2l0aGluXG4gIC8vIHN0YXJ0KCkgbWV0aG9kcy5cblxuICByZXNvbHZlRG90R2l0RGlyKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQoKS5kaXJlY3RSZXNvbHZlRG90R2l0RGlyKCk7XG4gIH1cblxuICBkb0luaXQod29ya2Rpcikge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQoKS5kaXJlY3RJbml0KCk7XG4gIH1cblxuICBkb0Nsb25lKHJlbW90ZVVybCwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQoKS5kaXJlY3RDbG9uZShyZW1vdGVVcmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gUGFyc2UgYSBEaXNjYXJkSGlzdG9yeSBwYXlsb2FkIGZyb20gdGhlIFNIQSByZWNvcmRlZCBpbiBjb25maWcuXG4gIGFzeW5jIGxvYWRIaXN0b3J5UGF5bG9hZCgpIHtcbiAgICBjb25zdCBoaXN0b3J5U2hhID0gYXdhaXQgdGhpcy5jdXJyZW50KCkuZGlyZWN0R2V0Q29uZmlnKCdhdG9tR2l0aHViLmhpc3RvcnlTaGEnKTtcbiAgICBpZiAoIWhpc3RvcnlTaGEpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBsZXQgYmxvYjtcbiAgICB0cnkge1xuICAgICAgYmxvYiA9IGF3YWl0IHRoaXMuY3VycmVudCgpLmRpcmVjdEdldEJsb2JDb250ZW50cyhoaXN0b3J5U2hhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoL05vdCBhIHZhbGlkIG9iamVjdCBuYW1lLy50ZXN0KGUuc3RkRXJyKSkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGJsb2IpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICAvLyBEZWJ1Z2dpbmcgYXNzaXN0YW5jZS5cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZShzZWxmLCBvcE5hbWUpIHtcbiAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgJHtvcE5hbWV9IGlzIG5vdCBhdmFpbGFibGUgaW4gJHtzZWxmfSBzdGF0ZWApKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFrQztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1BLGlCQUFpQixHQUFHLElBQUlDLEdBQUcsRUFBRTs7QUFFbkM7QUFDQTtBQUNBO0FBQ2UsTUFBTUMsS0FBSyxDQUFDO0VBQ3pCQyxXQUFXLENBQUNDLFVBQVUsRUFBRTtJQUN0QixJQUFJLENBQUNBLFVBQVUsR0FBR0EsVUFBVTtFQUM5QjtFQUVBLE9BQU9DLFFBQVEsQ0FBQ0MsUUFBUSxFQUFFO0lBQ3hCTixpQkFBaUIsQ0FBQ08sR0FBRyxDQUFDRCxRQUFRLENBQUNFLElBQUksRUFBRUYsUUFBUSxDQUFDO0VBQ2hEOztFQUVBO0VBQ0FHLEtBQUssR0FBRztJQUNOLE9BQU9D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