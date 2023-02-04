"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRelay = require("react-relay");
var _eventKit = require("event-kit");
var _helpers = require("../helpers");
var _propTypes2 = require("../prop-types");
var _issueishListController = _interopRequireWildcard(require("../controllers/issueish-list-controller"));
var _createPullRequestTile = _interopRequireDefault(require("../views/create-pull-request-tile"));
var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));
var _graphql;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CurrentPullRequestContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'renderQueryResult', 'renderEmptyTile');
    this.sub = new _eventKit.Disposable();
  }
  render() {
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, this.props.token);
    const head = this.props.branches.getHeadBranch();
    if (!head.isPresent()) {
      return this.renderEmptyResult();
    }
    const push = head.getPush();
    if (!push.isPresent() || !push.isRemoteTracking()) {
      return this.renderEmptyResult();
    }
    const pushRemote = this.props.remotes.withName(push.getRemoteName());
    if (!pushRemote.isPresent() || !pushRemote.isGithubRepo()) {
      return this.renderEmptyResult();
    }
    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/currentPullRequestContainerQuery.graphql");
      if (node.hash && node.hash !== "b571ac1d752d4d13bc8e9bdffedb0a5e") {
        console.error("The definition of 'currentPullRequestContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }
      return require("./__generated__/currentPullRequestContainerQuery.graphql");
    });
    const variables = {
      headOwner: pushRemote.getOwner(),
      headName: pushRemote.getRepo(),
      headRef: push.getRemoteRef(),
      first: this.props.limit,
      checkSuiteCount: _helpers.CHECK_SUITE_PAGE_SIZE,
      checkSuiteCursor: null,
      checkRunCount: _helpers.CHECK_RUN_PAGE_SIZE,
      checkRunCursor: null
    };
    return _react.default.createElement(_reactRelay.QueryRenderer, {
      environment: environment,
      variables: variables,
      query: query,
      render: this.renderQueryResult
    });
  }
  renderEmptyResult() {
    return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
      isLoading: false
    }, this.controllerProps()));
  }
  renderQueryResult({
    error,
    props
  }) {
    if (error) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: false,
        error: error
      }, this.controllerProps()));
    }
    if (props === null) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: true
      }, this.controllerProps()));
    }
    if (!props.repository || !props.repository.ref) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: false
      }, this.controllerProps()));
    }
    const associatedPullRequests = props.repository.ref.associatedPullRequests;
    return _react.default.createElement(_issueishListController.default, _extends({
      total: associatedPullRequests.totalCount,
      results: associatedPullRequests.nodes,
      isLoading: false,
      endpoint: this.props.endpoint,
      resultFilter: issueish => issueish.getHeadRepositoryID() === this.props.repository.id
    }, this.controllerProps()));
  }
  renderEmptyTile() {
    return _react.default.createElement(_createPullRequestTile.default, {
      repository: this.props.repository,
      remote: this.props.remote,
      branches: this.props.branches,
      aheadCount: this.props.aheadCount,
      pushInProgress: this.props.pushInProgress,
      onCreatePr: this.props.onCreatePr
    });
  }
  componentWillUnmount() {
    this.sub.dispose();
  }
  controllerProps() {
    return {
      title: 'Checked out pull request',
      onOpenIssueish: this.props.onOpenIssueish,
      onOpenReviews: this.props.onOpenReviews,
      emptyComponent: this.renderEmptyTile,
      needReviewsButton: true
    };
  }
}
exports.default = CurrentPullRequestContainer;
_defineProperty(CurrentPullRequestContainer, "propTypes", {
  // Relay payload
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    defaultBranchRef: _propTypes.default.shape({
      prefix: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired
    })
  }).isRequired,
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes.default.string.isRequired,
  // Search constraints
  limit: _propTypes.default.number,
  // Repository model attributes
  remote: _propTypes2.RemotePropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Actions
  onOpenIssueish: _propTypes.default.func.isRequired,
  onOpenReviews: _propTypes.default.func.isRequired,
  onCreatePr: _propTypes.default.func.isRequired
});
_defineProperty(CurrentPullRequestContainer, "defaultProps", {
  limit: 5
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDdXJyZW50UHVsbFJlcXVlc3RDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJhdXRvYmluZCIsInN1YiIsIkRpc3Bvc2FibGUiLCJyZW5kZXIiLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsImVuZHBvaW50IiwidG9rZW4iLCJoZWFkIiwiYnJhbmNoZXMiLCJnZXRIZWFkQnJhbmNoIiwiaXNQcmVzZW50IiwicmVuZGVyRW1wdHlSZXN1bHQiLCJwdXNoIiwiZ2V0UHVzaCIsImlzUmVtb3RlVHJhY2tpbmciLCJwdXNoUmVtb3RlIiwicmVtb3RlcyIsIndpdGhOYW1lIiwiZ2V0UmVtb3RlTmFtZSIsImlzR2l0aHViUmVwbyIsInF1ZXJ5IiwidmFyaWFibGVzIiwiaGVhZE93bmVyIiwiZ2V0T3duZXIiLCJoZWFkTmFtZSIsImdldFJlcG8iLCJoZWFkUmVmIiwiZ2V0UmVtb3RlUmVmIiwiZmlyc3QiLCJsaW1pdCIsImNoZWNrU3VpdGVDb3VudCIsIkNIRUNLX1NVSVRFX1BBR0VfU0laRSIsImNoZWNrU3VpdGVDdXJzb3IiLCJjaGVja1J1bkNvdW50IiwiQ0hFQ0tfUlVOX1BBR0VfU0laRSIsImNoZWNrUnVuQ3Vyc29yIiwicmVuZGVyUXVlcnlSZXN1bHQiLCJjb250cm9sbGVyUHJvcHMiLCJlcnJvciIsInJlcG9zaXRvcnkiLCJyZWYiLCJhc3NvY2lhdGVkUHVsbFJlcXVlc3RzIiwidG90YWxDb3VudCIsIm5vZGVzIiwiaXNzdWVpc2giLCJnZXRIZWFkUmVwb3NpdG9yeUlEIiwiaWQiLCJyZW5kZXJFbXB0eVRpbGUiLCJyZW1vdGUiLCJhaGVhZENvdW50IiwicHVzaEluUHJvZ3Jlc3MiLCJvbkNyZWF0ZVByIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwidGl0bGUiLCJvbk9wZW5Jc3N1ZWlzaCIsIm9uT3BlblJldmlld3MiLCJlbXB0eUNvbXBvbmVudCIsIm5lZWRSZXZpZXdzQnV0dG9uIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiZGVmYXVsdEJyYW5jaFJlZiIsInByZWZpeCIsIm5hbWUiLCJFbmRwb2ludFByb3BUeXBlIiwibnVtYmVyIiwiUmVtb3RlUHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsIkJyYW5jaFNldFByb3BUeXBlIiwiYm9vbCIsImZ1bmMiXSwic291cmNlcyI6WyJjdXJyZW50LXB1bGwtcmVxdWVzdC1jb250YWluZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHthdXRvYmluZCwgQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFLCBDSEVDS19SVU5fUEFHRV9TSVpFfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7UmVtb3RlUHJvcFR5cGUsIFJlbW90ZVNldFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgSXNzdWVpc2hMaXN0Q29udHJvbGxlciwge0JhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyfSBmcm9tICcuLi9jb250cm9sbGVycy9pc3N1ZWlzaC1saXN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IENyZWF0ZVB1bGxSZXF1ZXN0VGlsZSBmcm9tICcuLi92aWV3cy9jcmVhdGUtcHVsbC1yZXF1ZXN0LXRpbGUnO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50UHVsbFJlcXVlc3RDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHBheWxvYWRcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRlZmF1bHRCcmFuY2hSZWY6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHByZWZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29ubmVjdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIFNlYXJjaCBjb25zdHJhaW50c1xuICAgIGxpbWl0OiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLy8gUmVwb3NpdG9yeSBtb2RlbCBhdHRyaWJ1dGVzXG4gICAgcmVtb3RlOiBSZW1vdGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYWhlYWRDb3VudDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBwdXNoSW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbnNcbiAgICBvbk9wZW5Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbk9wZW5SZXZpZXdzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uQ3JlYXRlUHI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGxpbWl0OiA1LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3JlbmRlclF1ZXJ5UmVzdWx0JywgJ3JlbmRlckVtcHR5VGlsZScpO1xuXG4gICAgdGhpcy5zdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdCh0aGlzLnByb3BzLmVuZHBvaW50LCB0aGlzLnByb3BzLnRva2VuKTtcblxuICAgIGNvbnN0IGhlYWQgPSB0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICBpZiAoIWhlYWQuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckVtcHR5UmVzdWx0KCk7XG4gICAgfVxuICAgIGNvbnN0IHB1c2ggPSBoZWFkLmdldFB1c2goKTtcbiAgICBpZiAoIXB1c2guaXNQcmVzZW50KCkgfHwgIXB1c2guaXNSZW1vdGVUcmFja2luZygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJFbXB0eVJlc3VsdCgpO1xuICAgIH1cbiAgICBjb25zdCBwdXNoUmVtb3RlID0gdGhpcy5wcm9wcy5yZW1vdGVzLndpdGhOYW1lKHB1c2guZ2V0UmVtb3RlTmFtZSgpKTtcbiAgICBpZiAoIXB1c2hSZW1vdGUuaXNQcmVzZW50KCkgfHwgIXB1c2hSZW1vdGUuaXNHaXRodWJSZXBvKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckVtcHR5UmVzdWx0KCk7XG4gICAgfVxuXG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgY3VycmVudFB1bGxSZXF1ZXN0Q29udGFpbmVyUXVlcnkoXG4gICAgICAgICRoZWFkT3duZXI6IFN0cmluZyFcbiAgICAgICAgJGhlYWROYW1lOiBTdHJpbmchXG4gICAgICAgICRoZWFkUmVmOiBTdHJpbmchXG4gICAgICAgICRmaXJzdDogSW50IVxuICAgICAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgICAgICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICAgICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgICAgICkge1xuICAgICAgICByZXBvc2l0b3J5KG93bmVyOiAkaGVhZE93bmVyLCBuYW1lOiAkaGVhZE5hbWUpIHtcbiAgICAgICAgICByZWYocXVhbGlmaWVkTmFtZTogJGhlYWRSZWYpIHtcbiAgICAgICAgICAgIGFzc29jaWF0ZWRQdWxsUmVxdWVzdHMoZmlyc3Q6ICRmaXJzdCwgc3RhdGVzOiBbT1BFTl0pIHtcbiAgICAgICAgICAgICAgdG90YWxDb3VudFxuICAgICAgICAgICAgICBub2RlcyB7XG4gICAgICAgICAgICAgICAgLi4uaXNzdWVpc2hMaXN0Q29udHJvbGxlcl9yZXN1bHRzIEBhcmd1bWVudHMoXG4gICAgICAgICAgICAgICAgICBjaGVja1N1aXRlQ291bnQ6ICRjaGVja1N1aXRlQ291bnRcbiAgICAgICAgICAgICAgICAgIGNoZWNrU3VpdGVDdXJzb3I6ICRjaGVja1N1aXRlQ3Vyc29yXG4gICAgICAgICAgICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICAgICAgICAgICAgY2hlY2tSdW5DdXJzb3I6ICRjaGVja1J1bkN1cnNvclxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgaGVhZE93bmVyOiBwdXNoUmVtb3RlLmdldE93bmVyKCksXG4gICAgICBoZWFkTmFtZTogcHVzaFJlbW90ZS5nZXRSZXBvKCksXG4gICAgICBoZWFkUmVmOiBwdXNoLmdldFJlbW90ZVJlZigpLFxuICAgICAgZmlyc3Q6IHRoaXMucHJvcHMubGltaXQsXG4gICAgICBjaGVja1N1aXRlQ291bnQ6IENIRUNLX1NVSVRFX1BBR0VfU0laRSxcbiAgICAgIGNoZWNrU3VpdGVDdXJzb3I6IG51bGwsXG4gICAgICBjaGVja1J1bkNvdW50OiBDSEVDS19SVU5fUEFHRV9TSVpFLFxuICAgICAgY2hlY2tSdW5DdXJzb3I6IG51bGwsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgIHZhcmlhYmxlcz17dmFyaWFibGVzfVxuICAgICAgICBxdWVyeT17cXVlcnl9XG4gICAgICAgIHJlbmRlcj17dGhpcy5yZW5kZXJRdWVyeVJlc3VsdH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckVtcHR5UmVzdWx0KCkge1xuICAgIHJldHVybiA8QmFyZUlzc3VlaXNoTGlzdENvbnRyb2xsZXIgaXNMb2FkaW5nPXtmYWxzZX0gey4uLnRoaXMuY29udHJvbGxlclByb3BzKCl9IC8+O1xuICB9XG5cbiAgcmVuZGVyUXVlcnlSZXN1bHQoe2Vycm9yLCBwcm9wc30pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlclxuICAgICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlclxuICAgICAgICAgIGlzTG9hZGluZz17dHJ1ZX1cbiAgICAgICAgICB7Li4udGhpcy5jb250cm9sbGVyUHJvcHMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcy5yZXBvc2l0b3J5IHx8ICFwcm9wcy5yZXBvc2l0b3J5LnJlZikge1xuICAgICAgcmV0dXJuIDxCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlciBpc0xvYWRpbmc9e2ZhbHNlfSB7Li4udGhpcy5jb250cm9sbGVyUHJvcHMoKX0gLz47XG4gICAgfVxuXG4gICAgY29uc3QgYXNzb2NpYXRlZFB1bGxSZXF1ZXN0cyA9IHByb3BzLnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPElzc3VlaXNoTGlzdENvbnRyb2xsZXJcbiAgICAgICAgdG90YWw9e2Fzc29jaWF0ZWRQdWxsUmVxdWVzdHMudG90YWxDb3VudH1cbiAgICAgICAgcmVzdWx0cz17YXNzb2NpYXRlZFB1bGxSZXF1ZXN0cy5ub2Rlc31cbiAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgIHJlc3VsdEZpbHRlcj17aXNzdWVpc2ggPT4gaXNzdWVpc2guZ2V0SGVhZFJlcG9zaXRvcnlJRCgpID09PSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuaWR9XG4gICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRW1wdHlUaWxlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q3JlYXRlUHVsbFJlcXVlc3RUaWxlXG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgcmVtb3RlPXt0aGlzLnByb3BzLnJlbW90ZX1cbiAgICAgICAgYnJhbmNoZXM9e3RoaXMucHJvcHMuYnJhbmNoZXN9XG4gICAgICAgIGFoZWFkQ291bnQ9e3RoaXMucHJvcHMuYWhlYWRDb3VudH1cbiAgICAgICAgcHVzaEluUHJvZ3Jlc3M9e3RoaXMucHJvcHMucHVzaEluUHJvZ3Jlc3N9XG4gICAgICAgIG9uQ3JlYXRlUHI9e3RoaXMucHJvcHMub25DcmVhdGVQcn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGNvbnRyb2xsZXJQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICdDaGVja2VkIG91dCBwdWxsIHJlcXVlc3QnLFxuICAgICAgb25PcGVuSXNzdWVpc2g6IHRoaXMucHJvcHMub25PcGVuSXNzdWVpc2gsXG4gICAgICBvbk9wZW5SZXZpZXdzOiB0aGlzLnByb3BzLm9uT3BlblJldmlld3MsXG4gICAgICBlbXB0eUNvbXBvbmVudDogdGhpcy5yZW5kZXJFbXB0eVRpbGUsXG4gICAgICBuZWVkUmV2aWV3c0J1dHRvbjogdHJ1ZSxcbiAgICB9O1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFzRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXZELE1BQU1BLDJCQUEyQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQW1DdkVDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQ1osSUFBQUMsaUJBQVEsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUM7SUFFdEQsSUFBSSxDQUFDQyxHQUFHLEdBQUcsSUFBSUMsb0JBQVUsRUFBRTtFQUM3QjtFQUVBQyxNQUFNLEdBQUc7SUFDUCxNQUFNQyxXQUFXLEdBQUdDLGlDQUF3QixDQUFDQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUNQLEtBQUssQ0FBQ1EsUUFBUSxFQUFFLElBQUksQ0FBQ1IsS0FBSyxDQUFDUyxLQUFLLENBQUM7SUFF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