"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _timeago = _interopRequireDefault(require("./timeago"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _githubDotcomMarkdown = _interopRequireDefault(require("./github-dotcom-markdown"));
var _emojiReactionsController = _interopRequireDefault(require("../controllers/emoji-reactions-controller"));
var _helpers = require("../helpers");
var _actionableReviewView = _interopRequireDefault(require("./actionable-review-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ReviewCommentView extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "renderComment", showActionsMenu => {
      const comment = this.props.comment;
      if (comment.isMinimized) {
        return _react.default.createElement("div", {
          className: "github-Review-comment github-Review-comment--hidden",
          key: comment.id
        }, _react.default.createElement(_octicon.default, {
          icon: 'fold',
          className: "github-Review-icon"
        }), _react.default.createElement("em", null, "This comment was hidden"));
      }
      const commentClass = (0, _classnames.default)('github-Review-comment', {
        'github-Review-comment--pending': comment.state === 'PENDING'
      });
      const author = comment.author || _helpers.GHOST_USER;
      return _react.default.createElement("div", {
        className: commentClass
      }, _react.default.createElement("header", {
        className: "github-Review-header"
      }, _react.default.createElement("div", {
        className: "github-Review-header-authorData"
      }, _react.default.createElement("img", {
        className: "github-Review-avatar",
        src: author.avatarUrl,
        alt: author.login
      }), _react.default.createElement("a", {
        className: "github-Review-username",
        href: author.url
      }, author.login), _react.default.createElement("a", {
        className: "github-Review-timeAgo",
        href: comment.url
      }, _react.default.createElement(_timeago.default, {
        displayStyle: "long",
        time: comment.createdAt
      })), this.props.renderEditedLink(comment), this.props.renderAuthorAssociation(comment), comment.state === 'PENDING' && _react.default.createElement("span", {
        className: "github-Review-pendingBadge badge badge-warning"
      }, "pending")), _react.default.createElement(_octicon.default, {
        icon: "ellipses",
        className: "github-Review-actionsMenu",
        onClick: event => showActionsMenu(event, comment, author)
      })), _react.default.createElement("div", {
        className: "github-Review-text"
      }, _react.default.createElement(_githubDotcomMarkdown.default, {
        html: comment.bodyHTML,
        switchToIssueish: this.props.openIssueish,
        openIssueishLinkInNewTab: this.props.openIssueishLinkInNewTab
      }), _react.default.createElement(_emojiReactionsController.default, {
        reactable: comment,
        tooltips: this.props.tooltips,
        reportRelayError: this.props.reportRelayError
      })));
    });
    this.refEditor = new _refHolder.default();
  }
  render() {
    return _react.default.createElement(_actionableReviewView.default, {
      originalContent: this.props.comment,
      isPosting: this.props.isPosting,
      confirm: this.props.confirm,
      commands: this.props.commands,
      contentUpdater: this.props.updateComment,
      render: this.renderComment
    });
  }
}
exports.default = ReviewCommentView;
_defineProperty(ReviewCommentView, "propTypes", {
  // Model
  comment: _propTypes.default.object.isRequired,
  isPosting: _propTypes.default.bool.isRequired,
  // Atom environment
  confirm: _propTypes.default.func.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  // Render props
  renderEditedLink: _propTypes.default.func.isRequired,
  renderAuthorAssociation: _propTypes.default.func.isRequired,
  // Action methods
  openIssueish: _propTypes.default.func.isRequired,
  openIssueishLinkInNewTab: _propTypes.default.func.isRequired,
  updateComment: _propTypes.default.func.isRequired,
  reportRelayError: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXZpZXdDb21tZW50VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInNob3dBY3Rpb25zTWVudSIsImNvbW1lbnQiLCJpc01pbmltaXplZCIsImlkIiwiY29tbWVudENsYXNzIiwiY3giLCJzdGF0ZSIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInVybCIsImNyZWF0ZWRBdCIsInJlbmRlckVkaXRlZExpbmsiLCJyZW5kZXJBdXRob3JBc3NvY2lhdGlvbiIsImV2ZW50IiwiYm9keUhUTUwiLCJvcGVuSXNzdWVpc2giLCJvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIiLCJ0b29sdGlwcyIsInJlcG9ydFJlbGF5RXJyb3IiLCJyZWZFZGl0b3IiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJpc1Bvc3RpbmciLCJjb25maXJtIiwiY29tbWFuZHMiLCJ1cGRhdGVDb21tZW50IiwicmVuZGVyQ29tbWVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyJdLCJzb3VyY2VzIjpbInJldmlldy1jb21tZW50LXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgR2l0aHViRG90Y29tTWFya2Rvd24gZnJvbSAnLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZW1vamktcmVhY3Rpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IHtHSE9TVF9VU0VSfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBBY3Rpb25hYmxlUmV2aWV3VmlldyBmcm9tICcuL2FjdGlvbmFibGUtcmV2aWV3LXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXZpZXdDb21tZW50VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWxcbiAgICBjb21tZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNQb3N0aW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUmVuZGVyIHByb3BzXG4gICAgcmVuZGVyRWRpdGVkTGluazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZW5kZXJBdXRob3JBc3NvY2lhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgb3Blbklzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVDb21tZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZkVkaXRvciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEFjdGlvbmFibGVSZXZpZXdWaWV3XG4gICAgICAgIG9yaWdpbmFsQ29udGVudD17dGhpcy5wcm9wcy5jb21tZW50fVxuICAgICAgICBpc1Bvc3Rpbmc9e3RoaXMucHJvcHMuaXNQb3N0aW5nfVxuICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBjb250ZW50VXBkYXRlcj17dGhpcy5wcm9wcy51cGRhdGVDb21tZW50fVxuICAgICAgICByZW5kZXI9e3RoaXMucmVuZGVyQ29tbWVudH1cbiAgICAgIC8+KTtcbiAgfVxuXG4gIHJlbmRlckNvbW1lbnQgPSBzaG93QWN0aW9uc01lbnUgPT4ge1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnByb3BzLmNvbW1lbnQ7XG5cbiAgICBpZiAoY29tbWVudC5pc01pbmltaXplZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWNvbW1lbnQgZ2l0aHViLVJldmlldy1jb21tZW50LS1oaWRkZW5cIiBrZXk9e2NvbW1lbnQuaWR9PlxuICAgICAgICAgIDxPY3RpY29uIGljb249eydmb2xkJ30gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1pY29uXCIgLz5cbiAgICAgICAgICA8ZW0+VGhpcyBjb21tZW50IHdhcyBoaWRkZW48L2VtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tbWVudENsYXNzID0gY3goJ2dpdGh1Yi1SZXZpZXctY29tbWVudCcsIHsnZ2l0aHViLVJldmlldy1jb21tZW50LS1wZW5kaW5nJzogY29tbWVudC5zdGF0ZSA9PT0gJ1BFTkRJTkcnfSk7XG4gICAgY29uc3QgYXV0aG9yID0gY29tbWVudC5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y29tbWVudENsYXNzfT5cbiAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWhlYWRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1oZWFkZXItYXV0aG9yRGF0YVwiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWF2YXRhclwiXG4gICAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy11c2VybmFtZVwiIGhyZWY9e2F1dGhvci51cmx9PlxuICAgICAgICAgICAgICB7YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy10aW1lQWdvXCIgaHJlZj17Y29tbWVudC51cmx9PlxuICAgICAgICAgICAgICA8VGltZWFnbyBkaXNwbGF5U3R5bGU9XCJsb25nXCIgdGltZT17Y29tbWVudC5jcmVhdGVkQXR9IC8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZW5kZXJFZGl0ZWRMaW5rKGNvbW1lbnQpfVxuICAgICAgICAgICAge3RoaXMucHJvcHMucmVuZGVyQXV0aG9yQXNzb2NpYXRpb24oY29tbWVudCl9XG4gICAgICAgICAgICB7Y29tbWVudC5zdGF0ZSA9PT0gJ1BFTkRJTkcnICYmIChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1wZW5kaW5nQmFkZ2UgYmFkZ2UgYmFkZ2Utd2FybmluZ1wiPnBlbmRpbmc8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxPY3RpY29uXG4gICAgICAgICAgICBpY29uPVwiZWxsaXBzZXNcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1hY3Rpb25zTWVudVwiXG4gICAgICAgICAgICBvbkNsaWNrPXtldmVudCA9PiBzaG93QWN0aW9uc01lbnUoZXZlbnQsIGNvbW1lbnQsIGF1dGhvcil9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy10ZXh0XCI+XG4gICAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgICBodG1sPXtjb21tZW50LmJvZHlIVE1MfVxuICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWI9e3RoaXMucHJvcHMub3Blbklzc3VlaXNoTGlua0luTmV3VGFifVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlclxuICAgICAgICAgICAgcmVhY3RhYmxlPXtjb21tZW50fVxuICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBNEQ7QUFBQTtBQUFBO0FBQUE7QUFFN0MsTUFBTUEsaUJBQWlCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBc0I3REMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyx1Q0FnQkNDLGVBQWUsSUFBSTtNQUNq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