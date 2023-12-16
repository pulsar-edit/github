"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventKit = require("event-kit");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Allow child components to operate on refs captured by a parent component.
 *
 * React does not guarantee that refs are available until the component has finished mounting (before
 * componentDidMount() is called), but a component does not finish mounting until all of its children are mounted. This
 * causes problems when a child needs to consume a DOM node from its parent to interact with the Atom API, like we do in
 * the `Tooltip` and `Commands` components.
 *
 * To pass a ref to a child, capture it in a RefHolder in the parent, and pass the RefHolder to the child:
 *
 *   class Parent extends React.Component {
 *     constructor() {
 *       this.theRef = new RefHolder();
 *     }
 *
 *     render() {
 *       return (
 *         <div ref={this.theRef.setter}>
 *           <Child theRef={this.theRef} />
 *         </div>
 *       )
 *     }
 *   }
 *
 * In the child, use the `observe()` method to defer operations that need the DOM node to proceed:
 *
 *   class Child extends React.Component {
 *
 *     componentDidMount() {
 *       this.props.theRef.observe(domNode => this.register(domNode))
 *     }
 *
 *     render() {
 *       return null;
 *     }
 *
 *     register(domNode) {
 *       console.log('Hey look I have a real DOM node', domNode);
 *     }
 *   }
 */
class RefHolder {
  constructor() {
    _defineProperty(this, "setter", value => {
      const oldValue = this.value;
      this.value = value;
      if (value !== oldValue && value !== null && value !== undefined) {
        this.emitter.emit('did-update', value);
      }
    });
    this.emitter = new _eventKit.Emitter();
    this.value = undefined;
  }
  isEmpty() {
    return this.value === undefined || this.value === null;
  }
  get() {
    if (this.isEmpty()) {
      throw new Error('RefHolder is empty');
    }
    return this.value;
  }
  getOr(def) {
    if (this.isEmpty()) {
      return def;
    }
    return this.value;
  }
  getPromise() {
    if (this.isEmpty()) {
      return new Promise(resolve => {
        const sub = this.observe(value => {
          resolve(value);
          sub.dispose();
        });
      });
    }
    return Promise.resolve(this.get());
  }
  map(present, absent = () => this) {
    return RefHolder.on(this.isEmpty() ? absent() : present(this.get()));
  }
  observe(callback) {
    if (!this.isEmpty()) {
      callback(this.value);
    }
    return this.emitter.on('did-update', callback);
  }
  static on(valueOrHolder) {
    if (valueOrHolder instanceof this) {
      return valueOrHolder;
    } else {
      const holder = new this();
      holder.setter(valueOrHolder);
      return holder;
    }
  }
}
exports.default = RefHolder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2RlZmluZVByb3BlcnR5Iiwib2JqIiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwidCIsImkiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJyIiwiZSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIlJlZkhvbGRlciIsImNvbnN0cnVjdG9yIiwib2xkVmFsdWUiLCJ1bmRlZmluZWQiLCJlbWl0dGVyIiwiZW1pdCIsIkVtaXR0ZXIiLCJpc0VtcHR5IiwiZ2V0IiwiRXJyb3IiLCJnZXRPciIsImRlZiIsImdldFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YiIsIm9ic2VydmUiLCJkaXNwb3NlIiwibWFwIiwicHJlc2VudCIsImFic2VudCIsIm9uIiwiY2FsbGJhY2siLCJ2YWx1ZU9ySG9sZGVyIiwiaG9sZGVyIiwic2V0dGVyIiwiZXhwb3J0cyIsImRlZmF1bHQiXSwic291cmNlcyI6WyJyZWYtaG9sZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcblxuLypcbiAqIEFsbG93IGNoaWxkIGNvbXBvbmVudHMgdG8gb3BlcmF0ZSBvbiByZWZzIGNhcHR1cmVkIGJ5IGEgcGFyZW50IGNvbXBvbmVudC5cbiAqXG4gKiBSZWFjdCBkb2VzIG5vdCBndWFyYW50ZWUgdGhhdCByZWZzIGFyZSBhdmFpbGFibGUgdW50aWwgdGhlIGNvbXBvbmVudCBoYXMgZmluaXNoZWQgbW91bnRpbmcgKGJlZm9yZVxuICogY29tcG9uZW50RGlkTW91bnQoKSBpcyBjYWxsZWQpLCBidXQgYSBjb21wb25lbnQgZG9lcyBub3QgZmluaXNoIG1vdW50aW5nIHVudGlsIGFsbCBvZiBpdHMgY2hpbGRyZW4gYXJlIG1vdW50ZWQuIFRoaXNcbiAqIGNhdXNlcyBwcm9ibGVtcyB3aGVuIGEgY2hpbGQgbmVlZHMgdG8gY29uc3VtZSBhIERPTSBub2RlIGZyb20gaXRzIHBhcmVudCB0byBpbnRlcmFjdCB3aXRoIHRoZSBBdG9tIEFQSSwgbGlrZSB3ZSBkbyBpblxuICogdGhlIGBUb29sdGlwYCBhbmQgYENvbW1hbmRzYCBjb21wb25lbnRzLlxuICpcbiAqIFRvIHBhc3MgYSByZWYgdG8gYSBjaGlsZCwgY2FwdHVyZSBpdCBpbiBhIFJlZkhvbGRlciBpbiB0aGUgcGFyZW50LCBhbmQgcGFzcyB0aGUgUmVmSG9sZGVyIHRvIHRoZSBjaGlsZDpcbiAqXG4gKiAgIGNsYXNzIFBhcmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gKiAgICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgICB0aGlzLnRoZVJlZiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAqICAgICB9XG4gKlxuICogICAgIHJlbmRlcigpIHtcbiAqICAgICAgIHJldHVybiAoXG4gKiAgICAgICAgIDxkaXYgcmVmPXt0aGlzLnRoZVJlZi5zZXR0ZXJ9PlxuICogICAgICAgICAgIDxDaGlsZCB0aGVSZWY9e3RoaXMudGhlUmVmfSAvPlxuICogICAgICAgICA8L2Rpdj5cbiAqICAgICAgIClcbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBJbiB0aGUgY2hpbGQsIHVzZSB0aGUgYG9ic2VydmUoKWAgbWV0aG9kIHRvIGRlZmVyIG9wZXJhdGlvbnMgdGhhdCBuZWVkIHRoZSBET00gbm9kZSB0byBwcm9jZWVkOlxuICpcbiAqICAgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICpcbiAqICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAqICAgICAgIHRoaXMucHJvcHMudGhlUmVmLm9ic2VydmUoZG9tTm9kZSA9PiB0aGlzLnJlZ2lzdGVyKGRvbU5vZGUpKVxuICogICAgIH1cbiAqXG4gKiAgICAgcmVuZGVyKCkge1xuICogICAgICAgcmV0dXJuIG51bGw7XG4gKiAgICAgfVxuICpcbiAqICAgICByZWdpc3Rlcihkb21Ob2RlKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZygnSGV5IGxvb2sgSSBoYXZlIGEgcmVhbCBET00gbm9kZScsIGRvbU5vZGUpO1xuICogICAgIH1cbiAqICAgfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWZIb2xkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgfHwgdGhpcy52YWx1ZSA9PT0gbnVsbDtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVmSG9sZGVyIGlzIGVtcHR5Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgZ2V0T3IoZGVmKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIGdldFByb21pc2UoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YiA9IHRoaXMub2JzZXJ2ZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgc3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZ2V0KCkpO1xuICB9XG5cbiAgbWFwKHByZXNlbnQsIGFic2VudCA9ICgpID0+IHRoaXMpIHtcbiAgICByZXR1cm4gUmVmSG9sZGVyLm9uKHRoaXMuaXNFbXB0eSgpID8gYWJzZW50KCkgOiBwcmVzZW50KHRoaXMuZ2V0KCkpKTtcbiAgfVxuXG4gIHNldHRlciA9IHZhbHVlID0+IHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gb2xkVmFsdWUgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZShjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgc3RhdGljIG9uKHZhbHVlT3JIb2xkZXIpIHtcbiAgICBpZiAodmFsdWVPckhvbGRlciBpbnN0YW5jZW9mIHRoaXMpIHtcbiAgICAgIHJldHVybiB2YWx1ZU9ySG9sZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBob2xkZXIgPSBuZXcgdGhpcygpO1xuICAgICAgaG9sZGVyLnNldHRlcih2YWx1ZU9ySG9sZGVyKTtcbiAgICAgIHJldHVybiBob2xkZXI7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUFrQyxTQUFBQyxnQkFBQUMsR0FBQSxFQUFBQyxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBRCxHQUFBLElBQUFJLE1BQUEsQ0FBQUMsY0FBQSxDQUFBTCxHQUFBLEVBQUFDLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFJLFVBQUEsUUFBQUMsWUFBQSxRQUFBQyxRQUFBLG9CQUFBUixH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