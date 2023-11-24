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