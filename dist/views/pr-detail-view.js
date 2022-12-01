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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1kZXRhaWwtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZWZyZXNoaW5nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVmcmVzaGVyIiwicmVmcmVzaE5vdyIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJpbmRleCIsInByb3BzIiwib25UYWJTZWxlY3RlZCIsImV2ZW50TmFtZSIsInN0YXRlIiwic2V0U3RhdGUiLCJyZWxheSIsInJlZmV0Y2giLCJyZXBvSWQiLCJyZXBvc2l0b3J5IiwiaWQiLCJpc3N1ZWlzaElkIiwicHVsbFJlcXVlc3QiLCJ0aW1lbGluZUNvdW50IiwiUEFHRV9TSVpFIiwidGltZWxpbmVDdXJzb3IiLCJjb21taXRDb3VudCIsImNvbW1pdEN1cnNvciIsImVyciIsInJlcG9ydFJlbGF5RXJyb3IiLCJmb3JjZSIsImNvbXBvbmVudERpZE1vdW50IiwiUGVyaW9kaWNSZWZyZXNoZXIiLCJpbnRlcnZhbCIsImdldEN1cnJlbnRJZCIsInJlZnJlc2giLCJtaW5pbXVtSW50ZXJ2YWxQZXJJZCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsInJlbmRlclByTWV0YWRhdGEiLCJyZXBvIiwiYXV0aG9yIiwiZ2V0QXV0aG9yIiwiaXNDcm9zc1JlcG9zaXRvcnkiLCJvd25lciIsImxvZ2luIiwiYmFzZVJlZk5hbWUiLCJoZWFkUmVmTmFtZSIsInJlbmRlclB1bGxSZXF1ZXN0Qm9keSIsIm9uQnJhbmNoIiwiY2hlY2tvdXRPcCIsIndoeSIsImNoZWNrb3V0U3RhdGVzIiwiQ1VSUkVOVCIsInNlbGVjdGVkVGFiIiwiY291bnRlZENvbW1pdHMiLCJ0b3RhbENvdW50IiwiY2hhbmdlZEZpbGVzIiwiYm9keUhUTUwiLCJzd2l0Y2hUb0lzc3VlaXNoIiwidG9vbHRpcHMiLCJvcGVuQ29tbWl0IiwibG9jYWxSZXBvc2l0b3J5IiwibnVtYmVyIiwiZW5kcG9pbnQiLCJ0b2tlbiIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwiY29uZmlnIiwid29ya2RpclBhdGgiLCJpdGVtVHlwZSIsInJlZkVkaXRvciIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsIm9uT3BlbkZpbGVzVGFiIiwicmVuZGVyIiwidXJsIiwiYXZhdGFyVXJsIiwidGl0bGUiLCJfX3R5cGVuYW1lIiwiaGFuZGxlUmVmcmVzaENsaWNrIiwicmVjb3JkT3BlbkluQnJvd3NlckV2ZW50IiwicmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50IiwicmV2aWV3Q29tbWVudHNUb3RhbENvdW50Iiwib3BlblJldmlld3MiLCJHSE9TVF9VU0VSIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImJvb2wiLCJvbmVPZiIsIm9iamVjdCIsIkVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSIsImFycmF5T2YiLCJ0aHJlYWQiLCJjb21tZW50cyIsIkVuZHBvaW50UHJvcFR5cGUiLCJJdGVtVHlwZVByb3BUeXBlIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sTUFBTUEseUJBQU4sU0FBd0NDLGVBQU1DLFNBQTlDLENBQXdEO0FBQUE7QUFBQTs7QUFBQSxtQ0ErRXJEO0FBQ05DLE1BQUFBLFVBQVUsRUFBRTtBQUROLEtBL0VxRDs7QUFBQSxnREFtU3hDQyxDQUFDLElBQUk7QUFDeEJBLE1BQUFBLENBQUMsQ0FBQ0Ms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VyxFQUFFRSxtQkFBVUUsSUFBVixDQUFlQyxVQTdEWDtBQThEakJqQyxFQUFBQSxnQkFBZ0IsRUFBRThCLG1CQUFVRSxJQUFWLENBQWVDLFVBOURoQjtBQStEakJ0RCxFQUFBQSxPQUFPLEVBQUVtRCxtQkFBVUUsSUFBVixDQUFlQyxVQS9EUDtBQWdFakIvRCxFQUFBQSxnQkFBZ0IsRUFBRTRELG1CQUFVRSxJQUFWLENBQWVDLFVBaEVoQjtBQWtFakI7QUFDQW5CLEVBQUFBLFFBQVEsRUFBRTZCLDZCQUFpQlYsVUFuRVY7QUFvRWpCbEIsRUFBQUEsU0FBUyxFQUFFNkIsOEJBQWtCWCxVQXBFWjtBQXNFakI7QUFDQWpCLEVBQUFBLG1CQUFtQixFQUFFYyxtQkFBVUksTUF2RWQ7QUF3RWpCakIsRUFBQUEsdUJBQXVCLEVBQUVhLG1CQUFVMUIsTUF4RWxCO0FBeUVqQlQsRUFBQUEsV0FBVyxFQUFFbUMsbUJBQVUxQixNQUFWLENBQWlCNkIsVUF6RWI7QUEwRWpCaEYsRUFBQUEsYUFBYSxFQUFFNkUsbUJBQVVFLElBQVYsQ0FBZUMsVUExRWI7QUEyRWpCZixFQUFBQSxjQUFjLEVBQUVZLG1CQUFVRSxJQUFWLENBQWVDO0FBM0VkLEM7O2VBZ1ZOLHdDQUF1QjlGLHlCQUF2QixFQUFrRDtBQUMvRHFCLEVBQUFBLFVBQVU7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxHQURxRDtBQVcvREcsRUFBQUEsV0FBVztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBWG9ELENBQWxEO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVJlZmV0Y2hDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1RhYiwgVGFicywgVGFiTGlzdCwgVGFiUGFuZWx9IGZyb20gJ3JlYWN0LXRhYnMnO1xuXG5pbXBvcnQge0VuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IFBlcmlvZGljUmVmcmVzaGVyIGZyb20gJy4uL3BlcmlvZGljLXJlZnJlc2hlcic7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFB1bGxSZXF1ZXN0Q2hhbmdlZEZpbGVzQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvcHItY2hhbmdlZC1maWxlcy1jb250YWluZXInO1xuaW1wb3J0IHtjaGVja291dFN0YXRlc30gZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgUHVsbFJlcXVlc3RUaW1lbGluZUNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcHItdGltZWxpbmUtY29udHJvbGxlcic7XG5pbXBvcnQgRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vtb2ppLXJlYWN0aW9ucy1jb250cm9sbGVyJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi92aWV3cy9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBJc3N1ZWlzaEJhZGdlIGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLWJhZGdlJztcbmltcG9ydCBDaGVja291dEJ1dHRvbiBmcm9tICcuL2NoZWNrb3V0LWJ1dHRvbic7XG5pbXBvcnQgUHVsbFJlcXVlc3RDb21taXRzVmlldyBmcm9tICcuLi92aWV3cy9wci1jb21taXRzLXZpZXcnO1xuaW1wb3J0IFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3IGZyb20gJy4uL3ZpZXdzL3ByLXN0YXR1c2VzLXZpZXcnO1xuaW1wb3J0IFJldmlld3NGb290ZXJWaWV3IGZyb20gJy4uL3ZpZXdzL3Jldmlld3MtZm9vdGVyLXZpZXcnO1xuaW1wb3J0IHtQQUdFX1NJWkUsIEdIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZVB1bGxSZXF1ZXN0RGV0YWlsVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzcG9uc2VcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGNvdW50ZWRDb21taXRzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICB0b3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgaXNDcm9zc1JlcG9zaXRvcnk6IFByb3BUeXBlcy5ib29sLFxuICAgICAgY2hhbmdlZEZpbGVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGJvZHlIVE1MOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgc3RhdGU6IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAgICdPUEVOJywgJ0NMT1NFRCcsICdNRVJHRUQnLFxuICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgIGF1dGhvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIExvY2FsIG1vZGVsIG9iamVjdHNcbiAgICBsb2NhbFJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjaGVja291dE9wOiBFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIFJldmlldyBjb21tZW50IHRocmVhZHNcbiAgICByZXZpZXdDb21tZW50c0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudHNUb3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29ubmVjdGlvbiBpbmZvcm1hdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIGZ1bmN0aW9uc1xuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlblJldmlld3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkZXN0cm95OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBJdGVtIGNvbnRleHRcbiAgICBpdGVtVHlwZTogSXRlbVR5cGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZkVkaXRvcjogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFRhYiBtYW5hZ2VtZW50XG4gICAgaW5pdENoYW5nZWRGaWxlUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbjogUHJvcFR5cGVzLm51bWJlcixcbiAgICBzZWxlY3RlZFRhYjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9uVGFiU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25PcGVuRmlsZXNUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICByZWZyZXNoaW5nOiBmYWxzZSxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaGVyID0gbmV3IFBlcmlvZGljUmVmcmVzaGVyKEJhcmVQdWxsUmVxdWVzdERldGFpbFZpZXcsIHtcbiAgICAgIGludGVydmFsOiAoKSA9PiA1ICogNjAgKiAxMDAwLFxuICAgICAgZ2V0Q3VycmVudElkOiAoKSA9PiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgcmVmcmVzaDogdGhpcy5yZWZyZXNoLFxuICAgICAgbWluaW11bUludGVydmFsUGVySWQ6IDIgKiA2MCAqIDEwMDAsXG4gICAgfSk7XG4gICAgLy8gYXV0by1yZWZyZXNoIGRpc2FibGVkIGZvciBub3cgdW50aWwgcGFnaW5hdGlvbiBpcyBoYW5kbGVkXG4gICAgLy8gdGhpcy5yZWZyZXNoZXIuc3RhcnQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMucmVmcmVzaGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHJlbmRlclByTWV0YWRhdGEocHVsbFJlcXVlc3QsIHJlcG8pIHtcbiAgICBjb25zdCBhdXRob3IgPSB0aGlzLmdldEF1dGhvcihwdWxsUmVxdWVzdCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1tZXRhXCI+XG4gICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYmFzZVJlZk5hbWVcIj57cHVsbFJlcXVlc3QuaXNDcm9zc1JlcG9zaXRvcnkgP1xuICAgICAgICAgIGAke3JlcG8ub3duZXIubG9naW59LyR7cHVsbFJlcXVlc3QuYmFzZVJlZk5hbWV9YCA6IHB1bGxSZXF1ZXN0LmJhc2VSZWZOYW1lfTwvY29kZT57JyDigLkgJ31cbiAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkUmVmTmFtZVwiPntwdWxsUmVxdWVzdC5pc0Nyb3NzUmVwb3NpdG9yeSA/XG4gICAgICAgICAgYCR7YXV0aG9yLmxvZ2lufS8ke3B1bGxSZXF1ZXN0LmhlYWRSZWZOYW1lfWAgOiBwdWxsUmVxdWVzdC5oZWFkUmVmTmFtZX08L2NvZGU+XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclB1bGxSZXF1ZXN0Qm9keShwdWxsUmVxdWVzdCkge1xuICAgIGNvbnN0IG9uQnJhbmNoID0gdGhpcy5wcm9wcy5jaGVja291dE9wLndoeSgpID09PSBjaGVja291dFN0YXRlcy5DVVJSRU5UO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUYWJzIHNlbGVjdGVkSW5kZXg9e3RoaXMucHJvcHMuc2VsZWN0ZWRUYWJ9IG9uU2VsZWN0PXt0aGlzLm9uVGFiU2VsZWN0ZWR9PlxuICAgICAgICA8VGFiTGlzdCBjbGFzc05hbWU9XCJnaXRodWItdGFibGlzdFwiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImluZm9cIiBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIiAvPk92ZXJ2aWV3PC9UYWI+XG4gICAgICAgICAgPFRhYiBjbGFzc05hbWU9XCJnaXRodWItdGFiXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiY2hlY2tsaXN0XCIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCIgLz5cbiAgICAgICAgICAgIEJ1aWxkIFN0YXR1c1xuICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgIDxUYWIgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYlwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImdpdC1jb21taXRcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItdGFiLWljb25cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgQ29tbWl0c1xuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1jb3VudFwiPlxuICAgICAgICAgICAgICB7cHVsbFJlcXVlc3QuY291bnRlZENvbW1pdHMudG90YWxDb3VudH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICA8VGFiIGNsYXNzTmFtZT1cImdpdGh1Yi10YWJcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJkaWZmXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLXRhYi1pY29uXCJcbiAgICAgICAgICAgIC8+RmlsZXNcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi10YWItY291bnRcIj57cHVsbFJlcXVlc3QuY2hhbmdlZEZpbGVzfTwvc3Bhbj5cbiAgICAgICAgICA8L1RhYj5cbiAgICAgICAgPC9UYWJMaXN0PlxuICAgICAgICB7LyogJ1Jldmlld3MnIHRhYiB0byBiZSBhZGRlZCBpbiB0aGUgZnV0dXJlLiAqL31cblxuICAgICAgICB7Lyogb3ZlcnZpZXcgKi99XG4gICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctb3ZlcnZpZXdcIj5cbiAgICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgICBodG1sPXtwdWxsUmVxdWVzdC5ib2R5SFRNTCB8fCAnPGVtPk5vIGRlc2NyaXB0aW9uIHByb3ZpZGVkLjwvZW0+J31cbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgcmVhY3RhYmxlPXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UHVsbFJlcXVlc3RUaW1lbGluZUNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgb25CcmFuY2g9e29uQnJhbmNofVxuICAgICAgICAgICAgICBvcGVuQ29tbWl0PXt0aGlzLnByb3BzLm9wZW5Db21taXR9XG4gICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogYnVpbGQgc3RhdHVzICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWJ1aWxkU3RhdHVzXCI+XG4gICAgICAgICAgICA8UHVsbFJlcXVlc3RTdGF0dXNlc1ZpZXdcbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICBkaXNwbGF5VHlwZT1cImZ1bGxcIlxuICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1RhYlBhbmVsPlxuXG4gICAgICAgIHsvKiBjb21taXRzICovfVxuICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgPFB1bGxSZXF1ZXN0Q29tbWl0c1ZpZXcgcHVsbFJlcXVlc3Q9e3B1bGxSZXF1ZXN0fSBvbkJyYW5jaD17b25CcmFuY2h9IG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH0gLz5cbiAgICAgICAgPC9UYWJQYW5lbD5cblxuICAgICAgICB7LyogZmlsZXMgY2hhbmdlZCAqL31cbiAgICAgICAgPFRhYlBhbmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctZmlsZXNDaGFuZ2VkXCI+XG4gICAgICAgICAgPFB1bGxSZXF1ZXN0Q2hhbmdlZEZpbGVzQ29udGFpbmVyXG4gICAgICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5fVxuXG4gICAgICAgICAgICBvd25lcj17dGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm93bmVyLmxvZ2lufVxuICAgICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm5hbWV9XG4gICAgICAgICAgICBudW1iZXI9e3B1bGxSZXF1ZXN0Lm51bWJlcn1cbiAgICAgICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICAgICAgdG9rZW49e3RoaXMucHJvcHMudG9rZW59XG5cbiAgICAgICAgICAgIHJldmlld0NvbW1lbnRzTG9hZGluZz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c0xvYWRpbmd9XG4gICAgICAgICAgICByZXZpZXdDb21tZW50VGhyZWFkcz17dGhpcy5wcm9wcy5yZXZpZXdDb21tZW50VGhyZWFkc31cblxuICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgd29ya2RpclBhdGg9e3RoaXMucHJvcHMud29ya2RpclBhdGh9XG5cbiAgICAgICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICAgICAgcmVmRWRpdG9yPXt0aGlzLnByb3BzLnJlZkVkaXRvcn1cbiAgICAgICAgICAgIGRlc3Ryb3k9e3RoaXMucHJvcHMuZGVzdHJveX1cblxuICAgICAgICAgICAgc2hvdWxkUmVmZXRjaD17dGhpcy5zdGF0ZS5yZWZyZXNoaW5nfVxuICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuXG4gICAgICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5wdWxsUmVxdWVzdH1cblxuICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUGF0aD17dGhpcy5wcm9wcy5pbml0Q2hhbmdlZEZpbGVQYXRofVxuICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb249e3RoaXMucHJvcHMuaW5pdENoYW5nZWRGaWxlUG9zaXRpb259XG4gICAgICAgICAgICBvbk9wZW5GaWxlc1RhYj17dGhpcy5wcm9wcy5vbk9wZW5GaWxlc1RhYn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVwbyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgICBjb25zdCBwdWxsUmVxdWVzdCA9IHRoaXMucHJvcHMucHVsbFJlcXVlc3Q7XG4gICAgY29uc3QgYXV0aG9yID0gdGhpcy5nZXRBdXRob3IocHVsbFJlcXVlc3QpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldyBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jb250YWluZXJcIj5cblxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW5cIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1hdmF0YXJcIiBocmVmPXthdXRob3IudXJsfT5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYXZhdGFySW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uIGlzLWZsZXhpYmxlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3cgaXMtZnVsbHdpZHRoXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy10aXRsZVwiIGhyZWY9e3B1bGxSZXF1ZXN0LnVybH0+e3B1bGxSZXF1ZXN0LnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3dcIj5cbiAgICAgICAgICAgICAgICA8SXNzdWVpc2hCYWRnZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckJhZGdlXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9e3B1bGxSZXF1ZXN0Ll9fdHlwZW5hbWV9XG4gICAgICAgICAgICAgICAgICBzdGF0ZT17cHVsbFJlcXVlc3Quc3RhdGV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cInJlcG8tc3luY1wiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJlZnJlc2hCdXR0b24nLCB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5yZWZyZXNoaW5nfSl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlZnJlc2hDbGlja31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIm9wZW4gb24gR2l0SHViLmNvbVwiXG4gICAgICAgICAgICAgICAgICBocmVmPXtwdWxsUmVxdWVzdC51cmx9IG9uQ2xpY2s9e3RoaXMucmVjb3JkT3BlbkluQnJvd3NlckV2ZW50fT5cbiAgICAgICAgICAgICAgICAgIHtyZXBvLm93bmVyLmxvZ2lufS97cmVwby5uYW1lfSN7cHVsbFJlcXVlc3QubnVtYmVyfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclN0YXR1c1wiPlxuICAgICAgICAgICAgICAgICAgPFB1bGxSZXF1ZXN0U3RhdHVzZXNWaWV3XG4gICAgICAgICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwdWxsUmVxdWVzdH1cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVR5cGU9XCJjaGVja1wiXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJvd1wiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlclByTWV0YWRhdGEocHVsbFJlcXVlc3QsIHJlcG8pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uXCI+XG4gICAgICAgICAgICAgIDxDaGVja291dEJ1dHRvblxuICAgICAgICAgICAgICAgIGNoZWNrb3V0T3A9e3RoaXMucHJvcHMuY2hlY2tvdXRPcH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWVQcmVmaXg9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWNoZWNrb3V0QnV0dG9uLS1cIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9e1snZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jaGVja291dEJ1dHRvbiddfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9oZWFkZXI+XG5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQdWxsUmVxdWVzdEJvZHkocHVsbFJlcXVlc3QpfVxuXG4gICAgICAgICAgPFJldmlld3NGb290ZXJWaWV3XG4gICAgICAgICAgICBjb21tZW50c1Jlc29sdmVkPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudH1cbiAgICAgICAgICAgIHRvdGFsQ29tbWVudHM9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudHNUb3RhbENvdW50fVxuICAgICAgICAgICAgb3BlblJldmlld3M9e3RoaXMucHJvcHMub3BlblJldmlld3N9XG4gICAgICAgICAgICBwdWxsUmVxdWVzdFVSTD17YCR7dGhpcy5wcm9wcy5wdWxsUmVxdWVzdC51cmx9L2ZpbGVzYH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVSZWZyZXNoQ2xpY2sgPSBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5yZWZyZXNoZXIucmVmcmVzaE5vdyh0cnVlKTtcbiAgfVxuXG4gIHJlY29yZE9wZW5JbkJyb3dzZXJFdmVudCA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1wdWxsLXJlcXVlc3QtaW4tYnJvd3NlcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9uVGFiU2VsZWN0ZWQgPSBpbmRleCA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblRhYlNlbGVjdGVkKGluZGV4KTtcbiAgICBjb25zdCBldmVudE5hbWUgPSBbXG4gICAgICAnb3Blbi1wci10YWItb3ZlcnZpZXcnLFxuICAgICAgJ29wZW4tcHItdGFiLWJ1aWxkLXN0YXR1cycsXG4gICAgICAnb3Blbi1wci10YWItY29tbWl0cycsXG4gICAgICAnb3Blbi1wci10YWItZmlsZXMtY2hhbmdlZCcsXG4gICAgXVtpbmRleF07XG4gICAgYWRkRXZlbnQoZXZlbnROYW1lLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICByZWZyZXNoID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlZnJlc2hpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtyZWZyZXNoaW5nOiB0cnVlfSk7XG4gICAgdGhpcy5wcm9wcy5yZWxheS5yZWZldGNoKHtcbiAgICAgIHJlcG9JZDogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlkLFxuICAgICAgaXNzdWVpc2hJZDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgIHRpbWVsaW5lQ291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWl0Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIGNvbW1pdEN1cnNvcjogbnVsbCxcbiAgICB9LCBudWxsLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZWZyZXNoIHB1bGwgcmVxdWVzdCBkZXRhaWxzJywgZXJyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3JlZnJlc2hpbmc6IGZhbHNlfSk7XG4gICAgfSwge2ZvcmNlOiB0cnVlfSk7XG4gIH1cblxuICBnZXRBdXRob3IocHVsbFJlcXVlc3QpIHtcbiAgICByZXR1cm4gcHVsbFJlcXVlc3QuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUmVmZXRjaENvbnRhaW5lcihCYXJlUHVsbFJlcXVlc3REZXRhaWxWaWV3LCB7XG4gIHJlcG9zaXRvcnk6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gICAgICBpZFxuICAgICAgbmFtZVxuICAgICAgb3duZXIge1xuICAgICAgICBsb2dpblxuICAgICAgfVxuICAgIH1cbiAgYCxcblxuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwckRldGFpbFZpZXdfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3RcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIHRpbWVsaW5lQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNvbW1pdENvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjb21taXRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNoZWNrUnVuQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIGlkXG4gICAgICBfX3R5cGVuYW1lXG4gICAgICB1cmxcbiAgICAgIGlzQ3Jvc3NSZXBvc2l0b3J5XG4gICAgICBjaGFuZ2VkRmlsZXNcbiAgICAgIHN0YXRlXG4gICAgICBudW1iZXJcbiAgICAgIHRpdGxlXG4gICAgICBib2R5SFRNTFxuICAgICAgYmFzZVJlZk5hbWVcbiAgICAgIGhlYWRSZWZOYW1lXG4gICAgICBjb3VudGVkQ29tbWl0czogY29tbWl0cyB7XG4gICAgICAgIHRvdGFsQ291bnRcbiAgICAgIH1cbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGxvZ2luXG4gICAgICAgIGF2YXRhclVybFxuICAgICAgICB1cmxcbiAgICAgIH1cblxuICAgICAgLi4ucHJDb21taXRzVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKGNvbW1pdENvdW50OiAkY29tbWl0Q291bnQsIGNvbW1pdEN1cnNvcjogJGNvbW1pdEN1cnNvcilcbiAgICAgIC4uLnByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoXG4gICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApXG4gICAgICAuLi5wclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LCB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yKVxuICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgIH1cbiAgYCxcbn0sIGdyYXBocWxgXG4gIHF1ZXJ5IHByRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVxuICAoXG4gICAgJHJlcG9JZDogSUQhXG4gICAgJGlzc3VlaXNoSWQ6IElEIVxuICAgICR0aW1lbGluZUNvdW50OiBJbnQhXG4gICAgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmdcbiAgICAkY29tbWl0Q291bnQ6IEludCFcbiAgICAkY29tbWl0Q3Vyc29yOiBTdHJpbmdcbiAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgJGNoZWNrU3VpdGVDdXJzb3I6IFN0cmluZ1xuICAgICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgKSB7XG4gICAgcmVwb3NpdG9yeTogbm9kZShpZDogJHJlcG9JZCkge1xuICAgICAgLi4ucHJEZXRhaWxWaWV3X3JlcG9zaXRvcnlcbiAgICB9XG5cbiAgICBwdWxsUmVxdWVzdDogbm9kZShpZDogJGlzc3VlaXNoSWQpIHtcbiAgICAgIC4uLnByRGV0YWlsVmlld19wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICB0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudFxuICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yXG4gICAgICAgIGNvbW1pdENvdW50OiAkY29tbWl0Q291bnRcbiAgICAgICAgY29tbWl0Q3Vyc29yOiAkY29tbWl0Q3Vyc29yXG4gICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApXG4gICAgfVxuICB9XG5gKTtcbiJdfQ==