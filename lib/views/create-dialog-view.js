"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dialogView = _interopRequireDefault(require("./dialog-view"));

var _repositoryHomeSelectionView = _interopRequireDefault(require("./repository-home-selection-view"));

var _directorySelect = _interopRequireDefault(require("./directory-select"));

var _remoteConfigurationView = _interopRequireDefault(require("./remote-configuration-view"));

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _tabbable = require("./tabbable");

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DIALOG_TEXT = {
  create: {
    heading: 'Create GitHub repository',
    hostPath: 'Destination path:',
    progressMessage: 'Creating repository...',
    acceptText: 'Create'
  },
  publish: {
    heading: 'Publish GitHub repository',
    hostPath: 'Local path:',
    progressMessage: 'Publishing repository...',
    acceptText: 'Publish'
  }
};

class CreateDialogView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "didChangeVisibility", event => this.props.didChangeVisibility(event.target.value));

    this.tabGroup = new _tabGroup.default();
  }

  render() {
    const text = DIALOG_TEXT[this.props.request.identifier];
    return _react.default.createElement(_dialogView.default, {
      progressMessage: text.progressMessage,
      acceptEnabled: this.props.acceptEnabled,
      acceptText: text.acceptText,
      accept: this.props.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("h1", {
      className: "github-Create-header"
    }, _react.default.createElement(_octicon.default, {
      icon: "globe"
    }), text.heading), _react.default.createElement("div", {
      className: "github-Create-repo block"
    }, _react.default.createElement(_repositoryHomeSelectionView.default, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocusName: true,
      user: this.props.user,
      nameBuffer: this.props.repoName,
      selectedOwnerID: this.props.selectedOwnerID,
      didChangeOwnerID: this.props.didChangeOwnerID,
      isLoading: this.props.isLoading
    })), _react.default.createElement("div", {
      className: "github-Create-visibility block"
    }, _react.default.createElement("span", {
      className: "github-Create-visibilityHeading"
    }, "Visibility:"), _react.default.createElement("label", {
      className: "github-Create-visibilityOption input-label"
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "visibility",
      value: "PUBLIC",
      checked: this.props.selectedVisibility === 'PUBLIC',
      onChange: this.didChangeVisibility
    }), _react.default.createElement(_octicon.default, {
      icon: "globe"
    }), "Public"), _react.default.createElement("label", {
      className: "github-Create-visibilityOption input-label"
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "visibility",
      value: "PRIVATE",
      checked: this.props.selectedVisibility === 'PRIVATE',
      onChange: this.didChangeVisibility
    }), _react.default.createElement(_octicon.default, {
      icon: "mirror-private"
    }), "Private")), _react.default.createElement("div", {
      className: "github-Create-localPath"
    }, _react.default.createElement(_directorySelect.default, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      currentWindow: this.props.currentWindow,
      buffer: this.props.localPath,
      disabled: this.props.request.identifier === 'publish'
    })), _react.default.createElement(_remoteConfigurationView.default, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      currentProtocol: this.props.selectedProtocol,
      didChangeProtocol: this.props.didChangeProtocol,
      sourceRemoteBuffer: this.props.sourceRemoteName
    }));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

}

exports.default = CreateDialogView;

_defineProperty(CreateDialogView, "propTypes", {
  // Relay
  user: _propTypes.default.object,
  // Model
  request: _propTypes.default.shape({
    identifier: _propTypes.default.oneOf(['create', 'publish']).isRequired,
    getParams: _propTypes.default.func.isRequired,
    cancel: _propTypes.default.func.isRequired
  }).isRequired,
  error: _propTypes.default.instanceOf(Error),
  isLoading: _propTypes.default.bool.isRequired,
  inProgress: _propTypes.default.bool.isRequired,
  selectedOwnerID: _propTypes.default.string.isRequired,
  repoName: _propTypes.default.object.isRequired,
  selectedVisibility: _propTypes.default.oneOf(['PUBLIC', 'PRIVATE']).isRequired,
  localPath: _propTypes.default.object.isRequired,
  sourceRemoteName: _propTypes.default.object.isRequired,
  selectedProtocol: _propTypes.default.oneOf(['https', 'ssh']).isRequired,
  acceptEnabled: _propTypes.default.bool.isRequired,
  // Change callbacks
  didChangeOwnerID: _propTypes.default.func.isRequired,
  didChangeVisibility: _propTypes.default.func.isRequired,
  didChangeProtocol: _propTypes.default.func.isRequired,
  accept: _propTypes.default.func.isRequired,
  // Atom environment
  currentWindow: _propTypes.default.object.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});