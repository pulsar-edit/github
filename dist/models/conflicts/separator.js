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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvY29uZmxpY3RzL3NlcGFyYXRvci5qcyJdLCJuYW1lcyI6WyJTZXBhcmF0b3IiLCJjb25zdHJ1Y3RvciIsImVkaXRvciIsIm1hcmtlciIsImdldE1hcmtlciIsImRlbGV0ZSIsImlzTW9kaWZpZWQiLCJjdXJyZW50VGV4dCIsImdldFRleHRJbkJ1ZmZlclJhbmdlIiwiZ2V0QnVmZmVyUmFuZ2UiLCJ0ZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRWUsTUFBTUEsU0FBTixDQUFnQjtBQUM3QkMsRUFBQUEsV0FBVyxDQUFDQyxNQUFELEVBQVNDLE1BQVQsRUFBaUI7QUFDMUIsU0FBS0QsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0Q7O0FBRURDLEVBQUFBLFNBQVMsR0FBRztBQUNWLFdBQU8sS0FBS0QsTUFBWjtBQUNEOztBQUVERSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxxQ0FBZSxLQUFLRCxTQUFMLEVBQWYsRUFBaUMsS0FBS0YsTUFBdEM7QUFDRDs7QUFFREksRUFBQUEsVUFBVSxHQUFHO0FBQ1gsVUFBTUMsV0FBVyxHQUFHLEtBQUtMLE1BQUwsQ0FBWU0sb0JBQVosQ0FBaUMsS0FBS0osU0FBTCxHQUFpQkssY0FBakIsRUFBakMsQ0FBcEI7QUFDQSxXQUFPLENBQUMsa0JBQWtCQyxJQUFsQixDQUF1QkgsV0FBdkIsQ0FBUjtBQUNEOztBQWpCNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RlbGV0ZU1hcmtlcklufSBmcm9tICcuL21hcmtlci10b29scyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcGFyYXRvciB7XG4gIGNvbnN0cnVjdG9yKGVkaXRvciwgbWFya2VyKSB7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXJrZXI7XG4gIH1cblxuICBnZXRNYXJrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgZGVsZXRlKCkge1xuICAgIGRlbGV0ZU1hcmtlckluKHRoaXMuZ2V0TWFya2VyKCksIHRoaXMuZWRpdG9yKTtcbiAgfVxuXG4gIGlzTW9kaWZpZWQoKSB7XG4gICAgY29uc3QgY3VycmVudFRleHQgPSB0aGlzLmVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSh0aGlzLmdldE1hcmtlcigpLmdldEJ1ZmZlclJhbmdlKCkpO1xuICAgIHJldHVybiAhL149PT09PT09XFxyP1xcbj8kLy50ZXN0KGN1cnJlbnRUZXh0KTtcbiAgfVxufVxuIl19