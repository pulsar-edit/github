"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _reporterProxy = require("../reporter-proxy");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ChangedFilesCountView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleClick');
  }

  handleClick() {
    (0, _reporterProxy.addEvent)('click', {
      package: 'github',
      component: 'ChangedFileCountView'
    });
    this.props.didClick();
  }

  render() {
    return _react.default.createElement("button", {
      ref: "changedFiles",
      className: "github-ChangedFilesCount inline-block",
      onClick: this.handleClick
    }, _react.default.createElement(_octicon.default, {
      icon: "git-commit"
    }), `Git (${this.props.changedFilesCount})`, this.props.mergeConflictsPresent && _react.default.createElement(_octicon.default, {
      icon: "alert"
    }));
  }

}

exports.default = ChangedFilesCountView;

_defineProperty(ChangedFilesCountView, "propTypes", {
  changedFilesCount: _propTypes.default.number.isRequired,
  didClick: _propTypes.default.func.isRequired,
  mergeConflictsPresent: _propTypes.default.bool
});

_defineProperty(ChangedFilesCountView, "defaultProps", {
  changedFilesCount: 0,
  mergeConflictsPresent: false,
  didClick: () => {}
});