"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _issueishListController = _interopRequireWildcard(require("../controllers/issueish-list-controller"));

var _createPullRequestTile = _interopRequireDefault(require("../views/create-pull-request-tile"));

var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));

var _graphql;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CurrentPullRequestContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'renderQueryResult', 'renderEmptyTile');
    this.sub = new _eventKit.Disposable();
  }

  render() {
    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, this.props.token);

    const head = this.props.branches.getHeadBranch();

    if (!head.isPresent()) {
      return this.renderEmptyResult();
    }

    const push = head.getPush();

    if (!push.isPresent() || !push.isRemoteTracking()) {
      return this.renderEmptyResult();
    }

    const pushRemote = this.props.remotes.withName(push.getRemoteName());

    if (!pushRemote.isPresent() || !pushRemote.isGithubRepo()) {
      return this.renderEmptyResult();
    }

    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/currentPullRequestContainerQuery.graphql");

      if (node.hash && node.hash !== "b571ac1d752d4d13bc8e9bdffedb0a5e") {
        console.error("The definition of 'currentPullRequestContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }

      return require("./__generated__/currentPullRequestContainerQuery.graphql");
    });

    const variables = {
      headOwner: pushRemote.getOwner(),
      headName: pushRemote.getRepo(),
      headRef: push.getRemoteRef(),
      first: this.props.limit,
      checkSuiteCount: _helpers.CHECK_SUITE_PAGE_SIZE,
      checkSuiteCursor: null,
      checkRunCount: _helpers.CHECK_RUN_PAGE_SIZE,
      checkRunCursor: null
    };
    return _react.default.createElement(_reactRelay.QueryRenderer, {
      environment: environment,
      variables: variables,
      query: query,
      render: this.renderQueryResult
    });
  }

  renderEmptyResult() {
    return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
      isLoading: false
    }, this.controllerProps()));
  }

  renderQueryResult({
    error,
    props
  }) {
    if (error) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: false,
        error: error
      }, this.controllerProps()));
    }

    if (props === null) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: true
      }, this.controllerProps()));
    }

    if (!props.repository || !props.repository.ref) {
      return _react.default.createElement(_issueishListController.BareIssueishListController, _extends({
        isLoading: false
      }, this.controllerProps()));
    }

    const associatedPullRequests = props.repository.ref.associatedPullRequests;
    return _react.default.createElement(_issueishListController.default, _extends({
      total: associatedPullRequests.totalCount,
      results: associatedPullRequests.nodes,
      isLoading: false,
      endpoint: this.props.endpoint,
      resultFilter: issueish => issueish.getHeadRepositoryID() === this.props.repository.id
    }, this.controllerProps()));
  }

  renderEmptyTile() {
    return _react.default.createElement(_createPullRequestTile.default, {
      repository: this.props.repository,
      remote: this.props.remote,
      branches: this.props.branches,
      aheadCount: this.props.aheadCount,
      pushInProgress: this.props.pushInProgress,
      onCreatePr: this.props.onCreatePr
    });
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  controllerProps() {
    return {
      title: 'Checked out pull request',
      onOpenIssueish: this.props.onOpenIssueish,
      onOpenReviews: this.props.onOpenReviews,
      emptyComponent: this.renderEmptyTile,
      needReviewsButton: true
    };
  }

}

exports.default = CurrentPullRequestContainer;

_defineProperty(CurrentPullRequestContainer, "propTypes", {
  // Relay payload
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    defaultBranchRef: _propTypes.default.shape({
      prefix: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired
    })
  }).isRequired,
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes.default.string.isRequired,
  // Search constraints
  limit: _propTypes.default.number,
  // Repository model attributes
  remote: _propTypes2.RemotePropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Actions
  onOpenIssueish: _propTypes.default.func.isRequired,
  onOpenReviews: _propTypes.default.func.isRequired,
  onCreatePr: _propTypes.default.func.isRequired
});

_defineProperty(CurrentPullRequestContainer, "defaultProps", {
  limit: 5
});