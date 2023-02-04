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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ2hlY2tSdW5zQWNjdW11bGF0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlc3VsdEJhdGNoIiwicHJvcHMiLCJjaGVja1N1aXRlIiwiY2hlY2tSdW5zIiwiZWRnZXMiLCJtYXAiLCJlZGdlIiwibm9kZSIsInJlbGF5Iiwib25EaWRSZWZldGNoIiwiUEFHRV9TSVpFIiwiUEFHSU5BVElPTl9XQUlUX1RJTUVfTVMiLCJlcnJvciIsImxvYWRpbmciLCJjaGlsZHJlbiIsIlByb3BUeXBlcyIsInNoYXBlIiwiaGFzTW9yZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwibG9hZE1vcmUiLCJpc0xvYWRpbmciLCJSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZSIsIm9iamVjdCIsImNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJnZXRWYXJpYWJsZXMiLCJjb3VudCIsImN1cnNvciIsImlkIiwiY2hlY2tSdW5Db3VudCIsImNoZWNrUnVuQ3Vyc29yIiwicXVlcnkiXSwic291cmNlcyI6WyJjaGVjay1ydW5zLWFjY3VtdWxhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7UmVsYXlDb25uZWN0aW9uUHJvcFR5cGV9IGZyb20gJy4uLy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtQQUdFX1NJWkUsIFBBR0lOQVRJT05fV0FJVF9USU1FX01TfSBmcm9tICcuLi8uLi9oZWxwZXJzJztcbmltcG9ydCBBY2N1bXVsYXRvciBmcm9tICcuL2FjY3VtdWxhdG9yJztcblxuZXhwb3J0IGNsYXNzIEJhcmVDaGVja1J1bnNBY2N1bXVsYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcHJvcHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhc01vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBsb2FkTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICBjaGVja1N1aXRlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY2hlY2tSdW5zOiBSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZShcbiAgICAgICAgUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICksXG4gICAgfSksXG5cbiAgICAvLyBSZW5kZXIgcHJvcC5cbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIENhbGxlZCB3aGVuIGEgcmVmZXRjaCBpcyB0cmlnZ2VyZWQuXG4gICAgb25EaWRSZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEJhdGNoID0gdGhpcy5wcm9wcy5jaGVja1N1aXRlLmNoZWNrUnVucy5lZGdlcy5tYXAoZWRnZSA9PiBlZGdlLm5vZGUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBY2N1bXVsYXRvclxuICAgICAgICByZWxheT17dGhpcy5wcm9wcy5yZWxheX1cbiAgICAgICAgcmVzdWx0QmF0Y2g9e3Jlc3VsdEJhdGNofVxuICAgICAgICBvbkRpZFJlZmV0Y2g9e3RoaXMucHJvcHMub25EaWRSZWZldGNofVxuICAgICAgICBwYWdlU2l6ZT17UEFHRV9TSVpFfVxuICAgICAgICB3YWl0VGltZU1zPXtQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30+XG4gICAgICAgIHsoZXJyb3IsIGNoZWNrUnVucywgbG9hZGluZykgPT4gdGhpcy5wcm9wcy5jaGlsZHJlbih7ZXJyb3IsIGNoZWNrUnVucywgbG9hZGluZ30pfVxuICAgICAgPC9BY2N1bXVsYXRvcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoQmFyZUNoZWNrUnVuc0FjY3VtdWxhdG9yLCB7XG4gIGNoZWNrU3VpdGU6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSBvbiBDaGVja1N1aXRlXG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICBjaGVja1J1bkNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1J1bkN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICBpZFxuICAgICAgY2hlY2tSdW5zKFxuICAgICAgICBmaXJzdDogJGNoZWNrUnVuQ291bnRcbiAgICAgICAgYWZ0ZXI6ICRjaGVja1J1bkN1cnNvclxuICAgICAgKSBAY29ubmVjdGlvbihrZXk6IFwiQ2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tSdW5zXCIpIHtcbiAgICAgICAgcGFnZUluZm8ge1xuICAgICAgICAgIGhhc05leHRQYWdlXG4gICAgICAgICAgZW5kQ3Vyc29yXG4gICAgICAgIH1cblxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgICAgc3RhdHVzXG4gICAgICAgICAgICBjb25jbHVzaW9uXG5cbiAgICAgICAgICAgIC4uLmNoZWNrUnVuVmlld19jaGVja1J1blxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMuY2hlY2tTdWl0ZS5jaGVja1J1bnM7XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldEZyYWdtZW50VmFyaWFibGVzKHByZXZWYXJzLCB0b3RhbENvdW50KSB7XG4gICAgcmV0dXJuIHsuLi5wcmV2VmFycywgdG90YWxDb3VudH07XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldFZhcmlhYmxlcyhwcm9wcywge2NvdW50LCBjdXJzb3J9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBwcm9wcy5jaGVja1N1aXRlLmlkLFxuICAgICAgY2hlY2tSdW5Db3VudDogY291bnQsXG4gICAgICBjaGVja1J1bkN1cnNvcjogY3Vyc29yLFxuICAgIH07XG4gIH0sXG4gIHF1ZXJ5OiBncmFwaHFsYFxuICAgIHF1ZXJ5IGNoZWNrUnVuc0FjY3VtdWxhdG9yUXVlcnkoXG4gICAgICAkaWQ6IElEIVxuICAgICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICAgICRjaGVja1J1bkN1cnNvcjogU3RyaW5nXG4gICAgKSB7XG4gICAgICBub2RlKGlkOiAkaWQpIHtcbiAgICAgICAgLi4uIG9uIENoZWNrU3VpdGUge1xuICAgICAgICAgIC4uLmNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIGNoZWNrUnVuQ291bnQ6ICRjaGVja1J1bkNvdW50XG4gICAgICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUF3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFakMsTUFBTUEsd0JBQXdCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBcUI1REMsTUFBTSxHQUFHO0lBQ1AsTUFBTUMsV0FBVyxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxVQUFVLENBQUNDLFNBQVMsQ0FBQ0MsS0FBSyxDQUFDQyxHQUFHLENBQUNDLElBQUksSUFBSUEsSUFBSSxDQUFDQyxJQUFJLENBQUM7SUFFaEYsT0FDRSw2QkFBQyxvQkFBVztNQUNWLEtBQUssRUFBRSxJQUFJLENBQUNOLEtBQUssQ0FBQ08sS0FBTTtNQUN4QixXQUFXLEVBQUVSLFdBQVk7TUFDekIsWUFBWSxFQUFFLElBQUksQ0FBQ0MsS0FBSyxDQUFDUSxZQUFhO01BQ3RDLFFBQVEsRUFBRUMsa0JBQVU7TUFDcEIsVUFBVSxFQUFFQztJQUF3QixHQUNuQyxDQUFDQyxLQUFLLEVBQUVULFNBQVMsRUFBRVUsT0FBTyxLQUFLLElBQUksQ0FBQ1osS0FBSyxDQUFDYSxRQUFRLENBQUM7TUFBQ0YsS0FBSztNQUFFVCxTQUFTO01BQUVVO0lBQU8sQ0FBQyxDQUFDLENBQ3BFO0VBRWxCO0FBQ0Y7QUFBQztBQUFBLGdCQW5DWWpCLHdCQUF3QixlQUNoQjtFQUNqQjtFQUNBWSxLQUFLLEVBQUVPLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUNyQkMsT0FBTyxFQUFFRixrQkFBUyxDQUFDRyxJQUFJLENBQUNDLFVBQVU7SUFDbENDLFFBQVEsRUFBRUwsa0JBQVMsQ0FBQ0csSUFBSSxDQUFDQyxVQUFVO0lBQ25DRSxTQUFTLEVBQUVOLGtCQUFTLENBQUNHLElBQUksQ0FBQ0M7RUFDNUIsQ0FBQyxDQUFDO0VBQ0ZqQixVQUFVLEVBQUVhLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUMxQmIsU0FBUyxFQUFFLElBQUFtQixtQ0FBdUIsRUFDaENQLGtCQUFTLENBQUNRLE1BQU07RUFFcEIsQ0FBQyxDQUFDO0VBRUY7RUFDQVQsUUFBUSxFQUFFQyxrQkFBUyxDQUFDRyxJQUFJLENBQUNDLFVBQVU7RUFFbkM7RUFDQVYsWUFBWSxFQUFFTSxrQkFBUyxDQUFDRyxJQUFJLENBQUNDO0FBQy9CLENBQUM7QUFBQSxlQWtCWSxJQUFBSyxxQ0FBeUIsRUFBQzVCLHdCQUF3QixFQUFFO0VBQ2pFTSxVQUFVO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBNkJaLENBQUMsRUFBRTtFQUNEdUIsU0FBUyxFQUFFLFNBQVM7RUFDcEI7RUFDQUMsc0JBQXNCLENBQUN6QixLQUFLLEVBQUU7SUFDNUIsT0FBT0EsS0FBSyxDQUFDQyxVQUFVLENBQUNDLFNBQVM7RUFDbkMsQ0FBQztFQUNEO0VBQ0F3QixvQkFBb0IsQ0FBQ0MsUUFBUSxFQUFFQyxVQUFVLEVBQUU7SUFDekMseUJBQVdELFFBQVE7TUFBRUM7SUFBVTtFQUNqQyxDQUFDO0VBQ0Q7RUFDQUMsWUFBWSxDQUFDN0IsS0FBSyxFQUFFO0lBQUM4QixLQUFLO0lBQUVDO0VBQU0sQ0FBQyxFQUFFO0lBQ25DLE9BQU87TUFDTEMsRUFBRSxFQUFFaEMsS0FBSyxDQUFDQyxVQUFVLENBQUMrQixFQUFFO01BQ3ZCQyxhQUFhLEVBQUVILEtBQUs7TUFDcEJJLGNBQWMsRUFBRUg7SUFDbEIsQ0FBQztFQUNILENBQUM7RUFDREksS0FBSztJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQWdCUCxDQUFDLENBQUM7QUFBQSJ9