"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareReviewsController = void 0;
var _react = _interopRequireDefault(require("react"));
var _path = _interopRequireDefault(require("path"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRelay = require("react-relay");
var _propTypes2 = require("../prop-types");
var _reviewsView = _interopRequireDefault(require("../views/reviews-view"));
var _prCheckoutController = _interopRequireDefault(require("../controllers/pr-checkout-controller"));
var _addPrReview = _interopRequireDefault(require("../mutations/add-pr-review"));
var _addPrReviewComment = _interopRequireDefault(require("../mutations/add-pr-review-comment"));
var _submitPrReview = _interopRequireDefault(require("../mutations/submit-pr-review"));
var _deletePrReview = _interopRequireDefault(require("../mutations/delete-pr-review"));
var _resolveReviewThread = _interopRequireDefault(require("../mutations/resolve-review-thread"));
var _unresolveReviewThread = _interopRequireDefault(require("../mutations/unresolve-review-thread"));
var _updatePrReviewComment = _interopRequireDefault(require("../mutations/update-pr-review-comment"));
var _updatePrReviewSummary = _interopRequireDefault(require("../mutations/update-pr-review-summary"));
var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));
var _reporterProxy = require("../reporter-proxy");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// Milliseconds to update highlightedThreadIDs
const FLASH_DELAY = 1500;
class BareReviewsController extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "openFile", async (filePath, lineNumber) => {
      await this.props.workspace.open(_path.default.join(this.props.workdir, filePath), {
        initialLine: lineNumber - 1,
        initialColumn: 0,
        pending: true
      });
      (0, _reporterProxy.addEvent)('reviews-dock-open-file', {
        package: 'github'
      });
    });
    _defineProperty(this, "openDiff", async (filePath, lineNumber) => {
      const item = await this.getPRDetailItem();
      item.openFilesTab({
        changedFilePath: filePath,
        changedFilePosition: lineNumber
      });
      (0, _reporterProxy.addEvent)('reviews-dock-open-diff', {
        package: 'github',
        component: this.constructor.name
      });
    });
    _defineProperty(this, "openPR", async () => {
      await this.getPRDetailItem();
      (0, _reporterProxy.addEvent)('reviews-dock-open-pr', {
        package: 'github',
        component: this.constructor.name
      });
    });
    _defineProperty(this, "getPRDetailItem", () => {
      return this.props.workspace.open(_issueishDetailItem.default.buildURI({
        host: this.props.endpoint.getHost(),
        owner: this.props.owner,
        repo: this.props.repo,
        number: this.props.number,
        workdir: this.props.workdir
      }), {
        pending: true,
        searchAllPanes: true
      });
    });
    _defineProperty(this, "moreContext", () => {
      this.setState(prev => ({
        contextLines: prev.contextLines + 1
      }));
      (0, _reporterProxy.addEvent)('reviews-dock-show-more-context', {
        package: 'github'
      });
    });
    _defineProperty(this, "lessContext", () => {
      this.setState(prev => ({
        contextLines: Math.max(prev.contextLines - 1, 1)
      }));
      (0, _reporterProxy.addEvent)('reviews-dock-show-less-context', {
        package: 'github'
      });
    });
    _defineProperty(this, "openIssueish", async (owner, repo, number) => {
      const host = this.props.endpoint.getHost();
      const homeRepository = (await this.props.localRepository.hasGitHubRemote(host, owner, repo)) ? this.props.localRepository : (await this.props.workdirContextPool.getMatchingContext(host, owner, repo)).getRepository();
      const uri = _issueishDetailItem.default.buildURI({
        host,
        owner,
        repo,
        number,
        workdir: homeRepository.getWorkingDirectoryPath()
      });
      return this.props.workspace.open(uri, {
        pending: true,
        searchAllPanes: true
      });
    });
    _defineProperty(this, "showSummaries", () => new Promise(resolve => this.setState({
      summarySectionOpen: true
    }, resolve)));
    _defineProperty(this, "hideSummaries", () => new Promise(resolve => this.setState({
      summarySectionOpen: false
    }, resolve)));
    _defineProperty(this, "showComments", () => new Promise(resolve => this.setState({
      commentSectionOpen: true
    }, resolve)));
    _defineProperty(this, "hideComments", () => new Promise(resolve => this.setState({
      commentSectionOpen: false
    }, resolve)));
    _defineProperty(this, "showThreadID", commentID => new Promise(resolve => this.setState(state => {
      state.threadIDsOpen.add(commentID);
      return {};
    }, resolve)));
    _defineProperty(this, "hideThreadID", commentID => new Promise(resolve => this.setState(state => {
      state.threadIDsOpen.delete(commentID);
      return {};
    }, resolve)));
    _defineProperty(this, "highlightThread", threadID => {
      this.setState(state => {
        state.highlightedThreadIDs.add(threadID);
        return {};
      }, () => {
        setTimeout(() => this.setState(state => {
          state.highlightedThreadIDs.delete(threadID);
          if (state.scrollToThreadID === threadID) {
            return {
              scrollToThreadID: null
            };
          }
          return {};
        }), FLASH_DELAY);
      });
    });
    _defineProperty(this, "resolveThread", async thread => {
      if (thread.viewerCanResolve) {
        // optimistically hide the thread to avoid jankiness;
        // if the operation fails, the onError callback will revert it.
        this.hideThreadID(thread.id);
        try {
          await (0, _resolveReviewThread.default)(this.props.relay.environment, {
            threadID: thread.id,
            viewerID: this.props.viewer.id,
            viewerLogin: this.props.viewer.login
          });
          this.highlightThread(thread.id);
          (0, _reporterProxy.addEvent)('resolve-comment-thread', {
            package: 'github'
          });
        } catch (err) {
          this.showThreadID(thread.id);
          this.props.reportRelayError('Unable to resolve the comment thread', err);
        }
      }
    });
    _defineProperty(this, "unresolveThread", async thread => {
      if (thread.viewerCanUnresolve) {
        try {
          await (0, _unresolveReviewThread.default)(this.props.relay.environment, {
            threadID: thread.id,
            viewerID: this.props.viewer.id,
            viewerLogin: this.props.viewer.login
          });
          this.highlightThread(thread.id);
          (0, _reporterProxy.addEvent)('unresolve-comment-thread', {
            package: 'github'
          });
        } catch (err) {
          this.props.reportRelayError('Unable to unresolve the comment thread', err);
        }
      }
    });
    _defineProperty(this, "addSingleComment", async (commentBody, threadID, replyToID, commentPath, position, callbacks = {}) => {
      let pendingReviewID = null;
      try {
        this.setState({
          postingToThreadID: threadID
        });
        const reviewResult = await (0, _addPrReview.default)(this.props.relay.environment, {
          pullRequestID: this.props.pullRequest.id,
          viewerID: this.props.viewer.id
        });
        const reviewID = reviewResult.addPullRequestReview.reviewEdge.node.id;
        pendingReviewID = reviewID;
        const commentPromise = (0, _addPrReviewComment.default)(this.props.relay.environment, {
          body: commentBody,
          inReplyTo: replyToID,
          reviewID,
          threadID,
          viewerID: this.props.viewer.id,
          path: commentPath,
          position
        });
        if (callbacks.didSubmitComment) {
          callbacks.didSubmitComment();
        }
        await commentPromise;
        pendingReviewID = null;
        await (0, _submitPrReview.default)(this.props.relay.environment, {
          event: 'COMMENT',
          reviewID
        });
        (0, _reporterProxy.addEvent)('add-single-comment', {
          package: 'github'
        });
      } catch (error) {
        if (callbacks.didFailComment) {
          callbacks.didFailComment();
        }
        if (pendingReviewID !== null) {
          try {
            await (0, _deletePrReview.default)(this.props.relay.environment, {
              reviewID: pendingReviewID,
              pullRequestID: this.props.pullRequest.id
            });
          } catch (e) {
            /* istanbul ignore else */
            if (error.errors && e.errors) {
              error.errors.push(...e.errors);
            } else {
              // eslint-disable-next-line no-console
              console.warn('Unable to delete pending review', e);
            }
          }
        }
        this.props.reportRelayError('Unable to submit your comment', error);
      } finally {
        this.setState({
          postingToThreadID: null
        });
      }
    });
    _defineProperty(this, "updateComment", async (commentId, commentBody) => {
      try {
        await (0, _updatePrReviewComment.default)(this.props.relay.environment, {
          commentId,
          commentBody
        });
        (0, _reporterProxy.addEvent)('update-review-comment', {
          package: 'github'
        });
      } catch (error) {
        this.props.reportRelayError('Unable to update comment', error);
        throw error;
      }
    });
    _defineProperty(this, "updateSummary", async (reviewId, reviewBody) => {
      try {
        await (0, _updatePrReviewSummary.default)(this.props.relay.environment, {
          reviewId,
          reviewBody
        });
        (0, _reporterProxy.addEvent)('update-review-summary', {
          package: 'github'
        });
      } catch (error) {
        this.props.reportRelayError('Unable to update review summary', error);
        throw error;
      }
    });
    this.state = {
      contextLines: 4,
      postingToThreadID: null,
      scrollToThreadID: this.props.initThreadID,
      summarySectionOpen: true,
      commentSectionOpen: true,
      threadIDsOpen: new Set(this.props.initThreadID ? [this.props.initThreadID] : []),
      highlightedThreadIDs: new Set()
    };
  }
  componentDidMount() {
    const {
      scrollToThreadID
    } = this.state;
    if (scrollToThreadID) {
      this.highlightThread(scrollToThreadID);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      initThreadID
    } = this.props;
    if (initThreadID && initThreadID !== prevProps.initThreadID) {
      this.setState(prev => {
        prev.threadIDsOpen.add(initThreadID);
        this.highlightThread(initThreadID);
        return {
          commentSectionOpen: true,
          scrollToThreadID: initThreadID
        };
      });
    }
  }
  render() {
    return _react.default.createElement(_prCheckoutController.default, {
      repository: this.props.repository,
      pullRequest: this.props.pullRequest,
      localRepository: this.props.localRepository,
      isAbsent: this.props.isAbsent,
      isLoading: this.props.isLoading,
      isPresent: this.props.isPresent,
      isMerging: this.props.isMerging,
      isRebasing: this.props.isRebasing,
      branches: this.props.branches,
      remotes: this.props.remotes
    }, checkoutOp => _react.default.createElement(_reviewsView.default, _extends({
      checkoutOp: checkoutOp,
      contextLines: this.state.contextLines,
      postingToThreadID: this.state.postingToThreadID,
      summarySectionOpen: this.state.summarySectionOpen,
      commentSectionOpen: this.state.commentSectionOpen,
      threadIDsOpen: this.state.threadIDsOpen,
      highlightedThreadIDs: this.state.highlightedThreadIDs,
      scrollToThreadID: this.state.scrollToThreadID,
      moreContext: this.moreContext,
      lessContext: this.lessContext,
      openFile: this.openFile,
      openDiff: this.openDiff,
      openPR: this.openPR,
      openIssueish: this.openIssueish,
      showSummaries: this.showSummaries,
      hideSummaries: this.hideSummaries,
      showComments: this.showComments,
      hideComments: this.hideComments,
      showThreadID: this.showThreadID,
      hideThreadID: this.hideThreadID,
      resolveThread: this.resolveThread,
      unresolveThread: this.unresolveThread,
      addSingleComment: this.addSingleComment,
      updateComment: this.updateComment,
      updateSummary: this.updateSummary
    }, this.props)));
  }
}
exports.BareReviewsController = BareReviewsController;
_defineProperty(BareReviewsController, "propTypes", {
  // Relay results
  relay: _propTypes.default.shape({
    environment: _propTypes.default.object.isRequired
  }).isRequired,
  viewer: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }).isRequired,
  repository: _propTypes.default.object.isRequired,
  pullRequest: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }).isRequired,
  summaries: _propTypes.default.array.isRequired,
  commentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    thread: _propTypes.default.object.isRequired,
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
  })),
  refetch: _propTypes.default.func.isRequired,
  // Package models
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  localRepository: _propTypes.default.object.isRequired,
  isAbsent: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  isPresent: _propTypes.default.bool.isRequired,
  isMerging: _propTypes.default.bool.isRequired,
  isRebasing: _propTypes.default.bool.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  multiFilePatch: _propTypes.default.object.isRequired,
  initThreadID: _propTypes.default.string,
  // Connection properties
  endpoint: _propTypes2.EndpointPropType.isRequired,
  // URL parameters
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  workdir: _propTypes.default.string.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareReviewsController, {
  viewer: function () {
    const node = require("./__generated__/reviewsController_viewer.graphql");
    if (node.hash && node.hash !== "e9e4cf88f2d8a809620a0f225d502896") {
      console.error("The definition of 'reviewsController_viewer' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewsController_viewer.graphql");
  },
  repository: function () {
    const node = require("./__generated__/reviewsController_repository.graphql");
    if (node.hash && node.hash !== "1e0016aed6db6035651ff6213eb38ff6") {
      console.error("The definition of 'reviewsController_repository' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewsController_repository.graphql");
  },
  pullRequest: function () {
    const node = require("./__generated__/reviewsController_pullRequest.graphql");
    if (node.hash && node.hash !== "9d67f9908ab4ed776af5f1ee14f61ccb") {
      console.error("The definition of 'reviewsController_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/reviewsController_pullRequest.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wYXRoIiwiX3Byb3BUeXBlcyIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlczIiLCJfcmV2aWV3c1ZpZXciLCJfcHJDaGVja291dENvbnRyb2xsZXIiLCJfYWRkUHJSZXZpZXciLCJfYWRkUHJSZXZpZXdDb21tZW50IiwiX3N1Ym1pdFByUmV2aWV3IiwiX2RlbGV0ZVByUmV2aWV3IiwiX3Jlc29sdmVSZXZpZXdUaHJlYWQiLCJfdW5yZXNvbHZlUmV2aWV3VGhyZWFkIiwiX3VwZGF0ZVByUmV2aWV3Q29tbWVudCIsIl91cGRhdGVQclJldmlld1N1bW1hcnkiLCJfaXNzdWVpc2hEZXRhaWxJdGVtIiwiX3JlcG9ydGVyUHJveHkiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9leHRlbmRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYmluZCIsInRhcmdldCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzb3VyY2UiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJhcHBseSIsIl9kZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsIlR5cGVFcnJvciIsIk51bWJlciIsIkZMQVNIX0RFTEFZIiwiQmFyZVJldmlld3NDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZmlsZVBhdGgiLCJsaW5lTnVtYmVyIiwid29ya3NwYWNlIiwib3BlbiIsInBhdGgiLCJqb2luIiwid29ya2RpciIsImluaXRpYWxMaW5lIiwiaW5pdGlhbENvbHVtbiIsInBlbmRpbmciLCJhZGRFdmVudCIsInBhY2thZ2UiLCJpdGVtIiwiZ2V0UFJEZXRhaWxJdGVtIiwib3BlbkZpbGVzVGFiIiwiY2hhbmdlZEZpbGVQYXRoIiwiY2hhbmdlZEZpbGVQb3NpdGlvbiIsImNvbXBvbmVudCIsIm5hbWUiLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJlbmRwb2ludCIsImdldEhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJzZWFyY2hBbGxQYW5lcyIsInNldFN0YXRlIiwicHJldiIsImNvbnRleHRMaW5lcyIsIk1hdGgiLCJtYXgiLCJob21lUmVwb3NpdG9yeSIsImxvY2FsUmVwb3NpdG9yeSIsImhhc0dpdEh1YlJlbW90ZSIsIndvcmtkaXJDb250ZXh0UG9vbCIsImdldE1hdGNoaW5nQ29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJ1cmkiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiY29tbWVudFNlY3Rpb25PcGVuIiwiY29tbWVudElEIiwic3RhdGUiLCJ0aHJlYWRJRHNPcGVuIiwiYWRkIiwiZGVsZXRlIiwidGhyZWFkSUQiLCJoaWdobGlnaHRlZFRocmVhZElEcyIsInNldFRpbWVvdXQiLCJzY3JvbGxUb1RocmVhZElEIiwidGhyZWFkIiwidmlld2VyQ2FuUmVzb2x2ZSIsImhpZGVUaHJlYWRJRCIsImlkIiwicmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uIiwicmVsYXkiLCJlbnZpcm9ubWVudCIsInZpZXdlcklEIiwidmlld2VyIiwidmlld2VyTG9naW4iLCJsb2dpbiIsImhpZ2hsaWdodFRocmVhZCIsImVyciIsInNob3dUaHJlYWRJRCIsInJlcG9ydFJlbGF5RXJyb3IiLCJ2aWV3ZXJDYW5VbnJlc29sdmUiLCJ1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiIsImNvbW1lbnRCb2R5IiwicmVwbHlUb0lEIiwiY29tbWVudFBhdGgiLCJwb3NpdGlvbiIsImNhbGxiYWNrcyIsInBlbmRpbmdSZXZpZXdJRCIsInBvc3RpbmdUb1RocmVhZElEIiwicmV2aWV3UmVzdWx0IiwiYWRkUmV2aWV3TXV0YXRpb24iLCJwdWxsUmVxdWVzdElEIiwicHVsbFJlcXVlc3QiLCJyZXZpZXdJRCIsImFkZFB1bGxSZXF1ZXN0UmV2aWV3IiwicmV2aWV3RWRnZSIsIm5vZGUiLCJjb21tZW50UHJvbWlzZSIsImFkZFJldmlld0NvbW1lbnRNdXRhdGlvbiIsImJvZHkiLCJpblJlcGx5VG8iLCJkaWRTdWJtaXRDb21tZW50Iiwic3VibWl0UmV2aWV3TXV0YXRpb24iLCJldmVudCIsImVycm9yIiwiZGlkRmFpbENvbW1lbnQiLCJkZWxldGVSZXZpZXdNdXRhdGlvbiIsImUiLCJlcnJvcnMiLCJwdXNoIiwiY29uc29sZSIsIndhcm4iLCJjb21tZW50SWQiLCJ1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbiIsInJldmlld0lkIiwicmV2aWV3Qm9keSIsInVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uIiwiaW5pdFRocmVhZElEIiwiU2V0IiwiY29tcG9uZW50RGlkTW91bnQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJyZW5kZXIiLCJjcmVhdGVFbGVtZW50IiwicmVwb3NpdG9yeSIsImlzQWJzZW50IiwiaXNMb2FkaW5nIiwiaXNQcmVzZW50IiwiaXNNZXJnaW5nIiwiaXNSZWJhc2luZyIsImJyYW5jaGVzIiwicmVtb3RlcyIsImNoZWNrb3V0T3AiLCJtb3JlQ29udGV4dCIsImxlc3NDb250ZXh0Iiwib3BlbkZpbGUiLCJvcGVuRGlmZiIsIm9wZW5QUiIsIm9wZW5Jc3N1ZWlzaCIsInNob3dTdW1tYXJpZXMiLCJoaWRlU3VtbWFyaWVzIiwic2hvd0NvbW1lbnRzIiwiaGlkZUNvbW1lbnRzIiwicmVzb2x2ZVRocmVhZCIsInVucmVzb2x2ZVRocmVhZCIsImFkZFNpbmdsZUNvbW1lbnQiLCJ1cGRhdGVDb21tZW50IiwidXBkYXRlU3VtbWFyeSIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJzdW1tYXJpZXMiLCJhcnJheSIsImNvbW1lbnRUaHJlYWRzIiwiYXJyYXlPZiIsImNvbW1lbnRzIiwicmVmZXRjaCIsImZ1bmMiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsImJvb2wiLCJCcmFuY2hTZXRQcm9wVHlwZSIsIlJlbW90ZVNldFByb3BUeXBlIiwibXVsdGlGaWxlUGF0Y2giLCJFbmRwb2ludFByb3BUeXBlIiwiY29uZmlnIiwiY29tbWFuZHMiLCJ0b29sdGlwcyIsImNvbmZpcm0iLCJfZGVmYXVsdCIsImNyZWF0ZUZyYWdtZW50Q29udGFpbmVyIiwiaGFzaCJdLCJzb3VyY2VzIjpbInJldmlld3MtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1JlbW90ZVNldFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJldmlld3NWaWV3IGZyb20gJy4uL3ZpZXdzL3Jldmlld3Mtdmlldyc7XG5pbXBvcnQgUHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgYWRkUmV2aWV3TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2FkZC1wci1yZXZpZXcnO1xuaW1wb3J0IGFkZFJldmlld0NvbW1lbnRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvYWRkLXByLXJldmlldy1jb21tZW50JztcbmltcG9ydCBzdWJtaXRSZXZpZXdNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvc3VibWl0LXByLXJldmlldyc7XG5pbXBvcnQgZGVsZXRlUmV2aWV3TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2RlbGV0ZS1wci1yZXZpZXcnO1xuaW1wb3J0IHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvcmVzb2x2ZS1yZXZpZXctdGhyZWFkJztcbmltcG9ydCB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvdW5yZXNvbHZlLXJldmlldy10aHJlYWQnO1xuaW1wb3J0IHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy91cGRhdGUtcHItcmV2aWV3LWNvbW1lbnQnO1xuaW1wb3J0IHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy91cGRhdGUtcHItcmV2aWV3LXN1bW1hcnknO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbi8vIE1pbGxpc2Vjb25kcyB0byB1cGRhdGUgaGlnaGxpZ2h0ZWRUaHJlYWRJRHNcbmNvbnN0IEZMQVNIX0RFTEFZID0gMTUwMDtcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXZpZXdzQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzdWx0c1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHZpZXdlcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgc3VtbWFyaWVzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBQYWNrYWdlIG1vZGVsc1xuICAgIHdvcmtkaXJDb250ZXh0UG9vbDogV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBsb2NhbFJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc0Fic2VudDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNQcmVzZW50OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzTWVyZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc1JlYmFzaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGJyYW5jaGVzOiBCcmFuY2hTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgbXVsdGlGaWxlUGF0Y2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpbml0VGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvLyBDb25uZWN0aW9uIHByb3BlcnRpZXNcbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gVVJMIHBhcmFtZXRlcnNcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjb250ZXh0TGluZXM6IDQsXG4gICAgICBwb3N0aW5nVG9UaHJlYWRJRDogbnVsbCxcbiAgICAgIHNjcm9sbFRvVGhyZWFkSUQ6IHRoaXMucHJvcHMuaW5pdFRocmVhZElELFxuICAgICAgc3VtbWFyeVNlY3Rpb25PcGVuOiB0cnVlLFxuICAgICAgY29tbWVudFNlY3Rpb25PcGVuOiB0cnVlLFxuICAgICAgdGhyZWFkSURzT3BlbjogbmV3IFNldChcbiAgICAgICAgdGhpcy5wcm9wcy5pbml0VGhyZWFkSUQgPyBbdGhpcy5wcm9wcy5pbml0VGhyZWFkSURdIDogW10sXG4gICAgICApLFxuICAgICAgaGlnaGxpZ2h0ZWRUaHJlYWRJRHM6IG5ldyBTZXQoKSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qge3Njcm9sbFRvVGhyZWFkSUR9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoc2Nyb2xsVG9UaHJlYWRJRCkge1xuICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQoc2Nyb2xsVG9UaHJlYWRJRCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IHtpbml0VGhyZWFkSUR9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoaW5pdFRocmVhZElEICYmIGluaXRUaHJlYWRJRCAhPT0gcHJldlByb3BzLmluaXRUaHJlYWRJRCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2ID0+IHtcbiAgICAgICAgcHJldi50aHJlYWRJRHNPcGVuLmFkZChpbml0VGhyZWFkSUQpO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZChpbml0VGhyZWFkSUQpO1xuICAgICAgICByZXR1cm4ge2NvbW1lbnRTZWN0aW9uT3BlbjogdHJ1ZSwgc2Nyb2xsVG9UaHJlYWRJRDogaW5pdFRocmVhZElEfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFB1bGxSZXF1ZXN0Q2hlY2tvdXRDb250cm9sbGVyXG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgcHVsbFJlcXVlc3Q9e3RoaXMucHJvcHMucHVsbFJlcXVlc3R9XG5cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeX1cbiAgICAgICAgaXNBYnNlbnQ9e3RoaXMucHJvcHMuaXNBYnNlbnR9XG4gICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgIGlzUHJlc2VudD17dGhpcy5wcm9wcy5pc1ByZXNlbnR9XG4gICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgIGlzUmViYXNpbmc9e3RoaXMucHJvcHMuaXNSZWJhc2luZ31cbiAgICAgICAgYnJhbmNoZXM9e3RoaXMucHJvcHMuYnJhbmNoZXN9XG4gICAgICAgIHJlbW90ZXM9e3RoaXMucHJvcHMucmVtb3Rlc30+XG5cbiAgICAgICAge2NoZWNrb3V0T3AgPT4gKFxuICAgICAgICAgIDxSZXZpZXdzVmlld1xuICAgICAgICAgICAgY2hlY2tvdXRPcD17Y2hlY2tvdXRPcH1cbiAgICAgICAgICAgIGNvbnRleHRMaW5lcz17dGhpcy5zdGF0ZS5jb250ZXh0TGluZXN9XG4gICAgICAgICAgICBwb3N0aW5nVG9UaHJlYWRJRD17dGhpcy5zdGF0ZS5wb3N0aW5nVG9UaHJlYWRJRH1cbiAgICAgICAgICAgIHN1bW1hcnlTZWN0aW9uT3Blbj17dGhpcy5zdGF0ZS5zdW1tYXJ5U2VjdGlvbk9wZW59XG4gICAgICAgICAgICBjb21tZW50U2VjdGlvbk9wZW49e3RoaXMuc3RhdGUuY29tbWVudFNlY3Rpb25PcGVufVxuICAgICAgICAgICAgdGhyZWFkSURzT3Blbj17dGhpcy5zdGF0ZS50aHJlYWRJRHNPcGVufVxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRUaHJlYWRJRHM9e3RoaXMuc3RhdGUuaGlnaGxpZ2h0ZWRUaHJlYWRJRHN9XG4gICAgICAgICAgICBzY3JvbGxUb1RocmVhZElEPXt0aGlzLnN0YXRlLnNjcm9sbFRvVGhyZWFkSUR9XG5cbiAgICAgICAgICAgIG1vcmVDb250ZXh0PXt0aGlzLm1vcmVDb250ZXh0fVxuICAgICAgICAgICAgbGVzc0NvbnRleHQ9e3RoaXMubGVzc0NvbnRleHR9XG4gICAgICAgICAgICBvcGVuRmlsZT17dGhpcy5vcGVuRmlsZX1cbiAgICAgICAgICAgIG9wZW5EaWZmPXt0aGlzLm9wZW5EaWZmfVxuICAgICAgICAgICAgb3BlblBSPXt0aGlzLm9wZW5QUn1cbiAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaD17dGhpcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICBzaG93U3VtbWFyaWVzPXt0aGlzLnNob3dTdW1tYXJpZXN9XG4gICAgICAgICAgICBoaWRlU3VtbWFyaWVzPXt0aGlzLmhpZGVTdW1tYXJpZXN9XG4gICAgICAgICAgICBzaG93Q29tbWVudHM9e3RoaXMuc2hvd0NvbW1lbnRzfVxuICAgICAgICAgICAgaGlkZUNvbW1lbnRzPXt0aGlzLmhpZGVDb21tZW50c31cbiAgICAgICAgICAgIHNob3dUaHJlYWRJRD17dGhpcy5zaG93VGhyZWFkSUR9XG4gICAgICAgICAgICBoaWRlVGhyZWFkSUQ9e3RoaXMuaGlkZVRocmVhZElEfVxuICAgICAgICAgICAgcmVzb2x2ZVRocmVhZD17dGhpcy5yZXNvbHZlVGhyZWFkfVxuICAgICAgICAgICAgdW5yZXNvbHZlVGhyZWFkPXt0aGlzLnVucmVzb2x2ZVRocmVhZH1cbiAgICAgICAgICAgIGFkZFNpbmdsZUNvbW1lbnQ9e3RoaXMuYWRkU2luZ2xlQ29tbWVudH1cbiAgICAgICAgICAgIHVwZGF0ZUNvbW1lbnQ9e3RoaXMudXBkYXRlQ29tbWVudH1cbiAgICAgICAgICAgIHVwZGF0ZVN1bW1hcnk9e3RoaXMudXBkYXRlU3VtbWFyeX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgIDwvUHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXI+XG4gICAgKTtcbiAgfVxuXG4gIG9wZW5GaWxlID0gYXN5bmMgKGZpbGVQYXRoLCBsaW5lTnVtYmVyKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgIHBhdGguam9pbih0aGlzLnByb3BzLndvcmtkaXIsIGZpbGVQYXRoKSwge1xuICAgICAgICBpbml0aWFsTGluZTogbGluZU51bWJlciAtIDEsXG4gICAgICAgIGluaXRpYWxDb2x1bW46IDAsXG4gICAgICAgIHBlbmRpbmc6IHRydWUsXG4gICAgICB9KTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLW9wZW4tZmlsZScsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICB9XG5cbiAgb3BlbkRpZmYgPSBhc3luYyAoZmlsZVBhdGgsIGxpbmVOdW1iZXIpID0+IHtcbiAgICBjb25zdCBpdGVtID0gYXdhaXQgdGhpcy5nZXRQUkRldGFpbEl0ZW0oKTtcbiAgICBpdGVtLm9wZW5GaWxlc1RhYih7XG4gICAgICBjaGFuZ2VkRmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgICAgY2hhbmdlZEZpbGVQb3NpdGlvbjogbGluZU51bWJlcixcbiAgICB9KTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLW9wZW4tZGlmZicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9wZW5QUiA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB0aGlzLmdldFBSRGV0YWlsSXRlbSgpO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stb3Blbi1wcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIGdldFBSRGV0YWlsSXRlbSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgIElzc3VlaXNoRGV0YWlsSXRlbS5idWlsZFVSSSh7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0SG9zdCgpLFxuICAgICAgICBvd25lcjogdGhpcy5wcm9wcy5vd25lcixcbiAgICAgICAgcmVwbzogdGhpcy5wcm9wcy5yZXBvLFxuICAgICAgICBudW1iZXI6IHRoaXMucHJvcHMubnVtYmVyLFxuICAgICAgICB3b3JrZGlyOiB0aGlzLnByb3BzLndvcmtkaXIsXG4gICAgICB9KSwge1xuICAgICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIG1vcmVDb250ZXh0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldiA9PiAoe2NvbnRleHRMaW5lczogcHJldi5jb250ZXh0TGluZXMgKyAxfSkpO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stc2hvdy1tb3JlLWNvbnRleHQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgfVxuXG4gIGxlc3NDb250ZXh0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldiA9PiAoe2NvbnRleHRMaW5lczogTWF0aC5tYXgocHJldi5jb250ZXh0TGluZXMgLSAxLCAxKX0pKTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLXNob3ctbGVzcy1jb250ZXh0Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gIH1cblxuICBvcGVuSXNzdWVpc2ggPSBhc3luYyAob3duZXIsIHJlcG8sIG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKTtcblxuICAgIGNvbnN0IGhvbWVSZXBvc2l0b3J5ID0gYXdhaXQgdGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnkuaGFzR2l0SHViUmVtb3RlKGhvc3QsIG93bmVyLCByZXBvKVxuICAgICAgPyB0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeVxuICAgICAgOiAoYXdhaXQgdGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2wuZ2V0TWF0Y2hpbmdDb250ZXh0KGhvc3QsIG93bmVyLCByZXBvKSkuZ2V0UmVwb3NpdG9yeSgpO1xuXG4gICAgY29uc3QgdXJpID0gSXNzdWVpc2hEZXRhaWxJdGVtLmJ1aWxkVVJJKHtcbiAgICAgIGhvc3QsIG93bmVyLCByZXBvLCBudW1iZXIsIHdvcmtkaXI6IGhvbWVSZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7cGVuZGluZzogdHJ1ZSwgc2VhcmNoQWxsUGFuZXM6IHRydWV9KTtcbiAgfVxuXG4gIHNob3dTdW1tYXJpZXMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe3N1bW1hcnlTZWN0aW9uT3BlbjogdHJ1ZX0sIHJlc29sdmUpKTtcblxuICBoaWRlU3VtbWFyaWVzID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtzdW1tYXJ5U2VjdGlvbk9wZW46IGZhbHNlfSwgcmVzb2x2ZSkpO1xuXG4gIHNob3dDb21tZW50cyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y29tbWVudFNlY3Rpb25PcGVuOiB0cnVlfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZGVDb21tZW50cyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y29tbWVudFNlY3Rpb25PcGVuOiBmYWxzZX0sIHJlc29sdmUpKTtcblxuICBzaG93VGhyZWFkSUQgPSBjb21tZW50SUQgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICBzdGF0ZS50aHJlYWRJRHNPcGVuLmFkZChjb21tZW50SUQpO1xuICAgIHJldHVybiB7fTtcbiAgfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZGVUaHJlYWRJRCA9IGNvbW1lbnRJRCA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgIHN0YXRlLnRocmVhZElEc09wZW4uZGVsZXRlKGNvbW1lbnRJRCk7XG4gICAgcmV0dXJuIHt9O1xuICB9LCByZXNvbHZlKSk7XG5cbiAgaGlnaGxpZ2h0VGhyZWFkID0gdGhyZWFkSUQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgc3RhdGUuaGlnaGxpZ2h0ZWRUaHJlYWRJRHMuYWRkKHRocmVhZElEKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LCAoKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgICBzdGF0ZS5oaWdobGlnaHRlZFRocmVhZElEcy5kZWxldGUodGhyZWFkSUQpO1xuICAgICAgICBpZiAoc3RhdGUuc2Nyb2xsVG9UaHJlYWRJRCA9PT0gdGhyZWFkSUQpIHtcbiAgICAgICAgICByZXR1cm4ge3Njcm9sbFRvVGhyZWFkSUQ6IG51bGx9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0pLCBGTEFTSF9ERUxBWSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNvbHZlVGhyZWFkID0gYXN5bmMgdGhyZWFkID0+IHtcbiAgICBpZiAodGhyZWFkLnZpZXdlckNhblJlc29sdmUpIHtcbiAgICAgIC8vIG9wdGltaXN0aWNhbGx5IGhpZGUgdGhlIHRocmVhZCB0byBhdm9pZCBqYW5raW5lc3M7XG4gICAgICAvLyBpZiB0aGUgb3BlcmF0aW9uIGZhaWxzLCB0aGUgb25FcnJvciBjYWxsYmFjayB3aWxsIHJldmVydCBpdC5cbiAgICAgIHRoaXMuaGlkZVRocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICAgIHRocmVhZElEOiB0aHJlYWQuaWQsXG4gICAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgICAgIHZpZXdlckxvZ2luOiB0aGlzLnByb3BzLnZpZXdlci5sb2dpbixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhyZWFkKHRocmVhZC5pZCk7XG4gICAgICAgIGFkZEV2ZW50KCdyZXNvbHZlLWNvbW1lbnQtdGhyZWFkJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5zaG93VGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gcmVzb2x2ZSB0aGUgY29tbWVudCB0aHJlYWQnLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVucmVzb2x2ZVRocmVhZCA9IGFzeW5jIHRocmVhZCA9PiB7XG4gICAgaWYgKHRocmVhZC52aWV3ZXJDYW5VbnJlc29sdmUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgICB0aHJlYWRJRDogdGhyZWFkLmlkLFxuICAgICAgICAgIHZpZXdlcklEOiB0aGlzLnByb3BzLnZpZXdlci5pZCxcbiAgICAgICAgICB2aWV3ZXJMb2dpbjogdGhpcy5wcm9wcy52aWV3ZXIubG9naW4sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZCh0aHJlYWQuaWQpO1xuICAgICAgICBhZGRFdmVudCgndW5yZXNvbHZlLWNvbW1lbnQtdGhyZWFkJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gdW5yZXNvbHZlIHRoZSBjb21tZW50IHRocmVhZCcsIGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkU2luZ2xlQ29tbWVudCA9IGFzeW5jIChjb21tZW50Qm9keSwgdGhyZWFkSUQsIHJlcGx5VG9JRCwgY29tbWVudFBhdGgsIHBvc2l0aW9uLCBjYWxsYmFja3MgPSB7fSkgPT4ge1xuICAgIGxldCBwZW5kaW5nUmV2aWV3SUQgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtwb3N0aW5nVG9UaHJlYWRJRDogdGhyZWFkSUR9KTtcblxuICAgICAgY29uc3QgcmV2aWV3UmVzdWx0ID0gYXdhaXQgYWRkUmV2aWV3TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBwdWxsUmVxdWVzdElEOiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJldmlld0lEID0gcmV2aWV3UmVzdWx0LmFkZFB1bGxSZXF1ZXN0UmV2aWV3LnJldmlld0VkZ2Uubm9kZS5pZDtcbiAgICAgIHBlbmRpbmdSZXZpZXdJRCA9IHJldmlld0lEO1xuXG4gICAgICBjb25zdCBjb21tZW50UHJvbWlzZSA9IGFkZFJldmlld0NvbW1lbnRNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIGJvZHk6IGNvbW1lbnRCb2R5LFxuICAgICAgICBpblJlcGx5VG86IHJlcGx5VG9JRCxcbiAgICAgICAgcmV2aWV3SUQsXG4gICAgICAgIHRocmVhZElELFxuICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICAgIHBhdGg6IGNvbW1lbnRQYXRoLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgIH0pO1xuICAgICAgaWYgKGNhbGxiYWNrcy5kaWRTdWJtaXRDb21tZW50KSB7XG4gICAgICAgIGNhbGxiYWNrcy5kaWRTdWJtaXRDb21tZW50KCk7XG4gICAgICB9XG4gICAgICBhd2FpdCBjb21tZW50UHJvbWlzZTtcbiAgICAgIHBlbmRpbmdSZXZpZXdJRCA9IG51bGw7XG5cbiAgICAgIGF3YWl0IHN1Ym1pdFJldmlld011dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgZXZlbnQ6ICdDT01NRU5UJyxcbiAgICAgICAgcmV2aWV3SUQsXG4gICAgICB9KTtcbiAgICAgIGFkZEV2ZW50KCdhZGQtc2luZ2xlLWNvbW1lbnQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGNhbGxiYWNrcy5kaWRGYWlsQ29tbWVudCkge1xuICAgICAgICBjYWxsYmFja3MuZGlkRmFpbENvbW1lbnQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBlbmRpbmdSZXZpZXdJRCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGRlbGV0ZVJldmlld011dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgICAgIHJldmlld0lEOiBwZW5kaW5nUmV2aWV3SUQsXG4gICAgICAgICAgICBwdWxsUmVxdWVzdElEOiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoZXJyb3IuZXJyb3JzICYmIGUuZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvci5lcnJvcnMucHVzaCguLi5lLmVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuYWJsZSB0byBkZWxldGUgcGVuZGluZyByZXZpZXcnLCBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gc3VibWl0IHlvdXIgY29tbWVudCcsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7cG9zdGluZ1RvVGhyZWFkSUQ6IG51bGx9KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDb21tZW50ID0gYXN5bmMgKGNvbW1lbnRJZCwgY29tbWVudEJvZHkpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBjb21tZW50SWQsXG4gICAgICAgIGNvbW1lbnRCb2R5LFxuICAgICAgfSk7XG4gICAgICBhZGRFdmVudCgndXBkYXRlLXJldmlldy1jb21tZW50Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHVwZGF0ZSBjb21tZW50JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlU3VtbWFyeSA9IGFzeW5jIChyZXZpZXdJZCwgcmV2aWV3Qm9keSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIHJldmlld0lkLFxuICAgICAgICByZXZpZXdCb2R5LFxuICAgICAgfSk7XG4gICAgICBhZGRFdmVudCgndXBkYXRlLXJldmlldy1zdW1tYXJ5Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHVwZGF0ZSByZXZpZXcgc3VtbWFyeScsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlUmV2aWV3c0NvbnRyb2xsZXIsIHtcbiAgdmlld2VyOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3ZpZXdlciBvbiBVc2VyIHtcbiAgICAgIGlkXG4gICAgICBsb2dpblxuICAgICAgYXZhdGFyVXJsXG4gICAgfVxuICBgLFxuICByZXBvc2l0b3J5OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gICAgICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5XG4gICAgfVxuICBgLFxuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICBpZFxuICAgICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3RcbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsS0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsVUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUcsV0FBQSxHQUFBSCxPQUFBO0FBRUEsSUFBQUksV0FBQSxHQUFBSixPQUFBO0FBQ0EsSUFBQUssWUFBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU0scUJBQUEsR0FBQVAsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFPLFlBQUEsR0FBQVIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFRLG1CQUFBLEdBQUFULHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUyxlQUFBLEdBQUFWLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVSxlQUFBLEdBQUFYLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFB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