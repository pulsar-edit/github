"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoNewline = exports.Unchanged = exports.Deletion = exports.Addition = void 0;
var _atom = require("atom");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Region {
  constructor(marker) {
    this.marker = marker;
  }
  getMarker() {
    return this.marker;
  }
  getRange() {
    return this.marker.getRange();
  }
  getStartBufferRow() {
    return this.getRange().start.row;
  }
  getEndBufferRow() {
    return this.getRange().end.row;
  }
  includesBufferRow(row) {
    return this.getRange().intersectsRow(row);
  }

  /*
   * intersectRows breaks a Region into runs of rows that are included in
   * rowSet and rows that are not. For example:
   *  @this Region        row 10-20
   *  @param rowSet       row 11, 12, 13, 17, 19
   *  @param includeGaps  true (whether the result will include gaps or not)
   *  @return an array of regions like this:
   *    (10, gap = true) (11, 12, 13, gap = false) (14, 15, 16, gap = true)
   *    (17, gap = false) (18, gap = true) (19, gap = false) (20, gap = true)
   */
  intersectRows(rowSet, includeGaps) {
    const intersections = [];
    let withinIntersection = false;
    let currentRow = this.getRange().start.row;
    let nextStartRow = currentRow;
    const finishRowRange = isGap => {
      if (isGap && !includeGaps) {
        nextStartRow = currentRow;
        return;
      }
      if (currentRow <= this.getRange().start.row) {
        return;
      }
      intersections.push({
        intersection: _atom.Range.fromObject([[nextStartRow, 0], [currentRow - 1, Infinity]]),
        gap: isGap
      });
      nextStartRow = currentRow;
    };
    while (currentRow <= this.getRange().end.row) {
      if (rowSet.has(currentRow) && !withinIntersection) {
        // One row past the end of a gap. Start of intersecting row range.
        finishRowRange(true);
        withinIntersection = true;
      } else if (!rowSet.has(currentRow) && withinIntersection) {
        // One row past the end of intersecting row range. Start of the next gap.
        finishRowRange(false);
        withinIntersection = false;
      }
      currentRow++;
    }
    finishRowRange(!withinIntersection);
    return intersections;
  }
  isAddition() {
    return false;
  }
  isDeletion() {
    return false;
  }
  isUnchanged() {
    return false;
  }
  isNoNewline() {
    return false;
  }
  getBufferRows() {
    return this.getRange().getRows();
  }
  bufferRowCount() {
    return this.getRange().getRowCount();
  }
  when(callbacks) {
    const callback = callbacks[this.constructor.name.toLowerCase()] || callbacks.default || (() => undefined);
    return callback();
  }
  updateMarkers(map) {
    this.marker = map.get(this.marker) || this.marker;
  }
  destroyMarkers() {
    this.marker.destroy();
  }
  toStringIn(buffer) {
    const raw = buffer.getTextInRange(this.getRange());
    return this.constructor.origin + raw.replace(/\r?\n/g, '$&' + this.constructor.origin) + buffer.lineEndingForRow(this.getRange().end.row);
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
    let inspectString = `${indentation}(${this.constructor.name} marker=${this.marker.id})`;
    if (this.marker.isDestroyed()) {
      inspectString += ' [destroyed]';
    }
    if (!this.marker.isValid()) {
      inspectString += ' [invalid]';
    }
    return inspectString + '\n';
  }
  isChange() {
    return true;
  }
}
class Addition extends Region {
  isAddition() {
    return true;
  }
  invertIn(nextBuffer) {
    return new Deletion(nextBuffer.markRange(this.getRange()));
  }
}
exports.Addition = Addition;
_defineProperty(Addition, "origin", '+');
_defineProperty(Addition, "layerName", 'addition');
class Deletion extends Region {
  isDeletion() {
    return true;
  }
  invertIn(nextBuffer) {
    return new Addition(nextBuffer.markRange(this.getRange()));
  }
}
exports.Deletion = Deletion;
_defineProperty(Deletion, "origin", '-');
_defineProperty(Deletion, "layerName", 'deletion');
class Unchanged extends Region {
  isUnchanged() {
    return true;
  }
  isChange() {
    return false;
  }
  invertIn(nextBuffer) {
    return new Unchanged(nextBuffer.markRange(this.getRange()));
  }
}
exports.Unchanged = Unchanged;
_defineProperty(Unchanged, "origin", ' ');
_defineProperty(Unchanged, "layerName", 'unchanged');
class NoNewline extends Region {
  isNoNewline() {
    return true;
  }
  isChange() {
    return false;
  }
  invertIn(nextBuffer) {
    return new NoNewline(nextBuffer.markRange(this.getRange()));
  }
}
exports.NoNewline = NoNewline;
_defineProperty(NoNewline, "origin", '\\');
_defineProperty(NoNewline, "layerName", 'nonewline');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWdpb24iLCJjb25zdHJ1Y3RvciIsIm1hcmtlciIsImdldE1hcmtlciIsImdldFJhbmdlIiwiZ2V0U3RhcnRCdWZmZXJSb3ciLCJzdGFydCIsInJvdyIsImdldEVuZEJ1ZmZlclJvdyIsImVuZCIsImluY2x1ZGVzQnVmZmVyUm93IiwiaW50ZXJzZWN0c1JvdyIsImludGVyc2VjdFJvd3MiLCJyb3dTZXQiLCJpbmNsdWRlR2FwcyIsImludGVyc2VjdGlvbnMiLCJ3aXRoaW5JbnRlcnNlY3Rpb24iLCJjdXJyZW50Um93IiwibmV4dFN0YXJ0Um93IiwiZmluaXNoUm93UmFuZ2UiLCJpc0dhcCIsInB1c2giLCJpbnRlcnNlY3Rpb24iLCJSYW5nZSIsImZyb21PYmplY3QiLCJJbmZpbml0eSIsImdhcCIsImhhcyIsImlzQWRkaXRpb24iLCJpc0RlbGV0aW9uIiwiaXNVbmNoYW5nZWQiLCJpc05vTmV3bGluZSIsImdldEJ1ZmZlclJvd3MiLCJnZXRSb3dzIiwiYnVmZmVyUm93Q291bnQiLCJnZXRSb3dDb3VudCIsIndoZW4iLCJjYWxsYmFja3MiLCJjYWxsYmFjayIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsImRlZmF1bHQiLCJ1bmRlZmluZWQiLCJ1cGRhdGVNYXJrZXJzIiwibWFwIiwiZ2V0IiwiZGVzdHJveU1hcmtlcnMiLCJkZXN0cm95IiwidG9TdHJpbmdJbiIsImJ1ZmZlciIsInJhdyIsImdldFRleHRJblJhbmdlIiwib3JpZ2luIiwicmVwbGFjZSIsImxpbmVFbmRpbmdGb3JSb3ciLCJpbnNwZWN0Iiwib3B0cyIsIm9wdGlvbnMiLCJpbmRlbnQiLCJpbmRlbnRhdGlvbiIsImkiLCJpbnNwZWN0U3RyaW5nIiwiaWQiLCJpc0Rlc3Ryb3llZCIsImlzVmFsaWQiLCJpc0NoYW5nZSIsIkFkZGl0aW9uIiwiaW52ZXJ0SW4iLCJuZXh0QnVmZmVyIiwiRGVsZXRpb24iLCJtYXJrUmFuZ2UiLCJVbmNoYW5nZWQiLCJOb05ld2xpbmUiXSwic291cmNlcyI6WyJyZWdpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSc7XG5cbmNsYXNzIFJlZ2lvbiB7XG4gIGNvbnN0cnVjdG9yKG1hcmtlcikge1xuICAgIHRoaXMubWFya2VyID0gbWFya2VyO1xuICB9XG5cbiAgZ2V0TWFya2VyKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcjtcbiAgfVxuXG4gIGdldFJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0U3RhcnRCdWZmZXJSb3coKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5zdGFydC5yb3c7XG4gIH1cblxuICBnZXRFbmRCdWZmZXJSb3coKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5lbmQucm93O1xuICB9XG5cbiAgaW5jbHVkZXNCdWZmZXJSb3cocm93KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5pbnRlcnNlY3RzUm93KHJvdyk7XG4gIH1cblxuICAvKlxuICAgKiBpbnRlcnNlY3RSb3dzIGJyZWFrcyBhIFJlZ2lvbiBpbnRvIHJ1bnMgb2Ygcm93cyB0aGF0IGFyZSBpbmNsdWRlZCBpblxuICAgKiByb3dTZXQgYW5kIHJvd3MgdGhhdCBhcmUgbm90LiBGb3IgZXhhbXBsZTpcbiAgICogIEB0aGlzIFJlZ2lvbiAgICAgICAgcm93IDEwLTIwXG4gICAqICBAcGFyYW0gcm93U2V0ICAgICAgIHJvdyAxMSwgMTIsIDEzLCAxNywgMTlcbiAgICogIEBwYXJhbSBpbmNsdWRlR2FwcyAgdHJ1ZSAod2hldGhlciB0aGUgcmVzdWx0IHdpbGwgaW5jbHVkZSBnYXBzIG9yIG5vdClcbiAgICogIEByZXR1cm4gYW4gYXJyYXkgb2YgcmVnaW9ucyBsaWtlIHRoaXM6XG4gICAqICAgICgxMCwgZ2FwID0gdHJ1ZSkgKDExLCAxMiwgMTMsIGdhcCA9IGZhbHNlKSAoMTQsIDE1LCAxNiwgZ2FwID0gdHJ1ZSlcbiAgICogICAgKDE3LCBnYXAgPSBmYWxzZSkgKDE4LCBnYXAgPSB0cnVlKSAoMTksIGdhcCA9IGZhbHNlKSAoMjAsIGdhcCA9IHRydWUpXG4gICAqL1xuICBpbnRlcnNlY3RSb3dzKHJvd1NldCwgaW5jbHVkZUdhcHMpIHtcbiAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gW107XG4gICAgbGV0IHdpdGhpbkludGVyc2VjdGlvbiA9IGZhbHNlO1xuXG4gICAgbGV0IGN1cnJlbnRSb3cgPSB0aGlzLmdldFJhbmdlKCkuc3RhcnQucm93O1xuICAgIGxldCBuZXh0U3RhcnRSb3cgPSBjdXJyZW50Um93O1xuXG4gICAgY29uc3QgZmluaXNoUm93UmFuZ2UgPSBpc0dhcCA9PiB7XG4gICAgICBpZiAoaXNHYXAgJiYgIWluY2x1ZGVHYXBzKSB7XG4gICAgICAgIG5leHRTdGFydFJvdyA9IGN1cnJlbnRSb3c7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRSb3cgPD0gdGhpcy5nZXRSYW5nZSgpLnN0YXJ0LnJvdykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGludGVyc2VjdGlvbnMucHVzaCh7XG4gICAgICAgIGludGVyc2VjdGlvbjogUmFuZ2UuZnJvbU9iamVjdChbW25leHRTdGFydFJvdywgMF0sIFtjdXJyZW50Um93IC0gMSwgSW5maW5pdHldXSksXG4gICAgICAgIGdhcDogaXNHYXAsXG4gICAgICB9KTtcblxuICAgICAgbmV4dFN0YXJ0Um93ID0gY3VycmVudFJvdztcbiAgICB9O1xuXG4gICAgd2hpbGUgKGN1cnJlbnRSb3cgPD0gdGhpcy5nZXRSYW5nZSgpLmVuZC5yb3cpIHtcbiAgICAgIGlmIChyb3dTZXQuaGFzKGN1cnJlbnRSb3cpICYmICF3aXRoaW5JbnRlcnNlY3Rpb24pIHtcbiAgICAgICAgLy8gT25lIHJvdyBwYXN0IHRoZSBlbmQgb2YgYSBnYXAuIFN0YXJ0IG9mIGludGVyc2VjdGluZyByb3cgcmFuZ2UuXG4gICAgICAgIGZpbmlzaFJvd1JhbmdlKHRydWUpO1xuICAgICAgICB3aXRoaW5JbnRlcnNlY3Rpb24gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICghcm93U2V0LmhhcyhjdXJyZW50Um93KSAmJiB3aXRoaW5JbnRlcnNlY3Rpb24pIHtcbiAgICAgICAgLy8gT25lIHJvdyBwYXN0IHRoZSBlbmQgb2YgaW50ZXJzZWN0aW5nIHJvdyByYW5nZS4gU3RhcnQgb2YgdGhlIG5leHQgZ2FwLlxuICAgICAgICBmaW5pc2hSb3dSYW5nZShmYWxzZSk7XG4gICAgICAgIHdpdGhpbkludGVyc2VjdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50Um93Kys7XG4gICAgfVxuXG4gICAgZmluaXNoUm93UmFuZ2UoIXdpdGhpbkludGVyc2VjdGlvbik7XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIH1cblxuICBpc0FkZGl0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGVsZXRpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNVbmNoYW5nZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNOb05ld2xpbmUoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0QnVmZmVyUm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZSgpLmdldFJvd3MoKTtcbiAgfVxuXG4gIGJ1ZmZlclJvd0NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJhbmdlKCkuZ2V0Um93Q291bnQoKTtcbiAgfVxuXG4gIHdoZW4oY2FsbGJhY2tzKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSBjYWxsYmFja3NbdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLnRvTG93ZXJDYXNlKCldIHx8IGNhbGxiYWNrcy5kZWZhdWx0IHx8ICgoKSA9PiB1bmRlZmluZWQpO1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgdXBkYXRlTWFya2VycyhtYXApIHtcbiAgICB0aGlzLm1hcmtlciA9IG1hcC5nZXQodGhpcy5tYXJrZXIpIHx8IHRoaXMubWFya2VyO1xuICB9XG5cbiAgZGVzdHJveU1hcmtlcnMoKSB7XG4gICAgdGhpcy5tYXJrZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgdG9TdHJpbmdJbihidWZmZXIpIHtcbiAgICBjb25zdCByYXcgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UodGhpcy5nZXRSYW5nZSgpKTtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5vcmlnaW4gKyByYXcucmVwbGFjZSgvXFxyP1xcbi9nLCAnJCYnICsgdGhpcy5jb25zdHJ1Y3Rvci5vcmlnaW4pICtcbiAgICAgIGJ1ZmZlci5saW5lRW5kaW5nRm9yUm93KHRoaXMuZ2V0UmFuZ2UoKS5lbmQucm93KTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGludGVybmFsIGRpYWdub3N0aWMgaW5mb3JtYXRpb24uXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpbmRlbnQ6IDAsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICBsZXQgaW5kZW50YXRpb24gPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuaW5kZW50OyBpKyspIHtcbiAgICAgIGluZGVudGF0aW9uICs9ICcgJztcbiAgICB9XG5cbiAgICBsZXQgaW5zcGVjdFN0cmluZyA9IGAke2luZGVudGF0aW9ufSgke3RoaXMuY29uc3RydWN0b3IubmFtZX0gbWFya2VyPSR7dGhpcy5tYXJrZXIuaWR9KWA7XG4gICAgaWYgKHRoaXMubWFya2VyLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbZGVzdHJveWVkXSc7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXJrZXIuaXNWYWxpZCgpKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9ICcgW2ludmFsaWRdJztcbiAgICB9XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmcgKyAnXFxuJztcbiAgfVxuXG4gIGlzQ2hhbmdlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBZGRpdGlvbiBleHRlbmRzIFJlZ2lvbiB7XG4gIHN0YXRpYyBvcmlnaW4gPSAnKyc7XG5cbiAgc3RhdGljIGxheWVyTmFtZSA9ICdhZGRpdGlvbic7XG5cbiAgaXNBZGRpdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGludmVydEluKG5leHRCdWZmZXIpIHtcbiAgICByZXR1cm4gbmV3IERlbGV0aW9uKG5leHRCdWZmZXIubWFya1JhbmdlKHRoaXMuZ2V0UmFuZ2UoKSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWxldGlvbiBleHRlbmRzIFJlZ2lvbiB7XG4gIHN0YXRpYyBvcmlnaW4gPSAnLSc7XG5cbiAgc3RhdGljIGxheWVyTmFtZSA9ICdkZWxldGlvbic7XG5cbiAgaXNEZWxldGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGludmVydEluKG5leHRCdWZmZXIpIHtcbiAgICByZXR1cm4gbmV3IEFkZGl0aW9uKG5leHRCdWZmZXIubWFya1JhbmdlKHRoaXMuZ2V0UmFuZ2UoKSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmNoYW5nZWQgZXh0ZW5kcyBSZWdpb24ge1xuICBzdGF0aWMgb3JpZ2luID0gJyAnO1xuXG4gIHN0YXRpYyBsYXllck5hbWUgPSAndW5jaGFuZ2VkJztcblxuICBpc1VuY2hhbmdlZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzQ2hhbmdlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGludmVydEluKG5leHRCdWZmZXIpIHtcbiAgICByZXR1cm4gbmV3IFVuY2hhbmdlZChuZXh0QnVmZmVyLm1hcmtSYW5nZSh0aGlzLmdldFJhbmdlKCkpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9OZXdsaW5lIGV4dGVuZHMgUmVnaW9uIHtcbiAgc3RhdGljIG9yaWdpbiA9ICdcXFxcJztcblxuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ25vbmV3bGluZSc7XG5cbiAgaXNOb05ld2xpbmUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc0NoYW5nZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpbnZlcnRJbihuZXh0QnVmZmVyKSB7XG4gICAgcmV0dXJuIG5ldyBOb05ld2xpbmUobmV4dEJ1ZmZlci5tYXJrUmFuZ2UodGhpcy5nZXRSYW5nZSgpKSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFBMkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUUzQixNQUFNQSxNQUFNLENBQUM7RUFDWEMsV0FBVyxDQUFDQyxNQUFNLEVBQUU7SUFDbEIsSUFBSSxDQUFDQSxNQUFNLEdBQUdBLE1BQU07RUFDdEI7RUFFQUMsU0FBUyxHQUFHO0lBQ1YsT0FBTyxJQUFJLENBQUNELE1BQU07RUFDcEI7RUFFQUUsUUFBUSxHQUFHO0lBQ1QsT0FBTyxJQUFJLENBQUNGLE1BQU0sQ0FBQ0UsUUFBUSxFQUFFO0VBQy9CO0VBRUFDLGlCQUFpQixHQUFHO0lBQ2xCLE9BQU8sSUFBSSxDQUFDRCxRQUFRLEVBQUUsQ0FBQ0UsS0FBSyxDQUFDQyxHQUFHO0VBQ2xDO0VBRUFDLGVBQWUsR0FBRztJQUNoQixPQUFPLElBQUksQ0FBQ0osUUFBUSxFQUFFLENBQUNLLEdBQUcsQ0FBQ0YsR0FBRztFQUNoQztFQUVBRyxpQkFBaUIsQ0FBQ0gsR0FBRyxFQUFFO0lBQ3JCLE9BQU8sSUFBSSxDQUFDSCxRQUFRLEVBQUUsQ0FBQ08sYUFBYSxDQUFDSixHQUFHLENBQUM7RUFDM0M7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDRUssYUFBYSxDQUFDQyxNQUFNLEVBQUVDLFdBQVcsRUFBRTtJQUNqQyxNQUFNQyxhQUFhLEdBQUcsRUFBRTtJQUN4QixJQUFJQyxr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