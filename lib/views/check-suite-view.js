"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckSuiteView = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRelay = require("react-relay");
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _checkRunView = _interopRequireDefault(require("./check-run-view"));
var _buildStatus = require("../models/build-status");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareCheckSuiteView extends _react.default.Component {
  render() {
    const {
      icon,
      classSuffix
    } = (0, _buildStatus.buildStatusFromCheckResult)(this.props.checkSuite);
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("li", {
      className: "github-PrStatuses-list-item"
    }, _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, _react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), this.props.checkSuite.app && _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-context"
    }, _react.default.createElement("strong", null, this.props.checkSuite.app.name))), this.props.checkRuns.map(run => _react.default.createElement(_checkRunView.default, {
      key: run.id,
      checkRun: run,
      switchToIssueish: this.props.switchToIssueish
    })));
  }
}
exports.BareCheckSuiteView = BareCheckSuiteView;
_defineProperty(BareCheckSuiteView, "propTypes", {
  // Relay
  checkSuite: _propTypes.default.shape({
    app: _propTypes.default.shape({
      name: _propTypes.default.string.isRequired
    }),
    status: _propTypes.default.oneOf(['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'REQUESTED']).isRequired,
    conclusion: _propTypes.default.oneOf(['ACTION_REQUIRED', 'TIMED_OUT', 'CANCELLED', 'FAILURE', 'SUCCESS', 'NEUTRAL'])
  }).isRequired,
  checkRuns: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  })).isRequired,
  // Actions
  switchToIssueish: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareCheckSuiteView, {
  checkSuite: function () {
    const node = require("./__generated__/checkSuiteView_checkSuite.graphql");
    if (node.hash && node.hash !== "ab1475671a1bc4196d67bfa75ad41446") {
      console.error("The definition of 'checkSuiteView_checkSuite' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/checkSuiteView_checkSuite.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ2hlY2tTdWl0ZVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImljb24iLCJjbGFzc1N1ZmZpeCIsImJ1aWxkU3RhdHVzRnJvbUNoZWNrUmVzdWx0IiwicHJvcHMiLCJjaGVja1N1aXRlIiwiYXBwIiwibmFtZSIsImNoZWNrUnVucyIsIm1hcCIsInJ1biIsImlkIiwic3dpdGNoVG9Jc3N1ZWlzaCIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsInN0YXR1cyIsIm9uZU9mIiwiY29uY2x1c2lvbiIsImFycmF5T2YiLCJmdW5jIiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiXSwic291cmNlcyI6WyJjaGVjay1zdWl0ZS12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IENoZWNrUnVuVmlldyBmcm9tICcuL2NoZWNrLXJ1bi12aWV3JztcbmltcG9ydCB7YnVpbGRTdGF0dXNGcm9tQ2hlY2tSZXN1bHR9IGZyb20gJy4uL21vZGVscy9idWlsZC1zdGF0dXMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNoZWNrU3VpdGVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheVxuICAgIGNoZWNrU3VpdGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBhcHA6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgc3RhdHVzOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgICAnUVVFVUVEJywgJ0lOX1BST0dSRVNTJywgJ0NPTVBMRVRFRCcsICdSRVFVRVNURUQnLFxuICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgIGNvbmNsdXNpb246IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAgICdBQ1RJT05fUkVRVUlSRUQnLCAnVElNRURfT1VUJywgJ0NBTkNFTExFRCcsICdGQUlMVVJFJywgJ1NVQ0NFU1MnLCAnTkVVVFJBTCcsXG4gICAgICBdKSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGNoZWNrUnVuczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe2lkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWR9KSxcbiAgICApLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb25zXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2ljb24sIGNsYXNzU3VmZml4fSA9IGJ1aWxkU3RhdHVzRnJvbUNoZWNrUmVzdWx0KHRoaXMucHJvcHMuY2hlY2tTdWl0ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWljb25cIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249e2ljb259IGNsYXNzTmFtZT17YGdpdGh1Yi1QclN0YXR1c2VzLS0ke2NsYXNzU3VmZml4fWB9IC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoZWNrU3VpdGUuYXBwICYmIChcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1jb250ZXh0XCI+XG4gICAgICAgICAgICAgIDxzdHJvbmc+e3RoaXMucHJvcHMuY2hlY2tTdWl0ZS5hcHAubmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2xpPlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGVja1J1bnMubWFwKHJ1biA9PiAoXG4gICAgICAgICAgPENoZWNrUnVuVmlldyBrZXk9e3J1bi5pZH0gY2hlY2tSdW49e3J1bn0gc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ2hlY2tTdWl0ZVZpZXcsIHtcbiAgY2hlY2tTdWl0ZTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBjaGVja1N1aXRlVmlld19jaGVja1N1aXRlIG9uIENoZWNrU3VpdGUge1xuICAgICAgYXBwIHtcbiAgICAgICAgbmFtZVxuICAgICAgfVxuICAgICAgc3RhdHVzXG4gICAgICBjb25jbHVzaW9uXG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFrRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFM0QsTUFBTUEsa0JBQWtCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBc0J0REMsTUFBTSxHQUFHO0lBQ1AsTUFBTTtNQUFDQyxJQUFJO01BQUVDO0lBQVcsQ0FBQyxHQUFHLElBQUFDLHVDQUEwQixFQUFDLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxVQUFVLENBQUM7SUFFN0UsT0FDRSw2QkFBQyxlQUFRLFFBQ1A7TUFBSSxTQUFTLEVBQUM7SUFBNkIsR0FDekM7TUFBTSxTQUFTLEVBQUM7SUFBa0MsR0FDaEQsNkJBQUMsZ0JBQU87TUFBQyxJQUFJLEVBQUVKLElBQUs7TUFBQyxTQUFTLEVBQUcsc0JBQXFCQyxXQUFZO0lBQUUsRUFBRyxDQUNsRSxFQUNOLElBQUksQ0FBQ0UsS0FBSyxDQUFDQyxVQUFVLENBQUNDLEdBQUcsSUFDeEI7TUFBTSxTQUFTLEVBQUM7SUFBcUMsR0FDbkQsNkNBQVMsSUFBSSxDQUFDRixLQUFLLENBQUNDLFVBQVUsQ0FBQ0MsR0FBRyxDQUFDQyxJQUFJLENBQVUsQ0FFcEQsQ0FDRSxFQUNKLElBQUksQ0FBQ0gsS0FBSyxDQUFDSSxTQUFTLENBQUNDLEdBQUcsQ0FBQ0MsR0FBRyxJQUMzQiw2QkFBQyxxQkFBWTtNQUFDLEdBQUcsRUFBRUEsR0FBRyxDQUFDQyxFQUFHO01BQUMsUUFBUSxFQUFFRCxHQUFJO01BQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDTixLQUFLLENBQUNRO0lBQWlCLEVBQ3pGLENBQUMsQ0FDTztFQUVmO0FBQ0Y7QUFBQztBQUFBLGdCQTNDWWYsa0JBQWtCLGVBQ1Y7RUFDakI7RUFDQVEsVUFBVSxFQUFFUSxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDMUJSLEdBQUcsRUFBRU8sa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQ25CUCxJQUFJLEVBQUVNLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7SUFDekIsQ0FBQyxDQUFDO0lBQ0ZDLE1BQU0sRUFBRUosa0JBQVMsQ0FBQ0ssS0FBSyxDQUFDLENBQ3RCLFFBQVEsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FDbEQsQ0FBQyxDQUFDRixVQUFVO0lBQ2JHLFVBQVUsRUFBRU4sa0JBQVMsQ0FBQ0ssS0FBSyxDQUFDLENBQzFCLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQzdFO0VBQ0gsQ0FBQyxDQUFDLENBQUNGLFVBQVU7RUFDYlIsU0FBUyxFQUFFSyxrQkFBUyxDQUFDTyxPQUFPLENBQzFCUCxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFBQ0gsRUFBRSxFQUFFRSxrQkFBUyxDQUFDRSxNQUFNLENBQUNDO0VBQVUsQ0FBQyxDQUFDLENBQ25ELENBQUNBLFVBQVU7RUFFWjtFQUNBSixnQkFBZ0IsRUFBRUMsa0JBQVMsQ0FBQ1EsSUFBSSxDQUFDTDtBQUNuQyxDQUFDO0FBQUEsZUF5QlksSUFBQU0sbUNBQXVCLEVBQUN6QixrQkFBa0IsRUFBRTtFQUN6RFEsVUFBVTtJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQVNaLENBQUMsQ0FBQztBQUFBIn0=