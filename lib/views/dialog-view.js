"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _panel = _interopRequireDefault(require("../atom/panel"));
var _tabbable = require("./tabbable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class DialogView extends _react.default.Component {
  render() {
    return _react.default.createElement(_panel.default, {
      workspace: this.props.workspace,
      location: "modal"
    }, _react.default.createElement("div", {
      className: "github-Dialog"
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-Dialog"
    }, _react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.props.accept
    }), _react.default.createElement(_commands.Command, {
      command: "core:cancel",
      callback: this.props.cancel
    })), this.props.prompt && _react.default.createElement("header", {
      className: "github-DialogPrompt"
    }, this.props.prompt), _react.default.createElement("main", {
      className: "github-DialogForm"
    }, this.props.children), _react.default.createElement("footer", {
      className: "github-DialogFooter"
    }, _react.default.createElement("div", {
      className: "github-DialogInfo"
    }, this.props.progressMessage && this.props.inProgress && _react.default.createElement(_react.Fragment, null, _react.default.createElement("span", {
      className: "inline-block loading loading-spinner-small"
    }), _react.default.createElement("span", {
      className: "github-DialogProgress-message"
    }, this.props.progressMessage)), this.props.error && _react.default.createElement("ul", {
      className: "error-messages"
    }, _react.default.createElement("li", null, this.props.error.userMessage || this.props.error.message))), _react.default.createElement("div", {
      className: "github-DialogButtons"
    }, _react.default.createElement(_tabbable.TabbableButton, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "btn github-Dialog-cancelButton",
      onClick: this.props.cancel
    }, "Cancel"), _react.default.createElement(_tabbable.TabbableButton, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: (0, _classnames.default)('btn btn-primary github-Dialog-acceptButton', this.props.acceptClassName),
      onClick: this.props.accept,
      disabled: this.props.inProgress || !this.props.acceptEnabled
    }, this.props.acceptText)))));
  }
}
exports.default = DialogView;
_defineProperty(DialogView, "propTypes", {
  // Customization
  prompt: _propTypes.default.string,
  progressMessage: _propTypes.default.string,
  acceptEnabled: _propTypes.default.bool,
  acceptClassName: _propTypes.default.string,
  acceptText: _propTypes.default.string,
  // Callbacks
  accept: _propTypes.default.func.isRequired,
  cancel: _propTypes.default.func.isRequired,
  // State
  tabGroup: _propTypes.default.object.isRequired,
  inProgress: _propTypes.default.bool.isRequired,
  error: _propTypes.default.instanceOf(Error),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  // Form content
  children: _propTypes.default.node.isRequired
});
_defineProperty(DialogView, "defaultProps", {
  acceptEnabled: true,
  acceptText: 'Accept'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEaWFsb2dWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiYWNjZXB0IiwiY2FuY2VsIiwicHJvbXB0IiwiY2hpbGRyZW4iLCJwcm9ncmVzc01lc3NhZ2UiLCJpblByb2dyZXNzIiwiZXJyb3IiLCJ1c2VyTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0YWJHcm91cCIsImN4IiwiYWNjZXB0Q2xhc3NOYW1lIiwiYWNjZXB0RW5hYmxlZCIsImFjY2VwdFRleHQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJib29sIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJub2RlIl0sInNvdXJjZXMiOlsiZGlhbG9nLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFBhbmVsIGZyb20gJy4uL2F0b20vcGFuZWwnO1xuaW1wb3J0IHtUYWJiYWJsZUJ1dHRvbn0gZnJvbSAnLi90YWJiYWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEN1c3RvbWl6YXRpb25cbiAgICBwcm9tcHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcHJvZ3Jlc3NNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGFjY2VwdEVuYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGFjY2VwdENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhY2NlcHRUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgYWNjZXB0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIFN0YXRlXG4gICAgdGFiR3JvdXA6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEZvcm0gY29udGVudFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBhY2NlcHRFbmFibGVkOiB0cnVlLFxuICAgIGFjY2VwdFRleHQ6ICdBY2NlcHQnLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UGFuZWwgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gbG9jYXRpb249XCJtb2RhbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dcIj5cbiAgICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItRGlhbG9nXCI+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuYWNjZXB0fSAvPlxuICAgICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y2FuY2VsXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuY2FuY2VsfSAvPlxuICAgICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgICAge3RoaXMucHJvcHMucHJvbXB0ICYmIChcbiAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ1Byb21wdFwiPnt0aGlzLnByb3BzLnByb21wdH08L2hlYWRlcj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dGb3JtXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L21haW4+XG4gICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nRm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dJbmZvXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLnByb2dyZXNzTWVzc2FnZSAmJiB0aGlzLnByb3BzLmluUHJvZ3Jlc3MgJiYgKFxuICAgICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1ibG9jayBsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci1zbWFsbFwiIC8+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nUHJvZ3Jlc3MtbWVzc2FnZVwiPnt0aGlzLnByb3BzLnByb2dyZXNzTWVzc2FnZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuZXJyb3IgJiYgKFxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJlcnJvci1tZXNzYWdlc1wiPlxuICAgICAgICAgICAgICAgICAgPGxpPnt0aGlzLnByb3BzLmVycm9yLnVzZXJNZXNzYWdlIHx8IHRoaXMucHJvcHMuZXJyb3IubWVzc2FnZX08L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0J1dHRvbnNcIj5cbiAgICAgICAgICAgICAgPFRhYmJhYmxlQnV0dG9uXG4gICAgICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGdpdGh1Yi1EaWFsb2ctY2FuY2VsQnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmNhbmNlbH0+XG4gICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgIDwvVGFiYmFibGVCdXR0b24+XG4gICAgICAgICAgICAgIDxUYWJiYWJsZUJ1dHRvblxuICAgICAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2J0biBidG4tcHJpbWFyeSBnaXRodWItRGlhbG9nLWFjY2VwdEJ1dHRvbicsIHRoaXMucHJvcHMuYWNjZXB0Q2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmFjY2VwdH1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5pblByb2dyZXNzIHx8ICF0aGlzLnByb3BzLmFjY2VwdEVuYWJsZWR9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmFjY2VwdFRleHR9XG4gICAgICAgICAgICAgIDwvVGFiYmFibGVCdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8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