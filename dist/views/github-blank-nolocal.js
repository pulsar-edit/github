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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItYmxhbmstbm9sb2NhbC5qcyJdLCJuYW1lcyI6WyJHaXRIdWJCbGFua05vTG9jYWwiLCJwcm9wcyIsIm9wZW5DcmVhdGVEaWFsb2ciLCJvcGVuQ2xvbmVEaWFsb2ciLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOzs7O0FBSEE7QUFLZSxTQUFTQSxrQkFBVCxDQUE0QkMsS0FBNUIsRUFBbUM7QUFDaEQsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsSUFERixFQUVFO0FBQUksSUFBQSxTQUFTLEVBQUM7QUFBZCxlQUZGLEVBR0U7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLGdEQUhGLEVBSUU7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLEtBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBQyxrREFBbEI7QUFBcUUsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0M7QUFBcEYseUNBREYsQ0FKRixFQVNFO0FBQUcsSUFBQSxTQUFTLEVBQUM7QUFBYixLQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUMsaURBQWxCO0FBQW9FLElBQUEsT0FBTyxFQUFFRCxLQUFLLENBQUNFO0FBQW5GLDhDQURGLENBVEYsQ0FERjtBQWlCRDs7QUFFREgsa0JBQWtCLENBQUNJLFNBQW5CLEdBQStCO0FBQzdCRixFQUFBQSxnQkFBZ0IsRUFBRUcsbUJBQVVDLElBQVYsQ0FBZUMsVUFESjtBQUU3QkosRUFBQUEsZUFBZSxFQUFFRSxtQkFBVUMsSUFBVixDQUFlQztBQUZILENBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdpdEh1YkJsYW5rTm9Mb2NhbChwcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU5vTG9jYWwgZ2l0aHViLUJsYW5rXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1MYXJnZUljb24gaWNvbiBpY29uLW1hcmstZ2l0aHViXCIgLz5cbiAgICAgIDxoMSBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstYmFubmVyXCI+V2VsY29tZTwvaDE+XG4gICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstY29udGV4dFwiPkhvdyB3b3VsZCB5b3UgbGlrZSB0byBnZXQgc3RhcnRlZCB0b2RheT88L3A+XG4gICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQmxhbmstb3B0aW9uXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLWFjdGlvbkJ0biBidG4gaWNvbiBpY29uLXJlcG8tY3JlYXRlXCIgb25DbGljaz17cHJvcHMub3BlbkNyZWF0ZURpYWxvZ30+XG4gICAgICAgICAgQ3JlYXRlIGEgbmV3IEdpdEh1YiByZXBvc2l0b3J5Li4uXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9wPlxuICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUJsYW5rLW9wdGlvblwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1CbGFuay1hY3Rpb25CdG4gYnRuIGljb24gaWNvbi1yZXBvLWNsb25lXCIgb25DbGljaz17cHJvcHMub3BlbkNsb25lRGlhbG9nfT5cbiAgICAgICAgICBDbG9uZSBhbiBleGlzdGluZyBHaXRIdWIgcmVwb3NpdG9yeS4uLlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuR2l0SHViQmxhbmtOb0xvY2FsLnByb3BUeXBlcyA9IHtcbiAgb3BlbkNyZWF0ZURpYWxvZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb3BlbkNsb25lRGlhbG9nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufTtcbiJdfQ==