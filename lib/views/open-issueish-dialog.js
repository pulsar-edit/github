"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openIssueishItem = openIssueishItem;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _tabGroup = _interopRequireDefault(require("../tab-group"));

var _dialogView = _interopRequireDefault(require("./dialog-view"));

var _tabbable = require("./tabbable");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ISSUEISH_URL_REGEX = /^(?:https?:\/\/)?(github.com)\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/;

class OpenIssueishDialog extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "accept", () => {
      const issueishURL = this.url.getText();

      if (issueishURL.length === 0) {
        return Promise.resolve();
      }

      return this.props.request.accept(issueishURL);
    });

    _defineProperty(this, "didChangeURL", () => {
      const enabled = !this.url.isEmpty();

      if (this.state.acceptEnabled !== enabled) {
        this.setState({
          acceptEnabled: enabled
        });
      }
    });

    this.url = new _atom.TextBuffer();
    this.state = {
      acceptEnabled: false
    };
    this.sub = this.url.onDidChange(this.didChangeURL);
    this.tabGroup = new _tabGroup.default();
  }

  render() {
    return _react.default.createElement(_dialogView.default, {
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-git-pull-request",
      acceptText: "Open Issue or Pull Request",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Issue or pull request URL:", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      className: "github-OpenIssueish-url",
      buffer: this.url
    })));
  }

  componentDidMount() {
    this.tabGroup.autofocus();
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  parseUrl() {
    const url = this.getIssueishUrl();
    const matches = url.match(ISSUEISH_URL_REGEX);

    if (!matches) {
      return false;
    }

    const [_full, repoOwner, repoName, issueishNumber] = matches; // eslint-disable-line no-unused-vars

    return {
      repoOwner,
      repoName,
      issueishNumber
    };
  }

}

exports.default = OpenIssueishDialog;

_defineProperty(OpenIssueishDialog, "propTypes", {
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

async function openIssueishItem(issueishURL, {
  workspace,
  workdir
}) {
  const matches = ISSUEISH_URL_REGEX.exec(issueishURL);

  if (!matches) {
    throw new Error('Not a valid issue or pull request URL');
  }

  const [, host, owner, repo, number] = matches;

  const uri = _issueishDetailItem.default.buildURI({
    host,
    owner,
    repo,
    number,
    workdir
  });

  const item = await workspace.open(uri, {
    searchAllPanes: true
  });
  (0, _reporterProxy.addEvent)('open-issueish-in-pane', {
    package: 'github',
    from: 'dialog'
  });
  return item;
}