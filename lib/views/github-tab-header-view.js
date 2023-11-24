"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _path = _interopRequireDefault(require("path"));

var _propTypes2 = require("../prop-types");

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GithubTabHeaderView extends _react.default.Component {
  render() {
    const lockIcon = this.props.contextLocked ? 'lock' : 'unlock';
    const lockToggleTitle = this.props.contextLocked ? 'Change repository with the dropdown' : 'Follow the active pane item';
    return _react.default.createElement("header", {
      className: "github-Project"
    }, this.renderUser(), _react.default.createElement("select", {
      className: "github-Project-path input-select",
      value: this.props.workdir || '',
      disabled: this.props.changingWorkDir,
      onChange: this.props.handleWorkDirChange
    }, this.renderWorkDirs()), _react.default.createElement("button", {
      className: "github-Project-lock btn btn-small",
      onClick: this.props.handleLockToggle,
      disabled: this.props.changingLock,
      title: lockToggleTitle
    }, _react.default.createElement(_octicon.default, {
      icon: lockIcon
    })));
  }

  renderWorkDirs() {
    const workdirs = [];

    for (const workdir of this.props.workdirs) {
      workdirs.push(_react.default.createElement("option", {
        key: workdir,
        value: _path.default.normalize(workdir)
      }, _path.default.basename(workdir)));
    }

    return workdirs;
  }

  renderUser() {
    const login = this.props.user.getLogin();
    const avatarUrl = this.props.user.getAvatarUrl();
    return _react.default.createElement("img", {
      className: "github-Project-avatar",
      src: avatarUrl || 'atom://github/img/avatar.svg',
      title: `@${login}`,
      alt: `@${login}'s avatar`
    });
  }

}

exports.default = GithubTabHeaderView;

_defineProperty(GithubTabHeaderView, "propTypes", {
  user: _propTypes2.AuthorPropType.isRequired,
  // Workspace
  workdir: _propTypes.default.string,
  workdirs: _propTypes.default.shape({
    [Symbol.iterator]: _propTypes.default.func.isRequired
  }).isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  changingWorkDir: _propTypes.default.bool.isRequired,
  changingLock: _propTypes.default.bool.isRequired,
  handleWorkDirChange: _propTypes.default.func.isRequired,
  handleLockToggle: _propTypes.default.func.isRequired
});