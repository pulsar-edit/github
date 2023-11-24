"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SimpleTooltip extends _react.default.Component {
  componentDidMount() {
    this.disposable = this.props.tooltips.add(_reactDom.default.findDOMNode(this.child), {
      title: () => this.props.title
    });
  }

  componentWillUnmount() {
    this.disposable.dispose();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.disposable.dispose();
      this.disposable = this.props.tooltips.add(_reactDom.default.findDOMNode(this.child), {
        title: () => this.props.title
      });
    }
  }

  render() {
    const child = _react.default.Children.only(this.props.children);

    return _react.default.cloneElement(child, {
      ref: e => {
        this.child = e;
      }
    });
  }

}

exports.default = SimpleTooltip;

_defineProperty(SimpleTooltip, "propTypes", {
  tooltips: _propTypes.default.object.isRequired,
  children: _propTypes.default.node.isRequired,
  title: _propTypes.default.string.isRequired
});