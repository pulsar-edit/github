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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
        return /*#__PURE__*/_react.default.createElement(_queryErrorView.default, {
          error: error,
          login: this.props.handleLogin,
          logout: this.props.handleLogout,
          retry: retry
        });
      }

      if (props === null) {
        return /*#__PURE__*/_react.default.createElement(_loadingView.default, null);
      }

      return /*#__PURE__*/_react.default.createElement(_remoteController.default, {
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
    return /*#__PURE__*/_react.default.createElement(_reactRelay.QueryRenderer, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL3JlbW90ZS1jb250YWluZXIuanMiXSwibmFtZXMiOlsiUmVtb3RlQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJlcnJvciIsInByb3BzIiwicmV0cnkiLCJyZWZyZXNoZXIiLCJzZXRSZXRyeUNhbGxiYWNrIiwiaGFuZGxlTG9naW4iLCJoYW5kbGVMb2dvdXQiLCJlbmRwb2ludCIsInRva2VuIiwicmVwb3NpdG9yeSIsIndvcmtpbmdEaXJlY3RvcnkiLCJ3b3Jrc3BhY2UiLCJyZW1vdGUiLCJyZW1vdGVzIiwiYnJhbmNoZXMiLCJhaGVhZENvdW50IiwicHVzaEluUHJvZ3Jlc3MiLCJvblB1c2hCcmFuY2giLCJyZW5kZXIiLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsInF1ZXJ5IiwidmFyaWFibGVzIiwib3duZXIiLCJnZXRPd25lciIsIm5hbWUiLCJnZXRSZXBvIiwicmVuZGVyV2l0aFJlc3VsdCIsIkVuZHBvaW50UHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiVG9rZW5Qcm9wVHlwZSIsIlJlZnJlc2hlclByb3BUeXBlIiwiUHJvcFR5cGVzIiwiYm9vbCIsInN0cmluZyIsIm9iamVjdCIsIlJlbW90ZVByb3BUeXBlIiwiUmVtb3RlU2V0UHJvcFR5cGUiLCJCcmFuY2hTZXRQcm9wVHlwZSIsIm51bWJlciIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLFNBQThCQyxlQUFNQyxTQUFwQyxDQUE4QztBQUFBO0FBQUE7O0FBQUEsOENBa0R4QyxDQUFDO0FBQUNDLE1BQUFBLEtBQUQ7QUFBUUMsTUFBQUEsS0FBUjtBQUFlQyxNQUFBQTtBQUFmLEtBQUQsS0FBMkI7QUFDNUMsV0FBS0QsS0FBTCxDQUFXRSxTQUFYLENB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QixFQUFBQSxZQUFZLEVBQUUyQixtQkFBVVEsSUFBVixDQUFlWCxVQWpCWjtBQWtCakJiLEVBQUFBLFlBQVksRUFBRWdCLG1CQUFVUSxJQUFWLENBQWVYO0FBbEJaLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1xuICBSZW1vdGVQcm9wVHlwZSwgUmVtb3RlU2V0UHJvcFR5cGUsIEJyYW5jaFNldFByb3BUeXBlLCBSZWZyZXNoZXJQcm9wVHlwZSxcbiAgRW5kcG9pbnRQcm9wVHlwZSwgVG9rZW5Qcm9wVHlwZSxcbn0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQgUmVtb3RlQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9yZW1vdGUtY29udHJvbGxlcic7XG5pbXBvcnQgTG9hZGluZ1ZpZXcgZnJvbSAnLi4vdmlld3MvbG9hZGluZy12aWV3JztcbmltcG9ydCBRdWVyeUVycm9yVmlldyBmcm9tICcuLi92aWV3cy9xdWVyeS1lcnJvci12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RlQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBDb25uZWN0aW9uXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB0b2tlbjogVG9rZW5Qcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUmVwb3NpdG9yeSBhdHRyaWJ1dGVzXG4gICAgcmVmcmVzaGVyOiBSZWZyZXNoZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHB1c2hJblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVtb3RlOiBSZW1vdGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYWhlYWRDb3VudDogUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgaGFuZGxlTG9naW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlTG9nb3V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uUHVzaEJyYW5jaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QodGhpcy5wcm9wcy5lbmRwb2ludCwgdGhpcy5wcm9wcy50b2tlbik7XG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgcmVtb3RlQ29udGFpbmVyUXVlcnkoJG93bmVyOiBTdHJpbmchLCAkbmFtZTogU3RyaW5nISkge1xuICAgICAgICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgICAgICAgaWRcbiAgICAgICAgICBkZWZhdWx0QnJhbmNoUmVmIHtcbiAgICAgICAgICAgIHByZWZpeFxuICAgICAgICAgICAgbmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgb3duZXI6IHRoaXMucHJvcHMucmVtb3RlLmdldE93bmVyKCksXG4gICAgICBuYW1lOiB0aGlzLnByb3BzLnJlbW90ZS5nZXRSZXBvKCksXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgIHZhcmlhYmxlcz17dmFyaWFibGVzfVxuICAgICAgICBxdWVyeT17cXVlcnl9XG4gICAgICAgIHJlbmRlcj17dGhpcy5yZW5kZXJXaXRoUmVzdWx0fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFJlc3VsdCA9ICh7ZXJyb3IsIHByb3BzLCByZXRyeX0pID0+IHtcbiAgICB0aGlzLnByb3BzLnJlZnJlc2hlci5zZXRSZXRyeUNhbGxiYWNrKHRoaXMsIHJldHJ5KTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFF1ZXJ5RXJyb3JWaWV3XG4gICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgIGxvZ2luPXt0aGlzLnByb3BzLmhhbmRsZUxvZ2lufVxuICAgICAgICAgIGxvZ291dD17dGhpcy5wcm9wcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgICAgcmV0cnk9e3JldHJ5fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZ1ZpZXcgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxSZW1vdGVDb250cm9sbGVyXG4gICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICB0b2tlbj17dGhpcy5wcm9wcy50b2tlbn1cblxuICAgICAgICByZXBvc2l0b3J5PXtwcm9wcy5yZXBvc2l0b3J5fVxuXG4gICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgcmVtb3RlPXt0aGlzLnByb3BzLnJlbW90ZX1cbiAgICAgICAgcmVtb3Rlcz17dGhpcy5wcm9wcy5yZW1vdGVzfVxuICAgICAgICBicmFuY2hlcz17dGhpcy5wcm9wcy5icmFuY2hlc31cblxuICAgICAgICBhaGVhZENvdW50PXt0aGlzLnByb3BzLmFoZWFkQ291bnR9XG4gICAgICAgIHB1c2hJblByb2dyZXNzPXt0aGlzLnByb3BzLnB1c2hJblByb2dyZXNzfVxuXG4gICAgICAgIG9uUHVzaEJyYW5jaD17dGhpcy5wcm9wcy5vblB1c2hCcmFuY2h9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==