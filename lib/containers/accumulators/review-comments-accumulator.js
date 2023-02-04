"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareReviewCommentsAccumulator = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
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
class BareReviewCommentsAccumulator extends _react.default.Component {
  render() {
    const resultBatch = this.props.reviewThread.comments.edges.map(edge => edge.node);
    return _react.default.createElement(_accumulator.default, {
      relay: this.props.relay,
      resultBatch: resultBatch,
      onDidRefetch: this.props.onDidRefetch,
      pageSize: _helpers.PAGE_SIZE,
      waitTimeMs: _helpers.PAGINATION_WAIT_TIME_MS
    }, (error, comments, loading) => this.props.children({
      error,
      comments,
      loading
    }));
  }
}
exports.BareReviewCommentsAccumulator = BareReviewCommentsAccumulator;
_defineProperty(BareReviewCommentsAccumulator, "propTypes", {
  // Relay props
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  reviewThread: _propTypes.default.shape({
    comments: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.object)
  }),
  // Render prop. Called with (error or null, array of all review comments, loading)
  children: _propTypes.default.func,
  // Called right after refetch happens
  onDidRefetch: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createPaginationContainer)(BareReviewCommentsAccumulator, {
  reviewThread: function () {
    const node = require("./__generated__/reviewCommentsAccumulator_reviewThread.graphql");
    if (node.hash && node.hash !== "2716996f7cb548d6f3a3894f5d51193a") {
      console.error("The definition of 'reviewCommentsAccumulator_reviewThread' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewCommentsAccumulator_reviewThread.graphql");
  }
}, {
  direction: 'forward',
  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.reviewThread.comments;
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
      id: props.reviewThread.id,
      commentCount: count,
      commentCursor: cursor
    };
  },
  query: function () {
    const node = require("./__generated__/reviewCommentsAccumulatorQuery.graphql");
    if (node.hash && node.hash !== "25bc4376239d278025fc1f353900572a") {
      console.error("The definition of 'reviewCommentsAccumulatorQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewCommentsAccumulatorQuery.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJwcm9wcyIsInJldmlld1RocmVhZCIsImNvbW1lbnRzIiwiZWRnZXMiLCJtYXAiLCJlZGdlIiwibm9kZSIsInJlbGF5Iiwib25EaWRSZWZldGNoIiwiUEFHRV9TSVpFIiwiUEFHSU5BVElPTl9XQUlUX1RJTUVfTVMiLCJlcnJvciIsImxvYWRpbmciLCJjaGlsZHJlbiIsIlByb3BUeXBlcyIsInNoYXBlIiwiaGFzTW9yZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwibG9hZE1vcmUiLCJpc0xvYWRpbmciLCJSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZSIsIm9iamVjdCIsImNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJnZXRWYXJpYWJsZXMiLCJjb3VudCIsImN1cnNvciIsImlkIiwiY29tbWVudENvdW50IiwiY29tbWVudEN1cnNvciIsInF1ZXJ5Il0sInNvdXJjZXMiOlsicmV2aWV3LWNvbW1lbnRzLWFjY3VtdWxhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7UEFHRV9TSVpFLCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi8uLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBY2N1bXVsYXRvciBmcm9tICcuL2FjY3VtdWxhdG9yJztcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSBwcm9wc1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3VGhyZWFkOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY29tbWVudHM6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgKSxcbiAgICB9KSxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoZXJyb3Igb3IgbnVsbCwgYXJyYXkgb2YgYWxsIHJldmlldyBjb21tZW50cywgbG9hZGluZylcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBDYWxsZWQgcmlnaHQgYWZ0ZXIgcmVmZXRjaCBoYXBwZW5zXG4gICAgb25EaWRSZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEJhdGNoID0gdGhpcy5wcm9wcy5yZXZpZXdUaHJlYWQuY29tbWVudHMuZWRnZXMubWFwKGVkZ2UgPT4gZWRnZS5ub2RlKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8QWNjdW11bGF0b3JcbiAgICAgICAgcmVsYXk9e3RoaXMucHJvcHMucmVsYXl9XG4gICAgICAgIHJlc3VsdEJhdGNoPXtyZXN1bHRCYXRjaH1cbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcGFnZVNpemU9e1BBR0VfU0laRX1cbiAgICAgICAgd2FpdFRpbWVNcz17UEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9PlxuICAgICAgICB7KGVycm9yLCBjb21tZW50cywgbG9hZGluZykgPT4gdGhpcy5wcm9wcy5jaGlsZHJlbih7ZXJyb3IsIGNvbW1lbnRzLCBsb2FkaW5nfSl9XG4gICAgICA8L0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvciwge1xuICByZXZpZXdUaHJlYWQ6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWQgb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIGNvbW1lbnRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY29tbWVudEN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9LFxuICAgICkge1xuICAgICAgaWRcbiAgICAgIGNvbW1lbnRzKFxuICAgICAgICBmaXJzdDogJGNvbW1lbnRDb3VudFxuICAgICAgICBhZnRlcjogJGNvbW1lbnRDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIlJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfY29tbWVudHNcIikge1xuICAgICAgICBwYWdlSW5mbyB7XG4gICAgICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgICAgICBlbmRDdXJzb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBjdXJzb3JcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgICBhdXRob3Ige1xuICAgICAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICAgICAgbG9naW5cbiAgICAgICAgICAgICAgdXJsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib2R5SFRNTFxuICAgICAgICAgICAgYm9keVxuICAgICAgICAgICAgaXNNaW5pbWl6ZWRcbiAgICAgICAgICAgIHN0YXRlXG4gICAgICAgICAgICB2aWV3ZXJDYW5SZWFjdFxuICAgICAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgICAgICBwYXRoXG4gICAgICAgICAgICBwb3NpdGlvblxuICAgICAgICAgICAgY3JlYXRlZEF0XG4gICAgICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cbiAgICAgICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnJldmlld1RocmVhZC5jb21tZW50cztcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4gey4uLnByZXZWYXJzLCB0b3RhbENvdW50fTtcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHByb3BzLnJldmlld1RocmVhZC5pZCxcbiAgICAgIGNvbW1lbnRDb3VudDogY291bnQsXG4gICAgICBjb21tZW50Q3Vyc29yOiBjdXJzb3IsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5KFxuICAgICAgJGlkOiBJRCFcbiAgICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICAgICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbiAgICApIHtcbiAgICAgIG5vZGUoaWQ6ICRpZCkge1xuICAgICAgICAuLi4gb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xuICAgICAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkIEBhcmd1bWVudHMoXG4gICAgICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUF3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFakMsTUFBTUEsNkJBQTZCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBcUJqRUMsTUFBTSxHQUFHO0lBQ1AsTUFBTUMsV0FBVyxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxZQUFZLENBQUNDLFFBQVEsQ0FBQ0MsS0FBSyxDQUFDQyxHQUFHLENBQUNDLElBQUksSUFBSUEsSUFBSSxDQUFDQyxJQUFJLENBQUM7SUFFakYsT0FDRSw2QkFBQyxvQkFBVztNQUNWLEtBQUssRUFBRSxJQUFJLENBQUNOLEtBQUssQ0FBQ08sS0FBTTtNQUN4QixXQUFXLEVBQUVSLFdBQVk7TUFDekIsWUFBWSxFQUFFLElBQUksQ0FBQ0MsS0FBSyxDQUFDUSxZQUFhO01BQ3RDLFFBQVEsRUFBRUMsa0JBQVU7TUFDcEIsVUFBVSxFQUFFQztJQUF3QixHQUNuQyxDQUFDQyxLQUFLLEVBQUVULFFBQVEsRUFBRVUsT0FBTyxLQUFLLElBQUksQ0FBQ1osS0FBSyxDQUFDYSxRQUFRLENBQUM7TUFBQ0YsS0FBSztNQUFFVCxRQUFRO01BQUVVO0lBQU8sQ0FBQyxDQUFDLENBQ2xFO0VBRWxCO0FBQ0Y7QUFBQztBQUFBLGdCQW5DWWpCLDZCQUE2QixlQUNyQjtFQUNqQjtFQUNBWSxLQUFLLEVBQUVPLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUNyQkMsT0FBTyxFQUFFRixrQkFBUyxDQUFDRyxJQUFJLENBQUNDLFVBQVU7SUFDbENDLFFBQVEsRUFBRUwsa0JBQVMsQ0FBQ0csSUFBSSxDQUFDQyxVQUFVO0lBQ25DRSxTQUFTLEVBQUVOLGtCQUFTLENBQUNHLElBQUksQ0FBQ0M7RUFDNUIsQ0FBQyxDQUFDLENBQUNBLFVBQVU7RUFDYmpCLFlBQVksRUFBRWEsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQzVCYixRQUFRLEVBQUUsSUFBQW1CLG1DQUF1QixFQUMvQlAsa0JBQVMsQ0FBQ1EsTUFBTTtFQUVwQixDQUFDLENBQUM7RUFFRjtFQUNBVCxRQUFRLEVBQUVDLGtCQUFTLENBQUNHLElBQUk7RUFFeEI7RUFDQVQsWUFBWSxFQUFFTSxrQkFBUyxDQUFDRyxJQUFJLENBQUNDO0FBQy9CLENBQUM7QUFBQSxlQWtCWSxJQUFBSyxxQ0FBeUIsRUFBQzVCLDZCQUE2QixFQUFFO0VBQ3RFTSxZQUFZO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBMkNkLENBQUMsRUFBRTtFQUNEdUIsU0FBUyxFQUFFLFNBQVM7RUFDcEI7RUFDQUMsc0JBQXNCLENBQUN6QixLQUFLLEVBQUU7SUFDNUIsT0FBT0EsS0FBSyxDQUFDQyxZQUFZLENBQUNDLFFBQVE7RUFDcEMsQ0FBQztFQUNEO0VBQ0F3QixvQkFBb0IsQ0FBQ0MsUUFBUSxFQUFFQyxVQUFVLEVBQUU7SUFDekMseUJBQVdELFFBQVE7TUFBRUM7SUFBVTtFQUNqQyxDQUFDO0VBQ0Q7RUFDQUMsWUFBWSxDQUFDN0IsS0FBSyxFQUFFO0lBQUM4QixLQUFLO0lBQUVDO0VBQU0sQ0FBQyxFQUFFO0lBQ25DLE9BQU87TUFDTEMsRUFBRSxFQUFFaEMsS0FBSyxDQUFDQyxZQUFZLENBQUMrQixFQUFFO01BQ3pCQyxZQUFZLEVBQUVILEtBQUs7TUFDbkJJLGFBQWEsRUFBRUg7SUFDakIsQ0FBQztFQUNILENBQUM7RUFDREksS0FBSztJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQWdCUCxDQUFDLENBQUM7QUFBQSJ9