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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItYmxhbmstbm9yZW1vdGUuanMiXSwibmFtZXMiOlsiR2l0SHViQmxhbmtOb1JlbW90ZSIsInByb3BzIiwib3BlbkJvdW5kUHVibGlzaERpYWxvZyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFIQTtBQUtlLFNBQVNBLG1CQUFULENBQTZCQyxLQUE3QixFQUFvQztBQUNqRCxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixJQURGLEVBRUU7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLGlEQUZGLEVBR0U7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLEtBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQyw0Q0FBbEI7QUFBK0QsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0M7QUFBOUUsNEJBREYsQ0FIRixFQVFFO0FBQUcsSUFBQSxTQUFTLEVBQUM7QUFBYixrR0FSRixDQURGO0FBY0Q7O0FBRURGLG1CQUFtQixDQUFDRyxTQUFwQixHQUFnQztBQUM5QkQsRUFBQUEsc0JBQXNCLEVBQUVFLG1CQUFVQyxJQUFWLENBQWVDO0FBRFQsQ0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2l0SHViQmxhbmtOb1JlbW90ZShwcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUxvY2FsLU5vUmVtb3RlcyBnaXRodWItQmxhbmtcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLUxhcmdlSWNvbiBpY29uIGljb24tbWFyay1naXRodWJcIiAvPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWNvbnRleHRcIj5UaGlzIHJlcG9zaXRvcnkgaGFzIG5vIHJlbW90ZXMgb24gR2l0SHViLjwvcD5cbiAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1vcHRpb24gZ2l0aHViLUJsYW5rLW9wdGlvbi0tZXhwbGFpbmVkXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWFjdGlvbkJ0biBidG4gaWNvbiBpY29uLWdsb2JlXCIgb25DbGljaz17cHJvcHMub3BlbkJvdW5kUHVibGlzaERpYWxvZ30+XG4gICAgICAgICAgUHVibGlzaCBvbiBHaXRIdWIuLi5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstZXhwbGFuYXRpb25cIj5cbiAgICAgICAgQ3JlYXRlIGEgbmV3IEdpdEh1YiByZXBvc2l0b3J5IGFuZCBjb25maWd1cmUgdGhpcyBnaXQgcmVwb3NpdG9yeSBjb25maWd1cmVkIHRvIHB1c2ggdGhlcmUuXG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbkdpdEh1YkJsYW5rTm9SZW1vdGUucHJvcFR5cGVzID0ge1xuICBvcGVuQm91bmRQdWJsaXNoRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufTtcbiJdfQ==