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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jbGFzc25hbWVzIiwiX2F0b20iLCJfZXZlbnRLaXQiLCJfaGVscGVycyIsIl9yZXBvcnRlclByb3h5IiwiX3Byb3BUeXBlczIiLCJfYXRvbVRleHRFZGl0b3IiLCJfbWFya2VyIiwiX21hcmtlckxheWVyIiwiX2RlY29yYXRpb24iLCJfZ3V0dGVyIiwiX2NvbW1hbmRzIiwiX2ZpbGVQYXRjaEhlYWRlclZpZXciLCJfZmlsZVBhdGNoTWV0YVZpZXciLCJfaHVua0hlYWRlclZpZXciLCJfcmVmSG9sZGVyIiwiX2NoYW5nZWRGaWxlSXRlbSIsIl9jb21taXREZXRhaWxJdGVtIiwiX2NvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlciIsIl9pc3N1ZWlzaERldGFpbEl0ZW0iLCJfZmlsZSIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiZXhlY3V0YWJsZVRleHQiLCJGaWxlIiwibW9kZXMiLCJOT1JNQUwiLCJFWEVDVVRBQkxFIiwiTXVsdGlGaWxlUGF0Y2hWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZmlsZVBhdGNoIiwiaW5kZXgiLCJpc0NvbGxhcHNlZCIsImdldFJlbmRlclN0YXR1cyIsImlzVmlzaWJsZSIsImlzRW1wdHkiLCJnZXRNYXJrZXIiLCJnZXRSYW5nZSIsImlzRXhwYW5kYWJsZSIsImlzVW5hdmFpbGFibGUiLCJhdEVuZCIsImdldFN0YXJ0UmFuZ2UiLCJzdGFydCIsImlzRXF1YWwiLCJtdWx0aUZpbGVQYXRjaCIsImdldEJ1ZmZlciIsImdldEVuZFBvc2l0aW9uIiwicG9zaXRpb24iLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJnZXRQYXRoIiwiaW52YWxpZGF0ZSIsImJ1ZmZlclJhbmdlIiwidHlwZSIsIm9yZGVyIiwiY2xhc3NOYW1lIiwiaXRlbVR5cGUiLCJyZWxQYXRoIiwibmV3UGF0aCIsImdldFN0YXR1cyIsImdldE5ld1BhdGgiLCJzdGFnaW5nU3RhdHVzIiwiaXNQYXJ0aWFsbHlTdGFnZWQiLCJoYXNVbmRvSGlzdG9yeSIsImhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnMiLCJ0b29sdGlwcyIsInVuZG9MYXN0RGlzY2FyZCIsInVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24iLCJkaXZlSW50b01pcnJvclBhdGNoIiwib3BlbkZpbGUiLCJkaWRPcGVuRmlsZSIsInNlbGVjdGVkRmlsZVBhdGNoIiwidG9nZ2xlRmlsZSIsInRyaWdnZXJDb2xsYXBzZSIsImNvbGxhcHNlRmlsZVBhdGNoIiwidHJpZ2dlckV4cGFuZCIsImV4cGFuZEZpbGVQYXRjaCIsInJlbmRlclN5bWxpbmtDaGFuZ2VNZXRhIiwicmVuZGVyRXhlY3V0YWJsZU1vZGVDaGFuZ2VNZXRhIiwicmVuZGVyRGlmZkdhdGUiLCJyZW5kZXJEaWZmVW5hdmFpbGFibGUiLCJyZW5kZXJIdW5rSGVhZGVycyIsInNlbGVjdGVkRmlsZVBhdGNoZXMiLCJBcnJheSIsImZyb20iLCJnZXRTZWxlY3RlZEZpbGVQYXRjaGVzIiwiQ2hhbmdlZEZpbGVJdGVtIiwiZXZlbnRTb3VyY2UiLCJjb21tYW5kIiwiZGlzY2FyZFJvd3MiLCJzZWxlY3RlZFJvd3MiLCJzZWxlY3Rpb25Nb2RlIiwiUHJvbWlzZSIsImFsbCIsImZwIiwiZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUiLCJtYXAiLCJ0b2dnbGVNb2RlQ2hhbmdlIiwiaGFzVHlwZWNoYW5nZSIsInRvZ2dsZVN5bWxpbmtDaGFuZ2UiLCJjaGFuZ2VkRmlsZVBhdGgiLCJjaGFuZ2VkRmlsZVBvc2l0aW9uIiwicmVmRWRpdG9yIiwicm93IiwiZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uIiwic2Nyb2xsVG9CdWZmZXJQb3NpdGlvbiIsImNvbHVtbiIsImNlbnRlciIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwiYXV0b2JpbmQiLCJtb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MiLCJsYXN0TW91c2VNb3ZlTGluZSIsIm5leHRTZWxlY3Rpb25Nb2RlIiwicmVmUm9vdCIsIlJlZkhvbGRlciIsInJlZkVkaXRvckVsZW1lbnQiLCJtb3VudGVkIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhZGQiLCJvYnNlcnZlIiwiZWRpdG9yIiwic2V0dGVyIiwiZ2V0RWxlbWVudCIsImVsZW1lbnQiLCJyZWZJbml0aWFsRm9jdXMiLCJzdXBwcmVzc0NoYW5nZXMiLCJsYXN0U2Nyb2xsVG9wIiwibGFzdFNjcm9sbExlZnQiLCJsYXN0U2VsZWN0aW9uSW5kZXgiLCJvbldpbGxVcGRhdGVQYXRjaCIsImdldE1heFNlbGVjdGlvbkluZGV4IiwiZ2V0U2Nyb2xsVG9wIiwiZ2V0U2Nyb2xsTGVmdCIsIm9uRGlkVXBkYXRlUGF0Y2giLCJuZXh0UGF0Y2giLCJuZXh0U2VsZWN0aW9uUmFuZ2UiLCJnZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4Iiwic2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSIsIm5leHRIdW5rcyIsIlNldCIsIlJhbmdlIiwiZnJvbU9iamVjdCIsImdldFJvd3MiLCJnZXRIdW5rQXQiLCJCb29sZWFuIiwibmV4dFJhbmdlcyIsInNpemUiLCJodW5rIiwic2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMiLCJzZXRTY3JvbGxUb3AiLCJzZXRTY3JvbGxMZWZ0IiwiZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzIiwiY29tcG9uZW50RGlkTW91bnQiLCJtZWFzdXJlUGVyZm9ybWFuY2UiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZGlkTW91c2VVcCIsImZpcnN0UGF0Y2giLCJnZXRGaWxlUGF0Y2hlcyIsImZpcnN0SHVuayIsImdldEh1bmtzIiwiY29uZmlnIiwib25EaWRDaGFuZ2UiLCJmb3JjZVVwZGF0ZSIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsInNjcm9sbFRvRmlsZSIsIm9uT3BlbkZpbGVzVGFiIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcG9zZSIsInBlcmZvcm1hbmNlIiwiY2xlYXJNYXJrcyIsImNsZWFyTWVhc3VyZXMiLCJyZW5kZXIiLCJyb290Q2xhc3MiLCJjeCIsImFueVByZXNlbnQiLCJtYXJrIiwicmVmIiwicmVuZGVyQ29tbWFuZHMiLCJyZW5kZXJOb25FbXB0eVBhdGNoIiwicmVuZGVyRW1wdHlQYXRjaCIsIkNvbW1pdERldGFpbEl0ZW0iLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJyZWdpc3RyeSIsImNvbW1hbmRzIiwidGFyZ2V0IiwiQ29tbWFuZCIsImNhbGxiYWNrIiwic2VsZWN0TmV4dEh1bmsiLCJzZWxlY3RQcmV2aW91c0h1bmsiLCJkaWRUb2dnbGVTZWxlY3Rpb25Nb2RlIiwic3RhZ2VNb2RlQ29tbWFuZCIsInN0YWdlU3ltbGlua0NvbW1hbmQiLCJkaWRBbnlDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsImRpZFRvZ2dsZU1vZGVDaGFuZ2UiLCJhbnlIYXZlVHlwZWNoYW5nZSIsImRpZFRvZ2dsZVN5bWxpbmtDaGFuZ2UiLCJkaWRDb25maXJtIiwidW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvIiwiZGlzY2FyZFNlbGVjdGlvbkZyb21Db21tYW5kIiwic3VyZmFjZSIsImF0b20iLCJpbkRldk1vZGUiLCJjb25zb2xlIiwibG9nIiwiZ2V0UGF0Y2hCdWZmZXIiLCJpbnNwZWN0IiwibGF5ZXJOYW1lcyIsIndvcmtzcGFjZSIsImJ1ZmZlciIsImxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlIiwiYXV0b1dpZHRoIiwiYXV0b0hlaWdodCIsInJlYWRPbmx5Iiwic29mdFdyYXBwZWQiLCJkaWRBZGRTZWxlY3Rpb24iLCJkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSIsImRpZERlc3Ryb3lTZWxlY3Rpb24iLCJyZWZNb2RlbCIsImhpZGVFbXB0aW5lc3MiLCJuYW1lIiwicHJpb3JpdHkiLCJsYWJlbEZuIiwib2xkTGluZU51bWJlckxhYmVsIiwib25Nb3VzZURvd24iLCJkaWRNb3VzZURvd25PbkxpbmVOdW1iZXIiLCJvbk1vdXNlTW92ZSIsImRpZE1vdXNlTW92ZU9uTGluZU51bWJlciIsIm5ld0xpbmVOdW1iZXJMYWJlbCIsImJsYW5rTGFiZWwiLCJyZW5kZXJQUkNvbW1lbnRJY29ucyIsInJlbmRlckZpbGVQYXRjaERlY29yYXRpb25zIiwicmVuZGVyTGluZURlY29yYXRpb25zIiwiSW5maW5pdHkiLCJndXR0ZXIiLCJpY29uIiwibGluZSIsInJlbmRlckRlY29yYXRpb25zT25MYXllciIsImdldEFkZGl0aW9uTGF5ZXIiLCJnZXREZWxldGlvbkxheWVyIiwiZ2V0Tm9OZXdsaW5lTGF5ZXIiLCJyZXZpZXdDb21tZW50c0xvYWRpbmciLCJyZXZpZXdDb21tZW50VGhyZWFkcyIsImNvbW1lbnRzIiwidGhyZWFkIiwicGF0aCIsImdldFBhdGNoRm9yUGF0aCIsImlzUm93U2VsZWN0ZWQiLCJpZCIsImNvbW1lbnRSb3ciLCJ0aHJlYWRJZCIsImVuZHBvaW50Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwid29ya2RpciIsIndvcmtkaXJQYXRoIiwiZXh0cmFDbGFzc2VzIiwicGFyZW50Iiwib3JkZXJPZmZzZXQiLCJzaG93RGlmZiIsImFkZEV2ZW50IiwiY29tcG9uZW50IiwicGFja2FnZSIsIm9uQ2xpY2siLCJvbGRNb2RlIiwiZ2V0T2xkTW9kZSIsIm5ld01vZGUiLCJnZXROZXdNb2RlIiwiYXR0cnMiLCJhY3Rpb25JY29uIiwiYWN0aW9uVGV4dCIsInRpdGxlIiwiYWN0aW9uIiwiaGFzU3ltbGluayIsImRldGFpbCIsIm9sZFN5bWxpbmsiLCJnZXRPbGRTeW1saW5rIiwibmV3U3ltbGluayIsImdldE5ld1N5bWxpbmsiLCJ0b2dnbGVWZXJiIiwic2VsZWN0ZWRIdW5rcyIsImNvbnRhaW5zU2VsZWN0aW9uIiwiaXNTZWxlY3RlZCIsImJ1dHRvblN1ZmZpeCIsInRvZ2dsZVNlbGVjdGlvbkxhYmVsIiwiZGlzY2FyZFNlbGVjdGlvbkxhYmVsIiwic3RhcnRQb2ludCIsInN0YXJ0UmFuZ2UiLCJyZWZUYXJnZXQiLCJrZXltYXBzIiwidG9nZ2xlU2VsZWN0aW9uIiwidG9nZ2xlSHVua1NlbGVjdGlvbiIsImRpc2NhcmRTZWxlY3Rpb24iLCJkaXNjYXJkSHVua1NlbGVjdGlvbiIsIm1vdXNlRG93biIsImRpZE1vdXNlRG93bk9uSGVhZGVyIiwicmFuZ2VzIiwibGluZUNsYXNzIiwicmVmSG9sZGVyIiwiaG9sZGVyIiwiaGFuZGxlTGF5ZXIiLCJyYW5nZSIsInJlbmRlckRlY29yYXRpb25zIiwibGF5ZXIiLCJnZXRNYXJrZXJDb3VudCIsImV4dGVybmFsIiwib21pdEVtcHR5TGFzdFJvdyIsImd1dHRlck5hbWUiLCJ0b2dnbGVSb3dzIiwiY2hhbmdlUm93cyIsImdldENoYW5nZXMiLCJyZWR1Y2UiLCJyb3dzIiwiY2hhbmdlIiwiZ2V0QnVmZmVyUm93cyIsImV2ZW50IiwiaGFuZGxlU2VsZWN0aW9uRXZlbnQiLCJidWZmZXJSb3ciLCJpc05hTiIsImRvbUV2ZW50IiwicmFuZ2VMaWtlIiwib3B0cyIsImJ1dHRvbiIsImlzV2luZG93cyIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsImN0cmxLZXkiLCJvcHRpb25zIiwiY29udmVydGVkIiwiY2xpcEJ1ZmZlclJhbmdlIiwiZ2V0T3IiLCJtZXRhS2V5IiwiaW50ZXJzZWN0cyIsIndpdGhvdXQiLCJzZWxlY3Rpb24iLCJnZXRTZWxlY3Rpb25zIiwiaW50ZXJzZWN0c0J1ZmZlclJhbmdlIiwic2VsZWN0aW9uUmFuZ2UiLCJnZXRCdWZmZXJSYW5nZSIsIm5ld1JhbmdlcyIsIm51ZGdlZCIsImxhc3RDb2x1bW4iLCJsaW5lTGVuZ3RoRm9yUm93IiwiZW5kIiwic2V0QnVmZmVyUmFuZ2UiLCJuZXdSYW5nZSIsInNsaWNlIiwiYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UiLCJyZXZlcnNlZCIsImlzUmV2ZXJzZWQiLCJyZXBsYWNlbWVudFJhbmdlcyIsImVhY2giLCJzaGlmdEtleSIsImxhc3RTZWxlY3Rpb24iLCJnZXRMYXN0U2VsZWN0aW9uIiwibGFzdFNlbGVjdGlvblJhbmdlIiwiaXNCZWZvcmUiLCJpc0xlc3NUaGFuIiwiZmFyRWRnZSIsImdldFNlbGVjdGVkSHVua3MiLCJ3aXRoU2VsZWN0aW9uTW9kZSIsImh1bmtSYW5nZXMiLCJmaXJzdENoYW5nZVJvdyIsImZpcnN0Q2hhbmdlIiwiZ2V0U3RhcnRCdWZmZXJSb3ciLCJ3aXRoU2VsZWN0ZWRIdW5rcyIsImdldEh1bmtBZnRlciIsImdldEh1bmtCZWZvcmUiLCJjdXJzb3JzQnlGaWxlUGF0Y2giLCJNYXAiLCJwbGFjZWRSb3dzIiwiY3Vyc29yIiwiZ2V0Q3Vyc29ycyIsImN1cnNvclJvdyIsImdldEJ1ZmZlclBvc2l0aW9uIiwiZ2V0RmlsZVBhdGNoQXQiLCJuZXdSb3ciLCJnZXROZXdSb3dBdCIsIm5ld0NvbHVtbiIsIm5lYXJlc3RSb3ciLCJnZXROZXdTdGFydFJvdyIsInJlZ2lvbiIsImdldFJlZ2lvbnMiLCJpbmNsdWRlc0J1ZmZlclJvdyIsIndoZW4iLCJ1bmNoYW5nZWQiLCJidWZmZXJSb3dDb3VudCIsImFkZGl0aW9uIiwiY3Vyc29ycyIsImZpbGVQYXRjaGVzV2l0aEN1cnNvcnMiLCJwZW5kaW5nIiwiZ2V0U2VsZWN0ZWRSb3dzIiwiYWNjIiwiaXNDaGFuZ2VSb3ciLCJvbGRCdWZmZXJSYW5nZSIsIm5ld0J1ZmZlclJhbmdlIiwibmV4dEN1cnNvclJvd3MiLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMiLCJzcGFuc011bHRpcGxlRmlsZXMiLCJzZWxlY3RlZFJvd3NDaGFuZ2VkIiwicGFkIiwib2xkUm93IiwiZ2V0T2xkUm93QXQiLCJzZWVuIiwiZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMiLCJwYXRjaGVzIiwicGF0Y2giLCJwcmV2Um93IiwibmV4dFJvdyIsImNoYW5nZUxheWVycyIsInNvbWUiLCJmaW5kTWFya2VycyIsImludGVyc2VjdHNSb3ciLCJjYWxsYmFja3MiLCJFcnJvciIsIm51bSIsIm1heERpZ2l0cyIsImdldE1heExpbmVOdW1iZXJXaWR0aCIsIk5CU1BfQ0hBUkFDVEVSIiwicmVwZWF0IiwidG9TdHJpbmciLCJnZXRFbnRyaWVzQnlOYW1lIiwibWVhc3VyZSIsInBlcmYiLCJmaWxlUGF0Y2hlc0xpbmVDb3VudHMiLCJnZXRQYXRjaCIsImdldENoYW5nZWRMaW5lQ291bnQiLCJkdXJhdGlvbiIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJvbmVPZiIsImJvb2wiLCJJdGVtVHlwZVByb3BUeXBlIiwiaXNSZXF1aXJlZCIsInJlcG9zaXRvcnkiLCJvYmplY3QiLCJNdWx0aUZpbGVQYXRjaFByb3BUeXBlIiwiYXJyYXlPZiIsInNoYXBlIiwicHVsbFJlcXVlc3QiLCJmdW5jIiwic3dpdGNoVG9Jc3N1ZWlzaCIsIlJlZkhvbGRlclByb3BUeXBlIiwic3RyaW5nIiwiRW5kcG9pbnRQcm9wVHlwZSIsIkRpc3Bvc2FibGUiXSwic291cmNlcyI6WyJtdWx0aS1maWxlLXBhdGNoLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHthdXRvYmluZCwgTkJTUF9DSEFSQUNURVIsIGJsYW5rTGFiZWx9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZSwgTXVsdGlGaWxlUGF0Y2hQcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZSwgRW5kcG9pbnRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi4vYXRvbS9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckxheWVyIGZyb20gJy4uL2F0b20vbWFya2VyLWxheWVyJztcbmltcG9ydCBEZWNvcmF0aW9uIGZyb20gJy4uL2F0b20vZGVjb3JhdGlvbic7XG5pbXBvcnQgR3V0dGVyIGZyb20gJy4uL2F0b20vZ3V0dGVyJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IEZpbGVQYXRjaEhlYWRlclZpZXcgZnJvbSAnLi9maWxlLXBhdGNoLWhlYWRlci12aWV3JztcbmltcG9ydCBGaWxlUGF0Y2hNZXRhVmlldyBmcm9tICcuL2ZpbGUtcGF0Y2gtbWV0YS12aWV3JztcbmltcG9ydCBIdW5rSGVhZGVyVmlldyBmcm9tICcuL2h1bmstaGVhZGVyLXZpZXcnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NvbW1lbnQtZ3V0dGVyLWRlY29yYXRpb24tY29udHJvbGxlcic7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCBGaWxlIGZyb20gJy4uL21vZGVscy9wYXRjaC9maWxlJztcblxuY29uc3QgZXhlY3V0YWJsZVRleHQgPSB7XG4gIFtGaWxlLm1vZGVzLk5PUk1BTF06ICdub24gZXhlY3V0YWJsZScsXG4gIFtGaWxlLm1vZGVzLkVYRUNVVEFCTEVdOiAnZXhlY3V0YWJsZScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aUZpbGVQYXRjaFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEJlaGF2aW9yIGNvbnRyb2xzXG4gICAgc3RhZ2luZ1N0YXR1czogUHJvcFR5cGVzLm9uZU9mKFsnc3RhZ2VkJywgJ3Vuc3RhZ2VkJ10pLFxuICAgIGlzUGFydGlhbGx5U3RhZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpdGVtVHlwZTogSXRlbVR5cGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTW9kZWxzXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG11bHRpRmlsZVBhdGNoOiBNdWx0aUZpbGVQYXRjaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0aW9uTW9kZTogUHJvcFR5cGVzLm9uZU9mKFsnaHVuaycsICdsaW5lJ10pLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRSb3dzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9uczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvLyBSZXZpZXcgY29tbWVudHNcbiAgICByZXZpZXdDb21tZW50c0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLFxuICAgIHJldmlld0NvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8vIENhbGxiYWNrc1xuICAgIHNlbGVjdGVkUm93c0NoYW5nZWQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXZlSW50b01pcnJvclBhdGNoOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBzdXJmYWNlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvcGVuRmlsZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlRmlsZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlUm93czogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlTW9kZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlU3ltbGlua0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkaXNjYXJkUm93czogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25XaWxsVXBkYXRlUGF0Y2g6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRGlkVXBkYXRlUGF0Y2g6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgLy8gRXh0ZXJuYWwgcmVmc1xuICAgIHJlZkVkaXRvcjogUmVmSG9sZGVyUHJvcFR5cGUsXG4gICAgcmVmSW5pdGlhbEZvY3VzOiBSZWZIb2xkZXJQcm9wVHlwZSxcblxuICAgIC8vIGZvciBuYXZpZ2F0aW5nIHRoZSBQUiBjaGFuZ2VkIGZpbGVzIHRhYlxuICAgIG9uT3BlbkZpbGVzVGFiOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBpbml0Q2hhbmdlZEZpbGVQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLCBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbjogUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8vIGZvciBvcGVuaW5nIHRoZSByZXZpZXdzIGRvY2sgaXRlbVxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHdvcmtkaXJQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbldpbGxVcGRhdGVQYXRjaDogKCkgPT4gbmV3IERpc3Bvc2FibGUoKSxcbiAgICBvbkRpZFVwZGF0ZVBhdGNoOiAoKSA9PiBuZXcgRGlzcG9zYWJsZSgpLFxuICAgIHJldmlld0NvbW1lbnRzTG9hZGluZzogZmFsc2UsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFtdLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2RpZE1vdXNlRG93bk9uSGVhZGVyJywgJ2RpZE1vdXNlRG93bk9uTGluZU51bWJlcicsICdkaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXInLCAnZGlkTW91c2VVcCcsXG4gICAgICAnZGlkQ29uZmlybScsICdkaWRUb2dnbGVTZWxlY3Rpb25Nb2RlJywgJ3NlbGVjdE5leHRIdW5rJywgJ3NlbGVjdFByZXZpb3VzSHVuaycsXG4gICAgICAnZGlkT3BlbkZpbGUnLCAnZGlkQWRkU2VsZWN0aW9uJywgJ2RpZENoYW5nZVNlbGVjdGlvblJhbmdlJywgJ2RpZERlc3Ryb3lTZWxlY3Rpb24nLFxuICAgICAgJ29sZExpbmVOdW1iZXJMYWJlbCcsICduZXdMaW5lTnVtYmVyTGFiZWwnLFxuICAgICk7XG5cbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMubGFzdE1vdXNlTW92ZUxpbmUgPSBudWxsO1xuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSBudWxsO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvckVsZW1lbnQgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucmVmRWRpdG9yLm9ic2VydmUoZWRpdG9yID0+IHtcbiAgICAgICAgdGhpcy5yZWZFZGl0b3JFbGVtZW50LnNldHRlcihlZGl0b3IuZ2V0RWxlbWVudCgpKTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucmVmRWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5yZWZFZGl0b3Iuc2V0dGVyKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZWZFZGl0b3JFbGVtZW50Lm9ic2VydmUoZWxlbWVudCA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzICYmIHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzLnNldHRlcihlbGVtZW50KTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBTeW5jaHJvbm91c2x5IG1haW50YWluIHRoZSBlZGl0b3IncyBzY3JvbGwgcG9zaXRpb24gYW5kIGxvZ2ljYWwgc2VsZWN0aW9uIGFjcm9zcyBidWZmZXIgdXBkYXRlcy5cbiAgICB0aGlzLnN1cHByZXNzQ2hhbmdlcyA9IGZhbHNlO1xuICAgIGxldCBsYXN0U2Nyb2xsVG9wID0gbnVsbDtcbiAgICBsZXQgbGFzdFNjcm9sbExlZnQgPSBudWxsO1xuICAgIGxldCBsYXN0U2VsZWN0aW9uSW5kZXggPSBudWxsO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLnByb3BzLm9uV2lsbFVwZGF0ZVBhdGNoKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdXBwcmVzc0NoYW5nZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgICBsYXN0U2VsZWN0aW9uSW5kZXggPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldE1heFNlbGVjdGlvbkluZGV4KHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzKTtcbiAgICAgICAgICBsYXN0U2Nyb2xsVG9wID0gZWRpdG9yLmdldEVsZW1lbnQoKS5nZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgICBsYXN0U2Nyb2xsTGVmdCA9IGVkaXRvci5nZXRFbGVtZW50KCkuZ2V0U2Nyb2xsTGVmdCgpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5wcm9wcy5vbkRpZFVwZGF0ZVBhdGNoKG5leHRQYXRjaCA9PiB7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGxhc3RTZWxlY3Rpb25JbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgbmV4dFNlbGVjdGlvblJhbmdlID0gbmV4dFBhdGNoLmdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgobGFzdFNlbGVjdGlvbkluZGV4KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdsaW5lJykge1xuICAgICAgICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShuZXh0U2VsZWN0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV4dEh1bmtzID0gbmV3IFNldChcbiAgICAgICAgICAgICAgICBSYW5nZS5mcm9tT2JqZWN0KG5leHRTZWxlY3Rpb25SYW5nZSkuZ2V0Um93cygpXG4gICAgICAgICAgICAgICAgICAubWFwKHJvdyA9PiBuZXh0UGF0Y2guZ2V0SHVua0F0KHJvdykpXG4gICAgICAgICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICAgIGNvbnN0IG5leHRSYW5nZXMgPSBuZXh0SHVua3Muc2l6ZSA+IDBcbiAgICAgICAgICAgICAgICA/IEFycmF5LmZyb20obmV4dEh1bmtzLCBodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSlcbiAgICAgICAgICAgICAgICA6IFtbWzAsIDBdLCBbMCwgMF1dXTtcblxuICAgICAgICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMobmV4dFJhbmdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAobGFzdFNjcm9sbFRvcCAhPT0gbnVsbCkgeyBlZGl0b3IuZ2V0RWxlbWVudCgpLnNldFNjcm9sbFRvcChsYXN0U2Nyb2xsVG9wKTsgfVxuXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAobGFzdFNjcm9sbExlZnQgIT09IG51bGwpIHsgZWRpdG9yLmdldEVsZW1lbnQoKS5zZXRTY3JvbGxMZWZ0KGxhc3RTY3JvbGxMZWZ0KTsgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdXBwcmVzc0NoYW5nZXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm1vdW50ZWQgPSB0cnVlO1xuICAgIHRoaXMubWVhc3VyZVBlcmZvcm1hbmNlKCdtb3VudCcpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmRpZE1vdXNlVXApO1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgLy8gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaCBpcyBndWFyYW50ZWVkIHRvIGNvbnRhaW4gYXQgbGVhc3Qgb25lIEZpbGVQYXRjaCBpZiA8QXRvbVRleHRFZGl0b3I+IGlzIHJlbmRlcmVkLlxuICAgICAgY29uc3QgW2ZpcnN0UGF0Y2hdID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpO1xuICAgICAgY29uc3QgW2ZpcnN0SHVua10gPSBmaXJzdFBhdGNoLmdldEh1bmtzKCk7XG4gICAgICBpZiAoIWZpcnN0SHVuaykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKGZpcnN0SHVuay5nZXRSYW5nZSgpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucHJvcHMuY29uZmlnLm9uRGlkQ2hhbmdlKCdnaXRodWIuc2hvd0RpZmZJY29uR3V0dGVyJywgKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuXG4gICAgY29uc3Qge2luaXRDaGFuZ2VkRmlsZVBhdGgsIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9ufSA9IHRoaXMucHJvcHM7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChpbml0Q2hhbmdlZEZpbGVQYXRoICYmIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uID49IDApIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9GaWxlKHtcbiAgICAgICAgY2hhbmdlZEZpbGVQYXRoOiBpbml0Q2hhbmdlZEZpbGVQYXRoLFxuICAgICAgICBjaGFuZ2VkRmlsZVBvc2l0aW9uOiBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh0aGlzLnByb3BzLm9uT3BlbkZpbGVzVGFiKSB7XG4gICAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgICB0aGlzLnByb3BzLm9uT3BlbkZpbGVzVGFiKHRoaXMuc2Nyb2xsVG9GaWxlKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHRoaXMubWVhc3VyZVBlcmZvcm1hbmNlKCd1cGRhdGUnKTtcblxuICAgIGlmIChwcmV2UHJvcHMucmVmSW5pdGlhbEZvY3VzICE9PSB0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cykge1xuICAgICAgcHJldlByb3BzLnJlZkluaXRpYWxGb2N1cyAmJiBwcmV2UHJvcHMucmVmSW5pdGlhbEZvY3VzLnNldHRlcihudWxsKTtcbiAgICAgIHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzICYmIHRoaXMucmVmRWRpdG9yRWxlbWVudC5tYXAodGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMuc2V0dGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaCA9PT0gcHJldlByb3BzLm11bHRpRmlsZVBhdGNoKSB7XG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZGlkTW91c2VVcCk7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKCk7XG4gICAgcGVyZm9ybWFuY2UuY2xlYXJNZWFzdXJlcygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJvb3RDbGFzcyA9IGN4KFxuICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3JyxcbiAgICAgIHtbYGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LS0ke3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c31gXTogdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfSxcbiAgICAgIHsnZ2l0aHViLUZpbGVQYXRjaFZpZXctLWJsYW5rJzogIXRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guYW55UHJlc2VudCgpfSxcbiAgICAgIHsnZ2l0aHViLUZpbGVQYXRjaFZpZXctLWh1bmtNb2RlJzogdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlID09PSAnaHVuayd9LFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5tb3VudGVkKSB7XG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKCdNdWx0aUZpbGVQYXRjaFZpZXctdXBkYXRlLXN0YXJ0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ011bHRpRmlsZVBhdGNoVmlldy1tb3VudC1zdGFydCcpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17cm9vdENsYXNzfSByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuXG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmFueVByZXNlbnQoKSA/IHRoaXMucmVuZGVyTm9uRW1wdHlQYXRjaCgpIDogdGhpcy5yZW5kZXJFbXB0eVBhdGNoKCl9XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gQ29tbWl0RGV0YWlsSXRlbSB8fCB0aGlzLnByb3BzLml0ZW1UeXBlID09PSBJc3N1ZWlzaERldGFpbEl0ZW0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PXt0aGlzLnJlZlJvb3R9PlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LW5leHQtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdE5leHRIdW5rfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LXByZXZpb3VzLWh1bmtcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RQcmV2aW91c0h1bmt9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtcGF0Y2gtc2VsZWN0aW9uLW1vZGVcIiBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVTZWxlY3Rpb25Nb2RlfSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VNb2RlQ29tbWFuZCA9IG51bGw7XG4gICAgbGV0IHN0YWdlU3ltbGlua0NvbW1hbmQgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZGlkQW55Q2hhbmdlRXhlY3V0YWJsZU1vZGUoKSkge1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgICA/ICdnaXRodWI6c3RhZ2UtZmlsZS1tb2RlLWNoYW5nZSdcbiAgICAgICAgOiAnZ2l0aHViOnVuc3RhZ2UtZmlsZS1tb2RlLWNoYW5nZSc7XG4gICAgICBzdGFnZU1vZGVDb21tYW5kID0gPENvbW1hbmQgY29tbWFuZD17Y29tbWFuZH0gY2FsbGJhY2s9e3RoaXMuZGlkVG9nZ2xlTW9kZUNoYW5nZX0gLz47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guYW55SGF2ZVR5cGVjaGFuZ2UoKSkge1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgICA/ICdnaXRodWI6c3RhZ2Utc3ltbGluay1jaGFuZ2UnXG4gICAgICAgIDogJ2dpdGh1Yjp1bnN0YWdlLXN5bWxpbmstY2hhbmdlJztcbiAgICAgIHN0YWdlU3ltbGlua0NvbW1hbmQgPSA8Q29tbWFuZCBjb21tYW5kPXtjb21tYW5kfSBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVTeW1saW5rQ2hhbmdlfSAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LW5leHQtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdE5leHRIdW5rfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdC1wcmV2aW91cy1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0UHJldmlvdXNIdW5rfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMuZGlkQ29uZmlybX0gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6dW5kb1wiIGNhbGxiYWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kb30gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXNjYXJkLXNlbGVjdGVkLWxpbmVzXCIgY2FsbGJhY2s9e3RoaXMuZGlzY2FyZFNlbGVjdGlvbkZyb21Db21tYW5kfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmp1bXAtdG8tZmlsZVwiIGNhbGxiYWNrPXt0aGlzLmRpZE9wZW5GaWxlfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnN1cmZhY2VcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5zdXJmYWNlfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1wYXRjaC1zZWxlY3Rpb24tbW9kZVwiIGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZVNlbGVjdGlvbk1vZGV9IC8+XG4gICAgICAgIHtzdGFnZU1vZGVDb21tYW5kfVxuICAgICAgICB7c3RhZ2VTeW1saW5rQ29tbWFuZH1cbiAgICAgICAgey8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGF0b20uaW5EZXZNb2RlKCkgJiZcbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3BlY3QtcGF0Y2hcIiBjYWxsYmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hCdWZmZXIoKS5pbnNwZWN0KHtcbiAgICAgICAgICAgICAgbGF5ZXJOYW1lczogWydwYXRjaCcsICdodW5rJ10sXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICAgIHsvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBhdG9tLmluRGV2TW9kZSgpICYmXG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnNwZWN0LXJlZ2lvbnNcIiBjYWxsYmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hCdWZmZXIoKS5pbnNwZWN0KHtcbiAgICAgICAgICAgICAgbGF5ZXJOYW1lczogWyd1bmNoYW5nZWQnLCAnZGVsZXRpb24nLCAnYWRkaXRpb24nLCAnbm9uZXdsaW5lJ10sXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICAgIHsvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBhdG9tLmluRGV2TW9kZSgpICYmXG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnNwZWN0LW1mcFwiIGNhbGxiYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5pbnNwZWN0KCkpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgPC9Db21tYW5kcz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRW1wdHlQYXRjaCgpIHtcbiAgICByZXR1cm4gPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWVzc2FnZSBpY29uIGljb24taW5mb1wiPk5vIGNoYW5nZXMgdG8gZGlzcGxheTwvcD47XG4gIH1cblxuICByZW5kZXJOb25FbXB0eVBhdGNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QXRvbVRleHRFZGl0b3JcbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cblxuICAgICAgICBidWZmZXI9e3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyKCl9XG4gICAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlPXtmYWxzZX1cbiAgICAgICAgYXV0b1dpZHRoPXtmYWxzZX1cbiAgICAgICAgYXV0b0hlaWdodD17ZmFsc2V9XG4gICAgICAgIHJlYWRPbmx5PXt0cnVlfVxuICAgICAgICBzb2Z0V3JhcHBlZD17dHJ1ZX1cblxuICAgICAgICBkaWRBZGRTZWxlY3Rpb249e3RoaXMuZGlkQWRkU2VsZWN0aW9ufVxuICAgICAgICBkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZT17dGhpcy5kaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZX1cbiAgICAgICAgZGlkRGVzdHJveVNlbGVjdGlvbj17dGhpcy5kaWREZXN0cm95U2VsZWN0aW9ufVxuICAgICAgICByZWZNb2RlbD17dGhpcy5yZWZFZGl0b3J9XG4gICAgICAgIGhpZGVFbXB0aW5lc3M9e3RydWV9PlxuXG4gICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICBuYW1lPVwib2xkLWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgcHJpb3JpdHk9ezF9XG4gICAgICAgICAgY2xhc3NOYW1lPVwib2xkXCJcbiAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgIGxhYmVsRm49e3RoaXMub2xkTGluZU51bWJlckxhYmVsfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uTGluZU51bWJlcn1cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5kaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICBuYW1lPVwibmV3LWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgcHJpb3JpdHk9ezJ9XG4gICAgICAgICAgY2xhc3NOYW1lPVwibmV3XCJcbiAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgIGxhYmVsRm49e3RoaXMubmV3TGluZU51bWJlckxhYmVsfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uTGluZU51bWJlcn1cbiAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5kaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICBuYW1lPVwiZ2l0aHViLWNvbW1lbnQtaWNvblwiXG4gICAgICAgICAgcHJpb3JpdHk9ezN9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiY29tbWVudFwiXG4gICAgICAgICAgdHlwZT1cImRlY29yYXRlZFwiXG4gICAgICAgIC8+XG4gICAgICAgIHt0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi5zaG93RGlmZkljb25HdXR0ZXInKSAmJiAoXG4gICAgICAgICAgPEd1dHRlclxuICAgICAgICAgICAgbmFtZT1cImRpZmYtaWNvbnNcIlxuICAgICAgICAgICAgcHJpb3JpdHk9ezR9XG4gICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaWNvbnNcIlxuICAgICAgICAgICAgbGFiZWxGbj17YmxhbmtMYWJlbH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uTGluZU51bWJlcn1cbiAgICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmRpZE1vdXNlTW92ZU9uTGluZU51bWJlcn1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlclBSQ29tbWVudEljb25zKCl9XG5cbiAgICAgICAge3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKS5tYXAodGhpcy5yZW5kZXJGaWxlUGF0Y2hEZWNvcmF0aW9ucyl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyTGluZURlY29yYXRpb25zKFxuICAgICAgICAgIEFycmF5LmZyb20odGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsIHJvdyA9PiBSYW5nZS5mcm9tT2JqZWN0KFtbcm93LCAwXSwgW3JvdywgSW5maW5pdHldXSkpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1zZWxlY3RlZCcsXG4gICAgICAgICAge2d1dHRlcjogdHJ1ZSwgaWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKFxuICAgICAgICAgIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QWRkaXRpb25MYXllcigpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1hZGRlZCcsXG4gICAgICAgICAge2ljb246IHRydWUsIGxpbmU6IHRydWV9LFxuICAgICAgICApfVxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXREZWxldGlvbkxheWVyKCksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLWRlbGV0ZWQnLFxuICAgICAgICAgIHtpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKFxuICAgICAgICAgIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0Tm9OZXdsaW5lTGF5ZXIoKSxcbiAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tbm9uZXdsaW5lJyxcbiAgICAgICAgICB7aWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG5cbiAgICAgIDwvQXRvbVRleHRFZGl0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclBSQ29tbWVudEljb25zKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlICE9PSBJc3N1ZWlzaERldGFpbEl0ZW0gfHxcbiAgICAgICAgdGhpcy5wcm9wcy5yZXZpZXdDb21tZW50c0xvYWRpbmcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJldmlld0NvbW1lbnRUaHJlYWRzLm1hcCgoe2NvbW1lbnRzLCB0aHJlYWR9KSA9PiB7XG4gICAgICBjb25zdCB7cGF0aCwgcG9zaXRpb259ID0gY29tbWVudHNbMF07XG4gICAgICBpZiAoIXRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0UGF0Y2hGb3JQYXRoKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByb3cgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEJ1ZmZlclJvd0ZvckRpZmZQb3NpdGlvbihwYXRoLCBwb3NpdGlvbik7XG4gICAgICBpZiAocm93ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1Jvd1NlbGVjdGVkID0gdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MuaGFzKHJvdyk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyXG4gICAgICAgICAga2V5PXtgZ2l0aHViLWNvbW1lbnQtZ3V0dGVyLWRlY29yYXRpb24tJHt0aHJlYWQuaWR9YH1cbiAgICAgICAgICBjb21tZW50Um93PXtyb3d9XG4gICAgICAgICAgdGhyZWFkSWQ9e3RocmVhZC5pZH1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIGVuZHBvaW50PXt0aGlzLnByb3BzLmVuZHBvaW50fVxuICAgICAgICAgIG93bmVyPXt0aGlzLnByb3BzLm93bmVyfVxuICAgICAgICAgIHJlcG89e3RoaXMucHJvcHMucmVwb31cbiAgICAgICAgICBudW1iZXI9e3RoaXMucHJvcHMubnVtYmVyfVxuICAgICAgICAgIHdvcmtkaXI9e3RoaXMucHJvcHMud29ya2RpclBhdGh9XG4gICAgICAgICAgZXh0cmFDbGFzc2VzPXtpc1Jvd1NlbGVjdGVkID8gWydnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1zZWxlY3RlZCddIDogW119XG4gICAgICAgICAgcGFyZW50PXt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMgPSAoZmlsZVBhdGNoLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGlzQ29sbGFwc2VkID0gIWZpbGVQYXRjaC5nZXRSZW5kZXJTdGF0dXMoKS5pc1Zpc2libGUoKTtcbiAgICBjb25zdCBpc0VtcHR5ID0gZmlsZVBhdGNoLmdldE1hcmtlcigpLmdldFJhbmdlKCkuaXNFbXB0eSgpO1xuICAgIGNvbnN0IGlzRXhwYW5kYWJsZSA9IGZpbGVQYXRjaC5nZXRSZW5kZXJTdGF0dXMoKS5pc0V4cGFuZGFibGUoKTtcbiAgICBjb25zdCBpc1VuYXZhaWxhYmxlID0gaXNDb2xsYXBzZWQgJiYgIWlzRXhwYW5kYWJsZTtcbiAgICBjb25zdCBhdEVuZCA9IGZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCkuc3RhcnQuaXNFcXVhbCh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEJ1ZmZlcigpLmdldEVuZFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gaXNFbXB0eSAmJiBhdEVuZCA/ICdhZnRlcicgOiAnYmVmb3JlJztcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQga2V5PXtmaWxlUGF0Y2guZ2V0UGF0aCgpfT5cbiAgICAgICAgPE1hcmtlciBpbnZhbGlkYXRlPVwibmV2ZXJcIiBidWZmZXJSYW5nZT17ZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKX0+XG4gICAgICAgICAgPERlY29yYXRpb24gdHlwZT1cImJsb2NrXCIgcG9zaXRpb249e3Bvc2l0aW9ufSBvcmRlcj17aW5kZXh9IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuICAgICAgICAgICAgPEZpbGVQYXRjaEhlYWRlclZpZXdcbiAgICAgICAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgICAgICAgIHJlbFBhdGg9e2ZpbGVQYXRjaC5nZXRQYXRoKCl9XG4gICAgICAgICAgICAgIG5ld1BhdGg9e2ZpbGVQYXRjaC5nZXRTdGF0dXMoKSA9PT0gJ3JlbmFtZWQnID8gZmlsZVBhdGNoLmdldE5ld1BhdGgoKSA6IG51bGx9XG4gICAgICAgICAgICAgIHN0YWdpbmdTdGF0dXM9e3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c31cbiAgICAgICAgICAgICAgaXNQYXJ0aWFsbHlTdGFnZWQ9e3RoaXMucHJvcHMuaXNQYXJ0aWFsbHlTdGFnZWR9XG4gICAgICAgICAgICAgIGhhc1VuZG9IaXN0b3J5PXt0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5fVxuICAgICAgICAgICAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zPXt0aGlzLnByb3BzLmhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnN9XG5cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG5cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXsoKSA9PiB0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24oZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgZGl2ZUludG9NaXJyb3JQYXRjaD17KCkgPT4gdGhpcy5wcm9wcy5kaXZlSW50b01pcnJvclBhdGNoKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgIG9wZW5GaWxlPXsoKSA9PiB0aGlzLmRpZE9wZW5GaWxlKHtzZWxlY3RlZEZpbGVQYXRjaDogZmlsZVBhdGNofSl9XG4gICAgICAgICAgICAgIHRvZ2dsZUZpbGU9eygpID0+IHRoaXMucHJvcHMudG9nZ2xlRmlsZShmaWxlUGF0Y2gpfVxuXG4gICAgICAgICAgICAgIGlzQ29sbGFwc2VkPXtpc0NvbGxhcHNlZH1cbiAgICAgICAgICAgICAgdHJpZ2dlckNvbGxhcHNlPXsoKSA9PiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmNvbGxhcHNlRmlsZVBhdGNoKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgIHRyaWdnZXJFeHBhbmQ9eygpID0+IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZXhwYW5kRmlsZVBhdGNoKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgeyFpc0NvbGxhcHNlZCAmJiB0aGlzLnJlbmRlclN5bWxpbmtDaGFuZ2VNZXRhKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIHRoaXMucmVuZGVyRXhlY3V0YWJsZU1vZGVDaGFuZ2VNZXRhKGZpbGVQYXRjaCl9XG4gICAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgICA8L01hcmtlcj5cblxuICAgICAgICB7aXNFeHBhbmRhYmxlICYmIHRoaXMucmVuZGVyRGlmZkdhdGUoZmlsZVBhdGNoLCBwb3NpdGlvbiwgaW5kZXgpfVxuICAgICAgICB7aXNVbmF2YWlsYWJsZSAmJiB0aGlzLnJlbmRlckRpZmZVbmF2YWlsYWJsZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBpbmRleCl9XG5cbiAgICAgICAge3RoaXMucmVuZGVySHVua0hlYWRlcnMoZmlsZVBhdGNoLCBpbmRleCl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEaWZmR2F0ZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBvcmRlck9mZnNldCkge1xuICAgIGNvbnN0IHNob3dEaWZmID0gKCkgPT4ge1xuICAgICAgYWRkRXZlbnQoJ2V4cGFuZC1maWxlLXBhdGNoJywge2NvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5leHBhbmRGaWxlUGF0Y2goZmlsZVBhdGNoKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyIGludmFsaWRhdGU9XCJuZXZlclwiIGJ1ZmZlclJhbmdlPXtmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpfT5cbiAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICB0eXBlPVwiYmxvY2tcIlxuICAgICAgICAgIG9yZGVyPXtvcmRlck9mZnNldCArIDAuMX1cbiAgICAgICAgICBwb3NpdGlvbj17cG9zaXRpb259XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udHJvbEJsb2NrXCI+XG5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXNzYWdlIGljb24gaWNvbi1pbmZvXCI+XG4gICAgICAgICAgICBMYXJnZSBkaWZmcyBhcmUgY29sbGFwc2VkIGJ5IGRlZmF1bHQgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctc2hvd0RpZmZCdXR0b25cIiBvbkNsaWNrPXtzaG93RGlmZn0+IExvYWQgRGlmZjwvYnV0dG9uPlxuICAgICAgICAgIDwvcD5cblxuICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICA8L01hcmtlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGlmZlVuYXZhaWxhYmxlKGZpbGVQYXRjaCwgcG9zaXRpb24sIG9yZGVyT2Zmc2V0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXIgaW52YWxpZGF0ZT1cIm5ldmVyXCIgYnVmZmVyUmFuZ2U9e2ZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCl9PlxuICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgIHR5cGU9XCJibG9ja1wiXG4gICAgICAgICAgb3JkZXI9e29yZGVyT2Zmc2V0ICsgMC4xfVxuICAgICAgICAgIHBvc2l0aW9uPXtwb3NpdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cblxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1lc3NhZ2UgaWNvbiBpY29uLXdhcm5pbmdcIj5cbiAgICAgICAgICAgIFRoaXMgZGlmZiBpcyB0b28gbGFyZ2UgdG8gbG9hZCBhdCBhbGwuIFVzZSB0aGUgY29tbWFuZC1saW5lIHRvIHZpZXcgaXQuXG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgIDwvTWFya2VyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJFeGVjdXRhYmxlTW9kZUNoYW5nZU1ldGEoZmlsZVBhdGNoKSB7XG4gICAgaWYgKCFmaWxlUGF0Y2guZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkTW9kZSA9IGZpbGVQYXRjaC5nZXRPbGRNb2RlKCk7XG4gICAgY29uc3QgbmV3TW9kZSA9IGZpbGVQYXRjaC5nZXROZXdNb2RlKCk7XG5cbiAgICBjb25zdCBhdHRycyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgPyB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtZG93bicsXG4gICAgICAgIGFjdGlvblRleHQ6ICdTdGFnZSBNb2RlIENoYW5nZScsXG4gICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS11cCcsXG4gICAgICAgIGFjdGlvblRleHQ6ICdVbnN0YWdlIE1vZGUgQ2hhbmdlJyxcbiAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZpbGVQYXRjaE1ldGFWaWV3XG4gICAgICAgIHRpdGxlPVwiTW9kZSBjaGFuZ2VcIlxuICAgICAgICBhY3Rpb25JY29uPXthdHRycy5hY3Rpb25JY29ufVxuICAgICAgICBhY3Rpb25UZXh0PXthdHRycy5hY3Rpb25UZXh0fVxuICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgYWN0aW9uPXsoKSA9PiB0aGlzLnByb3BzLnRvZ2dsZU1vZGVDaGFuZ2UoZmlsZVBhdGNoKX0+XG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBGaWxlIGNoYW5nZWQgbW9kZVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1yZW1vdmVkXCI+XG4gICAgICAgICAgICBmcm9tIHtleGVjdXRhYmxlVGV4dFtvbGRNb2RlXX0gPGNvZGU+e29sZE1vZGV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZiBnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tYWRkZWRcIj5cbiAgICAgICAgICAgIHRvIHtleGVjdXRhYmxlVGV4dFtuZXdNb2RlXX0gPGNvZGU+e25ld01vZGV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgIDwvRmlsZVBhdGNoTWV0YVZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclN5bWxpbmtDaGFuZ2VNZXRhKGZpbGVQYXRjaCkge1xuICAgIGlmICghZmlsZVBhdGNoLmhhc1N5bWxpbmsoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGRldGFpbCA9IDxkaXYgLz47XG4gICAgbGV0IHRpdGxlID0gJyc7XG4gICAgY29uc3Qgb2xkU3ltbGluayA9IGZpbGVQYXRjaC5nZXRPbGRTeW1saW5rKCk7XG4gICAgY29uc3QgbmV3U3ltbGluayA9IGZpbGVQYXRjaC5nZXROZXdTeW1saW5rKCk7XG4gICAgaWYgKG9sZFN5bWxpbmsgJiYgbmV3U3ltbGluaykge1xuICAgICAgZGV0YWlsID0gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgU3ltbGluayBjaGFuZ2VkXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZicsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWZ1bGxXaWR0aCcsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLXJlbW92ZWQnLFxuICAgICAgICAgICl9PlxuICAgICAgICAgICAgZnJvbSA8Y29kZT57b2xkU3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y3goXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYnLFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1mdWxsV2lkdGgnLFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1hZGRlZCcsXG4gICAgICAgICAgKX0+XG4gICAgICAgICAgICB0byA8Y29kZT57bmV3U3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPi5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgICB0aXRsZSA9ICdTeW1saW5rIGNoYW5nZWQnO1xuICAgIH0gZWxzZSBpZiAob2xkU3ltbGluayAmJiAhbmV3U3ltbGluaykge1xuICAgICAgZGV0YWlsID0gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgU3ltbGlua1xuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1yZW1vdmVkXCI+XG4gICAgICAgICAgICB0byA8Y29kZT57b2xkU3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIGRlbGV0ZWQuXG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgICAgdGl0bGUgPSAnU3ltbGluayBkZWxldGVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgZGV0YWlsID0gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgU3ltbGlua1xuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1hZGRlZFwiPlxuICAgICAgICAgICAgdG8gPGNvZGU+e25ld1N5bWxpbmt9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICBjcmVhdGVkLlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICAgIHRpdGxlID0gJ1N5bWxpbmsgY3JlYXRlZCc7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cnMgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCdcbiAgICAgID8ge1xuICAgICAgICBhY3Rpb25JY29uOiAnaWNvbi1tb3ZlLWRvd24nLFxuICAgICAgICBhY3Rpb25UZXh0OiAnU3RhZ2UgU3ltbGluayBDaGFuZ2UnLFxuICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtdXAnLFxuICAgICAgICBhY3Rpb25UZXh0OiAnVW5zdGFnZSBTeW1saW5rIENoYW5nZScsXG4gICAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGaWxlUGF0Y2hNZXRhVmlld1xuICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgIGFjdGlvbkljb249e2F0dHJzLmFjdGlvbkljb259XG4gICAgICAgIGFjdGlvblRleHQ9e2F0dHJzLmFjdGlvblRleHR9XG4gICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICBhY3Rpb249eygpID0+IHRoaXMucHJvcHMudG9nZ2xlU3ltbGlua0NoYW5nZShmaWxlUGF0Y2gpfT5cbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIHtkZXRhaWx9XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICA8L0ZpbGVQYXRjaE1ldGFWaWV3PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIdW5rSGVhZGVycyhmaWxlUGF0Y2gsIG9yZGVyT2Zmc2V0KSB7XG4gICAgY29uc3QgdG9nZ2xlVmVyYiA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJyA/ICdTdGFnZScgOiAnVW5zdGFnZSc7XG4gICAgY29uc3Qgc2VsZWN0ZWRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICBBcnJheS5mcm9tKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLCByb3cgPT4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQocm93KSksXG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxNYXJrZXJMYXllcj5cbiAgICAgICAgICB7ZmlsZVBhdGNoLmdldEh1bmtzKCkubWFwKChodW5rLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGFpbnNTZWxlY3Rpb24gPSB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdsaW5lJyAmJiBzZWxlY3RlZEh1bmtzLmhhcyhodW5rKTtcbiAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSAodGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlID09PSAnaHVuaycpICYmIHNlbGVjdGVkSHVua3MuaGFzKGh1bmspO1xuXG4gICAgICAgICAgICBsZXQgYnV0dG9uU3VmZml4ID0gJyc7XG4gICAgICAgICAgICBpZiAoY29udGFpbnNTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdTZWxlY3RlZCBMaW5lJztcbiAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLnNpemUgPiAxKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdzJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdIdW5rJztcbiAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSHVua3Muc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ3MnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvZ2dsZVNlbGVjdGlvbkxhYmVsID0gYCR7dG9nZ2xlVmVyYn0gJHtidXR0b25TdWZmaXh9YDtcbiAgICAgICAgICAgIGNvbnN0IGRpc2NhcmRTZWxlY3Rpb25MYWJlbCA9IGBEaXNjYXJkICR7YnV0dG9uU3VmZml4fWA7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSBodW5rLmdldFJhbmdlKCkuc3RhcnQ7XG4gICAgICAgICAgICBjb25zdCBzdGFydFJhbmdlID0gbmV3IFJhbmdlKHN0YXJ0UG9pbnQsIHN0YXJ0UG9pbnQpO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8TWFya2VyIGtleT17YGh1bmtIZWFkZXItJHtpbmRleH1gfSBidWZmZXJSYW5nZT17c3RhcnRSYW5nZX0gaW52YWxpZGF0ZT1cIm5ldmVyXCI+XG4gICAgICAgICAgICAgICAgPERlY29yYXRpb24gdHlwZT1cImJsb2NrXCIgb3JkZXI9e29yZGVyT2Zmc2V0ICsgMC4yfSBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgIDxIdW5rSGVhZGVyVmlld1xuICAgICAgICAgICAgICAgICAgICByZWZUYXJnZXQ9e3RoaXMucmVmRWRpdG9yRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgICAgaHVuaz17aHVua31cbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgc3RhZ2luZ1N0YXR1cz17dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25Nb2RlPVwibGluZVwiXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNlbGVjdGlvbkxhYmVsPXt0b2dnbGVTZWxlY3Rpb25MYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgZGlzY2FyZFNlbGVjdGlvbkxhYmVsPXtkaXNjYXJkU2VsZWN0aW9uTGFiZWx9XG5cbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cblxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTZWxlY3Rpb249eygpID0+IHRoaXMudG9nZ2xlSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbil9XG4gICAgICAgICAgICAgICAgICAgIGRpc2NhcmRTZWxlY3Rpb249eygpID0+IHRoaXMuZGlzY2FyZEh1bmtTZWxlY3Rpb24oaHVuaywgY29udGFpbnNTZWxlY3Rpb24pfVxuICAgICAgICAgICAgICAgICAgICBtb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25IZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICAgICAgICAgIDwvTWFya2VyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9NYXJrZXJMYXllcj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxpbmVEZWNvcmF0aW9ucyhyYW5nZXMsIGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbiwgcmVmSG9sZGVyfSkge1xuICAgIGlmIChyYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBob2xkZXIgPSByZWZIb2xkZXIgfHwgbmV3IFJlZkhvbGRlcigpO1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyTGF5ZXIgaGFuZGxlTGF5ZXI9e2hvbGRlci5zZXR0ZXJ9PlxuICAgICAgICB7cmFuZ2VzLm1hcCgocmFuZ2UsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxNYXJrZXJcbiAgICAgICAgICAgICAga2V5PXtgbGluZS0ke2xpbmVDbGFzc30tJHtpbmRleH1gfVxuICAgICAgICAgICAgICBidWZmZXJSYW5nZT17cmFuZ2V9XG4gICAgICAgICAgICAgIGludmFsaWRhdGU9XCJuZXZlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9ucyhsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KX1cbiAgICAgIDwvTWFya2VyTGF5ZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRlY29yYXRpb25zT25MYXllcihsYXllciwgbGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSkge1xuICAgIGlmIChsYXllci5nZXRNYXJrZXJDb3VudCgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlckxheWVyIGV4dGVybmFsPXtsYXllcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zKGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbn0pfVxuICAgICAgPC9NYXJrZXJMYXllcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVjb3JhdGlvbnMobGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIHtsaW5lICYmIChcbiAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgdHlwZT1cImxpbmVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICB7Z3V0dGVyICYmIChcbiAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgICBndXR0ZXJOYW1lPVwib2xkLWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgICBndXR0ZXJOYW1lPVwibmV3LWxpbmUtbnVtYmVyc1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgICB0eXBlPVwiZ3V0dGVyXCJcbiAgICAgICAgICAgICAgZ3V0dGVyTmFtZT1cImdpdGh1Yi1jb21tZW50LWljb25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItZWRpdG9yQ29tbWVudEd1dHRlckljb24gZW1wdHkgJHtsaW5lQ2xhc3N9YH1cbiAgICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICl9XG4gICAgICAgIHtpY29uICYmIChcbiAgICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICAgIGd1dHRlck5hbWU9XCJkaWZmLWljb25zXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRGaWxlUGF0Y2hlcyA9IEFycmF5LmZyb20odGhpcy5nZXRTZWxlY3RlZEZpbGVQYXRjaGVzKCkpO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDaGFuZ2VkRmlsZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmQoc2VsZWN0ZWRGaWxlUGF0Y2hlc1swXSwge2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2NvcmU6dW5kbyd9fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbiA9IGZpbGVQYXRjaCA9PiB7XG4gICAgdGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmQoZmlsZVBhdGNoLCB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSk7XG4gIH1cblxuICBkaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFJvd3MoXG4gICAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93cyxcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSxcbiAgICAgIHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6ZGlzY2FyZC1zZWxlY3RlZC1saW5lcyd9fSxcbiAgICApO1xuICB9XG5cbiAgdG9nZ2xlSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbikge1xuICAgIGlmIChjb250YWluc1NlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlUm93cyhcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSxcbiAgICAgICAge2V2ZW50U291cmNlOiAnYnV0dG9uJ30sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjaGFuZ2VSb3dzID0gbmV3IFNldChcbiAgICAgICAgaHVuay5nZXRDaGFuZ2VzKClcbiAgICAgICAgICAucmVkdWNlKChyb3dzLCBjaGFuZ2UpID0+IHtcbiAgICAgICAgICAgIHJvd3MucHVzaCguLi5jaGFuZ2UuZ2V0QnVmZmVyUm93cygpKTtcbiAgICAgICAgICAgIHJldHVybiByb3dzO1xuICAgICAgICAgIH0sIFtdKSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVSb3dzKFxuICAgICAgICBjaGFuZ2VSb3dzLFxuICAgICAgICAnaHVuaycsXG4gICAgICAgIHtldmVudFNvdXJjZTogJ2J1dHRvbid9LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBkaXNjYXJkSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbikge1xuICAgIGlmIChjb250YWluc1NlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFJvd3MoXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLFxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUsXG4gICAgICAgIHtldmVudFNvdXJjZTogJ2J1dHRvbid9LFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2hhbmdlUm93cyA9IG5ldyBTZXQoXG4gICAgICAgIGh1bmsuZ2V0Q2hhbmdlcygpXG4gICAgICAgICAgLnJlZHVjZSgocm93cywgY2hhbmdlKSA9PiB7XG4gICAgICAgICAgICByb3dzLnB1c2goLi4uY2hhbmdlLmdldEJ1ZmZlclJvd3MoKSk7XG4gICAgICAgICAgICByZXR1cm4gcm93cztcbiAgICAgICAgICB9LCBbXSksXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFJvd3MoY2hhbmdlUm93cywgJ2h1bmsnLCB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSk7XG4gICAgfVxuICB9XG5cbiAgZGlkTW91c2VEb3duT25IZWFkZXIoZXZlbnQsIGh1bmspIHtcbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQsIGh1bmsuZ2V0UmFuZ2UoKSk7XG4gIH1cblxuICBkaWRNb3VzZURvd25PbkxpbmVOdW1iZXIoZXZlbnQpIHtcbiAgICBjb25zdCBsaW5lID0gZXZlbnQuYnVmZmVyUm93O1xuICAgIGlmIChsaW5lID09PSB1bmRlZmluZWQgfHwgaXNOYU4obGluZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgIGlmICh0aGlzLmhhbmRsZVNlbGVjdGlvbkV2ZW50KGV2ZW50LmRvbUV2ZW50LCBbW2xpbmUsIDBdLCBbbGluZSwgSW5maW5pdHldXSkpIHtcbiAgICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBkaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXIoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGluZSA9IGV2ZW50LmJ1ZmZlclJvdztcbiAgICBpZiAodGhpcy5sYXN0TW91c2VNb3ZlTGluZSA9PT0gbGluZSB8fCBsaW5lID09PSB1bmRlZmluZWQgfHwgaXNOYU4obGluZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sYXN0TW91c2VNb3ZlTGluZSA9IGxpbmU7XG5cbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQuZG9tRXZlbnQsIFtbbGluZSwgMF0sIFtsaW5lLCBJbmZpbml0eV1dLCB7YWRkOiB0cnVlfSk7XG4gIH1cblxuICBkaWRNb3VzZVVwKCkge1xuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVTZWxlY3Rpb25FdmVudChldmVudCwgcmFuZ2VMaWtlLCBvcHRzKSB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGlzV2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgIWlzV2luZG93cykge1xuICAgICAgLy8gQWxsb3cgdGhlIGNvbnRleHQgbWVudSB0byBvcGVuLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBhZGQ6IGZhbHNlLFxuICAgICAgLi4ub3B0cyxcbiAgICB9O1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSB0YXJnZXQgc2VsZWN0aW9uIHJhbmdlXG4gICAgY29uc3QgY29udmVydGVkID0gUmFuZ2UuZnJvbU9iamVjdChyYW5nZUxpa2UpO1xuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3IuY2xpcEJ1ZmZlclJhbmdlKGNvbnZlcnRlZCkpLmdldE9yKGNvbnZlcnRlZCk7XG5cbiAgICBpZiAoZXZlbnQubWV0YUtleSB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoZXZlbnQuY3RybEtleSAmJiBpc1dpbmRvd3MpKSB7XG4gICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgbGV0IGludGVyc2VjdHMgPSBmYWxzZTtcbiAgICAgICAgbGV0IHdpdGhvdXQgPSBudWxsO1xuXG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0aW9uIG9mIGVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0aW9uLmludGVyc2VjdHNCdWZmZXJSYW5nZShyYW5nZSkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSByYW5nZSBmcm9tIHRoaXMgc2VsZWN0aW9uIGJ5IHRydW5jYXRpbmcgaXQgdG8gdGhlIFwibmVhciBlZGdlXCIgb2YgdGhlIHJhbmdlIGFuZCBjcmVhdGluZyBhXG4gICAgICAgICAgICAvLyBuZXcgc2VsZWN0aW9uIGZyb20gdGhlIFwiZmFyIGVkZ2VcIiB0byB0aGUgcHJldmlvdXMgZW5kLiBPbWl0IGVpdGhlciBzaWRlIGlmIGl0IGlzIGVtcHR5LlxuICAgICAgICAgICAgaW50ZXJzZWN0cyA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdSYW5nZXMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKCFyYW5nZS5zdGFydC5pc0VxdWFsKHNlbGVjdGlvblJhbmdlLnN0YXJ0KSkge1xuICAgICAgICAgICAgICAvLyBJbmNsdWRlIHRoZSBiaXQgZnJvbSB0aGUgc2VsZWN0aW9uJ3MgcHJldmlvdXMgc3RhcnQgdG8gdGhlIHJhbmdlJ3Mgc3RhcnQuXG4gICAgICAgICAgICAgIGxldCBudWRnZWQgPSByYW5nZS5zdGFydDtcbiAgICAgICAgICAgICAgaWYgKHJhbmdlLnN0YXJ0LmNvbHVtbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDb2x1bW4gPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhyYW5nZS5zdGFydC5yb3cgLSAxKTtcbiAgICAgICAgICAgICAgICBudWRnZWQgPSBbcmFuZ2Uuc3RhcnQucm93IC0gMSwgbGFzdENvbHVtbl07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBuZXdSYW5nZXMucHVzaChbc2VsZWN0aW9uUmFuZ2Uuc3RhcnQsIG51ZGdlZF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJhbmdlLmVuZC5pc0VxdWFsKHNlbGVjdGlvblJhbmdlLmVuZCkpIHtcbiAgICAgICAgICAgICAgLy8gSW5jbHVkZSB0aGUgYml0IGZyb20gdGhlIHJhbmdlJ3MgZW5kIHRvIHRoZSBzZWxlY3Rpb24ncyBlbmQuXG4gICAgICAgICAgICAgIGxldCBudWRnZWQgPSByYW5nZS5lbmQ7XG4gICAgICAgICAgICAgIGNvbnN0IGxhc3RDb2x1bW4gPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhyYW5nZS5lbmQucm93KTtcbiAgICAgICAgICAgICAgaWYgKHJhbmdlLmVuZC5jb2x1bW4gPT09IGxhc3RDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICBudWRnZWQgPSBbcmFuZ2UuZW5kLnJvdyArIDEsIDBdO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbmV3UmFuZ2VzLnB1c2goW251ZGdlZCwgc2VsZWN0aW9uUmFuZ2UuZW5kXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXdSYW5nZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UobmV3UmFuZ2VzWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBuZXdSYW5nZSBvZiBuZXdSYW5nZXMuc2xpY2UoMSkpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UobmV3UmFuZ2UsIHtyZXZlcnNlZDogc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKX0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3aXRob3V0ID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aXRob3V0ICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRSYW5nZXMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgICAgICAuZmlsdGVyKGVhY2ggPT4gZWFjaCAhPT0gd2l0aG91dClcbiAgICAgICAgICAgIC5tYXAoZWFjaCA9PiBlYWNoLmdldEJ1ZmZlclJhbmdlKCkpO1xuICAgICAgICAgIGlmIChyZXBsYWNlbWVudFJhbmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMocmVwbGFjZW1lbnRSYW5nZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW50ZXJzZWN0cykge1xuICAgICAgICAgIC8vIEFkZCB0aGlzIHJhbmdlIGFzIGEgbmV3LCBkaXN0aW5jdCBzZWxlY3Rpb24uXG4gICAgICAgICAgZWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKHJhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmFkZCB8fCBldmVudC5zaGlmdEtleSkge1xuICAgICAgLy8gRXh0ZW5kIHRoZSBleGlzdGluZyBzZWxlY3Rpb24gdG8gZW5jb21wYXNzIHRoaXMgcmFuZ2UuXG4gICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgY29uc3QgbGFzdFNlbGVjdGlvbiA9IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCk7XG4gICAgICAgIGNvbnN0IGxhc3RTZWxlY3Rpb25SYW5nZSA9IGxhc3RTZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKTtcblxuICAgICAgICAvLyBZb3UgYXJlIG5vdyBlbnRlcmluZyB0aGUgd2FsbCBvZiB0ZXJuZXJ5IG9wZXJhdG9ycy4gVGhpcyBpcyB5b3VyIGxhc3QgZXhpdCBiZWZvcmUgdGhlIHRvbGxib290aFxuICAgICAgICBjb25zdCBpc0JlZm9yZSA9IHJhbmdlLnN0YXJ0LmlzTGVzc1RoYW4obGFzdFNlbGVjdGlvblJhbmdlLnN0YXJ0KTtcbiAgICAgICAgY29uc3QgZmFyRWRnZSA9IGlzQmVmb3JlID8gcmFuZ2Uuc3RhcnQgOiByYW5nZS5lbmQ7XG4gICAgICAgIGNvbnN0IG5ld1JhbmdlID0gaXNCZWZvcmUgPyBbZmFyRWRnZSwgbGFzdFNlbGVjdGlvblJhbmdlLmVuZF0gOiBbbGFzdFNlbGVjdGlvblJhbmdlLnN0YXJ0LCBmYXJFZGdlXTtcblxuICAgICAgICBsYXN0U2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG5ld1JhbmdlLCB7cmV2ZXJzZWQ6IGlzQmVmb3JlfSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UocmFuZ2UpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRpZENvbmZpcm0oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlUm93cyh0aGlzLnByb3BzLnNlbGVjdGVkUm93cywgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlKTtcbiAgfVxuXG4gIGRpZFRvZ2dsZVNlbGVjdGlvbk1vZGUoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRIdW5rcyA9IHRoaXMuZ2V0U2VsZWN0ZWRIdW5rcygpO1xuICAgIHRoaXMud2l0aFNlbGVjdGlvbk1vZGUoe1xuICAgICAgbGluZTogKCkgPT4ge1xuICAgICAgICBjb25zdCBodW5rUmFuZ2VzID0gc2VsZWN0ZWRIdW5rcy5tYXAoaHVuayA9PiBodW5rLmdldFJhbmdlKCkpO1xuICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhodW5rUmFuZ2VzKSk7XG4gICAgICB9LFxuICAgICAgaHVuazogKCkgPT4ge1xuICAgICAgICBsZXQgZmlyc3RDaGFuZ2VSb3cgPSBJbmZpbml0eTtcbiAgICAgICAgZm9yIChjb25zdCBodW5rIG9mIHNlbGVjdGVkSHVua3MpIHtcbiAgICAgICAgICBjb25zdCBbZmlyc3RDaGFuZ2VdID0gaHVuay5nZXRDaGFuZ2VzKCk7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoZmlyc3RDaGFuZ2UgJiYgKCFmaXJzdENoYW5nZVJvdyB8fCBmaXJzdENoYW5nZS5nZXRTdGFydEJ1ZmZlclJvdygpIDwgZmlyc3RDaGFuZ2VSb3cpKSB7XG4gICAgICAgICAgICBmaXJzdENoYW5nZVJvdyA9IGZpcnN0Q2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdsaW5lJztcbiAgICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKFtbW2ZpcnN0Q2hhbmdlUm93LCAwXSwgW2ZpcnN0Q2hhbmdlUm93LCBJbmZpbml0eV1dXSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGRpZFRvZ2dsZU1vZGVDaGFuZ2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLmdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSlcbiAgICAgICAgLmZpbHRlcihmcCA9PiBmcC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKVxuICAgICAgICAubWFwKHRoaXMucHJvcHMudG9nZ2xlTW9kZUNoYW5nZSksXG4gICAgKTtcbiAgfVxuXG4gIGRpZFRvZ2dsZVN5bWxpbmtDaGFuZ2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLmdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSlcbiAgICAgICAgLmZpbHRlcihmcCA9PiBmcC5oYXNUeXBlY2hhbmdlKCkpXG4gICAgICAgIC5tYXAodGhpcy5wcm9wcy50b2dnbGVTeW1saW5rQ2hhbmdlKSxcbiAgICApO1xuICB9XG5cbiAgc2VsZWN0TmV4dEh1bmsoKSB7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBuZXh0SHVua3MgPSBuZXcgU2V0KFxuICAgICAgICB0aGlzLndpdGhTZWxlY3RlZEh1bmtzKGh1bmsgPT4gdGhpcy5nZXRIdW5rQWZ0ZXIoaHVuaykgfHwgaHVuayksXG4gICAgICApO1xuICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IEFycmF5LmZyb20obmV4dEh1bmtzLCBodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5leHRSYW5nZXMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RQcmV2aW91c0h1bmsoKSB7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBuZXh0SHVua3MgPSBuZXcgU2V0KFxuICAgICAgICB0aGlzLndpdGhTZWxlY3RlZEh1bmtzKGh1bmsgPT4gdGhpcy5nZXRIdW5rQmVmb3JlKGh1bmspIHx8IGh1bmspLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5leHRSYW5nZXMgPSBBcnJheS5mcm9tKG5leHRIdW5rcywgaHVuayA9PiBodW5rLmdldFJhbmdlKCkpO1xuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhuZXh0UmFuZ2VzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgZGlkT3BlbkZpbGUoe3NlbGVjdGVkRmlsZVBhdGNofSkge1xuICAgIGNvbnN0IGN1cnNvcnNCeUZpbGVQYXRjaCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcGxhY2VkUm93cyA9IG5ldyBTZXQoKTtcblxuICAgICAgZm9yIChjb25zdCBjdXJzb3Igb2YgZWRpdG9yLmdldEN1cnNvcnMoKSkge1xuICAgICAgICBjb25zdCBjdXJzb3JSb3cgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKS5yb3c7XG4gICAgICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChjdXJzb3JSb3cpO1xuICAgICAgICBjb25zdCBmaWxlUGF0Y2ggPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaEF0KGN1cnNvclJvdyk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGlmICghaHVuaykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1JvdyA9IGh1bmsuZ2V0TmV3Um93QXQoY3Vyc29yUm93KTtcbiAgICAgICAgbGV0IG5ld0NvbHVtbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLmNvbHVtbjtcbiAgICAgICAgaWYgKG5ld1JvdyA9PT0gbnVsbCkge1xuICAgICAgICAgIGxldCBuZWFyZXN0Um93ID0gaHVuay5nZXROZXdTdGFydFJvdygpO1xuICAgICAgICAgIGZvciAoY29uc3QgcmVnaW9uIG9mIGh1bmsuZ2V0UmVnaW9ucygpKSB7XG4gICAgICAgICAgICBpZiAoIXJlZ2lvbi5pbmNsdWRlc0J1ZmZlclJvdyhjdXJzb3JSb3cpKSB7XG4gICAgICAgICAgICAgIHJlZ2lvbi53aGVuKHtcbiAgICAgICAgICAgICAgICB1bmNoYW5nZWQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIG5lYXJlc3RSb3cgKz0gcmVnaW9uLmJ1ZmZlclJvd0NvdW50KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZGRpdGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbmVhcmVzdFJvdyArPSByZWdpb24uYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghcGxhY2VkUm93cy5oYXMobmVhcmVzdFJvdykpIHtcbiAgICAgICAgICAgIG5ld1JvdyA9IG5lYXJlc3RSb3c7XG4gICAgICAgICAgICBuZXdDb2x1bW4gPSAwO1xuICAgICAgICAgICAgcGxhY2VkUm93cy5hZGQobmVhcmVzdFJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld1JvdyAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFdoeSBpcyB0aGlzIG5lZWRlZD8gSSBfdGhpbmtfIGV2ZXJ5dGhpbmcgaXMgaW4gdGVybXMgb2YgYnVmZmVyIHBvc2l0aW9uXG4gICAgICAgICAgLy8gc28gdGhlcmUgc2hvdWxkbid0IGJlIGFuIG9mZi1ieS1vbmUgaXNzdWVcbiAgICAgICAgICBuZXdSb3cgLT0gMTtcbiAgICAgICAgICBjb25zdCBjdXJzb3JzID0gY3Vyc29yc0J5RmlsZVBhdGNoLmdldChmaWxlUGF0Y2gpO1xuICAgICAgICAgIGlmICghY3Vyc29ycykge1xuICAgICAgICAgICAgY3Vyc29yc0J5RmlsZVBhdGNoLnNldChmaWxlUGF0Y2gsIFtbbmV3Um93LCBuZXdDb2x1bW5dXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnNvcnMucHVzaChbbmV3Um93LCBuZXdDb2x1bW5dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmaWxlUGF0Y2hlc1dpdGhDdXJzb3JzID0gbmV3IFNldChjdXJzb3JzQnlGaWxlUGF0Y2gua2V5cygpKTtcbiAgICBpZiAoc2VsZWN0ZWRGaWxlUGF0Y2ggJiYgIWZpbGVQYXRjaGVzV2l0aEN1cnNvcnMuaGFzKHNlbGVjdGVkRmlsZVBhdGNoKSkge1xuICAgICAgY29uc3QgW2ZpcnN0SHVua10gPSBzZWxlY3RlZEZpbGVQYXRjaC5nZXRIdW5rcygpO1xuICAgICAgY29uc3QgY3Vyc29yUm93ID0gZmlyc3RIdW5rID8gZmlyc3RIdW5rLmdldE5ld1N0YXJ0Um93KCkgLSAxIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gMDtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5GaWxlKHNlbGVjdGVkRmlsZVBhdGNoLCBbW2N1cnNvclJvdywgMF1dLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGVuZGluZyA9IGN1cnNvcnNCeUZpbGVQYXRjaC5zaXplID09PSAxO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKEFycmF5LmZyb20oY3Vyc29yc0J5RmlsZVBhdGNoLCB2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IFtmaWxlUGF0Y2gsIGN1cnNvcnNdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5GaWxlKGZpbGVQYXRjaCwgY3Vyc29ycywgcGVuZGluZyk7XG4gICAgICB9KSk7XG4gICAgfVxuXG4gIH1cblxuICBnZXRTZWxlY3RlZFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBTZXQoXG4gICAgICAgIGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICAubWFwKHNlbGVjdGlvbiA9PiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKSlcbiAgICAgICAgICAucmVkdWNlKChhY2MsIHJhbmdlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByYW5nZS5nZXRSb3dzKCkpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDaGFuZ2VSb3cocm93KSkge1xuICAgICAgICAgICAgICAgIGFjYy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSwgW10pLFxuICAgICAgKTtcbiAgICB9KS5nZXRPcihuZXcgU2V0KCkpO1xuICB9XG5cbiAgZGlkQWRkU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gIH1cblxuICBkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZShldmVudCkge1xuICAgIGlmIChcbiAgICAgICFldmVudCB8fFxuICAgICAgZXZlbnQub2xkQnVmZmVyUmFuZ2Uuc3RhcnQucm93ICE9PSBldmVudC5uZXdCdWZmZXJSYW5nZS5zdGFydC5yb3cgfHxcbiAgICAgIGV2ZW50Lm9sZEJ1ZmZlclJhbmdlLmVuZC5yb3cgIT09IGV2ZW50Lm5ld0J1ZmZlclJhbmdlLmVuZC5yb3dcbiAgICApIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gICAgfVxuICB9XG5cbiAgZGlkRGVzdHJveVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkUm93cygpO1xuICB9XG5cbiAgZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCkge1xuICAgIGlmICh0aGlzLnN1cHByZXNzQ2hhbmdlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRDdXJzb3JSb3dzID0gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICByZXR1cm4gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5yb3cpO1xuICAgIH0pLmdldE9yKFtdKTtcbiAgICBjb25zdCBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5zcGFuc011bHRpcGxlRmlsZXMobmV4dEN1cnNvclJvd3MpO1xuXG4gICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3NDaGFuZ2VkKFxuICAgICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MoKSxcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgfHwgJ2xpbmUnLFxuICAgICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyxcbiAgICApO1xuICB9XG5cbiAgb2xkTGluZU51bWJlckxhYmVsKHtidWZmZXJSb3csIHNvZnRXcmFwcGVkfSkge1xuICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChidWZmZXJSb3cpO1xuICAgIGlmIChodW5rID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZCgnJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkUm93ID0gaHVuay5nZXRPbGRSb3dBdChidWZmZXJSb3cpO1xuICAgIGlmIChzb2Z0V3JhcHBlZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKG9sZFJvdyA9PT0gbnVsbCA/ICcnIDogJ+KAoicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhZChvbGRSb3cpO1xuICB9XG5cbiAgbmV3TGluZU51bWJlckxhYmVsKHtidWZmZXJSb3csIHNvZnRXcmFwcGVkfSkge1xuICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChidWZmZXJSb3cpO1xuICAgIGlmIChodW5rID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZCgnJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Um93ID0gaHVuay5nZXROZXdSb3dBdChidWZmZXJSb3cpO1xuICAgIGlmIChzb2Z0V3JhcHBlZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKG5ld1JvdyA9PT0gbnVsbCA/ICcnIDogJ+KAoicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYWQobmV3Um93KTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIFNldCBvZiB0aGUgSHVua3MgdGhhdCBpbmNsdWRlIGF0IGxlYXN0IG9uZSBlZGl0b3Igc2VsZWN0aW9uLiBUaGUgc2VsZWN0aW9uIG5lZWQgbm90IGNvbnRhaW4gYW4gYWN0dWFsXG4gICAqIGNoYW5nZSByb3cuXG4gICAqL1xuICBnZXRTZWxlY3RlZEh1bmtzKCkge1xuICAgIHJldHVybiB0aGlzLndpdGhTZWxlY3RlZEh1bmtzKGVhY2ggPT4gZWFjaCk7XG4gIH1cblxuICB3aXRoU2VsZWN0ZWRIdW5rcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgICByZXR1cm4gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkucmVkdWNlKChhY2MsIHJhbmdlKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJhbmdlLmdldFJvd3MoKSkge1xuICAgICAgICAgIGNvbnN0IGh1bmsgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChyb3cpO1xuICAgICAgICAgIGlmICghaHVuayB8fCBzZWVuLmhhcyhodW5rKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Vlbi5hZGQoaHVuayk7XG4gICAgICAgICAgYWNjLnB1c2goY2FsbGJhY2soaHVuaykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCBbXSk7XG4gICAgfSkuZ2V0T3IoW10pO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgU2V0IG9mIEZpbGVQYXRjaGVzIHRoYXQgaW5jbHVkZSBhdCBsZWFzdCBvbmUgZWRpdG9yIHNlbGVjdGlvbi4gVGhlIHNlbGVjdGlvbiBuZWVkIG5vdCBjb250YWluIGFuIGFjdHVhbFxuICAgKiBjaGFuZ2Ugcm93LlxuICAgKi9cbiAgZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBwYXRjaGVzID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChjb25zdCByYW5nZSBvZiBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByYW5nZS5nZXRSb3dzKCkpIHtcbiAgICAgICAgICBjb25zdCBwYXRjaCA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoQXQocm93KTtcbiAgICAgICAgICBwYXRjaGVzLmFkZChwYXRjaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXRjaGVzO1xuICAgIH0pLmdldE9yKG5ldyBTZXQoKSk7XG4gIH1cblxuICBnZXRIdW5rQmVmb3JlKGh1bmspIHtcbiAgICBjb25zdCBwcmV2Um93ID0gaHVuay5nZXRSYW5nZSgpLnN0YXJ0LnJvdyAtIDE7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KHByZXZSb3cpO1xuICB9XG5cbiAgZ2V0SHVua0FmdGVyKGh1bmspIHtcbiAgICBjb25zdCBuZXh0Um93ID0gaHVuay5nZXRSYW5nZSgpLmVuZC5yb3cgKyAxO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChuZXh0Um93KTtcbiAgfVxuXG4gIGlzQ2hhbmdlUm93KGJ1ZmZlclJvdykge1xuICAgIGNvbnN0IGNoYW5nZUxheWVycyA9IFt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEFkZGl0aW9uTGF5ZXIoKSwgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXREZWxldGlvbkxheWVyKCldO1xuICAgIHJldHVybiBjaGFuZ2VMYXllcnMuc29tZShsYXllciA9PiBsYXllci5maW5kTWFya2Vycyh7aW50ZXJzZWN0c1JvdzogYnVmZmVyUm93fSkubGVuZ3RoID4gMCk7XG4gIH1cblxuICB3aXRoU2VsZWN0aW9uTW9kZShjYWxsYmFja3MpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrc1t0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGVdO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBzZWxlY3Rpb24gbW9kZTogJHt0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGV9YCk7XG4gICAgfVxuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgcGFkKG51bSkge1xuICAgIGNvbnN0IG1heERpZ2l0cyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0TWF4TGluZU51bWJlcldpZHRoKCk7XG4gICAgaWYgKG51bSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIE5CU1BfQ0hBUkFDVEVSLnJlcGVhdChtYXhEaWdpdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTkJTUF9DSEFSQUNURVIucmVwZWF0KG1heERpZ2l0cyAtIG51bS50b1N0cmluZygpLmxlbmd0aCkgKyBudW0udG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb0ZpbGUgPSAoe2NoYW5nZWRGaWxlUGF0aCwgY2hhbmdlZEZpbGVQb3NpdGlvbn0pID0+IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uKGNoYW5nZWRGaWxlUGF0aCwgY2hhbmdlZEZpbGVQb3NpdGlvbik7XG4gICAgICBpZiAocm93ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBlLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24oe3JvdywgY29sdW1uOiAwfSwge2NlbnRlcjogdHJ1ZX0pO1xuICAgICAgZS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbih7cm93LCBjb2x1bW46IDB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgbWVhc3VyZVBlcmZvcm1hbmNlKGFjdGlvbikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKChhY3Rpb24gPT09ICd1cGRhdGUnIHx8IGFjdGlvbiA9PT0gJ21vdW50JylcbiAgICAgICYmIHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeU5hbWUoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tc3RhcnRgKS5sZW5ndGggPiAwKSB7XG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LWVuZGApO1xuICAgICAgcGVyZm9ybWFuY2UubWVhc3VyZShcbiAgICAgICAgYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gLFxuICAgICAgICBgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1zdGFydGAsXG4gICAgICAgIGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LWVuZGApO1xuICAgICAgY29uc3QgcGVyZiA9IHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeU5hbWUoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gKVswXTtcbiAgICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tc3RhcnRgKTtcbiAgICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tZW5kYCk7XG4gICAgICBwZXJmb3JtYW5jZS5jbGVhck1lYXN1cmVzKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259YCk7XG4gICAgICBhZGRFdmVudChgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWAsIHtcbiAgICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICAgIGZpbGVQYXRjaGVzTGluZUNvdW50czogdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLm1hcChcbiAgICAgICAgICBmcCA9PiBmcC5nZXRQYXRjaCgpLmdldENoYW5nZWRMaW5lQ291bnQoKSxcbiAgICAgICAgKSxcbiAgICAgICAgZHVyYXRpb246IHBlcmYuZHVyYXRpb24sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsVUFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsV0FBQSxHQUFBRCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUksS0FBQSxHQUFBSixPQUFBO0FBQ0EsSUFBQUssU0FBQSxHQUFBTCxPQUFBO0FBRUEsSUFBQU0sUUFBQSxHQUFBTixPQUFBO0FBQ0EsSUFBQU8sY0FBQSxHQUFBUCxPQUFBO0FBQ0EsSUFBQVEsV0FBQSxHQUFBUixPQUFBO0FBQ0EsSUFBQVMsZUFBQSxHQUFBUCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQVUsT0FBQSxHQUFBUixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQVcsWUFBQSxHQUFBVCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQVksV0FBQSxHQUFBVixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQWEsT0FBQSxHQUFBWCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQWMsU0FBQSxHQUFBZix1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWUsb0JBQUEsR0FBQWIsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFnQixrQkFBQSxHQUFBZCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQWlCLGVBQUEsR0FBQWYsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFrQixVQUFBLEdBQUFoQixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQW1CLGdCQUFBLEdBQUFqQixzQkFBQSxDQUFB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