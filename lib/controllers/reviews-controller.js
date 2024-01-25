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
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wYXRoIiwiX3Byb3BUeXBlcyIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlczIiLCJfcmV2aWV3c1ZpZXciLCJfcHJDaGVja291dENvbnRyb2xsZXIiLCJfYWRkUHJSZXZpZXciLCJfYWRkUHJSZXZpZXdDb21tZW50IiwiX3N1Ym1pdFByUmV2aWV3IiwiX2RlbGV0ZVByUmV2aWV3IiwiX3Jlc29sdmVSZXZpZXdUaHJlYWQiLCJfdW5yZXNvbHZlUmV2aWV3VGhyZWFkIiwiX3VwZGF0ZVByUmV2aWV3Q29tbWVudCIsIl91cGRhdGVQclJldmlld1N1bW1hcnkiLCJfaXNzdWVpc2hEZXRhaWxJdGVtIiwiX3JlcG9ydGVyUHJveHkiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9leHRlbmRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYmluZCIsInRhcmdldCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzb3VyY2UiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJhcHBseSIsIl9kZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInQiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJyIiwiZSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiRkxBU0hfREVMQVkiLCJCYXJlUmV2aWV3c0NvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJmaWxlUGF0aCIsImxpbmVOdW1iZXIiLCJ3b3Jrc3BhY2UiLCJvcGVuIiwicGF0aCIsImpvaW4iLCJ3b3JrZGlyIiwiaW5pdGlhbExpbmUiLCJpbml0aWFsQ29sdW1uIiwicGVuZGluZyIsImFkZEV2ZW50IiwicGFja2FnZSIsIml0ZW0iLCJnZXRQUkRldGFpbEl0ZW0iLCJvcGVuRmlsZXNUYWIiLCJjaGFuZ2VkRmlsZVBhdGgiLCJjaGFuZ2VkRmlsZVBvc2l0aW9uIiwiY29tcG9uZW50IiwibmFtZSIsIklzc3VlaXNoRGV0YWlsSXRlbSIsImJ1aWxkVVJJIiwiaG9zdCIsImVuZHBvaW50IiwiZ2V0SG9zdCIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsInNlYXJjaEFsbFBhbmVzIiwic2V0U3RhdGUiLCJwcmV2IiwiY29udGV4dExpbmVzIiwiTWF0aCIsIm1heCIsImhvbWVSZXBvc2l0b3J5IiwibG9jYWxSZXBvc2l0b3J5IiwiaGFzR2l0SHViUmVtb3RlIiwid29ya2RpckNvbnRleHRQb29sIiwiZ2V0TWF0Y2hpbmdDb250ZXh0IiwiZ2V0UmVwb3NpdG9yeSIsInVyaSIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzdW1tYXJ5U2VjdGlvbk9wZW4iLCJjb21tZW50U2VjdGlvbk9wZW4iLCJjb21tZW50SUQiLCJzdGF0ZSIsInRocmVhZElEc09wZW4iLCJhZGQiLCJkZWxldGUiLCJ0aHJlYWRJRCIsImhpZ2hsaWdodGVkVGhyZWFkSURzIiwic2V0VGltZW91dCIsInNjcm9sbFRvVGhyZWFkSUQiLCJ0aHJlYWQiLCJ2aWV3ZXJDYW5SZXNvbHZlIiwiaGlkZVRocmVhZElEIiwiaWQiLCJyZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24iLCJyZWxheSIsImVudmlyb25tZW50Iiwidmlld2VySUQiLCJ2aWV3ZXIiLCJ2aWV3ZXJMb2dpbiIsImxvZ2luIiwiaGlnaGxpZ2h0VGhyZWFkIiwiZXJyIiwic2hvd1RocmVhZElEIiwicmVwb3J0UmVsYXlFcnJvciIsInZpZXdlckNhblVucmVzb2x2ZSIsInVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uIiwiY29tbWVudEJvZHkiLCJyZXBseVRvSUQiLCJjb21tZW50UGF0aCIsInBvc2l0aW9uIiwiY2FsbGJhY2tzIiwicGVuZGluZ1Jldmlld0lEIiwicG9zdGluZ1RvVGhyZWFkSUQiLCJyZXZpZXdSZXN1bHQiLCJhZGRSZXZpZXdNdXRhdGlvbiIsInB1bGxSZXF1ZXN0SUQiLCJwdWxsUmVxdWVzdCIsInJldmlld0lEIiwiYWRkUHVsbFJlcXVlc3RSZXZpZXciLCJyZXZpZXdFZGdlIiwibm9kZSIsImNvbW1lbnRQcm9taXNlIiwiYWRkUmV2aWV3Q29tbWVudE11dGF0aW9uIiwiYm9keSIsImluUmVwbHlUbyIsImRpZFN1Ym1pdENvbW1lbnQiLCJzdWJtaXRSZXZpZXdNdXRhdGlvbiIsImV2ZW50IiwiZXJyb3IiLCJkaWRGYWlsQ29tbWVudCIsImRlbGV0ZVJldmlld011dGF0aW9uIiwiZXJyb3JzIiwicHVzaCIsImNvbnNvbGUiLCJ3YXJuIiwiY29tbWVudElkIiwidXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24iLCJyZXZpZXdJZCIsInJldmlld0JvZHkiLCJ1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbiIsImluaXRUaHJlYWRJRCIsIlNldCIsImNvbXBvbmVudERpZE1vdW50IiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsInJlcG9zaXRvcnkiLCJpc0Fic2VudCIsImlzTG9hZGluZyIsImlzUHJlc2VudCIsImlzTWVyZ2luZyIsImlzUmViYXNpbmciLCJicmFuY2hlcyIsInJlbW90ZXMiLCJjaGVja291dE9wIiwibW9yZUNvbnRleHQiLCJsZXNzQ29udGV4dCIsIm9wZW5GaWxlIiwib3BlbkRpZmYiLCJvcGVuUFIiLCJvcGVuSXNzdWVpc2giLCJzaG93U3VtbWFyaWVzIiwiaGlkZVN1bW1hcmllcyIsInNob3dDb21tZW50cyIsImhpZGVDb21tZW50cyIsInJlc29sdmVUaHJlYWQiLCJ1bnJlc29sdmVUaHJlYWQiLCJhZGRTaW5nbGVDb21tZW50IiwidXBkYXRlQ29tbWVudCIsInVwZGF0ZVN1bW1hcnkiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwic3VtbWFyaWVzIiwiYXJyYXkiLCJjb21tZW50VGhyZWFkcyIsImFycmF5T2YiLCJjb21tZW50cyIsInJlZmV0Y2giLCJmdW5jIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJib29sIiwiQnJhbmNoU2V0UHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsIm11bHRpRmlsZVBhdGNoIiwiRW5kcG9pbnRQcm9wVHlwZSIsImNvbmZpZyIsImNvbW1hbmRzIiwidG9vbHRpcHMiLCJjb25maXJtIiwiX2RlZmF1bHQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciIsImhhc2giXSwic291cmNlcyI6WyJyZXZpZXdzLWNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IHtSZW1vdGVTZXRQcm9wVHlwZSwgQnJhbmNoU2V0UHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGUsIFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBSZXZpZXdzVmlldyBmcm9tICcuLi92aWV3cy9yZXZpZXdzLXZpZXcnO1xuaW1wb3J0IFB1bGxSZXF1ZXN0Q2hlY2tvdXRDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuaW1wb3J0IGFkZFJldmlld011dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9hZGQtcHItcmV2aWV3JztcbmltcG9ydCBhZGRSZXZpZXdDb21tZW50TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2FkZC1wci1yZXZpZXctY29tbWVudCc7XG5pbXBvcnQgc3VibWl0UmV2aWV3TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3N1Ym1pdC1wci1yZXZpZXcnO1xuaW1wb3J0IGRlbGV0ZVJldmlld011dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9kZWxldGUtcHItcmV2aWV3JztcbmltcG9ydCByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3Jlc29sdmUtcmV2aWV3LXRocmVhZCc7XG5pbXBvcnQgdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3VucmVzb2x2ZS1yZXZpZXctdGhyZWFkJztcbmltcG9ydCB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvdXBkYXRlLXByLXJldmlldy1jb21tZW50JztcbmltcG9ydCB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvdXBkYXRlLXByLXJldmlldy1zdW1tYXJ5JztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG4vLyBNaWxsaXNlY29uZHMgdG8gdXBkYXRlIGhpZ2hsaWdodGVkVGhyZWFkSURzXG5jb25zdCBGTEFTSF9ERUxBWSA9IDE1MDA7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUmV2aWV3c0NvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3VsdHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGVudmlyb25tZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICB2aWV3ZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHN1bW1hcmllczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgY29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKSxcbiAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUGFja2FnZSBtb2RlbHNcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNBYnNlbnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzUHJlc2VudDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNSZWJhc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBicmFuY2hlczogQnJhbmNoU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZW1vdGVzOiBSZW1vdGVTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIG11bHRpRmlsZVBhdGNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaW5pdFRocmVhZElEOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gQ29ubmVjdGlvbiBwcm9wZXJ0aWVzXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFVSTCBwYXJhbWV0ZXJzXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29udGV4dExpbmVzOiA0LFxuICAgICAgcG9zdGluZ1RvVGhyZWFkSUQ6IG51bGwsXG4gICAgICBzY3JvbGxUb1RocmVhZElEOiB0aGlzLnByb3BzLmluaXRUaHJlYWRJRCxcbiAgICAgIHN1bW1hcnlTZWN0aW9uT3BlbjogdHJ1ZSxcbiAgICAgIGNvbW1lbnRTZWN0aW9uT3BlbjogdHJ1ZSxcbiAgICAgIHRocmVhZElEc09wZW46IG5ldyBTZXQoXG4gICAgICAgIHRoaXMucHJvcHMuaW5pdFRocmVhZElEID8gW3RoaXMucHJvcHMuaW5pdFRocmVhZElEXSA6IFtdLFxuICAgICAgKSxcbiAgICAgIGhpZ2hsaWdodGVkVGhyZWFkSURzOiBuZXcgU2V0KCksXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHtzY3JvbGxUb1RocmVhZElEfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHNjcm9sbFRvVGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0VGhyZWFkKHNjcm9sbFRvVGhyZWFkSUQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCB7aW5pdFRocmVhZElEfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGluaXRUaHJlYWRJRCAmJiBpbml0VGhyZWFkSUQgIT09IHByZXZQcm9wcy5pbml0VGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldiA9PiB7XG4gICAgICAgIHByZXYudGhyZWFkSURzT3Blbi5hZGQoaW5pdFRocmVhZElEKTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQoaW5pdFRocmVhZElEKTtcbiAgICAgICAgcmV0dXJuIHtjb21tZW50U2VjdGlvbk9wZW46IHRydWUsIHNjcm9sbFRvVGhyZWFkSUQ6IGluaXRUaHJlYWRJRH07XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxQdWxsUmVxdWVzdENoZWNrb3V0Q29udHJvbGxlclxuICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIHB1bGxSZXF1ZXN0PXt0aGlzLnByb3BzLnB1bGxSZXF1ZXN0fVxuXG4gICAgICAgIGxvY2FsUmVwb3NpdG9yeT17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9XG4gICAgICAgIGlzQWJzZW50PXt0aGlzLnByb3BzLmlzQWJzZW50fVxuICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICBpc1ByZXNlbnQ9e3RoaXMucHJvcHMuaXNQcmVzZW50fVxuICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICBpc1JlYmFzaW5nPXt0aGlzLnByb3BzLmlzUmViYXNpbmd9XG4gICAgICAgIGJyYW5jaGVzPXt0aGlzLnByb3BzLmJyYW5jaGVzfVxuICAgICAgICByZW1vdGVzPXt0aGlzLnByb3BzLnJlbW90ZXN9PlxuXG4gICAgICAgIHtjaGVja291dE9wID0+IChcbiAgICAgICAgICA8UmV2aWV3c1ZpZXdcbiAgICAgICAgICAgIGNoZWNrb3V0T3A9e2NoZWNrb3V0T3B9XG4gICAgICAgICAgICBjb250ZXh0TGluZXM9e3RoaXMuc3RhdGUuY29udGV4dExpbmVzfVxuICAgICAgICAgICAgcG9zdGluZ1RvVGhyZWFkSUQ9e3RoaXMuc3RhdGUucG9zdGluZ1RvVGhyZWFkSUR9XG4gICAgICAgICAgICBzdW1tYXJ5U2VjdGlvbk9wZW49e3RoaXMuc3RhdGUuc3VtbWFyeVNlY3Rpb25PcGVufVxuICAgICAgICAgICAgY29tbWVudFNlY3Rpb25PcGVuPXt0aGlzLnN0YXRlLmNvbW1lbnRTZWN0aW9uT3Blbn1cbiAgICAgICAgICAgIHRocmVhZElEc09wZW49e3RoaXMuc3RhdGUudGhyZWFkSURzT3Blbn1cbiAgICAgICAgICAgIGhpZ2hsaWdodGVkVGhyZWFkSURzPXt0aGlzLnN0YXRlLmhpZ2hsaWdodGVkVGhyZWFkSURzfVxuICAgICAgICAgICAgc2Nyb2xsVG9UaHJlYWRJRD17dGhpcy5zdGF0ZS5zY3JvbGxUb1RocmVhZElEfVxuXG4gICAgICAgICAgICBtb3JlQ29udGV4dD17dGhpcy5tb3JlQ29udGV4dH1cbiAgICAgICAgICAgIGxlc3NDb250ZXh0PXt0aGlzLmxlc3NDb250ZXh0fVxuICAgICAgICAgICAgb3BlbkZpbGU9e3RoaXMub3BlbkZpbGV9XG4gICAgICAgICAgICBvcGVuRGlmZj17dGhpcy5vcGVuRGlmZn1cbiAgICAgICAgICAgIG9wZW5QUj17dGhpcy5vcGVuUFJ9XG4gICAgICAgICAgICBvcGVuSXNzdWVpc2g9e3RoaXMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgc2hvd1N1bW1hcmllcz17dGhpcy5zaG93U3VtbWFyaWVzfVxuICAgICAgICAgICAgaGlkZVN1bW1hcmllcz17dGhpcy5oaWRlU3VtbWFyaWVzfVxuICAgICAgICAgICAgc2hvd0NvbW1lbnRzPXt0aGlzLnNob3dDb21tZW50c31cbiAgICAgICAgICAgIGhpZGVDb21tZW50cz17dGhpcy5oaWRlQ29tbWVudHN9XG4gICAgICAgICAgICBzaG93VGhyZWFkSUQ9e3RoaXMuc2hvd1RocmVhZElEfVxuICAgICAgICAgICAgaGlkZVRocmVhZElEPXt0aGlzLmhpZGVUaHJlYWRJRH1cbiAgICAgICAgICAgIHJlc29sdmVUaHJlYWQ9e3RoaXMucmVzb2x2ZVRocmVhZH1cbiAgICAgICAgICAgIHVucmVzb2x2ZVRocmVhZD17dGhpcy51bnJlc29sdmVUaHJlYWR9XG4gICAgICAgICAgICBhZGRTaW5nbGVDb21tZW50PXt0aGlzLmFkZFNpbmdsZUNvbW1lbnR9XG4gICAgICAgICAgICB1cGRhdGVDb21tZW50PXt0aGlzLnVwZGF0ZUNvbW1lbnR9XG4gICAgICAgICAgICB1cGRhdGVTdW1tYXJ5PXt0aGlzLnVwZGF0ZVN1bW1hcnl9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICA8L1B1bGxSZXF1ZXN0Q2hlY2tvdXRDb250cm9sbGVyPlxuICAgICk7XG4gIH1cblxuICBvcGVuRmlsZSA9IGFzeW5jIChmaWxlUGF0aCwgbGluZU51bWJlcikgPT4ge1xuICAgIGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JrZGlyLCBmaWxlUGF0aCksIHtcbiAgICAgICAgaW5pdGlhbExpbmU6IGxpbmVOdW1iZXIgLSAxLFxuICAgICAgICBpbml0aWFsQ29sdW1uOiAwLFxuICAgICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgfSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1vcGVuLWZpbGUnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgfVxuXG4gIG9wZW5EaWZmID0gYXN5bmMgKGZpbGVQYXRoLCBsaW5lTnVtYmVyKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IHRoaXMuZ2V0UFJEZXRhaWxJdGVtKCk7XG4gICAgaXRlbS5vcGVuRmlsZXNUYWIoe1xuICAgICAgY2hhbmdlZEZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGNoYW5nZWRGaWxlUG9zaXRpb246IGxpbmVOdW1iZXIsXG4gICAgfSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1vcGVuLWRpZmYnLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICBvcGVuUFIgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5nZXRQUkRldGFpbEl0ZW0oKTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLW9wZW4tcHInLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICBnZXRQUkRldGFpbEl0ZW0gPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICBJc3N1ZWlzaERldGFpbEl0ZW0uYnVpbGRVUkkoe1xuICAgICAgICBob3N0OiB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKSxcbiAgICAgICAgb3duZXI6IHRoaXMucHJvcHMub3duZXIsXG4gICAgICAgIHJlcG86IHRoaXMucHJvcHMucmVwbyxcbiAgICAgICAgbnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgICAgd29ya2RpcjogdGhpcy5wcm9wcy53b3JrZGlyLFxuICAgICAgfSksIHtcbiAgICAgICAgcGVuZGluZzogdHJ1ZSxcbiAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBtb3JlQ29udGV4dCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHByZXYgPT4gKHtjb250ZXh0TGluZXM6IHByZXYuY29udGV4dExpbmVzICsgMX0pKTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLXNob3ctbW9yZS1jb250ZXh0Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gIH1cblxuICBsZXNzQ29udGV4dCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHByZXYgPT4gKHtjb250ZXh0TGluZXM6IE1hdGgubWF4KHByZXYuY29udGV4dExpbmVzIC0gMSwgMSl9KSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1zaG93LWxlc3MtY29udGV4dCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICB9XG5cbiAgb3Blbklzc3VlaXNoID0gYXN5bmMgKG93bmVyLCByZXBvLCBudW1iZXIpID0+IHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5wcm9wcy5lbmRwb2ludC5nZXRIb3N0KCk7XG5cbiAgICBjb25zdCBob21lUmVwb3NpdG9yeSA9IGF3YWl0IHRoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5Lmhhc0dpdEh1YlJlbW90ZShob3N0LCBvd25lciwgcmVwbylcbiAgICAgID8gdGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnlcbiAgICAgIDogKGF3YWl0IHRoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sLmdldE1hdGNoaW5nQ29udGV4dChob3N0LCBvd25lciwgcmVwbykpLmdldFJlcG9zaXRvcnkoKTtcblxuICAgIGNvbnN0IHVyaSA9IElzc3VlaXNoRGV0YWlsSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0LCBvd25lciwgcmVwbywgbnVtYmVyLCB3b3JrZGlyOiBob21lUmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKHVyaSwge3BlbmRpbmc6IHRydWUsIHNlYXJjaEFsbFBhbmVzOiB0cnVlfSk7XG4gIH1cblxuICBzaG93U3VtbWFyaWVzID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtzdW1tYXJ5U2VjdGlvbk9wZW46IHRydWV9LCByZXNvbHZlKSk7XG5cbiAgaGlkZVN1bW1hcmllcyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7c3VtbWFyeVNlY3Rpb25PcGVuOiBmYWxzZX0sIHJlc29sdmUpKTtcblxuICBzaG93Q29tbWVudHMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2NvbW1lbnRTZWN0aW9uT3BlbjogdHJ1ZX0sIHJlc29sdmUpKTtcblxuICBoaWRlQ29tbWVudHMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2NvbW1lbnRTZWN0aW9uT3BlbjogZmFsc2V9LCByZXNvbHZlKSk7XG5cbiAgc2hvd1RocmVhZElEID0gY29tbWVudElEID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgc3RhdGUudGhyZWFkSURzT3Blbi5hZGQoY29tbWVudElEKTtcbiAgICByZXR1cm4ge307XG4gIH0sIHJlc29sdmUpKTtcblxuICBoaWRlVGhyZWFkSUQgPSBjb21tZW50SUQgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICBzdGF0ZS50aHJlYWRJRHNPcGVuLmRlbGV0ZShjb21tZW50SUQpO1xuICAgIHJldHVybiB7fTtcbiAgfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZ2hsaWdodFRocmVhZCA9IHRocmVhZElEID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICAgIHN0YXRlLmhpZ2hsaWdodGVkVGhyZWFkSURzLmFkZCh0aHJlYWRJRCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSwgKCkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuaGlnaGxpZ2h0ZWRUaHJlYWRJRHMuZGVsZXRlKHRocmVhZElEKTtcbiAgICAgICAgaWYgKHN0YXRlLnNjcm9sbFRvVGhyZWFkSUQgPT09IHRocmVhZElEKSB7XG4gICAgICAgICAgcmV0dXJuIHtzY3JvbGxUb1RocmVhZElEOiBudWxsfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge307XG4gICAgICB9KSwgRkxBU0hfREVMQVkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzb2x2ZVRocmVhZCA9IGFzeW5jIHRocmVhZCA9PiB7XG4gICAgaWYgKHRocmVhZC52aWV3ZXJDYW5SZXNvbHZlKSB7XG4gICAgICAvLyBvcHRpbWlzdGljYWxseSBoaWRlIHRoZSB0aHJlYWQgdG8gYXZvaWQgamFua2luZXNzO1xuICAgICAgLy8gaWYgdGhlIG9wZXJhdGlvbiBmYWlscywgdGhlIG9uRXJyb3IgY2FsbGJhY2sgd2lsbCByZXZlcnQgaXQuXG4gICAgICB0aGlzLmhpZGVUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgICB0aHJlYWRJRDogdGhyZWFkLmlkLFxuICAgICAgICAgIHZpZXdlcklEOiB0aGlzLnByb3BzLnZpZXdlci5pZCxcbiAgICAgICAgICB2aWV3ZXJMb2dpbjogdGhpcy5wcm9wcy52aWV3ZXIubG9naW4sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZCh0aHJlYWQuaWQpO1xuICAgICAgICBhZGRFdmVudCgncmVzb2x2ZS1jb21tZW50LXRocmVhZCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuc2hvd1RocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHJlc29sdmUgdGhlIGNvbW1lbnQgdGhyZWFkJywgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnJlc29sdmVUaHJlYWQgPSBhc3luYyB0aHJlYWQgPT4ge1xuICAgIGlmICh0aHJlYWQudmlld2VyQ2FuVW5yZXNvbHZlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgICAgdGhyZWFkSUQ6IHRocmVhZC5pZCxcbiAgICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICAgICAgdmlld2VyTG9naW46IHRoaXMucHJvcHMudmlld2VyLmxvZ2luLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQodGhyZWFkLmlkKTtcbiAgICAgICAgYWRkRXZlbnQoJ3VucmVzb2x2ZS1jb21tZW50LXRocmVhZCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHVucmVzb2x2ZSB0aGUgY29tbWVudCB0aHJlYWQnLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFNpbmdsZUNvbW1lbnQgPSBhc3luYyAoY29tbWVudEJvZHksIHRocmVhZElELCByZXBseVRvSUQsIGNvbW1lbnRQYXRoLCBwb3NpdGlvbiwgY2FsbGJhY2tzID0ge30pID0+IHtcbiAgICBsZXQgcGVuZGluZ1Jldmlld0lEID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7cG9zdGluZ1RvVGhyZWFkSUQ6IHRocmVhZElEfSk7XG5cbiAgICAgIGNvbnN0IHJldmlld1Jlc3VsdCA9IGF3YWl0IGFkZFJldmlld011dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgcHVsbFJlcXVlc3RJRDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXZpZXdJRCA9IHJldmlld1Jlc3VsdC5hZGRQdWxsUmVxdWVzdFJldmlldy5yZXZpZXdFZGdlLm5vZGUuaWQ7XG4gICAgICBwZW5kaW5nUmV2aWV3SUQgPSByZXZpZXdJRDtcblxuICAgICAgY29uc3QgY29tbWVudFByb21pc2UgPSBhZGRSZXZpZXdDb21tZW50TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBib2R5OiBjb21tZW50Qm9keSxcbiAgICAgICAgaW5SZXBseVRvOiByZXBseVRvSUQsXG4gICAgICAgIHJldmlld0lELFxuICAgICAgICB0aHJlYWRJRCxcbiAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgICBwYXRoOiBjb21tZW50UGF0aCxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICB9KTtcbiAgICAgIGlmIChjYWxsYmFja3MuZGlkU3VibWl0Q29tbWVudCkge1xuICAgICAgICBjYWxsYmFja3MuZGlkU3VibWl0Q29tbWVudCgpO1xuICAgICAgfVxuICAgICAgYXdhaXQgY29tbWVudFByb21pc2U7XG4gICAgICBwZW5kaW5nUmV2aWV3SUQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBzdWJtaXRSZXZpZXdNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIGV2ZW50OiAnQ09NTUVOVCcsXG4gICAgICAgIHJldmlld0lELFxuICAgICAgfSk7XG4gICAgICBhZGRFdmVudCgnYWRkLXNpbmdsZS1jb21tZW50Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsYmFja3MuZGlkRmFpbENvbW1lbnQpIHtcbiAgICAgICAgY2FsbGJhY2tzLmRpZEZhaWxDb21tZW50KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZW5kaW5nUmV2aWV3SUQgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBkZWxldGVSZXZpZXdNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgICAgICByZXZpZXdJRDogcGVuZGluZ1Jldmlld0lELFxuICAgICAgICAgICAgcHVsbFJlcXVlc3RJRDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGVycm9yLmVycm9ycyAmJiBlLmVycm9ycykge1xuICAgICAgICAgICAgZXJyb3IuZXJyb3JzLnB1c2goLi4uZS5lcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdVbmFibGUgdG8gZGVsZXRlIHBlbmRpbmcgcmV2aWV3JywgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHN1Ym1pdCB5b3VyIGNvbW1lbnQnLCBlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Bvc3RpbmdUb1RocmVhZElEOiBudWxsfSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ29tbWVudCA9IGFzeW5jIChjb21tZW50SWQsIGNvbW1lbnRCb2R5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgY29tbWVudElkLFxuICAgICAgICBjb21tZW50Qm9keSxcbiAgICAgIH0pO1xuICAgICAgYWRkRXZlbnQoJ3VwZGF0ZS1yZXZpZXctY29tbWVudCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byB1cGRhdGUgY29tbWVudCcsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVN1bW1hcnkgPSBhc3luYyAocmV2aWV3SWQsIHJldmlld0JvZHkpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICByZXZpZXdJZCxcbiAgICAgICAgcmV2aWV3Qm9keSxcbiAgICAgIH0pO1xuICAgICAgYWRkRXZlbnQoJ3VwZGF0ZS1yZXZpZXctc3VtbWFyeScsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byB1cGRhdGUgcmV2aWV3IHN1bW1hcnknLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZVJldmlld3NDb250cm9sbGVyLCB7XG4gIHZpZXdlcjogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIgb24gVXNlciB7XG4gICAgICBpZFxuICAgICAgbG9naW5cbiAgICAgIGF2YXRhclVybFxuICAgIH1cbiAgYCxcbiAgcmVwb3NpdG9yeTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xuICAgICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeVxuICAgIH1cbiAgYCxcbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3Qge1xuICAgICAgaWRcbiAgICAgIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3B1bGxSZXF1ZXN0XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFVBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFdBQUEsR0FBQUgsT0FBQTtBQUVBLElBQUFJLFdBQUEsR0FBQUosT0FBQTtBQUNBLElBQUFLLFlBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFNLHFCQUFBLEdBQUFQLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTyxZQUFBLEdBQUFSLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUSxtQkFBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVMsZUFBQSxHQUFBVixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVUsZUFBQSxHQUFBWCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVcsb0JBQUEsR0FBQVosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElB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