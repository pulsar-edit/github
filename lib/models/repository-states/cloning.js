"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Git is asynchronously cloning a repository into this working directory.
 */
class Cloning extends _state.default {
  constructor(repository, remoteUrl, sourceRemoteName) {
    super(repository);
    this.remoteUrl = remoteUrl;
    this.sourceRemoteName = sourceRemoteName;
  }

  async start() {
    await _fsExtra.default.mkdirs(this.workdir());
    await this.doClone(this.remoteUrl, {
      recursive: true,
      sourceRemoteName: this.sourceRemoteName
    });
    await this.transitionTo('Loading');
  }

  showGitTabLoading() {
    return true;
  }

  directClone(remoteUrl, options) {
    return this.git().clone(remoteUrl, options);
  }

}

exports.default = Cloning;

_state.default.register(Cloning);