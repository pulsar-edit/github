"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Octicon;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* eslint-disable max-len */
const SVG = {
  unlock: {
    viewBox: '0 0 24 16',
    element: _react.default.createElement("path", {
      fillRule: "evenodd",
      d: "m 13.4,13 h -1 v -1 h 1 z m 6,-7 h 1 c 0.55,0 1,0.45 1,1 v 7 c 0,0.55 -0.45,1 -1,1 h -10 c -0.55,0 -1,-0.45 -1,-1 V 7 c 0,-0.55 0.45,-1 1,-1 h 1 V 4.085901 C 11.4,2.1862908 9.8780193,2.4095693 8.904902,2.4143325 8.0404588,2.4185637 6.3689542,2.1882296 6.3689542,4.085901 V 7.4918301 L 4.2521568,7.4509801 4.2930068,4.045051 C 4.3176792,1.987953 5.080245,-0.02206145 8.792353,-0.03403364 13.536238,-0.0493335 13.21,3.1688541 13.21,4.085901 V 6 h -0.01 4.41 m 2.79,1 h -9 v 7 h 9 z m -7,1 h -1 v 1 h 1 z m 0,2 h -1 v 1 h 1 z"
    })
  }
};
/* eslint-enable max-len */

function Octicon(_ref) {
  let {
    icon
  } = _ref,
      others = _objectWithoutProperties(_ref, ["icon"]);

  const classes = (0, _classnames.default)('icon', `icon-${icon}`, others.className);
  const svgContent = SVG[icon];

  if (svgContent) {
    return _react.default.createElement("svg", _extends({}, others, {
      viewBox: svgContent.viewBox,
      xmlns: "http://www.w3.org/2000/svg",
      className: classes
    }), svgContent.element);
  }

  return _react.default.createElement("span", _extends({}, others, {
    className: classes
  }));
}

Octicon.propTypes = {
  icon: _propTypes.default.string.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL29jdGljb24uanMiXSwibmFtZXMiOlsiU1ZHIiwidW5sb2NrIiwidmlld0JveCIsImVsZW1lbnQiLCJPY3RpY29uIiwiaWNvbiIsIm90aGVycyIsImNsYXNzZXMiLCJjbGFzc05hbWUiLCJzdmdDb250ZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUE7QUFDQSxNQUFNQSxHQUFHLEdBQUc7QUFDVkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLE9BQU8sRUFBRSxXQURIO0FBRU5DLElBQUFBLE9BQU8sRUFDTDtBQUNFLE1BQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxNQUFBLENBQUMsRUFBQztBQUZKO0FBSEk7QUFERSxDQUFaO0FBV0E7O0FBRWUsU0FBU0MsT0FBVCxPQUFvQztBQUFBLE1BQW5CO0FBQUNDLElBQUFBO0FBQUQsR0FBbUI7QUFBQSxNQUFUQyxNQUFTOztBQUNqRCxRQUFNQyxPQUFPLEdBQUcseUJBQUcsTUFBSCxFQUFZLFFBQU9GLElBQUssRUFBeEIsRUFBMkJDLE1BQU0sQ0FBQ0UsU0FBbEMsQ0FBaEI7QUFFQSxRQUFNQyxVQUFVLEdBQUdULEdBQUcsQ0FBQ0ssSUFBRCxDQUF0Qjs7QUFDQSxNQUFJSSxVQUFKLEVBQWdCO0FBQ2QsV0FDRSxpREFBU0gsTUFBVDtBQUFpQixNQUFBLE9BQU8sRUFBRUcsVUFBVSxDQUFDUCxPQUFyQztBQUE4QyxNQUFBLEtBQUssRUFBQyw0QkFBcEQ7QUFBaUYsTUFBQSxTQUFTLEVBQUVLO0FBQTVGLFFBQ0dFLFVBQVUsQ0FBQ04sT0FEZCxDQURGO0FBS0Q7O0FBRUQsU0FBTyxrREFBVUcsTUFBVjtBQUFrQixJQUFBLFNBQVMsRUFBRUM7QUFBN0IsS0FBUDtBQUNEOztBQUVESCxPQUFPLENBQUNNLFNBQVIsR0FBb0I7QUFDbEJMLEVBQUFBLElBQUksRUFBRU0sbUJBQVVDLE1BQVYsQ0FBaUJDO0FBREwsQ0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuY29uc3QgU1ZHID0ge1xuICB1bmxvY2s6IHtcbiAgICB2aWV3Qm94OiAnMCAwIDI0IDE2JyxcbiAgICBlbGVtZW50OiAoXG4gICAgICA8cGF0aFxuICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICBkPVwibSAxMy40LDEzIGggLTEgdiAtMSBoIDEgeiBtIDYsLTcgaCAxIGMgMC41NSwwIDEsMC40NSAxLDEgdiA3IGMgMCwwLjU1IC0wLjQ1LDEgLTEsMSBoIC0xMCBjIC0wLjU1LDAgLTEsLTAuNDUgLTEsLTEgViA3IGMgMCwtMC41NSAwLjQ1LC0xIDEsLTEgaCAxIFYgNC4wODU5MDEgQyAxMS40LDIuMTg2MjkwOCA5Ljg3ODAxOTMsMi40MDk1NjkzIDguOTA0OTAyLDIuNDE0MzMyNSA4LjA0MDQ1ODgsMi40MTg1NjM3IDYuMzY4OTU0MiwyLjE4ODIyOTYgNi4zNjg5NTQyLDQuMDg1OTAxIFYgNy40OTE4MzAxIEwgNC4yNTIxNTY4LDcuNDUwOTgwMSA0LjI5MzAwNjgsNC4wNDUwNTEgQyA0LjMxNzY3OTIsMS45ODc5NTMgNS4wODAyNDUsLTAuMDIyMDYxNDUgOC43OTIzNTMsLTAuMDM0MDMzNjQgMTMuNTM2MjM4LC0wLjA0OTMzMzUgMTMuMjEsMy4xNjg4NTQxIDEzLjIxLDQuMDg1OTAxIFYgNiBoIC0wLjAxIDQuNDEgbSAyLjc5LDEgaCAtOSB2IDcgaCA5IHogbSAtNywxIGggLTEgdiAxIGggMSB6IG0gMCwyIGggLTEgdiAxIGggMSB6XCJcbiAgICAgIC8+XG4gICAgKSxcbiAgfSxcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gT2N0aWNvbih7aWNvbiwgLi4ub3RoZXJzfSkge1xuICBjb25zdCBjbGFzc2VzID0gY3goJ2ljb24nLCBgaWNvbi0ke2ljb259YCwgb3RoZXJzLmNsYXNzTmFtZSk7XG5cbiAgY29uc3Qgc3ZnQ29udGVudCA9IFNWR1tpY29uXTtcbiAgaWYgKHN2Z0NvbnRlbnQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyB7Li4ub3RoZXJzfSB2aWV3Qm94PXtzdmdDb250ZW50LnZpZXdCb3h9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzc05hbWU9e2NsYXNzZXN9PlxuICAgICAgICB7c3ZnQ29udGVudC5lbGVtZW50fVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiA8c3BhbiB7Li4ub3RoZXJzfSBjbGFzc05hbWU9e2NsYXNzZXN9IC8+O1xufVxuXG5PY3RpY29uLnByb3BUeXBlcyA9IHtcbiAgaWNvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxufTtcbiJdfQ==