"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdXRvRm9jdXMiLCJjb25zdHJ1Y3RvciIsIl9kZWZpbmVQcm9wZXJ0eSIsImVsZW1lbnQiLCJmaXJzdFRhcmdldCIsImluZGV4IiwiY2FwdHVyZWQiLCJJbmZpbml0eSIsInRyaWdnZXIiLCJzZXRUaW1lb3V0IiwiZm9jdXMiLCJleHBvcnRzIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbImF1dG9mb2N1cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFdoZW4gdHJpZ2dlcmVkLCBhdXRvbWF0aWNhbGx5IGZvY3VzIHRoZSBmaXJzdCBlbGVtZW50IHJlZiBwYXNzZWQgdG8gdGhpcyBvYmplY3QuXG4gKlxuICogVG8gdW5jb25kaXRpb25hbGx5IGZvY3VzIGEgc2luZ2xlIGVsZW1lbnQ6XG4gKlxuICogYGBgXG4gKiBjbGFzcyBTb21lQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAqICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAqICAgICBzdXBlcihwcm9wcyk7XG4gKiAgICAgdGhpcy5hdXRvZm9jdXMgPSBuZXcgQXV0b2ZvY3VzKCk7XG4gKiAgIH1cbiAqXG4gKiAgIHJlbmRlcigpIHtcbiAqICAgICByZXR1cm4gKFxuICogICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRm9ybVwiPlxuICogICAgICAgICA8aW5wdXQgcmVmPXt0aGlzLmF1dG9mb2N1cy50YXJnZXR9IHR5cGU9XCJ0ZXh0XCIgLz5cbiAqICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz5cbiAqICAgICAgIDwvZGl2PlxuICogICAgICk7XG4gKiAgIH1cbiAqXG4gKiAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICogICAgIHRoaXMuYXV0b2ZvY3VzLnRyaWdnZXIoKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogSWYgbXVsdGlwbGUgZm9ybSBlbGVtZW50cyBhcmUgcHJlc2VudCwgdXNlIGBmaXJzdFRhcmdldGAgdG8gY3JlYXRlIHRoZSByZWYgaW5zdGVhZC4gVGhlIHJlbmRlcmVkIHJlZiB5b3UgYXNzaWduIHRoZVxuICogbG93ZXN0IG51bWVyaWMgaW5kZXggd2lsbCBiZSBmb2N1c2VkIG9uIHRyaWdnZXI6XG4gKlxuICogYGBgXG4gKiBjbGFzcyBTb21lQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAqICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAqICAgICBzdXBlcihwcm9wcyk7XG4gKiAgICAgdGhpcy5hdXRvZm9jdXMgPSBuZXcgQXV0b2ZvY3VzKCk7XG4gKiAgIH1cbiAqXG4gKiAgIHJlbmRlcigpIHtcbiAqICAgICByZXR1cm4gKFxuICogICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRm9ybVwiPlxuICogICAgICAgICB7dGhpcy5wcm9wcy5zb21lUHJvcCAmJiA8aW5wdXQgcmVmPXt0aGlzLmF1dG9mb2N1cy5maXJzdFRhcmdldCgwKX0gLz59XG4gKiAgICAgICAgIDxpbnB1dCByZWY9e3RoaXMuYXV0b2ZvY3VzLmZpcnN0VGFyZ2V0KDEpfSB0eXBlPVwidGV4dFwiIC8+XG4gKiAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIC8+XG4gKiAgICAgICA8L2Rpdj5cbiAqICAgICApO1xuICogICB9XG4gKlxuICogICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAqICAgICB0aGlzLmF1dG9mb2N1cy50cmlnZ2VyKCk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b0ZvY3VzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pbmRleCA9IEluZmluaXR5O1xuICAgIHRoaXMuY2FwdHVyZWQgPSBudWxsO1xuICB9XG5cbiAgdGFyZ2V0ID0gZWxlbWVudCA9PiB0aGlzLmZpcnN0VGFyZ2V0KDApKGVsZW1lbnQpO1xuXG4gIGZpcnN0VGFyZ2V0ID0gaW5kZXggPT4gZWxlbWVudCA9PiB7XG4gICAgaWYgKGluZGV4IDwgdGhpcy5pbmRleCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy5jYXB0dXJlZCA9IGVsZW1lbnQ7XG4gICAgfVxuICB9O1xuXG4gIHRyaWdnZXIoKSB7XG4gICAgaWYgKHRoaXMuY2FwdHVyZWQgIT09IG51bGwpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jYXB0dXJlZC5mb2N1cygpLCAwKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsU0FBUyxDQUFDO0VBQzdCQyxXQUFXQSxDQUFBLEVBQUc7SUFBQUMsZUFBQSxpQkFLTEMsT0FBTyxJQUFJLElBQUksQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDRCxPQUFPLENBQUM7SUFBQUQsZUFBQSxzQkFFbENHLEtBQUssSUFBSUYsT0FBTyxJQUFJO01BQ2hDLElBQUlFLEtBQUssR0FBRyxJQUFJLENBQUNBLEtBQUssRUFBRTtRQUN0QixJQUFJLENBQUNBLEtBQUssR0FBR0EsS0FBSztRQUNsQixJQUFJLENBQUNDLFFBQVEsR0FBR0gsT0FBTztNQUN6QjtJQUNGLENBQUM7SUFYQyxJQUFJLENBQUNFLEtBQUssR0FBR0UsUUFBUTtJQUNyQixJQUFJLENBQUNELFFBQVEsR0FBRyxJQUFJO0VBQ3RCO0VBV0FFLE9BQU9BLENBQUEsRUFBRztJQUNSLElBQUksSUFBSSxDQUFDRixRQUFRLEtBQUssSUFBSSxFQUFFO01BQzFCRyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUNILFFBQVEsQ0FBQ0ksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUM7RUFDRjtBQUNGO0FBQUNDLE9BQUEsQ0FBQUMsT0FBQSxHQUFBWixTQUFBIn0=