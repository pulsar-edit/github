"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareReviewSummariesAccumulator = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _reactRelay = require("react-relay");
var _helpers = require("../../helpers");
var _propTypes2 = require("../../prop-types");
var _accumulator = _interopRequireDefault(require("./accumulator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareReviewSummariesAccumulator extends _react.default.Component {
  render() {
    const resultBatch = this.props.pullRequest.reviews.edges.map(edge => edge.node);
    return _react.default.createElement(_accumulator.default, {
      relay: this.props.relay,
      resultBatch: resultBatch,
      onDidRefetch: this.props.onDidRefetch,
      pageSize: _helpers.PAGE_SIZE,
      waitTimeMs: _helpers.PAGINATION_WAIT_TIME_MS
    }, (error, results, loading) => {
      const summaries = results.sort((a, b) => (0, _moment.default)(a.submittedAt, _moment.default.ISO_8601) - (0, _moment.default)(b.submittedAt, _moment.default.ISO_8601));
      return this.props.children({
        error,
        summaries,
        loading
      });
    });
  }
}
exports.BareReviewSummariesAccumulator = BareReviewSummariesAccumulator;
_defineProperty(BareReviewSummariesAccumulator, "propTypes", {
  // Relay props
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  pullRequest: _propTypes.default.shape({
    reviews: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.object)
  }),
  // Render prop. Called with {error: error or null, summaries: array of all reviews, loading}
  children: _propTypes.default.func.isRequired,
  // Called right after refetch happens
  onDidRefetch: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createPaginationContainer)(BareReviewSummariesAccumulator, {
  pullRequest: function () {
    const node = require("./__generated__/reviewSummariesAccumulator_pullRequest.graphql");
    if (node.hash && node.hash !== "4ac732c2325cedd6e8e90bb5c140cc1a") {
      console.error("The definition of 'reviewSummariesAccumulator_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewSummariesAccumulator_pullRequest.graphql");
  }
}, {
  direction: 'forward',
  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.pullRequest.reviews;
  },
  /* istanbul ignore next */
  getFragmentVariables(prevVars, totalCount) {
    return _objectSpread({}, prevVars, {
      totalCount
    });
  },
  /* istanbul ignore next */
  getVariables(props, {
    count,
    cursor
  }) {
    return {
      url: props.pullRequest.url,
      reviewCount: count,
      reviewCursor: cursor
    };
  },
  query: function () {
    const node = require("./__generated__/reviewSummariesAccumulatorQuery.graphql");
    if (node.hash && node.hash !== "74bb2a56369e3c54b76c4ce7c17f328e") {
      console.error("The definition of 'reviewSummariesAccumulatorQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewSummariesAccumulatorQuery.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlc3VsdEJhdGNoIiwicHJvcHMiLCJwdWxsUmVxdWVzdCIsInJldmlld3MiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJub2RlIiwicmVsYXkiLCJvbkRpZFJlZmV0Y2giLCJQQUdFX1NJWkUiLCJQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyIsImVycm9yIiwicmVzdWx0cyIsImxvYWRpbmciLCJzdW1tYXJpZXMiLCJzb3J0IiwiYSIsImIiLCJtb21lbnQiLCJzdWJtaXR0ZWRBdCIsIklTT184NjAxIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJzaGFwZSIsImhhc01vcmUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImxvYWRNb3JlIiwiaXNMb2FkaW5nIiwiUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUiLCJvYmplY3QiLCJjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyIiwiZGlyZWN0aW9uIiwiZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJ1cmwiLCJyZXZpZXdDb3VudCIsInJldmlld0N1cnNvciIsInF1ZXJ5Il0sInNvdXJjZXMiOlsicmV2aWV3LXN1bW1hcmllcy1hY2N1bXVsYXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1BBR0VfU0laRSwgUEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZX0gZnJvbSAnLi4vLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQWNjdW11bGF0b3IgZnJvbSAnLi9hY2N1bXVsYXRvcic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHByb3BzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJldmlld3M6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgKSxcbiAgICB9KSxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCB7ZXJyb3I6IGVycm9yIG9yIG51bGwsIHN1bW1hcmllczogYXJyYXkgb2YgYWxsIHJldmlld3MsIGxvYWRpbmd9XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDYWxsZWQgcmlnaHQgYWZ0ZXIgcmVmZXRjaCBoYXBwZW5zXG4gICAgb25EaWRSZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEJhdGNoID0gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5yZXZpZXdzLmVkZ2VzLm1hcChlZGdlID0+IGVkZ2Uubm9kZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFjY3VtdWxhdG9yXG4gICAgICAgIHJlbGF5PXt0aGlzLnByb3BzLnJlbGF5fVxuICAgICAgICByZXN1bHRCYXRjaD17cmVzdWx0QmF0Y2h9XG4gICAgICAgIG9uRGlkUmVmZXRjaD17dGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2h9XG4gICAgICAgIHBhZ2VTaXplPXtQQUdFX1NJWkV9XG4gICAgICAgIHdhaXRUaW1lTXM9e1BBR0lOQVRJT05fV0FJVF9USU1FX01TfT5cbiAgICAgICAgeyhlcnJvciwgcmVzdWx0cywgbG9hZGluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IHN1bW1hcmllcyA9IHJlc3VsdHMuc29ydCgoYSwgYikgPT5cbiAgICAgICAgICAgIG1vbWVudChhLnN1Ym1pdHRlZEF0LCBtb21lbnQuSVNPXzg2MDEpIC0gbW9tZW50KGIuc3VibWl0dGVkQXQsIG1vbWVudC5JU09fODYwMSksXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbih7ZXJyb3IsIHN1bW1hcmllcywgbG9hZGluZ30pO1xuICAgICAgICB9fVxuICAgICAgPC9BY2N1bXVsYXRvcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoQmFyZVJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yLCB7XG4gIHB1bGxSZXF1ZXN0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICByZXZpZXdDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgcmV2aWV3Q3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn0sXG4gICAgKSB7XG4gICAgICB1cmxcbiAgICAgIHJldmlld3MoXG4gICAgICAgIGZpcnN0OiAkcmV2aWV3Q291bnRcbiAgICAgICAgYWZ0ZXI6ICRyZXZpZXdDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIlJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3Jldmlld3NcIikge1xuICAgICAgICBwYWdlSW5mbyB7XG4gICAgICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgICAgICBlbmRDdXJzb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBjdXJzb3JcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgICBib2R5XG4gICAgICAgICAgICBib2R5SFRNTFxuICAgICAgICAgICAgc3RhdGVcbiAgICAgICAgICAgIHN1Ym1pdHRlZEF0XG4gICAgICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICAgICAgbG9naW5cbiAgICAgICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgICAgICBhdXRob3JBc3NvY2lhdGlvblxuICAgICAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMucHVsbFJlcXVlc3QucmV2aWV3cztcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4gey4uLnByZXZWYXJzLCB0b3RhbENvdW50fTtcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBwcm9wcy5wdWxsUmVxdWVzdC51cmwsXG4gICAgICByZXZpZXdDb3VudDogY291bnQsXG4gICAgICByZXZpZXdDdXJzb3I6IGN1cnNvcixcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvclF1ZXJ5KFxuICAgICAgJHVybDogVVJJIVxuICAgICAgJHJldmlld0NvdW50OiBJbnQhXG4gICAgICAkcmV2aWV3Q3Vyc29yOiBTdHJpbmdcbiAgICApIHtcbiAgICAgIHJlc291cmNlKHVybDogJHVybCkge1xuICAgICAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xuICAgICAgICAgIC4uLnJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgICAgICByZXZpZXdDb3VudDogJHJldmlld0NvdW50XG4gICAgICAgICAgICByZXZpZXdDdXJzb3I6ICRyZXZpZXdDdXJzb3JcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBd0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRWpDLE1BQU1BLDhCQUE4QixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXFCbEVDLE1BQU0sR0FBRztJQUNQLE1BQU1DLFdBQVcsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsV0FBVyxDQUFDQyxPQUFPLENBQUNDLEtBQUssQ0FBQ0MsR0FBRyxDQUFDQyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsSUFBSSxDQUFDO0lBRS9FLE9BQ0UsNkJBQUMsb0JBQVc7TUFDVixLQUFLLEVBQUUsSUFBSSxDQUFDTixLQUFLLENBQUNPLEtBQU07TUFDeEIsV0FBVyxFQUFFUixXQUFZO01BQ3pCLFlBQVksRUFBRSxJQUFJLENBQUNDLEtBQUssQ0FBQ1EsWUFBYTtNQUN0QyxRQUFRLEVBQUVDLGtCQUFVO01BQ3BCLFVBQVUsRUFBRUM7SUFBd0IsR0FDbkMsQ0FBQ0MsS0FBSyxFQUFFQyxPQUFPLEVBQUVDLE9BQU8sS0FBSztNQUM1QixNQUFNQyxTQUFTLEdBQUdGLE9BQU8sQ0FBQ0csSUFBSSxDQUFDLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxLQUNsQyxJQUFBQyxlQUFNLEVBQUNGLENBQUMsQ0FBQ0csV0FBVyxFQUFFRCxlQUFNLENBQUNFLFFBQVEsQ0FBQyxHQUFHLElBQUFGLGVBQU0sRUFBQ0QsQ0FBQyxDQUFDRSxXQUFXLEVBQUVELGVBQU0sQ0FBQ0UsUUFBUSxDQUFDLENBQ2hGO01BQ0QsT0FBTyxJQUFJLENBQUNwQixLQUFLLENBQUNxQixRQUFRLENBQUM7UUFBQ1YsS0FBSztRQUFFRyxTQUFTO1FBQUVEO01BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUMsQ0FDVztFQUVsQjtBQUNGO0FBQUM7QUFBQSxnQkF4Q1lsQiw4QkFBOEIsZUFDdEI7RUFDakI7RUFDQVksS0FBSyxFQUFFZSxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDckJDLE9BQU8sRUFBRUYsa0JBQVMsQ0FBQ0csSUFBSSxDQUFDQyxVQUFVO0lBQ2xDQyxRQUFRLEVBQUVMLGtCQUFTLENBQUNHLElBQUksQ0FBQ0MsVUFBVTtJQUNuQ0UsU0FBUyxFQUFFTixrQkFBUyxDQUFDRyxJQUFJLENBQUNDO0VBQzVCLENBQUMsQ0FBQyxDQUFDQSxVQUFVO0VBQ2J6QixXQUFXLEVBQUVxQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDM0JyQixPQUFPLEVBQUUsSUFBQTJCLG1DQUF1QixFQUM5QlAsa0JBQVMsQ0FBQ1EsTUFBTTtFQUVwQixDQUFDLENBQUM7RUFFRjtFQUNBVCxRQUFRLEVBQUVDLGtCQUFTLENBQUNHLElBQUksQ0FBQ0MsVUFBVTtFQUVuQztFQUNBbEIsWUFBWSxFQUFFYyxrQkFBUyxDQUFDRyxJQUFJLENBQUNDO0FBQy9CLENBQUM7QUFBQSxlQXVCWSxJQUFBSyxxQ0FBeUIsRUFBQ3BDLDhCQUE4QixFQUFFO0VBQ3ZFTSxXQUFXO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBdUNiLENBQUMsRUFBRTtFQUNEK0IsU0FBUyxFQUFFLFNBQVM7RUFDcEI7RUFDQUMsc0JBQXNCLENBQUNqQyxLQUFLLEVBQUU7SUFDNUIsT0FBT0EsS0FBSyxDQUFDQyxXQUFXLENBQUNDLE9BQU87RUFDbEMsQ0FBQztFQUNEO0VBQ0FnQyxvQkFBb0IsQ0FBQ0MsUUFBUSxFQUFFQyxVQUFVLEVBQUU7SUFDekMseUJBQVdELFFBQVE7TUFBRUM7SUFBVTtFQUNqQyxDQUFDO0VBQ0Q7RUFDQUMsWUFBWSxDQUFDckMsS0FBSyxFQUFFO0lBQUNzQyxLQUFLO0lBQUVDO0VBQU0sQ0FBQyxFQUFFO0lBQ25DLE9BQU87TUFDTEMsR0FBRyxFQUFFeEMsS0FBSyxDQUFDQyxXQUFXLENBQUN1QyxHQUFHO01BQzFCQyxXQUFXLEVBQUVILEtBQUs7TUFDbEJJLFlBQVksRUFBRUg7SUFDaEIsQ0FBQztFQUNILENBQUM7RUFDREksS0FBSztJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQWdCUCxDQUFDLENBQUM7QUFBQSJ9