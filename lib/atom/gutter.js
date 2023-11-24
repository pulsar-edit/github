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