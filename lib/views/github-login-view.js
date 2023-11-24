"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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