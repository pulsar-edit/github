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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2dpdGh1Yi10YWItaGVhZGVyLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJHaXRodWJUYWJIZWFkZXJDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImVycm9yIiwicHJvcHMiLCJyZW5kZXJOb1Jlc3VsdCIsImVtYWlsIiwibmFtZSIsImF2YXRhclVybCIsImxvZ2luIiwidmlld2VyIiwiQXV0aG9yIiwiY3VycmVudFdvcmtEaXIiLCJjb250ZXh0TG9ja2VkIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsInJlbmRlciIsInRva2VuIiwiRXJyb3IiLCJVTkFVVEhFTlRJQ0FURUQiLCJJTlNVRkZJQ0lFTlQiLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsImVuZHBvaW50IiwicXVlcnkiLCJyZW5kZXJXaXRoUmVzdWx0IiwibnVsbEF1dGhvciIsIkVuZHBvaW50UHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiVG9rZW5Qcm9wVHlwZSIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVlLE1BQU1BLHdCQUFOLFNBQXVDQyxlQUFNQyxTQUE3QyxDQUF1RDtBQUFBO0FBQUE7O0FBQUEsOENBaURqRCxDQUFDO0FBQUNDLE1BQUFBLEtBQUQ7QUFBUUMsTUFBQUE7QUFBUixLQUFELEtBQW9CO0FBQ3JDLFVBQUlELEtBQUssSUFBSUMsS0FBSyxLQUFLLElBQXZCLEVBQTZCO0FBQzNCLGVBQU8sS0FBS0MsY0FBTCxFQUFQO0FBQ0QsT0FIb0MsQ0FLckM7OztBQUNBLFlBQU07QUFBQ0MsUUFB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QUFiZCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1F1ZXJ5UmVuZGVyZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IHtFbmRwb2ludFByb3BUeXBlLCBUb2tlblByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIgZnJvbSAnLi4vcmVsYXktbmV0d29yay1sYXllci1tYW5hZ2VyJztcbmltcG9ydCB7VU5BVVRIRU5USUNBVEVELCBJTlNVRkZJQ0lFTlR9IGZyb20gJy4uL3NoYXJlZC9rZXl0YXItc3RyYXRlZ3knO1xuaW1wb3J0IEF1dGhvciwge251bGxBdXRob3J9IGZyb20gJy4uL21vZGVscy9hdXRob3InO1xuaW1wb3J0IEdpdGh1YlRhYkhlYWRlckNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZ2l0aHViLXRhYi1oZWFkZXItY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YlRhYkhlYWRlckNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQ29ubmVjdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFRva2VuUHJvcFR5cGUsXG5cbiAgICAvLyBXb3Jrc3BhY2VcbiAgICBjdXJyZW50V29ya0RpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0Q3VycmVudFdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLnRva2VuID09IG51bGxcbiAgICAgIHx8IHRoaXMucHJvcHMudG9rZW4gaW5zdGFuY2VvZiBFcnJvclxuICAgICAgfHwgdGhpcy5wcm9wcy50b2tlbiA9PT0gVU5BVVRIRU5USUNBVEVEXG4gICAgICB8fCB0aGlzLnByb3BzLnRva2VuID09PSBJTlNVRkZJQ0lFTlRcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlck5vUmVzdWx0KCk7XG4gICAgfVxuXG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KHRoaXMucHJvcHMuZW5kcG9pbnQsIHRoaXMucHJvcHMudG9rZW4pO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZ3JhcGhxbGBcbiAgICAgIHF1ZXJ5IGdpdGh1YlRhYkhlYWRlckNvbnRhaW5lclF1ZXJ5IHtcbiAgICAgICAgdmlld2VyIHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgIGF2YXRhclVybCxcbiAgICAgICAgICBsb2dpblxuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcblxuICAgIHJldHVybiAoXG4gICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICBlbnZpcm9ubWVudD17ZW52aXJvbm1lbnR9XG4gICAgICAgIHZhcmlhYmxlcz17e319XG4gICAgICAgIHF1ZXJ5PXtxdWVyeX1cbiAgICAgICAgcmVuZGVyPXt0aGlzLnJlbmRlcldpdGhSZXN1bHR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXaXRoUmVzdWx0ID0gKHtlcnJvciwgcHJvcHN9KSA9PiB7XG4gICAgaWYgKGVycm9yIHx8IHByb3BzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJOb1Jlc3VsdCgpO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9wcm9wLXR5cGVzXG4gICAgY29uc3Qge2VtYWlsLCBuYW1lLCBhdmF0YXJVcmwsIGxvZ2lufSA9IHByb3BzLnZpZXdlcjtcblxuICAgIHJldHVybiAoXG4gICAgICA8R2l0aHViVGFiSGVhZGVyQ29udHJvbGxlclxuICAgICAgICB1c2VyPXtuZXcgQXV0aG9yKGVtYWlsLCBuYW1lLCBsb2dpbiwgZmFsc2UsIGF2YXRhclVybCl9XG5cbiAgICAgICAgLy8gV29ya3NwYWNlXG4gICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17dGhpcy5wcm9wcy5nZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG5cbiAgICAgICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17dGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTm9SZXN1bHQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRodWJUYWJIZWFkZXJDb250cm9sbGVyXG4gICAgICAgIHVzZXI9e251bGxBdXRob3J9XG5cbiAgICAgICAgLy8gV29ya3NwYWNlXG4gICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG4gICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17dGhpcy5wcm9wcy5nZXRDdXJyZW50V29ya0RpcnN9XG5cbiAgICAgICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17dGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=