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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9zdGF0dXMtZG9udXQtY2hhcnQuanMiXSwibmFtZXMiOlsiU3RhdHVzRG9udXRDaGFydCIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwic2xpY2VzIiwicmVkdWNlIiwiYWNjIiwidHlwZSIsImNvdW50IiwicHJvcHMiLCJwdXNoIiwiY2xhc3NOYW1lIiwiY29uc3RydWN0b3IiLCJwcm9wVHlwZXMiLCJwZW5kaW5nIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiZmFpbHVyZSIsInN1Y2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFFZSxNQUFNQSxnQkFBTixTQUErQkMsZUFBTUMsU0FBckMsQ0FBK0M7QUFPNURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLE1BQU0sR0FBRyxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDQyxNQUFsQyxDQUF5QyxDQUFDQyxHQUFELEVBQU1DLElBQU4sS0FBZTtBQUNyRSxZQUFNQyxLQUFLLEdBQUcsS0FBS0MsS0FBTCxDQUFXRixJQUFYLENBQWQ7O0FBQ0EsVUFBSUMsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiRixRQUFBQSxHQUFHLENBQUNJLElBQUosQ0FBUztBQUFDSCxVQUFBQSxJQUFEO0FBQU9JLFVBQUFBLFNBQVMsRUFBRUosSUFBbEI7QUFBd0JDLFVBQUFBO0FBQXhCLFNBQVQ7QUFDRDs7QUFDRCxhQUFPRixHQUFQO0FBQ0QsS0FOYyxFQU1aLEVBTlksQ0FBZjtBQVFBLFdBQU8sNkJBQUMsbUJBQUQsZUFBZ0IsMEJBQVksS0FBS0csS0FBakIsRUFBd0IsS0FBS0csV0FBTCxDQUFpQkMsU0FBekMsQ0FBaEI7QUFBcUUsTUFBQSxNQUFNLEVBQUVUO0FBQTdFLE9BQVA7QUFDRDs7QUFqQjJEOzs7O2dCQUF6Q0osZ0IsZUFDQTtBQUNqQmMsRUFBQUEsT0FBTyxFQUFFQyxtQkFBVUMsTUFERjtBQUVqQkMsRUFBQUEsT0FBTyxFQUFFRixtQkFBVUMsTUFGRjtBQUdqQkUsRUFBQUEsT0FBTyxFQUFFSCxtQkFBVUM7QUFIRixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgRG9udXRDaGFydCBmcm9tICcuL2RvbnV0LWNoYXJ0JztcblxuaW1wb3J0IHt1bnVzZWRQcm9wc30gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0RvbnV0Q2hhcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHBlbmRpbmc6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgZmFpbHVyZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzdWNjZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHNsaWNlcyA9IFsncGVuZGluZycsICdmYWlsdXJlJywgJ3N1Y2Nlc3MnXS5yZWR1Y2UoKGFjYywgdHlwZSkgPT4ge1xuICAgICAgY29uc3QgY291bnQgPSB0aGlzLnByb3BzW3R5cGVdO1xuICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICBhY2MucHVzaCh7dHlwZSwgY2xhc3NOYW1lOiB0eXBlLCBjb3VudH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG5cbiAgICByZXR1cm4gPERvbnV0Q2hhcnQgey4uLnVudXNlZFByb3BzKHRoaXMucHJvcHMsIHRoaXMuY29uc3RydWN0b3IucHJvcFR5cGVzKX0gc2xpY2VzPXtzbGljZXN9IC8+O1xuICB9XG59XG4iXX0=