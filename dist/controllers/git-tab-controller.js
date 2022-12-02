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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9naXQtdGFiLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiR2l0VGFiQ29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJzdGFnZVN0YXR1cyIsImF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24iLCJmaWxlUGF0aHMiLCJzdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyIsInN0YWdlT3BlcmF0aW9uUHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwic2VsZWN0aW9uVXBkYXRlUHJvbWlzZSIsImZpbGVMaXN0VXBkYXRlUHJvbWlzZSIsInJlZlN0YWdpbmdWaWV3IiwibWFwIiwidmlldyIsImdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSIsImdldE9yIiwidW5zdGFnZUZpbGVzIiwic3RhZ2VGaWxlcyIsInRoZW4iLCJlbnN1cmVHaXRUYWIiLCJtZXNzYWdlIiwib3B0aW9ucyIsInJlcG9zaXRvcnkiLCJjb21taXQiLCJzZWxlY3RlZENvQXV0aG9ycyIsIm5ld0F1dGhvciIsInVzZXJTdG9yZSIsImFkZFVzZXJzIiwiY29uY2F0Iiwic2V0U3RhdGUiLCJyZXBvIiwibGFzdENvbW1pdCIsImdldExhc3RDb21taXQiLCJpc1VuYm9yblJlZiIsInVuZG9MYXN0Q29tbWl0Iiwic2V0Q29tbWl0TWVzc2FnZSIsImdldEZ1bGxNZXNzYWdlIiwidXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMiLCJnZXRDb0F1dGhvcnMiLCJjaG9pY2UiLCJjb25maXJtIiwiZGV0YWlsZWRNZXNzYWdlIiwiYnV0dG9ucyIsImFib3J0TWVyZ2UiLCJlIiwiY29kZSIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJhZGRFcnJvciIsInBhdGgiLCJkaXNtaXNzYWJsZSIsInBhdGhzIiwiZmV0Y2hJblByb2dyZXNzIiwic2lkZSIsImlzUmViYXNpbmciLCJjaGVja291dFNpZGUiLCJyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzIiwiYnJhbmNoTmFtZSIsImNoZWNrb3V0IiwiZXZlbnQiLCJsYXN0Rm9jdXMiLCJyZWZWaWV3IiwiZ2V0Rm9jdXMiLCJ0YXJnZXQiLCJHaXRUYWJWaWV3IiwiZm9jdXMiLCJTVEFHSU5HIiwiYmVmb3JlIiwiZWRpdGluZ0lkZW50aXR5Iiwic2V0SWRlbnRpdHkiLCJnbG9iYWwiLCJSZWZIb2xkZXIiLCJyZWZSb290Iiwic3RhdGUiLCJ1c2VybmFtZUJ1ZmZlciIsIlRleHRCdWZmZXIiLCJ0ZXh0IiwidXNlcm5hbWUiLCJyZXRhaW4iLCJlbWFpbEJ1ZmZlciIsImVtYWlsIiwiVXNlclN0b3JlIiwibG9naW4iLCJsb2dpbk1vZGVsIiwiY29uZmlnIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwiaXNQcmVzZW50IiwicmVwb3NpdG9yeURyaWZ0IiwicmVuZGVyIiwic2V0dGVyIiwicmVjZW50Q29tbWl0cyIsImlzTWVyZ2luZyIsImhhc1VuZG9IaXN0b3J5IiwiY3VycmVudEJyYW5jaCIsInVuc3RhZ2VkQ2hhbmdlcyIsInN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwiY3VycmVudFdvcmtEaXIiLCJtZXJnZU1lc3NhZ2UiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImdyYW1tYXJzIiwidG9vbHRpcHMiLCJwcm9qZWN0IiwidG9nZ2xlSWRlbnRpdHlFZGl0b3IiLCJjbG9zZUlkZW50aXR5RWRpdG9yIiwic2V0TG9jYWxJZGVudGl0eSIsInNldEdsb2JhbElkZW50aXR5Iiwib3BlbkluaXRpYWxpemVEaWFsb2ciLCJvcGVuRmlsZXMiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsInVuZG9MYXN0RGlzY2FyZCIsImNvbnRleHRMb2NrZWQiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwic2V0Q29udGV4dExvY2siLCJnZXRDdXJyZW50V29ya0RpcnMiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwiYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uIiwicHJlcGFyZVRvQ29tbWl0IiwicHVzaCIsInB1bGwiLCJmZXRjaCIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJjb21wb25lbnREaWRNb3VudCIsInJvb3QiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtZW1iZXJMYXN0Rm9jdXMiLCJjb250cm9sbGVyUmVmIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwic2V0UmVwb3NpdG9yeSIsInNldExvZ2luTW9kZWwiLCJzZXRUZXh0VmlhRGlmZiIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImluY2x1ZGVPcGVuIiwiaW5jbHVkZUNvdW50ZWQiLCJvcGVuUGF0aHMiLCJTZXQiLCJnZXRUZXh0RWRpdG9ycyIsImVkaXRvciIsImdldFBhdGgiLCJpIiwibGVuZ3RoIiwiY29uZmxpY3RQYXRoIiwiam9pbiIsImZpbGVQYXRoIiwiaGFzIiwiZ2V0UmVtYWluaW5nIiwidW5kZWZpbmVkIiwicGF0aHNUb1N0YWdlIiwibWVyZ2VNYXJrZXJzIiwiYWxsIiwiaGFzTWFya2VycyIsInBhdGhIYXNNZXJnZU1hcmtlcnMiLCJkZWxldGUiLCJBcnJheSIsImZyb20iLCJuZXdVc2VybmFtZSIsImdldFRleHQiLCJuZXdFbWFpbCIsInNldENvbmZpZyIsInVuc2V0Q29uZmlnIiwicmVzdG9yZUZvY3VzIiwic2V0Rm9jdXMiLCJoYXNGb2N1cyIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwid2FzQWN0aXZhdGVkIiwiaXNTdGlsbEFjdGl2ZSIsInByb2Nlc3MiLCJuZXh0VGljayIsImZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0iLCJzdGFnaW5nU3RhdHVzIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwiZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQiLCJxdWlldGx5U2VsZWN0SXRlbSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJDb21taXRQcm9wVHlwZSIsImFycmF5T2YiLCJib29sIiwiQnJhbmNoUHJvcFR5cGUiLCJGaWxlUGF0Y2hJdGVtUHJvcFR5cGUiLCJNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlIiwiZnVuYyIsIlJlZkhvbGRlclByb3BUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFJZSxNQUFNQSxnQkFBTixTQUErQkMsZUFBTUMsU0FBckMsQ0FBK0M7QUFrRDVEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUMxQixVQUFNRCxLQUFOLEVBQWFDLE9BQWI7O0FBRDBCLHNEQW9LREMsV0FBVyxJQUFJO0FBQ3hDLGFBQU8sS0FBS0MseUJBQUwsQ0FBK0IsQ0FBQyxHQUFELENBQS9CLEVBQXNDRCxXQUF0QyxDQUFQO0FBQ0QsS0F0SzJCOztBQUFBLHVEQXdLQSxDQUFDRSxTQUFELEVBQVlGLFdBQVosS0FBNEI7QUFDdEQsVUFBSSxLQUFLRywwQkFBVCxFQUFxQztBQUNuQyxlQUFPO0FBQ0xDLFVBQUFBLHFCQUFxQixFQUFFQyxPQUFPLENBQUNDLE9BQVIsRUFEbEI7QUFFTEMsVUFBQUEsc0JBQXNCLEVBQUVGLE9BQU8sQ0FBQ0MsT0FBUjtBQUZuQixTQUFQO0FBSUQ7O0FBRUQsV0FBS0gsMEJBQUwsR0FBa0MsSUFBbEM7QUFFQSxZQUFNSyxxQkFBcUIsR0FBRyxLQUFLQyxjQUFMLENBQW9CQyxHQUFwQixDQUF3QkMsSUFBSSxJQUFJO0FBQzVELGVBQU9BLElBQUksQ0FBQ0Msd0JBQUwsRUFBUDtBQUNELE9BRjZCLEVBRTNCQyxLQUYyQixDQUVyQlIsT0FBTyxDQUFDQyxPQUFSLEVBRnFCLENBQTlCO0FBR0EsVUFBSUYscUJBQUo7O0FBQ0EsVUFBSUosV0FBVyxLQUFLLFFBQXBCLEVBQThCO0FBQzVCSSxRQUFBQSxx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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgR2l0VGFiVmlldyBmcm9tICcuLi92aWV3cy9naXQtdGFiLXZpZXcnO1xuaW1wb3J0IFVzZXJTdG9yZSBmcm9tICcuLi9tb2RlbHMvdXNlci1zdG9yZSc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7XG4gIENvbW1pdFByb3BUeXBlLCBCcmFuY2hQcm9wVHlwZSwgRmlsZVBhdGNoSXRlbVByb3BUeXBlLCBNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZSxcbn0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYkNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgLi4uR2l0VGFiVmlldy5mb2N1cyxcbiAgfTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBsb2dpbk1vZGVsOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICB1c2VybmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGVtYWlsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbGFzdENvbW1pdDogQ29tbWl0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZWNlbnRDb21taXRzOiBQcm9wVHlwZXMuYXJyYXlPZihDb21taXRQcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNSZWJhc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHVuc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIHN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBtZXJnZUNvbmZsaWN0czogUHJvcFR5cGVzLmFycmF5T2YoTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZXJnZU1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZmV0Y2hJblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRXb3JrRGlyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlcG9zaXRvcnlEcmlmdDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZ3JhbW1hcnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHJvamVjdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGVuc3VyZUdpdFRhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuRmlsZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkluaXRpYWxpemVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY29udHJvbGxlclJlZjogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0Q3VycmVudFdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMubGFzdEZvY3VzID0gR2l0VGFiVmlldy5mb2N1cy5TVEFHSU5HO1xuXG4gICAgdGhpcy5yZWZWaWV3ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlN0YWdpbmdWaWV3ID0gbmV3IFJlZkhvbGRlcigpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGVkQ29BdXRob3JzOiBbXSxcbiAgICAgIGVkaXRpbmdJZGVudGl0eTogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMudXNlcm5hbWVCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcih7dGV4dDogcHJvcHMudXNlcm5hbWV9KTtcbiAgICB0aGlzLnVzZXJuYW1lQnVmZmVyLnJldGFpbigpO1xuICAgIHRoaXMuZW1haWxCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcih7dGV4dDogcHJvcHMuZW1haWx9KTtcbiAgICB0aGlzLmVtYWlsQnVmZmVyLnJldGFpbigpO1xuXG4gICAgdGhpcy51c2VyU3RvcmUgPSBuZXcgVXNlclN0b3JlKHtcbiAgICAgIHJlcG9zaXRvcnk6IHRoaXMucHJvcHMucmVwb3NpdG9yeSxcbiAgICAgIGxvZ2luOiB0aGlzLnByb3BzLmxvZ2luTW9kZWwsXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGluZ0lkZW50aXR5OiBzdGF0ZS5lZGl0aW5nSWRlbnRpdHkgfHxcbiAgICAgICAgKCFwcm9wcy5mZXRjaEluUHJvZ3Jlc3MgJiYgcHJvcHMucmVwb3NpdG9yeS5pc1ByZXNlbnQoKSAmJiAhcHJvcHMucmVwb3NpdG9yeURyaWZ0KSAmJlxuICAgICAgICAocHJvcHMudXNlcm5hbWUgPT09ICcnIHx8IHByb3BzLmVtYWlsID09PSAnJyksXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdFRhYlZpZXdcbiAgICAgICAgcmVmPXt0aGlzLnJlZlZpZXcuc2V0dGVyfVxuICAgICAgICByZWZSb290PXt0aGlzLnJlZlJvb3R9XG4gICAgICAgIHJlZlN0YWdpbmdWaWV3PXt0aGlzLnJlZlN0YWdpbmdWaWV3fVxuXG4gICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3N9XG4gICAgICAgIGVkaXRpbmdJZGVudGl0eT17dGhpcy5zdGF0ZS5lZGl0aW5nSWRlbnRpdHl9XG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cblxuICAgICAgICB1c2VybmFtZUJ1ZmZlcj17dGhpcy51c2VybmFtZUJ1ZmZlcn1cbiAgICAgICAgZW1haWxCdWZmZXI9e3RoaXMuZW1haWxCdWZmZXJ9XG4gICAgICAgIGxhc3RDb21taXQ9e3RoaXMucHJvcHMubGFzdENvbW1pdH1cbiAgICAgICAgcmVjZW50Q29tbWl0cz17dGhpcy5wcm9wcy5yZWNlbnRDb21taXRzfVxuICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICBpc1JlYmFzaW5nPXt0aGlzLnByb3BzLmlzUmViYXNpbmd9XG4gICAgICAgIGhhc1VuZG9IaXN0b3J5PXt0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5fVxuICAgICAgICBjdXJyZW50QnJhbmNoPXt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2h9XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXN9XG4gICAgICAgIHN0YWdlZENoYW5nZXM9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc31cbiAgICAgICAgbWVyZ2VDb25mbGljdHM9e3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHN9XG4gICAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoPXt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoIHx8IHRoaXMucHJvcHMuY3VycmVudFdvcmtEaXJ9XG4gICAgICAgIG1lcmdlTWVzc2FnZT17dGhpcy5wcm9wcy5tZXJnZU1lc3NhZ2V9XG4gICAgICAgIHVzZXJTdG9yZT17dGhpcy51c2VyU3RvcmV9XG4gICAgICAgIHNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnN0YXRlLnNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICB1cGRhdGVTZWxlY3RlZENvQXV0aG9ycz17dGhpcy51cGRhdGVTZWxlY3RlZENvQXV0aG9yc31cblxuICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgZ3JhbW1hcnM9e3RoaXMucHJvcHMuZ3JhbW1hcnN9XG4gICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgIHByb2plY3Q9e3RoaXMucHJvcHMucHJvamVjdH1cbiAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgIHRvZ2dsZUlkZW50aXR5RWRpdG9yPXt0aGlzLnRvZ2dsZUlkZW50aXR5RWRpdG9yfVxuICAgICAgICBjbG9zZUlkZW50aXR5RWRpdG9yPXt0aGlzLmNsb3NlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAgIHNldExvY2FsSWRlbnRpdHk9e3RoaXMuc2V0TG9jYWxJZGVudGl0eX1cbiAgICAgICAgc2V0R2xvYmFsSWRlbnRpdHk9e3RoaXMuc2V0R2xvYmFsSWRlbnRpdHl9XG4gICAgICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nPXt0aGlzLnByb3BzLm9wZW5Jbml0aWFsaXplRGlhbG9nfVxuICAgICAgICBvcGVuRmlsZXM9e3RoaXMucHJvcHMub3BlbkZpbGVzfVxuICAgICAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocz17dGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoc31cbiAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e3RoaXMucHJvcHMuZ2V0Q3VycmVudFdvcmtEaXJzfVxuICAgICAgICBvbkRpZENoYW5nZVdvcmtEaXJzPXt0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnN9XG5cbiAgICAgICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbj17dGhpcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9ufVxuICAgICAgICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb249e3RoaXMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9ufVxuICAgICAgICBwcmVwYXJlVG9Db21taXQ9e3RoaXMucHJlcGFyZVRvQ29tbWl0fVxuICAgICAgICBjb21taXQ9e3RoaXMuY29tbWl0fVxuICAgICAgICB1bmRvTGFzdENvbW1pdD17dGhpcy51bmRvTGFzdENvbW1pdH1cbiAgICAgICAgcHVzaD17dGhpcy5wdXNofVxuICAgICAgICBwdWxsPXt0aGlzLnB1bGx9XG4gICAgICAgIGZldGNoPXt0aGlzLmZldGNofVxuICAgICAgICBjaGVja291dD17dGhpcy5jaGVja291dH1cbiAgICAgICAgYWJvcnRNZXJnZT17dGhpcy5hYm9ydE1lcmdlfVxuICAgICAgICByZXNvbHZlQXNPdXJzPXt0aGlzLnJlc29sdmVBc091cnN9XG4gICAgICAgIHJlc29sdmVBc1RoZWlycz17dGhpcy5yZXNvbHZlQXNUaGVpcnN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZmFsc2UsIGZhbHNlKTtcbiAgICB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5yZW1lbWJlckxhc3RGb2N1cykpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udHJvbGxlclJlZikge1xuICAgICAgdGhpcy5wcm9wcy5jb250cm9sbGVyUmVmLnNldHRlcih0aGlzKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgdGhpcy51c2VyU3RvcmUuc2V0UmVwb3NpdG9yeSh0aGlzLnByb3BzLnJlcG9zaXRvcnkpO1xuICAgIHRoaXMudXNlclN0b3JlLnNldExvZ2luTW9kZWwodGhpcy5wcm9wcy5sb2dpbk1vZGVsKTtcbiAgICB0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZmFsc2UsIGZhbHNlKTtcblxuICAgIGlmIChwcmV2UHJvcHMudXNlcm5hbWUgIT09IHRoaXMucHJvcHMudXNlcm5hbWUpIHtcbiAgICAgIHRoaXMudXNlcm5hbWVCdWZmZXIuc2V0VGV4dFZpYURpZmYodGhpcy5wcm9wcy51c2VybmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZQcm9wcy5lbWFpbCAhPT0gdGhpcy5wcm9wcy5lbWFpbCkge1xuICAgICAgdGhpcy5lbWFpbEJ1ZmZlci5zZXRUZXh0VmlhRGlmZih0aGlzLnByb3BzLmVtYWlsKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5yZW1lbWJlckxhc3RGb2N1cykpO1xuICB9XG5cbiAgLypcbiAgICogQmVnaW4gKGJ1dCBkb24ndCBhd2FpdCkgYW4gYXN5bmMgY29uZmxpY3QtY291bnRpbmcgdGFzayBmb3IgZWFjaCBtZXJnZSBjb25mbGljdCBwYXRoIHRoYXQgaGFzIG5vIGNvbmZsaWN0XG4gICAqIG1hcmtlciBjb3VudCB5ZXQuIE9taXQgYW55IHBhdGggdGhhdCdzIGFscmVhZHkgb3BlbiBpbiBhIFRleHRFZGl0b3Igb3IgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIGNvdW50ZWQuXG4gICAqXG4gICAqIGluY2x1ZGVPcGVuIC0gdXBkYXRlIG1hcmtlciBjb3VudHMgZm9yIGZpbGVzIHRoYXQgYXJlIGN1cnJlbnRseSBvcGVuIGluIFRleHRFZGl0b3JzXG4gICAqIGluY2x1ZGVDb3VudGVkIC0gdXBkYXRlIG1hcmtlciBjb3VudHMgZm9yIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIGNvdW50ZWQgYmVmb3JlXG4gICAqL1xuICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGluY2x1ZGVPcGVuLCBpbmNsdWRlQ291bnRlZCkge1xuICAgIGlmICh0aGlzLnByb3BzLmZldGNoSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5QYXRocyA9IG5ldyBTZXQoXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLm1hcChlZGl0b3IgPT4gZWRpdG9yLmdldFBhdGgoKSksXG4gICAgKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29uZmxpY3RQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLFxuICAgICAgICB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzW2ldLmZpbGVQYXRoLFxuICAgICAgKTtcblxuICAgICAgaWYgKCFpbmNsdWRlT3BlbiAmJiBvcGVuUGF0aHMuaGFzKGNvbmZsaWN0UGF0aCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW5jbHVkZUNvdW50ZWQgJiYgdGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGNvbmZsaWN0UGF0aCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGNvbmZsaWN0UGF0aCk7XG4gICAgfVxuICB9XG5cbiAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uID0gc3RhZ2VTdGF0dXMgPT4ge1xuICAgIHJldHVybiB0aGlzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oWycuJ10sIHN0YWdlU3RhdHVzKTtcbiAgfVxuXG4gIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24gPSAoZmlsZVBhdGhzLCBzdGFnZVN0YXR1cykgPT4ge1xuICAgIGlmICh0aGlzLnN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFnZU9wZXJhdGlvblByb21pc2U6IFByb21pc2UucmVzb2x2ZSgpLFxuICAgICAgICBzZWxlY3Rpb25VcGRhdGVQcm9taXNlOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IHRydWU7XG5cbiAgICBjb25zdCBmaWxlTGlzdFVwZGF0ZVByb21pc2UgPSB0aGlzLnJlZlN0YWdpbmdWaWV3Lm1hcCh2aWV3ID0+IHtcbiAgICAgIHJldHVybiB2aWV3LmdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSgpO1xuICAgIH0pLmdldE9yKFByb21pc2UucmVzb2x2ZSgpKTtcbiAgICBsZXQgc3RhZ2VPcGVyYXRpb25Qcm9taXNlO1xuICAgIGlmIChzdGFnZVN0YXR1cyA9PT0gJ3N0YWdlZCcpIHtcbiAgICAgIHN0YWdlT3BlcmF0aW9uUHJvbWlzZSA9IHRoaXMudW5zdGFnZUZpbGVzKGZpbGVQYXRocyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YWdlT3BlcmF0aW9uUHJvbWlzZSA9IHRoaXMuc3RhZ2VGaWxlcyhmaWxlUGF0aHMpO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3Rpb25VcGRhdGVQcm9taXNlID0gZmlsZUxpc3RVcGRhdGVQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtzdGFnZU9wZXJhdGlvblByb21pc2UsIHNlbGVjdGlvblVwZGF0ZVByb21pc2V9O1xuICB9XG5cbiAgYXN5bmMgc3RhZ2VGaWxlcyhmaWxlUGF0aHMpIHtcbiAgICBjb25zdCBwYXRoc1RvU3RhZ2UgPSBuZXcgU2V0KGZpbGVQYXRocyk7XG5cbiAgICBjb25zdCBtZXJnZU1hcmtlcnMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGZpbGVQYXRocy5tYXAoYXN5bmMgZmlsZVBhdGggPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIGhhc01hcmtlcnM6IGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5wYXRoSGFzTWVyZ2VNYXJrZXJzKGZpbGVQYXRoKSxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHtmaWxlUGF0aCwgaGFzTWFya2Vyc30gb2YgbWVyZ2VNYXJrZXJzKSB7XG4gICAgICBpZiAoaGFzTWFya2Vycykge1xuICAgICAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdGaWxlIGNvbnRhaW5zIG1lcmdlIG1hcmtlcnM6ICcsXG4gICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBgRG8geW91IHN0aWxsIHdhbnQgdG8gc3RhZ2UgdGhpcyBmaWxlP1xcbiR7ZmlsZVBhdGh9YCxcbiAgICAgICAgICBidXR0b25zOiBbJ1N0YWdlJywgJ0NhbmNlbCddLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNob2ljZSAhPT0gMCkgeyBwYXRoc1RvU3RhZ2UuZGVsZXRlKGZpbGVQYXRoKTsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc3RhZ2VGaWxlcyhBcnJheS5mcm9tKHBhdGhzVG9TdGFnZSkpO1xuICB9XG5cbiAgdW5zdGFnZUZpbGVzKGZpbGVQYXRocykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkudW5zdGFnZUZpbGVzKGZpbGVQYXRocyk7XG4gIH1cblxuICBwcmVwYXJlVG9Db21taXQgPSBhc3luYyAoKSA9PiB7XG4gICAgcmV0dXJuICFhd2FpdCB0aGlzLnByb3BzLmVuc3VyZUdpdFRhYigpO1xuICB9XG5cbiAgY29tbWl0ID0gKG1lc3NhZ2UsIG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNvbW1pdChtZXNzYWdlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzID0gKHNlbGVjdGVkQ29BdXRob3JzLCBuZXdBdXRob3IpID0+IHtcbiAgICBpZiAobmV3QXV0aG9yKSB7XG4gICAgICB0aGlzLnVzZXJTdG9yZS5hZGRVc2VycyhbbmV3QXV0aG9yXSk7XG4gICAgICBzZWxlY3RlZENvQXV0aG9ycyA9IHNlbGVjdGVkQ29BdXRob3JzLmNvbmNhdChbbmV3QXV0aG9yXSk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkQ29BdXRob3JzfSk7XG4gIH1cblxuICB1bmRvTGFzdENvbW1pdCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXBvID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5O1xuICAgIGNvbnN0IGxhc3RDb21taXQgPSBhd2FpdCByZXBvLmdldExhc3RDb21taXQoKTtcbiAgICBpZiAobGFzdENvbW1pdC5pc1VuYm9yblJlZigpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBhd2FpdCByZXBvLnVuZG9MYXN0Q29tbWl0KCk7XG4gICAgcmVwby5zZXRDb21taXRNZXNzYWdlKGxhc3RDb21taXQuZ2V0RnVsbE1lc3NhZ2UoKSk7XG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZENvQXV0aG9ycyhsYXN0Q29tbWl0LmdldENvQXV0aG9ycygpKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWJvcnRNZXJnZSA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgbWVzc2FnZTogJ0Fib3J0IG1lcmdlJyxcbiAgICAgIGRldGFpbGVkTWVzc2FnZTogJ0FyZSB5b3Ugc3VyZT8nLFxuICAgICAgYnV0dG9uczogWydBYm9ydCcsICdDYW5jZWwnXSxcbiAgICB9KTtcbiAgICBpZiAoY2hvaWNlICE9PSAwKSB7IHJldHVybjsgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5hYm9ydE1lcmdlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuY29kZSA9PT0gJ0VESVJUWVNUQUdFRCcpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgYWJvcnQgYmVjYXVzZSAke2UucGF0aH0gaXMgYm90aCBkaXJ0eSBhbmQgc3RhZ2VkLmAsXG4gICAgICAgICAge2Rpc21pc3NhYmxlOiB0cnVlfSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZUFzT3VycyA9IGFzeW5jIHBhdGhzID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaWRlID0gdGhpcy5wcm9wcy5pc1JlYmFzaW5nID8gJ3RoZWlycycgOiAnb3Vycyc7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNoZWNrb3V0U2lkZShzaWRlLCBwYXRocyk7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIHJlc29sdmVBc1RoZWlycyA9IGFzeW5jIHBhdGhzID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaWRlID0gdGhpcy5wcm9wcy5pc1JlYmFzaW5nID8gJ291cnMnIDogJ3RoZWlycyc7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNoZWNrb3V0U2lkZShzaWRlLCBwYXRocyk7XG4gICAgdGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIGNoZWNrb3V0ID0gKGJyYW5jaE5hbWUsIG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNoZWNrb3V0KGJyYW5jaE5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmVtZW1iZXJMYXN0Rm9jdXMgPSBldmVudCA9PiB7XG4gICAgdGhpcy5sYXN0Rm9jdXMgPSB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5nZXRGb2N1cyhldmVudC50YXJnZXQpKS5nZXRPcihudWxsKSB8fCBHaXRUYWJWaWV3LmZvY3VzLlNUQUdJTkc7XG4gIH1cblxuICB0b2dnbGVJZGVudGl0eUVkaXRvciA9ICgpID0+IHRoaXMuc2V0U3RhdGUoYmVmb3JlID0+ICh7ZWRpdGluZ0lkZW50aXR5OiAhYmVmb3JlLmVkaXRpbmdJZGVudGl0eX0pKVxuXG4gIGNsb3NlSWRlbnRpdHlFZGl0b3IgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHtlZGl0aW5nSWRlbnRpdHk6IGZhbHNlfSlcblxuICBzZXRMb2NhbElkZW50aXR5ID0gKCkgPT4gdGhpcy5zZXRJZGVudGl0eSh7fSk7XG5cbiAgc2V0R2xvYmFsSWRlbnRpdHkgPSAoKSA9PiB0aGlzLnNldElkZW50aXR5KHtnbG9iYWw6IHRydWV9KTtcblxuICBhc3luYyBzZXRJZGVudGl0eShvcHRpb25zKSB7XG4gICAgY29uc3QgbmV3VXNlcm5hbWUgPSB0aGlzLnVzZXJuYW1lQnVmZmVyLmdldFRleHQoKTtcbiAgICBjb25zdCBuZXdFbWFpbCA9IHRoaXMuZW1haWxCdWZmZXIuZ2V0VGV4dCgpO1xuXG4gICAgaWYgKG5ld1VzZXJuYW1lLmxlbmd0aCA+IDAgfHwgb3B0aW9ucy5nbG9iYWwpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zZXRDb25maWcoJ3VzZXIubmFtZScsIG5ld1VzZXJuYW1lLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnVuc2V0Q29uZmlnKCd1c2VyLm5hbWUnKTtcbiAgICB9XG5cbiAgICBpZiAobmV3RW1haWwubGVuZ3RoID4gMCB8fCBvcHRpb25zLmdsb2JhbCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNldENvbmZpZygndXNlci5lbWFpbCcsIG5ld0VtYWlsLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnVuc2V0Q29uZmlnKCd1c2VyLmVtYWlsJyk7XG4gICAgfVxuICAgIHRoaXMuY2xvc2VJZGVudGl0eUVkaXRvcigpO1xuICB9XG5cbiAgcmVzdG9yZUZvY3VzKCkge1xuICAgIHRoaXMucmVmVmlldy5tYXAodmlldyA9PiB2aWV3LnNldEZvY3VzKHRoaXMubGFzdEZvY3VzKSk7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIHdhc0FjdGl2YXRlZChpc1N0aWxsQWN0aXZlKSB7XG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBpc1N0aWxsQWN0aXZlKCkgJiYgdGhpcy5yZXN0b3JlRm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykpLmdldE9yKG51bGwpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5mb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZWaWV3Lm1hcCh2aWV3ID0+IHZpZXcuZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSk7XG4gIH1cblxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiB0aGlzLnJlZlZpZXcubWFwKHZpZXcgPT4gdmlldy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykpLmdldE9yKG51bGwpO1xuICB9XG59XG4iXX0=