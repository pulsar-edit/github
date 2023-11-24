"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _atom = require("atom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _decoration = _interopRequireDefault(require("../atom/decoration"));

var _marker = _interopRequireDefault(require("../atom/marker"));

var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommentGutterDecorationController extends _react.default.Component {
  render() {
    const range = _atom.Range.fromObject([[this.props.commentRow, 0], [this.props.commentRow, Infinity]]);

    return _react.default.createElement(_marker.default, {
      key: `github-comment-gutter-decoration-${this.props.threadId}`,
      editor: this.props.editor,
      exclusive: true,
      invalidate: "surround",
      bufferRange: range
    }, _react.default.createElement(_decoration.default, {
      editor: this.props.editor,
      type: "gutter",
      gutterName: "github-comment-icon",
      className: `github-editorCommentGutterIcon ${this.props.extraClasses.join(' ')}`,
      omitEmptyLastRow: false
    }, _react.default.createElement("button", {
      className: "icon icon-comment",
      onClick: () => this.openReviewThread(this.props.threadId)
    })));
  }

  async openReviewThread(threadId) {
    const uri = _reviewsItem.default.buildURI({
      host: this.props.endpoint.getHost(),
      owner: this.props.owner,
      repo: this.props.repo,
      number: this.props.number,
      workdir: this.props.workdir
    });

    const reviewsItem = await this.props.workspace.open(uri, {
      searchAllPanes: true
    });
    reviewsItem.jumpToThread(threadId);
    (0, _reporterProxy.addEvent)('open-review-thread', {
      package: 'github',
      from: this.props.parent
    });
  }

}

exports.default = CommentGutterDecorationController;

_defineProperty(CommentGutterDecorationController, "propTypes", {
  commentRow: _propTypes.default.number.isRequired,
  threadId: _propTypes.default.string.isRequired,
  extraClasses: _propTypes.default.array,
  workspace: _propTypes.default.object.isRequired,
  endpoint: _propTypes2.EndpointPropType.isRequired,
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  workdir: _propTypes.default.string.isRequired,
  editor: _propTypes.default.object,
  // For metric reporting
  parent: _propTypes.default.string.isRequired
});

_defineProperty(CommentGutterDecorationController, "defaultProps", {
  extraClasses: []
});