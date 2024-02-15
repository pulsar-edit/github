"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WholeFileDiscardHistory = exports.PartialFileDiscardHistory = void 0;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class PartialFileDiscardHistory {
  constructor(maxHistoryLength) {
    this.blobHistoryByFilePath = {};
    this.maxHistoryLength = maxHistoryLength || 60;
  }
  getHistoryForPath(filePath) {
    const history = this.blobHistoryByFilePath[filePath];
    if (history) {
      return history;
    } else {
      this.setHistoryForPath(filePath, []);
      return this.blobHistoryByFilePath[filePath];
    }
  }
  setHistoryForPath(filePath, history) {
    this.blobHistoryByFilePath[filePath] = history;
  }
  getHistory() {
    return this.blobHistoryByFilePath;
  }
  setHistory(history) {
    this.blobHistoryByFilePath = history;
  }
  popHistoryForPath(filePath) {
    return this.getHistoryForPath(filePath).pop();
  }
  addHistory(filePath, snapshots) {
    const history = this.getHistoryForPath(filePath);
    history.push(snapshots);
    if (history.length >= this.maxHistoryLength) {
      this.setHistoryForPath(filePath, history.slice(Math.ceil(this.maxHistoryLength / 2)));
    }
  }
  getLastSnapshotsForPath(filePath) {
    const history = this.getHistoryForPath(filePath);
    const snapshots = history[history.length - 1];
    if (!snapshots) {
      return null;
    }
    return _objectSpread({
      filePath
    }, snapshots);
  }
  clearHistoryForPath(filePath) {
    this.setHistoryForPath(filePath, []);
  }
}
exports.PartialFileDiscardHistory = PartialFileDiscardHistory;
class WholeFileDiscardHistory {
  constructor(maxHistoryLength) {
    this.blobHistory = [];
    this.maxHistoryLength = maxHistoryLength || 60;
  }
  getHistory() {
    return this.blobHistory;
  }
  setHistory(history) {
    this.blobHistory = history;
  }
  popHistory() {
    return this.getHistory().pop();
  }
  addHistory(snapshotsByPath) {
    const history = this.getHistory();
    history.push(snapshotsByPath);
    if (history.length >= this.maxHistoryLength) {
      this.setHistory(history.slice(Math.ceil(this.maxHistoryLength / 2)));
    }
  }
  getLastSnapshots() {
    const history = this.getHistory();
    const snapshotsByPath = history[history.length - 1] || {};
    return Object.keys(snapshotsByPath).map(p => {
      return _objectSpread({
        filePath: p
      }, snapshotsByPath[p]);
    });
  }
  clearHistory() {
    this.setHistory([]);
  }
}
exports.WholeFileDiscardHistory = WholeFileDiscardHistory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYXJ0aWFsRmlsZURpc2NhcmRIaXN0b3J5IiwiY29uc3RydWN0b3IiLCJtYXhIaXN0b3J5TGVuZ3RoIiwiYmxvYkhpc3RvcnlCeUZpbGVQYXRoIiwiZ2V0SGlzdG9yeUZvclBhdGgiLCJmaWxlUGF0aCIsImhpc3RvcnkiLCJzZXRIaXN0b3J5Rm9yUGF0aCIsImdldEhpc3RvcnkiLCJzZXRIaXN0b3J5IiwicG9wSGlzdG9yeUZvclBhdGgiLCJwb3AiLCJhZGRIaXN0b3J5Iiwic25hcHNob3RzIiwicHVzaCIsImxlbmd0aCIsInNsaWNlIiwiTWF0aCIsImNlaWwiLCJnZXRMYXN0U25hcHNob3RzRm9yUGF0aCIsIl9vYmplY3RTcHJlYWQiLCJjbGVhckhpc3RvcnlGb3JQYXRoIiwiZXhwb3J0cyIsIldob2xlRmlsZURpc2NhcmRIaXN0b3J5IiwiYmxvYkhpc3RvcnkiLCJwb3BIaXN0b3J5Iiwic25hcHNob3RzQnlQYXRoIiwiZ2V0TGFzdFNuYXBzaG90cyIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJwIiwiY2xlYXJIaXN0b3J5Il0sInNvdXJjZXMiOlsiZGlzY2FyZC1oaXN0b3J5LXN0b3Jlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUGFydGlhbEZpbGVEaXNjYXJkSGlzdG9yeSB7XG4gIGNvbnN0cnVjdG9yKG1heEhpc3RvcnlMZW5ndGgpIHtcbiAgICB0aGlzLmJsb2JIaXN0b3J5QnlGaWxlUGF0aCA9IHt9O1xuICAgIHRoaXMubWF4SGlzdG9yeUxlbmd0aCA9IG1heEhpc3RvcnlMZW5ndGggfHwgNjA7XG4gIH1cblxuICBnZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmJsb2JIaXN0b3J5QnlGaWxlUGF0aFtmaWxlUGF0aF07XG4gICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgIHJldHVybiBoaXN0b3J5O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoLCBbXSk7XG4gICAgICByZXR1cm4gdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGhbZmlsZVBhdGhdO1xuICAgIH1cbiAgfVxuXG4gIHNldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoLCBoaXN0b3J5KSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGhbZmlsZVBhdGhdID0gaGlzdG9yeTtcbiAgfVxuXG4gIGdldEhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvYkhpc3RvcnlCeUZpbGVQYXRoO1xuICB9XG5cbiAgc2V0SGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGggPSBoaXN0b3J5O1xuICB9XG5cbiAgcG9wSGlzdG9yeUZvclBhdGgoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCkucG9wKCk7XG4gIH1cblxuICBhZGRIaXN0b3J5KGZpbGVQYXRoLCBzbmFwc2hvdHMpIHtcbiAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5nZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCk7XG4gICAgaGlzdG9yeS5wdXNoKHNuYXBzaG90cyk7XG4gICAgaWYgKGhpc3RvcnkubGVuZ3RoID49IHRoaXMubWF4SGlzdG9yeUxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCwgaGlzdG9yeS5zbGljZShNYXRoLmNlaWwodGhpcy5tYXhIaXN0b3J5TGVuZ3RoIC8gMikpKTtcbiAgICB9XG4gIH1cblxuICBnZXRMYXN0U25hcHNob3RzRm9yUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoKTtcbiAgICBjb25zdCBzbmFwc2hvdHMgPSBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV07XG4gICAgaWYgKCFzbmFwc2hvdHMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4ge2ZpbGVQYXRoLCAuLi5zbmFwc2hvdHN9O1xuICB9XG5cbiAgY2xlYXJIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCkge1xuICAgIHRoaXMuc2V0SGlzdG9yeUZvclBhdGgoZmlsZVBhdGgsIFtdKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2hvbGVGaWxlRGlzY2FyZEhpc3Rvcnkge1xuICBjb25zdHJ1Y3RvcihtYXhIaXN0b3J5TGVuZ3RoKSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeSA9IFtdO1xuICAgIHRoaXMubWF4SGlzdG9yeUxlbmd0aCA9IG1heEhpc3RvcnlMZW5ndGggfHwgNjA7XG4gIH1cblxuICBnZXRIaXN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmJsb2JIaXN0b3J5O1xuICB9XG5cbiAgc2V0SGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeSA9IGhpc3Rvcnk7XG4gIH1cblxuICBwb3BIaXN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5wb3AoKTtcbiAgfVxuXG4gIGFkZEhpc3Rvcnkoc25hcHNob3RzQnlQYXRoKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuZ2V0SGlzdG9yeSgpO1xuICAgIGhpc3RvcnkucHVzaChzbmFwc2hvdHNCeVBhdGgpO1xuICAgIGlmIChoaXN0b3J5Lmxlbmd0aCA+PSB0aGlzLm1heEhpc3RvcnlMZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0SGlzdG9yeShoaXN0b3J5LnNsaWNlKE1hdGguY2VpbCh0aGlzLm1heEhpc3RvcnlMZW5ndGggLyAyKSkpO1xuICAgIH1cbiAgfVxuXG4gIGdldExhc3RTbmFwc2hvdHMoKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuZ2V0SGlzdG9yeSgpO1xuICAgIGNvbnN0IHNuYXBzaG90c0J5UGF0aCA9IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXSB8fCB7fTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc25hcHNob3RzQnlQYXRoKS5tYXAocCA9PiB7XG4gICAgICByZXR1cm4ge2ZpbGVQYXRoOiBwLCAuLi5zbmFwc2hvdHNCeVBhdGhbcF19O1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJIaXN0b3J5KCkge1xuICAgIHRoaXMuc2V0SGlzdG9yeShbXSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBTyxNQUFNQSx5QkFBeUIsQ0FBQztFQUNyQ0MsV0FBV0EsQ0FBQ0MsZ0JBQWdCLEVBQUU7SUFDNUIsSUFBSSxDQUFDQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDRCxnQkFBZ0IsR0FBR0EsZ0JBQWdCLElBQUksRUFBRTtFQUNoRDtFQUVBRSxpQkFBaUJBLENBQUNDLFFBQVEsRUFBRTtJQUMxQixNQUFNQyxPQUFPLEdBQUcsSUFBSSxDQUFDSCxxQkFBcUIsQ0FBQ0UsUUFBUSxDQUFDO0lBQ3BELElBQUlDLE9BQU8sRUFBRTtNQUNYLE9BQU9BLE9BQU87SUFDaEIsQ0FBQyxNQUFNO01BQ0wsSUFBSSxDQUFDQyxpQkFBaUIsQ0FBQ0YsUUFBUSxFQUFFLEVBQUUsQ0FBQztNQUNwQyxPQUFPLElBQUksQ0FBQ0YscUJBQXFCLENBQUNFLFFBQVEsQ0FBQztJQUM3QztFQUNGO0VBRUFFLGlCQUFpQkEsQ0FBQ0YsUUFBUSxFQUFFQyxPQUFPLEVBQUU7SUFDbkMsSUFBSSxDQUFDSCxxQkFBcUIsQ0FBQ0UsUUFBUSxDQUFDLEdBQUdDLE9BQU87RUFDaEQ7RUFFQUUsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUNMLHFCQUFxQjtFQUNuQztFQUVBTSxVQUFVQSxDQUFDSCxPQUFPLEVBQUU7SUFDbEIsSUFBSSxDQUFDSCxxQkFBcUIsR0FBR0csT0FBTztFQUN0QztFQUVBSSxpQkFBaUJBLENBQUNMLFFBQVEsRUFBRTtJQUMxQixPQUFPLElBQUksQ0FBQ0QsaUJBQWlCLENBQUNDLFFBQVEsQ0FBQyxDQUFDTSxHQUFHLENBQUMsQ0FBQztFQUMvQztFQUVBQyxVQUFVQSxDQUFDUCxRQUFRLEVBQUVRLFNBQVMsRUFBRTtJQUM5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