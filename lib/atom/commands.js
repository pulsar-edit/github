"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Commands extends _react.default.Component {
  render() {
    const {
      registry,
      target
    } = this.props;
    return _react.default.createElement("div", null, _react.default.Children.map(this.props.children, child => {
      return child ? _react.default.cloneElement(child, {
        registry,
        target
      }) : null;
    }));
  }

}

exports.default = Commands;

_defineProperty(Commands, "propTypes", {
  registry: _propTypes.default.object.isRequired,
  target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes2.DOMNodePropType, _propTypes2.RefHolderPropType]).isRequired,
  children: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.arrayOf(_propTypes.default.element)]).isRequired
});

class Command extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    this.subTarget = new _eventKit.Disposable();
    this.subCommand = new _eventKit.Disposable();
  }

  componentDidMount() {
    this.observeTarget(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (['registry', 'target', 'command', 'callback'].some(p => newProps[p] !== this.props[p])) {
      this.observeTarget(newProps);
    }
  }

  componentWillUnmount() {
    this.subTarget.dispose();
    this.subCommand.dispose();
  }

  observeTarget(props) {
    this.subTarget.dispose();
    this.subTarget = _refHolder.default.on(props.target).observe(t => this.registerCommand(t, props));
  }

  registerCommand(target, {
    registry,
    command,
    callback
  }) {
    this.subCommand.dispose();
    this.subCommand = registry.add(target, command, callback);
  }

  render() {
    return null;
  }

}

exports.Command = Command;

_defineProperty(Command, "propTypes", {
  registry: _propTypes.default.object,
  target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes2.DOMNodePropType, _propTypes2.RefHolderPropType]),
  command: _propTypes.default.string.isRequired,
  callback: _propTypes.default.func.isRequired
});