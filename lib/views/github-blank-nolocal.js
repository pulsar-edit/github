"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GitHubBlankNoLocal;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* istanbul ignore file */

function GitHubBlankNoLocal(props) {
  return _react.default.createElement("div", {
    className: "github-NoLocal github-Blank"
  }, _react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), _react.default.createElement("h1", {
    className: "github-Blank-banner"
  }, "Welcome"), _react.default.createElement("p", {
    className: "github-Blank-context"
  }, "How would you like to get started today?"), _react.default.createElement("p", {
    className: "github-Blank-option"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-repo-create",
    onClick: props.openCreateDialog
  }, "Create a new GitHub repository...")), _react.default.createElement("p", {
    className: "github-Blank-option"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-repo-clone",
    onClick: props.openCloneDialog
  }, "Clone an existing GitHub repository...")));
}
GitHubBlankNoLocal.propTypes = {
  openCreateDialog: _propTypes.default.func.isRequired,
  openCloneDialog: _propTypes.default.func.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRIdWJCbGFua05vTG9jYWwiLCJwcm9wcyIsIm9wZW5DcmVhdGVEaWFsb2ciLCJvcGVuQ2xvbmVEaWFsb2ciLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbImdpdGh1Yi1ibGFuay1ub2xvY2FsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHaXRIdWJCbGFua05vTG9jYWwocHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Ob0xvY2FsIGdpdGh1Yi1CbGFua1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstTGFyZ2VJY29uIGljb24gaWNvbi1tYXJrLWdpdGh1YlwiIC8+XG4gICAgICA8aDEgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWJhbm5lclwiPldlbGNvbWU8L2gxPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWNvbnRleHRcIj5Ib3cgd291bGQgeW91IGxpa2UgdG8gZ2V0IHN0YXJ0ZWQgdG9kYXk/PC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLW9wdGlvblwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1hY3Rpb25CdG4gYnRuIGljb24gaWNvbi1yZXBvLWNyZWF0ZVwiIG9uQ2xpY2s9e3Byb3BzLm9wZW5DcmVhdGVEaWFsb2d9PlxuICAgICAgICAgIENyZWF0ZSBhIG5ldyBHaXRIdWIgcmVwb3NpdG9yeS4uLlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1vcHRpb25cIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstYWN0aW9uQnRuIGJ0biBpY29uIGljb24tcmVwby1jbG9uZVwiIG9uQ2xpY2s9e3Byb3BzLm9wZW5DbG9uZURpYWxvZ30+XG4gICAgICAgICAgQ2xvbmUgYW4gZXhpc3RpbmcgR2l0SHViIHJlcG9zaXRvcnkuLi5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbkdpdEh1YkJsYW5rTm9Mb2NhbC5wcm9wVHlwZXMgPSB7XG4gIG9wZW5DcmVhdGVEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5DbG9uZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFBbUM7QUFIbkM7O0FBS2UsU0FBU0Esa0JBQWtCLENBQUNDLEtBQUssRUFBRTtFQUNoRCxPQUNFO0lBQUssU0FBUyxFQUFDO0VBQTZCLEdBQzFDO0lBQUssU0FBUyxFQUFDO0VBQThDLEVBQUcsRUFDaEU7SUFBSSxTQUFTLEVBQUM7RUFBcUIsYUFBYSxFQUNoRDtJQUFHLFNBQVMsRUFBQztFQUFzQiw4Q0FBNkMsRUFDaEY7SUFBRyxTQUFTLEVBQUM7RUFBcUIsR0FDaEM7SUFBUSxTQUFTLEVBQUMsa0RBQWtEO0lBQUMsT0FBTyxFQUFFQSxLQUFLLENBQUNDO0VBQWlCLHVDQUU1RixDQUNQLEVBQ0o7SUFBRyxTQUFTLEVBQUM7RUFBcUIsR0FDaEM7SUFBUSxTQUFTLEVBQUMsaURBQWlEO0lBQUMsT0FBTyxFQUFFRCxLQUFLLENBQUNFO0VBQWdCLDRDQUUxRixDQUNQLENBQ0E7QUFFVjtBQUVBSCxrQkFBa0IsQ0FBQ0ksU0FBUyxHQUFHO0VBQzdCRixnQkFBZ0IsRUFBRUcsa0JBQVMsQ0FBQ0MsSUFBSSxDQUFDQyxVQUFVO0VBQzNDSixlQUFlLEVBQUVFLGtCQUFTLENBQUNDLElBQUksQ0FBQ0M7QUFDbEMsQ0FBQyJ9