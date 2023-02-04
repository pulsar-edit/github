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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ReviewsContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderWithToken", token => {
      if (!token) {
        return _react.default.createElement(_loadingView.default, null);
      }
      if (token instanceof Error) {
        return _react.default.createElement(_queryErrorView.default, {
          error: token,
          retry: this.handleTokenRetry,
          login: this.handleLogin,
          logout: this.handleLogout
        });
      }
      if (token === _keytarStrategy.UNAUTHENTICATED) {
        return _react.default.createElement(_githubLoginView.default, {
          onLogin: this.handleLogin
        });
      }
      if (token === _keytarStrategy.INSUFFICIENT) {
        return _react.default.createElement(_githubLoginView.default, {
          onLogin: this.handleLogin
        }, _react.default.createElement("p", null, "Your token no longer has sufficient authorizations. Please re-authenticate and generate a new one."));
      }
      return _react.default.createElement(_prPatchContainer.default, {
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
    return _react.default.createElement(_observeModel.default, {
      model: this.props.loginModel,
      fetchData: this.fetchToken
    }, this.renderWithToken);
  }
  renderWithPatch(error, {
    token,
    patch
  }) {
    if (error) {
      return _react.default.createElement(_errorView.default, {
        descriptions: [error]
      });
    }
    return _react.default.createElement(_observeModel.default, {
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
    return _react.default.createElement(_relayEnvironment.default.Provider, {
      value: environment
    }, _react.default.createElement(_reactRelay.QueryRenderer, {
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
      return _react.default.createElement(_queryErrorView.default, {
        error: error,
        login: this.handleLogin,
        retry: retry,
        logout: this.handleLogout
      });
    }
    if (!props || !repoData || !patch) {
      return _react.default.createElement(_loadingView.default, null);
    }
    return _react.default.createElement(_aggregatedReviewsContainer.default, {
      pullRequest: props.repository.pullRequest,
      reportRelayError: this.props.reportRelayError
    }, ({
      errors,
      summaries,
      commentThreads,
      refetch
    }) => {
      if (errors && errors.length > 0) {
        return errors.map((err, i) => _react.default.createElement(_errorView.default, {
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
    return _react.default.createElement(_commentPositioningContainer.default, _extends({
      multiFilePatch: patch
    }, aggregationResult, {
      prCommitSha: queryProps.repository.pullRequest.headRefOid,
      localRepository: this.props.repository
    }), commentTranslations => {
      return _react.default.createElement(_reviewsController.default, _extends({}, this.props, aggregationResult, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXZpZXdzQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ0b2tlbiIsIkVycm9yIiwiaGFuZGxlVG9rZW5SZXRyeSIsImhhbmRsZUxvZ2luIiwiaGFuZGxlTG9nb3V0IiwiVU5BVVRIRU5USUNBVEVEIiwiSU5TVUZGSUNJRU5UIiwicHJvcHMiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJlbmRwb2ludCIsIkluZmluaXR5IiwiZXJyb3IiLCJwYXRjaCIsInJlbmRlcldpdGhQYXRjaCIsImxvZ2luTW9kZWwiLCJnZXRUb2tlbiIsImdldExvZ2luQWNjb3VudCIsInJlcG9zaXRvcnkiLCJ5dWJpa2lyaSIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJyZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImlzQWJzZW50IiwiaXNMb2FkaW5nIiwiaXNQcmVzZW50IiwiaXNNZXJnaW5nIiwiaXNSZWJhc2luZyIsInNldFRva2VuIiwicmVtb3ZlVG9rZW4iLCJkaWRVcGRhdGUiLCJyZW5kZXIiLCJmZXRjaFRva2VuIiwicmVuZGVyV2l0aFRva2VuIiwiZmV0Y2hSZXBvc2l0b3J5RGF0YSIsInJlcG9EYXRhIiwicmVuZGVyV2l0aFJlcG9zaXRvcnlEYXRhIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJxdWVyeSIsInZhcmlhYmxlcyIsInJlcG9Pd25lciIsInJlcG9OYW1lIiwicHJOdW1iZXIiLCJyZXZpZXdDb3VudCIsIlBBR0VfU0laRSIsInJldmlld0N1cnNvciIsInRocmVhZENvdW50IiwidGhyZWFkQ3Vyc29yIiwiY29tbWVudENvdW50IiwiY29tbWVudEN1cnNvciIsInF1ZXJ5UmVzdWx0IiwicmVuZGVyV2l0aFF1ZXJ5IiwicmV0cnkiLCJwdWxsUmVxdWVzdCIsInJlcG9ydFJlbGF5RXJyb3IiLCJlcnJvcnMiLCJzdW1tYXJpZXMiLCJjb21tZW50VGhyZWFkcyIsInJlZmV0Y2giLCJsZW5ndGgiLCJtYXAiLCJlcnIiLCJpIiwic3RhY2siLCJhZ2dyZWdhdGlvblJlc3VsdCIsInJlbmRlcldpdGhSZXN1bHQiLCJxdWVyeVByb3BzIiwiaGVhZFJlZk9pZCIsImNvbW1lbnRUcmFuc2xhdGlvbnMiLCJ2aWV3ZXIiLCJFbmRwb2ludFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsIndvcmtkaXIiLCJvYmplY3QiLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJ3b3JrZGlyQ29udGV4dFBvb2wiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsImluaXRUaHJlYWRJRCIsIndvcmtzcGFjZSIsImNvbmZpZyIsImNvbW1hbmRzIiwidG9vbHRpcHMiLCJjb25maXJtIiwiZnVuYyJdLCJzb3VyY2VzIjpbInJldmlld3MtY29udGFpbmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1BBR0VfU0laRX0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge0dpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZSwgV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtVTkFVVEhFTlRJQ0FURUQsIElOU1VGRklDSUVOVH0gZnJvbSAnLi4vc2hhcmVkL2tleXRhci1zdHJhdGVneSc7XG5pbXBvcnQgUHVsbFJlcXVlc3RQYXRjaENvbnRhaW5lciBmcm9tICcuL3ByLXBhdGNoLWNvbnRhaW5lcic7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IExvYWRpbmdWaWV3IGZyb20gJy4uL3ZpZXdzL2xvYWRpbmctdmlldyc7XG5pbXBvcnQgR2l0aHViTG9naW5WaWV3IGZyb20gJy4uL3ZpZXdzL2dpdGh1Yi1sb2dpbi12aWV3JztcbmltcG9ydCBFcnJvclZpZXcgZnJvbSAnLi4vdmlld3MvZXJyb3Itdmlldyc7XG5pbXBvcnQgUXVlcnlFcnJvclZpZXcgZnJvbSAnLi4vdmlld3MvcXVlcnktZXJyb3Itdmlldyc7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQgUmVsYXlFbnZpcm9ubWVudCBmcm9tICcuLi92aWV3cy9yZWxheS1lbnZpcm9ubWVudCc7XG5pbXBvcnQgUmV2aWV3c0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvcmV2aWV3cy1jb250cm9sbGVyJztcbmltcG9ydCBBZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lciBmcm9tICcuL2FnZ3JlZ2F0ZWQtcmV2aWV3cy1jb250YWluZXInO1xuaW1wb3J0IENvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lciBmcm9tICcuL2NvbW1lbnQtcG9zaXRpb25pbmctY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmV2aWV3c0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQ29ubmVjdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBQdWxsIHJlcXVlc3Qgc2VsZWN0aW9uIGNyaXRlcmlhXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUGFja2FnZSBtb2RlbHNcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpckNvbnRleHRQb29sOiBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGluaXRUaHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hUb2tlbn0+XG4gICAgICAgIHt0aGlzLnJlbmRlcldpdGhUb2tlbn1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoVG9rZW4gPSB0b2tlbiA9PiB7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nVmlldyAvPjtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFF1ZXJ5RXJyb3JWaWV3XG4gICAgICAgICAgZXJyb3I9e3Rva2VufVxuICAgICAgICAgIHJldHJ5PXt0aGlzLmhhbmRsZVRva2VuUmV0cnl9XG4gICAgICAgICAgbG9naW49e3RoaXMuaGFuZGxlTG9naW59XG4gICAgICAgICAgbG9nb3V0PXt0aGlzLmhhbmRsZUxvZ291dH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRva2VuID09PSBVTkFVVEhFTlRJQ0FURUQpIHtcbiAgICAgIHJldHVybiA8R2l0aHViTG9naW5WaWV3IG9uTG9naW49e3RoaXMuaGFuZGxlTG9naW59IC8+O1xuICAgIH1cblxuICAgIGlmICh0b2tlbiA9PT0gSU5TVUZGSUNJRU5UKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8R2l0aHViTG9naW5WaWV3IG9uTG9naW49e3RoaXMuaGFuZGxlTG9naW59PlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgWW91ciB0b2tlbiBubyBsb25nZXIgaGFzIHN1ZmZpY2llbnQgYXV0aG9yaXphdGlvbnMuIFBsZWFzZSByZS1hdXRoZW50aWNhdGUgYW5kIGdlbmVyYXRlIGEgbmV3IG9uZS5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvR2l0aHViTG9naW5WaWV3PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFB1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXJcbiAgICAgICAgb3duZXI9e3RoaXMucHJvcHMub3duZXJ9XG4gICAgICAgIHJlcG89e3RoaXMucHJvcHMucmVwb31cbiAgICAgICAgbnVtYmVyPXt0aGlzLnByb3BzLm51bWJlcn1cbiAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgICAgbGFyZ2VEaWZmVGhyZXNob2xkPXtJbmZpbml0eX0+XG4gICAgICAgIHsoZXJyb3IsIHBhdGNoKSA9PiB0aGlzLnJlbmRlcldpdGhQYXRjaChlcnJvciwge3Rva2VuLCBwYXRjaH0pfVxuICAgICAgPC9QdWxsUmVxdWVzdFBhdGNoQ29udGFpbmVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUGF0Y2goZXJyb3IsIHt0b2tlbiwgcGF0Y2h9KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yVmlldyBkZXNjcmlwdGlvbnM9e1tlcnJvcl19IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaFJlcG9zaXRvcnlEYXRhfT5cbiAgICAgICAge3JlcG9EYXRhID0+IHRoaXMucmVuZGVyV2l0aFJlcG9zaXRvcnlEYXRhKHJlcG9EYXRhLCB7dG9rZW4sIHBhdGNofSl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFJlcG9zaXRvcnlEYXRhKHJlcG9EYXRhLCB7dG9rZW4sIHBhdGNofSkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdCh0aGlzLnByb3BzLmVuZHBvaW50LCB0b2tlbik7XG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgcmV2aWV3c0NvbnRhaW5lclF1ZXJ5XG4gICAgICAoXG4gICAgICAgICRyZXBvT3duZXI6IFN0cmluZyFcbiAgICAgICAgJHJlcG9OYW1lOiBTdHJpbmchXG4gICAgICAgICRwck51bWJlcjogSW50IVxuICAgICAgICAkcmV2aWV3Q291bnQ6IEludCFcbiAgICAgICAgJHJldmlld0N1cnNvcjogU3RyaW5nXG4gICAgICAgICR0aHJlYWRDb3VudDogSW50IVxuICAgICAgICAkdGhyZWFkQ3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGNvbW1lbnRDb3VudDogSW50IVxuICAgICAgICAkY29tbWVudEN1cnNvcjogU3RyaW5nXG4gICAgICApIHtcbiAgICAgICAgcmVwb3NpdG9yeShvd25lcjogJHJlcG9Pd25lciwgbmFtZTogJHJlcG9OYW1lKSB7XG4gICAgICAgICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeVxuICAgICAgICAgIHB1bGxSZXF1ZXN0KG51bWJlcjogJHByTnVtYmVyKSB7XG4gICAgICAgICAgICBoZWFkUmVmT2lkXG4gICAgICAgICAgICAuLi5hZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgICByZXZpZXdDb3VudDogJHJldmlld0NvdW50XG4gICAgICAgICAgICAgIHJldmlld0N1cnNvcjogJHJldmlld0N1cnNvclxuICAgICAgICAgICAgICB0aHJlYWRDb3VudDogJHRocmVhZENvdW50XG4gICAgICAgICAgICAgIHRocmVhZEN1cnNvcjogJHRocmVhZEN1cnNvclxuICAgICAgICAgICAgICBjb21tZW50Q291bnQ6ICRjb21tZW50Q291bnRcbiAgICAgICAgICAgICAgY29tbWVudEN1cnNvcjogJGNvbW1lbnRDdXJzb3JcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC4uLnJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmlld2VyIHtcbiAgICAgICAgICAuLi5yZXZpZXdzQ29udHJvbGxlcl92aWV3ZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgcmVwb093bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgcmVwb05hbWU6IHRoaXMucHJvcHMucmVwbyxcbiAgICAgIHByTnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgIHJldmlld0NvdW50OiBQQUdFX1NJWkUsXG4gICAgICByZXZpZXdDdXJzb3I6IG51bGwsXG4gICAgICB0aHJlYWRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgdGhyZWFkQ3Vyc29yOiBudWxsLFxuICAgICAgY29tbWVudENvdW50OiBQQUdFX1NJWkUsXG4gICAgICBjb21tZW50Q3Vyc29yOiBudWxsLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJlbGF5RW52aXJvbm1lbnQuUHJvdmlkZXIgdmFsdWU9e2Vudmlyb25tZW50fT5cbiAgICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICAgIHZhcmlhYmxlcz17dmFyaWFibGVzfVxuICAgICAgICAgIHJlbmRlcj17cXVlcnlSZXN1bHQgPT4gdGhpcy5yZW5kZXJXaXRoUXVlcnkocXVlcnlSZXN1bHQsIHtyZXBvRGF0YSwgcGF0Y2h9KX1cbiAgICAgICAgLz5cbiAgICAgIDwvUmVsYXlFbnZpcm9ubWVudC5Qcm92aWRlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFF1ZXJ5KHtlcnJvciwgcHJvcHMsIHJldHJ5fSwge3JlcG9EYXRhLCBwYXRjaH0pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxRdWVyeUVycm9yVmlld1xuICAgICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgICBsb2dpbj17dGhpcy5oYW5kbGVMb2dpbn1cbiAgICAgICAgICByZXRyeT17cmV0cnl9XG4gICAgICAgICAgbG9nb3V0PXt0aGlzLmhhbmRsZUxvZ291dH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcyB8fCAhcmVwb0RhdGEgfHwgIXBhdGNoKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmdWaWV3IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8QWdncmVnYXRlZFJldmlld3NDb250YWluZXJcbiAgICAgICAgcHVsbFJlcXVlc3Q9e3Byb3BzLnJlcG9zaXRvcnkucHVsbFJlcXVlc3R9XG4gICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn0+XG4gICAgICAgIHsoe2Vycm9ycywgc3VtbWFyaWVzLCBjb21tZW50VGhyZWFkcywgcmVmZXRjaH0pID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3JzICYmIGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLm1hcCgoZXJyLCBpKSA9PiAoXG4gICAgICAgICAgICAgIDxFcnJvclZpZXdcbiAgICAgICAgICAgICAgICBrZXk9e2BlcnJvci0ke2l9YH1cbiAgICAgICAgICAgICAgICB0aXRsZT1cIlBhZ2luYXRpb24gZXJyb3JcIlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9ucz17W2Vyci5zdGFja119XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgYWdncmVnYXRpb25SZXN1bHQgPSB7c3VtbWFyaWVzLCBjb21tZW50VGhyZWFkcywgcmVmZXRjaH07XG5cbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJXaXRoUmVzdWx0KHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uUmVzdWx0LFxuICAgICAgICAgICAgcXVlcnlQcm9wczogcHJvcHMsXG4gICAgICAgICAgICByZXBvRGF0YSxcbiAgICAgICAgICAgIHBhdGNoLFxuICAgICAgICAgICAgcmVmZXRjaCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfX1cbiAgICAgIDwvQWdncmVnYXRlZFJldmlld3NDb250YWluZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhSZXN1bHQoe2FnZ3JlZ2F0aW9uUmVzdWx0LCBxdWVyeVByb3BzLCByZXBvRGF0YSwgcGF0Y2h9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21tZW50UG9zaXRpb25pbmdDb250YWluZXJcbiAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e3BhdGNofVxuICAgICAgICB7Li4uYWdncmVnYXRpb25SZXN1bHR9XG4gICAgICAgIHByQ29tbWl0U2hhPXtxdWVyeVByb3BzLnJlcG9zaXRvcnkucHVsbFJlcXVlc3QuaGVhZFJlZk9pZH1cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9PlxuICAgICAgICB7Y29tbWVudFRyYW5zbGF0aW9ucyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxSZXZpZXdzQ29udHJvbGxlclxuICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgey4uLmFnZ3JlZ2F0aW9uUmVzdWx0fVxuICAgICAgICAgICAgICBjb21tZW50VHJhbnNsYXRpb25zPXtjb21tZW50VHJhbnNsYXRpb25zfVxuICAgICAgICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e3BhdGNofVxuICAgICAgICAgICAgICByZXBvc2l0b3J5PXtxdWVyeVByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgICAgIHB1bGxSZXF1ZXN0PXtxdWVyeVByb3BzLnJlcG9zaXRvcnkucHVsbFJlcXVlc3R9XG4gICAgICAgICAgICAgIHZpZXdlcj17cXVlcnlQcm9wcy52aWV3ZXJ9XG4gICAgICAgICAgICAgIHsuLi5yZXBvRGF0YX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvQ29tbWVudFBvc2l0aW9uaW5nQ29udGFpbmVyPlxuICAgICk7XG4gIH1cblxuICBmZXRjaFRva2VuID0gbG9naW5Nb2RlbCA9PiBsb2dpbk1vZGVsLmdldFRva2VuKHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCkpO1xuXG4gIGZldGNoUmVwb3NpdG9yeURhdGEgPSByZXBvc2l0b3J5ID0+IHtcbiAgICByZXR1cm4geXViaWtpcmkoe1xuICAgICAgYnJhbmNoZXM6IHJlcG9zaXRvcnkuZ2V0QnJhbmNoZXMoKSxcbiAgICAgIHJlbW90ZXM6IHJlcG9zaXRvcnkuZ2V0UmVtb3RlcygpLFxuICAgICAgaXNBYnNlbnQ6IHJlcG9zaXRvcnkuaXNBYnNlbnQoKSxcbiAgICAgIGlzTG9hZGluZzogcmVwb3NpdG9yeS5pc0xvYWRpbmcoKSxcbiAgICAgIGlzUHJlc2VudDogcmVwb3NpdG9yeS5pc1ByZXNlbnQoKSxcbiAgICAgIGlzTWVyZ2luZzogcmVwb3NpdG9yeS5pc01lcmdpbmcoKSxcbiAgICAgIGlzUmViYXNpbmc6IHJlcG9zaXRvcnkuaXNSZWJhc2luZygpLFxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlTG9naW4gPSB0b2tlbiA9PiB0aGlzLnByb3BzLmxvZ2luTW9kZWwuc2V0VG9rZW4odGhpcy5wcm9wcy5lbmRwb2ludC5nZXRMb2dpbkFjY291bnQoKSwgdG9rZW4pO1xuXG4gIGhhbmRsZUxvZ291dCA9ICgpID0+IHRoaXMucHJvcHMubG9naW5Nb2RlbC5yZW1vdmVUb2tlbih0aGlzLnByb3BzLmVuZHBvaW50LmdldExvZ2luQWNjb3VudCgpKTtcblxuICBoYW5kbGVUb2tlblJldHJ5ID0gKCkgPT4gdGhpcy5wcm9wcy5sb2dpbk1vZGVsLmRpZFVwZGF0ZSgpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBMEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTNELE1BQU1BLGdCQUFnQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQUFBO0lBQUE7SUFBQSx5Q0FvQzFDQyxLQUFLLElBQUk7TUFDekIsSUFBSSxDQUFDQSxLQUFLLEVBQUU7UUFDVixPQUFPLDZCQUFDLG9CQUFXLE9BQUc7TUFDeEI7TUFFQSxJQUFJQSxLQUFLLFlBQVlDLEtBQUssRUFBRTtRQUMxQixPQUNFLDZCQUFDLHVCQUFjO1VBQ2IsS0FBSyxFQUFF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