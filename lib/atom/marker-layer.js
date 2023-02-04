"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MarkerLayerContext = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _helpers = require("../helpers");
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _atomTextEditor = require("./atom-text-editor");
var _marker = require("./marker");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const markerLayerProps = {
  maintainHistory: _propTypes.default.bool,
  persistent: _propTypes.default.bool
};
const MarkerLayerContext = _react.default.createContext();
exports.MarkerLayerContext = MarkerLayerContext;
class BareMarkerLayer extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'createLayer');
    this.subs = new _eventKit.CompositeDisposable();
    this.layerSub = new _eventKit.Disposable();
    this.layerHolder = new _refHolder.default();
    this.state = {
      editorHolder: _refHolder.default.on(this.props.editor)
    };
    this.decorable = {
      holder: this.layerHolder,
      decorateMethod: 'decorateMarkerLayer'
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.editorHolder.map(e => e === props.editor).getOr(props.editor === undefined)) {
      return null;
    }
    return {
      editorHolder: _refHolder.default.on(props.editor)
    };
  }
  componentDidMount() {
    this.observeEditor();
  }
  render() {
    return _react.default.createElement(MarkerLayerContext.Provider, {
      value: this.layerHolder
    }, _react.default.createElement(_marker.DecorableContext.Provider, {
      value: this.decorable
    }, this.props.children));
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.editorHolder !== prevState.editorHolder) {
      this.observeEditor();
    }
  }
  componentWillUnmount() {
    this.subs.dispose();
  }
  observeEditor() {
    this.subs.dispose();
    this.subs = new _eventKit.CompositeDisposable();
    this.subs.add(this.state.editorHolder.observe(this.createLayer));
  }
  createLayer() {
    this.subs.remove(this.layerSub);
    this.layerSub.dispose();
    this.state.editorHolder.map(editor => {
      const options = (0, _helpers.extractProps)(this.props, markerLayerProps);
      let layer;
      if (this.props.external !== undefined) {
        layer = editor.getMarkerLayer(this.props.external.id);
        if (!layer) {
          return null;
        }
        if (layer !== this.props.external && layer.bufferMarkerLayer !== this.props.external) {
          // Oops, same layer ID on a different TextEditor
          return null;
        }
        this.layerSub = new _eventKit.Disposable();
      } else {
        layer = editor.addMarkerLayer(options);
        this.layerSub = new _eventKit.Disposable(() => {
          layer.destroy();
          this.props.handleLayer(undefined);
          this.props.handleID(undefined);
        });
      }
      this.layerHolder.setter(layer);
      this.props.handleLayer(layer);
      this.props.handleID(layer.id);
      this.subs.add(this.layerSub);
      return null;
    });
  }
}
_defineProperty(BareMarkerLayer, "propTypes", _objectSpread({}, markerLayerProps, {
  editor: _propTypes.default.object,
  external: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }),
  children: _propTypes.default.node,
  handleID: _propTypes.default.func,
  handleLayer: _propTypes.default.func
}));
_defineProperty(BareMarkerLayer, "defaultProps", {
  handleID: () => {},
  handleLayer: () => {}
});
class MarkerLayer extends _react.default.Component {
  render() {
    return _react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editor => _react.default.createElement(BareMarkerLayer, _extends({
      editor: editor
    }, this.props)));
  }
}
exports.default = MarkerLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYXJrZXJMYXllclByb3BzIiwibWFpbnRhaW5IaXN0b3J5IiwiUHJvcFR5cGVzIiwiYm9vbCIsInBlcnNpc3RlbnQiLCJNYXJrZXJMYXllckNvbnRleHQiLCJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJCYXJlTWFya2VyTGF5ZXIiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYXV0b2JpbmQiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImxheWVyU3ViIiwiRGlzcG9zYWJsZSIsImxheWVySG9sZGVyIiwiUmVmSG9sZGVyIiwic3RhdGUiLCJlZGl0b3JIb2xkZXIiLCJvbiIsImVkaXRvciIsImRlY29yYWJsZSIsImhvbGRlciIsImRlY29yYXRlTWV0aG9kIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwibWFwIiwiZSIsImdldE9yIiwidW5kZWZpbmVkIiwiY29tcG9uZW50RGlkTW91bnQiLCJvYnNlcnZlRWRpdG9yIiwicmVuZGVyIiwiY2hpbGRyZW4iLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJhZGQiLCJvYnNlcnZlIiwiY3JlYXRlTGF5ZXIiLCJyZW1vdmUiLCJvcHRpb25zIiwiZXh0cmFjdFByb3BzIiwibGF5ZXIiLCJleHRlcm5hbCIsImdldE1hcmtlckxheWVyIiwiaWQiLCJidWZmZXJNYXJrZXJMYXllciIsImFkZE1hcmtlckxheWVyIiwiZGVzdHJveSIsImhhbmRsZUxheWVyIiwiaGFuZGxlSUQiLCJzZXR0ZXIiLCJvYmplY3QiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJub2RlIiwiZnVuYyIsIk1hcmtlckxheWVyIl0sInNvdXJjZXMiOlsibWFya2VyLWxheWVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBleHRyYWN0UHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge1RleHRFZGl0b3JDb250ZXh0fSBmcm9tICcuL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IHtEZWNvcmFibGVDb250ZXh0fSBmcm9tICcuL21hcmtlcic7XG5cbmNvbnN0IG1hcmtlckxheWVyUHJvcHMgPSB7XG4gIG1haW50YWluSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wsXG4gIHBlcnNpc3RlbnQ6IFByb3BUeXBlcy5ib29sLFxufTtcblxuZXhwb3J0IGNvbnN0IE1hcmtlckxheWVyQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoKTtcblxuY2xhc3MgQmFyZU1hcmtlckxheWVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAuLi5tYXJrZXJMYXllclByb3BzLFxuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBleHRlcm5hbDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuICAgIGhhbmRsZUlEOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVMYXllcjogUHJvcFR5cGVzLmZ1bmMsXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoYW5kbGVJRDogKCkgPT4ge30sXG4gICAgaGFuZGxlTGF5ZXI6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBhdXRvYmluZCh0aGlzLCAnY3JlYXRlTGF5ZXInKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5sYXllclN1YiA9IG5ldyBEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLmxheWVySG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlZGl0b3JIb2xkZXI6IFJlZkhvbGRlci5vbih0aGlzLnByb3BzLmVkaXRvciksXG4gICAgfTtcblxuICAgIHRoaXMuZGVjb3JhYmxlID0ge1xuICAgICAgaG9sZGVyOiB0aGlzLmxheWVySG9sZGVyLFxuICAgICAgZGVjb3JhdGVNZXRob2Q6ICdkZWNvcmF0ZU1hcmtlckxheWVyJyxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuZWRpdG9ySG9sZGVyLm1hcChlID0+IGUgPT09IHByb3BzLmVkaXRvcikuZ2V0T3IocHJvcHMuZWRpdG9yID09PSB1bmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWRpdG9ySG9sZGVyOiBSZWZIb2xkZXIub24ocHJvcHMuZWRpdG9yKSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5vYnNlcnZlRWRpdG9yKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXJMYXllckNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3RoaXMubGF5ZXJIb2xkZXJ9PlxuICAgICAgICA8RGVjb3JhYmxlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGhpcy5kZWNvcmFibGV9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8L0RlY29yYWJsZUNvbnRleHQuUHJvdmlkZXI+XG4gICAgICA8L01hcmtlckxheWVyQ29udGV4dC5Qcm92aWRlcj5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdG9ySG9sZGVyICE9PSBwcmV2U3RhdGUuZWRpdG9ySG9sZGVyKSB7XG4gICAgICB0aGlzLm9ic2VydmVFZGl0b3IoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgb2JzZXJ2ZUVkaXRvcigpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLnN0YXRlLmVkaXRvckhvbGRlci5vYnNlcnZlKHRoaXMuY3JlYXRlTGF5ZXIpKTtcbiAgfVxuXG4gIGNyZWF0ZUxheWVyKCkge1xuICAgIHRoaXMuc3Vicy5yZW1vdmUodGhpcy5sYXllclN1Yik7XG4gICAgdGhpcy5sYXllclN1Yi5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLnN0YXRlLmVkaXRvckhvbGRlci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBleHRyYWN0UHJvcHModGhpcy5wcm9wcywgbWFya2VyTGF5ZXJQcm9wcyk7XG4gICAgICBsZXQgbGF5ZXI7XG4gICAgICBpZiAodGhpcy5wcm9wcy5leHRlcm5hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxheWVyID0gZWRpdG9yLmdldE1hcmtlckxheWVyKHRoaXMucHJvcHMuZXh0ZXJuYWwuaWQpO1xuICAgICAgICBpZiAoIWxheWVyKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVyICE9PSB0aGlzLnByb3BzLmV4dGVybmFsICYmIGxheWVyLmJ1ZmZlck1hcmtlckxheWVyICE9PSB0aGlzLnByb3BzLmV4dGVybmFsKSB7XG4gICAgICAgICAgLy8gT29wcywgc2FtZSBsYXllciBJRCBvbiBhIGRpZmZlcmVudCBUZXh0RWRpdG9yXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXllclN1YiA9IG5ldyBEaXNwb3NhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXllciA9IGVkaXRvci5hZGRNYXJrZXJMYXllcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5sYXllclN1YiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBsYXllci5kZXN0cm95KCk7XG4gICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVMYXllcih1bmRlZmluZWQpO1xuICAgICAgICAgIHRoaXMucHJvcHMuaGFuZGxlSUQodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmxheWVySG9sZGVyLnNldHRlcihsYXllcik7XG5cbiAgICAgIHRoaXMucHJvcHMuaGFuZGxlTGF5ZXIobGF5ZXIpO1xuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVJRChsYXllci5pZCk7XG5cbiAgICAgIHRoaXMuc3Vicy5hZGQodGhpcy5sYXllclN1Yik7XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VGV4dEVkaXRvckNvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtlZGl0b3IgPT4gPEJhcmVNYXJrZXJMYXllciBlZGl0b3I9e2VkaXRvcn0gey4uLnRoaXMucHJvcHN9IC8+fVxuICAgICAgPC9UZXh0RWRpdG9yQ29udGV4dC5Db25zdW1lcj5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQTBD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