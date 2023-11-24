"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _markerTools = require("./marker-tools");

class Separator {
  constructor(editor, marker) {
    this.editor = editor;
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  delete() {
    (0, _markerTools.deleteMarkerIn)(this.getMarker(), this.editor);
  }

  isModified() {
    const currentText = this.editor.getTextInBufferRange(this.getMarker().getBufferRange());
    return !/^=======\r?\n?$/.test(currentText);
  }

}

exports.default = Separator;