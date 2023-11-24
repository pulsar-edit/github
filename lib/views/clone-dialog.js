"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _atom = require("atom");

var _url = _interopRequireDefault(require("url"));

var _path = _interopRequireDefault(require("path"));

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _dialogView = _interopRequireDefault(require("./dialog-view"));

var _tabbable = require("./tabbable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CloneDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      const sourceURL = this.sourceURL.getText();
      const destinationPath = this.destinationPath.getText();

      if (sourceURL === '' || destinationPath === '') {
        return Promise.resolve();
      }

      return this.props.request.accept(sourceURL, destinationPath);
    });

    _defineProperty(this, "didChangeSourceUrl", () => {
      if (!this.destinationPathModified) {
        const name = _path.default.basename(_url.default.parse(this.sourceURL.getText()).pathname, '.git') || '';

        if (name.length > 0) {
          const proposedPath = _path.default.join(this.props.config.get('core.projectHome'), name);

          this.destinationPath.setText(proposedPath);
          this.destinationPathModified = false;
        }
      }

      this.setAcceptEnablement();
    });

    _defineProperty(this, "didChangeDestinationPath", () => {
      this.destinationPathModified = true;
      this.setAcceptEnablement();
    });

    _defineProperty(this, "setAcceptEnablement", () => {
      const enabled = !this.sourceURL.isEmpty() && !this.destinationPath.isEmpty();

      if (enabled !== this.state.acceptEnabled) {
        this.setState({
          acceptEnabled: enabled
        });
      }
    });

    const params = this.props.request.getParams();
    this.sourceURL = new _atom.TextBuffer({
      text: params.sourceURL
    });
    this.destinationPath = new _atom.TextBuffer({
      text: params.destPath || this.props.config.get('core.projectHome')
    });
    this.destinationPathModified = false;
    this.state = {
      acceptEnabled: false
    };
    this.subs = new _eventKit.CompositeDisposable(this.sourceURL.onDidChange(this.didChangeSourceUrl), this.destinationPath.onDidChange(this.didChangeDestinationPath));
    this.tabGroup = new _tabGroup.default();
  }

  render() {
    return _react.default.createElement(_dialogView.default, {
      progressMessage: "cloning...",
      acceptEnabled: this.state.acceptEnabled,
      acceptClassNames: "icon icon-repo-clone",
      acceptText: "Clone",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Clone from", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      className: "github-Clone-sourceURL",
      mini: true,
      readOnly: this.props.inProgress,
      buffer: this.sourceURL
    })), _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "To directory", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "github-Clone-destinationPath",
      mini: true,
      readOnly: this.props.inProgress,
      buffer: this.destinationPath
    })));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

}

exports.default = CloneDialog;

_defineProperty(CloneDialog, "propTypes", {
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
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});