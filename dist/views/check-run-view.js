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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jaGVjay1ydW4tdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlQ2hlY2tSdW5WaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjaGVja1J1biIsInByb3BzIiwiaWNvbiIsImNsYXNzU3VmZml4IiwicGVybWFsaW5rIiwibmFtZSIsInRpdGxlIiwic3VtbWFyeSIsInN3aXRjaFRvSXNzdWVpc2giLCJkZXRhaWxzVXJsIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwic3RhdHVzIiwib25lT2YiLCJjb25jbHVzaW9uIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSxnQkFBTixTQUErQkMsZUFBTUMsU0FBckMsQ0FBK0M7QUFtQnBEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNO0FBQUNDLE1BQUFBO0FBQUQsUUFBYSxLQUFLQyxLQUF4QjtBQUNBLFVBQU07QUFBQ0MsTUFBQUEsSUFBRDtBQUFPQyxNQUFBQTtBQUFQLFFBQXNCLDZDQUEyQkgsUUFBM0IsQ0FBNUI7QUFFQSxXQUNFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFFRSxJQUFmO0FBQXFCLE1BQUEsU0FBUyxFQUFHLHNCQUFxQkMsV0FBWTtBQUFsRSxNQURGLENBREYsRUFJRTtBQUFHLE1BQUEsU0FBUyxFQUFDLGtDQUFiO0FBQWdELE1BQUEsSUFBSSxFQUFFSCxRQUFRLENBQUNJO0FBQS9ELE9BQTJFSixRQUFRLENBQUNLLElBQXBGLENBSkYsRUFLRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDR0wsUUFBUSxDQUFDTSxLQUFULElBQWtCO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBcUROLFFBQVEsQ0FBQ00sS0FBOUQsQ0FEckIsRUFFR04sUUFBUSxDQUFDTyxPQUFULElBQ0MsNkJBQUMsNkJBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBQyxxQ0FEWjtBQUVFLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS04sS0FBTCxDQUFXTyxnQkFGL0I7QUFHRSxNQUFBLFFBQVEsRUFBRVIsUUFBUSxDQUFDTztBQUhyQixNQUhKLENBTEYsRUFlR1AsUUFBUSxDQUFDUyxVQUFULElBQ0M7QUFBRyxNQUFBLFNBQVMsRUFBQywwQ0FBYjtBQUF3RCxNQUFBLElBQUksRUFBRVQsUUFBUSxDQUFDUztBQUF2RSxpQkFoQkosQ0FERjtBQXVCRDs7QUE5Q21EOzs7O2dCQUF6Q2IsZ0IsZUFDUTtBQUNqQjtBQUNBSSxFQUFBQSxRQUFRLEVBQUVVLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3hCTixJQUFBQSxJQUFJLEVBQUVLLG1CQUFVRSxNQUFWLENBQWlCQyxVQURDO0FBRXhCQyxJQUFBQSxNQUFNLEVBQUVKLG1CQUFVSyxLQUFWLENBQWdCLENBQ3RCLFFBRHNCLEVBQ1osYUFEWSxFQUNHLFdBREgsRUFDZ0IsV0FEaEIsQ0FBaEIsRUFFTEYsVUFKcUI7QUFLeEJHLElBQUFBLFVBQVUsRUFBRU4sbUJBQVVLLEtBQVYsQ0FBZ0IsQ0FDMUIsaUJBRDBCLEVBQ1AsV0FETyxFQUNNLFdBRE4sRUFDbUIsU0FEbkIsRUFDOEIsU0FEOUIsRUFDeUMsU0FEekMsQ0FBaEIsQ0FMWTtBQVF4QlQsSUFBQUEsS0FBSyxFQUFFSSxtQkFBVUUsTUFSTztBQVN4QkgsSUFBQUEsVUFBVSxFQUFFQyxtQkFBVUU7QUFURSxHQUFoQixFQVVQQyxVQVpjO0FBY2pCO0FBQ0FMLEVBQUFBLGdCQUFnQixFQUFFRSxtQkFBVU8sSUFBVixDQUFlSjtBQWZoQixDOztlQWdETix5Q0FBd0JqQixnQkFBeEIsRUFBMEM7QUFDdkRJLEVBQUFBLFFBQVE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQrQyxDQUExQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgR2l0aHViRG90Y29tTWFya2Rvd24gZnJvbSAnLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCB7YnVpbGRTdGF0dXNGcm9tQ2hlY2tSZXN1bHR9IGZyb20gJy4uL21vZGVscy9idWlsZC1zdGF0dXMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNoZWNrUnVuVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXlcbiAgICBjaGVja1J1bjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHN0YXR1czogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICAgJ1FVRVVFRCcsICdJTl9QUk9HUkVTUycsICdDT01QTEVURUQnLCAnUkVRVUVTVEVEJyxcbiAgICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgICBjb25jbHVzaW9uOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgICAnQUNUSU9OX1JFUVVJUkVEJywgJ1RJTUVEX09VVCcsICdDQU5DRUxMRUQnLCAnRkFJTFVSRScsICdTVUNDRVNTJywgJ05FVVRSQUwnLFxuICAgICAgXSksXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGRldGFpbHNVcmw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbnNcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjaGVja1J1bn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtpY29uLCBjbGFzc1N1ZmZpeH0gPSBidWlsZFN0YXR1c0Zyb21DaGVja1Jlc3VsdChjaGVja1J1bik7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbSBnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tLWNoZWNrUnVuXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1pY29uXCI+XG4gICAgICAgICAgPE9jdGljb24gaWNvbj17aWNvbn0gY2xhc3NOYW1lPXtgZ2l0aHViLVByU3RhdHVzZXMtLSR7Y2xhc3NTdWZmaXh9YH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tbmFtZVwiIGhyZWY9e2NoZWNrUnVuLnBlcm1hbGlua30+e2NoZWNrUnVuLm5hbWV9PC9hPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1jb250ZXh0XCI+XG4gICAgICAgICAge2NoZWNrUnVuLnRpdGxlICYmIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS10aXRsZVwiPntjaGVja1J1bi50aXRsZX08L3NwYW4+fVxuICAgICAgICAgIHtjaGVja1J1bi5zdW1tYXJ5ICYmIChcbiAgICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tc3VtbWFyeVwiXG4gICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgbWFya2Rvd249e2NoZWNrUnVuLnN1bW1hcnl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7Y2hlY2tSdW4uZGV0YWlsc1VybCAmJiAoXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVByU3RhdHVzZXMtbGlzdC1pdGVtLWRldGFpbHMtbGlua1wiIGhyZWY9e2NoZWNrUnVuLmRldGFpbHNVcmx9PlxuICAgICAgICAgICAgRGV0YWlsc1xuICAgICAgICAgIDwvYT5cbiAgICAgICAgKX1cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ2hlY2tSdW5WaWV3LCB7XG4gIGNoZWNrUnVuOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNoZWNrUnVuVmlld19jaGVja1J1biBvbiBDaGVja1J1biB7XG4gICAgICBuYW1lXG4gICAgICBzdGF0dXNcbiAgICAgIGNvbmNsdXNpb25cbiAgICAgIHRpdGxlXG4gICAgICBzdW1tYXJ5XG4gICAgICBwZXJtYWxpbmtcbiAgICAgIGRldGFpbHNVcmxcbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==