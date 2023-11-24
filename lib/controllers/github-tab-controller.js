"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _githubTabView = _interopRequireDefault(require("../views/github-tab-view"));

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitHubTabController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handlePushBranch", (currentBranch, targetRemote) => {
      return this.props.repository.push(currentBranch.getName(), {
        remote: targetRemote,
        setUpstream: true
      });
    });

    _defineProperty(this, "handleRemoteSelect", (e, remote) => {
      e.preventDefault();
      return this.props.repository.setConfig('atomGithub.currentRemote', remote.getName());
    });

    _defineProperty(this, "openBoundPublishDialog", () => this.props.openPublishDialog(this.props.repository));

    _defineProperty(this, "handleLogin", token => {
      (0, _reporterProxy.incrementCounter)('github-login');
      this.props.loginModel.setToken(this.currentEndpoint().getLoginAccount(), token);
    });

    _defineProperty(this, "handleLogout", () => {
      (0, _reporterProxy.incrementCounter)('github-logout');
      this.props.loginModel.removeToken(this.currentEndpoint().getLoginAccount());
    });

    _defineProperty(this, "handleTokenRetry", () => this.props.loginModel.didUpdate());
  }

  render() {
    return _react.default.createElement(_githubTabView.default // Connection
    , {
      endpoint: this.currentEndpoint(),
      token: this.props.token,
      workspace: this.props.workspace,
      refresher: this.props.refresher,
      rootHolder: this.props.rootHolder,
      workingDirectory: this.props.workingDirectory || this.props.currentWorkDir,
      contextLocked: this.props.contextLocked,
      repository: this.props.repository,
      branches: this.props.branches,
      currentBranch: this.props.currentBranch,
      remotes: this.props.githubRemotes,
      currentRemote: this.props.currentRemote,
      manyRemotesAvailable: this.props.manyRemotesAvailable,
      aheadCount: this.props.aheadCount,
      pushInProgress: this.props.pushInProgress,
      isLoading: this.props.isLoading,
      handleLogin: this.handleLogin,
      handleLogout: this.handleLogout,
      handleTokenRetry: this.handleTokenRetry,
      handlePushBranch: this.handlePushBranch,
      handleRemoteSelect: this.handleRemoteSelect,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs,
      onDidChangeWorkDirs: this.props.onDidChangeWorkDirs,
      openCreateDialog: this.props.openCreateDialog,
      openBoundPublishDialog: this.openBoundPublishDialog,
      openCloneDialog: this.props.openCloneDialog,
      openGitTab: this.props.openGitTab
    });
  }

  currentEndpoint() {
    return this.props.currentRemote.getEndpointOrDotcom();
  }

}

exports.default = GitHubTabController;

_defineProperty(GitHubTabController, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  refresher: _propTypes2.RefresherPropType.isRequired,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  token: _propTypes2.TokenPropType,
  rootHolder: _propTypes2.RefHolderPropType.isRequired,
  workingDirectory: _propTypes.default.string,
  repository: _propTypes.default.object.isRequired,
  allRemotes: _propTypes2.RemoteSetPropType.isRequired,
  githubRemotes: _propTypes2.RemoteSetPropType.isRequired,
  currentRemote: _propTypes2.RemotePropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  aheadCount: _propTypes.default.number.isRequired,
  manyRemotesAvailable: _propTypes.default.bool.isRequired,
  pushInProgress: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  currentWorkDir: _propTypes.default.string,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  openCreateDialog: _propTypes.default.func.isRequired,
  openPublishDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
});