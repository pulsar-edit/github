"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueCommentView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _timeago = _interopRequireDefault(require("../timeago"));

var _githubDotcomMarkdown = _interopRequireDefault(require("../github-dotcom-markdown"));

var _helpers = require("../../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareIssueCommentView extends _react.default.Component {
  render() {
    const comment = this.props.item;
    const author = comment.author || _helpers.GHOST_USER;
    return _react.default.createElement("div", {
      className: "issue timeline-item"
    }, _react.default.createElement("div", {
      className: "info-row"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "comment"
    }), _react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      alt: author.login,
      title: author.login
    }), _react.default.createElement("span", {
      className: "comment-message-header"
    }, author.login, " commented", ' ', _react.default.createElement("a", {
      href: comment.url
    }, _react.default.createElement(_timeago.default, {
      time: comment.createdAt
    })))), _react.default.createElement(_githubDotcomMarkdown.default, {
      html: comment.bodyHTML,
      switchToIssueish: this.props.switchToIssueish
    }));
  }

}

exports.BareIssueCommentView = BareIssueCommentView;

_defineProperty(BareIssueCommentView, "propTypes", {
  switchToIssueish: _propTypes.default.func.isRequired,
  item: _propTypes.default.shape({
    author: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    bodyHTML: _propTypes.default.string.isRequired,
    createdAt: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareIssueCommentView, {
  item: function () {
    const node = require("./__generated__/issueCommentView_item.graphql");

    if (node.hash && node.hash !== "adc36c52f51de14256693ab9e4eb84bb") {
      console.error("The definition of 'issueCommentView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueCommentView_item.graphql");
  }
});

exports.default = _default;