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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    }); // auto-refresh disabled for now until pagination is handled
    // this.refresher.start();
  }

  componentWillUnmount() {
    this.refresher.destroy();
  }

  renderPrMetadata(pullRequest, repo) {
    const author = this.getAuthor(pullRequest);
    return /*#__PURE__*/_react.default.createElement("span", {
      className: "github-IssueishDetailView-meta"
    }, /*#__PURE__*/_react.default.createElement("code", {
      className: "github-IssueishDetailView-baseRefName"
    }, pullRequest.isCrossRepository ? `${repo.owner.login}/${pullRequest.baseRefName}` : pullRequest.baseRefName), ' ‹ ', /*#__PURE__*/_react.default.createElement("code", {
      className: "github-IssueishDetailView-headRefName"
    }, pullRequest.isCrossRepository ? `${author.login}/${pullRequest.headRefName}` : pullRequest.headRefName));
  }

  renderPullRequestBody(pullRequest) {
    const onBranch = this.props.checkoutOp.why() === _prCheckoutController.checkoutStates.CURRENT;

    return /*#__PURE__*/_react.default.createElement(_reactTabs.Tabs, {
      selectedIndex: this.props.selectedTab,
      onSelect: this.onTabSelected
    }, /*#__PURE__*/_react.default.createElement(_reactTabs.TabList, {
      className: "github-tablist"
    }, /*#__PURE__*/_react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "info",
      className: "github-tab-icon"
    }), "Overview"), /*#__PURE__*/_react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "checklist",
      className: "github-tab-icon"
    }), "Build Status"), /*#__PURE__*/_react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "git-commit",
      className: "github-tab-icon"
    }), "Commits", /*#__PURE__*/_react.default.createElement("span", {
      className: "github-tab-count"
    }, pullRequest.countedCommits.totalCount)), /*#__PURE__*/_react.default.createElement(_reactTabs.Tab, {
      className: "github-tab"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "diff",
      className: "github-tab-icon"
    }), "Files", /*#__PURE__*/_react.default.createElement("span", {
      className: "github-tab-count"
    }, pullRequest.changedFiles))), /*#__PURE__*/_react.default.createElement(_reactTabs.TabPanel, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-overview"
    }, /*#__PURE__*/_react.default.createElement(_githubDotcomMarkdown.default, {
      html: pullRequest.bodyHTML || '<em>No description provided.</em>',
      switchToIssueish: this.props.switchToIssueish
    }), /*#__PURE__*/_react.default.createElement(_emojiReactionsController.default, {
      reactable: pullRequest,
      tooltips: this.props.tooltips,
      reportRelayError: this.props.reportRelayError
    }), /*#__PURE__*/_react.default.createElement(_prTimelineController.default, {
      onBranch: onBranch,
      openCommit: this.props.openCommit,
      pullRequest: pullRequest,
      switchToIssueish: this.props.switchToIssueish
    }))), /*#__PURE__*/_react.default.createElement(_reactTabs.TabPanel, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-buildStatus"
    }, /*#__PURE__*/_react.default.createElement(_prStatusesView.default, {
      pullRequest: pullRequest,
      displayType: "full",
      switchToIssueish: this.props.switchToIssueish
    }))), /*#__PURE__*/_react.default.createElement(_reactTabs.TabPanel, null, /*#__PURE__*/_react.default.createElement(_prCommitsView.default, {
      pullRequest: pullRequest,
      onBranch: onBranch,
      openCommit: this.props.openCommit
    })), /*#__PURE__*/_react.default.createElement(_reactTabs.TabPanel, {
      className: "github-IssueishDetailView-filesChanged"
    }, /*#__PURE__*/_react.default.createElement(_prChangedFilesContainer.default, {
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView native-key-bindings"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-container"
    }, /*#__PURE__*/_react.default.createElement("header", {
      className: "github-IssueishDetailView-header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn"
    }, /*#__PURE__*/_react.default.createElement("a", {
      className: "github-IssueishDetailView-avatar",
      href: author.url
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: "github-IssueishDetailView-avatarImage",
      src: author.avatarUrl,
      title: author.login,
      alt: author.login
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn is-flexible"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow is-fullwidth"
    }, /*#__PURE__*/_react.default.createElement("a", {
      className: "github-IssueishDetailView-title",
      href: pullRequest.url
    }, pullRequest.title)), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow"
    }, /*#__PURE__*/_react.default.createElement(_issueishBadge.default, {
      className: "github-IssueishDetailView-headerBadge",
      type: pullRequest.__typename,
      state: pullRequest.state
    }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "repo-sync",
      className: (0, _classnames.default)('github-IssueishDetailView-headerRefreshButton', {
        refreshing: this.state.refreshing
      }),
      onClick: this.handleRefreshClick
    }), /*#__PURE__*/_react.default.createElement("a", {
      className: "github-IssueishDetailView-headerLink",
      title: "open on GitHub.com",
      href: pullRequest.url,
      onClick: this.recordOpenInBrowserEvent
    }, repo.owner.login, "/", repo.name, "#", pullRequest.number), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-IssueishDetailView-headerStatus"
    }, /*#__PURE__*/_react.default.createElement(_prStatusesView.default, {
      pullRequest: pullRequest,
      displayType: "check",
      switchToIssueish: this.props.switchToIssueish
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow"
    }, this.renderPrMetadata(pullRequest, repo))), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn"
    }, /*#__PURE__*/_react.default.createElement(_checkoutButton.default, {
      checkoutOp: this.props.checkoutOp,
      classNamePrefix: "github-IssueishDetailView-checkoutButton--",
      classNames: ['github-IssueishDetailView-checkoutButton']
    }))), this.renderPullRequestBody(pullRequest), /*#__PURE__*/_react.default.createElement(_reviewsFooterView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1kZXRhaWwtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZWZyZXNoaW5nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVmcmVzaGVyIiwicmVmcmVzaE5vdyIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJpbmRleCIsInByb3BzIiwib25UYWJTZWxlY3RlZCIsImV2ZW50TmFtZSIsInN0YXRlIiwic2V0U3RhdGUiLCJyZWxheSIsInJlZmV0Y2giLCJyZXBvSWQiLCJyZXBvc2l0b3J5IiwiaWQiLCJpc3N1ZWlzaElkIiwicHVsbFJlcXVlc3QiLCJ0aW1lbGluZUNvdW50IiwiUEFHRV9TSVpFIiwidGltZWxpbmVDdXJzb3IiLCJjb21taXRDb3VudCIsImNvbW1pdEN1cnNvciIsImVyciIsInJlcG9ydFJlbGF5RXJyb3IiLCJmb3JjZSIsImNvbXBvbmVudERpZE1vdW50IiwiUGVyaW9kaWNSZWZyZXNoZXIiLCJpbnRlcnZhbCIsImdldEN1cnJlbnRJZCIsInJlZnJlc2giLCJtaW5pbXVtSW50ZXJ2YWxQZXJJZCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsInJlbmRlclByTWV0YWRhdGEiLCJyZXBvIiwiYXV0aG9yIiwiZ2V0QXV0aG9yIiwiaXNDcm9zc1JlcG9zaXRvcnkiLCJvd25lciIsImxvZ2luIiwiYmFzZVJlZk5hbWUiLCJoZWFkUmVmTmFtZSIsInJlbmRlclB1bGxSZXF1ZXN0Qm9keSIsIm9uQnJhbmNoIiwiY2hlY2tvdXRPcCIsIndoeSIsImNoZWNrb3V0U3RhdGVzIiwiQ1VSUkVOVCIsInNlbGVjdGVkVGFiIiwiY291bnRlZENvbW1pdHMiLCJ0b3RhbENvdW50IiwiY2hhbmdlZEZpbGVzIiwiYm9keUhUTUwiLCJzd2l0Y2hUb0lzc3VlaXNoIiwidG9vbHRpcHMiLCJvcGVuQ29tbWl0IiwibG9jYWxSZXBvc2l0b3J5IiwibnVtYmVyIiwiZW5kcG9pbnQiLCJ0b2tlbiIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwiY29uZmlnIiwid29ya2RpclBhdGgiLCJpdGVtVHlwZSIsInJlZkVkaXRvciIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsIm9uT3BlbkZpbGVzVGFiIiwicmVuZGVyIiwidXJsIiwiYXZhdGFyVXJsIiwidGl0bGUiLCJfX3R5cGVuYW1lIiwiaGFuZGxlUmVmcmVzaENsaWNrIiwicmVjb3JkT3BlbkluQnJvd3NlckV2ZW50IiwicmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50IiwicmV2aWV3Q29tbWVudHNUb3RhbENvdW50Iiwib3BlblJldmlld3MiLCJHSE9TVF9VU0VSIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImJvb2wiLCJvbmVPZiIsIm9iamVjdCIsIkVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSIsImFycmF5T2YiLCJ0aHJlYWQiLCJjb21tZW50cyIsIkVuZHBvaW50UHJvcFR5cGUiLCJJdGVtVHlwZVByb3BUeXBlIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sTUFBTUEseUJBQU4sU0FBd0NDLGVBQU1DLFNBQTlDLENBQXdEO0FBQUE7QUFBQTs7QUFBQSxtQ0ErRXJEO0FBQ05DLE1BQUFBLFVBQVUsRUFBRTtBQUROLEtBL0VxRDs7QUFBQSxnREFtU3hDQyxDQUFDLElBQUk7QUFDeEJBLE1BQUFBLENBQUMsQ0FBQ0Ms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QUFlQyxVQTVEVjtBQTZEakJMLEVBQUFBLFdBQVcsRUFBRUUsbUJBQVVFLElBQVYsQ0FBZUMsVUE3RFg7QUE4RGpCakMsRUFBQUEsZ0JBQWdCLEVBQUU4QixtQkFBVUUsSUFBVixDQUFlQyxVQTlEaEI7QUErRGpCdEQsRUFBQUEsT0FBTyxFQUFFbUQsbUJBQVVFLElBQVYsQ0FBZUMsVUEvRFA7QUFnRWpCL0QsRUFBQUEsZ0JBQWdCLEVBQUU0RCxtQkFBVUUsSUFBVixDQUFlQyxVQWhFaEI7QUFrRWpCO0FBQ0FuQixFQUFBQSxRQUFRLEVBQUU2Qiw2QkFBaUJWLFVBbkVWO0FBb0VqQmxCLEVBQUFBLFNBQVMsRUFBRTZCLDhCQUFrQlgsVUFwRVo7QUFzRWpCO0FBQ0FqQixFQUFBQSxtQkFBbUIsRUFBRWMsbUJBQVVJLE1BdkVkO0FBd0VqQmpCLEVBQUFBLHVCQUF1QixFQUFFYSxtQkFBVTFCLE1BeEVsQjtBQXlFakJULEVBQUFBLFdBQVcsRUFBRW1DLG1CQUFVMUIsTUFBVixDQUFpQjZCLFVBekViO0FBMEVqQmhGLEVBQUFBLGFBQWEsRUFBRTZFLG1CQUFVRSxJQUFWLENBQWVDLFVBMUViO0FBMkVqQmYsRUFBQUEsY0FBYyxFQUFFWSxtQkFBVUUsSUFBVixDQUFlQztBQTNFZCxDOztlQWdWTix3Q0FBdUI5Rix5QkFBdkIsRUFBa0Q7QUFDL0RxQixFQUFBQSxVQUFVO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsR0FEcUQ7QUFXL0RHLEVBQUFBLFdBQVc7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQVhvRCxDQUFsRDtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVSZWZldGNoQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtUYWIsIFRhYnMsIFRhYkxpc3QsIFRhYlBhbmVsfSBmcm9tICdyZWFjdC10YWJzJztcblxuaW1wb3J0IHtFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUsIEl0ZW1UeXBlUHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGUsIFJlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCBQZXJpb2RpY1JlZnJlc2hlciBmcm9tICcuLi9wZXJpb2RpYy1yZWZyZXNoZXInO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBQdWxsUmVxdWVzdENoYW5nZWRGaWxlc0NvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL3ByLWNoYW5nZWQtZmlsZXMtY29udGFpbmVyJztcbmltcG9ydCB7Y2hlY2tvdXRTdGF0ZXN9IGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuaW1wb3J0IFB1bGxSZXF1ZXN0VGltZWxpbmVDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLXRpbWVsaW5lLWNvbnRyb2xsZXInO1xuaW1wb3J0IEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9lbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlcic7XG5pbXBvcnQgR2l0aHViRG90Y29tTWFya2Rvd24gZnJvbSAnLi4vdmlld3MvZ2l0aHViLWRvdGNvbS1tYXJrZG93bic7XG5pbXBvcnQgSXNzdWVpc2hCYWRnZSBmcm9tICcuLi92aWV3cy9pc3N1ZWlzaC1iYWRnZSc7XG5pbXBvcnQgQ2hlY2tvdXRCdXR0b24gZnJvbSAnLi9jaGVja291dC1idXR0b24nO1xuaW1wb3J0IFB1bGxSZXF1ZXN0Q29tbWl0c1ZpZXcgZnJvbSAnLi4vdmlld3MvcHItY29tbWl0cy12aWV3JztcbmltcG9ydCBQdWxsUmVxdWVzdFN0YXR1c2VzVmlldyBmcm9tICcuLi92aWV3cy9wci1zdGF0dXNlcy12aWV3JztcbmltcG9ydCBSZXZpZXdzRm9vdGVyVmlldyBmcm9tICcuLi92aWV3cy9yZXZpZXdzLWZvb3Rlci12aWV3JztcbmltcG9ydCB7UEFHRV9TSVpFLCBHSE9TVF9VU0VSfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVQdWxsUmVxdWVzdERldGFpbFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3BvbnNlXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgb3duZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgfSksXG4gICAgfSksXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBfX3R5cGVuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBjb3VudGVkQ29tbWl0czogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgdG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIGlzQ3Jvc3NSZXBvc2l0b3J5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIGNoYW5nZWRGaWxlczogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBib2R5SFRNTDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIHN0YXRlOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgICAnT1BFTicsICdDTE9TRUQnLCAnTUVSR0VEJyxcbiAgICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgICBhdXRob3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgIH0pLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBMb2NhbCBtb2RlbCBvYmplY3RzXG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2hlY2tvdXRPcDogRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpclBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvLyBSZXZpZXcgY29tbWVudCB0aHJlYWRzXG4gICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHJldmlld0NvbW1lbnRzVG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJldmlld0NvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIENvbm5lY3Rpb24gaW5mb3JtYXRpb25cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHRva2VuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBmdW5jdGlvbnNcbiAgICBvcGVuQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5SZXZpZXdzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGVzdHJveTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gSXRlbSBjb250ZXh0XG4gICAgaXRlbVR5cGU6IEl0ZW1UeXBlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZWZFZGl0b3I6IFJlZkhvbGRlclByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBUYWIgbWFuYWdlbWVudFxuICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc2VsZWN0ZWRUYWI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvblRhYlNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uT3BlbkZpbGVzVGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgcmVmcmVzaGluZzogZmFsc2UsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hlciA9IG5ldyBQZXJpb2RpY1JlZnJlc2hlcihCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3LCB7XG4gICAgICBpbnRlcnZhbDogKCkgPT4gNSAqIDYwICogMTAwMCxcbiAgICAgIGdldEN1cnJlbnRJZDogKCkgPT4gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgIHJlZnJlc2g6IHRoaXMucmVmcmVzaCxcbiAgICAgIG1pbmltdW1JbnRlcnZhbFBlcklkOiAyICogNjAgKiAxMDAwLFxuICAgIH0pO1xuICAgIC8vIGF1dG8tcmVmcmVzaCBkaXNhYmxlZCBmb3Igbm93IHVudGlsIHBhZ2luYXRpb24gaXMgaGFuZGxlZFxuICAgIC8vIHRoaXMucmVmcmVzaGVyLnN0YXJ0KCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hlci5kZXN0cm95KCk7XG4gIH1cblxuICByZW5kZXJQck1ldGFkYXRhKHB1bGxSZXF1ZXN0LCByZXBvKSB7XG4gICAgY29uc3QgYXV0aG9yID0gdGhpcy5nZXRBdXRob3IocHVsbFJlcXVlc3QpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctbWV0YVwiPlxuICAgICAgICA8Y29kZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWJhc2VSZWZOYW1lXCI+e3B1bGxSZXF1ZXN0LmlzQ3Jvc3NSZXBvc2l0b3J5ID9cbiAgICAgICAgICBgJHtyZXBvLm93bmVyLmxvZ2lufS8ke3B1bGxSZXF1ZXN0LmJhc2VSZWZOYW1lfWAgOiBwdWxsUmVxdWVzdC5iYXNlUmVmTmFtZX08L2NvZGU+eycg4oC5ICd9XG4gICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZFJlZk5hbWVcIj57cHVsbFJlcXVlc3QuaXNDcm9zc1JlcG9zaXRvcnkgP1xuICAgICAgICAgIGAke2F1dGhvci5sb2dpbn0vJHtwdWxsUmVxdWVzdC5oZWFkUmVmTmFtZX1gIDogcHVsbFJlcXVlc3QuaGVhZFJlZk5hbWV9PC9jb2RlPlxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJQdWxsUmVxdWVzdEJvZHkocHVsbFJlcXVlc3QpIHtcbiAgICBjb25zdCBvbkJyYW5jaCA9IHRoaXMucHJvcHMuY2hlY2tvdXRPcC53aHkoKSA9PT0gY2hlY2tvdXRTdGF0ZXMuQ1VSUkVOVDtcblxuICAgIHJldHVybiAoXG4gICAgICA8VGFicyBzZWxlY3RlZEluZGV4PXt0aGlzLnByb3BzLnNlbGVjdGVkVGFifSBvblNlbGVjdD17dGhpcy5vblRhYlNlbGVjdGVkfT5cbiAgICAgICAgPFRhYkxpc3QgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYmxpc3RcIj5cbiAgICAgICAgICA8VGFiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWJcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJpbmZvXCIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCIgLz5PdmVydmlldzwvVGFiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImNoZWNrbGlzdFwiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItaWNvblwiIC8+XG4gICAgICAgICAgICBCdWlsZCBTdGF0dXNcbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICA8VGFiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWJcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJnaXQtY29tbWl0XCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIENvbW1pdHNcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItY291bnRcIj5cbiAgICAgICAgICAgICAge3B1bGxSZXF1ZXN0LmNvdW50ZWRDb21taXRzLnRvdGFsQ291bnR9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgPFRhYiBjbGFzc05hbWU9XCJnaXRodWItdGFiXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZGlmZlwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItaWNvblwiXG4gICAgICAgICAgICAvPkZpbGVzXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItdGFiLWNvdW50XCI+e3B1bGxSZXF1ZXN0LmNoYW5nZWRGaWxlc308L3NwYW4+XG4gICAgICAgICAgPC9UYWI+XG4gICAgICAgIDwvVGFiTGlzdD5cbiAgICAgICAgey8qICdSZXZpZXdzJyB0YWIgdG8gYmUgYWRkZWQgaW4gdGhlIGZ1dHVyZS4gKi99XG5cbiAgICAgICAgey8qIG92ZXJ2aWV3ICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LW92ZXJ2aWV3XCI+XG4gICAgICAgICAgICA8R2l0aHViRG90Y29tTWFya2Rvd25cbiAgICAgICAgICAgICAgaHRtbD17cHVsbFJlcXVlc3QuYm9keUhUTUwgfHwgJzxlbT5ObyBkZXNjcmlwdGlvbiBwcm92aWRlZC48L2VtPid9XG4gICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RW1vamlSZWFjdGlvbnNDb250cm9sbGVyXG4gICAgICAgICAgICAgIHJlYWN0YWJsZT17cHVsbFJlcXVlc3R9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFB1bGxSZXF1ZXN0VGltZWxpbmVDb250cm9sbGVyXG4gICAgICAgICAgICAgIG9uQnJhbmNoPXtvbkJyYW5jaH1cbiAgICAgICAgICAgICAgb3BlbkNvbW1pdD17dGhpcy5wcm9wcy5vcGVuQ29tbWl0fVxuICAgICAgICAgICAgICBwdWxsUmVxdWVzdD17cHVsbFJlcXVlc3R9XG4gICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvVGFiUGFuZWw+XG5cbiAgICAgICAgey8qIGJ1aWxkIHN0YXR1cyAqL31cbiAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1idWlsZFN0YXR1c1wiPlxuICAgICAgICAgICAgPFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3XG4gICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgZGlzcGxheVR5cGU9XCJmdWxsXCJcbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogY29tbWl0cyAqL31cbiAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgIDxQdWxsUmVxdWVzdENvbW1pdHNWaWV3IHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH0gb25CcmFuY2g9e29uQnJhbmNofSBvcGVuQ29tbWl0PXt0aGlzLnByb3BzLm9wZW5Db21taXR9IC8+XG4gICAgICAgIDwvVGFiUGFuZWw+XG5cbiAgICAgICAgey8qIGZpbGVzIGNoYW5nZWQgKi99XG4gICAgICAgIDxUYWJQYW5lbCBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWZpbGVzQ2hhbmdlZFwiPlxuICAgICAgICAgIDxQdWxsUmVxdWVzdENoYW5nZWRGaWxlc0NvbnRhaW5lclxuICAgICAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeX1cblxuICAgICAgICAgICAgb3duZXI9e3RoaXMucHJvcHMucmVwb3NpdG9yeS5vd25lci5sb2dpbn1cbiAgICAgICAgICAgIHJlcG89e3RoaXMucHJvcHMucmVwb3NpdG9yeS5uYW1lfVxuICAgICAgICAgICAgbnVtYmVyPXtwdWxsUmVxdWVzdC5udW1iZXJ9XG4gICAgICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgICAgIHRva2VuPXt0aGlzLnByb3BzLnRva2VufVxuXG4gICAgICAgICAgICByZXZpZXdDb21tZW50c0xvYWRpbmc9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudHNMb2FkaW5nfVxuICAgICAgICAgICAgcmV2aWV3Q29tbWVudFRocmVhZHM9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudFRocmVhZHN9XG5cbiAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICAgIHdvcmtkaXJQYXRoPXt0aGlzLnByb3BzLndvcmtkaXJQYXRofVxuXG4gICAgICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgICAgIHJlZkVkaXRvcj17dGhpcy5wcm9wcy5yZWZFZGl0b3J9XG4gICAgICAgICAgICBkZXN0cm95PXt0aGlzLnByb3BzLmRlc3Ryb3l9XG5cbiAgICAgICAgICAgIHNob3VsZFJlZmV0Y2g9e3RoaXMuc3RhdGUucmVmcmVzaGluZ31cbiAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cblxuICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3RoaXMucHJvcHMucHVsbFJlcXVlc3R9XG5cbiAgICAgICAgICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg9e3RoaXMucHJvcHMuaW5pdENoYW5nZWRGaWxlUGF0aH1cbiAgICAgICAgICAgIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uPXt0aGlzLnByb3BzLmluaXRDaGFuZ2VkRmlsZVBvc2l0aW9ufVxuICAgICAgICAgICAgb25PcGVuRmlsZXNUYWI9e3RoaXMucHJvcHMub25PcGVuRmlsZXNUYWJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgIDwvVGFicz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcG8gPSB0aGlzLnByb3BzLnJlcG9zaXRvcnk7XG4gICAgY29uc3QgcHVsbFJlcXVlc3QgPSB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0O1xuICAgIGNvbnN0IGF1dGhvciA9IHRoaXMuZ2V0QXV0aG9yKHB1bGxSZXF1ZXN0KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXcgbmF0aXZlLWtleS1iaW5kaW5nc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctY29udGFpbmVyXCI+XG5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uXCI+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYXZhdGFyXCIgaHJlZj17YXV0aG9yLnVybH0+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWF2YXRhckltYWdlXCJcbiAgICAgICAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPXthdXRob3IubG9naW59XG4gICAgICAgICAgICAgICAgICBhbHQ9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckNvbHVtbiBpcy1mbGV4aWJsZVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyUm93IGlzLWZ1bGx3aWR0aFwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctdGl0bGVcIiBocmVmPXtwdWxsUmVxdWVzdC51cmx9PntwdWxsUmVxdWVzdC50aXRsZX08L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyUm93XCI+XG4gICAgICAgICAgICAgICAgPElzc3VlaXNoQmFkZ2UgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJCYWRnZVwiXG4gICAgICAgICAgICAgICAgICB0eXBlPXtwdWxsUmVxdWVzdC5fX3R5cGVuYW1lfVxuICAgICAgICAgICAgICAgICAgc3RhdGU9e3B1bGxSZXF1ZXN0LnN0YXRlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPE9jdGljb25cbiAgICAgICAgICAgICAgICAgIGljb249XCJyZXBvLXN5bmNcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSZWZyZXNoQnV0dG9uJywge3JlZnJlc2hpbmc6IHRoaXMuc3RhdGUucmVmcmVzaGluZ30pfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVSZWZyZXNoQ2xpY2t9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckxpbmtcIlxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJvcGVuIG9uIEdpdEh1Yi5jb21cIlxuICAgICAgICAgICAgICAgICAgaHJlZj17cHVsbFJlcXVlc3QudXJsfSBvbkNsaWNrPXt0aGlzLnJlY29yZE9wZW5JbkJyb3dzZXJFdmVudH0+XG4gICAgICAgICAgICAgICAgICB7cmVwby5vd25lci5sb2dpbn0ve3JlcG8ubmFtZX0je3B1bGxSZXF1ZXN0Lm51bWJlcn1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJTdGF0dXNcIj5cbiAgICAgICAgICAgICAgICAgIDxQdWxsUmVxdWVzdFN0YXR1c2VzVmlld1xuICAgICAgICAgICAgICAgICAgICBwdWxsUmVxdWVzdD17cHVsbFJlcXVlc3R9XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlUeXBlPVwiY2hlY2tcIlxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3dcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJQck1ldGFkYXRhKHB1bGxSZXF1ZXN0LCByZXBvKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckNvbHVtblwiPlxuICAgICAgICAgICAgICA8Q2hlY2tvdXRCdXR0b25cbiAgICAgICAgICAgICAgICBjaGVja291dE9wPXt0aGlzLnByb3BzLmNoZWNrb3V0T3B9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lUHJlZml4PVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jaGVja291dEJ1dHRvbi0tXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWVzPXtbJ2dpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctY2hlY2tvdXRCdXR0b24nXX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgICAge3RoaXMucmVuZGVyUHVsbFJlcXVlc3RCb2R5KHB1bGxSZXF1ZXN0KX1cblxuICAgICAgICAgIDxSZXZpZXdzRm9vdGVyVmlld1xuICAgICAgICAgICAgY29tbWVudHNSZXNvbHZlZD17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c1Jlc29sdmVkQ291bnR9XG4gICAgICAgICAgICB0b3RhbENvbW1lbnRzPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzVG90YWxDb3VudH1cbiAgICAgICAgICAgIG9wZW5SZXZpZXdzPXt0aGlzLnByb3BzLm9wZW5SZXZpZXdzfVxuICAgICAgICAgICAgcHVsbFJlcXVlc3RVUkw9e2Ake3RoaXMucHJvcHMucHVsbFJlcXVlc3QudXJsfS9maWxlc2B9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlUmVmcmVzaENsaWNrID0gZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucmVmcmVzaGVyLnJlZnJlc2hOb3codHJ1ZSk7XG4gIH1cblxuICByZWNvcmRPcGVuSW5Ccm93c2VyRXZlbnQgPSAoKSA9PiB7XG4gICAgYWRkRXZlbnQoJ29wZW4tcHVsbC1yZXF1ZXN0LWluLWJyb3dzZXInLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICBvblRhYlNlbGVjdGVkID0gaW5kZXggPT4ge1xuICAgIHRoaXMucHJvcHMub25UYWJTZWxlY3RlZChpbmRleCk7XG4gICAgY29uc3QgZXZlbnROYW1lID0gW1xuICAgICAgJ29wZW4tcHItdGFiLW92ZXJ2aWV3JyxcbiAgICAgICdvcGVuLXByLXRhYi1idWlsZC1zdGF0dXMnLFxuICAgICAgJ29wZW4tcHItdGFiLWNvbW1pdHMnLFxuICAgICAgJ29wZW4tcHItdGFiLWZpbGVzLWNoYW5nZWQnLFxuICAgIF1baW5kZXhdO1xuICAgIGFkZEV2ZW50KGV2ZW50TmFtZSwge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgcmVmcmVzaCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWZyZXNoaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVmcmVzaGluZzogdHJ1ZX0pO1xuICAgIHRoaXMucHJvcHMucmVsYXkucmVmZXRjaCh7XG4gICAgICByZXBvSWQ6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5pZCxcbiAgICAgIGlzc3VlaXNoSWQ6IHRoaXMucHJvcHMucHVsbFJlcXVlc3QuaWQsXG4gICAgICB0aW1lbGluZUNvdW50OiBQQUdFX1NJWkUsXG4gICAgICB0aW1lbGluZUN1cnNvcjogbnVsbCxcbiAgICAgIGNvbW1pdENvdW50OiBQQUdFX1NJWkUsXG4gICAgICBjb21taXRDdXJzb3I6IG51bGwsXG4gICAgfSwgbnVsbCwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gcmVmcmVzaCBwdWxsIHJlcXVlc3QgZGV0YWlscycsIGVycik7XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtyZWZyZXNoaW5nOiBmYWxzZX0pO1xuICAgIH0sIHtmb3JjZTogdHJ1ZX0pO1xuICB9XG5cbiAgZ2V0QXV0aG9yKHB1bGxSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHB1bGxSZXF1ZXN0LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVJlZmV0Y2hDb250YWluZXIoQmFyZVB1bGxSZXF1ZXN0RGV0YWlsVmlldywge1xuICByZXBvc2l0b3J5OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByRGV0YWlsVmlld19yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xuICAgICAgaWRcbiAgICAgIG5hbWVcbiAgICAgIG93bmVyIHtcbiAgICAgICAgbG9naW5cbiAgICAgIH1cbiAgICB9XG4gIGAsXG5cbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJEZXRhaWxWaWV3X3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICB0aW1lbGluZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICB0aW1lbGluZUN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgICBjb21taXRDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY29tbWl0Q3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNoZWNrU3VpdGVDb3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY2hlY2tTdWl0ZUN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgICBjaGVja1J1bkNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1J1bkN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICBpZFxuICAgICAgX190eXBlbmFtZVxuICAgICAgdXJsXG4gICAgICBpc0Nyb3NzUmVwb3NpdG9yeVxuICAgICAgY2hhbmdlZEZpbGVzXG4gICAgICBzdGF0ZVxuICAgICAgbnVtYmVyXG4gICAgICB0aXRsZVxuICAgICAgYm9keUhUTUxcbiAgICAgIGJhc2VSZWZOYW1lXG4gICAgICBoZWFkUmVmTmFtZVxuICAgICAgY291bnRlZENvbW1pdHM6IGNvbW1pdHMge1xuICAgICAgICB0b3RhbENvdW50XG4gICAgICB9XG4gICAgICBhdXRob3Ige1xuICAgICAgICBsb2dpblxuICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgdXJsXG4gICAgICB9XG5cbiAgICAgIC4uLnByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhjb21taXRDb3VudDogJGNvbW1pdENvdW50LCBjb21taXRDdXJzb3I6ICRjb21taXRDdXJzb3IpXG4gICAgICAuLi5wclN0YXR1c2VzVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICBjaGVja1N1aXRlQ291bnQ6ICRjaGVja1N1aXRlQ291bnRcbiAgICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogJGNoZWNrU3VpdGVDdXJzb3JcbiAgICAgICAgY2hlY2tSdW5Db3VudDogJGNoZWNrUnVuQ291bnRcbiAgICAgICAgY2hlY2tSdW5DdXJzb3I6ICRjaGVja1J1bkN1cnNvclxuICAgICAgKVxuICAgICAgLi4ucHJUaW1lbGluZUNvbnRyb2xsZXJfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyh0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudCwgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvcilcbiAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICB9XG4gIGAsXG59LCBncmFwaHFsYFxuICBxdWVyeSBwckRldGFpbFZpZXdSZWZldGNoUXVlcnlcbiAgKFxuICAgICRyZXBvSWQ6IElEIVxuICAgICRpc3N1ZWlzaElkOiBJRCFcbiAgICAkdGltZWxpbmVDb3VudDogSW50IVxuICAgICR0aW1lbGluZUN1cnNvcjogU3RyaW5nXG4gICAgJGNvbW1pdENvdW50OiBJbnQhXG4gICAgJGNvbW1pdEN1cnNvcjogU3RyaW5nXG4gICAgJGNoZWNrU3VpdGVDb3VudDogSW50IVxuICAgICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgICAkY2hlY2tSdW5Db3VudDogSW50IVxuICAgICRjaGVja1J1bkN1cnNvcjogU3RyaW5nXG4gICkge1xuICAgIHJlcG9zaXRvcnk6IG5vZGUoaWQ6ICRyZXBvSWQpIHtcbiAgICAgIC4uLnByRGV0YWlsVmlld19yZXBvc2l0b3J5XG4gICAgfVxuXG4gICAgcHVsbFJlcXVlc3Q6IG5vZGUoaWQ6ICRpc3N1ZWlzaElkKSB7XG4gICAgICAuLi5wckRldGFpbFZpZXdfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgdGltZWxpbmVDb3VudDogJHRpbWVsaW5lQ291bnRcbiAgICAgICAgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvclxuICAgICAgICBjb21taXRDb3VudDogJGNvbW1pdENvdW50XG4gICAgICAgIGNvbW1pdEN1cnNvcjogJGNvbW1pdEN1cnNvclxuICAgICAgICBjaGVja1N1aXRlQ291bnQ6ICRjaGVja1N1aXRlQ291bnRcbiAgICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogJGNoZWNrU3VpdGVDdXJzb3JcbiAgICAgICAgY2hlY2tSdW5Db3VudDogJGNoZWNrUnVuQ291bnRcbiAgICAgICAgY2hlY2tSdW5DdXJzb3I6ICRjaGVja1J1bkN1cnNvclxuICAgICAgKVxuICAgIH1cbiAgfVxuYCk7XG4iXX0=