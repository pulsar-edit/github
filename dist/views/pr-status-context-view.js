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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1zdGF0dXMtY29udGV4dC12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVQclN0YXR1c0NvbnRleHRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjb250ZXh0IiwiZGVzY3JpcHRpb24iLCJzdGF0ZSIsInRhcmdldFVybCIsInByb3BzIiwiaWNvbiIsImNsYXNzU3VmZml4IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLHVCQUFOLFNBQXNDQyxlQUFNQyxTQUE1QyxDQUFzRDtBQVUzREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTTtBQUFDQyxNQUFBQSxPQUFEO0FBQVVDLE1BQUFBLFdBQVY7QUFBdUJDLE1BQUFBLEtBQXZCO0FBQThCQyxNQUFBQTtBQUE5QixRQUEyQyxLQUFLQyxLQUFMLENBQVdKLE9BQTVEO0FBQ0EsVUFBTTtBQUFDSyxNQUFBQSxJQUFEO0FBQU9DLE1BQUFBO0FBQVAsUUFBc0IsK0NBQTZCO0FBQUNKLE1BQUFBO0FBQUQsS0FBN0IsQ0FBNUI7QUFDQSxXQUNFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFFRyxJQUFmO0FBQXFCLE1BQUEsU0FBUyxFQUFHLHNCQUFxQkMsV0FBWTtBQUFsRSxNQURGLENBREYsRUFJRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLE9BQ0UsNkNBQVNOLE9BQVQsQ0FERixPQUM4QkMsV0FEOUIsQ0FKRixFQU9FO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FDRTtBQUFHLE1BQUEsSUFBSSxFQUFFRTtBQUFULGlCQURGLENBUEYsQ0FERjtBQWFEOztBQTFCMEQ7Ozs7Z0JBQWhEUCx1QixlQUNRO0FBQ2pCSSxFQUFBQSxPQUFPLEVBQUVPLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3ZCUixJQUFBQSxPQUFPLEVBQUVPLG1CQUFVRSxNQUFWLENBQWlCQyxVQURIO0FBRXZCVCxJQUFBQSxXQUFXLEVBQUVNLG1CQUFVRSxNQUZBO0FBR3ZCUCxJQUFBQSxLQUFLLEVBQUVLLG1CQUFVRSxNQUFWLENBQWlCQyxVQUhEO0FBSXZCUCxJQUFBQSxTQUFTLEVBQUVJLG1CQUFVRTtBQUpFLEdBQWhCLEVBS05DO0FBTmMsQzs7ZUE0Qk4seUNBQXdCZCx1QkFBeEIsRUFBaUQ7QUFDOURJLEVBQUFBLE9BQU87QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUR1RCxDQUFqRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge2J1aWxkU3RhdHVzRnJvbVN0YXR1c0NvbnRleHR9IGZyb20gJy4uL21vZGVscy9idWlsZC1zdGF0dXMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZVByU3RhdHVzQ29udGV4dFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbnRleHQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjb250ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHN0YXRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0YXJnZXRVcmw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y29udGV4dCwgZGVzY3JpcHRpb24sIHN0YXRlLCB0YXJnZXRVcmx9ID0gdGhpcy5wcm9wcy5jb250ZXh0O1xuICAgIGNvbnN0IHtpY29uLCBjbGFzc1N1ZmZpeH0gPSBidWlsZFN0YXR1c0Zyb21TdGF0dXNDb250ZXh0KHtzdGF0ZX0pO1xuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1pY29uXCI+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj17aWNvbn0gY2xhc3NOYW1lPXtgZ2l0aHViLVByU3RhdHVzZXMtLSR7Y2xhc3NTdWZmaXh9YH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tY29udGV4dFwiPlxuICAgICAgICAgIDxzdHJvbmc+e2NvbnRleHR9PC9zdHJvbmc+IHtkZXNjcmlwdGlvbn1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tZGV0YWlscy1saW5rXCI+XG4gICAgICAgICAgPGEgaHJlZj17dGFyZ2V0VXJsfT5EZXRhaWxzPC9hPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZVByU3RhdHVzQ29udGV4dFZpZXcsIHtcbiAgY29udGV4dDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQgb24gU3RhdHVzQ29udGV4dCB7XG4gICAgICBjb250ZXh0XG4gICAgICBkZXNjcmlwdGlvblxuICAgICAgc3RhdGVcbiAgICAgIHRhcmdldFVybFxuICAgIH1cbiAgYCxcbn0pO1xuIl19