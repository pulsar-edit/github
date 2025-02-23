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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wYXRoIiwiX3Byb3BUeXBlcyIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlczIiLCJfcmV2aWV3c1ZpZXciLCJfcHJDaGVja291dENvbnRyb2xsZXIiLCJfYWRkUHJSZXZpZXciLCJfYWRkUHJSZXZpZXdDb21tZW50IiwiX3N1Ym1pdFByUmV2aWV3IiwiX2RlbGV0ZVByUmV2aWV3IiwiX3Jlc29sdmVSZXZpZXdUaHJlYWQiLCJfdW5yZXNvbHZlUmV2aWV3VGhyZWFkIiwiX3VwZGF0ZVByUmV2aWV3Q29tbWVudCIsIl91cGRhdGVQclJldmlld1N1bW1hcnkiLCJfaXNzdWVpc2hEZXRhaWxJdGVtIiwiX3JlcG9ydGVyUHJveHkiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZXh0ZW5kcyIsIk9iamVjdCIsImFzc2lnbiIsImJpbmQiLCJuIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidCIsInIiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJhcHBseSIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90b1Byb3BlcnR5S2V5IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImkiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIlN0cmluZyIsIk51bWJlciIsIkZMQVNIX0RFTEFZIiwiQmFyZVJldmlld3NDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZmlsZVBhdGgiLCJsaW5lTnVtYmVyIiwid29ya3NwYWNlIiwib3BlbiIsInBhdGgiLCJqb2luIiwid29ya2RpciIsImluaXRpYWxMaW5lIiwiaW5pdGlhbENvbHVtbiIsInBlbmRpbmciLCJhZGRFdmVudCIsInBhY2thZ2UiLCJpdGVtIiwiZ2V0UFJEZXRhaWxJdGVtIiwib3BlbkZpbGVzVGFiIiwiY2hhbmdlZEZpbGVQYXRoIiwiY2hhbmdlZEZpbGVQb3NpdGlvbiIsImNvbXBvbmVudCIsIm5hbWUiLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJlbmRwb2ludCIsImdldEhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJzZWFyY2hBbGxQYW5lcyIsInNldFN0YXRlIiwicHJldiIsImNvbnRleHRMaW5lcyIsIk1hdGgiLCJtYXgiLCJob21lUmVwb3NpdG9yeSIsImxvY2FsUmVwb3NpdG9yeSIsImhhc0dpdEh1YlJlbW90ZSIsIndvcmtkaXJDb250ZXh0UG9vbCIsImdldE1hdGNoaW5nQ29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJ1cmkiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiY29tbWVudFNlY3Rpb25PcGVuIiwiY29tbWVudElEIiwic3RhdGUiLCJ0aHJlYWRJRHNPcGVuIiwiYWRkIiwiZGVsZXRlIiwidGhyZWFkSUQiLCJoaWdobGlnaHRlZFRocmVhZElEcyIsInNldFRpbWVvdXQiLCJzY3JvbGxUb1RocmVhZElEIiwidGhyZWFkIiwidmlld2VyQ2FuUmVzb2x2ZSIsImhpZGVUaHJlYWRJRCIsImlkIiwicmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uIiwicmVsYXkiLCJlbnZpcm9ubWVudCIsInZpZXdlcklEIiwidmlld2VyIiwidmlld2VyTG9naW4iLCJsb2dpbiIsImhpZ2hsaWdodFRocmVhZCIsImVyciIsInNob3dUaHJlYWRJRCIsInJlcG9ydFJlbGF5RXJyb3IiLCJ2aWV3ZXJDYW5VbnJlc29sdmUiLCJ1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiIsImNvbW1lbnRCb2R5IiwicmVwbHlUb0lEIiwiY29tbWVudFBhdGgiLCJwb3NpdGlvbiIsImNhbGxiYWNrcyIsInBlbmRpbmdSZXZpZXdJRCIsInBvc3RpbmdUb1RocmVhZElEIiwicmV2aWV3UmVzdWx0IiwiYWRkUmV2aWV3TXV0YXRpb24iLCJwdWxsUmVxdWVzdElEIiwicHVsbFJlcXVlc3QiLCJyZXZpZXdJRCIsImFkZFB1bGxSZXF1ZXN0UmV2aWV3IiwicmV2aWV3RWRnZSIsIm5vZGUiLCJjb21tZW50UHJvbWlzZSIsImFkZFJldmlld0NvbW1lbnRNdXRhdGlvbiIsImJvZHkiLCJpblJlcGx5VG8iLCJkaWRTdWJtaXRDb21tZW50Iiwic3VibWl0UmV2aWV3TXV0YXRpb24iLCJldmVudCIsImVycm9yIiwiZGlkRmFpbENvbW1lbnQiLCJkZWxldGVSZXZpZXdNdXRhdGlvbiIsImVycm9ycyIsInB1c2giLCJjb25zb2xlIiwid2FybiIsImNvbW1lbnRJZCIsInVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uIiwicmV2aWV3SWQiLCJyZXZpZXdCb2R5IiwidXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24iLCJpbml0VGhyZWFkSUQiLCJTZXQiLCJjb21wb25lbnREaWRNb3VudCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInJlbmRlciIsImNyZWF0ZUVsZW1lbnQiLCJyZXBvc2l0b3J5IiwiaXNBYnNlbnQiLCJpc0xvYWRpbmciLCJpc1ByZXNlbnQiLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiYnJhbmNoZXMiLCJyZW1vdGVzIiwiY2hlY2tvdXRPcCIsIm1vcmVDb250ZXh0IiwibGVzc0NvbnRleHQiLCJvcGVuRmlsZSIsIm9wZW5EaWZmIiwib3BlblBSIiwib3Blbklzc3VlaXNoIiwic2hvd1N1bW1hcmllcyIsImhpZGVTdW1tYXJpZXMiLCJzaG93Q29tbWVudHMiLCJoaWRlQ29tbWVudHMiLCJyZXNvbHZlVGhyZWFkIiwidW5yZXNvbHZlVGhyZWFkIiwiYWRkU2luZ2xlQ29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJ1cGRhdGVTdW1tYXJ5IiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsInNoYXBlIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsInN1bW1hcmllcyIsImFycmF5IiwiY29tbWVudFRocmVhZHMiLCJhcnJheU9mIiwiY29tbWVudHMiLCJyZWZldGNoIiwiZnVuYyIsIldvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlIiwiYm9vbCIsIkJyYW5jaFNldFByb3BUeXBlIiwiUmVtb3RlU2V0UHJvcFR5cGUiLCJtdWx0aUZpbGVQYXRjaCIsIkVuZHBvaW50UHJvcFR5cGUiLCJjb25maWciLCJjb21tYW5kcyIsInRvb2x0aXBzIiwiY29uZmlybSIsIl9kZWZhdWx0IiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiLCJoYXNoIl0sInNvdXJjZXMiOlsicmV2aWV3cy1jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZUZyYWdtZW50Q29udGFpbmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7UmVtb3RlU2V0UHJvcFR5cGUsIEJyYW5jaFNldFByb3BUeXBlLCBFbmRwb2ludFByb3BUeXBlLCBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmV2aWV3c1ZpZXcgZnJvbSAnLi4vdmlld3MvcmV2aWV3cy12aWV3JztcbmltcG9ydCBQdWxsUmVxdWVzdENoZWNrb3V0Q29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9wci1jaGVja291dC1jb250cm9sbGVyJztcbmltcG9ydCBhZGRSZXZpZXdNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvYWRkLXByLXJldmlldyc7XG5pbXBvcnQgYWRkUmV2aWV3Q29tbWVudE11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9hZGQtcHItcmV2aWV3LWNvbW1lbnQnO1xuaW1wb3J0IHN1Ym1pdFJldmlld011dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9zdWJtaXQtcHItcmV2aWV3JztcbmltcG9ydCBkZWxldGVSZXZpZXdNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvZGVsZXRlLXByLXJldmlldyc7XG5pbXBvcnQgcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9yZXNvbHZlLXJldmlldy10aHJlYWQnO1xuaW1wb3J0IHVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy91bnJlc29sdmUtcmV2aWV3LXRocmVhZCc7XG5pbXBvcnQgdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3VwZGF0ZS1wci1yZXZpZXctY29tbWVudCc7XG5pbXBvcnQgdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3VwZGF0ZS1wci1yZXZpZXctc3VtbWFyeSc7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuLy8gTWlsbGlzZWNvbmRzIHRvIHVwZGF0ZSBoaWdobGlnaHRlZFRocmVhZElEc1xuY29uc3QgRkxBU0hfREVMQVkgPSAxNTAwO1xuXG5leHBvcnQgY2xhc3MgQmFyZVJldmlld3NDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSByZXN1bHRzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgdmlld2VyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBzdW1tYXJpZXM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSksXG4gICAgcmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIFBhY2thZ2UgbW9kZWxzXG4gICAgd29ya2RpckNvbnRleHRQb29sOiBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGxvY2FsUmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzQWJzZW50OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc1ByZXNlbnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNNZXJnaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzUmViYXNpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVtb3RlczogUmVtb3RlU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBtdWx0aUZpbGVQYXRjaDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGluaXRUaHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIENvbm5lY3Rpb24gcHJvcGVydGllc1xuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBVUkwgcGFyYW1ldGVyc1xuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbnRleHRMaW5lczogNCxcbiAgICAgIHBvc3RpbmdUb1RocmVhZElEOiBudWxsLFxuICAgICAgc2Nyb2xsVG9UaHJlYWRJRDogdGhpcy5wcm9wcy5pbml0VGhyZWFkSUQsXG4gICAgICBzdW1tYXJ5U2VjdGlvbk9wZW46IHRydWUsXG4gICAgICBjb21tZW50U2VjdGlvbk9wZW46IHRydWUsXG4gICAgICB0aHJlYWRJRHNPcGVuOiBuZXcgU2V0KFxuICAgICAgICB0aGlzLnByb3BzLmluaXRUaHJlYWRJRCA/IFt0aGlzLnByb3BzLmluaXRUaHJlYWRJRF0gOiBbXSxcbiAgICAgICksXG4gICAgICBoaWdobGlnaHRlZFRocmVhZElEczogbmV3IFNldCgpLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7c2Nyb2xsVG9UaHJlYWRJRH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChzY3JvbGxUb1RocmVhZElEKSB7XG4gICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZChzY3JvbGxUb1RocmVhZElEKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgY29uc3Qge2luaXRUaHJlYWRJRH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChpbml0VGhyZWFkSUQgJiYgaW5pdFRocmVhZElEICE9PSBwcmV2UHJvcHMuaW5pdFRocmVhZElEKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXYgPT4ge1xuICAgICAgICBwcmV2LnRocmVhZElEc09wZW4uYWRkKGluaXRUaHJlYWRJRCk7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhyZWFkKGluaXRUaHJlYWRJRCk7XG4gICAgICAgIHJldHVybiB7Y29tbWVudFNlY3Rpb25PcGVuOiB0cnVlLCBzY3JvbGxUb1RocmVhZElEOiBpbml0VGhyZWFkSUR9O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXJcbiAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICBwdWxsUmVxdWVzdD17dGhpcy5wcm9wcy5wdWxsUmVxdWVzdH1cblxuICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5fVxuICAgICAgICBpc0Fic2VudD17dGhpcy5wcm9wcy5pc0Fic2VudH1cbiAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgaXNQcmVzZW50PXt0aGlzLnByb3BzLmlzUHJlc2VudH1cbiAgICAgICAgaXNNZXJnaW5nPXt0aGlzLnByb3BzLmlzTWVyZ2luZ31cbiAgICAgICAgaXNSZWJhc2luZz17dGhpcy5wcm9wcy5pc1JlYmFzaW5nfVxuICAgICAgICBicmFuY2hlcz17dGhpcy5wcm9wcy5icmFuY2hlc31cbiAgICAgICAgcmVtb3Rlcz17dGhpcy5wcm9wcy5yZW1vdGVzfT5cblxuICAgICAgICB7Y2hlY2tvdXRPcCA9PiAoXG4gICAgICAgICAgPFJldmlld3NWaWV3XG4gICAgICAgICAgICBjaGVja291dE9wPXtjaGVja291dE9wfVxuICAgICAgICAgICAgY29udGV4dExpbmVzPXt0aGlzLnN0YXRlLmNvbnRleHRMaW5lc31cbiAgICAgICAgICAgIHBvc3RpbmdUb1RocmVhZElEPXt0aGlzLnN0YXRlLnBvc3RpbmdUb1RocmVhZElEfVxuICAgICAgICAgICAgc3VtbWFyeVNlY3Rpb25PcGVuPXt0aGlzLnN0YXRlLnN1bW1hcnlTZWN0aW9uT3Blbn1cbiAgICAgICAgICAgIGNvbW1lbnRTZWN0aW9uT3Blbj17dGhpcy5zdGF0ZS5jb21tZW50U2VjdGlvbk9wZW59XG4gICAgICAgICAgICB0aHJlYWRJRHNPcGVuPXt0aGlzLnN0YXRlLnRocmVhZElEc09wZW59XG4gICAgICAgICAgICBoaWdobGlnaHRlZFRocmVhZElEcz17dGhpcy5zdGF0ZS5oaWdobGlnaHRlZFRocmVhZElEc31cbiAgICAgICAgICAgIHNjcm9sbFRvVGhyZWFkSUQ9e3RoaXMuc3RhdGUuc2Nyb2xsVG9UaHJlYWRJRH1cblxuICAgICAgICAgICAgbW9yZUNvbnRleHQ9e3RoaXMubW9yZUNvbnRleHR9XG4gICAgICAgICAgICBsZXNzQ29udGV4dD17dGhpcy5sZXNzQ29udGV4dH1cbiAgICAgICAgICAgIG9wZW5GaWxlPXt0aGlzLm9wZW5GaWxlfVxuICAgICAgICAgICAgb3BlbkRpZmY9e3RoaXMub3BlbkRpZmZ9XG4gICAgICAgICAgICBvcGVuUFI9e3RoaXMub3BlblBSfVxuICAgICAgICAgICAgb3Blbklzc3VlaXNoPXt0aGlzLm9wZW5Jc3N1ZWlzaH1cbiAgICAgICAgICAgIHNob3dTdW1tYXJpZXM9e3RoaXMuc2hvd1N1bW1hcmllc31cbiAgICAgICAgICAgIGhpZGVTdW1tYXJpZXM9e3RoaXMuaGlkZVN1bW1hcmllc31cbiAgICAgICAgICAgIHNob3dDb21tZW50cz17dGhpcy5zaG93Q29tbWVudHN9XG4gICAgICAgICAgICBoaWRlQ29tbWVudHM9e3RoaXMuaGlkZUNvbW1lbnRzfVxuICAgICAgICAgICAgc2hvd1RocmVhZElEPXt0aGlzLnNob3dUaHJlYWRJRH1cbiAgICAgICAgICAgIGhpZGVUaHJlYWRJRD17dGhpcy5oaWRlVGhyZWFkSUR9XG4gICAgICAgICAgICByZXNvbHZlVGhyZWFkPXt0aGlzLnJlc29sdmVUaHJlYWR9XG4gICAgICAgICAgICB1bnJlc29sdmVUaHJlYWQ9e3RoaXMudW5yZXNvbHZlVGhyZWFkfVxuICAgICAgICAgICAgYWRkU2luZ2xlQ29tbWVudD17dGhpcy5hZGRTaW5nbGVDb21tZW50fVxuICAgICAgICAgICAgdXBkYXRlQ29tbWVudD17dGhpcy51cGRhdGVDb21tZW50fVxuICAgICAgICAgICAgdXBkYXRlU3VtbWFyeT17dGhpcy51cGRhdGVTdW1tYXJ5fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgPC9QdWxsUmVxdWVzdENoZWNrb3V0Q29udHJvbGxlcj5cbiAgICApO1xuICB9XG5cbiAgb3BlbkZpbGUgPSBhc3luYyAoZmlsZVBhdGgsIGxpbmVOdW1iZXIpID0+IHtcbiAgICBhd2FpdCB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKFxuICAgICAgcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2RpciwgZmlsZVBhdGgpLCB7XG4gICAgICAgIGluaXRpYWxMaW5lOiBsaW5lTnVtYmVyIC0gMSxcbiAgICAgICAgaW5pdGlhbENvbHVtbjogMCxcbiAgICAgICAgcGVuZGluZzogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stb3Blbi1maWxlJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gIH1cblxuICBvcGVuRGlmZiA9IGFzeW5jIChmaWxlUGF0aCwgbGluZU51bWJlcikgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCB0aGlzLmdldFBSRGV0YWlsSXRlbSgpO1xuICAgIGl0ZW0ub3BlbkZpbGVzVGFiKHtcbiAgICAgIGNoYW5nZWRGaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgICBjaGFuZ2VkRmlsZVBvc2l0aW9uOiBsaW5lTnVtYmVyLFxuICAgIH0pO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stb3Blbi1kaWZmJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgb3BlblBSID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHRoaXMuZ2V0UFJEZXRhaWxJdGVtKCk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1vcGVuLXByJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgZ2V0UFJEZXRhaWxJdGVtID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKFxuICAgICAgSXNzdWVpc2hEZXRhaWxJdGVtLmJ1aWxkVVJJKHtcbiAgICAgICAgaG9zdDogdGhpcy5wcm9wcy5lbmRwb2ludC5nZXRIb3N0KCksXG4gICAgICAgIG93bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgICByZXBvOiB0aGlzLnByb3BzLnJlcG8sXG4gICAgICAgIG51bWJlcjogdGhpcy5wcm9wcy5udW1iZXIsXG4gICAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMud29ya2RpcixcbiAgICAgIH0pLCB7XG4gICAgICAgIHBlbmRpbmc6IHRydWUsXG4gICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgbW9yZUNvbnRleHQgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZShwcmV2ID0+ICh7Y29udGV4dExpbmVzOiBwcmV2LmNvbnRleHRMaW5lcyArIDF9KSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1zaG93LW1vcmUtY29udGV4dCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICB9XG5cbiAgbGVzc0NvbnRleHQgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZShwcmV2ID0+ICh7Y29udGV4dExpbmVzOiBNYXRoLm1heChwcmV2LmNvbnRleHRMaW5lcyAtIDEsIDEpfSkpO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stc2hvdy1sZXNzLWNvbnRleHQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgfVxuXG4gIG9wZW5Jc3N1ZWlzaCA9IGFzeW5jIChvd25lciwgcmVwbywgbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgaG9zdCA9IHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0SG9zdCgpO1xuXG4gICAgY29uc3QgaG9tZVJlcG9zaXRvcnkgPSBhd2FpdCB0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeS5oYXNHaXRIdWJSZW1vdGUoaG9zdCwgb3duZXIsIHJlcG8pXG4gICAgICA/IHRoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5XG4gICAgICA6IChhd2FpdCB0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbC5nZXRNYXRjaGluZ0NvbnRleHQoaG9zdCwgb3duZXIsIHJlcG8pKS5nZXRSZXBvc2l0b3J5KCk7XG5cbiAgICBjb25zdCB1cmkgPSBJc3N1ZWlzaERldGFpbEl0ZW0uYnVpbGRVUkkoe1xuICAgICAgaG9zdCwgb3duZXIsIHJlcG8sIG51bWJlciwgd29ya2RpcjogaG9tZVJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3Blbih1cmksIHtwZW5kaW5nOiB0cnVlLCBzZWFyY2hBbGxQYW5lczogdHJ1ZX0pO1xuICB9XG5cbiAgc2hvd1N1bW1hcmllcyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7c3VtbWFyeVNlY3Rpb25PcGVuOiB0cnVlfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZGVTdW1tYXJpZXMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe3N1bW1hcnlTZWN0aW9uT3BlbjogZmFsc2V9LCByZXNvbHZlKSk7XG5cbiAgc2hvd0NvbW1lbnRzID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtjb21tZW50U2VjdGlvbk9wZW46IHRydWV9LCByZXNvbHZlKSk7XG5cbiAgaGlkZUNvbW1lbnRzID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtjb21tZW50U2VjdGlvbk9wZW46IGZhbHNlfSwgcmVzb2x2ZSkpO1xuXG4gIHNob3dUaHJlYWRJRCA9IGNvbW1lbnRJRCA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgIHN0YXRlLnRocmVhZElEc09wZW4uYWRkKGNvbW1lbnRJRCk7XG4gICAgcmV0dXJuIHt9O1xuICB9LCByZXNvbHZlKSk7XG5cbiAgaGlkZVRocmVhZElEID0gY29tbWVudElEID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgc3RhdGUudGhyZWFkSURzT3Blbi5kZWxldGUoY29tbWVudElEKTtcbiAgICByZXR1cm4ge307XG4gIH0sIHJlc29sdmUpKTtcblxuICBoaWdobGlnaHRUaHJlYWQgPSB0aHJlYWRJRCA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICBzdGF0ZS5oaWdobGlnaHRlZFRocmVhZElEcy5hZGQodGhyZWFkSUQpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sICgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgIHN0YXRlLmhpZ2hsaWdodGVkVGhyZWFkSURzLmRlbGV0ZSh0aHJlYWRJRCk7XG4gICAgICAgIGlmIChzdGF0ZS5zY3JvbGxUb1RocmVhZElEID09PSB0aHJlYWRJRCkge1xuICAgICAgICAgIHJldHVybiB7c2Nyb2xsVG9UaHJlYWRJRDogbnVsbH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSksIEZMQVNIX0RFTEFZKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc29sdmVUaHJlYWQgPSBhc3luYyB0aHJlYWQgPT4ge1xuICAgIGlmICh0aHJlYWQudmlld2VyQ2FuUmVzb2x2ZSkge1xuICAgICAgLy8gb3B0aW1pc3RpY2FsbHkgaGlkZSB0aGUgdGhyZWFkIHRvIGF2b2lkIGphbmtpbmVzcztcbiAgICAgIC8vIGlmIHRoZSBvcGVyYXRpb24gZmFpbHMsIHRoZSBvbkVycm9yIGNhbGxiYWNrIHdpbGwgcmV2ZXJ0IGl0LlxuICAgICAgdGhpcy5oaWRlVGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgICAgdGhyZWFkSUQ6IHRocmVhZC5pZCxcbiAgICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICAgICAgdmlld2VyTG9naW46IHRoaXMucHJvcHMudmlld2VyLmxvZ2luLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQodGhyZWFkLmlkKTtcbiAgICAgICAgYWRkRXZlbnQoJ3Jlc29sdmUtY29tbWVudC10aHJlYWQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLnNob3dUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZXNvbHZlIHRoZSBjb21tZW50IHRocmVhZCcsIGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5yZXNvbHZlVGhyZWFkID0gYXN5bmMgdGhyZWFkID0+IHtcbiAgICBpZiAodGhyZWFkLnZpZXdlckNhblVucmVzb2x2ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICAgIHRocmVhZElEOiB0aHJlYWQuaWQsXG4gICAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgICAgIHZpZXdlckxvZ2luOiB0aGlzLnByb3BzLnZpZXdlci5sb2dpbixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhyZWFkKHRocmVhZC5pZCk7XG4gICAgICAgIGFkZEV2ZW50KCd1bnJlc29sdmUtY29tbWVudC10aHJlYWQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byB1bnJlc29sdmUgdGhlIGNvbW1lbnQgdGhyZWFkJywgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRTaW5nbGVDb21tZW50ID0gYXN5bmMgKGNvbW1lbnRCb2R5LCB0aHJlYWRJRCwgcmVwbHlUb0lELCBjb21tZW50UGF0aCwgcG9zaXRpb24sIGNhbGxiYWNrcyA9IHt9KSA9PiB7XG4gICAgbGV0IHBlbmRpbmdSZXZpZXdJRCA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Bvc3RpbmdUb1RocmVhZElEOiB0aHJlYWRJRH0pO1xuXG4gICAgICBjb25zdCByZXZpZXdSZXN1bHQgPSBhd2FpdCBhZGRSZXZpZXdNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIHB1bGxSZXF1ZXN0SUQ6IHRoaXMucHJvcHMucHVsbFJlcXVlc3QuaWQsXG4gICAgICAgIHZpZXdlcklEOiB0aGlzLnByb3BzLnZpZXdlci5pZCxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmV2aWV3SUQgPSByZXZpZXdSZXN1bHQuYWRkUHVsbFJlcXVlc3RSZXZpZXcucmV2aWV3RWRnZS5ub2RlLmlkO1xuICAgICAgcGVuZGluZ1Jldmlld0lEID0gcmV2aWV3SUQ7XG5cbiAgICAgIGNvbnN0IGNvbW1lbnRQcm9taXNlID0gYWRkUmV2aWV3Q29tbWVudE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgYm9keTogY29tbWVudEJvZHksXG4gICAgICAgIGluUmVwbHlUbzogcmVwbHlUb0lELFxuICAgICAgICByZXZpZXdJRCxcbiAgICAgICAgdGhyZWFkSUQsXG4gICAgICAgIHZpZXdlcklEOiB0aGlzLnByb3BzLnZpZXdlci5pZCxcbiAgICAgICAgcGF0aDogY29tbWVudFBhdGgsXG4gICAgICAgIHBvc2l0aW9uLFxuICAgICAgfSk7XG4gICAgICBpZiAoY2FsbGJhY2tzLmRpZFN1Ym1pdENvbW1lbnQpIHtcbiAgICAgICAgY2FsbGJhY2tzLmRpZFN1Ym1pdENvbW1lbnQoKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGNvbW1lbnRQcm9taXNlO1xuICAgICAgcGVuZGluZ1Jldmlld0lEID0gbnVsbDtcblxuICAgICAgYXdhaXQgc3VibWl0UmV2aWV3TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBldmVudDogJ0NPTU1FTlQnLFxuICAgICAgICByZXZpZXdJRCxcbiAgICAgIH0pO1xuICAgICAgYWRkRXZlbnQoJ2FkZC1zaW5nbGUtY29tbWVudCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoY2FsbGJhY2tzLmRpZEZhaWxDb21tZW50KSB7XG4gICAgICAgIGNhbGxiYWNrcy5kaWRGYWlsQ29tbWVudCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGVuZGluZ1Jldmlld0lEICE9PSBudWxsKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgZGVsZXRlUmV2aWV3TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICAgICAgcmV2aWV3SUQ6IHBlbmRpbmdSZXZpZXdJRCxcbiAgICAgICAgICAgIHB1bGxSZXF1ZXN0SUQ6IHRoaXMucHJvcHMucHVsbFJlcXVlc3QuaWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChlcnJvci5lcnJvcnMgJiYgZS5lcnJvcnMpIHtcbiAgICAgICAgICAgIGVycm9yLmVycm9ycy5wdXNoKC4uLmUuZXJyb3JzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIGRlbGV0ZSBwZW5kaW5nIHJldmlldycsIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byBzdWJtaXQgeW91ciBjb21tZW50JywgZXJyb3IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtwb3N0aW5nVG9UaHJlYWRJRDogbnVsbH0pO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNvbW1lbnQgPSBhc3luYyAoY29tbWVudElkLCBjb21tZW50Qm9keSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIGNvbW1lbnRJZCxcbiAgICAgICAgY29tbWVudEJvZHksXG4gICAgICB9KTtcbiAgICAgIGFkZEV2ZW50KCd1cGRhdGUtcmV2aWV3LWNvbW1lbnQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gdXBkYXRlIGNvbW1lbnQnLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTdW1tYXJ5ID0gYXN5bmMgKHJldmlld0lkLCByZXZpZXdCb2R5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgcmV2aWV3SWQsXG4gICAgICAgIHJldmlld0JvZHksXG4gICAgICB9KTtcbiAgICAgIGFkZEV2ZW50KCd1cGRhdGUtcmV2aWV3LXN1bW1hcnknLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gdXBkYXRlIHJldmlldyBzdW1tYXJ5JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVSZXZpZXdzQ29udHJvbGxlciwge1xuICB2aWV3ZXI6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyIG9uIFVzZXIge1xuICAgICAgaWRcbiAgICAgIGxvZ2luXG4gICAgICBhdmF0YXJVcmxcbiAgICB9XG4gIGAsXG4gIHJlcG9zaXRvcnk6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcbiAgICAgIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnlcbiAgICB9XG4gIGAsXG4gIHB1bGxSZXF1ZXN0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgIGlkXG4gICAgICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdFxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxVQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxXQUFBLEdBQUFILE9BQUE7QUFFQSxJQUFBSSxXQUFBLEdBQUFKLE9BQUE7QUFDQSxJQUFBSyxZQUFBLEdBQUFOLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTSxxQkFBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU8sWUFBQSxHQUFBUixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVEsbUJBQUEsR0FBQVQsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFTLGVBQUEsR0FBQVYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFVLGVBQUEsR0FBQVgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFXLG9CQUFBLEdBQUFaLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBWSxzQkFBQSxHQUFBYixzQkFBQSxDQUFBQyxPQUFBO0FBQ0Es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