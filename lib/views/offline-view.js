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
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfb2N0aWNvbiIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIk9mZmxpbmVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb21wb25lbnREaWRNb3VudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcm9wcyIsInJldHJ5IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImljb24iLCJvbkNsaWNrIiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sInNvdXJjZXMiOlsib2ZmbGluZS12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPZmZsaW5lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmV0cnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUgZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUtbG9nb1wiIGljb249XCJhbGlnbm1lbnQtdW5hbGlnblwiIC8+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+T2ZmbGluZTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIFlvdSBkb24ndCBzZWVtIHRvIGJlIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIFdoZW4geW91J3JlIGJhY2sgb25saW5lLCB3ZSdsbCB0cnkgYWdhaW4uXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWFjdGlvblwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5wcm9wcy5yZXRyeX0+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9B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