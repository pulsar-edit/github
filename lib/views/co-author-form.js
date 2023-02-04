"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _author = _interopRequireDefault(require("../models/author"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _helpers = require("../helpers");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CoAuthorForm extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'confirm', 'cancel', 'onNameChange', 'onEmailChange', 'validate', 'focusFirstInput');
    this.state = {
      name: this.props.name,
      email: '',
      submitDisabled: true
    };
  }
  componentDidMount() {
    setTimeout(this.focusFirstInput);
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-CoAuthorForm native-key-bindings"
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-CoAuthorForm"
    }, _react.default.createElement(_commands.Command, {
      command: "core:cancel",
      callback: this.cancel
    }), _react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.confirm
    })), _react.default.createElement("label", {
      className: "github-CoAuthorForm-row"
    }, _react.default.createElement("span", {
      className: "github-CoAuthorForm-label"
    }, "Name:"), _react.default.createElement("input", {
      type: "text",
      placeholder: "Co-author name",
      ref: e => this.nameInput = e,
      className: "input-text github-CoAuthorForm-name",
      value: this.state.name,
      onChange: this.onNameChange,
      tabIndex: "1"
    })), _react.default.createElement("label", {
      className: "github-CoAuthorForm-row"
    }, _react.default.createElement("span", {
      className: "github-CoAuthorForm-label"
    }, "Email:"), _react.default.createElement("input", {
      type: "email",
      placeholder: "foo@bar.com",
      ref: e => this.emailInput = e,
      className: "input-text github-CoAuthorForm-email",
      value: this.state.email,
      onChange: this.onEmailChange,
      tabIndex: "2"
    })), _react.default.createElement("footer", {
      className: "github-CoAuthorForm-row has-buttons"
    }, _react.default.createElement("button", {
      className: "btn github-CancelButton",
      tabIndex: "3",
      onClick: this.cancel
    }, "Cancel"), _react.default.createElement("button", {
      className: "btn btn-primary",
      disabled: this.state.submitDisabled,
      tabIndex: "4",
      onClick: this.confirm
    }, "Add Co-Author")));
  }
  confirm() {
    if (this.isInputValid()) {
      this.props.onSubmit(new _author.default(this.state.email, this.state.name));
    }
  }
  cancel() {
    this.props.onCancel();
  }
  onNameChange(e) {
    this.setState({
      name: e.target.value
    }, this.validate);
  }
  onEmailChange(e) {
    this.setState({
      email: e.target.value
    }, this.validate);
  }
  validate() {
    if (this.isInputValid()) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  isInputValid() {
    // email validation with regex has a LOT of corner cases, dawg.
    // https://stackoverflow.com/questions/48055431/can-it-cause-harm-to-validate-email-addresses-with-a-regex
    // to avoid bugs for users with nonstandard email addresses,
    // just check to make sure email address contains `@` and move on with our lives.
    return this.state.name && this.state.email.includes('@');
  }
  focusFirstInput() {
    this.nameInput.focus();
  }
}
exports.default = CoAuthorForm;
_defineProperty(CoAuthorForm, "propTypes", {
  commands: _propTypes.default.object.isRequired,
  onSubmit: _propTypes.default.func,
  onCancel: _propTypes.default.func,
  name: _propTypes.default.string
});
_defineProperty(CoAuthorForm, "defaultProps", {
  onSubmit: () => {},
  onCancel: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb0F1dGhvckZvcm0iLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwiYXV0b2JpbmQiLCJzdGF0ZSIsIm5hbWUiLCJlbWFpbCIsInN1Ym1pdERpc2FibGVkIiwiY29tcG9uZW50RGlkTW91bnQiLCJzZXRUaW1lb3V0IiwiZm9jdXNGaXJzdElucHV0IiwicmVuZGVyIiwiY29tbWFuZHMiLCJjYW5jZWwiLCJjb25maXJtIiwiZSIsIm5hbWVJbnB1dCIsIm9uTmFtZUNoYW5nZSIsImVtYWlsSW5wdXQiLCJvbkVtYWlsQ2hhbmdlIiwiaXNJbnB1dFZhbGlkIiwib25TdWJtaXQiLCJBdXRob3IiLCJvbkNhbmNlbCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJ2YWxpZGF0ZSIsImluY2x1ZGVzIiwiZm9jdXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyJdLCJzb3VyY2VzIjpbImNvLWF1dGhvci1mb3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgQXV0aG9yIGZyb20gJy4uL21vZGVscy9hdXRob3InO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29BdXRob3JGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uU3VibWl0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNhbmNlbDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25TdWJtaXQ6ICgpID0+IHt9LFxuICAgIG9uQ2FuY2VsOiAoKSA9PiB7fSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdjb25maXJtJywgJ2NhbmNlbCcsICdvbk5hbWVDaGFuZ2UnLCAnb25FbWFpbENoYW5nZScsICd2YWxpZGF0ZScsICdmb2N1c0ZpcnN0SW5wdXQnKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBuYW1lOiB0aGlzLnByb3BzLm5hbWUsXG4gICAgICBlbWFpbDogJycsXG4gICAgICBzdWJtaXREaXNhYmxlZDogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgc2V0VGltZW91dCh0aGlzLmZvY3VzRmlyc3RJbnB1dCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvQXV0aG9yRm9ybSBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1Db0F1dGhvckZvcm1cIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjYW5jZWxcIiBjYWxsYmFjaz17dGhpcy5jYW5jZWx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIGNhbGxiYWNrPXt0aGlzLmNvbmZpcm19IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJnaXRodWItQ29BdXRob3JGb3JtLXJvd1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Db0F1dGhvckZvcm0tbGFiZWxcIj5OYW1lOjwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ28tYXV0aG9yIG5hbWVcIlxuICAgICAgICAgICAgcmVmPXtlID0+ICh0aGlzLm5hbWVJbnB1dCA9IGUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtdGV4dCBnaXRodWItQ29BdXRob3JGb3JtLW5hbWVcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uTmFtZUNoYW5nZX1cbiAgICAgICAgICAgIHRhYkluZGV4PVwiMVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1Db0F1dGhvckZvcm0tcm93XCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUNvQXV0aG9yRm9ybS1sYWJlbFwiPkVtYWlsOjwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImZvb0BiYXIuY29tXCJcbiAgICAgICAgICAgIHJlZj17ZSA9PiAodGhpcy5lbWFpbElucHV0ID0gZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC10ZXh0IGdpdGh1Yi1Db0F1dGhvckZvcm0tZW1haWxcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuZW1haWx9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkVtYWlsQ2hhbmdlfVxuICAgICAgICAgICAgdGFiSW5kZXg9XCIyXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Db0F1dGhvckZvcm0tcm93IGhhcy1idXR0b25zXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gZ2l0aHViLUNhbmNlbEJ1dHRvblwiIHRhYkluZGV4PVwiM1wiIG9uQ2xpY2s9e3RoaXMuY2FuY2VsfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXt0aGlzLnN0YXRlLnN1Ym1pdERpc2FibGVkfSB0YWJJbmRleD1cIjRcIiBvbkNsaWNrPXt0aGlzLmNvbmZpcm19PlxuICAgICAgICAgICAgQWRkIENvLUF1dGhvclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb25maXJtKCkge1xuICAgIGlmICh0aGlzLmlzSW5wdXRWYWxpZCgpKSB7XG4gICAgICB0aGlzLnByb3BzLm9uU3VibWl0KG5ldyBBdXRob3IodGhpcy5zdGF0ZS5lbWFpbCwgdGhpcy5zdGF0ZS5uYW1lKSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMucHJvcHMub25DYW5jZWwoKTtcbiAgfVxuXG4gIG9uTmFtZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bmFtZTogZS50YXJnZXQudmFsdWV9LCB0aGlzLnZhbGlkYXRlKTtcbiAgfVxuXG4gIG9uRW1haWxDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2VtYWlsOiBlLnRhcmdldC52YWx1ZX0sIHRoaXMudmFsaWRhdGUpO1xuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNJbnB1dFZhbGlkKCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3N1Ym1pdERpc2FibGVkOiBmYWxzZX0pO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5wdXRWYWxpZCgpIHtcbiAgICAvLyBlbWFpbCB2YWxpZGF0aW9uIHdpdGggcmVnZXggaGFzIGEgTE9UIG9mIGNvcm5lciBjYXNlcywgZGF3Zy5cbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80ODA1NTQzMS9jYW4taXQtY2F1c2UtaGFybS10by12YWxpZGF0ZS1lbWFpbC1hZGRyZXNzZXMtd2l0aC1hLXJlZ2V4XG4gICAgLy8gdG8gYXZvaWQgYnVncyBmb3IgdXNlcnMgd2l0aCBub25zdGFuZGFyZCBlbWFpbCBhZGRyZXNzZXMsXG4gICAgLy8ganVzdCBjaGVjayB0byBtYWtlIHN1cmUgZW1haWwgYWRkcmVzcyBjb250YWlucyBgQGAgYW5kIG1vdmUgb24gd2l0aCBvdXIgbGl2ZXMuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubmFtZSAmJiB0aGlzLnN0YXRlLmVtYWlsLmluY2x1ZGVzKCdAJyk7XG4gIH1cblxuICBmb2N1c0ZpcnN0SW5wdXQoKSB7XG4gICAgdGhpcy5uYW1lSW5wdXQuZm9jdXMoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQW9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVyQixNQUFNQSxZQUFZLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBYXhEQyxXQUFXLENBQUNDLEtBQUssRUFBRUMsT0FBTyxFQUFFO0lBQzFCLEtBQUssQ0FBQ0QsS0FBSyxFQUFFQyxPQUFPLENBQUM7SUFDckIsSUFBQUMsaUJBQVEsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQztJQUVuRyxJQUFJLENBQUNDLEtBQUssR0FBRztNQUNYQyxJQUFJLEVBQUUsSUFBSSxDQUFDSixLQUFLLENBQUNJLElBQUk7TUFDckJDLEtBQUssRUFBRSxFQUFFO01BQ1RDLGNBQWMsRUFBRTtJQUNsQixDQUFDO0VBQ0g7RUFFQUMsaUJBQWlCLEdBQUc7SUFDbEJDLFVBQVUsQ0FBQyxJQUFJLENBQUNDLGVBQWUsQ0FBQztFQUNsQztFQUVBQyxNQUFNLEdBQUc7SUFDUCxPQUNFO01BQUssU0FBUyxFQUFDO0lB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