"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REMOVED = exports.DEFERRED = exports.COLLAPSED = exports.EXPANDED = void 0;
var _atom = require("atom");
var _hunk = _interopRequireDefault(require("./hunk"));
var _region = require("./region");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const EXPANDED = {
  /* istanbul ignore next */
  toString() {
    return 'RenderStatus(expanded)';
  },
  isVisible() {
    return true;
  },
  isExpandable() {
    return false;
  }
};
exports.EXPANDED = EXPANDED;
const COLLAPSED = {
  /* istanbul ignore next */
  toString() {
    return 'RenderStatus(collapsed)';
  },
  isVisible() {
    return false;
  },
  isExpandable() {
    return true;
  }
};
exports.COLLAPSED = COLLAPSED;
const DEFERRED = {
  /* istanbul ignore next */
  toString() {
    return 'RenderStatus(deferred)';
  },
  isVisible() {
    return false;
  },
  isExpandable() {
    return true;
  }
};
exports.DEFERRED = DEFERRED;
const REMOVED = {
  /* istanbul ignore next */
  toString() {
    return 'RenderStatus(removed)';
  },
  isVisible() {
    return false;
  },
  isExpandable() {
    return false;
  }
};
exports.REMOVED = REMOVED;
class Patch {
  static createNull() {
    return new NullPatch();
  }
  static createHiddenPatch(marker, renderStatus, showFn) {
    return new HiddenPatch(marker, renderStatus, showFn);
  }
  constructor({
    status,
    hunks,
    marker
  }) {
    this.status = status;
    this.hunks = hunks;
    this.marker = marker;
    this.changedLineCount = this.getHunks().reduce((acc, hunk) => acc + hunk.changedLineCount(), 0);
  }
  getStatus() {
    return this.status;
  }
  getMarker() {
    return this.marker;
  }
  getRange() {
    return this.getMarker().getRange();
  }
  getStartRange() {
    const startPoint = this.getMarker().getRange().start;
    return _atom.Range.fromObject([startPoint, startPoint]);
  }
  getHunks() {
    return this.hunks;
  }
  getChangedLineCount() {
    return this.changedLineCount;
  }
  containsRow(row) {
    return this.marker.getRange().intersectsRow(row);
  }
  destroyMarkers() {
    this.marker.destroy();
    for (const hunk of this.hunks) {
      hunk.destroyMarkers();
    }
  }
  updateMarkers(map) {
    this.marker = map.get(this.marker) || this.marker;
    for (const hunk of this.hunks) {
      hunk.updateMarkers(map);
    }
  }
  getMaxLineNumberWidth() {
    const lastHunk = this.hunks[this.hunks.length - 1];
    return lastHunk ? lastHunk.getMaxLineNumberWidth() : 0;
  }
  clone(opts = {}) {
    return new this.constructor({
      status: opts.status !== undefined ? opts.status : this.getStatus(),
      hunks: opts.hunks !== undefined ? opts.hunks : this.getHunks(),
      marker: opts.marker !== undefined ? opts.marker : this.getMarker()
    });
  }

  /* Return the set of Markers owned by this Patch that butt up against the patch's beginning. */
  getStartingMarkers() {
    const markers = [this.marker];
    if (this.hunks.length > 0) {
      const firstHunk = this.hunks[0];
      markers.push(firstHunk.getMarker());
      if (firstHunk.getRegions().length > 0) {
        const firstRegion = firstHunk.getRegions()[0];
        markers.push(firstRegion.getMarker());
      }
    }
    return markers;
  }

  /* Return the set of Markers owned by this Patch that end at the patch's end position. */
  getEndingMarkers() {
    const markers = [this.marker];
    if (this.hunks.length > 0) {
      const lastHunk = this.hunks[this.hunks.length - 1];
      markers.push(lastHunk.getMarker());
      if (lastHunk.getRegions().length > 0) {
        const lastRegion = lastHunk.getRegions()[lastHunk.getRegions().length - 1];
        markers.push(lastRegion.getMarker());
      }
    }
    return markers;
  }
  buildStagePatchForLines(originalBuffer, nextPatchBuffer, rowSet) {
    const originalBaseOffset = this.getMarker().getRange().start.row;
    const builder = new BufferBuilder(originalBuffer, originalBaseOffset, nextPatchBuffer);
    const hunks = [];
    let newRowDelta = 0;
    for (const hunk of this.getHunks()) {
      let atLeastOneSelectedChange = false;
      let selectedDeletionRowCount = 0;
      let noNewlineRowCount = 0;
      for (const region of hunk.getRegions()) {
        for (const {
          intersection,
          gap
        } of region.intersectRows(rowSet, true)) {
          region.when({
            addition: () => {
              if (gap) {
                // Unselected addition: omit from new buffer
                builder.remove(intersection);
              } else {
                // Selected addition: include in new patch
                atLeastOneSelectedChange = true;
                builder.append(intersection);
                builder.markRegion(intersection, _region.Addition);
              }
            },
            deletion: () => {
              if (gap) {
                // Unselected deletion: convert to context row
                builder.append(intersection);
                builder.markRegion(intersection, _region.Unchanged);
              } else {
                // Selected deletion: include in new patch
                atLeastOneSelectedChange = true;
                builder.append(intersection);
                builder.markRegion(intersection, _region.Deletion);
                selectedDeletionRowCount += intersection.getRowCount();
              }
            },
            unchanged: () => {
              // Untouched context line: include in new patch
              builder.append(intersection);
              builder.markRegion(intersection, _region.Unchanged);
            },
            nonewline: () => {
              builder.append(intersection);
              builder.markRegion(intersection, _region.NoNewline);
              noNewlineRowCount += intersection.getRowCount();
            }
          });
        }
      }
      if (atLeastOneSelectedChange) {
        // Hunk contains at least one selected line

        builder.markHunkRange(hunk.getRange());
        const {
          regions,
          marker
        } = builder.latestHunkWasIncluded();
        const newStartRow = hunk.getNewStartRow() + newRowDelta;
        const newRowCount = marker.getRange().getRowCount() - selectedDeletionRowCount - noNewlineRowCount;
        hunks.push(new _hunk.default({
          oldStartRow: hunk.getOldStartRow(),
          oldRowCount: hunk.getOldRowCount(),
          newStartRow,
          newRowCount,
          sectionHeading: hunk.getSectionHeading(),
          marker,
          regions
        }));
        newRowDelta += newRowCount - hunk.getNewRowCount();
      } else {
        newRowDelta += hunk.getOldRowCount() - hunk.getNewRowCount();
        builder.latestHunkWasDiscarded();
      }
    }
    const marker = nextPatchBuffer.markRange(this.constructor.layerName, [[0, 0], [nextPatchBuffer.getBuffer().getLastRow() - 1, Infinity]], {
      invalidate: 'never',
      exclusive: false
    });
    const wholeFile = rowSet.size === this.changedLineCount;
    const status = this.getStatus() === 'deleted' && !wholeFile ? 'modified' : this.getStatus();
    return this.clone({
      hunks,
      status,
      marker
    });
  }
  buildUnstagePatchForLines(originalBuffer, nextPatchBuffer, rowSet) {
    const originalBaseOffset = this.getMarker().getRange().start.row;
    const builder = new BufferBuilder(originalBuffer, originalBaseOffset, nextPatchBuffer);
    const hunks = [];
    let newRowDelta = 0;
    for (const hunk of this.getHunks()) {
      let atLeastOneSelectedChange = false;
      let contextRowCount = 0;
      let additionRowCount = 0;
      let deletionRowCount = 0;
      for (const region of hunk.getRegions()) {
        for (const {
          intersection,
          gap
        } of region.intersectRows(rowSet, true)) {
          region.when({
            addition: () => {
              if (gap) {
                // Unselected addition: become a context line.
                builder.append(intersection);
                builder.markRegion(intersection, _region.Unchanged);
                contextRowCount += intersection.getRowCount();
              } else {
                // Selected addition: become a deletion.
                atLeastOneSelectedChange = true;
                builder.append(intersection);
                builder.markRegion(intersection, _region.Deletion);
                deletionRowCount += intersection.getRowCount();
              }
            },
            deletion: () => {
              if (gap) {
                // Non-selected deletion: omit from new buffer.
                builder.remove(intersection);
              } else {
                // Selected deletion: becomes an addition
                atLeastOneSelectedChange = true;
                builder.append(intersection);
                builder.markRegion(intersection, _region.Addition);
                additionRowCount += intersection.getRowCount();
              }
            },
            unchanged: () => {
              // Untouched context line: include in new patch.
              builder.append(intersection);
              builder.markRegion(intersection, _region.Unchanged);
              contextRowCount += intersection.getRowCount();
            },
            nonewline: () => {
              // Nonewline marker: include in new patch.
              builder.append(intersection);
              builder.markRegion(intersection, _region.NoNewline);
            }
          });
        }
      }
      if (atLeastOneSelectedChange) {
        // Hunk contains at least one selected line

        builder.markHunkRange(hunk.getRange());
        const {
          marker,
          regions
        } = builder.latestHunkWasIncluded();
        hunks.push(new _hunk.default({
          oldStartRow: hunk.getNewStartRow(),
          oldRowCount: contextRowCount + deletionRowCount,
          newStartRow: hunk.getNewStartRow() + newRowDelta,
          newRowCount: contextRowCount + additionRowCount,
          sectionHeading: hunk.getSectionHeading(),
          marker,
          regions
        }));
      } else {
        builder.latestHunkWasDiscarded();
      }

      // (contextRowCount + additionRowCount) - (contextRowCount + deletionRowCount)
      newRowDelta += additionRowCount - deletionRowCount;
    }
    const wholeFile = rowSet.size === this.changedLineCount;
    let status = this.getStatus();
    if (this.getStatus() === 'added') {
      status = wholeFile ? 'deleted' : 'modified';
    } else if (this.getStatus() === 'deleted') {
      status = 'added';
    }
    const marker = nextPatchBuffer.markRange(this.constructor.layerName, [[0, 0], [nextPatchBuffer.getBuffer().getLastRow(), Infinity]], {
      invalidate: 'never',
      exclusive: false
    });
    return this.clone({
      hunks,
      status,
      marker
    });
  }
  getFirstChangeRange() {
    const firstHunk = this.getHunks()[0];
    if (!firstHunk) {
      return _atom.Range.fromObject([[0, 0], [0, 0]]);
    }
    const firstChange = firstHunk.getChanges()[0];
    if (!firstChange) {
      return _atom.Range.fromObject([[0, 0], [0, 0]]);
    }
    const firstRow = firstChange.getStartBufferRow();
    return _atom.Range.fromObject([[firstRow, 0], [firstRow, Infinity]]);
  }
  toStringIn(buffer) {
    return this.getHunks().reduce((str, hunk) => str + hunk.toStringIn(buffer), '');
  }

  /*
   * Construct a String containing internal diagnostic information.
   */
  /* istanbul ignore next */
  inspect(opts = {}) {
    const options = _objectSpread({
      indent: 0
    }, opts);
    let indentation = '';
    for (let i = 0; i < options.indent; i++) {
      indentation += ' ';
    }
    let inspectString = `${indentation}(Patch marker=${this.marker.id}`;
    if (this.marker.isDestroyed()) {
      inspectString += ' [destroyed]';
    }
    if (!this.marker.isValid()) {
      inspectString += ' [invalid]';
    }
    inspectString += '\n';
    for (const hunk of this.hunks) {
      inspectString += hunk.inspect({
        indent: options.indent + 2
      });
    }
    inspectString += `${indentation})\n`;
    return inspectString;
  }
  isPresent() {
    return true;
  }
  getRenderStatus() {
    return EXPANDED;
  }
}
exports.default = Patch;
_defineProperty(Patch, "layerName", 'patch');
class HiddenPatch extends Patch {
  constructor(marker, renderStatus, showFn) {
    super({
      status: null,
      hunks: [],
      marker
    });
    this.renderStatus = renderStatus;
    this.show = showFn;
  }
  getInsertionPoint() {
    return this.getRange().end;
  }
  getRenderStatus() {
    return this.renderStatus;
  }

  /*
   * Construct a String containing internal diagnostic information.
   */
  /* istanbul ignore next */
  inspect(opts = {}) {
    const options = _objectSpread({
      indent: 0
    }, opts);
    let indentation = '';
    for (let i = 0; i < options.indent; i++) {
      indentation += ' ';
    }
    return `${indentation}(HiddenPatch marker=${this.marker.id})\n`;
  }
}
class NullPatch {
  constructor() {
    const buffer = new _atom.TextBuffer();
    this.marker = buffer.markRange([[0, 0], [0, 0]]);
  }
  getStatus() {
    return null;
  }
  getMarker() {
    return this.marker;
  }
  getRange() {
    return this.getMarker().getRange();
  }
  getStartRange() {
    return _atom.Range.fromObject([[0, 0], [0, 0]]);
  }
  getHunks() {
    return [];
  }
  getChangedLineCount() {
    return 0;
  }
  containsRow() {
    return false;
  }
  getMaxLineNumberWidth() {
    return 0;
  }
  clone(opts = {}) {
    if (opts.status === undefined && opts.hunks === undefined && opts.marker === undefined && opts.renderStatus === undefined) {
      return this;
    } else {
      return new Patch({
        status: opts.status !== undefined ? opts.status : this.getStatus(),
        hunks: opts.hunks !== undefined ? opts.hunks : this.getHunks(),
        marker: opts.marker !== undefined ? opts.marker : this.getMarker(),
        renderStatus: opts.renderStatus !== undefined ? opts.renderStatus : this.getRenderStatus()
      });
    }
  }
  getStartingMarkers() {
    return [];
  }
  getEndingMarkers() {
    return [];
  }
  buildStagePatchForLines() {
    return this;
  }
  buildUnstagePatchForLines() {
    return this;
  }
  getFirstChangeRange() {
    return _atom.Range.fromObject([[0, 0], [0, 0]]);
  }
  updateMarkers() {}
  toStringIn() {
    return '';
  }

  /*
   * Construct a String containing internal diagnostic information.
   */
  /* istanbul ignore next */
  inspect(opts = {}) {
    const options = _objectSpread({
      indent: 0
    }, opts);
    let indentation = '';
    for (let i = 0; i < options.indent; i++) {
      indentation += ' ';
    }
    return `${indentation}(NullPatch)\n`;
  }
  isPresent() {
    return false;
  }
  getRenderStatus() {
    return EXPANDED;
  }
}
class BufferBuilder {
  constructor(original, originalBaseOffset, nextPatchBuffer) {
    this.originalBuffer = original;
    this.nextPatchBuffer = nextPatchBuffer;

    // The ranges provided to builder methods are expected to be valid within the original buffer. Account for
    // the position of the Patch within its original TextBuffer, and any existing content already on the next
    // TextBuffer.
    this.offset = this.nextPatchBuffer.getBuffer().getLastRow() - originalBaseOffset;
    this.hunkBufferText = '';
    this.hunkRowCount = 0;
    this.hunkStartOffset = this.offset;
    this.hunkRegions = [];
    this.hunkRange = null;
    this.lastOffset = 0;
  }
  append(range) {
    this.hunkBufferText += this.originalBuffer.getTextInRange(range) + '\n';
    this.hunkRowCount += range.getRowCount();
  }
  remove(range) {
    this.offset -= range.getRowCount();
  }
  markRegion(range, RegionKind) {
    const finalRange = this.offset !== 0 ? range.translate([this.offset, 0], [this.offset, 0]) : range;

    // Collapse consecutive ranges of the same RegionKind into one continuous region.
    const lastRegion = this.hunkRegions[this.hunkRegions.length - 1];
    if (lastRegion && lastRegion.RegionKind === RegionKind && finalRange.start.row - lastRegion.range.end.row === 1) {
      lastRegion.range.end = finalRange.end;
    } else {
      this.hunkRegions.push({
        RegionKind,
        range: finalRange
      });
    }
  }
  markHunkRange(range) {
    let finalRange = range;
    if (this.hunkStartOffset !== 0 || this.offset !== 0) {
      finalRange = finalRange.translate([this.hunkStartOffset, 0], [this.offset, 0]);
    }
    this.hunkRange = finalRange;
  }
  latestHunkWasIncluded() {
    this.nextPatchBuffer.buffer.append(this.hunkBufferText, {
      normalizeLineEndings: false
    });
    const regions = this.hunkRegions.map(({
      RegionKind,
      range
    }) => {
      const regionMarker = this.nextPatchBuffer.markRange(RegionKind.layerName, range, {
        invalidate: 'never',
        exclusive: false
      });
      return new RegionKind(regionMarker);
    });
    const marker = this.nextPatchBuffer.markRange('hunk', this.hunkRange, {
      invalidate: 'never',
      exclusive: false
    });
    this.hunkBufferText = '';
    this.hunkRowCount = 0;
    this.hunkStartOffset = this.offset;
    this.hunkRegions = [];
    this.hunkRange = null;
    return {
      regions,
      marker
    };
  }
  latestHunkWasDiscarded() {
    this.offset -= this.hunkRowCount;
    this.hunkBufferText = '';
    this.hunkRowCount = 0;
    this.hunkStartOffset = this.offset;
    this.hunkRegions = [];
    this.hunkRange = null;
    return {
      regions: [],
      marker: null
    };
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfaHVuayIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfcmVnaW9uIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwiT2JqZWN0Iiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkVYUEFOREVEIiwidG9TdHJpbmciLCJpc1Zpc2libGUiLCJpc0V4cGFuZGFibGUiLCJleHBvcnRzIiwiQ09MTEFQU0VEIiwiREVGRVJSRUQiLCJSRU1PVkVEIiwiUGF0Y2giLCJjcmVhdGVOdWxsIiwiTnVsbFBhdGNoIiwiY3JlYXRlSGlkZGVuUGF0Y2giLCJtYXJrZXIiLCJyZW5kZXJTdGF0dXMiLCJzaG93Rm4iLCJIaWRkZW5QYXRjaCIsImNvbnN0cnVjdG9yIiwic3RhdHVzIiwiaHVua3MiLCJjaGFuZ2VkTGluZUNvdW50IiwiZ2V0SHVua3MiLCJyZWR1Y2UiLCJhY2MiLCJodW5rIiwiZ2V0U3RhdHVzIiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJnZXRTdGFydFJhbmdlIiwic3RhcnRQb2ludCIsInN0YXJ0IiwiUmFuZ2UiLCJmcm9tT2JqZWN0IiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsImNvbnRhaW5zUm93Iiwicm93IiwiaW50ZXJzZWN0c1JvdyIsImRlc3Ryb3lNYXJrZXJzIiwiZGVzdHJveSIsInVwZGF0ZU1hcmtlcnMiLCJtYXAiLCJnZXQiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJsYXN0SHVuayIsImNsb25lIiwib3B0cyIsImdldFN0YXJ0aW5nTWFya2VycyIsIm1hcmtlcnMiLCJmaXJzdEh1bmsiLCJnZXRSZWdpb25zIiwiZmlyc3RSZWdpb24iLCJnZXRFbmRpbmdNYXJrZXJzIiwibGFzdFJlZ2lvbiIsImJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzIiwib3JpZ2luYWxCdWZmZXIiLCJuZXh0UGF0Y2hCdWZmZXIiLCJyb3dTZXQiLCJvcmlnaW5hbEJhc2VPZmZzZXQiLCJidWlsZGVyIiwiQnVmZmVyQnVpbGRlciIsIm5ld1Jvd0RlbHRhIiwiYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlIiwic2VsZWN0ZWREZWxldGlvblJvd0NvdW50Iiwibm9OZXdsaW5lUm93Q291bnQiLCJyZWdpb24iLCJpbnRlcnNlY3Rpb24iLCJnYXAiLCJpbnRlcnNlY3RSb3dzIiwid2hlbiIsImFkZGl0aW9uIiwicmVtb3ZlIiwiYXBwZW5kIiwibWFya1JlZ2lvbiIsIkFkZGl0aW9uIiwiZGVsZXRpb24iLCJVbmNoYW5nZWQiLCJEZWxldGlvbiIsImdldFJvd0NvdW50IiwidW5jaGFuZ2VkIiwibm9uZXdsaW5lIiwiTm9OZXdsaW5lIiwibWFya0h1bmtSYW5nZSIsInJlZ2lvbnMiLCJsYXRlc3RIdW5rV2FzSW5jbHVkZWQiLCJuZXdTdGFydFJvdyIsImdldE5ld1N0YXJ0Um93IiwibmV3Um93Q291bnQiLCJIdW5rIiwib2xkU3RhcnRSb3ciLCJnZXRPbGRTdGFydFJvdyIsIm9sZFJvd0NvdW50IiwiZ2V0T2xkUm93Q291bnQiLCJzZWN0aW9uSGVhZGluZyIsImdldFNlY3Rpb25IZWFkaW5nIiwiZ2V0TmV3Um93Q291bnQiLCJsYXRlc3RIdW5rV2FzRGlzY2FyZGVkIiwibWFya1JhbmdlIiwibGF5ZXJOYW1lIiwiZ2V0QnVmZmVyIiwiZ2V0TGFzdFJvdyIsIkluZmluaXR5IiwiaW52YWxpZGF0ZSIsImV4Y2x1c2l2ZSIsIndob2xlRmlsZSIsInNpemUiLCJidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzIiwiY29udGV4dFJvd0NvdW50IiwiYWRkaXRpb25Sb3dDb3VudCIsImRlbGV0aW9uUm93Q291bnQiLCJnZXRGaXJzdENoYW5nZVJhbmdlIiwiZmlyc3RDaGFuZ2UiLCJnZXRDaGFuZ2VzIiwiZmlyc3RSb3ciLCJnZXRTdGFydEJ1ZmZlclJvdyIsInRvU3RyaW5nSW4iLCJidWZmZXIiLCJzdHIiLCJpbnNwZWN0Iiwib3B0aW9ucyIsImluZGVudCIsImluZGVudGF0aW9uIiwiaSIsImluc3BlY3RTdHJpbmciLCJpZCIsImlzRGVzdHJveWVkIiwiaXNWYWxpZCIsImlzUHJlc2VudCIsImdldFJlbmRlclN0YXR1cyIsInNob3ciLCJnZXRJbnNlcnRpb25Qb2ludCIsImVuZCIsIlRleHRCdWZmZXIiLCJvcmlnaW5hbCIsIm9mZnNldCIsImh1bmtCdWZmZXJUZXh0IiwiaHVua1Jvd0NvdW50IiwiaHVua1N0YXJ0T2Zmc2V0IiwiaHVua1JlZ2lvbnMiLCJodW5rUmFuZ2UiLCJsYXN0T2Zmc2V0IiwicmFuZ2UiLCJnZXRUZXh0SW5SYW5nZSIsIlJlZ2lvbktpbmQiLCJmaW5hbFJhbmdlIiwidHJhbnNsYXRlIiwibm9ybWFsaXplTGluZUVuZGluZ3MiLCJyZWdpb25NYXJrZXIiXSwic291cmNlcyI6WyJwYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1RleHRCdWZmZXIsIFJhbmdlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IEh1bmsgZnJvbSAnLi9odW5rJztcbmltcG9ydCB7VW5jaGFuZ2VkLCBBZGRpdGlvbiwgRGVsZXRpb24sIE5vTmV3bGluZX0gZnJvbSAnLi9yZWdpb24nO1xuXG5leHBvcnQgY29uc3QgRVhQQU5ERUQgPSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gJ1JlbmRlclN0YXR1cyhleHBhbmRlZCknOyB9LFxuXG4gIGlzVmlzaWJsZSgpIHsgcmV0dXJuIHRydWU7IH0sXG5cbiAgaXNFeHBhbmRhYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG59O1xuXG5leHBvcnQgY29uc3QgQ09MTEFQU0VEID0ge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0b1N0cmluZygpIHsgcmV0dXJuICdSZW5kZXJTdGF0dXMoY29sbGFwc2VkKSc7IH0sXG5cbiAgaXNWaXNpYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG5cbiAgaXNFeHBhbmRhYmxlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBERUZFUlJFRCA9IHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcoKSB7IHJldHVybiAnUmVuZGVyU3RhdHVzKGRlZmVycmVkKSc7IH0sXG5cbiAgaXNWaXNpYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG5cbiAgaXNFeHBhbmRhYmxlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBSRU1PVkVEID0ge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0b1N0cmluZygpIHsgcmV0dXJuICdSZW5kZXJTdGF0dXMocmVtb3ZlZCknOyB9LFxuXG4gIGlzVmlzaWJsZSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuXG4gIGlzRXhwYW5kYWJsZSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0Y2gge1xuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ3BhdGNoJztcblxuICBzdGF0aWMgY3JlYXRlTnVsbCgpIHtcbiAgICByZXR1cm4gbmV3IE51bGxQYXRjaCgpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUhpZGRlblBhdGNoKG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pIHtcbiAgICByZXR1cm4gbmV3IEhpZGRlblBhdGNoKG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioe3N0YXR1cywgaHVua3MsIG1hcmtlcn0pIHtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICB0aGlzLmh1bmtzID0gaHVua3M7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXJrZXI7XG5cbiAgICB0aGlzLmNoYW5nZWRMaW5lQ291bnQgPSB0aGlzLmdldEh1bmtzKCkucmVkdWNlKChhY2MsIGh1bmspID0+IGFjYyArIGh1bmsuY2hhbmdlZExpbmVDb3VudCgpLCAwKTtcbiAgfVxuXG4gIGdldFN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXM7XG4gIH1cblxuICBnZXRNYXJrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgZ2V0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKTtcbiAgfVxuXG4gIGdldFN0YXJ0UmFuZ2UoKSB7XG4gICAgY29uc3Qgc3RhcnRQb2ludCA9IHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5zdGFydDtcbiAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbc3RhcnRQb2ludCwgc3RhcnRQb2ludF0pO1xuICB9XG5cbiAgZ2V0SHVua3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHVua3M7XG4gIH1cblxuICBnZXRDaGFuZ2VkTGluZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmNoYW5nZWRMaW5lQ291bnQ7XG4gIH1cblxuICBjb250YWluc1Jvdyhyb3cpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0UmFuZ2UoKS5pbnRlcnNlY3RzUm93KHJvdyk7XG4gIH1cblxuICBkZXN0cm95TWFya2VycygpIHtcbiAgICB0aGlzLm1hcmtlci5kZXN0cm95KCk7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIHRoaXMuaHVua3MpIHtcbiAgICAgIGh1bmsuZGVzdHJveU1hcmtlcnMoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVNYXJrZXJzKG1hcCkge1xuICAgIHRoaXMubWFya2VyID0gbWFwLmdldCh0aGlzLm1hcmtlcikgfHwgdGhpcy5tYXJrZXI7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIHRoaXMuaHVua3MpIHtcbiAgICAgIGh1bmsudXBkYXRlTWFya2VycyhtYXApO1xuICAgIH1cbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICBjb25zdCBsYXN0SHVuayA9IHRoaXMuaHVua3NbdGhpcy5odW5rcy5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gbGFzdEh1bmsgPyBsYXN0SHVuay5nZXRNYXhMaW5lTnVtYmVyV2lkdGgoKSA6IDA7XG4gIH1cblxuICBjbG9uZShvcHRzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Ioe1xuICAgICAgc3RhdHVzOiBvcHRzLnN0YXR1cyAhPT0gdW5kZWZpbmVkID8gb3B0cy5zdGF0dXMgOiB0aGlzLmdldFN0YXR1cygpLFxuICAgICAgaHVua3M6IG9wdHMuaHVua3MgIT09IHVuZGVmaW5lZCA/IG9wdHMuaHVua3MgOiB0aGlzLmdldEh1bmtzKCksXG4gICAgICBtYXJrZXI6IG9wdHMubWFya2VyICE9PSB1bmRlZmluZWQgPyBvcHRzLm1hcmtlciA6IHRoaXMuZ2V0TWFya2VyKCksXG4gICAgfSk7XG4gIH1cblxuICAvKiBSZXR1cm4gdGhlIHNldCBvZiBNYXJrZXJzIG93bmVkIGJ5IHRoaXMgUGF0Y2ggdGhhdCBidXR0IHVwIGFnYWluc3QgdGhlIHBhdGNoJ3MgYmVnaW5uaW5nLiAqL1xuICBnZXRTdGFydGluZ01hcmtlcnMoKSB7XG4gICAgY29uc3QgbWFya2VycyA9IFt0aGlzLm1hcmtlcl07XG4gICAgaWYgKHRoaXMuaHVua3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmlyc3RIdW5rID0gdGhpcy5odW5rc1swXTtcbiAgICAgIG1hcmtlcnMucHVzaChmaXJzdEh1bmsuZ2V0TWFya2VyKCkpO1xuICAgICAgaWYgKGZpcnN0SHVuay5nZXRSZWdpb25zKCkubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBmaXJzdFJlZ2lvbiA9IGZpcnN0SHVuay5nZXRSZWdpb25zKClbMF07XG4gICAgICAgIG1hcmtlcnMucHVzaChmaXJzdFJlZ2lvbi5nZXRNYXJrZXIoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXJrZXJzO1xuICB9XG5cbiAgLyogUmV0dXJuIHRoZSBzZXQgb2YgTWFya2VycyBvd25lZCBieSB0aGlzIFBhdGNoIHRoYXQgZW5kIGF0IHRoZSBwYXRjaCdzIGVuZCBwb3NpdGlvbi4gKi9cbiAgZ2V0RW5kaW5nTWFya2VycygpIHtcbiAgICBjb25zdCBtYXJrZXJzID0gW3RoaXMubWFya2VyXTtcbiAgICBpZiAodGhpcy5odW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBsYXN0SHVuayA9IHRoaXMuaHVua3NbdGhpcy5odW5rcy5sZW5ndGggLSAxXTtcbiAgICAgIG1hcmtlcnMucHVzaChsYXN0SHVuay5nZXRNYXJrZXIoKSk7XG4gICAgICBpZiAobGFzdEh1bmsuZ2V0UmVnaW9ucygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbGFzdFJlZ2lvbiA9IGxhc3RIdW5rLmdldFJlZ2lvbnMoKVtsYXN0SHVuay5nZXRSZWdpb25zKCkubGVuZ3RoIC0gMV07XG4gICAgICAgIG1hcmtlcnMucHVzaChsYXN0UmVnaW9uLmdldE1hcmtlcigpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlcnM7XG4gIH1cblxuICBidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyhvcmlnaW5hbEJ1ZmZlciwgbmV4dFBhdGNoQnVmZmVyLCByb3dTZXQpIHtcbiAgICBjb25zdCBvcmlnaW5hbEJhc2VPZmZzZXQgPSB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCkuc3RhcnQucm93O1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQnVmZmVyQnVpbGRlcihvcmlnaW5hbEJ1ZmZlciwgb3JpZ2luYWxCYXNlT2Zmc2V0LCBuZXh0UGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IGh1bmtzID0gW107XG5cbiAgICBsZXQgbmV3Um93RGVsdGEgPSAwO1xuXG4gICAgZm9yIChjb25zdCBodW5rIG9mIHRoaXMuZ2V0SHVua3MoKSkge1xuICAgICAgbGV0IGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IGZhbHNlO1xuICAgICAgbGV0IHNlbGVjdGVkRGVsZXRpb25Sb3dDb3VudCA9IDA7XG4gICAgICBsZXQgbm9OZXdsaW5lUm93Q291bnQgPSAwO1xuXG4gICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBodW5rLmdldFJlZ2lvbnMoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHtpbnRlcnNlY3Rpb24sIGdhcH0gb2YgcmVnaW9uLmludGVyc2VjdFJvd3Mocm93U2V0LCB0cnVlKSkge1xuICAgICAgICAgIHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChnYXApIHtcbiAgICAgICAgICAgICAgICAvLyBVbnNlbGVjdGVkIGFkZGl0aW9uOiBvbWl0IGZyb20gbmV3IGJ1ZmZlclxuICAgICAgICAgICAgICAgIGJ1aWxkZXIucmVtb3ZlKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0ZWQgYWRkaXRpb246IGluY2x1ZGUgaW4gbmV3IHBhdGNoXG4gICAgICAgICAgICAgICAgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIEFkZGl0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGV0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChnYXApIHtcbiAgICAgICAgICAgICAgICAvLyBVbnNlbGVjdGVkIGRlbGV0aW9uOiBjb252ZXJ0IHRvIGNvbnRleHQgcm93XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBVbmNoYW5nZWQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdGVkIGRlbGV0aW9uOiBpbmNsdWRlIGluIG5ldyBwYXRjaFxuICAgICAgICAgICAgICAgIGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBEZWxldGlvbik7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWREZWxldGlvblJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5jaGFuZ2VkOiAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIFVudG91Y2hlZCBjb250ZXh0IGxpbmU6IGluY2x1ZGUgaW4gbmV3IHBhdGNoXG4gICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIFVuY2hhbmdlZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9uZXdsaW5lOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIE5vTmV3bGluZSk7XG4gICAgICAgICAgICAgIG5vTmV3bGluZVJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlKSB7XG4gICAgICAgIC8vIEh1bmsgY29udGFpbnMgYXQgbGVhc3Qgb25lIHNlbGVjdGVkIGxpbmVcblxuICAgICAgICBidWlsZGVyLm1hcmtIdW5rUmFuZ2UoaHVuay5nZXRSYW5nZSgpKTtcbiAgICAgICAgY29uc3Qge3JlZ2lvbnMsIG1hcmtlcn0gPSBidWlsZGVyLmxhdGVzdEh1bmtXYXNJbmNsdWRlZCgpO1xuICAgICAgICBjb25zdCBuZXdTdGFydFJvdyA9IGh1bmsuZ2V0TmV3U3RhcnRSb3coKSArIG5ld1Jvd0RlbHRhO1xuICAgICAgICBjb25zdCBuZXdSb3dDb3VudCA9IG1hcmtlci5nZXRSYW5nZSgpLmdldFJvd0NvdW50KCkgLSBzZWxlY3RlZERlbGV0aW9uUm93Q291bnQgLSBub05ld2xpbmVSb3dDb3VudDtcblxuICAgICAgICBodW5rcy5wdXNoKG5ldyBIdW5rKHtcbiAgICAgICAgICBvbGRTdGFydFJvdzogaHVuay5nZXRPbGRTdGFydFJvdygpLFxuICAgICAgICAgIG9sZFJvd0NvdW50OiBodW5rLmdldE9sZFJvd0NvdW50KCksXG4gICAgICAgICAgbmV3U3RhcnRSb3csXG4gICAgICAgICAgbmV3Um93Q291bnQsXG4gICAgICAgICAgc2VjdGlvbkhlYWRpbmc6IGh1bmsuZ2V0U2VjdGlvbkhlYWRpbmcoKSxcbiAgICAgICAgICBtYXJrZXIsXG4gICAgICAgICAgcmVnaW9ucyxcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIG5ld1Jvd0RlbHRhICs9IG5ld1Jvd0NvdW50IC0gaHVuay5nZXROZXdSb3dDb3VudCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3Um93RGVsdGEgKz0gaHVuay5nZXRPbGRSb3dDb3VudCgpIC0gaHVuay5nZXROZXdSb3dDb3VudCgpO1xuXG4gICAgICAgIGJ1aWxkZXIubGF0ZXN0SHVua1dhc0Rpc2NhcmRlZCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1hcmtlciA9IG5leHRQYXRjaEJ1ZmZlci5tYXJrUmFuZ2UoXG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmxheWVyTmFtZSxcbiAgICAgIFtbMCwgMF0sIFtuZXh0UGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpIC0gMSwgSW5maW5pdHldXSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgY29uc3Qgd2hvbGVGaWxlID0gcm93U2V0LnNpemUgPT09IHRoaXMuY2hhbmdlZExpbmVDb3VudDtcbiAgICBjb25zdCBzdGF0dXMgPSB0aGlzLmdldFN0YXR1cygpID09PSAnZGVsZXRlZCcgJiYgIXdob2xlRmlsZSA/ICdtb2RpZmllZCcgOiB0aGlzLmdldFN0YXR1cygpO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtodW5rcywgc3RhdHVzLCBtYXJrZXJ9KTtcbiAgfVxuXG4gIGJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMob3JpZ2luYWxCdWZmZXIsIG5leHRQYXRjaEJ1ZmZlciwgcm93U2V0KSB7XG4gICAgY29uc3Qgb3JpZ2luYWxCYXNlT2Zmc2V0ID0gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLnN0YXJ0LnJvdztcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IEJ1ZmZlckJ1aWxkZXIob3JpZ2luYWxCdWZmZXIsIG9yaWdpbmFsQmFzZU9mZnNldCwgbmV4dFBhdGNoQnVmZmVyKTtcbiAgICBjb25zdCBodW5rcyA9IFtdO1xuICAgIGxldCBuZXdSb3dEZWx0YSA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5nZXRIdW5rcygpKSB7XG4gICAgICBsZXQgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gZmFsc2U7XG4gICAgICBsZXQgY29udGV4dFJvd0NvdW50ID0gMDtcbiAgICAgIGxldCBhZGRpdGlvblJvd0NvdW50ID0gMDtcbiAgICAgIGxldCBkZWxldGlvblJvd0NvdW50ID0gMDtcblxuICAgICAgZm9yIChjb25zdCByZWdpb24gb2YgaHVuay5nZXRSZWdpb25zKCkpIHtcbiAgICAgICAgZm9yIChjb25zdCB7aW50ZXJzZWN0aW9uLCBnYXB9IG9mIHJlZ2lvbi5pbnRlcnNlY3RSb3dzKHJvd1NldCwgdHJ1ZSkpIHtcbiAgICAgICAgICByZWdpb24ud2hlbih7XG4gICAgICAgICAgICBhZGRpdGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgICAgLy8gVW5zZWxlY3RlZCBhZGRpdGlvbjogYmVjb21lIGEgY29udGV4dCBsaW5lLlxuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgVW5jaGFuZ2VkKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0Um93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0ZWQgYWRkaXRpb246IGJlY29tZSBhIGRlbGV0aW9uLlxuICAgICAgICAgICAgICAgIGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBEZWxldGlvbik7XG4gICAgICAgICAgICAgICAgZGVsZXRpb25Sb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGV0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChnYXApIHtcbiAgICAgICAgICAgICAgICAvLyBOb24tc2VsZWN0ZWQgZGVsZXRpb246IG9taXQgZnJvbSBuZXcgYnVmZmVyLlxuICAgICAgICAgICAgICAgIGJ1aWxkZXIucmVtb3ZlKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0ZWQgZGVsZXRpb246IGJlY29tZXMgYW4gYWRkaXRpb25cbiAgICAgICAgICAgICAgICBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgQWRkaXRpb24pO1xuICAgICAgICAgICAgICAgIGFkZGl0aW9uUm93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gVW50b3VjaGVkIGNvbnRleHQgbGluZTogaW5jbHVkZSBpbiBuZXcgcGF0Y2guXG4gICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIFVuY2hhbmdlZCk7XG4gICAgICAgICAgICAgIGNvbnRleHRSb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBub25ld2xpbmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gTm9uZXdsaW5lIG1hcmtlcjogaW5jbHVkZSBpbiBuZXcgcGF0Y2guXG4gICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIE5vTmV3bGluZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UpIHtcbiAgICAgICAgLy8gSHVuayBjb250YWlucyBhdCBsZWFzdCBvbmUgc2VsZWN0ZWQgbGluZVxuXG4gICAgICAgIGJ1aWxkZXIubWFya0h1bmtSYW5nZShodW5rLmdldFJhbmdlKCkpO1xuICAgICAgICBjb25zdCB7bWFya2VyLCByZWdpb25zfSA9IGJ1aWxkZXIubGF0ZXN0SHVua1dhc0luY2x1ZGVkKCk7XG4gICAgICAgIGh1bmtzLnB1c2gobmV3IEh1bmsoe1xuICAgICAgICAgIG9sZFN0YXJ0Um93OiBodW5rLmdldE5ld1N0YXJ0Um93KCksXG4gICAgICAgICAgb2xkUm93Q291bnQ6IGNvbnRleHRSb3dDb3VudCArIGRlbGV0aW9uUm93Q291bnQsXG4gICAgICAgICAgbmV3U3RhcnRSb3c6IGh1bmsuZ2V0TmV3U3RhcnRSb3coKSArIG5ld1Jvd0RlbHRhLFxuICAgICAgICAgIG5ld1Jvd0NvdW50OiBjb250ZXh0Um93Q291bnQgKyBhZGRpdGlvblJvd0NvdW50LFxuICAgICAgICAgIHNlY3Rpb25IZWFkaW5nOiBodW5rLmdldFNlY3Rpb25IZWFkaW5nKCksXG4gICAgICAgICAgbWFya2VyLFxuICAgICAgICAgIHJlZ2lvbnMsXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1aWxkZXIubGF0ZXN0SHVua1dhc0Rpc2NhcmRlZCgpO1xuICAgICAgfVxuXG4gICAgICAvLyAoY29udGV4dFJvd0NvdW50ICsgYWRkaXRpb25Sb3dDb3VudCkgLSAoY29udGV4dFJvd0NvdW50ICsgZGVsZXRpb25Sb3dDb3VudClcbiAgICAgIG5ld1Jvd0RlbHRhICs9IGFkZGl0aW9uUm93Q291bnQgLSBkZWxldGlvblJvd0NvdW50O1xuICAgIH1cblxuICAgIGNvbnN0IHdob2xlRmlsZSA9IHJvd1NldC5zaXplID09PSB0aGlzLmNoYW5nZWRMaW5lQ291bnQ7XG4gICAgbGV0IHN0YXR1cyA9IHRoaXMuZ2V0U3RhdHVzKCk7XG4gICAgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdhZGRlZCcpIHtcbiAgICAgIHN0YXR1cyA9IHdob2xlRmlsZSA/ICdkZWxldGVkJyA6ICdtb2RpZmllZCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnZGVsZXRlZCcpIHtcbiAgICAgIHN0YXR1cyA9ICdhZGRlZCc7XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2VyID0gbmV4dFBhdGNoQnVmZmVyLm1hcmtSYW5nZShcbiAgICAgIHRoaXMuY29uc3RydWN0b3IubGF5ZXJOYW1lLFxuICAgICAgW1swLCAwXSwgW25leHRQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRMYXN0Um93KCksIEluZmluaXR5XV0sXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLmNsb25lKHtodW5rcywgc3RhdHVzLCBtYXJrZXJ9KTtcbiAgfVxuXG4gIGdldEZpcnN0Q2hhbmdlUmFuZ2UoKSB7XG4gICAgY29uc3QgZmlyc3RIdW5rID0gdGhpcy5nZXRIdW5rcygpWzBdO1xuICAgIGlmICghZmlyc3RIdW5rKSB7XG4gICAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdENoYW5nZSA9IGZpcnN0SHVuay5nZXRDaGFuZ2VzKClbMF07XG4gICAgaWYgKCFmaXJzdENoYW5nZSkge1xuICAgICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDBdXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RSb3cgPSBmaXJzdENoYW5nZS5nZXRTdGFydEJ1ZmZlclJvdygpO1xuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbZmlyc3RSb3csIDBdLCBbZmlyc3RSb3csIEluZmluaXR5XV0pO1xuICB9XG5cbiAgdG9TdHJpbmdJbihidWZmZXIpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIdW5rcygpLnJlZHVjZSgoc3RyLCBodW5rKSA9PiBzdHIgKyBodW5rLnRvU3RyaW5nSW4oYnVmZmVyKSwgJycpO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIGxldCBpbnNwZWN0U3RyaW5nID0gYCR7aW5kZW50YXRpb259KFBhdGNoIG1hcmtlcj0ke3RoaXMubWFya2VyLmlkfWA7XG4gICAgaWYgKHRoaXMubWFya2VyLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbZGVzdHJveWVkXSc7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXJrZXIuaXNWYWxpZCgpKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9ICcgW2ludmFsaWRdJztcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSAnXFxuJztcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5odW5rcykge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSBodW5rLmluc3BlY3Qoe2luZGVudDogb3B0aW9ucy5pbmRlbnQgKyAyfSk7XG4gICAgfVxuICAgIGluc3BlY3RTdHJpbmcgKz0gYCR7aW5kZW50YXRpb259KVxcbmA7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXRSZW5kZXJTdGF0dXMoKSB7XG4gICAgcmV0dXJuIEVYUEFOREVEO1xuICB9XG59XG5cbmNsYXNzIEhpZGRlblBhdGNoIGV4dGVuZHMgUGF0Y2gge1xuICBjb25zdHJ1Y3RvcihtYXJrZXIsIHJlbmRlclN0YXR1cywgc2hvd0ZuKSB7XG4gICAgc3VwZXIoe3N0YXR1czogbnVsbCwgaHVua3M6IFtdLCBtYXJrZXJ9KTtcblxuICAgIHRoaXMucmVuZGVyU3RhdHVzID0gcmVuZGVyU3RhdHVzO1xuICAgIHRoaXMuc2hvdyA9IHNob3dGbjtcbiAgfVxuXG4gIGdldEluc2VydGlvblBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJhbmdlKCkuZW5kO1xuICB9XG5cbiAgZ2V0UmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlclN0YXR1cztcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGludGVybmFsIGRpYWdub3N0aWMgaW5mb3JtYXRpb24uXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpbmRlbnQ6IDAsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICBsZXQgaW5kZW50YXRpb24gPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuaW5kZW50OyBpKyspIHtcbiAgICAgIGluZGVudGF0aW9uICs9ICcgJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7aW5kZW50YXRpb259KEhpZGRlblBhdGNoIG1hcmtlcj0ke3RoaXMubWFya2VyLmlkfSlcXG5gO1xuICB9XG59XG5cbmNsYXNzIE51bGxQYXRjaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyKCk7XG4gICAgdGhpcy5tYXJrZXIgPSBidWZmZXIubWFya1JhbmdlKFtbMCwgMF0sIFswLCAwXV0pO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0TWFya2VyKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcjtcbiAgfVxuXG4gIGdldFJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCk7XG4gIH1cblxuICBnZXRTdGFydFJhbmdlKCkge1xuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCAwXV0pO1xuICB9XG5cbiAgZ2V0SHVua3MoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0Q2hhbmdlZExpbmVDb3VudCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbnRhaW5zUm93KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIGlmIChcbiAgICAgIG9wdHMuc3RhdHVzID09PSB1bmRlZmluZWQgJiZcbiAgICAgIG9wdHMuaHVua3MgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgb3B0cy5tYXJrZXIgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgb3B0cy5yZW5kZXJTdGF0dXMgPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUGF0Y2goe1xuICAgICAgICBzdGF0dXM6IG9wdHMuc3RhdHVzICE9PSB1bmRlZmluZWQgPyBvcHRzLnN0YXR1cyA6IHRoaXMuZ2V0U3RhdHVzKCksXG4gICAgICAgIGh1bmtzOiBvcHRzLmh1bmtzICE9PSB1bmRlZmluZWQgPyBvcHRzLmh1bmtzIDogdGhpcy5nZXRIdW5rcygpLFxuICAgICAgICBtYXJrZXI6IG9wdHMubWFya2VyICE9PSB1bmRlZmluZWQgPyBvcHRzLm1hcmtlciA6IHRoaXMuZ2V0TWFya2VyKCksXG4gICAgICAgIHJlbmRlclN0YXR1czogb3B0cy5yZW5kZXJTdGF0dXMgIT09IHVuZGVmaW5lZCA/IG9wdHMucmVuZGVyU3RhdHVzIDogdGhpcy5nZXRSZW5kZXJTdGF0dXMoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFN0YXJ0aW5nTWFya2VycygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRFbmRpbmdNYXJrZXJzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcygpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldEZpcnN0Q2hhbmdlUmFuZ2UoKSB7XG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDBdXSk7XG4gIH1cblxuICB1cGRhdGVNYXJrZXJzKCkge31cblxuICB0b1N0cmluZ0luKCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGludGVybmFsIGRpYWdub3N0aWMgaW5mb3JtYXRpb24uXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpbmRlbnQ6IDAsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICBsZXQgaW5kZW50YXRpb24gPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuaW5kZW50OyBpKyspIHtcbiAgICAgIGluZGVudGF0aW9uICs9ICcgJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7aW5kZW50YXRpb259KE51bGxQYXRjaClcXG5gO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFJlbmRlclN0YXR1cygpIHtcbiAgICByZXR1cm4gRVhQQU5ERUQ7XG4gIH1cbn1cblxuY2xhc3MgQnVmZmVyQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKG9yaWdpbmFsLCBvcmlnaW5hbEJhc2VPZmZzZXQsIG5leHRQYXRjaEJ1ZmZlcikge1xuICAgIHRoaXMub3JpZ2luYWxCdWZmZXIgPSBvcmlnaW5hbDtcbiAgICB0aGlzLm5leHRQYXRjaEJ1ZmZlciA9IG5leHRQYXRjaEJ1ZmZlcjtcblxuICAgIC8vIFRoZSByYW5nZXMgcHJvdmlkZWQgdG8gYnVpbGRlciBtZXRob2RzIGFyZSBleHBlY3RlZCB0byBiZSB2YWxpZCB3aXRoaW4gdGhlIG9yaWdpbmFsIGJ1ZmZlci4gQWNjb3VudCBmb3JcbiAgICAvLyB0aGUgcG9zaXRpb24gb2YgdGhlIFBhdGNoIHdpdGhpbiBpdHMgb3JpZ2luYWwgVGV4dEJ1ZmZlciwgYW5kIGFueSBleGlzdGluZyBjb250ZW50IGFscmVhZHkgb24gdGhlIG5leHRcbiAgICAvLyBUZXh0QnVmZmVyLlxuICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5uZXh0UGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpIC0gb3JpZ2luYWxCYXNlT2Zmc2V0O1xuXG4gICAgdGhpcy5odW5rQnVmZmVyVGV4dCA9ICcnO1xuICAgIHRoaXMuaHVua1Jvd0NvdW50ID0gMDtcbiAgICB0aGlzLmh1bmtTdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIHRoaXMuaHVua1JlZ2lvbnMgPSBbXTtcbiAgICB0aGlzLmh1bmtSYW5nZSA9IG51bGw7XG5cbiAgICB0aGlzLmxhc3RPZmZzZXQgPSAwO1xuICB9XG5cbiAgYXBwZW5kKHJhbmdlKSB7XG4gICAgdGhpcy5odW5rQnVmZmVyVGV4dCArPSB0aGlzLm9yaWdpbmFsQnVmZmVyLmdldFRleHRJblJhbmdlKHJhbmdlKSArICdcXG4nO1xuICAgIHRoaXMuaHVua1Jvd0NvdW50ICs9IHJhbmdlLmdldFJvd0NvdW50KCk7XG4gIH1cblxuICByZW1vdmUocmFuZ2UpIHtcbiAgICB0aGlzLm9mZnNldCAtPSByYW5nZS5nZXRSb3dDb3VudCgpO1xuICB9XG5cbiAgbWFya1JlZ2lvbihyYW5nZSwgUmVnaW9uS2luZCkge1xuICAgIGNvbnN0IGZpbmFsUmFuZ2UgPSB0aGlzLm9mZnNldCAhPT0gMFxuICAgICAgPyByYW5nZS50cmFuc2xhdGUoW3RoaXMub2Zmc2V0LCAwXSwgW3RoaXMub2Zmc2V0LCAwXSlcbiAgICAgIDogcmFuZ2U7XG5cbiAgICAvLyBDb2xsYXBzZSBjb25zZWN1dGl2ZSByYW5nZXMgb2YgdGhlIHNhbWUgUmVnaW9uS2luZCBpbnRvIG9uZSBjb250aW51b3VzIHJlZ2lvbi5cbiAgICBjb25zdCBsYXN0UmVnaW9uID0gdGhpcy5odW5rUmVnaW9uc1t0aGlzLmh1bmtSZWdpb25zLmxlbmd0aCAtIDFdO1xuICAgIGlmIChsYXN0UmVnaW9uICYmIGxhc3RSZWdpb24uUmVnaW9uS2luZCA9PT0gUmVnaW9uS2luZCAmJiBmaW5hbFJhbmdlLnN0YXJ0LnJvdyAtIGxhc3RSZWdpb24ucmFuZ2UuZW5kLnJvdyA9PT0gMSkge1xuICAgICAgbGFzdFJlZ2lvbi5yYW5nZS5lbmQgPSBmaW5hbFJhbmdlLmVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5odW5rUmVnaW9ucy5wdXNoKHtSZWdpb25LaW5kLCByYW5nZTogZmluYWxSYW5nZX0pO1xuICAgIH1cbiAgfVxuXG4gIG1hcmtIdW5rUmFuZ2UocmFuZ2UpIHtcbiAgICBsZXQgZmluYWxSYW5nZSA9IHJhbmdlO1xuICAgIGlmICh0aGlzLmh1bmtTdGFydE9mZnNldCAhPT0gMCB8fCB0aGlzLm9mZnNldCAhPT0gMCkge1xuICAgICAgZmluYWxSYW5nZSA9IGZpbmFsUmFuZ2UudHJhbnNsYXRlKFt0aGlzLmh1bmtTdGFydE9mZnNldCwgMF0sIFt0aGlzLm9mZnNldCwgMF0pO1xuICAgIH1cbiAgICB0aGlzLmh1bmtSYW5nZSA9IGZpbmFsUmFuZ2U7XG4gIH1cblxuICBsYXRlc3RIdW5rV2FzSW5jbHVkZWQoKSB7XG4gICAgdGhpcy5uZXh0UGF0Y2hCdWZmZXIuYnVmZmVyLmFwcGVuZCh0aGlzLmh1bmtCdWZmZXJUZXh0LCB7bm9ybWFsaXplTGluZUVuZGluZ3M6IGZhbHNlfSk7XG5cbiAgICBjb25zdCByZWdpb25zID0gdGhpcy5odW5rUmVnaW9ucy5tYXAoKHtSZWdpb25LaW5kLCByYW5nZX0pID0+IHtcbiAgICAgIGNvbnN0IHJlZ2lvbk1hcmtlciA9IHRoaXMubmV4dFBhdGNoQnVmZmVyLm1hcmtSYW5nZShcbiAgICAgICAgUmVnaW9uS2luZC5sYXllck5hbWUsXG4gICAgICAgIHJhbmdlLFxuICAgICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIG5ldyBSZWdpb25LaW5kKHJlZ2lvbk1hcmtlcik7XG4gICAgfSk7XG5cbiAgICBjb25zdCBtYXJrZXIgPSB0aGlzLm5leHRQYXRjaEJ1ZmZlci5tYXJrUmFuZ2UoJ2h1bmsnLCB0aGlzLmh1bmtSYW5nZSwge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9KTtcblxuICAgIHRoaXMuaHVua0J1ZmZlclRleHQgPSAnJztcbiAgICB0aGlzLmh1bmtSb3dDb3VudCA9IDA7XG4gICAgdGhpcy5odW5rU3RhcnRPZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICB0aGlzLmh1bmtSZWdpb25zID0gW107XG4gICAgdGhpcy5odW5rUmFuZ2UgPSBudWxsO1xuXG4gICAgcmV0dXJuIHtyZWdpb25zLCBtYXJrZXJ9O1xuICB9XG5cbiAgbGF0ZXN0SHVua1dhc0Rpc2NhcmRlZCgpIHtcbiAgICB0aGlzLm9mZnNldCAtPSB0aGlzLmh1bmtSb3dDb3VudDtcblxuICAgIHRoaXMuaHVua0J1ZmZlclRleHQgPSAnJztcbiAgICB0aGlzLmh1bmtSb3dDb3VudCA9IDA7XG4gICAgdGhpcy5odW5rU3RhcnRPZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICB0aGlzLmh1bmtSZWdpb25zID0gW107XG4gICAgdGhpcy5odW5rUmFuZ2UgPSBudWxsO1xuXG4gICAgcmV0dXJuIHtyZWdpb25zOiBbXSwgbWFya2VyOiBudWxsfTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLE9BQUE7QUFFQSxJQUFBQyxLQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxPQUFBLEdBQUFILE9BQUE7QUFBa0UsU0FBQUUsdUJBQUFFLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxRQUFBQyxDQUFBLEVBQUFDLENBQUEsUUFBQUMsQ0FBQSxHQUFBQyxNQUFBLENBQUFDLElBQUEsQ0FBQUosQ0FBQSxPQUFBRyxNQUFBLENBQUFFLHFCQUFBLFFBQUFDLENBQUEsR0FBQUgsTUFBQSxDQUFBRSxxQkFBQSxDQUFBTCxDQUFBLEdBQUFDLENBQUEsS0FBQUssQ0FBQSxHQUFBQSxDQUFBLENBQUFDLE1BQUEsV0FBQU4sQ0FBQSxXQUFBRSxNQUFBLENBQUFLLHdCQUFBLENBQUFSLENBQUEsRUFBQUMsQ0FBQSxFQUFBUSxVQUFBLE9BQUFQLENBQUEsQ0FBQVEsSUFBQSxDQUFBQyxLQUFBLENBQUFULENBQUEsRUFBQUksQ0FBQSxZQUFBSixDQUFBO0FBQUEsU0FBQVUsY0FBQVosQ0FBQSxhQUFBQyxDQUFBLE1BQUFBLENBQUEsR0FBQVksU0FBQSxDQUFBQyxNQUFBLEVBQUFiLENBQUEsVUFBQUMsQ0FBQSxXQUFBVyxTQUFBLENBQUFaLENBQUEsSUFBQVksU0FBQSxDQUFBWixDQUFB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