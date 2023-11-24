"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _githubTabContainer = _interopRequireDefault(require("../containers/github-tab-container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitHubTabItem extends _react.default.Component {
  static buildURI() {
    return this.uriPattern;
  }

  constructor(props) {
    super(props);
    this.rootHolder = new _refHolder.default();
  }

  getTitle() {
    return 'GitHub';
  }

  getIconName() {
    return 'octoface';
  }

  getDefaultLocation() {
    return 'right';
  }

  getPreferredWidth() {
    return 400;
  }

  getWorkingDirectory() {
    return this.props.repository.getWorkingDirectoryPath();
  }

  serialize() {
    return {
      deserializer: 'GithubDockItem',
      uri: this.getURI()
    };
  }

  render() {
    return _react.default.createElement(_githubTabContainer.default, _extends({}, this.props, {
      rootHolder: this.rootHolder
    }));
  }

  hasFocus() {
    return this.rootHolder.map(root => root.contains(this.props.documentActiveElement())).getOr(false);
  }

  restoreFocus() {// No-op
  }

}

exports.default = GitHubTabItem;

_defineProperty(GitHubTabItem, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  repository: _propTypes.default.object,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  documentActiveElement: _propTypes.default.func,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  openCreateDialog: _propTypes.default.func.isRequired,
  openPublishDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
});

_defineProperty(GitHubTabItem, "defaultProps", {
  documentActiveElement:
  /* istanbul ignore next */
  () => document.activeElement
});

_defineProperty(GitHubTabItem, "uriPattern", 'atom-github://dock-item/github');