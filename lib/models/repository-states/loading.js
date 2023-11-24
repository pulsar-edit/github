"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initial state to be used when it's uncertain whether or not a git repository is present in a working directory. If
 * it is a git repository, transition to Present, otherwise transition to Empty.
 */
class Loading extends _state.default {
  async start() {
    const dotGitDir = await this.resolveDotGitDir();

    if (dotGitDir) {
      this.repository.setGitDirectoryPath(dotGitDir);
      const history = await this.loadHistoryPayload();
      return this.transitionTo('Present', history);
    } else {
      return this.transitionTo('Empty');
    }
  }

  isLoading() {
    return true;
  }

  async init() {
    await this.getLoadPromise();
    await this.repository.init();
  }

  async clone(remoteUrl) {
    await this.getLoadPromise();
    await this.repository.clone(remoteUrl);
  }

  showGitTabLoading() {
    return true;
  }

  directResolveDotGitDir() {
    return this.git().resolveDotGitDir();
  }

  directGetConfig(key, options) {
    return this.git().getConfig(key, options);
  }

  directGetBlobContents(sha) {
    return this.git().getBlobContents(sha);
  }

}

exports.default = Loading;

_state.default.register(Loading);