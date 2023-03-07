"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsImNhbGwiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJFcnJvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwiYXJncyIsImRlc2NyaXB0aW9uIiwicHJvcHMiLCJwcmVmb3JtYXR0ZWQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicmVuZGVyIiwidGl0bGUiLCJkZXNjcmlwdGlvbnMiLCJtYXAiLCJyZW5kZXJEZXNjcmlwdGlvbiIsInJldHJ5Iiwib25DbGljayIsImxvZ291dCIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJhcnJheU9mIiwiYm9vbCIsImZ1bmMiXSwic291cmNlcyI6WyJlcnJvci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgcHJlZm9ybWF0dGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIHJldHJ5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2dvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICBkZXNjcmlwdGlvbnM6IFsnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCddLFxuICAgIHByZWZvcm1hdHRlZDogZmFsc2UsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5kZXNjcmlwdGlvbnMubWFwKHRoaXMucmVuZGVyRGVzY3JpcHRpb24pfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYWN0aW9uXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZXRyeSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMucmV0cnl9PlRyeSBBZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxvZ291dCAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tbG9nb3V0XCIgb25DbGljaz17dGhpcy5wcm9wcy5sb2dvdXR9PkxvZ291dDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24sIGtleSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnByZWZvcm1hdHRlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHByZSBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgIDwvcHJlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHAga2V5PXtrZXl9IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3A+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFBbUMsU0FBQUQsdUJBQUFHLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxnQkFBQUgsR0FBQSxFQUFBSSxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBSixHQUFBLElBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixHQUFBLEVBQUFJLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFJLFVBQUEsUUFBQUMsWUFBQSxRQUFBQyxRQUFBLG9CQUFBWCxHQUFBLENBQUFJLEdBQUEsSUFBQUMsS0FBQSxXQUFBTCxHQUFBO0FBQUEsU0FBQU0sZUFBQU0sR0FBQSxRQUFBUixHQUFBLEdBQUFTLFlBQUEsQ0FBQUQsR0FBQSwy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