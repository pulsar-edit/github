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
    element: /*#__PURE__*/_react.default.createElement("path", {
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
    return /*#__PURE__*/_react.default.createElement("svg", _extends({}, others, {
      viewBox: svgContent.viewBox,
      xmlns: "http://www.w3.org/2000/svg",
      className: classes
    }), svgContent.element);
  }

  return /*#__PURE__*/_react.default.createElement("span", _extends({}, others, {
    className: classes
  }));
}

Octicon.propTypes = {
  icon: _propTypes.default.string.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL29jdGljb24uanMiXSwibmFtZXMiOlsiU1ZHIiwidW5sb2NrIiwidmlld0JveCIsImVsZW1lbnQiLCJPY3RpY29uIiwiaWNvbiIsIm90aGVycyIsImNsYXNzZXMiLCJjbGFzc05hbWUiLCJzdmdDb250ZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUE7QUFDQSxNQUFNQSxHQUFHLEdBQUc7QUFDVkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLE9BQU8sRUFBRSxXQURIO0FBRU5DLElBQUFBLE9BQU8sZUFDTDtBQUNFLE1BQUEsUUFBUSxFQUFDLFNBRFg7QUFFRSxNQUFBLENBQUMsRUFBQztBQUZKO0FBSEk7QUFERSxDQUFaO0FBV0E7O0FBRWUsU0FBU0MsT0FBVCxPQUFvQztBQUFBLE1BQW5CO0FBQUNDLElBQUFBO0FBQUQsR0FBbUI7QUFBQSxNQUFUQyxNQUFTOztBQUNqRCxRQUFNQyxPQUFPLEdBQUcseUJBQUcsTUFBSCxFQUFZLFFBQU9GLElBQUssRUFBeEIsRUFBMkJDLE1BQU0sQ0FBQ0UsU0FBbEMsQ0FBaEI7QUFFQSxRQUFNQyxVQUFVLEdBQUdULEdBQUcsQ0FBQ0ssSUFBRCxDQUF0Qjs7QUFDQSxNQUFJSSxVQUFKLEVBQWdCO0FBQ2Qsd0JBQ0UsaURBQVNILE1BQVQ7QUFBaUIsTUFBQSxPQUFPLEVBQUVHLFVBQVUsQ0FBQ1AsT0FBckM7QUFBOEMsTUFBQSxLQUFLLEVBQUMsNEJBQXBEO0FBQWlGLE1BQUEsU0FBUyxFQUFFSztBQUE1RixRQUNHRSxVQUFVLENBQUNOLE9BRGQsQ0FERjtBQUtEOztBQUVELHNCQUFPLGtEQUFVRyxNQUFWO0FBQWtCLElBQUEsU0FBUyxFQUFFQztBQUE3QixLQUFQO0FBQ0Q7O0FBRURILE9BQU8sQ0FBQ00sU0FBUixHQUFvQjtBQUNsQkwsRUFBQUEsSUFBSSxFQUFFTSxtQkFBVUMsTUFBVixDQUFpQkM7QUFETCxDQUFwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5jb25zdCBTVkcgPSB7XG4gIHVubG9jazoge1xuICAgIHZpZXdCb3g6ICcwIDAgMjQgMTYnLFxuICAgIGVsZW1lbnQ6IChcbiAgICAgIDxwYXRoXG4gICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgIGQ9XCJtIDEzLjQsMTMgaCAtMSB2IC0xIGggMSB6IG0gNiwtNyBoIDEgYyAwLjU1LDAgMSwwLjQ1IDEsMSB2IDcgYyAwLDAuNTUgLTAuNDUsMSAtMSwxIGggLTEwIGMgLTAuNTUsMCAtMSwtMC40NSAtMSwtMSBWIDcgYyAwLC0wLjU1IDAuNDUsLTEgMSwtMSBoIDEgViA0LjA4NTkwMSBDIDExLjQsMi4xODYyOTA4IDkuODc4MDE5MywyLjQwOTU2OTMgOC45MDQ5MDIsMi40MTQzMzI1IDguMDQwNDU4OCwyLjQxODU2MzcgNi4zNjg5NTQyLDIuMTg4MjI5NiA2LjM2ODk1NDIsNC4wODU5MDEgViA3LjQ5MTgzMDEgTCA0LjI1MjE1NjgsNy40NTA5ODAxIDQuMjkzMDA2OCw0LjA0NTA1MSBDIDQuMzE3Njc5MiwxLjk4Nzk1MyA1LjA4MDI0NSwtMC4wMjIwNjE0NSA4Ljc5MjM1MywtMC4wMzQwMzM2NCAxMy41MzYyMzgsLTAuMDQ5MzMzNSAxMy4yMSwzLjE2ODg1NDEgMTMuMjEsNC4wODU5MDEgViA2IGggLTAuMDEgNC40MSBtIDIuNzksMSBoIC05IHYgNyBoIDkgeiBtIC03LDEgaCAtMSB2IDEgaCAxIHogbSAwLDIgaCAtMSB2IDEgaCAxIHpcIlxuICAgICAgLz5cbiAgICApLFxuICB9LFxufTtcbi8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBPY3RpY29uKHtpY29uLCAuLi5vdGhlcnN9KSB7XG4gIGNvbnN0IGNsYXNzZXMgPSBjeCgnaWNvbicsIGBpY29uLSR7aWNvbn1gLCBvdGhlcnMuY2xhc3NOYW1lKTtcblxuICBjb25zdCBzdmdDb250ZW50ID0gU1ZHW2ljb25dO1xuICBpZiAoc3ZnQ29udGVudCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIHsuLi5vdGhlcnN9IHZpZXdCb3g9e3N2Z0NvbnRlbnQudmlld0JveH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICAgIHtzdmdDb250ZW50LmVsZW1lbnR9XG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIDxzcGFuIHsuLi5vdGhlcnN9IGNsYXNzTmFtZT17Y2xhc3Nlc30gLz47XG59XG5cbk9jdGljb24ucHJvcFR5cGVzID0ge1xuICBpY29uOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG59O1xuIl19