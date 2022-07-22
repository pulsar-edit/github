"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REMOVED = exports.EXPANDED = exports.DEFERRED = exports.COLLAPSED = void 0;

var _atom = require("atom");

var _hunk = _interopRequireDefault(require("./hunk"));

var _region = require("./region");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
      } // (contextRowCount + additionRowCount) - (contextRowCount + deletionRowCount)


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
    this.nextPatchBuffer = nextPatchBuffer; // The ranges provided to builder methods are expected to be valid within the original buffer. Account for
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
    const finalRange = this.offset !== 0 ? range.translate([this.offset, 0], [this.offset, 0]) : range; // Collapse consecutive ranges of the same RegionKind into one continuous region.

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcGF0Y2gvcGF0Y2guanMiXSwibmFtZXMiOlsiRVhQQU5ERUQiLCJ0b1N0cmluZyIsImlzVmlzaWJsZSIsImlzRXhwYW5kYWJsZSIsIkNPTExBUFNFRCIsIkRFRkVSUkVEIiwiUkVNT1ZFRCIsIlBhdGNoIiwiY3JlYXRlTnVsbCIsIk51bGxQYXRjaCIsImNyZWF0ZUhpZGRlblBhdGNoIiwibWFya2VyIiwicmVuZGVyU3RhdHVzIiwic2hvd0ZuIiwiSGlkZGVuUGF0Y2giLCJjb25zdHJ1Y3RvciIsInN0YXR1cyIsImh1bmtzIiwiY2hhbmdlZExpbmVDb3VudCIsImdldEh1bmtzIiwicmVkdWNlIiwiYWNjIiwiaHVuayIsImdldFN0YXR1cyIsImdldE1hcmtlciIsImdldFJhbmdlIiwiZ2V0U3RhcnRSYW5nZSIsInN0YXJ0UG9pbnQiLCJzdGFydCIsIlJhbmdlIiwiZnJvbU9iamVjdCIsImdldENoYW5nZWRMaW5lQ291bnQiLCJjb250YWluc1JvdyIsInJvdyIsImludGVyc2VjdHNSb3ciLCJkZXN0cm95TWFya2VycyIsImRlc3Ryb3kiLCJ1cGRhdGVNYXJrZXJzIiwibWFwIiwiZ2V0IiwiZ2V0TWF4TGluZU51bWJlcldpZHRoIiwibGFzdEh1bmsiLCJsZW5ndGgiLCJjbG9uZSIsIm9wdHMiLCJ1bmRlZmluZWQiLCJnZXRTdGFydGluZ01hcmtlcnMiLCJtYXJrZXJzIiwiZmlyc3RIdW5rIiwicHVzaCIsImdldFJlZ2lvbnMiLCJmaXJzdFJlZ2lvbiIsImdldEVuZGluZ01hcmtlcnMiLCJsYXN0UmVnaW9uIiwiYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMiLCJvcmlnaW5hbEJ1ZmZlciIsIm5leHRQYXRjaEJ1ZmZlciIsInJvd1NldCIsIm9yaWdpbmFsQmFzZU9mZnNldCIsImJ1aWxkZXIiLCJCdWZmZXJCdWlsZGVyIiwibmV3Um93RGVsdGEiLCJhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UiLCJzZWxlY3RlZERlbGV0aW9uUm93Q291bnQiLCJub05ld2xpbmVSb3dDb3VudCIsInJlZ2lvbiIsImludGVyc2VjdGlvbiIsImdhcCIsImludGVyc2VjdFJvd3MiLCJ3aGVuIiwiYWRkaXRpb24iLCJyZW1vdmUiLCJhcHBlbmQiLCJtYXJrUmVnaW9uIiwiQWRkaXRpb24iLCJkZWxldGlvbiIsIlVuY2hhbmdlZCIsIkRlbGV0aW9uIiwiZ2V0Um93Q291bnQiLCJ1bmNoYW5nZWQiLCJub25ld2xpbmUiLCJOb05ld2xpbmUiLCJtYXJrSHVua1JhbmdlIiwicmVnaW9ucyIsImxhdGVzdEh1bmtXYXNJbmNsdWRlZCIsIm5ld1N0YXJ0Um93IiwiZ2V0TmV3U3RhcnRSb3ciLCJuZXdSb3dDb3VudCIsIkh1bmsiLCJvbGRTdGFydFJvdyIsImdldE9sZFN0YXJ0Um93Iiwib2xkUm93Q291bnQiLCJnZXRPbGRSb3dDb3VudCIsInNlY3Rpb25IZWFkaW5nIiwiZ2V0U2VjdGlvbkhlYWRpbmciLCJnZXROZXdSb3dDb3VudCIsImxhdGVzdEh1bmtXYXNEaXNjYXJkZWQiLCJtYXJrUmFuZ2UiLCJsYXllck5hbWUiLCJnZXRCdWZmZXIiLCJnZXRMYXN0Um93IiwiSW5maW5pdHkiLCJpbnZhbGlkYXRlIiwiZXhjbHVzaXZlIiwid2hvbGVGaWxlIiwic2l6ZSIsImJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMiLCJjb250ZXh0Um93Q291bnQiLCJhZGRpdGlvblJvd0NvdW50IiwiZGVsZXRpb25Sb3dDb3VudCIsImdldEZpcnN0Q2hhbmdlUmFuZ2UiLCJmaXJzdENoYW5nZSIsImdldENoYW5nZXMiLCJmaXJzdFJvdyIsImdldFN0YXJ0QnVmZmVyUm93IiwidG9TdHJpbmdJbiIsImJ1ZmZlciIsInN0ciIsImluc3BlY3QiLCJvcHRpb25zIiwiaW5kZW50IiwiaW5kZW50YXRpb24iLCJpIiwiaW5zcGVjdFN0cmluZyIsImlkIiwiaXNEZXN0cm95ZWQiLCJpc1ZhbGlkIiwiaXNQcmVzZW50IiwiZ2V0UmVuZGVyU3RhdHVzIiwic2hvdyIsImdldEluc2VydGlvblBvaW50IiwiZW5kIiwiVGV4dEJ1ZmZlciIsIm9yaWdpbmFsIiwib2Zmc2V0IiwiaHVua0J1ZmZlclRleHQiLCJodW5rUm93Q291bnQiLCJodW5rU3RhcnRPZmZzZXQiLCJodW5rUmVnaW9ucyIsImh1bmtSYW5nZSIsImxhc3RPZmZzZXQiLCJyYW5nZSIsImdldFRleHRJblJhbmdlIiwiUmVnaW9uS2luZCIsImZpbmFsUmFuZ2UiLCJ0cmFuc2xhdGUiLCJub3JtYWxpemVMaW5lRW5kaW5ncyIsInJlZ2lvbk1hcmtlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sTUFBTUEsUUFBUSxHQUFHO0FBQ3RCO0FBQ0FDLEVBQUFBLFFBQVEsR0FBRztBQUFFLFdBQU8sd0JBQVA7QUFBa0MsR0FGekI7O0FBSXRCQyxFQUFBQSxTQUFTLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUpOOztBQU10QkMsRUFBQUEsWUFBWSxHQUFHO0FBQUUsV0FBTyxLQUFQO0FBQWU7O0FBTlYsQ0FBakI7O0FBU0EsTUFBTUMsU0FBUyxHQUFHO0FBQ3ZCO0FBQ0FILEVBQUFBLFFBQVEsR0FBRztBQUFFLFdBQU8seUJBQVA7QUFBbUMsR0FGekI7O0FBSXZCQyxFQUFBQSxTQUFTLEdBQUc7QUFBRSxXQUFPLEtBQVA7QUFBZSxHQUpOOztBQU12QkMsRUFBQUEsWUFBWSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWM7O0FBTlIsQ0FBbEI7O0FBU0EsTUFBTUUsUUFBUSxHQUFHO0FBQ3RCO0FBQ0FKLEVBQUFBLFFBQVEsR0FBRztBQUFFLFdBQU8sd0JBQVA7QUFBa0MsR0FGekI7O0FBSXRCQyxFQUFBQSxTQUFTLEdBQUc7QUFBRSxXQUFPLEtBQVA7QUFBZSxHQUpQOztBQU10QkMsRUFBQUEsWUFBWSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWM7O0FBTlQsQ0FBakI7O0FBU0EsTUFBTUcsT0FBTyxHQUFHO0FBQ3JCO0FBQ0FMLEVBQUFBLFFBQVEsR0FBRztBQUFFLFdBQU8sdUJBQVA7QUFBaUMs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VSxFQUFFLE9BQWI7QUFBc0JDLFFBQUFBLFNBQVMsRUFBRTtBQUFqQyxPQUhtQixDQUFyQjtBQUtBLGFBQU8sSUFBSXdDLFVBQUosQ0FBZUksWUFBZixDQUFQO0FBQ0QsS0FQZSxDQUFoQjtBQVNBLFVBQU14SSxNQUFNLEdBQUcsS0FBSzZDLGVBQUwsQ0FBcUJ5QyxTQUFyQixDQUErQixNQUEvQixFQUF1QyxLQUFLMEMsU0FBNUMsRUFBdUQ7QUFBQ3JDLE1BQUFBLFVBQVUsRUFBRSxPQUFiO0FBQXNCQyxNQUFBQSxTQUFTLEVBQUU7QUFBakMsS0FBdkQsQ0FBZjtBQUVBLFNBQUtnQyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNBLFNBQUtDLGVBQUwsR0FBdUIsS0FBS0gsTUFBNUI7QUFDQSxTQUFLSSxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUVBLFdBQU87QUFBQ3hELE1BQUFBLE9BQUQ7QUFBVXhFLE1BQUFBO0FBQVYsS0FBUDtBQUNEOztBQUVEcUYsRUFBQUEsc0JBQXNCLEdBQUc7QUFDdkIsU0FBS3NDLE1BQUwsSUFBZSxLQUFLRSxZQUFwQjtBQUVBLFNBQUtELGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QixLQUFLSCxNQUE1QjtBQUNBLFNBQUtJLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBRUEsV0FBTztBQUFDeEQsTUFBQUEsT0FBTyxFQUFFLEVBQVY7QUFBY3hFLE1BQUFBLE1BQU0sRUFBRTtBQUF0QixLQUFQO0FBQ0Q7O0FBbkZpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGV4dEJ1ZmZlciwgUmFuZ2V9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgSHVuayBmcm9tICcuL2h1bmsnO1xuaW1wb3J0IHtVbmNoYW5nZWQsIEFkZGl0aW9uLCBEZWxldGlvbiwgTm9OZXdsaW5lfSBmcm9tICcuL3JlZ2lvbic7XG5cbmV4cG9ydCBjb25zdCBFWFBBTkRFRCA9IHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcoKSB7IHJldHVybiAnUmVuZGVyU3RhdHVzKGV4cGFuZGVkKSc7IH0sXG5cbiAgaXNWaXNpYmxlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiBmYWxzZTsgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBDT0xMQVBTRUQgPSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gJ1JlbmRlclN0YXR1cyhjb2xsYXBzZWQpJzsgfSxcblxuICBpc1Zpc2libGUoKSB7IHJldHVybiBmYWxzZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiB0cnVlOyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IERFRkVSUkVEID0ge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB0b1N0cmluZygpIHsgcmV0dXJuICdSZW5kZXJTdGF0dXMoZGVmZXJyZWQpJzsgfSxcblxuICBpc1Zpc2libGUoKSB7IHJldHVybiBmYWxzZTsgfSxcblxuICBpc0V4cGFuZGFibGUoKSB7IHJldHVybiB0cnVlOyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IFJFTU9WRUQgPSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkgeyByZXR1cm4gJ1JlbmRlclN0YXR1cyhyZW1vdmVkKSc7IH0sXG5cbiAgaXNWaXNpYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG5cbiAgaXNFeHBhbmRhYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRjaCB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAncGF0Y2gnO1xuXG4gIHN0YXRpYyBjcmVhdGVOdWxsKCkge1xuICAgIHJldHVybiBuZXcgTnVsbFBhdGNoKCk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlSGlkZGVuUGF0Y2gobWFya2VyLCByZW5kZXJTdGF0dXMsIHNob3dGbikge1xuICAgIHJldHVybiBuZXcgSGlkZGVuUGF0Y2gobWFya2VyLCByZW5kZXJTdGF0dXMsIHNob3dGbik7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7c3RhdHVzLCBodW5rcywgbWFya2VyfSkge1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuaHVua3MgPSBodW5rcztcbiAgICB0aGlzLm1hcmtlciA9IG1hcmtlcjtcblxuICAgIHRoaXMuY2hhbmdlZExpbmVDb3VudCA9IHRoaXMuZ2V0SHVua3MoKS5yZWR1Y2UoKGFjYywgaHVuaykgPT4gYWNjICsgaHVuay5jaGFuZ2VkTGluZUNvdW50KCksIDApO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cztcbiAgfVxuXG4gIGdldE1hcmtlcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICBnZXRSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0U3RhcnRSYW5nZSgpIHtcbiAgICBjb25zdCBzdGFydFBvaW50ID0gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLnN0YXJ0O1xuICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtzdGFydFBvaW50LCBzdGFydFBvaW50XSk7XG4gIH1cblxuICBnZXRIdW5rcygpIHtcbiAgICByZXR1cm4gdGhpcy5odW5rcztcbiAgfVxuXG4gIGdldENoYW5nZWRMaW5lQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlZExpbmVDb3VudDtcbiAgfVxuXG4gIGNvbnRhaW5zUm93KHJvdykge1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRSYW5nZSgpLmludGVyc2VjdHNSb3cocm93KTtcbiAgfVxuXG4gIGRlc3Ryb3lNYXJrZXJzKCkge1xuICAgIHRoaXMubWFya2VyLmRlc3Ryb3koKTtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5odW5rcykge1xuICAgICAgaHVuay5kZXN0cm95TWFya2VycygpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMobWFwKSB7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXAuZ2V0KHRoaXMubWFya2VyKSB8fCB0aGlzLm1hcmtlcjtcbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5odW5rcykge1xuICAgICAgaHVuay51cGRhdGVNYXJrZXJzKG1hcCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TWF4TGluZU51bWJlcldpZHRoKCkge1xuICAgIGNvbnN0IGxhc3RIdW5rID0gdGhpcy5odW5rc1t0aGlzLmh1bmtzLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBsYXN0SHVuayA/IGxhc3RIdW5rLmdldE1heExpbmVOdW1iZXJXaWR0aCgpIDogMDtcbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7XG4gICAgICBzdGF0dXM6IG9wdHMuc3RhdHVzICE9PSB1bmRlZmluZWQgPyBvcHRzLnN0YXR1cyA6IHRoaXMuZ2V0U3RhdHVzKCksXG4gICAgICBodW5rczogb3B0cy5odW5rcyAhPT0gdW5kZWZpbmVkID8gb3B0cy5odW5rcyA6IHRoaXMuZ2V0SHVua3MoKSxcbiAgICAgIG1hcmtlcjogb3B0cy5tYXJrZXIgIT09IHVuZGVmaW5lZCA/IG9wdHMubWFya2VyIDogdGhpcy5nZXRNYXJrZXIoKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qIFJldHVybiB0aGUgc2V0IG9mIE1hcmtlcnMgb3duZWQgYnkgdGhpcyBQYXRjaCB0aGF0IGJ1dHQgdXAgYWdhaW5zdCB0aGUgcGF0Y2gncyBiZWdpbm5pbmcuICovXG4gIGdldFN0YXJ0aW5nTWFya2VycygpIHtcbiAgICBjb25zdCBtYXJrZXJzID0gW3RoaXMubWFya2VyXTtcbiAgICBpZiAodGhpcy5odW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdEh1bmsgPSB0aGlzLmh1bmtzWzBdO1xuICAgICAgbWFya2Vycy5wdXNoKGZpcnN0SHVuay5nZXRNYXJrZXIoKSk7XG4gICAgICBpZiAoZmlyc3RIdW5rLmdldFJlZ2lvbnMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0UmVnaW9uID0gZmlyc3RIdW5rLmdldFJlZ2lvbnMoKVswXTtcbiAgICAgICAgbWFya2Vycy5wdXNoKGZpcnN0UmVnaW9uLmdldE1hcmtlcigpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlcnM7XG4gIH1cblxuICAvKiBSZXR1cm4gdGhlIHNldCBvZiBNYXJrZXJzIG93bmVkIGJ5IHRoaXMgUGF0Y2ggdGhhdCBlbmQgYXQgdGhlIHBhdGNoJ3MgZW5kIHBvc2l0aW9uLiAqL1xuICBnZXRFbmRpbmdNYXJrZXJzKCkge1xuICAgIGNvbnN0IG1hcmtlcnMgPSBbdGhpcy5tYXJrZXJdO1xuICAgIGlmICh0aGlzLmh1bmtzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGxhc3RIdW5rID0gdGhpcy5odW5rc1t0aGlzLmh1bmtzLmxlbmd0aCAtIDFdO1xuICAgICAgbWFya2Vycy5wdXNoKGxhc3RIdW5rLmdldE1hcmtlcigpKTtcbiAgICAgIGlmIChsYXN0SHVuay5nZXRSZWdpb25zKCkubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBsYXN0UmVnaW9uID0gbGFzdEh1bmsuZ2V0UmVnaW9ucygpW2xhc3RIdW5rLmdldFJlZ2lvbnMoKS5sZW5ndGggLSAxXTtcbiAgICAgICAgbWFya2Vycy5wdXNoKGxhc3RSZWdpb24uZ2V0TWFya2VyKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFya2VycztcbiAgfVxuXG4gIGJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzKG9yaWdpbmFsQnVmZmVyLCBuZXh0UGF0Y2hCdWZmZXIsIHJvd1NldCkge1xuICAgIGNvbnN0IG9yaWdpbmFsQmFzZU9mZnNldCA9IHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5zdGFydC5yb3c7XG4gICAgY29uc3QgYnVpbGRlciA9IG5ldyBCdWZmZXJCdWlsZGVyKG9yaWdpbmFsQnVmZmVyLCBvcmlnaW5hbEJhc2VPZmZzZXQsIG5leHRQYXRjaEJ1ZmZlcik7XG4gICAgY29uc3QgaHVua3MgPSBbXTtcblxuICAgIGxldCBuZXdSb3dEZWx0YSA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IGh1bmsgb2YgdGhpcy5nZXRIdW5rcygpKSB7XG4gICAgICBsZXQgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gZmFsc2U7XG4gICAgICBsZXQgc2VsZWN0ZWREZWxldGlvblJvd0NvdW50ID0gMDtcbiAgICAgIGxldCBub05ld2xpbmVSb3dDb3VudCA9IDA7XG5cbiAgICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIGh1bmsuZ2V0UmVnaW9ucygpKSB7XG4gICAgICAgIGZvciAoY29uc3Qge2ludGVyc2VjdGlvbiwgZ2FwfSBvZiByZWdpb24uaW50ZXJzZWN0Um93cyhyb3dTZXQsIHRydWUpKSB7XG4gICAgICAgICAgcmVnaW9uLndoZW4oe1xuICAgICAgICAgICAgYWRkaXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIFVuc2VsZWN0ZWQgYWRkaXRpb246IG9taXQgZnJvbSBuZXcgYnVmZmVyXG4gICAgICAgICAgICAgICAgYnVpbGRlci5yZW1vdmUoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBhZGRpdGlvbjogaW5jbHVkZSBpbiBuZXcgcGF0Y2hcbiAgICAgICAgICAgICAgICBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGludGVyc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgQWRkaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIFVuc2VsZWN0ZWQgZGVsZXRpb246IGNvbnZlcnQgdG8gY29udGV4dCByb3dcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIFVuY2hhbmdlZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0ZWQgZGVsZXRpb246IGluY2x1ZGUgaW4gbmV3IHBhdGNoXG4gICAgICAgICAgICAgICAgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIERlbGV0aW9uKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZERlbGV0aW9uUm93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gVW50b3VjaGVkIGNvbnRleHQgbGluZTogaW5jbHVkZSBpbiBuZXcgcGF0Y2hcbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgVW5jaGFuZ2VkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBub25ld2xpbmU6ICgpID0+IHtcbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgTm9OZXdsaW5lKTtcbiAgICAgICAgICAgICAgbm9OZXdsaW5lUm93Q291bnQgKz0gaW50ZXJzZWN0aW9uLmdldFJvd0NvdW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UpIHtcbiAgICAgICAgLy8gSHVuayBjb250YWlucyBhdCBsZWFzdCBvbmUgc2VsZWN0ZWQgbGluZVxuXG4gICAgICAgIGJ1aWxkZXIubWFya0h1bmtSYW5nZShodW5rLmdldFJhbmdlKCkpO1xuICAgICAgICBjb25zdCB7cmVnaW9ucywgbWFya2VyfSA9IGJ1aWxkZXIubGF0ZXN0SHVua1dhc0luY2x1ZGVkKCk7XG4gICAgICAgIGNvbnN0IG5ld1N0YXJ0Um93ID0gaHVuay5nZXROZXdTdGFydFJvdygpICsgbmV3Um93RGVsdGE7XG4gICAgICAgIGNvbnN0IG5ld1Jvd0NvdW50ID0gbWFya2VyLmdldFJhbmdlKCkuZ2V0Um93Q291bnQoKSAtIHNlbGVjdGVkRGVsZXRpb25Sb3dDb3VudCAtIG5vTmV3bGluZVJvd0NvdW50O1xuXG4gICAgICAgIGh1bmtzLnB1c2gobmV3IEh1bmsoe1xuICAgICAgICAgIG9sZFN0YXJ0Um93OiBodW5rLmdldE9sZFN0YXJ0Um93KCksXG4gICAgICAgICAgb2xkUm93Q291bnQ6IGh1bmsuZ2V0T2xkUm93Q291bnQoKSxcbiAgICAgICAgICBuZXdTdGFydFJvdyxcbiAgICAgICAgICBuZXdSb3dDb3VudCxcbiAgICAgICAgICBzZWN0aW9uSGVhZGluZzogaHVuay5nZXRTZWN0aW9uSGVhZGluZygpLFxuICAgICAgICAgIG1hcmtlcixcbiAgICAgICAgICByZWdpb25zLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgbmV3Um93RGVsdGEgKz0gbmV3Um93Q291bnQgLSBodW5rLmdldE5ld1Jvd0NvdW50KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdSb3dEZWx0YSArPSBodW5rLmdldE9sZFJvd0NvdW50KCkgLSBodW5rLmdldE5ld1Jvd0NvdW50KCk7XG5cbiAgICAgICAgYnVpbGRlci5sYXRlc3RIdW5rV2FzRGlzY2FyZGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2VyID0gbmV4dFBhdGNoQnVmZmVyLm1hcmtSYW5nZShcbiAgICAgIHRoaXMuY29uc3RydWN0b3IubGF5ZXJOYW1lLFxuICAgICAgW1swLCAwXSwgW25leHRQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRMYXN0Um93KCkgLSAxLCBJbmZpbml0eV1dLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG5cbiAgICBjb25zdCB3aG9sZUZpbGUgPSByb3dTZXQuc2l6ZSA9PT0gdGhpcy5jaGFuZ2VkTGluZUNvdW50O1xuICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJyAmJiAhd2hvbGVGaWxlID8gJ21vZGlmaWVkJyA6IHRoaXMuZ2V0U3RhdHVzKCk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe2h1bmtzLCBzdGF0dXMsIG1hcmtlcn0pO1xuICB9XG5cbiAgYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhvcmlnaW5hbEJ1ZmZlciwgbmV4dFBhdGNoQnVmZmVyLCByb3dTZXQpIHtcbiAgICBjb25zdCBvcmlnaW5hbEJhc2VPZmZzZXQgPSB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCkuc3RhcnQucm93O1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQnVmZmVyQnVpbGRlcihvcmlnaW5hbEJ1ZmZlciwgb3JpZ2luYWxCYXNlT2Zmc2V0LCBuZXh0UGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IGh1bmtzID0gW107XG4gICAgbGV0IG5ld1Jvd0RlbHRhID0gMDtcblxuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmdldEh1bmtzKCkpIHtcbiAgICAgIGxldCBhdExlYXN0T25lU2VsZWN0ZWRDaGFuZ2UgPSBmYWxzZTtcbiAgICAgIGxldCBjb250ZXh0Um93Q291bnQgPSAwO1xuICAgICAgbGV0IGFkZGl0aW9uUm93Q291bnQgPSAwO1xuICAgICAgbGV0IGRlbGV0aW9uUm93Q291bnQgPSAwO1xuXG4gICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBodW5rLmdldFJlZ2lvbnMoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHtpbnRlcnNlY3Rpb24sIGdhcH0gb2YgcmVnaW9uLmludGVyc2VjdFJvd3Mocm93U2V0LCB0cnVlKSkge1xuICAgICAgICAgIHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChnYXApIHtcbiAgICAgICAgICAgICAgICAvLyBVbnNlbGVjdGVkIGFkZGl0aW9uOiBiZWNvbWUgYSBjb250ZXh0IGxpbmUuXG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBVbmNoYW5nZWQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRSb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBhZGRpdGlvbjogYmVjb21lIGEgZGVsZXRpb24uXG4gICAgICAgICAgICAgICAgYXRMZWFzdE9uZVNlbGVjdGVkQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLmFwcGVuZChpbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgICAgIGJ1aWxkZXIubWFya1JlZ2lvbihpbnRlcnNlY3Rpb24sIERlbGV0aW9uKTtcbiAgICAgICAgICAgICAgICBkZWxldGlvblJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGdhcCkge1xuICAgICAgICAgICAgICAgIC8vIE5vbi1zZWxlY3RlZCBkZWxldGlvbjogb21pdCBmcm9tIG5ldyBidWZmZXIuXG4gICAgICAgICAgICAgICAgYnVpbGRlci5yZW1vdmUoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RlZCBkZWxldGlvbjogYmVjb21lcyBhbiBhZGRpdGlvblxuICAgICAgICAgICAgICAgIGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBidWlsZGVyLm1hcmtSZWdpb24oaW50ZXJzZWN0aW9uLCBBZGRpdGlvbik7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25Sb3dDb3VudCArPSBpbnRlcnNlY3Rpb24uZ2V0Um93Q291bnQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBVbnRvdWNoZWQgY29udGV4dCBsaW5lOiBpbmNsdWRlIGluIG5ldyBwYXRjaC5cbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgVW5jaGFuZ2VkKTtcbiAgICAgICAgICAgICAgY29udGV4dFJvd0NvdW50ICs9IGludGVyc2VjdGlvbi5nZXRSb3dDb3VudCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5vbmV3bGluZTogKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBOb25ld2xpbmUgbWFya2VyOiBpbmNsdWRlIGluIG5ldyBwYXRjaC5cbiAgICAgICAgICAgICAgYnVpbGRlci5hcHBlbmQoaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgICAgICAgYnVpbGRlci5tYXJrUmVnaW9uKGludGVyc2VjdGlvbiwgTm9OZXdsaW5lKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGF0TGVhc3RPbmVTZWxlY3RlZENoYW5nZSkge1xuICAgICAgICAvLyBIdW5rIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBzZWxlY3RlZCBsaW5lXG5cbiAgICAgICAgYnVpbGRlci5tYXJrSHVua1JhbmdlKGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICAgIGNvbnN0IHttYXJrZXIsIHJlZ2lvbnN9ID0gYnVpbGRlci5sYXRlc3RIdW5rV2FzSW5jbHVkZWQoKTtcbiAgICAgICAgaHVua3MucHVzaChuZXcgSHVuayh7XG4gICAgICAgICAgb2xkU3RhcnRSb3c6IGh1bmsuZ2V0TmV3U3RhcnRSb3coKSxcbiAgICAgICAgICBvbGRSb3dDb3VudDogY29udGV4dFJvd0NvdW50ICsgZGVsZXRpb25Sb3dDb3VudCxcbiAgICAgICAgICBuZXdTdGFydFJvdzogaHVuay5nZXROZXdTdGFydFJvdygpICsgbmV3Um93RGVsdGEsXG4gICAgICAgICAgbmV3Um93Q291bnQ6IGNvbnRleHRSb3dDb3VudCArIGFkZGl0aW9uUm93Q291bnQsXG4gICAgICAgICAgc2VjdGlvbkhlYWRpbmc6IGh1bmsuZ2V0U2VjdGlvbkhlYWRpbmcoKSxcbiAgICAgICAgICBtYXJrZXIsXG4gICAgICAgICAgcmVnaW9ucyxcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVpbGRlci5sYXRlc3RIdW5rV2FzRGlzY2FyZGVkKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIChjb250ZXh0Um93Q291bnQgKyBhZGRpdGlvblJvd0NvdW50KSAtIChjb250ZXh0Um93Q291bnQgKyBkZWxldGlvblJvd0NvdW50KVxuICAgICAgbmV3Um93RGVsdGEgKz0gYWRkaXRpb25Sb3dDb3VudCAtIGRlbGV0aW9uUm93Q291bnQ7XG4gICAgfVxuXG4gICAgY29uc3Qgd2hvbGVGaWxlID0gcm93U2V0LnNpemUgPT09IHRoaXMuY2hhbmdlZExpbmVDb3VudDtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy5nZXRTdGF0dXMoKTtcbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2FkZGVkJykge1xuICAgICAgc3RhdHVzID0gd2hvbGVGaWxlID8gJ2RlbGV0ZWQnIDogJ21vZGlmaWVkJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgc3RhdHVzID0gJ2FkZGVkJztcbiAgICB9XG5cbiAgICBjb25zdCBtYXJrZXIgPSBuZXh0UGF0Y2hCdWZmZXIubWFya1JhbmdlKFxuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5sYXllck5hbWUsXG4gICAgICBbWzAsIDBdLCBbbmV4dFBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldExhc3RSb3coKSwgSW5maW5pdHldXSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe2h1bmtzLCBzdGF0dXMsIG1hcmtlcn0pO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpIHtcbiAgICBjb25zdCBmaXJzdEh1bmsgPSB0aGlzLmdldEh1bmtzKClbMF07XG4gICAgaWYgKCFmaXJzdEh1bmspIHtcbiAgICAgIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCAwXV0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0Q2hhbmdlID0gZmlyc3RIdW5rLmdldENoYW5nZXMoKVswXTtcbiAgICBpZiAoIWZpcnN0Q2hhbmdlKSB7XG4gICAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJzdFJvdyA9IGZpcnN0Q2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCk7XG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1tmaXJzdFJvdywgMF0sIFtmaXJzdFJvdywgSW5maW5pdHldXSk7XG4gIH1cblxuICB0b1N0cmluZ0luKGJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLmdldEh1bmtzKCkucmVkdWNlKChzdHIsIGh1bmspID0+IHN0ciArIGh1bmsudG9TdHJpbmdJbihidWZmZXIpLCAnJyk7XG4gIH1cblxuICAvKlxuICAgKiBDb25zdHJ1Y3QgYSBTdHJpbmcgY29udGFpbmluZyBpbnRlcm5hbCBkaWFnbm9zdGljIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdChvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5kZW50OiAwLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgbGV0IGluZGVudGF0aW9uID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmluZGVudDsgaSsrKSB7XG4gICAgICBpbmRlbnRhdGlvbiArPSAnICc7XG4gICAgfVxuXG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSBgJHtpbmRlbnRhdGlvbn0oUGF0Y2ggbWFya2VyPSR7dGhpcy5tYXJrZXIuaWR9YDtcbiAgICBpZiAodGhpcy5tYXJrZXIuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSAnIFtkZXN0cm95ZWRdJztcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hcmtlci5pc1ZhbGlkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbaW52YWxpZF0nO1xuICAgIH1cbiAgICBpbnNwZWN0U3RyaW5nICs9ICdcXG4nO1xuICAgIGZvciAoY29uc3QgaHVuayBvZiB0aGlzLmh1bmtzKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGh1bmsuaW5zcGVjdCh7aW5kZW50OiBvcHRpb25zLmluZGVudCArIDJ9KTtcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSBgJHtpbmRlbnRhdGlvbn0pXFxuYDtcbiAgICByZXR1cm4gaW5zcGVjdFN0cmluZztcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldFJlbmRlclN0YXR1cygpIHtcbiAgICByZXR1cm4gRVhQQU5ERUQ7XG4gIH1cbn1cblxuY2xhc3MgSGlkZGVuUGF0Y2ggZXh0ZW5kcyBQYXRjaCB7XG4gIGNvbnN0cnVjdG9yKG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pIHtcbiAgICBzdXBlcih7c3RhdHVzOiBudWxsLCBodW5rczogW10sIG1hcmtlcn0pO1xuXG4gICAgdGhpcy5yZW5kZXJTdGF0dXMgPSByZW5kZXJTdGF0dXM7XG4gICAgdGhpcy5zaG93ID0gc2hvd0ZuO1xuICB9XG5cbiAgZ2V0SW5zZXJ0aW9uUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5lbmQ7XG4gIH1cblxuICBnZXRSZW5kZXJTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhdHVzO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtpbmRlbnRhdGlvbn0oSGlkZGVuUGF0Y2ggbWFya2VyPSR7dGhpcy5tYXJrZXIuaWR9KVxcbmA7XG4gIH1cbn1cblxuY2xhc3MgTnVsbFBhdGNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoKTtcbiAgICB0aGlzLm1hcmtlciA9IGJ1ZmZlci5tYXJrUmFuZ2UoW1swLCAwXSwgWzAsIDBdXSk7XG4gIH1cblxuICBnZXRTdGF0dXMoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRNYXJrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgZ2V0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKTtcbiAgfVxuXG4gIGdldFN0YXJ0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIFJhbmdlLmZyb21PYmplY3QoW1swLCAwXSwgWzAsIDBdXSk7XG4gIH1cblxuICBnZXRIdW5rcygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRDaGFuZ2VkTGluZUNvdW50KCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29udGFpbnNSb3coKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0TWF4TGluZU51bWJlcldpZHRoKCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY2xvbmUob3B0cyA9IHt9KSB7XG4gICAgaWYgKFxuICAgICAgb3B0cy5zdGF0dXMgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgb3B0cy5odW5rcyA9PT0gdW5kZWZpbmVkICYmXG4gICAgICBvcHRzLm1hcmtlciA9PT0gdW5kZWZpbmVkICYmXG4gICAgICBvcHRzLnJlbmRlclN0YXR1cyA9PT0gdW5kZWZpbmVkXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBQYXRjaCh7XG4gICAgICAgIHN0YXR1czogb3B0cy5zdGF0dXMgIT09IHVuZGVmaW5lZCA/IG9wdHMuc3RhdHVzIDogdGhpcy5nZXRTdGF0dXMoKSxcbiAgICAgICAgaHVua3M6IG9wdHMuaHVua3MgIT09IHVuZGVmaW5lZCA/IG9wdHMuaHVua3MgOiB0aGlzLmdldEh1bmtzKCksXG4gICAgICAgIG1hcmtlcjogb3B0cy5tYXJrZXIgIT09IHVuZGVmaW5lZCA/IG9wdHMubWFya2VyIDogdGhpcy5nZXRNYXJrZXIoKSxcbiAgICAgICAgcmVuZGVyU3RhdHVzOiBvcHRzLnJlbmRlclN0YXR1cyAhPT0gdW5kZWZpbmVkID8gb3B0cy5yZW5kZXJTdGF0dXMgOiB0aGlzLmdldFJlbmRlclN0YXR1cygpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0U3RhcnRpbmdNYXJrZXJzKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldEVuZGluZ01hcmtlcnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBidWlsZFVuc3RhZ2VQYXRjaEZvckxpbmVzKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpIHtcbiAgICByZXR1cm4gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgMF1dKTtcbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMoKSB7fVxuXG4gIHRvU3RyaW5nSW4oKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtpbmRlbnRhdGlvbn0oTnVsbFBhdGNoKVxcbmA7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0UmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiBFWFBBTkRFRDtcbiAgfVxufVxuXG5jbGFzcyBCdWZmZXJCdWlsZGVyIHtcbiAgY29uc3RydWN0b3Iob3JpZ2luYWwsIG9yaWdpbmFsQmFzZU9mZnNldCwgbmV4dFBhdGNoQnVmZmVyKSB7XG4gICAgdGhpcy5vcmlnaW5hbEJ1ZmZlciA9IG9yaWdpbmFsO1xuICAgIHRoaXMubmV4dFBhdGNoQnVmZmVyID0gbmV4dFBhdGNoQnVmZmVyO1xuXG4gICAgLy8gVGhlIHJhbmdlcyBwcm92aWRlZCB0byBidWlsZGVyIG1ldGhvZHMgYXJlIGV4cGVjdGVkIHRvIGJlIHZhbGlkIHdpdGhpbiB0aGUgb3JpZ2luYWwgYnVmZmVyLiBBY2NvdW50IGZvclxuICAgIC8vIHRoZSBwb3NpdGlvbiBvZiB0aGUgUGF0Y2ggd2l0aGluIGl0cyBvcmlnaW5hbCBUZXh0QnVmZmVyLCBhbmQgYW55IGV4aXN0aW5nIGNvbnRlbnQgYWxyZWFkeSBvbiB0aGUgbmV4dFxuICAgIC8vIFRleHRCdWZmZXIuXG4gICAgdGhpcy5vZmZzZXQgPSB0aGlzLm5leHRQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRMYXN0Um93KCkgLSBvcmlnaW5hbEJhc2VPZmZzZXQ7XG5cbiAgICB0aGlzLmh1bmtCdWZmZXJUZXh0ID0gJyc7XG4gICAgdGhpcy5odW5rUm93Q291bnQgPSAwO1xuICAgIHRoaXMuaHVua1N0YXJ0T2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgdGhpcy5odW5rUmVnaW9ucyA9IFtdO1xuICAgIHRoaXMuaHVua1JhbmdlID0gbnVsbDtcblxuICAgIHRoaXMubGFzdE9mZnNldCA9IDA7XG4gIH1cblxuICBhcHBlbmQocmFuZ2UpIHtcbiAgICB0aGlzLmh1bmtCdWZmZXJUZXh0ICs9IHRoaXMub3JpZ2luYWxCdWZmZXIuZ2V0VGV4dEluUmFuZ2UocmFuZ2UpICsgJ1xcbic7XG4gICAgdGhpcy5odW5rUm93Q291bnQgKz0gcmFuZ2UuZ2V0Um93Q291bnQoKTtcbiAgfVxuXG4gIHJlbW92ZShyYW5nZSkge1xuICAgIHRoaXMub2Zmc2V0IC09IHJhbmdlLmdldFJvd0NvdW50KCk7XG4gIH1cblxuICBtYXJrUmVnaW9uKHJhbmdlLCBSZWdpb25LaW5kKSB7XG4gICAgY29uc3QgZmluYWxSYW5nZSA9IHRoaXMub2Zmc2V0ICE9PSAwXG4gICAgICA/IHJhbmdlLnRyYW5zbGF0ZShbdGhpcy5vZmZzZXQsIDBdLCBbdGhpcy5vZmZzZXQsIDBdKVxuICAgICAgOiByYW5nZTtcblxuICAgIC8vIENvbGxhcHNlIGNvbnNlY3V0aXZlIHJhbmdlcyBvZiB0aGUgc2FtZSBSZWdpb25LaW5kIGludG8gb25lIGNvbnRpbnVvdXMgcmVnaW9uLlxuICAgIGNvbnN0IGxhc3RSZWdpb24gPSB0aGlzLmh1bmtSZWdpb25zW3RoaXMuaHVua1JlZ2lvbnMubGVuZ3RoIC0gMV07XG4gICAgaWYgKGxhc3RSZWdpb24gJiYgbGFzdFJlZ2lvbi5SZWdpb25LaW5kID09PSBSZWdpb25LaW5kICYmIGZpbmFsUmFuZ2Uuc3RhcnQucm93IC0gbGFzdFJlZ2lvbi5yYW5nZS5lbmQucm93ID09PSAxKSB7XG4gICAgICBsYXN0UmVnaW9uLnJhbmdlLmVuZCA9IGZpbmFsUmFuZ2UuZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmh1bmtSZWdpb25zLnB1c2goe1JlZ2lvbktpbmQsIHJhbmdlOiBmaW5hbFJhbmdlfSk7XG4gICAgfVxuICB9XG5cbiAgbWFya0h1bmtSYW5nZShyYW5nZSkge1xuICAgIGxldCBmaW5hbFJhbmdlID0gcmFuZ2U7XG4gICAgaWYgKHRoaXMuaHVua1N0YXJ0T2Zmc2V0ICE9PSAwIHx8IHRoaXMub2Zmc2V0ICE9PSAwKSB7XG4gICAgICBmaW5hbFJhbmdlID0gZmluYWxSYW5nZS50cmFuc2xhdGUoW3RoaXMuaHVua1N0YXJ0T2Zmc2V0LCAwXSwgW3RoaXMub2Zmc2V0LCAwXSk7XG4gICAgfVxuICAgIHRoaXMuaHVua1JhbmdlID0gZmluYWxSYW5nZTtcbiAgfVxuXG4gIGxhdGVzdEh1bmtXYXNJbmNsdWRlZCgpIHtcbiAgICB0aGlzLm5leHRQYXRjaEJ1ZmZlci5idWZmZXIuYXBwZW5kKHRoaXMuaHVua0J1ZmZlclRleHQsIHtub3JtYWxpemVMaW5lRW5kaW5nczogZmFsc2V9KTtcblxuICAgIGNvbnN0IHJlZ2lvbnMgPSB0aGlzLmh1bmtSZWdpb25zLm1hcCgoe1JlZ2lvbktpbmQsIHJhbmdlfSkgPT4ge1xuICAgICAgY29uc3QgcmVnaW9uTWFya2VyID0gdGhpcy5uZXh0UGF0Y2hCdWZmZXIubWFya1JhbmdlKFxuICAgICAgICBSZWdpb25LaW5kLmxheWVyTmFtZSxcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3IFJlZ2lvbktpbmQocmVnaW9uTWFya2VyKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubmV4dFBhdGNoQnVmZmVyLm1hcmtSYW5nZSgnaHVuaycsIHRoaXMuaHVua1JhbmdlLCB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0pO1xuXG4gICAgdGhpcy5odW5rQnVmZmVyVGV4dCA9ICcnO1xuICAgIHRoaXMuaHVua1Jvd0NvdW50ID0gMDtcbiAgICB0aGlzLmh1bmtTdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIHRoaXMuaHVua1JlZ2lvbnMgPSBbXTtcbiAgICB0aGlzLmh1bmtSYW5nZSA9IG51bGw7XG5cbiAgICByZXR1cm4ge3JlZ2lvbnMsIG1hcmtlcn07XG4gIH1cblxuICBsYXRlc3RIdW5rV2FzRGlzY2FyZGVkKCkge1xuICAgIHRoaXMub2Zmc2V0IC09IHRoaXMuaHVua1Jvd0NvdW50O1xuXG4gICAgdGhpcy5odW5rQnVmZmVyVGV4dCA9ICcnO1xuICAgIHRoaXMuaHVua1Jvd0NvdW50ID0gMDtcbiAgICB0aGlzLmh1bmtTdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIHRoaXMuaHVua1JlZ2lvbnMgPSBbXTtcbiAgICB0aGlzLmh1bmtSYW5nZSA9IG51bGw7XG5cbiAgICByZXR1cm4ge3JlZ2lvbnM6IFtdLCBtYXJrZXI6IG51bGx9O1xuICB9XG59XG4iXX0=