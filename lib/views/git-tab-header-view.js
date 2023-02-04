"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _path = _interopRequireDefault(require("path"));
var _propTypes2 = require("../prop-types");
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GitTabHeaderView extends _react.default.Component {
  render() {
    const lockIcon = this.props.contextLocked ? 'lock' : 'unlock';
    const lockToggleTitle = this.props.contextLocked ? 'Change repository with the dropdown' : 'Follow the active pane item';
    return _react.default.createElement("header", {
      className: "github-Project"
    }, this.renderCommitter(), _react.default.createElement("select", {
      className: "github-Project-path input-select",
      value: this.props.workdir || '',
      onChange: this.props.handleWorkDirSelect,
      disabled: this.props.changingWorkDir
    }, this.renderWorkDirs()), _react.default.createElement("button", {
      className: "github-Project-lock btn btn-small",
      onClick: this.props.handleLockToggle,
      disabled: this.props.changingLock,
      title: lockToggleTitle
    }, _react.default.createElement(_octicon.default, {
      icon: lockIcon
    })));
  }
  renderWorkDirs() {
    const workdirs = [];
    for (const workdir of this.props.workdirs) {
      workdirs.push(_react.default.createElement("option", {
        key: workdir,
        value: _path.default.normalize(workdir)
      }, _path.default.basename(workdir)));
    }
    return workdirs;
  }
  renderCommitter() {
    const email = this.props.committer.getEmail();
    const avatarUrl = this.props.committer.getAvatarUrl();
    const name = this.props.committer.getFullName();
    return _react.default.createElement("button", {
      className: "github-Project-avatarBtn",
      onClick: this.props.handleAvatarClick
    }, _react.default.createElement("img", {
      className: "github-Project-avatar",
      src: avatarUrl || 'atom://github/img/avatar.svg',
      title: `${name} ${email}`,
      alt: `${name}'s avatar`
    }));
  }
}
exports.default = GitTabHeaderView;
_defineProperty(GitTabHeaderView, "propTypes", {
  committer: _propTypes2.AuthorPropType.isRequired,
  // Workspace
  workdir: _propTypes.default.string,
  workdirs: _propTypes.default.shape({
    [Symbol.iterator]: _propTypes.default.func.isRequired
  }).isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  changingWorkDir: _propTypes.default.bool.isRequired,
  changingLock: _propTypes.default.bool.isRequired,
  // Event Handlers
  handleAvatarClick: _propTypes.default.func,
  handleWorkDirSelect: _propTypes.default.func,
  handleLockToggle: _propTypes.default.func
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRUYWJIZWFkZXJWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJsb2NrSWNvbiIsInByb3BzIiwiY29udGV4dExvY2tlZCIsImxvY2tUb2dnbGVUaXRsZSIsInJlbmRlckNvbW1pdHRlciIsIndvcmtkaXIiLCJoYW5kbGVXb3JrRGlyU2VsZWN0IiwiY2hhbmdpbmdXb3JrRGlyIiwicmVuZGVyV29ya0RpcnMiLCJoYW5kbGVMb2NrVG9nZ2xlIiwiY2hhbmdpbmdMb2NrIiwid29ya2RpcnMiLCJwdXNoIiwicGF0aCIsIm5vcm1hbGl6ZSIsImJhc2VuYW1lIiwiZW1haWwiLCJjb21taXR0ZXIiLCJnZXRFbWFpbCIsImF2YXRhclVybCIsImdldEF2YXRhclVybCIsIm5hbWUiLCJnZXRGdWxsTmFtZSIsImhhbmRsZUF2YXRhckNsaWNrIiwiQXV0aG9yUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwic2hhcGUiLCJTeW1ib2wiLCJpdGVyYXRvciIsImZ1bmMiLCJib29sIl0sInNvdXJjZXMiOlsiZ2l0LXRhYi1oZWFkZXItdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge0F1dGhvclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYkhlYWRlclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbW1pdHRlcjogQXV0aG9yUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFdvcmtzcGFjZVxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgd29ya2RpcnM6IFByb3BUeXBlcy5zaGFwZSh7W1N5bWJvbC5pdGVyYXRvcl06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWR9KS5pc1JlcXVpcmVkLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdpbmdXb3JrRGlyOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5naW5nTG9jazogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgaGFuZGxlQXZhdGFyQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICAgIGhhbmRsZVdvcmtEaXJTZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgIGhhbmRsZUxvY2tUb2dnbGU6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGxvY2tJY29uID0gdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkID8gJ2xvY2snIDogJ3VubG9jayc7XG4gICAgY29uc3QgbG9ja1RvZ2dsZVRpdGxlID0gdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkID9cbiAgICAgICdDaGFuZ2UgcmVwb3NpdG9yeSB3aXRoIHRoZSBkcm9wZG93bicgOlxuICAgICAgJ0ZvbGxvdyB0aGUgYWN0aXZlIHBhbmUgaXRlbSc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUHJvamVjdFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21taXR0ZXIoKX1cbiAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJnaXRodWItUHJvamVjdC1wYXRoIGlucHV0LXNlbGVjdFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMud29ya2RpciB8fCAnJ31cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy5oYW5kbGVXb3JrRGlyU2VsZWN0fVxuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmNoYW5naW5nV29ya0Rpcn0+XG4gICAgICAgICAge3RoaXMucmVuZGVyV29ya0RpcnMoKX1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVByb2plY3QtbG9jayBidG4gYnRuLXNtYWxsXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmhhbmRsZUxvY2tUb2dnbGV9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuY2hhbmdpbmdMb2NrfVxuICAgICAgICAgIHRpdGxlPXtsb2NrVG9nZ2xlVGl0bGV9PlxuICAgICAgICAgIDxPY3RpY29uIGljb249e2xvY2tJY29ufSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvaGVhZGVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJXb3JrRGlycygpIHtcbiAgICBjb25zdCB3b3JrZGlycyA9IFtdO1xuICAgIGZvciAoY29uc3Qgd29ya2RpciBvZiB0aGlzLnByb3BzLndvcmtkaXJzKSB7XG4gICAgICB3b3JrZGlycy5wdXNoKDxvcHRpb24ga2V5PXt3b3JrZGlyfSB2YWx1ZT17cGF0aC5ub3JtYWxpemUod29ya2Rpcil9PntwYXRoLmJhc2VuYW1lKHdvcmtkaXIpfTwvb3B0aW9uPik7XG4gICAgfVxuICAgIHJldHVybiB3b3JrZGlycztcbiAgfVxuXG4gIHJlbmRlckNvbW1pdHRlcigpIHtcbiAgICBjb25zdCBlbWFpbCA9IHRoaXMucHJvcHMuY29tbWl0dGVyLmdldEVtYWlsKCk7XG4gICAgY29uc3QgYXZhdGFyVXJsID0gdGhpcy5wcm9wcy5jb21taXR0ZXIuZ2V0QXZhdGFyVXJsKCk7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMucHJvcHMuY29tbWl0dGVyLmdldEZ1bGxOYW1lKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItUHJvamVjdC1hdmF0YXJCdG5cIiBvbkNsaWNrPXt0aGlzLnByb3BzLmhhbmRsZUF2YXRhckNsaWNrfT5cbiAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUHJvamVjdC1hdmF0YXJcIlxuICAgICAgICAgIHNyYz17YXZhdGFyVXJsIHx8ICdhdG9tOi8vZ2l0aHViL2ltZy9hdmF0YXIuc3ZnJ31cbiAgICAgICAgICB0aXRsZT17YCR7bmFtZX0gJHtlbWFpbH1gfVxuICAgICAgICAgIGFsdD17YCR7bmFtZX0ncyBhdmF0YXJgfVxuICAgICAgICAvPlxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQXNDO0FBQUE7QUFBQTtBQUFBO0FBRXZCLE1BQU1BLGdCQUFnQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWlCNURDLE1BQU0sR0FBRztJQUNQLE1BQU1DLFFBQVEsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsYUFBYSxHQUFHLE1BQU0sR0FBRyxRQUFRO0lBQzdELE1BQU1DLGVBQWUsR0FBRyxJQUFJLENBQUNGLEtBQUssQ0FBQ0MsYUFBYSxHQUM5QyxxQ0FBcUMsR0FDckMsNkJBQTZCO0lBRS9CLE9BQ0U7TUFBUSxTQUFTLEVBQUM7SUFBZ0IsR0FDL0IsSUFBSSxDQUFDRSxlQUFlLEVBQUUsRUFDdkI7TUFBUSxTQUFTLEVBQUMsa0NBQWtDO01BQ2xELEtBQUssRUFBRSxJQUFJLENBQUNILEtBQUssQ0FBQ0ksT0FBTyxJQUFJLEVBQUc7TUFDaEMsUUFBUSxFQUFFLElBQUksQ0FBQ0osS0FBSyxDQUFDSyxtQkFBb0I7TUFDekMsUUFBUSxFQUFFLElBQUksQ0FBQ0wsS0FBSyxDQUFDTTtJQUFnQixHQUNwQyxJQUFJLENBQUNDLGNBQWMsRUFBRSxDQUNmLEVBQ1Q7TUFBUSxTQUFTLEVBQUMsbUNBQW1DO01BQ25ELE9BQU8sRUFBRSxJQUFJLENBQUNQLEtBQUssQ0FBQ1EsZ0JBQWlCO01BQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUNSLEtBQUssQ0FBQ1MsWUFBYTtNQUNsQyxLQUFLLEVBQUVQO0lBQWdCLEdBQ3ZCLDZCQUFDLGdCQUFPO01BQUMsSUFBSSxFQUFFSDtJQUFTLEVBQUcsQ0FDcEIsQ0FDRjtFQUViO0VBRUFRLGNBQWMsR0FBRztJQUNmLE1BQU1HLFFBQVEsR0FBRyxFQUFFO0lBQ25CLEtBQUssTUFBTU4sT0FBTyxJQUFJLElBQUksQ0FBQ0osS0FBSyxDQUFDVSxRQUFRLEVBQUU7TUFDekNBLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDO1FBQVEsR0FBRyxFQUFFUCxPQUFRO1FBQUMsS0FBSyxFQUFFUSxhQUFJLENBQUNDLFNBQVMsQ0FBQ1QsT0FBTztNQUFFLEdBQUVRLGFBQUksQ0FBQ0UsUUFBUSxDQUFDVixPQUFPLENBQUMsQ0FBVSxDQUFDO0lBQ3hHO0lBQ0EsT0FBT00sUUFBUTtFQUNqQjtFQUVBUCxlQUFlLEdBQUc7SUFDaEIsTUFBTVksS0FBSyxHQUFHLElBQUksQ0FBQ2YsS0FBSyxDQUFDZ0IsU0FBUyxDQUFDQyxRQUFRLEVBQUU7SUFDN0MsTUFBTUMsU0FBUyxHQUFHLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ2dCLFNBQVMsQ0FBQ0csWUFBWSxFQUFFO0lBQ3JELE1BQU1DLElBQUksR0FBRyxJQUFJLENBQUNwQixLQUFLLENBQUNnQixTQUFTLENBQUNLLFdBQVcsRUFBRTtJQUUvQyxPQUNFO01BQVEsU0FBUyxFQUFDLDBCQUEwQjtNQUFDLE9BQU8sRUFBRSxJQUFJLENBQUNyQixLQUFLLENBQUNzQjtJQUFrQixHQUNqRjtNQUFLLFNBQVMsRUFBQyx1QkFBdUI7TUFDcEMsR0FBRyxFQUFFSixTQUFTLElBQUksOEJBQStCO01BQ2pELEtBQUssRUFBRyxHQUFFRSxJQUFLLElBQUdMLEtBQU0sRUFBRTtNQUMxQixHQUFHLEVBQUcsR0FBRUssSUFBSztJQUFXLEVBQ3hCLENBQ0s7RUFFYjtBQUNGO0FBQUM7QUFBQSxnQkFqRW9CekIsZ0JBQWdCLGVBQ2hCO0VBQ2pCcUIsU0FBUyxFQUFFTywwQkFBYyxDQUFDQyxVQUFVO0VBRXBDO0VBQ0FwQixPQUFPLEVBQUVxQixrQkFBUyxDQUFDQyxNQUFNO0VBQ3pCaEIsUUFBUSxFQUFFZSxrQkFBUyxDQUFDRSxLQUFLLENBQUM7SUFBQyxDQUFDQyxNQUFNLENBQUNDLFFBQVEsR0FBR0osa0JBQVMsQ0FBQ0ssSUFBSSxDQUFDTjtFQUFVLENBQUMsQ0FBQyxDQUFDQSxVQUFVO0VBQ3BGdkIsYUFBYSxFQUFFd0Isa0JBQVMsQ0FBQ00sSUFBSSxDQUFDUCxVQUFVO0VBQ3hDbEIsZUFBZSxFQUFFbUIsa0JBQVMsQ0FBQ00sSUFBSSxDQUFDUCxVQUFVO0VBQzFDZixZQUFZLEVBQUVnQixrQkFBUyxDQUFDTSxJQUFJLENBQUNQLFVBQVU7RUFFdkM7RUFDQUYsaUJBQWlCLEVBQUVHLGtCQUFTLENBQUNLLElBQUk7RUFDakN6QixtQkFBbUIsRUFBRW9CLGtCQUFTLENBQUNLLElBQUk7RUFDbkN0QixnQkFBZ0IsRUFBRWlCLGtCQUFTLENBQUNLO0FBQzlCLENBQUMifQ==