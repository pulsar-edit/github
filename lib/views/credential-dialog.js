"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dialogView = _interopRequireDefault(require("./dialog-view"));

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _tabbable = require("./tabbable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CredentialDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      if (!this.canSignIn()) {
        return Promise.resolve();
      }

      const request = this.props.request;
      const params = request.getParams();
      const payload = {
        password: this.state.password
      };

      if (params.includeUsername) {
        payload.username = this.state.username;
      }

      if (params.includeRemember) {
        payload.remember = this.state.remember;
      }

      return request.accept(payload);
    });

    _defineProperty(this, "didChangeUsername", e => this.setState({
      username: e.target.value
    }));

    _defineProperty(this, "didChangePassword", e => this.setState({
      password: e.target.value
    }));

    _defineProperty(this, "didChangeRemember", e => this.setState({
      remember: e.target.checked
    }));

    _defineProperty(this, "toggleShowPassword", () => this.setState({
      showPassword: !this.state.showPassword
    }));

    this.tabGroup = new _tabGroup.default();
    this.state = {
      username: '',
      password: '',
      remember: false,
      showPassword: false
    };
  }

  render() {
    const request = this.props.request;
    const params = request.getParams();
    return _react.default.createElement(_dialogView.default, {
      prompt: params.prompt,
      acceptEnabled: this.canSignIn(),
      acceptText: "Sign in",
      accept: this.accept,
      cancel: request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, params.includeUsername && _react.default.createElement("label", {
      className: "github-DialogLabel github-DialogLabel--horizontal"
    }, "Username:", _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      type: "text",
      className: "input-text native-key-bindings github-Credential-username",
      value: this.state.username,
      onChange: this.didChangeUsername
    })), _react.default.createElement("label", {
      className: "github-DialogLabel github-DialogLabel--horizontal"
    }, "Password:", _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      type: this.state.showPassword ? 'text' : 'password',
      className: "input-text native-key-bindings github-Credential-password",
      value: this.state.password,
      onChange: this.didChangePassword
    }), _react.default.createElement(_tabbable.TabbableButton, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "github-Dialog--insetButton github-Credential-visibility",
      onClick: this.toggleShowPassword
    }, this.state.showPassword ? 'Hide' : 'Show')), params.includeRemember && _react.default.createElement("label", {
      className: "github-DialogLabel github-DialogLabel--horizontal github-Credential-rememberLabel"
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "input-checkbox github-Credential-remember",
      type: "checkbox",
      checked: this.state.remember,
      onChange: this.didChangeRemember
    }), "Remember"));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

  canSignIn() {
    return !this.props.request.getParams().includeUsername || this.state.username.length > 0;
  }

}

exports.default = CredentialDialog;

_defineProperty(CredentialDialog, "propTypes", {
  // Model
  request: _propTypes.default.shape({
    getParams: _propTypes.default.func.isRequired,
    accept: _propTypes.default.func.isRequired,
    cancel: _propTypes.default.func.isRequired
  }).isRequired,
  inProgress: _propTypes.default.bool,
  error: _propTypes.default.instanceOf(Error),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired
});