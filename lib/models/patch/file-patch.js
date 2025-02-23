"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventKit = require("event-kit");
var _file = require("./file");
var _patch = _interopRequireWildcard(require("./patch"));
var _helpers = require("../../helpers");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2ZpbGUiLCJfcGF0Y2giLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9oZWxwZXJzIiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJvIiwiZmlsdGVyIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJfdG9Qcm9wZXJ0eUtleSIsInZhbHVlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIlN0cmluZyIsIk51bWJlciIsIkZpbGVQYXRjaCIsImNyZWF0ZU51bGwiLCJudWxsRmlsZSIsIlBhdGNoIiwiY3JlYXRlSGlkZGVuRmlsZVBhdGNoIiwib2xkRmlsZSIsIm5ld0ZpbGUiLCJtYXJrZXIiLCJyZW5kZXJTdGF0dXMiLCJzaG93Rm4iLCJjcmVhdGVIaWRkZW5QYXRjaCIsImNvbnN0cnVjdG9yIiwicGF0Y2giLCJyYXdQYXRjaGVzIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJpc1ByZXNlbnQiLCJnZXRSZW5kZXJTdGF0dXMiLCJnZXRPbGRGaWxlIiwiZ2V0TmV3RmlsZSIsImdldFJhd0NvbnRlbnRQYXRjaCIsIkVycm9yIiwiY29udGVudCIsImdldFBhdGNoIiwiZ2V0TWFya2VyIiwiZ2V0U3RhcnRSYW5nZSIsImdldE9sZFBhdGgiLCJnZXRQYXRoIiwiZ2V0TmV3UGF0aCIsImdldE9sZE1vZGUiLCJnZXRNb2RlIiwiZ2V0TmV3TW9kZSIsImdldE9sZFN5bWxpbmsiLCJnZXRTeW1saW5rIiwiZ2V0TmV3U3ltbGluayIsImdldEZpcnN0Q2hhbmdlUmFuZ2UiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJjb250YWluc1JvdyIsInJvdyIsImRpZENoYW5nZUV4ZWN1dGFibGVNb2RlIiwiaXNFeGVjdXRhYmxlIiwiaGFzU3ltbGluayIsIkJvb2xlYW4iLCJoYXNUeXBlY2hhbmdlIiwiaXNTeW1saW5rIiwiZ2V0U3RhdHVzIiwiZ2V0SHVua3MiLCJ1cGRhdGVNYXJrZXJzIiwibWFwIiwidHJpZ2dlckNvbGxhcHNlSW4iLCJwYXRjaEJ1ZmZlciIsImJlZm9yZSIsImFmdGVyIiwiaXNWaXNpYmxlIiwib2xkUGF0Y2giLCJvbGRSYW5nZSIsImdldFJhbmdlIiwiY29weSIsImluc2VydGlvblBvc2l0aW9uIiwic3RhcnQiLCJleGNsdWRlIiwiU2V0Iiwic3ViUGF0Y2hCdWZmZXIiLCJtYXJrZXJNYXAiLCJleHRyYWN0UGF0Y2hCdWZmZXIiLCJkZXN0cm95TWFya2VycyIsImlzRW1wdHkiLCJnZXRCdWZmZXIiLCJkZWxldGVSb3ciLCJwYXRjaE1hcmtlciIsIm1hcmtQb3NpdGlvbiIsImxheWVyTmFtZSIsImludmFsaWRhdGUiLCJleGNsdXNpdmUiLCJDT0xMQVBTRUQiLCJkaWRDaGFuZ2VSZW5kZXJTdGF0dXMiLCJ0cmlnZ2VyRXhwYW5kSW4iLCJuZXh0UGF0Y2giLCJzaG93IiwiYXRTdGFydCIsImdldEluc2VydGlvblBvaW50IiwiaXNFcXVhbCIsImF0RW5kIiwiZ2V0RW5kUG9zaXRpb24iLCJ3aWxsSGF2ZUNvbnRlbnQiLCJiZWZvcmVOZXdsaW5lIiwiYWZ0ZXJOZXdsaW5lIiwic2xpY2UiLCJjcmVhdGVJbnNlcnRlckF0Iiwia2VlcEJlZm9yZSIsImtlZXBBZnRlciIsImluc2VydCIsImluc2VydFBhdGNoQnVmZmVyIiwiY2FsbGJhY2siLCJlbWl0Iiwib25EaWRDaGFuZ2VSZW5kZXJTdGF0dXMiLCJvbiIsImNsb25lIiwib3B0cyIsInVuZGVmaW5lZCIsImdldFN0YXJ0aW5nTWFya2VycyIsImdldEVuZGluZ01hcmtlcnMiLCJidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyIsIm9yaWdpbmFsQnVmZmVyIiwibmV4dFBhdGNoQnVmZmVyIiwic2VsZWN0ZWRMaW5lU2V0IiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsInNpemUiLCJBcnJheSIsImZyb20iLCJldmVyeSIsImJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMiLCJub25OdWxsRmlsZSIsInRvU3RyaW5nSW4iLCJidWZmZXIiLCJsZWZ0Iiwic3RhdHVzIiwicmlnaHQiLCJzeW1saW5rUGF0aCIsImdldEhlYWRlclN0cmluZyIsImluc3BlY3QiLCJvcHRpb25zIiwiaW5kZW50IiwiaW5kZW50YXRpb24iLCJpbnNwZWN0U3RyaW5nIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJoZWFkZXIiLCJ0b0dpdFBhdGhTZXAiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiZmlsZS1wYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7bnVsbEZpbGV9IGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgUGF0Y2gsIHtDT0xMQVBTRUR9IGZyb20gJy4vcGF0Y2gnO1xuaW1wb3J0IHt0b0dpdFBhdGhTZXB9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlUGF0Y2gge1xuICBzdGF0aWMgY3JlYXRlTnVsbCgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMobnVsbEZpbGUsIG51bGxGaWxlLCBQYXRjaC5jcmVhdGVOdWxsKCkpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUhpZGRlbkZpbGVQYXRjaChvbGRGaWxlLCBuZXdGaWxlLCBtYXJrZXIsIHJlbmRlclN0YXR1cywgc2hvd0ZuKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKG9sZEZpbGUsIG5ld0ZpbGUsIFBhdGNoLmNyZWF0ZUhpZGRlblBhdGNoKG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKSB7XG4gICAgdGhpcy5vbGRGaWxlID0gb2xkRmlsZTtcbiAgICB0aGlzLm5ld0ZpbGUgPSBuZXdGaWxlO1xuICAgIHRoaXMucGF0Y2ggPSBwYXRjaDtcbiAgICB0aGlzLnJhd1BhdGNoZXMgPSByYXdQYXRjaGVzO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRGaWxlLmlzUHJlc2VudCgpIHx8IHRoaXMubmV3RmlsZS5pc1ByZXNlbnQoKSB8fCB0aGlzLnBhdGNoLmlzUHJlc2VudCgpO1xuICB9XG5cbiAgZ2V0UmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoLmdldFJlbmRlclN0YXR1cygpO1xuICB9XG5cbiAgZ2V0T2xkRmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRGaWxlO1xuICB9XG5cbiAgZ2V0TmV3RmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXdGaWxlO1xuICB9XG5cbiAgZ2V0UmF3Q29udGVudFBhdGNoKCkge1xuICAgIGlmICghdGhpcy5yYXdQYXRjaGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGVQYXRjaCB3YXMgbm90IHBhcnNlZCB3aXRoIHtwZXJzZXJ2ZU9yaWdpbmFsOiB0cnVlfScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJhd1BhdGNoZXMuY29udGVudDtcbiAgfVxuXG4gIGdldFBhdGNoKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoO1xuICB9XG5cbiAgZ2V0TWFya2VyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0TWFya2VyKCk7XG4gIH1cblxuICBnZXRTdGFydFJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0U3RhcnRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0T2xkUGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRGaWxlKCkuZ2V0UGF0aCgpO1xuICB9XG5cbiAgZ2V0TmV3UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXdGaWxlKCkuZ2V0UGF0aCgpO1xuICB9XG5cbiAgZ2V0T2xkTW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRGaWxlKCkuZ2V0TW9kZSgpO1xuICB9XG5cbiAgZ2V0TmV3TW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXdGaWxlKCkuZ2V0TW9kZSgpO1xuICB9XG5cbiAgZ2V0T2xkU3ltbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRGaWxlKCkuZ2V0U3ltbGluaygpO1xuICB9XG5cbiAgZ2V0TmV3U3ltbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXdGaWxlKCkuZ2V0U3ltbGluaygpO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmdldEZpcnN0Q2hhbmdlUmFuZ2UoKTtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmdldE1heExpbmVOdW1iZXJXaWR0aCgpO1xuICB9XG5cbiAgY29udGFpbnNSb3cocm93KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2goKS5jb250YWluc1Jvdyhyb3cpO1xuICB9XG5cbiAgZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUoKSB7XG4gICAgaWYgKCF0aGlzLm9sZEZpbGUuaXNQcmVzZW50KCkgfHwgIXRoaXMubmV3RmlsZS5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9sZEZpbGUuaXNFeGVjdXRhYmxlKCkgJiYgIXRoaXMubmV3RmlsZS5pc0V4ZWN1dGFibGUoKSB8fFxuICAgICAgIXRoaXMub2xkRmlsZS5pc0V4ZWN1dGFibGUoKSAmJiB0aGlzLm5ld0ZpbGUuaXNFeGVjdXRhYmxlKCk7XG4gIH1cblxuICBoYXNTeW1saW5rKCkge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuZ2V0T2xkRmlsZSgpLmdldFN5bWxpbmsoKSB8fCB0aGlzLmdldE5ld0ZpbGUoKS5nZXRTeW1saW5rKCkpO1xuICB9XG5cbiAgaGFzVHlwZWNoYW5nZSgpIHtcbiAgICBpZiAoIXRoaXMub2xkRmlsZS5pc1ByZXNlbnQoKSB8fCAhdGhpcy5uZXdGaWxlLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub2xkRmlsZS5pc1N5bWxpbmsoKSAmJiAhdGhpcy5uZXdGaWxlLmlzU3ltbGluaygpIHx8XG4gICAgICAhdGhpcy5vbGRGaWxlLmlzU3ltbGluaygpICYmIHRoaXMubmV3RmlsZS5pc1N5bWxpbmsoKTtcbiAgfVxuXG4gIGdldFBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T2xkUGF0aCgpIHx8IHRoaXMuZ2V0TmV3UGF0aCgpO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0U3RhdHVzKCk7XG4gIH1cblxuICBnZXRIdW5rcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmdldEh1bmtzKCk7XG4gIH1cblxuICB1cGRhdGVNYXJrZXJzKG1hcCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoLnVwZGF0ZU1hcmtlcnMobWFwKTtcbiAgfVxuXG4gIHRyaWdnZXJDb2xsYXBzZUluKHBhdGNoQnVmZmVyLCB7YmVmb3JlLCBhZnRlcn0pIHtcbiAgICBpZiAoIXRoaXMucGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRQYXRjaCA9IHRoaXMucGF0Y2g7XG4gICAgY29uc3Qgb2xkUmFuZ2UgPSBvbGRQYXRjaC5nZXRSYW5nZSgpLmNvcHkoKTtcbiAgICBjb25zdCBpbnNlcnRpb25Qb3NpdGlvbiA9IG9sZFJhbmdlLnN0YXJ0O1xuICAgIGNvbnN0IGV4Y2x1ZGUgPSBuZXcgU2V0KFsuLi5iZWZvcmUsIC4uLmFmdGVyXSk7XG4gICAgY29uc3Qge3BhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlciwgbWFya2VyTWFwfSA9IHBhdGNoQnVmZmVyLmV4dHJhY3RQYXRjaEJ1ZmZlcihvbGRSYW5nZSwge2V4Y2x1ZGV9KTtcbiAgICBvbGRQYXRjaC5kZXN0cm95TWFya2VycygpO1xuICAgIG9sZFBhdGNoLnVwZGF0ZU1hcmtlcnMobWFya2VyTWFwKTtcblxuICAgIC8vIERlbGV0ZSB0aGUgc2VwYXJhdGluZyBuZXdsaW5lIGFmdGVyIHRoZSBjb2xsYXBzaW5nIHBhdGNoLCBpZiBhbnkuXG4gICAgaWYgKCFvbGRSYW5nZS5pc0VtcHR5KCkpIHtcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmRlbGV0ZVJvdyhpbnNlcnRpb25Qb3NpdGlvbi5yb3cpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhdGNoTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgaW5zZXJ0aW9uUG9zaXRpb24sXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiB0cnVlfSxcbiAgICApO1xuICAgIHRoaXMucGF0Y2ggPSBQYXRjaC5jcmVhdGVIaWRkZW5QYXRjaChwYXRjaE1hcmtlciwgQ09MTEFQU0VELCAoKSA9PiB7XG4gICAgICByZXR1cm4ge3BhdGNoOiBvbGRQYXRjaCwgcGF0Y2hCdWZmZXI6IHN1YlBhdGNoQnVmZmVyfTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB0cmlnZ2VyRXhwYW5kSW4ocGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSkge1xuICAgIGlmICh0aGlzLnBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzVmlzaWJsZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qge3BhdGNoOiBuZXh0UGF0Y2gsIHBhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlcn0gPSB0aGlzLnBhdGNoLnNob3coKTtcbiAgICBjb25zdCBhdFN0YXJ0ID0gdGhpcy5wYXRjaC5nZXRJbnNlcnRpb25Qb2ludCgpLmlzRXF1YWwoWzAsIDBdKTtcbiAgICBjb25zdCBhdEVuZCA9IHRoaXMucGF0Y2guZ2V0SW5zZXJ0aW9uUG9pbnQoKS5pc0VxdWFsKHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IHdpbGxIYXZlQ29udGVudCA9ICFzdWJQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5pc0VtcHR5KCk7XG5cbiAgICAvLyBUaGUgZXhwYW5kaW5nIHBhdGNoJ3MgaW5zZXJ0aW9uIHBvaW50IGlzIGp1c3QgYWZ0ZXIgdGhlIHVubWFya2VkIG5ld2xpbmUgdGhhdCBzZXBhcmF0ZXMgYWRqYWNlbnQgdmlzaWJsZVxuICAgIC8vIHBhdGNoZXM6XG4gICAgLy8gPHAwPiAnXFxuJyAqIDxwMT4gJ1xcbicgPHAyPlxuICAgIC8vXG4gICAgLy8gSWYgaXQncyB0byBiZWNvbWUgdGhlIGZpcnN0ICh2aXNpYmxlKSBwYXRjaCwgaXRzIGluc2VydGlvbiBwb2ludCBpcyBhdCBbMCwgMF06XG4gICAgLy8gKiA8cDA+ICdcXG4nIDxwMT4gJ1xcbicgPHAyPlxuICAgIC8vXG4gICAgLy8gSWYgaXQncyB0byBiZWNvbWUgdGhlIGZpbmFsICh2aXNpYmxlKSBwYXRjaCwgaXRzIGluc2VydGlvbiBwb2ludCBpcyBhdCB0aGUgYnVmZmVyIGVuZDpcbiAgICAvLyA8cDA+ICdcXG4nIDxwMT4gJ1xcbicgPHAyPiAqXG4gICAgLy9cbiAgICAvLyBJbnNlcnQgYSBuZXdsaW5lICpiZWZvcmUqIHRoZSBleHBhbmRpbmcgcGF0Y2ggaWYgd2UncmUgaW5zZXJ0aW5nIGF0IHRoZSBidWZmZXIncyBlbmQsIGJ1dCB0aGUgYnVmZmVyIGlzIG5vbi1lbXB0eVxuICAgIC8vIChzbyBpdCBpc24ndCBhbHNvIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlcikuIEluc2VydCBhIG5ld2xpbmUgKmFmdGVyKiB0aGUgZXhwYW5kaW5nIHBhdGNoIHdoZW4gaW5zZXJ0aW5nIGFueXdoZXJlXG4gICAgLy8gYnV0IHRoZSBidWZmZXIncyBlbmQuXG5cbiAgICBpZiAod2lsbEhhdmVDb250ZW50ICYmIGF0RW5kICYmICFhdFN0YXJ0KSB7XG4gICAgICBjb25zdCBiZWZvcmVOZXdsaW5lID0gW107XG4gICAgICBjb25zdCBhZnRlck5ld2xpbmUgPSBhZnRlci5zbGljZSgpO1xuXG4gICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBiZWZvcmUpIHtcbiAgICAgICAgaWYgKG1hcmtlci5nZXRSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgICAgIGFmdGVyTmV3bGluZS5wdXNoKG1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVmb3JlTmV3bGluZS5wdXNoKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcGF0Y2hCdWZmZXJcbiAgICAgICAgLmNyZWF0ZUluc2VydGVyQXQodGhpcy5wYXRjaC5nZXRJbnNlcnRpb25Qb2ludCgpKVxuICAgICAgICAua2VlcEJlZm9yZShiZWZvcmVOZXdsaW5lKVxuICAgICAgICAua2VlcEFmdGVyKGFmdGVyTmV3bGluZSlcbiAgICAgICAgLmluc2VydCgnXFxuJylcbiAgICAgICAgLmFwcGx5KCk7XG4gICAgfVxuXG4gICAgcGF0Y2hCdWZmZXJcbiAgICAgIC5jcmVhdGVJbnNlcnRlckF0KHRoaXMucGF0Y2guZ2V0SW5zZXJ0aW9uUG9pbnQoKSlcbiAgICAgIC5rZWVwQmVmb3JlKGJlZm9yZSlcbiAgICAgIC5rZWVwQWZ0ZXIoYWZ0ZXIpXG4gICAgICAuaW5zZXJ0UGF0Y2hCdWZmZXIoc3ViUGF0Y2hCdWZmZXIsIHtjYWxsYmFjazogbWFwID0+IG5leHRQYXRjaC51cGRhdGVNYXJrZXJzKG1hcCl9KVxuICAgICAgLmluc2VydCghYXRFbmQgPyAnXFxuJyA6ICcnKVxuICAgICAgLmFwcGx5KCk7XG5cbiAgICB0aGlzLnBhdGNoLmRlc3Ryb3lNYXJrZXJzKCk7XG4gICAgdGhpcy5wYXRjaCA9IG5leHRQYXRjaDtcbiAgICB0aGlzLmRpZENoYW5nZVJlbmRlclN0YXR1cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlLXJlbmRlci1zdGF0dXMnLCB0aGlzKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlUmVuZGVyU3RhdHVzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignY2hhbmdlLXJlbmRlci1zdGF0dXMnLCBjYWxsYmFjayk7XG4gIH1cblxuICBjbG9uZShvcHRzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXG4gICAgICBvcHRzLm9sZEZpbGUgIT09IHVuZGVmaW5lZCA/IG9wdHMub2xkRmlsZSA6IHRoaXMub2xkRmlsZSxcbiAgICAgIG9wdHMubmV3RmlsZSAhPT0gdW5kZWZpbmVkID8gb3B0cy5uZXdGaWxlIDogdGhpcy5uZXdGaWxlLFxuICAgICAgb3B0cy5wYXRjaCAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRjaCA6IHRoaXMucGF0Y2gsXG4gICAgKTtcbiAgfVxuXG4gIGdldFN0YXJ0aW5nTWFya2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRjaC5nZXRTdGFydGluZ01hcmtlcnMoKTtcbiAgfVxuXG4gIGdldEVuZGluZ01hcmtlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2guZ2V0RW5kaW5nTWFya2VycygpO1xuICB9XG5cbiAgYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMob3JpZ2luYWxCdWZmZXIsIG5leHRQYXRjaEJ1ZmZlciwgc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgbGV0IG5ld0ZpbGUgPSB0aGlzLmdldE5ld0ZpbGUoKTtcbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMucGF0Y2guZ2V0Q2hhbmdlZExpbmVDb3VudCgpID09PSBzZWxlY3RlZExpbmVTZXQuc2l6ZSAmJlxuICAgICAgICBBcnJheS5mcm9tKHNlbGVjdGVkTGluZVNldCwgcm93ID0+IHRoaXMucGF0Y2guY29udGFpbnNSb3cocm93KSkuZXZlcnkoQm9vbGVhbilcbiAgICAgICkge1xuICAgICAgICAvLyBXaG9sZSBmaWxlIGRlbGV0aW9uIHN0YWdlZC5cbiAgICAgICAgbmV3RmlsZSA9IG51bGxGaWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUGFydGlhbCBmaWxlIGRlbGV0aW9uLCB3aGljaCBiZWNvbWVzIGEgbW9kaWZpY2F0aW9uLlxuICAgICAgICBuZXdGaWxlID0gdGhpcy5nZXRPbGRGaWxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGF0Y2ggPSB0aGlzLnBhdGNoLmJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzKFxuICAgICAgb3JpZ2luYWxCdWZmZXIsXG4gICAgICBuZXh0UGF0Y2hCdWZmZXIsXG4gICAgICBzZWxlY3RlZExpbmVTZXQsXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7bmV3RmlsZSwgcGF0Y2h9KTtcbiAgfVxuXG4gIGJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMob3JpZ2luYWxCdWZmZXIsIG5leHRQYXRjaEJ1ZmZlciwgc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgY29uc3Qgbm9uTnVsbEZpbGUgPSB0aGlzLmdldE5ld0ZpbGUoKS5pc1ByZXNlbnQoKSA/IHRoaXMuZ2V0TmV3RmlsZSgpIDogdGhpcy5nZXRPbGRGaWxlKCk7XG4gICAgbGV0IG9sZEZpbGUgPSB0aGlzLmdldE5ld0ZpbGUoKTtcbiAgICBsZXQgbmV3RmlsZSA9IG5vbk51bGxGaWxlO1xuXG4gICAgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdhZGRlZCcpIHtcbiAgICAgIGlmIChcbiAgICAgICAgc2VsZWN0ZWRMaW5lU2V0LnNpemUgPT09IHRoaXMucGF0Y2guZ2V0Q2hhbmdlZExpbmVDb3VudCgpICYmXG4gICAgICAgIEFycmF5LmZyb20oc2VsZWN0ZWRMaW5lU2V0LCByb3cgPT4gdGhpcy5wYXRjaC5jb250YWluc1Jvdyhyb3cpKS5ldmVyeShCb29sZWFuKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IG5ld0ZpbGUgaXMgbnVsbCBpZiB0aGUgcGF0Y2ggaXMgYW4gYWRkaXRpb24gYmVjYXVzZSB3ZSdyZSBkZWxldGluZyB0aGUgZW50aXJlIGZpbGUgZnJvbSB0aGVcbiAgICAgICAgLy8gaW5kZXguIElmIGEgc3ltbGluayB3YXMgZGVsZXRlZCBhbmQgcmVwbGFjZWQgYnkgYSBub24tc3ltbGluayBmaWxlLCB3ZSBkb24ndCB3YW50IHRoZSBzeW1saW5rIGVudHJ5IHRvIG11Y2tcbiAgICAgICAgLy8gdXAgdGhlIHBhdGNoLlxuICAgICAgICBvbGRGaWxlID0gbm9uTnVsbEZpbGU7XG4gICAgICAgIG5ld0ZpbGUgPSBudWxsRmlsZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgaWYgKFxuICAgICAgICBzZWxlY3RlZExpbmVTZXQuc2l6ZSA9PT0gdGhpcy5wYXRjaC5nZXRDaGFuZ2VkTGluZUNvdW50KCkgJiZcbiAgICAgICAgQXJyYXkuZnJvbShzZWxlY3RlZExpbmVTZXQsIHJvdyA9PiB0aGlzLnBhdGNoLmNvbnRhaW5zUm93KHJvdykpLmV2ZXJ5KEJvb2xlYW4pXG4gICAgICApIHtcbiAgICAgICAgb2xkRmlsZSA9IG51bGxGaWxlO1xuICAgICAgICBuZXdGaWxlID0gbm9uTnVsbEZpbGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGF0Y2ggPSB0aGlzLnBhdGNoLmJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMoXG4gICAgICBvcmlnaW5hbEJ1ZmZlcixcbiAgICAgIG5leHRQYXRjaEJ1ZmZlcixcbiAgICAgIHNlbGVjdGVkTGluZVNldCxcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaH0pO1xuICB9XG5cbiAgdG9TdHJpbmdJbihidWZmZXIpIHtcbiAgICBpZiAoIXRoaXMuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNUeXBlY2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLmNsb25lKHtcbiAgICAgICAgbmV3RmlsZTogbnVsbEZpbGUsXG4gICAgICAgIHBhdGNoOiB0aGlzLmdldE9sZFN5bWxpbmsoKSA/IHRoaXMuZ2V0UGF0Y2goKS5jbG9uZSh7c3RhdHVzOiAnZGVsZXRlZCd9KSA6IHRoaXMuZ2V0UGF0Y2goKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByaWdodCA9IHRoaXMuY2xvbmUoe1xuICAgICAgICBvbGRGaWxlOiBudWxsRmlsZSxcbiAgICAgICAgcGF0Y2g6IHRoaXMuZ2V0TmV3U3ltbGluaygpID8gdGhpcy5nZXRQYXRjaCgpLmNsb25lKHtzdGF0dXM6ICdhZGRlZCd9KSA6IHRoaXMuZ2V0UGF0Y2goKSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbGVmdC50b1N0cmluZ0luKGJ1ZmZlcikgKyByaWdodC50b1N0cmluZ0luKGJ1ZmZlcik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnYWRkZWQnICYmIHRoaXMuZ2V0TmV3RmlsZSgpLmlzU3ltbGluaygpKSB7XG4gICAgICBjb25zdCBzeW1saW5rUGF0aCA9IHRoaXMuZ2V0TmV3U3ltbGluaygpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGVhZGVyU3RyaW5nKCkgKyBgQEAgLTAsMCArMSBAQFxcbiske3N5bWxpbmtQYXRofVxcblxcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZVxcbmA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnZGVsZXRlZCcgJiYgdGhpcy5nZXRPbGRGaWxlKCkuaXNTeW1saW5rKCkpIHtcbiAgICAgIGNvbnN0IHN5bWxpbmtQYXRoID0gdGhpcy5nZXRPbGRTeW1saW5rKCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIZWFkZXJTdHJpbmcoKSArIGBAQCAtMSArMCwwIEBAXFxuLSR7c3ltbGlua1BhdGh9XFxuXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlXFxuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGVhZGVyU3RyaW5nKCkgKyB0aGlzLmdldFBhdGNoKCkudG9TdHJpbmdJbihidWZmZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGRpYWdub3N0aWMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoaXMgRmlsZVBhdGNoLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdChvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5kZW50OiAwLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgbGV0IGluZGVudGF0aW9uID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmluZGVudDsgaSsrKSB7XG4gICAgICBpbmRlbnRhdGlvbiArPSAnICc7XG4gICAgfVxuXG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSBgJHtpbmRlbnRhdGlvbn0oRmlsZVBhdGNoIGA7XG4gICAgaWYgKHRoaXMuZ2V0T2xkUGF0aCgpICE9PSB0aGlzLmdldE5ld1BhdGgoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSBgb2xkUGF0aD0ke3RoaXMuZ2V0T2xkUGF0aCgpfSBuZXdQYXRoPSR7dGhpcy5nZXROZXdQYXRoKCl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSBgcGF0aD0ke3RoaXMuZ2V0UGF0aCgpfWA7XG4gICAgfVxuICAgIGluc3BlY3RTdHJpbmcgKz0gJ1xcbic7XG5cbiAgICBpbnNwZWN0U3RyaW5nICs9IHRoaXMucGF0Y2guaW5zcGVjdCh7aW5kZW50OiBvcHRpb25zLmluZGVudCArIDJ9KTtcblxuICAgIGluc3BlY3RTdHJpbmcgKz0gYCR7aW5kZW50YXRpb259KVxcbmA7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cblxuICBnZXRIZWFkZXJTdHJpbmcoKSB7XG4gICAgY29uc3QgZnJvbVBhdGggPSB0aGlzLmdldE9sZFBhdGgoKSB8fCB0aGlzLmdldE5ld1BhdGgoKTtcbiAgICBjb25zdCB0b1BhdGggPSB0aGlzLmdldE5ld1BhdGgoKSB8fCB0aGlzLmdldE9sZFBhdGgoKTtcbiAgICBsZXQgaGVhZGVyID0gYGRpZmYgLS1naXQgYS8ke3RvR2l0UGF0aFNlcChmcm9tUGF0aCl9IGIvJHt0b0dpdFBhdGhTZXAodG9QYXRoKX1gO1xuICAgIGhlYWRlciArPSAnXFxuJztcbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2FkZGVkJykge1xuICAgICAgaGVhZGVyICs9IGBuZXcgZmlsZSBtb2RlICR7dGhpcy5nZXROZXdNb2RlKCl9YDtcbiAgICAgIGhlYWRlciArPSAnXFxuJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgaGVhZGVyICs9IGBkZWxldGVkIGZpbGUgbW9kZSAke3RoaXMuZ2V0T2xkTW9kZSgpfWA7XG4gICAgICBoZWFkZXIgKz0gJ1xcbic7XG4gICAgfVxuICAgIGhlYWRlciArPSB0aGlzLmdldE9sZFBhdGgoKSA/IGAtLS0gYS8ke3RvR2l0UGF0aFNlcCh0aGlzLmdldE9sZFBhdGgoKSl9YCA6ICctLS0gL2Rldi9udWxsJztcbiAgICBoZWFkZXIgKz0gJ1xcbic7XG4gICAgaGVhZGVyICs9IHRoaXMuZ2V0TmV3UGF0aCgpID8gYCsrKyBiLyR7dG9HaXRQYXRoU2VwKHRoaXMuZ2V0TmV3UGF0aCgpKX1gIDogJysrKyAvZGV2L251bGwnO1xuICAgIGhlYWRlciArPSAnXFxuJztcbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUVBLElBQUFDLEtBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUgsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUosT0FBQTtBQUEyQyxTQUFBSyx5QkFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxDQUFBLFdBQUFBLENBQUEsR0FBQUcsQ0FBQSxHQUFBRCxDQUFBLEtBQUFGLENBQUE7QUFBQSxTQUFBSCx3QkFBQUcsQ0FBQSxFQUFBRSxDQUFBLFNBQUFBLENBQUEsSUFBQUYsQ0FBQSxJQUFBQSxDQUFBLENBQUFJLFVBQUEsU0FBQUosQ0FBQSxlQUFBQSxDQUFBLHVCQUFBQSxDQUFBLHlCQUFBQSxDQUFBLFdBQUFLLE9BQUEsRUFBQUwsQ0FBQSxRQUFBRyxDQUFBLEdBQUFKLHdCQUFBLENBQUFHLENBQUEsT0FBQUMsQ0FBQSxJQUFBQSxDQUFBLENBQUFHLEdBQUEsQ0FBQU4sQ0FBQSxVQUFBRyxDQUFBLENBQUFJLEdBQUEsQ0FBQVAsQ0FBQSxPQUFBUSxDQUFBLEtBQUFDLFNBQUEsVUFBQUMsQ0FBQSxHQUFBQyxNQUFBLENBQUFDLGNBQUEsSUFBQUQsTUFBQSxD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