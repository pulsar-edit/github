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
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfYmludHJlZXMiLCJfcGF0Y2hCdWZmZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0Iiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ0IiwiaSIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsInIiLCJlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTXVsdGlGaWxlUGF0Y2giLCJjcmVhdGVOdWxsIiwicGF0Y2hCdWZmZXIiLCJQYXRjaEJ1ZmZlciIsImZpbGVQYXRjaGVzIiwiY29uc3RydWN0b3IiLCJmaWxlUGF0Y2hQYXRoIiwicGF0Y2giLCJmaWxlUGF0Y2hlc0J5UGF0aCIsImdldCIsImdldFJlbmRlclN0YXR1cyIsImlzVmlzaWJsZSIsImZpbGVOYW1lIiwiZGlmZlJvdyIsIm9mZnNldEluZGV4IiwiZGlmZlJvd09mZnNldEluZGljZXMiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZEZpbGVOYW1lcyIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJzdGFydEJ1ZmZlclJvdyIsImluZGV4IiwicmVzdWx0IiwibG93ZXJCb3VuZCIsImRhdGEiLCJvZmZzZXQiLCJmaWxlUGF0Y2hlc0J5TWFya2VyIiwiTWFwIiwiaHVua3NCeU1hcmtlciIsImZpbGVQYXRjaCIsInNldCIsImdldFBhdGgiLCJnZXRNYXJrZXIiLCJwb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzIiwiY2xvbmUiLCJvcHRzIiwidW5kZWZpbmVkIiwiZ2V0UGF0Y2hCdWZmZXIiLCJnZXRGaWxlUGF0Y2hlcyIsImdldEJ1ZmZlciIsImdldFBhdGNoTGF5ZXIiLCJnZXRMYXllciIsImdldEh1bmtMYXllciIsImdldFVuY2hhbmdlZExheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsImdldFBhdGNoRm9yUGF0aCIsInBhdGgiLCJnZXRQYXRoU2V0IiwicmVkdWNlIiwicGF0aFNldCIsImZpbGUiLCJnZXRPbGRGaWxlIiwiZ2V0TmV3RmlsZSIsImlzUHJlc2VudCIsImFkZCIsIlNldCIsImdldEZpbGVQYXRjaEF0IiwiYnVmZmVyUm93IiwiZ2V0TGFzdFJvdyIsIm1hcmtlciIsImZpbmRNYXJrZXJzIiwiaW50ZXJzZWN0c1JvdyIsImdldEh1bmtBdCIsImdldFN0YWdlUGF0Y2hGb3JMaW5lcyIsInNlbGVjdGVkTGluZVNldCIsIm5leHRQYXRjaEJ1ZmZlciIsIm5leHRGaWxlUGF0Y2hlcyIsImdldEZpbGVQYXRjaGVzQ29udGFpbmluZyIsIm1hcCIsImZwIiwiYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMiLCJnZXRTdGFnZVBhdGNoRm9ySHVuayIsImh1bmsiLCJnZXRCdWZmZXJSb3dzIiwiZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMiLCJidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzIiwiZ2V0VW5zdGFnZVBhdGNoRm9ySHVuayIsImdldE1heFNlbGVjdGlvbkluZGV4Iiwic2VsZWN0ZWRSb3dzIiwic2l6ZSIsImxhc3RNYXgiLCJNYXRoIiwibWF4Iiwic2VsZWN0aW9uSW5kZXgiLCJwYXRjaExvb3AiLCJnZXRIdW5rcyIsImluY2x1ZGVzTWF4IiwiY2hhbmdlIiwiZ2V0Q2hhbmdlcyIsImludGVyc2VjdGlvbiIsImdhcCIsImludGVyc2VjdFJvd3MiLCJkZWx0YSIsInN0YXJ0Iiwicm93IiwiZ2V0Um93Q291bnQiLCJnZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4Iiwic2VsZWN0aW9uUm93IiwicmVtYWluaW5nQ2hhbmdlZExpbmVzIiwiZm91bmRSb3ciLCJsYXN0Q2hhbmdlZFJvdyIsImJ1ZmZlclJvd0NvdW50IiwiZ2V0U3RhcnRCdWZmZXJSb3ciLCJnZXRFbmRCdWZmZXJSb3ciLCJSYW5nZSIsImZyb21PYmplY3QiLCJJbmZpbml0eSIsImlzRGlmZlJvd09mZnNldEluZGV4RW1wdHkiLCJkaWZmUm93T2Zmc2V0SW5kZXgiLCJSQlRyZWUiLCJhIiwiYiIsImdldFN0YXJ0UmFuZ2UiLCJodW5rSW5kZXgiLCJsZW5ndGgiLCJpbnNlcnQiLCJhZG9wdEJ1ZmZlciIsImNsZWFyQWxsTGF5ZXJzIiwiY2xlYXIiLCJtYXJrZXJNYXAiLCJhZG9wdCIsInVwZGF0ZU1hcmtlcnMiLCJyb3dTZXQiLCJzb3J0ZWRSb3dTZXQiLCJzb3J0IiwibGFzdEZpbGVQYXRjaCIsImNvbnRhaW5zUm93IiwicHVzaCIsImFueVByZXNlbnQiLCJzb21lIiwiZGlkQW55Q2hhbmdlRXhlY3V0YWJsZU1vZGUiLCJkaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiaGFzVHlwZWNoYW5nZSIsImdldE1heExpbmVOdW1iZXJXaWR0aCIsIm1heFdpZHRoIiwid2lkdGgiLCJzcGFuc011bHRpcGxlRmlsZXMiLCJyb3dzIiwiY29sbGFwc2VGaWxlUGF0Y2giLCJpbmRleE9mIiwiZGVsZXRlIiwiYmVmb3JlIiwiZ2V0TWFya2Vyc0JlZm9yZSIsImFmdGVyIiwiZ2V0TWFya2Vyc0FmdGVyIiwidHJpZ2dlckNvbGxhcHNlSW4iLCJleHBhbmRGaWxlUGF0Y2giLCJ0cmlnZ2VyRXhwYW5kSW4iLCJmaWxlUGF0Y2hJbmRleCIsImJlZm9yZUluZGV4IiwiYmVmb3JlRmlsZVBhdGNoIiwiZ2V0RW5kaW5nTWFya2VycyIsImdldFJhbmdlIiwiaXNFbXB0eSIsImFmdGVySW5kZXgiLCJhZnRlckZpbGVQYXRjaCIsImdldFN0YXJ0aW5nTWFya2VycyIsImdldFByZXZpZXdQYXRjaEJ1ZmZlciIsIm1heFJvd0NvdW50IiwiZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uIiwicHJldmlld1N0YXJ0Um93IiwicHJldmlld0VuZFJvdyIsImV4Y2x1ZGUiLCJjcmVhdGVTdWJCdWZmZXIiLCJ0b1N0cmluZyIsInRvU3RyaW5nSW4iLCJqb2luIiwiaW5zcGVjdCIsImluc3BlY3RTdHJpbmciLCJtIiwiaWQiLCJpbmRlbnQiLCJpc0VxdWFsIiwib3RoZXIiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsibXVsdGktZmlsZS1wYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7UkJUcmVlfSBmcm9tICdiaW50cmVlcyc7XG5cbmltcG9ydCBQYXRjaEJ1ZmZlciBmcm9tICcuL3BhdGNoLWJ1ZmZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpRmlsZVBhdGNoIHtcbiAgc3RhdGljIGNyZWF0ZU51bGwoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHtwYXRjaEJ1ZmZlcjogbmV3IFBhdGNoQnVmZmVyKCksIGZpbGVQYXRjaGVzOiBbXX0pO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlc30pIHtcbiAgICB0aGlzLnBhdGNoQnVmZmVyID0gcGF0Y2hCdWZmZXI7XG4gICAgdGhpcy5maWxlUGF0Y2hlcyA9IGZpbGVQYXRjaGVzO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmlsZVBhdGNoZXNCeVBhdGggPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5odW5rc0J5TWFya2VyID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gU3RvcmUgYSBtYXAgb2Yge2RpZmZSb3csIG9mZnNldH0gZm9yIGVhY2ggRmlsZVBhdGNoIHdoZXJlIG9mZnNldCBpcyB0aGUgbnVtYmVyIG9mIEh1bmsgaGVhZGVycyB3aXRoaW4gdGhlIGN1cnJlbnRcbiAgICAvLyBGaWxlUGF0Y2ggdGhhdCBvY2N1ciBiZWZvcmUgdGhpcyByb3cgaW4gdGhlIG9yaWdpbmFsIGRpZmYgb3V0cHV0LlxuICAgIHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmZpbGVQYXRjaGVzKSB7XG4gICAgICB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLnNldChmaWxlUGF0Y2guZ2V0UGF0aCgpLCBmaWxlUGF0Y2gpO1xuICAgICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLnNldChmaWxlUGF0Y2guZ2V0TWFya2VyKCksIGZpbGVQYXRjaCk7XG5cbiAgICAgIHRoaXMucG9wdWxhdGVEaWZmUm93T2Zmc2V0SW5kaWNlcyhmaWxlUGF0Y2gpO1xuICAgIH1cbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICBwYXRjaEJ1ZmZlcjogb3B0cy5wYXRjaEJ1ZmZlciAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRjaEJ1ZmZlciA6IHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKSxcbiAgICAgIGZpbGVQYXRjaGVzOiBvcHRzLmZpbGVQYXRjaGVzICE9PSB1bmRlZmluZWQgPyBvcHRzLmZpbGVQYXRjaGVzIDogdGhpcy5nZXRGaWxlUGF0Y2hlcygpLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGF0Y2hCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXI7XG4gIH1cblxuICBnZXRCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRCdWZmZXIoKTtcbiAgfVxuXG4gIGdldFBhdGNoTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcigncGF0Y2gnKTtcbiAgfVxuXG4gIGdldEh1bmtMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdodW5rJyk7XG4gIH1cblxuICBnZXRVbmNoYW5nZWRMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCd1bmNoYW5nZWQnKTtcbiAgfVxuXG4gIGdldEFkZGl0aW9uTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignYWRkaXRpb24nKTtcbiAgfVxuXG4gIGdldERlbGV0aW9uTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignZGVsZXRpb24nKTtcbiAgfVxuXG4gIGdldE5vTmV3bGluZUxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ25vbmV3bGluZScpO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXM7XG4gIH1cblxuICBnZXRQYXRjaEZvclBhdGgocGF0aCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLmdldChwYXRoKTtcbiAgfVxuXG4gIGdldFBhdGhTZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKS5yZWR1Y2UoKHBhdGhTZXQsIGZpbGVQYXRjaCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIFtmaWxlUGF0Y2guZ2V0T2xkRmlsZSgpLCBmaWxlUGF0Y2guZ2V0TmV3RmlsZSgpXSkge1xuICAgICAgICBpZiAoZmlsZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgIHBhdGhTZXQuYWRkKGZpbGUuZ2V0UGF0aCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGhTZXQ7XG4gICAgfSwgbmV3IFNldCgpKTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaEF0KGJ1ZmZlclJvdykge1xuICAgIGlmIChidWZmZXJSb3cgPCAwIHx8IGJ1ZmZlclJvdyA+IHRoaXMucGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBbbWFya2VyXSA9IHRoaXMucGF0Y2hCdWZmZXIuZmluZE1hcmtlcnMoJ3BhdGNoJywge2ludGVyc2VjdHNSb3c6IGJ1ZmZlclJvd30pO1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZ2V0KG1hcmtlcik7XG4gIH1cblxuICBnZXRIdW5rQXQoYnVmZmVyUm93KSB7XG4gICAgaWYgKGJ1ZmZlclJvdyA8IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IFttYXJrZXJdID0gdGhpcy5wYXRjaEJ1ZmZlci5maW5kTWFya2VycygnaHVuaycsIHtpbnRlcnNlY3RzUm93OiBidWZmZXJSb3d9KTtcbiAgICByZXR1cm4gdGhpcy5odW5rc0J5TWFya2VyLmdldChtYXJrZXIpO1xuICB9XG5cbiAgZ2V0U3RhZ2VQYXRjaEZvckxpbmVzKHNlbGVjdGVkTGluZVNldCkge1xuICAgIGNvbnN0IG5leHRQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgIGNvbnN0IG5leHRGaWxlUGF0Y2hlcyA9IHRoaXMuZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nKHNlbGVjdGVkTGluZVNldCkubWFwKGZwID0+IHtcbiAgICAgIHJldHVybiBmcC5idWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyh0aGlzLmdldEJ1ZmZlcigpLCBuZXh0UGF0Y2hCdWZmZXIsIHNlbGVjdGVkTGluZVNldCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe3BhdGNoQnVmZmVyOiBuZXh0UGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzOiBuZXh0RmlsZVBhdGNoZXN9KTtcbiAgfVxuXG4gIGdldFN0YWdlUGF0Y2hGb3JIdW5rKGh1bmspIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGFnZVBhdGNoRm9yTGluZXMobmV3IFNldChodW5rLmdldEJ1ZmZlclJvd3MoKSkpO1xuICB9XG5cbiAgZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMoc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgY29uc3QgbmV4dFBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgY29uc3QgbmV4dEZpbGVQYXRjaGVzID0gdGhpcy5nZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcoc2VsZWN0ZWRMaW5lU2V0KS5tYXAoZnAgPT4ge1xuICAgICAgcmV0dXJuIGZwLmJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXModGhpcy5nZXRCdWZmZXIoKSwgbmV4dFBhdGNoQnVmZmVyLCBzZWxlY3RlZExpbmVTZXQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtwYXRjaEJ1ZmZlcjogbmV4dFBhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlczogbmV4dEZpbGVQYXRjaGVzfSk7XG4gIH1cblxuICBnZXRVbnN0YWdlUGF0Y2hGb3JIdW5rKGh1bmspIHtcbiAgICByZXR1cm4gdGhpcy5nZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhuZXcgU2V0KGh1bmsuZ2V0QnVmZmVyUm93cygpKSk7XG4gIH1cblxuICBnZXRNYXhTZWxlY3Rpb25JbmRleChzZWxlY3RlZFJvd3MpIHtcbiAgICBpZiAoc2VsZWN0ZWRSb3dzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RNYXggPSBNYXRoLm1heCguLi5zZWxlY3RlZFJvd3MpO1xuXG4gICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gMDtcbiAgICAvLyBjb3VudHMgdW5zZWxlY3RlZCBsaW5lcyBpbiBjaGFuZ2VkIHJlZ2lvbnMgZnJvbSB0aGUgb2xkIHBhdGNoXG4gICAgLy8gdW50aWwgd2UgZ2V0IHRvIHRoZSBib3R0b20tbW9zdCBzZWxlY3RlZCBsaW5lIGZyb20gdGhlIG9sZCBwYXRjaCAobGFzdE1heCkuXG4gICAgcGF0Y2hMb29wOiBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICBsZXQgaW5jbHVkZXNNYXggPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBodW5rLmdldENoYW5nZXMoKSkge1xuICAgICAgICAgIGZvciAoY29uc3Qge2ludGVyc2VjdGlvbiwgZ2FwfSBvZiBjaGFuZ2UuaW50ZXJzZWN0Um93cyhzZWxlY3RlZFJvd3MsIHRydWUpKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgYSBwYXJ0aWFsIHJhbmdlIGlmIHRoaXMgaW50ZXJzZWN0aW9uIGluY2x1ZGVzIHRoZSBsYXN0IHNlbGVjdGVkIGJ1ZmZlciByb3cuXG4gICAgICAgICAgICBpbmNsdWRlc01heCA9IGludGVyc2VjdGlvbi5pbnRlcnNlY3RzUm93KGxhc3RNYXgpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBpbmNsdWRlc01heCA/IGxhc3RNYXggLSBpbnRlcnNlY3Rpb24uc3RhcnQucm93ICsgMSA6IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuXG4gICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgIC8vIFJhbmdlIG9mIHVuc2VsZWN0ZWQgY2hhbmdlcy5cbiAgICAgICAgICAgICAgc2VsZWN0aW9uSW5kZXggKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmNsdWRlc01heCkge1xuICAgICAgICAgICAgICBicmVhayBwYXRjaExvb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGlvbkluZGV4O1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uUmFuZ2VGb3JJbmRleChzZWxlY3Rpb25JbmRleCkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBjaGFuZ2VkIGxpbmVzIGluIHRoaXMgcGF0Y2ggaW4gb3JkZXIgdG8gZmluZCB0aGVcbiAgICAvLyBuZXcgcm93IHRvIGJlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZSBsYXN0IHNlbGVjdGlvbiBpbmRleC5cbiAgICAvLyBBcyB3ZSB3YWxrIHRocm91Z2ggdGhlIGNoYW5nZWQgbGluZXMsIHdlIHdoaXR0bGUgZG93biB0aGVcbiAgICAvLyByZW1haW5pbmcgbGluZXMgdW50aWwgd2UgcmVhY2ggdGhlIHJvdyB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZVxuICAgIC8vIGxhc3Qgc2VsZWN0ZWQgaW5kZXguXG5cbiAgICBsZXQgc2VsZWN0aW9uUm93ID0gMDtcbiAgICBsZXQgcmVtYWluaW5nQ2hhbmdlZExpbmVzID0gc2VsZWN0aW9uSW5kZXg7XG5cbiAgICBsZXQgZm91bmRSb3cgPSBmYWxzZTtcbiAgICBsZXQgbGFzdENoYW5nZWRSb3cgPSAwO1xuXG4gICAgcGF0Y2hMb29wOiBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBodW5rLmdldENoYW5nZXMoKSkge1xuICAgICAgICAgIGlmIChyZW1haW5pbmdDaGFuZ2VkTGluZXMgPCBjaGFuZ2UuYnVmZmVyUm93Q291bnQoKSkge1xuICAgICAgICAgICAgc2VsZWN0aW9uUm93ID0gY2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCkgKyByZW1haW5pbmdDaGFuZ2VkTGluZXM7XG4gICAgICAgICAgICBmb3VuZFJvdyA9IHRydWU7XG4gICAgICAgICAgICBicmVhayBwYXRjaExvb3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ0NoYW5nZWRMaW5lcyAtPSBjaGFuZ2UuYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgIGxhc3RDaGFuZ2VkUm93ID0gY2hhbmdlLmdldEVuZEJ1ZmZlclJvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIG5ldmVyIGdvdCB0byB0aGUgbGFzdCBzZWxlY3RlZCBpbmRleCwgdGhhdCBtZWFucyBpdCBpc1xuICAgIC8vIG5vIGxvbmdlciBwcmVzZW50IGluIHRoZSBuZXcgcGF0Y2ggKGllLiB3ZSBzdGFnZWQgdGhlIGxhc3QgbGluZSBvZiB0aGUgZmlsZSkuXG4gICAgLy8gSW4gdGhpcyBjYXNlIHdlIHdhbnQgdGhlIG5leHQgc2VsZWN0ZWQgbGluZSB0byBiZSB0aGUgbGFzdCBjaGFuZ2VkIHJvdyBpbiB0aGUgZmlsZVxuICAgIGlmICghZm91bmRSb3cpIHtcbiAgICAgIHNlbGVjdGlvblJvdyA9IGxhc3RDaGFuZ2VkUm93O1xuICAgIH1cblxuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbc2VsZWN0aW9uUm93LCAwXSwgW3NlbGVjdGlvblJvdywgSW5maW5pdHldXSk7XG4gIH1cblxuICBpc0RpZmZSb3dPZmZzZXRJbmRleEVtcHR5KGZpbGVQYXRjaFBhdGgpIHtcbiAgICBjb25zdCBkaWZmUm93T2Zmc2V0SW5kZXggPSB0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmdldChmaWxlUGF0Y2hQYXRoKTtcbiAgICByZXR1cm4gZGlmZlJvd09mZnNldEluZGV4LmluZGV4LnNpemUgPT09IDA7XG4gIH1cblxuICBwb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzKGZpbGVQYXRjaCkge1xuICAgIGxldCBkaWZmUm93ID0gMTtcbiAgICBjb25zdCBpbmRleCA9IG5ldyBSQlRyZWUoKGEsIGIpID0+IGEuZGlmZlJvdyAtIGIuZGlmZlJvdyk7XG4gICAgdGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcy5zZXQoZmlsZVBhdGNoLmdldFBhdGgoKSwge3N0YXJ0QnVmZmVyUm93OiBmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpLnN0YXJ0LnJvdywgaW5kZXh9KTtcblxuICAgIGZvciAobGV0IGh1bmtJbmRleCA9IDA7IGh1bmtJbmRleCA8IGZpbGVQYXRjaC5nZXRIdW5rcygpLmxlbmd0aDsgaHVua0luZGV4KyspIHtcbiAgICAgIGNvbnN0IGh1bmsgPSBmaWxlUGF0Y2guZ2V0SHVua3MoKVtodW5rSW5kZXhdO1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcblxuICAgICAgLy8gQWR2YW5jZSBwYXN0IHRoZSBodW5rIGJvZHlcbiAgICAgIGRpZmZSb3cgKz0gaHVuay5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgaW5kZXguaW5zZXJ0KHtkaWZmUm93LCBvZmZzZXQ6IGh1bmtJbmRleCArIDF9KTtcblxuICAgICAgLy8gQWR2YW5jZSBwYXN0IHRoZSBuZXh0IGh1bmsgaGVhZGVyXG4gICAgICBkaWZmUm93Kys7XG4gICAgfVxuICB9XG5cbiAgYWRvcHRCdWZmZXIobmV4dFBhdGNoQnVmZmVyKSB7XG4gICAgbmV4dFBhdGNoQnVmZmVyLmNsZWFyQWxsTGF5ZXJzKCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuY2xlYXIoKTtcbiAgICB0aGlzLmh1bmtzQnlNYXJrZXIuY2xlYXIoKTtcblxuICAgIGNvbnN0IG1hcmtlck1hcCA9IG5leHRQYXRjaEJ1ZmZlci5hZG9wdCh0aGlzLnBhdGNoQnVmZmVyKTtcblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgZmlsZVBhdGNoLnVwZGF0ZU1hcmtlcnMobWFya2VyTWFwKTtcbiAgICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5zZXQoZmlsZVBhdGNoLmdldE1hcmtlcigpLCBmaWxlUGF0Y2gpO1xuXG4gICAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhdGNoQnVmZmVyID0gbmV4dFBhdGNoQnVmZmVyO1xuICB9XG5cbiAgLypcbiAgICogRWZmaWNpZW50bHkgbG9jYXRlIHRoZSBGaWxlUGF0Y2ggaW5zdGFuY2VzIHRoYXQgY29udGFpbiBhdCBsZWFzdCBvbmUgcm93IGZyb20gYSBTZXQuXG4gICAqL1xuICBnZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcocm93U2V0KSB7XG4gICAgY29uc3Qgc29ydGVkUm93U2V0ID0gQXJyYXkuZnJvbShyb3dTZXQpO1xuICAgIHNvcnRlZFJvd1NldC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBmaWxlUGF0Y2hlcyA9IFtdO1xuICAgIGxldCBsYXN0RmlsZVBhdGNoID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBzb3J0ZWRSb3dTZXQpIHtcbiAgICAgIC8vIEJlY2F1c2UgdGhlIHJvd3MgYXJlIHNvcnRlZCwgY29uc2VjdXRpdmUgcm93cyB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmVsb25nIHRvIHRoZSBzYW1lIHBhdGNoLCBzbyB3ZSBjYW4gc2F2ZVxuICAgICAgLy8gbWFueSBhdm9pZGFibGUgbWFya2VyIGluZGV4IGxvb2t1cHMgYnkgY29tcGFyaW5nIHdpdGggdGhlIGxhc3QuXG4gICAgICBpZiAobGFzdEZpbGVQYXRjaCAmJiBsYXN0RmlsZVBhdGNoLmNvbnRhaW5zUm93KHJvdykpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxhc3RGaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KHJvdyk7XG4gICAgICBmaWxlUGF0Y2hlcy5wdXNoKGxhc3RGaWxlUGF0Y2gpO1xuICAgIH1cblxuICAgIHJldHVybiBmaWxlUGF0Y2hlcztcbiAgfVxuXG4gIGFueVByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXIgIT09IG51bGwgJiYgdGhpcy5maWxlUGF0Y2hlcy5zb21lKGZwID0+IGZwLmlzUHJlc2VudCgpKTtcbiAgfVxuXG4gIGRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlKCkge1xuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgaWYgKGZpbGVQYXRjaC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhbnlIYXZlVHlwZWNoYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnNvbWUoZnAgPT4gZnAuaGFzVHlwZWNoYW5nZSgpKTtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnJlZHVjZSgobWF4V2lkdGgsIGZpbGVQYXRjaCkgPT4ge1xuICAgICAgY29uc3Qgd2lkdGggPSBmaWxlUGF0Y2guZ2V0TWF4TGluZU51bWJlcldpZHRoKCk7XG4gICAgICByZXR1cm4gbWF4V2lkdGggPj0gd2lkdGggPyBtYXhXaWR0aCA6IHdpZHRoO1xuICAgIH0sIDApO1xuICB9XG5cbiAgc3BhbnNNdWx0aXBsZUZpbGVzKHJvd3MpIHtcbiAgICBsZXQgbGFzdEZpbGVQYXRjaCA9IG51bGw7XG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgaWYgKGxhc3RGaWxlUGF0Y2gpIHtcbiAgICAgICAgaWYgKGxhc3RGaWxlUGF0Y2guY29udGFpbnNSb3cocm93KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0RmlsZVBhdGNoID0gdGhpcy5nZXRGaWxlUGF0Y2hBdChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb2xsYXBzZUZpbGVQYXRjaChmaWxlUGF0Y2gpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmlsZVBhdGNoZXMuaW5kZXhPZihmaWxlUGF0Y2gpO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmRlbGV0ZShmaWxlUGF0Y2guZ2V0TWFya2VyKCkpO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLmRlbGV0ZShodW5rLmdldE1hcmtlcigpKTtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmdldE1hcmtlcnNCZWZvcmUoaW5kZXgpO1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5nZXRNYXJrZXJzQWZ0ZXIoaW5kZXgpO1xuXG4gICAgZmlsZVBhdGNoLnRyaWdnZXJDb2xsYXBzZUluKHRoaXMucGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcblxuICAgIC8vIFRoaXMgaHVuayBjb2xsZWN0aW9uIHNob3VsZCBiZSBlbXB0eSwgYnV0IGxldCdzIGl0ZXJhdGUgYW55d2F5IGp1c3QgaW4gY2FzZSBmaWxlUGF0Y2ggd2FzIGFscmVhZHkgY29sbGFwc2VkXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgfVxuICB9XG5cbiAgZXhwYW5kRmlsZVBhdGNoKGZpbGVQYXRjaCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maWxlUGF0Y2hlcy5pbmRleE9mKGZpbGVQYXRjaCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZGVsZXRlKGZpbGVQYXRjaC5nZXRNYXJrZXIoKSk7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuZGVsZXRlKGh1bmsuZ2V0TWFya2VyKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShpbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihpbmRleCk7XG5cbiAgICBmaWxlUGF0Y2gudHJpZ2dlckV4cGFuZEluKHRoaXMucGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHBhdGNoIHdhcyBpbml0aWFsbHkgY29sbGFwc2VkLCB3ZSBuZWVkIHRvIGNhbGN1bGF0ZVxuICAgIC8vIHRoZSBkaWZmUm93T2Zmc2V0SW5kaWNlcyB0byBjYWxjdWxhdGUgY29tbWVudCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5pc0RpZmZSb3dPZmZzZXRJbmRleEVtcHR5KGZpbGVQYXRjaC5nZXRQYXRoKCkpKSB7XG4gICAgICB0aGlzLnBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMoZmlsZVBhdGNoKTtcbiAgICB9XG4gIH1cblxuICBnZXRNYXJrZXJzQmVmb3JlKGZpbGVQYXRjaEluZGV4KSB7XG4gICAgY29uc3QgYmVmb3JlID0gW107XG4gICAgbGV0IGJlZm9yZUluZGV4ID0gZmlsZVBhdGNoSW5kZXggLSAxO1xuICAgIHdoaWxlIChiZWZvcmVJbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBiZWZvcmVGaWxlUGF0Y2ggPSB0aGlzLmZpbGVQYXRjaGVzW2JlZm9yZUluZGV4XTtcbiAgICAgIGJlZm9yZS5wdXNoKC4uLmJlZm9yZUZpbGVQYXRjaC5nZXRFbmRpbmdNYXJrZXJzKCkpO1xuXG4gICAgICBpZiAoIWJlZm9yZUZpbGVQYXRjaC5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGJlZm9yZUluZGV4LS07XG4gICAgfVxuICAgIHJldHVybiBiZWZvcmU7XG4gIH1cblxuICBnZXRNYXJrZXJzQWZ0ZXIoZmlsZVBhdGNoSW5kZXgpIHtcbiAgICBjb25zdCBhZnRlciA9IFtdO1xuICAgIGxldCBhZnRlckluZGV4ID0gZmlsZVBhdGNoSW5kZXggKyAxO1xuICAgIHdoaWxlIChhZnRlckluZGV4IDwgdGhpcy5maWxlUGF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFmdGVyRmlsZVBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc1thZnRlckluZGV4XTtcbiAgICAgIGFmdGVyLnB1c2goLi4uYWZ0ZXJGaWxlUGF0Y2guZ2V0U3RhcnRpbmdNYXJrZXJzKCkpO1xuXG4gICAgICBpZiAoIWFmdGVyRmlsZVBhdGNoLmdldE1hcmtlcigpLmdldFJhbmdlKCkuaXNFbXB0eSgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYWZ0ZXJJbmRleCsrO1xuICAgIH1cbiAgICByZXR1cm4gYWZ0ZXI7XG4gIH1cblxuICBpc1BhdGNoVmlzaWJsZSA9IGZpbGVQYXRjaFBhdGggPT4ge1xuICAgIGNvbnN0IHBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc0J5UGF0aC5nZXQoZmlsZVBhdGNoUGF0aCk7XG4gICAgaWYgKCFwYXRjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCk7XG4gIH1cblxuICBnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24gPSAoZmlsZU5hbWUsIGRpZmZSb3cpID0+IHtcbiAgICBjb25zdCBvZmZzZXRJbmRleCA9IHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoIW9mZnNldEluZGV4KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcignQXR0ZW1wdCB0byBjb21wdXRlIGJ1ZmZlciByb3cgZm9yIGludmFsaWQgZGlmZiBwb3NpdGlvbjogZmlsZSBub3QgaW5jbHVkZWQnLCB7XG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBkaWZmUm93LFxuICAgICAgICB2YWxpZEZpbGVOYW1lczogQXJyYXkuZnJvbSh0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmtleXMoKSksXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7c3RhcnRCdWZmZXJSb3csIGluZGV4fSA9IG9mZnNldEluZGV4O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gaW5kZXgubG93ZXJCb3VuZCh7ZGlmZlJvd30pLmRhdGEoKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0F0dGVtcHQgdG8gY29tcHV0ZSBidWZmZXIgcm93IGZvciBpbnZhbGlkIGRpZmYgcG9zaXRpb246IGRpZmYgcm93IG91dCBvZiByYW5nZScsIHtcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGRpZmZSb3csXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7b2Zmc2V0fSA9IHJlc3VsdDtcblxuICAgIHJldHVybiBzdGFydEJ1ZmZlclJvdyArIGRpZmZSb3cgLSBvZmZzZXQ7XG4gIH1cblxuICBnZXRQcmV2aWV3UGF0Y2hCdWZmZXIoZmlsZU5hbWUsIGRpZmZSb3csIG1heFJvd0NvdW50KSB7XG4gICAgY29uc3QgYnVmZmVyUm93ID0gdGhpcy5nZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24oZmlsZU5hbWUsIGRpZmZSb3cpO1xuICAgIGlmIChidWZmZXJSb3cgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KGJ1ZmZlclJvdyk7XG4gICAgY29uc3QgZmlsZVBhdGNoSW5kZXggPSB0aGlzLmZpbGVQYXRjaGVzLmluZGV4T2YoZmlsZVBhdGNoKTtcbiAgICBjb25zdCBodW5rID0gdGhpcy5nZXRIdW5rQXQoYnVmZmVyUm93KTtcblxuICAgIGNvbnN0IHByZXZpZXdTdGFydFJvdyA9IE1hdGgubWF4KGJ1ZmZlclJvdyAtIG1heFJvd0NvdW50ICsgMSwgaHVuay5nZXRSYW5nZSgpLnN0YXJ0LnJvdyk7XG4gICAgY29uc3QgcHJldmlld0VuZFJvdyA9IGJ1ZmZlclJvdztcblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShmaWxlUGF0Y2hJbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihmaWxlUGF0Y2hJbmRleCk7XG4gICAgY29uc3QgZXhjbHVkZSA9IG5ldyBTZXQoWy4uLmJlZm9yZSwgLi4uYWZ0ZXJdKTtcblxuICAgIHJldHVybiB0aGlzLnBhdGNoQnVmZmVyLmNyZWF0ZVN1YkJ1ZmZlcihbW3ByZXZpZXdTdGFydFJvdywgMF0sIFtwcmV2aWV3RW5kUm93LCBJbmZpbml0eV1dLCB7ZXhjbHVkZX0pLnBhdGNoQnVmZmVyO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGFuIGFwcGx5LWFibGUgcGF0Y2ggU3RyaW5nLlxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXMubWFwKGZwID0+IGZwLnRvU3RyaW5nSW4odGhpcy5nZXRCdWZmZXIoKSkpLmpvaW4oJycpICsgJ1xcbic7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBzdHJpbmcgb2YgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbiB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3QoKSB7XG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSAnKE11bHRpRmlsZVBhdGNoJztcbiAgICBpbnNwZWN0U3RyaW5nICs9IGAgZmlsZVBhdGNoZXNCeU1hcmtlcj0oJHtBcnJheS5mcm9tKHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5rZXlzKCksIG0gPT4gbS5pZCkuam9pbignLCAnKX0pYDtcbiAgICBpbnNwZWN0U3RyaW5nICs9IGAgaHVua3NCeU1hcmtlcj0oJHtBcnJheS5mcm9tKHRoaXMuaHVua3NCeU1hcmtlci5rZXlzKCksIG0gPT4gbS5pZCkuam9pbignLCAnKX0pXFxuYDtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmZpbGVQYXRjaGVzKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGZpbGVQYXRjaC5pbnNwZWN0KHtpbmRlbnQ6IDJ9KTtcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSAnKVxcbic7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpc0VxdWFsKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKSA9PT0gb3RoZXIudG9TdHJpbmcoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFFQSxJQUFBRSxZQUFBLEdBQUFDLHNCQUFBLENBQUFILE9BQUE7QUFBeUMsU0FBQUcsdUJBQUFDLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxnQkFBQUgsR0FBQSxFQUFBSSxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBSixHQUFBLElBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixHQUFBLEVBQUFJLEdBQUEs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