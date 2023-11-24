"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GitHubBlankNoLocal;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore file */
function GitHubBlankNoLocal(props) {
  return _react.default.createElement("div", {
    className: "github-NoLocal github-Blank"
  }, _react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), _react.default.createElement("h1", {
    className: "github-Blank-banner"
  }, "Welcome"), _react.default.createElement("p", {
    className: "github-Blank-context"
  }, "How would you like to get started today?"), _react.default.createElement("p", {
    className: "github-Blank-option"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-repo-create",
    onClick: props.openCreateDialog
  }, "Create a new GitHub repository...")), _react.default.createElement("p", {
    className: "github-Blank-option"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-repo-clone",
    onClick: props.openCloneDialog
  }, "Clone an existing GitHub repository...")));
}

GitHubBlankNoLocal.propTypes = {
  openCreateDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired
};