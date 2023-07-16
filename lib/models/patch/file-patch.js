"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventKit = require("event-kit");
var _file = require("./file");
var _patch = _interopRequireWildcard(require("./patch"));
var _helpers = require("../../helpers");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class FilePatch {
  static createNull() {
    return new this(_file.nullFile, _file.nullFile, _patch.default.createNull());
  }
  static createHiddenFilePatch(oldFile, newFile, marker, renderStatus, showFn) {
    return new this(oldFile, newFile, _patch.default.createHiddenPatch(marker, renderStatus, showFn));
  }
  constructor(oldFile, newFile, patch, rawPatches) {
    this.oldFile = oldFile;
    this.newFile = newFile;
    this.patch = patch;
    this.rawPatches = rawPatches;
    this.emitter = new _eventKit.Emitter();
  }
  isPresent() {
    return this.oldFile.isPresent() || this.newFile.isPresent() || this.patch.isPresent();
  }
  getRenderStatus() {
    return this.patch.getRenderStatus();
  }
  getOldFile() {
    return this.oldFile;
  }
  getNewFile() {
    return this.newFile;
  }
  getRawContentPatch() {
    if (!this.rawPatches) {
      throw new Error('FilePatch was not parsed with {perserveOriginal: true}');
    }
    return this.rawPatches.content;
  }
  getPatch() {
    return this.patch;
  }
  getMarker() {
    return this.getPatch().getMarker();
  }
  getStartRange() {
    return this.getPatch().getStartRange();
  }
  getOldPath() {
    return this.getOldFile().getPath();
  }
  getNewPath() {
    return this.getNewFile().getPath();
  }
  getOldMode() {
    return this.getOldFile().getMode();
  }
  getNewMode() {
    return this.getNewFile().getMode();
  }
  getOldSymlink() {
    return this.getOldFile().getSymlink();
  }
  getNewSymlink() {
    return this.getNewFile().getSymlink();
  }
  getFirstChangeRange() {
    return this.getPatch().getFirstChangeRange();
  }
  getMaxLineNumberWidth() {
    return this.getPatch().getMaxLineNumberWidth();
  }
  containsRow(row) {
    return this.getPatch().containsRow(row);
  }
  didChangeExecutableMode() {
    if (!this.oldFile.isPresent() || !this.newFile.isPresent()) {
      return false;
    }
    return this.oldFile.isExecutable() && !this.newFile.isExecutable() || !this.oldFile.isExecutable() && this.newFile.isExecutable();
  }
  hasSymlink() {
    return Boolean(this.getOldFile().getSymlink() || this.getNewFile().getSymlink());
  }
  hasTypechange() {
    if (!this.oldFile.isPresent() || !this.newFile.isPresent()) {
      return false;
    }
    return this.oldFile.isSymlink() && !this.newFile.isSymlink() || !this.oldFile.isSymlink() && this.newFile.isSymlink();
  }
  getPath() {
    return this.getOldPath() || this.getNewPath();
  }
  getStatus() {
    return this.getPatch().getStatus();
  }
  getHunks() {
    return this.getPatch().getHunks();
  }
  updateMarkers(map) {
    return this.patch.updateMarkers(map);
  }
  triggerCollapseIn(patchBuffer, {
    before,
    after
  }) {
    if (!this.patch.getRenderStatus().isVisible()) {
      return false;
    }
    const oldPatch = this.patch;
    const oldRange = oldPatch.getRange().copy();
    const insertionPosition = oldRange.start;
    const exclude = new Set([...before, ...after]);
    const {
      patchBuffer: subPatchBuffer,
      markerMap
    } = patchBuffer.extractPatchBuffer(oldRange, {
      exclude
    });
    oldPatch.destroyMarkers();
    oldPatch.updateMarkers(markerMap);

    // Delete the separating newline after the collapsing patch, if any.
    if (!oldRange.isEmpty()) {
      patchBuffer.getBuffer().deleteRow(insertionPosition.row);
    }
    const patchMarker = patchBuffer.markPosition(_patch.default.layerName, insertionPosition, {
      invalidate: 'never',
      exclusive: true
    });
    this.patch = _patch.default.createHiddenPatch(patchMarker, _patch.COLLAPSED, () => {
      return {
        patch: oldPatch,
        patchBuffer: subPatchBuffer
      };
    });
    this.didChangeRenderStatus();
    return true;
  }
  triggerExpandIn(patchBuffer, {
    before,
    after
  }) {
    if (this.patch.getRenderStatus().isVisible()) {
      return false;
    }
    const {
      patch: nextPatch,
      patchBuffer: subPatchBuffer
    } = this.patch.show();
    const atStart = this.patch.getInsertionPoint().isEqual([0, 0]);
    const atEnd = this.patch.getInsertionPoint().isEqual(patchBuffer.getBuffer().getEndPosition());
    const willHaveContent = !subPatchBuffer.getBuffer().isEmpty();

    // The expanding patch's insertion point is just after the unmarked newline that separates adjacent visible
    // patches:
    // <p0> '\n' * <p1> '\n' <p2>
    //
    // If it's to become the first (visible) patch, its insertion point is at [0, 0]:
    // * <p0> '\n' <p1> '\n' <p2>
    //
    // If it's to become the final (visible) patch, its insertion point is at the buffer end:
    // <p0> '\n' <p1> '\n' <p2> *
    //
    // Insert a newline *before* the expanding patch if we're inserting at the buffer's end, but the buffer is non-empty
    // (so it isn't also the end of the buffer). Insert a newline *after* the expanding patch when inserting anywhere
    // but the buffer's end.

    if (willHaveContent && atEnd && !atStart) {
      const beforeNewline = [];
      const afterNewline = after.slice();
      for (const marker of before) {
        if (marker.getRange().isEmpty()) {
          afterNewline.push(marker);
        } else {
          beforeNewline.push(marker);
        }
      }
      patchBuffer.createInserterAt(this.patch.getInsertionPoint()).keepBefore(beforeNewline).keepAfter(afterNewline).insert('\n').apply();
    }
    patchBuffer.createInserterAt(this.patch.getInsertionPoint()).keepBefore(before).keepAfter(after).insertPatchBuffer(subPatchBuffer, {
      callback: map => nextPatch.updateMarkers(map)
    }).insert(!atEnd ? '\n' : '').apply();
    this.patch.destroyMarkers();
    this.patch = nextPatch;
    this.didChangeRenderStatus();
    return true;
  }
  didChangeRenderStatus() {
    return this.emitter.emit('change-render-status', this);
  }
  onDidChangeRenderStatus(callback) {
    return this.emitter.on('change-render-status', callback);
  }
  clone(opts = {}) {
    return new this.constructor(opts.oldFile !== undefined ? opts.oldFile : this.oldFile, opts.newFile !== undefined ? opts.newFile : this.newFile, opts.patch !== undefined ? opts.patch : this.patch);
  }
  getStartingMarkers() {
    return this.patch.getStartingMarkers();
  }
  getEndingMarkers() {
    return this.patch.getEndingMarkers();
  }
  buildStagePatchForLines(originalBuffer, nextPatchBuffer, selectedLineSet) {
    let newFile = this.getNewFile();
    if (this.getStatus() === 'deleted') {
      if (this.patch.getChangedLineCount() === selectedLineSet.size && Array.from(selectedLineSet, row => this.patch.containsRow(row)).every(Boolean)) {
        // Whole file deletion staged.
        newFile = _file.nullFile;
      } else {
        // Partial file deletion, which becomes a modification.
        newFile = this.getOldFile();
      }
    }
    const patch = this.patch.buildStagePatchForLines(originalBuffer, nextPatchBuffer, selectedLineSet);
    return this.clone({
      newFile,
      patch
    });
  }
  buildUnstagePatchForLines(originalBuffer, nextPatchBuffer, selectedLineSet) {
    const nonNullFile = this.getNewFile().isPresent() ? this.getNewFile() : this.getOldFile();
    let oldFile = this.getNewFile();
    let newFile = nonNullFile;
    if (this.getStatus() === 'added') {
      if (selectedLineSet.size === this.patch.getChangedLineCount() && Array.from(selectedLineSet, row => this.patch.containsRow(row)).every(Boolean)) {
        // Ensure that newFile is null if the patch is an addition because we're deleting the entire file from the
        // index. If a symlink was deleted and replaced by a non-symlink file, we don't want the symlink entry to muck
        // up the patch.
        oldFile = nonNullFile;
        newFile = _file.nullFile;
      }
    } else if (this.getStatus() === 'deleted') {
      if (selectedLineSet.size === this.patch.getChangedLineCount() && Array.from(selectedLineSet, row => this.patch.containsRow(row)).every(Boolean)) {
        oldFile = _file.nullFile;
        newFile = nonNullFile;
      }
    }
    const patch = this.patch.buildUnstagePatchForLines(originalBuffer, nextPatchBuffer, selectedLineSet);
    return this.clone({
      oldFile,
      newFile,
      patch
    });
  }
  toStringIn(buffer) {
    if (!this.isPresent()) {
      return '';
    }
    if (this.hasTypechange()) {
      const left = this.clone({
        newFile: _file.nullFile,
        patch: this.getOldSymlink() ? this.getPatch().clone({
          status: 'deleted'
        }) : this.getPatch()
      });
      const right = this.clone({
        oldFile: _file.nullFile,
        patch: this.getNewSymlink() ? this.getPatch().clone({
          status: 'added'
        }) : this.getPatch()
      });
      return left.toStringIn(buffer) + right.toStringIn(buffer);
    } else if (this.getStatus() === 'added' && this.getNewFile().isSymlink()) {
      const symlinkPath = this.getNewSymlink();
      return this.getHeaderString() + `@@ -0,0 +1 @@\n+${symlinkPath}\n\\ No newline at end of file\n`;
    } else if (this.getStatus() === 'deleted' && this.getOldFile().isSymlink()) {
      const symlinkPath = this.getOldSymlink();
      return this.getHeaderString() + `@@ -1 +0,0 @@\n-${symlinkPath}\n\\ No newline at end of file\n`;
    } else {
      return this.getHeaderString() + this.getPatch().toStringIn(buffer);
    }
  }

  /*
   * Construct a String containing diagnostic information about the internal state of this FilePatch.
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
    let inspectString = `${indentation}(FilePatch `;
    if (this.getOldPath() !== this.getNewPath()) {
      inspectString += `oldPath=${this.getOldPath()} newPath=${this.getNewPath()}`;
    } else {
      inspectString += `path=${this.getPath()}`;
    }
    inspectString += '\n';
    inspectString += this.patch.inspect({
      indent: options.indent + 2
    });
    inspectString += `${indentation})\n`;
    return inspectString;
  }
  getHeaderString() {
    const fromPath = this.getOldPath() || this.getNewPath();
    const toPath = this.getNewPath() || this.getOldPath();
    let header = `diff --git a/${(0, _helpers.toGitPathSep)(fromPath)} b/${(0, _helpers.toGitPathSep)(toPath)}`;
    header += '\n';
    if (this.getStatus() === 'added') {
      header += `new file mode ${this.getNewMode()}`;
      header += '\n';
    } else if (this.getStatus() === 'deleted') {
      header += `deleted file mode ${this.getOldMode()}`;
      header += '\n';
    }
    header += this.getOldPath() ? `--- a/${(0, _helpers.toGitPathSep)(this.getOldPath())}` : '--- /dev/null';
    header += '\n';
    header += this.getNewPath() ? `+++ b/${(0, _helpers.toGitPathSep)(this.getNewPath())}` : '+++ /dev/null';
    header += '\n';
    return header;
  }
}
exports.default = FilePatch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2ZpbGUiLCJfcGF0Y2giLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9oZWxwZXJzIiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJjYWNoZSIsImhhcyIsImdldCIsIm5ld09iaiIsImhhc1Byb3BlcnR5RGVzY3JpcHRvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZGVzYyIsInNldCIsIm93bktleXMiLCJvYmplY3QiLCJlbnVtZXJhYmxlT25seSIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiRmlsZVBhdGNoIiwiY3JlYXRlTnVsbCIsIm51bGxGaWxlIiwiUGF0Y2giLCJjcmVhdGVIaWRkZW5GaWxlUGF0Y2giLCJvbGRGaWxlIiwibmV3RmlsZSIsIm1hcmtlciIsInJlbmRlclN0YXR1cyIsInNob3dGbiIsImNyZWF0ZUhpZGRlblBhdGNoIiwiY29uc3RydWN0b3IiLCJwYXRjaCIsInJhd1BhdGNoZXMiLCJlbWl0dGVyIiwiRW1pdHRlciIsImlzUHJlc2VudCIsImdldFJlbmRlclN0YXR1cyIsImdldE9sZEZpbGUiLCJnZXROZXdGaWxlIiwiZ2V0UmF3Q29udGVudFBhdGNoIiwiRXJyb3IiLCJjb250ZW50IiwiZ2V0UGF0Y2giLCJnZXRNYXJrZXIiLCJnZXRTdGFydFJhbmdlIiwiZ2V0T2xkUGF0aCIsImdldFBhdGgiLCJnZXROZXdQYXRoIiwiZ2V0T2xkTW9kZSIsImdldE1vZGUiLCJnZXROZXdNb2RlIiwiZ2V0T2xkU3ltbGluayIsImdldFN5bWxpbmsiLCJnZXROZXdTeW1saW5rIiwiZ2V0Rmlyc3RDaGFuZ2VSYW5nZSIsImdldE1heExpbmVOdW1iZXJXaWR0aCIsImNvbnRhaW5zUm93Iiwicm93IiwiZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUiLCJpc0V4ZWN1dGFibGUiLCJoYXNTeW1saW5rIiwiQm9vbGVhbiIsImhhc1R5cGVjaGFuZ2UiLCJpc1N5bWxpbmsiLCJnZXRTdGF0dXMiLCJnZXRIdW5rcyIsInVwZGF0ZU1hcmtlcnMiLCJtYXAiLCJ0cmlnZ2VyQ29sbGFwc2VJbiIsInBhdGNoQnVmZmVyIiwiYmVmb3JlIiwiYWZ0ZXIiLCJpc1Zpc2libGUiLCJvbGRQYXRjaCIsIm9sZFJhbmdlIiwiZ2V0UmFuZ2UiLCJjb3B5IiwiaW5zZXJ0aW9uUG9zaXRpb24iLCJzdGFydCIsImV4Y2x1ZGUiLCJTZXQiLCJzdWJQYXRjaEJ1ZmZlciIsIm1hcmtlck1hcCIsImV4dHJhY3RQYXRjaEJ1ZmZlciIsImRlc3Ryb3lNYXJrZXJzIiwiaXNFbXB0eSIsImdldEJ1ZmZlciIsImRlbGV0ZVJvdyIsInBhdGNoTWFya2VyIiwibWFya1Bvc2l0aW9uIiwibGF5ZXJOYW1lIiwiaW52YWxpZGF0ZSIsImV4Y2x1c2l2ZSIsIkNPTExBUFNFRCIsImRpZENoYW5nZVJlbmRlclN0YXR1cyIsInRyaWdnZXJFeHBhbmRJbiIsIm5leHRQYXRjaCIsInNob3ciLCJhdFN0YXJ0IiwiZ2V0SW5zZXJ0aW9uUG9pbnQiLCJpc0VxdWFsIiwiYXRFbmQiLCJnZXRFbmRQb3NpdGlvbiIsIndpbGxIYXZlQ29udGVudCIsImJlZm9yZU5ld2xpbmUiLCJhZnRlck5ld2xpbmUiLCJzbGljZSIsImNyZWF0ZUluc2VydGVyQXQiLCJrZWVwQmVmb3JlIiwia2VlcEFmdGVyIiwiaW5zZXJ0IiwiaW5zZXJ0UGF0Y2hCdWZmZXIiLCJjYWxsYmFjayIsImVtaXQiLCJvbkRpZENoYW5nZVJlbmRlclN0YXR1cyIsIm9uIiwiY2xvbmUiLCJvcHRzIiwiZ2V0U3RhcnRpbmdNYXJrZXJzIiwiZ2V0RW5kaW5nTWFya2VycyIsImJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzIiwib3JpZ2luYWxCdWZmZXIiLCJuZXh0UGF0Y2hCdWZmZXIiLCJzZWxlY3RlZExpbmVTZXQiLCJnZXRDaGFuZ2VkTGluZUNvdW50Iiwic2l6ZSIsIkFycmF5IiwiZnJvbSIsImV2ZXJ5IiwiYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsIm5vbk51bGxGaWxlIiwidG9TdHJpbmdJbiIsImJ1ZmZlciIsImxlZnQiLCJzdGF0dXMiLCJyaWdodCIsInN5bWxpbmtQYXRoIiwiZ2V0SGVhZGVyU3RyaW5nIiwiaW5zcGVjdCIsIm9wdGlvbnMiLCJpbmRlbnQiLCJpbmRlbnRhdGlvbiIsImluc3BlY3RTdHJpbmciLCJmcm9tUGF0aCIsInRvUGF0aCIsImhlYWRlciIsInRvR2l0UGF0aFNlcCIsImV4cG9ydHMiXSwic291cmNlcyI6WyJmaWxlLXBhdGNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtudWxsRmlsZX0gZnJvbSAnLi9maWxlJztcbmltcG9ydCBQYXRjaCwge0NPTExBUFNFRH0gZnJvbSAnLi9wYXRjaCc7XG5pbXBvcnQge3RvR2l0UGF0aFNlcH0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVQYXRjaCB7XG4gIHN0YXRpYyBjcmVhdGVOdWxsKCkge1xuICAgIHJldHVybiBuZXcgdGhpcyhudWxsRmlsZSwgbnVsbEZpbGUsIFBhdGNoLmNyZWF0ZU51bGwoKSk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlSGlkZGVuRmlsZVBhdGNoKG9sZEZpbGUsIG5ld0ZpbGUsIG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pIHtcbiAgICByZXR1cm4gbmV3IHRoaXMob2xkRmlsZSwgbmV3RmlsZSwgUGF0Y2guY3JlYXRlSGlkZGVuUGF0Y2gobWFya2VyLCByZW5kZXJTdGF0dXMsIHNob3dGbikpO1xuICB9XG5cbiAgY29uc3RydWN0b3Iob2xkRmlsZSwgbmV3RmlsZSwgcGF0Y2gsIHJhd1BhdGNoZXMpIHtcbiAgICB0aGlzLm9sZEZpbGUgPSBvbGRGaWxlO1xuICAgIHRoaXMubmV3RmlsZSA9IG5ld0ZpbGU7XG4gICAgdGhpcy5wYXRjaCA9IHBhdGNoO1xuICAgIHRoaXMucmF3UGF0Y2hlcyA9IHJhd1BhdGNoZXM7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9sZEZpbGUuaXNQcmVzZW50KCkgfHwgdGhpcy5uZXdGaWxlLmlzUHJlc2VudCgpIHx8IHRoaXMucGF0Y2guaXNQcmVzZW50KCk7XG4gIH1cblxuICBnZXRSZW5kZXJTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCk7XG4gIH1cblxuICBnZXRPbGRGaWxlKCkge1xuICAgIHJldHVybiB0aGlzLm9sZEZpbGU7XG4gIH1cblxuICBnZXROZXdGaWxlKCkge1xuICAgIHJldHVybiB0aGlzLm5ld0ZpbGU7XG4gIH1cblxuICBnZXRSYXdDb250ZW50UGF0Y2goKSB7XG4gICAgaWYgKCF0aGlzLnJhd1BhdGNoZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZVBhdGNoIHdhcyBub3QgcGFyc2VkIHdpdGgge3BlcnNlcnZlT3JpZ2luYWw6IHRydWV9Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmF3UGF0Y2hlcy5jb250ZW50O1xuICB9XG5cbiAgZ2V0UGF0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2g7XG4gIH1cblxuICBnZXRNYXJrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2goKS5nZXRNYXJrZXIoKTtcbiAgfVxuXG4gIGdldFN0YXJ0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2goKS5nZXRTdGFydFJhbmdlKCk7XG4gIH1cblxuICBnZXRPbGRQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmdldE9sZEZpbGUoKS5nZXRQYXRoKCk7XG4gIH1cblxuICBnZXROZXdQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmdldE5ld0ZpbGUoKS5nZXRQYXRoKCk7XG4gIH1cblxuICBnZXRPbGRNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmdldE9sZEZpbGUoKS5nZXRNb2RlKCk7XG4gIH1cblxuICBnZXROZXdNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmdldE5ld0ZpbGUoKS5nZXRNb2RlKCk7XG4gIH1cblxuICBnZXRPbGRTeW1saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmdldE9sZEZpbGUoKS5nZXRTeW1saW5rKCk7XG4gIH1cblxuICBnZXROZXdTeW1saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmdldE5ld0ZpbGUoKS5nZXRTeW1saW5rKCk7XG4gIH1cblxuICBnZXRGaXJzdENoYW5nZVJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpO1xuICB9XG5cbiAgZ2V0TWF4TGluZU51bWJlcldpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0TWF4TGluZU51bWJlcldpZHRoKCk7XG4gIH1cblxuICBjb250YWluc1Jvdyhyb3cpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmNvbnRhaW5zUm93KHJvdyk7XG4gIH1cblxuICBkaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpIHtcbiAgICBpZiAoIXRoaXMub2xkRmlsZS5pc1ByZXNlbnQoKSB8fCAhdGhpcy5uZXdGaWxlLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub2xkRmlsZS5pc0V4ZWN1dGFibGUoKSAmJiAhdGhpcy5uZXdGaWxlLmlzRXhlY3V0YWJsZSgpIHx8XG4gICAgICAhdGhpcy5vbGRGaWxlLmlzRXhlY3V0YWJsZSgpICYmIHRoaXMubmV3RmlsZS5pc0V4ZWN1dGFibGUoKTtcbiAgfVxuXG4gIGhhc1N5bWxpbmsoKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXRPbGRGaWxlKCkuZ2V0U3ltbGluaygpIHx8IHRoaXMuZ2V0TmV3RmlsZSgpLmdldFN5bWxpbmsoKSk7XG4gIH1cblxuICBoYXNUeXBlY2hhbmdlKCkge1xuICAgIGlmICghdGhpcy5vbGRGaWxlLmlzUHJlc2VudCgpIHx8ICF0aGlzLm5ld0ZpbGUuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vbGRGaWxlLmlzU3ltbGluaygpICYmICF0aGlzLm5ld0ZpbGUuaXNTeW1saW5rKCkgfHxcbiAgICAgICF0aGlzLm9sZEZpbGUuaXNTeW1saW5rKCkgJiYgdGhpcy5uZXdGaWxlLmlzU3ltbGluaygpO1xuICB9XG5cbiAgZ2V0UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRQYXRoKCkgfHwgdGhpcy5nZXROZXdQYXRoKCk7XG4gIH1cblxuICBnZXRTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2goKS5nZXRTdGF0dXMoKTtcbiAgfVxuXG4gIGdldEh1bmtzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0SHVua3MoKTtcbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMobWFwKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2gudXBkYXRlTWFya2VycyhtYXApO1xuICB9XG5cbiAgdHJpZ2dlckNvbGxhcHNlSW4ocGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSkge1xuICAgIGlmICghdGhpcy5wYXRjaC5nZXRSZW5kZXJTdGF0dXMoKS5pc1Zpc2libGUoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZFBhdGNoID0gdGhpcy5wYXRjaDtcbiAgICBjb25zdCBvbGRSYW5nZSA9IG9sZFBhdGNoLmdldFJhbmdlKCkuY29weSgpO1xuICAgIGNvbnN0IGluc2VydGlvblBvc2l0aW9uID0gb2xkUmFuZ2Uuc3RhcnQ7XG4gICAgY29uc3QgZXhjbHVkZSA9IG5ldyBTZXQoWy4uLmJlZm9yZSwgLi4uYWZ0ZXJdKTtcbiAgICBjb25zdCB7cGF0Y2hCdWZmZXI6IHN1YlBhdGNoQnVmZmVyLCBtYXJrZXJNYXB9ID0gcGF0Y2hCdWZmZXIuZXh0cmFjdFBhdGNoQnVmZmVyKG9sZFJhbmdlLCB7ZXhjbHVkZX0pO1xuICAgIG9sZFBhdGNoLmRlc3Ryb3lNYXJrZXJzKCk7XG4gICAgb2xkUGF0Y2gudXBkYXRlTWFya2VycyhtYXJrZXJNYXApO1xuXG4gICAgLy8gRGVsZXRlIHRoZSBzZXBhcmF0aW5nIG5ld2xpbmUgYWZ0ZXIgdGhlIGNvbGxhcHNpbmcgcGF0Y2gsIGlmIGFueS5cbiAgICBpZiAoIW9sZFJhbmdlLmlzRW1wdHkoKSkge1xuICAgICAgcGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZGVsZXRlUm93KGluc2VydGlvblBvc2l0aW9uLnJvdyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGF0Y2hNYXJrZXIgPSBwYXRjaEJ1ZmZlci5tYXJrUG9zaXRpb24oXG4gICAgICBQYXRjaC5sYXllck5hbWUsXG4gICAgICBpbnNlcnRpb25Qb3NpdGlvbixcbiAgICAgIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBleGNsdXNpdmU6IHRydWV9LFxuICAgICk7XG4gICAgdGhpcy5wYXRjaCA9IFBhdGNoLmNyZWF0ZUhpZGRlblBhdGNoKHBhdGNoTWFya2VyLCBDT0xMQVBTRUQsICgpID0+IHtcbiAgICAgIHJldHVybiB7cGF0Y2g6IG9sZFBhdGNoLCBwYXRjaEJ1ZmZlcjogc3ViUGF0Y2hCdWZmZXJ9O1xuICAgIH0pO1xuXG4gICAgdGhpcy5kaWRDaGFuZ2VSZW5kZXJTdGF0dXMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHRyaWdnZXJFeHBhbmRJbihwYXRjaEJ1ZmZlciwge2JlZm9yZSwgYWZ0ZXJ9KSB7XG4gICAgaWYgKHRoaXMucGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB7cGF0Y2g6IG5leHRQYXRjaCwgcGF0Y2hCdWZmZXI6IHN1YlBhdGNoQnVmZmVyfSA9IHRoaXMucGF0Y2guc2hvdygpO1xuICAgIGNvbnN0IGF0U3RhcnQgPSB0aGlzLnBhdGNoLmdldEluc2VydGlvblBvaW50KCkuaXNFcXVhbChbMCwgMF0pO1xuICAgIGNvbnN0IGF0RW5kID0gdGhpcy5wYXRjaC5nZXRJbnNlcnRpb25Qb2ludCgpLmlzRXF1YWwocGF0Y2hCdWZmZXIuZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSk7XG4gICAgY29uc3Qgd2lsbEhhdmVDb250ZW50ID0gIXN1YlBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmlzRW1wdHkoKTtcblxuICAgIC8vIFRoZSBleHBhbmRpbmcgcGF0Y2gncyBpbnNlcnRpb24gcG9pbnQgaXMganVzdCBhZnRlciB0aGUgdW5tYXJrZWQgbmV3bGluZSB0aGF0IHNlcGFyYXRlcyBhZGphY2VudCB2aXNpYmxlXG4gICAgLy8gcGF0Y2hlczpcbiAgICAvLyA8cDA+ICdcXG4nICogPHAxPiAnXFxuJyA8cDI+XG4gICAgLy9cbiAgICAvLyBJZiBpdCdzIHRvIGJlY29tZSB0aGUgZmlyc3QgKHZpc2libGUpIHBhdGNoLCBpdHMgaW5zZXJ0aW9uIHBvaW50IGlzIGF0IFswLCAwXTpcbiAgICAvLyAqIDxwMD4gJ1xcbicgPHAxPiAnXFxuJyA8cDI+XG4gICAgLy9cbiAgICAvLyBJZiBpdCdzIHRvIGJlY29tZSB0aGUgZmluYWwgKHZpc2libGUpIHBhdGNoLCBpdHMgaW5zZXJ0aW9uIHBvaW50IGlzIGF0IHRoZSBidWZmZXIgZW5kOlxuICAgIC8vIDxwMD4gJ1xcbicgPHAxPiAnXFxuJyA8cDI+ICpcbiAgICAvL1xuICAgIC8vIEluc2VydCBhIG5ld2xpbmUgKmJlZm9yZSogdGhlIGV4cGFuZGluZyBwYXRjaCBpZiB3ZSdyZSBpbnNlcnRpbmcgYXQgdGhlIGJ1ZmZlcidzIGVuZCwgYnV0IHRoZSBidWZmZXIgaXMgbm9uLWVtcHR5XG4gICAgLy8gKHNvIGl0IGlzbid0IGFsc28gdGhlIGVuZCBvZiB0aGUgYnVmZmVyKS4gSW5zZXJ0IGEgbmV3bGluZSAqYWZ0ZXIqIHRoZSBleHBhbmRpbmcgcGF0Y2ggd2hlbiBpbnNlcnRpbmcgYW55d2hlcmVcbiAgICAvLyBidXQgdGhlIGJ1ZmZlcidzIGVuZC5cblxuICAgIGlmICh3aWxsSGF2ZUNvbnRlbnQgJiYgYXRFbmQgJiYgIWF0U3RhcnQpIHtcbiAgICAgIGNvbnN0IGJlZm9yZU5ld2xpbmUgPSBbXTtcbiAgICAgIGNvbnN0IGFmdGVyTmV3bGluZSA9IGFmdGVyLnNsaWNlKCk7XG5cbiAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIGJlZm9yZSkge1xuICAgICAgICBpZiAobWFya2VyLmdldFJhbmdlKCkuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgYWZ0ZXJOZXdsaW5lLnB1c2gobWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZWZvcmVOZXdsaW5lLnB1c2gobWFya2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwYXRjaEJ1ZmZlclxuICAgICAgICAuY3JlYXRlSW5zZXJ0ZXJBdCh0aGlzLnBhdGNoLmdldEluc2VydGlvblBvaW50KCkpXG4gICAgICAgIC5rZWVwQmVmb3JlKGJlZm9yZU5ld2xpbmUpXG4gICAgICAgIC5rZWVwQWZ0ZXIoYWZ0ZXJOZXdsaW5lKVxuICAgICAgICAuaW5zZXJ0KCdcXG4nKVxuICAgICAgICAuYXBwbHkoKTtcbiAgICB9XG5cbiAgICBwYXRjaEJ1ZmZlclxuICAgICAgLmNyZWF0ZUluc2VydGVyQXQodGhpcy5wYXRjaC5nZXRJbnNlcnRpb25Qb2ludCgpKVxuICAgICAgLmtlZXBCZWZvcmUoYmVmb3JlKVxuICAgICAgLmtlZXBBZnRlcihhZnRlcilcbiAgICAgIC5pbnNlcnRQYXRjaEJ1ZmZlcihzdWJQYXRjaEJ1ZmZlciwge2NhbGxiYWNrOiBtYXAgPT4gbmV4dFBhdGNoLnVwZGF0ZU1hcmtlcnMobWFwKX0pXG4gICAgICAuaW5zZXJ0KCFhdEVuZCA/ICdcXG4nIDogJycpXG4gICAgICAuYXBwbHkoKTtcblxuICAgIHRoaXMucGF0Y2guZGVzdHJveU1hcmtlcnMoKTtcbiAgICB0aGlzLnBhdGNoID0gbmV4dFBhdGNoO1xuICAgIHRoaXMuZGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkaWRDaGFuZ2VSZW5kZXJTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2UtcmVuZGVyLXN0YXR1cycsIHRoaXMpO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VSZW5kZXJTdGF0dXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdjaGFuZ2UtcmVuZGVyLXN0YXR1cycsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgIG9wdHMub2xkRmlsZSAhPT0gdW5kZWZpbmVkID8gb3B0cy5vbGRGaWxlIDogdGhpcy5vbGRGaWxlLFxuICAgICAgb3B0cy5uZXdGaWxlICE9PSB1bmRlZmluZWQgPyBvcHRzLm5ld0ZpbGUgOiB0aGlzLm5ld0ZpbGUsXG4gICAgICBvcHRzLnBhdGNoICE9PSB1bmRlZmluZWQgPyBvcHRzLnBhdGNoIDogdGhpcy5wYXRjaCxcbiAgICApO1xuICB9XG5cbiAgZ2V0U3RhcnRpbmdNYXJrZXJzKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoLmdldFN0YXJ0aW5nTWFya2VycygpO1xuICB9XG5cbiAgZ2V0RW5kaW5nTWFya2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRjaC5nZXRFbmRpbmdNYXJrZXJzKCk7XG4gIH1cblxuICBidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyhvcmlnaW5hbEJ1ZmZlciwgbmV4dFBhdGNoQnVmZmVyLCBzZWxlY3RlZExpbmVTZXQpIHtcbiAgICBsZXQgbmV3RmlsZSA9IHRoaXMuZ2V0TmV3RmlsZSgpO1xuICAgIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnZGVsZXRlZCcpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5wYXRjaC5nZXRDaGFuZ2VkTGluZUNvdW50KCkgPT09IHNlbGVjdGVkTGluZVNldC5zaXplICYmXG4gICAgICAgIEFycmF5LmZyb20oc2VsZWN0ZWRMaW5lU2V0LCByb3cgPT4gdGhpcy5wYXRjaC5jb250YWluc1Jvdyhyb3cpKS5ldmVyeShCb29sZWFuKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFdob2xlIGZpbGUgZGVsZXRpb24gc3RhZ2VkLlxuICAgICAgICBuZXdGaWxlID0gbnVsbEZpbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQYXJ0aWFsIGZpbGUgZGVsZXRpb24sIHdoaWNoIGJlY29tZXMgYSBtb2RpZmljYXRpb24uXG4gICAgICAgIG5ld0ZpbGUgPSB0aGlzLmdldE9sZEZpbGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYXRjaCA9IHRoaXMucGF0Y2guYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMoXG4gICAgICBvcmlnaW5hbEJ1ZmZlcixcbiAgICAgIG5leHRQYXRjaEJ1ZmZlcixcbiAgICAgIHNlbGVjdGVkTGluZVNldCxcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtuZXdGaWxlLCBwYXRjaH0pO1xuICB9XG5cbiAgYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhvcmlnaW5hbEJ1ZmZlciwgbmV4dFBhdGNoQnVmZmVyLCBzZWxlY3RlZExpbmVTZXQpIHtcbiAgICBjb25zdCBub25OdWxsRmlsZSA9IHRoaXMuZ2V0TmV3RmlsZSgpLmlzUHJlc2VudCgpID8gdGhpcy5nZXROZXdGaWxlKCkgOiB0aGlzLmdldE9sZEZpbGUoKTtcbiAgICBsZXQgb2xkRmlsZSA9IHRoaXMuZ2V0TmV3RmlsZSgpO1xuICAgIGxldCBuZXdGaWxlID0gbm9uTnVsbEZpbGU7XG5cbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2FkZGVkJykge1xuICAgICAgaWYgKFxuICAgICAgICBzZWxlY3RlZExpbmVTZXQuc2l6ZSA9PT0gdGhpcy5wYXRjaC5nZXRDaGFuZ2VkTGluZUNvdW50KCkgJiZcbiAgICAgICAgQXJyYXkuZnJvbShzZWxlY3RlZExpbmVTZXQsIHJvdyA9PiB0aGlzLnBhdGNoLmNvbnRhaW5zUm93KHJvdykpLmV2ZXJ5KEJvb2xlYW4pXG4gICAgICApIHtcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgbmV3RmlsZSBpcyBudWxsIGlmIHRoZSBwYXRjaCBpcyBhbiBhZGRpdGlvbiBiZWNhdXNlIHdlJ3JlIGRlbGV0aW5nIHRoZSBlbnRpcmUgZmlsZSBmcm9tIHRoZVxuICAgICAgICAvLyBpbmRleC4gSWYgYSBzeW1saW5rIHdhcyBkZWxldGVkIGFuZCByZXBsYWNlZCBieSBhIG5vbi1zeW1saW5rIGZpbGUsIHdlIGRvbid0IHdhbnQgdGhlIHN5bWxpbmsgZW50cnkgdG8gbXVja1xuICAgICAgICAvLyB1cCB0aGUgcGF0Y2guXG4gICAgICAgIG9sZEZpbGUgPSBub25OdWxsRmlsZTtcbiAgICAgICAgbmV3RmlsZSA9IG51bGxGaWxlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHNlbGVjdGVkTGluZVNldC5zaXplID09PSB0aGlzLnBhdGNoLmdldENoYW5nZWRMaW5lQ291bnQoKSAmJlxuICAgICAgICBBcnJheS5mcm9tKHNlbGVjdGVkTGluZVNldCwgcm93ID0+IHRoaXMucGF0Y2guY29udGFpbnNSb3cocm93KSkuZXZlcnkoQm9vbGVhbilcbiAgICAgICkge1xuICAgICAgICBvbGRGaWxlID0gbnVsbEZpbGU7XG4gICAgICAgIG5ld0ZpbGUgPSBub25OdWxsRmlsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYXRjaCA9IHRoaXMucGF0Y2guYnVpbGRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhcbiAgICAgIG9yaWdpbmFsQnVmZmVyLFxuICAgICAgbmV4dFBhdGNoQnVmZmVyLFxuICAgICAgc2VsZWN0ZWRMaW5lU2V0LFxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoe29sZEZpbGUsIG5ld0ZpbGUsIHBhdGNofSk7XG4gIH1cblxuICB0b1N0cmluZ0luKGJ1ZmZlcikge1xuICAgIGlmICghdGhpcy5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc1R5cGVjaGFuZ2UoKSkge1xuICAgICAgY29uc3QgbGVmdCA9IHRoaXMuY2xvbmUoe1xuICAgICAgICBuZXdGaWxlOiBudWxsRmlsZSxcbiAgICAgICAgcGF0Y2g6IHRoaXMuZ2V0T2xkU3ltbGluaygpID8gdGhpcy5nZXRQYXRjaCgpLmNsb25lKHtzdGF0dXM6ICdkZWxldGVkJ30pIDogdGhpcy5nZXRQYXRjaCgpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5jbG9uZSh7XG4gICAgICAgIG9sZEZpbGU6IG51bGxGaWxlLFxuICAgICAgICBwYXRjaDogdGhpcy5nZXROZXdTeW1saW5rKCkgPyB0aGlzLmdldFBhdGNoKCkuY2xvbmUoe3N0YXR1czogJ2FkZGVkJ30pIDogdGhpcy5nZXRQYXRjaCgpLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBsZWZ0LnRvU3RyaW5nSW4oYnVmZmVyKSArIHJpZ2h0LnRvU3RyaW5nSW4oYnVmZmVyKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdhZGRlZCcgJiYgdGhpcy5nZXROZXdGaWxlKCkuaXNTeW1saW5rKCkpIHtcbiAgICAgIGNvbnN0IHN5bWxpbmtQYXRoID0gdGhpcy5nZXROZXdTeW1saW5rKCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIZWFkZXJTdHJpbmcoKSArIGBAQCAtMCwwICsxIEBAXFxuKyR7c3ltbGlua1BhdGh9XFxuXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlXFxuYDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJyAmJiB0aGlzLmdldE9sZEZpbGUoKS5pc1N5bWxpbmsoKSkge1xuICAgICAgY29uc3Qgc3ltbGlua1BhdGggPSB0aGlzLmdldE9sZFN5bWxpbmsoKTtcbiAgICAgIHJldHVybiB0aGlzLmdldEhlYWRlclN0cmluZygpICsgYEBAIC0xICswLDAgQEBcXG4tJHtzeW1saW5rUGF0aH1cXG5cXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGVcXG5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIZWFkZXJTdHJpbmcoKSArIHRoaXMuZ2V0UGF0Y2goKS50b1N0cmluZ0luKGJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhpcyBGaWxlUGF0Y2guXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpbmRlbnQ6IDAsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICBsZXQgaW5kZW50YXRpb24gPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuaW5kZW50OyBpKyspIHtcbiAgICAgIGluZGVudGF0aW9uICs9ICcgJztcbiAgICB9XG5cbiAgICBsZXQgaW5zcGVjdFN0cmluZyA9IGAke2luZGVudGF0aW9ufShGaWxlUGF0Y2ggYDtcbiAgICBpZiAodGhpcy5nZXRPbGRQYXRoKCkgIT09IHRoaXMuZ2V0TmV3UGF0aCgpKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGBvbGRQYXRoPSR7dGhpcy5nZXRPbGRQYXRoKCl9IG5ld1BhdGg9JHt0aGlzLmdldE5ld1BhdGgoKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IGBwYXRoPSR7dGhpcy5nZXRQYXRoKCl9YDtcbiAgICB9XG4gICAgaW5zcGVjdFN0cmluZyArPSAnXFxuJztcblxuICAgIGluc3BlY3RTdHJpbmcgKz0gdGhpcy5wYXRjaC5pbnNwZWN0KHtpbmRlbnQ6IG9wdGlvbnMuaW5kZW50ICsgMn0pO1xuXG4gICAgaW5zcGVjdFN0cmluZyArPSBgJHtpbmRlbnRhdGlvbn0pXFxuYDtcbiAgICByZXR1cm4gaW5zcGVjdFN0cmluZztcbiAgfVxuXG4gIGdldEhlYWRlclN0cmluZygpIHtcbiAgICBjb25zdCBmcm9tUGF0aCA9IHRoaXMuZ2V0T2xkUGF0aCgpIHx8IHRoaXMuZ2V0TmV3UGF0aCgpO1xuICAgIGNvbnN0IHRvUGF0aCA9IHRoaXMuZ2V0TmV3UGF0aCgpIHx8IHRoaXMuZ2V0T2xkUGF0aCgpO1xuICAgIGxldCBoZWFkZXIgPSBgZGlmZiAtLWdpdCBhLyR7dG9HaXRQYXRoU2VwKGZyb21QYXRoKX0gYi8ke3RvR2l0UGF0aFNlcCh0b1BhdGgpfWA7XG4gICAgaGVhZGVyICs9ICdcXG4nO1xuICAgIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnYWRkZWQnKSB7XG4gICAgICBoZWFkZXIgKz0gYG5ldyBmaWxlIG1vZGUgJHt0aGlzLmdldE5ld01vZGUoKX1gO1xuICAgICAgaGVhZGVyICs9ICdcXG4nO1xuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICBoZWFkZXIgKz0gYGRlbGV0ZWQgZmlsZSBtb2RlICR7dGhpcy5nZXRPbGRNb2RlKCl9YDtcbiAgICAgIGhlYWRlciArPSAnXFxuJztcbiAgICB9XG4gICAgaGVhZGVyICs9IHRoaXMuZ2V0T2xkUGF0aCgpID8gYC0tLSBhLyR7dG9HaXRQYXRoU2VwKHRoaXMuZ2V0T2xkUGF0aCgpKX1gIDogJy0tLSAvZGV2L251bGwnO1xuICAgIGhlYWRlciArPSAnXFxuJztcbiAgICBoZWFkZXIgKz0gdGhpcy5nZXROZXdQYXRoKCkgPyBgKysrIGIvJHt0b0dpdFBhdGhTZXAodGhpcy5nZXROZXdQYXRoKCkpfWAgOiAnKysrIC9kZXYvbnVsbCc7XG4gICAgaGVhZGVyICs9ICdcXG4nO1xuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsU0FBQSxHQUFBQyxPQUFBO0FBRUEsSUFBQUMsS0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsTUFBQSxHQUFBQyx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUksUUFBQSxHQUFBSixPQUFBO0FBQTJDLFNBQUFLLHlCQUFBQyxXQUFBLGVBQUFDLE9BQUEsa0NBQUFDLGlCQUFBLE9BQUFELE9BQUEsUUFBQUUsZ0JBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxXQUFBLFdBQUFBLFdBQUEsR0FBQUcsZ0JBQUEsR0FBQUQsaUJBQUEsS0FBQUYsV0FBQTtBQUFBLFNBQUFILHdCQUFBTyxHQUFBLEVBQUFKLFdBQUEsU0FBQUEsV0FBQSxJQUFBSSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxXQUFBRCxHQUFBLFFBQUFBLEdBQUEsb0JBQUFBLEdBQUEsd0JBQUFBLEdBQUEsNEJBQUFFLE9BQUEsRUFBQUYs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