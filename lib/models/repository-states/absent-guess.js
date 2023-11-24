"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initial state to be used when we anticipate that the workspace will contain zero or many projects once bootstrapping
 * has completed. Presents in the UI like the Absent state, but is "sticky" during the initial package activation.
 */
class AbsentGuess extends _state.default {
  isAbsentGuess() {
    return true;
  }

  isUndetermined() {
    return true;
  }

  showGitTabLoading() {
    return false;
  }

  showGitTabInit() {
    return true;
  }

  hasDirectory() {
    return false;
  }

}

exports.default = AbsentGuess;

_state.default.register(AbsentGuess);