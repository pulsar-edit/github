"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _reporterProxy = require("../reporter-proxy");
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GithubTileView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleClick');
  }
  handleClick() {
    (0, _reporterProxy.addEvent)('click', {
      package: 'github',
      component: 'GithubTileView'
    });
    this.props.didClick();
  }
  render() {
    return _react.default.createElement("button", {
      className: "github-StatusBarTile inline-block",
      onClick: this.handleClick
    }, _react.default.createElement(_octicon.default, {
      icon: "mark-github"
    }), "GitHub");
  }
}
exports.default = GithubTileView;
_defineProperty(GithubTileView, "propTypes", {
  didClick: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRodWJUaWxlVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwiaGFuZGxlQ2xpY2siLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJkaWRDbGljayIsInJlbmRlciIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sInNvdXJjZXMiOlsiZ2l0aHViLXRpbGUtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRodWJUaWxlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZGlkQ2xpY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlQ2xpY2snKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiAnR2l0aHViVGlsZVZpZXcnfSk7XG4gICAgdGhpcy5wcm9wcy5kaWRDbGljaygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGF0dXNCYXJUaWxlIGlubGluZS1ibG9ja1wiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8T2N0aWNvbiBpY29uPVwibWFyay1naXRodWJcIiAvPlxuICAgICAgICBHaXRIdWJcbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFvQztBQUFBO0FBQUE7QUFBQTtBQUVyQixNQUFNQSxjQUFjLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBSzFEQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUFDLGlCQUFRLEVBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQztFQUMvQjtFQUVBQyxXQUFXLEdBQUc7SUFDWixJQUFBQyx1QkFBUSxFQUFDLE9BQU8sRUFBRTtNQUFDQyxPQUFPLEVBQUUsUUFBUTtNQUFFQyxTQUFTLEVBQUU7SUFBZ0IsQ0FBQyxDQUFDO0lBQ25FLElBQUksQ0FBQ0wsS0FBSyxDQUFDTSxRQUFRLEVBQUU7RUFDdkI7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FDRTtNQUNFLFNBQVMsRUFBQyxtQ0FBbUM7TUFDN0MsT0FBTyxFQUFFLElBQUksQ0FBQ0w7SUFBWSxHQUMxQiw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBQztJQUFhLEVBQUcsV0FFdkI7RUFFYjtBQUNGO0FBQUM7QUFBQSxnQkF6Qm9CTixjQUFjLGVBQ2Q7RUFDakJVLFFBQVEsRUFBRUUsa0JBQVMsQ0FBQ0MsSUFBSSxDQUFDQztBQUMzQixDQUFDIn0=