"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GitHubBlankUninitialized;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* istanbul ignore file */

function GitHubBlankUninitialized(props) {
  return _react.default.createElement("div", {
    className: "github-Local-Uninit github-Blank"
  }, _react.default.createElement("main", {
    className: "github-Blank-body"
  }, _react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), _react.default.createElement("p", {
    className: "github-Blank-context"
  }, "This repository is not yet version controlled by git."), _react.default.createElement("p", {
    className: "github-Blank-option"
  }, _react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-globe",
    onClick: props.openBoundPublishDialog
  }, "Initialize and publish on GitHub...")), _react.default.createElement("p", {
    className: "github-Blank-explanation"
  }, "Create a new GitHub repository, then track the existing content within this directory as a git repository configured to push there."), _react.default.createElement("p", {
    className: "github-Blank-footer github-Blank-explanation"
  }, "To initialize this directory as a git repository without publishing it to GitHub, visit the", _react.default.createElement("button", {
    className: "github-Blank-tabLink",
    onClick: props.openGitTab
  }, _react.default.createElement(_octicon.default, {
    icon: "git-commit"
  }), "Git tab."))));
}
GitHubBlankUninitialized.propTypes = {
  openBoundPublishDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRIdWJCbGFua1VuaW5pdGlhbGl6ZWQiLCJwcm9wcyIsIm9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2ciLCJvcGVuR2l0VGFiIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwic291cmNlcyI6WyJnaXRodWItYmxhbmstdW5pbml0aWFsaXplZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2l0SHViQmxhbmtVbmluaXRpYWxpemVkKHByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTG9jYWwtVW5pbml0IGdpdGh1Yi1CbGFua1wiPlxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWJvZHlcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstTGFyZ2VJY29uIGljb24gaWNvbi1tYXJrLWdpdGh1YlwiIC8+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1jb250ZXh0XCI+VGhpcyByZXBvc2l0b3J5IGlzIG5vdCB5ZXQgdmVyc2lvbiBjb250cm9sbGVkIGJ5IGdpdC48L3A+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1vcHRpb25cIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1hY3Rpb25CdG4gYnRuIGljb24gaWNvbi1nbG9iZVwiIG9uQ2xpY2s9e3Byb3BzLm9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2d9PlxuICAgICAgICAgICAgSW5pdGlhbGl6ZSBhbmQgcHVibGlzaCBvbiBHaXRIdWIuLi5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstZXhwbGFuYXRpb25cIj5cbiAgICAgICAgICBDcmVhdGUgYSBuZXcgR2l0SHViIHJlcG9zaXRvcnksIHRoZW4gdHJhY2sgdGhlIGV4aXN0aW5nIGNvbnRlbnQgd2l0aGluIHRoaXMgZGlyZWN0b3J5IGFzIGEgZ2l0IHJlcG9zaXRvcnlcbiAgICAgICAgICBjb25maWd1cmVkIHRvIHB1c2ggdGhlcmUuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWZvb3RlciBnaXRodWItQmxhbmstZXhwbGFuYXRpb25cIj5cbiAgICAgICAgICBUbyBpbml0aWFsaXplIHRoaXMgZGlyZWN0b3J5IGFzIGEgZ2l0IHJlcG9zaXRvcnkgd2l0aG91dCBwdWJsaXNoaW5nIGl0IHRvIEdpdEh1YiwgdmlzaXQgdGhlXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstdGFiTGlua1wiIG9uQ2xpY2s9e3Byb3BzLm9wZW5HaXRUYWJ9PlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImdpdC1jb21taXRcIiAvPkdpdCB0YWIuXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvcD5cbiAgICAgIDwvbWFpbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuR2l0SHViQmxhbmtVbmluaXRpYWxpemVkLnByb3BUeXBlcyA9IHtcbiAgb3BlbkJvdW5kUHVibGlzaERpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb3BlbkdpdFRhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFFQTtBQUFzQztBQUx0Qzs7QUFPZSxTQUFTQSx3QkFBd0IsQ0FBQ0MsS0FBSyxFQUFFO0VBQ3RELE9BQ0U7SUFBSyxTQUFTLEVBQUM7RUFBa0MsR0FDL0M7SUFBTSxTQUFTLEVBQUM7RUFBbUIsR0FDakM7SUFBSyxTQUFTLEVBQUM7RUFBOEMsRUFBRyxFQUNoRTtJQUFHLFNBQVMsRUFBQztFQUFzQiwyREFBMEQsRUFDN0Y7SUFBRyxTQUFTLEVBQUM7RUFBcUIsR0FDaEM7SUFBUSxTQUFTLEVBQUMsNENBQTRDO0lBQUMsT0FBTyxFQUFFQSxLQUFLLENBQUNDO0VBQXVCLHlDQUU1RixDQUNQLEVBQ0o7SUFBRyxTQUFTLEVBQUM7RUFBMEIseUlBR25DLEVBQ0o7SUFBRyxTQUFTLEVBQUM7RUFBOEMsa0dBRXpEO0lBQVEsU0FBUyxFQUFDLHNCQUFzQjtJQUFDLE9BQU8sRUFBRUQsS0FBSyxDQUFDRTtFQUFXLEdBQ2pFLDZCQUFDLGdCQUFPO0lBQUMsSUFBSSxFQUFDO0VBQVksRUFBRyxhQUN0QixDQUNQLENBQ0MsQ0FDSDtBQUVWO0FBRUFILHdCQUF3QixDQUFDSSxTQUFTLEdBQUc7RUFDbkNGLHNCQUFzQixFQUFFRyxrQkFBUyxDQUFDQyxJQUFJLENBQUNDLFVBQVU7RUFDakRKLFVBQVUsRUFBRUUsa0JBQVMsQ0FBQ0MsSUFBSSxDQUFDQztBQUM3QixDQUFDIn0=