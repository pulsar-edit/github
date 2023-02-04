"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _helpers = require("../helpers");
var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));
var _decoration = _interopRequireDefault(require("../atom/decoration"));
var _markerLayer = _interopRequireDefault(require("../atom/marker-layer"));
var _gutter = _interopRequireDefault(require("../atom/gutter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class PatchPreviewView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      lastPatch: null,
      lastFileName: null,
      lastDiffRow: null,
      lastMaxRowCount: null,
      previewPatchBuffer: null
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.multiFilePatch === state.lastPatch && props.fileName === state.lastFileName && props.diffRow === state.lastDiffRow && props.maxRowCount === state.lastMaxRowCount) {
      return null;
    }
    const nextPreviewPatchBuffer = props.multiFilePatch.getPreviewPatchBuffer(props.fileName, props.diffRow, props.maxRowCount);
    let previewPatchBuffer = null;
    if (state.previewPatchBuffer !== null) {
      state.previewPatchBuffer.adopt(nextPreviewPatchBuffer);
      previewPatchBuffer = state.previewPatchBuffer;
    } else {
      previewPatchBuffer = nextPreviewPatchBuffer;
    }
    return {
      lastPatch: props.multiFilePatch,
      lastFileName: props.fileName,
      lastDiffRow: props.diffRow,
      lastMaxRowCount: props.maxRowCount,
      previewPatchBuffer
    };
  }
  render() {
    return _react.default.createElement(_atomTextEditor.default, {
      buffer: this.state.previewPatchBuffer.getBuffer(),
      readOnly: true,
      lineNumberGutterVisible: false,
      autoHeight: true,
      autoWidth: false,
      softWrapped: false
    }, this.props.config.get('github.showDiffIconGutter') && _react.default.createElement(_gutter.default, {
      name: "diff-icons",
      priority: 1,
      type: "line-number",
      className: "icons",
      labelFn: _helpers.blankLabel
    }), this.renderLayerDecorations('addition', 'github-FilePatchView-line--added'), this.renderLayerDecorations('deletion', 'github-FilePatchView-line--deleted'));
  }
  renderLayerDecorations(layerName, className) {
    const layer = this.state.previewPatchBuffer.getLayer(layerName);
    if (layer.getMarkerCount() === 0) {
      return null;
    }
    return _react.default.createElement(_markerLayer.default, {
      external: layer
    }, _react.default.createElement(_decoration.default, {
      type: "line",
      className: className,
      omitEmptyLastRow: false
    }), this.props.config.get('github.showDiffIconGutter') && _react.default.createElement(_decoration.default, {
      type: "line-number",
      gutterName: "diff-icons",
      className: className,
      omitEmptyLastRow: false
    }));
  }
}
exports.default = PatchPreviewView;
_defineProperty(PatchPreviewView, "propTypes", {
  multiFilePatch: _propTypes.default.shape({
    getPreviewPatchBuffer: _propTypes.default.func.isRequired
  }).isRequired,
  fileName: _propTypes.default.string.isRequired,
  diffRow: _propTypes.default.number.isRequired,
  maxRowCount: _propTypes.default.number.isRequired,
  // Atom environment
  config: _propTypes.default.shape({
    get: _propTypes.default.func.isRequired
  })
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYXRjaFByZXZpZXdWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJsYXN0UGF0Y2giLCJsYXN0RmlsZU5hbWUiLCJsYXN0RGlmZlJvdyIsImxhc3RNYXhSb3dDb3VudCIsInByZXZpZXdQYXRjaEJ1ZmZlciIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInByb3BzIiwic3RhdGUiLCJtdWx0aUZpbGVQYXRjaCIsImZpbGVOYW1lIiwiZGlmZlJvdyIsIm1heFJvd0NvdW50IiwibmV4dFByZXZpZXdQYXRjaEJ1ZmZlciIsImdldFByZXZpZXdQYXRjaEJ1ZmZlciIsImFkb3B0IiwicmVuZGVyIiwiZ2V0QnVmZmVyIiwiY29uZmlnIiwiZ2V0IiwiYmxhbmtMYWJlbCIsInJlbmRlckxheWVyRGVjb3JhdGlvbnMiLCJsYXllck5hbWUiLCJjbGFzc05hbWUiLCJsYXllciIsImdldExheWVyIiwiZ2V0TWFya2VyQ291bnQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwibnVtYmVyIl0sInNvdXJjZXMiOlsicGF0Y2gtcHJldmlldy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge2JsYW5rTGFiZWx9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQgRGVjb3JhdGlvbiBmcm9tICcuLi9hdG9tL2RlY29yYXRpb24nO1xuaW1wb3J0IE1hcmtlckxheWVyIGZyb20gJy4uL2F0b20vbWFya2VyLWxheWVyJztcbmltcG9ydCBHdXR0ZXIgZnJvbSAnLi4vYXRvbS9ndXR0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRjaFByZXZpZXdWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtdWx0aUZpbGVQYXRjaDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldFByZXZpZXdQYXRjaEJ1ZmZlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGZpbGVOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgZGlmZlJvdzogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG1heFJvd0NvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgY29uZmlnOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZ2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgbGFzdFBhdGNoOiBudWxsLFxuICAgIGxhc3RGaWxlTmFtZTogbnVsbCxcbiAgICBsYXN0RGlmZlJvdzogbnVsbCxcbiAgICBsYXN0TWF4Um93Q291bnQ6IG51bGwsXG4gICAgcHJldmlld1BhdGNoQnVmZmVyOiBudWxsLFxuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICBpZiAoXG4gICAgICBwcm9wcy5tdWx0aUZpbGVQYXRjaCA9PT0gc3RhdGUubGFzdFBhdGNoICYmXG4gICAgICBwcm9wcy5maWxlTmFtZSA9PT0gc3RhdGUubGFzdEZpbGVOYW1lICYmXG4gICAgICBwcm9wcy5kaWZmUm93ID09PSBzdGF0ZS5sYXN0RGlmZlJvdyAmJlxuICAgICAgcHJvcHMubWF4Um93Q291bnQgPT09IHN0YXRlLmxhc3RNYXhSb3dDb3VudFxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFByZXZpZXdQYXRjaEJ1ZmZlciA9IHByb3BzLm11bHRpRmlsZVBhdGNoLmdldFByZXZpZXdQYXRjaEJ1ZmZlcihcbiAgICAgIHByb3BzLmZpbGVOYW1lLCBwcm9wcy5kaWZmUm93LCBwcm9wcy5tYXhSb3dDb3VudCxcbiAgICApO1xuICAgIGxldCBwcmV2aWV3UGF0Y2hCdWZmZXIgPSBudWxsO1xuICAgIGlmIChzdGF0ZS5wcmV2aWV3UGF0Y2hCdWZmZXIgIT09IG51bGwpIHtcbiAgICAgIHN0YXRlLnByZXZpZXdQYXRjaEJ1ZmZlci5hZG9wdChuZXh0UHJldmlld1BhdGNoQnVmZmVyKTtcbiAgICAgIHByZXZpZXdQYXRjaEJ1ZmZlciA9IHN0YXRlLnByZXZpZXdQYXRjaEJ1ZmZlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlld1BhdGNoQnVmZmVyID0gbmV4dFByZXZpZXdQYXRjaEJ1ZmZlcjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFzdFBhdGNoOiBwcm9wcy5tdWx0aUZpbGVQYXRjaCxcbiAgICAgIGxhc3RGaWxlTmFtZTogcHJvcHMuZmlsZU5hbWUsXG4gICAgICBsYXN0RGlmZlJvdzogcHJvcHMuZGlmZlJvdyxcbiAgICAgIGxhc3RNYXhSb3dDb3VudDogcHJvcHMubWF4Um93Q291bnQsXG4gICAgICBwcmV2aWV3UGF0Y2hCdWZmZXIsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgIGJ1ZmZlcj17dGhpcy5zdGF0ZS5wcmV2aWV3UGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCl9XG4gICAgICAgIHJlYWRPbmx5PXt0cnVlfVxuICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgIGF1dG9IZWlnaHQ9e3RydWV9XG4gICAgICAgIGF1dG9XaWR0aD17ZmFsc2V9XG4gICAgICAgIHNvZnRXcmFwcGVkPXtmYWxzZX0+XG5cbiAgICAgICAge3RoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLnNob3dEaWZmSWNvbkd1dHRlcicpICYmIChcbiAgICAgICAgICA8R3V0dGVyIG5hbWU9XCJkaWZmLWljb25zXCIgcHJpb3JpdHk9ezF9IHR5cGU9XCJsaW5lLW51bWJlclwiIGNsYXNzTmFtZT1cImljb25zXCIgbGFiZWxGbj17YmxhbmtMYWJlbH0gLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJMYXllckRlY29yYXRpb25zKCdhZGRpdGlvbicsICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1hZGRlZCcpfVxuICAgICAgICB7dGhpcy5yZW5kZXJMYXllckRlY29yYXRpb25zKCdkZWxldGlvbicsICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1kZWxldGVkJyl9XG5cbiAgICAgIDwvQXRvbVRleHRFZGl0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxheWVyRGVjb3JhdGlvbnMobGF5ZXJOYW1lLCBjbGFzc05hbWUpIHtcbiAgICBjb25zdCBsYXllciA9IHRoaXMuc3RhdGUucHJldmlld1BhdGNoQnVmZmVyLmdldExheWVyKGxheWVyTmFtZSk7XG4gICAgaWYgKGxheWVyLmdldE1hcmtlckNvdW50KCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyTGF5ZXIgZXh0ZXJuYWw9e2xheWVyfT5cbiAgICAgICAgPERlY29yYXRpb24gdHlwZT1cImxpbmVcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9IC8+XG4gICAgICAgIHt0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5zaG93RGlmZkljb25HdXR0ZXInKSAmJiAoXG4gICAgICAgICAgPERlY29yYXRpb24gdHlwZT1cImxpbmUtbnVtYmVyXCIgZ3V0dGVyTmFtZT1cImRpZmYtaWNvbnNcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9IC8+XG4gICAgICAgICl9XG4gICAgICA8L01hcmtlckxheWVyPlxuICAgICk7XG4g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