"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9hdXRvZm9jdXMuanMiXSwibmFtZXMiOlsiQXV0b0ZvY3VzIiwiY29uc3RydWN0b3IiLCJlbGVtZW50IiwiZmlyc3RUYXJnZXQiLCJpbmRleCIsImNhcHR1cmVkIiwiSW5maW5pdHkiLCJ0cmlnZ2VyIiwic2V0VGltZW91dCIsImZvY3VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxTQUFOLENBQWdCO0FBQzdCQyxFQUFBQSxXQUFXLEdBQUc7QUFBQSxvQ0FLTEMsT0FBTyxJQUFJLEtBQUtDLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0JELE9BQXBCLENBTE47O0FBQUEseUNBT0FFLEtBQUssSUFBSUYsT0FBTyxJQUFJO0FBQ2hDLFVBQUlFLEtBQUssR0FBRyxLQUFLQSxLQUFqQixFQUF3QjtBQUN0QixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCSCxPQUFoQjtBQUNEO0FBQ0YsS0FaYTs7QUFDWixTQUFLRSxLQUFMLEdBQWFFLFFBQWI7QUFDQSxTQUFLRCxRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7O0FBV0RFLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQUksS0FBS0YsUUFBTCxLQUFrQixJQUF0QixFQUE0QjtBQUMxQkcsTUFBQUEsVUFBVSxDQUFDLE1BQU0sS0FBS0gsUUFBTCxDQUFjSSxLQUFkLEVBQVAsRUFBOEIsQ0FBOUIsQ0FBVjtBQUNEO0FBQ0Y7O0FBbkI0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogV2hlbiB0cmlnZ2VyZWQsIGF1dG9tYXRpY2FsbHkgZm9jdXMgdGhlIGZpcnN0IGVsZW1lbnQgcmVmIHBhc3NlZCB0byB0aGlzIG9iamVjdC5cbiAqXG4gKiBUbyB1bmNvbmRpdGlvbmFsbHkgZm9jdXMgYSBzaW5nbGUgZWxlbWVudDpcbiAqXG4gKiBgYGBcbiAqIGNsYXNzIFNvbWVDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICogICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICogICAgIHN1cGVyKHByb3BzKTtcbiAqICAgICB0aGlzLmF1dG9mb2N1cyA9IG5ldyBBdXRvZm9jdXMoKTtcbiAqICAgfVxuICpcbiAqICAgcmVuZGVyKCkge1xuICogICAgIHJldHVybiAoXG4gKiAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Gb3JtXCI+XG4gKiAgICAgICAgIDxpbnB1dCByZWY9e3RoaXMuYXV0b2ZvY3VzLnRhcmdldH0gdHlwZT1cInRleHRcIiAvPlxuICogICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAvPlxuICogICAgICAgPC9kaXY+XG4gKiAgICAgKTtcbiAqICAgfVxuICpcbiAqICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gKiAgICAgdGhpcy5hdXRvZm9jdXMudHJpZ2dlcigpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBJZiBtdWx0aXBsZSBmb3JtIGVsZW1lbnRzIGFyZSBwcmVzZW50LCB1c2UgYGZpcnN0VGFyZ2V0YCB0byBjcmVhdGUgdGhlIHJlZiBpbnN0ZWFkLiBUaGUgcmVuZGVyZWQgcmVmIHlvdSBhc3NpZ24gdGhlXG4gKiBsb3dlc3QgbnVtZXJpYyBpbmRleCB3aWxsIGJlIGZvY3VzZWQgb24gdHJpZ2dlcjpcbiAqXG4gKiBgYGBcbiAqIGNsYXNzIFNvbWVDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICogICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICogICAgIHN1cGVyKHByb3BzKTtcbiAqICAgICB0aGlzLmF1dG9mb2N1cyA9IG5ldyBBdXRvZm9jdXMoKTtcbiAqICAgfVxuICpcbiAqICAgcmVuZGVyKCkge1xuICogICAgIHJldHVybiAoXG4gKiAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Gb3JtXCI+XG4gKiAgICAgICAgIHt0aGlzLnByb3BzLnNvbWVQcm9wICYmIDxpbnB1dCByZWY9e3RoaXMuYXV0b2ZvY3VzLmZpcnN0VGFyZ2V0KDApfSAvPn1cbiAqICAgICAgICAgPGlucHV0IHJlZj17dGhpcy5hdXRvZm9jdXMuZmlyc3RUYXJnZXQoMSl9IHR5cGU9XCJ0ZXh0XCIgLz5cbiAqICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgLz5cbiAqICAgICAgIDwvZGl2PlxuICogICAgICk7XG4gKiAgIH1cbiAqXG4gKiAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICogICAgIHRoaXMuYXV0b2ZvY3VzLnRyaWdnZXIoKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvRm9jdXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluZGV4ID0gSW5maW5pdHk7XG4gICAgdGhpcy5jYXB0dXJlZCA9IG51bGw7XG4gIH1cblxuICB0YXJnZXQgPSBlbGVtZW50ID0+IHRoaXMuZmlyc3RUYXJnZXQoMCkoZWxlbWVudCk7XG5cbiAgZmlyc3RUYXJnZXQgPSBpbmRleCA9PiBlbGVtZW50ID0+IHtcbiAgICBpZiAoaW5kZXggPCB0aGlzLmluZGV4KSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLmNhcHR1cmVkID0gZWxlbWVudDtcbiAgICB9XG4gIH07XG5cbiAgdHJpZ2dlcigpIHtcbiAgICBpZiAodGhpcy5jYXB0dXJlZCAhPT0gbnVsbCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNhcHR1cmVkLmZvY3VzKCksIDApO1xuICAgIH1cbiAgfVxufVxuIl19