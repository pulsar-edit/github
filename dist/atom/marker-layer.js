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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL21hcmtlci1sYXllci5qcyJdLCJuYW1lcyI6WyJtYXJrZXJMYXllclByb3BzIiwibWFpbnRhaW5IaXN0b3J5IiwiUHJvcFR5cGVzIiwiYm9vbCIsInBlcnNpc3RlbnQiLCJNYXJrZXJMYXllckNvbnRleHQiLCJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJCYXJlTWFya2VyTGF5ZXIiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJsYXllclN1YiIsIkRpc3Bvc2FibGUiLCJsYXllckhvbGRlciIsIlJlZkhvbGRlciIsInN0YXRlIiwiZWRpdG9ySG9sZGVyIiwib24iLCJlZGl0b3IiLCJkZWNvcmFibGUiLCJob2xkZXIiLCJkZWNvcmF0ZU1ldGhvZCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsIm1hcCIsImUiLCJnZXRPciIsInVuZGVmaW5lZCIsImNvbXBvbmVudERpZE1vdW50Iiwib2JzZXJ2ZUVkaXRvciIsInJlbmRlciIsImNoaWxkcmVuIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiYWRkIiwib2JzZXJ2ZSIsImNyZWF0ZUxheWVyIiwicmVtb3ZlIiwib3B0aW9ucyIsImxheWVyIiwiZXh0ZXJuYWwiLCJnZXRNYXJrZXJMYXllciIsImlkIiwiYnVmZmVyTWFya2VyTGF5ZXIiLCJhZGRNYXJrZXJMYXllciIsImRlc3Ryb3kiLCJoYW5kbGVMYXllciIsImhhbmRsZUlEIiwic2V0dGVyIiwib2JqZWN0Iiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibm9kZSIsImZ1bmMiLCJNYXJrZXJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxn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RUFBRTdDLG1CQUFVc0QsTUFBVixDQUFpQkM7QUFERyxHQUFoQixDO0FBR1Z4QixFQUFBQSxRQUFRLEVBQUUvQixtQkFBVXdELEk7QUFDcEJOLEVBQUFBLFFBQVEsRUFBRWxELG1CQUFVeUQsSTtBQUNwQlIsRUFBQUEsV0FBVyxFQUFFakQsbUJBQVV5RDs7O2dCQVRyQm5ELGUsa0JBWWtCO0FBQ3BCNEMsRUFBQUEsUUFBUSxFQUFFLE1BQU0sQ0FBRSxDQURFO0FBRXBCRCxFQUFBQSxXQUFXLEVBQUUsTUFBTSxDQUFFO0FBRkQsQzs7QUFxR1QsTUFBTVMsV0FBTixTQUEwQnRELGVBQU1HLFNBQWhDLENBQTBDO0FBQ3ZEdUIsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FDRSw2QkFBQyxpQ0FBRCxDQUFtQixRQUFuQixRQUNHWCxNQUFNLElBQUksNkJBQUMsZUFBRDtBQUFpQixNQUFBLE1BQU0sRUFBRUE7QUFBekIsT0FBcUMsS0FBS1YsS0FBMUMsRUFEYixDQURGO0FBS0Q7O0FBUHNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7YXV0b2JpbmQsIGV4dHJhY3RQcm9wc30gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7VGV4dEVkaXRvckNvbnRleHR9IGZyb20gJy4vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQge0RlY29yYWJsZUNvbnRleHR9IGZyb20gJy4vbWFya2VyJztcblxuY29uc3QgbWFya2VyTGF5ZXJQcm9wcyA9IHtcbiAgbWFpbnRhaW5IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbCxcbiAgcGVyc2lzdGVudDogUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5leHBvcnQgY29uc3QgTWFya2VyTGF5ZXJDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCgpO1xuXG5jbGFzcyBCYXJlTWFya2VyTGF5ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC4uLm1hcmtlckxheWVyUHJvcHMsXG4gICAgZWRpdG9yOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGV4dGVybmFsOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG4gICAgaGFuZGxlSUQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGhhbmRsZUxheWVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhhbmRsZUlEOiAoKSA9PiB7fSxcbiAgICBoYW5kbGVMYXllcjogKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIGF1dG9iaW5kKHRoaXMsICdjcmVhdGVMYXllcicpO1xuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmxheWVyU3ViID0gbmV3IERpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMubGF5ZXJIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVkaXRvckhvbGRlcjogUmVmSG9sZGVyLm9uKHRoaXMucHJvcHMuZWRpdG9yKSxcbiAgICB9O1xuXG4gICAgdGhpcy5kZWNvcmFibGUgPSB7XG4gICAgICBob2xkZXI6IHRoaXMubGF5ZXJIb2xkZXIsXG4gICAgICBkZWNvcmF0ZU1ldGhvZDogJ2RlY29yYXRlTWFya2VyTGF5ZXInLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5lZGl0b3JIb2xkZXIubWFwKGUgPT4gZSA9PT0gcHJvcHMuZWRpdG9yKS5nZXRPcihwcm9wcy5lZGl0b3IgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0b3JIb2xkZXI6IFJlZkhvbGRlci5vbihwcm9wcy5lZGl0b3IpLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm9ic2VydmVFZGl0b3IoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlckxheWVyQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGhpcy5sYXllckhvbGRlcn0+XG4gICAgICAgIDxEZWNvcmFibGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt0aGlzLmRlY29yYWJsZX0+XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDwvRGVjb3JhYmxlQ29udGV4dC5Qcm92aWRlcj5cbiAgICAgIDwvTWFya2VyTGF5ZXJDb250ZXh0LlByb3ZpZGVyPlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0b3JIb2xkZXIgIT09IHByZXZTdGF0ZS5lZGl0b3JIb2xkZXIpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZUVkaXRvcigpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBvYnNlcnZlRWRpdG9yKCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnMuYWRkKHRoaXMuc3RhdGUuZWRpdG9ySG9sZGVyLm9ic2VydmUodGhpcy5jcmVhdGVMYXllcikpO1xuICB9XG5cbiAgY3JlYXRlTGF5ZXIoKSB7XG4gICAgdGhpcy5zdWJzLnJlbW92ZSh0aGlzLmxheWVyU3ViKTtcbiAgICB0aGlzLmxheWVyU3ViLmRpc3Bvc2UoKTtcblxuICAgIHRoaXMuc3RhdGUuZWRpdG9ySG9sZGVyLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGV4dHJhY3RQcm9wcyh0aGlzLnByb3BzLCBtYXJrZXJMYXllclByb3BzKTtcbiAgICAgIGxldCBsYXllcjtcbiAgICAgIGlmICh0aGlzLnByb3BzLmV4dGVybmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGF5ZXIgPSBlZGl0b3IuZ2V0TWFya2VyTGF5ZXIodGhpcy5wcm9wcy5leHRlcm5hbC5pZCk7XG4gICAgICAgIGlmICghbGF5ZXIpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGF5ZXIgIT09IHRoaXMucHJvcHMuZXh0ZXJuYWwgJiYgbGF5ZXIuYnVmZmVyTWFya2VyTGF5ZXIgIT09IHRoaXMucHJvcHMuZXh0ZXJuYWwpIHtcbiAgICAgICAgICAvLyBPb3BzLCBzYW1lIGxheWVyIElEIG9uIGEgZGlmZmVyZW50IFRleHRFZGl0b3JcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxheWVyU3ViID0gbmV3IERpc3Bvc2FibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxheWVyID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmxheWVyU3ViID0gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICAgIGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZUxheWVyKHVuZGVmaW5lZCk7XG4gICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVJRCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMubGF5ZXJIb2xkZXIuc2V0dGVyKGxheWVyKTtcblxuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVMYXllcihsYXllcik7XG4gICAgICB0aGlzLnByb3BzLmhhbmRsZUlEKGxheWVyLmlkKTtcblxuICAgICAgdGhpcy5zdWJzLmFkZCh0aGlzLmxheWVyU3ViKTtcblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyTGF5ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUZXh0RWRpdG9yQ29udGV4dC5Db25zdW1lcj5cbiAgICAgICAge2VkaXRvciA9PiA8QmFyZU1hcmtlckxheWVyIGVkaXRvcj17ZWRpdG9yfSB7Li4udGhpcy5wcm9wc30gLz59XG4gICAgICA8L1RleHRFZGl0b3JDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==