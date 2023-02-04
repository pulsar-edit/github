"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckRunView = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRelay = require("react-relay");
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _githubDotcomMarkdown = _interopRequireDefault(require("./github-dotcom-markdown"));
var _buildStatus = require("../models/build-status");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareCheckRunView extends _react.default.Component {
  render() {
    const {
      checkRun
    } = this.props;
    const {
      icon,
      classSuffix
    } = (0, _buildStatus.buildStatusFromCheckResult)(checkRun);
    return _react.default.createElement("li", {
      className: "github-PrStatuses-list-item github-PrStatuses-list-item--checkRun"
    }, _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, _react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), _react.default.createElement("a", {
      className: "github-PrStatuses-list-item-name",
      href: checkRun.permalink
    }, checkRun.name), _react.default.createElement("div", {
      className: "github-PrStatuses-list-item-context"
    }, checkRun.title && _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-title"
    }, checkRun.title), checkRun.summary && _react.default.createElement(_githubDotcomMarkdown.default, {
      className: "github-PrStatuses-list-item-summary",
      switchToIssueish: this.props.switchToIssueish,
      markdown: checkRun.summary
    })), checkRun.detailsUrl && _react.default.createElement("a", {
      className: "github-PrStatuses-list-item-details-link",
      href: checkRun.detailsUrl
    }, "Details"));
  }
}
exports.BareCheckRunView = BareCheckRunView;
_defineProperty(BareCheckRunView, "propTypes", {
  // Relay
  checkRun: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    status: _propTypes.default.oneOf(['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'REQUESTED']).isRequired,
    conclusion: _propTypes.default.oneOf(['ACTION_REQUIRED', 'TIMED_OUT', 'CANCELLED', 'FAILURE', 'SUCCESS', 'NEUTRAL']),
    title: _propTypes.default.string,
    detailsUrl: _propTypes.default.string
  }).isRequired,
  // Actions
  switchToIssueish: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareCheckRunView, {
  checkRun: function () {
    const node = require("./__generated__/checkRunView_checkRun.graphql");
    if (node.hash && node.hash !== "7135f882a3513e65b0a52393a0cc8b40") {
      console.error("The definition of 'checkRunView_checkRun' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/checkRunView_checkRun.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ2hlY2tSdW5WaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjaGVja1J1biIsInByb3BzIiwiaWNvbiIsImNsYXNzU3VmZml4IiwiYnVpbGRTdGF0dXNGcm9tQ2hlY2tSZXN1bHQiLCJwZXJtYWxpbmsiLCJuYW1lIiwidGl0bGUiLCJzdW1tYXJ5Iiwic3dpdGNoVG9Jc3N1ZWlzaCIsImRldGFpbHNVcmwiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJzdGF0dXMiLCJvbmVPZiIsImNvbmNsdXNpb24iLCJmdW5jIiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiXSwic291cmNlcyI6WyJjaGVjay1ydW4tdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IHtidWlsZFN0YXR1c0Zyb21DaGVja1Jlc3VsdH0gZnJvbSAnLi4vbW9kZWxzL2J1aWxkLXN0YXR1cyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ2hlY2tSdW5WaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheVxuICAgIGNoZWNrUnVuOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgc3RhdHVzOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgICAnUVVFVUVEJywgJ0lOX1BST0dSRVNTJywgJ0NPTVBMRVRFRCcsICdSRVFVRVNURUQnLFxuICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgIGNvbmNsdXNpb246IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAgICdBQ1RJT05fUkVRVUlSRUQnLCAnVElNRURfT1VUJywgJ0NBTkNFTExFRCcsICdGQUlMVVJFJywgJ1NVQ0NFU1MnLCAnTkVVVFJBTCcsXG4gICAgICBdKSxcbiAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgZGV0YWlsc1VybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uc1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NoZWNrUnVufSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2ljb24sIGNsYXNzU3VmZml4fSA9IGJ1aWxkU3RhdHVzRnJvbUNoZWNrUmVzdWx0KGNoZWNrUnVuKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtIGdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS0tY2hlY2tSdW5cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWljb25cIj5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSBjbGFzc05hbWU9e2BnaXRodWItUHJTdGF0dXNlcy0tJHtjbGFzc1N1ZmZpeH1gfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1uYW1lXCIgaHJlZj17Y2hlY2tSdW4ucGVybWFsaW5rfT57Y2hlY2tSdW4ubmFtZX08L2E+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWNvbnRleHRcIj5cbiAgICAgICAgICB7Y2hlY2tSdW4udGl0bGUgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLXRpdGxlXCI+e2NoZWNrUnVuLnRpdGxlfTwvc3Bhbj59XG4gICAgICAgICAge2NoZWNrUnVuLnN1bW1hcnkgJiYgKFxuICAgICAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1zdW1tYXJ5XCJcbiAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgICAgICBtYXJrZG93bj17Y2hlY2tSdW4uc3VtbWFyeX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtjaGVja1J1bi5kZXRhaWxzVXJsICYmIChcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tZGV0YWlscy1saW5rXCIgaHJlZj17Y2hlY2tSdW4uZGV0YWlsc1VybH0+XG4gICAgICAgICAgICBEZXRhaWxzXG4gICAgICAgICAgPC9hPlxuICAgICAgICApfVxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDaGVja1J1blZpZXcsIHtcbiAgY2hlY2tSdW46IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY2hlY2tSdW5WaWV3X2NoZWNrUnVuIG9uIENoZWNrUnVuIHtcbiAgICAgIG5hbWVcbiAgICAgIHN0YXR1c1xuICAgICAgY29uY2x1c2lvblxuICAgICAgdGl0bGVcbiAgICAgIHN1bW1hcnlcbiAgICAgIHBlcm1hbGlua1xuICAgICAgZGV0YWlsc1VybFxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBa0U7QUFBQTtBQUFBO0FBQUE7QUFFM0QsTUFBTUEsZ0JBQWdCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBbUJwREMsTUFBTSxHQUFHO0lBQ1AsTUFBTTtNQUFDQztJQUFRLENBQUMsR0FBRyxJQUFJLENBQUNDLEtBQUs7SUFDN0IsTUFBTTtNQUFDQyxJQUFJO01BQUVDO0lBQVcsQ0FBQyxHQUFHLElBQUFDLHVDQUEwQixFQUFDSixRQUFRLENBQUM7SUFFaEUsT0FDRTtNQUFJLFNBQVMsRUFBQztJQUFtRSxHQUMvRTtNQUFNLFNBQVMsRUFBQztJQUFrQyxHQUNoRCw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBRUUsSUFBSztNQUFDLFNBQVMsRUFBRyxzQkFBcUJDLFdBQVk7SUFBRSxFQUFHLENBQ2xFLEVBQ1A7TUFBRyxTQUFTLEVBQUMsa0NBQWtDO01BQUMsSUFBSSxFQUFFSCxRQUFRLENBQUNLO0lBQVUsR0FBRUwsUUFBUSxDQUFDTSxJQUFJLENBQUssRUFDN0Y7TUFBSyxTQUFTLEVBQUM7SUFBcUMsR0FDakROLFFBQVEsQ0FBQ08sS0FBSyxJQUFJO01BQU0sU0FBUyxFQUFDO0lBQW1DLEdBQUVQLFFBQVEsQ0FBQ08sS0FBSyxDQUFRLEVBQzdGUCxRQUFRLENBQUNRLE9BQU8sSUFDZiw2QkFBQyw2QkFBb0I7TUFDbkIsU0FBUyxFQUFDLHFDQUFxQztNQUMvQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUNQLEtBQUssQ0FBQ1EsZ0JBQWlCO01BQzlDLFFBQVEsRUFBRVQsUUFBUSxDQUFDUTtJQUFRLEVBRTlCLENBQ0csRUFDTFIsUUFBUSxDQUFDVSxVQUFVLElBQ2xCO01BQUcsU0FBUyxFQUFDLDBDQUEwQztNQUFDLElBQUksRUFBRVYsUUFBUSxDQUFDVTtJQUFXLGFBR25GLENBQ0U7RUFFVDtBQUNGO0FBQUM7QUFBQSxnQkEvQ1lkLGdCQUFnQixlQUNSO0VBQ2pCO0VBQ0FJLFFBQVEsRUFBRVcsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQ3hCTixJQUFJLEVBQUVLLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0MsVUFBVTtJQUNqQ0MsTUFBTSxFQUFFSixrQkFBUyxDQUFDSyxLQUFLLENBQUMsQ0FDdEIsUUFBUSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUNsRCxDQUFDLENBQUNGLFVBQVU7SUFDYkcsVUFBVSxFQUFFTixrQkFBUyxDQUFDSyxLQUFLLENBQUMsQ0FDMUIsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FDN0UsQ0FBQztJQUNGVCxLQUFLLEVBQUVJLGtCQUFTLENBQUNFLE1BQU07SUFDdkJILFVBQVUsRUFBRUMsa0JBQVMsQ0FBQ0U7RUFDeEIsQ0FBQyxDQUFDLENBQUNDLFVBQVU7RUFFYjtFQUNBTCxnQkFBZ0IsRUFBRUUsa0JBQVMsQ0FBQ08sSUFBSSxDQUFDSjtBQUNuQyxDQUFDO0FBQUEsZUFnQ1ksSUFBQUssbUNBQXVCLEVBQUN2QixnQkFBZ0IsRUFBRTtFQUN2REksUUFBUTtJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQVdWLENBQUMsQ0FBQztBQUFBIn0=