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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReviewCommentView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "renderComment", showActionsMenu => {
      const comment = this.props.comment;

      if (comment.isMinimized) {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: "github-Review-comment github-Review-comment--hidden",
          key: comment.id
        }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
          icon: 'fold',
          className: "github-Review-icon"
        }), /*#__PURE__*/_react.default.createElement("em", null, "This comment was hidden"));
      }

      const commentClass = (0, _classnames.default)('github-Review-comment', {
        'github-Review-comment--pending': comment.state === 'PENDING'
      });
      const author = comment.author || _helpers.GHOST_USER;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: commentClass
      }, /*#__PURE__*/_react.default.createElement("header", {
        className: "github-Review-header"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "github-Review-header-authorData"
      }, /*#__PURE__*/_react.default.createElement("img", {
        className: "github-Review-avatar",
        src: author.avatarUrl,
        alt: author.login
      }), /*#__PURE__*/_react.default.createElement("a", {
        className: "github-Review-username",
        href: author.url
      }, author.login), /*#__PURE__*/_react.default.createElement("a", {
        className: "github-Review-timeAgo",
        href: comment.url
      }, /*#__PURE__*/_react.default.createElement(_timeago.default, {
        displayStyle: "long",
        time: comment.createdAt
      })), this.props.renderEditedLink(comment), this.props.renderAuthorAssociation(comment), comment.state === 'PENDING' && /*#__PURE__*/_react.default.createElement("span", {
        className: "github-Review-pendingBadge badge badge-warning"
      }, "pending")), /*#__PURE__*/_react.default.createElement(_octicon.default, {
        icon: "ellipses",
        className: "github-Review-actionsMenu",
        onClick: event => showActionsMenu(event, comment, author)
      })), /*#__PURE__*/_react.default.createElement("div", {
        className: "github-Review-text"
      }, /*#__PURE__*/_react.default.createElement(_githubDotcomMarkdown.default, {
        html: comment.bodyHTML,
        switchToIssueish: this.props.openIssueish,
        openIssueishLinkInNewTab: this.props.openIssueishLinkInNewTab
      }), /*#__PURE__*/_react.default.createElement(_emojiReactionsController.default, {
        reactable: comment,
        tooltips: this.props.tooltips,
        reportRelayError: this.props.reportRelayError
      })));
    });

    this.refEditor = new _refHolder.default();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_actionableReviewView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZXZpZXctY29tbWVudC12aWV3LmpzIl0sIm5hbWVzIjpbIlJldmlld0NvbW1lbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic2hvd0FjdGlvbnNNZW51IiwiY29tbWVudCIsImlzTWluaW1pemVkIiwiaWQiLCJjb21tZW50Q2xhc3MiLCJzdGF0ZSIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInVybCIsImNyZWF0ZWRBdCIsInJlbmRlckVkaXRlZExpbmsiLCJyZW5kZXJBdXRob3JBc3NvY2lhdGlvbiIsImV2ZW50IiwiYm9keUhUTUwiLCJvcGVuSXNzdWVpc2giLCJvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIiLCJ0b29sdGlwcyIsInJlcG9ydFJlbGF5RXJyb3IiLCJyZWZFZGl0b3IiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJpc1Bvc3RpbmciLCJjb25maXJtIiwiY29tbWFuZHMiLCJ1cGRhdGVDb21tZW50IiwicmVuZGVyQ29tbWVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxpQkFBTixTQUFnQ0MsZUFBTUMsU0FBdEMsQ0FBZ0Q7QUFzQjdEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQiwyQ0FpQkhDLGVBQWUsSUFBSTtBQUNqQyxZQUFNQyxPQUFPLEdBQUcsS0FBS0YsS0FBTCxDQUFXRSxPQUEzQjs7QUFFQSxVQUFJQSxPQUFPLENBQUNDLFdBQVosRUFBeUI7QUFDdkIsNEJBQ0U7QUFBSyxVQUFBLFNBQVMsRUFBQyxxREFBZjtBQUFxRSxVQUFBLEdBQUcsRUFBRUQsT0FBTyxDQUFD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QUEsT0FBTyxFQUFFMkIsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBRlQ7QUFHakJQLEVBQUFBLFNBQVMsRUFBRUssbUJBQVVHLElBQVYsQ0FBZUQsVUFIVDtBQUtqQjtBQUNBTixFQUFBQSxPQUFPLEVBQUVJLG1CQUFVSSxJQUFWLENBQWVGLFVBTlA7QUFPakJaLEVBQUFBLFFBQVEsRUFBRVUsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBUFY7QUFRakJMLEVBQUFBLFFBQVEsRUFBRUcsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBUlY7QUFVakI7QUFDQWxCLEVBQUFBLGdCQUFnQixFQUFFZ0IsbUJBQVVJLElBQVYsQ0FBZUYsVUFYaEI7QUFZakJqQixFQUFBQSx1QkFBdUIsRUFBRWUsbUJBQVVJLElBQVYsQ0FBZUYsVUFadkI7QUFjakI7QUFDQWQsRUFBQUEsWUFBWSxFQUFFWSxtQkFBVUksSUFBVixDQUFlRixVQWZaO0FBZ0JqQmIsRUFBQUEsd0JBQXdCLEVBQUVXLG1CQUFVSSxJQUFWLENBQWVGLFVBaEJ4QjtBQWlCakJKLEVBQUFBLGFBQWEsRUFBRUUsbUJBQVVJLElBQVYsQ0FBZUYsVUFqQmI7QUFrQmpCWCxFQUFBQSxnQkFBZ0IsRUFBRVMsbUJBQVVJLElBQVYsQ0FBZUY7QUFsQmhCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuL3RpbWVhZ28nO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9lbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlcic7XG5pbXBvcnQge0dIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IEFjdGlvbmFibGVSZXZpZXdWaWV3IGZyb20gJy4vYWN0aW9uYWJsZS1yZXZpZXctdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJldmlld0NvbW1lbnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbFxuICAgIGNvbW1lbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc1Bvc3Rpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBSZW5kZXIgcHJvcHNcbiAgICByZW5kZXJFZGl0ZWRMaW5rOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlbmRlckF1dGhvckFzc29jaWF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBvcGVuSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUNvbW1lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVmRWRpdG9yID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QWN0aW9uYWJsZVJldmlld1ZpZXdcbiAgICAgICAgb3JpZ2luYWxDb250ZW50PXt0aGlzLnByb3BzLmNvbW1lbnR9XG4gICAgICAgIGlzUG9zdGluZz17dGhpcy5wcm9wcy5pc1Bvc3Rpbmd9XG4gICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGNvbnRlbnRVcGRhdGVyPXt0aGlzLnByb3BzLnVwZGF0ZUNvbW1lbnR9XG4gICAgICAgIHJlbmRlcj17dGhpcy5yZW5kZXJDb21tZW50fVxuICAgICAgLz4pO1xuICB9XG5cbiAgcmVuZGVyQ29tbWVudCA9IHNob3dBY3Rpb25zTWVudSA9PiB7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMucHJvcHMuY29tbWVudDtcblxuICAgIGlmIChjb21tZW50LmlzTWluaW1pemVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctY29tbWVudCBnaXRodWItUmV2aWV3LWNvbW1lbnQtLWhpZGRlblwiIGtleT17Y29tbWVudC5pZH0+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj17J2ZvbGQnfSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWljb25cIiAvPlxuICAgICAgICAgIDxlbT5UaGlzIGNvbW1lbnQgd2FzIGhpZGRlbjwvZW0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21tZW50Q2xhc3MgPSBjeCgnZ2l0aHViLVJldmlldy1jb21tZW50JywgeydnaXRodWItUmV2aWV3LWNvbW1lbnQtLXBlbmRpbmcnOiBjb21tZW50LnN0YXRlID09PSAnUEVORElORyd9KTtcbiAgICBjb25zdCBhdXRob3IgPSBjb21tZW50LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjb21tZW50Q2xhc3N9PlxuICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWhlYWRlci1hdXRob3JEYXRhXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctYXZhdGFyXCJcbiAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfSBhbHQ9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXVzZXJuYW1lXCIgaHJlZj17YXV0aG9yLnVybH0+XG4gICAgICAgICAgICAgIHthdXRob3IubG9naW59XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXRpbWVBZ29cIiBocmVmPXtjb21tZW50LnVybH0+XG4gICAgICAgICAgICAgIDxUaW1lYWdvIGRpc3BsYXlTdHlsZT1cImxvbmdcIiB0aW1lPXtjb21tZW50LmNyZWF0ZWRBdH0gLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnJlbmRlckVkaXRlZExpbmsoY29tbWVudCl9XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZW5kZXJBdXRob3JBc3NvY2lhdGlvbihjb21tZW50KX1cbiAgICAgICAgICAgIHtjb21tZW50LnN0YXRlID09PSAnUEVORElORycgJiYgKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXBlbmRpbmdCYWRnZSBiYWRnZSBiYWRnZS13YXJuaW5nXCI+cGVuZGluZzwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPE9jdGljb25cbiAgICAgICAgICAgIGljb249XCJlbGxpcHNlc1wiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWFjdGlvbnNNZW51XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2V2ZW50ID0+IHNob3dBY3Rpb25zTWVudShldmVudCwgY29tbWVudCwgYXV0aG9yKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXRleHRcIj5cbiAgICAgICAgICA8R2l0aHViRG90Y29tTWFya2Rvd25cbiAgICAgICAgICAgIGh0bWw9e2NvbW1lbnQuYm9keUhUTUx9XG4gICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaH1cbiAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYj17dGhpcy5wcm9wcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8RW1vamlSZWFjdGlvbnNDb250cm9sbGVyXG4gICAgICAgICAgICByZWFjdGFibGU9e2NvbW1lbnR9XG4gICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuIl19