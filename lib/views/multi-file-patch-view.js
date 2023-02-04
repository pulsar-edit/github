"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _atom = require("atom");
var _eventKit = require("event-kit");
var _helpers = require("../helpers");
var _reporterProxy = require("../reporter-proxy");
var _propTypes2 = require("../prop-types");
var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));
var _marker = _interopRequireDefault(require("../atom/marker"));
var _markerLayer = _interopRequireDefault(require("../atom/marker-layer"));
var _decoration = _interopRequireDefault(require("../atom/decoration"));
var _gutter = _interopRequireDefault(require("../atom/gutter"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _filePatchHeaderView = _interopRequireDefault(require("./file-patch-header-view"));
var _filePatchMetaView = _interopRequireDefault(require("./file-patch-meta-view"));
var _hunkHeaderView = _interopRequireDefault(require("./hunk-header-view"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _changedFileItem = _interopRequireDefault(require("../items/changed-file-item"));
var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));
var _commentGutterDecorationController = _interopRequireDefault(require("../controllers/comment-gutter-decoration-controller"));
var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));
var _file = _interopRequireDefault(require("../models/patch/file"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const executableText = {
  [_file.default.modes.NORMAL]: 'non executable',
  [_file.default.modes.EXECUTABLE]: 'executable'
};
class MultiFilePatchView extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "renderFilePatchDecorations", (filePatch, index) => {
      const isCollapsed = !filePatch.getRenderStatus().isVisible();
      const isEmpty = filePatch.getMarker().getRange().isEmpty();
      const isExpandable = filePatch.getRenderStatus().isExpandable();
      const isUnavailable = isCollapsed && !isExpandable;
      const atEnd = filePatch.getStartRange().start.isEqual(this.props.multiFilePatch.getBuffer().getEndPosition());
      const position = isEmpty && atEnd ? 'after' : 'before';
      return _react.default.createElement(_react.Fragment, {
        key: filePatch.getPath()
      }, _react.default.createElement(_marker.default, {
        invalidate: "never",
        bufferRange: filePatch.getStartRange()
      }, _react.default.createElement(_decoration.default, {
        type: "block",
        position: position,
        order: index,
        className: "github-FilePatchView-controlBlock"
      }, _react.default.createElement(_filePatchHeaderView.default, {
        itemType: this.props.itemType,
        relPath: filePatch.getPath(),
        newPath: filePatch.getStatus() === 'renamed' ? filePatch.getNewPath() : null,
        stagingStatus: this.props.stagingStatus,
        isPartiallyStaged: this.props.isPartiallyStaged,
        hasUndoHistory: this.props.hasUndoHistory,
        hasMultipleFileSelections: this.props.hasMultipleFileSelections,
        tooltips: this.props.tooltips,
        undoLastDiscard: () => this.undoLastDiscardFromButton(filePatch),
        diveIntoMirrorPatch: () => this.props.diveIntoMirrorPatch(filePatch),
        openFile: () => this.didOpenFile({
          selectedFilePatch: filePatch
        }),
        toggleFile: () => this.props.toggleFile(filePatch),
        isCollapsed: isCollapsed,
        triggerCollapse: () => this.props.multiFilePatch.collapseFilePatch(filePatch),
        triggerExpand: () => this.props.multiFilePatch.expandFilePatch(filePatch)
      }), !isCollapsed && this.renderSymlinkChangeMeta(filePatch), !isCollapsed && this.renderExecutableModeChangeMeta(filePatch))), isExpandable && this.renderDiffGate(filePatch, position, index), isUnavailable && this.renderDiffUnavailable(filePatch, position, index), this.renderHunkHeaders(filePatch, index));
    });
    _defineProperty(this, "undoLastDiscardFromCoreUndo", () => {
      if (this.props.hasUndoHistory) {
        const selectedFilePatches = Array.from(this.getSelectedFilePatches());
        /* istanbul ignore else */
        if (this.props.itemType === _changedFileItem.default) {
          this.props.undoLastDiscard(selectedFilePatches[0], {
            eventSource: {
              command: 'core:undo'
            }
          });
        }
      }
    });
    _defineProperty(this, "undoLastDiscardFromButton", filePatch => {
      this.props.undoLastDiscard(filePatch, {
        eventSource: 'button'
      });
    });
    _defineProperty(this, "discardSelectionFromCommand", () => {
      return this.props.discardRows(this.props.selectedRows, this.props.selectionMode, {
        eventSource: {
          command: 'github:discard-selected-lines'
        }
      });
    });
    _defineProperty(this, "didToggleModeChange", () => {
      return Promise.all(Array.from(this.getSelectedFilePatches()).filter(fp => fp.didChangeExecutableMode()).map(this.props.toggleModeChange));
    });
    _defineProperty(this, "didToggleSymlinkChange", () => {
      return Promise.all(Array.from(this.getSelectedFilePatches()).filter(fp => fp.hasTypechange()).map(this.props.toggleSymlinkChange));
    });
    _defineProperty(this, "scrollToFile", ({
      changedFilePath,
      changedFilePosition
    }) => {
      /* istanbul ignore next */
      this.refEditor.map(e => {
        const row = this.props.multiFilePatch.getBufferRowForDiffPosition(changedFilePath, changedFilePosition);
        if (row === null) {
          return null;
        }
        e.scrollToBufferPosition({
          row,
          column: 0
        }, {
          center: true
        });
        e.setCursorBufferPosition({
          row,
          column: 0
        });
        return null;
      });
    });
    (0, _helpers.autobind)(this, 'didMouseDownOnHeader', 'didMouseDownOnLineNumber', 'didMouseMoveOnLineNumber', 'didMouseUp', 'didConfirm', 'didToggleSelectionMode', 'selectNextHunk', 'selectPreviousHunk', 'didOpenFile', 'didAddSelection', 'didChangeSelectionRange', 'didDestroySelection', 'oldLineNumberLabel', 'newLineNumberLabel');
    this.mouseSelectionInProgress = false;
    this.lastMouseMoveLine = null;
    this.nextSelectionMode = null;
    this.refRoot = new _refHolder.default();
    this.refEditor = new _refHolder.default();
    this.refEditorElement = new _refHolder.default();
    this.mounted = false;
    this.subs = new _eventKit.CompositeDisposable();
    this.subs.add(this.refEditor.observe(editor => {
      this.refEditorElement.setter(editor.getElement());
      if (this.props.refEditor) {
        this.props.refEditor.setter(editor);
      }
    }), this.refEditorElement.observe(element => {
      this.props.refInitialFocus && this.props.refInitialFocus.setter(element);
    }));

    // Synchronously maintain the editor's scroll position and logical selection across buffer updates.
    this.suppressChanges = false;
    let lastScrollTop = null;
    let lastScrollLeft = null;
    let lastSelectionIndex = null;
    this.subs.add(this.props.onWillUpdatePatch(() => {
      this.suppressChanges = true;
      this.refEditor.map(editor => {
        lastSelectionIndex = this.props.multiFilePatch.getMaxSelectionIndex(this.props.selectedRows);
        lastScrollTop = editor.getElement().getScrollTop();
        lastScrollLeft = editor.getElement().getScrollLeft();
        return null;
      });
    }), this.props.onDidUpdatePatch(nextPatch => {
      this.refEditor.map(editor => {
        /* istanbul ignore else */
        if (lastSelectionIndex !== null) {
          const nextSelectionRange = nextPatch.getSelectionRangeForIndex(lastSelectionIndex);
          if (this.props.selectionMode === 'line') {
            this.nextSelectionMode = 'line';
            editor.setSelectedBufferRange(nextSelectionRange);
          } else {
            const nextHunks = new Set(_atom.Range.fromObject(nextSelectionRange).getRows().map(row => nextPatch.getHunkAt(row)).filter(Boolean));
            /* istanbul ignore next */
            const nextRanges = nextHunks.size > 0 ? Array.from(nextHunks, hunk => hunk.getRange()) : [[[0, 0], [0, 0]]];
            this.nextSelectionMode = 'hunk';
            editor.setSelectedBufferRanges(nextRanges);
          }
        }

        /* istanbul ignore else */
        if (lastScrollTop !== null) {
          editor.getElement().setScrollTop(lastScrollTop);
        }

        /* istanbul ignore else */
        if (lastScrollLeft !== null) {
          editor.getElement().setScrollLeft(lastScrollLeft);
        }
        return null;
      });
      this.suppressChanges = false;
      this.didChangeSelectedRows();
    }));
  }
  componentDidMount() {
    this.mounted = true;
    this.measurePerformance('mount');
    window.addEventListener('mouseup', this.didMouseUp);
    this.refEditor.map(editor => {
      // this.props.multiFilePatch is guaranteed to contain at least one FilePatch if <AtomTextEditor> is rendered.
      const [firstPatch] = this.props.multiFilePatch.getFilePatches();
      const [firstHunk] = firstPatch.getHunks();
      if (!firstHunk) {
        return null;
      }
      this.nextSelectionMode = 'hunk';
      editor.setSelectedBufferRange(firstHunk.getRange());
      return null;
    });
    this.subs.add(this.props.config.onDidChange('github.showDiffIconGutter', () => this.forceUpdate()));
    const {
      initChangedFilePath,
      initChangedFilePosition
    } = this.props;

    /* istanbul ignore next */
    if (initChangedFilePath && initChangedFilePosition >= 0) {
      this.scrollToFile({
        changedFilePath: initChangedFilePath,
        changedFilePosition: initChangedFilePosition
      });
    }

    /* istanbul ignore if */
    if (this.props.onOpenFilesTab) {
      this.subs.add(this.props.onOpenFilesTab(this.scrollToFile));
    }
  }
  componentDidUpdate(prevProps) {
    this.measurePerformance('update');
    if (prevProps.refInitialFocus !== this.props.refInitialFocus) {
      prevProps.refInitialFocus && prevProps.refInitialFocus.setter(null);
      this.props.refInitialFocus && this.refEditorElement.map(this.props.refInitialFocus.setter);
    }
    if (this.props.multiFilePatch === prevProps.multiFilePatch) {
      this.nextSelectionMode = null;
    }
  }
  componentWillUnmount() {
    window.removeEventListener('mouseup', this.didMouseUp);
    this.subs.dispose();
    this.mounted = false;
    performance.clearMarks();
    performance.clearMeasures();
  }
  render() {
    const rootClass = (0, _classnames.default)('github-FilePatchView', {
      [`github-FilePatchView--${this.props.stagingStatus}`]: this.props.stagingStatus
    }, {
      'github-FilePatchView--blank': !this.props.multiFilePatch.anyPresent()
    }, {
      'github-FilePatchView--hunkMode': this.props.selectionMode === 'hunk'
    });
    if (this.mounted) {
      performance.mark('MultiFilePatchView-update-start');
    } else {
      performance.mark('MultiFilePatchView-mount-start');
    }
    return _react.default.createElement("div", {
      className: rootClass,
      ref: this.refRoot.setter
    }, this.renderCommands(), _react.default.createElement("main", {
      className: "github-FilePatchView-container"
    }, this.props.multiFilePatch.anyPresent() ? this.renderNonEmptyPatch() : this.renderEmptyPatch()));
  }
  renderCommands() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return _react.default.createElement(_commands.default, {
        registry: this.props.commands,
        target: this.refRoot
      }, _react.default.createElement(_commands.Command, {
        command: "github:select-next-hunk",
        callback: this.selectNextHunk
      }), _react.default.createElement(_commands.Command, {
        command: "github:select-previous-hunk",
        callback: this.selectPreviousHunk
      }), _react.default.createElement(_commands.Command, {
        command: "github:toggle-patch-selection-mode",
        callback: this.didToggleSelectionMode
      }));
    }
    let stageModeCommand = null;
    let stageSymlinkCommand = null;
    if (this.props.multiFilePatch.didAnyChangeExecutableMode()) {
      const command = this.props.stagingStatus === 'unstaged' ? 'github:stage-file-mode-change' : 'github:unstage-file-mode-change';
      stageModeCommand = _react.default.createElement(_commands.Command, {
        command: command,
        callback: this.didToggleModeChange
      });
    }
    if (this.props.multiFilePatch.anyHaveTypechange()) {
      const command = this.props.stagingStatus === 'unstaged' ? 'github:stage-symlink-change' : 'github:unstage-symlink-change';
      stageSymlinkCommand = _react.default.createElement(_commands.Command, {
        command: command,
        callback: this.didToggleSymlinkChange
      });
    }
    return _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, _react.default.createElement(_commands.Command, {
      command: "github:select-next-hunk",
      callback: this.selectNextHunk
    }), _react.default.createElement(_commands.Command, {
      command: "github:select-previous-hunk",
      callback: this.selectPreviousHunk
    }), _react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.didConfirm
    }), _react.default.createElement(_commands.Command, {
      command: "core:undo",
      callback: this.undoLastDiscardFromCoreUndo
    }), _react.default.createElement(_commands.Command, {
      command: "github:discard-selected-lines",
      callback: this.discardSelectionFromCommand
    }), _react.default.createElement(_commands.Command, {
      command: "github:jump-to-file",
      callback: this.didOpenFile
    }), _react.default.createElement(_commands.Command, {
      command: "github:surface",
      callback: this.props.surface
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-patch-selection-mode",
      callback: this.didToggleSelectionMode
    }), stageModeCommand, stageSymlinkCommand, /* istanbul ignore next */atom.inDevMode() && _react.default.createElement(_commands.Command, {
      command: "github:inspect-patch",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(this.props.multiFilePatch.getPatchBuffer().inspect({
          layerNames: ['patch', 'hunk']
        }));
      }
    }), /* istanbul ignore next */atom.inDevMode() && _react.default.createElement(_commands.Command, {
      command: "github:inspect-regions",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(this.props.multiFilePatch.getPatchBuffer().inspect({
          layerNames: ['unchanged', 'deletion', 'addition', 'nonewline']
        }));
      }
    }), /* istanbul ignore next */atom.inDevMode() && _react.default.createElement(_commands.Command, {
      command: "github:inspect-mfp",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(this.props.multiFilePatch.inspect());
      }
    }));
  }
  renderEmptyPatch() {
    return _react.default.createElement("p", {
      className: "github-FilePatchView-message icon icon-info"
    }, "No changes to display");
  }
  renderNonEmptyPatch() {
    return _react.default.createElement(_atomTextEditor.default, {
      workspace: this.props.workspace,
      buffer: this.props.multiFilePatch.getBuffer(),
      lineNumberGutterVisible: false,
      autoWidth: false,
      autoHeight: false,
      readOnly: true,
      softWrapped: true,
      didAddSelection: this.didAddSelection,
      didChangeSelectionRange: this.didChangeSelectionRange,
      didDestroySelection: this.didDestroySelection,
      refModel: this.refEditor,
      hideEmptiness: true
    }, _react.default.createElement(_gutter.default, {
      name: "old-line-numbers",
      priority: 1,
      className: "old",
      type: "line-number",
      labelFn: this.oldLineNumberLabel,
      onMouseDown: this.didMouseDownOnLineNumber,
      onMouseMove: this.didMouseMoveOnLineNumber
    }), _react.default.createElement(_gutter.default, {
      name: "new-line-numbers",
      priority: 2,
      className: "new",
      type: "line-number",
      labelFn: this.newLineNumberLabel,
      onMouseDown: this.didMouseDownOnLineNumber,
      onMouseMove: this.didMouseMoveOnLineNumber
    }), _react.default.createElement(_gutter.default, {
      name: "github-comment-icon",
      priority: 3,
      className: "comment",
      type: "decorated"
    }), this.props.config.get('github.showDiffIconGutter') && _react.default.createElement(_gutter.default, {
      name: "diff-icons",
      priority: 4,
      type: "line-number",
      className: "icons",
      labelFn: _helpers.blankLabel,
      onMouseDown: this.didMouseDownOnLineNumber,
      onMouseMove: this.didMouseMoveOnLineNumber
    }), this.renderPRCommentIcons(), this.props.multiFilePatch.getFilePatches().map(this.renderFilePatchDecorations), this.renderLineDecorations(Array.from(this.props.selectedRows, row => _atom.Range.fromObject([[row, 0], [row, Infinity]])), 'github-FilePatchView-line--selected', {
      gutter: true,
      icon: true,
      line: true
    }), this.renderDecorationsOnLayer(this.props.multiFilePatch.getAdditionLayer(), 'github-FilePatchView-line--added', {
      icon: true,
      line: true
    }), this.renderDecorationsOnLayer(this.props.multiFilePatch.getDeletionLayer(), 'github-FilePatchView-line--deleted', {
      icon: true,
      line: true
    }), this.renderDecorationsOnLayer(this.props.multiFilePatch.getNoNewlineLayer(), 'github-FilePatchView-line--nonewline', {
      icon: true,
      line: true
    }));
  }
  renderPRCommentIcons() {
    if (this.props.itemType !== _issueishDetailItem.default || this.props.reviewCommentsLoading) {
      return null;
    }
    return this.props.reviewCommentThreads.map(({
      comments,
      thread
    }) => {
      const {
        path,
        position
      } = comments[0];
      if (!this.props.multiFilePatch.getPatchForPath(path)) {
        return null;
      }
      const row = this.props.multiFilePatch.getBufferRowForDiffPosition(path, position);
      if (row === null) {
        return null;
      }
      const isRowSelected = this.props.selectedRows.has(row);
      return _react.default.createElement(_commentGutterDecorationController.default, {
        key: `github-comment-gutter-decoration-${thread.id}`,
        commentRow: row,
        threadId: thread.id,
        workspace: this.props.workspace,
        endpoint: this.props.endpoint,
        owner: this.props.owner,
        repo: this.props.repo,
        number: this.props.number,
        workdir: this.props.workdirPath,
        extraClasses: isRowSelected ? ['github-FilePatchView-line--selected'] : [],
        parent: this.constructor.name
      });
    });
  }
  renderDiffGate(filePatch, position, orderOffset) {
    const showDiff = () => {
      (0, _reporterProxy.addEvent)('expand-file-patch', {
        component: this.constructor.name,
        package: 'github'
      });
      this.props.multiFilePatch.expandFilePatch(filePatch);
    };
    return _react.default.createElement(_marker.default, {
      invalidate: "never",
      bufferRange: filePatch.getStartRange()
    }, _react.default.createElement(_decoration.default, {
      type: "block",
      order: orderOffset + 0.1,
      position: position,
      className: "github-FilePatchView-controlBlock"
    }, _react.default.createElement("p", {
      className: "github-FilePatchView-message icon icon-info"
    }, "Large diffs are collapsed by default for performance reasons.", _react.default.createElement("br", null), _react.default.createElement("button", {
      className: "github-FilePatchView-showDiffButton",
      onClick: showDiff
    }, " Load Diff"))));
  }
  renderDiffUnavailable(filePatch, position, orderOffset) {
    return _react.default.createElement(_marker.default, {
      invalidate: "never",
      bufferRange: filePatch.getStartRange()
    }, _react.default.createElement(_decoration.default, {
      type: "block",
      order: orderOffset + 0.1,
      position: position,
      className: "github-FilePatchView-controlBlock"
    }, _react.default.createElement("p", {
      className: "github-FilePatchView-message icon icon-warning"
    }, "This diff is too large to load at all. Use the command-line to view it.")));
  }
  renderExecutableModeChangeMeta(filePatch) {
    if (!filePatch.didChangeExecutableMode()) {
      return null;
    }
    const oldMode = filePatch.getOldMode();
    const newMode = filePatch.getNewMode();
    const attrs = this.props.stagingStatus === 'unstaged' ? {
      actionIcon: 'icon-move-down',
      actionText: 'Stage Mode Change'
    } : {
      actionIcon: 'icon-move-up',
      actionText: 'Unstage Mode Change'
    };
    return _react.default.createElement(_filePatchMetaView.default, {
      title: "Mode change",
      actionIcon: attrs.actionIcon,
      actionText: attrs.actionText,
      itemType: this.props.itemType,
      action: () => this.props.toggleModeChange(filePatch)
    }, _react.default.createElement(_react.Fragment, null, "File changed mode", _react.default.createElement("span", {
      className: "github-FilePatchView-metaDiff github-FilePatchView-metaDiff--removed"
    }, "from ", executableText[oldMode], " ", _react.default.createElement("code", null, oldMode)), _react.default.createElement("span", {
      className: "github-FilePatchView-metaDiff github-FilePatchView-metaDiff--added"
    }, "to ", executableText[newMode], " ", _react.default.createElement("code", null, newMode))));
  }
  renderSymlinkChangeMeta(filePatch) {
    if (!filePatch.hasSymlink()) {
      return null;
    }
    let detail = _react.default.createElement("div", null);
    let title = '';
    const oldSymlink = filePatch.getOldSymlink();
    const newSymlink = filePatch.getNewSymlink();
    if (oldSymlink && newSymlink) {
      detail = _react.default.createElement(_react.Fragment, null, "Symlink changed", _react.default.createElement("span", {
        className: (0, _classnames.default)('github-FilePatchView-metaDiff', 'github-FilePatchView-metaDiff--fullWidth', 'github-FilePatchView-metaDiff--removed')
      }, "from ", _react.default.createElement("code", null, oldSymlink)), _react.default.createElement("span", {
        className: (0, _classnames.default)('github-FilePatchView-metaDiff', 'github-FilePatchView-metaDiff--fullWidth', 'github-FilePatchView-metaDiff--added')
      }, "to ", _react.default.createElement("code", null, newSymlink)), ".");
      title = 'Symlink changed';
    } else if (oldSymlink && !newSymlink) {
      detail = _react.default.createElement(_react.Fragment, null, "Symlink", _react.default.createElement("span", {
        className: "github-FilePatchView-metaDiff github-FilePatchView-metaDiff--removed"
      }, "to ", _react.default.createElement("code", null, oldSymlink)), "deleted.");
      title = 'Symlink deleted';
    } else {
      detail = _react.default.createElement(_react.Fragment, null, "Symlink", _react.default.createElement("span", {
        className: "github-FilePatchView-metaDiff github-FilePatchView-metaDiff--added"
      }, "to ", _react.default.createElement("code", null, newSymlink)), "created.");
      title = 'Symlink created';
    }
    const attrs = this.props.stagingStatus === 'unstaged' ? {
      actionIcon: 'icon-move-down',
      actionText: 'Stage Symlink Change'
    } : {
      actionIcon: 'icon-move-up',
      actionText: 'Unstage Symlink Change'
    };
    return _react.default.createElement(_filePatchMetaView.default, {
      title: title,
      actionIcon: attrs.actionIcon,
      actionText: attrs.actionText,
      itemType: this.props.itemType,
      action: () => this.props.toggleSymlinkChange(filePatch)
    }, _react.default.createElement(_react.Fragment, null, detail));
  }
  renderHunkHeaders(filePatch, orderOffset) {
    const toggleVerb = this.props.stagingStatus === 'unstaged' ? 'Stage' : 'Unstage';
    const selectedHunks = new Set(Array.from(this.props.selectedRows, row => this.props.multiFilePatch.getHunkAt(row)));
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_markerLayer.default, null, filePatch.getHunks().map((hunk, index) => {
      const containsSelection = this.props.selectionMode === 'line' && selectedHunks.has(hunk);
      const isSelected = this.props.selectionMode === 'hunk' && selectedHunks.has(hunk);
      let buttonSuffix = '';
      if (containsSelection) {
        buttonSuffix += 'Selected Line';
        if (this.props.selectedRows.size > 1) {
          buttonSuffix += 's';
        }
      } else {
        buttonSuffix += 'Hunk';
        if (selectedHunks.size > 1) {
          buttonSuffix += 's';
        }
      }
      const toggleSelectionLabel = `${toggleVerb} ${buttonSuffix}`;
      const discardSelectionLabel = `Discard ${buttonSuffix}`;
      const startPoint = hunk.getRange().start;
      const startRange = new _atom.Range(startPoint, startPoint);
      return _react.default.createElement(_marker.default, {
        key: `hunkHeader-${index}`,
        bufferRange: startRange,
        invalidate: "never"
      }, _react.default.createElement(_decoration.default, {
        type: "block",
        order: orderOffset + 0.2,
        className: "github-FilePatchView-controlBlock"
      }, _react.default.createElement(_hunkHeaderView.default, {
        refTarget: this.refEditorElement,
        hunk: hunk,
        isSelected: isSelected,
        stagingStatus: this.props.stagingStatus,
        selectionMode: "line",
        toggleSelectionLabel: toggleSelectionLabel,
        discardSelectionLabel: discardSelectionLabel,
        tooltips: this.props.tooltips,
        keymaps: this.props.keymaps,
        toggleSelection: () => this.toggleHunkSelection(hunk, containsSelection),
        discardSelection: () => this.discardHunkSelection(hunk, containsSelection),
        mouseDown: this.didMouseDownOnHeader,
        itemType: this.props.itemType
      })));
    })));
  }
  renderLineDecorations(ranges, lineClass, {
    line,
    gutter,
    icon,
    refHolder
  }) {
    if (ranges.length === 0) {
      return null;
    }
    const holder = refHolder || new _refHolder.default();
    return _react.default.createElement(_markerLayer.default, {
      handleLayer: holder.setter
    }, ranges.map((range, index) => {
      return _react.default.createElement(_marker.default, {
        key: `line-${lineClass}-${index}`,
        bufferRange: range,
        invalidate: "never"
      });
    }), this.renderDecorations(lineClass, {
      line,
      gutter,
      icon
    }));
  }
  renderDecorationsOnLayer(layer, lineClass, {
    line,
    gutter,
    icon
  }) {
    if (layer.getMarkerCount() === 0) {
      return null;
    }
    return _react.default.createElement(_markerLayer.default, {
      external: layer
    }, this.renderDecorations(lineClass, {
      line,
      gutter,
      icon
    }));
  }
  renderDecorations(lineClass, {
    line,
    gutter,
    icon
  }) {
    return _react.default.createElement(_react.Fragment, null, line && _react.default.createElement(_decoration.default, {
      type: "line",
      className: lineClass,
      omitEmptyLastRow: false
    }), gutter && _react.default.createElement(_react.Fragment, null, _react.default.createElement(_decoration.default, {
      type: "line-number",
      gutterName: "old-line-numbers",
      className: lineClass,
      omitEmptyLastRow: false
    }), _react.default.createElement(_decoration.default, {
      type: "line-number",
      gutterName: "new-line-numbers",
      className: lineClass,
      omitEmptyLastRow: false
    }), _react.default.createElement(_decoration.default, {
      type: "gutter",
      gutterName: "github-comment-icon",
      className: `github-editorCommentGutterIcon empty ${lineClass}`,
      omitEmptyLastRow: false
    })), icon && _react.default.createElement(_decoration.default, {
      type: "line-number",
      gutterName: "diff-icons",
      className: lineClass,
      omitEmptyLastRow: false
    }));
  }
  toggleHunkSelection(hunk, containsSelection) {
    if (containsSelection) {
      return this.props.toggleRows(this.props.selectedRows, this.props.selectionMode, {
        eventSource: 'button'
      });
    } else {
      const changeRows = new Set(hunk.getChanges().reduce((rows, change) => {
        rows.push(...change.getBufferRows());
        return rows;
      }, []));
      return this.props.toggleRows(changeRows, 'hunk', {
        eventSource: 'button'
      });
    }
  }
  discardHunkSelection(hunk, containsSelection) {
    if (containsSelection) {
      return this.props.discardRows(this.props.selectedRows, this.props.selectionMode, {
        eventSource: 'button'
      });
    } else {
      const changeRows = new Set(hunk.getChanges().reduce((rows, change) => {
        rows.push(...change.getBufferRows());
        return rows;
      }, []));
      return this.props.discardRows(changeRows, 'hunk', {
        eventSource: 'button'
      });
    }
  }
  didMouseDownOnHeader(event, hunk) {
    this.nextSelectionMode = 'hunk';
    this.handleSelectionEvent(event, hunk.getRange());
  }
  didMouseDownOnLineNumber(event) {
    const line = event.bufferRow;
    if (line === undefined || isNaN(line)) {
      return;
    }
    this.nextSelectionMode = 'line';
    if (this.handleSelectionEvent(event.domEvent, [[line, 0], [line, Infinity]])) {
      this.mouseSelectionInProgress = true;
    }
  }
  didMouseMoveOnLineNumber(event) {
    if (!this.mouseSelectionInProgress) {
      return;
    }
    const line = event.bufferRow;
    if (this.lastMouseMoveLine === line || line === undefined || isNaN(line)) {
      return;
    }
    this.lastMouseMoveLine = line;
    this.nextSelectionMode = 'line';
    this.handleSelectionEvent(event.domEvent, [[line, 0], [line, Infinity]], {
      add: true
    });
  }
  didMouseUp() {
    this.mouseSelectionInProgress = false;
  }
  handleSelectionEvent(event, rangeLike, opts) {
    if (event.button !== 0) {
      return false;
    }
    const isWindows = process.platform === 'win32';
    if (event.ctrlKey && !isWindows) {
      // Allow the context menu to open.
      return false;
    }
    const options = _objectSpread({
      add: false
    }, opts);

    // Normalize the target selection range
    const converted = _atom.Range.fromObject(rangeLike);
    const range = this.refEditor.map(editor => editor.clipBufferRange(converted)).getOr(converted);
    if (event.metaKey || /* istanbul ignore next */event.ctrlKey && isWindows) {
      this.refEditor.map(editor => {
        let intersects = false;
        let without = null;
        for (const selection of editor.getSelections()) {
          if (selection.intersectsBufferRange(range)) {
            // Remove range from this selection by truncating it to the "near edge" of the range and creating a
            // new selection from the "far edge" to the previous end. Omit either side if it is empty.
            intersects = true;
            const selectionRange = selection.getBufferRange();
            const newRanges = [];
            if (!range.start.isEqual(selectionRange.start)) {
              // Include the bit from the selection's previous start to the range's start.
              let nudged = range.start;
              if (range.start.column === 0) {
                const lastColumn = editor.getBuffer().lineLengthForRow(range.start.row - 1);
                nudged = [range.start.row - 1, lastColumn];
              }
              newRanges.push([selectionRange.start, nudged]);
            }
            if (!range.end.isEqual(selectionRange.end)) {
              // Include the bit from the range's end to the selection's end.
              let nudged = range.end;
              const lastColumn = editor.getBuffer().lineLengthForRow(range.end.row);
              if (range.end.column === lastColumn) {
                nudged = [range.end.row + 1, 0];
              }
              newRanges.push([nudged, selectionRange.end]);
            }
            if (newRanges.length > 0) {
              selection.setBufferRange(newRanges[0]);
              for (const newRange of newRanges.slice(1)) {
                editor.addSelectionForBufferRange(newRange, {
                  reversed: selection.isReversed()
                });
              }
            } else {
              without = selection;
            }
          }
        }
        if (without !== null) {
          const replacementRanges = editor.getSelections().filter(each => each !== without).map(each => each.getBufferRange());
          if (replacementRanges.length > 0) {
            editor.setSelectedBufferRanges(replacementRanges);
          }
        }
        if (!intersects) {
          // Add this range as a new, distinct selection.
          editor.addSelectionForBufferRange(range);
        }
        return null;
      });
    } else if (options.add || event.shiftKey) {
      // Extend the existing selection to encompass this range.
      this.refEditor.map(editor => {
        const lastSelection = editor.getLastSelection();
        const lastSelectionRange = lastSelection.getBufferRange();

        // You are now entering the wall of ternery operators. This is your last exit before the tollbooth
        const isBefore = range.start.isLessThan(lastSelectionRange.start);
        const farEdge = isBefore ? range.start : range.end;
        const newRange = isBefore ? [farEdge, lastSelectionRange.end] : [lastSelectionRange.start, farEdge];
        lastSelection.setBufferRange(newRange, {
          reversed: isBefore
        });
        return null;
      });
    } else {
      this.refEditor.map(editor => editor.setSelectedBufferRange(range));
    }
    return true;
  }
  didConfirm() {
    return this.props.toggleRows(this.props.selectedRows, this.props.selectionMode);
  }
  didToggleSelectionMode() {
    const selectedHunks = this.getSelectedHunks();
    this.withSelectionMode({
      line: () => {
        const hunkRanges = selectedHunks.map(hunk => hunk.getRange());
        this.nextSelectionMode = 'hunk';
        this.refEditor.map(editor => editor.setSelectedBufferRanges(hunkRanges));
      },
      hunk: () => {
        let firstChangeRow = Infinity;
        for (const hunk of selectedHunks) {
          const [firstChange] = hunk.getChanges();
          /* istanbul ignore else */
          if (firstChange && (!firstChangeRow || firstChange.getStartBufferRow() < firstChangeRow)) {
            firstChangeRow = firstChange.getStartBufferRow();
          }
        }
        this.nextSelectionMode = 'line';
        this.refEditor.map(editor => {
          editor.setSelectedBufferRanges([[[firstChangeRow, 0], [firstChangeRow, Infinity]]]);
          return null;
        });
      }
    });
  }
  selectNextHunk() {
    this.refEditor.map(editor => {
      const nextHunks = new Set(this.withSelectedHunks(hunk => this.getHunkAfter(hunk) || hunk));
      const nextRanges = Array.from(nextHunks, hunk => hunk.getRange());
      this.nextSelectionMode = 'hunk';
      editor.setSelectedBufferRanges(nextRanges);
      return null;
    });
  }
  selectPreviousHunk() {
    this.refEditor.map(editor => {
      const nextHunks = new Set(this.withSelectedHunks(hunk => this.getHunkBefore(hunk) || hunk));
      const nextRanges = Array.from(nextHunks, hunk => hunk.getRange());
      this.nextSelectionMode = 'hunk';
      editor.setSelectedBufferRanges(nextRanges);
      return null;
    });
  }
  didOpenFile({
    selectedFilePatch
  }) {
    const cursorsByFilePatch = new Map();
    this.refEditor.map(editor => {
      const placedRows = new Set();
      for (const cursor of editor.getCursors()) {
        const cursorRow = cursor.getBufferPosition().row;
        const hunk = this.props.multiFilePatch.getHunkAt(cursorRow);
        const filePatch = this.props.multiFilePatch.getFilePatchAt(cursorRow);
        /* istanbul ignore next */
        if (!hunk) {
          continue;
        }
        let newRow = hunk.getNewRowAt(cursorRow);
        let newColumn = cursor.getBufferPosition().column;
        if (newRow === null) {
          let nearestRow = hunk.getNewStartRow();
          for (const region of hunk.getRegions()) {
            if (!region.includesBufferRow(cursorRow)) {
              region.when({
                unchanged: () => {
                  nearestRow += region.bufferRowCount();
                },
                addition: () => {
                  nearestRow += region.bufferRowCount();
                }
              });
            } else {
              break;
            }
          }
          if (!placedRows.has(nearestRow)) {
            newRow = nearestRow;
            newColumn = 0;
            placedRows.add(nearestRow);
          }
        }
        if (newRow !== null) {
          // Why is this needed? I _think_ everything is in terms of buffer position
          // so there shouldn't be an off-by-one issue
          newRow -= 1;
          const cursors = cursorsByFilePatch.get(filePatch);
          if (!cursors) {
            cursorsByFilePatch.set(filePatch, [[newRow, newColumn]]);
          } else {
            cursors.push([newRow, newColumn]);
          }
        }
      }
      return null;
    });
    const filePatchesWithCursors = new Set(cursorsByFilePatch.keys());
    if (selectedFilePatch && !filePatchesWithCursors.has(selectedFilePatch)) {
      const [firstHunk] = selectedFilePatch.getHunks();
      const cursorRow = firstHunk ? firstHunk.getNewStartRow() - 1 : /* istanbul ignore next */0;
      return this.props.openFile(selectedFilePatch, [[cursorRow, 0]], true);
    } else {
      const pending = cursorsByFilePatch.size === 1;
      return Promise.all(Array.from(cursorsByFilePatch, value => {
        const [filePatch, cursors] = value;
        return this.props.openFile(filePatch, cursors, pending);
      }));
    }
  }
  getSelectedRows() {
    return this.refEditor.map(editor => {
      return new Set(editor.getSelections().map(selection => selection.getBufferRange()).reduce((acc, range) => {
        for (const row of range.getRows()) {
          if (this.isChangeRow(row)) {
            acc.push(row);
          }
        }
        return acc;
      }, []));
    }).getOr(new Set());
  }
  didAddSelection() {
    this.didChangeSelectedRows();
  }
  didChangeSelectionRange(event) {
    if (!event || event.oldBufferRange.start.row !== event.newBufferRange.start.row || event.oldBufferRange.end.row !== event.newBufferRange.end.row) {
      this.didChangeSelectedRows();
    }
  }
  didDestroySelection() {
    this.didChangeSelectedRows();
  }
  didChangeSelectedRows() {
    if (this.suppressChanges) {
      return;
    }
    const nextCursorRows = this.refEditor.map(editor => {
      return editor.getCursorBufferPositions().map(position => position.row);
    }).getOr([]);
    const hasMultipleFileSelections = this.props.multiFilePatch.spansMultipleFiles(nextCursorRows);
    this.props.selectedRowsChanged(this.getSelectedRows(), this.nextSelectionMode || 'line', hasMultipleFileSelections);
  }
  oldLineNumberLabel({
    bufferRow,
    softWrapped
  }) {
    const hunk = this.props.multiFilePatch.getHunkAt(bufferRow);
    if (hunk === undefined) {
      return this.pad('');
    }
    const oldRow = hunk.getOldRowAt(bufferRow);
    if (softWrapped) {
      return this.pad(oldRow === null ? '' : '•');
    }
    return this.pad(oldRow);
  }
  newLineNumberLabel({
    bufferRow,
    softWrapped
  }) {
    const hunk = this.props.multiFilePatch.getHunkAt(bufferRow);
    if (hunk === undefined) {
      return this.pad('');
    }
    const newRow = hunk.getNewRowAt(bufferRow);
    if (softWrapped) {
      return this.pad(newRow === null ? '' : '•');
    }
    return this.pad(newRow);
  }

  /*
   * Return a Set of the Hunks that include at least one editor selection. The selection need not contain an actual
   * change row.
   */
  getSelectedHunks() {
    return this.withSelectedHunks(each => each);
  }
  withSelectedHunks(callback) {
    return this.refEditor.map(editor => {
      const seen = new Set();
      return editor.getSelectedBufferRanges().reduce((acc, range) => {
        for (const row of range.getRows()) {
          const hunk = this.props.multiFilePatch.getHunkAt(row);
          if (!hunk || seen.has(hunk)) {
            continue;
          }
          seen.add(hunk);
          acc.push(callback(hunk));
        }
        return acc;
      }, []);
    }).getOr([]);
  }

  /*
   * Return a Set of FilePatches that include at least one editor selection. The selection need not contain an actual
   * change row.
   */
  getSelectedFilePatches() {
    return this.refEditor.map(editor => {
      const patches = new Set();
      for (const range of editor.getSelectedBufferRanges()) {
        for (const row of range.getRows()) {
          const patch = this.props.multiFilePatch.getFilePatchAt(row);
          patches.add(patch);
        }
      }
      return patches;
    }).getOr(new Set());
  }
  getHunkBefore(hunk) {
    const prevRow = hunk.getRange().start.row - 1;
    return this.props.multiFilePatch.getHunkAt(prevRow);
  }
  getHunkAfter(hunk) {
    const nextRow = hunk.getRange().end.row + 1;
    return this.props.multiFilePatch.getHunkAt(nextRow);
  }
  isChangeRow(bufferRow) {
    const changeLayers = [this.props.multiFilePatch.getAdditionLayer(), this.props.multiFilePatch.getDeletionLayer()];
    return changeLayers.some(layer => layer.findMarkers({
      intersectsRow: bufferRow
    }).length > 0);
  }
  withSelectionMode(callbacks) {
    const callback = callbacks[this.props.selectionMode];
    /* istanbul ignore if */
    if (!callback) {
      throw new Error(`Unknown selection mode: ${this.props.selectionMode}`);
    }
    return callback();
  }
  pad(num) {
    const maxDigits = this.props.multiFilePatch.getMaxLineNumberWidth();
    if (num === null) {
      return _helpers.NBSP_CHARACTER.repeat(maxDigits);
    } else {
      return _helpers.NBSP_CHARACTER.repeat(maxDigits - num.toString().length) + num.toString();
    }
  }
  measurePerformance(action) {
    /* istanbul ignore else */
    if ((action === 'update' || action === 'mount') && performance.getEntriesByName(`MultiFilePatchView-${action}-start`).length > 0) {
      performance.mark(`MultiFilePatchView-${action}-end`);
      performance.measure(`MultiFilePatchView-${action}`, `MultiFilePatchView-${action}-start`, `MultiFilePatchView-${action}-end`);
      const perf = performance.getEntriesByName(`MultiFilePatchView-${action}`)[0];
      performance.clearMarks(`MultiFilePatchView-${action}-start`);
      performance.clearMarks(`MultiFilePatchView-${action}-end`);
      performance.clearMeasures(`MultiFilePatchView-${action}`);
      (0, _reporterProxy.addEvent)(`MultiFilePatchView-${action}`, {
        package: 'github',
        filePatchesLineCounts: this.props.multiFilePatch.getFilePatches().map(fp => fp.getPatch().getChangedLineCount()),
        duration: perf.duration
      });
    }
  }
}
exports.default = MultiFilePatchView;
_defineProperty(MultiFilePatchView, "propTypes", {
  // Behavior controls
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  isPartiallyStaged: _propTypes.default.bool,
  itemType: _propTypes2.ItemTypePropType.isRequired,
  // Models
  repository: _propTypes.default.object.isRequired,
  multiFilePatch: _propTypes2.MultiFilePatchPropType.isRequired,
  selectionMode: _propTypes.default.oneOf(['hunk', 'line']).isRequired,
  selectedRows: _propTypes.default.object.isRequired,
  hasMultipleFileSelections: _propTypes.default.bool.isRequired,
  hasUndoHistory: _propTypes.default.bool,
  // Review comments
  reviewCommentsLoading: _propTypes.default.bool,
  reviewCommentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    thread: _propTypes.default.object.isRequired,
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
  })),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  pullRequest: _propTypes.default.object,
  // Callbacks
  selectedRowsChanged: _propTypes.default.func,
  // Action methods
  switchToIssueish: _propTypes.default.func,
  diveIntoMirrorPatch: _propTypes.default.func,
  surface: _propTypes.default.func,
  openFile: _propTypes.default.func,
  toggleFile: _propTypes.default.func,
  toggleRows: _propTypes.default.func,
  toggleModeChange: _propTypes.default.func,
  toggleSymlinkChange: _propTypes.default.func,
  undoLastDiscard: _propTypes.default.func,
  discardRows: _propTypes.default.func,
  onWillUpdatePatch: _propTypes.default.func,
  onDidUpdatePatch: _propTypes.default.func,
  // External refs
  refEditor: _propTypes2.RefHolderPropType,
  refInitialFocus: _propTypes2.RefHolderPropType,
  // for navigating the PR changed files tab
  onOpenFilesTab: _propTypes.default.func,
  initChangedFilePath: _propTypes.default.string,
  initChangedFilePosition: _propTypes.default.number,
  // for opening the reviews dock item
  endpoint: _propTypes2.EndpointPropType,
  owner: _propTypes.default.string,
  repo: _propTypes.default.string,
  number: _propTypes.default.number,
  workdirPath: _propTypes.default.string
});
_defineProperty(MultiFilePatchView, "defaultProps", {
  onWillUpdatePatch: () => new _eventKit.Disposable(),
  onDidUpdatePatch: () => new _eventKit.Disposable(),
  reviewCommentsLoading: false,
  reviewCommentThreads: []
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJleGVjdXRhYmxlVGV4dCIsIkZpbGUiLCJtb2RlcyIsIk5PUk1BTCIsIkVYRUNVVEFCTEUiLCJNdWx0aUZpbGVQYXRjaFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJmaWxlUGF0Y2giLCJpbmRleCIsImlzQ29sbGFwc2VkIiwiZ2V0UmVuZGVyU3RhdHVzIiwiaXNWaXNpYmxlIiwiaXNFbXB0eSIsImdldE1hcmtlciIsImdldFJhbmdlIiwiaXNFeHBhbmRhYmxlIiwiaXNVbmF2YWlsYWJsZSIsImF0RW5kIiwiZ2V0U3RhcnRSYW5nZSIsInN0YXJ0IiwiaXNFcXVhbCIsIm11bHRpRmlsZVBhdGNoIiwiZ2V0QnVmZmVyIiwiZ2V0RW5kUG9zaXRpb24iLCJwb3NpdGlvbiIsImdldFBhdGgiLCJpdGVtVHlwZSIsImdldFN0YXR1cyIsImdldE5ld1BhdGgiLCJzdGFnaW5nU3RhdHVzIiwiaXNQYXJ0aWFsbHlTdGFnZWQiLCJoYXNVbmRvSGlzdG9yeSIsImhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnMiLCJ0b29sdGlwcyIsInVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24iLCJkaXZlSW50b01pcnJvclBhdGNoIiwiZGlkT3BlbkZpbGUiLCJzZWxlY3RlZEZpbGVQYXRjaCIsInRvZ2dsZUZpbGUiLCJjb2xsYXBzZUZpbGVQYXRjaCIsImV4cGFuZEZpbGVQYXRjaCIsInJlbmRlclN5bWxpbmtDaGFuZ2VNZXRhIiwicmVuZGVyRXhlY3V0YWJsZU1vZGVDaGFuZ2VNZXRhIiwicmVuZGVyRGlmZkdhdGUiLCJyZW5kZXJEaWZmVW5hdmFpbGFibGUiLCJyZW5kZXJIdW5rSGVhZGVycyIsInNlbGVjdGVkRmlsZVBhdGNoZXMiLCJBcnJheSIsImZyb20iLCJnZXRTZWxlY3RlZEZpbGVQYXRjaGVzIiwiQ2hhbmdlZEZpbGVJdGVtIiwidW5kb0xhc3REaXNjYXJkIiwiZXZlbnRTb3VyY2UiLCJjb21tYW5kIiwiZGlzY2FyZFJvd3MiLCJzZWxlY3RlZFJvd3MiLCJzZWxlY3Rpb25Nb2RlIiwiUHJvbWlzZSIsImFsbCIsImZpbHRlciIsImZwIiwiZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUiLCJtYXAiLCJ0b2dnbGVNb2RlQ2hhbmdlIiwiaGFzVHlwZWNoYW5nZSIsInRvZ2dsZVN5bWxpbmtDaGFuZ2UiLCJjaGFuZ2VkRmlsZVBhdGgiLCJjaGFuZ2VkRmlsZVBvc2l0aW9uIiwicmVmRWRpdG9yIiwiZSIsInJvdyIsImdldEJ1ZmZlclJvd0ZvckRpZmZQb3NpdGlvbiIsInNjcm9sbFRvQnVmZmVyUG9zaXRpb24iLCJjb2x1bW4iLCJjZW50ZXIiLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsImF1dG9iaW5kIiwibW91c2VTZWxlY3Rpb25JblByb2dyZXNzIiwibGFzdE1vdXNlTW92ZUxpbmUiLCJuZXh0U2VsZWN0aW9uTW9kZSIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJyZWZFZGl0b3JFbGVtZW50IiwibW91bnRlZCIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiYWRkIiwib2JzZXJ2ZSIsImVkaXRvciIsInNldHRlciIsImdldEVsZW1lbnQiLCJlbGVtZW50IiwicmVmSW5pdGlhbEZvY3VzIiwic3VwcHJlc3NDaGFuZ2VzIiwibGFzdFNjcm9sbFRvcCIsImxhc3RTY3JvbGxMZWZ0IiwibGFzdFNlbGVjdGlvbkluZGV4Iiwib25XaWxsVXBkYXRlUGF0Y2giLCJnZXRNYXhTZWxlY3Rpb25JbmRleCIsImdldFNjcm9sbFRvcCIsImdldFNjcm9sbExlZnQiLCJvbkRpZFVwZGF0ZVBhdGNoIiwibmV4dFBhdGNoIiwibmV4dFNlbGVjdGlvblJhbmdlIiwiZ2V0U2VsZWN0aW9uUmFuZ2VGb3JJbmRleCIsInNldFNlbGVjdGVkQnVmZmVyUmFuZ2UiLCJuZXh0SHVua3MiLCJTZXQiLCJSYW5nZSIsImZyb21PYmplY3QiLCJnZXRSb3dzIiwiZ2V0SHVua0F0IiwiQm9vbGVhbiIsIm5leHRSYW5nZXMiLCJzaXplIiwiaHVuayIsInNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzIiwic2V0U2Nyb2xsVG9wIiwic2V0U2Nyb2xsTGVmdCIsImRpZENoYW5nZVNlbGVjdGVkUm93cyIsImNvbXBvbmVudERpZE1vdW50IiwibWVhc3VyZVBlcmZvcm1hbmNlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImRpZE1vdXNlVXAiLCJmaXJzdFBhdGNoIiwiZ2V0RmlsZVBhdGNoZXMiLCJmaXJzdEh1bmsiLCJnZXRIdW5rcyIsImNvbmZpZyIsIm9uRGlkQ2hhbmdlIiwiZm9yY2VVcGRhdGUiLCJpbml0Q2hhbmdlZEZpbGVQYXRoIiwiaW5pdENoYW5nZWRGaWxlUG9zaXRpb24iLCJzY3JvbGxUb0ZpbGUiLCJvbk9wZW5GaWxlc1RhYiIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpc3Bvc2UiLCJwZXJmb3JtYW5jZSIsImNsZWFyTWFya3MiLCJjbGVhck1lYXN1cmVzIiwicmVuZGVyIiwicm9vdENsYXNzIiwiY3giLCJhbnlQcmVzZW50IiwibWFyayIsInJlbmRlckNvbW1hbmRzIiwicmVuZGVyTm9uRW1wdHlQYXRjaCIsInJlbmRlckVtcHR5UGF0Y2giLCJDb21taXREZXRhaWxJdGVtIiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiY29tbWFuZHMiLCJzZWxlY3ROZXh0SHVuayIsInNlbGVjdFByZXZpb3VzSHVuayIsImRpZFRvZ2dsZVNlbGVjdGlvbk1vZGUiLCJzdGFnZU1vZGVDb21tYW5kIiwic3RhZ2VTeW1saW5rQ29tbWFuZCIsImRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlIiwiZGlkVG9nZ2xlTW9kZUNoYW5nZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiZGlkVG9nZ2xlU3ltbGlua0NoYW5nZSIsImRpZENvbmZpcm0iLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8iLCJkaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmQiLCJzdXJmYWNlIiwiYXRvbSIsImluRGV2TW9kZSIsImNvbnNvbGUiLCJsb2ciLCJnZXRQYXRjaEJ1ZmZlciIsImluc3BlY3QiLCJsYXllck5hbWVzIiwid29ya3NwYWNlIiwiZGlkQWRkU2VsZWN0aW9uIiwiZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UiLCJkaWREZXN0cm95U2VsZWN0aW9uIiwib2xkTGluZU51bWJlckxhYmVsIiwiZGlkTW91c2VEb3duT25MaW5lTnVtYmVyIiwiZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyIiwibmV3TGluZU51bWJlckxhYmVsIiwiZ2V0IiwiYmxhbmtMYWJlbCIsInJlbmRlclBSQ29tbWVudEljb25zIiwicmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMiLCJyZW5kZXJMaW5lRGVjb3JhdGlvbnMiLCJJbmZpbml0eSIsImd1dHRlciIsImljb24iLCJsaW5lIiwicmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJwYXRoIiwiZ2V0UGF0Y2hGb3JQYXRoIiwiaXNSb3dTZWxlY3RlZCIsImhhcyIsImlkIiwiZW5kcG9pbnQiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJ3b3JrZGlyUGF0aCIsIm5hbWUiLCJvcmRlck9mZnNldCIsInNob3dEaWZmIiwiYWRkRXZlbnQiLCJjb21wb25lbnQiLCJwYWNrYWdlIiwib2xkTW9kZSIsImdldE9sZE1vZGUiLCJuZXdNb2RlIiwiZ2V0TmV3TW9kZSIsImF0dHJzIiwiYWN0aW9uSWNvbiIsImFjdGlvblRleHQiLCJoYXNTeW1saW5rIiwiZGV0YWlsIiwidGl0bGUiLCJvbGRTeW1saW5rIiwiZ2V0T2xkU3ltbGluayIsIm5ld1N5bWxpbmsiLCJnZXROZXdTeW1saW5rIiwidG9nZ2xlVmVyYiIsInNlbGVjdGVkSHVua3MiLCJjb250YWluc1NlbGVjdGlvbiIsImlzU2VsZWN0ZWQiLCJidXR0b25TdWZmaXgiLCJ0b2dnbGVTZWxlY3Rpb25MYWJlbCIsImRpc2NhcmRTZWxlY3Rpb25MYWJlbCIsInN0YXJ0UG9pbnQiLCJzdGFydFJhbmdlIiwia2V5bWFwcyIsInRvZ2dsZUh1bmtTZWxlY3Rpb24iLCJkaXNjYXJkSHVua1NlbGVjdGlvbiIsImRpZE1vdXNlRG93bk9uSGVhZGVyIiwicmFuZ2VzIiwibGluZUNsYXNzIiwicmVmSG9sZGVyIiwibGVuZ3RoIiwiaG9sZGVyIiwicmFuZ2UiLCJyZW5kZXJEZWNvcmF0aW9ucyIsImxheWVyIiwiZ2V0TWFya2VyQ291bnQiLCJ0b2dnbGVSb3dzIiwiY2hhbmdlUm93cyIsImdldENoYW5nZXMiLCJyZWR1Y2UiLCJyb3dzIiwiY2hhbmdlIiwicHVzaCIsImdldEJ1ZmZlclJvd3MiLCJldmVudCIsImhhbmRsZVNlbGVjdGlvbkV2ZW50IiwiYnVmZmVyUm93IiwidW5kZWZpbmVkIiwiaXNOYU4iLCJkb21FdmVudCIsInJhbmdlTGlrZSIsIm9wdHMiLCJidXR0b24iLCJpc1dpbmRvd3MiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJjdHJsS2V5Iiwib3B0aW9ucyIsImNvbnZlcnRlZCIsImNsaXBCdWZmZXJSYW5nZSIsImdldE9yIiwibWV0YUtleSIsImludGVyc2VjdHMiLCJ3aXRob3V0Iiwic2VsZWN0aW9uIiwiZ2V0U2VsZWN0aW9ucyIsImludGVyc2VjdHNCdWZmZXJSYW5nZSIsInNlbGVjdGlvblJhbmdlIiwiZ2V0QnVmZmVyUmFuZ2UiLCJuZXdSYW5nZXMiLCJudWRnZWQiLCJsYXN0Q29sdW1uIiwibGluZUxlbmd0aEZvclJvdyIsImVuZCIsInNldEJ1ZmZlclJhbmdlIiwibmV3UmFuZ2UiLCJzbGljZSIsImFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlIiwicmV2ZXJzZWQiLCJpc1JldmVyc2VkIiwicmVwbGFjZW1lbnRSYW5nZXMiLCJlYWNoIiwic2hpZnRLZXkiLCJsYXN0U2VsZWN0aW9uIiwiZ2V0TGFzdFNlbGVjdGlvbiIsImxhc3RTZWxlY3Rpb25SYW5nZSIsImlzQmVmb3JlIiwiaXNMZXNzVGhhbiIsImZhckVkZ2UiLCJnZXRTZWxlY3RlZEh1bmtzIiwid2l0aFNlbGVjdGlvbk1vZGUiLCJodW5rUmFuZ2VzIiwiZmlyc3RDaGFuZ2VSb3ciLCJmaXJzdENoYW5nZSIsImdldFN0YXJ0QnVmZmVyUm93Iiwid2l0aFNlbGVjdGVkSHVua3MiLCJnZXRIdW5rQWZ0ZXIiLCJnZXRIdW5rQmVmb3JlIiwiY3Vyc29yc0J5RmlsZVBhdGNoIiwiTWFwIiwicGxhY2VkUm93cyIsImN1cnNvciIsImdldEN1cnNvcnMiLCJjdXJzb3JSb3ciLCJnZXRCdWZmZXJQb3NpdGlvbiIsImdldEZpbGVQYXRjaEF0IiwibmV3Um93IiwiZ2V0TmV3Um93QXQiLCJuZXdDb2x1bW4iLCJuZWFyZXN0Um93IiwiZ2V0TmV3U3RhcnRSb3ciLCJyZWdpb24iLCJnZXRSZWdpb25zIiwiaW5jbHVkZXNCdWZmZXJSb3ciLCJ3aGVuIiwidW5jaGFuZ2VkIiwiYnVmZmVyUm93Q291bnQiLCJhZGRpdGlvbiIsImN1cnNvcnMiLCJzZXQiLCJmaWxlUGF0Y2hlc1dpdGhDdXJzb3JzIiwia2V5cyIsIm9wZW5GaWxlIiwicGVuZGluZyIsInZhbHVlIiwiZ2V0U2VsZWN0ZWRSb3dzIiwiYWNjIiwiaXNDaGFuZ2VSb3ciLCJvbGRCdWZmZXJSYW5nZSIsIm5ld0J1ZmZlclJhbmdlIiwibmV4dEN1cnNvclJvd3MiLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMiLCJzcGFuc011bHRpcGxlRmlsZXMiLCJzZWxlY3RlZFJvd3NDaGFuZ2VkIiwic29mdFdyYXBwZWQiLCJwYWQiLCJvbGRSb3ciLCJnZXRPbGRSb3dBdCIsImNhbGxiYWNrIiwic2VlbiIsImdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzIiwicGF0Y2hlcyIsInBhdGNoIiwicHJldlJvdyIsIm5leHRSb3ciLCJjaGFuZ2VMYXllcnMiLCJzb21lIiwiZmluZE1hcmtlcnMiLCJpbnRlcnNlY3RzUm93IiwiY2FsbGJhY2tzIiwiRXJyb3IiLCJudW0iLCJtYXhEaWdpdHMiLCJnZXRNYXhMaW5lTnVtYmVyV2lkdGgiLCJOQlNQX0NIQVJBQ1RFUiIsInJlcGVhdCIsInRvU3RyaW5nIiwiYWN0aW9uIiwiZ2V0RW50cmllc0J5TmFtZSIsIm1lYXN1cmUiLCJwZXJmIiwiZmlsZVBhdGNoZXNMaW5lQ291bnRzIiwiZ2V0UGF0Y2giLCJnZXRDaGFuZ2VkTGluZUNvdW50IiwiZHVyYXRpb24iLCJQcm9wVHlwZXMiLCJvbmVPZiIsImJvb2wiLCJJdGVtVHlwZVByb3BUeXBlIiwiaXNSZXF1aXJlZCIsInJlcG9zaXRvcnkiLCJvYmplY3QiLCJNdWx0aUZpbGVQYXRjaFByb3BUeXBlIiwiYXJyYXlPZiIsInNoYXBlIiwicHVsbFJlcXVlc3QiLCJmdW5jIiwic3dpdGNoVG9Jc3N1ZWlzaCIsIlJlZkhvbGRlclByb3BUeXBlIiwic3RyaW5nIiwiRW5kcG9pbnRQcm9wVHlwZSIsIkRpc3Bvc2FibGUiXSwic291cmNlcyI6WyJtdWx0aS1maWxlLXBhdGNoLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHthdXRvYmluZCwgTkJTUF9DSEFSQUNURVIsIGJsYW5rTGFiZWx9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZSwgTXVsdGlGaWxlUGF0Y2hQcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi4vYXRvbS9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckxheWVyIGZyb20gJy4uL2F0b20vbWFya2VyLWxheWVyJztcbmltcG9ydCBEZWNvcmF0aW9uIGZyb20gJy4uL2F0b20vZGVjb3JhdGlvbic7XG5pbXBvcnQgR3V0dGVyIGZyb20gJy4uL2F0b20vZ3V0dGVyJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IEZpbGVQYXRjaEhlYWRlclZpZXcgZnJvbSAnLi9maWxlLXBhdGNoLWhlYWRlci12aWV3JztcbmltcG9ydCBGaWxlUGF0Y2hNZXRhVmlldyBmcm9tICcuL2ZpbGUtcGF0Y2gtbWV0YS12aWV3JztcbmltcG9ydCBIdW5rSGVhZGVyVmlldyBmcm9tICcuL2h1bmstaGVhZGVyLXZpZXcnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NvbW1lbnQtZ3V0dGVyLWRlY29yYXRpb24tY29udHJvbGxlcic7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCBGaWxlIGZyb20gJy4uL21vZGVscy9wYXRjaC9maWxlJztcblxuY29uc3QgZXhlY3V0YWJsZVRleHQgPSB7XG4gIFtGaWxlLm1vZGVzLk5PUk1BTF06ICdub24gZXhlY3V0YWJsZScsXG4gIFtGaWxlLm1vZGVzLkVYRUNVVEFCTEVdOiAnZXhlY3V0YWJsZScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aUZpbGVQYXRjaFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEJlaGF2aW9yIGNvbnRyb2xzXG4gICAgc3RhZ2luZ1N0YXR1czogUHJvcFR5cGVzLm9uZU9mKFsnc3RhZ2VkJywgJ3Vuc3RhZ2VkJ10pLFxuICAgIGlzUGFydGlhbGx5U3RhZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpdGVtVHlwZTogSXRlbVR5cGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTW9kZWxzXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG11bHRpRmlsZVBhdGNoOiBNdWx0aUZpbGVQYXRjaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0aW9uTW9kZTogUHJvcFR5cGVzLm9uZU9mKFsnaHVuaycsICdsaW5lJ10pLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRSb3dzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9uczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvLyBSZXZpZXcgY29tbWVudHNcbiAgICByZXZpZXdDb21tZW50c0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIHJldmlld0NvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIHNlbGVjdGVkUm93c0NoYW5nZWQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXZlSW50b01pcnJvclBhdGNoOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBzdXJmYWNlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvcGVuRmlsZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlRmlsZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlUm93czogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlTW9kZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlU3ltbGlua0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXNjYXJkUm93czogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25XaWxsVXBkYXRlUGF0Y2g6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRGlkVXBkYXRlUGF0Y2g6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gRXh0ZXJuYWwgcmVmc1xuICAgIHJlZkVkaXRvcjogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgcmVmSW5pdGlhbEZvY3VzOiBSZWZIb2xkZXJQcm9wVHlwZSxcblxuICAgIC8vIGZvciBuYXZpZ2F0aW5nIHRoZSBQUiBjaGFuZ2VkIGZpbGVzIHRhYlxuICAgIG9uT3BlbkZpbGVzVGFiOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBpbml0Q2hhbmdlZEZpbGVQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLCBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbjogUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8vIGZvciBvcGVuaW5nIHRoZSByZXZpZXdzIGRvY2sgaXRlbVxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHdvcmtkaXJQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbldpbGxVcGRhdGVQYXRjaDogKCkgPT4gbmV3IERpc3Bvc2FibGUoKSxcbiAgICBvbkRpZFVwZGF0ZVBhdGNoOiAoKSA9PiBuZXcgRGlzcG9zYWJsZSgpLFxuICAgIHJldmlld0NvbW1lbnRzTG9hZGluZzogZmFsc2UsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFtdLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2RpZE1vdXNlRG93bk9uSGVhZGVyJywgJ2RpZE1vdXNlRG93bk9uTGluZU51bWJlcicsICdkaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXInLCAnZGlkTW91c2VVcCcsXG4gICAgICAnZGlkQ29uZmlybScsICdkaWRUb2dnbGVTZWxlY3Rpb25Nb2RlJywgJ3NlbGVjdE5leHRIdW5rJywgJ3NlbGVjdFByZXZpb3VzSHVuaycsXG4gICAgICAnZGlkT3BlbkZpbGUnLCAnZGlkQWRkU2VsZWN0aW9uJywgJ2RpZENoYW5nZVNlbGVjdGlvblJhbmdlJywgJ2RpZERlc3Ryb3lTZWxlY3Rpb24nLFxuICAgICAgJ29sZExpbmVOdW1iZXJMYWJlbCcsICduZXdMaW5lTnVtYmVyTGFiZWwnLFxuICAgICk7XG5cbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMubGFzdE1vdXNlTW92ZUxpbmUgPSBudWxsO1xuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSBudWxsO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvckVsZW1lbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucmVmRWRpdG9yLm9ic2VydmUoZWRpdG9yID0+IHtcbiAgICAgICAgdGhpcy5yZWZFZGl0b3JFbGVtZW50LnNldHRlcihlZGl0b3IuZ2V0RWxlbWVudCgpKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucmVmRWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5yZWZFZGl0b3Iuc2V0dGVyKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZWZFZGl0b3JFbGVtZW50Lm9ic2VydmUoZWxlbWVudCA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzICYmIHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzLnNldHRlcihlbGVtZW50KTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBTeW5jaHJvbm91c2x5IG1haW50YWluIHRoZSBlZGl0b3IncyBzY3JvbGwgcG9zaXRpb24gYW5kIGxvZ2ljYWwgc2VsZWN0aW9uIGFjcm9zcyBidWZmZXIgdXBkYXRlcy5cbiAgICB0aGlzLnN1cHByZXNzQ2hhbmdlcyA9IGZhbHNlO1xuICAgIGxldCBsYXN0U2Nyb2xsVG9wID0gbnVsbDtcbiAgICBsZXQgbGFzdFNjcm9sbExlZnQgPSBudWxsO1xuICAgIGxldCBsYXN0U2VsZWN0aW9uSW5kZXggPSBudWxsO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLnByb3BzLm9uV2lsbFVwZGF0ZVBhdGNoKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdXBwcmVzc0NoYW5nZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgICBsYXN0U2VsZWN0aW9uSW5kZXggPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldE1heFNlbGVjdGlvbkluZGV4KHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzKTtcbiAgICAgICAgICBsYXN0U2Nyb2xsVG9wID0gZWRpdG9yLmdldEVsZW1lbnQoKS5nZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgICBsYXN0U2Nyb2xsTGVmdCA9IGVkaXRvci5nZXRFbGVtZW50KCkuZ2V0U2Nyb2xsTGVmdCgpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5wcm9wcy5vbkRpZFVwZGF0ZVBhdGNoKG5leHRQYXRjaCA9PiB7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGxhc3RTZWxlY3Rpb25JbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbmV4dFNlbGVjdGlvblJhbmdlID0gbmV4dFBhdGNoLmdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgobGFzdFNlbGVjdGlvbkluZGV4KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdsaW5lJykge1xuICAgICAgICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShuZXh0U2VsZWN0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV4dEh1bmtzID0gbmV3IFNldChcbiAgICAgICAgICAgICAgICBSYW5nZS5mcm9tT2JqZWN0KG5leHRTZWxlY3Rpb25SYW5nZSkuZ2V0Um93cygpXG4gICAgICAgICAgICAgICAgICAubWFwKHJvdyA9PiBuZXh0UGF0Y2guZ2V0SHVua0F0KHJvdykpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICAgIGNvbnN0IG5leHRSYW5nZXMgPSBuZXh0SHVua3Muc2l6ZSA+IDBcbiAgICAgICAgICAgICAgICA/IEFycmF5LmZyb20obmV4dEh1bmtzLCBodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSlcbiAgICAgICAgICAgICAgICA6IFtbWzAsIDBdLCBbMCwgMF1dXTtcblxuICAgICAgICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMobmV4dFJhbmdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAobGFzdFNjcm9sbFRvcCAhPT0gbnVsbCkgeyBlZGl0b3IuZ2V0RWxlbWVudCgpLnNldFNjcm9sbFRvcChsYXN0U2Nyb2xsVG9wKTsgfVxuXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAobGFzdFNjcm9sbExlZnQgIT09IG51bGwpIHsgZWRpdG9yLmdldEVsZW1lbnQoKS5zZXRTY3JvbGxMZWZ0KGxhc3RTY3JvbGxMZWZ0KTsgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdXBwcmVzc0NoYW5nZXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm1vdW50ZWQgPSB0cnVlO1xuICAgIHRoaXMubWVhc3VyZVBlcmZvcm1hbmNlKCdtb3VudCcpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmRpZE1vdXNlVXApO1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgLy8gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaCBpcyBndWFyYW50ZWVkIHRvIGNvbnRhaW4gYXQgbGVhc3Qgb25lIEZpbGVQYXRjaCBpZiA8QXRvbVRleHRFZGl0b3I+IGlzIHJlbmRlcmVkLlxuICAgICAgY29uc3QgW2ZpcnN0UGF0Y2hdID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpO1xuICAgICAgY29uc3QgW2ZpcnN0SHVua10gPSBmaXJzdFBhdGNoLmdldEh1bmtzKCk7XG4gICAgICBpZiAoIWZpcnN0SHVuaykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKGZpcnN0SHVuay5nZXRSYW5nZSgpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucHJvcHMuY29uZmlnLm9uRGlkQ2hhbmdlKCdnaXRodWIuc2hvd0RpZmZJY29uR3V0dGVyJywgKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuXG4gICAgY29uc3Qge2luaXRDaGFuZ2VkRmlsZVBhdGgsIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9ufSA9IHRoaXMucHJvcHM7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChpbml0Q2hhbmdlZEZpbGVQYXRoICYmIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uID49IDApIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9GaWxlKHtcbiAgICAgICAgY2hhbmdlZEZpbGVQYXRoOiBpbml0Q2hhbmdlZEZpbGVQYXRoLFxuICAgICAgICBjaGFuZ2VkRmlsZVBvc2l0aW9uOiBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh0aGlzLnByb3BzLm9uT3BlbkZpbGVzVGFiKSB7XG4gICAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgICB0aGlzLnByb3BzLm9uT3BlbkZpbGVzVGFiKHRoaXMuc2Nyb2xsVG9GaWxlKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHRoaXMubWVhc3VyZVBlcmZvcm1hbmNlKCd1cGRhdGUnKTtcblxuICAgIGlmIChwcmV2UHJvcHMucmVmSW5pdGlhbEZvY3VzICE9PSB0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cykge1xuICAgICAgcHJldlByb3BzLnJlZkluaXRpYWxGb2N1cyAmJiBwcmV2UHJvcHMucmVmSW5pdGlhbEZvY3VzLnNldHRlcihudWxsKTtcbiAgICAgIHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzICYmIHRoaXMucmVmRWRpdG9yRWxlbWVudC5tYXAodGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMuc2V0dGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaCA9PT0gcHJldlByb3BzLm11bHRpRmlsZVBhdGNoKSB7XG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZGlkTW91c2VVcCk7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKCk7XG4gICAgcGVyZm9ybWFuY2UuY2xlYXJNZWFzdXJlcygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJvb3RDbGFzcyA9IGN4KFxuICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3JyxcbiAgICAgIHtbYGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LS0ke3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c31gXTogdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfSxcbiAgICAgIHsnZ2l0aHViLUZpbGVQYXRjaFZpZXctLWJsYW5rJzogIXRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guYW55UHJlc2VudCgpfSxcbiAgICAgIHsnZ2l0aHViLUZpbGVQYXRjaFZpZXctLWh1bmtNb2RlJzogdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlID09PSAnaHVuayd9LFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5tb3VudGVkKSB7XG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKCdNdWx0aUZpbGVQYXRjaFZpZXctdXBkYXRlLXN0YXJ0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ011bHRpRmlsZVBhdGNoVmlldy1tb3VudC1zdGFydCcpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17cm9vdENsYXNzfSByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuXG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmFueVByZXNlbnQoKSA/IHRoaXMucmVuZGVyTm9uRW1wdHlQYXRjaCgpIDogdGhpcy5yZW5kZXJFbXB0eVBhdGNoKCl9XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gQ29tbWl0RGV0YWlsSXRlbSB8fCB0aGlzLnByb3BzLml0ZW1UeXBlID09PSBJc3N1ZWlzaERldGFpbEl0ZW0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PXt0aGlzLnJlZlJvb3R9PlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LW5leHQtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdE5leHRIdW5rfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LXByZXZpb3VzLWh1bmtcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RQcmV2aW91c0h1bmt9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtcGF0Y2gtc2VsZWN0aW9uLW1vZGVcIiBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVTZWxlY3Rpb25Nb2RlfSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VNb2RlQ29tbWFuZCA9IG51bGw7XG4gICAgbGV0IHN0YWdlU3ltbGlua0NvbW1hbmQgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZGlkQW55Q2hhbmdlRXhlY3V0YWJsZU1vZGUoKSkge1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgICA/ICdnaXRodWI6c3RhZ2UtZmlsZS1tb2RlLWNoYW5nZSdcbiAgICAgICAgOiAnZ2l0aHViOnVuc3RhZ2UtZmlsZS1tb2RlLWNoYW5nZSc7XG4gICAgICBzdGFnZU1vZGVDb21tYW5kID0gPENvbW1hbmQgY29tbWFuZD17Y29tbWFuZH0gY2FsbGJhY2s9e3RoaXMuZGlkVG9nZ2xlTW9kZUNoYW5nZX0gLz47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guYW55SGF2ZVR5cGVjaGFuZ2UoKSkge1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgICA/ICdnaXRodWI6c3RhZ2Utc3ltbGluay1jaGFuZ2UnXG4gICAgICAgIDogJ2dpdGh1Yjp1bnN0YWdlLXN5bWxpbmstY2hhbmdlJztcbiAgICAgIHN0YWdlU3ltbGlua0NvbW1hbmQgPSA8Q29tbWFuZCBjb21tYW5kPXtjb21tYW5kfSBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVTeW1saW5rQ2hhbmdlfSAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LW5leHQtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdE5leHRIdW5rfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdC1wcmV2aW91cy1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0UHJldmlvdXNIdW5rfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMuZGlkQ29uZmlybX0gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6dW5kb1wiIGNhbGxiYWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kb30gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXNjYXJkLXNlbGVjdGVkLWxpbmVzXCIgY2FsbGJhY2s9e3RoaXMuZGlzY2FyZFNlbGVjdGlvbkZyb21Db21tYW5kfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmp1bXAtdG8tZmlsZVwiIGNhbGxiYWNrPXt0aGlzLmRpZE9wZW5GaWxlfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnN1cmZhY2VcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5zdXJmYWNlfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1wYXRjaC1zZWxlY3Rpb24tbW9kZVwiIGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZVNlbGVjdGlvbk1vZGV9IC8+XG4gICAgICAgIHtzdGFnZU1vZGVDb21tYW5kfVxuICAgICAgICB7c3RhZ2VTeW1saW5rQ29tbWFuZH1cbiAgICAgICAgey8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGF0b20uaW5EZXZNb2RlKCkgJiZcbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3BlY3QtcGF0Y2hcIiBjYWxsYmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hCdWZmZXIoKS5pbnNwZWN0KHtcbiAgICAgICAgICAgICAgbGF5ZXJOYW1lczogWydwYXRjaCcsICdodW5rJ10sXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICAgIHsvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBhdG9tLmluRGV2TW9kZSgpICYmXG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnNwZWN0LXJlZ2lvbnNcIiBjYWxsYmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hCdWZmZXIoKS5pbnNwZWN0KHtcbiAgICAgICAgICAgICAgbGF5ZXJOYW1lczogWyd1bmNoYW5nZWQnLCAnZGVsZXRpb24nLCAnYWRkaXRpb24nLCAnbm9uZXdsaW5lJ10sXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICAgIHsvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBhdG9tLmluRGV2TW9kZSgpICYmXG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnNwZWN0LW1mcFwiIGNhbGxiYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5pbnNwZWN0KCkpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgPC9Db21tYW5kcz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRW1wdHlQYXRjaCgpIHtcbiAgICByZXR1cm4gPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWVzc2FnZSBpY29uIGljb24taW5mb1wiPk5vIGNoYW5nZXMgdG8gZGlzcGxheTwvcD47XG4gIH1cblxuICByZW5kZXJOb25FbXB0eVBhdGNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QXRvbVRleHRFZGl0b3JcbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cblxuICAgICAgICBidWZmZXI9e3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyKCl9XG4gICAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlPXtmYWxzZX1cbiAgICAgICAgYXV0b1dpZHRoPXtmYWxzZX1cbiAgICAgICAgYXV0b0hlaWdodD17ZmFsc2V9XG4gICAgICAgIHJlYWRPbmx5PXt0cnVlfVxuICAgICAgICBzb2Z0V3JhcHBlZD17dHJ1ZX1cblxuICAgICAgICBkaWRBZGRTZWxlY3Rpb249e3RoaXMuZGlkQWRkU2VsZWN0aW9ufVxuICAgICAgICBkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZT17dGhpcy5kaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZX1cbiAgICAgICAgZGlkRGVzdHJveVNlbGVjdGlvbj17dGhpcy5kaWREZXN0cm95U2VsZWN0aW9ufVxuICAgICAgICByZWZNb2RlbD17dGhpcy5yZWZFZGl0b3J9XG4gICAgICAgIGhpZGVFbXB0aW5lc3M9e3RydWV9PlxuXG4gICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICBuYW1lPVwib2xkLWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgcHJpb3JpdHk9ezF9XG4gICAgICAgICAgY2xhc3NOYW1lPVwib2xkXCJcbiAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgIGxhYmVsRm49e3RoaXMub2xkTGluZU51bWJlckxhYmVsfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uTGluZU51bWJlcn1cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5kaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICBuYW1lPVwibmV3LWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgcHJpb3JpdHk9ezJ9XG4gICAgICAgICAgY2xhc3NOYW1lPVwibmV3XCJcbiAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgIGxhYmVsRm49e3RoaXMubmV3TGluZU51bWJlckxhYmVsfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uTGluZU51bWJlcn1cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5kaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICBuYW1lPVwiZ2l0aHViLWNvbW1lbnQtaWNvblwiXG4gICAgICAgICAgcHJpb3JpdHk9ezN9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiY29tbWVudFwiXG4gICAgICAgICAgdHlwZT1cImRlY29yYXRlZFwiXG4gICAgICAgIC8+XG4gICAgICAgIHt0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5zaG93RGlmZkljb25HdXR0ZXInKSAmJiAoXG4gICAgICAgICAgPEd1dHRlclxuICAgICAgICAgICAgbmFtZT1cImRpZmYtaWNvbnNcIlxuICAgICAgICAgICAgcHJpb3JpdHk9ezR9XG4gICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaWNvbnNcIlxuICAgICAgICAgICAgbGFiZWxGbj17YmxhbmtMYWJlbH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uTGluZU51bWJlcn1cbiAgICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmRpZE1vdXNlTW92ZU9uTGluZU51bWJlcn1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlclBSQ29tbWVudEljb25zKCl9XG5cbiAgICAgICAge3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKS5tYXAodGhpcy5yZW5kZXJGaWxlUGF0Y2hEZWNvcmF0aW9ucyl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyTGluZURlY29yYXRpb25zKFxuICAgICAgICAgIEFycmF5LmZyb20odGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsIHJvdyA9PiBSYW5nZS5mcm9tT2JqZWN0KFtbcm93LCAwXSwgW3JvdywgSW5maW5pdHldXSkpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1zZWxlY3RlZCcsXG4gICAgICAgICAge2d1dHRlcjogdHJ1ZSwgaWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKFxuICAgICAgICAgIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QWRkaXRpb25MYXllcigpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1hZGRlZCcsXG4gICAgICAgICAge2ljb246IHRydWUsIGxpbmU6IHRydWV9LFxuICAgICAgICApfVxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXREZWxldGlvbkxheWVyKCksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLWRlbGV0ZWQnLFxuICAgICAgICAgIHtpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKFxuICAgICAgICAgIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0Tm9OZXdsaW5lTGF5ZXIoKSxcbiAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tbm9uZXdsaW5lJyxcbiAgICAgICAgICB7aWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG5cbiAgICAgIDwvQXRvbVRleHRFZGl0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclBSQ29tbWVudEljb25zKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlICE9PSBJc3N1ZWlzaERldGFpbEl0ZW0gfHxcbiAgICAgICAgdGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c0xvYWRpbmcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJldmlld0NvbW1lbnRUaHJlYWRzLm1hcCgoe2NvbW1lbnRzLCB0aHJlYWR9KSA9PiB7XG4gICAgICBjb25zdCB7cGF0aCwgcG9zaXRpb259ID0gY29tbWVudHNbMF07XG4gICAgICBpZiAoIXRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hGb3JQYXRoKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByb3cgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEJ1ZmZlclJvd0ZvckRpZmZQb3NpdGlvbihwYXRoLCBwb3NpdGlvbik7XG4gICAgICBpZiAocm93ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1Jvd1NlbGVjdGVkID0gdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MuaGFzKHJvdyk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyXG4gICAgICAgICAga2V5PXtgZ2l0aHViLWNvbW1lbnQtZ3V0dGVyLWRlY29yYXRpb24tJHt0aHJlYWQuaWR9YH1cbiAgICAgICAgICBjb21tZW50Um93PXtyb3d9XG4gICAgICAgICAgdGhyZWFkSWQ9e3RocmVhZC5pZH1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICAgIG93bmVyPXt0aGlzLnByb3BzLm93bmVyfVxuICAgICAgICAgIHJlcG89e3RoaXMucHJvcHMucmVwb31cbiAgICAgICAgICBudW1iZXI9e3RoaXMucHJvcHMubnVtYmVyfVxuICAgICAgICAgIHdvcmtkaXI9e3RoaXMucHJvcHMud29ya2RpclBhdGh9XG4gICAgICAgICAgZXh0cmFDbGFzc2VzPXtpc1Jvd1NlbGVjdGVkID8gWydnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1zZWxlY3RlZCddIDogW119XG4gICAgICAgICAgcGFyZW50PXt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMgPSAoZmlsZVBhdGNoLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGlzQ29sbGFwc2VkID0gIWZpbGVQYXRjaC5nZXRSZW5kZXJTdGF0dXMoKS5pc1Zpc2libGUoKTtcbiAgICBjb25zdCBpc0VtcHR5ID0gZmlsZVBhdGNoLmdldE1hcmtlcigpLmdldFJhbmdlKCkuaXNFbXB0eSgpO1xuICAgIGNvbnN0IGlzRXhwYW5kYWJsZSA9IGZpbGVQYXRjaC5nZXRSZW5kZXJTdGF0dXMoKS5pc0V4cGFuZGFibGUoKTtcbiAgICBjb25zdCBpc1VuYXZhaWxhYmxlID0gaXNDb2xsYXBzZWQgJiYgIWlzRXhwYW5kYWJsZTtcbiAgICBjb25zdCBhdEVuZCA9IGZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCkuc3RhcnQuaXNFcXVhbCh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gaXNFbXB0eSAmJiBhdEVuZCA/ICdhZnRlcicgOiAnYmVmb3JlJztcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQga2V5PXtmaWxlUGF0Y2guZ2V0UGF0aCgpfT5cbiAgICAgICAgPE1hcmtlciBpbnZhbGlkYXRlPVwibmV2ZXJcIiBidWZmZXJSYW5nZT17ZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKX0+XG4gICAgICAgICAgPERlY29yYXRpb24gdHlwZT1cImJsb2NrXCIgcG9zaXRpb249e3Bvc2l0aW9ufSBvcmRlcj17aW5kZXh9IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuICAgICAgICAgICAgPEZpbGVQYXRjaEhlYWRlclZpZXdcbiAgICAgICAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgICAgICAgIHJlbFBhdGg9e2ZpbGVQYXRjaC5nZXRQYXRoKCl9XG4gICAgICAgICAgICAgIG5ld1BhdGg9e2ZpbGVQYXRjaC5nZXRTdGF0dXMoKSA9PT0gJ3JlbmFtZWQnID8gZmlsZVBhdGNoLmdldE5ld1BhdGgoKSA6IG51bGx9XG4gICAgICAgICAgICAgIHN0YWdpbmdTdGF0dXM9e3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c31cbiAgICAgICAgICAgICAgaXNQYXJ0aWFsbHlTdGFnZWQ9e3RoaXMucHJvcHMuaXNQYXJ0aWFsbHlTdGFnZWR9XG4gICAgICAgICAgICAgIGhhc1VuZG9IaXN0b3J5PXt0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5fVxuICAgICAgICAgICAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zPXt0aGlzLnByb3BzLmhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnN9XG5cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG5cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXsoKSA9PiB0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24oZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgZGl2ZUludG9NaXJyb3JQYXRjaD17KCkgPT4gdGhpcy5wcm9wcy5kaXZlSW50b01pcnJvclBhdGNoKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgIG9wZW5GaWxlPXsoKSA9PiB0aGlzLmRpZE9wZW5GaWxlKHtzZWxlY3RlZEZpbGVQYXRjaDogZmlsZVBhdGNofSl9XG4gICAgICAgICAgICAgIHRvZ2dsZUZpbGU9eygpID0+IHRoaXMucHJvcHMudG9nZ2xlRmlsZShmaWxlUGF0Y2gpfVxuXG4gICAgICAgICAgICAgIGlzQ29sbGFwc2VkPXtpc0NvbGxhcHNlZH1cbiAgICAgICAgICAgICAgdHJpZ2dlckNvbGxhcHNlPXsoKSA9PiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmNvbGxhcHNlRmlsZVBhdGNoKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgIHRyaWdnZXJFeHBhbmQ9eygpID0+IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZXhwYW5kRmlsZVBhdGNoKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgeyFpc0NvbGxhcHNlZCAmJiB0aGlzLnJlbmRlclN5bWxpbmtDaGFuZ2VNZXRhKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIHRoaXMucmVuZGVyRXhlY3V0YWJsZU1vZGVDaGFuZ2VNZXRhKGZpbGVQYXRjaCl9XG4gICAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgICA8L01hcmtlcj5cblxuICAgICAgICB7aXNFeHBhbmRhYmxlICYmIHRoaXMucmVuZGVyRGlmZkdhdGUoZmlsZVBhdGNoLCBwb3NpdGlvbiwgaW5kZXgpfVxuICAgICAgICB7aXNVbmF2YWlsYWJsZSAmJiB0aGlzLnJlbmRlckRpZmZVbmF2YWlsYWJsZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBpbmRleCl9XG5cbiAgICAgICAge3RoaXMucmVuZGVySHVua0hlYWRlcnMoZmlsZVBhdGNoLCBpbmRleCl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEaWZmR2F0ZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBvcmRlck9mZnNldCkge1xuICAgIGNvbnN0IHNob3dEaWZmID0gKCkgPT4ge1xuICAgICAgYWRkRXZlbnQoJ2V4cGFuZC1maWxlLXBhdGNoJywge2NvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5leHBhbmRGaWxlUGF0Y2goZmlsZVBhdGNoKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyIGludmFsaWRhdGU9XCJuZXZlclwiIGJ1ZmZlclJhbmdlPXtmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpfT5cbiAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICB0eXBlPVwiYmxvY2tcIlxuICAgICAgICAgIG9yZGVyPXtvcmRlck9mZnNldCArIDAuMX1cbiAgICAgICAgICBwb3NpdGlvbj17cG9zaXRpb259XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udHJvbEJsb2NrXCI+XG5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXNzYWdlIGljb24gaWNvbi1pbmZvXCI+XG4gICAgICAgICAgICBMYXJnZSBkaWZmcyBhcmUgY29sbGFwc2VkIGJ5IGRlZmF1bHQgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctc2hvd0RpZmZCdXR0b25cIiBvbkNsaWNrPXtzaG93RGlmZn0+IExvYWQgRGlmZjwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cblxuICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICA8L01hcmtlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGlmZlVuYXZhaWxhYmxlKGZpbGVQYXRjaCwgcG9zaXRpb24sIG9yZGVyT2Zmc2V0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXIgaW52YWxpZGF0ZT1cIm5ldmVyXCIgYnVmZmVyUmFuZ2U9e2ZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCl9PlxuICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgIHR5cGU9XCJibG9ja1wiXG4gICAgICAgICAgb3JkZXI9e29yZGVyT2Zmc2V0ICsgMC4xfVxuICAgICAgICAgIHBvc2l0aW9uPXtwb3NpdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cblxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1lc3NhZ2UgaWNvbiBpY29uLXdhcm5pbmdcIj5cbiAgICAgICAgICAgIFRoaXMgZGlmZiBpcyB0b28gbGFyZ2UgdG8gbG9hZCBhdCBhbGwuIFVzZSB0aGUgY29tbWFuZC1saW5lIHRvIHZpZXcgaXQuXG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgIDwvTWFya2VyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJFeGVjdXRhYmxlTW9kZUNoYW5nZU1ldGEoZmlsZVBhdGNoKSB7XG4gICAgaWYgKCFmaWxlUGF0Y2guZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkTW9kZSA9IGZpbGVQYXRjaC5nZXRPbGRNb2RlKCk7XG4gICAgY29uc3QgbmV3TW9kZSA9IGZpbGVQYXRjaC5nZXROZXdNb2RlKCk7XG5cbiAgICBjb25zdCBhdHRycyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgPyB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtZG93bicsXG4gICAgICAgIGFjdGlvblRleHQ6ICdTdGFnZSBNb2RlIENoYW5nZScsXG4gICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS11cCcsXG4gICAgICAgIGFjdGlvblRleHQ6ICdVbnN0YWdlIE1vZGUgQ2hhbmdlJyxcbiAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZpbGVQYXRjaE1ldGFWaWV3XG4gICAgICAgIHRpdGxlPVwiTW9kZSBjaGFuZ2VcIlxuICAgICAgICBhY3Rpb25JY29uPXthdHRycy5hY3Rpb25JY29ufVxuICAgICAgICBhY3Rpb25UZXh0PXthdHRycy5hY3Rpb25UZXh0fVxuICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgYWN0aW9uPXsoKSA9PiB0aGlzLnByb3BzLnRvZ2dsZU1vZGVDaGFuZ2UoZmlsZVBhdGNoKX0+XG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBGaWxlIGNoYW5nZWQgbW9kZVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1yZW1vdmVkXCI+XG4gICAgICAgICAgICBmcm9tIHtleGVjdXRhYmxlVGV4dFtvbGRNb2RlXX0gPGNvZGU+e29sZE1vZGV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZiBnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tYWRkZWRcIj5cbiAgICAgICAgICAgIHRvIHtleGVjdXRhYmxlVGV4dFtuZXdNb2RlXX0gPGNvZGU+e25ld01vZGV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgIDwvRmlsZVBhdGNoTWV0YVZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclN5bWxpbmtDaGFuZ2VNZXRhKGZpbGVQYXRjaCkge1xuICAgIGlmICghZmlsZVBhdGNoLmhhc1N5bWxpbmsoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGRldGFpbCA9IDxkaXYgLz47XG4gICAgbGV0IHRpdGxlID0gJyc7XG4gICAgY29uc3Qgb2xkU3ltbGluayA9IGZpbGVQYXRjaC5nZXRPbGRTeW1saW5rKCk7XG4gICAgY29uc3QgbmV3U3ltbGluayA9IGZpbGVQYXRjaC5nZXROZXdTeW1saW5rKCk7XG4gICAgaWYgKG9sZFN5bWxpbmsgJiYgbmV3U3ltbGluaykge1xuICAgICAgZGV0YWlsID0gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgU3ltbGluayBjaGFuZ2VkXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZicsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWZ1bGxXaWR0aCcsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLXJlbW92ZWQnLFxuICAgICAgICAgICl9PlxuICAgICAgICAgICAgZnJvbSA8Y29kZT57b2xkU3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y3goXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYnLFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1mdWxsV2lkdGgnLFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1hZGRlZCcsXG4gICAgICAgICAgKX0+XG4gICAgICAgICAgICB0byA8Y29kZT57bmV3U3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPi5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgICB0aXRsZSA9ICdTeW1saW5rIGNoYW5nZWQnO1xuICAgIH0gZWxzZSBpZiAob2xkU3ltbGluayAmJiAhbmV3U3ltbGluaykge1xuICAgICAgZGV0YWlsID0gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgU3ltbGlua1xuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1yZW1vdmVkXCI+XG4gICAgICAgICAgICB0byA8Y29kZT57b2xkU3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIGRlbGV0ZWQuXG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgICAgdGl0bGUgPSAnU3ltbGluayBkZWxldGVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGV0YWlsID0gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgU3ltbGlua1xuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1hZGRlZFwiPlxuICAgICAgICAgICAgdG8gPGNvZGU+e25ld1N5bWxpbmt9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICBjcmVhdGVkLlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICAgIHRpdGxlID0gJ1N5bWxpbmsgY3JlYXRlZCc7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cnMgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCdcbiAgICAgID8ge1xuICAgICAgICBhY3Rpb25JY29uOiAnaWNvbi1tb3ZlLWRvd24nLFxuICAgICAgICBhY3Rpb25UZXh0OiAnU3RhZ2UgU3ltbGluayBDaGFuZ2UnLFxuICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtdXAnLFxuICAgICAgICBhY3Rpb25UZXh0OiAnVW5zdGFnZSBTeW1saW5rIENoYW5nZScsXG4gICAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGaWxlUGF0Y2hNZXRhVmlld1xuICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgIGFjdGlvbkljb249e2F0dHJzLmFjdGlvbkljb259XG4gICAgICAgIGFjdGlvblRleHQ9e2F0dHJzLmFjdGlvblRleHR9XG4gICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICBhY3Rpb249eygpID0+IHRoaXMucHJvcHMudG9nZ2xlU3ltbGlua0NoYW5nZShmaWxlUGF0Y2gpfT5cbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIHtkZXRhaWx9XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICA8L0ZpbGVQYXRjaE1ldGFWaWV3PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIdW5rSGVhZGVycyhmaWxlUGF0Y2gsIG9yZGVyT2Zmc2V0KSB7XG4gICAgY29uc3QgdG9nZ2xlVmVyYiA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJyA/ICdTdGFnZScgOiAnVW5zdGFnZSc7XG4gICAgY29uc3Qgc2VsZWN0ZWRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICBBcnJheS5mcm9tKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLCByb3cgPT4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQocm93KSksXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxNYXJrZXJMYXllcj5cbiAgICAgICAgICB7ZmlsZVBhdGNoLmdldEh1bmtzKCkubWFwKChodW5rLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGFpbnNTZWxlY3Rpb24gPSB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdsaW5lJyAmJiBzZWxlY3RlZEh1bmtzLmhhcyhodW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlID09PSAnaHVuaycpICYmIHNlbGVjdGVkSHVua3MuaGFzKGh1bmspO1xuXG4gICAgICAgICAgICBsZXQgYnV0dG9uU3VmZml4ID0gJyc7XG4gICAgICAgICAgICBpZiAoY29udGFpbnNTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdTZWxlY3RlZCBMaW5lJztcbiAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLnNpemUgPiAxKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdzJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdIdW5rJztcbiAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSHVua3Muc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ3MnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvZ2dsZVNlbGVjdGlvbkxhYmVsID0gYCR7dG9nZ2xlVmVyYn0gJHtidXR0b25TdWZmaXh9YDtcbiAgICAgICAgICAgIGNvbnN0IGRpc2NhcmRTZWxlY3Rpb25MYWJlbCA9IGBEaXNjYXJkICR7YnV0dG9uU3VmZml4fWA7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSBodW5rLmdldFJhbmdlKCkuc3RhcnQ7XG4gICAgICAgICAgICBjb25zdCBzdGFydFJhbmdlID0gbmV3IFJhbmdlKHN0YXJ0UG9pbnQsIHN0YXJ0UG9pbnQpO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8TWFya2VyIGtleT17YGh1bmtIZWFkZXItJHtpbmRleH1gfSBidWZmZXJSYW5nZT17c3RhcnRSYW5nZX0gaW52YWxpZGF0ZT1cIm5ldmVyXCI+XG4gICAgICAgICAgICAgICAgPERlY29yYXRpb24gdHlwZT1cImJsb2NrXCIgb3JkZXI9e29yZGVyT2Zmc2V0ICsgMC4yfSBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgIDxIdW5rSGVhZGVyVmlld1xuICAgICAgICAgICAgICAgICAgICByZWZUYXJnZXQ9e3RoaXMucmVmRWRpdG9yRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgICAgaHVuaz17aHVua31cbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgc3RhZ2luZ1N0YXR1cz17dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlPVwibGluZVwiXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNlbGVjdGlvbkxhYmVsPXt0b2dnbGVTZWxlY3Rpb25MYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgZGlzY2FyZFNlbGVjdGlvbkxhYmVsPXtkaXNjYXJkU2VsZWN0aW9uTGFiZWx9XG5cbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cblxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTZWxlY3Rpb249eygpID0+IHRoaXMudG9nZ2xlSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbil9XG4gICAgICAgICAgICAgICAgICAgIGRpc2NhcmRTZWxlY3Rpb249eygpID0+IHRoaXMuZGlzY2FyZEh1bmtTZWxlY3Rpb24oaHVuaywgY29udGFpbnNTZWxlY3Rpb24pfVxuICAgICAgICAgICAgICAgICAgICBtb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25IZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICAgICAgICAgIDwvTWFya2VyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9NYXJrZXJMYXllcj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxpbmVEZWNvcmF0aW9ucyhyYW5nZXMsIGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbiwgcmVmSG9sZGVyfSkge1xuICAgIGlmIChyYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBob2xkZXIgPSByZWZIb2xkZXIgfHwgbmV3IFJlZkhvbGRlcigpO1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyTGF5ZXIgaGFuZGxlTGF5ZXI9e2hvbGRlci5zZXR0ZXJ9PlxuICAgICAgICB7cmFuZ2VzLm1hcCgocmFuZ2UsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxNYXJrZXJcbiAgICAgICAgICAgICAga2V5PXtgbGluZS0ke2xpbmVDbGFzc30tJHtpbmRleH1gfVxuICAgICAgICAgICAgICBidWZmZXJSYW5nZT17cmFuZ2V9XG4gICAgICAgICAgICAgIGludmFsaWRhdGU9XCJuZXZlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9ucyhsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KX1cbiAgICAgIDwvTWFya2VyTGF5ZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRlY29yYXRpb25zT25MYXllcihsYXllciwgbGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSkge1xuICAgIGlmIChsYXllci5nZXRNYXJrZXJDb3VudCgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlckxheWVyIGV4dGVybmFsPXtsYXllcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zKGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbn0pfVxuICAgICAgPC9NYXJrZXJMYXllcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVjb3JhdGlvbnMobGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIHtsaW5lICYmIChcbiAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgdHlwZT1cImxpbmVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICB7Z3V0dGVyICYmIChcbiAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgICBndXR0ZXJOYW1lPVwib2xkLWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgICBndXR0ZXJOYW1lPVwibmV3LWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgICB0eXBlPVwiZ3V0dGVyXCJcbiAgICAgICAgICAgICAgZ3V0dGVyTmFtZT1cImdpdGh1Yi1jb21tZW50LWljb25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItZWRpdG9yQ29tbWVudEd1dHRlckljb24gZW1wdHkgJHtsaW5lQ2xhc3N9YH1cbiAgICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICl9XG4gICAgICAgIHtpY29uICYmIChcbiAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICAgIGd1dHRlck5hbWU9XCJkaWZmLWljb25zXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRGaWxlUGF0Y2hlcyA9IEFycmF5LmZyb20odGhpcy5nZXRTZWxlY3RlZEZpbGVQYXRjaGVzKCkpO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDaGFuZ2VkRmlsZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmQoc2VsZWN0ZWRGaWxlUGF0Y2hlc1swXSwge2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2NvcmU6dW5kbyd9fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbiA9IGZpbGVQYXRjaCA9PiB7XG4gICAgdGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmQoZmlsZVBhdGNoLCB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSk7XG4gIH1cblxuICBkaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFJvd3MoXG4gICAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93cyxcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSxcbiAgICAgIHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6ZGlzY2FyZC1zZWxlY3RlZC1saW5lcyd9fSxcbiAgICApO1xuICB9XG5cbiAgdG9nZ2xlSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbikge1xuICAgIGlmIChjb250YWluc1NlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlUm93cyhcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSxcbiAgICAgICAge2V2ZW50U291cmNlOiAnYnV0dG9uJ30sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjaGFuZ2VSb3dzID0gbmV3IFNldChcbiAgICAgICAgaHVuay5nZXRDaGFuZ2VzKClcbiAgICAgICAgICAucmVkdWNlKChyb3dzLCBjaGFuZ2UpID0+IHtcbiAgICAgICAgICAgIHJvd3MucHVzaCguLi5jaGFuZ2UuZ2V0QnVmZmVyUm93cygpKTtcbiAgICAgICAgICAgIHJldHVybiByb3dzO1xuICAgICAgICAgIH0sIFtdKSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVSb3dzKFxuICAgICAgICBjaGFuZ2VSb3dzLFxuICAgICAgICAnaHVuaycsXG4gICAgICAgIHtldmVudFNvdXJjZTogJ2J1dHRvbid9LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBkaXNjYXJkSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbikge1xuICAgIGlmIChjb250YWluc1NlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFJvd3MoXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLFxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUsXG4gICAgICAgIHtldmVudFNvdXJjZTogJ2J1dHRvbid9LFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2hhbmdlUm93cyA9IG5ldyBTZXQoXG4gICAgICAgIGh1bmsuZ2V0Q2hhbmdlcygpXG4gICAgICAgICAgLnJlZHVjZSgocm93cywgY2hhbmdlKSA9PiB7XG4gICAgICAgICAgICByb3dzLnB1c2goLi4uY2hhbmdlLmdldEJ1ZmZlclJvd3MoKSk7XG4gICAgICAgICAgICByZXR1cm4gcm93cztcbiAgICAgICAgICB9LCBbXSksXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFJvd3MoY2hhbmdlUm93cywgJ2h1bmsnLCB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSk7XG4gICAgfVxuICB9XG5cbiAgZGlkTW91c2VEb3duT25IZWFkZXIoZXZlbnQsIGh1bmspIHtcbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQsIGh1bmsuZ2V0UmFuZ2UoKSk7XG4gIH1cblxuICBkaWRNb3VzZURvd25PbkxpbmVOdW1iZXIoZXZlbnQpIHtcbiAgICBjb25zdCBsaW5lID0gZXZlbnQuYnVmZmVyUm93O1xuICAgIGlmIChsaW5lID09PSB1bmRlZmluZWQgfHwgaXNOYU4obGluZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgIGlmICh0aGlzLmhhbmRsZVNlbGVjdGlvbkV2ZW50KGV2ZW50LmRvbUV2ZW50LCBbW2xpbmUsIDBdLCBbbGluZSwgSW5maW5pdHldXSkpIHtcbiAgICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBkaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXIoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGluZSA9IGV2ZW50LmJ1ZmZlclJvdztcbiAgICBpZiAodGhpcy5sYXN0TW91c2VNb3ZlTGluZSA9PT0gbGluZSB8fCBsaW5lID09PSB1bmRlZmluZWQgfHwgaXNOYU4obGluZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sYXN0TW91c2VNb3ZlTGluZSA9IGxpbmU7XG5cbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQuZG9tRXZlbnQsIFtbbGluZSwgMF0sIFtsaW5lLCBJbmZpbml0eV1dLCB7YWRkOiB0cnVlfSk7XG4gIH1cblxuICBkaWRNb3VzZVVwKCkge1xuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVTZWxlY3Rpb25FdmVudChldmVudCwgcmFuZ2VMaWtlLCBvcHRzKSB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGlzV2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgIWlzV2luZG93cykge1xuICAgICAgLy8gQWxsb3cgdGhlIGNvbnRleHQgbWVudSB0byBvcGVuLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBhZGQ6IGZhbHNlLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSB0YXJnZXQgc2VsZWN0aW9uIHJhbmdlXG4gICAgY29uc3QgY29udmVydGVkID0gUmFuZ2UuZnJvbU9iamVjdChyYW5nZUxpa2UpO1xuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3IuY2xpcEJ1ZmZlclJhbmdlKGNvbnZlcnRlZCkpLmdldE9yKGNvbnZlcnRlZCk7XG5cbiAgICBpZiAoZXZlbnQubWV0YUtleSB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoZXZlbnQuY3RybEtleSAmJiBpc1dpbmRvd3MpKSB7XG4gICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgbGV0IGludGVyc2VjdHMgPSBmYWxzZTtcbiAgICAgICAgbGV0IHdpdGhvdXQgPSBudWxsO1xuXG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0aW9uIG9mIGVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0aW9uLmludGVyc2VjdHNCdWZmZXJSYW5nZShyYW5nZSkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSByYW5nZSBmcm9tIHRoaXMgc2VsZWN0aW9uIGJ5IHRydW5jYXRpbmcgaXQgdG8gdGhlIFwibmVhciBlZGdlXCIgb2YgdGhlIHJhbmdlIGFuZCBjcmVhdGluZyBhXG4gICAgICAgICAgICAvLyBuZXcgc2VsZWN0aW9uIGZyb20gdGhlIFwiZmFyIGVkZ2VcIiB0byB0aGUgcHJldmlvdXMgZW5kLiBPbWl0IGVpdGhlciBzaWRlIGlmIGl0IGlzIGVtcHR5LlxuICAgICAgICAgICAgaW50ZXJzZWN0cyA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdSYW5nZXMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKCFyYW5nZS5zdGFydC5pc0VxdWFsKHNlbGVjdGlvblJhbmdlLnN0YXJ0KSkge1xuICAgICAgICAgICAgICAvLyBJbmNsdWRlIHRoZSBiaXQgZnJvbSB0aGUgc2VsZWN0aW9uJ3MgcHJldmlvdXMgc3RhcnQgdG8gdGhlIHJhbmdlJ3Mgc3RhcnQuXG4gICAgICAgICAgICAgIGxldCBudWRnZWQgPSByYW5nZS5zdGFydDtcbiAgICAgICAgICAgICAgaWYgKHJhbmdlLnN0YXJ0LmNvbHVtbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDb2x1bW4gPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhyYW5nZS5zdGFydC5yb3cgLSAxKTtcbiAgICAgICAgICAgICAgICBudWRnZWQgPSBbcmFuZ2Uuc3RhcnQucm93IC0gMSwgbGFzdENvbHVtbl07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBuZXdSYW5nZXMucHVzaChbc2VsZWN0aW9uUmFuZ2Uuc3RhcnQsIG51ZGdlZF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJhbmdlLmVuZC5pc0VxdWFsKHNlbGVjdGlvblJhbmdlLmVuZCkpIHtcbiAgICAgICAgICAgICAgLy8gSW5jbHVkZSB0aGUgYml0IGZyb20gdGhlIHJhbmdlJ3MgZW5kIHRvIHRoZSBzZWxlY3Rpb24ncyBlbmQuXG4gICAgICAgICAgICAgIGxldCBudWRnZWQgPSByYW5nZS5lbmQ7XG4gICAgICAgICAgICAgIGNvbnN0IGxhc3RDb2x1bW4gPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhyYW5nZS5lbmQucm93KTtcbiAgICAgICAgICAgICAgaWYgKHJhbmdlLmVuZC5jb2x1bW4gPT09IGxhc3RDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICBudWRnZWQgPSBbcmFuZ2UuZW5kLnJvdyArIDEsIDBdO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbmV3UmFuZ2VzLnB1c2goW251ZGdlZCwgc2VsZWN0aW9uUmFuZ2UuZW5kXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXdSYW5nZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UobmV3UmFuZ2VzWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBuZXdSYW5nZSBvZiBuZXdSYW5nZXMuc2xpY2UoMSkpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UobmV3UmFuZ2UsIHtyZXZlcnNlZDogc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKX0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3aXRob3V0ID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aXRob3V0ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRSYW5nZXMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgICAgICAuZmlsdGVyKGVhY2ggPT4gZWFjaCAhPT0gd2l0aG91dClcbiAgICAgICAgICAgIC5tYXAoZWFjaCA9PiBlYWNoLmdldEJ1ZmZlclJhbmdlKCkpO1xuICAgICAgICAgIGlmIChyZXBsYWNlbWVudFJhbmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMocmVwbGFjZW1lbnRSYW5nZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW50ZXJzZWN0cykge1xuICAgICAgICAgIC8vIEFkZCB0aGlzIHJhbmdlIGFzIGEgbmV3LCBkaXN0aW5jdCBzZWxlY3Rpb24uXG4gICAgICAgICAgZWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKHJhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmFkZCB8fCBldmVudC5zaGlmdEtleSkge1xuICAgICAgLy8gRXh0ZW5kIHRoZSBleGlzdGluZyBzZWxlY3Rpb24gdG8gZW5jb21wYXNzIHRoaXMgcmFuZ2UuXG4gICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgY29uc3QgbGFzdFNlbGVjdGlvbiA9IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCk7XG4gICAgICAgIGNvbnN0IGxhc3RTZWxlY3Rpb25SYW5nZSA9IGxhc3RTZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKTtcblxuICAgICAgICAvLyBZb3UgYXJlIG5vdyBlbnRlcmluZyB0aGUgd2FsbCBvZiB0ZXJuZXJ5IG9wZXJhdG9ycy4gVGhpcyBpcyB5b3VyIGxhc3QgZXhpdCBiZWZvcmUgdGhlIHRvbGxib290aFxuICAgICAgICBjb25zdCBpc0JlZm9yZSA9IHJhbmdlLnN0YXJ0LmlzTGVzc1RoYW4obGFzdFNlbGVjdGlvblJhbmdlLnN0YXJ0KTtcbiAgICAgICAgY29uc3QgZmFyRWRnZSA9IGlzQmVmb3JlID8gcmFuZ2Uuc3RhcnQgOiByYW5nZS5lbmQ7XG4gICAgICAgIGNvbnN0IG5ld1JhbmdlID0gaXNCZWZvcmUgPyBbZmFyRWRnZSwgbGFzdFNlbGVjdGlvblJhbmdlLmVuZF0gOiBbbGFzdFNlbGVjdGlvblJhbmdlLnN0YXJ0LCBmYXJFZGdlXTtcblxuICAgICAgICBsYXN0U2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG5ld1JhbmdlLCB7cmV2ZXJzZWQ6IGlzQmVmb3JlfSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRpZENvbmZpcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlUm93cyh0aGlzLnByb3BzLnNlbGVjdGVkUm93cywgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlKTtcbiAgfVxuXG4gIGRpZFRvZ2dsZVNlbGVjdGlvbk1vZGUoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRIdW5rcyA9IHRoaXMuZ2V0U2VsZWN0ZWRIdW5rcygpO1xuICAgIHRoaXMud2l0aFNlbGVjdGlvbk1vZGUoe1xuICAgICAgbGluZTogKCkgPT4ge1xuICAgICAgICBjb25zdCBodW5rUmFuZ2VzID0gc2VsZWN0ZWRIdW5rcy5tYXAoaHVuayA9PiBodW5rLmdldFJhbmdlKCkpO1xuICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhodW5rUmFuZ2VzKSk7XG4gICAgICB9LFxuICAgICAgaHVuazogKCkgPT4ge1xuICAgICAgICBsZXQgZmlyc3RDaGFuZ2VSb3cgPSBJbmZpbml0eTtcbiAgICAgICAgZm9yIChjb25zdCBodW5rIG9mIHNlbGVjdGVkSHVua3MpIHtcbiAgICAgICAgICBjb25zdCBbZmlyc3RDaGFuZ2VdID0gaHVuay5nZXRDaGFuZ2VzKCk7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoZmlyc3RDaGFuZ2UgJiYgKCFmaXJzdENoYW5nZVJvdyB8fCBmaXJzdENoYW5nZS5nZXRTdGFydEJ1ZmZlclJvdygpIDwgZmlyc3RDaGFuZ2VSb3cpKSB7XG4gICAgICAgICAgICBmaXJzdENoYW5nZVJvdyA9IGZpcnN0Q2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdsaW5lJztcbiAgICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKFtbW2ZpcnN0Q2hhbmdlUm93LCAwXSwgW2ZpcnN0Q2hhbmdlUm93LCBJbmZpbml0eV1dXSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGRpZFRvZ2dsZU1vZGVDaGFuZ2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLmdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSlcbiAgICAgICAgLmZpbHRlcihmcCA9PiBmcC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKVxuICAgICAgICAubWFwKHRoaXMucHJvcHMudG9nZ2xlTW9kZUNoYW5nZSksXG4gICAgKTtcbiAgfVxuXG4gIGRpZFRvZ2dsZVN5bWxpbmtDaGFuZ2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLmdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSlcbiAgICAgICAgLmZpbHRlcihmcCA9PiBmcC5oYXNUeXBlY2hhbmdlKCkpXG4gICAgICAgIC5tYXAodGhpcy5wcm9wcy50b2dnbGVTeW1saW5rQ2hhbmdlKSxcbiAgICApO1xuICB9XG5cbiAgc2VsZWN0TmV4dEh1bmsoKSB7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBuZXh0SHVua3MgPSBuZXcgU2V0KFxuICAgICAgICB0aGlzLndpdGhTZWxlY3RlZEh1bmtzKGh1bmsgPT4gdGhpcy5nZXRIdW5rQWZ0ZXIoaHVuaykgfHwgaHVuayksXG4gICAgICApO1xuICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IEFycmF5LmZyb20obmV4dEh1bmtzLCBodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5leHRSYW5nZXMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RQcmV2aW91c0h1bmsoKSB7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBuZXh0SHVua3MgPSBuZXcgU2V0KFxuICAgICAgICB0aGlzLndpdGhTZWxlY3RlZEh1bmtzKGh1bmsgPT4gdGhpcy5nZXRIdW5rQmVmb3JlKGh1bmspIHx8IGh1bmspLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5leHRSYW5nZXMgPSBBcnJheS5mcm9tKG5leHRIdW5rcywgaHVuayA9PiBodW5rLmdldFJhbmdlKCkpO1xuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhuZXh0UmFuZ2VzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgZGlkT3BlbkZpbGUoe3NlbGVjdGVkRmlsZVBhdGNofSkge1xuICAgIGNvbnN0IGN1cnNvcnNCeUZpbGVQYXRjaCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcGxhY2VkUm93cyA9IG5ldyBTZXQoKTtcblxuICAgICAgZm9yIChjb25zdCBjdXJzb3Igb2YgZWRpdG9yLmdldEN1cnNvcnMoKSkge1xuICAgICAgICBjb25zdCBjdXJzb3JSb3cgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKS5yb3c7XG4gICAgICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChjdXJzb3JSb3cpO1xuICAgICAgICBjb25zdCBmaWxlUGF0Y2ggPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaEF0KGN1cnNvclJvdyk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGlmICghaHVuaykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1JvdyA9IGh1bmsuZ2V0TmV3Um93QXQoY3Vyc29yUm93KTtcbiAgICAgICAgbGV0IG5ld0NvbHVtbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLmNvbHVtbjtcbiAgICAgICAgaWYgKG5ld1JvdyA9PT0gbnVsbCkge1xuICAgICAgICAgIGxldCBuZWFyZXN0Um93ID0gaHVuay5nZXROZXdTdGFydFJvdygpO1xuICAgICAgICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIGh1bmsuZ2V0UmVnaW9ucygpKSB7XG4gICAgICAgICAgICBpZiAoIXJlZ2lvbi5pbmNsdWRlc0J1ZmZlclJvdyhjdXJzb3JSb3cpKSB7XG4gICAgICAgICAgICAgIHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIG5lYXJlc3RSb3cgKz0gcmVnaW9uLmJ1ZmZlclJvd0NvdW50KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZGRpdGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbmVhcmVzdFJvdyArPSByZWdpb24uYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghcGxhY2VkUm93cy5oYXMobmVhcmVzdFJvdykpIHtcbiAgICAgICAgICAgIG5ld1JvdyA9IG5lYXJlc3RSb3c7XG4gICAgICAgICAgICBuZXdDb2x1bW4gPSAwO1xuICAgICAgICAgICAgcGxhY2VkUm93cy5hZGQobmVhcmVzdFJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld1JvdyAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFdoeSBpcyB0aGlzIG5lZWRlZD8gSSBfdGhpbmtfIGV2ZXJ5dGhpbmcgaXMgaW4gdGVybXMgb2YgYnVmZmVyIHBvc2l0aW9uXG4gICAgICAgICAgLy8gc28gdGhlcmUgc2hvdWxkbid0IGJlIGFuIG9mZi1ieS1vbmUgaXNzdWVcbiAgICAgICAgICBuZXdSb3cgLT0gMTtcbiAgICAgICAgICBjb25zdCBjdXJzb3JzID0gY3Vyc29yc0J5RmlsZVBhdGNoLmdldChmaWxlUGF0Y2gpO1xuICAgICAgICAgIGlmICghY3Vyc29ycykge1xuICAgICAgICAgICAgY3Vyc29yc0J5RmlsZVBhdGNoLnNldChmaWxlUGF0Y2gsIFtbbmV3Um93LCBuZXdDb2x1bW5dXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnNvcnMucHVzaChbbmV3Um93LCBuZXdDb2x1bW5dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmaWxlUGF0Y2hlc1dpdGhDdXJzb3JzID0gbmV3IFNldChjdXJzb3JzQnlGaWxlUGF0Y2gua2V5cygpKTtcbiAgICBpZiAoc2VsZWN0ZWRGaWxlUGF0Y2ggJiYgIWZpbGVQYXRjaGVzV2l0aEN1cnNvcnMuaGFzKHNlbGVjdGVkRmlsZVBhdGNoKSkge1xuICAgICAgY29uc3QgW2ZpcnN0SHVua10gPSBzZWxlY3RlZEZpbGVQYXRjaC5nZXRIdW5rcygpO1xuICAgICAgY29uc3QgY3Vyc29yUm93ID0gZmlyc3RIdW5rID8gZmlyc3RIdW5rLmdldE5ld1N0YXJ0Um93KCkgLSAxIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gMDtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5GaWxlKHNlbGVjdGVkRmlsZVBhdGNoLCBbW2N1cnNvclJvdywgMF1dLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGVuZGluZyA9IGN1cnNvcnNCeUZpbGVQYXRjaC5zaXplID09PSAxO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKEFycmF5LmZyb20oY3Vyc29yc0J5RmlsZVBhdGNoLCB2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IFtmaWxlUGF0Y2gsIGN1cnNvcnNdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5GaWxlKGZpbGVQYXRjaCwgY3Vyc29ycywgcGVuZGluZyk7XG4gICAgICB9KSk7XG4gICAgfVxuXG4gIH1cblxuICBnZXRTZWxlY3RlZFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBTZXQoXG4gICAgICAgIGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICAubWFwKHNlbGVjdGlvbiA9PiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKSlcbiAgICAgICAgICAucmVkdWNlKChhY2MsIHJhbmdlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByYW5nZS5nZXRSb3dzKCkpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDaGFuZ2VSb3cocm93KSkge1xuICAgICAgICAgICAgICAgIGFjYy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSwgW10pLFxuICAgICAgKTtcbiAgICB9KS5nZXRPcihuZXcgU2V0KCkpO1xuICB9XG5cbiAgZGlkQWRkU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gIH1cblxuICBkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZShldmVudCkge1xuICAgIGlmIChcbiAgICAgICFldmVudCB8fFxuICAgICAgZXZlbnQub2xkQnVmZmVyUmFuZ2Uuc3RhcnQucm93ICE9PSBldmVudC5uZXdCdWZmZXJSYW5nZS5zdGFydC5yb3cgfHxcbiAgICAgIGV2ZW50Lm9sZEJ1ZmZlclJhbmdlLmVuZC5yb3cgIT09IGV2ZW50Lm5ld0J1ZmZlclJhbmdlLmVuZC5yb3dcbiAgICApIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gICAgfVxuICB9XG5cbiAgZGlkRGVzdHJveVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkUm93cygpO1xuICB9XG5cbiAgZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCkge1xuICAgIGlmICh0aGlzLnN1cHByZXNzQ2hhbmdlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRDdXJzb3JSb3dzID0gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICByZXR1cm4gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5yb3cpO1xuICAgIH0pLmdldE9yKFtdKTtcbiAgICBjb25zdCBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5zcGFuc011bHRpcGxlRmlsZXMobmV4dEN1cnNvclJvd3MpO1xuXG4gICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3NDaGFuZ2VkKFxuICAgICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MoKSxcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgfHwgJ2xpbmUnLFxuICAgICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyxcbiAgICApO1xuICB9XG5cbiAgb2xkTGluZU51bWJlckxhYmVsKHtidWZmZXJSb3csIHNvZnRXcmFwcGVkfSkge1xuICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChidWZmZXJSb3cpO1xuICAgIGlmIChodW5rID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZCgnJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkUm93ID0gaHVuay5nZXRPbGRSb3dBdChidWZmZXJSb3cpO1xuICAgIGlmIChzb2Z0V3JhcHBlZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKG9sZFJvdyA9PT0gbnVsbCA/ICcnIDogJ+KAoicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhZChvbGRSb3cpO1xuICB9XG5cbiAgbmV3TGluZU51bWJlckxhYmVsKHtidWZmZXJSb3csIHNvZnRXcmFwcGVkfSkge1xuICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChidWZmZXJSb3cpO1xuICAgIGlmIChodW5rID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZCgnJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Um93ID0gaHVuay5nZXROZXdSb3dBdChidWZmZXJSb3cpO1xuICAgIGlmIChzb2Z0V3JhcHBlZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKG5ld1JvdyA9PT0gbnVsbCA/ICcnIDogJ+KAoicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYWQobmV3Um93KTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIFNldCBvZiB0aGUgSHVua3MgdGhhdCBpbmNsdWRlIGF0IGxlYXN0IG9uZSBlZGl0b3Igc2VsZWN0aW9uLiBUaGUgc2VsZWN0aW9uIG5lZWQgbm90IGNvbnRhaW4gYW4gYWN0dWFsXG4gICAqIGNoYW5nZSByb3cuXG4gICAqL1xuICBnZXRTZWxlY3RlZEh1bmtzKCkge1xuICAgIHJldHVybiB0aGlzLndpdGhTZWxlY3RlZEh1bmtzKGVhY2ggPT4gZWFjaCk7XG4gIH1cblxuICB3aXRoU2VsZWN0ZWRIdW5rcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgICByZXR1cm4gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkucmVkdWNlKChhY2MsIHJhbmdlKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJhbmdlLmdldFJvd3MoKSkge1xuICAgICAgICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChyb3cpO1xuICAgICAgICAgIGlmICghaHVuayB8fCBzZWVuLmhhcyhodW5rKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Vlbi5hZGQoaHVuayk7XG4gICAgICAgICAgYWNjLnB1c2goY2FsbGJhY2soaHVuaykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCBbXSk7XG4gICAgfSkuZ2V0T3IoW10pO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgU2V0IG9mIEZpbGVQYXRjaGVzIHRoYXQgaW5jbHVkZSBhdCBsZWFzdCBvbmUgZWRpdG9yIHNlbGVjdGlvbi4gVGhlIHNlbGVjdGlvbiBuZWVkIG5vdCBjb250YWluIGFuIGFjdHVhbFxuICAgKiBjaGFuZ2Ugcm93LlxuICAgKi9cbiAgZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBwYXRjaGVzID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChjb25zdCByYW5nZSBvZiBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByYW5nZS5nZXRSb3dzKCkpIHtcbiAgICAgICAgICBjb25zdCBwYXRjaCA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoQXQocm93KTtcbiAgICAgICAgICBwYXRjaGVzLmFkZChwYXRjaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXRjaGVzO1xuICAgIH0pLmdldE9yKG5ldyBTZXQoKSk7XG4gIH1cblxuICBnZXRIdW5rQmVmb3JlKGh1bmspIHtcbiAgICBjb25zdCBwcmV2Um93ID0gaHVuay5nZXRSYW5nZSgpLnN0YXJ0LnJvdyAtIDE7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KHByZXZSb3cpO1xuICB9XG5cbiAgZ2V0SHVua0FmdGVyKGh1bmspIHtcbiAgICBjb25zdCBuZXh0Um93ID0gaHVuay5nZXRSYW5nZSgpLmVuZC5yb3cgKyAxO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChuZXh0Um93KTtcbiAgfVxuXG4gIGlzQ2hhbmdlUm93KGJ1ZmZlclJvdykge1xuICAgIGNvbnN0IGNoYW5nZUxheWVycyA9IFt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEFkZGl0aW9uTGF5ZXIoKSwgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXREZWxldGlvbkxheWVyKCldO1xuICAgIHJldHVybiBjaGFuZ2VMYXllcnMuc29tZShsYXllciA9PiBsYXllci5maW5kTWFya2Vycyh7aW50ZXJzZWN0c1JvdzogYnVmZmVyUm93fSkubGVuZ3RoID4gMCk7XG4gIH1cblxuICB3aXRoU2VsZWN0aW9uTW9kZShjYWxsYmFja3MpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrc1t0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGVdO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBzZWxlY3Rpb24gbW9kZTogJHt0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGV9YCk7XG4gICAgfVxuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgcGFkKG51bSkge1xuICAgIGNvbnN0IG1heERpZ2l0cyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0TWF4TGluZU51bWJlcldpZHRoKCk7XG4gICAgaWYgKG51bSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIE5CU1BfQ0hBUkFDVEVSLnJlcGVhdChtYXhEaWdpdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTkJTUF9DSEFSQUNURVIucmVwZWF0KG1heERpZ2l0cyAtIG51bS50b1N0cmluZygpLmxlbmd0aCkgKyBudW0udG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb0ZpbGUgPSAoe2NoYW5nZWRGaWxlUGF0aCwgY2hhbmdlZEZpbGVQb3NpdGlvbn0pID0+IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uKGNoYW5nZWRGaWxlUGF0aCwgY2hhbmdlZEZpbGVQb3NpdGlvbik7XG4gICAgICBpZiAocm93ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBlLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24oe3JvdywgY29sdW1uOiAwfSwge2NlbnRlcjogdHJ1ZX0pO1xuICAgICAgZS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbih7cm93LCBjb2x1bW46IDB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgbWVhc3VyZVBlcmZvcm1hbmNlKGFjdGlvbikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKChhY3Rpb24gPT09ICd1cGRhdGUnIHx8IGFjdGlvbiA9PT0gJ21vdW50JylcbiAgICAgICYmIHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeU5hbWUoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tc3RhcnRgKS5sZW5ndGggPiAwKSB7XG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LWVuZGApO1xuICAgICAgcGVyZm9ybWFuY2UubWVhc3VyZShcbiAgICAgICAgYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gLFxuICAgICAgICBgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1zdGFydGAsXG4gICAgICAgIGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LWVuZGApO1xuICAgICAgY29uc3QgcGVyZiA9IHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeU5hbWUoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gKVswXTtcbiAgICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tc3RhcnRgKTtcbiAgICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tZW5kYCk7XG4gICAgICBwZXJmb3JtYW5jZS5jbGVhck1lYXN1cmVzKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259YCk7XG4gICAgICBhZGRFdmVudChgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWAsIHtcbiAgICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICAgIGZpbGVQYXRjaGVzTGluZUNvdW50czogdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLm1hcChcbiAgICAgICAgICBmcCA9PiBmcC5nZXRQYXRjaCgpLmdldENoYW5nZWRMaW5lQ291bnQoKSxcbiAgICAgICAgKSxcbiAgICAgICAgZHVyYXRpb246IHBlcmYuZHVyYXRpb24sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUF3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXhDLE1BQU1BLGNBQWMsR0FBRztFQUNyQixDQUFDQyxhQUFJLENBQUNDLEtBQUssQ0FBQ0MsTUFBTSxHQUFHLGdCQUFnQjtFQUNyQyxDQUFDRixhQUFJLENBQUNDLEtBQUssQ0FBQ0UsVUFBVSxHQUFHO0FBQzNCLENBQUM7QUFFYyxNQUFNQyxrQkFBa0IsU0FBU0MsY0FBSyxDQUFDQyxT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