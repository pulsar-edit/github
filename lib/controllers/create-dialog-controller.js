"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCreateDialogController = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _atom = require("atom");

var _eventKit = require("event-kit");

var _path = _interopRequireDefault(require("path"));

var _createDialogView = _interopRequireDefault(require("../views/create-dialog-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCreateDialogController extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "didChangeRepoName", () => {
      this.modified.repoName = true;

      if (!this.modified.localPath) {
        if (this.localPath.getText() === this.projectHome) {
          this.localPath.setText(_path.default.join(this.projectHome, this.repoName.getText()));
        } else {
          const dirName = _path.default.dirname(this.localPath.getText());

          this.localPath.setText(_path.default.join(dirName, this.repoName.getText()));
        }

        this.modified.localPath = false;
      }

      this.recheckAcceptEnablement();
    });

    _defineProperty(this, "didChangeOwnerID", ownerID => new Promise(resolve => this.setState({
      selectedOwnerID: ownerID
    }, resolve)));

    _defineProperty(this, "didChangeLocalPath", () => {
      this.modified.localPath = true;

      if (!this.modified.repoName) {
        this.repoName.setText(_path.default.basename(this.localPath.getText()));
        this.modified.repoName = false;
      }

      this.recheckAcceptEnablement();
    });

    _defineProperty(this, "didChangeVisibility", visibility => {
      return new Promise(resolve => this.setState({
        selectedVisibility: visibility
      }, resolve));
    });

    _defineProperty(this, "didChangeSourceRemoteName", () => {
      this.writeSourceRemoteNameSetting();
      this.recheckAcceptEnablement();
    });

    _defineProperty(this, "didChangeProtocol", async protocol => {
      await new Promise(resolve => this.setState({
        selectedProtocol: protocol
      }, resolve));
      this.writeRemoteFetchProtocolSetting(protocol);
    });

    _defineProperty(this, "readSourceRemoteNameSetting", ({
      newValue
    }) => {
      if (newValue !== this.sourceRemoteName.getText()) {
        this.sourceRemoteName.setText(newValue);
      }
    });

    _defineProperty(this, "readRemoteFetchProtocolSetting", ({
      newValue
    }) => {
      if (newValue !== this.state.selectedProtocol) {
        this.setState({
          selectedProtocol: newValue
        });
      }
    });

    _defineProperty(this, "accept", () => {
      if (!this.acceptIsEnabled()) {
        return Promise.resolve();
      }

      const ownerID = this.state.selectedOwnerID !== '' ? this.state.selectedOwnerID : this.props.user.id;
      return this.props.request.accept({
        ownerID,
        name: this.repoName.getText(),
        visibility: this.state.selectedVisibility,
        localPath: this.localPath.getText(),
        protocol: this.state.selectedProtocol,
        sourceRemoteName: this.sourceRemoteName.getText()
      });
    });

    const {
      localDir
    } = this.props.request.getParams();
    this.projectHome = this.props.config.get('core.projectHome');
    this.modified = {
      repoName: false,
      localPath: false
    };
    this.repoName = new _atom.TextBuffer({
      text: localDir ? _path.default.basename(localDir) : ''
    });
    this.localPath = new _atom.TextBuffer({
      text: localDir || this.projectHome
    });
    this.sourceRemoteName = new _atom.TextBuffer({
      text: this.props.config.get('github.sourceRemoteName')
    });
    this.subs = new _eventKit.CompositeDisposable(this.repoName.onDidChange(this.didChangeRepoName), this.localPath.onDidChange(this.didChangeLocalPath), this.sourceRemoteName.onDidChange(this.didChangeSourceRemoteName), this.props.config.onDidChange('github.sourceRemoteName', this.readSourceRemoteNameSetting), this.props.config.onDidChange('github.remoteFetchProtocol', this.readRemoteFetchProtocolSetting));
    this.state = {
      acceptEnabled: this.acceptIsEnabled(),
      selectedVisibility: 'PUBLIC',
      selectedProtocol: this.props.config.get('github.remoteFetchProtocol'),
      selectedOwnerID: this.props.user ? this.props.user.id : ''
    };
  }

  render() {
    return _react.default.createElement(_createDialogView.default, _extends({
      selectedOwnerID: this.state.selectedOwnerID,
      repoName: this.repoName,
      selectedVisibility: this.state.selectedVisibility,
      localPath: this.localPath,
      sourceRemoteName: this.sourceRemoteName,
      selectedProtocol: this.state.selectedProtocol,
      didChangeOwnerID: this.didChangeOwnerID,
      didChangeVisibility: this.didChangeVisibility,
      didChangeProtocol: this.didChangeProtocol,
      acceptEnabled: this.state.acceptEnabled,
      accept: this.accept
    }, this.props));
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.recheckAcceptEnablement();
    }
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

  writeSourceRemoteNameSetting() {
    if (this.props.config.get('github.sourceRemoteName') !== this.sourceRemoteName.getText()) {
      this.props.config.set('github.sourceRemoteName', this.sourceRemoteName.getText());
    }
  }

  writeRemoteFetchProtocolSetting(protocol) {
    if (this.props.config.get('github.remoteFetchProtocol') !== protocol) {
      this.props.config.set('github.remoteFetchProtocol', protocol);
    }
  }

  acceptIsEnabled() {
    return !this.repoName.isEmpty() && !this.localPath.isEmpty() && !this.sourceRemoteName.isEmpty() && this.props.user !== null;
  }

  recheckAcceptEnablement() {
    const nextEnablement = this.acceptIsEnabled();

    if (nextEnablement !== this.state.acceptEnabled) {
      this.setState({
        acceptEnabled: nextEnablement
      });
    }
  }

}

exports.BareCreateDialogController = BareCreateDialogController;

_defineProperty(BareCreateDialogController, "propTypes", {
  // Relay
  user: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }),
  // Model
  request: _propTypes.default.shape({
    getParams: _propTypes.default.func.isRequired,
    accept: _propTypes.default.func.isRequired
  }).isRequired,
  error: _propTypes.default.instanceOf(Error),
  isLoading: _propTypes.default.bool.isRequired,
  inProgress: _propTypes.default.bool.isRequired,
  // Atom environment
  currentWindow: _propTypes.default.object.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCreateDialogController, {
  user: function () {
    const node = require("./__generated__/createDialogController_user.graphql");

    if (node.hash && node.hash !== "729f5d41fc5444c5f12632127f89ed21") {
      console.error("The definition of 'createDialogController_user' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/createDialogController_user.graphql");
  }
});

exports.default = _default;