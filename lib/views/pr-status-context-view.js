"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BarePrStatusContextView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _buildStatus = require("../models/build-status");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BarePrStatusContextView extends _react.default.Component {
  render() {
    const {
      context,
      description,
      state,
      targetUrl
    } = this.props.context;
    const {
      icon,
      classSuffix
    } = (0, _buildStatus.buildStatusFromStatusContext)({
      state
    });
    return _react.default.createElement("li", {
      className: "github-PrStatuses-list-item"
    }, _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, _react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-context"
    }, _react.default.createElement("strong", null, context), " ", description), _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-details-link"
    }, _react.default.createElement("a", {
      href: targetUrl
    }, "Details")));
  }
}
exports.BarePrStatusContextView = BarePrStatusContextView;
_defineProperty(BarePrStatusContextView, "propTypes", {
  context: _propTypes.default.shape({
    context: _propTypes.default.string.isRequired,
    description: _propTypes.default.string,
    state: _propTypes.default.string.isRequired,
    targetUrl: _propTypes.default.string
  }).isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BarePrStatusContextView, {
  context: function () {
    const node = require("./__generated__/prStatusContextView_context.graphql");
    if (node.hash && node.hash !== "e729074e494e07b59b4a177416eb7a3c") {
      console.error("The definition of 'prStatusContextView_context' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/prStatusContextView_context.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlUHJTdGF0dXNDb250ZXh0VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY29udGV4dCIsImRlc2NyaXB0aW9uIiwic3RhdGUiLCJ0YXJnZXRVcmwiLCJwcm9wcyIsImljb24iLCJjbGFzc1N1ZmZpeCIsImJ1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciJdLCJzb3VyY2VzIjpbInByLXN0YXR1cy1jb250ZXh0LXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge2J1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHR9IGZyb20gJy4uL21vZGVscy9idWlsZC1zdGF0dXMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZVByU3RhdHVzQ29udGV4dFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbnRleHQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjb250ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0YXRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0YXJnZXRVcmw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y29udGV4dCwgZGVzY3JpcHRpb24sIHN0YXRlLCB0YXJnZXRVcmx9ID0gdGhpcy5wcm9wcy5jb250ZXh0O1xuICAgIGNvbnN0IHtpY29uLCBjbGFzc1N1ZmZpeH0gPSBidWlsZFN0YXR1c0Zyb21TdGF0dXNDb250ZXh0KHtzdGF0ZX0pO1xuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1pY29uXCI+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj17aWNvbn0gY2xhc3NOYW1lPXtgZ2l0aHViLVByU3RhdHVzZXMtLSR7Y2xhc3NTdWZmaXh9YH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tY29udGV4dFwiPlxuICAgICAgICAgIDxzdHJvbmc+e2NvbnRleHR9PC9zdHJvbmc+IHtkZXNjcmlwdGlvbn1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tZGV0YWlscy1saW5rXCI+XG4gICAgICAgICAgPGEgaHJlZj17dGFyZ2V0VXJsfT5EZXRhaWxzPC9hPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZVByU3RhdHVzQ29udGV4dFZpZXcsIHtcbiAgY29udGV4dDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQgb24gU3RhdHVzQ29udGV4dCB7XG4gICAgICBjb250ZXh0XG4gICAgICBkZXNjcmlwdGlvblxuICAgICAgc3RhdGVcbiAgICAgIHRhcmdldFVybFxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQW9FO0FBQUE7QUFBQTtBQUFBO0FBRTdELE1BQU1BLHVCQUF1QixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQVUzREMsTUFBTSxHQUFHO0lBQ1AsTUFBTTtNQUFDQyxPQUFPO01BQUVDLFdBQVc7TUFBRUMsS0FBSztNQUFFQztJQUFTLENBQUMsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0osT0FBTztJQUNuRSxNQUFNO01BQUNLLElBQUk7TUFBRUM7SUFBVyxDQUFDLEdBQUcsSUFBQUMseUNBQTRCLEVBQUM7TUFBQ0w7SUFBSyxDQUFDLENBQUM7SUFDakUsT0FDRTtNQUFJLFNBQVMsRUFBQztJQUE2QixHQUN6QztNQUFNLFNBQVMsRUFBQztJQUFrQyxHQUNoRCw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBRUcsSUFBSztNQUFDLFNBQVMsRUFBRyxzQkFBcUJDLFdBQVk7SUFBRSxFQUFHLENBQ2xFLEVBQ1A7TUFBTSxTQUFTLEVBQUM7SUFBcUMsR0FDbkQsNkNBQVNOLE9BQU8sQ0FBVSxPQUFFQyxXQUFXLENBQ2xDLEVBQ1A7TUFBTSxTQUFTLEVBQUM7SUFBMEMsR0FDeEQ7TUFBRyxJQUFJLEVBQUVFO0lBQVUsYUFBWSxDQUMxQixDQUNKO0VBRVQ7QUFDRjtBQUFDO0FBQUEsZ0JBM0JZUCx1QkFBdUIsZUFDZjtFQUNqQkksT0FBTyxFQUFFUSxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDdkJULE9BQU8sRUFBRVEsa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDQyxVQUFVO0lBQ3BDVixXQUFXLEVBQUVPLGtCQUFTLENBQUNFLE1BQU07SUFDN0JSLEtBQUssRUFBRU0sa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDQyxVQUFVO0lBQ2xDUixTQUFTLEVBQUVLLGtCQUFTLENBQUNFO0VBQ3ZCLENBQUMsQ0FBQyxDQUFDQztBQUNMLENBQUM7QUFBQSxlQXFCWSxJQUFBQyxtQ0FBdUIsRUFBQ2hCLHVCQUF1QixFQUFFO0VBQzlESSxPQUFPO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBUVQsQ0FBQyxDQUFDO0FBQUEifQ==