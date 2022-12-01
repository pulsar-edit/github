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

var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));

var _propTypes2 = require("../prop-types");

var _keytarStrategy = require("../shared/keytar-strategy");

var _githubLoginView = _interopRequireDefault(require("../views/github-login-view"));

var _loadingView = _interopRequireDefault(require("../views/loading-view"));

var _queryErrorView = _interopRequireDefault(require("../views/query-error-view"));

var _errorView = _interopRequireDefault(require("../views/error-view"));

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _relayEnvironment = _interopRequireDefault(require("../views/relay-environment"));

var _aggregatedReviewsContainer = _interopRequireDefault(require("./aggregated-reviews-container"));

var _issueishDetailController = _interopRequireDefault(require("../controllers/issueish-detail-controller"));

var _graphql;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IssueishDetailContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderWithToken", tokenData => {
      const token = tokenData && tokenData.token;

      if (token instanceof Error) {
        return _react.default.createElement(_queryErrorView.default, {
          error: token,
          login: this.handleLogin,
          retry: this.handleTokenRetry,
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

      return _react.default.createElement(_observeModel.default, {
        model: this.props.repository,
        fetchData: this.fetchRepositoryData
      }, repoData => this.renderWithRepositoryData(token, repoData));
    });

    _defineProperty(this, "fetchToken", loginModel => {
      return (0, _yubikiri.default)({
        token: loginModel.getToken(this.props.endpoint.getLoginAccount())
      });
    });

    _defineProperty(this, "fetchRepositoryData", repository => {
      return (0, _yubikiri.default)({
        branches: repository.getBranches(),
        remotes: repository.getRemotes(),
        isMerging: repository.isMerging(),
        isRebasing: repository.isRebasing(),
        isAbsent: repository.isAbsent(),
        isLoading: repository.isLoading(),
        isPresent: repository.isPresent()
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

  renderWithRepositoryData(token, repoData) {
    if (!token) {
      return _react.default.createElement(_loadingView.default, null);
    }

    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, token);

    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/issueishDetailContainerQuery.graphql");

      if (node.hash && node.hash !== "c65534cd8bf43f640862f89187b6ff64") {
        console.error("The definition of 'issueishDetailContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }

      return require("./__generated__/issueishDetailContainerQuery.graphql");
    });

    const variables = {
      repoOwner: this.props.owner,
      repoName: this.props.repo,
      issueishNumber: this.props.issueishNumber,
      timelineCount: _helpers.PAGE_SIZE,
      timelineCursor: null,
      commitCount: _helpers.PAGE_SIZE,
      commitCursor: null,
      reviewCount: _helpers.PAGE_SIZE,
      reviewCursor: null,
      threadCount: _helpers.PAGE_SIZE,
      threadCursor: null,
      commentCount: _helpers.PAGE_SIZE,
      commentCursor: null,
      checkSuiteCount: _helpers.CHECK_SUITE_PAGE_SIZE,
      checkSuiteCursor: null,
      checkRunCount: _helpers.CHECK_RUN_PAGE_SIZE,
      checkRunCursor: null
    };
    return _react.default.createElement(_relayEnvironment.default.Provider, {
      value: environment
    }, _react.default.createElement(_reactRelay.QueryRenderer, {
      environment: environment,
      query: query,
      variables: variables,
      render: queryResult => this.renderWithQueryResult(token, repoData, queryResult)
    }));
  }

  renderWithQueryResult(token, repoData, {
    error,
    props,
    retry
  }) {
    if (error) {
      return _react.default.createElement(_queryErrorView.default, {
        error: error,
        login: this.handleLogin,
        retry: retry,
        logout: this.handleLogout
      });
    }

    if (!props || !repoData) {
      return _react.default.createElement(_loadingView.default, null);
    }

    if (props.repository.issueish.__typename === 'PullRequest') {
      return _react.default.createElement(_aggregatedReviewsContainer.default, {
        pullRequest: props.repository.issueish,
        reportRelayError: this.props.reportRelayError
      }, aggregatedReviews => this.renderWithCommentResult(token, repoData, {
        props,
        retry
      }, aggregatedReviews));
    } else {
      return this.renderWithCommentResult(token, repoData, {
        props,
        retry
      }, {
        errors: [],
        commentThreads: [],
        loading: false
      });
    }
  }

  renderWithCommentResult(token, repoData, {
    props,
    retry
  }, {
    errors,
    commentThreads,
    loading
  }) {
    const nonEmptyThreads = commentThreads.filter(each => each.comments && each.comments.length > 0);
    const totalCount = nonEmptyThreads.length;
    const resolvedCount = nonEmptyThreads.filter(each => each.thread.isResolved).length;

    if (errors && errors.length > 0) {
      const descriptions = errors.map(error => error.toString());
      return _react.default.createElement(_errorView.default, {
        title: "Unable to fetch review comments",
        descriptions: descriptions,
        retry: retry,
        logout: this.handleLogout
      });
    }

    return _react.default.createElement(_issueishDetailController.default, _extends({}, props, repoData, {
      reviewCommentsLoading: loading,
      reviewCommentsTotalCount: totalCount,
      reviewCommentsResolvedCount: resolvedCount,
      reviewCommentThreads: nonEmptyThreads,
      token: token,
      localRepository: this.props.repository,
      workdirPath: this.props.repository.getWorkingDirectoryPath(),
      issueishNumber: this.props.issueishNumber,
      onTitleChange: this.props.onTitleChange,
      switchToIssueish: this.props.switchToIssueish,
      initChangedFilePath: this.props.initChangedFilePath,
      initChangedFilePosition: this.props.initChangedFilePosition,
      selectedTab: this.props.selectedTab,
      onTabSelected: this.props.onTabSelected,
      onOpenFilesTab: this.props.onOpenFilesTab,
      endpoint: this.props.endpoint,
      reportRelayError: this.props.reportRelayError,
      workspace: this.props.workspace,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      tooltips: this.props.tooltips,
      config: this.props.config,
      itemType: this.props.itemType,
      destroy: this.props.destroy,
      refEditor: this.props.refEditor
    }));
  }

}

exports.default = IssueishDetailContainer;

_defineProperty(IssueishDetailContainer, "propTypes", {
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  // Issueish selection criteria
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  issueishNumber: _propTypes.default.number.isRequired,
  // For opening files changed tab
  initChangedFilePath: _propTypes.default.string,
  initChangedFilePosition: _propTypes.default.number,
  selectedTab: _propTypes.default.number.isRequired,
  onTabSelected: _propTypes.default.func.isRequired,
  onOpenFilesTab: _propTypes.default.func.isRequired,
  // Package models
  repository: _propTypes.default.object.isRequired,
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  // Action methods
  switchToIssueish: _propTypes.default.func.isRequired,
  onTitleChange: _propTypes.default.func.isRequired,
  destroy: _propTypes.default.func.isRequired,
  reportRelayError: _propTypes.default.func.isRequired,
  // Item context
  itemType: _propTypes2.ItemTypePropType.isRequired,
  refEditor: _propTypes2.RefHolderPropType.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2lzc3VlaXNoLWRldGFpbC1jb250YWluZXIuanMiXSwibmFtZXMiOlsiSXNzdWVpc2hEZXRhaWxDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInRva2VuRGF0YSIsInRva2VuIiwiRXJyb3IiLCJoYW5kbGVMb2dpbiIsImhhbmRsZVRva2VuUmV0cnkiLCJoYW5kbGVMb2dvdXQiLCJVTkFVVEhFTlRJQ0FURUQiLCJJTlNVRkZJQ0lFTlQiLCJwcm9wcyIsInJlcG9zaXRvcnkiLCJmZXRjaFJlcG9zaXRvcnlEYXRhIiwicmVwb0RhdGEiLCJyZW5kZXJXaXRoUmVwb3NpdG9yeURhdGEiLCJsb2dpbk1vZGVsIiwiZ2V0VG9rZW4iLCJlbmRwb2ludCIsImdldExvZ2luQWNjb3VudCIsImJyYW5jaGVzIiwiZ2V0QnJhbmNoZXMiLCJyZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImlzTWVyZ2luZyIsImlzUmViYXNpbmciLCJpc0Fic2VudCIsImlzTG9hZGluZyIsImlzUHJlc2VudCIsInNldFRva2VuIiwicmVtb3ZlVG9rZW4iLCJkaWRVcGRhdGUiLCJyZW5kZXIiLCJmZXRjaFRva2VuIiwicmVuZGVyV2l0aFRva2VuIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJxdWVyeSIsInZhcmlhYmxlcyIsInJlcG9Pd25lciIsIm93bmVyIiwicmVwb05hbWUiLCJyZXBvIiwiaXNzdWVpc2hOdW1iZXIiLCJ0aW1lbGluZUNvdW50IiwiUEFHRV9TSVpFIiwidGltZWxpbmVDdXJzb3IiLCJjb21taXRDb3VudCIsImNvbW1pdEN1cnNvciIsInJldmlld0NvdW50IiwicmV2aWV3Q3Vyc29yIiwidGhyZWFkQ291bnQiLCJ0aHJlYWRDdXJzb3IiLCJjb21tZW50Q291bnQiLCJjb21tZW50Q3Vyc29yIiwiY2hlY2tTdWl0ZUNvdW50IiwiQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFIiwiY2hlY2tTdWl0ZUN1cnNvciIsImNoZWNrUnVuQ291bnQiLCJDSEVDS19SVU5fUEFHRV9TSVpFIiwiY2hlY2tSdW5DdXJzb3IiLCJxdWVyeVJlc3VsdCIsInJlbmRlcldpdGhRdWVyeVJlc3VsdCIsImVycm9yIiwicmV0cnkiLCJpc3N1ZWlzaCIsIl9fdHlwZW5hbWUiLCJyZXBvcnRSZWxheUVycm9yIiwiYWdncmVnYXRlZFJldmlld3MiLCJyZW5kZXJXaXRoQ29tbWVudFJlc3VsdCIsImVycm9ycyIsImNvbW1lbnRUaHJlYWRzIiwibG9hZGluZyIsIm5vbkVtcHR5VGhyZWFkcyIsImZpbHRlciIsImVhY2giLCJjb21tZW50cyIsImxlbmd0aCIsInRvdGFsQ291bnQiLCJyZXNvbHZlZENvdW50IiwidGhyZWFkIiwiaXNSZXNvbHZlZCIsImRlc2NyaXB0aW9ucyIsIm1hcCIsInRvU3RyaW5nIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJvblRpdGxlQ2hhbmdlIiwic3dpdGNoVG9Jc3N1ZWlzaCIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsInNlbGVjdGVkVGFiIiwib25UYWJTZWxlY3RlZCIsIm9uT3BlbkZpbGVzVGFiIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwidG9vbHRpcHMiLCJjb25maWciLCJpdGVtVHlwZSIsImRlc3Ryb3kiLCJyZWZFZGl0b3IiLCJFbmRwb2ludFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsIm51bWJlciIsImZ1bmMiLCJvYmplY3QiLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJJdGVtVHlwZVByb3BUeXBlIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7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QUFpQkwsVUF4QlY7QUF5QmpCTCxFQUFBQSxNQUFNLEVBQUVNLG1CQUFVSSxNQUFWLENBQWlCTCxVQXpCUjtBQTJCakI7QUFDQWYsRUFBQUEsZ0JBQWdCLEVBQUVnQixtQkFBVUcsSUFBVixDQUFlSixVQTVCaEI7QUE2QmpCaEIsRUFBQUEsYUFBYSxFQUFFaUIsbUJBQVVHLElBQVYsQ0FBZUosVUE3QmI7QUE4QmpCSCxFQUFBQSxPQUFPLEVBQUVJLG1CQUFVRyxJQUFWLENBQWVKLFVBOUJQO0FBK0JqQm5DLEVBQUFBLGdCQUFnQixFQUFFb0MsbUJBQVVHLElBQVYsQ0FBZUosVUEvQmhCO0FBaUNqQjtBQUNBSixFQUFBQSxRQUFRLEVBQUVXLDZCQUFpQlAsVUFsQ1Y7QUFtQ2pCRixFQUFBQSxTQUFTLEVBQUVVLDhCQUFrQlI7QUFuQ1osQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge1BBR0VfU0laRSwgQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFLCBDSEVDS19SVU5fUEFHRV9TSVpFfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIgZnJvbSAnLi4vcmVsYXktbmV0d29yay1sYXllci1tYW5hZ2VyJztcbmltcG9ydCB7R2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLCBJdGVtVHlwZVByb3BUeXBlLCBFbmRwb2ludFByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge1VOQVVUSEVOVElDQVRFRCwgSU5TVUZGSUNJRU5UfSBmcm9tICcuLi9zaGFyZWQva2V5dGFyLXN0cmF0ZWd5JztcbmltcG9ydCBHaXRodWJMb2dpblZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0aHViLWxvZ2luLXZpZXcnO1xuaW1wb3J0IExvYWRpbmdWaWV3IGZyb20gJy4uL3ZpZXdzL2xvYWRpbmctdmlldyc7XG5pbXBvcnQgUXVlcnlFcnJvclZpZXcgZnJvbSAnLi4vdmlld3MvcXVlcnktZXJyb3Itdmlldyc7XG5pbXBvcnQgRXJyb3JWaWV3IGZyb20gJy4uL3ZpZXdzL2Vycm9yLXZpZXcnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBSZWxheUVudmlyb25tZW50IGZyb20gJy4uL3ZpZXdzL3JlbGF5LWVudmlyb25tZW50JztcbmltcG9ydCBBZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lciBmcm9tICcuL2FnZ3JlZ2F0ZWQtcmV2aWV3cy1jb250YWluZXInO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9pc3N1ZWlzaC1kZXRhaWwtY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlaXNoRGV0YWlsQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBDb25uZWN0aW9uXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIElzc3VlaXNoIHNlbGVjdGlvbiBjcml0ZXJpYVxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGlzc3VlaXNoTnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBGb3Igb3BlbmluZyBmaWxlcyBjaGFuZ2VkIHRhYlxuICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXG4gICAgc2VsZWN0ZWRUYWI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvblRhYlNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uT3BlbkZpbGVzVGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUGFja2FnZSBtb2RlbHNcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvblRpdGxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEl0ZW0gY29udGV4dFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVmRWRpdG9yOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9IGZldGNoRGF0YT17dGhpcy5mZXRjaFRva2VufT5cbiAgICAgICAge3RoaXMucmVuZGVyV2l0aFRva2VufVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhUb2tlbiA9IHRva2VuRGF0YSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSB0b2tlbkRhdGEgJiYgdG9rZW5EYXRhLnRva2VuO1xuXG4gICAgaWYgKHRva2VuIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxRdWVyeUVycm9yVmlld1xuICAgICAgICAgIGVycm9yPXt0b2tlbn1cbiAgICAgICAgICBsb2dpbj17dGhpcy5oYW5kbGVMb2dpbn1cbiAgICAgICAgICByZXRyeT17dGhpcy5oYW5kbGVUb2tlblJldHJ5fVxuICAgICAgICAgIGxvZ291dD17dGhpcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0b2tlbiA9PT0gVU5BVVRIRU5USUNBVEVEKSB7XG4gICAgICByZXR1cm4gPEdpdGh1YkxvZ2luVmlldyBvbkxvZ2luPXt0aGlzLmhhbmRsZUxvZ2lufSAvPjtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4gPT09IElOU1VGRklDSUVOVCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEdpdGh1YkxvZ2luVmlldyBvbkxvZ2luPXt0aGlzLmhhbmRsZUxvZ2lufT5cbiAgICAgICAgICA8cD5cbiAgICAgICAgICAgIFlvdXIgdG9rZW4gbm8gbG9uZ2VyIGhhcyBzdWZmaWNpZW50IGF1dGhvcml6YXRpb25zLiBQbGVhc2UgcmUtYXV0aGVudGljYXRlIGFuZCBnZW5lcmF0ZSBhIG5ldyBvbmUuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L0dpdGh1YkxvZ2luVmlldz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMucmVwb3NpdG9yeX0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoUmVwb3NpdG9yeURhdGF9PlxuICAgICAgICB7cmVwb0RhdGEgPT4gdGhpcy5yZW5kZXJXaXRoUmVwb3NpdG9yeURhdGEodG9rZW4sIHJlcG9EYXRhKX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUmVwb3NpdG9yeURhdGEodG9rZW4sIHJlcG9EYXRhKSB7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nVmlldyAvPjtcbiAgICB9XG5cbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QodGhpcy5wcm9wcy5lbmRwb2ludCwgdG9rZW4pO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZ3JhcGhxbGBcbiAgICAgIHF1ZXJ5IGlzc3VlaXNoRGV0YWlsQ29udGFpbmVyUXVlcnlcbiAgICAgIChcbiAgICAgICAgJHJlcG9Pd25lcjogU3RyaW5nIVxuICAgICAgICAkcmVwb05hbWU6IFN0cmluZyFcbiAgICAgICAgJGlzc3VlaXNoTnVtYmVyOiBJbnQhXG4gICAgICAgICR0aW1lbGluZUNvdW50OiBJbnQhXG4gICAgICAgICR0aW1lbGluZUN1cnNvcjogU3RyaW5nXG4gICAgICAgICRjb21taXRDb3VudDogSW50IVxuICAgICAgICAkY29tbWl0Q3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJHJldmlld0NvdW50OiBJbnQhXG4gICAgICAgICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkdGhyZWFkQ291bnQ6IEludCFcbiAgICAgICAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICAgICAgICRjb21tZW50Q291bnQ6IEludCFcbiAgICAgICAgJGNvbW1lbnRDdXJzb3I6IFN0cmluZ1xuICAgICAgICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICAgICAgICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgICAgICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICAgICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgICAgICkge1xuICAgICAgICByZXBvc2l0b3J5KG93bmVyOiAkcmVwb093bmVyLCBuYW1lOiAkcmVwb05hbWUpIHtcbiAgICAgICAgICBpc3N1ZWlzaDogaXNzdWVPclB1bGxSZXF1ZXN0KG51bWJlcjogJGlzc3VlaXNoTnVtYmVyKSB7XG4gICAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xuICAgICAgICAgICAgICAuLi5hZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgICAgIHJldmlld0NvdW50OiAkcmV2aWV3Q291bnRcbiAgICAgICAgICAgICAgICByZXZpZXdDdXJzb3I6ICRyZXZpZXdDdXJzb3JcbiAgICAgICAgICAgICAgICB0aHJlYWRDb3VudDogJHRocmVhZENvdW50XG4gICAgICAgICAgICAgICAgdGhyZWFkQ3Vyc29yOiAkdGhyZWFkQ3Vyc29yXG4gICAgICAgICAgICAgICAgY29tbWVudENvdW50OiAkY29tbWVudENvdW50XG4gICAgICAgICAgICAgICAgY29tbWVudEN1cnNvcjogJGNvbW1lbnRDdXJzb3JcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC4uLmlzc3VlaXNoRGV0YWlsQ29udHJvbGxlcl9yZXBvc2l0b3J5IEBhcmd1bWVudHMoXG4gICAgICAgICAgICBpc3N1ZWlzaE51bWJlcjogJGlzc3VlaXNoTnVtYmVyXG4gICAgICAgICAgICB0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudFxuICAgICAgICAgICAgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvclxuICAgICAgICAgICAgY29tbWl0Q291bnQ6ICRjb21taXRDb3VudFxuICAgICAgICAgICAgY29tbWl0Q3Vyc29yOiAkY29tbWl0Q3Vyc29yXG4gICAgICAgICAgICBjaGVja1N1aXRlQ291bnQ6ICRjaGVja1N1aXRlQ291bnRcbiAgICAgICAgICAgIGNoZWNrU3VpdGVDdXJzb3I6ICRjaGVja1N1aXRlQ3Vyc29yXG4gICAgICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICAgICAgY2hlY2tSdW5DdXJzb3I6ICRjaGVja1J1bkN1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgcmVwb093bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgcmVwb05hbWU6IHRoaXMucHJvcHMucmVwbyxcbiAgICAgIGlzc3VlaXNoTnVtYmVyOiB0aGlzLnByb3BzLmlzc3VlaXNoTnVtYmVyLFxuICAgICAgdGltZWxpbmVDb3VudDogUEFHRV9TSVpFLFxuICAgICAgdGltZWxpbmVDdXJzb3I6IG51bGwsXG4gICAgICBjb21taXRDb3VudDogUEFHRV9TSVpFLFxuICAgICAgY29tbWl0Q3Vyc29yOiBudWxsLFxuICAgICAgcmV2aWV3Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIHJldmlld0N1cnNvcjogbnVsbCxcbiAgICAgIHRocmVhZENvdW50OiBQQUdFX1NJWkUsXG4gICAgICB0aHJlYWRDdXJzb3I6IG51bGwsXG4gICAgICBjb21tZW50Q291bnQ6IFBBR0VfU0laRSxcbiAgICAgIGNvbW1lbnRDdXJzb3I6IG51bGwsXG4gICAgICBjaGVja1N1aXRlQ291bnQ6IENIRUNLX1NVSVRFX1BBR0VfU0laRSxcbiAgICAgIGNoZWNrU3VpdGVDdXJzb3I6IG51bGwsXG4gICAgICBjaGVja1J1bkNvdW50OiBDSEVDS19SVU5fUEFHRV9TSVpFLFxuICAgICAgY2hlY2tSdW5DdXJzb3I6IG51bGwsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8UmVsYXlFbnZpcm9ubWVudC5Qcm92aWRlciB2YWx1ZT17ZW52aXJvbm1lbnR9PlxuICAgICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICAgIGVudmlyb25tZW50PXtlbnZpcm9ubWVudH1cbiAgICAgICAgICBxdWVyeT17cXVlcnl9XG4gICAgICAgICAgdmFyaWFibGVzPXt2YXJpYWJsZXN9XG4gICAgICAgICAgcmVuZGVyPXtxdWVyeVJlc3VsdCA9PiB0aGlzLnJlbmRlcldpdGhRdWVyeVJlc3VsdCh0b2tlbiwgcmVwb0RhdGEsIHF1ZXJ5UmVzdWx0KX1cbiAgICAgICAgLz5cbiAgICAgIDwvUmVsYXlFbnZpcm9ubWVudC5Qcm92aWRlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFF1ZXJ5UmVzdWx0KHRva2VuLCByZXBvRGF0YSwge2Vycm9yLCBwcm9wcywgcmV0cnl9KSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UXVlcnlFcnJvclZpZXdcbiAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgbG9naW49e3RoaXMuaGFuZGxlTG9naW59XG4gICAgICAgICAgcmV0cnk9e3JldHJ5fVxuICAgICAgICAgIGxvZ291dD17dGhpcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghcHJvcHMgfHwgIXJlcG9EYXRhKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmdWaWV3IC8+O1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5yZXBvc2l0b3J5Lmlzc3VlaXNoLl9fdHlwZW5hbWUgPT09ICdQdWxsUmVxdWVzdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxBZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lclxuICAgICAgICAgIHB1bGxSZXF1ZXN0PXtwcm9wcy5yZXBvc2l0b3J5Lmlzc3VlaXNofVxuICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn0+XG4gICAgICAgICAge2FnZ3JlZ2F0ZWRSZXZpZXdzID0+IHRoaXMucmVuZGVyV2l0aENvbW1lbnRSZXN1bHQodG9rZW4sIHJlcG9EYXRhLCB7cHJvcHMsIHJldHJ5fSwgYWdncmVnYXRlZFJldmlld3MpfVxuICAgICAgICA8L0FnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyV2l0aENvbW1lbnRSZXN1bHQoXG4gICAgICAgIHRva2VuLFxuICAgICAgICByZXBvRGF0YSxcbiAgICAgICAge3Byb3BzLCByZXRyeX0sXG4gICAgICAgIHtlcnJvcnM6IFtdLCBjb21tZW50VGhyZWFkczogW10sIGxvYWRpbmc6IGZhbHNlfSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyV2l0aENvbW1lbnRSZXN1bHQodG9rZW4sIHJlcG9EYXRhLCB7cHJvcHMsIHJldHJ5fSwge2Vycm9ycywgY29tbWVudFRocmVhZHMsIGxvYWRpbmd9KSB7XG4gICAgY29uc3Qgbm9uRW1wdHlUaHJlYWRzID0gY29tbWVudFRocmVhZHMuZmlsdGVyKGVhY2ggPT4gZWFjaC5jb21tZW50cyAmJiBlYWNoLmNvbW1lbnRzLmxlbmd0aCA+IDApO1xuICAgIGNvbnN0IHRvdGFsQ291bnQgPSBub25FbXB0eVRocmVhZHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlc29sdmVkQ291bnQgPSBub25FbXB0eVRocmVhZHMuZmlsdGVyKGVhY2ggPT4gZWFjaC50aHJlYWQuaXNSZXNvbHZlZCkubGVuZ3RoO1xuXG4gICAgaWYgKGVycm9ycyAmJiBlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZGVzY3JpcHRpb25zID0gZXJyb3JzLm1hcChlcnJvciA9PiBlcnJvci50b1N0cmluZygpKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEVycm9yVmlld1xuICAgICAgICAgIHRpdGxlPVwiVW5hYmxlIHRvIGZldGNoIHJldmlldyBjb21tZW50c1wiXG4gICAgICAgICAgZGVzY3JpcHRpb25zPXtkZXNjcmlwdGlvbnN9XG4gICAgICAgICAgcmV0cnk9e3JldHJ5fVxuICAgICAgICAgIGxvZ291dD17dGhpcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8SXNzdWVpc2hEZXRhaWxDb250cm9sbGVyXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgey4uLnJlcG9EYXRhfVxuICAgICAgICByZXZpZXdDb21tZW50c0xvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIHJldmlld0NvbW1lbnRzVG90YWxDb3VudD17dG90YWxDb3VudH1cbiAgICAgICAgcmV2aWV3Q29tbWVudHNSZXNvbHZlZENvdW50PXtyZXNvbHZlZENvdW50fVxuICAgICAgICByZXZpZXdDb21tZW50VGhyZWFkcz17bm9uRW1wdHlUaHJlYWRzfVxuICAgICAgICB0b2tlbj17dG9rZW59XG5cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIHdvcmtkaXJQYXRoPXt0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKX1cblxuICAgICAgICBpc3N1ZWlzaE51bWJlcj17dGhpcy5wcm9wcy5pc3N1ZWlzaE51bWJlcn1cbiAgICAgICAgb25UaXRsZUNoYW5nZT17dGhpcy5wcm9wcy5vblRpdGxlQ2hhbmdlfVxuICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg9e3RoaXMucHJvcHMuaW5pdENoYW5nZWRGaWxlUGF0aH1cbiAgICAgICAgaW5pdENoYW5nZWRGaWxlUG9zaXRpb249e3RoaXMucHJvcHMuaW5pdENoYW5nZWRGaWxlUG9zaXRpb259XG4gICAgICAgIHNlbGVjdGVkVGFiPXt0aGlzLnByb3BzLnNlbGVjdGVkVGFifVxuICAgICAgICBvblRhYlNlbGVjdGVkPXt0aGlzLnByb3BzLm9uVGFiU2VsZWN0ZWR9XG4gICAgICAgIG9uT3BlbkZpbGVzVGFiPXt0aGlzLnByb3BzLm9uT3BlbkZpbGVzVGFifVxuICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuXG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICBkZXN0cm95PXt0aGlzLnByb3BzLmRlc3Ryb3l9XG4gICAgICAgIHJlZkVkaXRvcj17dGhpcy5wcm9wcy5yZWZFZGl0b3J9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBmZXRjaFRva2VuID0gbG9naW5Nb2RlbCA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIHRva2VuOiBsb2dpbk1vZGVsLmdldFRva2VuKHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCkpLFxuICAgIH0pO1xuICB9XG5cbiAgZmV0Y2hSZXBvc2l0b3J5RGF0YSA9IHJlcG9zaXRvcnkgPT4ge1xuICAgIHJldHVybiB5dWJpa2lyaSh7XG4gICAgICBicmFuY2hlczogcmVwb3NpdG9yeS5nZXRCcmFuY2hlcygpLFxuICAgICAgcmVtb3RlczogcmVwb3NpdG9yeS5nZXRSZW1vdGVzKCksXG4gICAgICBpc01lcmdpbmc6IHJlcG9zaXRvcnkuaXNNZXJnaW5nKCksXG4gICAgICBpc1JlYmFzaW5nOiByZXBvc2l0b3J5LmlzUmViYXNpbmcoKSxcbiAgICAgIGlzQWJzZW50OiByZXBvc2l0b3J5LmlzQWJzZW50KCksXG4gICAgICBpc0xvYWRpbmc6IHJlcG9zaXRvcnkuaXNMb2FkaW5nKCksXG4gICAgICBpc1ByZXNlbnQ6IHJlcG9zaXRvcnkuaXNQcmVzZW50KCksXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVMb2dpbiA9IHRva2VuID0+IHRoaXMucHJvcHMubG9naW5Nb2RlbC5zZXRUb2tlbih0aGlzLnByb3BzLmVuZHBvaW50LmdldExvZ2luQWNjb3VudCgpLCB0b2tlbik7XG5cbiAgaGFuZGxlTG9nb3V0ID0gKCkgPT4gdGhpcy5wcm9wcy5sb2dpbk1vZGVsLnJlbW92ZVRva2VuKHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0TG9naW5BY2NvdW50KCkpO1xuXG4gIGhhbmRsZVRva2VuUmV0cnkgPSAoKSA9PiB0aGlzLnByb3BzLmxvZ2luTW9kZWwuZGlkVXBkYXRlKCk7XG59XG4iXX0=