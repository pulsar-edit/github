"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _electron = require("electron");

var _reporterProxy = require("../reporter-proxy");

var _propTypes2 = require("../prop-types");

var _issueishSearchesController = _interopRequireDefault(require("./issueish-searches-controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RemoteController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onCreatePr", async () => {
      const currentBranch = this.props.branches.getHeadBranch();
      const upstream = currentBranch.getUpstream();

      if (!upstream.isPresent() || this.props.aheadCount > 0) {
        await this.props.onPushBranch();
      }

      let createPrUrl = 'https://github.com/';
      createPrUrl += this.props.remote.getOwner() + '/' + this.props.remote.getRepo();
      createPrUrl += '/compare/' + encodeURIComponent(currentBranch.getName());
      createPrUrl += '?expand=1';
      await _electron.shell.openExternal(createPrUrl);
      (0, _reporterProxy.incrementCounter)('create-pull-request');
    });
  }

  render() {
    return _react.default.createElement(_issueishSearchesController.default, {
      endpoint: this.props.endpoint,
      token: this.props.token,
      workingDirectory: this.props.workingDirectory,
      repository: this.props.repository,
      workspace: this.props.workspace,
      remote: this.props.remote,
      remotes: this.props.remotes,
      branches: this.props.branches,
      aheadCount: this.props.aheadCount,
      pushInProgress: this.props.pushInProgress,
      onCreatePr: this.onCreatePr
    });
  }

}

exports.default = RemoteController;

_defineProperty(RemoteController, "propTypes", {
  // Relay payload
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    defaultBranchRef: _propTypes.default.shape({
      prefix: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired
    })
  }),
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes2.TokenPropType.isRequired,
  // Repository derived attributes
  workingDirectory: _propTypes.default.string,
  workspace: _propTypes.default.object.isRequired,
  remote: _propTypes2.RemotePropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Actions
  onPushBranch: _propTypes.default.func.isRequired
});