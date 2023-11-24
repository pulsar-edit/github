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

class StatusBar extends _react.default.Component {
  constructor(props) {
    super(props);
    this.domNode = document.createElement('div');
    this.domNode.classList.add('react-atom-status-bar');

    if (props.className) {
      this.domNode.classList.add(props.className);
    }

    this.tile = null;
  }

  componentDidMount() {
    this.consumeStatusBar();
  }

  render() {
    return _reactDom.default.createPortal(this.props.children, this.domNode);
  }

  consumeStatusBar() {
    if (this.tile) {
      return;
    }

    if (!this.props.statusBar) {
      return;
    }

    this.tile = this.props.statusBar.addRightTile({
      item: this.domNode,
      priority: -50
    });
    this.props.onConsumeStatusBar(this.props.statusBar);
  }

  componentWillUnmount() {
    this.tile && this.tile.destroy();
  }

}

exports.default = StatusBar;

_defineProperty(StatusBar, "propTypes", {
  children: _propTypes.default.element.isRequired,
  statusBar: _propTypes.default.object,
  onConsumeStatusBar: _propTypes.default.func,
  className: _propTypes.default.string
});

_defineProperty(StatusBar, "defaultProps", {
  onConsumeStatusBar: statusBar => {}
});