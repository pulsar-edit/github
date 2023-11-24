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