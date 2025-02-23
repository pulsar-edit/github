"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class OfflineView extends _react.default.Component {
  componentDidMount() {
    window.addEventListener('online', this.props.retry);
  }
  componentWillUnmount() {
    window.removeEventListener('online', this.props.retry);
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-Offline github-Message"
    }, _react.default.createElement("div", {
      className: "github-Message-wrapper"
    }, _react.default.createElement(_octicon.default, {
      className: "github-Offline-logo",
      icon: "alignment-unalign"
    }), _react.default.createElement("h1", {
      className: "github-Message-title"
    }, "Offline"), _react.default.createElement("p", {
      className: "github-Message-description"
    }, "You don't seem to be connected to the Internet. When you're back online, we'll try again."), _react.default.createElement("p", {
      className: "github-Message-action"
    }, _react.default.createElement("button", {
      className: "github-Message-button btn",
      onClick: this.props.retry
    }, "Retry"))));
  }
}
exports.default = OfflineView;
_defineProperty(OfflineView, "propTypes", {
  retry: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfb2N0aWNvbiIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSIsInIiLCJ0IiwiX3RvUHJvcGVydHlLZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiaSIsIl90b1ByaW1pdGl2ZSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiY2FsbCIsIlR5cGVFcnJvciIsIlN0cmluZyIsIk51bWJlciIsIk9mZmxpbmVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb21wb25lbnREaWRNb3VudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcm9wcyIsInJldHJ5IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImljb24iLCJvbkNsaWNrIiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sInNvdXJjZXMiOlsib2ZmbGluZS12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPZmZsaW5lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmV0cnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUgZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUtbG9nb1wiIGljb249XCJhbGlnbm1lbnQtdW5hbGlnblwiIC8+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+T2ZmbGluZTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIFlvdSBkb24ndCBzZWVtIHRvIGJlIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIFdoZW4geW91J3JlIGJhY2sgb25saW5lLCB3ZSdsbCB0cnkgYWdhaW4uXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWFjdGlvblwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5wcm9wcy5yZXRyeX0+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7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