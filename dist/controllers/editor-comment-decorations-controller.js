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
      return /*#__PURE__*/_react.default.createElement(_marker.default, {
        editor: this.props.editor,
        exclusive: true,
        invalidate: "surround",
        bufferRange: _atom.Range.fromObject([[0, 0], [0, 0]])
      }, /*#__PURE__*/_react.default.createElement(_decoration.default, {
        type: "block",
        editor: this.props.editor,
        className: "github-EditorComment-omitted"
      }, /*#__PURE__*/_react.default.createElement("p", null, "This file has review comments, but its patch is too large for Atom to load."), /*#__PURE__*/_react.default.createElement("p", null, "Review comments may still be viewed within", /*#__PURE__*/_react.default.createElement("button", {
        className: "btn",
        onClick: () => this.openReviewThread(firstThread.threadID)
      }, "the review tab"), ".")));
    }

    return this.props.threadsForPath.map(thread => {
      const range = this.getRangeForThread(thread);

      if (!range) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
        key: `github-editor-review-decoration-${thread.rootCommentID}`
      }, /*#__PURE__*/_react.default.createElement(_marker.default, {
        editor: this.props.editor,
        exclusive: true,
        invalidate: "surround",
        bufferRange: range,
        didChange: evt => this.markerDidChange(thread.rootCommentID, evt)
      }, /*#__PURE__*/_react.default.createElement(_decoration.default, {
        type: "line",
        editor: this.props.editor,
        className: "github-editorCommentHighlight",
        omitEmptyLastRow: false
      })), /*#__PURE__*/_react.default.createElement(_commentGutterDecorationController.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9lZGl0b3ItY29tbWVudC1kZWNvcmF0aW9ucy1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkVkaXRvckNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ0aHJlYWRJZCIsInVyaSIsIlJldmlld3NJdGVtIiwiYnVpbGRVUkkiLCJob3N0IiwiZW5kcG9pbnQiLCJnZXRIb3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwid29ya2RpciIsInJldmlld3NJdGVtIiwid29ya3NwYWNlIiwib3BlbiIsInNlYXJjaEFsbFBhbmVzIiwianVtcFRvVGhyZWFkIiwicGFja2FnZSIsImZyb20iLCJuYW1lIiwicmFuZ2VzQnlSb290SUQiLCJNYXAiLCJzaG91bGRDb21wb25lbnRVcGRhdGUiLCJuZXh0UHJvcHMiLCJ0cmFuc2xhdGlvbkRpZ2VzdEZyb20iLCJyZW5kZXIiLCJjb21tZW50VHJhbnNsYXRpb25zRm9yUGF0aCIsInJlbW92ZWQiLCJ0aHJlYWRzRm9yUGF0aCIsImxlbmd0aCIsImZpcnN0VGhyZWFkIiwiZWRpdG9yIiwiUmFuZ2UiLCJmcm9tT2JqZWN0Iiwib3BlblJldmlld1RocmVhZCIsInRocmVhZElEIiwibWFwIiwidGhyZWFkIiwicmFuZ2UiLCJnZXRSYW5nZUZvclRocmVhZCIsInJvb3RDb21tZW50SUQiLCJldnQiLCJtYXJrZXJEaWRDaGFuZ2UiLCJzdGFydCIsInJvdyIsIm5ld1JhbmdlIiwic2V0IiwidHJhbnNsYXRpb25zIiwicG9zaXRpb24iLCJkZWxldGUiLCJhZGp1c3RlZFBvc2l0aW9uIiwiZGlmZlRvRmlsZVBvc2l0aW9uIiwiZ2V0IiwiZmlsZVRyYW5zbGF0aW9ucyIsIm5ld1Bvc2l0aW9uIiwiZWRpdG9yUm93IiwibG9jYWxSYW5nZSIsIkluZmluaXR5IiwiRW5kcG9pbnRQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJvYmplY3QiLCJhcnJheU9mIiwic2hhcGUiLCJmdW5jIiwiYm9vbCIsImRpZ2VzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsa0NBQU4sU0FBaURDLGVBQU1DLFNBQXZELENBQWlFO0FBMkI5RUMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsOENBcUhBLE1BQU1DLFFBQU4sSUFBa0I7QUFDbkMsWUFBTUMsR0FBRyxHQUFHQyxxQkFBWUMsUUFBWixDQUFxQjtBQUMvQkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtMLEtBQUwsQ0FBV00sUUFBWCxDQUFvQkMsT0FBcEIsRUFEeUI7QUFFL0JDLFFBQUFBLEtBQUssRUFBRSxLQUFLUixLQUFMLENBQVdRLEtBRmE7QUFHL0JDLFFBQUFBLElBQUksRUFBRSxLQUFLVCxLQUFMLENBQVdTLElBSGM7QUFJL0JDLFFBQUFBLE1BQU0sRUFBRSxLQUFLVixLQUFMLENBQVdVLE1BSlk7QUFLL0JDLFFBQUFBLE9BQU8sRUFBRSxLQUFLWCxLQUFMLENBQVdXO0FBTFcsT0FBckIsQ0FBWjs7QUFPQSxZQUFNQyxXQUFXLEdBQUcsTUFBTSxLQUFLWixLQUFMLENBQVdhLFNBQVgsQ0FBcUJDLElBQXJCLENBQTBCWixHQUExQixFQUErQjtBQUFDYSxRQUFBQSxjQUFjLEVBQUU7QUFBakIsT0FBL0IsQ0FBMUI7QUFDQUgsTUFBQUEsV0FBVyxDQUFDSSxZQUFaLENBQXlCZixRQUF6QjtBQUNBLG1DQUFTLG9CQUFULEVBQStCO0FBQUNnQixRQUFBQSxPQUFPLEVBQUUsUUFBVjtBQUFvQkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtuQixXQUFMLENBQWlCb0I7QUFBM0MsT0FBL0I7QUFDRCxLQWhJa0I7O0FBR2pCLFNBQUtDLGNBQUwsR0FBc0IsSUFBSUMsR0FBSixFQUF0QjtBQUNEOztB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VWxELE1BRjRCO0FBR2hEeUIsSUFBQUEsUUFBUSxFQUFFeUIsbUJBQVVDLE1BQVYsQ0FBaUJGO0FBSHFCLEdBQWhCLENBQWxCLEVBSVpBLFVBYmE7QUFjakJqQyxFQUFBQSwwQkFBMEIsRUFBRWtDLG1CQUFVSSxLQUFWLENBQWdCO0FBQzFDYixJQUFBQSxrQkFBa0IsRUFBRVMsbUJBQVVJLEtBQVYsQ0FBZ0I7QUFDbENaLE1BQUFBLEdBQUcsRUFBRVEsbUJBQVVLLElBQVYsQ0FBZU47QUFEYyxLQUFoQixFQUVqQkEsVUFIdUM7QUFJMUNOLElBQUFBLGdCQUFnQixFQUFFTyxtQkFBVUksS0FBVixDQUFnQjtBQUNoQ1osTUFBQUEsR0FBRyxFQUFFUSxtQkFBVUssSUFBVixDQUFlTjtBQURZLEtBQWhCLENBSndCO0FBTzFDaEMsSUFBQUEsT0FBTyxFQUFFaUMsbUJBQVVNLElBQVYsQ0FBZVAsVUFQa0I7QUFRMUNRLElBQUFBLE1BQU0sRUFBRVAsbUJBQVVDO0FBUndCLEdBQWhCO0FBZFgsQzs7QUE2SnJCLFNBQVNyQyxxQkFBVCxDQUErQnhCLEtBQS9CLEVBQXNDO0FBQ3BDLFFBQU0rQyxZQUFZLEdBQUcvQyxLQUFLLENBQUMwQiwwQkFBM0I7QUFDQSxTQUFPcUIsWUFBWSxHQUFHQSxZQUFZLENBQUNvQixNQUFoQixHQUF5QixJQUE1QztBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IHtFbmRwb2ludFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi4vYXRvbS9tYXJrZXInO1xuaW1wb3J0IERlY29yYXRpb24gZnJvbSAnLi4vYXRvbS9kZWNvcmF0aW9uJztcbmltcG9ydCBSZXZpZXdzSXRlbSBmcm9tICcuLi9pdGVtcy9yZXZpZXdzLWl0ZW0nO1xuaW1wb3J0IENvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21tZW50LWd1dHRlci1kZWNvcmF0aW9uLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JDb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRocmVhZHNGb3JQYXRoOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgcm9vdENvbW1lbnRJRDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgcG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB0aHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pKS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUcmFuc2xhdGlvbnNGb3JQYXRoOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZGlmZlRvRmlsZVBvc2l0aW9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBnZXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgZmlsZVRyYW5zbGF0aW9uczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgZ2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICByZW1vdmVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgZGlnZXN0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJhbmdlc0J5Um9vdElEID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0cmFuc2xhdGlvbkRpZ2VzdEZyb20odGhpcy5wcm9wcykgIT09IHRyYW5zbGF0aW9uRGlnZXN0RnJvbShuZXh0UHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jb21tZW50VHJhbnNsYXRpb25zRm9yUGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29tbWVudFRyYW5zbGF0aW9uc0ZvclBhdGgucmVtb3ZlZCAmJiB0aGlzLnByb3BzLnRocmVhZHNGb3JQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IFtmaXJzdFRocmVhZF0gPSB0aGlzLnByb3BzLnRocmVhZHNGb3JQYXRoO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8TWFya2VyXG4gICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICBleGNsdXNpdmU9e3RydWV9XG4gICAgICAgICAgaW52YWxpZGF0ZT1cInN1cnJvdW5kXCJcbiAgICAgICAgICBidWZmZXJSYW5nZT17UmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKX0+XG5cbiAgICAgICAgICA8RGVjb3JhdGlvbiB0eXBlPVwiYmxvY2tcIiBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfSBjbGFzc05hbWU9XCJnaXRodWItRWRpdG9yQ29tbWVudC1vbWl0dGVkXCI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgVGhpcyBmaWxlIGhhcyByZXZpZXcgY29tbWVudHMsIGJ1dCBpdHMgcGF0Y2ggaXMgdG9vIGxhcmdlIGZvciBBdG9tIHRvIGxvYWQuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgUmV2aWV3IGNvbW1lbnRzIG1heSBzdGlsbCBiZSB2aWV3ZWQgd2l0aGluXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG5cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMub3BlblJldmlld1RocmVhZChmaXJzdFRocmVhZC50aHJlYWRJRCl9PnRoZSByZXZpZXcgdGFiPC9idXR0b24+LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvRGVjb3JhdGlvbj5cblxuICAgICAgICA8L01hcmtlcj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMudGhyZWFkc0ZvclBhdGgubWFwKHRocmVhZCA9PiB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0UmFuZ2VGb3JUaHJlYWQodGhyZWFkKTtcbiAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudCBrZXk9e2BnaXRodWItZWRpdG9yLXJldmlldy1kZWNvcmF0aW9uLSR7dGhyZWFkLnJvb3RDb21tZW50SUR9YH0+XG4gICAgICAgICAgPE1hcmtlclxuICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgIGV4Y2x1c2l2ZT17dHJ1ZX1cbiAgICAgICAgICAgIGludmFsaWRhdGU9XCJzdXJyb3VuZFwiXG4gICAgICAgICAgICBidWZmZXJSYW5nZT17cmFuZ2V9XG4gICAgICAgICAgICBkaWRDaGFuZ2U9e2V2dCA9PiB0aGlzLm1hcmtlckRpZENoYW5nZSh0aHJlYWQucm9vdENvbW1lbnRJRCwgZXZ0KX0+XG5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJsaW5lXCJcbiAgICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLWVkaXRvckNvbW1lbnRIaWdobGlnaHRcIlxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8L01hcmtlcj5cbiAgICAgICAgICA8Q29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyXG4gICAgICAgICAgICBjb21tZW50Um93PXtyYW5nZS5zdGFydC5yb3d9XG4gICAgICAgICAgICB0aHJlYWRJZD17dGhyZWFkLnRocmVhZElEfVxuICAgICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgICAgIG93bmVyPXt0aGlzLnByb3BzLm93bmVyfVxuICAgICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvfVxuICAgICAgICAgICAgbnVtYmVyPXt0aGlzLnByb3BzLm51bWJlcn1cbiAgICAgICAgICAgIHdvcmtkaXI9e3RoaXMucHJvcHMud29ya2Rpcn1cbiAgICAgICAgICAgIHBhcmVudD17dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgbWFya2VyRGlkQ2hhbmdlKHJvb3RDb21tZW50SUQsIHtuZXdSYW5nZX0pIHtcbiAgICB0aGlzLnJhbmdlc0J5Um9vdElELnNldChyb290Q29tbWVudElELCBSYW5nZS5mcm9tT2JqZWN0KG5ld1JhbmdlKSk7XG4gIH1cblxuICBnZXRSYW5nZUZvclRocmVhZCh0aHJlYWQpIHtcbiAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSB0aGlzLnByb3BzLmNvbW1lbnRUcmFuc2xhdGlvbnNGb3JQYXRoO1xuXG4gICAgaWYgKHRocmVhZC5wb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5yYW5nZXNCeVJvb3RJRC5kZWxldGUodGhyZWFkLnJvb3RDb21tZW50SUQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFkanVzdGVkUG9zaXRpb24gPSB0cmFuc2xhdGlvbnMuZGlmZlRvRmlsZVBvc2l0aW9uLmdldCh0aHJlYWQucG9zaXRpb24pO1xuICAgIGlmICghYWRqdXN0ZWRQb3NpdGlvbikge1xuICAgICAgdGhpcy5yYW5nZXNCeVJvb3RJRC5kZWxldGUodGhyZWFkLnJvb3RDb21tZW50SUQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRyYW5zbGF0aW9ucy5maWxlVHJhbnNsYXRpb25zKSB7XG4gICAgICBhZGp1c3RlZFBvc2l0aW9uID0gdHJhbnNsYXRpb25zLmZpbGVUcmFuc2xhdGlvbnMuZ2V0KGFkanVzdGVkUG9zaXRpb24pLm5ld1Bvc2l0aW9uO1xuICAgICAgaWYgKCFhZGp1c3RlZFBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucmFuZ2VzQnlSb290SUQuZGVsZXRlKHRocmVhZC5yb290Q29tbWVudElEKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yUm93ID0gYWRqdXN0ZWRQb3NpdGlvbiAtIDE7XG5cbiAgICBsZXQgbG9jYWxSYW5nZSA9IHRoaXMucmFuZ2VzQnlSb290SUQuZ2V0KHRocmVhZC5yb290Q29tbWVudElEKTtcbiAgICBpZiAoIWxvY2FsUmFuZ2UpIHtcbiAgICAgIGxvY2FsUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbZWRpdG9yUm93LCAwXSwgW2VkaXRvclJvdywgSW5maW5pdHldXSk7XG4gICAgICB0aGlzLnJhbmdlc0J5Um9vdElELnNldCh0aHJlYWQucm9vdENvbW1lbnRJRCwgbG9jYWxSYW5nZSk7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbFJhbmdlO1xuICB9XG5cbiAgb3BlblJldmlld1RocmVhZCA9IGFzeW5jIHRocmVhZElkID0+IHtcbiAgICBjb25zdCB1cmkgPSBSZXZpZXdzSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0OiB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKSxcbiAgICAgIG93bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgcmVwbzogdGhpcy5wcm9wcy5yZXBvLFxuICAgICAgbnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMud29ya2RpcixcbiAgICB9KTtcbiAgICBjb25zdCByZXZpZXdzSXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWV9KTtcbiAgICByZXZpZXdzSXRlbS5qdW1wVG9UaHJlYWQodGhyZWFkSWQpO1xuICAgIGFkZEV2ZW50KCdvcGVuLXJldmlldy10aHJlYWQnLCB7cGFja2FnZTogJ2dpdGh1YicsIGZyb206IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0aW9uRGlnZXN0RnJvbShwcm9wcykge1xuICBjb25zdCB0cmFuc2xhdGlvbnMgPSBwcm9wcy5jb21tZW50VHJhbnNsYXRpb25zRm9yUGF0aDtcbiAgcmV0dXJuIHRyYW5zbGF0aW9ucyA/IHRyYW5zbGF0aW9ucy5kaWdlc3QgOiBudWxsO1xufVxuIl19