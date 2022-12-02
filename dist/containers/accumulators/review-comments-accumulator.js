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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9yZXZpZXctY29tbWVudHMtYWNjdW11bGF0b3IuanMiXSwibmFtZXMiOlsiQmFyZVJldmlld0NvbW1lbnRzQWNjdW11bGF0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlc3VsdEJhdGNoIiwicHJvcHMiLCJyZXZpZXdUaHJlYWQiLCJjb21tZW50cyIsImVkZ2VzIiwibWFwIiwiZWRnZSIsIm5vZGUiLCJyZWxheSIsIm9uRGlkUmVmZXRjaCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiZXJyb3IiLCJsb2FkaW5nIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJzaGFwZSIsImhhc01vcmUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImxvYWRNb3JlIiwiaXNMb2FkaW5nIiwib2JqZWN0IiwiZGlyZWN0aW9uIiwiZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJpZCIsImNvbW1lbnRDb3VudCIsImNvbW1lbnRDdXJzb3IiLCJxdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sTUFBTUEsNkJBQU4sU0FBNENDLGVBQU1DLFNBQWxELENBQTREO0FBcUJqRUMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsV0FBVyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsWUFBWCxDQUF3QkMsUUFBeEIsQ0FBaUNDLEtBQWpDLENBQXVDQyxHQUF2QyxDQUEyQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLElBQXhELENBQXBCO0FBRUEsV0FDRSw2QkFBQyxvQkFBRDtBQUNFLE1BQUEsS0FBSyxFQUFFLEtBQUtOLEtBQUwsQ0FBV08sS0FEcEI7QUFFRSxNQUFBLFdBQVcsRUFBRVIsV0FGZjtBQUdFLE1BQUEsWUFBWSxFQUFFLEtBQUtDLEtBQUwsQ0FBV1EsWUFIM0I7QUFJRSxNQUFBLFFBQVEsRUFBRUMsa0JBSlo7QUFLRSxNQUFBLFVBQVUsRUFBRUM7QUFMZCxPQU1HLENBQUNDLEtBQUQsRUFBUVQsUUFBUixFQUFrQlUsT0FBbEIsS0FBOEIsS0FBS1osS0FBTCxDQUFXYSxRQUFYLENBQW9CO0FBQUNGLE1BQUFBLEtBQUQ7QUFBUVQsTUFBQUEsUUFBUjtBQUFrQlUsTUFBQUE7QUFBbEIsS0FBcEIsQ0FOakMsQ0FERjtBQVVEOztBQWxDZ0U7Ozs7Z0JBQXREakIsNkIsZUFDUTtBQUNqQjtBQUNBWSxFQUFBQSxLQUFLLEVBQUVPLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCQyxJQUFBQSxPQUFPLEVBQUVGLG1CQUFVRyxJQUFWLENBQWVDLFVBREg7QUFFckJDLElBQUFBLFFBQVEsRUFBRUwsbUJBQVVHLElBQVYsQ0FBZUMsVUFGSjtBQUdyQkUsSUFBQUEsU0FBUyxFQUFFTixtQkFBVUcsSUFBVixDQUFlQztBQUhMLEdBQWhCLEVBSUpBLFVBTmM7QUFPakJqQixFQUFBQSxZQUFZLEVBQUVhLG1CQUFVQyxLQUFWLENBQWdCO0FBQzVCYixJQUFBQSxRQUFRLEVBQUUseUNBQ1JZLG1CQUFVTyxNQURGO0FBRGtCLEdBQWhCLENBUEc7QUFhakI7QUFDQVIsRUFBQUEsUUFBUSxFQUFFQyxtQkFBVUcsSUFkSDtBQWdCakI7QUFDQVQsRUFBQUEsWUFBWSxFQUFFTSxtQkFBVUcsSUFBVixDQUFlQztBQWpCWixDOztlQW9DTiwyQ0FBMEJ2Qiw2QkFBMUIsRUFBeUQ7QUFDdEVNLEVBQUFBLFlBQVk7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQwRCxDQUF6RCxFQTRDWjtBQUNEcUIsRUFBQUEsU0FBUyxFQUFFLFNBRFY7O0FBRUQ7QUFDQUMsRUFBQUEsc0JBQXNCLENBQUN2QixLQUFELEVBQVE7QUFDNUIsV0FBT0EsS0FBSyxDQUFDQyxZQUFOLENBQW1CQyxRQUExQjtBQUNELEdBTEE7O0FBTUQ7QUFDQXNCLEVBQUFBLG9CQUFvQixDQUFDQyxRQUFELEVBQVdDLFVBQVgsRUFBdUI7QUFDekMsNkJBQVdELFFBQVg7QUFBcUJDLE1BQUFBO0FBQXJCO0FBQ0QsR0FUQTs7QUFVRDtBQUNBQyxFQUFBQSxZQUFZLENBQUMzQixLQUFELEVBQVE7QUFBQzRCLElBQUFBLEtBQUQ7QUFBUUMsSUFBQUE7QUFBUixHQUFSLEVBQXlCO0FBQ25DLFdBQU87QUFDTEMsTUFBQUEsRUFBRSxFQUFFOUIsS0FBSyxDQUFDQyxZQUFOLENBQW1CNkIsRUFEbEI7QUFFTEMsTUFBQUEsWUFBWSxFQUFFSCxLQUZUO0FBR0xJLE1BQUFBLGFBQWEsRUFBRUg7QUFIVixLQUFQO0FBS0QsR0FqQkE7O0FBa0JESSxFQUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFsQkosQ0E1Q1ksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7UEFHRV9TSVpFLCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi8uLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBY2N1bXVsYXRvciBmcm9tICcuL2FjY3VtdWxhdG9yJztcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSBwcm9wc1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3VGhyZWFkOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY29tbWVudHM6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgKSxcbiAgICB9KSxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoZXJyb3Igb3IgbnVsbCwgYXJyYXkgb2YgYWxsIHJldmlldyBjb21tZW50cywgbG9hZGluZylcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBDYWxsZWQgcmlnaHQgYWZ0ZXIgcmVmZXRjaCBoYXBwZW5zXG4gICAgb25EaWRSZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEJhdGNoID0gdGhpcy5wcm9wcy5yZXZpZXdUaHJlYWQuY29tbWVudHMuZWRnZXMubWFwKGVkZ2UgPT4gZWRnZS5ub2RlKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8QWNjdW11bGF0b3JcbiAgICAgICAgcmVsYXk9e3RoaXMucHJvcHMucmVsYXl9XG4gICAgICAgIHJlc3VsdEJhdGNoPXtyZXN1bHRCYXRjaH1cbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcGFnZVNpemU9e1BBR0VfU0laRX1cbiAgICAgICAgd2FpdFRpbWVNcz17UEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9PlxuICAgICAgICB7KGVycm9yLCBjb21tZW50cywgbG9hZGluZykgPT4gdGhpcy5wcm9wcy5jaGlsZHJlbih7ZXJyb3IsIGNvbW1lbnRzLCBsb2FkaW5nfSl9XG4gICAgICA8L0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvciwge1xuICByZXZpZXdUaHJlYWQ6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWQgb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIGNvbW1lbnRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY29tbWVudEN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9LFxuICAgICkge1xuICAgICAgaWRcbiAgICAgIGNvbW1lbnRzKFxuICAgICAgICBmaXJzdDogJGNvbW1lbnRDb3VudFxuICAgICAgICBhZnRlcjogJGNvbW1lbnRDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIlJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfY29tbWVudHNcIikge1xuICAgICAgICBwYWdlSW5mbyB7XG4gICAgICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgICAgICBlbmRDdXJzb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBjdXJzb3JcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgICBhdXRob3Ige1xuICAgICAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICAgICAgbG9naW5cbiAgICAgICAgICAgICAgdXJsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib2R5SFRNTFxuICAgICAgICAgICAgYm9keVxuICAgICAgICAgICAgaXNNaW5pbWl6ZWRcbiAgICAgICAgICAgIHN0YXRlXG4gICAgICAgICAgICB2aWV3ZXJDYW5SZWFjdFxuICAgICAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgICAgICBwYXRoXG4gICAgICAgICAgICBwb3NpdGlvblxuICAgICAgICAgICAgY3JlYXRlZEF0XG4gICAgICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cbiAgICAgICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnJldmlld1RocmVhZC5jb21tZW50cztcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4gey4uLnByZXZWYXJzLCB0b3RhbENvdW50fTtcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHByb3BzLnJldmlld1RocmVhZC5pZCxcbiAgICAgIGNvbW1lbnRDb3VudDogY291bnQsXG4gICAgICBjb21tZW50Q3Vyc29yOiBjdXJzb3IsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5KFxuICAgICAgJGlkOiBJRCFcbiAgICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICAgICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbiAgICApIHtcbiAgICAgIG5vZGUoaWQ6ICRpZCkge1xuICAgICAgICAuLi4gb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xuICAgICAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkIEBhcmd1bWVudHMoXG4gICAgICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=