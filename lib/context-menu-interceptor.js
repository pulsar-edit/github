"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ContextMenuInterceptor extends _react.default.Component {
  static handle(event) {
    for (const [element, callback] of ContextMenuInterceptor.registration) {
      if (element.contains(event.target)) {
        callback(event);
      }
    }
  }
  static dispose() {
    document.removeEventListener('contextmenu', contextMenuHandler, {
      capture: true
    });
  }
  componentDidMount() {
    // Helpfully, addEventListener dedupes listeners for us.
    document.addEventListener('contextmenu', contextMenuHandler, {
      capture: true
    });
    ContextMenuInterceptor.registration.set(this.element, (...args) => this.props.onWillShowContextMenu(...args));
  }
  render() {
    return _react.default.createElement("div", {
      ref: e => {
        this.element = e;
      }
    }, this.props.children);
  }
  componentWillUnmount() {
    ContextMenuInterceptor.registration.delete(this.element);
  }
}
exports.default = ContextMenuInterceptor;
_defineProperty(ContextMenuInterceptor, "propTypes", {
  onWillShowContextMenu: _propTypes.default.func.isRequired,
  children: _propTypes.default.element.isRequired
});
_defineProperty(ContextMenuInterceptor, "registration", new Map());
function contextMenuHandler(event) {
  ContextMenuInterceptor.handle(event);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb250ZXh0TWVudUludGVyY2VwdG9yIiwiUmVhY3QiLCJDb21wb25lbnQiLCJoYW5kbGUiLCJldmVudCIsImVsZW1lbnQiLCJjYWxsYmFjayIsInJlZ2lzdHJhdGlvbiIsImNvbnRhaW5zIiwidGFyZ2V0IiwiZGlzcG9zZSIsImRvY3VtZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbnRleHRNZW51SGFuZGxlciIsImNhcHR1cmUiLCJjb21wb25lbnREaWRNb3VudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXQiLCJhcmdzIiwicHJvcHMiLCJvbldpbGxTaG93Q29udGV4dE1lbnUiLCJyZW5kZXIiLCJlIiwiY2hpbGRyZW4iLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRlbGV0ZSIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiTWFwIl0sInNvdXJjZXMiOlsiY29udGV4dC1tZW51LWludGVyY2VwdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0TWVudUludGVyY2VwdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvbldpbGxTaG93Q29udGV4dE1lbnU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgcmVnaXN0cmF0aW9uID0gbmV3IE1hcCgpXG5cbiAgc3RhdGljIGhhbmRsZShldmVudCkge1xuICAgIGZvciAoY29uc3QgW2VsZW1lbnQsIGNhbGxiYWNrXSBvZiBDb250ZXh0TWVudUludGVyY2VwdG9yLnJlZ2lzdHJhdGlvbikge1xuICAgICAgaWYgKGVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGRpc3Bvc2UoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBjb250ZXh0TWVudUhhbmRsZXIsIHtjYXB0dXJlOiB0cnVlfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBIZWxwZnVsbHksIGFkZEV2ZW50TGlzdGVuZXIgZGVkdXBlcyBsaXN0ZW5lcnMgZm9yIHVzLlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgY29udGV4dE1lbnVIYW5kbGVyLCB7Y2FwdHVyZTogdHJ1ZX0pO1xuICAgIENvbnRleHRNZW51SW50ZXJjZXB0b3IucmVnaXN0cmF0aW9uLnNldCh0aGlzLmVsZW1lbnQsICguLi5hcmdzKSA9PiB0aGlzLnByb3BzLm9uV2lsbFNob3dDb250ZXh0TWVudSguLi5hcmdzKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXYgcmVmPXtlID0+IHsgdGhpcy5lbGVtZW50ID0gZTsgfX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgQ29udGV4dE1lbnVJbnRlcmNlcHRvci5yZWdpc3RyYXRpb24uZGVsZXRlKHRoaXMuZWxlbWVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29udGV4dE1lbnVIYW5kbGVyKGV2ZW50KSB7XG4gIENvbnRleHRNZW51SW50ZXJjZXB0b3IuaGFuZGxlKGV2ZW50KTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUVwQixNQUFNQSxzQkFBc0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFRbEUsT0FBT0MsTUFBTSxDQUFDQyxLQUFLLEVBQUU7SUFDbkIsS0FBSyxNQUFNLENBQUNDLE9BQU8sRUFBRUMsUUFBUSxDQUFDLElBQUlOLHNCQUFzQixDQUFDTyxZQUFZLEVBQUU7TUFDckUsSUFBSUYsT0FBTyxDQUFDRyxRQUFRLENBQUNKLEtBQUssQ0FBQ0ssTUFBTSxDQUFDLEVBQUU7UUFDbENILFFBQVEsQ0FBQ0YsS0FBSyxDQUFDO01BQ2pCO0lBQ0Y7RUFDRjtFQUVBLE9BQU9NLE9BQU8sR0FBRztJQUNmQyxRQUFRLENBQUNDLG1CQUFtQixDQUFDLGFBQWEsRUFBRUMsa0JBQWtCLEVBQUU7TUFBQ0MsT0FBTyxFQUFFO0lBQUksQ0FBQyxDQUFDO0VBQ2xGO0VBRUFDLGlCQUFpQixHQUFHO0lBQ2xCO0lBQ0FKLFFBQVEsQ0FBQ0ssZ0JBQWdCLENBQUMsYUFBYSxFQUFFSCxrQkFBa0IsRUFBRTtNQUFDQyxPQUFPLEVBQUU7SUFBSSxDQUFDLENBQUM7SUFDN0VkLHNCQUFzQixDQUFDTyxZQUFZLENBQUNVLEdBQUcsQ0FBQyxJQUFJLENBQUNaLE9BQU8sRUFBRSxDQUFDLEdBQUdhLElBQUksS0FBSyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MscUJBQXFCLENBQUMsR0FBR0YsSUFBSSxDQUFDLENBQUM7RUFDL0c7RUFFQUcsTUFBTSxHQUFHO0lBQ1AsT0FBTztNQUFLLEdBQUcsRUFBRUMsQ0FBQyxJQUFJO1FBQUUsSUFBSSxDQUFDakIsT0FBTyxHQUFHaUIsQ0FBQztNQUFFO0lBQUUsR0FBRSxJQUFJLENBQUNILEtBQUssQ0FBQ0ksUUFBUSxDQUFPO0VBQzFFO0VBRUFDLG9CQUFvQixHQUFHO0lBQ3JCeEIsc0JBQXNCLENBQUNPLFlBQVksQ0FBQ2tCLE1BQU0sQ0FBQyxJQUFJLENBQUNwQixPQUFPLENBQUM7RUFDMUQ7QUFDRjtBQUFDO0FBQUEsZ0JBakNvQkwsc0JBQXNCLGVBQ3RCO0VBQ2pCb0IscUJBQXFCLEVBQUVNLGtCQUFTLENBQUNDLElBQUksQ0FBQ0MsVUFBVTtFQUNoREwsUUFBUSxFQUFFRyxrQkFBUyxDQUFDckIsT0FBTyxDQUFDdUI7QUFDOUIsQ0FBQztBQUFBLGdCQUprQjVCLHNCQUFzQixrQkFNbkIsSUFBSTZCLEdBQUcsRUFBRTtBQTZCakMsU0FBU2hCLGtCQUFrQixDQUFDVCxLQUFLLEVBQUU7RUFDakNKLHNCQUFzQixDQUFDRyxNQUFNLENBQUNDLEtBQUssQ0FBQztBQUN0QyJ9