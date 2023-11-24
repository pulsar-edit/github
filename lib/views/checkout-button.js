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