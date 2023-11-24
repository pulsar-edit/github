"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

var _marker = _interopRequireDefault(require("../atom/marker"));

var _decoration = _interopRequireDefault(require("../atom/decoration"));

var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));

var _commentGutterDecorationController = _interopRequireDefault(require("../controllers/comment-gutter-decoration-controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EditorCommentDecorationsController extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "openReviewThread", async threadId => {
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
        from: this.constructor.name
      });
    });

    this.rangesByRootID = new Map();
  }

  shouldComponentUpdate(nextProps) {
    return translationDigestFrom(this.props) !== translationDigestFrom(nextProps);
  }

  render() {
    if (!this.props.commentTranslationsForPath) {
      return null;
    }

    if (this.props.commentTranslationsForPath.removed && this.props.threadsForPath.length > 0) {
      const [firstThread] = this.props.threadsForPath;
      return _react.default.createElement(_marker.default, {
        editor: this.props.editor,
        exclusive: true,
        invalidate: "surround",
        bufferRange: _atom.Range.fromObject([[0, 0], [0, 0]])
      }, _react.default.createElement(_decoration.default, {
        type: "block",
        editor: this.props.editor,
        className: "github-EditorComment-omitted"
      }, _react.default.createElement("p", null, "This file has review comments, but its patch is too large for Atom to load."), _react.default.createElement("p", null, "Review comments may still be viewed within", _react.default.createElement("button", {
        className: "btn",
        onClick: () => this.openReviewThread(firstThread.threadID)
      }, "the review tab"), ".")));
    }

    return this.props.threadsForPath.map(thread => {
      const range = this.getRangeForThread(thread);

      if (!range) {
        return null;
      }

      return _react.default.createElement(_react.Fragment, {
        key: `github-editor-review-decoration-${thread.rootCommentID}`
      }, _react.default.createElement(_marker.default, {
        editor: this.props.editor,
        exclusive: true,
        invalidate: "surround",
        bufferRange: range,
        didChange: evt => this.markerDidChange(thread.rootCommentID, evt)
      }, _react.default.createElement(_decoration.default, {
        type: "line",
        editor: this.props.editor,
        className: "github-editorCommentHighlight",
        omitEmptyLastRow: false
      })), _react.default.createElement(_commentGutterDecorationController.default, {
        commentRow: range.start.row,
        threadId: thread.threadID,
        editor: this.props.editor,
        workspace: this.props.workspace,
        endpoint: this.props.endpoint,
        owner: this.props.owner,
        repo: this.props.repo,
        number: this.props.number,
        workdir: this.props.workdir,
        parent: this.constructor.name
      }));
    });
  }

  markerDidChange(rootCommentID, {
    newRange
  }) {
    this.rangesByRootID.set(rootCommentID, _atom.Range.fromObject(newRange));
  }

  getRangeForThread(thread) {
    const translations = this.props.commentTranslationsForPath;

    if (thread.position === null) {
      this.rangesByRootID.delete(thread.rootCommentID);
      return null;
    }

    let adjustedPosition = translations.diffToFilePosition.get(thread.position);

    if (!adjustedPosition) {
      this.rangesByRootID.delete(thread.rootCommentID);
      return null;
    }

    if (translations.fileTranslations) {
      adjustedPosition = translations.fileTranslations.get(adjustedPosition).newPosition;

      if (!adjustedPosition) {
        this.rangesByRootID.delete(thread.rootCommentID);
        return null;
      }
    }

    const editorRow = adjustedPosition - 1;
    let localRange = this.rangesByRootID.get(thread.rootCommentID);

    if (!localRange) {
      localRange = _atom.Range.fromObject([[editorRow, 0], [editorRow, Infinity]]);
      this.rangesByRootID.set(thread.rootCommentID, localRange);
    }

    return localRange;
  }

}

exports.default = EditorCommentDecorationsController;

_defineProperty(EditorCommentDecorationsController, "propTypes", {
  endpoint: _propTypes2.EndpointPropType.isRequired,
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  workdir: _propTypes.default.string.isRequired,
  workspace: _propTypes.default.object.isRequired,
  editor: _propTypes.default.object.isRequired,
  threadsForPath: _propTypes.default.arrayOf(_propTypes.default.shape({
    rootCommentID: _propTypes.default.string.isRequired,
    position: _propTypes.default.number,
    threadID: _propTypes.default.string.isRequired
  })).isRequired,
  commentTranslationsForPath: _propTypes.default.shape({
    diffToFilePosition: _propTypes.default.shape({
      get: _propTypes.default.func.isRequired
    }).isRequired,
    fileTranslations: _propTypes.default.shape({
      get: _propTypes.default.func.isRequired
    }),
    removed: _propTypes.default.bool.isRequired,
    digest: _propTypes.default.string
  })
});

function translationDigestFrom(props) {
  const translations = props.commentTranslationsForPath;
  return translations ? translations.digest : null;
}