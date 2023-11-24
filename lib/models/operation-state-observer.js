"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullOperationStateObserver = exports.default = exports.FETCH = exports.PULL = exports.PUSH = void 0;

var _eventKit = require("event-kit");

const PUSH = {
  getter(o) {
    return o.isPushInProgress();
  }

};
exports.PUSH = PUSH;
const PULL = {
  getter(o) {
    return o.isPullInProgress();
  }

};
exports.PULL = PULL;
const FETCH = {
  getter(o) {
    return o.isFetchInProgress();
  }

}; // Notify subscibers when a repository completes one or more operations of interest, as observed by its OperationState
// transitioning from `true` to `false`. For exampe, use this to perform actions when a push completes.

exports.FETCH = FETCH;

class OperationStateObserver {
  constructor(repository, ...operations) {
    this.repository = repository;
    this.operations = new Set(operations);
    this.emitter = new _eventKit.Emitter();
    this.lastStates = new Map();

    for (const operation of this.operations) {
      this.lastStates.set(operation, operation.getter(this.repository.getOperationStates()));
    }

    this.sub = this.repository.onDidUpdate(this.handleUpdate.bind(this));
  }

  onDidComplete(handler) {
    return this.emitter.on('did-complete', handler);
  }

  handleUpdate() {
    let fire = false;

    for (const operation of this.operations) {
      const last = this.lastStates.get(operation);
      const current = operation.getter(this.repository.getOperationStates());

      if (last && !current) {
        fire = true;
      }

      this.lastStates.set(operation, current);
    }

    if (fire) {
      this.emitter.emit('did-complete');
    }
  }

  dispose() {
    this.emitter.dispose();
    this.sub.dispose();
  }

}

exports.default = OperationStateObserver;
const nullOperationStateObserver = {
  onDidComplete() {
    return new _eventKit.Disposable();
  },

  dispose() {}

};
exports.nullOperationStateObserver = nullOperationStateObserver;