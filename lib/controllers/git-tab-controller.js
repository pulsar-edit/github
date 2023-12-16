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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3JlYWN0IiwiX3Byb3BUeXBlcyIsIl9hdG9tIiwiX2dpdFRhYlZpZXciLCJfdXNlclN0b3JlIiwiX3JlZkhvbGRlciIsIl9wcm9wVHlwZXMyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwiT2JqZWN0Iiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiaSIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkdpdFRhYkNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0Iiwic3RhZ2VTdGF0dXMiLCJhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uIiwiZmlsZVBhdGhzIiwic3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MiLCJzdGFnZU9wZXJhdGlvblByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNlbGVjdGlvblVwZGF0ZVByb21pc2UiLCJmaWxlTGlzdFVwZGF0ZVByb21pc2UiLCJyZWZTdGFnaW5nVmlldyIsIm1hcCIsInZpZXciLCJnZXROZXh0TGlzdFVwZGF0ZVByb21pc2UiLCJnZXRPciIsInVuc3RhZ2VGaWxlcyIsInN0YWdlRmlsZXMiLCJ0aGVuIiwiZW5zdXJlR2l0VGFiIiwibWVzc2FnZSIsIm9wdGlvbnMiLCJyZXBvc2l0b3J5IiwiY29tbWl0Iiwic2VsZWN0ZWRDb0F1dGhvcnMiLCJuZXdBdXRob3IiLCJ1c2VyU3RvcmUiLCJhZGRVc2VycyIsImNvbmNhdCIsInNldFN0YXRlIiwicmVwbyIsImxhc3RDb21taXQiLCJnZXRMYXN0Q29tbWl0IiwiaXNVbmJvcm5SZWYiLCJ1bmRvTGFzdENvbW1pdCIsInNldENvbW1pdE1lc3NhZ2UiLCJnZXRGdWxsTWVzc2FnZSIsInVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzIiwiZ2V0Q29BdXRob3JzIiwiY2hvaWNlIiwiY29uZmlybSIsImRldGFpbGVkTWVzc2FnZSIsImJ1dHRvbnMiLCJhYm9ydE1lcmdlIiwiY29kZSIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJhZGRFcnJvciIsInBhdGgiLCJkaXNtaXNzYWJsZSIsInBhdGhzIiwiZmV0Y2hJblByb2dyZXNzIiwic2lkZSIsImlzUmViYXNpbmciLCJjaGVja291dFNpZGUiLCJyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzIiwiYnJhbmNoTmFtZSIsImNoZWNrb3V0IiwiZXZlbnQiLCJsYXN0Rm9jdXMiLCJyZWZWaWV3IiwiZ2V0Rm9jdXMiLCJ0YXJnZXQiLCJHaXRUYWJWaWV3IiwiZm9jdXMiLCJTVEFHSU5HIiwiYmVmb3JlIiwiZWRpdGluZ0lkZW50aXR5Iiwic2V0SWRlbnRpdHkiLCJnbG9iYWwiLCJSZWZIb2xkZXIiLCJyZWZSb290Iiwic3RhdGUiLCJ1c2VybmFtZUJ1ZmZlciIsIlRleHRCdWZmZXIiLCJ0ZXh0IiwidXNlcm5hbWUiLCJyZXRhaW4iLCJlbWFpbEJ1ZmZlciIsImVtYWlsIiwiVXNlclN0b3JlIiwibG9naW4iLCJsb2dpbk1vZGVsIiwiY29uZmlnIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwiaXNQcmVzZW50IiwicmVwb3NpdG9yeURyaWZ0IiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsInJlZiIsInNldHRlciIsImlzTG9hZGluZyIsInJlY2VudENvbW1pdHMiLCJpc01lcmdpbmciLCJoYXNVbmRvSGlzdG9yeSIsImN1cnJlbnRCcmFuY2giLCJ1bnN0YWdlZENoYW5nZXMiLCJzdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImN1cnJlbnRXb3JrRGlyIiwibWVyZ2VNZXNzYWdlIiwicmVzb2x1dGlvblByb2dyZXNzIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJncmFtbWFycyIsInRvb2x0aXBzIiwicHJvamVjdCIsInRvZ2dsZUlkZW50aXR5RWRpdG9yIiwiY2xvc2VJZGVudGl0eUVkaXRvciIsInNldExvY2FsSWRlbnRpdHkiLCJzZXRHbG9iYWxJZGVudGl0eSIsIm9wZW5Jbml0aWFsaXplRGlhbG9nIiwib3BlbkZpbGVzIiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJ1bmRvTGFzdERpc2NhcmQiLCJjb250ZXh0TG9ja2VkIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsImF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiIsInByZXBhcmVUb0NvbW1pdCIsInB1bGwiLCJmZXRjaCIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJjb21wb25lbnREaWRNb3VudCIsInJvb3QiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtZW1iZXJMYXN0Rm9jdXMiLCJjb250cm9sbGVyUmVmIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwic2V0UmVwb3NpdG9yeSIsInNldExvZ2luTW9kZWwiLCJzZXRUZXh0VmlhRGlmZiIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImluY2x1ZGVPcGVuIiwiaW5jbHVkZUNvdW50ZWQiLCJvcGVuUGF0aHMiLCJTZXQiLCJnZXRUZXh0RWRpdG9ycyIsImVkaXRvciIsImdldFBhdGgiLCJjb25mbGljdFBhdGgiLCJqb2luIiwiZmlsZVBhdGgiLCJoYXMiLCJnZXRSZW1haW5pbmciLCJ1bmRlZmluZWQiLCJwYXRoc1RvU3RhZ2UiLCJtZXJnZU1hcmtlcnMiLCJhbGwiLCJoYXNNYXJrZXJzIiwicGF0aEhhc01lcmdlTWFya2VycyIsImRlbGV0ZSIsIkFycmF5IiwiZnJvbSIsIm5ld1VzZXJuYW1lIiwiZ2V0VGV4dCIsIm5ld0VtYWlsIiwic2V0Q29uZmlnIiwidW5zZXRDb25maWciLCJyZXN0b3JlRm9jdXMiLCJzZXRGb2N1cyIsImhhc0ZvY3VzIiwiY29udGFpbnMiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJ3YXNBY3RpdmF0ZWQiLCJpc1N0aWxsQWN0aXZlIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsInN0YWdpbmdTdGF0dXMiLCJmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24iLCJmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCIsInF1aWV0bHlTZWxlY3RJdGVtIiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJDb21taXRQcm9wVHlwZSIsImFycmF5T2YiLCJib29sIiwiQnJhbmNoUHJvcFR5cGUiLCJGaWxlUGF0Y2hJdGVtUHJvcFR5cGUiLCJNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlIiwiZnVuYyIsIlJlZkhvbGRlclByb3BUeXBlIl0sInNvdXJjZXMiOlsiZ2l0LXRhYi1jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBHaXRUYWJWaWV3IGZyb20gJy4uL3ZpZXdzL2dpdC10YWItdmlldyc7XG5pbXBvcnQgVXNlclN0b3JlIGZyb20gJy4uL21vZGVscy91c2VyLXN0b3JlJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHtcbiAgQ29tbWl0UHJvcFR5cGUsIEJyYW5jaFByb3BUeXBlLCBGaWxlUGF0Y2hJdGVtUHJvcFR5cGUsIE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUsIFJlZkhvbGRlclByb3BUeXBlLFxufSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0VGFiQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBmb2N1cyA9IHtcbiAgICAuLi5HaXRUYWJWaWV3LmZvY3VzLFxuICB9O1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGxvZ2luTW9kZWw6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIHVzZXJuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgZW1haWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBsYXN0Q29tbWl0OiBDb21taXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlY2VudENvbW1pdHM6IFByb3BUeXBlcy5hcnJheU9mKENvbW1pdFByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIGlzTWVyZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc1JlYmFzaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IEJyYW5jaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdW5zdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG1lcmdlTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBmZXRjaEluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudFdvcmtEaXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcmVwb3NpdG9yeURyaWZ0OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBncmFtbWFyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwcm9qZWN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZW5zdXJlR2l0VGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5GaWxlczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuSW5pdGlhbGl6ZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjb250cm9sbGVyUmVmOiBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25EaWRDaGFuZ2VXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBnZXRDdXJyZW50V29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICB0aGlzLnN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzID0gZmFsc2U7XG4gICAgdGhpcy5sYXN0Rm9jdXMgPSBHaXRUYWJWaWV3LmZvY3VzLlNUQUdJTkc7XG5cbiAgICB0aGlzLnJlZlZpZXcgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmU3RhZ2luZ1ZpZXcgPSBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2VsZWN0ZWRDb0F1dGhvcnM6IFtdLFxuICAgICAgZWRpdGluZ0lkZW50aXR5OiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy51c2VybmFtZUJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyKHt0ZXh0OiBwcm9wcy51c2VybmFtZX0pO1xuICAgIHRoaXMudXNlcm5hbWVCdWZmZXIucmV0YWluKCk7XG4gICAgdGhpcy5lbWFpbEJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyKHt0ZXh0OiBwcm9wcy5lbWFpbH0pO1xuICAgIHRoaXMuZW1haWxCdWZmZXIucmV0YWluKCk7XG5cbiAgICB0aGlzLnVzZXJTdG9yZSA9IG5ldyBVc2VyU3RvcmUoe1xuICAgICAgcmVwb3NpdG9yeTogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LFxuICAgICAgbG9naW46IHRoaXMucHJvcHMubG9naW5Nb2RlbCxcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcsXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0aW5nSWRlbnRpdHk6IHN0YXRlLmVkaXRpbmdJZGVudGl0eSB8fFxuICAgICAgICAoIXByb3BzLmZldGNoSW5Qcm9ncmVzcyAmJiBwcm9wcy5yZXBvc2l0b3J5LmlzUHJlc2VudCgpICYmICFwcm9wcy5yZXBvc2l0b3J5RHJpZnQpICYmXG4gICAgICAgIChwcm9wcy51c2VybmFtZSA9PT0gJycgfHwgcHJvcHMuZW1haWwgPT09ICcnKSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0VGFiVmlld1xuICAgICAgICByZWY9e3RoaXMucmVmVmlldy5zZXR0ZXJ9XG4gICAgICAgIHJlZlJvb3Q9e3RoaXMucmVmUm9vdH1cbiAgICAgICAgcmVmU3RhZ2luZ1ZpZXc9e3RoaXMucmVmU3RhZ2luZ1ZpZXd9XG5cbiAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmZldGNoSW5Qcm9ncmVzc31cbiAgICAgICAgZWRpdGluZ0lkZW50aXR5PXt0aGlzLnN0YXRlLmVkaXRpbmdJZGVudGl0eX1cbiAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuXG4gICAgICAgIHVzZXJuYW1lQnVmZmVyPXt0aGlzLnVzZXJuYW1lQnVmZmVyfVxuICAgICAgICBlbWFpbEJ1ZmZlcj17dGhpcy5lbWFpbEJ1ZmZlcn1cbiAgICAgICAgbGFzdENvbW1pdD17dGhpcy5wcm9wcy5sYXN0Q29tbWl0fVxuICAgICAgICByZWNlbnRDb21taXRzPXt0aGlzLnByb3BzLnJlY2VudENvbW1pdHN9XG4gICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgIGlzUmViYXNpbmc9e3RoaXMucHJvcHMuaXNSZWJhc2luZ31cbiAgICAgICAgaGFzVW5kb0hpc3Rvcnk9e3RoaXMucHJvcHMuaGFzVW5kb0hpc3Rvcnl9XG4gICAgICAgIGN1cnJlbnRCcmFuY2g9e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaH1cbiAgICAgICAgdW5zdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlc31cbiAgICAgICAgc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzfVxuICAgICAgICBtZXJnZUNvbmZsaWN0cz17dGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c31cbiAgICAgICAgd29ya2luZ0RpcmVjdG9yeVBhdGg9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGggfHwgdGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgbWVyZ2VNZXNzYWdlPXt0aGlzLnByb3BzLm1lcmdlTWVzc2FnZX1cbiAgICAgICAgdXNlclN0b3JlPXt0aGlzLnVzZXJTdG9yZX1cbiAgICAgICAgc2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMuc3RhdGUuc2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzfVxuXG4gICAgICAgIHJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBncmFtbWFycz17dGhpcy5wcm9wcy5ncmFtbWFyc31cbiAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgcHJvamVjdD17dGhpcy5wcm9wcy5wcm9qZWN0fVxuICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgdG9nZ2xlSWRlbnRpdHlFZGl0b3I9e3RoaXMudG9nZ2xlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAgIGNsb3NlSWRlbnRpdHlFZGl0b3I9e3RoaXMuY2xvc2VJZGVudGl0eUVkaXRvcn1cbiAgICAgICAgc2V0TG9jYWxJZGVudGl0eT17dGhpcy5zZXRMb2NhbElkZW50aXR5fVxuICAgICAgICBzZXRHbG9iYWxJZGVudGl0eT17dGhpcy5zZXRHbG9iYWxJZGVudGl0eX1cbiAgICAgICAgb3BlbkluaXRpYWxpemVEaWFsb2c9e3RoaXMucHJvcHMub3BlbkluaXRpYWxpemVEaWFsb2d9XG4gICAgICAgIG9wZW5GaWxlcz17dGhpcy5wcm9wcy5vcGVuRmlsZXN9XG4gICAgICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzPXt0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzfVxuICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG4gICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17dGhpcy5wcm9wcy5nZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e3RoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlyc31cblxuICAgICAgICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uPXt0aGlzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb259XG4gICAgICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbj17dGhpcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb259XG4gICAgICAgIHByZXBhcmVUb0NvbW1pdD17dGhpcy5wcmVwYXJlVG9Db21taXR9XG4gICAgICAgIGNvbW1pdD17dGhpcy5jb21taXR9XG4gICAgICAgIHVuZG9MYXN0Q29tbWl0PXt0aGlzLnVuZG9MYXN0Q29tbWl0fVxuICAgICAgICBwdXNoPXt0aGlzLnB1c2h9XG4gICAgICAgIHB1bGw9e3RoaXMucHVsbH1cbiAgICAgICAgZmV0Y2g9e3RoaXMuZmV0Y2h9XG4gICAgICAgIGNoZWNrb3V0PXt0aGlzLmNoZWNrb3V0fVxuICAgICAgICBhYm9ydE1lcmdlPXt0aGlzLmFib3J0TWVyZ2V9XG4gICAgICAgIHJlc29sdmVBc091cnM9e3RoaXMucmVzb2x2ZUFzT3Vyc31cbiAgICAgICAgcmVzb2x2ZUFzVGhlaXJzPXt0aGlzLnJlc29sdmVBc1RoZWlyc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmYWxzZSwgZmFsc2UpO1xuICAgIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCB0aGlzLnJlbWVtYmVyTGFzdEZvY3VzKSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb250cm9sbGVyUmVmKSB7XG4gICAgICB0aGlzLnByb3BzLmNvbnRyb2xsZXJSZWYuc2V0dGVyKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICB0aGlzLnVzZXJTdG9yZS5zZXRSZXBvc2l0b3J5KHRoaXMucHJvcHMucmVwb3NpdG9yeSk7XG4gICAgdGhpcy51c2VyU3RvcmUuc2V0TG9naW5Nb2RlbCh0aGlzLnByb3BzLmxvZ2luTW9kZWwpO1xuICAgIHRoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmYWxzZSwgZmFsc2UpO1xuXG4gICAgaWYgKHByZXZQcm9wcy51c2VybmFtZSAhPT0gdGhpcy5wcm9wcy51c2VybmFtZSkge1xuICAgICAgdGhpcy51c2VybmFtZUJ1ZmZlci5zZXRUZXh0VmlhRGlmZih0aGlzLnByb3BzLnVzZXJuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAocHJldlByb3BzLmVtYWlsICE9PSB0aGlzLnByb3BzLmVtYWlsKSB7XG4gICAgICB0aGlzLmVtYWlsQnVmZmVyLnNldFRleHRWaWFEaWZmKHRoaXMucHJvcHMuZW1haWwpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCB0aGlzLnJlbWVtYmVyTGFzdEZvY3VzKSk7XG4gIH1cblxuICAvKlxuICAgKiBCZWdpbiAoYnV0IGRvbid0IGF3YWl0KSBhbiBhc3luYyBjb25mbGljdC1jb3VudGluZyB0YXNrIGZvciBlYWNoIG1lcmdlIGNvbmZsaWN0IHBhdGggdGhhdCBoYXMgbm8gY29uZmxpY3RcbiAgICogbWFya2VyIGNvdW50IHlldC4gT21pdCBhbnkgcGF0aCB0aGF0J3MgYWxyZWFkeSBvcGVuIGluIGEgVGV4dEVkaXRvciBvciB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gY291bnRlZC5cbiAgICpcbiAgICogaW5jbHVkZU9wZW4gLSB1cGRhdGUgbWFya2VyIGNvdW50cyBmb3IgZmlsZXMgdGhhdCBhcmUgY3VycmVudGx5IG9wZW4gaW4gVGV4dEVkaXRvcnNcbiAgICogaW5jbHVkZUNvdW50ZWQgLSB1cGRhdGUgbWFya2VyIGNvdW50cyBmb3IgZmlsZXMgdGhhdCBoYXZlIGJlZW4gY291bnRlZCBiZWZvcmVcbiAgICovXG4gIHJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoaW5jbHVkZU9wZW4sIGluY2x1ZGVDb3VudGVkKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlblBhdGhzID0gbmV3IFNldChcbiAgICAgIHRoaXMucHJvcHMud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkubWFwKGVkaXRvciA9PiBlZGl0b3IuZ2V0UGF0aCgpKSxcbiAgICApO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb25mbGljdFBhdGggPSBwYXRoLmpvaW4oXG4gICAgICAgIHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsXG4gICAgICAgIHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHNbaV0uZmlsZVBhdGgsXG4gICAgICApO1xuXG4gICAgICBpZiAoIWluY2x1ZGVPcGVuICYmIG9wZW5QYXRocy5oYXMoY29uZmxpY3RQYXRoKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpbmNsdWRlQ291bnRlZCAmJiB0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzcy5nZXRSZW1haW5pbmcoY29uZmxpY3RQYXRoKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoY29uZmxpY3RQYXRoKTtcbiAgICB9XG4gIH1cblxuICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24gPSBzdGFnZVN0YXR1cyA9PiB7XG4gICAgcmV0dXJuIHRoaXMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihbJy4nXSwgc3RhZ2VTdGF0dXMpO1xuICB9XG5cbiAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbiA9IChmaWxlUGF0aHMsIHN0YWdlU3RhdHVzKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YWdlT3BlcmF0aW9uUHJvbWlzZTogUHJvbWlzZS5yZXNvbHZlKCksXG4gICAgICAgIHNlbGVjdGlvblVwZGF0ZVByb21pc2U6IFByb21pc2UucmVzb2x2ZSgpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzID0gdHJ1ZTtcblxuICAgIGNvbnN0IGZpbGVMaXN0VXBkYXRlUHJvbWlzZSA9IHRoaXMucmVmU3RhZ2luZ1ZpZXcubWFwKHZpZXcgPT4ge1xuICAgICAgcmV0dXJuIHZpZXcuZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlKCk7XG4gICAgfSkuZ2V0T3IoUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgIGxldCBzdGFnZU9wZXJhdGlvblByb21pc2U7XG4gICAgaWYgKHN0YWdlU3RhdHVzID09PSAnc3RhZ2VkJykge1xuICAgICAgc3RhZ2VPcGVyYXRpb25Qcm9taXNlID0gdGhpcy51bnN0YWdlRmlsZXMoZmlsZVBhdGhzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhZ2VPcGVyYXRpb25Qcm9taXNlID0gdGhpcy5zdGFnZUZpbGVzKGZpbGVQYXRocyk7XG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdGlvblVwZGF0ZVByb21pc2UgPSBmaWxlTGlzdFVwZGF0ZVByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLnN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge3N0YWdlT3BlcmF0aW9uUHJvbWlzZSwgc2VsZWN0aW9uVXBkYXRlUHJvbWlzZX07XG4gIH1cblxuICBhc3luYyBzdGFnZUZpbGVzKGZpbGVQYXRocykge1xuICAgIGNvbnN0IHBhdGhzVG9TdGFnZSA9IG5ldyBTZXQoZmlsZVBhdGhzKTtcblxuICAgIGNvbnN0IG1lcmdlTWFya2VycyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgZmlsZVBhdGhzLm1hcChhc3luYyBmaWxlUGF0aCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgaGFzTWFya2VyczogYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnBhdGhIYXNNZXJnZU1hcmtlcnMoZmlsZVBhdGgpLFxuICAgICAgICB9O1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIGZvciAoY29uc3Qge2ZpbGVQYXRoLCBoYXNNYXJrZXJzfSBvZiBtZXJnZU1hcmtlcnMpIHtcbiAgICAgIGlmIChoYXNNYXJrZXJzKSB7XG4gICAgICAgIGNvbnN0IGNob2ljZSA9IHRoaXMucHJvcHMuY29uZmlybSh7XG4gICAgICAgICAgbWVzc2FnZTogJ0ZpbGUgY29udGFpbnMgbWVyZ2UgbWFya2VyczogJyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IGBEbyB5b3Ugc3RpbGwgd2FudCB0byBzdGFnZSB0aGlzIGZpbGU/XFxuJHtmaWxlUGF0aH1gLFxuICAgICAgICAgIGJ1dHRvbnM6IFsnU3RhZ2UnLCAnQ2FuY2VsJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY2hvaWNlICE9PSAwKSB7IHBhdGhzVG9TdGFnZS5kZWxldGUoZmlsZVBhdGgpOyB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5zdGFnZUZpbGVzKEFycmF5LmZyb20ocGF0aHNUb1N0YWdlKSk7XG4gIH1cblxuICB1bnN0YWdlRmlsZXMoZmlsZVBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS51bnN0YWdlRmlsZXMoZmlsZVBhdGhzKTtcbiAgfVxuXG4gIHByZXBhcmVUb0NvbW1pdCA9IGFzeW5jICgpID0+IHtcbiAgICByZXR1cm4gIWF3YWl0IHRoaXMucHJvcHMuZW5zdXJlR2l0VGFiKCk7XG4gIH1cblxuICBjb21taXQgPSAobWVzc2FnZSwgb3B0aW9ucykgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY29tbWl0KG1lc3NhZ2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMgPSAoc2VsZWN0ZWRDb0F1dGhvcnMsIG5ld0F1dGhvcikgPT4ge1xuICAgIGlmIChuZXdBdXRob3IpIHtcbiAgICAgIHRoaXMudXNlclN0b3JlLmFkZFVzZXJzKFtuZXdBdXRob3JdKTtcbiAgICAgIHNlbGVjdGVkQ29BdXRob3JzID0gc2VsZWN0ZWRDb0F1dGhvcnMuY29uY2F0KFtuZXdBdXRob3JdKTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRDb0F1dGhvcnN9KTtcbiAgfVxuXG4gIHVuZG9MYXN0Q29tbWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlcG8gPSB0aGlzLnByb3BzLnJlcG9zaXRvcnk7XG4gICAgY29uc3QgbGFzdENvbW1pdCA9IGF3YWl0IHJlcG8uZ2V0TGFzdENvbW1pdCgpO1xuICAgIGlmIChsYXN0Q29tbWl0LmlzVW5ib3JuUmVmKCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGF3YWl0IHJlcG8udW5kb0xhc3RDb21taXQoKTtcbiAgICByZXBvLnNldENvbW1pdE1lc3NhZ2UobGFzdENvbW1pdC5nZXRGdWxsTWVzc2FnZSgpKTtcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzKGxhc3RDb21taXQuZ2V0Q29BdXRob3JzKCkpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhYm9ydE1lcmdlID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNob2ljZSA9IHRoaXMucHJvcHMuY29uZmlybSh7XG4gICAgICBtZXNzYWdlOiAnQWJvcnQgbWVyZ2UnLFxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiAnQXJlIHlvdSBzdXJlPycsXG4gICAgICBidXR0b25zOiBbJ0Fib3J0JywgJ0NhbmNlbCddLFxuICAgIH0pO1xuICAgIGlmIChjaG9pY2UgIT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmFib3J0TWVyZ2UoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5jb2RlID09PSAnRURJUlRZU1RBR0VEJykge1xuICAgICAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCBhYm9ydCBiZWNhdXNlICR7ZS5wYXRofSBpcyBib3RoIGRpcnR5IGFuZCBzdGFnZWQuYCxcbiAgICAgICAgICB7ZGlzbWlzc2FibGU6IHRydWV9LFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNvbHZlQXNPdXJzID0gYXN5bmMgcGF0aHMgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmZldGNoSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNpZGUgPSB0aGlzLnByb3BzLmlzUmViYXNpbmcgPyAndGhlaXJzJyA6ICdvdXJzJztcbiAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY2hlY2tvdXRTaWRlKHNpZGUsIHBhdGhzKTtcbiAgICB0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZmFsc2UsIHRydWUpO1xuICB9XG5cbiAgcmVzb2x2ZUFzVGhlaXJzID0gYXN5bmMgcGF0aHMgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmZldGNoSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNpZGUgPSB0aGlzLnByb3BzLmlzUmViYXNpbmcgPyAnb3VycycgOiAndGhlaXJzJztcbiAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY2hlY2tvdXRTaWRlKHNpZGUsIHBhdGhzKTtcbiAgICB0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZmFsc2UsIHRydWUpO1xuICB9XG5cbiAgY2hlY2tvdXQgPSAoYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY2hlY2tvdXQoYnJhbmNoTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICByZW1lbWJlckxhc3RGb2N1cyA9IGV2ZW50ID0+IHtcbiAgICB0aGlzLmxhc3RGb2N1cyA9IHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LmdldEZvY3VzKGV2ZW50LnRhcmdldCkpLmdldE9yKG51bGwpIHx8IEdpdFRhYlZpZXcuZm9jdXMuU1RBR0lORztcbiAgfVxuXG4gIHRvZ2dsZUlkZW50aXR5RWRpdG9yID0gKCkgPT4gdGhpcy5zZXRTdGF0ZShiZWZvcmUgPT4gKHtlZGl0aW5nSWRlbnRpdHk6ICFiZWZvcmUuZWRpdGluZ0lkZW50aXR5fSkpXG5cbiAgY2xvc2VJZGVudGl0eUVkaXRvciA9ICgpID0+IHRoaXMuc2V0U3RhdGUoe2VkaXRpbmdJZGVudGl0eTogZmFsc2V9KVxuXG4gIHNldExvY2FsSWRlbnRpdHkgPSAoKSA9PiB0aGlzLnNldElkZW50aXR5KHt9KTtcblxuICBzZXRHbG9iYWxJZGVudGl0eSA9ICgpID0+IHRoaXMuc2V0SWRlbnRpdHkoe2dsb2JhbDogdHJ1ZX0pO1xuXG4gIGFzeW5jIHNldElkZW50aXR5KG9wdGlvbnMpIHtcbiAgICBjb25zdCBuZXdVc2VybmFtZSA9IHRoaXMudXNlcm5hbWVCdWZmZXIuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IG5ld0VtYWlsID0gdGhpcy5lbWFpbEJ1ZmZlci5nZXRUZXh0KCk7XG5cbiAgICBpZiAobmV3VXNlcm5hbWUubGVuZ3RoID4gMCB8fCBvcHRpb25zLmdsb2JhbCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNldENvbmZpZygndXNlci5uYW1lJywgbmV3VXNlcm5hbWUsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkudW5zZXRDb25maWcoJ3VzZXIubmFtZScpO1xuICAgIH1cblxuICAgIGlmIChuZXdFbWFpbC5sZW5ndGggPiAwIHx8IG9wdGlvbnMuZ2xvYmFsKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2V0Q29uZmlnKCd1c2VyLmVtYWlsJywgbmV3RW1haWwsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkudW5zZXRDb25maWcoJ3VzZXIuZW1haWwnKTtcbiAgICB9XG4gICAgdGhpcy5jbG9zZUlkZW50aXR5RWRpdG9yKCk7XG4gIH1cblxuICByZXN0b3JlRm9jdXMoKSB7XG4gICAgdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuc2V0Rm9jdXModGhpcy5sYXN0Rm9jdXMpKTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgd2FzQWN0aXZhdGVkKGlzU3RpbGxBY3RpdmUpIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIGlzU3RpbGxBY3RpdmUoKSAmJiB0aGlzLnJlc3RvcmVGb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5mb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSkuZ2V0T3IobnVsbCk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LmZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5mb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpKTtcbiAgfVxuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSkuZ2V0T3IobnVsbCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQUMsTUFBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsVUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUcsS0FBQSxHQUFBSCxPQUFBO0FBRUEsSUFBQUksV0FBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssVUFBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU0sVUFBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU8sV0FBQSxHQUFBUCxPQUFBO0FBRXVCLFNBQUFELHVCQUFBUyxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFE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