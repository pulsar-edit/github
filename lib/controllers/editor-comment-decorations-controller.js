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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFZGl0b3JDb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwidGhyZWFkSWQiLCJ1cmkiLCJSZXZpZXdzSXRlbSIsImJ1aWxkVVJJIiwiaG9zdCIsImVuZHBvaW50IiwiZ2V0SG9zdCIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsIndvcmtkaXIiLCJyZXZpZXdzSXRlbSIsIndvcmtzcGFjZSIsIm9wZW4iLCJzZWFyY2hBbGxQYW5lcyIsImp1bXBUb1RocmVhZCIsImFkZEV2ZW50IiwicGFja2FnZSIsImZyb20iLCJuYW1lIiwicmFuZ2VzQnlSb290SUQiLCJNYXAiLCJzaG91bGRDb21wb25lbnRVcGRhdGUiLCJuZXh0UHJvcHMiLCJ0cmFuc2xhdGlvbkRpZ2VzdEZyb20iLCJyZW5kZXIiLCJjb21tZW50VHJhbnNsYXRpb25zRm9yUGF0aCIsInJlbW92ZWQiLCJ0aHJlYWRzRm9yUGF0aCIsImxlbmd0aCIsImZpcnN0VGhyZWFkIiwiZWRpdG9yIiwiUmFuZ2UiLCJmcm9tT2JqZWN0Iiwib3BlblJldmlld1RocmVhZCIsInRocmVhZElEIiwibWFwIiwidGhyZWFkIiwicmFuZ2UiLCJnZXRSYW5nZUZvclRocmVhZCIsInJvb3RDb21tZW50SUQiLCJldnQiLCJtYXJrZXJEaWRDaGFuZ2UiLCJzdGFydCIsInJvdyIsIm5ld1JhbmdlIiwic2V0IiwidHJhbnNsYXRpb25zIiwicG9zaXRpb24iLCJkZWxldGUiLCJhZGp1c3RlZFBvc2l0aW9uIiwiZGlmZlRvRmlsZVBvc2l0aW9uIiwiZ2V0IiwiZmlsZVRyYW5zbGF0aW9ucyIsIm5ld1Bvc2l0aW9uIiwiZWRpdG9yUm93IiwibG9jYWxSYW5nZSIsIkluZmluaXR5IiwiRW5kcG9pbnRQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJvYmplY3QiLCJhcnJheU9mIiwic2hhcGUiLCJmdW5jIiwiYm9vbCIsImRpZ2VzdCJdLCJzb3VyY2VzIjpbImVkaXRvci1jb21tZW50LWRlY29yYXRpb25zLWNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IHtFbmRwb2ludFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi4vYXRvbS9tYXJrZXInO1xuaW1wb3J0IERlY29yYXRpb24gZnJvbSAnLi4vYXRvbS9kZWNvcmF0aW9uJztcbmltcG9ydCBSZXZpZXdzSXRlbSBmcm9tICcuLi9pdGVtcy9yZXZpZXdzLWl0ZW0nO1xuaW1wb3J0IENvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21tZW50LWd1dHRlci1kZWNvcmF0aW9uLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JDb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRocmVhZHNGb3JQYXRoOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcm9vdENvbW1lbnRJRDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgcG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB0aHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUcmFuc2xhdGlvbnNGb3JQYXRoOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZGlmZlRvRmlsZVBvc2l0aW9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBnZXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgZmlsZVRyYW5zbGF0aW9uczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgZ2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICByZW1vdmVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgZGlnZXN0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJhbmdlc0J5Um9vdElEID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0cmFuc2xhdGlvbkRpZ2VzdEZyb20odGhpcy5wcm9wcykgIT09IHRyYW5zbGF0aW9uRGlnZXN0RnJvbShuZXh0UHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jb21tZW50VHJhbnNsYXRpb25zRm9yUGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29tbWVudFRyYW5zbGF0aW9uc0ZvclBhdGgucmVtb3ZlZCAmJiB0aGlzLnByb3BzLnRocmVhZHNGb3JQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IFtmaXJzdFRocmVhZF0gPSB0aGlzLnByb3BzLnRocmVhZHNGb3JQYXRoO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TWFya2VyXG4gICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICBleGNsdXNpdmU9e3RydWV9XG4gICAgICAgICAgaW52YWxpZGF0ZT1cInN1cnJvdW5kXCJcbiAgICAgICAgICBidWZmZXJSYW5nZT17UmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKX0+XG5cbiAgICAgICAgICA8RGVjb3JhdGlvbiB0eXBlPVwiYmxvY2tcIiBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfSBjbGFzc05hbWU9XCJnaXRodWItRWRpdG9yQ29tbWVudC1vbWl0dGVkXCI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgVGhpcyBmaWxlIGhhcyByZXZpZXcgY29tbWVudHMsIGJ1dCBpdHMgcGF0Y2ggaXMgdG9vIGxhcmdlIGZvciBBdG9tIHRvIGxvYWQuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgUmV2aWV3IGNvbW1lbnRzIG1heSBzdGlsbCBiZSB2aWV3ZWQgd2l0aGluXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG5cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMub3BlblJldmlld1RocmVhZChmaXJzdFRocmVhZC50aHJlYWRJRCl9PnRoZSByZXZpZXcgdGFiPC9idXR0b24+LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvRGVjb3JhdGlvbj5cblxuICAgICAgICA8L01hcmtlcj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMudGhyZWFkc0ZvclBhdGgubWFwKHRocmVhZCA9PiB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0UmFuZ2VGb3JUaHJlYWQodGhyZWFkKTtcbiAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudCBrZXk9e2BnaXRodWItZWRpdG9yLXJldmlldy1kZWNvcmF0aW9uLSR7dGhyZWFkLnJvb3RDb21tZW50SUR9YH0+XG4gICAgICAgICAgPE1hcmtlclxuICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgIGV4Y2x1c2l2ZT17dHJ1ZX1cbiAgICAgICAgICAgIGludmFsaWRhdGU9XCJzdXJyb3VuZFwiXG4gICAgICAgICAgICBidWZmZXJSYW5nZT17cmFuZ2V9XG4gICAgICAgICAgICBkaWRDaGFuZ2U9e2V2dCA9PiB0aGlzLm1hcmtlckRpZENoYW5nZSh0aHJlYWQucm9vdENvbW1lbnRJRCwgZXZ0KX0+XG5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJsaW5lXCJcbiAgICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLWVkaXRvckNvbW1lbnRIaWdobGlnaHRcIlxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8L01hcmtlcj5cbiAgICAgICAgICA8Q29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyXG4gICAgICAgICAgICBjb21tZW50Um93PXtyYW5nZS5zdGFydC5yb3d9XG4gICAgICAgICAgICB0aHJlYWRJZD17dGhyZWFkLnRocmVhZElEfVxuICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgICAgIG93bmVyPXt0aGlzLnByb3BzLm93bmVyfVxuICAgICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvfVxuICAgICAgICAgICAgbnVtYmVyPXt0aGlzLnByb3BzLm51bWJlcn1cbiAgICAgICAgICAgIHdvcmtkaXI9e3RoaXMucHJvcHMud29ya2Rpcn1cbiAgICAgICAgICAgIHBhcmVudD17dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgbWFya2VyRGlkQ2hhbmdlKHJvb3RDb21tZW50SUQsIHtuZXdSYW5nZX0pIHtcbiAgICB0aGlzLnJhbmdlc0J5Um9vdElELnNldChyb290Q29tbWVudElELCBSYW5nZS5mcm9tT2JqZWN0KG5ld1JhbmdlKSk7XG4gIH1cblxuICBnZXRSYW5nZUZvclRocmVhZCh0aHJlYWQpIHtcbiAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSB0aGlzLnByb3BzLmNvbW1lbnRUcmFuc2xhdGlvbnNGb3JQYXRoO1xuXG4gICAgaWYgKHRocmVhZC5wb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5yYW5nZXNCeVJvb3RJRC5kZWxldGUodGhyZWFkLnJvb3RDb21tZW50SUQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFkanVzdGVkUG9zaXRpb24gPSB0cmFuc2xhdGlvbnMuZGlmZlRvRmlsZVBvc2l0aW9uLmdldCh0aHJlYWQucG9zaXRpb24pO1xuICAgIGlmICghYWRqdXN0ZWRQb3NpdGlvbikge1xuICAgICAgdGhpcy5yYW5nZXNCeVJvb3RJRC5kZWxldGUodGhyZWFkLnJvb3RDb21tZW50SUQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRyYW5zbGF0aW9ucy5maWxlVHJhbnNsYXRpb25zKSB7XG4gICAgICBhZGp1c3RlZFBvc2l0aW9uID0gdHJhbnNsYXRpb25zLmZpbGVUcmFuc2xhdGlvbnMuZ2V0KGFkanVzdGVkUG9zaXRpb24pLm5ld1Bvc2l0aW9uO1xuICAgICAgaWYgKCFhZGp1c3RlZFBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucmFuZ2VzQnlSb290SUQuZGVsZXRlKHRocmVhZC5yb290Q29tbWVudElEKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yUm93ID0gYWRqdXN0ZWRQb3NpdGlvbiAtIDE7XG5cbiAgICBsZXQgbG9jYWxSYW5nZSA9IHRoaXMucmFuZ2VzQnlSb290SUQuZ2V0KHRocmVhZC5yb290Q29tbWVudElEKTtcbiAgICBpZiAoIWxvY2FsUmFuZ2UpIHtcbiAgICAgIGxvY2FsUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbZWRpdG9yUm93LCAwXSwgW2VkaXRvclJvdywgSW5maW5pdHldXSk7XG4gICAgICB0aGlzLnJhbmdlc0J5Um9vdElELnNldCh0aHJlYWQucm9vdENvbW1lbnRJRCwgbG9jYWxSYW5nZSk7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbFJhbmdlO1xuICB9XG5cbiAgb3BlblJldmlld1RocmVhZCA9IGFzeW5jIHRocmVhZElkID0+IHtcbiAgICBjb25zdCB1cmkgPSBSZXZpZXdzSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0OiB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKSxcbiAgICAgIG93bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgcmVwbzogdGhpcy5wcm9wcy5yZXBvLFxuICAgICAgbnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMud29ya2RpcixcbiAgICB9KTtcbiAgICBjb25zdCByZXZpZXdzSXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWV9KTtcbiAgICByZXZpZXdzSXRlbS5qdW1wVG9UaHJlYWQodGhyZWFkSWQpO1xuICAgIGFkZEV2ZW50KCdvcGVuLXJldmlldy10aHJlYWQnLCB7cGFja2FnZTogJ2dpdGh1YicsIGZyb206IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0aW9uRGlnZXN0RnJvbShwcm9wcykge1xuICBjb25zdCB0cmFuc2xhdGlvbnMgPSBwcm9wcy5jb21tZW50VHJhbnNsYXRpb25zRm9yUGF0aDtcbiAgcmV0dXJuIHRyYW5zbGF0aW9ucyA/IHRyYW5zbGF0aW9ucy5kaWdlc3QgOiBudWxsO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBb0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXJGLE1BQU1BLGtDQUFrQyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQTJCOUVDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsMENBb0hJLE1BQU1DLFFBQVEsSUFBSTtNQUNuQyxNQUFNQyxHQUFHLEdBQUdDLG9CQUFXLENBQUNDLFFBQVEsQ0FBQztRQUMvQkMsSUFBSSxFQUFFLElBQUksQ0FBQ0wsS0FBSyxDQUFDTSxRQUFRLENBQUNDLE9BQU8sRUFBRTtRQUNuQ0MsS0FBSyxFQUFFLElBQUksQ0FBQ1IsS0FBSyxDQUFDUSxLQUFLO1FBQ3ZCQyxJQUFJLEVBQUUsSUFBSSxDQUFDVCxLQUFLLENBQUNTLElBQUk7UUFDckJDLE1BQU0sRUFBRSxJQUFJLENBQUNWLEtBQUssQ0FBQ1UsTUFBTTtRQUN6QkMsT0FBTyxFQUFFLElBQUksQ0FBQ1gsS0FBSyxDQUFDVztNQUN0QixDQUFDLENBQUM7TUFDRixNQUFNQyxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUNaLEtBQUssQ0FB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