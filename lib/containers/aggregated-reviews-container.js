"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareAggregatedReviewsContainer = void 0;
var _react = _interopRequireDefault(require("react"));
var _eventKit = require("event-kit");
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _helpers = require("../helpers");
var _reviewSummariesAccumulator = _interopRequireDefault(require("./accumulators/review-summaries-accumulator"));
var _reviewThreadsAccumulator = _interopRequireDefault(require("./accumulators/review-threads-accumulator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareAggregatedReviewsContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "refetch", callback => this.props.relay.refetch({
      prId: this.props.pullRequest.id,
      reviewCount: _helpers.PAGE_SIZE,
      reviewCursor: null,
      threadCount: _helpers.PAGE_SIZE,
      threadCursor: null,
      commentCount: _helpers.PAGE_SIZE,
      commentCursor: null
    }, null, err => {
      if (err) {
        this.props.reportRelayError('Unable to refresh reviews', err);
      } else {
        this.emitter.emit('did-refetch');
      }
      callback();
    }, {
      force: true
    }));
    _defineProperty(this, "onDidRefetch", callback => this.emitter.on('did-refetch', callback));
    this.emitter = new _eventKit.Emitter();
  }
  render() {
    return _react.default.createElement(_reviewSummariesAccumulator.default, {
      onDidRefetch: this.onDidRefetch,
      pullRequest: this.props.pullRequest
    }, ({
      error: summaryError,
      summaries,
      loading: summariesLoading
    }) => {
      return _react.default.createElement(_reviewThreadsAccumulator.default, {
        onDidRefetch: this.onDidRefetch,
        pullRequest: this.props.pullRequest
      }, payload => {
        const result = {
          errors: [],
          refetch: this.refetch,
          summaries,
          commentThreads: payload.commentThreads,
          loading: payload.loading || summariesLoading
        };
        if (summaryError) {
          result.errors.push(summaryError);
        }
        result.errors.push(...payload.errors);
        return this.props.children(result);
      });
    });
  }
}
exports.BareAggregatedReviewsContainer = BareAggregatedReviewsContainer;
_defineProperty(BareAggregatedReviewsContainer, "propTypes", {
  // Relay response
  relay: _propTypes.default.shape({
    refetch: _propTypes.default.func.isRequired
  }),
  // Relay results.
  pullRequest: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }).isRequired,
  // Render prop. Called with {errors, summaries, commentThreads, loading}.
  children: _propTypes.default.func.isRequired,
  // only fetch summaries when we specify a summariesRenderer
  summariesRenderer: _propTypes.default.func,
  // Report errors during refetch
  reportRelayError: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createRefetchContainer)(BareAggregatedReviewsContainer, {
  pullRequest: function () {
    const node = require("./__generated__/aggregatedReviewsContainer_pullRequest.graphql");
    if (node.hash && node.hash !== "830225d5b83d6c320e16cf824fe0cca6") {
      console.error("The definition of 'aggregatedReviewsContainer_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/aggregatedReviewsContainer_pullRequest.graphql");
  }
}, function () {
  const node = require("./__generated__/aggregatedReviewsContainerRefetchQuery.graphql");
  if (node.hash && node.hash !== "2bf1bb4fa69d264bcecbe81f41621908") {
    console.error("The definition of 'aggregatedReviewsContainerRefetchQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/aggregatedReviewsContainerRefetchQuery.graphql");
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQWdncmVnYXRlZFJldmlld3NDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjYWxsYmFjayIsInJlbGF5IiwicmVmZXRjaCIsInBySWQiLCJwdWxsUmVxdWVzdCIsImlkIiwicmV2aWV3Q291bnQiLCJQQUdFX1NJWkUiLCJyZXZpZXdDdXJzb3IiLCJ0aHJlYWRDb3VudCIsInRocmVhZEN1cnNvciIsImNvbW1lbnRDb3VudCIsImNvbW1lbnRDdXJzb3IiLCJlcnIiLCJyZXBvcnRSZWxheUVycm9yIiwiZW1pdHRlciIsImVtaXQiLCJmb3JjZSIsIm9uIiwiRW1pdHRlciIsInJlbmRlciIsIm9uRGlkUmVmZXRjaCIsImVycm9yIiwic3VtbWFyeUVycm9yIiwic3VtbWFyaWVzIiwibG9hZGluZyIsInN1bW1hcmllc0xvYWRpbmciLCJwYXlsb2FkIiwicmVzdWx0IiwiZXJyb3JzIiwiY29tbWVudFRocmVhZHMiLCJwdXNoIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwic3VtbWFyaWVzUmVuZGVyZXIiLCJjcmVhdGVSZWZldGNoQ29udGFpbmVyIl0sInNvdXJjZXMiOlsiYWdncmVnYXRlZC1yZXZpZXdzLWNvbnRhaW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVSZWZldGNoQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1BBR0VfU0laRX0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3IgZnJvbSAnLi9hY2N1bXVsYXRvcnMvcmV2aWV3LXN1bW1hcmllcy1hY2N1bXVsYXRvcic7XG5pbXBvcnQgUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yIGZyb20gJy4vYWNjdW11bGF0b3JzL3Jldmlldy10aHJlYWRzLWFjY3VtdWxhdG9yJztcblxuZXhwb3J0IGNsYXNzIEJhcmVBZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzcG9uc2VcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG5cbiAgICAvLyBSZWxheSByZXN1bHRzLlxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUmVuZGVyIHByb3AuIENhbGxlZCB3aXRoIHtlcnJvcnMsIHN1bW1hcmllcywgY29tbWVudFRocmVhZHMsIGxvYWRpbmd9LlxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gb25seSBmZXRjaCBzdW1tYXJpZXMgd2hlbiB3ZSBzcGVjaWZ5IGEgc3VtbWFyaWVzUmVuZGVyZXJcbiAgICBzdW1tYXJpZXNSZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBSZXBvcnQgZXJyb3JzIGR1cmluZyByZWZldGNoXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvclxuICAgICAgICBvbkRpZFJlZmV0Y2g9e3RoaXMub25EaWRSZWZldGNofVxuICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5wdWxsUmVxdWVzdH0+XG4gICAgICAgIHsoe2Vycm9yOiBzdW1tYXJ5RXJyb3IsIHN1bW1hcmllcywgbG9hZGluZzogc3VtbWFyaWVzTG9hZGluZ30pID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFJldmlld1RocmVhZHNBY2N1bXVsYXRvclxuICAgICAgICAgICAgICBvbkRpZFJlZmV0Y2g9e3RoaXMub25EaWRSZWZldGNofVxuICAgICAgICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5wdWxsUmVxdWVzdH0+XG4gICAgICAgICAgICAgIHtwYXlsb2FkID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgICAgICAgcmVmZXRjaDogdGhpcy5yZWZldGNoLFxuICAgICAgICAgICAgICAgICAgc3VtbWFyaWVzLFxuICAgICAgICAgICAgICAgICAgY29tbWVudFRocmVhZHM6IHBheWxvYWQuY29tbWVudFRocmVhZHMsXG4gICAgICAgICAgICAgICAgICBsb2FkaW5nOiBwYXlsb2FkLmxvYWRpbmcgfHwgc3VtbWFyaWVzTG9hZGluZyxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1bW1hcnlFcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9ycy5wdXNoKHN1bW1hcnlFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvcnMucHVzaCguLi5wYXlsb2FkLmVycm9ycyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbihyZXN1bHQpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPC9SZXZpZXdUaHJlYWRzQWNjdW11bGF0b3I+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3I+XG4gICAgKTtcbiAgfVxuXG5cbiAgcmVmZXRjaCA9IGNhbGxiYWNrID0+IHRoaXMucHJvcHMucmVsYXkucmVmZXRjaChcbiAgICB7XG4gICAgICBwcklkOiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgcmV2aWV3Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHJldmlld0N1cnNvcjogbnVsbCxcbiAgICAgIHRocmVhZENvdW50OiBQQUdFX1NJWkUsXG4gICAgICB0aHJlYWRDdXJzb3I6IG51bGwsXG4gICAgICBjb21tZW50Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIGNvbW1lbnRDdXJzb3I6IG51bGwsXG4gICAgfSxcbiAgICBudWxsLFxuICAgIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHJlZnJlc2ggcmV2aWV3cycsIGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXJlZmV0Y2gnKTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSxcbiAgICB7Zm9yY2U6IHRydWV9LFxuICApO1xuXG4gIG9uRGlkUmVmZXRjaCA9IGNhbGxiYWNrID0+IHRoaXMuZW1pdHRlci5vbignZGlkLXJlZmV0Y2gnLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJlZmV0Y2hDb250YWluZXIoQmFyZUFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyLCB7XG4gIHB1bGxSZXF1ZXN0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICByZXZpZXdDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgcmV2aWV3Q3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIHRocmVhZENvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICB0aHJlYWRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY29tbWVudENvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjb21tZW50Q3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIGlkXG4gICAgICAuLi5yZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICByZXZpZXdDb3VudDogJHJldmlld0NvdW50XG4gICAgICAgIHJldmlld0N1cnNvcjogJHJldmlld0N1cnNvclxuICAgICAgKVxuICAgICAgLi4ucmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgIHRocmVhZENvdW50OiAkdGhyZWFkQ291bnRcbiAgICAgICAgdGhyZWFkQ3Vyc29yOiAkdGhyZWFkQ3Vyc29yXG4gICAgICAgIGNvbW1lbnRDb3VudDogJGNvbW1lbnRDb3VudFxuICAgICAgICBjb21tZW50Q3Vyc29yOiAkY29tbWVudEN1cnNvclxuICAgICAgKVxuICAgIH1cbiAgYCxcbn0sIGdyYXBocWxgXG4gIHF1ZXJ5IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyUmVmZXRjaFF1ZXJ5XG4gIChcbiAgICAkcHJJZDogSUQhXG4gICAgJHJldmlld0NvdW50OiBJbnQhXG4gICAgJHJldmlld0N1cnNvcjogU3RyaW5nXG4gICAgJHRocmVhZENvdW50OiBJbnQhXG4gICAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICAgJGNvbW1lbnRDb3VudDogSW50IVxuICAgICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbiAgKSB7XG4gICAgcHVsbFJlcXVlc3Q6IG5vZGUoaWQ6ICRwcklkKSB7XG4gICAgICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdFxuICAgICAgLi4uYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgcmV2aWV3Q291bnQ6ICRyZXZpZXdDb3VudFxuICAgICAgICByZXZpZXdDdXJzb3I6ICRyZXZpZXdDdXJzb3JcbiAgICAgICAgdGhyZWFkQ291bnQ6ICR0aHJlYWRDb3VudFxuICAgICAgICB0aHJlYWRDdXJzb3I6ICR0aHJlYWRDdXJzb3JcbiAgICAgICAgY29tbWVudENvdW50OiAkY29tbWVudENvdW50XG4gICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICApXG4gICAgfVxuICB9XG5gKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBaUY7QUFBQTtBQUFBO0FBQUE7QUFFMUUsTUFBTUEsOEJBQThCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBc0JsRUMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyxpQ0FzQ0xDLFFBQVEsSUFBSSxJQUFJLENBQUNELEtBQUssQ0FBQ0UsS0FBSyxDQUFDQyxPQUFPLENBQzVDO01BQ0VDLElBQUksRUFBRSxJQUFJLENBQUNKLEtBQUssQ0FBQ0ssV0FBVyxDQUFDQyxFQUFFO01BQy9CQyxXQUFXLEVBQUVDLGtCQUFTO01BQ3RCQyxZQUFZLEVBQUUsSUFBSTtNQUNsQkMsV0FBVyxFQUFFRixrQkFBUztNQUN0QkcsWUFBWSxFQUFFLElBQUk7TUFDbEJDLFlBQVksRUFBRUosa0JBQVM7TUFDdkJLLGFBQWEsRUFBRTtJQUNqQixDQUFDLEVBQ0QsSUFBSSxFQUNKQyxHQUFHLElBQUk7TUFDTCxJQUFJQSxHQUFHLEVBQUU7UUFDUCxJQUFJLENBQUNkLEtBQUssQ0FBQ2UsZ0JBQWdCLENBQUMsMkJBQTJCLEVBQUVELEdBQUcsQ0FBQztNQUMvRCxD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