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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IssueishSearchContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'renderQueryResult');
    this.sub = new _eventKit.Disposable();
  }

  render() {
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, this.props.token);

    if (this.props.search.isNull()) {
      return /*#__PURE__*/_react.default.createElement(_issueishListController.BareIssueishListController, _extends({
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
    return /*#__PURE__*/_react.default.createElement(_reactRelay.QueryRenderer, {
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
      return /*#__PURE__*/_react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: false,
        error: error
      }, this.controllerProps()));
    }

    if (props === null) {
      return /*#__PURE__*/_react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: true
      }, this.controllerProps()));
    }

    return /*#__PURE__*/_react.default.createElement(_issueishListController.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2lzc3VlaXNoLXNlYXJjaC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiSXNzdWVpc2hTZWFyY2hDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzdWIiLCJEaXNwb3NhYmxlIiwicmVuZGVyIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJlbmRwb2ludCIsInRva2VuIiwic2VhcmNoIiwiaXNOdWxsIiwiY29udHJvbGxlclByb3BzIiwicXVlcnkiLCJ2YXJpYWJsZXMiLCJjcmVhdGVRdWVyeSIsImZpcnN0IiwibGltaXQiLCJjaGVja1N1aXRlQ291bnQiLCJDSEVDS19TVUlURV9QQUdFX1NJWkUiLCJjaGVja1N1aXRlQ3Vyc29yIiwiY2hlY2tSdW5Db3VudCIsIkNIRUNLX1JVTl9QQUdFX1NJWkUiLCJjaGVja1J1bkN1cnNvciIsInJlbmRlclF1ZXJ5UmVzdWx0IiwiZXJyb3IiLCJpc3N1ZUNvdW50Iiwibm9kZXMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJ0aXRsZSIsImdldE5hbWUiLCJvbk9wZW5Jc3N1ZWlzaCIsIm9uT3BlblJldmlld3MiLCJvbk9wZW5Nb3JlIiwib25PcGVuU2VhcmNoIiwiRW5kcG9pbnRQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJudW1iZXIiLCJTZWFyY2hQcm9wVHlwZSIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSx1QkFBTixTQUFzQ0MsZUFBTUMsU0FBNUMsQ0FBc0Q7QUFvQm5FQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsMkJBQVMs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QUFFK0IsMkJBQWVKLFVBUE47QUFTakI7QUFDQUwsRUFBQUEsY0FBYyxFQUFFTSxtQkFBVUksSUFBVixDQUFlTCxVQVZkO0FBV2pCRixFQUFBQSxZQUFZLEVBQUVHLG1CQUFVSSxJQUFWLENBQWVMLFVBWFo7QUFZakJKLEVBQUFBLGFBQWEsRUFBRUssbUJBQVVJLElBQVYsQ0FBZUw7QUFaYixDOztnQkFEQXhDLHVCLGtCQWdCRztBQUNwQm9CLEVBQUFBLEtBQUssRUFBRTtBQURhLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBDSEVDS19TVUlURV9QQUdFX1NJWkUsIENIRUNLX1JVTl9QQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtTZWFyY2hQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgSXNzdWVpc2hMaXN0Q29udHJvbGxlciwge0JhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyfSBmcm9tICcuLi9jb250cm9sbGVycy9pc3N1ZWlzaC1saXN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaFNlYXJjaENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQ29ubmVjdGlvbiBpbmZvcm1hdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIFNlYXJjaCBtb2RlbFxuICAgIGxpbWl0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHNlYXJjaDogU2VhcmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgb25PcGVuSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25PcGVuU2VhcmNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uT3BlblJldmlld3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGxpbWl0OiAyMCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJRdWVyeVJlc3VsdCcpO1xuXG4gICAgdGhpcy5zdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdCh0aGlzLnByb3BzLmVuZHBvaW50LCB0aGlzLnByb3BzLnRva2VuKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnNlYXJjaC5pc051bGwoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICB7Li4udGhpcy5jb250cm9sbGVyUHJvcHMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgaXNzdWVpc2hTZWFyY2hDb250YWluZXJRdWVyeShcbiAgICAgICAgJHF1ZXJ5OiBTdHJpbmchXG4gICAgICAgICRmaXJzdDogSW50IVxuICAgICAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgICAgICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICAgICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgICAgICkge1xuICAgICAgICBzZWFyY2goZmlyc3Q6ICRmaXJzdCwgcXVlcnk6ICRxdWVyeSwgdHlwZTogSVNTVUUpIHtcbiAgICAgICAgICBpc3N1ZUNvdW50XG4gICAgICAgICAgbm9kZXMge1xuICAgICAgICAgICAgLi4uaXNzdWVpc2hMaXN0Q29udHJvbGxlcl9yZXN1bHRzIEBhcmd1bWVudHMoXG4gICAgICAgICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgICBxdWVyeTogdGhpcy5wcm9wcy5zZWFyY2guY3JlYXRlUXVlcnkoKSxcbiAgICAgIGZpcnN0OiB0aGlzLnByb3BzLmxpbWl0LFxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiBDSEVDS19TVUlURV9QQUdFX1NJWkUsXG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiBudWxsLFxuICAgICAgY2hlY2tSdW5Db3VudDogQ0hFQ0tfUlVOX1BBR0VfU0laRSxcbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiBudWxsLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgZW52aXJvbm1lbnQ9e2Vudmlyb25tZW50fVxuICAgICAgICB2YXJpYWJsZXM9e3ZhcmlhYmxlc31cbiAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICByZW5kZXI9e3RoaXMucmVuZGVyUXVlcnlSZXN1bHR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJRdWVyeVJlc3VsdCh7ZXJyb3IsIHByb3BzfSkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgey4uLnRoaXMuY29udHJvbGxlclByb3BzKCl9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChwcm9wcyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEJhcmVJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgICAgaXNMb2FkaW5nPXt0cnVlfVxuICAgICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPElzc3VlaXNoTGlzdENvbnRyb2xsZXJcbiAgICAgICAgdG90YWw9e3Byb3BzLnNlYXJjaC5pc3N1ZUNvdW50fVxuICAgICAgICByZXN1bHRzPXtwcm9wcy5zZWFyY2gubm9kZXN9XG4gICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgY29udHJvbGxlclByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy5zZWFyY2guZ2V0TmFtZSgpLFxuXG4gICAgICBvbk9wZW5Jc3N1ZWlzaDogdGhpcy5wcm9wcy5vbk9wZW5Jc3N1ZWlzaCxcbiAgICAgIG9uT3BlblJldmlld3M6IHRoaXMucHJvcHMub25PcGVuUmV2aWV3cyxcbiAgICAgIG9uT3Blbk1vcmU6ICgpID0+IHRoaXMucHJvcHMub25PcGVuU2VhcmNoKHRoaXMucHJvcHMuc2VhcmNoKSxcbiAgICB9O1xuICB9XG59XG4iXX0=