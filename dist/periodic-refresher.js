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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9wZXJpb2RpYy1yZWZyZXNoZXIuanMiXSwibmFtZXMiOlsicmVmcmVzaE1hcFBlclVuaXF1ZUlkIiwiV2Vha01hcCIsIlBlcmlvZGljUmVmcmVzaGVyIiwiZ2V0UmVmcmVzaE1hcCIsInVuaXF1ZUlkIiwicmVmcmVzaE1hcCIsImdldCIsIk1hcCIsInNldCIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIl9yZWZyZXNoZXNQZXJJZCIsInN0YXJ0IiwiX3RpbWVyIiwiX3NjaGVkdWxlTmV4dCIsIl9jbGVhclRpbWVyIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInJlZnJlc2hOb3ciLCJpbnRlcnZhbCIsImZvcmNlIiwiY3VycmVudElkIiwiZ2V0Q3VycmVudElkIiwibGFzdFJlZnJlc2hGb3JJZCIsImRlbHRhIiwicGVyZm9ybWFuY2UiLCJub3ciLCJtaW5pbXVtSW50ZXJ2YWxQZXJJZCIsInJlZnJlc2giLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUEsTUFBTUEscUJBQXFCLEdBQUcsSUFBSUMsT0FBSixFQUE5Qjs7QUFFZSxNQUFNQyxpQkFBTixDQUF3QjtBQUNqQixTQUFiQyxhQUFhLENBQUNDLFFBQUQsRUFBVztBQUM3QixRQUFJQyxVQUFVLEdBQUdMLHFCQUFxQixDQUFDTSxHQUF0QixDQUEwQkYsUUFBMUIsQ0FBakI7O0FBQ0EsUUFBSSxDQUFDQyxVQUFMLEVBQWlCO0FBQ2ZBLE1BQUFBLFVBQVUsR0FBRyxJQUFJRSxHQUFKLEVBQWI7QUFDQVAsTUFBQUEscUJBQXFCLENBQUNRLEdBQXRCLENBQTBCSixRQUExQixFQUFvQ0MsVUFBcEM7QUFDRDs7QUFFRCxXQUFPQSxVQUFQO0FBQ0Q7O0FBRURJLEVBQUFBLFdBQVcsQ0FBQ0wsUUFBRCxFQUFXTSxPQUFYLEVBQW9CO0FBQzdCLDJCQUFTLElBQVQsRUFBZSxZQUFmO0FBRUEsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QlQsaUJBQWlCLENBQUNDLGFBQWxCLENBQWdDQyxRQUFoQyxDQUF2QjtBQUNEOztBQUVEUSxFQUFBQSxLQUFLLEdBQUc7QUFDTixRQUFJLENBQUMsS0FBS0MsTUFBVixFQUFrQjtBQUNoQixXQUFLQyxhQUFMO0FBQ0Q7QUFDRjs7QUFFREMsRUFBQUEsV0FBVyxHQUFHO0FBQ1osUUFBSSxLQUFLRixNQUFULEVBQWlCO0FBQ2ZHLE1BQUFBLFlBQVksQ0FBQyxLQUFLSCxNQUFOLENBQVo7QUFDQSxhQUFPLEtBQUtBLE1BQVo7QUFDRDtBQUNGOztBQUVEQyxFQUFBQSxhQUFhLEdBQUc7QUFDZCxTQUFLRCxNQUFMLEdBQWNJLFVBQVUsQ0FBQyxLQUFLQyxVQUFOLEVBQWtCLEtBQUtSLE9BQUwsQ0FBYVMsUUFBYixFQUFsQixDQUF4QjtBQUNEOztBQUVERCxFQUFBQSxVQUFVLENBQUNFLEtBQUssR0FBRyxLQUFULEVBQWdCO0FBQ3hCLFVBQU1DLFNBQVMsR0FBRyxLQUFLWCxPQUFMLENBQWFZLFlBQWIsRUFBbEI7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBRyxLQUFLWixlQUFMLENBQXFCTCxHQUFyQixDQUF5QmUsU0FBekIsS0FBdUMsQ0FBaEU7QUFDQSxVQUFNRyxLQUFLLEdBQUdDLFdBQVcsQ0FBQ0MsR0FBWixLQUFvQkgsZ0JBQWxDOztBQUNBLFFBQUlILEtBQUssSUFBSUksS0FBSyxHQUFHLEtBQUtkLE9BQUwsQ0FBYWlCLG9CQUFsQyxFQUF3RDtBQUN0RCxXQUFLaEIsZUFBTCxDQUFxQkgsR0FBckIsQ0FBeUJhLFNBQXpCLEVBQW9DSSxXQUFXLENBQUNDLEdBQVosRUFBcEM7O0FBQ0EsV0FBS2hCLE9BQUwsQ0FBYWtCLE9BQWI7QUFDRCxLQVB1QixDQVF4Qjs7O0FBQ0EsUUFBSSxLQUFLZixNQUFULEVBQWlCO0FBQ2YsV0FBS0UsV0FBTDs7QUFDQSxXQUFLRCxhQUFMO0FBQ0Q7QUFDRjs7QUFFRGUsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsU0FBS2QsV0FBTDtBQUNEOztBQXBEb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5jb25zdCByZWZyZXNoTWFwUGVyVW5pcXVlSWQgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJpb2RpY1JlZnJlc2hlciB7XG4gIHN0YXRpYyBnZXRSZWZyZXNoTWFwKHVuaXF1ZUlkKSB7XG4gICAgbGV0IHJlZnJlc2hNYXAgPSByZWZyZXNoTWFwUGVyVW5pcXVlSWQuZ2V0KHVuaXF1ZUlkKTtcbiAgICBpZiAoIXJlZnJlc2hNYXApIHtcbiAgICAgIHJlZnJlc2hNYXAgPSBuZXcgTWFwKCk7XG4gICAgICByZWZyZXNoTWFwUGVyVW5pcXVlSWQuc2V0KHVuaXF1ZUlkLCByZWZyZXNoTWFwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVmcmVzaE1hcDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHVuaXF1ZUlkLCBvcHRpb25zKSB7XG4gICAgYXV0b2JpbmQodGhpcywgJ3JlZnJlc2hOb3cnKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5fcmVmcmVzaGVzUGVySWQgPSBQZXJpb2RpY1JlZnJlc2hlci5nZXRSZWZyZXNoTWFwKHVuaXF1ZUlkKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5fdGltZXIpIHtcbiAgICAgIHRoaXMuX3NjaGVkdWxlTmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIF9jbGVhclRpbWVyKCkge1xuICAgIGlmICh0aGlzLl90aW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl90aW1lcjtcbiAgICB9XG4gIH1cblxuICBfc2NoZWR1bGVOZXh0KCkge1xuICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dCh0aGlzLnJlZnJlc2hOb3csIHRoaXMub3B0aW9ucy5pbnRlcnZhbCgpKTtcbiAgfVxuXG4gIHJlZnJlc2hOb3coZm9yY2UgPSBmYWxzZSkge1xuICAgIGNvbnN0IGN1cnJlbnRJZCA9IHRoaXMub3B0aW9ucy5nZXRDdXJyZW50SWQoKTtcbiAgICBjb25zdCBsYXN0UmVmcmVzaEZvcklkID0gdGhpcy5fcmVmcmVzaGVzUGVySWQuZ2V0KGN1cnJlbnRJZCkgfHwgMDtcbiAgICBjb25zdCBkZWx0YSA9IHBlcmZvcm1hbmNlLm5vdygpIC0gbGFzdFJlZnJlc2hGb3JJZDtcbiAgICBpZiAoZm9yY2UgfHwgZGVsdGEgPiB0aGlzLm9wdGlvbnMubWluaW11bUludGVydmFsUGVySWQpIHtcbiAgICAgIHRoaXMuX3JlZnJlc2hlc1BlcklkLnNldChjdXJyZW50SWQsIHBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICAgIHRoaXMub3B0aW9ucy5yZWZyZXNoKCk7XG4gICAgfVxuICAgIC8vIFNjaGVkdWxlIGFub3RoZXIgcmVmcmVzaCBpZiBvbmUgaXMgYWxyZWFkeSBzY2hlZHVsZWRcbiAgICBpZiAodGhpcy5fdGltZXIpIHtcbiAgICAgIHRoaXMuX2NsZWFyVGltZXIoKTtcbiAgICAgIHRoaXMuX3NjaGVkdWxlTmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY2xlYXJUaW1lcigpO1xuICB9XG59XG4iXX0=