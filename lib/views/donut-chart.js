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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEb251dENoYXJ0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYXV0b2JpbmQiLCJyZW5kZXIiLCJzbGljZXMiLCJiYXNlT2Zmc2V0Iiwib3RoZXJzIiwiYXJjcyIsImNhbGN1bGF0ZUFyY3MiLCJtYXAiLCJyZW5kZXJBcmMiLCJ0b3RhbCIsInJlZHVjZSIsImFjYyIsIml0ZW0iLCJjb3VudCIsImxlbmd0aFNvRmFyIiwicGllY2UiLCJsZW5ndGgiLCJwb3NpdGlvbiIsInR5cGUiLCJjbGFzc05hbWUiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJhcnJheU9mIiwic2hhcGUiLCJzdHJpbmciXSwic291cmNlcyI6WyJkb251dC1jaGFydC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbnV0Q2hhcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJhc2VPZmZzZXQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc2xpY2VzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB9KSxcbiAgICApLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBiYXNlT2Zmc2V0OiAyNSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJBcmMnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7c2xpY2VzLCBiYXNlT2Zmc2V0LCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIGNvbnN0IGFyY3MgPSB0aGlzLmNhbGN1bGF0ZUFyY3Moc2xpY2VzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIHsuLi5vdGhlcnN9PlxuICAgICAgICB7YXJjcy5tYXAodGhpcy5yZW5kZXJBcmMpfVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUFyY3Moc2xpY2VzKSB7XG4gICAgY29uc3QgdG90YWwgPSBzbGljZXMucmVkdWNlKChhY2MsIGl0ZW0pID0+IGFjYyArIGl0ZW0uY291bnQsIDApO1xuICAgIGxldCBsZW5ndGhTb0ZhciA9IDA7XG5cbiAgICByZXR1cm4gc2xpY2VzLm1hcCgoe2NvdW50LCAuLi5vdGhlcnN9KSA9PiB7XG4gICAgICBjb25zdCBwaWVjZSA9IHtcbiAgICAgICAgbGVuZ3RoOiBjb3VudCAvIHRvdGFsICogMTAwLFxuICAgICAgICBwb3NpdGlvbjogbGVuZ3RoU29GYXIsXG4gICAgICAgIC4uLm90aGVycyxcbiAgICAgIH07XG4gICAgICBsZW5ndGhTb0ZhciArPSBwaWVjZS5sZW5ndGg7XG4gICAgICByZXR1cm4gcGllY2U7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJBcmMoe2xlbmd0aCwgcG9zaXRpb24sIHR5cGUsIGNsYXNzTmFtZX0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGNpcmNsZVxuICAgICAgICBrZXk9e3R5cGV9XG4gICAgICAgIGN4PVwiMjFcIlxuICAgICAgICBjeT1cIjIxXCJcbiAgICAgICAgcj1cIjE1LjkxNTQ5NDMwOTE4OTU0XCJcbiAgICAgICAgZmlsbD1cInRyYW5zcGFyZW50XCJcbiAgICAgICAgY2xhc3NOYW1lPXtgZG9udXQtcmluZy0ke3R5cGV9YH1cbiAgICAgICAgcGF0aExlbmd0aD1cIjEwMFwiXG4gICAgICAgIHN0cm9rZVdpZHRoPVwiM1wiXG4gICAgICAgIHN0cm9rZURhc2hhcnJheT17YCR7bGVuZ3RofSAkezEwMCAtIGxlbmd0aH1gfVxuICAgICAgICBzdHJva2VEYXNob2Zmc2V0PXtgJHsxMDAgLSBwb3NpdGlvbiArIHRoaXMucHJvcHMuYmFzZU9mZnNldH1gfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUFvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXJCLE1BQU1BLFVBQVUsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFnQnREQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUFDLGlCQUFRLEVBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQztFQUM3QjtFQUVBQyxNQUFNLEdBQUc7SUFDUCxvQkFBd0MsSUFBSSxDQUFDRixLQUFLO01BQTVDO1FBQUNHLE1BQU07UUFBRUM7TUFBcUIsQ0FBQztNQUFQQyxNQUFNLG1FQUFlLENBQUM7SUFDcEQsTUFBTUMsSUFBSSxHQUFHLElBQUksQ0FBQ0MsYUFBYSxDQUFDSixNQUFNLENBQUM7SUFFdkMsT0FDRSxvQ0FBU0UsTUFBTSxFQUNaQyxJQUFJLENBQUNFLEdBQUcsQ0FBQyxJQUFJLENBQUNDLFNBQVMsQ0FBQyxDQUNyQjtFQUVWO0VBRUFGLGFBQWEsQ0FBQ0osTUFBTSxFQUFFO0lBQ3BCLE1BQU1PLEtBQUssR0FBR1AsTUFBTSxDQUFDUSxNQUFNLENBQUMsQ0FBQ0MsR0FBRyxFQUFFQyxJQUFJLEtBQUtELEdBQUcsR0FBR0MsSUFBSSxDQUFDQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELElBQUlDLFdBQVcsR0FBRyxDQUFDO0lBRW5CLE9BQU9aLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDLFFBQXdCO01BQUEsSUFBdkI7VUFBQ007UUFBZ0IsQ0FBQztRQUFQVCxNQUFNO01BQ2xDLE1BQU1XLEtBQUs7UUFDVEMsTUFBTSxFQUFFSCxLQUFLLEdBQUdKLEtBQUssR0FBRyxHQUFHO1FBQzNCUSxRQUFRLEVBQUVIO01BQVcsR0FDbEJWLE1BQU0sQ0FDVjtNQUNEVSxXQUFXLElBQUlDLEtBQUssQ0FBQ0MsTUFBTTtNQUMzQixPQUFPRCxLQUFLO0lBQ2QsQ0FBQyxDQUFDO0VBQ0o7RUFFQVAsU0FBUyxDQUFDO0lBQUNRLE1BQU07SUFBRUMsUUFBUTtJQUFFQyxJQUFJO0lBQUVDO0VBQVMsQ0FBQyxFQUFFO0lBQzdDLE9BQ0U7TUFDRSxHQUFHLEVBQUVELElBQUs7TUFDVixFQUFFLEVBQUMsSUFBSTtNQUNQLEVBQUUsRUFBQyxJQUFJO01BQ1AsQ0FBQyxFQUFDLG1CQUFtQjtNQUNyQixJQUFJLEVBQUMsYUFBYTtNQUNsQixTQUFTLEVBQUcsY0FBYUEsSUFBSyxFQUFFO01BQ2hDLFVBQVUsRUFBQyxLQUFLO01BQ2hCLFdBQVcsRUFBQyxHQUFHO01BQ2YsZUFBZSxFQUFHLEdBQUVGLE1BQU8sSUFBRyxHQUFHLEdBQUdBLE1BQU8sRUFBRTtNQUM3QyxnQkFBZ0IsRUFBRyxHQUFFLEdBQUcsR0FBR0MsUUFBUSxHQUFHLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ0ksVUFBVztJQUFFLEVBQzlEO0VBRU47QUFDRjtBQUFDO0FBQUEsZ0JBL0RvQlIsVUFBVSxlQUNWO0VBQ2pCUSxVQUFVLEVBQUVpQixrQkFBUyxDQUFDQyxNQUFNO0VBQzVCbkIsTUFBTSxFQUFFa0Isa0JBQVMsQ0FBQ0UsT0FBTyxDQUN2QkYsa0JBQVMsQ0FBQ0csS0FBSyxDQUFDO0lBQ2RMLElBQUksRUFBRUUsa0JBQVMsQ0FBQ0ksTUFBTTtJQUN0QkwsU0FBUyxFQUFFQyxrQkFBUyxDQUFDSSxNQUFNO0lBQzNCWCxLQUFLLEVBQUVPLGtCQUFTLENBQUNDO0VBQ25CLENBQUMsQ0FBQztBQUVOLENBQUM7QUFBQSxnQkFWa0IxQixVQUFVLGtCQVlQO0VBQ3BCUSxVQUFVLEVBQUU7QUFDZCxDQUFDIn0=