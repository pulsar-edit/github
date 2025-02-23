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
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0Y2hCdWZmZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9odW5rIiwiX2ZpbGUiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wYXRjaCIsIl9yZWdpb24iLCJfZmlsZVBhdGNoIiwiX211bHRpRmlsZVBhdGNoIiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJvIiwiZmlsdGVyIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJfdG9Qcm9wZXJ0eUtleSIsInZhbHVlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIlN0cmluZyIsIk51bWJlciIsIkRFRkFVTFRfT1BUSU9OUyIsImxhcmdlRGlmZlRocmVzaG9sZCIsInJlbmRlclN0YXR1c092ZXJyaWRlcyIsInBhdGNoQnVmZmVyIiwicHJlc2VydmVPcmlnaW5hbCIsInJlbW92ZWQiLCJTZXQiLCJleHBvcnRzIiwiYnVpbGRGaWxlUGF0Y2giLCJkaWZmcyIsIm9wdGlvbnMiLCJvcHRzIiwiUGF0Y2hCdWZmZXIiLCJmaWxlUGF0Y2giLCJlbXB0eURpZmZGaWxlUGF0Y2giLCJzaW5nbGVEaWZmRmlsZVBhdGNoIiwiZHVhbERpZmZGaWxlUGF0Y2giLCJFcnJvciIsImRlbGV0ZUxhc3ROZXdsaW5lIiwiTXVsdGlGaWxlUGF0Y2giLCJmaWxlUGF0Y2hlcyIsImJ1aWxkTXVsdGlGaWxlUGF0Y2giLCJieVBhdGgiLCJNYXAiLCJhY3Rpb25zIiwiaW5kZXgiLCJkaWZmIiwidGhlUGF0aCIsIm9sZFBhdGgiLCJuZXdQYXRoIiwic3RhdHVzIiwib3RoZXJIYWxmIiwib3RoZXJEaWZmIiwib3RoZXJJbmRleCIsIl9kaWZmIiwiX290aGVyRGlmZiIsImRlbGV0ZSIsInVucGFpcmVkRGlmZiIsIm9yaWdpbmFsSW5kZXgiLCJ2YWx1ZXMiLCJfdW5wYWlyZWREaWZmIiwibWFwIiwiYWN0aW9uIiwicmVtb3ZlZFBhdGgiLCJyZW1vdmVkRmlsZSIsIkZpbGUiLCJwYXRoIiwicmVtb3ZlZE1hcmtlciIsIm1hcmtQb3NpdGlvbiIsIlBhdGNoIiwibGF5ZXJOYW1lIiwiZ2V0QnVmZmVyIiwiZ2V0RW5kUG9zaXRpb24iLCJpbnZhbGlkYXRlIiwiZXhjbHVzaXZlIiwiRmlsZVBhdGNoIiwiY3JlYXRlSGlkZGVuRmlsZVBhdGNoIiwiUkVNT1ZFRCIsImNyZWF0ZU51bGwiLCJ3YXNTeW1saW5rIiwib2xkTW9kZSIsIm1vZGVzIiwiU1lNTElOSyIsImlzU3ltbGluayIsIm5ld01vZGUiLCJvbGRTeW1saW5rIiwibmV3U3ltbGluayIsImh1bmtzIiwibGluZXMiLCJzbGljZSIsIm9sZEZpbGUiLCJtb2RlIiwic3ltbGluayIsIm51bGxGaWxlIiwibmV3RmlsZSIsInJlbmRlclN0YXR1c092ZXJyaWRlIiwiaXNQcmVzZW50IiwiZ2V0UGF0aCIsInVuZGVmaW5lZCIsInJlbmRlclN0YXR1cyIsImlzRGlmZkxhcmdlIiwiREVGRVJSRUQiLCJFWFBBTkRFRCIsImlzVmlzaWJsZSIsInBhdGNoTWFya2VyIiwic3ViUGF0Y2hCdWZmZXIiLCJuZXh0UGF0Y2hNYXJrZXIiLCJidWlsZEh1bmtzIiwibmV4dFBhdGNoIiwibWFya2VyIiwicGF0Y2giLCJyYXdQYXRjaGVzIiwiY29udGVudCIsImRpZmYxIiwiZGlmZjIiLCJtb2RlQ2hhbmdlRGlmZiIsImNvbnRlbnRDaGFuZ2VEaWZmIiwiZmlsZVBhdGgiLCJDSEFOR0VLSU5EIiwiQWRkaXRpb24iLCJEZWxldGlvbiIsIlVuY2hhbmdlZCIsIk5vTmV3bGluZSIsImluc2VydGVyIiwiY3JlYXRlSW5zZXJ0ZXJBdEVuZCIsImtlZXBCZWZvcmUiLCJmaW5kQWxsTWFya2VycyIsImVuZFBvc2l0aW9uIiwiZ2V0SW5zZXJ0aW9uUG9pbnQiLCJmaXJzdEh1bmsiLCJtYXJrV2hpbGUiLCJyYXdIdW5rIiwiZmlyc3RSZWdpb24iLCJyZWdpb25zIiwiaW5zZXJ0IiwiSHVuayIsImZpcnN0UmVnaW9uTGluZSIsImN1cnJlbnRSZWdpb25UZXh0IiwiQ3VycmVudFJlZ2lvbktpbmQiLCJmaW5pc2hSZWdpb24iLCJpbnNlcnRNYXJrZWQiLCJjYWxsYmFjayIsIl9yZWdpb25zIiwiX0N1cnJlbnRSZWdpb25LaW5kIiwicmVnaW9uTWFya2VyIiwicmF3TGluZSIsIk5leHRSZWdpb25LaW5kIiwibmV4dExpbmUiLCJzZXBhcmF0b3IiLCJfaHVua3MiLCJfcmF3SHVuayIsImh1bmtNYXJrZXIiLCJvbGRTdGFydFJvdyIsIm9sZFN0YXJ0TGluZSIsIm5ld1N0YXJ0Um93IiwibmV3U3RhcnRMaW5lIiwib2xkUm93Q291bnQiLCJvbGRMaW5lQ291bnQiLCJuZXdSb3dDb3VudCIsIm5ld0xpbmVDb3VudCIsInNlY3Rpb25IZWFkaW5nIiwiaGVhZGluZyIsInNpemUiLCJyZWR1Y2UiLCJkaWZmU2l6ZUNvdW50ZXIiLCJodW5rU2l6ZUNvdW50ZXIiLCJodW5rIl0sInNvdXJjZXMiOlsiYnVpbGRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGF0Y2hCdWZmZXIgZnJvbSAnLi9wYXRjaC1idWZmZXInO1xuaW1wb3J0IEh1bmsgZnJvbSAnLi9odW5rJztcbmltcG9ydCBGaWxlLCB7bnVsbEZpbGV9IGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgUGF0Y2gsIHtERUZFUlJFRCwgRVhQQU5ERUQsIFJFTU9WRUR9IGZyb20gJy4vcGF0Y2gnO1xuaW1wb3J0IHtVbmNoYW5nZWQsIEFkZGl0aW9uLCBEZWxldGlvbiwgTm9OZXdsaW5lfSBmcm9tICcuL3JlZ2lvbic7XG5pbXBvcnQgRmlsZVBhdGNoIGZyb20gJy4vZmlsZS1wYXRjaCc7XG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2ggZnJvbSAnLi9tdWx0aS1maWxlLXBhdGNoJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgLy8gTnVtYmVyIG9mIGxpbmVzIGFmdGVyIHdoaWNoIHdlIGNvbnNpZGVyIHRoZSBkaWZmIFwibGFyZ2VcIlxuICBsYXJnZURpZmZUaHJlc2hvbGQ6IDgwMCxcblxuICAvLyBNYXAgb2YgZmlsZSBwYXRoIChyZWxhdGl2ZSB0byByZXBvc2l0b3J5IHJvb3QpIHRvIFBhdGNoIHJlbmRlciBzdGF0dXMgKEVYUEFOREVELCBDT0xMQVBTRUQsIERFRkVSUkVEKVxuICByZW5kZXJTdGF0dXNPdmVycmlkZXM6IHt9LFxuXG4gIC8vIEV4aXN0aW5nIHBhdGNoIGJ1ZmZlciB0byByZW5kZXIgb250b1xuICBwYXRjaEJ1ZmZlcjogbnVsbCxcblxuICAvLyBTdG9yZSBvZmYgd2hhdC10aGUtZGlmZiBmaWxlIHBhdGNoXG4gIHByZXNlcnZlT3JpZ2luYWw6IGZhbHNlLFxuXG4gIC8vIFBhdGhzIG9mIGZpbGUgcGF0Y2hlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhdGNoIGJlZm9yZSBwYXJzaW5nXG4gIHJlbW92ZWQ6IG5ldyBTZXQoKSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZpbGVQYXRjaChkaWZmcywgb3B0aW9ucykge1xuICBjb25zdCBvcHRzID0gey4uLkRFRkFVTFRfT1BUSU9OUywgLi4ub3B0aW9uc307XG4gIGNvbnN0IHBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG5cbiAgbGV0IGZpbGVQYXRjaDtcbiAgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZpbGVQYXRjaCA9IGVtcHR5RGlmZkZpbGVQYXRjaCgpO1xuICB9IGVsc2UgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMSkge1xuICAgIGZpbGVQYXRjaCA9IHNpbmdsZURpZmZGaWxlUGF0Y2goZGlmZnNbMF0sIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgfSBlbHNlIGlmIChkaWZmcy5sZW5ndGggPT09IDIpIHtcbiAgICBmaWxlUGF0Y2ggPSBkdWFsRGlmZkZpbGVQYXRjaChkaWZmc1swXSwgZGlmZnNbMV0sIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbnVtYmVyIG9mIGRpZmZzOiAke2RpZmZzLmxlbmd0aH1gKTtcbiAgfVxuXG4gIC8vIERlbGV0ZSB0aGUgdHJhaWxpbmcgbmV3bGluZS5cbiAgcGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcblxuICByZXR1cm4gbmV3IE11bHRpRmlsZVBhdGNoKHtwYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXM6IFtmaWxlUGF0Y2hdfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE11bHRpRmlsZVBhdGNoKGRpZmZzLCBvcHRpb25zKSB7XG4gIGNvbnN0IG9wdHMgPSB7Li4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zfTtcblxuICBjb25zdCBwYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuXG4gIGNvbnN0IGJ5UGF0aCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgYWN0aW9ucyA9IFtdO1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAoY29uc3QgZGlmZiBvZiBkaWZmcykge1xuICAgIGNvbnN0IHRoZVBhdGggPSBkaWZmLm9sZFBhdGggfHwgZGlmZi5uZXdQYXRoO1xuXG4gICAgaWYgKGRpZmYuc3RhdHVzID09PSAnYWRkZWQnIHx8IGRpZmYuc3RhdHVzID09PSAnZGVsZXRlZCcpIHtcbiAgICAgIC8vIFBvdGVudGlhbCBwYWlyZWQgZGlmZi4gRWl0aGVyIGEgc3ltbGluayBkZWxldGlvbiArIGNvbnRlbnQgYWRkaXRpb24gb3IgYSBzeW1saW5rIGFkZGl0aW9uICtcbiAgICAgIC8vIGNvbnRlbnQgZGVsZXRpb24uXG4gICAgICBjb25zdCBvdGhlckhhbGYgPSBieVBhdGguZ2V0KHRoZVBhdGgpO1xuICAgICAgaWYgKG90aGVySGFsZikge1xuICAgICAgICAvLyBUaGUgc2Vjb25kIGhhbGYuIENvbXBsZXRlIHRoZSBwYWlyZWQgZGlmZiwgb3IgZmFpbCBpZiB0aGV5IGhhdmUgdW5leHBlY3RlZCBzdGF0dXNlcyBvciBtb2Rlcy5cbiAgICAgICAgY29uc3QgW290aGVyRGlmZiwgb3RoZXJJbmRleF0gPSBvdGhlckhhbGY7XG4gICAgICAgIGFjdGlvbnNbb3RoZXJJbmRleF0gPSAoZnVuY3Rpb24oX2RpZmYsIF9vdGhlckRpZmYpIHtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gZHVhbERpZmZGaWxlUGF0Y2goX2RpZmYsIF9vdGhlckRpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICAgICAgfSkoZGlmZiwgb3RoZXJEaWZmKTtcbiAgICAgICAgYnlQYXRoLmRlbGV0ZSh0aGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBoYWxmIHdlJ3ZlIHNlZW4uXG4gICAgICAgIGJ5UGF0aC5zZXQodGhlUGF0aCwgW2RpZmYsIGluZGV4XSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnNbaW5kZXhdID0gKGZ1bmN0aW9uKF9kaWZmKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiBzaW5nbGVEaWZmRmlsZVBhdGNoKF9kaWZmLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gICAgICB9KShkaWZmKTtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgLy8gUG9wdWxhdGUgdW5wYWlyZWQgZGlmZnMgdGhhdCBsb29rZWQgbGlrZSB0aGV5IGNvdWxkIGJlIHBhcnQgb2YgYSBwYWlyLCBidXQgd2VyZW4ndC5cbiAgZm9yIChjb25zdCBbdW5wYWlyZWREaWZmLCBvcmlnaW5hbEluZGV4XSBvZiBieVBhdGgudmFsdWVzKCkpIHtcbiAgICBhY3Rpb25zW29yaWdpbmFsSW5kZXhdID0gKGZ1bmN0aW9uKF91bnBhaXJlZERpZmYpIHtcbiAgICAgIHJldHVybiAoKSA9PiBzaW5nbGVEaWZmRmlsZVBhdGNoKF91bnBhaXJlZERpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICB9KSh1bnBhaXJlZERpZmYpO1xuICB9XG5cbiAgY29uc3QgZmlsZVBhdGNoZXMgPSBhY3Rpb25zLm1hcChhY3Rpb24gPT4gYWN0aW9uKCkpO1xuXG4gIC8vIERlbGV0ZSB0aGUgZmluYWwgdHJhaWxpbmcgbmV3bGluZSBmcm9tIHRoZSBsYXN0IG5vbi1lbXB0eSBwYXRjaC5cbiAgcGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcblxuICAvLyBBcHBlbmQgaGlkZGVuIHBhdGNoZXMgY29ycmVzcG9uZGluZyB0byBlYWNoIHJlbW92ZWQgZmlsZS5cbiAgZm9yIChjb25zdCByZW1vdmVkUGF0aCBvZiBvcHRzLnJlbW92ZWQpIHtcbiAgICBjb25zdCByZW1vdmVkRmlsZSA9IG5ldyBGaWxlKHtwYXRoOiByZW1vdmVkUGF0aH0pO1xuICAgIGNvbnN0IHJlbW92ZWRNYXJrZXIgPSBwYXRjaEJ1ZmZlci5tYXJrUG9zaXRpb24oXG4gICAgICBQYXRjaC5sYXllck5hbWUsXG4gICAgICBwYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRFbmRQb3NpdGlvbigpLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG4gICAgZmlsZVBhdGNoZXMucHVzaChGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgcmVtb3ZlZEZpbGUsXG4gICAgICByZW1vdmVkRmlsZSxcbiAgICAgIHJlbW92ZWRNYXJrZXIsXG4gICAgICBSRU1PVkVELFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICgpID0+IHsgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0IHRvIGV4cGFuZCByZW1vdmVkIGZpbGUgcGF0Y2ggJHtyZW1vdmVkUGF0aH1gKTsgfSxcbiAgICApKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgTXVsdGlGaWxlUGF0Y2goe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlc30pO1xufVxuXG5mdW5jdGlvbiBlbXB0eURpZmZGaWxlUGF0Y2goKSB7XG4gIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlTnVsbCgpO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVEaWZmRmlsZVBhdGNoKGRpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKSB7XG4gIGNvbnN0IHdhc1N5bWxpbmsgPSBkaWZmLm9sZE1vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSztcbiAgY29uc3QgaXNTeW1saW5rID0gZGlmZi5uZXdNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTks7XG5cbiAgbGV0IG9sZFN5bWxpbmsgPSBudWxsO1xuICBsZXQgbmV3U3ltbGluayA9IG51bGw7XG4gIGlmICh3YXNTeW1saW5rICYmICFpc1N5bWxpbmspIHtcbiAgICBvbGRTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgfSBlbHNlIGlmICghd2FzU3ltbGluayAmJiBpc1N5bWxpbmspIHtcbiAgICBuZXdTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgfSBlbHNlIGlmICh3YXNTeW1saW5rICYmIGlzU3ltbGluaykge1xuICAgIG9sZFN5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzBdLnNsaWNlKDEpO1xuICAgIG5ld1N5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzJdLnNsaWNlKDEpO1xuICB9XG5cbiAgY29uc3Qgb2xkRmlsZSA9IGRpZmYub2xkUGF0aCAhPT0gbnVsbCB8fCBkaWZmLm9sZE1vZGUgIT09IG51bGxcbiAgICA/IG5ldyBGaWxlKHtwYXRoOiBkaWZmLm9sZFBhdGgsIG1vZGU6IGRpZmYub2xkTW9kZSwgc3ltbGluazogb2xkU3ltbGlua30pXG4gICAgOiBudWxsRmlsZTtcbiAgY29uc3QgbmV3RmlsZSA9IGRpZmYubmV3UGF0aCAhPT0gbnVsbCB8fCBkaWZmLm5ld01vZGUgIT09IG51bGxcbiAgICA/IG5ldyBGaWxlKHtwYXRoOiBkaWZmLm5ld1BhdGgsIG1vZGU6IGRpZmYubmV3TW9kZSwgc3ltbGluazogbmV3U3ltbGlua30pXG4gICAgOiBudWxsRmlsZTtcblxuICBjb25zdCByZW5kZXJTdGF0dXNPdmVycmlkZSA9XG4gICAgKG9sZEZpbGUuaXNQcmVzZW50KCkgJiYgb3B0cy5yZW5kZXJTdGF0dXNPdmVycmlkZXNbb2xkRmlsZS5nZXRQYXRoKCldKSB8fFxuICAgIChuZXdGaWxlLmlzUHJlc2VudCgpICYmIG9wdHMucmVuZGVyU3RhdHVzT3ZlcnJpZGVzW25ld0ZpbGUuZ2V0UGF0aCgpXSkgfHxcbiAgICB1bmRlZmluZWQ7XG5cbiAgY29uc3QgcmVuZGVyU3RhdHVzID0gcmVuZGVyU3RhdHVzT3ZlcnJpZGUgfHxcbiAgICAoaXNEaWZmTGFyZ2UoW2RpZmZdLCBvcHRzKSAmJiBERUZFUlJFRCkgfHxcbiAgICBFWFBBTkRFRDtcblxuICBpZiAoIXJlbmRlclN0YXR1cy5pc1Zpc2libGUoKSkge1xuICAgIGNvbnN0IHBhdGNoTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgcGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIEZpbGVQYXRjaC5jcmVhdGVIaWRkZW5GaWxlUGF0Y2goXG4gICAgICBvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaE1hcmtlciwgcmVuZGVyU3RhdHVzLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBbaHVua3MsIG5leHRQYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGRpZmYsIHN1YlBhdGNoQnVmZmVyKTtcbiAgICAgICAgY29uc3QgbmV4dFBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXM6IGRpZmYuc3RhdHVzLCBodW5rcywgbWFya2VyOiBuZXh0UGF0Y2hNYXJrZXJ9KTtcblxuICAgICAgICBzdWJQYXRjaEJ1ZmZlci5kZWxldGVMYXN0TmV3bGluZSgpO1xuICAgICAgICByZXR1cm4ge3BhdGNoOiBuZXh0UGF0Y2gsIHBhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlcn07XG4gICAgICB9LFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW2h1bmtzLCBwYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGRpZmYsIHBhdGNoQnVmZmVyKTtcbiAgICBjb25zdCBwYXRjaCA9IG5ldyBQYXRjaCh7c3RhdHVzOiBkaWZmLnN0YXR1cywgaHVua3MsIG1hcmtlcjogcGF0Y2hNYXJrZXJ9KTtcblxuICAgIGNvbnN0IHJhd1BhdGNoZXMgPSBvcHRzLnByZXNlcnZlT3JpZ2luYWwgPyB7Y29udGVudDogZGlmZn0gOiBudWxsO1xuICAgIHJldHVybiBuZXcgRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkdWFsRGlmZkZpbGVQYXRjaChkaWZmMSwgZGlmZjIsIHBhdGNoQnVmZmVyLCBvcHRzKSB7XG4gIGxldCBtb2RlQ2hhbmdlRGlmZiwgY29udGVudENoYW5nZURpZmY7XG4gIGlmIChkaWZmMS5vbGRNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTksgfHwgZGlmZjEubmV3TW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LKSB7XG4gICAgbW9kZUNoYW5nZURpZmYgPSBkaWZmMTtcbiAgICBjb250ZW50Q2hhbmdlRGlmZiA9IGRpZmYyO1xuICB9IGVsc2Uge1xuICAgIG1vZGVDaGFuZ2VEaWZmID0gZGlmZjI7XG4gICAgY29udGVudENoYW5nZURpZmYgPSBkaWZmMTtcbiAgfVxuXG4gIGNvbnN0IGZpbGVQYXRoID0gY29udGVudENoYW5nZURpZmYub2xkUGF0aCB8fCBjb250ZW50Q2hhbmdlRGlmZi5uZXdQYXRoO1xuICBjb25zdCBzeW1saW5rID0gbW9kZUNoYW5nZURpZmYuaHVua3NbMF0ubGluZXNbMF0uc2xpY2UoMSk7XG5cbiAgbGV0IHN0YXR1cztcbiAgbGV0IG9sZE1vZGUsIG5ld01vZGU7XG4gIGxldCBvbGRTeW1saW5rID0gbnVsbDtcbiAgbGV0IG5ld1N5bWxpbmsgPSBudWxsO1xuICBpZiAobW9kZUNoYW5nZURpZmYuc3RhdHVzID09PSAnYWRkZWQnKSB7XG4gICAgLy8gY29udGVudHMgd2VyZSBkZWxldGVkIGFuZCByZXBsYWNlZCB3aXRoIHN5bWxpbmtcbiAgICBzdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgb2xkTW9kZSA9IGNvbnRlbnRDaGFuZ2VEaWZmLm9sZE1vZGU7XG4gICAgbmV3TW9kZSA9IG1vZGVDaGFuZ2VEaWZmLm5ld01vZGU7XG4gICAgbmV3U3ltbGluayA9IHN5bWxpbms7XG4gIH0gZWxzZSBpZiAobW9kZUNoYW5nZURpZmYuc3RhdHVzID09PSAnZGVsZXRlZCcpIHtcbiAgICAvLyBjb250ZW50cyB3ZXJlIGFkZGVkIGFmdGVyIHN5bWxpbmsgd2FzIGRlbGV0ZWRcbiAgICBzdGF0dXMgPSAnYWRkZWQnO1xuICAgIG9sZE1vZGUgPSBtb2RlQ2hhbmdlRGlmZi5vbGRNb2RlO1xuICAgIG9sZFN5bWxpbmsgPSBzeW1saW5rO1xuICAgIG5ld01vZGUgPSBjb250ZW50Q2hhbmdlRGlmZi5uZXdNb2RlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb2RlIGNoYW5nZSBkaWZmIHN0YXR1czogJHttb2RlQ2hhbmdlRGlmZi5zdGF0dXN9YCk7XG4gIH1cblxuICBjb25zdCBvbGRGaWxlID0gbmV3IEZpbGUoe3BhdGg6IGZpbGVQYXRoLCBtb2RlOiBvbGRNb2RlLCBzeW1saW5rOiBvbGRTeW1saW5rfSk7XG4gIGNvbnN0IG5ld0ZpbGUgPSBuZXcgRmlsZSh7cGF0aDogZmlsZVBhdGgsIG1vZGU6IG5ld01vZGUsIHN5bWxpbms6IG5ld1N5bWxpbmt9KTtcblxuICBjb25zdCByZW5kZXJTdGF0dXMgPSBvcHRzLnJlbmRlclN0YXR1c092ZXJyaWRlc1tmaWxlUGF0aF0gfHxcbiAgICAoaXNEaWZmTGFyZ2UoW2NvbnRlbnRDaGFuZ2VEaWZmXSwgb3B0cykgJiYgREVGRVJSRUQpIHx8XG4gICAgRVhQQU5ERUQ7XG5cbiAgaWYgKCFyZW5kZXJTdGF0dXMuaXNWaXNpYmxlKCkpIHtcbiAgICBjb25zdCBwYXRjaE1hcmtlciA9IHBhdGNoQnVmZmVyLm1hcmtQb3NpdGlvbihcbiAgICAgIFBhdGNoLmxheWVyTmFtZSxcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCksXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcblxuICAgIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgb2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2hNYXJrZXIsIHJlbmRlclN0YXR1cyxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViUGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICAgICAgY29uc3QgW2h1bmtzLCBuZXh0UGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhjb250ZW50Q2hhbmdlRGlmZiwgc3ViUGF0Y2hCdWZmZXIpO1xuICAgICAgICBjb25zdCBuZXh0UGF0Y2ggPSBuZXcgUGF0Y2goe3N0YXR1cywgaHVua3MsIG1hcmtlcjogbmV4dFBhdGNoTWFya2VyfSk7XG5cbiAgICAgICAgc3ViUGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcbiAgICAgICAgcmV0dXJuIHtwYXRjaDogbmV4dFBhdGNoLCBwYXRjaEJ1ZmZlcjogc3ViUGF0Y2hCdWZmZXJ9O1xuICAgICAgfSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFtodW5rcywgcGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhjb250ZW50Q2hhbmdlRGlmZiwgcGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IHBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXMsIGh1bmtzLCBtYXJrZXI6IHBhdGNoTWFya2VyfSk7XG5cbiAgICBjb25zdCByYXdQYXRjaGVzID0gb3B0cy5wcmVzZXJ2ZU9yaWdpbmFsID8ge2NvbnRlbnQ6IGNvbnRlbnRDaGFuZ2VEaWZmLCBtb2RlOiBtb2RlQ2hhbmdlRGlmZn0gOiBudWxsO1xuICAgIHJldHVybiBuZXcgRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKTtcbiAgfVxufVxuXG5jb25zdCBDSEFOR0VLSU5EID0ge1xuICAnKyc6IEFkZGl0aW9uLFxuICAnLSc6IERlbGV0aW9uLFxuICAnICc6IFVuY2hhbmdlZCxcbiAgJ1xcXFwnOiBOb05ld2xpbmUsXG59O1xuXG5mdW5jdGlvbiBidWlsZEh1bmtzKGRpZmYsIHBhdGNoQnVmZmVyKSB7XG4gIGNvbnN0IGluc2VydGVyID0gcGF0Y2hCdWZmZXIuY3JlYXRlSW5zZXJ0ZXJBdEVuZCgpXG4gICAgLmtlZXBCZWZvcmUocGF0Y2hCdWZmZXIuZmluZEFsbE1hcmtlcnMoe2VuZFBvc2l0aW9uOiBwYXRjaEJ1ZmZlci5nZXRJbnNlcnRpb25Qb2ludCgpfSkpO1xuXG4gIGxldCBwYXRjaE1hcmtlciA9IG51bGw7XG4gIGxldCBmaXJzdEh1bmsgPSB0cnVlO1xuICBjb25zdCBodW5rcyA9IFtdO1xuXG4gIGluc2VydGVyLm1hcmtXaGlsZShQYXRjaC5sYXllck5hbWUsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJhd0h1bmsgb2YgZGlmZi5odW5rcykge1xuICAgICAgbGV0IGZpcnN0UmVnaW9uID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHJlZ2lvbnMgPSBbXTtcblxuICAgICAgLy8gU2VwYXJhdGUgaHVua3Mgd2l0aCBhbiB1bm1hcmtlZCBuZXdsaW5lXG4gICAgICBpZiAoZmlyc3RIdW5rKSB7XG4gICAgICAgIGZpcnN0SHVuayA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0KCdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zZXJ0ZXIubWFya1doaWxlKEh1bmsubGF5ZXJOYW1lLCAoKSA9PiB7XG4gICAgICAgIGxldCBmaXJzdFJlZ2lvbkxpbmUgPSB0cnVlO1xuICAgICAgICBsZXQgY3VycmVudFJlZ2lvblRleHQgPSAnJztcbiAgICAgICAgbGV0IEN1cnJlbnRSZWdpb25LaW5kID0gbnVsbDtcblxuICAgICAgICBmdW5jdGlvbiBmaW5pc2hSZWdpb24oKSB7XG4gICAgICAgICAgaWYgKEN1cnJlbnRSZWdpb25LaW5kID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2VwYXJhdGUgcmVnaW9ucyB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmVcbiAgICAgICAgICBpZiAoZmlyc3RSZWdpb24pIHtcbiAgICAgICAgICAgIGZpcnN0UmVnaW9uID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0TWFya2VkKGN1cnJlbnRSZWdpb25UZXh0LCBDdXJyZW50UmVnaW9uS2luZC5sYXllck5hbWUsIHtcbiAgICAgICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgICAgICBleGNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbihfcmVnaW9ucywgX0N1cnJlbnRSZWdpb25LaW5kKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWdpb25NYXJrZXIgPT4geyBfcmVnaW9ucy5wdXNoKG5ldyBfQ3VycmVudFJlZ2lvbktpbmQocmVnaW9uTWFya2VyKSk7IH07XG4gICAgICAgICAgICB9KShyZWdpb25zLCBDdXJyZW50UmVnaW9uS2luZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHJhd0xpbmUgb2YgcmF3SHVuay5saW5lcykge1xuICAgICAgICAgIGNvbnN0IE5leHRSZWdpb25LaW5kID0gQ0hBTkdFS0lORFtyYXdMaW5lWzBdXTtcbiAgICAgICAgICBpZiAoTmV4dFJlZ2lvbktpbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRpZmYgc3RhdHVzIGNoYXJhY3RlcjogXCIke3Jhd0xpbmVbMF19XCJgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV4dExpbmUgPSByYXdMaW5lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgbGV0IHNlcGFyYXRvciA9ICcnO1xuICAgICAgICAgIGlmIChmaXJzdFJlZ2lvbkxpbmUpIHtcbiAgICAgICAgICAgIGZpcnN0UmVnaW9uTGluZSA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXBhcmF0b3IgPSAnXFxuJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTmV4dFJlZ2lvbktpbmQgPT09IEN1cnJlbnRSZWdpb25LaW5kKSB7XG4gICAgICAgICAgICBjdXJyZW50UmVnaW9uVGV4dCArPSBzZXBhcmF0b3IgKyBuZXh0TGluZTtcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmlzaFJlZ2lvbigpO1xuXG4gICAgICAgICAgICBDdXJyZW50UmVnaW9uS2luZCA9IE5leHRSZWdpb25LaW5kO1xuICAgICAgICAgICAgY3VycmVudFJlZ2lvblRleHQgPSBuZXh0TGluZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluaXNoUmVnaW9uKCk7XG4gICAgICB9LCB7XG4gICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgIGV4Y2x1c2l2ZTogZmFsc2UsXG4gICAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24oX2h1bmtzLCBfcmF3SHVuaywgX3JlZ2lvbnMpIHtcbiAgICAgICAgICByZXR1cm4gaHVua01hcmtlciA9PiB7XG4gICAgICAgICAgICBfaHVua3MucHVzaChuZXcgSHVuayh7XG4gICAgICAgICAgICAgIG9sZFN0YXJ0Um93OiBfcmF3SHVuay5vbGRTdGFydExpbmUsXG4gICAgICAgICAgICAgIG5ld1N0YXJ0Um93OiBfcmF3SHVuay5uZXdTdGFydExpbmUsXG4gICAgICAgICAgICAgIG9sZFJvd0NvdW50OiBfcmF3SHVuay5vbGRMaW5lQ291bnQsXG4gICAgICAgICAgICAgIG5ld1Jvd0NvdW50OiBfcmF3SHVuay5uZXdMaW5lQ291bnQsXG4gICAgICAgICAgICAgIHNlY3Rpb25IZWFkaW5nOiBfcmF3SHVuay5oZWFkaW5nLFxuICAgICAgICAgICAgICBtYXJrZXI6IGh1bmtNYXJrZXIsXG4gICAgICAgICAgICAgIHJlZ2lvbnM6IF9yZWdpb25zLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKGh1bmtzLCByYXdIdW5rLCByZWdpb25zKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgZXhjbHVzaXZlOiBmYWxzZSxcbiAgICBjYWxsYmFjazogbWFya2VyID0+IHsgcGF0Y2hNYXJrZXIgPSBtYXJrZXI7IH0sXG4gIH0pO1xuXG4gIC8vIFNlcGFyYXRlIG11bHRpcGxlIG5vbi1lbXB0eSBwYXRjaGVzIG9uIHRoZSBzYW1lIGJ1ZmZlciB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmUuIFRoZSBuZXdsaW5lIGFmdGVyIHRoZSBmaW5hbFxuICAvLyBub24tZW1wdHkgcGF0Y2ggKGlmIHRoZXJlIGlzIG9uZSkgc2hvdWxkIGJlIGRlbGV0ZWQgYmVmb3JlIE11bHRpRmlsZVBhdGNoIGNvbnN0cnVjdGlvbi5cbiAgaWYgKGRpZmYuaHVua3MubGVuZ3RoID4gMCkge1xuICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gIH1cblxuICBpbnNlcnRlci5hcHBseSgpO1xuXG4gIHJldHVybiBbaHVua3MsIHBhdGNoTWFya2VyXTtcbn1cblxuZnVuY3Rpb24gaXNEaWZmTGFyZ2UoZGlmZnMsIG9wdHMpIHtcbiAgY29uc3Qgc2l6ZSA9IGRpZmZzLnJlZHVjZSgoZGlmZlNpemVDb3VudGVyLCBkaWZmKSA9PiB7XG4gICAgcmV0dXJuIGRpZmZTaXplQ291bnRlciArIGRpZmYuaHVua3MucmVkdWNlKChodW5rU2l6ZUNvdW50ZXIsIGh1bmspID0+IHtcbiAgICAgIHJldHVybiBodW5rU2l6ZUNvdW50ZXIgKyBodW5rLmxpbmVzLmxlbmd0aDtcbiAgICB9LCAwKTtcbiAgfSwgMCk7XG5cbiAgcmV0dXJuIHNpemUgPiBvcHRzLmxhcmdlRGlmZlRocmVzaG9sZDtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFBQSxZQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxLQUFBLEdBQUFDLHVCQUFBLENBQUFILE9BQUE7QUFDQSxJQUFBSSxNQUFBLEdBQUFELHVCQUFBLENBQUFILE9BQUE7QUFDQSxJQUFBSyxPQUFBLEdBQUFMLE9BQUE7QUFDQSxJQUFBTSxVQUFBLEdBQUFQLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTyxlQUFBLEdBQUFSLHNCQUFBLENBQUFDLE9BQUE7QUFBZ0QsU0FBQVEseUJBQUFDLENBQUEsNkJBQUFDLE9BQUEsbUJBQUFDLENBQUEsT0FBQUQsT0FBQSxJQUFBRSxDQUFBLE9B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