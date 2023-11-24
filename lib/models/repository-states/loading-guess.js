"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initial state to be used when we anticipate that the workspace will contain a single project once bootstrapping
 * has completed. Presents in the UI like the Loading state.
 */
class LoadingGuess extends _state.default {
  isLoadingGuess() {
    return true;
  }

  isUndetermined() {
    return true;
  }

  showGitTabLoading() {
    return true;
  }

  showGitTabInit() {
    return false;
  }

  hasDirectory() {
    return false;
  }

}

exports.default = LoadingGuess;

_state.default.register(LoadingGuess);