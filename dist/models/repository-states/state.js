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
  } // This state has just been entered. Perform any asynchronous initialization that needs to occur.


  start() {
    return Promise.resolve();
  } // State probe predicates ////////////////////////////////////////////////////////////////////////////////////////////
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
  } // Behavior probe predicates /////////////////////////////////////////////////////////////////////////////////////////
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
  } // Lifecycle actions /////////////////////////////////////////////////////////////////////////////////////////////////
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


  refresh() {// No-op
  }
  /* istanbul ignore next */


  observeFilesystemChange(events) {
    this.repository.refresh();
  }
  /* istanbul ignore next */


  updateCommitMessageAfterFileSystemChange() {
    // this is only used in unit tests, we don't need no stinkin coverage
    this.repository.refresh();
  } // Git operations ////////////////////////////////////////////////////////////////////////////////////////////////////
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
  } // Committing


  commit(message, options) {
    return unsupportedOperationPromise(this, 'commit');
  } // Merging


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
  } // Checkout


  checkout(revision, options = {}) {
    return unsupportedOperationPromise(this, 'checkout');
  }

  checkoutPathsAtRevision(paths, revision = 'HEAD') {
    return unsupportedOperationPromise(this, 'checkoutPathsAtRevision');
  } // Reset


  undoLastCommit() {
    return unsupportedOperationPromise(this, 'undoLastCommit');
  } // Remote interactions


  fetch(branchName) {
    return unsupportedOperationPromise(this, 'fetch');
  }

  pull(branchName) {
    return unsupportedOperationPromise(this, 'pull');
  }

  push(branchName) {
    return unsupportedOperationPromise(this, 'push');
  } // Configuration


  async setConfig(optionName, value, options = {}) {
    await this.workdirlessGit().setConfig(optionName, value, options);
    this.didUpdate();

    if (options.global) {
      this.didGloballyInvalidate(() => _keys.Keys.config.eachWithSetting(optionName));
    }
  }

  unsetConfig(option) {
    return unsupportedOperationPromise(this, 'unsetConfig');
  } // Direct blob interactions


  createBlob({
    filePath,
    stdin
  } = {}) {
    return unsupportedOperationPromise(this, 'createBlob');
  }

  expandBlobToFile(absFilePath, sha) {
    return unsupportedOperationPromise(this, 'expandBlobToFile');
  } // Discard history


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
  } // Accessors /////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  } // Commit access


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
  } // Author information


  getAuthors() {
    return Promise.resolve([]);
  } // Branches


  getBranches() {
    return Promise.resolve(new _branchSet.default());
  }

  getHeadDescription() {
    return Promise.resolve('(no repository)');
  } // Merging and rebasing status


  isMerging() {
    return Promise.resolve(false);
  }

  isRebasing() {
    return Promise.resolve(false);
  } // Remotes


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
  } // Direct blob access


  getBlobContents(sha) {
    return Promise.reject(new Error(`fatal: Not a valid object name ${sha}`));
  } // Discard history


  hasDiscardHistory(partialDiscardFilePath = null) {
    return false;
  }

  getDiscardHistory(partialDiscardFilePath = null) {
    return [];
  }

  getLastHistorySnapshots(partialDiscardFilePath = null) {
    return null;
  } // Atom repo state


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
  } // Cache


  getCache() {
    return null;
  }

  acceptInvalidation() {
    return null;
  } // Internal //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Non-delegated methods that provide subclasses with convenient access to Repository properties.


  git() {
    return this.repository.git;
  }

  workdir() {
    return this.repository.getWorkingDirectoryPath();
  } // Call methods on the active Repository state, even if the state has transitioned beneath you.
  // Use this to perform operations within `start()` methods to guard against interrupted state transitions.


  current() {
    return this.repository.state;
  } // pipeline


  executePipelineAction(...args) {
    return this.repository.executePipelineAction(...args);
  } // Return a Promise that will resolve once the state transitions from Loading.


  getLoadPromise() {
    return this.repository.getLoadPromise();
  }

  getRemoteForBranch(branchName) {
    return this.repository.getRemoteForBranch(branchName);
  }

  saveDiscardHistory() {
    return this.repository.saveDiscardHistory();
  } // Initiate a transition to another state.


  transitionTo(stateName, ...payload) {
    const StateConstructor = stateConstructors.get(stateName);
    /* istanbul ignore if */

    if (StateConstructor === undefined) {
      throw new Error(`Attempt to transition to unrecognized state ${stateName}`);
    }

    return this.repository.transition(this, StateConstructor, ...payload);
  } // Event broadcast


  didDestroy() {
    return this.repository.emitter.emit('did-destroy');
  }

  didUpdate() {
    return this.repository.emitter.emit('did-update');
  }

  didGloballyInvalidate(spec) {
    return this.repository.emitter.emit('did-globally-invalidate', spec);
  } // Direct git access
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
  } // Deferred operations
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
  } // Parse a DiscardHistory payload from the SHA recorded in config.


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
  } // Debugging assistance.


  toString() {
    return this.constructor.name;
  }

}

exports.default = State;

function unsupportedOperationPromise(self, opName) {
  return Promise.reject(new Error(`${opName} is not available in ${self} state`));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvc3RhdGUuanMiXSwibmFtZXMiOlsic3RhdGVDb25zdHJ1Y3RvcnMiLCJNYXAiLCJTdGF0ZSIsImNvbnN0cnVjdG9yIiwicmVwb3NpdG9yeSIsInJlZ2lzdGVyIiwiU3ViY2xhc3MiLCJzZXQiLCJuYW1lIiwic3RhcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImlzTG9hZGluZ0d1ZXNzIiwiaXNBYnNlbnRHdWVzcyIsImlzQWJzZW50IiwiaXNMb2FkaW5nIiwiaXNFbXB0eSIsImlzUHJlc2VudCIsImlzVG9vTGFyZ2UiLCJpc0Rlc3Ryb3llZCIsImlzVW5kZXRlcm1pbmVkIiwic2hvd0dpdFRhYkluaXQiLCJzaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MiLCJzaG93R2l0VGFiTG9hZGluZyIsInNob3dTdGF0dXNCYXJUaWxlcyIsImhhc0RpcmVjdG9yeSIsImlzUHVibGlzaGFibGUiLCJpbml0IiwidW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlIiwiY2xvbmUiLCJyZW1vdGVVcmwiLCJkZXN0cm95IiwidHJhbnNpdGlvblRvIiwicmVmcmVzaCIsIm9ic2VydmVGaWxlc3lzdGVtQ2hhbmdlIiwiZXZlbnRzIiwidXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZSIsInN0YWdlRmlsZXMiLCJwYXRocyIsInVuc3RhZ2VGaWxlcyIsInN0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0IiwiYXBwbHlQYXRjaFRvSW5kZXgiLCJwYXRjaCIsImFwcGx5UGF0Y2hUb1dvcmtkaXIiLCJjb21taXQiLCJtZXNzYWdlIiwib3B0aW9ucyIsIm1lcmdlIiwiYnJhbmNoTmFtZSIsImFib3J0TWVyZ2UiLCJjaGVja291dFNpZGUiLCJzaWRlIiwibWVyZ2VGaWxlIiwib3Vyc1BhdGgiLCJjb21tb25CYXNlUGF0aCIsInRoZWlyc1BhdGgiLCJyZXN1bHRQYXRoIiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsImZpbGVQYXRoIiwiY29tbW9uQmFzZVNoYSIsIm91cnNTaGEiLCJ0aGVpcnNTaGEiLCJjaGVja291dCIsInJldmlzaW9uIiwiY2hlY2tvdXRQYXRoc0F0UmV2aXNpb24iLCJ1bmRvTGFzdENvbW1pdCIsImZldGNoIiwicHVsbCIsInB1c2giLCJzZXRDb25maWciLCJvcHRpb25OYW1lIiwidmFsdWUiLCJ3b3JrZGlybGVzc0dpdCIsImRpZFVwZGF0ZSIsImdsb2JhbCIsImRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsIktleXMiLCJjb25maWciLCJlYWNoV2l0aFNldHRpbmciLCJ1bnNldENvbmZpZyIsIm9wdGlvbiIsImNyZWF0ZUJsb2IiLCJzdGRpbiIsImV4cGFuZEJsb2JUb0ZpbGUiLCJhYnNGaWxlUGF0aCIsInNoYSIsImNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYiIsInVwZGF0ZURpc2NhcmRIaXN0b3J5Iiwic3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzIiwiZmlsZVBhdGhzIiwiaXNTYWZlIiwiZGVzdHJ1Y3RpdmVBY3Rpb24iLCJwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoIiwicmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMiLCJwb3BEaXNjYXJkSGlzdG9yeSIsImNsZWFyRGlzY2FyZEhpc3RvcnkiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsImdldFN0YXR1c0J1bmRsZSIsInN0YWdlZEZpbGVzIiwidW5zdGFnZWRGaWxlcyIsIm1lcmdlQ29uZmxpY3RGaWxlcyIsImJyYW5jaCIsIm9pZCIsImhlYWQiLCJ1cHN0cmVhbSIsImFoZWFkQmVoaW5kIiwiYWhlYWQiLCJiZWhpbmQiLCJnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcyIsImdldEZpbGVQYXRjaEZvclBhdGgiLCJNdWx0aUZpbGVQYXRjaCIsImNyZWF0ZU51bGwiLCJnZXREaWZmc0ZvckZpbGVQYXRoIiwiZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoIiwicmVhZEZpbGVGcm9tSW5kZXgiLCJyZWplY3QiLCJFcnJvciIsImdldExhc3RDb21taXQiLCJudWxsQ29tbWl0IiwiZ2V0Q29tbWl0IiwiZ2V0UmVjZW50Q29tbWl0cyIsImlzQ29tbWl0UHVzaGVkIiwiZ2V0QXV0aG9ycyIsImdldEJyYW5jaGVzIiwiQnJhbmNoU2V0IiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiaXNNZXJnaW5nIiwiaXNSZWJhc2luZyIsImdldFJlbW90ZXMiLCJSZW1vdGVTZXQiLCJhZGRSZW1vdGUiLCJnZXRBaGVhZENvdW50IiwiZ2V0QmVoaW5kQ291bnQiLCJnZXRDb25maWciLCJnZXRCbG9iQ29udGVudHMiLCJoYXNEaXNjYXJkSGlzdG9yeSIsImdldERpc2NhcmRIaXN0b3J5IiwiZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMiLCJnZXRPcGVyYXRpb25TdGF0ZXMiLCJudWxsT3BlcmF0aW9uU3RhdGVzIiwic2V0Q29tbWl0TWVzc2FnZSIsImdldENvbW1pdE1lc3NhZ2UiLCJmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSIsImdldENhY2hlIiwiYWNjZXB0SW52YWxpZGF0aW9uIiwiZ2l0Iiwid29ya2RpciIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiY3VycmVudCIsInN0YXRlIiwiZXhlY3V0ZVBpcGVsaW5lQWN0aW9uIiwiYXJncyIsImdldExvYWRQcm9taXNlIiwiZ2V0UmVtb3RlRm9yQnJhbmNoIiwic2F2ZURpc2NhcmRIaXN0b3J5Iiwic3RhdGVOYW1lIiwicGF5bG9hZCIsIlN0YXRlQ29uc3RydWN0b3IiLCJnZXQiLCJ1bmRlZmluZWQiLCJ0cmFuc2l0aW9uIiwiZGlkRGVzdHJveSIsImVtaXR0ZXIiLCJlbWl0Iiwic3BlYyIsInJvb3QiLCJwYXRoIiwicGFyc2UiLCJwcm9jZXNzIiwiY3dkIiwiQ29tcG9zaXRlR2l0U3RyYXRlZ3kiLCJjcmVhdGUiLCJkaXJlY3RSZXNvbHZlRG90R2l0RGlyIiwiZGlyZWN0R2V0Q29uZmlnIiwia2V5IiwiZGlyZWN0R2V0QmxvYkNvbnRlbnRzIiwiZGlyZWN0SW5pdCIsImRpcmVjdENsb25lIiwicmVzb2x2ZURvdEdpdERpciIsImRvSW5pdCIsImRvQ2xvbmUiLCJsb2FkSGlzdG9yeVBheWxvYWQiLCJoaXN0b3J5U2hhIiwiYmxvYiIsImUiLCJ0ZXN0Iiwic3RkRXJyIiwiSlNPTiIsInRvU3RyaW5nIiwic2VsZiIsIm9wTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxpQkFBaUIsR0FBRyxJQUFJQyxHQUFKLEVBQTFCO0FBRUE7QUFDQTtBQUNBOztBQUNlLE1BQU1DLEtBQU4sQ0FBWTtBQUN6QkMsRUFBQUEsV0FBVyxDQUFDQyxVQUFELEVBQWE7QUFDdEIsU0FBS0EsVUFBTCxHQUFrQkEsVUFBbEI7QUFDRDs7QUFFYyxTQUFSQyxRQUFRLENBQUNDLFFBQUQsRUFBVztBQUN4Qk4sSUFBQUEsaUJBQWlCLENBQUNPLEdBQWxCLENBQXNCRCxRQUFRLENBQUNFLElBQS9CLEVBQXFDRixRQUFyQztBQUNELEdBUHdCLENBU3pCOzs7QUFDQUcsRUFBQUEsS0FBSyxHQUFHO0FBQ04sV0FBT0MsT0FBTyxDQUFDQyxPQUFSLEVBQVA7QUFDRCxHQVp3QixDQWN6QjtBQUNBOzs7QUFFQUMsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsV0FBTyxLQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLGFBQWEsR0FBRztBQUNkLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxFQUFBQSxRQUFRLEdBQUc7QUFDVCxXQUFPLEtBQVA7QUFDRDs7QUFFREMsRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FBTyxLQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLE9BQU8sR0FBRztBQUNSLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxFQUFBQSxTQUFTLEdBQUc7QUFDVixXQUFPLEtBQVA7QUFDRDs7QUFFREMsRUFBQUEsVUFBVSxHQUFHO0FBQ1gsV0FBTyxLQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLFdBQVcsR0FBRztBQUNaLFdB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QXBnQndCLENBc2dCekI7OztBQUN3QixRQUFsQnVJLGtCQUFrQixHQUFHO0FBQ3pCLFVBQU1DLFVBQVUsR0FBRyxNQUFNLEtBQUtsQyxPQUFMLEdBQWV5QixlQUFmLENBQStCLHVCQUEvQixDQUF6Qjs7QUFDQSxRQUFJLENBQUNTLFVBQUwsRUFBaUI7QUFDZixhQUFPLEVBQVA7QUFDRDs7QUFFRCxRQUFJQyxJQUFKOztBQUNBLFFBQUk7QUFDRkEsTUFBQUEsSUFBSSxHQUFHLE1BQU0sS0FBS25DLE9BQUwsR0FBZTJCLHFCQUFmLENBQXFDTyxVQUFyQyxDQUFiO0FBQ0QsS0FGRCxDQUVFLE9BQU9FLENBQVAsRUFBVTtBQUNWLFVBQUksMEJBQTBCQyxJQUExQixDQUErQkQsQ0FBQyxDQUFDRSxNQUFqQyxDQUFKLEVBQThDO0FBQzVDLGVBQU8sRUFBUDtBQUNEOztBQUVELFlBQU1GLENBQU47QUFDRDs7QUFFRCxRQUFJO0FBQ0YsYUFBT0csSUFBSSxDQUFDcEIsS0FBTCxDQUFXZ0IsSUFBWCxDQUFQO0FBQ0QsS0FGRCxDQUVFLE9BQU9DLENBQVAsRUFBVTtBQUNWLGFBQU8sRUFBUDtBQUNEO0FBQ0YsR0E3aEJ3QixDQStoQnpCOzs7QUFFQUksRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxLQUFLekwsV0FBTCxDQUFpQkssSUFBeEI7QUFDRDs7QUFuaUJ3Qjs7OztBQXNpQjNCLFNBQVNvQiwyQkFBVCxDQUFxQ2lLLElBQXJDLEVBQTJDQyxNQUEzQyxFQUFtRDtBQUNqRCxTQUFPcEwsT0FBTyxDQUFDeUcsTUFBUixDQUFlLElBQUlDLEtBQUosQ0FBVyxHQUFFMEUsTUFBTyx3QkFBdUJELElBQUssUUFBaEQsQ0FBZixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7bnVsbENvbW1pdH0gZnJvbSAnLi4vY29tbWl0JztcbmltcG9ydCBCcmFuY2hTZXQgZnJvbSAnLi4vYnJhbmNoLXNldCc7XG5pbXBvcnQgUmVtb3RlU2V0IGZyb20gJy4uL3JlbW90ZS1zZXQnO1xuaW1wb3J0IHtudWxsT3BlcmF0aW9uU3RhdGVzfSBmcm9tICcuLi9vcGVyYXRpb24tc3RhdGVzJztcbmltcG9ydCBNdWx0aUZpbGVQYXRjaCBmcm9tICcuLi9wYXRjaC9tdWx0aS1maWxlLXBhdGNoJztcbmltcG9ydCBDb21wb3NpdGVHaXRTdHJhdGVneSBmcm9tICcuLi8uLi9jb21wb3NpdGUtZ2l0LXN0cmF0ZWd5JztcbmltcG9ydCB7S2V5c30gZnJvbSAnLi9jYWNoZS9rZXlzJztcblxuLyoqXG4gKiBNYXAgb2YgcmVnaXN0ZXJlZCBzdWJjbGFzc2VzIHRvIGFsbG93IHN0YXRlcyB0byB0cmFuc2l0aW9uIHRvIG9uZSBhbm90aGVyIHdpdGhvdXQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICogU3ViY2xhc3NlcyBvZiBTdGF0ZSBzaG91bGQgY2FsbCBgU3RhdGUucmVnaXN0ZXJgIHRvIGFkZCB0aGVtc2VsdmVzIGhlcmUuXG4gKi9cbmNvbnN0IHN0YXRlQ29uc3RydWN0b3JzID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFJlcG9zaXRvcnkgc3RhdGVzLiBJbXBsZW1lbnRzIGRlZmF1bHQgXCJudWxsXCIgYmVoYXZpb3IuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRlIHtcbiAgY29uc3RydWN0b3IocmVwb3NpdG9yeSkge1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHJlcG9zaXRvcnk7XG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXIoU3ViY2xhc3MpIHtcbiAgICBzdGF0ZUNvbnN0cnVjdG9ycy5zZXQoU3ViY2xhc3MubmFtZSwgU3ViY2xhc3MpO1xuICB9XG5cbiAgLy8gVGhpcyBzdGF0ZSBoYXMganVzdCBiZWVuIGVudGVyZWQuIFBlcmZvcm0gYW55IGFzeW5jaHJvbm91cyBpbml0aWFsaXphdGlvbiB0aGF0IG5lZWRzIHRvIG9jY3VyLlxuICBzdGFydCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICAvLyBTdGF0ZSBwcm9iZSBwcmVkaWNhdGVzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIEFsbG93IGV4dGVybmFsIGNhbGxlcnMgdG8gaWRlbnRpZnkgd2hpY2ggc3RhdGUgYSBSZXBvc2l0b3J5IGlzIGluIGlmIG5lY2Vzc2FyeS5cblxuICBpc0xvYWRpbmdHdWVzcygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0Fic2VudEd1ZXNzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzQWJzZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzTG9hZGluZygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1Rvb0xhcmdlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGVzdHJveWVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEJlaGF2aW9yIHByb2JlIHByZWRpY2F0ZXMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gRGV0ZXJtaW5lIHNwZWNpZmljIHJlbmRlcmluZyBiZWhhdmlvciBiYXNlZCBvbiB0aGUgY3VycmVudCBzdGF0ZS5cblxuICBpc1VuZGV0ZXJtaW5lZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzaG93R2l0VGFiSW5pdCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2hvd0dpdFRhYkxvYWRpbmcoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2hvd1N0YXR1c0JhclRpbGVzKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhc0RpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzUHVibGlzaGFibGUoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gTGlmZWN5Y2xlIGFjdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBUaGVzZSBnZW5lcmFsbHkgZGVmYXVsdCB0byByZWplY3RpbmcgYSBQcm9taXNlIHdpdGggYW4gZXJyb3IuXG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdpbml0Jyk7XG4gIH1cblxuICBjbG9uZShyZW1vdGVVcmwpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjbG9uZScpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uVG8oJ0Rlc3Ryb3llZCcpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgcmVmcmVzaCgpIHtcbiAgICAvLyBOby1vcFxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgb2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UoZXZlbnRzKSB7XG4gICAgdGhpcy5yZXBvc2l0b3J5LnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHVwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UoKSB7XG4gICAgLy8gdGhpcyBpcyBvbmx5IHVzZWQgaW4gdW5pdCB0ZXN0cywgd2UgZG9uJ3QgbmVlZCBubyBzdGlua2luIGNvdmVyYWdlXG4gICAgdGhpcy5yZXBvc2l0b3J5LnJlZnJlc2goKTtcbiAgfVxuXG4gIC8vIEdpdCBvcGVyYXRpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8gVGhlc2UgZGVmYXVsdCB0byByZWplY3RpbmcgYSBQcm9taXNlIHdpdGggYW4gZXJyb3Igc3RhdGluZyB0aGF0IHRoZSBvcGVyYXRpb24gaXMgbm90IHN1cHBvcnRlZCBpbiB0aGUgY3VycmVudFxuICAvLyBzdGF0ZS5cblxuICAvLyBTdGFnaW5nIGFuZCB1bnN0YWdpbmdcblxuICBzdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnc3RhZ2VGaWxlcycpO1xuICB9XG5cbiAgdW5zdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAndW5zdGFnZUZpbGVzJyk7XG4gIH1cblxuICBzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdChwYXRocykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3N0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0Jyk7XG4gIH1cblxuICBhcHBseVBhdGNoVG9JbmRleChwYXRjaCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2FwcGx5UGF0Y2hUb0luZGV4Jyk7XG4gIH1cblxuICBhcHBseVBhdGNoVG9Xb3JrZGlyKHBhdGNoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnYXBwbHlQYXRjaFRvV29ya2RpcicpO1xuICB9XG5cbiAgLy8gQ29tbWl0dGluZ1xuXG4gIGNvbW1pdChtZXNzYWdlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY29tbWl0Jyk7XG4gIH1cblxuICAvLyBNZXJnaW5nXG5cbiAgbWVyZ2UoYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ21lcmdlJyk7XG4gIH1cblxuICBhYm9ydE1lcmdlKCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2Fib3J0TWVyZ2UnKTtcbiAgfVxuXG4gIGNoZWNrb3V0U2lkZShzaWRlLCBwYXRocykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NoZWNrb3V0U2lkZScpO1xuICB9XG5cbiAgbWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ21lcmdlRmlsZScpO1xuICB9XG5cbiAgd3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnd3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCcpO1xuICB9XG5cbiAgLy8gQ2hlY2tvdXRcblxuICBjaGVja291dChyZXZpc2lvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY2hlY2tvdXQnKTtcbiAgfVxuXG4gIGNoZWNrb3V0UGF0aHNBdFJldmlzaW9uKHBhdGhzLCByZXZpc2lvbiA9ICdIRUFEJykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NoZWNrb3V0UGF0aHNBdFJldmlzaW9uJyk7XG4gIH1cblxuICAvLyBSZXNldFxuXG4gIHVuZG9MYXN0Q29tbWl0KCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3VuZG9MYXN0Q29tbWl0Jyk7XG4gIH1cblxuICAvLyBSZW1vdGUgaW50ZXJhY3Rpb25zXG5cbiAgZmV0Y2goYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2ZldGNoJyk7XG4gIH1cblxuICBwdWxsKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdwdWxsJyk7XG4gIH1cblxuICBwdXNoKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdwdXNoJyk7XG4gIH1cblxuICAvLyBDb25maWd1cmF0aW9uXG5cbiAgYXN5bmMgc2V0Q29uZmlnKG9wdGlvbk5hbWUsIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICBhd2FpdCB0aGlzLndvcmtkaXJsZXNzR2l0KCkuc2V0Q29uZmlnKG9wdGlvbk5hbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIGlmIChvcHRpb25zLmdsb2JhbCkge1xuICAgICAgdGhpcy5kaWRHbG9iYWxseUludmFsaWRhdGUoKCkgPT4gS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKG9wdGlvbk5hbWUpKTtcbiAgICB9XG4gIH1cblxuICB1bnNldENvbmZpZyhvcHRpb24pIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICd1bnNldENvbmZpZycpO1xuICB9XG5cbiAgLy8gRGlyZWN0IGJsb2IgaW50ZXJhY3Rpb25zXG5cbiAgY3JlYXRlQmxvYih7ZmlsZVBhdGgsIHN0ZGlufSA9IHt9KSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnY3JlYXRlQmxvYicpO1xuICB9XG5cbiAgZXhwYW5kQmxvYlRvRmlsZShhYnNGaWxlUGF0aCwgc2hhKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnZXhwYW5kQmxvYlRvRmlsZScpO1xuICB9XG5cbiAgLy8gRGlzY2FyZCBoaXN0b3J5XG5cbiAgY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iKCkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2NyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYicpO1xuICB9XG5cbiAgdXBkYXRlRGlzY2FyZEhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAndXBkYXRlRGlzY2FyZEhpc3RvcnknKTtcbiAgfVxuXG4gIHN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhmaWxlUGF0aHMsIGlzU2FmZSwgZGVzdHJ1Y3RpdmVBY3Rpb24sIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzJyk7XG4gIH1cblxuICByZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyhpc1NhZmUsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAncmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMnKTtcbiAgfVxuXG4gIHBvcERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAncG9wRGlzY2FyZEhpc3RvcnknKTtcbiAgfVxuXG4gIGNsZWFyRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHRoaXMsICdjbGVhckRpc2NhcmRIaXN0b3J5Jyk7XG4gIH1cblxuICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhwYXRocykge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ2Rpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzJyk7XG4gIH1cblxuICAvLyBBY2Nlc3NvcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIFdoZW4gcG9zc2libGUsIHRoZXNlIGRlZmF1bHQgdG8gXCJlbXB0eVwiIHJlc3VsdHMgd2hlbiBpbnZva2VkIGluIHN0YXRlcyB0aGF0IGRvbid0IGhhdmUgaW5mb3JtYXRpb24gYXZhaWxhYmxlLCBvclxuICAvLyBmYWlsIGluIGEgd2F5IHRoYXQncyBjb25zaXN0ZW50IHdpdGggdGhlIHJlcXVlc3RlZCBpbmZvcm1hdGlvbiBub3QgYmVpbmcgZm91bmQuXG5cbiAgLy8gSW5kZXggcXVlcmllc1xuXG4gIGdldFN0YXR1c0J1bmRsZSgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgIHN0YWdlZEZpbGVzOiB7fSxcbiAgICAgIHVuc3RhZ2VkRmlsZXM6IHt9LFxuICAgICAgbWVyZ2VDb25mbGljdEZpbGVzOiB7fSxcbiAgICAgIGJyYW5jaDoge1xuICAgICAgICBvaWQ6IG51bGwsXG4gICAgICAgIGhlYWQ6IG51bGwsXG4gICAgICAgIHVwc3RyZWFtOiBudWxsLFxuICAgICAgICBhaGVhZEJlaGluZDoge2FoZWFkOiBudWxsLCBiZWhpbmQ6IG51bGx9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgc3RhZ2VkRmlsZXM6IFtdLFxuICAgICAgdW5zdGFnZWRGaWxlczogW10sXG4gICAgICBtZXJnZUNvbmZsaWN0RmlsZXM6IFtdLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGNoRm9yUGF0aChmaWxlUGF0aCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShNdWx0aUZpbGVQYXRjaC5jcmVhdGVOdWxsKCkpO1xuICB9XG5cbiAgZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gIH1cblxuICBnZXRTdGFnZWRDaGFuZ2VzUGF0Y2goKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShNdWx0aUZpbGVQYXRjaC5jcmVhdGVOdWxsKCkpO1xuICB9XG5cbiAgcmVhZEZpbGVGcm9tSW5kZXgoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGBmYXRhbDogUGF0aCAke2ZpbGVQYXRofSBkb2VzIG5vdCBleGlzdCAobmVpdGhlciBvbiBkaXNrIG5vciBpbiB0aGUgaW5kZXgpLmApKTtcbiAgfVxuXG4gIC8vIENvbW1pdCBhY2Nlc3NcblxuICBnZXRMYXN0Q29tbWl0KCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbENvbW1pdCk7XG4gIH1cblxuICBnZXRDb21taXQoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsQ29tbWl0KTtcbiAgfVxuXG4gIGdldFJlY2VudENvbW1pdHMoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gIH1cblxuICBpc0NvbW1pdFB1c2hlZChzaGEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBBdXRob3IgaW5mb3JtYXRpb25cblxuICBnZXRBdXRob3JzKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG5cbiAgLy8gQnJhbmNoZXNcblxuICBnZXRCcmFuY2hlcygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCcmFuY2hTZXQoKSk7XG4gIH1cblxuICBnZXRIZWFkRGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgnKG5vIHJlcG9zaXRvcnkpJyk7XG4gIH1cblxuICAvLyBNZXJnaW5nIGFuZCByZWJhc2luZyBzdGF0dXNcblxuICBpc01lcmdpbmcoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gIH1cblxuICBpc1JlYmFzaW5nKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICB9XG5cbiAgLy8gUmVtb3Rlc1xuXG4gIGdldFJlbW90ZXMoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgUmVtb3RlU2V0KFtdKSk7XG4gIH1cblxuICBhZGRSZW1vdGUoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnYWRkUmVtb3RlJyk7XG4gIH1cblxuICBnZXRBaGVhZENvdW50KGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDApO1xuICB9XG5cbiAgZ2V0QmVoaW5kQ291bnQoYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoMCk7XG4gIH1cblxuICBnZXRDb25maWcob3B0aW9uTmFtZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLndvcmtkaXJsZXNzR2l0KCkuZ2V0Q29uZmlnKG9wdGlvbk5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gRGlyZWN0IGJsb2IgYWNjZXNzXG5cbiAgZ2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYGZhdGFsOiBOb3QgYSB2YWxpZCBvYmplY3QgbmFtZSAke3NoYX1gKSk7XG4gIH1cblxuICAvLyBEaXNjYXJkIGhpc3RvcnlcblxuICBoYXNEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEF0b20gcmVwbyBzdGF0ZVxuXG4gIGdldE9wZXJhdGlvblN0YXRlcygpIHtcbiAgICByZXR1cm4gbnVsbE9wZXJhdGlvblN0YXRlcztcbiAgfVxuXG4gIHNldENvbW1pdE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiB1bnN1cHBvcnRlZE9wZXJhdGlvblByb21pc2UodGhpcywgJ3NldENvbW1pdE1lc3NhZ2UnKTtcbiAgfVxuXG4gIGdldENvbW1pdE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHVuc3VwcG9ydGVkT3BlcmF0aW9uUHJvbWlzZSh0aGlzLCAnZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUnKTtcbiAgfVxuXG4gIC8vIENhY2hlXG5cbiAgZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhY2NlcHRJbnZhbGlkYXRpb24oKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBJbnRlcm5hbCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIE5vbi1kZWxlZ2F0ZWQgbWV0aG9kcyB0aGF0IHByb3ZpZGUgc3ViY2xhc3NlcyB3aXRoIGNvbnZlbmllbnQgYWNjZXNzIHRvIFJlcG9zaXRvcnkgcHJvcGVydGllcy5cblxuICBnaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5naXQ7XG4gIH1cblxuICB3b3JrZGlyKCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgfVxuXG4gIC8vIENhbGwgbWV0aG9kcyBvbiB0aGUgYWN0aXZlIFJlcG9zaXRvcnkgc3RhdGUsIGV2ZW4gaWYgdGhlIHN0YXRlIGhhcyB0cmFuc2l0aW9uZWQgYmVuZWF0aCB5b3UuXG4gIC8vIFVzZSB0aGlzIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyB3aXRoaW4gYHN0YXJ0KClgIG1ldGhvZHMgdG8gZ3VhcmQgYWdhaW5zdCBpbnRlcnJ1cHRlZCBzdGF0ZSB0cmFuc2l0aW9ucy5cbiAgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LnN0YXRlO1xuICB9XG5cbiAgLy8gcGlwZWxpbmVcbiAgZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmV4ZWN1dGVQaXBlbGluZUFjdGlvbiguLi5hcmdzKTtcbiAgfVxuXG4gIC8vIFJldHVybiBhIFByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgb25jZSB0aGUgc3RhdGUgdHJhbnNpdGlvbnMgZnJvbSBMb2FkaW5nLlxuICBnZXRMb2FkUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBvc2l0b3J5LmdldExvYWRQcm9taXNlKCk7XG4gIH1cblxuICBnZXRSZW1vdGVGb3JCcmFuY2goYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpO1xuICB9XG5cbiAgc2F2ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gIH1cblxuICAvLyBJbml0aWF0ZSBhIHRyYW5zaXRpb24gdG8gYW5vdGhlciBzdGF0ZS5cbiAgdHJhbnNpdGlvblRvKHN0YXRlTmFtZSwgLi4ucGF5bG9hZCkge1xuICAgIGNvbnN0IFN0YXRlQ29uc3RydWN0b3IgPSBzdGF0ZUNvbnN0cnVjdG9ycy5nZXQoc3RhdGVOYW1lKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoU3RhdGVDb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHQgdG8gdHJhbnNpdGlvbiB0byB1bnJlY29nbml6ZWQgc3RhdGUgJHtzdGF0ZU5hbWV9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlcG9zaXRvcnkudHJhbnNpdGlvbih0aGlzLCBTdGF0ZUNvbnN0cnVjdG9yLCAuLi5wYXlsb2FkKTtcbiAgfVxuXG4gIC8vIEV2ZW50IGJyb2FkY2FzdFxuXG4gIGRpZERlc3Ryb3koKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95Jyk7XG4gIH1cblxuICBkaWRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKTtcbiAgfVxuXG4gIGRpZEdsb2JhbGx5SW52YWxpZGF0ZShzcGVjKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3NpdG9yeS5lbWl0dGVyLmVtaXQoJ2RpZC1nbG9iYWxseS1pbnZhbGlkYXRlJywgc3BlYyk7XG4gIH1cblxuICAvLyBEaXJlY3QgZ2l0IGFjY2Vzc1xuICAvLyBOb24tZGVsZWdhdGVkIGdpdCBvcGVyYXRpb25zIGZvciBpbnRlcm5hbCB1c2Ugd2l0aGluIHN0YXRlcy5cblxuICB3b3JrZGlybGVzc0dpdCgpIHtcbiAgICAvLyBXZSB3YW50IHRvIHJlcG9ydCBjb25maWcgdmFsdWVzIGZyb20gdGhlIGdsb2JhbCBvciBzeXN0ZW0gbGV2ZWwsIGJ1dCBuZXZlciBsb2NhbCBvbmVzICh1bmxlc3Mgd2UncmUgaW4gdGhlXG4gICAgLy8gcHJlc2VudCBzdGF0ZSwgd2hpY2ggb3ZlcnJpZGVzIHRoaXMpLlxuICAgIC8vIFRoZSBmaWxlc3lzdGVtIHJvb3QgaXMgdGhlIG1vc3QgbGlrZWx5IGFuZCBjb252ZW5pZW50IHBsYWNlIGZvciB0aGlzIHRvIGJlIHRydWUuXG4gICAgY29uc3Qge3Jvb3R9ID0gcGF0aC5wYXJzZShwcm9jZXNzLmN3ZCgpKTtcbiAgICByZXR1cm4gQ29tcG9zaXRlR2l0U3RyYXRlZ3kuY3JlYXRlKHJvb3QpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZGlyZWN0UmVzb2x2ZURvdEdpdERpcigpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZGlyZWN0R2V0Q29uZmlnKGtleSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGRpcmVjdEdldEJsb2JDb250ZW50cygpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgYSB2YWxpZCBvYmplY3QgbmFtZScpKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGRpcmVjdEluaXQoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZGlyZWN0Q2xvbmUocmVtb3RlVXJsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgLy8gRGVmZXJyZWQgb3BlcmF0aW9uc1xuICAvLyBEaXJlY3QgcmF3IGdpdCBvcGVyYXRpb25zIHRvIHRoZSBjdXJyZW50IHN0YXRlLCBldmVuIGlmIHRoZSBzdGF0ZSBoYXMgYmVlbiBjaGFuZ2VkLiBVc2UgdGhlc2UgbWV0aG9kcyB3aXRoaW5cbiAgLy8gc3RhcnQoKSBtZXRob2RzLlxuXG4gIHJlc29sdmVEb3RHaXREaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCgpLmRpcmVjdFJlc29sdmVEb3RHaXREaXIoKTtcbiAgfVxuXG4gIGRvSW5pdCh3b3JrZGlyKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCgpLmRpcmVjdEluaXQoKTtcbiAgfVxuXG4gIGRvQ2xvbmUocmVtb3RlVXJsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCgpLmRpcmVjdENsb25lKHJlbW90ZVVybCwgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBQYXJzZSBhIERpc2NhcmRIaXN0b3J5IHBheWxvYWQgZnJvbSB0aGUgU0hBIHJlY29yZGVkIGluIGNvbmZpZy5cbiAgYXN5bmMgbG9hZEhpc3RvcnlQYXlsb2FkKCkge1xuICAgIGNvbnN0IGhpc3RvcnlTaGEgPSBhd2FpdCB0aGlzLmN1cnJlbnQoKS5kaXJlY3RHZXRDb25maWcoJ2F0b21HaXRodWIuaGlzdG9yeVNoYScpO1xuICAgIGlmICghaGlzdG9yeVNoYSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGxldCBibG9iO1xuICAgIHRyeSB7XG4gICAgICBibG9iID0gYXdhaXQgdGhpcy5jdXJyZW50KCkuZGlyZWN0R2V0QmxvYkNvbnRlbnRzKGhpc3RvcnlTaGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICgvTm90IGEgdmFsaWQgb2JqZWN0IG5hbWUvLnRlc3QoZS5zdGRFcnIpKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYmxvYik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYnVnZ2luZyBhc3Npc3RhbmNlLlxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdXBwb3J0ZWRPcGVyYXRpb25Qcm9taXNlKHNlbGYsIG9wTmFtZSkge1xuICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGAke29wTmFtZX0gaXMgbm90IGF2YWlsYWJsZSBpbiAke3NlbGZ9IHN0YXRlYCkpO1xufVxuIl19