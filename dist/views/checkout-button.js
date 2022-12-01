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
    return _react.default.createElement("button", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jaGVja291dC1idXR0b24uanMiXSwibmFtZXMiOlsiQ2hlY2tvdXRCdXR0b24iLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNoZWNrb3V0T3AiLCJwcm9wcyIsImV4dHJhQ2xhc3NlcyIsImNsYXNzTmFtZXMiLCJidXR0b25UZXh0IiwiYnV0dG9uVGl0bGUiLCJpc0VuYWJsZWQiLCJnZXRNZXNzYWdlIiwicmVhc29uIiwid2h5IiwiY2hlY2tvdXRTdGF0ZXMiLCJISURERU4iLCJ3aGVuIiwiY3VycmVudCIsImRlZmF1bHQiLCJwdXNoIiwiY2xhc3NOYW1lUHJlZml4IiwiZGlzYWJsZWQiLCJidXN5IiwicnVuIiwiRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBTzFEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNO0FBQUNDLE1BQUFBO0FBQUQsUUFBZSxLQUFLQyxLQUExQjtBQUNBLFVBQU1DLFlBQVksR0FBRyxLQUFLRCxLQUFMLENBQVdFLFVBQVgsSUFBeUIsRUFBOUM7QUFDQSxRQUFJQyxVQUFVLEdBQUcsVUFBakI7QUFDQSxRQUFJQyxXQUFXLEdBQUcsSUFBbEI7O0FBRUEsUUFBSSxDQUFDTCxVQUFVLENBQUNNLFNBQVgsRUFBTCxFQUE2QjtBQUMzQkQsTUFBQUEsV0FBVyxHQUFHTCxVQUFVLENBQUNPLFVBQVgsRUFBZDtBQUNBLFlBQU1DLE1BQU0sR0FBR1IsVUFBVSxDQUFDUyxHQUFYLEVBQWY7O0FBQ0EsVUFBSUQsTUFBTSxLQUFLRSxxQ0FBZUMsTUFBOUIsRUFBc0M7QUFDcEMsZUFBTyxJQUFQO0FBQ0Q7O0FBRURQLE1BQUFBLFVBQVUsR0FBR0ksTUFBTSxDQUFDSSxJQUFQLENBQVk7QUFDdkJDLFFBQUFBLE9BQU8sRUFBRSxhQURjO0FBRXZCQyxRQUFBQSxPQUFPLEVBQUU7QUFGYyxPQUFaLENBQWI7QUFLQVosTUFBQUEsWUFBWSxDQUFDYSxJQUFiLENBQWtCLEtBQUtkLEtBQUwsQ0FBV2UsZUFBWCxHQUE2QlIsTUFBTSxDQUFDSSxJQUFQLENBQVk7QUFDekRLLFFBQUFBLFFBQVEsRUFBRSxVQUQrQztBQUV6REMsUUFBQUEsSUFBSSxFQUFFLE1BRm1EO0FBR3pETCxRQUFBQSxPQUFPLEVBQUU7QUFIZ0QsT0FBWixDQUEvQztBQUtEOztBQUVELFVBQU1WLFVBQVUsR0FBRyx5QkFBRyxLQUFILEVBQVUsYUFBVixFQUF5QixnQkFBekIsRUFBMkMsR0FBR0QsWUFBOUMsQ0FBbkI7QUFDQSxXQUNFO0FBQ0UsTUFBQSxTQUFTLEVBQUVDLFVBRGI7QUFFRSxNQUFBLFFBQVEsRUFBRSxDQUFDSCxVQUFVLENBQUNNLFNBQVgsRUFGYjtBQUdFLE1BQUEsS0FBSyxFQUFFRCxXQUhUO0FBSUUsTUFBQSxPQUFPLEVBQUUsTUFBTUwsVUFBVSxDQUFDbUIsR0FBWDtBQUpqQixPQUtHZixVQUxILENBREY7QUFTRDs7QUExQ3lEOzs7O2dCQUF2Q1IsYyxlQUNBO0FBQ2pCSSxFQUFBQSxVQUFVLEVBQUVvQix3Q0FBNEJDLFVBRHZCO0FBRWpCTCxFQUFBQSxlQUFlLEVBQUVNLG1CQUFVQyxNQUFWLENBQWlCRixVQUZqQjtBQUdqQmxCLEVBQUFBLFVBQVUsRUFBRW1CLG1CQUFVRTtBQUhMLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7RW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7Y2hlY2tvdXRTdGF0ZXN9IGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGVja291dEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hlY2tvdXRPcDogRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lczogUHJvcFR5cGVzLmFycmF5LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjaGVja291dE9wfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZXh0cmFDbGFzc2VzID0gdGhpcy5wcm9wcy5jbGFzc05hbWVzIHx8IFtdO1xuICAgIGxldCBidXR0b25UZXh0ID0gJ0NoZWNrb3V0JztcbiAgICBsZXQgYnV0dG9uVGl0bGUgPSBudWxsO1xuXG4gICAgaWYgKCFjaGVja291dE9wLmlzRW5hYmxlZCgpKSB7XG4gICAgICBidXR0b25UaXRsZSA9IGNoZWNrb3V0T3AuZ2V0TWVzc2FnZSgpO1xuICAgICAgY29uc3QgcmVhc29uID0gY2hlY2tvdXRPcC53aHkoKTtcbiAgICAgIGlmIChyZWFzb24gPT09IGNoZWNrb3V0U3RhdGVzLkhJRERFTikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgYnV0dG9uVGV4dCA9IHJlYXNvbi53aGVuKHtcbiAgICAgICAgY3VycmVudDogJ0NoZWNrZWQgb3V0JyxcbiAgICAgICAgZGVmYXVsdDogJ0NoZWNrb3V0JyxcbiAgICAgIH0pO1xuXG4gICAgICBleHRyYUNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZVByZWZpeCArIHJlYXNvbi53aGVuKHtcbiAgICAgICAgZGlzYWJsZWQ6ICdkaXNhYmxlZCcsXG4gICAgICAgIGJ1c3k6ICdidXN5JyxcbiAgICAgICAgY3VycmVudDogJ2N1cnJlbnQnLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjeCgnYnRuJywgJ2J0bi1wcmltYXJ5JywgJ2NoZWNrb3V0QnV0dG9uJywgLi4uZXh0cmFDbGFzc2VzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXN9XG4gICAgICAgIGRpc2FibGVkPXshY2hlY2tvdXRPcC5pc0VuYWJsZWQoKX1cbiAgICAgICAgdGl0bGU9e2J1dHRvblRpdGxlfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBjaGVja291dE9wLnJ1bigpfT5cbiAgICAgICAge2J1dHRvblRleHR9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbn1cbiJdfQ==