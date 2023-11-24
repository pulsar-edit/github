"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RemoteSelectorView extends _react.default.Component {
  render() {
    const {
      remotes,
      currentBranch,
      selectRemote
    } = this.props; // todo: ask Ash how to test this before merging.

    return _react.default.createElement("div", {
      className: "github-RemoteSelector"
    }, _react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mirror"
    }), _react.default.createElement("h1", null, "Select a Remote"), _react.default.createElement("div", {
      className: "initialize-repo-description"
    }, _react.default.createElement("span", null, "This repository has multiple remotes hosted at GitHub.com. Select a remote to see pull requests associated with the ", _react.default.createElement("strong", null, currentBranch.getName()), " branch:")), _react.default.createElement("ul", null, Array.from(remotes, remote => _react.default.createElement("li", {
      key: remote.getName()
    }, _react.default.createElement("button", {
      className: "btn btn-primary",
      onClick: e => selectRemote(e, remote)
    }, remote.getName(), " (", remote.getOwner(), "/", remote.getRepo(), ")")))));
  }

}

exports.default = RemoteSelectorView;

_defineProperty(RemoteSelectorView, "propTypes", {
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  selectRemote: _propTypes.default.func.isRequired
});