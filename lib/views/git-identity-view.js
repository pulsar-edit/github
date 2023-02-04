"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GitIdentityView extends _react.default.Component {
  render() {
    return _react.default.createElement("div", {
      className: "github-GitIdentity"
    }, _react.default.createElement("h1", {
      className: "github-GitIdentity-title"
    }, "Git Identity"), _react.default.createElement("p", {
      className: "github-GitIdentity-explanation"
    }, "Please set the username and email address that you wish to use to author git commits. This will write to the", _react.default.createElement("code", null, "user.name"), " and ", _react.default.createElement("code", null, "user.email"), " values in your git configuration at the chosen scope."), _react.default.createElement("div", {
      className: "github-GitIdentity-text"
    }, _react.default.createElement(_atomTextEditor.default, {
      mini: true,
      placeholderText: "name",
      buffer: this.props.usernameBuffer
    }), _react.default.createElement(_atomTextEditor.default, {
      mini: true,
      placeholderText: "email address",
      buffer: this.props.emailBuffer
    })), _react.default.createElement("div", {
      className: "github-GitIdentity-buttons"
    }, _react.default.createElement("button", {
      className: "btn",
      onClick: this.props.close
    }, "Cancel"), _react.default.createElement("button", {
      className: "btn btn-primary",
      title: "Configure git for this repository",
      onClick: this.props.setLocal,
      disabled: !this.props.canWriteLocal
    }, "Use for this repository"), _react.default.createElement("button", {
      className: "btn btn-primary",
      title: "Configure git globally for your operating system user account",
      onClick: this.props.setGlobal
    }, "Use for all repositories")));
  }
}
exports.default = GitIdentityView;
_defineProperty(GitIdentityView, "propTypes", {
  // Model
  usernameBuffer: _propTypes.default.object.isRequired,
  emailBuffer: _propTypes.default.object.isRequired,
  canWriteLocal: _propTypes.default.bool.isRequired,
  // Action methods
  setLocal: _propTypes.default.func.isRequired,
  setGlobal: _propTypes.default.func.isRequired,
  close: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRJZGVudGl0eVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidXNlcm5hbWVCdWZmZXIiLCJlbWFpbEJ1ZmZlciIsImNsb3NlIiwic2V0TG9jYWwiLCJjYW5Xcml0ZUxvY2FsIiwic2V0R2xvYmFsIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sInNvdXJjZXMiOlsiZ2l0LWlkZW50aXR5LXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0SWRlbnRpdHlWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbFxuICAgIHVzZXJuYW1lQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZW1haWxCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjYW5Xcml0ZUxvY2FsOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBzZXRMb2NhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRHbG9iYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRJZGVudGl0eVwiPlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdElkZW50aXR5LXRpdGxlXCI+XG4gICAgICAgICAgR2l0IElkZW50aXR5XG4gICAgICAgIDwvaDE+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRJZGVudGl0eS1leHBsYW5hdGlvblwiPlxuICAgICAgICAgIFBsZWFzZSBzZXQgdGhlIHVzZXJuYW1lIGFuZCBlbWFpbCBhZGRyZXNzIHRoYXQgeW91IHdpc2ggdG8gdXNlIHRvIGF1dGhvciBnaXQgY29tbWl0cy4gVGhpcyB3aWxsIHdyaXRlIHRvIHRoZVxuICAgICAgICAgIDxjb2RlPnVzZXIubmFtZTwvY29kZT4gYW5kIDxjb2RlPnVzZXIuZW1haWw8L2NvZGU+IHZhbHVlcyBpbiB5b3VyIGdpdCBjb25maWd1cmF0aW9uIGF0IHRoZSBjaG9zZW4gc2NvcGUuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SWRlbnRpdHktdGV4dFwiPlxuICAgICAgICAgIDxBdG9tVGV4dEVkaXRvciBtaW5pIHBsYWNlaG9sZGVyVGV4dD1cIm5hbWVcIiBidWZmZXI9e3RoaXMucHJvcHMudXNlcm5hbWVCdWZmZXJ9IC8+XG4gICAgICAgICAgPEF0b21UZXh0RWRpdG9yIG1pbmkgcGxhY2Vob2xkZXJUZXh0PVwiZW1haWwgYWRkcmVzc1wiIGJ1ZmZlcj17dGhpcy5wcm9wcy5lbWFpbEJ1ZmZlcn0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdElkZW50aXR5LWJ1dHRvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuY2xvc2V9PlxuICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgIHRpdGxlPVwiQ29uZmlndXJlIGdpdCBmb3IgdGhpcyByZXBvc2l0b3J5XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0TG9jYWx9XG4gICAgICAgICAgICBkaXNhYmxlZD17IXRoaXMucHJvcHMuY2FuV3JpdGVMb2NhbH0+XG4gICAgICAgICAgICBVc2UgZm9yIHRoaXMgcmVwb3NpdG9yeVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICB0aXRsZT1cIkNvbmZpZ3VyZSBnaXQgZ2xvYmFsbHkgZm9yIHlvdXIgb3BlcmF0aW5nIHN5c3RlbSB1c2VyIGFjY291bnRcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5zZXRHbG9iYWx9PlxuICAgICAgICAgICAgVXNlIGZvciBhbGwgcmVwb3NpdG9yaWVzXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFBc0Q7QUFBQTtBQUFBO0FBQUE7QUFFdkMsTUFBTUEsZUFBZSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWEzREMsTUFBTSxHQUFHO0lBQ1AsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUFvQixHQUNqQztNQUFJLFNBQVMsRUFBQztJQUEwQixrQkFFbkMsRUFDTDtNQUFHLFNBQVMsRUFBQztJQUFnQyxtSEFFM0MsdURBQXNCLFdBQUssd0RBQXVCLDJEQUNoRCxFQUNKO01BQUssU0FBUyxFQUFDO0lBQXlCLEdBQ3RDLDZCQUFDLHVCQUFjO01BQUMsSUFBSTtNQUFDLGVBQWUsRUFBQyxNQUFNO01BQUMsTUFBTSxFQUFFLElBQUksQ0FBQ0MsS0FBSyxDQUFDQztJQUFlLEVBQUcsRUFDakYsNkJBQUMsdUJBQWM7TUFBQyxJQUFJO01BQUMsZUFBZSxFQUFDLGVBQWU7TUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDRCxLQUFLLENBQUNFO0lBQVksRUFBRyxDQUNuRixFQUNOO01BQUssU0FBUyxFQUFDO0lBQTRCLEdBQ3pDO01BQVEsU0FBUyxFQUFDLEtBQUs7TUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDRixLQUFLLENBQUNHO0lBQU0sWUFFekMsRUFDVDtNQUNFLFNBQVMsRUFBQyxpQkFBaUI7TUFDM0IsS0FBSyxFQUFDLG1DQUFtQztNQUN6QyxPQUFPLEVBQUUsSUFBSSxDQUFDSCxLQUFLLENBQUNJLFFBQVM7TUFDN0IsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDSixLQUFLLENBQUNLO0lBQWMsNkJBRTdCLEVBQ1Q7TUFDRSxTQUFTLEVBQUMsaUJBQWlCO01BQzNCLEtBQUssRUFBQywrREFBK0Q7TUFDckUsT0FBTyxFQUFFLElBQUksQ0FBQ0wsS0FBSyxDQUFDTTtJQUFVLDhCQUV2QixDQUNMLENBQ0Y7RUFFVjtBQUNGO0FBQUM7QUFBQSxnQkFoRG9CVixlQUFlLGVBQ2Y7RUFDakI7RUFDQUssY0FBYyxFQUFFTSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDM0NQLFdBQVcsRUFBRUssa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3hDSixhQUFhLEVBQUVFLGtCQUFTLENBQUNHLElBQUksQ0FBQ0QsVUFBVTtFQUV4QztFQUNBTCxRQUFRLEVBQUVHLGtCQUFTLENBQUNJLElBQUksQ0FBQ0YsVUFBVTtFQUNuQ0gsU0FBUyxFQUFFQyxrQkFBUyxDQUFDSSxJQUFJLENBQUNGLFVBQVU7RUFDcENOLEtBQUssRUFBRUksa0JBQVMsQ0FBQ0ksSUFBSSxDQUFDRjtBQUN4QixDQUFDIn0=