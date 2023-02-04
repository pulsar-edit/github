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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRUYWJWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY29udGV4dCIsImF1dG9iaW5kIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWZDb21taXRDb250cm9sbGVyIiwiUmVmSG9sZGVyIiwicmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIiLCJjb21wb25lbnREaWRNb3VudCIsInJlZlJvb3QiLCJtYXAiLCJyb290IiwiYWRkIiwiY29tbWFuZHMiLCJibHVyIiwiYWR2YW5jZUZvY3VzIiwicmV0cmVhdEZvY3VzIiwicmVuZGVyIiwicmVuZGVyTWV0aG9kIiwiaXNFbXB0eSIsImlzTG9hZGluZyIsImVkaXRpbmdJZGVudGl0eSIsInJlcG9zaXRvcnkiLCJpc1Rvb0xhcmdlIiwiaGFzRGlyZWN0b3J5IiwiaXNWYWxpZFdvcmtkaXIiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsInNob3dHaXRUYWJJbml0Iiwic2hvd0dpdFRhYkxvYWRpbmciLCJjeCIsInNldHRlciIsInJlbmRlckhlYWRlciIsImdldENvbW1pdHRlciIsImJpbmQiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdldEN1cnJlbnRXb3JrRGlycyIsImNvbnRleHRMb2NrZWQiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwic2V0Q29udGV4dExvY2siLCJ0b2dnbGVJZGVudGl0eUVkaXRvciIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJvbkRpZFVwZGF0ZSIsInJlbmRlck5vcm1hbCIsInJlZlN0YWdpbmdWaWV3Iiwibm90aWZpY2F0aW9uTWFuYWdlciIsIndvcmtzcGFjZSIsInN0YWdlZENoYW5nZXMiLCJ1bnN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsInJlc29sdXRpb25Qcm9ncmVzcyIsIm9wZW5GaWxlcyIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwiYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbiIsImF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiIsInVuZG9MYXN0RGlzY2FyZCIsImFib3J0TWVyZ2UiLCJyZXNvbHZlQXNPdXJzIiwicmVzb2x2ZUFzVGhlaXJzIiwibGFzdENvbW1pdCIsImhhc1VuZG9IaXN0b3J5IiwiaXNNZXJnaW5nIiwidG9vbHRpcHMiLCJjb25maWciLCJsZW5ndGgiLCJwcmVwYXJlVG9Db21taXQiLCJjb21taXQiLCJjdXJyZW50QnJhbmNoIiwiZ3JhbW1hcnMiLCJtZXJnZU1lc3NhZ2UiLCJ1c2VyU3RvcmUiLCJzZWxlY3RlZENvQXV0aG9ycyIsInVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzIiwicmVjZW50Q29tbWl0cyIsInVuZG9MYXN0Q29tbWl0IiwicmVuZGVyVG9vTGFyZ2UiLCJyZW5kZXJVbnN1cHBvcnRlZERpciIsInJlbmRlck5vUmVwbyIsImluaXRpYWxpemVSZXBvIiwic2hvd0dpdFRhYkluaXRJblByb2dyZXNzIiwicmVuZGVySWRlbnRpdHlWaWV3IiwidXNlcm5hbWVCdWZmZXIiLCJlbWFpbEJ1ZmZlciIsImlzUHJlc2VudCIsInNldExvY2FsSWRlbnRpdHkiLCJzZXRHbG9iYWxJZGVudGl0eSIsImNsb3NlSWRlbnRpdHlFZGl0b3IiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwid29ya2RpciIsImlzQWJzZW50Iiwib3BlbkluaXRpYWxpemVEaWFsb2ciLCJnZXRGb2N1cyIsImVsZW1lbnQiLCJyZWYiLCJmb2N1cyIsInN1YiIsImdldE9yIiwic2V0Rm9jdXMiLCJnZXRDZW50ZXIiLCJhY3RpdmF0ZSIsImV2dCIsImN1cnJlbnRGb2N1cyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsIm5leHRTZWVuIiwic3ViSG9sZGVyIiwibmV4dCIsImFkdmFuY2VGb2N1c0Zyb20iLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2aW91c1NlZW4iLCJwcmV2aW91cyIsInJldHJlYXRGb2N1c0Zyb20iLCJmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtIiwiZmlsZVBhdGgiLCJzdGFnaW5nU3RhdHVzIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJTVEFHSU5HIiwiZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQiLCJSZWNlbnRDb21taXRzQ29udHJvbGxlciIsIlJFQ0VOVF9DT01NSVQiLCJmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24iLCJDT01NSVRfUFJFVklFV19CVVRUT04iLCJ2aWV3IiwiaGFzRm9jdXMiLCJjb250YWlucyIsIlN0YWdpbmdWaWV3IiwiQ29tbWl0Q29udHJvbGxlciIsIlJlZkhvbGRlclByb3BUeXBlIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJhcnJheU9mIiwiaXNSZWJhc2luZyIsInN0cmluZyIsIlVzZXJTdG9yZVByb3BUeXBlIiwiQXV0aG9yUHJvcFR5cGUiLCJmdW5jIiwicHJvamVjdCJdLCJzb3VyY2VzIjpbImdpdC10YWItdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBTdGFnaW5nVmlldyBmcm9tICcuL3N0YWdpbmctdmlldyc7XG5pbXBvcnQgR2l0SWRlbnRpdHlWaWV3IGZyb20gJy4vZ2l0LWlkZW50aXR5LXZpZXcnO1xuaW1wb3J0IEdpdFRhYkhlYWRlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZ2l0LXRhYi1oZWFkZXItY29udHJvbGxlcic7XG5pbXBvcnQgQ29tbWl0Q29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21taXQtY29udHJvbGxlcic7XG5pbXBvcnQgUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcmVjZW50LWNvbW1pdHMtY29udHJvbGxlcic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7aXNWYWxpZFdvcmtkaXIsIGF1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7QXV0aG9yUHJvcFR5cGUsIFVzZXJTdG9yZVByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYlZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgLi4uU3RhZ2luZ1ZpZXcuZm9jdXMsXG4gICAgLi4uQ29tbWl0Q29udHJvbGxlci5mb2N1cyxcbiAgICAuLi5SZWNlbnRDb21taXRzQ29udHJvbGxlci5mb2N1cyxcbiAgfTtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlZlJvb3Q6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIHJlZlN0YWdpbmdWaWV3OiBSZWZIb2xkZXJQcm9wVHlwZSxcblxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgZWRpdGluZ0lkZW50aXR5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgdXNlcm5hbWVCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBlbWFpbEJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGxhc3RDb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHJlY2VudENvbW1pdHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpc1JlYmFzaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wsXG4gICAgdW5zdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBzdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBtZXJnZUNvbmZsaWN0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbWVyZ2VNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHVzZXJTdG9yZTogVXNlclN0b3JlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZENvQXV0aG9yczogUHJvcFR5cGVzLmFycmF5T2YoQXV0aG9yUHJvcFR5cGUpLFxuICAgIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBncmFtbWFyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwcm9qZWN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIHRvZ2dsZUlkZW50aXR5RWRpdG9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldExvY2FsSWRlbnRpdHk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0R2xvYmFsSWRlbnRpdHk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2xvc2VJZGVudGl0eUVkaXRvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuSW5pdGlhbGl6ZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhYm9ydE1lcmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdENvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBwcmVwYXJlVG9Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZUFzT3VyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNUaGVpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5GaWxlczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25EaWRDaGFuZ2VXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBnZXRDdXJyZW50V29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2luaXRpYWxpemVSZXBvJywgJ2JsdXInLCAnYWR2YW5jZUZvY3VzJywgJ3JldHJlYXRGb2N1cycsICdxdWlldGx5U2VsZWN0SXRlbScpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5yZWZSb290Lm1hcChyb290ID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLnByb3BzLmNvbW1hbmRzLmFkZChyb290LCB7XG4gICAgICAgICAgJ3Rvb2wtcGFuZWw6dW5mb2N1cyc6IHRoaXMuYmx1cixcbiAgICAgICAgICAnY29yZTpmb2N1cy1uZXh0JzogdGhpcy5hZHZhbmNlRm9jdXMsXG4gICAgICAgICAgJ2NvcmU6Zm9jdXMtcHJldmlvdXMnOiB0aGlzLnJldHJlYXRGb2N1cyxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCByZW5kZXJNZXRob2QgPSAncmVuZGVyTm9ybWFsJztcbiAgICBsZXQgaXNFbXB0eSA9IGZhbHNlO1xuICAgIGxldCBpc0xvYWRpbmcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5wcm9wcy5lZGl0aW5nSWRlbnRpdHkpIHtcbiAgICAgIHJlbmRlck1ldGhvZCA9ICdyZW5kZXJJZGVudGl0eVZpZXcnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzVG9vTGFyZ2UoKSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlclRvb0xhcmdlJztcbiAgICAgIGlzRW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5Lmhhc0RpcmVjdG9yeSgpICYmXG4gICAgICAhaXNWYWxpZFdvcmtkaXIodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpKSB7XG4gICAgICByZW5kZXJNZXRob2QgPSAncmVuZGVyVW5zdXBwb3J0ZWREaXInO1xuICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd0dpdFRhYkluaXQoKSkge1xuICAgICAgcmVuZGVyTWV0aG9kID0gJ3JlbmRlck5vUmVwbyc7XG4gICAgICBpc0VtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNMb2FkaW5nIHx8IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiTG9hZGluZygpKSB7XG4gICAgICBpc0xvYWRpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1HaXQnLCB7J2lzLWVtcHR5JzogaXNFbXB0eSwgJ2lzLWxvYWRpbmcnOiAhaXNFbXB0eSAmJiBpc0xvYWRpbmd9KX1cbiAgICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICAgIHJlZj17dGhpcy5wcm9wcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckhlYWRlcigpfVxuICAgICAgICB7dGhpc1tyZW5kZXJNZXRob2RdKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKCkge1xuICAgIGNvbnN0IHtyZXBvc2l0b3J5fSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRUYWJIZWFkZXJDb250cm9sbGVyXG4gICAgICAgIGdldENvbW1pdHRlcj17cmVwb3NpdG9yeS5nZXRDb21taXR0ZXIuYmluZChyZXBvc2l0b3J5KX1cblxuICAgICAgICAvLyBXb3Jrc3BhY2VcbiAgICAgICAgY3VycmVudFdvcmtEaXI9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9XG4gICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17dGhpcy5wcm9wcy5nZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cblxuICAgICAgICAvLyBFdmVudCBIYW5kbGVyc1xuICAgICAgICBvbkRpZENsaWNrQXZhdGFyPXt0aGlzLnByb3BzLnRvZ2dsZUlkZW50aXR5RWRpdG9yfVxuICAgICAgICBvbkRpZENoYW5nZVdvcmtEaXJzPXt0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnN9XG4gICAgICAgIG9uRGlkVXBkYXRlUmVwbz17cmVwb3NpdG9yeS5vbkRpZFVwZGF0ZS5iaW5kKHJlcG9zaXRvcnkpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTm9ybWFsKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxTdGFnaW5nVmlld1xuICAgICAgICAgIHJlZj17dGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldy5zZXR0ZXJ9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzfVxuICAgICAgICAgIHVuc3RhZ2VkQ2hhbmdlcz17dGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXN9XG4gICAgICAgICAgbWVyZ2VDb25mbGljdHM9e3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHN9XG4gICAgICAgICAgd29ya2luZ0RpcmVjdG9yeVBhdGg9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9XG4gICAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgICBvcGVuRmlsZXM9e3RoaXMucHJvcHMub3BlbkZpbGVzfVxuICAgICAgICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzPXt0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzfVxuICAgICAgICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb249e3RoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbn1cbiAgICAgICAgICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb249e3RoaXMucHJvcHMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9ufVxuICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgICAgYWJvcnRNZXJnZT17dGhpcy5wcm9wcy5hYm9ydE1lcmdlfVxuICAgICAgICAgIHJlc29sdmVBc091cnM9e3RoaXMucHJvcHMucmVzb2x2ZUFzT3Vyc31cbiAgICAgICAgICByZXNvbHZlQXNUaGVpcnM9e3RoaXMucHJvcHMucmVzb2x2ZUFzVGhlaXJzfVxuICAgICAgICAgIGxhc3RDb21taXQ9e3RoaXMucHJvcHMubGFzdENvbW1pdH1cbiAgICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICAgIGhhc1VuZG9IaXN0b3J5PXt0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5fVxuICAgICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgIC8+XG4gICAgICAgIDxDb21taXRDb250cm9sbGVyXG4gICAgICAgICAgcmVmPXt0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIuc2V0dGVyfVxuICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgc3RhZ2VkQ2hhbmdlc0V4aXN0PXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMH1cbiAgICAgICAgICBtZXJnZUNvbmZsaWN0c0V4aXN0PXt0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDB9XG4gICAgICAgICAgcHJlcGFyZVRvQ29tbWl0PXt0aGlzLnByb3BzLnByZXBhcmVUb0NvbW1pdH1cbiAgICAgICAgICBjb21taXQ9e3RoaXMucHJvcHMuY29tbWl0fVxuICAgICAgICAgIGFib3J0TWVyZ2U9e3RoaXMucHJvcHMuYWJvcnRNZXJnZX1cbiAgICAgICAgICBjdXJyZW50QnJhbmNoPXt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2h9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgZ3JhbW1hcnM9e3RoaXMucHJvcHMuZ3JhbW1hcnN9XG4gICAgICAgICAgbWVyZ2VNZXNzYWdlPXt0aGlzLnByb3BzLm1lcmdlTWVzc2FnZX1cbiAgICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgbGFzdENvbW1pdD17dGhpcy5wcm9wcy5sYXN0Q29tbWl0fVxuICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICB1c2VyU3RvcmU9e3RoaXMucHJvcHMudXNlclN0b3JlfVxuICAgICAgICAgIHNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICAgIHVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzPXt0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkQ29BdXRob3JzfVxuICAgICAgICAvPlxuICAgICAgICA8UmVjZW50Q29tbWl0c0NvbnRyb2xsZXJcbiAgICAgICAgICByZWY9e3RoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIuc2V0dGVyfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGNvbW1pdHM9e3RoaXMucHJvcHMucmVjZW50Q29tbWl0c31cbiAgICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICAgIHVuZG9MYXN0Q29tbWl0PXt0aGlzLnByb3BzLnVuZG9MYXN0Q29tbWl0fVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAvPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVG9vTGFyZ2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdCB0b28tbWFueS1jaGFuZ2VzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1MYXJnZUljb24gaWNvbiBpY29uLWRpZmZcIiAvPlxuICAgICAgICA8aDE+VG9vIG1hbnkgY2hhbmdlczwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgVGhlIHJlcG9zaXRvcnkgYXQgPHN0cm9uZz57dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aH08L3N0cm9uZz4gaGFzIHRvbyBtYW55IGNoYW5nZWQgZmlsZXNcbiAgICAgICAgICB0byBkaXNwbGF5IGluIEF0b20uIEVuc3VyZSB0aGF0IHlvdSBoYXZlIHNldCB1cCBhbiBhcHByb3ByaWF0ZSA8Y29kZT4uZ2l0aWdub3JlPC9jb2RlPiBmaWxlLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJVbnN1cHBvcnRlZERpcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0IHVuc3VwcG9ydGVkLWRpcmVjdG9yeVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQtTGFyZ2VJY29uIGljb24gaWNvbi1hbGVydFwiIC8+XG4gICAgICAgIDxoMT5VbnN1cHBvcnRlZCBkaXJlY3Rvcnk8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIEF0b20gZG9lcyBub3Qgc3VwcG9ydCBtYW5hZ2luZyBHaXQgcmVwb3NpdG9yaWVzIGluIHlvdXIgaG9tZSBvciByb290IGRpcmVjdG9yaWVzLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJOb1JlcG8oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdCBuby1yZXBvc2l0b3J5XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1MYXJnZUljb24gaWNvbiBpY29uLXJlcG9cIiAvPlxuICAgICAgICA8aDE+Q3JlYXRlIFJlcG9zaXRvcnk8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5oYXNEaXJlY3RvcnkoKVxuICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICA8c3Bhbj5Jbml0aWFsaXplIDxzdHJvbmc+e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGh9PC9zdHJvbmc+IHdpdGggYVxuICAgICAgICAgICAgICAgIEdpdCByZXBvc2l0b3J5PC9zcGFuPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogPHNwYW4+SW5pdGlhbGl6ZSBhIG5ldyBwcm9qZWN0IGRpcmVjdG9yeSB3aXRoIGEgR2l0IHJlcG9zaXRvcnk8L3NwYW4+XG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaW5pdGlhbGl6ZVJlcG99XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMucmVwb3NpdG9yeS5zaG93R2l0VGFiSW5pdEluUHJvZ3Jlc3MoKX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5yZXBvc2l0b3J5LnNob3dHaXRUYWJJbml0SW5Qcm9ncmVzcygpXG4gICAgICAgICAgICA/ICdDcmVhdGluZyByZXBvc2l0b3J5Li4uJyA6ICdDcmVhdGUgcmVwb3NpdG9yeSd9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcklkZW50aXR5VmlldygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdElkZW50aXR5Vmlld1xuICAgICAgICB1c2VybmFtZUJ1ZmZlcj17dGhpcy5wcm9wcy51c2VybmFtZUJ1ZmZlcn1cbiAgICAgICAgZW1haWxCdWZmZXI9e3RoaXMucHJvcHMuZW1haWxCdWZmZXJ9XG4gICAgICAgIGNhbldyaXRlTG9jYWw9e3RoaXMucHJvcHMucmVwb3NpdG9yeS5pc1ByZXNlbnQoKX1cbiAgICAgICAgc2V0TG9jYWw9e3RoaXMucHJvcHMuc2V0TG9jYWxJZGVudGl0eX1cbiAgICAgICAgc2V0R2xvYmFsPXt0aGlzLnByb3BzLnNldEdsb2JhbElkZW50aXR5fVxuICAgICAgICBjbG9zZT17dGhpcy5wcm9wcy5jbG9zZUlkZW50aXR5RWRpdG9yfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGluaXRpYWxpemVSZXBvKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHdvcmtkaXIgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNBYnNlbnQoKSA/IG51bGwgOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuSW5pdGlhbGl6ZURpYWxvZyh3b3JrZGlyKTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IHJlZiBvZiBbdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlldywgdGhpcy5yZWZDb21taXRDb250cm9sbGVyLCB0aGlzLnJlZlJlY2VudENvbW1pdHNDb250cm9sbGVyXSkge1xuICAgICAgY29uc3QgZm9jdXMgPSByZWYubWFwKHN1YiA9PiBzdWIuZ2V0Rm9jdXMoZWxlbWVudCkpLmdldE9yKG51bGwpO1xuICAgICAgaWYgKGZvY3VzICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmb2N1cztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzZXRGb2N1cyhmb2N1cykge1xuICAgIGZvciAoY29uc3QgcmVmIG9mIFt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXJdKSB7XG4gICAgICBpZiAocmVmLm1hcChzdWIgPT4gc3ViLnNldEZvY3VzKGZvY3VzKSkuZ2V0T3IoZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBibHVyKCkge1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLmdldENlbnRlcigpLmFjdGl2YXRlKCk7XG4gIH1cblxuICBhc3luYyBhZHZhbmNlRm9jdXMoZXZ0KSB7XG4gICAgY29uc3QgY3VycmVudEZvY3VzID0gdGhpcy5nZXRGb2N1cyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICBsZXQgbmV4dFNlZW4gPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3Qgc3ViSG9sZGVyIG9mIFt0aGlzLnByb3BzLnJlZlN0YWdpbmdWaWV3LCB0aGlzLnJlZkNvbW1pdENvbnRyb2xsZXIsIHRoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXJdKSB7XG4gICAgICBjb25zdCBuZXh0ID0gYXdhaXQgc3ViSG9sZGVyLm1hcChzdWIgPT4gc3ViLmFkdmFuY2VGb2N1c0Zyb20oY3VycmVudEZvY3VzKSkuZ2V0T3IobnVsbCk7XG4gICAgICBpZiAobmV4dCAhPT0gbnVsbCAmJiAhbmV4dFNlZW4pIHtcbiAgICAgICAgbmV4dFNlZW4gPSB0cnVlO1xuICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChuZXh0ICE9PSBjdXJyZW50Rm9jdXMpIHtcbiAgICAgICAgICB0aGlzLnNldEZvY3VzKG5leHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmV0cmVhdEZvY3VzKGV2dCkge1xuICAgIGNvbnN0IGN1cnJlbnRGb2N1cyA9IHRoaXMuZ2V0Rm9jdXMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgbGV0IHByZXZpb3VzU2VlbiA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBzdWJIb2xkZXIgb2YgW3RoaXMucmVmUmVjZW50Q29tbWl0c0NvbnRyb2xsZXIsIHRoaXMucmVmQ29tbWl0Q29udHJvbGxlciwgdGhpcy5wcm9wcy5yZWZTdGFnaW5nVmlld10pIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gYXdhaXQgc3ViSG9sZGVyLm1hcChzdWIgPT4gc3ViLnJldHJlYXRGb2N1c0Zyb20oY3VycmVudEZvY3VzKSkuZ2V0T3IobnVsbCk7XG4gICAgICBpZiAocHJldmlvdXMgIT09IG51bGwgJiYgIXByZXZpb3VzU2Vlbikge1xuICAgICAgICBwcmV2aW91c1NlZW4gPSB0cnVlO1xuICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChwcmV2aW91cyAhPT0gY3VycmVudEZvY3VzKSB7XG4gICAgICAgICAgdGhpcy5zZXRGb2N1cyhwcmV2aW91cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgYXdhaXQgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gICAgdGhpcy5zZXRGb2N1cyhHaXRUYWJWaWV3LmZvY3VzLlNUQUdJTkcpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSB7XG4gICAgdGhpcy5zZXRGb2N1cyhSZWNlbnRDb21taXRzQ29udHJvbGxlci5mb2N1cy5SRUNFTlRfQ09NTUlUKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpIHtcbiAgICB0aGlzLnNldEZvY3VzKEdpdFRhYlZpZXcuZm9jdXMuQ09NTUlUX1BSRVZJRVdfQlVUVE9OKTtcbiAgfVxuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVmU3RhZ2luZ1ZpZXcubWFwKHZpZXcgPT4gdmlldy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFtRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXBFLE1BQU1BLFVBQVUsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFnRXREQyxXQUFXLENBQUNDLEtBQUssRUFBRUMsT0FBTyxFQUFFO0lBQzFCLEtBQUssQ0FBQ0QsS0FBSyxFQUFFQyxPQUFPLENBQUM7SUFDckIsSUFBQUMsaUJBQVEsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUM7SUFFN0YsSUFBSSxDQUFDQyxhQUFhLEdBQUcsSUFBSUMseUJBQW1CLEVBQUU7SUFFOUMsSUFBSSxDQUFDQyxtQkFBbUIsR0FBRyxJQUFJQyxrQkFBUyxFQUFFO0lBQzFDLElBQUksQ0FBQ0MsMEJBQTBCLEdBQUcsSUFBSUQsa0JBQVMsRUFBRTtFQUNuRDtFQUVBRSxpQkFB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