"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckRunsAccumulator = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _propTypes2 = require("../../prop-types");

var _helpers = require("../../helpers");

var _accumulator = _interopRequireDefault(require("./accumulator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCheckRunsAccumulator extends _react.default.Component {
  render() {
    const resultBatch = this.props.checkSuite.checkRuns.edges.map(edge => edge.node);
    return _react.default.createElement(_accumulator.default, {
      relay: this.props.relay,
      resultBatch: resultBatch,
      onDidRefetch: this.props.onDidRefetch,
      pageSize: _helpers.PAGE_SIZE,
      waitTimeMs: _helpers.PAGINATION_WAIT_TIME_MS
    }, (error, checkRuns, loading) => this.props.children({
      error,
      checkRuns,
      loading
    }));
  }

}

exports.BareCheckRunsAccumulator = BareCheckRunsAccumulator;

_defineProperty(BareCheckRunsAccumulator, "propTypes", {
  // Relay props
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }),
  checkSuite: _propTypes.default.shape({
    checkRuns: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.object)
  }),
  // Render prop.
  children: _propTypes.default.func.isRequired,
  // Called when a refetch is triggered.
  onDidRefetch: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createPaginationContainer)(BareCheckRunsAccumulator, {
  checkSuite: function () {
    const node = require("./__generated__/checkRunsAccumulator_checkSuite.graphql");

    if (node.hash && node.hash !== "4a47da672423daae903769141008d468") {
      console.error("The definition of 'checkRunsAccumulator_checkSuite' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkRunsAccumulator_checkSuite.graphql");
  }
}, {
  direction: 'forward',

  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.checkSuite.checkRuns;
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
      id: props.checkSuite.id,
      checkRunCount: count,
      checkRunCursor: cursor
    };
  },

  query: function () {
    const node = require("./__generated__/checkRunsAccumulatorQuery.graphql");

    if (node.hash && node.hash !== "1a2443362a842b9643fe51ecc2d1b53f") {
      console.error("The definition of 'checkRunsAccumulatorQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkRunsAccumulatorQuery.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9jaGVjay1ydW5zLWFjY3VtdWxhdG9yLmpzIl0sIm5hbWVzIjpbIkJhcmVDaGVja1J1bnNBY2N1bXVsYXRvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJwcm9wcyIsImNoZWNrU3VpdGUiLCJjaGVja1J1bnMiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJub2RlIiwicmVsYXkiLCJvbkRpZFJlZmV0Y2giLCJQQUdFX1NJWkUiLCJQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyIsImVycm9yIiwibG9hZGluZyIsImNoaWxkcmVuIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJoYXNNb3JlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJsb2FkTW9yZSIsImlzTG9hZGluZyIsIm9iamVjdCIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJnZXRGcmFnbWVudFZhcmlhYmxlcyIsInByZXZWYXJzIiwidG90YWxDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwiaWQiLCJjaGVja1J1bkNvdW50IiwiY2hlY2tSdW5DdXJzb3IiLCJxdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sTUFBTUEsd0JBQU4sU0FBdUNDLGVBQU1DLFNBQTdDLENBQXVEO0FBcUI1REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsV0FBVyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQkMsU0FBdEIsQ0FBZ0NDLEtBQWhDLENBQXNDQyxHQUF0QyxDQUEwQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLElBQXZELENBQXBCO0FBRUEsV0FDRSw2QkFBQyxvQkFBRDtBQUNFLE1BQUEsS0FBSyxFQUFFLEtBQUtOLEtBQUwsQ0FBV08sS0FEcEI7QUFFRSxNQUFBLFdBQVcsRUFBRVIsV0FGZjtBQUdFLE1BQUEsWUFBWSxFQUFFLEtBQUtDLEtBQUwsQ0FBV1EsWUFIM0I7QUFJRSxNQUFBLFFBQVEsRUFBRUMsa0JBSlo7QUFLRSxNQUFBLFVBQVUsRUFBRUM7QUFMZCxPQU1HLENBQUNDLEtBQUQsRUFBUVQsU0FBUixFQUFtQlUsT0FBbkIsS0FBK0IsS0FBS1osS0FBTCxDQUFXYSxRQUFYLENBQW9CO0FBQUNGLE1BQUFBLEtBQUQ7QUFBUVQsTUFBQUEsU0FBUjtBQUFtQlUsTUFBQUE7QUFBbkIsS0FBcEIsQ0FObEMsQ0FERjtBQVVEOztBQWxDMkQ7Ozs7Z0JBQWpEakIsd0IsZUFDUTtBQUNqQjtBQUNBWSxFQUFBQSxLQUFLLEVBQUVPLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCQyxJQUFBQSxPQUFPLEVBQUVGLG1CQUFVRyxJQUFWLENBQWVDLFVBREg7QUFFckJDLElBQUFBLFFBQVEsRUFBRUwsbUJBQVVHLElBQVYsQ0FBZUMsVUFGSjtBQUdyQkUsSUFBQUEsU0FBUyxFQUFFTixtQkFBVUcsSUFBVixDQUFlQztBQUhMLEdBQWhCLENBRlU7QUFPakJqQixFQUFBQSxVQUFVLEVBQUVhLG1CQUFVQyxLQUFWLENBQWdCO0FBQzFCYixJQUFBQSxTQUFTLEVBQUUseUNBQ1RZLG1CQUFVTyxNQUREO0FBRGUsR0FBaEIsQ0FQSztBQWFqQjtBQUNBUixFQUFBQSxRQUFRLEVBQUVDLG1CQUFVRyxJQUFWLENBQWVDLFVBZFI7QUFnQmpCO0FBQ0FWLEVBQUFBLFlBQVksRUFBRU0sbUJBQVVHLElBQVYsQ0FBZUM7QUFqQlosQzs7ZUFvQ04sMkNBQTBCdkIsd0JBQTFCLEVBQW9EO0FBQ2pFTSxFQUFBQSxVQUFVO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEdUQsQ0FBcEQsRUE4Qlo7QUFDRHFCLEVBQUFBLFNBQVMsRUFBRSxTQURWOztBQUVEO0FBQ0FDLEVBQUFBLHNCQUFzQixDQUFDdkIsS0FBRCxFQUFRO0FBQzVCLFdBQU9BLEtBQUssQ0FBQ0MsVUFBTixDQUFpQkMsU0FBeEI7QUFDRCxHQUxBOztBQU1EO0FBQ0FzQixFQUFBQSxvQkFBb0IsQ0FBQ0MsUUFBRCxFQUFXQyxVQUFYLEVBQXVCO0FBQ3pDLDZCQUFXRCxRQUFYO0FBQXFCQyxNQUFBQTtBQUFyQjtBQUNELEdBVEE7O0FBVUQ7QUFDQUMsRUFBQUEsWUFBWSxDQUFDM0IsS0FBRCxFQUFRO0FBQUM0QixJQUFBQSxLQUFEO0FBQVFDLElBQUFBO0FBQVIsR0FBUixFQUF5QjtBQUNuQyxXQUFPO0FBQ0xDLE1BQUFBLEVBQUUsRUFBRTlCLEtBQUssQ0FBQ0MsVUFBTixDQUFpQjZCLEVBRGhCO0FBRUxDLE1BQUFBLGFBQWEsRUFBRUgsS0FGVjtBQUdMSSxNQUFBQSxjQUFjLEVBQUVIO0FBSFgsS0FBUDtBQUtELEdBakJBOztBQWtCREksRUFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBbEJKLENBOUJZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi8uLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7UEFHRV9TSVpFLCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQgQWNjdW11bGF0b3IgZnJvbSAnLi9hY2N1bXVsYXRvcic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ2hlY2tSdW5zQWNjdW11bGF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHByb3BzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgY2hlY2tTdWl0ZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNoZWNrUnVuczogUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUoXG4gICAgICAgIFByb3BUeXBlcy5vYmplY3QsXG4gICAgICApLFxuICAgIH0pLFxuXG4gICAgLy8gUmVuZGVyIHByb3AuXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDYWxsZWQgd2hlbiBhIHJlZmV0Y2ggaXMgdHJpZ2dlcmVkLlxuICAgIG9uRGlkUmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXN1bHRCYXRjaCA9IHRoaXMucHJvcHMuY2hlY2tTdWl0ZS5jaGVja1J1bnMuZWRnZXMubWFwKGVkZ2UgPT4gZWRnZS5ub2RlKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8QWNjdW11bGF0b3JcbiAgICAgICAgcmVsYXk9e3RoaXMucHJvcHMucmVsYXl9XG4gICAgICAgIHJlc3VsdEJhdGNoPXtyZXN1bHRCYXRjaH1cbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcGFnZVNpemU9e1BBR0VfU0laRX1cbiAgICAgICAgd2FpdFRpbWVNcz17UEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9PlxuICAgICAgICB7KGVycm9yLCBjaGVja1J1bnMsIGxvYWRpbmcpID0+IHRoaXMucHJvcHMuY2hpbGRyZW4oe2Vycm9yLCBjaGVja1J1bnMsIGxvYWRpbmd9KX1cbiAgICAgIDwvQWNjdW11bGF0b3I+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyKEJhcmVDaGVja1J1bnNBY2N1bXVsYXRvciwge1xuICBjaGVja1N1aXRlOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUgb24gQ2hlY2tTdWl0ZVxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgY2hlY2tSdW5Db3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY2hlY2tSdW5DdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgaWRcbiAgICAgIGNoZWNrUnVucyhcbiAgICAgICAgZmlyc3Q6ICRjaGVja1J1bkNvdW50XG4gICAgICAgIGFmdGVyOiAkY2hlY2tSdW5DdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIkNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrUnVuc1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHtcbiAgICAgICAgICBoYXNOZXh0UGFnZVxuICAgICAgICAgIGVuZEN1cnNvclxuICAgICAgICB9XG5cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIHN0YXR1c1xuICAgICAgICAgICAgY29uY2x1c2lvblxuXG4gICAgICAgICAgICAuLi5jaGVja1J1blZpZXdfY2hlY2tSdW5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLmNoZWNrU3VpdGUuY2hlY2tSdW5zO1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRGcmFnbWVudFZhcmlhYmxlcyhwcmV2VmFycywgdG90YWxDb3VudCkge1xuICAgIHJldHVybiB7Li4ucHJldlZhcnMsIHRvdGFsQ291bnR9O1xuICB9LFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogcHJvcHMuY2hlY2tTdWl0ZS5pZCxcbiAgICAgIGNoZWNrUnVuQ291bnQ6IGNvdW50LFxuICAgICAgY2hlY2tSdW5DdXJzb3I6IGN1cnNvcixcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSBjaGVja1J1bnNBY2N1bXVsYXRvclF1ZXJ5KFxuICAgICAgJGlkOiBJRCFcbiAgICAgICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICAgICAkY2hlY2tSdW5DdXJzb3I6IFN0cmluZ1xuICAgICkge1xuICAgICAgbm9kZShpZDogJGlkKSB7XG4gICAgICAgIC4uLiBvbiBDaGVja1N1aXRlIHtcbiAgICAgICAgICAuLi5jaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlIEBhcmd1bWVudHMoXG4gICAgICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICAgICAgY2hlY2tSdW5DdXJzb3I6ICRjaGVja1J1bkN1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19