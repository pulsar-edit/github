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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlcyIsIl9jbGFzc25hbWVzIiwiX3JlYWN0VGFicyIsIl9wcm9wVHlwZXMyIiwiX3JlcG9ydGVyUHJveHkiLCJfcGVyaW9kaWNSZWZyZXNoZXIiLCJfb2N0aWNvbiIsIl9wckNoYW5nZWRGaWxlc0NvbnRhaW5lciIsIl9wckNoZWNrb3V0Q29udHJvbGxlciIsIl9wclRpbWVsaW5lQ29udHJvbGxlciIsIl9lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIiLCJfZ2l0aHViRG90Y29tTWFya2Rvd24iLCJfaXNzdWVpc2hCYWRnZSIsIl9jaGVja291dEJ1dHRvbiIsIl9wckNvbW1pdHNWaWV3IiwiX3ByU3RhdHVzZXNWaWV3IiwiX3Jldmlld3NGb290ZXJWaWV3IiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsImNhbGwiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsImFyZ3MiLCJyZWZyZXNoaW5nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVmcmVzaGVyIiwicmVmcmVzaE5vdyIsImFkZEV2ZW50IiwicGFja2FnZSIsImNvbXBvbmVudCIsIm5hbWUiLCJpbmRleCIsInByb3BzIiwib25UYWJTZWxlY3RlZCIsImV2ZW50TmFtZSIsInN0YXRlIiwic2V0U3RhdGUiLCJyZWxheSIsInJlZmV0Y2giLCJyZXBvSWQiLCJyZXBvc2l0b3J5IiwiaWQiLCJpc3N1ZWlzaElkIiwicHVsbFJlcXVlc3QiLCJ0aW1lbGluZUNvdW50IiwiUEFHRV9TSVpFIiwidGltZWxpbmVDdXJzb3IiLCJjb21taXRDb3VudCIsImNvbW1pdEN1cnNvciIsImVyciIsInJlcG9ydFJlbGF5RXJyb3IiLCJmb3JjZSIsImNvbXBvbmVudERpZE1vdW50IiwiUGVyaW9kaWNSZWZyZXNoZXIiLCJpbnRlcnZhbCIsImdldEN1cnJlbnRJZCIsInJlZnJlc2giLCJtaW5pbXVtSW50ZXJ2YWxQZXJJZCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsInJlbmRlclByTWV0YWRhdGEiLCJyZXBvIiwiYXV0aG9yIiwiZ2V0QXV0aG9yIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImlzQ3Jvc3NSZXBvc2l0b3J5Iiwib3duZXIiLCJsb2dpbiIsImJhc2VSZWZOYW1lIiwiaGVhZFJlZk5hbWUiLCJyZW5kZXJQdWxsUmVxdWVzdEJvZHkiLCJvbkJyYW5jaCIsImNoZWNrb3V0T3AiLCJ3aHkiLCJjaGVja291dFN0YXRlcyIsIkNVUlJFTlQiLCJUYWJzIiwic2VsZWN0ZWRJbmRleCIsInNlbGVjdGVkVGFiIiwib25TZWxlY3QiLCJUYWJMaXN0IiwiVGFiIiwiaWNvbiIsImNvdW50ZWRDb21taXRzIiwidG90YWxDb3VudCIsImNoYW5nZWRGaWxlcyIsIlRhYlBhbmVsIiwiaHRtbCIsImJvZHlIVE1MIiwic3dpdGNoVG9Jc3N1ZWlzaCIsInJlYWN0YWJsZSIsInRvb2x0aXBzIiwib3BlbkNvbW1pdCIsImRpc3BsYXlUeXBlIiwibG9jYWxSZXBvc2l0b3J5IiwibnVtYmVyIiwiZW5kcG9pbnQiLCJ0b2tlbiIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwiY29uZmlnIiwid29ya2RpclBhdGgiLCJpdGVtVHlwZSIsInJlZkVkaXRvciIsInNob3VsZFJlZmV0Y2giLCJpbml0Q2hhbmdlZEZpbGVQYXRoIiwiaW5pdENoYW5nZWRGaWxlUG9zaXRpb24iLCJvbk9wZW5GaWxlc1RhYiIsInJlbmRlciIsImhyZWYiLCJ1cmwiLCJzcmMiLCJhdmF0YXJVcmwiLCJ0aXRsZSIsImFsdCIsInR5cGUiLCJfX3R5cGVuYW1lIiwiY3giLCJvbkNsaWNrIiwiaGFuZGxlUmVmcmVzaENsaWNrIiwicmVjb3JkT3BlbkluQnJvd3NlckV2ZW50IiwiY2xhc3NOYW1lUHJlZml4IiwiY2xhc3NOYW1lcyIsImNvbW1lbnRzUmVzb2x2ZWQiLCJyZXZpZXdDb21tZW50c1Jlc29sdmVkQ291bnQiLCJ0b3RhbENvbW1lbnRzIiwicmV2aWV3Q29tbWVudHNUb3RhbENvdW50Iiwib3BlblJldmlld3MiLCJwdWxsUmVxdWVzdFVSTCIsIkdIT1NUX1VTRVIiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImJvb2wiLCJvbmVPZiIsIm9iamVjdCIsIkVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSIsImFycmF5T2YiLCJ0aHJlYWQiLCJjb21tZW50cyIsIkVuZHBvaW50UHJvcFR5cGUiLCJJdGVtVHlwZVByb3BUeXBlIiwiUmVmSG9sZGVyUHJvcFR5cGUiLCJfZGVmYXVsdCIsImNyZWF0ZVJlZmV0Y2hDb250YWluZXIiLCJub2RlIiwiaGFzaCIsImNvbnNvbGUiLCJlcnJvciJdLCJzb3VyY2VzIjpbInByLWRldGFpbC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVJlZmV0Y2hDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1RhYiwgVGFicywgVGFiTGlzdCwgVGFiUGFuZWx9IGZyb20gJ3JlYWN0LXRhYnMnO1xuXG5pbXBvcnQge0VuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IFBlcmlvZGljUmVmcmVzaGVyIGZyb20gJy4uL3BlcmlvZGljLXJlZnJlc2hlcic7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFB1bGxSZXF1ZXN0Q2hhbmdlZEZpbGVzQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvcHItY2hhbmdlZC1maWxlcy1jb250YWluZXInO1xuaW1wb3J0IHtjaGVja291dFN0YXRlc30gZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgUHVsbFJlcXVlc3RUaW1lbGluZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcHItdGltZWxpbmUtY29udHJvbGxlcic7XG5pbXBvcnQgRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vtb2ppLXJlYWN0aW9ucy1jb250cm9sbGVyJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi92aWV3cy9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBJc3N1ZWlzaEJhZGdlIGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLWJhZGdlJztcbmltcG9ydCBDaGVja291dEJ1dHRvbiBmcm9tICcuL2NoZWNrb3V0LWJ1dHRvbic7XG5pbXBvcnQgUHVsbFJlcXVlc3RDb21taXRzVmlldyBmcm9tICcuLi92aWV3cy9wci1jb21taXRzLXZpZXcnO1xuaW1wb3J0IFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3IGZyb20gJy4uL3ZpZXdzL3ByLXN0YXR1c2VzLXZpZXcnO1xuaW1wb3J0IFJldmlld3NGb290ZXJWaWV3IGZyb20gJy4uL3ZpZXdzL3Jldmlld3MtZm9vdGVyLXZpZXcnO1xuaW1wb3J0IHtQQUdFX1NJWkUsIEdIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZVB1bGxSZXF1ZXN0RGV0YWlsVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzcG9uc2VcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGNvdW50ZWRDb21taXRzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICB0b3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgaXNDcm9zc1JlcG9zaXRvcnk6IFByb3BUeXBlcy5ib29sLFxuICAgICAgY2hhbmdlZEZpbGVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGJvZHlIVE1MOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgc3RhdGU6IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAgICdPUEVOJywgJ0NMT1NFRCcsICdNRVJHRUQnLFxuICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgIGF1dGhvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIExvY2FsIG1vZGVsIG9iamVjdHNcbiAgICBsb2NhbFJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjaGVja291dE9wOiBFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIFJldmlldyBjb21tZW50IHRocmVhZHNcbiAgICByZXZpZXdDb21tZW50c0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudHNUb3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29ubmVjdGlvbiBpbmZvcm1hdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIGZ1bmN0aW9uc1xuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlblJldmlld3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkZXN0cm95OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBJdGVtIGNvbnRleHRcbiAgICBpdGVtVHlwZTogSXRlbVR5cGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZkVkaXRvcjogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFRhYiBtYW5hZ2VtZW50XG4gICAgaW5pdENoYW5nZWRGaWxlUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbjogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzZWxlY3RlZFRhYjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9uVGFiU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25PcGVuRmlsZXNUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICByZWZyZXNoaW5nOiBmYWxzZSxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaGVyID0gbmV3IFBlcmlvZGljUmVmcmVzaGVyKEJhcmVQdWxsUmVxdWVzdERldGFpbFZpZXcsIHtcbiAgICAgIGludGVydmFsOiAoKSA9PiA1ICogNjAgKiAxMDAwLFxuICAgICAgZ2V0Q3VycmVudElkOiAoKSA9PiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgcmVmcmVzaDogdGhpcy5yZWZyZXNoLFxuICAgICAgbWluaW11bUludGVydmFsUGVySWQ6IDIgKiA2MCAqIDEwMDAsXG4gICAgfSk7XG4gICAgLy8gYXV0by1yZWZyZXNoIGRpc2FibGVkIGZvciBub3cgdW50aWwgcGFnaW5hdGlvbiBpcyBoYW5kbGVkXG4gICAgLy8gdGhpcy5yZWZyZXNoZXIuc3RhcnQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHJlbmRlclByTWV0YWRhdGEocHVsbFJlcXVlc3QsIHJlcG8pIHtcbiAgICBjb25zdCBhdXRob3IgPSB0aGlzLmdldEF1dGhvcihwdWxsUmVxdWVzdCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1tZXRhXCI+XG4gICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYmFzZVJlZk5hbWVcIj57cHVsbFJlcXVlc3QuaXNDcm9zc1JlcG9zaXRvcnkgP1xuICAgICAgICAgIGAke3JlcG8ub3duZXIubG9naW59LyR7cHVsbFJlcXVlc3QuYmFzZVJlZk5hbWV9YCA6IHB1bGxSZXF1ZXN0LmJhc2VSZWZOYW1lfTwvY29kZT57JyDigLkgJ31cbiAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkUmVmTmFtZVwiPntwdWxsUmVxdWVzdC5pc0Nyb3NzUmVwb3NpdG9yeSA/XG4gICAgICAgICAgYCR7YXV0aG9yLmxvZ2lufS8ke3B1bGxSZXF1ZXN0LmhlYWRSZWZOYW1lfWAgOiBwdWxsUmVxdWVzdC5oZWFkUmVmTmFtZX08L2NvZGU+XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclB1bGxSZXF1ZXN0Qm9keShwdWxsUmVxdWVzdCkge1xuICAgIGNvbnN0IG9uQnJhbmNoID0gdGhpcy5wcm9wcy5jaGVja291dE9wLndoeSgpID09PSBjaGVja291dFN0YXRlcy5DVVJSRU5UO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUYWJzIHNlbGVjdGVkSW5kZXg9e3RoaXMucHJvcHMuc2VsZWN0ZWRUYWJ9IG9uU2VsZWN0PXt0aGlzLm9uVGFiU2VsZWN0ZWR9PlxuICAgICAgICA8VGFiTGlzdCBjbGFzc05hbWU9XCJnaXRodWItdGFibGlzdFwiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImluZm9cIiBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIiAvPk92ZXJ2aWV3PC9UYWI+XG4gICAgICAgICAgPFRhYiBjbGFzc05hbWU9XCJnaXRodWItdGFiXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiY2hlY2tsaXN0XCIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCIgLz5cbiAgICAgICAgICAgIEJ1aWxkIFN0YXR1c1xuICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImdpdC1jb21taXRcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgQ29tbWl0c1xuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1jb3VudFwiPlxuICAgICAgICAgICAgICB7cHVsbFJlcXVlc3QuY291bnRlZENvbW1pdHMudG90YWxDb3VudH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICA8VGFiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWJcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJkaWZmXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCJcbiAgICAgICAgICAgIC8+RmlsZXNcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItY291bnRcIj57cHVsbFJlcXVlc3QuY2hhbmdlZEZpbGVzfTwvc3Bhbj5cbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgPC9UYWJMaXN0PlxuICAgICAgICB7LyogJ1Jldmlld3MnIHRhYiB0byBiZSBhZGRlZCBpbiB0aGUgZnV0dXJlLiAqL31cblxuICAgICAgICB7Lyogb3ZlcnZpZXcgKi99XG4gICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctb3ZlcnZpZXdcIj5cbiAgICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgICBodG1sPXtwdWxsUmVxdWVzdC5ib2R5SFRNTCB8fCAnPGVtPk5vIGRlc2NyaXB0aW9uIHByb3ZpZGVkLjwvZW0+J31cbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgcmVhY3RhYmxlPXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UHVsbFJlcXVlc3RUaW1lbGluZUNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgb25CcmFuY2g9e29uQnJhbmNofVxuICAgICAgICAgICAgICBvcGVuQ29tbWl0PXt0aGlzLnByb3BzLm9wZW5Db21taXR9XG4gICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogYnVpbGQgc3RhdHVzICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWJ1aWxkU3RhdHVzXCI+XG4gICAgICAgICAgICA8UHVsbFJlcXVlc3RTdGF0dXNlc1ZpZXdcbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICBkaXNwbGF5VHlwZT1cImZ1bGxcIlxuICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1RhYlBhbmVsPlxuXG4gICAgICAgIHsvKiBjb21taXRzICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPFB1bGxSZXF1ZXN0Q29tbWl0c1ZpZXcgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fSBvbkJyYW5jaD17b25CcmFuY2h9IG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH0gLz5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogZmlsZXMgY2hhbmdlZCAqL31cbiAgICAgICAgPFRhYlBhbmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctZmlsZXNDaGFuZ2VkXCI+XG4gICAgICAgICAgPFB1bGxSZXF1ZXN0Q2hhbmdlZEZpbGVzQ29udGFpbmVyXG4gICAgICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5fVxuXG4gICAgICAgICAgICBvd25lcj17dGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm93bmVyLmxvZ2lufVxuICAgICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm5hbWV9XG4gICAgICAgICAgICBudW1iZXI9e3B1bGxSZXF1ZXN0Lm51bWJlcn1cbiAgICAgICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICAgICAgdG9rZW49e3RoaXMucHJvcHMudG9rZW59XG5cbiAgICAgICAgICAgIHJldmlld0NvbW1lbnRzTG9hZGluZz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c0xvYWRpbmd9XG4gICAgICAgICAgICByZXZpZXdDb21tZW50VGhyZWFkcz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50VGhyZWFkc31cblxuICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgd29ya2RpclBhdGg9e3RoaXMucHJvcHMud29ya2RpclBhdGh9XG5cbiAgICAgICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICAgICAgcmVmRWRpdG9yPXt0aGlzLnByb3BzLnJlZkVkaXRvcn1cbiAgICAgICAgICAgIGRlc3Ryb3k9e3RoaXMucHJvcHMuZGVzdHJveX1cblxuICAgICAgICAgICAgc2hvdWxkUmVmZXRjaD17dGhpcy5zdGF0ZS5yZWZyZXNoaW5nfVxuICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuXG4gICAgICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5wdWxsUmVxdWVzdH1cblxuICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUGF0aD17dGhpcy5wcm9wcy5pbml0Q2hhbmdlZEZpbGVQYXRofVxuICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb249e3RoaXMucHJvcHMuaW5pdENoYW5nZWRGaWxlUG9zaXRpb259XG4gICAgICAgICAgICBvbk9wZW5GaWxlc1RhYj17dGhpcy5wcm9wcy5vbk9wZW5GaWxlc1RhYn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVwbyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgICBjb25zdCBwdWxsUmVxdWVzdCA9IHRoaXMucHJvcHMucHVsbFJlcXVlc3Q7XG4gICAgY29uc3QgYXV0aG9yID0gdGhpcy5nZXRBdXRob3IocHVsbFJlcXVlc3QpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldyBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jb250YWluZXJcIj5cblxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW5cIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1hdmF0YXJcIiBocmVmPXthdXRob3IudXJsfT5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYXZhdGFySW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uIGlzLWZsZXhpYmxlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3cgaXMtZnVsbHdpZHRoXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy10aXRsZVwiIGhyZWY9e3B1bGxSZXF1ZXN0LnVybH0+e3B1bGxSZXF1ZXN0LnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3dcIj5cbiAgICAgICAgICAgICAgICA8SXNzdWVpc2hCYWRnZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckJhZGdlXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9e3B1bGxSZXF1ZXN0Ll9fdHlwZW5hbWV9XG4gICAgICAgICAgICAgICAgICBzdGF0ZT17cHVsbFJlcXVlc3Quc3RhdGV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cInJlcG8tc3luY1wiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJlZnJlc2hCdXR0b24nLCB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5yZWZyZXNoaW5nfSl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlZnJlc2hDbGlja31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIm9wZW4gb24gR2l0SHViLmNvbVwiXG4gICAgICAgICAgICAgICAgICBocmVmPXtwdWxsUmVxdWVzdC51cmx9IG9uQ2xpY2s9e3RoaXMucmVjb3JkT3BlbkluQnJvd3NlckV2ZW50fT5cbiAgICAgICAgICAgICAgICAgIHtyZXBvLm93bmVyLmxvZ2lufS97cmVwby5uYW1lfSN7cHVsbFJlcXVlc3QubnVtYmVyfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclN0YXR1c1wiPlxuICAgICAgICAgICAgICAgICAgPFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3XG4gICAgICAgICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVR5cGU9XCJjaGVja1wiXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJvd1wiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclByTWV0YWRhdGEocHVsbFJlcXVlc3QsIHJlcG8pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uXCI+XG4gICAgICAgICAgICAgIDxDaGVja291dEJ1dHRvblxuICAgICAgICAgICAgICAgIGNoZWNrb3V0T3A9e3RoaXMucHJvcHMuY2hlY2tvdXRPcH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWVQcmVmaXg9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWNoZWNrb3V0QnV0dG9uLS1cIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9e1snZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jaGVja291dEJ1dHRvbiddfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9oZWFkZXI+XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQdWxsUmVxdWVzdEJvZHkocHVsbFJlcXVlc3QpfVxuXG4gICAgICAgICAgPFJldmlld3NGb290ZXJWaWV3XG4gICAgICAgICAgICBjb21tZW50c1Jlc29sdmVkPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudH1cbiAgICAgICAgICAgIHRvdGFsQ29tbWVudHM9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudHNUb3RhbENvdW50fVxuICAgICAgICAgICAgb3BlblJldmlld3M9e3RoaXMucHJvcHMub3BlblJldmlld3N9XG4gICAgICAgICAgICBwdWxsUmVxdWVzdFVSTD17YCR7dGhpcy5wcm9wcy5wdWxsUmVxdWVzdC51cmx9L2ZpbGVzYH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVSZWZyZXNoQ2xpY2sgPSBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5yZWZyZXNoZXIucmVmcmVzaE5vdyh0cnVlKTtcbiAgfVxuXG4gIHJlY29yZE9wZW5JbkJyb3dzZXJFdmVudCA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1wdWxsLXJlcXVlc3QtaW4tYnJvd3NlcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9uVGFiU2VsZWN0ZWQgPSBpbmRleCA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblRhYlNlbGVjdGVkKGluZGV4KTtcbiAgICBjb25zdCBldmVudE5hbWUgPSBbXG4gICAgICAnb3Blbi1wci10YWItb3ZlcnZpZXcnLFxuICAgICAgJ29wZW4tcHItdGFiLWJ1aWxkLXN0YXR1cycsXG4gICAgICAnb3Blbi1wci10YWItY29tbWl0cycsXG4gICAgICAnb3Blbi1wci10YWItZmlsZXMtY2hhbmdlZCcsXG4gICAgXVtpbmRleF07XG4gICAgYWRkRXZlbnQoZXZlbnROYW1lLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICByZWZyZXNoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlZnJlc2hpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtyZWZyZXNoaW5nOiB0cnVlfSk7XG4gICAgdGhpcy5wcm9wcy5yZWxheS5yZWZldGNoKHtcbiAgICAgIHJlcG9JZDogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlkLFxuICAgICAgaXNzdWVpc2hJZDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgIHRpbWVsaW5lQ291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWl0Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIGNvbW1pdEN1cnNvcjogbnVsbCxcbiAgICB9LCBudWxsLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZWZyZXNoIHB1bGwgcmVxdWVzdCBkZXRhaWxzJywgZXJyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3JlZnJlc2hpbmc6IGZhbHNlfSk7XG4gICAgfSwge2ZvcmNlOiB0cnVlfSk7XG4gIH1cblxuICBnZXRBdXRob3IocHVsbFJlcXVlc3QpIHtcbiAgICByZXR1cm4gcHVsbFJlcXVlc3QuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUmVmZXRjaENvbnRhaW5lcihCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3LCB7XG4gIHJlcG9zaXRvcnk6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gICAgICBpZFxuICAgICAgbmFtZVxuICAgICAgb3duZXIge1xuICAgICAgICBsb2dpblxuICAgICAgfVxuICAgIH1cbiAgYCxcblxuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwckRldGFpbFZpZXdfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3RcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIHRpbWVsaW5lQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNvbW1pdENvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjb21taXRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNoZWNrUnVuQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIGlkXG4gICAgICBfX3R5cGVuYW1lXG4gICAgICB1cmxcbiAgICAgIGlzQ3Jvc3NSZXBvc2l0b3J5XG4gICAgICBjaGFuZ2VkRmlsZXNcbiAgICAgIHN0YXRlXG4gICAgICBudW1iZXJcbiAgICAgIHRpdGxlXG4gICAgICBib2R5SFRNTFxuICAgICAgYmFzZVJlZk5hbWVcbiAgICAgIGhlYWRSZWZOYW1lXG4gICAgICBjb3VudGVkQ29tbWl0czogY29tbWl0cyB7XG4gICAgICAgIHRvdGFsQ291bnRcbiAgICAgIH1cbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGxvZ2luXG4gICAgICAgIGF2YXRhclVybFxuICAgICAgICB1cmxcbiAgICAgIH1cblxuICAgICAgLi4ucHJDb21taXRzVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKGNvbW1pdENvdW50OiAkY29tbWl0Q291bnQsIGNvbW1pdEN1cnNvcjogJGNvbW1pdEN1cnNvcilcbiAgICAgIC4uLnByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApXG4gICAgICAuLi5wclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LCB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yKVxuICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgIH1cbiAgYCxcbn0sIGdyYXBocWxgXG4gIHF1ZXJ5IHByRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVxuICAoXG4gICAgJHJlcG9JZDogSUQhXG4gICAgJGlzc3VlaXNoSWQ6IElEIVxuICAgICR0aW1lbGluZUNvdW50OiBJbnQhXG4gICAgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmdcbiAgICAkY29tbWl0Q291bnQ6IEludCFcbiAgICAkY29tbWl0Q3Vyc29yOiBTdHJpbmdcbiAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgJGNoZWNrU3VpdGVDdXJzb3I6IFN0cmluZ1xuICAgICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgKSB7XG4gICAgcmVwb3NpdG9yeTogbm9kZShpZDogJHJlcG9JZCkge1xuICAgICAgLi4ucHJEZXRhaWxWaWV3X3JlcG9zaXRvcnlcbiAgICB9XG5cbiAgICBwdWxsUmVxdWVzdDogbm9kZShpZDogJGlzc3VlaXNoSWQpIHtcbiAgICAgIC4uLnByRGV0YWlsVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICB0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudFxuICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yXG4gICAgICAgIGNvbW1pdENvdW50OiAkY29tbWl0Q291bnRcbiAgICAgICAgY29tbWl0Q3Vyc29yOiAkY29tbWl0Q3Vyc29yXG4gICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApXG4gICAgfVxuICB9XG5gKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsV0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsVUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUcsV0FBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUksVUFBQSxHQUFBSixPQUFBO0FBRUEsSUFBQUssV0FBQSxHQUFBTCxPQUFBO0FBQ0EsSUFBQU0sY0FBQSxHQUFBTixPQUFBO0FBQ0EsSUFBQU8sa0JBQUEsR0FBQVIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFRLFFBQUEsR0FBQVQsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFTLHdCQUFBLEdBQUFWLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVSxxQkFBQSxHQUFBVixPQUFBO0FBQ0EsSUFBQVcscUJBQUEsR0FBQVosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFZLHlCQUFBLEdBQUFiLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYSxxQkFBQSxHQUFBZCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWMsY0FBQSxHQUFBZixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWUsZUFBQSxHQUFBaEIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFnQixjQUFBLEdBQUFqQixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWlCLGVBQUEsR0FBQWxCLHNCQUFB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