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
    return _react.default.createElement("svg", others, arcs.map(this.renderArc));
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
    return _react.default.createElement("circle", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9kb251dC1jaGFydC5qcyJdLCJuYW1lcyI6WyJEb251dENoYXJ0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVuZGVyIiwic2xpY2VzIiwiYmFzZU9mZnNldCIsIm90aGVycyIsImFyY3MiLCJjYWxjdWxhdGVBcmNzIiwibWFwIiwicmVuZGVyQXJjIiwidG90YWwiLCJyZWR1Y2UiLCJhY2MiLCJpdGVtIiwiY291bnQiLCJsZW5ndGhTb0ZhciIsInBpZWNlIiwibGVuZ3RoIiwicG9zaXRpb24iLCJ0eXBlIiwiY2xhc3NOYW1lIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUFnQnREQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsMkJBQVMsSUFBVCxFQUFlLFdBQWY7QUFDRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1Asd0JBQXdDLEtBQUtELEtBQTdDO0FBQUEsVUFBTTtBQUFDRSxNQUFBQSxNQUFEO0FBQVNDLE1BQUFBO0FBQVQsS0FBTjtBQUFBLFVBQThCQyxNQUE5QixtRUFETyxDQUM2Qzs7O0FBQ3BELFVBQU1DLElBQUksR0FBRyxLQUFLQyxhQUFMLENBQW1CSixNQUFuQixDQUFiO0FBRUEsV0FDRSxvQ0FBU0UsTUFBVCxFQUNHQyxJQUFJLENBQUNFLEdBQUwsQ0FBUyxLQUFLQyxTQUFkLENBREgsQ0FERjtBQUtEOztBQUVERixFQUFBQSxhQUFhLENBQUNKLE1BQUQsRUFBUztBQUNwQixVQUFNTyxLQUFLLEdBQUdQLE1BQU0sQ0FBQ1EsTUFBUCxDQUFjLENBQUNDLEdBQUQsRUFBTUMsSUFBTixLQUFlRCxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsS0FBeEMsRUFBK0MsQ0FBL0MsQ0FBZDtBQUNBLFFBQUlDLFdBQVcsR0FBRyxDQUFsQjtBQUVBLFdBQU9aLE1BQU0sQ0FBQ0ssR0FBUCxDQUFXLFFBQXdCO0FBQUEsVUFBdkI7QUFBQ00sUUFBQUE7QUFBRCxPQUF1QjtBQUFBLFVBQVpULE1BQVk7O0FBQ3hDLFlBQU1XLEtBQUs7QUFDVEMsUUFBQUEsTUFBTSxFQUFFSCxLQUFLLEdBQUdKLEtBQVIsR0FBZ0IsR0FEZjtBQUVUUSxRQUFBQSxRQUFRLEVBQUVIO0FBRkQsU0FHTlYsTUFITSxDQUFYOztBQUtBVSxNQUFBQSxXQUFXLElBQUlDLEtBQUssQ0FBQ0MsTUFBckI7QUFDQSxhQUFPRCxLQUFQO0FBQ0QsS0FSTSxDQUFQO0FBU0Q7O0FBRURQLEVBQUFBLFNBQVMsQ0FBQztBQUFDUSxJQUFBQSxNQUFEO0FBQVNDLElBQUFBLFFBQVQ7QUFBbUJDLElBQUFBLElBQW5CO0FBQXlCQyxJQUFBQTtBQUF6QixHQUFELEVBQXNDO0FBQzdDLFdBQ0U7QUFDRSxNQUFBLEdBQUcsRUFBRUQsSUFEUDtBQUVFLE1BQUEsRUFBRSxFQUFDLElBRkw7QUFHRSxNQUFBLEVBQUUsRUFBQyxJQUhMO0FBSUUsTUFBQSxDQUFDLEVBQUMsbUJBSko7QUFLRSxNQUFBLElBQUksRUFBQyxhQUxQO0FBTUUsTUFBQSxTQUFTLEVBQUcsY0FBYUEsSUFBSyxFQU5oQztBQU9FLE1BQUEsVUFBVSxFQUFDLEtBUGI7QUFRRSxNQUFBLFdBQVcsRUFBQyxHQVJkO0FBU0UsTUFBQSxlQUFlLEVBQUcsR0FBRUYsTUFBTyxJQUFHLE1BQU1BLE1BQU8sRUFUN0M7QUFVRSxNQUFBLGdCQUFnQixFQUFHLEdBQUUsTUFBTUMsUUFBTixHQUFpQixLQUFLakIsS0FBTCxDQUFXRyxVQUFXO0FBVjlELE1BREY7QUFjRDs7QUE5RHFEOzs7O2dCQUFuQ1AsVSxlQUNBO0FBQ2pCTyxFQUFBQSxVQUFVLEVBQUVpQixtQkFBVUMsTUFETDtBQUVqQm5CLEVBQUFBLE1BQU0sRUFBRWtCLG1CQUFVRSxPQUFWLENBQ05GLG1CQUFVRyxLQUFWLENBQWdCO0FBQ2RMLElBQUFBLElBQUksRUFBRUUsbUJBQVVJLE1BREY7QUFFZEwsSUFBQUEsU0FBUyxFQUFFQyxtQkFBVUksTUFGUDtBQUdkWCxJQUFBQSxLQUFLLEVBQUVPLG1CQUFVQztBQUhILEdBQWhCLENBRE07QUFGUyxDOztnQkFEQXpCLFUsa0JBWUc7QUFDcEJPLEVBQUFBLFVBQVUsRUFBRTtBQURRLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbnV0Q2hhcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJhc2VPZmZzZXQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc2xpY2VzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB9KSxcbiAgICApLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBiYXNlT2Zmc2V0OiAyNSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJBcmMnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7c2xpY2VzLCBiYXNlT2Zmc2V0LCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIGNvbnN0IGFyY3MgPSB0aGlzLmNhbGN1bGF0ZUFyY3Moc2xpY2VzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIHsuLi5vdGhlcnN9PlxuICAgICAgICB7YXJjcy5tYXAodGhpcy5yZW5kZXJBcmMpfVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUFyY3Moc2xpY2VzKSB7XG4gICAgY29uc3QgdG90YWwgPSBzbGljZXMucmVkdWNlKChhY2MsIGl0ZW0pID0+IGFjYyArIGl0ZW0uY291bnQsIDApO1xuICAgIGxldCBsZW5ndGhTb0ZhciA9IDA7XG5cbiAgICByZXR1cm4gc2xpY2VzLm1hcCgoe2NvdW50LCAuLi5vdGhlcnN9KSA9PiB7XG4gICAgICBjb25zdCBwaWVjZSA9IHtcbiAgICAgICAgbGVuZ3RoOiBjb3VudCAvIHRvdGFsICogMTAwLFxuICAgICAgICBwb3NpdGlvbjogbGVuZ3RoU29GYXIsXG4gICAgICAgIC4uLm90aGVycyxcbiAgICAgIH07XG4gICAgICBsZW5ndGhTb0ZhciArPSBwaWVjZS5sZW5ndGg7XG4gICAgICByZXR1cm4gcGllY2U7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJBcmMoe2xlbmd0aCwgcG9zaXRpb24sIHR5cGUsIGNsYXNzTmFtZX0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGNpcmNsZVxuICAgICAgICBrZXk9e3R5cGV9XG4gICAgICAgIGN4PVwiMjFcIlxuICAgICAgICBjeT1cIjIxXCJcbiAgICAgICAgcj1cIjE1LjkxNTQ5NDMwOTE4OTU0XCJcbiAgICAgICAgZmlsbD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgY2xhc3NOYW1lPXtgZG9udXQtcmluZy0ke3R5cGV9YH1cbiAgICAgICAgcGF0aExlbmd0aD1cIjEwMFwiXG4gICAgICAgIHN0cm9rZVdpZHRoPVwiM1wiXG4gICAgICAgIHN0cm9rZURhc2hhcnJheT17YCR7bGVuZ3RofSAkezEwMCAtIGxlbmd0aH1gfVxuICAgICAgICBzdHJva2VEYXNob2Zmc2V0PXtgJHsxMDAgLSBwb3NpdGlvbiArIHRoaXMucHJvcHMuYmFzZU9mZnNldH1gfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=