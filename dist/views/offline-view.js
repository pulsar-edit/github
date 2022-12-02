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
    return _react.default.createElement("div", {
      className: "github-Offline github-Message"
    }, _react.default.createElement("div", {
      className: "github-Message-wrapper"
    }, _react.default.createElement(_octicon.default, {
      className: "github-Offline-logo",
      icon: "alignment-unalign"
    }), _react.default.createElement("h1", {
      className: "github-Message-title"
    }, "Offline"), _react.default.createElement("p", {
      className: "github-Message-description"
    }, "You don't seem to be connected to the Internet. When you're back online, we'll try again."), _react.default.createElement("p", {
      className: "github-Message-action"
    }, _react.default.createElement("button", {
      className: "github-Message-button btn",
      onClick: this.props.retry
    }, "Retry"))));
  }

}

exports.default = OfflineView;

_defineProperty(OfflineView, "propTypes", {
  retry: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9vZmZsaW5lLXZpZXcuanMiXSwibmFtZXMiOlsiT2ZmbGluZVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbXBvbmVudERpZE1vdW50Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInByb3BzIiwicmV0cnkiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW5kZXIiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxXQUFOLFNBQTBCQyxlQUFNQyxTQUFoQyxDQUEwQztBQUt2REMsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEJDLElBQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0MsS0FBTCxDQUFXQyxLQUE3QztBQUNEOztBQUVEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQkosSUFBQUEsTUFBTSxDQUFDSyxtQkFBUCxDQUEyQixRQUEzQixFQUFxQyxLQUFLSCxLQUFMLENBQVdDLEtBQWhEO0FBQ0Q7O0FBRURHLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLFNBQVMsRUFBQyxxQkFBbkI7QUFBeUMsTUFBQSxJQUFJLEVBQUM7QUFBOUMsTUFERixFQUVFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxpQkFGRixFQUdFO0FBQUcsTUFBQSxTQUFTLEVBQUM7QUFBYixtR0FIRixFQU1FO0FBQUcsTUFBQSxTQUFTLEVBQUM7QUFBYixPQUNFO0FBQVEsTUFBQSxTQUFTLEVBQUMsMkJBQWxCO0FBQThDLE1BQUEsT0FBTyxFQUFFLEtBQUtKLEtBQUwsQ0FBV0M7QUFBbEUsZUFERixDQU5GLENBREYsQ0FERjtBQWNEOztBQTVCc0Q7Ozs7Z0JBQXBDUCxXLGVBQ0E7QUFDakJPLEVBQUFBLEtBQUssRUFBRUksbUJBQVVDLElBQVYsQ0FBZUM7QUFETCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9mZmxpbmVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXRyeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB0aGlzLnByb3BzLnJldHJ5KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB0aGlzLnByb3BzLnJldHJ5KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItT2ZmbGluZSBnaXRodWItTWVzc2FnZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXdyYXBwZXJcIj5cbiAgICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJnaXRodWItT2ZmbGluZS1sb2dvXCIgaWNvbj1cImFsaWdubWVudC11bmFsaWduXCIgLz5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtdGl0bGVcIj5PZmZsaW5lPC9oMT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgWW91IGRvbid0IHNlZW0gdG8gYmUgY29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldC4gV2hlbiB5b3UncmUgYmFjayBvbmxpbmUsIHdlJ2xsIHRyeSBhZ2Fpbi5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYWN0aW9uXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWJ1dHRvbiBidG5cIiBvbkNsaWNrPXt0aGlzLnByb3BzLnJldHJ5fT5SZXRyeTwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXX0=