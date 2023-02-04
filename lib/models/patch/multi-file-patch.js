"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _bintrees = require("bintrees");
var _patchBuffer = _interopRequireDefault(require("./patch-buffer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class MultiFilePatch {
  static createNull() {
    return new this({
      patchBuffer: new _patchBuffer.default(),
      filePatches: []
    });
  }
  constructor({
    patchBuffer,
    filePatches
  }) {
    _defineProperty(this, "isPatchVisible", filePatchPath => {
      const patch = this.filePatchesByPath.get(filePatchPath);
      if (!patch) {
        return false;
      }
      return patch.getRenderStatus().isVisible();
    });
    _defineProperty(this, "getBufferRowForDiffPosition", (fileName, diffRow) => {
      const offsetIndex = this.diffRowOffsetIndices.get(fileName);
      if (!offsetIndex) {
        // eslint-disable-next-line no-console
        console.error('Attempt to compute buffer row for invalid diff position: file not included', {
          fileName,
          diffRow,
          validFileNames: Array.from(this.diffRowOffsetIndices.keys())
        });
        return null;
      }
      const {
        startBufferRow,
        index
      } = offsetIndex;
      const result = index.lowerBound({
        diffRow
      }).data();
      if (!result) {
        // eslint-disable-next-line no-console
        console.error('Attempt to compute buffer row for invalid diff position: diff row out of range', {
          fileName,
          diffRow
        });
        return null;
      }
      const {
        offset
      } = result;
      return startBufferRow + diffRow - offset;
    });
    this.patchBuffer = patchBuffer;
    this.filePatches = filePatches;
    this.filePatchesByMarker = new Map();
    this.filePatchesByPath = new Map();
    this.hunksByMarker = new Map();

    // Store a map of {diffRow, offset} for each FilePatch where offset is the number of Hunk headers within the current
    // FilePatch that occur before this row in the original diff output.
    this.diffRowOffsetIndices = new Map();
    for (const filePatch of this.filePatches) {
      this.filePatchesByPath.set(filePatch.getPath(), filePatch);
      this.filePatchesByMarker.set(filePatch.getMarker(), filePatch);
      this.populateDiffRowOffsetIndices(filePatch);
    }
  }
  clone(opts = {}) {
    return new this.constructor({
      patchBuffer: opts.patchBuffer !== undefined ? opts.patchBuffer : this.getPatchBuffer(),
      filePatches: opts.filePatches !== undefined ? opts.filePatches : this.getFilePatches()
    });
  }
  getPatchBuffer() {
    return this.patchBuffer;
  }
  getBuffer() {
    return this.getPatchBuffer().getBuffer();
  }
  getPatchLayer() {
    return this.getPatchBuffer().getLayer('patch');
  }
  getHunkLayer() {
    return this.getPatchBuffer().getLayer('hunk');
  }
  getUnchangedLayer() {
    return this.getPatchBuffer().getLayer('unchanged');
  }
  getAdditionLayer() {
    return this.getPatchBuffer().getLayer('addition');
  }
  getDeletionLayer() {
    return this.getPatchBuffer().getLayer('deletion');
  }
  getNoNewlineLayer() {
    return this.getPatchBuffer().getLayer('nonewline');
  }
  getFilePatches() {
    return this.filePatches;
  }
  getPatchForPath(path) {
    return this.filePatchesByPath.get(path);
  }
  getPathSet() {
    return this.getFilePatches().reduce((pathSet, filePatch) => {
      for (const file of [filePatch.getOldFile(), filePatch.getNewFile()]) {
        if (file.isPresent()) {
          pathSet.add(file.getPath());
        }
      }
      return pathSet;
    }, new Set());
  }
  getFilePatchAt(bufferRow) {
    if (bufferRow < 0 || bufferRow > this.patchBuffer.getBuffer().getLastRow()) {
      return undefined;
    }
    const [marker] = this.patchBuffer.findMarkers('patch', {
      intersectsRow: bufferRow
    });
    return this.filePatchesByMarker.get(marker);
  }
  getHunkAt(bufferRow) {
    if (bufferRow < 0) {
      return undefined;
    }
    const [marker] = this.patchBuffer.findMarkers('hunk', {
      intersectsRow: bufferRow
    });
    return this.hunksByMarker.get(marker);
  }
  getStagePatchForLines(selectedLineSet) {
    const nextPatchBuffer = new _patchBuffer.default();
    const nextFilePatches = this.getFilePatchesContaining(selectedLineSet).map(fp => {
      return fp.buildStagePatchForLines(this.getBuffer(), nextPatchBuffer, selectedLineSet);
    });
    return this.clone({
      patchBuffer: nextPatchBuffer,
      filePatches: nextFilePatches
    });
  }
  getStagePatchForHunk(hunk) {
    return this.getStagePatchForLines(new Set(hunk.getBufferRows()));
  }
  getUnstagePatchForLines(selectedLineSet) {
    const nextPatchBuffer = new _patchBuffer.default();
    const nextFilePatches = this.getFilePatchesContaining(selectedLineSet).map(fp => {
      return fp.buildUnstagePatchForLines(this.getBuffer(), nextPatchBuffer, selectedLineSet);
    });
    return this.clone({
      patchBuffer: nextPatchBuffer,
      filePatches: nextFilePatches
    });
  }
  getUnstagePatchForHunk(hunk) {
    return this.getUnstagePatchForLines(new Set(hunk.getBufferRows()));
  }
  getMaxSelectionIndex(selectedRows) {
    if (selectedRows.size === 0) {
      return 0;
    }
    const lastMax = Math.max(...selectedRows);
    let selectionIndex = 0;
    // counts unselected lines in changed regions from the old patch
    // until we get to the bottom-most selected line from the old patch (lastMax).
    patchLoop: for (const filePatch of this.getFilePatches()) {
      for (const hunk of filePatch.getHunks()) {
        let includesMax = false;
        for (const change of hunk.getChanges()) {
          for (const {
            intersection,
            gap
          } of change.intersectRows(selectedRows, true)) {
            // Only include a partial range if this intersection includes the last selected buffer row.
            includesMax = intersection.intersectsRow(lastMax);
            const delta = includesMax ? lastMax - intersection.start.row + 1 : intersection.getRowCount();
            if (gap) {
              // Range of unselected changes.
              selectionIndex += delta;
            }
            if (includesMax) {
              break patchLoop;
            }
          }
        }
      }
    }
    return selectionIndex;
  }
  getSelectionRangeForIndex(selectionIndex) {
    // Iterate over changed lines in this patch in order to find the
    // new row to be selected based on the last selection index.
    // As we walk through the changed lines, we whittle down the
    // remaining lines until we reach the row that corresponds to the
    // last selected index.

    let selectionRow = 0;
    let remainingChangedLines = selectionIndex;
    let foundRow = false;
    let lastChangedRow = 0;
    patchLoop: for (const filePatch of this.getFilePatches()) {
      for (const hunk of filePatch.getHunks()) {
        for (const change of hunk.getChanges()) {
          if (remainingChangedLines < change.bufferRowCount()) {
            selectionRow = change.getStartBufferRow() + remainingChangedLines;
            foundRow = true;
            break patchLoop;
          } else {
            remainingChangedLines -= change.bufferRowCount();
            lastChangedRow = change.getEndBufferRow();
          }
        }
      }
    }

    // If we never got to the last selected index, that means it is
    // no longer present in the new patch (ie. we staged the last line of the file).
    // In this case we want the next selected line to be the last changed row in the file
    if (!foundRow) {
      selectionRow = lastChangedRow;
    }
    return _atom.Range.fromObject([[selectionRow, 0], [selectionRow, Infinity]]);
  }
  isDiffRowOffsetIndexEmpty(filePatchPath) {
    const diffRowOffsetIndex = this.diffRowOffsetIndices.get(filePatchPath);
    return diffRowOffsetIndex.index.size === 0;
  }
  populateDiffRowOffsetIndices(filePatch) {
    let diffRow = 1;
    const index = new _bintrees.RBTree((a, b) => a.diffRow - b.diffRow);
    this.diffRowOffsetIndices.set(filePatch.getPath(), {
      startBufferRow: filePatch.getStartRange().start.row,
      index
    });
    for (let hunkIndex = 0; hunkIndex < filePatch.getHunks().length; hunkIndex++) {
      const hunk = filePatch.getHunks()[hunkIndex];
      this.hunksByMarker.set(hunk.getMarker(), hunk);

      // Advance past the hunk body
      diffRow += hunk.bufferRowCount();
      index.insert({
        diffRow,
        offset: hunkIndex + 1
      });

      // Advance past the next hunk header
      diffRow++;
    }
  }
  adoptBuffer(nextPatchBuffer) {
    nextPatchBuffer.clearAllLayers();
    this.filePatchesByMarker.clear();
    this.hunksByMarker.clear();
    const markerMap = nextPatchBuffer.adopt(this.patchBuffer);
    for (const filePatch of this.getFilePatches()) {
      filePatch.updateMarkers(markerMap);
      this.filePatchesByMarker.set(filePatch.getMarker(), filePatch);
      for (const hunk of filePatch.getHunks()) {
        this.hunksByMarker.set(hunk.getMarker(), hunk);
      }
    }
    this.patchBuffer = nextPatchBuffer;
  }

  /*
   * Efficiently locate the FilePatch instances that contain at least one row from a Set.
   */
  getFilePatchesContaining(rowSet) {
    const sortedRowSet = Array.from(rowSet);
    sortedRowSet.sort((a, b) => a - b);
    const filePatches = [];
    let lastFilePatch = null;
    for (const row of sortedRowSet) {
      // Because the rows are sorted, consecutive rows will almost certainly belong to the same patch, so we can save
      // many avoidable marker index lookups by comparing with the last.
      if (lastFilePatch && lastFilePatch.containsRow(row)) {
        continue;
      }
      lastFilePatch = this.getFilePatchAt(row);
      filePatches.push(lastFilePatch);
    }
    return filePatches;
  }
  anyPresent() {
    return this.patchBuffer !== null && this.filePatches.some(fp => fp.isPresent());
  }
  didAnyChangeExecutableMode() {
    for (const filePatch of this.getFilePatches()) {
      if (filePatch.didChangeExecutableMode()) {
        return true;
      }
    }
    return false;
  }
  anyHaveTypechange() {
    return this.getFilePatches().some(fp => fp.hasTypechange());
  }
  getMaxLineNumberWidth() {
    return this.getFilePatches().reduce((maxWidth, filePatch) => {
      const width = filePatch.getMaxLineNumberWidth();
      return maxWidth >= width ? maxWidth : width;
    }, 0);
  }
  spansMultipleFiles(rows) {
    let lastFilePatch = null;
    for (const row of rows) {
      if (lastFilePatch) {
        if (lastFilePatch.containsRow(row)) {
          continue;
        }
        return true;
      } else {
        lastFilePatch = this.getFilePatchAt(row);
      }
    }
    return false;
  }
  collapseFilePatch(filePatch) {
    const index = this.filePatches.indexOf(filePatch);
    this.filePatchesByMarker.delete(filePatch.getMarker());
    for (const hunk of filePatch.getHunks()) {
      this.hunksByMarker.delete(hunk.getMarker());
    }
    const before = this.getMarkersBefore(index);
    const after = this.getMarkersAfter(index);
    filePatch.triggerCollapseIn(this.patchBuffer, {
      before,
      after
    });
    this.filePatchesByMarker.set(filePatch.getMarker(), filePatch);

    // This hunk collection should be empty, but let's iterate anyway just in case filePatch was already collapsed
    /* istanbul ignore next */
    for (const hunk of filePatch.getHunks()) {
      this.hunksByMarker.set(hunk.getMarker(), hunk);
    }
  }
  expandFilePatch(filePatch) {
    const index = this.filePatches.indexOf(filePatch);
    this.filePatchesByMarker.delete(filePatch.getMarker());
    for (const hunk of filePatch.getHunks()) {
      this.hunksByMarker.delete(hunk.getMarker());
    }
    const before = this.getMarkersBefore(index);
    const after = this.getMarkersAfter(index);
    filePatch.triggerExpandIn(this.patchBuffer, {
      before,
      after
    });
    this.filePatchesByMarker.set(filePatch.getMarker(), filePatch);
    for (const hunk of filePatch.getHunks()) {
      this.hunksByMarker.set(hunk.getMarker(), hunk);
    }

    // if the patch was initially collapsed, we need to calculate
    // the diffRowOffsetIndices to calculate comment position.
    if (this.isDiffRowOffsetIndexEmpty(filePatch.getPath())) {
      this.populateDiffRowOffsetIndices(filePatch);
    }
  }
  getMarkersBefore(filePatchIndex) {
    const before = [];
    let beforeIndex = filePatchIndex - 1;
    while (beforeIndex >= 0) {
      const beforeFilePatch = this.filePatches[beforeIndex];
      before.push(...beforeFilePatch.getEndingMarkers());
      if (!beforeFilePatch.getMarker().getRange().isEmpty()) {
        break;
      }
      beforeIndex--;
    }
    return before;
  }
  getMarkersAfter(filePatchIndex) {
    const after = [];
    let afterIndex = filePatchIndex + 1;
    while (afterIndex < this.filePatches.length) {
      const afterFilePatch = this.filePatches[afterIndex];
      after.push(...afterFilePatch.getStartingMarkers());
      if (!afterFilePatch.getMarker().getRange().isEmpty()) {
        break;
      }
      afterIndex++;
    }
    return after;
  }
  getPreviewPatchBuffer(fileName, diffRow, maxRowCount) {
    const bufferRow = this.getBufferRowForDiffPosition(fileName, diffRow);
    if (bufferRow === null) {
      return new _patchBuffer.default();
    }
    const filePatch = this.getFilePatchAt(bufferRow);
    const filePatchIndex = this.filePatches.indexOf(filePatch);
    const hunk = this.getHunkAt(bufferRow);
    const previewStartRow = Math.max(bufferRow - maxRowCount + 1, hunk.getRange().start.row);
    const previewEndRow = bufferRow;
    const before = this.getMarkersBefore(filePatchIndex);
    const after = this.getMarkersAfter(filePatchIndex);
    const exclude = new Set([...before, ...after]);
    return this.patchBuffer.createSubBuffer([[previewStartRow, 0], [previewEndRow, Infinity]], {
      exclude
    }).patchBuffer;
  }

  /*
   * Construct an apply-able patch String.
   */
  toString() {
    return this.filePatches.map(fp => fp.toStringIn(this.getBuffer())).join('') + '\n';
  }

  /*
   * Construct a string of diagnostic information useful for debugging.
   */
  /* istanbul ignore next */
  inspect() {
    let inspectString = '(MultiFilePatch';
    inspectString += ` filePatchesByMarker=(${Array.from(this.filePatchesByMarker.keys(), m => m.id).join(', ')})`;
    inspectString += ` hunksByMarker=(${Array.from(this.hunksByMarker.keys(), m => m.id).join(', ')})\n`;
    for (const filePatch of this.filePatches) {
      inspectString += filePatch.inspect({
        indent: 2
      });
    }
    inspectString += ')\n';
    return inspectString;
  }

  /* istanbul ignore next */
  isEqual(other) {
    return this.toString() === other.toString();
  }
}
exports.default = MultiFilePatch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNdWx0aUZpbGVQYXRjaCIsImNyZWF0ZU51bGwiLCJwYXRjaEJ1ZmZlciIsIlBhdGNoQnVmZmVyIiwiZmlsZVBhdGNoZXMiLCJjb25zdHJ1Y3RvciIsImZpbGVQYXRjaFBhdGgiLCJwYXRjaCIsImZpbGVQYXRjaGVzQnlQYXRoIiwiZ2V0IiwiZ2V0UmVuZGVyU3RhdHVzIiwiaXNWaXNpYmxlIiwiZmlsZU5hbWUiLCJkaWZmUm93Iiwib2Zmc2V0SW5kZXgiLCJkaWZmUm93T2Zmc2V0SW5kaWNlcyIsImNvbnNvbGUiLCJlcnJvciIsInZhbGlkRmlsZU5hbWVzIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInN0YXJ0QnVmZmVyUm93IiwiaW5kZXgiLCJyZXN1bHQiLCJsb3dlckJvdW5kIiwiZGF0YSIsIm9mZnNldCIsImZpbGVQYXRjaGVzQnlNYXJrZXIiLCJNYXAiLCJodW5rc0J5TWFya2VyIiwiZmlsZVBhdGNoIiwic2V0IiwiZ2V0UGF0aCIsImdldE1hcmtlciIsInBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMiLCJjbG9uZSIsIm9wdHMiLCJ1bmRlZmluZWQiLCJnZXRQYXRjaEJ1ZmZlciIsImdldEZpbGVQYXRjaGVzIiwiZ2V0QnVmZmVyIiwiZ2V0UGF0Y2hMYXllciIsImdldExheWVyIiwiZ2V0SHVua0xheWVyIiwiZ2V0VW5jaGFuZ2VkTGF5ZXIiLCJnZXRBZGRpdGlvbkxheWVyIiwiZ2V0RGVsZXRpb25MYXllciIsImdldE5vTmV3bGluZUxheWVyIiwiZ2V0UGF0Y2hGb3JQYXRoIiwicGF0aCIsImdldFBhdGhTZXQiLCJyZWR1Y2UiLCJwYXRoU2V0IiwiZmlsZSIsImdldE9sZEZpbGUiLCJnZXROZXdGaWxlIiwiaXNQcmVzZW50IiwiYWRkIiwiU2V0IiwiZ2V0RmlsZVBhdGNoQXQiLCJidWZmZXJSb3ciLCJnZXRMYXN0Um93IiwibWFya2VyIiwiZmluZE1hcmtlcnMiLCJpbnRlcnNlY3RzUm93IiwiZ2V0SHVua0F0IiwiZ2V0U3RhZ2VQYXRjaEZvckxpbmVzIiwic2VsZWN0ZWRMaW5lU2V0IiwibmV4dFBhdGNoQnVmZmVyIiwibmV4dEZpbGVQYXRjaGVzIiwiZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nIiwibWFwIiwiZnAiLCJidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyIsImdldFN0YWdlUGF0Y2hGb3JIdW5rIiwiaHVuayIsImdldEJ1ZmZlclJvd3MiLCJnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMiLCJnZXRVbnN0YWdlUGF0Y2hGb3JIdW5rIiwiZ2V0TWF4U2VsZWN0aW9uSW5kZXgiLCJzZWxlY3RlZFJvd3MiLCJzaXplIiwibGFzdE1heCIsIk1hdGgiLCJtYXgiLCJzZWxlY3Rpb25JbmRleCIsInBhdGNoTG9vcCIsImdldEh1bmtzIiwiaW5jbHVkZXNNYXgiLCJjaGFuZ2UiLCJnZXRDaGFuZ2VzIiwiaW50ZXJzZWN0aW9uIiwiZ2FwIiwiaW50ZXJzZWN0Um93cyIsImRlbHRhIiwic3RhcnQiLCJyb3ciLCJnZXRSb3dDb3VudCIsImdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgiLCJzZWxlY3Rpb25Sb3ciLCJyZW1haW5pbmdDaGFuZ2VkTGluZXMiLCJmb3VuZFJvdyIsImxhc3RDaGFuZ2VkUm93IiwiYnVmZmVyUm93Q291bnQiLCJnZXRTdGFydEJ1ZmZlclJvdyIsImdldEVuZEJ1ZmZlclJvdyIsIlJhbmdlIiwiZnJvbU9iamVjdCIsIkluZmluaXR5IiwiaXNEaWZmUm93T2Zmc2V0SW5kZXhFbXB0eSIsImRpZmZSb3dPZmZzZXRJbmRleCIsIlJCVHJlZSIsImEiLCJiIiwiZ2V0U3RhcnRSYW5nZSIsImh1bmtJbmRleCIsImxlbmd0aCIsImluc2VydCIsImFkb3B0QnVmZmVyIiwiY2xlYXJBbGxMYXllcnMiLCJjbGVhciIsIm1hcmtlck1hcCIsImFkb3B0IiwidXBkYXRlTWFya2VycyIsInJvd1NldCIsInNvcnRlZFJvd1NldCIsInNvcnQiLCJsYXN0RmlsZVBhdGNoIiwiY29udGFpbnNSb3ciLCJwdXNoIiwiYW55UHJlc2VudCIsInNvbWUiLCJkaWRBbnlDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsImRpZENoYW5nZUV4ZWN1dGFibGVNb2RlIiwiYW55SGF2ZVR5cGVjaGFuZ2UiLCJoYXNUeXBlY2hhbmdlIiwiZ2V0TWF4TGluZU51bWJlcldpZHRoIiwibWF4V2lkdGgiLCJ3aWR0aCIsInNwYW5zTXVsdGlwbGVGaWxlcyIsInJvd3MiLCJjb2xsYXBzZUZpbGVQYXRjaCIsImluZGV4T2YiLCJkZWxldGUiLCJiZWZvcmUiLCJnZXRNYXJrZXJzQmVmb3JlIiwiYWZ0ZXIiLCJnZXRNYXJrZXJzQWZ0ZXIiLCJ0cmlnZ2VyQ29sbGFwc2VJbiIsImV4cGFuZEZpbGVQYXRjaCIsInRyaWdnZXJFeHBhbmRJbiIsImZpbGVQYXRjaEluZGV4IiwiYmVmb3JlSW5kZXgiLCJiZWZvcmVGaWxlUGF0Y2giLCJnZXRFbmRpbmdNYXJrZXJzIiwiZ2V0UmFuZ2UiLCJpc0VtcHR5IiwiYWZ0ZXJJbmRleCIsImFmdGVyRmlsZVBhdGNoIiwiZ2V0U3RhcnRpbmdNYXJrZXJzIiwiZ2V0UHJldmlld1BhdGNoQnVmZmVyIiwibWF4Um93Q291bnQiLCJnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24iLCJwcmV2aWV3U3RhcnRSb3ciLCJwcmV2aWV3RW5kUm93IiwiZXhjbHVkZSIsImNyZWF0ZVN1YkJ1ZmZlciIsInRvU3RyaW5nIiwidG9TdHJpbmdJbiIsImpvaW4iLCJpbnNwZWN0IiwiaW5zcGVjdFN0cmluZyIsIm0iLCJpZCIsImluZGVudCIsImlzRXF1YWwiLCJvdGhlciJdLCJzb3VyY2VzIjpbIm11bHRpLWZpbGUtcGF0Y2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge1JCVHJlZX0gZnJvbSAnYmludHJlZXMnO1xuXG5pbXBvcnQgUGF0Y2hCdWZmZXIgZnJvbSAnLi9wYXRjaC1idWZmZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aUZpbGVQYXRjaCB7XG4gIHN0YXRpYyBjcmVhdGVOdWxsKCkge1xuICAgIHJldHVybiBuZXcgdGhpcyh7cGF0Y2hCdWZmZXI6IG5ldyBQYXRjaEJ1ZmZlcigpLCBmaWxlUGF0Y2hlczogW119KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtwYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXN9KSB7XG4gICAgdGhpcy5wYXRjaEJ1ZmZlciA9IHBhdGNoQnVmZmVyO1xuICAgIHRoaXMuZmlsZVBhdGNoZXMgPSBmaWxlUGF0Y2hlcztcblxuICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlciA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuaHVua3NCeU1hcmtlciA9IG5ldyBNYXAoKTtcblxuICAgIC8vIFN0b3JlIGEgbWFwIG9mIHtkaWZmUm93LCBvZmZzZXR9IGZvciBlYWNoIEZpbGVQYXRjaCB3aGVyZSBvZmZzZXQgaXMgdGhlIG51bWJlciBvZiBIdW5rIGhlYWRlcnMgd2l0aGluIHRoZSBjdXJyZW50XG4gICAgLy8gRmlsZVBhdGNoIHRoYXQgb2NjdXIgYmVmb3JlIHRoaXMgcm93IGluIHRoZSBvcmlnaW5hbCBkaWZmIG91dHB1dC5cbiAgICB0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzID0gbmV3IE1hcCgpO1xuXG4gICAgZm9yIChjb25zdCBmaWxlUGF0Y2ggb2YgdGhpcy5maWxlUGF0Y2hlcykge1xuICAgICAgdGhpcy5maWxlUGF0Y2hlc0J5UGF0aC5zZXQoZmlsZVBhdGNoLmdldFBhdGgoKSwgZmlsZVBhdGNoKTtcbiAgICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5zZXQoZmlsZVBhdGNoLmdldE1hcmtlcigpLCBmaWxlUGF0Y2gpO1xuXG4gICAgICB0aGlzLnBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMoZmlsZVBhdGNoKTtcbiAgICB9XG4gIH1cblxuICBjbG9uZShvcHRzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Ioe1xuICAgICAgcGF0Y2hCdWZmZXI6IG9wdHMucGF0Y2hCdWZmZXIgIT09IHVuZGVmaW5lZCA/IG9wdHMucGF0Y2hCdWZmZXIgOiB0aGlzLmdldFBhdGNoQnVmZmVyKCksXG4gICAgICBmaWxlUGF0Y2hlczogb3B0cy5maWxlUGF0Y2hlcyAhPT0gdW5kZWZpbmVkID8gb3B0cy5maWxlUGF0Y2hlcyA6IHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFBhdGNoQnVmZmVyKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoQnVmZmVyO1xuICB9XG5cbiAgZ2V0QnVmZmVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0QnVmZmVyKCk7XG4gIH1cblxuICBnZXRQYXRjaExheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ3BhdGNoJyk7XG4gIH1cblxuICBnZXRIdW5rTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignaHVuaycpO1xuICB9XG5cbiAgZ2V0VW5jaGFuZ2VkTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcigndW5jaGFuZ2VkJyk7XG4gIH1cblxuICBnZXRBZGRpdGlvbkxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ2FkZGl0aW9uJyk7XG4gIH1cblxuICBnZXREZWxldGlvbkxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ2RlbGV0aW9uJyk7XG4gIH1cblxuICBnZXROb05ld2xpbmVMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdub25ld2xpbmUnKTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzO1xuICB9XG5cbiAgZ2V0UGF0Y2hGb3JQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0Y2hlc0J5UGF0aC5nZXQocGF0aCk7XG4gIH1cblxuICBnZXRQYXRoU2V0KCkge1xuICAgIHJldHVybiB0aGlzLmdldEZpbGVQYXRjaGVzKCkucmVkdWNlKChwYXRoU2V0LCBmaWxlUGF0Y2gpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBbZmlsZVBhdGNoLmdldE9sZEZpbGUoKSwgZmlsZVBhdGNoLmdldE5ld0ZpbGUoKV0pIHtcbiAgICAgICAgaWYgKGZpbGUuaXNQcmVzZW50KCkpIHtcbiAgICAgICAgICBwYXRoU2V0LmFkZChmaWxlLmdldFBhdGgoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXRoU2V0O1xuICAgIH0sIG5ldyBTZXQoKSk7XG4gIH1cblxuICBnZXRGaWxlUGF0Y2hBdChidWZmZXJSb3cpIHtcbiAgICBpZiAoYnVmZmVyUm93IDwgMCB8fCBidWZmZXJSb3cgPiB0aGlzLnBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldExhc3RSb3coKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgW21hcmtlcl0gPSB0aGlzLnBhdGNoQnVmZmVyLmZpbmRNYXJrZXJzKCdwYXRjaCcsIHtpbnRlcnNlY3RzUm93OiBidWZmZXJSb3d9KTtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmdldChtYXJrZXIpO1xuICB9XG5cbiAgZ2V0SHVua0F0KGJ1ZmZlclJvdykge1xuICAgIGlmIChidWZmZXJSb3cgPCAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBbbWFya2VyXSA9IHRoaXMucGF0Y2hCdWZmZXIuZmluZE1hcmtlcnMoJ2h1bmsnLCB7aW50ZXJzZWN0c1JvdzogYnVmZmVyUm93fSk7XG4gICAgcmV0dXJuIHRoaXMuaHVua3NCeU1hcmtlci5nZXQobWFya2VyKTtcbiAgfVxuXG4gIGdldFN0YWdlUGF0Y2hGb3JMaW5lcyhzZWxlY3RlZExpbmVTZXQpIHtcbiAgICBjb25zdCBuZXh0UGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICBjb25zdCBuZXh0RmlsZVBhdGNoZXMgPSB0aGlzLmdldEZpbGVQYXRjaGVzQ29udGFpbmluZyhzZWxlY3RlZExpbmVTZXQpLm1hcChmcCA9PiB7XG4gICAgICByZXR1cm4gZnAuYnVpbGRTdGFnZVBhdGNoRm9yTGluZXModGhpcy5nZXRCdWZmZXIoKSwgbmV4dFBhdGNoQnVmZmVyLCBzZWxlY3RlZExpbmVTZXQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtwYXRjaEJ1ZmZlcjogbmV4dFBhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlczogbmV4dEZpbGVQYXRjaGVzfSk7XG4gIH1cblxuICBnZXRTdGFnZVBhdGNoRm9ySHVuayhodW5rKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhZ2VQYXRjaEZvckxpbmVzKG5ldyBTZXQoaHVuay5nZXRCdWZmZXJSb3dzKCkpKTtcbiAgfVxuXG4gIGdldFVuc3RhZ2VQYXRjaEZvckxpbmVzKHNlbGVjdGVkTGluZVNldCkge1xuICAgIGNvbnN0IG5leHRQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgIGNvbnN0IG5leHRGaWxlUGF0Y2hlcyA9IHRoaXMuZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nKHNlbGVjdGVkTGluZVNldCkubWFwKGZwID0+IHtcbiAgICAgIHJldHVybiBmcC5idWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzKHRoaXMuZ2V0QnVmZmVyKCksIG5leHRQYXRjaEJ1ZmZlciwgc2VsZWN0ZWRMaW5lU2V0KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7cGF0Y2hCdWZmZXI6IG5leHRQYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXM6IG5leHRGaWxlUGF0Y2hlc30pO1xuICB9XG5cbiAgZ2V0VW5zdGFnZVBhdGNoRm9ySHVuayhodW5rKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMobmV3IFNldChodW5rLmdldEJ1ZmZlclJvd3MoKSkpO1xuICB9XG5cbiAgZ2V0TWF4U2VsZWN0aW9uSW5kZXgoc2VsZWN0ZWRSb3dzKSB7XG4gICAgaWYgKHNlbGVjdGVkUm93cy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0TWF4ID0gTWF0aC5tYXgoLi4uc2VsZWN0ZWRSb3dzKTtcblxuICAgIGxldCBzZWxlY3Rpb25JbmRleCA9IDA7XG4gICAgLy8gY291bnRzIHVuc2VsZWN0ZWQgbGluZXMgaW4gY2hhbmdlZCByZWdpb25zIGZyb20gdGhlIG9sZCBwYXRjaFxuICAgIC8vIHVudGlsIHdlIGdldCB0byB0aGUgYm90dG9tLW1vc3Qgc2VsZWN0ZWQgbGluZSBmcm9tIHRoZSBvbGQgcGF0Y2ggKGxhc3RNYXgpLlxuICAgIHBhdGNoTG9vcDogZm9yIChjb25zdCBmaWxlUGF0Y2ggb2YgdGhpcy5nZXRGaWxlUGF0Y2hlcygpKSB7XG4gICAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgICAgbGV0IGluY2x1ZGVzTWF4ID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgaHVuay5nZXRDaGFuZ2VzKCkpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHtpbnRlcnNlY3Rpb24sIGdhcH0gb2YgY2hhbmdlLmludGVyc2VjdFJvd3Moc2VsZWN0ZWRSb3dzLCB0cnVlKSkge1xuICAgICAgICAgICAgLy8gT25seSBpbmNsdWRlIGEgcGFydGlhbCByYW5nZSBpZiB0aGlzIGludGVyc2VjdGlvbiBpbmNsdWRlcyB0aGUgbGFzdCBzZWxlY3RlZCBidWZmZXIgcm93LlxuICAgICAgICAgICAgaW5jbHVkZXNNYXggPSBpbnRlcnNlY3Rpb24uaW50ZXJzZWN0c1JvdyhsYXN0TWF4KTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gaW5jbHVkZXNNYXggPyBsYXN0TWF4IC0gaW50ZXJzZWN0aW9uLnN0YXJ0LnJvdyArIDEgOiBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcblxuICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAvLyBSYW5nZSBvZiB1bnNlbGVjdGVkIGNoYW5nZXMuXG4gICAgICAgICAgICAgIHNlbGVjdGlvbkluZGV4ICs9IGRlbHRhO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5jbHVkZXNNYXgpIHtcbiAgICAgICAgICAgICAgYnJlYWsgcGF0Y2hMb29wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3Rpb25JbmRleDtcbiAgfVxuXG4gIGdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgoc2VsZWN0aW9uSW5kZXgpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgY2hhbmdlZCBsaW5lcyBpbiB0aGlzIHBhdGNoIGluIG9yZGVyIHRvIGZpbmQgdGhlXG4gICAgLy8gbmV3IHJvdyB0byBiZSBzZWxlY3RlZCBiYXNlZCBvbiB0aGUgbGFzdCBzZWxlY3Rpb24gaW5kZXguXG4gICAgLy8gQXMgd2Ugd2FsayB0aHJvdWdoIHRoZSBjaGFuZ2VkIGxpbmVzLCB3ZSB3aGl0dGxlIGRvd24gdGhlXG4gICAgLy8gcmVtYWluaW5nIGxpbmVzIHVudGlsIHdlIHJlYWNoIHRoZSByb3cgdGhhdCBjb3JyZXNwb25kcyB0byB0aGVcbiAgICAvLyBsYXN0IHNlbGVjdGVkIGluZGV4LlxuXG4gICAgbGV0IHNlbGVjdGlvblJvdyA9IDA7XG4gICAgbGV0IHJlbWFpbmluZ0NoYW5nZWRMaW5lcyA9IHNlbGVjdGlvbkluZGV4O1xuXG4gICAgbGV0IGZvdW5kUm93ID0gZmFsc2U7XG4gICAgbGV0IGxhc3RDaGFuZ2VkUm93ID0gMDtcblxuICAgIHBhdGNoTG9vcDogZm9yIChjb25zdCBmaWxlUGF0Y2ggb2YgdGhpcy5nZXRGaWxlUGF0Y2hlcygpKSB7XG4gICAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgaHVuay5nZXRDaGFuZ2VzKCkpIHtcbiAgICAgICAgICBpZiAocmVtYWluaW5nQ2hhbmdlZExpbmVzIDwgY2hhbmdlLmJ1ZmZlclJvd0NvdW50KCkpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvblJvdyA9IGNoYW5nZS5nZXRTdGFydEJ1ZmZlclJvdygpICsgcmVtYWluaW5nQ2hhbmdlZExpbmVzO1xuICAgICAgICAgICAgZm91bmRSb3cgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWsgcGF0Y2hMb29wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZW1haW5pbmdDaGFuZ2VkTGluZXMgLT0gY2hhbmdlLmJ1ZmZlclJvd0NvdW50KCk7XG4gICAgICAgICAgICBsYXN0Q2hhbmdlZFJvdyA9IGNoYW5nZS5nZXRFbmRCdWZmZXJSb3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBuZXZlciBnb3QgdG8gdGhlIGxhc3Qgc2VsZWN0ZWQgaW5kZXgsIHRoYXQgbWVhbnMgaXQgaXNcbiAgICAvLyBubyBsb25nZXIgcHJlc2VudCBpbiB0aGUgbmV3IHBhdGNoIChpZS4gd2Ugc3RhZ2VkIHRoZSBsYXN0IGxpbmUgb2YgdGhlIGZpbGUpLlxuICAgIC8vIEluIHRoaXMgY2FzZSB3ZSB3YW50IHRoZSBuZXh0IHNlbGVjdGVkIGxpbmUgdG8gYmUgdGhlIGxhc3QgY2hhbmdlZCByb3cgaW4gdGhlIGZpbGVcbiAgICBpZiAoIWZvdW5kUm93KSB7XG4gICAgICBzZWxlY3Rpb25Sb3cgPSBsYXN0Q2hhbmdlZFJvdztcbiAgICB9XG5cbiAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbW3NlbGVjdGlvblJvdywgMF0sIFtzZWxlY3Rpb25Sb3csIEluZmluaXR5XV0pO1xuICB9XG5cbiAgaXNEaWZmUm93T2Zmc2V0SW5kZXhFbXB0eShmaWxlUGF0Y2hQYXRoKSB7XG4gICAgY29uc3QgZGlmZlJvd09mZnNldEluZGV4ID0gdGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcy5nZXQoZmlsZVBhdGNoUGF0aCk7XG4gICAgcmV0dXJuIGRpZmZSb3dPZmZzZXRJbmRleC5pbmRleC5zaXplID09PSAwO1xuICB9XG5cbiAgcG9wdWxhdGVEaWZmUm93T2Zmc2V0SW5kaWNlcyhmaWxlUGF0Y2gpIHtcbiAgICBsZXQgZGlmZlJvdyA9IDE7XG4gICAgY29uc3QgaW5kZXggPSBuZXcgUkJUcmVlKChhLCBiKSA9PiBhLmRpZmZSb3cgLSBiLmRpZmZSb3cpO1xuICAgIHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMuc2V0KGZpbGVQYXRjaC5nZXRQYXRoKCksIHtzdGFydEJ1ZmZlclJvdzogZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKS5zdGFydC5yb3csIGluZGV4fSk7XG5cbiAgICBmb3IgKGxldCBodW5rSW5kZXggPSAwOyBodW5rSW5kZXggPCBmaWxlUGF0Y2guZ2V0SHVua3MoKS5sZW5ndGg7IGh1bmtJbmRleCsrKSB7XG4gICAgICBjb25zdCBodW5rID0gZmlsZVBhdGNoLmdldEh1bmtzKClbaHVua0luZGV4XTtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG5cbiAgICAgIC8vIEFkdmFuY2UgcGFzdCB0aGUgaHVuayBib2R5XG4gICAgICBkaWZmUm93ICs9IGh1bmsuYnVmZmVyUm93Q291bnQoKTtcbiAgICAgIGluZGV4Lmluc2VydCh7ZGlmZlJvdywgb2Zmc2V0OiBodW5rSW5kZXggKyAxfSk7XG5cbiAgICAgIC8vIEFkdmFuY2UgcGFzdCB0aGUgbmV4dCBodW5rIGhlYWRlclxuICAgICAgZGlmZlJvdysrO1xuICAgIH1cbiAgfVxuXG4gIGFkb3B0QnVmZmVyKG5leHRQYXRjaEJ1ZmZlcikge1xuICAgIG5leHRQYXRjaEJ1ZmZlci5jbGVhckFsbExheWVycygpO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmNsZWFyKCk7XG4gICAgdGhpcy5odW5rc0J5TWFya2VyLmNsZWFyKCk7XG5cbiAgICBjb25zdCBtYXJrZXJNYXAgPSBuZXh0UGF0Y2hCdWZmZXIuYWRvcHQodGhpcy5wYXRjaEJ1ZmZlcik7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZpbGVQYXRjaC51cGRhdGVNYXJrZXJzKG1hcmtlck1hcCk7XG4gICAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcblxuICAgICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYXRjaEJ1ZmZlciA9IG5leHRQYXRjaEJ1ZmZlcjtcbiAgfVxuXG4gIC8qXG4gICAqIEVmZmljaWVudGx5IGxvY2F0ZSB0aGUgRmlsZVBhdGNoIGluc3RhbmNlcyB0aGF0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIHJvdyBmcm9tIGEgU2V0LlxuICAgKi9cbiAgZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nKHJvd1NldCkge1xuICAgIGNvbnN0IHNvcnRlZFJvd1NldCA9IEFycmF5LmZyb20ocm93U2V0KTtcbiAgICBzb3J0ZWRSb3dTZXQuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXG4gICAgY29uc3QgZmlsZVBhdGNoZXMgPSBbXTtcbiAgICBsZXQgbGFzdEZpbGVQYXRjaCA9IG51bGw7XG4gICAgZm9yIChjb25zdCByb3cgb2Ygc29ydGVkUm93U2V0KSB7XG4gICAgICAvLyBCZWNhdXNlIHRoZSByb3dzIGFyZSBzb3J0ZWQsIGNvbnNlY3V0aXZlIHJvd3Mgd2lsbCBhbG1vc3QgY2VydGFpbmx5IGJlbG9uZyB0byB0aGUgc2FtZSBwYXRjaCwgc28gd2UgY2FuIHNhdmVcbiAgICAgIC8vIG1hbnkgYXZvaWRhYmxlIG1hcmtlciBpbmRleCBsb29rdXBzIGJ5IGNvbXBhcmluZyB3aXRoIHRoZSBsYXN0LlxuICAgICAgaWYgKGxhc3RGaWxlUGF0Y2ggJiYgbGFzdEZpbGVQYXRjaC5jb250YWluc1Jvdyhyb3cpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsYXN0RmlsZVBhdGNoID0gdGhpcy5nZXRGaWxlUGF0Y2hBdChyb3cpO1xuICAgICAgZmlsZVBhdGNoZXMucHVzaChsYXN0RmlsZVBhdGNoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZVBhdGNoZXM7XG4gIH1cblxuICBhbnlQcmVzZW50KCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoQnVmZmVyICE9PSBudWxsICYmIHRoaXMuZmlsZVBhdGNoZXMuc29tZShmcCA9PiBmcC5pc1ByZXNlbnQoKSk7XG4gIH1cblxuICBkaWRBbnlDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpIHtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGlmIChmaWxlUGF0Y2guZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYW55SGF2ZVR5cGVjaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKS5zb21lKGZwID0+IGZwLmhhc1R5cGVjaGFuZ2UoKSk7XG4gIH1cblxuICBnZXRNYXhMaW5lTnVtYmVyV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKS5yZWR1Y2UoKG1heFdpZHRoLCBmaWxlUGF0Y2gpID0+IHtcbiAgICAgIGNvbnN0IHdpZHRoID0gZmlsZVBhdGNoLmdldE1heExpbmVOdW1iZXJXaWR0aCgpO1xuICAgICAgcmV0dXJuIG1heFdpZHRoID49IHdpZHRoID8gbWF4V2lkdGggOiB3aWR0aDtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHNwYW5zTXVsdGlwbGVGaWxlcyhyb3dzKSB7XG4gICAgbGV0IGxhc3RGaWxlUGF0Y2ggPSBudWxsO1xuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgIGlmIChsYXN0RmlsZVBhdGNoKSB7XG4gICAgICAgIGlmIChsYXN0RmlsZVBhdGNoLmNvbnRhaW5zUm93KHJvdykpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFzdEZpbGVQYXRjaCA9IHRoaXMuZ2V0RmlsZVBhdGNoQXQocm93KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29sbGFwc2VGaWxlUGF0Y2goZmlsZVBhdGNoKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbGVQYXRjaGVzLmluZGV4T2YoZmlsZVBhdGNoKTtcblxuICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5kZWxldGUoZmlsZVBhdGNoLmdldE1hcmtlcigpKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5kZWxldGUoaHVuay5nZXRNYXJrZXIoKSk7XG4gICAgfVxuXG4gICAgY29uc3QgYmVmb3JlID0gdGhpcy5nZXRNYXJrZXJzQmVmb3JlKGluZGV4KTtcbiAgICBjb25zdCBhZnRlciA9IHRoaXMuZ2V0TWFya2Vyc0FmdGVyKGluZGV4KTtcblxuICAgIGZpbGVQYXRjaC50cmlnZ2VyQ29sbGFwc2VJbih0aGlzLnBhdGNoQnVmZmVyLCB7YmVmb3JlLCBhZnRlcn0pO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLnNldChmaWxlUGF0Y2guZ2V0TWFya2VyKCksIGZpbGVQYXRjaCk7XG5cbiAgICAvLyBUaGlzIGh1bmsgY29sbGVjdGlvbiBzaG91bGQgYmUgZW1wdHksIGJ1dCBsZXQncyBpdGVyYXRlIGFueXdheSBqdXN0IGluIGNhc2UgZmlsZVBhdGNoIHdhcyBhbHJlYWR5IGNvbGxhcHNlZFxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuc2V0KGh1bmsuZ2V0TWFya2VyKCksIGh1bmspO1xuICAgIH1cbiAgfVxuXG4gIGV4cGFuZEZpbGVQYXRjaChmaWxlUGF0Y2gpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmlsZVBhdGNoZXMuaW5kZXhPZihmaWxlUGF0Y2gpO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmRlbGV0ZShmaWxlUGF0Y2guZ2V0TWFya2VyKCkpO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLmRlbGV0ZShodW5rLmdldE1hcmtlcigpKTtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmdldE1hcmtlcnNCZWZvcmUoaW5kZXgpO1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5nZXRNYXJrZXJzQWZ0ZXIoaW5kZXgpO1xuXG4gICAgZmlsZVBhdGNoLnRyaWdnZXJFeHBhbmRJbih0aGlzLnBhdGNoQnVmZmVyLCB7YmVmb3JlLCBhZnRlcn0pO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLnNldChmaWxlUGF0Y2guZ2V0TWFya2VyKCksIGZpbGVQYXRjaCk7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuc2V0KGh1bmsuZ2V0TWFya2VyKCksIGh1bmspO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSBwYXRjaCB3YXMgaW5pdGlhbGx5IGNvbGxhcHNlZCwgd2UgbmVlZCB0byBjYWxjdWxhdGVcbiAgICAvLyB0aGUgZGlmZlJvd09mZnNldEluZGljZXMgdG8gY2FsY3VsYXRlIGNvbW1lbnQgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuaXNEaWZmUm93T2Zmc2V0SW5kZXhFbXB0eShmaWxlUGF0Y2guZ2V0UGF0aCgpKSkge1xuICAgICAgdGhpcy5wb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzKGZpbGVQYXRjaCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TWFya2Vyc0JlZm9yZShmaWxlUGF0Y2hJbmRleCkge1xuICAgIGNvbnN0IGJlZm9yZSA9IFtdO1xuICAgIGxldCBiZWZvcmVJbmRleCA9IGZpbGVQYXRjaEluZGV4IC0gMTtcbiAgICB3aGlsZSAoYmVmb3JlSW5kZXggPj0gMCkge1xuICAgICAgY29uc3QgYmVmb3JlRmlsZVBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc1tiZWZvcmVJbmRleF07XG4gICAgICBiZWZvcmUucHVzaCguLi5iZWZvcmVGaWxlUGF0Y2guZ2V0RW5kaW5nTWFya2VycygpKTtcblxuICAgICAgaWYgKCFiZWZvcmVGaWxlUGF0Y2guZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5pc0VtcHR5KCkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBiZWZvcmVJbmRleC0tO1xuICAgIH1cbiAgICByZXR1cm4gYmVmb3JlO1xuICB9XG5cbiAgZ2V0TWFya2Vyc0FmdGVyKGZpbGVQYXRjaEluZGV4KSB7XG4gICAgY29uc3QgYWZ0ZXIgPSBbXTtcbiAgICBsZXQgYWZ0ZXJJbmRleCA9IGZpbGVQYXRjaEluZGV4ICsgMTtcbiAgICB3aGlsZSAoYWZ0ZXJJbmRleCA8IHRoaXMuZmlsZVBhdGNoZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhZnRlckZpbGVQYXRjaCA9IHRoaXMuZmlsZVBhdGNoZXNbYWZ0ZXJJbmRleF07XG4gICAgICBhZnRlci5wdXNoKC4uLmFmdGVyRmlsZVBhdGNoLmdldFN0YXJ0aW5nTWFya2VycygpKTtcblxuICAgICAgaWYgKCFhZnRlckZpbGVQYXRjaC5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGFmdGVySW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIGFmdGVyO1xuICB9XG5cbiAgaXNQYXRjaFZpc2libGUgPSBmaWxlUGF0Y2hQYXRoID0+IHtcbiAgICBjb25zdCBwYXRjaCA9IHRoaXMuZmlsZVBhdGNoZXNCeVBhdGguZ2V0KGZpbGVQYXRjaFBhdGgpO1xuICAgIGlmICghcGF0Y2gpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzVmlzaWJsZSgpO1xuICB9XG5cbiAgZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uID0gKGZpbGVOYW1lLCBkaWZmUm93KSA9PiB7XG4gICAgY29uc3Qgb2Zmc2V0SW5kZXggPSB0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmdldChmaWxlTmFtZSk7XG4gICAgaWYgKCFvZmZzZXRJbmRleCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0F0dGVtcHQgdG8gY29tcHV0ZSBidWZmZXIgcm93IGZvciBpbnZhbGlkIGRpZmYgcG9zaXRpb246IGZpbGUgbm90IGluY2x1ZGVkJywge1xuICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgZGlmZlJvdyxcbiAgICAgICAgdmFsaWRGaWxlTmFtZXM6IEFycmF5LmZyb20odGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcy5rZXlzKCkpLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qge3N0YXJ0QnVmZmVyUm93LCBpbmRleH0gPSBvZmZzZXRJbmRleDtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGluZGV4Lmxvd2VyQm91bmQoe2RpZmZSb3d9KS5kYXRhKCk7XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKCdBdHRlbXB0IHRvIGNvbXB1dGUgYnVmZmVyIHJvdyBmb3IgaW52YWxpZCBkaWZmIHBvc2l0aW9uOiBkaWZmIHJvdyBvdXQgb2YgcmFuZ2UnLCB7XG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBkaWZmUm93LFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qge29mZnNldH0gPSByZXN1bHQ7XG5cbiAgICByZXR1cm4gc3RhcnRCdWZmZXJSb3cgKyBkaWZmUm93IC0gb2Zmc2V0O1xuICB9XG5cbiAgZ2V0UHJldmlld1BhdGNoQnVmZmVyKGZpbGVOYW1lLCBkaWZmUm93LCBtYXhSb3dDb3VudCkge1xuICAgIGNvbnN0IGJ1ZmZlclJvdyA9IHRoaXMuZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uKGZpbGVOYW1lLCBkaWZmUm93KTtcbiAgICBpZiAoYnVmZmVyUm93ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGNoID0gdGhpcy5nZXRGaWxlUGF0Y2hBdChidWZmZXJSb3cpO1xuICAgIGNvbnN0IGZpbGVQYXRjaEluZGV4ID0gdGhpcy5maWxlUGF0Y2hlcy5pbmRleE9mKGZpbGVQYXRjaCk7XG4gICAgY29uc3QgaHVuayA9IHRoaXMuZ2V0SHVua0F0KGJ1ZmZlclJvdyk7XG5cbiAgICBjb25zdCBwcmV2aWV3U3RhcnRSb3cgPSBNYXRoLm1heChidWZmZXJSb3cgLSBtYXhSb3dDb3VudCArIDEsIGh1bmsuZ2V0UmFuZ2UoKS5zdGFydC5yb3cpO1xuICAgIGNvbnN0IHByZXZpZXdFbmRSb3cgPSBidWZmZXJSb3c7XG5cbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmdldE1hcmtlcnNCZWZvcmUoZmlsZVBhdGNoSW5kZXgpO1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5nZXRNYXJrZXJzQWZ0ZXIoZmlsZVBhdGNoSW5kZXgpO1xuICAgIGNvbnN0IGV4Y2x1ZGUgPSBuZXcgU2V0KFsuLi5iZWZvcmUsIC4uLmFmdGVyXSk7XG5cbiAgICByZXR1cm4gdGhpcy5wYXRjaEJ1ZmZlci5jcmVhdGVTdWJCdWZmZXIoW1twcmV2aWV3U3RhcnRSb3csIDBdLCBbcHJldmlld0VuZFJvdywgSW5maW5pdHldXSwge2V4Y2x1ZGV9KS5wYXRjaEJ1ZmZlcjtcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhbiBhcHBseS1hYmxlIHBhdGNoIFN0cmluZy5cbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzLm1hcChmcCA9PiBmcC50b1N0cmluZ0luKHRoaXMuZ2V0QnVmZmVyKCkpKS5qb2luKCcnKSArICdcXG4nO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgc3RyaW5nIG9mIGRpYWdub3N0aWMgaW5mb3JtYXRpb24gdXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KCkge1xuICAgIGxldCBpbnNwZWN0U3RyaW5nID0gJyhNdWx0aUZpbGVQYXRjaCc7XG4gICAgaW5zcGVjdFN0cmluZyArPSBgIGZpbGVQYXRjaGVzQnlNYXJrZXI9KCR7QXJyYXkuZnJvbSh0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIua2V5cygpLCBtID0+IG0uaWQpLmpvaW4oJywgJyl9KWA7XG4gICAgaW5zcGVjdFN0cmluZyArPSBgIGh1bmtzQnlNYXJrZXI9KCR7QXJyYXkuZnJvbSh0aGlzLmh1bmtzQnlNYXJrZXIua2V5cygpLCBtID0+IG0uaWQpLmpvaW4oJywgJyl9KVxcbmA7XG4gICAgZm9yIChjb25zdCBmaWxlUGF0Y2ggb2YgdGhpcy5maWxlUGF0Y2hlcykge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSBmaWxlUGF0Y2guaW5zcGVjdCh7aW5kZW50OiAyfSk7XG4gICAgfVxuICAgIGluc3BlY3RTdHJpbmcgKz0gJylcXG4nO1xuICAgIHJldHVybiBpbnNwZWN0U3RyaW5nO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaXNFcXVhbChvdGhlcikge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCkgPT09IG90aGVyLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQXlDO0FBQUE7QUFBQTtBQUFBO0FBRTFCLE1BQU1BLGNBQWMsQ0FBQztFQUNsQyxPQUFPQyxVQUFVLEdBQUc7SUFDbEIsT0FBTyxJQUFJLElBQUksQ0FBQztNQUFDQyxXQUFXLEVBQUUsSUFBSUMsb0JBQVcsRUFBRTtNQUFFQyxXQUFXLEVBQUU7SUFBRSxDQUFDLENBQUM7RUFDcEU7RUFFQUMsV0FBVyxDQUFDO0lBQUNILFdBQVc7SUFBRUU7RUFBVyxDQUFDLEVBQUU7SUFBQSx3Q0F1WHZCRSxhQUFhLElBQUk7TUFDaEMsTUFBTUMsS0FBSyxHQUFHLElBQUksQ0FBQ0MsaUJBQWlCLENBQUNDLEdBQUcsQ0FBQ0gsYUFBYSxDQUFDO01BQ3ZELElBQUksQ0FBQ0MsS0FBSyxFQUFFO1FBQ1YsT0FBTyxLQUFLO01BQ2Q7TUFDQSxPQUFPQSxLQUFLLENBQUNHLGVBQWUsRUFBRSxDQUFDQyxTQUFTLEVBQUU7SUFDNUMsQ0FBQztJQUFBLHFEQUU2QixDQUFDQyxRQUFRLEVBQUVDLE9BQU8sS0FBSztNQUNuRCxNQUFNQyxXQUFXLEdBQUcsSUFBSSxDQUFDQyxvQkFBb0IsQ0FBQ04sR0FBRyxDQUFDRyxRQUFRLENBQUM7TUFDM0QsSUFBSSxDQUFDRSxXQUFXLEVBQUU7UUFDaEI7UUFDQUUsT0FBTyxDQUFDQyxLQUFLLENBQUMsNEVBQTRFLEVBQUU7VUFDMUZMLFFBQVE7VUFDUkMsT0FBTztVQUNQSyxjQUFjLEVBQUVDLEtB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