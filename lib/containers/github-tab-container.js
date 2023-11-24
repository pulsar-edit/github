"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _yubikiri = _interopRequireDefault(require("yubikiri"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _operationStateObserver = _interopRequireWildcard(require("../models/operation-state-observer"));

var _refresher = _interopRequireDefault(require("../models/refresher"));

var _githubTabController = _interopRequireDefault(require("../controllers/github-tab-controller"));

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _remoteSet = _interopRequireDefault(require("../models/remote-set"));

var _remote = require("../models/remote");

var _branchSet = _interopRequireDefault(require("../models/branch-set"));

var _branch = require("../models/branch");

var _endpoint = require("../models/endpoint");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitHubTabContainer extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "fetchRepositoryData", repository => {
      return (0, _yubikiri.default)({
        workingDirectory: repository.getWorkingDirectoryPath(),
        allRemotes: repository.getRemotes(),
        branches: repository.getBranches(),
        selectedRemoteName: repository.getConfig('atomGithub.currentRemote'),
        aheadCount: async query => {
          const branches = await query.branches;
          const currentBranch = branches.getHeadBranch();
          return repository.getAheadCount(currentBranch.getName());
        },
        pushInProgress: repository.getOperationStates().isPushInProgress()
      });
    });

    _defineProperty(this, "fetchToken", (loginModel, endpoint) => loginModel.getToken(endpoint.getLoginAccount()));

    _defineProperty(this, "renderRepositoryData", repoData => {
      let endpoint = _endpoint.DOTCOM;

      if (repoData) {
        repoData.githubRemotes = repoData.allRemotes.filter(remote => remote.isGithubRepo());
        repoData.currentBranch = repoData.branches.getHeadBranch();
        repoData.currentRemote = repoData.githubRemotes.withName(repoData.selectedRemoteName);
        repoData.manyRemotesAvailable = false;

        if (!repoData.currentRemote.isPresent() && repoData.githubRemotes.size() === 1) {
          repoData.currentRemote = Array.from(repoData.githubRemotes)[0];
        } else if (!repoData.currentRemote.isPresent() && repoData.githubRemotes.size() > 1) {
          repoData.manyRemotesAvailable = true;
        }

        repoData.endpoint = endpoint = repoData.currentRemote.getEndpointOrDotcom();
      }

      return _react.default.createElement(_observeModel.default, {
        model: this.props.loginModel,
        fetchData: this.fetchToken,
        fetchParams: [endpoint]
      }, token => this.renderToken(token, repoData));
    });

    this.state = {
      lastRepository: null,
      remoteOperationObserver: new _eventKit.Disposable(),
      refresher: new _refresher.default(),
      observerSub: new _eventKit.Disposable()
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.repository !== state.lastRepository) {
      state.remoteOperationObserver.dispose();
      state.observerSub.dispose();
      const remoteOperationObserver = new _operationStateObserver.default(props.repository, _operationStateObserver.PUSH, _operationStateObserver.PULL, _operationStateObserver.FETCH);
      const observerSub = remoteOperationObserver.onDidComplete(() => state.refresher.trigger());
      return {
        lastRepository: props.repository,
        remoteOperationObserver,
        observerSub
      };
    }

    return null;
  }

  componentWillUnmount() {
    this.state.observerSub.dispose();
    this.state.remoteOperationObserver.dispose();
    this.state.refresher.dispose();
  }

  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchRepositoryData
    }, this.renderRepositoryData);
  }

  renderToken(token, repoData) {
    if (!repoData || this.props.repository.isLoading()) {
      return _react.default.createElement(_githubTabController.default, _extends({}, this.props, {
        refresher: this.state.refresher,
        allRemotes: new _remoteSet.default(),
        githubRemotes: new _remoteSet.default(),
        currentRemote: _remote.nullRemote,
        branches: new _branchSet.default(),
        currentBranch: _branch.nullBranch,
        aheadCount: 0,
        manyRemotesAvailable: false,
        pushInProgress: false,
        isLoading: true,
        token: token
      }));
    }

    if (!this.props.repository.isPresent()) {
      return _react.default.createElement(_githubTabController.default, _extends({}, this.props, {
        refresher: this.state.refresher,
        allRemotes: new _remoteSet.default(),
        githubRemotes: new _remoteSet.default(),
        currentRemote: _remote.nullRemote,
        branches: new _branchSet.default(),
        currentBranch: _branch.nullBranch,
        aheadCount: 0,
        manyRemotesAvailable: false,
        pushInProgress: false,
        isLoading: false,
        token: token
      }));
    }

    return _react.default.createElement(_githubTabController.default, _extends({}, repoData, this.props, {
      refresher: this.state.refresher,
      isLoading: false,
      token: token
    }));
  }

}

exports.default = GitHubTabContainer;

_defineProperty(GitHubTabContainer, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  repository: _propTypes.default.object,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  rootHolder: _propTypes2.RefHolderPropType.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  openCreateDialog: _propTypes.default.func.isRequired,
  openPublishDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
});