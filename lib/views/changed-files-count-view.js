"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _reporterProxy = require("../reporter-proxy");
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ChangedFilesCountView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleClick');
  }
  handleClick() {
    (0, _reporterProxy.addEvent)('click', {
      package: 'github',
      component: 'ChangedFileCountView'
    });
    this.props.didClick();
  }
  render() {
    return _react.default.createElement("button", {
      ref: "changedFiles",
      className: "github-ChangedFilesCount inline-block",
      onClick: this.handleClick
    }, _react.default.createElement(_octicon.default, {
      icon: "git-commit"
    }), `Git (${this.props.changedFilesCount})`, this.props.mergeConflictsPresent && _react.default.createElement(_octicon.default, {
      icon: "alert"
    }));
  }
}
exports.default = ChangedFilesCountView;
_defineProperty(ChangedFilesCountView, "propTypes", {
  changedFilesCount: _propTypes.default.number.isRequired,
  didClick: _propTypes.default.func.isRequired,
  mergeConflictsPresent: _propTypes.default.bool
});
_defineProperty(ChangedFilesCountView, "defaultProps", {
  changedFilesCount: 0,
  mergeConflictsPresent: false,
  didClick: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGFuZ2VkRmlsZXNDb3VudFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJhdXRvYmluZCIsImhhbmRsZUNsaWNrIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiZGlkQ2xpY2siLCJyZW5kZXIiLCJjaGFuZ2VkRmlsZXNDb3VudCIsIm1lcmdlQ29uZmxpY3RzUHJlc2VudCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJmdW5jIiwiYm9vbCJdLCJzb3VyY2VzIjpbImNoYW5nZWQtZmlsZXMtY291bnQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbmdlZEZpbGVzQ291bnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFuZ2VkRmlsZXNDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGRpZENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzUHJlc2VudDogUHJvcFR5cGVzLmJvb2wsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNoYW5nZWRGaWxlc0NvdW50OiAwLFxuICAgIG1lcmdlQ29uZmxpY3RzUHJlc2VudDogZmFsc2UsXG4gICAgZGlkQ2xpY2s6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZUNsaWNrJyk7XG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogJ0NoYW5nZWRGaWxlQ291bnRWaWV3J30pO1xuICAgIHRoaXMucHJvcHMuZGlkQ2xpY2soKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICByZWY9XCJjaGFuZ2VkRmlsZXNcIlxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ2hhbmdlZEZpbGVzQ291bnQgaW5saW5lLWJsb2NrXCJcbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgIDxPY3RpY29uIGljb249XCJnaXQtY29tbWl0XCIgLz5cbiAgICAgICAge2BHaXQgKCR7dGhpcy5wcm9wcy5jaGFuZ2VkRmlsZXNDb3VudH0pYH1cbiAgICAgICAge3RoaXMucHJvcHMubWVyZ2VDb25mbGljdHNQcmVzZW50ICYmIDxPY3RpY29uIGljb249XCJhbGVydFwiIC8+fVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQW9DO0FBQUE7QUFBQTtBQUFBO0FBRXJCLE1BQU1BLHFCQUFxQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWFqRUMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFDWixJQUFBQyxpQkFBUSxFQUFDLElBQUksRUFBRSxhQUFhLENBQUM7RUFDL0I7RUFFQUMsV0FBVyxHQUFHO0lBQ1osSUFBQUMsdUJBQVEsRUFBQyxPQUFPLEVBQUU7TUFBQ0MsT0FBTyxFQUFFLFFBQVE7TUFBRUMsU0FBUyxFQUFFO0lBQXNCLENBQUMsQ0FBQztJQUN6RSxJQUFJLENBQUNMLEtBQUssQ0FBQ00sUUFBUSxFQUFFO0VBQ3ZCO0VBRUFDLE1BQU0sR0FBRztJQUNQLE9BQ0U7TUFDRSxHQUFHLEVBQUMsY0FBYztNQUNsQixTQUFTLEVBQUMsdUNBQXVDO01BQ2pELE9BQU8sRUFBRSxJQUFJLENBQUNMO0lBQVksR0FDMUIsNkJBQUMsZ0JBQU87TUFBQyxJQUFJLEVBQUM7SUFBWSxFQUFHLEVBQzNCLFFBQU8sSUFBSSxDQUFDRixLQUFLLENBQUNRLGlCQUFrQixHQUFFLEVBQ3ZDLElBQUksQ0FBQ1IsS0FBSyxDQUFDUyxxQkFBcUIsSUFBSSw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBQztJQUFPLEVBQUcsQ0FDdEQ7RUFFYjtBQUNGO0FBQUM7QUFBQSxnQkFuQ29CYixxQkFBcUIsZUFDckI7RUFDakJZLGlCQUFpQixFQUFFRSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDOUNOLFFBQVEsRUFBRUksa0JBQVMsQ0FBQ0csSUFBSSxDQUFDRCxVQUFVO0VBQ25DSCxxQkFBcUIsRUFBRUMsa0JBQVMsQ0FBQ0k7QUFDbkMsQ0FBQztBQUFBLGdCQUxrQmxCLHFCQUFxQixrQkFPbEI7RUFDcEJZLGlCQUFpQixFQUFFLENBQUM7RUFDcEJDLHFCQUFxQixFQUFFLEtBQUs7RUFDNUJILFFBQVEsRUFBRSxNQUFNLENBQUM7QUFDbkIsQ0FBQyJ9