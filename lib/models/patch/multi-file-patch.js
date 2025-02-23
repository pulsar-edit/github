"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _bintrees = require("bintrees");
var _patchBuffer = _interopRequireDefault(require("./patch-buffer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfYmludHJlZXMiLCJfcGF0Y2hCdWZmZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5IiwiciIsInQiLCJfdG9Qcm9wZXJ0eUtleSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiU3RyaW5nIiwiTnVtYmVyIiwiTXVsdGlGaWxlUGF0Y2giLCJjcmVhdGVOdWxsIiwicGF0Y2hCdWZmZXIiLCJQYXRjaEJ1ZmZlciIsImZpbGVQYXRjaGVzIiwiY29uc3RydWN0b3IiLCJmaWxlUGF0Y2hQYXRoIiwicGF0Y2giLCJmaWxlUGF0Y2hlc0J5UGF0aCIsImdldCIsImdldFJlbmRlclN0YXR1cyIsImlzVmlzaWJsZSIsImZpbGVOYW1lIiwiZGlmZlJvdyIsIm9mZnNldEluZGV4IiwiZGlmZlJvd09mZnNldEluZGljZXMiLCJjb25zb2xlIiwiZXJyb3IiLCJ2YWxpZEZpbGVOYW1lcyIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJzdGFydEJ1ZmZlclJvdyIsImluZGV4IiwicmVzdWx0IiwibG93ZXJCb3VuZCIsImRhdGEiLCJvZmZzZXQiLCJmaWxlUGF0Y2hlc0J5TWFya2VyIiwiTWFwIiwiaHVua3NCeU1hcmtlciIsImZpbGVQYXRjaCIsInNldCIsImdldFBhdGgiLCJnZXRNYXJrZXIiLCJwb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzIiwiY2xvbmUiLCJvcHRzIiwidW5kZWZpbmVkIiwiZ2V0UGF0Y2hCdWZmZXIiLCJnZXRGaWxlUGF0Y2hlcyIsImdldEJ1ZmZlciIsImdldFBhdGNoTGF5ZXIiLCJnZXRMYXllciIsImdldEh1bmtMYXllciIsImdldFVuY2hhbmdlZExheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsImdldFBhdGNoRm9yUGF0aCIsInBhdGgiLCJnZXRQYXRoU2V0IiwicmVkdWNlIiwicGF0aFNldCIsImZpbGUiLCJnZXRPbGRGaWxlIiwiZ2V0TmV3RmlsZSIsImlzUHJlc2VudCIsImFkZCIsIlNldCIsImdldEZpbGVQYXRjaEF0IiwiYnVmZmVyUm93IiwiZ2V0TGFzdFJvdyIsIm1hcmtlciIsImZpbmRNYXJrZXJzIiwiaW50ZXJzZWN0c1JvdyIsImdldEh1bmtBdCIsImdldFN0YWdlUGF0Y2hGb3JMaW5lcyIsInNlbGVjdGVkTGluZVNldCIsIm5leHRQYXRjaEJ1ZmZlciIsIm5leHRGaWxlUGF0Y2hlcyIsImdldEZpbGVQYXRjaGVzQ29udGFpbmluZyIsIm1hcCIsImZwIiwiYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMiLCJnZXRTdGFnZVBhdGNoRm9ySHVuayIsImh1bmsiLCJnZXRCdWZmZXJSb3dzIiwiZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMiLCJidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzIiwiZ2V0VW5zdGFnZVBhdGNoRm9ySHVuayIsImdldE1heFNlbGVjdGlvbkluZGV4Iiwic2VsZWN0ZWRSb3dzIiwic2l6ZSIsImxhc3RNYXgiLCJNYXRoIiwibWF4Iiwic2VsZWN0aW9uSW5kZXgiLCJwYXRjaExvb3AiLCJnZXRIdW5rcyIsImluY2x1ZGVzTWF4IiwiY2hhbmdlIiwiZ2V0Q2hhbmdlcyIsImludGVyc2VjdGlvbiIsImdhcCIsImludGVyc2VjdFJvd3MiLCJkZWx0YSIsInN0YXJ0Iiwicm93IiwiZ2V0Um93Q291bnQiLCJnZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4Iiwic2VsZWN0aW9uUm93IiwicmVtYWluaW5nQ2hhbmdlZExpbmVzIiwiZm91bmRSb3ciLCJsYXN0Q2hhbmdlZFJvdyIsImJ1ZmZlclJvd0NvdW50IiwiZ2V0U3RhcnRCdWZmZXJSb3ciLCJnZXRFbmRCdWZmZXJSb3ciLCJSYW5nZSIsImZyb21PYmplY3QiLCJJbmZpbml0eSIsImlzRGlmZlJvd09mZnNldEluZGV4RW1wdHkiLCJkaWZmUm93T2Zmc2V0SW5kZXgiLCJSQlRyZWUiLCJhIiwiYiIsImdldFN0YXJ0UmFuZ2UiLCJodW5rSW5kZXgiLCJsZW5ndGgiLCJpbnNlcnQiLCJhZG9wdEJ1ZmZlciIsImNsZWFyQWxsTGF5ZXJzIiwiY2xlYXIiLCJtYXJrZXJNYXAiLCJhZG9wdCIsInVwZGF0ZU1hcmtlcnMiLCJyb3dTZXQiLCJzb3J0ZWRSb3dTZXQiLCJzb3J0IiwibGFzdEZpbGVQYXRjaCIsImNvbnRhaW5zUm93IiwicHVzaCIsImFueVByZXNlbnQiLCJzb21lIiwiZGlkQW55Q2hhbmdlRXhlY3V0YWJsZU1vZGUiLCJkaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiaGFzVHlwZWNoYW5nZSIsImdldE1heExpbmVOdW1iZXJXaWR0aCIsIm1heFdpZHRoIiwid2lkdGgiLCJzcGFuc011bHRpcGxlRmlsZXMiLCJyb3dzIiwiY29sbGFwc2VGaWxlUGF0Y2giLCJpbmRleE9mIiwiZGVsZXRlIiwiYmVmb3JlIiwiZ2V0TWFya2Vyc0JlZm9yZSIsImFmdGVyIiwiZ2V0TWFya2Vyc0FmdGVyIiwidHJpZ2dlckNvbGxhcHNlSW4iLCJleHBhbmRGaWxlUGF0Y2giLCJ0cmlnZ2VyRXhwYW5kSW4iLCJmaWxlUGF0Y2hJbmRleCIsImJlZm9yZUluZGV4IiwiYmVmb3JlRmlsZVBhdGNoIiwiZ2V0RW5kaW5nTWFya2VycyIsImdldFJhbmdlIiwiaXNFbXB0eSIsImFmdGVySW5kZXgiLCJhZnRlckZpbGVQYXRjaCIsImdldFN0YXJ0aW5nTWFya2VycyIsImdldFByZXZpZXdQYXRjaEJ1ZmZlciIsIm1heFJvd0NvdW50IiwiZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uIiwicHJldmlld1N0YXJ0Um93IiwicHJldmlld0VuZFJvdyIsImV4Y2x1ZGUiLCJjcmVhdGVTdWJCdWZmZXIiLCJ0b1N0cmluZyIsInRvU3RyaW5nSW4iLCJqb2luIiwiaW5zcGVjdCIsImluc3BlY3RTdHJpbmciLCJtIiwiaWQiLCJpbmRlbnQiLCJpc0VxdWFsIiwib3RoZXIiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsibXVsdGktZmlsZS1wYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7UkJUcmVlfSBmcm9tICdiaW50cmVlcyc7XG5cbmltcG9ydCBQYXRjaEJ1ZmZlciBmcm9tICcuL3BhdGNoLWJ1ZmZlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpRmlsZVBhdGNoIHtcbiAgc3RhdGljIGNyZWF0ZU51bGwoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHtwYXRjaEJ1ZmZlcjogbmV3IFBhdGNoQnVmZmVyKCksIGZpbGVQYXRjaGVzOiBbXX0pO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlc30pIHtcbiAgICB0aGlzLnBhdGNoQnVmZmVyID0gcGF0Y2hCdWZmZXI7XG4gICAgdGhpcy5maWxlUGF0Y2hlcyA9IGZpbGVQYXRjaGVzO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZmlsZVBhdGNoZXNCeVBhdGggPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5odW5rc0J5TWFya2VyID0gbmV3IE1hcCgpO1xuXG4gICAgLy8gU3RvcmUgYSBtYXAgb2Yge2RpZmZSb3csIG9mZnNldH0gZm9yIGVhY2ggRmlsZVBhdGNoIHdoZXJlIG9mZnNldCBpcyB0aGUgbnVtYmVyIG9mIEh1bmsgaGVhZGVycyB3aXRoaW4gdGhlIGN1cnJlbnRcbiAgICAvLyBGaWxlUGF0Y2ggdGhhdCBvY2N1ciBiZWZvcmUgdGhpcyByb3cgaW4gdGhlIG9yaWdpbmFsIGRpZmYgb3V0cHV0LlxuICAgIHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMgPSBuZXcgTWFwKCk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmZpbGVQYXRjaGVzKSB7XG4gICAgICB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLnNldChmaWxlUGF0Y2guZ2V0UGF0aCgpLCBmaWxlUGF0Y2gpO1xuICAgICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLnNldChmaWxlUGF0Y2guZ2V0TWFya2VyKCksIGZpbGVQYXRjaCk7XG5cbiAgICAgIHRoaXMucG9wdWxhdGVEaWZmUm93T2Zmc2V0SW5kaWNlcyhmaWxlUGF0Y2gpO1xuICAgIH1cbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICBwYXRjaEJ1ZmZlcjogb3B0cy5wYXRjaEJ1ZmZlciAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRjaEJ1ZmZlciA6IHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKSxcbiAgICAgIGZpbGVQYXRjaGVzOiBvcHRzLmZpbGVQYXRjaGVzICE9PSB1bmRlZmluZWQgPyBvcHRzLmZpbGVQYXRjaGVzIDogdGhpcy5nZXRGaWxlUGF0Y2hlcygpLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGF0Y2hCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXI7XG4gIH1cblxuICBnZXRCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRCdWZmZXIoKTtcbiAgfVxuXG4gIGdldFBhdGNoTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcigncGF0Y2gnKTtcbiAgfVxuXG4gIGdldEh1bmtMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdodW5rJyk7XG4gIH1cblxuICBnZXRVbmNoYW5nZWRMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCd1bmNoYW5nZWQnKTtcbiAgfVxuXG4gIGdldEFkZGl0aW9uTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignYWRkaXRpb24nKTtcbiAgfVxuXG4gIGdldERlbGV0aW9uTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignZGVsZXRpb24nKTtcbiAgfVxuXG4gIGdldE5vTmV3bGluZUxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ25vbmV3bGluZScpO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXM7XG4gIH1cblxuICBnZXRQYXRjaEZvclBhdGgocGF0aCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLmdldChwYXRoKTtcbiAgfVxuXG4gIGdldFBhdGhTZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKS5yZWR1Y2UoKHBhdGhTZXQsIGZpbGVQYXRjaCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIFtmaWxlUGF0Y2guZ2V0T2xkRmlsZSgpLCBmaWxlUGF0Y2guZ2V0TmV3RmlsZSgpXSkge1xuICAgICAgICBpZiAoZmlsZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgIHBhdGhTZXQuYWRkKGZpbGUuZ2V0UGF0aCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGhTZXQ7XG4gICAgfSwgbmV3IFNldCgpKTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaEF0KGJ1ZmZlclJvdykge1xuICAgIGlmIChidWZmZXJSb3cgPCAwIHx8IGJ1ZmZlclJvdyA+IHRoaXMucGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBbbWFya2VyXSA9IHRoaXMucGF0Y2hCdWZmZXIuZmluZE1hcmtlcnMoJ3BhdGNoJywge2ludGVyc2VjdHNSb3c6IGJ1ZmZlclJvd30pO1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZ2V0KG1hcmtlcik7XG4gIH1cblxuICBnZXRIdW5rQXQoYnVmZmVyUm93KSB7XG4gICAgaWYgKGJ1ZmZlclJvdyA8IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IFttYXJrZXJdID0gdGhpcy5wYXRjaEJ1ZmZlci5maW5kTWFya2VycygnaHVuaycsIHtpbnRlcnNlY3RzUm93OiBidWZmZXJSb3d9KTtcbiAgICByZXR1cm4gdGhpcy5odW5rc0J5TWFya2VyLmdldChtYXJrZXIpO1xuICB9XG5cbiAgZ2V0U3RhZ2VQYXRjaEZvckxpbmVzKHNlbGVjdGVkTGluZVNldCkge1xuICAgIGNvbnN0IG5leHRQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgIGNvbnN0IG5leHRGaWxlUGF0Y2hlcyA9IHRoaXMuZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nKHNlbGVjdGVkTGluZVNldCkubWFwKGZwID0+IHtcbiAgICAgIHJldHVybiBmcC5idWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyh0aGlzLmdldEJ1ZmZlcigpLCBuZXh0UGF0Y2hCdWZmZXIsIHNlbGVjdGVkTGluZVNldCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe3BhdGNoQnVmZmVyOiBuZXh0UGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzOiBuZXh0RmlsZVBhdGNoZXN9KTtcbiAgfVxuXG4gIGdldFN0YWdlUGF0Y2hGb3JIdW5rKGh1bmspIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGFnZVBhdGNoRm9yTGluZXMobmV3IFNldChodW5rLmdldEJ1ZmZlclJvd3MoKSkpO1xuICB9XG5cbiAgZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMoc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgY29uc3QgbmV4dFBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgY29uc3QgbmV4dEZpbGVQYXRjaGVzID0gdGhpcy5nZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcoc2VsZWN0ZWRMaW5lU2V0KS5tYXAoZnAgPT4ge1xuICAgICAgcmV0dXJuIGZwLmJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXModGhpcy5nZXRCdWZmZXIoKSwgbmV4dFBhdGNoQnVmZmVyLCBzZWxlY3RlZExpbmVTZXQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtwYXRjaEJ1ZmZlcjogbmV4dFBhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlczogbmV4dEZpbGVQYXRjaGVzfSk7XG4gIH1cblxuICBnZXRVbnN0YWdlUGF0Y2hGb3JIdW5rKGh1bmspIHtcbiAgICByZXR1cm4gdGhpcy5nZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhuZXcgU2V0KGh1bmsuZ2V0QnVmZmVyUm93cygpKSk7XG4gIH1cblxuICBnZXRNYXhTZWxlY3Rpb25JbmRleChzZWxlY3RlZFJvd3MpIHtcbiAgICBpZiAoc2VsZWN0ZWRSb3dzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RNYXggPSBNYXRoLm1heCguLi5zZWxlY3RlZFJvd3MpO1xuXG4gICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gMDtcbiAgICAvLyBjb3VudHMgdW5zZWxlY3RlZCBsaW5lcyBpbiBjaGFuZ2VkIHJlZ2lvbnMgZnJvbSB0aGUgb2xkIHBhdGNoXG4gICAgLy8gdW50aWwgd2UgZ2V0IHRvIHRoZSBib3R0b20tbW9zdCBzZWxlY3RlZCBsaW5lIGZyb20gdGhlIG9sZCBwYXRjaCAobGFzdE1heCkuXG4gICAgcGF0Y2hMb29wOiBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICBsZXQgaW5jbHVkZXNNYXggPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBodW5rLmdldENoYW5nZXMoKSkge1xuICAgICAgICAgIGZvciAoY29uc3Qge2ludGVyc2VjdGlvbiwgZ2FwfSBvZiBjaGFuZ2UuaW50ZXJzZWN0Um93cyhzZWxlY3RlZFJvd3MsIHRydWUpKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGluY2x1ZGUgYSBwYXJ0aWFsIHJhbmdlIGlmIHRoaXMgaW50ZXJzZWN0aW9uIGluY2x1ZGVzIHRoZSBsYXN0IHNlbGVjdGVkIGJ1ZmZlciByb3cuXG4gICAgICAgICAgICBpbmNsdWRlc01heCA9IGludGVyc2VjdGlvbi5pbnRlcnNlY3RzUm93KGxhc3RNYXgpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBpbmNsdWRlc01heCA/IGxhc3RNYXggLSBpbnRlcnNlY3Rpb24uc3RhcnQucm93ICsgMSA6IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuXG4gICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgIC8vIFJhbmdlIG9mIHVuc2VsZWN0ZWQgY2hhbmdlcy5cbiAgICAgICAgICAgICAgc2VsZWN0aW9uSW5kZXggKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmNsdWRlc01heCkge1xuICAgICAgICAgICAgICBicmVhayBwYXRjaExvb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGlvbkluZGV4O1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uUmFuZ2VGb3JJbmRleChzZWxlY3Rpb25JbmRleCkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBjaGFuZ2VkIGxpbmVzIGluIHRoaXMgcGF0Y2ggaW4gb3JkZXIgdG8gZmluZCB0aGVcbiAgICAvLyBuZXcgcm93IHRvIGJlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZSBsYXN0IHNlbGVjdGlvbiBpbmRleC5cbiAgICAvLyBBcyB3ZSB3YWxrIHRocm91Z2ggdGhlIGNoYW5nZWQgbGluZXMsIHdlIHdoaXR0bGUgZG93biB0aGVcbiAgICAvLyByZW1haW5pbmcgbGluZXMgdW50aWwgd2UgcmVhY2ggdGhlIHJvdyB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZVxuICAgIC8vIGxhc3Qgc2VsZWN0ZWQgaW5kZXguXG5cbiAgICBsZXQgc2VsZWN0aW9uUm93ID0gMDtcbiAgICBsZXQgcmVtYWluaW5nQ2hhbmdlZExpbmVzID0gc2VsZWN0aW9uSW5kZXg7XG5cbiAgICBsZXQgZm91bmRSb3cgPSBmYWxzZTtcbiAgICBsZXQgbGFzdENoYW5nZWRSb3cgPSAwO1xuXG4gICAgcGF0Y2hMb29wOiBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmdldEZpbGVQYXRjaGVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBodW5rLmdldENoYW5nZXMoKSkge1xuICAgICAgICAgIGlmIChyZW1haW5pbmdDaGFuZ2VkTGluZXMgPCBjaGFuZ2UuYnVmZmVyUm93Q291bnQoKSkge1xuICAgICAgICAgICAgc2VsZWN0aW9uUm93ID0gY2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCkgKyByZW1haW5pbmdDaGFuZ2VkTGluZXM7XG4gICAgICAgICAgICBmb3VuZFJvdyA9IHRydWU7XG4gICAgICAgICAgICBicmVhayBwYXRjaExvb3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ0NoYW5nZWRMaW5lcyAtPSBjaGFuZ2UuYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgIGxhc3RDaGFuZ2VkUm93ID0gY2hhbmdlLmdldEVuZEJ1ZmZlclJvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIG5ldmVyIGdvdCB0byB0aGUgbGFzdCBzZWxlY3RlZCBpbmRleCwgdGhhdCBtZWFucyBpdCBpc1xuICAgIC8vIG5vIGxvbmdlciBwcmVzZW50IGluIHRoZSBuZXcgcGF0Y2ggKGllLiB3ZSBzdGFnZWQgdGhlIGxhc3QgbGluZSBvZiB0aGUgZmlsZSkuXG4gICAgLy8gSW4gdGhpcyBjYXNlIHdlIHdhbnQgdGhlIG5leHQgc2VsZWN0ZWQgbGluZSB0byBiZSB0aGUgbGFzdCBjaGFuZ2VkIHJvdyBpbiB0aGUgZmlsZVxuICAgIGlmICghZm91bmRSb3cpIHtcbiAgICAgIHNlbGVjdGlvblJvdyA9IGxhc3RDaGFuZ2VkUm93O1xuICAgIH1cblxuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbc2VsZWN0aW9uUm93LCAwXSwgW3NlbGVjdGlvblJvdywgSW5maW5pdHldXSk7XG4gIH1cblxuICBpc0RpZmZSb3dPZmZzZXRJbmRleEVtcHR5KGZpbGVQYXRjaFBhdGgpIHtcbiAgICBjb25zdCBkaWZmUm93T2Zmc2V0SW5kZXggPSB0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmdldChmaWxlUGF0Y2hQYXRoKTtcbiAgICByZXR1cm4gZGlmZlJvd09mZnNldEluZGV4LmluZGV4LnNpemUgPT09IDA7XG4gIH1cblxuICBwb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzKGZpbGVQYXRjaCkge1xuICAgIGxldCBkaWZmUm93ID0gMTtcbiAgICBjb25zdCBpbmRleCA9IG5ldyBSQlRyZWUoKGEsIGIpID0+IGEuZGlmZlJvdyAtIGIuZGlmZlJvdyk7XG4gICAgdGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcy5zZXQoZmlsZVBhdGNoLmdldFBhdGgoKSwge3N0YXJ0QnVmZmVyUm93OiBmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpLnN0YXJ0LnJvdywgaW5kZXh9KTtcblxuICAgIGZvciAobGV0IGh1bmtJbmRleCA9IDA7IGh1bmtJbmRleCA8IGZpbGVQYXRjaC5nZXRIdW5rcygpLmxlbmd0aDsgaHVua0luZGV4KyspIHtcbiAgICAgIGNvbnN0IGh1bmsgPSBmaWxlUGF0Y2guZ2V0SHVua3MoKVtodW5rSW5kZXhdO1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcblxuICAgICAgLy8gQWR2YW5jZSBwYXN0IHRoZSBodW5rIGJvZHlcbiAgICAgIGRpZmZSb3cgKz0gaHVuay5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgaW5kZXguaW5zZXJ0KHtkaWZmUm93LCBvZmZzZXQ6IGh1bmtJbmRleCArIDF9KTtcblxuICAgICAgLy8gQWR2YW5jZSBwYXN0IHRoZSBuZXh0IGh1bmsgaGVhZGVyXG4gICAgICBkaWZmUm93Kys7XG4gICAgfVxuICB9XG5cbiAgYWRvcHRCdWZmZXIobmV4dFBhdGNoQnVmZmVyKSB7XG4gICAgbmV4dFBhdGNoQnVmZmVyLmNsZWFyQWxsTGF5ZXJzKCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuY2xlYXIoKTtcbiAgICB0aGlzLmh1bmtzQnlNYXJrZXIuY2xlYXIoKTtcblxuICAgIGNvbnN0IG1hcmtlck1hcCA9IG5leHRQYXRjaEJ1ZmZlci5hZG9wdCh0aGlzLnBhdGNoQnVmZmVyKTtcblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgZmlsZVBhdGNoLnVwZGF0ZU1hcmtlcnMobWFya2VyTWFwKTtcbiAgICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5zZXQoZmlsZVBhdGNoLmdldE1hcmtlcigpLCBmaWxlUGF0Y2gpO1xuXG4gICAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhdGNoQnVmZmVyID0gbmV4dFBhdGNoQnVmZmVyO1xuICB9XG5cbiAgLypcbiAgICogRWZmaWNpZW50bHkgbG9jYXRlIHRoZSBGaWxlUGF0Y2ggaW5zdGFuY2VzIHRoYXQgY29udGFpbiBhdCBsZWFzdCBvbmUgcm93IGZyb20gYSBTZXQuXG4gICAqL1xuICBnZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcocm93U2V0KSB7XG4gICAgY29uc3Qgc29ydGVkUm93U2V0ID0gQXJyYXkuZnJvbShyb3dTZXQpO1xuICAgIHNvcnRlZFJvd1NldC5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBmaWxlUGF0Y2hlcyA9IFtdO1xuICAgIGxldCBsYXN0RmlsZVBhdGNoID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiBzb3J0ZWRSb3dTZXQpIHtcbiAgICAgIC8vIEJlY2F1c2UgdGhlIHJvd3MgYXJlIHNvcnRlZCwgY29uc2VjdXRpdmUgcm93cyB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmVsb25nIHRvIHRoZSBzYW1lIHBhdGNoLCBzbyB3ZSBjYW4gc2F2ZVxuICAgICAgLy8gbWFueSBhdm9pZGFibGUgbWFya2VyIGluZGV4IGxvb2t1cHMgYnkgY29tcGFyaW5nIHdpdGggdGhlIGxhc3QuXG4gICAgICBpZiAobGFzdEZpbGVQYXRjaCAmJiBsYXN0RmlsZVBhdGNoLmNvbnRhaW5zUm93KHJvdykpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxhc3RGaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KHJvdyk7XG4gICAgICBmaWxlUGF0Y2hlcy5wdXNoKGxhc3RGaWxlUGF0Y2gpO1xuICAgIH1cblxuICAgIHJldHVybiBmaWxlUGF0Y2hlcztcbiAgfVxuXG4gIGFueVByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXIgIT09IG51bGwgJiYgdGhpcy5maWxlUGF0Y2hlcy5zb21lKGZwID0+IGZwLmlzUHJlc2VudCgpKTtcbiAgfVxuXG4gIGRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlKCkge1xuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgaWYgKGZpbGVQYXRjaC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhbnlIYXZlVHlwZWNoYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnNvbWUoZnAgPT4gZnAuaGFzVHlwZWNoYW5nZSgpKTtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnJlZHVjZSgobWF4V2lkdGgsIGZpbGVQYXRjaCkgPT4ge1xuICAgICAgY29uc3Qgd2lkdGggPSBmaWxlUGF0Y2guZ2V0TWF4TGluZU51bWJlcldpZHRoKCk7XG4gICAgICByZXR1cm4gbWF4V2lkdGggPj0gd2lkdGggPyBtYXhXaWR0aCA6IHdpZHRoO1xuICAgIH0sIDApO1xuICB9XG5cbiAgc3BhbnNNdWx0aXBsZUZpbGVzKHJvd3MpIHtcbiAgICBsZXQgbGFzdEZpbGVQYXRjaCA9IG51bGw7XG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgaWYgKGxhc3RGaWxlUGF0Y2gpIHtcbiAgICAgICAgaWYgKGxhc3RGaWxlUGF0Y2guY29udGFpbnNSb3cocm93KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0RmlsZVBhdGNoID0gdGhpcy5nZXRGaWxlUGF0Y2hBdChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb2xsYXBzZUZpbGVQYXRjaChmaWxlUGF0Y2gpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmlsZVBhdGNoZXMuaW5kZXhPZihmaWxlUGF0Y2gpO1xuXG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmRlbGV0ZShmaWxlUGF0Y2guZ2V0TWFya2VyKCkpO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLmRlbGV0ZShodW5rLmdldE1hcmtlcigpKTtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLmdldE1hcmtlcnNCZWZvcmUoaW5kZXgpO1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5nZXRNYXJrZXJzQWZ0ZXIoaW5kZXgpO1xuXG4gICAgZmlsZVBhdGNoLnRyaWdnZXJDb2xsYXBzZUluKHRoaXMucGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcblxuICAgIC8vIFRoaXMgaHVuayBjb2xsZWN0aW9uIHNob3VsZCBiZSBlbXB0eSwgYnV0IGxldCdzIGl0ZXJhdGUgYW55d2F5IGp1c3QgaW4gY2FzZSBmaWxlUGF0Y2ggd2FzIGFscmVhZHkgY29sbGFwc2VkXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgfVxuICB9XG5cbiAgZXhwYW5kRmlsZVBhdGNoKGZpbGVQYXRjaCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maWxlUGF0Y2hlcy5pbmRleE9mKGZpbGVQYXRjaCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZGVsZXRlKGZpbGVQYXRjaC5nZXRNYXJrZXIoKSk7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuZGVsZXRlKGh1bmsuZ2V0TWFya2VyKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShpbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihpbmRleCk7XG5cbiAgICBmaWxlUGF0Y2gudHJpZ2dlckV4cGFuZEluKHRoaXMucGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5zZXQoaHVuay5nZXRNYXJrZXIoKSwgaHVuayk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHBhdGNoIHdhcyBpbml0aWFsbHkgY29sbGFwc2VkLCB3ZSBuZWVkIHRvIGNhbGN1bGF0ZVxuICAgIC8vIHRoZSBkaWZmUm93T2Zmc2V0SW5kaWNlcyB0byBjYWxjdWxhdGUgY29tbWVudCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5pc0RpZmZSb3dPZmZzZXRJbmRleEVtcHR5KGZpbGVQYXRjaC5nZXRQYXRoKCkpKSB7XG4gICAgICB0aGlzLnBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMoZmlsZVBhdGNoKTtcbiAgICB9XG4gIH1cblxuICBnZXRNYXJrZXJzQmVmb3JlKGZpbGVQYXRjaEluZGV4KSB7XG4gICAgY29uc3QgYmVmb3JlID0gW107XG4gICAgbGV0IGJlZm9yZUluZGV4ID0gZmlsZVBhdGNoSW5kZXggLSAxO1xuICAgIHdoaWxlIChiZWZvcmVJbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBiZWZvcmVGaWxlUGF0Y2ggPSB0aGlzLmZpbGVQYXRjaGVzW2JlZm9yZUluZGV4XTtcbiAgICAgIGJlZm9yZS5wdXNoKC4uLmJlZm9yZUZpbGVQYXRjaC5nZXRFbmRpbmdNYXJrZXJzKCkpO1xuXG4gICAgICBpZiAoIWJlZm9yZUZpbGVQYXRjaC5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGJlZm9yZUluZGV4LS07XG4gICAgfVxuICAgIHJldHVybiBiZWZvcmU7XG4gIH1cblxuICBnZXRNYXJrZXJzQWZ0ZXIoZmlsZVBhdGNoSW5kZXgpIHtcbiAgICBjb25zdCBhZnRlciA9IFtdO1xuICAgIGxldCBhZnRlckluZGV4ID0gZmlsZVBhdGNoSW5kZXggKyAxO1xuICAgIHdoaWxlIChhZnRlckluZGV4IDwgdGhpcy5maWxlUGF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFmdGVyRmlsZVBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc1thZnRlckluZGV4XTtcbiAgICAgIGFmdGVyLnB1c2goLi4uYWZ0ZXJGaWxlUGF0Y2guZ2V0U3RhcnRpbmdNYXJrZXJzKCkpO1xuXG4gICAgICBpZiAoIWFmdGVyRmlsZVBhdGNoLmdldE1hcmtlcigpLmdldFJhbmdlKCkuaXNFbXB0eSgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYWZ0ZXJJbmRleCsrO1xuICAgIH1cbiAgICByZXR1cm4gYWZ0ZXI7XG4gIH1cblxuICBpc1BhdGNoVmlzaWJsZSA9IGZpbGVQYXRjaFBhdGggPT4ge1xuICAgIGNvbnN0IHBhdGNoID0gdGhpcy5maWxlUGF0Y2hlc0J5UGF0aC5nZXQoZmlsZVBhdGNoUGF0aCk7XG4gICAgaWYgKCFwYXRjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCk7XG4gIH1cblxuICBnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24gPSAoZmlsZU5hbWUsIGRpZmZSb3cpID0+IHtcbiAgICBjb25zdCBvZmZzZXRJbmRleCA9IHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoIW9mZnNldEluZGV4KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcignQXR0ZW1wdCB0byBjb21wdXRlIGJ1ZmZlciByb3cgZm9yIGludmFsaWQgZGlmZiBwb3NpdGlvbjogZmlsZSBub3QgaW5jbHVkZWQnLCB7XG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBkaWZmUm93LFxuICAgICAgICB2YWxpZEZpbGVOYW1lczogQXJyYXkuZnJvbSh0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLmtleXMoKSksXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7c3RhcnRCdWZmZXJSb3csIGluZGV4fSA9IG9mZnNldEluZGV4O1xuXG4gICAgY29uc3QgcmVzdWx0ID0gaW5kZXgubG93ZXJCb3VuZCh7ZGlmZlJvd30pLmRhdGEoKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0F0dGVtcHQgdG8gY29tcHV0ZSBidWZmZXIgcm93IGZvciBpbnZhbGlkIGRpZmYgcG9zaXRpb246IGRpZmYgcm93IG91dCBvZiByYW5nZScsIHtcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGRpZmZSb3csXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7b2Zmc2V0fSA9IHJlc3VsdDtcblxuICAgIHJldHVybiBzdGFydEJ1ZmZlclJvdyArIGRpZmZSb3cgLSBvZmZzZXQ7XG4gIH1cblxuICBnZXRQcmV2aWV3UGF0Y2hCdWZmZXIoZmlsZU5hbWUsIGRpZmZSb3csIG1heFJvd0NvdW50KSB7XG4gICAgY29uc3QgYnVmZmVyUm93ID0gdGhpcy5nZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24oZmlsZU5hbWUsIGRpZmZSb3cpO1xuICAgIGlmIChidWZmZXJSb3cgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KGJ1ZmZlclJvdyk7XG4gICAgY29uc3QgZmlsZVBhdGNoSW5kZXggPSB0aGlzLmZpbGVQYXRjaGVzLmluZGV4T2YoZmlsZVBhdGNoKTtcbiAgICBjb25zdCBodW5rID0gdGhpcy5nZXRIdW5rQXQoYnVmZmVyUm93KTtcblxuICAgIGNvbnN0IHByZXZpZXdTdGFydFJvdyA9IE1hdGgubWF4KGJ1ZmZlclJvdyAtIG1heFJvd0NvdW50ICsgMSwgaHVuay5nZXRSYW5nZSgpLnN0YXJ0LnJvdyk7XG4gICAgY29uc3QgcHJldmlld0VuZFJvdyA9IGJ1ZmZlclJvdztcblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShmaWxlUGF0Y2hJbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihmaWxlUGF0Y2hJbmRleCk7XG4gICAgY29uc3QgZXhjbHVkZSA9IG5ldyBTZXQoWy4uLmJlZm9yZSwgLi4uYWZ0ZXJdKTtcblxuICAgIHJldHVybiB0aGlzLnBhdGNoQnVmZmVyLmNyZWF0ZVN1YkJ1ZmZlcihbW3ByZXZpZXdTdGFydFJvdywgMF0sIFtwcmV2aWV3RW5kUm93LCBJbmZpbml0eV1dLCB7ZXhjbHVkZX0pLnBhdGNoQnVmZmVyO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGFuIGFwcGx5LWFibGUgcGF0Y2ggU3RyaW5nLlxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXMubWFwKGZwID0+IGZwLnRvU3RyaW5nSW4odGhpcy5nZXRCdWZmZXIoKSkpLmpvaW4oJycpICsgJ1xcbic7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBzdHJpbmcgb2YgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbiB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3QoKSB7XG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSAnKE11bHRpRmlsZVBhdGNoJztcbiAgICBpbnNwZWN0U3RyaW5nICs9IGAgZmlsZVBhdGNoZXNCeU1hcmtlcj0oJHtBcnJheS5mcm9tKHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5rZXlzKCksIG0gPT4gbS5pZCkuam9pbignLCAnKX0pYDtcbiAgICBpbnNwZWN0U3RyaW5nICs9IGAgaHVua3NCeU1hcmtlcj0oJHtBcnJheS5mcm9tKHRoaXMuaHVua3NCeU1hcmtlci5rZXlzKCksIG0gPT4gbS5pZCkuam9pbignLCAnKX0pXFxuYDtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRjaCBvZiB0aGlzLmZpbGVQYXRjaGVzKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGZpbGVQYXRjaC5pbnNwZWN0KHtpbmRlbnQ6IDJ9KTtcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSAnKVxcbic7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpc0VxdWFsKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKSA9PT0gb3RoZXIudG9TdHJpbmcoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFFQSxJQUFBRSxZQUFBLEdBQUFDLHNCQUFBLENBQUFILE9BQUE7QUFBeUMsU0FBQUcsdUJBQUFDLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFBQSxTQUFBRyxnQkFBQUgsQ0FBQSxFQUFBSSxDQUFBLEVBQUFDLENBQUEsWUFBQUQsQ0FBQSxHQUFBRSxjQUFBLENBQUFGLENBQUEsTUFBQUosQ0FBQSxHQUFBTyxNQUFBLENBQUFDLGNBQUEsQ0FBQVIsQ0FBQSxFQUFBSSxDQUFBLElBQUFLLEtBQUEsRUFBQUosQ0FBQSxF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