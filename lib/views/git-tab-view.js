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
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jbGFzc25hbWVzIiwiX2F0b20iLCJfc3RhZ2luZ1ZpZXciLCJfZ2l0SWRlbnRpdHlWaWV3IiwiX2dpdFRhYkhlYWRlckNvbnRyb2xsZXIiLCJfY29tbWl0Q29udHJvbGxlciIsIl9yZWNlbnRDb21taXRzQ29udHJvbGxlciIsIl9yZWZIb2xkZXIiLCJfaGVscGVycyIsIl9wcm9wVHlwZXMyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJvIiwiZmlsdGVyIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJHaXRUYWJWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY29udGV4dCIsImF1dG9iaW5kIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWZDb21taXRDb250cm9sbGVyIiwiUmVmSG9sZGVyIiwicmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIiLCJjb21wb25lbnREaWRNb3VudCIsInJlZlJvb3QiLCJtYXAiLCJyb290IiwiYWRkIiwiY29tbWFuZHMiLCJibHVyIiwiYWR2YW5jZUZvY3VzIiwicmV0cmVhdEZvY3VzIiwicmVuZGVyIiwicmVuZGVyTWV0aG9kIiwiaXNFbXB0eSIsImlzTG9hZGluZyIsImVkaXRpbmdJZGVudGl0eSIsInJlcG9zaXRvcnkiLCJpc1Rvb0xhcmdlIiwiaGFzRGlyZWN0b3J5IiwiaXNWYWxpZFdvcmtkaXIiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsInNob3dHaXRUYWJJbml0Iiwic2hvd0dpdFRhYkxvYWRpbmciLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiY3giLCJ0YWJJbmRleCIsInJlZiIsInNldHRlciIsInJlbmRlckhlYWRlciIsImdldENvbW1pdHRlciIsImJpbmQiLCJjdXJyZW50V29ya0RpciIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiY29udGV4dExvY2tlZCIsImNoYW5nZVdvcmtpbmdEaXJlY3RvcnkiLCJzZXRDb250ZXh0TG9jayIsIm9uRGlkQ2xpY2tBdmF0YXIiLCJ0b2dnbGVJZGVudGl0eUVkaXRvciIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJvbkRpZFVwZGF0ZVJlcG8iLCJvbkRpZFVwZGF0ZSIsInJlbmRlck5vcm1hbCIsIkZyYWdtZW50IiwicmVmU3RhZ2luZ1ZpZXciLCJub3RpZmljYXRpb25NYW5hZ2VyIiwid29ya3NwYWNlIiwic3RhZ2VkQ2hhbmdlcyIsInVuc3RhZ2VkQ2hhbmdlcyIsIm1lcmdlQ29uZmxpY3RzIiwicmVzb2x1dGlvblByb2dyZXNzIiwib3BlbkZpbGVzIiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uIiwiYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uIiwidW5kb0xhc3REaXNjYXJkIiwiYWJvcnRNZXJnZSIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJsYXN0Q29tbWl0IiwiaGFzVW5kb0hpc3RvcnkiLCJpc01lcmdpbmciLCJ0b29sdGlwcyIsImNvbmZpZyIsInN0YWdlZENoYW5nZXNFeGlzdCIsIm1lcmdlQ29uZmxpY3RzRXhpc3QiLCJwcmVwYXJlVG9Db21taXQiLCJjb21taXQiLCJjdXJyZW50QnJhbmNoIiwiZ3JhbW1hcnMiLCJtZXJnZU1lc3NhZ2UiLCJ1c2VyU3RvcmUiLCJzZWxlY3RlZENvQXV0aG9ycyIsInVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzIiwiY29tbWl0cyIsInJlY2VudENvbW1pdHMiLCJ1bmRvTGFzdENvbW1pdCIsInJlbmRlclRvb0xhcmdlIiwiYXRvbSIsImJyYW5kaW5nIiwibmFtZSIsInJlbmRlclVuc3VwcG9ydGVkRGlyIiwicmVuZGVyTm9SZXBvIiwib25DbGljayIsImluaXRpYWxpemVSZXBvIiwiZGlzYWJsZWQiLCJzaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MiLCJyZW5kZXJJZGVudGl0eVZpZXciLCJ1c2VybmFtZUJ1ZmZlciIsImVtYWlsQnVmZmVyIiwiY2FuV3JpdGVMb2NhbCIsImlzUHJlc2VudCIsInNldExvY2FsIiwic2V0TG9jYWxJZGVudGl0eSIsInNldEdsb2JhbCIsInNldEdsb2JhbElkZW50aXR5IiwiY2xvc2UiLCJjbG9zZUlkZW50aXR5RWRpdG9yIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIndvcmtkaXIiLCJpc0Fic2VudCIsIm9wZW5Jbml0aWFsaXplRGlhbG9nIiwiZ2V0Rm9jdXMiLCJlbGVtZW50IiwiZm9jdXMiLCJzdWIiLCJnZXRPciIsInNldEZvY3VzIiwiZ2V0Q2VudGVyIiwiYWN0aXZhdGUiLCJldnQiLCJjdXJyZW50Rm9jdXMiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJuZXh0U2VlbiIsInN1YkhvbGRlciIsIm5leHQiLCJhZHZhbmNlRm9jdXNGcm9tIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmlvdXNTZWVuIiwicHJldmlvdXMiLCJyZXRyZWF0Rm9jdXNGcm9tIiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsImZpbGVQYXRoIiwic3RhZ2luZ1N0YXR1cyIsInF1aWV0bHlTZWxlY3RJdGVtIiwiU1RBR0lORyIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIiLCJSRUNFTlRfQ09NTUlUIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwiQ09NTUlUX1BSRVZJRVdfQlVUVE9OIiwidmlldyIsImhhc0ZvY3VzIiwiY29udGFpbnMiLCJleHBvcnRzIiwiU3RhZ2luZ1ZpZXciLCJDb21taXRDb250cm9sbGVyIiwiUmVmSG9sZGVyUHJvcFR5cGUiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImFycmF5T2YiLCJpc1JlYmFzaW5nIiwic3RyaW5nIiwiVXNlclN0b3JlUHJvcFR5cGUiLCJBdXRob3JQcm9wVHlwZSIsImZ1bmMiLCJwcm9qZWN0Il0sInNvdXJjZXMiOlsiZ2l0LXRhYi12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IFN0YWdpbmdWaWV3IGZyb20gJy4vc3RhZ2luZy12aWV3JztcbmltcG9ydCBHaXRJZGVudGl0eVZpZXcgZnJvbSAnLi9naXQtaWRlbnRpdHktdmlldyc7XG5pbXBvcnQgR2l0VGFiSGVhZGVyQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9naXQtdGFiLWhlYWRlci1jb250cm9sbGVyJztcbmltcG9ydCBDb21taXRDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NvbW1pdC1jb250cm9sbGVyJztcbmltcG9ydCBSZWNlbnRDb21taXRzQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9yZWNlbnQtY29tbWl0cy1jb250cm9sbGVyJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHtpc1ZhbGlkV29ya2RpciwgYXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtBdXRob3JQcm9wVHlwZSwgVXNlclN0b3JlUHJvcFR5cGUsIFJlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0VGFiVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBmb2N1cyA9IHtcbiAgICAuLi5TdGFnaW5nVmlldy5mb2N1cyxcbiAgICAuLi5Db21taXRDb250cm9sbGVyLmZvY3VzLFxuICAgIC4uLlJlY2VudENvbW1pdHNDb250cm9sbGVyLmZvY3VzLFxuICB9O1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVmUm9vdDogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgcmVmU3RhZ2luZ1ZpZXc6IFJlZkhvbGRlclByb3BUeXBlLFxuXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBlZGl0aW5nSWRlbnRpdHk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICB1c2VybmFtZUJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVtYWlsQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbGFzdENvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgcmVjZW50Q29tbWl0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzUmViYXNpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICB1bnN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIHN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIG1lcmdlQ29uZmxpY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZXJnZU1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdXNlclN0b3JlOiBVc2VyU3RvcmVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuYXJyYXlPZihBdXRob3JQcm9wVHlwZSksXG4gICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGdyYW1tYXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb2plY3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgdG9nZ2xlSWRlbnRpdHlFZGl0b3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0TG9jYWxJZGVudGl0eTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRHbG9iYWxJZGVudGl0eTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjbG9zZUlkZW50aXR5RWRpdG9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFib3J0TWVyZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0Q29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHByZXBhcmVUb0NvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNPdXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc1RoZWlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaW5pdGlhbGl6ZVJlcG8nLCAnYmx1cicsICdhZHZhbmNlRm9jdXMnLCAncmV0cmVhdEZvY3VzJywgJ3F1aWV0bHlTZWxlY3RJdGVtJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5yZWZDb21taXRDb250cm9sbGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLnJlZlJvb3QubWFwKHJvb3QgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIHRoaXMucHJvcHMuY29tbWFuZHMuYWRkKHJvb3QsIHtcbiAgICAgICAgICAndG9vbC1wYW5lbDp1bmZvY3VzJzogdGhpcy5ibHVyLFxuICAgICAgICAgICdjb3JlOmZvY3VzLW5leHQnOiB0aGlzLmFkdmFuY2VGb2N1cyxcbiAgICAgICAgICAnY29yZTpmb2N1cy1wcmV2aW91cyc6IHRoaXMucmV0cmVhdEZvY3VzLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHJlbmRlck1ldGhvZCA9ICdyZW5kZXJOb3JtYWwnO1xuICAgIGxldCBpc0VtcHR5ID0gZmFsc2U7XG4gICAgbGV0IGlzTG9hZGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnByb3BzLmVkaXRpbmdJZGVudGl0eSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlcklkZW50aXR5Vmlldyc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNUb29MYXJnZSgpKSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVyVG9vTGFyZ2UnO1xuICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaGFzRGlyZWN0b3J5KCkgJiZcbiAgICAgICFpc1ZhbGlkV29ya2Rpcih0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkpIHtcbiAgICAgIHJlbmRlck1ldGhvZCA9ICdyZW5kZXJVbnN1cHBvcnRlZERpcic7XG4gICAgICBpc0VtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiSW5pdCgpKSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVyTm9SZXBvJztcbiAgICAgIGlzRW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pc0xvYWRpbmcgfHwgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJMb2FkaW5nKCkpIHtcbiAgICAgIGlzTG9hZGluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUdpdCcsIHsnaXMtZW1wdHknOiBpc0VtcHR5LCAnaXMtbG9hZGluZyc6ICFpc0VtcHR5ICYmIGlzTG9hZGluZ30pfVxuICAgICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgICAgcmVmPXt0aGlzLnByb3BzLnJlZlJvb3Quc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIHt0aGlzW3JlbmRlck1ldGhvZF0oKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIZWFkZXIoKSB7XG4gICAgY29uc3Qge3JlcG9zaXRvcnl9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdFRhYkhlYWRlckNvbnRyb2xsZXJcbiAgICAgICAgZ2V0Q29tbWl0dGVyPXtyZXBvc2l0b3J5LmdldENvbW1pdHRlci5iaW5kKHJlcG9zaXRvcnkpfVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH1cbiAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXt0aGlzLnByb3BzLmdldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuXG4gICAgICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgICAgIG9uRGlkQ2xpY2tBdmF0YXI9e3RoaXMucHJvcHMudG9nZ2xlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e3RoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgICAgb25EaWRVcGRhdGVSZXBvPXtyZXBvc2l0b3J5Lm9uRGlkVXBkYXRlLmJpbmQocmVwb3NpdG9yeSl9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJOb3JtYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPFN0YWdpbmdWaWV3XG4gICAgICAgICAgcmVmPXt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LnNldHRlcn1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICBzdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXN9XG4gICAgICAgICAgdW5zdGFnZWRDaGFuZ2VzPXt0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlc31cbiAgICAgICAgICBtZXJnZUNvbmZsaWN0cz17dGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c31cbiAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5UGF0aD17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH1cbiAgICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICAgIG9wZW5GaWxlcz17dGhpcy5wcm9wcy5vcGVuRmlsZXN9XG4gICAgICAgICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM9e3RoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHN9XG4gICAgICAgICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbj17dGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9ufVxuICAgICAgICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbj17dGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb259XG4gICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICBhYm9ydE1lcmdlPXt0aGlzLnByb3BzLmFib3J0TWVyZ2V9XG4gICAgICAgICAgcmVzb2x2ZUFzT3Vycz17dGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzfVxuICAgICAgICAgIHJlc29sdmVBc1RoZWlycz17dGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnN9XG4gICAgICAgICAgbGFzdENvbW1pdD17dGhpcy5wcm9wcy5sYXN0Q29tbWl0fVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgaGFzVW5kb0hpc3Rvcnk9e3RoaXMucHJvcHMuaGFzVW5kb0hpc3Rvcnl9XG4gICAgICAgICAgaXNNZXJnaW5nPXt0aGlzLnByb3BzLmlzTWVyZ2luZ31cbiAgICAgICAgLz5cbiAgICAgICAgPENvbW1pdENvbnRyb2xsZXJcbiAgICAgICAgICByZWY9e3RoaXMucmVmQ29tbWl0Q29udHJvbGxlci5zZXR0ZXJ9XG4gICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICBzdGFnZWRDaGFuZ2VzRXhpc3Q9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwfVxuICAgICAgICAgIG1lcmdlQ29uZmxpY3RzRXhpc3Q9e3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID4gMH1cbiAgICAgICAgICBwcmVwYXJlVG9Db21taXQ9e3RoaXMucHJvcHMucHJlcGFyZVRvQ29tbWl0fVxuICAgICAgICAgIGNvbW1pdD17dGhpcy5wcm9wcy5jb21taXR9XG4gICAgICAgICAgYWJvcnRNZXJnZT17dGhpcy5wcm9wcy5hYm9ydE1lcmdlfVxuICAgICAgICAgIGN1cnJlbnRCcmFuY2g9e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaH1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICBncmFtbWFycz17dGhpcy5wcm9wcy5ncmFtbWFyc31cbiAgICAgICAgICBtZXJnZU1lc3NhZ2U9e3RoaXMucHJvcHMubWVyZ2VNZXNzYWdlfVxuICAgICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgICBsYXN0Q29tbWl0PXt0aGlzLnByb3BzLmxhc3RDb21taXR9XG4gICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgIHVzZXJTdG9yZT17dGhpcy5wcm9wcy51c2VyU3RvcmV9XG4gICAgICAgICAgc2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgICAgdXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnM9e3RoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWRDb0F1dGhvcnN9XG4gICAgICAgIC8+XG4gICAgICAgIDxSZWNlbnRDb21taXRzQ29udHJvbGxlclxuICAgICAgICAgIHJlZj17dGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlci5zZXR0ZXJ9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgY29tbWl0cz17dGhpcy5wcm9wcy5yZWNlbnRDb21taXRzfVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgdW5kb0xhc3RDb21taXQ9e3RoaXMucHJvcHMudW5kb0xhc3RDb21taXR9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIC8+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUb29MYXJnZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0IHRvby1tYW55LWNoYW5nZXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0LUxhcmdlSWNvbiBpY29uIGljb24tZGlmZlwiIC8+XG4gICAgICAgIDxoMT5Ub28gbWFueSBjaGFuZ2VzPC9oMT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbml0aWFsaXplLXJlcG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICBUaGUgcmVwb3NpdG9yeSBhdCA8c3Ryb25nPnt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRofTwvc3Ryb25nPiBoYXMgdG9vIG1hbnkgY2hhbmdlZCBmaWxlcyB0byBkaXNwbGF5XG4gICAgICAgICAgaW4ge2F0b20uYnJhbmRpbmcubmFtZX0uIEVuc3VyZSB0aGF0IHlvdSBoYXZlIHNldCB1cCBhbiBhcHByb3ByaWF0ZSA8Y29kZT4uZ2l0aWdub3JlPC9jb2RlPiBmaWxlLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJVbnN1cHBvcnRlZERpcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0IHVuc3VwcG9ydGVkLWRpcmVjdG9yeVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQtTGFyZ2VJY29uIGljb24gaWNvbi1hbGVydFwiIC8+XG4gICAgICAgIDxoMT5VbnN1cHBvcnRlZCBkaXJlY3Rvcnk8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIHthdG9tLmJyYW5kaW5nLm5hbWV9IGRvZXMgbm90IHN1cHBvcnQgbWFuYWdpbmcgR2l0IHJlcG9zaXRvcmllcyBpbiB5b3VyIGhvbWUgb3Igcm9vdCBkaXJlY3Rvcmllcy5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTm9SZXBvKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQgbm8tcmVwb3NpdG9yeVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQtTGFyZ2VJY29uIGljb24gaWNvbi1yZXBvXCIgLz5cbiAgICAgICAgPGgxPkNyZWF0ZSBSZXBvc2l0b3J5PC9oMT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbml0aWFsaXplLXJlcG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnJlcG9zaXRvcnkuaGFzRGlyZWN0b3J5KClcbiAgICAgICAgICAgICAgP1xuICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgPHNwYW4+SW5pdGlhbGl6ZSA8c3Ryb25nPnt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRofTwvc3Ryb25nPiB3aXRoIGFcbiAgICAgICAgICAgICAgICBHaXQgcmVwb3NpdG9yeTwvc3Bhbj5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICA6IDxzcGFuPkluaXRpYWxpemUgYSBuZXcgcHJvamVjdCBkaXJlY3Rvcnkgd2l0aCBhIEdpdCByZXBvc2l0b3J5PC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmluaXRpYWxpemVSZXBvfVxuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd0dpdFRhYkluaXRJblByb2dyZXNzKCl9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+XG4gICAgICAgICAge3RoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MoKVxuICAgICAgICAgICAgPyAnQ3JlYXRpbmcgcmVwb3NpdG9yeS4uLicgOiAnQ3JlYXRlIHJlcG9zaXRvcnknfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJJZGVudGl0eVZpZXcoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRJZGVudGl0eVZpZXdcbiAgICAgICAgdXNlcm5hbWVCdWZmZXI9e3RoaXMucHJvcHMudXNlcm5hbWVCdWZmZXJ9XG4gICAgICAgIGVtYWlsQnVmZmVyPXt0aGlzLnByb3BzLmVtYWlsQnVmZmVyfVxuICAgICAgICBjYW5Xcml0ZUxvY2FsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNQcmVzZW50KCl9XG4gICAgICAgIHNldExvY2FsPXt0aGlzLnByb3BzLnNldExvY2FsSWRlbnRpdHl9XG4gICAgICAgIHNldEdsb2JhbD17dGhpcy5wcm9wcy5zZXRHbG9iYWxJZGVudGl0eX1cbiAgICAgICAgY2xvc2U9e3RoaXMucHJvcHMuY2xvc2VJZGVudGl0eUVkaXRvcn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBpbml0aWFsaXplUmVwbyhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCB3b3JrZGlyID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzQWJzZW50KCkgPyBudWxsIDogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkluaXRpYWxpemVEaWFsb2cod29ya2Rpcik7XG4gIH1cblxuICBnZXRGb2N1cyhlbGVtZW50KSB7XG4gICAgZm9yIChjb25zdCByZWYgb2YgW3RoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlcl0pIHtcbiAgICAgIGNvbnN0IGZvY3VzID0gcmVmLm1hcChzdWIgPT4gc3ViLmdldEZvY3VzKGVsZW1lbnQpKS5nZXRPcihudWxsKTtcbiAgICAgIGlmIChmb2N1cyAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZm9jdXM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2V0Rm9jdXMoZm9jdXMpIHtcbiAgICBmb3IgKGNvbnN0IHJlZiBvZiBbdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldywgdGhpcy5yZWZDb21taXRDb250cm9sbGVyLCB0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyXSkge1xuICAgICAgaWYgKHJlZi5tYXAoc3ViID0+IHN1Yi5zZXRGb2N1cyhmb2N1cykpLmdldE9yKGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYmx1cigpIHtcbiAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgYXN5bmMgYWR2YW5jZUZvY3VzKGV2dCkge1xuICAgIGNvbnN0IGN1cnJlbnRGb2N1cyA9IHRoaXMuZ2V0Rm9jdXMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgbGV0IG5leHRTZWVuID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHN1YkhvbGRlciBvZiBbdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldywgdGhpcy5yZWZDb21taXRDb250cm9sbGVyLCB0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyXSkge1xuICAgICAgY29uc3QgbmV4dCA9IGF3YWl0IHN1YkhvbGRlci5tYXAoc3ViID0+IHN1Yi5hZHZhbmNlRm9jdXNGcm9tKGN1cnJlbnRGb2N1cykpLmdldE9yKG51bGwpO1xuICAgICAgaWYgKG5leHQgIT09IG51bGwgJiYgIW5leHRTZWVuKSB7XG4gICAgICAgIG5leHRTZWVuID0gdHJ1ZTtcbiAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAobmV4dCAhPT0gY3VycmVudEZvY3VzKSB7XG4gICAgICAgICAgdGhpcy5zZXRGb2N1cyhuZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJldHJlYXRGb2N1cyhldnQpIHtcbiAgICBjb25zdCBjdXJyZW50Rm9jdXMgPSB0aGlzLmdldEZvY3VzKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgIGxldCBwcmV2aW91c1NlZW4gPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3Qgc3ViSG9sZGVyIG9mIFt0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyLCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXddKSB7XG4gICAgICBjb25zdCBwcmV2aW91cyA9IGF3YWl0IHN1YkhvbGRlci5tYXAoc3ViID0+IHN1Yi5yZXRyZWF0Rm9jdXNGcm9tKGN1cnJlbnRGb2N1cykpLmdldE9yKG51bGwpO1xuICAgICAgaWYgKHByZXZpb3VzICE9PSBudWxsICYmICFwcmV2aW91c1NlZW4pIHtcbiAgICAgICAgcHJldmlvdXNTZWVuID0gdHJ1ZTtcbiAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAocHJldmlvdXMgIT09IGN1cnJlbnRGb2N1cykge1xuICAgICAgICAgIHRoaXMuc2V0Rm9jdXMocHJldmlvdXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIGF3YWl0IHRoaXMucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICAgIHRoaXMuc2V0Rm9jdXMoR2l0VGFiVmlldy5mb2N1cy5TVEFHSU5HKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCkge1xuICAgIHRoaXMuc2V0Rm9jdXMoUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIuZm9jdXMuUkVDRU5UX0NPTU1JVCk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKSB7XG4gICAgdGhpcy5zZXRGb2N1cyhHaXRUYWJWaWV3LmZvY3VzLkNPTU1JVF9QUkVWSUVXX0JVVFRPTik7XG4gIH1cblxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3Lm1hcCh2aWV3ID0+IHZpZXcucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxXQUFBLEdBQUFELHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSSxLQUFBLEdBQUFKLE9BQUE7QUFFQSxJQUFBSyxZQUFBLEdBQUFILHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBTSxnQkFBQSxHQUFBSixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQU8sdUJBQUEsR0FBQUwsc0JBQUEs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