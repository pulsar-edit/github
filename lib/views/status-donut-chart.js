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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdGF0dXNEb251dENoYXJ0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJzbGljZXMiLCJyZWR1Y2UiLCJhY2MiLCJ0eXBlIiwiY291bnQiLCJwcm9wcyIsInB1c2giLCJjbGFzc05hbWUiLCJ1bnVzZWRQcm9wcyIsImNvbnN0cnVjdG9yIiwicHJvcFR5cGVzIiwicGVuZGluZyIsIlByb3BUeXBlcyIsIm51bWJlciIsImZhaWx1cmUiLCJzdWNjZXNzIl0sInNvdXJjZXMiOlsic3RhdHVzLWRvbnV0LWNoYXJ0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IERvbnV0Q2hhcnQgZnJvbSAnLi9kb251dC1jaGFydCc7XG5cbmltcG9ydCB7dW51c2VkUHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNEb251dENoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBwZW5kaW5nOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGZhaWx1cmU6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3VjY2VzczogUHJvcFR5cGVzLm51bWJlcixcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzbGljZXMgPSBbJ3BlbmRpbmcnLCAnZmFpbHVyZScsICdzdWNjZXNzJ10ucmVkdWNlKChhY2MsIHR5cGUpID0+IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5wcm9wc1t0eXBlXTtcbiAgICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgICAgYWNjLnB1c2goe3R5cGUsIGNsYXNzTmFtZTogdHlwZSwgY291bnR9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgW10pO1xuXG4gICAgcmV0dXJuIDxEb251dENoYXJ0IHsuLi51bnVzZWRQcm9wcyh0aGlzLnByb3BzLCB0aGlzLmNvbnN0cnVjdG9yLnByb3BUeXBlcyl9IHNsaWNlcz17c2xpY2VzfSAvPjtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUF1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXhCLE1BQU1BLGdCQUFnQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQU81REMsTUFBTSxHQUFHO0lBQ1AsTUFBTUMsTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUNDLEdBQUcsRUFBRUMsSUFBSSxLQUFLO01BQ3JFLE1BQU1DLEtBQUssR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0YsSUFBSSxDQUFDO01BQzlCLElBQUlDLEtBQUssR0FBRyxDQUFDLEVBQUU7UUFDYkYsR0FBRyxDQUFDSSxJQUFJLENBQUM7VUFBQ0gsSUFBSTtVQUFFSSxTQUFTLEVBQUVKLElBQUk7VUFBRUM7UUFBSyxDQUFDLENBQUM7TUFDMUM7TUFDQSxPQUFPRixHQUFHO0lBQ1osQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUVOLE9BQU8sNkJBQUMsbUJBQVUsZUFBSyxJQUFBTSxvQkFBVyxFQUFDLElBQUksQ0FBQ0gsS0FBSyxFQUFFLElBQUksQ0FBQ0ksV0FBVyxDQUFDQyxTQUFTLENBQUM7TUFBRSxNQUFNLEVBQUVWO0lBQU8sR0FBRztFQUNoRztBQUNGO0FBQUM7QUFBQSxnQkFsQm9CSixnQkFBZ0IsZUFDaEI7RUFDakJlLE9BQU8sRUFBRUMsa0JBQVMsQ0FBQ0MsTUFBTTtFQUN6QkMsT0FBTyxFQUFFRixrQkFBUyxDQUFDQyxNQUFNO0VBQ3pCRSxPQUFPLEVBQUVILGtCQUFTLENBQUNDO0FBQ3JCLENBQUMifQ==