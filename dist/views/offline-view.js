"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OfflineView extends _react.default.Component {
  componentDidMount() {
    window.addEventListener('online', this.props.retry);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.props.retry);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Offline github-Message"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Message-wrapper"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      className: "github-Offline-logo",
      icon: "alignment-unalign"
    }), /*#__PURE__*/_react.default.createElement("h1", {
      className: "github-Message-title"
    }, "Offline"), /*#__PURE__*/_react.default.createElement("p", {
      className: "github-Message-description"
    }, "You don't seem to be connected to the Internet. When you're back online, we'll try again."), /*#__PURE__*/_react.default.createElement("p", {
      className: "github-Message-action"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "github-Message-button btn",
      onClick: this.props.retry
    }, "Retry"))));
  }

}

exports.default = OfflineView;

_defineProperty(OfflineView, "propTypes", {
  retry: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9vZmZsaW5lLXZpZXcuanMiXSwibmFtZXMiOlsiT2ZmbGluZVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbXBvbmVudERpZE1vdW50Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInByb3BzIiwicmV0cnkiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW5kZXIiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxXQUFOLFNBQTBCQyxlQUFNQyxTQUFoQyxDQUEwQztBQUt2REMsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEJDLElBQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsS0FBTCxDQUFXQyxLQUE3QztBQUNEOztBQUVEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQkosSUFBQUEsTUFBTSxDQUFDSyxtQkFBUCxDQUEyQixRQUEzQixFQUFxQyxLQUFLSCxLQUFMLENBQVdDLEtBQWhEO0FBQ0Q7O0FBRURHLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLFNBQVMsRUFBQyxxQkFBbkI7QUFBeUMsTUFBQSxJQUFJLEVBQUM7QUFBOUMsTUFERixlQUVFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxpQkFGRixlQUdFO0FBQUcsTUFBQSxTQUFTLEVBQUM7QUFBYixtR0FIRixlQU1FO0FBQUcsTUFBQSxTQUFTLEVBQUM7QUFBYixvQkFDRTtBQUFRLE1BQUEsU0FBUyxFQUFDLDJCQUFsQjtBQUE4QyxNQUFBLE9BQU8sRUFBRSxLQUFLSixLQUFMLENBQVdDO0FBQWxFLGVBREYsQ0FORixDQURGLENBREY7QUFjRDs7QUE1QnNEOzs7O2dCQUFwQ1AsVyxlQUNBO0FBQ2pCTyxFQUFBQSxLQUFLLEVBQUVJLG1CQUFVQyxJQUFWLENBQWVDO0FBREwsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPZmZsaW5lVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmV0cnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5wcm9wcy5yZXRyeSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUgZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLU9mZmxpbmUtbG9nb1wiIGljb249XCJhbGlnbm1lbnQtdW5hbGlnblwiIC8+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+T2ZmbGluZTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIFlvdSBkb24ndCBzZWVtIHRvIGJlIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIFdoZW4geW91J3JlIGJhY2sgb25saW5lLCB3ZSdsbCB0cnkgYWdhaW4uXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWFjdGlvblwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5wcm9wcy5yZXRyeX0+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19