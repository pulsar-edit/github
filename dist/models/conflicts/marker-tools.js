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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvY29uZmxpY3RzL21hcmtlci10b29scy5qcyJdLCJuYW1lcyI6WyJkZWxldGVNYXJrZXJJbiIsIm1hcmtlciIsImVkaXRvciIsInNldFRleHRJbkJ1ZmZlclJhbmdlIiwiZ2V0QnVmZmVyUmFuZ2UiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ08sU0FBU0EsY0FBVCxDQUF3QkMsTUFBeEIsRUFBZ0NDLE1BQWhDLEVBQXdDO0FBQzdDQSxFQUFBQSxNQUFNLENBQUNDLG9CQUFQLENBQTRCRixNQUFNLENBQUNHLGNBQVAsRUFBNUIsRUFBcUQsRUFBckQ7QUFDQUgsRUFBQUEsTUFBTSxDQUFDSSxPQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogUHVibGljOiB1dGlsaXR5IGZ1bmN0aW9uIGZvciBDb25mbGljdCBjb21wb25lbnRzIHRvIGRlbGV0ZSBhIERpc3BsYXlNYXJrZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVNYXJrZXJJbihtYXJrZXIsIGVkaXRvcikge1xuICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UobWFya2VyLmdldEJ1ZmZlclJhbmdlKCksICcnKTtcbiAgbWFya2VyLmRlc3Ryb3koKTtcbn1cbiJdfQ==