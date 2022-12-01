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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9yZXZpZXctc3VtbWFyaWVzLWFjY3VtdWxhdG9yLmpzIl0sIm5hbWVzIjpbIkJhcmVSZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJwcm9wcyIsInB1bGxSZXF1ZXN0IiwicmV2aWV3cyIsImVkZ2VzIiwibWFwIiwiZWRnZSIsIm5vZGUiLCJyZWxheSIsIm9uRGlkUmVmZXRjaCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiZXJyb3IiLCJyZXN1bHRzIiwibG9hZGluZyIsInN1bW1hcmllcyIsInNvcnQiLCJhIiwiYiIsInN1Ym1pdHRlZEF0IiwibW9tZW50IiwiSVNPXzg2MDEiLCJjaGlsZHJlbiIsIlByb3BUeXBlcyIsInNoYXBlIiwiaGFzTW9yZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwibG9hZE1vcmUiLCJpc0xvYWRpbmciLCJvYmplY3QiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJnZXRWYXJpYWJsZXMiLCJjb3VudCIsImN1cnNvciIsInVybCIsInJldmlld0NvdW50IiwicmV2aWV3Q3Vyc29yIiwicXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLE1BQU1BLDhCQUFOLFNBQTZDQyxlQUFNQyxTQUFuRCxDQUE2RDtBQXFCbEVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLFdBQVcsR0FBRyxLQUFLQyxLQUFMLENBQVdDLFdBQVgsQ0FBdUJDLE9BQXZCLENBQStCQyxLQUEvQixDQUFxQ0MsR0FBckMsQ0FBeUNDLElBQUksSUFBSUEsSUFBSSxDQUFDQyxJQUF0RCxDQUFwQjtBQUVBLFdBQ0UsNkJBQUMsb0JBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRSxLQUFLTixLQUFMLENBQVdPLEtBRHBCO0FBRUUsTUFBQSxXQUFXLEVBQUVSLFdBRmY7QUFHRSxNQUFBLFlBQVksRUFBRSxLQUFLQyxLQUFMLENBQVdRLFlBSDNCO0FBSUUsTUFBQSxRQUFRLEVBQUVDLGtCQUpaO0FBS0UsTUFBQSxVQUFVLEVBQUVDO0FBTGQsT0FNRyxDQUFDQyxLQUFELEVBQVFDLE9BQVIsRUFBaUJDLE9BQWpCLEtBQTZCO0FBQzVCLFlBQU1DLFNBQVMsR0FBR0YsT0FBTyxDQUFDRyxJQUFSLENBQWEsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEtBQzdCLHFCQUFPRCxDQUFDLENBQUNFLFdBQVQsRUFBc0JDLGdCQUFPQyxRQUE3QixJQUF5QyxxQkFBT0gsQ0FBQyxDQUFDQyxXQUFULEVBQXNCQyxnQkFBT0MsUUFBN0IsQ0FEekIsQ0FBbEI7QUFHQSxhQUFPLEtBQUtwQixLQUFMLENBQVdxQixRQUFYLENBQW9CO0FBQUNWLFFBQUFBLEtBQUQ7QUFBUUcsUUFBQUEsU0FBUjtBQUFtQkQsUUFBQUE7QUFBbkIsT0FBcEIsQ0FBUDtBQUNELEtBWEgsQ0FERjtBQWVEOztBQXZDaUU7Ozs7Z0JBQXZEbEIsOEIsZUFDUTtBQUNqQjtBQUNBWSxFQUFBQSxLQUFLLEVBQUVlLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCQyxJQUFBQSxPQUFPLEVBQUVGLG1CQUFVRyxJQUFWLENBQWVDLFVBREg7QUFFckJDLElBQUFBLFFBQVEsRUFBRUwsbUJBQVVHLElBQVYsQ0FBZUMsVUFGSjtBQUdyQkUsSUFBQUEsU0FBUyxFQUFFTixtQkFBVUcsSUFBVixDQUFlQztBQUhMLEdBQWhCLEVBSUpBLFVBTmM7QUFPakJ6QixFQUFBQSxXQUFXLEVBQUVxQixtQkFBVUMsS0FBVixDQUFnQjtBQUMzQnJCLElBQUFBLE9BQU8sRUFBRSx5Q0FDUG9CLG1CQUFVTyxNQURIO0FBRGtCLEdBQWhCLENBUEk7QUFhakI7QUFDQVIsRUFBQUEsUUFBUSxFQUFFQyxtQkFBVUcsSUFBVixDQUFlQyxVQWRSO0FBZ0JqQjtBQUNBbEIsRUFBQUEsWUFBWSxFQUFFYyxtQkFBVUcsSUFBVixDQUFlQztBQWpCWixDOztlQXlDTiwyQ0FBMEIvQiw4QkFBMUIsRUFBMEQ7QUFDdkVNLEVBQUFBLFdBQVc7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQ0RCxDQUExRCxFQXdDWjtBQUNENkIsRUFBQUEsU0FBUyxFQUFFLFNBRFY7O0FBRUQ7QUFDQUMsRUFBQUEsc0JBQXNCLENBQUMvQixLQUFELEVBQVE7QUFDNUIsV0FBT0EsS0FBSyxDQUFDQyxXQUFOLENBQWtCQyxPQUF6QjtBQUNELEdBTEE7O0FBTUQ7QUFDQThCLEVBQUFBLG9CQUFvQixDQUFDQyxRQUFELEVBQVdDLFVBQVgsRUFBdUI7QUFDekMsNkJBQVdELFFBQVg7QUFBcUJDLE1BQUFBO0FBQXJCO0FBQ0QsR0FUQTs7QUFVRDtBQUNBQyxFQUFBQSxZQUFZLENBQUNuQyxLQUFELEVBQVE7QUFBQ29DLElBQUFBLEtBQUQ7QUFBUUMsSUFBQUE7QUFBUixHQUFSLEVBQXlCO0FBQ25DLFdBQU87QUFDTEMsTUFBQUEsR0FBRyxFQUFFdEMsS0FBSyxDQUFDQyxXQUFOLENBQWtCcUMsR0FEbEI7QUFFTEMsTUFBQUEsV0FBVyxFQUFFSCxLQUZSO0FBR0xJLE1BQUFBLFlBQVksRUFBRUg7QUFIVCxLQUFQO0FBS0QsR0FqQkE7O0FBa0JESSxFQUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFsQkosQ0F4Q1ksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7UEFHRV9TSVpFLCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi8uLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBY2N1bXVsYXRvciBmcm9tICcuL2FjY3VtdWxhdG9yJztcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcHJvcHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhc01vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBsb2FkTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcmV2aWV3czogUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUoXG4gICAgICAgIFByb3BUeXBlcy5vYmplY3QsXG4gICAgICApLFxuICAgIH0pLFxuXG4gICAgLy8gUmVuZGVyIHByb3AuIENhbGxlZCB3aXRoIHtlcnJvcjogZXJyb3Igb3IgbnVsbCwgc3VtbWFyaWVzOiBhcnJheSBvZiBhbGwgcmV2aWV3cywgbG9hZGluZ31cbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIENhbGxlZCByaWdodCBhZnRlciByZWZldGNoIGhhcHBlbnNcbiAgICBvbkRpZFJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVzdWx0QmF0Y2ggPSB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LnJldmlld3MuZWRnZXMubWFwKGVkZ2UgPT4gZWRnZS5ub2RlKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8QWNjdW11bGF0b3JcbiAgICAgICAgcmVsYXk9e3RoaXMucHJvcHMucmVsYXl9XG4gICAgICAgIHJlc3VsdEJhdGNoPXtyZXN1bHRCYXRjaH1cbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcGFnZVNpemU9e1BBR0VfU0laRX1cbiAgICAgICAgd2FpdFRpbWVNcz17UEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9PlxuICAgICAgICB7KGVycm9yLCByZXN1bHRzLCBsb2FkaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3VtbWFyaWVzID0gcmVzdWx0cy5zb3J0KChhLCBiKSA9PlxuICAgICAgICAgICAgbW9tZW50KGEuc3VibWl0dGVkQXQsIG1vbWVudC5JU09fODYwMSkgLSBtb21lbnQoYi5zdWJtaXR0ZWRBdCwgbW9tZW50LklTT184NjAxKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHtlcnJvciwgc3VtbWFyaWVzLCBsb2FkaW5nfSk7XG4gICAgICAgIH19XG4gICAgICA8L0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3IsIHtcbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3RcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIHJldmlld0NvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICByZXZpZXdDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifSxcbiAgICApIHtcbiAgICAgIHVybFxuICAgICAgcmV2aWV3cyhcbiAgICAgICAgZmlyc3Q6ICRyZXZpZXdDb3VudFxuICAgICAgICBhZnRlcjogJHJldmlld0N1cnNvclxuICAgICAgKSBAY29ubmVjdGlvbihrZXk6IFwiUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcmV2aWV3c1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHtcbiAgICAgICAgICBoYXNOZXh0UGFnZVxuICAgICAgICAgIGVuZEN1cnNvclxuICAgICAgICB9XG5cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIGJvZHlcbiAgICAgICAgICAgIGJvZHlIVE1MXG4gICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICAgc3VibWl0dGVkQXRcbiAgICAgICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICAgICAgdXJsXG4gICAgICAgICAgICBhdXRob3Ige1xuICAgICAgICAgICAgICBsb2dpblxuICAgICAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICAgICAgdXJsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcbiAgICAgICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5wdWxsUmVxdWVzdC5yZXZpZXdzO1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRGcmFnbWVudFZhcmlhYmxlcyhwcmV2VmFycywgdG90YWxDb3VudCkge1xuICAgIHJldHVybiB7Li4ucHJldlZhcnMsIHRvdGFsQ291bnR9O1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6IHByb3BzLnB1bGxSZXF1ZXN0LnVybCxcbiAgICAgIHJldmlld0NvdW50OiBjb3VudCxcbiAgICAgIHJldmlld0N1cnNvcjogY3Vyc29yLFxuICAgIH07XG4gIH0sXG4gIHF1ZXJ5OiBncmFwaHFsYFxuICAgIHF1ZXJ5IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yUXVlcnkoXG4gICAgICAkdXJsOiBVUkkhXG4gICAgICAkcmV2aWV3Q291bnQ6IEludCFcbiAgICAgICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xuICAgICkge1xuICAgICAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgICAgIC4uLiBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICAgICAgLi4ucmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIHJldmlld0NvdW50OiAkcmV2aWV3Q291bnRcbiAgICAgICAgICAgIHJldmlld0N1cnNvcjogJHJldmlld0N1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19