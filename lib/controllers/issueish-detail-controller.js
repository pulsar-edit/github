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
      return _react.default.createElement("div", null, "Issue/PR #", this.props.issueishNumber, " not found"); // TODO: no PRs
    }

    if (this.getTypename() === 'PullRequest') {
      return _react.default.createElement(_prCheckoutController.default, {
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
      }, checkoutOp => _react.default.createElement(_prDetailView.default, {
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
      return _react.default.createElement(_issueDetailView.default, {
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