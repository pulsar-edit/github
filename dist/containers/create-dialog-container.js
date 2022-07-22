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
      return /*#__PURE__*/_react.default.createElement(_reactRelay.QueryRenderer, {
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
      return /*#__PURE__*/_react.default.createElement(_createDialogController.default, _extends({
        user: currentProps.viewer,
        isLoading: false
      }, this.props));
    });

    _defineProperty(this, "fetchToken", loginModel => loginModel.getToken(DOTCOM.getLoginAccount()));

    this.lastProps = null;
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.loginModel,
      fetchData: this.fetchToken
    }, this.renderWithToken);
  }

  renderError(error) {
    return /*#__PURE__*/_react.default.createElement(_createDialogController.default, _extends({
      user: null,
      error: error,
      isLoading: false
    }, this.props));
  }

  renderLoading() {
    return /*#__PURE__*/_react.default.createElement(_createDialogController.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NyZWF0ZS1kaWFsb2ctY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkRPVENPTSIsIkNyZWF0ZURpYWxvZ0NvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInRva2VuIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJxdWVyeSIsInZhcmlhYmxlcyIsIm9yZ2FuaXphdGlvbkNvdW50IiwiUEFHRV9TSVpFIiwib3JnYW5pemF0aW9uQ3Vyc29yIiwiZXJyb3IiLCJpblByb2dyZXNzIiwicmVuZGVyV2l0aFJlc3VsdCIsInJlbmRlckVycm9yIiwibGFzdFByb3BzIiwicmVuZGVyTG9hZGluZyIsImN1cnJlbnRQcm9wcyIsInZpZXdlciIsImxvZ2luTW9kZWwiLCJnZXRUb2tlbiIsImdldExvZ2luQWNjb3VudCIsInJlbmRlciIsImZldGNoVG9rZW4iLCJyZW5kZXJXaXRoVG9rZW4iLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwicmVxdWVzdCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImluc3RhbmNlT2YiLCJFcnJvciIsImJvb2wiLCJjdXJyZW50V2luZG93Iiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJjb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLE1BQU0sR0FBRywyQkFBWSxZQUFaLENBQWY7O0FBRWUsTUFBTUMscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBZWpFQyxFQUFBQSxXQUFXLENBQUNDLE1BQUQsRUFBUTtBQUNqQixVQUFNQSxNQUFOOztBQURpQiw2Q0FjREMsS0FBSyxJQUFJO0FBQ3pCLFVBQUksQ0FBQ0EsS0FBTCxF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UixtQkFBVUMsTUFBVixDQUFpQkg7QUFYUixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IENyZWF0ZURpYWxvZ0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvY3JlYXRlLWRpYWxvZy1jb250cm9sbGVyJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQge1BBR0VfU0laRX0gZnJvbSAnLi4vdmlld3MvcmVwb3NpdG9yeS1ob21lLXNlbGVjdGlvbi12aWV3JztcbmltcG9ydCBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIgZnJvbSAnLi4vcmVsYXktbmV0d29yay1sYXllci1tYW5hZ2VyJztcbmltcG9ydCB7Z2V0RW5kcG9pbnR9IGZyb20gJy4uL21vZGVscy9lbmRwb2ludCc7XG5pbXBvcnQge0dpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmNvbnN0IERPVENPTSA9IGdldEVuZHBvaW50KCdnaXRodWIuY29tJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZURpYWxvZ0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICBsb2dpbk1vZGVsOiBHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZXF1ZXN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZXJyb3I6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEVycm9yKSxcbiAgICBpblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGN1cnJlbnRXaW5kb3c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmxhc3RQcm9wcyA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoVG9rZW59PlxuICAgICAgICB7dGhpcy5yZW5kZXJXaXRoVG9rZW59XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFRva2VuID0gdG9rZW4gPT4ge1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdChET1RDT00sIHRva2VuKTtcbiAgICBjb25zdCBxdWVyeSA9IGdyYXBocWxgXG4gICAgICBxdWVyeSBjcmVhdGVEaWFsb2dDb250YWluZXJRdWVyeShcbiAgICAgICAgJG9yZ2FuaXphdGlvbkNvdW50OiBJbnQhXG4gICAgICAgICRvcmdhbml6YXRpb25DdXJzb3I6IFN0cmluZ1xuICAgICAgKSB7XG4gICAgICAgIHZpZXdlciB7XG4gICAgICAgICAgLi4uY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyIEBhcmd1bWVudHMoXG4gICAgICAgICAgICBvcmdhbml6YXRpb25Db3VudDogJG9yZ2FuaXphdGlvbkNvdW50XG4gICAgICAgICAgICBvcmdhbml6YXRpb25DdXJzb3I6ICRvcmdhbml6YXRpb25DdXJzb3JcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgO1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICAgIG9yZ2FuaXphdGlvbkNvdW50OiBQQUdFX1NJWkUsXG4gICAgICBvcmdhbml6YXRpb25DdXJzb3I6IG51bGwsXG5cbiAgICAgIC8vIEZvcmNlIFF1ZXJ5UmVuZGVyZXIgdG8gcmUtcmVuZGVyIHdoZW4gZGlhbG9nIHJlcXVlc3Qgc3RhdGUgY2hhbmdlc1xuICAgICAgZXJyb3I6IHRoaXMucHJvcHMuZXJyb3IsXG4gICAgICBpblByb2dyZXNzOiB0aGlzLnByb3BzLmluUHJvZ3Jlc3MsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgIHF1ZXJ5PXtxdWVyeX1cbiAgICAgICAgdmFyaWFibGVzPXt2YXJpYWJsZXN9XG4gICAgICAgIHJlbmRlcj17dGhpcy5yZW5kZXJXaXRoUmVzdWx0fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFJlc3VsdCA9ICh7ZXJyb3IsIHByb3BzfSkgPT4ge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRXJyb3IoZXJyb3IpO1xuICAgIH1cblxuICAgIGlmICghcHJvcHMgJiYgIXRoaXMubGFzdFByb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudFByb3BzID0gcHJvcHMgfHwgdGhpcy5sYXN0UHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENyZWF0ZURpYWxvZ0NvbnRyb2xsZXJcbiAgICAgICAgdXNlcj17Y3VycmVudFByb3BzLnZpZXdlcn1cbiAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJFcnJvcihlcnJvcikge1xuICAgIHJldHVybiAoXG4gICAgICA8Q3JlYXRlRGlhbG9nQ29udHJvbGxlclxuICAgICAgICB1c2VyPXtudWxsfVxuICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTG9hZGluZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENyZWF0ZURpYWxvZ0NvbnRyb2xsZXJcbiAgICAgICAgdXNlcj17bnVsbH1cbiAgICAgICAgaXNMb2FkaW5nPXt0cnVlfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGZldGNoVG9rZW4gPSBsb2dpbk1vZGVsID0+IGxvZ2luTW9kZWwuZ2V0VG9rZW4oRE9UQ09NLmdldExvZ2luQWNjb3VudCgpKVxufVxuIl19