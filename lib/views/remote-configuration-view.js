"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _tabbable = require("./tabbable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RemoteConfigurationView extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleProtocolChange", event => {
      this.props.didChangeProtocol(event.target.value);
    });
  }

  render() {
    const httpsClassName = (0, _classnames.default)('github-RemoteConfiguration-protocolOption', 'github-RemoteConfiguration-protocolOption--https', 'input-label');
    const sshClassName = (0, _classnames.default)('github-RemoteConfiguration-protocolOption', 'github-RemoteConfiguration-protocolOption--ssh', 'input-label');
    return _react.default.createElement("details", {
      className: "github-RemoteConfiguration-details block"
    }, _react.default.createElement(_tabbable.TabbableSummary, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands
    }, "Advanced"), _react.default.createElement("main", null, _react.default.createElement("div", {
      className: "github-RemoteConfiguration-protocol block"
    }, _react.default.createElement("span", {
      className: "github-RemoteConfiguration-protocolHeading"
    }, "Protocol:"), _react.default.createElement("label", {
      className: httpsClassName
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "protocol",
      value: "https",
      checked: this.props.currentProtocol === 'https',
      onChange: this.handleProtocolChange
    }), "HTTPS"), _react.default.createElement("label", {
      className: sshClassName
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "protocol",
      value: "ssh",
      checked: this.props.currentProtocol === 'ssh',
      onChange: this.handleProtocolChange
    }), "SSH")), _react.default.createElement("div", {
      className: "github-RemoteConfiguration-sourceRemote block"
    }, _react.default.createElement("label", {
      className: "input-label"
    }, "Source remote name:", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "github-RemoteConfiguration-sourceRemoteName",
      mini: true,
      autoWidth: false,
      buffer: this.props.sourceRemoteBuffer
    })))));
  }

}

exports.default = RemoteConfigurationView;

_defineProperty(RemoteConfigurationView, "propTypes", {
  tabGroup: _propTypes.default.object.isRequired,
  currentProtocol: _propTypes.default.oneOf(['https', 'ssh']),
  sourceRemoteBuffer: _propTypes.default.object.isRequired,
  didChangeProtocol: _propTypes.default.func.isRequired,
  // Atom environment
  commands: _propTypes.default.object.isRequired
});