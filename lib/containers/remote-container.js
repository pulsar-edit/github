"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRelay = require("react-relay");
var _propTypes2 = require("../prop-types");
var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));
var _remoteController = _interopRequireDefault(require("../controllers/remote-controller"));
var _loadingView = _interopRequireDefault(require("../views/loading-view"));
var _queryErrorView = _interopRequireDefault(require("../views/query-error-view"));
var _graphql;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class RemoteContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderWithResult", ({
      error,
      props,
      retry
    }) => {
      this.props.refresher.setRetryCallback(this, retry);
      if (error) {
        return _react.default.createElement(_queryErrorView.default, {
          error: error,
          login: this.props.handleLogin,
          logout: this.props.handleLogout,
          retry: retry
        });
      }
      if (props === null) {
        return _react.default.createElement(_loadingView.default, null);
      }
      return _react.default.createElement(_remoteController.default, {
        endpoint: this.props.endpoint,
        token: this.props.token,
        repository: props.repository,
        workingDirectory: this.props.workingDirectory,
        workspace: this.props.workspace,
        remote: this.props.remote,
        remotes: this.props.remotes,
        branches: this.props.branches,
        aheadCount: this.props.aheadCount,
        pushInProgress: this.props.pushInProgress,
        onPushBranch: this.props.onPushBranch
      });
    });
  }
  render() {
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, this.props.token);
    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/remoteContainerQuery.graphql");
      if (node.hash && node.hash !== "b83aa6c27c5d7e1c499badf2e6bfab6b") {
        console.error("The definition of 'remoteContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }
      return require("./__generated__/remoteContainerQuery.graphql");
    });
    const variables = {
      owner: this.props.remote.getOwner(),
      name: this.props.remote.getRepo()
    };
    return _react.default.createElement(_reactRelay.QueryRenderer, {
      environment: environment,
      variables: variables,
      query: query,
      render: this.renderWithResult
    });
  }
}
exports.default = RemoteContainer;
_defineProperty(RemoteContainer, "propTypes", {
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes2.TokenPropType.isRequired,
  // Repository attributes
  refresher: _propTypes2.RefresherPropType.isRequired,
  pushInProgress: _propTypes.default.bool.isRequired,
  workingDirectory: _propTypes.default.string,
  workspace: _propTypes.default.object.isRequired,
  remote: _propTypes2.RemotePropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  // Action methods
  handleLogin: _propTypes.default.func.isRequired,
  handleLogout: _propTypes.default.func.isRequired,
  onPushBranch: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZW1vdGVDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImVycm9yIiwicHJvcHMiLCJyZXRyeSIsInJlZnJlc2hlciIsInNldFJldHJ5Q2FsbGJhY2siLCJoYW5kbGVMb2dpbiIsImhhbmRsZUxvZ291dCIsImVuZHBvaW50IiwidG9rZW4iLCJyZXBvc2l0b3J5Iiwid29ya2luZ0RpcmVjdG9yeSIsIndvcmtzcGFjZSIsInJlbW90ZSIsInJlbW90ZXMiLCJicmFuY2hlcyIsImFoZWFkQ291bnQiLCJwdXNoSW5Qcm9ncmVzcyIsIm9uUHVzaEJyYW5jaCIsInJlbmRlciIsImVudmlyb25tZW50IiwiUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIiwiZ2V0RW52aXJvbm1lbnRGb3JIb3N0IiwicXVlcnkiLCJ2YXJpYWJsZXMiLCJvd25lciIsImdldE93bmVyIiwibmFtZSIsImdldFJlcG8iLCJyZW5kZXJXaXRoUmVzdWx0IiwiRW5kcG9pbnRQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJUb2tlblByb3BUeXBlIiwiUmVmcmVzaGVyUHJvcFR5cGUiLCJQcm9wVHlwZXMiLCJib29sIiwic3RyaW5nIiwib2JqZWN0IiwiUmVtb3RlUHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsIkJyYW5jaFNldFByb3BUeXBlIiwibnVtYmVyIiwiZnVuYyJdLCJzb3VyY2VzIjpbInJlbW90ZS1jb250YWluZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IHtcbiAgUmVtb3RlUHJvcFR5cGUsIFJlbW90ZVNldFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZSwgUmVmcmVzaGVyUHJvcFR5cGUsXG4gIEVuZHBvaW50UHJvcFR5cGUsIFRva2VuUHJvcFR5cGUsXG59IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IFJlbW90ZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcmVtb3RlLWNvbnRyb2xsZXInO1xuaW1wb3J0IExvYWRpbmdWaWV3IGZyb20gJy4uL3ZpZXdzL2xvYWRpbmctdmlldyc7XG5pbXBvcnQgUXVlcnlFcnJvclZpZXcgZnJvbSAnLi4vdmlld3MvcXVlcnktZXJyb3Itdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZUNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQ29ubmVjdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFRva2VuUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFJlcG9zaXRvcnkgYXR0cmlidXRlc1xuICAgIHJlZnJlc2hlcjogUmVmcmVzaGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBwdXNoSW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB3b3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlbW90ZTogUmVtb3RlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZW1vdGVzOiBSZW1vdGVTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGJyYW5jaGVzOiBCcmFuY2hTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGFoZWFkQ291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIGhhbmRsZUxvZ2luOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZUxvZ291dDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvblB1c2hCcmFuY2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KHRoaXMucHJvcHMuZW5kcG9pbnQsIHRoaXMucHJvcHMudG9rZW4pO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZ3JhcGhxbGBcbiAgICAgIHF1ZXJ5IHJlbW90ZUNvbnRhaW5lclF1ZXJ5KCRvd25lcjogU3RyaW5nISwgJG5hbWU6IFN0cmluZyEpIHtcbiAgICAgICAgcmVwb3NpdG9yeShvd25lcjogJG93bmVyLCBuYW1lOiAkbmFtZSkge1xuICAgICAgICAgIGlkXG4gICAgICAgICAgZGVmYXVsdEJyYW5jaFJlZiB7XG4gICAgICAgICAgICBwcmVmaXhcbiAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgO1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICAgIG93bmVyOiB0aGlzLnByb3BzLnJlbW90ZS5nZXRPd25lcigpLFxuICAgICAgbmFtZTogdGhpcy5wcm9wcy5yZW1vdGUuZ2V0UmVwbygpLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgZW52aXJvbm1lbnQ9e2Vudmlyb25tZW50fVxuICAgICAgICB2YXJpYWJsZXM9e3ZhcmlhYmxlc31cbiAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICByZW5kZXI9e3RoaXMucmVuZGVyV2l0aFJlc3VsdH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhSZXN1bHQgPSAoe2Vycm9yLCBwcm9wcywgcmV0cnl9KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5yZWZyZXNoZXIuc2V0UmV0cnlDYWxsYmFjayh0aGlzLCByZXRyeSk7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxRdWVyeUVycm9yVmlld1xuICAgICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgICBsb2dpbj17dGhpcy5wcm9wcy5oYW5kbGVMb2dpbn1cbiAgICAgICAgICBsb2dvdXQ9e3RoaXMucHJvcHMuaGFuZGxlTG9nb3V0fVxuICAgICAgICAgIHJldHJ5PXtyZXRyeX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmdWaWV3IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8UmVtb3RlQ29udHJvbGxlclxuICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgdG9rZW49e3RoaXMucHJvcHMudG9rZW59XG5cbiAgICAgICAgcmVwb3NpdG9yeT17cHJvcHMucmVwb3NpdG9yeX1cblxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIHJlbW90ZT17dGhpcy5wcm9wcy5yZW1vdGV9XG4gICAgICAgIHJlbW90ZXM9e3RoaXMucHJvcHMucmVtb3Rlc31cbiAgICAgICAgYnJhbmNoZXM9e3RoaXMucHJvcHMuYnJhbmNoZXN9XG5cbiAgICAgICAgYWhlYWRDb3VudD17dGhpcy5wcm9wcy5haGVhZENvdW50fVxuICAgICAgICBwdXNoSW5Qcm9ncmVzcz17dGhpcy5wcm9wcy5wdXNoSW5Qcm9ncmVzc31cblxuICAgICAgICBvblB1c2hCcmFuY2g9e3RoaXMucHJvcHMub25QdXNoQnJhbmNofVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtB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