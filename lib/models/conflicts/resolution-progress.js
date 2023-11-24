"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

class ResolutionProgress {
  constructor() {
    this.emitter = new _eventKit.Emitter();
    this.markerCountByPath = new Map();
  }

  didUpdate() {
    this.emitter.emit('did-update');
  }

  onDidUpdate(cb) {
    return this.emitter.on('did-update', cb);
  }

  reportMarkerCount(path, count) {
    const previous = this.markerCountByPath.get(path);
    this.markerCountByPath.set(path, count);

    if (count !== previous) {
      this.didUpdate();
    }
  }

  getRemaining(path) {
    return this.markerCountByPath.get(path);
  }

  isEmpty() {
    return this.markerCountByPath.size === 0;
  }

}

exports.default = ResolutionProgress;