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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
});

// CustomEvent is a DOM primitive, which v8 can't access
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYWtlVGFiYmFibGUiLCJDb21wb25lbnQiLCJvcHRpb25zIiwiUmVhY3QiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZSIsImVsZW1lbnRSZWYiLCJtYXAiLCJlbGVtZW50IiwidGFiR3JvdXAiLCJmb2N1c0FmdGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiZm9jdXNCZWZvcmUiLCJyb290UmVmIiwiUmVmSG9sZGVyIiwicm9vdFJlZlByb3AiLCJyb290UmVmUHJvcHMiLCJwYXNzQ29tbWFuZHMiLCJjb21tYW5kUHJvcHMiLCJjb21tYW5kcyIsInJlbmRlciIsImZvY3VzTmV4dCIsImZvY3VzUHJldmlvdXMiLCJzZXR0ZXIiLCJ1bnVzZWRQcm9wcyIsInByb3BUeXBlcyIsImNvbXBvbmVudERpZE1vdW50IiwiYXBwZW5kRWxlbWVudCIsImF1dG9mb2N1cyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRWxlbWVudCIsIlByb3BUeXBlcyIsInNoYXBlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJib29sIiwib2JqZWN0IiwiVGFiYmFibGVJbnB1dCIsIlRhYmJhYmxlQnV0dG9uIiwiVGFiYmFibGVTdW1tYXJ5IiwiVGFiYmFibGVUZXh0RWRpdG9yIiwiQXRvbVRleHRFZGl0b3IiLCJGYWtlS2V5RG93bkV2ZW50IiwiV3JhcFNlbGVjdCIsInJlZlNlbGVjdCIsInJlZkVsZW1lbnQiLCJwcm94eUtleUNvZGUiLCJmb2N1cyIsInNlbGVjdCIsImtleUNvZGUiLCJDdXN0b21FdmVudCIsImtDb2RlIiwiZmFrZUV2ZW50IiwiaGFuZGxlS2V5RG93biIsIlJlZkhvbGRlclByb3BUeXBlIiwiVGFiYmFibGVTZWxlY3QiXSwic291cmNlcyI6WyJ0YWJiYWJsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBTZWxlY3QgZnJvbSAncmVhY3Qtc2VsZWN0JztcblxuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge3VudXNlZFByb3BzfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VUYWJiYWJsZShDb21wb25lbnQsIG9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICB0YWJHcm91cDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgYXBwZW5kRWxlbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgcmVtb3ZlRWxlbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgZm9jdXNBZnRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgZm9jdXNCZWZvcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgYXV0b2ZvY3VzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgYXV0b2ZvY3VzOiBmYWxzZSxcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgc3VwZXIocHJvcHMpO1xuXG4gICAgICB0aGlzLnJvb3RSZWYgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYgPSBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgICAgIGlmIChvcHRpb25zLnJvb3RSZWZQcm9wKSB7XG4gICAgICAgIHRoaXMucm9vdFJlZiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICAgICAgdGhpcy5yb290UmVmUHJvcHMgPSB7W29wdGlvbnMucm9vdFJlZlByb3BdOiB0aGlzLnJvb3RSZWZ9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yb290UmVmID0gdGhpcy5lbGVtZW50UmVmO1xuICAgICAgICB0aGlzLnJvb3RSZWZQcm9wcyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5wYXNzQ29tbWFuZHMpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUHJvcHMgPSB7Y29tbWFuZHM6IHRoaXMucHJvcHMuY29tbWFuZHN9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUHJvcHMgPSB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucm9vdFJlZn0+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpmb2N1cy1uZXh0XCIgY2FsbGJhY2s9e3RoaXMuZm9jdXNOZXh0fSAvPlxuICAgICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Zm9jdXMtcHJldmlvdXNcIiBjYWxsYmFjaz17dGhpcy5mb2N1c1ByZXZpb3VzfSAvPlxuICAgICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgICAgPENvbXBvbmVudFxuICAgICAgICAgICAgcmVmPXt0aGlzLmVsZW1lbnRSZWYuc2V0dGVyfVxuICAgICAgICAgICAgdGFiSW5kZXg9ey0xfVxuICAgICAgICAgICAgey4uLnVudXNlZFByb3BzKHRoaXMucHJvcHMsIHRoaXMuY29uc3RydWN0b3IucHJvcFR5cGVzKX1cbiAgICAgICAgICAgIHsuLi50aGlzLnJvb3RSZWZQcm9wc31cbiAgICAgICAgICAgIHsuLi50aGlzLmNvbW1hbmRQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5tYXAoZWxlbWVudCA9PiB0aGlzLnByb3BzLnRhYkdyb3VwLmFwcGVuZEVsZW1lbnQoZWxlbWVudCwgdGhpcy5wcm9wcy5hdXRvZm9jdXMpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5tYXAoZWxlbWVudCA9PiB0aGlzLnByb3BzLnRhYkdyb3VwLnJlbW92ZUVsZW1lbnQoZWxlbWVudCkpO1xuICAgIH1cblxuICAgIGZvY3VzTmV4dCA9IGUgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm1hcChlbGVtZW50ID0+IHRoaXMucHJvcHMudGFiR3JvdXAuZm9jdXNBZnRlcihlbGVtZW50KSk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIGZvY3VzUHJldmlvdXMgPSBlID0+IHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5tYXAoZWxlbWVudCA9PiB0aGlzLnByb3BzLnRhYkdyb3VwLmZvY3VzQmVmb3JlKGVsZW1lbnQpKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgVGFiYmFibGVJbnB1dCA9IG1ha2VUYWJiYWJsZSgnaW5wdXQnKTtcblxuZXhwb3J0IGNvbnN0IFRhYmJhYmxlQnV0dG9uID0gbWFrZVRhYmJhYmxlKCdidXR0b24nKTtcblxuZXhwb3J0IGNvbnN0IFRhYmJhYmxlU3VtbWFyeSA9IG1ha2VUYWJiYWJsZSgnc3VtbWFyeScpO1xuXG5leHBvcnQgY29uc3QgVGFiYmFibGVUZXh0RWRpdG9yID0gbWFrZVRhYmJhYmxlKEF0b21UZXh0RWRpdG9yLCB7cm9vdFJlZlByb3A6ICdyZWZFbGVtZW50J30pO1xuXG4vLyBDdXN0b21FdmVudCBpcyBhIERPTSBwcmltaXRpdmUsIHdoaWNoIHY4IGNhbid0IGFjY2Vzc1xuLy8gc28gd2UncmUgZXNzZW50aWFsbHkgbGF6eSBsb2FkaW5nIHRvIGtlZXAgc25hcHNob3R0aW5nIGZyb20gYnJlYWtpbmcuXG5sZXQgRmFrZUtleURvd25FdmVudDtcblxuY2xhc3MgV3JhcFNlbGVjdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVmRWxlbWVudDogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZlNlbGVjdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItVGFiYmFibGVXcmFwcGVyXCIgcmVmPXt0aGlzLnByb3BzLnJlZkVsZW1lbnQuc2V0dGVyfT5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucHJvcHMucmVmRWxlbWVudH0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZG93blwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg0MCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtdXBcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVudGVyXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDEzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC10YWJcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoOSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtYmFja3NwYWNlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXBhZ2V1cFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzMyl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtcGFnZWRvd25cIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMzQpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVuZFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtaG9tZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNil9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZGVsZXRlXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDQ2KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1lc2NhcGVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMjcpfSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgcmVmPXt0aGlzLnJlZlNlbGVjdC5zZXR0ZXJ9XG4gICAgICAgICAgey4uLnVudXNlZFByb3BzKHRoaXMucHJvcHMsIHRoaXMuY29uc3RydWN0b3IucHJvcFR5cGVzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZTZWxlY3QubWFwKHNlbGVjdCA9PiBzZWxlY3QuZm9jdXMoKSk7XG4gIH1cblxuICBwcm94eUtleUNvZGUoa2V5Q29kZSkge1xuICAgIHJldHVybiBlID0+IHRoaXMucmVmU2VsZWN0Lm1hcChzZWxlY3QgPT4ge1xuICAgICAgaWYgKCFGYWtlS2V5RG93bkV2ZW50KSB7XG4gICAgICAgIEZha2VLZXlEb3duRXZlbnQgPSBjbGFzcyBleHRlbmRzIEN1c3RvbUV2ZW50IHtcbiAgICAgICAgICBjb25zdHJ1Y3RvcihrQ29kZSkge1xuICAgICAgICAgICAgc3VwZXIoJ2tleWRvd24nKTtcbiAgICAgICAgICAgIHRoaXMua2V5Q29kZSA9IGtDb2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmFrZUV2ZW50ID0gbmV3IEZha2VLZXlEb3duRXZlbnQoa2V5Q29kZSk7XG4gICAgICBzZWxlY3QuaGFuZGxlS2V5RG93bihmYWtlRXZlbnQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFRhYmJhYmxlU2VsZWN0ID0gbWFrZVRhYmJhYmxlKFdyYXBTZWxlY3QsIHtyb290UmVmUHJvcDogJ3JlZkVsZW1lbnQnLCBwYXNzQ29tbWFuZHM6IHRydWV9KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFaEMsU0FBU0EsWUFBWSxDQUFDQyxTQUFTLEVBQUVDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtFQUFBO0VBQ3BELGdCQUFPLGNBQWNDLGNBQUssQ0FBQ0YsU0FBUyxDQUFDO0lBaUJuQ0csV0FBVyxD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