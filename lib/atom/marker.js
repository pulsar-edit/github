"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DecorableContext = exports.MarkerContext = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _atomTextEditor = require("./atom-text-editor");

var _markerLayer = require("./marker-layer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MarkablePropType = _propTypes.default.shape({
  markBufferRange: _propTypes.default.func.isRequired
});

const markerProps = {
  exclusive: _propTypes.default.bool,
  reversed: _propTypes.default.bool,
  invalidate: _propTypes.default.oneOf(['never', 'surround', 'overlap', 'inside', 'touch'])
};

const MarkerContext = _react.default.createContext();

exports.MarkerContext = MarkerContext;

const DecorableContext = _react.default.createContext();

exports.DecorableContext = DecorableContext;

class BareMarker extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'createMarker', 'didChange');
    this.markerSubs = new _eventKit.CompositeDisposable();
    this.subs = new _eventKit.CompositeDisposable();
    this.markerHolder = new _refHolder.default();
    this.markerHolder.observe(marker => {
      this.props.handleMarker(marker);
    });
    this.decorable = {
      holder: this.markerHolder,
      decorateMethod: 'decorateMarker'
    };
  }

  componentDidMount() {
    this.observeMarkable();
  }

  render() {
    return _react.default.createElement(MarkerContext.Provider, {
      value: this.markerHolder
    }, _react.default.createElement(DecorableContext.Provider, {
      value: this.decorable
    }, this.props.children));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.markableHolder !== this.props.markableHolder) {
      this.observeMarkable();
    }

    if (Object.keys(markerProps).some(key => prevProps[key] !== this.props[key])) {
      this.markerHolder.map(marker => marker.setProperties((0, _helpers.extractProps)(this.props, markerProps)));
    }

    this.updateMarkerPosition();
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

  observeMarkable() {
    this.subs.dispose();
    this.subs = new _eventKit.CompositeDisposable();
    this.subs.add(this.props.markableHolder.observe(this.createMarker));
  }

  createMarker() {
    this.markerSubs.dispose();
    this.markerSubs = new _eventKit.CompositeDisposable();
    this.subs.add(this.markerSubs);
    const options = (0, _helpers.extractProps)(this.props, markerProps);
    this.props.markableHolder.map(markable => {
      let marker;

      if (this.props.id !== undefined) {
        marker = markable.getMarker(this.props.id);

        if (!marker) {
          throw new Error(`Invalid marker ID: ${this.props.id}`);
        }

        marker.setProperties(options);
      } else {
        marker = markable.markBufferRange(this.props.bufferRange, options);
        this.markerSubs.add(new _eventKit.Disposable(() => marker.destroy()));
      }

      this.markerSubs.add(marker.onDidChange(this.didChange));
      this.markerHolder.setter(marker);
      this.props.handleID(marker.id);
      return null;
    });
  }

  updateMarkerPosition() {
    this.markerHolder.map(marker => marker.setBufferRange(this.props.bufferRange));
  }

  didChange(event) {
    const reversed = this.markerHolder.map(marker => marker.isReversed()).getOr(false);
    const oldBufferStartPosition = reversed ? event.oldHeadBufferPosition : event.oldTailBufferPosition;
    const oldBufferEndPosition = reversed ? event.oldTailBufferPosition : event.oldHeadBufferPosition;
    const newBufferStartPosition = reversed ? event.newHeadBufferPosition : event.newTailBufferPosition;
    const newBufferEndPosition = reversed ? event.newTailBufferPosition : event.newHeadBufferPosition;
    this.props.onDidChange(_objectSpread({
      oldRange: new Range(oldBufferStartPosition, oldBufferEndPosition),
      newRange: new Range(newBufferStartPosition, newBufferEndPosition)
    }, event));
  }

}

_defineProperty(BareMarker, "propTypes", _objectSpread({}, markerProps, {
  id: _propTypes.default.number,
  bufferRange: _propTypes2.RangePropType,
  markableHolder: _propTypes2.RefHolderPropType,
  children: _propTypes.default.node,
  onDidChange: _propTypes.default.func,
  handleID: _propTypes.default.func,
  handleMarker: _propTypes.default.func
}));

_defineProperty(BareMarker, "defaultProps", {
  onDidChange: () => {},
  handleID: () => {},
  handleMarker: () => {}
});

class Marker extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      markableHolder: _refHolder.default.on(props.layer || props.editor)
    };
  }

  static getDerivedStateFromProps(props, state) {
    const markable = props.layer || props.editor;

    if (state.markableHolder.map(m => m === markable).getOr(markable === undefined)) {
      return {};
    }

    return {
      markableHolder: _refHolder.default.on(markable)
    };
  }

  render() {
    if (!this.state.markableHolder.isEmpty()) {
      return _react.default.createElement(BareMarker, _extends({}, this.props, {
        markableHolder: this.state.markableHolder
      }));
    }

    return _react.default.createElement(_markerLayer.MarkerLayerContext.Consumer, null, layerHolder => {
      if (layerHolder) {
        return _react.default.createElement(BareMarker, _extends({}, this.props, {
          markableHolder: layerHolder
        }));
      } else {
        return _react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editorHolder => _react.default.createElement(BareMarker, _extends({}, this.props, {
          markableHolder: editorHolder
        })));
      }
    });
  }

}

exports.default = Marker;

_defineProperty(Marker, "propTypes", {
  editor: MarkablePropType,
  layer: MarkablePropType
});