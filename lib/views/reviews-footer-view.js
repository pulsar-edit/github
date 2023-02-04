"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reporterProxy = require("../reporter-proxy");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ReviewsFooterView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "logStartReviewClick", () => {
      (0, _reporterProxy.addEvent)('start-pr-review', {
        package: 'github',
        component: this.constructor.name
      });
    });
  }
  render() {
    return _react.default.createElement("footer", {
      className: "github-ReviewsFooterView-footer"
    }, _react.default.createElement("span", {
      className: "github-ReviewsFooterView-footerTitle"
    }, "Reviews"), _react.default.createElement("span", {
      className: "github-ReviewsFooterView"
    }, _react.default.createElement("span", {
      className: "github-ReviewsFooterView-commentCount"
    }, "Resolved", ' ', _react.default.createElement("span", {
      className: "github-ReviewsFooterView-commentsResolved"
    }, this.props.commentsResolved), ' ', "of", ' ', _react.default.createElement("span", {
      className: "github-ReviewsFooterView-totalComments"
    }, this.props.totalComments), ' ', "comments"), _react.default.createElement("progress", {
      className: "github-ReviewsFooterView-progessBar",
      value: this.props.commentsResolved,
      max: this.props.totalComments
    }, ' ', "comments", ' ')), _react.default.createElement("button", {
      className: "github-ReviewsFooterView-openReviewsButton btn btn-primary",
      onClick: this.props.openReviews
    }, "See reviews"), _react.default.createElement("a", {
      href: this.props.pullRequestURL,
      className: "github-ReviewsFooterView-reviewChangesButton btn",
      onClick: this.logStartReviewClick
    }, "Start a new review"));
  }
}
exports.default = ReviewsFooterView;
_defineProperty(ReviewsFooterView, "propTypes", {
  commentsResolved: _propTypes.default.number.isRequired,
  totalComments: _propTypes.default.number.isRequired,
  pullRequestURL: _propTypes.default.string.isRequired,
  // Controller actions
  openReviews: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXZpZXdzRm9vdGVyVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJuYW1lIiwicmVuZGVyIiwicHJvcHMiLCJjb21tZW50c1Jlc29sdmVkIiwidG90YWxDb21tZW50cyIsIm9wZW5SZXZpZXdzIiwicHVsbFJlcXVlc3RVUkwiLCJsb2dTdGFydFJldmlld0NsaWNrIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImZ1bmMiXSwic291cmNlcyI6WyJyZXZpZXdzLWZvb3Rlci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJldmlld3NGb290ZXJWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21tZW50c1Jlc29sdmVkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgdG90YWxDb21tZW50czogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0VVJMOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDb250cm9sbGVyIGFjdGlvbnNcbiAgICBvcGVuUmV2aWV3czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBsb2dTdGFydFJldmlld0NsaWNrID0gKCkgPT4ge1xuICAgIGFkZEV2ZW50KCdzdGFydC1wci1yZXZpZXcnLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NGb290ZXJWaWV3LWZvb3RlclwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3c0Zvb3RlclZpZXctZm9vdGVyVGl0bGVcIj5cbiAgICAgICAgICBSZXZpZXdzXG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NGb290ZXJWaWV3XCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NGb290ZXJWaWV3LWNvbW1lbnRDb3VudFwiPlxuICAgICAgICAgIFJlc29sdmVkeycgJ31cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzRm9vdGVyVmlldy1jb21tZW50c1Jlc29sdmVkXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNvbW1lbnRzUmVzb2x2ZWR9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7JyAnfW9meycgJ31cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzRm9vdGVyVmlldy10b3RhbENvbW1lbnRzXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLnRvdGFsQ29tbWVudHN9XG4gICAgICAgICAgICA8L3NwYW4+eycgJ31jb21tZW50c1xuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8cHJvZ3Jlc3MgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NGb290ZXJWaWV3LXByb2dlc3NCYXJcIlxuICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuY29tbWVudHNSZXNvbHZlZH0gbWF4PXt0aGlzLnByb3BzLnRvdGFsQ29tbWVudHN9PlxuICAgICAgICAgICAgeycgJ31jb21tZW50c3snICd9XG4gICAgICAgICAgPC9wcm9ncmVzcz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzRm9vdGVyVmlldy1vcGVuUmV2aWV3c0J1dHRvbiBidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub3BlblJldmlld3N9PlNlZSByZXZpZXdzPC9idXR0b24+XG4gICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMucHVsbFJlcXVlc3RVUkx9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NGb290ZXJWaWV3LXJldmlld0NoYW5nZXNCdXR0b24gYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmxvZ1N0YXJ0UmV2aWV3Q2xpY2t9PlxuICAgICAgICAgICAgU3RhcnQgYSBuZXcgcmV2aWV3XG4gICAgICAgIDwvYT5cbiAgICAgIDwvZm9vdGVyPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQTJDO0FBQUE7QUFBQTtBQUFBO0FBRTVCLE1BQU1BLGlCQUFpQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQUFBO0lBQUE7SUFBQSw2Q0FVdkMsTUFBTTtNQUMxQixJQUFBQyx1QkFBUSxFQUFDLGlCQUFpQixFQUFFO1FBQUNDLE9BQU8sRUFBRSxRQUFRO1FBQUVDLFNBQVMsRUFBRSxJQUFJLENBQUNDLFdBQVcsQ0FBQ0M7TUFBSSxDQUFDLENBQUM7SUFDcEYsQ0FBQztFQUFBO0VBRURDLE1BQU0sR0FBRztJQUNQLE9BQ0U7TUFBUSxTQUFTLEVBQUM7SUFBaUMsR0FDakQ7TUFBTSxTQUFTLEVBQUM7SUFBc0MsYUFFL0MsRUFDUDtNQUFNLFNBQVMsRUFBQztJQUEwQixHQUN4QztNQUFNLFNBQVMsRUFBQztJQUF1QyxlQUM5QyxHQUFHLEVBQ1Y7TUFBTSxTQUFTLEVBQUM7SUFBMkMsR0FDeEQsSUFBSSxDQUFDQyxLQUFLLENBQUNDLGdCQUFnQixDQUN2QixFQUNOLEdBQUcsUUFBSSxHQUFHLEVBQ1g7TUFBTSxTQUFTLEVBQUM7SUFBd0MsR0FDckQsSUFBSSxDQUFDRCxLQUFLLENBQUNFLGFBQWEsQ0FDcEIsRUFBQyxHQUFHLGFBQ04sRUFDUDtNQUFVLFNBQVMsRUFBQyxxQ0FBcUM7TUFDdkQsS0FBSyxFQUFFLElBQUksQ0FBQ0YsS0FBSyxDQUFDQyxnQkFBaUI7TUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDRCxLQUFLLENBQUNFO0lBQWMsR0FDakUsR0FBRyxjQUFVLEdBQUcsQ0FDUixDQUNOLEVBQ1A7TUFBUSxTQUFTLEVBQUMsNERBQTREO01BQzVFLE9BQU8sRUFBRSxJQUFJLENBQUNGLEtBQUssQ0FBQ0c7SUFBWSxpQkFBcUIsRUFDdkQ7TUFBRyxJQUFJLEVBQUUsSUFBSSxDQUFDSCxLQUFLLENBQUNJLGNBQWU7TUFDakMsU0FBUyxFQUFDLGtEQUFrRDtNQUM1RCxPQUFPLEVBQUUsSUFBSSxDQUFDQztJQUFvQix3QkFFaEMsQ0FDRztFQUViO0FBQ0Y7QUFBQztBQUFBLGdCQTlDb0JkLGlCQUFpQixlQUNqQjtFQUNqQlUsZ0JBQWdCLEVBQUVLLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUM3Q04sYUFBYSxFQUFFSSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDMUNKLGNBQWMsRUFBRUUsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDRCxVQUFVO0VBRTNDO0VBQ0FMLFdBQVcsRUFBRUcsa0JBQVMsQ0FBQ0ksSUFBSSxDQUFDRjtBQUM5QixDQUFDIn0=