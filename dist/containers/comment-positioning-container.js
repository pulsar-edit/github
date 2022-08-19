"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _crypto = _interopRequireDefault(require("crypto"));

var _eventKit = require("event-kit");

var _yubikiri = _interopRequireDefault(require("yubikiri"));

var _whatsMyLine = require("whats-my-line");

var _file = _interopRequireDefault(require("../models/patch/file"));

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommentPositioningContainer extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "fetchData", (localRepository, commentPaths, prCommitSha) => {
      const promises = {};

      for (const commentPath of commentPaths) {
        promises[commentPath] = localRepository.getDiffsForFilePath(commentPath, prCommitSha).catch(() => []);
      }

      return (0, _yubikiri.default)(promises);
    });

    this.state = {
      translationsByFile: new Map()
    };
    this.subs = new _eventKit.CompositeDisposable();
  }

  static getDerivedStateFromProps(props, state) {
    const prevPaths = new Set(state.translationsByFile.keys());
    let changed = false;

    for (const thread of props.commentThreads) {
      const relPath = thread.comments[0].path;
      const commentPath = (0, _helpers.toNativePathSep)(relPath);
      let existing = state.translationsByFile.get(commentPath);

      if (!existing) {
        existing = new FileTranslation(relPath);
        state.translationsByFile.set(commentPath, existing);
        changed = true;
      }

      existing.addCommentThread(thread);
      prevPaths.delete(commentPath);
    }

    for (const oldPath of prevPaths) {
      state.translationsByFile.deleted(oldPath);
      changed = true;
    }

    if (changed) {
      return {
        translationsByFile: state.translationsByFile
      };
    } else {
      return null;
    }
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

  render() {
    const commentPaths = [...this.state.translationsByFile.keys()];
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.localRepository,
      fetchData: this.fetchData,
      fetchParams: [commentPaths, this.props.prCommitSha]
    }, diffsByPath => {
      if (diffsByPath === null) {
        return this.props.children(null);
      }

      for (const commentPath of commentPaths) {
        this.state.translationsByFile.get(commentPath).updateIfNecessary({
          multiFilePatch: this.props.multiFilePatch,
          diffs: diffsByPath[commentPath] || [],
          diffPositionFn: this.props.diffPositionToFilePosition,
          translatePositionFn: this.props.translateLinesGivenDiff
        });
      }

      return this.props.children(this.state.translationsByFile);
    });
  }

}

exports.default = CommentPositioningContainer;

_defineProperty(CommentPositioningContainer, "propTypes", {
  localRepository: _propTypes.default.object.isRequired,
  multiFilePatch: _propTypes.default.object.isRequired,
  commentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    comments: _propTypes.default.arrayOf(_propTypes.default.shape({
      position: _propTypes.default.number,
      path: _propTypes.default.string.isRequired
    })).isRequired
  })),
  prCommitSha: _propTypes.default.string.isRequired,
  children: _propTypes.default.func.isRequired,
  // For unit test injection
  translateLinesGivenDiff: _propTypes.default.func,
  diffPositionToFilePosition: _propTypes.default.func
});

_defineProperty(CommentPositioningContainer, "defaultProps", {
  translateLinesGivenDiff: _whatsMyLine.translateLinesGivenDiff,
  diffPositionToFilePosition: _whatsMyLine.diffPositionToFilePosition,
  didTranslate:
  /* istanbul ignore next */
  () => {}
});

class FileTranslation {
  constructor(relPath) {
    this.relPath = relPath;
    this.nativeRelPath = (0, _helpers.toNativePathSep)(relPath);
    this.rawPositions = new Set();
    this.diffToFilePosition = new Map();
    this.removed = false;
    this.fileTranslations = null;
    this.digest = null;
    this.last = {
      multiFilePatch: null,
      diffs: null
    };
  }

  addCommentThread(thread) {
    this.rawPositions.add(thread.comments[0].position);
  }

  updateIfNecessary({
    multiFilePatch,
    diffs,
    diffPositionFn,
    translatePositionFn
  }) {
    if (this.last.multiFilePatch === multiFilePatch && this.last.diffs === diffs) {
      return false;
    }

    this.last.multiFilePatch = multiFilePatch;
    this.last.diffs = diffs;
    return this.update({
      multiFilePatch,
      diffs,
      diffPositionFn,
      translatePositionFn
    });
  }

  update({
    multiFilePatch,
    diffs,
    diffPositionFn,
    translatePositionFn
  }) {
    const filePatch = multiFilePatch.getPatchForPath(this.nativeRelPath); // Comment on a file that used to exist in a PR but no longer does. Skip silently.

    if (!filePatch) {
      this.diffToFilePosition = new Map();
      this.removed = false;
      this.fileTranslations = null;
      return;
    } // This comment was left on a file that was too large to parse.


    if (!filePatch.getRenderStatus().isVisible()) {
      this.diffToFilePosition = new Map();
      this.removed = true;
      this.fileTranslations = null;
      return;
    }

    this.diffToFilePosition = diffPositionFn(this.rawPositions, filePatch.getRawContentPatch());
    this.removed = false;
    let contentChangeDiff;

    if (diffs.length === 1) {
      contentChangeDiff = diffs[0];
    } else if (diffs.length === 2) {
      const [diff1, diff2] = diffs;

      if (diff1.oldMode === _file.default.modes.SYMLINK || diff1.newMode === _file.default.modes.SYMLINK) {
        contentChangeDiff = diff2;
      } else {
        contentChangeDiff = diff1;
      }
    }

    if (contentChangeDiff) {
      const filePositions = [...this.diffToFilePosition.values()];
      this.fileTranslations = translatePositionFn(filePositions, contentChangeDiff);

      const hash = _crypto.default.createHash('sha256');

      hash.update(JSON.stringify(Array.from(this.fileTranslations.entries())));
      this.digest = hash.digest('hex');
    } else {
      this.fileTranslations = null;
      this.digest = null;
    }
  }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NvbW1lbnQtcG9zaXRpb25pbmctY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkNvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImxvY2FsUmVwb3NpdG9yeSIsImNvbW1lbnRQYXRocyIsInByQ29tbWl0U2hhIiwicHJvbWlzZXMiLCJjb21tZW50UGF0aCIsImdldERpZmZzRm9yRmlsZVBhdGgiLCJjYXRjaCIsInN0YXRlIiwidHJhbnNsYXRpb25zQnlGaWxlIiwiTWFwIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJwcmV2UGF0aHMiLCJTZXQiLCJrZXlzIiwiY2hhbmdlZCIsInRocmVhZCIsImNvbW1lbnRUaHJlYWRzIiwicmVsUGF0aCIsImNvbW1lbnRzIiwicGF0aCIsImV4aXN0aW5nIiwiZ2V0IiwiRmlsZVRyYW5zbGF0aW9uIiwic2V0IiwiYWRkQ29tbWVudFRocmVhZCIsImRlbGV0ZSIsIm9sZFBhdGgiLCJkZWxldGVkIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwicmVuZGVyIiwiZmV0Y2hEYXRhIiwiZGlmZnNCeVBhdGgiLCJjaGlsZHJlbiIsInVwZGF0ZUlmTmVjZXNzYXJ5IiwibXVsdGlGaWxlUGF0Y2giLCJkaWZmcyIsImRpZmZQb3NpdGlvbkZuIiwiZGlmZlBvc2l0aW9uVG9GaWxlUG9zaXRpb24iLCJ0cmFuc2xhdGVQb3NpdGlvbkZuIiwidHJhbnNsYXRlTGluZXNHaXZlbkRpZmYiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsInNoYXBlIiwicG9zaXRpb24iLCJudW1iZXIiLCJzdHJpbmciLCJmdW5jIiwiZGlkVHJhbnNsYXRlIiwibmF0aXZlUmVsUGF0aCIsInJhd1Bvc2l0aW9ucyIsImRpZmZUb0ZpbGVQb3NpdGlvbiIsInJlbW92ZWQiLCJmaWxlVHJhbnNsYXRpb25zIiwiZGlnZXN0IiwibGFzdCIsImFkZCIsInVwZGF0ZSIsImZpbGVQYXRjaCIsImdldFBhdGNoRm9yUGF0aCIsImdldFJlbmRlclN0YXR1cyIsImlzVmlzaWJsZSIsImdldFJhd0NvbnRlbnRQYXRjaCIsImNvbnRlbnRDaGFuZ2VEaWZmIiwibGVuZ3RoIiwiZGlmZjEiLCJkaWZmMiIsIm9sZE1vZGUiLCJGaWxlIiwibW9kZXMiLCJTWU1MSU5LIiwibmV3TW9kZSIsImZpbGVQb3NpdGlvbnMiLCJ2YWx1ZXMiLCJoYXNoIiwiY3J5cHRvIiwiY3JlYXRlSGFzaCIsIkpTT04iLCJzdHJpbmdpZnkiLCJBcnJheSIsImZyb20iLCJlbnRyaWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLDJCQUFOLFNBQTBDQyxlQUFNQyxTQUFoRCxDQUEwRDtBQXdCdkVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47O0FBRGlCLHVDQXdFUCxDQUFDQyxlQUFELEVBQWtCQyxZQUFsQixFQUFnQ0MsV0FBaEMsS0FBZ0Q7QUFDMUQsWUFBTUMsUUFBUSxHQUFHLEVBQWpCOztBQUNBLFdBQUssTUFBTUMsV0FBWCxJQUEwQkgsWUFBMUIsRUFBd0M7QUFDdENFLFFBQUFBLFFBQVEsQ0FBQ0MsV0FBRCxDQUFSLEdBQXdCSixlQUFlLENBQUNLLG1CQUFoQixDQUFvQ0QsV0FBcEMsRUFBaURGLFdBQWpELEVBQThESSxLQUE5RCxDQUFvRSxNQUFNLEVBQTFFLENBQXhCO0FBQ0Q7O0FBQ0QsYUFBTyx1QkFBU0gsUUFBVCxDQUFQO0FBQ0QsS0E5RWtCOztBQUdqQixTQUFLSSxLQUFMLEdBQWE7QUFBQ0MsTUFBQUEsa0JBQWtCLEVBQUUsSUFBSUMsR0FBSjtBQUFyQixLQUFiO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLElBQUlDLDZCQUFK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R0FBRyxLQUFLckIsa0JBQUwsQ0FBd0JzQixNQUF4QixFQUFKLENBQXRCO0FBQ0EsV0FBS3BCLGdCQUFMLEdBQXdCaEIsbUJBQW1CLENBQUNtQyxhQUFELEVBQWdCVCxpQkFBaEIsQ0FBM0M7O0FBRUEsWUFBTVcsSUFBSSxHQUFHQyxnQkFBT0MsVUFBUCxDQUFrQixRQUFsQixDQUFiOztBQUNBRixNQUFBQSxJQUFJLENBQUNqQixNQUFMLENBQVlvQixJQUFJLENBQUNDLFNBQUwsQ0FBZUMsS0FBSyxDQUFDQyxJQUFOLENBQVcsS0FBSzNCLGdCQUFMLENBQXNCNEIsT0FBdEIsRUFBWCxDQUFmLENBQVo7QUFDQSxXQUFLM0IsTUFBTCxHQUFjb0IsSUFBSSxDQUFDcEIsTUFBTCxDQUFZLEtBQVosQ0FBZDtBQUNELEtBUEQsTUFPTztBQUNMLFdBQUtELGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsV0FBS0MsTUFBTCxHQUFjLElBQWQ7QUFDRDtBQUNGOztBQTlFbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5pbXBvcnQge3RyYW5zbGF0ZUxpbmVzR2l2ZW5EaWZmLCBkaWZmUG9zaXRpb25Ub0ZpbGVQb3NpdGlvbn0gZnJvbSAnd2hhdHMtbXktbGluZSc7XG5cbmltcG9ydCBGaWxlIGZyb20gJy4uL21vZGVscy9wYXRjaC9maWxlJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQge3RvTmF0aXZlUGF0aFNlcH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1lbnRQb3NpdGlvbmluZ0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbG9jYWxSZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbXVsdGlGaWxlUGF0Y2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBwb3NpdGlvbjogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgcGF0aDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSkpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuICAgIHByQ29tbWl0U2hhOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBGb3IgdW5pdCB0ZXN0IGluamVjdGlvblxuICAgIHRyYW5zbGF0ZUxpbmVzR2l2ZW5EaWZmOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaWZmUG9zaXRpb25Ub0ZpbGVQb3NpdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHRyYW5zbGF0ZUxpbmVzR2l2ZW5EaWZmLFxuICAgIGRpZmZQb3NpdGlvblRvRmlsZVBvc2l0aW9uLFxuICAgIGRpZFRyYW5zbGF0ZTogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7dHJhbnNsYXRpb25zQnlGaWxlOiBuZXcgTWFwKCl9O1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xuICAgIGNvbnN0IHByZXZQYXRocyA9IG5ldyBTZXQoc3RhdGUudHJhbnNsYXRpb25zQnlGaWxlLmtleXMoKSk7XG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgdGhyZWFkIG9mIHByb3BzLmNvbW1lbnRUaHJlYWRzKSB7XG4gICAgICBjb25zdCByZWxQYXRoID0gdGhyZWFkLmNvbW1lbnRzWzBdLnBhdGg7XG4gICAgICBjb25zdCBjb21tZW50UGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyZWxQYXRoKTtcblxuICAgICAgbGV0IGV4aXN0aW5nID0gc3RhdGUudHJhbnNsYXRpb25zQnlGaWxlLmdldChjb21tZW50UGF0aCk7XG4gICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgIGV4aXN0aW5nID0gbmV3IEZpbGVUcmFuc2xhdGlvbihyZWxQYXRoKTtcbiAgICAgICAgc3RhdGUudHJhbnNsYXRpb25zQnlGaWxlLnNldChjb21tZW50UGF0aCwgZXhpc3RpbmcpO1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGV4aXN0aW5nLmFkZENvbW1lbnRUaHJlYWQodGhyZWFkKTtcblxuICAgICAgcHJldlBhdGhzLmRlbGV0ZShjb21tZW50UGF0aCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBvbGRQYXRoIG9mIHByZXZQYXRocykge1xuICAgICAgc3RhdGUudHJhbnNsYXRpb25zQnlGaWxlLmRlbGV0ZWQob2xkUGF0aCk7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgcmV0dXJuIHt0cmFuc2xhdGlvbnNCeUZpbGU6IHN0YXRlLnRyYW5zbGF0aW9uc0J5RmlsZX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWVudFBhdGhzID0gWy4uLnRoaXMuc3RhdGUudHJhbnNsYXRpb25zQnlGaWxlLmtleXMoKV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbFxuICAgICAgICBtb2RlbD17dGhpcy5wcm9wcy5sb2NhbFJlcG9zaXRvcnl9XG4gICAgICAgIGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9XG4gICAgICAgIGZldGNoUGFyYW1zPXtbY29tbWVudFBhdGhzLCB0aGlzLnByb3BzLnByQ29tbWl0U2hhXX0+XG5cbiAgICAgICAge2RpZmZzQnlQYXRoID0+IHtcbiAgICAgICAgICBpZiAoZGlmZnNCeVBhdGggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKG51bGwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoY29uc3QgY29tbWVudFBhdGggb2YgY29tbWVudFBhdGhzKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRyYW5zbGF0aW9uc0J5RmlsZS5nZXQoY29tbWVudFBhdGgpLnVwZGF0ZUlmTmVjZXNzYXJ5KHtcbiAgICAgICAgICAgICAgbXVsdGlGaWxlUGF0Y2g6IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2gsXG4gICAgICAgICAgICAgIGRpZmZzOiBkaWZmc0J5UGF0aFtjb21tZW50UGF0aF0gfHwgW10sXG4gICAgICAgICAgICAgIGRpZmZQb3NpdGlvbkZuOiB0aGlzLnByb3BzLmRpZmZQb3NpdGlvblRvRmlsZVBvc2l0aW9uLFxuICAgICAgICAgICAgICB0cmFuc2xhdGVQb3NpdGlvbkZuOiB0aGlzLnByb3BzLnRyYW5zbGF0ZUxpbmVzR2l2ZW5EaWZmLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW4odGhpcy5zdGF0ZS50cmFuc2xhdGlvbnNCeUZpbGUpO1xuICAgICAgICB9fVxuXG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgZmV0Y2hEYXRhID0gKGxvY2FsUmVwb3NpdG9yeSwgY29tbWVudFBhdGhzLCBwckNvbW1pdFNoYSkgPT4ge1xuICAgIGNvbnN0IHByb21pc2VzID0ge307XG4gICAgZm9yIChjb25zdCBjb21tZW50UGF0aCBvZiBjb21tZW50UGF0aHMpIHtcbiAgICAgIHByb21pc2VzW2NvbW1lbnRQYXRoXSA9IGxvY2FsUmVwb3NpdG9yeS5nZXREaWZmc0ZvckZpbGVQYXRoKGNvbW1lbnRQYXRoLCBwckNvbW1pdFNoYSkuY2F0Y2goKCkgPT4gW10pO1xuICAgIH1cbiAgICByZXR1cm4geXViaWtpcmkocHJvbWlzZXMpO1xuICB9XG59XG5cbmNsYXNzIEZpbGVUcmFuc2xhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHJlbFBhdGgpIHtcbiAgICB0aGlzLnJlbFBhdGggPSByZWxQYXRoO1xuICAgIHRoaXMubmF0aXZlUmVsUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyZWxQYXRoKTtcblxuICAgIHRoaXMucmF3UG9zaXRpb25zID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZGlmZlRvRmlsZVBvc2l0aW9uID0gbmV3IE1hcCgpO1xuICAgIHRoaXMucmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlsZVRyYW5zbGF0aW9ucyA9IG51bGw7XG4gICAgdGhpcy5kaWdlc3QgPSBudWxsO1xuXG4gICAgdGhpcy5sYXN0ID0ge211bHRpRmlsZVBhdGNoOiBudWxsLCBkaWZmczogbnVsbH07XG4gIH1cblxuICBhZGRDb21tZW50VGhyZWFkKHRocmVhZCkge1xuICAgIHRoaXMucmF3UG9zaXRpb25zLmFkZCh0aHJlYWQuY29tbWVudHNbMF0ucG9zaXRpb24pO1xuICB9XG5cbiAgdXBkYXRlSWZOZWNlc3Nhcnkoe211bHRpRmlsZVBhdGNoLCBkaWZmcywgZGlmZlBvc2l0aW9uRm4sIHRyYW5zbGF0ZVBvc2l0aW9uRm59KSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5sYXN0Lm11bHRpRmlsZVBhdGNoID09PSBtdWx0aUZpbGVQYXRjaCAmJlxuICAgICAgdGhpcy5sYXN0LmRpZmZzID09PSBkaWZmc1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMubGFzdC5tdWx0aUZpbGVQYXRjaCA9IG11bHRpRmlsZVBhdGNoO1xuICAgIHRoaXMubGFzdC5kaWZmcyA9IGRpZmZzO1xuXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKHttdWx0aUZpbGVQYXRjaCwgZGlmZnMsIGRpZmZQb3NpdGlvbkZuLCB0cmFuc2xhdGVQb3NpdGlvbkZufSk7XG4gIH1cblxuICB1cGRhdGUoe211bHRpRmlsZVBhdGNoLCBkaWZmcywgZGlmZlBvc2l0aW9uRm4sIHRyYW5zbGF0ZVBvc2l0aW9uRm59KSB7XG4gICAgY29uc3QgZmlsZVBhdGNoID0gbXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hGb3JQYXRoKHRoaXMubmF0aXZlUmVsUGF0aCk7XG4gICAgLy8gQ29tbWVudCBvbiBhIGZpbGUgdGhhdCB1c2VkIHRvIGV4aXN0IGluIGEgUFIgYnV0IG5vIGxvbmdlciBkb2VzLiBTa2lwIHNpbGVudGx5LlxuICAgIGlmICghZmlsZVBhdGNoKSB7XG4gICAgICB0aGlzLmRpZmZUb0ZpbGVQb3NpdGlvbiA9IG5ldyBNYXAoKTtcbiAgICAgIHRoaXMucmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5maWxlVHJhbnNsYXRpb25zID0gbnVsbDtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoaXMgY29tbWVudCB3YXMgbGVmdCBvbiBhIGZpbGUgdGhhdCB3YXMgdG9vIGxhcmdlIHRvIHBhcnNlLlxuICAgIGlmICghZmlsZVBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmRpZmZUb0ZpbGVQb3NpdGlvbiA9IG5ldyBNYXAoKTtcbiAgICAgIHRoaXMucmVtb3ZlZCA9IHRydWU7XG4gICAgICB0aGlzLmZpbGVUcmFuc2xhdGlvbnMgPSBudWxsO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaWZmVG9GaWxlUG9zaXRpb24gPSBkaWZmUG9zaXRpb25Gbih0aGlzLnJhd1Bvc2l0aW9ucywgZmlsZVBhdGNoLmdldFJhd0NvbnRlbnRQYXRjaCgpKTtcbiAgICB0aGlzLnJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGxldCBjb250ZW50Q2hhbmdlRGlmZjtcbiAgICBpZiAoZGlmZnMubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb250ZW50Q2hhbmdlRGlmZiA9IGRpZmZzWzBdO1xuICAgIH0gZWxzZSBpZiAoZGlmZnMubGVuZ3RoID09PSAyKSB7XG4gICAgICBjb25zdCBbZGlmZjEsIGRpZmYyXSA9IGRpZmZzO1xuICAgICAgaWYgKGRpZmYxLm9sZE1vZGUgPT09IEZpbGUubW9kZXMuU1lNTElOSyB8fCBkaWZmMS5uZXdNb2RlID09PSBGaWxlLm1vZGVzLlNZTUxJTkspIHtcbiAgICAgICAgY29udGVudENoYW5nZURpZmYgPSBkaWZmMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnRDaGFuZ2VEaWZmID0gZGlmZjE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRDaGFuZ2VEaWZmKSB7XG4gICAgICBjb25zdCBmaWxlUG9zaXRpb25zID0gWy4uLnRoaXMuZGlmZlRvRmlsZVBvc2l0aW9uLnZhbHVlcygpXTtcbiAgICAgIHRoaXMuZmlsZVRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0ZVBvc2l0aW9uRm4oZmlsZVBvc2l0aW9ucywgY29udGVudENoYW5nZURpZmYpO1xuXG4gICAgICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpO1xuICAgICAgaGFzaC51cGRhdGUoSlNPTi5zdHJpbmdpZnkoQXJyYXkuZnJvbSh0aGlzLmZpbGVUcmFuc2xhdGlvbnMuZW50cmllcygpKSkpO1xuICAgICAgdGhpcy5kaWdlc3QgPSBoYXNoLmRpZ2VzdCgnaGV4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsZVRyYW5zbGF0aW9ucyA9IG51bGw7XG4gICAgICB0aGlzLmRpZ2VzdCA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=