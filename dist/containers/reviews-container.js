"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _yubikiri = _interopRequireDefault(require("yubikiri"));

var _reactRelay = require("react-relay");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _keytarStrategy = require("../shared/keytar-strategy");

var _prPatchContainer = _interopRequireDefault(require("./pr-patch-container"));

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _loadingView = _interopRequireDefault(require("../views/loading-view"));

var _githubLoginView = _interopRequireDefault(require("../views/github-login-view"));

var _errorView = _interopRequireDefault(require("../views/error-view"));

var _queryErrorView = _interopRequireDefault(require("../views/query-error-view"));

var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));

var _relayEnvironment = _interopRequireDefault(require("../views/relay-environment"));

var _reviewsController = _interopRequireDefault(require("../controllers/reviews-controller"));

var _aggregatedReviewsContainer = _interopRequireDefault(require("./aggregated-reviews-container"));

var _commentPositioningContainer = _interopRequireDefault(require("./comment-positioning-container"));

var _graphql;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReviewsContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderWithToken", token => {
      if (!token) {
        return /*#__PURE__*/_react.default.createElement(_loadingView.default, null);
      }

      if (token instanceof Error) {
        return /*#__PURE__*/_react.default.createElement(_queryErrorView.default, {
          error: token,
          retry: this.handleTokenRetry,
          login: this.handleLogin,
          logout: this.handleLogout
        });
      }

      if (token === _keytarStrategy.UNAUTHENTICATED) {
        return /*#__PURE__*/_react.default.createElement(_githubLoginView.default, {
          onLogin: this.handleLogin
        });
      }

      if (token === _keytarStrategy.INSUFFICIENT) {
        return /*#__PURE__*/_react.default.createElement(_githubLoginView.default, {
          onLogin: this.handleLogin
        }, /*#__PURE__*/_react.default.createElement("p", null, "Your token no longer has sufficient authorizations. Please re-authenticate and generate a new one."));
      }

      return /*#__PURE__*/_react.default.createElement(_prPatchContainer.default, {
        owner: this.props.owner,
        repo: this.props.repo,
        number: this.props.number,
        endpoint: this.props.endpoint,
        token: token,
        largeDiffThreshold: Infinity
      }, (error, patch) => this.renderWithPatch(error, {
        token,
        patch
      }));
    });

    _defineProperty(this, "fetchToken", loginModel => loginModel.getToken(this.props.endpoint.getLoginAccount()));

    _defineProperty(this, "fetchRepositoryData", repository => {
      return (0, _yubikiri.default)({
        branches: repository.getBranches(),
        remotes: repository.getRemotes(),
        isAbsent: repository.isAbsent(),
        isLoading: repository.isLoading(),
        isPresent: repository.isPresent(),
        isMerging: repository.isMerging(),
        isRebasing: repository.isRebasing()
      });
    });

    _defineProperty(this, "handleLogin", token => this.props.loginModel.setToken(this.props.endpoint.getLoginAccount(), token));

    _defineProperty(this, "handleLogout", () => this.props.loginModel.removeToken(this.props.endpoint.getLoginAccount()));

    _defineProperty(this, "handleTokenRetry", () => this.props.loginModel.didUpdate());
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.loginModel,
      fetchData: this.fetchToken
    }, this.renderWithToken);
  }

  renderWithPatch(error, {
    token,
    patch
  }) {
    if (error) {
      return /*#__PURE__*/_react.default.createElement(_errorView.default, {
        descriptions: [error]
      });
    }

    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchRepositoryData
    }, repoData => this.renderWithRepositoryData(repoData, {
      token,
      patch
    }));
  }

  renderWithRepositoryData(repoData, {
    token,
    patch
  }) {
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, token);

    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/reviewsContainerQuery.graphql");

      if (node.hash && node.hash !== "b05cc30cb078003afba9bd8c2de989fa") {
        console.error("The definition of 'reviewsContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }

      return require("./__generated__/reviewsContainerQuery.graphql");
    });

    const variables = {
      repoOwner: this.props.owner,
      repoName: this.props.repo,
      prNumber: this.props.number,
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
      render: queryResult => this.renderWithQuery(queryResult, {
        repoData,
        patch
      })
    }));
  }

  renderWithQuery({
    error,
    props,
    retry
  }, {
    repoData,
    patch
  }) {
    if (error) {
      return /*#__PURE__*/_react.default.createElement(_queryErrorView.default, {
        error: error,
        login: this.handleLogin,
        retry: retry,
        logout: this.handleLogout
      });
    }

    if (!props || !repoData || !patch) {
      return /*#__PURE__*/_react.default.createElement(_loadingView.default, null);
    }

    return /*#__PURE__*/_react.default.createElement(_aggregatedReviewsContainer.default, {
      pullRequest: props.repository.pullRequest,
      reportRelayError: this.props.reportRelayError
    }, ({
      errors,
      summaries,
      commentThreads,
      refetch
    }) => {
      if (errors && errors.length > 0) {
        return errors.map((err, i) => /*#__PURE__*/_react.default.createElement(_errorView.default, {
          key: `error-${i}`,
          title: "Pagination error",
          descriptions: [err.stack]
        }));
      }

      const aggregationResult = {
        summaries,
        commentThreads,
        refetch
      };
      return this.renderWithResult({
        aggregationResult,
        queryProps: props,
        repoData,
        patch,
        refetch
      });
    });
  }

  renderWithResult({
    aggregationResult,
    queryProps,
    repoData,
    patch
  }) {
    return /*#__PURE__*/_react.default.createElement(_commentPositioningContainer.default, _extends({
      multiFilePatch: patch
    }, aggregationResult, {
      prCommitSha: queryProps.repository.pullRequest.headRefOid,
      localRepository: this.props.repository
    }), commentTranslations => {
      return /*#__PURE__*/_react.default.createElement(_reviewsController.default, _extends({}, this.props, aggregationResult, {
        commentTranslations: commentTranslations,
        localRepository: this.props.repository,
        multiFilePatch: patch,
        repository: queryProps.repository,
        pullRequest: queryProps.repository.pullRequest,
        viewer: queryProps.viewer
      }, repoData));
    });
  }

}

exports.default = ReviewsContainer;

_defineProperty(ReviewsContainer, "propTypes", {
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  // Pull request selection criteria
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  workdir: _propTypes.default.string.isRequired,
  // Package models
  repository: _propTypes.default.object.isRequired,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  initThreadID: _propTypes.default.string,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL3Jldmlld3MtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIlJldmlld3NDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInRva2VuIiwiRXJyb3IiLCJoYW5kbGVUb2tlblJldHJ5IiwiaGFuZGxlTG9naW4iLCJoYW5kbGVMb2dvdXQiLCJVTkFVVEhFTlRJQ0FURUQiLCJJTlNVRkZJQ0lFTlQiLCJwcm9wcyIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsImVuZHBvaW50IiwiSW5maW5pdHkiLCJlcnJvciIsInBhdGNoIiwicmVuZGVyV2l0aFBhdGNoIiwibG9naW5Nb2RlbCIsImdldFRva2VuIiwiZ2V0TG9naW5BY2NvdW50IiwicmVwb3NpdG9yeSIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJyZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImlzQWJzZW50IiwiaXNMb2FkaW5nIiwiaXNQcmVzZW50IiwiaXNNZXJnaW5nIiwiaXNSZWJhc2luZyIsInNldFRva2VuIiwicmVtb3ZlVG9rZW4iLCJkaWRVcGRhdGUiLCJyZW5kZXIiLCJmZXRjaFRva2VuIiwicmVuZGVyV2l0aFRva2VuIiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlcG9EYXRhIiwicmVuZGVyV2l0aFJlcG9zaXRvcnlEYXRhIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJxdWVyeSIsInZhcmlhYmxlcyIsInJlcG9Pd25lciIsInJlcG9OYW1lIiwicHJOdW1iZXIiLCJyZXZpZXdDb3VudCIsIlBBR0VfU0laRSIsInJldmlld0N1cnNvciIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwiY29tbWVudEN1cnNvciIsInF1ZXJ5UmVzdWx0IiwicmVuZGVyV2l0aFF1ZXJ5IiwicmV0cnkiLCJwdWxsUmVxdWVzdCIsInJlcG9ydFJlbGF5RXJyb3IiLCJlcnJvcnMiLCJzdW1tYXJpZXMiLCJjb21tZW50VGhyZWFkcyIsInJlZmV0Y2giLCJsZW5ndGgiLCJtYXAiLCJlcnIiLCJpIiwic3RhY2siLCJhZ2dyZWdhdGlvblJlc3VsdCIsInJlbmRlcldpdGhSZXN1bHQiLCJxdWVyeVByb3BzIiwiaGVhZFJlZk9pZCIsImNvbW1lbnRUcmFuc2xhdGlvbnMiLCJ2aWV3ZXIiLCJFbmRwb2ludFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsIndvcmtkaXIiLCJvYmplY3QiLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJ3b3JrZGlyQ29udGV4dFBvb2wiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsImluaXRUaHJlYWRJRCIsIndvcmtzcGFjZSIsImNvbmZpZyIsImNvbW1hbmRzIiwidG9vbHRpcHMiLCJjb25maXJtIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sU0FBK0JDLGVBQU1DLFNBQXJDLENBQStDO0FBQUE7QUFBQTs7QUFBQSw2Q0FvQzFDQyxLQUFLLElBQUk7QUFDekIsVUFBSSxDQUFDQSxLQUFMLEVBQVk7QUFDViw0QkFBTyw2QkFBQyxvQkFBRCxPQUFQO0FBQ0Q7O0FBRUQsVUFBSUEsS0FBSyxZQUFZQyxLQUFyQixFQUE0QjtBQUMxQiw0QkFDRSw2QkFBQyx1QkFBRDtBQUNFLFVBQUEsS0FBSyxFQUFFRCxLQURUO0FBRUUsVUFBQSxLQUFLLEVBQUUsS0FBS0UsZ0JBRmQ7QUFHRSxVQUFBLEtBQUssRUFBRSxLQUFLQyxXQUhkO0FBSUUsVUFBQSxNQUFNLEVBQUUsS0FBS0M7QUFKZixVQURGO0FBUUQ7O0FBRUQsVUFBSUosS0FBSyxLQUFLSywrQkFBZCxFQUErQjtBQUM3Qiw0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O0FBQ0FjLEVBQUFBLFFBQVEsRUFBRThELDZCQUFpQkMsVUFGVjtBQUlqQjtBQUNBbEUsRUFBQUEsS0FBSyxFQUFFbUUsbUJBQVVDLE1BQVYsQ0FBaUJGLFVBTFA7QUFNakJqRSxFQUFBQSxJQUFJLEVBQUVrRSxtQkFBVUMsTUFBVixDQUFpQkYsVUFOTjtBQU9qQmhFLEVBQUFBLE1BQU0sRUFBRWlFLG1CQUFVakUsTUFBVixDQUFpQmdFLFVBUFI7QUFRakJHLEVBQUFBLE9BQU8sRUFBRUYsbUJBQVVDLE1BQVYsQ0FBaUJGLFVBUlQ7QUFVakI7QUFDQXZELEVBQUFBLFVBQVUsRUFBRXdELG1CQUFVRyxNQUFWLENBQWlCSixVQVhaO0FBWWpCMUQsRUFBQUEsVUFBVSxFQUFFK0QscUNBQXlCTCxVQVpwQjtBQWFqQk0sRUFBQUEsa0JBQWtCLEVBQUVDLHVDQUEyQlAsVUFiOUI7QUFjakJRLEVBQUFBLFlBQVksRUFBRVAsbUJBQVVDLE1BZFA7QUFnQmpCO0FBQ0FPLEVBQUFBLFNBQVMsRUFBRVIsbUJBQVVHLE1BQVYsQ0FBaUJKLFVBakJYO0FBa0JqQlUsRUFBQUEsTUFBTSxFQUFFVCxtQkFBVUcsTUFBVixDQUFpQkosVUFsQlI7QUFtQmpCVyxFQUFBQSxRQUFRLEVBQUVWLG1CQUFVRyxNQUFWLENBQWlCSixVQW5CVjtBQW9CakJZLEVBQUFBLFFBQVEsRUFBRVgsbUJBQVVHLE1BQVYsQ0FBaUJKLFVBcEJWO0FBcUJqQmEsRUFBQUEsT0FBTyxFQUFFWixtQkFBVWEsSUFBVixDQUFlZCxVQXJCUDtBQXVCakI7QUFDQWpCLEVBQUFBLGdCQUFnQixFQUFFa0IsbUJBQVVhLElBQVYsQ0FBZWQ7QUF4QmhCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IHtQQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGUsIFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7VU5BVVRIRU5USUNBVEVELCBJTlNVRkZJQ0lFTlR9IGZyb20gJy4uL3NoYXJlZC9rZXl0YXItc3RyYXRlZ3knO1xuaW1wb3J0IFB1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXIgZnJvbSAnLi9wci1wYXRjaC1jb250YWluZXInO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBMb2FkaW5nVmlldyBmcm9tICcuLi92aWV3cy9sb2FkaW5nLXZpZXcnO1xuaW1wb3J0IEdpdGh1YkxvZ2luVmlldyBmcm9tICcuLi92aWV3cy9naXRodWItbG9naW4tdmlldyc7XG5pbXBvcnQgRXJyb3JWaWV3IGZyb20gJy4uL3ZpZXdzL2Vycm9yLXZpZXcnO1xuaW1wb3J0IFF1ZXJ5RXJyb3JWaWV3IGZyb20gJy4uL3ZpZXdzL3F1ZXJ5LWVycm9yLXZpZXcnO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IFJlbGF5RW52aXJvbm1lbnQgZnJvbSAnLi4vdmlld3MvcmVsYXktZW52aXJvbm1lbnQnO1xuaW1wb3J0IFJldmlld3NDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL3Jldmlld3MtY29udHJvbGxlcic7XG5pbXBvcnQgQWdncmVnYXRlZFJldmlld3NDb250YWluZXIgZnJvbSAnLi9hZ2dyZWdhdGVkLXJldmlld3MtY29udGFpbmVyJztcbmltcG9ydCBDb21tZW50UG9zaXRpb25pbmdDb250YWluZXIgZnJvbSAnLi9jb21tZW50LXBvc2l0aW9uaW5nLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJldmlld3NDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIENvbm5lY3Rpb25cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUHVsbCByZXF1ZXN0IHNlbGVjdGlvbiBjcml0ZXJpYVxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIFBhY2thZ2UgbW9kZWxzXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGxvZ2luTW9kZWw6IEdpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXJDb250ZXh0UG9vbDogV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBpbml0VGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoVG9rZW59PlxuICAgICAgICB7dGhpcy5yZW5kZXJXaXRoVG9rZW59XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFRva2VuID0gdG9rZW4gPT4ge1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiA8TG9hZGluZ1ZpZXcgLz47XG4gICAgfVxuXG4gICAgaWYgKHRva2VuIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxRdWVyeUVycm9yVmlld1xuICAgICAgICAgIGVycm9yPXt0b2tlbn1cbiAgICAgICAgICByZXRyeT17dGhpcy5oYW5kbGVUb2tlblJldHJ5fVxuICAgICAgICAgIGxvZ2luPXt0aGlzLmhhbmRsZUxvZ2lufVxuICAgICAgICAgIGxvZ291dD17dGhpcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0b2tlbiA9PT0gVU5BVVRIRU5USUNBVEVEKSB7XG4gICAgICByZXR1cm4gPEdpdGh1YkxvZ2luVmlldyBvbkxvZ2luPXt0aGlzLmhhbmRsZUxvZ2lufSAvPjtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4gPT09IElOU1VGRklDSUVOVCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEdpdGh1YkxvZ2luVmlldyBvbkxvZ2luPXt0aGlzLmhhbmRsZUxvZ2lufT5cbiAgICAgICAgICA8cD5cbiAgICAgICAgICAgIFlvdXIgdG9rZW4gbm8gbG9uZ2VyIGhhcyBzdWZmaWNpZW50IGF1dGhvcml6YXRpb25zLiBQbGVhc2UgcmUtYXV0aGVudGljYXRlIGFuZCBnZW5lcmF0ZSBhIG5ldyBvbmUuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L0dpdGh1YkxvZ2luVmlldz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxQdWxsUmVxdWVzdFBhdGNoQ29udGFpbmVyXG4gICAgICAgIG93bmVyPXt0aGlzLnByb3BzLm93bmVyfVxuICAgICAgICByZXBvPXt0aGlzLnByb3BzLnJlcG99XG4gICAgICAgIG51bWJlcj17dGhpcy5wcm9wcy5udW1iZXJ9XG4gICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgIGxhcmdlRGlmZlRocmVzaG9sZD17SW5maW5pdHl9PlxuICAgICAgICB7KGVycm9yLCBwYXRjaCkgPT4gdGhpcy5yZW5kZXJXaXRoUGF0Y2goZXJyb3IsIHt0b2tlbiwgcGF0Y2h9KX1cbiAgICAgIDwvUHVsbFJlcXVlc3RQYXRjaENvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFBhdGNoKGVycm9yLCB7dG9rZW4sIHBhdGNofSkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvclZpZXcgZGVzY3JpcHRpb25zPXtbZXJyb3JdfSAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hSZXBvc2l0b3J5RGF0YX0+XG4gICAgICAgIHtyZXBvRGF0YSA9PiB0aGlzLnJlbmRlcldpdGhSZXBvc2l0b3J5RGF0YShyZXBvRGF0YSwge3Rva2VuLCBwYXRjaH0pfVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhSZXBvc2l0b3J5RGF0YShyZXBvRGF0YSwge3Rva2VuLCBwYXRjaH0pIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QodGhpcy5wcm9wcy5lbmRwb2ludCwgdG9rZW4pO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZ3JhcGhxbGBcbiAgICAgIHF1ZXJ5IHJldmlld3NDb250YWluZXJRdWVyeVxuICAgICAgKFxuICAgICAgICAkcmVwb093bmVyOiBTdHJpbmchXG4gICAgICAgICRyZXBvTmFtZTogU3RyaW5nIVxuICAgICAgICAkcHJOdW1iZXI6IEludCFcbiAgICAgICAgJHJldmlld0NvdW50OiBJbnQhXG4gICAgICAgICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkdGhyZWFkQ291bnQ6IEludCFcbiAgICAgICAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICAgICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICAgICAgJGNvbW1lbnRDdXJzb3I6IFN0cmluZ1xuICAgICAgKSB7XG4gICAgICAgIHJlcG9zaXRvcnkob3duZXI6ICRyZXBvT3duZXIsIG5hbWU6ICRyZXBvTmFtZSkge1xuICAgICAgICAgIC4uLnJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnlcbiAgICAgICAgICBwdWxsUmVxdWVzdChudW1iZXI6ICRwck51bWJlcikge1xuICAgICAgICAgICAgaGVhZFJlZk9pZFxuICAgICAgICAgICAgLi4uYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgICAgcmV2aWV3Q291bnQ6ICRyZXZpZXdDb3VudFxuICAgICAgICAgICAgICByZXZpZXdDdXJzb3I6ICRyZXZpZXdDdXJzb3JcbiAgICAgICAgICAgICAgdGhyZWFkQ291bnQ6ICR0aHJlYWRDb3VudFxuICAgICAgICAgICAgICB0aHJlYWRDdXJzb3I6ICR0aHJlYWRDdXJzb3JcbiAgICAgICAgICAgICAgY29tbWVudENvdW50OiAkY29tbWVudENvdW50XG4gICAgICAgICAgICAgIGNvbW1lbnRDdXJzb3I6ICRjb21tZW50Q3Vyc29yXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuLi5yZXZpZXdzQ29udHJvbGxlcl9wdWxsUmVxdWVzdFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZpZXdlciB7XG4gICAgICAgICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgO1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICAgIHJlcG9Pd25lcjogdGhpcy5wcm9wcy5vd25lcixcbiAgICAgIHJlcG9OYW1lOiB0aGlzLnByb3BzLnJlcG8sXG4gICAgICBwck51bWJlcjogdGhpcy5wcm9wcy5udW1iZXIsXG4gICAgICByZXZpZXdDb3VudDogUEFHRV9TSVpFLFxuICAgICAgcmV2aWV3Q3Vyc29yOiBudWxsLFxuICAgICAgdGhyZWFkQ291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHRocmVhZEN1cnNvcjogbnVsbCxcbiAgICAgIGNvbW1lbnRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgY29tbWVudEN1cnNvcjogbnVsbCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWxheUVudmlyb25tZW50LlByb3ZpZGVyIHZhbHVlPXtlbnZpcm9ubWVudH0+XG4gICAgICAgIDxRdWVyeVJlbmRlcmVyXG4gICAgICAgICAgZW52aXJvbm1lbnQ9e2Vudmlyb25tZW50fVxuICAgICAgICAgIHF1ZXJ5PXtxdWVyeX1cbiAgICAgICAgICB2YXJpYWJsZXM9e3ZhcmlhYmxlc31cbiAgICAgICAgICByZW5kZXI9e3F1ZXJ5UmVzdWx0ID0+IHRoaXMucmVuZGVyV2l0aFF1ZXJ5KHF1ZXJ5UmVzdWx0LCB7cmVwb0RhdGEsIHBhdGNofSl9XG4gICAgICAgIC8+XG4gICAgICA8L1JlbGF5RW52aXJvbm1lbnQuUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhRdWVyeSh7ZXJyb3IsIHByb3BzLCByZXRyeX0sIHtyZXBvRGF0YSwgcGF0Y2h9KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UXVlcnlFcnJvclZpZXdcbiAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgbG9naW49e3RoaXMuaGFuZGxlTG9naW59XG4gICAgICAgICAgcmV0cnk9e3JldHJ5fVxuICAgICAgICAgIGxvZ291dD17dGhpcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghcHJvcHMgfHwgIXJlcG9EYXRhIHx8ICFwYXRjaCkge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nVmlldyAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyXG4gICAgICAgIHB1bGxSZXF1ZXN0PXtwcm9wcy5yZXBvc2l0b3J5LnB1bGxSZXF1ZXN0fVxuICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9PlxuICAgICAgICB7KHtlcnJvcnMsIHN1bW1hcmllcywgY29tbWVudFRocmVhZHMsIHJlZmV0Y2h9KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9ycyAmJiBlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9ycy5tYXAoKGVyciwgaSkgPT4gKFxuICAgICAgICAgICAgICA8RXJyb3JWaWV3XG4gICAgICAgICAgICAgICAga2V5PXtgZXJyb3ItJHtpfWB9XG4gICAgICAgICAgICAgICAgdGl0bGU9XCJQYWdpbmF0aW9uIGVycm9yXCJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbnM9e1tlcnIuc3RhY2tdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGFnZ3JlZ2F0aW9uUmVzdWx0ID0ge3N1bW1hcmllcywgY29tbWVudFRocmVhZHMsIHJlZmV0Y2h9O1xuXG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyV2l0aFJlc3VsdCh7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvblJlc3VsdCxcbiAgICAgICAgICAgIHF1ZXJ5UHJvcHM6IHByb3BzLFxuICAgICAgICAgICAgcmVwb0RhdGEsXG4gICAgICAgICAgICBwYXRjaCxcbiAgICAgICAgICAgIHJlZmV0Y2gsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH19XG4gICAgICA8L0FnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUmVzdWx0KHthZ2dyZWdhdGlvblJlc3VsdCwgcXVlcnlQcm9wcywgcmVwb0RhdGEsIHBhdGNofSkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWVudFBvc2l0aW9uaW5nQ29udGFpbmVyXG4gICAgICAgIG11bHRpRmlsZVBhdGNoPXtwYXRjaH1cbiAgICAgICAgey4uLmFnZ3JlZ2F0aW9uUmVzdWx0fVxuICAgICAgICBwckNvbW1pdFNoYT17cXVlcnlQcm9wcy5yZXBvc2l0b3J5LnB1bGxSZXF1ZXN0LmhlYWRSZWZPaWR9XG4gICAgICAgIGxvY2FsUmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fT5cbiAgICAgICAge2NvbW1lbnRUcmFuc2xhdGlvbnMgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UmV2aWV3c0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgICAgIHsuLi5hZ2dyZWdhdGlvblJlc3VsdH1cbiAgICAgICAgICAgICAgY29tbWVudFRyYW5zbGF0aW9ucz17Y29tbWVudFRyYW5zbGF0aW9uc31cbiAgICAgICAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgICAgIG11bHRpRmlsZVBhdGNoPXtwYXRjaH1cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeT17cXVlcnlQcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgICBwdWxsUmVxdWVzdD17cXVlcnlQcm9wcy5yZXBvc2l0b3J5LnB1bGxSZXF1ZXN0fVxuICAgICAgICAgICAgICB2aWV3ZXI9e3F1ZXJ5UHJvcHMudmlld2VyfVxuICAgICAgICAgICAgICB7Li4ucmVwb0RhdGF9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH19XG4gICAgICA8L0NvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lcj5cbiAgICApO1xuICB9XG5cbiAgZmV0Y2hUb2tlbiA9IGxvZ2luTW9kZWwgPT4gbG9naW5Nb2RlbC5nZXRUb2tlbih0aGlzLnByb3BzLmVuZHBvaW50LmdldExvZ2luQWNjb3VudCgpKTtcblxuICBmZXRjaFJlcG9zaXRvcnlEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIGJyYW5jaGVzOiByZXBvc2l0b3J5LmdldEJyYW5jaGVzKCksXG4gICAgICByZW1vdGVzOiByZXBvc2l0b3J5LmdldFJlbW90ZXMoKSxcbiAgICAgIGlzQWJzZW50OiByZXBvc2l0b3J5LmlzQWJzZW50KCksXG4gICAgICBpc0xvYWRpbmc6IHJlcG9zaXRvcnkuaXNMb2FkaW5nKCksXG4gICAgICBpc1ByZXNlbnQ6IHJlcG9zaXRvcnkuaXNQcmVzZW50KCksXG4gICAgICBpc01lcmdpbmc6IHJlcG9zaXRvcnkuaXNNZXJnaW5nKCksXG4gICAgICBpc1JlYmFzaW5nOiByZXBvc2l0b3J5LmlzUmViYXNpbmcoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUxvZ2luID0gdG9rZW4gPT4gdGhpcy5wcm9wcy5sb2dpbk1vZGVsLnNldFRva2VuKHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCksIHRva2VuKTtcblxuICBoYW5kbGVMb2dvdXQgPSAoKSA9PiB0aGlzLnByb3BzLmxvZ2luTW9kZWwucmVtb3ZlVG9rZW4odGhpcy5wcm9wcy5lbmRwb2ludC5nZXRMb2dpbkFjY291bnQoKSk7XG5cbiAgaGFuZGxlVG9rZW5SZXRyeSA9ICgpID0+IHRoaXMucHJvcHMubG9naW5Nb2RlbC5kaWRVcGRhdGUoKTtcbn1cbiJdfQ==