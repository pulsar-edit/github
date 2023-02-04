"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GitHubBlankNoRemote;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* istanbul ignore file */

function GitHubBlankNoRemote(props) {
  return _react.default.createElement("div", {
    className: "github-Local-NoRemotes github-Blank"
  }, _react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), _react.default.createElement("p", {
    className: "github-Blank-context"
  }, "This repository has no remotes on GitHub."), _react.default.createElement("p", {
    className: "github-Blank-option github-Blank-option--explained"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-globe",
    onClick: props.openBoundPublishDialog
  }, "Publish on GitHub...")), _react.default.createElement("p", {
    className: "github-Blank-explanation"
  }, "Create a new GitHub repository and configure this git repository configured to push there."));
}
GitHubBlankNoRemote.propTypes = {
  openBoundPublishDialog: _propTypes.default.func.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRIdWJCbGFua05vUmVtb3RlIiwicHJvcHMiLCJvcGVuQm91bmRQdWJsaXNoRGlhbG9nIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwic291cmNlcyI6WyJnaXRodWItYmxhbmstbm9yZW1vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdpdEh1YkJsYW5rTm9SZW1vdGUocHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Mb2NhbC1Ob1JlbW90ZXMgZ2l0aHViLUJsYW5rXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1MYXJnZUljb24gaWNvbiBpY29uLW1hcmstZ2l0aHViXCIgLz5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1jb250ZXh0XCI+VGhpcyByZXBvc2l0b3J5IGhhcyBubyByZW1vdGVzIG9uIEdpdEh1Yi48L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstb3B0aW9uIGdpdGh1Yi1CbGFuay1vcHRpb24tLWV4cGxhaW5lZFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1hY3Rpb25CdG4gYnRuIGljb24gaWNvbi1nbG9iZVwiIG9uQ2xpY2s9e3Byb3BzLm9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2d9PlxuICAgICAgICAgIFB1Ymxpc2ggb24gR2l0SHViLi4uXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWV4cGxhbmF0aW9uXCI+XG4gICAgICAgIENyZWF0ZSBhIG5ldyBHaXRIdWIgcmVwb3NpdG9yeSBhbmQgY29uZmlndXJlIHRoaXMgZ2l0IHJlcG9zaXRvcnkgY29uZmlndXJlZCB0byBwdXNoIHRoZXJlLlxuICAgICAgPC9wPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5HaXRIdWJCbGFua05vUmVtb3RlLnByb3BUeXBlcyA9IHtcbiAgb3BlbkJvdW5kUHVibGlzaERpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFBbUM7QUFIbkM7O0FBS2UsU0FBU0EsbUJBQW1CLENBQUNDLEtBQUssRUFBRTtFQUNqRCxPQUNFO0lBQUssU0FBUyxFQUFDO0VBQXFDLEdBQ2xEO0lBQUssU0FBUyxFQUFDO0VBQThDLEVBQUcsRUFDaEU7SUFBRyxTQUFTLEVBQUM7RUFBc0IsK0NBQThDLEVBQ2pGO0lBQUcsU0FBUyxFQUFDO0VBQW9ELEdBQy9EO0lBQVEsU0FBUyxFQUFDLDRDQUE0QztJQUFDLE9BQU8sRUFBRUEsS0FBSyxDQUFDQztFQUF1QiwwQkFFNUYsQ0FDUCxFQUNKO0lBQUcsU0FBUyxFQUFDO0VBQTBCLGdHQUVuQyxDQUNBO0FBRVY7QUFFQUYsbUJBQW1CLENBQUNHLFNBQVMsR0FBRztFQUM5QkQsc0JBQXNCLEVBQUVFLGtCQUFTLENBQUNDLElBQUksQ0FBQ0M7QUFDekMsQ0FBQyJ9