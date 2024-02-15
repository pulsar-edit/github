"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class BranchView extends _react.default.Component {
  render() {
    const classNames = (0, _classnames.default)('github-branch', 'inline-block', {
      'github-branch-detached': this.props.currentBranch.isDetached()
    });
    return _react.default.createElement("div", {
      className: classNames,
      ref: this.props.refRoot
    }, _react.default.createElement("span", {
      className: "icon icon-git-branch"
    }), _react.default.createElement("span", {
      className: "branch-label"
    }, this.props.currentBranch.getName()));
  }
}
exports.default = BranchView;
_defineProperty(BranchView, "propTypes", {
  currentBranch: _propTypes2.BranchPropType.isRequired,
  refRoot: _propTypes.default.func
});
_defineProperty(BranchView, "defaultProps", {
  refRoot: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfY2xhc3NuYW1lcyIsIl9wcm9wVHlwZXMyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ0IiwiaSIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsInIiLCJlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiQnJhbmNoVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY2xhc3NOYW1lcyIsImN4IiwicHJvcHMiLCJjdXJyZW50QnJhbmNoIiwiaXNEZXRhY2hlZCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJyZWYiLCJyZWZSb290IiwiZ2V0TmFtZSIsImV4cG9ydHMiLCJCcmFuY2hQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJmdW5jIl0sInNvdXJjZXMiOlsiYnJhbmNoLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7QnJhbmNoUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFuY2hWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZlJvb3Q6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICByZWZSb290OiAoKSA9PiB7fSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3goXG4gICAgICAnZ2l0aHViLWJyYW5jaCcsICdpbmxpbmUtYmxvY2snLCB7J2dpdGh1Yi1icmFuY2gtZGV0YWNoZWQnOiB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzfSByZWY9e3RoaXMucHJvcHMucmVmUm9vdH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1naXQtYnJhbmNoXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnJhbmNoLWxhYmVsXCI+e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxXQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBRyxXQUFBLEdBQUFILE9BQUE7QUFBNkMsU0FBQUQsdUJBQUFLLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxnQkFBQUgsR0FBQSxFQUFBSSxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBSixHQUFBLElBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixHQUFBLEVBQUFJLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFJLFVBQUEsUUFBQUMsWUFBQSxRQUFBQyxRQUFBLG9CQUFBWCxHQUFBLENBQUFJLEdBQUEsSUFBQUMsS0FBQSxXQUFBTCxHQUFBO0FBQUEsU0FBQU0sZUFBQU0sQ0FBQSxRQUFBQyxDQUFBLEdBQUFDLFlBQUEsQ0FBQUYsQ0FBQSx1Q0FBQUMsQ0FBQSxHQUFBQSxDQUFBLEdBQUFFLE1BQUEsQ0FBQUYsQ0FBQTtBQUFBLFNBQUFDLGFBQUFGLENBQUEsRUFBQUksQ0FBQSwyQkFBQUosQ0FBQSxLQUFBQSxDQUFBLFNBQUFBLENBQUEsTUFBQUssQ0FBQSxHQUFBTCxDQUFBLENBQUFNLE1BQUEsQ0FBQUMsV0FBQSxrQkFBQUYsQ0FBQSxRQUFBSixDQUFBLEdBQUFJLENBQUEsQ0FBQUcsSUFBQSxDQUFBUixDQUFBLEVBQUFJLENBQUEsdUNBQUFILENBQUEsU0FBQUEsQ0FBQSxZQUFBUSxTQUFBLHlFQUFBTCxDQUFBLEdBQUFELE1BQUEsR0FBQU8sTUFBQSxFQUFBVixDQUFBO0FBRTlCLE1BQU1XLFVBQVUsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFVdERDLE1BQU1BLENBQUEsRUFBRztJQUNQLE1BQU1DLFVBQVUsR0FBRyxJQUFBQyxtQkFBRSxFQUNuQixlQUFlLEVBQUUsY0FBYyxFQUFFO01BQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDQyxLQUFLLENBQUNDLGFBQWEsQ0FBQ0MsVUFBVSxDQUFDO0lBQUMsQ0FDbkcsQ0FBQztJQUVELE9BQ0VyQyxNQUFBLENBQUFRLE9BQUEsQ0FBQThCLGFBQUE7TUFBS0MsU0FBUyxFQUFFTixVQUFXO01BQUNPLEdBQUcsRUFBRSxJQUFJLENBQUNMLEtBQUssQ0FBQ007SUFBUSxHQUNsRHpDLE1BQUEsQ0FBQVEsT0FBQSxDQUFBOEIsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBc0IsQ0FBRSxDQUFDLEVBQ3pDdkMsTUFBQSxDQUFBUSxPQUFBLENBQUE4QixhQUFBO01BQU1DLFNBQVMsRUFBQztJQUFjLEdBQUUsSUFBSSxDQUFDSixLQUFLLENBQUNDLGFBQWEsQ0FBQ00sT0FBTyxDQUFDLENBQVEsQ0FDdEUsQ0FBQztFQUVWO0FBQ0Y7QUFBQ0MsT0FBQSxDQUFBbkMsT0FBQSxHQUFBcUIsVUFBQTtBQUFBcEIsZUFBQSxDQXRCb0JvQixVQUFVLGVBQ1Y7RUFDakJPLGFBQWEsRUFBRVEsMEJBQWMsQ0FBQ0MsVUFBVTtFQUN4Q0osT0FBTyxFQUFFSyxrQkFBUyxDQUFDQztBQUNyQixDQUFDO0FBQUF0QyxlQUFBLENBSmtCb0IsVUFBVSxrQkFNUDtFQUNwQlksT0FBTyxFQUFFQSxDQUFBLEtBQU0sQ0FBQztBQUNsQixDQUFDIn0=