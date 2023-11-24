"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The package is being cleaned up or the context is being disposed some other way.
 */
class Destroyed extends _state.default {
  start() {
    this.didDestroy();
    this.repository.git.destroy && this.repository.git.destroy();
    this.repository.emitter.dispose();
  }

  isDestroyed() {
    return true;
  }

  destroy() {// No-op to destroy twice
  }

}

exports.default = Destroyed;

_state.default.register(Destroyed);