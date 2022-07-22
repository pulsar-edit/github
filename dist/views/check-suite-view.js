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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCheckSuiteView extends _react.default.Component {
  render() {
    const {
      icon,
      classSuffix
    } = (0, _buildStatus.buildStatusFromCheckResult)(this.props.checkSuite);
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("li", {
      className: "github-PrStatuses-list-item"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), this.props.checkSuite.app && /*#__PURE__*/_react.default.createElement("span", {
      className: "github-PrStatuses-list-item-context"
    }, /*#__PURE__*/_react.default.createElement("strong", null, this.props.checkSuite.app.name))), this.props.checkRuns.map(run => /*#__PURE__*/_react.default.createElement(_checkRunView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jaGVjay1zdWl0ZS12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVDaGVja1N1aXRlVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiaWNvbiIsImNsYXNzU3VmZml4IiwicHJvcHMiLCJjaGVja1N1aXRlIiwiYXBwIiwibmFtZSIsImNoZWNrUnVucyIsIm1hcCIsInJ1biIsImlkIiwic3dpdGNoVG9Jc3N1ZWlzaCIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsInN0YXR1cyIsIm9uZU9mIiwiY29uY2x1c2lvbiIsImFycmF5T2YiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFTyxNQUFNQSxrQkFBTixTQUFpQ0MsZUFBTUMsU0FBdkMsQ0FBaUQ7QUFzQnREQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNO0FBQUNDLE1BQUFBLElBQUQ7QUFBT0MsTUFBQUE7QUFBUCxRQUFzQiw2Q0FBMkIsS0FBS0MsS0FBTCxDQUFXQyxVQUF0QyxDQUE1QjtBQUVBLHdCQUNFLDZCQUFDLGVBQUQscUJBQ0U7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLG9CQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsb0JBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBRUgsSUFBZjtBQUFxQixNQUFBLFNBQVMsRUFBRyxzQkFBcUJDLFdBQVk7QUFBbEUsTUFERixDQURGLEVBSUcsS0FBS0MsS0FBTCxDQUFXQyxVQUFYLENBQXNCQyxHQUF0QixpQkFDQztBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLG9CQUNFLDZDQUFTLEtBQUtGLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQkMsR0FBdEIsQ0FBMEJDLElBQW5DLENBREYsQ0FMSixDQURGLEVBV0csS0FBS0gsS0FBTCxDQUFXSSxTQUFYLENBQXFCQyxHQUFyQixDQUF5QkMsR0FBRyxpQkFDM0IsNkJBQUMscUJBQUQ7QUFBYyxNQUFBLEdBQUcsRUFBRUEsR0FBRyxDQUFDQyxFQUF2QjtBQUEyQixNQUFBLFFBQVEsRUFBRUQsR0FBckM7QUFBMEMsTUFBQSxnQkFBZ0IsRUFBRSxLQUFLTixLQUFMLENBQVdRO0FBQXZFLE1BREQsQ0FYSCxDQURGO0FBaUJEOztBQTFDcUQ7Ozs7Z0JBQTNDZCxrQixlQUNRO0FBQ2pCO0FBQ0FPLEVBQUFBLFVBQVUsRUFBRVEsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDMUJSLElBQUFBLEdBQUcsRUFBRU8sbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDbkJQLE1BQUFBLElBQUksRUFBRU0sbUJBQVVFLE1BQVYsQ0FBaUJDO0FBREosS0FBaEIsQ0FEcUI7QUFJMUJDLElBQUFBLE1BQU0sRUFBRUosbUJBQVVLLEtBQVYsQ0FBZ0IsQ0FDdEIsUUFEc0IsRUFDWixhQURZLEVBQ0csV0FESCxFQUNnQixXQURoQixDQUFoQixFQUVMRixVQU51QjtBQU8xQkcsSUFBQUEsVUFBVSxFQUFFTixtQkFBVUssS0FBVixDQUFnQixDQUMxQixpQkFEMEIsRUFDUCxXQURPLEVBQ00sV0FETixFQUNtQixTQURuQixFQUM4QixTQUQ5QixFQUN5QyxTQUR6QyxDQUFoQjtBQVBjLEdBQWhCLEVBVVRGLFVBWmM7QUFhakJSLEVBQUFBLFNBQVMsRUFBRUssbUJBQVVPLE9BQVYsQ0FDVFAsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFBQ0gsSUFBQUEsRUFBRSxFQUFFRSxtQkFBVUUsTUFBVixDQUFpQkM7QUFBdEIsR0FBaEIsQ0FEUyxFQUVUQSxVQWZlO0FBaUJqQjtBQUNBSixFQUFBQSxnQkFBZ0IsRUFBRUMsbUJBQVVRLElBQVYsQ0FBZUw7QUFsQmhCLEM7O2VBNENOLHlDQUF3QmxCLGtCQUF4QixFQUE0QztBQUN6RE8sRUFBQUEsVUFBVTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRCtDLENBQTVDLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBDaGVja1J1blZpZXcgZnJvbSAnLi9jaGVjay1ydW4tdmlldyc7XG5pbXBvcnQge2J1aWxkU3RhdHVzRnJvbUNoZWNrUmVzdWx0fSBmcm9tICcuLi9tb2RlbHMvYnVpbGQtc3RhdHVzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVDaGVja1N1aXRlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXlcbiAgICBjaGVja1N1aXRlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgYXBwOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICAgIHN0YXR1czogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICAgJ1FVRVVFRCcsICdJTl9QUk9HUkVTUycsICdDT01QTEVURUQnLCAnUkVRVUVTVEVEJyxcbiAgICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgICBjb25jbHVzaW9uOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgICAnQUNUSU9OX1JFUVVJUkVEJywgJ1RJTUVEX09VVCcsICdDQU5DRUxMRUQnLCAnRkFJTFVSRScsICdTVUNDRVNTJywgJ05FVVRSQUwnLFxuICAgICAgXSksXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBjaGVja1J1bnM6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLnNoYXBlKHtpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkfSksXG4gICAgKS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uc1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpY29uLCBjbGFzc1N1ZmZpeH0gPSBidWlsZFN0YXR1c0Zyb21DaGVja1Jlc3VsdCh0aGlzLnByb3BzLmNoZWNrU3VpdGUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QclN0YXR1c2VzLWxpc3QtaXRlbS1pY29uXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSBjbGFzc05hbWU9e2BnaXRodWItUHJTdGF0dXNlcy0tJHtjbGFzc1N1ZmZpeH1gfSAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGVja1N1aXRlLmFwcCAmJiAoXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUHJTdGF0dXNlcy1saXN0LWl0ZW0tY29udGV4dFwiPlxuICAgICAgICAgICAgICA8c3Ryb25nPnt0aGlzLnByb3BzLmNoZWNrU3VpdGUuYXBwLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9saT5cbiAgICAgICAge3RoaXMucHJvcHMuY2hlY2tSdW5zLm1hcChydW4gPT4gKFxuICAgICAgICAgIDxDaGVja1J1blZpZXcga2V5PXtydW4uaWR9IGNoZWNrUnVuPXtydW59IHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH0gLz5cbiAgICAgICAgKSl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUNoZWNrU3VpdGVWaWV3LCB7XG4gIGNoZWNrU3VpdGU6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSBvbiBDaGVja1N1aXRlIHtcbiAgICAgIGFwcCB7XG4gICAgICAgIG5hbWVcbiAgICAgIH1cbiAgICAgIHN0YXR1c1xuICAgICAgY29uY2x1c2lvblxuICAgIH1cbiAgYCxcbn0pO1xuIl19