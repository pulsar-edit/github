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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21tZW50R3V0dGVyRGVjb3JhdGlvbkNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJhbmdlIiwiUmFuZ2UiLCJmcm9tT2JqZWN0IiwicHJvcHMiLCJjb21tZW50Um93IiwiSW5maW5pdHkiLCJ0aHJlYWRJZCIsImVkaXRvciIsImV4dHJhQ2xhc3NlcyIsImpvaW4iLCJvcGVuUmV2aWV3VGhyZWFkIiwidXJpIiwiUmV2aWV3c0l0ZW0iLCJidWlsZFVSSSIsImhvc3QiLCJlbmRwb2ludCIsImdldEhvc3QiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJ3b3JrZGlyIiwicmV2aWV3c0l0ZW0iLCJ3b3Jrc3BhY2UiLCJvcGVuIiwic2VhcmNoQWxsUGFuZXMiLCJqdW1wVG9UaHJlYWQiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJmcm9tIiwicGFyZW50IiwiUHJvcFR5cGVzIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImFycmF5Iiwib2JqZWN0IiwiRW5kcG9pbnRQcm9wVHlwZSJdLCJzb3VyY2VzIjpbImNvbW1lbnQtZ3V0dGVyLWRlY29yYXRpb24tY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtFbmRwb2ludFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBEZWNvcmF0aW9uIGZyb20gJy4uL2F0b20vZGVjb3JhdGlvbic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL2F0b20vbWFya2VyJztcbmltcG9ydCBSZXZpZXdzSXRlbSBmcm9tICcuLi9pdGVtcy9yZXZpZXdzLWl0ZW0nO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50R3V0dGVyRGVjb3JhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbW1lbnRSb3c6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB0aHJlYWRJZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGV4dHJhQ2xhc3NlczogUHJvcFR5cGVzLmFycmF5LFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgZWRpdG9yOiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLy8gRm9yIG1ldHJpYyByZXBvcnRpbmdcbiAgICBwYXJlbnQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGV4dHJhQ2xhc3NlczogW10sXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbdGhpcy5wcm9wcy5jb21tZW50Um93LCAwXSwgW3RoaXMucHJvcHMuY29tbWVudFJvdywgSW5maW5pdHldXSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXJcbiAgICAgICAga2V5PXtgZ2l0aHViLWNvbW1lbnQtZ3V0dGVyLWRlY29yYXRpb24tJHt0aGlzLnByb3BzLnRocmVhZElkfWB9XG4gICAgICAgIGVkaXRvcj17dGhpcy5wcm9wcy5lZGl0b3J9XG4gICAgICAgIGV4Y2x1c2l2ZT17dHJ1ZX1cbiAgICAgICAgaW52YWxpZGF0ZT1cInN1cnJvdW5kXCJcbiAgICAgICAgYnVmZmVyUmFuZ2U9e3JhbmdlfT5cbiAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfVxuICAgICAgICAgIHR5cGU9XCJndXR0ZXJcIlxuICAgICAgICAgIGd1dHRlck5hbWU9XCJnaXRodWItY29tbWVudC1pY29uXCJcbiAgICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItZWRpdG9yQ29tbWVudEd1dHRlckljb24gJHt0aGlzLnByb3BzLmV4dHJhQ2xhc3Nlcy5qb2luKCcgJyl9YH1cbiAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX0+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJpY29uIGljb24tY29tbWVudFwiIG9uQ2xpY2s9eygpID0+IHRoaXMub3BlblJldmlld1RocmVhZCh0aGlzLnByb3BzLnRocmVhZElkKX0gLz5cbiAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgPC9NYXJrZXI+XG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5SZXZpZXdUaHJlYWQodGhyZWFkSWQpIHtcbiAgICBjb25zdCB1cmkgPSBSZXZpZXdzSXRlbS5idWlsZFVSSSh7XG4gICAgICBob3N0OiB0aGlzLnByb3BzLmVuZHBvaW50LmdldEhvc3QoKSxcbiAgICAgIG93bmVyOiB0aGlzLnByb3BzLm93bmVyLFxuICAgICAgcmVwbzogdGhpcy5wcm9wcy5yZXBvLFxuICAgICAgbnVtYmVyOiB0aGlzLnByb3BzLm51bWJlcixcbiAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMud29ya2RpcixcbiAgICB9KTtcbiAgICBjb25zdCByZXZpZXdzSXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWV9KTtcbiAgICByZXZpZXdzSXRlbS5qdW1wVG9UaHJlYWQodGhyZWFkSWQpO1xuICAgIGFkZEV2ZW50KCdvcGVuLXJldmlldy10aHJlYWQnLCB7cGFja2FnZTogJ2dpdGh1YicsIGZyb206IHRoaXMucHJvcHMucGFyZW50fSk7XG4gIH1cblxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQTJDO0FBQUE7QUFBQTtBQUFBO0FBRTVCLE1BQU1BLGlDQUFpQyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXNCN0VDLE1BQU0sR0FBRztJQUNQLE1BQU1DLEtBQUssR0FBR0MsV0FBSyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUNELEtBQUssQ0FBQ0MsVUFBVSxFQUFFQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE9BQ0UsNkJBQUMsZUFBTTtNQUNMLEdBQUcsRUFBRyxvQ0FBbUMsSUFBSSxDQUFDRixLQUFLLENBQUNHLFFBQVMsRUFBRTtNQUMvRCxNQUFNLEVBQUUsSUFBSSxDQUFDSCxLQUFLLENBQUNJLE1BQU87TUFDMUIsU0FBUyxFQUFFLElBQUs7TUFDaEIsVUFBVSxFQUFDLFVBQVU7TUFDckIsV0FBVyxFQUFFUDtJQUFNLEdBQ25CLDZCQUFDLG1CQUFVO01BQ1QsTUFBTSxFQUFFLElBQUksQ0FBQ0csS0FBSyxDQUFDSSxNQUFPO01BQzFCLElBQUksRUFBQyxRQUFRO01BQ2IsVUFBVSxFQUFDLHFCQUFxQjtNQUNoQyxTQUFTLEVBQUcsa0NBQWlDLElBQUksQ0FBQ0osS0FBSyxDQUFDSyxZQUFZLENBQUNDLElBQUksQ0FBQyxHQUFHLENBQUUsRUFBRTtNQUNqRixnQkFBZ0IsRUFBRTtJQUFNLEdBQ3hCO01BQVEsU0FBUyxFQUFDLG1CQUFtQjtNQUFDLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDUCxLQUFLLENBQUNHLFFBQVE7SUFBRSxFQUFHLENBQ3hGLENBQ047RUFFYjtFQUVBLE1BQU1JLGdCQUFnQixDQUFDSixRQUFRLEVBQUU7SUFDL0IsTUFBTUssR0FBRyxHQUFHQyxvQkFBVyxDQUFDQyxRQUFRLENBQUM7TUFDL0JDLElBQUksRUFBRSxJQUFJLENBQUNYLEtBQUssQ0FBQ1ksUUFBUSxDQUFDQyxPQUFPLEVBQUU7TUFDbkNDLEtBQUssRUFBRSxJQUFJLENBQUNkLEtBQUssQ0FBQ2MsS0FBSztNQUN2QkMsSUFBSSxFQUFFLElBQUksQ0FBQ2YsS0FBSyxDQUFDZSxJQUFJO01BQ3JCQyxNQUFNLEVBQUUsSUFBSSxDQUFDaEIsS0FBSyxDQUFDZ0IsTUFBTTtNQUN6QkMsT0FBTyxFQUFFLElBQUksQ0FBQ2pCLEtBQUssQ0FBQ2lCO0lBQ3RCLENBQUMsQ0FBQztJQUNGLE1BQU1DLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ21CLFNBQVMsQ0FBQ0MsSUFBSSxDQUFDWixHQUFHLEVBQUU7TUFBQ2EsY0FBYyxFQUFFO0lBQUksQ0FBQyxDQUFDO0lBQ2hGSCxXQUFXLENBQUNJLFlBQVksQ0FBQ25CLFFBQVEsQ0FBQztJQUNsQyxJQUFBb0IsdUJBQVEsRUFBQyxvQkFBb0IsRUFBRTtNQUFDQyxPQUFPLEVBQUUsUUFBUTtNQUFFQyxJQUFJLEVBQUUsSUFBSSxDQUFDekIsS0FBSyxDQUFDMEI7SUFBTSxDQUFDLENBQUM7RUFDOUU7QUFFRjtBQUFDO0FBQUEsZ0JBeERvQmpDLGlDQUFpQyxlQUNqQztFQUNqQlEsVUFBVSxFQUFFMEIsa0JBQVMsQ0FBQ1gsTUFBTSxDQUFDWSxVQUFVO0VBQ3ZDekIsUUFBUSxFQUFFd0Isa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDRCxVQUFVO0VBQ3JDdkIsWUFBWSxFQUFFc0Isa0JBQVMsQ0FBQ0csS0FBSztFQUU3QlgsU0FBUyxFQUFFUSxrQkFBUyxDQUFDSSxNQUFNLENBQUNILFVBQVU7RUFDdENoQixRQUFRLEVBQUVvQiw0QkFBZ0IsQ0FBQ0osVUFBVTtFQUNyQ2QsS0FBSyxFQUFFYSxrQkFBUyxDQUFDRSxNQUFNLENBQUNELFVBQVU7RUFDbENiLElBQUksRUFBRVksa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDRCxVQUFVO0VBQ2pDWixNQUFNLEVBQUVXLGtCQUFTLENBQUNYLE1BQU0sQ0FBQ1ksVUFBVTtFQUNuQ1gsT0FBTyxFQUFFVSxrQkFBUyxDQUFDRSxNQUFNLENBQUNELFVBQVU7RUFDcEN4QixNQUFNLEVBQUV1QixrQkFBUyxDQUFDSSxNQUFNO0VBRXhCO0VBQ0FMLE1BQU0sRUFBRUMsa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDRDtBQUMzQixDQUFDO0FBQUEsZ0JBaEJrQm5DLGlDQUFpQyxrQkFrQjlCO0VBQ3BCWSxZQUFZLEVBQUU7QUFDaEIsQ0FBQyJ9