"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _atomTextEditor = require("./atom-text-editor");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const gutterProps = {
  name: _propTypes.default.string.isRequired,
  priority: _propTypes.default.number.isRequired,
  visible: _propTypes.default.bool,
  type: _propTypes.default.oneOf(['line-number', 'decorated']),
  labelFn: _propTypes.default.func,
  onMouseDown: _propTypes.default.func,
  onMouseMove: _propTypes.default.func
};

class BareGutter extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'observeEditor', 'forceUpdate');
    this.state = {
      gutter: null
    };
    this.sub = new _eventKit.Disposable();
  }

  componentDidMount() {
    this.sub = this.props.editorHolder.observe(this.observeEditor);
  }

  componentDidUpdate(prevProps) {
    if (this.props.editorHolder !== prevProps.editorHolder) {
      this.sub.dispose();
      this.sub = this.props.editorHolder.observe(this.observeEditor);
    }
  }

  componentWillUnmount() {
    if (this.state.gutter !== null) {
      try {
        this.state.gutter.destroy();
      } catch (e) {// Gutter already destroyed. Disregard.
      }
    }

    this.sub.dispose();
  }

  render() {
    return null;
  }

  observeEditor(editor) {
    this.setState((prevState, props) => {
      if (prevState.gutter !== null) {
        prevState.gutter.destroy();
      }

      const options = (0, _helpers.extractProps)(props, gutterProps);
      options.class = props.className;
      return {
        gutter: editor.addGutter(options)
      };
    });
  }

}

_defineProperty(BareGutter, "propTypes", _objectSpread({
  editorHolder: _propTypes2.RefHolderPropType.isRequired,
  className: _propTypes.default.string
}, gutterProps));

_defineProperty(BareGutter, "defaultProps", {
  visible: true,
  type: 'decorated',
  labelFn: () => {}
});

class Gutter extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHolder: _refHolder.default.on(this.props.editor)
    };
  }

  static getDerivedStateFromProps(props, state) {
    const editorChanged = state.editorHolder.map(editor => editor !== props.editor).getOr(props.editor !== undefined);
    return editorChanged ? _refHolder.default.on(props.editor) : null;
  }

  render() {
    if (!this.state.editorHolder.isEmpty()) {
      return /*#__PURE__*/_react.default.createElement(BareGutter, _extends({}, this.props, {
        editorHolder: this.state.editorHolder
      }));
    }

    return /*#__PURE__*/_react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editorHolder => /*#__PURE__*/_react.default.createElement(BareGutter, _extends({}, this.props, {
      editorHolder: editorHolder
    })));
  }

}

exports.default = Gutter;

_defineProperty(Gutter, "propTypes", {
  editor: _propTypes.default.object
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL2d1dHRlci5qcyJdLCJuYW1lcyI6WyJndXR0ZXJQcm9wcyIsIm5hbWUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwicHJpb3JpdHkiLCJudW1iZXIiLCJ2aXNpYmxlIiwiYm9vbCIsInR5cGUiLCJvbmVPZiIsImxhYmVsRm4iLCJmdW5jIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIkJhcmVHdXR0ZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzdGF0ZSIsImd1dHRlciIsInN1YiIsIkRpc3Bvc2FibGUiLCJjb21wb25lbnREaWRNb3VudCIsImVkaXRvckhvbGRlciIsIm9ic2VydmUiLCJvYnNlcnZlRWRpdG9yIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiZGlzcG9zZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsImUiLCJyZW5kZXIiLCJlZGl0b3IiLCJzZXRTdGF0ZSIsInByZXZTdGF0ZSIsIm9wdGlvbnMiLCJjbGFzcyIsImNsYXNzTmFtZSIsImFkZEd1dHRlciIsIlJlZkhvbGRlclByb3BUeXBlIiwiR3V0dGVyIiwiUmVmSG9sZGVyIiwib24iLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJlZGl0b3JDaGFuZ2VkIiwibWFwIiwiZ2V0T3IiLCJ1bmRlZmluZWQiLCJpc0VtcHR5Iiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLFdBQVcsR0FBRztBQUNsQkMsRUFBQUEsSUFBSSxFQUFFQyxtQkFBVUMsTUFBVixDQUFpQkMsVUFETDtBQUVsQkMsRUFBQUEsUUFBUSxFQUFFSCxtQkFBVUksTUFBVixDQUFpQkYsVUFGVDtBQUdsQkcsRUFBQUEsT0FBTyxFQUFFTCxtQkFBVU0sSUFIRDtBQUlsQkMsRUFBQUEs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QUFRQyxLQUFSLEVBQWU7QUFDNUMsVUFBTTJCLGFBQWEsR0FBRzNCLEtBQUssQ0FBQ0ssWUFBTixDQUFtQnVCLEdBQW5CLENBQXVCYixNQUFNLElBQUlBLE1BQU0sS0FBS2hCLEtBQUssQ0FBQ2dCLE1BQWxELEVBQTBEYyxLQUExRCxDQUFnRTlCLEtBQUssQ0FBQ2dCLE1BQU4sS0FBaUJlLFNBQWpGLENBQXRCO0FBQ0EsV0FBT0gsYUFBYSxHQUFHSCxtQkFBVUMsRUFBVixDQUFhMUIsS0FBSyxDQUFDZ0IsTUFBbkIsQ0FBSCxHQUFnQyxJQUFwRDtBQUNEOztBQUVERCxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJLENBQUMsS0FBS2QsS0FBTCxDQUFXSyxZQUFYLENBQXdCMEIsT0FBeEIsRUFBTCxFQUF3QztBQUN0QywwQkFBTyw2QkFBQyxVQUFELGVBQWdCLEtBQUtoQyxLQUFyQjtBQUE0QixRQUFBLFlBQVksRUFBRSxLQUFLQyxLQUFMLENBQVdLO0FBQXJELFNBQVA7QUFDRDs7QUFFRCx3QkFDRSw2QkFBQyxpQ0FBRCxDQUFtQixRQUFuQixRQUNHQSxZQUFZLGlCQUNYLDZCQUFDLFVBQUQsZUFBZ0IsS0FBS04sS0FBckI7QUFBNEIsTUFBQSxZQUFZLEVBQUVNO0FBQTFDLE9BRkosQ0FERjtBQU9EOztBQTdCaUQ7Ozs7Z0JBQS9Ca0IsTSxlQUNBO0FBQ2pCUixFQUFBQSxNQUFNLEVBQUVqQyxtQkFBVWtEO0FBREQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBleHRyYWN0UHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge1RleHRFZGl0b3JDb250ZXh0fSBmcm9tICcuL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmNvbnN0IGd1dHRlclByb3BzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHByaW9yaXR5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHZpc2libGU6IFByb3BUeXBlcy5ib29sLFxuICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWydsaW5lLW51bWJlcicsICdkZWNvcmF0ZWQnXSksXG4gIGxhYmVsRm46IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlRG93bjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTW91c2VNb3ZlOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbmNsYXNzIEJhcmVHdXR0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVkaXRvckhvbGRlcjogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgLi4uZ3V0dGVyUHJvcHMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHZpc2libGU6IHRydWUsXG4gICAgdHlwZTogJ2RlY29yYXRlZCcsXG4gICAgbGFiZWxGbjogKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnb2JzZXJ2ZUVkaXRvcicsICdmb3JjZVVwZGF0ZScpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGd1dHRlcjogbnVsbCxcbiAgICB9O1xuXG4gICAgdGhpcy5zdWIgPSBuZXcgRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zdWIgPSB0aGlzLnByb3BzLmVkaXRvckhvbGRlci5vYnNlcnZlKHRoaXMub2JzZXJ2ZUVkaXRvcik7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZWRpdG9ySG9sZGVyICE9PSBwcmV2UHJvcHMuZWRpdG9ySG9sZGVyKSB7XG4gICAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLnN1YiA9IHRoaXMucHJvcHMuZWRpdG9ySG9sZGVyLm9ic2VydmUodGhpcy5vYnNlcnZlRWRpdG9yKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuc3RhdGUuZ3V0dGVyLmRlc3Ryb3koKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gR3V0dGVyIGFscmVhZHkgZGVzdHJveWVkLiBEaXNyZWdhcmQuXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG9ic2VydmVFZGl0b3IoZWRpdG9yKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSgocHJldlN0YXRlLCBwcm9wcykgPT4ge1xuICAgICAgaWYgKHByZXZTdGF0ZS5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgICAgcHJldlN0YXRlLmd1dHRlci5kZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBleHRyYWN0UHJvcHMocHJvcHMsIGd1dHRlclByb3BzKTtcbiAgICAgIG9wdGlvbnMuY2xhc3MgPSBwcm9wcy5jbGFzc05hbWU7XG4gICAgICByZXR1cm4ge2d1dHRlcjogZWRpdG9yLmFkZEd1dHRlcihvcHRpb25zKX07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3V0dGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlZGl0b3I6IFByb3BUeXBlcy5vYmplY3QsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZWRpdG9ySG9sZGVyOiBSZWZIb2xkZXIub24odGhpcy5wcm9wcy5lZGl0b3IpLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGNvbnN0IGVkaXRvckNoYW5nZWQgPSBzdGF0ZS5lZGl0b3JIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3IgIT09IHByb3BzLmVkaXRvcikuZ2V0T3IocHJvcHMuZWRpdG9yICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBlZGl0b3JDaGFuZ2VkID8gUmVmSG9sZGVyLm9uKHByb3BzLmVkaXRvcikgOiBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0b3JIb2xkZXIuaXNFbXB0eSgpKSB7XG4gICAgICByZXR1cm4gPEJhcmVHdXR0ZXIgey4uLnRoaXMucHJvcHN9IGVkaXRvckhvbGRlcj17dGhpcy5zdGF0ZS5lZGl0b3JIb2xkZXJ9IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8VGV4dEVkaXRvckNvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtlZGl0b3JIb2xkZXIgPT4gKFxuICAgICAgICAgIDxCYXJlR3V0dGVyIHsuLi50aGlzLnByb3BzfSBlZGl0b3JIb2xkZXI9e2VkaXRvckhvbGRlcn0gLz5cbiAgICAgICAgKX1cbiAgICAgIDwvVGV4dEVkaXRvckNvbnRleHQuQ29uc3VtZXI+XG4gICAgKTtcbiAgfVxufVxuIl19