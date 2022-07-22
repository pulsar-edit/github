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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement("li", {
      className: "github-PrStatuses-list-item"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-PrStatuses-list-item-context"
    }, /*#__PURE__*/_react.default.createElement("strong", null, context), " ", description), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-PrStatuses-list-item-details-link"
    }, /*#__PURE__*/_react.default.createElement("a", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1zdGF0dXMtY29udGV4dC12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVQclN0YXR1c0NvbnRleHRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjb250ZXh0IiwiZGVzY3JpcHRpb24iLCJzdGF0ZSIsInRhcmdldFVybCIsInByb3BzIiwiaWNvbiIsImNsYXNzU3VmZml4IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLHVCQUFOLFNBQXNDQyxlQUFNQyxTQUE1QyxDQUFzRDtBQVUzREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTTtBQUFDQyxNQUFBQSxPQUFEO0FBQVVDLE1BQUFBLFdBQVY7QUFBdUJDLE1BQUFBLEtBQXZCO0FBQThCQyxNQUFBQTtBQUE5QixRQUEyQyxLQUFLQyxLQUFMLENBQVdKLE9BQTVEO0FBQ0EsVUFBTTtBQUFDSyxNQUFBQSxJQUFEO0FBQU9DLE1BQUFBO0FBQVAsUUFBc0IsK0NBQTZCO0FBQUNKLE1BQUFBO0FBQUQsS0FBN0IsQ0FBNUI7QUFDQSx3QkFDRTtBQUFJLE1BQUEsU0FBUyxFQUFDO0FBQWQsb0JBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixvQkFDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFFRyxJQUFmO0FBQXFCLE1BQUEsU0FBUyxFQUFHLHNCQUFxQkMsV0FBWTtBQUFsRSxNQURGLENBREYsZUFJRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLG9CQUNFLDZDQUFTTixPQUFULENBREYsT0FDOEJDLFdBRDlCLENBSkYsZUFPRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLG9CQUNFO0FBQUcsTUFBQSxJQUFJLEVBQUVFO0FBQVQsaUJBREYsQ0FQRixDQURGO0FBYUQ7O0FBMUIwRDs7OztnQkFBaERQLHVCLGVBQ1E7QUFDakJJLEVBQUFBLE9BQU8sRUFBRU8sbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDdkJSLElBQUFBLE9BQU8sRUFBRU8sbUJBQVVFLE1BQVYsQ0FBaUJDLFVBREg7QUFFdkJULElBQUFBLFdBQVcsRUFBRU0sbUJBQVVFLE1BRkE7QUFHdkJQLElBQUFBLEtBQUssRUFBRUssbUJBQVVFLE1BQVYsQ0FBaUJDLFVBSEQ7QUFJdkJQLElBQUFBLFNBQVMsRUFBRUksbUJBQVVFO0FBSkUsR0FBaEIsRUFLTkM7QUFOYyxDOztlQTRCTix5Q0FBd0JkLHVCQUF4QixFQUFpRDtBQUM5REksRUFBQUEsT0FBTztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRHVELENBQWpELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7YnVpbGRTdGF0dXNGcm9tU3RhdHVzQ29udGV4dH0gZnJvbSAnLi4vbW9kZWxzL2J1aWxkLXN0YXR1cyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlUHJTdGF0dXNDb250ZXh0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29udGV4dDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbnRleHQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgc3RhdGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHRhcmdldFVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb250ZXh0LCBkZXNjcmlwdGlvbiwgc3RhdGUsIHRhcmdldFVybH0gPSB0aGlzLnByb3BzLmNvbnRleHQ7XG4gICAgY29uc3Qge2ljb24sIGNsYXNzU3VmZml4fSA9IGJ1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHQoe3N0YXRlfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaSBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW1cIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWljb25cIj5cbiAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSBjbGFzc05hbWU9e2BnaXRodWItUHJTdGF0dXNlcy0tJHtjbGFzc1N1ZmZpeH1gfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1jb250ZXh0XCI+XG4gICAgICAgICAgPHN0cm9uZz57Y29udGV4dH08L3N0cm9uZz4ge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1kZXRhaWxzLWxpbmtcIj5cbiAgICAgICAgICA8YSBocmVmPXt0YXJnZXRVcmx9PkRldGFpbHM8L2E+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlUHJTdGF0dXNDb250ZXh0Vmlldywge1xuICBjb250ZXh0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCBvbiBTdGF0dXNDb250ZXh0IHtcbiAgICAgIGNvbnRleHRcbiAgICAgIGRlc2NyaXB0aW9uXG4gICAgICBzdGF0ZVxuICAgICAgdGFyZ2V0VXJsXG4gICAgfVxuICBgLFxufSk7XG4iXX0=