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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2FnZ3JlZ2F0ZWQtcmV2aWV3cy1jb250YWluZXIuanMiXSwibmFtZXMiOlsiQmFyZUFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiY2FsbGJhY2siLCJyZWxheSIsInJlZmV0Y2giLCJwcklkIiwicHVsbFJlcXVlc3QiLCJpZCIsInJldmlld0NvdW50IiwiUEFHRV9TSVpFIiwicmV2aWV3Q3Vyc29yIiwidGhyZWFkQ291bnQiLCJ0aHJlYWRDdXJzb3IiLCJjb21tZW50Q291bnQiLCJjb21tZW50Q3Vyc29yIiwiZXJyIiwicmVwb3J0UmVsYXlFcnJvciIsImVtaXR0ZXIiLCJlbWl0IiwiZm9yY2UiLCJvbiIsIkVtaXR0ZXIiLCJyZW5kZXIiLCJvbkRpZFJlZmV0Y2giLCJlcnJvciIsInN1bW1hcnlFcnJvciIsInN1bW1hcmllcyIsImxvYWRpbmciLCJzdW1tYXJpZXNMb2FkaW5nIiwicGF5bG9hZCIsInJlc3VsdCIsImVycm9ycyIsImNvbW1lbnRUaHJlYWRzIiwicHVzaCIsImNoaWxkcmVuIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsInN1bW1hcmllc1JlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLDhCQUFOLFNBQTZDQyxlQUFNQyxTQUFuRCxDQUE2RDtBQXNCbEVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLHFDQXVDVEMsUUFBUSxJQUFJLEtBQUtELEtBQUwsQ0FBV0UsS0FBWCxDQUFpQkMsT0FBakIsQ0FDcEI7QUFDRUMsTUFBQUEsSUFBSSxFQUFFLEtBQUtKLEtBQUwsQ0FBV0ssV0FBWCxDQUF1QkMsRUFEL0I7QUFFRUMsTUFBQUEsV0FBVyxFQUFFQyxrQkFGZjtBQUdFQyxNQUFBQSxZQUFZLEVBQUUsSUFIaEI7QUFJRUMsTUFBQUEsV0FBVyxFQUFFRixrQkFKZjtBQUtFRyxNQUFBQSxZQUFZLEVBQUUsSUFMaEI7QUFNRUMsTUFBQUEsWUFBWSxFQUFFSixrQkFOaEI7QUFPRUssTUFBQUEsYUFBYSxFQUFFO0FBUGpCLEtBRG9CLEVBVXBCLElBVm9CLEVBV3BCQyxHQUFHLElBQUk7QUFDTCxVQUFJQSxHQUFKLEVBQVM7QUFDUCxhQUFLZCxLQUFMLENBQVdlLGdCQUFYLENBQTRCLDJCQUE1QixFQUF5REQsR0FBekQ7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLRSxPQUFMLENBQWFDLElBQWIsQ0FBa0IsYUFBbEI7QUFDRDs7QUFDRGhCLE1BQUFBLFFBQVE7QUFDVCxLQWxCbUIsRUFtQnBCO0FBQUNpQixNQUFBQSxLQUFLLEVBQUU7QUFBUixLQW5Cb0IsQ0F2Q0g7O0FBQUEsMENBNkRKakIsUUFBUSxJQUFJLEtBQUtlLE9BQUwsQ0FBYUcsRUFBYixDQUFnQixhQUFoQixFQUErQmxCLFFBQS9CLENBN0RSOztBQUVqQixTQUFLZSxPQUFMLEdBQWUsSUFBSUksaUJBQUosRUFBZjtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFLDZCQUFDLG1DQUFEO0FBQ0UsTUFBQSxZQUFZLEVBQUUsS0FBS0MsWUFEckI7QUFFRSxNQUFBLFdBQVcsRUFBRSxLQUFLdEIsS0FBTCxDQUFXSztBQUYxQixPQUdHLENBQUM7QUFBQ2tCLE1BQUFBLEtBQUssRUFBRUMsWUFBUjtBQUFzQkMsTUFBQUEsU0FBdEI7QUFBaUNDLE1BQUFBLE9BQU8sRUFBRUM7QUFBMUMsS0FBRCxLQUFpRTtBQUNoRSxhQUNFLDZCQUFDLGlDQUFEO0FBQ0UsUUFBQSxZQUFZLEVBQUUsS0FBS0wsWUFEckI7QUFFRSxRQUFBLFdBQVcsRUFBRSxLQUFLdEIsS0FBTCxDQUFXSztBQUYxQixTQUdHdUIsT0FBTyxJQUFJO0FBQ1YsY0FBTUMsTUFBTSxHQUFHO0FBQ2JDLFVBQUFBLE1BQU0sRUFBRSxFQURLO0FBRWIzQixVQUFBQSxPQUFPLEVBQUUsS0FBS0EsT0FGRDtBQUdic0IsVUFBQUEsU0FIYTtBQUliTSxVQUFBQSxjQUFjLEVBQUVILE9BQU8sQ0FBQ0csY0FKWDtBQUtiTCxVQUFBQSxPQUFPLEVBQUVFLE9BQU8sQ0FBQ0YsT0FBUixJQUFtQkM7QUFMZixTQUFmOztBQVFBLFlBQUlILFlBQUosRUFBa0I7QUFDaEJLLFVBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjRSxJQUFkLENBQW1CUixZQUFuQjtBQUNEOztBQUNESyxRQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBY0UsSUFBZCxDQUFtQixHQUFHSixPQUFPLENBQUNFLE1BQTlCO0FBRUEsZUFBTyxLQUFLOUIsS0FBTCxDQUFXaUMsUUFBWCxDQUFvQkosTUFBcEIsQ0FBUDtBQUNELE9BbEJILENBREY7QUFzQkQsS0ExQkgsQ0FERjtBQThCRDs7QUExRGlFOzs7O2dCQUF2RGpDLDhCLGVBQ1E7QUFDakI7QUFDQU0sRUFBQUEsS0FBSyxFQUFFZ0MsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDckJoQyxJQUFBQSxPQUFPLEVBQUUrQixtQkFBVUUsSUFBVixDQUFlQztBQURILEdBQWhCLENBRlU7QUFNakI7QUFDQWhDLEVBQUFBLFdBQVcsRUFBRTZCLG1CQUFVQyxLQUFWLENBQWdCO0FBQzNCN0IsSUFBQUEsRUFBRSxFQUFFNEIsbUJBQVVJLE1BQVYsQ0FBaUJEO0FBRE0sR0FBaEIsRUFFVkEsVUFUYztBQVdqQjtBQUNBSixFQUFBQSxRQUFRLEVBQUVDLG1CQUFVRSxJQUFWLENBQWVDLFVBWlI7QUFjakI7QUFDQUUsRUFBQUEsaUJBQWlCLEVBQUVMLG1CQUFVRSxJQWZaO0FBaUJqQjtBQUNBckIsRUFBQUEsZ0JBQWdCLEVBQUVtQixtQkFBVUUsSUFBVixDQUFlQztBQWxCaEIsQzs7ZUFxRk4sd0NBQXVCekMsOEJBQXZCLEVBQXVEO0FBQ3BFUyxFQUFBQSxXQUFXO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEeUQsQ0FBdkQ7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUmVmZXRjaENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtQQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IFJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yIGZyb20gJy4vYWNjdW11bGF0b3JzL3Jldmlldy1zdW1tYXJpZXMtYWNjdW11bGF0b3InO1xuaW1wb3J0IFJldmlld1RocmVhZHNBY2N1bXVsYXRvciBmcm9tICcuL2FjY3VtdWxhdG9ycy9yZXZpZXctdGhyZWFkcy1hY2N1bXVsYXRvcic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQWdncmVnYXRlZFJldmlld3NDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3BvbnNlXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuXG4gICAgLy8gUmVsYXkgcmVzdWx0cy5cbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCB7ZXJyb3JzLCBzdW1tYXJpZXMsIGNvbW1lbnRUaHJlYWRzLCBsb2FkaW5nfS5cbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIG9ubHkgZmV0Y2ggc3VtbWFyaWVzIHdoZW4gd2Ugc3BlY2lmeSBhIHN1bW1hcmllc1JlbmRlcmVyXG4gICAgc3VtbWFyaWVzUmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gUmVwb3J0IGVycm9ycyBkdXJpbmcgcmVmZXRjaFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JcbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcHVsbFJlcXVlc3Q9e3RoaXMucHJvcHMucHVsbFJlcXVlc3R9PlxuICAgICAgICB7KHtlcnJvcjogc3VtbWFyeUVycm9yLCBzdW1tYXJpZXMsIGxvYWRpbmc6IHN1bW1hcmllc0xvYWRpbmd9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxSZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JcbiAgICAgICAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3RoaXMucHJvcHMucHVsbFJlcXVlc3R9PlxuICAgICAgICAgICAgICB7cGF5bG9hZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgICAgICAgIHJlZmV0Y2g6IHRoaXMucmVmZXRjaCxcbiAgICAgICAgICAgICAgICAgIHN1bW1hcmllcyxcbiAgICAgICAgICAgICAgICAgIGNvbW1lbnRUaHJlYWRzOiBwYXlsb2FkLmNvbW1lbnRUaHJlYWRzLFxuICAgICAgICAgICAgICAgICAgbG9hZGluZzogcGF5bG9hZC5sb2FkaW5nIHx8IHN1bW1hcmllc0xvYWRpbmcsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChzdW1tYXJ5RXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvcnMucHVzaChzdW1tYXJ5RXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3JzLnB1c2goLi4ucGF5bG9hZC5lcnJvcnMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW4ocmVzdWx0KTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIDwvUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yPlxuICAgICAgICAgICk7XG4gICAgICAgIH19XG4gICAgICA8L1Jldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cblxuXG4gIHJlZmV0Y2ggPSBjYWxsYmFjayA9PiB0aGlzLnByb3BzLnJlbGF5LnJlZmV0Y2goXG4gICAge1xuICAgICAgcHJJZDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgIHJldmlld0NvdW50OiBQQUdFX1NJWkUsXG4gICAgICByZXZpZXdDdXJzb3I6IG51bGwsXG4gICAgICB0aHJlYWRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgdGhyZWFkQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWVudENvdW50OiBQQUdFX1NJWkUsXG4gICAgICBjb21tZW50Q3Vyc29yOiBudWxsLFxuICAgIH0sXG4gICAgbnVsbCxcbiAgICBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZWZyZXNoIHJldmlld3MnLCBlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1yZWZldGNoJyk7XG4gICAgICB9XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0sXG4gICAge2ZvcmNlOiB0cnVlfSxcbiAgKTtcblxuICBvbkRpZFJlZmV0Y2ggPSBjYWxsYmFjayA9PiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1yZWZldGNoJywgY2FsbGJhY2spO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWZldGNoQ29udGFpbmVyKEJhcmVBZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lciwge1xuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdFxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgcmV2aWV3Q291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHJldmlld0N1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgICB0aHJlYWRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgdGhyZWFkQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNvbW1lbnRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY29tbWVudEN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICBpZFxuICAgICAgLi4ucmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgcmV2aWV3Q291bnQ6ICRyZXZpZXdDb3VudFxuICAgICAgICByZXZpZXdDdXJzb3I6ICRyZXZpZXdDdXJzb3JcbiAgICAgIClcbiAgICAgIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICB0aHJlYWRDb3VudDogJHRocmVhZENvdW50XG4gICAgICAgIHRocmVhZEN1cnNvcjogJHRocmVhZEN1cnNvclxuICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgY29tbWVudEN1cnNvcjogJGNvbW1lbnRDdXJzb3JcbiAgICAgIClcbiAgICB9XG4gIGAsXG59LCBncmFwaHFsYFxuICBxdWVyeSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lclJlZmV0Y2hRdWVyeVxuICAoXG4gICAgJHBySWQ6IElEIVxuICAgICRyZXZpZXdDb3VudDogSW50IVxuICAgICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xuICAgICR0aHJlYWRDb3VudDogSW50IVxuICAgICR0aHJlYWRDdXJzb3I6IFN0cmluZ1xuICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICAkY29tbWVudEN1cnNvcjogU3RyaW5nXG4gICkge1xuICAgIHB1bGxSZXF1ZXN0OiBub2RlKGlkOiAkcHJJZCkge1xuICAgICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3RcbiAgICAgIC4uLmFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgIHJldmlld0NvdW50OiAkcmV2aWV3Q291bnRcbiAgICAgICAgcmV2aWV3Q3Vyc29yOiAkcmV2aWV3Q3Vyc29yXG4gICAgICAgIHRocmVhZENvdW50OiAkdGhyZWFkQ291bnRcbiAgICAgICAgdGhyZWFkQ3Vyc29yOiAkdGhyZWFkQ3Vyc29yXG4gICAgICAgIGNvbW1lbnRDb3VudDogJGNvbW1lbnRDb3VudFxuICAgICAgICBjb21tZW50Q3Vyc29yOiAkY29tbWVudEN1cnNvclxuICAgICAgKVxuICAgIH1cbiAgfVxuYCk7XG4iXX0=