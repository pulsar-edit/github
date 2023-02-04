"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _atom = require("atom");
var _gitTabView = _interopRequireDefault(require("../views/git-tab-view"));
var _userStore = _interopRequireDefault(require("../models/user-store"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GitTabController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "attemptStageAllOperation", stageStatus => {
      return this.attemptFileStageOperation(['.'], stageStatus);
    });
    _defineProperty(this, "attemptFileStageOperation", (filePaths, stageStatus) => {
      if (this.stagingOperationInProgress) {
        return {
          stageOperationPromise: Promise.resolve(),
          selectionUpdatePromise: Promise.resolve()
        };
      }
      this.stagingOperationInProgress = true;
      const fileListUpdatePromise = this.refStagingView.map(view => {
        return view.getNextListUpdatePromise();
      }).getOr(Promise.resolve());
      let stageOperationPromise;
      if (stageStatus === 'staged') {
        stageOperationPromise = this.unstageFiles(filePaths);
      } else {
        stageOperationPromise = this.stageFiles(filePaths);
      }
      const selectionUpdatePromise = fileListUpdatePromise.then(() => {
        this.stagingOperationInProgress = false;
      });
      return {
        stageOperationPromise,
        selectionUpdatePromise
      };
    });
    _defineProperty(this, "prepareToCommit", async () => {
      return !(await this.props.ensureGitTab());
    });
    _defineProperty(this, "commit", (message, options) => {
      return this.props.repository.commit(message, options);
    });
    _defineProperty(this, "updateSelectedCoAuthors", (selectedCoAuthors, newAuthor) => {
      if (newAuthor) {
        this.userStore.addUsers([newAuthor]);
        selectedCoAuthors = selectedCoAuthors.concat([newAuthor]);
      }
      this.setState({
        selectedCoAuthors
      });
    });
    _defineProperty(this, "undoLastCommit", async () => {
      const repo = this.props.repository;
      const lastCommit = await repo.getLastCommit();
      if (lastCommit.isUnbornRef()) {
        return null;
      }
      await repo.undoLastCommit();
      repo.setCommitMessage(lastCommit.getFullMessage());
      this.updateSelectedCoAuthors(lastCommit.getCoAuthors());
      return null;
    });
    _defineProperty(this, "abortMerge", async () => {
      const choice = this.props.confirm({
        message: 'Abort merge',
        detailedMessage: 'Are you sure?',
        buttons: ['Abort', 'Cancel']
      });
      if (choice !== 0) {
        return;
      }
      try {
        await this.props.repository.abortMerge();
      } catch (e) {
        if (e.code === 'EDIRTYSTAGED') {
          this.props.notificationManager.addError(`Cannot abort because ${e.path} is both dirty and staged.`, {
            dismissable: true
          });
        } else {
          throw e;
        }
      }
    });
    _defineProperty(this, "resolveAsOurs", async paths => {
      if (this.props.fetchInProgress) {
        return;
      }
      const side = this.props.isRebasing ? 'theirs' : 'ours';
      await this.props.repository.checkoutSide(side, paths);
      this.refreshResolutionProgress(false, true);
    });
    _defineProperty(this, "resolveAsTheirs", async paths => {
      if (this.props.fetchInProgress) {
        return;
      }
      const side = this.props.isRebasing ? 'ours' : 'theirs';
      await this.props.repository.checkoutSide(side, paths);
      this.refreshResolutionProgress(false, true);
    });
    _defineProperty(this, "checkout", (branchName, options) => {
      return this.props.repository.checkout(branchName, options);
    });
    _defineProperty(this, "rememberLastFocus", event => {
      this.lastFocus = this.refView.map(view => view.getFocus(event.target)).getOr(null) || _gitTabView.default.focus.STAGING;
    });
    _defineProperty(this, "toggleIdentityEditor", () => this.setState(before => ({
      editingIdentity: !before.editingIdentity
    })));
    _defineProperty(this, "closeIdentityEditor", () => this.setState({
      editingIdentity: false
    }));
    _defineProperty(this, "setLocalIdentity", () => this.setIdentity({}));
    _defineProperty(this, "setGlobalIdentity", () => this.setIdentity({
      global: true
    }));
    this.stagingOperationInProgress = false;
    this.lastFocus = _gitTabView.default.focus.STAGING;
    this.refView = new _refHolder.default();
    this.refRoot = new _refHolder.default();
    this.refStagingView = new _refHolder.default();
    this.state = {
      selectedCoAuthors: [],
      editingIdentity: false
    };
    this.usernameBuffer = new _atom.TextBuffer({
      text: props.username
    });
    this.usernameBuffer.retain();
    this.emailBuffer = new _atom.TextBuffer({
      text: props.email
    });
    this.emailBuffer.retain();
    this.userStore = new _userStore.default({
      repository: this.props.repository,
      login: this.props.loginModel,
      config: this.props.config
    });
  }
  static getDerivedStateFromProps(props, state) {
    return {
      editingIdentity: state.editingIdentity || !props.fetchInProgress && props.repository.isPresent() && !props.repositoryDrift && (props.username === '' || props.email === '')
    };
  }
  render() {
    return _react.default.createElement(_gitTabView.default, {
      ref: this.refView.setter,
      refRoot: this.refRoot,
      refStagingView: this.refStagingView,
      isLoading: this.props.fetchInProgress,
      editingIdentity: this.state.editingIdentity,
      repository: this.props.repository,
      usernameBuffer: this.usernameBuffer,
      emailBuffer: this.emailBuffer,
      lastCommit: this.props.lastCommit,
      recentCommits: this.props.recentCommits,
      isMerging: this.props.isMerging,
      isRebasing: this.props.isRebasing,
      hasUndoHistory: this.props.hasUndoHistory,
      currentBranch: this.props.currentBranch,
      unstagedChanges: this.props.unstagedChanges,
      stagedChanges: this.props.stagedChanges,
      mergeConflicts: this.props.mergeConflicts,
      workingDirectoryPath: this.props.workingDirectoryPath || this.props.currentWorkDir,
      mergeMessage: this.props.mergeMessage,
      userStore: this.userStore,
      selectedCoAuthors: this.state.selectedCoAuthors,
      updateSelectedCoAuthors: this.updateSelectedCoAuthors,
      resolutionProgress: this.props.resolutionProgress,
      workspace: this.props.workspace,
      commands: this.props.commands,
      grammars: this.props.grammars,
      tooltips: this.props.tooltips,
      notificationManager: this.props.notificationManager,
      project: this.props.project,
      confirm: this.props.confirm,
      config: this.props.config,
      toggleIdentityEditor: this.toggleIdentityEditor,
      closeIdentityEditor: this.closeIdentityEditor,
      setLocalIdentity: this.setLocalIdentity,
      setGlobalIdentity: this.setGlobalIdentity,
      openInitializeDialog: this.props.openInitializeDialog,
      openFiles: this.props.openFiles,
      discardWorkDirChangesForPaths: this.props.discardWorkDirChangesForPaths,
      undoLastDiscard: this.props.undoLastDiscard,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs,
      onDidChangeWorkDirs: this.props.onDidChangeWorkDirs,
      attemptFileStageOperation: this.attemptFileStageOperation,
      attemptStageAllOperation: this.attemptStageAllOperation,
      prepareToCommit: this.prepareToCommit,
      commit: this.commit,
      undoLastCommit: this.undoLastCommit,
      push: this.push,
      pull: this.pull,
      fetch: this.fetch,
      checkout: this.checkout,
      abortMerge: this.abortMerge,
      resolveAsOurs: this.resolveAsOurs,
      resolveAsTheirs: this.resolveAsTheirs
    });
  }
  componentDidMount() {
    this.refreshResolutionProgress(false, false);
    this.refRoot.map(root => root.addEventListener('focusin', this.rememberLastFocus));
    if (this.props.controllerRef) {
      this.props.controllerRef.setter(this);
    }
  }
  componentDidUpdate(prevProps) {
    this.userStore.setRepository(this.props.repository);
    this.userStore.setLoginModel(this.props.loginModel);
    this.refreshResolutionProgress(false, false);
    if (prevProps.username !== this.props.username) {
      this.usernameBuffer.setTextViaDiff(this.props.username);
    }
    if (prevProps.email !== this.props.email) {
      this.emailBuffer.setTextViaDiff(this.props.email);
    }
  }
  componentWillUnmount() {
    this.refRoot.map(root => root.removeEventListener('focusin', this.rememberLastFocus));
  }

  /*
   * Begin (but don't await) an async conflict-counting task for each merge conflict path that has no conflict
   * marker count yet. Omit any path that's already open in a TextEditor or that has already been counted.
   *
   * includeOpen - update marker counts for files that are currently open in TextEditors
   * includeCounted - update marker counts for files that have been counted before
   */
  refreshResolutionProgress(includeOpen, includeCounted) {
    if (this.props.fetchInProgress) {
      return;
    }
    const openPaths = new Set(this.props.workspace.getTextEditors().map(editor => editor.getPath()));
    for (let i = 0; i < this.props.mergeConflicts.length; i++) {
      const conflictPath = _path.default.join(this.props.workingDirectoryPath, this.props.mergeConflicts[i].filePath);
      if (!includeOpen && openPaths.has(conflictPath)) {
        continue;
      }
      if (!includeCounted && this.props.resolutionProgress.getRemaining(conflictPath) !== undefined) {
        continue;
      }
      this.props.refreshResolutionProgress(conflictPath);
    }
  }
  async stageFiles(filePaths) {
    const pathsToStage = new Set(filePaths);
    const mergeMarkers = await Promise.all(filePaths.map(async filePath => {
      return {
        filePath,
        hasMarkers: await this.props.repository.pathHasMergeMarkers(filePath)
      };
    }));
    for (const {
      filePath,
      hasMarkers
    } of mergeMarkers) {
      if (hasMarkers) {
        const choice = this.props.confirm({
          message: 'File contains merge markers: ',
          detailedMessage: `Do you still want to stage this file?\n${filePath}`,
          buttons: ['Stage', 'Cancel']
        });
        if (choice !== 0) {
          pathsToStage.delete(filePath);
        }
      }
    }
    return this.props.repository.stageFiles(Array.from(pathsToStage));
  }
  unstageFiles(filePaths) {
    return this.props.repository.unstageFiles(filePaths);
  }
  async setIdentity(options) {
    const newUsername = this.usernameBuffer.getText();
    const newEmail = this.emailBuffer.getText();
    if (newUsername.length > 0 || options.global) {
      await this.props.repository.setConfig('user.name', newUsername, options);
    } else {
      await this.props.repository.unsetConfig('user.name');
    }
    if (newEmail.length > 0 || options.global) {
      await this.props.repository.setConfig('user.email', newEmail, options);
    } else {
      await this.props.repository.unsetConfig('user.email');
    }
    this.closeIdentityEditor();
  }
  restoreFocus() {
    this.refView.map(view => view.setFocus(this.lastFocus));
  }
  hasFocus() {
    return this.refRoot.map(root => root.contains(document.activeElement)).getOr(false);
  }
  wasActivated(isStillActive) {
    process.nextTick(() => {
      isStillActive() && this.restoreFocus();
    });
  }
  focusAndSelectStagingItem(filePath, stagingStatus) {
    return this.refView.map(view => view.focusAndSelectStagingItem(filePath, stagingStatus)).getOr(null);
  }
  focusAndSelectCommitPreviewButton() {
    return this.refView.map(view => view.focusAndSelectCommitPreviewButton());
  }
  focusAndSelectRecentCommit() {
    return this.refView.map(view => view.focusAndSelectRecentCommit());
  }
  quietlySelectItem(filePath, stagingStatus) {
    return this.refView.map(view => view.quietlySelectItem(filePath, stagingStatus)).getOr(null);
  }
}
exports.default = GitTabController;
_defineProperty(GitTabController, "focus", _objectSpread({}, _gitTabView.default.focus));
_defineProperty(GitTabController, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  loginModel: _propTypes.default.object.isRequired,
  username: _propTypes.default.string.isRequired,
  email: _propTypes.default.string.isRequired,
  lastCommit: _propTypes2.CommitPropType.isRequired,
  recentCommits: _propTypes.default.arrayOf(_propTypes2.CommitPropType).isRequired,
  isMerging: _propTypes.default.bool.isRequired,
  isRebasing: _propTypes.default.bool.isRequired,
  hasUndoHistory: _propTypes.default.bool.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  unstagedChanges: _propTypes.default.arrayOf(_propTypes2.FilePatchItemPropType).isRequired,
  stagedChanges: _propTypes.default.arrayOf(_propTypes2.FilePatchItemPropType).isRequired,
  mergeConflicts: _propTypes.default.arrayOf(_propTypes2.MergeConflictItemPropType).isRequired,
  workingDirectoryPath: _propTypes.default.string,
  mergeMessage: _propTypes.default.string,
  fetchInProgress: _propTypes.default.bool.isRequired,
  currentWorkDir: _propTypes.default.string,
  repositoryDrift: _propTypes.default.bool.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  grammars: _propTypes.default.object.isRequired,
  resolutionProgress: _propTypes.default.object.isRequired,
  notificationManager: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  project: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  ensureGitTab: _propTypes.default.func.isRequired,
  refreshResolutionProgress: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  discardWorkDirChangesForPaths: _propTypes.default.func.isRequired,
  openFiles: _propTypes.default.func.isRequired,
  openInitializeDialog: _propTypes.default.func.isRequired,
  controllerRef: _propTypes2.RefHolderPropType,
  contextLocked: _propTypes.default.bool.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRUYWJDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY29udGV4dCIsInN0YWdlU3RhdHVzIiwiYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbiIsImZpbGVQYXRocyIsInN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzIiwic3RhZ2VPcGVyYXRpb25Qcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZWxlY3Rpb25VcGRhdGVQcm9taXNlIiwiZmlsZUxpc3RVcGRhdGVQcm9taXNlIiwicmVmU3RhZ2luZ1ZpZXciLCJtYXAiLCJ2aWV3IiwiZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlIiwiZ2V0T3IiLCJ1bnN0YWdlRmlsZXMiLCJzdGFnZUZpbGVzIiwidGhlbiIsImVuc3VyZUdpdFRhYiIsIm1lc3NhZ2UiLCJvcHRpb25zIiwicmVwb3NpdG9yeSIsImNvbW1pdCIsInNlbGVjdGVkQ29BdXRob3JzIiwibmV3QXV0aG9yIiwidXNlclN0b3JlIiwiYWRkVXNlcnMiLCJjb25jYXQiLCJzZXRTdGF0ZSIsInJlcG8iLCJsYXN0Q29tbWl0IiwiZ2V0TGFzdENvbW1pdCIsImlzVW5ib3JuUmVmIiwidW5kb0xhc3RDb21taXQiLCJzZXRDb21taXRNZXNzYWdlIiwiZ2V0RnVsbE1lc3NhZ2UiLCJ1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyIsImdldENvQXV0aG9ycyIsImNob2ljZSIsImNvbmZpcm0iLCJkZXRhaWxlZE1lc3NhZ2UiLCJidXR0b25zIiwiYWJvcnRNZXJnZSIsImUiLCJjb2RlIiwibm90aWZpY2F0aW9uTWFuYWdlciIsImFkZEVycm9yIiwicGF0aCIsImRpc21pc3NhYmxlIiwicGF0aHMiLCJmZXRjaEluUHJvZ3Jlc3MiLCJzaWRlIiwiaXNSZWJhc2luZyIsImNoZWNrb3V0U2lkZSIsInJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MiLCJicmFuY2hOYW1lIiwiY2hlY2tvdXQiLCJldmVudCIsImxhc3RGb2N1cyIsInJlZlZpZXciLCJnZXRGb2N1cyIsInRhcmdldCIsIkdpdFRhYlZpZXciLCJmb2N1cyIsIlNUQUdJTkciLCJiZWZvcmUiLCJlZGl0aW5nSWRlbnRpdHkiLCJzZXRJZGVudGl0eSIsImdsb2JhbCIsIlJlZkhvbGRlciIsInJlZlJvb3QiLCJzdGF0ZSIsInVzZXJuYW1lQnVmZmVyIiwiVGV4dEJ1ZmZlciIsInRleHQiLCJ1c2VybmFtZSIsInJldGFpbiIsImVtYWlsQnVmZmVyIiwiZW1haWwiLCJVc2VyU3RvcmUiLCJsb2dpbiIsImxvZ2luTW9kZWwiLCJjb25maWciLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJpc1ByZXNlbnQiLCJyZXBvc2l0b3J5RHJpZnQiLCJyZW5kZXIiLCJzZXR0ZXIiLCJyZWNlbnRDb21taXRzIiwiaXNNZXJnaW5nIiwiaGFzVW5kb0hpc3RvcnkiLCJjdXJyZW50QnJhbmNoIiwidW5zdGFnZWRDaGFuZ2VzIiwic3RhZ2VkQ2hhbmdlcyIsIm1lcmdlQ29uZmxpY3RzIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJjdXJyZW50V29ya0RpciIsIm1lcmdlTWVzc2FnZSIsInJlc29sdXRpb25Qcm9ncmVzcyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiZ3JhbW1hcnMiLCJ0b29sdGlwcyIsInByb2plY3QiLCJ0b2dnbGVJZGVudGl0eUVkaXRvciIsImNsb3NlSWRlbnRpdHlFZGl0b3IiLCJzZXRMb2NhbElkZW50aXR5Iiwic2V0R2xvYmFsSWRlbnRpdHkiLCJvcGVuSW5pdGlhbGl6ZURpYWxvZyIsIm9wZW5GaWxlcyIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwidW5kb0xhc3REaXNjYXJkIiwiY29udGV4dExvY2tlZCIsImNoYW5nZVdvcmtpbmdEaXJlY3RvcnkiLCJzZXRDb250ZXh0TG9jayIsImdldEN1cnJlbnRXb3JrRGlycyIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24iLCJwcmVwYXJlVG9Db21taXQiLCJwdXNoIiwicHVsbCIsImZldGNoIiwicmVzb2x2ZUFzT3VycyIsInJlc29sdmVBc1RoZWlycyIsImNvbXBvbmVudERpZE1vdW50Iiwicm9vdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1lbWJlckxhc3RGb2N1cyIsImNvbnRyb2xsZXJSZWYiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJzZXRSZXBvc2l0b3J5Iiwic2V0TG9naW5Nb2RlbCIsInNldFRleHRWaWFEaWZmIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaW5jbHVkZU9wZW4iLCJpbmNsdWRlQ291bnRlZCIsIm9wZW5QYXRocyIsIlNldCIsImdldFRleHRFZGl0b3JzIiwiZWRpdG9yIiwiZ2V0UGF0aCIsImkiLCJsZW5ndGgiLCJjb25mbGljdFBhdGgiLCJqb2luIiwiZmlsZVBhdGgiLCJoYXMiLCJnZXRSZW1haW5pbmciLCJ1bmRlZmluZWQiLCJwYXRoc1RvU3RhZ2UiLCJtZXJnZU1hcmtlcnMiLCJhbGwiLCJoYXNNYXJrZXJzIiwicGF0aEhhc01lcmdlTWFya2VycyIsImRlbGV0ZSIsIkFycmF5IiwiZnJvbSIsIm5ld1VzZXJuYW1lIiwiZ2V0VGV4dCIsIm5ld0VtYWlsIiwic2V0Q29uZmlnIiwidW5zZXRDb25maWciLCJyZXN0b3JlRm9jdXMiLCJzZXRGb2N1cyIsImhhc0ZvY3VzIiwiY29udGFpbnMiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJ3YXNBY3RpdmF0ZWQiLCJpc1N0aWxsQWN0aXZlIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsInN0YWdpbmdTdGF0dXMiLCJmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24iLCJmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCIsInF1aWV0bHlTZWxlY3RJdGVtIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsIkNvbW1pdFByb3BUeXBlIiwiYXJyYXlPZiIsImJvb2wiLCJCcmFuY2hQcm9wVHlwZSIsIkZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSIsIk1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUiLCJmdW5jIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwic291cmNlcyI6WyJnaXQtdGFiLWNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IEdpdFRhYlZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0LXRhYi12aWV3JztcbmltcG9ydCBVc2VyU3RvcmUgZnJvbSAnLi4vbW9kZWxzL3VzZXItc3RvcmUnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge1xuICBDb21taXRQcm9wVHlwZSwgQnJhbmNoUHJvcFR5cGUsIEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSwgTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGUsXG59IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRUYWJDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIC4uLkdpdFRhYlZpZXcuZm9jdXMsXG4gIH07XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9naW5Nb2RlbDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgdXNlcm5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBlbWFpbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGxhc3RDb21taXQ6IENvbW1pdFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVjZW50Q29tbWl0czogUHJvcFR5cGVzLmFycmF5T2YoQ29tbWl0UHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzUmViYXNpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudEJyYW5jaDogQnJhbmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB1bnN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBzdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgbWVyZ2VDb25mbGljdHM6IFByb3BUeXBlcy5hcnJheU9mKE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbWVyZ2VNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZldGNoSW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50V29ya0RpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXBvc2l0b3J5RHJpZnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGdyYW1tYXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb2plY3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBlbnN1cmVHaXRUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbnRyb2xsZXJSZWY6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RGb2N1cyA9IEdpdFRhYlZpZXcuZm9jdXMuU1RBR0lORztcblxuICAgIHRoaXMucmVmVmlldyA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZTdGFnaW5nVmlldyA9IG5ldyBSZWZIb2xkZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWxlY3RlZENvQXV0aG9yczogW10sXG4gICAgICBlZGl0aW5nSWRlbnRpdHk6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLnVzZXJuYW1lQnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IHByb3BzLnVzZXJuYW1lfSk7XG4gICAgdGhpcy51c2VybmFtZUJ1ZmZlci5yZXRhaW4oKTtcbiAgICB0aGlzLmVtYWlsQnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IHByb3BzLmVtYWlsfSk7XG4gICAgdGhpcy5lbWFpbEJ1ZmZlci5yZXRhaW4oKTtcblxuICAgIHRoaXMudXNlclN0b3JlID0gbmV3IFVzZXJTdG9yZSh7XG4gICAgICByZXBvc2l0b3J5OiB0aGlzLnByb3BzLnJlcG9zaXRvcnksXG4gICAgICBsb2dpbjogdGhpcy5wcm9wcy5sb2dpbk1vZGVsLFxuICAgICAgY29uZmlnOiB0aGlzLnByb3BzLmNvbmZpZyxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRpbmdJZGVudGl0eTogc3RhdGUuZWRpdGluZ0lkZW50aXR5IHx8XG4gICAgICAgICghcHJvcHMuZmV0Y2hJblByb2dyZXNzICYmIHByb3BzLnJlcG9zaXRvcnkuaXNQcmVzZW50KCkgJiYgIXByb3BzLnJlcG9zaXRvcnlEcmlmdCkgJiZcbiAgICAgICAgKHByb3BzLnVzZXJuYW1lID09PSAnJyB8fCBwcm9wcy5lbWFpbCA9PT0gJycpLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRUYWJWaWV3XG4gICAgICAgIHJlZj17dGhpcy5yZWZWaWV3LnNldHRlcn1cbiAgICAgICAgcmVmUm9vdD17dGhpcy5yZWZSb290fVxuICAgICAgICByZWZTdGFnaW5nVmlldz17dGhpcy5yZWZTdGFnaW5nVmlld31cblxuICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzfVxuICAgICAgICBlZGl0aW5nSWRlbnRpdHk9e3RoaXMuc3RhdGUuZWRpdGluZ0lkZW50aXR5fVxuICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG5cbiAgICAgICAgdXNlcm5hbWVCdWZmZXI9e3RoaXMudXNlcm5hbWVCdWZmZXJ9XG4gICAgICAgIGVtYWlsQnVmZmVyPXt0aGlzLmVtYWlsQnVmZmVyfVxuICAgICAgICBsYXN0Q29tbWl0PXt0aGlzLnByb3BzLmxhc3RDb21taXR9XG4gICAgICAgIHJlY2VudENvbW1pdHM9e3RoaXMucHJvcHMucmVjZW50Q29tbWl0c31cbiAgICAgICAgaXNNZXJnaW5nPXt0aGlzLnByb3BzLmlzTWVyZ2luZ31cbiAgICAgICAgaXNSZWJhc2luZz17dGhpcy5wcm9wcy5pc1JlYmFzaW5nfVxuICAgICAgICBoYXNVbmRvSGlzdG9yeT17dGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeX1cbiAgICAgICAgY3VycmVudEJyYW5jaD17dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNofVxuICAgICAgICB1bnN0YWdlZENoYW5nZXM9e3RoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzfVxuICAgICAgICBzdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXN9XG4gICAgICAgIG1lcmdlQ29uZmxpY3RzPXt0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzfVxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5UGF0aD17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCB8fCB0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICBtZXJnZU1lc3NhZ2U9e3RoaXMucHJvcHMubWVyZ2VNZXNzYWdlfVxuICAgICAgICB1c2VyU3RvcmU9e3RoaXMudXNlclN0b3JlfVxuICAgICAgICBzZWxlY3RlZENvQXV0aG9ycz17dGhpcy5zdGF0ZS5zZWxlY3RlZENvQXV0aG9yc31cbiAgICAgICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnN9XG5cbiAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGdyYW1tYXJzPXt0aGlzLnByb3BzLmdyYW1tYXJzfVxuICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICBwcm9qZWN0PXt0aGlzLnByb3BzLnByb2plY3R9XG4gICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICB0b2dnbGVJZGVudGl0eUVkaXRvcj17dGhpcy50b2dnbGVJZGVudGl0eUVkaXRvcn1cbiAgICAgICAgY2xvc2VJZGVudGl0eUVkaXRvcj17dGhpcy5jbG9zZUlkZW50aXR5RWRpdG9yfVxuICAgICAgICBzZXRMb2NhbElkZW50aXR5PXt0aGlzLnNldExvY2FsSWRlbnRpdHl9XG4gICAgICAgIHNldEdsb2JhbElkZW50aXR5PXt0aGlzLnNldEdsb2JhbElkZW50aXR5fVxuICAgICAgICBvcGVuSW5pdGlhbGl6ZURpYWxvZz17dGhpcy5wcm9wcy5vcGVuSW5pdGlhbGl6ZURpYWxvZ31cbiAgICAgICAgb3BlbkZpbGVzPXt0aGlzLnByb3BzLm9wZW5GaWxlc31cbiAgICAgICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM9e3RoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHN9XG4gICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cbiAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXt0aGlzLnByb3BzLmdldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17dGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzfVxuXG4gICAgICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb249e3RoaXMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbn1cbiAgICAgICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uPXt0aGlzLmF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbn1cbiAgICAgICAgcHJlcGFyZVRvQ29tbWl0PXt0aGlzLnByZXBhcmVUb0NvbW1pdH1cbiAgICAgICAgY29tbWl0PXt0aGlzLmNvbW1pdH1cbiAgICAgICAgdW5kb0xhc3RDb21taXQ9e3RoaXMudW5kb0xhc3RDb21taXR9XG4gICAgICAgIHB1c2g9e3RoaXMucHVzaH1cbiAgICAgICAgcHVsbD17dGhpcy5wdWxsfVxuICAgICAgICBmZXRjaD17dGhpcy5mZXRjaH1cbiAgICAgICAgY2hlY2tvdXQ9e3RoaXMuY2hlY2tvdXR9XG4gICAgICAgIGFib3J0TWVyZ2U9e3RoaXMuYWJvcnRNZXJnZX1cbiAgICAgICAgcmVzb2x2ZUFzT3Vycz17dGhpcy5yZXNvbHZlQXNPdXJzfVxuICAgICAgICByZXNvbHZlQXNUaGVpcnM9e3RoaXMucmVzb2x2ZUFzVGhlaXJzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCBmYWxzZSk7XG4gICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMucmVtZW1iZXJMYXN0Rm9jdXMpKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRyb2xsZXJSZWYpIHtcbiAgICAgIHRoaXMucHJvcHMuY29udHJvbGxlclJlZi5zZXR0ZXIodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHRoaXMudXNlclN0b3JlLnNldFJlcG9zaXRvcnkodGhpcy5wcm9wcy5yZXBvc2l0b3J5KTtcbiAgICB0aGlzLnVzZXJTdG9yZS5zZXRMb2dpbk1vZGVsKHRoaXMucHJvcHMubG9naW5Nb2RlbCk7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCBmYWxzZSk7XG5cbiAgICBpZiAocHJldlByb3BzLnVzZXJuYW1lICE9PSB0aGlzLnByb3BzLnVzZXJuYW1lKSB7XG4gICAgICB0aGlzLnVzZXJuYW1lQnVmZmVyLnNldFRleHRWaWFEaWZmKHRoaXMucHJvcHMudXNlcm5hbWUpO1xuICAgIH1cblxuICAgIGlmIChwcmV2UHJvcHMuZW1haWwgIT09IHRoaXMucHJvcHMuZW1haWwpIHtcbiAgICAgIHRoaXMuZW1haWxCdWZmZXIuc2V0VGV4dFZpYURpZmYodGhpcy5wcm9wcy5lbWFpbCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMucmVtZW1iZXJMYXN0Rm9jdXMpKTtcbiAgfVxuXG4gIC8qXG4gICAqIEJlZ2luIChidXQgZG9uJ3QgYXdhaXQpIGFuIGFzeW5jIGNvbmZsaWN0LWNvdW50aW5nIHRhc2sgZm9yIGVhY2ggbWVyZ2UgY29uZmxpY3QgcGF0aCB0aGF0IGhhcyBubyBjb25mbGljdFxuICAgKiBtYXJrZXIgY291bnQgeWV0LiBPbWl0IGFueSBwYXRoIHRoYXQncyBhbHJlYWR5IG9wZW4gaW4gYSBUZXh0RWRpdG9yIG9yIHRoYXQgaGFzIGFscmVhZHkgYmVlbiBjb3VudGVkLlxuICAgKlxuICAgKiBpbmNsdWRlT3BlbiAtIHVwZGF0ZSBtYXJrZXIgY291bnRzIGZvciBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgb3BlbiBpbiBUZXh0RWRpdG9yc1xuICAgKiBpbmNsdWRlQ291bnRlZCAtIHVwZGF0ZSBtYXJrZXIgY291bnRzIGZvciBmaWxlcyB0aGF0IGhhdmUgYmVlbiBjb3VudGVkIGJlZm9yZVxuICAgKi9cbiAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhpbmNsdWRlT3BlbiwgaW5jbHVkZUNvdW50ZWQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVuUGF0aHMgPSBuZXcgU2V0KFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5tYXAoZWRpdG9yID0+IGVkaXRvci5nZXRQYXRoKCkpLFxuICAgICk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbmZsaWN0UGF0aCA9IHBhdGguam9pbihcbiAgICAgICAgdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCxcbiAgICAgICAgdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c1tpXS5maWxlUGF0aCxcbiAgICAgICk7XG5cbiAgICAgIGlmICghaW5jbHVkZU9wZW4gJiYgb3BlblBhdGhzLmhhcyhjb25mbGljdFBhdGgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWluY2x1ZGVDb3VudGVkICYmIHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzLmdldFJlbWFpbmluZyhjb25mbGljdFBhdGgpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhjb25mbGljdFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiA9IHN0YWdlU3RhdHVzID0+IHtcbiAgICByZXR1cm4gdGhpcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKFsnLiddLCBzdGFnZVN0YXR1cyk7XG4gIH1cblxuICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uID0gKGZpbGVQYXRocywgc3RhZ2VTdGF0dXMpID0+IHtcbiAgICBpZiAodGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhZ2VPcGVyYXRpb25Qcm9taXNlOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgICAgc2VsZWN0aW9uVXBkYXRlUHJvbWlzZTogUHJvbWlzZS5yZXNvbHZlKCksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuXG4gICAgY29uc3QgZmlsZUxpc3RVcGRhdGVQcm9taXNlID0gdGhpcy5yZWZTdGFnaW5nVmlldy5tYXAodmlldyA9PiB7XG4gICAgICByZXR1cm4gdmlldy5nZXROZXh0TGlzdFVwZGF0ZVByb21pc2UoKTtcbiAgICB9KS5nZXRPcihQcm9taXNlLnJlc29sdmUoKSk7XG4gICAgbGV0IHN0YWdlT3BlcmF0aW9uUHJvbWlzZTtcbiAgICBpZiAoc3RhZ2VTdGF0dXMgPT09ICdzdGFnZWQnKSB7XG4gICAgICBzdGFnZU9wZXJhdGlvblByb21pc2UgPSB0aGlzLnVuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFnZU9wZXJhdGlvblByb21pc2UgPSB0aGlzLnN0YWdlRmlsZXMoZmlsZVBhdGhzKTtcbiAgICB9XG4gICAgY29uc3Qgc2VsZWN0aW9uVXBkYXRlUHJvbWlzZSA9IGZpbGVMaXN0VXBkYXRlUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7c3RhZ2VPcGVyYXRpb25Qcm9taXNlLCBzZWxlY3Rpb25VcGRhdGVQcm9taXNlfTtcbiAgfVxuXG4gIGFzeW5jIHN0YWdlRmlsZXMoZmlsZVBhdGhzKSB7XG4gICAgY29uc3QgcGF0aHNUb1N0YWdlID0gbmV3IFNldChmaWxlUGF0aHMpO1xuXG4gICAgY29uc3QgbWVyZ2VNYXJrZXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBmaWxlUGF0aHMubWFwKGFzeW5jIGZpbGVQYXRoID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICBoYXNNYXJrZXJzOiBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkucGF0aEhhc01lcmdlTWFya2VycyhmaWxlUGF0aCksXG4gICAgICAgIH07XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCB7ZmlsZVBhdGgsIGhhc01hcmtlcnN9IG9mIG1lcmdlTWFya2Vycykge1xuICAgICAgaWYgKGhhc01hcmtlcnMpIHtcbiAgICAgICAgY29uc3QgY2hvaWNlID0gdGhpcy5wcm9wcy5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnRmlsZSBjb250YWlucyBtZXJnZSBtYXJrZXJzOiAnLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogYERvIHlvdSBzdGlsbCB3YW50IHRvIHN0YWdlIHRoaXMgZmlsZT9cXG4ke2ZpbGVQYXRofWAsXG4gICAgICAgICAgYnV0dG9uczogWydTdGFnZScsICdDYW5jZWwnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjaG9pY2UgIT09IDApIHsgcGF0aHNUb1N0YWdlLmRlbGV0ZShmaWxlUGF0aCk7IH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnN0YWdlRmlsZXMoQXJyYXkuZnJvbShwYXRoc1RvU3RhZ2UpKTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnVuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgcHJlcGFyZVRvQ29tbWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgIHJldHVybiAhYXdhaXQgdGhpcy5wcm9wcy5lbnN1cmVHaXRUYWIoKTtcbiAgfVxuXG4gIGNvbW1pdCA9IChtZXNzYWdlLCBvcHRpb25zKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5jb21taXQobWVzc2FnZSwgb3B0aW9ucyk7XG4gIH1cblxuICB1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyA9IChzZWxlY3RlZENvQXV0aG9ycywgbmV3QXV0aG9yKSA9PiB7XG4gICAgaWYgKG5ld0F1dGhvcikge1xuICAgICAgdGhpcy51c2VyU3RvcmUuYWRkVXNlcnMoW25ld0F1dGhvcl0pO1xuICAgICAgc2VsZWN0ZWRDb0F1dGhvcnMgPSBzZWxlY3RlZENvQXV0aG9ycy5jb25jYXQoW25ld0F1dGhvcl0pO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3RlZENvQXV0aG9yc30pO1xuICB9XG5cbiAgdW5kb0xhc3RDb21taXQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVwbyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgICBjb25zdCBsYXN0Q29tbWl0ID0gYXdhaXQgcmVwby5nZXRMYXN0Q29tbWl0KCk7XG4gICAgaWYgKGxhc3RDb21taXQuaXNVbmJvcm5SZWYoKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgYXdhaXQgcmVwby51bmRvTGFzdENvbW1pdCgpO1xuICAgIHJlcG8uc2V0Q29tbWl0TWVzc2FnZShsYXN0Q29tbWl0LmdldEZ1bGxNZXNzYWdlKCkpO1xuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMobGFzdENvbW1pdC5nZXRDb0F1dGhvcnMoKSk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFib3J0TWVyZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY2hvaWNlID0gdGhpcy5wcm9wcy5jb25maXJtKHtcbiAgICAgIG1lc3NhZ2U6ICdBYm9ydCBtZXJnZScsXG4gICAgICBkZXRhaWxlZE1lc3NhZ2U6ICdBcmUgeW91IHN1cmU/JyxcbiAgICAgIGJ1dHRvbnM6IFsnQWJvcnQnLCAnQ2FuY2VsJ10sXG4gICAgfSk7XG4gICAgaWYgKGNob2ljZSAhPT0gMCkgeyByZXR1cm47IH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuYWJvcnRNZXJnZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLmNvZGUgPT09ICdFRElSVFlTVEFHRUQnKSB7XG4gICAgICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihcbiAgICAgICAgICBgQ2Fubm90IGFib3J0IGJlY2F1c2UgJHtlLnBhdGh9IGlzIGJvdGggZGlydHkgYW5kIHN0YWdlZC5gLFxuICAgICAgICAgIHtkaXNtaXNzYWJsZTogdHJ1ZX0sXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVBc091cnMgPSBhc3luYyBwYXRocyA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2lkZSA9IHRoaXMucHJvcHMuaXNSZWJhc2luZyA/ICd0aGVpcnMnIDogJ291cnMnO1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5jaGVja291dFNpZGUoc2lkZSwgcGF0aHMpO1xuICAgIHRoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICByZXNvbHZlQXNUaGVpcnMgPSBhc3luYyBwYXRocyA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2lkZSA9IHRoaXMucHJvcHMuaXNSZWJhc2luZyA/ICdvdXJzJyA6ICd0aGVpcnMnO1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5jaGVja291dFNpZGUoc2lkZSwgcGF0aHMpO1xuICAgIHRoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBjaGVja291dCA9IChicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5jaGVja291dChicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIHJlbWVtYmVyTGFzdEZvY3VzID0gZXZlbnQgPT4ge1xuICAgIHRoaXMubGFzdEZvY3VzID0gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZ2V0Rm9jdXMoZXZlbnQudGFyZ2V0KSkuZ2V0T3IobnVsbCkgfHwgR2l0VGFiVmlldy5mb2N1cy5TVEFHSU5HO1xuICB9XG5cbiAgdG9nZ2xlSWRlbnRpdHlFZGl0b3IgPSAoKSA9PiB0aGlzLnNldFN0YXRlKGJlZm9yZSA9PiAoe2VkaXRpbmdJZGVudGl0eTogIWJlZm9yZS5lZGl0aW5nSWRlbnRpdHl9KSlcblxuICBjbG9zZUlkZW50aXR5RWRpdG9yID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZ0lkZW50aXR5OiBmYWxzZX0pXG5cbiAgc2V0TG9jYWxJZGVudGl0eSA9ICgpID0+IHRoaXMuc2V0SWRlbnRpdHkoe30pO1xuXG4gIHNldEdsb2JhbElkZW50aXR5ID0gKCkgPT4gdGhpcy5zZXRJZGVudGl0eSh7Z2xvYmFsOiB0cnVlfSk7XG5cbiAgYXN5bmMgc2V0SWRlbnRpdHkob3B0aW9ucykge1xuICAgIGNvbnN0IG5ld1VzZXJuYW1lID0gdGhpcy51c2VybmFtZUJ1ZmZlci5nZXRUZXh0KCk7XG4gICAgY29uc3QgbmV3RW1haWwgPSB0aGlzLmVtYWlsQnVmZmVyLmdldFRleHQoKTtcblxuICAgIGlmIChuZXdVc2VybmFtZS5sZW5ndGggPiAwIHx8IG9wdGlvbnMuZ2xvYmFsKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2V0Q29uZmlnKCd1c2VyLm5hbWUnLCBuZXdVc2VybmFtZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS51bnNldENvbmZpZygndXNlci5uYW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0VtYWlsLmxlbmd0aCA+IDAgfHwgb3B0aW9ucy5nbG9iYWwpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zZXRDb25maWcoJ3VzZXIuZW1haWwnLCBuZXdFbWFpbCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS51bnNldENvbmZpZygndXNlci5lbWFpbCcpO1xuICAgIH1cbiAgICB0aGlzLmNsb3NlSWRlbnRpdHlFZGl0b3IoKTtcbiAgfVxuXG4gIHJlc3RvcmVGb2N1cygpIHtcbiAgICB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5zZXRGb2N1cyh0aGlzLmxhc3RGb2N1cykpO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICB3YXNBY3RpdmF0ZWQoaXNTdGlsbEFjdGl2ZSkge1xuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgaXNTdGlsbEFjdGl2ZSgpICYmIHRoaXMucmVzdG9yZUZvY3VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LmZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpKS5nZXRPcihudWxsKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LmZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCkpO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpKS5nZXRPcihudWxsKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtB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