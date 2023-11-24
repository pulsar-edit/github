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