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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZWZyZXNoaW5nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVmcmVzaGVyIiwicmVmcmVzaE5vdyIsImFkZEV2ZW50IiwicGFja2FnZSIsImNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsImluZGV4IiwicHJvcHMiLCJvblRhYlNlbGVjdGVkIiwiZXZlbnROYW1lIiwic3RhdGUiLCJzZXRTdGF0ZSIsInJlbGF5IiwicmVmZXRjaCIsInJlcG9JZCIsInJlcG9zaXRvcnkiLCJpZCIsImlzc3VlaXNoSWQiLCJwdWxsUmVxdWVzdCIsInRpbWVsaW5lQ291bnQiLCJQQUdFX1NJWkUiLCJ0aW1lbGluZUN1cnNvciIsImNvbW1pdENvdW50IiwiY29tbWl0Q3Vyc29yIiwiZXJyIiwicmVwb3J0UmVsYXlFcnJvciIsImZvcmNlIiwiY29tcG9uZW50RGlkTW91bnQiLCJQZXJpb2RpY1JlZnJlc2hlciIsImludGVydmFsIiwiZ2V0Q3VycmVudElkIiwicmVmcmVzaCIsIm1pbmltdW1JbnRlcnZhbFBlcklkIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkZXN0cm95IiwicmVuZGVyUHJNZXRhZGF0YSIsInJlcG8iLCJhdXRob3IiLCJnZXRBdXRob3IiLCJpc0Nyb3NzUmVwb3NpdG9yeSIsIm93bmVyIiwibG9naW4iLCJiYXNlUmVmTmFtZSIsImhlYWRSZWZOYW1lIiwicmVuZGVyUHVsbFJlcXVlc3RCb2R5Iiwib25CcmFuY2giLCJjaGVja291dE9wIiwid2h5IiwiY2hlY2tvdXRTdGF0ZXMiLCJDVVJSRU5UIiwic2VsZWN0ZWRUYWIiLCJjb3VudGVkQ29tbWl0cyIsInRvdGFsQ291bnQiLCJjaGFuZ2VkRmlsZXMiLCJib2R5SFRNTCIsInN3aXRjaFRvSXNzdWVpc2giLCJ0b29sdGlwcyIsIm9wZW5Db21taXQiLCJsb2NhbFJlcG9zaXRvcnkiLCJudW1iZXIiLCJlbmRwb2ludCIsInRva2VuIiwicmV2aWV3Q29tbWVudHNMb2FkaW5nIiwicmV2aWV3Q29tbWVudFRocmVhZHMiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImtleW1hcHMiLCJjb25maWciLCJ3b3JrZGlyUGF0aCIsIml0ZW1UeXBlIiwicmVmRWRpdG9yIiwiaW5pdENoYW5nZWRGaWxlUGF0aCIsImluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uIiwib25PcGVuRmlsZXNUYWIiLCJyZW5kZXIiLCJ1cmwiLCJhdmF0YXJVcmwiLCJ0aXRsZSIsIl9fdHlwZW5hbWUiLCJjeCIsImhhbmRsZVJlZnJlc2hDbGljayIsInJlY29yZE9wZW5JbkJyb3dzZXJFdmVudCIsInJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudCIsInJldmlld0NvbW1lbnRzVG90YWxDb3VudCIsIm9wZW5SZXZpZXdzIiwiR0hPU1RfVVNFUiIsIlByb3BUeXBlcyIsInNoYXBlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJib29sIiwib25lT2YiLCJvYmplY3QiLCJFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUiLCJhcnJheU9mIiwidGhyZWFkIiwiY29tbWVudHMiLCJFbmRwb2ludFByb3BUeXBlIiwiSXRlbVR5cGVQcm9wVHlwZSIsIlJlZkhvbGRlclByb3BUeXBlIiwiY3JlYXRlUmVmZXRjaENvbnRhaW5lciJdLCJzb3VyY2VzIjpbInByLWRldGFpbC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVJlZmV0Y2hDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1RhYiwgVGFicywgVGFiTGlzdCwgVGFiUGFuZWx9IGZyb20gJ3JlYWN0LXRhYnMnO1xuXG5pbXBvcnQge0VuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IFBlcmlvZGljUmVmcmVzaGVyIGZyb20gJy4uL3BlcmlvZGljLXJlZnJlc2hlcic7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFB1bGxSZXF1ZXN0Q2hhbmdlZEZpbGVzQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvcHItY2hhbmdlZC1maWxlcy1jb250YWluZXInO1xuaW1wb3J0IHtjaGVja291dFN0YXRlc30gZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgUHVsbFJlcXVlc3RUaW1lbGluZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcHItdGltZWxpbmUtY29udHJvbGxlcic7XG5pbXBvcnQgRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vtb2ppLXJlYWN0aW9ucy1jb250cm9sbGVyJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi92aWV3cy9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBJc3N1ZWlzaEJhZGdlIGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLWJhZGdlJztcbmltcG9ydCBDaGVja291dEJ1dHRvbiBmcm9tICcuL2NoZWNrb3V0LWJ1dHRvbic7XG5pbXBvcnQgUHVsbFJlcXVlc3RDb21taXRzVmlldyBmcm9tICcuLi92aWV3cy9wci1jb21taXRzLXZpZXcnO1xuaW1wb3J0IFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3IGZyb20gJy4uL3ZpZXdzL3ByLXN0YXR1c2VzLXZpZXcnO1xuaW1wb3J0IFJldmlld3NGb290ZXJWaWV3IGZyb20gJy4uL3ZpZXdzL3Jldmlld3MtZm9vdGVyLXZpZXcnO1xuaW1wb3J0IHtQQUdFX1NJWkUsIEdIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZVB1bGxSZXF1ZXN0RGV0YWlsVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzcG9uc2VcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGNvdW50ZWRDb21taXRzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICB0b3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgaXNDcm9zc1JlcG9zaXRvcnk6IFByb3BUeXBlcy5ib29sLFxuICAgICAgY2hhbmdlZEZpbGVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGJvZHlIVE1MOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgc3RhdGU6IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAgICdPUEVOJywgJ0NMT1NFRCcsICdNRVJHRUQnLFxuICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgIGF1dGhvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIExvY2FsIG1vZGVsIG9iamVjdHNcbiAgICBsb2NhbFJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjaGVja291dE9wOiBFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIFJldmlldyBjb21tZW50IHRocmVhZHNcbiAgICByZXZpZXdDb21tZW50c0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudHNUb3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29ubmVjdGlvbiBpbmZvcm1hdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIGZ1bmN0aW9uc1xuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlblJldmlld3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkZXN0cm95OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBJdGVtIGNvbnRleHRcbiAgICBpdGVtVHlwZTogSXRlbVR5cGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZkVkaXRvcjogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFRhYiBtYW5hZ2VtZW50XG4gICAgaW5pdENoYW5nZWRGaWxlUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbjogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzZWxlY3RlZFRhYjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9uVGFiU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25PcGVuRmlsZXNUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICByZWZyZXNoaW5nOiBmYWxzZSxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaGVyID0gbmV3IFBlcmlvZGljUmVmcmVzaGVyKEJhcmVQdWxsUmVxdWVzdERldGFpbFZpZXcsIHtcbiAgICAgIGludGVydmFsOiAoKSA9PiA1ICogNjAgKiAxMDAwLFxuICAgICAgZ2V0Q3VycmVudElkOiAoKSA9PiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgcmVmcmVzaDogdGhpcy5yZWZyZXNoLFxuICAgICAgbWluaW11bUludGVydmFsUGVySWQ6IDIgKiA2MCAqIDEwMDAsXG4gICAgfSk7XG4gICAgLy8gYXV0by1yZWZyZXNoIGRpc2FibGVkIGZvciBub3cgdW50aWwgcGFnaW5hdGlvbiBpcyBoYW5kbGVkXG4gICAgLy8gdGhpcy5yZWZyZXNoZXIuc3RhcnQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHJlbmRlclByTWV0YWRhdGEocHVsbFJlcXVlc3QsIHJlcG8pIHtcbiAgICBjb25zdCBhdXRob3IgPSB0aGlzLmdldEF1dGhvcihwdWxsUmVxdWVzdCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1tZXRhXCI+XG4gICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYmFzZVJlZk5hbWVcIj57cHVsbFJlcXVlc3QuaXNDcm9zc1JlcG9zaXRvcnkgP1xuICAgICAgICAgIGAke3JlcG8ub3duZXIubG9naW59LyR7cHVsbFJlcXVlc3QuYmFzZVJlZk5hbWV9YCA6IHB1bGxSZXF1ZXN0LmJhc2VSZWZOYW1lfTwvY29kZT57JyDigLkgJ31cbiAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkUmVmTmFtZVwiPntwdWxsUmVxdWVzdC5pc0Nyb3NzUmVwb3NpdG9yeSA/XG4gICAgICAgICAgYCR7YXV0aG9yLmxvZ2lufS8ke3B1bGxSZXF1ZXN0LmhlYWRSZWZOYW1lfWAgOiBwdWxsUmVxdWVzdC5oZWFkUmVmTmFtZX08L2NvZGU+XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclB1bGxSZXF1ZXN0Qm9keShwdWxsUmVxdWVzdCkge1xuICAgIGNvbnN0IG9uQnJhbmNoID0gdGhpcy5wcm9wcy5jaGVja291dE9wLndoeSgpID09PSBjaGVja291dFN0YXRlcy5DVVJSRU5UO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUYWJzIHNlbGVjdGVkSW5kZXg9e3RoaXMucHJvcHMuc2VsZWN0ZWRUYWJ9IG9uU2VsZWN0PXt0aGlzLm9uVGFiU2VsZWN0ZWR9PlxuICAgICAgICA8VGFiTGlzdCBjbGFzc05hbWU9XCJnaXRodWItdGFibGlzdFwiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImluZm9cIiBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIiAvPk92ZXJ2aWV3PC9UYWI+XG4gICAgICAgICAgPFRhYiBjbGFzc05hbWU9XCJnaXRodWItdGFiXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiY2hlY2tsaXN0XCIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCIgLz5cbiAgICAgICAgICAgIEJ1aWxkIFN0YXR1c1xuICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImdpdC1jb21taXRcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgQ29tbWl0c1xuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1jb3VudFwiPlxuICAgICAgICAgICAgICB7cHVsbFJlcXVlc3QuY291bnRlZENvbW1pdHMudG90YWxDb3VudH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICA8VGFiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWJcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJkaWZmXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCJcbiAgICAgICAgICAgIC8+RmlsZXNcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItY291bnRcIj57cHVsbFJlcXVlc3QuY2hhbmdlZEZpbGVzfTwvc3Bhbj5cbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgPC9UYWJMaXN0PlxuICAgICAgICB7LyogJ1Jldmlld3MnIHRhYiB0byBiZSBhZGRlZCBpbiB0aGUgZnV0dXJlLiAqL31cblxuICAgICAgICB7Lyogb3ZlcnZpZXcgKi99XG4gICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctb3ZlcnZpZXdcIj5cbiAgICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgICBodG1sPXtwdWxsUmVxdWVzdC5ib2R5SFRNTCB8fCAnPGVtPk5vIGRlc2NyaXB0aW9uIHByb3ZpZGVkLjwvZW0+J31cbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgcmVhY3RhYmxlPXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UHVsbFJlcXVlc3RUaW1lbGluZUNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgb25CcmFuY2g9e29uQnJhbmNofVxuICAgICAgICAgICAgICBvcGVuQ29tbWl0PXt0aGlzLnByb3BzLm9wZW5Db21taXR9XG4gICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogYnVpbGQgc3RhdHVzICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWJ1aWxkU3RhdHVzXCI+XG4gICAgICAgICAgICA8UHVsbFJlcXVlc3RTdGF0dXNlc1ZpZXdcbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICBkaXNwbGF5VHlwZT1cImZ1bGxcIlxuICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1RhYlBhbmVsPlxuXG4gICAgICAgIHsvKiBjb21taXRzICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPFB1bGxSZXF1ZXN0Q29tbWl0c1ZpZXcgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fSBvbkJyYW5jaD17b25CcmFuY2h9IG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH0gLz5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogZmlsZXMgY2hhbmdlZCAqL31cbiAgICAgICAgPFRhYlBhbmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctZmlsZXNDaGFuZ2VkXCI+XG4gICAgICAgICAgPFB1bGxSZXF1ZXN0Q2hhbmdlZEZpbGVzQ29udGFpbmVyXG4gICAgICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5fVxuXG4gICAgICAgICAgICBvd25lcj17dGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm93bmVyLmxvZ2lufVxuICAgICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm5hbWV9XG4gICAgICAgICAgICBudW1iZXI9e3B1bGxSZXF1ZXN0Lm51bWJlcn1cbiAgICAgICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICAgICAgdG9rZW49e3RoaXMucHJvcHMudG9rZW59XG5cbiAgICAgICAgICAgIHJldmlld0NvbW1lbnRzTG9hZGluZz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c0xvYWRpbmd9XG4gICAgICAgICAgICByZXZpZXdDb21tZW50VGhyZWFkcz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50VGhyZWFkc31cblxuICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgd29ya2RpclBhdGg9e3RoaXMucHJvcHMud29ya2RpclBhdGh9XG5cbiAgICAgICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICAgICAgcmVmRWRpdG9yPXt0aGlzLnByb3BzLnJlZkVkaXRvcn1cbiAgICAgICAgICAgIGRlc3Ryb3k9e3RoaXMucHJvcHMuZGVzdHJveX1cblxuICAgICAgICAgICAgc2hvdWxkUmVmZXRjaD17dGhpcy5zdGF0ZS5yZWZyZXNoaW5nfVxuICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuXG4gICAgICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5wdWxsUmVxdWVzdH1cblxuICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUGF0aD17dGhpcy5wcm9wcy5pbml0Q2hhbmdlZEZpbGVQYXRofVxuICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb249e3RoaXMucHJvcHMuaW5pdENoYW5nZWRGaWxlUG9zaXRpb259XG4gICAgICAgICAgICBvbk9wZW5GaWxlc1RhYj17dGhpcy5wcm9wcy5vbk9wZW5GaWxlc1RhYn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVwbyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgICBjb25zdCBwdWxsUmVxdWVzdCA9IHRoaXMucHJvcHMucHVsbFJlcXVlc3Q7XG4gICAgY29uc3QgYXV0aG9yID0gdGhpcy5nZXRBdXRob3IocHVsbFJlcXVlc3QpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldyBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jb250YWluZXJcIj5cblxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW5cIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1hdmF0YXJcIiBocmVmPXthdXRob3IudXJsfT5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYXZhdGFySW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uIGlzLWZsZXhpYmxlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3cgaXMtZnVsbHdpZHRoXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy10aXRsZVwiIGhyZWY9e3B1bGxSZXF1ZXN0LnVybH0+e3B1bGxSZXF1ZXN0LnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3dcIj5cbiAgICAgICAgICAgICAgICA8SXNzdWVpc2hCYWRnZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckJhZGdlXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9e3B1bGxSZXF1ZXN0Ll9fdHlwZW5hbWV9XG4gICAgICAgICAgICAgICAgICBzdGF0ZT17cHVsbFJlcXVlc3Quc3RhdGV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cInJlcG8tc3luY1wiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJlZnJlc2hCdXR0b24nLCB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5yZWZyZXNoaW5nfSl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlZnJlc2hDbGlja31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIm9wZW4gb24gR2l0SHViLmNvbVwiXG4gICAgICAgICAgICAgICAgICBocmVmPXtwdWxsUmVxdWVzdC51cmx9IG9uQ2xpY2s9e3RoaXMucmVjb3JkT3BlbkluQnJvd3NlckV2ZW50fT5cbiAgICAgICAgICAgICAgICAgIHtyZXBvLm93bmVyLmxvZ2lufS97cmVwby5uYW1lfSN7cHVsbFJlcXVlc3QubnVtYmVyfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclN0YXR1c1wiPlxuICAgICAgICAgICAgICAgICAgPFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3XG4gICAgICAgICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVR5cGU9XCJjaGVja1wiXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJvd1wiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclByTWV0YWRhdGEocHVsbFJlcXVlc3QsIHJlcG8pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uXCI+XG4gICAgICAgICAgICAgIDxDaGVja291dEJ1dHRvblxuICAgICAgICAgICAgICAgIGNoZWNrb3V0T3A9e3RoaXMucHJvcHMuY2hlY2tvdXRPcH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWVQcmVmaXg9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWNoZWNrb3V0QnV0dG9uLS1cIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9e1snZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jaGVja291dEJ1dHRvbiddfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9oZWFkZXI+XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQdWxsUmVxdWVzdEJvZHkocHVsbFJlcXVlc3QpfVxuXG4gICAgICAgICAgPFJldmlld3NGb290ZXJWaWV3XG4gICAgICAgICAgICBjb21tZW50c1Jlc29sdmVkPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudH1cbiAgICAgICAgICAgIHRvdGFsQ29tbWVudHM9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudHNUb3RhbENvdW50fVxuICAgICAgICAgICAgb3BlblJldmlld3M9e3RoaXMucHJvcHMub3BlblJldmlld3N9XG4gICAgICAgICAgICBwdWxsUmVxdWVzdFVSTD17YCR7dGhpcy5wcm9wcy5wdWxsUmVxdWVzdC51cmx9L2ZpbGVzYH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVSZWZyZXNoQ2xpY2sgPSBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5yZWZyZXNoZXIucmVmcmVzaE5vdyh0cnVlKTtcbiAgfVxuXG4gIHJlY29yZE9wZW5JbkJyb3dzZXJFdmVudCA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1wdWxsLXJlcXVlc3QtaW4tYnJvd3NlcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9uVGFiU2VsZWN0ZWQgPSBpbmRleCA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblRhYlNlbGVjdGVkKGluZGV4KTtcbiAgICBjb25zdCBldmVudE5hbWUgPSBbXG4gICAgICAnb3Blbi1wci10YWItb3ZlcnZpZXcnLFxuICAgICAgJ29wZW4tcHItdGFiLWJ1aWxkLXN0YXR1cycsXG4gICAgICAnb3Blbi1wci10YWItY29tbWl0cycsXG4gICAgICAnb3Blbi1wci10YWItZmlsZXMtY2hhbmdlZCcsXG4gICAgXVtpbmRleF07XG4gICAgYWRkRXZlbnQoZXZlbnROYW1lLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICByZWZyZXNoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlZnJlc2hpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtyZWZyZXNoaW5nOiB0cnVlfSk7XG4gICAgdGhpcy5wcm9wcy5yZWxheS5yZWZldGNoKHtcbiAgICAgIHJlcG9JZDogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlkLFxuICAgICAgaXNzdWVpc2hJZDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgIHRpbWVsaW5lQ291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWl0Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIGNvbW1pdEN1cnNvcjogbnVsbCxcbiAgICB9LCBudWxsLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZWZyZXNoIHB1bGwgcmVxdWVzdCBkZXRhaWxzJywgZXJyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3JlZnJlc2hpbmc6IGZhbHNlfSk7XG4gICAgfSwge2ZvcmNlOiB0cnVlfSk7XG4gIH1cblxuICBnZXRBdXRob3IocHVsbFJlcXVlc3QpIHtcbiAgICByZXR1cm4gcHVsbFJlcXVlc3QuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUmVmZXRjaENvbnRhaW5lcihCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3LCB7XG4gIHJlcG9zaXRvcnk6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gICAgICBpZFxuICAgICAgbmFtZVxuICAgICAgb3duZXIge1xuICAgICAgICBsb2dpblxuICAgICAgfVxuICAgIH1cbiAgYCxcblxuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwckRldGFpbFZpZXdfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3RcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIHRpbWVsaW5lQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNvbW1pdENvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjb21taXRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNoZWNrUnVuQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIGlkXG4gICAgICBfX3R5cGVuYW1lXG4gICAgICB1cmxcbiAgICAgIGlzQ3Jvc3NSZXBvc2l0b3J5XG4gICAgICBjaGFuZ2VkRmlsZXNcbiAgICAgIHN0YXRlXG4gICAgICBudW1iZXJcbiAgICAgIHRpdGxlXG4gICAgICBib2R5SFRNTFxuICAgICAgYmFzZVJlZk5hbWVcbiAgICAgIGhlYWRSZWZOYW1lXG4gICAgICBjb3VudGVkQ29tbWl0czogY29tbWl0cyB7XG4gICAgICAgIHRvdGFsQ291bnRcbiAgICAgIH1cbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGxvZ2luXG4gICAgICAgIGF2YXRhclVybFxuICAgICAgICB1cmxcbiAgICAgIH1cblxuICAgICAgLi4ucHJDb21taXRzVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKGNvbW1pdENvdW50OiAkY29tbWl0Q291bnQsIGNvbW1pdEN1cnNvcjogJGNvbW1pdEN1cnNvcilcbiAgICAgIC4uLnByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApXG4gICAgICAuLi5wclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LCB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yKVxuICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgIH1cbiAgYCxcbn0sIGdyYXBocWxgXG4gIHF1ZXJ5IHByRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVxuICAoXG4gICAgJHJlcG9JZDogSUQhXG4gICAgJGlzc3VlaXNoSWQ6IElEIVxuICAgICR0aW1lbGluZUNvdW50OiBJbnQhXG4gICAgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmdcbiAgICAkY29tbWl0Q291bnQ6IEludCFcbiAgICAkY29tbWl0Q3Vyc29yOiBTdHJpbmdcbiAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgJGNoZWNrU3VpdGVDdXJzb3I6IFN0cmluZ1xuICAgICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgKSB7XG4gICAgcmVwb3NpdG9yeTogbm9kZShpZDogJHJlcG9JZCkge1xuICAgICAgLi4ucHJEZXRhaWxWaWV3X3JlcG9zaXRvcnlcbiAgICB9XG5cbiAgICBwdWxsUmVxdWVzdDogbm9kZShpZDogJGlzc3VlaXNoSWQpIHtcbiAgICAgIC4uLnByRGV0YWlsVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICB0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudFxuICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yXG4gICAgICAgIGNvbW1pdENvdW50OiAkY29tbWl0Q291bnRcbiAgICAgICAgY29tbWl0Q3Vyc29yOiAkY29tbWl0Q3Vyc29yXG4gICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApXG4gICAgfVxuICB9XG5gKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFpRDtBQUFBO0FBQUE7QUFBQTtBQUUxQyxNQUFNQSx5QkFBeUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEsK0JBK0VyRDtNQUNOQyxVQUFVLEVBQUU7SUFDZCxDQUFDO0lBQUEsNENBa05vQkMsQ0FBQyxJQUFJO01BQ3hCQSxDQUFDLENBQUNDLGNBQWMsRUFBRTtNQUNsQixJQUFJLENBQUNDLFNBQVMsQ0FBQ0MsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQUEsa0RBRTBCLE1BQU07TUFDL0IsSUFBQUMsdUJBQVEsRUFBQyw4QkFBOEIsRUFBRTtRQUFDQyxPQUFPLEVBQUUsUUFBUTtRQUFFQyxTQUFTLEVBQUUsSUFBSSxDQUFDQyxXQUFXLENBQUNDO01BQUksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFBQSx1Q0FFZUMsS0FBSyxJQUFJO01BQ3ZCLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxhQUFhLENBQUNGLEtBQUssQ0FBQztNQUMvQixNQUFNRyxTQUFTLEdBQUcsQ0FDaEIsc0JBQXNCLEVBQ3RCLDBCQUEwQixFQUMxQixxQkFBcUIsRUFDckIsMkJBQTJCLENBQzVCLENBQUNILEtBQUssQ0FBQztNQUNSLElBQUFMLHVCQUFRLEVBQUNRLFNBQVMsRUFBRTtRQUFDUCxPQUFPLEVBQUUsUUFBUTtRQUFFQyxTQUFTLEVBQUUsSUFBSSxDQUFDQyxXQUFXLENB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