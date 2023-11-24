"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscorePlus = require("underscore-plus");

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Keystroke extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'didChangeTarget');
    this.sub = new _eventKit.Disposable();
    this.state = {
      keybinding: null
    };
  }

  componentDidMount() {
    this.observeTarget();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.refTarget !== prevProps.refTarget) {
      this.observeTarget();
    } else if (this.props.command !== prevProps.command) {
      this.didChangeTarget(this.props.refTarget.getOr(null));
    }
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  render() {
    if (!this.state.keybinding) {
      return null;
    }

    return _react.default.createElement("span", {
      className: "keystroke"
    }, (0, _underscorePlus.humanizeKeystroke)(this.state.keybinding.keystrokes));
  }

  observeTarget() {
    this.sub.dispose();

    if (this.props.refTarget) {
      this.sub = this.props.refTarget.observe(this.didChangeTarget);
    } else {
      this.didChangeTarget(null);
    }
  }

  didChangeTarget(target) {
    const [keybinding] = this.props.keymaps.findKeyBindings({
      command: this.props.command,
      target
    });
    this.setState({
      keybinding
    });
  }

}

exports.default = Keystroke;

_defineProperty(Keystroke, "propTypes", {
  keymaps: _propTypes.default.shape({
    findKeyBindings: _propTypes.default.func.isRequired
  }).isRequired,
  command: _propTypes.default.string.isRequired,
  refTarget: _propTypes2.RefHolderPropType
});