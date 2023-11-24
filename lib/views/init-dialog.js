"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _tabbable = require("./tabbable");

var _dialogView = _interopRequireDefault(require("./dialog-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InitDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      const destPath = this.destinationPath.getText();

      if (destPath.length === 0) {
        return Promise.resolve();
      }

      return this.props.request.accept(destPath);
    });

    _defineProperty(this, "setAcceptEnablement", () => {
      const enablement = !this.destinationPath.isEmpty();

      if (enablement !== this.state.acceptEnabled) {
        this.setState({
          acceptEnabled: enablement
        });
      }
    });

    this.tabGroup = new _tabGroup.default();
    this.destinationPath = new _atom.TextBuffer({
      text: this.props.request.getParams().dirPath
    });
    this.sub = this.destinationPath.onDidChange(this.setAcceptEnablement);
    this.state = {
      acceptEnabled: !this.destinationPath.isEmpty()
    };
  }

  render() {
    return _react.default.createElement(_dialogView.default, {
      progressMessage: "Initializing...",
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-repo-create",
      acceptText: "Init",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Initialize git repository in directory", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      preselect: true,
      readOnly: this.props.inProgress,
      buffer: this.destinationPath
    })));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

}

exports.default = InitDialog;

_defineProperty(InitDialog, "propTypes", {
  // Model
  request: _propTypes.default.shape({
    getParams: _propTypes.default.func.isRequired,
    accept: _propTypes.default.func.isRequired,
    cancel: _propTypes.default.func.isRequired
  }).isRequired,
  inProgress: _propTypes.default.bool,
  error: _propTypes.default.instanceOf(Error),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired
});