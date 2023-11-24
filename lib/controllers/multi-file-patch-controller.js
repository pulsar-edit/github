"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _path = _interopRequireDefault(require("path"));

var _helpers = require("../helpers");

var _reporterProxy = require("../reporter-proxy");

var _propTypes2 = require("../prop-types");

var _changedFileItem = _interopRequireDefault(require("../items/changed-file-item"));

var _multiFilePatchView = _interopRequireDefault(require("../views/multi-file-patch-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MultiFilePatchController extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'selectedRowsChanged', 'undoLastDiscard', 'diveIntoMirrorPatch', 'openFile', 'toggleFile', 'toggleRows', 'toggleModeChange', 'toggleSymlinkChange', 'discardRows');
    this.state = {
      selectionMode: 'hunk',
      selectedRows: new Set(),
      hasMultipleFileSelections: false
    };
    this.mouseSelectionInProgress = false;
    this.stagingOperationInProgress = false;
    this.lastPatchString = null;
    this.patchChangePromise = new Promise(resolve => {
      this.resolvePatchChangePromise = resolve;
    });
  }

  componentDidUpdate(prevProps) {
    if (this.lastPatchString !== null && this.lastPatchString !== this.props.multiFilePatch.toString()) {
      this.resolvePatchChangePromise();
      this.patchChangePromise = new Promise(resolve => {
        this.resolvePatchChangePromise = resolve;
      });
    }
  }

  render() {
    return _react.default.createElement(_multiFilePatchView.default, _extends({}, this.props, {
      selectedRows: this.state.selectedRows,
      selectionMode: this.state.selectionMode,
      hasMultipleFileSelections: this.state.hasMultipleFileSelections,
      selectedRowsChanged: this.selectedRowsChanged,
      diveIntoMirrorPatch: this.diveIntoMirrorPatch,
      openFile: this.openFile,
      toggleFile: this.toggleFile,
      toggleRows: this.toggleRows,
      toggleModeChange: this.toggleModeChange,
      toggleSymlinkChange: this.toggleSymlinkChange,
      undoLastDiscard: this.undoLastDiscard,
      discardRows: this.discardRows,
      selectNextHunk: this.selectNextHunk,
      selectPreviousHunk: this.selectPreviousHunk,
      switchToIssueish: this.props.switchToIssueish
    }));
  }

  undoLastDiscard(filePatch, {
    eventSource
  } = {}) {
    (0, _reporterProxy.addEvent)('undo-last-discard', {
      package: 'github',
      component: this.constructor.name,
      eventSource
    });
    return this.props.undoLastDiscard(filePatch.getPath(), this.props.repository);
  }

  diveIntoMirrorPatch(filePatch) {
    const mirrorStatus = this.withStagingStatus({
      staged: 'unstaged',
      unstaged: 'staged'
    });
    const workingDirectory = this.props.repository.getWorkingDirectoryPath();

    const uri = _changedFileItem.default.buildURI(filePatch.getPath(), workingDirectory, mirrorStatus);

    this.props.destroy();
    return this.props.workspace.open(uri);
  }

  async openFile(filePatch, positions, pending) {
    const absolutePath = _path.default.join(this.props.repository.getWorkingDirectoryPath(), filePatch.getPath());

    const editor = await this.props.workspace.open(absolutePath, {
      pending
    });

    if (positions.length > 0) {
      editor.setCursorBufferPosition(positions[0], {
        autoscroll: false
      });

      for (const position of positions.slice(1)) {
        editor.addCursorAtBufferPosition(position);
      }

      editor.scrollToBufferPosition(positions[positions.length - 1], {
        center: true
      });
    }

    return editor;
  }

  toggleFile(filePatch) {
    return this.stagingOperation(() => {
      const methodName = this.withStagingStatus({
        staged: 'unstageFiles',
        unstaged: 'stageFiles'
      });
      return this.props.repository[methodName]([filePatch.getPath()]);
    });
  }

  async toggleRows(rowSet, nextSelectionMode) {
    let chosenRows = rowSet;

    if (chosenRows) {
      const nextMultipleFileSelections = this.props.multiFilePatch.spansMultipleFiles(chosenRows);
      await this.selectedRowsChanged(chosenRows, nextSelectionMode, nextMultipleFileSelections);
    } else {
      chosenRows = this.state.selectedRows;
    }

    if (chosenRows.size === 0) {
      return Promise.resolve();
    }

    return this.stagingOperation(() => {
      const patch = this.withStagingStatus({
        staged: () => this.props.multiFilePatch.getUnstagePatchForLines(chosenRows),
        unstaged: () => this.props.multiFilePatch.getStagePatchForLines(chosenRows)
      });
      return this.props.repository.applyPatchToIndex(patch);
    });
  }

  toggleModeChange(filePatch) {
    return this.stagingOperation(() => {
      const targetMode = this.withStagingStatus({
        unstaged: filePatch.getNewMode(),
        staged: filePatch.getOldMode()
      });
      return this.props.repository.stageFileModeChange(filePatch.getPath(), targetMode);
    });
  }

  toggleSymlinkChange(filePatch) {
    return this.stagingOperation(() => {
      const relPath = filePatch.getPath();
      const repository = this.props.repository;
      return this.withStagingStatus({
        unstaged: () => {
          if (filePatch.hasTypechange() && filePatch.getStatus() === 'added') {
            return repository.stageFileSymlinkChange(relPath);
          }

          return repository.stageFiles([relPath]);
        },
        staged: () => {
          if (filePatch.hasTypechange() && filePatch.getStatus() === 'deleted') {
            return repository.stageFileSymlinkChange(relPath);
          }

          return repository.unstageFiles([relPath]);
        }
      });
    });
  }

  async discardRows(rowSet, nextSelectionMode, {
    eventSource
  } = {}) {
    // (kuychaco) For now we only support discarding rows for MultiFilePatches that contain a single file patch
    // The only way to access this method from the UI is to be in a ChangedFileItem, which only has a single file patch
    // This check is duplicated in RootController#discardLines. We also want it here to prevent us from sending metrics
    // unnecessarily
    if (this.props.multiFilePatch.getFilePatches().length !== 1) {
      return Promise.resolve(null);
    }

    let chosenRows = rowSet;

    if (chosenRows) {
      const nextMultipleFileSelections = this.props.multiFilePatch.spansMultipleFiles(chosenRows);
      await this.selectedRowsChanged(chosenRows, nextSelectionMode, nextMultipleFileSelections);
    } else {
      chosenRows = this.state.selectedRows;
    }

    (0, _reporterProxy.addEvent)('discard-unstaged-changes', {
      package: 'github',
      component: this.constructor.name,
      lineCount: chosenRows.size,
      eventSource
    });
    return this.props.discardLines(this.props.multiFilePatch, chosenRows, this.props.repository);
  }

  selectedRowsChanged(rows, nextSelectionMode, nextMultipleFileSelections) {
    if ((0, _helpers.equalSets)(this.state.selectedRows, rows) && this.state.selectionMode === nextSelectionMode && this.state.hasMultipleFileSelections === nextMultipleFileSelections) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.setState({
        selectedRows: rows,
        selectionMode: nextSelectionMode,
        hasMultipleFileSelections: nextMultipleFileSelections
      }, resolve);
    });
  }

  withStagingStatus(callbacks) {
    const callback = callbacks[this.props.stagingStatus];
    /* istanbul ignore if */

    if (!callback) {
      throw new Error(`Unknown staging status: ${this.props.stagingStatus}`);
    }

    return callback instanceof Function ? callback() : callback;
  }

  stagingOperation(fn) {
    if (this.stagingOperationInProgress) {
      return null;
    }

    this.stagingOperationInProgress = true;
    this.lastPatchString = this.props.multiFilePatch.toString();
    const operationPromise = fn();
    operationPromise.then(() => this.patchChangePromise).then(() => {
      this.stagingOperationInProgress = false;
      this.lastPatchString = null;
    });
    return operationPromise;
  }

}

exports.default = MultiFilePatchController;

_defineProperty(MultiFilePatchController, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  multiFilePatch: _propTypes2.MultiFilePatchPropType.isRequired,
  hasUndoHistory: _propTypes.default.bool,
  reviewCommentsLoading: _propTypes.default.bool,
  reviewCommentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    thread: _propTypes.default.object.isRequired,
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
  })),
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  destroy: _propTypes.default.func.isRequired,
  discardLines: _propTypes.default.func,
  undoLastDiscard: _propTypes.default.func,
  surface: _propTypes.default.func,
  switchToIssueish: _propTypes.default.func
});