"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareReviewThreadsAccumulator = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRelay = require("react-relay");
var _helpers = require("../../helpers");
var _propTypes2 = require("../../prop-types");
var _accumulator = _interopRequireDefault(require("./accumulator"));
var _reviewCommentsAccumulator = _interopRequireDefault(require("./review-comments-accumulator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareReviewThreadsAccumulator extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderReviewThreads", (err, threads, loading) => {
      if (err) {
        return this.props.children({
          errors: [err],
          commentThreads: [],
          loading
        });
      }
      return this.renderReviewThread({
        errors: [],
        commentsByThread: new Map(),
        loading
      }, threads);
    });
    _defineProperty(this, "renderReviewThread", (payload, threads) => {
      if (threads.length === 0) {
        const commentThreads = [];
        payload.commentsByThread.forEach((comments, thread) => {
          commentThreads.push({
            thread,
            comments
          });
        });
        return this.props.children({
          commentThreads,
          errors: payload.errors,
          loading: payload.loading
        });
      }
      const [thread] = threads;
      return _react.default.createElement(_reviewCommentsAccumulator.default, {
        onDidRefetch: this.props.onDidRefetch,
        reviewThread: thread
      }, ({
        error,
        comments,
        loading: threadLoading
      }) => {
        if (error) {
          payload.errors.push(error);
        }
        payload.commentsByThread.set(thread, comments);
        payload.loading = payload.loading || threadLoading;
        return this.renderReviewThread(payload, threads.slice(1));
      });
    });
  }
  render() {
    const resultBatch = this.props.pullRequest.reviewThreads.edges.map(edge => edge.node);
    return _react.default.createElement(_accumulator.default, {
      relay: this.props.relay,
      resultBatch: resultBatch,
      onDidRefetch: this.props.onDidRefetch,
      pageSize: _helpers.PAGE_SIZE,
      waitTimeMs: _helpers.PAGINATION_WAIT_TIME_MS
    }, this.renderReviewThreads);
  }
}
exports.BareReviewThreadsAccumulator = BareReviewThreadsAccumulator;
_defineProperty(BareReviewThreadsAccumulator, "propTypes", {
  // Relay props
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  pullRequest: _propTypes.default.shape({
    reviewThreads: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.object)
  }),
  // Render prop. Called with (array of errors, array of threads, map of comments per thread, loading)
  children: _propTypes.default.func.isRequired,
  // Called right after refetch happens
  onDidRefetch: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createPaginationContainer)(BareReviewThreadsAccumulator, {
  pullRequest: function () {
    const node = require("./__generated__/reviewThreadsAccumulator_pullRequest.graphql");
    if (node.hash && node.hash !== "15785e7c291c2dc79dbf6e534bcb7e76") {
      console.error("The definition of 'reviewThreadsAccumulator_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewThreadsAccumulator_pullRequest.graphql");
  }
}, {
  direction: 'forward',
  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.pullRequest.reviewThreads;
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
  }, fragmentVariables) {
    return {
      url: props.pullRequest.url,
      threadCount: count,
      threadCursor: cursor,
      commentCount: fragmentVariables.commentCount
    };
  },
  query: function () {
    const node = require("./__generated__/reviewThreadsAccumulatorQuery.graphql");
    if (node.hash && node.hash !== "e79afa42892ad508af3b22ca911cd7c5") {
      console.error("The definition of 'reviewThreadsAccumulatorQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewThreadsAccumulatorQuery.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yIiwiUmVhY3QiLCJDb21wb25lbnQiLCJlcnIiLCJ0aHJlYWRzIiwibG9hZGluZyIsInByb3BzIiwiY2hpbGRyZW4iLCJlcnJvcnMiLCJjb21tZW50VGhyZWFkcyIsInJlbmRlclJldmlld1RocmVhZCIsImNvbW1lbnRzQnlUaHJlYWQiLCJNYXAiLCJwYXlsb2FkIiwibGVuZ3RoIiwiZm9yRWFjaCIsImNvbW1lbnRzIiwidGhyZWFkIiwicHVzaCIsIm9uRGlkUmVmZXRjaCIsImVycm9yIiwidGhyZWFkTG9hZGluZyIsInNldCIsInNsaWNlIiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJwdWxsUmVxdWVzdCIsInJldmlld1RocmVhZHMiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJub2RlIiwicmVsYXkiLCJQQUdFX1NJWkUiLCJQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyIsInJlbmRlclJldmlld1RocmVhZHMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImhhc01vcmUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImxvYWRNb3JlIiwiaXNMb2FkaW5nIiwiUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUiLCJvYmplY3QiLCJjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyIiwiZGlyZWN0aW9uIiwiZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJmcmFnbWVudFZhcmlhYmxlcyIsInVybCIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwicXVlcnkiXSwic291cmNlcyI6WyJyZXZpZXctdGhyZWFkcy1hY2N1bXVsYXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1BBR0VfU0laRSwgUEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZX0gZnJvbSAnLi4vLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQWNjdW11bGF0b3IgZnJvbSAnLi9hY2N1bXVsYXRvcic7XG5pbXBvcnQgUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvciBmcm9tICcuL3Jldmlldy1jb21tZW50cy1hY2N1bXVsYXRvcic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSBwcm9wc1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICByZXZpZXdUaHJlYWRzOiBSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZShcbiAgICAgICAgUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICksXG4gICAgfSksXG5cbiAgICAvLyBSZW5kZXIgcHJvcC4gQ2FsbGVkIHdpdGggKGFycmF5IG9mIGVycm9ycywgYXJyYXkgb2YgdGhyZWFkcywgbWFwIG9mIGNvbW1lbnRzIHBlciB0aHJlYWQsIGxvYWRpbmcpXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDYWxsZWQgcmlnaHQgYWZ0ZXIgcmVmZXRjaCBoYXBwZW5zXG4gICAgb25EaWRSZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEJhdGNoID0gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5yZXZpZXdUaHJlYWRzLmVkZ2VzLm1hcChlZGdlID0+IGVkZ2Uubm9kZSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBY2N1bXVsYXRvclxuICAgICAgICByZWxheT17dGhpcy5wcm9wcy5yZWxheX1cbiAgICAgICAgcmVzdWx0QmF0Y2g9e3Jlc3VsdEJhdGNofVxuICAgICAgICBvbkRpZFJlZmV0Y2g9e3RoaXMucHJvcHMub25EaWRSZWZldGNofVxuICAgICAgICBwYWdlU2l6ZT17UEFHRV9TSVpFfVxuICAgICAgICB3YWl0VGltZU1zPXtQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30+XG4gICAgICAgIHt0aGlzLnJlbmRlclJldmlld1RocmVhZHN9XG4gICAgICA8L0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdUaHJlYWRzID0gKGVyciwgdGhyZWFkcywgbG9hZGluZykgPT4ge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHtcbiAgICAgICAgZXJyb3JzOiBbZXJyXSxcbiAgICAgICAgY29tbWVudFRocmVhZHM6IFtdLFxuICAgICAgICBsb2FkaW5nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyUmV2aWV3VGhyZWFkKHtlcnJvcnM6IFtdLCBjb21tZW50c0J5VGhyZWFkOiBuZXcgTWFwKCksIGxvYWRpbmd9LCB0aHJlYWRzKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld1RocmVhZCA9IChwYXlsb2FkLCB0aHJlYWRzKSA9PiB7XG4gICAgaWYgKHRocmVhZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBjb21tZW50VGhyZWFkcyA9IFtdO1xuICAgICAgcGF5bG9hZC5jb21tZW50c0J5VGhyZWFkLmZvckVhY2goKGNvbW1lbnRzLCB0aHJlYWQpID0+IHtcbiAgICAgICAgY29tbWVudFRocmVhZHMucHVzaCh7dGhyZWFkLCBjb21tZW50c30pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbih7XG4gICAgICAgIGNvbW1lbnRUaHJlYWRzLFxuICAgICAgICBlcnJvcnM6IHBheWxvYWQuZXJyb3JzLFxuICAgICAgICBsb2FkaW5nOiBwYXlsb2FkLmxvYWRpbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBbdGhyZWFkXSA9IHRocmVhZHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yXG4gICAgICAgIG9uRGlkUmVmZXRjaD17dGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2h9XG4gICAgICAgIHJldmlld1RocmVhZD17dGhyZWFkfT5cbiAgICAgICAgeyh7ZXJyb3IsIGNvbW1lbnRzLCBsb2FkaW5nOiB0aHJlYWRMb2FkaW5nfSkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcGF5bG9hZC5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBheWxvYWQuY29tbWVudHNCeVRocmVhZC5zZXQodGhyZWFkLCBjb21tZW50cyk7XG4gICAgICAgICAgcGF5bG9hZC5sb2FkaW5nID0gcGF5bG9hZC5sb2FkaW5nIHx8IHRocmVhZExvYWRpbmc7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUmV2aWV3VGhyZWFkKHBheWxvYWQsIHRocmVhZHMuc2xpY2UoMSkpO1xuICAgICAgICB9fVxuICAgICAgPC9SZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yLCB7XG4gIHB1bGxSZXF1ZXN0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdFxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgdGhyZWFkQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHRocmVhZEN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgICBjb21tZW50Q291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNvbW1lbnRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgdXJsXG4gICAgICByZXZpZXdUaHJlYWRzKFxuICAgICAgICBmaXJzdDogJHRocmVhZENvdW50XG4gICAgICAgIGFmdGVyOiAkdGhyZWFkQ3Vyc29yXG4gICAgICApIEBjb25uZWN0aW9uKGtleTogXCJSZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkc1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHtcbiAgICAgICAgICBoYXNOZXh0UGFnZVxuICAgICAgICAgIGVuZEN1cnNvclxuICAgICAgICB9XG5cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIGlzUmVzb2x2ZWRcbiAgICAgICAgICAgIHJlc29sdmVkQnkge1xuICAgICAgICAgICAgICBsb2dpblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXG5cbiAgICAgICAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkIEBhcmd1bWVudHMoXG4gICAgICAgICAgICAgIGNvbW1lbnRDb3VudDogJGNvbW1lbnRDb3VudFxuICAgICAgICAgICAgICBjb21tZW50Q3Vyc29yOiAkY29tbWVudEN1cnNvclxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMucHVsbFJlcXVlc3QucmV2aWV3VGhyZWFkcztcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4gey4uLnByZXZWYXJzLCB0b3RhbENvdW50fTtcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0sIGZyYWdtZW50VmFyaWFibGVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogcHJvcHMucHVsbFJlcXVlc3QudXJsLFxuICAgICAgdGhyZWFkQ291bnQ6IGNvdW50LFxuICAgICAgdGhyZWFkQ3Vyc29yOiBjdXJzb3IsXG4gICAgICBjb21tZW50Q291bnQ6IGZyYWdtZW50VmFyaWFibGVzLmNvbW1lbnRDb3VudCxcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeShcbiAgICAgICR1cmw6IFVSSSFcbiAgICAgICR0aHJlYWRDb3VudDogSW50IVxuICAgICAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICAgICAkY29tbWVudENvdW50OiBJbnQhXG4gICAgKSB7XG4gICAgICByZXNvdXJjZSh1cmw6ICR1cmwpIHtcbiAgICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgICAgICAuLi5yZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIHRocmVhZENvdW50OiAkdGhyZWFkQ291bnRcbiAgICAgICAgICAgIHRocmVhZEN1cnNvcjogJHRocmVhZEN1cnNvclxuICAgICAgICAgICAgY29tbWVudENvdW50OiAkY29tbWVudENvdW50XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQXNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUUvRCxNQUFNQSw0QkFBNEIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEsNkNBbUMxQyxDQUFDQyxHQUFHLEVBQUVDLE9BQU8sRUFBRUMsT0FBTyxLQUFLO01BQy9DLElBQUlGLEdBQUcsRUFBRTtRQUNQLE9BQU8sSUFBSSxDQUFDRyxLQUFLLENBQUNDLFFBQVEsQ0FBQztVQUN6QkMsTUFBTSxFQUFFLENBQUNMLEdBQUcsQ0FBQztVQUNiTSxjQUFjLEVBQUUsRUFBRTtVQUNsQko7UUFDRixDQUFDLENBQUM7TUFDSjtNQUVBLE9BQU8sSUFBSSxDQUFDSyxrQkFBa0IsQ0FBQztRQUFDRixNQUFNLEVBQUUsRUFBRTtRQUFFRyxnQkFBZ0IsRUFBRSxJQUFJQyxHQUFHLEVBQUU7UUFBRVA7TUFBTyxDQUFDLEVBQUVELE9BQU8sQ0FBQztJQUM3RixDQUFDO0lBQUEsNENBRW9CLENBQUNTLE9BQU8sRUFBRVQsT0FBTyxLQUFLO01BQ3pDLElBQUlBLE9BQU8sQ0FBQ1UsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN4QixNQUFNTCxjQUFjLEdBQUcsRUFBRTtRQUN6QkksT0FBTyxDQUFDRixnQkFBZ0IsQ0FBQ0ksT0FBTyxDQUFDLENBQUNDLFFBQVEsRUFBRUMsTUFBTSxLQUFLO1VBQ3JEUixjQUFjLENBQUNTLElBQUksQ0FBQztZQUFDRCxNQUFNO1lBQUVEO1VBQVEsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQztRQUNGLE9B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