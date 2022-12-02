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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL2F0b20tdGV4dC1lZGl0b3IuanMiXSwibmFtZXMiOlsiZWRpdG9yVXBkYXRlUHJvcHMiLCJtaW5pIiwiUHJvcFR5cGVzIiwiYm9vbCIsInJlYWRPbmx5IiwicGxhY2Vob2xkZXJUZXh0Iiwic3RyaW5nIiwibGluZU51bWJlckd1dHRlclZpc2libGUiLCJhdXRvSGVpZ2h0IiwiYXV0b1dpZHRoIiwic29mdFdyYXBwZWQiLCJlZGl0b3JDcmVhdGlvblByb3BzIiwiYnVmZmVyIiwib2JqZWN0IiwiRU1QVFlfQ0xBU1MiLCJUZXh0RWRpdG9yQ29udGV4dCIsIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsIkF0b21UZXh0RWRpdG9yIiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInNlbGVjdGlvbiIsInNlbGVjdGlvblN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib25EaWRDaGFuZ2VSYW5nZSIsImRpZENoYW5nZVNlbGVjdGlvblJhbmdlIiwib25EaWREZXN0cm95IiwiZGlzcG9zZSIsInN1YnMiLCJyZW1vdmUiLCJkaWREZXN0cm95U2VsZWN0aW9uIiwiYWRkIiwiZGlkQWRkU2VsZWN0aW9uIiwiZ2V0UmVmTW9kZWwiLCJtYXAiLCJlZGl0b3IiLCJpc0VtcHR5IiwiaGlkZUVtcHRpbmVzcyIsImdldFJlZkVsZW1lbnQiLCJlbGVtZW50IiwiY2xhc3NMaXN0IiwicmVmUGFyZW50IiwiUmVmSG9sZGVyIiwicmVmRWxlbWVudCIsInJlZk1vZGVsIiwicmVuZGVyIiwic2V0dGVyIiwiY2hpbGRyZW4iLCJjb21wb25lbnREaWRNb3VudCIsIm1vZGVsUHJvcHMiLCJUZXh0RWRpdG9yIiwiZ2V0RWxlbWVudCIsInRhYkluZGV4IiwiY2xhc3NOYW1lIiwicHJlc2VsZWN0Iiwic2VsZWN0QWxsIiwiYXBwZW5kQ2hpbGQiLCJvbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIiwiZGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24iLCJvYnNlcnZlU2VsZWN0aW9ucyIsIm9uRGlkQ2hhbmdlIiwib2JzZXJ2ZUVtcHRpbmVzcyIsImNvbXBvbmVudERpZFVwZGF0ZSIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsImNvbnRhaW5zIiwiZSIsImdldE9yIiwiZm9jdXMiLCJnZXRNb2RlbCIsInVuZGVmaW5lZCIsImZ1bmMiLCJudW1iZXIiLCJSZWZIb2xkZXJQcm9wVHlwZSIsIm5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxpQkFBaUIsR0FBRztBQUN4QkMsRUFBQUEsSUFBSSxFQUFFQyxtQkFBVUMsSUFEUTtBQUV4QkMsRUFBQUEsUUFBUSxFQUFFRixtQkFBVUMsSUFGSTtBQUd4QkUsRUFBQUEsZUFBZSxFQUFFSCxtQkFBVUksTUFISDtBQUl4QkMsRUFBQUEsdUJBQXVCLEVBQUVMLG1CQUFVQyxJQUpYO0FBS3hCSyxFQUFBQSxVQUFVLEVBQUVOLG1CQUFVQyxJQUxFO0FBTXhCTSxFQUFBQSxTQUFTLEVBQUVQLG1CQUFVQyxJQU5HO0FBT3hCTyxFQUFBQSxXQUFXLEVBQUVSLG1CQUFVQztBQVBDLENBQTFCOztBQVVBLE1BQU1RLG1CQUFtQjtBQUN2QkMsRUFBQUEsTUFBTSxFQUFFVixtQkFBVVc7QUFESyxHQUVwQmIsaUJBRm9CLENBQXpCOztBQUtBLE1BQU1jLFdBQVcsR0FBRyw2QkFBcEI7O0FBRU8sTUFBTUMsaUJBQWlCLEdBQUdDLGVBQU1DLGFBQU4sRUFBMUI7Ozs7QUFFUSxNQUFNQyxjQUFOLFNBQTZCRixlQUFNRyxTQUFuQyxDQUE2QztBQStCMURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLCtDQWdFQ0MsU0FBUyxJQUFJO0FBQy9CLFlBQU1DLGFBQWEsR0FBRyxJQUFJQyw2QkFBSixDQUNwQkYsU0FBUyxDQUFDRyxnQkFBVixDQUEyQixLQUFL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QUVwQjFCLEVBQUFBLGVBQWUsRUFBRSxNQUFNLENBQUUsQ0FGTDtBQUdwQlAsRUFBQUEsdUJBQXVCLEVBQUUsTUFBTSxDQUFFLENBSGI7QUFJcEJLLEVBQUFBLG1CQUFtQixFQUFFLE1BQU0sQ0FBRSxDQUpUO0FBTXBCTyxFQUFBQSxhQUFhLEVBQUUsS0FOSztBQU9wQmlCLEVBQUFBLFNBQVMsRUFBRSxLQVBTO0FBUXBCRixFQUFBQSxRQUFRLEVBQUU7QUFSVSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1RleHRFZGl0b3J9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7UmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtleHRyYWN0UHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBlZGl0b3JVcGRhdGVQcm9wcyA9IHtcbiAgbWluaTogUHJvcFR5cGVzLmJvb2wsXG4gIHJlYWRPbmx5OiBQcm9wVHlwZXMuYm9vbCxcbiAgcGxhY2Vob2xkZXJUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGF1dG9IZWlnaHQ6IFByb3BUeXBlcy5ib29sLFxuICBhdXRvV2lkdGg6IFByb3BUeXBlcy5ib29sLFxuICBzb2Z0V3JhcHBlZDogUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5jb25zdCBlZGl0b3JDcmVhdGlvblByb3BzID0ge1xuICBidWZmZXI6IFByb3BUeXBlcy5vYmplY3QsXG4gIC4uLmVkaXRvclVwZGF0ZVByb3BzLFxufTtcblxuY29uc3QgRU1QVFlfQ0xBU1MgPSAnZ2l0aHViLUF0b21UZXh0RWRpdG9yLWVtcHR5JztcblxuZXhwb3J0IGNvbnN0IFRleHRFZGl0b3JDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdG9tVGV4dEVkaXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLi4uZWRpdG9yQ3JlYXRpb25Qcm9wcyxcblxuICAgIGRpZENoYW5nZUN1cnNvclBvc2l0aW9uOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaWRBZGRTZWxlY3Rpb246IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaWREZXN0cm95U2VsZWN0aW9uOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIGhpZGVFbXB0aW5lc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIHByZXNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHRhYkluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgcmVmTW9kZWw6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIHJlZkVsZW1lbnQ6IFJlZkhvbGRlclByb3BUeXBlLFxuXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbjogKCkgPT4ge30sXG4gICAgZGlkQWRkU2VsZWN0aW9uOiAoKSA9PiB7fSxcbiAgICBkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZTogKCkgPT4ge30sXG4gICAgZGlkRGVzdHJveVNlbGVjdGlvbjogKCkgPT4ge30sXG5cbiAgICBoaWRlRW1wdGluZXNzOiBmYWxzZSxcbiAgICBwcmVzZWxlY3Q6IGZhbHNlLFxuICAgIHRhYkluZGV4OiAwLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5yZWZQYXJlbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLnJlZk1vZGVsID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1BdG9tVGV4dEVkaXRvci1jb250YWluZXJcIiByZWY9e3RoaXMucmVmUGFyZW50LnNldHRlcn0gLz5cbiAgICAgICAgPFRleHRFZGl0b3JDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt0aGlzLmdldFJlZk1vZGVsKCl9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8L1RleHRFZGl0b3JDb250ZXh0LlByb3ZpZGVyPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgbW9kZWxQcm9wcyA9IGV4dHJhY3RQcm9wcyh0aGlzLnByb3BzLCBlZGl0b3JDcmVhdGlvblByb3BzKTtcblxuICAgIHRoaXMucmVmUGFyZW50Lm1hcChlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKG1vZGVsUHJvcHMpO1xuICAgICAgZWRpdG9yLmdldEVsZW1lbnQoKS50YWJJbmRleCA9IHRoaXMucHJvcHMudGFiSW5kZXg7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgICAgZWRpdG9yLmdldEVsZW1lbnQoKS5jbGFzc0xpc3QuYWRkKHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByb3BzLnByZXNlbGVjdCkge1xuICAgICAgICBlZGl0b3Iuc2VsZWN0QWxsKCk7XG4gICAgICB9XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVkaXRvci5nZXRFbGVtZW50KCkpO1xuICAgICAgdGhpcy5nZXRSZWZNb2RlbCgpLnNldHRlcihlZGl0b3IpO1xuICAgICAgdGhpcy5nZXRSZWZFbGVtZW50KCkuc2V0dGVyKGVkaXRvci5nZXRFbGVtZW50KCkpO1xuXG4gICAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbih0aGlzLnByb3BzLmRpZENoYW5nZUN1cnNvclBvc2l0aW9uKSxcbiAgICAgICAgZWRpdG9yLm9ic2VydmVTZWxlY3Rpb25zKHRoaXMub2JzZXJ2ZVNlbGVjdGlvbnMpLFxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2UodGhpcy5vYnNlcnZlRW1wdGluZXNzKSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChlZGl0b3IuaXNFbXB0eSgpICYmIHRoaXMucHJvcHMuaGlkZUVtcHRpbmVzcykge1xuICAgICAgICBlZGl0b3IuZ2V0RWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoRU1QVFlfQ0xBU1MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBjb25zdCBtb2RlbFByb3BzID0gZXh0cmFjdFByb3BzKHRoaXMucHJvcHMsIGVkaXRvclVwZGF0ZVByb3BzKTtcbiAgICB0aGlzLmdldFJlZk1vZGVsKCkubWFwKGVkaXRvciA9PiBlZGl0b3IudXBkYXRlKG1vZGVsUHJvcHMpKTtcblxuICAgIC8vIFdoZW4geW91IGxvb2sgaW50byB0aGUgYWJ5c3MsIHRoZSBhYnlzcyBhbHNvIGxvb2tzIGludG8geW91XG4gICAgdGhpcy5vYnNlcnZlRW1wdGluZXNzKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmdldFJlZk1vZGVsKCkubWFwKGVkaXRvciA9PiBlZGl0b3IuZGVzdHJveSgpKTtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgb2JzZXJ2ZVNlbGVjdGlvbnMgPSBzZWxlY3Rpb24gPT4ge1xuICAgIGNvbnN0IHNlbGVjdGlvblN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHNlbGVjdGlvbi5vbkRpZENoYW5nZVJhbmdlKHRoaXMucHJvcHMuZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UpLFxuICAgICAgc2VsZWN0aW9uLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHNlbGVjdGlvblN1YnMuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnN1YnMucmVtb3ZlKHNlbGVjdGlvblN1YnMpO1xuICAgICAgICB0aGlzLnByb3BzLmRpZERlc3Ryb3lTZWxlY3Rpb24oc2VsZWN0aW9uKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzLmFkZChzZWxlY3Rpb25TdWJzKTtcbiAgICB0aGlzLnByb3BzLmRpZEFkZFNlbGVjdGlvbihzZWxlY3Rpb24pO1xuICB9XG5cbiAgb2JzZXJ2ZUVtcHRpbmVzcyA9ICgpID0+IHtcbiAgICB0aGlzLmdldFJlZk1vZGVsKCkubWFwKGVkaXRvciA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmlzRW1wdHkoKSAmJiB0aGlzLnByb3BzLmhpZGVFbXB0aW5lc3MpIHtcbiAgICAgICAgdGhpcy5nZXRSZWZFbGVtZW50KCkubWFwKGVsZW1lbnQgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKEVNUFRZX0NMQVNTKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoRU1QVFlfQ0xBU1MpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgY29udGFpbnMoZWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZSA9PiBlLmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZSA9PiBlLmZvY3VzKCkpO1xuICB9XG5cbiAgZ2V0UmVmTW9kZWwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVmTW9kZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlZk1vZGVsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5yZWZNb2RlbCkge1xuICAgICAgdGhpcy5yZWZNb2RlbCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWZNb2RlbDtcbiAgfVxuXG4gIGdldFJlZkVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVmRWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVmRWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucmVmRWxlbWVudCkge1xuICAgICAgdGhpcy5yZWZFbGVtZW50ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlZkVsZW1lbnQ7XG4gIH1cblxuICBnZXRNb2RlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWZNb2RlbCgpLmdldE9yKHVuZGVmaW5lZCk7XG4gIH1cbn1cbiJdfQ==