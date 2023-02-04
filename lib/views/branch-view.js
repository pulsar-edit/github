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
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCcmFuY2hWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJjbGFzc05hbWVzIiwiY3giLCJwcm9wcyIsImN1cnJlbnRCcmFuY2giLCJpc0RldGFjaGVkIiwicmVmUm9vdCIsImdldE5hbWUiLCJCcmFuY2hQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJmdW5jIl0sInNvdXJjZXMiOlsiYnJhbmNoLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7QnJhbmNoUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFuY2hWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlZlJvb3Q6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICByZWZSb290OiAoKSA9PiB7fSxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3goXG4gICAgICAnZ2l0aHViLWJyYW5jaCcsICdpbmxpbmUtYmxvY2snLCB7J2dpdGh1Yi1icmFuY2gtZGV0YWNoZWQnOiB0aGlzLnByb3BzLmN1cnJlbnRCcmFuY2guaXNEZXRhY2hlZCgpfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzfSByZWY9e3RoaXMucHJvcHMucmVmUm9vdH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1naXQtYnJhbmNoXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYnJhbmNoLWxhYmVsXCI+e3RoaXMucHJvcHMuY3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUE2QztBQUFBO0FBQUE7QUFBQTtBQUU5QixNQUFNQSxVQUFVLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBVXREQyxNQUFNLEdBQUc7SUFDUCxNQUFNQyxVQUFVLEdBQUcsSUFBQUMsbUJBQUUsRUFDbkIsZUFBZSxFQUFFLGNBQWMsRUFBRTtNQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxhQUFhLENBQUNDLFVBQVU7SUFBRSxDQUFDLENBQ25HO0lBRUQsT0FDRTtNQUFLLFNBQVMsRUFBRUosVUFBVztNQUFDLEdBQUcsRUFBRSxJQUFJLENBQUNFLEtBQUssQ0FBQ0c7SUFBUSxHQUNsRDtNQUFNLFNBQVMsRUFBQztJQUFzQixFQUFHLEVBQ3pDO01BQU0sU0FBUyxFQUFDO0lBQWMsR0FBRSxJQUFJLENBQUNILEtBQUssQ0FBQ0MsYUFBYSxDQUFDRyxPQUFPLEVBQUUsQ0FBUSxDQUN0RTtFQUVWO0FBQ0Y7QUFBQztBQUFBLGdCQXRCb0JWLFVBQVUsZUFDVjtFQUNqQk8sYUFBYSxFQUFFSSwwQkFBYyxDQUFDQyxVQUFVO0VBQ3hDSCxPQUFPLEVBQUVJLGtCQUFTLENBQUNDO0FBQ3JCLENBQUM7QUFBQSxnQkFKa0JkLFVBQVUsa0JBTVA7RUFDcEJTLE9BQU8sRUFBRSxNQUFNLENBQUM7QUFDbEIsQ0FBQyJ9