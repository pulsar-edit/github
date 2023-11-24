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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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