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
    return /*#__PURE__*/_react.default.createElement(_multiFilePatchView.default, _extends({}, this.props, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9tdWx0aS1maWxlLXBhdGNoLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiTXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25Nb2RlIiwic2VsZWN0ZWRSb3dzIiwiU2V0IiwiaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyIsIm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyIsInN0YWdpbmdPcGVyYXRpb25JblByb2dyZXNzIiwibGFzdFBhdGNoU3RyaW5nIiwicGF0Y2hDaGFuZ2VQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXNvbHZlUGF0Y2hDaGFuZ2VQcm9taXNlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwibXVsdGlGaWxlUGF0Y2giLCJ0b1N0cmluZyIsInJlbmRlciIsInNlbGVjdGVkUm93c0NoYW5nZWQiLCJkaXZlSW50b01pcnJvclBhdGNoIiwib3BlbkZpbGUiLCJ0b2dnbGVGaWxlIiwidG9nZ2xlUm93cyIsInRvZ2dsZU1vZGVDaGFuZ2UiLCJ0b2dnbGVTeW1saW5rQ2hhbmdlIiwidW5kb0xhc3REaXNjYXJkIiwiZGlzY2FyZFJvd3MiLCJzZWxlY3ROZXh0SHVuayIsInNlbGVjdFByZXZpb3VzSHVuayIsInN3aXRjaFRvSXNzdWVpc2giLCJmaWxlUGF0Y2giLCJldmVudFNvdXJjZSIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJuYW1lIiwiZ2V0UGF0aCIsInJlcG9zaXRvcnkiLCJtaXJyb3JTdGF0dXMiLCJ3aXRoU3RhZ2luZ1N0YXR1cyIsInN0YWdlZCIsInVuc3RhZ2VkIiwid29ya2luZ0RpcmVjdG9yeSIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwidXJpIiwiQ2hhbmdlZEZpbGVJdGVtIiwiYnVpbGRVUkkiLCJkZXN0cm95Iiwid29ya3NwYWNlIiwib3BlbiIsInBvc2l0aW9ucyIsInBlbmRpbmciLCJhYnNvbHV0ZVBhdGgiLCJwYXRoIiwiam9pbiIsImVkaXRvciIsImxlbmd0aCIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwiYXV0b3Njcm9sbCIsInBvc2l0aW9uIiwic2xpY2UiLCJhZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uIiwic2Nyb2xsVG9CdWZmZXJQb3NpdGlvbiIsImNlbnRlciIsInN0YWdpbmdPcGVyYXRpb24iLCJtZXRob2ROYW1lIiwicm93U2V0IiwibmV4dFNlbGVjdGlvbk1vZGUiLCJjaG9zZW5Sb3dzIiwibmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnMiLCJzcGFuc011bHRpcGxlRmlsZXMiLCJzaXplIiwicGF0Y2giLCJnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImdldFN0YWdlUGF0Y2hGb3JMaW5lcyIsImFwcGx5UGF0Y2hUb0luZGV4IiwidGFyZ2V0TW9kZSIsImdldE5ld01vZGUiLCJnZXRPbGRNb2RlIiwic3RhZ2VGaWxlTW9kZUNoYW5nZSIsInJlbFBhdGgiLCJoYXNUeXBlY2hhbmdlIiwiZ2V0U3RhdHVzIiwic3RhZ2VGaWxlU3ltbGlua0NoYW5nZSIsInN0YWdlRmlsZXMiLCJ1bnN0YWdlRmlsZXMiLCJnZXRGaWxlUGF0Y2hlcyIsImxpbmVDb3VudCIsImRpc2NhcmRMaW5lcyIsInJvd3MiLCJzZXRTdGF0ZSIsImNhbGxiYWNrcyIsImNhbGxiYWNrIiwic3RhZ2luZ1N0YXR1cyIsIkVycm9yIiwiRnVuY3Rpb24iLCJmbiIsIm9wZXJhdGlvblByb21pc2UiLCJ0aGVuIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwiTXVsdGlGaWxlUGF0Y2hQcm9wVHlwZSIsImhhc1VuZG9IaXN0b3J5IiwiYm9vbCIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwiYXJyYXlPZiIsInNoYXBlIiwidGhyZWFkIiwiY29tbWVudHMiLCJjb21tYW5kcyIsImtleW1hcHMiLCJ0b29s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QjtBQUN0REMsSUFBQUEsTUFBTSxFQUFFWCxtQkFBVUMsTUFBVixDQUFpQkMsVUFENkI7QUFFdERVLElBQUFBLFFBQVEsRUFBRVosbUJBQVVTLE9BQVYsQ0FBa0JULG1CQUFVQyxNQUE1QixFQUFvQ0M7QUFGUSxHQUFoQixDQUFsQixDQVBMO0FBWWpCckQsRUFBQUEsU0FBUyxFQUFFbUQsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBWlg7QUFhakJXLEVBQUFBLFFBQVEsRUFBRWIsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBYlY7QUFjakJZLEVBQUFBLE9BQU8sRUFBRWQsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBZFQ7QUFlakJhLEVBQUFBLFFBQVEsRUFBRWYsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBZlY7QUFnQmpCYyxFQUFBQSxNQUFNLEVBQUVoQixtQkFBVUMsTUFBVixDQUFpQkMsVUFoQlI7QUFrQmpCdEQsRUFBQUEsT0FBTyxFQUFFb0QsbUJBQVVpQixJQUFWLENBQWVmLFVBbEJQO0FBbUJqQmIsRUFBQUEsWUFBWSxFQUFFVyxtQkFBVWlCLElBbkJQO0FBb0JqQjFGLEVBQUFBLGVBQWUsRUFBRXlFLG1CQUFVaUIsSUFwQlY7QUFxQmpCQyxFQUFBQSxPQUFPLEVBQUVsQixtQkFBVWlCLElBckJGO0FBc0JqQnRGLEVBQUFBLGdCQUFnQixFQUFFcUUsbUJBQVVpQjtBQXRCWCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHthdXRvYmluZCwgZXF1YWxTZXRzfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7TXVsdGlGaWxlUGF0Y2hQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBNdWx0aUZpbGVQYXRjaFZpZXcgZnJvbSAnLi4vdmlld3MvbXVsdGktZmlsZS1wYXRjaC12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3RhZ2luZ1N0YXR1czogUHJvcFR5cGVzLm9uZU9mKFsnc3RhZ2VkJywgJ3Vuc3RhZ2VkJ10pLFxuICAgIG11bHRpRmlsZVBhdGNoOiBNdWx0aUZpbGVQYXRjaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLFxuXG4gICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICByZXZpZXdDb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZExpbmVzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIHN1cmZhY2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ3NlbGVjdGVkUm93c0NoYW5nZWQnLFxuICAgICAgJ3VuZG9MYXN0RGlzY2FyZCcsICdkaXZlSW50b01pcnJvclBhdGNoJywgJ29wZW5GaWxlJyxcbiAgICAgICd0b2dnbGVGaWxlJywgJ3RvZ2dsZVJvd3MnLCAndG9nZ2xlTW9kZUNoYW5nZScsICd0b2dnbGVTeW1saW5rQ2hhbmdlJywgJ2Rpc2NhcmRSb3dzJyxcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGlvbk1vZGU6ICdodW5rJyxcbiAgICAgIHNlbGVjdGVkUm93czogbmV3IFNldCgpLFxuICAgICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9uczogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG4gICAgdGhpcy5zdGFnaW5nT3BlcmF0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgdGhpcy5sYXN0UGF0Y2hTdHJpbmcgPSBudWxsO1xuICAgIHRoaXMucGF0Y2hDaGFuZ2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnJlc29sdmVQYXRjaENoYW5nZVByb21pc2UgPSByZXNvbHZlO1xuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHRoaXMubGFzdFBhdGNoU3RyaW5nICE9PSBudWxsICYmXG4gICAgICB0aGlzLmxhc3RQYXRjaFN0cmluZyAhPT0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC50b1N0cmluZygpXG4gICAgKSB7XG4gICAgICB0aGlzLnJlc29sdmVQYXRjaENoYW5nZVByb21pc2UoKTtcbiAgICAgIHRoaXMucGF0Y2hDaGFuZ2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMucmVzb2x2ZVBhdGNoQ2hhbmdlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNdWx0aUZpbGVQYXRjaFZpZXdcbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG5cbiAgICAgICAgc2VsZWN0ZWRSb3dzPXt0aGlzLnN0YXRlLnNlbGVjdGVkUm93c31cbiAgICAgICAgc2VsZWN0aW9uTW9kZT17dGhpcy5zdGF0ZS5zZWxlY3Rpb25Nb2RlfVxuICAgICAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zPXt0aGlzLnN0YXRlLmhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnN9XG4gICAgICAgIHNlbGVjdGVkUm93c0NoYW5nZWQ9e3RoaXMuc2VsZWN0ZWRSb3dzQ2hhbmdlZH1cblxuICAgICAgICBkaXZlSW50b01pcnJvclBhdGNoPXt0aGlzLmRpdmVJbnRvTWlycm9yUGF0Y2h9XG4gICAgICAgIG9wZW5GaWxlPXt0aGlzLm9wZW5GaWxlfVxuICAgICAgICB0b2dnbGVGaWxlPXt0aGlzLnRvZ2dsZUZpbGV9XG4gICAgICAgIHRvZ2dsZVJvd3M9e3RoaXMudG9nZ2xlUm93c31cbiAgICAgICAgdG9nZ2xlTW9kZUNoYW5nZT17dGhpcy50b2dnbGVNb2RlQ2hhbmdlfVxuICAgICAgICB0b2dnbGVTeW1saW5rQ2hhbmdlPXt0aGlzLnRvZ2dsZVN5bWxpbmtDaGFuZ2V9XG4gICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgIGRpc2NhcmRSb3dzPXt0aGlzLmRpc2NhcmRSb3dzfVxuICAgICAgICBzZWxlY3ROZXh0SHVuaz17dGhpcy5zZWxlY3ROZXh0SHVua31cbiAgICAgICAgc2VsZWN0UHJldmlvdXNIdW5rPXt0aGlzLnNlbGVjdFByZXZpb3VzSHVua31cbiAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkKGZpbGVQYXRjaCwge2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgYWRkRXZlbnQoJ3VuZG8tbGFzdC1kaXNjYXJkJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZSxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkKGZpbGVQYXRjaC5nZXRQYXRoKCksIHRoaXMucHJvcHMucmVwb3NpdG9yeSk7XG4gIH1cblxuICBkaXZlSW50b01pcnJvclBhdGNoKGZpbGVQYXRjaCkge1xuICAgIGNvbnN0IG1pcnJvclN0YXR1cyA9IHRoaXMud2l0aFN0YWdpbmdTdGF0dXMoe3N0YWdlZDogJ3Vuc3RhZ2VkJywgdW5zdGFnZWQ6ICdzdGFnZWQnfSk7XG4gICAgY29uc3Qgd29ya2luZ0RpcmVjdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICAgIGNvbnN0IHVyaSA9IENoYW5nZWRGaWxlSXRlbS5idWlsZFVSSShmaWxlUGF0Y2guZ2V0UGF0aCgpLCB3b3JraW5nRGlyZWN0b3J5LCBtaXJyb3JTdGF0dXMpO1xuXG4gICAgdGhpcy5wcm9wcy5kZXN0cm95KCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4odXJpKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5GaWxlKGZpbGVQYXRjaCwgcG9zaXRpb25zLCBwZW5kaW5nKSB7XG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCBmaWxlUGF0Y2guZ2V0UGF0aCgpKTtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKGFic29sdXRlUGF0aCwge3BlbmRpbmd9KTtcbiAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbnNbMF0sIHthdXRvc2Nyb2xsOiBmYWxzZX0pO1xuICAgICAgZm9yIChjb25zdCBwb3NpdGlvbiBvZiBwb3NpdGlvbnMuc2xpY2UoMSkpIHtcbiAgICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb25zW3Bvc2l0aW9ucy5sZW5ndGggLSAxXSwge2NlbnRlcjogdHJ1ZX0pO1xuICAgIH1cbiAgICByZXR1cm4gZWRpdG9yO1xuICB9XG5cbiAgdG9nZ2xlRmlsZShmaWxlUGF0Y2gpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFnaW5nT3BlcmF0aW9uKCgpID0+IHtcbiAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSB0aGlzLndpdGhTdGFnaW5nU3RhdHVzKHtzdGFnZWQ6ICd1bnN0YWdlRmlsZXMnLCB1bnN0YWdlZDogJ3N0YWdlRmlsZXMnfSk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5W21ldGhvZE5hbWVdKFtmaWxlUGF0Y2guZ2V0UGF0aCgpXSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB0b2dnbGVSb3dzKHJvd1NldCwgbmV4dFNlbGVjdGlvbk1vZGUpIHtcbiAgICBsZXQgY2hvc2VuUm93cyA9IHJvd1NldDtcbiAgICBpZiAoY2hvc2VuUm93cykge1xuICAgICAgY29uc3QgbmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnMgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLnNwYW5zTXVsdGlwbGVGaWxlcyhjaG9zZW5Sb3dzKTtcbiAgICAgIGF3YWl0IHRoaXMuc2VsZWN0ZWRSb3dzQ2hhbmdlZChjaG9zZW5Sb3dzLCBuZXh0U2VsZWN0aW9uTW9kZSwgbmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaG9zZW5Sb3dzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFJvd3M7XG4gICAgfVxuXG4gICAgaWYgKGNob3NlblJvd3Muc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YWdpbmdPcGVyYXRpb24oKCkgPT4ge1xuICAgICAgY29uc3QgcGF0Y2ggPSB0aGlzLndpdGhTdGFnaW5nU3RhdHVzKHtcbiAgICAgICAgc3RhZ2VkOiAoKSA9PiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldFVuc3RhZ2VQYXRjaEZvckxpbmVzKGNob3NlblJvd3MpLFxuICAgICAgICB1bnN0YWdlZDogKCkgPT4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRTdGFnZVBhdGNoRm9yTGluZXMoY2hvc2VuUm93cyksXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuYXBwbHlQYXRjaFRvSW5kZXgocGF0Y2gpO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlTW9kZUNoYW5nZShmaWxlUGF0Y2gpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFnaW5nT3BlcmF0aW9uKCgpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldE1vZGUgPSB0aGlzLndpdGhTdGFnaW5nU3RhdHVzKHtcbiAgICAgICAgdW5zdGFnZWQ6IGZpbGVQYXRjaC5nZXROZXdNb2RlKCksXG4gICAgICAgIHN0YWdlZDogZmlsZVBhdGNoLmdldE9sZE1vZGUoKSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5zdGFnZUZpbGVNb2RlQ2hhbmdlKGZpbGVQYXRjaC5nZXRQYXRoKCksIHRhcmdldE1vZGUpO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlU3ltbGlua0NoYW5nZShmaWxlUGF0Y2gpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFnaW5nT3BlcmF0aW9uKCgpID0+IHtcbiAgICAgIGNvbnN0IHJlbFBhdGggPSBmaWxlUGF0Y2guZ2V0UGF0aCgpO1xuICAgICAgY29uc3QgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeTtcbiAgICAgIHJldHVybiB0aGlzLndpdGhTdGFnaW5nU3RhdHVzKHtcbiAgICAgICAgdW5zdGFnZWQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAoZmlsZVBhdGNoLmhhc1R5cGVjaGFuZ2UoKSAmJiBmaWxlUGF0Y2guZ2V0U3RhdHVzKCkgPT09ICdhZGRlZCcpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBvc2l0b3J5LnN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UocmVsUGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlcG9zaXRvcnkuc3RhZ2VGaWxlcyhbcmVsUGF0aF0pO1xuICAgICAgICB9LFxuICAgICAgICBzdGFnZWQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAoZmlsZVBhdGNoLmhhc1R5cGVjaGFuZ2UoKSAmJiBmaWxlUGF0Y2guZ2V0U3RhdHVzKCkgPT09ICdkZWxldGVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcG9zaXRvcnkuc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShyZWxQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVwb3NpdG9yeS51bnN0YWdlRmlsZXMoW3JlbFBhdGhdKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGlzY2FyZFJvd3Mocm93U2V0LCBuZXh0U2VsZWN0aW9uTW9kZSwge2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgLy8gKGt1eWNoYWNvKSBGb3Igbm93IHdlIG9ubHkgc3VwcG9ydCBkaXNjYXJkaW5nIHJvd3MgZm9yIE11bHRpRmlsZVBhdGNoZXMgdGhhdCBjb250YWluIGEgc2luZ2xlIGZpbGUgcGF0Y2hcbiAgICAvLyBUaGUgb25seSB3YXkgdG8gYWNjZXNzIHRoaXMgbWV0aG9kIGZyb20gdGhlIFVJIGlzIHRvIGJlIGluIGEgQ2hhbmdlZEZpbGVJdGVtLCB3aGljaCBvbmx5IGhhcyBhIHNpbmdsZSBmaWxlIHBhdGNoXG4gICAgLy8gVGhpcyBjaGVjayBpcyBkdXBsaWNhdGVkIGluIFJvb3RDb250cm9sbGVyI2Rpc2NhcmRMaW5lcy4gV2UgYWxzbyB3YW50IGl0IGhlcmUgdG8gcHJldmVudCB1cyBmcm9tIHNlbmRpbmcgbWV0cmljc1xuICAgIC8vIHVubmVjZXNzYXJpbHlcbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG5cbiAgICBsZXQgY2hvc2VuUm93cyA9IHJvd1NldDtcbiAgICBpZiAoY2hvc2VuUm93cykge1xuICAgICAgY29uc3QgbmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnMgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLnNwYW5zTXVsdGlwbGVGaWxlcyhjaG9zZW5Sb3dzKTtcbiAgICAgIGF3YWl0IHRoaXMuc2VsZWN0ZWRSb3dzQ2hhbmdlZChjaG9zZW5Sb3dzLCBuZXh0U2VsZWN0aW9uTW9kZSwgbmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaG9zZW5Sb3dzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFJvd3M7XG4gICAgfVxuXG4gICAgYWRkRXZlbnQoJ2Rpc2NhcmQtdW5zdGFnZWQtY2hhbmdlcycsIHtcbiAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICBsaW5lQ291bnQ6IGNob3NlblJvd3Muc2l6ZSxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZExpbmVzKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2gsIGNob3NlblJvd3MsIHRoaXMucHJvcHMucmVwb3NpdG9yeSk7XG4gIH1cblxuICBzZWxlY3RlZFJvd3NDaGFuZ2VkKHJvd3MsIG5leHRTZWxlY3Rpb25Nb2RlLCBuZXh0TXVsdGlwbGVGaWxlU2VsZWN0aW9ucykge1xuICAgIGlmIChcbiAgICAgIGVxdWFsU2V0cyh0aGlzLnN0YXRlLnNlbGVjdGVkUm93cywgcm93cykgJiZcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uTW9kZSA9PT0gbmV4dFNlbGVjdGlvbk1vZGUgJiZcbiAgICAgIHRoaXMuc3RhdGUuaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyA9PT0gbmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnNcbiAgICApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRSb3dzOiByb3dzLFxuICAgICAgICBzZWxlY3Rpb25Nb2RlOiBuZXh0U2VsZWN0aW9uTW9kZSxcbiAgICAgICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9uczogbmV4dE11bHRpcGxlRmlsZVNlbGVjdGlvbnMsXG4gICAgICB9LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdpdGhTdGFnaW5nU3RhdHVzKGNhbGxiYWNrcykge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gY2FsbGJhY2tzW3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c107XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHN0YWdpbmcgc3RhdHVzOiAke3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c31gKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBjYWxsYmFjaygpIDogY2FsbGJhY2s7XG4gIH1cblxuICBzdGFnaW5nT3BlcmF0aW9uKGZuKSB7XG4gICAgaWYgKHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIHRoaXMubGFzdFBhdGNoU3RyaW5nID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC50b1N0cmluZygpO1xuICAgIGNvbnN0IG9wZXJhdGlvblByb21pc2UgPSBmbigpO1xuXG4gICAgb3BlcmF0aW9uUHJvbWlzZVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wYXRjaENoYW5nZVByb21pc2UpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhZ2luZ09wZXJhdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYXN0UGF0Y2hTdHJpbmcgPSBudWxsO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uUHJvbWlzZTtcbiAgfVxufVxuIl19