"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _gitTabContainer = _interopRequireDefault(require("../containers/git-tab-container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitTabItem extends _react.default.Component {
  static buildURI() {
    return this.uriPattern;
  }

  constructor(props) {
    super(props);
    this.refController = new _refHolder.default();
  }

  render() {
    return _react.default.createElement(_gitTabContainer.default, _extends({
      controllerRef: this.refController
    }, this.props));
  }

  serialize() {
    return {
      deserializer: 'GitDockItem',
      uri: this.getURI()
    };
  }

  getTitle() {
    return 'Git';
  }

  getIconName() {
    return 'git-commit';
  }

  getDefaultLocation() {
    return 'right';
  }

  getPreferredWidth() {
    return 400;
  }

  getURI() {
    return this.constructor.uriPattern;
  }

  getWorkingDirectory() {
    return this.props.repository.getWorkingDirectoryPath();
  } // Forwarded to the controller instance when one is present


  rememberLastFocus(...args) {
    return this.refController.map(c => c.rememberLastFocus(...args));
  }

  restoreFocus(...args) {
    return this.refController.map(c => c.restoreFocus(...args));
  }

  hasFocus(...args) {
    return this.refController.map(c => c.hasFocus(...args));
  }

  focus() {
    return this.refController.map(c => c.restoreFocus());
  }

  focusAndSelectStagingItem(...args) {
    return this.refController.map(c => c.focusAndSelectStagingItem(...args));
  }

  focusAndSelectCommitPreviewButton() {
    return this.refController.map(c => c.focusAndSelectCommitPreviewButton());
  }

  quietlySelectItem(...args) {
    return this.refController.map(c => c.quietlySelectItem(...args));
  }

  focusAndSelectRecentCommit() {
    return this.refController.map(c => c.focusAndSelectRecentCommit());
  }

}

exports.default = GitTabItem;

_defineProperty(GitTabItem, "propTypes", {
  repository: _propTypes.default.object.isRequired
});

_defineProperty(GitTabItem, "uriPattern", 'atom-github://dock-item/git');