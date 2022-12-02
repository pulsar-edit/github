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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NvbW1lbnQtZGVjb3JhdGlvbnMtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkNvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVwb0RhdGEiLCJwcm9wcyIsImxvZ2luTW9kZWwiLCJmZXRjaFRva2VuIiwidG9rZW4iLCJyZW5kZXJXaXRoVG9rZW4iLCJyZXBvc2l0b3J5IiwiYnJhbmNoZXMiLCJnZXRCcmFuY2hlcyIsInJlbW90ZXMiLCJnZXRSZW1vdGVzIiwiY3VycmVudFJlbW90ZSIsImdldEN1cnJlbnRHaXRIdWJSZW1vdGUiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiZW5kcG9pbnQiLCJnZXRFbmRwb2ludCIsImdldFRva2VuIiwiZ2V0TG9naW5BY2NvdW50IiwicmVuZGVyIiwibG9jYWxSZXBvc2l0b3J5IiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlbmRlcldpdGhMb2NhbFJlcG9zaXRvcnlEYXRhIiwiVU5BVVRIRU5USUNBVEVEIiwiSU5TVUZGSUNJRU5UIiwiRXJyb3IiLCJoZWFkIiwiZ2V0SGVhZEJyYW5jaCIsImlzUHJlc2VudCIsInB1c2giLCJnZXRQdXNoIiwiaXNSZW1vdGVUcmFja2luZyIsInB1c2hSZW1vdGUiLCJ3aXRoTmFtZSIsImdldFJlbW90ZU5hbWUiLCJpc0dpdGh1YlJlcG8iLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsInF1ZXJ5IiwidmFyaWFibGVzIiwiaGVhZE93bmVyIiwiZ2V0T3duZXIiLCJoZWFkTmFtZSIsImdldFJlcG8iLCJoZWFkUmVmIiwiZ2V0UmVtb3RlUmVmIiwiZmlyc3QiLCJyZXZpZXdDb3VudCIsIlBBR0VfU0laRSIsInJldmlld0N1cnNvciIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwiY29tbWVudEN1cnNvciIsInF1ZXJ5UmVzdWx0IiwicmVuZGVyV2l0aFB1bGxSZXF1ZXN0Iiwib3duZXIiLCJyZXBvIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJlZiIsImFzc29jaWF0ZWRQdWxsUmVxdWVzdHMiLCJ0b3RhbENvdW50IiwiY3VycmVudFB1bGxSZXF1ZXN0Iiwibm9kZXMiLCJyZXBvcnRSZWxheUVycm9yIiwiZXJyb3JzIiwic3VtbWFyaWVzIiwiY29tbWVudFRocmVhZHMiLCJyZW5kZXJXaXRoUmV2aWV3cyIsInJlcG9SZXN1bHQiLCJsZW5ndGgiLCJudW1iZXIiLCJJbmZpbml0eSIsInBhdGNoRXJyb3IiLCJwYXRjaCIsInJlbmRlcldpdGhQYXRjaCIsImhlYWRSZWZPaWQiLCJjb21tZW50VHJhbnNsYXRpb25zIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSwyQkFBTixTQUEwQ0MsZUFBTUMsU0FBaEQsQ0FBMEQ7QUFBQTtBQUFBOztBQUFBLDJEQWtCdkNDLFFBQVEsSUFBSTtBQUMxQyxVQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNiLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQ0UsNkJBQUMscUJBQUQ7QUFDRSxRQUFBLEtBQUssRUFBRSxLQUFLQyxLQUFMLENBQVdDLFVBRHBCO0FBRUUsUUFBQSxXQUFXLEVBQUUsQ0FBQ0YsUUFBRCxDQUZmO0FBR0UsUUFBQSxTQUFTLEVBQUUsS0FBS0c7QUFIbEIsU0FJR0MsS0FBSyxJQUFJLEtBQUtDLGVBQUwsQ0FBcUJELEtBQXJCLEVBQTRCO0FBQUNKLFFBQUFBO0FBQUQsT0FB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QSxRQUFRLEVBQUVDLG1CQUFVQyxNQUFWLENBQWlCQyxVQUZWO0FBR2pCakUsRUFBQUEsZUFBZSxFQUFFK0QsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSGpCO0FBSWpCbkYsRUFBQUEsVUFBVSxFQUFFb0YscUNBQXlCRCxVQUpwQjtBQU1qQmxCLEVBQUFBLGdCQUFnQixFQUFFZ0IsbUJBQVVJLElBQVYsQ0FBZUY7QUFOaEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgQ29tbWVudERlY29yYXRpb25zQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21tZW50LWRlY29yYXRpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBSZWxheUVudmlyb25tZW50IGZyb20gJy4uL3ZpZXdzL3JlbGF5LWVudmlyb25tZW50JztcbmltcG9ydCB7R2l0aHViTG9naW5Nb2RlbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7VU5BVVRIRU5USUNBVEVELCBJTlNVRkZJQ0lFTlR9IGZyb20gJy4uL3NoYXJlZC9rZXl0YXItc3RyYXRlZ3knO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IHtQQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IEFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyIGZyb20gJy4vYWdncmVnYXRlZC1yZXZpZXdzLWNvbnRhaW5lcic7XG5pbXBvcnQgQ29tbWVudFBvc2l0aW9uaW5nQ29udGFpbmVyIGZyb20gJy4vY29tbWVudC1wb3NpdGlvbmluZy1jb250YWluZXInO1xuaW1wb3J0IFB1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXIgZnJvbSAnLi9wci1wYXRjaC1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaFJlcG9zaXRvcnlEYXRhfT5cbiAgICAgICAge3RoaXMucmVuZGVyV2l0aExvY2FsUmVwb3NpdG9yeURhdGF9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aExvY2FsUmVwb3NpdG9yeURhdGEgPSByZXBvRGF0YSA9PiB7XG4gICAgaWYgKCFyZXBvRGF0YSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWxcbiAgICAgICAgbW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgZmV0Y2hQYXJhbXM9e1tyZXBvRGF0YV19XG4gICAgICAgIGZldGNoRGF0YT17dGhpcy5mZXRjaFRva2VufT5cbiAgICAgICAge3Rva2VuID0+IHRoaXMucmVuZGVyV2l0aFRva2VuKHRva2VuLCB7cmVwb0RhdGF9KX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoVG9rZW4odG9rZW4sIHtyZXBvRGF0YX0pIHtcbiAgICBpZiAoIXRva2VuIHx8IHRva2VuID09PSBVTkFVVEhFTlRJQ0FURUQgfHwgdG9rZW4gPT09IElOU1VGRklDSUVOVCB8fCB0b2tlbiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyB3ZSdyZSBub3QgZ29pbmcgdG8gcHJvbXB0IHVzZXJzIHRvIGxvZyBpbiB0byByZW5kZXIgZGVjb3JhdGlvbnMgZm9yIGNvbW1lbnRzXG4gICAgICAvLyBqdXN0IGxldCBpdCBnbyBhbmQgbW92ZSBvbiB3aXRoIG91ciBsaXZlcy5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWQgPSByZXBvRGF0YS5icmFuY2hlcy5nZXRIZWFkQnJhbmNoKCk7XG4gICAgaWYgKCFoZWFkLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwdXNoID0gaGVhZC5nZXRQdXNoKCk7XG4gICAgaWYgKCFwdXNoLmlzUHJlc2VudCgpIHx8ICFwdXNoLmlzUmVtb3RlVHJhY2tpbmcoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcHVzaFJlbW90ZSA9IHJlcG9EYXRhLnJlbW90ZXMud2l0aE5hbWUocHVzaC5nZXRSZW1vdGVOYW1lKCkpO1xuICAgIGlmICghcHVzaFJlbW90ZS5pc1ByZXNlbnQoKSB8fCAhcHVzaFJlbW90ZS5pc0dpdGh1YlJlcG8oKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZW5kcG9pbnQgPSByZXBvRGF0YS5jdXJyZW50UmVtb3RlLmdldEVuZHBvaW50KCk7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KGVuZHBvaW50LCB0b2tlbik7XG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgY29tbWVudERlY29yYXRpb25zQ29udGFpbmVyUXVlcnkoXG4gICAgICAgICRoZWFkT3duZXI6IFN0cmluZyFcbiAgICAgICAgJGhlYWROYW1lOiBTdHJpbmchXG4gICAgICAgICRoZWFkUmVmOiBTdHJpbmchXG4gICAgICAgICRyZXZpZXdDb3VudDogSW50IVxuICAgICAgICAkcmV2aWV3Q3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJHRocmVhZENvdW50OiBJbnQhXG4gICAgICAgICR0aHJlYWRDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkY29tbWVudENvdW50OiBJbnQhXG4gICAgICAgICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGZpcnN0OiBJbnQhXG4gICAgICApIHtcbiAgICAgICAgcmVwb3NpdG9yeShvd25lcjogJGhlYWRPd25lciwgbmFtZTogJGhlYWROYW1lKSB7XG4gICAgICAgICAgcmVmKHF1YWxpZmllZE5hbWU6ICRoZWFkUmVmKSB7XG4gICAgICAgICAgICBhc3NvY2lhdGVkUHVsbFJlcXVlc3RzKGZpcnN0OiAkZmlyc3QsIHN0YXRlczogW09QRU5dKSB7XG4gICAgICAgICAgICAgIHRvdGFsQ291bnRcbiAgICAgICAgICAgICAgbm9kZXMge1xuICAgICAgICAgICAgICAgIG51bWJlclxuICAgICAgICAgICAgICAgIGhlYWRSZWZPaWRcblxuICAgICAgICAgICAgICAgIC4uLmNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzXG4gICAgICAgICAgICAgICAgLi4uYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgICAgICAgIHJldmlld0NvdW50OiAkcmV2aWV3Q291bnRcbiAgICAgICAgICAgICAgICAgIHJldmlld0N1cnNvcjogJHJldmlld0N1cnNvclxuICAgICAgICAgICAgICAgICAgdGhyZWFkQ291bnQ6ICR0aHJlYWRDb3VudFxuICAgICAgICAgICAgICAgICAgdGhyZWFkQ3Vyc29yOiAkdGhyZWFkQ3Vyc29yXG4gICAgICAgICAgICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgICAgICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgICBoZWFkT3duZXI6IHB1c2hSZW1vdGUuZ2V0T3duZXIoKSxcbiAgICAgIGhlYWROYW1lOiBwdXNoUmVtb3RlLmdldFJlcG8oKSxcbiAgICAgIGhlYWRSZWY6IHB1c2guZ2V0UmVtb3RlUmVmKCksXG4gICAgICBmaXJzdDogMSxcbiAgICAgIHJldmlld0NvdW50OiBQQUdFX1NJWkUsXG4gICAgICByZXZpZXdDdXJzb3I6IG51bGwsXG4gICAgICB0aHJlYWRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgdGhyZWFkQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWVudENvdW50OiBQQUdFX1NJWkUsXG4gICAgICBjb21tZW50Q3Vyc29yOiBudWxsLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJlbGF5RW52aXJvbm1lbnQuUHJvdmlkZXIgdmFsdWU9e2Vudmlyb25tZW50fT5cbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICAgIHZhcmlhYmxlcz17dmFyaWFibGVzfVxuICAgICAgICAgIHJlbmRlcj17cXVlcnlSZXN1bHQgPT4gdGhpcy5yZW5kZXJXaXRoUHVsbFJlcXVlc3Qoe1xuICAgICAgICAgICAgZW5kcG9pbnQsXG4gICAgICAgICAgICBvd25lcjogdmFyaWFibGVzLmhlYWRPd25lcixcbiAgICAgICAgICAgIHJlcG86IHZhcmlhYmxlcy5oZWFkTmFtZSxcbiAgICAgICAgICAgIC4uLnF1ZXJ5UmVzdWx0LFxuICAgICAgICAgIH0sIHtyZXBvRGF0YSwgdG9rZW59KX1cbiAgICAgICAgLz5cbiAgICAgIDwvUmVsYXlFbnZpcm9ubWVudC5Qcm92aWRlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFB1bGxSZXF1ZXN0KHtlcnJvciwgcHJvcHMsIGVuZHBvaW50LCBvd25lciwgcmVwb30sIHtyZXBvRGF0YSwgdG9rZW59KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBlcnJvciBmZXRjaGluZyBDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIgZGF0YTogJHtlcnJvcn1gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFwcm9wcyB8fCAhcHJvcHMucmVwb3NpdG9yeSB8fCAhcHJvcHMucmVwb3NpdG9yeS5yZWYgfHxcbiAgICAgICFwcm9wcy5yZXBvc2l0b3J5LnJlZi5hc3NvY2lhdGVkUHVsbFJlcXVlc3RzIHx8XG4gICAgICBwcm9wcy5yZXBvc2l0b3J5LnJlZi5hc3NvY2lhdGVkUHVsbFJlcXVlc3RzLnRvdGFsQ291bnQgPT09IDBcbiAgICApIHtcbiAgICAgIC8vIG5vIGxvYWRpbmcgc3Bpbm5lciBmb3IgeW91XG4gICAgICAvLyBqdXN0IGZldGNoIHNpbGVudGx5IGJlaGluZCB0aGUgc2NlbmVzIGxpa2UgYSBnb29kIGxpdHRsZSBjb250YWluZXJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQdWxsUmVxdWVzdCA9IHByb3BzLnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHMubm9kZXNbMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyXG4gICAgICAgIHB1bGxSZXF1ZXN0PXtjdXJyZW50UHVsbFJlcXVlc3R9XG4gICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn0+XG4gICAgICAgIHsoe2Vycm9ycywgc3VtbWFyaWVzLCBjb21tZW50VGhyZWFkc30pID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJXaXRoUmV2aWV3cyhcbiAgICAgICAgICAgIHtlcnJvcnMsIHN1bW1hcmllcywgY29tbWVudFRocmVhZHN9LFxuICAgICAgICAgICAge2N1cnJlbnRQdWxsUmVxdWVzdCwgcmVwb1Jlc3VsdDogcHJvcHMsIGVuZHBvaW50LCBvd25lciwgcmVwbywgcmVwb0RhdGEsIHRva2VufSxcbiAgICAgICAgICApO1xuICAgICAgICB9fVxuICAgICAgPC9BZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFJldmlld3MoXG4gICAge2Vycm9ycywgc3VtbWFyaWVzLCBjb21tZW50VGhyZWFkc30sXG4gICAge2N1cnJlbnRQdWxsUmVxdWVzdCwgcmVwb1Jlc3VsdCwgZW5kcG9pbnQsIG93bmVyLCByZXBvLCByZXBvRGF0YSwgdG9rZW59LFxuICApIHtcbiAgICBpZiAoZXJyb3JzICYmIGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKCdFcnJvcnMgYWdncmVnYXRpbmcgcmV2aWV3cyBhbmQgY29tbWVudHMgZm9yIGN1cnJlbnQgcHVsbCByZXF1ZXN0JywgLi4uZXJyb3JzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChjb21tZW50VGhyZWFkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8UHVsbFJlcXVlc3RQYXRjaENvbnRhaW5lclxuICAgICAgICBvd25lcj17b3duZXJ9XG4gICAgICAgIHJlcG89e3JlcG99XG4gICAgICAgIG51bWJlcj17Y3VycmVudFB1bGxSZXF1ZXN0Lm51bWJlcn1cbiAgICAgICAgZW5kcG9pbnQ9e2VuZHBvaW50fVxuICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgIGxhcmdlRGlmZlRocmVzaG9sZD17SW5maW5pdHl9PlxuICAgICAgICB7KHBhdGNoRXJyb3IsIHBhdGNoKSA9PiB0aGlzLnJlbmRlcldpdGhQYXRjaChcbiAgICAgICAgICB7ZXJyb3I6IHBhdGNoRXJyb3IsIHBhdGNofSxcbiAgICAgICAgICB7c3VtbWFyaWVzLCBjb21tZW50VGhyZWFkcywgY3VycmVudFB1bGxSZXF1ZXN0LCByZXBvUmVzdWx0LCBlbmRwb2ludCwgb3duZXIsIHJlcG8sIHJlcG9EYXRhLCB0b2tlbn0sXG4gICAgICAgICl9XG4gICAgICA8L1B1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhQYXRjaChcbiAgICB7ZXJyb3IsIHBhdGNofSxcbiAgICB7c3VtbWFyaWVzLCBjb21tZW50VGhyZWFkcywgY3VycmVudFB1bGxSZXF1ZXN0LCByZXBvUmVzdWx0LCBlbmRwb2ludCwgb3duZXIsIHJlcG8sIHJlcG9EYXRhLCB0b2tlbn0sXG4gICkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybignRXJyb3IgZmV0Y2hpbmcgcGF0Y2ggZm9yIGN1cnJlbnQgcHVsbCByZXF1ZXN0JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFwYXRjaCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21tZW50UG9zaXRpb25pbmdDb250YWluZXJcbiAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e3BhdGNofVxuICAgICAgICBjb21tZW50VGhyZWFkcz17Y29tbWVudFRocmVhZHN9XG4gICAgICAgIHByQ29tbWl0U2hhPXtjdXJyZW50UHVsbFJlcXVlc3QuaGVhZFJlZk9pZH1cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeX1cbiAgICAgICAgd29ya2Rpcj17cmVwb0RhdGEud29ya2luZ0RpcmVjdG9yeVBhdGh9PlxuICAgICAgICB7Y29tbWVudFRyYW5zbGF0aW9ucyA9PiB7XG4gICAgICAgICAgaWYgKCFjb21tZW50VHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgZW5kcG9pbnQ9e2VuZHBvaW50fVxuICAgICAgICAgICAgICBvd25lcj17b3duZXJ9XG4gICAgICAgICAgICAgIHJlcG89e3JlcG99XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICByZXBvRGF0YT17cmVwb0RhdGF9XG4gICAgICAgICAgICAgIGNvbW1lbnRUaHJlYWRzPXtjb21tZW50VGhyZWFkc31cbiAgICAgICAgICAgICAgY29tbWVudFRyYW5zbGF0aW9ucz17Y29tbWVudFRyYW5zbGF0aW9uc31cbiAgICAgICAgICAgICAgcHVsbFJlcXVlc3RzPXtyZXBvUmVzdWx0LnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHMubm9kZXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH19XG4gICAgICA8L0NvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgZmV0Y2hSZXBvc2l0b3J5RGF0YSA9IHJlcG9zaXRvcnkgPT4ge1xuICAgIHJldHVybiB5dWJpa2lyaSh7XG4gICAgICBicmFuY2hlczogcmVwb3NpdG9yeS5nZXRCcmFuY2hlcygpLFxuICAgICAgcmVtb3RlczogcmVwb3NpdG9yeS5nZXRSZW1vdGVzKCksXG4gICAgICBjdXJyZW50UmVtb3RlOiByZXBvc2l0b3J5LmdldEN1cnJlbnRHaXRIdWJSZW1vdGUoKSxcbiAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgfSk7XG4gIH1cblxuICBmZXRjaFRva2VuID0gKGxvZ2luTW9kZWwsIHJlcG9EYXRhKSA9PiB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSByZXBvRGF0YS5jdXJyZW50UmVtb3RlLmdldEVuZHBvaW50KCk7XG4gICAgaWYgKCFlbmRwb2ludCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvZ2luTW9kZWwuZ2V0VG9rZW4oZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCkpO1xuICB9XG59XG4iXX0=