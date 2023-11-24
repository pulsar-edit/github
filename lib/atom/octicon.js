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