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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jbGFzc25hbWVzIiwiX2F0b20iLCJfZXZlbnRLaXQiLCJfaGVscGVycyIsIl9yZXBvcnRlclByb3h5IiwiX3Byb3BUeXBlczIiLCJfYXRvbVRleHRFZGl0b3IiLCJfbWFya2VyIiwiX21hcmtlckxheWVyIiwiX2RlY29yYXRpb24iLCJfZ3V0dGVyIiwiX2NvbW1hbmRzIiwiX2ZpbGVQYXRjaEhlYWRlclZpZXciLCJfZmlsZVBhdGNoTWV0YVZpZXciLCJfaHVua0hlYWRlclZpZXciLCJfcmVmSG9sZGVyIiwiX2NoYW5nZWRGaWxlSXRlbSIsIl9jb21taXREZXRhaWxJdGVtIiwiX2NvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlciIsIl9pc3N1ZWlzaERldGFpbEl0ZW0iLCJfZmlsZSIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9scyIsImZpbHRlciIsInN5bSIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsIlR5cGVFcnJvciIsIk51bWJlciIsImV4ZWN1dGFibGVUZXh0IiwiRmlsZSIsIm1vZGVzIiwiTk9STUFMIiwiRVhFQ1VUQUJMRSIsIk11bHRpRmlsZVBhdGNoVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImZpbGVQYXRjaCIsImluZGV4IiwiaXNDb2xsYXBzZWQiLCJnZXRSZW5kZXJTdGF0dXMiLCJpc1Zpc2libGUiLCJpc0VtcHR5IiwiZ2V0TWFya2VyIiwiZ2V0UmFuZ2UiLCJpc0V4cGFuZGFibGUiLCJpc1VuYXZhaWxhYmxlIiwiYXRFbmQiLCJnZXRTdGFydFJhbmdlIiwic3RhcnQiLCJpc0VxdWFsIiwibXVsdGlGaWxlUGF0Y2giLCJnZXRCdWZmZXIiLCJnZXRFbmRQb3NpdGlvbiIsInBvc2l0aW9uIiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwiZ2V0UGF0aCIsImludmFsaWRhdGUiLCJidWZmZXJSYW5nZSIsInR5cGUiLCJvcmRlciIsImNsYXNzTmFtZSIsIml0ZW1UeXBlIiwicmVsUGF0aCIsIm5ld1BhdGgiLCJnZXRTdGF0dXMiLCJnZXROZXdQYXRoIiwic3RhZ2luZ1N0YXR1cyIsImlzUGFydGlhbGx5U3RhZ2VkIiwiaGFzVW5kb0hpc3RvcnkiLCJoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zIiwidG9vbHRpcHMiLCJ1bmRvTGFzdERpc2NhcmQiLCJ1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uIiwiZGl2ZUludG9NaXJyb3JQYXRjaCIsIm9wZW5GaWxlIiwiZGlkT3BlbkZpbGUiLCJzZWxlY3RlZEZpbGVQYXRjaCIsInRvZ2dsZUZpbGUiLCJ0cmlnZ2VyQ29sbGFwc2UiLCJjb2xsYXBzZUZpbGVQYXRjaCIsInRyaWdnZXJFeHBhbmQiLCJleHBhbmRGaWxlUGF0Y2giLCJyZW5kZXJTeW1saW5rQ2hhbmdlTWV0YSIsInJlbmRlckV4ZWN1dGFibGVNb2RlQ2hhbmdlTWV0YSIsInJlbmRlckRpZmZHYXRlIiwicmVuZGVyRGlmZlVuYXZhaWxhYmxlIiwicmVuZGVySHVua0hlYWRlcnMiLCJzZWxlY3RlZEZpbGVQYXRjaGVzIiwiQXJyYXkiLCJmcm9tIiwiZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcyIsIkNoYW5nZWRGaWxlSXRlbSIsImV2ZW50U291cmNlIiwiY29tbWFuZCIsImRpc2NhcmRSb3dzIiwic2VsZWN0ZWRSb3dzIiwic2VsZWN0aW9uTW9kZSIsIlByb21pc2UiLCJhbGwiLCJmcCIsImRpZENoYW5nZUV4ZWN1dGFibGVNb2RlIiwibWFwIiwidG9nZ2xlTW9kZUNoYW5nZSIsImhhc1R5cGVjaGFuZ2UiLCJ0b2dnbGVTeW1saW5rQ2hhbmdlIiwiY2hhbmdlZEZpbGVQYXRoIiwiY2hhbmdlZEZpbGVQb3NpdGlvbiIsInJlZkVkaXRvciIsImUiLCJyb3ciLCJnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24iLCJzY3JvbGxUb0J1ZmZlclBvc2l0aW9uIiwiY29sdW1uIiwiY2VudGVyIiwic2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJhdXRvYmluZCIsIm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxhc3RNb3VzZU1vdmVMaW5lIiwibmV4dFNlbGVjdGlvbk1vZGUiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwicmVmRWRpdG9yRWxlbWVudCIsIm1vdW50ZWQiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImFkZCIsIm9ic2VydmUiLCJlZGl0b3IiLCJzZXR0ZXIiLCJnZXRFbGVtZW50IiwiZWxlbWVudCIsInJlZkluaXRpYWxGb2N1cyIsInN1cHByZXNzQ2hhbmdlcyIsImxhc3RTY3JvbGxUb3AiLCJsYXN0U2Nyb2xsTGVmdCIsImxhc3RTZWxlY3Rpb25JbmRleCIsIm9uV2lsbFVwZGF0ZVBhdGNoIiwiZ2V0TWF4U2VsZWN0aW9uSW5kZXgiLCJnZXRTY3JvbGxUb3AiLCJnZXRTY3JvbGxMZWZ0Iiwib25EaWRVcGRhdGVQYXRjaCIsIm5leHRQYXRjaCIsIm5leHRTZWxlY3Rpb25SYW5nZSIsImdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgiLCJzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlIiwibmV4dEh1bmtzIiwiU2V0IiwiUmFuZ2UiLCJmcm9tT2JqZWN0IiwiZ2V0Um93cyIsImdldEh1bmtBdCIsIkJvb2xlYW4iLCJuZXh0UmFuZ2VzIiwic2l6ZSIsImh1bmsiLCJzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyIsInNldFNjcm9sbFRvcCIsInNldFNjcm9sbExlZnQiLCJkaWRDaGFuZ2VTZWxlY3RlZFJvd3MiLCJjb21wb25lbnREaWRNb3VudCIsIm1lYXN1cmVQZXJmb3JtYW5jZSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkaWRNb3VzZVVwIiwiZmlyc3RQYXRjaCIsImdldEZpbGVQYXRjaGVzIiwiZmlyc3RIdW5rIiwiZ2V0SHVua3MiLCJjb25maWciLCJvbkRpZENoYW5nZSIsImZvcmNlVXBkYXRlIiwiaW5pdENoYW5nZWRGaWxlUGF0aCIsImluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uIiwic2Nyb2xsVG9GaWxlIiwib25PcGVuRmlsZXNUYWIiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwb3NlIiwicGVyZm9ybWFuY2UiLCJjbGVhck1hcmtzIiwiY2xlYXJNZWFzdXJlcyIsInJlbmRlciIsInJvb3RDbGFzcyIsImN4IiwiYW55UHJlc2VudCIsIm1hcmsiLCJyZWYiLCJyZW5kZXJDb21tYW5kcyIsInJlbmRlck5vbkVtcHR5UGF0Y2giLCJyZW5kZXJFbXB0eVBhdGNoIiwiQ29tbWl0RGV0YWlsSXRlbSIsIklzc3VlaXNoRGV0YWlsSXRlbSIsInJlZ2lzdHJ5IiwiY29tbWFuZHMiLCJDb21tYW5kIiwiY2FsbGJhY2siLCJzZWxlY3ROZXh0SHVuayIsInNlbGVjdFByZXZpb3VzSHVuayIsImRpZFRvZ2dsZVNlbGVjdGlvbk1vZGUiLCJzdGFnZU1vZGVDb21tYW5kIiwic3RhZ2VTeW1saW5rQ29tbWFuZCIsImRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlIiwiZGlkVG9nZ2xlTW9kZUNoYW5nZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiZGlkVG9nZ2xlU3ltbGlua0NoYW5nZSIsImRpZENvbmZpcm0iLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8iLCJkaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmQiLCJzdXJmYWNlIiwiYXRvbSIsImluRGV2TW9kZSIsImNvbnNvbGUiLCJsb2ciLCJnZXRQYXRjaEJ1ZmZlciIsImluc3BlY3QiLCJsYXllck5hbWVzIiwid29ya3NwYWNlIiwiYnVmZmVyIiwibGluZU51bWJlckd1dHRlclZpc2libGUiLCJhdXRvV2lkdGgiLCJhdXRvSGVpZ2h0IiwicmVhZE9ubHkiLCJzb2Z0V3JhcHBlZCIsImRpZEFkZFNlbGVjdGlvbiIsImRpZENoYW5nZVNlbGVjdGlvblJhbmdlIiwiZGlkRGVzdHJveVNlbGVjdGlvbiIsInJlZk1vZGVsIiwiaGlkZUVtcHRpbmVzcyIsIm5hbWUiLCJwcmlvcml0eSIsImxhYmVsRm4iLCJvbGRMaW5lTnVtYmVyTGFiZWwiLCJvbk1vdXNlRG93biIsImRpZE1vdXNlRG93bk9uTGluZU51bWJlciIsIm9uTW91c2VNb3ZlIiwiZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyIiwibmV3TGluZU51bWJlckxhYmVsIiwiYmxhbmtMYWJlbCIsInJlbmRlclBSQ29tbWVudEljb25zIiwicmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMiLCJyZW5kZXJMaW5lRGVjb3JhdGlvbnMiLCJJbmZpbml0eSIsImd1dHRlciIsImljb24iLCJsaW5lIiwicmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJwYXRoIiwiZ2V0UGF0Y2hGb3JQYXRoIiwiaXNSb3dTZWxlY3RlZCIsImlkIiwiY29tbWVudFJvdyIsInRocmVhZElkIiwiZW5kcG9pbnQiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJ3b3JrZGlyIiwid29ya2RpclBhdGgiLCJleHRyYUNsYXNzZXMiLCJwYXJlbnQiLCJvcmRlck9mZnNldCIsInNob3dEaWZmIiwiYWRkRXZlbnQiLCJjb21wb25lbnQiLCJwYWNrYWdlIiwib25DbGljayIsIm9sZE1vZGUiLCJnZXRPbGRNb2RlIiwibmV3TW9kZSIsImdldE5ld01vZGUiLCJhdHRycyIsImFjdGlvbkljb24iLCJhY3Rpb25UZXh0IiwidGl0bGUiLCJhY3Rpb24iLCJoYXNTeW1saW5rIiwiZGV0YWlsIiwib2xkU3ltbGluayIsImdldE9sZFN5bWxpbmsiLCJuZXdTeW1saW5rIiwiZ2V0TmV3U3ltbGluayIsInRvZ2dsZVZlcmIiLCJzZWxlY3RlZEh1bmtzIiwiY29udGFpbnNTZWxlY3Rpb24iLCJpc1NlbGVjdGVkIiwiYnV0dG9uU3VmZml4IiwidG9nZ2xlU2VsZWN0aW9uTGFiZWwiLCJkaXNjYXJkU2VsZWN0aW9uTGFiZWwiLCJzdGFydFBvaW50Iiwic3RhcnRSYW5nZSIsInJlZlRhcmdldCIsImtleW1hcHMiLCJ0b2dnbGVTZWxlY3Rpb24iLCJ0b2dnbGVIdW5rU2VsZWN0aW9uIiwiZGlzY2FyZFNlbGVjdGlvbiIsImRpc2NhcmRIdW5rU2VsZWN0aW9uIiwibW91c2VEb3duIiwiZGlkTW91c2VEb3duT25IZWFkZXIiLCJyYW5nZXMiLCJsaW5lQ2xhc3MiLCJyZWZIb2xkZXIiLCJob2xkZXIiLCJoYW5kbGVMYXllciIsInJhbmdlIiwicmVuZGVyRGVjb3JhdGlvbnMiLCJsYXllciIsImdldE1hcmtlckNvdW50IiwiZXh0ZXJuYWwiLCJvbWl0RW1wdHlMYXN0Um93IiwiZ3V0dGVyTmFtZSIsInRvZ2dsZVJvd3MiLCJjaGFuZ2VSb3dzIiwiZ2V0Q2hhbmdlcyIsInJlZHVjZSIsInJvd3MiLCJjaGFuZ2UiLCJnZXRCdWZmZXJSb3dzIiwiZXZlbnQiLCJoYW5kbGVTZWxlY3Rpb25FdmVudCIsImJ1ZmZlclJvdyIsImlzTmFOIiwiZG9tRXZlbnQiLCJyYW5nZUxpa2UiLCJvcHRzIiwiYnV0dG9uIiwiaXNXaW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiY3RybEtleSIsIm9wdGlvbnMiLCJjb252ZXJ0ZWQiLCJjbGlwQnVmZmVyUmFuZ2UiLCJnZXRPciIsIm1ldGFLZXkiLCJpbnRlcnNlY3RzIiwid2l0aG91dCIsInNlbGVjdGlvbiIsImdldFNlbGVjdGlvbnMiLCJpbnRlcnNlY3RzQnVmZmVyUmFuZ2UiLCJzZWxlY3Rpb25SYW5nZSIsImdldEJ1ZmZlclJhbmdlIiwibmV3UmFuZ2VzIiwibnVkZ2VkIiwibGFzdENvbHVtbiIsImxpbmVMZW5ndGhGb3JSb3ciLCJlbmQiLCJzZXRCdWZmZXJSYW5nZSIsIm5ld1JhbmdlIiwic2xpY2UiLCJhZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSIsInJldmVyc2VkIiwiaXNSZXZlcnNlZCIsInJlcGxhY2VtZW50UmFuZ2VzIiwiZWFjaCIsInNoaWZ0S2V5IiwibGFzdFNlbGVjdGlvbiIsImdldExhc3RTZWxlY3Rpb24iLCJsYXN0U2VsZWN0aW9uUmFuZ2UiLCJpc0JlZm9yZSIsImlzTGVzc1RoYW4iLCJmYXJFZGdlIiwiZ2V0U2VsZWN0ZWRIdW5rcyIsIndpdGhTZWxlY3Rpb25Nb2RlIiwiaHVua1JhbmdlcyIsImZpcnN0Q2hhbmdlUm93IiwiZmlyc3RDaGFuZ2UiLCJnZXRTdGFydEJ1ZmZlclJvdyIsIndpdGhTZWxlY3RlZEh1bmtzIiwiZ2V0SHVua0FmdGVyIiwiZ2V0SHVua0JlZm9yZSIsImN1cnNvcnNCeUZpbGVQYXRjaCIsIk1hcCIsInBsYWNlZFJvd3MiLCJjdXJzb3IiLCJnZXRDdXJzb3JzIiwiY3Vyc29yUm93IiwiZ2V0QnVmZmVyUG9zaXRpb24iLCJnZXRGaWxlUGF0Y2hBdCIsIm5ld1JvdyIsImdldE5ld1Jvd0F0IiwibmV3Q29sdW1uIiwibmVhcmVzdFJvdyIsImdldE5ld1N0YXJ0Um93IiwicmVnaW9uIiwiZ2V0UmVnaW9ucyIsImluY2x1ZGVzQnVmZmVyUm93Iiwid2hlbiIsInVuY2hhbmdlZCIsImJ1ZmZlclJvd0NvdW50IiwiYWRkaXRpb24iLCJjdXJzb3JzIiwiZmlsZVBhdGNoZXNXaXRoQ3Vyc29ycyIsInBlbmRpbmciLCJnZXRTZWxlY3RlZFJvd3MiLCJhY2MiLCJpc0NoYW5nZVJvdyIsIm9sZEJ1ZmZlclJhbmdlIiwibmV3QnVmZmVyUmFuZ2UiLCJuZXh0Q3Vyc29yUm93cyIsImdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucyIsInNwYW5zTXVsdGlwbGVGaWxlcyIsInNlbGVjdGVkUm93c0NoYW5nZWQiLCJwYWQiLCJvbGRSb3ciLCJnZXRPbGRSb3dBdCIsInNlZW4iLCJnZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyIsInBhdGNoZXMiLCJwYXRjaCIsInByZXZSb3ciLCJuZXh0Um93IiwiY2hhbmdlTGF5ZXJzIiwic29tZSIsImZpbmRNYXJrZXJzIiwiaW50ZXJzZWN0c1JvdyIsImNhbGxiYWNrcyIsIkVycm9yIiwibnVtIiwibWF4RGlnaXRzIiwiZ2V0TWF4TGluZU51bWJlcldpZHRoIiwiTkJTUF9DSEFSQUNURVIiLCJyZXBlYXQiLCJ0b1N0cmluZyIsImdldEVudHJpZXNCeU5hbWUiLCJtZWFzdXJlIiwicGVyZiIsImZpbGVQYXRjaGVzTGluZUNvdW50cyIsImdldFBhdGNoIiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsImR1cmF0aW9uIiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsIm9uZU9mIiwiYm9vbCIsIkl0ZW1UeXBlUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwicmVwb3NpdG9yeSIsIk11bHRpRmlsZVBhdGNoUHJvcFR5cGUiLCJhcnJheU9mIiwic2hhcGUiLCJwdWxsUmVxdWVzdCIsImZ1bmMiLCJzd2l0Y2hUb0lzc3VlaXNoIiwiUmVmSG9sZGVyUHJvcFR5cGUiLCJzdHJpbmciLCJFbmRwb2ludFByb3BUeXBlIiwiRGlzcG9zYWJsZSJdLCJzb3VyY2VzIjpbIm11bHRpLWZpbGUtcGF0Y2gtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7UmFuZ2V9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBOQlNQX0NIQVJBQ1RFUiwgYmxhbmtMYWJlbH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlLCBNdWx0aUZpbGVQYXRjaFByb3BUeXBlLCBJdGVtVHlwZVByb3BUeXBlLCBFbmRwb2ludFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9hdG9tL21hcmtlcic7XG5pbXBvcnQgTWFya2VyTGF5ZXIgZnJvbSAnLi4vYXRvbS9tYXJrZXItbGF5ZXInO1xuaW1wb3J0IERlY29yYXRpb24gZnJvbSAnLi4vYXRvbS9kZWNvcmF0aW9uJztcbmltcG9ydCBHdXR0ZXIgZnJvbSAnLi4vYXRvbS9ndXR0ZXInO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgRmlsZVBhdGNoSGVhZGVyVmlldyBmcm9tICcuL2ZpbGUtcGF0Y2gtaGVhZGVyLXZpZXcnO1xuaW1wb3J0IEZpbGVQYXRjaE1ldGFWaWV3IGZyb20gJy4vZmlsZS1wYXRjaC1tZXRhLXZpZXcnO1xuaW1wb3J0IEh1bmtIZWFkZXJWaWV3IGZyb20gJy4vaHVuay1oZWFkZXItdmlldyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBDaGFuZ2VkRmlsZUl0ZW0gZnJvbSAnLi4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nO1xuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCBDb21tZW50R3V0dGVyRGVjb3JhdGlvbkNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvY29tbWVudC1ndXR0ZXItZGVjb3JhdGlvbi1jb250cm9sbGVyJztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi4vbW9kZWxzL3BhdGNoL2ZpbGUnO1xuXG5jb25zdCBleGVjdXRhYmxlVGV4dCA9IHtcbiAgW0ZpbGUubW9kZXMuTk9STUFMXTogJ25vbiBleGVjdXRhYmxlJyxcbiAgW0ZpbGUubW9kZXMuRVhFQ1VUQUJMRV06ICdleGVjdXRhYmxlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpRmlsZVBhdGNoVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQmVoYXZpb3IgY29udHJvbHNcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWydzdGFnZWQnLCAndW5zdGFnZWQnXSksXG4gICAgaXNQYXJ0aWFsbHlTdGFnZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBNb2RlbHNcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbXVsdGlGaWxlUGF0Y2g6IE11bHRpRmlsZVBhdGNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3Rpb25Nb2RlOiBQcm9wVHlwZXMub25lT2YoWydodW5rJywgJ2xpbmUnXSkuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZFJvd3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIC8vIFJldmlldyBjb21tZW50c1xuICAgIHJldmlld0NvbW1lbnRzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKSxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgc2VsZWN0ZWRSb3dzQ2hhbmdlZDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpdmVJbnRvTWlycm9yUGF0Y2g6IFByb3BUeXBlcy5mdW5jLFxuICAgIHN1cmZhY2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9wZW5GaWxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVGaWxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVSb3dzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVNb2RlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVTeW1saW5rQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpc2NhcmRSb3dzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbldpbGxVcGRhdGVQYXRjaDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25EaWRVcGRhdGVQYXRjaDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBFeHRlcm5hbCByZWZzXG4gICAgcmVmRWRpdG9yOiBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgICByZWZJbml0aWFsRm9jdXM6IFJlZkhvbGRlclByb3BUeXBlLFxuXG4gICAgLy8gZm9yIG5hdmlnYXRpbmcgdGhlIFBSIGNoYW5nZWQgZmlsZXMgdGFiXG4gICAgb25PcGVuRmlsZXNUYWI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLy8gZm9yIG9wZW5pbmcgdGhlIHJldmlld3MgZG9jayBpdGVtXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUsXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd29ya2RpclBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIG9uV2lsbFVwZGF0ZVBhdGNoOiAoKSA9PiBuZXcgRGlzcG9zYWJsZSgpLFxuICAgIG9uRGlkVXBkYXRlUGF0Y2g6ICgpID0+IG5ldyBEaXNwb3NhYmxlKCksXG4gICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nOiBmYWxzZSxcbiAgICByZXZpZXdDb21tZW50VGhyZWFkczogW10sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnZGlkTW91c2VEb3duT25IZWFkZXInLCAnZGlkTW91c2VEb3duT25MaW5lTnVtYmVyJywgJ2RpZE1vdXNlTW92ZU9uTGluZU51bWJlcicsICdkaWRNb3VzZVVwJyxcbiAgICAgICdkaWRDb25maXJtJywgJ2RpZFRvZ2dsZVNlbGVjdGlvbk1vZGUnLCAnc2VsZWN0TmV4dEh1bmsnLCAnc2VsZWN0UHJldmlvdXNIdW5rJyxcbiAgICAgICdkaWRPcGVuRmlsZScsICdkaWRBZGRTZWxlY3Rpb24nLCAnZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UnLCAnZGlkRGVzdHJveVNlbGVjdGlvbicsXG4gICAgICAnb2xkTGluZU51bWJlckxhYmVsJywgJ25ld0xpbmVOdW1iZXJMYWJlbCcsXG4gICAgKTtcblxuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG4gICAgdGhpcy5sYXN0TW91c2VNb3ZlTGluZSA9IG51bGw7XG4gICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9IG51bGw7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yRWxlbWVudCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgdGhpcy5yZWZFZGl0b3Iub2JzZXJ2ZShlZGl0b3IgPT4ge1xuICAgICAgICB0aGlzLnJlZkVkaXRvckVsZW1lbnQuc2V0dGVyKGVkaXRvci5nZXRFbGVtZW50KCkpO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5yZWZFZGl0b3IpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLnJlZkVkaXRvci5zZXR0ZXIoZWRpdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLnJlZkVkaXRvckVsZW1lbnQub2JzZXJ2ZShlbGVtZW50ID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMgJiYgdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMuc2V0dGVyKGVsZW1lbnQpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFN5bmNocm9ub3VzbHkgbWFpbnRhaW4gdGhlIGVkaXRvcidzIHNjcm9sbCBwb3NpdGlvbiBhbmQgbG9naWNhbCBzZWxlY3Rpb24gYWNyb3NzIGJ1ZmZlciB1cGRhdGVzLlxuICAgIHRoaXMuc3VwcHJlc3NDaGFuZ2VzID0gZmFsc2U7XG4gICAgbGV0IGxhc3RTY3JvbGxUb3AgPSBudWxsO1xuICAgIGxldCBsYXN0U2Nyb2xsTGVmdCA9IG51bGw7XG4gICAgbGV0IGxhc3RTZWxlY3Rpb25JbmRleCA9IG51bGw7XG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucHJvcHMub25XaWxsVXBkYXRlUGF0Y2goKCkgPT4ge1xuICAgICAgICB0aGlzLnN1cHByZXNzQ2hhbmdlcyA9IHRydWU7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICAgIGxhc3RTZWxlY3Rpb25JbmRleCA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0TWF4U2VsZWN0aW9uSW5kZXgodGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MpO1xuICAgICAgICAgIGxhc3RTY3JvbGxUb3AgPSBlZGl0b3IuZ2V0RWxlbWVudCgpLmdldFNjcm9sbFRvcCgpO1xuICAgICAgICAgIGxhc3RTY3JvbGxMZWZ0ID0gZWRpdG9yLmdldEVsZW1lbnQoKS5nZXRTY3JvbGxMZWZ0KCk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgICB0aGlzLnByb3BzLm9uRGlkVXBkYXRlUGF0Y2gobmV4dFBhdGNoID0+IHtcbiAgICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAobGFzdFNlbGVjdGlvbkluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0U2VsZWN0aW9uUmFuZ2UgPSBuZXh0UGF0Y2guZ2V0U2VsZWN0aW9uUmFuZ2VGb3JJbmRleChsYXN0U2VsZWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKG5leHRTZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBuZXh0SHVua3MgPSBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIFJhbmdlLmZyb21PYmplY3QobmV4dFNlbGVjdGlvblJhbmdlKS5nZXRSb3dzKClcbiAgICAgICAgICAgICAgICAgIC5tYXAocm93ID0+IG5leHRQYXRjaC5nZXRIdW5rQXQocm93KSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IG5leHRIdW5rcy5zaXplID4gMFxuICAgICAgICAgICAgICAgID8gQXJyYXkuZnJvbShuZXh0SHVua3MsIGh1bmsgPT4gaHVuay5nZXRSYW5nZSgpKVxuICAgICAgICAgICAgICAgIDogW1tbMCwgMF0sIFswLCAwXV1dO1xuXG4gICAgICAgICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhuZXh0UmFuZ2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChsYXN0U2Nyb2xsVG9wICE9PSBudWxsKSB7IGVkaXRvci5nZXRFbGVtZW50KCkuc2V0U2Nyb2xsVG9wKGxhc3RTY3JvbGxUb3ApOyB9XG5cbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChsYXN0U2Nyb2xsTGVmdCAhPT0gbnVsbCkgeyBlZGl0b3IuZ2V0RWxlbWVudCgpLnNldFNjcm9sbExlZnQobGFzdFNjcm9sbExlZnQpOyB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN1cHByZXNzQ2hhbmdlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkUm93cygpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMubW91bnRlZCA9IHRydWU7XG4gICAgdGhpcy5tZWFzdXJlUGVyZm9ybWFuY2UoJ21vdW50Jyk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZGlkTW91c2VVcCk7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAvLyB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoIGlzIGd1YXJhbnRlZWQgdG8gY29udGFpbiBhdCBsZWFzdCBvbmUgRmlsZVBhdGNoIGlmIDxBdG9tVGV4dEVkaXRvcj4gaXMgcmVuZGVyZWQuXG4gICAgICBjb25zdCBbZmlyc3RQYXRjaF0gPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCk7XG4gICAgICBjb25zdCBbZmlyc3RIdW5rXSA9IGZpcnN0UGF0Y2guZ2V0SHVua3MoKTtcbiAgICAgIGlmICghZmlyc3RIdW5rKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoZmlyc3RIdW5rLmdldFJhbmdlKCkpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgdGhpcy5wcm9wcy5jb25maWcub25EaWRDaGFuZ2UoJ2dpdGh1Yi5zaG93RGlmZkljb25HdXR0ZXInLCAoKSA9PiB0aGlzLmZvcmNlVXBkYXRlKCkpLFxuICAgICk7XG5cbiAgICBjb25zdCB7aW5pdENoYW5nZWRGaWxlUGF0aCwgaW5pdENoYW5nZWRGaWxlUG9zaXRpb259ID0gdGhpcy5wcm9wcztcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGluaXRDaGFuZ2VkRmlsZVBhdGggJiYgaW5pdENoYW5nZWRGaWxlUG9zaXRpb24gPj0gMCkge1xuICAgICAgdGhpcy5zY3JvbGxUb0ZpbGUoe1xuICAgICAgICBjaGFuZ2VkRmlsZVBhdGg6IGluaXRDaGFuZ2VkRmlsZVBhdGgsXG4gICAgICAgIGNoYW5nZWRGaWxlUG9zaXRpb246IGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKHRoaXMucHJvcHMub25PcGVuRmlsZXNUYWIpIHtcbiAgICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICAgIHRoaXMucHJvcHMub25PcGVuRmlsZXNUYWIodGhpcy5zY3JvbGxUb0ZpbGUpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgdGhpcy5tZWFzdXJlUGVyZm9ybWFuY2UoJ3VwZGF0ZScpO1xuXG4gICAgaWYgKHByZXZQcm9wcy5yZWZJbml0aWFsRm9jdXMgIT09IHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzKSB7XG4gICAgICBwcmV2UHJvcHMucmVmSW5pdGlhbEZvY3VzICYmIHByZXZQcm9wcy5yZWZJbml0aWFsRm9jdXMuc2V0dGVyKG51bGwpO1xuICAgICAgdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMgJiYgdGhpcy5yZWZFZGl0b3JFbGVtZW50Lm1hcCh0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cy5zZXR0ZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoID09PSBwcmV2UHJvcHMubXVsdGlGaWxlUGF0Y2gpIHtcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5kaWRNb3VzZVVwKTtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICAgIHRoaXMubW91bnRlZCA9IGZhbHNlO1xuICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoKTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1lYXN1cmVzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgcm9vdENsYXNzID0gY3goXG4gICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXcnLFxuICAgICAge1tgZ2l0aHViLUZpbGVQYXRjaFZpZXctLSR7dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfWBdOiB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXN9LFxuICAgICAgeydnaXRodWItRmlsZVBhdGNoVmlldy0tYmxhbmsnOiAhdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5hbnlQcmVzZW50KCl9LFxuICAgICAgeydnaXRodWItRmlsZVBhdGNoVmlldy0taHVua01vZGUnOiB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdodW5rJ30sXG4gICAgKTtcblxuICAgIGlmICh0aGlzLm1vdW50ZWQpIHtcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ011bHRpRmlsZVBhdGNoVmlldy11cGRhdGUtc3RhcnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVyZm9ybWFuY2UubWFyaygnTXVsdGlGaWxlUGF0Y2hWaWV3LW1vdW50LXN0YXJ0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb290Q2xhc3N9IHJlZj17dGhpcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guYW55UHJlc2VudCgpID8gdGhpcy5yZW5kZXJOb25FbXB0eVBhdGNoKCkgOiB0aGlzLnJlbmRlckVtcHR5UGF0Y2goKX1cbiAgICAgICAgPC9tYWluPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDb21taXREZXRhaWxJdGVtIHx8IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IElzc3VlaXNoRGV0YWlsSXRlbSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtbmV4dC1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0TmV4dEh1bmt9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtcHJldmlvdXMtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdFByZXZpb3VzSHVua30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1wYXRjaC1zZWxlY3Rpb24tbW9kZVwiIGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZVNlbGVjdGlvbk1vZGV9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBzdGFnZU1vZGVDb21tYW5kID0gbnVsbDtcbiAgICBsZXQgc3RhZ2VTeW1saW5rQ29tbWFuZCA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5kaWRBbnlDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICAgID8gJ2dpdGh1YjpzdGFnZS1maWxlLW1vZGUtY2hhbmdlJ1xuICAgICAgICA6ICdnaXRodWI6dW5zdGFnZS1maWxlLW1vZGUtY2hhbmdlJztcbiAgICAgIHN0YWdlTW9kZUNvbW1hbmQgPSA8Q29tbWFuZCBjb21tYW5kPXtjb21tYW5kfSBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVNb2RlQ2hhbmdlfSAvPjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5hbnlIYXZlVHlwZWNoYW5nZSgpKSB7XG4gICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICAgID8gJ2dpdGh1YjpzdGFnZS1zeW1saW5rLWNoYW5nZSdcbiAgICAgICAgOiAnZ2l0aHViOnVuc3RhZ2Utc3ltbGluay1jaGFuZ2UnO1xuICAgICAgc3RhZ2VTeW1saW5rQ29tbWFuZCA9IDxDb21tYW5kIGNvbW1hbmQ9e2NvbW1hbmR9IGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZVN5bWxpbmtDaGFuZ2V9IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtbmV4dC1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0TmV4dEh1bmt9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LXByZXZpb3VzLWh1bmtcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RQcmV2aW91c0h1bmt9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiBjYWxsYmFjaz17dGhpcy5kaWRDb25maXJtfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTp1bmRvXCIgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpc2NhcmQtc2VsZWN0ZWQtbGluZXNcIiBjYWxsYmFjaz17dGhpcy5kaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmR9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6anVtcC10by1maWxlXCIgY2FsbGJhY2s9e3RoaXMuZGlkT3BlbkZpbGV9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VyZmFjZVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLnN1cmZhY2V9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLXBhdGNoLXNlbGVjdGlvbi1tb2RlXCIgY2FsbGJhY2s9e3RoaXMuZGlkVG9nZ2xlU2VsZWN0aW9uTW9kZX0gLz5cbiAgICAgICAge3N0YWdlTW9kZUNvbW1hbmR9XG4gICAgICAgIHtzdGFnZVN5bWxpbmtDb21tYW5kfVxuICAgICAgICB7LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gYXRvbS5pbkRldk1vZGUoKSAmJlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6aW5zcGVjdC1wYXRjaFwiIGNhbGxiYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRQYXRjaEJ1ZmZlcigpLmluc3BlY3Qoe1xuICAgICAgICAgICAgICBsYXllck5hbWVzOiBbJ3BhdGNoJywgJ2h1bmsnXSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgICAgey8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGF0b20uaW5EZXZNb2RlKCkgJiZcbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3BlY3QtcmVnaW9uc1wiIGNhbGxiYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRQYXRjaEJ1ZmZlcigpLmluc3BlY3Qoe1xuICAgICAgICAgICAgICBsYXllck5hbWVzOiBbJ3VuY2hhbmdlZCcsICdkZWxldGlvbicsICdhZGRpdGlvbicsICdub25ld2xpbmUnXSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgICAgey8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGF0b20uaW5EZXZNb2RlKCkgJiZcbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3BlY3QtbWZwXCIgY2FsbGJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmluc3BlY3QoKSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICA8L0NvbW1hbmRzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJFbXB0eVBhdGNoKCkge1xuICAgIHJldHVybiA8cCBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXNzYWdlIGljb24gaWNvbi1pbmZvXCI+Tm8gY2hhbmdlcyB0byBkaXNwbGF5PC9wPjtcbiAgfVxuXG4gIHJlbmRlck5vbkVtcHR5UGF0Y2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBdG9tVGV4dEVkaXRvclxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuXG4gICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRCdWZmZXIoKX1cbiAgICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU9e2ZhbHNlfVxuICAgICAgICBhdXRvV2lkdGg9e2ZhbHNlfVxuICAgICAgICBhdXRvSGVpZ2h0PXtmYWxzZX1cbiAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgIHNvZnRXcmFwcGVkPXt0cnVlfVxuXG4gICAgICAgIGRpZEFkZFNlbGVjdGlvbj17dGhpcy5kaWRBZGRTZWxlY3Rpb259XG4gICAgICAgIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlPXt0aGlzLmRpZENoYW5nZVNlbGVjdGlvblJhbmdlfVxuICAgICAgICBkaWREZXN0cm95U2VsZWN0aW9uPXt0aGlzLmRpZERlc3Ryb3lTZWxlY3Rpb259XG4gICAgICAgIHJlZk1vZGVsPXt0aGlzLnJlZkVkaXRvcn1cbiAgICAgICAgaGlkZUVtcHRpbmVzcz17dHJ1ZX0+XG5cbiAgICAgICAgPEd1dHRlclxuICAgICAgICAgIG5hbWU9XCJvbGQtbGluZS1udW1iZXJzXCJcbiAgICAgICAgICBwcmlvcml0eT17MX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJvbGRcIlxuICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgbGFiZWxGbj17dGhpcy5vbGRMaW5lTnVtYmVyTGFiZWx9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25MaW5lTnVtYmVyfVxuICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmRpZE1vdXNlTW92ZU9uTGluZU51bWJlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPEd1dHRlclxuICAgICAgICAgIG5hbWU9XCJuZXctbGluZS1udW1iZXJzXCJcbiAgICAgICAgICBwcmlvcml0eT17Mn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJuZXdcIlxuICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgbGFiZWxGbj17dGhpcy5uZXdMaW5lTnVtYmVyTGFiZWx9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25MaW5lTnVtYmVyfVxuICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmRpZE1vdXNlTW92ZU9uTGluZU51bWJlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPEd1dHRlclxuICAgICAgICAgIG5hbWU9XCJnaXRodWItY29tbWVudC1pY29uXCJcbiAgICAgICAgICBwcmlvcml0eT17M31cbiAgICAgICAgICBjbGFzc05hbWU9XCJjb21tZW50XCJcbiAgICAgICAgICB0eXBlPVwiZGVjb3JhdGVkXCJcbiAgICAgICAgLz5cbiAgICAgICAge3RoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLnNob3dEaWZmSWNvbkd1dHRlcicpICYmIChcbiAgICAgICAgICA8R3V0dGVyXG4gICAgICAgICAgICBuYW1lPVwiZGlmZi1pY29uc1wiXG4gICAgICAgICAgICBwcmlvcml0eT17NH1cbiAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uc1wiXG4gICAgICAgICAgICBsYWJlbEZuPXtibGFua0xhYmVsfVxuICAgICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25MaW5lTnVtYmVyfVxuICAgICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyUFJDb21tZW50SWNvbnMoKX1cblxuICAgICAgICB7dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLm1hcCh0aGlzLnJlbmRlckZpbGVQYXRjaERlY29yYXRpb25zKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJMaW5lRGVjb3JhdGlvbnMoXG4gICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLnByb3BzLnNlbGVjdGVkUm93cywgcm93ID0+IFJhbmdlLmZyb21PYmplY3QoW1tyb3csIDBdLCBbcm93LCBJbmZpbml0eV1dKSksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLXNlbGVjdGVkJyxcbiAgICAgICAgICB7Z3V0dGVyOiB0cnVlLCBpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRBZGRpdGlvbkxheWVyKCksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLWFkZGVkJyxcbiAgICAgICAgICB7aWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zT25MYXllcihcbiAgICAgICAgICB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldERlbGV0aW9uTGF5ZXIoKSxcbiAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tZGVsZXRlZCcsXG4gICAgICAgICAge2ljb246IHRydWUsIGxpbmU6IHRydWV9LFxuICAgICAgICApfVxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXROb05ld2xpbmVMYXllcigpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1ub25ld2xpbmUnLFxuICAgICAgICAgIHtpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cblxuICAgICAgPC9BdG9tVGV4dEVkaXRvcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUFJDb21tZW50SWNvbnMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgIT09IElzc3VlaXNoRGV0YWlsSXRlbSB8fFxuICAgICAgICB0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzTG9hZGluZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmV2aWV3Q29tbWVudFRocmVhZHMubWFwKCh7Y29tbWVudHMsIHRocmVhZH0pID0+IHtcbiAgICAgIGNvbnN0IHtwYXRoLCBwb3NpdGlvbn0gPSBjb21tZW50c1swXTtcbiAgICAgIGlmICghdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRQYXRjaEZvclBhdGgocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uKHBhdGgsIHBvc2l0aW9uKTtcbiAgICAgIGlmIChyb3cgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzUm93U2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGVkUm93cy5oYXMocm93KTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21tZW50R3V0dGVyRGVjb3JhdGlvbkNvbnRyb2xsZXJcbiAgICAgICAgICBrZXk9e2BnaXRodWItY29tbWVudC1ndXR0ZXItZGVjb3JhdGlvbi0ke3RocmVhZC5pZH1gfVxuICAgICAgICAgIGNvbW1lbnRSb3c9e3Jvd31cbiAgICAgICAgICB0aHJlYWRJZD17dGhyZWFkLmlkfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgICAgb3duZXI9e3RoaXMucHJvcHMub3duZXJ9XG4gICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvfVxuICAgICAgICAgIG51bWJlcj17dGhpcy5wcm9wcy5udW1iZXJ9XG4gICAgICAgICAgd29ya2Rpcj17dGhpcy5wcm9wcy53b3JrZGlyUGF0aH1cbiAgICAgICAgICBleHRyYUNsYXNzZXM9e2lzUm93U2VsZWN0ZWQgPyBbJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLXNlbGVjdGVkJ10gOiBbXX1cbiAgICAgICAgICBwYXJlbnQ9e3RoaXMuY29uc3RydWN0b3IubmFtZX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWxlUGF0Y2hEZWNvcmF0aW9ucyA9IChmaWxlUGF0Y2gsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNDb2xsYXBzZWQgPSAhZmlsZVBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzVmlzaWJsZSgpO1xuICAgIGNvbnN0IGlzRW1wdHkgPSBmaWxlUGF0Y2guZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5pc0VtcHR5KCk7XG4gICAgY29uc3QgaXNFeHBhbmRhYmxlID0gZmlsZVBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzRXhwYW5kYWJsZSgpO1xuICAgIGNvbnN0IGlzVW5hdmFpbGFibGUgPSBpc0NvbGxhcHNlZCAmJiAhaXNFeHBhbmRhYmxlO1xuICAgIGNvbnN0IGF0RW5kID0gZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKS5zdGFydC5pc0VxdWFsKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBpc0VtcHR5ICYmIGF0RW5kID8gJ2FmdGVyJyA6ICdiZWZvcmUnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudCBrZXk9e2ZpbGVQYXRjaC5nZXRQYXRoKCl9PlxuICAgICAgICA8TWFya2VyIGludmFsaWRhdGU9XCJuZXZlclwiIGJ1ZmZlclJhbmdlPXtmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpfT5cbiAgICAgICAgICA8RGVjb3JhdGlvbiB0eXBlPVwiYmxvY2tcIiBwb3NpdGlvbj17cG9zaXRpb259IG9yZGVyPXtpbmRleH0gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udHJvbEJsb2NrXCI+XG4gICAgICAgICAgICA8RmlsZVBhdGNoSGVhZGVyVmlld1xuICAgICAgICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgICAgICAgcmVsUGF0aD17ZmlsZVBhdGNoLmdldFBhdGgoKX1cbiAgICAgICAgICAgICAgbmV3UGF0aD17ZmlsZVBhdGNoLmdldFN0YXR1cygpID09PSAncmVuYW1lZCcgPyBmaWxlUGF0Y2guZ2V0TmV3UGF0aCgpIDogbnVsbH1cbiAgICAgICAgICAgICAgc3RhZ2luZ1N0YXR1cz17dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfVxuICAgICAgICAgICAgICBpc1BhcnRpYWxseVN0YWdlZD17dGhpcy5wcm9wcy5pc1BhcnRpYWxseVN0YWdlZH1cbiAgICAgICAgICAgICAgaGFzVW5kb0hpc3Rvcnk9e3RoaXMucHJvcHMuaGFzVW5kb0hpc3Rvcnl9XG4gICAgICAgICAgICAgIGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnM9e3RoaXMucHJvcHMuaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9uc31cblxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cblxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9eygpID0+IHRoaXMudW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbihmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICBkaXZlSW50b01pcnJvclBhdGNoPXsoKSA9PiB0aGlzLnByb3BzLmRpdmVJbnRvTWlycm9yUGF0Y2goZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgb3BlbkZpbGU9eygpID0+IHRoaXMuZGlkT3BlbkZpbGUoe3NlbGVjdGVkRmlsZVBhdGNoOiBmaWxlUGF0Y2h9KX1cbiAgICAgICAgICAgICAgdG9nZ2xlRmlsZT17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVGaWxlKGZpbGVQYXRjaCl9XG5cbiAgICAgICAgICAgICAgaXNDb2xsYXBzZWQ9e2lzQ29sbGFwc2VkfVxuICAgICAgICAgICAgICB0cmlnZ2VyQ29sbGFwc2U9eygpID0+IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guY29sbGFwc2VGaWxlUGF0Y2goZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgdHJpZ2dlckV4cGFuZD17KCkgPT4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5leHBhbmRGaWxlUGF0Y2goZmlsZVBhdGNoKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIHRoaXMucmVuZGVyU3ltbGlua0NoYW5nZU1ldGEoZmlsZVBhdGNoKX1cbiAgICAgICAgICAgIHshaXNDb2xsYXBzZWQgJiYgdGhpcy5yZW5kZXJFeGVjdXRhYmxlTW9kZUNoYW5nZU1ldGEoZmlsZVBhdGNoKX1cbiAgICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICAgIDwvTWFya2VyPlxuXG4gICAgICAgIHtpc0V4cGFuZGFibGUgJiYgdGhpcy5yZW5kZXJEaWZmR2F0ZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBpbmRleCl9XG4gICAgICAgIHtpc1VuYXZhaWxhYmxlICYmIHRoaXMucmVuZGVyRGlmZlVuYXZhaWxhYmxlKGZpbGVQYXRjaCwgcG9zaXRpb24sIGluZGV4KX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJIdW5rSGVhZGVycyhmaWxlUGF0Y2gsIGluZGV4KX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRpZmZHYXRlKGZpbGVQYXRjaCwgcG9zaXRpb24sIG9yZGVyT2Zmc2V0KSB7XG4gICAgY29uc3Qgc2hvd0RpZmYgPSAoKSA9PiB7XG4gICAgICBhZGRFdmVudCgnZXhwYW5kLWZpbGUtcGF0Y2gnLCB7Y29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIHBhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmV4cGFuZEZpbGVQYXRjaChmaWxlUGF0Y2gpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXIgaW52YWxpZGF0ZT1cIm5ldmVyXCIgYnVmZmVyUmFuZ2U9e2ZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCl9PlxuICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgIHR5cGU9XCJibG9ja1wiXG4gICAgICAgICAgb3JkZXI9e29yZGVyT2Zmc2V0ICsgMC4xfVxuICAgICAgICAgIHBvc2l0aW9uPXtwb3NpdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cblxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1lc3NhZ2UgaWNvbiBpY29uLWluZm9cIj5cbiAgICAgICAgICAgIExhcmdlIGRpZmZzIGFyZSBjb2xsYXBzZWQgYnkgZGVmYXVsdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1zaG93RGlmZkJ1dHRvblwiIG9uQ2xpY2s9e3Nob3dEaWZmfT4gTG9hZCBEaWZmPC9idXR0b24+XG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgIDwvTWFya2VyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEaWZmVW5hdmFpbGFibGUoZmlsZVBhdGNoLCBwb3NpdGlvbiwgb3JkZXJPZmZzZXQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlciBpbnZhbGlkYXRlPVwibmV2ZXJcIiBidWZmZXJSYW5nZT17ZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKX0+XG4gICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgdHlwZT1cImJsb2NrXCJcbiAgICAgICAgICBvcmRlcj17b3JkZXJPZmZzZXQgKyAwLjF9XG4gICAgICAgICAgcG9zaXRpb249e3Bvc2l0aW9ufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWVzc2FnZSBpY29uIGljb24td2FybmluZ1wiPlxuICAgICAgICAgICAgVGhpcyBkaWZmIGlzIHRvbyBsYXJnZSB0byBsb2FkIGF0IGFsbC4gVXNlIHRoZSBjb21tYW5kLWxpbmUgdG8gdmlldyBpdC5cbiAgICAgICAgICA8L3A+XG5cbiAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgPC9NYXJrZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckV4ZWN1dGFibGVNb2RlQ2hhbmdlTWV0YShmaWxlUGF0Y2gpIHtcbiAgICBpZiAoIWZpbGVQYXRjaC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRNb2RlID0gZmlsZVBhdGNoLmdldE9sZE1vZGUoKTtcbiAgICBjb25zdCBuZXdNb2RlID0gZmlsZVBhdGNoLmdldE5ld01vZGUoKTtcblxuICAgIGNvbnN0IGF0dHJzID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICA/IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS1kb3duJyxcbiAgICAgICAgYWN0aW9uVGV4dDogJ1N0YWdlIE1vZGUgQ2hhbmdlJyxcbiAgICAgIH1cbiAgICAgIDoge1xuICAgICAgICBhY3Rpb25JY29uOiAnaWNvbi1tb3ZlLXVwJyxcbiAgICAgICAgYWN0aW9uVGV4dDogJ1Vuc3RhZ2UgTW9kZSBDaGFuZ2UnLFxuICAgICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RmlsZVBhdGNoTWV0YVZpZXdcbiAgICAgICAgdGl0bGU9XCJNb2RlIGNoYW5nZVwiXG4gICAgICAgIGFjdGlvbkljb249e2F0dHJzLmFjdGlvbkljb259XG4gICAgICAgIGFjdGlvblRleHQ9e2F0dHJzLmFjdGlvblRleHR9XG4gICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICBhY3Rpb249eygpID0+IHRoaXMucHJvcHMudG9nZ2xlTW9kZUNoYW5nZShmaWxlUGF0Y2gpfT5cbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIEZpbGUgY2hhbmdlZCBtb2RlXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLXJlbW92ZWRcIj5cbiAgICAgICAgICAgIGZyb20ge2V4ZWN1dGFibGVUZXh0W29sZE1vZGVdfSA8Y29kZT57b2xkTW9kZX08L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1hZGRlZFwiPlxuICAgICAgICAgICAgdG8ge2V4ZWN1dGFibGVUZXh0W25ld01vZGVdfSA8Y29kZT57bmV3TW9kZX08L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgPC9GaWxlUGF0Y2hNZXRhVmlldz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU3ltbGlua0NoYW5nZU1ldGEoZmlsZVBhdGNoKSB7XG4gICAgaWYgKCFmaWxlUGF0Y2guaGFzU3ltbGluaygpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZGV0YWlsID0gPGRpdiAvPjtcbiAgICBsZXQgdGl0bGUgPSAnJztcbiAgICBjb25zdCBvbGRTeW1saW5rID0gZmlsZVBhdGNoLmdldE9sZFN5bWxpbmsoKTtcbiAgICBjb25zdCBuZXdTeW1saW5rID0gZmlsZVBhdGNoLmdldE5ld1N5bWxpbmsoKTtcbiAgICBpZiAob2xkU3ltbGluayAmJiBuZXdTeW1saW5rKSB7XG4gICAgICBkZXRhaWwgPSAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBTeW1saW5rIGNoYW5nZWRcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2N4KFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmJyxcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tZnVsbFdpZHRoJyxcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tcmVtb3ZlZCcsXG4gICAgICAgICAgKX0+XG4gICAgICAgICAgICBmcm9tIDxjb2RlPntvbGRTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZicsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWZ1bGxXaWR0aCcsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWFkZGVkJyxcbiAgICAgICAgICApfT5cbiAgICAgICAgICAgIHRvIDxjb2RlPntuZXdTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+LlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICAgIHRpdGxlID0gJ1N5bWxpbmsgY2hhbmdlZCc7XG4gICAgfSBlbHNlIGlmIChvbGRTeW1saW5rICYmICFuZXdTeW1saW5rKSB7XG4gICAgICBkZXRhaWwgPSAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBTeW1saW5rXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLXJlbW92ZWRcIj5cbiAgICAgICAgICAgIHRvIDxjb2RlPntvbGRTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgZGVsZXRlZC5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgICB0aXRsZSA9ICdTeW1saW5rIGRlbGV0ZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXRhaWwgPSAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBTeW1saW5rXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWFkZGVkXCI+XG4gICAgICAgICAgICB0byA8Y29kZT57bmV3U3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIGNyZWF0ZWQuXG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgICAgdGl0bGUgPSAnU3ltbGluayBjcmVhdGVkJztcbiAgICB9XG5cbiAgICBjb25zdCBhdHRycyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgPyB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtZG93bicsXG4gICAgICAgIGFjdGlvblRleHQ6ICdTdGFnZSBTeW1saW5rIENoYW5nZScsXG4gICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS11cCcsXG4gICAgICAgIGFjdGlvblRleHQ6ICdVbnN0YWdlIFN5bWxpbmsgQ2hhbmdlJyxcbiAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZpbGVQYXRjaE1ldGFWaWV3XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgYWN0aW9uSWNvbj17YXR0cnMuYWN0aW9uSWNvbn1cbiAgICAgICAgYWN0aW9uVGV4dD17YXR0cnMuYWN0aW9uVGV4dH1cbiAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgIGFjdGlvbj17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVTeW1saW5rQ2hhbmdlKGZpbGVQYXRjaCl9PlxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAge2RldGFpbH1cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgIDwvRmlsZVBhdGNoTWV0YVZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckh1bmtIZWFkZXJzKGZpbGVQYXRjaCwgb3JkZXJPZmZzZXQpIHtcbiAgICBjb25zdCB0b2dnbGVWZXJiID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnID8gJ1N0YWdlJyA6ICdVbnN0YWdlJztcbiAgICBjb25zdCBzZWxlY3RlZEh1bmtzID0gbmV3IFNldChcbiAgICAgIEFycmF5LmZyb20odGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsIHJvdyA9PiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChyb3cpKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPE1hcmtlckxheWVyPlxuICAgICAgICAgIHtmaWxlUGF0Y2guZ2V0SHVua3MoKS5tYXAoKGh1bmssIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250YWluc1NlbGVjdGlvbiA9IHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2xpbmUnICYmIHNlbGVjdGVkSHVua3MuaGFzKGh1bmspO1xuICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdodW5rJykgJiYgc2VsZWN0ZWRIdW5rcy5oYXMoaHVuayk7XG5cbiAgICAgICAgICAgIGxldCBidXR0b25TdWZmaXggPSAnJztcbiAgICAgICAgICAgIGlmIChjb250YWluc1NlbGVjdGlvbikge1xuICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ1NlbGVjdGVkIExpbmUnO1xuICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5zZWxlY3RlZFJvd3Muc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ3MnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ0h1bmsnO1xuICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRIdW5rcy5zaXplID4gMSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvblN1ZmZpeCArPSAncyc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG9nZ2xlU2VsZWN0aW9uTGFiZWwgPSBgJHt0b2dnbGVWZXJifSAke2J1dHRvblN1ZmZpeH1gO1xuICAgICAgICAgICAgY29uc3QgZGlzY2FyZFNlbGVjdGlvbkxhYmVsID0gYERpc2NhcmQgJHtidXR0b25TdWZmaXh9YDtcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IGh1bmsuZ2V0UmFuZ2UoKS5zdGFydDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UmFuZ2UgPSBuZXcgUmFuZ2Uoc3RhcnRQb2ludCwgc3RhcnRQb2ludCk7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxNYXJrZXIga2V5PXtgaHVua0hlYWRlci0ke2luZGV4fWB9IGJ1ZmZlclJhbmdlPXtzdGFydFJhbmdlfSBpbnZhbGlkYXRlPVwibmV2ZXJcIj5cbiAgICAgICAgICAgICAgICA8RGVjb3JhdGlvbiB0eXBlPVwiYmxvY2tcIiBvcmRlcj17b3JkZXJPZmZzZXQgKyAwLjJ9IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuICAgICAgICAgICAgICAgICAgPEh1bmtIZWFkZXJWaWV3XG4gICAgICAgICAgICAgICAgICAgIHJlZlRhcmdldD17dGhpcy5yZWZFZGl0b3JFbGVtZW50fVxuICAgICAgICAgICAgICAgICAgICBodW5rPXtodW5rfVxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICBzdGFnaW5nU3RhdHVzPXt0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbk1vZGU9XCJsaW5lXCJcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2VsZWN0aW9uTGFiZWw9e3RvZ2dsZVNlbGVjdGlvbkxhYmVsfVxuICAgICAgICAgICAgICAgICAgICBkaXNjYXJkU2VsZWN0aW9uTGFiZWw9e2Rpc2NhcmRTZWxlY3Rpb25MYWJlbH1cblxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNlbGVjdGlvbj17KCkgPT4gdGhpcy50b2dnbGVIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKX1cbiAgICAgICAgICAgICAgICAgICAgZGlzY2FyZFNlbGVjdGlvbj17KCkgPT4gdGhpcy5kaXNjYXJkSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbil9XG4gICAgICAgICAgICAgICAgICAgIG1vdXNlRG93bj17dGhpcy5kaWRNb3VzZURvd25PbkhlYWRlcn1cbiAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgICAgICAgICAgPC9NYXJrZXI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L01hcmtlckxheWVyPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTGluZURlY29yYXRpb25zKHJhbmdlcywgbGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29uLCByZWZIb2xkZXJ9KSB7XG4gICAgaWYgKHJhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGhvbGRlciA9IHJlZkhvbGRlciB8fCBuZXcgUmVmSG9sZGVyKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXJMYXllciBoYW5kbGVMYXllcj17aG9sZGVyLnNldHRlcn0+XG4gICAgICAgIHtyYW5nZXMubWFwKChyYW5nZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE1hcmtlclxuICAgICAgICAgICAgICBrZXk9e2BsaW5lLSR7bGluZUNsYXNzfS0ke2luZGV4fWB9XG4gICAgICAgICAgICAgIGJ1ZmZlclJhbmdlPXtyYW5nZX1cbiAgICAgICAgICAgICAgaW52YWxpZGF0ZT1cIm5ldmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zKGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbn0pfVxuICAgICAgPC9NYXJrZXJMYXllcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKGxheWVyLCBsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KSB7XG4gICAgaWYgKGxheWVyLmdldE1hcmtlckNvdW50KCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyTGF5ZXIgZXh0ZXJuYWw9e2xheWVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnMobGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSl9XG4gICAgICA8L01hcmtlckxheWVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEZWNvcmF0aW9ucyhsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAge2xpbmUgJiYgKFxuICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICB0eXBlPVwibGluZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2xpbmVDbGFzc31cbiAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtndXR0ZXIgJiYgKFxuICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICAgIGd1dHRlck5hbWU9XCJvbGQtbGluZS1udW1iZXJzXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICAgIGd1dHRlck5hbWU9XCJuZXctbGluZS1udW1iZXJzXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJndXR0ZXJcIlxuICAgICAgICAgICAgICBndXR0ZXJOYW1lPVwiZ2l0aHViLWNvbW1lbnQtaWNvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1lZGl0b3JDb21tZW50R3V0dGVySWNvbiBlbXB0eSAke2xpbmVDbGFzc31gfVxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgKX1cbiAgICAgICAge2ljb24gJiYgKFxuICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgZ3V0dGVyTmFtZT1cImRpZmYtaWNvbnNcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEZpbGVQYXRjaGVzID0gQXJyYXkuZnJvbSh0aGlzLmdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSk7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IENoYW5nZWRGaWxlSXRlbSkge1xuICAgICAgICB0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZChzZWxlY3RlZEZpbGVQYXRjaGVzWzBdLCB7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnY29yZTp1bmRvJ319KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uID0gZmlsZVBhdGNoID0+IHtcbiAgICB0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZChmaWxlUGF0Y2gsIHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgfVxuXG4gIGRpc2NhcmRTZWxlY3Rpb25Gcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkUm93cyhcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlLFxuICAgICAge2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLXNlbGVjdGVkLWxpbmVzJ319LFxuICAgICk7XG4gIH1cblxuICB0b2dnbGVIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVSb3dzKFxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93cyxcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlLFxuICAgICAgICB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNoYW5nZVJvd3MgPSBuZXcgU2V0KFxuICAgICAgICBodW5rLmdldENoYW5nZXMoKVxuICAgICAgICAgIC5yZWR1Y2UoKHJvd3MsIGNoYW5nZSkgPT4ge1xuICAgICAgICAgICAgcm93cy5wdXNoKC4uLmNoYW5nZS5nZXRCdWZmZXJSb3dzKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgICAgfSwgW10pLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnRvZ2dsZVJvd3MoXG4gICAgICAgIGNoYW5nZVJvd3MsXG4gICAgICAgICdodW5rJyxcbiAgICAgICAge2V2ZW50U291cmNlOiAnYnV0dG9uJ30sXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGRpc2NhcmRIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkUm93cyhcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSxcbiAgICAgICAge2V2ZW50U291cmNlOiAnYnV0dG9uJ30sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjaGFuZ2VSb3dzID0gbmV3IFNldChcbiAgICAgICAgaHVuay5nZXRDaGFuZ2VzKClcbiAgICAgICAgICAucmVkdWNlKChyb3dzLCBjaGFuZ2UpID0+IHtcbiAgICAgICAgICAgIHJvd3MucHVzaCguLi5jaGFuZ2UuZ2V0QnVmZmVyUm93cygpKTtcbiAgICAgICAgICAgIHJldHVybiByb3dzO1xuICAgICAgICAgIH0sIFtdKSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkUm93cyhjaGFuZ2VSb3dzLCAnaHVuaycsIHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgICB9XG4gIH1cblxuICBkaWRNb3VzZURvd25PbkhlYWRlcihldmVudCwgaHVuaykge1xuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25FdmVudChldmVudCwgaHVuay5nZXRSYW5nZSgpKTtcbiAgfVxuXG4gIGRpZE1vdXNlRG93bk9uTGluZU51bWJlcihldmVudCkge1xuICAgIGNvbnN0IGxpbmUgPSBldmVudC5idWZmZXJSb3c7XG4gICAgaWYgKGxpbmUgPT09IHVuZGVmaW5lZCB8fCBpc05hTihsaW5lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgaWYgKHRoaXMuaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQuZG9tRXZlbnQsIFtbbGluZSwgMF0sIFtsaW5lLCBJbmZpbml0eV1dKSkge1xuICAgICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGRpZE1vdXNlTW92ZU9uTGluZU51bWJlcihldmVudCkge1xuICAgIGlmICghdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lID0gZXZlbnQuYnVmZmVyUm93O1xuICAgIGlmICh0aGlzLmxhc3RNb3VzZU1vdmVMaW5lID09PSBsaW5lIHx8IGxpbmUgPT09IHVuZGVmaW5lZCB8fCBpc05hTihsaW5lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxhc3RNb3VzZU1vdmVMaW5lID0gbGluZTtcblxuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25FdmVudChldmVudC5kb21FdmVudCwgW1tsaW5lLCAwXSwgW2xpbmUsIEluZmluaXR5XV0sIHthZGQ6IHRydWV9KTtcbiAgfVxuXG4gIGRpZE1vdXNlVXAoKSB7XG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdGlvbkV2ZW50KGV2ZW50LCByYW5nZUxpa2UsIG9wdHMpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaXNXaW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbiAgICBpZiAoZXZlbnQuY3RybEtleSAmJiAhaXNXaW5kb3dzKSB7XG4gICAgICAvLyBBbGxvdyB0aGUgY29udGV4dCBtZW51IHRvIG9wZW4uXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGFkZDogZmFsc2UsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHRhcmdldCBzZWxlY3Rpb24gcmFuZ2VcbiAgICBjb25zdCBjb252ZXJ0ZWQgPSBSYW5nZS5mcm9tT2JqZWN0KHJhbmdlTGlrZSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5jbGlwQnVmZmVyUmFuZ2UoY29udmVydGVkKSkuZ2V0T3IoY29udmVydGVkKTtcblxuICAgIGlmIChldmVudC5tZXRhS2V5IHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIChldmVudC5jdHJsS2V5ICYmIGlzV2luZG93cykpIHtcbiAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICBsZXQgaW50ZXJzZWN0cyA9IGZhbHNlO1xuICAgICAgICBsZXQgd2l0aG91dCA9IG51bGw7XG5cbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3Rpb24gb2YgZWRpdG9yLmdldFNlbGVjdGlvbnMoKSkge1xuICAgICAgICAgIGlmIChzZWxlY3Rpb24uaW50ZXJzZWN0c0J1ZmZlclJhbmdlKHJhbmdlKSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHJhbmdlIGZyb20gdGhpcyBzZWxlY3Rpb24gYnkgdHJ1bmNhdGluZyBpdCB0byB0aGUgXCJuZWFyIGVkZ2VcIiBvZiB0aGUgcmFuZ2UgYW5kIGNyZWF0aW5nIGFcbiAgICAgICAgICAgIC8vIG5ldyBzZWxlY3Rpb24gZnJvbSB0aGUgXCJmYXIgZWRnZVwiIHRvIHRoZSBwcmV2aW91cyBlbmQuIE9taXQgZWl0aGVyIHNpZGUgaWYgaXQgaXMgZW1wdHkuXG4gICAgICAgICAgICBpbnRlcnNlY3RzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmdlcyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoIXJhbmdlLnN0YXJ0LmlzRXF1YWwoc2VsZWN0aW9uUmFuZ2Uuc3RhcnQpKSB7XG4gICAgICAgICAgICAgIC8vIEluY2x1ZGUgdGhlIGJpdCBmcm9tIHRoZSBzZWxlY3Rpb24ncyBwcmV2aW91cyBzdGFydCB0byB0aGUgcmFuZ2UncyBzdGFydC5cbiAgICAgICAgICAgICAgbGV0IG51ZGdlZCA9IHJhbmdlLnN0YXJ0O1xuICAgICAgICAgICAgICBpZiAocmFuZ2Uuc3RhcnQuY29sdW1uID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdENvbHVtbiA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KHJhbmdlLnN0YXJ0LnJvdyAtIDEpO1xuICAgICAgICAgICAgICAgIG51ZGdlZCA9IFtyYW5nZS5zdGFydC5yb3cgLSAxLCBsYXN0Q29sdW1uXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG5ld1Jhbmdlcy5wdXNoKFtzZWxlY3Rpb25SYW5nZS5zdGFydCwgbnVkZ2VkXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcmFuZ2UuZW5kLmlzRXF1YWwoc2VsZWN0aW9uUmFuZ2UuZW5kKSkge1xuICAgICAgICAgICAgICAvLyBJbmNsdWRlIHRoZSBiaXQgZnJvbSB0aGUgcmFuZ2UncyBlbmQgdG8gdGhlIHNlbGVjdGlvbidzIGVuZC5cbiAgICAgICAgICAgICAgbGV0IG51ZGdlZCA9IHJhbmdlLmVuZDtcbiAgICAgICAgICAgICAgY29uc3QgbGFzdENvbHVtbiA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KHJhbmdlLmVuZC5yb3cpO1xuICAgICAgICAgICAgICBpZiAocmFuZ2UuZW5kLmNvbHVtbiA9PT0gbGFzdENvbHVtbikge1xuICAgICAgICAgICAgICAgIG51ZGdlZCA9IFtyYW5nZS5lbmQucm93ICsgMSwgMF07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBuZXdSYW5nZXMucHVzaChbbnVkZ2VkLCBzZWxlY3Rpb25SYW5nZS5lbmRdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld1Jhbmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShuZXdSYW5nZXNbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5ld1JhbmdlIG9mIG5ld1Jhbmdlcy5zbGljZSgxKSkge1xuICAgICAgICAgICAgICAgIGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShuZXdSYW5nZSwge3JldmVyc2VkOiBzZWxlY3Rpb24uaXNSZXZlcnNlZCgpfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdpdGhvdXQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpdGhvdXQgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudFJhbmdlcyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICAgIC5maWx0ZXIoZWFjaCA9PiBlYWNoICE9PSB3aXRob3V0KVxuICAgICAgICAgICAgLm1hcChlYWNoID0+IGVhY2guZ2V0QnVmZmVyUmFuZ2UoKSk7XG4gICAgICAgICAgaWYgKHJlcGxhY2VtZW50UmFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhyZXBsYWNlbWVudFJhbmdlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKSB7XG4gICAgICAgICAgLy8gQWRkIHRoaXMgcmFuZ2UgYXMgYSBuZXcsIGRpc3RpbmN0IHNlbGVjdGlvbi5cbiAgICAgICAgICBlZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UocmFuZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWRkIHx8IGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAvLyBFeHRlbmQgdGhlIGV4aXN0aW5nIHNlbGVjdGlvbiB0byBlbmNvbXBhc3MgdGhpcyByYW5nZS5cbiAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICBjb25zdCBsYXN0U2VsZWN0aW9uID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKTtcbiAgICAgICAgY29uc3QgbGFzdFNlbGVjdGlvblJhbmdlID0gbGFzdFNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpO1xuXG4gICAgICAgIC8vIFlvdSBhcmUgbm93IGVudGVyaW5nIHRoZSB3YWxsIG9mIHRlcm5lcnkgb3BlcmF0b3JzLiBUaGlzIGlzIHlvdXIgbGFzdCBleGl0IGJlZm9yZSB0aGUgdG9sbGJvb3RoXG4gICAgICAgIGNvbnN0IGlzQmVmb3JlID0gcmFuZ2Uuc3RhcnQuaXNMZXNzVGhhbihsYXN0U2VsZWN0aW9uUmFuZ2Uuc3RhcnQpO1xuICAgICAgICBjb25zdCBmYXJFZGdlID0gaXNCZWZvcmUgPyByYW5nZS5zdGFydCA6IHJhbmdlLmVuZDtcbiAgICAgICAgY29uc3QgbmV3UmFuZ2UgPSBpc0JlZm9yZSA/IFtmYXJFZGdlLCBsYXN0U2VsZWN0aW9uUmFuZ2UuZW5kXSA6IFtsYXN0U2VsZWN0aW9uUmFuZ2Uuc3RhcnQsIGZhckVkZ2VdO1xuXG4gICAgICAgIGxhc3RTZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UobmV3UmFuZ2UsIHtyZXZlcnNlZDogaXNCZWZvcmV9KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSkpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGlkQ29uZmlybSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVSb3dzKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLCB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUpO1xuICB9XG5cbiAgZGlkVG9nZ2xlU2VsZWN0aW9uTW9kZSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZEh1bmtzID0gdGhpcy5nZXRTZWxlY3RlZEh1bmtzKCk7XG4gICAgdGhpcy53aXRoU2VsZWN0aW9uTW9kZSh7XG4gICAgICBsaW5lOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGh1bmtSYW5nZXMgPSBzZWxlY3RlZEh1bmtzLm1hcChodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKGh1bmtSYW5nZXMpKTtcbiAgICAgIH0sXG4gICAgICBodW5rOiAoKSA9PiB7XG4gICAgICAgIGxldCBmaXJzdENoYW5nZVJvdyA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGNvbnN0IGh1bmsgb2Ygc2VsZWN0ZWRIdW5rcykge1xuICAgICAgICAgIGNvbnN0IFtmaXJzdENoYW5nZV0gPSBodW5rLmdldENoYW5nZXMoKTtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChmaXJzdENoYW5nZSAmJiAoIWZpcnN0Q2hhbmdlUm93IHx8IGZpcnN0Q2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCkgPCBmaXJzdENoYW5nZVJvdykpIHtcbiAgICAgICAgICAgIGZpcnN0Q2hhbmdlUm93ID0gZmlyc3RDaGFuZ2UuZ2V0U3RhcnRCdWZmZXJSb3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoW1tbZmlyc3RDaGFuZ2VSb3csIDBdLCBbZmlyc3RDaGFuZ2VSb3csIEluZmluaXR5XV1dKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZGlkVG9nZ2xlTW9kZUNoYW5nZSA9ICgpID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICBBcnJheS5mcm9tKHRoaXMuZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpKVxuICAgICAgICAuZmlsdGVyKGZwID0+IGZwLmRpZENoYW5nZUV4ZWN1dGFibGVNb2RlKCkpXG4gICAgICAgIC5tYXAodGhpcy5wcm9wcy50b2dnbGVNb2RlQ2hhbmdlKSxcbiAgICApO1xuICB9XG5cbiAgZGlkVG9nZ2xlU3ltbGlua0NoYW5nZSA9ICgpID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICBBcnJheS5mcm9tKHRoaXMuZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpKVxuICAgICAgICAuZmlsdGVyKGZwID0+IGZwLmhhc1R5cGVjaGFuZ2UoKSlcbiAgICAgICAgLm1hcCh0aGlzLnByb3BzLnRvZ2dsZVN5bWxpbmtDaGFuZ2UpLFxuICAgICk7XG4gIH1cblxuICBzZWxlY3ROZXh0SHVuaygpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IG5leHRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICAgIHRoaXMud2l0aFNlbGVjdGVkSHVua3MoaHVuayA9PiB0aGlzLmdldEh1bmtBZnRlcihodW5rKSB8fCBodW5rKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXh0UmFuZ2VzID0gQXJyYXkuZnJvbShuZXh0SHVua3MsIGh1bmsgPT4gaHVuay5nZXRSYW5nZSgpKTtcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMobmV4dFJhbmdlcyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdFByZXZpb3VzSHVuaygpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IG5leHRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICAgIHRoaXMud2l0aFNlbGVjdGVkSHVua3MoaHVuayA9PiB0aGlzLmdldEh1bmtCZWZvcmUoaHVuaykgfHwgaHVuayksXG4gICAgICApO1xuICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IEFycmF5LmZyb20obmV4dEh1bmtzLCBodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5leHRSYW5nZXMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBkaWRPcGVuRmlsZSh7c2VsZWN0ZWRGaWxlUGF0Y2h9KSB7XG4gICAgY29uc3QgY3Vyc29yc0J5RmlsZVBhdGNoID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBwbGFjZWRSb3dzID0gbmV3IFNldCgpO1xuXG4gICAgICBmb3IgKGNvbnN0IGN1cnNvciBvZiBlZGl0b3IuZ2V0Q3Vyc29ycygpKSB7XG4gICAgICAgIGNvbnN0IGN1cnNvclJvdyA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLnJvdztcbiAgICAgICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KGN1cnNvclJvdyk7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRjaCA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoQXQoY3Vyc29yUm93KTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKCFodW5rKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3Um93ID0gaHVuay5nZXROZXdSb3dBdChjdXJzb3JSb3cpO1xuICAgICAgICBsZXQgbmV3Q29sdW1uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkuY29sdW1uO1xuICAgICAgICBpZiAobmV3Um93ID09PSBudWxsKSB7XG4gICAgICAgICAgbGV0IG5lYXJlc3RSb3cgPSBodW5rLmdldE5ld1N0YXJ0Um93KCk7XG4gICAgICAgICAgZm9yIChjb25zdCByZWdpb24gb2YgaHVuay5nZXRSZWdpb25zKCkpIHtcbiAgICAgICAgICAgIGlmICghcmVnaW9uLmluY2x1ZGVzQnVmZmVyUm93KGN1cnNvclJvdykpIHtcbiAgICAgICAgICAgICAgcmVnaW9uLndoZW4oe1xuICAgICAgICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbmVhcmVzdFJvdyArPSByZWdpb24uYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBuZWFyZXN0Um93ICs9IHJlZ2lvbi5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFwbGFjZWRSb3dzLmhhcyhuZWFyZXN0Um93KSkge1xuICAgICAgICAgICAgbmV3Um93ID0gbmVhcmVzdFJvdztcbiAgICAgICAgICAgIG5ld0NvbHVtbiA9IDA7XG4gICAgICAgICAgICBwbGFjZWRSb3dzLmFkZChuZWFyZXN0Um93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3Um93ICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gV2h5IGlzIHRoaXMgbmVlZGVkPyBJIF90aGlua18gZXZlcnl0aGluZyBpcyBpbiB0ZXJtcyBvZiBidWZmZXIgcG9zaXRpb25cbiAgICAgICAgICAvLyBzbyB0aGVyZSBzaG91bGRuJ3QgYmUgYW4gb2ZmLWJ5LW9uZSBpc3N1ZVxuICAgICAgICAgIG5ld1JvdyAtPSAxO1xuICAgICAgICAgIGNvbnN0IGN1cnNvcnMgPSBjdXJzb3JzQnlGaWxlUGF0Y2guZ2V0KGZpbGVQYXRjaCk7XG4gICAgICAgICAgaWYgKCFjdXJzb3JzKSB7XG4gICAgICAgICAgICBjdXJzb3JzQnlGaWxlUGF0Y2guc2V0KGZpbGVQYXRjaCwgW1tuZXdSb3csIG5ld0NvbHVtbl1dKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3Vyc29ycy5wdXNoKFtuZXdSb3csIG5ld0NvbHVtbl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbGVQYXRjaGVzV2l0aEN1cnNvcnMgPSBuZXcgU2V0KGN1cnNvcnNCeUZpbGVQYXRjaC5rZXlzKCkpO1xuICAgIGlmIChzZWxlY3RlZEZpbGVQYXRjaCAmJiAhZmlsZVBhdGNoZXNXaXRoQ3Vyc29ycy5oYXMoc2VsZWN0ZWRGaWxlUGF0Y2gpKSB7XG4gICAgICBjb25zdCBbZmlyc3RIdW5rXSA9IHNlbGVjdGVkRmlsZVBhdGNoLmdldEh1bmtzKCk7XG4gICAgICBjb25zdCBjdXJzb3JSb3cgPSBmaXJzdEh1bmsgPyBmaXJzdEh1bmsuZ2V0TmV3U3RhcnRSb3coKSAtIDEgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAwO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGUoc2VsZWN0ZWRGaWxlUGF0Y2gsIFtbY3Vyc29yUm93LCAwXV0sIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwZW5kaW5nID0gY3Vyc29yc0J5RmlsZVBhdGNoLnNpemUgPT09IDE7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShjdXJzb3JzQnlGaWxlUGF0Y2gsIHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgW2ZpbGVQYXRjaCwgY3Vyc29yc10gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGUoZmlsZVBhdGNoLCBjdXJzb3JzLCBwZW5kaW5nKTtcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgfVxuXG4gIGdldFNlbGVjdGVkUm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICByZXR1cm4gbmV3IFNldChcbiAgICAgICAgZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgICAgIC5tYXAoc2VsZWN0aW9uID0+IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcmFuZ2UpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJhbmdlLmdldFJvd3MoKSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5pc0NoYW5nZVJvdyhyb3cpKSB7XG4gICAgICAgICAgICAgICAgYWNjLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCBbXSksXG4gICAgICApO1xuICAgIH0pLmdldE9yKG5ldyBTZXQoKSk7XG4gIH1cblxuICBkaWRBZGRTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgfVxuXG4gIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlKGV2ZW50KSB7XG4gICAgaWYgKFxuICAgICAgIWV2ZW50IHx8XG4gICAgICBldmVudC5vbGRCdWZmZXJSYW5nZS5zdGFydC5yb3cgIT09IGV2ZW50Lm5ld0J1ZmZlclJhbmdlLnN0YXJ0LnJvdyB8fFxuICAgICAgZXZlbnQub2xkQnVmZmVyUmFuZ2UuZW5kLnJvdyAhPT0gZXZlbnQubmV3QnVmZmVyUmFuZ2UuZW5kLnJvd1xuICAgICkge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgICB9XG4gIH1cblxuICBkaWREZXN0cm95U2VsZWN0aW9uKCkge1xuICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gIH1cblxuICBkaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKSB7XG4gICAgaWYgKHRoaXMuc3VwcHJlc3NDaGFuZ2VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dEN1cnNvclJvd3MgPSB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIHJldHVybiBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLnJvdyk7XG4gICAgfSkuZ2V0T3IoW10pO1xuICAgIGNvbnN0IGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnMgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLnNwYW5zTXVsdGlwbGVGaWxlcyhuZXh0Q3Vyc29yUm93cyk7XG5cbiAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93c0NoYW5nZWQoXG4gICAgICB0aGlzLmdldFNlbGVjdGVkUm93cygpLFxuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSB8fCAnbGluZScsXG4gICAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zLFxuICAgICk7XG4gIH1cblxuICBvbGRMaW5lTnVtYmVyTGFiZWwoe2J1ZmZlclJvdywgc29mdFdyYXBwZWR9KSB7XG4gICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKGh1bmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKCcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRSb3cgPSBodW5rLmdldE9sZFJvd0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKHNvZnRXcmFwcGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWQob2xkUm93ID09PSBudWxsID8gJycgOiAn4oCiJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFkKG9sZFJvdyk7XG4gIH1cblxuICBuZXdMaW5lTnVtYmVyTGFiZWwoe2J1ZmZlclJvdywgc29mdFdyYXBwZWR9KSB7XG4gICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKGh1bmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKCcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdSb3cgPSBodW5rLmdldE5ld1Jvd0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKHNvZnRXcmFwcGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWQobmV3Um93ID09PSBudWxsID8gJycgOiAn4oCiJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhZChuZXdSb3cpO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgU2V0IG9mIHRoZSBIdW5rcyB0aGF0IGluY2x1ZGUgYXQgbGVhc3Qgb25lIGVkaXRvciBzZWxlY3Rpb24uIFRoZSBzZWxlY3Rpb24gbmVlZCBub3QgY29udGFpbiBhbiBhY3R1YWxcbiAgICogY2hhbmdlIHJvdy5cbiAgICovXG4gIGdldFNlbGVjdGVkSHVua3MoKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFNlbGVjdGVkSHVua3MoZWFjaCA9PiBlYWNoKTtcbiAgfVxuXG4gIHdpdGhTZWxlY3RlZEh1bmtzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKS5yZWR1Y2UoKGFjYywgcmFuZ2UpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgcmFuZ2UuZ2V0Um93cygpKSB7XG4gICAgICAgICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KHJvdyk7XG4gICAgICAgICAgaWYgKCFodW5rIHx8IHNlZW4uaGFzKGh1bmspKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuLmFkZChodW5rKTtcbiAgICAgICAgICBhY2MucHVzaChjYWxsYmFjayhodW5rKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIFtdKTtcbiAgICB9KS5nZXRPcihbXSk7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBTZXQgb2YgRmlsZVBhdGNoZXMgdGhhdCBpbmNsdWRlIGF0IGxlYXN0IG9uZSBlZGl0b3Igc2VsZWN0aW9uLiBUaGUgc2VsZWN0aW9uIG5lZWQgbm90IGNvbnRhaW4gYW4gYWN0dWFsXG4gICAqIGNoYW5nZSByb3cuXG4gICAqL1xuICBnZXRTZWxlY3RlZEZpbGVQYXRjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHBhdGNoZXMgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKSB7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJhbmdlLmdldFJvd3MoKSkge1xuICAgICAgICAgIGNvbnN0IHBhdGNoID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hBdChyb3cpO1xuICAgICAgICAgIHBhdGNoZXMuYWRkKHBhdGNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGNoZXM7XG4gICAgfSkuZ2V0T3IobmV3IFNldCgpKTtcbiAgfVxuXG4gIGdldEh1bmtCZWZvcmUoaHVuaykge1xuICAgIGNvbnN0IHByZXZSb3cgPSBodW5rLmdldFJhbmdlKCkuc3RhcnQucm93IC0gMTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQocHJldlJvdyk7XG4gIH1cblxuICBnZXRIdW5rQWZ0ZXIoaHVuaykge1xuICAgIGNvbnN0IG5leHRSb3cgPSBodW5rLmdldFJhbmdlKCkuZW5kLnJvdyArIDE7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KG5leHRSb3cpO1xuICB9XG5cbiAgaXNDaGFuZ2VSb3coYnVmZmVyUm93KSB7XG4gICAgY29uc3QgY2hhbmdlTGF5ZXJzID0gW3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QWRkaXRpb25MYXllcigpLCB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldERlbGV0aW9uTGF5ZXIoKV07XG4gICAgcmV0dXJuIGNoYW5nZUxheWVycy5zb21lKGxheWVyID0+IGxheWVyLmZpbmRNYXJrZXJzKHtpbnRlcnNlY3RzUm93OiBidWZmZXJSb3d9KS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIHdpdGhTZWxlY3Rpb25Nb2RlKGNhbGxiYWNrcykge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gY2FsbGJhY2tzW3RoaXMucHJvcHMuc2VsZWN0aW9uTW9kZV07XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHNlbGVjdGlvbiBtb2RlOiAke3RoaXMucHJvcHMuc2VsZWN0aW9uTW9kZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICBwYWQobnVtKSB7XG4gICAgY29uc3QgbWF4RGlnaXRzID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRNYXhMaW5lTnVtYmVyV2lkdGgoKTtcbiAgICBpZiAobnVtID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gTkJTUF9DSEFSQUNURVIucmVwZWF0KG1heERpZ2l0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOQlNQX0NIQVJBQ1RFUi5yZXBlYXQobWF4RGlnaXRzIC0gbnVtLnRvU3RyaW5nKCkubGVuZ3RoKSArIG51bS50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvRmlsZSA9ICh7Y2hhbmdlZEZpbGVQYXRoLCBjaGFuZ2VkRmlsZVBvc2l0aW9ufSkgPT4ge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGUgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24oY2hhbmdlZEZpbGVQYXRoLCBjaGFuZ2VkRmlsZVBvc2l0aW9uKTtcbiAgICAgIGlmIChyb3cgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGUuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbih7cm93LCBjb2x1bW46IDB9LCB7Y2VudGVyOiB0cnVlfSk7XG4gICAgICBlLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHtyb3csIGNvbHVtbjogMH0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBtZWFzdXJlUGVyZm9ybWFuY2UoYWN0aW9uKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoKGFjdGlvbiA9PT0gJ3VwZGF0ZScgfHwgYWN0aW9uID09PSAnbW91bnQnKVxuICAgICAgJiYgcGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5TmFtZShgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1zdGFydGApLmxlbmd0aCA+IDApIHtcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tZW5kYCk7XG4gICAgICBwZXJmb3JtYW5jZS5tZWFzdXJlKFxuICAgICAgICBgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWAsXG4gICAgICAgIGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LXN0YXJ0YCxcbiAgICAgICAgYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tZW5kYCk7XG4gICAgICBjb25zdCBwZXJmID0gcGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5TmFtZShgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWApWzBdO1xuICAgICAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcyhgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1zdGFydGApO1xuICAgICAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcyhgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1lbmRgKTtcbiAgICAgIHBlcmZvcm1hbmNlLmNsZWFyTWVhc3VyZXMoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gKTtcbiAgICAgIGFkZEV2ZW50KGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259YCwge1xuICAgICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgICAgZmlsZVBhdGNoZXNMaW5lQ291bnRzOiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCkubWFwKFxuICAgICAgICAgIGZwID0+IGZwLmdldFBhdGNoKCkuZ2V0Q2hhbmdlZExpbmVDb3VudCgpLFxuICAgICAgICApLFxuICAgICAgICBkdXJhdGlvbjogcGVyZi5kdXJhdGlvbixcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxXQUFBLEdBQUFELHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSSxLQUFBLEdBQUFKLE9BQUE7QUFDQSxJQUFBSyxTQUFBLEdBQUFMLE9BQUE7QUFFQSxJQUFBTSxRQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxjQUFBLEdBQUFQLE9BQUE7QUFDQSxJQUFBUSxXQUFBLEdBQUFSLE9BQUE7QUFDQSxJQUFBUyxlQUFBLEdBQUFQLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBVSxPQUFBLEdBQUFSLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBVyxZQUFBLEdBQUFULHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBWSxXQUFBLEdBQUFWLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBYSxPQUFBLEdBQUFYLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBYyxTQUFBLEdBQUFmLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBZSxvQkFBQSxHQUFBYixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQWdCLGtCQUFBLEdBQUFkLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFB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