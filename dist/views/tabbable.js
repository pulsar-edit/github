"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabbableTextEditor = exports.TabbableSummary = exports.TabbableSelect = exports.TabbableInput = exports.TabbableButton = void 0;
exports.makeTabbable = makeTabbable;

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
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_commands.default, {
        registry: this.props.commands,
        target: this.rootRef
      }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
        command: "core:focus-next",
        callback: this.focusNext
      }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
        command: "core:focus-previous",
        callback: this.focusPrevious
      })), /*#__PURE__*/_react.default.createElement(Component, _extends({
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-TabbableWrapper",
      ref: this.props.refElement.setter
    }, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.props.refElement
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-down",
      callback: this.proxyKeyCode(40)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-up",
      callback: this.proxyKeyCode(38)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-enter",
      callback: this.proxyKeyCode(13)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-tab",
      callback: this.proxyKeyCode(9)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-backspace",
      callback: this.proxyKeyCode(8)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-pageup",
      callback: this.proxyKeyCode(33)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-pagedown",
      callback: this.proxyKeyCode(34)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-end",
      callback: this.proxyKeyCode(35)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-home",
      callback: this.proxyKeyCode(36)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-delete",
      callback: this.proxyKeyCode(46)
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:selectbox-escape",
      callback: this.proxyKeyCode(27)
    })), /*#__PURE__*/_react.default.createElement(_reactSelect.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy90YWJiYWJsZS5qcyJdLCJuYW1lcyI6WyJtYWtlVGFiYmFibGUiLCJDb21wb25lbnQiLCJvcHRpb25zIiwiUmVhY3QiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZSIsImVsZW1lbnRSZWYiLCJtYXAiLCJlbGVtZW50IiwidGFiR3JvdXAiLCJmb2N1c0FmdGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiZm9jdXNCZWZvcmUiLCJyb290UmVmIiwiUmVmSG9sZGVyIiwicm9vdFJlZlByb3AiLCJyb290UmVmUHJvcHMiLCJwYXNzQ29tbWFuZHMiLCJjb21tYW5kUHJvcHMiLCJjb21tYW5kcyIsInJlbmRlciIsImZvY3VzTmV4dCIsImZvY3VzUHJldmlvdXMiLCJzZXR0ZXIiLCJwcm9wVHlwZXMiLCJjb21wb25lbnREaWRNb3VudCIsImFwcGVuZEVsZW1lbnQiLCJhdXRvZm9jdXMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUVsZW1lbnQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYm9vbCIsIm9iamVjdCIsIlRhYmJhYmxlSW5wdXQiLCJUYWJiYWJsZUJ1dHRvbiIsIlRhYmJhYmxlU3VtbWFyeSIsIlRhYmJhYmxlVGV4dEVkaXRvciIsIkF0b21UZXh0RWRpdG9yIiwiRmFrZUtleURvd25FdmVudCIsIldyYXBTZWxlY3QiLCJyZWZTZWxlY3QiLCJyZWZFbGVtZW50IiwicHJveHlLZXlDb2RlIiwiZm9jdXMiLCJzZWxlY3QiLCJrZXlDb2RlIiwiQ3VzdG9tRXZlbnQiLCJrQ29kZSIsImZha2VFdmVudCIsImhhbmRsZUtleURvd24iLCJSZWZIb2xkZXJQcm9wVHlwZSIsIlRhYmJhYmxlU2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFTyxTQUFTQSxZQUFULENBQXNCQyxTQUF0QixFQUFpQ0MsT0FBTyxHQUFHLEVBQTNDLEVBQStDO0FBQUE7O0FBQ3BELGtCQUFPLGNBQWNDLGVBQU1GLFNBQXBCLENBQThCO0FBaUJuQ0csSUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsWUFBTUEsS0FBTjs7QUFEaUIseUNBK0NQQyxDQUFDLElBQUk7QUFDZixhQUFLQyxVQUFMLENBQWdCQyxHQUFoQixDQUFvQkMsT0FBTyxJQUFJLEtBQUtKLEtBQUwsQ0FBV0ssUUFBWCxDQUFvQkMsVUFBcEIsQ0FBK0JGLE9BQS9CLENBQS9CO0FBQ0FILFFBQUFBLENBQUMsQ0FBQ00sZUFBRjtBQUNELE9BbERrQjs7QUFBQSw2Q0FvREhOLENBQUMsSUFBSTtBQUNuQixhQUFLQyxVQUFMLENBQWdCQyxHQUFoQixDQUFvQkMsT0FBTyxJQUFJLEtBQUtKLEtBQUwsQ0FBV0ssUUFBWCxDQUFvQkcsV0FBcEIsQ0FBZ0NKLE9BQWhDLENBQS9CO0FBQ0FILFFBQUFBLENBQUMsQ0FBQ00sZUFBRjtBQUNELE9BdkRrQjs7QUFHakIsV0FBS0UsT0FBTCxHQUFlLElBQUlDLGtCQUFKLEVBQWY7QUFDQSxXQUFLUixVQUFMLEdBQWtCLElBQUlRLGtCQUFKLEVBQWxCOztBQUVBLFVBQUliLE9BQU8sQ0FBQ2MsV0FBWixFQUF5QjtBQUN2QixhQUFLRixPQUFMLEdBQWUsSUFBSUMsa0JBQUosRUFBZjtBQUNBLGFBQUtFLFlBQUwsR0FBb0I7QUFBQyxXQUFDZixPQUFPLENBQUNjLFdBQVQsR0FBdUIsS0FBS0Y7QUFBN0IsU0FBcEI7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLQSxPQUFMLEdBQWUsS0FBS1AsVUFBcEI7QUFDQSxhQUFLVSxZQUFMLEdBQW9CLEVBQXBCO0FBQ0Q7O0FBRUQsVUFBSWYsT0FBTyxDQUFDZ0IsWUFBWixFQUEwQjtBQUN4QixhQUFLQyxZQUFMLEdBQW9CO0FBQUNDLFVBQUFBLFFBQVEsRUFBRSxLQUFLZixLQUFMLENBQVdlO0FBQXRCLFNBQXBCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS0QsWUFBTCxHQUFvQixFQUFwQjtBQUNEO0FBQ0Y7O0FBRURFLElBQUFBLE1BQU0sR0FBRztBQUNQLDBCQUNFLDZCQUFDLGVBQUQscUJBQ0UsNkJBQUMsaUJBQUQ7QUFBVSxRQUFBLFFBQVEsRUFBRSxLQUFLaEIsS0FBTCxDQUFXZSxRQUEvQjtBQUF5QyxRQUFBLE1BQU0sRUFBRSxLQUFLTjtBQUF0RCxzQkFDRSw2QkFBQyxpQkFBRDtBQUFTLFFBQUEsT0FBTyxFQUFDLGlCQUFqQjtBQUFtQyxRQUFBLFFBQVEsRUFBRSxLQUFLUTtBQUFsRCxRQURGLGVBRUUsNkJBQUMsaUJBQUQ7QUFBUyxRQUFBLE9BQU8sRUFBQyxxQkFBakI7QUFBdUMsUUFBQSxRQUFRLEVBQUUsS0FBS0M7QUFBdEQsUUFGRixDQURGLGVBS0UsNkJBQUMsU0FBRDtBQUNFLFFBQUEsR0FBRyxFQUFFLEtBQUtoQixVQUFMLENBQWdCaUIsTUFEdkI7QUFFRSxRQUFBLFFBQVEsRUFBRSxDQUFDO0FBRmIsU0FHTSwwQkFBWSxLQUFLbkIsS0FBakIsRUFBd0IsS0FBS0QsV0FBTCxDQUFpQnFCLFNBQXpDLENBSE4sRUFJTSxLQUFLUixZQUpYLEVBS00sS0FBS0UsWUFMWCxFQUxGLENBREY7QUFlRDs7QUFFRE8sSUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsV0FBS25CLFVBQUwsQ0FBZ0JDLEdBQWhCLENBQW9CQyxPQUFPLElBQUksS0FBS0osS0FBTCxDQUFXSyxRQUFYLENBQW9CaUIsYUFBcEIsQ0FBa0NsQixPQUFsQyxFQUEyQyxLQUFLSixLQUFMLENBQVd1QixTQUF0RCxDQUEvQjtBQUNEOztBQUVEQyxJQUFBQSxvQkFBb0IsR0FBRztBQUNyQixXQUFLdEIsVUFBTCxDQUFnQkMsR0FBaEIsQ0FBb0JDLE9BQU8sSUFBSSxLQUFLSixLQUFMLENBQVdLLFFBQVgsQ0FBb0JvQixhQUFwQixDQUFrQ3JCLE9BQWxDLENBQS9CO0FBQ0Q7O0FBOURrQyxHQUFyQyx1Q0FDcUI7QUFDakJDLElBQUFBLFFBQVEsRUFBRXFCLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3hCTCxNQUFBQSxhQUFhLEVBQUVJLG1CQUFVRSxJQUFWLENBQWVDLFVBRE47QUFFeEJKLE1BQUFBLGFBQWEsRUFBRUMsbUJBQVVFLElBQVYsQ0FBZUMsVUFGTjtBQUd4QnZCLE1BQUFBLFVBQVUsRUFBRW9CLG1CQUFVRSxJQUFWLENBQWVDLFVBSEg7QUFJeEJyQixNQUFBQSxXQUFXLEVBQUVrQixtQkFBVUUsSUFBVixDQUFlQztBQUpKLEtBQWhCLEVBS1BBLFVBTmM7QUFPakJOLElBQUFBLFNBQVMsRUFBRUcsbUJBQVVJLElBUEo7QUFTakJmLElBQUFBLFFBQVEsRUFBRVcsbUJBQVVLLE1BQVYsQ0FBaUJGO0FBVFYsR0FEckIsMkNBYXdCO0FBQ3BCTixJQUFBQSxTQUFTLEVBQUU7QUFEUyxHQWJ4QjtBQTBFRDs7QUFFTSxNQUFNUyxhQUFhLEdBQUdyQyxZQUFZLENBQUMsT0FBRCxDQUFsQzs7QUFFQSxNQUFNc0MsY0FBYyxHQUFHdEMsWUFBWSxDQUFDLFFBQUQsQ0FBbkM7O0FBRUEsTUFBTXVDLGVBQWUsR0FBR3ZDLFlBQVksQ0FBQyxTQUFELENBQXBDOztBQUVBLE1BQU13QyxrQkFBa0IsR0FBR3hDLFlBQVksQ0FBQ3lDLHVCQUFELEVBQWlCO0FBQUN6QixFQUFBQSxXQUFXLEVBQUU7QUFBZCxDQUFqQixDQUF2QyxDLENBRVA7QUFDQTs7O0FBQ0EsSUFBSTBCLGdCQUFKOztBQUVBLE1BQU1DLFVBQU4sU0FBeUJ4QyxlQUFNRixTQUEvQixDQUF5QztBQU12Q0csRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUVBLFNBQUt1QyxTQUFMLEdBQWlCLElBQUk3QixrQkFBSixFQUFqQjtBQUNEOztBQUVETSxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDLHdCQUFmO0FBQXdDLE1BQUEsR0FBRyxFQUFFLEtBQUtoQixLQUFMLENBQVd3QyxVQUFYLENBQXNCckI7QUFBbkUsb0JBQ0UsNkJBQUMsaUJBQUQ7QUFBVSxNQUFBLFFBQVEsRUFBRSxLQUFLbkIsS0FBTCxDQUFXZSxRQUEvQjtBQUF5QyxNQUFBLE1BQU0sRUFBRSxLQUFLZixLQUFMLENBQVd3QztBQUE1RCxvQkFDRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHVCQUFqQjtBQUF5QyxNQUFBLFFBQVEsRUFBRSxLQUFLQyxZQUFMLENBQWtCLEVBQWxCO0FBQW5ELE1BREYsZUFFRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHFCQUFqQjtBQUF1QyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQWpELE1BRkYsZUFHRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHdCQUFqQjtBQUEwQyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQXBELE1BSEYsZUFJRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHNCQUFqQjtBQUF3QyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLENBQWxCO0FBQWxELE1BSkYsZUFLRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLDRCQUFqQjtBQUE4QyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLENBQWxCO0FBQXhELE1BTEYsZUFNRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHlCQUFqQjtBQUEyQyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQXJELE1BTkYsZUFPRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLDJCQUFqQjtBQUE2QyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQXZELE1BUEYsZUFRRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHNCQUFqQjtBQUF3QyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQWxELE1BUkYsZUFTRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHVCQUFqQjtBQUF5QyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQW5ELE1BVEYsZUFVRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHlCQUFqQjtBQUEyQyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQXJELE1BVkYsZUFXRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHlCQUFqQjtBQUEyQyxNQUFBLFFBQVEsRUFBRSxLQUFLQSxZQUFMLENBQWtCLEVBQWxCO0FBQXJELE1BWEYsQ0FERixlQWNFLDZCQUFDLG9CQUFEO0FBQ0UsTUFBQSxHQUFHLEVBQUUsS0FBS0YsU0FBTCxDQUFlcEI7QUFEdEIsT0FFTSwwQkFBWSxLQUFLbkIsS0FBakIsRUFBd0IsS0FBS0QsV0FBTCxDQUFpQnFCLFNBQXpDLENBRk4sRUFkRixDQURGO0FBcUJEOztBQUVEc0IsRUFBQUEsS0FBSyxHQUFHO0FBQ04sV0FBTyxLQUFLSCxTQUFMLENBQWVwQyxHQUFmLENBQW1Cd0MsTUFBTSxJQUFJQSxNQUFNLENBQUNELEtBQVAsRUFBN0IsQ0FBUDtBQUNEOztBQUVERCxFQUFBQSxZQUFZLENBQUNHLE9BQUQsRUFBVTtBQUNwQixXQUFPM0MsQ0FBQyxJQUFJLEtBQUtzQyxTQUFMLENBQWVwQyxHQUFmLENBQW1Cd0MsTUFBTSxJQUFJO0FBQ3ZDLFVBQUksQ0FBQ04sZ0JBQUwsRUFBdUI7QUFDckJBLFFBQUFBLGdCQUFnQixHQUFHLGNBQWNRLFdBQWQsQ0FBMEI7QUFDM0M5QyxVQUFBQSxXQUFXLENBQUMrQyxLQUFELEVBQVE7QUFDakIsa0JBQU0sU0FBTjtBQUNBLGlCQUFLRixPQUFMLEdBQWVFLEtBQWY7QUFDRDs7QUFKMEMsU0FBN0M7QUFNRDs7QUFFRCxZQUFNQyxTQUFTLEdBQUcsSUFBSVYsZ0JBQUosQ0FBcUJPLE9BQXJCLENBQWxCO0FBQ0FELE1BQUFBLE1BQU0sQ0FBQ0ssYUFBUCxDQUFxQkQsU0FBckI7QUFDQSxhQUFPLElBQVA7QUFDRCxLQWJXLENBQVo7QUFjRDs7QUF2RHNDOztnQkFBbkNULFUsZUFDZTtBQUNqQkUsRUFBQUEsVUFBVSxFQUFFUyw4QkFBa0JwQixVQURiO0FBRWpCZCxFQUFBQSxRQUFRLEVBQUVXLG1CQUFVSyxNQUFWLENBQWlCRjtBQUZWLEM7O0FBeURkLE1BQU1xQixjQUFjLEdBQUd2RCxZQUFZLENBQUMyQyxVQUFELEVBQWE7QUFBQzNCLEVBQUFBLFdBQVcsRUFBRSxZQUFkO0FBQTRCRSxFQUFBQSxZQUFZLEVBQUU7QUFBMUMsQ0FBYixDQUFuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICdyZWFjdC1zZWxlY3QnO1xuXG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7dW51c2VkUHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVRhYmJhYmxlKENvbXBvbmVudCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIHRhYkdyb3VwOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBhcHBlbmRFbGVtZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgICByZW1vdmVFbGVtZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgICBmb2N1c0FmdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgICBmb2N1c0JlZm9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICBhdXRvZm9jdXM6IFByb3BUeXBlcy5ib29sLFxuXG4gICAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIH1cblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBhdXRvZm9jdXM6IGZhbHNlLFxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgIHRoaXMucm9vdFJlZiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICAgIHRoaXMuZWxlbWVudFJlZiA9IG5ldyBSZWZIb2xkZXIoKTtcblxuICAgICAgaWYgKG9wdGlvbnMucm9vdFJlZlByb3ApIHtcbiAgICAgICAgdGhpcy5yb290UmVmID0gbmV3IFJlZkhvbGRlcigpO1xuICAgICAgICB0aGlzLnJvb3RSZWZQcm9wcyA9IHtbb3B0aW9ucy5yb290UmVmUHJvcF06IHRoaXMucm9vdFJlZn07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJvb3RSZWYgPSB0aGlzLmVsZW1lbnRSZWY7XG4gICAgICAgIHRoaXMucm9vdFJlZlByb3BzID0ge307XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnBhc3NDb21tYW5kcykge1xuICAgICAgICB0aGlzLmNvbW1hbmRQcm9wcyA9IHtjb21tYW5kczogdGhpcy5wcm9wcy5jb21tYW5kc307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbW1hbmRQcm9wcyA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yb290UmVmfT5cbiAgICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmZvY3VzLW5leHRcIiBjYWxsYmFjaz17dGhpcy5mb2N1c05leHR9IC8+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpmb2N1cy1wcmV2aW91c1wiIGNhbGxiYWNrPXt0aGlzLmZvY3VzUHJldmlvdXN9IC8+XG4gICAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgICA8Q29tcG9uZW50XG4gICAgICAgICAgICByZWY9e3RoaXMuZWxlbWVudFJlZi5zZXR0ZXJ9XG4gICAgICAgICAgICB0YWJJbmRleD17LTF9XG4gICAgICAgICAgICB7Li4udW51c2VkUHJvcHModGhpcy5wcm9wcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm9wVHlwZXMpfVxuICAgICAgICAgICAgey4uLnRoaXMucm9vdFJlZlByb3BzfVxuICAgICAgICAgICAgey4uLnRoaXMuY29tbWFuZFByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm1hcChlbGVtZW50ID0+IHRoaXMucHJvcHMudGFiR3JvdXAuYXBwZW5kRWxlbWVudChlbGVtZW50LCB0aGlzLnByb3BzLmF1dG9mb2N1cykpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm1hcChlbGVtZW50ID0+IHRoaXMucHJvcHMudGFiR3JvdXAucmVtb3ZlRWxlbWVudChlbGVtZW50KSk7XG4gICAgfVxuXG4gICAgZm9jdXNOZXh0ID0gZSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubWFwKGVsZW1lbnQgPT4gdGhpcy5wcm9wcy50YWJHcm91cC5mb2N1c0FmdGVyKGVsZW1lbnQpKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgZm9jdXNQcmV2aW91cyA9IGUgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm1hcChlbGVtZW50ID0+IHRoaXMucHJvcHMudGFiR3JvdXAuZm9jdXNCZWZvcmUoZWxlbWVudCkpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBUYWJiYWJsZUlucHV0ID0gbWFrZVRhYmJhYmxlKCdpbnB1dCcpO1xuXG5leHBvcnQgY29uc3QgVGFiYmFibGVCdXR0b24gPSBtYWtlVGFiYmFibGUoJ2J1dHRvbicpO1xuXG5leHBvcnQgY29uc3QgVGFiYmFibGVTdW1tYXJ5ID0gbWFrZVRhYmJhYmxlKCdzdW1tYXJ5Jyk7XG5cbmV4cG9ydCBjb25zdCBUYWJiYWJsZVRleHRFZGl0b3IgPSBtYWtlVGFiYmFibGUoQXRvbVRleHRFZGl0b3IsIHtyb290UmVmUHJvcDogJ3JlZkVsZW1lbnQnfSk7XG5cbi8vIEN1c3RvbUV2ZW50IGlzIGEgRE9NIHByaW1pdGl2ZSwgd2hpY2ggdjggY2FuJ3QgYWNjZXNzXG4vLyBzbyB3ZSdyZSBlc3NlbnRpYWxseSBsYXp5IGxvYWRpbmcgdG8ga2VlcCBzbmFwc2hvdHRpbmcgZnJvbSBicmVha2luZy5cbmxldCBGYWtlS2V5RG93bkV2ZW50O1xuXG5jbGFzcyBXcmFwU2VsZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZWZFbGVtZW50OiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmU2VsZWN0ID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1UYWJiYWJsZVdyYXBwZXJcIiByZWY9e3RoaXMucHJvcHMucmVmRWxlbWVudC5zZXR0ZXJ9PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5wcm9wcy5yZWZFbGVtZW50fT5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1kb3duXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDQwKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC11cFwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzOCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZW50ZXJcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoMTMpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LXRhYlwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSg5KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1iYWNrc3BhY2VcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoOCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtcGFnZXVwXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDMzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1wYWdlZG93blwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgzNCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3Rib3gtZW5kXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM1KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1ob21lXCIgY2FsbGJhY2s9e3RoaXMucHJveHlLZXlDb2RlKDM2KX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdGJveC1kZWxldGVcIiBjYWxsYmFjaz17dGhpcy5wcm94eUtleUNvZGUoNDYpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0Ym94LWVzY2FwZVwiIGNhbGxiYWNrPXt0aGlzLnByb3h5S2V5Q29kZSgyNyl9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxTZWxlY3RcbiAgICAgICAgICByZWY9e3RoaXMucmVmU2VsZWN0LnNldHRlcn1cbiAgICAgICAgICB7Li4udW51c2VkUHJvcHModGhpcy5wcm9wcywgdGhpcy5jb25zdHJ1Y3Rvci5wcm9wVHlwZXMpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlNlbGVjdC5tYXAoc2VsZWN0ID0+IHNlbGVjdC5mb2N1cygpKTtcbiAgfVxuXG4gIHByb3h5S2V5Q29kZShrZXlDb2RlKSB7XG4gICAgcmV0dXJuIGUgPT4gdGhpcy5yZWZTZWxlY3QubWFwKHNlbGVjdCA9PiB7XG4gICAgICBpZiAoIUZha2VLZXlEb3duRXZlbnQpIHtcbiAgICAgICAgRmFrZUtleURvd25FdmVudCA9IGNsYXNzIGV4dGVuZHMgQ3VzdG9tRXZlbnQge1xuICAgICAgICAgIGNvbnN0cnVjdG9yKGtDb2RlKSB7XG4gICAgICAgICAgICBzdXBlcigna2V5ZG93bicpO1xuICAgICAgICAgICAgdGhpcy5rZXlDb2RlID0ga0NvZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmYWtlRXZlbnQgPSBuZXcgRmFrZUtleURvd25FdmVudChrZXlDb2RlKTtcbiAgICAgIHNlbGVjdC5oYW5kbGVLZXlEb3duKGZha2VFdmVudCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVGFiYmFibGVTZWxlY3QgPSBtYWtlVGFiYmFibGUoV3JhcFNlbGVjdCwge3Jvb3RSZWZQcm9wOiAncmVmRWxlbWVudCcsIHBhc3NDb21tYW5kczogdHJ1ZX0pO1xuIl19