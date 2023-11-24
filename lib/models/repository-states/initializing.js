"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Git is asynchronously initializing a new repository in this working directory.
 */
class Initializing extends _state.default {
  async start() {
    await this.doInit(this.workdir());
    await this.transitionTo('Loading');
  }

  showGitTabLoading() {
    return true;
  }

  directInit(workdir) {
    return this.git().init(workdir);
  }

}

exports.default = Initializing;

_state.default.register(Initializing);