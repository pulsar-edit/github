"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoNewline = exports.Unchanged = exports.Deletion = exports.Addition = void 0;

var _atom = require("atom");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcGF0Y2gvcmVnaW9uLmpzIl0sIm5hbWVzIjpbIlJlZ2lvbiIsImNvbnN0cnVjdG9yIiwibWFya2VyIiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJnZXRTdGFydEJ1ZmZlclJvdyIsInN0YXJ0Iiwicm93IiwiZ2V0RW5kQnVmZmVyUm93IiwiZW5kIiwiaW5jbHVkZXNCdWZmZXJSb3ciLCJpbnRlcnNlY3RzUm93IiwiaW50ZXJzZWN0Um93cyIsInJvd1NldCIsImluY2x1ZGVHYXBzIiwiaW50ZXJzZWN0aW9ucyIsIndpdGhpbkludGVyc2VjdGlvbiIsImN1cnJlbnRSb3ciLCJuZXh0U3RhcnRSb3ciLCJmaW5pc2hSb3dSYW5nZSIsImlzR2FwIiwicHVzaCIsImludGVyc2VjdGlvbiIsIlJhbmdlIiwiZnJvbU9iamVjdCIsIkluZmluaXR5IiwiZ2FwIiwiaGFzIiwiaXNBZGRpdGlvbiIsImlzRGVsZXRpb24iLCJpc1VuY2hhbmdlZCIsImlzTm9OZXdsaW5lIiwiZ2V0QnVmZmVyUm93cyIsImdldFJvd3MiLCJidWZmZXJSb3dDb3VudCIsImdldFJvd0NvdW50Iiwid2hlbiIsImNhbGxiYWNrcyIsImNhbGxiYWNrIiwibmFtZSIsInRvTG93ZXJDYXNlIiwiZGVmYXVsdCIsInVuZGVmaW5lZCIsInVwZGF0ZU1hcmtlcnMiLCJtYXAiLCJnZXQiLCJkZXN0cm95TWFya2VycyIsImRlc3Ryb3kiLCJ0b1N0cmluZ0luIiwiYnVmZmVyIiwicmF3IiwiZ2V0VGV4dEluUmFuZ2UiLCJvcmlnaW4iLCJyZXBsYWNlIiwibGluZUVuZGluZ0ZvclJvdyIsImluc3BlY3QiLCJvcHRzIiwib3B0aW9ucyIsImluZGVudCIsImluZGVudGF0aW9uIiwiaSIsImluc3BlY3RTdHJpbmciLCJpZCIsImlzRGVzdHJveWVkIiwiaXNWYWxpZCIsImlzQ2hhbmdlIiwiQWRkaXRpb24iLCJpbnZlcnRJbiIsIm5leHRCdWZmZXIiLCJEZWxldGlvbiIsIm1hcmtS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WCxDQUFxQixLQUFLbEUsUUFBTCxFQUFyQixDQUFiLENBQVA7QUFDRDs7QUFYa0M7Ozs7Z0JBQXhCaUUsUSxZQUNLLEc7O2dCQURMQSxRLGVBR1EsVTs7QUFXZCxNQUFNRSxTQUFOLFNBQXdCdkUsTUFBeEIsQ0FBK0I7QUFLcEM4QixFQUFBQSxXQUFXLEdBQUc7QUFDWixXQUFPLElBQVA7QUFDRDs7QUFFRG1DLEVBQUFBLFFBQVEsR0FBRztBQUNULFdBQU8sS0FBUDtBQUNEOztBQUVERSxFQUFBQSxRQUFRLENBQUNDLFVBQUQsRUFBYTtBQUNuQixXQUFPLElBQUlHLFNBQUosQ0FBY0gsVUFBVSxDQUFDRSxTQUFYLENBQXFCLEtBQUtsRSxRQUFMLEVBQXJCLENBQWQsQ0FBUDtBQUNEOztBQWZtQzs7OztnQkFBekJtRSxTLFlBQ0ssRzs7Z0JBRExBLFMsZUFHUSxXOztBQWVkLE1BQU1DLFNBQU4sU0FBd0J4RSxNQUF4QixDQUErQjtBQUtwQytCLEVBQUFBLFdBQVcsR0FBRztBQUNaLFdBQU8sSUFBUDtBQUNEOztBQUVEa0MsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxLQUFQO0FBQ0Q7O0FBRURFLEVBQUFBLFFBQVEsQ0FBQ0MsVUFBRCxFQUFhO0FBQ25CLFdBQU8sSUFBSUksU0FBSixDQUFjSixVQUFVLENBQUNFLFNBQVgsQ0FBcUIsS0FBS2xFLFFBQUwsRUFBckIsQ0FBZCxDQUFQO0FBQ0Q7O0FBZm1DOzs7O2dCQUF6Qm9FLFMsWUFDSyxJOztnQkFETEEsUyxlQUdRLFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcblxuY2xhc3MgUmVnaW9uIHtcbiAgY29uc3RydWN0b3IobWFya2VyKSB7XG4gICAgdGhpcy5tYXJrZXIgPSBtYXJrZXI7XG4gIH1cblxuICBnZXRNYXJrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgZ2V0UmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFJhbmdlKCk7XG4gIH1cblxuICBnZXRTdGFydEJ1ZmZlclJvdygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZSgpLnN0YXJ0LnJvdztcbiAgfVxuXG4gIGdldEVuZEJ1ZmZlclJvdygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZSgpLmVuZC5yb3c7XG4gIH1cblxuICBpbmNsdWRlc0J1ZmZlclJvdyhyb3cpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZSgpLmludGVyc2VjdHNSb3cocm93KTtcbiAgfVxuXG4gIC8qXG4gICAqIGludGVyc2VjdFJvd3MgYnJlYWtzIGEgUmVnaW9uIGludG8gcnVucyBvZiByb3dzIHRoYXQgYXJlIGluY2x1ZGVkIGluXG4gICAqIHJvd1NldCBhbmQgcm93cyB0aGF0IGFyZSBub3QuIEZvciBleGFtcGxlOlxuICAgKiAgQHRoaXMgUmVnaW9uICAgICAgICByb3cgMTAtMjBcbiAgICogIEBwYXJhbSByb3dTZXQgICAgICAgcm93IDExLCAxMiwgMTMsIDE3LCAxOVxuICAgKiAgQHBhcmFtIGluY2x1ZGVHYXBzICB0cnVlICh3aGV0aGVyIHRoZSByZXN1bHQgd2lsbCBpbmNsdWRlIGdhcHMgb3Igbm90KVxuICAgKiAgQHJldHVybiBhbiBhcnJheSBvZiByZWdpb25zIGxpa2UgdGhpczpcbiAgICogICAgKDEwLCBnYXAgPSB0cnVlKSAoMTEsIDEyLCAxMywgZ2FwID0gZmFsc2UpICgxNCwgMTUsIDE2LCBnYXAgPSB0cnVlKVxuICAgKiAgICAoMTcsIGdhcCA9IGZhbHNlKSAoMTgsIGdhcCA9IHRydWUpICgxOSwgZ2FwID0gZmFsc2UpICgyMCwgZ2FwID0gdHJ1ZSlcbiAgICovXG4gIGludGVyc2VjdFJvd3Mocm93U2V0LCBpbmNsdWRlR2Fwcykge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSBbXTtcbiAgICBsZXQgd2l0aGluSW50ZXJzZWN0aW9uID0gZmFsc2U7XG5cbiAgICBsZXQgY3VycmVudFJvdyA9IHRoaXMuZ2V0UmFuZ2UoKS5zdGFydC5yb3c7XG4gICAgbGV0IG5leHRTdGFydFJvdyA9IGN1cnJlbnRSb3c7XG5cbiAgICBjb25zdCBmaW5pc2hSb3dSYW5nZSA9IGlzR2FwID0+IHtcbiAgICAgIGlmIChpc0dhcCAmJiAhaW5jbHVkZUdhcHMpIHtcbiAgICAgICAgbmV4dFN0YXJ0Um93ID0gY3VycmVudFJvdztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFJvdyA8PSB0aGlzLmdldFJhbmdlKCkuc3RhcnQucm93KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaW50ZXJzZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgaW50ZXJzZWN0aW9uOiBSYW5nZS5mcm9tT2JqZWN0KFtbbmV4dFN0YXJ0Um93LCAwXSwgW2N1cnJlbnRSb3cgLSAxLCBJbmZpbml0eV1dKSxcbiAgICAgICAgZ2FwOiBpc0dhcCxcbiAgICAgIH0pO1xuXG4gICAgICBuZXh0U3RhcnRSb3cgPSBjdXJyZW50Um93O1xuICAgIH07XG5cbiAgICB3aGlsZSAoY3VycmVudFJvdyA8PSB0aGlzLmdldFJhbmdlKCkuZW5kLnJvdykge1xuICAgICAgaWYgKHJvd1NldC5oYXMoY3VycmVudFJvdykgJiYgIXdpdGhpbkludGVyc2VjdGlvbikge1xuICAgICAgICAvLyBPbmUgcm93IHBhc3QgdGhlIGVuZCBvZiBhIGdhcC4gU3RhcnQgb2YgaW50ZXJzZWN0aW5nIHJvdyByYW5nZS5cbiAgICAgICAgZmluaXNoUm93UmFuZ2UodHJ1ZSk7XG4gICAgICAgIHdpdGhpbkludGVyc2VjdGlvbiA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKCFyb3dTZXQuaGFzKGN1cnJlbnRSb3cpICYmIHdpdGhpbkludGVyc2VjdGlvbikge1xuICAgICAgICAvLyBPbmUgcm93IHBhc3QgdGhlIGVuZCBvZiBpbnRlcnNlY3Rpbmcgcm93IHJhbmdlLiBTdGFydCBvZiB0aGUgbmV4dCBnYXAuXG4gICAgICAgIGZpbmlzaFJvd1JhbmdlKGZhbHNlKTtcbiAgICAgICAgd2l0aGluSW50ZXJzZWN0aW9uID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRSb3crKztcbiAgICB9XG5cbiAgICBmaW5pc2hSb3dSYW5nZSghd2l0aGluSW50ZXJzZWN0aW9uKTtcbiAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgfVxuXG4gIGlzQWRkaXRpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNEZWxldGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1VuY2hhbmdlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc05vTmV3bGluZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRCdWZmZXJSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLmdldFJhbmdlKCkuZ2V0Um93cygpO1xuICB9XG5cbiAgYnVmZmVyUm93Q291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2UoKS5nZXRSb3dDb3VudCgpO1xuICB9XG5cbiAgd2hlbihjYWxsYmFja3MpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrc1t0aGlzLmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKV0gfHwgY2FsbGJhY2tzLmRlZmF1bHQgfHwgKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICB1cGRhdGVNYXJrZXJzKG1hcCkge1xuICAgIHRoaXMubWFya2VyID0gbWFwLmdldCh0aGlzLm1hcmtlcikgfHwgdGhpcy5tYXJrZXI7XG4gIH1cblxuICBkZXN0cm95TWFya2VycygpIHtcbiAgICB0aGlzLm1hcmtlci5kZXN0cm95KCk7XG4gIH1cblxuICB0b1N0cmluZ0luKGJ1ZmZlcikge1xuICAgIGNvbnN0IHJhdyA9IGJ1ZmZlci5nZXRUZXh0SW5SYW5nZSh0aGlzLmdldFJhbmdlKCkpO1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm9yaWdpbiArIHJhdy5yZXBsYWNlKC9cXHI/XFxuL2csICckJicgKyB0aGlzLmNvbnN0cnVjdG9yLm9yaWdpbikgK1xuICAgICAgYnVmZmVyLmxpbmVFbmRpbmdGb3JSb3codGhpcy5nZXRSYW5nZSgpLmVuZC5yb3cpO1xuICB9XG5cbiAgLypcbiAgICogQ29uc3RydWN0IGEgU3RyaW5nIGNvbnRhaW5pbmcgaW50ZXJuYWwgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbi5cbiAgICovXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGluc3BlY3Qob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGluZGVudDogMCxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIGxldCBpbmRlbnRhdGlvbiA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5pbmRlbnQ7IGkrKykge1xuICAgICAgaW5kZW50YXRpb24gKz0gJyAnO1xuICAgIH1cblxuICAgIGxldCBpbnNwZWN0U3RyaW5nID0gYCR7aW5kZW50YXRpb259KCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBtYXJrZXI9JHt0aGlzLm1hcmtlci5pZH0pYDtcbiAgICBpZiAodGhpcy5tYXJrZXIuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgaW5zcGVjdFN0cmluZyArPSAnIFtkZXN0cm95ZWRdJztcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hcmtlci5pc1ZhbGlkKCkpIHtcbiAgICAgIGluc3BlY3RTdHJpbmcgKz0gJyBbaW52YWxpZF0nO1xuICAgIH1cbiAgICByZXR1cm4gaW5zcGVjdFN0cmluZyArICdcXG4nO1xuICB9XG5cbiAgaXNDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFkZGl0aW9uIGV4dGVuZHMgUmVnaW9uIHtcbiAgc3RhdGljIG9yaWdpbiA9ICcrJztcblxuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ2FkZGl0aW9uJztcblxuICBpc0FkZGl0aW9uKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW52ZXJ0SW4obmV4dEJ1ZmZlcikge1xuICAgIHJldHVybiBuZXcgRGVsZXRpb24obmV4dEJ1ZmZlci5tYXJrUmFuZ2UodGhpcy5nZXRSYW5nZSgpKSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlbGV0aW9uIGV4dGVuZHMgUmVnaW9uIHtcbiAgc3RhdGljIG9yaWdpbiA9ICctJztcblxuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ2RlbGV0aW9uJztcblxuICBpc0RlbGV0aW9uKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW52ZXJ0SW4obmV4dEJ1ZmZlcikge1xuICAgIHJldHVybiBuZXcgQWRkaXRpb24obmV4dEJ1ZmZlci5tYXJrUmFuZ2UodGhpcy5nZXRSYW5nZSgpKSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuY2hhbmdlZCBleHRlbmRzIFJlZ2lvbiB7XG4gIHN0YXRpYyBvcmlnaW4gPSAnICc7XG5cbiAgc3RhdGljIGxheWVyTmFtZSA9ICd1bmNoYW5nZWQnO1xuXG4gIGlzVW5jaGFuZ2VkKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaW52ZXJ0SW4obmV4dEJ1ZmZlcikge1xuICAgIHJldHVybiBuZXcgVW5jaGFuZ2VkKG5leHRCdWZmZXIubWFya1JhbmdlKHRoaXMuZ2V0UmFuZ2UoKSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb05ld2xpbmUgZXh0ZW5kcyBSZWdpb24ge1xuICBzdGF0aWMgb3JpZ2luID0gJ1xcXFwnO1xuXG4gIHN0YXRpYyBsYXllck5hbWUgPSAnbm9uZXdsaW5lJztcblxuICBpc05vTmV3bGluZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzQ2hhbmdlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGludmVydEluKG5leHRCdWZmZXIpIHtcbiAgICByZXR1cm4gbmV3IE5vTmV3bGluZShuZXh0QnVmZmVyLm1hcmtSYW5nZSh0aGlzLmdldFJhbmdlKCkpKTtcbiAgfVxufVxuIl19