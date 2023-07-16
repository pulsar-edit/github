"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REMOVED = exports.DEFERRED = exports.COLLAPSED = exports.EXPANDED = void 0;
var _atom = require("atom");
var _hunk = _interopRequireDefault(require("./hunk"));
var _region = require("./region");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfaHVuayIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfcmVnaW9uIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9scyIsImZpbHRlciIsInN5bSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsImZvckVhY2giLCJrZXkiLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkVYUEFOREVEIiwidG9TdHJpbmciLCJpc1Zpc2libGUiLCJpc0V4cGFuZGFibGUiLCJleHBvcnRzIiwiQ09MTEFQU0VEIiwiREVGRVJSRUQiLCJSRU1PVkVEIiwiUGF0Y2giLCJjcmVhdGVOdWxsIiwiTnVsbFBhdGNoIiwiY3JlYXRlSGlkZGVuUGF0Y2giLCJtYXJrZXIiLCJyZW5kZXJTdGF0dXMiLCJzaG93Rm4iLCJIaWRkZW5QYXRjaCIsImNvbnN0cnVjdG9yIiwic3RhdHVzIiwiaHVua3MiLCJjaGFuZ2VkTGluZUNvdW50IiwiZ2V0SHVua3MiLCJyZWR1Y2UiLCJhY2MiLCJodW5rIiwiZ2V0U3RhdHVzIiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJnZXRTdGFydFJhbmdlIiwic3RhcnRQb2ludCIsInN0YXJ0IiwiUmFuZ2UiLCJmcm9tT2JqZWN0IiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsImNvbnRhaW5zUm93Iiwicm93IiwiaW50ZXJzZWN0c1JvdyIsImRlc3Ryb3lNYXJrZXJzIiwiZGVzdHJveSIsInVwZGF0ZU1hcmtlcnMiLCJtYXAiLCJnZXQiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJsYXN0SHVuayIsImNsb25lIiwib3B0cyIsImdldFN0YXJ0aW5nTWFya2VycyIsIm1hcmtlcnMiLCJmaXJzdEh1bmsiLCJnZXRSZWdpb25zIiwiZmlyc3RSZWdpb24iLCJnZXRFbmRpbmdNYXJrZXJzIiwibGFzdFJlZ2lvbiIsImJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzIiwib3JpZ2luYWxCdWZmZXIiLCJuZXh0UGF0Y2hCdWZmZXIiLCJyb3dTZXQiLCJvcmlnaW5hbEJhc2VPZmZzZXQiLCJidWlsZGVyIiwiQnVmZmVyQnVpbGRlciIsIm5ld1Jvd0RlbHRhIiwiYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlIiwic2VsZWN0ZWREZWxldGlvblJvd0NvdW50Iiwibm9OZXdsaW5lUm93Q291bnQiLCJyZWdpb24iLCJpbnRlcnNlY3Rpb24iLCJnYXAiLCJpbnRlcnNlY3RSb3dzIiwid2hlbiIsImFkZGl0aW9uIiwicmVtb3ZlIiwiYXBwZW5kIiwibWFya1JlZ2lvbiIsIkFkZGl0aW9uIiwiZGVsZXRpb24iLCJVbmNoYW5nZWQiLCJEZWxldGlvbiIsImdldFJvd0NvdW50IiwidW5jaGFuZ2VkIiwibm9uZXdsaW5lIiwiTm9OZXdsaW5lIiwibWFya0h1bmtSYW5nZSIsInJlZ2lvbnMiLCJsYXRlc3RIdW5rV2FzSW5jbHVkZWQiLCJuZXdTdGFydFJvdyIsImdldE5ld1N0YXJ0Um93IiwibmV3Um93Q291bnQiLCJIdW5rIiwib2xkU3RhcnRSb3ciLCJnZXRPbGRTdGFydFJvdyIsIm9sZFJvd0NvdW50IiwiZ2V0T2xkUm93Q291bnQiLCJzZWN0aW9uSGVhZGluZyIsImdldFNlY3Rpb25IZWFkaW5nIiwiZ2V0TmV3Um93Q291bnQiLCJsYXRlc3RIdW5rV2FzRGlzY2FyZGVkIiwibWFya1JhbmdlIiwibGF5ZXJOYW1lIiwiZ2V0QnVmZmVyIiwiZ2V0TGFzdFJvdyIsIkluZmluaXR5IiwiaW52YWxpZGF0ZSIsImV4Y2x1c2l2ZSIsIndob2xlRmlsZSIsInNpemUiLCJidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzIiwiY29udGV4dFJvd0NvdW50IiwiYWRkaXRpb25Sb3dDb3VudCIsImRlbGV0aW9uUm93Q291bnQiLCJnZXRGaXJzdENoYW5nZVJhbmdlIiwiZmlyc3RDaGFuZ2UiLCJnZXRDaGFuZ2VzIiwiZmlyc3RSb3ciLCJnZXRTdGFydEJ1ZmZlclJvdyIsInRvU3RyaW5nSW4iLCJidWZmZXIiLCJzdHIiLCJpbnNwZWN0Iiwib3B0aW9ucyIsImluZGVudCIsImluZGVudGF0aW9uIiwiaW5zcGVjdFN0cmluZyIsImlkIiwiaXNEZXN0cm95ZWQiLCJpc1ZhbGlkIiwiaXNQcmVzZW50IiwiZ2V0UmVuZGVyU3RhdHVzIiwic2hvdyIsImdldEluc2VydGlvblBvaW50IiwiZW5kIiwiVGV4dEJ1ZmZlciIsIm9yaWdpbmFsIiwib2Zmc2V0IiwiaHVua0J1ZmZlclRleHQiLCJodW5rUm93Q291bnQiLCJodW5rU3RhcnRPZmZzZXQiLCJodW5rUmVnaW9ucyIsImh1bmtSYW5nZSIsImxhc3RPZmZzZXQiLCJyYW5nZSIsImdldFRleHRJblJhbmdlIiwiUmVnaW9uS2luZCIsImZpbmFsUmFuZ2UiLCJ0cmFuc2xhdGUiLCJub3JtYWxpemVMaW5lRW5kaW5ncyIsInJlZ2lvbk1hcmtlciJdLCJzb3VyY2VzIjpbInBhdGNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGV4dEJ1ZmZlciwgUmFuZ2V9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgSHVuayBmcm9tICcuL2h1bmsnO1xuaW1wb3J0IHtVbmNoYW5nZWQsIEFkZGl0aW9uLCBEZWxldGlvbiwgTm9OZXdsaW5lfSBmcm9tICcuL3JlZ2lvbic7XG5cbmV4cG9ydCBjb25zdCBFWFBBTkRFRCA9IHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcoKSB7IHJldHVybiAnUmVuZGVyU3RhdHVzKGV4cGFuZGVkKSc7IH0sXG5cbiAgaXNWaXNpYmxlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiBmYWxzZTsgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBDT0xMQVBTRUQgPSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gJ1JlbmRlclN0YXR1cyhjb2xsYXBzZWQpJzsgfSxcblxuICBpc1Zpc2libGUoKSB7IHJldHVybiBmYWxzZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiB0cnVlOyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IERFRkVSUkVEID0ge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0b1N0cmluZygpIHsgcmV0dXJuICdSZW5kZXJTdGF0dXMoZGVmZXJyZWQpJzsgfSxcblxuICBpc1Zpc2libGUoKSB7IHJldHVybiBmYWxzZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiB0cnVlOyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IFJFTU9WRUQgPSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gJ1JlbmRlclN0YXR1cyhyZW1vdmVkKSc7IH0sXG5cbiAgaXNWaXNpYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG5cbiAgaXNFeHBhbmRhYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRjaCB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAncGF0Y2gnO1xuXG4gIHN0YXRpYyBjcmVhdGVOdWxsKCkge1xuICAgIHJldHVybiBuZXcgTnVsbFBhdGNoKCk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlSGlkZGVuUGF0Y2gobWFya2VyLCByZW5kZXJTdGF0dXMsIHNob3dGbikge1xuICAgIHJldHVybiBuZXcgSGlkZGVuUGF0Y2gobWFya2VyLCByZW5kZXJTdGF0dXMsIHNob3dGbik7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7c3RhdHVzLCBodW5rcywgbWFya2VyfSkge1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuaHVua3MgPSBodW5rcztcbiAgICB0aGlzLm1hcmtlciA9IG1hcmtlcjtcblxuICAgIHRoaXMuY2hhbmdlZExpbmVDb3VudCA9IHRoaXMuZ2V0SHVua3MoKS5yZWR1Y2UoKGFjYywgaHVuaykgPT4gYWNjICsgaHVuay5jaGFuZ2VkTGluZUNvdW50KCksIDApO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cztcbiAgfVxuXG4gIGdldE1hcmtlcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICBnZXRSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0U3RhcnRSYW5nZSgpIHtcbiAgICBjb25zdCBzdGFydFBvaW50ID0gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLnN0YXJ0O1xuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtzdGFydFBvaW50LCBzdGFydFBvaW50XSk7XG4gIH1cblxuICBnZXRIdW5rcygpIHtcbiAgICByZXR1cm4gdGhpcy5odW5rcztcbiAgfVxuXG4gIGdldENoYW5nZWRMaW5lQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlZExpbmVDb3VudDtcbiAgfVxuXG4gIGNvbnRhaW5zUm93KHJvdykge1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRSYW5nZSgpLmludGVyc2VjdHNSb3cocm93KTtcbiAgfVxuXG4gIGRlc3Ryb3lNYXJrZXJzKCkge1xuICAgIHRoaXMubWFya2VyLmRlc3Ryb3koKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5odW5rcykge1xuICAgICAgaHVuay5kZXN0cm95TWFya2VycygpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMobWFwKSB7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXAuZ2V0KHRoaXMubWFya2VyKSB8fCB0aGlzLm1hcmtlcjtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5odW5rcykge1xuICAgICAgaHVuay51cGRhdGVNYXJrZXJzKG1hcCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TWF4TGluZU51bWJlcldpZHRoKCkge1xuICAgIGNvbnN0IGxhc3RIdW5rID0gdGhpcy5odW5rc1t0aGlzLmh1bmtzLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBsYXN0SHVuayA/IGxhc3RIdW5rLmdldE1heExpbmVOdW1iZXJXaWR0aCgpIDogMDtcbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICBzdGF0dXM6IG9wdHMuc3RhdHVzICE9PSB1bmRlZmluZWQgPyBvcHRzLnN0YXR1cyA6IHRoaXMuZ2V0U3RhdHVzKCksXG4gICAgICBodW5rczogb3B0cy5odW5rcyAhPT0gdW5kZWZpbmVkID8gb3B0cy5odW5rcyA6IHRoaXMuZ2V0SHVua3MoKSxcbiAgICAgIG1hcmtlcjogb3B0cy5tYXJrZXIgIT09IHVuZGVmaW5lZCA/IG9wdHMubWFya2VyIDogdGhpcy5nZXRNYXJrZXIoKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qIFJldHVybiB0aGUgc2V0IG9mIE1hcmtlcnMgb3duZWQgYnkgdGhpcyBQYXRjaCB0aGF0IGJ1dHQgdXAgYWdhaW5zdCB0aGUgcGF0Y2gncyBiZWdpbm5pbmcuICovXG4gIGdldFN0YXJ0aW5nTWFya2VycygpIHtcbiAgICBjb25zdCBtYXJrZXJzID0gW3RoaXMubWFya2VyXTtcbiAgICBpZiAodGhpcy5odW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdEh1bmsgPSB0aGlzLmh1bmtzWzBdO1xuICAgICAgbWFya2Vycy5wdXNoKGZpcnN0SHVuay5nZXRNYXJrZXIoKSk7XG4gICAgICBpZiAoZmlyc3RIdW5rLmdldFJlZ2lvbnMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0UmVnaW9uID0gZmlyc3RIdW5rLmdldFJlZ2lvbnMoKVswXTtcbiAgICAgICAgbWFya2Vycy5wdXNoKGZpcnN0UmVnaW9uLmdldE1hcmtlcigpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlcnM7XG4gIH1cblxuICAvKiBSZXR1cm4gdGhlIHNldCBvZiBNYXJrZXJzIG93bmVkIGJ5IHRoaXMgUGF0Y2ggdGhhdCBlbmQgYXQgdGhlIHBhdGNoJ3MgZW5kIHBvc2l0aW9uLiAqL1xuICBnZXRFbmRpbmdNYXJrZXJzKCkge1xuICAgIGNvbnN0IG1hcmtlcnMgPSBbdGhpcy5tYXJrZXJdO1xuICAgIGlmICh0aGlzLmh1bmtzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGxhc3RIdW5rID0gdGhpcy5odW5rc1t0aGlzLmh1bmtzLmxlbmd0aCAtIDFdO1xuICAgICAgbWFya2Vycy5wdXNoKGxhc3RIdW5rLmdldE1hcmtlcigpKTtcbiAgICAgIGlmIChsYXN0SHVuay5nZXRSZWdpb25zKCkubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBsYXN0UmVnaW9uID0gbGFzdEh1bmsuZ2V0UmVnaW9ucygpW2xhc3RIdW5rLmdldFJlZ2lvbnMoKS5sZW5ndGggLSAxXTtcbiAgICAgICAgbWFya2Vycy5wdXNoKGxhc3RSZWdpb24uZ2V0TWFya2VyKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFya2VycztcbiAgfVxuXG4gIGJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzKG9yaWdpbmFsQnVmZmVyLCBuZXh0UGF0Y2hCdWZmZXIsIHJvd1NldCkge1xuICAgIGNvbnN0IG9yaWdpbmFsQmFzZU9mZnNldCA9IHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5zdGFydC5yb3c7XG4gICAgY29uc3QgYnVpbGRlciA9IG5ldyBCdWZmZXJCdWlsZGVyKG9yaWdpbmFsQnVmZmVyLCBvcmlnaW5hbEJhc2VPZmZzZXQsIG5leHRQYXRjaEJ1ZmZlcik7XG4gICAgY29uc3QgaHVua3MgPSBbXTtcblxuICAgIGxldCBuZXdSb3dEZWx0YSA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5nZXRIdW5rcygpKSB7XG4gICAgICBsZXQgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gZmFsc2U7XG4gICAgICBsZXQgc2VsZWN0ZWREZWxldGlvblJvd0NvdW50ID0gMDtcbiAgICAgIGxldCBub05ld2xpbmVSb3dDb3VudCA9IDA7XG5cbiAgICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIGh1bmsuZ2V0UmVnaW9ucygpKSB7XG4gICAgICAgIGZvciAoY29uc3Qge2ludGVyc2VjdGlvbiwgZ2FwfSBvZiByZWdpb24uaW50ZXJzZWN0Um93cyhyb3dTZXQsIHRydWUpKSB7XG4gICAgICAgICAgcmVnaW9uLndoZW4oe1xuICAgICAgICAgICAgYWRkaXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIFVuc2VsZWN0ZWQgYWRkaXRpb246IG9taXQgZnJvbSBuZXcgYnVmZmVyXG4gICAgICAgICAgICAgICAgYnVpbGRlci5yZW1vdmUoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBhZGRpdGlvbjogaW5jbHVkZSBpbiBuZXcgcGF0Y2hcbiAgICAgICAgICAgICAgICBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgQWRkaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIFVuc2VsZWN0ZWQgZGVsZXRpb246IGNvbnZlcnQgdG8gY29udGV4dCByb3dcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIFVuY2hhbmdlZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0ZWQgZGVsZXRpb246IGluY2x1ZGUgaW4gbmV3IHBhdGNoXG4gICAgICAgICAgICAgICAgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIERlbGV0aW9uKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZERlbGV0aW9uUm93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gVW50b3VjaGVkIGNvbnRleHQgbGluZTogaW5jbHVkZSBpbiBuZXcgcGF0Y2hcbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgVW5jaGFuZ2VkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBub25ld2xpbmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgTm9OZXdsaW5lKTtcbiAgICAgICAgICAgICAgbm9OZXdsaW5lUm93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UpIHtcbiAgICAgICAgLy8gSHVuayBjb250YWlucyBhdCBsZWFzdCBvbmUgc2VsZWN0ZWQgbGluZVxuXG4gICAgICAgIGJ1aWxkZXIubWFya0h1bmtSYW5nZShodW5rLmdldFJhbmdlKCkpO1xuICAgICAgICBjb25zdCB7cmVnaW9ucywgbWFya2VyfSA9IGJ1aWxkZXIubGF0ZXN0SHVua1dhc0luY2x1ZGVkKCk7XG4gICAgICAgIGNvbnN0IG5ld1N0YXJ0Um93ID0gaHVuay5nZXROZXdTdGFydFJvdygpICsgbmV3Um93RGVsdGE7XG4gICAgICAgIGNvbnN0IG5ld1Jvd0NvdW50ID0gbWFya2VyLmdldFJhbmdlKCkuZ2V0Um93Q291bnQoKSAtIHNlbGVjdGVkRGVsZXRpb25Sb3dDb3VudCAtIG5vTmV3bGluZVJvd0NvdW50O1xuXG4gICAgICAgIGh1bmtzLnB1c2gobmV3IEh1bmsoe1xuICAgICAgICAgIG9sZFN0YXJ0Um93OiBodW5rLmdldE9sZFN0YXJ0Um93KCksXG4gICAgICAgICAgb2xkUm93Q291bnQ6IGh1bmsuZ2V0T2xkUm93Q291bnQoKSxcbiAgICAgICAgICBuZXdTdGFydFJvdyxcbiAgICAgICAgICBuZXdSb3dDb3VudCxcbiAgICAgICAgICBzZWN0aW9uSGVhZGluZzogaHVuay5nZXRTZWN0aW9uSGVhZGluZygpLFxuICAgICAgICAgIG1hcmtlcixcbiAgICAgICAgICByZWdpb25zLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgbmV3Um93RGVsdGEgKz0gbmV3Um93Q291bnQgLSBodW5rLmdldE5ld1Jvd0NvdW50KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdSb3dEZWx0YSArPSBodW5rLmdldE9sZFJvd0NvdW50KCkgLSBodW5rLmdldE5ld1Jvd0NvdW50KCk7XG5cbiAgICAgICAgYnVpbGRlci5sYXRlc3RIdW5rV2FzRGlzY2FyZGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2VyID0gbmV4dFBhdGNoQnVmZmVyLm1hcmtSYW5nZShcbiAgICAgIHRoaXMuY29uc3RydWN0b3IubGF5ZXJOYW1lLFxuICAgICAgW1swLCAwXSwgW25leHRQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRMYXN0Um93KCkgLSAxLCBJbmZpbml0eV1dLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG5cbiAgICBjb25zdCB3aG9sZUZpbGUgPSByb3dTZXQuc2l6ZSA9PT0gdGhpcy5jaGFuZ2VkTGluZUNvdW50O1xuICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJyAmJiAhd2hvbGVGaWxlID8gJ21vZGlmaWVkJyA6IHRoaXMuZ2V0U3RhdHVzKCk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe2h1bmtzLCBzdGF0dXMsIG1hcmtlcn0pO1xuICB9XG5cbiAgYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhvcmlnaW5hbEJ1ZmZlciwgbmV4dFBhdGNoQnVmZmVyLCByb3dTZXQpIHtcbiAgICBjb25zdCBvcmlnaW5hbEJhc2VPZmZzZXQgPSB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCkuc3RhcnQucm93O1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQnVmZmVyQnVpbGRlcihvcmlnaW5hbEJ1ZmZlciwgb3JpZ2luYWxCYXNlT2Zmc2V0LCBuZXh0UGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IGh1bmtzID0gW107XG4gICAgbGV0IG5ld1Jvd0RlbHRhID0gMDtcblxuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmdldEh1bmtzKCkpIHtcbiAgICAgIGxldCBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSBmYWxzZTtcbiAgICAgIGxldCBjb250ZXh0Um93Q291bnQgPSAwO1xuICAgICAgbGV0IGFkZGl0aW9uUm93Q291bnQgPSAwO1xuICAgICAgbGV0IGRlbGV0aW9uUm93Q291bnQgPSAwO1xuXG4gICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBodW5rLmdldFJlZ2lvbnMoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHtpbnRlcnNlY3Rpb24sIGdhcH0gb2YgcmVnaW9uLmludGVyc2VjdFJvd3Mocm93U2V0LCB0cnVlKSkge1xuICAgICAgICAgIHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChnYXApIHtcbiAgICAgICAgICAgICAgICAvLyBVbnNlbGVjdGVkIGFkZGl0aW9uOiBiZWNvbWUgYSBjb250ZXh0IGxpbmUuXG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBVbmNoYW5nZWQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRSb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBhZGRpdGlvbjogYmVjb21lIGEgZGVsZXRpb24uXG4gICAgICAgICAgICAgICAgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIERlbGV0aW9uKTtcbiAgICAgICAgICAgICAgICBkZWxldGlvblJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIE5vbi1zZWxlY3RlZCBkZWxldGlvbjogb21pdCBmcm9tIG5ldyBidWZmZXIuXG4gICAgICAgICAgICAgICAgYnVpbGRlci5yZW1vdmUoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBkZWxldGlvbjogYmVjb21lcyBhbiBhZGRpdGlvblxuICAgICAgICAgICAgICAgIGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBBZGRpdGlvbik7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25Sb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBVbnRvdWNoZWQgY29udGV4dCBsaW5lOiBpbmNsdWRlIGluIG5ldyBwYXRjaC5cbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgVW5jaGFuZ2VkKTtcbiAgICAgICAgICAgICAgY29udGV4dFJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5vbmV3bGluZTogKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBOb25ld2xpbmUgbWFya2VyOiBpbmNsdWRlIGluIG5ldyBwYXRjaC5cbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgTm9OZXdsaW5lKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSkge1xuICAgICAgICAvLyBIdW5rIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBzZWxlY3RlZCBsaW5lXG5cbiAgICAgICAgYnVpbGRlci5tYXJrSHVua1JhbmdlKGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICAgIGNvbnN0IHttYXJrZXIsIHJlZ2lvbnN9ID0gYnVpbGRlci5sYXRlc3RIdW5rV2FzSW5jbHVkZWQoKTtcbiAgICAgICAgaHVua3MucHVzaChuZXcgSHVuayh7XG4gICAgICAgICAgb2xkU3RhcnRSb3c6IGh1bmsuZ2V0TmV3U3RhcnRSb3coKSxcbiAgICAgICAgICBvbGRSb3dDb3VudDogY29udGV4dFJvd0NvdW50ICsgZGVsZXRpb25Sb3dDb3VudCxcbiAgICAgICAgICBuZXdTdGFydFJvdzogaHVuay5nZXROZXdTdGFydFJvdygpICsgbmV3Um93RGVsdGEsXG4gICAgICAgICAgbmV3Um93Q291bnQ6IGNvbnRleHRSb3dDb3VudCArIGFkZGl0aW9uUm93Q291bnQsXG4gICAgICAgICAgc2VjdGlvbkhlYWRpbmc6IGh1bmsuZ2V0U2VjdGlvbkhlYWRpbmcoKSxcbiAgICAgICAgICBtYXJrZXIsXG4gICAgICAgICAgcmVnaW9ucyxcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVpbGRlci5sYXRlc3RIdW5rV2FzRGlzY2FyZGVkKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIChjb250ZXh0Um93Q291bnQgKyBhZGRpdGlvblJvd0NvdW50KSAtIChjb250ZXh0Um93Q291bnQgKyBkZWxldGlvblJvd0NvdW50KVxuICAgICAgbmV3Um93RGVsdGEgKz0gYWRkaXRpb25Sb3dDb3VudCAtIGRlbGV0aW9uUm93Q291bnQ7XG4gICAgfVxuXG4gICAgY29uc3Qgd2hvbGVGaWxlID0gcm93U2V0LnNpemUgPT09IHRoaXMuY2hhbmdlZExpbmVDb3VudDtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy5nZXRTdGF0dXMoKTtcbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2FkZGVkJykge1xuICAgICAgc3RhdHVzID0gd2hvbGVGaWxlID8gJ2RlbGV0ZWQnIDogJ21vZGlmaWVkJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgc3RhdHVzID0gJ2FkZGVkJztcbiAgICB9XG5cbiAgICBjb25zdCBtYXJrZXIgPSBuZXh0UGF0Y2hCdWZmZXIubWFya1JhbmdlKFxuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5sYXllck5hbWUsXG4gICAgICBbWzAsIDBdLCBbbmV4dFBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldExhc3RSb3coKSwgSW5maW5pdHldXSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe2h1bmtzLCBzdGF0dXMsIG1hcmtlcn0pO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpIHtcbiAgICBjb25zdCBmaXJzdEh1bmsgPSB0aGlzLmdldEh1bmtzKClbMF07XG4gICAgaWYgKCFmaXJzdEh1bmspIHtcbiAgICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCAwXV0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0Q2hhbmdlID0gZmlyc3RIdW5rLmdldENoYW5nZXMoKVswXTtcbiAgICBpZiAoIWZpcnN0Q2hhbmdlKSB7XG4gICAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdFJvdyA9IGZpcnN0Q2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCk7XG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1tmaXJzdFJvdywgMF0sIFtmaXJzdFJvdywgSW5maW5pdHldXSk7XG4gIH1cblxuICB0b1N0cmluZ0luKGJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLmdldEh1bmtzKCkucmVkdWNlKChzdHIsIGh1bmspID0+IHN0ciArIGh1bmsudG9TdHJpbmdJbihidWZmZXIpLCAnJyk7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBTdHJpbmcgY29udGFpbmluZyBpbnRlcm5hbCBkaWFnbm9zdGljIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdChvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5kZW50OiAwLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgbGV0IGluZGVudGF0aW9uID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmluZGVudDsgaSsrKSB7XG4gICAgICBpbmRlbnRhdGlvbiArPSAnICc7XG4gICAgfVxuXG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSBgJHtpbmRlbnRhdGlvbn0oUGF0Y2ggbWFya2VyPSR7dGhpcy5tYXJrZXIuaWR9YDtcbiAgICBpZiAodGhpcy5tYXJrZXIuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSAnIFtkZXN0cm95ZWRdJztcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hcmtlci5pc1ZhbGlkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbaW52YWxpZF0nO1xuICAgIH1cbiAgICBpbnNwZWN0U3RyaW5nICs9ICdcXG4nO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmh1bmtzKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGh1bmsuaW5zcGVjdCh7aW5kZW50OiBvcHRpb25zLmluZGVudCArIDJ9KTtcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSBgJHtpbmRlbnRhdGlvbn0pXFxuYDtcbiAgICByZXR1cm4gaW5zcGVjdFN0cmluZztcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldFJlbmRlclN0YXR1cygpIHtcbiAgICByZXR1cm4gRVhQQU5ERUQ7XG4gIH1cbn1cblxuY2xhc3MgSGlkZGVuUGF0Y2ggZXh0ZW5kcyBQYXRjaCB7XG4gIGNvbnN0cnVjdG9yKG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pIHtcbiAgICBzdXBlcih7c3RhdHVzOiBudWxsLCBodW5rczogW10sIG1hcmtlcn0pO1xuXG4gICAgdGhpcy5yZW5kZXJTdGF0dXMgPSByZW5kZXJTdGF0dXM7XG4gICAgdGhpcy5zaG93ID0gc2hvd0ZuO1xuICB9XG5cbiAgZ2V0SW5zZXJ0aW9uUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5lbmQ7XG4gIH1cblxuICBnZXRSZW5kZXJTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdHVzO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtpbmRlbnRhdGlvbn0oSGlkZGVuUGF0Y2ggbWFya2VyPSR7dGhpcy5tYXJrZXIuaWR9KVxcbmA7XG4gIH1cbn1cblxuY2xhc3MgTnVsbFBhdGNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoKTtcbiAgICB0aGlzLm1hcmtlciA9IGJ1ZmZlci5tYXJrUmFuZ2UoW1swLCAwXSwgWzAsIDBdXSk7XG4gIH1cblxuICBnZXRTdGF0dXMoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRNYXJrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgZ2V0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKTtcbiAgfVxuXG4gIGdldFN0YXJ0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDBdXSk7XG4gIH1cblxuICBnZXRIdW5rcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRDaGFuZ2VkTGluZUNvdW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29udGFpbnNSb3coKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0TWF4TGluZU51bWJlcldpZHRoKCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY2xvbmUob3B0cyA9IHt9KSB7XG4gICAgaWYgKFxuICAgICAgb3B0cy5zdGF0dXMgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgb3B0cy5odW5rcyA9PT0gdW5kZWZpbmVkICYmXG4gICAgICBvcHRzLm1hcmtlciA9PT0gdW5kZWZpbmVkICYmXG4gICAgICBvcHRzLnJlbmRlclN0YXR1cyA9PT0gdW5kZWZpbmVkXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBQYXRjaCh7XG4gICAgICAgIHN0YXR1czogb3B0cy5zdGF0dXMgIT09IHVuZGVmaW5lZCA/IG9wdHMuc3RhdHVzIDogdGhpcy5nZXRTdGF0dXMoKSxcbiAgICAgICAgaHVua3M6IG9wdHMuaHVua3MgIT09IHVuZGVmaW5lZCA/IG9wdHMuaHVua3MgOiB0aGlzLmdldEh1bmtzKCksXG4gICAgICAgIG1hcmtlcjogb3B0cy5tYXJrZXIgIT09IHVuZGVmaW5lZCA/IG9wdHMubWFya2VyIDogdGhpcy5nZXRNYXJrZXIoKSxcbiAgICAgICAgcmVuZGVyU3RhdHVzOiBvcHRzLnJlbmRlclN0YXR1cyAhPT0gdW5kZWZpbmVkID8gb3B0cy5yZW5kZXJTdGF0dXMgOiB0aGlzLmdldFJlbmRlclN0YXR1cygpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0U3RhcnRpbmdNYXJrZXJzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldEVuZGluZ01hcmtlcnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpIHtcbiAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKTtcbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMoKSB7fVxuXG4gIHRvU3RyaW5nSW4oKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtpbmRlbnRhdGlvbn0oTnVsbFBhdGNoKVxcbmA7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0UmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiBFWFBBTkRFRDtcbiAgfVxufVxuXG5jbGFzcyBCdWZmZXJCdWlsZGVyIHtcbiAgY29uc3RydWN0b3Iob3JpZ2luYWwsIG9yaWdpbmFsQmFzZU9mZnNldCwgbmV4dFBhdGNoQnVmZmVyKSB7XG4gICAgdGhpcy5vcmlnaW5hbEJ1ZmZlciA9IG9yaWdpbmFsO1xuICAgIHRoaXMubmV4dFBhdGNoQnVmZmVyID0gbmV4dFBhdGNoQnVmZmVyO1xuXG4gICAgLy8gVGhlIHJhbmdlcyBwcm92aWRlZCB0byBidWlsZGVyIG1ldGhvZHMgYXJlIGV4cGVjdGVkIHRvIGJlIHZhbGlkIHdpdGhpbiB0aGUgb3JpZ2luYWwgYnVmZmVyLiBBY2NvdW50IGZvclxuICAgIC8vIHRoZSBwb3NpdGlvbiBvZiB0aGUgUGF0Y2ggd2l0aGluIGl0cyBvcmlnaW5hbCBUZXh0QnVmZmVyLCBhbmQgYW55IGV4aXN0aW5nIGNvbnRlbnQgYWxyZWFkeSBvbiB0aGUgbmV4dFxuICAgIC8vIFRleHRCdWZmZXIuXG4gICAgdGhpcy5vZmZzZXQgPSB0aGlzLm5leHRQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRMYXN0Um93KCkgLSBvcmlnaW5hbEJhc2VPZmZzZXQ7XG5cbiAgICB0aGlzLmh1bmtCdWZmZXJUZXh0ID0gJyc7XG4gICAgdGhpcy5odW5rUm93Q291bnQgPSAwO1xuICAgIHRoaXMuaHVua1N0YXJ0T2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgdGhpcy5odW5rUmVnaW9ucyA9IFtdO1xuICAgIHRoaXMuaHVua1JhbmdlID0gbnVsbDtcblxuICAgIHRoaXMubGFzdE9mZnNldCA9IDA7XG4gIH1cblxuICBhcHBlbmQocmFuZ2UpIHtcbiAgICB0aGlzLmh1bmtCdWZmZXJUZXh0ICs9IHRoaXMub3JpZ2luYWxCdWZmZXIuZ2V0VGV4dEluUmFuZ2UocmFuZ2UpICsgJ1xcbic7XG4gICAgdGhpcy5odW5rUm93Q291bnQgKz0gcmFuZ2UuZ2V0Um93Q291bnQoKTtcbiAgfVxuXG4gIHJlbW92ZShyYW5nZSkge1xuICAgIHRoaXMub2Zmc2V0IC09IHJhbmdlLmdldFJvd0NvdW50KCk7XG4gIH1cblxuICBtYXJrUmVnaW9uKHJhbmdlLCBSZWdpb25LaW5kKSB7XG4gICAgY29uc3QgZmluYWxSYW5nZSA9IHRoaXMub2Zmc2V0ICE9PSAwXG4gICAgICA/IHJhbmdlLnRyYW5zbGF0ZShbdGhpcy5vZmZzZXQsIDBdLCBbdGhpcy5vZmZzZXQsIDBdKVxuICAgICAgOiByYW5nZTtcblxuICAgIC8vIENvbGxhcHNlIGNvbnNlY3V0aXZlIHJhbmdlcyBvZiB0aGUgc2FtZSBSZWdpb25LaW5kIGludG8gb25lIGNvbnRpbnVvdXMgcmVnaW9uLlxuICAgIGNvbnN0IGxhc3RSZWdpb24gPSB0aGlzLmh1bmtSZWdpb25zW3RoaXMuaHVua1JlZ2lvbnMubGVuZ3RoIC0gMV07XG4gICAgaWYgKGxhc3RSZWdpb24gJiYgbGFzdFJlZ2lvbi5SZWdpb25LaW5kID09PSBSZWdpb25LaW5kICYmIGZpbmFsUmFuZ2Uuc3RhcnQucm93IC0gbGFzdFJlZ2lvbi5yYW5nZS5lbmQucm93ID09PSAxKSB7XG4gICAgICBsYXN0UmVnaW9uLnJhbmdlLmVuZCA9IGZpbmFsUmFuZ2UuZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmh1bmtSZWdpb25zLnB1c2goe1JlZ2lvbktpbmQsIHJhbmdlOiBmaW5hbFJhbmdlfSk7XG4gICAgfVxuICB9XG5cbiAgbWFya0h1bmtSYW5nZShyYW5nZSkge1xuICAgIGxldCBmaW5hbFJhbmdlID0gcmFuZ2U7XG4gICAgaWYgKHRoaXMuaHVua1N0YXJ0T2Zmc2V0ICE9PSAwIHx8IHRoaXMub2Zmc2V0ICE9PSAwKSB7XG4gICAgICBmaW5hbFJhbmdlID0gZmluYWxSYW5nZS50cmFuc2xhdGUoW3RoaXMuaHVua1N0YXJ0T2Zmc2V0LCAwXSwgW3RoaXMub2Zmc2V0LCAwXSk7XG4gICAgfVxuICAgIHRoaXMuaHVua1JhbmdlID0gZmluYWxSYW5nZTtcbiAgfVxuXG4gIGxhdGVzdEh1bmtXYXNJbmNsdWRlZCgpIHtcbiAgICB0aGlzLm5leHRQYXRjaEJ1ZmZlci5idWZmZXIuYXBwZW5kKHRoaXMuaHVua0J1ZmZlclRleHQsIHtub3JtYWxpemVMaW5lRW5kaW5nczogZmFsc2V9KTtcblxuICAgIGNvbnN0IHJlZ2lvbnMgPSB0aGlzLmh1bmtSZWdpb25zLm1hcCgoe1JlZ2lvbktpbmQsIHJhbmdlfSkgPT4ge1xuICAgICAgY29uc3QgcmVnaW9uTWFya2VyID0gdGhpcy5uZXh0UGF0Y2hCdWZmZXIubWFya1JhbmdlKFxuICAgICAgICBSZWdpb25LaW5kLmxheWVyTmFtZSxcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3IFJlZ2lvbktpbmQocmVnaW9uTWFya2VyKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubmV4dFBhdGNoQnVmZmVyLm1hcmtSYW5nZSgnaHVuaycsIHRoaXMuaHVua1JhbmdlLCB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0pO1xuXG4gICAgdGhpcy5odW5rQnVmZmVyVGV4dCA9ICcnO1xuICAgIHRoaXMuaHVua1Jvd0NvdW50ID0gMDtcbiAgICB0aGlzLmh1bmtTdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIHRoaXMuaHVua1JlZ2lvbnMgPSBbXTtcbiAgICB0aGlzLmh1bmtSYW5nZSA9IG51bGw7XG5cbiAgICByZXR1cm4ge3JlZ2lvbnMsIG1hcmtlcn07XG4gIH1cblxuICBsYXRlc3RIdW5rV2FzRGlzY2FyZGVkKCkge1xuICAgIHRoaXMub2Zmc2V0IC09IHRoaXMuaHVua1Jvd0NvdW50O1xuXG4gICAgdGhpcy5odW5rQnVmZmVyVGV4dCA9ICcnO1xuICAgIHRoaXMuaHVua1Jvd0NvdW50ID0gMDtcbiAgICB0aGlzLmh1bmtTdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIHRoaXMuaHVua1JlZ2lvbnMgPSBbXTtcbiAgICB0aGlzLmh1bmtSYW5nZSA9IG51bGw7XG5cbiAgICByZXR1cm4ge3JlZ2lvbnM6IFtdLCBtYXJrZXI6IG51bGx9O1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsT0FBQTtBQUVBLElBQUFDLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLE9BQUEsR0FBQUgsT0FBQTtBQUFrRSxTQUFBRSx1QkFBQUUsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFHLFFBQUFDLE1BQUEsRUFBQUMsY0FBQSxRQUFBQyxJQUFBLEdBQUFDLE1BQUEsQ0FBQUQsSUFBQSxDQUFBRixNQUFBLE9BQUFHLE1BQUEsQ0FBQUMscUJBQUEsUUFBQUMsT0FBQSxHQUFBRixNQUFBLENBQUFDLHFCQUFBLENBQUFKLE1BQUEsR0FBQUMsY0FBQSxLQUFBSSxPQUFBLEdBQUFBLE9BQUEsQ0FBQUMsTUFBQSxXQUFBQyxHQUFBLFdBQUFKLE1BQUEsQ0FBQUssd0JBQUEsQ0FBQVIsTUFBQSxFQUFBTyxHQUFBLEVBQUFFLFVBQUEsT0FBQVAsSUFBQSxDQUFBUSxJQUFBLENBQUFDLEtBQUEsQ0FBQVQsSUFBQSxFQUFBRyxPQUFBLFlBQUFILElBQUE7QUFBQSxTQUFBVSxjQUFBQyxNQUFBLGFBQUFDLENBQUEsTUFBQUEsQ0FBQSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsRUFBQUYsQ0FBQSxVQUFBRyxNQUFB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