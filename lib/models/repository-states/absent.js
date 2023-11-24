"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * No working directory is available in the workspace.
 */
class Absent extends _state.default {
  isAbsent() {
    return true;
  }

  showGitTabInit() {
    return true;
  }

  hasDirectory() {
    return false;
  }

}

exports.default = Absent;

_state.default.register(Absent);