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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlcyIsIl9vY3RpY29uIiwiX2J1aWxkU3RhdHVzIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiQmFyZVByU3RhdHVzQ29udGV4dFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNvbnRleHQiLCJkZXNjcmlwdGlvbiIsInN0YXRlIiwidGFyZ2V0VXJsIiwicHJvcHMiLCJpY29uIiwiY2xhc3NTdWZmaXgiLCJidWlsZFN0YXR1c0Zyb21TdGF0dXNDb250ZXh0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImhyZWYiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiX2RlZmF1bHQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIl0sInNvdXJjZXMiOlsicHItc3RhdHVzLWNvbnRleHQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7YnVpbGRTdGF0dXNGcm9tU3RhdHVzQ29udGV4dH0gZnJvbSAnLi4vbW9kZWxzL2J1aWxkLXN0YXR1cyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUHJTdGF0dXNDb250ZXh0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29udGV4dDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbnRleHQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3RhdGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRhcmdldFVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb250ZXh0LCBkZXNjcmlwdGlvbiwgc3RhdGUsIHRhcmdldFVybH0gPSB0aGlzLnByb3BzLmNvbnRleHQ7XG4gICAgY29uc3Qge2ljb24sIGNsYXNzU3VmZml4fSA9IGJ1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHQoe3N0YXRlfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaSBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW1cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWljb25cIj5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSBjbGFzc05hbWU9e2BnaXRodWItUHJTdGF0dXNlcy0tJHtjbGFzc1N1ZmZpeH1gfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1jb250ZXh0XCI+XG4gICAgICAgICAgPHN0cm9uZz57Y29udGV4dH08L3N0cm9uZz4ge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1kZXRhaWxzLWxpbmtcIj5cbiAgICAgICAgICA8YSBocmVmPXt0YXJnZXRVcmx9PkRldGFpbHM8L2E+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlUHJTdGF0dXNDb250ZXh0Vmlldywge1xuICBjb250ZXh0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCBvbiBTdGF0dXNDb250ZXh0IHtcbiAgICAgIGNvbnRleHRcbiAgICAgIGRlc2NyaXB0aW9uXG4gICAgICBzdGF0ZVxuICAgICAgdGFyZ2V0VXJsXG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFdBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFVBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFHLFFBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFlBQUEsR0FBQUosT0FBQTtBQUFvRSxTQUFBRCx1QkFBQU0sR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFHLGdCQUFBSCxHQUFBLEVBQUFJLEdBQUEsRUFBQUMsS0FBQSxJQUFBRCxHQUFBLEdBQUFFLGNBQUEsQ0FBQUYsR0FBQSxPQUFBQSxHQUFBLElBQUFKLEdBQUEsSUFBQU8sTUFBQSxDQUFBQyxjQUFBLENBQUFSLEdBQUEsRUFBQUksR0FBQSxJQUFBQyxLQUFBLEVBQUFBLEtBQUEsRUFBQUksVUFBQSxRQUFBQyxZQUFBLFFB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