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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWZIb2xkZXIiLCJjb25zdHJ1Y3RvciIsInZhbHVlIiwib2xkVmFsdWUiLCJ1bmRlZmluZWQiLCJlbWl0dGVyIiwiZW1pdCIsIkVtaXR0ZXIiLCJpc0VtcHR5IiwiZ2V0IiwiRXJyb3IiLCJnZXRPciIsImRlZiIsImdldFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YiIsIm9ic2VydmUiLCJkaXNwb3NlIiwibWFwIiwicHJlc2VudCIsImFic2VudCIsIm9uIiwiY2FsbGJhY2siLCJ2YWx1ZU9ySG9sZGVyIiwiaG9sZGVyIiwic2V0dGVyIl0sInNvdXJjZXMiOlsicmVmLWhvbGRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbi8qXG4gKiBBbGxvdyBjaGlsZCBjb21wb25lbnRzIHRvIG9wZXJhdGUgb24gcmVmcyBjYXB0dXJlZCBieSBhIHBhcmVudCBjb21wb25lbnQuXG4gKlxuICogUmVhY3QgZG9lcyBub3QgZ3VhcmFudGVlIHRoYXQgcmVmcyBhcmUgYXZhaWxhYmxlIHVudGlsIHRoZSBjb21wb25lbnQgaGFzIGZpbmlzaGVkIG1vdW50aW5nIChiZWZvcmVcbiAqIGNvbXBvbmVudERpZE1vdW50KCkgaXMgY2FsbGVkKSwgYnV0IGEgY29tcG9uZW50IGRvZXMgbm90IGZpbmlzaCBtb3VudGluZyB1bnRpbCBhbGwgb2YgaXRzIGNoaWxkcmVuIGFyZSBtb3VudGVkLiBUaGlzXG4gKiBjYXVzZXMgcHJvYmxlbXMgd2hlbiBhIGNoaWxkIG5lZWRzIHRvIGNvbnN1bWUgYSBET00gbm9kZSBmcm9tIGl0cyBwYXJlbnQgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgQXRvbSBBUEksIGxpa2Ugd2UgZG8gaW5cbiAqIHRoZSBgVG9vbHRpcGAgYW5kIGBDb21tYW5kc2AgY29tcG9uZW50cy5cbiAqXG4gKiBUbyBwYXNzIGEgcmVmIHRvIGEgY2hpbGQsIGNhcHR1cmUgaXQgaW4gYSBSZWZIb2xkZXIgaW4gdGhlIHBhcmVudCwgYW5kIHBhc3MgdGhlIFJlZkhvbGRlciB0byB0aGUgY2hpbGQ6XG4gKlxuICogICBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICogICAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgICAgdGhpcy50aGVSZWYgPSBuZXcgUmVmSG9sZGVyKCk7XG4gKiAgICAgfVxuICpcbiAqICAgICByZW5kZXIoKSB7XG4gKiAgICAgICByZXR1cm4gKFxuICogICAgICAgICA8ZGl2IHJlZj17dGhpcy50aGVSZWYuc2V0dGVyfT5cbiAqICAgICAgICAgICA8Q2hpbGQgdGhlUmVmPXt0aGlzLnRoZVJlZn0gLz5cbiAqICAgICAgICAgPC9kaXY+XG4gKiAgICAgICApXG4gKiAgICAgfVxuICogICB9XG4gKlxuICogSW4gdGhlIGNoaWxkLCB1c2UgdGhlIGBvYnNlcnZlKClgIG1ldGhvZCB0byBkZWZlciBvcGVyYXRpb25zIHRoYXQgbmVlZCB0aGUgRE9NIG5vZGUgdG8gcHJvY2VlZDpcbiAqXG4gKiAgIGNsYXNzIENoaWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAqXG4gKiAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gKiAgICAgICB0aGlzLnByb3BzLnRoZVJlZi5vYnNlcnZlKGRvbU5vZGUgPT4gdGhpcy5yZWdpc3Rlcihkb21Ob2RlKSlcbiAqICAgICB9XG4gKlxuICogICAgIHJlbmRlcigpIHtcbiAqICAgICAgIHJldHVybiBudWxsO1xuICogICAgIH1cbiAqXG4gKiAgICAgcmVnaXN0ZXIoZG9tTm9kZSkge1xuICogICAgICAgY29uc29sZS5sb2coJ0hleSBsb29rIEkgaGF2ZSBhIHJlYWwgRE9NIG5vZGUnLCBkb21Ob2RlKTtcbiAqICAgICB9XG4gKiAgIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVmSG9sZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMudmFsdWUgPT09IG51bGw7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZkhvbGRlciBpcyBlbXB0eScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIGdldE9yKGRlZikge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICBnZXRQcm9taXNlKCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBjb25zdCBzdWIgPSB0aGlzLm9ic2VydmUodmFsdWUgPT4ge1xuICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmdldCgpKTtcbiAgfVxuXG4gIG1hcChwcmVzZW50LCBhYnNlbnQgPSAoKSA9PiB0aGlzKSB7XG4gICAgcmV0dXJuIFJlZkhvbGRlci5vbih0aGlzLmlzRW1wdHkoKSA/IGFic2VudCgpIDogcHJlc2VudCh0aGlzLmdldCgpKSk7XG4gIH1cblxuICBzZXR0ZXIgPSB2YWx1ZSA9PiB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAodmFsdWUgIT09IG9sZFZhbHVlICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJywgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG9ic2VydmUoY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICBjYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHN0YXRpYyBvbih2YWx1ZU9ySG9sZGVyKSB7XG4gICAgaWYgKHZhbHVlT3JIb2xkZXIgaW5zdGFuY2VvZiB0aGlzKSB7XG4gICAgICByZXR1cm4gdmFsdWVPckhvbGRlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaG9sZGVyID0gbmV3IHRoaXMoKTtcbiAgICAgIGhvbGRlci5zZXR0ZXIodmFsdWVPckhvbGRlcik7XG4gICAgICByZXR1cm4gaG9sZGVyO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUFrQztBQUFBO0FBQUE7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLFNBQVMsQ0FBQztFQUM3QkMsV0FBVyxHQUFHO0lBQUEsZ0NBd0NMQyxLQUFLLElBQUk7TUFDaEIsTUFBTUMsUUFBUSxHQUFHLElBQUksQ0FBQ0QsS0FBSztNQUMzQixJQUFJLENBQUNBLEtBQUssR0FBR0EsS0FBSztNQUNsQixJQUFJQSxLQUFLLEtBQUtDLFFBQVEsSUFBSUQsS0FBSyxLQUFLLElBQUksSUFBSUEsS0FBSyxLQUFLRSxTQUFTLEVBQUU7UUFDL0QsSUFBSSxDQUFDQyxPQUFPLENBQUNDLElBQUksQ0FBQyxZQUFZLEVBQUVKLEtBQUssQ0FBQztNQUN4QztJQUNGLENBQUM7SUE3Q0MsSUFBSSxDQUFDRyxPQUFPLEdBQUcsSUFBSUUsaUJBQU8sRUFBRTtJQUM1QixJQUFJLENBQUNMLEtBQUssR0FBR0UsU0FBUztFQUN4QjtFQUVBSSxPQUFPLEdBQUc7SUFDUixPQUFPLElBQUksQ0FBQ04sS0FBSyxLQUFLRSxTQUFTLElBQUksSUFBSSxDQUFDRixLQUFLLEtBQUssSUFBSTtFQUN4RDtFQUVBTyxHQUFHLEdBQUc7SUFDSixJQUFJLElBQUksQ0FBQ0QsT0FBTyxFQUFFLEVBQUU7TUFDbEIsTUFBTSxJQUFJRSxLQUFLLENBQUMsb0JBQW9CLENBQUM7SUFDdkM7SUFDQSxPQUFPLElBQUksQ0FBQ1IsS0FBSztFQUNuQjtFQUVBUyxLQUFLLENBQUNDLEdBQUcsRUFBRTtJQUNULElBQUksSUFBSSxDQUFDSixPQUFPLEVBQUUsRUFBRTtNQUNsQixPQUFPSSxHQUFHO0lBQ1o7SUFDQSxPQUFPLElBQUksQ0FBQ1YsS0FBSztFQUNuQjtFQUVBVyxVQUFVLEdBQUc7SUFDWCxJQUFJLElBQUksQ0FBQ0wsT0FBTyxFQUFFLEVBQUU7TUFDbEIsT0FBTyxJQUFJTSxPQUFPLENBQUNDLE9BQU8sSUFBSTtRQUM1QixNQUFNQyxHQUFHLEdBQUcsSUFBSSxDQUFDQyxPQUFPLENBQUNmLEtBQUssSUFBSTtVQUNoQ2EsT0FBTyxDQUFDYixLQUFLLENBQUM7VUFDZGMsR0FBRyxDQUFDRSxPQUFPLEVBQUU7UUFDZixDQUFDLENBQUM7TUFDSixDQUFDLENBQUM7SUFDSjtJQUVBLE9BQU9KLE9BQU8sQ0FBQ0MsT0FBTyxDQUFDLElBQUksQ0FBQ04sR0FBRyxFQUFFLENBQUM7RUFDcEM7RUFFQVUsR0FBRyxDQUFDQyxPQUFPLEVBQUVDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRTtJQUNoQyxPQUFPckIsU0FBUyxDQUFDc0IsRUFBRSxDQUFDLElBQUksQ0FBQ2QsT0FBTyxFQUFFLEdBQUdhLE1BQU0sRUFBRSxHQUFHRCxPQUFPLENBQUMsSUFBSSxDQUFDWCxHQUFHLEVBQUUsQ0FBQyxDQUFDO0VBQ3RFO0VBVUFRLE9BQU8sQ0FBQ00sUUFBUSxFQUFFO0lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUNmLE9BQU8sRUFBRSxFQUFFO01BQ25CZSxRQUFRLENBQUMsSUFBSSxDQUFDckIsS0FBSyxDQUFDO0lBQ3RCO0lBQ0EsT0FBTyxJQUFJLENBQUNHLE9BQU8sQ0FBQ2lCLEVBQUUsQ0FBQyxZQUFZLEVBQUVDLFFBQVEsQ0FBQztFQUNoRDtFQUVBLE9BQU9ELEVBQUUsQ0FBQ0UsYUFBYSxFQUFFO0lBQ3ZCLElBQUlBLGFBQWEsWUFBWSxJQUFJLEVBQUU7TUFDakMsT0FBT0EsYUFBYTtJQUN0QixDQUFDLE1BQU07TUFDTCxNQUFNQyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7TUFDekJBLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDRixhQUFhLENBQUM7TUFDNUIsT0FBT0MsTUFBTTtJQUNmO0VBQ0Y7QUFDRjtBQUFDIn0=