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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2lzc3VlaXNoLXNlYXJjaC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiSXNzdWVpc2hTZWFyY2hDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzdWIiLCJEaXNwb3NhYmxlIiwicmVuZGVyIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJlbmRwb2ludCIsInRva2VuIiwic2VhcmNoIiwiaXNOdWxsIiwiY29udHJvbGxlclByb3BzIiwicXVlcnkiLCJ2YXJpYWJsZXMiLCJjcmVhdGVRdWVyeSIsImZpcnN0IiwibGltaXQiLCJjaGVja1N1aXRlQ291bnQiLCJDSEVDS19TVUlURV9QQUdFX1NJWkUiLCJjaGVja1N1aXRlQ3Vyc29yIiwiY2hlY2tSdW5Db3VudCIsIkNIRUNLX1JVTl9QQUdFX1NJWkUiLCJjaGVja1J1bkN1cnNvciIsInJlbmRlclF1ZXJ5UmVzdWx0IiwiZXJyb3IiLCJpc3N1ZUNvdW50Iiwibm9kZXMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJ0aXRsZSIsImdldE5hbWUiLCJvbk9wZW5Jc3N1ZWlzaCIsIm9uT3BlblJldmlld3MiLCJvbk9wZW5Nb3JlIiwib25PcGVuU2VhcmNoIiwiRW5kcG9pbnRQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJudW1iZXIiLCJTZWFyY2hQcm9wVHlwZSIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSx1QkFBTixTQUFzQ0MsZUFBTUMsU0FBNUMsQ0FBc0Q7QUFvQm5FQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsMkJBQVMsSUFBVCxFQUFlLG1CQUFmO0FBRUEsU0FBS0MsR0FBTCxHQUFXLElBQUlDLG9CQUFKLEVBQVg7QUFDRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsV0FBVyxHQUFHQyxrQ0FBeUJDLHFCQUF6QixDQUErQyxLQUFLTixLQUFMLENBQVdPLFFBQTFELEVBQW9FLEtBQUtQLEtBQUwsQ0FBV1EsS0FBL0UsQ0FBcEI7O0FBRUEsUUFBSSxLQUFLUixLQUFMLENBQVdTLE1BQVgsQ0FBa0JDLE1BQWxCLEVBQUosRUFBZ0M7QUFDOUIsYUFDRSw2QkFBQyxrREFBRDtBQUNFLFFBQUEsU0FBUyxFQUFFO0FBRGIsU0FFTSxLQUFLQyxlQUFMLEVBRk4sRUFERjtBQU1EOztBQUVELFVBQU1DLEtBQUs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFYOztBQXNCQSxVQUFNQyxTQUFTLEdBQUc7QUFDaEJELE1BQUFBLEtBQUssRUFBRSxLQUFLWixLQUFMLENBQVdTLE1BQVgsQ0FBa0JLLFdBQWxCLEVBRFM7QUFFaEJDLE1BQUFBLEtBQUssRUFBRSxLQUFLZixLQUFMLENBQVdnQixLQUZGO0FBR2hCQyxNQUFBQSxlQUFlLEVBQUVDLDhCQUhEO0FBSWhCQyxNQUFBQSxnQkFBZ0IsRUFBRSxJQUpGO0FBS2hCQyxNQUFBQSxhQUFhLEVBQUVDLDRCQUxDO0FBTWhCQyxNQUFBQSxjQUFjLEVBQUU7QUFOQSxLQUFsQjtBQVNBLFdBQ0UsNkJBQUMseUJBQUQ7QUFDRSxNQUFBLFdBQVcsRUFBRWxCLFdBRGY7QUFFRSxNQUFBLFNBQVMsRUFBRVMsU0FGYjtBQUdFLE1BQUEsS0FBSyxFQUFFRCxLQUhUO0FBSUUsTUFBQSxNQUFNLEVBQUUsS0FBS1c7QUFKZixNQURGO0FBUUQ7O0FBRURBLEVBQUFBLGlCQUFpQixDQUFDO0FBQUNDLElBQUFBLEtBQUQ7QUFBUXhCLElBQUFBO0FBQVIsR0FBRCxFQUFpQjtBQUNoQyxRQUFJd0IsS0FBSixFQUFXO0FBQ1QsYUFDRSw2QkFBQyxrREFBRDtBQUNFLFFBQUEsU0FBUyxFQUFFLEtBRGI7QUFFRSxRQUFBLEtBQUssRUFBRUE7QUFGVCxTQUdNLEtBQUtiLGVBQUwsRUFITixFQURGO0FBT0Q7O0FBRUQsUUFBSVgsS0FBSyxLQUFLLElBQWQsRUFBb0I7QUFDbEIsYUFDRSw2QkFBQyxrREFBRDtBQUNFLFFBQUEsU0FBUyxFQUFFO0FBRGIsU0FFTSxLQUFLVyxlQUFMLEVBRk4sRUFERjtBQU1EOztBQUVELFdBQ0UsNkJBQUMsK0JBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRVgsS0FBSyxDQUFDUyxNQUFOLENBQWFnQixVQUR0QjtBQUVFLE1BQUEsT0FBTyxFQUFFekIsS0FBSyxDQUFDUyxNQUFOLENBQWFpQixLQUZ4QjtBQUdFLE1BQUEsU0FBUyxFQUFFO0FBSGIsT0FJTSxLQUFLZixlQUFMLEVBSk4sRUFERjtBQVFEOztBQUVEZ0IsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckIsU0FBSzFCLEdBQUwsQ0FBUzJCLE9BQVQ7QUFDRDs7QUFFRGpCLEVBQUFBLGVBQWUsR0FBRztBQUNoQixXQUFPO0FBQ0xrQixNQUFBQSxLQUFLLEVBQUUsS0FBSzdCLEtBQUwsQ0FBV1MsTUFBWCxDQUFrQnFCLE9BQWxCLEVBREY7QUFHTEMsTUFBQUEsY0FBYyxFQUFFLEtBQUsvQixLQUFMLENBQVcrQixjQUh0QjtBQUlMQyxNQUFBQSxhQUFhLEVBQUUsS0FBS2hDLEtBQUwsQ0FBV2dDLGFBSnJCO0FBS0xDLE1BQUFBLFVBQVUsRUFBRSxNQUFNLEtBQUtqQyxLQUFMLENBQVdrQyxZQUFYLENBQXdCLEtBQUtsQyxLQUFMLENBQVdTLE1BQW5DO0FBTGIsS0FBUDtBQU9EOztBQTFIa0U7Ozs7Z0JBQWhEYix1QixlQUNBO0FBQ2pCO0FBQ0FXLEVBQUFBLFFBQVEsRUFBRTRCLDZCQUFpQkMsVUFGVjtBQUdqQjVCLEVBQUFBLEtBQUssRUFBRTZCLG1CQUFVQyxNQUFWLENBQWlCRixVQUhQO0FBS2pCO0FBQ0FwQixFQUFBQSxLQUFLLEVBQUVxQixtQkFBVUUsTUFOQTtBQU9qQjlCLEVBQUFBLE1BQU0sRUFBRStCLDJCQUFlSixVQVBOO0FBU2pCO0FBQ0FMLEVBQUFBLGNBQWMsRUFBRU0sbUJBQVVJLElBQVYsQ0FBZUwsVUFWZDtBQVdqQkYsRUFBQUEsWUFBWSxFQUFFRyxtQkFBVUksSUFBVixDQUFlTCxVQVhaO0FBWWpCSixFQUFBQSxhQUFhLEVBQUVLLG1CQUFVSSxJQUFWLENBQWVMO0FBWmIsQzs7Z0JBREF4Qyx1QixrQkFnQkc7QUFDcEJvQixFQUFBQSxLQUFLLEVBQUU7QUFEYSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHthdXRvYmluZCwgQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFLCBDSEVDS19SVU5fUEFHRV9TSVpFfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7U2VhcmNoUHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IElzc3VlaXNoTGlzdENvbnRyb2xsZXIsIHtCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlcn0gZnJvbSAnLi4vY29udHJvbGxlcnMvaXNzdWVpc2gtbGlzdC1jb250cm9sbGVyJztcbmltcG9ydCBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIgZnJvbSAnLi4vcmVsYXktbmV0d29yay1sYXllci1tYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVpc2hTZWFyY2hDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIENvbm5lY3Rpb24gaW5mb3JtYXRpb25cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHRva2VuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBTZWFyY2ggbW9kZWxcbiAgICBsaW1pdDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzZWFyY2g6IFNlYXJjaFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIG9uT3Blbklzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uT3BlblNlYXJjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbk9wZW5SZXZpZXdzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBsaW1pdDogMjAsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAncmVuZGVyUXVlcnlSZXN1bHQnKTtcblxuICAgIHRoaXMuc3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QodGhpcy5wcm9wcy5lbmRwb2ludCwgdGhpcy5wcm9wcy50b2tlbik7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zZWFyY2guaXNOdWxsKCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlclxuICAgICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgey4uLnRoaXMuY29udHJvbGxlclByb3BzKCl9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXJ5ID0gZ3JhcGhxbGBcbiAgICAgIHF1ZXJ5IGlzc3VlaXNoU2VhcmNoQ29udGFpbmVyUXVlcnkoXG4gICAgICAgICRxdWVyeTogU3RyaW5nIVxuICAgICAgICAkZmlyc3Q6IEludCFcbiAgICAgICAgJGNoZWNrU3VpdGVDb3VudDogSW50IVxuICAgICAgICAkY2hlY2tTdWl0ZUN1cnNvcjogU3RyaW5nXG4gICAgICAgICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICAgICAgICRjaGVja1J1bkN1cnNvcjogU3RyaW5nXG4gICAgICApIHtcbiAgICAgICAgc2VhcmNoKGZpcnN0OiAkZmlyc3QsIHF1ZXJ5OiAkcXVlcnksIHR5cGU6IElTU1VFKSB7XG4gICAgICAgICAgaXNzdWVDb3VudFxuICAgICAgICAgIG5vZGVzIHtcbiAgICAgICAgICAgIC4uLmlzc3VlaXNoTGlzdENvbnRyb2xsZXJfcmVzdWx0cyBAYXJndW1lbnRzKFxuICAgICAgICAgICAgICBjaGVja1N1aXRlQ291bnQ6ICRjaGVja1N1aXRlQ291bnRcbiAgICAgICAgICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogJGNoZWNrU3VpdGVDdXJzb3JcbiAgICAgICAgICAgICAgY2hlY2tSdW5Db3VudDogJGNoZWNrUnVuQ291bnRcbiAgICAgICAgICAgICAgY2hlY2tSdW5DdXJzb3I6ICRjaGVja1J1bkN1cnNvclxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgcXVlcnk6IHRoaXMucHJvcHMuc2VhcmNoLmNyZWF0ZVF1ZXJ5KCksXG4gICAgICBmaXJzdDogdGhpcy5wcm9wcy5saW1pdCxcbiAgICAgIGNoZWNrU3VpdGVDb3VudDogQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFLFxuICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogbnVsbCxcbiAgICAgIGNoZWNrUnVuQ291bnQ6IENIRUNLX1JVTl9QQUdFX1NJWkUsXG4gICAgICBjaGVja1J1bkN1cnNvcjogbnVsbCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxRdWVyeVJlbmRlcmVyXG4gICAgICAgIGVudmlyb25tZW50PXtlbnZpcm9ubWVudH1cbiAgICAgICAgdmFyaWFibGVzPXt2YXJpYWJsZXN9XG4gICAgICAgIHF1ZXJ5PXtxdWVyeX1cbiAgICAgICAgcmVuZGVyPXt0aGlzLnJlbmRlclF1ZXJ5UmVzdWx0fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUXVlcnlSZXN1bHQoe2Vycm9yLCBwcm9wc30pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlclxuICAgICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgIHsuLi50aGlzLmNvbnRyb2xsZXJQcm9wcygpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxCYXJlSXNzdWVpc2hMaXN0Q29udHJvbGxlclxuICAgICAgICAgIGlzTG9hZGluZz17dHJ1ZX1cbiAgICAgICAgICB7Li4udGhpcy5jb250cm9sbGVyUHJvcHMoKX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxJc3N1ZWlzaExpc3RDb250cm9sbGVyXG4gICAgICAgIHRvdGFsPXtwcm9wcy5zZWFyY2guaXNzdWVDb3VudH1cbiAgICAgICAgcmVzdWx0cz17cHJvcHMuc2VhcmNoLm5vZGVzfVxuICAgICAgICBpc0xvYWRpbmc9e2ZhbHNlfVxuICAgICAgICB7Li4udGhpcy5jb250cm9sbGVyUHJvcHMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGNvbnRyb2xsZXJQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6IHRoaXMucHJvcHMuc2VhcmNoLmdldE5hbWUoKSxcblxuICAgICAgb25PcGVuSXNzdWVpc2g6IHRoaXMucHJvcHMub25PcGVuSXNzdWVpc2gsXG4gICAgICBvbk9wZW5SZXZpZXdzOiB0aGlzLnByb3BzLm9uT3BlblJldmlld3MsXG4gICAgICBvbk9wZW5Nb3JlOiAoKSA9PiB0aGlzLnByb3BzLm9uT3BlblNlYXJjaCh0aGlzLnByb3BzLnNlYXJjaCksXG4gICAgfTtcbiAgfVxufVxuIl19