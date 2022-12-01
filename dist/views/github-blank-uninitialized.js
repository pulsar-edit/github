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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItYmxhbmstdW5pbml0aWFsaXplZC5qcyJdLCJuYW1lcyI6WyJHaXRIdWJCbGFua1VuaW5pdGlhbGl6ZWQiLCJwcm9wcyIsIm9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2ciLCJvcGVuR2l0VGFiIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFFQTs7OztBQUxBO0FBT2UsU0FBU0Esd0JBQVQsQ0FBa0NDLEtBQWxDLEVBQXlDO0FBQ3RELFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0U7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixJQURGLEVBRUU7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLDZEQUZGLEVBR0U7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLEtBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQyw0Q0FBbEI7QUFBK0QsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0M7QUFBOUUsMkNBREYsQ0FIRixFQVFFO0FBQUcsSUFBQSxTQUFTLEVBQUM7QUFBYiwySUFSRixFQVlFO0FBQUcsSUFBQSxTQUFTLEVBQUM7QUFBYixvR0FFRTtBQUFRLElBQUEsU0FBUyxFQUFDLHNCQUFsQjtBQUF5QyxJQUFBLE9BQU8sRUFBRUQsS0FBSyxDQUFDRTtBQUF4RCxLQUNFLDZCQUFDLGdCQUFEO0FBQVMsSUFBQSxJQUFJLEVBQUM7QUFBZCxJQURGLGFBRkYsQ0FaRixDQURGLENBREY7QUF1QkQ7O0FBRURILHdCQUF3QixDQUFDSSxTQUF6QixHQUFxQztBQUNuQ0YsRUFBQUEsc0JBQXNCLEVBQUVHLG1CQUFVQyxJQUFWLENBQWVDLFVBREo7QUFFbkNKLEVBQUFBLFVBQVUsRUFBRUUsbUJBQVVDLElBQVYsQ0FBZUM7QUFGUSxDQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHaXRIdWJCbGFua1VuaW5pdGlhbGl6ZWQocHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Mb2NhbC1VbmluaXQgZ2l0aHViLUJsYW5rXCI+XG4gICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstYm9keVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1MYXJnZUljb24gaWNvbiBpY29uLW1hcmstZ2l0aHViXCIgLz5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWNvbnRleHRcIj5UaGlzIHJlcG9zaXRvcnkgaXMgbm90IHlldCB2ZXJzaW9uIGNvbnRyb2xsZWQgYnkgZ2l0LjwvcD5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLW9wdGlvblwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWFjdGlvbkJ0biBidG4gaWNvbiBpY29uLWdsb2JlXCIgb25DbGljaz17cHJvcHMub3BlbkJvdW5kUHVibGlzaERpYWxvZ30+XG4gICAgICAgICAgICBJbml0aWFsaXplIGFuZCBwdWJsaXNoIG9uIEdpdEh1Yi4uLlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L3A+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1leHBsYW5hdGlvblwiPlxuICAgICAgICAgIENyZWF0ZSBhIG5ldyBHaXRIdWIgcmVwb3NpdG9yeSwgdGhlbiB0cmFjayB0aGUgZXhpc3RpbmcgY29udGVudCB3aXRoaW4gdGhpcyBkaXJlY3RvcnkgYXMgYSBnaXQgcmVwb3NpdG9yeVxuICAgICAgICAgIGNvbmZpZ3VyZWQgdG8gcHVzaCB0aGVyZS5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstZm9vdGVyIGdpdGh1Yi1CbGFuay1leHBsYW5hdGlvblwiPlxuICAgICAgICAgIFRvIGluaXRpYWxpemUgdGhpcyBkaXJlY3RvcnkgYXMgYSBnaXQgcmVwb3NpdG9yeSB3aXRob3V0IHB1Ymxpc2hpbmcgaXQgdG8gR2l0SHViLCB2aXNpdCB0aGVcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay10YWJMaW5rXCIgb25DbGljaz17cHJvcHMub3BlbkdpdFRhYn0+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwiZ2l0LWNvbW1pdFwiIC8+R2l0IHRhYi5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9wPlxuICAgICAgPC9tYWluPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5HaXRIdWJCbGFua1VuaW5pdGlhbGl6ZWQucHJvcFR5cGVzID0ge1xuICBvcGVuQm91bmRQdWJsaXNoRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvcGVuR2l0VGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufTtcbiJdfQ==