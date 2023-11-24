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