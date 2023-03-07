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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jbGFzc25hbWVzIiwiX2F0b20iLCJfc3RhZ2luZ1ZpZXciLCJfZ2l0SWRlbnRpdHlWaWV3IiwiX2dpdFRhYkhlYWRlckNvbnRyb2xsZXIiLCJfY29tbWl0Q29udHJvbGxlciIsIl9yZWNlbnRDb21taXRzQ29udHJvbGxlciIsIl9yZWZIb2xkZXIiLCJfaGVscGVycyIsIl9wcm9wVHlwZXMyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJub2RlSW50ZXJvcCIsIldlYWtNYXAiLCJjYWNoZUJhYmVsSW50ZXJvcCIsImNhY2hlTm9kZUludGVyb3AiLCJjYWNoZSIsImhhcyIsImdldCIsIm5ld09iaiIsImhhc1Byb3BlcnR5RGVzY3JpcHRvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZGVzYyIsInNldCIsIm93bktleXMiLCJvYmplY3QiLCJlbnVtZXJhYmxlT25seSIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiR2l0VGFiVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJhdXRvYmluZCIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwicmVmQ29tbWl0Q29udHJvbGxlciIsIlJlZkhvbGRlciIsInJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJyZWZSb290IiwibWFwIiwicm9vdCIsImFkZCIsImNvbW1hbmRzIiwiYmx1ciIsImFkdmFuY2VGb2N1cyIsInJldHJlYXRGb2N1cyIsInJlbmRlciIsInJlbmRlck1ldGhvZCIsImlzRW1wdHkiLCJpc0xvYWRpbmciLCJlZGl0aW5nSWRlbnRpdHkiLCJyZXBvc2l0b3J5IiwiaXNUb29MYXJnZSIsImhhc0RpcmVjdG9yeSIsImlzVmFsaWRXb3JrZGlyIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJzaG93R2l0VGFiSW5pdCIsInNob3dHaXRUYWJMb2FkaW5nIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImN4IiwidGFiSW5kZXgiLCJyZWYiLCJzZXR0ZXIiLCJyZW5kZXJIZWFkZXIiLCJnZXRDb21taXR0ZXIiLCJiaW5kIiwiY3VycmVudFdvcmtEaXIiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdldEN1cnJlbnRXb3JrRGlycyIsImNvbnRleHRMb2NrZWQiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwic2V0Q29udGV4dExvY2siLCJvbkRpZENsaWNrQXZhdGFyIiwidG9nZ2xlSWRlbnRpdHlFZGl0b3IiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwib25EaWRVcGRhdGVSZXBvIiwib25EaWRVcGRhdGUiLCJyZW5kZXJOb3JtYWwiLCJGcmFnbWVudCIsInJlZlN0YWdpbmdWaWV3Iiwibm90aWZpY2F0aW9uTWFuYWdlciIsIndvcmtzcGFjZSIsInN0YWdlZENoYW5nZXMiLCJ1bnN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsInJlc29sdXRpb25Qcm9ncmVzcyIsIm9wZW5GaWxlcyIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwiYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbiIsImF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiIsInVuZG9MYXN0RGlzY2FyZCIsImFib3J0TWVyZ2UiLCJyZXNvbHZlQXNPdXJzIiwicmVzb2x2ZUFzVGhlaXJzIiwibGFzdENvbW1pdCIsImhhc1VuZG9IaXN0b3J5IiwiaXNNZXJnaW5nIiwidG9vbHRpcHMiLCJjb25maWciLCJzdGFnZWRDaGFuZ2VzRXhpc3QiLCJtZXJnZUNvbmZsaWN0c0V4aXN0IiwicHJlcGFyZVRvQ29tbWl0IiwiY29tbWl0IiwiY3VycmVudEJyYW5jaCIsImdyYW1tYXJzIiwibWVyZ2VNZXNzYWdlIiwidXNlclN0b3JlIiwic2VsZWN0ZWRDb0F1dGhvcnMiLCJ1cGRhdGVTZWxlY3RlZENvQXV0aG9ycyIsImNvbW1pdHMiLCJyZWNlbnRDb21taXRzIiwidW5kb0xhc3RDb21taXQiLCJyZW5kZXJUb29MYXJnZSIsImF0b20iLCJicmFuZGluZyIsIm5hbWUiLCJyZW5kZXJVbnN1cHBvcnRlZERpciIsInJlbmRlck5vUmVwbyIsIm9uQ2xpY2siLCJpbml0aWFsaXplUmVwbyIsImRpc2FibGVkIiwic2hvd0dpdFRhYkluaXRJblByb2dyZXNzIiwicmVuZGVySWRlbnRpdHlWaWV3IiwidXNlcm5hbWVCdWZmZXIiLCJlbWFpbEJ1ZmZlciIsImNhbldyaXRlTG9jYWwiLCJpc1ByZXNlbnQiLCJzZXRMb2NhbCIsInNldExvY2FsSWRlbnRpdHkiLCJzZXRHbG9iYWwiLCJzZXRHbG9iYWxJZGVudGl0eSIsImNsb3NlIiwiY2xvc2VJZGVudGl0eUVkaXRvciIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ3b3JrZGlyIiwiaXNBYnNlbnQiLCJvcGVuSW5pdGlhbGl6ZURpYWxvZyIsImdldEZvY3VzIiwiZWxlbWVudCIsImZvY3VzIiwic3ViIiwiZ2V0T3IiLCJzZXRGb2N1cyIsImdldENlbnRlciIsImFjdGl2YXRlIiwiZXZ0IiwiY3VycmVudEZvY3VzIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwibmV4dFNlZW4iLCJzdWJIb2xkZXIiLCJuZXh0IiwiYWR2YW5jZUZvY3VzRnJvbSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZpb3VzU2VlbiIsInByZXZpb3VzIiwicmV0cmVhdEZvY3VzRnJvbSIsImZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0iLCJmaWxlUGF0aCIsInN0YWdpbmdTdGF0dXMiLCJxdWlldGx5U2VsZWN0SXRlbSIsIlNUQUdJTkciLCJmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCIsIlJlY2VudENvbW1pdHNDb250cm9sbGVyIiwiUkVDRU5UX0NPTU1JVCIsImZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbiIsIkNPTU1JVF9QUkVWSUVXX0JVVFRPTiIsInZpZXciLCJoYXNGb2N1cyIsImNvbnRhaW5zIiwiZXhwb3J0cyIsIlN0YWdpbmdWaWV3IiwiQ29tbWl0Q29udHJvbGxlciIsIlJlZkhvbGRlclByb3BUeXBlIiwiUHJvcFR5cGVzIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJhcnJheU9mIiwiaXNSZWJhc2luZyIsInN0cmluZyIsIlVzZXJTdG9yZVByb3BUeXBlIiwiQXV0aG9yUHJvcFR5cGUiLCJmdW5jIiwicHJvamVjdCJdLCJzb3VyY2VzIjpbImdpdC10YWItdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBTdGFnaW5nVmlldyBmcm9tICcuL3N0YWdpbmctdmlldyc7XG5pbXBvcnQgR2l0SWRlbnRpdHlWaWV3IGZyb20gJy4vZ2l0LWlkZW50aXR5LXZpZXcnO1xuaW1wb3J0IEdpdFRhYkhlYWRlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZ2l0LXRhYi1oZWFkZXItY29udHJvbGxlcic7XG5pbXBvcnQgQ29tbWl0Q29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21taXQtY29udHJvbGxlcic7XG5pbXBvcnQgUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcmVjZW50LWNvbW1pdHMtY29udHJvbGxlcic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7aXNWYWxpZFdvcmtkaXIsIGF1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7QXV0aG9yUHJvcFR5cGUsIFVzZXJTdG9yZVByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYlZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgLi4uU3RhZ2luZ1ZpZXcuZm9jdXMsXG4gICAgLi4uQ29tbWl0Q29udHJvbGxlci5mb2N1cyxcbiAgICAuLi5SZWNlbnRDb21taXRzQ29udHJvbGxlci5mb2N1cyxcbiAgfTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlZlJvb3Q6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIHJlZlN0YWdpbmdWaWV3OiBSZWZIb2xkZXJQcm9wVHlwZSxcblxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgZWRpdGluZ0lkZW50aXR5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgdXNlcm5hbWVCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBlbWFpbEJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGxhc3RDb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHJlY2VudENvbW1pdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpc1JlYmFzaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wsXG4gICAgdW5zdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBzdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBtZXJnZUNvbmZsaWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbWVyZ2VNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHVzZXJTdG9yZTogVXNlclN0b3JlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZENvQXV0aG9yczogUHJvcFR5cGVzLmFycmF5T2YoQXV0aG9yUHJvcFR5cGUpLFxuICAgIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBncmFtbWFyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwcm9qZWN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIHRvZ2dsZUlkZW50aXR5RWRpdG9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldExvY2FsSWRlbnRpdHk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0R2xvYmFsSWRlbnRpdHk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2xvc2VJZGVudGl0eUVkaXRvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuSW5pdGlhbGl6ZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhYm9ydE1lcmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdENvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwcmVwYXJlVG9Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZUFzT3VyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNUaGVpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5GaWxlczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25EaWRDaGFuZ2VXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBnZXRDdXJyZW50V29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2luaXRpYWxpemVSZXBvJywgJ2JsdXInLCAnYWR2YW5jZUZvY3VzJywgJ3JldHJlYXRGb2N1cycsICdxdWlldGx5U2VsZWN0SXRlbScpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5yZWZSb290Lm1hcChyb290ID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLnByb3BzLmNvbW1hbmRzLmFkZChyb290LCB7XG4gICAgICAgICAgJ3Rvb2wtcGFuZWw6dW5mb2N1cyc6IHRoaXMuYmx1cixcbiAgICAgICAgICAnY29yZTpmb2N1cy1uZXh0JzogdGhpcy5hZHZhbmNlRm9jdXMsXG4gICAgICAgICAgJ2NvcmU6Zm9jdXMtcHJldmlvdXMnOiB0aGlzLnJldHJlYXRGb2N1cyxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCByZW5kZXJNZXRob2QgPSAncmVuZGVyTm9ybWFsJztcbiAgICBsZXQgaXNFbXB0eSA9IGZhbHNlO1xuICAgIGxldCBpc0xvYWRpbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5wcm9wcy5lZGl0aW5nSWRlbnRpdHkpIHtcbiAgICAgIHJlbmRlck1ldGhvZCA9ICdyZW5kZXJJZGVudGl0eVZpZXcnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzVG9vTGFyZ2UoKSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlclRvb0xhcmdlJztcbiAgICAgIGlzRW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5Lmhhc0RpcmVjdG9yeSgpICYmXG4gICAgICAhaXNWYWxpZFdvcmtkaXIodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpKSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVyVW5zdXBwb3J0ZWREaXInO1xuICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd0dpdFRhYkluaXQoKSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlck5vUmVwbyc7XG4gICAgICBpc0VtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNMb2FkaW5nIHx8IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiTG9hZGluZygpKSB7XG4gICAgICBpc0xvYWRpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1HaXQnLCB7J2lzLWVtcHR5JzogaXNFbXB0eSwgJ2lzLWxvYWRpbmcnOiAhaXNFbXB0eSAmJiBpc0xvYWRpbmd9KX1cbiAgICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICAgIHJlZj17dGhpcy5wcm9wcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckhlYWRlcigpfVxuICAgICAgICB7dGhpc1tyZW5kZXJNZXRob2RdKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKCkge1xuICAgIGNvbnN0IHtyZXBvc2l0b3J5fSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRUYWJIZWFkZXJDb250cm9sbGVyXG4gICAgICAgIGdldENvbW1pdHRlcj17cmVwb3NpdG9yeS5nZXRDb21taXR0ZXIuYmluZChyZXBvc2l0b3J5KX1cblxuICAgICAgICAvLyBXb3Jrc3BhY2VcbiAgICAgICAgY3VycmVudFdvcmtEaXI9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9XG4gICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17dGhpcy5wcm9wcy5nZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cblxuICAgICAgICAvLyBFdmVudCBIYW5kbGVyc1xuICAgICAgICBvbkRpZENsaWNrQXZhdGFyPXt0aGlzLnByb3BzLnRvZ2dsZUlkZW50aXR5RWRpdG9yfVxuICAgICAgICBvbkRpZENoYW5nZVdvcmtEaXJzPXt0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnN9XG4gICAgICAgIG9uRGlkVXBkYXRlUmVwbz17cmVwb3NpdG9yeS5vbkRpZFVwZGF0ZS5iaW5kKHJlcG9zaXRvcnkpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTm9ybWFsKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxTdGFnaW5nVmlld1xuICAgICAgICAgIHJlZj17dGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldy5zZXR0ZXJ9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzfVxuICAgICAgICAgIHVuc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXN9XG4gICAgICAgICAgbWVyZ2VDb25mbGljdHM9e3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHN9XG4gICAgICAgICAgd29ya2luZ0RpcmVjdG9yeVBhdGg9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9XG4gICAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgICBvcGVuRmlsZXM9e3RoaXMucHJvcHMub3BlbkZpbGVzfVxuICAgICAgICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzPXt0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzfVxuICAgICAgICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb249e3RoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbn1cbiAgICAgICAgICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb249e3RoaXMucHJvcHMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9ufVxuICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgICAgYWJvcnRNZXJnZT17dGhpcy5wcm9wcy5hYm9ydE1lcmdlfVxuICAgICAgICAgIHJlc29sdmVBc091cnM9e3RoaXMucHJvcHMucmVzb2x2ZUFzT3Vyc31cbiAgICAgICAgICByZXNvbHZlQXNUaGVpcnM9e3RoaXMucHJvcHMucmVzb2x2ZUFzVGhlaXJzfVxuICAgICAgICAgIGxhc3RDb21taXQ9e3RoaXMucHJvcHMubGFzdENvbW1pdH1cbiAgICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICAgIGhhc1VuZG9IaXN0b3J5PXt0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5fVxuICAgICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgIC8+XG4gICAgICAgIDxDb21taXRDb250cm9sbGVyXG4gICAgICAgICAgcmVmPXt0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIuc2V0dGVyfVxuICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgc3RhZ2VkQ2hhbmdlc0V4aXN0PXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMH1cbiAgICAgICAgICBtZXJnZUNvbmZsaWN0c0V4aXN0PXt0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDB9XG4gICAgICAgICAgcHJlcGFyZVRvQ29tbWl0PXt0aGlzLnByb3BzLnByZXBhcmVUb0NvbW1pdH1cbiAgICAgICAgICBjb21taXQ9e3RoaXMucHJvcHMuY29tbWl0fVxuICAgICAgICAgIGFib3J0TWVyZ2U9e3RoaXMucHJvcHMuYWJvcnRNZXJnZX1cbiAgICAgICAgICBjdXJyZW50QnJhbmNoPXt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2h9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgZ3JhbW1hcnM9e3RoaXMucHJvcHMuZ3JhbW1hcnN9XG4gICAgICAgICAgbWVyZ2VNZXNzYWdlPXt0aGlzLnByb3BzLm1lcmdlTWVzc2FnZX1cbiAgICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgbGFzdENvbW1pdD17dGhpcy5wcm9wcy5sYXN0Q29tbWl0fVxuICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICB1c2VyU3RvcmU9e3RoaXMucHJvcHMudXNlclN0b3JlfVxuICAgICAgICAgIHNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICAgIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICAvPlxuICAgICAgICA8UmVjZW50Q29tbWl0c0NvbnRyb2xsZXJcbiAgICAgICAgICByZWY9e3RoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIuc2V0dGVyfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGNvbW1pdHM9e3RoaXMucHJvcHMucmVjZW50Q29tbWl0c31cbiAgICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICAgIHVuZG9MYXN0Q29tbWl0PXt0aGlzLnByb3BzLnVuZG9MYXN0Q29tbWl0fVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAvPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVG9vTGFyZ2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdCB0b28tbWFueS1jaGFuZ2VzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1MYXJnZUljb24gaWNvbiBpY29uLWRpZmZcIiAvPlxuICAgICAgICA8aDE+VG9vIG1hbnkgY2hhbmdlczwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgVGhlIHJlcG9zaXRvcnkgYXQgPHN0cm9uZz57dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH08L3N0cm9uZz4gaGFzIHRvbyBtYW55IGNoYW5nZWQgZmlsZXMgdG8gZGlzcGxheVxuICAgICAgICAgIGluIHthdG9tLmJyYW5kaW5nLm5hbWV9LiBFbnN1cmUgdGhhdCB5b3UgaGF2ZSBzZXQgdXAgYW4gYXBwcm9wcmlhdGUgPGNvZGU+LmdpdGlnbm9yZTwvY29kZT4gZmlsZS5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVW5zdXBwb3J0ZWREaXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdCB1bnN1cHBvcnRlZC1kaXJlY3RvcnlcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0LUxhcmdlSWNvbiBpY29uIGljb24tYWxlcnRcIiAvPlxuICAgICAgICA8aDE+VW5zdXBwb3J0ZWQgZGlyZWN0b3J5PC9oMT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbml0aWFsaXplLXJlcG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7YXRvbS5icmFuZGluZy5uYW1lfSBkb2VzIG5vdCBzdXBwb3J0IG1hbmFnaW5nIEdpdCByZXBvc2l0b3JpZXMgaW4geW91ciBob21lIG9yIHJvb3QgZGlyZWN0b3JpZXMuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck5vUmVwbygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0IG5vLXJlcG9zaXRvcnlcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0LUxhcmdlSWNvbiBpY29uIGljb24tcmVwb1wiIC8+XG4gICAgICAgIDxoMT5DcmVhdGUgUmVwb3NpdG9yeTwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lmhhc0RpcmVjdG9yeSgpXG4gICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIDxzcGFuPkluaXRpYWxpemUgPHN0cm9uZz57dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH08L3N0cm9uZz4gd2l0aCBhXG4gICAgICAgICAgICAgICAgR2l0IHJlcG9zaXRvcnk8L3NwYW4+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgOiA8c3Bhbj5Jbml0aWFsaXplIGEgbmV3IHByb2plY3QgZGlyZWN0b3J5IHdpdGggYSBHaXQgcmVwb3NpdG9yeTwvc3Bhbj5cbiAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17dGhpcy5pbml0aWFsaXplUmVwb31cbiAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcygpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd0dpdFRhYkluaXRJblByb2dyZXNzKClcbiAgICAgICAgICAgID8gJ0NyZWF0aW5nIHJlcG9zaXRvcnkuLi4nIDogJ0NyZWF0ZSByZXBvc2l0b3J5J31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySWRlbnRpdHlWaWV3KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0SWRlbnRpdHlWaWV3XG4gICAgICAgIHVzZXJuYW1lQnVmZmVyPXt0aGlzLnByb3BzLnVzZXJuYW1lQnVmZmVyfVxuICAgICAgICBlbWFpbEJ1ZmZlcj17dGhpcy5wcm9wcy5lbWFpbEJ1ZmZlcn1cbiAgICAgICAgY2FuV3JpdGVMb2NhbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzUHJlc2VudCgpfVxuICAgICAgICBzZXRMb2NhbD17dGhpcy5wcm9wcy5zZXRMb2NhbElkZW50aXR5fVxuICAgICAgICBzZXRHbG9iYWw9e3RoaXMucHJvcHMuc2V0R2xvYmFsSWRlbnRpdHl9XG4gICAgICAgIGNsb3NlPXt0aGlzLnByb3BzLmNsb3NlSWRlbnRpdHlFZGl0b3J9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZVJlcG8oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qgd29ya2RpciA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5pc0Fic2VudCgpID8gbnVsbCA6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5Jbml0aWFsaXplRGlhbG9nKHdvcmtkaXIpO1xuICB9XG5cbiAgZ2V0Rm9jdXMoZWxlbWVudCkge1xuICAgIGZvciAoY29uc3QgcmVmIG9mIFt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXJdKSB7XG4gICAgICBjb25zdCBmb2N1cyA9IHJlZi5tYXAoc3ViID0+IHN1Yi5nZXRGb2N1cyhlbGVtZW50KSkuZ2V0T3IobnVsbCk7XG4gICAgICBpZiAoZm9jdXMgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZvY3VzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgZm9yIChjb25zdCByZWYgb2YgW3RoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlcl0pIHtcbiAgICAgIGlmIChyZWYubWFwKHN1YiA9PiBzdWIuc2V0Rm9jdXMoZm9jdXMpKS5nZXRPcihmYWxzZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGJsdXIoKSB7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIGFzeW5jIGFkdmFuY2VGb2N1cyhldnQpIHtcbiAgICBjb25zdCBjdXJyZW50Rm9jdXMgPSB0aGlzLmdldEZvY3VzKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgIGxldCBuZXh0U2VlbiA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBzdWJIb2xkZXIgb2YgW3RoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlcl0pIHtcbiAgICAgIGNvbnN0IG5leHQgPSBhd2FpdCBzdWJIb2xkZXIubWFwKHN1YiA9PiBzdWIuYWR2YW5jZUZvY3VzRnJvbShjdXJyZW50Rm9jdXMpKS5nZXRPcihudWxsKTtcbiAgICAgIGlmIChuZXh0ICE9PSBudWxsICYmICFuZXh0U2Vlbikge1xuICAgICAgICBuZXh0U2VlbiA9IHRydWU7XG4gICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKG5leHQgIT09IGN1cnJlbnRGb2N1cykge1xuICAgICAgICAgIHRoaXMuc2V0Rm9jdXMobmV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyByZXRyZWF0Rm9jdXMoZXZ0KSB7XG4gICAgY29uc3QgY3VycmVudEZvY3VzID0gdGhpcy5nZXRGb2N1cyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICBsZXQgcHJldmlvdXNTZWVuID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHN1YkhvbGRlciBvZiBbdGhpcy5yZWZSZWNlbnRDb21taXRzQ29udHJvbGxlciwgdGhpcy5yZWZDb21taXRDb250cm9sbGVyLCB0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3XSkge1xuICAgICAgY29uc3QgcHJldmlvdXMgPSBhd2FpdCBzdWJIb2xkZXIubWFwKHN1YiA9PiBzdWIucmV0cmVhdEZvY3VzRnJvbShjdXJyZW50Rm9jdXMpKS5nZXRPcihudWxsKTtcbiAgICAgIGlmIChwcmV2aW91cyAhPT0gbnVsbCAmJiAhcHJldmlvdXNTZWVuKSB7XG4gICAgICAgIHByZXZpb3VzU2VlbiA9IHRydWU7XG4gICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKHByZXZpb3VzICE9PSBjdXJyZW50Rm9jdXMpIHtcbiAgICAgICAgICB0aGlzLnNldEZvY3VzKHByZXZpb3VzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICBhd2FpdCB0aGlzLnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgICB0aGlzLnNldEZvY3VzKEdpdFRhYlZpZXcuZm9jdXMuU1RBR0lORyk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpIHtcbiAgICB0aGlzLnNldEZvY3VzKFJlY2VudENvbW1pdHNDb250cm9sbGVyLmZvY3VzLlJFQ0VOVF9DT01NSVQpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkge1xuICAgIHRoaXMuc2V0Rm9jdXMoR2l0VGFiVmlldy5mb2N1cy5DT01NSVRfUFJFVklFV19CVVRUT04pO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldy5tYXAodmlldyA9PiB2aWV3LnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsVUFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsV0FBQSxHQUFBRCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUksS0FBQSxHQUFBSixP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