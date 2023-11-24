"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _loadingView = _interopRequireDefault(require("./loading-view"));

var _queryErrorView = _interopRequireDefault(require("../views/query-error-view"));

var _githubLoginView = _interopRequireDefault(require("../views/github-login-view"));

var _remoteSelectorView = _interopRequireDefault(require("./remote-selector-view"));

var _githubTabHeaderContainer = _interopRequireDefault(require("../containers/github-tab-header-container"));

var _githubBlankNolocal = _interopRequireDefault(require("./github-blank-nolocal"));

var _githubBlankUninitialized = _interopRequireDefault(require("./github-blank-uninitialized"));

var _githubBlankNoremote = _interopRequireDefault(require("./github-blank-noremote"));

var _remoteContainer = _interopRequireDefault(require("../containers/remote-container"));

var _keytarStrategy = require("../shared/keytar-strategy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitHubTabView extends _react.default.Component {
  render() {
    return _react.default.createElement("div", {
      className: "github-GitHub",
      ref: this.props.rootHolder.setter
    }, this.renderHeader(), _react.default.createElement("div", {
      className: "github-GitHub-content"
    }, this.renderRemote()));
  }

  renderRemote() {
    if (this.props.token === null) {
      return _react.default.createElement(_loadingView.default, null);
    }

    if (this.props.token === _keytarStrategy.UNAUTHENTICATED) {
      return _react.default.createElement(_githubLoginView.default, {
        onLogin: this.props.handleLogin
      });
    }

    if (this.props.token === _keytarStrategy.INSUFFICIENT) {
      return _react.default.createElement(_githubLoginView.default, {
        onLogin: this.props.handleLogin
      }, _react.default.createElement("p", null, "Your token no longer has sufficient authorizations. Please re-authenticate and generate a new one."));
    }

    if (this.props.token instanceof Error) {
      return _react.default.createElement(_queryErrorView.default, {
        error: this.props.token,
        retry: this.props.handleTokenRetry,
        login: this.props.handleLogin,
        logout: this.props.handleLogout
      });
    }

    if (this.props.isLoading) {
      return _react.default.createElement(_loadingView.default, null);
    }

    if (this.props.repository.isAbsent() || this.props.repository.isAbsentGuess()) {
      return _react.default.createElement(_githubBlankNolocal.default, {
        openCreateDialog: this.props.openCreateDialog,
        openCloneDialog: this.props.openCloneDialog
      });
    }

    if (this.props.repository.isEmpty()) {
      return _react.default.createElement(_githubBlankUninitialized.default, {
        openBoundPublishDialog: this.props.openBoundPublishDialog,
        openGitTab: this.props.openGitTab
      });
    }

    if (this.props.currentRemote.isPresent()) {
      // Single, chosen or unambiguous remote
      return _react.default.createElement(_remoteContainer.default // Connection
      , {
        endpoint: this.props.currentRemote.getEndpoint(),
        token: this.props.token // Repository attributes
        ,
        refresher: this.props.refresher,
        pushInProgress: this.props.pushInProgress,
        workingDirectory: this.props.workingDirectory,
        workspace: this.props.workspace,
        remote: this.props.currentRemote,
        remotes: this.props.remotes,
        branches: this.props.branches,
        aheadCount: this.props.aheadCount // Action methods
        ,
        handleLogin: this.props.handleLogin,
        handleLogout: this.props.handleLogout,
        onPushBranch: () => this.props.handlePushBranch(this.props.currentBranch, this.props.currentRemote)
      });
    }

    if (this.props.manyRemotesAvailable) {
      // No chosen remote, multiple remotes hosted on GitHub instances
      return _react.default.createElement(_remoteSelectorView.default, {
        remotes: this.props.remotes,
        currentBranch: this.props.currentBranch,
        selectRemote: this.props.handleRemoteSelect
      });
    }

    return _react.default.createElement(_githubBlankNoremote.default, {
      openBoundPublishDialog: this.props.openBoundPublishDialog
    });
  }

  renderHeader() {
    return _react.default.createElement(_githubTabHeaderContainer.default // Connection
    , {
      endpoint: this.props.endpoint,
      token: this.props.token // Workspace
      ,
      currentWorkDir: this.props.workingDirectory,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs // Event Handlers
      ,
      onDidChangeWorkDirs: this.props.onDidChangeWorkDirs
    });
  }

}

exports.default = GitHubTabView;

_defineProperty(GitHubTabView, "propTypes", {
  refresher: _propTypes2.RefresherPropType.isRequired,
  rootHolder: _propTypes2.RefHolderPropType.isRequired,
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes2.TokenPropType,
  // Workspace
  workspace: _propTypes.default.object.isRequired,
  workingDirectory: _propTypes.default.string,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  repository: _propTypes.default.object.isRequired,
  // Remotes
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  currentRemote: _propTypes2.RemotePropType.isRequired,
  manyRemotesAvailable: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Event Handlers
  handleLogin: _propTypes.default.func.isRequired,
  handleLogout: _propTypes.default.func.isRequired,
  handleTokenRetry: _propTypes.default.func.isRequired,
  handleWorkDirSelect: _propTypes.default.func,
  handlePushBranch: _propTypes.default.func.isRequired,
  handleRemoteSelect: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  openCreateDialog: _propTypes.default.func.isRequired,
  openBoundPublishDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
});