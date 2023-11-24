"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("./helpers");

const refreshMapPerUniqueId = new WeakMap();

class PeriodicRefresher {
  static getRefreshMap(uniqueId) {
    let refreshMap = refreshMapPerUniqueId.get(uniqueId);

    if (!refreshMap) {
      refreshMap = new Map();
      refreshMapPerUniqueId.set(uniqueId, refreshMap);
    }

    return refreshMap;
  }

  constructor(uniqueId, options) {
    (0, _helpers.autobind)(this, 'refreshNow');
    this.options = options;
    this._refreshesPerId = PeriodicRefresher.getRefreshMap(uniqueId);
  }

  start() {
    if (!this._timer) {
      this._scheduleNext();
    }
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }
  }

  _scheduleNext() {
    this._timer = setTimeout(this.refreshNow, this.options.interval());
  }

  refreshNow(force = false) {
    const currentId = this.options.getCurrentId();
    const lastRefreshForId = this._refreshesPerId.get(currentId) || 0;
    const delta = performance.now() - lastRefreshForId;

    if (force || delta > this.options.minimumIntervalPerId) {
      this._refreshesPerId.set(currentId, performance.now());

      this.options.refresh();
    } // Schedule another refresh if one is already scheduled


    if (this._timer) {
      this._clearTimer();

      this._scheduleNext();
    }
  }

  destroy() {
    this._clearTimer();
  }

}

exports.default = PeriodicRefresher;