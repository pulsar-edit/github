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
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "github-Local-Uninit github-Blank"
  }, /*#__PURE__*/_react.default.createElement("main", {
    className: "github-Blank-body"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "github-Blank-LargeIcon icon icon-mark-github"
  }), /*#__PURE__*/_react.default.createElement("p", {
    className: "github-Blank-context"
  }, "This repository is not yet version controlled by git."), /*#__PURE__*/_react.default.createElement("p", {
    className: "github-Blank-option"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "github-Blank-actionBtn btn icon icon-globe",
    onClick: props.openBoundPublishDialog
  }, "Initialize and publish on GitHub...")), /*#__PURE__*/_react.default.createElement("p", {
    className: "github-Blank-explanation"
  }, "Create a new GitHub repository, then track the existing content within this directory as a git repository configured to push there."), /*#__PURE__*/_react.default.createElement("p", {
    className: "github-Blank-footer github-Blank-explanation"
  }, "To initialize this directory as a git repository without publishing it to GitHub, visit the", /*#__PURE__*/_react.default.createElement("button", {
    className: "github-Blank-tabLink",
    onClick: props.openGitTab
  }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
    icon: "git-commit"
  }), "Git tab."))));
}

GitHubBlankUninitialized.propTypes = {
  openBoundPublishDialog: _propTypes.default.func.isRequired,
  openGitTab: _propTypes.default.func.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItYmxhbmstdW5pbml0aWFsaXplZC5qcyJdLCJuYW1lcyI6WyJHaXRIdWJCbGFua1VuaW5pdGlhbGl6ZWQiLCJwcm9wcyIsIm9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2ciLCJvcGVuR2l0VGFiIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFFQTs7OztBQUxBO0FBT2UsU0FBU0Esd0JBQVQsQ0FBa0NDLEtBQWxDLEVBQXlDO0FBQ3RELHNCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRTtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLGtCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixJQURGLGVBRUU7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLDZEQUZGLGVBR0U7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLGtCQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUMsNENBQWxCO0FBQStELElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNDO0FBQTlFLDJDQURGLENBSEYsZUFRRTtBQUFHLElBQUEsU0FBUyxFQUFDO0FBQWIsMklBUkYsZUFZRTtBQUFHLElBQUEsU0FBUyxFQUFDO0FBQWIsaUhBRUU7QUFBUSxJQUFBLFNBQVMsRUFBQyxzQkFBbEI7QUFBeUMsSUFBQSxPQUFPLEVBQUVELEtBQUssQ0FBQ0U7QUFBeEQsa0JBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxJQUFBLElBQUksRUFBQztBQUFkLElBREYsYUFGRixDQVpGLENBREYsQ0FERjtBQXVCRDs7QUFFREgsd0JBQXdCLENBQUNJLFNBQXpCLEdBQXFDO0FBQ25DRixFQUFBQSxzQkFBc0IsRUFBRUcsbUJBQVVDLElBQVYsQ0FBZUMsVUFESjtBQUVuQ0osRUFBQUEsVUFBVSxFQUFFRSxtQkFBVUMsSUFBVixDQUFlQztBQUZRLENBQXJDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdpdEh1YkJsYW5rVW5pbml0aWFsaXplZChwcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUxvY2FsLVVuaW5pdCBnaXRodWItQmxhbmtcIj5cbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1ib2R5XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLUxhcmdlSWNvbiBpY29uIGljb24tbWFyay1naXRodWJcIiAvPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstY29udGV4dFwiPlRoaXMgcmVwb3NpdG9yeSBpcyBub3QgeWV0IHZlcnNpb24gY29udHJvbGxlZCBieSBnaXQuPC9wPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstb3B0aW9uXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstYWN0aW9uQnRuIGJ0biBpY29uIGljb24tZ2xvYmVcIiBvbkNsaWNrPXtwcm9wcy5vcGVuQm91bmRQdWJsaXNoRGlhbG9nfT5cbiAgICAgICAgICAgIEluaXRpYWxpemUgYW5kIHB1Ymxpc2ggb24gR2l0SHViLi4uXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvcD5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWV4cGxhbmF0aW9uXCI+XG4gICAgICAgICAgQ3JlYXRlIGEgbmV3IEdpdEh1YiByZXBvc2l0b3J5LCB0aGVuIHRyYWNrIHRoZSBleGlzdGluZyBjb250ZW50IHdpdGhpbiB0aGlzIGRpcmVjdG9yeSBhcyBhIGdpdCByZXBvc2l0b3J5XG4gICAgICAgICAgY29uZmlndXJlZCB0byBwdXNoIHRoZXJlLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1mb290ZXIgZ2l0aHViLUJsYW5rLWV4cGxhbmF0aW9uXCI+XG4gICAgICAgICAgVG8gaW5pdGlhbGl6ZSB0aGlzIGRpcmVjdG9yeSBhcyBhIGdpdCByZXBvc2l0b3J5IHdpdGhvdXQgcHVibGlzaGluZyBpdCB0byBHaXRIdWIsIHZpc2l0IHRoZVxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLXRhYkxpbmtcIiBvbkNsaWNrPXtwcm9wcy5vcGVuR2l0VGFifT5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJnaXQtY29tbWl0XCIgLz5HaXQgdGFiLlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L3A+XG4gICAgICA8L21haW4+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbkdpdEh1YkJsYW5rVW5pbml0aWFsaXplZC5wcm9wVHlwZXMgPSB7XG4gIG9wZW5Cb3VuZFB1Ymxpc2hEaWFsb2c6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5HaXRUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG59O1xuIl19