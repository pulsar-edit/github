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
    return /*#__PURE__*/_react.default.createElement(MarkerLayerContext.Provider, {
      value: this.layerHolder
    }, /*#__PURE__*/_react.default.createElement(_marker.DecorableContext.Provider, {
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
    return /*#__PURE__*/_react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editor => /*#__PURE__*/_react.default.createElement(BareMarkerLayer, _extends({
      editor: editor
    }, this.props)));
  }

}

exports.default = MarkerLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL21hcmtlci1sYXllci5qcyJdLCJuYW1lcyI6WyJtYXJrZXJMYXllclByb3BzIiwibWFpbnRhaW5IaXN0b3J5IiwiUHJvcFR5cGVzIiwiYm9vbCIsInBlcnNpc3RlbnQiLCJNYXJrZXJMYXllckNvbnRleHQiLCJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJCYXJlTWFya2VyTGF5ZXIiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJsYXllclN1YiIsIkRpc3Bvc2FibGUiLCJsYXllckhvbGRlciIsIlJlZkhvbGRlciIsInN0YXRlIiwiZWRpdG9ySG9sZGVyIiwib24iLCJlZGl0b3IiLCJkZWNvcmFibGUiLCJob2xkZXIiLCJkZWNvcmF0ZU1ldGhvZCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsIm1hcCIsImUiLCJnZXRPciIsInVuZGVmaW5lZCIsImNvbXBvbmVudERpZE1vdW50Iiwib2JzZXJ2ZUVkaXRvciIsInJlbmRlciIsImNoaWxkcmVuIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiYWRkIiwib2JzZXJ2ZSIsImNyZWF0ZUxheWVyIiwicmVtb3ZlIiwib3B0aW9ucyIsImxheWVyIiwiZXh0ZXJuYWwiLCJnZXRNYXJrZXJMYXllciIsImlkIiwiYnVmZmVyTWFya2VyTGF5ZXIiLCJhZGRNYXJrZXJMYXllciIsImRlc3Ryb3kiLCJoYW5kbGVMYXllciIsImhhbmRsZUlEIiwic2V0dGVyIiwib2JqZWN0Iiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibm9kZSIsImZ1bmMiLCJNYXJrZXJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxnQkFBZ0IsR0FBRztBQUN2QkMsRUFBQUEsZUFBZSxFQUFFQyxtQkFBVUMsSUFESjtBQUV2QkMsRUFBQUEsVUFBVSxFQUFFRixtQkFBVUM7QUFGQyxDQUF6Qjs7QUFLTyxNQUFNRSxrQkFBa0IsR0FBR0MsZUFBTUMsYUFBTixFQUEzQjs7OztBQUVQLE1BQU1DLGVBQU4sU0FBOEJGLGVBQU1HLFNBQXBDLENBQThDO0FBaUI1Q0MsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUVBLDJCQUFTLElBQVQsRUFBZSxhQUFmO0FBRUEsU0FBS0MsSUFBTCxHQUFZLElBQUlDLDZCQUFKLEVBQVo7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQUlDLG9CQUFKLEVBQWhCO0FBRUEsU0FBS0MsV0FBTCxHQUFtQixJQUFJQyxrQkFBSixFQUFuQjtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxZQUFZLEVBQUVGLG1CQUFVRyxFQUFWLENBQWEsS0FBS1QsS0FBTCxDQUFXVSxNQUF4QjtBQURILEtBQWI7QUFJQSxTQUFLQyxTQUFMLEdBQWlCO0FBQ2ZDLE1BQUFBLE1BQU0sRUFBRSxLQUFLUCxXQURFO0FBRWZRLE1BQUFBLGNBQWMsRUFBRTtBQUZELEtBQWpCO0FBSUQ7O0FBRThCLFNBQXhCQyx3QkFBd0IsQ0FBQ2QsS0FBRCxFQUFRTyxLQUFSLEVBQWU7QUFDNUMsUUFBSUEsS0FBSyxDQUFDQyxZQUFOLENBQW1CTyxHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLEtBQUtoQixLQUFLLENBQUNVLE1BQXhDLEVBQWdETyxLQUFoRCxDQUFzRGpCLEtBQUssQ0FBQ1UsTUFBTixLQUFpQlEsU0FBdkUsQ0FBSixFQUF1RjtBQUNyRixhQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFPO0FBQ0xWLE1BQUFBLFlBQVksRUFBRUYsbUJBQVVHLEVBQVYsQ0FBYVQsS0FBSyxDQUFDVSxNQUFuQjtBQURULEtBQVA7QUFHRDs7QUFFRFMsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsU0FBS0MsYUFBTDtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRSw2QkFBQyxrQkFBRCxDQUFvQixRQUFwQjtBQUE2QixNQUFBLEtBQUssRUFBRSxLQUFLaEI7QUFBekMsb0JBQ0UsNkJBQUMsd0JBQUQsQ0FBa0IsUUFBbEI7QUFBMkIsTUFBQSxLQUFLLEVBQUUsS0FBS007QUFBdkMsT0FDRyxLQUFLWCxLQUFMLENBQVdzQixRQURkLENBREYsQ0FERjtBQU9EOztBQUVEQyxFQUFBQSxrQkFBa0IsQ0FBQ0MsU0FBRCxFQUFZQyxTQUFaLEVBQXVCO0FBQ3ZDLFFBQUksS0FBS2xCLEtBQUwsQ0FBV0MsWUFBWCxLQUE0QmlCLFNBQVMsQ0FBQ2pCLFlBQTFDLEVBQXdEO0FBQ3RELFdBQUtZLGFBQUw7QUFDRDtBQUNGOztBQUVETSxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixTQUFLekIsSUFBTCxDQUFVMEIsT0FBVjtBQUNEOztBQUVEUCxFQUFBQSxhQUFhLEdBQUc7QUFDZCxTQUFLbkIsSUFBTCxDQUFVMEIsT0FBVjtBQUNBLFNBQUsxQixJQUFMLEdBQVksSUFBSUMsNkJBQUosRUFBWjtBQUNBLFNBQUtELElBQUwsQ0FBVTJCLEdBQVYsQ0FBYyxLQUFLckIsS0FBTCxDQUFXQyxZQUFYLENBQXdCcUIsT0FBeEIsQ0FBZ0MsS0FBS0MsV0FBckMsQ0FBZDtBQUNEOztBQUVEQSxFQUFBQSxXQUFXLEdBQUc7QUFDWixTQUFLN0IsSUFBTCxDQUFVOEIsTUFBVixDQUFpQixLQUFLNUIsUUFBdEI7QUFDQSxTQUFLQSxRQUFMLENBQWN3QixPQUFkO0FBRUEsU0FBS3BCLEtBQUwsQ0FBV0MsWUFBWCxDQUF3Qk8sR0FBeEIsQ0FBNEJMLE1BQU0sSUFBSTtBQUNwQyxZQUFNc0IsT0FBTyxHQUFHLDJCQUFhLEtBQUtoQyxLQUFsQixFQUF5QlgsZ0JBQXpCLENBQWhCO0FBQ0EsVUFBSTRDLEtBQUo7O0FBQ0EsVUFBSSxLQUFLakMsS0FBTCxDQUFXa0MsUUFBWCxLQUF3QmhCLFNBQTVCLEVBQXVDO0FBQ3JDZSxRQUFBQSxLQUFLLEdBQUd2QixNQUFNLENBQUN5QixjQUFQLENBQXNCLEtBQUtuQyxLQUFMLENBQVdrQyxRQUFYLENBQW9CRSxFQUExQyxDQUFSOztBQUNBLFlBQUksQ0FBQ0gsS0FBTCxFQUFZO0FBQ1YsaUJBQU8sSUFBUDtBQUNEOztBQUNELFlBQUlBLEtBQUssS0FBSyxLQUFLakMsS0FBTCxDQUFXa0MsUUFBckIsSUFBaUNELEtBQUssQ0FBQ0ksaUJBQU4sS0FBNEIsS0FBS3JDLEtBQUwsQ0FBV2tDLFFBQTVFLEVBQXNGO0FBQ3BGO0FBQ0EsaUJBQU8sSUFBUDtBQUNEOztBQUNELGFBQUsvQixRQUFMLEdBQWdCLElBQUlDLG9CQUFKLEVBQWhCO0FBQ0QsT0FWRCxNQVVPO0FBQ0w2QixRQUFBQSxLQUFLLEdBQUd2QixNQUFNLENBQUM0QixjQUFQLENBQXNCTixPQUF0QixDQUFSO0FBQ0EsYUFBSzdCLFFBQUwsR0FBZ0IsSUFBSUMsb0JBQUosQ0FBZSxNQUFNO0FBQ25DNkIsVUFBQUEsS0FBSyxDQUFDTSxPQUFOO0FBQ0EsZUFBS3ZDLEtBQUwsQ0FBV3dDLFdBQVgsQ0FBdUJ0QixTQUF2QjtBQUNBLGVBQUtsQixLQUFMLENBQVd5QyxRQUFYLENBQW9CdkIsU0FBcEI7QUFDRCxTQUplLENBQWhCO0FBS0Q7O0FBQ0QsV0FBS2IsV0FBTCxDQUFpQnFDLE1BQWpCLENBQXdCVCxLQUF4QjtBQUVBLFdBQUtqQyxLQUFMLENBQVd3QyxXQUFYLENBQXVCUCxLQUF2QjtBQUNBLFdBQUtqQyxLQUFMLENBQVd5QyxRQUFYLENBQW9CUixLQUFLLENBQUNHLEVBQTFCO0FBRUEsV0FBS25DLElBQUwsQ0FBVTJCLEdBQVYsQ0FBYyxLQUFLekIsUUFBbkI7QUFFQSxhQUFPLElBQVA7QUFDRCxLQTdCRDtBQThCRDs7QUE5RzJDOztnQkFBeENOLGUsaUNBRUNSLGdCO0FBQ0hxQixFQUFBQSxNQUFNLEVBQUVuQixtQkFBVW9ELE07QUFDbEJULEVBQUFBLFFBQVEsRUFBRTNDLG1CQUFVcUQsS0FBVixDQUFnQjtBQUN4QlIsSUFBQUEsRUFBRSxFQUFFN0MsbUJBQVVzRCxNQUFWLENBQWlCQztBQURHLEdBQWhCLEM7QUFHVnhCLEVBQUFBLFFBQVEsRUFBRS9CLG1CQUFVd0QsSTtBQUNwQk4sRUFBQUEsUUFBUSxFQUFFbEQsbUJBQVV5RCxJO0FBQ3BCUixFQUFBQSxXQUFXLEVBQUVqRCxtQkFBVXlEOzs7Z0JBVHJCbkQsZSxrQkFZa0I7QUFDcEI0QyxFQUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFLENBREU7QUFFcEJELEVBQUFBLFdBQVcsRUFBRSxNQUFNLENBQUU7QUFGRCxDOztBQXFHVCxNQUFNUyxXQUFOLFNBQTBCdEQsZUFBTUcsU0FBaEMsQ0FBMEM7QUFDdkR1QixFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRSw2QkFBQyxpQ0FBRCxDQUFtQixRQUFuQixRQUNHWCxNQUFNLGlCQUFJLDZCQUFDLGVBQUQ7QUFBaUIsTUFBQSxNQUFNLEVBQUVBO0FBQXpCLE9BQXFDLEtBQUtWLEtBQTFDLEVBRGIsQ0FERjtBQUtEOztBQVBzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBleHRyYWN0UHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge1RleHRFZGl0b3JDb250ZXh0fSBmcm9tICcuL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IHtEZWNvcmFibGVDb250ZXh0fSBmcm9tICcuL21hcmtlcic7XG5cbmNvbnN0IG1hcmtlckxheWVyUHJvcHMgPSB7XG4gIG1haW50YWluSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wsXG4gIHBlcnNpc3RlbnQ6IFByb3BUeXBlcy5ib29sLFxufTtcblxuZXhwb3J0IGNvbnN0IE1hcmtlckxheWVyQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoKTtcblxuY2xhc3MgQmFyZU1hcmtlckxheWVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAuLi5tYXJrZXJMYXllclByb3BzLFxuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBleHRlcm5hbDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuICAgIGhhbmRsZUlEOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVMYXllcjogUHJvcFR5cGVzLmZ1bmMsXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoYW5kbGVJRDogKCkgPT4ge30sXG4gICAgaGFuZGxlTGF5ZXI6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBhdXRvYmluZCh0aGlzLCAnY3JlYXRlTGF5ZXInKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5sYXllclN1YiA9IG5ldyBEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLmxheWVySG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlZGl0b3JIb2xkZXI6IFJlZkhvbGRlci5vbih0aGlzLnByb3BzLmVkaXRvciksXG4gICAgfTtcblxuICAgIHRoaXMuZGVjb3JhYmxlID0ge1xuICAgICAgaG9sZGVyOiB0aGlzLmxheWVySG9sZGVyLFxuICAgICAgZGVjb3JhdGVNZXRob2Q6ICdkZWNvcmF0ZU1hcmtlckxheWVyJyxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuZWRpdG9ySG9sZGVyLm1hcChlID0+IGUgPT09IHByb3BzLmVkaXRvcikuZ2V0T3IocHJvcHMuZWRpdG9yID09PSB1bmRlZmluZWQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWRpdG9ySG9sZGVyOiBSZWZIb2xkZXIub24ocHJvcHMuZWRpdG9yKSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5vYnNlcnZlRWRpdG9yKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXJMYXllckNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3RoaXMubGF5ZXJIb2xkZXJ9PlxuICAgICAgICA8RGVjb3JhYmxlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGhpcy5kZWNvcmFibGV9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8L0RlY29yYWJsZUNvbnRleHQuUHJvdmlkZXI+XG4gICAgICA8L01hcmtlckxheWVyQ29udGV4dC5Qcm92aWRlcj5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdG9ySG9sZGVyICE9PSBwcmV2U3RhdGUuZWRpdG9ySG9sZGVyKSB7XG4gICAgICB0aGlzLm9ic2VydmVFZGl0b3IoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgb2JzZXJ2ZUVkaXRvcigpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLnN0YXRlLmVkaXRvckhvbGRlci5vYnNlcnZlKHRoaXMuY3JlYXRlTGF5ZXIpKTtcbiAgfVxuXG4gIGNyZWF0ZUxheWVyKCkge1xuICAgIHRoaXMuc3Vicy5yZW1vdmUodGhpcy5sYXllclN1Yik7XG4gICAgdGhpcy5sYXllclN1Yi5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLnN0YXRlLmVkaXRvckhvbGRlci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBleHRyYWN0UHJvcHModGhpcy5wcm9wcywgbWFya2VyTGF5ZXJQcm9wcyk7XG4gICAgICBsZXQgbGF5ZXI7XG4gICAgICBpZiAodGhpcy5wcm9wcy5leHRlcm5hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxheWVyID0gZWRpdG9yLmdldE1hcmtlckxheWVyKHRoaXMucHJvcHMuZXh0ZXJuYWwuaWQpO1xuICAgICAgICBpZiAoIWxheWVyKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxheWVyICE9PSB0aGlzLnByb3BzLmV4dGVybmFsICYmIGxheWVyLmJ1ZmZlck1hcmtlckxheWVyICE9PSB0aGlzLnByb3BzLmV4dGVybmFsKSB7XG4gICAgICAgICAgLy8gT29wcywgc2FtZSBsYXllciBJRCBvbiBhIGRpZmZlcmVudCBUZXh0RWRpdG9yXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXllclN1YiA9IG5ldyBEaXNwb3NhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXllciA9IGVkaXRvci5hZGRNYXJrZXJMYXllcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5sYXllclN1YiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBsYXllci5kZXN0cm95KCk7XG4gICAgICAgICAgdGhpcy5wcm9wcy5oYW5kbGVMYXllcih1bmRlZmluZWQpO1xuICAgICAgICAgIHRoaXMucHJvcHMuaGFuZGxlSUQodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmxheWVySG9sZGVyLnNldHRlcihsYXllcik7XG5cbiAgICAgIHRoaXMucHJvcHMuaGFuZGxlTGF5ZXIobGF5ZXIpO1xuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVJRChsYXllci5pZCk7XG5cbiAgICAgIHRoaXMuc3Vicy5hZGQodGhpcy5sYXllclN1Yik7XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VGV4dEVkaXRvckNvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtlZGl0b3IgPT4gPEJhcmVNYXJrZXJMYXllciBlZGl0b3I9e2VkaXRvcn0gey4uLnRoaXMucHJvcHN9IC8+fVxuICAgICAgPC9UZXh0RWRpdG9yQ29udGV4dC5Db25zdW1lcj5cbiAgICApO1xuICB9XG59XG4iXX0=