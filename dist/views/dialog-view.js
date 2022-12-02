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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9kaWFsb2ctdmlldy5qcyJdLCJuYW1lcyI6WyJEaWFsb2dWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiYWNjZXB0IiwiY2FuY2VsIiwicHJvbXB0IiwiY2hpbGRyZW4iLCJwcm9ncmVzc01lc3NhZ2UiLCJpblByb2dyZXNzIiwiZXJyb3IiLCJ1c2VyTWVzc2FnZSIsIm1lc3NhZ2UiLCJ0YWJHcm91cCIsImFjY2VwdENsYXNzTmFtZSIsImFjY2VwdEVuYWJsZWQiLCJhY2NlcHRUZXh0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYm9vbCIsImZ1bmMiLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiaW5zdGFuY2VPZiIsIkVycm9yIiwibm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsVUFBTixTQUF5QkMsZUFBTUMsU0FBL0IsQ0FBeUM7QUErQnREQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFLDZCQUFDLGNBQUQ7QUFBTyxNQUFBLFNBQVMsRUFBRSxLQUFLQyxLQUFMLENBQVdDLFNBQTdCO0FBQXdDLE1BQUEsUUFBUSxFQUFDO0FBQWpELE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsNkJBQUMsaUJBQUQ7QUFBVSxNQUFBLFFBQVEsRUFBRSxLQUFLRCxLQUFMLENBQVdFLFFBQS9CO0FBQXlDLE1BQUEsTUFBTSxFQUFDO0FBQWhELE9BQ0UsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxjQUFqQjtBQUFnQyxNQUFBLFFBQVEsRUFBRSxLQUFLRixLQUFMLENBQVdHO0FBQXJELE1BREYsRUFFRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLGFBQWpCO0FBQStCLE1BQUEsUUFBUSxFQUFFLEtBQUtILEtBQUwsQ0FBV0k7QUFBcEQs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RUFBQUEsVUFBVSxFQUFFO0FBRlEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBQYW5lbCBmcm9tICcuLi9hdG9tL3BhbmVsJztcbmltcG9ydCB7VGFiYmFibGVCdXR0b259IGZyb20gJy4vdGFiYmFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2dWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBDdXN0b21pemF0aW9uXG4gICAgcHJvbXB0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHByb2dyZXNzTWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhY2NlcHRFbmFibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBhY2NlcHRDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgYWNjZXB0VGV4dDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIGFjY2VwdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjYW5jZWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBTdGF0ZVxuICAgIHRhYkdyb3VwOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBlcnJvcjogUHJvcFR5cGVzLmluc3RhbmNlT2YoRXJyb3IpLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBGb3JtIGNvbnRlbnRcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgYWNjZXB0RW5hYmxlZDogdHJ1ZSxcbiAgICBhY2NlcHRUZXh0OiAnQWNjZXB0JyxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFBhbmVsIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IGxvY2F0aW9uPVwibW9kYWxcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nXCI+XG4gICAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLURpYWxvZ1wiPlxuICAgICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLmFjY2VwdH0gLz5cbiAgICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNhbmNlbFwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLmNhbmNlbH0gLz5cbiAgICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnByb21wdCAmJiAoXG4gICAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dQcm9tcHRcIj57dGhpcy5wcm9wcy5wcm9tcHR9PC9oZWFkZXI+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nRm9ybVwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgPC9tYWluPlxuICAgICAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0Zvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRGlhbG9nSW5mb1wiPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5wcm9ncmVzc01lc3NhZ2UgJiYgdGhpcy5wcm9wcy5pblByb2dyZXNzICYmIChcbiAgICAgICAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItc21hbGxcIiAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ1Byb2dyZXNzLW1lc3NhZ2VcIj57dGhpcy5wcm9wcy5wcm9ncmVzc01lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmVycm9yICYmIChcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZXJyb3ItbWVzc2FnZXNcIj5cbiAgICAgICAgICAgICAgICAgIDxsaT57dGhpcy5wcm9wcy5lcnJvci51c2VyTWVzc2FnZSB8fCB0aGlzLnByb3BzLmVycm9yLm1lc3NhZ2V9PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dCdXR0b25zXCI+XG4gICAgICAgICAgICAgIDxUYWJiYWJsZUJ1dHRvblxuICAgICAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBnaXRodWItRGlhbG9nLWNhbmNlbEJ1dHRvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5jYW5jZWx9PlxuICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICA8L1RhYmJhYmxlQnV0dG9uPlxuICAgICAgICAgICAgICA8VGFiYmFibGVCdXR0b25cbiAgICAgICAgICAgICAgICB0YWJHcm91cD17dGhpcy5wcm9wcy50YWJHcm91cH1cbiAgICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdidG4gYnRuLXByaW1hcnkgZ2l0aHViLURpYWxvZy1hY2NlcHRCdXR0b24nLCB0aGlzLnByb3BzLmFjY2VwdENsYXNzTmFtZSl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5hY2NlcHR9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuaW5Qcm9ncmVzcyB8fCAhdGhpcy5wcm9wcy5hY2NlcHRFbmFibGVkfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5hY2NlcHRUZXh0fVxuICAgICAgICAgICAgICA8L1RhYmJhYmxlQnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9mb290ZXI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9QYW5lbD5cbiAgICApO1xuICB9XG59XG4iXX0=