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
      href: "https://github.com/settings/tokens"
    }, "github.com/settings/tokens"), " to generate a new Personal Access Token (classic).", _react.default.createElement("sup", null, _react.default.createElement("a", {
      href: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic"
    }, "[docs]"))), _react.default.createElement("li", null, "Ensure it has the following permissions: ", _react.default.createElement("code", null, "repo"), ", ", _react.default.createElement("code", null, "workflow"), ", ", _react.default.createElement("code", null, "read:org"), ", and ", _react.default.createElement("code", null, "user:email"), "."), _react.default.createElement("li", null, "Enter the token below:")), _react.default.createElement("input", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfaGVscGVycyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkdpdGh1YkxvZ2luVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJhdXRvYmluZCIsInN0YXRlIiwibG9nZ2luZ0luIiwidG9rZW4iLCJyZW5kZXIiLCJzdWJ2aWV3IiwicmVuZGVyVG9rZW5JbnB1dCIsInJlbmRlckxvZ2luIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImNoaWxkcmVuIiwib25DbGljayIsImhhbmRsZUxvZ2luQ2xpY2siLCJvblN1Ym1pdCIsImhhbmRsZVN1Ym1pdFRva2VuIiwiaHJlZiIsInR5cGUiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwiaGFuZGxlVG9rZW5DaGFuZ2UiLCJoYW5kbGVDYW5jZWxUb2tlbkNsaWNrIiwiaGFuZGxlU3VibWl0VG9rZW5DbGljayIsInNldFN0YXRlIiwiZSIsInByZXZlbnREZWZhdWx0Iiwib25Mb2dpbiIsInRhcmdldCIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJub2RlIiwiZnVuYyJdLCJzb3VyY2VzIjpbImdpdGh1Yi1sb2dpbi12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViTG9naW5WaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG4gICAgb25Mb2dpbjogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNoaWxkcmVuOlxuICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgIDxzcGFuPkxvZyBpbiB0byBHaXRIdWIgdG8gYWNjZXNzIFBSIGluZm9ybWF0aW9uIGFuZCBtb3JlITwvc3Bhbj5cbiAgPC9kaXY+LFxuICAgIG9uTG9naW46IHRva2VuID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2hhbmRsZUxvZ2luQ2xpY2snLCAnaGFuZGxlQ2FuY2VsVG9rZW5DbGljaycsICdoYW5kbGVTdWJtaXRUb2tlbkNsaWNrJywgJ2hhbmRsZVN1Ym1pdFRva2VuJywgJ2hhbmRsZVRva2VuQ2hhbmdlJyxcbiAgICApO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBsb2dnaW5nSW46IGZhbHNlLFxuICAgICAgdG9rZW46ICcnLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHN1YnZpZXc7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9nZ2luZ0luKSB7XG4gICAgICBzdWJ2aWV3ID0gdGhpcy5yZW5kZXJUb2tlbklucHV0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YnZpZXcgPSB0aGlzLnJlbmRlckxvZ2luKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdGh1YkxvZ2luVmlld1wiPlxuICAgICAgICB7c3Vidmlld31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJMb2dpbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0aHViTG9naW5WaWV3LVN1YnZpZXdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLUxhcmdlSWNvbiBpY29uIGljb24tbWFyay1naXRodWJcIiAvPlxuICAgICAgICA8aDE+TG9nIGluIHRvIEdpdEh1YjwvaDE+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTG9naW5DbGlja30gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGljb24gaWNvbi1vY3RvZmFjZVwiPlxuICAgICAgICAgIExvZ2luXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRva2VuSW5wdXQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRodWJMb2dpblZpZXctU3Vidmlld1wiIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdFRva2VufT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLUxhcmdlSWNvbiBpY29uIGljb24tbWFyay1naXRodWJcIiAvPlxuICAgICAgICA8aDE+RW50ZXIgVG9rZW48L2gxPlxuICAgICAgICA8b2w+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgVmlzaXQgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zZXR0aW5ncy90b2tlbnNcIj5naXRodWIuY29tL3NldHRpbmdzL3Rva2VuczwvYT4gdG8gZ2VuZXJhdGUgYSBuZXdcbiAgICAgICAgICAgIFBlcnNvbmFsIEFjY2VzcyBUb2tlbiAoY2xhc3NpYykuPHN1cD48YSBocmVmPVwiaHR0cHM6Ly9kb2NzLmdpdGh1Yi5jb20vZW4vYXV0aGVudGljYXRpb24va2VlcGluZy15b3VyLWFjY291bnQtYW5kLWRhdGEtc2VjdXJlL2NyZWF0aW5nLWEtcGVyc29uYWwtYWNjZXNzLXRva2VuI2NyZWF0aW5nLWEtcGVyc29uYWwtYWNjZXNzLXRva2VuLWNsYXNzaWNcIj5bZG9jc108L2E+PC9zdXA+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICBFbnN1cmUgaXQgaGFzIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbnM6IDxjb2RlPnJlcG88L2NvZGU+LCA8Y29kZT53b3JrZmxvdzwvY29kZT4sIDxjb2RlPnJlYWQ6b3JnPC9jb2RlPiwgYW5kIDxjb2RlPnVzZXI6ZW1haWw8L2NvZGU+LlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPkVudGVyIHRoZSB0b2tlbiBiZWxvdzo8L2xpPlxuICAgICAgICA8L29sPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC10ZXh0IG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciB0b2tlbi4uLlwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudG9rZW59XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVG9rZW5DaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDx1bD5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNhbmNlbFRva2VuQ2xpY2t9IGNsYXNzTmFtZT1cImJ0biBpY29uIGljb24tcmVtb3ZlLWNsb3NlXCI+XG4gICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdFRva2VuQ2xpY2t9IGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBpY29uIGljb24tY2hlY2tcIj5cbiAgICAgICAgICAgICAgICBMb2dpblxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTG9naW5DbGljaygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtsb2dnaW5nSW46IHRydWV9KTtcbiAgfVxuXG4gIGhhbmRsZUNhbmNlbFRva2VuQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtsb2dnaW5nSW46IGZhbHNlfSk7XG4gIH1cblxuICBoYW5kbGVTdWJtaXRUb2tlbkNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXRUb2tlbigpO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0VG9rZW4oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkxvZ2luKHRoaXMuc3RhdGUudG9rZW4pO1xuICB9XG5cbiAgaGFuZGxlVG9rZW5DaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Rva2VuOiBlLnRhcmdldC52YWx1ZX0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFFLFFBQUEsR0FBQUYsT0FBQTtBQUFvQyxTQUFBRCx1QkFBQUksR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxH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