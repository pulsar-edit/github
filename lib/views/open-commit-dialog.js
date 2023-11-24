"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openCommitDetailItem = openCommitDetailItem;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _gitShellOutStrategy = require("../git-shell-out-strategy");

var _dialogView = _interopRequireDefault(require("./dialog-view"));

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _tabbable = require("./tabbable");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OpenCommitDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      const ref = this.ref.getText();

      if (ref.length === 0) {
        return Promise.resolve();
      }

      return this.props.request.accept(ref);
    });

    _defineProperty(this, "didChangeRef", () => {
      const enabled = !this.ref.isEmpty();

      if (this.state.acceptEnabled !== enabled) {
        this.setState({
          acceptEnabled: enabled
        });
      }
    });

    this.ref = new _atom.TextBuffer();
    this.sub = this.ref.onDidChange(this.didChangeRef);
    this.state = {
      acceptEnabled: false
    };
    this.tabGroup = new _tabGroup.default();
  }

  render() {
    return _react.default.createElement(_dialogView.default, {
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-commit",
      acceptText: "Open commit",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel github-CommitRef"
    }, "Commit sha or ref:", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      buffer: this.ref
    })));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

}

exports.default = OpenCommitDialog;

_defineProperty(OpenCommitDialog, "propTypes", {
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

async function openCommitDetailItem(ref, {
  workspace,
  repository
}) {
  try {
    await repository.getCommit(ref);
  } catch (error) {
    if (error instanceof _gitShellOutStrategy.GitError && error.code === 128) {
      error.userMessage = 'There is no commit associated with that reference.';
    }

    throw error;
  }

  const item = await workspace.open(_commitDetailItem.default.buildURI(repository.getWorkingDirectoryPath(), ref), {
    searchAllPanes: true
  });
  (0, _reporterProxy.addEvent)('open-commit-in-pane', {
    package: 'github',
    from: OpenCommitDialog.name
  });
  return item;
}