"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_OPTIONS = void 0;
exports.buildFilePatch = buildFilePatch;
exports.buildMultiFilePatch = buildMultiFilePatch;

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  } // Delete the trailing newline.


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
  } // Populate unpaired diffs that looked like they could be part of a pair, but weren't.


  for (const [unpairedDiff, originalIndex] of byPath.values()) {
    actions[originalIndex] = function (_unpairedDiff) {
      return () => singleDiffFilePatch(_unpairedDiff, patchBuffer, opts);
    }(unpairedDiff);
  }

  const filePatches = actions.map(action => action()); // Delete the final trailing newline from the last non-empty patch.

  patchBuffer.deleteLastNewline(); // Append hidden patches corresponding to each removed file.

  for (const removedPath of opts.removed) {
    const removedFile = new _file.default({
      path: removedPath
    });
    const removedMarker = patchBuffer.markPosition(_patch.default.layerName, patchBuffer.getBuffer().getEndPosition(), {
      invalidate: 'never',
      exclusive: false
    });
    filePatches.push(_filePatch.default.createHiddenFilePatch(removedFile, removedFile, removedMarker, _patch.REMOVED,
    /* istanbul ignore next */
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
      const regions = []; // Separate hunks with an unmarked newline

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
          } // Separate regions with an unmarked newline


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
  }); // Separate multiple non-empty patches on the same buffer with an unmarked newline. The newline after the final
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcGF0Y2gvYnVpbGRlci5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX09QVElPTlMiLCJsYXJnZURpZmZUaHJlc2hvbGQiLCJyZW5kZXJTdGF0dXNPdmVycmlkZXMiLCJwYXRjaEJ1ZmZlciIsInByZXNlcnZlT3JpZ2luYWwiLCJyZW1vdmVkIiwiU2V0IiwiYnVpbGRGaWxlUGF0Y2giLCJkaWZmcyIsIm9wdGlvbnMiLCJvcHRzIiwiUGF0Y2hCdWZmZXIiLCJmaWxlUGF0Y2giLCJsZW5ndGgiLCJlbXB0eURpZmZGaWxlUGF0Y2giLCJzaW5nbGVEaWZmRmlsZVBhdGNoIiwiZHVhbERpZmZGaWxlUGF0Y2giLCJFcnJvciIsImRlbGV0ZUxhc3ROZXdsaW5lIiwiTXVsdGlGaWxlUGF0Y2giLCJmaWxlUGF0Y2hlcyIsImJ1aWxkTXVsdGlGaWxlUGF0Y2giLCJieVBhdGgiLCJNYXAiLCJhY3Rpb25zIiwiaW5kZXgiLCJkaWZmIiwidGhlUGF0aCIsIm9sZFBhdGgiLCJuZXdQYXRoIiwic3RhdHVzIiwib3RoZXJIYWxmIiwiZ2V0Iiwib3RoZXJEaWZmIiwib3RoZXJJbmRleCIsIl9kaWZmIiwiX290aGVyRGlmZiIsImRlbGV0ZSIsInNldCIsInVucGFpcmVkRGlmZiIsIm9yaWdpbmFsSW5kZXgiLCJ2YWx1ZXMiLCJfdW5wYWlyZWREaWZmIiwibWFwIiwiYWN0aW9uIiwicmVtb3ZlZFBhdGgiLCJyZW1vdmVkRmlsZSIsIkZpbGUiLCJwYXRoIiwicmVtb3ZlZE1hcmtlciIsIm1hcmtQb3NpdGlvbiIsIlBhdGNoIiwibGF5ZXJOYW1lIiwiZ2V0QnVmZmVyIiwiZ2V0RW5kUG9zaXRpb24iLCJpbnZhbGlkYXRlIiwiZXhjbHVzaXZlIiwicHVzaCIsIkZpbGVQYXRjaCIsImNyZWF0ZUhpZGRlbkZpbGVQYXRjaCIsIlJFTU9WRUQiLCJjcmVhdGVOdWxsIiwid2FzU3ltbGluayIsIm9sZE1vZGUiLCJtb2RlcyIsIlNZTUxJTksiLCJpc1N5bWxpbmsiLCJuZXdNb2RlIiwib2xkU3ltbGluayIsIm5ld1N5bWxpbmsiLCJodW5rcyIsImxpbmVzIiwic2xpY2UiLCJvbGRGaWxlIiwibW9kZSIsInN5bWxpbmsiLCJudWxsRmlsZSIsIm5ld0ZpbGUiLCJyZW5kZXJTdGF0dXNPdmVycmlkZSIsImlzUHJlc2VudCIsImdldFBhdGgiLCJ1bmRlZmluZWQiLCJyZW5kZXJTdGF0dXMiLCJpc0RpZmZMYXJnZSIsIkRFRkVSUkVEIiwiRVhQQU5ERUQiLCJpc1Zpc2libGUiLCJwYXRjaE1hcmtlciIsInN1YlBhdGNoQnVmZmVyIiwibmV4dFBhdGNoTWFya2VyIiwiYnVpbGRIdW5rcyIsIm5leHRQYXRjaCIsIm1hcmtlciIsInBhdGNoIiwicmF3UGF0Y2hlcyIsImNvbnRlbnQiLCJkaWZmMSIsImRpZmYyIiwibW9kZUNoYW5nZURpZmYiLCJjb250ZW50Q2hhbmdlRGlmZiIsImZpbGVQYXRoIiwiQ0hBTkdFS0lORCIsIkFkZGl0aW9uIiwiRGVsZXRpb24iLCJVbmNoYW5nZWQiLCJOb05ld2xpbmUiLCJpbnNlcnRlciIsImNyZWF0ZUluc2VydGVyQXRFbmQiLCJrZWVwQmVmb3JlIiwiZmluZEFsbE1hcmtlcnMiLCJlbmRQb3NpdGlvbiIsImdldEluc2VydGlvblBvaW50IiwiZmlyc3RIdW5rIiwibWFya1doaWxlIiwicmF3SHVuayIsImZpcnN0UmVnaW9uIiwicmVnaW9ucyIsImluc2VydCIsIkh1bmsiLCJmaXJzdFJlZ2lvbkxpbmUiLCJjdXJyZW50UmVnaW9uVGV4dCIsIkN1cnJlbnRSZWdpb25LaW5kIiwiZmluaXNoUmVnaW9uIiwiaW5zZXJ0TWFya2VkIiwiY2FsbGJhY2siLCJfcmVnaW9ucyIsIl9DdXJyZW50UmVnaW9uS2luZCIsInJlZ2lvbk1hcmtlciIsInJhd0xpbmUiLCJOZXh0UmVnaW9uS2luZCIsIm5leHRMaW5lIiwic2VwYXJhdG9yIiwiX2h1bmtzIiwiX3Jhd0h1bmsiLCJodW5rTWFya2VyIiwib2xkU3RhcnRSb3ciLCJvbGRTdGFydExpbmUiLCJuZXdTdGFydFJvdyIsIm5ld1N0YXJ0TGluZSIsIm9sZFJvd0NvdW50Iiwib2xkTGluZUNvdW50IiwibmV3Um93Q291bnQiLCJuZXdMaW5lQ291bnQiLCJzZWN0aW9uSGVhZGluZyIsImhlYWRpbmciLCJhcHBseSIsInNpemUiLCJyZWR1Y2UiLCJkaWZmU2l6ZUNvdW50ZXIiLCJodW5rU2l6ZUNvdW50ZXIiLCJodW5rIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFTyxNQUFNQSxlQUFlLEdBQUc7QUFDN0I7QUFDQUMsRUFBQUEsa0JBQWtCLEVBQUUsR0FGUztBQUk3QjtBQUNBQyxFQUFBQSxxQkFBcUIsRUFBRSxFQUxNO0FBTzdCO0FBQ0FDLEVBQUFBLFdBQVcsRUFBRSxJQVJnQjtBQVU3QjtBQUNBQyxFQUFBQSxnQkFBZ0IsRUFBRSxLQVhXO0FBYTdCO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRSxJQUFJQyxHQUFKO0FBZG9CLENBQXhCOzs7QUFpQkEsU0FBU0MsY0FBVCxDQUF3QkMsS0FBeEIsRUFBK0JDLE9BQS9CLEVBQXdDO0FBQzdDLFFBQU1DLElBQUkscUJBQU9WLGVBQVAsTUFBMkJTLE9BQTNCLENBQVY7O0FBQ0EsUUFBTU4sV0FBVyxHQUFHLElBQUlRLG9CQUFKLEVBQXBCO0FBRUEsTUFBSUMsU0FBSjs7QUFDQSxNQUFJSixLQUFLLENBQUNLLE1BQU4sS0FBaUIsQ0FBckIsRUFBd0I7QUFDdEJELElBQUFBLFNBQVMsR0FBR0Usa0JBQWtCLEVBQTlCO0FBQ0QsR0FGRCxNQUVPLElBQUlOLEtBQUssQ0FBQ0ssTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUM3QkQsSUFBQUEsU0FBUyxHQUFHRyxtQkFBbUIsQ0FBQ1AsS0FBSyxDQUFDLENBQUQsQ0FBTixFQUFXTCxXQUFYLEVBQXdCTyxJQUF4QixDQUEvQjtBQUNELEdBRk0sTUFFQSxJQUFJRixLQUFLLENBQUNLLE1BQU4sS0FBaUIsQ0FBckIsRUFBd0I7QUFD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RUFBa0IxSCxJQUFsQixLQUEyQjtBQUNuRCxXQUFPMEgsZUFBZSxHQUFHMUgsSUFBSSxDQUFDNEMsS0FBTCxDQUFXNkUsTUFBWCxDQUFrQixDQUFDRSxlQUFELEVBQWtCQyxJQUFsQixLQUEyQjtBQUNwRSxhQUFPRCxlQUFlLEdBQUdDLElBQUksQ0FBQy9FLEtBQUwsQ0FBVzFELE1BQXBDO0FBQ0QsS0FGd0IsRUFFdEIsQ0FGc0IsQ0FBekI7QUFHRCxHQUpZLEVBSVYsQ0FKVSxDQUFiO0FBTUEsU0FBT3FJLElBQUksR0FBR3hJLElBQUksQ0FBQ1Qsa0JBQW5CO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGF0Y2hCdWZmZXIgZnJvbSAnLi9wYXRjaC1idWZmZXInO1xuaW1wb3J0IEh1bmsgZnJvbSAnLi9odW5rJztcbmltcG9ydCBGaWxlLCB7bnVsbEZpbGV9IGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgUGF0Y2gsIHtERUZFUlJFRCwgRVhQQU5ERUQsIFJFTU9WRUR9IGZyb20gJy4vcGF0Y2gnO1xuaW1wb3J0IHtVbmNoYW5nZWQsIEFkZGl0aW9uLCBEZWxldGlvbiwgTm9OZXdsaW5lfSBmcm9tICcuL3JlZ2lvbic7XG5pbXBvcnQgRmlsZVBhdGNoIGZyb20gJy4vZmlsZS1wYXRjaCc7XG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2ggZnJvbSAnLi9tdWx0aS1maWxlLXBhdGNoJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgLy8gTnVtYmVyIG9mIGxpbmVzIGFmdGVyIHdoaWNoIHdlIGNvbnNpZGVyIHRoZSBkaWZmIFwibGFyZ2VcIlxuICBsYXJnZURpZmZUaHJlc2hvbGQ6IDgwMCxcblxuICAvLyBNYXAgb2YgZmlsZSBwYXRoIChyZWxhdGl2ZSB0byByZXBvc2l0b3J5IHJvb3QpIHRvIFBhdGNoIHJlbmRlciBzdGF0dXMgKEVYUEFOREVELCBDT0xMQVBTRUQsIERFRkVSUkVEKVxuICByZW5kZXJTdGF0dXNPdmVycmlkZXM6IHt9LFxuXG4gIC8vIEV4aXN0aW5nIHBhdGNoIGJ1ZmZlciB0byByZW5kZXIgb250b1xuICBwYXRjaEJ1ZmZlcjogbnVsbCxcblxuICAvLyBTdG9yZSBvZmYgd2hhdC10aGUtZGlmZiBmaWxlIHBhdGNoXG4gIHByZXNlcnZlT3JpZ2luYWw6IGZhbHNlLFxuXG4gIC8vIFBhdGhzIG9mIGZpbGUgcGF0Y2hlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhdGNoIGJlZm9yZSBwYXJzaW5nXG4gIHJlbW92ZWQ6IG5ldyBTZXQoKSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZpbGVQYXRjaChkaWZmcywgb3B0aW9ucykge1xuICBjb25zdCBvcHRzID0gey4uLkRFRkFVTFRfT1BUSU9OUywgLi4ub3B0aW9uc307XG4gIGNvbnN0IHBhdGNoQnVmZmVyID0gbmV3IFBhdGNoQnVmZmVyKCk7XG5cbiAgbGV0IGZpbGVQYXRjaDtcbiAgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZpbGVQYXRjaCA9IGVtcHR5RGlmZkZpbGVQYXRjaCgpO1xuICB9IGVsc2UgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMSkge1xuICAgIGZpbGVQYXRjaCA9IHNpbmdsZURpZmZGaWxlUGF0Y2goZGlmZnNbMF0sIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgfSBlbHNlIGlmIChkaWZmcy5sZW5ndGggPT09IDIpIHtcbiAgICBmaWxlUGF0Y2ggPSBkdWFsRGlmZkZpbGVQYXRjaChkaWZmc1swXSwgZGlmZnNbMV0sIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbnVtYmVyIG9mIGRpZmZzOiAke2RpZmZzLmxlbmd0aH1gKTtcbiAgfVxuXG4gIC8vIERlbGV0ZSB0aGUgdHJhaWxpbmcgbmV3bGluZS5cbiAgcGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcblxuICByZXR1cm4gbmV3IE11bHRpRmlsZVBhdGNoKHtwYXRjaEJ1ZmZlciwgZmlsZVBhdGNoZXM6IFtmaWxlUGF0Y2hdfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE11bHRpRmlsZVBhdGNoKGRpZmZzLCBvcHRpb25zKSB7XG4gIGNvbnN0IG9wdHMgPSB7Li4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zfTtcblxuICBjb25zdCBwYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuXG4gIGNvbnN0IGJ5UGF0aCA9IG5ldyBNYXAoKTtcbiAgY29uc3QgYWN0aW9ucyA9IFtdO1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAoY29uc3QgZGlmZiBvZiBkaWZmcykge1xuICAgIGNvbnN0IHRoZVBhdGggPSBkaWZmLm9sZFBhdGggfHwgZGlmZi5uZXdQYXRoO1xuXG4gICAgaWYgKGRpZmYuc3RhdHVzID09PSAnYWRkZWQnIHx8IGRpZmYuc3RhdHVzID09PSAnZGVsZXRlZCcpIHtcbiAgICAgIC8vIFBvdGVudGlhbCBwYWlyZWQgZGlmZi4gRWl0aGVyIGEgc3ltbGluayBkZWxldGlvbiArIGNvbnRlbnQgYWRkaXRpb24gb3IgYSBzeW1saW5rIGFkZGl0aW9uICtcbiAgICAgIC8vIGNvbnRlbnQgZGVsZXRpb24uXG4gICAgICBjb25zdCBvdGhlckhhbGYgPSBieVBhdGguZ2V0KHRoZVBhdGgpO1xuICAgICAgaWYgKG90aGVySGFsZikge1xuICAgICAgICAvLyBUaGUgc2Vjb25kIGhhbGYuIENvbXBsZXRlIHRoZSBwYWlyZWQgZGlmZiwgb3IgZmFpbCBpZiB0aGV5IGhhdmUgdW5leHBlY3RlZCBzdGF0dXNlcyBvciBtb2Rlcy5cbiAgICAgICAgY29uc3QgW290aGVyRGlmZiwgb3RoZXJJbmRleF0gPSBvdGhlckhhbGY7XG4gICAgICAgIGFjdGlvbnNbb3RoZXJJbmRleF0gPSAoZnVuY3Rpb24oX2RpZmYsIF9vdGhlckRpZmYpIHtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gZHVhbERpZmZGaWxlUGF0Y2goX2RpZmYsIF9vdGhlckRpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICAgICAgfSkoZGlmZiwgb3RoZXJEaWZmKTtcbiAgICAgICAgYnlQYXRoLmRlbGV0ZSh0aGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBoYWxmIHdlJ3ZlIHNlZW4uXG4gICAgICAgIGJ5UGF0aC5zZXQodGhlUGF0aCwgW2RpZmYsIGluZGV4XSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnNbaW5kZXhdID0gKGZ1bmN0aW9uKF9kaWZmKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiBzaW5nbGVEaWZmRmlsZVBhdGNoKF9kaWZmLCBwYXRjaEJ1ZmZlciwgb3B0cyk7XG4gICAgICB9KShkaWZmKTtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgLy8gUG9wdWxhdGUgdW5wYWlyZWQgZGlmZnMgdGhhdCBsb29rZWQgbGlrZSB0aGV5IGNvdWxkIGJlIHBhcnQgb2YgYSBwYWlyLCBidXQgd2VyZW4ndC5cbiAgZm9yIChjb25zdCBbdW5wYWlyZWREaWZmLCBvcmlnaW5hbEluZGV4XSBvZiBieVBhdGgudmFsdWVzKCkpIHtcbiAgICBhY3Rpb25zW29yaWdpbmFsSW5kZXhdID0gKGZ1bmN0aW9uKF91bnBhaXJlZERpZmYpIHtcbiAgICAgIHJldHVybiAoKSA9PiBzaW5nbGVEaWZmRmlsZVBhdGNoKF91bnBhaXJlZERpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKTtcbiAgICB9KSh1bnBhaXJlZERpZmYpO1xuICB9XG5cbiAgY29uc3QgZmlsZVBhdGNoZXMgPSBhY3Rpb25zLm1hcChhY3Rpb24gPT4gYWN0aW9uKCkpO1xuXG4gIC8vIERlbGV0ZSB0aGUgZmluYWwgdHJhaWxpbmcgbmV3bGluZSBmcm9tIHRoZSBsYXN0IG5vbi1lbXB0eSBwYXRjaC5cbiAgcGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcblxuICAvLyBBcHBlbmQgaGlkZGVuIHBhdGNoZXMgY29ycmVzcG9uZGluZyB0byBlYWNoIHJlbW92ZWQgZmlsZS5cbiAgZm9yIChjb25zdCByZW1vdmVkUGF0aCBvZiBvcHRzLnJlbW92ZWQpIHtcbiAgICBjb25zdCByZW1vdmVkRmlsZSA9IG5ldyBGaWxlKHtwYXRoOiByZW1vdmVkUGF0aH0pO1xuICAgIGNvbnN0IHJlbW92ZWRNYXJrZXIgPSBwYXRjaEJ1ZmZlci5tYXJrUG9zaXRpb24oXG4gICAgICBQYXRjaC5sYXllck5hbWUsXG4gICAgICBwYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5nZXRFbmRQb3NpdGlvbigpLFxuICAgICAge2ludmFsaWRhdGU6ICduZXZlcicsIGV4Y2x1c2l2ZTogZmFsc2V9LFxuICAgICk7XG4gICAgZmlsZVBhdGNoZXMucHVzaChGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgcmVtb3ZlZEZpbGUsXG4gICAgICByZW1vdmVkRmlsZSxcbiAgICAgIHJlbW92ZWRNYXJrZXIsXG4gICAgICBSRU1PVkVELFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICgpID0+IHsgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0IHRvIGV4cGFuZCByZW1vdmVkIGZpbGUgcGF0Y2ggJHtyZW1vdmVkUGF0aH1gKTsgfSxcbiAgICApKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgTXVsdGlGaWxlUGF0Y2goe3BhdGNoQnVmZmVyLCBmaWxlUGF0Y2hlc30pO1xufVxuXG5mdW5jdGlvbiBlbXB0eURpZmZGaWxlUGF0Y2goKSB7XG4gIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlTnVsbCgpO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVEaWZmRmlsZVBhdGNoKGRpZmYsIHBhdGNoQnVmZmVyLCBvcHRzKSB7XG4gIGNvbnN0IHdhc1N5bWxpbmsgPSBkaWZmLm9sZE1vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSztcbiAgY29uc3QgaXNTeW1saW5rID0gZGlmZi5uZXdNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTks7XG5cbiAgbGV0IG9sZFN5bWxpbmsgPSBudWxsO1xuICBsZXQgbmV3U3ltbGluayA9IG51bGw7XG4gIGlmICh3YXNTeW1saW5rICYmICFpc1N5bWxpbmspIHtcbiAgICBvbGRTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgfSBlbHNlIGlmICghd2FzU3ltbGluayAmJiBpc1N5bWxpbmspIHtcbiAgICBuZXdTeW1saW5rID0gZGlmZi5odW5rc1swXS5saW5lc1swXS5zbGljZSgxKTtcbiAgfSBlbHNlIGlmICh3YXNTeW1saW5rICYmIGlzU3ltbGluaykge1xuICAgIG9sZFN5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzBdLnNsaWNlKDEpO1xuICAgIG5ld1N5bWxpbmsgPSBkaWZmLmh1bmtzWzBdLmxpbmVzWzJdLnNsaWNlKDEpO1xuICB9XG5cbiAgY29uc3Qgb2xkRmlsZSA9IGRpZmYub2xkUGF0aCAhPT0gbnVsbCB8fCBkaWZmLm9sZE1vZGUgIT09IG51bGxcbiAgICA/IG5ldyBGaWxlKHtwYXRoOiBkaWZmLm9sZFBhdGgsIG1vZGU6IGRpZmYub2xkTW9kZSwgc3ltbGluazogb2xkU3ltbGlua30pXG4gICAgOiBudWxsRmlsZTtcbiAgY29uc3QgbmV3RmlsZSA9IGRpZmYubmV3UGF0aCAhPT0gbnVsbCB8fCBkaWZmLm5ld01vZGUgIT09IG51bGxcbiAgICA/IG5ldyBGaWxlKHtwYXRoOiBkaWZmLm5ld1BhdGgsIG1vZGU6IGRpZmYubmV3TW9kZSwgc3ltbGluazogbmV3U3ltbGlua30pXG4gICAgOiBudWxsRmlsZTtcblxuICBjb25zdCByZW5kZXJTdGF0dXNPdmVycmlkZSA9XG4gICAgKG9sZEZpbGUuaXNQcmVzZW50KCkgJiYgb3B0cy5yZW5kZXJTdGF0dXNPdmVycmlkZXNbb2xkRmlsZS5nZXRQYXRoKCldKSB8fFxuICAgIChuZXdGaWxlLmlzUHJlc2VudCgpICYmIG9wdHMucmVuZGVyU3RhdHVzT3ZlcnJpZGVzW25ld0ZpbGUuZ2V0UGF0aCgpXSkgfHxcbiAgICB1bmRlZmluZWQ7XG5cbiAgY29uc3QgcmVuZGVyU3RhdHVzID0gcmVuZGVyU3RhdHVzT3ZlcnJpZGUgfHxcbiAgICAoaXNEaWZmTGFyZ2UoW2RpZmZdLCBvcHRzKSAmJiBERUZFUlJFRCkgfHxcbiAgICBFWFBBTkRFRDtcblxuICBpZiAoIXJlbmRlclN0YXR1cy5pc1Zpc2libGUoKSkge1xuICAgIGNvbnN0IHBhdGNoTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgcGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSxcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IGZhbHNlfSxcbiAgICApO1xuXG4gICAgcmV0dXJuIEZpbGVQYXRjaC5jcmVhdGVIaWRkZW5GaWxlUGF0Y2goXG4gICAgICBvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaE1hcmtlciwgcmVuZGVyU3RhdHVzLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJQYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBbaHVua3MsIG5leHRQYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGRpZmYsIHN1YlBhdGNoQnVmZmVyKTtcbiAgICAgICAgY29uc3QgbmV4dFBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXM6IGRpZmYuc3RhdHVzLCBodW5rcywgbWFya2VyOiBuZXh0UGF0Y2hNYXJrZXJ9KTtcblxuICAgICAgICBzdWJQYXRjaEJ1ZmZlci5kZWxldGVMYXN0TmV3bGluZSgpO1xuICAgICAgICByZXR1cm4ge3BhdGNoOiBuZXh0UGF0Y2gsIHBhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlcn07XG4gICAgICB9LFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW2h1bmtzLCBwYXRjaE1hcmtlcl0gPSBidWlsZEh1bmtzKGRpZmYsIHBhdGNoQnVmZmVyKTtcbiAgICBjb25zdCBwYXRjaCA9IG5ldyBQYXRjaCh7c3RhdHVzOiBkaWZmLnN0YXR1cywgaHVua3MsIG1hcmtlcjogcGF0Y2hNYXJrZXJ9KTtcblxuICAgIGNvbnN0IHJhd1BhdGNoZXMgPSBvcHRzLnByZXNlcnZlT3JpZ2luYWwgPyB7Y29udGVudDogZGlmZn0gOiBudWxsO1xuICAgIHJldHVybiBuZXcgRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkdWFsRGlmZkZpbGVQYXRjaChkaWZmMSwgZGlmZjIsIHBhdGNoQnVmZmVyLCBvcHRzKSB7XG4gIGxldCBtb2RlQ2hhbmdlRGlmZiwgY29udGVudENoYW5nZURpZmY7XG4gIGlmIChkaWZmMS5vbGRNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTksgfHwgZGlmZjEubmV3TW9kZSA9PT0gRmlsZS5tb2Rlcy5TWU1MSU5LKSB7XG4gICAgbW9kZUNoYW5nZURpZmYgPSBkaWZmMTtcbiAgICBjb250ZW50Q2hhbmdlRGlmZiA9IGRpZmYyO1xuICB9IGVsc2Uge1xuICAgIG1vZGVDaGFuZ2VEaWZmID0gZGlmZjI7XG4gICAgY29udGVudENoYW5nZURpZmYgPSBkaWZmMTtcbiAgfVxuXG4gIGNvbnN0IGZpbGVQYXRoID0gY29udGVudENoYW5nZURpZmYub2xkUGF0aCB8fCBjb250ZW50Q2hhbmdlRGlmZi5uZXdQYXRoO1xuICBjb25zdCBzeW1saW5rID0gbW9kZUNoYW5nZURpZmYuaHVua3NbMF0ubGluZXNbMF0uc2xpY2UoMSk7XG5cbiAgbGV0IHN0YXR1cztcbiAgbGV0IG9sZE1vZGUsIG5ld01vZGU7XG4gIGxldCBvbGRTeW1saW5rID0gbnVsbDtcbiAgbGV0IG5ld1N5bWxpbmsgPSBudWxsO1xuICBpZiAobW9kZUNoYW5nZURpZmYuc3RhdHVzID09PSAnYWRkZWQnKSB7XG4gICAgLy8gY29udGVudHMgd2VyZSBkZWxldGVkIGFuZCByZXBsYWNlZCB3aXRoIHN5bWxpbmtcbiAgICBzdGF0dXMgPSAnZGVsZXRlZCc7XG4gICAgb2xkTW9kZSA9IGNvbnRlbnRDaGFuZ2VEaWZmLm9sZE1vZGU7XG4gICAgbmV3TW9kZSA9IG1vZGVDaGFuZ2VEaWZmLm5ld01vZGU7XG4gICAgbmV3U3ltbGluayA9IHN5bWxpbms7XG4gIH0gZWxzZSBpZiAobW9kZUNoYW5nZURpZmYuc3RhdHVzID09PSAnZGVsZXRlZCcpIHtcbiAgICAvLyBjb250ZW50cyB3ZXJlIGFkZGVkIGFmdGVyIHN5bWxpbmsgd2FzIGRlbGV0ZWRcbiAgICBzdGF0dXMgPSAnYWRkZWQnO1xuICAgIG9sZE1vZGUgPSBtb2RlQ2hhbmdlRGlmZi5vbGRNb2RlO1xuICAgIG9sZFN5bWxpbmsgPSBzeW1saW5rO1xuICAgIG5ld01vZGUgPSBjb250ZW50Q2hhbmdlRGlmZi5uZXdNb2RlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb2RlIGNoYW5nZSBkaWZmIHN0YXR1czogJHttb2RlQ2hhbmdlRGlmZi5zdGF0dXN9YCk7XG4gIH1cblxuICBjb25zdCBvbGRGaWxlID0gbmV3IEZpbGUoe3BhdGg6IGZpbGVQYXRoLCBtb2RlOiBvbGRNb2RlLCBzeW1saW5rOiBvbGRTeW1saW5rfSk7XG4gIGNvbnN0IG5ld0ZpbGUgPSBuZXcgRmlsZSh7cGF0aDogZmlsZVBhdGgsIG1vZGU6IG5ld01vZGUsIHN5bWxpbms6IG5ld1N5bWxpbmt9KTtcblxuICBjb25zdCByZW5kZXJTdGF0dXMgPSBvcHRzLnJlbmRlclN0YXR1c092ZXJyaWRlc1tmaWxlUGF0aF0gfHxcbiAgICAoaXNEaWZmTGFyZ2UoW2NvbnRlbnRDaGFuZ2VEaWZmXSwgb3B0cykgJiYgREVGRVJSRUQpIHx8XG4gICAgRVhQQU5ERUQ7XG5cbiAgaWYgKCFyZW5kZXJTdGF0dXMuaXNWaXNpYmxlKCkpIHtcbiAgICBjb25zdCBwYXRjaE1hcmtlciA9IHBhdGNoQnVmZmVyLm1hcmtQb3NpdGlvbihcbiAgICAgIFBhdGNoLmxheWVyTmFtZSxcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCksXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiBmYWxzZX0sXG4gICAgKTtcblxuICAgIHJldHVybiBGaWxlUGF0Y2guY3JlYXRlSGlkZGVuRmlsZVBhdGNoKFxuICAgICAgb2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2hNYXJrZXIsIHJlbmRlclN0YXR1cyxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViUGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcbiAgICAgICAgY29uc3QgW2h1bmtzLCBuZXh0UGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhjb250ZW50Q2hhbmdlRGlmZiwgc3ViUGF0Y2hCdWZmZXIpO1xuICAgICAgICBjb25zdCBuZXh0UGF0Y2ggPSBuZXcgUGF0Y2goe3N0YXR1cywgaHVua3MsIG1hcmtlcjogbmV4dFBhdGNoTWFya2VyfSk7XG5cbiAgICAgICAgc3ViUGF0Y2hCdWZmZXIuZGVsZXRlTGFzdE5ld2xpbmUoKTtcbiAgICAgICAgcmV0dXJuIHtwYXRjaDogbmV4dFBhdGNoLCBwYXRjaEJ1ZmZlcjogc3ViUGF0Y2hCdWZmZXJ9O1xuICAgICAgfSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFtodW5rcywgcGF0Y2hNYXJrZXJdID0gYnVpbGRIdW5rcyhjb250ZW50Q2hhbmdlRGlmZiwgcGF0Y2hCdWZmZXIpO1xuICAgIGNvbnN0IHBhdGNoID0gbmV3IFBhdGNoKHtzdGF0dXMsIGh1bmtzLCBtYXJrZXI6IHBhdGNoTWFya2VyfSk7XG5cbiAgICBjb25zdCByYXdQYXRjaGVzID0gb3B0cy5wcmVzZXJ2ZU9yaWdpbmFsID8ge2NvbnRlbnQ6IGNvbnRlbnRDaGFuZ2VEaWZmLCBtb2RlOiBtb2RlQ2hhbmdlRGlmZn0gOiBudWxsO1xuICAgIHJldHVybiBuZXcgRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKTtcbiAgfVxufVxuXG5jb25zdCBDSEFOR0VLSU5EID0ge1xuICAnKyc6IEFkZGl0aW9uLFxuICAnLSc6IERlbGV0aW9uLFxuICAnICc6IFVuY2hhbmdlZCxcbiAgJ1xcXFwnOiBOb05ld2xpbmUsXG59O1xuXG5mdW5jdGlvbiBidWlsZEh1bmtzKGRpZmYsIHBhdGNoQnVmZmVyKSB7XG4gIGNvbnN0IGluc2VydGVyID0gcGF0Y2hCdWZmZXIuY3JlYXRlSW5zZXJ0ZXJBdEVuZCgpXG4gICAgLmtlZXBCZWZvcmUocGF0Y2hCdWZmZXIuZmluZEFsbE1hcmtlcnMoe2VuZFBvc2l0aW9uOiBwYXRjaEJ1ZmZlci5nZXRJbnNlcnRpb25Qb2ludCgpfSkpO1xuXG4gIGxldCBwYXRjaE1hcmtlciA9IG51bGw7XG4gIGxldCBmaXJzdEh1bmsgPSB0cnVlO1xuICBjb25zdCBodW5rcyA9IFtdO1xuXG4gIGluc2VydGVyLm1hcmtXaGlsZShQYXRjaC5sYXllck5hbWUsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHJhd0h1bmsgb2YgZGlmZi5odW5rcykge1xuICAgICAgbGV0IGZpcnN0UmVnaW9uID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHJlZ2lvbnMgPSBbXTtcblxuICAgICAgLy8gU2VwYXJhdGUgaHVua3Mgd2l0aCBhbiB1bm1hcmtlZCBuZXdsaW5lXG4gICAgICBpZiAoZmlyc3RIdW5rKSB7XG4gICAgICAgIGZpcnN0SHVuayA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0KCdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zZXJ0ZXIubWFya1doaWxlKEh1bmsubGF5ZXJOYW1lLCAoKSA9PiB7XG4gICAgICAgIGxldCBmaXJzdFJlZ2lvbkxpbmUgPSB0cnVlO1xuICAgICAgICBsZXQgY3VycmVudFJlZ2lvblRleHQgPSAnJztcbiAgICAgICAgbGV0IEN1cnJlbnRSZWdpb25LaW5kID0gbnVsbDtcblxuICAgICAgICBmdW5jdGlvbiBmaW5pc2hSZWdpb24oKSB7XG4gICAgICAgICAgaWYgKEN1cnJlbnRSZWdpb25LaW5kID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2VwYXJhdGUgcmVnaW9ucyB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmVcbiAgICAgICAgICBpZiAoZmlyc3RSZWdpb24pIHtcbiAgICAgICAgICAgIGZpcnN0UmVnaW9uID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5zZXJ0ZXIuaW5zZXJ0TWFya2VkKGN1cnJlbnRSZWdpb25UZXh0LCBDdXJyZW50UmVnaW9uS2luZC5sYXllck5hbWUsIHtcbiAgICAgICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgICAgICBleGNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbihfcmVnaW9ucywgX0N1cnJlbnRSZWdpb25LaW5kKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWdpb25NYXJrZXIgPT4geyBfcmVnaW9ucy5wdXNoKG5ldyBfQ3VycmVudFJlZ2lvbktpbmQocmVnaW9uTWFya2VyKSk7IH07XG4gICAgICAgICAgICB9KShyZWdpb25zLCBDdXJyZW50UmVnaW9uS2luZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHJhd0xpbmUgb2YgcmF3SHVuay5saW5lcykge1xuICAgICAgICAgIGNvbnN0IE5leHRSZWdpb25LaW5kID0gQ0hBTkdFS0lORFtyYXdMaW5lWzBdXTtcbiAgICAgICAgICBpZiAoTmV4dFJlZ2lvbktpbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRpZmYgc3RhdHVzIGNoYXJhY3RlcjogXCIke3Jhd0xpbmVbMF19XCJgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV4dExpbmUgPSByYXdMaW5lLnNsaWNlKDEpO1xuXG4gICAgICAgICAgbGV0IHNlcGFyYXRvciA9ICcnO1xuICAgICAgICAgIGlmIChmaXJzdFJlZ2lvbkxpbmUpIHtcbiAgICAgICAgICAgIGZpcnN0UmVnaW9uTGluZSA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXBhcmF0b3IgPSAnXFxuJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTmV4dFJlZ2lvbktpbmQgPT09IEN1cnJlbnRSZWdpb25LaW5kKSB7XG4gICAgICAgICAgICBjdXJyZW50UmVnaW9uVGV4dCArPSBzZXBhcmF0b3IgKyBuZXh0TGluZTtcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmlzaFJlZ2lvbigpO1xuXG4gICAgICAgICAgICBDdXJyZW50UmVnaW9uS2luZCA9IE5leHRSZWdpb25LaW5kO1xuICAgICAgICAgICAgY3VycmVudFJlZ2lvblRleHQgPSBuZXh0TGluZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluaXNoUmVnaW9uKCk7XG4gICAgICB9LCB7XG4gICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgIGV4Y2x1c2l2ZTogZmFsc2UsXG4gICAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24oX2h1bmtzLCBfcmF3SHVuaywgX3JlZ2lvbnMpIHtcbiAgICAgICAgICByZXR1cm4gaHVua01hcmtlciA9PiB7XG4gICAgICAgICAgICBfaHVua3MucHVzaChuZXcgSHVuayh7XG4gICAgICAgICAgICAgIG9sZFN0YXJ0Um93OiBfcmF3SHVuay5vbGRTdGFydExpbmUsXG4gICAgICAgICAgICAgIG5ld1N0YXJ0Um93OiBfcmF3SHVuay5uZXdTdGFydExpbmUsXG4gICAgICAgICAgICAgIG9sZFJvd0NvdW50OiBfcmF3SHVuay5vbGRMaW5lQ291bnQsXG4gICAgICAgICAgICAgIG5ld1Jvd0NvdW50OiBfcmF3SHVuay5uZXdMaW5lQ291bnQsXG4gICAgICAgICAgICAgIHNlY3Rpb25IZWFkaW5nOiBfcmF3SHVuay5oZWFkaW5nLFxuICAgICAgICAgICAgICBtYXJrZXI6IGh1bmtNYXJrZXIsXG4gICAgICAgICAgICAgIHJlZ2lvbnM6IF9yZWdpb25zLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKGh1bmtzLCByYXdIdW5rLCByZWdpb25zKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgZXhjbHVzaXZlOiBmYWxzZSxcbiAgICBjYWxsYmFjazogbWFya2VyID0+IHsgcGF0Y2hNYXJrZXIgPSBtYXJrZXI7IH0sXG4gIH0pO1xuXG4gIC8vIFNlcGFyYXRlIG11bHRpcGxlIG5vbi1lbXB0eSBwYXRjaGVzIG9uIHRoZSBzYW1lIGJ1ZmZlciB3aXRoIGFuIHVubWFya2VkIG5ld2xpbmUuIFRoZSBuZXdsaW5lIGFmdGVyIHRoZSBmaW5hbFxuICAvLyBub24tZW1wdHkgcGF0Y2ggKGlmIHRoZXJlIGlzIG9uZSkgc2hvdWxkIGJlIGRlbGV0ZWQgYmVmb3JlIE11bHRpRmlsZVBhdGNoIGNvbnN0cnVjdGlvbi5cbiAgaWYgKGRpZmYuaHVua3MubGVuZ3RoID4gMCkge1xuICAgIGluc2VydGVyLmluc2VydCgnXFxuJyk7XG4gIH1cblxuICBpbnNlcnRlci5hcHBseSgpO1xuXG4gIHJldHVybiBbaHVua3MsIHBhdGNoTWFya2VyXTtcbn1cblxuZnVuY3Rpb24gaXNEaWZmTGFyZ2UoZGlmZnMsIG9wdHMpIHtcbiAgY29uc3Qgc2l6ZSA9IGRpZmZzLnJlZHVjZSgoZGlmZlNpemVDb3VudGVyLCBkaWZmKSA9PiB7XG4gICAgcmV0dXJuIGRpZmZTaXplQ291bnRlciArIGRpZmYuaHVua3MucmVkdWNlKChodW5rU2l6ZUNvdW50ZXIsIGh1bmspID0+IHtcbiAgICAgIHJldHVybiBodW5rU2l6ZUNvdW50ZXIgKyBodW5rLmxpbmVzLmxlbmd0aDtcbiAgICB9LCAwKTtcbiAgfSwgMCk7XG5cbiAgcmV0dXJuIHNpemUgPiBvcHRzLmxhcmdlRGlmZlRocmVzaG9sZDtcbn1cbiJdfQ==