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