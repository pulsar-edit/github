"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueishDetailController = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _issueDetailView = _interopRequireDefault(require("../views/issue-detail-view"));

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));

var _reporterProxy = require("../reporter-proxy");

var _prCheckoutController = _interopRequireDefault(require("./pr-checkout-controller"));

var _prDetailView = _interopRequireDefault(require("../views/pr-detail-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareIssueishDetailController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "openCommit", async ({
      sha
    }) => {
      /* istanbul ignore if */
      if (!this.props.workdirPath) {
        return;
      }

      const uri = _commitDetailItem.default.buildURI(this.props.workdirPath, sha);

      await this.props.workspace.open(uri, {
        pending: true
      });
      (0, _reporterProxy.addEvent)('open-commit-in-pane', {
        package: 'github',
        from: this.constructor.name
      });
    });

    _defineProperty(this, "openReviews", async () => {
      /* istanbul ignore if */
      if (this.getTypename() !== 'PullRequest') {
        return;
      }

      const uri = _reviewsItem.default.buildURI({
        host: this.props.endpoint.getHost(),
        owner: this.props.repository.owner.login,
        repo: this.props.repository.name,
        number: this.props.issueishNumber,
        workdir: this.props.workdirPath
      });

      await this.props.workspace.open(uri);
      (0, _reporterProxy.addEvent)('open-reviews-tab', {
        package: 'github',
        from: this.constructor.name
      });
    });
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate() {
    this.updateTitle();
  }

  updateTitle() {
    const {
      repository
    } = this.props;

    if (repository && (repository.issue || repository.pullRequest)) {
      let prefix, issueish;

      if (this.getTypename() === 'PullRequest') {
        prefix = 'PR:';
        issueish = repository.pullRequest;
      } else {
        prefix = 'Issue:';
        issueish = repository.issue;
      }

      const title = `${prefix} ${repository.owner.login}/${repository.name}#${issueish.number} — ${issueish.title}`;
      this.props.onTitleChange(title);
    }
  }

  render() {
    const {
      repository
    } = this.props;

    if (!repository || !repository.issue || !repository.pullRequest) {
      return /*#__PURE__*/_react.default.createElement("div", null, "Issue/PR #", this.props.issueishNumber, " not found"); // TODO: no PRs
    }

    if (this.getTypename() === 'PullRequest') {
      return /*#__PURE__*/_react.default.createElement(_prCheckoutController.default, {
        repository: repository,
        pullRequest: repository.pullRequest,
        localRepository: this.props.localRepository,
        isAbsent: this.props.isAbsent,
        isLoading: this.props.isLoading,
        isPresent: this.props.isPresent,
        isMerging: this.props.isMerging,
        isRebasing: this.props.isRebasing,
        branches: this.props.branches,
        remotes: this.props.remotes
      }, checkoutOp => /*#__PURE__*/_react.default.createElement(_prDetailView.default, {
        relay: this.props.relay,
        repository: this.props.repository,
        pullRequest: this.props.repository.pullRequest,
        checkoutOp: checkoutOp,
        localRepository: this.props.localRepository,
        reviewCommentsLoading: this.props.reviewCommentsLoading,
        reviewCommentsTotalCount: this.props.reviewCommentsTotalCount,
        reviewCommentsResolvedCount: this.props.reviewCommentsResolvedCount,
        reviewCommentThreads: this.props.reviewCommentThreads,
        endpoint: this.props.endpoint,
        token: this.props.token,
        workspace: this.props.workspace,
        commands: this.props.commands,
        keymaps: this.props.keymaps,
        tooltips: this.props.tooltips,
        config: this.props.config,
        openCommit: this.openCommit,
        openReviews: this.openReviews,
        switchToIssueish: this.props.switchToIssueish,
        destroy: this.props.destroy,
        reportRelayError: this.props.reportRelayError,
        itemType: this.props.itemType,
        refEditor: this.props.refEditor,
        initChangedFilePath: this.props.initChangedFilePath,
        initChangedFilePosition: this.props.initChangedFilePosition,
        selectedTab: this.props.selectedTab,
        onTabSelected: this.props.onTabSelected,
        onOpenFilesTab: this.props.onOpenFilesTab,
        workdirPath: this.props.workdirPath
      }));
    } else {
      return /*#__PURE__*/_react.default.createElement(_issueDetailView.default, {
        repository: repository,
        issue: repository.issue,
        switchToIssueish: this.props.switchToIssueish,
        tooltips: this.props.tooltips,
        reportRelayError: this.props.reportRelayError
      });
    }
  }

  getTypename() {
    const {
      repository
    } = this.props;
    /* istanbul ignore if */

    if (!repository) {
      return null;
    }
    /* istanbul ignore if */


    if (!repository.pullRequest) {
      return null;
    }

    return repository.pullRequest.__typename;
  }

}

exports.BareIssueishDetailController = BareIssueishDetailController;

_defineProperty(BareIssueishDetailController, "propTypes", {
  // Relay response
  relay: _propTypes.default.object.isRequired,
  repository: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    owner: _propTypes.default.shape({
      login: _propTypes.default.string.isRequired
    }).isRequired,
    pullRequest: _propTypes.default.any,
    issue: _propTypes.default.any
  }),
  // Local Repository model properties
  localRepository: _propTypes.default.object.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  isMerging: _propTypes.default.bool.isRequired,
  isRebasing: _propTypes.default.bool.isRequired,
  isAbsent: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  isPresent: _propTypes.default.bool.isRequired,
  workdirPath: _propTypes.default.string,
  issueishNumber: _propTypes.default.number.isRequired,
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
  // Action methods
  onTitleChange: _propTypes.default.func.isRequired,
  switchToIssueish: _propTypes.default.func.isRequired,
  destroy: _propTypes.default.func.isRequired,
  reportRelayError: _propTypes.default.func.isRequired,
  // Item context
  itemType: _propTypes2.ItemTypePropType.isRequired,
  refEditor: _propTypes2.RefHolderPropType.isRequired,
  // For opening files changed tab
  initChangedFilePath: _propTypes.default.string,
  initChangedFilePosition: _propTypes.default.number,
  selectedTab: _propTypes.default.number.isRequired,
  onTabSelected: _propTypes.default.func.isRequired,
  onOpenFilesTab: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareIssueishDetailController, {
  repository: function () {
    const node = require("./__generated__/issueishDetailController_repository.graphql");

    if (node.hash && node.hash !== "504a7b23eb6c4c87798663e4d9c7136a") {
      console.error("The definition of 'issueishDetailController_repository' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueishDetailController_repository.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9pc3N1ZWlzaC1kZXRhaWwtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJCYXJlSXNzdWVpc2hEZXRhaWxDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJzaGEiLCJwcm9wcyIsIndvcmtkaXJQYXRoIiwidXJpIiwiQ29tbWl0RGV0YWlsSXRlbSIsImJ1aWxkVVJJIiwid29ya3NwYWNlIiwib3BlbiIsInBlbmRpbmciLCJwYWNrYWdlIiwiZnJvbSIsImNvbnN0cnVjdG9yIiwibmFtZSIsImdldFR5cGVuYW1lIiwiUmV2aWV3c0l0ZW0iLCJob3N0IiwiZW5kcG9pbnQiLCJnZXRIb3N0Iiwib3duZXIiLCJyZXBvc2l0b3J5IiwibG9naW4iLCJyZXBvIiwibnVtYmVyIiwiaXNzdWVpc2hOdW1iZXIiLCJ3b3JrZGlyIiwiY29tcG9uZW50RGlkTW91bnQiLCJ1cGRhdGVUaXRsZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsImlzc3VlIiwicHVsbFJlcXVlc3QiLCJwcmVmaXgiLCJpc3N1ZWlzaCIsInRpdGxlIiwib25UaXRsZUNoYW5nZSIsInJlbmRlciIsImxvY2FsUmVwb3NpdG9yeSIsImlzQWJzZW50IiwiaXNMb2FkaW5nIiwiaXNQcmVzZW50IiwiaXNNZXJnaW5nIiwiaXNSZWJhc2luZyIsImJyYW5jaGVzIiwicmVtb3RlcyIsImNoZWNrb3V0T3AiLCJyZWxheSIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRzVG90YWxDb3VudCIsInJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudCIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwidG9rZW4iLCJjb21tYW5kcyIsImtleW1hcHMiLCJ0b29sdGlwcyIsImNvbmZpZyIsIm9wZW5Db21taXQiLCJvcGVuUmV2aWV3cyIsInN3aXRjaFRvSXNzdWVpc2giLCJkZXN0cm95IiwicmVwb3J0UmVsYXlFcnJvciIsIml0ZW1UeXBlIiwicmVmRWRpdG9yIiwiaW5pdENoYW5nZWRGaWxlUGF0aCIsImluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uIiwic2VsZWN0ZWRUYWIiLCJvblRhYlNlbGVjdGVkIiwib25PcGVuRmlsZXNUYWIiLCJfX3R5cGVuYW1lIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInNoYXBlIiwic3RyaW5nIiwiYW55IiwiQnJhbmNoU2V0UHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsImJvb2wiLCJhcnJheU9mIiwidGhyZWFkIiwiY29tbWVudHMiLCJFbmRwb2ludFByb3BUeXBlIiwiZnVuYyIsIkl0ZW1UeXBlUHJvcFR5cGUiLCJSZWZIb2xkZXJQcm9wVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSw0QkFBTixTQUEyQ0MsZUFBTUMsU0FBakQsQ0FBMkQ7QUFBQTtBQUFBOztBQUFBLHdDQW9LbkQsT0FBTztBQUFDQyxNQUFBQTtBQUFELEtBQVAsS0FBaUI7QUFDNUI7QUFDQSxVQUFJLENBQUMsS0FBS0MsS0FBTCxDQUFXQyxXQUFoQixFQUE2QjtBQUMzQjtBQUNEOztBQUVELFlBQU1DLEdBQUcsR0FBR0MsMEJBQWlCQyxRQUFqQixDQUEwQixLQUFLSixLQUFMLENBQVdDLFdBQXJDLEVBQWtERixHQUFsRCxDQUFaOztBQUNBLFlBQU0sS0FBS0MsS0FBTCxDQUFXSyxTQUFYLENBQXFCQyxJQUFyQixDQUEwQkosR0FBMUIsRUFBK0I7QUFBQ0ssUUFBQUEsT0FBTyxFQUFFO0FBQVYsT0FBL0IsQ0FBTjtBQUNBLG1DQUFTLHFCQUFULEVBQWdDO0FBQUNDLFFBQUFBLE9BQU8sRUFBRSxRQUFWO0FBQW9CQyxRQUFBQSxJQUFJLEVBQUUsS0FBS0MsV0FBTCxDQUFpQkM7QUFBM0MsT0FBaEM7QUFDRCxLQTdLK0Q7O0FBQUEseUNBK0tsRCxZQUFZO0FBQ3hCO0FBQ0EsVUFBSSxLQUFLQyxXQUFMLE9B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QSxhQUFhLEVBQUVrQyxtQkFBVWEsSUFBVixDQUFlWCxVQTdDYjtBQThDakJiLEVBQUFBLGdCQUFnQixFQUFFVyxtQkFBVWEsSUFBVixDQUFlWCxVQTlDaEI7QUErQ2pCWixFQUFBQSxPQUFPLEVBQUVVLG1CQUFVYSxJQUFWLENBQWVYLFVBL0NQO0FBZ0RqQlgsRUFBQUEsZ0JBQWdCLEVBQUVTLG1CQUFVYSxJQUFWLENBQWVYLFVBaERoQjtBQWtEakI7QUFDQVYsRUFBQUEsUUFBUSxFQUFFc0IsNkJBQWlCWixVQW5EVjtBQW9EakJULEVBQUFBLFNBQVMsRUFBRXNCLDhCQUFrQmIsVUFwRFo7QUFzRGpCO0FBQ0FSLEVBQUFBLG1CQUFtQixFQUFFTSxtQkFBVUksTUF2RGQ7QUF3RGpCVCxFQUFBQSx1QkFBdUIsRUFBRUssbUJBQVU3QyxNQXhEbEI7QUF5RGpCeUMsRUFBQUEsV0FBVyxFQUFFSSxtQkFBVTdDLE1BQVYsQ0FBaUIrQyxVQXpEYjtBQTBEakJMLEVBQUFBLGFBQWEsRUFBRUcsbUJBQVVhLElBQVYsQ0FBZVgsVUExRGI7QUEyRGpCSixFQUFBQSxjQUFjLEVBQUVFLG1CQUFVYSxJQUFWLENBQWVYO0FBM0RkLEM7O2VBNk1OLHlDQUF3QnhFLDRCQUF4QixFQUFzRDtBQUNuRXNCLEVBQUFBLFVBQVU7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUR5RCxDQUF0RCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7XG4gIEJyYW5jaFNldFByb3BUeXBlLCBSZW1vdGVTZXRQcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgUmVmSG9sZGVyUHJvcFR5cGUsXG59IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IElzc3VlRGV0YWlsVmlldyBmcm9tICcuLi92aWV3cy9pc3N1ZS1kZXRhaWwtdmlldyc7XG5pbXBvcnQgQ29tbWl0RGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9jb21taXQtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IFJldmlld3NJdGVtIGZyb20gJy4uL2l0ZW1zL3Jldmlld3MtaXRlbSc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQgUHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXIgZnJvbSAnLi9wci1jaGVja291dC1jb250cm9sbGVyJztcbmltcG9ydCBQdWxsUmVxdWVzdERldGFpbFZpZXcgZnJvbSAnLi4vdmlld3MvcHItZGV0YWlsLXZpZXcnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUlzc3VlaXNoRGV0YWlsQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzcG9uc2VcbiAgICByZWxheTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLmFueSxcbiAgICAgIGlzc3VlOiBQcm9wVHlwZXMuYW55LFxuICAgIH0pLFxuXG4gICAgLy8gTG9jYWwgUmVwb3NpdG9yeSBtb2RlbCBwcm9wZXJ0aWVzXG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVtb3RlczogUmVtb3RlU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNSZWJhc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc0Fic2VudDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNQcmVzZW50OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXJQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGlzc3VlaXNoTnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBSZXZpZXcgY29tbWVudCB0aHJlYWRzXG4gICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHJldmlld0NvbW1lbnRzVG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJldmlld0NvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIENvbm5lY3Rpb24gaW5mb3JtYXRpb25cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHRva2VuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgb25UaXRsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEl0ZW0gY29udGV4dFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVmRWRpdG9yOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gRm9yIG9wZW5pbmcgZmlsZXMgY2hhbmdlZCB0YWJcbiAgICBpbml0Q2hhbmdlZEZpbGVQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHNlbGVjdGVkVGFiOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25UYWJTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbk9wZW5GaWxlc1RhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gIH1cblxuICB1cGRhdGVUaXRsZSgpIHtcbiAgICBjb25zdCB7cmVwb3NpdG9yeX0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChyZXBvc2l0b3J5ICYmIChyZXBvc2l0b3J5Lmlzc3VlIHx8IHJlcG9zaXRvcnkucHVsbFJlcXVlc3QpKSB7XG4gICAgICBsZXQgcHJlZml4LCBpc3N1ZWlzaDtcbiAgICAgIGlmICh0aGlzLmdldFR5cGVuYW1lKCkgPT09ICdQdWxsUmVxdWVzdCcpIHtcbiAgICAgICAgcHJlZml4ID0gJ1BSOic7XG4gICAgICAgIGlzc3VlaXNoID0gcmVwb3NpdG9yeS5wdWxsUmVxdWVzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZWZpeCA9ICdJc3N1ZTonO1xuICAgICAgICBpc3N1ZWlzaCA9IHJlcG9zaXRvcnkuaXNzdWU7XG4gICAgICB9XG4gICAgICBjb25zdCB0aXRsZSA9IGAke3ByZWZpeH0gJHtyZXBvc2l0b3J5Lm93bmVyLmxvZ2lufS8ke3JlcG9zaXRvcnkubmFtZX0jJHtpc3N1ZWlzaC5udW1iZXJ9IOKAlCAke2lzc3VlaXNoLnRpdGxlfWA7XG4gICAgICB0aGlzLnByb3BzLm9uVGl0bGVDaGFuZ2UodGl0bGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cmVwb3NpdG9yeX0gPSB0aGlzLnByb3BzO1xuICAgIGlmICghcmVwb3NpdG9yeSB8fCAhcmVwb3NpdG9yeS5pc3N1ZSB8fCAhcmVwb3NpdG9yeS5wdWxsUmVxdWVzdCkge1xuICAgICAgcmV0dXJuIDxkaXY+SXNzdWUvUFIgI3t0aGlzLnByb3BzLmlzc3VlaXNoTnVtYmVyfSBub3QgZm91bmQ8L2Rpdj47IC8vIFRPRE86IG5vIFBSc1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdldFR5cGVuYW1lKCkgPT09ICdQdWxsUmVxdWVzdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQdWxsUmVxdWVzdENoZWNrb3V0Q29udHJvbGxlclxuICAgICAgICAgIHJlcG9zaXRvcnk9e3JlcG9zaXRvcnl9XG4gICAgICAgICAgcHVsbFJlcXVlc3Q9e3JlcG9zaXRvcnkucHVsbFJlcXVlc3R9XG5cbiAgICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5fVxuICAgICAgICAgIGlzQWJzZW50PXt0aGlzLnByb3BzLmlzQWJzZW50fVxuICAgICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgICAgaXNQcmVzZW50PXt0aGlzLnByb3BzLmlzUHJlc2VudH1cbiAgICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICAgIGlzUmViYXNpbmc9e3RoaXMucHJvcHMuaXNSZWJhc2luZ31cbiAgICAgICAgICBicmFuY2hlcz17dGhpcy5wcm9wcy5icmFuY2hlc31cbiAgICAgICAgICByZW1vdGVzPXt0aGlzLnByb3BzLnJlbW90ZXN9PlxuXG4gICAgICAgICAge2NoZWNrb3V0T3AgPT4gKFxuICAgICAgICAgICAgPFB1bGxSZXF1ZXN0RGV0YWlsVmlld1xuICAgICAgICAgICAgICByZWxheT17dGhpcy5wcm9wcy5yZWxheX1cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5LnB1bGxSZXF1ZXN0fVxuXG4gICAgICAgICAgICAgIGNoZWNrb3V0T3A9e2NoZWNrb3V0T3B9XG4gICAgICAgICAgICAgIGxvY2FsUmVwb3NpdG9yeT17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9XG5cbiAgICAgICAgICAgICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nPXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzTG9hZGluZ31cbiAgICAgICAgICAgICAgcmV2aWV3Q29tbWVudHNUb3RhbENvdW50PXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzVG90YWxDb3VudH1cbiAgICAgICAgICAgICAgcmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50PXt0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzUmVzb2x2ZWRDb3VudH1cbiAgICAgICAgICAgICAgcmV2aWV3Q29tbWVudFRocmVhZHM9e3RoaXMucHJvcHMucmV2aWV3Q29tbWVudFRocmVhZHN9XG5cbiAgICAgICAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgICAgICAgIHRva2VuPXt0aGlzLnByb3BzLnRva2VufVxuXG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIG9wZW5Db21taXQ9e3RoaXMub3BlbkNvbW1pdH1cbiAgICAgICAgICAgICAgb3BlblJldmlld3M9e3RoaXMub3BlblJldmlld3N9XG4gICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgZGVzdHJveT17dGhpcy5wcm9wcy5kZXN0cm95fVxuICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG5cbiAgICAgICAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgICAgICAgIHJlZkVkaXRvcj17dGhpcy5wcm9wcy5yZWZFZGl0b3J9XG5cbiAgICAgICAgICAgICAgaW5pdENoYW5nZWRGaWxlUGF0aD17dGhpcy5wcm9wcy5pbml0Q2hhbmdlZEZpbGVQYXRofVxuICAgICAgICAgICAgICBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbj17dGhpcy5wcm9wcy5pbml0Q2hhbmdlZEZpbGVQb3NpdGlvbn1cbiAgICAgICAgICAgICAgc2VsZWN0ZWRUYWI9e3RoaXMucHJvcHMuc2VsZWN0ZWRUYWJ9XG4gICAgICAgICAgICAgIG9uVGFiU2VsZWN0ZWQ9e3RoaXMucHJvcHMub25UYWJTZWxlY3RlZH1cbiAgICAgICAgICAgICAgb25PcGVuRmlsZXNUYWI9e3RoaXMucHJvcHMub25PcGVuRmlsZXNUYWJ9XG4gICAgICAgICAgICAgIHdvcmtkaXJQYXRoPXt0aGlzLnByb3BzLndvcmtkaXJQYXRofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgIDwvUHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXI+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8SXNzdWVEZXRhaWxWaWV3XG4gICAgICAgICAgcmVwb3NpdG9yeT17cmVwb3NpdG9yeX1cbiAgICAgICAgICBpc3N1ZT17cmVwb3NpdG9yeS5pc3N1ZX1cbiAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBvcGVuQ29tbWl0ID0gYXN5bmMgKHtzaGF9KSA9PiB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0aGlzLnByb3BzLndvcmtkaXJQYXRoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJpID0gQ29tbWl0RGV0YWlsSXRlbS5idWlsZFVSSSh0aGlzLnByb3BzLndvcmtkaXJQYXRoLCBzaGEpO1xuICAgIGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7cGVuZGluZzogdHJ1ZX0pO1xuICAgIGFkZEV2ZW50KCdvcGVuLWNvbW1pdC1pbi1wYW5lJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9wZW5SZXZpZXdzID0gYXN5bmMgKCkgPT4ge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh0aGlzLmdldFR5cGVuYW1lKCkgIT09ICdQdWxsUmVxdWVzdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cmkgPSBSZXZpZXdzSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0OiB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKSxcbiAgICAgIG93bmVyOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkub3duZXIubG9naW4sXG4gICAgICByZXBvOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkubmFtZSxcbiAgICAgIG51bWJlcjogdGhpcy5wcm9wcy5pc3N1ZWlzaE51bWJlcixcbiAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMud29ya2RpclBhdGgsXG4gICAgfSk7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3Blbih1cmkpO1xuICAgIGFkZEV2ZW50KCdvcGVuLXJldmlld3MtdGFiJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIGdldFR5cGVuYW1lKCkge1xuICAgIGNvbnN0IHtyZXBvc2l0b3J5fSA9IHRoaXMucHJvcHM7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFyZXBvc2l0b3J5KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFyZXBvc2l0b3J5LnB1bGxSZXF1ZXN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHJlcG9zaXRvcnkucHVsbFJlcXVlc3QuX190eXBlbmFtZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlSXNzdWVpc2hEZXRhaWxDb250cm9sbGVyLCB7XG4gIHJlcG9zaXRvcnk6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgaXNzdWVpc2hEZXRhaWxDb250cm9sbGVyX3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeVxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgaXNzdWVpc2hOdW1iZXI6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHRpbWVsaW5lQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNvbW1pdENvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjb21taXRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNoZWNrUnVuQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIC4uLmlzc3VlRGV0YWlsVmlld19yZXBvc2l0b3J5XG4gICAgICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5XG4gICAgICAuLi5wckRldGFpbFZpZXdfcmVwb3NpdG9yeVxuICAgICAgbmFtZVxuICAgICAgb3duZXIge1xuICAgICAgICBsb2dpblxuICAgICAgfVxuICAgICAgaXNzdWU6IGlzc3VlT3JQdWxsUmVxdWVzdChudW1iZXI6ICRpc3N1ZWlzaE51bWJlcikge1xuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgIC4uLiBvbiBJc3N1ZSB7XG4gICAgICAgICAgdGl0bGVcbiAgICAgICAgICBudW1iZXJcbiAgICAgICAgICAuLi5pc3N1ZURldGFpbFZpZXdfaXNzdWUgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LFxuICAgICAgICAgICAgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvcixcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHB1bGxSZXF1ZXN0OiBpc3N1ZU9yUHVsbFJlcXVlc3QobnVtYmVyOiAkaXNzdWVpc2hOdW1iZXIpIHtcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xuICAgICAgICAgIHRpdGxlXG4gICAgICAgICAgbnVtYmVyXG4gICAgICAgICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3RcbiAgICAgICAgICAuLi5wckRldGFpbFZpZXdfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50XG4gICAgICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yXG4gICAgICAgICAgICBjb21taXRDb3VudDogJGNvbW1pdENvdW50XG4gICAgICAgICAgICBjb21taXRDdXJzb3I6ICRjb21taXRDdXJzb3JcbiAgICAgICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogJGNoZWNrU3VpdGVDdXJzb3JcbiAgICAgICAgICAgIGNoZWNrUnVuQ291bnQ6ICRjaGVja1J1bkNvdW50XG4gICAgICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=