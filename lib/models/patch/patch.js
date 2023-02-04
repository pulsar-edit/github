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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFWFBBTkRFRCIsInRvU3RyaW5nIiwiaXNWaXNpYmxlIiwiaXNFeHBhbmRhYmxlIiwiQ09MTEFQU0VEIiwiREVGRVJSRUQiLCJSRU1PVkVEIiwiUGF0Y2giLCJjcmVhdGVOdWxsIiwiTnVsbFBhdGNoIiwiY3JlYXRlSGlkZGVuUGF0Y2giLCJtYXJrZXIiLCJyZW5kZXJTdGF0dXMiLCJzaG93Rm4iLCJIaWRkZW5QYXRjaCIsImNvbnN0cnVjdG9yIiwic3RhdHVzIiwiaHVua3MiLCJjaGFuZ2VkTGluZUNvdW50IiwiZ2V0SHVua3MiLCJyZWR1Y2UiLCJhY2MiLCJodW5rIiwiZ2V0U3RhdHVzIiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJnZXRTdGFydFJhbmdlIiwic3RhcnRQb2ludCIsInN0YXJ0IiwiUmFuZ2UiLCJmcm9tT2JqZWN0IiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsImNvbnRhaW5zUm93Iiwicm93IiwiaW50ZXJzZWN0c1JvdyIsImRlc3Ryb3lNYXJrZXJzIiwiZGVzdHJveSIsInVwZGF0ZU1hcmtlcnMiLCJtYXAiLCJnZXQiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJsYXN0SHVuayIsImxlbmd0aCIsImNsb25lIiwib3B0cyIsInVuZGVmaW5lZCIsImdldFN0YXJ0aW5nTWFya2VycyIsIm1hcmtlcnMiLCJmaXJzdEh1bmsiLCJwdXNoIiwiZ2V0UmVnaW9ucyIsImZpcnN0UmVnaW9uIiwiZ2V0RW5kaW5nTWFya2VycyIsImxhc3RSZWdpb24iLCJidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyIsIm9yaWdpbmFsQnVmZmVyIiwibmV4dFBhdGNoQnVmZmVyIiwicm93U2V0Iiwib3JpZ2luYWxCYXNlT2Zmc2V0IiwiYnVpbGRlciIsIkJ1ZmZlckJ1aWxkZXIiLCJuZXdSb3dEZWx0YSIsImF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSIsInNlbGVjdGVkRGVsZXRpb25Sb3dDb3VudCIsIm5vTmV3bGluZVJvd0NvdW50IiwicmVnaW9uIiwiaW50ZXJzZWN0aW9uIiwiZ2FwIiwiaW50ZXJzZWN0Um93cyIsIndoZW4iLCJhZGRpdGlvbiIsInJlbW92ZSIsImFwcGVuZCIsIm1hcmtSZWdpb24iLCJBZGRpdGlvbiIsImRlbGV0aW9uIiwiVW5jaGFuZ2VkIiwiRGVsZXRpb24iLCJnZXRSb3dDb3VudCIsInVuY2hhbmdlZCIsIm5vbmV3bGluZSIsIk5vTmV3bGluZSIsIm1hcmtIdW5rUmFuZ2UiLCJyZWdpb25zIiwibGF0ZXN0SHVua1dhc0luY2x1ZGVkIiwibmV3U3RhcnRSb3ciLCJnZXROZXdTdGFydFJvdyIsIm5ld1Jvd0NvdW50IiwiSHVuayIsIm9sZFN0YXJ0Um93IiwiZ2V0T2xkU3RhcnRSb3ciLCJvbGRSb3dDb3VudCIsImdldE9sZFJvd0NvdW50Iiwic2VjdGlvbkhlYWRpbmciLCJnZXRTZWN0aW9uSGVhZGluZyIsImdldE5ld1Jvd0NvdW50IiwibGF0ZXN0SHVua1dhc0Rpc2NhcmRlZCIsIm1hcmtSYW5nZSIsImxheWVyTmFtZSIsImdldEJ1ZmZlciIsImdldExhc3RSb3ciLCJJbmZpbml0eSIsImludmFsaWRhdGUiLCJleGNsdXNpdmUiLCJ3aG9sZUZpbGUiLCJzaXplIiwiYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImNvbnRleHRSb3dDb3VudCIsImFkZGl0aW9uUm93Q291bnQiLCJkZWxldGlvblJvd0NvdW50IiwiZ2V0Rmlyc3RDaGFuZ2VSYW5nZSIsImZpcnN0Q2hhbmdlIiwiZ2V0Q2hhbmdlcyIsImZpcnN0Um93IiwiZ2V0U3RhcnRCdWZmZXJSb3ciLCJ0b1N0cmluZ0luIiwiYnVmZmVyIiwic3RyIiwiaW5zcGVjdCIsIm9wdGlvbnMiLCJpbmRlbnQiLCJpbmRlbnRhdGlvbiIsImkiLCJpbnNwZWN0U3RyaW5nIiwiaWQiLCJpc0Rlc3Ryb3llZCIsImlzVmFsaWQiLCJpc1ByZXNlbnQiLCJnZXRSZW5kZXJTdGF0dXMiLCJzaG93IiwiZ2V0SW5zZXJ0aW9uUG9pbnQiLCJlbmQiLCJUZXh0QnVmZmVyIiwib3JpZ2luYWwiLCJvZmZzZXQiLCJodW5rQnVmZmVyVGV4dCIsImh1bmtSb3dDb3VudCIsImh1bmtTdGFydE9mZnNldCIsImh1bmtSZWdpb25zIiwiaHVua1JhbmdlIiwibGFzdE9mZnNldCIsInJhbmdlIiwiZ2V0VGV4dEluUmFuZ2UiLCJSZWdpb25LaW5kIiwiZmluYWxSYW5nZSIsInRyYW5zbGF0ZSIsIm5vcm1hbGl6ZUxpbmVFbmRpbmdzIiwicmVnaW9uTWFya2VyIl0sInNvdXJjZXMiOlsicGF0Y2guanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUZXh0QnVmZmVyLCBSYW5nZX0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBIdW5rIGZyb20gJy4vaHVuayc7XG5pbXBvcnQge1VuY2hhbmdlZCwgQWRkaXRpb24sIERlbGV0aW9uLCBOb05ld2xpbmV9IGZyb20gJy4vcmVnaW9uJztcblxuZXhwb3J0IGNvbnN0IEVYUEFOREVEID0ge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0b1N0cmluZygpIHsgcmV0dXJuICdSZW5kZXJTdGF0dXMoZXhwYW5kZWQpJzsgfSxcblxuICBpc1Zpc2libGUoKSB7IHJldHVybiB0cnVlOyB9LFxuXG4gIGlzRXhwYW5kYWJsZSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IENPTExBUFNFRCA9IHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcoKSB7IHJldHVybiAnUmVuZGVyU3RhdHVzKGNvbGxhcHNlZCknOyB9LFxuXG4gIGlzVmlzaWJsZSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuXG4gIGlzRXhwYW5kYWJsZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59O1xuXG5leHBvcnQgY29uc3QgREVGRVJSRUQgPSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gJ1JlbmRlclN0YXR1cyhkZWZlcnJlZCknOyB9LFxuXG4gIGlzVmlzaWJsZSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuXG4gIGlzRXhwYW5kYWJsZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59O1xuXG5leHBvcnQgY29uc3QgUkVNT1ZFRCA9IHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcoKSB7IHJldHVybiAnUmVuZGVyU3RhdHVzKHJlbW92ZWQpJzsgfSxcblxuICBpc1Zpc2libGUoKSB7IHJldHVybiBmYWxzZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiBmYWxzZTsgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGNoIHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdwYXRjaCc7XG5cbiAgc3RhdGljIGNyZWF0ZU51bGwoKSB7XG4gICAgcmV0dXJuIG5ldyBOdWxsUGF0Y2goKTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVIaWRkZW5QYXRjaChtYXJrZXIsIHJlbmRlclN0YXR1cywgc2hvd0ZuKSB7XG4gICAgcmV0dXJuIG5ldyBIaWRkZW5QYXRjaChtYXJrZXIsIHJlbmRlclN0YXR1cywgc2hvd0ZuKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtzdGF0dXMsIGh1bmtzLCBtYXJrZXJ9KSB7XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgdGhpcy5odW5rcyA9IGh1bmtzO1xuICAgIHRoaXMubWFya2VyID0gbWFya2VyO1xuXG4gICAgdGhpcy5jaGFuZ2VkTGluZUNvdW50ID0gdGhpcy5nZXRIdW5rcygpLnJlZHVjZSgoYWNjLCBodW5rKSA9PiBhY2MgKyBodW5rLmNoYW5nZWRMaW5lQ291bnQoKSwgMCk7XG4gIH1cblxuICBnZXRTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzO1xuICB9XG5cbiAgZ2V0TWFya2VyKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcjtcbiAgfVxuXG4gIGdldFJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCk7XG4gIH1cblxuICBnZXRTdGFydFJhbmdlKCkge1xuICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCkuc3RhcnQ7XG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW3N0YXJ0UG9pbnQsIHN0YXJ0UG9pbnRdKTtcbiAgfVxuXG4gIGdldEh1bmtzKCkge1xuICAgIHJldHVybiB0aGlzLmh1bmtzO1xuICB9XG5cbiAgZ2V0Q2hhbmdlZExpbmVDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFuZ2VkTGluZUNvdW50O1xuICB9XG5cbiAgY29udGFpbnNSb3cocm93KSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFJhbmdlKCkuaW50ZXJzZWN0c1Jvdyhyb3cpO1xuICB9XG5cbiAgZGVzdHJveU1hcmtlcnMoKSB7XG4gICAgdGhpcy5tYXJrZXIuZGVzdHJveSgpO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmh1bmtzKSB7XG4gICAgICBodW5rLmRlc3Ryb3lNYXJrZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTWFya2VycyhtYXApIHtcbiAgICB0aGlzLm1hcmtlciA9IG1hcC5nZXQodGhpcy5tYXJrZXIpIHx8IHRoaXMubWFya2VyO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmh1bmtzKSB7XG4gICAgICBodW5rLnVwZGF0ZU1hcmtlcnMobWFwKTtcbiAgICB9XG4gIH1cblxuICBnZXRNYXhMaW5lTnVtYmVyV2lkdGgoKSB7XG4gICAgY29uc3QgbGFzdEh1bmsgPSB0aGlzLmh1bmtzW3RoaXMuaHVua3MubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIGxhc3RIdW5rID8gbGFzdEh1bmsuZ2V0TWF4TGluZU51bWJlcldpZHRoKCkgOiAwO1xuICB9XG5cbiAgY2xvbmUob3B0cyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHtcbiAgICAgIHN0YXR1czogb3B0cy5zdGF0dXMgIT09IHVuZGVmaW5lZCA/IG9wdHMuc3RhdHVzIDogdGhpcy5nZXRTdGF0dXMoKSxcbiAgICAgIGh1bmtzOiBvcHRzLmh1bmtzICE9PSB1bmRlZmluZWQgPyBvcHRzLmh1bmtzIDogdGhpcy5nZXRIdW5rcygpLFxuICAgICAgbWFya2VyOiBvcHRzLm1hcmtlciAhPT0gdW5kZWZpbmVkID8gb3B0cy5tYXJrZXIgOiB0aGlzLmdldE1hcmtlcigpLFxuICAgIH0pO1xuICB9XG5cbiAgLyogUmV0dXJuIHRoZSBzZXQgb2YgTWFya2VycyBvd25lZCBieSB0aGlzIFBhdGNoIHRoYXQgYnV0dCB1cCBhZ2FpbnN0IHRoZSBwYXRjaCdzIGJlZ2lubmluZy4gKi9cbiAgZ2V0U3RhcnRpbmdNYXJrZXJzKCkge1xuICAgIGNvbnN0IG1hcmtlcnMgPSBbdGhpcy5tYXJrZXJdO1xuICAgIGlmICh0aGlzLmh1bmtzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGZpcnN0SHVuayA9IHRoaXMuaHVua3NbMF07XG4gICAgICBtYXJrZXJzLnB1c2goZmlyc3RIdW5rLmdldE1hcmtlcigpKTtcbiAgICAgIGlmIChmaXJzdEh1bmsuZ2V0UmVnaW9ucygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZmlyc3RSZWdpb24gPSBmaXJzdEh1bmsuZ2V0UmVnaW9ucygpWzBdO1xuICAgICAgICBtYXJrZXJzLnB1c2goZmlyc3RSZWdpb24uZ2V0TWFya2VyKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFya2VycztcbiAgfVxuXG4gIC8qIFJldHVybiB0aGUgc2V0IG9mIE1hcmtlcnMgb3duZWQgYnkgdGhpcyBQYXRjaCB0aGF0IGVuZCBhdCB0aGUgcGF0Y2gncyBlbmQgcG9zaXRpb24uICovXG4gIGdldEVuZGluZ01hcmtlcnMoKSB7XG4gICAgY29uc3QgbWFya2VycyA9IFt0aGlzLm1hcmtlcl07XG4gICAgaWYgKHRoaXMuaHVua3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbGFzdEh1bmsgPSB0aGlzLmh1bmtzW3RoaXMuaHVua3MubGVuZ3RoIC0gMV07XG4gICAgICBtYXJrZXJzLnB1c2gobGFzdEh1bmsuZ2V0TWFya2VyKCkpO1xuICAgICAgaWYgKGxhc3RIdW5rLmdldFJlZ2lvbnMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxhc3RSZWdpb24gPSBsYXN0SHVuay5nZXRSZWdpb25zKClbbGFzdEh1bmsuZ2V0UmVnaW9ucygpLmxlbmd0aCAtIDFdO1xuICAgICAgICBtYXJrZXJzLnB1c2gobGFzdFJlZ2lvbi5nZXRNYXJrZXIoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXJrZXJzO1xuICB9XG5cbiAgYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMob3JpZ2luYWxCdWZmZXIsIG5leHRQYXRjaEJ1ZmZlciwgcm93U2V0KSB7XG4gICAgY29uc3Qgb3JpZ2luYWxCYXNlT2Zmc2V0ID0gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLnN0YXJ0LnJvdztcbiAgICBjb25zdCBidWlsZGVyID0gbmV3IEJ1ZmZlckJ1aWxkZXIob3JpZ2luYWxCdWZmZXIsIG9yaWdpbmFsQmFzZU9mZnNldCwgbmV4dFBhdGNoQnVmZmVyKTtcbiAgICBjb25zdCBodW5rcyA9IFtdO1xuXG4gICAgbGV0IG5ld1Jvd0RlbHRhID0gMDtcblxuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmdldEh1bmtzKCkpIHtcbiAgICAgIGxldCBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSBmYWxzZTtcbiAgICAgIGxldCBzZWxlY3RlZERlbGV0aW9uUm93Q291bnQgPSAwO1xuICAgICAgbGV0IG5vTmV3bGluZVJvd0NvdW50ID0gMDtcblxuICAgICAgZm9yIChjb25zdCByZWdpb24gb2YgaHVuay5nZXRSZWdpb25zKCkpIHtcbiAgICAgICAgZm9yIChjb25zdCB7aW50ZXJzZWN0aW9uLCBnYXB9IG9mIHJlZ2lvbi5pbnRlcnNlY3RSb3dzKHJvd1NldCwgdHJ1ZSkpIHtcbiAgICAgICAgICByZWdpb24ud2hlbih7XG4gICAgICAgICAgICBhZGRpdGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgICAgLy8gVW5zZWxlY3RlZCBhZGRpdGlvbjogb21pdCBmcm9tIG5ldyBidWZmZXJcbiAgICAgICAgICAgICAgICBidWlsZGVyLnJlbW92ZShpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdGVkIGFkZGl0aW9uOiBpbmNsdWRlIGluIG5ldyBwYXRjaFxuICAgICAgICAgICAgICAgIGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBBZGRpdGlvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxldGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgICAgLy8gVW5zZWxlY3RlZCBkZWxldGlvbjogY29udmVydCB0byBjb250ZXh0IHJvd1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgVW5jaGFuZ2VkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBkZWxldGlvbjogaW5jbHVkZSBpbiBuZXcgcGF0Y2hcbiAgICAgICAgICAgICAgICBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgRGVsZXRpb24pO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkRGVsZXRpb25Sb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBVbnRvdWNoZWQgY29udGV4dCBsaW5lOiBpbmNsdWRlIGluIG5ldyBwYXRjaFxuICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBVbmNoYW5nZWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5vbmV3bGluZTogKCkgPT4ge1xuICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBOb05ld2xpbmUpO1xuICAgICAgICAgICAgICBub05ld2xpbmVSb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSkge1xuICAgICAgICAvLyBIdW5rIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBzZWxlY3RlZCBsaW5lXG5cbiAgICAgICAgYnVpbGRlci5tYXJrSHVua1JhbmdlKGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICAgIGNvbnN0IHtyZWdpb25zLCBtYXJrZXJ9ID0gYnVpbGRlci5sYXRlc3RIdW5rV2FzSW5jbHVkZWQoKTtcbiAgICAgICAgY29uc3QgbmV3U3RhcnRSb3cgPSBodW5rLmdldE5ld1N0YXJ0Um93KCkgKyBuZXdSb3dEZWx0YTtcbiAgICAgICAgY29uc3QgbmV3Um93Q291bnQgPSBtYXJrZXIuZ2V0UmFuZ2UoKS5nZXRSb3dDb3VudCgpIC0gc2VsZWN0ZWREZWxldGlvblJvd0NvdW50IC0gbm9OZXdsaW5lUm93Q291bnQ7XG5cbiAgICAgICAgaHVua3MucHVzaChuZXcgSHVuayh7XG4gICAgICAgICAgb2xkU3RhcnRSb3c6IGh1bmsuZ2V0T2xkU3RhcnRSb3coKSxcbiAgICAgICAgICBvbGRSb3dDb3VudDogaHVuay5nZXRPbGRSb3dDb3VudCgpLFxuICAgICAgICAgIG5ld1N0YXJ0Um93LFxuICAgICAgICAgIG5ld1Jvd0NvdW50LFxuICAgICAgICAgIHNlY3Rpb25IZWFkaW5nOiBodW5rLmdldFNlY3Rpb25IZWFkaW5nKCksXG4gICAgICAgICAgbWFya2VyLFxuICAgICAgICAgIHJlZ2lvbnMsXG4gICAgICAgIH0pKTtcblxuICAgICAgICBuZXdSb3dEZWx0YSArPSBuZXdSb3dDb3VudCAtIGh1bmsuZ2V0TmV3Um93Q291bnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1Jvd0RlbHRhICs9IGh1bmsuZ2V0T2xkUm93Q291bnQoKSAtIGh1bmsuZ2V0TmV3Um93Q291bnQoKTtcblxuICAgICAgICBidWlsZGVyLmxhdGVzdEh1bmtXYXNEaXNjYXJkZWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYXJrZXIgPSBuZXh0UGF0Y2hCdWZmZXIubWFya1JhbmdlKFxuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5sYXllck5hbWUsXG4gICAgICBbWzAsIDBdLCBbbmV4dFBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldExhc3RSb3coKSAtIDEsIEluZmluaXR5XV0sXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcblxuICAgIGNvbnN0IHdob2xlRmlsZSA9IHJvd1NldC5zaXplID09PSB0aGlzLmNoYW5nZWRMaW5lQ291bnQ7XG4gICAgY29uc3Qgc3RhdHVzID0gdGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2RlbGV0ZWQnICYmICF3aG9sZUZpbGUgPyAnbW9kaWZpZWQnIDogdGhpcy5nZXRTdGF0dXMoKTtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7aHVua3MsIHN0YXR1cywgbWFya2VyfSk7XG4gIH1cblxuICBidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzKG9yaWdpbmFsQnVmZmVyLCBuZXh0UGF0Y2hCdWZmZXIsIHJvd1NldCkge1xuICAgIGNvbnN0IG9yaWdpbmFsQmFzZU9mZnNldCA9IHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5zdGFydC5yb3c7XG4gICAgY29uc3QgYnVpbGRlciA9IG5ldyBCdWZmZXJCdWlsZGVyKG9yaWdpbmFsQnVmZmVyLCBvcmlnaW5hbEJhc2VPZmZzZXQsIG5leHRQYXRjaEJ1ZmZlcik7XG4gICAgY29uc3QgaHVua3MgPSBbXTtcbiAgICBsZXQgbmV3Um93RGVsdGEgPSAwO1xuXG4gICAgZm9yIChjb25zdCBodW5rIG9mIHRoaXMuZ2V0SHVua3MoKSkge1xuICAgICAgbGV0IGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IGZhbHNlO1xuICAgICAgbGV0IGNvbnRleHRSb3dDb3VudCA9IDA7XG4gICAgICBsZXQgYWRkaXRpb25Sb3dDb3VudCA9IDA7XG4gICAgICBsZXQgZGVsZXRpb25Sb3dDb3VudCA9IDA7XG5cbiAgICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIGh1bmsuZ2V0UmVnaW9ucygpKSB7XG4gICAgICAgIGZvciAoY29uc3Qge2ludGVyc2VjdGlvbiwgZ2FwfSBvZiByZWdpb24uaW50ZXJzZWN0Um93cyhyb3dTZXQsIHRydWUpKSB7XG4gICAgICAgICAgcmVnaW9uLndoZW4oe1xuICAgICAgICAgICAgYWRkaXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIFVuc2VsZWN0ZWQgYWRkaXRpb246IGJlY29tZSBhIGNvbnRleHQgbGluZS5cbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIFVuY2hhbmdlZCk7XG4gICAgICAgICAgICAgICAgY29udGV4dFJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdGVkIGFkZGl0aW9uOiBiZWNvbWUgYSBkZWxldGlvbi5cbiAgICAgICAgICAgICAgICBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgRGVsZXRpb24pO1xuICAgICAgICAgICAgICAgIGRlbGV0aW9uUm93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxldGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZ2FwKSB7XG4gICAgICAgICAgICAgICAgLy8gTm9uLXNlbGVjdGVkIGRlbGV0aW9uOiBvbWl0IGZyb20gbmV3IGJ1ZmZlci5cbiAgICAgICAgICAgICAgICBidWlsZGVyLnJlbW92ZShpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdGVkIGRlbGV0aW9uOiBiZWNvbWVzIGFuIGFkZGl0aW9uXG4gICAgICAgICAgICAgICAgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIEFkZGl0aW9uKTtcbiAgICAgICAgICAgICAgICBhZGRpdGlvblJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5jaGFuZ2VkOiAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIFVudG91Y2hlZCBjb250ZXh0IGxpbmU6IGluY2x1ZGUgaW4gbmV3IHBhdGNoLlxuICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBVbmNoYW5nZWQpO1xuICAgICAgICAgICAgICBjb250ZXh0Um93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9uZXdsaW5lOiAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIE5vbmV3bGluZSBtYXJrZXI6IGluY2x1ZGUgaW4gbmV3IHBhdGNoLlxuICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBOb05ld2xpbmUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlKSB7XG4gICAgICAgIC8vIEh1bmsgY29udGFpbnMgYXQgbGVhc3Qgb25lIHNlbGVjdGVkIGxpbmVcblxuICAgICAgICBidWlsZGVyLm1hcmtIdW5rUmFuZ2UoaHVuay5nZXRSYW5nZSgpKTtcbiAgICAgICAgY29uc3Qge21hcmtlciwgcmVnaW9uc30gPSBidWlsZGVyLmxhdGVzdEh1bmtXYXNJbmNsdWRlZCgpO1xuICAgICAgICBodW5rcy5wdXNoKG5ldyBIdW5rKHtcbiAgICAgICAgICBvbGRTdGFydFJvdzogaHVuay5nZXROZXdTdGFydFJvdygpLFxuICAgICAgICAgIG9sZFJvd0NvdW50OiBjb250ZXh0Um93Q291bnQgKyBkZWxldGlvblJvd0NvdW50LFxuICAgICAgICAgIG5ld1N0YXJ0Um93OiBodW5rLmdldE5ld1N0YXJ0Um93KCkgKyBuZXdSb3dEZWx0YSxcbiAgICAgICAgICBuZXdSb3dDb3VudDogY29udGV4dFJvd0NvdW50ICsgYWRkaXRpb25Sb3dDb3VudCxcbiAgICAgICAgICBzZWN0aW9uSGVhZGluZzogaHVuay5nZXRTZWN0aW9uSGVhZGluZygpLFxuICAgICAgICAgIG1hcmtlcixcbiAgICAgICAgICByZWdpb25zLFxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWlsZGVyLmxhdGVzdEh1bmtXYXNEaXNjYXJkZWQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gKGNvbnRleHRSb3dDb3VudCArIGFkZGl0aW9uUm93Q291bnQpIC0gKGNvbnRleHRSb3dDb3VudCArIGRlbGV0aW9uUm93Q291bnQpXG4gICAgICBuZXdSb3dEZWx0YSArPSBhZGRpdGlvblJvd0NvdW50IC0gZGVsZXRpb25Sb3dDb3VudDtcbiAgICB9XG5cbiAgICBjb25zdCB3aG9sZUZpbGUgPSByb3dTZXQuc2l6ZSA9PT0gdGhpcy5jaGFuZ2VkTGluZUNvdW50O1xuICAgIGxldCBzdGF0dXMgPSB0aGlzLmdldFN0YXR1cygpO1xuICAgIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnYWRkZWQnKSB7XG4gICAgICBzdGF0dXMgPSB3aG9sZUZpbGUgPyAnZGVsZXRlZCcgOiAnbW9kaWZpZWQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICBzdGF0dXMgPSAnYWRkZWQnO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcmtlciA9IG5leHRQYXRjaEJ1ZmZlci5tYXJrUmFuZ2UoXG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmxheWVyTmFtZSxcbiAgICAgIFtbMCwgMF0sIFtuZXh0UGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0TGFzdFJvdygpLCBJbmZpbml0eV1dLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7aHVua3MsIHN0YXR1cywgbWFya2VyfSk7XG4gIH1cblxuICBnZXRGaXJzdENoYW5nZVJhbmdlKCkge1xuICAgIGNvbnN0IGZpcnN0SHVuayA9IHRoaXMuZ2V0SHVua3MoKVswXTtcbiAgICBpZiAoIWZpcnN0SHVuaykge1xuICAgICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDBdXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RDaGFuZ2UgPSBmaXJzdEh1bmsuZ2V0Q2hhbmdlcygpWzBdO1xuICAgIGlmICghZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCAwXV0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0Um93ID0gZmlyc3RDaGFuZ2UuZ2V0U3RhcnRCdWZmZXJSb3coKTtcbiAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbW2ZpcnN0Um93LCAwXSwgW2ZpcnN0Um93LCBJbmZpbml0eV1dKTtcbiAgfVxuXG4gIHRvU3RyaW5nSW4oYnVmZmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SHVua3MoKS5yZWR1Y2UoKHN0ciwgaHVuaykgPT4gc3RyICsgaHVuay50b1N0cmluZ0luKGJ1ZmZlciksICcnKTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGludGVybmFsIGRpYWdub3N0aWMgaW5mb3JtYXRpb24uXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpbmRlbnQ6IDAsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICBsZXQgaW5kZW50YXRpb24gPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuaW5kZW50OyBpKyspIHtcbiAgICAgIGluZGVudGF0aW9uICs9ICcgJztcbiAgICB9XG5cbiAgICBsZXQgaW5zcGVjdFN0cmluZyA9IGAke2luZGVudGF0aW9ufShQYXRjaCBtYXJrZXI9JHt0aGlzLm1hcmtlci5pZH1gO1xuICAgIGlmICh0aGlzLm1hcmtlci5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9ICcgW2Rlc3Ryb3llZF0nO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWFya2VyLmlzVmFsaWQoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSAnIFtpbnZhbGlkXSc7XG4gICAgfVxuICAgIGluc3BlY3RTdHJpbmcgKz0gJ1xcbic7XG4gICAgZm9yIChjb25zdCBodW5rIG9mIHRoaXMuaHVua3MpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gaHVuay5pbnNwZWN0KHtpbmRlbnQ6IG9wdGlvbnMuaW5kZW50ICsgMn0pO1xuICAgIH1cbiAgICBpbnNwZWN0U3RyaW5nICs9IGAke2luZGVudGF0aW9ufSlcXG5gO1xuICAgIHJldHVybiBpbnNwZWN0U3RyaW5nO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0UmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiBFWFBBTkRFRDtcbiAgfVxufVxuXG5jbGFzcyBIaWRkZW5QYXRjaCBleHRlbmRzIFBhdGNoIHtcbiAgY29uc3RydWN0b3IobWFya2VyLCByZW5kZXJTdGF0dXMsIHNob3dGbikge1xuICAgIHN1cGVyKHtzdGF0dXM6IG51bGwsIGh1bmtzOiBbXSwgbWFya2VyfSk7XG5cbiAgICB0aGlzLnJlbmRlclN0YXR1cyA9IHJlbmRlclN0YXR1cztcbiAgICB0aGlzLnNob3cgPSBzaG93Rm47XG4gIH1cblxuICBnZXRJbnNlcnRpb25Qb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZSgpLmVuZDtcbiAgfVxuXG4gIGdldFJlbmRlclN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJTdGF0dXM7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBTdHJpbmcgY29udGFpbmluZyBpbnRlcm5hbCBkaWFnbm9zdGljIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdChvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5kZW50OiAwLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgbGV0IGluZGVudGF0aW9uID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmluZGVudDsgaSsrKSB7XG4gICAgICBpbmRlbnRhdGlvbiArPSAnICc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2luZGVudGF0aW9ufShIaWRkZW5QYXRjaCBtYXJrZXI9JHt0aGlzLm1hcmtlci5pZH0pXFxuYDtcbiAgfVxufVxuXG5jbGFzcyBOdWxsUGF0Y2gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcigpO1xuICAgIHRoaXMubWFya2VyID0gYnVmZmVyLm1hcmtSYW5nZShbWzAsIDBdLCBbMCwgMF1dKTtcbiAgfVxuXG4gIGdldFN0YXR1cygpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldE1hcmtlcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICBnZXRSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0U3RhcnRSYW5nZSgpIHtcbiAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKTtcbiAgfVxuXG4gIGdldEh1bmtzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldENoYW5nZWRMaW5lQ291bnQoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb250YWluc1JvdygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRNYXhMaW5lTnVtYmVyV2lkdGgoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjbG9uZShvcHRzID0ge30pIHtcbiAgICBpZiAoXG4gICAgICBvcHRzLnN0YXR1cyA9PT0gdW5kZWZpbmVkICYmXG4gICAgICBvcHRzLmh1bmtzID09PSB1bmRlZmluZWQgJiZcbiAgICAgIG9wdHMubWFya2VyID09PSB1bmRlZmluZWQgJiZcbiAgICAgIG9wdHMucmVuZGVyU3RhdHVzID09PSB1bmRlZmluZWRcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFBhdGNoKHtcbiAgICAgICAgc3RhdHVzOiBvcHRzLnN0YXR1cyAhPT0gdW5kZWZpbmVkID8gb3B0cy5zdGF0dXMgOiB0aGlzLmdldFN0YXR1cygpLFxuICAgICAgICBodW5rczogb3B0cy5odW5rcyAhPT0gdW5kZWZpbmVkID8gb3B0cy5odW5rcyA6IHRoaXMuZ2V0SHVua3MoKSxcbiAgICAgICAgbWFya2VyOiBvcHRzLm1hcmtlciAhPT0gdW5kZWZpbmVkID8gb3B0cy5tYXJrZXIgOiB0aGlzLmdldE1hcmtlcigpLFxuICAgICAgICByZW5kZXJTdGF0dXM6IG9wdHMucmVuZGVyU3RhdHVzICE9PSB1bmRlZmluZWQgPyBvcHRzLnJlbmRlclN0YXR1cyA6IHRoaXMuZ2V0UmVuZGVyU3RhdHVzKCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRTdGFydGluZ01hcmtlcnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0RW5kaW5nTWFya2VycygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcygpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRGaXJzdENoYW5nZVJhbmdlKCkge1xuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCAwXV0pO1xuICB9XG5cbiAgdXBkYXRlTWFya2VycygpIHt9XG5cbiAgdG9TdHJpbmdJbigpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBTdHJpbmcgY29udGFpbmluZyBpbnRlcm5hbCBkaWFnbm9zdGljIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdChvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5kZW50OiAwLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgbGV0IGluZGVudGF0aW9uID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmluZGVudDsgaSsrKSB7XG4gICAgICBpbmRlbnRhdGlvbiArPSAnICc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2luZGVudGF0aW9ufShOdWxsUGF0Y2gpXFxuYDtcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRSZW5kZXJTdGF0dXMoKSB7XG4gICAgcmV0dXJuIEVYUEFOREVEO1xuICB9XG59XG5cbmNsYXNzIEJ1ZmZlckJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihvcmlnaW5hbCwgb3JpZ2luYWxCYXNlT2Zmc2V0LCBuZXh0UGF0Y2hCdWZmZXIpIHtcbiAgICB0aGlzLm9yaWdpbmFsQnVmZmVyID0gb3JpZ2luYWw7XG4gICAgdGhpcy5uZXh0UGF0Y2hCdWZmZXIgPSBuZXh0UGF0Y2hCdWZmZXI7XG5cbiAgICAvLyBUaGUgcmFuZ2VzIHByb3ZpZGVkIHRvIGJ1aWxkZXIgbWV0aG9kcyBhcmUgZXhwZWN0ZWQgdG8gYmUgdmFsaWQgd2l0aGluIHRoZSBvcmlnaW5hbCBidWZmZXIuIEFjY291bnQgZm9yXG4gICAgLy8gdGhlIHBvc2l0aW9uIG9mIHRoZSBQYXRjaCB3aXRoaW4gaXRzIG9yaWdpbmFsIFRleHRCdWZmZXIsIGFuZCBhbnkgZXhpc3RpbmcgY29udGVudCBhbHJlYWR5IG9uIHRoZSBuZXh0XG4gICAgLy8gVGV4dEJ1ZmZlci5cbiAgICB0aGlzLm9mZnNldCA9IHRoaXMubmV4dFBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldExhc3RSb3coKSAtIG9yaWdpbmFsQmFzZU9mZnNldDtcblxuICAgIHRoaXMuaHVua0J1ZmZlclRleHQgPSAnJztcbiAgICB0aGlzLmh1bmtSb3dDb3VudCA9IDA7XG4gICAgdGhpcy5odW5rU3RhcnRPZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICB0aGlzLmh1bmtSZWdpb25zID0gW107XG4gICAgdGhpcy5odW5rUmFuZ2UgPSBudWxsO1xuXG4gICAgdGhpcy5sYXN0T2Zmc2V0ID0gMDtcbiAgfVxuXG4gIGFwcGVuZChyYW5nZSkge1xuICAgIHRoaXMuaHVua0J1ZmZlclRleHQgKz0gdGhpcy5vcmlnaW5hbEJ1ZmZlci5nZXRUZXh0SW5SYW5nZShyYW5nZSkgKyAnXFxuJztcbiAgICB0aGlzLmh1bmtSb3dDb3VudCArPSByYW5nZS5nZXRSb3dDb3VudCgpO1xuICB9XG5cbiAgcmVtb3ZlKHJhbmdlKSB7XG4gICAgdGhpcy5vZmZzZXQgLT0gcmFuZ2UuZ2V0Um93Q291bnQoKTtcbiAgfVxuXG4gIG1hcmtSZWdpb24ocmFuZ2UsIFJlZ2lvbktpbmQpIHtcbiAgICBjb25zdCBmaW5hbFJhbmdlID0gdGhpcy5vZmZzZXQgIT09IDBcbiAgICAgID8gcmFuZ2UudHJhbnNsYXRlKFt0aGlzLm9mZnNldCwgMF0sIFt0aGlzLm9mZnNldCwgMF0pXG4gICAgICA6IHJhbmdlO1xuXG4gICAgLy8gQ29sbGFwc2UgY29uc2VjdXRpdmUgcmFuZ2VzIG9mIHRoZSBzYW1lIFJlZ2lvbktpbmQgaW50byBvbmUgY29udGludW91cyByZWdpb24uXG4gICAgY29uc3QgbGFzdFJlZ2lvbiA9IHRoaXMuaHVua1JlZ2lvbnNbdGhpcy5odW5rUmVnaW9ucy5sZW5ndGggLSAxXTtcbiAgICBpZiAobGFzdFJlZ2lvbiAmJiBsYXN0UmVnaW9uLlJlZ2lvbktpbmQgPT09IFJlZ2lvbktpbmQgJiYgZmluYWxSYW5nZS5zdGFydC5yb3cgLSBsYXN0UmVnaW9uLnJhbmdlLmVuZC5yb3cgPT09IDEpIHtcbiAgICAgIGxhc3RSZWdpb24ucmFuZ2UuZW5kID0gZmluYWxSYW5nZS5lbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaHVua1JlZ2lvbnMucHVzaCh7UmVnaW9uS2luZCwgcmFuZ2U6IGZpbmFsUmFuZ2V9KTtcbiAgICB9XG4gIH1cblxuICBtYXJrSHVua1JhbmdlKHJhbmdlKSB7XG4gICAgbGV0IGZpbmFsUmFuZ2UgPSByYW5nZTtcbiAgICBpZiAodGhpcy5odW5rU3RhcnRPZmZzZXQgIT09IDAgfHwgdGhpcy5vZmZzZXQgIT09IDApIHtcbiAgICAgIGZpbmFsUmFuZ2UgPSBmaW5hbFJhbmdlLnRyYW5zbGF0ZShbdGhpcy5odW5rU3RhcnRPZmZzZXQsIDBdLCBbdGhpcy5vZmZzZXQsIDBdKTtcbiAgICB9XG4gICAgdGhpcy5odW5rUmFuZ2UgPSBmaW5hbFJhbmdlO1xuICB9XG5cbiAgbGF0ZXN0SHVua1dhc0luY2x1ZGVkKCkge1xuICAgIHRoaXMubmV4dFBhdGNoQnVmZmVyLmJ1ZmZlci5hcHBlbmQodGhpcy5odW5rQnVmZmVyVGV4dCwge25vcm1hbGl6ZUxpbmVFbmRpbmdzOiBmYWxzZX0pO1xuXG4gICAgY29uc3QgcmVnaW9ucyA9IHRoaXMuaHVua1JlZ2lvbnMubWFwKCh7UmVnaW9uS2luZCwgcmFuZ2V9KSA9PiB7XG4gICAgICBjb25zdCByZWdpb25NYXJrZXIgPSB0aGlzLm5leHRQYXRjaEJ1ZmZlci5tYXJrUmFuZ2UoXG4gICAgICAgIFJlZ2lvbktpbmQubGF5ZXJOYW1lLFxuICAgICAgICByYW5nZSxcbiAgICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgUmVnaW9uS2luZChyZWdpb25NYXJrZXIpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbWFya2VyID0gdGhpcy5uZXh0UGF0Y2hCdWZmZXIubWFya1JhbmdlKCdodW5rJywgdGhpcy5odW5rUmFuZ2UsIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSk7XG5cbiAgICB0aGlzLmh1bmtCdWZmZXJUZXh0ID0gJyc7XG4gICAgdGhpcy5odW5rUm93Q291bnQgPSAwO1xuICAgIHRoaXMuaHVua1N0YXJ0T2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgdGhpcy5odW5rUmVnaW9ucyA9IFtdO1xuICAgIHRoaXMuaHVua1JhbmdlID0gbnVsbDtcblxuICAgIHJldHVybiB7cmVnaW9ucywgbWFya2VyfTtcbiAgfVxuXG4gIGxhdGVzdEh1bmtXYXNEaXNjYXJkZWQoKSB7XG4gICAgdGhpcy5vZmZzZXQgLT0gdGhpcy5odW5rUm93Q291bnQ7XG5cbiAgICB0aGlzLmh1bmtCdWZmZXJUZXh0ID0gJyc7XG4gICAgdGhpcy5odW5rUm93Q291bnQgPSAwO1xuICAgIHRoaXMuaHVua1N0YXJ0T2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgdGhpcy5odW5rUmVnaW9ucyA9IFtdO1xuICAgIHRoaXMuaHVua1JhbmdlID0gbnVsbDtcblxuICAgIHJldHVybiB7cmVnaW9uczogW10sIG1hcmtlcjogbnVsbH07XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFQTtBQUNBO0FBQWtFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUUzRCxNQUFNQSxRQUFRLEdBQUc7RUFDdEI7RUFDQUMsUUFBUSxHQUFHO0lBQUUsT0FBTyx3QkFBd0I7RUFBRSxDQUFDO0VBRS9DQyxTQUFTLEdBQUc7SUFBRSxPQUFPLElBQUk7RUFBRSxDQUFDO0VBRTVCQyxZQUFZLEdBQUc7SUFBRSxPQUFPLEtBQUs7RUFBRTtBQUNqQyxDQUFDO0FBQUM7QUFFSyxNQUFNQyxTQUFTLEdBQUc7RUFDdkI7RUFDQUgsUUFBUSxHQUFHO0lBQUUsT0FBTyx5QkFBeUI7RUFBRSxDQUFDO0VBRWhEQyxTQUFTLEdBQUc7SUFBRSxPQUFPLEtBQUs7RUFBRSxDQUFDO0VBRTdCQyxZQUFZLEdBQUc7SUFBRSxPQUFPLElBQUk7RUFBRTtBQUNoQyxDQUFDO0FBQUM7QUFFSyxNQUFNRSxRQUFRLEdBQUc7RUFDdEI7RUFDQUosUUFBUSxHQUFHO0lBQUUsT0FBTyx3QkFBd0I7RUFBRSxDQUFDO0VBRS9DQyxTQUFTLEdBQUc7SUFBRSxPQUFPLEtBQUs7RUFBRSxDQUFDO0VBRTdCQyxZQUFZLEdBQUc7SUFBRSxPQUFPLElBQUk7RUFBRTtBQUNoQyxDQUFDO0FBQUM7QUFFSyxNQUFNRyxPQUFPLEdBQUc7RUFDckI7RUFDQUwsUUFBUSxHQUFHO0lBQUUsT0FBTyx1QkFBdUI7RUFBRSxDQUFDO0VBRTlDQyxTQUFTLEdBQUc7SUFBRSxPQUFPLEtBQUs7RUFBRSxDQUFDO0VBRTdCQyxZQUFZLEdBQUc7SUFBRSxPQUFPLEtBQUs7RUFBRTtBQUNqQyxDQUFDO0FBQUM7QUFFYSxNQUFNSSxLQUFLLENBQUM7RUFHekIsT0FBT0MsVUFBVSxHQUFHO0lBQ2xCLE9BQU8sSUFBSUMsU0FBUyxFQUFFO0VBQ3hCO0VBRUEsT0FBT0MsaUJBQWlCLENBQUNDLE1BQU0sRUFBRUMsWUFBWSxFQUFFQyxNQUFNLEVBQUU7SUFDckQsT0FBTyxJQUFJQyxXQUFXLENBQUNILE1BQU0sRUFBRUMsWUFBWSxFQUFFQyxNQUFNLENBQUM7RUFDdEQ7RUFFQUUsV0FBVyxDQUFDO0lBQUNDLE1BQU07SUFBRUMsS0FBSztJQUFFTjtFQUFNLENBQUMsRUFBRTtJQUNuQyxJQUFJLENBQUNLLE1BQU0sR0FBR0EsTUFBTTtJQUNwQixJQUFJLENBQUNDLEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNOLE1BQU0sR0FBR0EsTUFBTTtJQUVwQixJQUFJLENBQUNPLGdCQUFnQixHQUFHLElBQUksQ0FBQ0MsUUFBUSxFQUFFLENBQUNDLE1BQU0sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLElBQUksS0FBS0QsR0FBRyxHQUFHQyxJQUFJLENBQUNKLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ2pHO0VBRUFLLFNBQVMsR0FBRztJQUNWLE9BQU8sSUFBSSxDQUFDUCxNQUFNO0VBQ3BCO0VBRUFRLFNBQVMsR0FBRztJQUNWLE9BQU8sSUFBSSxDQUFDYixNQUFNO0VBQ3BCO0VBRUFjLFFBQVEsR0FBRztJQUNULE9BQU8sSUFBSSxDQUFDRCxTQUFTLEVBQUUsQ0FBQ0MsUUFBUSxFQUFFO0VBQ3BDO0VBRUFDLGFBQWEsR0FBRztJQUNkLE1BQU1DLFVBQVUsR0FBRyxJQUFJLENBQUNILFNBQVMsRUFBRSxDQUFDQyxRQUFRLEVBQUUsQ0FBQ0csS0FBSztJQUNwRCxPQUFPQyxXQUFLLENBQUNDLFVBQVUsQ0FBQyxDQUFDSCxVQUFVLEVBQUVBLFVBQVUsQ0FBQyxDQUFDO0VBQ25EO0VBRUFSLFFBQVEsR0FBRztJQUNULE9BQU8sSUFBSSxDQUFDRixLQUFLO0VBQ25CO0VBRUFjLG1CQUFtQixHQUFHO0lBQ3BCLE9BQU8sSUFBSSxDQUFDYixnQkFBZ0I7RUFDOUI7RUFFQWMsV0FBVyxDQUFDQyxHQUFHLEVBQUU7SUFDZixPQUFPLElBQUksQ0FBQ3RCLE1BQU0sQ0FBQ2MsUUFBUSxFQUFFLENBQUNTLGFBQWEsQ0FBQ0QsR0FBRyxDQUFDO0VBQ2xEO0VBRUFFLGNBQWMsR0FBRztJQUNmLElBQUksQ0FBQ3hCLE1BQU0sQ0FBQ3lCLE9BQU8sRUFBRTtJQUNyQixLQUFLLE1BQU1kLElBQUksSUFBSSxJQUFJLENBQUNMLEtBQUssRUFBRTtNQUM3QkssSUFBSSxDQUFDYSxjQUFjLEVBQUU7SUFDdkI7RUFDRjtFQUVBRSxhQUFhLENBQUNDLEdBQUcsRUFBRTtJQUNqQixJQUFJLENBQUMzQixNQUFNLEdBQUcyQixHQUFHLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUM1QixNQUFNLENBQUMsSUFBSSxJQUFJLENBQUNBLE1BQU07SUFDakQsS0FBSyxNQUFNVyxJQUFJLElBQUksSUFBSSxDQUFDTCxLQUFLLEVBQUU7TUFDN0JLLElBQUksQ0FBQ2UsYUFBYSxDQUFDQyxHQUFHLENBQUM7SUFDekI7RUFDRjtFQUVBRSxxQkFBcUIsR0FBRztJQUN0QixNQUFNQyxRQUFRLEdBQUcsSUFBSSxDQUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQ0EsS0FBSyxDQUFDeUIsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNsRCxPQUFPRCxRQUFRLEdBQUdBLFFBQVEsQ0FBQ0QscUJBQXFCLEVBQUUsR0FBRyxDQUFDO0VBQ3hEO0VBRUFHLEtBQUssQ0FBQ0MsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ2YsT0FBTyxJQUFJLElBQUksQ0FBQzdCLFdBQVcsQ0FBQztNQUMxQkMsTUFBTSxFQUFFNEIsSUFBSSxDQUFDNUIsTUFBTSxLQUFLNkIsU0FBUyxHQUFHRCxJQUFJLENBQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDTyxTQUFTLEVBQUU7TUFDbEVOLEtBQUssRUFBRTJCLElBQUksQ0FBQzNCLEtBQUssS0FBSzRCLFNBQVMsR0FBR0QsSUFBSSxDQUFDM0IsS0FBSyxHQUFHLElBQUksQ0FBQ0UsUUFBUSxFQUFFO01BQzlEUixNQUFNLEVBQUVpQyxJQUFJLENBQUNqQyxNQUFNLEtBQUtrQyxTQUFTLEdBQUdELElBQUksQ0FBQ2pDLE1BQU0sR0FBRyxJQUFJLENBQUNhLFNBQVM7SUFDbEUsQ0FBQyxDQUFDO0VBQ0o7O0VBRUE7RUFDQXNCLGtCQUFrQixHQUFHO0lBQ25CLE1BQU1DLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQ3BDLE1BQU0sQ0FBQztJQUM3QixJQUFJLElBQUksQ0FBQ00sS0FBSyxDQUFDeUIsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUN6QixNQUFNTSxTQUFTLEdBQUcsSUFBSSxDQUFDL0IsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUMvQjhCLE9BQU8sQ0FBQ0UsSUFBSSxDQUFDRCxTQUFTLENBQUN4QixTQUFTLEVBQUUsQ0FBQztNQUNuQyxJQUFJd0IsU0FBUyxDQUFDRSxVQUFVLEVBQUUsQ0FBQ1IsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNyQyxNQUFNUyxXQUFXLEdBQUdILFNBQVMsQ0FBQ0UsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdDSCxPQUFPLENBQUNFLElBQUksQ0FBQ0UsV0FBVyxDQUFDM0IsU0FBUyxFQUFFLENBQUM7TUFDdkM7SUFDRjtJQUNBLE9BQU91QixPQUFPO0VBQ2hCOztFQUVBO0VBQ0FLLGdCQUFnQixHQUFHO0lBQ2pCLE1BQU1MLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQ3BDLE1BQU0sQ0FBQztJQUM3QixJQUFJLElBQUksQ0FBQ00sS0FBSyxDQUFDeUIsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUN6QixNQUFNRCxRQUFRLEdBQUcsSUFBSSxDQUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQ0EsS0FBSyxDQUFDeUIsTUFBTSxHQUFHLENBQUMsQ0FBQztNQUNsREssT0FBTyxDQUFDRSxJQUFJLENBQUNSLFFBQVEsQ0FBQ2pCLFNBQVMsRUFBRSxDQUFDO01BQ2xDLElBQUlpQixRQUFRLENBQUNTLFVBQVUsRUFBRSxDQUFDUixNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3BDLE1BQU1XLFVBQVUsR0FBR1osUUFBUSxDQUFDUyxVQUFVLEVBQUUsQ0FBQ1QsUUFBUSxDQUFDUyxVQUFVLEVBQUUsQ0FBQ1IsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMxRUssT0FBTyxDQUFDRSxJQUFJLENBQUNJLFVBQVUsQ0FBQzdCLFNBQVMsRUFBRSxDQUFDO01BQ3RDO0lBQ0Y7SUFDQSxPQUFPdUIsT0FBTztFQUNoQjtFQUVBTyx1QkFBdUIsQ0FBQ0MsY0FBYyxFQUFFQyxlQUFlLEVBQUVDLE1BQU0sRUFBRTtJQUMvRCxNQUFNQyxrQkFBa0IsR0FBRyxJQUFJLENBQUNsQyxTQUFTLEVBQUUsQ0FBQ0MsUUFBUSxFQUFFLENBQUNHLEtBQUssQ0FBQ0ssR0FBRztJQUNoRSxNQUFNMEIsT0FBTyxHQUFHLElBQUlDLGFBQWEsQ0FBQ0wsY0FBYyxFQUFFRyxrQkFBa0IsRUFBRUYsZUFBZSxDQUFDO0lBQ3RGLE1BQU12QyxLQUFLLEdBQUcsRUFBRTtJQUVoQixJQUFJNEMsV0FBVyxHQUFHLENBQUM7SUFFbkIsS0FBSyxNQUFNdkMsSUFBSSxJQUFJLElBQUksQ0FBQ0gsUUFBUSxFQUFFLEVBQUU7TUFDbEMsSUFBSTJDLHdCQUF3QixHQUFHLEtBQUs7TUFDcEMsSUFBSUMsd0JBQXdCLEdBQUcsQ0FBQztNQUNoQyxJQUFJQyxpQkFBaUIsR0FBRyxDQUFDO01BRXpCLEtBQUssTUFBTUMsTUFBTSxJQUFJM0MsSUFBSSxDQUFDNEIsVUFBVSxFQUFFLEVBQUU7UUFDdEMsS0FBSyxNQUFNO1VBQUNnQixZQUFZO1VBQUVDO1FBQUcsQ0FBQyxJQUFJRixNQUFNLENBQUNHLGFBQWEsQ0FBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1VBQ3BFUSxNQUFNLENBQUNJLElBQUksQ0FBQztZQUNWQyxRQUFRLEVBQUUsTUFBTTtjQUNkLElBQUlILEdBQUcsRUFBRTtnQkFDUDtnQkFDQVIsT0FBTyxDQUFDWSxNQUFNLENBQUNMLFlBQVksQ0FBQztjQUM5QixDQUFDLE1BQU07Z0JBQ0w7Z0JBQ0FKLHdCQUF3QixHQUFHLElBQUk7Z0JBQy9CSCxPQUFPLENBQUNhLE1BQU0sQ0FBQ04sWUFBWSxDQUFDO2dCQUM1QlAsT0FBTyxDQUFDYyxVQUFVLENBQUNQLFlBQVksRUFBRVEsZ0JBQVEsQ0FBQztjQUM1QztZQUNGLENBQUM7WUFDREMsUUFBUSxFQUFFLE1BQU07Y0FDZCxJQUFJUixHQUFHLEVBQUU7Z0JBQ1A7Z0JBQ0FSLE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Z0JBQzVCUCxPQUFPLENBQUNjLFVBQVUsQ0FBQ1AsWUFBWSxFQUFFVSxpQkFBUyxDQUFDO2NBQzdDLENBQUMsTUFBTTtnQkFDTDtnQkFDQWQsd0JBQXdCLEdBQUcsSUFBSTtnQkFDL0JILE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Z0JBQzVCUCxPQUFPLENBQUNjLFVBQVUsQ0FBQ1AsWUFBWSxFQUFFVyxnQkFBUSxDQUFDO2dCQUMxQ2Qsd0JBQXdCLElBQUlHLFlBQVksQ0FBQ1ksV0FBVyxFQUFFO2NBQ3hEO1lBQ0YsQ0FBQztZQUNEQyxTQUFTLEVBQUUsTUFBTTtjQUNmO2NBQ0FwQixPQUFPLENBQUNhLE1BQU0sQ0FBQ04sWUFBWSxDQUFDO2NBQzVCUCxPQUFPLENBQUNjLFVBQVUsQ0FBQ1AsWUFBWSxFQUFFVSxpQkFBUyxDQUFDO1lBQzdDLENBQUM7WUFDREksU0FBUyxFQUFFLE1BQU07Y0FDZnJCLE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Y0FDNUJQLE9BQU8sQ0FBQ2MsVUFBVSxDQUFDUCxZQUFZLEVBQUVlLGlCQUFTLENBQUM7Y0FDM0NqQixpQkFBaUIsSUFBSUUsWUFBWSxDQUFDWSxXQUFXLEVBQUU7WUFDakQ7VUFDRixDQUFDLENBQUM7UUFDSjtNQUNGO01BRUEsSUFBSWhCLHdCQUF3QixFQUFFO1FBQzVCOztRQUVBSCxPQUFPLENBQUN1QixhQUFhLENBQUM1RCxJQUFJLENBQUNHLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU07VUFBQzBELE9BQU87VUFBRXhFO1FBQU0sQ0FBQyxHQUFHZ0QsT0FBTyxDQUFDeUIscUJBQXFCLEVBQUU7UUFDekQsTUFBTUMsV0FBVyxHQUFHL0QsSUFBSSxDQUFDZ0UsY0FBYyxFQUFFLEdBQUd6QixXQUFXO1FBQ3ZELE1BQU0wQixXQUFXLEdBQUc1RSxNQUFNLENBQUNjLFFBQVEsRUFBRSxDQUFDcUQsV0FBVyxFQUFFLEdBQUdmLHdCQUF3QixHQUFHQyxpQkFBaUI7UUFFbEcvQyxLQUFLLENBQUNnQyxJQUFJLENBQUMsSUFBSXVDLGFBQUksQ0FBQztVQUNsQkMsV0FBVyxFQUFFbkUsSUFBSSxDQUFDb0UsY0FBYyxFQUFFO1VBQ2xDQyxXQUFXLEVBQUVyRSxJQUFJLENBQUNzRSxjQUFjLEVBQUU7VUFDbENQLFdBQVc7VUFDWEUsV0FBVztVQUNYTSxjQUFjLEVBQUV2RSxJQUFJLENBQUN3RSxpQkFBaUIsRUFBRTtVQUN4Q25GLE1BQU07VUFDTndFO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSHRCLFdBQVcsSUFBSTBCLFdBQVcsR0FBR2pFLElBQUksQ0FBQ3lFLGNBQWMsRUFBRTtNQUNwRCxDQUFDLE1BQU07UUFDTGxDLFdBQVcsSUFBSXZDLElBQUksQ0FBQ3NFLGNBQWMsRUFBRSxHQUFHdEUsSUFBSSxDQUFDeUUsY0FBYyxFQUFFO1FBRTVEcEMsT0FBTyxDQUFDcUMsc0JBQXNCLEVBQUU7TUFDbEM7SUFDRjtJQUVBLE1BQU1yRixNQUFNLEdBQUc2QyxlQUFlLENBQUN5QyxTQUFTLENBQ3RDLElBQUksQ0FBQ2xGLFdBQVcsQ0FBQ21GLFNBQVMsRUFDMUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDMUMsZUFBZSxDQUFDMkMsU0FBUyxFQUFFLENBQUNDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRUMsUUFBUSxDQUFDLENBQUMsRUFDbEU7TUFBQ0MsVUFBVSxFQUFFLE9BQU87TUFBRUMsU0FBUyxFQUFFO0lBQUssQ0FBQyxDQUN4QztJQUVELE1BQU1DLFNBQVMsR0FBRy9DLE1BQU0sQ0FBQ2dELElBQUksS0FBSyxJQUFJLENBQUN2RixnQkFBZ0I7SUFDdkQsTUFBTUYsTUFBTSxHQUFHLElBQUksQ0FBQ08sU0FBUyxFQUFFLEtBQUssU0FBUyxJQUFJLENBQUNpRixTQUFTLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQ2pGLFNBQVMsRUFBRTtJQUMzRixPQUFPLElBQUksQ0FBQ29CLEtBQUssQ0FBQztNQUFDMUIsS0FBSztNQUFFRCxNQUFNO01BQUVMO0lBQU0sQ0FBQyxDQUFDO0VBQzVDO0VBRUErRix5QkFBeUIsQ0FBQ25ELGNBQWMsRUFBRUMsZUFBZSxFQUFFQyxNQUFNLEVBQUU7SUFDakUsTUFBTUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDbEMsU0FBUyxFQUFFLENBQUNDLFFBQVEsRUFBRSxDQUFDRyxLQUFLLENBQUNLLEdBQUc7SUFDaEUsTUFBTTBCLE9BQU8sR0FBRyxJQUFJQyxhQUFhLENBQUNMLGNBQWMsRUFBRUcsa0JBQWtCLEVBQUVGLGVBQWUsQ0FBQztJQUN0RixNQUFNdkMsS0FBSyxHQUFHLEVBQUU7SUFDaEIsSUFBSTRDLFdBQVcsR0FBRyxDQUFDO0lBRW5CLEtBQUssTUFBTXZDLElBQUksSUFBSSxJQUFJLENBQUNILFFBQVEsRUFBRSxFQUFFO01BQ2xDLElBQUkyQyx3QkFBd0IsR0FBRyxLQUFLO01BQ3BDLElBQUk2QyxlQUFlLEdBQUcsQ0FBQztNQUN2QixJQUFJQyxnQkFBZ0IsR0FBRyxDQUFDO01BQ3hCLElBQUlDLGdCQUFnQixHQUFHLENBQUM7TUFFeEIsS0FBSyxNQUFNNUMsTUFBTSxJQUFJM0MsSUFBSSxDQUFDNEIsVUFBVSxFQUFFLEVBQUU7UUFDdEMsS0FBSyxNQUFNO1VBQUNnQixZQUFZO1VBQUVDO1FBQUcsQ0FBQyxJQUFJRixNQUFNLENBQUNHLGFBQWEsQ0FBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1VBQ3BFUSxNQUFNLENBQUNJLElBQUksQ0FBQztZQUNWQyxRQUFRLEVBQUUsTUFBTTtjQUNkLElBQUlILEdBQUcsRUFBRTtnQkFDUDtnQkFDQVIsT0FBTyxDQUFDYSxNQUFNLENBQUNOLFlBQVksQ0FBQztnQkFDNUJQLE9BQU8sQ0FBQ2MsVUFBVSxDQUFDUCxZQUFZLEVBQUVVLGlCQUFTLENBQUM7Z0JBQzNDK0IsZUFBZSxJQUFJekMsWUFBWSxDQUFDWSxXQUFXLEVBQUU7Y0FDL0MsQ0FBQyxNQUFNO2dCQUNMO2dCQUNBaEIsd0JBQXdCLEdBQUcsSUFBSTtnQkFDL0JILE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Z0JBQzVCUCxPQUFPLENBQUNjLFVBQVUsQ0FBQ1AsWUFBWSxFQUFFVyxnQkFBUSxDQUFDO2dCQUMxQ2dDLGdCQUFnQixJQUFJM0MsWUFBWSxDQUFDWSxXQUFXLEVBQUU7Y0FDaEQ7WUFDRixDQUFDO1lBQ0RILFFBQVEsRUFBRSxNQUFNO2NBQ2QsSUFBSVIsR0FBRyxFQUFFO2dCQUNQO2dCQUNBUixPQUFPLENBQUNZLE1BQU0sQ0FBQ0wsWUFBWSxDQUFDO2NBQzlCLENBQUMsTUFBTTtnQkFDTDtnQkFDQUosd0JBQXdCLEdBQUcsSUFBSTtnQkFDL0JILE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Z0JBQzVCUCxPQUFPLENBQUNjLFVBQVUsQ0FBQ1AsWUFBWSxFQUFFUSxnQkFBUSxDQUFDO2dCQUMxQ2tDLGdCQUFnQixJQUFJMUMsWUFBWSxDQUFDWSxXQUFXLEVBQUU7Y0FDaEQ7WUFDRixDQUFDO1lBQ0RDLFNBQVMsRUFBRSxNQUFNO2NBQ2Y7Y0FDQXBCLE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Y0FDNUJQLE9BQU8sQ0FBQ2MsVUFBVSxDQUFDUCxZQUFZLEVBQUVVLGlCQUFTLENBQUM7Y0FDM0MrQixlQUFlLElBQUl6QyxZQUFZLENBQUNZLFdBQVcsRUFBRTtZQUMvQyxDQUFDO1lBQ0RFLFNBQVMsRUFBRSxNQUFNO2NBQ2Y7Y0FDQXJCLE9BQU8sQ0FBQ2EsTUFBTSxDQUFDTixZQUFZLENBQUM7Y0FDNUJQLE9BQU8sQ0FBQ2MsVUFBVSxDQUFDUCxZQUFZLEVBQUVlLGlCQUFTLENBQUM7WUFDN0M7VUFDRixDQUFDLENBQUM7UUFDSjtNQUNGO01BRUEsSUFBSW5CLHdCQUF3QixFQUFFO1FBQzVCOztRQUVBSCxPQUFPLENBQUN1QixhQUFhLENBQUM1RCxJQUFJLENBQUNHLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU07VUFBQ2QsTUFBTTtVQUFFd0U7UUFBTyxDQUFDLEdBQUd4QixPQUFPLENBQUN5QixxQkFBcUIsRUFBRTtRQUN6RG5FLEtBQUssQ0FBQ2dDLElBQUksQ0FBQyxJQUFJdUMsYUFBSSxDQUFDO1VBQ2xCQyxXQUFXLEVBQUVuRSxJQUFJLENBQUNnRSxjQUFjLEVBQUU7VUFDbENLLFdBQVcsRUFBRWdCLGVBQWUsR0FBR0UsZ0JBQWdCO1VBQy9DeEIsV0FBVyxFQUFFL0QsSUFBSSxDQUFDZ0UsY0FBYyxFQUFFLEdBQUd6QixXQUFXO1VBQ2hEMEIsV0FBVyxFQUFFb0IsZUFBZSxHQUFHQyxnQkFBZ0I7VUFDL0NmLGNBQWMsRUFBRXZFLElBQUksQ0FBQ3dFLGlCQUFpQixFQUFFO1VBQ3hDbkYsTUFBTTtVQUNOd0U7UUFDRixDQUFDLENBQUMsQ0FBQztNQUNMLENBQUMsTUFBTTtRQUNMeEIsT0FBTyxDQUFDcUMsc0JBQXNCLEVBQUU7TUFDbEM7O01BRUE7TUFDQW5DLFdBQVcsSUFBSStDLGdCQUFnQixHQUFHQyxnQkFBZ0I7SUFDcEQ7SUFFQSxNQUFNTCxTQUFTLEdBQUcvQyxNQUFNLENBQUNnRCxJQUFJLEtBQUssSUFBSSxDQUFDdkYsZ0JBQWdCO0lBQ3ZELElBQUlGLE1BQU0sR0FBRyxJQUFJLENBQUNPLFNBQVMsRUFBRTtJQUM3QixJQUFJLElBQUksQ0FBQ0EsU0FBUyxFQUFFLEtBQUssT0FBTyxFQUFFO01BQ2hDUCxNQUFNLEdBQUd3RixTQUFTLEdBQUcsU0FBUyxHQUFHLFVBQVU7SUFDN0MsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDakYsU0FBUyxFQUFFLEtBQUssU0FBUyxFQUFFO01BQ3pDUCxNQUFNLEdBQUcsT0FBTztJQUNsQjtJQUVBLE1BQU1MLE1BQU0sR0FBRzZDLGVBQWUsQ0FBQ3lDLFNBQVMsQ0FDdEMsSUFBSSxDQUFDbEYsV0FBVyxDQUFDbUYsU0FBUyxFQUMxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMxQyxlQUFlLENBQUMyQyxTQUFTLEVBQUUsQ0FBQ0MsVUFBVSxFQUFFLEVBQUVDLFFBQVEsQ0FBQyxDQUFDLEVBQzlEO01BQUNDLFVBQVUsRUFBRSxPQUFPO01BQUVDLFNBQVMsRUFBRTtJQUFLLENBQUMsQ0FDeEM7SUFFRCxPQUFPLElBQUksQ0FBQzVELEtBQUssQ0FBQztNQUFDMUIsS0FBSztNQUFFRCxNQUFNO01BQUVMO0lBQU0sQ0FBQyxDQUFDO0VBQzVDO0VBRUFtRyxtQkFBbUIsR0FBRztJQUNwQixNQUFNOUQsU0FBUyxHQUFHLElBQUksQ0FBQzdCLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwQyxJQUFJLENBQUM2QixTQUFTLEVBQUU7TUFDZCxPQUFPbkIsV0FBSyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDO0lBRUEsTUFBTWlGLFdBQVcsR0FBRy9ELFNBQVMsQ0FBQ2dFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUNELFdBQVcsRUFBRTtNQUNoQixPQUFPbEYsV0FBSyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDO0lBRUEsTUFBTW1GLFFBQVEsR0FBR0YsV0FBVyxDQUFDRyxpQkFBaUIsRUFBRTtJQUNoRCxPQUFPckYsV0FBSyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxDQUFDbUYsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUNBLFFBQVEsRUFBRVosUUFBUSxDQUFDLENBQUMsQ0FBQztFQUNoRTtFQUVBYyxVQUFVLENBQUNDLE1BQU0sRUFBRTtJQUNqQixPQUFPLElBQUksQ0FBQ2pHLFFBQVEsRUFBRSxDQUFDQyxNQUFNLENBQUMsQ0FBQ2lHLEdBQUcsRUFBRS9GLElBQUksS0FBSytGLEdBQUcsR0FBRy9GLElBQUksQ0FBQzZGLFVBQVUsQ0FBQ0MsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDO0VBQ2pGOztFQUVBO0FBQ0Y7QUFDQTtFQUNFO0VBQ0FFLE9BQU8sQ0FBQzFFLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNqQixNQUFNMkUsT0FBTztNQUNYQyxNQUFNLEVBQUU7SUFBQyxHQUNONUUsSUFBSSxDQUNSO0lBRUQsSUFBSTZFLFdBQVcsR0FBRyxFQUFFO0lBQ3BCLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSCxPQUFPLENBQUNDLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7TUFDdkNELFdBQVcsSUFBSSxHQUFHO0lBQ3BCO0lBRUEsSUFBSUUsYUFBYSxHQUFJLEdBQUVGLFdBQVksaUJBQWdCLElBQUksQ0FBQzlHLE1BQU0sQ0FBQ2lILEVBQUcsRUFBQztJQUNuRSxJQUFJLElBQUksQ0FBQ2pILE1BQU0sQ0FBQ2tILFdBQVcsRUFBRSxFQUFFO01BQzdCRixhQUFhLElBQUksY0FBYztJQUNqQztJQUNBLElBQUksQ0FBQyxJQUFJLENBQUNoSCxNQUFNLENBQUNtSCxPQUFPLEVBQUUsRUFBRTtNQUMxQkgsYUFBYSxJQUFJLFlBQVk7SUFDL0I7SUFDQUEsYUFBYSxJQUFJLElBQUk7SUFDckIsS0FBSyxNQUFNckcsSUFBSSxJQUFJLElBQUksQ0FBQ0wsS0FBSyxFQUFFO01BQzdCMEcsYUFBYSxJQUFJckcsSUFBSSxDQUFDZ0csT0FBTyxDQUFDO1FBQUNFLE1BQU0sRUFBRUQsT0FBTyxDQUFDQyxNQUFNLEdBQUc7TUFBQyxDQUFDLENBQUM7SUFDN0Q7SUFDQUcsYUFBYSxJQUFLLEdBQUVGLFdBQVksS0FBSTtJQUNwQyxPQUFPRSxhQUFhO0VBQ3RCO0VBRUFJLFNBQVMsR0FBRztJQUNWLE9BQU8sSUFBSTtFQUNiO0VBRUFDLGVBQWUsR0FBRztJQUNoQixPQUFPaEksUUFBUTtFQUNqQjtBQUNGO0FBQUM7QUFBQSxnQkF4Vm9CTyxLQUFLLGVBQ0wsT0FBTztBQXlWNUIsTUFBTU8sV0FBVyxTQUFTUCxLQUFLLENBQUM7RUFDOUJRLFdBQVcsQ0FBQ0osTUFBTSxFQUFFQyxZQUFZLEVBQUVDLE1BQU0sRUFBRTtJQUN4QyxLQUFLLENBQUM7TUFBQ0csTUFBTSxFQUFFLElBQUk7TUFBRUMsS0FBSyxFQUFFLEVBQUU7TUFBRU47SUFBTSxDQUFDLENBQUM7SUFFeEMsSUFBSSxDQUFDQyxZQUFZLEdBQUdBLFlBQVk7SUFDaEMsSUFBSSxDQUFDcUgsSUFBSSxHQUFHcEgsTUFBTTtFQUNwQjtFQUVBcUgsaUJBQWlCLEdBQUc7SUFDbEIsT0FBTyxJQUFJLENBQUN6RyxRQUFRLEVBQUUsQ0FBQzBHLEdBQUc7RUFDNUI7RUFFQUgsZUFBZSxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxDQUFDcEgsWUFBWTtFQUMxQjs7RUFFQTtBQUNGO0FBQ0E7RUFDRTtFQUNBMEcsT0FBTyxDQUFDMUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ2pCLE1BQU0yRSxPQUFPO01BQ1hDLE1BQU0sRUFBRTtJQUFDLEdBQ041RSxJQUFJLENBQ1I7SUFFRCxJQUFJNkUsV0FBVyxHQUFHLEVBQUU7SUFDcEIsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdILE9BQU8sQ0FBQ0MsTUFBTSxFQUFFRSxDQUFDLEVBQUUsRUFBRTtNQUN2Q0QsV0FBVyxJQUFJLEdBQUc7SUFDcEI7SUFFQSxPQUFRLEdBQUVBLFdBQVksdUJBQXNCLElBQUksQ0FBQzlHLE1BQU0sQ0FBQ2lILEVBQUcsS0FBSTtFQUNqRTtBQUNGO0FBRUEsTUFBTW5ILFNBQVMsQ0FBQztFQUNkTSxXQUFXLEdBQUc7SUFDWixNQUFNcUcsTUFBTSxHQUFHLElBQUlnQixnQkFBVSxFQUFFO0lBQy9CLElBQUksQ0FBQ3pILE1BQU0sR0FBR3lHLE1BQU0sQ0FBQ25CLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbEQ7RUFFQTFFLFNBQVMsR0FBRztJQUNWLE9BQU8sSUFBSTtFQUNiO0VBRUFDLFNBQVMsR0FBRztJQUNWLE9BQU8sSUFBSSxDQUFDYixNQUFNO0VBQ3BCO0VBRUFjLFFBQVEsR0FBRztJQUNULE9BQU8sSUFBSSxDQUFDRCxTQUFTLEVBQUUsQ0FBQ0MsUUFBUSxFQUFFO0VBQ3BDO0VBRUFDLGFBQWEsR0FBRztJQUNkLE9BQU9HLFdBQUssQ0FBQ0MsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzQztFQUVBWCxRQUFRLEdBQUc7SUFDVCxPQUFPLEVBQUU7RUFDWDtFQUVBWSxtQkFBbUIsR0FBRztJQUNwQixPQUFPLENBQUM7RUFDVjtFQUVBQyxXQUFXLEdBQUc7SUFDWixPQUFPLEtBQUs7RUFDZDtFQUVBUSxxQkFBcUIsR0FBRztJQUN0QixPQUFPLENBQUM7RUFDVjtFQUVBRyxLQUFLLENBQUNDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNmLElBQ0VBLElBQUksQ0FBQzVCLE1BQU0sS0FBSzZCLFNBQVMsSUFDekJELElBQUksQ0FBQzNCLEtBQUssS0FBSzRCLFNBQVMsSUFDeEJELElBQUksQ0FBQ2pDLE1BQU0sS0FBS2tDLFNBQVMsSUFDekJELElBQUksQ0FBQ2hDLFlBQVksS0FBS2lDLFNBQVMsRUFDL0I7TUFDQSxPQUFPLElBQUk7SUFDYixDQUFDLE1BQU07TUFDTCxPQUFPLElBQUl0QyxLQUFLLENBQUM7UUFDZlMsTUFBTSxFQUFFNEIsSUFBSSxDQUFDNUIsTUFBTSxLQUFLNkIsU0FBUyxHQUFHRCxJQUFJLENBQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDTyxTQUFTLEVBQUU7UUFDbEVOLEtBQUssRUFBRTJCLElBQUksQ0FBQzNCLEtBQUssS0FBSzRCLFNBQVMsR0FBR0QsSUFBSSxDQUFDM0IsS0FBSyxHQUFHLElBQUksQ0FBQ0UsUUFBUSxFQUFFO1FBQzlEUixNQUFNLEVBQUVpQyxJQUFJLENBQUNqQyxNQUFNLEtBQUtrQyxTQUFTLEdBQUdELElBQUksQ0FBQ2pDLE1BQU0sR0FBRyxJQUFJLENBQUNhLFNBQVMsRUFBRTtRQUNsRVosWUFBWSxFQUFFZ0MsSUFBSSxDQUFDaEMsWUFBWSxLQUFLaUMsU0FBUyxHQUFHRCxJQUFJLENBQUNoQyxZQUFZLEdBQUcsSUFBSSxDQUFDb0gsZUFBZTtNQUMxRixDQUFDLENBQUM7SUFDSjtFQUNGO0VBRUFsRixrQkFBa0IsR0FBRztJQUNuQixPQUFPLEVBQUU7RUFDWDtFQUVBTSxnQkFBZ0IsR0FBRztJQUNqQixPQUFPLEVBQUU7RUFDWDtFQUVBRSx1QkFBdUIsR0FBRztJQUN4QixPQUFPLElBQUk7RUFDYjtFQUVBb0QseUJBQXlCLEdBQUc7SUFDMUIsT0FBTyxJQUFJO0VBQ2I7RUFFQUksbUJBQW1CLEdBQUc7SUFDcEIsT0FBT2pGLFdBQUssQ0FBQ0MsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzQztFQUVBTyxhQUFhLEdBQUcsQ0FBQztFQUVqQjhFLFVBQVUsR0FBRztJQUNYLE9BQU8sRUFBRTtFQUNYOztFQUVBO0FBQ0Y7QUFDQTtFQUNFO0VBQ0FHLE9BQU8sQ0FBQzFFLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNqQixNQUFNMkUsT0FBTztNQUNYQyxNQUFNLEVBQUU7SUFBQyxHQUNONUUsSUFBSSxDQUNSO0lBRUQsSUFBSTZFLFdBQVcsR0FBRyxFQUFFO0lBQ3BCLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSCxPQUFPLENBQUNDLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7TUFDdkNELFdBQVcsSUFBSSxHQUFHO0lBQ3BCO0lBRUEsT0FBUSxHQUFFQSxXQUFZLGVBQWM7RUFDdEM7RUFFQU0sU0FBUyxHQUFHO0lBQ1YsT0FBTyxLQUFLO0VBQ2Q7RUFFQUMsZUFBZSxHQUFHO0lBQ2hCLE9BQU9oSSxRQUFRO0VBQ2pCO0FBQ0Y7QUFFQSxNQUFNNEQsYUFBYSxDQUFDO0VBQ2xCN0MsV0FBVyxDQUFDc0gsUUFBUSxFQUFFM0Usa0JBQWtCLEVBQUVGLGVBQWUsRUFBRTtJQUN6RCxJQUFJLENBQUNELGNBQWMsR0FBRzhFLFFBQVE7SUFDOUIsSUFBSSxDQUFDN0UsZUFBZSxHQUFHQSxlQUFlOztJQUV0QztJQUNBO0lBQ0E7SUFDQSxJQUFJLENBQUM4RSxNQUFNLEdBQUcsSUFBSSxDQUFDOUUsZUFBZSxDQUFDMkMsU0FBUyxFQUFFLENBQUNDLFVBQVUsRUFBRSxHQUFHMUMsa0JBQWtCO0lBRWhGLElBQUksQ0FBQzZFLGNBQWMsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQ0MsWUFBWSxHQUFHLENBQUM7SUFDckIsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDSCxNQUFNO0lBQ2xDLElBQUksQ0FBQ0ksV0FBVyxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDQyxTQUFTLEdBQUcsSUFBSTtJQUVyQixJQUFJLENBQUNDLFVBQVUsR0FBRyxDQUFDO0VBQ3JCO0VBRUFwRSxNQUFNLENBQUNxRSxLQUFLLEVBQUU7SUFDWixJQUFJLENBQUNOLGNBQWMsSUFBSSxJQUFJLENBQUNoRixjQUFjLENBQUN1RixjQUFjLENBQUNELEtBQUssQ0FBQyxHQUFHLElBQUk7SUFDdkUsSUFBSSxDQUFDTCxZQUFZLElBQUlLLEtBQUssQ0FBQy9ELFdBQVcsRUFBRTtFQUMxQztFQUVBUCxNQUFNLENBQUNzRSxLQUFLLEVBQUU7SUFDWixJQUFJLENBQUNQLE1BQU0sSUFBSU8sS0FBSyxDQUFDL0QsV0FBVyxFQUFFO0VBQ3BDO0VBRUFMLFVBQVUsQ0FBQ29FLEtBQUssRUFBRUUsVUFBVSxFQUFFO0lBQzVCLE1BQU1DLFVBQVUsR0FBRyxJQUFJLENBQUNWLE1BQU0sS0FBSyxDQUFDLEdBQ2hDTyxLQUFLLENBQUNJLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQ1gsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDQSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FDbkRPLEtBQUs7O0lBRVQ7SUFDQSxNQUFNeEYsVUFBVSxHQUFHLElBQUksQ0FBQ3FGLFdBQVcsQ0FBQyxJQUFJLENBQUNBLFdBQVcsQ0FBQ2hHLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDaEUsSUFBSVcsVUFBVSxJQUFJQSxVQUFVLENBQUMwRixVQUFVLEtBQUtBLFVBQVUsSUFBSUMsVUFBVSxDQUFDcEgsS0FBSyxDQUFDSyxHQUFHLEdBQUdvQixVQUFVLENBQUN3RixLQUFLLENBQUNWLEdBQUcsQ0FBQ2xHLEdBQUcsS0FBSyxDQUFDLEVBQUU7TUFDL0dvQixVQUFVLENBQUN3RixLQUFLLENBQUNWLEdBQUcsR0FBR2EsVUFBVSxDQUFDYixHQUFHO0lBQ3ZDLENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQ08sV0FBVyxDQUFDekYsSUFBSSxDQUFDO1FBQUM4RixVQUFVO1FBQUVGLEtBQUssRUFBRUc7TUFBVSxDQUFDLENBQUM7SUFDeEQ7RUFDRjtFQUVBOUQsYUFBYSxDQUFDMkQsS0FBSyxFQUFFO0lBQ25CLElBQUlHLFVBQVUsR0FBR0gsS0FBSztJQUN0QixJQUFJLElBQUksQ0FBQ0osZUFBZSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUNILE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDbkRVLFVBQVUsR0FBR0EsVUFBVSxDQUFDQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUNSLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hGO0lBQ0EsSUFBSSxDQUFDSyxTQUFTLEdBQUdLLFVBQVU7RUFDN0I7RUFFQTVELHFCQUFxQixHQUFHO0lBQ3RCLElBQUksQ0FBQzVCLGVBQWUsQ0FBQzRELE1BQU0sQ0FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMrRCxjQUFjLEVBQUU7TUFBQ1csb0JBQW9CLEVBQUU7SUFBSyxDQUFDLENBQUM7SUFFdEYsTUFBTS9ELE9BQU8sR0FBRyxJQUFJLENBQUN1RCxXQUFXLENBQUNwRyxHQUFHLENBQUMsQ0FBQztNQUFDeUcsVUFBVTtNQUFFRjtJQUFLLENBQUMsS0FBSztNQUM1RCxNQUFNTSxZQUFZLEdBQUcsSUFBSSxDQUFDM0YsZUFBZSxDQUFDeUMsU0FBUyxDQUNqRDhDLFVBQVUsQ0FBQzdDLFNBQVMsRUFDcEIyQyxLQUFLLEVBQ0w7UUFBQ3ZDLFVBQVUsRUFBRSxPQUFPO1FBQUVDLFNBQVMsRUFBRTtNQUFLLENBQUMsQ0FDeEM7TUFDRCxPQUFPLElBQUl3QyxVQUFVLENBQUNJLFlBQVksQ0FBQztJQUNyQyxDQUFDLENBQUM7SUFFRixNQUFNeEksTUFBTSxHQUFHLElBQUksQ0FBQzZDLGVBQWUsQ0FBQ3lDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDMEMsU0FBUyxFQUFFO01BQUNyQyxVQUFVLEVBQUUsT0FBTztNQUFFQyxTQUFTLEVBQUU7SUFBSyxDQUFDLENBQUM7SUFFOUcsSUFBSSxDQUFDZ0MsY0FBYyxHQUFHLEVBQUU7SUFDeEIsSUFBSSxDQUFDQyxZQUFZLEdBQUcsQ0FBQztJQUNyQixJQUFJLENBQUNDLGVBQWUsR0FBRyxJQUFJLENBQUNILE1BQU07SUFDbEMsSUFBSSxDQUFDSSxXQUFXLEdBQUcsRUFBRTtJQUNyQixJQUFJLENBQUNDLFNBQVMsR0FBRyxJQUFJO0lBRXJCLE9BQU87TUFBQ3hELE9BQU87TUFBRXhFO0lBQU0sQ0FBQztFQUMxQjtFQUVBcUYsc0JBQXNCLEdBQUc7SUFDdkIsSUFBSSxDQUFDc0MsTUFBTSxJQUFJLElBQUksQ0FBQ0UsWUFBWTtJQUVoQyxJQUFJLENBQUNELGNBQWMsR0FBRyxFQUFFO0lBQ3hCLElBQUksQ0FBQ0MsWUFBWSxHQUFHLENBQUM7SUFDckIsSUFBSSxDQUFDQyxlQUFlLEdBQUcsSUFBSSxDQUFDSCxNQUFNO0lBQ2xDLElBQUksQ0FBQ0ksV0FBVyxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDQyxTQUFTLEdBQUcsSUFBSTtJQUVyQixPQUFPO01BQUN4RCxPQUFPLEVBQUUsRUFBRTtNQUFFeEUsTUFBTSxFQUFFO0lBQUksQ0FBQztFQUNwQztBQUNGIn0=