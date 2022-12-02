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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yZXZpZXdzLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRkxBU0hfREVMQVkiLCJCYXJlUmV2aWV3c0NvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJmaWxlUGF0aCIsImxpbmVOdW1iZXIiLCJ3b3Jrc3BhY2UiLCJvcGVuIiwicGF0aCIsImpvaW4iLCJ3b3JrZGlyIiwiaW5pdGlhbExpbmUiLCJpbml0aWFsQ29sdW1uIiwicGVuZGluZyIsInBhY2thZ2UiLCJpdGVtIiwiZ2V0UFJEZXRhaWxJdGVtIiwib3BlbkZpbGVzVGFiIiwiY2hhbmdlZEZpbGVQYXRoIiwiY2hhbmdlZEZpbGVQb3NpdGlvbiIsImNvbXBvbmVudCIsIm5hbWUiLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJlbmRwb2ludCIsImdldEhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJzZWFyY2hBbGxQYW5lcyIsInNldFN0YXRlIiwicHJldiIsImNvbnRleHRMaW5lcyIsIk1hdGgiLCJtYXgiLCJob21lUmVwb3NpdG9yeSIsImxvY2FsUmVwb3NpdG9yeSIsImhhc0dpdEh1YlJlbW90ZSIsIndvcmtkaXJDb250ZXh0UG9vbCIsImdldE1hdGNoaW5nQ29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJ1cmkiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiY29tbWVudFNlY3Rpb25PcGVuIiwiY29tbWVudElEIiwic3RhdGUiLCJ0aHJlYWRJRHNPcGVuIiwiYWRkIiwiZGVsZXRlIiwidGhyZWFkSUQiLCJoaWdobGlnaHRlZFRocmVhZElEcyIsInNldFRpbWVvdXQiLCJzY3JvbGxUb1RocmVhZElEIiwidGhyZWFkIiwidmlld2VyQ2FuUmVzb2x2ZSIsImhpZGVUaHJlYWRJRCIsImlkIiwicmVsYXkiLCJlbnZpcm9ubWVudCIsInZpZXdlcklEIiwidmlld2VyIiwidmlld2VyTG9naW4iLCJsb2dpbiIsImhpZ2hsaWdodFRocmVhZCIsImVyciIsInNob3dUaHJlYWRJRCIsInJlcG9ydFJlbGF5RXJyb3IiLCJ2aWV3ZXJDYW5VbnJlc29sdmUiLCJjb21tZW50Qm9keSIsInJlcGx5VG9JRCIsImNvbW1lbnRQYXRoIiwicG9zaXRpb24iLCJjYWxsYmFja3MiLCJwZW5kaW5nUmV2aWV3SUQiLCJwb3N0aW5nVG9UaHJlYWRJRCIsInJldmlld1Jlc3VsdCIsInB1bGxSZXF1ZXN0SUQiLCJwdWxsUmVxdWVzdCIsInJldmlld0lEIiwiYWRkUHVsbFJlcXVlc3RSZXZpZXciLCJyZXZpZXdFZGdlIiwibm9kZSIsImNvbW1lbnRQcm9taXNlIiwiYm9keSIsImluUmVwbHlUbyIsImRpZFN1Ym1pdENvbW1lbnQiLCJldmVudCIsImVycm9yIiwiZGlkRmFpbENvbW1lbnQiLCJlIiwiZXJyb3JzIiwicHVzaCIsImNvbnNvbGUiLCJ3YXJuIiwiY29tbWVudElkIiwicmV2aWV3SWQiLCJyZXZpZXdCb2R5IiwiaW5pdFRocmVhZElEIiwiU2V0IiwiY29tcG9uZW50RGlkTW91bnQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJyZW5kZXIiLCJyZXBvc2l0b3J5IiwiaXNBYnNlbnQiLCJpc0xvYWRpbmciLCJpc1ByZXNlbnQiLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiYnJhbmNoZXMiLCJyZW1vdGVzIiwiY2hlY2tvdXRPcCIsIm1vcmVDb250ZXh0IiwibGVzc0NvbnRleHQiLCJvcGVuRmlsZSIsIm9wZW5EaWZmIiwib3BlblBSIiwib3Blbklzc3VlaXNoIiwic2hvd1N1bW1hcmllcyIsImhpZGVTdW1tYXJpZXMiLCJzaG93Q29tbWVudHMiLCJoaWRlQ29tbWVudHMiLCJyZXNvbHZlVGhyZWFkIiwidW5yZXNvbHZlVGhyZWFkIiwiYWRkU2luZ2xlQ29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJ1cGRhdGVTdW1tYXJ5IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwic3VtbWFyaWVzIiwiYXJyYXkiLCJjb21tZW50VGhyZWFkcyIsImFycmF5T2YiLCJjb21tZW50cyIsInJlZmV0Y2giLCJmdW5jIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJib29sIiwiQnJhbmNoU2V0UHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsIm11bHRpRmlsZVBhdGNoIiwiRW5kcG9pbnRQcm9wVHlwZSIsImNvbmZpZyIsImNvbW1hbmRzIiwidG9vbHRpcHMiLCJjb25maXJtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7QUFDQSxNQUFNQSxXQUFXLEdBQUcsSUFBcEI7O0FBRU8sTUFBTUMscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBcUR6REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsc0NBcUZSLE9BQU9DLFFBQVAsRUFBaUJDLFVBQWpCLEtBQWdDO0FBQ3pDLFlBQU0sS0FBS0YsS0FBTCxDQUFXRyxTQUFYLENBQXFCQyxJQUFyQixDQUNKQyxjQUFLQyxJQUFMLENBQVUsS0FBS04sS0FBTCxDQUFXTyxPQUFyQixFQUE4Qk4sUUFBOUIsQ0FESSxFQUNxQztBQUN2Q08sUUFBQUEsV0FBVyxFQUFFTixVQUFVLEdBQUcsQ0FEYTtBQUV2Q08sUUFBQUEsYUFBYSxFQUFFLENBRndCO0FBR3ZDQyxRQUFBQSxPQUFPLEVBQUU7QUFIOEIsT0FEckMsQ0FBTjtBQU1BLG1DQUFTLHdCQUFULEVBQW1DO0FBQUNDLFFBQUFBLE9BQU8sRUFBRTtBQUFWLE9BQW5DO0FBQ0QsS0E3RmtCOztBQUFBLHNDQStGUixPQUFPVixRQUFQLEVBQWlCQyxVQUFqQixLQUFnQztBQUN6QyxZQUFNVSxJQUFJLEdBQUcsTUFBTSxLQUFLQyxlQUFMLEVBQW5CO0FBQ0FELE1BQUFBLElBQUksQ0FBQ0UsWUFBTCxDQUFrQjtBQUNoQkMsUUFBQUEsZUFBZSxFQUFFZCxRQUREO0FBRWhCZSxRQUFBQSxtQkFBbUIsRUFBRWQ7QUFGTCxPQUFsQjtBQUlBLG1DQUFTLHdCQUFULEVBQW1DO0FBQUNTLFFBQUFBLE9BQU8sRUFBRSxRQUFWO0FBQW9CTSxRQUFBQSxTQUFTLEVBQUUsS0FBS2xCLFdBQUwsQ0FBaUJtQjtBQUFoRCxPQUFuQztBQUNELEtBdEdrQjs7QUFBQSxvQ0F3R1YsWUFBWTtBQUNuQixZQUFNLEtBQUtMLGVBQUwsRUFBTjtBQUNBLG1DQUFTLHNCQUFULEVBQWlDO0FBQUNGLFFBQUFBLE9BQU8sRUFBRSxRQUFWO0FBQW9CTSxRQUFBQSxTQUFTLEVBQUUsS0FBS2xCLFdBQUwsQ0FBaUJtQjtBQUFoRCxPQUFqQztBQUNELEtBM0drQjs7QUFBQSw2Q0E2R0QsTUFBTTtBQUN0QixhQUFPLEtBQUtsQixLQUFMLENBQVdHLFNBQVgsQ0FBcUJDLElBQXJCLENBQ0xlLDRCQUFtQkMsUUFBbkIsQ0FBNEI7QUFDMUJDLFFBQUFBLElBQUksRUFBRSxLQUFLckIsS0FBTCxDQUFXc0IsUUFBWCxDQUFvQkMsT0FBcEIsRUFEb0I7QUFFMUJDLFFBQUFBLEtBQUssRUFBRSxLQUFLeEIsS0FBTCxDQUFXd0IsS0FGUTtBQUcxQkMsUUFBQUEsSUFBSSxFQUFFLEtBQUt6QixLQUFMLENBQVd5QixJQUhTO0FBSTFCQyxRQUFBQSxNQUFNLEVBQUUsS0FBSzFCLEtBQUwsQ0FBVzBCLE1BSk87QUFLMUJuQixRQUFBQSxPQUFPLEVBQUUsS0FBS1AsS0FBTCxDQUFXTztBQUxNLE9BQTVCLENBREssRUFPRDtBQUNGRyxRQUFBQSxPQUFPLEVBQUUsSUFEUDtBQUVGaUIsUUFBQUEsY0FBYyxFQUFFO0FBRmQsT0FQQyxDQUFQO0FBWUQsS0ExSGtCOztBQUFBLHlDQTRITCxNQUFNO0FBQ2xCLFdBQUtDLFFBQUwsQ0FBY0MsSUFBSSxLQUFLO0FBQUNDLFFBQUFBLFlBQVksRUFBRUQsSUFBSSxDQUFDQyxZQUFMLEdBQW9CO0FBQW5DLE9BQUwsQ0FBbEI7QUFDQSxtQ0FBUyxnQ0FBVCxFQUEyQztBQUFDbkIsUUFBQUEsT0FBTyxFQUFFO0FBQVYsT0FBM0M7QUFDRCxLQS9Ia0I7O0FBQUEseUNBaUlMLE1BQU07QUFDbEIsV0FBS2lCLFFBQUwsQ0FBY0MsSUFBSSxLQUFLO0FBQUNDLFFBQUFBLFlBQVksRUFBRUMsSUFBSSxDQUFDQyxHQUFMLENBQVNILElBQUksQ0FBQ0MsWUFBTCxHQUFvQixDQUE3QixFQUFnQyxDQUFoQztBQUFmLE9BQUwsQ0FBbEI7QUFDQSxtQ0FBUyxnQ0FBVCxFQUEyQztBQUFDbkIsUUFBQUEsT0FBTyxFQUFFO0FBQVYsT0FBM0M7QUFDRCxLQXBJa0I7O0FBQUEsMENBc0lKLE9BQU9hLEtBQVAsRUFBY0MsSUFBZCxFQUFvQkMsTUFBcEIsS0FBK0I7QUFDNUMsWUFBTUwsSUFBSSxHQUFHLEtBQUtyQixLQUFMLENBQVdzQixRQUFYLENBQW9CQyxPQUFwQixFQUFiO0FBRUEsWUFBTVUsY0FBYyxHQUFHLE9BQU0sS0FBS2pDLEtBQUwsQ0FBV2tDLGVBQVgsQ0FBMkJDLGVBQTNCLENBQTJDZCxJQUEzQyxFQUFpREcsS0FBakQsRUFBd0RDLElBQXhELENBQU4sSUFDbkIsS0FBS3pCLEtBQUwsQ0FBV2tDLGVBRFEsR0FFbkIsQ0FBQyxNQUFNLEtBQUtsQyxLQUFMLENBQVdvQyxrQkFBWCxDQUE4QkMsa0JBQTlCLENBQWlEaEIsSUFBakQsRUFBdURHLEtBQXZELEVBQThEQyxJQUE5RCxDQUFQLEVBQTRFYSxhQUE1RSxFQUZKOztBQUlBLFlBQU1DLEdBQUcsR0FBR3BCLDRCQUFtQkMsUUFBbkIsQ0FBNEI7QUFDdENDLFFBQUFBLElBRHNDO0FBQ2hDRyxRQUFBQSxLQURnQztBQUN6QkMsUUFBQUEsSUFEeUI7QUFDbkJDLFFBQUFBLE1BRG1CO0FBQ1huQixRQUFBQSxPQUFPLEVBQUUwQixjQUFjLENBQUNPLHVCQUFmO0FBREUsT0FBNUIsQ0FBWjs7QUFHQSxhQUFPLEtBQUt4QyxLQUFMLENBQVdHLFNBQVgsQ0FBcUJDLElBQXJCLENBQTBCbUMsR0FBMUIsRUFBK0I7QUFBQzdCLFFBQUFBLE9BQU8sRUFBRSxJQUFWO0FBQWdCaUIsUUFBQUEsY0FBYyxFQUFFO0FBQWhDLE9BQS9CLENBQVA7QUFDRCxLQWpKa0I7O0FBQUEsMkNBbUpILE1BQU0sSUFBSWMsT0FBSixDQUFZQyxPQUFPLElBQUksS0FBS2QsUUFBTCxDQUFjO0FBQUNlLE1BQUFBLGtCQUFrQixFQUFFO0FBQXJCLEtBQWQsRUFBMENELE9BQTFDLENBQXZCLENBbkpIOztBQUFBLDJDQXFKSCxNQUFNLElBQUlELE9BQUosQ0FBWUMsT0FBTyxJQUFJLEtBQUtkLFFBQUwsQ0FBYztBQUFDZSxNQUFBQSxrQkFBa0IsRUFBRTtBQUFyQixLQUFkLEVBQTJDRCxPQUEzQyxDQUF2QixDQXJKSDs7QUFBQSwwQ0F1SkosTUFBTSxJQUFJRCxPQUFKLENBQVlDLE9BQU8sSUFBSSxLQUFLZCxRQUFMLENBQWM7QUFBQ2dCLE1BQUFBLGtCQUFrQixFQUFFO0FBQXJCLEtBQWQsRUFBMENGLE9BQTFDLENBQXZCLENBdkpGOztBQUFBLDBDQXlKSixNQUFNLElBQUlELE9BQUosQ0FBWUMsT0FBTyxJQUFJLEtBQUtkLFFBQUwsQ0FBYztBQUFDZ0IsTUFBQUEsa0JBQWtCLEVBQUU7QUFBckIsS0FBZCxFQUEyQ0YsT0FBM0MsQ0FBdkIsQ0F6SkY7O0FBQUEsMENBMkpKRyxTQUFTLElBQUksSUFBSUosT0FBSixDQUFZQyxPQUFPLElBQUksS0FBS2QsUUFBTCxDQUFja0IsS0FBSyxJQUFJO0FBQ3hFQSxNQUFBQSxLQUFLLENBQUNDLGFBQU4sQ0FBb0JDLEdBQXBCLENBQXdCSCxTQUF4QjtBQUNBLGFBQU8sRUFBUDtBQUNELEtBSGtELEVBR2hESCxPQUhnRCxDQUF2QixDQTNKVDs7QUFBQSwwQ0FnS0pHLFNBQVMsSUFBSSxJQUFJSixPQUFKLENBQVlDLE9BQU8sSUFBSSxLQUFLZCxRQUFMLENBQWNrQixLQUFLLElBQUk7QUFDeEVBLE1BQUFBLEtBQUssQ0FBQ0MsYUFBTixDQUFvQkUsTUFBcEIsQ0FBMkJKLFNBQTNCO0FBQ0EsYUFBTyxFQUFQO0FBQ0QsS0FIa0QsRUFHaERILE9BSGdELENBQXZCLENBaEtUOztBQUFBLDZDQXFLRFEsUUFBUSxJQUFJO0FBQzVCLFdBQUt0QixRQUFMLENBQWNrQixLQUFLLElBQUk7QUFDckJBLFFBQUFBLEtBQUssQ0FBQ0ssb0JBQU4sQ0FBMkJILEdBQTNCLENBQStCRSxRQUEvQjtBQUNBLGVBQU8sRUFBUDtBQUNELE9BSEQsRUFHRyxNQUFNO0FBQ1BFLFFBQUFBLFVBQVUsQ0FBQyxNQUFNLEtBQUt4QixRQUFMLENBQWNrQixLQUFLLElBQUk7QUFDdENBLFVBQUFBLEtBQUssQ0FBQ0ssb0JBQU4sQ0FBMkJGLE1BQTNCLENBQWtDQyxRQUFsQzs7QUFDQSxjQUFJSixLQUFLLENBQUNPLGdCQUFOLEtBQTJCSCxRQUEvQixFQUF5QztBQUN2QyxtQkFBTztBQUFDRyxjQUFBQSxnQkFBZ0IsRUFBRTtBQUFuQixhQUFQO0FBQ0Q7O0FBQ0QsaUJBQU8sRUFBUDtBQUNELFNBTmdCLENBQVAsRUFNTjFELFdBTk0sQ0FBVjtBQU9ELE9BWEQ7QUFZRCxLQWxMa0I7O0FBQUEsMkNBb0xILE1BQU0yRCxNQUFOLElBQWdCO0FBQzlCLFVBQUlBLE1BQU0sQ0FBQ0MsZ0JBQVgsRUFBNkI7QUFDM0I7QUFDQTtBQUNBLGFBQUtDLFlBQUwsQ0FBa0JGLE1BQU0sQ0FBQ0csRUFBekI7O0FBQ0EsWUFBSTtBQUNGLGdCQUFNLGtDQUE0QixLQUFLekQsS0FBTCxDQUFXMEQsS0FBWCxDQUFpQkMsV0FBN0MsRUFBMEQ7QUFDOURULFlBQUFBLFFBQVEsRUFBRUksTUFBTSxDQUFDRyxFQUQ2QztBQUU5REcsWUFBQUEsUUFBUSxFQUFFLEtBQUs1RCxLQUFMLENBQVc2RCxNQUFYLENBQWtCSixFQUZrQztBQUc5REssWUFBQUEsV0FBVyxFQUFFLEtBQUs5RCxLQUFMLENBQVc2RCxNQUFYLENBQWtCRTtBQUgrQixXQUExRCxDQUFOO0FBS0EsZUFBS0MsZUFBTCxDQUFxQlYsTUFBTSxDQUFDRyxFQUE1QjtBQUNBLHVDQUFTLHdCQUFULEVBQW1DO0FBQUM5QyxZQUFBQSxPQUFPLEVBQUU7QUFBVixXQUFuQztBQUNELFNBUkQsQ0FRRSxPQUFPc0QsR0FBUCxFQUFZO0FBQ1osZUFBS0MsWUFBTCxDQUFrQlosTUFBTSxDQUFDRyxFQUF6QjtBQUNBLGVBQUt6RCxLQUFMLENBQVdtRSxnQkFBWCxDQUE0QixzQ0FBNUIsRUFBb0VGLEdBQXBFO0FBQ0Q7QUFDRjtBQUNGLEtBdE1rQjs7QUFBQSw2Q0F3TUQsTUFBTVgsTUFBTixJQUFnQjtBQUNoQyxVQUFJQSxNQUFNLENBQUNjLGtCQUFYLEVBQStCO0FBQzdCLFlBQUk7QUFDRixnQkFBTSxvQ0FBOEIsS0FBS3BFLEtBQUwsQ0FBVzBELEtBQVgsQ0FBaUJDLFdBQS9DLEVBQTREO0FBQ2hFVCxZQUFBQSxRQUFRLEVBQUVJLE1BQU0sQ0FBQ0csRUFEK0M7QUFFaEVHLFlBQUFBLFFBQVEsRUFBRSxLQUFLNUQsS0FBTCxDQUFXNkQsTUFBWCxDQUFrQkosRUFGb0M7QUFHaEVLLFlBQUFBLFdBQVcsRUFBRSxLQUFLOUQsS0FBTCxDQUFXNkQsTUFBWCxDQUFrQkU7QUFIaUMsV0FBNUQsQ0FBTjtBQUtBLGVBQUtDLGVBQUwsQ0FBcUJWLE1BQU0sQ0FBQ0csRUFBNUI7QUFDQSx1Q0FBUywwQkFBVCxFQUFxQztBQUFDOUMsWUFBQUEsT0FBTyxFQUFFO0FBQVYsV0FBckM7QUFDRCxTQVJELENBUUUsT0FBT3NELEdBQVAsRUFBWTtBQUNaLGVBQUtqRSxLQUFMLENBQVdtRSxnQkFBWCxDQUE0Qix3Q0FBNUIsRUFBc0VGLEdBQXRFO0FBQ0Q7QUFDRjtBQUNGLEtBdE5rQjs7QUFBQSw4Q0F3TkEsT0FBT0ksV0FBUCxFQUFvQm5CLFFBQXBCLEVBQThCb0IsU0FBOUIsRUFBeUNDLFdBQXpDLEVBQXNEQyxRQUF0RCxFQUFnRUMsU0FBUyxHQUFHLEVBQTVFLEtBQW1GO0FBQ3BHLFVBQUlDLGVBQWUsR0FBRyxJQUF0Qjs7QUFDQSxVQUFJO0FBQ0YsYUFBSzlDLFFBQUwsQ0FBYztBQUFDK0MsVUFBQUEsaUJBQWlCLEVBQUV6QjtBQUFwQixTQUFkO0FBRUEsY0FBTTBCLFlBQVksR0FBRyxNQUFNLDBCQUFrQixLQUFLNUUsS0FBTCxDQUFXMEQsS0FBWCxDQUFpQkMsV0FBbkMsRUFBZ0Q7QUFDekVrQixVQUFBQSxhQUFhLEVBQUUsS0FBSzdFLEtBQUwsQ0FBVzhFLFdBQVgsQ0FBdUJyQixFQURtQztBQUV6RUcsVUFBQUEsUUFBUSxFQUFFLEtBQUs1RCxLQUFMLENBQVc2RCxNQUFYLENBQWtCSjtBQUY2QyxTQUFoRCxDQUEzQjtBQUlBLGNBQU1zQixRQUFRLEdBQUdILFlBQVksQ0FBQ0ksb0JBQWIsQ0FBa0NDLFVBQWxDLENBQTZDQyxJQUE3QyxDQUFrRHpCLEVBQW5FO0FBQ0FpQixRQUFBQSxlQUFlLEdBQUdLLFFBQWxCO0FBRUEsY0FBTUksY0FBYyxHQUFHLGlDQUF5QixLQUFLbkYsS0FBTCxDQUFXMEQsS0FBWCxDQUFpQkMsV0FBMUMsRUFBdUQ7QUFDNUV5QixVQUFBQSxJQUFJLEVBQUVmLFdBRHNFO0FBRTVFZ0IsVUFBQUEsU0FBUyxFQUFFZixTQUZpRTtBQUc1RVMsVUFBQUEsUUFINEU7QUFJNUU3QixVQUFBQSxRQUo0RTtBQUs1RVUsVUFBQUEsUUFBUSxFQUFFLEtBQUs1RCxLQUFMLENBQVc2RCxNQUFYLENBQWtCSixFQUxnRDtBQU01RXBELFVBQUFBLElBQUksRUFBRWtFLFdBTnNFO0FBTzVFQyxVQUFBQTtBQVA0RSxTQUF2RCxDQUF2Qjs7QUFTQSxZQUFJQyxTQUFTLENBQUNhLGdCQUFkLEVBQWdDO0FBQzlCYixVQUFBQSxTQUFTLENBQUNhLGdCQUFWO0FBQ0Q7O0FBQ0QsY0FBTUgsY0FBTjtBQUNBVCxRQUFBQSxlQUFlLEdBQUcsSUFBbEI7QUFFQSxjQUFNLDZCQUFxQixLQUFLMUUsS0FBTCxDQUFXMEQsS0FBWCxDQUFpQkMsV0FBdEMsRUFBbUQ7QUFDdkQ0QixVQUFBQSxLQUFLLEVBQUUsU0FEZ0Q7QUFFdkRSLFVBQUFBO0FBRnVELFNBQW5ELENBQU47QUFJQSxxQ0FBUyxvQkFBVCxFQUErQjtBQUFDcEUsVUFBQUEsT0FBTyxFQUFFO0FBQVYsU0FBL0I7QUFDRCxPQTlCRCxDQThCRSxPQUFPNkUsS0FBUCxFQUFjO0FBQ2QsWUFBSWYsU0FBUyxDQUFDZ0IsY0FBZCxFQUE4QjtBQUM1QmhCLFVBQUFBLFNBQVMsQ0FBQ2dCLGNBQVY7QUFDRDs7QUFFRCxZQUFJZixlQUFlLEtBQUssSUFBeEIsRUFBOEI7QUFDNUIsY0FBSTtBQUNGLGtCQUFNLDZCQUFxQixLQUFLMUUsS0FBTCxDQUFXMEQsS0FBWCxDQUFpQkMsV0FBdEMsRUFBbUQ7QUFDdkRvQixjQUFBQSxRQUFRLEVBQUVMLGVBRDZDO0FBRXZERyxjQUFBQSxhQUFhLEVBQUUsS0FBSzdFLEtBQUwsQ0FBVzhFLFdBQVgsQ0FBdUJyQjtBQUZpQixhQUFuRCxDQUFOO0FBSUQsV0FMRCxDQUtFLE9BQU9pQyxDQUFQLEVBQVU7QUFDVjtBQUNBLGdCQUFJRixLQUFLLENBQUNHLE1BQU4sSUFBZ0JELENBQUMsQ0FBQ0MsTUFBdEIsRUFBOEI7QUFDNUJILGNBQUFBLEtBQUssQ0FBQ0csTUFBTixDQUFhQyxJQUFiLENBQWtCLEdBQUdGLENBQUMsQ0FBQ0MsTUFBdkI7QUFDRCxhQUZELE1BRU87QUFDTDtBQUNBRSxjQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxpQ0FBYixFQUFnREosQ0FBaEQ7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBSzFGLEtBQUwsQ0FBV21FLGdCQUFYLENBQTRCLCtCQUE1QixFQUE2RHFCLEtBQTdEO0FBQ0QsT0FyREQsU0FxRFU7QUFDUixhQUFLNUQsUUFBTCxDQUFjO0FBQUMrQyxVQUFBQSxpQkFBaUIsRUFBRTtBQUFwQixTQUFkO0FBQ0Q7QUFDRixLQWxSa0I7O0FBQUEsMkNBb1JILE9BQU9vQixTQUFQLEVBQWtCMUIsV0FBbEIsS0FBa0M7QUFDaEQsVUFBSTtBQUNGLGNBQU0sb0NBQThCLEtBQUtyRSxLQUFMLENBQVcwRCxLQUFYLENBQWlCQyxXQUEvQyxFQUE0RDtBQUNoRW9DLFVBQUFBLFNBRGdFO0FBRWhFMUIsVUFBQUE7QUFGZ0UsU0FBNUQsQ0FBTjtBQUlBLHFDQUFTLHVCQUFULEVBQWtDO0FBQUMxRCxVQUFBQSxPQUFPLEVBQUU7QUFBVixTQUFsQztBQUNELE9BTkQsQ0FNRSxPQUFPNkUsS0FBUCxFQUFjO0FBQ2QsYUFBS3hGLEtBQUwsQ0FBV21FLGdCQUFYLENBQTRCLDBCQUE1QixFQUF3RHFCLEtBQXhEO0FBQ0EsY0FBTUEsS0FBTjtBQUNEO0FBQ0YsS0EvUmtCOztBQUFBLDJDQWlTSCxPQUFPUSxRQUFQLEVBQWlCQyxVQUFqQixLQUFnQztBQUM5QyxVQUFJO0FBQ0YsY0FBTSxvQ0FBOEIsS0FBS2pHLEtBQUwsQ0FBVzBELEtBQVgsQ0FBaUJDLFdBQS9DLEVBQTREO0FBQ2hFcUMsVUFBQUEsUUFEZ0U7QUFFaEVDLFVBQUFBO0FBRmdFLFNBQTVELENBQU47QUFJQSxxQ0FBUyx1QkFBVCxFQUFrQztBQUFDdEYsVUFBQUEsT0FBTyxFQUFFO0FBQVYsU0FBbEM7QUFDRCxPQU5ELENBTUUsT0FBTzZFLEtBQVAsRUFBYztBQUNkLGFBQUt4RixLQUFMLENBQVdtRSxnQkFBWCxDQUE0QixpQ0FBNUIsRUFBK0RxQixLQUEvRDtBQUNBLGNBQU1BLEtBQU47QUFDRDtBQUNGLEtBNVNrQjs7QUFHakIsU0FBSzFDLEtBQUwsR0FBYTtBQUNYaEIsTUFBQUEsWUFBWSxFQUFFLENBREg7QUFFWDZDLE1BQUFBLGlCQUFpQixFQUFFLElBRlI7QUFHWHRCLE1BQUFBLGdCQUFnQixFQUFFLEtBQUtyRCxLQUFMLENBQVdrRyxZQUhsQjtBQUlYdkQsTUFBQUEsa0JBQWtCLEVBQUUsSUFKVDtBQUtYQyxNQUFBQSxrQkFBa0IsRUFBRSxJQUxUO0FBTVhHLE1BQUFBLGFBQWEsRUFBRSxJQUFJb0QsR0FBSixDQUNiLEtBQUtuRyxLQUFMLENBQVdrRyxZQUFYLEdBQTBCLENBQUMsS0FBS2xHLEtBQUwsQ0FBV2tHLFlBQVosQ0FBMUIsR0FBc0QsRUFEekMsQ0FOSjtBQVNYL0MsTUFBQUEsb0JBQW9CLEVBQUUsSUFBSWdELEdBQUo7QUFUWCxLQUFiO0FBV0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCLFVBQU07QUFBQy9DLE1BQUFBO0FBQUQsUUFBcUIsS0FBS1AsS0FBaEM7O0FBQ0EsUUFBSU8sZ0JBQUosRUFBc0I7QUFDcEIsV0FBS1csZUFBTCxDQUFxQlgsZ0JBQXJCO0FBQ0Q7QUFDRjs7QUFFRGdELEVBQUFBLGtCQUFrQixDQUFDQyxTQUFELEVBQVk7QUFDNUIsVUFBTTtBQUFDSixNQUFBQTtBQUFELFFBQWlCLEtBQUtsRyxLQUE1Qjs7QUFDQSxRQUFJa0csWUFBWSxJQUFJQSxZQUFZLEtBQUtJLFNBQVMsQ0FBQ0osWUFBL0MsRUFBNkQ7QUFDM0QsV0FBS3RFLFFBQUwsQ0FBY0MsSUFBSSxJQUFJO0FBQ3BCQSxRQUFBQSxJQUFJLENBQUNrQixhQUFMLENBQW1CQyxHQUFuQixDQUF1QmtELFlBQXZCO0FBQ0EsYUFBS2xDLGVBQUwsQ0FBcUJrQyxZQUFyQjtBQUNBLGVBQU87QUFBQ3RELFVBQUFBLGtCQUFrQixFQUFFLElBQXJCO0FBQTJCUyxVQUFBQSxnQkFBZ0IsRUFBRTZDO0FBQTdDLFNBQVA7QUFDRCxPQUpEO0FBS0Q7QUFDRjs7QUFFREssRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FDRSw2QkFBQyw2QkFBRDtBQUNFLE1BQUEsVUFBVSxFQUFFLEtBQUt2RyxLQUFMLENBQVd3RyxVQUR6QjtBQUVFLE1BQUEsV0FBVyxFQUFFLEtBQUt4RyxLQUFMLENBQVc4RSxXQUYxQjtBQUlFLE1BQUEsZUFBZSxFQUFFLEtBQUs5RSxLQUFMLENBQVdrQyxlQUo5QjtBQUtFLE1BQUEsUUFBUSxFQUFFLEtBQUtsQyxLQUFMLENBQVd5RyxRQUx2QjtBQU1FLE1BQUEsU0FBUyxFQUFFLEtBQUt6RyxLQUFMLENBQVcwRyxTQU54QjtBQU9FLE1BQUEsU0FBUyxFQUFFLEtBQUsxRyxLQUFMLENBQVcyRyxTQVB4QjtBQVFFLE1BQUEsU0FBUyxFQUFFLEtBQUszRyxLQUFMLENBQVc0RyxTQVJ4QjtBQVNFLE1BQUEsVUFBVSxFQUFFLEtBQUs1RyxLQUFMLENBQVc2RyxVQVR6QjtBQVVFLE1BQUEsUUFBUSxFQUFFLEtBQUs3RyxLQUFMLENBQVc4RyxRQVZ2QjtBQVdFLE1BQUEsT0FBTyxFQUFFLEtBQUs5RyxLQUFMLENBQVcrRztBQVh0QixPQWFHQyxVQUFVLElBQ1QsNkJBQUMsb0JBQUQ7QUFDRSxNQUFBLFVBQVUsRUFBRUEsVUFEZDtBQUVFLE1BQUEsWUFBWSxFQUFFLEtBQUtsRSxLQUFMLENBQVdoQixZQUYzQjtBQUdFLE1BQUEsaUJBQWlCLEVBQUUsS0FBS2dCLEtBQUwsQ0FBVzZCLGlCQUhoQztBQUlFLE1BQUEsa0JBQWtCLEVBQUUsS0FBSzdCLEtBQUwsQ0FBV0gsa0JBSmpDO0FBS0UsTUFBQSxrQkFBa0IsRUFBRSxLQUFLRyxLQUFMLENBQVdGLGtCQUxqQztBQU1FLE1BQUEsYUFBYSxFQUFFLEtBQUtFLEtBQUwsQ0FBV0MsYUFONUI7QUFPRSxNQUFBLG9CQUFvQixFQUFFLEtBQUtELEtBQUwsQ0FBV0ssb0JBUG5DO0FBUUUsTUFBQSxnQkFBZ0IsRUFBRSxLQUFLTCxLQUFMLENBQVdPLGdCQVIvQjtBQVVFLE1BQUEsV0FBVyxFQUFFLEtBQUs0RCxXQVZwQjtBQVdFLE1BQUEsV0FBVyxFQUFFLEtBQUtDLFdBWHBCO0FBWUUsTUFBQSxRQUFRLEVBQUUsS0FBS0MsUUFaakI7QUFhRSxNQUFBLFFBQVEsRUFBRSxLQUFLQyxRQWJqQjtBQWNFLE1BQUEsTUFBTSxFQUFFLEtBQUtDLE1BZGY7QUFlRSxNQUFBLFlBQVksRUFBRSxLQUFLQyxZQWZyQjtBQWdCRSxNQUFBLGFBQWEsRUFBRSxLQUFLQyxhQWhCdEI7QUFpQkUsTUFBQSxhQUFhLEVBQUUsS0FBS0MsYUFqQnRCO0FBa0JFLE1BQUEsWUFBWSxFQUFFLEtBQUtDLFlBbEJyQjtBQW1CRSxNQUFBLFlBQVksRUFBRSxLQUFLQyxZQW5CckI7QUFvQkUsTUFBQSxZQUFZLEVBQUUsS0FBS3hELFlBcEJyQjtBQXFCRSxNQUFBLFlBQVksRUFBRSxLQUFLVixZQXJCckI7QUFzQkUsTUFBQSxhQUFhLEVBQUUsS0FBS21FLGFBdEJ0QjtBQXVCRSxNQUFBLGVBQWUsRUFBRSxLQUFLQyxlQXZCeEI7QUF3QkUsTUFBQSxnQkFBZ0IsRUFBRSxLQUFLQyxnQkF4QnpCO0FBeUJFLE1BQUEsYUFBYSxFQUFFLEtBQUtDLGFBekJ0QjtBQTBCRSxNQUFBLGFBQWEsRUFBRSxLQUFLQztBQTFCdEIsT0EyQk0sS0FBSy9ILEtBM0JYLEVBZEosQ0FERjtBQWdERDs7QUF4SXdEOzs7O2dCQUE5Q0oscUIsZUFDUTtBQUNqQjtBQUNBOEQsRUFBQUEsS0FBSyxFQUFFc0UsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDckJ0RSxJQUFBQSxXQUFXLEVBQUVxRSxtQkFBVUUsTUFBVixDQUFpQkM7QUFEVCxHQUFoQixFQUVKQSxVQUpjO0FBS2pCdEUsRUFBQUEsTUFBTSxFQUFFbUUsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDdEJ4RSxJQUFBQSxFQUFFLEVBQUV1RSxtQkFBVUksTUFBVixDQUFpQkQ7QUFEQyxHQUFoQixFQUVMQSxVQVBjO0FBUWpCM0IsRUFBQUEsVUFBVSxFQUFFd0IsbUJBQVVFLE1BQVYsQ0FBaUJDLFVBUlo7QUFTakJyRCxFQUFBQSxXQUFXLEVBQUVrRCxtQkFBVUMsS0FBVixDQUFnQjtBQUMzQnhFLElBQUFBLEVBQUUsRUFBRXVFLG1CQUFVSSxNQUFWLENBQWlCRDtBQURNLEdBQWhCLEVBRVZBLFVBWGM7QUFZakJFLEVBQUFBLFNBQVMsRUFBRUwsbUJBQVVNLEtBQVYsQ0FBZ0JILFVBWlY7QUFhakJJLEVBQUFBLGNBQWMsRUFBRVAsbUJBQVVRLE9BQVYsQ0FBa0JSLG1CQUFVQyxLQUFWLENBQWdCO0FBQ2hEM0UsSUFBQUEsTUFBTSxFQUFFMEUsbUJBQVVFLE1BQVYsQ0FBaUJDLFVBRHVCO0FBRWhETSxJQUFBQSxRQUFRLEVBQUVULG1CQUFVUSxPQUFWLENBQWtCUixtQkFBVUUsTUFBNUIsRUFBb0NDO0FBRkUsR0FBaEIsQ0FBbEIsQ0FiQztBQWlCakJPLEVBQUFBLE9BQU8sRUFBRVYsbUJBQVVXLElBQVYsQ0FBZVIsVUFqQlA7QUFtQmpCO0FBQ0EvRixFQUFBQSxrQkFBa0IsRUFBRXdHLHVDQUEyQlQsVUFwQjlCO0FBcUJqQmpHLEVBQUFBLGVBQWUsRUFBRThGLG1CQUFVRSxNQUFWLENBQWlCQyxVQXJCakI7QUFzQmpCMUIsRUFBQUEsUUFBUSxFQUFFdUIsbUJBQVVhLElBQVYsQ0FBZVYsVUF0QlI7QUF1QmpCekIsRUFBQUEsU0FBUyxFQUFFc0IsbUJBQVVhLElBQVYsQ0FBZVYsVUF2QlQ7QUF3QmpCeEIsRUFBQUEsU0FBUyxFQUFFcUIsbUJBQVVhLElBQVYsQ0FBZVYsVUF4QlQ7QUF5QmpCdkIsRUFBQUEsU0FBUyxFQUFFb0IsbUJBQVVhLElBQVYsQ0FBZVYsVUF6QlQ7QUEwQmpCdEIsRUFBQUEsVUFBVSxFQUFFbUIsbUJBQVVhLElBQVYsQ0FBZVYsVUExQlY7QUEyQmpCckIsRUFBQUEsUUFBUSxFQUFFZ0MsOEJBQWtCWCxVQTNCWDtBQTRCakJwQixFQUFBQSxPQUFPLEVBQUVnQyw4QkFBa0JaLFVBNUJWO0FBNkJqQmEsRUFBQUEsY0FBYyxFQUFFaEIsbUJBQVVFLE1BQVYsQ0FBaUJDLFVBN0JoQjtBQThCakJqQyxFQUFBQSxZQUFZLEVBQUU4QixtQkFBVUksTUE5QlA7QUFnQ2pCO0FBQ0E5RyxFQUFBQSxRQUFRLEVBQUUySCw2QkFBaUJkLFVBakNWO0FBbUNqQjtBQUNBM0csRUFBQUEsS0FBSyxFQUFFd0csbUJBQVVJLE1BQVYsQ0FBaUJELFVBcENQO0FBcUNqQjFHLEVBQUFBLElBQUksRUFBRXVHLG1CQUFVSSxNQUFWLENBQWlCRCxVQXJDTjtBQXNDakJ6RyxFQUFBQSxNQUFNLEVBQUVzRyxtQkFBVXRHLE1BQVYsQ0FBaUJ5RyxVQXRDUjtBQXVDakI1SCxFQUFBQSxPQUFPLEVBQUV5SCxtQkFBVUksTUFBVixDQUFpQkQsVUF2Q1Q7QUF5Q2pCO0FBQ0FoSSxFQUFBQSxTQUFTLEVBQUU2SCxtQkFBVUUsTUFBVixDQUFpQkMsVUExQ1g7QUEyQ2pCZSxFQUFBQSxNQUFNLEVBQUVsQixtQkFBVUUsTUFBVixDQUFpQkMsVUEzQ1I7QUE0Q2pCZ0IsRUFBQUEsUUFBUSxFQUFFbkIsbUJBQVVFLE1BQVYsQ0FBaUJDLFVBNUNWO0FBNkNqQmlCLEVBQUFBLFFBQVEsRUFBRXBCLG1CQUFVRSxNQUFWLENBQWlCQyxVQTdDVjtBQThDakJrQixFQUFBQSxPQUFPLEVBQUVyQixtQkFBVVcsSUFBVixDQUFlUixVQTlDUDtBQWdEakI7QUFDQWhFLEVBQUFBLGdCQUFnQixFQUFFNkQsbUJBQVVXLElBQVYsQ0FBZVI7QUFqRGhCLEM7O2VBbVdOLHlDQUF3QnZJLHFCQUF4QixFQUErQztBQUM1RGlFLEVBQUFBLE1BQU07QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxHQURzRDtBQVE1RDJDLEVBQUFBLFVBQVU7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxHQVJrRDtBQWE1RDFCLEVBQUFBLFdBQVc7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQWJpRCxDQUEvQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IHtSZW1vdGVTZXRQcm9wVHlwZSwgQnJhbmNoU2V0UHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGUsIFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBSZXZpZXdzVmlldyBmcm9tICcuLi92aWV3cy9yZXZpZXdzLXZpZXcnO1xuaW1wb3J0IFB1bGxSZXF1ZXN0Q2hlY2tvdXRDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuaW1wb3J0IGFkZFJldmlld011dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9hZGQtcHItcmV2aWV3JztcbmltcG9ydCBhZGRSZXZpZXdDb21tZW50TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2FkZC1wci1yZXZpZXctY29tbWVudCc7XG5pbXBvcnQgc3VibWl0UmV2aWV3TXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3N1Ym1pdC1wci1yZXZpZXcnO1xuaW1wb3J0IGRlbGV0ZVJldmlld011dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9kZWxldGUtcHItcmV2aWV3JztcbmltcG9ydCByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3Jlc29sdmUtcmV2aWV3LXRocmVhZCc7XG5pbXBvcnQgdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3VucmVzb2x2ZS1yZXZpZXctdGhyZWFkJztcbmltcG9ydCB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvdXBkYXRlLXByLXJldmlldy1jb21tZW50JztcbmltcG9ydCB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvdXBkYXRlLXByLXJldmlldy1zdW1tYXJ5JztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG4vLyBNaWxsaXNlY29uZHMgdG8gdXBkYXRlIGhpZ2hsaWdodGVkVGhyZWFkSURzXG5jb25zdCBGTEFTSF9ERUxBWSA9IDE1MDA7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUmV2aWV3c0NvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3VsdHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGVudmlyb25tZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICB2aWV3ZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHN1bW1hcmllczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgY29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKSxcbiAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUGFja2FnZSBtb2RlbHNcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNBYnNlbnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGlzUHJlc2VudDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc01lcmdpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaXNSZWJhc2luZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBicmFuY2hlczogQnJhbmNoU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZW1vdGVzOiBSZW1vdGVTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIG11bHRpRmlsZVBhdGNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaW5pdFRocmVhZElEOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gQ29ubmVjdGlvbiBwcm9wZXJ0aWVzXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFVSTCBwYXJhbWV0ZXJzXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29udGV4dExpbmVzOiA0LFxuICAgICAgcG9zdGluZ1RvVGhyZWFkSUQ6IG51bGwsXG4gICAgICBzY3JvbGxUb1RocmVhZElEOiB0aGlzLnByb3BzLmluaXRUaHJlYWRJRCxcbiAgICAgIHN1bW1hcnlTZWN0aW9uT3BlbjogdHJ1ZSxcbiAgICAgIGNvbW1lbnRTZWN0aW9uT3BlbjogdHJ1ZSxcbiAgICAgIHRocmVhZElEc09wZW46IG5ldyBTZXQoXG4gICAgICAgIHRoaXMucHJvcHMuaW5pdFRocmVhZElEID8gW3RoaXMucHJvcHMuaW5pdFRocmVhZElEXSA6IFtdLFxuICAgICAgKSxcbiAgICAgIGhpZ2hsaWdodGVkVGhyZWFkSURzOiBuZXcgU2V0KCksXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHtzY3JvbGxUb1RocmVhZElEfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHNjcm9sbFRvVGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0VGhyZWFkKHNjcm9sbFRvVGhyZWFkSUQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCB7aW5pdFRocmVhZElEfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGluaXRUaHJlYWRJRCAmJiBpbml0VGhyZWFkSUQgIT09IHByZXZQcm9wcy5pbml0VGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldiA9PiB7XG4gICAgICAgIHByZXYudGhyZWFkSURzT3Blbi5hZGQoaW5pdFRocmVhZElEKTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQoaW5pdFRocmVhZElEKTtcbiAgICAgICAgcmV0dXJuIHtjb21tZW50U2VjdGlvbk9wZW46IHRydWUsIHNjcm9sbFRvVGhyZWFkSUQ6IGluaXRUaHJlYWRJRH07XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxQdWxsUmVxdWVzdENoZWNrb3V0Q29udHJvbGxlclxuICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIHB1bGxSZXF1ZXN0PXt0aGlzLnByb3BzLnB1bGxSZXF1ZXN0fVxuXG4gICAgICAgIGxvY2FsUmVwb3NpdG9yeT17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9XG4gICAgICAgIGlzQWJzZW50PXt0aGlzLnByb3BzLmlzQWJzZW50fVxuICAgICAgICBpc0xvYWRpbmc9e3RoaXMucHJvcHMuaXNMb2FkaW5nfVxuICAgICAgICBpc1ByZXNlbnQ9e3RoaXMucHJvcHMuaXNQcmVzZW50fVxuICAgICAgICBpc01lcmdpbmc9e3RoaXMucHJvcHMuaXNNZXJnaW5nfVxuICAgICAgICBpc1JlYmFzaW5nPXt0aGlzLnByb3BzLmlzUmViYXNpbmd9XG4gICAgICAgIGJyYW5jaGVzPXt0aGlzLnByb3BzLmJyYW5jaGVzfVxuICAgICAgICByZW1vdGVzPXt0aGlzLnByb3BzLnJlbW90ZXN9PlxuXG4gICAgICAgIHtjaGVja291dE9wID0+IChcbiAgICAgICAgICA8UmV2aWV3c1ZpZXdcbiAgICAgICAgICAgIGNoZWNrb3V0T3A9e2NoZWNrb3V0T3B9XG4gICAgICAgICAgICBjb250ZXh0TGluZXM9e3RoaXMuc3RhdGUuY29udGV4dExpbmVzfVxuICAgICAgICAgICAgcG9zdGluZ1RvVGhyZWFkSUQ9e3RoaXMuc3RhdGUucG9zdGluZ1RvVGhyZWFkSUR9XG4gICAgICAgICAgICBzdW1tYXJ5U2VjdGlvbk9wZW49e3RoaXMuc3RhdGUuc3VtbWFyeVNlY3Rpb25PcGVufVxuICAgICAgICAgICAgY29tbWVudFNlY3Rpb25PcGVuPXt0aGlzLnN0YXRlLmNvbW1lbnRTZWN0aW9uT3Blbn1cbiAgICAgICAgICAgIHRocmVhZElEc09wZW49e3RoaXMuc3RhdGUudGhyZWFkSURzT3Blbn1cbiAgICAgICAgICAgIGhpZ2hsaWdodGVkVGhyZWFkSURzPXt0aGlzLnN0YXRlLmhpZ2hsaWdodGVkVGhyZWFkSURzfVxuICAgICAgICAgICAgc2Nyb2xsVG9UaHJlYWRJRD17dGhpcy5zdGF0ZS5zY3JvbGxUb1RocmVhZElEfVxuXG4gICAgICAgICAgICBtb3JlQ29udGV4dD17dGhpcy5tb3JlQ29udGV4dH1cbiAgICAgICAgICAgIGxlc3NDb250ZXh0PXt0aGlzLmxlc3NDb250ZXh0fVxuICAgICAgICAgICAgb3BlbkZpbGU9e3RoaXMub3BlbkZpbGV9XG4gICAgICAgICAgICBvcGVuRGlmZj17dGhpcy5vcGVuRGlmZn1cbiAgICAgICAgICAgIG9wZW5QUj17dGhpcy5vcGVuUFJ9XG4gICAgICAgICAgICBvcGVuSXNzdWVpc2g9e3RoaXMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgc2hvd1N1bW1hcmllcz17dGhpcy5zaG93U3VtbWFyaWVzfVxuICAgICAgICAgICAgaGlkZVN1bW1hcmllcz17dGhpcy5oaWRlU3VtbWFyaWVzfVxuICAgICAgICAgICAgc2hvd0NvbW1lbnRzPXt0aGlzLnNob3dDb21tZW50c31cbiAgICAgICAgICAgIGhpZGVDb21tZW50cz17dGhpcy5oaWRlQ29tbWVudHN9XG4gICAgICAgICAgICBzaG93VGhyZWFkSUQ9e3RoaXMuc2hvd1RocmVhZElEfVxuICAgICAgICAgICAgaGlkZVRocmVhZElEPXt0aGlzLmhpZGVUaHJlYWRJRH1cbiAgICAgICAgICAgIHJlc29sdmVUaHJlYWQ9e3RoaXMucmVzb2x2ZVRocmVhZH1cbiAgICAgICAgICAgIHVucmVzb2x2ZVRocmVhZD17dGhpcy51bnJlc29sdmVUaHJlYWR9XG4gICAgICAgICAgICBhZGRTaW5nbGVDb21tZW50PXt0aGlzLmFkZFNpbmdsZUNvbW1lbnR9XG4gICAgICAgICAgICB1cGRhdGVDb21tZW50PXt0aGlzLnVwZGF0ZUNvbW1lbnR9XG4gICAgICAgICAgICB1cGRhdGVTdW1tYXJ5PXt0aGlzLnVwZGF0ZVN1bW1hcnl9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICA8L1B1bGxSZXF1ZXN0Q2hlY2tvdXRDb250cm9sbGVyPlxuICAgICk7XG4gIH1cblxuICBvcGVuRmlsZSA9IGFzeW5jIChmaWxlUGF0aCwgbGluZU51bWJlcikgPT4ge1xuICAgIGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JrZGlyLCBmaWxlUGF0aCksIHtcbiAgICAgICAgaW5pdGlhbExpbmU6IGxpbmVOdW1iZXIgLSAxLFxuICAgICAgICBpbml0aWFsQ29sdW1uOiAwLFxuICAgICAgICBwZW5kaW5nOiB0cnVlLFxuICAgICAgfSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1vcGVuLWZpbGUnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgfVxuXG4gIG9wZW5EaWZmID0gYXN5bmMgKGZpbGVQYXRoLCBsaW5lTnVtYmVyKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IHRoaXMuZ2V0UFJEZXRhaWxJdGVtKCk7XG4gICAgaXRlbS5vcGVuRmlsZXNUYWIoe1xuICAgICAgY2hhbmdlZEZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGNoYW5nZWRGaWxlUG9zaXRpb246IGxpbmVOdW1iZXIsXG4gICAgfSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1vcGVuLWRpZmYnLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICBvcGVuUFIgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdGhpcy5nZXRQUkRldGFpbEl0ZW0oKTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLW9wZW4tcHInLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICBnZXRQUkRldGFpbEl0ZW0gPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICBJc3N1ZWlzaERldGFpbEl0ZW0uYnVpbGRVUkkoe1xuICAgICAgICBob3N0OiB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKSxcbiAgICAgICAgb3duZXI6IHRoaXMucHJvcHMub3duZXIsXG4gICAgICAgIHJlcG86IHRoaXMucHJvcHMucmVwbyxcbiAgICAgICAgbnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgICAgd29ya2RpcjogdGhpcy5wcm9wcy53b3JrZGlyLFxuICAgICAgfSksIHtcbiAgICAgICAgcGVuZGluZzogdHJ1ZSxcbiAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBtb3JlQ29udGV4dCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHByZXYgPT4gKHtjb250ZXh0TGluZXM6IHByZXYuY29udGV4dExpbmVzICsgMX0pKTtcbiAgICBhZGRFdmVudCgncmV2aWV3cy1kb2NrLXNob3ctbW9yZS1jb250ZXh0Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gIH1cblxuICBsZXNzQ29udGV4dCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHByZXYgPT4gKHtjb250ZXh0TGluZXM6IE1hdGgubWF4KHByZXYuY29udGV4dExpbmVzIC0gMSwgMSl9KSk7XG4gICAgYWRkRXZlbnQoJ3Jldmlld3MtZG9jay1zaG93LWxlc3MtY29udGV4dCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICB9XG5cbiAgb3Blbklzc3VlaXNoID0gYXN5bmMgKG93bmVyLCByZXBvLCBudW1iZXIpID0+IHtcbiAgICBjb25zdCBob3N0ID0gdGhpcy5wcm9wcy5lbmRwb2ludC5nZXRIb3N0KCk7XG5cbiAgICBjb25zdCBob21lUmVwb3NpdG9yeSA9IGF3YWl0IHRoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5Lmhhc0dpdEh1YlJlbW90ZShob3N0LCBvd25lciwgcmVwbylcbiAgICAgID8gdGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnlcbiAgICAgIDogKGF3YWl0IHRoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sLmdldE1hdGNoaW5nQ29udGV4dChob3N0LCBvd25lciwgcmVwbykpLmdldFJlcG9zaXRvcnkoKTtcblxuICAgIGNvbnN0IHVyaSA9IElzc3VlaXNoRGV0YWlsSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0LCBvd25lciwgcmVwbywgbnVtYmVyLCB3b3JrZGlyOiBob21lUmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKHVyaSwge3BlbmRpbmc6IHRydWUsIHNlYXJjaEFsbFBhbmVzOiB0cnVlfSk7XG4gIH1cblxuICBzaG93U3VtbWFyaWVzID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtzdW1tYXJ5U2VjdGlvbk9wZW46IHRydWV9LCByZXNvbHZlKSk7XG5cbiAgaGlkZVN1bW1hcmllcyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7c3VtbWFyeVNlY3Rpb25PcGVuOiBmYWxzZX0sIHJlc29sdmUpKTtcblxuICBzaG93Q29tbWVudHMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2NvbW1lbnRTZWN0aW9uT3BlbjogdHJ1ZX0sIHJlc29sdmUpKTtcblxuICBoaWRlQ29tbWVudHMgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2NvbW1lbnRTZWN0aW9uT3BlbjogZmFsc2V9LCByZXNvbHZlKSk7XG5cbiAgc2hvd1RocmVhZElEID0gY29tbWVudElEID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgc3RhdGUudGhyZWFkSURzT3Blbi5hZGQoY29tbWVudElEKTtcbiAgICByZXR1cm4ge307XG4gIH0sIHJlc29sdmUpKTtcblxuICBoaWRlVGhyZWFkSUQgPSBjb21tZW50SUQgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICBzdGF0ZS50aHJlYWRJRHNPcGVuLmRlbGV0ZShjb21tZW50SUQpO1xuICAgIHJldHVybiB7fTtcbiAgfSwgcmVzb2x2ZSkpO1xuXG4gIGhpZ2hsaWdodFRocmVhZCA9IHRocmVhZElEID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICAgIHN0YXRlLmhpZ2hsaWdodGVkVGhyZWFkSURzLmFkZCh0aHJlYWRJRCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSwgKCkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuaGlnaGxpZ2h0ZWRUaHJlYWRJRHMuZGVsZXRlKHRocmVhZElEKTtcbiAgICAgICAgaWYgKHN0YXRlLnNjcm9sbFRvVGhyZWFkSUQgPT09IHRocmVhZElEKSB7XG4gICAgICAgICAgcmV0dXJuIHtzY3JvbGxUb1RocmVhZElEOiBudWxsfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge307XG4gICAgICB9KSwgRkxBU0hfREVMQVkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzb2x2ZVRocmVhZCA9IGFzeW5jIHRocmVhZCA9PiB7XG4gICAgaWYgKHRocmVhZC52aWV3ZXJDYW5SZXNvbHZlKSB7XG4gICAgICAvLyBvcHRpbWlzdGljYWxseSBoaWRlIHRoZSB0aHJlYWQgdG8gYXZvaWQgamFua2luZXNzO1xuICAgICAgLy8gaWYgdGhlIG9wZXJhdGlvbiBmYWlscywgdGhlIG9uRXJyb3IgY2FsbGJhY2sgd2lsbCByZXZlcnQgaXQuXG4gICAgICB0aGlzLmhpZGVUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgICB0aHJlYWRJRDogdGhyZWFkLmlkLFxuICAgICAgICAgIHZpZXdlcklEOiB0aGlzLnByb3BzLnZpZXdlci5pZCxcbiAgICAgICAgICB2aWV3ZXJMb2dpbjogdGhpcy5wcm9wcy52aWV3ZXIubG9naW4sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFRocmVhZCh0aHJlYWQuaWQpO1xuICAgICAgICBhZGRFdmVudCgncmVzb2x2ZS1jb21tZW50LXRocmVhZCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuc2hvd1RocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHJlc29sdmUgdGhlIGNvbW1lbnQgdGhyZWFkJywgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnJlc29sdmVUaHJlYWQgPSBhc3luYyB0aHJlYWQgPT4ge1xuICAgIGlmICh0aHJlYWQudmlld2VyQ2FuVW5yZXNvbHZlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgICAgdGhyZWFkSUQ6IHRocmVhZC5pZCxcbiAgICAgICAgICB2aWV3ZXJJRDogdGhpcy5wcm9wcy52aWV3ZXIuaWQsXG4gICAgICAgICAgdmlld2VyTG9naW46IHRoaXMucHJvcHMudmlld2VyLmxvZ2luLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUaHJlYWQodGhyZWFkLmlkKTtcbiAgICAgICAgYWRkRXZlbnQoJ3VucmVzb2x2ZS1jb21tZW50LXRocmVhZCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHVucmVzb2x2ZSB0aGUgY29tbWVudCB0aHJlYWQnLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFNpbmdsZUNvbW1lbnQgPSBhc3luYyAoY29tbWVudEJvZHksIHRocmVhZElELCByZXBseVRvSUQsIGNvbW1lbnRQYXRoLCBwb3NpdGlvbiwgY2FsbGJhY2tzID0ge30pID0+IHtcbiAgICBsZXQgcGVuZGluZ1Jldmlld0lEID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7cG9zdGluZ1RvVGhyZWFkSUQ6IHRocmVhZElEfSk7XG5cbiAgICAgIGNvbnN0IHJldmlld1Jlc3VsdCA9IGF3YWl0IGFkZFJldmlld011dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgcHVsbFJlcXVlc3RJRDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXZpZXdJRCA9IHJldmlld1Jlc3VsdC5hZGRQdWxsUmVxdWVzdFJldmlldy5yZXZpZXdFZGdlLm5vZGUuaWQ7XG4gICAgICBwZW5kaW5nUmV2aWV3SUQgPSByZXZpZXdJRDtcblxuICAgICAgY29uc3QgY29tbWVudFByb21pc2UgPSBhZGRSZXZpZXdDb21tZW50TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICBib2R5OiBjb21tZW50Qm9keSxcbiAgICAgICAgaW5SZXBseVRvOiByZXBseVRvSUQsXG4gICAgICAgIHJldmlld0lELFxuICAgICAgICB0aHJlYWRJRCxcbiAgICAgICAgdmlld2VySUQ6IHRoaXMucHJvcHMudmlld2VyLmlkLFxuICAgICAgICBwYXRoOiBjb21tZW50UGF0aCxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICB9KTtcbiAgICAgIGlmIChjYWxsYmFja3MuZGlkU3VibWl0Q29tbWVudCkge1xuICAgICAgICBjYWxsYmFja3MuZGlkU3VibWl0Q29tbWVudCgpO1xuICAgICAgfVxuICAgICAgYXdhaXQgY29tbWVudFByb21pc2U7XG4gICAgICBwZW5kaW5nUmV2aWV3SUQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBzdWJtaXRSZXZpZXdNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgIGV2ZW50OiAnQ09NTUVOVCcsXG4gICAgICAgIHJldmlld0lELFxuICAgICAgfSk7XG4gICAgICBhZGRFdmVudCgnYWRkLXNpbmdsZS1jb21tZW50Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsYmFja3MuZGlkRmFpbENvbW1lbnQpIHtcbiAgICAgICAgY2FsbGJhY2tzLmRpZEZhaWxDb21tZW50KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZW5kaW5nUmV2aWV3SUQgIT09IG51bGwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBkZWxldGVSZXZpZXdNdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB7XG4gICAgICAgICAgICByZXZpZXdJRDogcGVuZGluZ1Jldmlld0lELFxuICAgICAgICAgICAgcHVsbFJlcXVlc3RJRDogdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5pZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGVycm9yLmVycm9ycyAmJiBlLmVycm9ycykge1xuICAgICAgICAgICAgZXJyb3IuZXJyb3JzLnB1c2goLi4uZS5lcnJvcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdVbmFibGUgdG8gZGVsZXRlIHBlbmRpbmcgcmV2aWV3JywgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHN1Ym1pdCB5b3VyIGNvbW1lbnQnLCBlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Bvc3RpbmdUb1RocmVhZElEOiBudWxsfSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ29tbWVudCA9IGFzeW5jIChjb21tZW50SWQsIGNvbW1lbnRCb2R5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHtcbiAgICAgICAgY29tbWVudElkLFxuICAgICAgICBjb21tZW50Qm9keSxcbiAgICAgIH0pO1xuICAgICAgYWRkRXZlbnQoJ3VwZGF0ZS1yZXZpZXctY29tbWVudCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byB1cGRhdGUgY29tbWVudCcsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVN1bW1hcnkgPSBhc3luYyAocmV2aWV3SWQsIHJldmlld0JvZHkpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwge1xuICAgICAgICByZXZpZXdJZCxcbiAgICAgICAgcmV2aWV3Qm9keSxcbiAgICAgIH0pO1xuICAgICAgYWRkRXZlbnQoJ3VwZGF0ZS1yZXZpZXctc3VtbWFyeScsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byB1cGRhdGUgcmV2aWV3IHN1bW1hcnknLCBlcnJvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZVJldmlld3NDb250cm9sbGVyLCB7XG4gIHZpZXdlcjogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIgb24gVXNlciB7XG4gICAgICBpZFxuICAgICAgbG9naW5cbiAgICAgIGF2YXRhclVybFxuICAgIH1cbiAgYCxcbiAgcmVwb3NpdG9yeTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xuICAgICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeVxuICAgIH1cbiAgYCxcbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3Qge1xuICAgICAgaWRcbiAgICAgIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3B1bGxSZXF1ZXN0XG4gICAgfVxuICBgLFxufSk7XG4iXX0=