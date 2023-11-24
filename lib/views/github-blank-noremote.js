"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GitHubBlankNoRemote;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore file */
function GitHubBlankNoRemote(props) {
  return _react.default.createElement("div", {
    className: "github-Local-NoRemotes github-Blank"
  }, _react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), _react.default.createElement("p", {
    className: "github-Blank-context"
  }, "This repository has no remotes on GitHub."), _react.default.createElement("p", {
    className: "github-Blank-option github-Blank-option--explained"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-globe",
    onClick: props.openBoundPublishDialog
  }, "Publish on GitHub...")), _react.default.createElement("p", {
    className: "github-Blank-explanation"
  }, "Create a new GitHub repository and configure this git repository configured to push there."));
}

GitHubBlankNoRemote.propTypes = {
  openBoundPublishDialog: _propTypes.default.func.isRequired
};