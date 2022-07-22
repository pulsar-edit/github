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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareReviewCommentsAccumulator extends _react.default.Component {
  render() {
    const resultBatch = this.props.reviewThread.comments.edges.map(edge => edge.node);
    return /*#__PURE__*/_react.default.createElement(_accumulator.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9yZXZpZXctY29tbWVudHMtYWNjdW11bGF0b3IuanMiXSwibmFtZXMiOlsiQmFyZVJldmlld0NvbW1lbnRzQWNjdW11bGF0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlc3VsdEJhdGNoIiwicHJvcHMiLCJyZXZpZXdUaHJlYWQiLCJjb21tZW50cyIsImVkZ2VzIiwibWFwIiwiZWRnZSIsIm5vZGUiLCJyZWxheSIsIm9uRGlkUmVmZXRjaCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiZXJyb3IiLCJsb2FkaW5nIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJzaGFwZSIsImhhc01vcmUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImxvYWRNb3JlIiwiaXNMb2FkaW5nIiwib2JqZWN0IiwiZGlyZWN0aW9uIiwiZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJpZCIsImNvbW1lbnRDb3VudCIsImNvbW1lbnRDdXJzb3IiLCJxdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sTUFBTUEsNkJBQU4sU0FBNENDLGVBQU1DLFNBQWxELENBQTREO0FBcUJqRUMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsV0FBVyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsWUFBWCxDQUF3QkMsUUFBeEIsQ0FBaUNDLEtBQWpDLENBQXVDQyxHQUF2QyxDQUEyQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLElBQXhELENBQXBCO0FBRUEsd0JBQ0UsNkJBQUMsb0JBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRSxLQUFLTixLQUFMLENBQVdPLEtBRHBCO0FBRUUsTUFBQSxXQUFXLEVBQUVSLFdBRmY7QUFHRSxNQUFBLFlBQVksRUFBRSxLQUFLQyxLQUFMLENBQVdRLFlBSDNCO0FBSUUsTUFBQSxRQUFRLEVBQUVDLGtCQUpaO0FBS0UsTUFBQSxVQUFVLEVBQUVDO0FBTGQsT0FNRyxDQUFDQyxLQUFELEVBQVFULFFBQVIsRUFBa0JVLE9BQWxCLEtBQThCLEtBQUtaLEtBQUwsQ0FBV2EsUUFBWCxDQUFvQjtBQUFDRixNQUFBQSxLQUFEO0FBQVFULE1BQUFBLFFBQVI7QUFBa0JVLE1BQUFBO0FBQWxCLEtBQXBCLENBTmpDLENBREY7QUFVRDs7QUFsQ2dFOzs7O2dCQUF0RGpCLDZCLGVBQ1E7QUFDakI7QUFDQVksRUFBQUEsS0FBSyxFQUFFTyxtQkFBVUMsS0FBVixDQUFnQjtBQUNyQkMsSUFBQUEsT0FBTyxFQUFFRixtQkFBVUcsSUFBVixDQUFlQyxVQURIO0FBRXJCQyxJQUFBQSxRQUFRLEVBQUVMLG1CQUFVRyxJQUFWLENBQWVDLFVBRko7QUFHckJFLElBQUFBLFNBQVMsRUFBRU4sbUJBQVVHLElBQVYsQ0FBZUM7QUFITCxHQUFoQixFQUlKQSxVQU5jO0FBT2pCakIsRUFBQUEsWUFBWSxFQUFFYSxtQkFBVUMsS0FBVixDQUFnQjtBQUM1QmIsSUFBQUEsUUFBUSxFQUFFLHlDQUNSWSxtQkFBVU8sTUFERjtBQURrQixHQUFoQixDQVBHO0FBYWpCO0FBQ0FSLEVBQUFBLFFBQVEsRUFBRUMsbUJBQVVHLElBZEg7QUFnQmpCO0FBQ0FULEVBQUFBLFlBQVksRUFBRU0sbUJBQVVHLElBQVYsQ0FBZUM7QUFqQlosQzs7ZUFvQ04sMkNBQTBCdkIsNkJBQTFCLEVBQXlEO0FBQ3RFTSxFQUFBQSxZQUFZO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEMEQsQ0FBekQsRUE0Q1o7QUFDRHFCLEVBQUFBLFNBQVMsRUFBRSxTQURWOztBQUVEO0FBQ0FDLEVBQUFBLHNCQUFzQixDQUFDdkIsS0FBRCxFQUFRO0FBQzVCLFdBQU9BLEtBQUssQ0FBQ0MsWUFBTixDQUFtQkMsUUFBMUI7QUFDRCxHQUxBOztBQU1EO0FBQ0FzQixFQUFBQSxvQkFBb0IsQ0FBQ0MsUUFBRCxFQUFXQyxVQUFYLEVBQXVCO0FBQ3pDLDZCQUFXRCxRQUFYO0FBQXFCQyxNQUFBQTtBQUFyQjtBQUNELEdBVEE7O0FBVUQ7QUFDQUMsRUFBQUEsWUFBWSxDQUFDM0IsS0FBRCxFQUFRO0FBQUM0QixJQUFBQSxLQUFEO0FBQVFDLElBQUFBO0FBQVIsR0FBUixFQUF5QjtBQUNuQyxXQUFPO0FBQ0xDLE1BQUFBLEVBQUUsRUFBRTlCLEtBQUssQ0FBQ0MsWUFBTixDQUFtQjZCLEVBRGxCO0FBRUxDLE1BQUFBLFlBQVksRUFBRUgsS0FGVDtBQUdMSSxNQUFBQSxhQUFhLEVBQUVIO0FBSFYsS0FBUDtBQUtELEdBakJBOztBQWtCREksRUFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBbEJKLENBNUNZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1BBR0VfU0laRSwgUEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZX0gZnJvbSAnLi4vLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQWNjdW11bGF0b3IgZnJvbSAnLi9hY2N1bXVsYXRvcic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcHJvcHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhc01vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBsb2FkTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHJldmlld1RocmVhZDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbW1lbnRzOiBSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZShcbiAgICAgICAgUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICksXG4gICAgfSksXG5cbiAgICAvLyBSZW5kZXIgcHJvcC4gQ2FsbGVkIHdpdGggKGVycm9yIG9yIG51bGwsIGFycmF5IG9mIGFsbCByZXZpZXcgY29tbWVudHMsIGxvYWRpbmcpXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gQ2FsbGVkIHJpZ2h0IGFmdGVyIHJlZmV0Y2ggaGFwcGVuc1xuICAgIG9uRGlkUmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXN1bHRCYXRjaCA9IHRoaXMucHJvcHMucmV2aWV3VGhyZWFkLmNvbW1lbnRzLmVkZ2VzLm1hcChlZGdlID0+IGVkZ2Uubm9kZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFjY3VtdWxhdG9yXG4gICAgICAgIHJlbGF5PXt0aGlzLnByb3BzLnJlbGF5fVxuICAgICAgICByZXN1bHRCYXRjaD17cmVzdWx0QmF0Y2h9XG4gICAgICAgIG9uRGlkUmVmZXRjaD17dGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2h9XG4gICAgICAgIHBhZ2VTaXplPXtQQUdFX1NJWkV9XG4gICAgICAgIHdhaXRUaW1lTXM9e1BBR0lOQVRJT05fV0FJVF9USU1FX01TfT5cbiAgICAgICAgeyhlcnJvciwgY29tbWVudHMsIGxvYWRpbmcpID0+IHRoaXMucHJvcHMuY2hpbGRyZW4oe2Vycm9yLCBjb21tZW50cywgbG9hZGluZ30pfVxuICAgICAgPC9BY2N1bXVsYXRvcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoQmFyZVJldmlld0NvbW1lbnRzQWNjdW11bGF0b3IsIHtcbiAgcmV2aWV3VGhyZWFkOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkXG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICBjb21tZW50Q291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNvbW1lbnRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifSxcbiAgICApIHtcbiAgICAgIGlkXG4gICAgICBjb21tZW50cyhcbiAgICAgICAgZmlyc3Q6ICRjb21tZW50Q291bnRcbiAgICAgICAgYWZ0ZXI6ICRjb21tZW50Q3Vyc29yXG4gICAgICApIEBjb25uZWN0aW9uKGtleTogXCJSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX2NvbW1lbnRzXCIpIHtcbiAgICAgICAgcGFnZUluZm8ge1xuICAgICAgICAgIGhhc05leHRQYWdlXG4gICAgICAgICAgZW5kQ3Vyc29yXG4gICAgICAgIH1cblxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9keUhUTUxcbiAgICAgICAgICAgIGJvZHlcbiAgICAgICAgICAgIGlzTWluaW1pemVkXG4gICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICAgdmlld2VyQ2FuUmVhY3RcbiAgICAgICAgICAgIHZpZXdlckNhblVwZGF0ZVxuICAgICAgICAgICAgcGF0aFxuICAgICAgICAgICAgcG9zaXRpb25cbiAgICAgICAgICAgIGNyZWF0ZWRBdFxuICAgICAgICAgICAgbGFzdEVkaXRlZEF0XG4gICAgICAgICAgICB1cmxcbiAgICAgICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5yZXZpZXdUaHJlYWQuY29tbWVudHM7XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldEZyYWdtZW50VmFyaWFibGVzKHByZXZWYXJzLCB0b3RhbENvdW50KSB7XG4gICAgcmV0dXJuIHsuLi5wcmV2VmFycywgdG90YWxDb3VudH07XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldFZhcmlhYmxlcyhwcm9wcywge2NvdW50LCBjdXJzb3J9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBwcm9wcy5yZXZpZXdUaHJlYWQuaWQsXG4gICAgICBjb21tZW50Q291bnQ6IGNvdW50LFxuICAgICAgY29tbWVudEN1cnNvcjogY3Vyc29yLFxuICAgIH07XG4gIH0sXG4gIHF1ZXJ5OiBncmFwaHFsYFxuICAgIHF1ZXJ5IHJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JRdWVyeShcbiAgICAgICRpZDogSUQhXG4gICAgICAkY29tbWVudENvdW50OiBJbnQhXG4gICAgICAkY29tbWVudEN1cnNvcjogU3RyaW5nXG4gICAgKSB7XG4gICAgICBub2RlKGlkOiAkaWQpIHtcbiAgICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkIHtcbiAgICAgICAgICAuLi5yZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgY29tbWVudENvdW50OiAkY29tbWVudENvdW50XG4gICAgICAgICAgICBjb21tZW50Q3Vyc29yOiAkY29tbWVudEN1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19