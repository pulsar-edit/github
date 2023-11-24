"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TextEditorContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _eventKit = require("event-kit");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const editorUpdateProps = {
  mini: _propTypes.default.bool,
  readOnly: _propTypes.default.bool,
  placeholderText: _propTypes.default.string,
  lineNumberGutterVisible: _propTypes.default.bool,
  autoHeight: _propTypes.default.bool,
  autoWidth: _propTypes.default.bool,
  softWrapped: _propTypes.default.bool
};

const editorCreationProps = _objectSpread({
  buffer: _propTypes.default.object
}, editorUpdateProps);

const EMPTY_CLASS = 'github-AtomTextEditor-empty';

const TextEditorContext = _react.default.createContext();

exports.TextEditorContext = TextEditorContext;

class AtomTextEditor extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "observeSelections", selection => {
      const selectionSubs = new _eventKit.CompositeDisposable(selection.onDidChangeRange(this.props.didChangeSelectionRange), selection.onDidDestroy(() => {
        selectionSubs.dispose();
        this.subs.remove(selectionSubs);
        this.props.didDestroySelection(selection);
      }));
      this.subs.add(selectionSubs);
      this.props.didAddSelection(selection);
    });

    _defineProperty(this, "observeEmptiness", () => {
      this.getRefModel().map(editor => {
        if (editor.isEmpty() && this.props.hideEmptiness) {
          this.getRefElement().map(element => element.classList.add(EMPTY_CLASS));
        } else {
          this.getRefElement().map(element => element.classList.remove(EMPTY_CLASS));
        }

        return null;
      });
    });

    this.subs = new _eventKit.CompositeDisposable();
    this.refParent = new _refHolder.default();
    this.refElement = null;
    this.refModel = null;
  }

  render() {
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("div", {
      className: "github-AtomTextEditor-container",
      ref: this.refParent.setter
    }), _react.default.createElement(TextEditorContext.Provider, {
      value: this.getRefModel()
    }, this.props.children));
  }

  componentDidMount() {
    const modelProps = (0, _helpers.extractProps)(this.props, editorCreationProps);
    this.refParent.map(element => {
      const editor = new _atom.TextEditor(modelProps);
      editor.getElement().tabIndex = this.props.tabIndex;

      if (this.props.className) {
        editor.getElement().classList.add(this.props.className);
      }

      if (this.props.preselect) {
        editor.selectAll();
      }

      element.appendChild(editor.getElement());
      this.getRefModel().setter(editor);
      this.getRefElement().setter(editor.getElement());
      this.subs.add(editor.onDidChangeCursorPosition(this.props.didChangeCursorPosition), editor.observeSelections(this.observeSelections), editor.onDidChange(this.observeEmptiness));

      if (editor.isEmpty() && this.props.hideEmptiness) {
        editor.getElement().classList.add(EMPTY_CLASS);
      }

      return null;
    });
  }

  componentDidUpdate() {
    const modelProps = (0, _helpers.extractProps)(this.props, editorUpdateProps);
    this.getRefModel().map(editor => editor.update(modelProps)); // When you look into the abyss, the abyss also looks into you

    this.observeEmptiness();
  }

  componentWillUnmount() {
    this.getRefModel().map(editor => editor.destroy());
    this.subs.dispose();
  }

  contains(element) {
    return this.getRefElement().map(e => e.contains(element)).getOr(false);
  }

  focus() {
    this.getRefElement().map(e => e.focus());
  }

  getRefModel() {
    if (this.props.refModel) {
      return this.props.refModel;
    }

    if (!this.refModel) {
      this.refModel = new _refHolder.default();
    }

    return this.refModel;
  }

  getRefElement() {
    if (this.props.refElement) {
      return this.props.refElement;
    }

    if (!this.refElement) {
      this.refElement = new _refHolder.default();
    }

    return this.refElement;
  }

  getModel() {
    return this.getRefModel().getOr(undefined);
  }

}

exports.default = AtomTextEditor;

_defineProperty(AtomTextEditor, "propTypes", _objectSpread({}, editorCreationProps, {
  didChangeCursorPosition: _propTypes.default.func,
  didAddSelection: _propTypes.default.func,
  didChangeSelectionRange: _propTypes.default.func,
  didDestroySelection: _propTypes.default.func,
  hideEmptiness: _propTypes.default.bool,
  preselect: _propTypes.default.bool,
  className: _propTypes.default.string,
  tabIndex: _propTypes.default.number,
  refModel: _propTypes2.RefHolderPropType,
  refElement: _propTypes2.RefHolderPropType,
  children: _propTypes.default.node
}));

_defineProperty(AtomTextEditor, "defaultProps", {
  didChangeCursorPosition: () => {},
  didAddSelection: () => {},
  didChangeSelectionRange: () => {},
  didDestroySelection: () => {},
  hideEmptiness: false,
  preselect: false,
  tabIndex: 0
});