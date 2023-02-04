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
      const startDir = (await _fsExtra.default.stat(startPath)).isDirectory() ? startPath : _path.default.dirname(startPath);

      // Within a git worktree, return a non-empty string containing the path to the worktree root.
      // Throw if a gitdir, outside of a worktree, or startDir does not exist.
      const topLevel = await _compositeGitStrategy.default.create(startDir).exec(['rev-parse', '--show-toplevel']).catch(e => {
        if (/this operation must be run in a work tree/.test(e.stdErr)) {
          return null;
        }
        throw e;
      });
      if (topLevel !== null) {
        return (0, _helpers.toNativePathSep)(topLevel.trim());
      }

      // Within a gitdir, return the absolute path to the gitdir.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXb3JrZGlyQ2FjaGUiLCJjb25zdHJ1Y3RvciIsIm1heFNpemUiLCJrbm93biIsIk1hcCIsImZpbmQiLCJzdGFydFBhdGgiLCJjYWNoZWQiLCJnZXQiLCJ1bmRlZmluZWQiLCJ3b3JrRGlyIiwicmV2UGFyc2UiLCJzaXplIiwiY2xlYXIiLCJzZXQiLCJpbnZhbGlkYXRlIiwic3RhcnREaXIiLCJmcyIsInN0YXQiLCJpc0RpcmVjdG9yeSIsInBhdGgiLCJkaXJuYW1lIiwidG9wTGV2ZWwiLCJDb21wb3NpdGVHaXRTdHJhdGVneSIsImNyZWF0ZSIsImV4ZWMiLCJjYXRjaCIsImUiLCJ0ZXN0Iiwic3RkRXJyIiwidG9OYXRpdmVQYXRoU2VwIiwidHJpbSIsImdpdERpciIsInJlc29sdmUiLCJhdG9tIiwiY29uZmlnIiwiY29uc29sZSIsImVycm9yIl0sInNvdXJjZXMiOlsid29ya2Rpci1jYWNoZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5cbmltcG9ydCBDb21wb3NpdGVHaXRTdHJhdGVneSBmcm9tICcuLi9jb21wb3NpdGUtZ2l0LXN0cmF0ZWd5JztcbmltcG9ydCB7dG9OYXRpdmVQYXRoU2VwfSBmcm9tICcuLi9oZWxwZXJzJztcblxuLyoqXG4gKiBMb2NhdGUgdGhlIG5lYXJlc3QgZ2l0IHdvcmtpbmcgZGlyZWN0b3J5IGFib3ZlIGEgZ2l2ZW4gc3RhcnRpbmcgcG9pbnQsIGNhY2hpbmcgcmVzdWx0cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ya2RpckNhY2hlIHtcbiAgY29uc3RydWN0b3IobWF4U2l6ZSA9IDEwMDApIHtcbiAgICB0aGlzLm1heFNpemUgPSBtYXhTaXplO1xuICAgIHRoaXMua25vd24gPSBuZXcgTWFwKCk7XG4gIH1cblxuICBhc3luYyBmaW5kKHN0YXJ0UGF0aCkge1xuICAgIGNvbnN0IGNhY2hlZCA9IHRoaXMua25vd24uZ2V0KHN0YXJ0UGF0aCk7XG4gICAgaWYgKGNhY2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY2FjaGVkO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmtEaXIgPSBhd2FpdCB0aGlzLnJldlBhcnNlKHN0YXJ0UGF0aCk7XG5cbiAgICBpZiAodGhpcy5rbm93bi5zaXplID49IHRoaXMubWF4U2l6ZSkge1xuICAgICAgdGhpcy5rbm93bi5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmtub3duLnNldChzdGFydFBhdGgsIHdvcmtEaXIpO1xuXG4gICAgcmV0dXJuIHdvcmtEaXI7XG4gIH1cblxuICBpbnZhbGlkYXRlKCkge1xuICAgIHRoaXMua25vd24uY2xlYXIoKTtcbiAgfVxuXG4gIGFzeW5jIHJldlBhcnNlKHN0YXJ0UGF0aCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGFydERpciA9IChhd2FpdCBmcy5zdGF0KHN0YXJ0UGF0aCkpLmlzRGlyZWN0b3J5KCkgPyBzdGFydFBhdGggOiBwYXRoLmRpcm5hbWUoc3RhcnRQYXRoKTtcblxuICAgICAgLy8gV2l0aGluIGEgZ2l0IHdvcmt0cmVlLCByZXR1cm4gYSBub24tZW1wdHkgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHBhdGggdG8gdGhlIHdvcmt0cmVlIHJvb3QuXG4gICAgICAvLyBUaHJvdyBpZiBhIGdpdGRpciwgb3V0c2lkZSBvZiBhIHdvcmt0cmVlLCBvciBzdGFydERpciBkb2VzIG5vdCBleGlzdC5cbiAgICAgIGNvbnN0IHRvcExldmVsID0gYXdhaXQgQ29tcG9zaXRlR2l0U3RyYXRlZ3kuY3JlYXRlKHN0YXJ0RGlyKS5leGVjKFsncmV2LXBhcnNlJywgJy0tc2hvdy10b3BsZXZlbCddKVxuICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgaWYgKC90aGlzIG9wZXJhdGlvbiBtdXN0IGJlIHJ1biBpbiBhIHdvcmsgdHJlZS8udGVzdChlLnN0ZEVycikpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0b3BMZXZlbCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdG9OYXRpdmVQYXRoU2VwKHRvcExldmVsLnRyaW0oKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdpdGhpbiBhIGdpdGRpciwgcmV0dXJuIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBnaXRkaXIuXG4gICAgICAvLyBPdXRzaWRlIG9mIGEgZ2l0ZGlyIG9yIHdvcmt0cmVlLCB0aHJvdy5cbiAgICAgIGNvbnN0IGdpdERpciA9IGF3YWl0IENvbXBvc2l0ZUdpdFN0cmF0ZWd5LmNyZWF0ZShzdGFydERpcikuZXhlYyhbJ3Jldi1wYXJzZScsICctLWFic29sdXRlLWdpdC1kaXInXSk7XG4gICAgICByZXR1cm4gdGhpcy5yZXZQYXJzZShwYXRoLnJlc29sdmUoZ2l0RGlyLCAnLi4nKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdnaXRodWIucmVwb3J0Q2Fubm90TG9jYXRlV29ya3NwYWNlRXJyb3InKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gbG9jYXRlIGdpdCB3b3Jrc3BhY2Ugcm9vdCBmb3IgJHtzdGFydFBhdGh9LiBFeHBlY3RlZCBpZiAke3N0YXJ0UGF0aH0gaXMgbm90IGluIGEgZ2l0IHJlcG9zaXRvcnkuYCxcbiAgICAgICAgICBlLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQTJDO0FBRTNDO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLFlBQVksQ0FBQztFQUNoQ0MsV0FBVyxD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