"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _atom = require("atom");

var _bintrees = require("bintrees");

var _patchBuffer = _interopRequireDefault(require("./patch-buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    this.hunksByMarker = new Map(); // Store a map of {diffRow, offset} for each FilePatch where offset is the number of Hunk headers within the current
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
    let selectionIndex = 0; // counts unselected lines in changed regions from the old patch
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
    } // If we never got to the last selected index, that means it is
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
      this.hunksByMarker.set(hunk.getMarker(), hunk); // Advance past the hunk body

      diffRow += hunk.bufferRowCount();
      index.insert({
        diffRow,
        offset: hunkIndex + 1
      }); // Advance past the next hunk header

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
    this.filePatchesByMarker.set(filePatch.getMarker(), filePatch); // This hunk collection should be empty, but let's iterate anyway just in case filePatch was already collapsed

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
    } // if the patch was initially collapsed, we need to calculate
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcGF0Y2gvbXVsdGktZmlsZS1wYXRjaC5qcyJdLCJuYW1lcyI6WyJNdWx0aUZpbGVQYXRjaCIsImNyZWF0ZU51bGwiLCJwYXRjaEJ1ZmZlciIsIlBhdGNoQnVmZmVyIiwiZmlsZVBhdGNoZXMiLCJjb25zdHJ1Y3RvciIsImZpbGVQYXRjaFBhdGgiLCJwYXRjaCIsImZpbGVQYXRjaGVzQnlQYXRoIiwiZ2V0IiwiZ2V0UmVuZGVyU3RhdHVzIiwiaXNWaXNpYmxlIiwiZmlsZU5hbWUiLCJkaWZmUm93Iiwib2Zmc2V0SW5kZXgiLCJkaWZmUm93T2Zmc2V0SW5kaWNlcyIsImNvbnNvbGUiLCJlcnJvciIsInZhbGlkRmlsZU5hbWVzIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInN0YXJ0QnVmZmVyUm93IiwiaW5kZXgiLCJyZXN1bHQiLCJsb3dlckJvdW5kIiwiZGF0YSIsIm9mZnNldCIsImZpbGVQYXRjaGVzQnlNYXJrZXIiLCJNYXAiLCJodW5rc0J5TWFya2VyIiwiZmlsZVBhdGNoIiwic2V0IiwiZ2V0UGF0aCIsImdldE1hcmtlciIsInBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMiLCJjbG9uZSIsIm9wdHMiLCJ1bmRlZmluZWQiLCJnZXRQYXRjaEJ1ZmZlciIsImdldEZpbGVQYXRjaGVzIiwiZ2V0QnVmZmVyIiwiZ2V0UGF0Y2hMYXllciIsImdldExheWVyIiwiZ2V0SHVua0xheWVyIiwiZ2V0VW5jaGFuZ2VkTGF5ZXIiLCJnZXRBZGRpdGlvbkxheWVyIiwiZ2V0RGVsZXRpb25MYXllciIsImdldE5vTmV3bGluZUxheWVyIiwiZ2V0UGF0Y2hGb3JQYXRoIiwicGF0aCIsImdldFBhdGhTZXQiLCJyZWR1Y2UiLCJwYXRoU2V0IiwiZmlsZSIsImdldE9sZEZpbGUiLCJnZXROZXdGaWxlIiwiaXNQcmVzZW50IiwiYWRkIiwiU2V0IiwiZ2V0RmlsZVBhdGNoQXQiLCJidWZmZXJSb3ciLCJnZXRMYXN0Um93IiwibWFya2VyIiwiZmluZE1hcmtlcnMiLCJpbnRlcnNlY3RzUm93IiwiZ2V0SHVua0F0IiwiZ2V0U3RhZ2VQYXRjaEZvckxpbmVzIiwic2VsZWN0ZWRMaW5lU2V0IiwibmV4dFBhdGNoQnVmZmVyIiwibmV4dEZpbGVQYXRjaGVzIiwiZ2V0RmlsZVBhdGNoZXNDb250YWluaW5nIiwibWFwIiwiZnAiLCJidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyIsImdldFN0YWdlUGF0Y2hGb3JIdW5rIiwiaHVuayIsImdldEJ1ZmZlclJvd3MiLCJnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMiLCJnZXRVbnN0YWdlUGF0Y2hGb3JIdW5rIiwiZ2V0TWF4U2VsZWN0aW9uSW5kZXgiLCJzZWxlY3RlZFJvd3MiLCJzaXplIiwibGFzdE1heCIsIk1hdGgiLCJtYXgiLCJzZWxlY3Rpb25JbmRleCIsInBhdGNoTG9vcCIsImdldEh1bmtzIiwiaW5jbHVkZXNNYXgiLCJjaGFuZ2UiLCJnZXRDaGFuZ2VzIiwiaW50ZXJzZWN0aW9uIiwiZ2FwIiwiaW50ZXJzZWN0Um93cyIsImRlbHRhIiwic3RhcnQiLCJyb3ciLCJnZXRSb3dDb3VudCIsImdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgiLCJzZWxlY3Rpb25Sb3ciLCJyZW1haW5pbmdDaGFuZ2VkTGluZXMiLCJmb3VuZFJvdyIsImxhc3RDaGFuZ2VkUm93IiwiYnVmZmVyUm93Q291bnQiLCJnZXRTdGFydEJ1ZmZlclJvdyIsImdldEVuZEJ1ZmZlclJvdyIsIlJhbmdlIiwiZnJvbU9iamVjdCIsIkluZmluaXR5IiwiaXNEaWZmUm93T2Zmc2V0SW5kZXhFbXB0eSIsImRpZmZSb3dPZmZzZXRJbmRleCIsIlJCVHJlZSIsImEiLCJiIiwiZ2V0U3RhcnRSYW5nZSIsImh1bmtJbmRleCIsImxlbmd0aCIsImluc2VydCIsImFkb3B0QnVmZmVyIiwiY2xlYXJBbGxMYXllcnMiLCJjbGVhciIsIm1hcmtlck1hcCIsImFkb3B0IiwidXBkYXRlTWFya2VycyIsInJvd1NldCIsInNvcnRlZFJvd1NldCIsInNvcnQiLCJsYXN0RmlsZVBhdGNoIiwiY29udGFpbnNSb3ciLCJwdXNoIiwiYW55UHJlc2VudCIsInNvbWUiLCJkaWRBbnlDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsImRpZENoYW5nZUV4ZWN1dGFibGVNb2RlIiwiYW55SGF2ZVR5cGVjaGFuZ2UiLCJoYXNUeXBlY2hhbmdlIiwiZ2V0TWF4TGluZU51bWJlcldpZHRoIiwibWF4V2lkdGgiLCJ3aWR0aCIsInNwYW5zTXVsdGlwbGVGaWxlcyIsInJvd3MiLCJjb2xsYXBzZUZpbGVQYXRjaCIsImluZGV4T2YiLCJkZWxldGUiLCJiZWZvcmUiLCJnZXRNYXJrZXJzQmVmb3JlIiwiYWZ0ZXIiLCJnZXRNYXJrZXJzQWZ0ZXIiLCJ0cmlnZ2VyQ29sbGFwc2VJbiIsImV4cGFuZEZpbGVQYXRjaCIsInRyaWdnZXJFeHBhbmRJbiIsImZpbGVQYXRjaEluZGV4IiwiYmVmb3JlSW5kZXgiLCJiZWZvcmVGaWxlUGF0Y2giLCJnZXRFbmRpbmdNYXJrZXJzIiwiZ2V0UmFuZ2UiLCJpc0VtcHR5IiwiYWZ0ZXJJbmRleCIsImFmdGVyRmlsZVBhdGNoIiwiZ2V0U3RhcnRpbmdNYXJrZXJzIiwiZ2V0UHJldmlld1BhdGNoQnVmZmVyIiwibWF4Um93Q291bnQiLCJnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24iLCJwcmV2aWV3U3RhcnRSb3ciLCJwcmV2aWV3RW5kUm93IiwiZXhjbHVkZSIsImNyZWF0ZVN1YkJ1ZmZlciIsInRvU3RyaW5nIiwidG9TdHJpbmdJbiIsImpvaW4iLCJpbnNwZWN0IiwiaW5zcGVjdFN0cmluZyIsIm0iLCJpZCIsImluZGVudCIsImlzRXF1YWwiLCJvdGhlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxjQUFOLENBQXFCO0FBQ2pCLFNBQVZDLFVBQVUsR0FBRztBQUNsQixXQUFPLElBQUksSUFBSixDQUFTO0FBQUNDLE1BQUFBLFdBQVcsRUFBRSxJQUFJQyxvQkFB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UUFBSUMsYUFBYSxHQUFHLGlCQUFwQjtBQUNBQSxJQUFBQSxhQUFhLElBQUsseUJBQXdCMUosS0FBSyxDQUFDQyxJQUFOLENBQVcsS0FBS1EsbUJBQUwsQ0FBeUJQLElBQXpCLEVBQVgsRUFBNEN5SixDQUFDLElBQUlBLENBQUMsQ0FBQ0MsRUFBbkQsRUFBdURKLElBQXZELENBQTRELElBQTVELENBQWtFLEdBQTVHO0FBQ0FFLElBQUFBLGFBQWEsSUFBSyxtQkFBa0IxSixLQUFLLENBQUNDLElBQU4sQ0FBVyxLQUFLVSxhQUFMLENBQW1CVCxJQUFuQixFQUFYLEVBQXNDeUosQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEVBQTdDLEVBQWlESixJQUFqRCxDQUFzRCxJQUF0RCxDQUE0RCxLQUFoRzs7QUFDQSxTQUFLLE1BQU01SSxTQUFYLElBQXdCLEtBQUszQixXQUE3QixFQUEwQztBQUN4Q3lLLE1BQUFBLGFBQWEsSUFBSTlJLFNBQVMsQ0FBQzZJLE9BQVYsQ0FBa0I7QUFBQ0ksUUFBQUEsTUFBTSxFQUFFO0FBQVQsT0FBbEIsQ0FBakI7QUFDRDs7QUFDREgsSUFBQUEsYUFBYSxJQUFJLEtBQWpCO0FBQ0EsV0FBT0EsYUFBUDtBQUNEO0FBRUQ7OztBQUNBSSxFQUFBQSxPQUFPLENBQUNDLEtBQUQsRUFBUTtBQUNiLFdBQU8sS0FBS1QsUUFBTCxPQUFvQlMsS0FBSyxDQUFDVCxRQUFOLEVBQTNCO0FBQ0Q7O0FBNWNpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmFuZ2V9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtSQlRyZWV9IGZyb20gJ2JpbnRyZWVzJztcblxuaW1wb3J0IFBhdGNoQnVmZmVyIGZyb20gJy4vcGF0Y2gtYnVmZmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlGaWxlUGF0Y2gge1xuICBzdGF0aWMgY3JlYXRlTnVsbCgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMoe3BhdGNoQnVmZmVyOiBuZXcgUGF0Y2hCdWZmZXIoKSwgZmlsZVBhdGNoZXM6IFtdfSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7cGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzfSkge1xuICAgIHRoaXMucGF0Y2hCdWZmZXIgPSBwYXRjaEJ1ZmZlcjtcbiAgICB0aGlzLmZpbGVQYXRjaGVzID0gZmlsZVBhdGNoZXM7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5maWxlUGF0Y2hlc0J5UGF0aCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmh1bmtzQnlNYXJrZXIgPSBuZXcgTWFwKCk7XG5cbiAgICAvLyBTdG9yZSBhIG1hcCBvZiB7ZGlmZlJvdywgb2Zmc2V0fSBmb3IgZWFjaCBGaWxlUGF0Y2ggd2hlcmUgb2Zmc2V0IGlzIHRoZSBudW1iZXIgb2YgSHVuayBoZWFkZXJzIHdpdGhpbiB0aGUgY3VycmVudFxuICAgIC8vIEZpbGVQYXRjaCB0aGF0IG9jY3VyIGJlZm9yZSB0aGlzIHJvdyBpbiB0aGUgb3JpZ2luYWwgZGlmZiBvdXRwdXQuXG4gICAgdGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcyA9IG5ldyBNYXAoKTtcblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZmlsZVBhdGNoZXMpIHtcbiAgICAgIHRoaXMuZmlsZVBhdGNoZXNCeVBhdGguc2V0KGZpbGVQYXRjaC5nZXRQYXRoKCksIGZpbGVQYXRjaCk7XG4gICAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuc2V0KGZpbGVQYXRjaC5nZXRNYXJrZXIoKSwgZmlsZVBhdGNoKTtcblxuICAgICAgdGhpcy5wb3B1bGF0ZURpZmZSb3dPZmZzZXRJbmRpY2VzKGZpbGVQYXRjaCk7XG4gICAgfVxuICB9XG5cbiAgY2xvbmUob3B0cyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHtcbiAgICAgIHBhdGNoQnVmZmVyOiBvcHRzLnBhdGNoQnVmZmVyICE9PSB1bmRlZmluZWQgPyBvcHRzLnBhdGNoQnVmZmVyIDogdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLFxuICAgICAgZmlsZVBhdGNoZXM6IG9wdHMuZmlsZVBhdGNoZXMgIT09IHVuZGVmaW5lZCA/IG9wdHMuZmlsZVBhdGNoZXMgOiB0aGlzLmdldEZpbGVQYXRjaGVzKCksXG4gICAgfSk7XG4gIH1cblxuICBnZXRQYXRjaEJ1ZmZlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRjaEJ1ZmZlcjtcbiAgfVxuXG4gIGdldEJ1ZmZlcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldEJ1ZmZlcigpO1xuICB9XG5cbiAgZ2V0UGF0Y2hMYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdwYXRjaCcpO1xuICB9XG5cbiAgZ2V0SHVua0xheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ2h1bmsnKTtcbiAgfVxuXG4gIGdldFVuY2hhbmdlZExheWVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoQnVmZmVyKCkuZ2V0TGF5ZXIoJ3VuY2hhbmdlZCcpO1xuICB9XG5cbiAgZ2V0QWRkaXRpb25MYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdhZGRpdGlvbicpO1xuICB9XG5cbiAgZ2V0RGVsZXRpb25MYXllcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaEJ1ZmZlcigpLmdldExheWVyKCdkZWxldGlvbicpO1xuICB9XG5cbiAgZ2V0Tm9OZXdsaW5lTGF5ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2hCdWZmZXIoKS5nZXRMYXllcignbm9uZXdsaW5lJyk7XG4gIH1cblxuICBnZXRGaWxlUGF0Y2hlcygpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0Y2hlcztcbiAgfVxuXG4gIGdldFBhdGNoRm9yUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXNCeVBhdGguZ2V0KHBhdGgpO1xuICB9XG5cbiAgZ2V0UGF0aFNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0Y2hlcygpLnJlZHVjZSgocGF0aFNldCwgZmlsZVBhdGNoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgW2ZpbGVQYXRjaC5nZXRPbGRGaWxlKCksIGZpbGVQYXRjaC5nZXROZXdGaWxlKCldKSB7XG4gICAgICAgIGlmIChmaWxlLmlzUHJlc2VudCgpKSB7XG4gICAgICAgICAgcGF0aFNldC5hZGQoZmlsZS5nZXRQYXRoKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGF0aFNldDtcbiAgICB9LCBuZXcgU2V0KCkpO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGNoQXQoYnVmZmVyUm93KSB7XG4gICAgaWYgKGJ1ZmZlclJvdyA8IDAgfHwgYnVmZmVyUm93ID4gdGhpcy5wYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRMYXN0Um93KCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IFttYXJrZXJdID0gdGhpcy5wYXRjaEJ1ZmZlci5maW5kTWFya2VycygncGF0Y2gnLCB7aW50ZXJzZWN0c1JvdzogYnVmZmVyUm93fSk7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5nZXQobWFya2VyKTtcbiAgfVxuXG4gIGdldEh1bmtBdChidWZmZXJSb3cpIHtcbiAgICBpZiAoYnVmZmVyUm93IDwgMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgW21hcmtlcl0gPSB0aGlzLnBhdGNoQnVmZmVyLmZpbmRNYXJrZXJzKCdodW5rJywge2ludGVyc2VjdHNSb3c6IGJ1ZmZlclJvd30pO1xuICAgIHJldHVybiB0aGlzLmh1bmtzQnlNYXJrZXIuZ2V0KG1hcmtlcik7XG4gIH1cblxuICBnZXRTdGFnZVBhdGNoRm9yTGluZXMoc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgY29uc3QgbmV4dFBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgY29uc3QgbmV4dEZpbGVQYXRjaGVzID0gdGhpcy5nZXRGaWxlUGF0Y2hlc0NvbnRhaW5pbmcoc2VsZWN0ZWRMaW5lU2V0KS5tYXAoZnAgPT4ge1xuICAgICAgcmV0dXJuIGZwLmJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzKHRoaXMuZ2V0QnVmZmVyKCksIG5leHRQYXRjaEJ1ZmZlciwgc2VsZWN0ZWRMaW5lU2V0KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7cGF0Y2hCdWZmZXI6IG5leHRQYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXM6IG5leHRGaWxlUGF0Y2hlc30pO1xuICB9XG5cbiAgZ2V0U3RhZ2VQYXRjaEZvckh1bmsoaHVuaykge1xuICAgIHJldHVybiB0aGlzLmdldFN0YWdlUGF0Y2hGb3JMaW5lcyhuZXcgU2V0KGh1bmsuZ2V0QnVmZmVyUm93cygpKSk7XG4gIH1cblxuICBnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhzZWxlY3RlZExpbmVTZXQpIHtcbiAgICBjb25zdCBuZXh0UGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICBjb25zdCBuZXh0RmlsZVBhdGNoZXMgPSB0aGlzLmdldEZpbGVQYXRjaGVzQ29udGFpbmluZyhzZWxlY3RlZExpbmVTZXQpLm1hcChmcCA9PiB7XG4gICAgICByZXR1cm4gZnAuYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyh0aGlzLmdldEJ1ZmZlcigpLCBuZXh0UGF0Y2hCdWZmZXIsIHNlbGVjdGVkTGluZVNldCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe3BhdGNoQnVmZmVyOiBuZXh0UGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzOiBuZXh0RmlsZVBhdGNoZXN9KTtcbiAgfVxuXG4gIGdldFVuc3RhZ2VQYXRjaEZvckh1bmsoaHVuaykge1xuICAgIHJldHVybiB0aGlzLmdldFVuc3RhZ2VQYXRjaEZvckxpbmVzKG5ldyBTZXQoaHVuay5nZXRCdWZmZXJSb3dzKCkpKTtcbiAgfVxuXG4gIGdldE1heFNlbGVjdGlvbkluZGV4KHNlbGVjdGVkUm93cykge1xuICAgIGlmIChzZWxlY3RlZFJvd3Muc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdE1heCA9IE1hdGgubWF4KC4uLnNlbGVjdGVkUm93cyk7XG5cbiAgICBsZXQgc2VsZWN0aW9uSW5kZXggPSAwO1xuICAgIC8vIGNvdW50cyB1bnNlbGVjdGVkIGxpbmVzIGluIGNoYW5nZWQgcmVnaW9ucyBmcm9tIHRoZSBvbGQgcGF0Y2hcbiAgICAvLyB1bnRpbCB3ZSBnZXQgdG8gdGhlIGJvdHRvbS1tb3N0IHNlbGVjdGVkIGxpbmUgZnJvbSB0aGUgb2xkIHBhdGNoIChsYXN0TWF4KS5cbiAgICBwYXRjaExvb3A6IGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICAgIGxldCBpbmNsdWRlc01heCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGh1bmsuZ2V0Q2hhbmdlcygpKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB7aW50ZXJzZWN0aW9uLCBnYXB9IG9mIGNoYW5nZS5pbnRlcnNlY3RSb3dzKHNlbGVjdGVkUm93cywgdHJ1ZSkpIHtcbiAgICAgICAgICAgIC8vIE9ubHkgaW5jbHVkZSBhIHBhcnRpYWwgcmFuZ2UgaWYgdGhpcyBpbnRlcnNlY3Rpb24gaW5jbHVkZXMgdGhlIGxhc3Qgc2VsZWN0ZWQgYnVmZmVyIHJvdy5cbiAgICAgICAgICAgIGluY2x1ZGVzTWF4ID0gaW50ZXJzZWN0aW9uLmludGVyc2VjdHNSb3cobGFzdE1heCk7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGluY2x1ZGVzTWF4ID8gbGFzdE1heCAtIGludGVyc2VjdGlvbi5zdGFydC5yb3cgKyAxIDogaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG5cbiAgICAgICAgICAgIGlmIChnYXApIHtcbiAgICAgICAgICAgICAgLy8gUmFuZ2Ugb2YgdW5zZWxlY3RlZCBjaGFuZ2VzLlxuICAgICAgICAgICAgICBzZWxlY3Rpb25JbmRleCArPSBkZWx0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVzTWF4KSB7XG4gICAgICAgICAgICAgIGJyZWFrIHBhdGNoTG9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0aW9uSW5kZXg7XG4gIH1cblxuICBnZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4KHNlbGVjdGlvbkluZGV4KSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGNoYW5nZWQgbGluZXMgaW4gdGhpcyBwYXRjaCBpbiBvcmRlciB0byBmaW5kIHRoZVxuICAgIC8vIG5ldyByb3cgdG8gYmUgc2VsZWN0ZWQgYmFzZWQgb24gdGhlIGxhc3Qgc2VsZWN0aW9uIGluZGV4LlxuICAgIC8vIEFzIHdlIHdhbGsgdGhyb3VnaCB0aGUgY2hhbmdlZCBsaW5lcywgd2Ugd2hpdHRsZSBkb3duIHRoZVxuICAgIC8vIHJlbWFpbmluZyBsaW5lcyB1bnRpbCB3ZSByZWFjaCB0aGUgcm93IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlXG4gICAgLy8gbGFzdCBzZWxlY3RlZCBpbmRleC5cblxuICAgIGxldCBzZWxlY3Rpb25Sb3cgPSAwO1xuICAgIGxldCByZW1haW5pbmdDaGFuZ2VkTGluZXMgPSBzZWxlY3Rpb25JbmRleDtcblxuICAgIGxldCBmb3VuZFJvdyA9IGZhbHNlO1xuICAgIGxldCBsYXN0Q2hhbmdlZFJvdyA9IDA7XG5cbiAgICBwYXRjaExvb3A6IGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZ2V0RmlsZVBhdGNoZXMoKSkge1xuICAgICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGh1bmsuZ2V0Q2hhbmdlcygpKSB7XG4gICAgICAgICAgaWYgKHJlbWFpbmluZ0NoYW5nZWRMaW5lcyA8IGNoYW5nZS5idWZmZXJSb3dDb3VudCgpKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25Sb3cgPSBjaGFuZ2UuZ2V0U3RhcnRCdWZmZXJSb3coKSArIHJlbWFpbmluZ0NoYW5nZWRMaW5lcztcbiAgICAgICAgICAgIGZvdW5kUm93ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrIHBhdGNoTG9vcDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVtYWluaW5nQ2hhbmdlZExpbmVzIC09IGNoYW5nZS5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgICAgICAgbGFzdENoYW5nZWRSb3cgPSBjaGFuZ2UuZ2V0RW5kQnVmZmVyUm93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgbmV2ZXIgZ290IHRvIHRoZSBsYXN0IHNlbGVjdGVkIGluZGV4LCB0aGF0IG1lYW5zIGl0IGlzXG4gICAgLy8gbm8gbG9uZ2VyIHByZXNlbnQgaW4gdGhlIG5ldyBwYXRjaCAoaWUuIHdlIHN0YWdlZCB0aGUgbGFzdCBsaW5lIG9mIHRoZSBmaWxlKS5cbiAgICAvLyBJbiB0aGlzIGNhc2Ugd2Ugd2FudCB0aGUgbmV4dCBzZWxlY3RlZCBsaW5lIHRvIGJlIHRoZSBsYXN0IGNoYW5nZWQgcm93IGluIHRoZSBmaWxlXG4gICAgaWYgKCFmb3VuZFJvdykge1xuICAgICAgc2VsZWN0aW9uUm93ID0gbGFzdENoYW5nZWRSb3c7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1tzZWxlY3Rpb25Sb3csIDBdLCBbc2VsZWN0aW9uUm93LCBJbmZpbml0eV1dKTtcbiAgfVxuXG4gIGlzRGlmZlJvd09mZnNldEluZGV4RW1wdHkoZmlsZVBhdGNoUGF0aCkge1xuICAgIGNvbnN0IGRpZmZSb3dPZmZzZXRJbmRleCA9IHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMuZ2V0KGZpbGVQYXRjaFBhdGgpO1xuICAgIHJldHVybiBkaWZmUm93T2Zmc2V0SW5kZXguaW5kZXguc2l6ZSA9PT0gMDtcbiAgfVxuXG4gIHBvcHVsYXRlRGlmZlJvd09mZnNldEluZGljZXMoZmlsZVBhdGNoKSB7XG4gICAgbGV0IGRpZmZSb3cgPSAxO1xuICAgIGNvbnN0IGluZGV4ID0gbmV3IFJCVHJlZSgoYSwgYikgPT4gYS5kaWZmUm93IC0gYi5kaWZmUm93KTtcbiAgICB0aGlzLmRpZmZSb3dPZmZzZXRJbmRpY2VzLnNldChmaWxlUGF0Y2guZ2V0UGF0aCgpLCB7c3RhcnRCdWZmZXJSb3c6IGZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCkuc3RhcnQucm93LCBpbmRleH0pO1xuXG4gICAgZm9yIChsZXQgaHVua0luZGV4ID0gMDsgaHVua0luZGV4IDwgZmlsZVBhdGNoLmdldEh1bmtzKCkubGVuZ3RoOyBodW5rSW5kZXgrKykge1xuICAgICAgY29uc3QgaHVuayA9IGZpbGVQYXRjaC5nZXRIdW5rcygpW2h1bmtJbmRleF07XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuc2V0KGh1bmsuZ2V0TWFya2VyKCksIGh1bmspO1xuXG4gICAgICAvLyBBZHZhbmNlIHBhc3QgdGhlIGh1bmsgYm9keVxuICAgICAgZGlmZlJvdyArPSBodW5rLmJ1ZmZlclJvd0NvdW50KCk7XG4gICAgICBpbmRleC5pbnNlcnQoe2RpZmZSb3csIG9mZnNldDogaHVua0luZGV4ICsgMX0pO1xuXG4gICAgICAvLyBBZHZhbmNlIHBhc3QgdGhlIG5leHQgaHVuayBoZWFkZXJcbiAgICAgIGRpZmZSb3crKztcbiAgICB9XG4gIH1cblxuICBhZG9wdEJ1ZmZlcihuZXh0UGF0Y2hCdWZmZXIpIHtcbiAgICBuZXh0UGF0Y2hCdWZmZXIuY2xlYXJBbGxMYXllcnMoKTtcblxuICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5jbGVhcigpO1xuICAgIHRoaXMuaHVua3NCeU1hcmtlci5jbGVhcigpO1xuXG4gICAgY29uc3QgbWFya2VyTWFwID0gbmV4dFBhdGNoQnVmZmVyLmFkb3B0KHRoaXMucGF0Y2hCdWZmZXIpO1xuXG4gICAgZm9yIChjb25zdCBmaWxlUGF0Y2ggb2YgdGhpcy5nZXRGaWxlUGF0Y2hlcygpKSB7XG4gICAgICBmaWxlUGF0Y2gudXBkYXRlTWFya2VycyhtYXJrZXJNYXApO1xuICAgICAgdGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLnNldChmaWxlUGF0Y2guZ2V0TWFya2VyKCksIGZpbGVQYXRjaCk7XG5cbiAgICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuc2V0KGh1bmsuZ2V0TWFya2VyKCksIGh1bmspO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucGF0Y2hCdWZmZXIgPSBuZXh0UGF0Y2hCdWZmZXI7XG4gIH1cblxuICAvKlxuICAgKiBFZmZpY2llbnRseSBsb2NhdGUgdGhlIEZpbGVQYXRjaCBpbnN0YW5jZXMgdGhhdCBjb250YWluIGF0IGxlYXN0IG9uZSByb3cgZnJvbSBhIFNldC5cbiAgICovXG4gIGdldEZpbGVQYXRjaGVzQ29udGFpbmluZyhyb3dTZXQpIHtcbiAgICBjb25zdCBzb3J0ZWRSb3dTZXQgPSBBcnJheS5mcm9tKHJvd1NldCk7XG4gICAgc29ydGVkUm93U2V0LnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgIGNvbnN0IGZpbGVQYXRjaGVzID0gW107XG4gICAgbGV0IGxhc3RGaWxlUGF0Y2ggPSBudWxsO1xuICAgIGZvciAoY29uc3Qgcm93IG9mIHNvcnRlZFJvd1NldCkge1xuICAgICAgLy8gQmVjYXVzZSB0aGUgcm93cyBhcmUgc29ydGVkLCBjb25zZWN1dGl2ZSByb3dzIHdpbGwgYWxtb3N0IGNlcnRhaW5seSBiZWxvbmcgdG8gdGhlIHNhbWUgcGF0Y2gsIHNvIHdlIGNhbiBzYXZlXG4gICAgICAvLyBtYW55IGF2b2lkYWJsZSBtYXJrZXIgaW5kZXggbG9va3VwcyBieSBjb21wYXJpbmcgd2l0aCB0aGUgbGFzdC5cbiAgICAgIGlmIChsYXN0RmlsZVBhdGNoICYmIGxhc3RGaWxlUGF0Y2guY29udGFpbnNSb3cocm93KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGFzdEZpbGVQYXRjaCA9IHRoaXMuZ2V0RmlsZVBhdGNoQXQocm93KTtcbiAgICAgIGZpbGVQYXRjaGVzLnB1c2gobGFzdEZpbGVQYXRjaCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVQYXRjaGVzO1xuICB9XG5cbiAgYW55UHJlc2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRjaEJ1ZmZlciAhPT0gbnVsbCAmJiB0aGlzLmZpbGVQYXRjaGVzLnNvbWUoZnAgPT4gZnAuaXNQcmVzZW50KCkpO1xuICB9XG5cbiAgZGlkQW55Q2hhbmdlRXhlY3V0YWJsZU1vZGUoKSB7XG4gICAgZm9yIChjb25zdCBmaWxlUGF0Y2ggb2YgdGhpcy5nZXRGaWxlUGF0Y2hlcygpKSB7XG4gICAgICBpZiAoZmlsZVBhdGNoLmRpZENoYW5nZUV4ZWN1dGFibGVNb2RlKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFueUhhdmVUeXBlY2hhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZpbGVQYXRjaGVzKCkuc29tZShmcCA9PiBmcC5oYXNUeXBlY2hhbmdlKCkpO1xuICB9XG5cbiAgZ2V0TWF4TGluZU51bWJlcldpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZpbGVQYXRjaGVzKCkucmVkdWNlKChtYXhXaWR0aCwgZmlsZVBhdGNoKSA9PiB7XG4gICAgICBjb25zdCB3aWR0aCA9IGZpbGVQYXRjaC5nZXRNYXhMaW5lTnVtYmVyV2lkdGgoKTtcbiAgICAgIHJldHVybiBtYXhXaWR0aCA+PSB3aWR0aCA/IG1heFdpZHRoIDogd2lkdGg7XG4gICAgfSwgMCk7XG4gIH1cblxuICBzcGFuc011bHRpcGxlRmlsZXMocm93cykge1xuICAgIGxldCBsYXN0RmlsZVBhdGNoID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICBpZiAobGFzdEZpbGVQYXRjaCkge1xuICAgICAgICBpZiAobGFzdEZpbGVQYXRjaC5jb250YWluc1Jvdyhyb3cpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhc3RGaWxlUGF0Y2ggPSB0aGlzLmdldEZpbGVQYXRjaEF0KHJvdyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbGxhcHNlRmlsZVBhdGNoKGZpbGVQYXRjaCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maWxlUGF0Y2hlcy5pbmRleE9mKGZpbGVQYXRjaCk7XG5cbiAgICB0aGlzLmZpbGVQYXRjaGVzQnlNYXJrZXIuZGVsZXRlKGZpbGVQYXRjaC5nZXRNYXJrZXIoKSk7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIGZpbGVQYXRjaC5nZXRIdW5rcygpKSB7XG4gICAgICB0aGlzLmh1bmtzQnlNYXJrZXIuZGVsZXRlKGh1bmsuZ2V0TWFya2VyKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMuZ2V0TWFya2Vyc0JlZm9yZShpbmRleCk7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLmdldE1hcmtlcnNBZnRlcihpbmRleCk7XG5cbiAgICBmaWxlUGF0Y2gudHJpZ2dlckNvbGxhcHNlSW4odGhpcy5wYXRjaEJ1ZmZlciwge2JlZm9yZSwgYWZ0ZXJ9KTtcblxuICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5zZXQoZmlsZVBhdGNoLmdldE1hcmtlcigpLCBmaWxlUGF0Y2gpO1xuXG4gICAgLy8gVGhpcyBodW5rIGNvbGxlY3Rpb24gc2hvdWxkIGJlIGVtcHR5LCBidXQgbGV0J3MgaXRlcmF0ZSBhbnl3YXkganVzdCBpbiBjYXNlIGZpbGVQYXRjaCB3YXMgYWxyZWFkeSBjb2xsYXBzZWRcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcbiAgICB9XG4gIH1cblxuICBleHBhbmRGaWxlUGF0Y2goZmlsZVBhdGNoKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbGVQYXRjaGVzLmluZGV4T2YoZmlsZVBhdGNoKTtcblxuICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5kZWxldGUoZmlsZVBhdGNoLmdldE1hcmtlcigpKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgZmlsZVBhdGNoLmdldEh1bmtzKCkpIHtcbiAgICAgIHRoaXMuaHVua3NCeU1hcmtlci5kZWxldGUoaHVuay5nZXRNYXJrZXIoKSk7XG4gICAgfVxuXG4gICAgY29uc3QgYmVmb3JlID0gdGhpcy5nZXRNYXJrZXJzQmVmb3JlKGluZGV4KTtcbiAgICBjb25zdCBhZnRlciA9IHRoaXMuZ2V0TWFya2Vyc0FmdGVyKGluZGV4KTtcblxuICAgIGZpbGVQYXRjaC50cmlnZ2VyRXhwYW5kSW4odGhpcy5wYXRjaEJ1ZmZlciwge2JlZm9yZSwgYWZ0ZXJ9KTtcblxuICAgIHRoaXMuZmlsZVBhdGNoZXNCeU1hcmtlci5zZXQoZmlsZVBhdGNoLmdldE1hcmtlcigpLCBmaWxlUGF0Y2gpO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiBmaWxlUGF0Y2guZ2V0SHVua3MoKSkge1xuICAgICAgdGhpcy5odW5rc0J5TWFya2VyLnNldChodW5rLmdldE1hcmtlcigpLCBodW5rKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgcGF0Y2ggd2FzIGluaXRpYWxseSBjb2xsYXBzZWQsIHdlIG5lZWQgdG8gY2FsY3VsYXRlXG4gICAgLy8gdGhlIGRpZmZSb3dPZmZzZXRJbmRpY2VzIHRvIGNhbGN1bGF0ZSBjb21tZW50IHBvc2l0aW9uLlxuICAgIGlmICh0aGlzLmlzRGlmZlJvd09mZnNldEluZGV4RW1wdHkoZmlsZVBhdGNoLmdldFBhdGgoKSkpIHtcbiAgICAgIHRoaXMucG9wdWxhdGVEaWZmUm93T2Zmc2V0SW5kaWNlcyhmaWxlUGF0Y2gpO1xuICAgIH1cbiAgfVxuXG4gIGdldE1hcmtlcnNCZWZvcmUoZmlsZVBhdGNoSW5kZXgpIHtcbiAgICBjb25zdCBiZWZvcmUgPSBbXTtcbiAgICBsZXQgYmVmb3JlSW5kZXggPSBmaWxlUGF0Y2hJbmRleCAtIDE7XG4gICAgd2hpbGUgKGJlZm9yZUluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IGJlZm9yZUZpbGVQYXRjaCA9IHRoaXMuZmlsZVBhdGNoZXNbYmVmb3JlSW5kZXhdO1xuICAgICAgYmVmb3JlLnB1c2goLi4uYmVmb3JlRmlsZVBhdGNoLmdldEVuZGluZ01hcmtlcnMoKSk7XG5cbiAgICAgIGlmICghYmVmb3JlRmlsZVBhdGNoLmdldE1hcmtlcigpLmdldFJhbmdlKCkuaXNFbXB0eSgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYmVmb3JlSW5kZXgtLTtcbiAgICB9XG4gICAgcmV0dXJuIGJlZm9yZTtcbiAgfVxuXG4gIGdldE1hcmtlcnNBZnRlcihmaWxlUGF0Y2hJbmRleCkge1xuICAgIGNvbnN0IGFmdGVyID0gW107XG4gICAgbGV0IGFmdGVySW5kZXggPSBmaWxlUGF0Y2hJbmRleCArIDE7XG4gICAgd2hpbGUgKGFmdGVySW5kZXggPCB0aGlzLmZpbGVQYXRjaGVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgYWZ0ZXJGaWxlUGF0Y2ggPSB0aGlzLmZpbGVQYXRjaGVzW2FmdGVySW5kZXhdO1xuICAgICAgYWZ0ZXIucHVzaCguLi5hZnRlckZpbGVQYXRjaC5nZXRTdGFydGluZ01hcmtlcnMoKSk7XG5cbiAgICAgIGlmICghYWZ0ZXJGaWxlUGF0Y2guZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5pc0VtcHR5KCkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBhZnRlckluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBhZnRlcjtcbiAgfVxuXG4gIGlzUGF0Y2hWaXNpYmxlID0gZmlsZVBhdGNoUGF0aCA9PiB7XG4gICAgY29uc3QgcGF0Y2ggPSB0aGlzLmZpbGVQYXRjaGVzQnlQYXRoLmdldChmaWxlUGF0Y2hQYXRoKTtcbiAgICBpZiAoIXBhdGNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBwYXRjaC5nZXRSZW5kZXJTdGF0dXMoKS5pc1Zpc2libGUoKTtcbiAgfVxuXG4gIGdldEJ1ZmZlclJvd0ZvckRpZmZQb3NpdGlvbiA9IChmaWxlTmFtZSwgZGlmZlJvdykgPT4ge1xuICAgIGNvbnN0IG9mZnNldEluZGV4ID0gdGhpcy5kaWZmUm93T2Zmc2V0SW5kaWNlcy5nZXQoZmlsZU5hbWUpO1xuICAgIGlmICghb2Zmc2V0SW5kZXgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKCdBdHRlbXB0IHRvIGNvbXB1dGUgYnVmZmVyIHJvdyBmb3IgaW52YWxpZCBkaWZmIHBvc2l0aW9uOiBmaWxlIG5vdCBpbmNsdWRlZCcsIHtcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGRpZmZSb3csXG4gICAgICAgIHZhbGlkRmlsZU5hbWVzOiBBcnJheS5mcm9tKHRoaXMuZGlmZlJvd09mZnNldEluZGljZXMua2V5cygpKSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHtzdGFydEJ1ZmZlclJvdywgaW5kZXh9ID0gb2Zmc2V0SW5kZXg7XG5cbiAgICBjb25zdCByZXN1bHQgPSBpbmRleC5sb3dlckJvdW5kKHtkaWZmUm93fSkuZGF0YSgpO1xuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcignQXR0ZW1wdCB0byBjb21wdXRlIGJ1ZmZlciByb3cgZm9yIGludmFsaWQgZGlmZiBwb3NpdGlvbjogZGlmZiByb3cgb3V0IG9mIHJhbmdlJywge1xuICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgZGlmZlJvdyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHtvZmZzZXR9ID0gcmVzdWx0O1xuXG4gICAgcmV0dXJuIHN0YXJ0QnVmZmVyUm93ICsgZGlmZlJvdyAtIG9mZnNldDtcbiAgfVxuXG4gIGdldFByZXZpZXdQYXRjaEJ1ZmZlcihmaWxlTmFtZSwgZGlmZlJvdywgbWF4Um93Q291bnQpIHtcbiAgICBjb25zdCBidWZmZXJSb3cgPSB0aGlzLmdldEJ1ZmZlclJvd0ZvckRpZmZQb3NpdGlvbihmaWxlTmFtZSwgZGlmZlJvdyk7XG4gICAgaWYgKGJ1ZmZlclJvdyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRjaCA9IHRoaXMuZ2V0RmlsZVBhdGNoQXQoYnVmZmVyUm93KTtcbiAgICBjb25zdCBmaWxlUGF0Y2hJbmRleCA9IHRoaXMuZmlsZVBhdGNoZXMuaW5kZXhPZihmaWxlUGF0Y2gpO1xuICAgIGNvbnN0IGh1bmsgPSB0aGlzLmdldEh1bmtBdChidWZmZXJSb3cpO1xuXG4gICAgY29uc3QgcHJldmlld1N0YXJ0Um93ID0gTWF0aC5tYXgoYnVmZmVyUm93IC0gbWF4Um93Q291bnQgKyAxLCBodW5rLmdldFJhbmdlKCkuc3RhcnQucm93KTtcbiAgICBjb25zdCBwcmV2aWV3RW5kUm93ID0gYnVmZmVyUm93O1xuXG4gICAgY29uc3QgYmVmb3JlID0gdGhpcy5nZXRNYXJrZXJzQmVmb3JlKGZpbGVQYXRjaEluZGV4KTtcbiAgICBjb25zdCBhZnRlciA9IHRoaXMuZ2V0TWFya2Vyc0FmdGVyKGZpbGVQYXRjaEluZGV4KTtcbiAgICBjb25zdCBleGNsdWRlID0gbmV3IFNldChbLi4uYmVmb3JlLCAuLi5hZnRlcl0pO1xuXG4gICAgcmV0dXJuIHRoaXMucGF0Y2hCdWZmZXIuY3JlYXRlU3ViQnVmZmVyKFtbcHJldmlld1N0YXJ0Um93LCAwXSwgW3ByZXZpZXdFbmRSb3csIEluZmluaXR5XV0sIHtleGNsdWRlfSkucGF0Y2hCdWZmZXI7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYW4gYXBwbHktYWJsZSBwYXRjaCBTdHJpbmcuXG4gICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0Y2hlcy5tYXAoZnAgPT4gZnAudG9TdHJpbmdJbih0aGlzLmdldEJ1ZmZlcigpKSkuam9pbignJykgKyAnXFxuJztcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIHN0cmluZyBvZiBkaWFnbm9zdGljIGluZm9ybWF0aW9uIHVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdCgpIHtcbiAgICBsZXQgaW5zcGVjdFN0cmluZyA9ICcoTXVsdGlGaWxlUGF0Y2gnO1xuICAgIGluc3BlY3RTdHJpbmcgKz0gYCBmaWxlUGF0Y2hlc0J5TWFya2VyPSgke0FycmF5LmZyb20odGhpcy5maWxlUGF0Y2hlc0J5TWFya2VyLmtleXMoKSwgbSA9PiBtLmlkKS5qb2luKCcsICcpfSlgO1xuICAgIGluc3BlY3RTdHJpbmcgKz0gYCBodW5rc0J5TWFya2VyPSgke0FycmF5LmZyb20odGhpcy5odW5rc0J5TWFya2VyLmtleXMoKSwgbSA9PiBtLmlkKS5qb2luKCcsICcpfSlcXG5gO1xuICAgIGZvciAoY29uc3QgZmlsZVBhdGNoIG9mIHRoaXMuZmlsZVBhdGNoZXMpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gZmlsZVBhdGNoLmluc3BlY3Qoe2luZGVudDogMn0pO1xuICAgIH1cbiAgICBpbnNwZWN0U3RyaW5nICs9ICcpXFxuJztcbiAgICByZXR1cm4gaW5zcGVjdFN0cmluZztcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlzRXF1YWwob3RoZXIpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpID09PSBvdGhlci50b1N0cmluZygpO1xuICB9XG59XG4iXX0=