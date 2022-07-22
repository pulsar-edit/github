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

      return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
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
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchRepositoryData
    }, this.renderRepositoryData);
  }

  renderToken(token, repoData) {
    if (!repoData || this.props.repository.isLoading()) {
      return /*#__PURE__*/_react.default.createElement(_githubTabController.default, _extends({}, this.props, {
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
      return /*#__PURE__*/_react.default.createElement(_githubTabController.default, _extends({}, this.props, {
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

    return /*#__PURE__*/_react.default.createElement(_githubTabController.default, _extends({}, repoData, this.props, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2dpdGh1Yi10YWItY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkdpdEh1YlRhYkNvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlcG9zaXRvcnkiLCJ3b3JraW5nRGlyZWN0b3J5IiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJhbGxSZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJzZWxlY3RlZFJlbW90ZU5hbWUiLCJnZXRDb25maWciLCJhaGVhZENvdW50IiwicXVlcnkiLCJjdXJyZW50QnJhbmNoIiwiZ2V0SGVhZEJyYW5jaCIsImdldEFoZWFkQ291bnQiLCJnZXROYW1lIiwicHVzaEluUHJvZ3Jlc3MiLCJnZXRPcGVyYXRpb25TdGF0ZXMiLCJpc1B1c2hJblByb2dyZXNzIiwibG9naW5Nb2RlbCIsImVuZHBvaW50IiwiZ2V0VG9rZW4iLCJnZXRMb2dpbkFjY291bnQiLCJyZXBvRGF0YSIsIkRPVENPTSIsImdpdGh1YlJlbW90ZXMiLCJmaWx0ZXIiLCJyZW1vdGUiLCJpc0dpdGh1YlJlcG8iLCJjdXJyZW50UmVtb3RlIiwid2l0aE5hbWUiLCJtYW55UmVtb3Rlc0F2YWlsYWJsZSIsImlzUHJlc2VudCIsInNpemUiLCJBcnJheSIsImZyb20iLCJnZXRFbmRwb2ludE9yRG90Y29tIiwiZmV0Y2hUb2tlbiIsInRva2VuIiwicmVuZGVyVG9rZW4iLCJzdGF0ZSIsImxhc3RSZXBvc2l0b3J5IiwicmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIiLCJEaXNwb3NhYmxlIiwicmVmcmVzaGVyIiwiUmVmcmVzaGVyIiwib2JzZXJ2ZXJTdWIiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJkaXNwb3NlIiwiT3BlcmF0aW9uU3RhdGVPYnNlcnZlciIsIlBVU0giLCJQVUxMIiwiRkVUQ0giLCJvbkRpZENvbXBsZXRlIiwidHJpZ2dlciIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVuZGVyIiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlbmRlclJlcG9zaXRvcnlEYXRhIiwiaXNMb2FkaW5nIiwiUmVtb3RlU2V0IiwibnVsbFJlbW90ZSIsIkJyYW5jaFNldCIsIm51bGxCcmFuY2giLCJ3b3Jrc3BhY2UiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwicm9vdEhvbGRlciIsIlJlZkhvbGRlclByb3BUeXBlIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsImZ1bmMiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwib3BlbkNyZWF0ZURpYWxvZyIsIm9wZW5QdWJsaXNoRGlhbG9nIiwib3BlbkNsb25lRGlhbG9nIiwib3BlbkdpdFRhYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTixTQUFpQ0MsZUFBTUMsU0FBdkMsQ0FBaUQ7QUFnQjlEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQixpREFtQ0dDLFVBQVUsSUFBSTtBQUNsQyxhQUFPLHVCQUFTO0FBQ2RDLFFBQUFBLGdCQUFnQixFQUFFRCxVQUFVLENBQUNFLHVCQUFYLEVBREo7QUFFZEMsUUFBQUEsVUFBVSxFQUFFSCxVQUFVLENBQUNJLFVBQVgsRUFGRTtBQUdkQyxRQUFBQSxRQUFRLEVBQUVMLFVBQVUsQ0FBQ00sV0FBWCxFQUhJO0FBSWRDLFFBQUFBLGtCQUFrQixFQUFFUCxVQUFVLENBQUNRLFNBQVgsQ0FBcUIsMEJBQXJCLENBSk47QUFLZEMsUUFBQUEsVUFBVSxFQUFFLE1BQU1DLEtBQU4sSUFBZTtBQUN6QixnQkFBTUwsUUFBUSxHQUFHLE1BQU1LLEtBQUssQ0FBQ0wsUUFBN0I7QUFDQSxnQkFBTU0sYUFBYSxHQUFHTixRQUFRLENBQUNPLGFBQVQsRUFBdEI7QUFDQSxpQkFBT1osVUFBVSxDQUFDYSxhQUFYLENBQXlCRixhQUFhLENBQUNHLE9BQWQsRUFBekIsQ0FBUDtBQUNELFNBVGE7QUFVZEMsUUFBQUEsY0FBYyxFQUFFZixVQUFVLENBQUNnQixrQkFBWCxHQUFnQ0MsZ0JBQWhDO0FBVkYsT0FBVCxDQUFQO0FBWUQsS0FoRGtCOztBQUFBLHdDQWtETixDQUFDQyxVQUFELEVBQWFDLFFBQWIsS0FBMEJELFVBQVUsQ0FBQ0UsUUFBWCxDQUFvQkQsUUFBUSxDQUFDRSxlQUFULEVBQXBCLENBbERwQjs7QUFBQSxrREE0RElDLFFBQVEsSUFBSTtBQUNqQyxVQUFJSCxRQUFRLEdBQUdJLGdCQUFmOztBQUVBLFVBQUlELFFBQUosRUFBYztBQUNaQSxRQUFBQSxRQUFRLENBQUNFLGFBQVQsR0FBeUJGLFFBQVEsQ0FBQ25CLFVBQVQsQ0FBb0JzQixNQUFwQixDQUEyQkMsTUFBTSxJQUFJQSxNQUFNLENBQUNDLFlBQVAsRUFBckMsQ0FBekI7QUFDQUwsUUFBQUEsUUFBUSxDQUFDWCxhQUFULEdBQXlCVyxRQUFRLENBQUNqQixRQUFULENBQWtCTyxhQUFsQixFQUF6QjtBQUVBVSxRQUFBQSxRQUFRLENBQUNNLGFBQVQsR0FBeUJOLFFBQVEsQ0FBQ0UsYUFBVCxDQUF1QkssUUFBdkIsQ0FBZ0NQLFFBQVEsQ0FBQ2Ysa0JBQXpDLENBQXpCO0FBQ0FlLFFBQUFBLFFBQVEsQ0FBQ1Esb0JBQVQsR0FBZ0MsS0FBaEM7O0FBQ0EsWUFBSSxDQUFDUixRQUFRLENBQUNNLGFBQVQsQ0FBdUJHLFNBQXZCLEVBQUQsSUFBdUNULFFBQVEsQ0FBQ0UsYUFBVCxDQUF1QlEsSUFBdkIsT0FBa0MsQ0FBN0UsRUFBZ0Y7QUFDOUVWLFVBQUFBLFFBQVEsQ0FBQ00sYUFBVCxHQUF5QkssS0FBSyxDQUFDQyxJQUFOLENBQVdaLFFBQVEsQ0FBQ0UsYUFBcEIsRUFBbUMsQ0FBbkMsQ0FBekI7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDRixRQUFRLENBQUNNLGFBQVQsQ0FBdUJHLFNBQXZCLEVBQUQsSUFBdUNULFFBQVEsQ0FBQ0UsYUFBVCxDQUF1QlEsSUFBdkIsS0FBZ0MsQ0FBM0UsRUFBOEU7QUFDbkZWLFVBQUFBLFFBQVEsQ0FBQ1Esb0JBQVQsR0FBZ0MsSUFBaEM7QUFDRDs7QUFDRFIsUUFBQUEsUUFBUSxDQUFDSCxRQUFULEdBQW9CQSxRQUFRLEdBQUdHLFFBQVEsQ0FBQ00sYUFBVCxDQUF1Qk8sbUJBQXZCLEVBQS9CO0FBQ0Q7O0FBRUQsMEJBQ0UsNkJBQUMscUJBQUQ7QUFBYyxRQUFBLEtBQUssRUFBRSxLQUFLcEMsS0FBTCxDQUFXbUIsVUFBaEM7QUFBNEMsUUFBQSxTQUFTLEVBQUUsS0FBS2tCLFVBQTVEO0FBQXdFLFFBQUEsV0FBVyxFQUFFLENBQUNqQixRQUFEO0FBQXJGLFNBQ0drQixLQUFLLElBQUksS0FBS0MsV0FBTCxDQUFpQkQsS0FBakIsRUFBd0JmLFFBQXhCLENBRFosQ0FERjtBQUtELEtBbEZrQjs7QUFHakIsU0FBS2lCLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxjQUFjLEVBQUUsSUFETDtBQUVYQyxNQUFBQSx1QkFBdUIsRUFBRSxJQUFJQyxvQkFBSixFQUZkO0FBR1hDLE1BQUFBLFNBQVMsRUFBRSxJQUFJQyxrQkFBSixFQUhBO0FBSVhDLE1BQUFBLFdBQVcsRUFBRSxJQUFJSCxvQkFBSjtBQUpGLEtBQWI7QUFNRDs7QUFFOEIsU0FBeEJJLHdCQUF3QixDQUFDL0MsS0FBRCxFQUFRd0MsS0FBUixFQUFlO0FBQzVDLFFBQUl4QyxLQUFLLENBQUNDLFVBQU4sS0FBcUJ1QyxLQUFLLENBQUNDLGNBQS9CLEVBQStDO0FBQzdDRCxNQUFBQSxLQUFLLENBQUNFLHVCQUFOLENBQThCTSxPQUE5QjtBQUNBUixNQUFBQSxLQUFLLENBQUNNLFdBQU4sQ0FBa0JFLE9BQWxCO0FBRUEsWUFBTU4sdUJBQXVCLEdBQUcsSUFBSU8sK0JBQUosQ0FBMkJqRCxLQUFLLENBQUNDLFVBQWpDLEVBQTZDaUQsNEJBQTdDLEVBQW1EQyw0QkFBbkQsRUFBeURDLDZCQUF6RCxDQUFoQztBQUNBLFlBQU1OLFdBQVcsR0FBR0osdUJBQXVCLENBQUNXLGFBQXhCLENBQXNDLE1BQU1iLEtBQUssQ0FBQ0ksU0FBTixDQUFnQlUsT0FBaEIsRUFBNUMsQ0FBcEI7QUFFQSxhQUFPO0FBQ0xiLFFBQUFBLGNBQWMsRUFBRXpDLEtBQUssQ0FBQ0MsVUFEakI7QUFFTHlDLFFBQUFBLHVCQUZLO0FBR0xJLFFBQUFBO0FBSEssT0FBUDtBQUtEOztBQUVELFdBQU8sSUFBUDtBQUNEOztBQUVEUyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixTQUFLZixLQUFMLENBQVdNLFdBQVgsQ0FBdUJFLE9BQXZCO0FBQ0EsU0FBS1IsS0FBTCxDQUFXRSx1QkFBWCxDQUFtQ00sT0FBbkM7QUFDQSxTQUFLUixLQUFMLENBQVdJLFNBQVgsQ0FBcUJJLE9BQXJCO0FBQ0Q7O0FBbUJEUSxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRSw2QkFBQyxxQkFBRDtBQUFjLE1BQUEsS0FBSyxFQUFFLEtBQUt4RCxLQUFMLENBQVdDLFVBQWhDO0FBQTRDLE1BQUEsU0FBUyxFQUFFLEtBQUt3RDtBQUE1RCxPQUNHLEtBQUtDLG9CQURSLENBREY7QUFLRDs7QUEwQkRuQixFQUFBQSxXQUFXLENBQUNELEtBQUQsRUFBUWYsUUFBUixFQUFrQjtBQUMzQixRQUFJLENBQUNBLFFBQUQsSUFBYSxLQUFLdkIsS0FBTCxDQUFXQyxVQUFYLENBQXNCMEQsU0FBdEIsRUFBakIsRUFBb0Q7QUFDbEQsMEJBQ0UsNkJBQUMsNEJBQUQsZUFDTSxLQUFLM0QsS0FEWDtBQUVFLFFBQUEsU0FBUyxFQUFFLEtBQUt3QyxLQUFMLENBQVdJLFNBRnhCO0FBSUUsUUFBQSxVQUFVLEVBQUUsSUFBSWdCLGtCQUFKLEVBSmQ7QUFLRSxRQUFBLGFBQWEsRUFBRSxJQUFJQSxrQkFBSixFQUxqQjtBQU1FLFFBQUEsYUFBYSxFQUFFQyxrQkFOakI7QUFPRSxRQUFBLFFBQVEsRUFBRSxJQUFJQyxrQkFBSixFQVBaO0FBUUUsUUFBQSxhQUFhLEVBQUVDLGtCQVJqQjtBQVNFLFFBQUEsVUFBVSxFQUFFLENBVGQ7QUFVRSxRQUFBLG9CQUFvQixFQUFFLEtBVnhCO0FBV0UsUUFBQSxjQUFjLEVBQUUsS0FYbEI7QUFZRSxRQUFBLFNBQVMsRUFBRSxJQVpiO0FBYUUsUUFBQSxLQUFLLEVBQUV6QjtBQWJULFNBREY7QUFpQkQ7O0FBRUQsUUFBSSxDQUFDLEtBQUt0QyxLQUFMLENBQVdDLFVBQVgsQ0FBc0IrQixTQUF0QixFQUFMLEVBQXdDO0FBQ3RDLDBCQUNFLDZCQUFDLDRCQUFELGVBQ00sS0FBS2hDLEtBRFg7QUFFRSxRQUFBLFNBQVMsRUFBRSxLQUFLd0MsS0FBTCxDQUFXSSxTQUZ4QjtBQUlFLFFBQUEsVUFBVSxFQUFFLElBQUlnQixrQkFBSixFQUpkO0FBS0UsUUFBQSxhQUFhLEVBQUUsSUFBSUEsa0JBQUosRUFMakI7QUFNRSxRQUFBLGFBQWEsRUFBRUMsa0JBTmpCO0FBT0UsUUFBQSxRQUFRLEVBQUUsSUFBSUMsa0JBQUosRUFQWjtBQVFFLFFBQUEsYUFBYSxFQUFFQyxrQkFSakI7QUFTRSxRQUFBLFVBQVUsRUFBRSxDQVRkO0FBVUUsUUFBQSxvQkFBb0IsRUFBRSxLQVZ4QjtBQVdFLFFBQUEsY0FBYyxFQUFFLEtBWGxCO0FBWUUsUUFBQSxTQUFTLEVBQUUsS0FaYjtBQWFFLFFBQUEsS0FBSyxFQUFFekI7QUFiVCxTQURGO0FBaUJEOztBQUVELHdCQUNFLDZCQUFDLDRCQUFELGVBQ01mLFFBRE4sRUFFTSxLQUFLdkIsS0FGWDtBQUdFLE1BQUEsU0FBUyxFQUFFLEtBQUt3QyxLQUFMLENBQVdJLFNBSHhCO0FBSUUsTUFBQSxTQUFTLEVBQUUsS0FKYjtBQUtFLE1BQUEsS0FBSyxFQUFFTjtBQUxULE9BREY7QUFTRDs7QUF0SjZEOzs7O2dCQUEzQzFDLGtCLGVBQ0E7QUFDakJvRSxFQUFBQSxTQUFTLEVBQUVDLG1CQUFVQyxNQUFWLENBQWlCQyxVQURYO0FBRWpCbEUsRUFBQUEsVUFBVSxFQUFFZ0UsbUJBQVVDLE1BRkw7QUFHakIvQyxFQUFBQSxVQUFVLEVBQUVpRCxxQ0FBeUJELFVBSHBCO0FBSWpCRSxFQUFBQSxVQUFVLEVBQUVDLDhCQUFrQkgsVUFKYjtBQU1qQkksRUFBQUEsc0JBQXNCLEVBQUVOLG1CQUFVTyxJQUFWLENBQWVMLFVBTnRCO0FBT2pCTSxFQUFBQSxtQkFBbUIsRUFBRVIsbUJBQVVPLElBQVYsQ0FBZUwsVUFQbkI7QUFRakJPLEVBQUFBLGtCQUFrQixFQUFFVCxtQkFBVU8sSUFBVixDQUFlTCxVQVJsQjtBQVNqQlEsRUFBQUEsZ0JBQWdCLEVBQUVWLG1CQUFVTyxJQUFWLENBQWVMLFVBVGhCO0FBVWpCUyxFQUFBQSxpQkFBaUIsRUFBRVgsbUJBQVVPLElBQVYsQ0FBZUwsVUFWakI7QUFXakJVLEVBQUFBLGVBQWUsRUFBRVosbUJBQVVPLElBQVYsQ0FBZUwsVUFYZjtBQVlqQlcsRUFBQUEsVUFBVSxFQUFFYixtQkFBVU8sSUFBVixDQUFlTDtBQVpWLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5pbXBvcnQge0Rpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7R2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgT3BlcmF0aW9uU3RhdGVPYnNlcnZlciwge1BVU0gsIFBVTEwsIEZFVENIfSBmcm9tICcuLi9tb2RlbHMvb3BlcmF0aW9uLXN0YXRlLW9ic2VydmVyJztcbmltcG9ydCBSZWZyZXNoZXIgZnJvbSAnLi4vbW9kZWxzL3JlZnJlc2hlcic7XG5pbXBvcnQgR2l0SHViVGFiQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9naXRodWItdGFiLWNvbnRyb2xsZXInO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBSZW1vdGVTZXQgZnJvbSAnLi4vbW9kZWxzL3JlbW90ZS1zZXQnO1xuaW1wb3J0IHtudWxsUmVtb3RlfSBmcm9tICcuLi9tb2RlbHMvcmVtb3RlJztcbmltcG9ydCBCcmFuY2hTZXQgZnJvbSAnLi4vbW9kZWxzL2JyYW5jaC1zZXQnO1xuaW1wb3J0IHtudWxsQnJhbmNofSBmcm9tICcuLi9tb2RlbHMvYnJhbmNoJztcbmltcG9ydCB7RE9UQ09NfSBmcm9tICcuLi9tb2RlbHMvZW5kcG9pbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRIdWJUYWJDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcm9vdEhvbGRlcjogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25EaWRDaGFuZ2VXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBnZXRDdXJyZW50V29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNyZWF0ZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuUHVibGlzaERpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ2xvbmVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkdpdFRhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGxhc3RSZXBvc2l0b3J5OiBudWxsLFxuICAgICAgcmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXI6IG5ldyBEaXNwb3NhYmxlKCksXG4gICAgICByZWZyZXNoZXI6IG5ldyBSZWZyZXNoZXIoKSxcbiAgICAgIG9ic2VydmVyU3ViOiBuZXcgRGlzcG9zYWJsZSgpLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGlmIChwcm9wcy5yZXBvc2l0b3J5ICE9PSBzdGF0ZS5sYXN0UmVwb3NpdG9yeSkge1xuICAgICAgc3RhdGUucmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICAgICAgc3RhdGUub2JzZXJ2ZXJTdWIuZGlzcG9zZSgpO1xuXG4gICAgICBjb25zdCByZW1vdGVPcGVyYXRpb25PYnNlcnZlciA9IG5ldyBPcGVyYXRpb25TdGF0ZU9ic2VydmVyKHByb3BzLnJlcG9zaXRvcnksIFBVU0gsIFBVTEwsIEZFVENIKTtcbiAgICAgIGNvbnN0IG9ic2VydmVyU3ViID0gcmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIub25EaWRDb21wbGV0ZSgoKSA9PiBzdGF0ZS5yZWZyZXNoZXIudHJpZ2dlcigpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGFzdFJlcG9zaXRvcnk6IHByb3BzLnJlcG9zaXRvcnksXG4gICAgICAgIHJlbW90ZU9wZXJhdGlvbk9ic2VydmVyLFxuICAgICAgICBvYnNlcnZlclN1YixcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN0YXRlLm9ic2VydmVyU3ViLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnN0YXRlLnJlbW90ZU9wZXJhdGlvbk9ic2VydmVyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnN0YXRlLnJlZnJlc2hlci5kaXNwb3NlKCk7XG4gIH1cblxuICBmZXRjaFJlcG9zaXRvcnlEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6IHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSxcbiAgICAgIGFsbFJlbW90ZXM6IHJlcG9zaXRvcnkuZ2V0UmVtb3RlcygpLFxuICAgICAgYnJhbmNoZXM6IHJlcG9zaXRvcnkuZ2V0QnJhbmNoZXMoKSxcbiAgICAgIHNlbGVjdGVkUmVtb3RlTmFtZTogcmVwb3NpdG9yeS5nZXRDb25maWcoJ2F0b21HaXRodWIuY3VycmVudFJlbW90ZScpLFxuICAgICAgYWhlYWRDb3VudDogYXN5bmMgcXVlcnkgPT4ge1xuICAgICAgICBjb25zdCBicmFuY2hlcyA9IGF3YWl0IHF1ZXJ5LmJyYW5jaGVzO1xuICAgICAgICBjb25zdCBjdXJyZW50QnJhbmNoID0gYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpO1xuICAgICAgICByZXR1cm4gcmVwb3NpdG9yeS5nZXRBaGVhZENvdW50KGN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpKTtcbiAgICAgIH0sXG4gICAgICBwdXNoSW5Qcm9ncmVzczogcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5pc1B1c2hJblByb2dyZXNzKCksXG4gICAgfSk7XG4gIH1cblxuICBmZXRjaFRva2VuID0gKGxvZ2luTW9kZWwsIGVuZHBvaW50KSA9PiBsb2dpbk1vZGVsLmdldFRva2VuKGVuZHBvaW50LmdldExvZ2luQWNjb3VudCgpKTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMucmVwb3NpdG9yeX0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoUmVwb3NpdG9yeURhdGF9PlxuICAgICAgICB7dGhpcy5yZW5kZXJSZXBvc2l0b3J5RGF0YX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXBvc2l0b3J5RGF0YSA9IHJlcG9EYXRhID0+IHtcbiAgICBsZXQgZW5kcG9pbnQgPSBET1RDT007XG5cbiAgICBpZiAocmVwb0RhdGEpIHtcbiAgICAgIHJlcG9EYXRhLmdpdGh1YlJlbW90ZXMgPSByZXBvRGF0YS5hbGxSZW1vdGVzLmZpbHRlcihyZW1vdGUgPT4gcmVtb3RlLmlzR2l0aHViUmVwbygpKTtcbiAgICAgIHJlcG9EYXRhLmN1cnJlbnRCcmFuY2ggPSByZXBvRGF0YS5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCk7XG5cbiAgICAgIHJlcG9EYXRhLmN1cnJlbnRSZW1vdGUgPSByZXBvRGF0YS5naXRodWJSZW1vdGVzLndpdGhOYW1lKHJlcG9EYXRhLnNlbGVjdGVkUmVtb3RlTmFtZSk7XG4gICAgICByZXBvRGF0YS5tYW55UmVtb3Rlc0F2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgaWYgKCFyZXBvRGF0YS5jdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpICYmIHJlcG9EYXRhLmdpdGh1YlJlbW90ZXMuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgIHJlcG9EYXRhLmN1cnJlbnRSZW1vdGUgPSBBcnJheS5mcm9tKHJlcG9EYXRhLmdpdGh1YlJlbW90ZXMpWzBdO1xuICAgICAgfSBlbHNlIGlmICghcmVwb0RhdGEuY3VycmVudFJlbW90ZS5pc1ByZXNlbnQoKSAmJiByZXBvRGF0YS5naXRodWJSZW1vdGVzLnNpemUoKSA+IDEpIHtcbiAgICAgICAgcmVwb0RhdGEubWFueVJlbW90ZXNBdmFpbGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmVwb0RhdGEuZW5kcG9pbnQgPSBlbmRwb2ludCA9IHJlcG9EYXRhLmN1cnJlbnRSZW1vdGUuZ2V0RW5kcG9pbnRPckRvdGNvbSgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9IGZldGNoRGF0YT17dGhpcy5mZXRjaFRva2VufSBmZXRjaFBhcmFtcz17W2VuZHBvaW50XX0+XG4gICAgICAgIHt0b2tlbiA9PiB0aGlzLnJlbmRlclRva2VuKHRva2VuLCByZXBvRGF0YSl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVG9rZW4odG9rZW4sIHJlcG9EYXRhKSB7XG4gICAgaWYgKCFyZXBvRGF0YSB8fCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNMb2FkaW5nKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHaXRIdWJUYWJDb250cm9sbGVyXG4gICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgcmVmcmVzaGVyPXt0aGlzLnN0YXRlLnJlZnJlc2hlcn1cblxuICAgICAgICAgIGFsbFJlbW90ZXM9e25ldyBSZW1vdGVTZXQoKX1cbiAgICAgICAgICBnaXRodWJSZW1vdGVzPXtuZXcgUmVtb3RlU2V0KCl9XG4gICAgICAgICAgY3VycmVudFJlbW90ZT17bnVsbFJlbW90ZX1cbiAgICAgICAgICBicmFuY2hlcz17bmV3IEJyYW5jaFNldCgpfVxuICAgICAgICAgIGN1cnJlbnRCcmFuY2g9e251bGxCcmFuY2h9XG4gICAgICAgICAgYWhlYWRDb3VudD17MH1cbiAgICAgICAgICBtYW55UmVtb3Rlc0F2YWlsYWJsZT17ZmFsc2V9XG4gICAgICAgICAgcHVzaEluUHJvZ3Jlc3M9e2ZhbHNlfVxuICAgICAgICAgIGlzTG9hZGluZz17dHJ1ZX1cbiAgICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8R2l0SHViVGFiQ29udHJvbGxlclxuICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgIHJlZnJlc2hlcj17dGhpcy5zdGF0ZS5yZWZyZXNoZXJ9XG5cbiAgICAgICAgICBhbGxSZW1vdGVzPXtuZXcgUmVtb3RlU2V0KCl9XG4gICAgICAgICAgZ2l0aHViUmVtb3Rlcz17bmV3IFJlbW90ZVNldCgpfVxuICAgICAgICAgIGN1cnJlbnRSZW1vdGU9e251bGxSZW1vdGV9XG4gICAgICAgICAgYnJhbmNoZXM9e25ldyBCcmFuY2hTZXQoKX1cbiAgICAgICAgICBjdXJyZW50QnJhbmNoPXtudWxsQnJhbmNofVxuICAgICAgICAgIGFoZWFkQ291bnQ9ezB9XG4gICAgICAgICAgbWFueVJlbW90ZXNBdmFpbGFibGU9e2ZhbHNlfVxuICAgICAgICAgIHB1c2hJblByb2dyZXNzPXtmYWxzZX1cbiAgICAgICAgICBpc0xvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRIdWJUYWJDb250cm9sbGVyXG4gICAgICAgIHsuLi5yZXBvRGF0YX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgIHJlZnJlc2hlcj17dGhpcy5zdGF0ZS5yZWZyZXNoZXJ9XG4gICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19