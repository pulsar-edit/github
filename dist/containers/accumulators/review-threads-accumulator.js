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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
      return /*#__PURE__*/_react.default.createElement(_reviewCommentsAccumulator.default, {
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
    return /*#__PURE__*/_react.default.createElement(_accumulator.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9yZXZpZXctdGhyZWFkcy1hY2N1bXVsYXRvci5qcyJdLCJuYW1lcyI6WyJCYXJlUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yIiwiUmVhY3QiLCJDb21wb25lbnQiLCJlcnIiLCJ0aHJlYWRzIiwibG9hZGluZyIsInByb3BzIiwiY2hpbGRyZW4iLCJlcnJvcnMiLCJjb21tZW50VGhyZWFkcyIsInJlbmRlclJldmlld1RocmVhZCIsImNvbW1lbnRzQnlUaHJlYWQiLCJNYXAiLCJwYXlsb2FkIiwibGVuZ3RoIiwiZm9yRWFjaCIsImNvbW1lbnRzIiwidGhyZWFkIiwicHVzaCIsIm9uRGlkUmVmZXRjaCIsImVycm9yIiwidGhyZWFkTG9hZGluZyIsInNldCIsInNsaWNlIiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJwdWxsUmVxdWVzdCIsInJldmlld1RocmVhZHMiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJub2RlIiwicmVsYXkiLCJQQUdFX1NJWkUiLCJQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyIsInJlbmRlclJldmlld1RocmVhZHMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImhhc01vcmUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImxvYWRNb3JlIiwiaXNMb2FkaW5nIiwib2JqZWN0IiwiZGlyZWN0aW9uIiwiZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJmcmFnbWVudFZhcmlhYmxlcyIsInVybCIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwicXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLE1BQU1BLDRCQUFOLFNBQTJDQyxlQUFNQyxTQUFqRCxDQUEyRDtBQUFBO0FBQUE7O0FBQUEsaURBbUMxQyxDQUFDQyxHQUFELEVBQU1DLE9BQU4sRUFBZUMsT0FBZixLQUEyQjtBQUMvQyxVQUFJRixHQUFKLEVBQVM7QUFDUCxlQUFPLEtBQUtHLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQjtBQUN6QkMsVUFBQUEsTUFBTSxFQUFFLENBQUNMLEdBQUQsQ0FEaUI7QUFFekJNLFVBQUFBLGNBQWMsRUFBRSxFQUZTO0FBR3pCSixVQUFBQTtBQUh5QixTQUFwQixDQUFQO0FBS0Q7O0FBRUQsYUFBTyxLQUFLSyxrQkFBTCxDQUF3QjtBQUFDRixRQUFBQSxNQUFNLEVBQUUsRUFBVDtBQUFhRyxRQUFBQSxnQkFBZ0IsRUFBRSxJQUFJQyxHQUFKLEVBQS9CO0FBQTBDUCxRQUFBQTtBQUExQyxPQUF4QixFQUE0RUQsT0FBNUUsQ0FBUDtBQUNELEtBN0MrRDs7QUFBQSxnREErQzNDLENBQUNTLE9BQUQsRUFBVVQsT0FBVixLQUFzQjtBQUN6QyxVQUFJQSxPQUFPLENBQUNVLE1BQVIsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsY0FBTUwsY0FBYyxHQUFHLEVBQXZCO0FBQ0FJLFFBQUFBLE9BQU8sQ0FBQ0YsZ0JBQVIsQ0FBeUJJLE9BQXpCLENBQWlDLENBQUNDLFFBQUQsRUFBV0MsTUFBWCxLQUFzQjtBQUNyRFIsVUFBQUEsY0FBYyxDQUFDUyxJQUFmLENBQW9CO0FBQUNELFlBQUFBLE1BQUQ7QUFBU0QsWUFBQUE7QUFBVCxXQUFwQjtBQUNELFNBRkQ7QUFHQSxlQUFPLEtBQUtWLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQjtBQUN6QkUsVUFBQUEsY0FEeUI7QUFFekJELFVBQUFBLE1BQU0sRUFBRUssT0FBTyxDQUFDTCxNQUZTO0FBR3pCSCxVQUFBQSxPQUFPLEVBQUVRLE9BQU8sQ0FBQ1I7QUFIUSxTQUFwQixDQUFQO0FBS0Q7O0FBRUQsWUFBTSxDQUFDWSxNQUFELElBQVdiLE9BQWpCO0FBQ0EsMEJBQ0UsNkJBQUMsa0NBQUQ7QUFDRSxRQUFBLFlBQVksRUFBRSxLQUFLRSxLQUFMLENBQVdhLFlBRDNCO0FBRUUsUUFBQSxZQUFZLEVBQUVGO0FBRmhCLFNBR0csQ0FBQztBQUFDRyxRQUFBQSxLQUFEO0FBQVFKLFFBQUFBLFFBQVI7QUFBa0JYLFFBQUFBLE9BQU8sRUFBRWdCO0FBQTNCLE9BQUQsS0FBK0M7QUFDOUMsWUFBSUQsS0FBSixFQUFXO0FBQ1RQLFVBQUFBLE9BQU8sQ0FBQ0wsTUFBUixDQUFlVSxJQUFmLENBQW9CRSxLQUFwQjtBQUNEOztBQUNEUCxRQUFBQSxPQUFPLENBQUNGLGdCQUFSLENBQXlCVyxHQUF6QixDQUE2QkwsTUFBN0IsRUFBcUNELFFBQXJDO0FBQ0FILFFBQUFBLE9BQU8sQ0FBQ1IsT0FBUixHQUFrQlEsT0FBTyxDQUFDUixPQUFSLElBQW1CZ0IsYUFBckM7QUFDQSxlQUFPLEtBQUtYLGtCQUFMLENBQXdCRyxPQUF4QixFQUFpQ1QsT0FBTyxDQUFDbUIsS0FBUixDQUFjLENBQWQsQ0FBakMsQ0FBUDtBQUNELE9BVkgsQ0FERjtBQWNELEtBM0UrRDtBQUFBOztBQXFCaEVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLFdBQVcsR0FBRyxLQUFLbkIsS0FBTCxDQUFXb0IsV0FBWCxDQUF1QkMsYUFBdkIsQ0FBcUNDLEtBQXJDLENBQTJDQyxHQUEzQyxDQUErQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLElBQTVELENBQXBCO0FBQ0Esd0JBQ0UsNkJBQUMsb0JBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRSxLQUFLekIsS0FBTCxDQUFXMEIsS0FEcEI7QUFFRSxNQUFBLFdBQVcsRUFBRVAsV0FGZjtBQUdFLE1BQUEsWUFBWSxFQUFFLEtBQUtuQixLQUFMLENBQVdhLFlBSDNCO0FBSUUsTUFBQSxRQUFRLEVBQUVjLGtCQUpaO0FBS0UsTUFBQSxVQUFVLEVBQUVDO0FBTGQsT0FNRyxLQUFLQyxtQkFOUixDQURGO0FBVUQ7O0FBakMrRDs7OztnQkFBckRuQyw0QixlQUNRO0FBQ2pCO0FBQ0FnQyxFQUFBQSxLQUFLLEVBQUVJLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCQyxJQUFBQSxPQUFPLEVBQUVGLG1CQUFVRyxJQUFWLENBQWVDLFVBREg7QUFFckJDLElBQUFBLFFBQVEsRUFBRUwsbUJBQVVHLElBQVYsQ0FBZUMsVUFGSjtBQUdyQkUsSUFBQUEsU0FBUyxFQUFFTixtQkFBVUcsSUFBVixDQUFlQztBQUhMLEdBQWhCLEVBSUpBLFVBTmM7QUFPakJkLEVBQUFBLFdBQVcsRUFBRVUsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDM0JWLElBQUFBLGFBQWEsRUFBRSx5Q0FDYlMsbUJBQVVPLE1BREc7QUFEWSxHQUFoQixDQVBJO0FBYWpCO0FBQ0FwQyxFQUFBQSxRQUFRLEVBQUU2QixtQkFBVUcsSUFBVixDQUFlQyxVQWRSO0FBZ0JqQjtBQUNBckIsRUFBQUEsWUFBWSxFQUFFaUIsbUJBQVVHLElBQVYsQ0FBZUM7QUFqQlosQzs7ZUE2RU4sMkNBQTBCeEMsNEJBQTFCLEVBQXdEO0FBQ3JFMEIsRUFBQUEsV0FBVztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRDBELENBQXhELEVBdUNaO0FBQ0RrQixFQUFBQSxTQUFTLEVBQUUsU0FEVjs7QUFFRDtBQUNBQyxFQUFBQSxzQkFBc0IsQ0FBQ3ZDLEtBQUQsRUFBUTtBQUM1QixXQUFPQSxLQUFLLENBQUNvQixXQUFOLENBQWtCQyxhQUF6QjtBQUNELEdBTEE7O0FBTUQ7QUFDQW1CLEVBQUFBLG9CQUFvQixDQUFDQyxRQUFELEVBQVdDLFVBQVgsRUFBdUI7QUFDekMsNkJBQVdELFFBQVg7QUFBcUJDLE1BQUFBO0FBQXJCO0FBQ0QsR0FUQTs7QUFVRDtBQUNBQyxFQUFBQSxZQUFZLENBQUMzQyxLQUFELEVBQVE7QUFBQzRDLElBQUFBLEtBQUQ7QUFBUUMsSUFBQUE7QUFBUixHQUFSLEVBQXlCQyxpQkFBekIsRUFBNEM7QUFDdEQsV0FBTztBQUNMQyxNQUFBQSxHQUFHLEVBQUUvQyxLQUFLLENBQUNvQixXQUFOLENBQWtCMkIsR0FEbEI7QUFFTEMsTUFBQUEsV0FBVyxFQUFFSixLQUZSO0FBR0xLLE1BQUFBLFlBQVksRUFBRUosTUFIVDtBQUlMSyxNQUFBQSxZQUFZLEVBQUVKLGlCQUFpQixDQUFDSTtBQUozQixLQUFQO0FBTUQsR0FsQkE7O0FBbUJEQyxFQUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFuQkosQ0F2Q1ksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7UEFHRV9TSVpFLCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi8uLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBY2N1bXVsYXRvciBmcm9tICcuL2FjY3VtdWxhdG9yJztcbmltcG9ydCBSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yIGZyb20gJy4vcmV2aWV3LWNvbW1lbnRzLWFjY3VtdWxhdG9yJztcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXZpZXdUaHJlYWRzQWNjdW11bGF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHByb3BzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJldmlld1RocmVhZHM6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgKSxcbiAgICB9KSxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoYXJyYXkgb2YgZXJyb3JzLCBhcnJheSBvZiB0aHJlYWRzLCBtYXAgb2YgY29tbWVudHMgcGVyIHRocmVhZCwgbG9hZGluZylcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIENhbGxlZCByaWdodCBhZnRlciByZWZldGNoIGhhcHBlbnNcbiAgICBvbkRpZFJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVzdWx0QmF0Y2ggPSB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LnJldmlld1RocmVhZHMuZWRnZXMubWFwKGVkZ2UgPT4gZWRnZS5ub2RlKTtcbiAgICByZXR1cm4gKFxuICAgICAgPEFjY3VtdWxhdG9yXG4gICAgICAgIHJlbGF5PXt0aGlzLnByb3BzLnJlbGF5fVxuICAgICAgICByZXN1bHRCYXRjaD17cmVzdWx0QmF0Y2h9XG4gICAgICAgIG9uRGlkUmVmZXRjaD17dGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2h9XG4gICAgICAgIHBhZ2VTaXplPXtQQUdFX1NJWkV9XG4gICAgICAgIHdhaXRUaW1lTXM9e1BBR0lOQVRJT05fV0FJVF9USU1FX01TfT5cbiAgICAgICAge3RoaXMucmVuZGVyUmV2aWV3VGhyZWFkc31cbiAgICAgIDwvQWNjdW11bGF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld1RocmVhZHMgPSAoZXJyLCB0aHJlYWRzLCBsb2FkaW5nKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW4oe1xuICAgICAgICBlcnJvcnM6IFtlcnJdLFxuICAgICAgICBjb21tZW50VGhyZWFkczogW10sXG4gICAgICAgIGxvYWRpbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZW5kZXJSZXZpZXdUaHJlYWQoe2Vycm9yczogW10sIGNvbW1lbnRzQnlUaHJlYWQ6IG5ldyBNYXAoKSwgbG9hZGluZ30sIHRocmVhZHMpO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3VGhyZWFkID0gKHBheWxvYWQsIHRocmVhZHMpID0+IHtcbiAgICBpZiAodGhyZWFkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGNvbW1lbnRUaHJlYWRzID0gW107XG4gICAgICBwYXlsb2FkLmNvbW1lbnRzQnlUaHJlYWQuZm9yRWFjaCgoY29tbWVudHMsIHRocmVhZCkgPT4ge1xuICAgICAgICBjb21tZW50VGhyZWFkcy5wdXNoKHt0aHJlYWQsIGNvbW1lbnRzfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHtcbiAgICAgICAgY29tbWVudFRocmVhZHMsXG4gICAgICAgIGVycm9yczogcGF5bG9hZC5lcnJvcnMsXG4gICAgICAgIGxvYWRpbmc6IHBheWxvYWQubG9hZGluZyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IFt0aHJlYWRdID0gdGhyZWFkcztcbiAgICByZXR1cm4gKFxuICAgICAgPFJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JcbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcmV2aWV3VGhyZWFkPXt0aHJlYWR9PlxuICAgICAgICB7KHtlcnJvciwgY29tbWVudHMsIGxvYWRpbmc6IHRocmVhZExvYWRpbmd9KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGF5bG9hZC5jb21tZW50c0J5VGhyZWFkLnNldCh0aHJlYWQsIGNvbW1lbnRzKTtcbiAgICAgICAgICBwYXlsb2FkLmxvYWRpbmcgPSBwYXlsb2FkLmxvYWRpbmcgfHwgdGhyZWFkTG9hZGluZztcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJSZXZpZXdUaHJlYWQocGF5bG9hZCwgdGhyZWFkcy5zbGljZSgxKSk7XG4gICAgICAgIH19XG4gICAgICA8L1Jldmlld0NvbW1lbnRzQWNjdW11bGF0b3I+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyKEJhcmVSZXZpZXdUaHJlYWRzQWNjdW11bGF0b3IsIHtcbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICB0aHJlYWRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgdGhyZWFkQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNvbW1lbnRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY29tbWVudEN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICB1cmxcbiAgICAgIHJldmlld1RocmVhZHMoXG4gICAgICAgIGZpcnN0OiAkdGhyZWFkQ291bnRcbiAgICAgICAgYWZ0ZXI6ICR0aHJlYWRDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIlJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRzXCIpIHtcbiAgICAgICAgcGFnZUluZm8ge1xuICAgICAgICAgIGhhc05leHRQYWdlXG4gICAgICAgICAgZW5kQ3Vyc29yXG4gICAgICAgIH1cblxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgICAgaXNSZXNvbHZlZFxuICAgICAgICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlXG4gICAgICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcblxuICAgICAgICAgICAgLi4ucmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWQgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgICAgY29tbWVudENvdW50OiAkY29tbWVudENvdW50XG4gICAgICAgICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5wdWxsUmVxdWVzdC5yZXZpZXdUaHJlYWRzO1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRGcmFnbWVudFZhcmlhYmxlcyhwcmV2VmFycywgdG90YWxDb3VudCkge1xuICAgIHJldHVybiB7Li4ucHJldlZhcnMsIHRvdGFsQ291bnR9O1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSwgZnJhZ21lbnRWYXJpYWJsZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBwcm9wcy5wdWxsUmVxdWVzdC51cmwsXG4gICAgICB0aHJlYWRDb3VudDogY291bnQsXG4gICAgICB0aHJlYWRDdXJzb3I6IGN1cnNvcixcbiAgICAgIGNvbW1lbnRDb3VudDogZnJhZ21lbnRWYXJpYWJsZXMuY29tbWVudENvdW50LFxuICAgIH07XG4gIH0sXG4gIHF1ZXJ5OiBncmFwaHFsYFxuICAgIHF1ZXJ5IHJldmlld1RocmVhZHNBY2N1bXVsYXRvclF1ZXJ5KFxuICAgICAgJHVybDogVVJJIVxuICAgICAgJHRocmVhZENvdW50OiBJbnQhXG4gICAgICAkdGhyZWFkQ3Vyc29yOiBTdHJpbmdcbiAgICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICApIHtcbiAgICAgIHJlc291cmNlKHVybDogJHVybCkge1xuICAgICAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xuICAgICAgICAgIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgdGhyZWFkQ291bnQ6ICR0aHJlYWRDb3VudFxuICAgICAgICAgICAgdGhyZWFkQ3Vyc29yOiAkdGhyZWFkQ3Vyc29yXG4gICAgICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==