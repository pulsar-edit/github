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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRIdWJUYWJDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZXBvc2l0b3J5IiwieXViaWtpcmkiLCJ3b3JraW5nRGlyZWN0b3J5IiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJhbGxSZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJzZWxlY3RlZFJlbW90ZU5hbWUiLCJnZXRDb25maWciLCJhaGVhZENvdW50IiwicXVlcnkiLCJjdXJyZW50QnJhbmNoIiwiZ2V0SGVhZEJyYW5jaCIsImdldEFoZWFkQ291bnQiLCJnZXROYW1lIiwicHVzaEluUHJvZ3Jlc3MiLCJnZXRPcGVyYXRpb25TdGF0ZXMiLCJpc1B1c2hJblByb2dyZXNzIiwibG9naW5Nb2RlbCIsImVuZHBvaW50IiwiZ2V0VG9rZW4iLCJnZXRMb2dpbkFjY291bnQiLCJyZXBvRGF0YSIsIkRPVENPTSIsImdpdGh1YlJlbW90ZXMiLCJmaWx0ZXIiLCJyZW1vdGUiLCJpc0dpdGh1YlJlcG8iLCJjdXJyZW50UmVtb3RlIiwid2l0aE5hbWUiLCJtYW55UmVtb3Rlc0F2YWlsYWJsZSIsImlzUHJlc2VudCIsInNpemUiLCJBcnJheSIsImZyb20iLCJnZXRFbmRwb2ludE9yRG90Y29tIiwiZmV0Y2hUb2tlbiIsInRva2VuIiwicmVuZGVyVG9rZW4iLCJzdGF0ZSIsImxhc3RSZXBvc2l0b3J5IiwicmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIiLCJEaXNwb3NhYmxlIiwicmVmcmVzaGVyIiwiUmVmcmVzaGVyIiwib2JzZXJ2ZXJTdWIiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJkaXNwb3NlIiwiT3BlcmF0aW9uU3RhdGVPYnNlcnZlciIsIlBVU0giLCJQVUxMIiwiRkVUQ0giLCJvbkRpZENvbXBsZXRlIiwidHJpZ2dlciIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVuZGVyIiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlbmRlclJlcG9zaXRvcnlEYXRhIiwiaXNMb2FkaW5nIiwiUmVtb3RlU2V0IiwibnVsbFJlbW90ZSIsIkJyYW5jaFNldCIsIm51bGxCcmFuY2giLCJ3b3Jrc3BhY2UiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwicm9vdEhvbGRlciIsIlJlZkhvbGRlclByb3BUeXBlIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsImZ1bmMiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwib3BlbkNyZWF0ZURpYWxvZyIsIm9wZW5QdWJsaXNoRGlhbG9nIiwib3BlbkNsb25lRGlhbG9nIiwib3BlbkdpdFRhYiJdLCJzb3VyY2VzIjpbImdpdGh1Yi10YWItY29udGFpbmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUsIFJlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBPcGVyYXRpb25TdGF0ZU9ic2VydmVyLCB7UFVTSCwgUFVMTCwgRkVUQ0h9IGZyb20gJy4uL21vZGVscy9vcGVyYXRpb24tc3RhdGUtb2JzZXJ2ZXInO1xuaW1wb3J0IFJlZnJlc2hlciBmcm9tICcuLi9tb2RlbHMvcmVmcmVzaGVyJztcbmltcG9ydCBHaXRIdWJUYWJDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2dpdGh1Yi10YWItY29udHJvbGxlcic7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IFJlbW90ZVNldCBmcm9tICcuLi9tb2RlbHMvcmVtb3RlLXNldCc7XG5pbXBvcnQge251bGxSZW1vdGV9IGZyb20gJy4uL21vZGVscy9yZW1vdGUnO1xuaW1wb3J0IEJyYW5jaFNldCBmcm9tICcuLi9tb2RlbHMvYnJhbmNoLXNldCc7XG5pbXBvcnQge251bGxCcmFuY2h9IGZyb20gJy4uL21vZGVscy9icmFuY2gnO1xuaW1wb3J0IHtET1RDT019IGZyb20gJy4uL21vZGVscy9lbmRwb2ludCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdEh1YlRhYkNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBsb2dpbk1vZGVsOiBHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByb290SG9sZGVyOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ3JlYXRlRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5QdWJsaXNoRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5DbG9uZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuR2l0VGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbGFzdFJlcG9zaXRvcnk6IG51bGwsXG4gICAgICByZW1vdGVPcGVyYXRpb25PYnNlcnZlcjogbmV3IERpc3Bvc2FibGUoKSxcbiAgICAgIHJlZnJlc2hlcjogbmV3IFJlZnJlc2hlcigpLFxuICAgICAgb2JzZXJ2ZXJTdWI6IG5ldyBEaXNwb3NhYmxlKCksXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgaWYgKHByb3BzLnJlcG9zaXRvcnkgIT09IHN0YXRlLmxhc3RSZXBvc2l0b3J5KSB7XG4gICAgICBzdGF0ZS5yZW1vdGVPcGVyYXRpb25PYnNlcnZlci5kaXNwb3NlKCk7XG4gICAgICBzdGF0ZS5vYnNlcnZlclN1Yi5kaXNwb3NlKCk7XG5cbiAgICAgIGNvbnN0IHJlbW90ZU9wZXJhdGlvbk9ic2VydmVyID0gbmV3IE9wZXJhdGlvblN0YXRlT2JzZXJ2ZXIocHJvcHMucmVwb3NpdG9yeSwgUFVTSCwgUFVMTCwgRkVUQ0gpO1xuICAgICAgY29uc3Qgb2JzZXJ2ZXJTdWIgPSByZW1vdGVPcGVyYXRpb25PYnNlcnZlci5vbkRpZENvbXBsZXRlKCgpID0+IHN0YXRlLnJlZnJlc2hlci50cmlnZ2VyKCkpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBsYXN0UmVwb3NpdG9yeTogcHJvcHMucmVwb3NpdG9yeSxcbiAgICAgICAgcmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIsXG4gICAgICAgIG9ic2VydmVyU3ViLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3RhdGUub2JzZXJ2ZXJTdWIuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3RhdGUucmVtb3RlT3BlcmF0aW9uT2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3RhdGUucmVmcmVzaGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGZldGNoUmVwb3NpdG9yeURhdGEgPSByZXBvc2l0b3J5ID0+IHtcbiAgICByZXR1cm4geXViaWtpcmkoe1xuICAgICAgd29ya2luZ0RpcmVjdG9yeTogcmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLFxuICAgICAgYWxsUmVtb3RlczogcmVwb3NpdG9yeS5nZXRSZW1vdGVzKCksXG4gICAgICBicmFuY2hlczogcmVwb3NpdG9yeS5nZXRCcmFuY2hlcygpLFxuICAgICAgc2VsZWN0ZWRSZW1vdGVOYW1lOiByZXBvc2l0b3J5LmdldENvbmZpZygnYXRvbUdpdGh1Yi5jdXJyZW50UmVtb3RlJyksXG4gICAgICBhaGVhZENvdW50OiBhc3luYyBxdWVyeSA9PiB7XG4gICAgICAgIGNvbnN0IGJyYW5jaGVzID0gYXdhaXQgcXVlcnkuYnJhbmNoZXM7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRCcmFuY2ggPSBicmFuY2hlcy5nZXRIZWFkQnJhbmNoKCk7XG4gICAgICAgIHJldHVybiByZXBvc2l0b3J5LmdldEFoZWFkQ291bnQoY3VycmVudEJyYW5jaC5nZXROYW1lKCkpO1xuICAgICAgfSxcbiAgICAgIHB1c2hJblByb2dyZXNzOiByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLmlzUHVzaEluUHJvZ3Jlc3MoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGZldGNoVG9rZW4gPSAobG9naW5Nb2RlbCwgZW5kcG9pbnQpID0+IGxvZ2luTW9kZWwuZ2V0VG9rZW4oZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCkpO1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hSZXBvc2l0b3J5RGF0YX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclJlcG9zaXRvcnlEYXRhfVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlcG9zaXRvcnlEYXRhID0gcmVwb0RhdGEgPT4ge1xuICAgIGxldCBlbmRwb2ludCA9IERPVENPTTtcblxuICAgIGlmIChyZXBvRGF0YSkge1xuICAgICAgcmVwb0RhdGEuZ2l0aHViUmVtb3RlcyA9IHJlcG9EYXRhLmFsbFJlbW90ZXMuZmlsdGVyKHJlbW90ZSA9PiByZW1vdGUuaXNHaXRodWJSZXBvKCkpO1xuICAgICAgcmVwb0RhdGEuY3VycmVudEJyYW5jaCA9IHJlcG9EYXRhLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcblxuICAgICAgcmVwb0RhdGEuY3VycmVudFJlbW90ZSA9IHJlcG9EYXRhLmdpdGh1YlJlbW90ZXMud2l0aE5hbWUocmVwb0RhdGEuc2VsZWN0ZWRSZW1vdGVOYW1lKTtcbiAgICAgIHJlcG9EYXRhLm1hbnlSZW1vdGVzQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICBpZiAoIXJlcG9EYXRhLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCkgJiYgcmVwb0RhdGEuZ2l0aHViUmVtb3Rlcy5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgcmVwb0RhdGEuY3VycmVudFJlbW90ZSA9IEFycmF5LmZyb20ocmVwb0RhdGEuZ2l0aHViUmVtb3RlcylbMF07XG4gICAgICB9IGVsc2UgaWYgKCFyZXBvRGF0YS5jdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpICYmIHJlcG9EYXRhLmdpdGh1YlJlbW90ZXMuc2l6ZSgpID4gMSkge1xuICAgICAgICByZXBvRGF0YS5tYW55UmVtb3Rlc0F2YWlsYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXBvRGF0YS5lbmRwb2ludCA9IGVuZHBvaW50ID0gcmVwb0RhdGEuY3VycmVudFJlbW90ZS5nZXRFbmRwb2ludE9yRG90Y29tKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoVG9rZW59IGZldGNoUGFyYW1zPXtbZW5kcG9pbnRdfT5cbiAgICAgICAge3Rva2VuID0+IHRoaXMucmVuZGVyVG9rZW4odG9rZW4sIHJlcG9EYXRhKX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUb2tlbih0b2tlbiwgcmVwb0RhdGEpIHtcbiAgICBpZiAoIXJlcG9EYXRhIHx8IHRoaXMucHJvcHMucmVwb3NpdG9yeS5pc0xvYWRpbmcoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEdpdEh1YlRhYkNvbnRyb2xsZXJcbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICByZWZyZXNoZXI9e3RoaXMuc3RhdGUucmVmcmVzaGVyfVxuXG4gICAgICAgICAgYWxsUmVtb3Rlcz17bmV3IFJlbW90ZVNldCgpfVxuICAgICAgICAgIGdpdGh1YlJlbW90ZXM9e25ldyBSZW1vdGVTZXQoKX1cbiAgICAgICAgICBjdXJyZW50UmVtb3RlPXtudWxsUmVtb3RlfVxuICAgICAgICAgIGJyYW5jaGVzPXtuZXcgQnJhbmNoU2V0KCl9XG4gICAgICAgICAgY3VycmVudEJyYW5jaD17bnVsbEJyYW5jaH1cbiAgICAgICAgICBhaGVhZENvdW50PXswfVxuICAgICAgICAgIG1hbnlSZW1vdGVzQXZhaWxhYmxlPXtmYWxzZX1cbiAgICAgICAgICBwdXNoSW5Qcm9ncmVzcz17ZmFsc2V9XG4gICAgICAgICAgaXNMb2FkaW5nPXt0cnVlfVxuICAgICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHaXRIdWJUYWJDb250cm9sbGVyXG4gICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgcmVmcmVzaGVyPXt0aGlzLnN0YXRlLnJlZnJlc2hlcn1cblxuICAgICAgICAgIGFsbFJlbW90ZXM9e25ldyBSZW1vdGVTZXQoKX1cbiAgICAgICAgICBnaXRodWJSZW1vdGVzPXtuZXcgUmVtb3RlU2V0KCl9XG4gICAgICAgICAgY3VycmVudFJlbW90ZT17bnVsbFJlbW90ZX1cbiAgICAgICAgICBicmFuY2hlcz17bmV3IEJyYW5jaFNldCgpfVxuICAgICAgICAgIGN1cnJlbnRCcmFuY2g9e251bGxCcmFuY2h9XG4gICAgICAgICAgYWhlYWRDb3VudD17MH1cbiAgICAgICAgICBtYW55UmVtb3Rlc0F2YWlsYWJsZT17ZmFsc2V9XG4gICAgICAgICAgcHVzaEluUHJvZ3Jlc3M9e2ZhbHNlfVxuICAgICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgdG9rZW49e3Rva2VufVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdpdEh1YlRhYkNvbnRyb2xsZXJcbiAgICAgICAgey4uLnJlcG9EYXRhfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgcmVmcmVzaGVyPXt0aGlzLnN0YXRlLnJlZnJlc2hlcn1cbiAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgdG9rZW49e3Rva2VufVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBMEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFM0IsTUFBTUEsa0JBQWtCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBZ0I5REMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyw2Q0FrQ09DLFVBQVUsSUFBSTtNQUNsQyxPQUFPLElBQUFDLGlCQUFRLEVBQUM7UUFDZEMsZ0JBQWdCLEVBQUVGLFVBQVUsQ0FBQ0csdUJBQXVCLEVBQUU7UUFDdERDLFVBQVUsRUFBRUosVUFBVSxDQUFDSyxVQUFVLEVBQUU7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