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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GithubTabHeaderContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderWithResult", ({
      error,
      props
    }) => {
      if (error || props === null) {
        return this.renderNoResult();
      }

      // eslint-disable-next-line react/prop-types
      const {
        email,
        name,
        avatarUrl,
        login
      } = props.viewer;
      return _react.default.createElement(_githubTabHeaderController.default, {
        user: new _author.default(email, name, login, false, avatarUrl)

        // Workspace
        ,
        currentWorkDir: this.props.currentWorkDir,
        contextLocked: this.props.contextLocked,
        getCurrentWorkDirs: this.props.getCurrentWorkDirs,
        changeWorkingDirectory: this.props.changeWorkingDirectory,
        setContextLock: this.props.setContextLock

        // Event Handlers
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
      user: _author.nullAuthor

      // Workspace
      ,
      currentWorkDir: this.props.currentWorkDir,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs

      // Event Handlers
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRodWJUYWJIZWFkZXJDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImVycm9yIiwicHJvcHMiLCJyZW5kZXJOb1Jlc3VsdCIsImVtYWlsIiwibmFtZSIsImF2YXRhclVybCIsImxvZ2luIiwidmlld2VyIiwiQXV0aG9yIiwiY3VycmVudFdvcmtEaXIiLCJjb250ZXh0TG9ja2VkIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsInJlbmRlciIsInRva2VuIiwiRXJyb3IiLCJVTkFVVEhFTlRJQ0FURUQiLCJJTlNVRkZJQ0lFTlQiLCJlbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsImVuZHBvaW50IiwicXVlcnkiLCJyZW5kZXJXaXRoUmVzdWx0IiwibnVsbEF1dGhvciIsIkVuZHBvaW50UHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiVG9rZW5Qcm9wVHlwZSIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJmdW5jIl0sInNvdXJjZXMiOlsiZ2l0aHViLXRhYi1oZWFkZXItY29udGFpbmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtRdWVyeVJlbmRlcmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7RW5kcG9pbnRQcm9wVHlwZSwgVG9rZW5Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQge1VOQVVUSEVOVElDQVRFRCwgSU5TVUZGSUNJRU5UfSBmcm9tICcuLi9zaGFyZWQva2V5dGFyLXN0cmF0ZWd5JztcbmltcG9ydCBBdXRob3IsIHtudWxsQXV0aG9yfSBmcm9tICcuLi9tb2RlbHMvYXV0aG9yJztcbmltcG9ydCBHaXRodWJUYWJIZWFkZXJDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2dpdGh1Yi10YWItaGVhZGVyLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRodWJUYWJIZWFkZXJDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIENvbm5lY3Rpb25cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHRva2VuOiBUb2tlblByb3BUeXBlLFxuXG4gICAgLy8gV29ya3NwYWNlXG4gICAgY3VycmVudFdvcmtEaXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgb25EaWRDaGFuZ2VXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy50b2tlbiA9PSBudWxsXG4gICAgICB8fCB0aGlzLnByb3BzLnRva2VuIGluc3RhbmNlb2YgRXJyb3JcbiAgICAgIHx8IHRoaXMucHJvcHMudG9rZW4gPT09IFVOQVVUSEVOVElDQVRFRFxuICAgICAgfHwgdGhpcy5wcm9wcy50b2tlbiA9PT0gSU5TVUZGSUNJRU5UXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJOb1Jlc3VsdCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdCh0aGlzLnByb3BzLmVuZHBvaW50LCB0aGlzLnByb3BzLnRva2VuKTtcbiAgICBjb25zdCBxdWVyeSA9IGdyYXBocWxgXG4gICAgICBxdWVyeSBnaXRodWJUYWJIZWFkZXJDb250YWluZXJRdWVyeSB7XG4gICAgICAgIHZpZXdlciB7XG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICBhdmF0YXJVcmwsXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFF1ZXJ5UmVuZGVyZXJcbiAgICAgICAgZW52aXJvbm1lbnQ9e2Vudmlyb25tZW50fVxuICAgICAgICB2YXJpYWJsZXM9e3t9fVxuICAgICAgICBxdWVyeT17cXVlcnl9XG4gICAgICAgIHJlbmRlcj17dGhpcy5yZW5kZXJXaXRoUmVzdWx0fVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aFJlc3VsdCA9ICh7ZXJyb3IsIHByb3BzfSkgPT4ge1xuICAgIGlmIChlcnJvciB8fCBwcm9wcyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTm9SZXN1bHQoKTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QvcHJvcC10eXBlc1xuICAgIGNvbnN0IHtlbWFpbCwgbmFtZSwgYXZhdGFyVXJsLCBsb2dpbn0gPSBwcm9wcy52aWV3ZXI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdpdGh1YlRhYkhlYWRlckNvbnRyb2xsZXJcbiAgICAgICAgdXNlcj17bmV3IEF1dGhvcihlbWFpbCwgbmFtZSwgbG9naW4sIGZhbHNlLCBhdmF0YXJVcmwpfVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e3RoaXMucHJvcHMuZ2V0Q3VycmVudFdvcmtEaXJzfVxuICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuXG4gICAgICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e3RoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck5vUmVzdWx0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0aHViVGFiSGVhZGVyQ29udHJvbGxlclxuICAgICAgICB1c2VyPXtudWxsQXV0aG9yfVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e3RoaXMucHJvcHMuZ2V0Q3VycmVudFdvcmtEaXJzfVxuXG4gICAgICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e3RoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgIC8+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