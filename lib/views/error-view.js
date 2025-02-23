"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class ErrorView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderDescription", (description, key) => {
      if (this.props.preformatted) {
        return _react.default.createElement("pre", {
          key: key,
          className: "github-Message-description"
        }, description);
      } else {
        return _react.default.createElement("p", {
          key: key,
          className: "github-Message-description"
        }, description);
      }
    });
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-Message"
    }, _react.default.createElement("div", {
      className: "github-Message-wrapper"
    }, _react.default.createElement("h1", {
      className: "github-Message-title"
    }, this.props.title), this.props.descriptions.map(this.renderDescription), _react.default.createElement("div", {
      className: "github-Message-action"
    }, this.props.retry && _react.default.createElement("button", {
      className: "github-Message-button btn btn-primary",
      onClick: this.props.retry
    }, "Try Again"), this.props.logout && _react.default.createElement("button", {
      className: "github-Message-button btn btn-logout",
      onClick: this.props.logout
    }, "Logout"))));
  }
}
exports.default = ErrorView;
_defineProperty(ErrorView, "propTypes", {
  title: _propTypes.default.string,
  descriptions: _propTypes.default.arrayOf(_propTypes.default.string),
  preformatted: _propTypes.default.bool,
  retry: _propTypes.default.func,
  logout: _propTypes.default.func
});
_defineProperty(ErrorView, "defaultProps", {
  title: 'Error',
  descriptions: ['An unknown error occurred'],
  preformatted: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJyIiwidCIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImkiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJFcnJvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwiYXJncyIsImRlc2NyaXB0aW9uIiwia2V5IiwicHJvcHMiLCJwcmVmb3JtYXR0ZWQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVuZGVyIiwidGl0bGUiLCJkZXNjcmlwdGlvbnMiLCJtYXAiLCJyZW5kZXJEZXNjcmlwdGlvbiIsInJldHJ5Iiwib25DbGljayIsImxvZ291dCIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJhcnJheU9mIiwiYm9vbCIsImZ1bmMiXSwic291cmNlcyI6WyJlcnJvci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgcHJlZm9ybWF0dGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIHJldHJ5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2dvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICBkZXNjcmlwdGlvbnM6IFsnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCddLFxuICAgIHByZWZvcm1hdHRlZDogZmFsc2UsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5kZXNjcmlwdGlvbnMubWFwKHRoaXMucmVuZGVyRGVzY3JpcHRpb24pfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYWN0aW9uXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZXRyeSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMucmV0cnl9PlRyeSBBZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxvZ291dCAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tbG9nb3V0XCIgb25DbGljaz17dGhpcy5wcm9wcy5sb2dvdXR9PkxvZ291dDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24sIGtleSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnByZWZvcm1hdHRlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHByZSBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgIDwvcHJlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHAga2V5PXtrZXl9IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3A+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFBbUMsU0FBQUQsdUJBQUFHLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFBQSxTQUFBRyxnQkFBQUgsQ0FBQSxFQUFBSSxDQUFBLEVBQUFDLENBQUEsWUFBQUQsQ0FBQSxHQUFBRSxjQUFBLENBQUFGLENBQUEsTUFBQUosQ0FBQSxHQUFBTyxNQUFBLENBQUFDLGNBQUEsQ0FBQVIsQ0FBQSxFQUFBSSxDQUFBLElBQUFLLEtBQUEsRUFBQUosQ0FBQSxFQUFBSyxVQUFBLE1BQUFDLFlBQUEsTUFBQUMsUUFBQSxVQUFBWixDQUFBLENBQUFJLENBQUEsSUFBQUMsQ0FBQSxFQUFBTCxDQUFBO0FBQUEsU0FBQU0sZUFBQUQsQ0FBQSxRQUFBUSxDQUFBLEdBQUFDLFlBQUEsQ0FBQVQsQ0FBQSx1Q0FBQVEsQ0FBQSxHQUFBQSxDQUFBLEdBQUFBLENBQUE7QUFBQSxTQUFBQyxhQUFB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