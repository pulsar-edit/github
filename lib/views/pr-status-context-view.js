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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdFJlbGF5IiwiX3Byb3BUeXBlcyIsIl9vY3RpY29uIiwiX2J1aWxkU3RhdHVzIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5IiwiciIsInQiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiU3RyaW5nIiwiTnVtYmVyIiwiQmFyZVByU3RhdHVzQ29udGV4dFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNvbnRleHQiLCJkZXNjcmlwdGlvbiIsInN0YXRlIiwidGFyZ2V0VXJsIiwicHJvcHMiLCJpY29uIiwiY2xhc3NTdWZmaXgiLCJidWlsZFN0YXR1c0Zyb21TdGF0dXNDb250ZXh0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImhyZWYiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiX2RlZmF1bHQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIl0sInNvdXJjZXMiOlsicHItc3RhdHVzLWNvbnRleHQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7YnVpbGRTdGF0dXNGcm9tU3RhdHVzQ29udGV4dH0gZnJvbSAnLi4vbW9kZWxzL2J1aWxkLXN0YXR1cyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUHJTdGF0dXNDb250ZXh0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29udGV4dDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbnRleHQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3RhdGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRhcmdldFVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb250ZXh0LCBkZXNjcmlwdGlvbiwgc3RhdGUsIHRhcmdldFVybH0gPSB0aGlzLnByb3BzLmNvbnRleHQ7XG4gICAgY29uc3Qge2ljb24sIGNsYXNzU3VmZml4fSA9IGJ1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHQoe3N0YXRlfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaSBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW1cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWljb25cIj5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSBjbGFzc05hbWU9e2BnaXRodWItUHJTdGF0dXNlcy0tJHtjbGFzc1N1ZmZpeH1gfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1jb250ZXh0XCI+XG4gICAgICAgICAgPHN0cm9uZz57Y29udGV4dH08L3N0cm9uZz4ge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1kZXRhaWxzLWxpbmtcIj5cbiAgICAgICAgICA8YSBocmVmPXt0YXJnZXRVcmx9PkRldGFpbHM8L2E+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlUHJTdGF0dXNDb250ZXh0Vmlldywge1xuICBjb250ZXh0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCBvbiBTdGF0dXNDb250ZXh0IHtcbiAgICAgIGNvbnRleHRcbiAgICAgIGRlc2NyaXB0aW9uXG4gICAgICBzdGF0ZVxuICAgICAgdGFyZ2V0VXJsXG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFdBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFVBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFHLFFBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFlBQUEsR0FBQUosT0FBQTtBQUFvRSxTQUFBRCx1QkFBQU0sQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLEtBQUFFLE9BQUEsRUFBQUYsQ0FBQTtBQUFBLFNBQUFHLGdCQUFBSCxDQUFBLEVBQUFJLENBQUEsRUFBQUMsQ0FBQSxZQUFBRCxDQUFBLEdBQUFFLGNBQUEsQ0FBQUYsQ0FBQSxNQUFBSixDQUFBLEdBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixDQUFBLEVBQUFJLENBQUEsSUFBQUssS0FBQSxFQUFBSixDQUFBLEVBQUFLLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFVBQUFaLENBQUEsQ0FBQUksQ0FBQSxJQUFBQyxDQUFBLEVBQUFMLENBQUE7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