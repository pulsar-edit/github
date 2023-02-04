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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJET1RDT00iLCJnZXRFbmRwb2ludCIsIkNyZWF0ZURpYWxvZ0NvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInRva2VuIiwiZW52aXJvbm1lbnQiLCJSZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJnZXRFbnZpcm9ubWVudEZvckhvc3QiLCJxdWVyeSIsInZhcmlhYmxlcyIsIm9yZ2FuaXphdGlvbkNvdW50IiwiUEFHRV9TSVpFIiwib3JnYW5pemF0aW9uQ3Vyc29yIiwiZXJyb3IiLCJpblByb2dyZXNzIiwicmVuZGVyV2l0aFJlc3VsdCIsInJlbmRlckVycm9yIiwibGFzdFByb3BzIiwicmVuZGVyTG9hZGluZyIsImN1cnJlbnRQcm9wcyIsInZpZXdlciIsImxvZ2luTW9kZWwiLCJnZXRUb2tlbiIsImdldExvZ2luQWNjb3VudCIsInJlbmRlciIsImZldGNoVG9rZW4iLCJyZW5kZXJXaXRoVG9rZW4iLCJHaXRodWJMb2dpbk1vZGVsUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwicmVxdWVzdCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImluc3RhbmNlT2YiLCJFcnJvciIsImJvb2wiLCJjdXJyZW50V2luZG93Iiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJjb25maWciXSwic291cmNlcyI6WyJjcmVhdGUtZGlhbG9nLWNvbnRhaW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7UXVlcnlSZW5kZXJlciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgQ3JlYXRlRGlhbG9nQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jcmVhdGUtZGlhbG9nLWNvbnRyb2xsZXInO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCB7UEFHRV9TSVpFfSBmcm9tICcuLi92aWV3cy9yZXBvc2l0b3J5LWhvbWUtc2VsZWN0aW9uLXZpZXcnO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IHtnZXRFbmRwb2ludH0gZnJvbSAnLi4vbW9kZWxzL2VuZHBvaW50JztcbmltcG9ydCB7R2l0aHViTG9naW5Nb2RlbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuY29uc3QgRE9UQ09NID0gZ2V0RW5kcG9pbnQoJ2dpdGh1Yi5jb20nKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlRGlhbG9nQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbFxuICAgIGxvZ2luTW9kZWw6IEdpdGh1YkxvZ2luTW9kZWxQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlcXVlc3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBlcnJvcjogUHJvcFR5cGVzLmluc3RhbmNlT2YoRXJyb3IpLFxuICAgIGluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgY3VycmVudFdpbmRvdzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMubGFzdFByb3BzID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hUb2tlbn0+XG4gICAgICAgIHt0aGlzLnJlbmRlcldpdGhUb2tlbn1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoVG9rZW4gPSB0b2tlbiA9PiB7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KERPVENPTSwgdG9rZW4pO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZ3JhcGhxbGBcbiAgICAgIHF1ZXJ5IGNyZWF0ZURpYWxvZ0NvbnRhaW5lclF1ZXJ5KFxuICAgICAgICAkb3JnYW5pemF0aW9uQ291bnQ6IEludCFcbiAgICAgICAgJG9yZ2FuaXphdGlvbkN1cnNvcjogU3RyaW5nXG4gICAgICApIHtcbiAgICAgICAgdmlld2VyIHtcbiAgICAgICAgICAuLi5jcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXIgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbkNvdW50OiAkb3JnYW5pemF0aW9uQ291bnRcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbkN1cnNvcjogJG9yZ2FuaXphdGlvbkN1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgICAgb3JnYW5pemF0aW9uQ291bnQ6IFBBR0VfU0laRSxcbiAgICAgIG9yZ2FuaXphdGlvbkN1cnNvcjogbnVsbCxcblxuICAgICAgLy8gRm9yY2UgUXVlcnlSZW5kZXJlciB0byByZS1yZW5kZXIgd2hlbiBkaWFsb2cgcmVxdWVzdCBzdGF0ZSBjaGFuZ2VzXG4gICAgICBlcnJvcjogdGhpcy5wcm9wcy5lcnJvcixcbiAgICAgIGluUHJvZ3Jlc3M6IHRoaXMucHJvcHMuaW5Qcm9ncmVzcyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxRdWVyeVJlbmRlcmVyXG4gICAgICAgIGVudmlyb25tZW50PXtlbnZpcm9ubWVudH1cbiAgICAgICAgcXVlcnk9e3F1ZXJ5fVxuICAgICAgICB2YXJpYWJsZXM9e3ZhcmlhYmxlc31cbiAgICAgICAgcmVuZGVyPXt0aGlzLnJlbmRlcldpdGhSZXN1bHR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUmVzdWx0ID0gKHtlcnJvciwgcHJvcHN9KSA9PiB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJFcnJvcihlcnJvcik7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcyAmJiAhdGhpcy5sYXN0UHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRpbmcoKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50UHJvcHMgPSBwcm9wcyB8fCB0aGlzLmxhc3RQcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8Q3JlYXRlRGlhbG9nQ29udHJvbGxlclxuICAgICAgICB1c2VyPXtjdXJyZW50UHJvcHMudmlld2VyfVxuICAgICAgICBpc0xvYWRpbmc9e2ZhbHNlfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckVycm9yKGVycm9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDcmVhdGVEaWFsb2dDb250cm9sbGVyXG4gICAgICAgIHVzZXI9e251bGx9XG4gICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgaXNMb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJMb2FkaW5nKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q3JlYXRlRGlhbG9nQ29udHJvbGxlclxuICAgICAgICB1c2VyPXtudWxsfVxuICAgICAgICBpc0xvYWRpbmc9e3RydWV9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgZmV0Y2hUb2tlbiA9IGxvZ2luTW9kZWwgPT4gbG9naW5Nb2RlbC5nZXRUb2tlbihET1RDT00uZ2V0TG9naW5BY2NvdW50KCkpXG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUF1RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFdkQsTUFBTUEsTUFBTSxHQUFHLElBQUFDLHFCQUFXLEVBQUMsWUFBWSxDQUFDO0FBRXpCLE1BQU1DLHFCQUFxQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWVqRUMsV0FBVyxDQUFDQyxNQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxNQUFLLENBQUM7SUFBQyx5Q0FhR0MsS0FBSyxJQUFJO01BQ3pCLElBQUksQ0FBQ0EsS0FBSyxFQUFFO1FBQ1YsT0FBTyxJQUFJO01BQ2I7TUFFQSxNQUFNQyxXQUFXLEdBQUdDLGlDQUF3QixDQUFDQyxxQkFBcUIsQ0FBQ1YsTUFBTSxFQUFFTyxLQUFLLENBQUM7TUFDakYsTUFBTUksS0FBSztRQUFBO1FBQUE7VUFBQTtRQUFBO1FBQUE7TUFBQSxFQVlWO01BQ0QsTUFBTUMsU0FBUyxHQUFHO1FBQ2hCQyxpQkFBaUIsRUFBRUMsc0NBQVM7UUFDNUJDLGtCQUFrQixFQUFFLElBQUk7UUFFeEI7UUFDQUMsS0FBSyxFQUFFLElBQUksQ0FBQ1YsS0FBSyxDQUFDVSxLQUFLO1FBQ3ZCQyxVQUFVLEVBQUUsSUFBSSxDQUFDWCxLQUFLLENBQUNXO01BQ3pCLENBQUM7TUFFRCxPQUNFLDZCQUFDLHlCQUFhO1FBQ1osV0FBVyxFQUFFVCxXQUFZO1FBQ3pCLEtBQUssRUFBRUcsS0FBTTtRQUNiLFNBQVMsRUFBRUMsU0FBVTtRQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDTTtNQUFpQixFQUM5QjtJQUVOLENBQUM7SUFBQSwwQ0FFa0IsQ0FBQztNQUFDRixLQUFLO01BQUVWO0lBQUssQ0FBQyxLQUFLO01BQ3JDLElBQUlVLEtBQUssRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDRyxXQUFXLENBQUNILEtBQUssQ0FBQztNQUNoQztNQUVBLElBQUksQ0FBQ1YsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDYyxTQUFTLEVBQUU7UUFDN0IsT0FBTyxJQUFJLENBQUNDLGFBQWEsRUFBRTtNQUM3QjtNQUVBLE1BQU1DLFlBQVksR0FBR2hCLEtBQUssSUFBSSxJQUFJLENBQUNjLFNBQVM7TUFFNUMsT0FDRSw2QkFBQywrQkFBc0I7UUFDckIsSUFBSSxFQUFFRSxZQUFZLENBQUNDLE1BQU87UUFDMUIsU0FBUyxFQUFFO01BQU0sR0FDYixJQUFJLENBQUNqQixLQUFLLEVBQ2Q7SUFFTixDQUFDO0lBQUEsb0NBdUJZa0IsVUFBVSxJQUFJQSxVQUFVLENBQUNDLFFBQVEsQ0FBQ3pCLE1BQU0sQ0FBQzBCLGVBQWUsRUFBRSxDQUFDO0lBMUZ0RSxJQUFJLENBQUNOLFNBQVMsR0FBRyxJQUFJO0VBQ3ZCO0VBRUFPLE1BQU0sR0FBRztJQUNQLE9BQ0UsNkJBQUMscUJBQVk7TUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDckIsS0FBSyxDQUFDa0IsVUFBVztNQUFDLFNBQVMsRUFBRSxJQUFJLENBQUNJO0lBQVcsR0FDcEUsSUFBSSxDQUFDQyxlQUFlLENBQ1I7RUFFbkI7RUE0REFWLFdBQVcsQ0FBQ0gsS0FBSyxFQUFFO0lBQ2pCLE9BQ0UsNkJBQUMsK0JBQXNCO01BQ3JCLElBQUksRUFBRSxJQUFLO01BQ1gsS0FBSyxFQUFFQSxLQUFNO01BQ2IsU0FBUyxFQUFFO0lBQU0sR0FDYixJQUFJLENBQUNWLEtBQUssRUFDZDtFQUVOO0VBRUFlLGFBQWEsR0FBRztJQUNkLE9BQ0UsNkJBQUMsK0JBQXNCO01BQ3JCLElBQUksRUFBRSxJQUFLO01BQ1gsU0FBUyxFQUFFO0lBQUssR0FDWixJQUFJLENBQUNmLEtBQUssRUFDZDtFQUVOO0FBR0Y7QUFBQztBQUFBLGdCQTdHb0JKLHFCQUFxQixlQUNyQjtFQUNqQjtFQUNBc0IsVUFBVSxFQUFFTSxvQ0FBd0IsQ0FBQ0MsVUFBVTtFQUMvQ0MsT0FBTyxFQUFFQyxrQkFBUyxDQUFDQyxNQUFNLENBQUNILFVBQVU7RUFDcENmLEtBQUssRUFBRWlCLGtCQUFTLENBQUNFLFVBQVUsQ0FBQ0MsS0FBSyxDQUFDO0VBQ2xDbkIsVUFBVSxFQUFFZ0Isa0JBQVMsQ0FBQ0ksSUFBSSxDQUFDTixVQUFVO0VBRXJDO0VBQ0FPLGFBQWEsRUFBRUwsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDSCxVQUFVO0VBQzFDUSxTQUFTLEVBQUVOLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0gsVUFBVTtFQUN0Q1MsUUFBUSxFQUFFUCxrQkFBUyxDQUFDQyxNQUFNLENBQUNILFVBQVU7RUFDckNVLE1BQU0sRUFBRVIsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDSDtBQUMzQixDQUFDIn0=