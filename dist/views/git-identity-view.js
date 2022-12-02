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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXQtaWRlbnRpdHktdmlldy5qcyJdLCJuYW1lcyI6WyJHaXRJZGVudGl0eVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidXNlcm5hbWVCdWZmZXIiLCJlbWFpbEJ1ZmZlciIsImNsb3NlIiwic2V0TG9jYWwiLCJjYW5Xcml0ZUxvY2FsIiwic2V0R2xvYmFsIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGVBQU4sU0FBOEJDLGVBQU1DLFNBQXBDLENBQThDO0FBYTNEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxzQkFERixFQUlFO0FBQUcsTUFBQSxTQUFTLEVBQUM7QUFBYix1SEFFRSx1REFGRixXQUU2Qix3REFGN0IsMkRBSkYsRUFRRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRSw2QkFBQyx1QkFBRDtBQUFnQixNQUFBLElBQUksTUFBcEI7QUFBcUIsTUFBQSxlQUFlLEVBQUMsTUFBckM7QUFBNEMsTUFBQSxNQUFNLEVBQUUsS0FBS0MsS0FBTCxDQUFXQztBQUEvRCxNQURGLEVBRUUsNkJBQUMsdUJBQUQ7QUFBZ0IsTUFBQSxJQUFJLE1BQXBCO0FBQXFCLE1BQUEsZUFBZSxFQUFDLGVBQXJDO0FBQXFELE1BQUEsTUFBTSxFQUFFLEtBQUtELEtBQUwsQ0FBV0U7QUFBeEUsTUFGRixDQVJGLEVBWUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBUSxNQUFBLFNBQVMsRUFBQyxLQUFsQjtBQUF3QixNQUFBLE9BQU8sRUFBRSxLQUFLRixLQUFMLENBQVdHO0FBQTVDLGdCQURGLEVBSUU7QUFDRSxNQUFBLFNBQVMsRUFBQyxpQkFEWjtBQUVFLE1BQUEsS0FBSyxFQUFDLG1DQUZSO0FBR0UsTUFBQSxPQUFPLEVBQUUsS0FBS0gsS0FBTCxDQUFXSSxRQUh0QjtBQUlFLE1BQUEsUUFBUSxFQUFFLENBQUMsS0FBS0osS0FBTCxDQUFXSztBQUp4QixpQ0FKRixFQVdFO0FBQ0UsTUFBQSxTQUFTLEVBQUMsaUJBRFo7QUFFRSxNQUFBLEtBQUssRUFBQywrREFGUjtBQUdFLE1BQUEsT0FBTyxFQUFFLEtBQUtMLEtBQUwsQ0FBV007QUFIdEIsa0NBWEYsQ0FaRixDQURGO0FBaUNEOztBQS9DMEQ7Ozs7Z0JBQXhDVixlLGVBQ0E7QUFDakI7QUFDQUssRUFBQUEsY0FBYyxFQUFFTSxtQkFBVUMsTUFBVixDQUFpQkMsVUFGaEI7QUFHakJQLEVBQUFBLFdBQVcsRUFBRUssbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSGI7QUFJakJKLEVBQUFBLGFBQWEsRUFBRUUsbUJBQVVHLElBQVYsQ0FBZUQsVUFKYjtBQU1qQjtBQUNBTCxFQUFBQSxRQUFRLEVBQUVHLG1CQUFVSSxJQUFWLENBQWVGLFVBUFI7QUFRakJILEVBQUFBLFNBQVMsRUFBRUMsbUJBQVVJLElBQVYsQ0FBZUYsVUFSVDtBQVNqQk4sRUFBQUEsS0FBSyxFQUFFSSxtQkFBVUksSUFBVixDQUFlRjtBQVRMLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRJZGVudGl0eVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgdXNlcm5hbWVCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBlbWFpbEJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNhbldyaXRlTG9jYWw6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHNldExvY2FsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldEdsb2JhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdElkZW50aXR5XCI+XG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJnaXRodWItR2l0SWRlbnRpdHktdGl0bGVcIj5cbiAgICAgICAgICBHaXQgSWRlbnRpdHlcbiAgICAgICAgPC9oMT5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdElkZW50aXR5LWV4cGxhbmF0aW9uXCI+XG4gICAgICAgICAgUGxlYXNlIHNldCB0aGUgdXNlcm5hbWUgYW5kIGVtYWlsIGFkZHJlc3MgdGhhdCB5b3Ugd2lzaCB0byB1c2UgdG8gYXV0aG9yIGdpdCBjb21taXRzLiBUaGlzIHdpbGwgd3JpdGUgdG8gdGhlXG4gICAgICAgICAgPGNvZGU+dXNlci5uYW1lPC9jb2RlPiBhbmQgPGNvZGU+dXNlci5lbWFpbDwvY29kZT4gdmFsdWVzIGluIHlvdXIgZ2l0IGNvbmZpZ3VyYXRpb24gYXQgdGhlIGNob3NlbiBzY29wZS5cbiAgICAgICAgPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRJZGVudGl0eS10ZXh0XCI+XG4gICAgICAgICAgPEF0b21UZXh0RWRpdG9yIG1pbmkgcGxhY2Vob2xkZXJUZXh0PVwibmFtZVwiIGJ1ZmZlcj17dGhpcy5wcm9wcy51c2VybmFtZUJ1ZmZlcn0gLz5cbiAgICAgICAgICA8QXRvbVRleHRFZGl0b3IgbWluaSBwbGFjZWhvbGRlclRleHQ9XCJlbWFpbCBhZGRyZXNzXCIgYnVmZmVyPXt0aGlzLnByb3BzLmVtYWlsQnVmZmVyfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SWRlbnRpdHktYnV0dG9uc1wiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgb25DbGljaz17dGhpcy5wcm9wcy5jbG9zZX0+XG4gICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgdGl0bGU9XCJDb25maWd1cmUgZ2l0IGZvciB0aGlzIHJlcG9zaXRvcnlcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5zZXRMb2NhbH1cbiAgICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5wcm9wcy5jYW5Xcml0ZUxvY2FsfT5cbiAgICAgICAgICAgIFVzZSBmb3IgdGhpcyByZXBvc2l0b3J5XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgIHRpdGxlPVwiQ29uZmlndXJlIGdpdCBnbG9iYWxseSBmb3IgeW91ciBvcGVyYXRpbmcgc3lzdGVtIHVzZXIgYWNjb3VudFwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLnNldEdsb2JhbH0+XG4gICAgICAgICAgICBVc2UgZm9yIGFsbCByZXBvc2l0b3JpZXNcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXX0=