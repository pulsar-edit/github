"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventKit = require("event-kit");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2RlZmluZVByb3BlcnR5Iiwib2JqIiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIlJlZkhvbGRlciIsImNvbnN0cnVjdG9yIiwib2xkVmFsdWUiLCJlbWl0dGVyIiwiZW1pdCIsIkVtaXR0ZXIiLCJpc0VtcHR5IiwiZ2V0IiwiRXJyb3IiLCJnZXRPciIsImRlZiIsImdldFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YiIsIm9ic2VydmUiLCJkaXNwb3NlIiwibWFwIiwicHJlc2VudCIsImFic2VudCIsIm9uIiwiY2FsbGJhY2siLCJ2YWx1ZU9ySG9sZGVyIiwiaG9sZGVyIiwic2V0dGVyIiwiZXhwb3J0cyIsImRlZmF1bHQiXSwic291cmNlcyI6WyJyZWYtaG9sZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcblxuLypcbiAqIEFsbG93IGNoaWxkIGNvbXBvbmVudHMgdG8gb3BlcmF0ZSBvbiByZWZzIGNhcHR1cmVkIGJ5IGEgcGFyZW50IGNvbXBvbmVudC5cbiAqXG4gKiBSZWFjdCBkb2VzIG5vdCBndWFyYW50ZWUgdGhhdCByZWZzIGFyZSBhdmFpbGFibGUgdW50aWwgdGhlIGNvbXBvbmVudCBoYXMgZmluaXNoZWQgbW91bnRpbmcgKGJlZm9yZVxuICogY29tcG9uZW50RGlkTW91bnQoKSBpcyBjYWxsZWQpLCBidXQgYSBjb21wb25lbnQgZG9lcyBub3QgZmluaXNoIG1vdW50aW5nIHVudGlsIGFsbCBvZiBpdHMgY2hpbGRyZW4gYXJlIG1vdW50ZWQuIFRoaXNcbiAqIGNhdXNlcyBwcm9ibGVtcyB3aGVuIGEgY2hpbGQgbmVlZHMgdG8gY29uc3VtZSBhIERPTSBub2RlIGZyb20gaXRzIHBhcmVudCB0byBpbnRlcmFjdCB3aXRoIHRoZSBBdG9tIEFQSSwgbGlrZSB3ZSBkbyBpblxuICogdGhlIGBUb29sdGlwYCBhbmQgYENvbW1hbmRzYCBjb21wb25lbnRzLlxuICpcbiAqIFRvIHBhc3MgYSByZWYgdG8gYSBjaGlsZCwgY2FwdHVyZSBpdCBpbiBhIFJlZkhvbGRlciBpbiB0aGUgcGFyZW50LCBhbmQgcGFzcyB0aGUgUmVmSG9sZGVyIHRvIHRoZSBjaGlsZDpcbiAqXG4gKiAgIGNsYXNzIFBhcmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gKiAgICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgICB0aGlzLnRoZVJlZiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAqICAgICB9XG4gKlxuICogICAgIHJlbmRlcigpIHtcbiAqICAgICAgIHJldHVybiAoXG4gKiAgICAgICAgIDxkaXYgcmVmPXt0aGlzLnRoZVJlZi5zZXR0ZXJ9PlxuICogICAgICAgICAgIDxDaGlsZCB0aGVSZWY9e3RoaXMudGhlUmVmfSAvPlxuICogICAgICAgICA8L2Rpdj5cbiAqICAgICAgIClcbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiBJbiB0aGUgY2hpbGQsIHVzZSB0aGUgYG9ic2VydmUoKWAgbWV0aG9kIHRvIGRlZmVyIG9wZXJhdGlvbnMgdGhhdCBuZWVkIHRoZSBET00gbm9kZSB0byBwcm9jZWVkOlxuICpcbiAqICAgY2xhc3MgQ2hpbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICpcbiAqICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAqICAgICAgIHRoaXMucHJvcHMudGhlUmVmLm9ic2VydmUoZG9tTm9kZSA9PiB0aGlzLnJlZ2lzdGVyKGRvbU5vZGUpKVxuICogICAgIH1cbiAqXG4gKiAgICAgcmVuZGVyKCkge1xuICogICAgICAgcmV0dXJuIG51bGw7XG4gKiAgICAgfVxuICpcbiAqICAgICByZWdpc3Rlcihkb21Ob2RlKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZygnSGV5IGxvb2sgSSBoYXZlIGEgcmVhbCBET00gbm9kZScsIGRvbU5vZGUpO1xuICogICAgIH1cbiAqICAgfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWZIb2xkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgfHwgdGhpcy52YWx1ZSA9PT0gbnVsbDtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVmSG9sZGVyIGlzIGVtcHR5Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgZ2V0T3IoZGVmKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIGdldFByb21pc2UoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YiA9IHRoaXMub2JzZXJ2ZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgc3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZ2V0KCkpO1xuICB9XG5cbiAgbWFwKHByZXNlbnQsIGFic2VudCA9ICgpID0+IHRoaXMpIHtcbiAgICByZXR1cm4gUmVmSG9sZGVyLm9uKHRoaXMuaXNFbXB0eSgpID8gYWJzZW50KCkgOiBwcmVzZW50KHRoaXMuZ2V0KCkpKTtcbiAgfVxuXG4gIHNldHRlciA9IHZhbHVlID0+IHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gb2xkVmFsdWUgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZShjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgc3RhdGljIG9uKHZhbHVlT3JIb2xkZXIpIHtcbiAgICBpZiAodmFsdWVPckhvbGRlciBpbnN0YW5jZW9mIHRoaXMpIHtcbiAgICAgIHJldHVybiB2YWx1ZU9ySG9sZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBob2xkZXIgPSBuZXcgdGhpcygpO1xuICAgICAgaG9sZGVyLnNldHRlcih2YWx1ZU9ySG9sZGVyKTtcbiAgICAgIHJldHVybiBob2xkZXI7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUFrQyxTQUFBQyxnQkFBQUMsR0FBQSxFQUFBQyxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBRCxHQUFBLElBQUFJLE1BQUEsQ0FBQUMsY0FBQSxDQUFBTCxHQUFBLEVBQUFDLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFJLFVBQUEsUUFBQUMsWUFBQSxR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