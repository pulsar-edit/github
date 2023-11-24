"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeTabbable = makeTabbable;
exports.TabbableSelect = exports.TabbableTextEditor = exports.TabbableSummary = exports.TabbableButton = exports.TabbableInput = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSelect = _interopRequireDefault(require("react-select"));

var _commands = _interopRequireWildcard(require("../atom/commands"));

var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function makeTabbable(Component, options = {}) {
  var _class;

  return _class = class extends _react.default.Component {
    constructor(props) {
      super(props);

      _defineProperty(this, "focusNext", e => {
        this.elementRef.map(element => this.props.tabGroup.focusAfter(element));
        e.stopPropagation();
      });

      _defineProperty(this, "focusPrevious", e => {
        this.elementRef.map(element => this.props.tabGroup.focusBefore(element));
        e.stopPropagation();
      });

      this.rootRef = new _refHolder.default();
      this.elementRef = new _refHolder.default();

      if (options.rootRefProp) {
        this.rootRef = new _refHolder.default();
        this.rootRefProps = {
          [options.rootRefProp]: this.rootRef
        };
      } else {
        this.rootRef = this.elementRef;
        this.rootRefProps = {};
      }

      if (options.passCommands) {
        this.commandProps = {
          commands: this.props.commands
        };
      } else {
        this.commandProps = {};
      }
    }

    render() {
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_commands.default, {
        registry: this.props.commands,
        target: this.rootRef
      }, _react.default.createElement(_commands.Command, {
        command: "core:focus-next",
        callback: this.focusNext
      }), _react.default.createElement(_commands.Command, {
        command: "core:focus-previous",
        callback: this.focusPrevious
      })), _react.default.createElement(Component, _extends({
        ref: this.elementRef.setter,
        tabIndex: -1
      }, (0, _helpers.unusedProps)(this.props, this.constructor.propTypes), this.rootRefProps, this.commandProps)));
    }

    componentDidMount() {
      this.elementRef.map(element => this.props.tabGroup.appendElement(element, this.props.autofocus));
    }

    componentWillUnmount() {
      this.elementRef.map(element => this.props.tabGroup.removeElement(element));
    }

  }, _defineProperty(_class, "propTypes", {
    tabGroup: _propTypes.default.shape({
      appendElement: _propTypes.default.func.isRequired,
      removeElement: _propTypes.default.func.isRequired,
      focusAfter: _propTypes.default.func.isRequired,
      focusBefore: _propTypes.default.func.isRequired
    }).isRequired,
    autofocus: _propTypes.default.bool,
    commands: _propTypes.default.object.isRequired
  }), _defineProperty(_class, "defaultProps", {
    autofocus: false
  }), _class;
}

const TabbableInput = makeTabbable('input');
exports.TabbableInput = TabbableInput;
const TabbableButton = makeTabbable('button');
exports.TabbableButton = TabbableButton;
const TabbableSummary = makeTabbable('summary');
exports.TabbableSummary = TabbableSummary;
const TabbableTextEditor = makeTabbable(_atomTextEditor.default, {
  rootRefProp: 'refElement'
}); // CustomEvent is a DOM primitive, which v8 can't access
// so we're essentially lazy loading to keep snapshotting from breaking.

exports.TabbableTextEditor = TabbableTextEditor;
let FakeKeyDownEvent;

class WrapSelect extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refSelect = new _refHolder.default();
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-TabbableWrapper",
      ref: this.props.refElement.setter
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.props.refElement
    }, _react.default.createElement(_commands.Command, {
      command: "github:selectbox-down",
      callback: this.proxyKeyCode(40)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-up",
      callback: this.proxyKeyCode(38)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-enter",
      callback: this.proxyKeyCode(13)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-tab",
      callback: this.proxyKeyCode(9)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-backspace",
      callback: this.proxyKeyCode(8)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-pageup",
      callback: this.proxyKeyCode(33)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-pagedown",
      callback: this.proxyKeyCode(34)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-end",
      callback: this.proxyKeyCode(35)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-home",
      callback: this.proxyKeyCode(36)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-delete",
      callback: this.proxyKeyCode(46)
    }), _react.default.createElement(_commands.Command, {
      command: "github:selectbox-escape",
      callback: this.proxyKeyCode(27)
    })), _react.default.createElement(_reactSelect.default, _extends({
      ref: this.refSelect.setter
    }, (0, _helpers.unusedProps)(this.props, this.constructor.propTypes))));
  }

  focus() {
    return this.refSelect.map(select => select.focus());
  }

  proxyKeyCode(keyCode) {
    return e => this.refSelect.map(select => {
      if (!FakeKeyDownEvent) {
        FakeKeyDownEvent = class extends CustomEvent {
          constructor(kCode) {
            super('keydown');
            this.keyCode = kCode;
          }

        };
      }

      const fakeEvent = new FakeKeyDownEvent(keyCode);
      select.handleKeyDown(fakeEvent);
      return null;
    });
  }

}

_defineProperty(WrapSelect, "propTypes", {
  refElement: _propTypes2.RefHolderPropType.isRequired,
  commands: _propTypes.default.object.isRequired
});

const TabbableSelect = makeTabbable(WrapSelect, {
  rootRefProp: 'refElement',
  passCommands: true
});
exports.TabbableSelect = TabbableSelect;