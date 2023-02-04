"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GithubLoginView extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'handleLoginClick', 'handleCancelTokenClick', 'handleSubmitTokenClick', 'handleSubmitToken', 'handleTokenChange');
    this.state = {
      loggingIn: false,
      token: ''
    };
  }
  render() {
    let subview;
    if (this.state.loggingIn) {
      subview = this.renderTokenInput();
    } else {
      subview = this.renderLogin();
    }
    return _react.default.createElement("div", {
      className: "github-GithubLoginView"
    }, subview);
  }
  renderLogin() {
    return _react.default.createElement("div", {
      className: "github-GithubLoginView-Subview"
    }, _react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mark-github"
    }), _react.default.createElement("h1", null, "Log in to GitHub"), this.props.children, _react.default.createElement("button", {
      onClick: this.handleLoginClick,
      className: "btn btn-primary icon icon-octoface"
    }, "Login"));
  }
  renderTokenInput() {
    return _react.default.createElement("form", {
      className: "github-GithubLoginView-Subview",
      onSubmit: this.handleSubmitToken
    }, _react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mark-github"
    }), _react.default.createElement("h1", null, "Enter Token"), _react.default.createElement("ol", null, _react.default.createElement("li", null, "Visit ", _react.default.createElement("a", {
      href: "https://github.atom.io/login"
    }, "github.atom.io/login"), " to generate an authentication token."), _react.default.createElement("li", null, "Enter the token below:")), _react.default.createElement("input", {
      type: "text",
      className: "input-text native-key-bindings",
      placeholder: "Enter your token...",
      value: this.state.token,
      onChange: this.handleTokenChange
    }), _react.default.createElement("ul", null, _react.default.createElement("li", null, _react.default.createElement("button", {
      type: "button",
      onClick: this.handleCancelTokenClick,
      className: "btn icon icon-remove-close"
    }, "Cancel")), _react.default.createElement("li", null, _react.default.createElement("button", {
      type: "submit",
      onClick: this.handleSubmitTokenClick,
      className: "btn btn-primary icon icon-check"
    }, "Login"))));
  }
  handleLoginClick() {
    this.setState({
      loggingIn: true
    });
  }
  handleCancelTokenClick(e) {
    e.preventDefault();
    this.setState({
      loggingIn: false
    });
  }
  handleSubmitTokenClick(e) {
    e.preventDefault();
    this.handleSubmitToken();
  }
  handleSubmitToken() {
    this.props.onLogin(this.state.token);
  }
  handleTokenChange(e) {
    this.setState({
      token: e.target.value
    });
  }
}
exports.default = GithubLoginView;
_defineProperty(GithubLoginView, "propTypes", {
  children: _propTypes.default.node,
  onLogin: _propTypes.default.func
});
_defineProperty(GithubLoginView, "defaultProps", {
  children: _react.default.createElement("div", {
    className: "initialize-repo-description"
  }, _react.default.createElement("span", null, "Log in to GitHub to access PR information and more!")),
  onLogin: token => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRodWJMb2dpblZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwiYXV0b2JpbmQiLCJzdGF0ZSIsImxvZ2dpbmdJbiIsInRva2VuIiwicmVuZGVyIiwic3VidmlldyIsInJlbmRlclRva2VuSW5wdXQiLCJyZW5kZXJMb2dpbiIsImNoaWxkcmVuIiwiaGFuZGxlTG9naW5DbGljayIsImhhbmRsZVN1Ym1pdFRva2VuIiwiaGFuZGxlVG9rZW5DaGFuZ2UiLCJoYW5kbGVDYW5jZWxUb2tlbkNsaWNrIiwiaGFuZGxlU3VibWl0VG9rZW5DbGljayIsInNldFN0YXRlIiwiZSIsInByZXZlbnREZWZhdWx0Iiwib25Mb2dpbiIsInRhcmdldCIsInZhbHVlIiwiUHJvcFR5cGVzIiwibm9kZSIsImZ1bmMiXSwic291cmNlcyI6WyJnaXRodWItbG9naW4tdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YkxvZ2luVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuICAgIG9uTG9naW46IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjaGlsZHJlbjpcbiAgPGRpdiBjbGFzc05hbWU9XCJpbml0aWFsaXplLXJlcG8tZGVzY3JpcHRpb25cIj5cbiAgICA8c3Bhbj5Mb2cgaW4gdG8gR2l0SHViIHRvIGFjY2VzcyBQUiBpbmZvcm1hdGlvbiBhbmQgbW9yZSE8L3NwYW4+XG4gIDwvZGl2PixcbiAgICBvbkxvZ2luOiB0b2tlbiA9PiB7fSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdoYW5kbGVMb2dpbkNsaWNrJywgJ2hhbmRsZUNhbmNlbFRva2VuQ2xpY2snLCAnaGFuZGxlU3VibWl0VG9rZW5DbGljaycsICdoYW5kbGVTdWJtaXRUb2tlbicsICdoYW5kbGVUb2tlbkNoYW5nZScsXG4gICAgKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbG9nZ2luZ0luOiBmYWxzZSxcbiAgICAgIHRva2VuOiAnJyxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBzdWJ2aWV3O1xuICAgIGlmICh0aGlzLnN0YXRlLmxvZ2dpbmdJbikge1xuICAgICAgc3VidmlldyA9IHRoaXMucmVuZGVyVG9rZW5JbnB1dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJ2aWV3ID0gdGhpcy5yZW5kZXJMb2dpbigpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRodWJMb2dpblZpZXdcIj5cbiAgICAgICAge3N1YnZpZXd9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTG9naW4oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdGh1YkxvZ2luVmlldy1TdWJ2aWV3XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdEh1Yi1MYXJnZUljb24gaWNvbiBpY29uLW1hcmstZ2l0aHViXCIgLz5cbiAgICAgICAgPGgxPkxvZyBpbiB0byBHaXRIdWI8L2gxPlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ2luQ2xpY2t9IGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBpY29uIGljb24tb2N0b2ZhY2VcIj5cbiAgICAgICAgICBMb2dpblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUb2tlbklucHV0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybSBjbGFzc05hbWU9XCJnaXRodWItR2l0aHViTG9naW5WaWV3LVN1YnZpZXdcIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXRUb2tlbn0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdEh1Yi1MYXJnZUljb24gaWNvbiBpY29uLW1hcmstZ2l0aHViXCIgLz5cbiAgICAgICAgPGgxPkVudGVyIFRva2VuPC9oMT5cbiAgICAgICAgPG9sPlxuICAgICAgICAgIDxsaT5WaXNpdCA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuYXRvbS5pby9sb2dpblwiPmdpdGh1Yi5hdG9tLmlvL2xvZ2luPC9hPiB0byBnZW5lcmF0ZVxuICAgICAgICAgIGFuIGF1dGhlbnRpY2F0aW9uIHRva2VuLjwvbGk+XG4gICAgICAgICAgPGxpPkVudGVyIHRoZSB0b2tlbiBiZWxvdzo8L2xpPlxuICAgICAgICA8L29sPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC10ZXh0IG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciB0b2tlbi4uLlwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudG9rZW59XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVG9rZW5DaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDx1bD5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNhbmNlbFRva2VuQ2xpY2t9IGNsYXNzTmFtZT1cImJ0biBpY29uIGljb24tcmVtb3ZlLWNsb3NlXCI+XG4gICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdFRva2VuQ2xpY2t9IGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBpY29uIGljb24tY2hlY2tcIj5cbiAgICAgICAgICAgICAgICBMb2dpblxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTG9naW5DbGljaygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtsb2dnaW5nSW46IHRydWV9KTtcbiAgfVxuXG4gIGhhbmRsZUNhbmNlbFRva2VuQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtsb2dnaW5nSW46IGZhbHNlfSk7XG4gIH1cblxuICBoYW5kbGVTdWJtaXRUb2tlbkNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXRUb2tlbigpO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0VG9rZW4oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkxvZ2luKHRoaXMuc3RhdGUudG9rZW4pO1xuICB9XG5cbiAgaGFuZGxlVG9rZW5DaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Rva2VuOiBlLnRhcmdldC52YWx1ZX0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUFvQztBQUFBO0FBQUE7QUFBQTtBQUVyQixNQUFNQSxlQUFlLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBYzNEQyxXQUFXLENBQUNDLEtBQUssRUFBRUMsT0FB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