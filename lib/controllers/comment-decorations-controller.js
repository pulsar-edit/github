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
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, _react.default.createElement(_commands.Command, {
      command: "github:open-reviews-tab",
      callback: this.openReviewsTab
    })), openEditorsWithCommentThreads.map(editor => {
      const threadData = threadDataByPath.get(editor.getPath());
      const translations = this.props.commentTranslations.get(threadData[0].nativeRelPath);
      return _react.default.createElement(_react.Fragment, {
        key: `github-editor-decoration-${editor.id}`
      }, _react.default.createElement(_gutter.default, {
        name: "github-comment-icon",
        priority: 1,
        className: "comment",
        editor: editor,
        type: "decorated"
      }), _react.default.createElement(_editorCommentDecorationsController.default, {
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