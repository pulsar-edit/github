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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJERUZBVUxUX09QVElPTlMiLCJsYXJnZURpZmZUaHJlc2hvbGQiLCJyZW5kZXJTdGF0dXNPdmVycmlkZXMiLCJwYXRjaEJ1ZmZlciIsInByZXNlcnZlT3JpZ2luYWwiLCJyZW1vdmVkIiwiU2V0IiwiYnVpbGRGaWxlUGF0Y2giLCJkaWZmcyIsIm9wdGlvbnMiLCJvcHRzIiwiUGF0Y2hCdWZmZXIiLCJmaWxlUGF0Y2giLCJsZW5ndGgiLCJlbXB0eURpZmZGaWxlUGF0Y2giLCJzaW5nbGVEaWZmRmlsZVBhdGNoIiwiZHVhbERpZmZGaWxlUGF0Y2giLCJFcnJvciIsImRlbGV0ZUxhc3ROZXdsaW5lIiwiTXVsdGlGaWxlUGF0Y2giLCJmaWxlUGF0Y2hlcyIsImJ1aWxkTXVsdGlGaWxlUGF0Y2giLCJieVBhdGgiLCJNYXAiLCJhY3Rpb25zIiwiaW5kZXgiLCJkaWZmIiwidGhlUGF0aCIsIm9sZFBhdGgiLCJuZXdQYXRoIiwic3RhdHVzIiwib3RoZXJIYWxmIiwiZ2V0Iiwib3RoZXJEaWZmIiwib3RoZXJJbmRleCIsIl9kaWZmIiwiX290aGVyRGlmZiIsImRlbGV0ZSIsInNldCIsInVucGFpcmVkRGlmZiIsIm9yaWdpbmFsSW5kZXgiLCJ2YWx1ZXMiLCJfdW5wYWlyZWREaWZmIiwibWFwIiwiYWN0aW9uIiwicmVtb3ZlZFBhdGgiLCJyZW1vdmVkRmlsZSIsIkZpbGUiLCJwYXRoIiwicmVtb3ZlZE1hcmtlciIsIm1hcmtQb3NpdGlvbiIsIlBhdGNoIiwibGF5ZXJOYW1lIiwiZ2V0QnVmZmVyIiwiZ2V0RW5kUG9zaXRpb24iLCJpbnZhbGlkYXRlIiwiZXhjbHVzaXZlIiwicHVzaCIsIkZpbGVQYXRjaCIsImNyZWF0ZUhpZGRlbkZpbGVQYXRjaCIsIlJFTU9WRUQiLCJjcmVhdGVOdWxsIiwid2FzU3ltbGluayIsIm9sZE1vZGUiLCJtb2RlcyIsIlNZTUxJTksiLCJpc1N5bWxpbmsiLCJuZXdNb2RlIiwib2xkU3ltbGluayIsIm5ld1N5bWxpbmsiLCJodW5rcyIsImxpbmVzIiwic2xpY2UiLCJvbGRGaWxlIiwibW9kZSIsInN5bWxpbmsiLCJudWxsRmlsZSIsIm5ld0ZpbGUiLCJyZW5kZXJTdGF0dXNPdmVycmlkZSIsImlzUHJlc2VudCIsImdldFBhdGgiLCJ1bmRlZmluZWQiLCJyZW5kZXJTdGF0dXMiLCJpc0RpZmZMYXJnZSIsIkRFRkVSUkVEIiwiRVhQQU5ERUQiLCJpc1Zpc2libGUiLCJwYXRjaE1hcmtlciIsInN1YlBhdGNoQnVmZmVyIiwibmV4dFBhdGNoTWFya2VyIiwiYnVpbGRIdW5rcyIsIm5leHRQYXRjaCIsIm1hcmtlciIsInBhdGNoIiwicmF3UGF0Y2hlcyIsImNvbnRlbnQiLCJkaWZmMSIsImRpZmYyIiwibW9kZUNoYW5nZURpZmYiLCJjb250ZW50Q2hhbmdlRGlmZiIsImZpbGVQYXRoIiwiQ0hBTkdFS0lORCIsIkFkZGl0aW9uIiwiRGVsZXRpb24iLCJVbmNoYW5nZWQiLCJOb05ld2xpbmUiLCJpbnNlcnRlciIsImNyZWF0ZUluc2VydGVyQXRFbmQiLCJrZWVwQmVmb3JlIiwiZmluZEFsbE1hcmtlcnMiLCJlbmRQb3NpdGlvbiIsImdldEluc2VydGlvblBvaW50IiwiZmlyc3RIdW5rIiwibWFya1doaWxlIiwicmF3SHVuayIsImZpcnN0UmVnaW9uIiwicmVnaW9ucyIsImluc2VydCIsIkh1bmsiLCJmaXJzdFJlZ2lvbkxpbmUiLCJjdXJyZW50UmVnaW9uVGV4dCIsIkN1cnJlbnRSZWdpb25LaW5kIiwiZmluaXNoUmVnaW9uIiwiaW5zZXJ0TWFya2VkIiwiY2FsbGJhY2siLCJfcmVnaW9ucyIsIl9DdXJyZW50UmVnaW9uS2luZCIsInJlZ2lvbk1hcmtlciIsInJhd0xpbmUiLCJOZXh0UmVnaW9uS2luZCIsIm5leHRMaW5lIiwic2VwYXJhdG9yIiwiX2h1bmtzIiwiX3Jhd0h1bmsiLCJodW5rTWFya2VyIiwib2xkU3RhcnRSb3ciLCJvbGRTdGFydExpbmUiLCJuZXdTdGFydFJvdyIsIm5ld1N0YXJ0TGluZSIsIm9sZFJvd0NvdW50Iiwib2xkTGluZUNvdW50IiwibmV3Um93Q291bnQiLCJuZXdMaW5lQ291bnQiLCJzZWN0aW9uSGVhZGluZyIsImhlYWRpbmciLCJhcHBseSIsInNpemUiLCJyZWR1Y2UiLCJkaWZmU2l6ZUNvdW50ZXIiLCJodW5rU2l6ZUNvdW50ZXIiLCJodW5rIl0sInNvdXJjZXMiOlsiYnVpbGRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGF0Y2hCdWZmZXIgZnJvbSAnLi9wYXRjaC1idWZmZXInO1xuaW1wb3J0IEh1bmsgZnJvbSAnLi9odW5rJztcbmltcG9ydCBGaWxlLCB7bnVsbEZpbGV9IGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgUGF0Y2gsIHtERUZFUlJFRCwgRVhQQU5ERUQsIFJFTU9WRUR9IGZyb20gJy4vcGF0Y2gnO1xuaW1wb3J0IHtVbmNoYW5nZWQsIEFkZGl0aW9uLCBEZWxldGlvbiwgTm9OZXdsaW5lfSBmcm9tICcuL3JlZ2lvbic7XG5pbXBvcnQgRmlsZVBhdGNoIGZyb20gJy4vZmlsZS1wYXRjaCc7XG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2ggZnJvbSAnLi9tdWx0aS1maWxlLXBhdGNoJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgLy8gTnVtYmVyIG9mIGxpbmVzIGFmdGVyIHdoaWNoIHdlIGNvbnNpZGVyIHRoZSBkaWZmIFwibGFyZ2VcIlxuICBsYXJnZURpZmZUaHJlc2hvbGQ6IDgwMCxcblxuICAvLyBNYXAgb2YgZmlsZSBwYXRoIChyZWxhdGl2ZSB0byByZXBvc2l0b3J5IHJvb3QpIHRvIFBhdGNoIHJlbmRlciBzdGF0dXMgKEVYUEFOREVELCBDT0xMQVBTRUQsIERFRkVSUkVEKVxuICByZW5kZXJTdGF0dXNPdmVycmlkZXM6IHt9LFxuXG4gIC8vIEV4aXN0aW5nIHBhdGNoIGJ1ZmZlciB0byByZW5kZXIgb250b1xuICBwYXRjaEJ1ZmZlcjogbnVsbCxcblxuICAvLyBTdG9yZSBvZmYgd2hhdC10aGUtZGlmZiBmaWxlIHBhdGNoXG4gIHByZXNlcnZlT3JpZ2luYWw6IGZhbHNlLFxuXG4gIC8vIFBhdGhzIG9mIGZpbGUgcGF0Y2hlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhdGNoIGJlZm9yZSBwYXJzaW5nXG4gIHJlbW92ZWQ6IG5ldyBTZXQoKSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZpbGVQYXRjaChkaWZmcywgb3B0aW9ucykge1xuICBjb25zdCBvcHRzID0gey4uLkRFRkFVTFRfT1BUSU9OUywgLi4ub3B0aW9uc307XG4gIGNvbnN0IHBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG5cbiAgbGV0IGZpbGVQYXRjaDtcbiAgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZpbGVQYXRjaCA9IGVtcHR5RGlmZkZpbGVQYXRjaCgpO1xuICB9IGVsc2UgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMSkge1xuICAgIGZpbGVQYXRjaCA9IHNpbmdsZURpZmZGaWxlUGF0Y2goZGlmZnNbMF0sIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgfSBlbHNlIGlmIChkaWZmcy5sZW5ndGggPT09IDIpIHtcbiAgICBmaWxlUGF0Y2ggPSBkdWFsRGlmZkZpbGVQYXRjaChkaWZmc1swXSwgZGlmZnNbMV0sIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbnVtYmVyIG9mIGRpZmZzOiAke2RpZmZzLmxlbmd0aH1gKTtcbiAgfVxuXG4gIC8vIERlbGV0ZSB0aGUgdHJhaWxpbmcgbmV3bGluZS5cbiAgcGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcblxuICByZXR1cm4gbmV3IE11bHRpRmlsZVBhdGNoKHtwYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXM6IFtmaWxlUGF0Y2hdfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE11bHRpRmlsZVBhdGNoKGRpZmZzLCBvcHRpb25zKSB7XG4gIGNvbnN0IG9wdHMgPSB7Li4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zfTtcblxuICBjb25zdCBwYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuXG4gIGNvbnN0IGJ5UGF0aCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgYWN0aW9ucyA9IFtdO1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAoY29uc3QgZGlmZiBvZiBkaWZmcykge1xuICAgIGNvbnN0IHRoZVBhdGggPSBkaWZmLm9sZFBhdGggfHwgZGlmZi5uZXdQYXRoO1xuXG4gICAgaWYgKGRpZmYuc3RhdHVzID09PSAnYWRkZWQnIHx8IGRpZmYuc3RhdHVzID09PSAnZGVsZXRlZCcpIHtcbiAgICAgIC8vIFBvdGVudGlhbCBwYWlyZWQgZGlmZi4gRWl0aGVyIGEgc3ltbGluayBkZWxldGlvbiArIGNvbnRlbnQgYWRkaXRpb24gb3IgYSBzeW1saW5rIGFkZGl0aW9uICtcbiAgICAgIC8vIGNvbnRlbnQgZGVsZXRpb24uXG4gICAgICBjb25zdCBvdGhlckhhbGYgPSBieVBhdGguZ2V0KHRoZVBhdGgpO1xuICAgICAgaWYgKG90aGVySGFsZikge1xuICAgICAgICAvLyBUaGUgc2Vjb25kIGhhbGYuIENvbXBsZXRlIHRoZSBwYWlyZWQgZGlmZiwgb3IgZmFpbCBpZiB0aGV5IGhhdmUgdW5leHBlY3RlZCBzdGF0dXNlcyBvciBtb2Rlcy5cbiAgICAgICAgY29uc3QgW290aGVyRGlmZiwgb3RoZXJJbmRleF0gPSBvdGhlckhhbGY7XG4gICAgICAgIGFjdGlvbnNbb3RoZXJJbmRleF0gPSAoZnVuY3Rpb24oX2RpZmYsIF9vdGhlckRpZmYpIHtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gZHVhbERpZmZGaWxlUGF0Y2goX2RpZmYsIF9vdGhlckRpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICAgICAgfSkoZGlmZiwgb3RoZXJEaWZmKTtcbiAgICAgICAgYnlQYXRoLmRlbGV0ZSh0aGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBoYWxmIHdlJ3ZlIHNlZW4uXG4gICAgICAgIGJ5UGF0aC5zZXQodGhlUGF0aCwgW2RpZmYsIGluZGV4XSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnNbaW5kZXhdID0gKGZ1bmN0aW9uKF9kaWZmKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiBzaW5nbGVEaWZmRmlsZVBhdGNoKF9kaWZmLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gICAgICB9KShkaWZmKTtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgLy8gUG9wdWxhdGUgdW5wYWlyZWQgZGlmZnMgdGhhdCBsb29rZWQgbGlrZSB0aGV5IGNvdWxkIGJlIHBhcnQgb2YgYSBwYWlyLCBidXQgd2VyZW4ndC5cbiAgZm9yIChjb25zdCBbdW5wYWlyZWREaWZmLCBvcmlnaW5hbEluZGV4XSBvZiBieVBhdGgudmFsdWVzKCkpIHtcbiAgICBhY3Rpb25zW29yaWdpbmFsSW5kZXhdID0gKGZ1bmN0aW9uKF91bnBhaXJlZERpZmYpIHtcbiAgICAgIHJldHVybiAoKSA9PiBzaW5nbGVEaWZmRmlsZVBhdGNoKF91bnBhaXJlZERpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICB9KSh1bnBhaXJlZERpZmYpO1xuICB9XG5cbiAgY29uc3QgZmlsZVBhdGNoZXMgPSBhY3Rpb25zLm1hcChhY3Rpb24gPT4gYWN0aW9uKCkpO1xuXG4gIC8vIERlbGV0ZSB0aGUgZmluYWwgdHJhaWxpbmcgbmV3bGluZSBmcm9tIHRoZSBsYXN0IG5vbi1lbXB0eSBwYXRjaC5cbiAgcGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcblxuICAvLyBBcHBlbmQgaGlkZGVuIHBhdGNoZXMgY29ycmVzcG9uZGluZyB0byBlYWNoIHJlbW92ZWQgZmlsZS5cbiAgZm9yIChjb25zdCByZW1vdmVkUGF0aCBvZiBvcHRzLnJlbW92ZWQpIHtcbiAgICBjb25zdCByZW1vdmVkRmlsZSA9IG5ldyBGaWxlKHtwYXRoOiByZW1vdmVkUGF0aH0pO1xuICAgIGNvbnN0IHJlbW92ZWRNYXJrZXIgPSBwYXRjaEJ1ZmZlci5tYXJrUG9zaXRpb24oXG4gICAgICBQYXRjaC5sYXllck5hbWUsXG4gICAgICBwYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRFbmRQb3NpdGlvbigpLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG4gICAgZmlsZVBhdGNoZXMucHVzaChGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgcmVtb3ZlZEZpbGUsXG4gICAgICByZW1vdmVkRmlsZSxcbiAgICAgIHJlbW92ZWRNYXJrZXIsXG4gICAgICBSRU1PVkVELFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICgpID0+IHsgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0IHRvIGV4cGFuZCByZW1vdmVkIGZpbGUgcGF0Y2ggJHtyZW1vdmVkUGF0aH1gKTsgfSxcbiAgICApKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgTXVsdGlGaWxlUGF0Y2goe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlc30pO1xufVxuXG5mdW5jdGlvbiBlbXB0eURpZmZGaWxlUGF0Y2goKSB7XG4gIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlTnVsbCgpO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVEaWZmRmlsZVBhdGNoKGRpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKSB7XG4gIGNvbnN0IHdhc1N5bWxpbmsgPSBkaWZmLm9sZE1vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSztcbiAgY29uc3QgaXNTeW1saW5rID0gZGlmZi5uZXdNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTks7XG5cbiAgbGV0IG9sZFN5bWxpbmsgPSBudWxsO1xuICBsZXQgbmV3U3ltbGluayA9IG51bGw7XG4gIGlmICh3YXNTeW1saW5rICYmICFpc1N5bWxpbmspIHtcbiAgICBvbGRTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgfSBlbHNlIGlmICghd2FzU3ltbGluayAmJiBpc1N5bWxpbmspIHtcbiAgICBuZXdTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgfSBlbHNlIGlmICh3YXNTeW1saW5rICYmIGlzU3ltbGluaykge1xuICAgIG9sZFN5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzBdLnNsaWNlKDEpO1xuICAgIG5ld1N5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzJdLnNsaWNlKDEpO1xuICB9XG5cbiAgY29uc3Qgb2xkRmlsZSA9IGRpZmYub2xkUGF0aCAhPT0gbnVsbCB8fCBkaWZmLm9sZE1vZGUgIT09IG51bGxcbiAgICA/IG5ldyBGaWxlKHtwYXRoOiBkaWZmLm9sZFBhdGgsIG1vZGU6IGRpZmYub2xkTW9kZSwgc3ltbGluazogb2xkU3ltbGlua30pXG4gICAgOiBudWxsRmlsZTtcbiAgY29uc3QgbmV3RmlsZSA9IGRpZmYubmV3UGF0aCAhPT0gbnVsbCB8fCBkaWZmLm5ld01vZGUgIT09IG51bGxcbiAgICA/IG5ldyBGaWxlKHtwYXRoOiBkaWZmLm5ld1BhdGgsIG1vZGU6IGRpZmYubmV3TW9kZSwgc3ltbGluazogbmV3U3ltbGlua30pXG4gICAgOiBudWxsRmlsZTtcblxuICBjb25zdCByZW5kZXJTdGF0dXNPdmVycmlkZSA9XG4gICAgKG9sZEZpbGUuaXNQcmVzZW50KCkgJiYgb3B0cy5yZW5kZXJTdGF0dXNPdmVycmlkZXNbb2xkRmlsZS5nZXRQYXRoKCldKSB8fFxuICAgIChuZXdGaWxlLmlzUHJlc2VudCgpICYmIG9wdHMucmVuZGVyU3RhdHVzT3ZlcnJpZGVzW25ld0ZpbGUuZ2V0UGF0aCgpXSkgfHxcbiAgICB1bmRlZmluZWQ7XG5cbiAgY29uc3QgcmVuZGVyU3RhdHVzID0gcmVuZGVyU3RhdHVzT3ZlcnJpZGUgfHxcbiAgICAoaXNEaWZmTGFyZ2UoW2RpZmZdLCBvcHRzKSAmJiBERUZFUlJFRCkgfHxcbiAgICBFWFBBTkRFRDtcblxuICBpZiAoIXJlbmRlclN0YXR1cy5pc1Zpc2libGUoKSkge1xuICAgIGNvbnN0IHBhdGNoTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgcGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIEZpbGVQYXRjaC5jcmVhdGVIaWRkZW5GaWxlUGF0Y2goXG4gICAgICBvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaE1hcmtlciwgcmVuZGVyU3RhdHVzLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBbaHVua3MsIG5leHRQYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGRpZmYsIHN1YlBhdGNoQnVmZmVyKTtcbiAgICAgICAgY29uc3QgbmV4dFBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXM6IGRpZmYuc3RhdHVzLCBodW5rcywgbWFya2VyOiBuZXh0UGF0Y2hNYXJrZXJ9KTtcblxuICAgICAgICBzdWJQYXRjaEJ1ZmZlci5kZWxldGVMYXN0TmV3bGluZSgpO1xuICAgICAgICByZXR1cm4ge3BhdGNoOiBuZXh0UGF0Y2gsIHBhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlcn07XG4gICAgICB9LFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW2h1bmtzLCBwYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGRpZmYsIHBhdGNoQnVmZmVyKTtcbiAgICBjb25zdCBwYXRjaCA9IG5ldyBQYXRjaCh7c3RhdHVzOiBkaWZmLnN0YXR1cywgaHVua3MsIG1hcmtlcjogcGF0Y2hNYXJrZXJ9KTtcblxuICAgIGNvbnN0IHJhd1BhdGNoZXMgPSBvcHRzLnByZXNlcnZlT3JpZ2luYWwgPyB7Y29udGVudDogZGlmZn0gOiBudWxsO1xuICAgIHJldHVybiBuZXcgRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkdWFsRGlmZkZpbGVQYXRjaChkaWZmMSwgZGlmZjIsIHBhdGNoQnVmZmVyLCBvcHRzKSB7XG4gIGxldCBtb2RlQ2hhbmdlRGlmZiwgY29udGVudENoYW5nZURpZmY7XG4gIGlmIChkaWZmMS5vbGRNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTksgfHwgZGlmZjEubmV3TW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LKSB7XG4gICAgbW9kZUNoYW5nZURpZmYgPSBkaWZmMTtcbiAgICBjb250ZW50Q2hhbmdlRGlmZiA9IGRpZmYyO1xuICB9IGVsc2Uge1xuICAgIG1vZGVDaGFuZ2VEaWZmID0gZGlmZjI7XG4gICAgY29udGVudENoYW5nZURpZmYgPSBkaWZmMTtcbiAgfVxuXG4gIGNvbnN0IGZpbGVQYXRoID0gY29udGVudENoYW5nZURpZmYub2xkUGF0aCB8fCBjb250ZW50Q2hhbmdlRGlmZi5uZXdQYXRoO1xuICBjb25zdCBzeW1saW5rID0gbW9kZUNoYW5nZURpZmYuaHVua3NbMF0ubGluZXNbMF0uc2xpY2UoMSk7XG5cbiAgbGV0IHN0YXR1cztcbiAgbGV0IG9sZE1vZGUsIG5ld01vZGU7XG4gIGxldCBvbGRTeW1saW5rID0gbnVsbDtcbiAgbGV0IG5ld1N5bWxpbmsgPSBudWxsO1xuICBpZiAobW9kZUNoYW5nZURpZmYuc3RhdHVzID09PSAnYWRkZWQnKSB7XG4gICAgLy8gY29udGVudHMgd2VyZSBkZWxldGVkIGFuZCByZXBsYWNlZCB3aXRoIHN5bWxpbmtcbiAgICBzdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgb2xkTW9kZSA9IGNvbnRlbnRDaGFuZ2VEaWZmLm9sZE1vZGU7XG4gICAgbmV3TW9kZSA9IG1vZGVDaGFuZ2VEaWZmLm5ld01vZGU7XG4gICAgbmV3U3ltbGluayA9IHN5bWxpbms7XG4gIH0gZWxzZSBpZiAobW9kZUNoYW5nZURpZmYuc3RhdHVzID09PSAnZGVsZXRlZCcpIHtcbiAgICAvLyBjb250ZW50cyB3ZXJlIGFkZGVkIGFmdGVyIHN5bWxpbmsgd2FzIGRlbGV0ZWRcbiAgICBzdGF0dXMgPSAnYWRkZWQnO1xuICAgIG9sZE1vZGUgPSBtb2RlQ2hhbmdlRGlmZi5vbGRNb2RlO1xuICAgIG9sZFN5bWxpbmsgPSBzeW1saW5rO1xuICAgIG5ld01vZGUgPSBjb250ZW50Q2hhbmdlRGlmZi5uZXdNb2RlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb2RlIGNoYW5nZSBkaWZmIHN0YXR1czogJHttb2RlQ2hhbmdlRGlmZi5zdGF0dXN9YCk7XG4gIH1cblxuICBjb25zdCBvbGRGaWxlID0gbmV3IEZpbGUoe3BhdGg6IGZpbGVQYXRoLCBtb2RlOiBvbGRNb2RlLCBzeW1saW5rOiBvbGRTeW1saW5rfSk7XG4gIGNvbnN0IG5ld0ZpbGUgPSBuZXcgRmlsZSh7cGF0aDogZmlsZVBhdGgsIG1vZGU6IG5ld01vZGUsIHN5bWxpbms6IG5ld1N5bWxpbmt9KTtcblxuICBjb25zdCByZW5kZXJTdGF0dXMgPSBvcHRzLnJlbmRlclN0YXR1c092ZXJyaWRlc1tmaWxlUGF0aF0gfHxcbiAgICAoaXNEaWZmTGFyZ2UoW2NvbnRlbnRDaGFuZ2VEaWZmXSwgb3B0cykgJiYgREVGRVJSRUQpIHx8XG4gICAgRVhQQU5ERUQ7XG5cbiAgaWYgKCFyZW5kZXJTdGF0dXMuaXNWaXNpYmxlKCkpIHtcbiAgICBjb25zdCBwYXRjaE1hcmtlciA9IHBhdGNoQnVmZmVyLm1hcmtQb3NpdGlvbihcbiAgICAgIFBhdGNoLmxheWVyTmFtZSxcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCksXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcblxuICAgIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgb2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2hNYXJrZXIsIHJlbmRlclN0YXR1cyxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViUGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICAgICAgY29uc3QgW2h1bmtzLCBuZXh0UGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhjb250ZW50Q2hhbmdlRGlmZiwgc3ViUGF0Y2hCdWZmZXIpO1xuICAgICAgICBjb25zdCBuZXh0UGF0Y2ggPSBuZXcgUGF0Y2goe3N0YXR1cywgaHVua3MsIG1hcmtlcjogbmV4dFBhdGNoTWFya2VyfSk7XG5cbiAgICAgICAgc3ViUGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcbiAgICAgICAgcmV0dXJuIHtwYXRjaDogbmV4dFBhdGNoLCBwYXRjaEJ1ZmZlcjogc3ViUGF0Y2hCdWZmZXJ9O1xuICAgICAgfSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFtodW5rcywgcGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhjb250ZW50Q2hhbmdlRGlmZiwgcGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IHBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXMsIGh1bmtzLCBtYXJrZXI6IHBhdGNoTWFya2VyfSk7XG5cbiAgICBjb25zdCByYXdQYXRjaGVzID0gb3B0cy5wcmVzZXJ2ZU9yaWdpbmFsID8ge2NvbnRlbnQ6IGNvbnRlbnRDaGFuZ2VEaWZmLCBtb2RlOiBtb2RlQ2hhbmdlRGlmZn0gOiBudWxsO1xuICAgIHJldHVybiBuZXcgRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKTtcbiAgfVxufVxuXG5jb25zdCBDSEFOR0VLSU5EID0ge1xuICAnKyc6IEFkZGl0aW9uLFxuICAnLSc6IERlbGV0aW9uLFxuICAnICc6IFVuY2hhbmdlZCxcbiAgJ1xcXFwnOiBOb05ld2xpbmUsXG59O1xuXG5mdW5jdGlvbiBidWlsZEh1bmtzKGRpZmYsIHBhdGNoQnVmZmVyKSB7XG4gIGNvbnN0IGluc2VydGVyID0gcGF0Y2hCdWZmZXIuY3JlYXRlSW5zZXJ0ZXJBdEVuZCgpXG4gICAgLmtlZXBCZWZvcmUocGF0Y2hCdWZmZXIuZmluZEFsbE1hcmtlcnMoe2VuZFBvc2l0aW9uOiBwYXRjaEJ1ZmZlci5nZXRJbnNlcnRpb25Qb2ludCgpfSkpO1xuXG4gIGxldCBwYXRjaE1hcmtlciA9IG51bGw7XG4gIGxldCBmaXJzdEh1bmsgPSB0cnVlO1xuICBjb25zdCBodW5rcyA9IFtdO1xuXG4gIGluc2VydGVyLm1hcmtXaGlsZShQYXRjaC5sYXllck5hbWUsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJhd0h1bmsgb2YgZGlmZi5odW5rcykge1xuICAgICAgbGV0IGZpcnN0UmVnaW9uID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHJlZ2lvbnMgPSBbXTtcblxuICAgICAgLy8gU2VwYXJhdGUgaHVua3Mgd2l0aCBhbiB1bm1hcmtlZCBuZXdsaW5lXG4gICAgICBpZiAoZmlyc3RIdW5rKSB7XG4gICAgICAgIGZpcnN0SHVuayA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0KCdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zZXJ0ZXIubWFya1doaWxlKEh1bmsubGF5ZXJOYW1lLCAoKSA9PiB7XG4gICAgICAgIGxldCBmaXJzdFJlZ2lvbkxpbmUgPSB0cnVlO1xuICAgICAgICBsZXQgY3VycmVudFJlZ2lvblRleHQgPSAnJztcbiAgICAgICAgbGV0IEN1cnJlbnRSZWdpb25LaW5kID0gbnVsbDtcblxuICAgICAgICBmdW5jdGlvbiBmaW5pc2hSZWdpb24oKSB7XG4gICAgICAgICAgaWYgKEN1cnJlbnRSZWdpb25LaW5kID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2VwYXJhdGUgcmVnaW9ucyB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmVcbiAgICAgICAgICBpZiAoZmlyc3RSZWdpb24pIHtcbiAgICAgICAgICAgIGZpcnN0UmVnaW9uID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0TWFya2VkKGN1cnJlbnRSZWdpb25UZXh0LCBDdXJyZW50UmVnaW9uS2luZC5sYXllck5hbWUsIHtcbiAgICAgICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgICAgICBleGNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbihfcmVnaW9ucywgX0N1cnJlbnRSZWdpb25LaW5kKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWdpb25NYXJrZXIgPT4geyBfcmVnaW9ucy5wdXNoKG5ldyBfQ3VycmVudFJlZ2lvbktpbmQocmVnaW9uTWFya2VyKSk7IH07XG4gICAgICAgICAgICB9KShyZWdpb25zLCBDdXJyZW50UmVnaW9uS2luZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHJhd0xpbmUgb2YgcmF3SHVuay5saW5lcykge1xuICAgICAgICAgIGNvbnN0IE5leHRSZWdpb25LaW5kID0gQ0hBTkdFS0lORFtyYXdMaW5lWzBdXTtcbiAgICAgICAgICBpZiAoTmV4dFJlZ2lvbktpbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRpZmYgc3RhdHVzIGNoYXJhY3RlcjogXCIke3Jhd0xpbmVbMF19XCJgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV4dExpbmUgPSByYXdMaW5lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgbGV0IHNlcGFyYXRvciA9ICcnO1xuICAgICAgICAgIGlmIChmaXJzdFJlZ2lvbkxpbmUpIHtcbiAgICAgICAgICAgIGZpcnN0UmVnaW9uTGluZSA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXBhcmF0b3IgPSAnXFxuJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTmV4dFJlZ2lvbktpbmQgPT09IEN1cnJlbnRSZWdpb25LaW5kKSB7XG4gICAgICAgICAgICBjdXJyZW50UmVnaW9uVGV4dCArPSBzZXBhcmF0b3IgKyBuZXh0TGluZTtcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmlzaFJlZ2lvbigpO1xuXG4gICAgICAgICAgICBDdXJyZW50UmVnaW9uS2luZCA9IE5leHRSZWdpb25LaW5kO1xuICAgICAgICAgICAgY3VycmVudFJlZ2lvblRleHQgPSBuZXh0TGluZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluaXNoUmVnaW9uKCk7XG4gICAgICB9LCB7XG4gICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgIGV4Y2x1c2l2ZTogZmFsc2UsXG4gICAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24oX2h1bmtzLCBfcmF3SHVuaywgX3JlZ2lvbnMpIHtcbiAgICAgICAgICByZXR1cm4gaHVua01hcmtlciA9PiB7XG4gICAgICAgICAgICBfaHVua3MucHVzaChuZXcgSHVuayh7XG4gICAgICAgICAgICAgIG9sZFN0YXJ0Um93OiBfcmF3SHVuay5vbGRTdGFydExpbmUsXG4gICAgICAgICAgICAgIG5ld1N0YXJ0Um93OiBfcmF3SHVuay5uZXdTdGFydExpbmUsXG4gICAgICAgICAgICAgIG9sZFJvd0NvdW50OiBfcmF3SHVuay5vbGRMaW5lQ291bnQsXG4gICAgICAgICAgICAgIG5ld1Jvd0NvdW50OiBfcmF3SHVuay5uZXdMaW5lQ291bnQsXG4gICAgICAgICAgICAgIHNlY3Rpb25IZWFkaW5nOiBfcmF3SHVuay5oZWFkaW5nLFxuICAgICAgICAgICAgICBtYXJrZXI6IGh1bmtNYXJrZXIsXG4gICAgICAgICAgICAgIHJlZ2lvbnM6IF9yZWdpb25zLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKGh1bmtzLCByYXdIdW5rLCByZWdpb25zKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgZXhjbHVzaXZlOiBmYWxzZSxcbiAgICBjYWxsYmFjazogbWFya2VyID0+IHsgcGF0Y2hNYXJrZXIgPSBtYXJrZXI7IH0sXG4gIH0pO1xuXG4gIC8vIFNlcGFyYXRlIG11bHRpcGxlIG5vbi1lbXB0eSBwYXRjaGVzIG9uIHRoZSBzYW1lIGJ1ZmZlciB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmUuIFRoZSBuZXdsaW5lIGFmdGVyIHRoZSBmaW5hbFxuICAvLyBub24tZW1wdHkgcGF0Y2ggKGlmIHRoZXJlIGlzIG9uZSkgc2hvdWxkIGJlIGRlbGV0ZWQgYmVmb3JlIE11bHRpRmlsZVBhdGNoIGNvbnN0cnVjdGlvbi5cbiAgaWYgKGRpZmYuaHVua3MubGVuZ3RoID4gMCkge1xuICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gIH1cblxuICBpbnNlcnRlci5hcHBseSgpO1xuXG4gIHJldHVybiBbaHVua3MsIHBhdGNoTWFya2VyXTtcbn1cblxuZnVuY3Rpb24gaXNEaWZmTGFyZ2UoZGlmZnMsIG9wdHMpIHtcbiAgY29uc3Qgc2l6ZSA9IGRpZmZzLnJlZHVjZSgoZGlmZlNpemVDb3VudGVyLCBkaWZmKSA9PiB7XG4gICAgcmV0dXJuIGRpZmZTaXplQ291bnRlciArIGRpZmYuaHVua3MucmVkdWNlKChodW5rU2l6ZUNvdW50ZXIsIGh1bmspID0+IHtcbiAgICAgIHJldHVybiBodW5rU2l6ZUNvdW50ZXIgKyBodW5rLmxpbmVzLmxlbmd0aDtcbiAgICB9LCAwKTtcbiAgfSwgMCk7XG5cbiAgcmV0dXJuIHNpemUgPiBvcHRzLmxhcmdlRGlmZlRocmVzaG9sZDtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFnRDtBQUFBO0FBQUE7QUFBQTtB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