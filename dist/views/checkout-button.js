"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes2 = require("../prop-types");

var _prCheckoutController = require("../controllers/pr-checkout-controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CheckoutButton extends _react.default.Component {
  render() {
    const {
      checkoutOp
    } = this.props;
    const extraClasses = this.props.classNames || [];
    let buttonText = 'Checkout';
    let buttonTitle = null;

    if (!checkoutOp.isEnabled()) {
      buttonTitle = checkoutOp.getMessage();
      const reason = checkoutOp.why();

      if (reason === _prCheckoutController.checkoutStates.HIDDEN) {
        return null;
      }

      buttonText = reason.when({
        current: 'Checked out',
        default: 'Checkout'
      });
      extraClasses.push(this.props.classNamePrefix + reason.when({
        disabled: 'disabled',
        busy: 'busy',
        current: 'current'
      }));
    }

    const classNames = (0, _classnames.default)('btn', 'btn-primary', 'checkoutButton', ...extraClasses);
    return /*#__PURE__*/_react.default.createElement("button", {
      className: classNames,
      disabled: !checkoutOp.isEnabled(),
      title: buttonTitle,
      onClick: () => checkoutOp.run()
    }, buttonText);
  }

}

exports.default = CheckoutButton;

_defineProperty(CheckoutButton, "propTypes", {
  checkoutOp: _propTypes2.EnableableOperationPropType.isRequired,
  classNamePrefix: _propTypes.default.string.isRequired,
  classNames: _propTypes.default.array
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jaGVja291dC1idXR0b24uanMiXSwibmFtZXMiOlsiQ2hlY2tvdXRCdXR0b24iLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNoZWNrb3V0T3AiLCJwcm9wcyIsImV4dHJhQ2xhc3NlcyIsImNsYXNzTmFtZXMiLCJidXR0b25UZXh0IiwiYnV0dG9uVGl0bGUiLCJpc0VuYWJsZWQiLCJnZXRNZXNzYWdlIiwicmVhc29uIiwid2h5IiwiY2hlY2tvdXRTdGF0ZXMiLCJISURERU4iLCJ3aGVuIiwiY3VycmVudCIsImRlZmF1bHQiLCJwdXNoIiwiY2xhc3NOYW1lUHJlZml4IiwiZGlzYWJsZWQiLCJidXN5IiwicnVuIiwiRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBTzFEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNO0FBQUNDLE1BQUFBO0FBQUQsUUFBZSxLQUFLQyxLQUExQjtBQUNBLFVBQU1DLFlBQVksR0FBRyxLQUFLRCxLQUFMLENBQVdFLFVBQVgsSUFBeUIsRUFBOUM7QUFDQSxRQUFJQyxVQUFVLEdBQUcsVUFBakI7QUFDQSxRQUFJQyxXQUFXLEdBQUcsSUFBbEI7O0FBRUEsUUFBSSxDQUFDTCxVQUFVLENBQUNNLFNBQVgsRUFBTCxFQUE2QjtBQUMzQkQsTUFBQUEsV0FBVyxHQUFHTCxVQUFVLENBQUNPLFVBQVgsRUFBZDtBQUNBLFlBQU1DLE1BQU0sR0FBR1IsVUFBVSxDQUFDUyxHQUFYLEVBQWY7O0FBQ0EsVUFBSUQsTUFBTSxLQUFLRSxxQ0FBZUMsTUFBOUIsRUFBc0M7QUFDcEMsZUFBTyxJQUFQO0FBQ0Q7O0FBRURQLE1BQUFBLFVBQVUsR0FBR0ksTUFBTSxDQUFDSSxJQUFQLENBQVk7QUFDdkJDLFFBQUFBLE9BQU8sRUFBRSxhQURjO0FBRXZCQyxRQUFBQSxPQUFPLEVBQUU7QUFGYyxPQUFaLENBQWI7QUFLQVosTUFBQUEsWUFBWSxDQUFDYSxJQUFiLENBQWtCLEtBQUtkLEtBQUwsQ0FBV2UsZUFBWCxHQUE2QlIsTUFBTSxDQUFDSSxJQUFQLENBQVk7QUFDekRLLFFBQUFBLFFBQVEsRUFBRSxVQUQrQztBQUV6REMsUUFBQUEsSUFBSSxFQUFFLE1BRm1EO0FBR3pETCxRQUFBQSxPQUFPLEVBQUU7QUFIZ0QsT0FBWixDQUEvQztBQUtEOztBQUVELFVBQU1WLFVBQVUsR0FBRyx5QkFBRyxLQUFILEVBQVUsYUFBVixFQUF5QixnQkFBekIsRUFBMkMsR0FBR0QsWUFBOUMsQ0FBbkI7QUFDQSx3QkFDRTtBQUNFLE1BQUEsU0FBUyxFQUFFQyxVQURiO0FBRUUsTUFBQSxRQUFRLEVBQUUsQ0FBQ0gsVUFBVSxDQUFDTSxTQUFYLEVBRmI7QUFHRSxNQUFBLEtBQUssRUFBRUQsV0FIVDtBQUlFLE1BQUEsT0FBTyxFQUFFLE1BQU1MLFVBQVUsQ0FBQ21CLEdBQVg7QUFKakIsT0FLR2YsVUFMSCxDQURGO0FBU0Q7O0FBMUN5RDs7OztnQkFBdkNSLGMsZUFDQTtBQUNqQkksRUFBQUEsVUFBVSxFQUFFb0Isd0NBQTRCQyxVQUR2QjtBQUVqQkwsRUFBQUEsZUFBZSxFQUFFTSxtQkFBVUMsTUFBVixDQUFpQkYsVUFGakI7QUFHakJsQixFQUFBQSxVQUFVLEVBQUVtQixtQkFBVUU7QUFITCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0VuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2NoZWNrb3V0U3RhdGVzfSBmcm9tICcuLi9jb250cm9sbGVycy9wci1jaGVja291dC1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tvdXRCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoZWNrb3V0T3A6IEVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZVByZWZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y2hlY2tvdXRPcH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcHMuY2xhc3NOYW1lcyB8fCBbXTtcbiAgICBsZXQgYnV0dG9uVGV4dCA9ICdDaGVja291dCc7XG4gICAgbGV0IGJ1dHRvblRpdGxlID0gbnVsbDtcblxuICAgIGlmICghY2hlY2tvdXRPcC5pc0VuYWJsZWQoKSkge1xuICAgICAgYnV0dG9uVGl0bGUgPSBjaGVja291dE9wLmdldE1lc3NhZ2UoKTtcbiAgICAgIGNvbnN0IHJlYXNvbiA9IGNoZWNrb3V0T3Aud2h5KCk7XG4gICAgICBpZiAocmVhc29uID09PSBjaGVja291dFN0YXRlcy5ISURERU4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGJ1dHRvblRleHQgPSByZWFzb24ud2hlbih7XG4gICAgICAgIGN1cnJlbnQ6ICdDaGVja2VkIG91dCcsXG4gICAgICAgIGRlZmF1bHQ6ICdDaGVja291dCcsXG4gICAgICB9KTtcblxuICAgICAgZXh0cmFDbGFzc2VzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWVQcmVmaXggKyByZWFzb24ud2hlbih7XG4gICAgICAgIGRpc2FibGVkOiAnZGlzYWJsZWQnLFxuICAgICAgICBidXN5OiAnYnVzeScsXG4gICAgICAgIGN1cnJlbnQ6ICdjdXJyZW50JyxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3goJ2J0bicsICdidG4tcHJpbWFyeScsICdjaGVja291dEJ1dHRvbicsIC4uLmV4dHJhQ2xhc3Nlcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzfVxuICAgICAgICBkaXNhYmxlZD17IWNoZWNrb3V0T3AuaXNFbmFibGVkKCl9XG4gICAgICAgIHRpdGxlPXtidXR0b25UaXRsZX1cbiAgICAgICAgb25DbGljaz17KCkgPT4gY2hlY2tvdXRPcC5ydW4oKX0+XG4gICAgICAgIHtidXR0b25UZXh0fVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG59XG4iXX0=