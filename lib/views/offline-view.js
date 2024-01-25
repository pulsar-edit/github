"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfb2N0aWNvbiIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwidCIsImkiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJyIiwiZSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIk9mZmxpbmVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb21wb25lbnREaWRNb3VudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcm9wcyIsInJldHJ5IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImljb24iLCJvbkNsaWNrIiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sInNvdXJjZXMiOlsib2ZmbGluZS12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPZmZsaW5lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmV0cnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUgZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUtbG9nb1wiIGljb249XCJhbGlnbm1lbnQtdW5hbGlnblwiIC8+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+T2ZmbGluZTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIFlvdSBkb24ndCBzZWVtIHRvIGJlIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIFdoZW4geW91J3JlIGJhY2sgb25saW5lLCB3ZSdsbCB0cnkgYWdhaW4uXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWFjdGlvblwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5wcm9wcy5yZXRyeX0+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFB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