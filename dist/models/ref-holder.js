"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvcmVmLWhvbGRlci5qcyJdLCJuYW1lcyI6WyJSZWZIb2xkZXIiLCJjb25zdHJ1Y3RvciIsInZhbHVlIiwib2xkVmFsdWUiLCJ1bmRlZmluZWQiLCJlbWl0dGVyIiwiZW1pdCIsIkVtaXR0ZXIiLCJpc0VtcHR5IiwiZ2V0IiwiRXJyb3IiLCJnZXRPciIsImRlZiIsImdldFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YiIsIm9ic2VydmUiLCJkaXNwb3NlIiwibWFwIiwicHJlc2VudCIsImFic2VudCIsIm9uIiwiY2FsbGJhY2siLCJ2YWx1ZU9ySG9sZGVyIiwiaG9sZGVyIiwic2V0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsU0FBTixDQUFnQjtBQUM3QkMsRUFBQUEsV0FBVyxHQUFHO0FBQUEsb0NBd0NMQyxLQUFLLElBQUk7QUFDaEIsWUFBTUMsUUFBUSxHQUFHLEtBQUtELEtBQXRCO0FBQ0EsV0FBS0EsS0FBTCxHQUFhQSxLQUFiOztBQUNBLFVBQUlBLEtBQUssS0FBS0MsUUFBVixJQUFzQkQsS0FBSyxLQUFLLElBQWhDLElBQXdDQSxLQUFLLEtBQUtFLFNBQXRELEVBQWlFO0FBQy9ELGFBQUtDLE9BQUwsQ0FBYUMsSUFBYixDQUFrQixZQUFsQixFQUFnQ0osS0FBaEM7QUFDRDtBQUNGLEtBOUNhOztBQUNaLFNBQUtHLE9BQUwsR0FBZSxJQUFJRSxpQkFBSixFQUFmO0FBQ0EsU0FBS0wsS0FBTCxHQUFhRSxTQUFiO0FBQ0Q7O0FBRURJLEVBQUFBLE9BQU8sR0FBRztBQUNSLFdBQU8sS0FBS04sS0FBTCxLQUFlRSxTQUFmLElBQTRCLEtBQUtGLEtBQUwsS0FBZSxJQUFsRDtBQUNEOztBQUVETyxFQUFBQSxHQUFHLEdBQUc7QUFDSixRQUFJLEtBQUtELE9BQUwsRUFBSixFQUFvQjtBQUNsQixZQUFNLElBQUlFLEtBQUosQ0FBVSxvQkFBVixDQUFOO0FBQ0Q7O0FBQ0QsV0FBTyxLQUFLUixLQUFaO0FBQ0Q7O0FBRURTLEVBQUFBLEtBQUssQ0FBQ0MsR0FBRCxFQUFNO0FBQ1QsUUFBSSxLQUFLSixPQUFMLEVBQUosRUFBb0I7QUFDbEIsYUFBT0ksR0FBUDtBQUNEOztBQUNELFdBQU8sS0FBS1YsS0FBWjtBQUNEOztBQUVEVyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFJLEtBQUtMLE9BQUwsRUFBSixFQUFvQjtBQUNsQixhQUFPLElBQUlNLE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzVCLGNBQU1DLEdBQUcsR0FBRyxLQUFLQyxPQUFMLENBQWFmLEtBQUssSUFBSTtBQUNoQ2EsVUFBQUEsT0FBTyxDQUFDYixLQUFELENBQVA7QUFDQWMsVUFBQUEsR0FBRyxDQUFDRSxPQUFKO0FBQ0QsU0FIVyxDQUFaO0FBSUQsT0FMTSxDQUFQO0FBTUQ7O0FBRUQsV0FBT0osT0FBTyxDQUFDQyxPQUFSLENBQWdCLEtBQUtOLEdBQUwsRUFBaEIsQ0FBUDtBQUNEOztBQUVEVSxFQUFBQSxHQUFHLENBQUNDLE9BQUQsRUFBVUMsTUFBTSxHQUFHLE1BQU0sSUFBekIsRUFBK0I7QUFDaEMsV0FBT3JCLFNBQVMsQ0FBQ3NCLEVBQVYsQ0FBYSxLQUFLZCxPQUFMLEtBQWlCYSxNQUFNLEVBQXZCLEdBQTRCRCxPQUFPLENBQUMsS0FBS1gsR0FBTCxFQUFELENBQWhELENBQVA7QUFDRDs7QUFVRFEsRUFBQUEsT0FBTyxDQUFDTSxRQUFELEVBQVc7QUFDaEIsUUFBSSxDQUFDLEtBQUtmLE9BQUwsRUFBTCxFQUFxQjtBQUNuQmUsTUFBQUEsUUFBUSxDQUFDLEtBQUtyQixLQUFOLENBQVI7QUFDRDs7QUFDRCxXQUFPLEtBQUtHLE9BQUwsQ0FBYWlCLEVBQWIsQ0FBZ0IsWUFBaEIsRUFBOEJDLFFBQTlCLENBQVA7QUFDRDs7QUFFUSxTQUFGRCxFQUFFLENBQUNFLGFBQUQsRUFBZ0I7QUFDdkIsUUFBSUEsYUFBYSxZQUFZLElBQTdCLEVBQW1DO0FBQ2pDLGFBQU9BLGFBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNQyxNQUFNLEdBQUcsSUFBSSxJQUFKLEVBQWY7QUFDQUEsTUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWNGLGFBQWQ7QUFDQSxhQUFPQyxNQUFQO0FBQ0Q7QUFDRjs7QUFoRTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuXG4vKlxuICogQWxsb3cgY2hpbGQgY29tcG9uZW50cyB0byBvcGVyYXRlIG9uIHJlZnMgY2FwdHVyZWQgYnkgYSBwYXJlbnQgY29tcG9uZW50LlxuICpcbiAqIFJlYWN0IGRvZXMgbm90IGd1YXJhbnRlZSB0aGF0IHJlZnMgYXJlIGF2YWlsYWJsZSB1bnRpbCB0aGUgY29tcG9uZW50IGhhcyBmaW5pc2hlZCBtb3VudGluZyAoYmVmb3JlXG4gKiBjb21wb25lbnREaWRNb3VudCgpIGlzIGNhbGxlZCksIGJ1dCBhIGNvbXBvbmVudCBkb2VzIG5vdCBmaW5pc2ggbW91bnRpbmcgdW50aWwgYWxsIG9mIGl0cyBjaGlsZHJlbiBhcmUgbW91bnRlZC4gVGhpc1xuICogY2F1c2VzIHByb2JsZW1zIHdoZW4gYSBjaGlsZCBuZWVkcyB0byBjb25zdW1lIGEgRE9NIG5vZGUgZnJvbSBpdHMgcGFyZW50IHRvIGludGVyYWN0IHdpdGggdGhlIEF0b20gQVBJLCBsaWtlIHdlIGRvIGluXG4gKiB0aGUgYFRvb2x0aXBgIGFuZCBgQ29tbWFuZHNgIGNvbXBvbmVudHMuXG4gKlxuICogVG8gcGFzcyBhIHJlZiB0byBhIGNoaWxkLCBjYXB0dXJlIGl0IGluIGEgUmVmSG9sZGVyIGluIHRoZSBwYXJlbnQsIGFuZCBwYXNzIHRoZSBSZWZIb2xkZXIgdG8gdGhlIGNoaWxkOlxuICpcbiAqICAgY2xhc3MgUGFyZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAqICAgICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICAgIHRoaXMudGhlUmVmID0gbmV3IFJlZkhvbGRlcigpO1xuICogICAgIH1cbiAqXG4gKiAgICAgcmVuZGVyKCkge1xuICogICAgICAgcmV0dXJuIChcbiAqICAgICAgICAgPGRpdiByZWY9e3RoaXMudGhlUmVmLnNldHRlcn0+XG4gKiAgICAgICAgICAgPENoaWxkIHRoZVJlZj17dGhpcy50aGVSZWZ9IC8+XG4gKiAgICAgICAgIDwvZGl2PlxuICogICAgICAgKVxuICogICAgIH1cbiAqICAgfVxuICpcbiAqIEluIHRoZSBjaGlsZCwgdXNlIHRoZSBgb2JzZXJ2ZSgpYCBtZXRob2QgdG8gZGVmZXIgb3BlcmF0aW9ucyB0aGF0IG5lZWQgdGhlIERPTSBub2RlIHRvIHByb2NlZWQ6XG4gKlxuICogICBjbGFzcyBDaGlsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gKlxuICogICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICogICAgICAgdGhpcy5wcm9wcy50aGVSZWYub2JzZXJ2ZShkb21Ob2RlID0+IHRoaXMucmVnaXN0ZXIoZG9tTm9kZSkpXG4gKiAgICAgfVxuICpcbiAqICAgICByZW5kZXIoKSB7XG4gKiAgICAgICByZXR1cm4gbnVsbDtcbiAqICAgICB9XG4gKlxuICogICAgIHJlZ2lzdGVyKGRvbU5vZGUpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKCdIZXkgbG9vayBJIGhhdmUgYSByZWFsIERPTSBub2RlJywgZG9tTm9kZSk7XG4gKiAgICAgfVxuICogICB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZkhvbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnZhbHVlID09PSBudWxsO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWZIb2xkZXIgaXMgZW1wdHknKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICBnZXRPcihkZWYpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBkZWY7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgZ2V0UHJvbWlzZSgpIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViID0gdGhpcy5vYnNlcnZlKHZhbHVlID0+IHtcbiAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICBzdWIuZGlzcG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXQoKSk7XG4gIH1cblxuICBtYXAocHJlc2VudCwgYWJzZW50ID0gKCkgPT4gdGhpcykge1xuICAgIHJldHVybiBSZWZIb2xkZXIub24odGhpcy5pc0VtcHR5KCkgPyBhYnNlbnQoKSA6IHByZXNlbnQodGhpcy5nZXQoKSkpO1xuICB9XG5cbiAgc2V0dGVyID0gdmFsdWUgPT4ge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlICE9PSBvbGRWYWx1ZSAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgY2FsbGJhY2sodGhpcy52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdGF0aWMgb24odmFsdWVPckhvbGRlcikge1xuICAgIGlmICh2YWx1ZU9ySG9sZGVyIGluc3RhbmNlb2YgdGhpcykge1xuICAgICAgcmV0dXJuIHZhbHVlT3JIb2xkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGhvbGRlciA9IG5ldyB0aGlzKCk7XG4gICAgICBob2xkZXIuc2V0dGVyKHZhbHVlT3JIb2xkZXIpO1xuICAgICAgcmV0dXJuIGhvbGRlcjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==