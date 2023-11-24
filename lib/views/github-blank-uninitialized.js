"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GitHubBlankUninitialized;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore file */
function GitHubBlankUninitialized(props) {
  return _react.default.createElement("div", {
    className: "github-Local-Uninit github-Blank"
  }, _react.default.createElement("main", {
    className: "github-Blank-body"
  }, _react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), _react.default.createElement("p", {
    className: "github-Blank-context"
  }, "This repository is not yet version controlled by git."), _react.default.createElement("p", {
    className: "github-Blank-option"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-globe",
    onClick: props.openBoundPublishDialog
  }, "Initialize and publish on GitHub...")), _react.default.createElement("p", {
    className: "github-Blank-explanation"
  }, "Create a new GitHub repository, then track the existing content within this directory as a git repository configured to push there."), _react.default.createElement("p", {
    className: "github-Blank-footer github-Blank-explanation"
  }, "To initialize this directory as a git repository without publishing it to GitHub, visit the", _react.default.createElement("button", {
    className: "github-Blank-tabLink",
    onClick: props.openGitTab
  }, _react.default.createElement(_octicon.default, {
    icon: "git-commit"
  }), "Git tab."))));
}

GitHubBlankUninitialized.propTypes = {
  openBoundPublishDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
};