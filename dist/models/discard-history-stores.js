"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WholeFileDiscardHistory = exports.PartialFileDiscardHistory = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvZGlzY2FyZC1oaXN0b3J5LXN0b3Jlcy5qcyJdLCJuYW1lcyI6WyJQYXJ0aWFsRmlsZURpc2NhcmRIaXN0b3J5IiwiY29uc3RydWN0b3IiLCJtYXhIaXN0b3J5TGVuZ3RoIiwiYmxvYkhpc3RvcnlCeUZpbGVQYXRoIiwiZ2V0SGlzdG9yeUZvclBhdGgiLCJmaWxlUGF0aCIsImhpc3RvcnkiLCJzZXRIaXN0b3J5Rm9yUGF0aCIsImdldEhpc3RvcnkiLCJzZXRIaXN0b3J5IiwicG9wSGlzdG9yeUZvclBhdGgiLCJwb3AiLCJhZGRIaXN0b3J5Iiwic25hcHNob3RzIiwicHVzaCIsImxlbmd0aCIsInNsaWNlIiwiTWF0aCIsImNlaWwiLCJnZXRMYXN0U25hcHNob3RzRm9yUGF0aCIsImNsZWFySGlzdG9yeUZvclBhdGgiLCJXaG9sZUZpbGVEaXNjYXJkSGlzdG9yeSIsImJsb2JIaXN0b3J5IiwicG9wSGlzdG9yeSIsInNuYXBzaG90c0J5UGF0aCIsImdldExhc3RTbmFwc2hvdHMiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwicCIsImNsZWFySGlzdG9yeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFPLE1BQU1BLHlCQUFOLENBQWdDO0FBQ3JDQyxFQUFBQSxXQUFXLENBQUNDLGdCQUFELEVBQW1CO0FBQzVCLFNBQUtDLHFCQUFMLEdBQTZCLEVBQTdCO0FBQ0EsU0FBS0QsZ0JBQUwsR0FBd0JBLGdCQUFnQixJQUFJLEVBQTVDO0FBQ0Q7O0FBRURFLEVBQUFBLGlCQUFpQixDQUFDQyxRQUFELEVBQVc7QUFDMUIsVUFBTUMsT0FBTyxHQUFHLEtBQUtILHFCQUFMLENBQTJCRSxRQUEzQixDQUFoQjs7QUFDQSxRQUFJQyxPQUFKLEVBQWE7QUFDWCxhQUFPQSxPQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS0MsaUJBQUwsQ0FBdUJGLFFBQXZCLEVBQWlDLEVBQWpDO0FBQ0EsYUFBTyxLQUFLRixxQkFBTCxDQUEyQkUsUUFBM0Is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LENBQUMsSUFBSTtBQUMzQztBQUFReEIsUUFBQUEsUUFBUSxFQUFFd0I7QUFBbEIsU0FBd0JMLGVBQWUsQ0FBQ0ssQ0FBRCxDQUF2QztBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVEQyxFQUFBQSxZQUFZLEdBQUc7QUFDYixTQUFLckIsVUFBTCxDQUFnQixFQUFoQjtBQUNEOztBQXBDa0MiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUGFydGlhbEZpbGVEaXNjYXJkSGlzdG9yeSB7XG4gIGNvbnN0cnVjdG9yKG1heEhpc3RvcnlMZW5ndGgpIHtcbiAgICB0aGlzLmJsb2JIaXN0b3J5QnlGaWxlUGF0aCA9IHt9O1xuICAgIHRoaXMubWF4SGlzdG9yeUxlbmd0aCA9IG1heEhpc3RvcnlMZW5ndGggfHwgNjA7XG4gIH1cblxuICBnZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmJsb2JIaXN0b3J5QnlGaWxlUGF0aFtmaWxlUGF0aF07XG4gICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgIHJldHVybiBoaXN0b3J5O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoLCBbXSk7XG4gICAgICByZXR1cm4gdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGhbZmlsZVBhdGhdO1xuICAgIH1cbiAgfVxuXG4gIHNldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoLCBoaXN0b3J5KSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGhbZmlsZVBhdGhdID0gaGlzdG9yeTtcbiAgfVxuXG4gIGdldEhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuYmxvYkhpc3RvcnlCeUZpbGVQYXRoO1xuICB9XG5cbiAgc2V0SGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeUJ5RmlsZVBhdGggPSBoaXN0b3J5O1xuICB9XG5cbiAgcG9wSGlzdG9yeUZvclBhdGgoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCkucG9wKCk7XG4gIH1cblxuICBhZGRIaXN0b3J5KGZpbGVQYXRoLCBzbmFwc2hvdHMpIHtcbiAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5nZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCk7XG4gICAgaGlzdG9yeS5wdXNoKHNuYXBzaG90cyk7XG4gICAgaWYgKGhpc3RvcnkubGVuZ3RoID49IHRoaXMubWF4SGlzdG9yeUxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCwgaGlzdG9yeS5zbGljZShNYXRoLmNlaWwodGhpcy5tYXhIaXN0b3J5TGVuZ3RoIC8gMikpKTtcbiAgICB9XG4gIH1cblxuICBnZXRMYXN0U25hcHNob3RzRm9yUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdldEhpc3RvcnlGb3JQYXRoKGZpbGVQYXRoKTtcbiAgICBjb25zdCBzbmFwc2hvdHMgPSBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV07XG4gICAgaWYgKCFzbmFwc2hvdHMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4ge2ZpbGVQYXRoLCAuLi5zbmFwc2hvdHN9O1xuICB9XG5cbiAgY2xlYXJIaXN0b3J5Rm9yUGF0aChmaWxlUGF0aCkge1xuICAgIHRoaXMuc2V0SGlzdG9yeUZvclBhdGgoZmlsZVBhdGgsIFtdKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2hvbGVGaWxlRGlzY2FyZEhpc3Rvcnkge1xuICBjb25zdHJ1Y3RvcihtYXhIaXN0b3J5TGVuZ3RoKSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeSA9IFtdO1xuICAgIHRoaXMubWF4SGlzdG9yeUxlbmd0aCA9IG1heEhpc3RvcnlMZW5ndGggfHwgNjA7XG4gIH1cblxuICBnZXRIaXN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmJsb2JIaXN0b3J5O1xuICB9XG5cbiAgc2V0SGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhpcy5ibG9iSGlzdG9yeSA9IGhpc3Rvcnk7XG4gIH1cblxuICBwb3BIaXN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5wb3AoKTtcbiAgfVxuXG4gIGFkZEhpc3Rvcnkoc25hcHNob3RzQnlQYXRoKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuZ2V0SGlzdG9yeSgpO1xuICAgIGhpc3RvcnkucHVzaChzbmFwc2hvdHNCeVBhdGgpO1xuICAgIGlmIChoaXN0b3J5Lmxlbmd0aCA+PSB0aGlzLm1heEhpc3RvcnlMZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0SGlzdG9yeShoaXN0b3J5LnNsaWNlKE1hdGguY2VpbCh0aGlzLm1heEhpc3RvcnlMZW5ndGggLyAyKSkpO1xuICAgIH1cbiAgfVxuXG4gIGdldExhc3RTbmFwc2hvdHMoKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IHRoaXMuZ2V0SGlzdG9yeSgpO1xuICAgIGNvbnN0IHNuYXBzaG90c0J5UGF0aCA9IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXSB8fCB7fTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc25hcHNob3RzQnlQYXRoKS5tYXAocCA9PiB7XG4gICAgICByZXR1cm4ge2ZpbGVQYXRoOiBwLCAuLi5zbmFwc2hvdHNCeVBhdGhbcF19O1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJIaXN0b3J5KCkge1xuICAgIHRoaXMuc2V0SGlzdG9yeShbXSk7XG4gIH1cbn1cbiJdfQ==