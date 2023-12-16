"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInQiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiciIsImUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJFcnJvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwiYXJncyIsImRlc2NyaXB0aW9uIiwicHJvcHMiLCJwcmVmb3JtYXR0ZWQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVuZGVyIiwidGl0bGUiLCJkZXNjcmlwdGlvbnMiLCJtYXAiLCJyZW5kZXJEZXNjcmlwdGlvbiIsInJldHJ5Iiwib25DbGljayIsImxvZ291dCIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJhcnJheU9mIiwiYm9vbCIsImZ1bmMiXSwic291cmNlcyI6WyJlcnJvci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgcHJlZm9ybWF0dGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIHJldHJ5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2dvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICBkZXNjcmlwdGlvbnM6IFsnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCddLFxuICAgIHByZWZvcm1hdHRlZDogZmFsc2UsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5kZXNjcmlwdGlvbnMubWFwKHRoaXMucmVuZGVyRGVzY3JpcHRpb24pfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYWN0aW9uXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZXRyeSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMucmV0cnl9PlRyeSBBZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxvZ291dCAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tbG9nb3V0XCIgb25DbGljaz17dGhpcy5wcm9wcy5sb2dvdXR9PkxvZ291dDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24sIGtleSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnByZWZvcm1hdHRlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHByZSBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgIDwvcHJlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHAga2V5PXtrZXl9IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3A+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFBbUMsU0FBQUQsdUJBQUFHLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxnQkFBQUgsR0FBQSxFQUFBSSxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBSixHQUFBLElBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixHQUFBLEVBQUFJLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFJLFVBQUEsUUFBQUMsWUFBQSxRQUFBQyxRQUFBLG9CQUFBWCxHQUFBLENBQUFJLEdBQUEsSUFBQUMsS0FBQSxXQUFBTCxHQUFBO0FBQUEsU0FBQU0sZUFBQU0sQ0FBQSxRQUFBQyxDQUFBLEdBQUFDLFlBQUEsQ0FBQUYsQ0FBQSx1Q0FBQUMsQ0FBQSxHQUFBQSxDQUFBLEdBQUFFLE1B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