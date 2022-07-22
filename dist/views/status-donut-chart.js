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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement(_donutChart.default, _extends({}, (0, _helpers.unusedProps)(this.props, this.constructor.propTypes), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9zdGF0dXMtZG9udXQtY2hhcnQuanMiXSwibmFtZXMiOlsiU3RhdHVzRG9udXRDaGFydCIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwic2xpY2VzIiwicmVkdWNlIiwiYWNjIiwidHlwZSIsImNvdW50IiwicHJvcHMiLCJwdXNoIiwiY2xhc3NOYW1lIiwiY29uc3RydWN0b3IiLCJwcm9wVHlwZXMiLCJwZW5kaW5nIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiZmFpbHVyZSIsInN1Y2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFFZSxNQUFNQSxnQkFBTixTQUErQkMsZUFBTUMsU0FBckMsQ0FBK0M7QUFPNURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLE1BQU0sR0FBRyxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDQyxNQUFsQyxDQUF5QyxDQUFDQyxHQUFELEVBQU1DLElBQU4sS0FBZTtBQUNyRSxZQUFNQyxLQUFLLEdBQUcsS0FBS0MsS0FBTCxDQUFXRixJQUFYLENBQWQ7O0FBQ0EsVUFBSUMsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRixRQUFBQSxHQUFHLENBQUNJLElBQUosQ0FBUztBQUFDSCxVQUFBQSxJQUFEO0FBQU9JLFVBQUFBLFNBQVMsRUFBRUosSUFBbEI7QUFBd0JDLFVBQUFBO0FBQXhCLFNBQVQ7QUFDRDs7QUFDRCxhQUFPRixHQUFQO0FBQ0QsS0FOYyxFQU1aLEVBTlksQ0FBZjtBQVFBLHdCQUFPLDZCQUFDLG1CQUFELGVBQWdCLDBCQUFZLEtBQUtHLEtBQWpCLEVBQXdCLEtBQUtHLFdBQUwsQ0FBaUJDLFNBQXpDLENBQWhCO0FBQXFFLE1BQUEsTUFBTSxFQUFFVDtBQUE3RSxPQUFQO0FBQ0Q7O0FBakIyRDs7OztnQkFBekNKLGdCLGVBQ0E7QUFDakJjLEVBQUFBLE9BQU8sRUFBRUMsbUJBQVVDLE1BREY7QUFFakJDLEVBQUFBLE9BQU8sRUFBRUYsbUJBQVVDLE1BRkY7QUFHakJFLEVBQUFBLE9BQU8sRUFBRUgsbUJBQVVDO0FBSEYsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IERvbnV0Q2hhcnQgZnJvbSAnLi9kb251dC1jaGFydCc7XG5cbmltcG9ydCB7dW51c2VkUHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNEb251dENoYXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBwZW5kaW5nOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGZhaWx1cmU6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc3VjY2VzczogUHJvcFR5cGVzLm51bWJlcixcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzbGljZXMgPSBbJ3BlbmRpbmcnLCAnZmFpbHVyZScsICdzdWNjZXNzJ10ucmVkdWNlKChhY2MsIHR5cGUpID0+IHtcbiAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5wcm9wc1t0eXBlXTtcbiAgICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgICAgYWNjLnB1c2goe3R5cGUsIGNsYXNzTmFtZTogdHlwZSwgY291bnR9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgW10pO1xuXG4gICAgcmV0dXJuIDxEb251dENoYXJ0IHsuLi51bnVzZWRQcm9wcyh0aGlzLnByb3BzLCB0aGlzLmNvbnN0cnVjdG9yLnByb3BUeXBlcyl9IHNsaWNlcz17c2xpY2VzfSAvPjtcbiAgfVxufVxuIl19