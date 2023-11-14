"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _donutChart = _interopRequireDefault(require("./donut-chart"));
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class StatusDonutChart extends _react.default.Component {
  render() {
    const slices = ['pending', 'failure', 'success'].reduce((acc, type) => {
      const count = this.props[type];
      if (count > 0) {
        acc.push({
          type,
          className: type,
          count
        });
      }
      return acc;
    }, []);
    return _react.default.createElement(_donutChart.default, _extends({}, (0, _helpers.unusedProps)(this.props, this.constructor.propTypes), {
      slices: slices
    }));
  }
}
exports.default = StatusDonutChart;
_defineProperty(StatusDonutChart, "propTypes", {
  pending: _propTypes.default.number,
  failure: _propTypes.default.number,
  success: _propTypes.default.number
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfZG9udXRDaGFydCIsIl9oZWxwZXJzIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImFzc2lnbiIsImJpbmQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiYXBwbHkiLCJfZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJTdGF0dXNEb251dENoYXJ0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJzbGljZXMiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwiY291bnQiLCJwcm9wcyIsInB1c2giLCJjbGFzc05hbWUiLCJjcmVhdGVFbGVtZW50IiwidW51c2VkUHJvcHMiLCJjb25zdHJ1Y3RvciIsInByb3BUeXBlcyIsImV4cG9ydHMiLCJwZW5kaW5nIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiZmFpbHVyZSIsInN1Y2Nlc3MiXSwic291cmNlcyI6WyJzdGF0dXMtZG9udXQtY2hhcnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgRG9udXRDaGFydCBmcm9tICcuL2RvbnV0LWNoYXJ0JztcblxuaW1wb3J0IHt1bnVzZWRQcm9wc30gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0RvbnV0Q2hhcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHBlbmRpbmc6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgZmFpbHVyZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzdWNjZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHNsaWNlcyA9IFsncGVuZGluZycsICdmYWlsdXJlJywgJ3N1Y2Nlc3MnXS5yZWR1Y2UoKGFjYywgdHlwZSkgPT4ge1xuICAgICAgY29uc3QgY291bnQgPSB0aGlzLnByb3BzW3R5cGVdO1xuICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICBhY2MucHVzaCh7dHlwZSwgY2xhc3NOYW1lOiB0eXBlLCBjb3VudH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG5cbiAgICByZXR1cm4gPERvbnV0Q2hhcnQgey4uLnVudXNlZFByb3BzKHRoaXMucHJvcHMsIHRoaXMuY29uc3RydWN0b3IucHJvcFR5cGVzKX0gc2xpY2VzPXtzbGljZXN9IC8+O1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFdBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFHLFFBQUEsR0FBQUgsT0FBQTtBQUF1QyxTQUFBRCx1QkFBQUssR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFHLFNBQUEsSUFBQUEsUUFBQSxHQUFBQyxNQUFBLENBQUFDLE1BQUEsR0FBQUQsTUFBQSxDQUFBQyxNQUFBLENBQUFDLElBQUEs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