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

      return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
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
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
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
    return /*#__PURE__*/_react.default.createElement(_relayEnvironment.default.Provider, {
      value: environment
    }, /*#__PURE__*/_react.default.createElement(_reactRelay.QueryRenderer, {
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
    return /*#__PURE__*/_react.default.createElement(_aggregatedReviewsContainer.default, {
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

    return /*#__PURE__*/_react.default.createElement(_prPatchContainer.default, {
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

    return /*#__PURE__*/_react.default.createElement(_commentPositioningContainer.default, {
      multiFilePatch: patch,
      commentThreads: commentThreads,
      prCommitSha: currentPullRequest.headRefOid,
      localRepository: this.props.localRepository,
      workdir: repoData.workingDirectoryPath
    }, commentTranslations => {
      if (!commentTranslations) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_commentDecorationsController.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NvbW1lbnQtZGVjb3JhdGlvbnMtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkNvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVwb0RhdGEiLCJwcm9wcyIsImxvZ2luTW9kZWwiLCJmZXRjaFRva2VuIiwidG9rZW4iLCJyZW5kZXJXaXRoVG9rZW4iLCJyZXBvc2l0b3J5IiwiYnJhbmNoZXMiLCJnZXRCcmFuY2hlcyIsInJlbW90ZXMiLCJnZXRSZW1vdGVzIiwiY3VycmVudFJlbW90ZSIsImdldEN1cnJlbnRHaXRIdWJSZW1vdGUiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiZW5kcG9pbnQiLCJnZXRFbmRwb2ludCIsImdldFRva2VuIiwiZ2V0TG9naW5BY2NvdW50IiwicmVuZGVyIiwibG9jYWxSZXBvc2l0b3J5IiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlbmRlcldpdGhMb2NhbFJlcG9zaXRvcnlEYXRhIiwiVU5BVVRIRU5USUNBVEVEIiwiSU5TVUZGSUNJRU5UIiwiRXJyb3IiLCJoZWFkIiwiZ2V0SGVhZEJyYW5jaCIsImlzUHJlc2VudCIsInB1c2giLCJnZXRQdXNoIiwiaXNSZW1vdGVUcmFja2luZyIsInB1c2hSZW1vdGUiLCJ3aXRoTmFtZSIsImdldFJlbW90ZU5hbWUiLCJpc0dpdGh1YlJlcG8iLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsInF1ZXJ5IiwidmFyaWFibGVzIiwiaGVhZE93bmVyIiwiZ2V0T3duZXIiLCJoZWFkTmFtZSIsImdldFJlcG8iLCJoZWFkUmVmIiwiZ2V0UmVtb3RlUmVmIiwiZmlyc3QiLCJyZXZpZXdDb3VudCIsIlBBR0VfU0laRSIsInJldmlld0N1cnNvciIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwiY29tbWVudEN1cnNvciIsInF1ZXJ5UmVzdWx0IiwicmVuZGVyV2l0aFB1bGxSZXF1ZXN0Iiwib3duZXIiLCJyZXBvIiwiZXJyb3IiLCJjb25zb2xlIiwid2FybiIsInJlZiIsImFzc29jaWF0ZWRQdWxsUmVxdWVzdHMiLCJ0b3RhbENvdW50IiwiY3VycmVudFB1bGxSZXF1ZXN0Iiwibm9kZXMiLCJyZXBvcnRSZWxheUVycm9yIiwiZXJyb3JzIiwic3VtbWFyaWVzIiwiY29tbWVudFRocmVhZHMiLCJyZW5kZXJXaXRoUmV2aWV3cyIsInJlcG9SZXN1bHQiLCJsZW5ndGgiLCJudW1iZXIiLCJJbmZpbml0eSIsInBhdGNoRXJyb3IiLCJwYXRjaCIsInJlbmRlcldpdGhQYXRjaCIsImhlYWRSZWZPaWQiLCJjb21tZW50VHJhbnNsYXRpb25zIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSwyQkFBTixTQUEwQ0MsZUFBTUMsU0FBaEQsQ0FBMEQ7QUFBQTtBQUFBOztBQUFBLDJEQWtCdkNDLFFBQVEsSUFBSTtBQUMxQyxVQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNiLGVBQU8sSUFBUDtBQUNEOztBQUVELDBCQUNFLDZCQUFDLHFCQUFEO0FBQ0UsUUFBQSxLQUFLLEVBQUUsS0FBS0MsS0FBTCxDQUFXQyxVQURwQjtBQUVFLFFBQUEsV0FBVyxFQUFFLENBQUNGLFFBQUQsQ0FGZjtBQUdFLFFBQUEsU0FBUyxFQUFFLEtBQUtHO0FBSGxCLFNBSUdDLEtBQUssSUFBSSxLQUFLQyxlQUFMLENBQXFCRCxLQUFyQixFQUE0QjtBQUFDSixRQUFBQTtBQUFELE9B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akJILEVBQUFBLFFBQVEsRUFBRUMsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBRlY7QUFHakJqRSxFQUFBQSxlQUFlLEVBQUUrRCxtQkFBVUMsTUFBVixDQUFpQkMsVUFIakI7QUFJakJuRixFQUFBQSxVQUFVLEVBQUVvRixxQ0FBeUJELFVBSnBCO0FBTWpCbEIsRUFBQUEsZ0JBQWdCLEVBQUVnQixtQkFBVUksSUFBVixDQUFlRjtBQU5oQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuaW1wb3J0IHtRdWVyeVJlbmRlcmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCBDb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NvbW1lbnQtZGVjb3JhdGlvbnMtY29udHJvbGxlcic7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IFJlbGF5RW52aXJvbm1lbnQgZnJvbSAnLi4vdmlld3MvcmVsYXktZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtVTkFVVEhFTlRJQ0FURUQsIElOU1VGRklDSUVOVH0gZnJvbSAnLi4vc2hhcmVkL2tleXRhci1zdHJhdGVneSc7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQge1BBR0VfU0laRX0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgQWdncmVnYXRlZFJldmlld3NDb250YWluZXIgZnJvbSAnLi9hZ2dyZWdhdGVkLXJldmlld3MtY29udGFpbmVyJztcbmltcG9ydCBDb21tZW50UG9zaXRpb25pbmdDb250YWluZXIgZnJvbSAnLi9jb21tZW50LXBvc2l0aW9uaW5nLWNvbnRhaW5lcic7XG5pbXBvcnQgUHVsbFJlcXVlc3RQYXRjaENvbnRhaW5lciBmcm9tICcuL3ByLXBhdGNoLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBsb2NhbFJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBsb2dpbk1vZGVsOiBHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLmxvY2FsUmVwb3NpdG9yeX0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoUmVwb3NpdG9yeURhdGF9PlxuICAgICAgICB7dGhpcy5yZW5kZXJXaXRoTG9jYWxSZXBvc2l0b3J5RGF0YX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoTG9jYWxSZXBvc2l0b3J5RGF0YSA9IHJlcG9EYXRhID0+IHtcbiAgICBpZiAoIXJlcG9EYXRhKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbFxuICAgICAgICBtb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICBmZXRjaFBhcmFtcz17W3JlcG9EYXRhXX1cbiAgICAgICAgZmV0Y2hEYXRhPXt0aGlzLmZldGNoVG9rZW59PlxuICAgICAgICB7dG9rZW4gPT4gdGhpcy5yZW5kZXJXaXRoVG9rZW4odG9rZW4sIHtyZXBvRGF0YX0pfVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhUb2tlbih0b2tlbiwge3JlcG9EYXRhfSkge1xuICAgIGlmICghdG9rZW4gfHwgdG9rZW4gPT09IFVOQVVUSEVOVElDQVRFRCB8fCB0b2tlbiA9PT0gSU5TVUZGSUNJRU5UIHx8IHRva2VuIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIHdlJ3JlIG5vdCBnb2luZyB0byBwcm9tcHQgdXNlcnMgdG8gbG9nIGluIHRvIHJlbmRlciBkZWNvcmF0aW9ucyBmb3IgY29tbWVudHNcbiAgICAgIC8vIGp1c3QgbGV0IGl0IGdvIGFuZCBtb3ZlIG9uIHdpdGggb3VyIGxpdmVzLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZCA9IHJlcG9EYXRhLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICBpZiAoIWhlYWQuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHB1c2ggPSBoZWFkLmdldFB1c2goKTtcbiAgICBpZiAoIXB1c2guaXNQcmVzZW50KCkgfHwgIXB1c2guaXNSZW1vdGVUcmFja2luZygpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwdXNoUmVtb3RlID0gcmVwb0RhdGEucmVtb3Rlcy53aXRoTmFtZShwdXNoLmdldFJlbW90ZU5hbWUoKSk7XG4gICAgaWYgKCFwdXNoUmVtb3RlLmlzUHJlc2VudCgpIHx8ICFwdXNoUmVtb3RlLmlzR2l0aHViUmVwbygpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBlbmRwb2ludCA9IHJlcG9EYXRhLmN1cnJlbnRSZW1vdGUuZ2V0RW5kcG9pbnQoKTtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QoZW5kcG9pbnQsIHRva2VuKTtcbiAgICBjb25zdCBxdWVyeSA9IGdyYXBocWxgXG4gICAgICBxdWVyeSBjb21tZW50RGVjb3JhdGlvbnNDb250YWluZXJRdWVyeShcbiAgICAgICAgJGhlYWRPd25lcjogU3RyaW5nIVxuICAgICAgICAkaGVhZE5hbWU6IFN0cmluZyFcbiAgICAgICAgJGhlYWRSZWY6IFN0cmluZyFcbiAgICAgICAgJHJldmlld0NvdW50OiBJbnQhXG4gICAgICAgICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkdGhyZWFkQ291bnQ6IEludCFcbiAgICAgICAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICAgICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICAgICAgJGNvbW1lbnRDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkZmlyc3Q6IEludCFcbiAgICAgICkge1xuICAgICAgICByZXBvc2l0b3J5KG93bmVyOiAkaGVhZE93bmVyLCBuYW1lOiAkaGVhZE5hbWUpIHtcbiAgICAgICAgICByZWYocXVhbGlmaWVkTmFtZTogJGhlYWRSZWYpIHtcbiAgICAgICAgICAgIGFzc29jaWF0ZWRQdWxsUmVxdWVzdHMoZmlyc3Q6ICRmaXJzdCwgc3RhdGVzOiBbT1BFTl0pIHtcbiAgICAgICAgICAgICAgdG90YWxDb3VudFxuICAgICAgICAgICAgICBub2RlcyB7XG4gICAgICAgICAgICAgICAgbnVtYmVyXG4gICAgICAgICAgICAgICAgaGVhZFJlZk9pZFxuXG4gICAgICAgICAgICAgICAgLi4uY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHNcbiAgICAgICAgICAgICAgICAuLi5hZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgICAgICAgcmV2aWV3Q291bnQ6ICRyZXZpZXdDb3VudFxuICAgICAgICAgICAgICAgICAgcmV2aWV3Q3Vyc29yOiAkcmV2aWV3Q3Vyc29yXG4gICAgICAgICAgICAgICAgICB0aHJlYWRDb3VudDogJHRocmVhZENvdW50XG4gICAgICAgICAgICAgICAgICB0aHJlYWRDdXJzb3I6ICR0aHJlYWRDdXJzb3JcbiAgICAgICAgICAgICAgICAgIGNvbW1lbnRDb3VudDogJGNvbW1lbnRDb3VudFxuICAgICAgICAgICAgICAgICAgY29tbWVudEN1cnNvcjogJGNvbW1lbnRDdXJzb3JcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgO1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICAgIGhlYWRPd25lcjogcHVzaFJlbW90ZS5nZXRPd25lcigpLFxuICAgICAgaGVhZE5hbWU6IHB1c2hSZW1vdGUuZ2V0UmVwbygpLFxuICAgICAgaGVhZFJlZjogcHVzaC5nZXRSZW1vdGVSZWYoKSxcbiAgICAgIGZpcnN0OiAxLFxuICAgICAgcmV2aWV3Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHJldmlld0N1cnNvcjogbnVsbCxcbiAgICAgIHRocmVhZENvdW50OiBQQUdFX1NJWkUsXG4gICAgICB0aHJlYWRDdXJzb3I6IG51bGwsXG4gICAgICBjb21tZW50Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIGNvbW1lbnRDdXJzb3I6IG51bGwsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8UmVsYXlFbnZpcm9ubWVudC5Qcm92aWRlciB2YWx1ZT17ZW52aXJvbm1lbnR9PlxuICAgICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICAgIGVudmlyb25tZW50PXtlbnZpcm9ubWVudH1cbiAgICAgICAgICBxdWVyeT17cXVlcnl9XG4gICAgICAgICAgdmFyaWFibGVzPXt2YXJpYWJsZXN9XG4gICAgICAgICAgcmVuZGVyPXtxdWVyeVJlc3VsdCA9PiB0aGlzLnJlbmRlcldpdGhQdWxsUmVxdWVzdCh7XG4gICAgICAgICAgICBlbmRwb2ludCxcbiAgICAgICAgICAgIG93bmVyOiB2YXJpYWJsZXMuaGVhZE93bmVyLFxuICAgICAgICAgICAgcmVwbzogdmFyaWFibGVzLmhlYWROYW1lLFxuICAgICAgICAgICAgLi4ucXVlcnlSZXN1bHQsXG4gICAgICAgICAgfSwge3JlcG9EYXRhLCB0b2tlbn0pfVxuICAgICAgICAvPlxuICAgICAgPC9SZWxheUVudmlyb25tZW50LlByb3ZpZGVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUHVsbFJlcXVlc3Qoe2Vycm9yLCBwcm9wcywgZW5kcG9pbnQsIG93bmVyLCByZXBvfSwge3JlcG9EYXRhLCB0b2tlbn0pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oYGVycm9yIGZldGNoaW5nIENvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lciBkYXRhOiAke2Vycm9yfWApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIXByb3BzIHx8ICFwcm9wcy5yZXBvc2l0b3J5IHx8ICFwcm9wcy5yZXBvc2l0b3J5LnJlZiB8fFxuICAgICAgIXByb3BzLnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHMgfHxcbiAgICAgIHByb3BzLnJlcG9zaXRvcnkucmVmLmFzc29jaWF0ZWRQdWxsUmVxdWVzdHMudG90YWxDb3VudCA9PT0gMFxuICAgICkge1xuICAgICAgLy8gbm8gbG9hZGluZyBzcGlubmVyIGZvciB5b3VcbiAgICAgIC8vIGp1c3QgZmV0Y2ggc2lsZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMgbGlrZSBhIGdvb2QgbGl0dGxlIGNvbnRhaW5lclxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudFB1bGxSZXF1ZXN0ID0gcHJvcHMucmVwb3NpdG9yeS5yZWYuYXNzb2NpYXRlZFB1bGxSZXF1ZXN0cy5ub2Rlc1swXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8QWdncmVnYXRlZFJldmlld3NDb250YWluZXJcbiAgICAgICAgcHVsbFJlcXVlc3Q9e2N1cnJlbnRQdWxsUmVxdWVzdH1cbiAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfT5cbiAgICAgICAgeyh7ZXJyb3JzLCBzdW1tYXJpZXMsIGNvbW1lbnRUaHJlYWRzfSkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcldpdGhSZXZpZXdzKFxuICAgICAgICAgICAge2Vycm9ycywgc3VtbWFyaWVzLCBjb21tZW50VGhyZWFkc30sXG4gICAgICAgICAgICB7Y3VycmVudFB1bGxSZXF1ZXN0LCByZXBvUmVzdWx0OiBwcm9wcywgZW5kcG9pbnQsIG93bmVyLCByZXBvLCByZXBvRGF0YSwgdG9rZW59LFxuICAgICAgICAgICk7XG4gICAgICAgIH19XG4gICAgICA8L0FnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUmV2aWV3cyhcbiAgICB7ZXJyb3JzLCBzdW1tYXJpZXMsIGNvbW1lbnRUaHJlYWRzfSxcbiAgICB7Y3VycmVudFB1bGxSZXF1ZXN0LCByZXBvUmVzdWx0LCBlbmRwb2ludCwgb3duZXIsIHJlcG8sIHJlcG9EYXRhLCB0b2tlbn0sXG4gICkge1xuICAgIGlmIChlcnJvcnMgJiYgZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oJ0Vycm9ycyBhZ2dyZWdhdGluZyByZXZpZXdzIGFuZCBjb21tZW50cyBmb3IgY3VycmVudCBwdWxsIHJlcXVlc3QnLCAuLi5lcnJvcnMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1lbnRUaHJlYWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxQdWxsUmVxdWVzdFBhdGNoQ29udGFpbmVyXG4gICAgICAgIG93bmVyPXtvd25lcn1cbiAgICAgICAgcmVwbz17cmVwb31cbiAgICAgICAgbnVtYmVyPXtjdXJyZW50UHVsbFJlcXVlc3QubnVtYmVyfVxuICAgICAgICBlbmRwb2ludD17ZW5kcG9pbnR9XG4gICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgICAgbGFyZ2VEaWZmVGhyZXNob2xkPXtJbmZpbml0eX0+XG4gICAgICAgIHsocGF0Y2hFcnJvciwgcGF0Y2gpID0+IHRoaXMucmVuZGVyV2l0aFBhdGNoKFxuICAgICAgICAgIHtlcnJvcjogcGF0Y2hFcnJvciwgcGF0Y2h9LFxuICAgICAgICAgIHtzdW1tYXJpZXMsIGNvbW1lbnRUaHJlYWRzLCBjdXJyZW50UHVsbFJlcXVlc3QsIHJlcG9SZXN1bHQsIGVuZHBvaW50LCBvd25lciwgcmVwbywgcmVwb0RhdGEsIHRva2VufSxcbiAgICAgICAgKX1cbiAgICAgIDwvUHVsbFJlcXVlc3RQYXRjaENvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFBhdGNoKFxuICAgIHtlcnJvciwgcGF0Y2h9LFxuICAgIHtzdW1tYXJpZXMsIGNvbW1lbnRUaHJlYWRzLCBjdXJyZW50UHVsbFJlcXVlc3QsIHJlcG9SZXN1bHQsIGVuZHBvaW50LCBvd25lciwgcmVwbywgcmVwb0RhdGEsIHRva2VufSxcbiAgKSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKCdFcnJvciBmZXRjaGluZyBwYXRjaCBmb3IgY3VycmVudCBwdWxsIHJlcXVlc3QnLCBlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXBhdGNoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lclxuICAgICAgICBtdWx0aUZpbGVQYXRjaD17cGF0Y2h9XG4gICAgICAgIGNvbW1lbnRUaHJlYWRzPXtjb21tZW50VGhyZWFkc31cbiAgICAgICAgcHJDb21taXRTaGE9e2N1cnJlbnRQdWxsUmVxdWVzdC5oZWFkUmVmT2lkfVxuICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMubG9jYWxSZXBvc2l0b3J5fVxuICAgICAgICB3b3JrZGlyPXtyZXBvRGF0YS53b3JraW5nRGlyZWN0b3J5UGF0aH0+XG4gICAgICAgIHtjb21tZW50VHJhbnNsYXRpb25zID0+IHtcbiAgICAgICAgICBpZiAoIWNvbW1lbnRUcmFuc2xhdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Q29tbWVudERlY29yYXRpb25zQ29udHJvbGxlclxuICAgICAgICAgICAgICBlbmRwb2ludD17ZW5kcG9pbnR9XG4gICAgICAgICAgICAgIG93bmVyPXtvd25lcn1cbiAgICAgICAgICAgICAgcmVwbz17cmVwb31cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIHJlcG9EYXRhPXtyZXBvRGF0YX1cbiAgICAgICAgICAgICAgY29tbWVudFRocmVhZHM9e2NvbW1lbnRUaHJlYWRzfVxuICAgICAgICAgICAgICBjb21tZW50VHJhbnNsYXRpb25zPXtjb21tZW50VHJhbnNsYXRpb25zfVxuICAgICAgICAgICAgICBwdWxsUmVxdWVzdHM9e3JlcG9SZXN1bHQucmVwb3NpdG9yeS5yZWYuYXNzb2NpYXRlZFB1bGxSZXF1ZXN0cy5ub2Rlc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvQ29tbWVudFBvc2l0aW9uaW5nQ29udGFpbmVyPlxuICAgICk7XG4gIH1cblxuICBmZXRjaFJlcG9zaXRvcnlEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIGJyYW5jaGVzOiByZXBvc2l0b3J5LmdldEJyYW5jaGVzKCksXG4gICAgICByZW1vdGVzOiByZXBvc2l0b3J5LmdldFJlbW90ZXMoKSxcbiAgICAgIGN1cnJlbnRSZW1vdGU6IHJlcG9zaXRvcnkuZ2V0Q3VycmVudEdpdEh1YlJlbW90ZSgpLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGZldGNoVG9rZW4gPSAobG9naW5Nb2RlbCwgcmVwb0RhdGEpID0+IHtcbiAgICBjb25zdCBlbmRwb2ludCA9IHJlcG9EYXRhLmN1cnJlbnRSZW1vdGUuZ2V0RW5kcG9pbnQoKTtcbiAgICBpZiAoIWVuZHBvaW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9naW5Nb2RlbC5nZXRUb2tlbihlbmRwb2ludC5nZXRMb2dpbkFjY291bnQoKSk7XG4gIH1cbn1cbiJdfQ==