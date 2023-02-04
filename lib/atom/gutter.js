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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      } catch (e) {
        // Gutter already destroyed. Disregard.
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
      return _react.default.createElement(BareGutter, _extends({}, this.props, {
        editorHolder: this.state.editorHolder
      }));
    }
    return _react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editorHolder => _react.default.createElement(BareGutter, _extends({}, this.props, {
      editorHolder: editorHolder
    })));
  }
}
exports.default = Gutter;
_defineProperty(Gutter, "propTypes", {
  editor: _propTypes.default.object
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJndXR0ZXJQcm9wcyIsIm5hbWUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwicHJpb3JpdHkiLCJudW1iZXIiLCJ2aXNpYmxlIiwiYm9vbCIsInR5cGUiLCJvbmVPZiIsImxhYmVsRm4iLCJmdW5jIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIkJhcmVHdXR0ZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJhdXRvYmluZCIsInN0YXRlIiwiZ3V0dGVyIiwic3ViIiwiRGlzcG9zYWJsZSIsImNvbXBvbmVudERpZE1vdW50IiwiZWRpdG9ySG9sZGVyIiwib2JzZXJ2ZSIsIm9ic2VydmVFZGl0b3IiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJkaXNwb3NlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkZXN0cm95IiwiZSIsInJlbmRlciIsImVkaXRvciIsInNldFN0YXRlIiwicHJldlN0YXRlIiwib3B0aW9ucyIsImV4dHJhY3RQcm9wcyIsImNsYXNzIiwiY2xhc3NOYW1lIiwiYWRkR3V0dGVyIiwiUmVmSG9sZGVyUHJvcFR5cGUiLCJHdXR0ZXIiLCJSZWZIb2xkZXIiLCJvbiIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsImVkaXRvckNoYW5nZWQiLCJtYXAiLCJnZXRPciIsInVuZGVmaW5lZCIsImlzRW1wdHkiLCJvYmplY3QiXSwic291cmNlcyI6WyJndXR0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0Rpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7YXV0b2JpbmQsIGV4dHJhY3RQcm9wc30gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7VGV4dEVkaXRvckNvbnRleHR9IGZyb20gJy4vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcblxuY29uc3QgZ3V0dGVyUHJvcHMgPSB7XG4gIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcHJpb3JpdHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHR5cGU6IFByb3BUeXBlcy5vbmVPZihbJ2xpbmUtbnVtYmVyJywgJ2RlY29yYXRlZCddKSxcbiAgbGFiZWxGbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTW91c2VEb3duOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZU1vdmU6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuY2xhc3MgQmFyZUd1dHRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZWRpdG9ySG9sZGVyOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAuLi5ndXR0ZXJQcm9wcyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICB0eXBlOiAnZGVjb3JhdGVkJyxcbiAgICBsYWJlbEZuOiAoKSA9PiB7fSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdvYnNlcnZlRWRpdG9yJywgJ2ZvcmNlVXBkYXRlJyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZ3V0dGVyOiBudWxsLFxuICAgIH07XG5cbiAgICB0aGlzLnN1YiA9IG5ldyBEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN1YiA9IHRoaXMucHJvcHMuZWRpdG9ySG9sZGVyLm9ic2VydmUodGhpcy5vYnNlcnZlRWRpdG9yKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5lZGl0b3JIb2xkZXIgIT09IHByZXZQcm9wcy5lZGl0b3JIb2xkZXIpIHtcbiAgICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuc3ViID0gdGhpcy5wcm9wcy5lZGl0b3JIb2xkZXIub2JzZXJ2ZSh0aGlzLm9ic2VydmVFZGl0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmd1dHRlciAhPT0gbnVsbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5zdGF0ZS5ndXR0ZXIuZGVzdHJveSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBHdXR0ZXIgYWxyZWFkeSBkZXN0cm95ZWQuIERpc3JlZ2FyZC5cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgb2JzZXJ2ZUVkaXRvcihlZGl0b3IpIHtcbiAgICB0aGlzLnNldFN0YXRlKChwcmV2U3RhdGUsIHByb3BzKSA9PiB7XG4gICAgICBpZiAocHJldlN0YXRlLmd1dHRlciAhPT0gbnVsbCkge1xuICAgICAgICBwcmV2U3RhdGUuZ3V0dGVyLmRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IGV4dHJhY3RQcm9wcyhwcm9wcywgZ3V0dGVyUHJvcHMpO1xuICAgICAgb3B0aW9ucy5jbGFzcyA9IHByb3BzLmNsYXNzTmFtZTtcbiAgICAgIHJldHVybiB7Z3V0dGVyOiBlZGl0b3IuYWRkR3V0dGVyKG9wdGlvbnMpfTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHdXR0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlZGl0b3JIb2xkZXI6IFJlZkhvbGRlci5vbih0aGlzLnByb3BzLmVkaXRvciksXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgY29uc3QgZWRpdG9yQ2hhbmdlZCA9IHN0YXRlLmVkaXRvckhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvciAhPT0gcHJvcHMuZWRpdG9yKS5nZXRPcihwcm9wcy5lZGl0b3IgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIGVkaXRvckNoYW5nZWQgPyBSZWZIb2xkZXIub24ocHJvcHMuZWRpdG9yKSA6IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmVkaXRvckhvbGRlci5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiA8QmFyZUd1dHRlciB7Li4udGhpcy5wcm9wc30gZWRpdG9ySG9sZGVyPXt0aGlzLnN0YXRlLmVkaXRvckhvbGRlcn0gLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUZXh0RWRpdG9yQ29udGV4dC5Db25zdW1lcj5cbiAgICAgICAge2VkaXRvckhvbGRlciA9PiAoXG4gICAgICAgICAgPEJhcmVHdXR0ZXIgey4uLnRoaXMucHJvcHN9IGVkaXRvckhvbGRlcj17ZWRpdG9ySG9sZGVyfSAvPlxuICAgICAgICApfVxuICAgICAgPC9UZXh0RWRpdG9yQ29udGV4dC5Db25zdW1lcj5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQTZDO0FBQUE7QUFB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