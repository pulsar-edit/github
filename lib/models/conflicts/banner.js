"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _markerTools = require("./marker-tools");

class Banner {
  constructor(editor, marker, description, originalText) {
    this.editor = editor;
    this.marker = marker;
    this.description = description;
    this.originalText = originalText;
  }

  getMarker() {
    return this.marker;
  }

  getRange() {
    return this.marker.getBufferRange();
  }

  isModified() {
    const chomp = line => line.replace(/\r?\n$/, '');

    const text = this.editor.getTextInBufferRange(this.marker.getBufferRange());
    return chomp(text) !== chomp(this.originalText);
  }

  revert() {
    const range = this.getMarker().getBufferRange();
    this.editor.setTextInBufferRange(range, this.originalText);
    this.getMarker().setBufferRange(range);
  }

  delete() {
    (0, _markerTools.deleteMarkerIn)(this.getMarker(), this.editor);
  }

}

exports.default = Banner;