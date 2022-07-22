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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement(_prCheckoutController.default, {
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
    }, checkoutOp => /*#__PURE__*/_react.default.createElement(_reviewsView.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yZXZpZXdzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRkxBU0hfREVMQVkiLCJCYXJlUmV2aWV3c0NvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJmaWxlUGF0aCIsImxpbmVOdW1iZXIiLCJ3b3Jrc3BhY2UiLCJvcGVuIiwicGF0aCIsImpvaW4iLCJ3b3JrZGlyIiwiaW5pdGlhbExpbmUiLCJpbml0aWFsQ29sdW1uIiwicGVuZGluZyIsInBhY2thZ2UiLCJpdGVtIiwiZ2V0UFJEZXRhaWxJdGVtIiwib3BlbkZpbGVzVGFiIiwiY2hhbmdlZEZpbGVQYXRoIiwiY2hhbmdlZEZpbGVQb3NpdGlvbiIsImNvbXBvbmVudCIsIm5hbWUiLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJlbmRwb2ludCIsImdldEhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJzZWFyY2hBbGxQYW5lcyIsInNldFN0YXRlIiwicHJldiIsImNvbnRleHRMaW5lcyIsIk1hdGgiLCJtYXgiLCJob21lUmVwb3NpdG9yeSIsImxvY2FsUmVwb3NpdG9yeSIsImhhc0dpdEh1YlJlbW90ZSIsIndvcmtkaXJDb250ZXh0UG9vbCIsImdldE1hdGNoaW5nQ29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJ1cmkiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiY29tbWVudFNlY3Rpb25PcGVuIiwiY29tbWVudElEIiwic3RhdGUiLCJ0aHJlYWRJRHNPcGVuIiwiYWRkIiwiZGVsZXRlIiwidGhyZWFkSUQiLCJoaWdobGlnaHRlZFRocmVhZElEcyIsInNldFRpbWVvdXQiLCJzY3JvbGxUb1RocmVhZElEIiwidGhyZWFkIiwidmlld2VyQ2FuUmVzb2x2ZSIsImhpZGVUaHJlYWRJRCIsImlkIiwicmVsYXkiLCJlbnZpcm9ubWVudCIsInZpZXdlcklEIiwidmlld2VyIiwidmlld2VyTG9naW4iLCJsb2dpbiIsImhpZ2hsaWdodFRocmVhZCIsImVyciIsInNob3dUaHJlYWRJRCIsInJlcG9ydFJlbGF5RXJyb3IiLCJ2aWV3ZXJDYW5VbnJlc29sdmUiLCJjb21tZW50Qm9keSIsInJlcGx5VG9JRCIsImNvbW1lbnRQYXRoIiwicG9zaXRpb24iLCJjYWxsYmFja3MiLCJwZW5kaW5nUmV2aWV3SUQiLCJwb3N0aW5nVG9UaHJlYWRJRCIsInJldmlld1Jlc3VsdCIsInB1bGxSZXF1ZXN0SUQiLCJwdWxsUmVxdWVzdCIsInJldmlld0lEIiwiYWRkUHVsbFJlcXVlc3RSZXZpZXciLCJyZXZpZXdFZGdlIiwibm9kZSIsImNvbW1lbnRQcm9taXNlIiwiYm9keSIsImluUmVwbHlUbyIsImRpZFN1Ym1pdENvbW1lbnQiLCJldmVudCIsImVycm9yIiwiZGlkRmFpbENvbW1lbnQiLCJlIiwiZXJyb3JzIiwicHVzaCIsImNvbnNvbGUiLCJ3YXJuIiwiY29tbWVudElkIiwicmV2aWV3SWQiLCJyZXZpZXdCb2R5IiwiaW5pdFRocmVhZElEIiwiU2V0IiwiY29tcG9uZW50RGlkTW91bnQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJyZW5kZXIiLCJyZXBvc2l0b3J5IiwiaXNBYnNlbnQiLCJpc0xvYWRpbmciLCJpc1ByZXNlbnQiLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiYnJhbmNoZXMiLCJyZW1vdGVzIiwiY2hlY2tvdXRPcCIsIm1vcmVDb250ZXh0IiwibGVzc0NvbnRleHQiLCJvcGVuRmlsZSIsIm9wZW5EaWZmIiwib3BlblBSIiwib3Blbklzc3VlaXNoIiwic2hvd1N1bW1hcmllcyIsImhpZGVTdW1tYXJpZXMiLCJzaG93Q29tbWVudHMiLCJoaWRlQ29tbWVudHMiLCJyZXNvbHZlVGhyZWFkIiwidW5yZXNvbHZlVGhyZWFkIiwiYWRkU2luZ2xlQ29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJ1cGRhdGVTdW1tYXJ5IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwic3VtbWFyaWVzIiwiYXJyYXkiLCJjb21tZW50VGhyZWFkcyIsImFycmF5T2YiLCJjb21tZW50cyIsInJlZmV0Y2giLCJmdW5jIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJib29sIiwiQnJhbmNoU2V0UHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsIm11bHRpRmlsZVBhdGNoIiwiRW5kcG9pbnRQcm9wVHlwZSIsImNvbmZpZyIsImNvbW1hbmRzIiwidG9vbHRpcHMiLCJjb25maXJtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7QUFDQSxNQUFNQSxXQUFXLEdBQUcsSUFBcEI7O0FBRU8sTUFBTUMscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBcUR6REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsc0NBcUZSLE9BQU9DLFFBQVAsRUFBaUJDLFVBQWpCLEtBQWdDO0FBQ3pDLFlBQU0sS0FBS0YsS0FBTCxDQUFXRyxTQUFYLENBQXFCQyxJQUFyQixDQUNKQyxjQUFLQyxJQUFMLENBQVUsS0FBS04sS0FBTCxDQUFXTyxPQUFyQixFQUE4Qk4sUUFBOUIsQ0FESSxFQUNxQztBQUN2Q08sUUFBQUEsV0FBVyxFQUFFTixVQUFVLEdBQUcsQ0FEYTtBQUV2Q08sUUFBQUEsYUFBYSxFQUFFLENBRndCO0FBR3ZDQyxRQUFBQSxPQUFPLEVBQUU7QUFIOEIsT0FEckMsQ0FBTjtBQU1BLG1DQUFTLHdCQUFULEVBQW1DO0FBQUNDLFFBQUFBLE9BQU8sRUFBRTtBQUFWLE9BQW5DO0FBQ0QsS0E3RmtCOztBQUFBLHNDQStGUixPQUFPVixRQUFQ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LENBQWlCQyxVQTFDWDtBQTJDakJlLEVBQUFBLE1BQU0sRUFBRWxCLG1CQUFVRSxNQUFWLENBQWlCQyxVQTNDUjtBQTRDakJnQixFQUFBQSxRQUFRLEVBQUVuQixtQkFBVUUsTUFBVixDQUFpQkMsVUE1Q1Y7QUE2Q2pCaUIsRUFBQUEsUUFBUSxFQUFFcEIsbUJBQVVFLE1BQVYsQ0FBaUJDLFVBN0NWO0FBOENqQmtCLEVBQUFBLE9BQU8sRUFBRXJCLG1CQUFVVyxJQUFWLENBQWVSLFVBOUNQO0FBZ0RqQjtBQUNBaEUsRUFBQUEsZ0JBQWdCLEVBQUU2RCxtQkFBVVcsSUFBVixDQUFlUjtBQWpEaEIsQzs7ZUFtV04seUNBQXdCdkkscUJBQXhCLEVBQStDO0FBQzVEaUUsRUFBQUEsTUFBTTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLEdBRHNEO0FBUTVEMkMsRUFBQUEsVUFBVTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLEdBUmtEO0FBYTVEMUIsRUFBQUEsV0FBVztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBYmlELENBQS9DLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1JlbW90ZVNldFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJldmlld3NWaWV3IGZyb20gJy4uL3ZpZXdzL3Jldmlld3Mtdmlldyc7XG5pbXBvcnQgUHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgYWRkUmV2aWV3TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2FkZC1wci1yZXZpZXcnO1xuaW1wb3J0IGFkZFJldmlld0NvbW1lbnRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvYWRkLXByLXJldmlldy1jb21tZW50JztcbmltcG9ydCBzdWJtaXRSZXZpZXdNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvc3VibWl0LXByLXJldmlldyc7XG5pbXBvcnQgZGVsZXRlUmV2aWV3TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2RlbGV0ZS1wci1yZXZpZXcnO1xuaW1wb3J0IHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvcmVzb2x2ZS1yZXZpZXctdGhyZWFkJztcbmltcG9ydCB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvdW5yZXNvbHZlLXJldmlldy10aHJlYWQnO1xuaW1wb3J0IHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy91cGRhdGUtcHItcmV2aWV3LWNvbW1lbnQnO1xuaW1wb3J0IHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy91cGRhdGUtcHItcmV2aWV3LXN1bW1hcnknO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbi8vIE1pbGxpc2Vjb25kcyB0byB1cGRhdGUgaGlnaGxpZ2h0ZWRUaHJlYWRJRHNcbmNvbnN0IEZMQVNIX0RFTEFZID0gMTUwMDtcblxuZXhwb3J0IGNsYXNzIEJhcmVSZXZpZXdzQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzdWx0c1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHZpZXdlcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgc3VtbWFyaWVzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBQYWNrYWdlIG1vZGVsc1xuICAgIHdvcmtkaXJDb250ZXh0UG9vbDogV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBsb2NhbFJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc0Fic2VudDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNQcmVzZW50OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzTWVyZ2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc1JlYmFzaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGJyYW5jaGVzOiBCcmFuY2hTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgbXVsdGlGaWxlUGF0Y2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpbml0VGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvLyBDb25uZWN0aW9uIHByb3BlcnRpZXNcbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gVVJMIHBhcmFtZXRlcnNcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjb250ZXh0TGluZXM6IDQsXG4gICAgICBwb3N0aW5nVG9UaHJlYWRJRDogbnVsbCxcbiAgICAgIHNjcm9sbFRvVGhyZWFkSUQ6IHRoaXMucHJvcHMuaW5pdFRocmVhZElELFxuICAgICAgc3VtbWFyeVNlY3Rpb25PcGVuOiB0cnVlLFxuICAgICAgY29tbWVudFNlY3Rpb25PcGVuOiB0cnVlLFxuICAgICAgdGhyZWFkSURzT3BlbjogbmV3IFNldChcbiAgICAgICAgdGhpcy5wcm9wcy5pbml0VGhyZWFkSUQgPyBbdGhpcy5wcm9wcy5pbml0VGhyZWFkSURdIDogW10sXG4gICAgICApLFxuICAgICAgaGlnaGxpZ2h0ZWRUaHJlYWRJRHM6IG5ldyBTZXQoKSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qge3Njcm9sbFRvVGhyZWFkSUR9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoc2Nyb2xsVG9UaHJlYWRJRCkge1xuICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQoc2Nyb2xsVG9UaHJlYWRJRCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IHtpbml0VGhyZWFkSUR9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoaW5pdFRocmVhZElEICYmIGluaXRUaHJlYWRJRCAhPT0gcHJldlByb3BzLmluaXRUaHJlYWRJRCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2ID0+IHtcbiAgICAgICAgcHJldi50aHJlYWRJRHNPcGVuLmFkZChpbml0VGhyZWFkSUQpO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZChpbml0VGhyZWFkSUQpO1xuICAgICAgICByZXR1cm4ge2NvbW1lbnRTZWN0aW9uT3BlbjogdHJ1ZSwgc2Nyb2xsVG9UaHJlYWRJRDogaW5pdFRocmVhZElEfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFB1bGxSZXF1ZXN0Q2hlY2tvdXRDb250cm9sbGVyXG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgcHVsbFJlcXVlc3Q9e3RoaXMucHJvcHMucHVsbFJlcXVlc3R9XG5cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeX1cbiAgICAgICAgaXNBYnNlbnQ9e3RoaXMucHJvcHMuaXNBYnNlbnR9XG4gICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgIGlzUHJlc2VudD17dGhpcy5wcm9wcy5pc1ByZXNlbnR9XG4gICAgICAgIGlzTWVyZ2luZz17dGhpcy5wcm9wcy5pc01lcmdpbmd9XG4gICAgICAgIGlzUmViYXNpbmc9e3RoaXMucHJvcHMuaXNSZWJhc2luZ31cbiAgICAgICAgYnJhbmNoZXM9e3RoaXMucHJvcHMuYnJhbmNoZXN9XG4gICAgICAgIHJlbW90ZXM9e3RoaXMucHJvcHMucmVtb3Rlc30+XG5cbiAgICAgICAge2NoZWNrb3V0T3AgPT4gKFxuICAgICAgICAgIDxSZXZpZXdzVmlld1xuICAgICAgICAgICAgY2hlY2tvdXRPcD17Y2hlY2tvdXRPcH1cbiAgICAgICAgICAgIGNvbnRleHRMaW5lcz17dGhpcy5zdGF0ZS5jb250ZXh0TGluZXN9XG4gICAgICAgICAgICBwb3N0aW5nVG9UaHJlYWRJRD17dGhpcy5zdGF0ZS5wb3N0aW5nVG9UaHJlYWRJRH1cbiAgICAgICAgICAgIHN1bW1hcnlTZWN0aW9uT3Blbj17dGhpcy5zdGF0ZS5zdW1tYXJ5U2VjdGlvbk9wZW59XG4gICAgICAgICAgICBjb21tZW50U2VjdGlvbk9wZW49e3RoaXMuc3RhdGUuY29tbWVudFNlY3Rpb25PcGVufVxuICAgICAgICAgICAgdGhyZWFkSURzT3Blbj17dGhpcy5zdGF0ZS50aHJlYWRJRHNPcGVufVxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRUaHJlYWRJRHM9e3RoaXMuc3RhdGUuaGlnaGxpZ2h0ZWRUaHJlYWRJRHN9XG4gICAgICAgICAgICBzY3JvbGxUb1RocmVhZElEPXt0aGlzLnN0YXRlLnNjcm9sbFRvVGhyZWFkSUR9XG5cbiAgICAgICAgICAgIG1vcmVDb250ZXh0PXt0aGlzLm1vcmVDb250ZXh0fVxuICAgICAgICAgICAgbGVzc0NvbnRleHQ9e3RoaXMubGVzc0NvbnRleHR9XG4gICAgICAgICAgICBvcGVuRmlsZT17dGhpcy5vcGVuRmlsZX1cbiAgICAgICAgICAgIG9wZW5EaWZmPXt0aGlzLm9wZW5EaWZmfVxuICAgICAgICAgICAgb3BlblBSPXt0aGlzLm9wZW5QUn1cbiAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaD17dGhpcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICBzaG93U3VtbWFyaWVzPXt0aGlzLnNob3dTdW1tYXJpZXN9XG4gICAgICAgICAgICBoaWRlU3VtbWFyaWVzPXt0aGlzLmhpZGVTdW1tYXJpZXN9XG4gICAgICAgICAgICBzaG93Q29tbWVudHM9e3RoaXMuc2hvd0NvbW1lbnRzfVxuICAgICAgICAgICAgaGlkZUNvbW1lbnRzPXt0aGlzLmhpZGVDb21tZW50c31cbiAgICAgICAgICAgIHNob3dUaHJlYWRJRD17dGhpcy5zaG93VGhyZWFkSUR9XG4gICAgICAgICAgICBoaWRlVGhyZWFkSUQ9e3RoaXMuaGlkZVRocmVhZElEfVxuICAgICAgICAgICAgcmVzb2x2ZVRocmVhZD17dGhpcy5yZXNvbHZlVGhyZWFkfVxuICAgICAgICAgICAgdW5yZXNvbHZlVGhyZWFkPXt0aGlzLnVucmVzb2x2ZVRocmVhZH1cbiAgICAgICAgICAgIGFkZFNpbmdsZUNvbW1lbnQ9e3RoaXMuYWRkU2luZ2xlQ29tbWVudH1cbiAgICAgICAgICAgIHVwZGF0ZUNvbW1lbnQ9e3RoaXMudXBkYXRlQ29tbWVudH1cbiAgICAgICAgICAgIHVwZGF0ZVN1bW1hcnk9e3RoaXMudXBkYXRlU3VtbWFyeX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgIDwvUHVsbFJlcXVlc3RDaGVja291dENvbnRyb2xsZXI+XG4gICAgKTtcbiAgfVxuXG4gIG9wZW5GaWxlID0gYXN5bmMgKGZpbGVQYXRoLCBsaW5lTnVtYmVyKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgIHBhdGguam9pbih0aGlzLnByb3BzLndvcmtkaXIsIGZpbGVQYXRoKSwge1xuICAgICAgICBpbml0aWFsTGluZTogbGluZU51bWJlciAtIDEsXG4gICAgICAgIGluaXRpYWxDb2x1bW46IDAsXG4gICAgICAgIHBlbmRpbmc6IHRydWUsXG4gICAgICB9KTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLW9wZW4tZmlsZScsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICB9XG5cbiAgb3BlbkRpZmYgPSBhc3luYyAoZmlsZVBhdGgsIGxpbmVOdW1iZXIpID0+IHtcbiAgICBjb25zdCBpdGVtID0gYXdhaXQgdGhpcy5nZXRQUkRldGFpbEl0ZW0oKTtcbiAgICBpdGVtLm9wZW5GaWxlc1RhYih7XG4gICAgICBjaGFuZ2VkRmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgICAgY2hhbmdlZEZpbGVQb3NpdGlvbjogbGluZU51bWJlcixcbiAgICB9KTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLW9wZW4tZGlmZicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIG9wZW5QUiA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB0aGlzLmdldFBSRGV0YWlsSXRlbSgpO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stb3Blbi1wcicsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIGdldFBSRGV0YWlsSXRlbSA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgIElzc3VlaXNoRGV0YWlsSXRlbS5idWlsZFVSSSh7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0SG9zdCgpLFxuICAgICAgICBvd25lcjogdGhpcy5wcm9wcy5vd25lcixcbiAgICAgICAgcmVwbzogdGhpcy5wcm9wcy5yZXBvLFxuICAgICAgICBudW1iZXI6IHRoaXMucHJvcHMubnVtYmVyLFxuICAgICAgICB3b3JrZGlyOiB0aGlzLnByb3BzLndvcmtkaXIsXG4gICAgICB9KSwge1xuICAgICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIG1vcmVDb250ZXh0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldiA9PiAoe2NvbnRleHRMaW5lczogcHJldi5jb250ZXh0TGluZXMgKyAxfSkpO1xuICAgIGFkZEV2ZW50KCdyZXZpZXdzLWRvY2stc2hvdy1tb3JlLWNvbnRleHQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgfVxuXG4gIGxlc3NDb250ZXh0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldiA9PiAoe2NvbnRleHRMaW5lczogTWF0aC5tYXgocHJldi5jb250ZXh0TGluZXMgLSAxLCAxKX0pKTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLXNob3ctbGVzcy1jb250ZXh0Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gIH1cblxuICBvcGVuSXNzdWVpc2ggPSBhc3luYyAob3duZXIsIHJlcG8sIG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKTtcblxuICAgIGNvbnN0IGhvbWVSZXBvc2l0b3J5ID0gYXdhaXQgdGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnkuaGFzR2l0SHViUmVtb3RlKGhvc3QsIG93bmVyLCByZXBvKVxuICAgICAgPyB0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeVxuICAgICAgOiAoYXdhaXQgdGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2wuZ2V0TWF0Y2hpbmdDb250ZXh0KGhvc3QsIG93bmVyLCByZXBvKSkuZ2V0UmVwb3NpdG9yeSgpO1xuXG4gICAgY29uc3QgdXJpID0gSXNzdWVpc2hEZXRhaWxJdGVtLmJ1aWxkVVJJKHtcbiAgICAgIGhvc3QsIG93bmVyLCByZXBvLCBudW1iZXIsIHdvcmtkaXI6IGhvbWVSZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7cGVuZGluZzogdHJ1ZSwgc2VhcmNoQWxsUGFuZXM6IHRydWV9KTtcbiAgfVxuXG4gIHNob3dTdW1tYXJpZXMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe3N1bW1hcnlTZWN0aW9uT3BlbjogdHJ1ZX0sIHJlc29sdmUpKTtcblxuICBoaWRlU3VtbWFyaWVzID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtzdW1tYXJ5U2VjdGlvbk9wZW46IGZhbHNlfSwgcmVzb2x2ZSkpO1xuXG4gIHNob3dDb21tZW50cyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y29tbWVudFNlY3Rpb25PcGVuOiB0cnVlfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZGVDb21tZW50cyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y29tbWVudFNlY3Rpb25PcGVuOiBmYWxzZX0sIHJlc29sdmUpKTtcblxuICBzaG93VGhyZWFkSUQgPSBjb21tZW50SUQgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICBzdGF0ZS50aHJlYWRJRHNPcGVuLmFkZChjb21tZW50SUQpO1xuICAgIHJldHVybiB7fTtcbiAgfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZGVUaHJlYWRJRCA9IGNvbW1lbnRJRCA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgIHN0YXRlLnRocmVhZElEc09wZW4uZGVsZXRlKGNvbW1lbnRJRCk7XG4gICAgcmV0dXJuIHt9O1xuICB9LCByZXNvbHZlKSk7XG5cbiAgaGlnaGxpZ2h0VGhyZWFkID0gdGhyZWFkSUQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgc3RhdGUuaGlnaGxpZ2h0ZWRUaHJlYWRJRHMuYWRkKHRocmVhZElEKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LCAoKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgICBzdGF0ZS5oaWdobGlnaHRlZFRocmVhZElEcy5kZWxldGUodGhyZWFkSUQpO1xuICAgICAgICBpZiAoc3RhdGUuc2Nyb2xsVG9UaHJlYWRJRCA9PT0gdGhyZWFkSUQpIHtcbiAgICAgICAgICByZXR1cm4ge3Njcm9sbFRvVGhyZWFkSUQ6IG51bGx9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0pLCBGTEFTSF9ERUxBWSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNvbHZlVGhyZWFkID0gYXN5bmMgdGhyZWFkID0+IHtcbiAgICBpZiAodGhyZWFkLnZpZXdlckNhblJlc29sdmUpIHtcbiAgICAgIC8vIG9wdGltaXN0aWNhbGx5IGhpZGUgdGhlIHRocmVhZCB0byBhdm9pZCBqYW5raW5lc3M7XG4gICAgICAvLyBpZiB0aGUgb3BlcmF0aW9uIGZhaWxzLCB0aGUgb25FcnJvciBjYWxsYmFjayB3aWxsIHJldmVydCBpdC5cbiAgICAgIHRoaXMuaGlkZVRocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICAgIHRocmVhZElEOiB0aHJlYWQuaWQsXG4gICAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgICAgIHZpZXdlckxvZ2luOiB0aGlzLnByb3BzLnZpZXdlci5sb2dpbixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGhyZWFkKHRocmVhZC5pZCk7XG4gICAgICAgIGFkZEV2ZW50KCdyZXNvbHZlLWNvbW1lbnQtdGhyZWFkJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5zaG93VGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gcmVzb2x2ZSB0aGUgY29tbWVudCB0aHJlYWQnLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVucmVzb2x2ZVRocmVhZCA9IGFzeW5jIHRocmVhZCA9PiB7XG4gICAgaWYgKHRocmVhZC52aWV3ZXJDYW5VbnJlc29sdmUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgICB0aHJlYWRJRDogdGhyZWFkLmlkLFxuICAgICAgICAgIHZpZXdlcklEOiB0aGlzLnByb3BzLnZpZXdlci5pZCxcbiAgICAgICAgICB2aWV3ZXJMb2dpbjogdGhpcy5wcm9wcy52aWV3ZXIubG9naW4sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZCh0aHJlYWQuaWQpO1xuICAgICAgICBhZGRFdmVudCgndW5yZXNvbHZlLWNvbW1lbnQtdGhyZWFkJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gdW5yZXNvbHZlIHRoZSBjb21tZW50IHRocmVhZCcsIGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkU2luZ2xlQ29tbWVudCA9IGFzeW5jIChjb21tZW50Qm9keSwgdGhyZWFkSUQsIHJlcGx5VG9JRCwgY29tbWVudFBhdGgsIHBvc2l0aW9uLCBjYWxsYmFja3MgPSB7fSkgPT4ge1xuICAgIGxldCBwZW5kaW5nUmV2aWV3SUQgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtwb3N0aW5nVG9UaHJlYWRJRDogdGhyZWFkSUR9KTtcblxuICAgICAgY29uc3QgcmV2aWV3UmVzdWx0ID0gYXdhaXQgYWRkUmV2aWV3TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBwdWxsUmVxdWVzdElEOiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJldmlld0lEID0gcmV2aWV3UmVzdWx0LmFkZFB1bGxSZXF1ZXN0UmV2aWV3LnJldmlld0VkZ2Uubm9kZS5pZDtcbiAgICAgIHBlbmRpbmdSZXZpZXdJRCA9IHJldmlld0lEO1xuXG4gICAgICBjb25zdCBjb21tZW50UHJvbWlzZSA9IGFkZFJldmlld0NvbW1lbnRNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIGJvZHk6IGNvbW1lbnRCb2R5LFxuICAgICAgICBpblJlcGx5VG86IHJlcGx5VG9JRCxcbiAgICAgICAgcmV2aWV3SUQsXG4gICAgICAgIHRocmVhZElELFxuICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICAgIHBhdGg6IGNvbW1lbnRQYXRoLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgIH0pO1xuICAgICAgaWYgKGNhbGxiYWNrcy5kaWRTdWJtaXRDb21tZW50KSB7XG4gICAgICAgIGNhbGxiYWNrcy5kaWRTdWJtaXRDb21tZW50KCk7XG4gICAgICB9XG4gICAgICBhd2FpdCBjb21tZW50UHJvbWlzZTtcbiAgICAgIHBlbmRpbmdSZXZpZXdJRCA9IG51bGw7XG5cbiAgICAgIGF3YWl0IHN1Ym1pdFJldmlld011dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgZXZlbnQ6ICdDT01NRU5UJyxcbiAgICAgICAgcmV2aWV3SUQsXG4gICAgICB9KTtcbiAgICAgIGFkZEV2ZW50KCdhZGQtc2luZ2xlLWNvbW1lbnQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGNhbGxiYWNrcy5kaWRGYWlsQ29tbWVudCkge1xuICAgICAgICBjYWxsYmFja3MuZGlkRmFpbENvbW1lbnQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBlbmRpbmdSZXZpZXdJRCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGRlbGV0ZVJldmlld011dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgICAgIHJldmlld0lEOiBwZW5kaW5nUmV2aWV3SUQsXG4gICAgICAgICAgICBwdWxsUmVxdWVzdElEOiB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0LmlkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoZXJyb3IuZXJyb3JzICYmIGUuZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvci5lcnJvcnMucHVzaCguLi5lLmVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuYWJsZSB0byBkZWxldGUgcGVuZGluZyByZXZpZXcnLCBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gc3VibWl0IHlvdXIgY29tbWVudCcsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7cG9zdGluZ1RvVGhyZWFkSUQ6IG51bGx9KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDb21tZW50ID0gYXN5bmMgKGNvbW1lbnRJZCwgY29tbWVudEJvZHkpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBjb21tZW50SWQsXG4gICAgICAgIGNvbW1lbnRCb2R5LFxuICAgICAgfSk7XG4gICAgICBhZGRFdmVudCgndXBkYXRlLXJldmlldy1jb21tZW50Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHVwZGF0ZSBjb21tZW50JywgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlU3VtbWFyeSA9IGFzeW5jIChyZXZpZXdJZCwgcmV2aWV3Qm9keSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIHJldmlld0lkLFxuICAgICAgICByZXZpZXdCb2R5LFxuICAgICAgfSk7XG4gICAgICBhZGRFdmVudCgndXBkYXRlLXJldmlldy1zdW1tYXJ5Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHVwZGF0ZSByZXZpZXcgc3VtbWFyeScsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlUmV2aWV3c0NvbnRyb2xsZXIsIHtcbiAgdmlld2VyOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3ZpZXdlciBvbiBVc2VyIHtcbiAgICAgIGlkXG4gICAgICBsb2dpblxuICAgICAgYXZhdGFyVXJsXG4gICAgfVxuICBgLFxuICByZXBvc2l0b3J5OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gICAgICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5XG4gICAgfVxuICBgLFxuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICBpZFxuICAgICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3RcbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==