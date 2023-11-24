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
    return _react.default.createElement(_observeModel.default, {
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