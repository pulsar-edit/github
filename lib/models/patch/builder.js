"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFilePatch = buildFilePatch;
exports.buildMultiFilePatch = buildMultiFilePatch;
exports.DEFAULT_OPTIONS = void 0;
var _patchBuffer = _interopRequireDefault(require("./patch-buffer"));
var _hunk = _interopRequireDefault(require("./hunk"));
var _file = _interopRequireWildcard(require("./file"));
var _patch = _interopRequireWildcard(require("./patch"));
var _region = require("./region");
var _filePatch = _interopRequireDefault(require("./file-patch"));
var _multiFilePatch = _interopRequireDefault(require("./multi-file-patch"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const DEFAULT_OPTIONS = {
  // Number of lines after which we consider the diff "large"
  largeDiffThreshold: 800,
  // Map of file path (relative to repository root) to Patch render status (EXPANDED, COLLAPSED, DEFERRED)
  renderStatusOverrides: {},
  // Existing patch buffer to render onto
  patchBuffer: null,
  // Store off what-the-diff file patch
  preserveOriginal: false,
  // Paths of file patches that have been removed from the patch before parsing
  removed: new Set()
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
function buildFilePatch(diffs, options) {
  const opts = _objectSpread({}, DEFAULT_OPTIONS, {}, options);
  const patchBuffer = new _patchBuffer.default();
  let filePatch;
  if (diffs.length === 0) {
    filePatch = emptyDiffFilePatch();
  } else if (diffs.length === 1) {
    filePatch = singleDiffFilePatch(diffs[0], patchBuffer, opts);
  } else if (diffs.length === 2) {
    filePatch = dualDiffFilePatch(diffs[0], diffs[1], patchBuffer, opts);
  } else {
    throw new Error(`Unexpected number of diffs: ${diffs.length}`);
  }

  // Delete the trailing newline.
  patchBuffer.deleteLastNewline();
  return new _multiFilePatch.default({
    patchBuffer,
    filePatches: [filePatch]
  });
}
function buildMultiFilePatch(diffs, options) {
  const opts = _objectSpread({}, DEFAULT_OPTIONS, {}, options);
  const patchBuffer = new _patchBuffer.default();
  const byPath = new Map();
  const actions = [];
  let index = 0;
  for (const diff of diffs) {
    const thePath = diff.oldPath || diff.newPath;
    if (diff.status === 'added' || diff.status === 'deleted') {
      // Potential paired diff. Either a symlink deletion + content addition or a symlink addition +
      // content deletion.
      const otherHalf = byPath.get(thePath);
      if (otherHalf) {
        // The second half. Complete the paired diff, or fail if they have unexpected statuses or modes.
        const [otherDiff, otherIndex] = otherHalf;
        actions[otherIndex] = function (_diff, _otherDiff) {
          return () => dualDiffFilePatch(_diff, _otherDiff, patchBuffer, opts);
        }(diff, otherDiff);
        byPath.delete(thePath);
      } else {
        // The first half we've seen.
        byPath.set(thePath, [diff, index]);
        index++;
      }
    } else {
      actions[index] = function (_diff) {
        return () => singleDiffFilePatch(_diff, patchBuffer, opts);
      }(diff);
      index++;
    }
  }

  // Populate unpaired diffs that looked like they could be part of a pair, but weren't.
  for (const [unpairedDiff, originalIndex] of byPath.values()) {
    actions[originalIndex] = function (_unpairedDiff) {
      return () => singleDiffFilePatch(_unpairedDiff, patchBuffer, opts);
    }(unpairedDiff);
  }
  const filePatches = actions.map(action => action());

  // Delete the final trailing newline from the last non-empty patch.
  patchBuffer.deleteLastNewline();

  // Append hidden patches corresponding to each removed file.
  for (const removedPath of opts.removed) {
    const removedFile = new _file.default({
      path: removedPath
    });
    const removedMarker = patchBuffer.markPosition(_patch.default.layerName, patchBuffer.getBuffer().getEndPosition(), {
      invalidate: 'never',
      exclusive: false
    });
    filePatches.push(_filePatch.default.createHiddenFilePatch(removedFile, removedFile, removedMarker, _patch.REMOVED, /* istanbul ignore next */
    () => {
      throw new Error(`Attempt to expand removed file patch ${removedPath}`);
    }));
  }
  return new _multiFilePatch.default({
    patchBuffer,
    filePatches
  });
}
function emptyDiffFilePatch() {
  return _filePatch.default.createNull();
}
function singleDiffFilePatch(diff, patchBuffer, opts) {
  const wasSymlink = diff.oldMode === _file.default.modes.SYMLINK;
  const isSymlink = diff.newMode === _file.default.modes.SYMLINK;
  let oldSymlink = null;
  let newSymlink = null;
  if (wasSymlink && !isSymlink) {
    oldSymlink = diff.hunks[0].lines[0].slice(1);
  } else if (!wasSymlink && isSymlink) {
    newSymlink = diff.hunks[0].lines[0].slice(1);
  } else if (wasSymlink && isSymlink) {
    oldSymlink = diff.hunks[0].lines[0].slice(1);
    newSymlink = diff.hunks[0].lines[2].slice(1);
  }
  const oldFile = diff.oldPath !== null || diff.oldMode !== null ? new _file.default({
    path: diff.oldPath,
    mode: diff.oldMode,
    symlink: oldSymlink
  }) : _file.nullFile;
  const newFile = diff.newPath !== null || diff.newMode !== null ? new _file.default({
    path: diff.newPath,
    mode: diff.newMode,
    symlink: newSymlink
  }) : _file.nullFile;
  const renderStatusOverride = oldFile.isPresent() && opts.renderStatusOverrides[oldFile.getPath()] || newFile.isPresent() && opts.renderStatusOverrides[newFile.getPath()] || undefined;
  const renderStatus = renderStatusOverride || isDiffLarge([diff], opts) && _patch.DEFERRED || _patch.EXPANDED;
  if (!renderStatus.isVisible()) {
    const patchMarker = patchBuffer.markPosition(_patch.default.layerName, patchBuffer.getBuffer().getEndPosition(), {
      invalidate: 'never',
      exclusive: false
    });
    return _filePatch.default.createHiddenFilePatch(oldFile, newFile, patchMarker, renderStatus, () => {
      const subPatchBuffer = new _patchBuffer.default();
      const [hunks, nextPatchMarker] = buildHunks(diff, subPatchBuffer);
      const nextPatch = new _patch.default({
        status: diff.status,
        hunks,
        marker: nextPatchMarker
      });
      subPatchBuffer.deleteLastNewline();
      return {
        patch: nextPatch,
        patchBuffer: subPatchBuffer
      };
    });
  } else {
    const [hunks, patchMarker] = buildHunks(diff, patchBuffer);
    const patch = new _patch.default({
      status: diff.status,
      hunks,
      marker: patchMarker
    });
    const rawPatches = opts.preserveOriginal ? {
      content: diff
    } : null;
    return new _filePatch.default(oldFile, newFile, patch, rawPatches);
  }
}
function dualDiffFilePatch(diff1, diff2, patchBuffer, opts) {
  let modeChangeDiff, contentChangeDiff;
  if (diff1.oldMode === _file.default.modes.SYMLINK || diff1.newMode === _file.default.modes.SYMLINK) {
    modeChangeDiff = diff1;
    contentChangeDiff = diff2;
  } else {
    modeChangeDiff = diff2;
    contentChangeDiff = diff1;
  }
  const filePath = contentChangeDiff.oldPath || contentChangeDiff.newPath;
  const symlink = modeChangeDiff.hunks[0].lines[0].slice(1);
  let status;
  let oldMode, newMode;
  let oldSymlink = null;
  let newSymlink = null;
  if (modeChangeDiff.status === 'added') {
    // contents were deleted and replaced with symlink
    status = 'deleted';
    oldMode = contentChangeDiff.oldMode;
    newMode = modeChangeDiff.newMode;
    newSymlink = symlink;
  } else if (modeChangeDiff.status === 'deleted') {
    // contents were added after symlink was deleted
    status = 'added';
    oldMode = modeChangeDiff.oldMode;
    oldSymlink = symlink;
    newMode = contentChangeDiff.newMode;
  } else {
    throw new Error(`Invalid mode change diff status: ${modeChangeDiff.status}`);
  }
  const oldFile = new _file.default({
    path: filePath,
    mode: oldMode,
    symlink: oldSymlink
  });
  const newFile = new _file.default({
    path: filePath,
    mode: newMode,
    symlink: newSymlink
  });
  const renderStatus = opts.renderStatusOverrides[filePath] || isDiffLarge([contentChangeDiff], opts) && _patch.DEFERRED || _patch.EXPANDED;
  if (!renderStatus.isVisible()) {
    const patchMarker = patchBuffer.markPosition(_patch.default.layerName, patchBuffer.getBuffer().getEndPosition(), {
      invalidate: 'never',
      exclusive: false
    });
    return _filePatch.default.createHiddenFilePatch(oldFile, newFile, patchMarker, renderStatus, () => {
      const subPatchBuffer = new _patchBuffer.default();
      const [hunks, nextPatchMarker] = buildHunks(contentChangeDiff, subPatchBuffer);
      const nextPatch = new _patch.default({
        status,
        hunks,
        marker: nextPatchMarker
      });
      subPatchBuffer.deleteLastNewline();
      return {
        patch: nextPatch,
        patchBuffer: subPatchBuffer
      };
    });
  } else {
    const [hunks, patchMarker] = buildHunks(contentChangeDiff, patchBuffer);
    const patch = new _patch.default({
      status,
      hunks,
      marker: patchMarker
    });
    const rawPatches = opts.preserveOriginal ? {
      content: contentChangeDiff,
      mode: modeChangeDiff
    } : null;
    return new _filePatch.default(oldFile, newFile, patch, rawPatches);
  }
}
const CHANGEKIND = {
  '+': _region.Addition,
  '-': _region.Deletion,
  ' ': _region.Unchanged,
  '\\': _region.NoNewline
};
function buildHunks(diff, patchBuffer) {
  const inserter = patchBuffer.createInserterAtEnd().keepBefore(patchBuffer.findAllMarkers({
    endPosition: patchBuffer.getInsertionPoint()
  }));
  let patchMarker = null;
  let firstHunk = true;
  const hunks = [];
  inserter.markWhile(_patch.default.layerName, () => {
    for (const rawHunk of diff.hunks) {
      let firstRegion = true;
      const regions = [];

      // Separate hunks with an unmarked newline
      if (firstHunk) {
        firstHunk = false;
      } else {
        inserter.insert('\n');
      }
      inserter.markWhile(_hunk.default.layerName, () => {
        let firstRegionLine = true;
        let currentRegionText = '';
        let CurrentRegionKind = null;
        function finishRegion() {
          if (CurrentRegionKind === null) {
            return;
          }

          // Separate regions with an unmarked newline
          if (firstRegion) {
            firstRegion = false;
          } else {
            inserter.insert('\n');
          }
          inserter.insertMarked(currentRegionText, CurrentRegionKind.layerName, {
            invalidate: 'never',
            exclusive: false,
            callback: function (_regions, _CurrentRegionKind) {
              return regionMarker => {
                _regions.push(new _CurrentRegionKind(regionMarker));
              };
            }(regions, CurrentRegionKind)
          });
        }
        for (const rawLine of rawHunk.lines) {
          const NextRegionKind = CHANGEKIND[rawLine[0]];
          if (NextRegionKind === undefined) {
            throw new Error(`Unknown diff status character: "${rawLine[0]}"`);
          }
          const nextLine = rawLine.slice(1);
          let separator = '';
          if (firstRegionLine) {
            firstRegionLine = false;
          } else {
            separator = '\n';
          }
          if (NextRegionKind === CurrentRegionKind) {
            currentRegionText += separator + nextLine;
            continue;
          } else {
            finishRegion();
            CurrentRegionKind = NextRegionKind;
            currentRegionText = nextLine;
          }
        }
        finishRegion();
      }, {
        invalidate: 'never',
        exclusive: false,
        callback: function (_hunks, _rawHunk, _regions) {
          return hunkMarker => {
            _hunks.push(new _hunk.default({
              oldStartRow: _rawHunk.oldStartLine,
              newStartRow: _rawHunk.newStartLine,
              oldRowCount: _rawHunk.oldLineCount,
              newRowCount: _rawHunk.newLineCount,
              sectionHeading: _rawHunk.heading,
              marker: hunkMarker,
              regions: _regions
            }));
          };
        }(hunks, rawHunk, regions)
      });
    }
  }, {
    invalidate: 'never',
    exclusive: false,
    callback: marker => {
      patchMarker = marker;
    }
  });

  // Separate multiple non-empty patches on the same buffer with an unmarked newline. The newline after the final
  // non-empty patch (if there is one) should be deleted before MultiFilePatch construction.
  if (diff.hunks.length > 0) {
    inserter.insert('\n');
  }
  inserter.apply();
  return [hunks, patchMarker];
}
function isDiffLarge(diffs, opts) {
  const size = diffs.reduce((diffSizeCounter, diff) => {
    return diffSizeCounter + diff.hunks.reduce((hunkSizeCounter, hunk) => {
      return hunkSizeCounter + hunk.lines.length;
    }, 0);
  }, 0);
  return size > opts.largeDiffThreshold;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0Y2hCdWZmZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9odW5rIiwiX2ZpbGUiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wYXRjaCIsIl9yZWdpb24iLCJfZmlsZVBhdGNoIiwiX211bHRpRmlsZVBhdGNoIiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib2JqIiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJvIiwiZmlsdGVyIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJERUZBVUxUX09QVElPTlMiLCJsYXJnZURpZmZUaHJlc2hvbGQiLCJyZW5kZXJTdGF0dXNPdmVycmlkZXMiLCJwYXRjaEJ1ZmZlciIsInByZXNlcnZlT3JpZ2luYWwiLCJyZW1vdmVkIiwiU2V0IiwiZXhwb3J0cyIsImJ1aWxkRmlsZVBhdGNoIiwiZGlmZnMiLCJvcHRpb25zIiwib3B0cyIsIlBhdGNoQnVmZmVyIiwiZmlsZVBhdGNoIiwiZW1wdHlEaWZmRmlsZVBhdGNoIiwic2luZ2xlRGlmZkZpbGVQYXRjaCIsImR1YWxEaWZmRmlsZVBhdGNoIiwiRXJyb3IiLCJkZWxldGVMYXN0TmV3bGluZSIsIk11bHRpRmlsZVBhdGNoIiwiZmlsZVBhdGNoZXMiLCJidWlsZE11bHRpRmlsZVBhdGNoIiwiYnlQYXRoIiwiTWFwIiwiYWN0aW9ucyIsImluZGV4IiwiZGlmZiIsInRoZVBhdGgiLCJvbGRQYXRoIiwibmV3UGF0aCIsInN0YXR1cyIsIm90aGVySGFsZiIsIm90aGVyRGlmZiIsIm90aGVySW5kZXgiLCJfZGlmZiIsIl9vdGhlckRpZmYiLCJkZWxldGUiLCJ1bnBhaXJlZERpZmYiLCJvcmlnaW5hbEluZGV4IiwidmFsdWVzIiwiX3VucGFpcmVkRGlmZiIsIm1hcCIsImFjdGlvbiIsInJlbW92ZWRQYXRoIiwicmVtb3ZlZEZpbGUiLCJGaWxlIiwicGF0aCIsInJlbW92ZWRNYXJrZXIiLCJtYXJrUG9zaXRpb24iLCJQYXRjaCIsImxheWVyTmFtZSIsImdldEJ1ZmZlciIsImdldEVuZFBvc2l0aW9uIiwiaW52YWxpZGF0ZSIsImV4Y2x1c2l2ZSIsIkZpbGVQYXRjaCIsImNyZWF0ZUhpZGRlbkZpbGVQYXRjaCIsIlJFTU9WRUQiLCJjcmVhdGVOdWxsIiwid2FzU3ltbGluayIsIm9sZE1vZGUiLCJtb2RlcyIsIlNZTUxJTksiLCJpc1N5bWxpbmsiLCJuZXdNb2RlIiwib2xkU3ltbGluayIsIm5ld1N5bWxpbmsiLCJodW5rcyIsImxpbmVzIiwic2xpY2UiLCJvbGRGaWxlIiwibW9kZSIsInN5bWxpbmsiLCJudWxsRmlsZSIsIm5ld0ZpbGUiLCJyZW5kZXJTdGF0dXNPdmVycmlkZSIsImlzUHJlc2VudCIsImdldFBhdGgiLCJyZW5kZXJTdGF0dXMiLCJpc0RpZmZMYXJnZSIsIkRFRkVSUkVEIiwiRVhQQU5ERUQiLCJpc1Zpc2libGUiLCJwYXRjaE1hcmtlciIsInN1YlBhdGNoQnVmZmVyIiwibmV4dFBhdGNoTWFya2VyIiwiYnVpbGRIdW5rcyIsIm5leHRQYXRjaCIsIm1hcmtlciIsInBhdGNoIiwicmF3UGF0Y2hlcyIsImNvbnRlbnQiLCJkaWZmMSIsImRpZmYyIiwibW9kZUNoYW5nZURpZmYiLCJjb250ZW50Q2hhbmdlRGlmZiIsImZpbGVQYXRoIiwiQ0hBTkdFS0lORCIsIkFkZGl0aW9uIiwiRGVsZXRpb24iLCJVbmNoYW5nZWQiLCJOb05ld2xpbmUiLCJpbnNlcnRlciIsImNyZWF0ZUluc2VydGVyQXRFbmQiLCJrZWVwQmVmb3JlIiwiZmluZEFsbE1hcmtlcnMiLCJlbmRQb3NpdGlvbiIsImdldEluc2VydGlvblBvaW50IiwiZmlyc3RIdW5rIiwibWFya1doaWxlIiwicmF3SHVuayIsImZpcnN0UmVnaW9uIiwicmVnaW9ucyIsImluc2VydCIsIkh1bmsiLCJmaXJzdFJlZ2lvbkxpbmUiLCJjdXJyZW50UmVnaW9uVGV4dCIsIkN1cnJlbnRSZWdpb25LaW5kIiwiZmluaXNoUmVnaW9uIiwiaW5zZXJ0TWFya2VkIiwiY2FsbGJhY2siLCJfcmVnaW9ucyIsIl9DdXJyZW50UmVnaW9uS2luZCIsInJlZ2lvbk1hcmtlciIsInJhd0xpbmUiLCJOZXh0UmVnaW9uS2luZCIsIm5leHRMaW5lIiwic2VwYXJhdG9yIiwiX2h1bmtzIiwiX3Jhd0h1bmsiLCJodW5rTWFya2VyIiwib2xkU3RhcnRSb3ciLCJvbGRTdGFydExpbmUiLCJuZXdTdGFydFJvdyIsIm5ld1N0YXJ0TGluZSIsIm9sZFJvd0NvdW50Iiwib2xkTGluZUNvdW50IiwibmV3Um93Q291bnQiLCJuZXdMaW5lQ291bnQiLCJzZWN0aW9uSGVhZGluZyIsImhlYWRpbmciLCJzaXplIiwicmVkdWNlIiwiZGlmZlNpemVDb3VudGVyIiwiaHVua1NpemVDb3VudGVyIiwiaHVuayJdLCJzb3VyY2VzIjpbImJ1aWxkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhdGNoQnVmZmVyIGZyb20gJy4vcGF0Y2gtYnVmZmVyJztcbmltcG9ydCBIdW5rIGZyb20gJy4vaHVuayc7XG5pbXBvcnQgRmlsZSwge251bGxGaWxlfSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IFBhdGNoLCB7REVGRVJSRUQsIEVYUEFOREVELCBSRU1PVkVEfSBmcm9tICcuL3BhdGNoJztcbmltcG9ydCB7VW5jaGFuZ2VkLCBBZGRpdGlvbiwgRGVsZXRpb24sIE5vTmV3bGluZX0gZnJvbSAnLi9yZWdpb24nO1xuaW1wb3J0IEZpbGVQYXRjaCBmcm9tICcuL2ZpbGUtcGF0Y2gnO1xuaW1wb3J0IE11bHRpRmlsZVBhdGNoIGZyb20gJy4vbXVsdGktZmlsZS1wYXRjaCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIC8vIE51bWJlciBvZiBsaW5lcyBhZnRlciB3aGljaCB3ZSBjb25zaWRlciB0aGUgZGlmZiBcImxhcmdlXCJcbiAgbGFyZ2VEaWZmVGhyZXNob2xkOiA4MDAsXG5cbiAgLy8gTWFwIG9mIGZpbGUgcGF0aCAocmVsYXRpdmUgdG8gcmVwb3NpdG9yeSByb290KSB0byBQYXRjaCByZW5kZXIgc3RhdHVzIChFWFBBTkRFRCwgQ09MTEFQU0VELCBERUZFUlJFRClcbiAgcmVuZGVyU3RhdHVzT3ZlcnJpZGVzOiB7fSxcblxuICAvLyBFeGlzdGluZyBwYXRjaCBidWZmZXIgdG8gcmVuZGVyIG9udG9cbiAgcGF0Y2hCdWZmZXI6IG51bGwsXG5cbiAgLy8gU3RvcmUgb2ZmIHdoYXQtdGhlLWRpZmYgZmlsZSBwYXRjaFxuICBwcmVzZXJ2ZU9yaWdpbmFsOiBmYWxzZSxcblxuICAvLyBQYXRocyBvZiBmaWxlIHBhdGNoZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXRjaCBiZWZvcmUgcGFyc2luZ1xuICByZW1vdmVkOiBuZXcgU2V0KCksXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGaWxlUGF0Y2goZGlmZnMsIG9wdGlvbnMpIHtcbiAgY29uc3Qgb3B0cyA9IHsuLi5ERUZBVUxUX09QVElPTlMsIC4uLm9wdGlvbnN9O1xuICBjb25zdCBwYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuXG4gIGxldCBmaWxlUGF0Y2g7XG4gIGlmIChkaWZmcy5sZW5ndGggPT09IDApIHtcbiAgICBmaWxlUGF0Y2ggPSBlbXB0eURpZmZGaWxlUGF0Y2goKTtcbiAgfSBlbHNlIGlmIChkaWZmcy5sZW5ndGggPT09IDEpIHtcbiAgICBmaWxlUGF0Y2ggPSBzaW5nbGVEaWZmRmlsZVBhdGNoKGRpZmZzWzBdLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gIH0gZWxzZSBpZiAoZGlmZnMubGVuZ3RoID09PSAyKSB7XG4gICAgZmlsZVBhdGNoID0gZHVhbERpZmZGaWxlUGF0Y2goZGlmZnNbMF0sIGRpZmZzWzFdLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIG51bWJlciBvZiBkaWZmczogJHtkaWZmcy5sZW5ndGh9YCk7XG4gIH1cblxuICAvLyBEZWxldGUgdGhlIHRyYWlsaW5nIG5ld2xpbmUuXG4gIHBhdGNoQnVmZmVyLmRlbGV0ZUxhc3ROZXdsaW5lKCk7XG5cbiAgcmV0dXJuIG5ldyBNdWx0aUZpbGVQYXRjaCh7cGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzOiBbZmlsZVBhdGNoXX0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNdWx0aUZpbGVQYXRjaChkaWZmcywgb3B0aW9ucykge1xuICBjb25zdCBvcHRzID0gey4uLkRFRkFVTFRfT1BUSU9OUywgLi4ub3B0aW9uc307XG5cbiAgY29uc3QgcGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcblxuICBjb25zdCBieVBhdGggPSBuZXcgTWFwKCk7XG4gIGNvbnN0IGFjdGlvbnMgPSBbXTtcblxuICBsZXQgaW5kZXggPSAwO1xuICBmb3IgKGNvbnN0IGRpZmYgb2YgZGlmZnMpIHtcbiAgICBjb25zdCB0aGVQYXRoID0gZGlmZi5vbGRQYXRoIHx8IGRpZmYubmV3UGF0aDtcblxuICAgIGlmIChkaWZmLnN0YXR1cyA9PT0gJ2FkZGVkJyB8fCBkaWZmLnN0YXR1cyA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICAvLyBQb3RlbnRpYWwgcGFpcmVkIGRpZmYuIEVpdGhlciBhIHN5bWxpbmsgZGVsZXRpb24gKyBjb250ZW50IGFkZGl0aW9uIG9yIGEgc3ltbGluayBhZGRpdGlvbiArXG4gICAgICAvLyBjb250ZW50IGRlbGV0aW9uLlxuICAgICAgY29uc3Qgb3RoZXJIYWxmID0gYnlQYXRoLmdldCh0aGVQYXRoKTtcbiAgICAgIGlmIChvdGhlckhhbGYpIHtcbiAgICAgICAgLy8gVGhlIHNlY29uZCBoYWxmLiBDb21wbGV0ZSB0aGUgcGFpcmVkIGRpZmYsIG9yIGZhaWwgaWYgdGhleSBoYXZlIHVuZXhwZWN0ZWQgc3RhdHVzZXMgb3IgbW9kZXMuXG4gICAgICAgIGNvbnN0IFtvdGhlckRpZmYsIG90aGVySW5kZXhdID0gb3RoZXJIYWxmO1xuICAgICAgICBhY3Rpb25zW290aGVySW5kZXhdID0gKGZ1bmN0aW9uKF9kaWZmLCBfb3RoZXJEaWZmKSB7XG4gICAgICAgICAgcmV0dXJuICgpID0+IGR1YWxEaWZmRmlsZVBhdGNoKF9kaWZmLCBfb3RoZXJEaWZmLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gICAgICAgIH0pKGRpZmYsIG90aGVyRGlmZik7XG4gICAgICAgIGJ5UGF0aC5kZWxldGUodGhlUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGUgZmlyc3QgaGFsZiB3ZSd2ZSBzZWVuLlxuICAgICAgICBieVBhdGguc2V0KHRoZVBhdGgsIFtkaWZmLCBpbmRleF0pO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhY3Rpb25zW2luZGV4XSA9IChmdW5jdGlvbihfZGlmZikge1xuICAgICAgICByZXR1cm4gKCkgPT4gc2luZ2xlRGlmZkZpbGVQYXRjaChfZGlmZiwgcGF0Y2hCdWZmZXIsIG9wdHMpO1xuICAgICAgfSkoZGlmZik7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBvcHVsYXRlIHVucGFpcmVkIGRpZmZzIHRoYXQgbG9va2VkIGxpa2UgdGhleSBjb3VsZCBiZSBwYXJ0IG9mIGEgcGFpciwgYnV0IHdlcmVuJ3QuXG4gIGZvciAoY29uc3QgW3VucGFpcmVkRGlmZiwgb3JpZ2luYWxJbmRleF0gb2YgYnlQYXRoLnZhbHVlcygpKSB7XG4gICAgYWN0aW9uc1tvcmlnaW5hbEluZGV4XSA9IChmdW5jdGlvbihfdW5wYWlyZWREaWZmKSB7XG4gICAgICByZXR1cm4gKCkgPT4gc2luZ2xlRGlmZkZpbGVQYXRjaChfdW5wYWlyZWREaWZmLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gICAgfSkodW5wYWlyZWREaWZmKTtcbiAgfVxuXG4gIGNvbnN0IGZpbGVQYXRjaGVzID0gYWN0aW9ucy5tYXAoYWN0aW9uID0+IGFjdGlvbigpKTtcblxuICAvLyBEZWxldGUgdGhlIGZpbmFsIHRyYWlsaW5nIG5ld2xpbmUgZnJvbSB0aGUgbGFzdCBub24tZW1wdHkgcGF0Y2guXG4gIHBhdGNoQnVmZmVyLmRlbGV0ZUxhc3ROZXdsaW5lKCk7XG5cbiAgLy8gQXBwZW5kIGhpZGRlbiBwYXRjaGVzIGNvcnJlc3BvbmRpbmcgdG8gZWFjaCByZW1vdmVkIGZpbGUuXG4gIGZvciAoY29uc3QgcmVtb3ZlZFBhdGggb2Ygb3B0cy5yZW1vdmVkKSB7XG4gICAgY29uc3QgcmVtb3ZlZEZpbGUgPSBuZXcgRmlsZSh7cGF0aDogcmVtb3ZlZFBhdGh9KTtcbiAgICBjb25zdCByZW1vdmVkTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgcGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuICAgIGZpbGVQYXRjaGVzLnB1c2goRmlsZVBhdGNoLmNyZWF0ZUhpZGRlbkZpbGVQYXRjaChcbiAgICAgIHJlbW92ZWRGaWxlLFxuICAgICAgcmVtb3ZlZEZpbGUsXG4gICAgICByZW1vdmVkTWFya2VyLFxuICAgICAgUkVNT1ZFRCxcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAoKSA9PiB7IHRocm93IG5ldyBFcnJvcihgQXR0ZW1wdCB0byBleHBhbmQgcmVtb3ZlZCBmaWxlIHBhdGNoICR7cmVtb3ZlZFBhdGh9YCk7IH0sXG4gICAgKSk7XG4gIH1cblxuICByZXR1cm4gbmV3IE11bHRpRmlsZVBhdGNoKHtwYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXN9KTtcbn1cblxuZnVuY3Rpb24gZW1wdHlEaWZmRmlsZVBhdGNoKCkge1xuICByZXR1cm4gRmlsZVBhdGNoLmNyZWF0ZU51bGwoKTtcbn1cblxuZnVuY3Rpb24gc2luZ2xlRGlmZkZpbGVQYXRjaChkaWZmLCBwYXRjaEJ1ZmZlciwgb3B0cykge1xuICBjb25zdCB3YXNTeW1saW5rID0gZGlmZi5vbGRNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTks7XG4gIGNvbnN0IGlzU3ltbGluayA9IGRpZmYubmV3TW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LO1xuXG4gIGxldCBvbGRTeW1saW5rID0gbnVsbDtcbiAgbGV0IG5ld1N5bWxpbmsgPSBudWxsO1xuICBpZiAod2FzU3ltbGluayAmJiAhaXNTeW1saW5rKSB7XG4gICAgb2xkU3ltbGluayA9IGRpZmYuaHVua3NbMF0ubGluZXNbMF0uc2xpY2UoMSk7XG4gIH0gZWxzZSBpZiAoIXdhc1N5bWxpbmsgJiYgaXNTeW1saW5rKSB7XG4gICAgbmV3U3ltbGluayA9IGRpZmYuaHVua3NbMF0ubGluZXNbMF0uc2xpY2UoMSk7XG4gIH0gZWxzZSBpZiAod2FzU3ltbGluayAmJiBpc1N5bWxpbmspIHtcbiAgICBvbGRTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgICBuZXdTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1syXS5zbGljZSgxKTtcbiAgfVxuXG4gIGNvbnN0IG9sZEZpbGUgPSBkaWZmLm9sZFBhdGggIT09IG51bGwgfHwgZGlmZi5vbGRNb2RlICE9PSBudWxsXG4gICAgPyBuZXcgRmlsZSh7cGF0aDogZGlmZi5vbGRQYXRoLCBtb2RlOiBkaWZmLm9sZE1vZGUsIHN5bWxpbms6IG9sZFN5bWxpbmt9KVxuICAgIDogbnVsbEZpbGU7XG4gIGNvbnN0IG5ld0ZpbGUgPSBkaWZmLm5ld1BhdGggIT09IG51bGwgfHwgZGlmZi5uZXdNb2RlICE9PSBudWxsXG4gICAgPyBuZXcgRmlsZSh7cGF0aDogZGlmZi5uZXdQYXRoLCBtb2RlOiBkaWZmLm5ld01vZGUsIHN5bWxpbms6IG5ld1N5bWxpbmt9KVxuICAgIDogbnVsbEZpbGU7XG5cbiAgY29uc3QgcmVuZGVyU3RhdHVzT3ZlcnJpZGUgPVxuICAgIChvbGRGaWxlLmlzUHJlc2VudCgpICYmIG9wdHMucmVuZGVyU3RhdHVzT3ZlcnJpZGVzW29sZEZpbGUuZ2V0UGF0aCgpXSkgfHxcbiAgICAobmV3RmlsZS5pc1ByZXNlbnQoKSAmJiBvcHRzLnJlbmRlclN0YXR1c092ZXJyaWRlc1tuZXdGaWxlLmdldFBhdGgoKV0pIHx8XG4gICAgdW5kZWZpbmVkO1xuXG4gIGNvbnN0IHJlbmRlclN0YXR1cyA9IHJlbmRlclN0YXR1c092ZXJyaWRlIHx8XG4gICAgKGlzRGlmZkxhcmdlKFtkaWZmXSwgb3B0cykgJiYgREVGRVJSRUQpIHx8XG4gICAgRVhQQU5ERUQ7XG5cbiAgaWYgKCFyZW5kZXJTdGF0dXMuaXNWaXNpYmxlKCkpIHtcbiAgICBjb25zdCBwYXRjaE1hcmtlciA9IHBhdGNoQnVmZmVyLm1hcmtQb3NpdGlvbihcbiAgICAgIFBhdGNoLmxheWVyTmFtZSxcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCksXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcblxuICAgIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgb2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2hNYXJrZXIsIHJlbmRlclN0YXR1cyxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViUGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICAgICAgY29uc3QgW2h1bmtzLCBuZXh0UGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhkaWZmLCBzdWJQYXRjaEJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IG5leHRQYXRjaCA9IG5ldyBQYXRjaCh7c3RhdHVzOiBkaWZmLnN0YXR1cywgaHVua3MsIG1hcmtlcjogbmV4dFBhdGNoTWFya2VyfSk7XG5cbiAgICAgICAgc3ViUGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcbiAgICAgICAgcmV0dXJuIHtwYXRjaDogbmV4dFBhdGNoLCBwYXRjaEJ1ZmZlcjogc3ViUGF0Y2hCdWZmZXJ9O1xuICAgICAgfSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFtodW5rcywgcGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhkaWZmLCBwYXRjaEJ1ZmZlcik7XG4gICAgY29uc3QgcGF0Y2ggPSBuZXcgUGF0Y2goe3N0YXR1czogZGlmZi5zdGF0dXMsIGh1bmtzLCBtYXJrZXI6IHBhdGNoTWFya2VyfSk7XG5cbiAgICBjb25zdCByYXdQYXRjaGVzID0gb3B0cy5wcmVzZXJ2ZU9yaWdpbmFsID8ge2NvbnRlbnQ6IGRpZmZ9IDogbnVsbDtcbiAgICByZXR1cm4gbmV3IEZpbGVQYXRjaChvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaCwgcmF3UGF0Y2hlcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZHVhbERpZmZGaWxlUGF0Y2goZGlmZjEsIGRpZmYyLCBwYXRjaEJ1ZmZlciwgb3B0cykge1xuICBsZXQgbW9kZUNoYW5nZURpZmYsIGNvbnRlbnRDaGFuZ2VEaWZmO1xuICBpZiAoZGlmZjEub2xkTW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LIHx8IGRpZmYxLm5ld01vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSykge1xuICAgIG1vZGVDaGFuZ2VEaWZmID0gZGlmZjE7XG4gICAgY29udGVudENoYW5nZURpZmYgPSBkaWZmMjtcbiAgfSBlbHNlIHtcbiAgICBtb2RlQ2hhbmdlRGlmZiA9IGRpZmYyO1xuICAgIGNvbnRlbnRDaGFuZ2VEaWZmID0gZGlmZjE7XG4gIH1cblxuICBjb25zdCBmaWxlUGF0aCA9IGNvbnRlbnRDaGFuZ2VEaWZmLm9sZFBhdGggfHwgY29udGVudENoYW5nZURpZmYubmV3UGF0aDtcbiAgY29uc3Qgc3ltbGluayA9IG1vZGVDaGFuZ2VEaWZmLmh1bmtzWzBdLmxpbmVzWzBdLnNsaWNlKDEpO1xuXG4gIGxldCBzdGF0dXM7XG4gIGxldCBvbGRNb2RlLCBuZXdNb2RlO1xuICBsZXQgb2xkU3ltbGluayA9IG51bGw7XG4gIGxldCBuZXdTeW1saW5rID0gbnVsbDtcbiAgaWYgKG1vZGVDaGFuZ2VEaWZmLnN0YXR1cyA9PT0gJ2FkZGVkJykge1xuICAgIC8vIGNvbnRlbnRzIHdlcmUgZGVsZXRlZCBhbmQgcmVwbGFjZWQgd2l0aCBzeW1saW5rXG4gICAgc3RhdHVzID0gJ2RlbGV0ZWQnO1xuICAgIG9sZE1vZGUgPSBjb250ZW50Q2hhbmdlRGlmZi5vbGRNb2RlO1xuICAgIG5ld01vZGUgPSBtb2RlQ2hhbmdlRGlmZi5uZXdNb2RlO1xuICAgIG5ld1N5bWxpbmsgPSBzeW1saW5rO1xuICB9IGVsc2UgaWYgKG1vZGVDaGFuZ2VEaWZmLnN0YXR1cyA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgLy8gY29udGVudHMgd2VyZSBhZGRlZCBhZnRlciBzeW1saW5rIHdhcyBkZWxldGVkXG4gICAgc3RhdHVzID0gJ2FkZGVkJztcbiAgICBvbGRNb2RlID0gbW9kZUNoYW5nZURpZmYub2xkTW9kZTtcbiAgICBvbGRTeW1saW5rID0gc3ltbGluaztcbiAgICBuZXdNb2RlID0gY29udGVudENoYW5nZURpZmYubmV3TW9kZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbW9kZSBjaGFuZ2UgZGlmZiBzdGF0dXM6ICR7bW9kZUNoYW5nZURpZmYuc3RhdHVzfWApO1xuICB9XG5cbiAgY29uc3Qgb2xkRmlsZSA9IG5ldyBGaWxlKHtwYXRoOiBmaWxlUGF0aCwgbW9kZTogb2xkTW9kZSwgc3ltbGluazogb2xkU3ltbGlua30pO1xuICBjb25zdCBuZXdGaWxlID0gbmV3IEZpbGUoe3BhdGg6IGZpbGVQYXRoLCBtb2RlOiBuZXdNb2RlLCBzeW1saW5rOiBuZXdTeW1saW5rfSk7XG5cbiAgY29uc3QgcmVuZGVyU3RhdHVzID0gb3B0cy5yZW5kZXJTdGF0dXNPdmVycmlkZXNbZmlsZVBhdGhdIHx8XG4gICAgKGlzRGlmZkxhcmdlKFtjb250ZW50Q2hhbmdlRGlmZl0sIG9wdHMpICYmIERFRkVSUkVEKSB8fFxuICAgIEVYUEFOREVEO1xuXG4gIGlmICghcmVuZGVyU3RhdHVzLmlzVmlzaWJsZSgpKSB7XG4gICAgY29uc3QgcGF0Y2hNYXJrZXIgPSBwYXRjaEJ1ZmZlci5tYXJrUG9zaXRpb24oXG4gICAgICBQYXRjaC5sYXllck5hbWUsXG4gICAgICBwYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRFbmRQb3NpdGlvbigpLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG5cbiAgICByZXR1cm4gRmlsZVBhdGNoLmNyZWF0ZUhpZGRlbkZpbGVQYXRjaChcbiAgICAgIG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoTWFya2VyLCByZW5kZXJTdGF0dXMsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YlBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgICAgIGNvbnN0IFtodW5rcywgbmV4dFBhdGNoTWFya2VyXSA9IGJ1aWxkSHVua3MoY29udGVudENoYW5nZURpZmYsIHN1YlBhdGNoQnVmZmVyKTtcbiAgICAgICAgY29uc3QgbmV4dFBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXMsIGh1bmtzLCBtYXJrZXI6IG5leHRQYXRjaE1hcmtlcn0pO1xuXG4gICAgICAgIHN1YlBhdGNoQnVmZmVyLmRlbGV0ZUxhc3ROZXdsaW5lKCk7XG4gICAgICAgIHJldHVybiB7cGF0Y2g6IG5leHRQYXRjaCwgcGF0Y2hCdWZmZXI6IHN1YlBhdGNoQnVmZmVyfTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBbaHVua3MsIHBhdGNoTWFya2VyXSA9IGJ1aWxkSHVua3MoY29udGVudENoYW5nZURpZmYsIHBhdGNoQnVmZmVyKTtcbiAgICBjb25zdCBwYXRjaCA9IG5ldyBQYXRjaCh7c3RhdHVzLCBodW5rcywgbWFya2VyOiBwYXRjaE1hcmtlcn0pO1xuXG4gICAgY29uc3QgcmF3UGF0Y2hlcyA9IG9wdHMucHJlc2VydmVPcmlnaW5hbCA/IHtjb250ZW50OiBjb250ZW50Q2hhbmdlRGlmZiwgbW9kZTogbW9kZUNoYW5nZURpZmZ9IDogbnVsbDtcbiAgICByZXR1cm4gbmV3IEZpbGVQYXRjaChvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaCwgcmF3UGF0Y2hlcyk7XG4gIH1cbn1cblxuY29uc3QgQ0hBTkdFS0lORCA9IHtcbiAgJysnOiBBZGRpdGlvbixcbiAgJy0nOiBEZWxldGlvbixcbiAgJyAnOiBVbmNoYW5nZWQsXG4gICdcXFxcJzogTm9OZXdsaW5lLFxufTtcblxuZnVuY3Rpb24gYnVpbGRIdW5rcyhkaWZmLCBwYXRjaEJ1ZmZlcikge1xuICBjb25zdCBpbnNlcnRlciA9IHBhdGNoQnVmZmVyLmNyZWF0ZUluc2VydGVyQXRFbmQoKVxuICAgIC5rZWVwQmVmb3JlKHBhdGNoQnVmZmVyLmZpbmRBbGxNYXJrZXJzKHtlbmRQb3NpdGlvbjogcGF0Y2hCdWZmZXIuZ2V0SW5zZXJ0aW9uUG9pbnQoKX0pKTtcblxuICBsZXQgcGF0Y2hNYXJrZXIgPSBudWxsO1xuICBsZXQgZmlyc3RIdW5rID0gdHJ1ZTtcbiAgY29uc3QgaHVua3MgPSBbXTtcblxuICBpbnNlcnRlci5tYXJrV2hpbGUoUGF0Y2gubGF5ZXJOYW1lLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCByYXdIdW5rIG9mIGRpZmYuaHVua3MpIHtcbiAgICAgIGxldCBmaXJzdFJlZ2lvbiA9IHRydWU7XG4gICAgICBjb25zdCByZWdpb25zID0gW107XG5cbiAgICAgIC8vIFNlcGFyYXRlIGh1bmtzIHdpdGggYW4gdW5tYXJrZWQgbmV3bGluZVxuICAgICAgaWYgKGZpcnN0SHVuaykge1xuICAgICAgICBmaXJzdEh1bmsgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gICAgICB9XG5cbiAgICAgIGluc2VydGVyLm1hcmtXaGlsZShIdW5rLmxheWVyTmFtZSwgKCkgPT4ge1xuICAgICAgICBsZXQgZmlyc3RSZWdpb25MaW5lID0gdHJ1ZTtcbiAgICAgICAgbGV0IGN1cnJlbnRSZWdpb25UZXh0ID0gJyc7XG4gICAgICAgIGxldCBDdXJyZW50UmVnaW9uS2luZCA9IG51bGw7XG5cbiAgICAgICAgZnVuY3Rpb24gZmluaXNoUmVnaW9uKCkge1xuICAgICAgICAgIGlmIChDdXJyZW50UmVnaW9uS2luZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNlcGFyYXRlIHJlZ2lvbnMgd2l0aCBhbiB1bm1hcmtlZCBuZXdsaW5lXG4gICAgICAgICAgaWYgKGZpcnN0UmVnaW9uKSB7XG4gICAgICAgICAgICBmaXJzdFJlZ2lvbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnNlcnRlci5pbnNlcnQoJ1xcbicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluc2VydGVyLmluc2VydE1hcmtlZChjdXJyZW50UmVnaW9uVGV4dCwgQ3VycmVudFJlZ2lvbktpbmQubGF5ZXJOYW1lLCB7XG4gICAgICAgICAgICBpbnZhbGlkYXRlOiAnbmV2ZXInLFxuICAgICAgICAgICAgZXhjbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24oX3JlZ2lvbnMsIF9DdXJyZW50UmVnaW9uS2luZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVnaW9uTWFya2VyID0+IHsgX3JlZ2lvbnMucHVzaChuZXcgX0N1cnJlbnRSZWdpb25LaW5kKHJlZ2lvbk1hcmtlcikpOyB9O1xuICAgICAgICAgICAgfSkocmVnaW9ucywgQ3VycmVudFJlZ2lvbktpbmQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCByYXdMaW5lIG9mIHJhd0h1bmsubGluZXMpIHtcbiAgICAgICAgICBjb25zdCBOZXh0UmVnaW9uS2luZCA9IENIQU5HRUtJTkRbcmF3TGluZVswXV07XG4gICAgICAgICAgaWYgKE5leHRSZWdpb25LaW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBkaWZmIHN0YXR1cyBjaGFyYWN0ZXI6IFwiJHtyYXdMaW5lWzBdfVwiYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG5leHRMaW5lID0gcmF3TGluZS5zbGljZSgxKTtcblxuICAgICAgICAgIGxldCBzZXBhcmF0b3IgPSAnJztcbiAgICAgICAgICBpZiAoZmlyc3RSZWdpb25MaW5lKSB7XG4gICAgICAgICAgICBmaXJzdFJlZ2lvbkxpbmUgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VwYXJhdG9yID0gJ1xcbic7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKE5leHRSZWdpb25LaW5kID09PSBDdXJyZW50UmVnaW9uS2luZCkge1xuICAgICAgICAgICAgY3VycmVudFJlZ2lvblRleHQgKz0gc2VwYXJhdG9yICsgbmV4dExpbmU7XG5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5pc2hSZWdpb24oKTtcblxuICAgICAgICAgICAgQ3VycmVudFJlZ2lvbktpbmQgPSBOZXh0UmVnaW9uS2luZDtcbiAgICAgICAgICAgIGN1cnJlbnRSZWdpb25UZXh0ID0gbmV4dExpbmU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpbmlzaFJlZ2lvbigpO1xuICAgICAgfSwge1xuICAgICAgICBpbnZhbGlkYXRlOiAnbmV2ZXInLFxuICAgICAgICBleGNsdXNpdmU6IGZhbHNlLFxuICAgICAgICBjYWxsYmFjazogKGZ1bmN0aW9uKF9odW5rcywgX3Jhd0h1bmssIF9yZWdpb25zKSB7XG4gICAgICAgICAgcmV0dXJuIGh1bmtNYXJrZXIgPT4ge1xuICAgICAgICAgICAgX2h1bmtzLnB1c2gobmV3IEh1bmsoe1xuICAgICAgICAgICAgICBvbGRTdGFydFJvdzogX3Jhd0h1bmsub2xkU3RhcnRMaW5lLFxuICAgICAgICAgICAgICBuZXdTdGFydFJvdzogX3Jhd0h1bmsubmV3U3RhcnRMaW5lLFxuICAgICAgICAgICAgICBvbGRSb3dDb3VudDogX3Jhd0h1bmsub2xkTGluZUNvdW50LFxuICAgICAgICAgICAgICBuZXdSb3dDb3VudDogX3Jhd0h1bmsubmV3TGluZUNvdW50LFxuICAgICAgICAgICAgICBzZWN0aW9uSGVhZGluZzogX3Jhd0h1bmsuaGVhZGluZyxcbiAgICAgICAgICAgICAgbWFya2VyOiBodW5rTWFya2VyLFxuICAgICAgICAgICAgICByZWdpb25zOiBfcmVnaW9ucyxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KShodW5rcywgcmF3SHVuaywgcmVnaW9ucyksXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBpbnZhbGlkYXRlOiAnbmV2ZXInLFxuICAgIGV4Y2x1c2l2ZTogZmFsc2UsXG4gICAgY2FsbGJhY2s6IG1hcmtlciA9PiB7IHBhdGNoTWFya2VyID0gbWFya2VyOyB9LFxuICB9KTtcblxuICAvLyBTZXBhcmF0ZSBtdWx0aXBsZSBub24tZW1wdHkgcGF0Y2hlcyBvbiB0aGUgc2FtZSBidWZmZXIgd2l0aCBhbiB1bm1hcmtlZCBuZXdsaW5lLiBUaGUgbmV3bGluZSBhZnRlciB0aGUgZmluYWxcbiAgLy8gbm9uLWVtcHR5IHBhdGNoIChpZiB0aGVyZSBpcyBvbmUpIHNob3VsZCBiZSBkZWxldGVkIGJlZm9yZSBNdWx0aUZpbGVQYXRjaCBjb25zdHJ1Y3Rpb24uXG4gIGlmIChkaWZmLmh1bmtzLmxlbmd0aCA+IDApIHtcbiAgICBpbnNlcnRlci5pbnNlcnQoJ1xcbicpO1xuICB9XG5cbiAgaW5zZXJ0ZXIuYXBwbHkoKTtcblxuICByZXR1cm4gW2h1bmtzLCBwYXRjaE1hcmtlcl07XG59XG5cbmZ1bmN0aW9uIGlzRGlmZkxhcmdlKGRpZmZzLCBvcHRzKSB7XG4gIGNvbnN0IHNpemUgPSBkaWZmcy5yZWR1Y2UoKGRpZmZTaXplQ291bnRlciwgZGlmZikgPT4ge1xuICAgIHJldHVybiBkaWZmU2l6ZUNvdW50ZXIgKyBkaWZmLmh1bmtzLnJlZHVjZSgoaHVua1NpemVDb3VudGVyLCBodW5rKSA9PiB7XG4gICAgICByZXR1cm4gaHVua1NpemVDb3VudGVyICsgaHVuay5saW5lcy5sZW5ndGg7XG4gICAgfSwgMCk7XG4gIH0sIDApO1xuXG4gIHJldHVybiBzaXplID4gb3B0cy5sYXJnZURpZmZUaHJlc2hvbGQ7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBQUEsWUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsS0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsS0FBQSxHQUFBQyx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUksTUFBQSxHQUFBRCx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUssT0FBQSxHQUFBTCxPQUFBO0FBQ0EsSUFBQU0sVUFBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU8sZUFBQSxHQUFBUixzQkFBQSxDQUFBQyxPQUFBO0FBQWdELFNBQUFRLHlCQUFBQyxDQUFBLDZCQUFBQyxPQUFBLG1CQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFGLHdCQUFBLFlBQUFBLENBQUFDLENBQUEsV0FBQUEsQ0FBQSxHQUFBRyxDQUFBLEdBQUFELENBQUEsS0FBQUYsQ0FBQTtBQUFBLFNBQUFOLHdCQUFBTSxDQUFBLEVBQUFFLENBQUEsU0FBQUEsQ0FBQSxJQUFBRixDQUFBLElBQUFBLENBQUEsQ0FBQUksVUFBQSxTQUFBSixDQUFBLGVBQUFBLENBQUEsdUJBQUFBLENBQUEseUJBQUFBLENBQUEsV0FBQUssT0FBQSxFQUFBTCxDQUFBLFFBQUFHLENBQUEsR0FBQUosd0JBQUEsQ0FBQUcsQ0FBQSxPQUFBQyxDQUFBLElBQUFBLENBQUEsQ0FBQUcsR0FBQSxDQUFBTixDQUFBLFVBQUFHLENBQUEsQ0FBQUksR0FBQSxDQUFBUCxDQUFBLE9BQUFRLENBQUEsS0FBQUMsU0FBQSxVQUFBQyxDQUFBLEdBQUFDLE1BQUEsQ0FBQUMsY0FBQSxJQUFBRCxNQUFBLENBQUFFLHdCQUFBLFdBQUFDLENBQUEsSUFBQWQsQ0FBQSxvQkFBQWMsQ0FBQSxJQUFBSCxNQUFBLENBQUFJLFNBQUEsQ0FBQUMsY0FBQSxDQUFBQyxJQUFBLENBQUFqQixDQUFBLEVBQUFjLENBQUEsU0FBQUksQ0FBQSxHQUFBUixDQUFBLEdBQUFDLE1BQUEsQ0FBQUUsd0JBQUEsQ0FBQWIsQ0FBQSxFQUFBYyxDQUFBLFVBQUFJLENBQUEsS0FBQUEsQ0FBQSxDQUFBWCxHQUFBLElBQUFXLENBQUEsQ0FBQUMsR0FBQSxJQUFBUixNQUFBLENBQUFDLGNBQUEsQ0FBQUosQ0FBQSxFQUFBTSxDQUFBLEVBQUFJLENBQUEsSUFBQVYsQ0FBQSxDQUFBTSxDQUFBLElBQUFkLENBQUEsQ0FBQWMsQ0FBQSxZQUFBTixDQUFBLENBQUFILE9BQUEsR0FBQUwsQ0FBQSxFQUFBRyxDQUFBLElBQUFBLENBQUEsQ0FBQWdCLEdBQUEsQ0FBQW5CLENBQUEsRUFBQVEsQ0FBQSxHQUFBQSxDQUFBO0FBQUEsU0FBQWxCLHVCQUFBOEIsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQWhCLFVBQUEsR0FBQWdCLEdBQUEsS0FBQWYsT0FBQSxFQUFBZSxHQUFBO0FBQUEsU0FBQUMsUUFBQXJCLENBQUEsRUFBQUUsQ0FBQSxRQUFBQyxDQUFBLEdBQUFRLE1BQUEsQ0FBQVcsSUFBQSxDQUFBdEIsQ0FBQSxPQUFBVyxNQUFBLENBQUFZLHFCQUFBLFFBQUFDLENBQUEsR0FBQWIsTUFBQSxDQUFBWSxxQkFBQSxDQUFBdkIsQ0FBQSxHQUFBRSxDQUFBLEtBQUFzQixDQUFBLEdBQUFBLENBQUEsQ0FBQUMsTUFBQSxXQUFBdkIsQ0FBQSxXQUFBUyxNQUFBLENBQUFFLHdCQUFBLENBQUFiLENBQUEsRUFBQUUsQ0FBQSxFQUFBd0IsVUFBQSxPQUFBdkIsQ0FBQSxDQUFBd0IsSUFBQSxDQUFBQyxLQUFBLENBQUF6QixDQUFBLEVBQUFxQixDQUFBLFlBQUFyQixDQUFBO0FBQUEsU0FBQTBCLGNBQUE3QixDQUFBLGFBQUFFLENBQUEsTUFBQUEsQ0FBQSxHQUFBNEIsU0FBQSxDQUFBQyxNQUFBLEVBQUE3QixDQUFBLFVBQUFDLENBQUEsV0FBQTJCLFNBQUEsQ0FBQTVCLENBQUEsSUFBQTRCLFNBQUEsQ0FBQTVCLENBQUEsUUFBQUEsQ0FBQSxPQUFBbUIsT0FBQSxDQUFBVixNQUFBLENBQUFSLENBQUEsT0FBQTZCLE9BQUEsV0FBQTlCLENBQUEsSUFBQStCLGVBQUEsQ0FBQWpDLENBQUEsRUFBQUUsQ0FBQSxFQUFBQyxDQUFBLENBQUFELENBQUEsU0FBQVMsTUFBQSxDQUFBdUIseUJBQUEsR0FBQXZCLE1BQUEsQ0FBQXdCLGdCQUFBLENBQUFuQyxDQUFBLEVBQUFXLE1BQUEsQ0FBQXVCLHlCQUFBLENBQUEvQixDQUFBLEtBQUFrQixPQUFBLENBQUFWLE1BQUEsQ0FBQVIsQ0FBQSxHQUFBNkIsT0FBQSxXQUFBOUIsQ0FBQSxJQUFBUyxNQUFBLENBQUFDLGNBQUEsQ0FBQVosQ0FBQSxFQUFBRSxDQUFBLEVBQUFTLE1BQUEsQ0FBQUUsd0JBQUEsQ0FBQVYsQ0FBQSxFQUFBRCxDQUFBLGlCQUFBRixDQUFBO0FBQUEsU0FBQWlDLGdCQUFBYixHQUFBLEVBQUFnQixHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBaEIsR0FBQSxJQUFBVCxNQUFBLENBQUFDLGNBQUEsQ0FBQVEsR0FBQSxFQUFBZ0IsR0FBQSxJQUFBQyxLQUFBLEVBQUFBLEtBQUEsRUFBQVgsVUFBQSxRQUFBYSxZQUFBLFFBQUFDLFFBQUEsb0JBQUFwQixHQUFBLENBQUFnQixHQUFBLElBQUFDLEtBQUEsV0FBQWpCLEdBQUE7QUFBQSxTQUFBa0IsZUFBQUcsR0FBQSxRQUFBTCxHQUFBLEdBQUFNLFlBQUEsQ0FBQUQsR0FBQSwyQkFBQUwsR0FBQSxnQkFBQUEsR0FBQSxHQUFBTyxNQUFBLENBQUFQLEdBQUE7QUFBQSxTQUFBTSxhQUFBRSxLQUFBLEVBQUFDLElBQUEsZUFBQUQsS0FBQSxpQkFBQUEsS0FBQSxrQkFBQUEsS0FBQSxNQUFBRSxJQUFBLEdBQUFGLEtBQUEsQ0FBQUcsTUFBQSxDQUFBQyxXQUFBLE9BQUFGLElBQUEsS0FBQUcsU0FBQSxRQUFBQyxHQUFBLEdBQUFKLElBQUEsQ0FBQTdCLElBQUEsQ0FBQTJCLEtBQUEsRUFBQUMsSUFBQSwyQkFBQUssR0FBQSxzQkFBQUEsR0FBQSxZQUFBQyxTQUFBLDREQUFBTixJQUFBLGdCQUFBRixNQUFBLEdBQUFTLE1BQUEsRUFBQVIsS0FBQTtBQUV6QyxNQUFNUyxlQUFlLEdBQUc7RUFDN0I7RUFDQUMsa0JBQWtCLEVBQUUsR0FBRztFQUV2QjtFQUNBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7RUFFekI7RUFDQUMsV0FBVyxFQUFFLElBQUk7RUFFakI7RUFDQUMsZ0JBQWdCLEVBQUUsS0FBSztFQUV2QjtFQUNBQyxPQUFPLEVBQUUsSUFBSUMsR0FBRyxDQUFDO0FBQ25CLENBQUM7QUFBQ0MsT0FBQSxDQUFBUCxlQUFBLEdBQUFBLGVBQUE7QUFFSyxTQUFTUSxjQUFjQSxDQUFDQyxLQUFLLEVBQUVDLE9BQU8sRUFBRTtFQUM3QyxNQUFNQyxJQUFJLEdBQUFuQyxhQUFBLEtBQU93QixlQUFlLE1BQUtVLE9BQU8sQ0FBQztFQUM3QyxNQUFNUCxXQUFXLEdBQUcsSUFBSVMsb0JBQVcsQ0FBQyxDQUFDO0VBRXJDLElBQUlDLFNBQVM7RUFDYixJQUFJSixLQUFLLENBQUMvQixNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQ3RCbUMsU0FBUyxHQUFHQyxrQkFBa0IsQ0FBQyxDQUFDO0VBQ2xDLENBQUMsTUFBTSxJQUFJTCxLQUFLLENBQUMvQixNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQzdCbUMsU0FBUyxHQUFHRSxtQkFBbUIsQ0FBQ04sS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFTixXQUFXLEVBQUVRLElBQUksQ0FBQztFQUM5RCxDQUFDLE1BQU0sSUFBSUYsS0FBSyxDQUFDL0IsTUFBTSxLQUFLLENBQUMsRUFBRTtJQUM3Qm1DLFNBQVMsR0FBR0csaUJBQWlCLENBQUNQLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFTixXQUFXLEVBQUVRLElBQUksQ0FBQztFQUN0RSxDQUFDLE1BQU07SUFDTCxNQUFNLElBQUlNLEtBQUssQ0FBRSwrQkFBOEJSLEtBQUssQ0FBQy9CLE1BQU8sRUFBQyxDQUFDO0VBQ2hFOztFQUVBO0VBQ0F5QixXQUFXLENBQUNlLGlCQUFpQixDQUFDLENBQUM7RUFFL0IsT0FBTyxJQUFJQyx1QkFBYyxDQUFDO0lBQUNoQixXQUFXO0lBQUVpQixXQUFXLEVBQUUsQ0FBQ1AsU0FBUztFQUFDLENBQUMsQ0FBQztBQUNwRTtBQUVPLFNBQVNRLG1CQUFtQkEsQ0FBQ1osS0FBSyxFQUFFQyxPQUFPLEVBQUU7RUFDbEQsTUFBTUMsSUFBSSxHQUFBbkMsYUFBQSxLQUFPd0IsZUFBZSxNQUFLVSxPQUFPLENBQUM7RUFFN0MsTUFBTVAsV0FBVyxHQUFHLElBQUlTLG9CQUFXLENBQUMsQ0FBQztFQUVyQyxNQUFNVSxNQUFNLEdBQUcsSUFBSUMsR0FBRyxDQUFDLENBQUM7RUFDeEIsTUFBTUMsT0FBTyxHQUFHLEVBQUU7RUFFbEIsSUFBSUMsS0FBSyxHQUFHLENBQUM7RUFDYixLQUFLLE1BQU1DLElBQUksSUFBSWpCLEtBQUssRUFBRTtJQUN4QixNQUFNa0IsT0FBTyxHQUFHRCxJQUFJLENBQUNFLE9BQU8sSUFBSUYsSUFBSSxDQUFDRyxPQUFPO0lBRTVDLElBQUlILElBQUksQ0FBQ0ksTUFBTSxLQUFLLE9BQU8sSUFBSUosSUFBSSxDQUFDSSxNQUFNLEtBQUssU0FBUyxFQUFFO01BQ3hEO01BQ0E7TUFDQSxNQUFNQyxTQUFTLEdBQUdULE1BQU0sQ0FBQ3BFLEdBQUcsQ0FBQ3lFLE9BQU8sQ0FBQztNQUNyQyxJQUFJSSxTQUFTLEVBQUU7UUFDYjtRQUNBLE1BQU0sQ0FBQ0MsU0FBUyxFQUFFQyxVQUFVLENBQUMsR0FBR0YsU0FBUztRQUN6Q1AsT0FBTyxDQUFDUyxVQUFVLENBQUMsR0FBSSxVQUFTQyxLQUFLLEVBQUVDLFVBQVUsRUFBRTtVQUNqRCxPQUFPLE1BQU1uQixpQkFBaUIsQ0FBQ2tCLEtBQUssRUFBRUMsVUFBVSxFQUFFaEMsV0FBVyxFQUFFUSxJQUFJLENBQUM7UUFDdEUsQ0FBQyxDQUFFZSxJQUFJLEVBQUVNLFNBQVMsQ0FBQztRQUNuQlYsTUFBTSxDQUFDYyxNQUFNLENBQUNULE9BQU8sQ0FBQztNQUN4QixDQUFDLE1BQU07UUFDTDtRQUNBTCxNQUFNLENBQUN4RCxHQUFHLENBQUM2RCxPQUFPLEVBQUUsQ0FBQ0QsSUFBSSxFQUFFRCxLQUFLLENBQUMsQ0FBQztRQUNsQ0EsS0FBSyxFQUFFO01BQ1Q7SUFDRixDQUFDLE1BQU07TUFDTEQsT0FBTyxDQUFDQyxLQUFLLENBQUMsR0FBSSxVQUFTUyxLQUFLLEVBQUU7UUFDaEMsT0FBTyxNQUFNbkIsbUJBQW1CLENBQUNtQixLQUFLLEVBQUUvQixXQUFXLEVBQUVRLElBQUksQ0FBQztNQUM1RCxDQUFDLENBQUVlLElBQUksQ0FBQztNQUNSRCxLQUFLLEVBQUU7SUFDVDtFQUNGOztFQUVBO0VBQ0EsS0FBSyxNQUFNLENBQUNZLFlBQVksRUFBRUMsYUFBYSxDQUFDLElBQUloQixNQUFNLENBQUNpQixNQUFNLENBQUMsQ0FBQyxFQUFFO0lBQzNEZixPQUFPLENBQUNjLGFBQWEsQ0FBQyxHQUFJLFVBQVNFLGFBQWEsRUFBRTtNQUNoRCxPQUFPLE1BQU16QixtQkFBbUIsQ0FBQ3lCLGFBQWEsRUFBRXJDLFdBQVcsRUFBRVEsSUFBSSxDQUFDO0lBQ3BFLENBQUMsQ0FBRTBCLFlBQVksQ0FBQztFQUNsQjtFQUVBLE1BQU1qQixXQUFXLEdBQUdJLE9BQU8sQ0FBQ2lCLEdBQUcsQ0FBQ0MsTUFBTSxJQUFJQSxNQUFNLENBQUMsQ0FBQyxDQUFDOztFQUVuRDtFQUNBdkMsV0FBVyxDQUFDZSxpQkFBaUIsQ0FBQyxDQUFDOztFQUUvQjtFQUNBLEtBQUssTUFBTXlCLFdBQVcsSUFBSWhDLElBQUksQ0FBQ04sT0FBTyxFQUFFO0lBQ3RDLE1BQU11QyxXQUFXLEdBQUcsSUFBSUMsYUFBSSxDQUFDO01BQUNDLElBQUksRUFBRUg7SUFBVyxDQUFDLENBQUM7SUFDakQsTUFBTUksYUFBYSxHQUFHNUMsV0FBVyxDQUFDNkMsWUFBWSxDQUM1Q0MsY0FBSyxDQUFDQyxTQUFTLEVBQ2YvQyxXQUFXLENBQUNnRCxTQUFTLENBQUMsQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQyxFQUN4QztNQUFDQyxVQUFVLEVBQUUsT0FBTztNQUFFQyxTQUFTLEVBQUU7SUFBSyxDQUN4QyxDQUFDO0lBQ0RsQyxXQUFXLENBQUM5QyxJQUFJLENBQUNpRixrQkFBUyxDQUFDQyxxQkFBcUIsQ0FDOUNaLFdBQVcsRUFDWEEsV0FBVyxFQUNYRyxhQUFhLEVBQ2JVLGNBQU8sRUFDUDtJQUNBLE1BQU07TUFBRSxNQUFNLElBQUl4QyxLQUFLLENBQUUsd0NBQXVDMEIsV0FBWSxFQUFDLENBQUM7SUFBRSxDQUNsRixDQUFDLENBQUM7RUFDSjtFQUVBLE9BQU8sSUFBSXhCLHVCQUFjLENBQUM7SUFBQ2hCLFdBQVc7SUFBRWlCO0VBQVcsQ0FBQyxDQUFDO0FBQ3ZEO0FBRUEsU0FBU04sa0JBQWtCQSxDQUFBLEVBQUc7RUFDNUIsT0FBT3lDLGtCQUFTLENBQUNHLFVBQVUsQ0FBQyxDQUFDO0FBQy9CO0FBRUEsU0FBUzNDLG1CQUFtQkEsQ0FBQ1csSUFBSSxFQUFFdkIsV0FBVyxFQUFFUSxJQUFJLEVBQUU7RUFDcEQsTUFBTWdELFVBQVUsR0FBR2pDLElBQUksQ0FBQ2tDLE9BQU8sS0FBS2YsYUFBSSxDQUFDZ0IsS0FBSyxDQUFDQyxPQUFPO0VBQ3RELE1BQU1DLFNBQVMsR0FBR3JDLElBQUksQ0FBQ3NDLE9BQU8sS0FBS25CLGFBQUksQ0FBQ2dCLEtBQUssQ0FBQ0MsT0FBTztFQUVyRCxJQUFJRyxVQUFVLEdBQUcsSUFBSTtFQUNyQixJQUFJQyxVQUFVLEdBQUcsSUFBSTtFQUNyQixJQUFJUCxVQUFVLElBQUksQ0FBQ0ksU0FBUyxFQUFFO0lBQzVCRSxVQUFVLEdBQUd2QyxJQUFJLENBQUN5QyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUM5QyxDQUFDLE1BQU0sSUFBSSxDQUFDVixVQUFVLElBQUlJLFNBQVMsRUFBRTtJQUNuQ0csVUFBVSxHQUFHeEMsSUFBSSxDQUFDeUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDOUMsQ0FBQyxNQUFNLElBQUlWLFVBQVUsSUFBSUksU0FBUyxFQUFFO0lBQ2xDRSxVQUFVLEdBQUd2QyxJQUFJLENBQUN5QyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM1Q0gsVUFBVSxHQUFHeEMsSUFBSSxDQUFDeUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDOUM7RUFFQSxNQUFNQyxPQUFPLEdBQUc1QyxJQUFJLENBQUNFLE9BQU8sS0FBSyxJQUFJLElBQUlGLElBQUksQ0FBQ2tDLE9BQU8sS0FBSyxJQUFJLEdBQzFELElBQUlmLGFBQUksQ0FBQztJQUFDQyxJQUFJLEVBQUVwQixJQUFJLENBQUNFLE9BQU87SUFBRTJDLElBQUksRUFBRTdDLElBQUksQ0FBQ2tDLE9BQU87SUFBRVksT0FBTyxFQUFFUDtFQUFVLENBQUMsQ0FBQyxHQUN2RVEsY0FBUTtFQUNaLE1BQU1DLE9BQU8sR0FBR2hELElBQUksQ0FBQ0csT0FBTyxLQUFLLElBQUksSUFBSUgsSUFBSSxDQUFDc0MsT0FBTyxLQUFLLElBQUksR0FDMUQsSUFBSW5CLGFBQUksQ0FBQztJQUFDQyxJQUFJLEVBQUVwQixJQUFJLENBQUNHLE9BQU87SUFBRTBDLElBQUksRUFBRTdDLElBQUksQ0FBQ3NDLE9BQU87SUFBRVEsT0FBTyxFQUFFTjtFQUFVLENBQUMsQ0FBQyxHQUN2RU8sY0FBUTtFQUVaLE1BQU1FLG9CQUFvQixHQUN2QkwsT0FBTyxDQUFDTSxTQUFTLENBQUMsQ0FBQyxJQUFJakUsSUFBSSxDQUFDVCxxQkFBcUIsQ0FBQ29FLE9BQU8sQ0FBQ08sT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUNwRUgsT0FBTyxDQUFDRSxTQUFTLENBQUMsQ0FBQyxJQUFJakUsSUFBSSxDQUFDVCxxQkFBcUIsQ0FBQ3dFLE9BQU8sQ0FBQ0csT0FBTyxDQUFDLENBQUMsQ0FBRSxJQUN0RWpGLFNBQVM7RUFFWCxNQUFNa0YsWUFBWSxHQUFHSCxvQkFBb0IsSUFDdENJLFdBQVcsQ0FBQyxDQUFDckQsSUFBSSxDQUFDLEVBQUVmLElBQUksQ0FBQyxJQUFJcUUsZUFBUyxJQUN2Q0MsZUFBUTtFQUVWLElBQUksQ0FBQ0gsWUFBWSxDQUFDSSxTQUFTLENBQUMsQ0FBQyxFQUFFO0lBQzdCLE1BQU1DLFdBQVcsR0FBR2hGLFdBQVcsQ0FBQzZDLFlBQVksQ0FDMUNDLGNBQUssQ0FBQ0MsU0FBUyxFQUNmL0MsV0FBVyxDQUFDZ0QsU0FBUyxDQUFDLENBQUMsQ0FBQ0MsY0FBYyxDQUFDLENBQUMsRUFDeEM7TUFBQ0MsVUFBVSxFQUFFLE9BQU87TUFBRUMsU0FBUyxFQUFFO0lBQUssQ0FDeEMsQ0FBQztJQUVELE9BQU9DLGtCQUFTLENBQUNDLHFCQUFxQixDQUNwQ2MsT0FBTyxFQUFFSSxPQUFPLEVBQUVTLFdBQVcsRUFBRUwsWUFBWSxFQUMzQyxNQUFNO01BQ0osTUFBTU0sY0FBYyxHQUFHLElBQUl4RSxvQkFBVyxDQUFDLENBQUM7TUFDeEMsTUFBTSxDQUFDdUQsS0FBSyxFQUFFa0IsZUFBZSxDQUFDLEdBQUdDLFVBQVUsQ0FBQzVELElBQUksRUFBRTBELGNBQWMsQ0FBQztNQUNqRSxNQUFNRyxTQUFTLEdBQUcsSUFBSXRDLGNBQUssQ0FBQztRQUFDbkIsTUFBTSxFQUFFSixJQUFJLENBQUNJLE1BQU07UUFBRXFDLEtBQUs7UUFBRXFCLE1BQU0sRUFBRUg7TUFBZSxDQUFDLENBQUM7TUFFbEZELGNBQWMsQ0FBQ2xFLGlCQUFpQixDQUFDLENBQUM7TUFDbEMsT0FBTztRQUFDdUUsS0FBSyxFQUFFRixTQUFTO1FBQUVwRixXQUFXLEVBQUVpRjtNQUFjLENBQUM7SUFDeEQsQ0FDRixDQUFDO0VBQ0gsQ0FBQyxNQUFNO0lBQ0wsTUFBTSxDQUFDakIsS0FBSyxFQUFFZ0IsV0FBVyxDQUFDLEdBQUdHLFVBQVUsQ0FBQzVELElBQUksRUFBRXZCLFdBQVcsQ0FBQztJQUMxRCxNQUFNc0YsS0FBSyxHQUFHLElBQUl4QyxjQUFLLENBQUM7TUFBQ25CLE1BQU0sRUFBRUosSUFBSSxDQUFDSSxNQUFNO01BQUVxQyxLQUFLO01BQUVxQixNQUFNLEVBQUVMO0lBQVcsQ0FBQyxDQUFDO0lBRTFFLE1BQU1PLFVBQVUsR0FBRy9FLElBQUksQ0FBQ1AsZ0JBQWdCLEdBQUc7TUFBQ3VGLE9BQU8sRUFBRWpFO0lBQUksQ0FBQyxHQUFHLElBQUk7SUFDakUsT0FBTyxJQUFJNkIsa0JBQVMsQ0FBQ2UsT0FBTyxFQUFFSSxPQUFPLEVBQUVlLEtBQUssRUFBRUMsVUFBVSxDQUFDO0VBQzNEO0FBQ0Y7QUFFQSxTQUFTMUUsaUJBQWlCQSxDQUFDNEUsS0FBSyxFQUFFQyxLQUFLLEVBQUUxRixXQUFXLEVBQUVRLElBQUksRUFBRTtFQUMxRCxJQUFJbUYsY0FBYyxFQUFFQyxpQkFBaUI7RUFDckMsSUFBSUgsS0FBSyxDQUFDaEMsT0FBTyxLQUFLZixhQUFJLENBQUNnQixLQUFLLENBQUNDLE9BQU8sSUFBSThCLEtBQUssQ0FBQzVCLE9BQU8sS0FBS25CLGFBQUksQ0FBQ2dCLEtBQUssQ0FBQ0MsT0FBTyxFQUFFO0lBQ2hGZ0MsY0FBYyxHQUFHRixLQUFLO0lBQ3RCRyxpQkFBaUIsR0FBR0YsS0FBSztFQUMzQixDQUFDLE1BQU07SUFDTEMsY0FBYyxHQUFHRCxLQUFLO0lBQ3RCRSxpQkFBaUIsR0FBR0gsS0FBSztFQUMzQjtFQUVBLE1BQU1JLFFBQVEsR0FBR0QsaUJBQWlCLENBQUNuRSxPQUFPLElBQUltRSxpQkFBaUIsQ0FBQ2xFLE9BQU87RUFDdkUsTUFBTTJDLE9BQU8sR0FBR3NCLGNBQWMsQ0FBQzNCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBRXpELElBQUl2QyxNQUFNO0VBQ1YsSUFBSThCLE9BQU8sRUFBRUksT0FBTztFQUNwQixJQUFJQyxVQUFVLEdBQUcsSUFBSTtFQUNyQixJQUFJQyxVQUFVLEdBQUcsSUFBSTtFQUNyQixJQUFJNEIsY0FBYyxDQUFDaEUsTUFBTSxLQUFLLE9BQU8sRUFBRTtJQUNyQztJQUNBQSxNQUFNLEdBQUcsU0FBUztJQUNsQjhCLE9BQU8sR0FBR21DLGlCQUFpQixDQUFDbkMsT0FBTztJQUNuQ0ksT0FBTyxHQUFHOEIsY0FBYyxDQUFDOUIsT0FBTztJQUNoQ0UsVUFBVSxHQUFHTSxPQUFPO0VBQ3RCLENBQUMsTUFBTSxJQUFJc0IsY0FBYyxDQUFDaEUsTUFBTSxLQUFLLFNBQVMsRUFBRTtJQUM5QztJQUNBQSxNQUFNLEdBQUcsT0FBTztJQUNoQjhCLE9BQU8sR0FBR2tDLGNBQWMsQ0FBQ2xDLE9BQU87SUFDaENLLFVBQVUsR0FBR08sT0FBTztJQUNwQlIsT0FBTyxHQUFHK0IsaUJBQWlCLENBQUMvQixPQUFPO0VBQ3JDLENBQUMsTUFBTTtJQUNMLE1BQU0sSUFBSS9DLEtBQUssQ0FBRSxvQ0FBbUM2RSxjQUFjLENBQUNoRSxNQUFPLEVBQUMsQ0FBQztFQUM5RTtFQUVBLE1BQU13QyxPQUFPLEdBQUcsSUFBSXpCLGFBQUksQ0FBQztJQUFDQyxJQUFJLEVBQUVrRCxRQUFRO0lBQUV6QixJQUFJLEVBQUVYLE9BQU87SUFBRVksT0FBTyxFQUFFUDtFQUFVLENBQUMsQ0FBQztFQUM5RSxNQUFNUyxPQUFPLEdBQUcsSUFBSTdCLGFBQUksQ0FBQztJQUFDQyxJQUFJLEVBQUVrRCxRQUFRO0lBQUV6QixJQUFJLEVBQUVQLE9BQU87SUFBRVEsT0FBTyxFQUFFTjtFQUFVLENBQUMsQ0FBQztFQUU5RSxNQUFNWSxZQUFZLEdBQUduRSxJQUFJLENBQUNULHFCQUFxQixDQUFDOEYsUUFBUSxDQUFDLElBQ3REakIsV0FBVyxDQUFDLENBQUNnQixpQkFBaUIsQ0FBQyxFQUFFcEYsSUFBSSxDQUFDLElBQUlxRSxlQUFTLElBQ3BEQyxlQUFRO0VBRVYsSUFBSSxDQUFDSCxZQUFZLENBQUNJLFNBQVMsQ0FBQyxDQUFDLEVBQUU7SUFDN0IsTUFBTUMsV0FBVyxHQUFHaEYsV0FBVyxDQUFDNkMsWUFBWSxDQUMxQ0MsY0FBSyxDQUFDQyxTQUFTLEVBQ2YvQyxXQUFXLENBQUNnRCxTQUFTLENBQUMsQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQyxFQUN4QztNQUFDQyxVQUFVLEVBQUUsT0FBTztNQUFFQyxTQUFTLEVBQUU7SUFBSyxDQUN4QyxDQUFDO0lBRUQsT0FBT0Msa0JBQVMsQ0FBQ0MscUJBQXFCLENBQ3BDYyxPQUFPLEVBQUVJLE9BQU8sRUFBRVMsV0FBVyxFQUFFTCxZQUFZLEVBQzNDLE1BQU07TUFDSixNQUFNTSxjQUFjLEdBQUcsSUFBSXhFLG9CQUFXLENBQUMsQ0FBQztNQUN4QyxNQUFNLENBQUN1RCxLQUFLLEVBQUVrQixlQUFlLENBQUMsR0FBR0MsVUFBVSxDQUFDUyxpQkFBaUIsRUFBRVgsY0FBYyxDQUFDO01BQzlFLE1BQU1HLFNBQVMsR0FBRyxJQUFJdEMsY0FBSyxDQUFDO1FBQUNuQixNQUFNO1FBQUVxQyxLQUFLO1FBQUVxQixNQUFNLEVBQUVIO01BQWUsQ0FBQyxDQUFDO01BRXJFRCxjQUFjLENBQUNsRSxpQkFBaUIsQ0FBQyxDQUFDO01BQ2xDLE9BQU87UUFBQ3VFLEtBQUssRUFBRUYsU0FBUztRQUFFcEYsV0FBVyxFQUFFaUY7TUFBYyxDQUFDO0lBQ3hELENBQ0YsQ0FBQztFQUNILENBQUMsTUFBTTtJQUNMLE1BQU0sQ0FBQ2pCLEtBQUssRUFBRWdCLFdBQVcsQ0FBQyxHQUFHRyxVQUFVLENBQUNTLGlCQUFpQixFQUFFNUYsV0FBVyxDQUFDO0lBQ3ZFLE1BQU1zRixLQUFLLEdBQUcsSUFBSXhDLGNBQUssQ0FBQztNQUFDbkIsTUFBTTtNQUFFcUMsS0FBSztNQUFFcUIsTUFBTSxFQUFFTDtJQUFXLENBQUMsQ0FBQztJQUU3RCxNQUFNTyxVQUFVLEdBQUcvRSxJQUFJLENBQUNQLGdCQUFnQixHQUFHO01BQUN1RixPQUFPLEVBQUVJLGlCQUFpQjtNQUFFeEIsSUFBSSxFQUFFdUI7SUFBYyxDQUFDLEdBQUcsSUFBSTtJQUNwRyxPQUFPLElBQUl2QyxrQkFBUyxDQUFDZSxPQUFPLEVBQUVJLE9BQU8sRUFBRWUsS0FBSyxFQUFFQyxVQUFVLENBQUM7RUFDM0Q7QUFDRjtBQUVBLE1BQU1PLFVBQVUsR0FBRztFQUNqQixHQUFHLEVBQUVDLGdCQUFRO0VBQ2IsR0FBRyxFQUFFQyxnQkFBUTtFQUNiLEdBQUcsRUFBRUMsaUJBQVM7RUFDZCxJQUFJLEVBQUVDO0FBQ1IsQ0FBQztBQUVELFNBQVNmLFVBQVVBLENBQUM1RCxJQUFJLEVBQUV2QixXQUFXLEVBQUU7RUFDckMsTUFBTW1HLFFBQVEsR0FBR25HLFdBQVcsQ0FBQ29HLG1CQUFtQixDQUFDLENBQUMsQ0FDL0NDLFVBQVUsQ0FBQ3JHLFdBQVcsQ0FBQ3NHLGNBQWMsQ0FBQztJQUFDQyxXQUFXLEVBQUV2RyxXQUFXLENBQUN3RyxpQkFBaUIsQ0FBQztFQUFDLENBQUMsQ0FBQyxDQUFDO0VBRXpGLElBQUl4QixXQUFXLEdBQUcsSUFBSTtFQUN0QixJQUFJeUIsU0FBUyxHQUFHLElBQUk7RUFDcEIsTUFBTXpDLEtBQUssR0FBRyxFQUFFO0VBRWhCbUMsUUFBUSxDQUFDTyxTQUFTLENBQUM1RCxjQUFLLENBQUNDLFNBQVMsRUFBRSxNQUFNO0lBQ3hDLEtBQUssTUFBTTRELE9BQU8sSUFBSXBGLElBQUksQ0FBQ3lDLEtBQUssRUFBRTtNQUNoQyxJQUFJNEMsV0FBVyxHQUFHLElBQUk7TUFDdEIsTUFBTUMsT0FBTyxHQUFHLEVBQUU7O01BRWxCO01BQ0EsSUFBSUosU0FBUyxFQUFFO1FBQ2JBLFNBQVMsR0FBRyxLQUFLO01BQ25CLENBQUMsTUFBTTtRQUNMTixRQUFRLENBQUNXLE1BQU0sQ0FBQyxJQUFJLENBQUM7TUFDdkI7TUFFQVgsUUFBUSxDQUFDTyxTQUFTLENBQUNLLGFBQUksQ0FBQ2hFLFNBQVMsRUFBRSxNQUFNO1FBQ3ZDLElBQUlpRSxlQUFlLEdBQUcsSUFBSTtRQUMxQixJQUFJQyxpQkFBaUIsR0FBRyxFQUFFO1FBQzFCLElBQUlDLGlCQUFpQixHQUFHLElBQUk7UUFFNUIsU0FBU0MsWUFBWUEsQ0FBQSxFQUFHO1VBQ3RCLElBQUlELGlCQUFpQixLQUFLLElBQUksRUFBRTtZQUM5QjtVQUNGOztVQUVBO1VBQ0EsSUFBSU4sV0FBVyxFQUFFO1lBQ2ZBLFdBQVcsR0FBRyxLQUFLO1VBQ3JCLENBQUMsTUFBTTtZQUNMVCxRQUFRLENBQUNXLE1BQU0sQ0FBQyxJQUFJLENBQUM7VUFDdkI7VUFFQVgsUUFBUSxDQUFDaUIsWUFBWSxDQUFDSCxpQkFBaUIsRUFBRUMsaUJBQWlCLENBQUNuRSxTQUFTLEVBQUU7WUFDcEVHLFVBQVUsRUFBRSxPQUFPO1lBQ25CQyxTQUFTLEVBQUUsS0FBSztZQUNoQmtFLFFBQVEsRUFBRyxVQUFTQyxRQUFRLEVBQUVDLGtCQUFrQixFQUFFO2NBQ2hELE9BQU9DLFlBQVksSUFBSTtnQkFBRUYsUUFBUSxDQUFDbkosSUFBSSxDQUFDLElBQUlvSixrQkFBa0IsQ0FBQ0MsWUFBWSxDQUFDLENBQUM7Y0FBRSxDQUFDO1lBQ2pGLENBQUMsQ0FBRVgsT0FBTyxFQUFFSyxpQkFBaUI7VUFDL0IsQ0FBQyxDQUFDO1FBQ0o7UUFFQSxLQUFLLE1BQU1PLE9BQU8sSUFBSWQsT0FBTyxDQUFDMUMsS0FBSyxFQUFFO1VBQ25DLE1BQU15RCxjQUFjLEdBQUc1QixVQUFVLENBQUMyQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDN0MsSUFBSUMsY0FBYyxLQUFLakksU0FBUyxFQUFFO1lBQ2hDLE1BQU0sSUFBSXFCLEtBQUssQ0FBRSxtQ0FBa0MyRyxPQUFPLENBQUMsQ0FBQyxDQUFFLEdBQUUsQ0FBQztVQUNuRTtVQUNBLE1BQU1FLFFBQVEsR0FBR0YsT0FBTyxDQUFDdkQsS0FBSyxDQUFDLENBQUMsQ0FBQztVQUVqQyxJQUFJMEQsU0FBUyxHQUFHLEVBQUU7VUFDbEIsSUFBSVosZUFBZSxFQUFFO1lBQ25CQSxlQUFlLEdBQUcsS0FBSztVQUN6QixDQUFDLE1BQU07WUFDTFksU0FBUyxHQUFHLElBQUk7VUFDbEI7VUFFQSxJQUFJRixjQUFjLEtBQUtSLGlCQUFpQixFQUFFO1lBQ3hDRCxpQkFBaUIsSUFBSVcsU0FBUyxHQUFHRCxRQUFRO1lBRXpDO1VBQ0YsQ0FBQyxNQUFNO1lBQ0xSLFlBQVksQ0FBQyxDQUFDO1lBRWRELGlCQUFpQixHQUFHUSxjQUFjO1lBQ2xDVCxpQkFBaUIsR0FBR1UsUUFBUTtVQUM5QjtRQUNGO1FBQ0FSLFlBQVksQ0FBQyxDQUFDO01BQ2hCLENBQUMsRUFBRTtRQUNEakUsVUFBVSxFQUFFLE9BQU87UUFDbkJDLFNBQVMsRUFBRSxLQUFLO1FBQ2hCa0UsUUFBUSxFQUFHLFVBQVNRLE1BQU0sRUFBRUMsUUFBUSxFQUFFUixRQUFRLEVBQUU7VUFDOUMsT0FBT1MsVUFBVSxJQUFJO1lBQ25CRixNQUFNLENBQUMxSixJQUFJLENBQUMsSUFBSTRJLGFBQUksQ0FBQztjQUNuQmlCLFdBQVcsRUFBRUYsUUFBUSxDQUFDRyxZQUFZO2NBQ2xDQyxXQUFXLEVBQUVKLFFBQVEsQ0FBQ0ssWUFBWTtjQUNsQ0MsV0FBVyxFQUFFTixRQUFRLENBQUNPLFlBQVk7Y0FDbENDLFdBQVcsRUFBRVIsUUFBUSxDQUFDUyxZQUFZO2NBQ2xDQyxjQUFjLEVBQUVWLFFBQVEsQ0FBQ1csT0FBTztjQUNoQ3BELE1BQU0sRUFBRTBDLFVBQVU7Y0FDbEJsQixPQUFPLEVBQUVTO1lBQ1gsQ0FBQyxDQUFDLENBQUM7VUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFFdEQsS0FBSyxFQUFFMkMsT0FBTyxFQUFFRSxPQUFPO01BQzVCLENBQUMsQ0FBQztJQUNKO0VBQ0YsQ0FBQyxFQUFFO0lBQ0QzRCxVQUFVLEVBQUUsT0FBTztJQUNuQkMsU0FBUyxFQUFFLEtBQUs7SUFDaEJrRSxRQUFRLEVBQUVoQyxNQUFNLElBQUk7TUFBRUwsV0FBVyxHQUFHSyxNQUFNO0lBQUU7RUFDOUMsQ0FBQyxDQUFDOztFQUVGO0VBQ0E7RUFDQSxJQUFJOUQsSUFBSSxDQUFDeUMsS0FBSyxDQUFDekYsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN6QjRILFFBQVEsQ0FBQ1csTUFBTSxDQUFDLElBQUksQ0FBQztFQUN2QjtFQUVBWCxRQUFRLENBQUMvSCxLQUFLLENBQUMsQ0FBQztFQUVoQixPQUFPLENBQUM0RixLQUFLLEVBQUVnQixXQUFXLENBQUM7QUFDN0I7QUFFQSxTQUFTSixXQUFXQSxDQUFDdEUsS0FBSyxFQUFFRSxJQUFJLEVBQUU7RUFDaEMsTUFBTWtJLElBQUksR0FBR3BJLEtBQUssQ0FBQ3FJLE1BQU0sQ0FBQyxDQUFDQyxlQUFlLEVBQUVySCxJQUFJLEtBQUs7SUFDbkQsT0FBT3FILGVBQWUsR0FBR3JILElBQUksQ0FBQ3lDLEtBQUssQ0FBQzJFLE1BQU0sQ0FBQyxDQUFDRSxlQUFlLEVBQUVDLElBQUksS0FBSztNQUNwRSxPQUFPRCxlQUFlLEdBQUdDLElBQUksQ0FBQzdFLEtBQUssQ0FBQzFGLE1BQU07SUFDNUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNQLENBQUMsRUFBRSxDQUFDLENBQUM7RUFFTCxPQUFPbUssSUFBSSxHQUFHbEksSUFBSSxDQUFDVixrQkFBa0I7QUFDdkMifQ==