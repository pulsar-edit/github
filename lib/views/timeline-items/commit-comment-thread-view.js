"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommitCommentThreadView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _commitCommentView = _interopRequireDefault(require("./commit-comment-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCommitCommentThreadView extends _react.default.Component {
  render() {
    const {
      item
    } = this.props;
    return _react.default.createElement("div", {
      className: "commit-comment-thread timeline-item"
    }, item.comments.edges.map((edge, i) => _react.default.createElement(_commitCommentView.default, {
      isReply: i !== 0,
      key: edge.node.id,
      item: edge.node,
      switchToIssueish: this.props.switchToIssueish
    })));
  }

}

exports.BareCommitCommentThreadView = BareCommitCommentThreadView;

_defineProperty(BareCommitCommentThreadView, "propTypes", {
  item: _propTypes.default.shape({
    commit: _propTypes.default.shape({
      oid: _propTypes.default.string.isRequired
    }).isRequired,
    comments: _propTypes.default.shape({
      edges: _propTypes.default.arrayOf(_propTypes.default.shape({
        node: _propTypes.default.object.isRequired
      }).isRequired).isRequired
    }).isRequired
  }).isRequired,
  switchToIssueish: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCommitCommentThreadView, {
  item: function () {
    const node = require("./__generated__/commitCommentThreadView_item.graphql");

    if (node.hash && node.hash !== "2f881b33df634a755a5d66b192c2791b") {
      console.error("The definition of 'commitCommentThreadView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/commitCommentThreadView_item.graphql");
  }
});

exports.default = _default;