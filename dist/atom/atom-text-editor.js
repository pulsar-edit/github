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
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-AtomTextEditor-container",
      ref: this.refParent.setter
    }), /*#__PURE__*/_react.default.createElement(TextEditorContext.Provider, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL2F0b20tdGV4dC1lZGl0b3IuanMiXSwibmFtZXMiOlsiZWRpdG9yVXBkYXRlUHJvcHMiLCJtaW5pIiwiUHJvcFR5cGVzIiwiYm9vbCIsInJlYWRPbmx5IiwicGxhY2Vob2xkZXJUZXh0Iiwic3RyaW5nIiwibGluZU51bWJlckd1dHRlclZpc2libGUiLCJhdXRvSGVpZ2h0IiwiYXV0b1dpZHRoIiwic29mdFdyYXBwZWQiLCJlZGl0b3JDcmVhdGlvblByb3BzIiwiYnVmZmVyIiwib2JqZWN0IiwiRU1QVFlfQ0xBU1MiLCJUZXh0RWRpdG9yQ29udGV4dCIsIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsIkF0b21UZXh0RWRpdG9yIiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInNlbGVjdGlvbiIsInNlbGVjdGlvblN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib25EaWRDaGFuZ2VSYW5nZSIsImRpZENoYW5nZVNlbGVjdGlvblJhbmdlIiwib25EaWREZXN0cm95IiwiZGlzcG9zZSIsInN1YnMiLCJyZW1vdmUiLCJkaWREZXN0cm95U2VsZWN0aW9uIiwiYWRkIiwiZGlkQWRkU2VsZWN0aW9uIiwiZ2V0UmVmTW9kZWwiLCJtYXAiLCJlZGl0b3IiLCJpc0VtcHR5IiwiaGlkZUVtcHRpbmVzcyIsImdldFJlZkVsZW1lbnQiLCJlbGVtZW50IiwiY2xhc3NMaXN0IiwicmVmUGFyZW50IiwiUmVmSG9sZGVyIiwicmVmRWxlbWVudCIsInJlZk1vZGVsIiwicmVuZGVyIiwic2V0dGVyIiwiY2hpbGRyZW4iLCJjb21wb25lbnREaWRNb3VudCIsIm1vZGVsUHJvcHMiLCJUZXh0RWRpdG9yIiwiZ2V0RWxlbWVudCIsInRhYkluZGV4IiwiY2xhc3NOYW1lIiwicHJlc2VsZWN0Iiwic2VsZWN0QWxsIiwiYXBwZW5kQ2hpbGQiLCJvbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIiwiZGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24iLCJvYnNlcnZlU2VsZWN0aW9ucyIsIm9uRGlkQ2hhbmdlIiwib2JzZXJ2ZUVtcHRpbmVzcyIsImNvbXBvbmVudERpZFVwZGF0ZSIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsImNvbnRhaW5zIiwiZSIsImdldE9yIiwiZm9jdXMiLCJnZXRNb2RlbCIsInVuZGVmaW5lZCIsImZ1bmMiLCJudW1iZXIiLCJSZWZIb2xkZXJQcm9wVHlwZSIsIm5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxpQkFBaUIsR0FBRztBQUN4QkMsRUFBQUEsSUFBSSxFQUFFQyxtQkFBVUMsSUFEUTtBQUV4QkMsRUFBQUEsUUFBUSxFQUFFRixtQkFBVUMsSUFGSTtBQUd4QkUsRUFBQUEsZUFBZSxFQUFFSCxtQkFBVUksTUFISDtBQUl4QkMsRUFBQUEsdUJBQXVCLEVBQUVMLG1CQUFVQyxJQUpYO0FBS3hCSyxFQUFBQSxVQUFVLEVBQUVOLG1CQUFVQyxJQUxFO0FBTXhCTSxFQUFBQSxTQUFTLEVBQUVQLG1CQUFVQyxJQU5HO0FBT3hCTyxFQUFBQSxXQUFXLEVBQUVSLG1CQUFVQztBQVBDLENBQTFCOztBQVVBLE1BQU1RLG1CQUFtQjtBQUN2QkMsRUFBQUEsTUFBTSxFQUFFVixtQkFBVVc7QUFESyxHQUVwQmIsaUJBRm9CLENBQXpCOztBQUtBLE1BQU1jLFdBQVcsR0FBRyw2QkFBcEI7O0FBRU8sTUFBTUMsaUJBQWlCLEdBQUdDLGVBQU1DLGFBQU4sRUFBMUI7Ozs7QUFFUSxNQUFNQyxjQUFOLFNBQTZCRixlQUFNRyxTQUFuQyxDQUE2QztBQStCMURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLCtDQWdFQ0MsU0FBUyxJQUFJO0FBQy9CLFlBQU1DLGFBQWEsR0FBRyxJQUFJQyw2QkFBSixDQUNwQkYsU0FBUyxDQUFDRyxnQkFBVixDQUEyQixLQUFL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O0FBRXBCMUIsRUFBQUEsZUFBZSxFQUFFLE1BQU0sQ0FBRSxDQUZMO0FBR3BCUCxFQUFBQSx1QkFBdUIsRUFBRSxNQUFNLENBQUUsQ0FIYjtBQUlwQkssRUFBQUEsbUJBQW1CLEVBQUUsTUFBTSxDQUFFLENBSlQ7QUFNcEJPLEVBQUFBLGFBQWEsRUFBRSxLQU5LO0FBT3BCaUIsRUFBQUEsU0FBUyxFQUFFLEtBUFM7QUFRcEJGLEVBQUFBLFFBQVEsRUFBRTtBQVJVLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7VGV4dEVkaXRvcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2V4dHJhY3RQcm9wc30gZnJvbSAnLi4vaGVscGVycyc7XG5cbmNvbnN0IGVkaXRvclVwZGF0ZVByb3BzID0ge1xuICBtaW5pOiBQcm9wVHlwZXMuYm9vbCxcbiAgcmVhZE9ubHk6IFByb3BUeXBlcy5ib29sLFxuICBwbGFjZWhvbGRlclRleHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgYXV0b0hlaWdodDogUHJvcFR5cGVzLmJvb2wsXG4gIGF1dG9XaWR0aDogUHJvcFR5cGVzLmJvb2wsXG4gIHNvZnRXcmFwcGVkOiBQcm9wVHlwZXMuYm9vbCxcbn07XG5cbmNvbnN0IGVkaXRvckNyZWF0aW9uUHJvcHMgPSB7XG4gIGJ1ZmZlcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgLi4uZWRpdG9yVXBkYXRlUHJvcHMsXG59O1xuXG5jb25zdCBFTVBUWV9DTEFTUyA9ICdnaXRodWItQXRvbVRleHRFZGl0b3ItZW1wdHknO1xuXG5leHBvcnQgY29uc3QgVGV4dEVkaXRvckNvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0b21UZXh0RWRpdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAuLi5lZGl0b3JDcmVhdGlvblByb3BzLFxuXG4gICAgZGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb246IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpZEFkZFNlbGVjdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpZERlc3Ryb3lTZWxlY3Rpb246IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgaGlkZUVtcHRpbmVzczogUHJvcFR5cGVzLmJvb2wsXG4gICAgcHJlc2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGFiSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgICByZWZNb2RlbDogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgcmVmRWxlbWVudDogUmVmSG9sZGVyUHJvcFR5cGUsXG5cbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGRpZENoYW5nZUN1cnNvclBvc2l0aW9uOiAoKSA9PiB7fSxcbiAgICBkaWRBZGRTZWxlY3Rpb246ICgpID0+IHt9LFxuICAgIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlOiAoKSA9PiB7fSxcbiAgICBkaWREZXN0cm95U2VsZWN0aW9uOiAoKSA9PiB7fSxcblxuICAgIGhpZGVFbXB0aW5lc3M6IGZhbHNlLFxuICAgIHByZXNlbGVjdDogZmFsc2UsXG4gICAgdGFiSW5kZXg6IDAsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnJlZlBhcmVudCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMucmVmTW9kZWwgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUF0b21UZXh0RWRpdG9yLWNvbnRhaW5lclwiIHJlZj17dGhpcy5yZWZQYXJlbnQuc2V0dGVyfSAvPlxuICAgICAgICA8VGV4dEVkaXRvckNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3RoaXMuZ2V0UmVmTW9kZWwoKX0+XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDwvVGV4dEVkaXRvckNvbnRleHQuUHJvdmlkZXI+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBtb2RlbFByb3BzID0gZXh0cmFjdFByb3BzKHRoaXMucHJvcHMsIGVkaXRvckNyZWF0aW9uUHJvcHMpO1xuXG4gICAgdGhpcy5yZWZQYXJlbnQubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yID0gbmV3IFRleHRFZGl0b3IobW9kZWxQcm9wcyk7XG4gICAgICBlZGl0b3IuZ2V0RWxlbWVudCgpLnRhYkluZGV4ID0gdGhpcy5wcm9wcy50YWJJbmRleDtcbiAgICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgICBlZGl0b3IuZ2V0RWxlbWVudCgpLmNsYXNzTGlzdC5hZGQodGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJvcHMucHJlc2VsZWN0KSB7XG4gICAgICAgIGVkaXRvci5zZWxlY3RBbGwoKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZWRpdG9yLmdldEVsZW1lbnQoKSk7XG4gICAgICB0aGlzLmdldFJlZk1vZGVsKCkuc2V0dGVyKGVkaXRvcik7XG4gICAgICB0aGlzLmdldFJlZkVsZW1lbnQoKS5zZXR0ZXIoZWRpdG9yLmdldEVsZW1lbnQoKSk7XG5cbiAgICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKHRoaXMucHJvcHMuZGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24pLFxuICAgICAgICBlZGl0b3Iub2JzZXJ2ZVNlbGVjdGlvbnModGhpcy5vYnNlcnZlU2VsZWN0aW9ucyksXG4gICAgICAgIGVkaXRvci5vbkRpZENoYW5nZSh0aGlzLm9ic2VydmVFbXB0aW5lc3MpLFxuICAgICAgKTtcblxuICAgICAgaWYgKGVkaXRvci5pc0VtcHR5KCkgJiYgdGhpcy5wcm9wcy5oaWRlRW1wdGluZXNzKSB7XG4gICAgICAgIGVkaXRvci5nZXRFbGVtZW50KCkuY2xhc3NMaXN0LmFkZChFTVBUWV9DTEFTUyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIGNvbnN0IG1vZGVsUHJvcHMgPSBleHRyYWN0UHJvcHModGhpcy5wcm9wcywgZWRpdG9yVXBkYXRlUHJvcHMpO1xuICAgIHRoaXMuZ2V0UmVmTW9kZWwoKS5tYXAoZWRpdG9yID0+IGVkaXRvci51cGRhdGUobW9kZWxQcm9wcykpO1xuXG4gICAgLy8gV2hlbiB5b3UgbG9vayBpbnRvIHRoZSBhYnlzcywgdGhlIGFieXNzIGFsc28gbG9va3MgaW50byB5b3VcbiAgICB0aGlzLm9ic2VydmVFbXB0aW5lc3MoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuZ2V0UmVmTW9kZWwoKS5tYXAoZWRpdG9yID0+IGVkaXRvci5kZXN0cm95KCkpO1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBvYnNlcnZlU2VsZWN0aW9ucyA9IHNlbGVjdGlvbiA9PiB7XG4gICAgY29uc3Qgc2VsZWN0aW9uU3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgc2VsZWN0aW9uLm9uRGlkQ2hhbmdlUmFuZ2UodGhpcy5wcm9wcy5kaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSksXG4gICAgICBzZWxlY3Rpb24ub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgc2VsZWN0aW9uU3Vicy5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMuc3Vicy5yZW1vdmUoc2VsZWN0aW9uU3Vicyk7XG4gICAgICAgIHRoaXMucHJvcHMuZGlkRGVzdHJveVNlbGVjdGlvbihzZWxlY3Rpb24pO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnMuYWRkKHNlbGVjdGlvblN1YnMpO1xuICAgIHRoaXMucHJvcHMuZGlkQWRkU2VsZWN0aW9uKHNlbGVjdGlvbik7XG4gIH1cblxuICBvYnNlcnZlRW1wdGluZXNzID0gKCkgPT4ge1xuICAgIHRoaXMuZ2V0UmVmTW9kZWwoKS5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGlmIChlZGl0b3IuaXNFbXB0eSgpICYmIHRoaXMucHJvcHMuaGlkZUVtcHRpbmVzcykge1xuICAgICAgICB0aGlzLmdldFJlZkVsZW1lbnQoKS5tYXAoZWxlbWVudCA9PiBlbGVtZW50LmNsYXNzTGlzdC5hZGQoRU1QVFlfQ0xBU1MpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0UmVmRWxlbWVudCgpLm1hcChlbGVtZW50ID0+IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShFTVBUWV9DTEFTUykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBjb250YWlucyhlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVmRWxlbWVudCgpLm1hcChlID0+IGUuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuZ2V0UmVmRWxlbWVudCgpLm1hcChlID0+IGUuZm9jdXMoKSk7XG4gIH1cblxuICBnZXRSZWZNb2RlbCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZWZNb2RlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVmTW9kZWw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnJlZk1vZGVsKSB7XG4gICAgICB0aGlzLnJlZk1vZGVsID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlZk1vZGVsO1xuICB9XG5cbiAgZ2V0UmVmRWxlbWVudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5yZWZFbGVtZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZWZFbGVtZW50O1xuICAgIH1cblxuICAgIGlmICghdGhpcy5yZWZFbGVtZW50KSB7XG4gICAgICB0aGlzLnJlZkVsZW1lbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVmRWxlbWVudDtcbiAgfVxuXG4gIGdldE1vZGVsKCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlZk1vZGVsKCkuZ2V0T3IodW5kZWZpbmVkKTtcbiAgfVxufVxuIl19