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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement(_gitTabView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9naXQtdGFiLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiR2l0VGFiQ29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJzdGFnZVN0YXR1cyIsImF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24iLCJmaWxlUGF0aHMiLCJzdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyIsInN0YWdlT3BlcmF0aW9uUHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwic2VsZWN0aW9uVXBkYXRlUHJvbWlzZSIsImZpbGVMaXN0VXBkYXRlUHJvbWlzZSIsInJlZlN0YWdpbmdWaWV3IiwibWFwIiwidmlldyIsImdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSIsImdldE9yIiwidW5zdGFnZUZpbGVzIiwic3RhZ2VGaWxlcyIsInRoZW4iLCJlbnN1cmVHaXRUYWIiLCJtZXNzYWdlIiwib3B0aW9ucyIsInJlcG9zaXRvcnkiLCJjb21taXQiLCJzZWxlY3RlZENvQXV0aG9ycyIsIm5ld0F1dGhvciIsInVzZXJTdG9yZSIsImFkZFVzZXJzIiwiY29uY2F0Iiwic2V0U3RhdGUiLCJyZXBvIiwibGFzdENvbW1pdCIsImdldExhc3RDb21taXQiLCJpc1VuYm9yblJlZiIsInVuZG9MYXN0Q29tbWl0Iiwic2V0Q29tbWl0TWVzc2FnZSIsImdldEZ1bGxNZXNzYWdlIiwidXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMiLCJnZXRDb0F1dGhvcnMiLCJjaG9pY2UiLCJjb25maXJtIiwiZGV0YWlsZWRNZXNzYWdlIiwiYnV0dG9ucyIsImFib3J0TWVyZ2UiLCJlIiwiY29kZSIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJhZGRFcnJvciIsInBhdGgiLCJkaXNtaXNzYWJsZSIsInBhdGhzIiwiZmV0Y2hJblByb2dyZXNzIiwic2lkZSIsImlzUmViYXNpbmciLCJjaGVja291dFNpZGUiLCJyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzIiwiYnJhbmNoTmFtZSIsImNoZWNrb3V0IiwiZXZlbnQiLCJsYXN0Rm9jdXMiLCJyZWZWaWV3IiwiZ2V0Rm9jdXMiLCJ0YXJnZXQiLCJHaXRUYWJWaWV3IiwiZm9jdXMiLCJTVEFHSU5HIiwiYmVmb3JlIiwiZWRpdGluZ0lkZW50aXR5Iiwic2V0SWRlbnRpdHkiLCJnbG9iYWwiLCJSZWZIb2xkZXIiLCJyZWZSb290Iiwic3RhdGUiLCJ1c2VybmFtZUJ1ZmZlciIsIlRleHRCdWZmZXIiLCJ0ZXh0IiwidXNlcm5hbWUiLCJyZXRhaW4iLCJlbWFpbEJ1ZmZlciIsImVtYWlsIiwiVXNlclN0b3JlIiwibG9naW4iLCJsb2dpbk1vZGVsIiwiY29uZmlnIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwiaXNQcmVzZW50IiwicmVwb3NpdG9yeURyaWZ0IiwicmVuZGVyIiwic2V0dGVyIiwicmVjZW50Q29tbWl0cyIsImlzTWVyZ2luZyIsImhhc1VuZG9IaXN0b3J5IiwiY3VycmVudEJyYW5jaCIsInVuc3RhZ2VkQ2hhbmdlcyIsInN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwiY3VycmVudFdvcmtEaXIiLCJtZXJnZU1lc3NhZ2UiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImdyYW1tYXJzIiwidG9vbHRpcHMiLCJwcm9qZWN0IiwidG9nZ2xlSWRlbnRpdHlFZGl0b3IiLCJjbG9zZUlkZW50aXR5RWRpdG9yIiwic2V0TG9jYWxJZGVudGl0eSIsInNldEdsb2JhbElkZW50aXR5Iiwib3BlbkluaXRpYWxpemVEaWFsb2ciLCJvcGVuRmlsZXMiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsInVuZG9MYXN0RGlzY2FyZCIsImNvbnRleHRMb2NrZWQiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwic2V0Q29udGV4dExvY2siLCJnZXRDdXJyZW50V29ya0RpcnMiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwiYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uIiwicHJlcGFyZVRvQ29tbWl0IiwicHVzaCIsInB1bGwiLCJmZXRjaCIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJjb21wb25lbnREaWRNb3VudCIsInJvb3QiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtZW1iZXJMYXN0Rm9jdXMiLCJjb250cm9sbGVyUmVmIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwic2V0UmVwb3NpdG9yeSIsInNldExvZ2luTW9kZWwiLCJzZXRUZXh0VmlhRGlmZiIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImluY2x1ZGVPcGVuIiwiaW5jbHVkZUNvdW50ZWQiLCJvcGVuUGF0aHMiLCJTZXQiLCJnZXRUZXh0RWRpdG9ycyIsImVkaXRvciIsImdldFBhdGgiLCJpIiwibGVuZ3RoIiwiY29uZmxpY3RQYXRoIiwiam9pbiIsImZpbGVQYXRoIiwiaGFzIiwiZ2V0UmVtYWluaW5nIiwidW5kZWZpbmVkIiwicGF0aHNUb1N0YWdlIiwibWVyZ2VNYXJrZXJzIiwiYWxsIiwiaGFzTWFya2VycyIsInBhdGhIYXNNZXJnZU1hcmtlcnMiLCJkZWxldGUiLCJBcnJheSIsImZyb20iLCJuZXdVc2VybmFtZSIsImdldFRleHQiLCJuZXdFbWFpbCIsInNldENvbmZpZyIsInVuc2V0Q29uZmlnIiwicmVzdG9yZUZvY3VzIiwic2V0Rm9jdXMiLCJoYXNGb2N1cyIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwid2FzQWN0aXZhdGVkIiwiaXNTdGlsbEFjdGl2ZSIsInByb2Nlc3MiLCJuZXh0VGljayIsImZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0iLCJzdGFnaW5nU3RhdHVzIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwiZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQiLCJxdWlldGx5U2VsZWN0SXRlbSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJDb21taXRQcm9wVHlwZSIsImFycmF5T2YiLCJib29sIiwiQnJhbmNoUHJvcFR5cGUiLCJGaWxlUGF0Y2hJdGVtUHJvcFR5cGUiLCJNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlIiwiZnVuYyIsIlJlZkhvbGRlclByb3BUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFJZSxNQUFNQSxnQkFBTixTQUErQkMsZUFBTUMsU0FBckMsQ0FBK0M7QUFrRDVEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUMxQixVQUFNRCxLQUFOLEVBQWFDLE9BQWI7O0FBRDBCLHNEQW9LREMsV0FBVyxJQUFJO0FBQ3hDLGFBQU8sS0FBS0MseUJBQUwsQ0FBK0IsQ0FBQyxHQUFELENBQS9CLEVBQXNDRCxXQUF0QyxDQUFQO0FBQ0QsS0F0SzJCOztBQUFBLHVEQXdLQSxDQUFDRSxTQUFELEVBQVlGLFdBQVosS0FBNEI7QUFDdEQsVUFBSSxLQUFLRywwQkFBVCxFQUFxQztBQUNuQyxlQUFPO0FBQ0xDLFVBQUFBLHFCQUFxQixFQUFFQyxPQUFPLENBQUNDLE9BQVIsRUFEbEI7QUFFTEMsVUFBQUEsc0JBQXNCLEVBQUVGLE9BQU8sQ0FBQ0MsT0FBUjtBQUZuQixTQUFQO0FBSUQ7O0FBRUQsV0FBS0gsMEJBQUwsR0FBa0MsSUFBbEM7QUFFQSxZQUFNSyxxQkFBcUIsR0FBRyxLQUFLQyxjQUFMLENBQW9CQyxHQUFwQixDQUF3QkMsSUFBSSxJQUFJO0FBQzVELGVBQU9BLElBQUksQ0FBQ0Msd0JBQUwsRUFBUDtBQUNELE9BRjZCLEVBRTNCQyxLQUYyQixDQUVyQlIsT0FBTyxDQUFDQyxPQUFSLEVBRnFCLENBQTlCO0FBR0EsVUFBSUYscUJBQUo7O0FBQ0EsVUFBSUosV0FBVyxLQUFLLFFBQXBCLEVBQThCO0FBQzVCSSxRQUFBQSxx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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IEdpdFRhYlZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0LXRhYi12aWV3JztcbmltcG9ydCBVc2VyU3RvcmUgZnJvbSAnLi4vbW9kZWxzL3VzZXItc3RvcmUnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge1xuICBDb21taXRQcm9wVHlwZSwgQnJhbmNoUHJvcFR5cGUsIEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSwgTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGUsXG59IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRUYWJDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIC4uLkdpdFRhYlZpZXcuZm9jdXMsXG4gIH07XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9naW5Nb2RlbDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgdXNlcm5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBlbWFpbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGxhc3RDb21taXQ6IENvbW1pdFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVjZW50Q29tbWl0czogUHJvcFR5cGVzLmFycmF5T2YoQ29tbWl0UHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzUmViYXNpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudEJyYW5jaDogQnJhbmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB1bnN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBzdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgbWVyZ2VDb25mbGljdHM6IFByb3BUeXBlcy5hcnJheU9mKE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbWVyZ2VNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZldGNoSW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50V29ya0RpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXBvc2l0b3J5RHJpZnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGdyYW1tYXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb2plY3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBlbnN1cmVHaXRUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbnRyb2xsZXJSZWY6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RGb2N1cyA9IEdpdFRhYlZpZXcuZm9jdXMuU1RBR0lORztcblxuICAgIHRoaXMucmVmVmlldyA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZTdGFnaW5nVmlldyA9IG5ldyBSZWZIb2xkZXIoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWxlY3RlZENvQXV0aG9yczogW10sXG4gICAgICBlZGl0aW5nSWRlbnRpdHk6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLnVzZXJuYW1lQnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IHByb3BzLnVzZXJuYW1lfSk7XG4gICAgdGhpcy51c2VybmFtZUJ1ZmZlci5yZXRhaW4oKTtcbiAgICB0aGlzLmVtYWlsQnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IHByb3BzLmVtYWlsfSk7XG4gICAgdGhpcy5lbWFpbEJ1ZmZlci5yZXRhaW4oKTtcblxuICAgIHRoaXMudXNlclN0b3JlID0gbmV3IFVzZXJTdG9yZSh7XG4gICAgICByZXBvc2l0b3J5OiB0aGlzLnByb3BzLnJlcG9zaXRvcnksXG4gICAgICBsb2dpbjogdGhpcy5wcm9wcy5sb2dpbk1vZGVsLFxuICAgICAgY29uZmlnOiB0aGlzLnByb3BzLmNvbmZpZyxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRpbmdJZGVudGl0eTogc3RhdGUuZWRpdGluZ0lkZW50aXR5IHx8XG4gICAgICAgICghcHJvcHMuZmV0Y2hJblByb2dyZXNzICYmIHByb3BzLnJlcG9zaXRvcnkuaXNQcmVzZW50KCkgJiYgIXByb3BzLnJlcG9zaXRvcnlEcmlmdCkgJiZcbiAgICAgICAgKHByb3BzLnVzZXJuYW1lID09PSAnJyB8fCBwcm9wcy5lbWFpbCA9PT0gJycpLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRUYWJWaWV3XG4gICAgICAgIHJlZj17dGhpcy5yZWZWaWV3LnNldHRlcn1cbiAgICAgICAgcmVmUm9vdD17dGhpcy5yZWZSb290fVxuICAgICAgICByZWZTdGFnaW5nVmlldz17dGhpcy5yZWZTdGFnaW5nVmlld31cblxuICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzfVxuICAgICAgICBlZGl0aW5nSWRlbnRpdHk9e3RoaXMuc3RhdGUuZWRpdGluZ0lkZW50aXR5fVxuICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG5cbiAgICAgICAgdXNlcm5hbWVCdWZmZXI9e3RoaXMudXNlcm5hbWVCdWZmZXJ9XG4gICAgICAgIGVtYWlsQnVmZmVyPXt0aGlzLmVtYWlsQnVmZmVyfVxuICAgICAgICBsYXN0Q29tbWl0PXt0aGlzLnByb3BzLmxhc3RDb21taXR9XG4gICAgICAgIHJlY2VudENvbW1pdHM9e3RoaXMucHJvcHMucmVjZW50Q29tbWl0c31cbiAgICAgICAgaXNNZXJnaW5nPXt0aGlzLnByb3BzLmlzTWVyZ2luZ31cbiAgICAgICAgaXNSZWJhc2luZz17dGhpcy5wcm9wcy5pc1JlYmFzaW5nfVxuICAgICAgICBoYXNVbmRvSGlzdG9yeT17dGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeX1cbiAgICAgICAgY3VycmVudEJyYW5jaD17dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNofVxuICAgICAgICB1bnN0YWdlZENoYW5nZXM9e3RoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzfVxuICAgICAgICBzdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXN9XG4gICAgICAgIG1lcmdlQ29uZmxpY3RzPXt0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzfVxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5UGF0aD17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCB8fCB0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICBtZXJnZU1lc3NhZ2U9e3RoaXMucHJvcHMubWVyZ2VNZXNzYWdlfVxuICAgICAgICB1c2VyU3RvcmU9e3RoaXMudXNlclN0b3JlfVxuICAgICAgICBzZWxlY3RlZENvQXV0aG9ycz17dGhpcy5zdGF0ZS5zZWxlY3RlZENvQXV0aG9yc31cbiAgICAgICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnN9XG5cbiAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGdyYW1tYXJzPXt0aGlzLnByb3BzLmdyYW1tYXJzfVxuICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICBwcm9qZWN0PXt0aGlzLnByb3BzLnByb2plY3R9XG4gICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICB0b2dnbGVJZGVudGl0eUVkaXRvcj17dGhpcy50b2dnbGVJZGVudGl0eUVkaXRvcn1cbiAgICAgICAgY2xvc2VJZGVudGl0eUVkaXRvcj17dGhpcy5jbG9zZUlkZW50aXR5RWRpdG9yfVxuICAgICAgICBzZXRMb2NhbElkZW50aXR5PXt0aGlzLnNldExvY2FsSWRlbnRpdHl9XG4gICAgICAgIHNldEdsb2JhbElkZW50aXR5PXt0aGlzLnNldEdsb2JhbElkZW50aXR5fVxuICAgICAgICBvcGVuSW5pdGlhbGl6ZURpYWxvZz17dGhpcy5wcm9wcy5vcGVuSW5pdGlhbGl6ZURpYWxvZ31cbiAgICAgICAgb3BlbkZpbGVzPXt0aGlzLnByb3BzLm9wZW5GaWxlc31cbiAgICAgICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM9e3RoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHN9XG4gICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cbiAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXt0aGlzLnByb3BzLmdldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17dGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzfVxuXG4gICAgICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb249e3RoaXMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbn1cbiAgICAgICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uPXt0aGlzLmF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbn1cbiAgICAgICAgcHJlcGFyZVRvQ29tbWl0PXt0aGlzLnByZXBhcmVUb0NvbW1pdH1cbiAgICAgICAgY29tbWl0PXt0aGlzLmNvbW1pdH1cbiAgICAgICAgdW5kb0xhc3RDb21taXQ9e3RoaXMudW5kb0xhc3RDb21taXR9XG4gICAgICAgIHB1c2g9e3RoaXMucHVzaH1cbiAgICAgICAgcHVsbD17dGhpcy5wdWxsfVxuICAgICAgICBmZXRjaD17dGhpcy5mZXRjaH1cbiAgICAgICAgY2hlY2tvdXQ9e3RoaXMuY2hlY2tvdXR9XG4gICAgICAgIGFib3J0TWVyZ2U9e3RoaXMuYWJvcnRNZXJnZX1cbiAgICAgICAgcmVzb2x2ZUFzT3Vycz17dGhpcy5yZXNvbHZlQXNPdXJzfVxuICAgICAgICByZXNvbHZlQXNUaGVpcnM9e3RoaXMucmVzb2x2ZUFzVGhlaXJzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCBmYWxzZSk7XG4gICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMucmVtZW1iZXJMYXN0Rm9jdXMpKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRyb2xsZXJSZWYpIHtcbiAgICAgIHRoaXMucHJvcHMuY29udHJvbGxlclJlZi5zZXR0ZXIodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHRoaXMudXNlclN0b3JlLnNldFJlcG9zaXRvcnkodGhpcy5wcm9wcy5yZXBvc2l0b3J5KTtcbiAgICB0aGlzLnVzZXJTdG9yZS5zZXRMb2dpbk1vZGVsKHRoaXMucHJvcHMubG9naW5Nb2RlbCk7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCBmYWxzZSk7XG5cbiAgICBpZiAocHJldlByb3BzLnVzZXJuYW1lICE9PSB0aGlzLnByb3BzLnVzZXJuYW1lKSB7XG4gICAgICB0aGlzLnVzZXJuYW1lQnVmZmVyLnNldFRleHRWaWFEaWZmKHRoaXMucHJvcHMudXNlcm5hbWUpO1xuICAgIH1cblxuICAgIGlmIChwcmV2UHJvcHMuZW1haWwgIT09IHRoaXMucHJvcHMuZW1haWwpIHtcbiAgICAgIHRoaXMuZW1haWxCdWZmZXIuc2V0VGV4dFZpYURpZmYodGhpcy5wcm9wcy5lbWFpbCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMucmVtZW1iZXJMYXN0Rm9jdXMpKTtcbiAgfVxuXG4gIC8qXG4gICAqIEJlZ2luIChidXQgZG9uJ3QgYXdhaXQpIGFuIGFzeW5jIGNvbmZsaWN0LWNvdW50aW5nIHRhc2sgZm9yIGVhY2ggbWVyZ2UgY29uZmxpY3QgcGF0aCB0aGF0IGhhcyBubyBjb25mbGljdFxuICAgKiBtYXJrZXIgY291bnQgeWV0LiBPbWl0IGFueSBwYXRoIHRoYXQncyBhbHJlYWR5IG9wZW4gaW4gYSBUZXh0RWRpdG9yIG9yIHRoYXQgaGFzIGFscmVhZHkgYmVlbiBjb3VudGVkLlxuICAgKlxuICAgKiBpbmNsdWRlT3BlbiAtIHVwZGF0ZSBtYXJrZXIgY291bnRzIGZvciBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgb3BlbiBpbiBUZXh0RWRpdG9yc1xuICAgKiBpbmNsdWRlQ291bnRlZCAtIHVwZGF0ZSBtYXJrZXIgY291bnRzIGZvciBmaWxlcyB0aGF0IGhhdmUgYmVlbiBjb3VudGVkIGJlZm9yZVxuICAgKi9cbiAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhpbmNsdWRlT3BlbiwgaW5jbHVkZUNvdW50ZWQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVuUGF0aHMgPSBuZXcgU2V0KFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5tYXAoZWRpdG9yID0+IGVkaXRvci5nZXRQYXRoKCkpLFxuICAgICk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbmZsaWN0UGF0aCA9IHBhdGguam9pbihcbiAgICAgICAgdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCxcbiAgICAgICAgdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c1tpXS5maWxlUGF0aCxcbiAgICAgICk7XG5cbiAgICAgIGlmICghaW5jbHVkZU9wZW4gJiYgb3BlblBhdGhzLmhhcyhjb25mbGljdFBhdGgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWluY2x1ZGVDb3VudGVkICYmIHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzLmdldFJlbWFpbmluZyhjb25mbGljdFBhdGgpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhjb25mbGljdFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiA9IHN0YWdlU3RhdHVzID0+IHtcbiAgICByZXR1cm4gdGhpcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKFsnLiddLCBzdGFnZVN0YXR1cyk7XG4gIH1cblxuICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uID0gKGZpbGVQYXRocywgc3RhZ2VTdGF0dXMpID0+IHtcbiAgICBpZiAodGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhZ2VPcGVyYXRpb25Qcm9taXNlOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgICAgc2VsZWN0aW9uVXBkYXRlUHJvbWlzZTogUHJvbWlzZS5yZXNvbHZlKCksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuXG4gICAgY29uc3QgZmlsZUxpc3RVcGRhdGVQcm9taXNlID0gdGhpcy5yZWZTdGFnaW5nVmlldy5tYXAodmlldyA9PiB7XG4gICAgICByZXR1cm4gdmlldy5nZXROZXh0TGlzdFVwZGF0ZVByb21pc2UoKTtcbiAgICB9KS5nZXRPcihQcm9taXNlLnJlc29sdmUoKSk7XG4gICAgbGV0IHN0YWdlT3BlcmF0aW9uUHJvbWlzZTtcbiAgICBpZiAoc3RhZ2VTdGF0dXMgPT09ICdzdGFnZWQnKSB7XG4gICAgICBzdGFnZU9wZXJhdGlvblByb21pc2UgPSB0aGlzLnVuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFnZU9wZXJhdGlvblByb21pc2UgPSB0aGlzLnN0YWdlRmlsZXMoZmlsZVBhdGhzKTtcbiAgICB9XG4gICAgY29uc3Qgc2VsZWN0aW9uVXBkYXRlUHJvbWlzZSA9IGZpbGVMaXN0VXBkYXRlUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7c3RhZ2VPcGVyYXRpb25Qcm9taXNlLCBzZWxlY3Rpb25VcGRhdGVQcm9taXNlfTtcbiAgfVxuXG4gIGFzeW5jIHN0YWdlRmlsZXMoZmlsZVBhdGhzKSB7XG4gICAgY29uc3QgcGF0aHNUb1N0YWdlID0gbmV3IFNldChmaWxlUGF0aHMpO1xuXG4gICAgY29uc3QgbWVyZ2VNYXJrZXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBmaWxlUGF0aHMubWFwKGFzeW5jIGZpbGVQYXRoID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICBoYXNNYXJrZXJzOiBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkucGF0aEhhc01lcmdlTWFya2VycyhmaWxlUGF0aCksXG4gICAgICAgIH07XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCB7ZmlsZVBhdGgsIGhhc01hcmtlcnN9IG9mIG1lcmdlTWFya2Vycykge1xuICAgICAgaWYgKGhhc01hcmtlcnMpIHtcbiAgICAgICAgY29uc3QgY2hvaWNlID0gdGhpcy5wcm9wcy5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnRmlsZSBjb250YWlucyBtZXJnZSBtYXJrZXJzOiAnLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogYERvIHlvdSBzdGlsbCB3YW50IHRvIHN0YWdlIHRoaXMgZmlsZT9cXG4ke2ZpbGVQYXRofWAsXG4gICAgICAgICAgYnV0dG9uczogWydTdGFnZScsICdDYW5jZWwnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjaG9pY2UgIT09IDApIHsgcGF0aHNUb1N0YWdlLmRlbGV0ZShmaWxlUGF0aCk7IH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnN0YWdlRmlsZXMoQXJyYXkuZnJvbShwYXRoc1RvU3RhZ2UpKTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnVuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgcHJlcGFyZVRvQ29tbWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgIHJldHVybiAhYXdhaXQgdGhpcy5wcm9wcy5lbnN1cmVHaXRUYWIoKTtcbiAgfVxuXG4gIGNvbW1pdCA9IChtZXNzYWdlLCBvcHRpb25zKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5jb21taXQobWVzc2FnZSwgb3B0aW9ucyk7XG4gIH1cblxuICB1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyA9IChzZWxlY3RlZENvQXV0aG9ycywgbmV3QXV0aG9yKSA9PiB7XG4gICAgaWYgKG5ld0F1dGhvcikge1xuICAgICAgdGhpcy51c2VyU3RvcmUuYWRkVXNlcnMoW25ld0F1dGhvcl0pO1xuICAgICAgc2VsZWN0ZWRDb0F1dGhvcnMgPSBzZWxlY3RlZENvQXV0aG9ycy5jb25jYXQoW25ld0F1dGhvcl0pO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3RlZENvQXV0aG9yc30pO1xuICB9XG5cbiAgdW5kb0xhc3RDb21taXQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVwbyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgICBjb25zdCBsYXN0Q29tbWl0ID0gYXdhaXQgcmVwby5nZXRMYXN0Q29tbWl0KCk7XG4gICAgaWYgKGxhc3RDb21taXQuaXNVbmJvcm5SZWYoKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgYXdhaXQgcmVwby51bmRvTGFzdENvbW1pdCgpO1xuICAgIHJlcG8uc2V0Q29tbWl0TWVzc2FnZShsYXN0Q29tbWl0LmdldEZ1bGxNZXNzYWdlKCkpO1xuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMobGFzdENvbW1pdC5nZXRDb0F1dGhvcnMoKSk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFib3J0TWVyZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY2hvaWNlID0gdGhpcy5wcm9wcy5jb25maXJtKHtcbiAgICAgIG1lc3NhZ2U6ICdBYm9ydCBtZXJnZScsXG4gICAgICBkZXRhaWxlZE1lc3NhZ2U6ICdBcmUgeW91IHN1cmU/JyxcbiAgICAgIGJ1dHRvbnM6IFsnQWJvcnQnLCAnQ2FuY2VsJ10sXG4gICAgfSk7XG4gICAgaWYgKGNob2ljZSAhPT0gMCkgeyByZXR1cm47IH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuYWJvcnRNZXJnZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLmNvZGUgPT09ICdFRElSVFlTVEFHRUQnKSB7XG4gICAgICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihcbiAgICAgICAgICBgQ2Fubm90IGFib3J0IGJlY2F1c2UgJHtlLnBhdGh9IGlzIGJvdGggZGlydHkgYW5kIHN0YWdlZC5gLFxuICAgICAgICAgIHtkaXNtaXNzYWJsZTogdHJ1ZX0sXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVBc091cnMgPSBhc3luYyBwYXRocyA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2lkZSA9IHRoaXMucHJvcHMuaXNSZWJhc2luZyA/ICd0aGVpcnMnIDogJ291cnMnO1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5jaGVja291dFNpZGUoc2lkZSwgcGF0aHMpO1xuICAgIHRoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICByZXNvbHZlQXNUaGVpcnMgPSBhc3luYyBwYXRocyA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZmV0Y2hJblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2lkZSA9IHRoaXMucHJvcHMuaXNSZWJhc2luZyA/ICdvdXJzJyA6ICd0aGVpcnMnO1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5jaGVja291dFNpZGUoc2lkZSwgcGF0aHMpO1xuICAgIHRoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBjaGVja291dCA9IChicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5jaGVja291dChicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIHJlbWVtYmVyTGFzdEZvY3VzID0gZXZlbnQgPT4ge1xuICAgIHRoaXMubGFzdEZvY3VzID0gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZ2V0Rm9jdXMoZXZlbnQudGFyZ2V0KSkuZ2V0T3IobnVsbCkgfHwgR2l0VGFiVmlldy5mb2N1cy5TVEFHSU5HO1xuICB9XG5cbiAgdG9nZ2xlSWRlbnRpdHlFZGl0b3IgPSAoKSA9PiB0aGlzLnNldFN0YXRlKGJlZm9yZSA9PiAoe2VkaXRpbmdJZGVudGl0eTogIWJlZm9yZS5lZGl0aW5nSWRlbnRpdHl9KSlcblxuICBjbG9zZUlkZW50aXR5RWRpdG9yID0gKCkgPT4gdGhpcy5zZXRTdGF0ZSh7ZWRpdGluZ0lkZW50aXR5OiBmYWxzZX0pXG5cbiAgc2V0TG9jYWxJZGVudGl0eSA9ICgpID0+IHRoaXMuc2V0SWRlbnRpdHkoe30pO1xuXG4gIHNldEdsb2JhbElkZW50aXR5ID0gKCkgPT4gdGhpcy5zZXRJZGVudGl0eSh7Z2xvYmFsOiB0cnVlfSk7XG5cbiAgYXN5bmMgc2V0SWRlbnRpdHkob3B0aW9ucykge1xuICAgIGNvbnN0IG5ld1VzZXJuYW1lID0gdGhpcy51c2VybmFtZUJ1ZmZlci5nZXRUZXh0KCk7XG4gICAgY29uc3QgbmV3RW1haWwgPSB0aGlzLmVtYWlsQnVmZmVyLmdldFRleHQoKTtcblxuICAgIGlmIChuZXdVc2VybmFtZS5sZW5ndGggPiAwIHx8IG9wdGlvbnMuZ2xvYmFsKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2V0Q29uZmlnKCd1c2VyLm5hbWUnLCBuZXdVc2VybmFtZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS51bnNldENvbmZpZygndXNlci5uYW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0VtYWlsLmxlbmd0aCA+IDAgfHwgb3B0aW9ucy5nbG9iYWwpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zZXRDb25maWcoJ3VzZXIuZW1haWwnLCBuZXdFbWFpbCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS51bnNldENvbmZpZygndXNlci5lbWFpbCcpO1xuICAgIH1cbiAgICB0aGlzLmNsb3NlSWRlbnRpdHlFZGl0b3IoKTtcbiAgfVxuXG4gIHJlc3RvcmVGb2N1cygpIHtcbiAgICB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5zZXRGb2N1cyh0aGlzLmxhc3RGb2N1cykpO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICB3YXNBY3RpdmF0ZWQoaXNTdGlsbEFjdGl2ZSkge1xuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgaXNTdGlsbEFjdGl2ZSgpICYmIHRoaXMucmVzdG9yZUZvY3VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LmZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpKS5nZXRPcihudWxsKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LmZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCkpO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpKS5nZXRPcihudWxsKTtcbiAgfVxufVxuIl19