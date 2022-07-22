"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcGF0Y2gvaHVuay5qcyJdLCJuYW1lcyI6WyJIdW5rIiwiY29uc3RydWN0b3IiLCJvbGRTdGFydFJvdyIsIm5ld1N0YXJ0Um93Iiwib2xkUm93Q291bnQiLCJuZXdSb3dDb3VudCIsInNlY3Rpb25IZWFkaW5nIiwibWFya2VyIiwicmVnaW9ucyIsImdldE9sZFN0YXJ0Um93IiwiZ2V0TmV3U3RhcnRSb3ciLCJnZXRPbGRSb3dDb3VudCIsImdldE5ld1Jvd0NvdW50IiwiZ2V0SGVhZGVyIiwiZ2V0U2VjdGlvbkhlYWRpbmciLCJnZXRSZWdpb25zIiwiZ2V0Q2hhbmdlcyIsImZpbHRlciIsImNoYW5nZSIsImlzQ2hhbmdlIiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJnZXRCdWZmZXJSb3dzIiwiZ2V0Um93cyIsImJ1ZmZlclJvd0NvdW50IiwiZ2V0Um93Q291bnQiLCJpbmNsdWRlc0J1ZmZlclJvdyIsInJvdyIsImludGVyc2VjdHNSb3ciLCJnZXRPbGRSb3dBdCIsImN1cnJlbnQiLCJyZWdpb24iLCJvZmZzZXQiLCJnZXRTdGFydEJ1ZmZlclJvdyIsIndoZW4iLCJ1bmNoYW5nZWQiLCJhZGRpdGlvbiIsImRlbGV0aW9uIiwibm9uZXdsaW5lIiwiZ2V0TmV3Um93QXQiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJNYXRoIiwibWF4IiwidG9TdHJpbmciLCJsZW5ndGgiLCJjaGFuZ2VkTGluZUNvdW50IiwicmVkdWNlIiwiY291bnQiLCJ1cGRhdGVNYXJrZXJzIiwibWFwIiwiZ2V0IiwiZGVzdHJveU1hcmtlcnMiLCJkZXN0cm95IiwidG9TdHJpbmdJbiIsImJ1ZmZlciIsInN0ciIsImluc3BlY3QiLCJvcHRzIiwib3B0aW9ucyIsImluZGVudCIsImluZGVudGF0aW9uIiwiaSIsImluc3BlY3RTdHJpbmciLCJpZCIsImlzRGVzdHJveWVkIiwiaXNWYWxpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFlLE1BQU1B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TyxDQUFDQyxJQUFJLEdBQUcsRUFBUixFQUFZO0FBQ2pCLFVBQU1DLE9BQU87QUFDWEMsTUFBQUEsTUFBTSxFQUFFO0FBREcsT0FFUkYsSUFGUSxDQUFiOztBQUtBLFFBQUlHLFdBQVcsR0FBRyxFQUFsQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdILE9BQU8sQ0FBQ0MsTUFBNUIsRUFBb0NFLENBQUMsRUFBckMsRUFBeUM7QUFDdkNELE1BQUFBLFdBQVcsSUFBSSxHQUFmO0FBQ0Q7O0FBRUQsUUFBSUUsYUFBYSxHQUFJLEdBQUVGLFdBQVksZ0JBQWUsS0FBS3JELE1BQUwsQ0FBWXdELEVBQUcsSUFBakU7O0FBQ0EsUUFBSSxLQUFLeEQsTUFBTCxDQUFZeUQsV0FBWixFQUFKLEVBQStCO0FBQzdCRixNQUFBQSxhQUFhLElBQUksY0FBakI7QUFDRDs7QUFDRCxRQUFJLENBQUMsS0FBS3ZELE1BQUwsQ0FBWTBELE9BQVosRUFBTCxFQUE0QjtBQUMxQkgsTUFBQUEsYUFBYSxJQUFJLFlBQWpCO0FBQ0Q7O0FBQ0QsU0FBSyxNQUFNL0IsTUFBWCxJQUFxQixLQUFLdkIsT0FBMUIsRUFBbUM7QUFDakNzRCxNQUFBQSxhQUFhLElBQUkvQixNQUFNLENBQUN5QixPQUFQLENBQWU7QUFBQ0csUUFBQUEsTUFBTSxFQUFFRCxPQUFPLENBQUNDLE1BQVIsR0FBaUI7QUFBMUIsT0FBZixDQUFqQjtBQUNEOztBQUNERyxJQUFBQSxhQUFhLElBQUssR0FBRUYsV0FBWSxLQUFoQztBQUNBLFdBQU9FLGFBQVA7QUFDRDs7QUF4THVCOzs7O2dCQUFMOUQsSSxlQUNBLE0iLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBIdW5rIHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdodW5rJztcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgb2xkU3RhcnRSb3csXG4gICAgbmV3U3RhcnRSb3csXG4gICAgb2xkUm93Q291bnQsXG4gICAgbmV3Um93Q291bnQsXG4gICAgc2VjdGlvbkhlYWRpbmcsXG4gICAgbWFya2VyLFxuICAgIHJlZ2lvbnMsXG4gIH0pIHtcbiAgICB0aGlzLm9sZFN0YXJ0Um93ID0gb2xkU3RhcnRSb3c7XG4gICAgdGhpcy5uZXdTdGFydFJvdyA9IG5ld1N0YXJ0Um93O1xuICAgIHRoaXMub2xkUm93Q291bnQgPSBvbGRSb3dDb3VudDtcbiAgICB0aGlzLm5ld1Jvd0NvdW50ID0gbmV3Um93Q291bnQ7XG4gICAgdGhpcy5zZWN0aW9uSGVhZGluZyA9IHNlY3Rpb25IZWFkaW5nO1xuXG4gICAgdGhpcy5tYXJrZXIgPSBtYXJrZXI7XG4gICAgdGhpcy5yZWdpb25zID0gcmVnaW9ucztcbiAgfVxuXG4gIGdldE9sZFN0YXJ0Um93KCkge1xuICAgIHJldHVybiB0aGlzLm9sZFN0YXJ0Um93O1xuICB9XG5cbiAgZ2V0TmV3U3RhcnRSb3coKSB7XG4gICAgcmV0dXJuIHRoaXMubmV3U3RhcnRSb3c7XG4gIH1cblxuICBnZXRPbGRSb3dDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5vbGRSb3dDb3VudDtcbiAgfVxuXG4gIGdldE5ld1Jvd0NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLm5ld1Jvd0NvdW50O1xuICB9XG5cbiAgZ2V0SGVhZGVyKCkge1xuICAgIHJldHVybiBgQEAgLSR7dGhpcy5vbGRTdGFydFJvd30sJHt0aGlzLm9sZFJvd0NvdW50fSArJHt0aGlzLm5ld1N0YXJ0Um93fSwke3RoaXMubmV3Um93Q291bnR9IEBAYDtcbiAgfVxuXG4gIGdldFNlY3Rpb25IZWFkaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnNlY3Rpb25IZWFkaW5nO1xuICB9XG5cbiAgZ2V0UmVnaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpb25zO1xuICB9XG5cbiAgZ2V0Q2hhbmdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpb25zLmZpbHRlcihjaGFuZ2UgPT4gY2hhbmdlLmlzQ2hhbmdlKCkpO1xuICB9XG5cbiAgZ2V0TWFya2VyKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcjtcbiAgfVxuXG4gIGdldFJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmdldE1hcmtlcigpLmdldFJhbmdlKCk7XG4gIH1cblxuICBnZXRCdWZmZXJSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFJhbmdlKCkuZ2V0Um93cygpO1xuICB9XG5cbiAgYnVmZmVyUm93Q291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5nZXRSb3dDb3VudCgpO1xuICB9XG5cbiAgaW5jbHVkZXNCdWZmZXJSb3cocm93KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5pbnRlcnNlY3RzUm93KHJvdyk7XG4gIH1cblxuICBnZXRPbGRSb3dBdChyb3cpIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMub2xkU3RhcnRSb3c7XG5cbiAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiB0aGlzLmdldFJlZ2lvbnMoKSkge1xuICAgICAgaWYgKHJlZ2lvbi5pbmNsdWRlc0J1ZmZlclJvdyhyb3cpKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHJvdyAtIHJlZ2lvbi5nZXRTdGFydEJ1ZmZlclJvdygpO1xuXG4gICAgICAgIHJldHVybiByZWdpb24ud2hlbih7XG4gICAgICAgICAgdW5jaGFuZ2VkOiAoKSA9PiBjdXJyZW50ICsgb2Zmc2V0LFxuICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiBudWxsLFxuICAgICAgICAgIGRlbGV0aW9uOiAoKSA9PiBjdXJyZW50ICsgb2Zmc2V0LFxuICAgICAgICAgIG5vbmV3bGluZTogKCkgPT4gbnVsbCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50ICs9IHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IHJlZ2lvbi5idWZmZXJSb3dDb3VudCgpLFxuICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiAwLFxuICAgICAgICAgIGRlbGV0aW9uOiAoKSA9PiByZWdpb24uYnVmZmVyUm93Q291bnQoKSxcbiAgICAgICAgICBub25ld2xpbmU6ICgpID0+IDAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0TmV3Um93QXQocm93KSB7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLm5ld1N0YXJ0Um93O1xuXG4gICAgZm9yIChjb25zdCByZWdpb24gb2YgdGhpcy5nZXRSZWdpb25zKCkpIHtcbiAgICAgIGlmIChyZWdpb24uaW5jbHVkZXNCdWZmZXJSb3cocm93KSkge1xuICAgICAgICBjb25zdCBvZmZzZXQgPSByb3cgLSByZWdpb24uZ2V0U3RhcnRCdWZmZXJSb3coKTtcblxuICAgICAgICByZXR1cm4gcmVnaW9uLndoZW4oe1xuICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4gY3VycmVudCArIG9mZnNldCxcbiAgICAgICAgICBhZGRpdGlvbjogKCkgPT4gY3VycmVudCArIG9mZnNldCxcbiAgICAgICAgICBkZWxldGlvbjogKCkgPT4gbnVsbCxcbiAgICAgICAgICBub25ld2xpbmU6ICgpID0+IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudCArPSByZWdpb24ud2hlbih7XG4gICAgICAgICAgdW5jaGFuZ2VkOiAoKSA9PiByZWdpb24uYnVmZmVyUm93Q291bnQoKSxcbiAgICAgICAgICBhZGRpdGlvbjogKCkgPT4gcmVnaW9uLmJ1ZmZlclJvd0NvdW50KCksXG4gICAgICAgICAgZGVsZXRpb246ICgpID0+IDAsXG4gICAgICAgICAgbm9uZXdsaW5lOiAoKSA9PiAwLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldE1heExpbmVOdW1iZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoXG4gICAgICAodGhpcy5vbGRTdGFydFJvdyArIHRoaXMub2xkUm93Q291bnQpLnRvU3RyaW5nKCkubGVuZ3RoLFxuICAgICAgKHRoaXMubmV3U3RhcnRSb3cgKyB0aGlzLm5ld1Jvd0NvdW50KS50b1N0cmluZygpLmxlbmd0aCxcbiAgICApO1xuICB9XG5cbiAgY2hhbmdlZExpbmVDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpb25zXG4gICAgICAuZmlsdGVyKHJlZ2lvbiA9PiByZWdpb24uaXNDaGFuZ2UoKSlcbiAgICAgIC5yZWR1Y2UoKGNvdW50LCBjaGFuZ2UpID0+IGNvdW50ICsgY2hhbmdlLmJ1ZmZlclJvd0NvdW50KCksIDApO1xuICB9XG5cbiAgdXBkYXRlTWFya2VycyhtYXApIHtcbiAgICB0aGlzLm1hcmtlciA9IG1hcC5nZXQodGhpcy5tYXJrZXIpIHx8IHRoaXMubWFya2VyO1xuICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIHRoaXMucmVnaW9ucykge1xuICAgICAgcmVnaW9uLnVwZGF0ZU1hcmtlcnMobWFwKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95TWFya2VycygpIHtcbiAgICB0aGlzLm1hcmtlci5kZXN0cm95KCk7XG4gICAgZm9yIChjb25zdCByZWdpb24gb2YgdGhpcy5yZWdpb25zKSB7XG4gICAgICByZWdpb24uZGVzdHJveU1hcmtlcnMoKTtcbiAgICB9XG4gIH1cblxuICB0b1N0cmluZ0luKGJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLmdldFJlZ2lvbnMoKS5yZWR1Y2UoKHN0ciwgcmVnaW9uKSA9PiBzdHIgKyByZWdpb24udG9TdHJpbmdJbihidWZmZXIpLCB0aGlzLmdldEhlYWRlcigpICsgJ1xcbicpO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIGxldCBpbnNwZWN0U3RyaW5nID0gYCR7aW5kZW50YXRpb259KEh1bmsgbWFya2VyPSR7dGhpcy5tYXJrZXIuaWR9XFxuYDtcbiAgICBpZiAodGhpcy5tYXJrZXIuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSAnIFtkZXN0cm95ZWRdJztcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hcmtlci5pc1ZhbGlkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbaW52YWxpZF0nO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiB0aGlzLnJlZ2lvbnMpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gcmVnaW9uLmluc3BlY3Qoe2luZGVudDogb3B0aW9ucy5pbmRlbnQgKyAyfSk7XG4gICAgfVxuICAgIGluc3BlY3RTdHJpbmcgKz0gYCR7aW5kZW50YXRpb259KVxcbmA7XG4gICAgcmV0dXJuIGluc3BlY3RTdHJpbmc7XG4gIH1cbn1cbiJdfQ==