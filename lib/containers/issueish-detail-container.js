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