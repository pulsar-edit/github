"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The working directory exists, but contains no git repository yet.
 */
class Empty extends _state.default {
  isEmpty() {
    return true;
  }

  init() {
    return this.transitionTo('Initializing');
  }

  clone(remoteUrl, sourceRemoteName) {
    return this.transitionTo('Cloning', remoteUrl, sourceRemoteName);
  }

  showGitTabInit() {
    return true;
  }

}

exports.default = Empty;

_state.default.register(Empty);