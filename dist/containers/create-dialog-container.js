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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NyZWF0ZS1kaWFsb2ctY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkRPVENPTSIsIkNyZWF0ZURpYWxvZ0NvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInRva2VuIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJxdWVyeSIsInZhcmlhYmxlcyIsIm9yZ2FuaXphdGlvbkNvdW50IiwiUEFHRV9TSVpFIiwib3JnYW5pemF0aW9uQ3Vyc29yIiwiZXJyb3IiLCJpblByb2dyZXNzIiwicmVuZGVyV2l0aFJlc3VsdCIsInJlbmRlckVycm9yIiwibGFzdFByb3BzIiwicmVuZGVyTG9hZGluZyIsImN1cnJlbnRQcm9wcyIsInZpZXdlciIsImxvZ2luTW9kZWwiLCJnZXRUb2tlbiIsImdldExvZ2luQWNjb3VudCIsInJlbmRlciIsImZldGNoVG9rZW4iLCJyZW5kZXJXaXRoVG9rZW4iLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwicmVxdWVzdCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImluc3RhbmNlT2YiLCJFcnJvciIsImJvb2wiLCJjdXJyZW50V2luZG93Iiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJjb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLE1BQU0sR0FBRywyQkFBWSxZQUFaLENBQWY7O0FBRWUsTUFBTUMscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBZWpFQyxFQUFBQSxXQUFXLENBQUNDLE1BQUQsRUFBUTtBQUNqQixVQUFNQSxNQUFOOztBQURpQiw2Q0FjREMsS0FBSyxJQUFJO0FBQ3pCLFVBQUksQ0FBQ0EsS0FBTCxF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QVVDLE1BQVYsQ0FBaUJIO0FBWFIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtRdWVyeVJlbmRlcmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCBDcmVhdGVEaWFsb2dDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NyZWF0ZS1kaWFsb2ctY29udHJvbGxlcic7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IHtQQUdFX1NJWkV9IGZyb20gJy4uL3ZpZXdzL3JlcG9zaXRvcnktaG9tZS1zZWxlY3Rpb24tdmlldyc7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQge2dldEVuZHBvaW50fSBmcm9tICcuLi9tb2RlbHMvZW5kcG9pbnQnO1xuaW1wb3J0IHtHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5jb25zdCBET1RDT00gPSBnZXRFbmRwb2ludCgnZ2l0aHViLmNvbScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVEaWFsb2dDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgbG9naW5Nb2RlbDogR2l0aHViTG9naW5Nb2RlbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG4gICAgaW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjdXJyZW50V2luZG93OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5sYXN0UHJvcHMgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9IGZldGNoRGF0YT17dGhpcy5mZXRjaFRva2VufT5cbiAgICAgICAge3RoaXMucmVuZGVyV2l0aFRva2VufVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhUb2tlbiA9IHRva2VuID0+IHtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QoRE9UQ09NLCB0b2tlbik7XG4gICAgY29uc3QgcXVlcnkgPSBncmFwaHFsYFxuICAgICAgcXVlcnkgY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnkoXG4gICAgICAgICRvcmdhbml6YXRpb25Db3VudDogSW50IVxuICAgICAgICAkb3JnYW5pemF0aW9uQ3Vyc29yOiBTdHJpbmdcbiAgICAgICkge1xuICAgICAgICB2aWV3ZXIge1xuICAgICAgICAgIC4uLmNyZWF0ZURpYWxvZ0NvbnRyb2xsZXJfdXNlciBAYXJndW1lbnRzKFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uQ291bnQ6ICRvcmdhbml6YXRpb25Db3VudFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uQ3Vyc29yOiAkb3JnYW5pemF0aW9uQ3Vyc29yXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgICBvcmdhbml6YXRpb25Db3VudDogUEFHRV9TSVpFLFxuICAgICAgb3JnYW5pemF0aW9uQ3Vyc29yOiBudWxsLFxuXG4gICAgICAvLyBGb3JjZSBRdWVyeVJlbmRlcmVyIHRvIHJlLXJlbmRlciB3aGVuIGRpYWxvZyByZXF1ZXN0IHN0YXRlIGNoYW5nZXNcbiAgICAgIGVycm9yOiB0aGlzLnByb3BzLmVycm9yLFxuICAgICAgaW5Qcm9ncmVzczogdGhpcy5wcm9wcy5pblByb2dyZXNzLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgZW52aXJvbm1lbnQ9e2Vudmlyb25tZW50fVxuICAgICAgICBxdWVyeT17cXVlcnl9XG4gICAgICAgIHZhcmlhYmxlcz17dmFyaWFibGVzfVxuICAgICAgICByZW5kZXI9e3RoaXMucmVuZGVyV2l0aFJlc3VsdH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcldpdGhSZXN1bHQgPSAoe2Vycm9yLCBwcm9wc30pID0+IHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckVycm9yKGVycm9yKTtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BzICYmICF0aGlzLmxhc3RQcm9wcykge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGluZygpO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQcm9wcyA9IHByb3BzIHx8IHRoaXMubGFzdFByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDcmVhdGVEaWFsb2dDb250cm9sbGVyXG4gICAgICAgIHVzZXI9e2N1cnJlbnRQcm9wcy52aWV3ZXJ9XG4gICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRXJyb3IoZXJyb3IpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENyZWF0ZURpYWxvZ0NvbnRyb2xsZXJcbiAgICAgICAgdXNlcj17bnVsbH1cbiAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICBpc0xvYWRpbmc9e2ZhbHNlfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxvYWRpbmcoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDcmVhdGVEaWFsb2dDb250cm9sbGVyXG4gICAgICAgIHVzZXI9e251bGx9XG4gICAgICAgIGlzTG9hZGluZz17dHJ1ZX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBmZXRjaFRva2VuID0gbG9naW5Nb2RlbCA9PiBsb2dpbk1vZGVsLmdldFRva2VuKERPVENPTS5nZXRMb2dpbkFjY291bnQoKSlcbn1cbiJdfQ==