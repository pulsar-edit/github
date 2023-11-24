"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _createDialogController = _interopRequireDefault(require("../controllers/create-dialog-controller"));

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _repositoryHomeSelectionView = require("../views/repository-home-selection-view");

var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));

var _endpoint = require("../models/endpoint");

var _propTypes2 = require("../prop-types");

var _graphql;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DOTCOM = (0, _endpoint.getEndpoint)('github.com');

class CreateDialogContainer extends _react.default.Component {
  constructor(_props) {
    super(_props);

    _defineProperty(this, "renderWithToken", token => {
      if (!token) {
        return null;
      }

      const environment = _relayNetworkLayerManager.default.getEnvironmentForHost(DOTCOM, token);

      const query = _graphql || (_graphql = function () {
        const node = require("./__generated__/createDialogContainerQuery.graphql");

        if (node.hash && node.hash !== "862b8ec3127c9a52e9a54020afa47792") {
          console.error("The definition of 'createDialogContainerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
        }

        return require("./__generated__/createDialogContainerQuery.graphql");
      });

      const variables = {
        organizationCount: _repositoryHomeSelectionView.PAGE_SIZE,
        organizationCursor: null,
        // Force QueryRenderer to re-render when dialog request state changes
        error: this.props.error,
        inProgress: this.props.inProgress
      };
      return _react.default.createElement(_reactRelay.QueryRenderer, {
        environment: environment,
        query: query,
        variables: variables,
        render: this.renderWithResult
      });
    });

    _defineProperty(this, "renderWithResult", ({
      error,
      props
    }) => {
      if (error) {
        return this.renderError(error);
      }

      if (!props && !this.lastProps) {
        return this.renderLoading();
      }

      const currentProps = props || this.lastProps;
      return _react.default.createElement(_createDialogController.default, _extends({
        user: currentProps.viewer,
        isLoading: false
      }, this.props));
    });

    _defineProperty(this, "fetchToken", loginModel => loginModel.getToken(DOTCOM.getLoginAccount()));

    this.lastProps = null;
  }

  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.loginModel,
      fetchData: this.fetchToken
    }, this.renderWithToken);
  }

  renderError(error) {
    return _react.default.createElement(_createDialogController.default, _extends({
      user: null,
      error: error,
      isLoading: false
    }, this.props));
  }

  renderLoading() {
    return _react.default.createElement(_createDialogController.default, _extends({
      user: null,
      isLoading: true
    }, this.props));
  }

}

exports.default = CreateDialogContainer;

_defineProperty(CreateDialogContainer, "propTypes", {
  // Model
  loginModel: _propTypes2.GithubLoginModelPropType.isRequired,
  request: _propTypes.default.object.isRequired,
  error: _propTypes.default.instanceOf(Error),
  inProgress: _propTypes.default.bool.isRequired,
  // Atom environment
  currentWindow: _propTypes.default.object.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});