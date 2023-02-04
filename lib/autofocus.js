"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * When triggered, automatically focus the first element ref passed to this object.
 *
 * To unconditionally focus a single element:
 *
 * ```
 * class SomeComponent extends React.Component {
 *   constructor(props) {
 *     super(props);
 *     this.autofocus = new Autofocus();
 *   }
 *
 *   render() {
 *     return (
 *       <div className="github-Form">
 *         <input ref={this.autofocus.target} type="text" />
 *         <input type="text" />
 *       </div>
 *     );
 *   }
 *
 *   componentDidMount() {
 *     this.autofocus.trigger();
 *   }
 * }
 * ```
 *
 * If multiple form elements are present, use `firstTarget` to create the ref instead. The rendered ref you assign the
 * lowest numeric index will be focused on trigger:
 *
 * ```
 * class SomeComponent extends React.Component {
 *   constructor(props) {
 *     super(props);
 *     this.autofocus = new Autofocus();
 *   }
 *
 *   render() {
 *     return (
 *       <div className="github-Form">
 *         {this.props.someProp && <input ref={this.autofocus.firstTarget(0)} />}
 *         <input ref={this.autofocus.firstTarget(1)} type="text" />
 *         <input type="text" />
 *       </div>
 *     );
 *   }
 *
 *   componentDidMount() {
 *     this.autofocus.trigger();
 *   }
 * }
 * ```
 *
 */
class AutoFocus {
  constructor() {
    _defineProperty(this, "target", element => this.firstTarget(0)(element));
    _defineProperty(this, "firstTarget", index => element => {
      if (index < this.index) {
        this.index = index;
        this.captured = element;
      }
    });
    this.index = Infinity;
    this.captured = null;
  }
  trigger() {
    if (this.captured !== null) {
      setTimeout(() => this.captured.focus(), 0);
    }
  }
}
exports.default = AutoFocus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdXRvRm9jdXMiLCJjb25zdHJ1Y3RvciIsImVsZW1lbnQiLCJmaXJzdFRhcmdldCIsImluZGV4IiwiY2FwdHVyZWQiLCJJbmZpbml0eSIsInRyaWdnZXIiLCJzZXRUaW1lb3V0IiwiZm9jdXMiXSwic291cmNlcyI6WyJhdXRvZm9jdXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBXaGVuIHRyaWdnZXJlZCwgYXV0b21hdGljYWxseSBmb2N1cyB0aGUgZmlyc3QgZWxlbWVudCByZWYgcGFzc2VkIHRvIHRoaXMgb2JqZWN0LlxuICpcbiAqIFRvIHVuY29uZGl0aW9uYWxseSBmb2N1cyBhIHNpbmdsZSBlbGVtZW50OlxuICpcbiAqIGBgYFxuICogY2xhc3MgU29tZUNvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gKiAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gKiAgICAgc3VwZXIocHJvcHMpO1xuICogICAgIHRoaXMuYXV0b2ZvY3VzID0gbmV3IEF1dG9mb2N1cygpO1xuICogICB9XG4gKlxuICogICByZW5kZXIoKSB7XG4gKiAgICAgcmV0dXJuIChcbiAqICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUZvcm1cIj5cbiAqICAgICAgICAgPGlucHV0IHJlZj17dGhpcy5hdXRvZm9jdXMudGFyZ2V0fSB0eXBlPVwidGV4dFwiIC8+XG4gKiAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIC8+XG4gKiAgICAgICA8L2Rpdj5cbiAqICAgICApO1xuICogICB9XG4gKlxuICogICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAqICAgICB0aGlzLmF1dG9mb2N1cy50cmlnZ2VyKCk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIElmIG11bHRpcGxlIGZvcm0gZWxlbWVudHMgYXJlIHByZXNlbnQsIHVzZSBgZmlyc3RUYXJnZXRgIHRvIGNyZWF0ZSB0aGUgcmVmIGluc3RlYWQuIFRoZSByZW5kZXJlZCByZWYgeW91IGFzc2lnbiB0aGVcbiAqIGxvd2VzdCBudW1lcmljIGluZGV4IHdpbGwgYmUgZm9jdXNlZCBvbiB0cmlnZ2VyOlxuICpcbiAqIGBgYFxuICogY2xhc3MgU29tZUNvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gKiAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gKiAgICAgc3VwZXIocHJvcHMpO1xuICogICAgIHRoaXMuYXV0b2ZvY3VzID0gbmV3IEF1dG9mb2N1cygpO1xuICogICB9XG4gKlxuICogICByZW5kZXIoKSB7XG4gKiAgICAgcmV0dXJuIChcbiAqICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUZvcm1cIj5cbiAqICAgICAgICAge3RoaXMucHJvcHMuc29tZVByb3AgJiYgPGlucHV0IHJlZj17dGhpcy5hdXRvZm9jdXMuZmlyc3RUYXJnZXQoMCl9IC8+fVxuICogICAgICAgICA8aW5wdXQgcmVmPXt0aGlzLmF1dG9mb2N1cy5maXJzdFRhcmdldCgxKX0gdHlwZT1cInRleHRcIiAvPlxuICogICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAvPlxuICogICAgICAgPC9kaXY+XG4gKiAgICAgKTtcbiAqICAgfVxuICpcbiAqICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gKiAgICAgdGhpcy5hdXRvZm9jdXMudHJpZ2dlcigpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9Gb2N1cyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5kZXggPSBJbmZpbml0eTtcbiAgICB0aGlzLmNhcHR1cmVkID0gbnVsbDtcbiAgfVxuXG4gIHRhcmdldCA9IGVsZW1lbnQgPT4gdGhpcy5maXJzdFRhcmdldCgwKShlbGVtZW50KTtcblxuICBmaXJzdFRhcmdldCA9IGluZGV4ID0+IGVsZW1lbnQgPT4ge1xuICAgIGlmIChpbmRleCA8IHRoaXMuaW5kZXgpIHtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuY2FwdHVyZWQgPSBlbGVtZW50O1xuICAgIH1cbiAgfTtcblxuICB0cmlnZ2VyKCkge1xuICAgIGlmICh0aGlzLmNhcHR1cmVkICE9PSBudWxsKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY2FwdHVyZWQuZm9jdXMoKSwgMCk7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLFNBQVMsQ0FBQztFQUM3QkMsV0FBVyxHQUFHO0lBQUEsZ0NBS0xDLE9BQU8sSUFBSSxJQUFJLENBQUNDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsT0FBTyxDQUFDO0lBQUEscUNBRWxDRSxLQUFLLElBQUlGLE9BQU8sSUFBSTtNQUNoQyxJQUFJRSxLQUFLLEdBQUcsSUFBSSxDQUFDQSxLQUFLLEVBQUU7UUFDdEIsSUFBSSxDQUFDQSxLQUFLLEdBQUdBLEtBQUs7UUFDbEIsSUFBSSxDQUFDQyxRQUFRLEdBQUdILE9BQU87TUFDekI7SUFDRixDQUFDO0lBWEMsSUFBSSxDQUFDRSxLQUFLLEdBQUdFLFFBQVE7SUFDckIsSUFBSSxDQUFDRCxRQUFRLEdBQUcsSUFBSTtFQUN0QjtFQVdBRSxPQUFPLEdBQUc7SUFDUixJQUFJLElBQUksQ0FBQ0YsUUFBUSxLQUFLLElBQUksRUFBRTtNQUMxQkcsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDSCxRQUFRLENBQUNJLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1QztFQUNGO0FBQ0Y7QUFBQyJ9