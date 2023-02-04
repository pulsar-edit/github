"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommitCommentView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../../atom/octicon"));
var _timeago = _interopRequireDefault(require("../timeago"));
var _githubDotcomMarkdown = _interopRequireDefault(require("../github-dotcom-markdown"));
var _helpers = require("../../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareCommitCommentView extends _react.default.Component {
  render() {
    const comment = this.props.item;
    const author = comment.author || _helpers.GHOST_USER;
    return _react.default.createElement("div", {
      className: "issue"
    }, _react.default.createElement("div", {
      className: "info-row"
    }, this.props.isReply ? null : _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "comment"
    }), _react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      alt: author.login,
      title: author.login
    }), this.renderHeader(comment, author)), _react.default.createElement(_githubDotcomMarkdown.default, {
      html: comment.bodyHTML,
      switchToIssueish: this.props.switchToIssueish
    }));
  }
  renderHeader(comment, author) {
    if (this.props.isReply) {
      return _react.default.createElement("span", {
        className: "comment-message-header"
      }, author.login, " replied ", _react.default.createElement(_timeago.default, {
        time: comment.createdAt
      }));
    } else {
      return _react.default.createElement("span", {
        className: "comment-message-header"
      }, author.login, " commented ", this.renderPath(), " in", ' ', comment.commit.oid.substr(0, 7), " ", _react.default.createElement(_timeago.default, {
        time: comment.createdAt
      }));
    }
  }
  renderPath() {
    if (this.props.item.path) {
      return _react.default.createElement("span", null, "on ", _react.default.createElement("code", null, this.props.item.path));
    } else {
      return null;
    }
  }
}
exports.BareCommitCommentView = BareCommitCommentView;
_defineProperty(BareCommitCommentView, "propTypes", {
  item: _propTypes.default.object.isRequired,
  isReply: _propTypes.default.bool.isRequired,
  switchToIssueish: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareCommitCommentView, {
  item: function () {
    const node = require("./__generated__/commitCommentView_item.graphql");
    if (node.hash && node.hash !== "f3e868b343fe8d6fee958d5339b554dc") {
      console.error("The definition of 'commitCommentView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/commitCommentView_item.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ29tbWl0Q29tbWVudFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNvbW1lbnQiLCJwcm9wcyIsIml0ZW0iLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwiaXNSZXBseSIsImF2YXRhclVybCIsImxvZ2luIiwicmVuZGVySGVhZGVyIiwiYm9keUhUTUwiLCJzd2l0Y2hUb0lzc3VlaXNoIiwiY3JlYXRlZEF0IiwicmVuZGVyUGF0aCIsImNvbW1pdCIsIm9pZCIsInN1YnN0ciIsInBhdGgiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImZ1bmMiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciJdLCJzb3VyY2VzIjpbImNvbW1pdC1jb21tZW50LXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uLy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuLi90aW1lYWdvJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCB7R0hPU1RfVVNFUn0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ29tbWl0Q29tbWVudFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc1JlcGx5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICBjb25zdCBhdXRob3IgPSBjb21tZW50LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXNzdWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvLXJvd1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmlzUmVwbHkgPyBudWxsIDogPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJjb21tZW50XCIgLz59XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCJcbiAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59IHRpdGxlPXthdXRob3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJIZWFkZXIoY29tbWVudCwgYXV0aG9yKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93biBodG1sPXtjb21tZW50LmJvZHlIVE1MfSBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKGNvbW1lbnQsIGF1dGhvcikge1xuICAgIGlmICh0aGlzLnByb3BzLmlzUmVwbHkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1lbnQtbWVzc2FnZS1oZWFkZXJcIj5cbiAgICAgICAgICB7YXV0aG9yLmxvZ2lufSByZXBsaWVkIDxUaW1lYWdvIHRpbWU9e2NvbW1lbnQuY3JlYXRlZEF0fSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tZW50LW1lc3NhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAge2F1dGhvci5sb2dpbn0gY29tbWVudGVkIHt0aGlzLnJlbmRlclBhdGgoKX0gaW5cbiAgICAgICAgICB7JyAnfXtjb21tZW50LmNvbW1pdC5vaWQuc3Vic3RyKDAsIDcpfSA8VGltZWFnbyB0aW1lPXtjb21tZW50LmNyZWF0ZWRBdH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJQYXRoKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW0ucGF0aCkge1xuICAgICAgcmV0dXJuIDxzcGFuPm9uIDxjb2RlPnt0aGlzLnByb3BzLml0ZW0ucGF0aH08L2NvZGU+PC9zcGFuPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDb21taXRDb21tZW50Vmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNvbW1pdENvbW1lbnRWaWV3X2l0ZW0gb24gQ29tbWl0Q29tbWVudCB7XG4gICAgICBhdXRob3Ige1xuICAgICAgICBsb2dpbiBhdmF0YXJVcmxcbiAgICAgIH1cbiAgICAgIGNvbW1pdCB7IG9pZCB9XG4gICAgICBib2R5SFRNTCBjcmVhdGVkQXQgcGF0aCBwb3NpdGlvblxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUF5QztBQUFBO0FBQUE7QUFBQTtBQUVsQyxNQUFNQSxxQkFBcUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFPekRDLE1BQU0sR0FBRztJQUNQLE1BQU1DLE9BQU8sR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsSUFBSTtJQUMvQixNQUFNQyxNQUFNLEdBQUdILE9BQU8sQ0FBQ0csTUFBTSxJQUFJQyxtQkFBVTtJQUUzQyxPQUNFO01BQUssU0FBUyxFQUFDO0lBQU8sR0FDcEI7TUFBSyxTQUFTLEVBQUM7SUFBVSxHQUN0QixJQUFJLENBQUNILEtBQUssQ0FBQ0ksT0FBTyxHQUFHLElBQUksR0FBRyw2QkFBQyxnQkFBTztNQUFDLFNBQVMsRUFBQyx3QkFBd0I7TUFBQyxJQUFJLEVBQUM7SUFBUyxFQUFHLEVBQzFGO01BQUssU0FBUyxFQUFDLGVBQWU7TUFDNUIsR0FBRyxFQUFFRixNQUFNLENBQUNHLFNBQVU7TUFBQyxHQUFHLEVBQUVILE1BQU0sQ0FBQ0ksS0FBTTtNQUFDLEtBQUssRUFBRUosTUFBTSxDQUFDSTtJQUFNLEVBQzlELEVBQ0QsSUFBSSxDQUFDQyxZQUFZLENBQUNSLE9BQU8sRUFBRUcsTUFBTSxDQUFDLENBQy9CLEVBQ04sNkJBQUMsNkJBQW9CO01BQUMsSUFBSSxFQUFFSCxPQUFPLENBQUNTLFFBQVM7TUFBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUNSLEtBQUssQ0FBQ1M7SUFBaUIsRUFBRyxDQUMzRjtFQUVWO0VBRUFGLFlBQVksQ0FBQ1IsT0FBTyxFQUFFRyxNQUFNLEVBQUU7SUFDNUIsSUFBSSxJQUFJLENBQUNGLEtBQUssQ0FBQ0ksT0FBTyxFQUFFO01BQ3RCLE9BQ0U7UUFBTSxTQUFTLEVBQUM7TUFBd0IsR0FDckNGLE1BQU0sQ0FBQ0ksS0FBSyxlQUFVLDZCQUFDLGdCQUFPO1FBQUMsSUFBSSxFQUFFUCxPQUFPLENBQUNXO01BQVUsRUFBRyxDQUN0RDtJQUVYLENBQUMsTUFBTTtNQUNMLE9BQ0U7UUFBTSxTQUFTLEVBQUM7TUFBd0IsR0FDckNSLE1BQU0sQ0FBQ0ksS0FBSyxpQkFBYSxJQUFJLENBQUNLLFVBQVUsRUFBRSxTQUMxQyxHQUFHLEVBQUVaLE9BQU8sQ0FBQ2EsTUFBTSxDQUFDQyxHQUFHLENBQUNDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQUUsNkJBQUMsZ0JBQU87UUFBQyxJQUFJLEVBQUVmLE9BQU8sQ0FBQ1c7TUFBVSxFQUFHLENBQ3RFO0lBRVg7RUFDRjtFQUVBQyxVQUFVLEdBQUc7SUFDWCxJQUFJLElBQUksQ0FBQ1gsS0FBSyxDQUFDQyxJQUFJLENBQUNjLElBQUksRUFBRTtNQUN4QixPQUFPLGtEQUFTLDJDQUFPLElBQUksQ0FBQ2YsS0FBSyxDQUFDQyxJQUFJLENBQUNjLElBQUksQ0FBUSxDQUFPO0lBQzVELENBQUMsTUFBTTtNQUNMLE9BQU8sSUFBSTtJQUNiO0VBQ0Y7QUFDRjtBQUFDO0FBQUEsZ0JBakRZcEIscUJBQXFCLGVBQ2I7RUFDakJNLElBQUksRUFBRWUsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ2pDZCxPQUFPLEVBQUVZLGtCQUFTLENBQUNHLElBQUksQ0FBQ0QsVUFBVTtFQUNsQ1QsZ0JBQWdCLEVBQUVPLGtCQUFTLENBQUNJLElBQUksQ0FBQ0Y7QUFDbkMsQ0FBQztBQUFBLGVBOENZLElBQUFHLG1DQUF1QixFQUFDMUIscUJBQXFCLEVBQUU7RUFDNURNLElBQUk7SUFBQTtJQUFBO01BQUE7SUFBQTtJQUFBO0VBQUE7QUFTTixDQUFDLENBQUM7QUFBQSJ9