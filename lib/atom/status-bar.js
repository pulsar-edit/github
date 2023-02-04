"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class StatusBar extends _react.default.Component {
  constructor(props) {
    super(props);
    this.domNode = document.createElement('div');
    this.domNode.classList.add('react-atom-status-bar');
    if (props.className) {
      this.domNode.classList.add(props.className);
    }
    this.tile = null;
  }
  componentDidMount() {
    this.consumeStatusBar();
  }
  render() {
    return _reactDom.default.createPortal(this.props.children, this.domNode);
  }
  consumeStatusBar() {
    if (this.tile) {
      return;
    }
    if (!this.props.statusBar) {
      return;
    }
    this.tile = this.props.statusBar.addRightTile({
      item: this.domNode,
      priority: -50
    });
    this.props.onConsumeStatusBar(this.props.statusBar);
  }
  componentWillUnmount() {
    this.tile && this.tile.destroy();
  }
}
exports.default = StatusBar;
_defineProperty(StatusBar, "propTypes", {
  children: _propTypes.default.element.isRequired,
  statusBar: _propTypes.default.object,
  onConsumeStatusBar: _propTypes.default.func,
  className: _propTypes.default.string
});
_defineProperty(StatusBar, "defaultProps", {
  onConsumeStatusBar: statusBar => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdGF0dXNCYXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJkb21Ob2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiY2xhc3NOYW1lIiwidGlsZSIsImNvbXBvbmVudERpZE1vdW50IiwiY29uc3VtZVN0YXR1c0JhciIsInJlbmRlciIsIlJlYWN0RE9NIiwiY3JlYXRlUG9ydGFsIiwiY2hpbGRyZW4iLCJzdGF0dXNCYXIiLCJhZGRSaWdodFRpbGUiLCJpdGVtIiwicHJpb3JpdHkiLCJvbkNvbnN1bWVTdGF0dXNCYXIiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRlc3Ryb3kiLCJQcm9wVHlwZXMiLCJlbGVtZW50IiwiaXNSZXF1aXJlZCIsIm9iamVjdCIsImZ1bmMiLCJzdHJpbmciXSwic291cmNlcyI6WyJzdGF0dXMtYmFyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0JhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gICAgc3RhdHVzQmFyOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uQ29uc3VtZVN0YXR1c0JhcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbkNvbnN1bWVTdGF0dXNCYXI6IHN0YXR1c0JhciA9PiB7fSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5kb21Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5kb21Ob2RlLmNsYXNzTGlzdC5hZGQoJ3JlYWN0LWF0b20tc3RhdHVzLWJhcicpO1xuICAgIGlmIChwcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgIHRoaXMuZG9tTm9kZS5jbGFzc0xpc3QuYWRkKHByb3BzLmNsYXNzTmFtZSk7XG4gICAgfVxuICAgIHRoaXMudGlsZSA9IG51bGw7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmNvbnN1bWVTdGF0dXNCYXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKFxuICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbixcbiAgICAgIHRoaXMuZG9tTm9kZSxcbiAgICApO1xuICB9XG5cbiAgY29uc3VtZVN0YXR1c0JhcigpIHtcbiAgICBpZiAodGhpcy50aWxlKSB7IHJldHVybjsgfVxuICAgIGlmICghdGhpcy5wcm9wcy5zdGF0dXNCYXIpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnRpbGUgPSB0aGlzLnByb3BzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe2l0ZW06IHRoaXMuZG9tTm9kZSwgcHJpb3JpdHk6IC01MH0pO1xuICAgIHRoaXMucHJvcHMub25Db25zdW1lU3RhdHVzQmFyKHRoaXMucHJvcHMuc3RhdHVzQmFyKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMudGlsZSAmJiB0aGlzLnRpbGUuZGVzdHJveSgpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUVwQixNQUFNQSxTQUFTLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBWXJEQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUVaLElBQUksQ0FBQ0MsT0FBTyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDNUMsSUFBSSxDQUFDRixPQUFPLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLHVCQUF1QixDQUFDO0lBQ25ELElBQUlMLEtBQUssQ0FBQ00sU0FBUyxFQUFFO01BQ25CLElBQUksQ0FBQ0wsT0FBTyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQ0wsS0FBSyxDQUFDTSxTQUFTLENBQUM7SUFDN0M7SUFDQSxJQUFJLENBQUNDLElBQUksR0FBRyxJQUFJO0VBQ2xCO0VBRUFDLGlCQUFpQixHQUFHO0lBQ2xCLElBQUksQ0FBQ0MsZ0JBQWdCLEVBQUU7RUFDekI7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FBT0MsaUJBQVEsQ0FBQ0MsWUFBWSxDQUMxQixJQUFJLENBQUNaLEtBQUssQ0FBQ2EsUUFBUSxFQUNuQixJQUFJLENBQUNaLE9BQU8sQ0FDYjtFQUNIO0VBRUFRLGdCQUFnQixHQUFHO0lBQ2pCLElBQUksSUFBSSxDQUFDRixJQUFJLEVBQUU7TUFBRTtJQUFRO0lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUNQLEtBQUssQ0FBQ2MsU0FBUyxFQUFFO01BQUU7SUFBUTtJQUVyQyxJQUFJLENBQUNQLElBQUksR0FBRyxJQUFJLENBQUNQLEtBQUssQ0FBQ2MsU0FBUyxDQUFDQyxZQUFZLENBQUM7TUFBQ0MsSUFBSSxFQUFFLElBQUksQ0FBQ2YsT0FBTztNQUFFZ0IsUUFBUSxFQUFFLENBQUM7SUFBRSxDQUFDLENBQUM7SUFDbEYsSUFBSSxDQUFDakIsS0FBSyxDQUFDa0Isa0JBQWtCLENBQUMsSUFBSSxDQUFDbEIsS0FBSyxDQUFDYyxTQUFTLENBQUM7RUFDckQ7RUFFQUssb0JBQW9CLEdBQUc7SUFDckIsSUFBSSxDQUFDWixJQUFJLElBQUksSUFBSSxDQUFDQSxJQUFJLENBQUNhLE9BQU8sRUFBRTtFQUNsQztBQUNGO0FBQUM7QUFBQSxnQkE3Q29CeEIsU0FBUyxlQUNUO0VBQ2pCaUIsUUFBUSxFQUFFUSxrQkFBUyxDQUFDQyxPQUFPLENBQUNDLFVBQVU7RUFDdENULFNBQVMsRUFBRU8sa0JBQVMsQ0FBQ0csTUFBTTtFQUMzQk4sa0JBQWtCLEVBQUVHLGtCQUFTLENBQUNJLElBQUk7RUFDbENuQixTQUFTLEVBQUVlLGtCQUFTLENBQUNLO0FBQ3ZCLENBQUM7QUFBQSxnQkFOa0I5QixTQUFTLGtCQVFOO0VBQ3BCc0Isa0JBQWtCLEVBQUVKLFNBQVMsSUFBSSxDQUFDO0FBQ3BDLENBQUMifQ==