"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueDetailView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _issueTimelineController = _interopRequireDefault(require("../controllers/issue-timeline-controller"));

var _emojiReactionsController = _interopRequireDefault(require("../controllers/emoji-reactions-controller"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _issueishBadge = _interopRequireDefault(require("../views/issueish-badge"));

var _githubDotcomMarkdown = _interopRequireDefault(require("../views/github-dotcom-markdown"));

var _periodicRefresher = _interopRequireDefault(require("../periodic-refresher"));

var _reporterProxy = require("../reporter-proxy");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareIssueDetailView extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      refreshing: false
    });

    _defineProperty(this, "handleRefreshClick", e => {
      e.preventDefault();
      this.refresher.refreshNow(true);
    });

    _defineProperty(this, "recordOpenInBrowserEvent", () => {
      (0, _reporterProxy.addEvent)('open-issue-in-browser', {
        package: 'github',
        component: this.constructor.name
      });
    });

    _defineProperty(this, "refresh", () => {
      if (this.state.refreshing) {
        return;
      }

      this.setState({
        refreshing: true
      });
      this.props.relay.refetch({
        repoId: this.props.repository.id,
        issueishId: this.props.issue.id,
        timelineCount: 100,
        timelineCursor: null
      }, null, err => {
        if (err) {
          this.props.reportRelayError('Unable to refresh issue details', err);
        }

        this.setState({
          refreshing: false
        });
      }, {
        force: true
      });
    });
  }

  componentDidMount() {
    this.refresher = new _periodicRefresher.default(BareIssueDetailView, {
      interval: () => 5 * 60 * 1000,
      getCurrentId: () => this.props.issue.id,
      refresh: this.refresh,
      minimumIntervalPerId: 2 * 60 * 1000
    }); // auto-refresh disabled for now until pagination is handled
    // this.refresher.start();
  }

  componentWillUnmount() {
    this.refresher.destroy();
  }

  renderIssueBody(issue) {
    return _react.default.createElement("div", {
      className: "github-IssueishDetailView-issueBody"
    }, _react.default.createElement(_githubDotcomMarkdown.default, {
      html: issue.bodyHTML || '<em>No description provided.</em>',
      switchToIssueish: this.props.switchToIssueish
    }), _react.default.createElement(_emojiReactionsController.default, {
      reactable: issue,
      tooltips: this.props.tooltips,
      reportRelayError: this.props.reportRelayError
    }), _react.default.createElement(_issueTimelineController.default, {
      issue: issue,
      switchToIssueish: this.props.switchToIssueish
    }));
  }

  render() {
    const repo = this.props.repository;
    const issue = this.props.issue;
    const author = issue.author || _helpers.GHOST_USER;
    return _react.default.createElement("div", {
      className: "github-IssueishDetailView native-key-bindings"
    }, _react.default.createElement("div", {
      className: "github-IssueishDetailView-container"
    }, _react.default.createElement("header", {
      className: "github-IssueishDetailView-header"
    }, _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn"
    }, _react.default.createElement("a", {
      className: "github-IssueishDetailView-avatar",
      href: author.url
    }, _react.default.createElement("img", {
      className: "github-IssueishDetailView-avatarImage",
      src: author.avatarUrl,
      title: author.login,
      alt: author.login
    }))), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn is-flexible"
    }, _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow is-fullwidth"
    }, _react.default.createElement("a", {
      className: "github-IssueishDetailView-title",
      href: issue.url
    }, issue.title)), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow"
    }, _react.default.createElement(_issueishBadge.default, {
      className: "github-IssueishDetailView-headerBadge",
      type: issue.__typename,
      state: issue.state
    }), _react.default.createElement(_octicon.default, {
      icon: "repo-sync",
      className: (0, _classnames.default)('github-IssueishDetailView-headerRefreshButton', {
        refreshing: this.state.refreshing
      }),
      onClick: this.handleRefreshClick
    }), _react.default.createElement("a", {
      className: "github-IssueishDetailView-headerLink",
      title: "open on GitHub.com",
      href: issue.url,
      onClick: this.recordOpenInBrowserEvent
    }, repo.owner.login, "/", repo.name, "#", issue.number)))), this.renderIssueBody(issue), _react.default.createElement("footer", {
      className: "github-IssueishDetailView-footer"
    }, _react.default.createElement("a", {
      className: "github-IssueishDetailView-footerLink icon icon-mark-github",
      href: issue.url
    }, repo.owner.login, "/", repo.name, "#", issue.number))));
  }

}

exports.BareIssueDetailView = BareIssueDetailView;

_defineProperty(BareIssueDetailView, "propTypes", {
  // Relay response
  relay: _propTypes.default.shape({
    refetch: _propTypes.default.func.isRequired
  }),
  switchToIssueish: _propTypes.default.func.isRequired,
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    owner: _propTypes.default.shape({
      login: _propTypes.default.string
    })
  }),
  issue: _propTypes.default.shape({
    __typename: _propTypes.default.string.isRequired,
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string,
    url: _propTypes.default.string.isRequired,
    bodyHTML: _propTypes.default.string,
    number: _propTypes.default.number,
    state: _propTypes.default.oneOf(['OPEN', 'CLOSED']).isRequired,
    author: _propTypes.default.shape({
      login: _propTypes.default.string.isRequired,
      avatarUrl: _propTypes.default.string.isRequired,
      url: _propTypes.default.string.isRequired
    }).isRequired,
    reactionGroups: _propTypes.default.arrayOf(_propTypes.default.shape({
      content: _propTypes.default.string.isRequired,
      users: _propTypes.default.shape({
        totalCount: _propTypes.default.number.isRequired
      }).isRequired
    })).isRequired
  }).isRequired,
  // Atom environment
  tooltips: _propTypes.default.object.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createRefetchContainer)(BareIssueDetailView, {
  repository: function () {
    const node = require("./__generated__/issueDetailView_repository.graphql");

    if (node.hash && node.hash !== "295a60f53b25b6fdb07a1539cda447f2") {
      console.error("The definition of 'issueDetailView_repository' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueDetailView_repository.graphql");
  },
  issue: function () {
    const node = require("./__generated__/issueDetailView_issue.graphql");

    if (node.hash && node.hash !== "f7adc2e75c1d55df78481fd359bf7180") {
      console.error("The definition of 'issueDetailView_issue' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueDetailView_issue.graphql");
  }
}, function () {
  const node = require("./__generated__/issueDetailViewRefetchQuery.graphql");

  if (node.hash && node.hash !== "180dc18124ae95e41044932a2daf88ad") {
    console.error("The definition of 'issueDetailViewRefetchQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/issueDetailViewRefetchQuery.graphql");
});

exports.default = _default;