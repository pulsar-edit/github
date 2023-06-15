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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3JlYWN0IiwiX3Byb3BUeXBlcyIsIl9hdG9tIiwiX2dpdFRhYlZpZXciLCJfdXNlclN0b3JlIiwiX3JlZkhvbGRlciIsIl9wcm9wVHlwZXMyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9scyIsImZpbHRlciIsInN5bSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsImZvckVhY2giLCJrZXkiLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkdpdFRhYkNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0Iiwic3RhZ2VTdGF0dXMiLCJhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uIiwiZmlsZVBhdGhzIiwic3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MiLCJzdGFnZU9wZXJhdGlvblByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNlbGVjdGlvblVwZGF0ZVByb21pc2UiLCJmaWxlTGlzdFVwZGF0ZVByb21pc2UiLCJyZWZTdGFnaW5nVmlldyIsIm1hcCIsInZpZXciLCJnZXROZXh0TGlzdFVwZGF0ZVByb21pc2UiLCJnZXRPciIsInVuc3RhZ2VGaWxlcyIsInN0YWdlRmlsZXMiLCJ0aGVuIiwiZW5zdXJlR2l0VGFiIiwibWVzc2FnZSIsIm9wdGlvbnMiLCJyZXBvc2l0b3J5IiwiY29tbWl0Iiwic2VsZWN0ZWRDb0F1dGhvcnMiLCJuZXdBdXRob3IiLCJ1c2VyU3RvcmUiLCJhZGRVc2VycyIsImNvbmNhdCIsInNldFN0YXRlIiwicmVwbyIsImxhc3RDb21taXQiLCJnZXRMYXN0Q29tbWl0IiwiaXNVbmJvcm5SZWYiLCJ1bmRvTGFzdENvbW1pdCIsInNldENvbW1pdE1lc3NhZ2UiLCJnZXRGdWxsTWVzc2FnZSIsInVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzIiwiZ2V0Q29BdXRob3JzIiwiY2hvaWNlIiwiY29uZmlybSIsImRldGFpbGVkTWVzc2FnZSIsImJ1dHRvbnMiLCJhYm9ydE1lcmdlIiwiZSIsImNvZGUiLCJub3RpZmljYXRpb25NYW5hZ2VyIiwiYWRkRXJyb3IiLCJwYXRoIiwiZGlzbWlzc2FibGUiLCJwYXRocyIsImZldGNoSW5Qcm9ncmVzcyIsInNpZGUiLCJpc1JlYmFzaW5nIiwiY2hlY2tvdXRTaWRlIiwicmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyIsImJyYW5jaE5hbWUiLCJjaGVja291dCIsImV2ZW50IiwibGFzdEZvY3VzIiwicmVmVmlldyIsImdldEZvY3VzIiwiR2l0VGFiVmlldyIsImZvY3VzIiwiU1RBR0lORyIsImJlZm9yZSIsImVkaXRpbmdJZGVudGl0eSIsInNldElkZW50aXR5IiwiZ2xvYmFsIiwiUmVmSG9sZGVyIiwicmVmUm9vdCIsInN0YXRlIiwidXNlcm5hbWVCdWZmZXIiLCJUZXh0QnVmZmVyIiwidGV4dCIsInVzZXJuYW1lIiwicmV0YWluIiwiZW1haWxCdWZmZXIiLCJlbWFpbCIsIlVzZXJTdG9yZSIsImxvZ2luIiwibG9naW5Nb2RlbCIsImNvbmZpZyIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsImlzUHJlc2VudCIsInJlcG9zaXRvcnlEcmlmdCIsInJlbmRlciIsImNyZWF0ZUVsZW1lbnQiLCJyZWYiLCJzZXR0ZXIiLCJpc0xvYWRpbmciLCJyZWNlbnRDb21taXRzIiwiaXNNZXJnaW5nIiwiaGFzVW5kb0hpc3RvcnkiLCJjdXJyZW50QnJhbmNoIiwidW5zdGFnZWRDaGFuZ2VzIiwic3RhZ2VkQ2hhbmdlcyIsIm1lcmdlQ29uZmxpY3RzIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJjdXJyZW50V29ya0RpciIsIm1lcmdlTWVzc2FnZSIsInJlc29sdXRpb25Qcm9ncmVzcyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiZ3JhbW1hcnMiLCJ0b29sdGlwcyIsInByb2plY3QiLCJ0b2dnbGVJZGVudGl0eUVkaXRvciIsImNsb3NlSWRlbnRpdHlFZGl0b3IiLCJzZXRMb2NhbElkZW50aXR5Iiwic2V0R2xvYmFsSWRlbnRpdHkiLCJvcGVuSW5pdGlhbGl6ZURpYWxvZyIsIm9wZW5GaWxlcyIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwidW5kb0xhc3REaXNjYXJkIiwiY29udGV4dExvY2tlZCIsImNoYW5nZVdvcmtpbmdEaXJlY3RvcnkiLCJzZXRDb250ZXh0TG9jayIsImdldEN1cnJlbnRXb3JrRGlycyIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24iLCJwcmVwYXJlVG9Db21taXQiLCJwdWxsIiwiZmV0Y2giLCJyZXNvbHZlQXNPdXJzIiwicmVzb2x2ZUFzVGhlaXJzIiwiY29tcG9uZW50RGlkTW91bnQiLCJyb290IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbWVtYmVyTGFzdEZvY3VzIiwiY29udHJvbGxlclJlZiIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInNldFJlcG9zaXRvcnkiLCJzZXRMb2dpbk1vZGVsIiwic2V0VGV4dFZpYURpZmYiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJpbmNsdWRlT3BlbiIsImluY2x1ZGVDb3VudGVkIiwib3BlblBhdGhzIiwiU2V0IiwiZ2V0VGV4dEVkaXRvcnMiLCJlZGl0b3IiLCJnZXRQYXRoIiwiY29uZmxpY3RQYXRoIiwiam9pbiIsImZpbGVQYXRoIiwiaGFzIiwiZ2V0UmVtYWluaW5nIiwicGF0aHNUb1N0YWdlIiwibWVyZ2VNYXJrZXJzIiwiYWxsIiwiaGFzTWFya2VycyIsInBhdGhIYXNNZXJnZU1hcmtlcnMiLCJkZWxldGUiLCJBcnJheSIsImZyb20iLCJuZXdVc2VybmFtZSIsImdldFRleHQiLCJuZXdFbWFpbCIsInNldENvbmZpZyIsInVuc2V0Q29uZmlnIiwicmVzdG9yZUZvY3VzIiwic2V0Rm9jdXMiLCJoYXNGb2N1cyIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwid2FzQWN0aXZhdGVkIiwiaXNTdGlsbEFjdGl2ZSIsInByb2Nlc3MiLCJuZXh0VGljayIsImZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0iLCJzdGFnaW5nU3RhdHVzIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwiZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQiLCJxdWlldGx5U2VsZWN0SXRlbSIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiQ29tbWl0UHJvcFR5cGUiLCJhcnJheU9mIiwiYm9vbCIsIkJyYW5jaFByb3BUeXBlIiwiRmlsZVBhdGNoSXRlbVByb3BUeXBlIiwiTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSIsImZ1bmMiLCJSZWZIb2xkZXJQcm9wVHlwZSJdLCJzb3VyY2VzIjpbImdpdC10YWItY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgR2l0VGFiVmlldyBmcm9tICcuLi92aWV3cy9naXQtdGFiLXZpZXcnO1xuaW1wb3J0IFVzZXJTdG9yZSBmcm9tICcuLi9tb2RlbHMvdXNlci1zdG9yZSc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7XG4gIENvbW1pdFByb3BUeXBlLCBCcmFuY2hQcm9wVHlwZSwgRmlsZVBhdGNoSXRlbVByb3BUeXBlLCBNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZSxcbn0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYkNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgLi4uR2l0VGFiVmlldy5mb2N1cyxcbiAgfTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBsb2dpbk1vZGVsOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICB1c2VybmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGVtYWlsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbGFzdENvbW1pdDogQ29tbWl0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZWNlbnRDb21taXRzOiBQcm9wVHlwZXMuYXJyYXlPZihDb21taXRQcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNSZWJhc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHVuc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIHN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBtZXJnZUNvbmZsaWN0czogUHJvcFR5cGVzLmFycmF5T2YoTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZXJnZU1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZmV0Y2hJblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRXb3JrRGlyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlcG9zaXRvcnlEcmlmdDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZ3JhbW1hcnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHJvamVjdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGVuc3VyZUdpdFRhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuRmlsZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkluaXRpYWxpemVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY29udHJvbGxlclJlZjogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0Q3VycmVudFdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMubGFzdEZvY3VzID0gR2l0VGFiVmlldy5mb2N1cy5TVEFHSU5HO1xuXG4gICAgdGhpcy5yZWZWaWV3ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlN0YWdpbmdWaWV3ID0gbmV3IFJlZkhvbGRlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGVkQ29BdXRob3JzOiBbXSxcbiAgICAgIGVkaXRpbmdJZGVudGl0eTogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMudXNlcm5hbWVCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcih7dGV4dDogcHJvcHMudXNlcm5hbWV9KTtcbiAgICB0aGlzLnVzZXJuYW1lQnVmZmVyLnJldGFpbigpO1xuICAgIHRoaXMuZW1haWxCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcih7dGV4dDogcHJvcHMuZW1haWx9KTtcbiAgICB0aGlzLmVtYWlsQnVmZmVyLnJldGFpbigpO1xuXG4gICAgdGhpcy51c2VyU3RvcmUgPSBuZXcgVXNlclN0b3JlKHtcbiAgICAgIHJlcG9zaXRvcnk6IHRoaXMucHJvcHMucmVwb3NpdG9yeSxcbiAgICAgIGxvZ2luOiB0aGlzLnByb3BzLmxvZ2luTW9kZWwsXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGluZ0lkZW50aXR5OiBzdGF0ZS5lZGl0aW5nSWRlbnRpdHkgfHxcbiAgICAgICAgKCFwcm9wcy5mZXRjaEluUHJvZ3Jlc3MgJiYgcHJvcHMucmVwb3NpdG9yeS5pc1ByZXNlbnQoKSAmJiAhcHJvcHMucmVwb3NpdG9yeURyaWZ0KSAmJlxuICAgICAgICAocHJvcHMudXNlcm5hbWUgPT09ICcnIHx8IHByb3BzLmVtYWlsID09PSAnJyksXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdFRhYlZpZXdcbiAgICAgICAgcmVmPXt0aGlzLnJlZlZpZXcuc2V0dGVyfVxuICAgICAgICByZWZSb290PXt0aGlzLnJlZlJvb3R9XG4gICAgICAgIHJlZlN0YWdpbmdWaWV3PXt0aGlzLnJlZlN0YWdpbmdWaWV3fVxuXG4gICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3N9XG4gICAgICAgIGVkaXRpbmdJZGVudGl0eT17dGhpcy5zdGF0ZS5lZGl0aW5nSWRlbnRpdHl9XG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cblxuICAgICAgICB1c2VybmFtZUJ1ZmZlcj17dGhpcy51c2VybmFtZUJ1ZmZlcn1cbiAgICAgICAgZW1haWxCdWZmZXI9e3RoaXMuZW1haWxCdWZmZXJ9XG4gICAgICAgIGxhc3RDb21taXQ9e3RoaXMucHJvcHMubGFzdENvbW1pdH1cbiAgICAgICAgcmVjZW50Q29tbWl0cz17dGhpcy5wcm9wcy5yZWNlbnRDb21taXRzfVxuICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICBpc1JlYmFzaW5nPXt0aGlzLnByb3BzLmlzUmViYXNpbmd9XG4gICAgICAgIGhhc1VuZG9IaXN0b3J5PXt0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5fVxuICAgICAgICBjdXJyZW50QnJhbmNoPXt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2h9XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXN9XG4gICAgICAgIHN0YWdlZENoYW5nZXM9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc31cbiAgICAgICAgbWVyZ2VDb25mbGljdHM9e3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHN9XG4gICAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoPXt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoIHx8IHRoaXMucHJvcHMuY3VycmVudFdvcmtEaXJ9XG4gICAgICAgIG1lcmdlTWVzc2FnZT17dGhpcy5wcm9wcy5tZXJnZU1lc3NhZ2V9XG4gICAgICAgIHVzZXJTdG9yZT17dGhpcy51c2VyU3RvcmV9XG4gICAgICAgIHNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnN0YXRlLnNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICB1cGRhdGVTZWxlY3RlZENvQXV0aG9ycz17dGhpcy51cGRhdGVTZWxlY3RlZENvQXV0aG9yc31cblxuICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgZ3JhbW1hcnM9e3RoaXMucHJvcHMuZ3JhbW1hcnN9XG4gICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgIHByb2plY3Q9e3RoaXMucHJvcHMucHJvamVjdH1cbiAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgIHRvZ2dsZUlkZW50aXR5RWRpdG9yPXt0aGlzLnRvZ2dsZUlkZW50aXR5RWRpdG9yfVxuICAgICAgICBjbG9zZUlkZW50aXR5RWRpdG9yPXt0aGlzLmNsb3NlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAgIHNldExvY2FsSWRlbnRpdHk9e3RoaXMuc2V0TG9jYWxJZGVudGl0eX1cbiAgICAgICAgc2V0R2xvYmFsSWRlbnRpdHk9e3RoaXMuc2V0R2xvYmFsSWRlbnRpdHl9XG4gICAgICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nPXt0aGlzLnByb3BzLm9wZW5Jbml0aWFsaXplRGlhbG9nfVxuICAgICAgICBvcGVuRmlsZXM9e3RoaXMucHJvcHMub3BlbkZpbGVzfVxuICAgICAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocz17dGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoc31cbiAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e3RoaXMucHJvcHMuZ2V0Q3VycmVudFdvcmtEaXJzfVxuICAgICAgICBvbkRpZENoYW5nZVdvcmtEaXJzPXt0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnN9XG5cbiAgICAgICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbj17dGhpcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9ufVxuICAgICAgICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb249e3RoaXMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9ufVxuICAgICAgICBwcmVwYXJlVG9Db21taXQ9e3RoaXMucHJlcGFyZVRvQ29tbWl0fVxuICAgICAgICBjb21taXQ9e3RoaXMuY29tbWl0fVxuICAgICAgICB1bmRvTGFzdENvbW1pdD17dGhpcy51bmRvTGFzdENvbW1pdH1cbiAgICAgICAgcHVzaD17dGhpcy5wdXNofVxuICAgICAgICBwdWxsPXt0aGlzLnB1bGx9XG4gICAgICAgIGZldGNoPXt0aGlzLmZldGNofVxuICAgICAgICBjaGVja291dD17dGhpcy5jaGVja291dH1cbiAgICAgICAgYWJvcnRNZXJnZT17dGhpcy5hYm9ydE1lcmdlfVxuICAgICAgICByZXNvbHZlQXNPdXJzPXt0aGlzLnJlc29sdmVBc091cnN9XG4gICAgICAgIHJlc29sdmVBc1RoZWlycz17dGhpcy5yZXNvbHZlQXNUaGVpcnN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZmFsc2UsIGZhbHNlKTtcbiAgICB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5yZW1lbWJlckxhc3RGb2N1cykpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udHJvbGxlclJlZikge1xuICAgICAgdGhpcy5wcm9wcy5jb250cm9sbGVyUmVmLnNldHRlcih0aGlzKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgdGhpcy51c2VyU3RvcmUuc2V0UmVwb3NpdG9yeSh0aGlzLnByb3BzLnJlcG9zaXRvcnkpO1xuICAgIHRoaXMudXNlclN0b3JlLnNldExvZ2luTW9kZWwodGhpcy5wcm9wcy5sb2dpbk1vZGVsKTtcbiAgICB0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZmFsc2UsIGZhbHNlKTtcblxuICAgIGlmIChwcmV2UHJvcHMudXNlcm5hbWUgIT09IHRoaXMucHJvcHMudXNlcm5hbWUpIHtcbiAgICAgIHRoaXMudXNlcm5hbWVCdWZmZXIuc2V0VGV4dFZpYURpZmYodGhpcy5wcm9wcy51c2VybmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZQcm9wcy5lbWFpbCAhPT0gdGhpcy5wcm9wcy5lbWFpbCkge1xuICAgICAgdGhpcy5lbWFpbEJ1ZmZlci5zZXRUZXh0VmlhRGlmZih0aGlzLnByb3BzLmVtYWlsKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5yZW1lbWJlckxhc3RGb2N1cykpO1xuICB9XG5cbiAgLypcbiAgICogQmVnaW4gKGJ1dCBkb24ndCBhd2FpdCkgYW4gYXN5bmMgY29uZmxpY3QtY291bnRpbmcgdGFzayBmb3IgZWFjaCBtZXJnZSBjb25mbGljdCBwYXRoIHRoYXQgaGFzIG5vIGNvbmZsaWN0XG4gICAqIG1hcmtlciBjb3VudCB5ZXQuIE9taXQgYW55IHBhdGggdGhhdCdzIGFscmVhZHkgb3BlbiBpbiBhIFRleHRFZGl0b3Igb3IgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIGNvdW50ZWQuXG4gICAqXG4gICAqIGluY2x1ZGVPcGVuIC0gdXBkYXRlIG1hcmtlciBjb3VudHMgZm9yIGZpbGVzIHRoYXQgYXJlIGN1cnJlbnRseSBvcGVuIGluIFRleHRFZGl0b3JzXG4gICAqIGluY2x1ZGVDb3VudGVkIC0gdXBkYXRlIG1hcmtlciBjb3VudHMgZm9yIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIGNvdW50ZWQgYmVmb3JlXG4gICAqL1xuICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGluY2x1ZGVPcGVuLCBpbmNsdWRlQ291bnRlZCkge1xuICAgIGlmICh0aGlzLnByb3BzLmZldGNoSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5QYXRocyA9IG5ldyBTZXQoXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLm1hcChlZGl0b3IgPT4gZWRpdG9yLmdldFBhdGgoKSksXG4gICAgKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29uZmxpY3RQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLFxuICAgICAgICB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzW2ldLmZpbGVQYXRoLFxuICAgICAgKTtcblxuICAgICAgaWYgKCFpbmNsdWRlT3BlbiAmJiBvcGVuUGF0aHMuaGFzKGNvbmZsaWN0UGF0aCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW5jbHVkZUNvdW50ZWQgJiYgdGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGNvbmZsaWN0UGF0aCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGNvbmZsaWN0UGF0aCk7XG4gICAgfVxuICB9XG5cbiAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uID0gc3RhZ2VTdGF0dXMgPT4ge1xuICAgIHJldHVybiB0aGlzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oWycuJ10sIHN0YWdlU3RhdHVzKTtcbiAgfVxuXG4gIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24gPSAoZmlsZVBhdGhzLCBzdGFnZVN0YXR1cykgPT4ge1xuICAgIGlmICh0aGlzLnN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFnZU9wZXJhdGlvblByb21pc2U6IFByb21pc2UucmVzb2x2ZSgpLFxuICAgICAgICBzZWxlY3Rpb25VcGRhdGVQcm9taXNlOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IHRydWU7XG5cbiAgICBjb25zdCBmaWxlTGlzdFVwZGF0ZVByb21pc2UgPSB0aGlzLnJlZlN0YWdpbmdWaWV3Lm1hcCh2aWV3ID0+IHtcbiAgICAgIHJldHVybiB2aWV3LmdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSgpO1xuICAgIH0pLmdldE9yKFByb21pc2UucmVzb2x2ZSgpKTtcbiAgICBsZXQgc3RhZ2VPcGVyYXRpb25Qcm9taXNlO1xuICAgIGlmIChzdGFnZVN0YXR1cyA9PT0gJ3N0YWdlZCcpIHtcbiAgICAgIHN0YWdlT3BlcmF0aW9uUHJvbWlzZSA9IHRoaXMudW5zdGFnZUZpbGVzKGZpbGVQYXRocyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YWdlT3BlcmF0aW9uUHJvbWlzZSA9IHRoaXMuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3Rpb25VcGRhdGVQcm9taXNlID0gZmlsZUxpc3RVcGRhdGVQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtzdGFnZU9wZXJhdGlvblByb21pc2UsIHNlbGVjdGlvblVwZGF0ZVByb21pc2V9O1xuICB9XG5cbiAgYXN5bmMgc3RhZ2VGaWxlcyhmaWxlUGF0aHMpIHtcbiAgICBjb25zdCBwYXRoc1RvU3RhZ2UgPSBuZXcgU2V0KGZpbGVQYXRocyk7XG5cbiAgICBjb25zdCBtZXJnZU1hcmtlcnMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGZpbGVQYXRocy5tYXAoYXN5bmMgZmlsZVBhdGggPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIGhhc01hcmtlcnM6IGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5wYXRoSGFzTWVyZ2VNYXJrZXJzKGZpbGVQYXRoKSxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHtmaWxlUGF0aCwgaGFzTWFya2Vyc30gb2YgbWVyZ2VNYXJrZXJzKSB7XG4gICAgICBpZiAoaGFzTWFya2Vycykge1xuICAgICAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdGaWxlIGNvbnRhaW5zIG1lcmdlIG1hcmtlcnM6ICcsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBgRG8geW91IHN0aWxsIHdhbnQgdG8gc3RhZ2UgdGhpcyBmaWxlP1xcbiR7ZmlsZVBhdGh9YCxcbiAgICAgICAgICBidXR0b25zOiBbJ1N0YWdlJywgJ0NhbmNlbCddLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNob2ljZSAhPT0gMCkgeyBwYXRoc1RvU3RhZ2UuZGVsZXRlKGZpbGVQYXRoKTsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc3RhZ2VGaWxlcyhBcnJheS5mcm9tKHBhdGhzVG9TdGFnZSkpO1xuICB9XG5cbiAgdW5zdGFnZUZpbGVzKGZpbGVQYXRocykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkudW5zdGFnZUZpbGVzKGZpbGVQYXRocyk7XG4gIH1cblxuICBwcmVwYXJlVG9Db21taXQgPSBhc3luYyAoKSA9PiB7XG4gICAgcmV0dXJuICFhd2FpdCB0aGlzLnByb3BzLmVuc3VyZUdpdFRhYigpO1xuICB9XG5cbiAgY29tbWl0ID0gKG1lc3NhZ2UsIG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNvbW1pdChtZXNzYWdlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzID0gKHNlbGVjdGVkQ29BdXRob3JzLCBuZXdBdXRob3IpID0+IHtcbiAgICBpZiAobmV3QXV0aG9yKSB7XG4gICAgICB0aGlzLnVzZXJTdG9yZS5hZGRVc2VycyhbbmV3QXV0aG9yXSk7XG4gICAgICBzZWxlY3RlZENvQXV0aG9ycyA9IHNlbGVjdGVkQ29BdXRob3JzLmNvbmNhdChbbmV3QXV0aG9yXSk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkQ29BdXRob3JzfSk7XG4gIH1cblxuICB1bmRvTGFzdENvbW1pdCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXBvID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5O1xuICAgIGNvbnN0IGxhc3RDb21taXQgPSBhd2FpdCByZXBvLmdldExhc3RDb21taXQoKTtcbiAgICBpZiAobGFzdENvbW1pdC5pc1VuYm9yblJlZigpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBhd2FpdCByZXBvLnVuZG9MYXN0Q29tbWl0KCk7XG4gICAgcmVwby5zZXRDb21taXRNZXNzYWdlKGxhc3RDb21taXQuZ2V0RnVsbE1lc3NhZ2UoKSk7XG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyhsYXN0Q29tbWl0LmdldENvQXV0aG9ycygpKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWJvcnRNZXJnZSA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgbWVzc2FnZTogJ0Fib3J0IG1lcmdlJyxcbiAgICAgIGRldGFpbGVkTWVzc2FnZTogJ0FyZSB5b3Ugc3VyZT8nLFxuICAgICAgYnV0dG9uczogWydBYm9ydCcsICdDYW5jZWwnXSxcbiAgICB9KTtcbiAgICBpZiAoY2hvaWNlICE9PSAwKSB7IHJldHVybjsgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5hYm9ydE1lcmdlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuY29kZSA9PT0gJ0VESVJUWVNUQUdFRCcpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgYWJvcnQgYmVjYXVzZSAke2UucGF0aH0gaXMgYm90aCBkaXJ0eSBhbmQgc3RhZ2VkLmAsXG4gICAgICAgICAge2Rpc21pc3NhYmxlOiB0cnVlfSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZUFzT3VycyA9IGFzeW5jIHBhdGhzID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaWRlID0gdGhpcy5wcm9wcy5pc1JlYmFzaW5nID8gJ3RoZWlycycgOiAnb3Vycyc7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNoZWNrb3V0U2lkZShzaWRlLCBwYXRocyk7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIHJlc29sdmVBc1RoZWlycyA9IGFzeW5jIHBhdGhzID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaWRlID0gdGhpcy5wcm9wcy5pc1JlYmFzaW5nID8gJ291cnMnIDogJ3RoZWlycyc7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNoZWNrb3V0U2lkZShzaWRlLCBwYXRocyk7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIGNoZWNrb3V0ID0gKGJyYW5jaE5hbWUsIG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNoZWNrb3V0KGJyYW5jaE5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmVtZW1iZXJMYXN0Rm9jdXMgPSBldmVudCA9PiB7XG4gICAgdGhpcy5sYXN0Rm9jdXMgPSB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5nZXRGb2N1cyhldmVudC50YXJnZXQpKS5nZXRPcihudWxsKSB8fCBHaXRUYWJWaWV3LmZvY3VzLlNUQUdJTkc7XG4gIH1cblxuICB0b2dnbGVJZGVudGl0eUVkaXRvciA9ICgpID0+IHRoaXMuc2V0U3RhdGUoYmVmb3JlID0+ICh7ZWRpdGluZ0lkZW50aXR5OiAhYmVmb3JlLmVkaXRpbmdJZGVudGl0eX0pKVxuXG4gIGNsb3NlSWRlbnRpdHlFZGl0b3IgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHtlZGl0aW5nSWRlbnRpdHk6IGZhbHNlfSlcblxuICBzZXRMb2NhbElkZW50aXR5ID0gKCkgPT4gdGhpcy5zZXRJZGVudGl0eSh7fSk7XG5cbiAgc2V0R2xvYmFsSWRlbnRpdHkgPSAoKSA9PiB0aGlzLnNldElkZW50aXR5KHtnbG9iYWw6IHRydWV9KTtcblxuICBhc3luYyBzZXRJZGVudGl0eShvcHRpb25zKSB7XG4gICAgY29uc3QgbmV3VXNlcm5hbWUgPSB0aGlzLnVzZXJuYW1lQnVmZmVyLmdldFRleHQoKTtcbiAgICBjb25zdCBuZXdFbWFpbCA9IHRoaXMuZW1haWxCdWZmZXIuZ2V0VGV4dCgpO1xuXG4gICAgaWYgKG5ld1VzZXJuYW1lLmxlbmd0aCA+IDAgfHwgb3B0aW9ucy5nbG9iYWwpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zZXRDb25maWcoJ3VzZXIubmFtZScsIG5ld1VzZXJuYW1lLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnVuc2V0Q29uZmlnKCd1c2VyLm5hbWUnKTtcbiAgICB9XG5cbiAgICBpZiAobmV3RW1haWwubGVuZ3RoID4gMCB8fCBvcHRpb25zLmdsb2JhbCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNldENvbmZpZygndXNlci5lbWFpbCcsIG5ld0VtYWlsLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnVuc2V0Q29uZmlnKCd1c2VyLmVtYWlsJyk7XG4gICAgfVxuICAgIHRoaXMuY2xvc2VJZGVudGl0eUVkaXRvcigpO1xuICB9XG5cbiAgcmVzdG9yZUZvY3VzKCkge1xuICAgIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LnNldEZvY3VzKHRoaXMubGFzdEZvY3VzKSk7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIHdhc0FjdGl2YXRlZChpc1N0aWxsQWN0aXZlKSB7XG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBpc1N0aWxsQWN0aXZlKCkgJiYgdGhpcy5yZXN0b3JlRm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykpLmdldE9yKG51bGwpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5mb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSk7XG4gIH1cblxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykpLmdldE9yKG51bGwpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFDLE1BQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFVBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLEtBQUEsR0FBQUgsT0FBQTtBQUVBLElBQUFJLFdBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFLLFVBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFNLFVBQUEsR0FBQVAsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFPLFdBQUEsR0FBQVAsT0FB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