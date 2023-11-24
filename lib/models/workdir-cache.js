"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _compositeGitStrategy = _interopRequireDefault(require("../composite-git-strategy"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Locate the nearest git working directory above a given starting point, caching results.
 */
class WorkdirCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.known = new Map();
  }

  async find(startPath) {
    const cached = this.known.get(startPath);

    if (cached !== undefined) {
      return cached;
    }

    const workDir = await this.revParse(startPath);

    if (this.known.size >= this.maxSize) {
      this.known.clear();
    }

    this.known.set(startPath, workDir);
    return workDir;
  }

  invalidate() {
    this.known.clear();
  }

  async revParse(startPath) {
    try {
      const startDir = (await _fsExtra.default.stat(startPath)).isDirectory() ? startPath : _path.default.dirname(startPath); // Within a git worktree, return a non-empty string containing the path to the worktree root.
      // Throw if a gitdir, outside of a worktree, or startDir does not exist.

      const topLevel = await _compositeGitStrategy.default.create(startDir).exec(['rev-parse', '--show-toplevel']).catch(e => {
        if (/this operation must be run in a work tree/.test(e.stdErr)) {
          return null;
        }

        throw e;
      });

      if (topLevel !== null) {
        return (0, _helpers.toNativePathSep)(topLevel.trim());
      } // Within a gitdir, return the absolute path to the gitdir.
      // Outside of a gitdir or worktree, throw.


      const gitDir = await _compositeGitStrategy.default.create(startDir).exec(['rev-parse', '--absolute-git-dir']);
      return this.revParse(_path.default.resolve(gitDir, '..'));
    } catch (e) {
      /* istanbul ignore if */
      if (atom.config.get('github.reportCannotLocateWorkspaceError')) {
        // eslint-disable-next-line no-console
        console.error(`Unable to locate git workspace root for ${startPath}. Expected if ${startPath} is not in a git repository.`, e);
      }

      return null;
    }
  }

}

exports.default = WorkdirCache;