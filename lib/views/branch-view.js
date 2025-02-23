"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfY2xhc3NuYW1lcyIsIl9wcm9wVHlwZXMyIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5IiwiciIsInQiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiU3RyaW5nIiwiTnVtYmVyIiwiQnJhbmNoVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY2xhc3NOYW1lcyIsImN4IiwicHJvcHMiLCJjdXJyZW50QnJhbmNoIiwiaXNEZXRhY2hlZCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJyZWYiLCJyZWZSb290IiwiZ2V0TmFtZSIsImV4cG9ydHMiLCJCcmFuY2hQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJmdW5jIl0sInNvdXJjZXMiOlsiYnJhbmNoLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7QnJhbmNoUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFuY2hWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZlJvb3Q6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICByZWZSb290OiAoKSA9PiB7fSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3goXG4gICAgICAnZ2l0aHViLWJyYW5jaCcsICdpbmxpbmUtYmxvY2snLCB7J2dpdGh1Yi1icmFuY2gtZGV0YWNoZWQnOiB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzfSByZWY9e3RoaXMucHJvcHMucmVmUm9vdH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1naXQtYnJhbmNoXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnJhbmNoLWxhYmVsXCI+e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxXQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBRyxXQUFBLEdBQUFILE9BQUE7QUFBNkMsU0FBQUQsdUJBQUFLLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFBQSxTQUFBRyxnQkFBQUgsQ0FBQSxFQUFBSSxDQUFBLEVBQUFDLENBQUEsWUFBQUQsQ0FBQSxHQUFBRSxjQUFBLENBQUFGLENBQUEsTUFBQUosQ0FBQSxHQUFBTyxNQUFBLENBQUFDLGNBQUEsQ0FBQVIsQ0FBQSxFQUFBSSxDQUFBLElBQUFLLEtBQUEsRUFBQUosQ0FBQSxFQUFBSyxVQUFBLE1BQUFDLFlBQUEsTUFBQUMsUUFBQSxVQUFBWixDQUFBLENBQUFJLENBQUEsSUFBQUMsQ0FBQSxFQUFBTCxDQUFBO0FBQUEsU0FBQU0sZUFBQUQsQ0FBQSxRQUFBUSxDQUFBLEdBQUFDLFlBQUEsQ0FBQVQsQ0FBQSx1Q0FBQVEsQ0FBQSxHQUFBQSxDQUFBLEdBQUFBLENBQUE7QUFBQSxTQUFBQyxhQUFBVCxDQUFBLEVBQUFELENBQUEsMkJBQUFDLENBQUEsS0FBQUEsQ0FBQSxTQUFBQSxDQUFBLE1BQUFMLENBQUEsR0FBQUssQ0FBQSxDQUFBVSxNQUFBLENBQUFDLFdBQUEsa0JBQUFoQixDQUFBLFFBQUFhLENBQUEsR0FBQWIsQ0FBQSxDQUFBaUIsSUFBQSxDQUFBWixDQUFBLEVBQUFELENBQUEsdUNBQUFTLENBQUEsU0FBQUEsQ0FBQSxZQUFBSyxTQUFBLHlFQUFBZCxDQUFBLEdBQUFlLE1BQUEsR0FBQUMsTUFBQSxFQUFBZixDQUFBO0FBRTlCLE1BQU1nQixVQUFVLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBVXREQyxNQUFNQSxDQUFBLEVBQUc7SUFDUCxNQUFNQyxVQUFVLEdBQUcsSUFBQUMsbUJBQUUsRUFDbkIsZUFBZSxFQUFFLGNBQWMsRUFBRTtNQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxhQUFhLENBQUNDLFVBQVUsQ0FBQztJQUFDLENBQ25HLENBQUM7SUFFRCxPQUNFbkMsTUFBQSxDQUFBUSxPQUFBLENBQUE0QixhQUFBO01BQUtDLFNBQVMsRUFBRU4sVUFBVztNQUFDTyxHQUFHLEVBQUUsSUFBSSxDQUFDTCxLQUFLLENBQUNNO0lBQVEsR0FDbER2QyxNQUFBLENBQUFRLE9BQUEsQ0FBQTRCLGFBQUE7TUFBTUMsU0FBUyxFQUFDO0lBQXNCLENBQUUsQ0FBQyxFQUN6Q3JDLE1BQUEsQ0FBQVEsT0FBQSxDQUFBNEIsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBYyxHQUFFLElBQUksQ0FBQ0osS0FBSyxDQUFDQyxhQUFhLENBQUNNLE9BQU8sQ0FBQyxDQUFRLENBQ3RFLENBQUM7RUFFVjtBQUNGO0FBQUNDLE9BQUEsQ0FBQWpDLE9BQUEsR0FBQW1CLFVBQUE7QUFBQWxCLGVBQUEsQ0F0Qm9Ca0IsVUFBVSxlQUNWO0VBQ2pCTyxhQUFhLEVBQUVRLDBCQUFjLENBQUNDLFVBQVU7RUFDeENKLE9BQU8sRUFBRUssa0JBQVMsQ0FBQ0M7QUFDckIsQ0FBQztBQUFBcEMsZUFBQSxDQUprQmtCLFVBQVUsa0JBTVA7RUFDcEJZLE9BQU8sRUFBRUEsQ0FBQSxLQUFNLENBQUM7QUFDbEIsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==