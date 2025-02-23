"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BarePullRequestDetailView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactTabs = require("react-tabs");
var _propTypes2 = require("../prop-types");
var _reporterProxy = require("../reporter-proxy");
var _periodicRefresher = _interopRequireDefault(require("../periodic-refresher"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _prChangedFilesContainer = _interopRequireDefault(require("../containers/pr-changed-files-container"));
var _prCheckoutController = require("../controllers/pr-checkout-controller");
var _prTimelineController = _interopRequireDefault(require("../controllers/pr-timeline-controller"));
var _emojiReactionsController = _interopRequireDefault(require("../controllers/emoji-reactions-controller"));
var _githubDotcomMarkdown = _interopRequireDefault(require("../views/github-dotcom-markdown"));
var _issueishBadge = _interopRequireDefault(require("../views/issueish-badge"));
var _checkoutButton = _interopRequireDefault(require("./checkout-button"));
var _prCommitsView = _interopRequireDefault(require("../views/pr-commits-view"));
var _prStatusesView = _interopRequireDefault(require("../views/pr-statuses-view"));
var _reviewsFooterView = _interopRequireDefault(require("../views/reviews-footer-view"));
var _helpers = require("../helpers");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class BarePullRequestDetailView extends _react.default.Component {
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
      (0, _reporterProxy.addEvent)('open-pull-request-in-browser', {
        package: 'github',
        component: this.constructor.name
      });
    });
    _defineProperty(this, "onTabSelected", index => {
      this.props.onTabSelected(index);
      const eventName = ['open-pr-tab-overview', 'open-pr-tab-build-status', 'open-pr-tab-commits', 'open-pr-tab-files-changed'][index];
      (0, _reporterProxy.addEvent)(eventName, {
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
        issueishId: this.props.pullRequest.id,
        timelineCount: _helpers.PAGE_SIZE,
        timelineCursor: null,
        commitCount: _helpers.PAGE_SIZE,
        commitCursor: null
      }, null, err => {
        if (err) {
          this.props.reportRelayError('Unable to refresh pull request details', err);
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
    this.refresher = new _periodicRefresher.default(BarePullRequestDetailView, {
      interval: () => 5 * 60 * 1000,
      getCurrentId: () => this.props.pullRequest.id,
      refresh: this.refresh,
      minimumIntervalPerId: 2 * 60 * 1000
    });
    // auto-refresh disabled for now until pagination is handled
    // this.refresher.start();
  }
  componentWillUnmount() {
    this.refresher.destroy();
  }
  renderPrMetadata(pullRequest, repo) {
    const author = this.getAuthor(pullRequest);
    return _react.default.createElement("span", {
      className: "github-IssueishDetailView-meta"
    }, _react.default.createElement("code", {
      className: "github-IssueishDetailView-baseRefName"
    }, pullRequest.isCrossRepository ? `${repo.owner.login}/${pullRequest.baseRefName}` : pullRequest.baseRefName), ' ‹ ', _react.default.createElement("code", {
      className: "github-IssueishDetailView-headRefName"
    }, pullRequest.isCrossRepository ? `${author.login}/${pullRequest.headRefName}` : pullRequest.headRefName));
  }
  renderPullRequestBody(pullRequest) {
    const onBranch = this.props.checkoutOp.why() === _prCheckoutController.checkoutStates.CURRENT;
    return _react.default.createElement(_reactTabs.Tabs, {
      selectedIndex: this.props.selectedTab,
      onSelect: this.onTabSelected
    }, _react.default.createElement(_reactTabs.TabList, {
      className: "github-tablist"
    }, _react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, _react.default.createElement(_octicon.default, {
      icon: "info",
      className: "github-tab-icon"
    }), "Overview"), _react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, _react.default.createElement(_octicon.default, {
      icon: "checklist",
      className: "github-tab-icon"
    }), "Build Status"), _react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, _react.default.createElement(_octicon.default, {
      icon: "git-commit",
      className: "github-tab-icon"
    }), "Commits", _react.default.createElement("span", {
      className: "github-tab-count"
    }, pullRequest.countedCommits.totalCount)), _react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, _react.default.createElement(_octicon.default, {
      icon: "diff",
      className: "github-tab-icon"
    }), "Files", _react.default.createElement("span", {
      className: "github-tab-count"
    }, pullRequest.changedFiles))), _react.default.createElement(_reactTabs.TabPanel, null, _react.default.createElement("div", {
      className: "github-IssueishDetailView-overview"
    }, _react.default.createElement(_githubDotcomMarkdown.default, {
      html: pullRequest.bodyHTML || '<em>No description provided.</em>',
      switchToIssueish: this.props.switchToIssueish
    }), _react.default.createElement(_emojiReactionsController.default, {
      reactable: pullRequest,
      tooltips: this.props.tooltips,
      reportRelayError: this.props.reportRelayError
    }), _react.default.createElement(_prTimelineController.default, {
      onBranch: onBranch,
      openCommit: this.props.openCommit,
      pullRequest: pullRequest,
      switchToIssueish: this.props.switchToIssueish
    }))), _react.default.createElement(_reactTabs.TabPanel, null, _react.default.createElement("div", {
      className: "github-IssueishDetailView-buildStatus"
    }, _react.default.createElement(_prStatusesView.default, {
      pullRequest: pullRequest,
      displayType: "full",
      switchToIssueish: this.props.switchToIssueish
    }))), _react.default.createElement(_reactTabs.TabPanel, null, _react.default.createElement(_prCommitsView.default, {
      pullRequest: pullRequest,
      onBranch: onBranch,
      openCommit: this.props.openCommit
    })), _react.default.createElement(_reactTabs.TabPanel, {
      className: "github-IssueishDetailView-filesChanged"
    }, _react.default.createElement(_prChangedFilesContainer.default, {
      localRepository: this.props.localRepository,
      owner: this.props.repository.owner.login,
      repo: this.props.repository.name,
      number: pullRequest.number,
      endpoint: this.props.endpoint,
      token: this.props.token,
      reviewCommentsLoading: this.props.reviewCommentsLoading,
      reviewCommentThreads: this.props.reviewCommentThreads,
      workspace: this.props.workspace,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      tooltips: this.props.tooltips,
      config: this.props.config,
      workdirPath: this.props.workdirPath,
      itemType: this.props.itemType,
      refEditor: this.props.refEditor,
      destroy: this.props.destroy,
      shouldRefetch: this.state.refreshing,
      switchToIssueish: this.props.switchToIssueish,
      pullRequest: this.props.pullRequest,
      initChangedFilePath: this.props.initChangedFilePath,
      initChangedFilePosition: this.props.initChangedFilePosition,
      onOpenFilesTab: this.props.onOpenFilesTab
    })));
  }
  render() {
    const repo = this.props.repository;
    const pullRequest = this.props.pullRequest;
    const author = this.getAuthor(pullRequest);
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
      href: pullRequest.url
    }, pullRequest.title)), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow"
    }, _react.default.createElement(_issueishBadge.default, {
      className: "github-IssueishDetailView-headerBadge",
      type: pullRequest.__typename,
      state: pullRequest.state
    }), _react.default.createElement(_octicon.default, {
      icon: "repo-sync",
      className: (0, _classnames.default)('github-IssueishDetailView-headerRefreshButton', {
        refreshing: this.state.refreshing
      }),
      onClick: this.handleRefreshClick
    }), _react.default.createElement("a", {
      className: "github-IssueishDetailView-headerLink",
      title: "open on GitHub.com",
      href: pullRequest.url,
      onClick: this.recordOpenInBrowserEvent
    }, repo.owner.login, "/", repo.name, "#", pullRequest.number), _react.default.createElement("span", {
      className: "github-IssueishDetailView-headerStatus"
    }, _react.default.createElement(_prStatusesView.default, {
      pullRequest: pullRequest,
      displayType: "check",
      switchToIssueish: this.props.switchToIssueish
    }))), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow"
    }, this.renderPrMetadata(pullRequest, repo))), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn"
    }, _react.default.createElement(_checkoutButton.default, {
      checkoutOp: this.props.checkoutOp,
      classNamePrefix: "github-IssueishDetailView-checkoutButton--",
      classNames: ['github-IssueishDetailView-checkoutButton']
    }))), this.renderPullRequestBody(pullRequest), _react.default.createElement(_reviewsFooterView.default, {
      commentsResolved: this.props.reviewCommentsResolvedCount,
      totalComments: this.props.reviewCommentsTotalCount,
      openReviews: this.props.openReviews,
      pullRequestURL: `${this.props.pullRequest.url}/files`
    })));
  }
  getAuthor(pullRequest) {
    return pullRequest.author || _helpers.GHOST_USER;
  }
}
exports.BarePullRequestDetailView = BarePullRequestDetailView;
_defineProperty(BarePullRequestDetailView, "propTypes", {
  // Relay response
  relay: _propTypes.default.shape({
    refetch: _propTypes.default.func.isRequired
  }),
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    owner: _propTypes.default.shape({
      login: _propTypes.default.string
    })
  }),
  pullRequest: _propTypes.default.shape({
    __typename: _propTypes.default.string.isRequired,
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string,
    countedCommits: _propTypes.default.shape({
      totalCount: _propTypes.default.number.isRequired
    }).isRequired,
    isCrossRepository: _propTypes.default.bool,
    changedFiles: _propTypes.default.number.isRequired,
    url: _propTypes.default.string.isRequired,
    bodyHTML: _propTypes.default.string,
    number: _propTypes.default.number,
    state: _propTypes.default.oneOf(['OPEN', 'CLOSED', 'MERGED']).isRequired,
    author: _propTypes.default.shape({
      login: _propTypes.default.string.isRequired,
      avatarUrl: _propTypes.default.string.isRequired,
      url: _propTypes.default.string.isRequired
    })
  }).isRequired,
  // Local model objects
  localRepository: _propTypes.default.object.isRequired,
  checkoutOp: _propTypes2.EnableableOperationPropType.isRequired,
  workdirPath: _propTypes.default.string,
  // Review comment threads
  reviewCommentsLoading: _propTypes.default.bool.isRequired,
  reviewCommentsTotalCount: _propTypes.default.number.isRequired,
  reviewCommentsResolvedCount: _propTypes.default.number.isRequired,
  reviewCommentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    thread: _propTypes.default.object.isRequired,
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
  })).isRequired,
  // Connection information
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes.default.string.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  // Action functions
  openCommit: _propTypes.default.func.isRequired,
  openReviews: _propTypes.default.func.isRequired,
  switchToIssueish: _propTypes.default.func.isRequired,
  destroy: _propTypes.default.func.isRequired,
  reportRelayError: _propTypes.default.func.isRequired,
  // Item context
  itemType: _propTypes2.ItemTypePropType.isRequired,
  refEditor: _propTypes2.RefHolderPropType.isRequired,
  // Tab management
  initChangedFilePath: _propTypes.default.string,
  initChangedFilePosition: _propTypes.default.number,
  selectedTab: _propTypes.default.number.isRequired,
  onTabSelected: _propTypes.default.func.isRequired,
  onOpenFilesTab: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createRefetchContainer)(BarePullRequestDetailView, {
  repository: function () {
    const node = require("./__generated__/prDetailView_repository.graphql");
    if (node.hash && node.hash !== "3f3d61ddd6afa1c9e0811c3b5be51bb0") {
      console.error("The definition of 'prDetailView_repository' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/prDetailView_repository.graphql");
  },
  pullRequest: function () {
    const node = require("./__generated__/prDetailView_pullRequest.graphql");
    if (node.hash && node.hash !== "e427b865abf965b5693382d0c5611f2f") {
      console.error("The definition of 'prDetailView_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/prDetailView_pullRequest.graphql");
  }
}, function () {
  const node = require("./__generated__/prDetailViewRefetchQuery.graphql");
  if (node.hash && node.hash !== "a997586597e1b33bb527359554fb7415") {
    console.error("The definition of 'prDetailViewRefetchQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/prDetailViewRefetchQuery.graphql");
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlcyIsIl9jbGFzc25hbWVzIiwiX3JlYWN0VGFicyIsIl9wcm9wVHlwZXMyIiwiX3JlcG9ydGVyUHJveHkiLCJfcGVyaW9kaWNSZWZyZXNoZXIiLCJfb2N0aWNvbiIsIl9wckNoYW5nZWRGaWxlc0NvbnRhaW5lciIsIl9wckNoZWNrb3V0Q29udHJvbGxlciIsIl9wclRpbWVsaW5lQ29udHJvbGxlciIsIl9lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIiLCJfZ2l0aHViRG90Y29tTWFya2Rvd24iLCJfaXNzdWVpc2hCYWRnZSIsIl9jaGVja291dEJ1dHRvbiIsIl9wckNvbW1pdHNWaWV3IiwiX3ByU3RhdHVzZXNWaWV3IiwiX3Jldmlld3NGb290ZXJWaWV3IiwiX2hlbHBlcnMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJyIiwidCIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImkiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsImFyZ3MiLCJyZWZyZXNoaW5nIiwicHJldmVudERlZmF1bHQiLCJyZWZyZXNoZXIiLCJyZWZyZXNoTm93IiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwibmFtZSIsImluZGV4IiwicHJvcHMiLCJvblRhYlNlbGVjdGVkIiwiZXZlbnROYW1lIiwic3RhdGUiLCJzZXRTdGF0ZSIsInJlbGF5IiwicmVmZXRjaCIsInJlcG9JZCIsInJlcG9zaXRvcnkiLCJpZCIsImlzc3VlaXNoSWQiLCJwdWxsUmVxdWVzdCIsInRpbWVsaW5lQ291bnQiLCJQQUdFX1NJWkUiLCJ0aW1lbGluZUN1cnNvciIsImNvbW1pdENvdW50IiwiY29tbWl0Q3Vyc29yIiwiZXJyIiwicmVwb3J0UmVsYXlFcnJvciIsImZvcmNlIiwiY29tcG9uZW50RGlkTW91bnQiLCJQZXJpb2RpY1JlZnJlc2hlciIsImludGVydmFsIiwiZ2V0Q3VycmVudElkIiwicmVmcmVzaCIsIm1pbmltdW1JbnRlcnZhbFBlcklkIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkZXN0cm95IiwicmVuZGVyUHJNZXRhZGF0YSIsInJlcG8iLCJhdXRob3IiLCJnZXRBdXRob3IiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaXNDcm9zc1JlcG9zaXRvcnkiLCJvd25lciIsImxvZ2luIiwiYmFzZVJlZk5hbWUiLCJoZWFkUmVmTmFtZSIsInJlbmRlclB1bGxSZXF1ZXN0Qm9keSIsIm9uQnJhbmNoIiwiY2hlY2tvdXRPcCIsIndoeSIsImNoZWNrb3V0U3RhdGVzIiwiQ1VSUkVOVCIsIlRhYnMiLCJzZWxlY3RlZEluZGV4Iiwic2VsZWN0ZWRUYWIiLCJvblNlbGVjdCIsIlRhYkxpc3QiLCJUYWIiLCJpY29uIiwiY291bnRlZENvbW1pdHMiLCJ0b3RhbENvdW50IiwiY2hhbmdlZEZpbGVzIiwiVGFiUGFuZWwiLCJodG1sIiwiYm9keUhUTUwiLCJzd2l0Y2hUb0lzc3VlaXNoIiwicmVhY3RhYmxlIiwidG9vbHRpcHMiLCJvcGVuQ29tbWl0IiwiZGlzcGxheVR5cGUiLCJsb2NhbFJlcG9zaXRvcnkiLCJudW1iZXIiLCJlbmRwb2ludCIsInRva2VuIiwicmV2aWV3Q29tbWVudHNMb2FkaW5nIiwicmV2aWV3Q29tbWVudFRocmVhZHMiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImtleW1hcHMiLCJjb25maWciLCJ3b3JrZGlyUGF0aCIsIml0ZW1UeXBlIiwicmVmRWRpdG9yIiwic2hvdWxkUmVmZXRjaCIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsIm9uT3BlbkZpbGVzVGFiIiwicmVuZGVyIiwiaHJlZiIsInVybCIsInNyYyIsImF2YXRhclVybCIsInRpdGxlIiwiYWx0IiwidHlwZSIsIl9fdHlwZW5hbWUiLCJjeCIsIm9uQ2xpY2siLCJoYW5kbGVSZWZyZXNoQ2xpY2siLCJyZWNvcmRPcGVuSW5Ccm93c2VyRXZlbnQiLCJjbGFzc05hbWVQcmVmaXgiLCJjbGFzc05hbWVzIiwiY29tbWVudHNSZXNvbHZlZCIsInJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudCIsInRvdGFsQ29tbWVudHMiLCJyZXZpZXdDb21tZW50c1RvdGFsQ291bnQiLCJvcGVuUmV2aWV3cyIsInB1bGxSZXF1ZXN0VVJMIiwiR0hPU1RfVVNFUiIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiYm9vbCIsIm9uZU9mIiwib2JqZWN0IiwiRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlIiwiYXJyYXlPZiIsInRocmVhZCIsImNvbW1lbnRzIiwiRW5kcG9pbnRQcm9wVHlwZSIsIkl0ZW1UeXBlUHJvcFR5cGUiLCJSZWZIb2xkZXJQcm9wVHlwZSIsIl9kZWZhdWx0IiwiY3JlYXRlUmVmZXRjaENvbnRhaW5lciIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIl0sInNvdXJjZXMiOlsicHItZGV0YWlsLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUmVmZXRjaENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7VGFiLCBUYWJzLCBUYWJMaXN0LCBUYWJQYW5lbH0gZnJvbSAncmVhY3QtdGFicyc7XG5cbmltcG9ydCB7RW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlLCBJdGVtVHlwZVByb3BUeXBlLCBFbmRwb2ludFByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQgUGVyaW9kaWNSZWZyZXNoZXIgZnJvbSAnLi4vcGVyaW9kaWMtcmVmcmVzaGVyJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgUHVsbFJlcXVlc3RDaGFuZ2VkRmlsZXNDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9wci1jaGFuZ2VkLWZpbGVzLWNvbnRhaW5lcic7XG5pbXBvcnQge2NoZWNrb3V0U3RhdGVzfSBmcm9tICcuLi9jb250cm9sbGVycy9wci1jaGVja291dC1jb250cm9sbGVyJztcbmltcG9ydCBQdWxsUmVxdWVzdFRpbWVsaW5lQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9wci10aW1lbGluZS1jb250cm9sbGVyJztcbmltcG9ydCBFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZW1vamktcmVhY3Rpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IEdpdGh1YkRvdGNvbU1hcmtkb3duIGZyb20gJy4uL3ZpZXdzL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IElzc3VlaXNoQmFkZ2UgZnJvbSAnLi4vdmlld3MvaXNzdWVpc2gtYmFkZ2UnO1xuaW1wb3J0IENoZWNrb3V0QnV0dG9uIGZyb20gJy4vY2hlY2tvdXQtYnV0dG9uJztcbmltcG9ydCBQdWxsUmVxdWVzdENvbW1pdHNWaWV3IGZyb20gJy4uL3ZpZXdzL3ByLWNvbW1pdHMtdmlldyc7XG5pbXBvcnQgUHVsbFJlcXVlc3RTdGF0dXNlc1ZpZXcgZnJvbSAnLi4vdmlld3MvcHItc3RhdHVzZXMtdmlldyc7XG5pbXBvcnQgUmV2aWV3c0Zvb3RlclZpZXcgZnJvbSAnLi4vdmlld3MvcmV2aWV3cy1mb290ZXItdmlldyc7XG5pbXBvcnQge1BBR0VfU0laRSwgR0hPU1RfVVNFUn0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSByZXNwb25zZVxuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG93bmVyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIH0pLFxuICAgIH0pLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgX190eXBlbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgY291bnRlZENvbW1pdHM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHRvdGFsQ291bnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICBpc0Nyb3NzUmVwb3NpdG9yeTogUHJvcFR5cGVzLmJvb2wsXG4gICAgICBjaGFuZ2VkRmlsZXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgYm9keUhUTUw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBzdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICAgJ09QRU4nLCAnQ0xPU0VEJywgJ01FUkdFRCcsXG4gICAgICBdKS5pc1JlcXVpcmVkLFxuICAgICAgYXV0aG9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTG9jYWwgbW9kZWwgb2JqZWN0c1xuICAgIGxvY2FsUmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNoZWNrb3V0T3A6IEVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXJQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gUmV2aWV3IGNvbW1lbnQgdGhyZWFkc1xuICAgIHJldmlld0NvbW1lbnRzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICByZXZpZXdDb21tZW50c1RvdGFsQ291bnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICByZXZpZXdDb21tZW50c1Jlc29sdmVkQ291bnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICByZXZpZXdDb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDb25uZWN0aW9uIGluZm9ybWF0aW9uXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB0b2tlbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gZnVuY3Rpb25zXG4gICAgb3BlbkNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuUmV2aWV3czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEl0ZW0gY29udGV4dFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVmRWRpdG9yOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gVGFiIG1hbmFnZW1lbnRcbiAgICBpbml0Q2hhbmdlZEZpbGVQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHNlbGVjdGVkVGFiOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25UYWJTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbk9wZW5GaWxlc1RhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIHJlZnJlc2hpbmc6IGZhbHNlLFxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoZXIgPSBuZXcgUGVyaW9kaWNSZWZyZXNoZXIoQmFyZVB1bGxSZXF1ZXN0RGV0YWlsVmlldywge1xuICAgICAgaW50ZXJ2YWw6ICgpID0+IDUgKiA2MCAqIDEwMDAsXG4gICAgICBnZXRDdXJyZW50SWQ6ICgpID0+IHRoaXMucHJvcHMucHVsbFJlcXVlc3QuaWQsXG4gICAgICByZWZyZXNoOiB0aGlzLnJlZnJlc2gsXG4gICAgICBtaW5pbXVtSW50ZXJ2YWxQZXJJZDogMiAqIDYwICogMTAwMCxcbiAgICB9KTtcbiAgICAvLyBhdXRvLXJlZnJlc2ggZGlzYWJsZWQgZm9yIG5vdyB1bnRpbCBwYWdpbmF0aW9uIGlzIGhhbmRsZWRcbiAgICAvLyB0aGlzLnJlZnJlc2hlci5zdGFydCgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgcmVuZGVyUHJNZXRhZGF0YShwdWxsUmVxdWVzdCwgcmVwbykge1xuICAgIGNvbnN0IGF1dGhvciA9IHRoaXMuZ2V0QXV0aG9yKHB1bGxSZXF1ZXN0KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LW1ldGFcIj5cbiAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1iYXNlUmVmTmFtZVwiPntwdWxsUmVxdWVzdC5pc0Nyb3NzUmVwb3NpdG9yeSA/XG4gICAgICAgICAgYCR7cmVwby5vd25lci5sb2dpbn0vJHtwdWxsUmVxdWVzdC5iYXNlUmVmTmFtZX1gIDogcHVsbFJlcXVlc3QuYmFzZVJlZk5hbWV9PC9jb2RlPnsnIOKAuSAnfVxuICAgICAgICA8Y29kZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRSZWZOYW1lXCI+e3B1bGxSZXF1ZXN0LmlzQ3Jvc3NSZXBvc2l0b3J5ID9cbiAgICAgICAgICBgJHthdXRob3IubG9naW59LyR7cHVsbFJlcXVlc3QuaGVhZFJlZk5hbWV9YCA6IHB1bGxSZXF1ZXN0LmhlYWRSZWZOYW1lfTwvY29kZT5cbiAgICAgIDwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUHVsbFJlcXVlc3RCb2R5KHB1bGxSZXF1ZXN0KSB7XG4gICAgY29uc3Qgb25CcmFuY2ggPSB0aGlzLnByb3BzLmNoZWNrb3V0T3Aud2h5KCkgPT09IGNoZWNrb3V0U3RhdGVzLkNVUlJFTlQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRhYnMgc2VsZWN0ZWRJbmRleD17dGhpcy5wcm9wcy5zZWxlY3RlZFRhYn0gb25TZWxlY3Q9e3RoaXMub25UYWJTZWxlY3RlZH0+XG4gICAgICAgIDxUYWJMaXN0IGNsYXNzTmFtZT1cImdpdGh1Yi10YWJsaXN0XCI+XG4gICAgICAgICAgPFRhYiBjbGFzc05hbWU9XCJnaXRodWItdGFiXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiaW5mb1wiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItaWNvblwiIC8+T3ZlcnZpZXc8L1RhYj5cbiAgICAgICAgICA8VGFiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWJcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJjaGVja2xpc3RcIiBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIiAvPlxuICAgICAgICAgICAgQnVpbGQgU3RhdHVzXG4gICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgPFRhYiBjbGFzc05hbWU9XCJnaXRodWItdGFiXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZ2l0LWNvbW1pdFwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItaWNvblwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgICBDb21taXRzXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItdGFiLWNvdW50XCI+XG4gICAgICAgICAgICAgIHtwdWxsUmVxdWVzdC5jb3VudGVkQ29tbWl0cy50b3RhbENvdW50fVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImRpZmZcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIlxuICAgICAgICAgICAgLz5GaWxlc1xuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1jb3VudFwiPntwdWxsUmVxdWVzdC5jaGFuZ2VkRmlsZXN9PC9zcGFuPlxuICAgICAgICAgIDwvVGFiPlxuICAgICAgICA8L1RhYkxpc3Q+XG4gICAgICAgIHsvKiAnUmV2aWV3cycgdGFiIHRvIGJlIGFkZGVkIGluIHRoZSBmdXR1cmUuICovfVxuXG4gICAgICAgIHsvKiBvdmVydmlldyAqL31cbiAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1vdmVydmlld1wiPlxuICAgICAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgICAgIGh0bWw9e3B1bGxSZXF1ZXN0LmJvZHlIVE1MIHx8ICc8ZW0+Tm8gZGVzY3JpcHRpb24gcHJvdmlkZWQuPC9lbT4nfVxuICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlclxuICAgICAgICAgICAgICByZWFjdGFibGU9e3B1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxQdWxsUmVxdWVzdFRpbWVsaW5lQ29udHJvbGxlclxuICAgICAgICAgICAgICBvbkJyYW5jaD17b25CcmFuY2h9XG4gICAgICAgICAgICAgIG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH1cbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1RhYlBhbmVsPlxuXG4gICAgICAgIHsvKiBidWlsZCBzdGF0dXMgKi99XG4gICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYnVpbGRTdGF0dXNcIj5cbiAgICAgICAgICAgIDxQdWxsUmVxdWVzdFN0YXR1c2VzVmlld1xuICAgICAgICAgICAgICBwdWxsUmVxdWVzdD17cHVsbFJlcXVlc3R9XG4gICAgICAgICAgICAgIGRpc3BsYXlUeXBlPVwiZnVsbFwiXG4gICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvVGFiUGFuZWw+XG5cbiAgICAgICAgey8qIGNvbW1pdHMgKi99XG4gICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICA8UHVsbFJlcXVlc3RDb21taXRzVmlldyBwdWxsUmVxdWVzdD17cHVsbFJlcXVlc3R9IG9uQnJhbmNoPXtvbkJyYW5jaH0gb3BlbkNvbW1pdD17dGhpcy5wcm9wcy5vcGVuQ29tbWl0fSAvPlxuICAgICAgICA8L1RhYlBhbmVsPlxuXG4gICAgICAgIHsvKiBmaWxlcyBjaGFuZ2VkICovfVxuICAgICAgICA8VGFiUGFuZWwgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1maWxlc0NoYW5nZWRcIj5cbiAgICAgICAgICA8UHVsbFJlcXVlc3RDaGFuZ2VkRmlsZXNDb250YWluZXJcbiAgICAgICAgICAgIGxvY2FsUmVwb3NpdG9yeT17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9XG5cbiAgICAgICAgICAgIG93bmVyPXt0aGlzLnByb3BzLnJlcG9zaXRvcnkub3duZXIubG9naW59XG4gICAgICAgICAgICByZXBvPXt0aGlzLnByb3BzLnJlcG9zaXRvcnkubmFtZX1cbiAgICAgICAgICAgIG51bWJlcj17cHVsbFJlcXVlc3QubnVtYmVyfVxuICAgICAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgICAgICB0b2tlbj17dGhpcy5wcm9wcy50b2tlbn1cblxuICAgICAgICAgICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzTG9hZGluZ31cbiAgICAgICAgICAgIHJldmlld0NvbW1lbnRUaHJlYWRzPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRUaHJlYWRzfVxuXG4gICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgICB3b3JrZGlyUGF0aD17dGhpcy5wcm9wcy53b3JrZGlyUGF0aH1cblxuICAgICAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgICAgICByZWZFZGl0b3I9e3RoaXMucHJvcHMucmVmRWRpdG9yfVxuICAgICAgICAgICAgZGVzdHJveT17dGhpcy5wcm9wcy5kZXN0cm95fVxuXG4gICAgICAgICAgICBzaG91bGRSZWZldGNoPXt0aGlzLnN0YXRlLnJlZnJlc2hpbmd9XG4gICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG5cbiAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXt0aGlzLnByb3BzLnB1bGxSZXF1ZXN0fVxuXG4gICAgICAgICAgICBpbml0Q2hhbmdlZEZpbGVQYXRoPXt0aGlzLnByb3BzLmluaXRDaGFuZ2VkRmlsZVBhdGh9XG4gICAgICAgICAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbj17dGhpcy5wcm9wcy5pbml0Q2hhbmdlZEZpbGVQb3NpdGlvbn1cbiAgICAgICAgICAgIG9uT3BlbkZpbGVzVGFiPXt0aGlzLnByb3BzLm9uT3BlbkZpbGVzVGFifVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICA8L1RhYnM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXBvID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5O1xuICAgIGNvbnN0IHB1bGxSZXF1ZXN0ID0gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdDtcbiAgICBjb25zdCBhdXRob3IgPSB0aGlzLmdldEF1dGhvcihwdWxsUmVxdWVzdCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3IG5hdGl2ZS1rZXktYmluZGluZ3NcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWNvbnRhaW5lclwiPlxuXG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckNvbHVtblwiPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWF2YXRhclwiIGhyZWY9e2F1dGhvci51cmx9PlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1hdmF0YXJJbWFnZVwiXG4gICAgICAgICAgICAgICAgICBzcmM9e2F1dGhvci5hdmF0YXJVcmx9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgICAgYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW4gaXMtZmxleGlibGVcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJvdyBpcy1mdWxsd2lkdGhcIj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LXRpdGxlXCIgaHJlZj17cHVsbFJlcXVlc3QudXJsfT57cHVsbFJlcXVlc3QudGl0bGV9PC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJvd1wiPlxuICAgICAgICAgICAgICAgIDxJc3N1ZWlzaEJhZGdlIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQmFkZ2VcIlxuICAgICAgICAgICAgICAgICAgdHlwZT17cHVsbFJlcXVlc3QuX190eXBlbmFtZX1cbiAgICAgICAgICAgICAgICAgIHN0YXRlPXtwdWxsUmVxdWVzdC5zdGF0ZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxPY3RpY29uXG4gICAgICAgICAgICAgICAgICBpY29uPVwicmVwby1zeW5jXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyUmVmcmVzaEJ1dHRvbicsIHtyZWZyZXNoaW5nOiB0aGlzLnN0YXRlLnJlZnJlc2hpbmd9KX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVmcmVzaENsaWNrfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgIHRpdGxlPVwib3BlbiBvbiBHaXRIdWIuY29tXCJcbiAgICAgICAgICAgICAgICAgIGhyZWY9e3B1bGxSZXF1ZXN0LnVybH0gb25DbGljaz17dGhpcy5yZWNvcmRPcGVuSW5Ccm93c2VyRXZlbnR9PlxuICAgICAgICAgICAgICAgICAge3JlcG8ub3duZXIubG9naW59L3tyZXBvLm5hbWV9I3twdWxsUmVxdWVzdC5udW1iZXJ9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyU3RhdHVzXCI+XG4gICAgICAgICAgICAgICAgICA8UHVsbFJlcXVlc3RTdGF0dXNlc1ZpZXdcbiAgICAgICAgICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VHlwZT1cImNoZWNrXCJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyUm93XCI+XG4gICAgICAgICAgICAgICAge3RoaXMucmVuZGVyUHJNZXRhZGF0YShwdWxsUmVxdWVzdCwgcmVwbyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW5cIj5cbiAgICAgICAgICAgICAgPENoZWNrb3V0QnV0dG9uXG4gICAgICAgICAgICAgICAgY2hlY2tvdXRPcD17dGhpcy5wcm9wcy5jaGVja291dE9wfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZVByZWZpeD1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctY2hlY2tvdXRCdXR0b24tLVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lcz17WydnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWNoZWNrb3V0QnV0dG9uJ119XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICAgIHt0aGlzLnJlbmRlclB1bGxSZXF1ZXN0Qm9keShwdWxsUmVxdWVzdCl9XG5cbiAgICAgICAgICA8UmV2aWV3c0Zvb3RlclZpZXdcbiAgICAgICAgICAgIGNvbW1lbnRzUmVzb2x2ZWQ9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50fVxuICAgICAgICAgICAgdG90YWxDb21tZW50cz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c1RvdGFsQ291bnR9XG4gICAgICAgICAgICBvcGVuUmV2aWV3cz17dGhpcy5wcm9wcy5vcGVuUmV2aWV3c31cbiAgICAgICAgICAgIHB1bGxSZXF1ZXN0VVJMPXtgJHt0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LnVybH0vZmlsZXNgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVJlZnJlc2hDbGljayA9IGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnJlZnJlc2hlci5yZWZyZXNoTm93KHRydWUpO1xuICB9XG5cbiAgcmVjb3JkT3BlbkluQnJvd3NlckV2ZW50ID0gKCkgPT4ge1xuICAgIGFkZEV2ZW50KCdvcGVuLXB1bGwtcmVxdWVzdC1pbi1icm93c2VyJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgb25UYWJTZWxlY3RlZCA9IGluZGV4ID0+IHtcbiAgICB0aGlzLnByb3BzLm9uVGFiU2VsZWN0ZWQoaW5kZXgpO1xuICAgIGNvbnN0IGV2ZW50TmFtZSA9IFtcbiAgICAgICdvcGVuLXByLXRhYi1vdmVydmlldycsXG4gICAgICAnb3Blbi1wci10YWItYnVpbGQtc3RhdHVzJyxcbiAgICAgICdvcGVuLXByLXRhYi1jb21taXRzJyxcbiAgICAgICdvcGVuLXByLXRhYi1maWxlcy1jaGFuZ2VkJyxcbiAgICBdW2luZGV4XTtcbiAgICBhZGRFdmVudChldmVudE5hbWUsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIHJlZnJlc2ggPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVmcmVzaGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe3JlZnJlc2hpbmc6IHRydWV9KTtcbiAgICB0aGlzLnByb3BzLnJlbGF5LnJlZmV0Y2goe1xuICAgICAgcmVwb0lkOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuaWQsXG4gICAgICBpc3N1ZWlzaElkOiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgdGltZWxpbmVDb3VudDogUEFHRV9TSVpFLFxuICAgICAgdGltZWxpbmVDdXJzb3I6IG51bGwsXG4gICAgICBjb21taXRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgY29tbWl0Q3Vyc29yOiBudWxsLFxuICAgIH0sIG51bGwsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHJlZnJlc2ggcHVsbCByZXF1ZXN0IGRldGFpbHMnLCBlcnIpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVmcmVzaGluZzogZmFsc2V9KTtcbiAgICB9LCB7Zm9yY2U6IHRydWV9KTtcbiAgfVxuXG4gIGdldEF1dGhvcihwdWxsUmVxdWVzdCkge1xuICAgIHJldHVybiBwdWxsUmVxdWVzdC5hdXRob3IgfHwgR0hPU1RfVVNFUjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWZldGNoQ29udGFpbmVyKEJhcmVQdWxsUmVxdWVzdERldGFpbFZpZXcsIHtcbiAgcmVwb3NpdG9yeTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwckRldGFpbFZpZXdfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcbiAgICAgIGlkXG4gICAgICBuYW1lXG4gICAgICBvd25lciB7XG4gICAgICAgIGxvZ2luXG4gICAgICB9XG4gICAgfVxuICBgLFxuXG4gIHB1bGxSZXF1ZXN0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByRGV0YWlsVmlld19wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdFxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgdGltZWxpbmVDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgdGltZWxpbmVDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY29tbWl0Q291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNvbW1pdEN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgICBjaGVja1N1aXRlQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrU3VpdGVDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY2hlY2tSdW5Db3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY2hlY2tSdW5DdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgaWRcbiAgICAgIF9fdHlwZW5hbWVcbiAgICAgIHVybFxuICAgICAgaXNDcm9zc1JlcG9zaXRvcnlcbiAgICAgIGNoYW5nZWRGaWxlc1xuICAgICAgc3RhdGVcbiAgICAgIG51bWJlclxuICAgICAgdGl0bGVcbiAgICAgIGJvZHlIVE1MXG4gICAgICBiYXNlUmVmTmFtZVxuICAgICAgaGVhZFJlZk5hbWVcbiAgICAgIGNvdW50ZWRDb21taXRzOiBjb21taXRzIHtcbiAgICAgICAgdG90YWxDb3VudFxuICAgICAgfVxuICAgICAgYXV0aG9yIHtcbiAgICAgICAgbG9naW5cbiAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgIHVybFxuICAgICAgfVxuXG4gICAgICAuLi5wckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoY29tbWl0Q291bnQ6ICRjb21taXRDb3VudCwgY29tbWl0Q3Vyc29yOiAkY29tbWl0Q3Vyc29yKVxuICAgICAgLi4ucHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgY2hlY2tTdWl0ZUNvdW50OiAkY2hlY2tTdWl0ZUNvdW50XG4gICAgICAgIGNoZWNrU3VpdGVDdXJzb3I6ICRjaGVja1N1aXRlQ3Vyc29yXG4gICAgICAgIGNoZWNrUnVuQ291bnQ6ICRjaGVja1J1bkNvdW50XG4gICAgICAgIGNoZWNrUnVuQ3Vyc29yOiAkY2hlY2tSdW5DdXJzb3JcbiAgICAgIClcbiAgICAgIC4uLnByVGltZWxpbmVDb250cm9sbGVyX3B1bGxSZXF1ZXN0IEBhcmd1bWVudHModGltZWxpbmVDb3VudDogJHRpbWVsaW5lQ291bnQsIHRpbWVsaW5lQ3Vyc29yOiAkdGltZWxpbmVDdXJzb3IpXG4gICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXG4gICAgfVxuICBgLFxufSwgZ3JhcGhxbGBcbiAgcXVlcnkgcHJEZXRhaWxWaWV3UmVmZXRjaFF1ZXJ5XG4gIChcbiAgICAkcmVwb0lkOiBJRCFcbiAgICAkaXNzdWVpc2hJZDogSUQhXG4gICAgJHRpbWVsaW5lQ291bnQ6IEludCFcbiAgICAkdGltZWxpbmVDdXJzb3I6IFN0cmluZ1xuICAgICRjb21taXRDb3VudDogSW50IVxuICAgICRjb21taXRDdXJzb3I6IFN0cmluZ1xuICAgICRjaGVja1N1aXRlQ291bnQ6IEludCFcbiAgICAkY2hlY2tTdWl0ZUN1cnNvcjogU3RyaW5nXG4gICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICAkY2hlY2tSdW5DdXJzb3I6IFN0cmluZ1xuICApIHtcbiAgICByZXBvc2l0b3J5OiBub2RlKGlkOiAkcmVwb0lkKSB7XG4gICAgICAuLi5wckRldGFpbFZpZXdfcmVwb3NpdG9yeVxuICAgIH1cblxuICAgIHB1bGxSZXF1ZXN0OiBub2RlKGlkOiAkaXNzdWVpc2hJZCkge1xuICAgICAgLi4ucHJEZXRhaWxWaWV3X3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgIHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50XG4gICAgICAgIHRpbWVsaW5lQ3Vyc29yOiAkdGltZWxpbmVDdXJzb3JcbiAgICAgICAgY29tbWl0Q291bnQ6ICRjb21taXRDb3VudFxuICAgICAgICBjb21taXRDdXJzb3I6ICRjb21taXRDdXJzb3JcbiAgICAgICAgY2hlY2tTdWl0ZUNvdW50OiAkY2hlY2tTdWl0ZUNvdW50XG4gICAgICAgIGNoZWNrU3VpdGVDdXJzb3I6ICRjaGVja1N1aXRlQ3Vyc29yXG4gICAgICAgIGNoZWNrUnVuQ291bnQ6ICRjaGVja1J1bkNvdW50XG4gICAgICAgIGNoZWNrUnVuQ3Vyc29yOiAkY2hlY2tSdW5DdXJzb3JcbiAgICAgIClcbiAgICB9XG4gIH1cbmApO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxXQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxVQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxXQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSSxVQUFBLEdBQUFKLE9BQUE7QUFFQSxJQUFBSyxXQUFBLEdBQUFMLE9BQUE7QUFDQSxJQUFBTSxjQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxrQkFBQSxHQUFBUixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVEsUUFBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVMsd0JBQUEsR0FBQVYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFVLHFCQUFBLEdBQUFWLE9BQUE7QUFDQSxJQUFBVyxxQkFBQSxHQUFBWixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVkseUJBQUEsR0FBQWIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFhLHFCQUFBLEdBQUFkLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYyxjQUFBLEdBQUFmLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBZSxlQUFBLEdBQUFoQixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWdCLGNBQUEsR0FBQWpCLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBaUIsZUFBQSxHQUFBbEIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFrQixrQkFBQSxHQUFBbkIsc0JBQUEsQ0FB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