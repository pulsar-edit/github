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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfYmludHJlZXMiLCJfcGF0Y2hCdWZmZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0Iiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTXVsdGlGaWxlUGF0Y2giLCJjcmVhdGVOdWxsIiwicGF0Y2hCdWZmZXIiLCJQYXRjaEJ1ZmZlciIsImZpbGVQYXRjaGVzIiwiY29uc3RydWN0b3IiLCJmaWxlUGF0Y2hQYXRoIiwicGF0Y2giLCJmaWxlUGF0Y2hlc0J5UGF0aCIsImdldCIsImdldFJlbmRlclN0YXR1cyIsImlzVmlzaWJsZSIsImZpbGVOYW1lIiwiZGlmZlJvdyIsIm9mZnNldEluZGV4IiwiZGlmZlJvd09mZnNldEluZGljZXMiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZEZpbGVOYW1lcyIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJzdGFydEJ1ZmZlclJvdyIsImluZGV4IiwicmVzdWx0IiwibG93ZXJCb3VuZCIsImRhdGEiLCJvZmZzZXQiLCJmaWxlUGF0Y2hlc0J5TWFya2VyIiwiTWFwIiwiaHVua3NCeU1hcmtlciIsImZpbGVQYXRjaCIsInNldCIsImdldFBhdGgiLCJnZXRNYXJrZXIiLCJwb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzIiwiY2xvbmUiLCJvcHRzIiwiZ2V0UGF0Y2hCdWZmZXIiLCJnZXRGaWxlUGF0Y2hlcyIsImdldEJ1ZmZlciIsImdldFBhdGNoTGF5ZXIiLCJnZXRMYXllciIsImdldEh1bmtMYXllciIsImdldFVuY2hhbmdlZExheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsImdldFBhdGNoRm9yUGF0aCIsInBhdGgiLCJnZXRQYXRoU2V0IiwicmVkdWNlIiwicGF0aFNldCIsImZpbGUiLCJnZXRPbGRGaWxlIiwiZ2V0TmV3RmlsZSIsImlzUHJlc2VudCIsImFkZCIsIlNldCIsImdldEZpbGVQYXRjaEF0IiwiYnVmZmVyUm93IiwiZ2V0TGFzdFJvdyIsIm1hcmtlciIsImZpbmRNYXJrZXJzIiwiaW50ZXJzZWN0c1JvdyIsImdldEh1bmtBdCIsImdldFN0YWdlUGF0Y2hGb3JMaW5lcyIsInNlbGVjdGVkTGluZVNldCIsIm5leHRQYXRjaEJ1ZmZlciIsIm5leHRGaWxlUGF0Y2hlcyIsImdldEZpbGVQYXRjaGVzQ29udGFpbmluZyIsIm1hcCIsImZwIiwiYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMiLCJnZXRTdGFnZVBhdGNoRm9ySHVuayIsImh1bmsiLCJnZXRCdWZmZXJSb3dzIiwiZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMiLCJidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzIiwiZ2V0VW5zdGFnZVBhdGNoRm9ySHVuayIsImdldE1heFNlbGVjdGlvbkluZGV4Iiwic2VsZWN0ZWRSb3dzIiwic2l6ZSIsImxhc3RNYXgiLCJNYXRoIiwibWF4Iiwic2VsZWN0aW9uSW5kZXgiLCJwYXRjaExvb3AiLCJnZXRIdW5rcyIsImluY2x1ZGVzTWF4IiwiY2hhbmdlIiwiZ2V0Q2hhbmdlcyIsImludGVyc2VjdGlvbiIsImdhcCIsImludGVyc2VjdFJvd3MiLCJkZWx0YSIsInN0YXJ0Iiwicm93IiwiZ2V0Um93Q291bnQiLCJnZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4Iiwic2VsZWN0aW9uUm93IiwicmVtYWluaW5nQ2hhbmdlZExpbmVzIiwiZm91bmRSb3ciLCJsYXN0Q2hhbmdlZFJvdyIsImJ1ZmZlclJvd0NvdW50IiwiZ2V0U3RhcnRCdWZmZXJSb3ciLCJnZXRFbmRCdWZmZXJSb3ciLCJSYW5nZSIsImZyb21PYmplY3QiLCJJbmZpbml0eSIsImlzRGlmZlJvd09mZnNldEluZGV4RW1wdHkiLCJkaWZmUm93T2Zmc2V0SW5kZXgiLCJSQlRyZWUiLCJhIiwiYiIsImdldFN0YXJ0UmFuZ2UiLCJodW5rSW5kZXgiLCJsZW5ndGgiLCJpbnNlcnQiLCJhZG9wdEJ1ZmZlciIsImNsZWFyQWxsTGF5ZXJzIiwiY2xlYXIiLCJtYXJrZXJNYXAiLCJhZG9wdCIsInVwZGF0ZU1hcmtlcnMiLCJyb3dTZXQiLCJzb3J0ZWRSb3dTZXQiLCJzb3J0IiwibGFzdEZpbGVQYXRjaCIsImNvbnRhaW5zUm93IiwicHVzaCIsImFueVByZXNlbnQiLCJzb21lIiwiZGlkQW55Q2hhbmdlRXhlY3V0YWJsZU1vZGUiLCJkaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiaGFzVHlwZWNoYW5nZSIsImdldE1heExpbmVOdW1iZXJXaWR0aCIsIm1heFdpZHRoIiwid2lkdGgiLCJzcGFuc011bHRpcGxlRmlsZXMiLCJyb3dzIiwiY29sbGFwc2VGaWxlUGF0Y2giLCJpbmRleE9mIiwiZGVsZXRlIiwiYmVmb3JlIiwiZ2V0TWFya2Vyc0JlZm9yZSIsImFmdGVyIiwiZ2V0TWFya2Vyc0FmdGVyIiwidHJpZ2dlckNvbGxhcHNlSW4iLCJleHBhbmRGaWxlUGF0Y2giLCJ0cmlnZ2VyRXhwYW5kSW4iLCJmaWxlUGF0Y2hJbmRleCIsImJlZm9yZUluZGV4IiwiYmVmb3JlRmlsZVBhdGNoIiwiZ2V0RW5kaW5nTWFya2VycyIsImdldFJhbmdlIiwiaXNFbXB0eSIsImFmdGVySW5kZXgiLCJhZnRlckZpbGVQYXRjaCIsImdldFN0YXJ0aW5nTWFya2VycyIsImdldFByZXZpZXdQYXRjaEJ1ZmZlciIsIm1heFJvd0NvdW50IiwiZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uIiwicHJldmlld1N0YXJ0Um93IiwicHJldmlld0VuZFJvdyIsImV4Y2x1ZGUiLCJjcmVhdGVTdWJCdWZmZXIiLCJ0b1N0cmluZyIsInRvU3RyaW5nSW4iLCJqb2luIiwiaW5zcGVjdCIsImluc3BlY3RTdHJpbmciLCJtIiwiaWQiLCJpbmRlbnQiLCJpc0VxdWFsIiwib3RoZXIiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsibXVsdGktZmlsZS1wYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7UkJUcmVlfSBmcm9tICdiaW50cmVlcyc7XG5cbmltcG9ydCBQYXRjaEJ1ZmZlciBmcm9tICcuL3BhdGNoLWJ1ZmZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpRmlsZVBhdGNoIHtcbiAgc3RhdGljIGNyZWF0ZU51bGwoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHtwYXRjaEJ1ZmZlcjogbmV3IFBhdGNoQnVmZmVyKCksIGZpbGVQYXRjaGVzOiBbXX0pO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlc30pIHtcbiAgICB0aGlzLnBhdGNoQnVmZmVyID0gcGF0Y2hCdWZmZXI7XG4gICAgdGhpcy5maWxlUGF0Y2hlcyA9IGZpbGVQYXRjaGVzO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmlsZVBhdGNoZXNCeVBhdGggPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5odW5rc0J5TWFya2VyID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gU3RvcmUgYSBtYXAgb2Yge2RpZmZSb3csIG9mZnNldH0gZm9yIGVhY2ggRmlsZVBhdGNoIHdoZXJlIG9mZnNldCBpcyB0aGUgbnVtYmVyIG9mIEh1bmsgaGVhZGVycyB3aXRoaW4gdGhlIGN1cnJlbnRcbiAgICAvLyBGaWxlUGF0Y2ggdGhhdCBvY2N1ciBiZWZvcmUgdGhpcyByb3cgaW4gdGhlIG9yaWdpbmFsIGRpZmYgb3V0cHV0LlxuICAgIHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmZpbGVQYXRjaGVzKSB7XG4gICAgICB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLnNldChmaWxlUGF0Y2guZ2V0UGF0aCgpLCBmaWxlUGF0Y2gpO1xuICAgICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLnNldChmaWxlUGF0Y2guZ2V0TWFya2VyKCksIGZpbGVQYXRjaCk7XG5cbiAgICAgIHRoaXMucG9wdWxhdGVEaWZmUm93T2Zmc2V0SW5kaWNlcyhmaWxlUGF0Y2gpO1xuICAgIH1cbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICBwYXRjaEJ1ZmZlcjogb3B0cy5wYXRjaEJ1ZmZlciAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRjaEJ1ZmZlciA6IHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKSxcbiAgICAgIGZpbGVQYXRjaGVzOiBvcHRzLmZpbGVQYXRjaGVzICE9PSB1bmRlZmluZWQgPyBvcHRzLmZpbGVQYXRjaGVzIDogdGhpcy5nZXRGaWxlUGF0Y2hlcygpLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGF0Y2hCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXI7XG4gIH1cblxuICBnZXRCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRCdWZmZXIoKTtcbiAgfVxuXG4gIGdldFBhdGNoTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcigncGF0Y2gnKTtcbiAgfVxuXG4gIGdldEh1bmtMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdodW5rJyk7XG4gIH1cblxuICBnZXRVbmNoYW5nZWRMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCd1bmNoYW5nZWQnKTtcbiAgfVxuXG4gIGdldEFkZGl0aW9uTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignYWRkaXRpb24nKTtcbiAgfVxuXG4gIGdldERlbGV0aW9uTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignZGVsZXRpb24nKTtcbiAgfVxuXG4gIGdldE5vTmV3bGluZUxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ25vbmV3bGluZScpO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXM7XG4gIH1cblxuICBnZXRQYXRjaEZvclBhdGgocGF0aCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLmdldChwYXRoKTtcbiAgfVxuXG4gIGdldFBhdGhTZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKS5yZWR1Y2UoKHBhdGhTZXQsIGZpbGVQYXRjaCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIFtmaWxlUGF0Y2guZ2V0T2xkRmlsZSgpLCBmaWxlUGF0Y2guZ2V0TmV3RmlsZSgpXSkge1xuICAgICAgICBpZiAoZmlsZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgIHBhdGhTZXQuYWRkKGZpbGUuZ2V0UGF0aCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGhTZXQ7XG4gICAgfSwgbmV3IFNldCgpKTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaEF0KGJ1ZmZlclJvdykge1xuICAgIGlmIChidWZmZXJSb3cgPCAwIHx8IGJ1ZmZlclJvdyA+IHRoaXMucGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBbbWFya2VyXSA9IHRoaXMucGF0Y2hCdWZmZXIuZmluZE1hcmtlcnMoJ3BhdGNoJywge2ludGVyc2VjdHNSb3c6IGJ1ZmZlclJvd30pO1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZ2V0KG1hcmtlcik7XG4gIH1cblxuICBnZXRIdW5rQXQoYnVmZmVyUm93KSB7XG4gICAgaWYgKGJ1ZmZlclJvdyA8IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IFttYXJrZXJdID0gdGhpcy5wYXRjaEJ1ZmZlci5maW5kTWFya2VycygnaHVuaycsIHtpbnRlcnNlY3RzUm93OiBidWZmZXJSb3d9KTtcbiAgICByZXR1cm4gdGhpcy5odW5rc0J5TWFya2VyLmdldChtYXJrZXIpO1xuICB9XG5cbiAgZ2V0U3RhZ2VQYXRjaEZvckxpbmVzKHNlbGVjdGVkTGluZVNldCkge1xuICAgIGNvbnN0IG5leHRQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgIGNvbnN0IG5leHRGaWxlUGF0Y2hlcyA9IHRoaXMuZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nKHNlbGVjdGVkTGluZVNldCkubWFwKGZwID0+IHtcbiAgICAgIHJldHVybiBmcC5idWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyh0aGlzLmdldEJ1ZmZlcigpLCBuZXh0UGF0Y2hCdWZmZXIsIHNlbGVjdGVkTGluZVNldCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe3BhdGNoQnVmZmVyOiBuZXh0UGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzOiBuZXh0RmlsZVBhdGNoZXN9KTtcbiAgfVxuXG4gIGdldFN0YWdlUGF0Y2hGb3JIdW5rKGh1bmspIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGFnZVBhdGNoRm9yTGluZXMobmV3IFNldChodW5rLmdldEJ1ZmZlclJvd3MoKSkpO1xuICB9XG5cbiAgZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMoc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgY29uc3QgbmV4dFBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgY29uc3QgbmV4dEZpbGVQYXRjaGVzID0gdGhpcy5nZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcoc2VsZWN0ZWRMaW5lU2V0KS5tYXAoZnAgPT4ge1xuICAgICAgcmV0dXJuIGZwLmJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXModGhpcy5nZXRCdWZmZXIoKSwgbmV4dFBhdGNoQnVmZmVyLCBzZWxlY3RlZExpbmVTZXQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtwYXRjaEJ1ZmZlcjogbmV4dFBhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlczogbmV4dEZpbGVQYXRjaGVzfSk7XG4gIH1cblxuICBnZXRVbnN0YWdlUGF0Y2hGb3JIdW5rKGh1bmspIHtcbiAgICByZXR1cm4gdGhpcy5nZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhuZXcgU2V0KGh1bmsuZ2V0QnVmZmVyUm93cygpKSk7XG4gIH1cblxuICBnZXRNYXhTZWxlY3Rpb25JbmRleChzZWxlY3RlZFJvd3MpIHtcbiAgICBpZiAoc2VsZWN0ZWRSb3dzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RNYXggPSBNYXRoLm1heCguLi5zZWxlY3RlZFJvd3MpO1xuXG4gICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gMDtcbiAgICAvLyBjb3VudHMgdW5zZWxlY3RlZCBsaW5lcyBpbiBjaGFuZ2VkIHJlZ2lvbnMgZnJvbSB0aGUgb2xkIHBhdGNoXG4gICAgLy8gdW50aWwgd2UgZ2V0IHRvIHRoZSBib3R0b20tbW9zdCBzZWxlY3RlZCBsaW5lIGZyb20gdGhlIG9sZCBwYXRjaCAobGFzdE1heCkuXG4gICAgcGF0Y2hMb29wOiBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICBsZXQgaW5jbHVkZXNNYXggPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBodW5rLmdldENoYW5nZXMoKSkge1xuICAgICAgICAgIGZvciAoY29uc3Qge2ludGVyc2VjdGlvbiwgZ2FwfSBvZiBjaGFuZ2UuaW50ZXJzZWN0Um93cyhzZWxlY3RlZFJvd3MsIHRydWUpKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgYSBwYXJ0aWFsIHJhbmdlIGlmIHRoaXMgaW50ZXJzZWN0aW9uIGluY2x1ZGVzIHRoZSBsYXN0IHNlbGVjdGVkIGJ1ZmZlciByb3cuXG4gICAgICAgICAgICBpbmNsdWRlc01heCA9IGludGVyc2VjdGlvbi5pbnRlcnNlY3RzUm93KGxhc3RNYXgpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBpbmNsdWRlc01heCA/IGxhc3RNYXggLSBpbnRlcnNlY3Rpb24uc3RhcnQucm93ICsgMSA6IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuXG4gICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgIC8vIFJhbmdlIG9mIHVuc2VsZWN0ZWQgY2hhbmdlcy5cbiAgICAgICAgICAgICAgc2VsZWN0aW9uSW5kZXggKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmNsdWRlc01heCkge1xuICAgICAgICAgICAgICBicmVhayBwYXRjaExvb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGlvbkluZGV4O1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uUmFuZ2VGb3JJbmRleChzZWxlY3Rpb25JbmRleCkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBjaGFuZ2VkIGxpbmVzIGluIHRoaXMgcGF0Y2ggaW4gb3JkZXIgdG8gZmluZCB0aGVcbiAgICAvLyBuZXcgcm93IHRvIGJlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZSBsYXN0IHNlbGVjdGlvbiBpbmRleC5cbiAgICAvLyBBcyB3ZSB3YWxrIHRocm91Z2ggdGhlIGNoYW5nZWQgbGluZXMsIHdlIHdoaXR0bGUgZG93biB0aGVcbiAgICAvLyByZW1haW5pbmcgbGluZXMgdW50aWwgd2UgcmVhY2ggdGhlIHJvdyB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZVxuICAgIC8vIGxhc3Qgc2VsZWN0ZWQgaW5kZXguXG5cbiAgICBsZXQgc2VsZWN0aW9uUm93ID0gMDtcbiAgICBsZXQgcmVtYWluaW5nQ2hhbmdlZExpbmVzID0gc2VsZWN0aW9uSW5kZXg7XG5cbiAgICBsZXQgZm91bmRSb3cgPSBmYWxzZTtcbiAgICBsZXQgbGFzdENoYW5nZWRSb3cgPSAwO1xuXG4gICAgcGF0Y2hMb29wOiBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBodW5rLmdldENoYW5nZXMoKSkge1xuICAgICAgICAgIGlmIChyZW1haW5pbmdDaGFuZ2VkTGluZXMgPCBjaGFuZ2UuYnVmZmVyUm93Q291bnQoKSkge1xuICAgICAgICAgICAgc2VsZWN0aW9uUm93ID0gY2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCkgKyByZW1haW5pbmdDaGFuZ2VkTGluZXM7XG4gICAgICAgICAgICBmb3VuZFJvdyA9IHRydWU7XG4gICAgICAgICAgICBicmVhayBwYXRjaExvb3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ0NoYW5nZWRMaW5lcyAtPSBjaGFuZ2UuYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgIGxhc3RDaGFuZ2VkUm93ID0gY2hhbmdlLmdldEVuZEJ1ZmZlclJvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIG5ldmVyIGdvdCB0byB0aGUgbGFzdCBzZWxlY3RlZCBpbmRleCwgdGhhdCBtZWFucyBpdCBpc1xuICAgIC8vIG5vIGxvbmdlciBwcmVzZW50IGluIHRoZSBuZXcgcGF0Y2ggKGllLiB3ZSBzdGFnZWQgdGhlIGxhc3QgbGluZSBvZiB0aGUgZmlsZSkuXG4gICAgLy8gSW4gdGhpcyBjYXNlIHdlIHdhbnQgdGhlIG5leHQgc2VsZWN0ZWQgbGluZSB0byBiZSB0aGUgbGFzdCBjaGFuZ2VkIHJvdyBpbiB0aGUgZmlsZVxuICAgIGlmICghZm91bmRSb3cpIHtcbiAgICAgIHNlbGVjdGlvblJvdyA9IGxhc3RDaGFuZ2VkUm93O1xuICAgIH1cblxuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbc2VsZWN0aW9uUm93LCAwXSwgW3NlbGVjdGlvblJvdywgSW5maW5pdHldXSk7XG4gIH1cblxuICBpc0RpZmZSb3dPZmZzZXRJbmRleEVtcHR5KGZpbGVQYXRjaFBhdGgpIHtcbiAgICBjb25zdCBkaWZmUm93T2Zmc2V0SW5kZXggPSB0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmdldChmaWxlUGF0Y2hQYXRoKTtcbiAgICByZXR1cm4gZGlmZlJvd09mZnNldEluZGV4LmluZGV4LnNpemUgPT09IDA7XG4gIH1cblxuICBwb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzKGZpbGVQYXRjaCkge1xuICAgIGxldCBkaWZmUm93ID0gMTtcbiAgICBjb25zdCBpbmRleCA9IG5ldyBSQlRyZWUoKGEsIGIpID0+IGEuZGlmZlJvdyAtIGIuZGlmZlJvdyk7XG4gICAgdGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcy5zZXQoZmlsZVBhdGNoLmdldFBhdGgoKSwge3N0YXJ0QnVmZmVyUm93OiBmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpLnN0YXJ0LnJvdywgaW5kZXh9KTtcblxuICAgIGZvciAobGV0IGh1bmtJbmRleCA9IDA7IGh1bmtJbmRleCA8IGZpbGVQYXRjaC5nZXRIdW5rcygpLmxlbmd0aDsgaHVua0luZGV4KyspIHtcbiAgICAgIGNvbnN0IGh1bmsgPSBmaWxlUGF0Y2guZ2V0SHVua3MoKVtodW5rSW5kZXhdO1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcblxuICAgICAgLy8gQWR2YW5jZSBwYXN0IHRoZSBodW5rIGJvZHlcbiAgICAgIGRpZmZSb3cgKz0gaHVuay5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgaW5kZXguaW5zZXJ0KHtkaWZmUm93LCBvZmZzZXQ6IGh1bmtJbmRleCArIDF9KTtcblxuICAgICAgLy8gQWR2YW5jZSBwYXN0IHRoZSBuZXh0IGh1bmsgaGVhZGVyXG4gICAgICBkaWZmUm93Kys7XG4gICAgfVxuICB9XG5cbiAgYWRvcHRCdWZmZXIobmV4dFBhdGNoQnVmZmVyKSB7XG4gICAgbmV4dFBhdGNoQnVmZmVyLmNsZWFyQWxsTGF5ZXJzKCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuY2xlYXIoKTtcbiAgICB0aGlzLmh1bmtzQnlNYXJrZXIuY2xlYXIoKTtcblxuICAgIGNvbnN0IG1hcmtlck1hcCA9IG5leHRQYXRjaEJ1ZmZlci5hZG9wdCh0aGlzLnBhdGNoQnVmZmVyKTtcblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgZmlsZVBhdGNoLnVwZGF0ZU1hcmtlcnMobWFya2VyTWFwKTtcbiAgICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5zZXQoZmlsZVBhdGNoLmdldE1hcmtlcigpLCBmaWxlUGF0Y2gpO1xuXG4gICAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhdGNoQnVmZmVyID0gbmV4dFBhdGNoQnVmZmVyO1xuICB9XG5cbiAgLypcbiAgICogRWZmaWNpZW50bHkgbG9jYXRlIHRoZSBGaWxlUGF0Y2ggaW5zdGFuY2VzIHRoYXQgY29udGFpbiBhdCBsZWFzdCBvbmUgcm93IGZyb20gYSBTZXQuXG4gICAqL1xuICBnZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcocm93U2V0KSB7XG4gICAgY29uc3Qgc29ydGVkUm93U2V0ID0gQXJyYXkuZnJvbShyb3dTZXQpO1xuICAgIHNvcnRlZFJvd1NldC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBmaWxlUGF0Y2hlcyA9IFtdO1xuICAgIGxldCBsYXN0RmlsZVBhdGNoID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBzb3J0ZWRSb3dTZXQpIHtcbiAgICAgIC8vIEJlY2F1c2UgdGhlIHJvd3MgYXJlIHNvcnRlZCwgY29uc2VjdXRpdmUgcm93cyB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmVsb25nIHRvIHRoZSBzYW1lIHBhdGNoLCBzbyB3ZSBjYW4gc2F2ZVxuICAgICAgLy8gbWFueSBhdm9pZGFibGUgbWFya2VyIGluZGV4IGxvb2t1cHMgYnkgY29tcGFyaW5nIHdpdGggdGhlIGxhc3QuXG4gICAgICBpZiAobGFzdEZpbGVQYXRjaCAmJiBsYXN0RmlsZVBhdGNoLmNvbnRhaW5zUm93KHJvdykpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxhc3RGaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KHJvdyk7XG4gICAgICBmaWxlUGF0Y2hlcy5wdXNoKGxhc3RGaWxlUGF0Y2gpO1xuICAgIH1cblxuICAgIHJldHVybiBmaWxlUGF0Y2hlcztcbiAgfVxuXG4gIGFueVByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXIgIT09IG51bGwgJiYgdGhpcy5maWxlUGF0Y2hlcy5zb21lKGZwID0+IGZwLmlzUHJlc2VudCgpKTtcbiAgfVxuXG4gIGRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlKCkge1xuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgaWYgKGZpbGVQYXRjaC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhbnlIYXZlVHlwZWNoYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnNvbWUoZnAgPT4gZnAuaGFzVHlwZWNoYW5nZSgpKTtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnJlZHVjZSgobWF4V2lkdGgsIGZpbGVQYXRjaCkgPT4ge1xuICAgICAgY29uc3Qgd2lkdGggPSBmaWxlUGF0Y2guZ2V0TWF4TGluZU51bWJlcldpZHRoKCk7XG4gICAgICByZXR1cm4gbWF4V2lkdGggPj0gd2lkdGggPyBtYXhXaWR0aCA6IHdpZHRoO1xuICAgIH0sIDApO1xuICB9XG5cbiAgc3BhbnNNdWx0aXBsZUZpbGVzKHJvd3MpIHtcbiAgICBsZXQgbGFzdEZpbGVQYXRjaCA9IG51bGw7XG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgaWYgKGxhc3RGaWxlUGF0Y2gpIHtcbiAgICAgICAgaWYgKGxhc3RGaWxlUGF0Y2guY29udGFpbnNSb3cocm93KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0RmlsZVBhdGNoID0gdGhpcy5nZXRGaWxlUGF0Y2hBdChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb2xsYXBzZUZpbGVQYXRjaChmaWxlUGF0Y2gpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmlsZVBhdGNoZXMuaW5kZXhPZihmaWxlUGF0Y2gpO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmRlbGV0ZShmaWxlUGF0Y2guZ2V0TWFya2VyKCkpO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLmRlbGV0ZShodW5rLmdldE1hcmtlcigpKTtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmdldE1hcmtlcnNCZWZvcmUoaW5kZXgpO1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5nZXRNYXJrZXJzQWZ0ZXIoaW5kZXgpO1xuXG4gICAgZmlsZVBhdGNoLnRyaWdnZXJDb2xsYXBzZUluKHRoaXMucGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcblxuICAgIC8vIFRoaXMgaHVuayBjb2xsZWN0aW9uIHNob3VsZCBiZSBlbXB0eSwgYnV0IGxldCdzIGl0ZXJhdGUgYW55d2F5IGp1c3QgaW4gY2FzZSBmaWxlUGF0Y2ggd2FzIGFscmVhZHkgY29sbGFwc2VkXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgfVxuICB9XG5cbiAgZXhwYW5kRmlsZVBhdGNoKGZpbGVQYXRjaCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maWxlUGF0Y2hlcy5pbmRleE9mKGZpbGVQYXRjaCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZGVsZXRlKGZpbGVQYXRjaC5nZXRNYXJrZXIoKSk7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuZGVsZXRlKGh1bmsuZ2V0TWFya2VyKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShpbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihpbmRleCk7XG5cbiAgICBmaWxlUGF0Y2gudHJpZ2dlckV4cGFuZEluKHRoaXMucGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHBhdGNoIHdhcyBpbml0aWFsbHkgY29sbGFwc2VkLCB3ZSBuZWVkIHRvIGNhbGN1bGF0ZVxuICAgIC8vIHRoZSBkaWZmUm93T2Zmc2V0SW5kaWNlcyB0byBjYWxjdWxhdGUgY29tbWVudCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5pc0RpZmZSb3dPZmZzZXRJbmRleEVtcHR5KGZpbGVQYXRjaC5nZXRQYXRoKCkpKSB7XG4gICAgICB0aGlzLnBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMoZmlsZVBhdGNoKTtcbiAgICB9XG4gIH1cblxuICBnZXRNYXJrZXJzQmVmb3JlKGZpbGVQYXRjaEluZGV4KSB7XG4gICAgY29uc3QgYmVmb3JlID0gW107XG4gICAgbGV0IGJlZm9yZUluZGV4ID0gZmlsZVBhdGNoSW5kZXggLSAxO1xuICAgIHdoaWxlIChiZWZvcmVJbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBiZWZvcmVGaWxlUGF0Y2ggPSB0aGlzLmZpbGVQYXRjaGVzW2JlZm9yZUluZGV4XTtcbiAgICAgIGJlZm9yZS5wdXNoKC4uLmJlZm9yZUZpbGVQYXRjaC5nZXRFbmRpbmdNYXJrZXJzKCkpO1xuXG4gICAgICBpZiAoIWJlZm9yZUZpbGVQYXRjaC5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGJlZm9yZUluZGV4LS07XG4gICAgfVxuICAgIHJldHVybiBiZWZvcmU7XG4gIH1cblxuICBnZXRNYXJrZXJzQWZ0ZXIoZmlsZVBhdGNoSW5kZXgpIHtcbiAgICBjb25zdCBhZnRlciA9IFtdO1xuICAgIGxldCBhZnRlckluZGV4ID0gZmlsZVBhdGNoSW5kZXggKyAxO1xuICAgIHdoaWxlIChhZnRlckluZGV4IDwgdGhpcy5maWxlUGF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFmdGVyRmlsZVBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc1thZnRlckluZGV4XTtcbiAgICAgIGFmdGVyLnB1c2goLi4uYWZ0ZXJGaWxlUGF0Y2guZ2V0U3RhcnRpbmdNYXJrZXJzKCkpO1xuXG4gICAgICBpZiAoIWFmdGVyRmlsZVBhdGNoLmdldE1hcmtlcigpLmdldFJhbmdlKCkuaXNFbXB0eSgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYWZ0ZXJJbmRleCsrO1xuICAgIH1cbiAgICByZXR1cm4gYWZ0ZXI7XG4gIH1cblxuICBpc1BhdGNoVmlzaWJsZSA9IGZpbGVQYXRjaFBhdGggPT4ge1xuICAgIGNvbnN0IHBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc0J5UGF0aC5nZXQoZmlsZVBhdGNoUGF0aCk7XG4gICAgaWYgKCFwYXRjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCk7XG4gIH1cblxuICBnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24gPSAoZmlsZU5hbWUsIGRpZmZSb3cpID0+IHtcbiAgICBjb25zdCBvZmZzZXRJbmRleCA9IHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoIW9mZnNldEluZGV4KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcignQXR0ZW1wdCB0byBjb21wdXRlIGJ1ZmZlciByb3cgZm9yIGludmFsaWQgZGlmZiBwb3NpdGlvbjogZmlsZSBub3QgaW5jbHVkZWQnLCB7XG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBkaWZmUm93LFxuICAgICAgICB2YWxpZEZpbGVOYW1lczogQXJyYXkuZnJvbSh0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmtleXMoKSksXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7c3RhcnRCdWZmZXJSb3csIGluZGV4fSA9IG9mZnNldEluZGV4O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gaW5kZXgubG93ZXJCb3VuZCh7ZGlmZlJvd30pLmRhdGEoKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0F0dGVtcHQgdG8gY29tcHV0ZSBidWZmZXIgcm93IGZvciBpbnZhbGlkIGRpZmYgcG9zaXRpb246IGRpZmYgcm93IG91dCBvZiByYW5nZScsIHtcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGRpZmZSb3csXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7b2Zmc2V0fSA9IHJlc3VsdDtcblxuICAgIHJldHVybiBzdGFydEJ1ZmZlclJvdyArIGRpZmZSb3cgLSBvZmZzZXQ7XG4gIH1cblxuICBnZXRQcmV2aWV3UGF0Y2hCdWZmZXIoZmlsZU5hbWUsIGRpZmZSb3csIG1heFJvd0NvdW50KSB7XG4gICAgY29uc3QgYnVmZmVyUm93ID0gdGhpcy5nZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24oZmlsZU5hbWUsIGRpZmZSb3cpO1xuICAgIGlmIChidWZmZXJSb3cgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KGJ1ZmZlclJvdyk7XG4gICAgY29uc3QgZmlsZVBhdGNoSW5kZXggPSB0aGlzLmZpbGVQYXRjaGVzLmluZGV4T2YoZmlsZVBhdGNoKTtcbiAgICBjb25zdCBodW5rID0gdGhpcy5nZXRIdW5rQXQoYnVmZmVyUm93KTtcblxuICAgIGNvbnN0IHByZXZpZXdTdGFydFJvdyA9IE1hdGgubWF4KGJ1ZmZlclJvdyAtIG1heFJvd0NvdW50ICsgMSwgaHVuay5nZXRSYW5nZSgpLnN0YXJ0LnJvdyk7XG4gICAgY29uc3QgcHJldmlld0VuZFJvdyA9IGJ1ZmZlclJvdztcblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShmaWxlUGF0Y2hJbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihmaWxlUGF0Y2hJbmRleCk7XG4gICAgY29uc3QgZXhjbHVkZSA9IG5ldyBTZXQoWy4uLmJlZm9yZSwgLi4uYWZ0ZXJdKTtcblxuICAgIHJldHVybiB0aGlzLnBhdGNoQnVmZmVyLmNyZWF0ZVN1YkJ1ZmZlcihbW3ByZXZpZXdTdGFydFJvdywgMF0sIFtwcmV2aWV3RW5kUm93LCBJbmZpbml0eV1dLCB7ZXhjbHVkZX0pLnBhdGNoQnVmZmVyO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGFuIGFwcGx5LWFibGUgcGF0Y2ggU3RyaW5nLlxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXMubWFwKGZwID0+IGZwLnRvU3RyaW5nSW4odGhpcy5nZXRCdWZmZXIoKSkpLmpvaW4oJycpICsgJ1xcbic7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBzdHJpbmcgb2YgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbiB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3QoKSB7XG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSAnKE11bHRpRmlsZVBhdGNoJztcbiAgICBpbnNwZWN0U3RyaW5nICs9IGAgZmlsZVBhdGNoZXNCeU1hcmtlcj0oJHtBcnJheS5mcm9tKHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5rZXlzKCksIG0gPT4gbS5pZCkuam9pbignLCAnKX0pYDtcbiAgICBpbnNwZWN0U3RyaW5nICs9IGAgaHVua3NCeU1hcmtlcj0oJHtBcnJheS5mcm9tKHRoaXMuaHVua3NCeU1hcmtlci5rZXlzKCksIG0gPT4gbS5pZCkuam9pbignLCAnKX0pXFxuYDtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmZpbGVQYXRjaGVzKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGZpbGVQYXRjaC5pbnNwZWN0KHtpbmRlbnQ6IDJ9KTtcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSAnKVxcbic7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpc0VxdWFsKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKSA9PT0gb3RoZXIudG9TdHJpbmcoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFFQSxJQUFBRSxZQUFBLEdBQUFDLHNCQUFBLENBQUFILE9BQUE7QUFBeUMsU0FBQUcsdUJBQUFDLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxnQkFBQUgsR0FBQSxFQUFBSSxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBSixHQUFBLElBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFB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