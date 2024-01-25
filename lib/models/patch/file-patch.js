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
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2ZpbGUiLCJfcGF0Y2giLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9oZWxwZXJzIiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0Iiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJvIiwiZmlsdGVyIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiX2RlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsImRlZmluZVByb3BlcnRpZXMiLCJvYmoiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIk51bWJlciIsIkZpbGVQYXRjaCIsImNyZWF0ZU51bGwiLCJudWxsRmlsZSIsIlBhdGNoIiwiY3JlYXRlSGlkZGVuRmlsZVBhdGNoIiwib2xkRmlsZSIsIm5ld0ZpbGUiLCJtYXJrZXIiLCJyZW5kZXJTdGF0dXMiLCJzaG93Rm4iLCJjcmVhdGVIaWRkZW5QYXRjaCIsImNvbnN0cnVjdG9yIiwicGF0Y2giLCJyYXdQYXRjaGVzIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJpc1ByZXNlbnQiLCJnZXRSZW5kZXJTdGF0dXMiLCJnZXRPbGRGaWxlIiwiZ2V0TmV3RmlsZSIsImdldFJhd0NvbnRlbnRQYXRjaCIsIkVycm9yIiwiY29udGVudCIsImdldFBhdGNoIiwiZ2V0TWFya2VyIiwiZ2V0U3RhcnRSYW5nZSIsImdldE9sZFBhdGgiLCJnZXRQYXRoIiwiZ2V0TmV3UGF0aCIsImdldE9sZE1vZGUiLCJnZXRNb2RlIiwiZ2V0TmV3TW9kZSIsImdldE9sZFN5bWxpbmsiLCJnZXRTeW1saW5rIiwiZ2V0TmV3U3ltbGluayIsImdldEZpcnN0Q2hhbmdlUmFuZ2UiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJjb250YWluc1JvdyIsInJvdyIsImRpZENoYW5nZUV4ZWN1dGFibGVNb2RlIiwiaXNFeGVjdXRhYmxlIiwiaGFzU3ltbGluayIsIkJvb2xlYW4iLCJoYXNUeXBlY2hhbmdlIiwiaXNTeW1saW5rIiwiZ2V0U3RhdHVzIiwiZ2V0SHVua3MiLCJ1cGRhdGVNYXJrZXJzIiwibWFwIiwidHJpZ2dlckNvbGxhcHNlSW4iLCJwYXRjaEJ1ZmZlciIsImJlZm9yZSIsImFmdGVyIiwiaXNWaXNpYmxlIiwib2xkUGF0Y2giLCJvbGRSYW5nZSIsImdldFJhbmdlIiwiY29weSIsImluc2VydGlvblBvc2l0aW9uIiwic3RhcnQiLCJleGNsdWRlIiwiU2V0Iiwic3ViUGF0Y2hCdWZmZXIiLCJtYXJrZXJNYXAiLCJleHRyYWN0UGF0Y2hCdWZmZXIiLCJkZXN0cm95TWFya2VycyIsImlzRW1wdHkiLCJnZXRCdWZmZXIiLCJkZWxldGVSb3ciLCJwYXRjaE1hcmtlciIsIm1hcmtQb3NpdGlvbiIsImxheWVyTmFtZSIsImludmFsaWRhdGUiLCJleGNsdXNpdmUiLCJDT0xMQVBTRUQiLCJkaWRDaGFuZ2VSZW5kZXJTdGF0dXMiLCJ0cmlnZ2VyRXhwYW5kSW4iLCJuZXh0UGF0Y2giLCJzaG93IiwiYXRTdGFydCIsImdldEluc2VydGlvblBvaW50IiwiaXNFcXVhbCIsImF0RW5kIiwiZ2V0RW5kUG9zaXRpb24iLCJ3aWxsSGF2ZUNvbnRlbnQiLCJiZWZvcmVOZXdsaW5lIiwiYWZ0ZXJOZXdsaW5lIiwic2xpY2UiLCJjcmVhdGVJbnNlcnRlckF0Iiwia2VlcEJlZm9yZSIsImtlZXBBZnRlciIsImluc2VydCIsImluc2VydFBhdGNoQnVmZmVyIiwiY2FsbGJhY2siLCJlbWl0Iiwib25EaWRDaGFuZ2VSZW5kZXJTdGF0dXMiLCJvbiIsImNsb25lIiwib3B0cyIsInVuZGVmaW5lZCIsImdldFN0YXJ0aW5nTWFya2VycyIsImdldEVuZGluZ01hcmtlcnMiLCJidWlsZFN0YWdlUGF0Y2hGb3JMaW5lcyIsIm9yaWdpbmFsQnVmZmVyIiwibmV4dFBhdGNoQnVmZmVyIiwic2VsZWN0ZWRMaW5lU2V0IiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsInNpemUiLCJBcnJheSIsImZyb20iLCJldmVyeSIsImJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMiLCJub25OdWxsRmlsZSIsInRvU3RyaW5nSW4iLCJidWZmZXIiLCJsZWZ0Iiwic3RhdHVzIiwicmlnaHQiLCJzeW1saW5rUGF0aCIsImdldEhlYWRlclN0cmluZyIsImluc3BlY3QiLCJvcHRpb25zIiwiaW5kZW50IiwiaW5kZW50YXRpb24iLCJpbnNwZWN0U3RyaW5nIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJoZWFkZXIiLCJ0b0dpdFBhdGhTZXAiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiZmlsZS1wYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7bnVsbEZpbGV9IGZyb20gJy4vZmlsZSc7XG5pbXBvcnQgUGF0Y2gsIHtDT0xMQVBTRUR9IGZyb20gJy4vcGF0Y2gnO1xuaW1wb3J0IHt0b0dpdFBhdGhTZXB9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlUGF0Y2gge1xuICBzdGF0aWMgY3JlYXRlTnVsbCgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMobnVsbEZpbGUsIG51bGxGaWxlLCBQYXRjaC5jcmVhdGVOdWxsKCkpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUhpZGRlbkZpbGVQYXRjaChvbGRGaWxlLCBuZXdGaWxlLCBtYXJrZXIsIHJlbmRlclN0YXR1cywgc2hvd0ZuKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKG9sZEZpbGUsIG5ld0ZpbGUsIFBhdGNoLmNyZWF0ZUhpZGRlblBhdGNoKG1hcmtlciwgcmVuZGVyU3RhdHVzLCBzaG93Rm4pKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9sZEZpbGUsIG5ld0ZpbGUsIHBhdGNoLCByYXdQYXRjaGVzKSB7XG4gICAgdGhpcy5vbGRGaWxlID0gb2xkRmlsZTtcbiAgICB0aGlzLm5ld0ZpbGUgPSBuZXdGaWxlO1xuICAgIHRoaXMucGF0Y2ggPSBwYXRjaDtcbiAgICB0aGlzLnJhd1BhdGNoZXMgPSByYXdQYXRjaGVzO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRGaWxlLmlzUHJlc2VudCgpIHx8IHRoaXMubmV3RmlsZS5pc1ByZXNlbnQoKSB8fCB0aGlzLnBhdGNoLmlzUHJlc2VudCgpO1xuICB9XG5cbiAgZ2V0UmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoLmdldFJlbmRlclN0YXR1cygpO1xuICB9XG5cbiAgZ2V0T2xkRmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRGaWxlO1xuICB9XG5cbiAgZ2V0TmV3RmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXdGaWxlO1xuICB9XG5cbiAgZ2V0UmF3Q29udGVudFBhdGNoKCkge1xuICAgIGlmICghdGhpcy5yYXdQYXRjaGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGVQYXRjaCB3YXMgbm90IHBhcnNlZCB3aXRoIHtwZXJzZXJ2ZU9yaWdpbmFsOiB0cnVlfScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJhd1BhdGNoZXMuY29udGVudDtcbiAgfVxuXG4gIGdldFBhdGNoKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoO1xuICB9XG5cbiAgZ2V0TWFya2VyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0TWFya2VyKCk7XG4gIH1cblxuICBnZXRTdGFydFJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0U3RhcnRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0T2xkUGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRGaWxlKCkuZ2V0UGF0aCgpO1xuICB9XG5cbiAgZ2V0TmV3UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXdGaWxlKCkuZ2V0UGF0aCgpO1xuICB9XG5cbiAgZ2V0T2xkTW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRGaWxlKCkuZ2V0TW9kZSgpO1xuICB9XG5cbiAgZ2V0TmV3TW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXdGaWxlKCkuZ2V0TW9kZSgpO1xuICB9XG5cbiAgZ2V0T2xkU3ltbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPbGRGaWxlKCkuZ2V0U3ltbGluaygpO1xuICB9XG5cbiAgZ2V0TmV3U3ltbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXdGaWxlKCkuZ2V0U3ltbGluaygpO1xuICB9XG5cbiAgZ2V0Rmlyc3RDaGFuZ2VSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmdldEZpcnN0Q2hhbmdlUmFuZ2UoKTtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmdldE1heExpbmVOdW1iZXJXaWR0aCgpO1xuICB9XG5cbiAgY29udGFpbnNSb3cocm93KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGF0Y2goKS5jb250YWluc1Jvdyhyb3cpO1xuICB9XG5cbiAgZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUoKSB7XG4gICAgaWYgKCF0aGlzLm9sZEZpbGUuaXNQcmVzZW50KCkgfHwgIXRoaXMubmV3RmlsZS5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9sZEZpbGUuaXNFeGVjdXRhYmxlKCkgJiYgIXRoaXMubmV3RmlsZS5pc0V4ZWN1dGFibGUoKSB8fFxuICAgICAgIXRoaXMub2xkRmlsZS5pc0V4ZWN1dGFibGUoKSAmJiB0aGlzLm5ld0ZpbGUuaXNFeGVjdXRhYmxlKCk7XG4gIH1cblxuICBoYXNTeW1saW5rKCkge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuZ2V0T2xkRmlsZSgpLmdldFN5bWxpbmsoKSB8fCB0aGlzLmdldE5ld0ZpbGUoKS5nZXRTeW1saW5rKCkpO1xuICB9XG5cbiAgaGFzVHlwZWNoYW5nZSgpIHtcbiAgICBpZiAoIXRoaXMub2xkRmlsZS5pc1ByZXNlbnQoKSB8fCAhdGhpcy5uZXdGaWxlLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub2xkRmlsZS5pc1N5bWxpbmsoKSAmJiAhdGhpcy5uZXdGaWxlLmlzU3ltbGluaygpIHx8XG4gICAgICAhdGhpcy5vbGRGaWxlLmlzU3ltbGluaygpICYmIHRoaXMubmV3RmlsZS5pc1N5bWxpbmsoKTtcbiAgfVxuXG4gIGdldFBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T2xkUGF0aCgpIHx8IHRoaXMuZ2V0TmV3UGF0aCgpO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhdGNoKCkuZ2V0U3RhdHVzKCk7XG4gIH1cblxuICBnZXRIdW5rcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXRjaCgpLmdldEh1bmtzKCk7XG4gIH1cblxuICB1cGRhdGVNYXJrZXJzKG1hcCkge1xuICAgIHJldHVybiB0aGlzLnBhdGNoLnVwZGF0ZU1hcmtlcnMobWFwKTtcbiAgfVxuXG4gIHRyaWdnZXJDb2xsYXBzZUluKHBhdGNoQnVmZmVyLCB7YmVmb3JlLCBhZnRlcn0pIHtcbiAgICBpZiAoIXRoaXMucGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRQYXRjaCA9IHRoaXMucGF0Y2g7XG4gICAgY29uc3Qgb2xkUmFuZ2UgPSBvbGRQYXRjaC5nZXRSYW5nZSgpLmNvcHkoKTtcbiAgICBjb25zdCBpbnNlcnRpb25Qb3NpdGlvbiA9IG9sZFJhbmdlLnN0YXJ0O1xuICAgIGNvbnN0IGV4Y2x1ZGUgPSBuZXcgU2V0KFsuLi5iZWZvcmUsIC4uLmFmdGVyXSk7XG4gICAgY29uc3Qge3BhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlciwgbWFya2VyTWFwfSA9IHBhdGNoQnVmZmVyLmV4dHJhY3RQYXRjaEJ1ZmZlcihvbGRSYW5nZSwge2V4Y2x1ZGV9KTtcbiAgICBvbGRQYXRjaC5kZXN0cm95TWFya2VycygpO1xuICAgIG9sZFBhdGNoLnVwZGF0ZU1hcmtlcnMobWFya2VyTWFwKTtcblxuICAgIC8vIERlbGV0ZSB0aGUgc2VwYXJhdGluZyBuZXdsaW5lIGFmdGVyIHRoZSBjb2xsYXBzaW5nIHBhdGNoLCBpZiBhbnkuXG4gICAgaWYgKCFvbGRSYW5nZS5pc0VtcHR5KCkpIHtcbiAgICAgIHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmRlbGV0ZVJvdyhpbnNlcnRpb25Qb3NpdGlvbi5yb3cpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhdGNoTWFya2VyID0gcGF0Y2hCdWZmZXIubWFya1Bvc2l0aW9uKFxuICAgICAgUGF0Y2gubGF5ZXJOYW1lLFxuICAgICAgaW5zZXJ0aW9uUG9zaXRpb24sXG4gICAgICB7aW52YWxpZGF0ZTogJ25ldmVyJywgZXhjbHVzaXZlOiB0cnVlfSxcbiAgICApO1xuICAgIHRoaXMucGF0Y2ggPSBQYXRjaC5jcmVhdGVIaWRkZW5QYXRjaChwYXRjaE1hcmtlciwgQ09MTEFQU0VELCAoKSA9PiB7XG4gICAgICByZXR1cm4ge3BhdGNoOiBvbGRQYXRjaCwgcGF0Y2hCdWZmZXI6IHN1YlBhdGNoQnVmZmVyfTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB0cmlnZ2VyRXhwYW5kSW4ocGF0Y2hCdWZmZXIsIHtiZWZvcmUsIGFmdGVyfSkge1xuICAgIGlmICh0aGlzLnBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzVmlzaWJsZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qge3BhdGNoOiBuZXh0UGF0Y2gsIHBhdGNoQnVmZmVyOiBzdWJQYXRjaEJ1ZmZlcn0gPSB0aGlzLnBhdGNoLnNob3coKTtcbiAgICBjb25zdCBhdFN0YXJ0ID0gdGhpcy5wYXRjaC5nZXRJbnNlcnRpb25Qb2ludCgpLmlzRXF1YWwoWzAsIDBdKTtcbiAgICBjb25zdCBhdEVuZCA9IHRoaXMucGF0Y2guZ2V0SW5zZXJ0aW9uUG9pbnQoKS5pc0VxdWFsKHBhdGNoQnVmZmVyLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IHdpbGxIYXZlQ29udGVudCA9ICFzdWJQYXRjaEJ1ZmZlci5nZXRCdWZmZXIoKS5pc0VtcHR5KCk7XG5cbiAgICAvLyBUaGUgZXhwYW5kaW5nIHBhdGNoJ3MgaW5zZXJ0aW9uIHBvaW50IGlzIGp1c3QgYWZ0ZXIgdGhlIHVubWFya2VkIG5ld2xpbmUgdGhhdCBzZXBhcmF0ZXMgYWRqYWNlbnQgdmlzaWJsZVxuICAgIC8vIHBhdGNoZXM6XG4gICAgLy8gPHAwPiAnXFxuJyAqIDxwMT4gJ1xcbicgPHAyPlxuICAgIC8vXG4gICAgLy8gSWYgaXQncyB0byBiZWNvbWUgdGhlIGZpcnN0ICh2aXNpYmxlKSBwYXRjaCwgaXRzIGluc2VydGlvbiBwb2ludCBpcyBhdCBbMCwgMF06XG4gICAgLy8gKiA8cDA+ICdcXG4nIDxwMT4gJ1xcbicgPHAyPlxuICAgIC8vXG4gICAgLy8gSWYgaXQncyB0byBiZWNvbWUgdGhlIGZpbmFsICh2aXNpYmxlKSBwYXRjaCwgaXRzIGluc2VydGlvbiBwb2ludCBpcyBhdCB0aGUgYnVmZmVyIGVuZDpcbiAgICAvLyA8cDA+ICdcXG4nIDxwMT4gJ1xcbicgPHAyPiAqXG4gICAgLy9cbiAgICAvLyBJbnNlcnQgYSBuZXdsaW5lICpiZWZvcmUqIHRoZSBleHBhbmRpbmcgcGF0Y2ggaWYgd2UncmUgaW5zZXJ0aW5nIGF0IHRoZSBidWZmZXIncyBlbmQsIGJ1dCB0aGUgYnVmZmVyIGlzIG5vbi1lbXB0eVxuICAgIC8vIChzbyBpdCBpc24ndCBhbHNvIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlcikuIEluc2VydCBhIG5ld2xpbmUgKmFmdGVyKiB0aGUgZXhwYW5kaW5nIHBhdGNoIHdoZW4gaW5zZXJ0aW5nIGFueXdoZXJlXG4gICAgLy8gYnV0IHRoZSBidWZmZXIncyBlbmQuXG5cbiAgICBpZiAod2lsbEhhdmVDb250ZW50ICYmIGF0RW5kICYmICFhdFN0YXJ0KSB7XG4gICAgICBjb25zdCBiZWZvcmVOZXdsaW5lID0gW107XG4gICAgICBjb25zdCBhZnRlck5ld2xpbmUgPSBhZnRlci5zbGljZSgpO1xuXG4gICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBiZWZvcmUpIHtcbiAgICAgICAgaWYgKG1hcmtlci5nZXRSYW5nZSgpLmlzRW1wdHkoKSkge1xuICAgICAgICAgIGFmdGVyTmV3bGluZS5wdXNoKG1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmVmb3JlTmV3bGluZS5wdXNoKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcGF0Y2hCdWZmZXJcbiAgICAgICAgLmNyZWF0ZUluc2VydGVyQXQodGhpcy5wYXRjaC5nZXRJbnNlcnRpb25Qb2ludCgpKVxuICAgICAgICAua2VlcEJlZm9yZShiZWZvcmVOZXdsaW5lKVxuICAgICAgICAua2VlcEFmdGVyKGFmdGVyTmV3bGluZSlcbiAgICAgICAgLmluc2VydCgnXFxuJylcbiAgICAgICAgLmFwcGx5KCk7XG4gICAgfVxuXG4gICAgcGF0Y2hCdWZmZXJcbiAgICAgIC5jcmVhdGVJbnNlcnRlckF0KHRoaXMucGF0Y2guZ2V0SW5zZXJ0aW9uUG9pbnQoKSlcbiAgICAgIC5rZWVwQmVmb3JlKGJlZm9yZSlcbiAgICAgIC5rZWVwQWZ0ZXIoYWZ0ZXIpXG4gICAgICAuaW5zZXJ0UGF0Y2hCdWZmZXIoc3ViUGF0Y2hCdWZmZXIsIHtjYWxsYmFjazogbWFwID0+IG5leHRQYXRjaC51cGRhdGVNYXJrZXJzKG1hcCl9KVxuICAgICAgLmluc2VydCghYXRFbmQgPyAnXFxuJyA6ICcnKVxuICAgICAgLmFwcGx5KCk7XG5cbiAgICB0aGlzLnBhdGNoLmRlc3Ryb3lNYXJrZXJzKCk7XG4gICAgdGhpcy5wYXRjaCA9IG5leHRQYXRjaDtcbiAgICB0aGlzLmRpZENoYW5nZVJlbmRlclN0YXR1cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlLXJlbmRlci1zdGF0dXMnLCB0aGlzKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlUmVuZGVyU3RhdHVzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignY2hhbmdlLXJlbmRlci1zdGF0dXMnLCBjYWxsYmFjayk7XG4gIH1cblxuICBjbG9uZShvcHRzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXG4gICAgICBvcHRzLm9sZEZpbGUgIT09IHVuZGVmaW5lZCA/IG9wdHMub2xkRmlsZSA6IHRoaXMub2xkRmlsZSxcbiAgICAgIG9wdHMubmV3RmlsZSAhPT0gdW5kZWZpbmVkID8gb3B0cy5uZXdGaWxlIDogdGhpcy5uZXdGaWxlLFxuICAgICAgb3B0cy5wYXRjaCAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRjaCA6IHRoaXMucGF0Y2gsXG4gICAgKTtcbiAgfVxuXG4gIGdldFN0YXJ0aW5nTWFya2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRjaC5nZXRTdGFydGluZ01hcmtlcnMoKTtcbiAgfVxuXG4gIGdldEVuZGluZ01hcmtlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0Y2guZ2V0RW5kaW5nTWFya2VycygpO1xuICB9XG5cbiAgYnVpbGRTdGFnZVBhdGNoRm9yTGluZXMob3JpZ2luYWxCdWZmZXIsIG5leHRQYXRjaEJ1ZmZlciwgc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgbGV0IG5ld0ZpbGUgPSB0aGlzLmdldE5ld0ZpbGUoKTtcbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMucGF0Y2guZ2V0Q2hhbmdlZExpbmVDb3VudCgpID09PSBzZWxlY3RlZExpbmVTZXQuc2l6ZSAmJlxuICAgICAgICBBcnJheS5mcm9tKHNlbGVjdGVkTGluZVNldCwgcm93ID0+IHRoaXMucGF0Y2guY29udGFpbnNSb3cocm93KSkuZXZlcnkoQm9vbGVhbilcbiAgICAgICkge1xuICAgICAgICAvLyBXaG9sZSBmaWxlIGRlbGV0aW9uIHN0YWdlZC5cbiAgICAgICAgbmV3RmlsZSA9IG51bGxGaWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUGFydGlhbCBmaWxlIGRlbGV0aW9uLCB3aGljaCBiZWNvbWVzIGEgbW9kaWZpY2F0aW9uLlxuICAgICAgICBuZXdGaWxlID0gdGhpcy5nZXRPbGRGaWxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGF0Y2ggPSB0aGlzLnBhdGNoLmJ1aWxkU3RhZ2VQYXRjaEZvckxpbmVzKFxuICAgICAgb3JpZ2luYWxCdWZmZXIsXG4gICAgICBuZXh0UGF0Y2hCdWZmZXIsXG4gICAgICBzZWxlY3RlZExpbmVTZXQsXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7bmV3RmlsZSwgcGF0Y2h9KTtcbiAgfVxuXG4gIGJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMob3JpZ2luYWxCdWZmZXIsIG5leHRQYXRjaEJ1ZmZlciwgc2VsZWN0ZWRMaW5lU2V0KSB7XG4gICAgY29uc3Qgbm9uTnVsbEZpbGUgPSB0aGlzLmdldE5ld0ZpbGUoKS5pc1ByZXNlbnQoKSA/IHRoaXMuZ2V0TmV3RmlsZSgpIDogdGhpcy5nZXRPbGRGaWxlKCk7XG4gICAgbGV0IG9sZEZpbGUgPSB0aGlzLmdldE5ld0ZpbGUoKTtcbiAgICBsZXQgbmV3RmlsZSA9IG5vbk51bGxGaWxlO1xuXG4gICAgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdhZGRlZCcpIHtcbiAgICAgIGlmIChcbiAgICAgICAgc2VsZWN0ZWRMaW5lU2V0LnNpemUgPT09IHRoaXMucGF0Y2guZ2V0Q2hhbmdlZExpbmVDb3VudCgpICYmXG4gICAgICAgIEFycmF5LmZyb20oc2VsZWN0ZWRMaW5lU2V0LCByb3cgPT4gdGhpcy5wYXRjaC5jb250YWluc1Jvdyhyb3cpKS5ldmVyeShCb29sZWFuKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IG5ld0ZpbGUgaXMgbnVsbCBpZiB0aGUgcGF0Y2ggaXMgYW4gYWRkaXRpb24gYmVjYXVzZSB3ZSdyZSBkZWxldGluZyB0aGUgZW50aXJlIGZpbGUgZnJvbSB0aGVcbiAgICAgICAgLy8gaW5kZXguIElmIGEgc3ltbGluayB3YXMgZGVsZXRlZCBhbmQgcmVwbGFjZWQgYnkgYSBub24tc3ltbGluayBmaWxlLCB3ZSBkb24ndCB3YW50IHRoZSBzeW1saW5rIGVudHJ5IHRvIG11Y2tcbiAgICAgICAgLy8gdXAgdGhlIHBhdGNoLlxuICAgICAgICBvbGRGaWxlID0gbm9uTnVsbEZpbGU7XG4gICAgICAgIG5ld0ZpbGUgPSBudWxsRmlsZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgaWYgKFxuICAgICAgICBzZWxlY3RlZExpbmVTZXQuc2l6ZSA9PT0gdGhpcy5wYXRjaC5nZXRDaGFuZ2VkTGluZUNvdW50KCkgJiZcbiAgICAgICAgQXJyYXkuZnJvbShzZWxlY3RlZExpbmVTZXQsIHJvdyA9PiB0aGlzLnBhdGNoLmNvbnRhaW5zUm93KHJvdykpLmV2ZXJ5KEJvb2xlYW4pXG4gICAgICApIHtcbiAgICAgICAgb2xkRmlsZSA9IG51bGxGaWxlO1xuICAgICAgICBuZXdGaWxlID0gbm9uTnVsbEZpbGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGF0Y2ggPSB0aGlzLnBhdGNoLmJ1aWxkVW5zdGFnZVBhdGNoRm9yTGluZXMoXG4gICAgICBvcmlnaW5hbEJ1ZmZlcixcbiAgICAgIG5leHRQYXRjaEJ1ZmZlcixcbiAgICAgIHNlbGVjdGVkTGluZVNldCxcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmNsb25lKHtvbGRGaWxlLCBuZXdGaWxlLCBwYXRjaH0pO1xuICB9XG5cbiAgdG9TdHJpbmdJbihidWZmZXIpIHtcbiAgICBpZiAoIXRoaXMuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNUeXBlY2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLmNsb25lKHtcbiAgICAgICAgbmV3RmlsZTogbnVsbEZpbGUsXG4gICAgICAgIHBhdGNoOiB0aGlzLmdldE9sZFN5bWxpbmsoKSA/IHRoaXMuZ2V0UGF0Y2goKS5jbG9uZSh7c3RhdHVzOiAnZGVsZXRlZCd9KSA6IHRoaXMuZ2V0UGF0Y2goKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByaWdodCA9IHRoaXMuY2xvbmUoe1xuICAgICAgICBvbGRGaWxlOiBudWxsRmlsZSxcbiAgICAgICAgcGF0Y2g6IHRoaXMuZ2V0TmV3U3ltbGluaygpID8gdGhpcy5nZXRQYXRjaCgpLmNsb25lKHtzdGF0dXM6ICdhZGRlZCd9KSA6IHRoaXMuZ2V0UGF0Y2goKSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbGVmdC50b1N0cmluZ0luKGJ1ZmZlcikgKyByaWdodC50b1N0cmluZ0luKGJ1ZmZlcik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnYWRkZWQnICYmIHRoaXMuZ2V0TmV3RmlsZSgpLmlzU3ltbGluaygpKSB7XG4gICAgICBjb25zdCBzeW1saW5rUGF0aCA9IHRoaXMuZ2V0TmV3U3ltbGluaygpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGVhZGVyU3RyaW5nKCkgKyBgQEAgLTAsMCArMSBAQFxcbiske3N5bWxpbmtQYXRofVxcblxcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZVxcbmA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdldFN0YXR1cygpID09PSAnZGVsZXRlZCcgJiYgdGhpcy5nZXRPbGRGaWxlKCkuaXNTeW1saW5rKCkpIHtcbiAgICAgIGNvbnN0IHN5bWxpbmtQYXRoID0gdGhpcy5nZXRPbGRTeW1saW5rKCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIZWFkZXJTdHJpbmcoKSArIGBAQCAtMSArMCwwIEBAXFxuLSR7c3ltbGlua1BhdGh9XFxuXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlXFxuYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGVhZGVyU3RyaW5nKCkgKyB0aGlzLmdldFBhdGNoKCkudG9TdHJpbmdJbihidWZmZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGRpYWdub3N0aWMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoaXMgRmlsZVBhdGNoLlxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaW5zcGVjdChvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5kZW50OiAwLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgbGV0IGluZGVudGF0aW9uID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmluZGVudDsgaSsrKSB7XG4gICAgICBpbmRlbnRhdGlvbiArPSAnICc7XG4gICAgfVxuXG4gICAgbGV0IGluc3BlY3RTdHJpbmcgPSBgJHtpbmRlbnRhdGlvbn0oRmlsZVBhdGNoIGA7XG4gICAgaWYgKHRoaXMuZ2V0T2xkUGF0aCgpICE9PSB0aGlzLmdldE5ld1BhdGgoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSBgb2xkUGF0aD0ke3RoaXMuZ2V0T2xkUGF0aCgpfSBuZXdQYXRoPSR7dGhpcy5nZXROZXdQYXRoKCl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSBgcGF0aD0ke3RoaXMuZ2V0UGF0aCgpfWA7XG4gICAgfVxuICAgIGluc3BlY3RTdHJpbmcgKz0gJ1xcbic7XG5cbiAgICBpbnNwZWN0U3RyaW5nICs9IHRoaXMucGF0Y2guaW5zcGVjdCh7aW5kZW50OiBvcHRpb25zLmluZGVudCArIDJ9KTtcblxuICAgIGluc3BlY3RTdHJpbmcgKz0gYCR7aW5kZW50YXRpb259KVxcbmA7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cblxuICBnZXRIZWFkZXJTdHJpbmcoKSB7XG4gICAgY29uc3QgZnJvbVBhdGggPSB0aGlzLmdldE9sZFBhdGgoKSB8fCB0aGlzLmdldE5ld1BhdGgoKTtcbiAgICBjb25zdCB0b1BhdGggPSB0aGlzLmdldE5ld1BhdGgoKSB8fCB0aGlzLmdldE9sZFBhdGgoKTtcbiAgICBsZXQgaGVhZGVyID0gYGRpZmYgLS1naXQgYS8ke3RvR2l0UGF0aFNlcChmcm9tUGF0aCl9IGIvJHt0b0dpdFBhdGhTZXAodG9QYXRoKX1gO1xuICAgIGhlYWRlciArPSAnXFxuJztcbiAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSA9PT0gJ2FkZGVkJykge1xuICAgICAgaGVhZGVyICs9IGBuZXcgZmlsZSBtb2RlICR7dGhpcy5nZXROZXdNb2RlKCl9YDtcbiAgICAgIGhlYWRlciArPSAnXFxuJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgaGVhZGVyICs9IGBkZWxldGVkIGZpbGUgbW9kZSAke3RoaXMuZ2V0T2xkTW9kZSgpfWA7XG4gICAgICBoZWFkZXIgKz0gJ1xcbic7XG4gICAgfVxuICAgIGhlYWRlciArPSB0aGlzLmdldE9sZFBhdGgoKSA/IGAtLS0gYS8ke3RvR2l0UGF0aFNlcCh0aGlzLmdldE9sZFBhdGgoKSl9YCA6ICctLS0gL2Rldi9udWxsJztcbiAgICBoZWFkZXIgKz0gJ1xcbic7XG4gICAgaGVhZGVyICs9IHRoaXMuZ2V0TmV3UGF0aCgpID8gYCsrKyBiLyR7dG9HaXRQYXRoU2VwKHRoaXMuZ2V0TmV3UGF0aCgpKX1gIDogJysrKyAvZGV2L251bGwnO1xuICAgIGhlYWRlciArPSAnXFxuJztcbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUVBLElBQUFDLEtBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUgsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUosT0FBQTtBQUEyQyxTQUFBSyx5QkFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxDQUFBLFdBQUFBLENBQUEsR0FBQUcsQ0FBQSxHQUFBRCxDQUFBLEtBQUFGLENBQUE7QUFBQSxTQUFBSCx3QkFBQUcsQ0FBQSxFQUFBRSxDQUFBLFNBQUFBLENBQUEsSUFBQUYsQ0FBQSxJQUFBQSxDQUFBLENBQUFJLFVBQUEsU0FBQUosQ0FBQSxlQUFBQSxDQUFBLHVCQUFBQSxDQUFBLHlCQUFBQSxDQUFBLFdBQUFLLE9BQUEsRUFBQUwsQ0FBQSxRQUFBRyxDQUFBLEdBQUFKLHdCQUFBLENBQUFHLENBQUEsT0FBQUMsQ0FBQSxJQUFBQSxDQUFBLENBQUFHLEdBQUEsQ0FBQU4sQ0FBQSxVQUFBRyxDQUFBLENBQUFJLEdBQUEsQ0FBQVAsQ0FBQSxPQUFBUSxDQUFBLEtBQUFDLFNBQUEsVUFBQUMsQ0FBQSxHQUFBQyxNQUFB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