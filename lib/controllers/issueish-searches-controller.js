"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _electron = require("electron");

var _propTypes2 = require("../prop-types");

var _search = _interopRequireDefault(require("../models/search"));

var _issueishSearchContainer = _interopRequireDefault(require("../containers/issueish-search-container"));

var _currentPullRequestContainer = _interopRequireDefault(require("../containers/current-pull-request-container"));

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IssueishSearchesController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {});

    _defineProperty(this, "onOpenReviews", issueish => {
      const uri = _reviewsItem.default.buildURI({
        host: this.props.endpoint.getHost(),
        owner: this.props.remote.getOwner(),
        repo: this.props.remote.getRepo(),
        number: issueish.getNumber(),
        workdir: this.props.workingDirectory
      });

      return this.props.workspace.open(uri).then(() => {
        (0, _reporterProxy.addEvent)('open-reviews-tab', {
          package: 'github',
          from: this.constructor.name
        });
      });
    });

    _defineProperty(this, "onOpenIssueish", issueish => {
      return this.props.workspace.open(_issueishDetailItem.default.buildURI({
        host: this.props.endpoint.getHost(),
        owner: this.props.remote.getOwner(),
        repo: this.props.remote.getRepo(),
        number: issueish.getNumber(),
        workdir: this.props.workingDirectory
      }), {
        pending: true,
        searchAllPanes: true
      }).then(() => {
        (0, _reporterProxy.addEvent)('open-issueish-in-pane', {
          package: 'github',
          from: 'issueish-list'
        });
      });
    });

    _defineProperty(this, "onOpenSearch", async search => {
      const searchURL = search.getWebURL(this.props.remote);
      await _electron.shell.openExternal(searchURL);
    });
  }

  static getDerivedStateFromProps(props) {
    return {
      searches: [_search.default.inRemote(props.remote, 'Open pull requests', 'type:pr state:open')]
    };
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-IssueishSearch"
    }, _react.default.createElement(_currentPullRequestContainer.default, {
      repository: this.props.repository,
      token: this.props.token,
      endpoint: this.props.endpoint,
      remote: this.props.remote,
      remotes: this.props.remotes,
      branches: this.props.branches,
      aheadCount: this.props.aheadCount,
      pushInProgress: this.props.pushInProgress,
      workspace: this.props.workspace,
      workingDirectory: this.props.workingDirectory,
      onOpenIssueish: this.onOpenIssueish,
      onOpenReviews: this.onOpenReviews,
      onCreatePr: this.props.onCreatePr
    }), this.state.searches.map(search => _react.default.createElement(_issueishSearchContainer.default, {
      key: search.getName(),
      token: this.props.token,
      endpoint: this.props.endpoint,
      search: search,
      onOpenIssueish: this.onOpenIssueish,
      onOpenSearch: this.onOpenSearch,
      onOpenReviews: this.onOpenReviews
    })));
  }

}

exports.default = IssueishSearchesController;

_defineProperty(IssueishSearchesController, "propTypes", {
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
  token: _propTypes.default.string.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  // Repository model attributes
  workingDirectory: _propTypes.default.string,
  remote: _propTypes2.RemotePropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Actions
  onCreatePr: _propTypes.default.func.isRequired
});