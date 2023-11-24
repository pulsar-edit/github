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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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