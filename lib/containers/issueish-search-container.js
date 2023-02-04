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
var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));
var _graphql;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class IssueishSearchContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'renderQueryResult');
    this.sub = new _eventKit.Disposable();
  }
  render() {
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, this.props.token);
    if (this.props.search.isNull()) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: false
      }, this.controllerProps()));
    }
    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/issueishSearchContainerQuery.graphql");
      if (node.hash && node.hash !== "9b0a99c35f017d4c3013e5908990a61c") {
        console.error("The definition of 'issueishSearchContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }
      return require("./__generated__/issueishSearchContainerQuery.graphql");
    });
    const variables = {
      query: this.props.search.createQuery(),
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
    return _react.default.createElement(_issueishListController.default, _extends({
      total: props.search.issueCount,
      results: props.search.nodes,
      isLoading: false
    }, this.controllerProps()));
  }
  componentWillUnmount() {
    this.sub.dispose();
  }
  controllerProps() {
    return {
      title: this.props.search.getName(),
      onOpenIssueish: this.props.onOpenIssueish,
      onOpenReviews: this.props.onOpenReviews,
      onOpenMore: () => this.props.onOpenSearch(this.props.search)
    };
  }
}
exports.default = IssueishSearchContainer;
_defineProperty(IssueishSearchContainer, "propTypes", {
  // Connection information
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes.default.string.isRequired,
  // Search model
  limit: _propTypes.default.number,
  search: _propTypes2.SearchPropType.isRequired,
  // Action methods
  onOpenIssueish: _propTypes.default.func.isRequired,
  onOpenSearch: _propTypes.default.func.isRequired,
  onOpenReviews: _propTypes.default.func.isRequired
});
_defineProperty(IssueishSearchContainer, "defaultProps", {
  limit: 20
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJc3N1ZWlzaFNlYXJjaENvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwic3ViIiwiRGlzcG9zYWJsZSIsInJlbmRlciIsImVudmlyb25tZW50IiwiUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIiwiZ2V0RW52aXJvbm1lbnRGb3JIb3N0IiwiZW5kcG9pbnQiLCJ0b2tlbiIsInNlYXJjaCIsImlzTnVsbCIsImNvbnRyb2xsZXJQcm9wcyIsInF1ZXJ5IiwidmFyaWFibGVzIiwiY3JlYXRlUXVlcnkiLCJmaXJzdCIsImxpbWl0IiwiY2hlY2tTdWl0ZUNvdW50IiwiQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFIiwiY2hlY2tTdWl0ZUN1cnNvciIsImNoZWNrUnVuQ291bnQiLCJDSEVDS19SVU5fUEFHRV9TSVpFIiwiY2hlY2tSdW5DdXJzb3IiLCJyZW5kZXJRdWVyeVJlc3VsdCIsImVycm9yIiwiaXNzdWVDb3VudCIsIm5vZGVzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwidGl0bGUiLCJnZXROYW1lIiwib25PcGVuSXNzdWVpc2giLCJvbk9wZW5SZXZpZXdzIiwib25PcGVuTW9yZSIsIm9uT3BlblNlYXJjaCIsIkVuZHBvaW50UHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwibnVtYmVyIiwiU2VhcmNoUHJvcFR5cGUiLCJmdW5jIl0sInNvdXJjZXMiOlsiaXNzdWVpc2gtc2VhcmNoLWNvbnRhaW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBDSEVDS19TVUlURV9QQUdFX1NJWkUsIENIRUNLX1JVTl9QQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtTZWFyY2hQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgSXNzdWVpc2hMaXN0Q29udHJvbGxlciwge0JhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyfSBmcm9tICcuLi9jb250cm9sbGVycy9pc3N1ZWlzaC1saXN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaFNlYXJjaENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQ29ubmVjdGlvbiBpbmZvcm1hdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIFNlYXJjaCBtb2RlbFxuICAgIGxpbWl0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHNlYXJjaDogU2VhcmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgb25PcGVuSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25PcGVuU2VhcmNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uT3BlblJldmlld3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGxpbWl0OiAyMCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJRdWVyeVJlc3VsdCcpO1xuXG4gICAgdGhpcy5zdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdCh0aGlzLnByb3BzLmVuZHBvaW50LCB0aGlzLnByb3BzLnRva2VuKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnNlYXJjaC5pc051bGwoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICB7Li4udGhpcy5jb250cm9sbGVyUHJvcHMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgaXNzdWVpc2hTZWFyY2hDb250YWluZXJRdWVyeShcbiAgICAgICAgJHF1ZXJ5OiBTdHJpbmchXG4gICAgICAgICRmaXJzdDogSW50IVxuICAgICAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgICAgICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICAgICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgICAgICkge1xuICAgICAgICBzZWFyY2goZmlyc3Q6ICRmaXJzdCwgcXVlcnk6ICRxdWVyeSwgdHlwZTogSVNTVUUpIHtcbiAgICAgICAgICBpc3N1ZUNvdW50XG4gICAgICAgICAgbm9kZXMge1xuICAgICAgICAgICAgLi4uaXNzdWVpc2hMaXN0Q29udHJvbGxlcl9yZXN1bHRzIEBhcmd1bWVudHMoXG4gICAgICAgICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgICBxdWVyeTogdGhpcy5wcm9wcy5zZWFyY2guY3JlYXRlUXVlcnkoKSxcbiAgICAgIGZpcnN0OiB0aGlzLnByb3BzLmxpbWl0LFxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiBDSEVDS19TVUlURV9QQUdFX1NJWkUsXG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiBudWxsLFxuICAgICAgY2hlY2tSdW5Db3VudDogQ0hFQ0tfUlVOX1BBR0VfU0laRSxcbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiBudWxsLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgZW52aXJvbm1lbnQ9e2Vudmlyb25tZW50fVxuICAgICAgICB2YXJpYWJsZXM9e3ZhcmlhYmxlc31cbiAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICByZW5kZXI9e3RoaXMucmVuZGVyUXVlcnlSZXN1bHR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJRdWVyeVJlc3VsdCh7ZXJyb3IsIHByb3BzfSkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgey4uLnRoaXMuY29udHJvbGxlclByb3BzKCl9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChwcm9wcyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgICAgaXNMb2FkaW5nPXt0cnVlfVxuICAgICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPElzc3VlaXNoTGlzdENvbnRyb2xsZXJcbiAgICAgICAgdG90YWw9e3Byb3BzLnNlYXJjaC5pc3N1ZUNvdW50fVxuICAgICAgICByZXN1bHRzPXtwcm9wcy5zZWFyY2gubm9kZXN9XG4gICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgY29udHJvbGxlclByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy5zZWFyY2guZ2V0TmFtZSgpLFxuXG4gICAgICBvbk9wZW5Jc3N1ZWlzaDogdGhpcy5wcm9wcy5vbk9wZW5Jc3N1ZWlzaCxcbiAgICAgIG9uT3BlblJldmlld3M6IHRoaXMucHJvcHMub25PcGVuUmV2aWV3cyxcbiAgICAgIG9uT3Blbk1vcmU6ICgpID0+IHRoaXMucHJvcHMub25PcGVuU2VhcmNoKHRoaXMucHJvcHMuc2VhcmNoKSxcbiAgICB9O1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBc0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV2RCxNQUFNQSx1QkFBdUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFvQm5FQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUFDLGlCQUFRLEVBQUMsSUFBSSxFQUFFLG1C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