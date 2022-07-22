"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MarkerContext = exports.DecorableContext = void 0;

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
    return /*#__PURE__*/_react.default.createElement(MarkerContext.Provider, {
      value: this.markerHolder
    }, /*#__PURE__*/_react.default.createElement(DecorableContext.Provider, {
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
      return /*#__PURE__*/_react.default.createElement(BareMarker, _extends({}, this.props, {
        markableHolder: this.state.markableHolder
      }));
    }

    return /*#__PURE__*/_react.default.createElement(_markerLayer.MarkerLayerContext.Consumer, null, layerHolder => {
      if (layerHolder) {
        return /*#__PURE__*/_react.default.createElement(BareMarker, _extends({}, this.props, {
          markableHolder: layerHolder
        }));
      } else {
        return /*#__PURE__*/_react.default.createElement(_atomTextEditor.TextEditorContext.Consumer, null, editorHolder => /*#__PURE__*/_react.default.createElement(BareMarker, _extends({}, this.props, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL21hcmtlci5qcyJdLCJuYW1lcyI6WyJNYXJrYWJsZVByb3BUeXBlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJtYXJrQnVmZmVyUmFuZ2UiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm1hcmtlclByb3BzIiwiZXhjbHVzaXZlIiwiYm9vbCIsInJldmVyc2VkIiwiaW52YWxpZGF0ZSIsIm9uZU9mIiwiTWFya2VyQ29udGV4dCIsIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsIkRlY29yYWJsZUNvbnRleHQiLCJCYXJlTWFya2VyIiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsIm1hcmtlclN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwic3VicyIsIm1hcmtlckhvbGRlciIsIlJlZkhvbGRlciIsIm9ic2VydmUiLCJtYXJrZXIiLCJoYW5kbGVNYXJrZXIiLCJkZWNvcmFibGUiLCJob2xkZXIiLCJkZWNvcmF0ZU1ldGhvZCIsImNvbXBvbmVudERpZE1vdW50Iiwib2JzZXJ2ZU1hcmthYmxlIiwicmVuZGVyIiwiY2hpbGRyZW4iLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJtYXJrYWJsZUhvbGRlciIsIk9iamVjdCIsImtleXMiLCJzb21lIiwia2V5IiwibWFwIiwic2V0UHJvcGVydGllcyIsInVwZGF0ZU1hcmtlclBvc2l0aW9uIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiYWRkIiwiY3JlYXRlTWFya2VyIiwib3B0aW9ucyIsIm1hcmthYmxlIiwiaWQiLCJ1bmRlZmluZWQiLCJnZXRNYXJrZXIiLCJFcnJvciIsImJ1ZmZlclJhbmdlIiwiRGlzcG9zYWJsZSIsImRlc3Ryb3kiLCJvbkRpZENoYW5nZSIsImRpZENoYW5nZSIsInNldHRlciIsImhhbmRsZUlEIiwic2V0QnVmZmVyUmFuZ2UiLCJldmVudCIsImlzUmV2ZXJzZWQiLCJnZXRPciIsIm9sZEJ1ZmZlclN0YXJ0UG9zaXRpb24iLCJvbGRIZWFkQnVmZmVyUG9zaXRpb24iLCJvbGRUYWlsQnVmZmVyUG9zaXRpb24iLCJvbGRCdWZmZXJFbmRQb3NpdGlvbiIsIm5ld0J1ZmZlclN0YXJ0UG9zaXRpb24iLCJuZXdIZWFkQnVmZmVyUG9zaXRpb24iLCJuZXdUYWlsQnVmZmVyUG9zaXRpb24iLCJuZXdCdWZmZXJFbmRQb3NpdGlvbiIsIm9sZFJhbmdlIiwiUmFuZ2UiLCJuZXdSYW5nZSIsIm51bWJlciIsIlJhbmdlUHJvcFR5cGUiLCJSZWZIb2xkZXJQcm9wVHlwZSIsIm5vZGUiLCJNYXJrZXIiLCJzdGF0ZSIsIm9uIiwibGF5ZXIiLCJlZGl0b3IiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJtIiwiaXNFbXB0eSIsImxheWVySG9sZGVyIiwiZWRpdG9ySG9sZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLGdCQUFnQixHQUFHQyxtQkFBVUMsS0FBVixDQUFnQjtBQUN2Q0MsRUFBQUEsZUFBZSxFQUFFRixtQkFBVUcsSUFBVixDQUFlQztBQURPLENBQWhCLENBQXpCOztBQUlBLE1BQU1DLFdBQVcsR0FBRztBQUNsQkMsRUFBQUEsU0FBUyxFQUFFTixtQkFBVU8sSUFESDtBQUVsQkMsRUFBQUEsUUFBUSxFQUFFUixtQkFBVU8sSUFGRjtBQUdsQkUsRUFBQUEsVUFBVSxFQUFFVCxtQkFBVVUsS0FBVixDQUFnQixDQUFDLE9BQUQsRUFBVSxVQUFWLEVBQXNCLFNBQXRCLEVBQWlDLFFBQWpDLEVBQTJDLE9BQTNDLENBQWhCO0FBSE0sQ0FBcEI7O0FBTU8sTUFBTUMsYUFBYSxHQUFHQyxlQUFNQyxhQUFOLEVBQXRCOzs7O0FBRUEsTUFBTUMsZ0JBQWdCLEdBQUdGLGVBQU1DLGFBQU4sRUFBekI7Ozs7QUFFUCxNQUFNRSxVQUFOLFNBQXlCSCxlQUFNSSxTQUEvQixDQUF5QztBQWtCdkNDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FB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SSxFQUFBQSxNQUFNLEVBQUVyRixnQkFEUztBQUVqQm9GLEVBQUFBLEtBQUssRUFBRXBGO0FBRlUsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBleHRyYWN0UHJvcHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZSwgUmFuZ2VQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7VGV4dEVkaXRvckNvbnRleHR9IGZyb20gJy4vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQge01hcmtlckxheWVyQ29udGV4dH0gZnJvbSAnLi9tYXJrZXItbGF5ZXInO1xuXG5jb25zdCBNYXJrYWJsZVByb3BUeXBlID0gUHJvcFR5cGVzLnNoYXBlKHtcbiAgbWFya0J1ZmZlclJhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufSk7XG5cbmNvbnN0IG1hcmtlclByb3BzID0ge1xuICBleGNsdXNpdmU6IFByb3BUeXBlcy5ib29sLFxuICByZXZlcnNlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGludmFsaWRhdGU6IFByb3BUeXBlcy5vbmVPZihbJ25ldmVyJywgJ3N1cnJvdW5kJywgJ292ZXJsYXAnLCAnaW5zaWRlJywgJ3RvdWNoJ10pLFxufTtcblxuZXhwb3J0IGNvbnN0IE1hcmtlckNvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBjb25zdCBEZWNvcmFibGVDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCgpO1xuXG5jbGFzcyBCYXJlTWFya2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAuLi5tYXJrZXJQcm9wcyxcbiAgICBpZDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBidWZmZXJSYW5nZTogUmFuZ2VQcm9wVHlwZSxcbiAgICBtYXJrYWJsZUhvbGRlcjogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuICAgIG9uRGlkQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBoYW5kbGVJRDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaGFuZGxlTWFya2VyOiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25EaWRDaGFuZ2U6ICgpID0+IHt9LFxuICAgIGhhbmRsZUlEOiAoKSA9PiB7fSxcbiAgICBoYW5kbGVNYXJrZXI6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBhdXRvYmluZCh0aGlzLCAnY3JlYXRlTWFya2VyJywgJ2RpZENoYW5nZScpO1xuXG4gICAgdGhpcy5tYXJrZXJTdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5tYXJrZXJIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5tYXJrZXJIb2xkZXIub2JzZXJ2ZShtYXJrZXIgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVNYXJrZXIobWFya2VyKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGVjb3JhYmxlID0ge1xuICAgICAgaG9sZGVyOiB0aGlzLm1hcmtlckhvbGRlcixcbiAgICAgIGRlY29yYXRlTWV0aG9kOiAnZGVjb3JhdGVNYXJrZXInLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm9ic2VydmVNYXJrYWJsZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGhpcy5tYXJrZXJIb2xkZXJ9PlxuICAgICAgICA8RGVjb3JhYmxlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGhpcy5kZWNvcmFibGV9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8L0RlY29yYWJsZUNvbnRleHQuUHJvdmlkZXI+XG4gICAgICA8L01hcmtlckNvbnRleHQuUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAocHJldlByb3BzLm1hcmthYmxlSG9sZGVyICE9PSB0aGlzLnByb3BzLm1hcmthYmxlSG9sZGVyKSB7XG4gICAgICB0aGlzLm9ic2VydmVNYXJrYWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChPYmplY3Qua2V5cyhtYXJrZXJQcm9wcykuc29tZShrZXkgPT4gcHJldlByb3BzW2tleV0gIT09IHRoaXMucHJvcHNba2V5XSkpIHtcbiAgICAgIHRoaXMubWFya2VySG9sZGVyLm1hcChtYXJrZXIgPT4gbWFya2VyLnNldFByb3BlcnRpZXMoZXh0cmFjdFByb3BzKHRoaXMucHJvcHMsIG1hcmtlclByb3BzKSkpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlTWFya2VyUG9zaXRpb24oKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBvYnNlcnZlTWFya2FibGUoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vicy5hZGQodGhpcy5wcm9wcy5tYXJrYWJsZUhvbGRlci5vYnNlcnZlKHRoaXMuY3JlYXRlTWFya2VyKSk7XG4gIH1cblxuICBjcmVhdGVNYXJrZXIoKSB7XG4gICAgdGhpcy5tYXJrZXJTdWJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLm1hcmtlclN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vicy5hZGQodGhpcy5tYXJrZXJTdWJzKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBleHRyYWN0UHJvcHModGhpcy5wcm9wcywgbWFya2VyUHJvcHMpO1xuXG4gICAgdGhpcy5wcm9wcy5tYXJrYWJsZUhvbGRlci5tYXAobWFya2FibGUgPT4ge1xuICAgICAgbGV0IG1hcmtlcjtcblxuICAgICAgaWYgKHRoaXMucHJvcHMuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtYXJrZXIgPSBtYXJrYWJsZS5nZXRNYXJrZXIodGhpcy5wcm9wcy5pZCk7XG4gICAgICAgIGlmICghbWFya2VyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1hcmtlciBJRDogJHt0aGlzLnByb3BzLmlkfWApO1xuICAgICAgICB9XG4gICAgICAgIG1hcmtlci5zZXRQcm9wZXJ0aWVzKG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFya2VyID0gbWFya2FibGUubWFya0J1ZmZlclJhbmdlKHRoaXMucHJvcHMuYnVmZmVyUmFuZ2UsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm1hcmtlclN1YnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IG1hcmtlci5kZXN0cm95KCkpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYXJrZXJTdWJzLmFkZChtYXJrZXIub25EaWRDaGFuZ2UodGhpcy5kaWRDaGFuZ2UpKTtcbiAgICAgIHRoaXMubWFya2VySG9sZGVyLnNldHRlcihtYXJrZXIpO1xuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVJRChtYXJrZXIuaWQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVNYXJrZXJQb3NpdGlvbigpIHtcbiAgICB0aGlzLm1hcmtlckhvbGRlci5tYXAobWFya2VyID0+IG1hcmtlci5zZXRCdWZmZXJSYW5nZSh0aGlzLnByb3BzLmJ1ZmZlclJhbmdlKSk7XG4gIH1cblxuICBkaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICBjb25zdCByZXZlcnNlZCA9IHRoaXMubWFya2VySG9sZGVyLm1hcChtYXJrZXIgPT4gbWFya2VyLmlzUmV2ZXJzZWQoKSkuZ2V0T3IoZmFsc2UpO1xuXG4gICAgY29uc3Qgb2xkQnVmZmVyU3RhcnRQb3NpdGlvbiA9IHJldmVyc2VkID8gZXZlbnQub2xkSGVhZEJ1ZmZlclBvc2l0aW9uIDogZXZlbnQub2xkVGFpbEJ1ZmZlclBvc2l0aW9uO1xuICAgIGNvbnN0IG9sZEJ1ZmZlckVuZFBvc2l0aW9uID0gcmV2ZXJzZWQgPyBldmVudC5vbGRUYWlsQnVmZmVyUG9zaXRpb24gOiBldmVudC5vbGRIZWFkQnVmZmVyUG9zaXRpb247XG5cbiAgICBjb25zdCBuZXdCdWZmZXJTdGFydFBvc2l0aW9uID0gcmV2ZXJzZWQgPyBldmVudC5uZXdIZWFkQnVmZmVyUG9zaXRpb24gOiBldmVudC5uZXdUYWlsQnVmZmVyUG9zaXRpb247XG4gICAgY29uc3QgbmV3QnVmZmVyRW5kUG9zaXRpb24gPSByZXZlcnNlZCA/IGV2ZW50Lm5ld1RhaWxCdWZmZXJQb3NpdGlvbiA6IGV2ZW50Lm5ld0hlYWRCdWZmZXJQb3NpdGlvbjtcblxuICAgIHRoaXMucHJvcHMub25EaWRDaGFuZ2Uoe1xuICAgICAgb2xkUmFuZ2U6IG5ldyBSYW5nZShvbGRCdWZmZXJTdGFydFBvc2l0aW9uLCBvbGRCdWZmZXJFbmRQb3NpdGlvbiksXG4gICAgICBuZXdSYW5nZTogbmV3IFJhbmdlKG5ld0J1ZmZlclN0YXJ0UG9zaXRpb24sIG5ld0J1ZmZlckVuZFBvc2l0aW9uKSxcbiAgICAgIC4uLmV2ZW50LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZWRpdG9yOiBNYXJrYWJsZVByb3BUeXBlLFxuICAgIGxheWVyOiBNYXJrYWJsZVByb3BUeXBlLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWFya2FibGVIb2xkZXI6IFJlZkhvbGRlci5vbihwcm9wcy5sYXllciB8fCBwcm9wcy5lZGl0b3IpLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGNvbnN0IG1hcmthYmxlID0gcHJvcHMubGF5ZXIgfHwgcHJvcHMuZWRpdG9yO1xuXG4gICAgaWYgKHN0YXRlLm1hcmthYmxlSG9sZGVyLm1hcChtID0+IG0gPT09IG1hcmthYmxlKS5nZXRPcihtYXJrYWJsZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBtYXJrYWJsZUhvbGRlcjogUmVmSG9sZGVyLm9uKG1hcmthYmxlKSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5tYXJrYWJsZUhvbGRlci5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybiA8QmFyZU1hcmtlciB7Li4udGhpcy5wcm9wc30gbWFya2FibGVIb2xkZXI9e3RoaXMuc3RhdGUubWFya2FibGVIb2xkZXJ9IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyTGF5ZXJDb250ZXh0LkNvbnN1bWVyPlxuICAgICAgICB7bGF5ZXJIb2xkZXIgPT4ge1xuICAgICAgICAgIGlmIChsYXllckhvbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuIDxCYXJlTWFya2VyIHsuLi50aGlzLnByb3BzfSBtYXJrYWJsZUhvbGRlcj17bGF5ZXJIb2xkZXJ9IC8+O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8VGV4dEVkaXRvckNvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgICAgICAgICAge2VkaXRvckhvbGRlciA9PiA8QmFyZU1hcmtlciB7Li4udGhpcy5wcm9wc30gbWFya2FibGVIb2xkZXI9e2VkaXRvckhvbGRlcn0gLz59XG4gICAgICAgICAgICAgIDwvVGV4dEVkaXRvckNvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgIDwvTWFya2VyTGF5ZXJDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==