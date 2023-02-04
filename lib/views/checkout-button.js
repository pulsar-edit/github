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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGVja291dEJ1dHRvbiIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY2hlY2tvdXRPcCIsInByb3BzIiwiZXh0cmFDbGFzc2VzIiwiY2xhc3NOYW1lcyIsImJ1dHRvblRleHQiLCJidXR0b25UaXRsZSIsImlzRW5hYmxlZCIsImdldE1lc3NhZ2UiLCJyZWFzb24iLCJ3aHkiLCJjaGVja291dFN0YXRlcyIsIkhJRERFTiIsIndoZW4iLCJjdXJyZW50IiwiZGVmYXVsdCIsInB1c2giLCJjbGFzc05hbWVQcmVmaXgiLCJkaXNhYmxlZCIsImJ1c3kiLCJjeCIsInJ1biIsIkVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJhcnJheSJdLCJzb3VyY2VzIjpbImNoZWNrb3V0LWJ1dHRvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7RW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7Y2hlY2tvdXRTdGF0ZXN9IGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGVja291dEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hlY2tvdXRPcDogRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lczogUHJvcFR5cGVzLmFycmF5LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjaGVja291dE9wfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZXh0cmFDbGFzc2VzID0gdGhpcy5wcm9wcy5jbGFzc05hbWVzIHx8IFtdO1xuICAgIGxldCBidXR0b25UZXh0ID0gJ0NoZWNrb3V0JztcbiAgICBsZXQgYnV0dG9uVGl0bGUgPSBudWxsO1xuXG4gICAgaWYgKCFjaGVja291dE9wLmlzRW5hYmxlZCgpKSB7XG4gICAgICBidXR0b25UaXRsZSA9IGNoZWNrb3V0T3AuZ2V0TWVzc2FnZSgpO1xuICAgICAgY29uc3QgcmVhc29uID0gY2hlY2tvdXRPcC53aHkoKTtcbiAgICAgIGlmIChyZWFzb24gPT09IGNoZWNrb3V0U3RhdGVzLkhJRERFTikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgYnV0dG9uVGV4dCA9IHJlYXNvbi53aGVuKHtcbiAgICAgICAgY3VycmVudDogJ0NoZWNrZWQgb3V0JyxcbiAgICAgICAgZGVmYXVsdDogJ0NoZWNrb3V0JyxcbiAgICAgIH0pO1xuXG4gICAgICBleHRyYUNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZVByZWZpeCArIHJlYXNvbi53aGVuKHtcbiAgICAgICAgZGlzYWJsZWQ6ICdkaXNhYmxlZCcsXG4gICAgICAgIGJ1c3k6ICdidXN5JyxcbiAgICAgICAgY3VycmVudDogJ2N1cnJlbnQnLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjeCgnYnRuJywgJ2J0bi1wcmltYXJ5JywgJ2NoZWNrb3V0QnV0dG9uJywgLi4uZXh0cmFDbGFzc2VzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXN9XG4gICAgICAgIGRpc2FibGVkPXshY2hlY2tvdXRPcC5pc0VuYWJsZWQoKX1cbiAgICAgICAgdGl0bGU9e2J1dHRvblRpdGxlfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBjaGVja291dE9wLnJ1bigpfT5cbiAgICAgICAge2J1dHRvblRleHR9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFxRTtBQUFBO0FBQUE7QUFBQTtBQUV0RCxNQUFNQSxjQUFjLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBTzFEQyxNQUFNLEdBQUc7SUFDUCxNQUFNO01BQUNDO0lBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQ0MsS0FBSztJQUMvQixNQUFNQyxZQUFZLEdBQUcsSUFBSSxDQUFDRCxLQUFLLENBQUNFLFVBQVUsSUFBSSxFQUFFO0lBQ2hELElBQUlDLFVBQVUsR0FBRyxVQUFVO0lBQzNCLElBQUlDLFdBQVcsR0FBRyxJQUFJO0lBRXRCLElBQUksQ0FBQ0wsVUFBVSxDQUFDTSxTQUFTLEVBQUUsRUFBRTtNQUMzQkQsV0FBVyxHQUFHTCxVQUFVLENBQUNPLFVBQVUsRUFBRTtNQUNyQyxNQUFNQyxNQUFNLEdBQUdSLFVBQVUsQ0FBQ1MsR0FBRyxFQUFFO01BQy9CLElBQUlELE1BQU0sS0FBS0Usb0NBQWMsQ0FBQ0MsTUFBTSxFQUFFO1FBQ3BDLE9BQU8sSUFBSTtNQUNiO01BRUFQLFVBQVUsR0FBR0ksTUFBTSxDQUFDSSxJQUFJLENBQUM7UUFDdkJDLE9BQU8sRUFBRSxhQUFhO1FBQ3RCQyxPQUFPLEVBQUU7TUFDWCxDQUFDLENBQUM7TUFFRlosWUFBWSxDQUFDYSxJQUFJLENBQUMsSUFBSSxDQUFDZCxLQUFLLENBQUNlLGVBQWUsR0FBR1IsTUFBTSxDQUFDSSxJQUFJLENBQUM7UUFDekRLLFFBQVEsRUFBRSxVQUFVO1FBQ3BCQyxJQUFJLEVBQUUsTUFBTTtRQUNaTCxPQUFPLEVBQUU7TUFDWCxDQUFDLENBQUMsQ0FBQztJQUNMO0lBRUEsTUFBTVYsVUFBVSxHQUFHLElBQUFnQixtQkFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsR0FBR2pCLFlBQVksQ0FBQztJQUM5RSxPQUNFO01BQ0UsU0FBUyxFQUFFQyxVQUFXO01BQ3RCLFFBQVEsRUFBRSxDQUFDSCxVQUFVLENBQUNNLFNBQVMsRUFBRztNQUNsQyxLQUFLLEVBQUVELFdBQVk7TUFDbkIsT0FBTyxFQUFFLE1BQU1MLFVBQVUsQ0FBQ29CLEdBQUc7SUFBRyxHQUMvQmhCLFVBQVUsQ0FDSjtFQUViO0FBRUY7QUFBQztBQUFBLGdCQTVDb0JSLGNBQWMsZUFDZDtFQUNqQkksVUFBVSxFQUFFcUIsdUNBQTJCLENBQUNDLFVBQVU7RUFDbEROLGVBQWUsRUFBRU8sa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDRixVQUFVO0VBQzVDbkIsVUFBVSxFQUFFb0Isa0JBQVMsQ0FBQ0U7QUFDeEIsQ0FBQyJ9