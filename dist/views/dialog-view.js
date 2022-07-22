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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DialogView extends _react.default.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement(_panel.default, {
      workspace: this.props.workspace,
      location: "modal"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Dialog"
    }, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-Dialog"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.props.accept
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "core:cancel",
      callback: this.props.cancel
    })), this.props.prompt && /*#__PURE__*/_react.default.createElement("header", {
      className: "github-DialogPrompt"
    }, this.props.prompt), /*#__PURE__*/_react.default.createElement("main", {
      className: "github-DialogForm"
    }, this.props.children), /*#__PURE__*/_react.default.createElement("footer", {
      className: "github-DialogFooter"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-DialogInfo"
    }, this.props.progressMessage && this.props.inProgress && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
      className: "inline-block loading loading-spinner-small"
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-DialogProgress-message"
    }, this.props.progressMessage)), this.props.error && /*#__PURE__*/_react.default.createElement("ul", {
      className: "error-messages"
    }, /*#__PURE__*/_react.default.createElement("li", null, this.props.error.userMessage || this.props.error.message))), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-DialogButtons"
    }, /*#__PURE__*/_react.default.createElement(_tabbable.TabbableButton, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "btn github-Dialog-cancelButton",
      onClick: this.props.cancel
    }, "Cancel"), /*#__PURE__*/_react.default.createElement(_tabbable.TabbableButton, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9kaWFsb2ctdmlldy5qcyJdLCJuYW1lcyI6WyJEaWFsb2dWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiYWNjZXB0IiwiY2FuY2VsIiwicHJvbXB0IiwiY2hpbGRyZW4iLCJwcm9ncmVzc01lc3NhZ2UiLCJpblByb2dyZXNzIiwiZXJyb3IiLCJ1c2VyTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0YWJHcm91cCIsImFjY2VwdENsYXNzTmFtZSIsImFjY2VwdEVuYWJsZWQiLCJhY2NlcHRUZXh0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYm9vbCIsImZ1bmMiLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiaW5zdGFuY2VPZiIsIkVycm9yIiwibm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUErQnREQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRSw2QkFBQyxjQUFEO0FBQU8sTUFBQSxTQUFTLEVBQUUsS0FBS0MsS0FBTCxDQUFXQyxTQUE3QjtBQUF3QyxNQUFBLFFBQVEsRUFBQztBQUFqRCxvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsNkJBQUMsaUJBQUQ7QUFBVSxNQUFBLFFBQVEsRUFBRSxLQUFLRCxLQUFMLENBQVdFLFFBQS9CO0FBQXlDLE1BQUEsTUFBTSxFQUFDO0FBQWhELG9CQUNFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsY0FBakI7QUFBZ0MsTUFBQSxRQUFRLEVBQUUsS0FBS0YsS0FBTCxDQUFXRztBQUFyRCxNQURGLGVBRUUsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxhQUFqQjtBQUErQixNQUFBLFFBQVEsRUFBRSxLQUFLSCxLQUFMLENBQVdJO0FB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QURLO0FBRXBCQyxFQUFBQSxVQUFVLEVBQUU7QUFGUSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFBhbmVsIGZyb20gJy4uL2F0b20vcGFuZWwnO1xuaW1wb3J0IHtUYWJiYWJsZUJ1dHRvbn0gZnJvbSAnLi90YWJiYWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZ1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEN1c3RvbWl6YXRpb25cbiAgICBwcm9tcHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcHJvZ3Jlc3NNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGFjY2VwdEVuYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGFjY2VwdENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhY2NlcHRUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgYWNjZXB0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIFN0YXRlXG4gICAgdGFiR3JvdXA6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpblByb2dyZXNzOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEZvcm0gY29udGVudFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBhY2NlcHRFbmFibGVkOiB0cnVlLFxuICAgIGFjY2VwdFRleHQ6ICdBY2NlcHQnLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UGFuZWwgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gbG9jYXRpb249XCJtb2RhbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dcIj5cbiAgICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItRGlhbG9nXCI+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuYWNjZXB0fSAvPlxuICAgICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y2FuY2VsXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuY2FuY2VsfSAvPlxuICAgICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgICAge3RoaXMucHJvcHMucHJvbXB0ICYmIChcbiAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ1Byb21wdFwiPnt0aGlzLnByb3BzLnByb21wdH08L2hlYWRlcj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dGb3JtXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L21haW4+XG4gICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nRm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dJbmZvXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLnByb2dyZXNzTWVzc2FnZSAmJiB0aGlzLnByb3BzLmluUHJvZ3Jlc3MgJiYgKFxuICAgICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1ibG9jayBsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci1zbWFsbFwiIC8+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nUHJvZ3Jlc3MtbWVzc2FnZVwiPnt0aGlzLnByb3BzLnByb2dyZXNzTWVzc2FnZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuZXJyb3IgJiYgKFxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJlcnJvci1tZXNzYWdlc1wiPlxuICAgICAgICAgICAgICAgICAgPGxpPnt0aGlzLnByb3BzLmVycm9yLnVzZXJNZXNzYWdlIHx8IHRoaXMucHJvcHMuZXJyb3IubWVzc2FnZX08L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0J1dHRvbnNcIj5cbiAgICAgICAgICAgICAgPFRhYmJhYmxlQnV0dG9uXG4gICAgICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGdpdGh1Yi1EaWFsb2ctY2FuY2VsQnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmNhbmNlbH0+XG4gICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgIDwvVGFiYmFibGVCdXR0b24+XG4gICAgICAgICAgICAgIDxUYWJiYWJsZUJ1dHRvblxuICAgICAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2J0biBidG4tcHJpbWFyeSBnaXRodWItRGlhbG9nLWFjY2VwdEJ1dHRvbicsIHRoaXMucHJvcHMuYWNjZXB0Q2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmFjY2VwdH1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5pblByb2dyZXNzIHx8ICF0aGlzLnByb3BzLmFjY2VwdEVuYWJsZWR9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmFjY2VwdFRleHR9XG4gICAgICAgICAgICAgIDwvVGFiYmFibGVCdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BhbmVsPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==