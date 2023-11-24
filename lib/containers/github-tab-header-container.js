"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _propTypes2 = require("../prop-types");

var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));

var _keytarStrategy = require("../shared/keytar-strategy");

var _author = _interopRequireWildcard(require("../models/author"));

var _githubTabHeaderController = _interopRequireDefault(require("../controllers/github-tab-header-controller"));

var _graphql;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GithubTabHeaderContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderWithResult", ({
      error,
      props
    }) => {
      if (error || props === null) {
        return this.renderNoResult();
      } // eslint-disable-next-line react/prop-types


      const {
        email,
        name,
        avatarUrl,
        login
      } = props.viewer;
      return _react.default.createElement(_githubTabHeaderController.default, {
        user: new _author.default(email, name, login, false, avatarUrl) // Workspace
        ,
        currentWorkDir: this.props.currentWorkDir,
        contextLocked: this.props.contextLocked,
        getCurrentWorkDirs: this.props.getCurrentWorkDirs,
        changeWorkingDirectory: this.props.changeWorkingDirectory,
        setContextLock: this.props.setContextLock // Event Handlers
        ,
        onDidChangeWorkDirs: this.props.onDidChangeWorkDirs
      });
    });
  }

  render() {
    if (this.props.token == null || this.props.token instanceof Error || this.props.token === _keytarStrategy.UNAUTHENTICATED || this.props.token === _keytarStrategy.INSUFFICIENT) {
      return this.renderNoResult();
    }

    const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(this.props.endpoint, this.props.token);

    const query = _graphql || (_graphql = function () {
      const node = require("./__generated__/githubTabHeaderContainerQuery.graphql");

      if (node.hash && node.hash !== "003bcc6b15469f788437eba2b4ce780b") {
        console.error("The definition of 'githubTabHeaderContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
      }

      return require("./__generated__/githubTabHeaderContainerQuery.graphql");
    });

    return _react.default.createElement(_reactRelay.QueryRenderer, {
      environment: environment,
      variables: {},
      query: query,
      render: this.renderWithResult
    });
  }

  renderNoResult() {
    return _react.default.createElement(_githubTabHeaderController.default, {
      user: _author.nullAuthor // Workspace
      ,
      currentWorkDir: this.props.currentWorkDir,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs // Event Handlers
      ,
      onDidChangeWorkDirs: this.props.onDidChangeWorkDirs
    });
  }

}

exports.default = GithubTabHeaderContainer;

_defineProperty(GithubTabHeaderContainer, "propTypes", {
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes2.TokenPropType,
  // Workspace
  currentWorkDir: _propTypes.default.string,
  contextLocked: _propTypes.default.bool.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  // Event Handlers
  onDidChangeWorkDirs: _propTypes.default.func
});