"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _atom = require("atom");

var _stagingView = _interopRequireDefault(require("./staging-view"));

var _gitIdentityView = _interopRequireDefault(require("./git-identity-view"));

var _gitTabHeaderController = _interopRequireDefault(require("../controllers/git-tab-header-controller"));

var _commitController = _interopRequireDefault(require("../controllers/commit-controller"));

var _recentCommitsController = _interopRequireDefault(require("../controllers/recent-commits-controller"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitTabView extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'initializeRepo', 'blur', 'advanceFocus', 'retreatFocus', 'quietlySelectItem');
    this.subscriptions = new _atom.CompositeDisposable();
    this.refCommitController = new _refHolder.default();
    this.refRecentCommitsController = new _refHolder.default();
  }

  componentDidMount() {
    this.props.refRoot.map(root => {
      return this.subscriptions.add(this.props.commands.add(root, {
        'tool-panel:unfocus': this.blur,
        'core:focus-next': this.advanceFocus,
        'core:focus-previous': this.retreatFocus
      }));
    });
  }

  render() {
    let renderMethod = 'renderNormal';
    let isEmpty = false;
    let isLoading = false;

    if (this.props.editingIdentity) {
      renderMethod = 'renderIdentityView';
    } else if (this.props.repository.isTooLarge()) {
      renderMethod = 'renderTooLarge';
      isEmpty = true;
    } else if (this.props.repository.hasDirectory() && !(0, _helpers.isValidWorkdir)(this.props.repository.getWorkingDirectoryPath())) {
      renderMethod = 'renderUnsupportedDir';
      isEmpty = true;
    } else if (this.props.repository.showGitTabInit()) {
      renderMethod = 'renderNoRepo';
      isEmpty = true;
    } else if (this.props.isLoading || this.props.repository.showGitTabLoading()) {
      isLoading = true;
    }

    return _react.default.createElement("div", {
      className: (0, _classnames.default)('github-Git', {
        'is-empty': isEmpty,
        'is-loading': !isEmpty && isLoading
      }),
      tabIndex: "-1",
      ref: this.props.refRoot.setter
    }, this.renderHeader(), this[renderMethod]());
  }

  renderHeader() {
    const {
      repository
    } = this.props;
    return _react.default.createElement(_gitTabHeaderController.default, {
      getCommitter: repository.getCommitter.bind(repository) // Workspace
      ,
      currentWorkDir: this.props.workingDirectoryPath,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock // Event Handlers
      ,
      onDidClickAvatar: this.props.toggleIdentityEditor,
      onDidChangeWorkDirs: this.props.onDidChangeWorkDirs,
      onDidUpdateRepo: repository.onDidUpdate.bind(repository)
    });
  }

  renderNormal() {
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_stagingView.default, {
      ref: this.props.refStagingView.setter,
      commands: this.props.commands,
      notificationManager: this.props.notificationManager,
      workspace: this.props.workspace,
      stagedChanges: this.props.stagedChanges,
      unstagedChanges: this.props.unstagedChanges,
      mergeConflicts: this.props.mergeConflicts,
      workingDirectoryPath: this.props.workingDirectoryPath,
      resolutionProgress: this.props.resolutionProgress,
      openFiles: this.props.openFiles,
      discardWorkDirChangesForPaths: this.props.discardWorkDirChangesForPaths,
      attemptFileStageOperation: this.props.attemptFileStageOperation,
      attemptStageAllOperation: this.props.attemptStageAllOperation,
      undoLastDiscard: this.props.undoLastDiscard,
      abortMerge: this.props.abortMerge,
      resolveAsOurs: this.props.resolveAsOurs,
      resolveAsTheirs: this.props.resolveAsTheirs,
      lastCommit: this.props.lastCommit,
      isLoading: this.props.isLoading,
      hasUndoHistory: this.props.hasUndoHistory,
      isMerging: this.props.isMerging
    }), _react.default.createElement(_commitController.default, {
      ref: this.refCommitController.setter,
      tooltips: this.props.tooltips,
      config: this.props.config,
      stagedChangesExist: this.props.stagedChanges.length > 0,
      mergeConflictsExist: this.props.mergeConflicts.length > 0,
      prepareToCommit: this.props.prepareToCommit,
      commit: this.props.commit,
      abortMerge: this.props.abortMerge,
      currentBranch: this.props.currentBranch,
      workspace: this.props.workspace,
      commands: this.props.commands,
      notificationManager: this.props.notificationManager,
      grammars: this.props.grammars,
      mergeMessage: this.props.mergeMessage,
      isMerging: this.props.isMerging,
      isLoading: this.props.isLoading,
      lastCommit: this.props.lastCommit,
      repository: this.props.repository,
      userStore: this.props.userStore,
      selectedCoAuthors: this.props.selectedCoAuthors,
      updateSelectedCoAuthors: this.props.updateSelectedCoAuthors
    }), _react.default.createElement(_recentCommitsController.default, {
      ref: this.refRecentCommitsController.setter,
      commands: this.props.commands,
      commits: this.props.recentCommits,
      isLoading: this.props.isLoading,
      undoLastCommit: this.props.undoLastCommit,
      workspace: this.props.workspace,
      repository: this.props.repository
    }));
  }

  renderTooLarge() {
    return _react.default.createElement("div", {
      className: "github-Git too-many-changes"
    }, _react.default.createElement("div", {
      className: "github-Git-LargeIcon icon icon-diff"
    }), _react.default.createElement("h1", null, "Too many changes"), _react.default.createElement("div", {
      className: "initialize-repo-description"
    }, "The repository at ", _react.default.createElement("strong", null, this.props.workingDirectoryPath), " has too many changed files to display in Atom. Ensure that you have set up an appropriate ", _react.default.createElement("code", null, ".gitignore"), " file."));
  }

  renderUnsupportedDir() {
    return _react.default.createElement("div", {
      className: "github-Git unsupported-directory"
    }, _react.default.createElement("div", {
      className: "github-Git-LargeIcon icon icon-alert"
    }), _react.default.createElement("h1", null, "Unsupported directory"), _react.default.createElement("div", {
      className: "initialize-repo-description"
    }, "Atom does not support managing Git repositories in your home or root directories."));
  }

  renderNoRepo() {
    return _react.default.createElement("div", {
      className: "github-Git no-repository"
    }, _react.default.createElement("div", {
      className: "github-Git-LargeIcon icon icon-repo"
    }), _react.default.createElement("h1", null, "Create Repository"), _react.default.createElement("div", {
      className: "initialize-repo-description"
    }, this.props.repository.hasDirectory() ? _react.default.createElement("span", null, "Initialize ", _react.default.createElement("strong", null, this.props.workingDirectoryPath), " with a Git repository") : _react.default.createElement("span", null, "Initialize a new project directory with a Git repository")), _react.default.createElement("button", {
      onClick: this.initializeRepo,
      disabled: this.props.repository.showGitTabInitInProgress(),
      className: "btn btn-primary"
    }, this.props.repository.showGitTabInitInProgress() ? 'Creating repository...' : 'Create repository'));
  }

  renderIdentityView() {
    return _react.default.createElement(_gitIdentityView.default, {
      usernameBuffer: this.props.usernameBuffer,
      emailBuffer: this.props.emailBuffer,
      canWriteLocal: this.props.repository.isPresent(),
      setLocal: this.props.setLocalIdentity,
      setGlobal: this.props.setGlobalIdentity,
      close: this.props.closeIdentityEditor
    });
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  initializeRepo(event) {
    event.preventDefault();
    const workdir = this.props.repository.isAbsent() ? null : this.props.repository.getWorkingDirectoryPath();
    return this.props.openInitializeDialog(workdir);
  }

  getFocus(element) {
    for (const ref of [this.props.refStagingView, this.refCommitController, this.refRecentCommitsController]) {
      const focus = ref.map(sub => sub.getFocus(element)).getOr(null);

      if (focus !== null) {
        return focus;
      }
    }

    return null;
  }

  setFocus(focus) {
    for (const ref of [this.props.refStagingView, this.refCommitController, this.refRecentCommitsController]) {
      if (ref.map(sub => sub.setFocus(focus)).getOr(false)) {
        return true;
      }
    }

    return false;
  }

  blur() {
    this.props.workspace.getCenter().activate();
  }

  async advanceFocus(evt) {
    const currentFocus = this.getFocus(document.activeElement);
    let nextSeen = false;

    for (const subHolder of [this.props.refStagingView, this.refCommitController, this.refRecentCommitsController]) {
      const next = await subHolder.map(sub => sub.advanceFocusFrom(currentFocus)).getOr(null);

      if (next !== null && !nextSeen) {
        nextSeen = true;
        evt.stopPropagation();

        if (next !== currentFocus) {
          this.setFocus(next);
        }
      }
    }
  }

  async retreatFocus(evt) {
    const currentFocus = this.getFocus(document.activeElement);
    let previousSeen = false;

    for (const subHolder of [this.refRecentCommitsController, this.refCommitController, this.props.refStagingView]) {
      const previous = await subHolder.map(sub => sub.retreatFocusFrom(currentFocus)).getOr(null);

      if (previous !== null && !previousSeen) {
        previousSeen = true;
        evt.stopPropagation();

        if (previous !== currentFocus) {
          this.setFocus(previous);
        }
      }
    }
  }

  async focusAndSelectStagingItem(filePath, stagingStatus) {
    await this.quietlySelectItem(filePath, stagingStatus);
    this.setFocus(GitTabView.focus.STAGING);
  }

  focusAndSelectRecentCommit() {
    this.setFocus(_recentCommitsController.default.focus.RECENT_COMMIT);
  }

  focusAndSelectCommitPreviewButton() {
    this.setFocus(GitTabView.focus.COMMIT_PREVIEW_BUTTON);
  }

  quietlySelectItem(filePath, stagingStatus) {
    return this.props.refStagingView.map(view => view.quietlySelectItem(filePath, stagingStatus)).getOr(false);
  }

  hasFocus() {
    return this.props.refRoot.map(root => root.contains(document.activeElement)).getOr(false);
  }

}

exports.default = GitTabView;

_defineProperty(GitTabView, "focus", _objectSpread({}, _stagingView.default.focus, {}, _commitController.default.focus, {}, _recentCommitsController.default.focus));

_defineProperty(GitTabView, "propTypes", {
  refRoot: _propTypes2.RefHolderPropType,
  refStagingView: _propTypes2.RefHolderPropType,
  repository: _propTypes.default.object.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  editingIdentity: _propTypes.default.bool.isRequired,
  usernameBuffer: _propTypes.default.object.isRequired,
  emailBuffer: _propTypes.default.object.isRequired,
  lastCommit: _propTypes.default.object.isRequired,
  currentBranch: _propTypes.default.object,
  recentCommits: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  isMerging: _propTypes.default.bool,
  isRebasing: _propTypes.default.bool,
  hasUndoHistory: _propTypes.default.bool,
  unstagedChanges: _propTypes.default.arrayOf(_propTypes.default.object),
  stagedChanges: _propTypes.default.arrayOf(_propTypes.default.object),
  mergeConflicts: _propTypes.default.arrayOf(_propTypes.default.object),
  workingDirectoryPath: _propTypes.default.string,
  mergeMessage: _propTypes.default.string,
  userStore: _propTypes2.UserStorePropType.isRequired,
  selectedCoAuthors: _propTypes.default.arrayOf(_propTypes2.AuthorPropType),
  updateSelectedCoAuthors: _propTypes.default.func.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  grammars: _propTypes.default.object.isRequired,
  resolutionProgress: _propTypes.default.object.isRequired,
  notificationManager: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  project: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  toggleIdentityEditor: _propTypes.default.func.isRequired,
  setLocalIdentity: _propTypes.default.func.isRequired,
  setGlobalIdentity: _propTypes.default.func.isRequired,
  closeIdentityEditor: _propTypes.default.func.isRequired,
  openInitializeDialog: _propTypes.default.func.isRequired,
  abortMerge: _propTypes.default.func.isRequired,
  commit: _propTypes.default.func.isRequired,
  undoLastCommit: _propTypes.default.func.isRequired,
  prepareToCommit: _propTypes.default.func.isRequired,
  resolveAsOurs: _propTypes.default.func.isRequired,
  resolveAsTheirs: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  attemptStageAllOperation: _propTypes.default.func.isRequired,
  attemptFileStageOperation: _propTypes.default.func.isRequired,
  discardWorkDirChangesForPaths: _propTypes.default.func.isRequired,
  openFiles: _propTypes.default.func.isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXQtdGFiLXZpZXcuanMiXSwibmFtZXMiOlsiR2l0VGFiVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsInJlZkNvbW1pdENvbnRyb2xsZXIiLCJSZWZIb2xkZXIiLCJyZWZSZWNlbnRDb21taXRzQ29udHJvbGxlciIsImNvbXBvbmVudERpZE1vdW50IiwicmVmUm9vdCIsIm1hcCIsInJvb3QiLCJhZGQiLCJjb21tYW5kcyIsImJsdXIiLCJhZHZhbmNlRm9jdXMiLCJyZXRyZWF0Rm9jdXMiLCJyZW5kZXIiLCJyZW5kZXJNZXRob2QiLCJpc0VtcHR5IiwiaXNMb2FkaW5nIiwiZWRpdGluZ0lkZW50aXR5IiwicmVwb3NpdG9yeSIsImlzVG9vTGFyZ2UiLCJoYXNEaXJlY3RvcnkiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsInNob3dHaXRUYWJJbml0Iiwic2hvd0dpdFRhYkxvYWRpbmciLCJzZXR0ZXIiLCJyZW5kZXJIZWFkZXIiLCJnZXRDb21taXR0ZXIiLCJiaW5kIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJnZXRDdXJyZW50V29ya0RpcnMiLCJjb250ZXh0TG9ja2VkIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwidG9nZ2xlSWRlbnRpdHlFZGl0b3IiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwib25EaWRVcGRhdGUiLCJyZW5kZXJOb3JtYWwiLCJyZWZTdGFnaW5nVmlldyIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJ3b3Jrc3BhY2UiLCJzdGFnZWRDaGFuZ2VzIiwidW5zdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJvcGVuRmlsZXMiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsImF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24iLCJhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24iLCJ1bmRvTGFzdERpc2NhcmQiLCJhYm9ydE1lcmdlIiwicmVzb2x2ZUFzT3VycyIsInJlc29sdmVBc1RoZWlycyIsImxhc3RDb21taXQiLCJoYXNVbmRvSGlzdG9yeSIsImlzTWVyZ2luZyIsInRvb2x0aXBzIiwiY29uZmlnIiwibGVuZ3RoIiwicHJlcGFyZVRvQ29tbWl0IiwiY29tbWl0IiwiY3VycmVudEJyYW5jaCIsImdyYW1tYXJzIiwibWVyZ2VNZXNzYWdlIiwidXNlclN0b3JlIiwic2VsZWN0ZWRDb0F1dGhvcnMiLCJ1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyIsInJlY2VudENvbW1pdHMiLCJ1bmRvTGFzdENvbW1pdCIsInJlbmRlclRvb0xhcmdlIiwicmVuZGVyVW5zdXBwb3J0ZWREaXIiLCJyZW5kZXJOb1JlcG8iLCJpbml0aWFsaXplUmVwbyIsInNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcyIsInJlbmRlcklkZW50aXR5VmlldyIsInVzZXJuYW1lQnVmZmVyIiwiZW1haWxCdWZmZXIiLCJpc1ByZXNlbnQiLCJzZXRMb2NhbElkZW50aXR5Iiwic2V0R2xvYmFsSWRlbnRpdHkiLCJjbG9zZUlkZW50aXR5RWRpdG9yIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIndvcmtkaXIiLCJpc0Fic2VudCIsIm9wZW5Jbml0aWFsaXplRGlhbG9nIiwiZ2V0Rm9jdXMiLCJlbGVtZW50IiwicmVmIiwiZm9jdXMiLCJzdWIiLCJnZXRPciIsInNldEZvY3VzIiwiZ2V0Q2VudGVyIiwiYWN0aXZhdGUiLCJldnQiLCJjdXJyZW50Rm9jdXMiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJuZXh0U2VlbiIsInN1YkhvbGRlciIsIm5leHQiLCJhZHZhbmNlRm9jdXNGcm9tIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmlvdXNTZWVuIiwicHJldmlvdXMiLCJyZXRyZWF0Rm9jdXNGcm9tIiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsImZpbGVQYXRoIiwic3RhZ2luZ1N0YXR1cyIsInF1aWV0bHlTZWxlY3RJdGVtIiwiU1RBR0lORyIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIiLCJSRUNFTlRfQ09NTUlUIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwiQ09NTUlUX1BSRVZJRVdfQlVUVE9OIiwidmlldyIsImhhc0ZvY3VzIiwiY29udGFpbnMiLCJTdGFnaW5nVmlldyIsIkNvbW1pdENvbnRyb2xsZXIiLCJSZWZIb2xkZXJQcm9wVHlwZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiYXJyYXlPZiIsImlzUmViYXNpbmciLCJzdHJpbmciLCJVc2VyU3RvcmVQcm9wVHlwZSIsIkF1dGhvclByb3BUeXBlIiwiZnVuYyIsInByb2plY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxVQUFOLFNBQXlCQyxlQUFNQyxTQUEvQixDQUF5QztBQWdFdERDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQWlCO0FBQzFCLFVBQU1ELEtBQU4sRUFBYUMsT0FBYjtBQUNBLDJCQUFTLElBQVQsRUFBZSxnQkFBZixFQUFpQyxNQUFqQyxFQUF5QyxjQUF6QyxFQUF5RCxjQUF6RCxFQUF5RSxtQkFBekU7QUFFQSxTQUFLQyxhQUFMLEdBQXFCLElBQUlDLHlCQUFKLEVBQXJCO0FBRUEsU0FBS0MsbUJBQUwsR0FBMkIsSUFBSUMsa0JBQUosRUFBM0I7QUFDQSxTQUFLQywwQkFBTCxHQUFrQyxJQUFJRCxrQkFBSixFQUFsQztBQUNEOztBQUVERSxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixTQUFLUCxLQUFMLENB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NUYsRUFBQUEsbUJBQW1CLEVBQUUwRixtQkFBVVMsSUFBVixDQUFlUCxVQXJEbkI7QUFzRGpCakcsRUFBQUEsa0JBQWtCLEVBQUUrRixtQkFBVVMsSUFBVixDQUFlUDtBQXREbEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IFN0YWdpbmdWaWV3IGZyb20gJy4vc3RhZ2luZy12aWV3JztcbmltcG9ydCBHaXRJZGVudGl0eVZpZXcgZnJvbSAnLi9naXQtaWRlbnRpdHktdmlldyc7XG5pbXBvcnQgR2l0VGFiSGVhZGVyQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9naXQtdGFiLWhlYWRlci1jb250cm9sbGVyJztcbmltcG9ydCBDb21taXRDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NvbW1pdC1jb250cm9sbGVyJztcbmltcG9ydCBSZWNlbnRDb21taXRzQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9yZWNlbnQtY29tbWl0cy1jb250cm9sbGVyJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHtpc1ZhbGlkV29ya2RpciwgYXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtBdXRob3JQcm9wVHlwZSwgVXNlclN0b3JlUHJvcFR5cGUsIFJlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0VGFiVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBmb2N1cyA9IHtcbiAgICAuLi5TdGFnaW5nVmlldy5mb2N1cyxcbiAgICAuLi5Db21taXRDb250cm9sbGVyLmZvY3VzLFxuICAgIC4uLlJlY2VudENvbW1pdHNDb250cm9sbGVyLmZvY3VzLFxuICB9O1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVmUm9vdDogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgcmVmU3RhZ2luZ1ZpZXc6IFJlZkhvbGRlclByb3BUeXBlLFxuXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBlZGl0aW5nSWRlbnRpdHk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICB1c2VybmFtZUJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVtYWlsQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbGFzdENvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgcmVjZW50Q29tbWl0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzUmViYXNpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICB1bnN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIHN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIG1lcmdlQ29uZmxpY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZXJnZU1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdXNlclN0b3JlOiBVc2VyU3RvcmVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuYXJyYXlPZihBdXRob3JQcm9wVHlwZSksXG4gICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGdyYW1tYXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb2plY3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgdG9nZ2xlSWRlbnRpdHlFZGl0b3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0TG9jYWxJZGVudGl0eTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRHbG9iYWxJZGVudGl0eTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjbG9zZUlkZW50aXR5RWRpdG9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFib3J0TWVyZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0Q29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHByZXBhcmVUb0NvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNPdXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc1RoZWlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaW5pdGlhbGl6ZVJlcG8nLCAnYmx1cicsICdhZHZhbmNlRm9jdXMnLCAncmV0cmVhdEZvY3VzJywgJ3F1aWV0bHlTZWxlY3RJdGVtJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5yZWZDb21taXRDb250cm9sbGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLnJlZlJvb3QubWFwKHJvb3QgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIHRoaXMucHJvcHMuY29tbWFuZHMuYWRkKHJvb3QsIHtcbiAgICAgICAgICAndG9vbC1wYW5lbDp1bmZvY3VzJzogdGhpcy5ibHVyLFxuICAgICAgICAgICdjb3JlOmZvY3VzLW5leHQnOiB0aGlzLmFkdmFuY2VGb2N1cyxcbiAgICAgICAgICAnY29yZTpmb2N1cy1wcmV2aW91cyc6IHRoaXMucmV0cmVhdEZvY3VzLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHJlbmRlck1ldGhvZCA9ICdyZW5kZXJOb3JtYWwnO1xuICAgIGxldCBpc0VtcHR5ID0gZmFsc2U7XG4gICAgbGV0IGlzTG9hZGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnByb3BzLmVkaXRpbmdJZGVudGl0eSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlcklkZW50aXR5Vmlldyc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNUb29MYXJnZSgpKSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVyVG9vTGFyZ2UnO1xuICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaGFzRGlyZWN0b3J5KCkgJiZcbiAgICAgICFpc1ZhbGlkV29ya2Rpcih0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkpIHtcbiAgICAgIHJlbmRlck1ldGhvZCA9ICdyZW5kZXJVbnN1cHBvcnRlZERpcic7XG4gICAgICBpc0VtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiSW5pdCgpKSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVyTm9SZXBvJztcbiAgICAgIGlzRW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pc0xvYWRpbmcgfHwgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJMb2FkaW5nKCkpIHtcbiAgICAgIGlzTG9hZGluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUdpdCcsIHsnaXMtZW1wdHknOiBpc0VtcHR5LCAnaXMtbG9hZGluZyc6ICFpc0VtcHR5ICYmIGlzTG9hZGluZ30pfVxuICAgICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgICAgcmVmPXt0aGlzLnByb3BzLnJlZlJvb3Quc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIHt0aGlzW3JlbmRlck1ldGhvZF0oKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIZWFkZXIoKSB7XG4gICAgY29uc3Qge3JlcG9zaXRvcnl9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdFRhYkhlYWRlckNvbnRyb2xsZXJcbiAgICAgICAgZ2V0Q29tbWl0dGVyPXtyZXBvc2l0b3J5LmdldENvbW1pdHRlci5iaW5kKHJlcG9zaXRvcnkpfVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH1cbiAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXt0aGlzLnByb3BzLmdldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuXG4gICAgICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgICAgIG9uRGlkQ2xpY2tBdmF0YXI9e3RoaXMucHJvcHMudG9nZ2xlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e3RoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgICAgb25EaWRVcGRhdGVSZXBvPXtyZXBvc2l0b3J5Lm9uRGlkVXBkYXRlLmJpbmQocmVwb3NpdG9yeSl9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJOb3JtYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPFN0YWdpbmdWaWV3XG4gICAgICAgICAgcmVmPXt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LnNldHRlcn1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICBzdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXN9XG4gICAgICAgICAgdW5zdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlc31cbiAgICAgICAgICBtZXJnZUNvbmZsaWN0cz17dGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c31cbiAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5UGF0aD17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH1cbiAgICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICAgIG9wZW5GaWxlcz17dGhpcy5wcm9wcy5vcGVuRmlsZXN9XG4gICAgICAgICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM9e3RoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHN9XG4gICAgICAgICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbj17dGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9ufVxuICAgICAgICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbj17dGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb259XG4gICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICBhYm9ydE1lcmdlPXt0aGlzLnByb3BzLmFib3J0TWVyZ2V9XG4gICAgICAgICAgcmVzb2x2ZUFzT3Vycz17dGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzfVxuICAgICAgICAgIHJlc29sdmVBc1RoZWlycz17dGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnN9XG4gICAgICAgICAgbGFzdENvbW1pdD17dGhpcy5wcm9wcy5sYXN0Q29tbWl0fVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgaGFzVW5kb0hpc3Rvcnk9e3RoaXMucHJvcHMuaGFzVW5kb0hpc3Rvcnl9XG4gICAgICAgICAgaXNNZXJnaW5nPXt0aGlzLnByb3BzLmlzTWVyZ2luZ31cbiAgICAgICAgLz5cbiAgICAgICAgPENvbW1pdENvbnRyb2xsZXJcbiAgICAgICAgICByZWY9e3RoaXMucmVmQ29tbWl0Q29udHJvbGxlci5zZXR0ZXJ9XG4gICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICBzdGFnZWRDaGFuZ2VzRXhpc3Q9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwfVxuICAgICAgICAgIG1lcmdlQ29uZmxpY3RzRXhpc3Q9e3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID4gMH1cbiAgICAgICAgICBwcmVwYXJlVG9Db21taXQ9e3RoaXMucHJvcHMucHJlcGFyZVRvQ29tbWl0fVxuICAgICAgICAgIGNvbW1pdD17dGhpcy5wcm9wcy5jb21taXR9XG4gICAgICAgICAgYWJvcnRNZXJnZT17dGhpcy5wcm9wcy5hYm9ydE1lcmdlfVxuICAgICAgICAgIGN1cnJlbnRCcmFuY2g9e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaH1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICBncmFtbWFycz17dGhpcy5wcm9wcy5ncmFtbWFyc31cbiAgICAgICAgICBtZXJnZU1lc3NhZ2U9e3RoaXMucHJvcHMubWVyZ2VNZXNzYWdlfVxuICAgICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgICBsYXN0Q29tbWl0PXt0aGlzLnByb3BzLmxhc3RDb21taXR9XG4gICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgIHVzZXJTdG9yZT17dGhpcy5wcm9wcy51c2VyU3RvcmV9XG4gICAgICAgICAgc2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgIC8+XG4gICAgICAgIDxSZWNlbnRDb21taXRzQ29udHJvbGxlclxuICAgICAgICAgIHJlZj17dGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlci5zZXR0ZXJ9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgY29tbWl0cz17dGhpcy5wcm9wcy5yZWNlbnRDb21taXRzfVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgdW5kb0xhc3RDb21taXQ9e3RoaXMucHJvcHMudW5kb0xhc3RDb21taXR9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUb29MYXJnZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0IHRvby1tYW55LWNoYW5nZXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0LUxhcmdlSWNvbiBpY29uIGljb24tZGlmZlwiIC8+XG4gICAgICAgIDxoMT5Ub28gbWFueSBjaGFuZ2VzPC9oMT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbml0aWFsaXplLXJlcG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICBUaGUgcmVwb3NpdG9yeSBhdCA8c3Ryb25nPnt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRofTwvc3Ryb25nPiBoYXMgdG9vIG1hbnkgY2hhbmdlZCBmaWxlc1xuICAgICAgICAgIHRvIGRpc3BsYXkgaW4gQXRvbS4gRW5zdXJlIHRoYXQgeW91IGhhdmUgc2V0IHVwIGFuIGFwcHJvcHJpYXRlIDxjb2RlPi5naXRpZ25vcmU8L2NvZGU+IGZpbGUuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclVuc3VwcG9ydGVkRGlyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQgdW5zdXBwb3J0ZWQtZGlyZWN0b3J5XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1MYXJnZUljb24gaWNvbiBpY29uLWFsZXJ0XCIgLz5cbiAgICAgICAgPGgxPlVuc3VwcG9ydGVkIGRpcmVjdG9yeTwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgQXRvbSBkb2VzIG5vdCBzdXBwb3J0IG1hbmFnaW5nIEdpdCByZXBvc2l0b3JpZXMgaW4geW91ciBob21lIG9yIHJvb3QgZGlyZWN0b3JpZXMuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck5vUmVwbygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0IG5vLXJlcG9zaXRvcnlcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0LUxhcmdlSWNvbiBpY29uIGljb24tcmVwb1wiIC8+XG4gICAgICAgIDxoMT5DcmVhdGUgUmVwb3NpdG9yeTwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lmhhc0RpcmVjdG9yeSgpXG4gICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIDxzcGFuPkluaXRpYWxpemUgPHN0cm9uZz57dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH08L3N0cm9uZz4gd2l0aCBhXG4gICAgICAgICAgICAgICAgR2l0IHJlcG9zaXRvcnk8L3NwYW4+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgOiA8c3Bhbj5Jbml0aWFsaXplIGEgbmV3IHByb2plY3QgZGlyZWN0b3J5IHdpdGggYSBHaXQgcmVwb3NpdG9yeTwvc3Bhbj5cbiAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17dGhpcy5pbml0aWFsaXplUmVwb31cbiAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcygpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd0dpdFRhYkluaXRJblByb2dyZXNzKClcbiAgICAgICAgICAgID8gJ0NyZWF0aW5nIHJlcG9zaXRvcnkuLi4nIDogJ0NyZWF0ZSByZXBvc2l0b3J5J31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySWRlbnRpdHlWaWV3KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0SWRlbnRpdHlWaWV3XG4gICAgICAgIHVzZXJuYW1lQnVmZmVyPXt0aGlzLnByb3BzLnVzZXJuYW1lQnVmZmVyfVxuICAgICAgICBlbWFpbEJ1ZmZlcj17dGhpcy5wcm9wcy5lbWFpbEJ1ZmZlcn1cbiAgICAgICAgY2FuV3JpdGVMb2NhbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzUHJlc2VudCgpfVxuICAgICAgICBzZXRMb2NhbD17dGhpcy5wcm9wcy5zZXRMb2NhbElkZW50aXR5fVxuICAgICAgICBzZXRHbG9iYWw9e3RoaXMucHJvcHMuc2V0R2xvYmFsSWRlbnRpdHl9XG4gICAgICAgIGNsb3NlPXt0aGlzLnByb3BzLmNsb3NlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZVJlcG8oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qgd29ya2RpciA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5pc0Fic2VudCgpID8gbnVsbCA6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5Jbml0aWFsaXplRGlhbG9nKHdvcmtkaXIpO1xuICB9XG5cbiAgZ2V0Rm9jdXMoZWxlbWVudCkge1xuICAgIGZvciAoY29uc3QgcmVmIG9mIFt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXJdKSB7XG4gICAgICBjb25zdCBmb2N1cyA9IHJlZi5tYXAoc3ViID0+IHN1Yi5nZXRGb2N1cyhlbGVtZW50KSkuZ2V0T3IobnVsbCk7XG4gICAgICBpZiAoZm9jdXMgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZvY3VzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgZm9yIChjb25zdCByZWYgb2YgW3RoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlcl0pIHtcbiAgICAgIGlmIChyZWYubWFwKHN1YiA9PiBzdWIuc2V0Rm9jdXMoZm9jdXMpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGJsdXIoKSB7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIGFzeW5jIGFkdmFuY2VGb2N1cyhldnQpIHtcbiAgICBjb25zdCBjdXJyZW50Rm9jdXMgPSB0aGlzLmdldEZvY3VzKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgIGxldCBuZXh0U2VlbiA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBzdWJIb2xkZXIgb2YgW3RoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlcl0pIHtcbiAgICAgIGNvbnN0IG5leHQgPSBhd2FpdCBzdWJIb2xkZXIubWFwKHN1YiA9PiBzdWIuYWR2YW5jZUZvY3VzRnJvbShjdXJyZW50Rm9jdXMpKS5nZXRPcihudWxsKTtcbiAgICAgIGlmIChuZXh0ICE9PSBudWxsICYmICFuZXh0U2Vlbikge1xuICAgICAgICBuZXh0U2VlbiA9IHRydWU7XG4gICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKG5leHQgIT09IGN1cnJlbnRGb2N1cykge1xuICAgICAgICAgIHRoaXMuc2V0Rm9jdXMobmV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyByZXRyZWF0Rm9jdXMoZXZ0KSB7XG4gICAgY29uc3QgY3VycmVudEZvY3VzID0gdGhpcy5nZXRGb2N1cyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICBsZXQgcHJldmlvdXNTZWVuID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHN1YkhvbGRlciBvZiBbdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlciwgdGhpcy5yZWZDb21taXRDb250cm9sbGVyLCB0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3XSkge1xuICAgICAgY29uc3QgcHJldmlvdXMgPSBhd2FpdCBzdWJIb2xkZXIubWFwKHN1YiA9PiBzdWIucmV0cmVhdEZvY3VzRnJvbShjdXJyZW50Rm9jdXMpKS5nZXRPcihudWxsKTtcbiAgICAgIGlmIChwcmV2aW91cyAhPT0gbnVsbCAmJiAhcHJldmlvdXNTZWVuKSB7XG4gICAgICAgIHByZXZpb3VzU2VlbiA9IHRydWU7XG4gICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHByZXZpb3VzICE9PSBjdXJyZW50Rm9jdXMpIHtcbiAgICAgICAgICB0aGlzLnNldEZvY3VzKHByZXZpb3VzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICBhd2FpdCB0aGlzLnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgICB0aGlzLnNldEZvY3VzKEdpdFRhYlZpZXcuZm9jdXMuU1RBR0lORyk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpIHtcbiAgICB0aGlzLnNldEZvY3VzKFJlY2VudENvbW1pdHNDb250cm9sbGVyLmZvY3VzLlJFQ0VOVF9DT01NSVQpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkge1xuICAgIHRoaXMuc2V0Rm9jdXMoR2l0VGFiVmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT04pO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldy5tYXAodmlldyA9PiB2aWV3LnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cbn1cbiJdfQ==