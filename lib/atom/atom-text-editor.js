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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
    this.getRefModel().map(editor => editor.update(modelProps));

    // When you look into the abyss, the abyss also looks into you
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJlZGl0b3JVcGRhdGVQcm9wcyIsIm1pbmkiLCJQcm9wVHlwZXMiLCJib29sIiwicmVhZE9ubHkiLCJwbGFjZWhvbGRlclRleHQiLCJzdHJpbmciLCJsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZSIsImF1dG9IZWlnaHQiLCJhdXRvV2lkdGgiLCJzb2Z0V3JhcHBlZCIsImVkaXRvckNyZWF0aW9uUHJvcHMiLCJidWZmZXIiLCJvYmplY3QiLCJFTVBUWV9DTEFTUyIsIlRleHRFZGl0b3JDb250ZXh0IiwiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwiQXRvbVRleHRFZGl0b3IiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic2VsZWN0aW9uIiwic2VsZWN0aW9uU3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJvbkRpZENoYW5nZVJhbmdlIiwiZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UiLCJvbkRpZERlc3Ryb3kiLCJkaXNwb3NlIiwic3VicyIsInJlbW92ZSIsImRpZERlc3Ryb3lTZWxlY3Rpb24iLCJhZGQiLCJkaWRBZGRTZWxlY3Rpb24iLCJnZXRSZWZNb2RlbCIsIm1hcCIsImVkaXRvciIsImlzRW1wdHkiLCJoaWRlRW1wdGluZXNzIiwiZ2V0UmVmRWxlbWVudCIsImVsZW1lbnQiLCJjbGFzc0xpc3QiLCJyZWZQYXJlbnQiLCJSZWZIb2xkZXIiLCJyZWZFbGVtZW50IiwicmVmTW9kZWwiLCJyZW5kZXIiLCJzZXR0ZXIiLCJjaGlsZHJlbiIsImNvbXBvbmVudERpZE1vdW50IiwibW9kZWxQcm9wcyIsImV4dHJhY3RQcm9wcyIsIlRleHRFZGl0b3IiLCJnZXRFbGVtZW50IiwidGFiSW5kZXgiLCJjbGFzc05hbWUiLCJwcmVzZWxlY3QiLCJzZWxlY3RBbGwiLCJhcHBlbmRDaGlsZCIsIm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24iLCJkaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiIsIm9ic2VydmVTZWxlY3Rpb25zIiwib25EaWRDaGFuZ2UiLCJvYnNlcnZlRW1wdGluZXNzIiwiY29tcG9uZW50RGlkVXBkYXRlIiwidXBkYXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkZXN0cm95IiwiY29udGFpbnMiLCJlIiwiZ2V0T3IiLCJmb2N1cyIsImdldE1vZGVsIiwidW5kZWZpbmVkIiwiZnVuYyIsIm51bWJlciIsIlJlZkhvbGRlclByb3BUeXBlIiwibm9kZSJdLCJzb3VyY2VzIjpbImF0b20tdGV4dC1lZGl0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1RleHRFZGl0b3J9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7UmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtleHRyYWN0UHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBlZGl0b3JVcGRhdGVQcm9wcyA9IHtcbiAgbWluaTogUHJvcFR5cGVzLmJvb2wsXG4gIHJlYWRPbmx5OiBQcm9wVHlwZXMuYm9vbCxcbiAgcGxhY2Vob2xkZXJUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGF1dG9IZWlnaHQ6IFByb3BUeXBlcy5ib29sLFxuICBhdXRvV2lkdGg6IFByb3BUeXBlcy5ib29sLFxuICBzb2Z0V3JhcHBlZDogUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5jb25zdCBlZGl0b3JDcmVhdGlvblByb3BzID0ge1xuICBidWZmZXI6IFByb3BUeXBlcy5vYmplY3QsXG4gIC4uLmVkaXRvclVwZGF0ZVByb3BzLFxufTtcblxuY29uc3QgRU1QVFlfQ0xBU1MgPSAnZ2l0aHViLUF0b21UZXh0RWRpdG9yLWVtcHR5JztcblxuZXhwb3J0IGNvbnN0IFRleHRFZGl0b3JDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdG9tVGV4dEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLi4uZWRpdG9yQ3JlYXRpb25Qcm9wcyxcblxuICAgIGRpZENoYW5nZUN1cnNvclBvc2l0aW9uOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaWRBZGRTZWxlY3Rpb246IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaWREZXN0cm95U2VsZWN0aW9uOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIGhpZGVFbXB0aW5lc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIHByZXNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHRhYkluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgcmVmTW9kZWw6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIHJlZkVsZW1lbnQ6IFJlZkhvbGRlclByb3BUeXBlLFxuXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbjogKCkgPT4ge30sXG4gICAgZGlkQWRkU2VsZWN0aW9uOiAoKSA9PiB7fSxcbiAgICBkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZTogKCkgPT4ge30sXG4gICAgZGlkRGVzdHJveVNlbGVjdGlvbjogKCkgPT4ge30sXG5cbiAgICBoaWRlRW1wdGluZXNzOiBmYWxzZSxcbiAgICBwcmVzZWxlY3Q6IGZhbHNlLFxuICAgIHRhYkluZGV4OiAwLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5yZWZQYXJlbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLnJlZk1vZGVsID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1BdG9tVGV4dEVkaXRvci1jb250YWluZXJcIiByZWY9e3RoaXMucmVmUGFyZW50LnNldHRlcn0gLz5cbiAgICAgICAgPFRleHRFZGl0b3JDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt0aGlzLmdldFJlZk1vZGVsKCl9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8L1RleHRFZGl0b3JDb250ZXh0LlByb3ZpZGVyPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgbW9kZWxQcm9wcyA9IGV4dHJhY3RQcm9wcyh0aGlzLnByb3BzLCBlZGl0b3JDcmVhdGlvblByb3BzKTtcblxuICAgIHRoaXMucmVmUGFyZW50Lm1hcChlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKG1vZGVsUHJvcHMpO1xuICAgICAgZWRpdG9yLmdldEVsZW1lbnQoKS50YWJJbmRleCA9IHRoaXMucHJvcHMudGFiSW5kZXg7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgICAgZWRpdG9yLmdldEVsZW1lbnQoKS5jbGFzc0xpc3QuYWRkKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByb3BzLnByZXNlbGVjdCkge1xuICAgICAgICBlZGl0b3Iuc2VsZWN0QWxsKCk7XG4gICAgICB9XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVkaXRvci5nZXRFbGVtZW50KCkpO1xuICAgICAgdGhpcy5nZXRSZWZNb2RlbCgpLnNldHRlcihlZGl0b3IpO1xuICAgICAgdGhpcy5nZXRSZWZFbGVtZW50KCkuc2V0dGVyKGVkaXRvci5nZXRFbGVtZW50KCkpO1xuXG4gICAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbih0aGlzLnByb3BzLmRpZENoYW5nZUN1cnNvclBvc2l0aW9uKSxcbiAgICAgICAgZWRpdG9yLm9ic2VydmVTZWxlY3Rpb25zKHRoaXMub2JzZXJ2ZVNlbGVjdGlvbnMpLFxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2UodGhpcy5vYnNlcnZlRW1wdGluZXNzKSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChlZGl0b3IuaXNFbXB0eSgpICYmIHRoaXMucHJvcHMuaGlkZUVtcHRpbmVzcykge1xuICAgICAgICBlZGl0b3IuZ2V0RWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoRU1QVFlfQ0xBU1MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBjb25zdCBtb2RlbFByb3BzID0gZXh0cmFjdFByb3BzKHRoaXMucHJvcHMsIGVkaXRvclVwZGF0ZVByb3BzKTtcbiAgICB0aGlzLmdldFJlZk1vZGVsKCkubWFwKGVkaXRvciA9PiBlZGl0b3IudXBkYXRlKG1vZGVsUHJvcHMpKTtcblxuICAgIC8vIFdoZW4geW91IGxvb2sgaW50byB0aGUgYWJ5c3MsIHRoZSBhYnlzcyBhbHNvIGxvb2tzIGludG8geW91XG4gICAgdGhpcy5vYnNlcnZlRW1wdGluZXNzKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmdldFJlZk1vZGVsKCkubWFwKGVkaXRvciA9PiBlZGl0b3IuZGVzdHJveSgpKTtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgb2JzZXJ2ZVNlbGVjdGlvbnMgPSBzZWxlY3Rpb24gPT4ge1xuICAgIGNvbnN0IHNlbGVjdGlvblN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHNlbGVjdGlvbi5vbkRpZENoYW5nZVJhbmdlKHRoaXMucHJvcHMuZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UpLFxuICAgICAgc2VsZWN0aW9uLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHNlbGVjdGlvblN1YnMuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnN1YnMucmVtb3ZlKHNlbGVjdGlvblN1YnMpO1xuICAgICAgICB0aGlzLnByb3BzLmRpZERlc3Ryb3lTZWxlY3Rpb24oc2VsZWN0aW9uKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzLmFkZChzZWxlY3Rpb25TdWJzKTtcbiAgICB0aGlzLnByb3BzLmRpZEFkZFNlbGVjdGlvbihzZWxlY3Rpb24pO1xuICB9XG5cbiAgb2JzZXJ2ZUVtcHRpbmVzcyA9ICgpID0+IHtcbiAgICB0aGlzLmdldFJlZk1vZGVsKCkubWFwKGVkaXRvciA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmlzRW1wdHkoKSAmJiB0aGlzLnByb3BzLmhpZGVFbXB0aW5lc3MpIHtcbiAgICAgICAgdGhpcy5nZXRSZWZFbGVtZW50KCkubWFwKGVsZW1lbnQgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKEVNUFRZX0NMQVNTKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoRU1QVFlfQ0xBU1MpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgY29udGFpbnMoZWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZSA9PiBlLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZSA9PiBlLmZvY3VzKCkpO1xuICB9XG5cbiAgZ2V0UmVmTW9kZWwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVmTW9kZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlZk1vZGVsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5yZWZNb2RlbCkge1xuICAgICAgdGhpcy5yZWZNb2RlbCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWZNb2RlbDtcbiAgfVxuXG4gIGdldFJlZkVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVmRWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVmRWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucmVmRWxlbWVudCkge1xuICAgICAgdGhpcy5yZWZFbGVtZW50ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlZkVsZW1lbnQ7XG4gIH1cblxuICBnZXRNb2RlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWZNb2RlbCgpLmdldE9yKHVuZGVmaW5lZCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBd0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV4QyxNQUFNQSxpQkFBaUIsR0FBRztFQUN4QkMsSUFBSSxFQUFFQyxrQkFBUyxDQUFDQyxJQUFJO0VBQ3BCQyxRQUFRLEVBQUVGLGtCQUFTLENBQUNDLElBQUk7RUFDeEJFLGVBQWUsRUFBRUgsa0JBQVMsQ0FBQ0ksTUFBTTtFQUNqQ0MsdUJBQXVCLEVBQUVMLGtCQUFTLENBQUNDLElBQUk7RUFDdkNLLFVBQVUsRUFBRU4sa0JBQVMsQ0FBQ0MsSUFBSTtFQUMx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