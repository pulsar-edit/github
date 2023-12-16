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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
      getCommitter: repository.getCommitter.bind(repository)

      // Workspace
      ,
      currentWorkDir: this.props.workingDirectoryPath,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock

      // Event Handlers
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
    }, "The repository at ", _react.default.createElement("strong", null, this.props.workingDirectoryPath), " has too many changed files to display in ", atom.branding.name, ". Ensure that you have set up an appropriate ", _react.default.createElement("code", null, ".gitignore"), " file."));
  }
  renderUnsupportedDir() {
    return _react.default.createElement("div", {
      className: "github-Git unsupported-directory"
    }, _react.default.createElement("div", {
      className: "github-Git-LargeIcon icon icon-alert"
    }), _react.default.createElement("h1", null, "Unsupported directory"), _react.default.createElement("div", {
      className: "initialize-repo-description"
    }, atom.branding.name, " does not support managing Git repositories in your home or root directories."));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jbGFzc25hbWVzIiwiX2F0b20iLCJfc3RhZ2luZ1ZpZXciLCJfZ2l0SWRlbnRpdHlWaWV3IiwiX2dpdFRhYkhlYWRlckNvbnRyb2xsZXIiLCJfY29tbWl0Q29udHJvbGxlciIsIl9yZWNlbnRDb21taXRzQ29udHJvbGxlciIsIl9yZWZIb2xkZXIiLCJfaGVscGVycyIsIl9wcm9wVHlwZXMyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJvIiwiZmlsdGVyIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIk51bWJlciIsIkdpdFRhYlZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwiYXV0b2JpbmQiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsInJlZkNvbW1pdENvbnRyb2xsZXIiLCJSZWZIb2xkZXIiLCJyZWZSZWNlbnRDb21taXRzQ29udHJvbGxlciIsImNvbXBvbmVudERpZE1vdW50IiwicmVmUm9vdCIsIm1hcCIsInJvb3QiLCJhZGQiLCJjb21tYW5kcyIsImJsdXIiLCJhZHZhbmNlRm9jdXMiLCJyZXRyZWF0Rm9jdXMiLCJyZW5kZXIiLCJyZW5kZXJNZXRob2QiLCJpc0VtcHR5IiwiaXNMb2FkaW5nIiwiZWRpdGluZ0lkZW50aXR5IiwicmVwb3NpdG9yeSIsImlzVG9vTGFyZ2UiLCJoYXNEaXJlY3RvcnkiLCJpc1ZhbGlkV29ya2RpciIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwic2hvd0dpdFRhYkluaXQiLCJzaG93R2l0VGFiTG9hZGluZyIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJjeCIsInRhYkluZGV4IiwicmVmIiwic2V0dGVyIiwicmVuZGVySGVhZGVyIiwiZ2V0Q29tbWl0dGVyIiwiYmluZCIsImN1cnJlbnRXb3JrRGlyIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJnZXRDdXJyZW50V29ya0RpcnMiLCJjb250ZXh0TG9ja2VkIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwib25EaWRDbGlja0F2YXRhciIsInRvZ2dsZUlkZW50aXR5RWRpdG9yIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsIm9uRGlkVXBkYXRlUmVwbyIsIm9uRGlkVXBkYXRlIiwicmVuZGVyTm9ybWFsIiwiRnJhZ21lbnQiLCJyZWZTdGFnaW5nVmlldyIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJ3b3Jrc3BhY2UiLCJzdGFnZWRDaGFuZ2VzIiwidW5zdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJvcGVuRmlsZXMiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsImF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24iLCJhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24iLCJ1bmRvTGFzdERpc2NhcmQiLCJhYm9ydE1lcmdlIiwicmVzb2x2ZUFzT3VycyIsInJlc29sdmVBc1RoZWlycyIsImxhc3RDb21taXQiLCJoYXNVbmRvSGlzdG9yeSIsImlzTWVyZ2luZyIsInRvb2x0aXBzIiwiY29uZmlnIiwic3RhZ2VkQ2hhbmdlc0V4aXN0IiwibWVyZ2VDb25mbGljdHNFeGlzdCIsInByZXBhcmVUb0NvbW1pdCIsImNvbW1pdCIsImN1cnJlbnRCcmFuY2giLCJncmFtbWFycyIsIm1lcmdlTWVzc2FnZSIsInVzZXJTdG9yZSIsInNlbGVjdGVkQ29BdXRob3JzIiwidXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnMiLCJjb21taXRzIiwicmVjZW50Q29tbWl0cyIsInVuZG9MYXN0Q29tbWl0IiwicmVuZGVyVG9vTGFyZ2UiLCJhdG9tIiwiYnJhbmRpbmciLCJuYW1lIiwicmVuZGVyVW5zdXBwb3J0ZWREaXIiLCJyZW5kZXJOb1JlcG8iLCJvbkNsaWNrIiwiaW5pdGlhbGl6ZVJlcG8iLCJkaXNhYmxlZCIsInNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcyIsInJlbmRlcklkZW50aXR5VmlldyIsInVzZXJuYW1lQnVmZmVyIiwiZW1haWxCdWZmZXIiLCJjYW5Xcml0ZUxvY2FsIiwiaXNQcmVzZW50Iiwic2V0TG9jYWwiLCJzZXRMb2NhbElkZW50aXR5Iiwic2V0R2xvYmFsIiwic2V0R2xvYmFsSWRlbnRpdHkiLCJjbG9zZSIsImNsb3NlSWRlbnRpdHlFZGl0b3IiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwid29ya2RpciIsImlzQWJzZW50Iiwib3BlbkluaXRpYWxpemVEaWFsb2ciLCJnZXRGb2N1cyIsImVsZW1lbnQiLCJmb2N1cyIsInN1YiIsImdldE9yIiwic2V0Rm9jdXMiLCJnZXRDZW50ZXIiLCJhY3RpdmF0ZSIsImV2dCIsImN1cnJlbnRGb2N1cyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsIm5leHRTZWVuIiwic3ViSG9sZGVyIiwibmV4dCIsImFkdmFuY2VGb2N1c0Zyb20iLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2aW91c1NlZW4iLCJwcmV2aW91cyIsInJldHJlYXRGb2N1c0Zyb20iLCJmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtIiwiZmlsZVBhdGgiLCJzdGFnaW5nU3RhdHVzIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJTVEFHSU5HIiwiZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQiLCJSZWNlbnRDb21taXRzQ29udHJvbGxlciIsIlJFQ0VOVF9DT01NSVQiLCJmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24iLCJDT01NSVRfUFJFVklFV19CVVRUT04iLCJ2aWV3IiwiaGFzRm9jdXMiLCJjb250YWlucyIsImV4cG9ydHMiLCJTdGFnaW5nVmlldyIsIkNvbW1pdENvbnRyb2xsZXIiLCJSZWZIb2xkZXJQcm9wVHlwZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiYXJyYXlPZiIsImlzUmViYXNpbmciLCJzdHJpbmciLCJVc2VyU3RvcmVQcm9wVHlwZSIsIkF1dGhvclByb3BUeXBlIiwiZnVuYyIsInByb2plY3QiXSwic291cmNlcyI6WyJnaXQtdGFiLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgU3RhZ2luZ1ZpZXcgZnJvbSAnLi9zdGFnaW5nLXZpZXcnO1xuaW1wb3J0IEdpdElkZW50aXR5VmlldyBmcm9tICcuL2dpdC1pZGVudGl0eS12aWV3JztcbmltcG9ydCBHaXRUYWJIZWFkZXJDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2dpdC10YWItaGVhZGVyLWNvbnRyb2xsZXInO1xuaW1wb3J0IENvbW1pdENvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvY29tbWl0LWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlY2VudENvbW1pdHNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL3JlY2VudC1jb21taXRzLWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge2lzVmFsaWRXb3JrZGlyLCBhdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge0F1dGhvclByb3BUeXBlLCBVc2VyU3RvcmVQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRUYWJWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIC4uLlN0YWdpbmdWaWV3LmZvY3VzLFxuICAgIC4uLkNvbW1pdENvbnRyb2xsZXIuZm9jdXMsXG4gICAgLi4uUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIuZm9jdXMsXG4gIH07XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZWZSb290OiBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgICByZWZTdGFnaW5nVmlldzogUmVmSG9sZGVyUHJvcFR5cGUsXG5cbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGVkaXRpbmdJZGVudGl0eTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIHVzZXJuYW1lQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZW1haWxCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBsYXN0Q29tbWl0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY3VycmVudEJyYW5jaDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICByZWNlbnRDb21taXRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGlzTWVyZ2luZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgaXNSZWJhc2luZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLFxuICAgIHVuc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgbWVyZ2VDb25mbGljdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG1lcmdlTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB1c2VyU3RvcmU6IFVzZXJTdG9yZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5hcnJheU9mKEF1dGhvclByb3BUeXBlKSxcbiAgICB1cGRhdGVTZWxlY3RlZENvQXV0aG9yczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZ3JhbW1hcnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHJvamVjdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICB0b2dnbGVJZGVudGl0eUVkaXRvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRMb2NhbElkZW50aXR5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldEdsb2JhbElkZW50aXR5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNsb3NlSWRlbnRpdHlFZGl0b3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkluaXRpYWxpemVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYWJvcnRNZXJnZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjb21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3RDb21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcHJlcGFyZVRvQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc091cnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZUFzVGhlaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuRmlsZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0Q3VycmVudFdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdpbml0aWFsaXplUmVwbycsICdibHVyJywgJ2FkdmFuY2VGb2N1cycsICdyZXRyZWF0Rm9jdXMnLCAncXVpZXRseVNlbGVjdEl0ZW0nKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMucmVmUm9vdC5tYXAocm9vdCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgdGhpcy5wcm9wcy5jb21tYW5kcy5hZGQocm9vdCwge1xuICAgICAgICAgICd0b29sLXBhbmVsOnVuZm9jdXMnOiB0aGlzLmJsdXIsXG4gICAgICAgICAgJ2NvcmU6Zm9jdXMtbmV4dCc6IHRoaXMuYWR2YW5jZUZvY3VzLFxuICAgICAgICAgICdjb3JlOmZvY3VzLXByZXZpb3VzJzogdGhpcy5yZXRyZWF0Rm9jdXMsXG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgcmVuZGVyTWV0aG9kID0gJ3JlbmRlck5vcm1hbCc7XG4gICAgbGV0IGlzRW1wdHkgPSBmYWxzZTtcbiAgICBsZXQgaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgaWYgKHRoaXMucHJvcHMuZWRpdGluZ0lkZW50aXR5KSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVySWRlbnRpdHlWaWV3JztcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucmVwb3NpdG9yeS5pc1Rvb0xhcmdlKCkpIHtcbiAgICAgIHJlbmRlck1ldGhvZCA9ICdyZW5kZXJUb29MYXJnZSc7XG4gICAgICBpc0VtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucmVwb3NpdG9yeS5oYXNEaXJlY3RvcnkoKSAmJlxuICAgICAgIWlzVmFsaWRXb3JrZGlyKHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpKSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlclVuc3VwcG9ydGVkRGlyJztcbiAgICAgIGlzRW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJJbml0KCkpIHtcbiAgICAgIHJlbmRlck1ldGhvZCA9ICdyZW5kZXJOb1JlcG8nO1xuICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzTG9hZGluZyB8fCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd0dpdFRhYkxvYWRpbmcoKSkge1xuICAgICAgaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItR2l0Jywgeydpcy1lbXB0eSc6IGlzRW1wdHksICdpcy1sb2FkaW5nJzogIWlzRW1wdHkgJiYgaXNMb2FkaW5nfSl9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgICByZWY9e3RoaXMucHJvcHMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJIZWFkZXIoKX1cbiAgICAgICAge3RoaXNbcmVuZGVyTWV0aG9kXSgpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckhlYWRlcigpIHtcbiAgICBjb25zdCB7cmVwb3NpdG9yeX0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0VGFiSGVhZGVyQ29udHJvbGxlclxuICAgICAgICBnZXRDb21taXR0ZXI9e3JlcG9zaXRvcnkuZ2V0Q29tbWl0dGVyLmJpbmQocmVwb3NpdG9yeSl9XG5cbiAgICAgICAgLy8gV29ya3NwYWNlXG4gICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRofVxuICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e3RoaXMucHJvcHMuZ2V0Q3VycmVudFdvcmtEaXJzfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG5cbiAgICAgICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICAgICAgb25EaWRDbGlja0F2YXRhcj17dGhpcy5wcm9wcy50b2dnbGVJZGVudGl0eUVkaXRvcn1cbiAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17dGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzfVxuICAgICAgICBvbkRpZFVwZGF0ZVJlcG89e3JlcG9zaXRvcnkub25EaWRVcGRhdGUuYmluZChyZXBvc2l0b3J5KX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck5vcm1hbCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8U3RhZ2luZ1ZpZXdcbiAgICAgICAgICByZWY9e3RoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcuc2V0dGVyfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHN0YWdlZENoYW5nZXM9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc31cbiAgICAgICAgICB1bnN0YWdlZENoYW5nZXM9e3RoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzfVxuICAgICAgICAgIG1lcmdlQ29uZmxpY3RzPXt0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzfVxuICAgICAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoPXt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRofVxuICAgICAgICAgIHJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgICAgb3BlbkZpbGVzPXt0aGlzLnByb3BzLm9wZW5GaWxlc31cbiAgICAgICAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocz17dGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoc31cbiAgICAgICAgICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uPXt0aGlzLnByb3BzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb259XG4gICAgICAgICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uPXt0aGlzLnByb3BzLmF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbn1cbiAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICAgIGFib3J0TWVyZ2U9e3RoaXMucHJvcHMuYWJvcnRNZXJnZX1cbiAgICAgICAgICByZXNvbHZlQXNPdXJzPXt0aGlzLnByb3BzLnJlc29sdmVBc091cnN9XG4gICAgICAgICAgcmVzb2x2ZUFzVGhlaXJzPXt0aGlzLnByb3BzLnJlc29sdmVBc1RoZWlyc31cbiAgICAgICAgICBsYXN0Q29tbWl0PXt0aGlzLnByb3BzLmxhc3RDb21taXR9XG4gICAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgICBoYXNVbmRvSGlzdG9yeT17dGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeX1cbiAgICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICAvPlxuICAgICAgICA8Q29tbWl0Q29udHJvbGxlclxuICAgICAgICAgIHJlZj17dGhpcy5yZWZDb21taXRDb250cm9sbGVyLnNldHRlcn1cbiAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgIHN0YWdlZENoYW5nZXNFeGlzdD17dGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA+IDB9XG4gICAgICAgICAgbWVyZ2VDb25mbGljdHNFeGlzdD17dGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5sZW5ndGggPiAwfVxuICAgICAgICAgIHByZXBhcmVUb0NvbW1pdD17dGhpcy5wcm9wcy5wcmVwYXJlVG9Db21taXR9XG4gICAgICAgICAgY29tbWl0PXt0aGlzLnByb3BzLmNvbW1pdH1cbiAgICAgICAgICBhYm9ydE1lcmdlPXt0aGlzLnByb3BzLmFib3J0TWVyZ2V9XG4gICAgICAgICAgY3VycmVudEJyYW5jaD17dGhpcy5wcm9wcy5jdXJyZW50QnJhbmNofVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICAgIGdyYW1tYXJzPXt0aGlzLnByb3BzLmdyYW1tYXJzfVxuICAgICAgICAgIG1lcmdlTWVzc2FnZT17dGhpcy5wcm9wcy5tZXJnZU1lc3NhZ2V9XG4gICAgICAgICAgaXNNZXJnaW5nPXt0aGlzLnByb3BzLmlzTWVyZ2luZ31cbiAgICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICAgIGxhc3RDb21taXQ9e3RoaXMucHJvcHMubGFzdENvbW1pdH1cbiAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgdXNlclN0b3JlPXt0aGlzLnByb3BzLnVzZXJTdG9yZX1cbiAgICAgICAgICBzZWxlY3RlZENvQXV0aG9ycz17dGhpcy5wcm9wcy5zZWxlY3RlZENvQXV0aG9yc31cbiAgICAgICAgICB1cGRhdGVTZWxlY3RlZENvQXV0aG9ycz17dGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZENvQXV0aG9yc31cbiAgICAgICAgLz5cbiAgICAgICAgPFJlY2VudENvbW1pdHNDb250cm9sbGVyXG4gICAgICAgICAgcmVmPXt0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyLnNldHRlcn1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBjb21taXRzPXt0aGlzLnByb3BzLnJlY2VudENvbW1pdHN9XG4gICAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgICB1bmRvTGFzdENvbW1pdD17dGhpcy5wcm9wcy51bmRvTGFzdENvbW1pdH1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgLz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRvb0xhcmdlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQgdG9vLW1hbnktY2hhbmdlc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQtTGFyZ2VJY29uIGljb24gaWNvbi1kaWZmXCIgLz5cbiAgICAgICAgPGgxPlRvbyBtYW55IGNoYW5nZXM8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIFRoZSByZXBvc2l0b3J5IGF0IDxzdHJvbmc+e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9PC9zdHJvbmc+IGhhcyB0b28gbWFueSBjaGFuZ2VkIGZpbGVzIHRvIGRpc3BsYXlcbiAgICAgICAgICBpbiB7YXRvbS5icmFuZGluZy5uYW1lfS4gRW5zdXJlIHRoYXQgeW91IGhhdmUgc2V0IHVwIGFuIGFwcHJvcHJpYXRlIDxjb2RlPi5naXRpZ25vcmU8L2NvZGU+IGZpbGUuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclVuc3VwcG9ydGVkRGlyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQgdW5zdXBwb3J0ZWQtZGlyZWN0b3J5XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1MYXJnZUljb24gaWNvbiBpY29uLWFsZXJ0XCIgLz5cbiAgICAgICAgPGgxPlVuc3VwcG9ydGVkIGRpcmVjdG9yeTwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2F0b20uYnJhbmRpbmcubmFtZX0gZG9lcyBub3Qgc3VwcG9ydCBtYW5hZ2luZyBHaXQgcmVwb3NpdG9yaWVzIGluIHlvdXIgaG9tZSBvciByb290IGRpcmVjdG9yaWVzLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJOb1JlcG8oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdCBuby1yZXBvc2l0b3J5XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1MYXJnZUljb24gaWNvbiBpY29uLXJlcG9cIiAvPlxuICAgICAgICA8aDE+Q3JlYXRlIFJlcG9zaXRvcnk8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5oYXNEaXJlY3RvcnkoKVxuICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICA8c3Bhbj5Jbml0aWFsaXplIDxzdHJvbmc+e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9PC9zdHJvbmc+IHdpdGggYVxuICAgICAgICAgICAgICAgIEdpdCByZXBvc2l0b3J5PC9zcGFuPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogPHNwYW4+SW5pdGlhbGl6ZSBhIG5ldyBwcm9qZWN0IGRpcmVjdG9yeSB3aXRoIGEgR2l0IHJlcG9zaXRvcnk8L3NwYW4+XG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaW5pdGlhbGl6ZVJlcG99XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MoKX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcygpXG4gICAgICAgICAgICA/ICdDcmVhdGluZyByZXBvc2l0b3J5Li4uJyA6ICdDcmVhdGUgcmVwb3NpdG9yeSd9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcklkZW50aXR5VmlldygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdElkZW50aXR5Vmlld1xuICAgICAgICB1c2VybmFtZUJ1ZmZlcj17dGhpcy5wcm9wcy51c2VybmFtZUJ1ZmZlcn1cbiAgICAgICAgZW1haWxCdWZmZXI9e3RoaXMucHJvcHMuZW1haWxCdWZmZXJ9XG4gICAgICAgIGNhbldyaXRlTG9jYWw9e3RoaXMucHJvcHMucmVwb3NpdG9yeS5pc1ByZXNlbnQoKX1cbiAgICAgICAgc2V0TG9jYWw9e3RoaXMucHJvcHMuc2V0TG9jYWxJZGVudGl0eX1cbiAgICAgICAgc2V0R2xvYmFsPXt0aGlzLnByb3BzLnNldEdsb2JhbElkZW50aXR5fVxuICAgICAgICBjbG9zZT17dGhpcy5wcm9wcy5jbG9zZUlkZW50aXR5RWRpdG9yfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGluaXRpYWxpemVSZXBvKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHdvcmtkaXIgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNBYnNlbnQoKSA/IG51bGwgOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuSW5pdGlhbGl6ZURpYWxvZyh3b3JrZGlyKTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IHJlZiBvZiBbdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldywgdGhpcy5yZWZDb21taXRDb250cm9sbGVyLCB0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyXSkge1xuICAgICAgY29uc3QgZm9jdXMgPSByZWYubWFwKHN1YiA9PiBzdWIuZ2V0Rm9jdXMoZWxlbWVudCkpLmdldE9yKG51bGwpO1xuICAgICAgaWYgKGZvY3VzICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmb2N1cztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzZXRGb2N1cyhmb2N1cykge1xuICAgIGZvciAoY29uc3QgcmVmIG9mIFt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXJdKSB7XG4gICAgICBpZiAocmVmLm1hcChzdWIgPT4gc3ViLnNldEZvY3VzKGZvY3VzKSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBibHVyKCkge1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLmdldENlbnRlcigpLmFjdGl2YXRlKCk7XG4gIH1cblxuICBhc3luYyBhZHZhbmNlRm9jdXMoZXZ0KSB7XG4gICAgY29uc3QgY3VycmVudEZvY3VzID0gdGhpcy5nZXRGb2N1cyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICBsZXQgbmV4dFNlZW4gPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3Qgc3ViSG9sZGVyIG9mIFt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXJdKSB7XG4gICAgICBjb25zdCBuZXh0ID0gYXdhaXQgc3ViSG9sZGVyLm1hcChzdWIgPT4gc3ViLmFkdmFuY2VGb2N1c0Zyb20oY3VycmVudEZvY3VzKSkuZ2V0T3IobnVsbCk7XG4gICAgICBpZiAobmV4dCAhPT0gbnVsbCAmJiAhbmV4dFNlZW4pIHtcbiAgICAgICAgbmV4dFNlZW4gPSB0cnVlO1xuICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChuZXh0ICE9PSBjdXJyZW50Rm9jdXMpIHtcbiAgICAgICAgICB0aGlzLnNldEZvY3VzKG5leHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmV0cmVhdEZvY3VzKGV2dCkge1xuICAgIGNvbnN0IGN1cnJlbnRGb2N1cyA9IHRoaXMuZ2V0Rm9jdXMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgbGV0IHByZXZpb3VzU2VlbiA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBzdWJIb2xkZXIgb2YgW3RoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlld10pIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gYXdhaXQgc3ViSG9sZGVyLm1hcChzdWIgPT4gc3ViLnJldHJlYXRGb2N1c0Zyb20oY3VycmVudEZvY3VzKSkuZ2V0T3IobnVsbCk7XG4gICAgICBpZiAocHJldmlvdXMgIT09IG51bGwgJiYgIXByZXZpb3VzU2Vlbikge1xuICAgICAgICBwcmV2aW91c1NlZW4gPSB0cnVlO1xuICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChwcmV2aW91cyAhPT0gY3VycmVudEZvY3VzKSB7XG4gICAgICAgICAgdGhpcy5zZXRGb2N1cyhwcmV2aW91cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgYXdhaXQgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gICAgdGhpcy5zZXRGb2N1cyhHaXRUYWJWaWV3LmZvY3VzLlNUQUdJTkcpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSB7XG4gICAgdGhpcy5zZXRGb2N1cyhSZWNlbnRDb21taXRzQ29udHJvbGxlci5mb2N1cy5SRUNFTlRfQ09NTUlUKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpIHtcbiAgICB0aGlzLnNldEZvY3VzKEdpdFRhYlZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OKTtcbiAgfVxuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcubWFwKHZpZXcgPT4gdmlldy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLFdBQUEsR0FBQUQsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFJLEtBQUEsR0FBQUosT0FBQTtBQUVBLElBQUFLLFlBQUEsR0FBQUgsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFNLGdCQUFBLEdBQUFKLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBTyx1QkFBQSxHQUFBTCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQVEsaUJBQUEsR0FBQU4sc0JBQUEsQ0FBQUYs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