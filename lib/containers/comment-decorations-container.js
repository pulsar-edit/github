"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _yubikiri = _interopRequireDefault(require("yubikiri"));
var _reactRelay = require("react-relay");
var _commentDecorationsController = _interopRequireDefault(require("../controllers/comment-decorations-controller"));
var _observeModel = _interopRequireDefault(require("../views/observe-model"));
var _relayEnvironment = _interopRequireDefault(require("../views/relay-environment"));
var _propTypes2 = require("../prop-types");
var _keytarStrategy = require("../shared/keytar-strategy");
var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));
var _helpers = require("../helpers");
var _aggregatedReviewsContainer = _interopRequireDefault(require("./aggregated-reviews-container"));
var _commentPositioningContainer = _interopRequireDefault(require("./comment-positioning-container"));
var _prPatchContainer = _interopRequireDefault(require("./pr-patch-container"));
var _graphql;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommentDecorationsContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderWithLocalRepositoryData", repoData => {
      if (!repoData) {
        return null;
      }
      return _react.default.createElement(_observeModel.default, {
        model: this.props.loginModel,
        fetchParams: [repoData],
        fetchData: this.fetchToken
      }, token => this.renderWithToken(token, {
        repoData
      }));
    });
    _defineProperty(this, "fetchRepositoryData", repository => {
      return (0, _yubikiri.default)({
        branches: repository.getBranches(),
        remotes: repository.getRemotes(),
        currentRemote: repository.getCurrentGitHubRemote(),
        workingDirectoryPath: repository.getWorkingDirectoryPath()
      });
    });
    _defineProperty(this, "fetchToken", (loginModel, repoData) => {
      const endpoint = repoData.currentRemote.getEndpoint();
      if (!endpoint) {
        return null;
      }
      return loginModel.getToken(endpoint.getLoginAccount());
    });
  }
  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.localRepository,
      fetchData: this.fetchRepositoryData
    }, this.renderWithLocalRepositoryData);
  }
  renderWithToken(token, {
    repoData
  }) {
    if (!token || token === _keytarStrategy.UNAUTHENTICATED || token === _keytarStrategy.INSUFFICIENT || token instanceof Error) {
      // we're not going to prompt users to log in to render decorations for comments
      // just let it go and move on with our lives.
      return null;
    }
    const head = repoData.branches.getHeadBranch();
    if (!head.isPresent()) {
      return null;
    }
    const push = head.getPush();
    if (!push.isPresent() || !push.isRemoteTracking()) {
      return null;
    }
    const pushRemote = repoData.remotes.withName(push.getRemoteName());
    if (!pushRemote.isPresent() || !pushRemote.isGithubRepo()) {
      return null;
    }
    const endpoint = repoData.currentRemote.getEndpoint();
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(endpoint, token);
    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/commentDecorationsContainerQuery.graphql");
      if (node.hash && node.hash !== "8154acbf4c24d190f6fdf0254ae73817") {
        console.error("The definition of 'commentDecorationsContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }
      return require("./__generated__/commentDecorationsContainerQuery.graphql");
    });
    const variables = {
      headOwner: pushRemote.getOwner(),
      headName: pushRemote.getRepo(),
      headRef: push.getRemoteRef(),
      first: 1,
      reviewCount: _helpers.PAGE_SIZE,
      reviewCursor: null,
      threadCount: _helpers.PAGE_SIZE,
      threadCursor: null,
      commentCount: _helpers.PAGE_SIZE,
      commentCursor: null
    };
    return _react.default.createElement(_relayEnvironment.default.Provider, {
      value: environment
    }, _react.default.createElement(_reactRelay.QueryRenderer, {
      environment: environment,
      query: query,
      variables: variables,
      render: queryResult => this.renderWithPullRequest(_objectSpread({
        endpoint,
        owner: variables.headOwner,
        repo: variables.headName
      }, queryResult), {
        repoData,
        token
      })
    }));
  }
  renderWithPullRequest({
    error,
    props,
    endpoint,
    owner,
    repo
  }, {
    repoData,
    token
  }) {
    if (error) {
      // eslint-disable-next-line no-console
      console.warn(`error fetching CommentDecorationsContainer data: ${error}`);
      return null;
    }
    if (!props || !props.repository || !props.repository.ref || !props.repository.ref.associatedPullRequests || props.repository.ref.associatedPullRequests.totalCount === 0) {
      // no loading spinner for you
      // just fetch silently behind the scenes like a good little container
      return null;
    }
    const currentPullRequest = props.repository.ref.associatedPullRequests.nodes[0];
    return _react.default.createElement(_aggregatedReviewsContainer.default, {
      pullRequest: currentPullRequest,
      reportRelayError: this.props.reportRelayError
    }, ({
      errors,
      summaries,
      commentThreads
    }) => {
      return this.renderWithReviews({
        errors,
        summaries,
        commentThreads
      }, {
        currentPullRequest,
        repoResult: props,
        endpoint,
        owner,
        repo,
        repoData,
        token
      });
    });
  }
  renderWithReviews({
    errors,
    summaries,
    commentThreads
  }, {
    currentPullRequest,
    repoResult,
    endpoint,
    owner,
    repo,
    repoData,
    token
  }) {
    if (errors && errors.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('Errors aggregating reviews and comments for current pull request', ...errors);
      return null;
    }
    if (commentThreads.length === 0) {
      return null;
    }
    return _react.default.createElement(_prPatchContainer.default, {
      owner: owner,
      repo: repo,
      number: currentPullRequest.number,
      endpoint: endpoint,
      token: token,
      largeDiffThreshold: Infinity
    }, (patchError, patch) => this.renderWithPatch({
      error: patchError,
      patch
    }, {
      summaries,
      commentThreads,
      currentPullRequest,
      repoResult,
      endpoint,
      owner,
      repo,
      repoData,
      token
    }));
  }
  renderWithPatch({
    error,
    patch
  }, {
    summaries,
    commentThreads,
    currentPullRequest,
    repoResult,
    endpoint,
    owner,
    repo,
    repoData,
    token
  }) {
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('Error fetching patch for current pull request', error);
      return null;
    }
    if (!patch) {
      return null;
    }
    return _react.default.createElement(_commentPositioningContainer.default, {
      multiFilePatch: patch,
      commentThreads: commentThreads,
      prCommitSha: currentPullRequest.headRefOid,
      localRepository: this.props.localRepository,
      workdir: repoData.workingDirectoryPath
    }, commentTranslations => {
      if (!commentTranslations) {
        return null;
      }
      return _react.default.createElement(_commentDecorationsController.default, {
        endpoint: endpoint,
        owner: owner,
        repo: repo,
        workspace: this.props.workspace,
        commands: this.props.commands,
        repoData: repoData,
        commentThreads: commentThreads,
        commentTranslations: commentTranslations,
        pullRequests: repoResult.repository.ref.associatedPullRequests.nodes
      });
    });
  }
}
exports.default = CommentDecorationsContainer;
_defineProperty(CommentDecorationsContainer, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  localRepository: _propTypes.default.object.isRequired,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  reportRelayError: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlcG9EYXRhIiwicHJvcHMiLCJsb2dpbk1vZGVsIiwiZmV0Y2hUb2tlbiIsInRva2VuIiwicmVuZGVyV2l0aFRva2VuIiwicmVwb3NpdG9yeSIsInl1YmlraXJpIiwiYnJhbmNoZXMiLCJnZXRCcmFuY2hlcyIsInJlbW90ZXMiLCJnZXRSZW1vdGVzIiwiY3VycmVudFJlbW90ZSIsImdldEN1cnJlbnRHaXRIdWJSZW1vdGUiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiZW5kcG9pbnQiLCJnZXRFbmRwb2ludCIsImdldFRva2VuIiwiZ2V0TG9naW5BY2NvdW50IiwicmVuZGVyIiwibG9jYWxSZXBvc2l0b3J5IiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlbmRlcldpdGhMb2NhbFJlcG9zaXRvcnlEYXRhIiwiVU5BVVRIRU5USUNBVEVEIiwiSU5TVUZGSUNJRU5UIiwiRXJyb3IiLCJoZWFkIiwiZ2V0SGVhZEJyYW5jaCIsImlzUHJlc2VudCIsInB1c2giLCJnZXRQdXNoIiwiaXNSZW1vdGVUcmFja2luZyIsInB1c2hSZW1vdGUiLCJ3aXRoTmFtZSIsImdldFJlbW90ZU5hbWUiLCJpc0dpdGh1YlJlcG8iLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsInF1ZXJ5IiwidmFyaWFibGVzIiwiaGVhZE93bmVyIiwiZ2V0T3duZXIiLCJoZWFkTmFtZSIsImdldFJlcG8iLCJoZWFkUmVmIiwiZ2V0UmVtb3RlUmVmIiwiZmlyc3QiLCJyZXZpZXdDb3VudCIsIlBBR0VfU0laRSIsInJldmlld0N1cnNvciIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwiY29tbWVudEN1cnNvciIsInF1ZXJ5UmVzdWx0IiwicmVuZGVyV2l0aFB1bGxSZXF1ZXN0Iiwib3duZXIiLCJyZXBvIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJlZiIsImFzc29jaWF0ZWRQdWxsUmVxdWVzdHMiLCJ0b3RhbENvdW50IiwiY3VycmVudFB1bGxSZXF1ZXN0Iiwibm9kZXMiLCJyZXBvcnRSZWxheUVycm9yIiwiZXJyb3JzIiwic3VtbWFyaWVzIiwiY29tbWVudFRocmVhZHMiLCJyZW5kZXJXaXRoUmV2aWV3cyIsInJlcG9SZXN1bHQiLCJsZW5ndGgiLCJudW1iZXIiLCJJbmZpbml0eSIsInBhdGNoRXJyb3IiLCJwYXRjaCIsInJlbmRlcldpdGhQYXRjaCIsImhlYWRSZWZPaWQiLCJjb21tZW50VHJhbnNsYXRpb25zIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwiZnVuYyJdLCJzb3VyY2VzIjpbImNvbW1lbnQtZGVjb3JhdGlvbnMtY29udGFpbmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgQ29tbWVudERlY29yYXRpb25zQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21tZW50LWRlY29yYXRpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBSZWxheUVudmlyb25tZW50IGZyb20gJy4uL3ZpZXdzL3JlbGF5LWVudmlyb25tZW50JztcbmltcG9ydCB7R2l0aHViTG9naW5Nb2RlbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7VU5BVVRIRU5USUNBVEVELCBJTlNVRkZJQ0lFTlR9IGZyb20gJy4uL3NoYXJlZC9rZXl0YXItc3RyYXRlZ3knO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IHtQQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IEFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyIGZyb20gJy4vYWdncmVnYXRlZC1yZXZpZXdzLWNvbnRhaW5lcic7XG5pbXBvcnQgQ29tbWVudFBvc2l0aW9uaW5nQ29udGFpbmVyIGZyb20gJy4vY29tbWVudC1wb3NpdGlvbmluZy1jb250YWluZXInO1xuaW1wb3J0IFB1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXIgZnJvbSAnLi9wci1wYXRjaC1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaFJlcG9zaXRvcnlEYXRhfT5cbiAgICAgICAge3RoaXMucmVuZGVyV2l0aExvY2FsUmVwb3NpdG9yeURhdGF9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aExvY2FsUmVwb3NpdG9yeURhdGEgPSByZXBvRGF0YSA9PiB7XG4gICAgaWYgKCFyZXBvRGF0YSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWxcbiAgICAgICAgbW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgZmV0Y2hQYXJhbXM9e1tyZXBvRGF0YV19XG4gICAgICAgIGZldGNoRGF0YT17dGhpcy5mZXRjaFRva2VufT5cbiAgICAgICAge3Rva2VuID0+IHRoaXMucmVuZGVyV2l0aFRva2VuKHRva2VuLCB7cmVwb0RhdGF9KX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoVG9rZW4odG9rZW4sIHtyZXBvRGF0YX0pIHtcbiAgICBpZiAoIXRva2VuIHx8IHRva2VuID09PSBVTkFVVEhFTlRJQ0FURUQgfHwgdG9rZW4gPT09IElOU1VGRklDSUVOVCB8fCB0b2tlbiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyB3ZSdyZSBub3QgZ29pbmcgdG8gcHJvbXB0IHVzZXJzIHRvIGxvZyBpbiB0byByZW5kZXIgZGVjb3JhdGlvbnMgZm9yIGNvbW1lbnRzXG4gICAgICAvLyBqdXN0IGxldCBpdCBnbyBhbmQgbW92ZSBvbiB3aXRoIG91ciBsaXZlcy5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWQgPSByZXBvRGF0YS5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCk7XG4gICAgaWYgKCFoZWFkLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwdXNoID0gaGVhZC5nZXRQdXNoKCk7XG4gICAgaWYgKCFwdXNoLmlzUHJlc2VudCgpIHx8ICFwdXNoLmlzUmVtb3RlVHJhY2tpbmcoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcHVzaFJlbW90ZSA9IHJlcG9EYXRhLnJlbW90ZXMud2l0aE5hbWUocHVzaC5nZXRSZW1vdGVOYW1lKCkpO1xuICAgIGlmICghcHVzaFJlbW90ZS5pc1ByZXNlbnQoKSB8fCAhcHVzaFJlbW90ZS5pc0dpdGh1YlJlcG8oKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kcG9pbnQgPSByZXBvRGF0YS5jdXJyZW50UmVtb3RlLmdldEVuZHBvaW50KCk7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KGVuZHBvaW50LCB0b2tlbik7XG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgY29tbWVudERlY29yYXRpb25zQ29udGFpbmVyUXVlcnkoXG4gICAgICAgICRoZWFkT3duZXI6IFN0cmluZyFcbiAgICAgICAgJGhlYWROYW1lOiBTdHJpbmchXG4gICAgICAgICRoZWFkUmVmOiBTdHJpbmchXG4gICAgICAgICRyZXZpZXdDb3VudDogSW50IVxuICAgICAgICAkcmV2aWV3Q3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJHRocmVhZENvdW50OiBJbnQhXG4gICAgICAgICR0aHJlYWRDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkY29tbWVudENvdW50OiBJbnQhXG4gICAgICAgICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGZpcnN0OiBJbnQhXG4gICAgICApIHtcbiAgICAgICAgcmVwb3NpdG9yeShvd25lcjogJGhlYWRPd25lciwgbmFtZTogJGhlYWROYW1lKSB7XG4gICAgICAgICAgcmVmKHF1YWxpZmllZE5hbWU6ICRoZWFkUmVmKSB7XG4gICAgICAgICAgICBhc3NvY2lhdGVkUHVsbFJlcXVlc3RzKGZpcnN0OiAkZmlyc3QsIHN0YXRlczogW09QRU5dKSB7XG4gICAgICAgICAgICAgIHRvdGFsQ291bnRcbiAgICAgICAgICAgICAgbm9kZXMge1xuICAgICAgICAgICAgICAgIG51bWJlclxuICAgICAgICAgICAgICAgIGhlYWRSZWZPaWRcblxuICAgICAgICAgICAgICAgIC4uLmNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzXG4gICAgICAgICAgICAgICAgLi4uYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgICAgICAgIHJldmlld0NvdW50OiAkcmV2aWV3Q291bnRcbiAgICAgICAgICAgICAgICAgIHJldmlld0N1cnNvcjogJHJldmlld0N1cnNvclxuICAgICAgICAgICAgICAgICAgdGhyZWFkQ291bnQ6ICR0aHJlYWRDb3VudFxuICAgICAgICAgICAgICAgICAgdGhyZWFkQ3Vyc29yOiAkdGhyZWFkQ3Vyc29yXG4gICAgICAgICAgICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgICAgICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgICBoZWFkT3duZXI6IHB1c2hSZW1vdGUuZ2V0T3duZXIoKSxcbiAgICAgIGhlYWROYW1lOiBwdXNoUmVtb3RlLmdldFJlcG8oKSxcbiAgICAgIGhlYWRSZWY6IHB1c2guZ2V0UmVtb3RlUmVmKCksXG4gICAgICBmaXJzdDogMSxcbiAgICAgIHJldmlld0NvdW50OiBQQUdFX1NJWkUsXG4gICAgICByZXZpZXdDdXJzb3I6IG51bGwsXG4gICAgICB0aHJlYWRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgdGhyZWFkQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWVudENvdW50OiBQQUdFX1NJWkUsXG4gICAgICBjb21tZW50Q3Vyc29yOiBudWxsLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJlbGF5RW52aXJvbm1lbnQuUHJvdmlkZXIgdmFsdWU9e2Vudmlyb25tZW50fT5cbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICAgIHZhcmlhYmxlcz17dmFyaWFibGVzfVxuICAgICAgICAgIHJlbmRlcj17cXVlcnlSZXN1bHQgPT4gdGhpcy5yZW5kZXJXaXRoUHVsbFJlcXVlc3Qoe1xuICAgICAgICAgICAgZW5kcG9pbnQsXG4gICAgICAgICAgICBvd25lcjogdmFyaWFibGVzLmhlYWRPd25lcixcbiAgICAgICAgICAgIHJlcG86IHZhcmlhYmxlcy5oZWFkTmFtZSxcbiAgICAgICAgICAgIC4uLnF1ZXJ5UmVzdWx0LFxuICAgICAgICAgIH0sIHtyZXBvRGF0YSwgdG9rZW59KX1cbiAgICAgICAgLz5cbiAgICAgIDwvUmVsYXlFbnZpcm9ubWVudC5Qcm92aWRlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFB1bGxSZXF1ZXN0KHtlcnJvciwgcHJvcHMsIGVuZHBvaW50LCBvd25lciwgcmVwb30sIHtyZXBvRGF0YSwgdG9rZW59KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBlcnJvciBmZXRjaGluZyBDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIgZGF0YTogJHtlcnJvcn1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFwcm9wcyB8fCAhcHJvcHMucmVwb3NpdG9yeSB8fCAhcHJvcHMucmVwb3NpdG9yeS5yZWYgfHxcbiAgICAgICFwcm9wcy5yZXBvc2l0b3J5LnJlZi5hc3NvY2lhdGVkUHVsbFJlcXVlc3RzIHx8XG4gICAgICBwcm9wcy5yZXBvc2l0b3J5LnJlZi5hc3NvY2lhdGVkUHVsbFJlcXVlc3RzLnRvdGFsQ291bnQgPT09IDBcbiAgICApIHtcbiAgICAgIC8vIG5vIGxvYWRpbmcgc3Bpbm5lciBmb3IgeW91XG4gICAgICAvLyBqdXN0IGZldGNoIHNpbGVudGx5IGJlaGluZCB0aGUgc2NlbmVzIGxpa2UgYSBnb29kIGxpdHRsZSBjb250YWluZXJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQdWxsUmVxdWVzdCA9IHByb3BzLnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHMubm9kZXNbMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyXG4gICAgICAgIHB1bGxSZXF1ZXN0PXtjdXJyZW50UHVsbFJlcXVlc3R9XG4gICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn0+XG4gICAgICAgIHsoe2Vycm9ycywgc3VtbWFyaWVzLCBjb21tZW50VGhyZWFkc30pID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJXaXRoUmV2aWV3cyhcbiAgICAgICAgICAgIHtlcnJvcnMsIHN1bW1hcmllcywgY29tbWVudFRocmVhZHN9LFxuICAgICAgICAgICAge2N1cnJlbnRQdWxsUmVxdWVzdCwgcmVwb1Jlc3VsdDogcHJvcHMsIGVuZHBvaW50LCBvd25lciwgcmVwbywgcmVwb0RhdGEsIHRva2VufSxcbiAgICAgICAgICApO1xuICAgICAgICB9fVxuICAgICAgPC9BZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFJldmlld3MoXG4gICAge2Vycm9ycywgc3VtbWFyaWVzLCBjb21tZW50VGhyZWFkc30sXG4gICAge2N1cnJlbnRQdWxsUmVxdWVzdCwgcmVwb1Jlc3VsdCwgZW5kcG9pbnQsIG93bmVyLCByZXBvLCByZXBvRGF0YSwgdG9rZW59LFxuICApIHtcbiAgICBpZiAoZXJyb3JzICYmIGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKCdFcnJvcnMgYWdncmVnYXRpbmcgcmV2aWV3cyBhbmQgY29tbWVudHMgZm9yIGN1cnJlbnQgcHVsbCByZXF1ZXN0JywgLi4uZXJyb3JzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChjb21tZW50VGhyZWFkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8UHVsbFJlcXVlc3RQYXRjaENvbnRhaW5lclxuICAgICAgICBvd25lcj17b3duZXJ9XG4gICAgICAgIHJlcG89e3JlcG99XG4gICAgICAgIG51bWJlcj17Y3VycmVudFB1bGxSZXF1ZXN0Lm51bWJlcn1cbiAgICAgICAgZW5kcG9pbnQ9e2VuZHBvaW50fVxuICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgIGxhcmdlRGlmZlRocmVzaG9sZD17SW5maW5pdHl9PlxuICAgICAgICB7KHBhdGNoRXJyb3IsIHBhdGNoKSA9PiB0aGlzLnJlbmRlcldpdGhQYXRjaChcbiAgICAgICAgICB7ZXJyb3I6IHBhdGNoRXJyb3IsIHBhdGNofSxcbiAgICAgICAgICB7c3VtbWFyaWVzLCBjb21tZW50VGhyZWFkcywgY3VycmVudFB1bGxSZXF1ZXN0LCByZXBvUmVzdWx0LCBlbmRwb2ludCwgb3duZXIsIHJlcG8sIHJlcG9EYXRhLCB0b2tlbn0sXG4gICAgICAgICl9XG4gICAgICA8L1B1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhQYXRjaChcbiAgICB7ZXJyb3IsIHBhdGNofSxcbiAgICB7c3VtbWFyaWVzLCBjb21tZW50VGhyZWFkcywgY3VycmVudFB1bGxSZXF1ZXN0LCByZXBvUmVzdWx0LCBlbmRwb2ludCwgb3duZXIsIHJlcG8sIHJlcG9EYXRhLCB0b2tlbn0sXG4gICkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybignRXJyb3IgZmV0Y2hpbmcgcGF0Y2ggZm9yIGN1cnJlbnQgcHVsbCByZXF1ZXN0JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFwYXRjaCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21tZW50UG9zaXRpb25pbmdDb250YWluZXJcbiAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e3BhdGNofVxuICAgICAgICBjb21tZW50VGhyZWFkcz17Y29tbWVudFRocmVhZHN9XG4gICAgICAgIHByQ29tbWl0U2hhPXtjdXJyZW50UHVsbFJlcXVlc3QuaGVhZFJlZk9pZH1cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeX1cbiAgICAgICAgd29ya2Rpcj17cmVwb0RhdGEud29ya2luZ0RpcmVjdG9yeVBhdGh9PlxuICAgICAgICB7Y29tbWVudFRyYW5zbGF0aW9ucyA9PiB7XG4gICAgICAgICAgaWYgKCFjb21tZW50VHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgZW5kcG9pbnQ9e2VuZHBvaW50fVxuICAgICAgICAgICAgICBvd25lcj17b3duZXJ9XG4gICAgICAgICAgICAgIHJlcG89e3JlcG99XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICByZXBvRGF0YT17cmVwb0RhdGF9XG4gICAgICAgICAgICAgIGNvbW1lbnRUaHJlYWRzPXtjb21tZW50VGhyZWFkc31cbiAgICAgICAgICAgICAgY29tbWVudFRyYW5zbGF0aW9ucz17Y29tbWVudFRyYW5zbGF0aW9uc31cbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3RzPXtyZXBvUmVzdWx0LnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHMubm9kZXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH19XG4gICAgICA8L0NvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgZmV0Y2hSZXBvc2l0b3J5RGF0YSA9IHJlcG9zaXRvcnkgPT4ge1xuICAgIHJldHVybiB5dWJpa2lyaSh7XG4gICAgICBicmFuY2hlczogcmVwb3NpdG9yeS5nZXRCcmFuY2hlcygpLFxuICAgICAgcmVtb3RlczogcmVwb3NpdG9yeS5nZXRSZW1vdGVzKCksXG4gICAgICBjdXJyZW50UmVtb3RlOiByZXBvc2l0b3J5LmdldEN1cnJlbnRHaXRIdWJSZW1vdGUoKSxcbiAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgfSk7XG4gIH1cblxuICBmZXRjaFRva2VuID0gKGxvZ2luTW9kZWwsIHJlcG9EYXRhKSA9PiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSByZXBvRGF0YS5jdXJyZW50UmVtb3RlLmdldEVuZHBvaW50KCk7XG4gICAgaWYgKCFlbmRwb2ludCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvZ2luTW9kZWwuZ2V0VG9rZW4oZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCkpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtB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