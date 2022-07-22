"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommentDecorationsController = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _reactRelay = require("react-relay");

var _path = _interopRequireDefault(require("path"));

var _editorCommentDecorationsController = _interopRequireDefault(require("./editor-comment-decorations-controller"));

var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));

var _gutter = _interopRequireDefault(require("../atom/gutter"));

var _commands = _interopRequireWildcard(require("../atom/commands"));

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCommentDecorationsController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "updateOpenEditors", () => {
      return new Promise(resolve => {
        this.setState({
          openEditors: this.props.workspace.getTextEditors()
        }, resolve);
      });
    });

    _defineProperty(this, "openReviewsTab", () => {
      const [pullRequest] = this.props.pullRequests;
      /* istanbul ignore if */

      if (!pullRequest) {
        return null;
      }

      const uri = _reviewsItem.default.buildURI({
        host: this.props.endpoint.getHost(),
        owner: this.props.owner,
        repo: this.props.repo,
        number: pullRequest.number,
        workdir: this.props.repoData.workingDirectoryPath
      });

      return this.props.workspace.open(uri, {
        searchAllPanes: true
      });
    });

    this.subscriptions = new _eventKit.CompositeDisposable();
    this.state = {
      openEditors: this.props.workspace.getTextEditors()
    };
  }

  componentDidMount() {
    this.subscriptions.add(this.props.workspace.observeTextEditors(this.updateOpenEditors), this.props.workspace.onDidDestroyPaneItem(this.updateOpenEditors));
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  render() {
    if (this.props.pullRequests.length === 0) {
      return null;
    }

    const pullRequest = this.props.pullRequests[0]; // only show comment decorations if we're on a checked out pull request
    // otherwise, we'd have no way of knowing which comments to show.

    if (!this.isCheckedOutPullRequest(this.props.repoData.branches, this.props.repoData.remotes, pullRequest)) {
      return null;
    }

    const threadDataByPath = new Map();
    const workdirPath = this.props.repoData.workingDirectoryPath;

    for (const {
      comments,
      thread
    } of this.props.commentThreads) {
      // Skip comment threads that are entirely minimized.
      if (comments.every(comment => comment.isMinimized)) {
        continue;
      } // There may be multiple comments in the thread, but we really only care about the root comment when rendering
      // decorations.


      const threadData = {
        rootCommentID: comments[0].id,
        threadID: thread.id,
        position: comments[0].position,
        nativeRelPath: (0, _helpers.toNativePathSep)(comments[0].path),
        fullPath: _path.default.join(workdirPath, (0, _helpers.toNativePathSep)(comments[0].path))
      };

      if (threadDataByPath.get(threadData.fullPath)) {
        threadDataByPath.get(threadData.fullPath).push(threadData);
      } else {
        threadDataByPath.set(threadData.fullPath, [threadData]);
      }
    }

    const openEditorsWithCommentThreads = this.getOpenEditorsWithCommentThreads(threadDataByPath);
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:open-reviews-tab",
      callback: this.openReviewsTab
    })), openEditorsWithCommentThreads.map(editor => {
      const threadData = threadDataByPath.get(editor.getPath());
      const translations = this.props.commentTranslations.get(threadData[0].nativeRelPath);
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
        key: `github-editor-decoration-${editor.id}`
      }, /*#__PURE__*/_react.default.createElement(_gutter.default, {
        name: "github-comment-icon",
        priority: 1,
        className: "comment",
        editor: editor,
        type: "decorated"
      }), /*#__PURE__*/_react.default.createElement(_editorCommentDecorationsController.default, {
        endpoint: this.props.endpoint,
        owner: this.props.owner,
        repo: this.props.repo,
        number: pullRequest.number,
        workdir: workdirPath,
        workspace: this.props.workspace,
        editor: editor,
        fileName: editor.getPath(),
        headSha: pullRequest.headRefOid,
        threadsForPath: threadData,
        commentTranslationsForPath: translations
      }));
    }));
  }

  getOpenEditorsWithCommentThreads(threadDataByPath) {
    const haveThreads = [];

    for (const editor of this.state.openEditors) {
      if (threadDataByPath.has(editor.getPath())) {
        haveThreads.push(editor);
      }
    }

    return haveThreads;
  } // Determine if we already have this PR checked out.
  // todo: if this is similar enough to pr-checkout-controller, extract a single
  // helper function to do this check.


  isCheckedOutPullRequest(branches, remotes, pullRequest) {
    // determine if pullRequest.headRepository is null
    // this can happen if a repository has been deleted.
    if (!pullRequest.headRepository) {
      return false;
    }

    const {
      repository
    } = pullRequest;
    const headPush = branches.getHeadBranch().getPush();
    const headRemote = remotes.withName(headPush.getRemoteName()); // (detect checkout from pull/### refspec)

    const fromPullRefspec = headRemote.getOwner() === repository.owner.login && headRemote.getRepo() === repository.name && headPush.getShortRemoteRef() === `pull/${pullRequest.number}/head`; // (detect checkout from head repository)

    const fromHeadRepo = headRemote.getOwner() === pullRequest.headRepository.owner.login && headRemote.getRepo() === pullRequest.headRepository.name && headPush.getShortRemoteRef() === pullRequest.headRefName;

    if (fromPullRefspec || fromHeadRepo) {
      return true;
    }

    return false;
  }

}

exports.BareCommentDecorationsController = BareCommentDecorationsController;

_defineProperty(BareCommentDecorationsController, "propTypes", {
  // Relay response
  relay: _propTypes.default.object.isRequired,
  pullRequests: _propTypes.default.arrayOf(_propTypes.default.shape({
    number: _propTypes.default.number.isRequired,
    headRefName: _propTypes.default.string.isRequired,
    headRefOid: _propTypes.default.string.isRequired,
    headRepository: _propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      owner: _propTypes.default.shape({
        login: _propTypes.default.string.isRequired
      }).isRequired
    }),
    repository: _propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      owner: _propTypes.default.shape({
        login: _propTypes.default.string.isRequired
      }).isRequired
    }).isRequired
  })),
  // Connection information
  endpoint: _propTypes2.EndpointPropType.isRequired,
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  // Models
  repoData: _propTypes.default.shape({
    branches: _propTypes2.BranchSetPropType.isRequired,
    remotes: _propTypes2.RemoteSetPropType.isRequired,
    currentRemote: _propTypes2.RemotePropType.isRequired,
    workingDirectoryPath: _propTypes.default.string.isRequired
  }).isRequired,
  commentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
    thread: _propTypes.default.shape({
      id: _propTypes.default.string.isRequired
    }).isRequired
  })).isRequired,
  commentTranslations: _propTypes.default.shape({
    get: _propTypes.default.func.isRequired
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCommentDecorationsController, {
  pullRequests: function () {
    const node = require("./__generated__/commentDecorationsController_pullRequests.graphql");

    if (node.hash && node.hash !== "62f96ccd13dfc2649112a7b4afaf4ba2") {
      console.error("The definition of 'commentDecorationsController_pullRequests' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/commentDecorationsController_pullRequests.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jb21tZW50LWRlY29yYXRpb25zLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQmFyZUNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRTdGF0ZSIsIm9wZW5FZGl0b3JzIiwid29ya3NwYWNlIiwiZ2V0VGV4dEVkaXRvcnMiLCJwdWxsUmVxdWVzdCIsInB1bGxSZXF1ZXN0cyIsInVyaSIsIlJldmlld3NJdGVtIiwiYnVpbGRVUkkiLCJob3N0IiwiZW5kcG9pbnQiLCJnZXRIb3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwid29ya2RpciIsInJlcG9EYXRhIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJvcGVuIiwic2VhcmNoQWxsUGFuZXMiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsInN0YXRlIiwiY29tcG9uZW50RGlkTW91bnQiLCJhZGQiLCJvYnNlcnZlVGV4dEVkaXRvcnMiLCJ1cGRhdGVPcGVuRWRpdG9ycyIsIm9uRGlkRGVzdHJveVBhbmVJdGVtIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwicmVuZGVyIiwibGVuZ3RoIiwiaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QiLCJicmFuY2hlcyIsInJlbW90ZXMiLCJ0aHJlYWREYXRhQnlQYXRoIiwiTWFwIiwid29ya2RpclBhdGgiLCJjb21tZW50cyIsInRocmVhZCIsImNvbW1lbnRUaHJlYWRzIiwiZXZlcnkiLCJjb21tZW50IiwiaXNNaW5pbWl6ZWQiLCJ0aHJlYWREYXRhIiwicm9vdENvbW1lbnRJRCIsImlkIiwidGhyZWFkSUQiLCJwb3NpdGlvbiIsIm5hdGl2ZVJlbFBhdGgiLCJwYXRoIiwiZnVsbFBhdGgiLCJqb2luIiwiZ2V0IiwicHVzaCIsInNldCIsIm9wZW5FZGl0b3JzV2l0aENvbW1lbnRUaHJlYWRzIiwiZ2V0T3BlbkVkaXRvcnNXaXRoQ29tbWVudFRocmVhZHMiLCJjb21tYW5kcyIsIm9wZW5SZXZpZXdzVGFiIiwibWFwIiwiZWRpdG9yIiwiZ2V0UGF0aCIsInRyYW5zbGF0aW9ucyIsImNvbW1lbnRUcmFuc2xhdGlvbnMiLCJoZWFkUmVmT2lkIiwiaGF2ZVRocmVhZHMiLCJoYXMiLCJoZWFkUmVwb3NpdG9yeSIsInJlcG9zaXRvcnkiLCJoZWFkUHVzaCIsImdldEhlYWRCcmFuY2giLCJnZXRQdXNoIiwiaGVhZFJlbW90ZSIsIndpdGhOYW1lIiwiZ2V0UmVtb3RlTmFtZSIsImZyb21QdWxsUmVmc3BlYyIsImdldE93bmVyIiwibG9naW4iLCJnZXRSZXBvIiwibmFtZSIsImdldFNob3J0UmVtb3RlUmVmIiwiZnJvbUhlYWRSZXBvIiwiaGVhZFJlZk5hbWUiLCJyZWxheSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwic2hhcGUiLCJzdHJpbmciLCJFbmRwb2ludFByb3BUeXBlIiwiQnJhbmNoU2V0UHJvcFR5cGUiLCJSZW1vdGVTZXRQcm9wVHlwZSIsImN1cnJlbnRSZW1vdGUiLCJSZW1vdGVQcm9wVHlwZSIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLE1BQU1BLGdDQUFOLFNBQStDQyxlQUFNQyxTQUFyRCxDQUErRDtBQWlEcEVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQWlCO0FBQzFCLFVBQU1ELEtBQU4sRUFBYUMsT0FBYjs7QUFEMEIsK0NBK0lSLE1BQU07QUFDeEIsYUFBTyxJQUFJQyxPQUFKLENBQVlDLE9BQU8sSUFBSTtBQUM1QixhQUFLQyxRQUFMLENBQWM7QUFBQ0MsVUFBQUEsV0FBVyxFQUFFLEtBQUtMLEtBQUwsQ0FBV00sU0FBWCxDQUFxQkMs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b3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgRWRpdG9yQ29tbWVudERlY29yYXRpb25zQ29udHJvbGxlciBmcm9tICcuL2VkaXRvci1jb21tZW50LWRlY29yYXRpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IFJldmlld3NJdGVtIGZyb20gJy4uL2l0ZW1zL3Jldmlld3MtaXRlbSc7XG5pbXBvcnQgR3V0dGVyIGZyb20gJy4uL2F0b20vZ3V0dGVyJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IHtFbmRwb2ludFByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZSwgUmVtb3RlU2V0UHJvcFR5cGUsIFJlbW90ZVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7dG9OYXRpdmVQYXRoU2VwfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVDb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSByZXNwb25zZVxuICAgIHJlbGF5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3RzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWFkUmVmTmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGVhZFJlZk9pZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGVhZFJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgb3duZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICB9KSksXG5cbiAgICAvLyBDb25uZWN0aW9uIGluZm9ybWF0aW9uXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTW9kZWxzXG4gICAgcmVwb0RhdGE6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBicmFuY2hlczogQnJhbmNoU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgICBjdXJyZW50UmVtb3RlOiBSZW1vdGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUcmFuc2xhdGlvbnM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBnZXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtvcGVuRWRpdG9yczogdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKX07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKHRoaXMudXBkYXRlT3BlbkVkaXRvcnMpLFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0odGhpcy51cGRhdGVPcGVuRWRpdG9ycyksXG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucHVsbFJlcXVlc3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHB1bGxSZXF1ZXN0ID0gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdHNbMF07XG5cbiAgICAvLyBvbmx5IHNob3cgY29tbWVudCBkZWNvcmF0aW9ucyBpZiB3ZSdyZSBvbiBhIGNoZWNrZWQgb3V0IHB1bGwgcmVxdWVzdFxuICAgIC8vIG90aGVyd2lzZSwgd2UnZCBoYXZlIG5vIHdheSBvZiBrbm93aW5nIHdoaWNoIGNvbW1lbnRzIHRvIHNob3cuXG4gICAgaWYgKFxuICAgICAgIXRoaXMuaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QoXG4gICAgICAgIHRoaXMucHJvcHMucmVwb0RhdGEuYnJhbmNoZXMsXG4gICAgICAgIHRoaXMucHJvcHMucmVwb0RhdGEucmVtb3RlcyxcbiAgICAgICAgcHVsbFJlcXVlc3QsXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB0aHJlYWREYXRhQnlQYXRoID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHdvcmtkaXJQYXRoID0gdGhpcy5wcm9wcy5yZXBvRGF0YS53b3JraW5nRGlyZWN0b3J5UGF0aDtcblxuICAgIGZvciAoY29uc3Qge2NvbW1lbnRzLCB0aHJlYWR9IG9mIHRoaXMucHJvcHMuY29tbWVudFRocmVhZHMpIHtcbiAgICAgIC8vIFNraXAgY29tbWVudCB0aHJlYWRzIHRoYXQgYXJlIGVudGlyZWx5IG1pbmltaXplZC5cbiAgICAgIGlmIChjb21tZW50cy5ldmVyeShjb21tZW50ID0+IGNvbW1lbnQuaXNNaW5pbWl6ZWQpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGVyZSBtYXkgYmUgbXVsdGlwbGUgY29tbWVudHMgaW4gdGhlIHRocmVhZCwgYnV0IHdlIHJlYWxseSBvbmx5IGNhcmUgYWJvdXQgdGhlIHJvb3QgY29tbWVudCB3aGVuIHJlbmRlcmluZ1xuICAgICAgLy8gZGVjb3JhdGlvbnMuXG4gICAgICBjb25zdCB0aHJlYWREYXRhID0ge1xuICAgICAgICByb290Q29tbWVudElEOiBjb21tZW50c1swXS5pZCxcbiAgICAgICAgdGhyZWFkSUQ6IHRocmVhZC5pZCxcbiAgICAgICAgcG9zaXRpb246IGNvbW1lbnRzWzBdLnBvc2l0aW9uLFxuICAgICAgICBuYXRpdmVSZWxQYXRoOiB0b05hdGl2ZVBhdGhTZXAoY29tbWVudHNbMF0ucGF0aCksXG4gICAgICAgIGZ1bGxQYXRoOiBwYXRoLmpvaW4od29ya2RpclBhdGgsIHRvTmF0aXZlUGF0aFNlcChjb21tZW50c1swXS5wYXRoKSksXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhyZWFkRGF0YUJ5UGF0aC5nZXQodGhyZWFkRGF0YS5mdWxsUGF0aCkpIHtcbiAgICAgICAgdGhyZWFkRGF0YUJ5UGF0aC5nZXQodGhyZWFkRGF0YS5mdWxsUGF0aCkucHVzaCh0aHJlYWREYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocmVhZERhdGFCeVBhdGguc2V0KHRocmVhZERhdGEuZnVsbFBhdGgsIFt0aHJlYWREYXRhXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbkVkaXRvcnNXaXRoQ29tbWVudFRocmVhZHMgPSB0aGlzLmdldE9wZW5FZGl0b3JzV2l0aENvbW1lbnRUaHJlYWRzKHRocmVhZERhdGFCeVBhdGgpO1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOm9wZW4tcmV2aWV3cy10YWJcIiBjYWxsYmFjaz17dGhpcy5vcGVuUmV2aWV3c1RhYn0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAge29wZW5FZGl0b3JzV2l0aENvbW1lbnRUaHJlYWRzLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICAgIGNvbnN0IHRocmVhZERhdGEgPSB0aHJlYWREYXRhQnlQYXRoLmdldChlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSB0aGlzLnByb3BzLmNvbW1lbnRUcmFuc2xhdGlvbnMuZ2V0KHRocmVhZERhdGFbMF0ubmF0aXZlUmVsUGF0aCk7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEZyYWdtZW50IGtleT17YGdpdGh1Yi1lZGl0b3ItZGVjb3JhdGlvbi0ke2VkaXRvci5pZH1gfT5cbiAgICAgICAgICAgICAgPEd1dHRlclxuICAgICAgICAgICAgICAgIG5hbWU9XCJnaXRodWItY29tbWVudC1pY29uXCJcbiAgICAgICAgICAgICAgICBwcmlvcml0eT17MX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjb21tZW50XCJcbiAgICAgICAgICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgICAgICAgICB0eXBlPVwiZGVjb3JhdGVkXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPEVkaXRvckNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgICAgICAgICBvd25lcj17dGhpcy5wcm9wcy5vd25lcn1cbiAgICAgICAgICAgICAgICByZXBvPXt0aGlzLnByb3BzLnJlcG99XG4gICAgICAgICAgICAgICAgbnVtYmVyPXtwdWxsUmVxdWVzdC5udW1iZXJ9XG4gICAgICAgICAgICAgICAgd29ya2Rpcj17d29ya2RpclBhdGh9XG4gICAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgICAgICAgICBmaWxlTmFtZT17ZWRpdG9yLmdldFBhdGgoKX1cbiAgICAgICAgICAgICAgICBoZWFkU2hhPXtwdWxsUmVxdWVzdC5oZWFkUmVmT2lkfVxuICAgICAgICAgICAgICAgIHRocmVhZHNGb3JQYXRoPXt0aHJlYWREYXRhfVxuICAgICAgICAgICAgICAgIGNvbW1lbnRUcmFuc2xhdGlvbnNGb3JQYXRoPXt0cmFuc2xhdGlvbnN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9GcmFnbWVudD4pO1xuICB9XG5cbiAgZ2V0T3BlbkVkaXRvcnNXaXRoQ29tbWVudFRocmVhZHModGhyZWFkRGF0YUJ5UGF0aCkge1xuICAgIGNvbnN0IGhhdmVUaHJlYWRzID0gW107XG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgdGhpcy5zdGF0ZS5vcGVuRWRpdG9ycykge1xuICAgICAgaWYgKHRocmVhZERhdGFCeVBhdGguaGFzKGVkaXRvci5nZXRQYXRoKCkpKSB7XG4gICAgICAgIGhhdmVUaHJlYWRzLnB1c2goZWRpdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhdmVUaHJlYWRzO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIFBSIGNoZWNrZWQgb3V0LlxuICAvLyB0b2RvOiBpZiB0aGlzIGlzIHNpbWlsYXIgZW5vdWdoIHRvIHByLWNoZWNrb3V0LWNvbnRyb2xsZXIsIGV4dHJhY3QgYSBzaW5nbGVcbiAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGRvIHRoaXMgY2hlY2suXG4gIGlzQ2hlY2tlZE91dFB1bGxSZXF1ZXN0KGJyYW5jaGVzLCByZW1vdGVzLCBwdWxsUmVxdWVzdCkge1xuICAgIC8vIGRldGVybWluZSBpZiBwdWxsUmVxdWVzdC5oZWFkUmVwb3NpdG9yeSBpcyBudWxsXG4gICAgLy8gdGhpcyBjYW4gaGFwcGVuIGlmIGEgcmVwb3NpdG9yeSBoYXMgYmVlbiBkZWxldGVkLlxuICAgIGlmICghcHVsbFJlcXVlc3QuaGVhZFJlcG9zaXRvcnkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB7cmVwb3NpdG9yeX0gPSBwdWxsUmVxdWVzdDtcblxuICAgIGNvbnN0IGhlYWRQdXNoID0gYnJhbmNoZXMuZ2V0SGVhZEJyYW5jaCgpLmdldFB1c2goKTtcbiAgICBjb25zdCBoZWFkUmVtb3RlID0gcmVtb3Rlcy53aXRoTmFtZShoZWFkUHVzaC5nZXRSZW1vdGVOYW1lKCkpO1xuXG4gICAgLy8gKGRldGVjdCBjaGVja291dCBmcm9tIHB1bGwvIyMjIHJlZnNwZWMpXG4gICAgY29uc3QgZnJvbVB1bGxSZWZzcGVjID1cbiAgICAgICAgaGVhZFJlbW90ZS5nZXRPd25lcigpID09PSByZXBvc2l0b3J5Lm93bmVyLmxvZ2luICYmXG4gICAgICAgIGhlYWRSZW1vdGUuZ2V0UmVwbygpID09PSByZXBvc2l0b3J5Lm5hbWUgJiZcbiAgICAgICAgaGVhZFB1c2guZ2V0U2hvcnRSZW1vdGVSZWYoKSA9PT0gYHB1bGwvJHtwdWxsUmVxdWVzdC5udW1iZXJ9L2hlYWRgO1xuXG4gICAgLy8gKGRldGVjdCBjaGVja291dCBmcm9tIGhlYWQgcmVwb3NpdG9yeSlcbiAgICBjb25zdCBmcm9tSGVhZFJlcG8gPVxuICAgICAgICBoZWFkUmVtb3RlLmdldE93bmVyKCkgPT09IHB1bGxSZXF1ZXN0LmhlYWRSZXBvc2l0b3J5Lm93bmVyLmxvZ2luICYmXG4gICAgICAgIGhlYWRSZW1vdGUuZ2V0UmVwbygpID09PSBwdWxsUmVxdWVzdC5oZWFkUmVwb3NpdG9yeS5uYW1lICYmXG4gICAgICAgIGhlYWRQdXNoLmdldFNob3J0UmVtb3RlUmVmKCkgPT09IHB1bGxSZXF1ZXN0LmhlYWRSZWZOYW1lO1xuXG4gICAgaWYgKGZyb21QdWxsUmVmc3BlYyB8fCBmcm9tSGVhZFJlcG8pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVPcGVuRWRpdG9ycyA9ICgpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtvcGVuRWRpdG9yczogdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKX0sIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgb3BlblJldmlld3NUYWIgPSAoKSA9PiB7XG4gICAgY29uc3QgW3B1bGxSZXF1ZXN0XSA9IHRoaXMucHJvcHMucHVsbFJlcXVlc3RzO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghcHVsbFJlcXVlc3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHVyaSA9IFJldmlld3NJdGVtLmJ1aWxkVVJJKHtcbiAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0SG9zdCgpLFxuICAgICAgb3duZXI6IHRoaXMucHJvcHMub3duZXIsXG4gICAgICByZXBvOiB0aGlzLnByb3BzLnJlcG8sXG4gICAgICBudW1iZXI6IHB1bGxSZXF1ZXN0Lm51bWJlcixcbiAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMucmVwb0RhdGEud29ya2luZ0RpcmVjdG9yeVBhdGgsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWV9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ29tbWVudERlY29yYXRpb25zQ29udHJvbGxlciwge1xuICBwdWxsUmVxdWVzdHM6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMgb24gUHVsbFJlcXVlc3RcbiAgICBAcmVsYXkocGx1cmFsOiB0cnVlKVxuICAgIHtcbiAgICAgIG51bWJlclxuICAgICAgaGVhZFJlZk5hbWVcbiAgICAgIGhlYWRSZWZPaWRcbiAgICAgIGhlYWRSZXBvc2l0b3J5IHtcbiAgICAgICAgbmFtZVxuICAgICAgICBvd25lciB7XG4gICAgICAgICAgbG9naW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVwb3NpdG9yeSB7XG4gICAgICAgIG5hbWVcbiAgICAgICAgb3duZXIge1xuICAgICAgICAgIGxvZ2luXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==