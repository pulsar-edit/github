"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _classnames = _interopRequireDefault(require("classnames"));

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _atomTextEditor = require("./atom-text-editor");

var _marker = require("./marker");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const decorationPropTypes = {
  type: _propTypes.default.oneOf(['line', 'line-number', 'highlight', 'overlay', 'gutter', 'block']).isRequired,
  className: _propTypes.default.string,
  style: _propTypes.default.string,
  onlyHead: _propTypes.default.bool,
  onlyEmpty: _propTypes.default.bool,
  onlyNonEmpty: _propTypes.default.bool,
  omitEmptyLastRow: _propTypes.default.bool,
  position: _propTypes.default.oneOf(['head', 'tail', 'before', 'after']),
  order: _propTypes.default.number,
  avoidOverflow: _propTypes.default.bool,
  gutterName: _propTypes.default.string
};

class BareDecoration extends _react.default.Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "observeParents", () => {
      this.decorationHolder.map(decoration => decoration.destroy());
      const editorValid = this.props.editorHolder.map(editor => !editor.isDestroyed()).getOr(false);
      const decorableValid = this.props.decorableHolder.map(decorable => !decorable.isDestroyed()).getOr(false); // Ensure the Marker or MarkerLayer corresponds to the context's TextEditor

      const decorableMatches = this.props.decorableHolder.map(decorable => this.props.editorHolder.map(editor => {
        const layer = decorable.layer || decorable;
        const displayLayer = editor.getMarkerLayer(layer.id);

        if (!displayLayer) {
          return false;
        }

        if (displayLayer !== layer && displayLayer.bufferMarkerLayer !== layer) {
          return false;
        }

        return true;
      }).getOr(false)).getOr(false);

      if (!editorValid || !decorableValid || !decorableMatches) {
        return;
      } // delay decoration creation when it's a gutter type;
      // instead wait for the Gutter to be added to the editor first


      if (this.props.type === 'gutter') {
        if (!this.props.gutterName) {
          throw new Error('You are trying to decorate a gutter but did not supply gutterName prop.');
        }

        this.props.editorHolder.map(editor => {
          this.gutterSub = editor.observeGutters(gutter => {
            if (gutter.name === this.props.gutterName) {
              this.createDecoration();
            }
          });
          return null;
        });
        return;
      }

      this.createDecoration();
    });

    this.decorationHolder = new _refHolder.default();
    this.editorSub = new _eventKit.Disposable();
    this.decorableSub = new _eventKit.Disposable();
    this.gutterSub = new _eventKit.Disposable();
    this.domNode = null;
    this.item = null;

    if (['gutter', 'overlay', 'block'].includes(this.props.type)) {
      this.domNode = document.createElement('div');
      this.domNode.className = (0, _classnames.default)('react-atom-decoration', this.props.className);
    }
  }

  usesItem() {
    return this.domNode !== null;
  }

  componentDidMount() {
    this.editorSub = this.props.editorHolder.observe(this.observeParents);
    this.decorableSub = this.props.decorableHolder.observe(this.observeParents);
  }

  componentDidUpdate(prevProps) {
    if (this.props.editorHolder !== prevProps.editorHolder) {
      this.editorSub.dispose();
      this.editorSub = this.props.editorHolder.observe(this.observeParents);
    }

    if (this.props.decorableHolder !== prevProps.decorableHolder) {
      this.decorableSub.dispose();
      this.decorableSub = this.props.decorableHolder.observe(this.observeParents);
    }

    if (Object.keys(decorationPropTypes).some(key => this.props[key] !== prevProps[key])) {
      this.decorationHolder.map(decoration => decoration.destroy());
      this.createDecoration();
    }
  }

  render() {
    if (this.usesItem()) {
      return _reactDom.default.createPortal(this.props.children, this.domNode);
    } else {
      return null;
    }
  }

  createDecoration() {
    if (this.usesItem() && !this.item) {
      this.item = (0, _helpers.createItem)(this.domNode, this.props.itemHolder);
    }

    const opts = this.getDecorationOpts(this.props);
    const editor = this.props.editorHolder.get();
    const decorable = this.props.decorableHolder.get();
    this.decorationHolder.setter(editor[this.props.decorateMethod](decorable, opts));
  }

  componentWillUnmount() {
    this.decorationHolder.map(decoration => decoration.destroy());
    this.editorSub.dispose();
    this.decorableSub.dispose();
    this.gutterSub.dispose();
  }

  getDecorationOpts(props) {
    return _objectSpread({}, (0, _helpers.extractProps)(props, decorationPropTypes, {
      className: 'class'
    }), {
      item: this.item
    });
  }

}

_defineProperty(BareDecoration, "propTypes", _objectSpread({
  editorHolder: _propTypes2.RefHolderPropType.isRequired,
  decorableHolder: _propTypes2.RefHolderPropType.isRequired,
  decorateMethod: _propTypes.default.oneOf(['decorateMarker', 'decorateMarkerLayer']),
  itemHolder: _propTypes2.RefHolderPropType,
  children: _propTypes.default.node
}, decorationPropTypes));

_defineProperty(BareDecoration, "defaultProps", {
  decorateMethod: 'decorateMarker'
});

class Decoration extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHolder: _refHolder.default.on(this.props.editor),
      decorableHolder: _refHolder.default.on(this.props.decorable)
    };
  }

  static getDerivedStateFromProps(props, state) {
    const editorChanged = state.editorHolder.map(editor => editor !== props.editor).getOr(props.editor !== undefined);
    const decorableChanged = state.decorableHolder.map(decorable => decorable !== props.decorable).getOr(props.decorable !== undefined);

    if (!editorChanged && !decorableChanged) {
      return null;
    }

    const nextState = {};

    if (editorChanged) {
      nextState.editorHolder = _refHolder.default.on(props.editor);
    }

    if (decorableChanged) {
      nextState.decorableHolder = _refHolder.default.on(props.decorable);
    }

    return nextState;
  }

  render() {
    return _react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editorHolder => _react.default.createElement(_marker.DecorableContext.Consumer, null, decorable => {
      let holder = null;
      let decorateMethod = null;

      if (!this.state.decorableHolder.isEmpty()) {
        holder = this.state.decorableHolder;
        decorateMethod = this.props.decorateMethod;
      } else {
        holder = decorable.holder;
        decorateMethod = decorable.decorateMethod;
      }

      return _react.default.createElement(BareDecoration, _extends({
        editorHolder: editorHolder || this.state.editorHolder,
        decorableHolder: holder,
        decorateMethod: decorateMethod
      }, this.props));
    }));
  }

}

exports.default = Decoration;

_defineProperty(Decoration, "propTypes", {
  editor: _propTypes.default.object,
  decorable: _propTypes.default.object,
  decorateMethod: _propTypes.default.oneOf(['decorateMarker', 'decorateMarkerLayer'])
});