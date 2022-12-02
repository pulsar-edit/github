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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2dpdGh1Yi10YWItY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkdpdEh1YlRhYkNvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlcG9zaXRvcnkiLCJ3b3JraW5nRGlyZWN0b3J5IiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJhbGxSZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJzZWxlY3RlZFJlbW90ZU5hbWUiLCJnZXRDb25maWciLCJhaGVhZENvdW50IiwicXVlcnkiLCJjdXJyZW50QnJhbmNoIiwiZ2V0SGVhZEJyYW5jaCIsImdldEFoZWFkQ291bnQiLCJnZXROYW1lIiwicHVzaEluUHJvZ3Jlc3MiLCJnZXRPcGVyYXRpb25TdGF0ZXMiLCJpc1B1c2hJblByb2dyZXNzIiwibG9naW5Nb2RlbCIsImVuZHBvaW50IiwiZ2V0VG9rZW4iLCJnZXRMb2dpbkFjY291bnQiLCJyZXBvRGF0YSIsIkRPVENPTSIsImdpdGh1YlJlbW90ZXMiLCJmaWx0ZXIiLCJyZW1vdGUiLCJpc0dpdGh1YlJlcG8iLCJjdXJyZW50UmVtb3RlIiwid2l0aE5hbWUiLCJtYW55UmVtb3Rlc0F2YWlsYWJsZSIsImlzUHJlc2VudCIsInNpemUiLCJBcnJheSIsImZyb20iLCJnZXRFbmRwb2ludE9yRG90Y29tIiwiZmV0Y2hUb2tlbiIsInRva2VuIiwicmVuZGVyVG9rZW4iLCJzdGF0ZSIsImxhc3RSZXBvc2l0b3J5IiwicmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIiLCJEaXNwb3NhYmxlIiwicmVmcmVzaGVyIiwiUmVmcmVzaGVyIiwib2JzZXJ2ZXJTdWIiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJkaXNwb3NlIiwiT3BlcmF0aW9uU3RhdGVPYnNlcnZlciIsIlBVU0giLCJQVUxMIiwiRkVUQ0giLCJvbkRpZENvbXBsZXRlIiwidHJpZ2dlciIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVuZGVyIiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlbmRlclJlcG9zaXRvcnlEYXRhIiwiaXNMb2FkaW5nIiwiUmVtb3RlU2V0IiwibnVsbFJlbW90ZSIsIkJyYW5jaFNldCIsIm51bGxCcmFuY2giLCJ3b3Jrc3BhY2UiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwicm9vdEhvbGRlciIsIlJlZkhvbGRlclByb3BUeXBlIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsImZ1bmMiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwib3BlbkNyZWF0ZURpYWxvZyIsIm9wZW5QdWJsaXNoRGlhbG9nIiwib3BlbkNsb25lRGlhbG9nIiwib3BlbkdpdFRhYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTixTQUFpQ0MsZUFBTUMsU0FBdkMsQ0FBaUQ7QUFnQjlEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQixpREFtQ0dDLFVBQVUsSUFBSTtBQUNsQyxhQUFPLHVCQUFTO0FBQ2RDLFFBQUFBLGdCQUFnQixFQUFFRCxVQUFVLENBQUNFLHVCQUFYLEVBREo7QUFFZEMsUUFBQUEsVUFBVSxFQUFFSCxVQUFVLENBQUNJLFVBQVgsRUFGRTtBQUdkQyxRQUFBQSxRQUFRLEVBQUVMLFVBQVUsQ0FBQ00sV0FBWCxFQUhJO0FBSWRDLFFBQUFBLGtCQUFrQixFQUFFUCxVQUFVLENBQUNRLFNBQVgsQ0FBcUIsMEJBQXJCLENBSk47QUFLZEMsUUFBQUEsVUFBVSxFQUFFLE1BQU1DLEtBQU4sSUFBZTtBQUN6QixnQkFBTUwsUUFBUSxHQUFHLE1BQU1LLEtB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LG1CQUFVQyxNQUZMO0FBR2pCL0MsRUFBQUEsVUFBVSxFQUFFaUQscUNBQXlCRCxVQUhwQjtBQUlqQkUsRUFBQUEsVUFBVSxFQUFFQyw4QkFBa0JILFVBSmI7QUFNakJJLEVBQUFBLHNCQUFzQixFQUFFTixtQkFBVU8sSUFBVixDQUFlTCxVQU50QjtBQU9qQk0sRUFBQUEsbUJBQW1CLEVBQUVSLG1CQUFVTyxJQUFWLENBQWVMLFVBUG5CO0FBUWpCTyxFQUFBQSxrQkFBa0IsRUFBRVQsbUJBQVVPLElBQVYsQ0FBZUwsVUFSbEI7QUFTakJRLEVBQUFBLGdCQUFnQixFQUFFVixtQkFBVU8sSUFBVixDQUFlTCxVQVRoQjtBQVVqQlMsRUFBQUEsaUJBQWlCLEVBQUVYLG1CQUFVTyxJQUFWLENBQWVMLFVBVmpCO0FBV2pCVSxFQUFBQSxlQUFlLEVBQUVaLG1CQUFVTyxJQUFWLENBQWVMLFVBWGY7QUFZakJXLEVBQUFBLFVBQVUsRUFBRWIsbUJBQVVPLElBQVYsQ0FBZUw7QUFaVixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge0dpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IE9wZXJhdGlvblN0YXRlT2JzZXJ2ZXIsIHtQVVNILCBQVUxMLCBGRVRDSH0gZnJvbSAnLi4vbW9kZWxzL29wZXJhdGlvbi1zdGF0ZS1vYnNlcnZlcic7XG5pbXBvcnQgUmVmcmVzaGVyIGZyb20gJy4uL21vZGVscy9yZWZyZXNoZXInO1xuaW1wb3J0IEdpdEh1YlRhYkNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZ2l0aHViLXRhYi1jb250cm9sbGVyJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQgUmVtb3RlU2V0IGZyb20gJy4uL21vZGVscy9yZW1vdGUtc2V0JztcbmltcG9ydCB7bnVsbFJlbW90ZX0gZnJvbSAnLi4vbW9kZWxzL3JlbW90ZSc7XG5pbXBvcnQgQnJhbmNoU2V0IGZyb20gJy4uL21vZGVscy9icmFuY2gtc2V0JztcbmltcG9ydCB7bnVsbEJyYW5jaH0gZnJvbSAnLi4vbW9kZWxzL2JyYW5jaCc7XG5pbXBvcnQge0RPVENPTX0gZnJvbSAnLi4vbW9kZWxzL2VuZHBvaW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0SHViVGFiQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGxvZ2luTW9kZWw6IEdpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJvb3RIb2xkZXI6IFJlZkhvbGRlclByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0Q3VycmVudFdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5DcmVhdGVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlblB1Ymxpc2hEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNsb25lRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5HaXRUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBsYXN0UmVwb3NpdG9yeTogbnVsbCxcbiAgICAgIHJlbW90ZU9wZXJhdGlvbk9ic2VydmVyOiBuZXcgRGlzcG9zYWJsZSgpLFxuICAgICAgcmVmcmVzaGVyOiBuZXcgUmVmcmVzaGVyKCksXG4gICAgICBvYnNlcnZlclN1YjogbmV3IERpc3Bvc2FibGUoKSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICBpZiAocHJvcHMucmVwb3NpdG9yeSAhPT0gc3RhdGUubGFzdFJlcG9zaXRvcnkpIHtcbiAgICAgIHN0YXRlLnJlbW90ZU9wZXJhdGlvbk9ic2VydmVyLmRpc3Bvc2UoKTtcbiAgICAgIHN0YXRlLm9ic2VydmVyU3ViLmRpc3Bvc2UoKTtcblxuICAgICAgY29uc3QgcmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIgPSBuZXcgT3BlcmF0aW9uU3RhdGVPYnNlcnZlcihwcm9wcy5yZXBvc2l0b3J5LCBQVVNILCBQVUxMLCBGRVRDSCk7XG4gICAgICBjb25zdCBvYnNlcnZlclN1YiA9IHJlbW90ZU9wZXJhdGlvbk9ic2VydmVyLm9uRGlkQ29tcGxldGUoKCkgPT4gc3RhdGUucmVmcmVzaGVyLnRyaWdnZXIoKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhc3RSZXBvc2l0b3J5OiBwcm9wcy5yZXBvc2l0b3J5LFxuICAgICAgICByZW1vdGVPcGVyYXRpb25PYnNlcnZlcixcbiAgICAgICAgb2JzZXJ2ZXJTdWIsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdGF0ZS5vYnNlcnZlclN1Yi5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdGF0ZS5yZW1vdGVPcGVyYXRpb25PYnNlcnZlci5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdGF0ZS5yZWZyZXNoZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgZmV0Y2hSZXBvc2l0b3J5RGF0YSA9IHJlcG9zaXRvcnkgPT4ge1xuICAgIHJldHVybiB5dWJpa2lyaSh7XG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgICBhbGxSZW1vdGVzOiByZXBvc2l0b3J5LmdldFJlbW90ZXMoKSxcbiAgICAgIGJyYW5jaGVzOiByZXBvc2l0b3J5LmdldEJyYW5jaGVzKCksXG4gICAgICBzZWxlY3RlZFJlbW90ZU5hbWU6IHJlcG9zaXRvcnkuZ2V0Q29uZmlnKCdhdG9tR2l0aHViLmN1cnJlbnRSZW1vdGUnKSxcbiAgICAgIGFoZWFkQ291bnQ6IGFzeW5jIHF1ZXJ5ID0+IHtcbiAgICAgICAgY29uc3QgYnJhbmNoZXMgPSBhd2FpdCBxdWVyeS5icmFuY2hlcztcbiAgICAgICAgY29uc3QgY3VycmVudEJyYW5jaCA9IGJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICAgICAgcmV0dXJuIHJlcG9zaXRvcnkuZ2V0QWhlYWRDb3VudChjdXJyZW50QnJhbmNoLmdldE5hbWUoKSk7XG4gICAgICB9LFxuICAgICAgcHVzaEluUHJvZ3Jlc3M6IHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuaXNQdXNoSW5Qcm9ncmVzcygpLFxuICAgIH0pO1xuICB9XG5cbiAgZmV0Y2hUb2tlbiA9IChsb2dpbk1vZGVsLCBlbmRwb2ludCkgPT4gbG9naW5Nb2RlbC5nZXRUb2tlbihlbmRwb2ludC5nZXRMb2dpbkFjY291bnQoKSk7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaFJlcG9zaXRvcnlEYXRhfT5cbiAgICAgICAge3RoaXMucmVuZGVyUmVwb3NpdG9yeURhdGF9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVwb3NpdG9yeURhdGEgPSByZXBvRGF0YSA9PiB7XG4gICAgbGV0IGVuZHBvaW50ID0gRE9UQ09NO1xuXG4gICAgaWYgKHJlcG9EYXRhKSB7XG4gICAgICByZXBvRGF0YS5naXRodWJSZW1vdGVzID0gcmVwb0RhdGEuYWxsUmVtb3Rlcy5maWx0ZXIocmVtb3RlID0+IHJlbW90ZS5pc0dpdGh1YlJlcG8oKSk7XG4gICAgICByZXBvRGF0YS5jdXJyZW50QnJhbmNoID0gcmVwb0RhdGEuYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpO1xuXG4gICAgICByZXBvRGF0YS5jdXJyZW50UmVtb3RlID0gcmVwb0RhdGEuZ2l0aHViUmVtb3Rlcy53aXRoTmFtZShyZXBvRGF0YS5zZWxlY3RlZFJlbW90ZU5hbWUpO1xuICAgICAgcmVwb0RhdGEubWFueVJlbW90ZXNBdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgIGlmICghcmVwb0RhdGEuY3VycmVudFJlbW90ZS5pc1ByZXNlbnQoKSAmJiByZXBvRGF0YS5naXRodWJSZW1vdGVzLnNpemUoKSA9PT0gMSkge1xuICAgICAgICByZXBvRGF0YS5jdXJyZW50UmVtb3RlID0gQXJyYXkuZnJvbShyZXBvRGF0YS5naXRodWJSZW1vdGVzKVswXTtcbiAgICAgIH0gZWxzZSBpZiAoIXJlcG9EYXRhLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCkgJiYgcmVwb0RhdGEuZ2l0aHViUmVtb3Rlcy5zaXplKCkgPiAxKSB7XG4gICAgICAgIHJlcG9EYXRhLm1hbnlSZW1vdGVzQXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJlcG9EYXRhLmVuZHBvaW50ID0gZW5kcG9pbnQgPSByZXBvRGF0YS5jdXJyZW50UmVtb3RlLmdldEVuZHBvaW50T3JEb3Rjb20oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hUb2tlbn0gZmV0Y2hQYXJhbXM9e1tlbmRwb2ludF19PlxuICAgICAgICB7dG9rZW4gPT4gdGhpcy5yZW5kZXJUb2tlbih0b2tlbiwgcmVwb0RhdGEpfVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRva2VuKHRva2VuLCByZXBvRGF0YSkge1xuICAgIGlmICghcmVwb0RhdGEgfHwgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzTG9hZGluZygpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8R2l0SHViVGFiQ29udHJvbGxlclxuICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgIHJlZnJlc2hlcj17dGhpcy5zdGF0ZS5yZWZyZXNoZXJ9XG5cbiAgICAgICAgICBhbGxSZW1vdGVzPXtuZXcgUmVtb3RlU2V0KCl9XG4gICAgICAgICAgZ2l0aHViUmVtb3Rlcz17bmV3IFJlbW90ZVNldCgpfVxuICAgICAgICAgIGN1cnJlbnRSZW1vdGU9e251bGxSZW1vdGV9XG4gICAgICAgICAgYnJhbmNoZXM9e25ldyBCcmFuY2hTZXQoKX1cbiAgICAgICAgICBjdXJyZW50QnJhbmNoPXtudWxsQnJhbmNofVxuICAgICAgICAgIGFoZWFkQ291bnQ9ezB9XG4gICAgICAgICAgbWFueVJlbW90ZXNBdmFpbGFibGU9e2ZhbHNlfVxuICAgICAgICAgIHB1c2hJblByb2dyZXNzPXtmYWxzZX1cbiAgICAgICAgICBpc0xvYWRpbmc9e3RydWV9XG4gICAgICAgICAgdG9rZW49e3Rva2VufVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucHJvcHMucmVwb3NpdG9yeS5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEdpdEh1YlRhYkNvbnRyb2xsZXJcbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICByZWZyZXNoZXI9e3RoaXMuc3RhdGUucmVmcmVzaGVyfVxuXG4gICAgICAgICAgYWxsUmVtb3Rlcz17bmV3IFJlbW90ZVNldCgpfVxuICAgICAgICAgIGdpdGh1YlJlbW90ZXM9e25ldyBSZW1vdGVTZXQoKX1cbiAgICAgICAgICBjdXJyZW50UmVtb3RlPXtudWxsUmVtb3RlfVxuICAgICAgICAgIGJyYW5jaGVzPXtuZXcgQnJhbmNoU2V0KCl9XG4gICAgICAgICAgY3VycmVudEJyYW5jaD17bnVsbEJyYW5jaH1cbiAgICAgICAgICBhaGVhZENvdW50PXswfVxuICAgICAgICAgIG1hbnlSZW1vdGVzQXZhaWxhYmxlPXtmYWxzZX1cbiAgICAgICAgICBwdXNoSW5Qcm9ncmVzcz17ZmFsc2V9XG4gICAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8R2l0SHViVGFiQ29udHJvbGxlclxuICAgICAgICB7Li4ucmVwb0RhdGF9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICByZWZyZXNoZXI9e3RoaXMuc3RhdGUucmVmcmVzaGVyfVxuICAgICAgICBpc0xvYWRpbmc9e2ZhbHNlfVxuICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==