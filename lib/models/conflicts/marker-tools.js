"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMarkerIn = deleteMarkerIn;

/*
 * Public: utility function for Conflict components to delete a DisplayMarker.
 */
function deleteMarkerIn(marker, editor) {
  editor.setTextInBufferRange(marker.getBufferRange(), '');
  marker.destroy();
}