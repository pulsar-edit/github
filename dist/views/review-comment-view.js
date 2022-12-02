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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZXZpZXctY29tbWVudC12aWV3LmpzIl0sIm5hbWVzIjpbIlJldmlld0NvbW1lbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic2hvd0FjdGlvbnNNZW51IiwiY29tbWVudCIsImlzTWluaW1pemVkIiwiaWQiLCJjb21tZW50Q2xhc3MiLCJzdGF0ZSIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInVybCIsImNyZWF0ZWRBdCIsInJlbmRlckVkaXRlZExpbmsiLCJyZW5kZXJBdXRob3JBc3NvY2lhdGlvbiIsImV2ZW50IiwiYm9keUhUTUwiLCJvcGVuSXNzdWVpc2giLCJvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIiLCJ0b29sdGlwcyIsInJlcG9ydFJlbGF5RXJyb3IiLCJyZWZFZGl0b3IiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJpc1Bvc3RpbmciLCJjb25maXJtIiwiY29tbWFuZHMiLCJ1cGRhdGVDb21tZW50IiwicmVuZGVyQ29tbWVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxpQkFBTixTQUFnQ0MsZUFBTUMsU0FBdEMsQ0FBZ0Q7QUFzQjdEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQiwyQ0FpQkhDLGVBQWUsSUFBSTtBQUNqQyxZQUFNQyxPQUFPLEdBQUcsS0FBS0YsS0FBTCxDQUFXRSxPQUEzQjs7QUFFQSxVQUFJQSxPQUFPLENBQUNDLFdBQVosRUFBeUI7QUFDdkIsZUFDRTtBQUFLLFVBQUEsU0FBUyxFQUFDLHFEQUFmO0FBQXFFLFVBQUEsR0FBRyxFQUFFRCxPQUFPLENBQUNF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QUUyQixtQkFBVUMsTUFBVixDQUFpQkMsVUFGVDtBQUdqQlAsRUFBQUEsU0FBUyxFQUFFSyxtQkFBVUcsSUFBVixDQUFlRCxVQUhUO0FBS2pCO0FBQ0FOLEVBQUFBLE9BQU8sRUFBRUksbUJBQVVJLElBQVYsQ0FBZUYsVUFOUDtBQU9qQlosRUFBQUEsUUFBUSxFQUFFVSxtQkFBVUMsTUFBVixDQUFpQkMsVUFQVjtBQVFqQkwsRUFBQUEsUUFBUSxFQUFFRyxtQkFBVUMsTUFBVixDQUFpQkMsVUFSVjtBQVVqQjtBQUNBbEIsRUFBQUEsZ0JBQWdCLEVBQUVnQixtQkFBVUksSUFBVixDQUFlRixVQVhoQjtBQVlqQmpCLEVBQUFBLHVCQUF1QixFQUFFZSxtQkFBVUksSUFBVixDQUFlRixVQVp2QjtBQWNqQjtBQUNBZCxFQUFBQSxZQUFZLEVBQUVZLG1CQUFVSSxJQUFWLENBQWVGLFVBZlo7QUFnQmpCYixFQUFBQSx3QkFBd0IsRUFBRVcsbUJBQVVJLElBQVYsQ0FBZUYsVUFoQnhCO0FBaUJqQkosRUFBQUEsYUFBYSxFQUFFRSxtQkFBVUksSUFBVixDQUFlRixVQWpCYjtBQWtCakJYLEVBQUFBLGdCQUFnQixFQUFFUyxtQkFBVUksSUFBVixDQUFlRjtBQWxCaEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4vdGltZWFnbyc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IEdpdGh1YkRvdGNvbU1hcmtkb3duIGZyb20gJy4vZ2l0aHViLWRvdGNvbS1tYXJrZG93bic7XG5pbXBvcnQgRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vtb2ppLXJlYWN0aW9ucy1jb250cm9sbGVyJztcbmltcG9ydCB7R0hPU1RfVVNFUn0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgQWN0aW9uYWJsZVJldmlld1ZpZXcgZnJvbSAnLi9hY3Rpb25hYmxlLXJldmlldy12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmV2aWV3Q29tbWVudFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgY29tbWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzUG9zdGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIFJlbmRlciBwcm9wc1xuICAgIHJlbmRlckVkaXRlZExpbms6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVuZGVyQXV0aG9yQXNzb2NpYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIG9wZW5Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlQ29tbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5yZWZFZGl0b3IgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBY3Rpb25hYmxlUmV2aWV3Vmlld1xuICAgICAgICBvcmlnaW5hbENvbnRlbnQ9e3RoaXMucHJvcHMuY29tbWVudH1cbiAgICAgICAgaXNQb3N0aW5nPXt0aGlzLnByb3BzLmlzUG9zdGluZ31cbiAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgY29udGVudFVwZGF0ZXI9e3RoaXMucHJvcHMudXBkYXRlQ29tbWVudH1cbiAgICAgICAgcmVuZGVyPXt0aGlzLnJlbmRlckNvbW1lbnR9XG4gICAgICAvPik7XG4gIH1cblxuICByZW5kZXJDb21tZW50ID0gc2hvd0FjdGlvbnNNZW51ID0+IHtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5wcm9wcy5jb21tZW50O1xuXG4gICAgaWYgKGNvbW1lbnQuaXNNaW5pbWl6ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1jb21tZW50IGdpdGh1Yi1SZXZpZXctY29tbWVudC0taGlkZGVuXCIga2V5PXtjb21tZW50LmlkfT5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPXsnZm9sZCd9IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaWNvblwiIC8+XG4gICAgICAgICAgPGVtPlRoaXMgY29tbWVudCB3YXMgaGlkZGVuPC9lbT5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbW1lbnRDbGFzcyA9IGN4KCdnaXRodWItUmV2aWV3LWNvbW1lbnQnLCB7J2dpdGh1Yi1SZXZpZXctY29tbWVudC0tcGVuZGluZyc6IGNvbW1lbnQuc3RhdGUgPT09ICdQRU5ESU5HJ30pO1xuICAgIGNvbnN0IGF1dGhvciA9IGNvbW1lbnQuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NvbW1lbnRDbGFzc30+XG4gICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1oZWFkZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaGVhZGVyLWF1dGhvckRhdGFcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1hdmF0YXJcIlxuICAgICAgICAgICAgICBzcmM9e2F1dGhvci5hdmF0YXJVcmx9IGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctdXNlcm5hbWVcIiBocmVmPXthdXRob3IudXJsfT5cbiAgICAgICAgICAgICAge2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctdGltZUFnb1wiIGhyZWY9e2NvbW1lbnQudXJsfT5cbiAgICAgICAgICAgICAgPFRpbWVhZ28gZGlzcGxheVN0eWxlPVwibG9uZ1wiIHRpbWU9e2NvbW1lbnQuY3JlYXRlZEF0fSAvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucmVuZGVyRWRpdGVkTGluayhjb21tZW50KX1cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnJlbmRlckF1dGhvckFzc29jaWF0aW9uKGNvbW1lbnQpfVxuICAgICAgICAgICAge2NvbW1lbnQuc3RhdGUgPT09ICdQRU5ESU5HJyAmJiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcGVuZGluZ0JhZGdlIGJhZGdlIGJhZGdlLXdhcm5pbmdcIj5wZW5kaW5nPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgaWNvbj1cImVsbGlwc2VzXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctYWN0aW9uc01lbnVcIlxuICAgICAgICAgICAgb25DbGljaz17ZXZlbnQgPT4gc2hvd0FjdGlvbnNNZW51KGV2ZW50LCBjb21tZW50LCBhdXRob3IpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvaGVhZGVyPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctdGV4dFwiPlxuICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgaHRtbD17Y29tbWVudC5ib2R5SFRNTH1cbiAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiPXt0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgIHJlYWN0YWJsZT17Y29tbWVudH1cbiAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG4iXX0=