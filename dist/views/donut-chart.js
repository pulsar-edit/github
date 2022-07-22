"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DonutChart extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'renderArc');
  }

  render() {
    const _this$props = this.props,
          {
      slices,
      baseOffset
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["slices", "baseOffset"]); // eslint-disable-line no-unused-vars


    const arcs = this.calculateArcs(slices);
    return /*#__PURE__*/_react.default.createElement("svg", others, arcs.map(this.renderArc));
  }

  calculateArcs(slices) {
    const total = slices.reduce((acc, item) => acc + item.count, 0);
    let lengthSoFar = 0;
    return slices.map(_ref => {
      let {
        count
      } = _ref,
          others = _objectWithoutProperties(_ref, ["count"]);

      const piece = _objectSpread({
        length: count / total * 100,
        position: lengthSoFar
      }, others);

      lengthSoFar += piece.length;
      return piece;
    });
  }

  renderArc({
    length,
    position,
    type,
    className
  }) {
    return /*#__PURE__*/_react.default.createElement("circle", {
      key: type,
      cx: "21",
      cy: "21",
      r: "15.91549430918954",
      fill: "transparent",
      className: `donut-ring-${type}`,
      pathLength: "100",
      strokeWidth: "3",
      strokeDasharray: `${length} ${100 - length}`,
      strokeDashoffset: `${100 - position + this.props.baseOffset}`
    });
  }

}

exports.default = DonutChart;

_defineProperty(DonutChart, "propTypes", {
  baseOffset: _propTypes.default.number,
  slices: _propTypes.default.arrayOf(_propTypes.default.shape({
    type: _propTypes.default.string,
    className: _propTypes.default.string,
    count: _propTypes.default.number
  }))
});

_defineProperty(DonutChart, "defaultProps", {
  baseOffset: 25
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9kb251dC1jaGFydC5qcyJdLCJuYW1lcyI6WyJEb251dENoYXJ0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVuZGVyIiwic2xpY2VzIiwiYmFzZU9mZnNldCIsIm90aGVycyIsImFyY3MiLCJjYWxjdWxhdGVBcmNzIiwibWFwIiwicmVuZGVyQXJjIiwidG90YWwiLCJyZWR1Y2UiLCJhY2MiLCJpdGVtIiwiY291bnQiLCJsZW5ndGhTb0ZhciIsInBpZWNlIiwibGVuZ3RoIiwicG9zaXRpb24iLCJ0eXBlIiwiY2xhc3NOYW1lIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUFnQnREQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsMkJBQVMsSUFBVCxFQUFlLFdBQWY7QUFDRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1Asd0JBQXdDLEtBQUtELEtBQTdDO0FBQUEsVUFBTTtBQUFDRSxNQUFBQSxNQUFEO0FBQVNDLE1BQUFBO0FBQVQsS0FBTjtBQUFBLFVBQThCQyxNQUE5QixtRUFETyxDQUM2Qzs7O0FBQ3BELFVBQU1DLElBQUksR0FBRyxLQUFLQyxhQUFMLENBQW1CSixNQUFuQixDQUFiO0FBRUEsd0JBQ0Usb0NBQVNFLE1BQVQsRUFDR0MsSUFBSSxDQUFDRSxHQUFMLENBQVMsS0FBS0MsU0FBZCxDQURILENBREY7QUFLRDs7QUFFREYsRUFBQUEsYUFBYSxDQUFDSixNQUFELEVBQVM7QUFDcEIsVUFBTU8sS0FBSyxHQUFHUCxNQUFNLENBQUNRLE1BQVAsQ0FBYyxDQUFDQyxHQUFELEVBQU1DLElBQU4sS0FBZUQsR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQXhDLEVBQStDLENBQS9DLENBQWQ7QUFDQSxRQUFJQyxXQUFXLEdBQUcsQ0FBbEI7QUFFQSxXQUFPWixNQUFNLENBQUNLLEdBQVAsQ0FBVyxRQUF3QjtBQUFBLFVBQXZCO0FBQUNNLFFBQUFBO0FBQUQsT0FBdUI7QUFBQSxVQUFaVCxNQUFZOztBQUN4QyxZQUFNVyxLQUFLO0FBQ1RDLFFBQUFBLE1BQU0sRUFBRUgsS0FBSyxHQUFHSixLQUFSLEdBQWdCLEdBRGY7QUFFVFEsUUFBQUEsUUFBUSxFQUFFSDtBQUZELFNBR05WLE1BSE0sQ0FBWDs7QUFLQVUsTUFBQUEsV0FBVyxJQUFJQyxLQUFLLENBQUNDLE1BQXJCO0FBQ0EsYUFBT0QsS0FBUDtBQUNELEtBUk0sQ0FBUDtBQVNEOztBQUVEUCxFQUFBQSxTQUFTLENBQUM7QUFBQ1EsSUFBQUEsTUFBRDtBQUFTQyxJQUFBQSxRQUFUO0FBQW1CQyxJQUFBQSxJQUFuQjtBQUF5QkMsSUFBQUE7QUFBekIsR0FBRCxFQUFzQztBQUM3Qyx3QkFDRTtBQUNFLE1BQUEsR0FBRyxFQUFFRCxJQURQO0FBRUUsTUFBQSxFQUFFLEVBQUMsSUFGTDtBQUdFLE1BQUEsRUFBRSxFQUFDLElBSEw7QUFJRSxNQUFBLENBQUMsRUFBQyxtQkFKSjtBQUtFLE1BQUEsSUFBSSxFQUFDLGFBTFA7QUFNRSxNQUFBLFNBQVMsRUFBRyxjQUFhQSxJQUFLLEVBTmhDO0FBT0UsTUFBQSxVQUFVLEVBQUMsS0FQYjtBQVFFLE1BQUEsV0FBVyxFQUFDLEdBUmQ7QUFTRSxNQUFBLGVBQWUsRUFBRyxHQUFFRixNQUFPLElBQUcsTUFBTUEsTUFBTyxFQVQ3QztBQVVFLE1BQUEsZ0JBQWdCLEVBQUcsR0FBRSxNQUFNQyxRQUFOLEdBQWlCLEtBQUtqQixLQUFMLENBQVdHLFVBQVc7QUFWOUQsTUFERjtBQWNEOztBQTlEcUQ7Ozs7Z0JBQW5DUCxVLGVBQ0E7QUFDakJPLEVBQUFBLFVBQVUsRUFBRWlCLG1CQUFVQyxNQURMO0FBRWpCbkIsRUFBQUEsTUFBTSxFQUFFa0IsbUJBQVVFLE9BQVYsQ0FDTkYsbUJBQVVHLEtBQVYsQ0FBZ0I7QUFDZEwsSUFBQUEsSUFBSSxFQUFFRSxtQkFBVUksTUFERjtBQUVkTCxJQUFBQSxTQUFTLEVBQUVDLG1CQUFVSSxNQUZQO0FBR2RYLElBQUFBLEtBQUssRUFBRU8sbUJBQVVDO0FBSEgsR0FBaEIsQ0FETTtBQUZTLEM7O2dCQURBekIsVSxrQkFZRztBQUNwQk8sRUFBQUEsVUFBVSxFQUFFO0FBRFEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG9udXRDaGFydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYmFzZU9mZnNldDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzbGljZXM6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjb3VudDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIH0pLFxuICAgICksXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGJhc2VPZmZzZXQ6IDI1LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3JlbmRlckFyYycpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtzbGljZXMsIGJhc2VPZmZzZXQsIC4uLm90aGVyc30gPSB0aGlzLnByb3BzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgY29uc3QgYXJjcyA9IHRoaXMuY2FsY3VsYXRlQXJjcyhzbGljZXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgey4uLm90aGVyc30+XG4gICAgICAgIHthcmNzLm1hcCh0aGlzLnJlbmRlckFyYyl9XG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG5cbiAgY2FsY3VsYXRlQXJjcyhzbGljZXMpIHtcbiAgICBjb25zdCB0b3RhbCA9IHNsaWNlcy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5jb3VudCwgMCk7XG4gICAgbGV0IGxlbmd0aFNvRmFyID0gMDtcblxuICAgIHJldHVybiBzbGljZXMubWFwKCh7Y291bnQsIC4uLm90aGVyc30pID0+IHtcbiAgICAgIGNvbnN0IHBpZWNlID0ge1xuICAgICAgICBsZW5ndGg6IGNvdW50IC8gdG90YWwgKiAxMDAsXG4gICAgICAgIHBvc2l0aW9uOiBsZW5ndGhTb0ZhcixcbiAgICAgICAgLi4ub3RoZXJzLFxuICAgICAgfTtcbiAgICAgIGxlbmd0aFNvRmFyICs9IHBpZWNlLmxlbmd0aDtcbiAgICAgIHJldHVybiBwaWVjZTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckFyYyh7bGVuZ3RoLCBwb3NpdGlvbiwgdHlwZSwgY2xhc3NOYW1lfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8Y2lyY2xlXG4gICAgICAgIGtleT17dHlwZX1cbiAgICAgICAgY3g9XCIyMVwiXG4gICAgICAgIGN5PVwiMjFcIlxuICAgICAgICByPVwiMTUuOTE1NDk0MzA5MTg5NTRcIlxuICAgICAgICBmaWxsPVwidHJhbnNwYXJlbnRcIlxuICAgICAgICBjbGFzc05hbWU9e2Bkb251dC1yaW5nLSR7dHlwZX1gfVxuICAgICAgICBwYXRoTGVuZ3RoPVwiMTAwXCJcbiAgICAgICAgc3Ryb2tlV2lkdGg9XCIzXCJcbiAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtgJHtsZW5ndGh9ICR7MTAwIC0gbGVuZ3RofWB9XG4gICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2AkezEwMCAtIHBvc2l0aW9uICsgdGhpcy5wcm9wcy5iYXNlT2Zmc2V0fWB9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==