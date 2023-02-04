"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WholeFileDiscardHistory = exports.PartialFileDiscardHistory = void 0;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYXJ0aWFsRmlsZURpc2NhcmRIaXN0b3J5IiwiY29uc3RydWN0b3IiLCJtYXhIaXN0b3J5TGVuZ3RoIiwiYmxvYkhpc3RvcnlCeUZpbGVQYXRoIiwiZ2V0SGlzdG9yeUZvclBhdGgiLCJmaWxlUGF0aCIsImhpc3RvcnkiLCJzZXRIaXN0b3J5Rm9yUGF0aCIsImdldEhpc3RvcnkiLCJzZXRIaXN0b3J5IiwicG9wSGlzdG9yeUZvclBhdGgiLCJwb3AiLCJhZGRIaXN0b3J5Iiwic25hcHNob3RzIiwicHVzaCIsImxlbmd0aCIsInNsaWNlIiwiTWF0aCIsImNlaWwiLCJnZXRMYXN0U25hcHNob3RzRm9yUGF0aCIsImNsZWFySGlzdG9yeUZvclBhdGgiLCJXaG9sZUZpbGVEaXNjYXJkSGlzdG9yeSIsImJsb2JIaXN0b3J5IiwicG9wSGlzdG9yeSIsInNuYXBzaG90c0J5UGF0aCIsImdldExhc3RTbmFwc2hvdHMiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwicCIsImNsZWFySGlzdG9yeSJdLCJzb3VyY2VzIjpbImRpc2NhcmQtaGlzdG9yeS1zdG9yZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFBhcnRpYWxGaWxlRGlzY2FyZEhpc3Rvcnkge1xuICBjb25zdHJ1Y3RvcihtYXhIaXN0b3J5TGVuZ3RoKSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGggPSB7fTtcbiAgICB0aGlzLm1heEhpc3RvcnlMZW5ndGggPSBtYXhIaXN0b3J5TGVuZ3RoIHx8IDYwO1xuICB9XG5cbiAgZ2V0SGlzdG9yeUZvclBhdGgoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGhbZmlsZVBhdGhdO1xuICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCwgW10pO1xuICAgICAgcmV0dXJuIHRoaXMuYmxvYkhpc3RvcnlCeUZpbGVQYXRoW2ZpbGVQYXRoXTtcbiAgICB9XG4gIH1cblxuICBzZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCwgaGlzdG9yeSkge1xuICAgIHRoaXMuYmxvYkhpc3RvcnlCeUZpbGVQYXRoW2ZpbGVQYXRoXSA9IGhpc3Rvcnk7XG4gIH1cblxuICBnZXRIaXN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmJsb2JIaXN0b3J5QnlGaWxlUGF0aDtcbiAgfVxuXG4gIHNldEhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHRoaXMuYmxvYkhpc3RvcnlCeUZpbGVQYXRoID0gaGlzdG9yeTtcbiAgfVxuXG4gIHBvcEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SGlzdG9yeUZvclBhdGgoZmlsZVBhdGgpLnBvcCgpO1xuICB9XG5cbiAgYWRkSGlzdG9yeShmaWxlUGF0aCwgc25hcHNob3RzKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuZ2V0SGlzdG9yeUZvclBhdGgoZmlsZVBhdGgpO1xuICAgIGhpc3RvcnkucHVzaChzbmFwc2hvdHMpO1xuICAgIGlmIChoaXN0b3J5Lmxlbmd0aCA+PSB0aGlzLm1heEhpc3RvcnlMZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0SGlzdG9yeUZvclBhdGgoZmlsZVBhdGgsIGhpc3Rvcnkuc2xpY2UoTWF0aC5jZWlsKHRoaXMubWF4SGlzdG9yeUxlbmd0aCAvIDIpKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TGFzdFNuYXBzaG90c0ZvclBhdGgoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5nZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCk7XG4gICAgY29uc3Qgc25hcHNob3RzID0gaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdO1xuICAgIGlmICghc25hcHNob3RzKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHtmaWxlUGF0aCwgLi4uc25hcHNob3RzfTtcbiAgfVxuXG4gIGNsZWFySGlzdG9yeUZvclBhdGgoZmlsZVBhdGgpIHtcbiAgICB0aGlzLnNldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoLCBbXSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdob2xlRmlsZURpc2NhcmRIaXN0b3J5IHtcbiAgY29uc3RydWN0b3IobWF4SGlzdG9yeUxlbmd0aCkge1xuICAgIHRoaXMuYmxvYkhpc3RvcnkgPSBbXTtcbiAgICB0aGlzLm1heEhpc3RvcnlMZW5ndGggPSBtYXhIaXN0b3J5TGVuZ3RoIHx8IDYwO1xuICB9XG5cbiAgZ2V0SGlzdG9yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5ibG9iSGlzdG9yeTtcbiAgfVxuXG4gIHNldEhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHRoaXMuYmxvYkhpc3RvcnkgPSBoaXN0b3J5O1xuICB9XG5cbiAgcG9wSGlzdG9yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIaXN0b3J5KCkucG9wKCk7XG4gIH1cblxuICBhZGRIaXN0b3J5KHNuYXBzaG90c0J5UGF0aCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdldEhpc3RvcnkoKTtcbiAgICBoaXN0b3J5LnB1c2goc25hcHNob3RzQnlQYXRoKTtcbiAgICBpZiAoaGlzdG9yeS5sZW5ndGggPj0gdGhpcy5tYXhIaXN0b3J5TGVuZ3RoKSB7XG4gICAgICB0aGlzLnNldEhpc3RvcnkoaGlzdG9yeS5zbGljZShNYXRoLmNlaWwodGhpcy5tYXhIaXN0b3J5TGVuZ3RoIC8gMikpKTtcbiAgICB9XG4gIH1cblxuICBnZXRMYXN0U25hcHNob3RzKCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdldEhpc3RvcnkoKTtcbiAgICBjb25zdCBzbmFwc2hvdHNCeVBhdGggPSBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0gfHwge307XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNuYXBzaG90c0J5UGF0aCkubWFwKHAgPT4ge1xuICAgICAgcmV0dXJuIHtmaWxlUGF0aDogcCwgLi4uc25hcHNob3RzQnlQYXRoW3BdfTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFySGlzdG9yeSgpIHtcbiAgICB0aGlzLnNldEhpc3RvcnkoW10pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQU8sTUFBTUEseUJBQXlCLENBQUM7RUFDckNDLFdBQVcsQ0FBQ0MsZ0JBQWdCLEVBQUU7SUFDNUIsSUFBSSxDQUFDQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDRCxnQkFBZ0IsR0FBR0EsZ0JBQWdCLElBQUksRUFBRTtFQUNoRDtFQUVBRSxpQkFBaUIsQ0FBQ0MsUUFBUSxFQUFFO0lBQzFCLE1BQU1DLE9BQU8sR0FBRyxJQUFJLENBQUNILHFCQUFxQixDQUFDRSxRQUFRLENBQUM7SUFDcEQsSUFBSUMsT0FBTyxFQUFFO01BQ1gsT0FBT0EsT0FBTztJQUNoQixDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNDLGlCQUFpQixDQUFDRixRQUFRLEVBQUUsRUFBRSxDQUFDO01BQ3BDLE9BQU8sSUFBSSxDQUFDRixxQkFBcUIsQ0FBQ0UsUUFBUSxDQUFDO0lBQzdDO0VBQ0Y7RUFFQUUsaUJBQWlCLENBQUNGLFFBQVEsRUFBRUMsT0FBTyxFQUFFO0lBQ25DLElBQUksQ0FBQ0gscUJBQXFCLENBQUNFLFFBQVEsQ0FBQyxHQUFHQyxPQUFPO0VBQ2hEO0VBRUFFLFVBQVUsR0FBRztJQUNYLE9BQU8sSUFBSSxDQUFDTCxxQkFBcUI7RUFDbkM7RUFFQU0sVUFBVSxDQUFDSCxPQUFPLEVBQUU7SUFDbEIsSUFBSSxDQUFDSCxxQkFBcUIsR0FBR0csT0FBTztFQUN0QztFQUVBSSxpQkFBaUIsQ0FBQ0wsUUFBUSxFQUFFO0lBQzFCLE9BQU8sSUFBSSxDQUFDRCxpQkFBaUIsQ0FBQ0MsUUFBUSxDQUFDLENBQUNNLEdBQUcsRUFBRTtFQUMvQztFQUVBQyxVQUFVLENBQUNQLFFBQVEsRUFBRVEsU0FBUyxFQUFFO0lBQzlCLE1BQU1QLE9BQU8sR0FBRyxJQUFJLENBQUNGLGlCQUFpQixDQUFDQyxR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