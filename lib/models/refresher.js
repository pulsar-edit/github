"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Uniformly trigger a refetch of all GraphQL query containers within a scoped hierarchy.
 */
class Refresher {
  constructor() {
    this.dispose();
  }

  setRetryCallback(key, retryCallback) {
    this.retryByKey.set(key, retryCallback);
  }

  trigger() {
    for (const [, retryCallback] of this.retryByKey) {
      retryCallback();
    }
  }

  deregister(key) {
    this.retryByKey.delete(key);
  }

  dispose() {
    this.retryByKey = new Map();
  }

}

exports.default = Refresher;