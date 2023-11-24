"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitIdentityView extends _react.default.Component {
  render() {
    return _react.default.createElement("div", {
      className: "github-GitIdentity"
    }, _react.default.createElement("h1", {
      className: "github-GitIdentity-title"
    }, "Git Identity"), _react.default.createElement("p", {
      className: "github-GitIdentity-explanation"
    }, "Please set the username and email address that you wish to use to author git commits. This will write to the", _react.default.createElement("code", null, "user.name"), " and ", _react.default.createElement("code", null, "user.email"), " values in your git configuration at the chosen scope."), _react.default.createElement("div", {
      className: "github-GitIdentity-text"
    }, _react.default.createElement(_atomTextEditor.default, {
      mini: true,
      placeholderText: "name",
      buffer: this.props.usernameBuffer
    }), _react.default.createElement(_atomTextEditor.default, {
      mini: true,
      placeholderText: "email address",
      buffer: this.props.emailBuffer
    })), _react.default.createElement("div", {
      className: "github-GitIdentity-buttons"
    }, _react.default.createElement("button", {
      className: "btn",
      onClick: this.props.close
    }, "Cancel"), _react.default.createElement("button", {
      className: "btn btn-primary",
      title: "Configure git for this repository",
      onClick: this.props.setLocal,
      disabled: !this.props.canWriteLocal
    }, "Use for this repository"), _react.default.createElement("button", {
      className: "btn btn-primary",
      title: "Configure git globally for your operating system user account",
      onClick: this.props.setGlobal
    }, "Use for all repositories")));
  }

}

exports.default = GitIdentityView;

_defineProperty(GitIdentityView, "propTypes", {
  // Model
  usernameBuffer: _propTypes.default.object.isRequired,
  emailBuffer: _propTypes.default.object.isRequired,
  canWriteLocal: _propTypes.default.bool.isRequired,
  // Action methods
  setLocal: _propTypes.default.func.isRequired,
  setGlobal: _propTypes.default.func.isRequired,
  close: _propTypes.default.func.isRequired
});