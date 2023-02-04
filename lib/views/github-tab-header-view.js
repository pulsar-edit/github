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
class GithubTabHeaderView extends _react.default.Component {
  render() {
    const lockIcon = this.props.contextLocked ? 'lock' : 'unlock';
    const lockToggleTitle = this.props.contextLocked ? 'Change repository with the dropdown' : 'Follow the active pane item';
    return _react.default.createElement("header", {
      className: "github-Project"
    }, this.renderUser(), _react.default.createElement("select", {
      className: "github-Project-path input-select",
      value: this.props.workdir || '',
      disabled: this.props.changingWorkDir,
      onChange: this.props.handleWorkDirChange
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
  renderUser() {
    const login = this.props.user.getLogin();
    const avatarUrl = this.props.user.getAvatarUrl();
    return _react.default.createElement("img", {
      className: "github-Project-avatar",
      src: avatarUrl || 'atom://github/img/avatar.svg',
      title: `@${login}`,
      alt: `@${login}'s avatar`
    });
  }
}
exports.default = GithubTabHeaderView;
_defineProperty(GithubTabHeaderView, "propTypes", {
  user: _propTypes2.AuthorPropType.isRequired,
  // Workspace
  workdir: _propTypes.default.string,
  workdirs: _propTypes.default.shape({
    [Symbol.iterator]: _propTypes.default.func.isRequired
  }).isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  changingWorkDir: _propTypes.default.bool.isRequired,
  changingLock: _propTypes.default.bool.isRequired,
  handleWorkDirChange: _propTypes.default.func.isRequired,
  handleLockToggle: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRodWJUYWJIZWFkZXJWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJsb2NrSWNvbiIsInByb3BzIiwiY29udGV4dExvY2tlZCIsImxvY2tUb2dnbGVUaXRsZSIsInJlbmRlclVzZXIiLCJ3b3JrZGlyIiwiY2hhbmdpbmdXb3JrRGlyIiwiaGFuZGxlV29ya0RpckNoYW5nZSIsInJlbmRlcldvcmtEaXJzIiwiaGFuZGxlTG9ja1RvZ2dsZSIsImNoYW5naW5nTG9jayIsIndvcmtkaXJzIiwicHVzaCIsInBhdGgiLCJub3JtYWxpemUiLCJiYXNlbmFtZSIsImxvZ2luIiwidXNlciIsImdldExvZ2luIiwiYXZhdGFyVXJsIiwiZ2V0QXZhdGFyVXJsIiwiQXV0aG9yUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwic2hhcGUiLCJTeW1ib2wiLCJpdGVyYXRvciIsImZ1bmMiLCJib29sIl0sInNvdXJjZXMiOlsiZ2l0aHViLXRhYi1oZWFkZXItdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge0F1dGhvclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YlRhYkhlYWRlclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHVzZXI6IEF1dGhvclByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBXb3Jrc3BhY2VcbiAgICB3b3JrZGlyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHdvcmtkaXJzOiBQcm9wVHlwZXMuc2hhcGUoe1tTeW1ib2wuaXRlcmF0b3JdOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkfSkuaXNSZXF1aXJlZCxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5naW5nV29ya0RpcjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2luZ0xvY2s6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlV29ya0RpckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVMb2NrVG9nZ2xlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGxvY2tJY29uID0gdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkID8gJ2xvY2snIDogJ3VubG9jayc7XG4gICAgY29uc3QgbG9ja1RvZ2dsZVRpdGxlID0gdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkID9cbiAgICAgICdDaGFuZ2UgcmVwb3NpdG9yeSB3aXRoIHRoZSBkcm9wZG93bicgOlxuICAgICAgJ0ZvbGxvdyB0aGUgYWN0aXZlIHBhbmUgaXRlbSc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUHJvamVjdFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJVc2VyKCl9XG4gICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZ2l0aHViLVByb2plY3QtcGF0aCBpbnB1dC1zZWxlY3RcIlxuICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLndvcmtkaXIgfHwgJyd9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuY2hhbmdpbmdXb3JrRGlyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLmhhbmRsZVdvcmtEaXJDaGFuZ2V9PlxuICAgICAgICAgIHt0aGlzLnJlbmRlcldvcmtEaXJzKCl9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1Qcm9qZWN0LWxvY2sgYnRuIGJ0bi1zbWFsbFwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5oYW5kbGVMb2NrVG9nZ2xlfVxuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmNoYW5naW5nTG9ja31cbiAgICAgICAgICB0aXRsZT17bG9ja1RvZ2dsZVRpdGxlfT5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPXtsb2NrSWNvbn0gLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2hlYWRlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV29ya0RpcnMoKSB7XG4gICAgY29uc3Qgd29ya2RpcnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHdvcmtkaXIgb2YgdGhpcy5wcm9wcy53b3JrZGlycykge1xuICAgICAgd29ya2RpcnMucHVzaCg8b3B0aW9uIGtleT17d29ya2Rpcn0gdmFsdWU9e3BhdGgubm9ybWFsaXplKHdvcmtkaXIpfT57cGF0aC5iYXNlbmFtZSh3b3JrZGlyKX08L29wdGlvbj4pO1xuICAgIH1cbiAgICByZXR1cm4gd29ya2RpcnM7XG4gIH1cblxuICByZW5kZXJVc2VyKCkge1xuICAgIGNvbnN0IGxvZ2luID0gdGhpcy5wcm9wcy51c2VyLmdldExvZ2luKCk7XG4gICAgY29uc3QgYXZhdGFyVXJsID0gdGhpcy5wcm9wcy51c2VyLmdldEF2YXRhclVybCgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLVByb2plY3QtYXZhdGFyXCJcbiAgICAgICAgc3JjPXthdmF0YXJVcmwgfHwgJ2F0b206Ly9naXRodWIvaW1nL2F2YXRhci5zdmcnfVxuICAgICAgICB0aXRsZT17YEAke2xvZ2lufWB9XG4gICAgICAgIGFsdD17YEAke2xvZ2lufSdzIGF2YXRhcmB9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFzQztBQUFB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