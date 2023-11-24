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