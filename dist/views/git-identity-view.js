"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitIdentityView extends _react.default.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitIdentity"
    }, /*#__PURE__*/_react.default.createElement("h1", {
      className: "github-GitIdentity-title"
    }, "Git Identity"), /*#__PURE__*/_react.default.createElement("p", {
      className: "github-GitIdentity-explanation"
    }, "Please set the username and email address that you wish to use to author git commits. This will write to the", /*#__PURE__*/_react.default.createElement("code", null, "user.name"), " and ", /*#__PURE__*/_react.default.createElement("code", null, "user.email"), " values in your git configuration at the chosen scope."), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitIdentity-text"
    }, /*#__PURE__*/_react.default.createElement(_atomTextEditor.default, {
      mini: true,
      placeholderText: "name",
      buffer: this.props.usernameBuffer
    }), /*#__PURE__*/_react.default.createElement(_atomTextEditor.default, {
      mini: true,
      placeholderText: "email address",
      buffer: this.props.emailBuffer
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitIdentity-buttons"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "btn",
      onClick: this.props.close
    }, "Cancel"), /*#__PURE__*/_react.default.createElement("button", {
      className: "btn btn-primary",
      title: "Configure git for this repository",
      onClick: this.props.setLocal,
      disabled: !this.props.canWriteLocal
    }, "Use for this repository"), /*#__PURE__*/_react.default.createElement("button", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXQtaWRlbnRpdHktdmlldy5qcyJdLCJuYW1lcyI6WyJHaXRJZGVudGl0eVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidXNlcm5hbWVCdWZmZXIiLCJlbWFpbEJ1ZmZlciIsImNsb3NlIiwic2V0TG9jYWwiLCJjYW5Xcml0ZUxvY2FsIiwic2V0R2xvYmFsIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGVBQU4sU0FBOEJDLGVBQU1DLFNBQXBDLENBQThDO0FBYTNEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLHNCQURGLGVBSUU7QUFBRyxNQUFBLFNBQVMsRUFBQztBQUFiLG9JQUVFLHVEQUZGLHdCQUU2Qix3REFGN0IsMkRBSkYsZUFRRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsNkJBQUMsdUJBQUQ7QUFBZ0IsTUFBQSxJQUFJLE1BQXBCO0FBQXFCLE1BQUEsZUFBZSxFQUFDLE1BQXJDO0FBQTRDLE1BQUEsTUFBTSxFQUFFLEtBQUtDLEtBQUwsQ0FBV0M7QUFBL0QsTUFERixlQUVFLDZCQUFDLHVCQUFEO0FBQWdCLE1BQUEsSUFBSSxNQUFwQjtBQUFxQixNQUFBLGVBQWUsRUFBQyxlQUFyQztBQUFxRCxNQUFBLE1BQU0sRUFBRSxLQUFLRCxLQUFMLENBQVdFO0FBQXhFLE1BRkYsQ0FSRixlQVlFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFRLE1BQUEsU0FBUyxFQUFDLEtBQWxCO0FBQXdCLE1BQUEsT0FBTyxFQUFFLEtBQUtGLEtBQUwsQ0FBV0c7QUFBNUMsZ0JBREYsZUFJRTtBQUNFLE1BQUEsU0FBUyxFQUFDLGlCQURaO0FBRUUsTUFBQSxLQUFLLEVBQUMsbUNBRlI7QUFHRSxNQUFBLE9BQU8sRUFBRSxLQUFLSCxLQUFMLENBQVdJLFFBSHRCO0FBSUUsTUFBQSxRQUFRLEVBQUUsQ0FBQyxLQUFLSixLQUFMLENBQVdLO0FBSnhCLGlDQUpGLGVBV0U7QUFDRSxNQUFBLFNBQVMsRUFBQyxpQkFEWjtBQUVFLE1BQUEsS0FBSyxFQUFDLCtEQUZSO0FBR0UsTUFBQSxPQUFPLEVBQUUsS0FBS0wsS0FBTCxDQUFXTTtBQUh0QixrQ0FYRixDQVpGLENBREY7QUFpQ0Q7O0FBL0MwRDs7OztnQkFBeENWLGUsZUFDQTtBQUNqQjtBQUNBSyxFQUFBQSxjQUFjLEVBQUVNLG1CQUFVQyxNQUFWLENBQWlCQyxVQUZoQjtBQUdqQlAsRUFBQUEsV0FBVyxFQUFFSyxtQkFBVUMsTUFBVixDQUFpQkMsVUFIYjtBQUlqQkosRUFBQUEsYUFBYSxFQUFFRSxtQkFBVUcsSUFBVixDQUFlRCxVQUpiO0FBTWpCO0FBQ0FMLEVBQUFBLFFBQVEsRUFBRUcsbUJBQVVJLElBQVYsQ0FBZUYsVUFQUjtBQVFqQkgsRUFBQUEsU0FBUyxFQUFFQyxtQkFBVUksSUFBVixDQUFlRixVQVJUO0FBU2pCTixFQUFBQSxLQUFLLEVBQUVJLG1CQUFVSSxJQUFWLENBQWVGO0FBVEwsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdElkZW50aXR5VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICB1c2VybmFtZUJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVtYWlsQnVmZmVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2FuV3JpdGVMb2NhbDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgc2V0TG9jYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0R2xvYmFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SWRlbnRpdHlcIj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRJZGVudGl0eS10aXRsZVwiPlxuICAgICAgICAgIEdpdCBJZGVudGl0eVxuICAgICAgICA8L2gxPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItR2l0SWRlbnRpdHktZXhwbGFuYXRpb25cIj5cbiAgICAgICAgICBQbGVhc2Ugc2V0IHRoZSB1c2VybmFtZSBhbmQgZW1haWwgYWRkcmVzcyB0aGF0IHlvdSB3aXNoIHRvIHVzZSB0byBhdXRob3IgZ2l0IGNvbW1pdHMuIFRoaXMgd2lsbCB3cml0ZSB0byB0aGVcbiAgICAgICAgICA8Y29kZT51c2VyLm5hbWU8L2NvZGU+IGFuZCA8Y29kZT51c2VyLmVtYWlsPC9jb2RlPiB2YWx1ZXMgaW4geW91ciBnaXQgY29uZmlndXJhdGlvbiBhdCB0aGUgY2hvc2VuIHNjb3BlLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdElkZW50aXR5LXRleHRcIj5cbiAgICAgICAgICA8QXRvbVRleHRFZGl0b3IgbWluaSBwbGFjZWhvbGRlclRleHQ9XCJuYW1lXCIgYnVmZmVyPXt0aGlzLnByb3BzLnVzZXJuYW1lQnVmZmVyfSAvPlxuICAgICAgICAgIDxBdG9tVGV4dEVkaXRvciBtaW5pIHBsYWNlaG9sZGVyVGV4dD1cImVtYWlsIGFkZHJlc3NcIiBidWZmZXI9e3RoaXMucHJvcHMuZW1haWxCdWZmZXJ9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRJZGVudGl0eS1idXR0b25zXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiBvbkNsaWNrPXt0aGlzLnByb3BzLmNsb3NlfT5cbiAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICB0aXRsZT1cIkNvbmZpZ3VyZSBnaXQgZm9yIHRoaXMgcmVwb3NpdG9yeVwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLnNldExvY2FsfVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyF0aGlzLnByb3BzLmNhbldyaXRlTG9jYWx9PlxuICAgICAgICAgICAgVXNlIGZvciB0aGlzIHJlcG9zaXRvcnlcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgdGl0bGU9XCJDb25maWd1cmUgZ2l0IGdsb2JhbGx5IGZvciB5b3VyIG9wZXJhdGluZyBzeXN0ZW0gdXNlciBhY2NvdW50XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMuc2V0R2xvYmFsfT5cbiAgICAgICAgICAgIFVzZSBmb3IgYWxsIHJlcG9zaXRvcmllc1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==