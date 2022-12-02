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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jby1hdXRob3ItZm9ybS5qcyJdLCJuYW1lcyI6WyJDb0F1dGhvckZvcm0iLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0Iiwic3RhdGUiLCJuYW1lIiwiZW1haWwiLCJzdWJtaXREaXNhYmxlZCIsImNvbXBvbmVudERpZE1vdW50Iiwic2V0VGltZW91dCIsImZvY3VzRmlyc3RJbnB1dCIsInJlbmRlciIsImNvbW1hbmRzIiwiY2FuY2VsIiwiY29uZmlybSIsImUiLCJuYW1lSW5wdXQiLCJvbk5hbWVDaGFuZ2UiLCJlbWFpbElucHV0Iiwib25FbWFpbENoYW5nZSIsImlzSW5wdXRWYWxpZCIsIm9uU3VibWl0IiwiQXV0aG9yIiwib25DYW5jZWwiLCJzZXRTdGF0ZSIsInRhcmdldCIsInZhbHVlIiwidmFsaWRhdGUiLCJpbmNsdWRlcyIsImZvY3VzIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVlLE1BQU1BLFlBQU4sU0FBMkJDLGVBQU1DLFNBQWpDLENBQTJDO0FBYXhEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUMxQixVQUFNRCxLQUFOLEVBQWFDLE9BQWI7QUFDQSwyQkFBUyxJQUFULEVBQWUsU0FBZixFQUEwQixRQUExQixFQUFvQyxjQUFwQyxFQUFvRCxlQUFwRCxFQUFxRSxVQUFyRSxFQUFpRixpQkFBakY7QUFFQSxTQUFLQyxLQUFMLEdBQWE7QUFDWEMsTUFBQUEsSUFBSSxFQUFFLEtBQUtILEtBQUwsQ0FBV0csSUFETjtBQUVYQyxNQUFBQSxLQUFLLEVBQUUsRUFGSTtBQUdYQyxNQUFBQSxjQUFjLEVBQUU7QUFITCxLQUFiO0FBS0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xC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UUFBSSxLQUFLUCxZQUFMLEVBQUosRUFBeUI7QUFDdkIsV0FBS0ksUUFBTCxDQUFjO0FBQUNqQixRQUFBQSxjQUFjLEVBQUU7QUFBakIsT0FBZDtBQUNEO0FBQ0Y7O0FBRURhLEVBQUFBLFlBQVksR0FBRztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTyxLQUFLaEIsS0FBTCxDQUFXQyxJQUFYLElBQW1CLEtBQUtELEtBQUwsQ0FBV0UsS0FBWCxDQUFpQnNCLFFBQWpCLENBQTBCLEdBQTFCLENBQTFCO0FBQ0Q7O0FBRURsQixFQUFBQSxlQUFlLEdBQUc7QUFDaEIsU0FBS00sU0FBTCxDQUFlYSxLQUFmO0FBQ0Q7O0FBdkd1RDs7OztnQkFBckMvQixZLGVBQ0E7QUFDakJjLEVBQUFBLFFBQVEsRUFBRWtCLG1CQUFVQyxNQUFWLENBQWlCQyxVQURWO0FBRWpCWCxFQUFBQSxRQUFRLEVBQUVTLG1CQUFVRyxJQUZIO0FBR2pCVixFQUFBQSxRQUFRLEVBQUVPLG1CQUFVRyxJQUhIO0FBSWpCNUIsRUFBQUEsSUFBSSxFQUFFeUIsbUJBQVVJO0FBSkMsQzs7Z0JBREFwQyxZLGtCQVFHO0FBQ3BCdUIsRUFBQUEsUUFBUSxFQUFFLE1BQU0sQ0FBRSxDQURFO0FBRXBCRSxFQUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFO0FBRkUsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgQXV0aG9yIGZyb20gJy4uL21vZGVscy9hdXRob3InO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29BdXRob3JGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uU3VibWl0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNhbmNlbDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25TdWJtaXQ6ICgpID0+IHt9LFxuICAgIG9uQ2FuY2VsOiAoKSA9PiB7fSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdjb25maXJtJywgJ2NhbmNlbCcsICdvbk5hbWVDaGFuZ2UnLCAnb25FbWFpbENoYW5nZScsICd2YWxpZGF0ZScsICdmb2N1c0ZpcnN0SW5wdXQnKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBuYW1lOiB0aGlzLnByb3BzLm5hbWUsXG4gICAgICBlbWFpbDogJycsXG4gICAgICBzdWJtaXREaXNhYmxlZDogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgc2V0VGltZW91dCh0aGlzLmZvY3VzRmlyc3RJbnB1dCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvQXV0aG9yRm9ybSBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1Db0F1dGhvckZvcm1cIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjYW5jZWxcIiBjYWxsYmFjaz17dGhpcy5jYW5jZWx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIGNhbGxiYWNrPXt0aGlzLmNvbmZpcm19IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJnaXRodWItQ29BdXRob3JGb3JtLXJvd1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Db0F1dGhvckZvcm0tbGFiZWxcIj5OYW1lOjwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ28tYXV0aG9yIG5hbWVcIlxuICAgICAgICAgICAgcmVmPXtlID0+ICh0aGlzLm5hbWVJbnB1dCA9IGUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtdGV4dCBnaXRodWItQ29BdXRob3JGb3JtLW5hbWVcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uTmFtZUNoYW5nZX1cbiAgICAgICAgICAgIHRhYkluZGV4PVwiMVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1Db0F1dGhvckZvcm0tcm93XCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUNvQXV0aG9yRm9ybS1sYWJlbFwiPkVtYWlsOjwvc3Bhbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImZvb0BiYXIuY29tXCJcbiAgICAgICAgICAgIHJlZj17ZSA9PiAodGhpcy5lbWFpbElucHV0ID0gZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC10ZXh0IGdpdGh1Yi1Db0F1dGhvckZvcm0tZW1haWxcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuZW1haWx9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkVtYWlsQ2hhbmdlfVxuICAgICAgICAgICAgdGFiSW5kZXg9XCIyXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Db0F1dGhvckZvcm0tcm93IGhhcy1idXR0b25zXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gZ2l0aHViLUNhbmNlbEJ1dHRvblwiIHRhYkluZGV4PVwiM1wiIG9uQ2xpY2s9e3RoaXMuY2FuY2VsfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXt0aGlzLnN0YXRlLnN1Ym1pdERpc2FibGVkfSB0YWJJbmRleD1cIjRcIiBvbkNsaWNrPXt0aGlzLmNvbmZpcm19PlxuICAgICAgICAgICAgQWRkIENvLUF1dGhvclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb25maXJtKCkge1xuICAgIGlmICh0aGlzLmlzSW5wdXRWYWxpZCgpKSB7XG4gICAgICB0aGlzLnByb3BzLm9uU3VibWl0KG5ldyBBdXRob3IodGhpcy5zdGF0ZS5lbWFpbCwgdGhpcy5zdGF0ZS5uYW1lKSk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMucHJvcHMub25DYW5jZWwoKTtcbiAgfVxuXG4gIG9uTmFtZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bmFtZTogZS50YXJnZXQudmFsdWV9LCB0aGlzLnZhbGlkYXRlKTtcbiAgfVxuXG4gIG9uRW1haWxDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2VtYWlsOiBlLnRhcmdldC52YWx1ZX0sIHRoaXMudmFsaWRhdGUpO1xuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNJbnB1dFZhbGlkKCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3N1Ym1pdERpc2FibGVkOiBmYWxzZX0pO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5wdXRWYWxpZCgpIHtcbiAgICAvLyBlbWFpbCB2YWxpZGF0aW9uIHdpdGggcmVnZXggaGFzIGEgTE9UIG9mIGNvcm5lciBjYXNlcywgZGF3Zy5cbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80ODA1NTQzMS9jYW4taXQtY2F1c2UtaGFybS10by12YWxpZGF0ZS1lbWFpbC1hZGRyZXNzZXMtd2l0aC1hLXJlZ2V4XG4gICAgLy8gdG8gYXZvaWQgYnVncyBmb3IgdXNlcnMgd2l0aCBub25zdGFuZGFyZCBlbWFpbCBhZGRyZXNzZXMsXG4gICAgLy8ganVzdCBjaGVjayB0byBtYWtlIHN1cmUgZW1haWwgYWRkcmVzcyBjb250YWlucyBgQGAgYW5kIG1vdmUgb24gd2l0aCBvdXIgbGl2ZXMuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubmFtZSAmJiB0aGlzLnN0YXRlLmVtYWlsLmluY2x1ZGVzKCdAJyk7XG4gIH1cblxuICBmb2N1c0ZpcnN0SW5wdXQoKSB7XG4gICAgdGhpcy5uYW1lSW5wdXQuZm9jdXMoKTtcbiAgfVxufVxuIl19