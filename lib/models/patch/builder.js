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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0Y2hCdWZmZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9odW5rIiwiX2ZpbGUiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wYXRjaCIsIl9yZWdpb24iLCJfZmlsZVBhdGNoIiwiX211bHRpRmlsZVBhdGNoIiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJjYWNoZSIsImhhcyIsImdldCIsIm5ld09iaiIsImhhc1Byb3BlcnR5RGVzY3JpcHRvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZGVzYyIsInNldCIsIm93bktleXMiLCJvYmplY3QiLCJlbnVtZXJhYmxlT25seSIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiREVGQVVMVF9PUFRJT05TIiwibGFyZ2VEaWZmVGhyZXNob2xkIiwicmVuZGVyU3RhdHVzT3ZlcnJpZGVzIiwicGF0Y2hCdWZmZXIiLCJwcmVzZXJ2ZU9yaWdpbmFsIiwicmVtb3ZlZCIsIlNldCIsImV4cG9ydHMiLCJidWlsZEZpbGVQYXRjaCIsImRpZmZzIiwib3B0aW9ucyIsIm9wdHMiLCJQYXRjaEJ1ZmZlciIsImZpbGVQYXRjaCIsImVtcHR5RGlmZkZpbGVQYXRjaCIsInNpbmdsZURpZmZGaWxlUGF0Y2giLCJkdWFsRGlmZkZpbGVQYXRjaCIsIkVycm9yIiwiZGVsZXRlTGFzdE5ld2xpbmUiLCJNdWx0aUZpbGVQYXRjaCIsImZpbGVQYXRjaGVzIiwiYnVpbGRNdWx0aUZpbGVQYXRjaCIsImJ5UGF0aCIsIk1hcCIsImFjdGlvbnMiLCJpbmRleCIsImRpZmYiLCJ0aGVQYXRoIiwib2xkUGF0aCIsIm5ld1BhdGgiLCJzdGF0dXMiLCJvdGhlckhhbGYiLCJvdGhlckRpZmYiLCJvdGhlckluZGV4IiwiX2RpZmYiLCJfb3RoZXJEaWZmIiwiZGVsZXRlIiwidW5wYWlyZWREaWZmIiwib3JpZ2luYWxJbmRleCIsInZhbHVlcyIsIl91bnBhaXJlZERpZmYiLCJtYXAiLCJhY3Rpb24iLCJyZW1vdmVkUGF0aCIsInJlbW92ZWRGaWxlIiwiRmlsZSIsInBhdGgiLCJyZW1vdmVkTWFya2VyIiwibWFya1Bvc2l0aW9uIiwiUGF0Y2giLCJsYXllck5hbWUiLCJnZXRCdWZmZXIiLCJnZXRFbmRQb3NpdGlvbiIsImludmFsaWRhdGUiLCJleGNsdXNpdmUiLCJGaWxlUGF0Y2giLCJjcmVhdGVIaWRkZW5GaWxlUGF0Y2giLCJSRU1PVkVEIiwiY3JlYXRlTnVsbCIsIndhc1N5bWxpbmsiLCJvbGRNb2RlIiwibW9kZXMiLCJTWU1MSU5LIiwiaXNTeW1saW5rIiwibmV3TW9kZSIsIm9sZFN5bWxpbmsiLCJuZXdTeW1saW5rIiwiaHVua3MiLCJsaW5lcyIsInNsaWNlIiwib2xkRmlsZSIsIm1vZGUiLCJzeW1saW5rIiwibnVsbEZpbGUiLCJuZXdGaWxlIiwicmVuZGVyU3RhdHVzT3ZlcnJpZGUiLCJpc1ByZXNlbnQiLCJnZXRQYXRoIiwicmVuZGVyU3RhdHVzIiwiaXNEaWZmTGFyZ2UiLCJERUZFUlJFRCIsIkVYUEFOREVEIiwiaXNWaXNpYmxlIiwicGF0Y2hNYXJrZXIiLCJzdWJQYXRjaEJ1ZmZlciIsIm5leHRQYXRjaE1hcmtlciIsImJ1aWxkSHVua3MiLCJuZXh0UGF0Y2giLCJtYXJrZXIiLCJwYXRjaCIsInJhd1BhdGNoZXMiLCJjb250ZW50IiwiZGlmZjEiLCJkaWZmMiIsIm1vZGVDaGFuZ2VEaWZmIiwiY29udGVudENoYW5nZURpZmYiLCJmaWxlUGF0aCIsIkNIQU5HRUtJTkQiLCJBZGRpdGlvbiIsIkRlbGV0aW9uIiwiVW5jaGFuZ2VkIiwiTm9OZXdsaW5lIiwiaW5zZXJ0ZXIiLCJjcmVhdGVJbnNlcnRlckF0RW5kIiwia2VlcEJlZm9yZSIsImZpbmRBbGxNYXJrZXJzIiwiZW5kUG9zaXRpb24iLCJnZXRJbnNlcnRpb25Qb2ludCIsImZpcnN0SHVuayIsIm1hcmtXaGlsZSIsInJhd0h1bmsiLCJmaXJzdFJlZ2lvbiIsInJlZ2lvbnMiLCJpbnNlcnQiLCJIdW5rIiwiZmlyc3RSZWdpb25MaW5lIiwiY3VycmVudFJlZ2lvblRleHQiLCJDdXJyZW50UmVnaW9uS2luZCIsImZpbmlzaFJlZ2lvbiIsImluc2VydE1hcmtlZCIsImNhbGxiYWNrIiwiX3JlZ2lvbnMiLCJfQ3VycmVudFJlZ2lvbktpbmQiLCJyZWdpb25NYXJrZXIiLCJyYXdMaW5lIiwiTmV4dFJlZ2lvbktpbmQiLCJuZXh0TGluZSIsInNlcGFyYXRvciIsIl9odW5rcyIsIl9yYXdIdW5rIiwiaHVua01hcmtlciIsIm9sZFN0YXJ0Um93Iiwib2xkU3RhcnRMaW5lIiwibmV3U3RhcnRSb3ciLCJuZXdTdGFydExpbmUiLCJvbGRSb3dDb3VudCIsIm9sZExpbmVDb3VudCIsIm5ld1Jvd0NvdW50IiwibmV3TGluZUNvdW50Iiwic2VjdGlvbkhlYWRpbmciLCJoZWFkaW5nIiwic2l6ZSIsInJlZHVjZSIsImRpZmZTaXplQ291bnRlciIsImh1bmtTaXplQ291bnRlciIsImh1bmsiXSwic291cmNlcyI6WyJidWlsZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYXRjaEJ1ZmZlciBmcm9tICcuL3BhdGNoLWJ1ZmZlcic7XG5pbXBvcnQgSHVuayBmcm9tICcuL2h1bmsnO1xuaW1wb3J0IEZpbGUsIHtudWxsRmlsZX0gZnJvbSAnLi9maWxlJztcbmltcG9ydCBQYXRjaCwge0RFRkVSUkVELCBFWFBBTkRFRCwgUkVNT1ZFRH0gZnJvbSAnLi9wYXRjaCc7XG5pbXBvcnQge1VuY2hhbmdlZCwgQWRkaXRpb24sIERlbGV0aW9uLCBOb05ld2xpbmV9IGZyb20gJy4vcmVnaW9uJztcbmltcG9ydCBGaWxlUGF0Y2ggZnJvbSAnLi9maWxlLXBhdGNoJztcbmltcG9ydCBNdWx0aUZpbGVQYXRjaCBmcm9tICcuL211bHRpLWZpbGUtcGF0Y2gnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICAvLyBOdW1iZXIgb2YgbGluZXMgYWZ0ZXIgd2hpY2ggd2UgY29uc2lkZXIgdGhlIGRpZmYgXCJsYXJnZVwiXG4gIGxhcmdlRGlmZlRocmVzaG9sZDogODAwLFxuXG4gIC8vIE1hcCBvZiBmaWxlIHBhdGggKHJlbGF0aXZlIHRvIHJlcG9zaXRvcnkgcm9vdCkgdG8gUGF0Y2ggcmVuZGVyIHN0YXR1cyAoRVhQQU5ERUQsIENPTExBUFNFRCwgREVGRVJSRUQpXG4gIHJlbmRlclN0YXR1c092ZXJyaWRlczoge30sXG5cbiAgLy8gRXhpc3RpbmcgcGF0Y2ggYnVmZmVyIHRvIHJlbmRlciBvbnRvXG4gIHBhdGNoQnVmZmVyOiBudWxsLFxuXG4gIC8vIFN0b3JlIG9mZiB3aGF0LXRoZS1kaWZmIGZpbGUgcGF0Y2hcbiAgcHJlc2VydmVPcmlnaW5hbDogZmFsc2UsXG5cbiAgLy8gUGF0aHMgb2YgZmlsZSBwYXRjaGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcGF0Y2ggYmVmb3JlIHBhcnNpbmdcbiAgcmVtb3ZlZDogbmV3IFNldCgpLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRmlsZVBhdGNoKGRpZmZzLCBvcHRpb25zKSB7XG4gIGNvbnN0IG9wdHMgPSB7Li4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zfTtcbiAgY29uc3QgcGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcblxuICBsZXQgZmlsZVBhdGNoO1xuICBpZiAoZGlmZnMubGVuZ3RoID09PSAwKSB7XG4gICAgZmlsZVBhdGNoID0gZW1wdHlEaWZmRmlsZVBhdGNoKCk7XG4gIH0gZWxzZSBpZiAoZGlmZnMubGVuZ3RoID09PSAxKSB7XG4gICAgZmlsZVBhdGNoID0gc2luZ2xlRGlmZkZpbGVQYXRjaChkaWZmc1swXSwgcGF0Y2hCdWZmZXIsIG9wdHMpO1xuICB9IGVsc2UgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMikge1xuICAgIGZpbGVQYXRjaCA9IGR1YWxEaWZmRmlsZVBhdGNoKGRpZmZzWzBdLCBkaWZmc1sxXSwgcGF0Y2hCdWZmZXIsIG9wdHMpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBudW1iZXIgb2YgZGlmZnM6ICR7ZGlmZnMubGVuZ3RofWApO1xuICB9XG5cbiAgLy8gRGVsZXRlIHRoZSB0cmFpbGluZyBuZXdsaW5lLlxuICBwYXRjaEJ1ZmZlci5kZWxldGVMYXN0TmV3bGluZSgpO1xuXG4gIHJldHVybiBuZXcgTXVsdGlGaWxlUGF0Y2goe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlczogW2ZpbGVQYXRjaF19KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTXVsdGlGaWxlUGF0Y2goZGlmZnMsIG9wdGlvbnMpIHtcbiAgY29uc3Qgb3B0cyA9IHsuLi5ERUZBVUxUX09QVElPTlMsIC4uLm9wdGlvbnN9O1xuXG4gIGNvbnN0IHBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG5cbiAgY29uc3QgYnlQYXRoID0gbmV3IE1hcCgpO1xuICBjb25zdCBhY3Rpb25zID0gW107XG5cbiAgbGV0IGluZGV4ID0gMDtcbiAgZm9yIChjb25zdCBkaWZmIG9mIGRpZmZzKSB7XG4gICAgY29uc3QgdGhlUGF0aCA9IGRpZmYub2xkUGF0aCB8fCBkaWZmLm5ld1BhdGg7XG5cbiAgICBpZiAoZGlmZi5zdGF0dXMgPT09ICdhZGRlZCcgfHwgZGlmZi5zdGF0dXMgPT09ICdkZWxldGVkJykge1xuICAgICAgLy8gUG90ZW50aWFsIHBhaXJlZCBkaWZmLiBFaXRoZXIgYSBzeW1saW5rIGRlbGV0aW9uICsgY29udGVudCBhZGRpdGlvbiBvciBhIHN5bWxpbmsgYWRkaXRpb24gK1xuICAgICAgLy8gY29udGVudCBkZWxldGlvbi5cbiAgICAgIGNvbnN0IG90aGVySGFsZiA9IGJ5UGF0aC5nZXQodGhlUGF0aCk7XG4gICAgICBpZiAob3RoZXJIYWxmKSB7XG4gICAgICAgIC8vIFRoZSBzZWNvbmQgaGFsZi4gQ29tcGxldGUgdGhlIHBhaXJlZCBkaWZmLCBvciBmYWlsIGlmIHRoZXkgaGF2ZSB1bmV4cGVjdGVkIHN0YXR1c2VzIG9yIG1vZGVzLlxuICAgICAgICBjb25zdCBbb3RoZXJEaWZmLCBvdGhlckluZGV4XSA9IG90aGVySGFsZjtcbiAgICAgICAgYWN0aW9uc1tvdGhlckluZGV4XSA9IChmdW5jdGlvbihfZGlmZiwgX290aGVyRGlmZikge1xuICAgICAgICAgIHJldHVybiAoKSA9PiBkdWFsRGlmZkZpbGVQYXRjaChfZGlmZiwgX290aGVyRGlmZiwgcGF0Y2hCdWZmZXIsIG9wdHMpO1xuICAgICAgICB9KShkaWZmLCBvdGhlckRpZmYpO1xuICAgICAgICBieVBhdGguZGVsZXRlKHRoZVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IGhhbGYgd2UndmUgc2Vlbi5cbiAgICAgICAgYnlQYXRoLnNldCh0aGVQYXRoLCBbZGlmZiwgaW5kZXhdKTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uc1tpbmRleF0gPSAoZnVuY3Rpb24oX2RpZmYpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHNpbmdsZURpZmZGaWxlUGF0Y2goX2RpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICAgIH0pKGRpZmYpO1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gIH1cblxuICAvLyBQb3B1bGF0ZSB1bnBhaXJlZCBkaWZmcyB0aGF0IGxvb2tlZCBsaWtlIHRoZXkgY291bGQgYmUgcGFydCBvZiBhIHBhaXIsIGJ1dCB3ZXJlbid0LlxuICBmb3IgKGNvbnN0IFt1bnBhaXJlZERpZmYsIG9yaWdpbmFsSW5kZXhdIG9mIGJ5UGF0aC52YWx1ZXMoKSkge1xuICAgIGFjdGlvbnNbb3JpZ2luYWxJbmRleF0gPSAoZnVuY3Rpb24oX3VucGFpcmVkRGlmZikge1xuICAgICAgcmV0dXJuICgpID0+IHNpbmdsZURpZmZGaWxlUGF0Y2goX3VucGFpcmVkRGlmZiwgcGF0Y2hCdWZmZXIsIG9wdHMpO1xuICAgIH0pKHVucGFpcmVkRGlmZik7XG4gIH1cblxuICBjb25zdCBmaWxlUGF0Y2hlcyA9IGFjdGlvbnMubWFwKGFjdGlvbiA9PiBhY3Rpb24oKSk7XG5cbiAgLy8gRGVsZXRlIHRoZSBmaW5hbCB0cmFpbGluZyBuZXdsaW5lIGZyb20gdGhlIGxhc3Qgbm9uLWVtcHR5IHBhdGNoLlxuICBwYXRjaEJ1ZmZlci5kZWxldGVMYXN0TmV3bGluZSgpO1xuXG4gIC8vIEFwcGVuZCBoaWRkZW4gcGF0Y2hlcyBjb3JyZXNwb25kaW5nIHRvIGVhY2ggcmVtb3ZlZCBmaWxlLlxuICBmb3IgKGNvbnN0IHJlbW92ZWRQYXRoIG9mIG9wdHMucmVtb3ZlZCkge1xuICAgIGNvbnN0IHJlbW92ZWRGaWxlID0gbmV3IEZpbGUoe3BhdGg6IHJlbW92ZWRQYXRofSk7XG4gICAgY29uc3QgcmVtb3ZlZE1hcmtlciA9IHBhdGNoQnVmZmVyLm1hcmtQb3NpdGlvbihcbiAgICAgIFBhdGNoLmxheWVyTmFtZSxcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCksXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcbiAgICBmaWxlUGF0Y2hlcy5wdXNoKEZpbGVQYXRjaC5jcmVhdGVIaWRkZW5GaWxlUGF0Y2goXG4gICAgICByZW1vdmVkRmlsZSxcbiAgICAgIHJlbW92ZWRGaWxlLFxuICAgICAgcmVtb3ZlZE1hcmtlcixcbiAgICAgIFJFTU9WRUQsXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHQgdG8gZXhwYW5kIHJlbW92ZWQgZmlsZSBwYXRjaCAke3JlbW92ZWRQYXRofWApOyB9LFxuICAgICkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBNdWx0aUZpbGVQYXRjaCh7cGF0Y2hCdWZmZXIsIGZpbGVQYXRjaGVzfSk7XG59XG5cbmZ1bmN0aW9uIGVtcHR5RGlmZkZpbGVQYXRjaCgpIHtcbiAgcmV0dXJuIEZpbGVQYXRjaC5jcmVhdGVOdWxsKCk7XG59XG5cbmZ1bmN0aW9uIHNpbmdsZURpZmZGaWxlUGF0Y2goZGlmZiwgcGF0Y2hCdWZmZXIsIG9wdHMpIHtcbiAgY29uc3Qgd2FzU3ltbGluayA9IGRpZmYub2xkTW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LO1xuICBjb25zdCBpc1N5bWxpbmsgPSBkaWZmLm5ld01vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSztcblxuICBsZXQgb2xkU3ltbGluayA9IG51bGw7XG4gIGxldCBuZXdTeW1saW5rID0gbnVsbDtcbiAgaWYgKHdhc1N5bWxpbmsgJiYgIWlzU3ltbGluaykge1xuICAgIG9sZFN5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzBdLnNsaWNlKDEpO1xuICB9IGVsc2UgaWYgKCF3YXNTeW1saW5rICYmIGlzU3ltbGluaykge1xuICAgIG5ld1N5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzBdLnNsaWNlKDEpO1xuICB9IGVsc2UgaWYgKHdhc1N5bWxpbmsgJiYgaXNTeW1saW5rKSB7XG4gICAgb2xkU3ltbGluayA9IGRpZmYuaHVua3NbMF0ubGluZXNbMF0uc2xpY2UoMSk7XG4gICAgbmV3U3ltbGluayA9IGRpZmYuaHVua3NbMF0ubGluZXNbMl0uc2xpY2UoMSk7XG4gIH1cblxuICBjb25zdCBvbGRGaWxlID0gZGlmZi5vbGRQYXRoICE9PSBudWxsIHx8IGRpZmYub2xkTW9kZSAhPT0gbnVsbFxuICAgID8gbmV3IEZpbGUoe3BhdGg6IGRpZmYub2xkUGF0aCwgbW9kZTogZGlmZi5vbGRNb2RlLCBzeW1saW5rOiBvbGRTeW1saW5rfSlcbiAgICA6IG51bGxGaWxlO1xuICBjb25zdCBuZXdGaWxlID0gZGlmZi5uZXdQYXRoICE9PSBudWxsIHx8IGRpZmYubmV3TW9kZSAhPT0gbnVsbFxuICAgID8gbmV3IEZpbGUoe3BhdGg6IGRpZmYubmV3UGF0aCwgbW9kZTogZGlmZi5uZXdNb2RlLCBzeW1saW5rOiBuZXdTeW1saW5rfSlcbiAgICA6IG51bGxGaWxlO1xuXG4gIGNvbnN0IHJlbmRlclN0YXR1c092ZXJyaWRlID1cbiAgICAob2xkRmlsZS5pc1ByZXNlbnQoKSAmJiBvcHRzLnJlbmRlclN0YXR1c092ZXJyaWRlc1tvbGRGaWxlLmdldFBhdGgoKV0pIHx8XG4gICAgKG5ld0ZpbGUuaXNQcmVzZW50KCkgJiYgb3B0cy5yZW5kZXJTdGF0dXNPdmVycmlkZXNbbmV3RmlsZS5nZXRQYXRoKCldKSB8fFxuICAgIHVuZGVmaW5lZDtcblxuICBjb25zdCByZW5kZXJTdGF0dXMgPSByZW5kZXJTdGF0dXNPdmVycmlkZSB8fFxuICAgIChpc0RpZmZMYXJnZShbZGlmZl0sIG9wdHMpICYmIERFRkVSUkVEKSB8fFxuICAgIEVYUEFOREVEO1xuXG4gIGlmICghcmVuZGVyU3RhdHVzLmlzVmlzaWJsZSgpKSB7XG4gICAgY29uc3QgcGF0Y2hNYXJrZXIgPSBwYXRjaEJ1ZmZlci5tYXJrUG9zaXRpb24oXG4gICAgICBQYXRjaC5sYXllck5hbWUsXG4gICAgICBwYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRFbmRQb3NpdGlvbigpLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG5cbiAgICByZXR1cm4gRmlsZVBhdGNoLmNyZWF0ZUhpZGRlbkZpbGVQYXRjaChcbiAgICAgIG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoTWFya2VyLCByZW5kZXJTdGF0dXMsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YlBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG4gICAgICAgIGNvbnN0IFtodW5rcywgbmV4dFBhdGNoTWFya2VyXSA9IGJ1aWxkSHVua3MoZGlmZiwgc3ViUGF0Y2hCdWZmZXIpO1xuICAgICAgICBjb25zdCBuZXh0UGF0Y2ggPSBuZXcgUGF0Y2goe3N0YXR1czogZGlmZi5zdGF0dXMsIGh1bmtzLCBtYXJrZXI6IG5leHRQYXRjaE1hcmtlcn0pO1xuXG4gICAgICAgIHN1YlBhdGNoQnVmZmVyLmRlbGV0ZUxhc3ROZXdsaW5lKCk7XG4gICAgICAgIHJldHVybiB7cGF0Y2g6IG5leHRQYXRjaCwgcGF0Y2hCdWZmZXI6IHN1YlBhdGNoQnVmZmVyfTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBbaHVua3MsIHBhdGNoTWFya2VyXSA9IGJ1aWxkSHVua3MoZGlmZiwgcGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IHBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXM6IGRpZmYuc3RhdHVzLCBodW5rcywgbWFya2VyOiBwYXRjaE1hcmtlcn0pO1xuXG4gICAgY29uc3QgcmF3UGF0Y2hlcyA9IG9wdHMucHJlc2VydmVPcmlnaW5hbCA/IHtjb250ZW50OiBkaWZmfSA6IG51bGw7XG4gICAgcmV0dXJuIG5ldyBGaWxlUGF0Y2gob2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2gsIHJhd1BhdGNoZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGR1YWxEaWZmRmlsZVBhdGNoKGRpZmYxLCBkaWZmMiwgcGF0Y2hCdWZmZXIsIG9wdHMpIHtcbiAgbGV0IG1vZGVDaGFuZ2VEaWZmLCBjb250ZW50Q2hhbmdlRGlmZjtcbiAgaWYgKGRpZmYxLm9sZE1vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSyB8fCBkaWZmMS5uZXdNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTkspIHtcbiAgICBtb2RlQ2hhbmdlRGlmZiA9IGRpZmYxO1xuICAgIGNvbnRlbnRDaGFuZ2VEaWZmID0gZGlmZjI7XG4gIH0gZWxzZSB7XG4gICAgbW9kZUNoYW5nZURpZmYgPSBkaWZmMjtcbiAgICBjb250ZW50Q2hhbmdlRGlmZiA9IGRpZmYxO1xuICB9XG5cbiAgY29uc3QgZmlsZVBhdGggPSBjb250ZW50Q2hhbmdlRGlmZi5vbGRQYXRoIHx8IGNvbnRlbnRDaGFuZ2VEaWZmLm5ld1BhdGg7XG4gIGNvbnN0IHN5bWxpbmsgPSBtb2RlQ2hhbmdlRGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcblxuICBsZXQgc3RhdHVzO1xuICBsZXQgb2xkTW9kZSwgbmV3TW9kZTtcbiAgbGV0IG9sZFN5bWxpbmsgPSBudWxsO1xuICBsZXQgbmV3U3ltbGluayA9IG51bGw7XG4gIGlmIChtb2RlQ2hhbmdlRGlmZi5zdGF0dXMgPT09ICdhZGRlZCcpIHtcbiAgICAvLyBjb250ZW50cyB3ZXJlIGRlbGV0ZWQgYW5kIHJlcGxhY2VkIHdpdGggc3ltbGlua1xuICAgIHN0YXR1cyA9ICdkZWxldGVkJztcbiAgICBvbGRNb2RlID0gY29udGVudENoYW5nZURpZmYub2xkTW9kZTtcbiAgICBuZXdNb2RlID0gbW9kZUNoYW5nZURpZmYubmV3TW9kZTtcbiAgICBuZXdTeW1saW5rID0gc3ltbGluaztcbiAgfSBlbHNlIGlmIChtb2RlQ2hhbmdlRGlmZi5zdGF0dXMgPT09ICdkZWxldGVkJykge1xuICAgIC8vIGNvbnRlbnRzIHdlcmUgYWRkZWQgYWZ0ZXIgc3ltbGluayB3YXMgZGVsZXRlZFxuICAgIHN0YXR1cyA9ICdhZGRlZCc7XG4gICAgb2xkTW9kZSA9IG1vZGVDaGFuZ2VEaWZmLm9sZE1vZGU7XG4gICAgb2xkU3ltbGluayA9IHN5bWxpbms7XG4gICAgbmV3TW9kZSA9IGNvbnRlbnRDaGFuZ2VEaWZmLm5ld01vZGU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIG1vZGUgY2hhbmdlIGRpZmYgc3RhdHVzOiAke21vZGVDaGFuZ2VEaWZmLnN0YXR1c31gKTtcbiAgfVxuXG4gIGNvbnN0IG9sZEZpbGUgPSBuZXcgRmlsZSh7cGF0aDogZmlsZVBhdGgsIG1vZGU6IG9sZE1vZGUsIHN5bWxpbms6IG9sZFN5bWxpbmt9KTtcbiAgY29uc3QgbmV3RmlsZSA9IG5ldyBGaWxlKHtwYXRoOiBmaWxlUGF0aCwgbW9kZTogbmV3TW9kZSwgc3ltbGluazogbmV3U3ltbGlua30pO1xuXG4gIGNvbnN0IHJlbmRlclN0YXR1cyA9IG9wdHMucmVuZGVyU3RhdHVzT3ZlcnJpZGVzW2ZpbGVQYXRoXSB8fFxuICAgIChpc0RpZmZMYXJnZShbY29udGVudENoYW5nZURpZmZdLCBvcHRzKSAmJiBERUZFUlJFRCkgfHxcbiAgICBFWFBBTkRFRDtcblxuICBpZiAoIXJlbmRlclN0YXR1cy5pc1Zpc2libGUoKSkge1xuICAgIGNvbnN0IHBhdGNoTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgcGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIEZpbGVQYXRjaC5jcmVhdGVIaWRkZW5GaWxlUGF0Y2goXG4gICAgICBvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaE1hcmtlciwgcmVuZGVyU3RhdHVzLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBbaHVua3MsIG5leHRQYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGNvbnRlbnRDaGFuZ2VEaWZmLCBzdWJQYXRjaEJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IG5leHRQYXRjaCA9IG5ldyBQYXRjaCh7c3RhdHVzLCBodW5rcywgbWFya2VyOiBuZXh0UGF0Y2hNYXJrZXJ9KTtcblxuICAgICAgICBzdWJQYXRjaEJ1ZmZlci5kZWxldGVMYXN0TmV3bGluZSgpO1xuICAgICAgICByZXR1cm4ge3BhdGNoOiBuZXh0UGF0Y2gsIHBhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlcn07XG4gICAgICB9LFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW2h1bmtzLCBwYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGNvbnRlbnRDaGFuZ2VEaWZmLCBwYXRjaEJ1ZmZlcik7XG4gICAgY29uc3QgcGF0Y2ggPSBuZXcgUGF0Y2goe3N0YXR1cywgaHVua3MsIG1hcmtlcjogcGF0Y2hNYXJrZXJ9KTtcblxuICAgIGNvbnN0IHJhd1BhdGNoZXMgPSBvcHRzLnByZXNlcnZlT3JpZ2luYWwgPyB7Y29udGVudDogY29udGVudENoYW5nZURpZmYsIG1vZGU6IG1vZGVDaGFuZ2VEaWZmfSA6IG51bGw7XG4gICAgcmV0dXJuIG5ldyBGaWxlUGF0Y2gob2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2gsIHJhd1BhdGNoZXMpO1xuICB9XG59XG5cbmNvbnN0IENIQU5HRUtJTkQgPSB7XG4gICcrJzogQWRkaXRpb24sXG4gICctJzogRGVsZXRpb24sXG4gICcgJzogVW5jaGFuZ2VkLFxuICAnXFxcXCc6IE5vTmV3bGluZSxcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkSHVua3MoZGlmZiwgcGF0Y2hCdWZmZXIpIHtcbiAgY29uc3QgaW5zZXJ0ZXIgPSBwYXRjaEJ1ZmZlci5jcmVhdGVJbnNlcnRlckF0RW5kKClcbiAgICAua2VlcEJlZm9yZShwYXRjaEJ1ZmZlci5maW5kQWxsTWFya2Vycyh7ZW5kUG9zaXRpb246IHBhdGNoQnVmZmVyLmdldEluc2VydGlvblBvaW50KCl9KSk7XG5cbiAgbGV0IHBhdGNoTWFya2VyID0gbnVsbDtcbiAgbGV0IGZpcnN0SHVuayA9IHRydWU7XG4gIGNvbnN0IGh1bmtzID0gW107XG5cbiAgaW5zZXJ0ZXIubWFya1doaWxlKFBhdGNoLmxheWVyTmFtZSwgKCkgPT4ge1xuICAgIGZvciAoY29uc3QgcmF3SHVuayBvZiBkaWZmLmh1bmtzKSB7XG4gICAgICBsZXQgZmlyc3RSZWdpb24gPSB0cnVlO1xuICAgICAgY29uc3QgcmVnaW9ucyA9IFtdO1xuXG4gICAgICAvLyBTZXBhcmF0ZSBodW5rcyB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmVcbiAgICAgIGlmIChmaXJzdEh1bmspIHtcbiAgICAgICAgZmlyc3RIdW5rID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnNlcnRlci5pbnNlcnQoJ1xcbicpO1xuICAgICAgfVxuXG4gICAgICBpbnNlcnRlci5tYXJrV2hpbGUoSHVuay5sYXllck5hbWUsICgpID0+IHtcbiAgICAgICAgbGV0IGZpcnN0UmVnaW9uTGluZSA9IHRydWU7XG4gICAgICAgIGxldCBjdXJyZW50UmVnaW9uVGV4dCA9ICcnO1xuICAgICAgICBsZXQgQ3VycmVudFJlZ2lvbktpbmQgPSBudWxsO1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmlzaFJlZ2lvbigpIHtcbiAgICAgICAgICBpZiAoQ3VycmVudFJlZ2lvbktpbmQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTZXBhcmF0ZSByZWdpb25zIHdpdGggYW4gdW5tYXJrZWQgbmV3bGluZVxuICAgICAgICAgIGlmIChmaXJzdFJlZ2lvbikge1xuICAgICAgICAgICAgZmlyc3RSZWdpb24gPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0KCdcXG4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnNlcnRlci5pbnNlcnRNYXJrZWQoY3VycmVudFJlZ2lvblRleHQsIEN1cnJlbnRSZWdpb25LaW5kLmxheWVyTmFtZSwge1xuICAgICAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgICAgICAgIGV4Y2x1c2l2ZTogZmFsc2UsXG4gICAgICAgICAgICBjYWxsYmFjazogKGZ1bmN0aW9uKF9yZWdpb25zLCBfQ3VycmVudFJlZ2lvbktpbmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlZ2lvbk1hcmtlciA9PiB7IF9yZWdpb25zLnB1c2gobmV3IF9DdXJyZW50UmVnaW9uS2luZChyZWdpb25NYXJrZXIpKTsgfTtcbiAgICAgICAgICAgIH0pKHJlZ2lvbnMsIEN1cnJlbnRSZWdpb25LaW5kKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcmF3TGluZSBvZiByYXdIdW5rLmxpbmVzKSB7XG4gICAgICAgICAgY29uc3QgTmV4dFJlZ2lvbktpbmQgPSBDSEFOR0VLSU5EW3Jhd0xpbmVbMF1dO1xuICAgICAgICAgIGlmIChOZXh0UmVnaW9uS2luZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZGlmZiBzdGF0dXMgY2hhcmFjdGVyOiBcIiR7cmF3TGluZVswXX1cImApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuZXh0TGluZSA9IHJhd0xpbmUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBsZXQgc2VwYXJhdG9yID0gJyc7XG4gICAgICAgICAgaWYgKGZpcnN0UmVnaW9uTGluZSkge1xuICAgICAgICAgICAgZmlyc3RSZWdpb25MaW5lID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcGFyYXRvciA9ICdcXG4nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChOZXh0UmVnaW9uS2luZCA9PT0gQ3VycmVudFJlZ2lvbktpbmQpIHtcbiAgICAgICAgICAgIGN1cnJlbnRSZWdpb25UZXh0ICs9IHNlcGFyYXRvciArIG5leHRMaW5lO1xuXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluaXNoUmVnaW9uKCk7XG5cbiAgICAgICAgICAgIEN1cnJlbnRSZWdpb25LaW5kID0gTmV4dFJlZ2lvbktpbmQ7XG4gICAgICAgICAgICBjdXJyZW50UmVnaW9uVGV4dCA9IG5leHRMaW5lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmaW5pc2hSZWdpb24oKTtcbiAgICAgIH0sIHtcbiAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgICAgZXhjbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbihfaHVua3MsIF9yYXdIdW5rLCBfcmVnaW9ucykge1xuICAgICAgICAgIHJldHVybiBodW5rTWFya2VyID0+IHtcbiAgICAgICAgICAgIF9odW5rcy5wdXNoKG5ldyBIdW5rKHtcbiAgICAgICAgICAgICAgb2xkU3RhcnRSb3c6IF9yYXdIdW5rLm9sZFN0YXJ0TGluZSxcbiAgICAgICAgICAgICAgbmV3U3RhcnRSb3c6IF9yYXdIdW5rLm5ld1N0YXJ0TGluZSxcbiAgICAgICAgICAgICAgb2xkUm93Q291bnQ6IF9yYXdIdW5rLm9sZExpbmVDb3VudCxcbiAgICAgICAgICAgICAgbmV3Um93Q291bnQ6IF9yYXdIdW5rLm5ld0xpbmVDb3VudCxcbiAgICAgICAgICAgICAgc2VjdGlvbkhlYWRpbmc6IF9yYXdIdW5rLmhlYWRpbmcsXG4gICAgICAgICAgICAgIG1hcmtlcjogaHVua01hcmtlcixcbiAgICAgICAgICAgICAgcmVnaW9uczogX3JlZ2lvbnMsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkoaHVua3MsIHJhd0h1bmssIHJlZ2lvbnMpLFxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICBleGNsdXNpdmU6IGZhbHNlLFxuICAgIGNhbGxiYWNrOiBtYXJrZXIgPT4geyBwYXRjaE1hcmtlciA9IG1hcmtlcjsgfSxcbiAgfSk7XG5cbiAgLy8gU2VwYXJhdGUgbXVsdGlwbGUgbm9uLWVtcHR5IHBhdGNoZXMgb24gdGhlIHNhbWUgYnVmZmVyIHdpdGggYW4gdW5tYXJrZWQgbmV3bGluZS4gVGhlIG5ld2xpbmUgYWZ0ZXIgdGhlIGZpbmFsXG4gIC8vIG5vbi1lbXB0eSBwYXRjaCAoaWYgdGhlcmUgaXMgb25lKSBzaG91bGQgYmUgZGVsZXRlZCBiZWZvcmUgTXVsdGlGaWxlUGF0Y2ggY29uc3RydWN0aW9uLlxuICBpZiAoZGlmZi5odW5rcy5sZW5ndGggPiAwKSB7XG4gICAgaW5zZXJ0ZXIuaW5zZXJ0KCdcXG4nKTtcbiAgfVxuXG4gIGluc2VydGVyLmFwcGx5KCk7XG5cbiAgcmV0dXJuIFtodW5rcywgcGF0Y2hNYXJrZXJdO1xufVxuXG5mdW5jdGlvbiBpc0RpZmZMYXJnZShkaWZmcywgb3B0cykge1xuICBjb25zdCBzaXplID0gZGlmZnMucmVkdWNlKChkaWZmU2l6ZUNvdW50ZXIsIGRpZmYpID0+IHtcbiAgICByZXR1cm4gZGlmZlNpemVDb3VudGVyICsgZGlmZi5odW5rcy5yZWR1Y2UoKGh1bmtTaXplQ291bnRlciwgaHVuaykgPT4ge1xuICAgICAgcmV0dXJuIGh1bmtTaXplQ291bnRlciArIGh1bmsubGluZXMubGVuZ3RoO1xuICAgIH0sIDApO1xuICB9LCAwKTtcblxuICByZXR1cm4gc2l6ZSA+IG9wdHMubGFyZ2VEaWZmVGhyZXNob2xkO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLFlBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLEtBQUEsR0FBQUMsdUJBQUEsQ0FBQUgsT0FBQTtBQUNBLElBQUFJLE1BQUEsR0FBQUQsdUJBQUEsQ0FBQUgsT0FB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