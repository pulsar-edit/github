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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfb2N0aWNvbiIsIl9yZXBvcnRlclByb3h5IiwiX2hlbHBlcnMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJyIiwidCIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImkiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJHaXRodWJUaWxlVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwiaGFuZGxlQ2xpY2siLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJkaWRDbGljayIsInJlbmRlciIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJvbkNsaWNrIiwiaWNvbiIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbImdpdGh1Yi10aWxlLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViVGlsZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGRpZENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZUNsaWNrJyk7XG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogJ0dpdGh1YlRpbGVWaWV3J30pO1xuICAgIHRoaXMucHJvcHMuZGlkQ2xpY2soKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhdHVzQmFyVGlsZSBpbmxpbmUtYmxvY2tcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPE9jdGljb24gaWNvbj1cIm1hcmstZ2l0aHViXCIgLz5cbiAgICAgICAgR2l0SHViXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFHLGNBQUEsR0FBQUgsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUosT0FBQTtBQUFvQyxTQUFBRCx1QkFBQU0sQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLEtBQUFFLE9BQUEsRUFBQUYsQ0FBQTtBQUFBLFNBQUFHLGdCQUFBSCxDQUFBLEVBQUFJLENBQUEsRUFBQUMsQ0FBQSxZQUFBRCxDQUFBLEdBQUFFLGNBQUEsQ0FBQUYsQ0FBQSxNQUFBSixDQUFBLEdBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixDQUFBLEVBQUFJLENBQUEsSUFBQUssS0FBQSxFQUFBSixDQUFBLEVBQUFLLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFVBQUFaLENBQUEsQ0FBQUksQ0FBQSxJQUFBQyxDQUFBLEVBQUFMLENBQUE7QUFBQSxTQUFBTSxlQUFBRCxDQUFBLFFBQUFRLENBQUEsR0FBQUMsWUFBQSxDQUFBVCxDQUFBLHVDQUFBUSxDQUFBLEdBQUFBLENBQUEsR0FBQUEsQ0FBQTtBQUFBLFNBQUFDLGFBQUFULENBQUEsRUFBQUQsQ0FBQSwyQkFBQUMsQ0FBQSxLQUFBQSxDQUFBLFNBQUFBLENBQUEsTUFBQUwsQ0FBQSxHQUFBSyxDQUFBLENBQUFVLE1BQUEsQ0FBQUMsV0FBQSxrQkFBQWhCLENBQUEsUUFBQWEsQ0FBQSxHQUFBYixDQUFBLENBQUFpQixJQUFBLENBQUFaLENBQUEsRUFBQUQsQ0FBQSx1Q0FBQVMsQ0FBQSxTQUFBQSxDQUFBLFlBQUFLLFNBQUEseUVBQUFkLENBQUEsR0FBQWUsTUFBQSxHQUFBQyxNQUFBLEVBQUFmLENBQUE7QUFFckIsTUFBTWdCLGNBQWMsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFLMURDLFdBQVdBLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUFDLGlCQUFRLEVBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQztFQUMvQjtFQUVBQyxXQUFXQSxDQUFBLEVBQUc7SUFDWixJQUFBQyx1QkFBUSxFQUFDLE9BQU8sRUFBRTtNQUFDQyxPQUFPLEVBQUUsUUFBUTtNQUFFQyxTQUFTLEVBQUU7SUFBZ0IsQ0FBQyxDQUFDO0lBQ25FLElBQUksQ0FBQ0wsS0FBSyxDQUFDTSxRQUFRLENBQUMsQ0FBQztFQUN2QjtFQUVBQyxNQUFNQSxDQUFBLEVBQUc7SUFDUCxPQUNFdkMsTUFBQSxDQUFBUyxPQUFBLENBQUErQixhQUFBO01BQ0VDLFNBQVMsRUFBQyxtQ0FBbUM7TUFDN0NDLE9BQU8sRUFBRSxJQUFJLENBQUNSO0lBQVksR0FDMUJsQyxNQUFBLENBQUFTLE9BQUEsQ0FBQStCLGFBQUEsQ0FBQ3BDLFFBQUEsQ0FBQUssT0FBTztNQUFDa0MsSUFBSSxFQUFDO0lBQWEsQ0FBRSxDQUFDLFVBRXhCLENBQUM7RUFFYjtBQUNGO0FBQUNDLE9BQUEsQ0FBQW5DLE9BQUEsR0FBQW1CLGNBQUE7QUFBQWxCLGVBQUEsQ0F6Qm9Ca0IsY0FBYyxlQUNkO0VBQ2pCVSxRQUFRLEVBQUVPLGtCQUFTLENBQUNDLElBQUksQ0FBQ0M7QUFDM0IsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==