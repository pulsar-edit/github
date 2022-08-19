"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _loadingView = _interopRequireDefault(require("./loading-view"));

var _queryErrorView = _interopRequireDefault(require("../views/query-error-view"));

var _githubLoginView = _interopRequireDefault(require("../views/github-login-view"));

var _remoteSelectorView = _interopRequireDefault(require("./remote-selector-view"));

var _githubTabHeaderContainer = _interopRequireDefault(require("../containers/github-tab-header-container"));

var _githubBlankNolocal = _interopRequireDefault(require("./github-blank-nolocal"));

var _githubBlankUninitialized = _interopRequireDefault(require("./github-blank-uninitialized"));

var _githubBlankNoremote = _interopRequireDefault(require("./github-blank-noremote"));

var _remoteContainer = _interopRequireDefault(require("../containers/remote-container"));

var _keytarStrategy = require("../shared/keytar-strategy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitHubTabView extends _react.default.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitHub",
      ref: this.props.rootHolder.setter
    }, this.renderHeader(), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitHub-content"
    }, this.renderRemote()));
  }

  renderRemote() {
    if (this.props.token === null) {
      return /*#__PURE__*/_react.default.createElement(_loadingView.default, null);
    }

    if (this.props.token === _keytarStrategy.UNAUTHENTICATED) {
      return /*#__PURE__*/_react.default.createElement(_githubLoginView.default, {
        onLogin: this.props.handleLogin
      });
    }

    if (this.props.token === _keytarStrategy.INSUFFICIENT) {
      return /*#__PURE__*/_react.default.createElement(_githubLoginView.default, {
        onLogin: this.props.handleLogin
      }, /*#__PURE__*/_react.default.createElement("p", null, "Your token no longer has sufficient authorizations. Please re-authenticate and generate a new one."));
    }

    if (this.props.token instanceof Error) {
      return /*#__PURE__*/_react.default.createElement(_queryErrorView.default, {
        error: this.props.token,
        retry: this.props.handleTokenRetry,
        login: this.props.handleLogin,
        logout: this.props.handleLogout
      });
    }

    if (this.props.isLoading) {
      return /*#__PURE__*/_react.default.createElement(_loadingView.default, null);
    }

    if (this.props.repository.isAbsent() || this.props.repository.isAbsentGuess()) {
      return /*#__PURE__*/_react.default.createElement(_githubBlankNolocal.default, {
        openCreateDialog: this.props.openCreateDialog,
        openCloneDialog: this.props.openCloneDialog
      });
    }

    if (this.props.repository.isEmpty()) {
      return /*#__PURE__*/_react.default.createElement(_githubBlankUninitialized.default, {
        openBoundPublishDialog: this.props.openBoundPublishDialog,
        openGitTab: this.props.openGitTab
      });
    }

    if (this.props.currentRemote.isPresent()) {
      // Single, chosen or unambiguous remote
      return /*#__PURE__*/_react.default.createElement(_remoteContainer.default // Connection
      , {
        endpoint: this.props.currentRemote.getEndpoint(),
        token: this.props.token // Repository attributes
        ,
        refresher: this.props.refresher,
        pushInProgress: this.props.pushInProgress,
        workingDirectory: this.props.workingDirectory,
        workspace: this.props.workspace,
        remote: this.props.currentRemote,
        remotes: this.props.remotes,
        branches: this.props.branches,
        aheadCount: this.props.aheadCount // Action methods
        ,
        handleLogin: this.props.handleLogin,
        handleLogout: this.props.handleLogout,
        onPushBranch: () => this.props.handlePushBranch(this.props.currentBranch, this.props.currentRemote)
      });
    }

    if (this.props.manyRemotesAvailable) {
      // No chosen remote, multiple remotes hosted on GitHub instances
      return /*#__PURE__*/_react.default.createElement(_remoteSelectorView.default, {
        remotes: this.props.remotes,
        currentBranch: this.props.currentBranch,
        selectRemote: this.props.handleRemoteSelect
      });
    }

    return /*#__PURE__*/_react.default.createElement(_githubBlankNoremote.default, {
      openBoundPublishDialog: this.props.openBoundPublishDialog
    });
  }

  renderHeader() {
    return /*#__PURE__*/_react.default.createElement(_githubTabHeaderContainer.default // Connection
    , {
      endpoint: this.props.endpoint,
      token: this.props.token // Workspace
      ,
      currentWorkDir: this.props.workingDirectory,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      getCurrentWorkDirs: this.props.getCurrentWorkDirs // Event Handlers
      ,
      onDidChangeWorkDirs: this.props.onDidChangeWorkDirs
    });
  }

}

exports.default = GitHubTabView;

_defineProperty(GitHubTabView, "propTypes", {
  refresher: _propTypes2.RefresherPropType.isRequired,
  rootHolder: _propTypes2.RefHolderPropType.isRequired,
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes2.TokenPropType,
  // Workspace
  workspace: _propTypes.default.object.isRequired,
  workingDirectory: _propTypes.default.string,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  repository: _propTypes.default.object.isRequired,
  // Remotes
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  currentRemote: _propTypes2.RemotePropType.isRequired,
  manyRemotesAvailable: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Event Handlers
  handleLogin: _propTypes.default.func.isRequired,
  handleLogout: _propTypes.default.func.isRequired,
  handleTokenRetry: _propTypes.default.func.isRequired,
  handleWorkDirSelect: _propTypes.default.func,
  handlePushBranch: _propTypes.default.func.isRequired,
  handleRemoteSelect: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  openCreateDialog: _propTypes.default.func.isRequired,
  openBoundPublishDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItdGFiLXZpZXcuanMiXSwibmFtZXMiOlsiR2l0SHViVGFiVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicHJvcHMiLCJyb290SG9sZGVyIiwic2V0dGVyIiwicmVuZGVySGVhZGVyIiwicmVuZGVyUmVtb3RlIiwidG9rZW4iLCJVTkFVVEhFTlRJQ0FURUQiLCJoYW5kbGVMb2dpbiIsIklOU1VGRklDSUVOVCIsIkVycm9yIiwiaGFuZGxlVG9rZW5SZXRyeSIsImhhbmRsZUxvZ291dCIsImlzTG9hZGluZyIsInJlcG9zaXRvcnkiLCJpc0Fic2VudCIsImlzQWJzZW50R3Vlc3MiLCJvcGVuQ3JlYXRlRGlhbG9nIiwib3BlbkNsb25lRGlhbG9nIiwiaXNFbXB0eSIsIm9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2ciLCJvcGVuR2l0VGFiIiwiY3VycmVudFJlbW90ZSIsImlzUHJlc2VudCIsImdldEVuZHBvaW50IiwicmVmcmVzaGVyIiwicHVzaEluUHJvZ3Jlc3MiLCJ3b3JraW5nRGlyZWN0b3J5Iiwid29ya3NwYWNlIiwicmVtb3RlcyIsImJyYW5jaGVzIiwiYWhlYWRDb3VudCIsImhhbmRsZVB1c2hCcmFuY2giLCJjdXJyZW50QnJhbmNoIiwibWFueVJlbW90ZXNBdmFpbGFibGUiLCJoYW5kbGVSZW1vdGVTZWxlY3QiLCJlbmRwb2ludCIsImNvbnRleHRMb2NrZWQiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwic2V0Q29udGV4dExvY2siLCJnZXRDdXJyZW50V29ya0RpcnMiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwiUmVmcmVzaGVyUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUmVmSG9sZGVyUHJvcFR5cGUiLCJFbmRwb2ludFByb3BUeXBlIiwiVG9rZW5Qcm9wVHlwZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsInN0cmluZyIsImZ1bmMiLCJib29sIiwiUmVtb3RlU2V0UHJvcFR5cGUiLCJSZW1vdGVQcm9wVHlwZSIsIkJyYW5jaFNldFByb3BUeXBlIiwiQnJhbmNoUHJvcFR5cGUiLCJudW1iZXIiLCJoYW5kbGVXb3JrRGlyU2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGFBQU4sU0FBNEJDLGVBQU1DLFNBQWxDLENBQTRDO0FBMEN6REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1Asd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQStCLE1BQUEsR0FBRyxFQUFFLEtBQUtDLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQkM7QUFBMUQsT0FDRyxLQUFLQyxZQUFMLEVBREgsZUFFRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRyxLQUFLQyxZQUFMLEVBREgsQ0FGRixDQURGO0FBUUQ7O0FBRURBLEVBQUFBLFlBQVksR0FBRztBQUNiLFFBQUksS0FBS0osS0FBTCxDQUFXSyxLQUFYLEtBQXFCLElBQXpCLEVBQStCO0FBQzdCLDBCQUFPLDZCQUFDLG9CQUFELE9BQVA7QUFDRDs7QUFFRCxRQUFJLEtBQUtMLEtBQUwsQ0FBV0ssS0FBWCxLQUFxQkMsK0JBQXpCLEVBQTBDO0FBQ3hDLDBCQUFPLDZCQUFDLHdCQUFEO0FBQWlCLFFBQUEsT0FBTyxFQUFFLEtBQUtOLEtBQUwsQ0FBV087QUFBckMsUUFBUDtBQUNEOztBQUVELFFBQUksS0FBS1AsS0FBTCxDQUFXSyxLQUFYLEtBQXFCRyw0QkFBekIsRUFBdUM7QUFDckMsMEJBQ0UsNkJBQUMsd0JBQUQ7QUFBaUIsUUFBQSxPQUFPLEVBQUUsS0FBS1IsS0FBTCxDQUFXTztBQUFyQyxzQkFDRSw2SUFERixDQURGO0FBT0Q7O0FBRUQsUUFBSSxLQUFLUCxLQUFMLENBQVdLLEtBQVgsWUFBNEJJLEtBQWhDLEVBQXVDO0FBQ3JDLDBCQUNFLDZCQUFDLHVCQUFEO0FBQ0UsUUFBQSxLQUFLLEVBQUUsS0FB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dEIsRUFBQUEsVUFBVSxFQUFFMEIsbUJBQVVHLElBQVYsQ0FBZVA7QUF0Q1YsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1xuICBUb2tlblByb3BUeXBlLCBFbmRwb2ludFByb3BUeXBlLCBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgUmVtb3RlU2V0UHJvcFR5cGUsIFJlbW90ZVByb3BUeXBlLCBCcmFuY2hTZXRQcm9wVHlwZSwgQnJhbmNoUHJvcFR5cGUsXG4gIFJlZnJlc2hlclByb3BUeXBlLFxufSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBMb2FkaW5nVmlldyBmcm9tICcuL2xvYWRpbmctdmlldyc7XG5pbXBvcnQgUXVlcnlFcnJvclZpZXcgZnJvbSAnLi4vdmlld3MvcXVlcnktZXJyb3Itdmlldyc7XG5pbXBvcnQgR2l0aHViTG9naW5WaWV3IGZyb20gJy4uL3ZpZXdzL2dpdGh1Yi1sb2dpbi12aWV3JztcbmltcG9ydCBSZW1vdGVTZWxlY3RvclZpZXcgZnJvbSAnLi9yZW1vdGUtc2VsZWN0b3Itdmlldyc7XG5pbXBvcnQgR2l0aHViVGFiSGVhZGVyQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvZ2l0aHViLXRhYi1oZWFkZXItY29udGFpbmVyJztcbmltcG9ydCBHaXRIdWJCbGFua05vTG9jYWwgZnJvbSAnLi9naXRodWItYmxhbmstbm9sb2NhbCc7XG5pbXBvcnQgR2l0SHViQmxhbmtVbmluaXRpYWxpemVkIGZyb20gJy4vZ2l0aHViLWJsYW5rLXVuaW5pdGlhbGl6ZWQnO1xuaW1wb3J0IEdpdEh1YkJsYW5rTm9SZW1vdGUgZnJvbSAnLi9naXRodWItYmxhbmstbm9yZW1vdGUnO1xuaW1wb3J0IFJlbW90ZUNvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL3JlbW90ZS1jb250YWluZXInO1xuaW1wb3J0IHtVTkFVVEhFTlRJQ0FURUQsIElOU1VGRklDSUVOVH0gZnJvbSAnLi4vc2hhcmVkL2tleXRhci1zdHJhdGVneSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdEh1YlRhYlZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlZnJlc2hlcjogUmVmcmVzaGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByb290SG9sZGVyOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29ubmVjdGlvblxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgdG9rZW46IFRva2VuUHJvcFR5cGUsXG5cbiAgICAvLyBXb3Jrc3BhY2VcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUmVtb3Rlc1xuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudFJlbW90ZTogUmVtb3RlUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBtYW55UmVtb3Rlc0F2YWlsYWJsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudEJyYW5jaDogQnJhbmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBhaGVhZENvdW50OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHB1c2hJblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICBoYW5kbGVMb2dpbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVMb2dvdXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlVG9rZW5SZXRyeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVXb3JrRGlyU2VsZWN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVQdXNoQnJhbmNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZVJlbW90ZVNlbGVjdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5DcmVhdGVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkJvdW5kUHVibGlzaERpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ2xvbmVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkdpdFRhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViXCIgcmVmPXt0aGlzLnByb3BzLnJvb3RIb2xkZXIuc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdEh1Yi1jb250ZW50XCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmVtb3RlKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlbW90ZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy50b2tlbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nVmlldyAvPjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy50b2tlbiA9PT0gVU5BVVRIRU5USUNBVEVEKSB7XG4gICAgICByZXR1cm4gPEdpdGh1YkxvZ2luVmlldyBvbkxvZ2luPXt0aGlzLnByb3BzLmhhbmRsZUxvZ2lufSAvPjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy50b2tlbiA9PT0gSU5TVUZGSUNJRU5UKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8R2l0aHViTG9naW5WaWV3IG9uTG9naW49e3RoaXMucHJvcHMuaGFuZGxlTG9naW59PlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgWW91ciB0b2tlbiBubyBsb25nZXIgaGFzIHN1ZmZpY2llbnQgYXV0aG9yaXphdGlvbnMuIFBsZWFzZSByZS1hdXRoZW50aWNhdGUgYW5kIGdlbmVyYXRlIGEgbmV3IG9uZS5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvR2l0aHViTG9naW5WaWV3PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy50b2tlbiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UXVlcnlFcnJvclZpZXdcbiAgICAgICAgICBlcnJvcj17dGhpcy5wcm9wcy50b2tlbn1cbiAgICAgICAgICByZXRyeT17dGhpcy5wcm9wcy5oYW5kbGVUb2tlblJldHJ5fVxuICAgICAgICAgIGxvZ2luPXt0aGlzLnByb3BzLmhhbmRsZUxvZ2lufVxuICAgICAgICAgIGxvZ291dD17dGhpcy5wcm9wcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmlzTG9hZGluZykge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nVmlldyAvPjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzQWJzZW50KCkgfHwgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzQWJzZW50R3Vlc3MoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEdpdEh1YkJsYW5rTm9Mb2NhbFxuICAgICAgICAgIG9wZW5DcmVhdGVEaWFsb2c9e3RoaXMucHJvcHMub3BlbkNyZWF0ZURpYWxvZ31cbiAgICAgICAgICBvcGVuQ2xvbmVEaWFsb2c9e3RoaXMucHJvcHMub3BlbkNsb25lRGlhbG9nfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEdpdEh1YkJsYW5rVW5pbml0aWFsaXplZFxuICAgICAgICAgIG9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2c9e3RoaXMucHJvcHMub3BlbkJvdW5kUHVibGlzaERpYWxvZ31cbiAgICAgICAgICBvcGVuR2l0VGFiPXt0aGlzLnByb3BzLm9wZW5HaXRUYWJ9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCkpIHtcbiAgICAgIC8vIFNpbmdsZSwgY2hvc2VuIG9yIHVuYW1iaWd1b3VzIHJlbW90ZVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJlbW90ZUNvbnRhaW5lclxuICAgICAgICAgIC8vIENvbm5lY3Rpb25cbiAgICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5jdXJyZW50UmVtb3RlLmdldEVuZHBvaW50KCl9XG4gICAgICAgICAgdG9rZW49e3RoaXMucHJvcHMudG9rZW59XG5cbiAgICAgICAgICAvLyBSZXBvc2l0b3J5IGF0dHJpYnV0ZXNcbiAgICAgICAgICByZWZyZXNoZXI9e3RoaXMucHJvcHMucmVmcmVzaGVyfVxuICAgICAgICAgIHB1c2hJblByb2dyZXNzPXt0aGlzLnByb3BzLnB1c2hJblByb2dyZXNzfVxuICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHJlbW90ZT17dGhpcy5wcm9wcy5jdXJyZW50UmVtb3RlfVxuICAgICAgICAgIHJlbW90ZXM9e3RoaXMucHJvcHMucmVtb3Rlc31cbiAgICAgICAgICBicmFuY2hlcz17dGhpcy5wcm9wcy5icmFuY2hlc31cbiAgICAgICAgICBhaGVhZENvdW50PXt0aGlzLnByb3BzLmFoZWFkQ291bnR9XG5cbiAgICAgICAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgICAgICAgIGhhbmRsZUxvZ2luPXt0aGlzLnByb3BzLmhhbmRsZUxvZ2lufVxuICAgICAgICAgIGhhbmRsZUxvZ291dD17dGhpcy5wcm9wcy5oYW5kbGVMb2dvdXR9XG4gICAgICAgICAgb25QdXNoQnJhbmNoPXsoKSA9PiB0aGlzLnByb3BzLmhhbmRsZVB1c2hCcmFuY2godGhpcy5wcm9wcy5jdXJyZW50QnJhbmNoLCB0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGUpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tYW55UmVtb3Rlc0F2YWlsYWJsZSkge1xuICAgICAgLy8gTm8gY2hvc2VuIHJlbW90ZSwgbXVsdGlwbGUgcmVtb3RlcyBob3N0ZWQgb24gR2l0SHViIGluc3RhbmNlc1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJlbW90ZVNlbGVjdG9yVmlld1xuICAgICAgICAgIHJlbW90ZXM9e3RoaXMucHJvcHMucmVtb3Rlc31cbiAgICAgICAgICBjdXJyZW50QnJhbmNoPXt0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2h9XG4gICAgICAgICAgc2VsZWN0UmVtb3RlPXt0aGlzLnByb3BzLmhhbmRsZVJlbW90ZVNlbGVjdH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRIdWJCbGFua05vUmVtb3RlIG9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2c9e3RoaXMucHJvcHMub3BlbkJvdW5kUHVibGlzaERpYWxvZ30gLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0aHViVGFiSGVhZGVyQ29udGFpbmVyXG4gICAgICAgIC8vIENvbm5lY3Rpb25cbiAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgIHRva2VuPXt0aGlzLnByb3BzLnRva2VufVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG4gICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17dGhpcy5wcm9wcy5nZXRDdXJyZW50V29ya0RpcnN9XG5cbiAgICAgICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17dGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=