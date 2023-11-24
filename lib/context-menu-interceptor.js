"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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