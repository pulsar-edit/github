"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Hunk {
  constructor({
    oldStartRow,
    newStartRow,
    oldRowCount,
    newRowCount,
    sectionHeading,
    marker,
    regions
  }) {
    this.oldStartRow = oldStartRow;
    this.newStartRow = newStartRow;
    this.oldRowCount = oldRowCount;
    this.newRowCount = newRowCount;
    this.sectionHeading = sectionHeading;
    this.marker = marker;
    this.regions = regions;
  }
  getOldStartRow() {
    return this.oldStartRow;
  }
  getNewStartRow() {
    return this.newStartRow;
  }
  getOldRowCount() {
    return this.oldRowCount;
  }
  getNewRowCount() {
    return this.newRowCount;
  }
  getHeader() {
    return `@@ -${this.oldStartRow},${this.oldRowCount} +${this.newStartRow},${this.newRowCount} @@`;
  }
  getSectionHeading() {
    return this.sectionHeading;
  }
  getRegions() {
    return this.regions;
  }
  getChanges() {
    return this.regions.filter(change => change.isChange());
  }
  getMarker() {
    return this.marker;
  }
  getRange() {
    return this.getMarker().getRange();
  }
  getBufferRows() {
    return this.getRange().getRows();
  }
  bufferRowCount() {
    return this.getRange().getRowCount();
  }
  includesBufferRow(row) {
    return this.getRange().intersectsRow(row);
  }
  getOldRowAt(row) {
    let current = this.oldStartRow;
    for (const region of this.getRegions()) {
      if (region.includesBufferRow(row)) {
        const offset = row - region.getStartBufferRow();
        return region.when({
          unchanged: () => current + offset,
          addition: () => null,
          deletion: () => current + offset,
          nonewline: () => null
        });
      } else {
        current += region.when({
          unchanged: () => region.bufferRowCount(),
          addition: () => 0,
          deletion: () => region.bufferRowCount(),
          nonewline: () => 0
        });
      }
    }
    return null;
  }
  getNewRowAt(row) {
    let current = this.newStartRow;
    for (const region of this.getRegions()) {
      if (region.includesBufferRow(row)) {
        const offset = row - region.getStartBufferRow();
        return region.when({
          unchanged: () => current + offset,
          addition: () => current + offset,
          deletion: () => null,
          nonewline: () => null
        });
      } else {
        current += region.when({
          unchanged: () => region.bufferRowCount(),
          addition: () => region.bufferRowCount(),
          deletion: () => 0,
          nonewline: () => 0
        });
      }
    }
    return null;
  }
  getMaxLineNumberWidth() {
    return Math.max((this.oldStartRow + this.oldRowCount).toString().length, (this.newStartRow + this.newRowCount).toString().length);
  }
  changedLineCount() {
    return this.regions.filter(region => region.isChange()).reduce((count, change) => count + change.bufferRowCount(), 0);
  }
  updateMarkers(map) {
    this.marker = map.get(this.marker) || this.marker;
    for (const region of this.regions) {
      region.updateMarkers(map);
    }
  }
  destroyMarkers() {
    this.marker.destroy();
    for (const region of this.regions) {
      region.destroyMarkers();
    }
  }
  toStringIn(buffer) {
    return this.getRegions().reduce((str, region) => str + region.toStringIn(buffer), this.getHeader() + '\n');
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
    let inspectString = `${indentation}(Hunk marker=${this.marker.id}\n`;
    if (this.marker.isDestroyed()) {
      inspectString += ' [destroyed]';
    }
    if (!this.marker.isValid()) {
      inspectString += ' [invalid]';
    }
    for (const region of this.regions) {
      inspectString += region.inspect({
        indent: options.indent + 2
      });
    }
    inspectString += `${indentation})\n`;
    return inspectString;
  }
}
exports.default = Hunk;
_defineProperty(Hunk, "layerName", 'hunk');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJIdW5rIiwiY29uc3RydWN0b3IiLCJvbGRTdGFydFJvdyIsIm5ld1N0YXJ0Um93Iiwib2xkUm93Q291bnQiLCJuZXdSb3dDb3VudCIsInNlY3Rpb25IZWFkaW5nIiwibWFya2VyIiwicmVnaW9ucyIsImdldE9sZFN0YXJ0Um93IiwiZ2V0TmV3U3RhcnRSb3ciLCJnZXRPbGRSb3dDb3VudCIsImdldE5ld1Jvd0NvdW50IiwiZ2V0SGVhZGVyIiwiZ2V0U2VjdGlvbkhlYWRpbmciLCJnZXRSZWdpb25zIiwiZ2V0Q2hhbmdlcyIsImZpbHRlciIsImNoYW5nZSIsImlzQ2hhbmdlIiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJnZXRCdWZmZXJSb3dzIiwiZ2V0Um93cyIsImJ1ZmZlclJvd0NvdW50IiwiZ2V0Um93Q291bnQiLCJpbmNsdWRlc0J1ZmZlclJvdyIsInJvdyIsImludGVyc2VjdHNSb3ciLCJnZXRPbGRSb3dBdCIsImN1cnJlbnQiLCJyZWdpb24iLCJvZmZzZXQiLCJnZXRTdGFydEJ1ZmZlclJvdyIsIndoZW4iLCJ1bmNoYW5nZWQiLCJhZGRpdGlvbiIsImRlbGV0aW9uIiwibm9uZXdsaW5lIiwiZ2V0TmV3Um93QXQiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJNYXRoIiwibWF4IiwidG9TdHJpbmciLCJsZW5ndGgiLCJjaGFuZ2VkTGluZUNvdW50IiwicmVkdWNlIiwiY291bnQiLCJ1cGRhdGVNYXJrZXJzIiwibWFwIiwiZ2V0IiwiZGVzdHJveU1hcmtlcnMiLCJkZXN0cm95IiwidG9TdHJpbmdJbiIsImJ1ZmZlciIsInN0ciIsImluc3BlY3QiLCJvcHRzIiwib3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJpbmRlbnQiLCJpbmRlbnRhdGlvbiIsImkiLCJpbnNwZWN0U3RyaW5nIiwiaWQiLCJpc0Rlc3Ryb3llZCIsImlzVmFsaWQiLCJleHBvcnRzIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSJdLCJzb3VyY2VzIjpbImh1bmsuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHVuayB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAnaHVuayc7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIG9sZFN0YXJ0Um93LFxuICAgIG5ld1N0YXJ0Um93LFxuICAgIG9sZFJvd0NvdW50LFxuICAgIG5ld1Jvd0NvdW50LFxuICAgIHNlY3Rpb25IZWFkaW5nLFxuICAgIG1hcmtlcixcbiAgICByZWdpb25zLFxuICB9KSB7XG4gICAgdGhpcy5vbGRTdGFydFJvdyA9IG9sZFN0YXJ0Um93O1xuICAgIHRoaXMubmV3U3RhcnRSb3cgPSBuZXdTdGFydFJvdztcbiAgICB0aGlzLm9sZFJvd0NvdW50ID0gb2xkUm93Q291bnQ7XG4gICAgdGhpcy5uZXdSb3dDb3VudCA9IG5ld1Jvd0NvdW50O1xuICAgIHRoaXMuc2VjdGlvbkhlYWRpbmcgPSBzZWN0aW9uSGVhZGluZztcblxuICAgIHRoaXMubWFya2VyID0gbWFya2VyO1xuICAgIHRoaXMucmVnaW9ucyA9IHJlZ2lvbnM7XG4gIH1cblxuICBnZXRPbGRTdGFydFJvdygpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRTdGFydFJvdztcbiAgfVxuXG4gIGdldE5ld1N0YXJ0Um93KCkge1xuICAgIHJldHVybiB0aGlzLm5ld1N0YXJ0Um93O1xuICB9XG5cbiAgZ2V0T2xkUm93Q291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMub2xkUm93Q291bnQ7XG4gIH1cblxuICBnZXROZXdSb3dDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXdSb3dDb3VudDtcbiAgfVxuXG4gIGdldEhlYWRlcigpIHtcbiAgICByZXR1cm4gYEBAIC0ke3RoaXMub2xkU3RhcnRSb3d9LCR7dGhpcy5vbGRSb3dDb3VudH0gKyR7dGhpcy5uZXdTdGFydFJvd30sJHt0aGlzLm5ld1Jvd0NvdW50fSBAQGA7XG4gIH1cblxuICBnZXRTZWN0aW9uSGVhZGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zZWN0aW9uSGVhZGluZztcbiAgfVxuXG4gIGdldFJlZ2lvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaW9ucztcbiAgfVxuXG4gIGdldENoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaW9ucy5maWx0ZXIoY2hhbmdlID0+IGNoYW5nZS5pc0NoYW5nZSgpKTtcbiAgfVxuXG4gIGdldE1hcmtlcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICBnZXRSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpO1xuICB9XG5cbiAgZ2V0QnVmZmVyUm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZSgpLmdldFJvd3MoKTtcbiAgfVxuXG4gIGJ1ZmZlclJvd0NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFJhbmdlKCkuZ2V0Um93Q291bnQoKTtcbiAgfVxuXG4gIGluY2x1ZGVzQnVmZmVyUm93KHJvdykge1xuICAgIHJldHVybiB0aGlzLmdldFJhbmdlKCkuaW50ZXJzZWN0c1Jvdyhyb3cpO1xuICB9XG5cbiAgZ2V0T2xkUm93QXQocm93KSB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLm9sZFN0YXJ0Um93O1xuXG4gICAgZm9yIChjb25zdCByZWdpb24gb2YgdGhpcy5nZXRSZWdpb25zKCkpIHtcbiAgICAgIGlmIChyZWdpb24uaW5jbHVkZXNCdWZmZXJSb3cocm93KSkge1xuICAgICAgICBjb25zdCBvZmZzZXQgPSByb3cgLSByZWdpb24uZ2V0U3RhcnRCdWZmZXJSb3coKTtcblxuICAgICAgICByZXR1cm4gcmVnaW9uLndoZW4oe1xuICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4gY3VycmVudCArIG9mZnNldCxcbiAgICAgICAgICBhZGRpdGlvbjogKCkgPT4gbnVsbCxcbiAgICAgICAgICBkZWxldGlvbjogKCkgPT4gY3VycmVudCArIG9mZnNldCxcbiAgICAgICAgICBub25ld2xpbmU6ICgpID0+IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudCArPSByZWdpb24ud2hlbih7XG4gICAgICAgICAgdW5jaGFuZ2VkOiAoKSA9PiByZWdpb24uYnVmZmVyUm93Q291bnQoKSxcbiAgICAgICAgICBhZGRpdGlvbjogKCkgPT4gMCxcbiAgICAgICAgICBkZWxldGlvbjogKCkgPT4gcmVnaW9uLmJ1ZmZlclJvd0NvdW50KCksXG4gICAgICAgICAgbm9uZXdsaW5lOiAoKSA9PiAwLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldE5ld1Jvd0F0KHJvdykge1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5uZXdTdGFydFJvdztcblxuICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIHRoaXMuZ2V0UmVnaW9ucygpKSB7XG4gICAgICBpZiAocmVnaW9uLmluY2x1ZGVzQnVmZmVyUm93KHJvdykpIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gcm93IC0gcmVnaW9uLmdldFN0YXJ0QnVmZmVyUm93KCk7XG5cbiAgICAgICAgcmV0dXJuIHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IGN1cnJlbnQgKyBvZmZzZXQsXG4gICAgICAgICAgYWRkaXRpb246ICgpID0+IGN1cnJlbnQgKyBvZmZzZXQsXG4gICAgICAgICAgZGVsZXRpb246ICgpID0+IG51bGwsXG4gICAgICAgICAgbm9uZXdsaW5lOiAoKSA9PiBudWxsLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQgKz0gcmVnaW9uLndoZW4oe1xuICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4gcmVnaW9uLmJ1ZmZlclJvd0NvdW50KCksXG4gICAgICAgICAgYWRkaXRpb246ICgpID0+IHJlZ2lvbi5idWZmZXJSb3dDb3VudCgpLFxuICAgICAgICAgIGRlbGV0aW9uOiAoKSA9PiAwLFxuICAgICAgICAgIG5vbmV3bGluZTogKCkgPT4gMCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRNYXhMaW5lTnVtYmVyV2lkdGgoKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KFxuICAgICAgKHRoaXMub2xkU3RhcnRSb3cgKyB0aGlzLm9sZFJvd0NvdW50KS50b1N0cmluZygpLmxlbmd0aCxcbiAgICAgICh0aGlzLm5ld1N0YXJ0Um93ICsgdGhpcy5uZXdSb3dDb3VudCkudG9TdHJpbmcoKS5sZW5ndGgsXG4gICAgKTtcbiAgfVxuXG4gIGNoYW5nZWRMaW5lQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaW9uc1xuICAgICAgLmZpbHRlcihyZWdpb24gPT4gcmVnaW9uLmlzQ2hhbmdlKCkpXG4gICAgICAucmVkdWNlKChjb3VudCwgY2hhbmdlKSA9PiBjb3VudCArIGNoYW5nZS5idWZmZXJSb3dDb3VudCgpLCAwKTtcbiAgfVxuXG4gIHVwZGF0ZU1hcmtlcnMobWFwKSB7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXAuZ2V0KHRoaXMubWFya2VyKSB8fCB0aGlzLm1hcmtlcjtcbiAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiB0aGlzLnJlZ2lvbnMpIHtcbiAgICAgIHJlZ2lvbi51cGRhdGVNYXJrZXJzKG1hcCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveU1hcmtlcnMoKSB7XG4gICAgdGhpcy5tYXJrZXIuZGVzdHJveSgpO1xuICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIHRoaXMucmVnaW9ucykge1xuICAgICAgcmVnaW9uLmRlc3Ryb3lNYXJrZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgdG9TdHJpbmdJbihidWZmZXIpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWdpb25zKCkucmVkdWNlKChzdHIsIHJlZ2lvbikgPT4gc3RyICsgcmVnaW9uLnRvU3RyaW5nSW4oYnVmZmVyKSwgdGhpcy5nZXRIZWFkZXIoKSArICdcXG4nKTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbnN0cnVjdCBhIFN0cmluZyBjb250YWluaW5nIGludGVybmFsIGRpYWdub3N0aWMgaW5mb3JtYXRpb24uXG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpbnNwZWN0KG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBpbmRlbnQ6IDAsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICBsZXQgaW5kZW50YXRpb24gPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuaW5kZW50OyBpKyspIHtcbiAgICAgIGluZGVudGF0aW9uICs9ICcgJztcbiAgICB9XG5cbiAgICBsZXQgaW5zcGVjdFN0cmluZyA9IGAke2luZGVudGF0aW9ufShIdW5rIG1hcmtlcj0ke3RoaXMubWFya2VyLmlkfVxcbmA7XG4gICAgaWYgKHRoaXMubWFya2VyLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbZGVzdHJveWVkXSc7XG4gICAgfVxuICAgIGlmICghdGhpcy5tYXJrZXIuaXNWYWxpZCgpKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9ICcgW2ludmFsaWRdJztcbiAgICB9XG4gICAgZm9yIChjb25zdCByZWdpb24gb2YgdGhpcy5yZWdpb25zKSB7XG4gICAgICBpbnNwZWN0U3RyaW5nICs9IHJlZ2lvbi5pbnNwZWN0KHtpbmRlbnQ6IG9wdGlvbnMuaW5kZW50ICsgMn0pO1xuICAgIH1cbiAgICBpbnNwZWN0U3RyaW5nICs9IGAke2luZGVudGF0aW9ufSlcXG5gO1xuICAgIHJldHVybiBpbnNwZWN0U3RyaW5nO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWUsTUFBTUEsSUFBSSxDQUFDO0VBR3hCQyxXQUFXQSxDQUFDO0lBQ1ZDLFdBQVc7SUFDWEMsV0FBVztJQUNYQyxXQUFXO0lBQ1hDLFdBQVc7SUFDWEMsY0FBYztJQUNkQyxNQUFNO0lBQ05DO0VBQ0YsQ0FBQyxFQUFFO0lBQ0QsSUFBSSxDQUFDTixXQUFXLEdBQUdBLFdBQVc7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