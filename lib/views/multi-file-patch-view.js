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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
    if (event.metaKey || (/* istanbul ignore next */event.ctrlKey && isWindows)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jbGFzc25hbWVzIiwiX2F0b20iLCJfZXZlbnRLaXQiLCJfaGVscGVycyIsIl9yZXBvcnRlclByb3h5IiwiX3Byb3BUeXBlczIiLCJfYXRvbVRleHRFZGl0b3IiLCJfbWFya2VyIiwiX21hcmtlckxheWVyIiwiX2RlY29yYXRpb24iLCJfZ3V0dGVyIiwiX2NvbW1hbmRzIiwiX2ZpbGVQYXRjaEhlYWRlclZpZXciLCJfZmlsZVBhdGNoTWV0YVZpZXciLCJfaHVua0hlYWRlclZpZXciLCJfcmVmSG9sZGVyIiwiX2NoYW5nZWRGaWxlSXRlbSIsIl9jb21taXREZXRhaWxJdGVtIiwiX2NvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlciIsIl9pc3N1ZWlzaERldGFpbEl0ZW0iLCJfZmlsZSIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiX3RvUHJvcGVydHlLZXkiLCJ2YWx1ZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJleGVjdXRhYmxlVGV4dCIsIkZpbGUiLCJtb2RlcyIsIk5PUk1BTCIsIkVYRUNVVEFCTEUiLCJNdWx0aUZpbGVQYXRjaFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJmaWxlUGF0Y2giLCJpbmRleCIsImlzQ29sbGFwc2VkIiwiZ2V0UmVuZGVyU3RhdHVzIiwiaXNWaXNpYmxlIiwiaXNFbXB0eSIsImdldE1hcmtlciIsImdldFJhbmdlIiwiaXNFeHBhbmRhYmxlIiwiaXNVbmF2YWlsYWJsZSIsImF0RW5kIiwiZ2V0U3RhcnRSYW5nZSIsInN0YXJ0IiwiaXNFcXVhbCIsIm11bHRpRmlsZVBhdGNoIiwiZ2V0QnVmZmVyIiwiZ2V0RW5kUG9zaXRpb24iLCJwb3NpdGlvbiIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsImtleSIsImdldFBhdGgiLCJpbnZhbGlkYXRlIiwiYnVmZmVyUmFuZ2UiLCJ0eXBlIiwib3JkZXIiLCJjbGFzc05hbWUiLCJpdGVtVHlwZSIsInJlbFBhdGgiLCJuZXdQYXRoIiwiZ2V0U3RhdHVzIiwiZ2V0TmV3UGF0aCIsInN0YWdpbmdTdGF0dXMiLCJpc1BhcnRpYWxseVN0YWdlZCIsImhhc1VuZG9IaXN0b3J5IiwiaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyIsInRvb2x0aXBzIiwidW5kb0xhc3REaXNjYXJkIiwidW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbiIsImRpdmVJbnRvTWlycm9yUGF0Y2giLCJvcGVuRmlsZSIsImRpZE9wZW5GaWxlIiwic2VsZWN0ZWRGaWxlUGF0Y2giLCJ0b2dnbGVGaWxlIiwidHJpZ2dlckNvbGxhcHNlIiwiY29sbGFwc2VGaWxlUGF0Y2giLCJ0cmlnZ2VyRXhwYW5kIiwiZXhwYW5kRmlsZVBhdGNoIiwicmVuZGVyU3ltbGlua0NoYW5nZU1ldGEiLCJyZW5kZXJFeGVjdXRhYmxlTW9kZUNoYW5nZU1ldGEiLCJyZW5kZXJEaWZmR2F0ZSIsInJlbmRlckRpZmZVbmF2YWlsYWJsZSIsInJlbmRlckh1bmtIZWFkZXJzIiwic2VsZWN0ZWRGaWxlUGF0Y2hlcyIsIkFycmF5IiwiZnJvbSIsImdldFNlbGVjdGVkRmlsZVBhdGNoZXMiLCJDaGFuZ2VkRmlsZUl0ZW0iLCJldmVudFNvdXJjZSIsImNvbW1hbmQiLCJkaXNjYXJkUm93cyIsInNlbGVjdGVkUm93cyIsInNlbGVjdGlvbk1vZGUiLCJQcm9taXNlIiwiYWxsIiwiZnAiLCJkaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSIsIm1hcCIsInRvZ2dsZU1vZGVDaGFuZ2UiLCJoYXNUeXBlY2hhbmdlIiwidG9nZ2xlU3ltbGlua0NoYW5nZSIsImNoYW5nZWRGaWxlUGF0aCIsImNoYW5nZWRGaWxlUG9zaXRpb24iLCJyZWZFZGl0b3IiLCJyb3ciLCJnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24iLCJzY3JvbGxUb0J1ZmZlclBvc2l0aW9uIiwiY29sdW1uIiwiY2VudGVyIiwic2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJhdXRvYmluZCIsIm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxhc3RNb3VzZU1vdmVMaW5lIiwibmV4dFNlbGVjdGlvbk1vZGUiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwicmVmRWRpdG9yRWxlbWVudCIsIm1vdW50ZWQiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImFkZCIsIm9ic2VydmUiLCJlZGl0b3IiLCJzZXR0ZXIiLCJnZXRFbGVtZW50IiwiZWxlbWVudCIsInJlZkluaXRpYWxGb2N1cyIsInN1cHByZXNzQ2hhbmdlcyIsImxhc3RTY3JvbGxUb3AiLCJsYXN0U2Nyb2xsTGVmdCIsImxhc3RTZWxlY3Rpb25JbmRleCIsIm9uV2lsbFVwZGF0ZVBhdGNoIiwiZ2V0TWF4U2VsZWN0aW9uSW5kZXgiLCJnZXRTY3JvbGxUb3AiLCJnZXRTY3JvbGxMZWZ0Iiwib25EaWRVcGRhdGVQYXRjaCIsIm5leHRQYXRjaCIsIm5leHRTZWxlY3Rpb25SYW5nZSIsImdldFNlbGVjdGlvblJhbmdlRm9ySW5kZXgiLCJzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlIiwibmV4dEh1bmtzIiwiU2V0IiwiUmFuZ2UiLCJmcm9tT2JqZWN0IiwiZ2V0Um93cyIsImdldEh1bmtBdCIsIkJvb2xlYW4iLCJuZXh0UmFuZ2VzIiwic2l6ZSIsImh1bmsiLCJzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyIsInNldFNjcm9sbFRvcCIsInNldFNjcm9sbExlZnQiLCJkaWRDaGFuZ2VTZWxlY3RlZFJvd3MiLCJjb21wb25lbnREaWRNb3VudCIsIm1lYXN1cmVQZXJmb3JtYW5jZSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkaWRNb3VzZVVwIiwiZmlyc3RQYXRjaCIsImdldEZpbGVQYXRjaGVzIiwiZmlyc3RIdW5rIiwiZ2V0SHVua3MiLCJjb25maWciLCJvbkRpZENoYW5nZSIsImZvcmNlVXBkYXRlIiwiaW5pdENoYW5nZWRGaWxlUGF0aCIsImluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uIiwic2Nyb2xsVG9GaWxlIiwib25PcGVuRmlsZXNUYWIiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwb3NlIiwicGVyZm9ybWFuY2UiLCJjbGVhck1hcmtzIiwiY2xlYXJNZWFzdXJlcyIsInJlbmRlciIsInJvb3RDbGFzcyIsImN4IiwiYW55UHJlc2VudCIsIm1hcmsiLCJyZWYiLCJyZW5kZXJDb21tYW5kcyIsInJlbmRlck5vbkVtcHR5UGF0Y2giLCJyZW5kZXJFbXB0eVBhdGNoIiwiQ29tbWl0RGV0YWlsSXRlbSIsIklzc3VlaXNoRGV0YWlsSXRlbSIsInJlZ2lzdHJ5IiwiY29tbWFuZHMiLCJ0YXJnZXQiLCJDb21tYW5kIiwiY2FsbGJhY2siLCJzZWxlY3ROZXh0SHVuayIsInNlbGVjdFByZXZpb3VzSHVuayIsImRpZFRvZ2dsZVNlbGVjdGlvbk1vZGUiLCJzdGFnZU1vZGVDb21tYW5kIiwic3RhZ2VTeW1saW5rQ29tbWFuZCIsImRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlIiwiZGlkVG9nZ2xlTW9kZUNoYW5nZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiZGlkVG9nZ2xlU3ltbGlua0NoYW5nZSIsImRpZENvbmZpcm0iLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8iLCJkaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmQiLCJzdXJmYWNlIiwiYXRvbSIsImluRGV2TW9kZSIsImNvbnNvbGUiLCJsb2ciLCJnZXRQYXRjaEJ1ZmZlciIsImluc3BlY3QiLCJsYXllck5hbWVzIiwid29ya3NwYWNlIiwiYnVmZmVyIiwibGluZU51bWJlckd1dHRlclZpc2libGUiLCJhdXRvV2lkdGgiLCJhdXRvSGVpZ2h0IiwicmVhZE9ubHkiLCJzb2Z0V3JhcHBlZCIsImRpZEFkZFNlbGVjdGlvbiIsImRpZENoYW5nZVNlbGVjdGlvblJhbmdlIiwiZGlkRGVzdHJveVNlbGVjdGlvbiIsInJlZk1vZGVsIiwiaGlkZUVtcHRpbmVzcyIsIm5hbWUiLCJwcmlvcml0eSIsImxhYmVsRm4iLCJvbGRMaW5lTnVtYmVyTGFiZWwiLCJvbk1vdXNlRG93biIsImRpZE1vdXNlRG93bk9uTGluZU51bWJlciIsIm9uTW91c2VNb3ZlIiwiZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyIiwibmV3TGluZU51bWJlckxhYmVsIiwiYmxhbmtMYWJlbCIsInJlbmRlclBSQ29tbWVudEljb25zIiwicmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMiLCJyZW5kZXJMaW5lRGVjb3JhdGlvbnMiLCJJbmZpbml0eSIsImd1dHRlciIsImljb24iLCJsaW5lIiwicmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJwYXRoIiwiZ2V0UGF0Y2hGb3JQYXRoIiwiaXNSb3dTZWxlY3RlZCIsImlkIiwiY29tbWVudFJvdyIsInRocmVhZElkIiwiZW5kcG9pbnQiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJ3b3JrZGlyIiwid29ya2RpclBhdGgiLCJleHRyYUNsYXNzZXMiLCJwYXJlbnQiLCJvcmRlck9mZnNldCIsInNob3dEaWZmIiwiYWRkRXZlbnQiLCJjb21wb25lbnQiLCJwYWNrYWdlIiwib25DbGljayIsIm9sZE1vZGUiLCJnZXRPbGRNb2RlIiwibmV3TW9kZSIsImdldE5ld01vZGUiLCJhdHRycyIsImFjdGlvbkljb24iLCJhY3Rpb25UZXh0IiwidGl0bGUiLCJhY3Rpb24iLCJoYXNTeW1saW5rIiwiZGV0YWlsIiwib2xkU3ltbGluayIsImdldE9sZFN5bWxpbmsiLCJuZXdTeW1saW5rIiwiZ2V0TmV3U3ltbGluayIsInRvZ2dsZVZlcmIiLCJzZWxlY3RlZEh1bmtzIiwiY29udGFpbnNTZWxlY3Rpb24iLCJpc1NlbGVjdGVkIiwiYnV0dG9uU3VmZml4IiwidG9nZ2xlU2VsZWN0aW9uTGFiZWwiLCJkaXNjYXJkU2VsZWN0aW9uTGFiZWwiLCJzdGFydFBvaW50Iiwic3RhcnRSYW5nZSIsInJlZlRhcmdldCIsImtleW1hcHMiLCJ0b2dnbGVTZWxlY3Rpb24iLCJ0b2dnbGVIdW5rU2VsZWN0aW9uIiwiZGlzY2FyZFNlbGVjdGlvbiIsImRpc2NhcmRIdW5rU2VsZWN0aW9uIiwibW91c2VEb3duIiwiZGlkTW91c2VEb3duT25IZWFkZXIiLCJyYW5nZXMiLCJsaW5lQ2xhc3MiLCJyZWZIb2xkZXIiLCJob2xkZXIiLCJoYW5kbGVMYXllciIsInJhbmdlIiwicmVuZGVyRGVjb3JhdGlvbnMiLCJsYXllciIsImdldE1hcmtlckNvdW50IiwiZXh0ZXJuYWwiLCJvbWl0RW1wdHlMYXN0Um93IiwiZ3V0dGVyTmFtZSIsInRvZ2dsZVJvd3MiLCJjaGFuZ2VSb3dzIiwiZ2V0Q2hhbmdlcyIsInJlZHVjZSIsInJvd3MiLCJjaGFuZ2UiLCJnZXRCdWZmZXJSb3dzIiwiZXZlbnQiLCJoYW5kbGVTZWxlY3Rpb25FdmVudCIsImJ1ZmZlclJvdyIsInVuZGVmaW5lZCIsImlzTmFOIiwiZG9tRXZlbnQiLCJyYW5nZUxpa2UiLCJvcHRzIiwiYnV0dG9uIiwiaXNXaW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiY3RybEtleSIsIm9wdGlvbnMiLCJjb252ZXJ0ZWQiLCJjbGlwQnVmZmVyUmFuZ2UiLCJnZXRPciIsIm1ldGFLZXkiLCJpbnRlcnNlY3RzIiwid2l0aG91dCIsInNlbGVjdGlvbiIsImdldFNlbGVjdGlvbnMiLCJpbnRlcnNlY3RzQnVmZmVyUmFuZ2UiLCJzZWxlY3Rpb25SYW5nZSIsImdldEJ1ZmZlclJhbmdlIiwibmV3UmFuZ2VzIiwibnVkZ2VkIiwibGFzdENvbHVtbiIsImxpbmVMZW5ndGhGb3JSb3ciLCJlbmQiLCJzZXRCdWZmZXJSYW5nZSIsIm5ld1JhbmdlIiwic2xpY2UiLCJhZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSIsInJldmVyc2VkIiwiaXNSZXZlcnNlZCIsInJlcGxhY2VtZW50UmFuZ2VzIiwiZWFjaCIsInNoaWZ0S2V5IiwibGFzdFNlbGVjdGlvbiIsImdldExhc3RTZWxlY3Rpb24iLCJsYXN0U2VsZWN0aW9uUmFuZ2UiLCJpc0JlZm9yZSIsImlzTGVzc1RoYW4iLCJmYXJFZGdlIiwiZ2V0U2VsZWN0ZWRIdW5rcyIsIndpdGhTZWxlY3Rpb25Nb2RlIiwiaHVua1JhbmdlcyIsImZpcnN0Q2hhbmdlUm93IiwiZmlyc3RDaGFuZ2UiLCJnZXRTdGFydEJ1ZmZlclJvdyIsIndpdGhTZWxlY3RlZEh1bmtzIiwiZ2V0SHVua0FmdGVyIiwiZ2V0SHVua0JlZm9yZSIsImN1cnNvcnNCeUZpbGVQYXRjaCIsIk1hcCIsInBsYWNlZFJvd3MiLCJjdXJzb3IiLCJnZXRDdXJzb3JzIiwiY3Vyc29yUm93IiwiZ2V0QnVmZmVyUG9zaXRpb24iLCJnZXRGaWxlUGF0Y2hBdCIsIm5ld1JvdyIsImdldE5ld1Jvd0F0IiwibmV3Q29sdW1uIiwibmVhcmVzdFJvdyIsImdldE5ld1N0YXJ0Um93IiwicmVnaW9uIiwiZ2V0UmVnaW9ucyIsImluY2x1ZGVzQnVmZmVyUm93Iiwid2hlbiIsInVuY2hhbmdlZCIsImJ1ZmZlclJvd0NvdW50IiwiYWRkaXRpb24iLCJjdXJzb3JzIiwiZmlsZVBhdGNoZXNXaXRoQ3Vyc29ycyIsInBlbmRpbmciLCJnZXRTZWxlY3RlZFJvd3MiLCJhY2MiLCJpc0NoYW5nZVJvdyIsIm9sZEJ1ZmZlclJhbmdlIiwibmV3QnVmZmVyUmFuZ2UiLCJuZXh0Q3Vyc29yUm93cyIsImdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucyIsInNwYW5zTXVsdGlwbGVGaWxlcyIsInNlbGVjdGVkUm93c0NoYW5nZWQiLCJwYWQiLCJvbGRSb3ciLCJnZXRPbGRSb3dBdCIsInNlZW4iLCJnZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyIsInBhdGNoZXMiLCJwYXRjaCIsInByZXZSb3ciLCJuZXh0Um93IiwiY2hhbmdlTGF5ZXJzIiwic29tZSIsImZpbmRNYXJrZXJzIiwiaW50ZXJzZWN0c1JvdyIsImNhbGxiYWNrcyIsIkVycm9yIiwibnVtIiwibWF4RGlnaXRzIiwiZ2V0TWF4TGluZU51bWJlcldpZHRoIiwiTkJTUF9DSEFSQUNURVIiLCJyZXBlYXQiLCJ0b1N0cmluZyIsImdldEVudHJpZXNCeU5hbWUiLCJtZWFzdXJlIiwicGVyZiIsImZpbGVQYXRjaGVzTGluZUNvdW50cyIsImdldFBhdGNoIiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsImR1cmF0aW9uIiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsIm9uZU9mIiwiYm9vbCIsIkl0ZW1UeXBlUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwicmVwb3NpdG9yeSIsIm9iamVjdCIsIk11bHRpRmlsZVBhdGNoUHJvcFR5cGUiLCJhcnJheU9mIiwic2hhcGUiLCJwdWxsUmVxdWVzdCIsImZ1bmMiLCJzd2l0Y2hUb0lzc3VlaXNoIiwiUmVmSG9sZGVyUHJvcFR5cGUiLCJzdHJpbmciLCJFbmRwb2ludFByb3BUeXBlIiwiRGlzcG9zYWJsZSJdLCJzb3VyY2VzIjpbIm11bHRpLWZpbGUtcGF0Y2gtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7UmFuZ2V9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBOQlNQX0NIQVJBQ1RFUiwgYmxhbmtMYWJlbH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlLCBNdWx0aUZpbGVQYXRjaFByb3BUeXBlLCBJdGVtVHlwZVByb3BUeXBlLCBFbmRwb2ludFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9hdG9tL21hcmtlcic7XG5pbXBvcnQgTWFya2VyTGF5ZXIgZnJvbSAnLi4vYXRvbS9tYXJrZXItbGF5ZXInO1xuaW1wb3J0IERlY29yYXRpb24gZnJvbSAnLi4vYXRvbS9kZWNvcmF0aW9uJztcbmltcG9ydCBHdXR0ZXIgZnJvbSAnLi4vYXRvbS9ndXR0ZXInO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgRmlsZVBhdGNoSGVhZGVyVmlldyBmcm9tICcuL2ZpbGUtcGF0Y2gtaGVhZGVyLXZpZXcnO1xuaW1wb3J0IEZpbGVQYXRjaE1ldGFWaWV3IGZyb20gJy4vZmlsZS1wYXRjaC1tZXRhLXZpZXcnO1xuaW1wb3J0IEh1bmtIZWFkZXJWaWV3IGZyb20gJy4vaHVuay1oZWFkZXItdmlldyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBDaGFuZ2VkRmlsZUl0ZW0gZnJvbSAnLi4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nO1xuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCBDb21tZW50R3V0dGVyRGVjb3JhdGlvbkNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvY29tbWVudC1ndXR0ZXItZGVjb3JhdGlvbi1jb250cm9sbGVyJztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi4vbW9kZWxzL3BhdGNoL2ZpbGUnO1xuXG5jb25zdCBleGVjdXRhYmxlVGV4dCA9IHtcbiAgW0ZpbGUubW9kZXMuTk9STUFMXTogJ25vbiBleGVjdXRhYmxlJyxcbiAgW0ZpbGUubW9kZXMuRVhFQ1VUQUJMRV06ICdleGVjdXRhYmxlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpRmlsZVBhdGNoVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQmVoYXZpb3IgY29udHJvbHNcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWydzdGFnZWQnLCAndW5zdGFnZWQnXSksXG4gICAgaXNQYXJ0aWFsbHlTdGFnZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBNb2RlbHNcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbXVsdGlGaWxlUGF0Y2g6IE11bHRpRmlsZVBhdGNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3Rpb25Nb2RlOiBQcm9wVHlwZXMub25lT2YoWydodW5rJywgJ2xpbmUnXSkuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZFJvd3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIC8vIFJldmlldyBjb21tZW50c1xuICAgIHJldmlld0NvbW1lbnRzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wsXG4gICAgcmV2aWV3Q29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKSxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLy8gQ2FsbGJhY2tzXG4gICAgc2VsZWN0ZWRSb3dzQ2hhbmdlZDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpdmVJbnRvTWlycm9yUGF0Y2g6IFByb3BUeXBlcy5mdW5jLFxuICAgIHN1cmZhY2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9wZW5GaWxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVGaWxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVSb3dzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVNb2RlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVTeW1saW5rQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpc2NhcmRSb3dzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbldpbGxVcGRhdGVQYXRjaDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25EaWRVcGRhdGVQYXRjaDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvLyBFeHRlcm5hbCByZWZzXG4gICAgcmVmRWRpdG9yOiBSZWZIb2xkZXJQcm9wVHlwZSxcbiAgICByZWZJbml0aWFsRm9jdXM6IFJlZkhvbGRlclByb3BUeXBlLFxuXG4gICAgLy8gZm9yIG5hdmlnYXRpbmcgdGhlIFBSIGNoYW5nZWQgZmlsZXMgdGFiXG4gICAgb25PcGVuRmlsZXNUYWI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGluaXRDaGFuZ2VkRmlsZVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsIGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uOiBQcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLy8gZm9yIG9wZW5pbmcgdGhlIHJldmlld3MgZG9jayBpdGVtXG4gICAgZW5kcG9pbnQ6IEVuZHBvaW50UHJvcFR5cGUsXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgd29ya2RpclBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIG9uV2lsbFVwZGF0ZVBhdGNoOiAoKSA9PiBuZXcgRGlzcG9zYWJsZSgpLFxuICAgIG9uRGlkVXBkYXRlUGF0Y2g6ICgpID0+IG5ldyBEaXNwb3NhYmxlKCksXG4gICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nOiBmYWxzZSxcbiAgICByZXZpZXdDb21tZW50VGhyZWFkczogW10sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnZGlkTW91c2VEb3duT25IZWFkZXInLCAnZGlkTW91c2VEb3duT25MaW5lTnVtYmVyJywgJ2RpZE1vdXNlTW92ZU9uTGluZU51bWJlcicsICdkaWRNb3VzZVVwJyxcbiAgICAgICdkaWRDb25maXJtJywgJ2RpZFRvZ2dsZVNlbGVjdGlvbk1vZGUnLCAnc2VsZWN0TmV4dEh1bmsnLCAnc2VsZWN0UHJldmlvdXNIdW5rJyxcbiAgICAgICdkaWRPcGVuRmlsZScsICdkaWRBZGRTZWxlY3Rpb24nLCAnZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UnLCAnZGlkRGVzdHJveVNlbGVjdGlvbicsXG4gICAgICAnb2xkTGluZU51bWJlckxhYmVsJywgJ25ld0xpbmVOdW1iZXJMYWJlbCcsXG4gICAgKTtcblxuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG4gICAgdGhpcy5sYXN0TW91c2VNb3ZlTGluZSA9IG51bGw7XG4gICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9IG51bGw7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yRWxlbWVudCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgdGhpcy5yZWZFZGl0b3Iub2JzZXJ2ZShlZGl0b3IgPT4ge1xuICAgICAgICB0aGlzLnJlZkVkaXRvckVsZW1lbnQuc2V0dGVyKGVkaXRvci5nZXRFbGVtZW50KCkpO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5yZWZFZGl0b3IpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLnJlZkVkaXRvci5zZXR0ZXIoZWRpdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLnJlZkVkaXRvckVsZW1lbnQub2JzZXJ2ZShlbGVtZW50ID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMgJiYgdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMuc2V0dGVyKGVsZW1lbnQpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFN5bmNocm9ub3VzbHkgbWFpbnRhaW4gdGhlIGVkaXRvcidzIHNjcm9sbCBwb3NpdGlvbiBhbmQgbG9naWNhbCBzZWxlY3Rpb24gYWNyb3NzIGJ1ZmZlciB1cGRhdGVzLlxuICAgIHRoaXMuc3VwcHJlc3NDaGFuZ2VzID0gZmFsc2U7XG4gICAgbGV0IGxhc3RTY3JvbGxUb3AgPSBudWxsO1xuICAgIGxldCBsYXN0U2Nyb2xsTGVmdCA9IG51bGw7XG4gICAgbGV0IGxhc3RTZWxlY3Rpb25JbmRleCA9IG51bGw7XG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMucHJvcHMub25XaWxsVXBkYXRlUGF0Y2goKCkgPT4ge1xuICAgICAgICB0aGlzLnN1cHByZXNzQ2hhbmdlcyA9IHRydWU7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICAgIGxhc3RTZWxlY3Rpb25JbmRleCA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0TWF4U2VsZWN0aW9uSW5kZXgodGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MpO1xuICAgICAgICAgIGxhc3RTY3JvbGxUb3AgPSBlZGl0b3IuZ2V0RWxlbWVudCgpLmdldFNjcm9sbFRvcCgpO1xuICAgICAgICAgIGxhc3RTY3JvbGxMZWZ0ID0gZWRpdG9yLmdldEVsZW1lbnQoKS5nZXRTY3JvbGxMZWZ0KCk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgICB0aGlzLnByb3BzLm9uRGlkVXBkYXRlUGF0Y2gobmV4dFBhdGNoID0+IHtcbiAgICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAobGFzdFNlbGVjdGlvbkluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0U2VsZWN0aW9uUmFuZ2UgPSBuZXh0UGF0Y2guZ2V0U2VsZWN0aW9uUmFuZ2VGb3JJbmRleChsYXN0U2VsZWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKG5leHRTZWxlY3Rpb25SYW5nZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBuZXh0SHVua3MgPSBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIFJhbmdlLmZyb21PYmplY3QobmV4dFNlbGVjdGlvblJhbmdlKS5nZXRSb3dzKClcbiAgICAgICAgICAgICAgICAgIC5tYXAocm93ID0+IG5leHRQYXRjaC5nZXRIdW5rQXQocm93KSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IG5leHRIdW5rcy5zaXplID4gMFxuICAgICAgICAgICAgICAgID8gQXJyYXkuZnJvbShuZXh0SHVua3MsIGh1bmsgPT4gaHVuay5nZXRSYW5nZSgpKVxuICAgICAgICAgICAgICAgIDogW1tbMCwgMF0sIFswLCAwXV1dO1xuXG4gICAgICAgICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhuZXh0UmFuZ2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChsYXN0U2Nyb2xsVG9wICE9PSBudWxsKSB7IGVkaXRvci5nZXRFbGVtZW50KCkuc2V0U2Nyb2xsVG9wKGxhc3RTY3JvbGxUb3ApOyB9XG5cbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChsYXN0U2Nyb2xsTGVmdCAhPT0gbnVsbCkgeyBlZGl0b3IuZ2V0RWxlbWVudCgpLnNldFNjcm9sbExlZnQobGFzdFNjcm9sbExlZnQpOyB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN1cHByZXNzQ2hhbmdlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkUm93cygpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMubW91bnRlZCA9IHRydWU7XG4gICAgdGhpcy5tZWFzdXJlUGVyZm9ybWFuY2UoJ21vdW50Jyk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuZGlkTW91c2VVcCk7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAvLyB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoIGlzIGd1YXJhbnRlZWQgdG8gY29udGFpbiBhdCBsZWFzdCBvbmUgRmlsZVBhdGNoIGlmIDxBdG9tVGV4dEVkaXRvcj4gaXMgcmVuZGVyZWQuXG4gICAgICBjb25zdCBbZmlyc3RQYXRjaF0gPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCk7XG4gICAgICBjb25zdCBbZmlyc3RIdW5rXSA9IGZpcnN0UGF0Y2guZ2V0SHVua3MoKTtcbiAgICAgIGlmICghZmlyc3RIdW5rKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoZmlyc3RIdW5rLmdldFJhbmdlKCkpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgdGhpcy5wcm9wcy5jb25maWcub25EaWRDaGFuZ2UoJ2dpdGh1Yi5zaG93RGlmZkljb25HdXR0ZXInLCAoKSA9PiB0aGlzLmZvcmNlVXBkYXRlKCkpLFxuICAgICk7XG5cbiAgICBjb25zdCB7aW5pdENoYW5nZWRGaWxlUGF0aCwgaW5pdENoYW5nZWRGaWxlUG9zaXRpb259ID0gdGhpcy5wcm9wcztcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGluaXRDaGFuZ2VkRmlsZVBhdGggJiYgaW5pdENoYW5nZWRGaWxlUG9zaXRpb24gPj0gMCkge1xuICAgICAgdGhpcy5zY3JvbGxUb0ZpbGUoe1xuICAgICAgICBjaGFuZ2VkRmlsZVBhdGg6IGluaXRDaGFuZ2VkRmlsZVBhdGgsXG4gICAgICAgIGNoYW5nZWRGaWxlUG9zaXRpb246IGluaXRDaGFuZ2VkRmlsZVBvc2l0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKHRoaXMucHJvcHMub25PcGVuRmlsZXNUYWIpIHtcbiAgICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICAgIHRoaXMucHJvcHMub25PcGVuRmlsZXNUYWIodGhpcy5zY3JvbGxUb0ZpbGUpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgdGhpcy5tZWFzdXJlUGVyZm9ybWFuY2UoJ3VwZGF0ZScpO1xuXG4gICAgaWYgKHByZXZQcm9wcy5yZWZJbml0aWFsRm9jdXMgIT09IHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzKSB7XG4gICAgICBwcmV2UHJvcHMucmVmSW5pdGlhbEZvY3VzICYmIHByZXZQcm9wcy5yZWZJbml0aWFsRm9jdXMuc2V0dGVyKG51bGwpO1xuICAgICAgdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMgJiYgdGhpcy5yZWZFZGl0b3JFbGVtZW50Lm1hcCh0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cy5zZXR0ZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoID09PSBwcmV2UHJvcHMubXVsdGlGaWxlUGF0Y2gpIHtcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5kaWRNb3VzZVVwKTtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICAgIHRoaXMubW91bnRlZCA9IGZhbHNlO1xuICAgIHBlcmZvcm1hbmNlLmNsZWFyTWFya3MoKTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1lYXN1cmVzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgcm9vdENsYXNzID0gY3goXG4gICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXcnLFxuICAgICAge1tgZ2l0aHViLUZpbGVQYXRjaFZpZXctLSR7dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfWBdOiB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXN9LFxuICAgICAgeydnaXRodWItRmlsZVBhdGNoVmlldy0tYmxhbmsnOiAhdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5hbnlQcmVzZW50KCl9LFxuICAgICAgeydnaXRodWItRmlsZVBhdGNoVmlldy0taHVua01vZGUnOiB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdodW5rJ30sXG4gICAgKTtcblxuICAgIGlmICh0aGlzLm1vdW50ZWQpIHtcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ011bHRpRmlsZVBhdGNoVmlldy11cGRhdGUtc3RhcnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGVyZm9ybWFuY2UubWFyaygnTXVsdGlGaWxlUGF0Y2hWaWV3LW1vdW50LXN0YXJ0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb290Q2xhc3N9IHJlZj17dGhpcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guYW55UHJlc2VudCgpID8gdGhpcy5yZW5kZXJOb25FbXB0eVBhdGNoKCkgOiB0aGlzLnJlbmRlckVtcHR5UGF0Y2goKX1cbiAgICAgICAgPC9tYWluPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDb21taXREZXRhaWxJdGVtIHx8IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IElzc3VlaXNoRGV0YWlsSXRlbSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtbmV4dC1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0TmV4dEh1bmt9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtcHJldmlvdXMtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdFByZXZpb3VzSHVua30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1wYXRjaC1zZWxlY3Rpb24tbW9kZVwiIGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZVNlbGVjdGlvbk1vZGV9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBzdGFnZU1vZGVDb21tYW5kID0gbnVsbDtcbiAgICBsZXQgc3RhZ2VTeW1saW5rQ29tbWFuZCA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5kaWRBbnlDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICAgID8gJ2dpdGh1YjpzdGFnZS1maWxlLW1vZGUtY2hhbmdlJ1xuICAgICAgICA6ICdnaXRodWI6dW5zdGFnZS1maWxlLW1vZGUtY2hhbmdlJztcbiAgICAgIHN0YWdlTW9kZUNvbW1hbmQgPSA8Q29tbWFuZCBjb21tYW5kPXtjb21tYW5kfSBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVNb2RlQ2hhbmdlfSAvPjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5hbnlIYXZlVHlwZWNoYW5nZSgpKSB7XG4gICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICAgID8gJ2dpdGh1YjpzdGFnZS1zeW1saW5rLWNoYW5nZSdcbiAgICAgICAgOiAnZ2l0aHViOnVuc3RhZ2Utc3ltbGluay1jaGFuZ2UnO1xuICAgICAgc3RhZ2VTeW1saW5rQ29tbWFuZCA9IDxDb21tYW5kIGNvbW1hbmQ9e2NvbW1hbmR9IGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZVN5bWxpbmtDaGFuZ2V9IC8+O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtbmV4dC1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0TmV4dEh1bmt9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2VsZWN0LXByZXZpb3VzLWh1bmtcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RQcmV2aW91c0h1bmt9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiBjYWxsYmFjaz17dGhpcy5kaWRDb25maXJtfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTp1bmRvXCIgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvfSAvPlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpc2NhcmQtc2VsZWN0ZWQtbGluZXNcIiBjYWxsYmFjaz17dGhpcy5kaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmR9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6anVtcC10by1maWxlXCIgY2FsbGJhY2s9e3RoaXMuZGlkT3BlbkZpbGV9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VyZmFjZVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLnN1cmZhY2V9IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLXBhdGNoLXNlbGVjdGlvbi1tb2RlXCIgY2FsbGJhY2s9e3RoaXMuZGlkVG9nZ2xlU2VsZWN0aW9uTW9kZX0gLz5cbiAgICAgICAge3N0YWdlTW9kZUNvbW1hbmR9XG4gICAgICAgIHtzdGFnZVN5bWxpbmtDb21tYW5kfVxuICAgICAgICB7LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gYXRvbS5pbkRldk1vZGUoKSAmJlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6aW5zcGVjdC1wYXRjaFwiIGNhbGxiYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRQYXRjaEJ1ZmZlcigpLmluc3BlY3Qoe1xuICAgICAgICAgICAgICBsYXllck5hbWVzOiBbJ3BhdGNoJywgJ2h1bmsnXSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgICAgey8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGF0b20uaW5EZXZNb2RlKCkgJiZcbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3BlY3QtcmVnaW9uc1wiIGNhbGxiYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRQYXRjaEJ1ZmZlcigpLmluc3BlY3Qoe1xuICAgICAgICAgICAgICBsYXllck5hbWVzOiBbJ3VuY2hhbmdlZCcsICdkZWxldGlvbicsICdhZGRpdGlvbicsICdub25ld2xpbmUnXSxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgICAgey8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGF0b20uaW5EZXZNb2RlKCkgJiZcbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3BlY3QtbWZwXCIgY2FsbGJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmluc3BlY3QoKSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICA8L0NvbW1hbmRzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJFbXB0eVBhdGNoKCkge1xuICAgIHJldHVybiA8cCBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXNzYWdlIGljb24gaWNvbi1pbmZvXCI+Tm8gY2hhbmdlcyB0byBkaXNwbGF5PC9wPjtcbiAgfVxuXG4gIHJlbmRlck5vbkVtcHR5UGF0Y2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBdG9tVGV4dEVkaXRvclxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuXG4gICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRCdWZmZXIoKX1cbiAgICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU9e2ZhbHNlfVxuICAgICAgICBhdXRvV2lkdGg9e2ZhbHNlfVxuICAgICAgICBhdXRvSGVpZ2h0PXtmYWxzZX1cbiAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgIHNvZnRXcmFwcGVkPXt0cnVlfVxuXG4gICAgICAgIGRpZEFkZFNlbGVjdGlvbj17dGhpcy5kaWRBZGRTZWxlY3Rpb259XG4gICAgICAgIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlPXt0aGlzLmRpZENoYW5nZVNlbGVjdGlvblJhbmdlfVxuICAgICAgICBkaWREZXN0cm95U2VsZWN0aW9uPXt0aGlzLmRpZERlc3Ryb3lTZWxlY3Rpb259XG4gICAgICAgIHJlZk1vZGVsPXt0aGlzLnJlZkVkaXRvcn1cbiAgICAgICAgaGlkZUVtcHRpbmVzcz17dHJ1ZX0+XG5cbiAgICAgICAgPEd1dHRlclxuICAgICAgICAgIG5hbWU9XCJvbGQtbGluZS1udW1iZXJzXCJcbiAgICAgICAgICBwcmlvcml0eT17MX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJvbGRcIlxuICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgbGFiZWxGbj17dGhpcy5vbGRMaW5lTnVtYmVyTGFiZWx9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25MaW5lTnVtYmVyfVxuICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmRpZE1vdXNlTW92ZU9uTGluZU51bWJlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPEd1dHRlclxuICAgICAgICAgIG5hbWU9XCJuZXctbGluZS1udW1iZXJzXCJcbiAgICAgICAgICBwcmlvcml0eT17Mn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJuZXdcIlxuICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgbGFiZWxGbj17dGhpcy5uZXdMaW5lTnVtYmVyTGFiZWx9XG4gICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25MaW5lTnVtYmVyfVxuICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLmRpZE1vdXNlTW92ZU9uTGluZU51bWJlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPEd1dHRlclxuICAgICAgICAgIG5hbWU9XCJnaXRodWItY29tbWVudC1pY29uXCJcbiAgICAgICAgICBwcmlvcml0eT17M31cbiAgICAgICAgICBjbGFzc05hbWU9XCJjb21tZW50XCJcbiAgICAgICAgICB0eXBlPVwiZGVjb3JhdGVkXCJcbiAgICAgICAgLz5cbiAgICAgICAge3RoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLnNob3dEaWZmSWNvbkd1dHRlcicpICYmIChcbiAgICAgICAgICA8R3V0dGVyXG4gICAgICAgICAgICBuYW1lPVwiZGlmZi1pY29uc1wiXG4gICAgICAgICAgICBwcmlvcml0eT17NH1cbiAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uc1wiXG4gICAgICAgICAgICBsYWJlbEZuPXtibGFua0xhYmVsfVxuICAgICAgICAgICAgb25Nb3VzZURvd249e3RoaXMuZGlkTW91c2VEb3duT25MaW5lTnVtYmVyfVxuICAgICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyUFJDb21tZW50SWNvbnMoKX1cblxuICAgICAgICB7dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLm1hcCh0aGlzLnJlbmRlckZpbGVQYXRjaERlY29yYXRpb25zKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJMaW5lRGVjb3JhdGlvbnMoXG4gICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLnByb3BzLnNlbGVjdGVkUm93cywgcm93ID0+IFJhbmdlLmZyb21PYmplY3QoW1tyb3csIDBdLCBbcm93LCBJbmZpbml0eV1dKSksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLXNlbGVjdGVkJyxcbiAgICAgICAgICB7Z3V0dGVyOiB0cnVlLCBpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRBZGRpdGlvbkxheWVyKCksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLWFkZGVkJyxcbiAgICAgICAgICB7aWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zT25MYXllcihcbiAgICAgICAgICB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldERlbGV0aW9uTGF5ZXIoKSxcbiAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tZGVsZXRlZCcsXG4gICAgICAgICAge2ljb246IHRydWUsIGxpbmU6IHRydWV9LFxuICAgICAgICApfVxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIoXG4gICAgICAgICAgdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXROb05ld2xpbmVMYXllcigpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1ub25ld2xpbmUnLFxuICAgICAgICAgIHtpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cblxuICAgICAgPC9BdG9tVGV4dEVkaXRvcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUFJDb21tZW50SWNvbnMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgIT09IElzc3VlaXNoRGV0YWlsSXRlbSB8fFxuICAgICAgICB0aGlzLnByb3BzLnJldmlld0NvbW1lbnRzTG9hZGluZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmV2aWV3Q29tbWVudFRocmVhZHMubWFwKCh7Y29tbWVudHMsIHRocmVhZH0pID0+IHtcbiAgICAgIGNvbnN0IHtwYXRoLCBwb3NpdGlvbn0gPSBjb21tZW50c1swXTtcbiAgICAgIGlmICghdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRQYXRjaEZvclBhdGgocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyUm93Rm9yRGlmZlBvc2l0aW9uKHBhdGgsIHBvc2l0aW9uKTtcbiAgICAgIGlmIChyb3cgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzUm93U2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGVkUm93cy5oYXMocm93KTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21tZW50R3V0dGVyRGVjb3JhdGlvbkNvbnRyb2xsZXJcbiAgICAgICAgICBrZXk9e2BnaXRodWItY29tbWVudC1ndXR0ZXItZGVjb3JhdGlvbi0ke3RocmVhZC5pZH1gfVxuICAgICAgICAgIGNvbW1lbnRSb3c9e3Jvd31cbiAgICAgICAgICB0aHJlYWRJZD17dGhyZWFkLmlkfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgZW5kcG9pbnQ9e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgICAgb3duZXI9e3RoaXMucHJvcHMub3duZXJ9XG4gICAgICAgICAgcmVwbz17dGhpcy5wcm9wcy5yZXBvfVxuICAgICAgICAgIG51bWJlcj17dGhpcy5wcm9wcy5udW1iZXJ9XG4gICAgICAgICAgd29ya2Rpcj17dGhpcy5wcm9wcy53b3JrZGlyUGF0aH1cbiAgICAgICAgICBleHRyYUNsYXNzZXM9e2lzUm93U2VsZWN0ZWQgPyBbJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLXNlbGVjdGVkJ10gOiBbXX1cbiAgICAgICAgICBwYXJlbnQ9e3RoaXMuY29uc3RydWN0b3IubmFtZX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJGaWxlUGF0Y2hEZWNvcmF0aW9ucyA9IChmaWxlUGF0Y2gsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNDb2xsYXBzZWQgPSAhZmlsZVBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzVmlzaWJsZSgpO1xuICAgIGNvbnN0IGlzRW1wdHkgPSBmaWxlUGF0Y2guZ2V0TWFya2VyKCkuZ2V0UmFuZ2UoKS5pc0VtcHR5KCk7XG4gICAgY29uc3QgaXNFeHBhbmRhYmxlID0gZmlsZVBhdGNoLmdldFJlbmRlclN0YXR1cygpLmlzRXhwYW5kYWJsZSgpO1xuICAgIGNvbnN0IGlzVW5hdmFpbGFibGUgPSBpc0NvbGxhcHNlZCAmJiAhaXNFeHBhbmRhYmxlO1xuICAgIGNvbnN0IGF0RW5kID0gZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKS5zdGFydC5pc0VxdWFsKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QnVmZmVyKCkuZ2V0RW5kUG9zaXRpb24oKSk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBpc0VtcHR5ICYmIGF0RW5kID8gJ2FmdGVyJyA6ICdiZWZvcmUnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudCBrZXk9e2ZpbGVQYXRjaC5nZXRQYXRoKCl9PlxuICAgICAgICA8TWFya2VyIGludmFsaWRhdGU9XCJuZXZlclwiIGJ1ZmZlclJhbmdlPXtmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpfT5cbiAgICAgICAgICA8RGVjb3JhdGlvbiB0eXBlPVwiYmxvY2tcIiBwb3NpdGlvbj17cG9zaXRpb259IG9yZGVyPXtpbmRleH0gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udHJvbEJsb2NrXCI+XG4gICAgICAgICAgICA8RmlsZVBhdGNoSGVhZGVyVmlld1xuICAgICAgICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgICAgICAgcmVsUGF0aD17ZmlsZVBhdGNoLmdldFBhdGgoKX1cbiAgICAgICAgICAgICAgbmV3UGF0aD17ZmlsZVBhdGNoLmdldFN0YXR1cygpID09PSAncmVuYW1lZCcgPyBmaWxlUGF0Y2guZ2V0TmV3UGF0aCgpIDogbnVsbH1cbiAgICAgICAgICAgICAgc3RhZ2luZ1N0YXR1cz17dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzfVxuICAgICAgICAgICAgICBpc1BhcnRpYWxseVN0YWdlZD17dGhpcy5wcm9wcy5pc1BhcnRpYWxseVN0YWdlZH1cbiAgICAgICAgICAgICAgaGFzVW5kb0hpc3Rvcnk9e3RoaXMucHJvcHMuaGFzVW5kb0hpc3Rvcnl9XG4gICAgICAgICAgICAgIGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnM9e3RoaXMucHJvcHMuaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9uc31cblxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cblxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9eygpID0+IHRoaXMudW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbihmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICBkaXZlSW50b01pcnJvclBhdGNoPXsoKSA9PiB0aGlzLnByb3BzLmRpdmVJbnRvTWlycm9yUGF0Y2goZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgb3BlbkZpbGU9eygpID0+IHRoaXMuZGlkT3BlbkZpbGUoe3NlbGVjdGVkRmlsZVBhdGNoOiBmaWxlUGF0Y2h9KX1cbiAgICAgICAgICAgICAgdG9nZ2xlRmlsZT17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVGaWxlKGZpbGVQYXRjaCl9XG5cbiAgICAgICAgICAgICAgaXNDb2xsYXBzZWQ9e2lzQ29sbGFwc2VkfVxuICAgICAgICAgICAgICB0cmlnZ2VyQ29sbGFwc2U9eygpID0+IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guY29sbGFwc2VGaWxlUGF0Y2goZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgdHJpZ2dlckV4cGFuZD17KCkgPT4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5leHBhbmRGaWxlUGF0Y2goZmlsZVBhdGNoKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIHRoaXMucmVuZGVyU3ltbGlua0NoYW5nZU1ldGEoZmlsZVBhdGNoKX1cbiAgICAgICAgICAgIHshaXNDb2xsYXBzZWQgJiYgdGhpcy5yZW5kZXJFeGVjdXRhYmxlTW9kZUNoYW5nZU1ldGEoZmlsZVBhdGNoKX1cbiAgICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICAgIDwvTWFya2VyPlxuXG4gICAgICAgIHtpc0V4cGFuZGFibGUgJiYgdGhpcy5yZW5kZXJEaWZmR2F0ZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBpbmRleCl9XG4gICAgICAgIHtpc1VuYXZhaWxhYmxlICYmIHRoaXMucmVuZGVyRGlmZlVuYXZhaWxhYmxlKGZpbGVQYXRjaCwgcG9zaXRpb24sIGluZGV4KX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJIdW5rSGVhZGVycyhmaWxlUGF0Y2gsIGluZGV4KX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRpZmZHYXRlKGZpbGVQYXRjaCwgcG9zaXRpb24sIG9yZGVyT2Zmc2V0KSB7XG4gICAgY29uc3Qgc2hvd0RpZmYgPSAoKSA9PiB7XG4gICAgICBhZGRFdmVudCgnZXhwYW5kLWZpbGUtcGF0Y2gnLCB7Y29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIHBhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmV4cGFuZEZpbGVQYXRjaChmaWxlUGF0Y2gpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXIgaW52YWxpZGF0ZT1cIm5ldmVyXCIgYnVmZmVyUmFuZ2U9e2ZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCl9PlxuICAgICAgICA8RGVjb3JhdGlvblxuICAgICAgICAgIHR5cGU9XCJibG9ja1wiXG4gICAgICAgICAgb3JkZXI9e29yZGVyT2Zmc2V0ICsgMC4xfVxuICAgICAgICAgIHBvc2l0aW9uPXtwb3NpdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cblxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1lc3NhZ2UgaWNvbiBpY29uLWluZm9cIj5cbiAgICAgICAgICAgIExhcmdlIGRpZmZzIGFyZSBjb2xsYXBzZWQgYnkgZGVmYXVsdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1zaG93RGlmZkJ1dHRvblwiIG9uQ2xpY2s9e3Nob3dEaWZmfT4gTG9hZCBEaWZmPC9idXR0b24+XG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgIDwvTWFya2VyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEaWZmVW5hdmFpbGFibGUoZmlsZVBhdGNoLCBwb3NpdGlvbiwgb3JkZXJPZmZzZXQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlciBpbnZhbGlkYXRlPVwibmV2ZXJcIiBidWZmZXJSYW5nZT17ZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKX0+XG4gICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgdHlwZT1cImJsb2NrXCJcbiAgICAgICAgICBvcmRlcj17b3JkZXJPZmZzZXQgKyAwLjF9XG4gICAgICAgICAgcG9zaXRpb249e3Bvc2l0aW9ufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWVzc2FnZSBpY29uIGljb24td2FybmluZ1wiPlxuICAgICAgICAgICAgVGhpcyBkaWZmIGlzIHRvbyBsYXJnZSB0byBsb2FkIGF0IGFsbC4gVXNlIHRoZSBjb21tYW5kLWxpbmUgdG8gdmlldyBpdC5cbiAgICAgICAgICA8L3A+XG5cbiAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgPC9NYXJrZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckV4ZWN1dGFibGVNb2RlQ2hhbmdlTWV0YShmaWxlUGF0Y2gpIHtcbiAgICBpZiAoIWZpbGVQYXRjaC5kaWRDaGFuZ2VFeGVjdXRhYmxlTW9kZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRNb2RlID0gZmlsZVBhdGNoLmdldE9sZE1vZGUoKTtcbiAgICBjb25zdCBuZXdNb2RlID0gZmlsZVBhdGNoLmdldE5ld01vZGUoKTtcblxuICAgIGNvbnN0IGF0dHJzID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICA/IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS1kb3duJyxcbiAgICAgICAgYWN0aW9uVGV4dDogJ1N0YWdlIE1vZGUgQ2hhbmdlJyxcbiAgICAgIH1cbiAgICAgIDoge1xuICAgICAgICBhY3Rpb25JY29uOiAnaWNvbi1tb3ZlLXVwJyxcbiAgICAgICAgYWN0aW9uVGV4dDogJ1Vuc3RhZ2UgTW9kZSBDaGFuZ2UnLFxuICAgICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RmlsZVBhdGNoTWV0YVZpZXdcbiAgICAgICAgdGl0bGU9XCJNb2RlIGNoYW5nZVwiXG4gICAgICAgIGFjdGlvbkljb249e2F0dHJzLmFjdGlvbkljb259XG4gICAgICAgIGFjdGlvblRleHQ9e2F0dHJzLmFjdGlvblRleHR9XG4gICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICBhY3Rpb249eygpID0+IHRoaXMucHJvcHMudG9nZ2xlTW9kZUNoYW5nZShmaWxlUGF0Y2gpfT5cbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIEZpbGUgY2hhbmdlZCBtb2RlXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLXJlbW92ZWRcIj5cbiAgICAgICAgICAgIGZyb20ge2V4ZWN1dGFibGVUZXh0W29sZE1vZGVdfSA8Y29kZT57b2xkTW9kZX08L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmIGdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1hZGRlZFwiPlxuICAgICAgICAgICAgdG8ge2V4ZWN1dGFibGVUZXh0W25ld01vZGVdfSA8Y29kZT57bmV3TW9kZX08L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgPC9GaWxlUGF0Y2hNZXRhVmlldz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU3ltbGlua0NoYW5nZU1ldGEoZmlsZVBhdGNoKSB7XG4gICAgaWYgKCFmaWxlUGF0Y2guaGFzU3ltbGluaygpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZGV0YWlsID0gPGRpdiAvPjtcbiAgICBsZXQgdGl0bGUgPSAnJztcbiAgICBjb25zdCBvbGRTeW1saW5rID0gZmlsZVBhdGNoLmdldE9sZFN5bWxpbmsoKTtcbiAgICBjb25zdCBuZXdTeW1saW5rID0gZmlsZVBhdGNoLmdldE5ld1N5bWxpbmsoKTtcbiAgICBpZiAob2xkU3ltbGluayAmJiBuZXdTeW1saW5rKSB7XG4gICAgICBkZXRhaWwgPSAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBTeW1saW5rIGNoYW5nZWRcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2N4KFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmJyxcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tZnVsbFdpZHRoJyxcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tcmVtb3ZlZCcsXG4gICAgICAgICAgKX0+XG4gICAgICAgICAgICBmcm9tIDxjb2RlPntvbGRTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZicsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWZ1bGxXaWR0aCcsXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWFkZGVkJyxcbiAgICAgICAgICApfT5cbiAgICAgICAgICAgIHRvIDxjb2RlPntuZXdTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+LlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICAgIHRpdGxlID0gJ1N5bWxpbmsgY2hhbmdlZCc7XG4gICAgfSBlbHNlIGlmIChvbGRTeW1saW5rICYmICFuZXdTeW1saW5rKSB7XG4gICAgICBkZXRhaWwgPSAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBTeW1saW5rXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLXJlbW92ZWRcIj5cbiAgICAgICAgICAgIHRvIDxjb2RlPntvbGRTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgZGVsZXRlZC5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgICB0aXRsZSA9ICdTeW1saW5rIGRlbGV0ZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXRhaWwgPSAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICBTeW1saW5rXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWFkZGVkXCI+XG4gICAgICAgICAgICB0byA8Y29kZT57bmV3U3ltbGlua308L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIGNyZWF0ZWQuXG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgICAgdGl0bGUgPSAnU3ltbGluayBjcmVhdGVkJztcbiAgICB9XG5cbiAgICBjb25zdCBhdHRycyA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJ1xuICAgICAgPyB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtZG93bicsXG4gICAgICAgIGFjdGlvblRleHQ6ICdTdGFnZSBTeW1saW5rIENoYW5nZScsXG4gICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS11cCcsXG4gICAgICAgIGFjdGlvblRleHQ6ICdVbnN0YWdlIFN5bWxpbmsgQ2hhbmdlJyxcbiAgICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZpbGVQYXRjaE1ldGFWaWV3XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgYWN0aW9uSWNvbj17YXR0cnMuYWN0aW9uSWNvbn1cbiAgICAgICAgYWN0aW9uVGV4dD17YXR0cnMuYWN0aW9uVGV4dH1cbiAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgIGFjdGlvbj17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVTeW1saW5rQ2hhbmdlKGZpbGVQYXRjaCl9PlxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAge2RldGFpbH1cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgIDwvRmlsZVBhdGNoTWV0YVZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckh1bmtIZWFkZXJzKGZpbGVQYXRjaCwgb3JkZXJPZmZzZXQpIHtcbiAgICBjb25zdCB0b2dnbGVWZXJiID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnID8gJ1N0YWdlJyA6ICdVbnN0YWdlJztcbiAgICBjb25zdCBzZWxlY3RlZEh1bmtzID0gbmV3IFNldChcbiAgICAgIEFycmF5LmZyb20odGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsIHJvdyA9PiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChyb3cpKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPE1hcmtlckxheWVyPlxuICAgICAgICAgIHtmaWxlUGF0Y2guZ2V0SHVua3MoKS5tYXAoKGh1bmssIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250YWluc1NlbGVjdGlvbiA9IHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2xpbmUnICYmIHNlbGVjdGVkSHVua3MuaGFzKGh1bmspO1xuICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9ICh0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdodW5rJykgJiYgc2VsZWN0ZWRIdW5rcy5oYXMoaHVuayk7XG5cbiAgICAgICAgICAgIGxldCBidXR0b25TdWZmaXggPSAnJztcbiAgICAgICAgICAgIGlmIChjb250YWluc1NlbGVjdGlvbikge1xuICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ1NlbGVjdGVkIExpbmUnO1xuICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5zZWxlY3RlZFJvd3Muc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ3MnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBidXR0b25TdWZmaXggKz0gJ0h1bmsnO1xuICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRIdW5rcy5zaXplID4gMSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvblN1ZmZpeCArPSAncyc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG9nZ2xlU2VsZWN0aW9uTGFiZWwgPSBgJHt0b2dnbGVWZXJifSAke2J1dHRvblN1ZmZpeH1gO1xuICAgICAgICAgICAgY29uc3QgZGlzY2FyZFNlbGVjdGlvbkxhYmVsID0gYERpc2NhcmQgJHtidXR0b25TdWZmaXh9YDtcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IGh1bmsuZ2V0UmFuZ2UoKS5zdGFydDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0UmFuZ2UgPSBuZXcgUmFuZ2Uoc3RhcnRQb2ludCwgc3RhcnRQb2ludCk7XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxNYXJrZXIga2V5PXtgaHVua0hlYWRlci0ke2luZGV4fWB9IGJ1ZmZlclJhbmdlPXtzdGFydFJhbmdlfSBpbnZhbGlkYXRlPVwibmV2ZXJcIj5cbiAgICAgICAgICAgICAgICA8RGVjb3JhdGlvbiB0eXBlPVwiYmxvY2tcIiBvcmRlcj17b3JkZXJPZmZzZXQgKyAwLjJ9IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuICAgICAgICAgICAgICAgICAgPEh1bmtIZWFkZXJWaWV3XG4gICAgICAgICAgICAgICAgICAgIHJlZlRhcmdldD17dGhpcy5yZWZFZGl0b3JFbGVtZW50fVxuICAgICAgICAgICAgICAgICAgICBodW5rPXtodW5rfVxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICBzdGFnaW5nU3RhdHVzPXt0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbk1vZGU9XCJsaW5lXCJcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2VsZWN0aW9uTGFiZWw9e3RvZ2dsZVNlbGVjdGlvbkxhYmVsfVxuICAgICAgICAgICAgICAgICAgICBkaXNjYXJkU2VsZWN0aW9uTGFiZWw9e2Rpc2NhcmRTZWxlY3Rpb25MYWJlbH1cblxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNlbGVjdGlvbj17KCkgPT4gdGhpcy50b2dnbGVIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKX1cbiAgICAgICAgICAgICAgICAgICAgZGlzY2FyZFNlbGVjdGlvbj17KCkgPT4gdGhpcy5kaXNjYXJkSHVua1NlbGVjdGlvbihodW5rLCBjb250YWluc1NlbGVjdGlvbil9XG4gICAgICAgICAgICAgICAgICAgIG1vdXNlRG93bj17dGhpcy5kaWRNb3VzZURvd25PbkhlYWRlcn1cbiAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgICAgICAgICAgPC9NYXJrZXI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L01hcmtlckxheWVyPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTGluZURlY29yYXRpb25zKHJhbmdlcywgbGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29uLCByZWZIb2xkZXJ9KSB7XG4gICAgaWYgKHJhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGhvbGRlciA9IHJlZkhvbGRlciB8fCBuZXcgUmVmSG9sZGVyKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXJMYXllciBoYW5kbGVMYXllcj17aG9sZGVyLnNldHRlcn0+XG4gICAgICAgIHtyYW5nZXMubWFwKChyYW5nZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE1hcmtlclxuICAgICAgICAgICAgICBrZXk9e2BsaW5lLSR7bGluZUNsYXNzfS0ke2luZGV4fWB9XG4gICAgICAgICAgICAgIGJ1ZmZlclJhbmdlPXtyYW5nZX1cbiAgICAgICAgICAgICAgaW52YWxpZGF0ZT1cIm5ldmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zKGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbn0pfVxuICAgICAgPC9NYXJrZXJMYXllcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKGxheWVyLCBsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KSB7XG4gICAgaWYgKGxheWVyLmdldE1hcmtlckNvdW50KCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyTGF5ZXIgZXh0ZXJuYWw9e2xheWVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnMobGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSl9XG4gICAgICA8L01hcmtlckxheWVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEZWNvcmF0aW9ucyhsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAge2xpbmUgJiYgKFxuICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICB0eXBlPVwibGluZVwiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2xpbmVDbGFzc31cbiAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtndXR0ZXIgJiYgKFxuICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICAgIGd1dHRlck5hbWU9XCJvbGQtbGluZS1udW1iZXJzXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICAgIGd1dHRlck5hbWU9XCJuZXctbGluZS1udW1iZXJzXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICAgIHR5cGU9XCJndXR0ZXJcIlxuICAgICAgICAgICAgICBndXR0ZXJOYW1lPVwiZ2l0aHViLWNvbW1lbnQtaWNvblwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1lZGl0b3JDb21tZW50R3V0dGVySWNvbiBlbXB0eSAke2xpbmVDbGFzc31gfVxuICAgICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgKX1cbiAgICAgICAge2ljb24gJiYgKFxuICAgICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgICB0eXBlPVwibGluZS1udW1iZXJcIlxuICAgICAgICAgICAgZ3V0dGVyTmFtZT1cImRpZmYtaWNvbnNcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtsaW5lQ2xhc3N9XG4gICAgICAgICAgICBvbWl0RW1wdHlMYXN0Um93PXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEZpbGVQYXRjaGVzID0gQXJyYXkuZnJvbSh0aGlzLmdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSk7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IENoYW5nZWRGaWxlSXRlbSkge1xuICAgICAgICB0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZChzZWxlY3RlZEZpbGVQYXRjaGVzWzBdLCB7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnY29yZTp1bmRvJ319KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uID0gZmlsZVBhdGNoID0+IHtcbiAgICB0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZChmaWxlUGF0Y2gsIHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgfVxuXG4gIGRpc2NhcmRTZWxlY3Rpb25Gcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkUm93cyhcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlLFxuICAgICAge2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLXNlbGVjdGVkLWxpbmVzJ319LFxuICAgICk7XG4gIH1cblxuICB0b2dnbGVIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVSb3dzKFxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93cyxcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlLFxuICAgICAgICB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNoYW5nZVJvd3MgPSBuZXcgU2V0KFxuICAgICAgICBodW5rLmdldENoYW5nZXMoKVxuICAgICAgICAgIC5yZWR1Y2UoKHJvd3MsIGNoYW5nZSkgPT4ge1xuICAgICAgICAgICAgcm93cy5wdXNoKC4uLmNoYW5nZS5nZXRCdWZmZXJSb3dzKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgICAgfSwgW10pLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnRvZ2dsZVJvd3MoXG4gICAgICAgIGNoYW5nZVJvd3MsXG4gICAgICAgICdodW5rJyxcbiAgICAgICAge2V2ZW50U291cmNlOiAnYnV0dG9uJ30sXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGRpc2NhcmRIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkUm93cyhcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSxcbiAgICAgICAge2V2ZW50U291cmNlOiAnYnV0dG9uJ30sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjaGFuZ2VSb3dzID0gbmV3IFNldChcbiAgICAgICAgaHVuay5nZXRDaGFuZ2VzKClcbiAgICAgICAgICAucmVkdWNlKChyb3dzLCBjaGFuZ2UpID0+IHtcbiAgICAgICAgICAgIHJvd3MucHVzaCguLi5jaGFuZ2UuZ2V0QnVmZmVyUm93cygpKTtcbiAgICAgICAgICAgIHJldHVybiByb3dzO1xuICAgICAgICAgIH0sIFtdKSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkUm93cyhjaGFuZ2VSb3dzLCAnaHVuaycsIHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgICB9XG4gIH1cblxuICBkaWRNb3VzZURvd25PbkhlYWRlcihldmVudCwgaHVuaykge1xuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25FdmVudChldmVudCwgaHVuay5nZXRSYW5nZSgpKTtcbiAgfVxuXG4gIGRpZE1vdXNlRG93bk9uTGluZU51bWJlcihldmVudCkge1xuICAgIGNvbnN0IGxpbmUgPSBldmVudC5idWZmZXJSb3c7XG4gICAgaWYgKGxpbmUgPT09IHVuZGVmaW5lZCB8fCBpc05hTihsaW5lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgaWYgKHRoaXMuaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQuZG9tRXZlbnQsIFtbbGluZSwgMF0sIFtsaW5lLCBJbmZpbml0eV1dKSkge1xuICAgICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGRpZE1vdXNlTW92ZU9uTGluZU51bWJlcihldmVudCkge1xuICAgIGlmICghdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lID0gZXZlbnQuYnVmZmVyUm93O1xuICAgIGlmICh0aGlzLmxhc3RNb3VzZU1vdmVMaW5lID09PSBsaW5lIHx8IGxpbmUgPT09IHVuZGVmaW5lZCB8fCBpc05hTihsaW5lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxhc3RNb3VzZU1vdmVMaW5lID0gbGluZTtcblxuICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25FdmVudChldmVudC5kb21FdmVudCwgW1tsaW5lLCAwXSwgW2xpbmUsIEluZmluaXR5XV0sIHthZGQ6IHRydWV9KTtcbiAgfVxuXG4gIGRpZE1vdXNlVXAoKSB7XG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdGlvbkV2ZW50KGV2ZW50LCByYW5nZUxpa2UsIG9wdHMpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaXNXaW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbiAgICBpZiAoZXZlbnQuY3RybEtleSAmJiAhaXNXaW5kb3dzKSB7XG4gICAgICAvLyBBbGxvdyB0aGUgY29udGV4dCBtZW51IHRvIG9wZW4uXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGFkZDogZmFsc2UsXG4gICAgICAuLi5vcHRzLFxuICAgIH07XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHRhcmdldCBzZWxlY3Rpb24gcmFuZ2VcbiAgICBjb25zdCBjb252ZXJ0ZWQgPSBSYW5nZS5mcm9tT2JqZWN0KHJhbmdlTGlrZSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5jbGlwQnVmZmVyUmFuZ2UoY29udmVydGVkKSkuZ2V0T3IoY29udmVydGVkKTtcblxuICAgIGlmIChldmVudC5tZXRhS2V5IHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIChldmVudC5jdHJsS2V5ICYmIGlzV2luZG93cykpIHtcbiAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICBsZXQgaW50ZXJzZWN0cyA9IGZhbHNlO1xuICAgICAgICBsZXQgd2l0aG91dCA9IG51bGw7XG5cbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3Rpb24gb2YgZWRpdG9yLmdldFNlbGVjdGlvbnMoKSkge1xuICAgICAgICAgIGlmIChzZWxlY3Rpb24uaW50ZXJzZWN0c0J1ZmZlclJhbmdlKHJhbmdlKSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHJhbmdlIGZyb20gdGhpcyBzZWxlY3Rpb24gYnkgdHJ1bmNhdGluZyBpdCB0byB0aGUgXCJuZWFyIGVkZ2VcIiBvZiB0aGUgcmFuZ2UgYW5kIGNyZWF0aW5nIGFcbiAgICAgICAgICAgIC8vIG5ldyBzZWxlY3Rpb24gZnJvbSB0aGUgXCJmYXIgZWRnZVwiIHRvIHRoZSBwcmV2aW91cyBlbmQuIE9taXQgZWl0aGVyIHNpZGUgaWYgaXQgaXMgZW1wdHkuXG4gICAgICAgICAgICBpbnRlcnNlY3RzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1JhbmdlcyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoIXJhbmdlLnN0YXJ0LmlzRXF1YWwoc2VsZWN0aW9uUmFuZ2Uuc3RhcnQpKSB7XG4gICAgICAgICAgICAgIC8vIEluY2x1ZGUgdGhlIGJpdCBmcm9tIHRoZSBzZWxlY3Rpb24ncyBwcmV2aW91cyBzdGFydCB0byB0aGUgcmFuZ2UncyBzdGFydC5cbiAgICAgICAgICAgICAgbGV0IG51ZGdlZCA9IHJhbmdlLnN0YXJ0O1xuICAgICAgICAgICAgICBpZiAocmFuZ2Uuc3RhcnQuY29sdW1uID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdENvbHVtbiA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KHJhbmdlLnN0YXJ0LnJvdyAtIDEpO1xuICAgICAgICAgICAgICAgIG51ZGdlZCA9IFtyYW5nZS5zdGFydC5yb3cgLSAxLCBsYXN0Q29sdW1uXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG5ld1Jhbmdlcy5wdXNoKFtzZWxlY3Rpb25SYW5nZS5zdGFydCwgbnVkZ2VkXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcmFuZ2UuZW5kLmlzRXF1YWwoc2VsZWN0aW9uUmFuZ2UuZW5kKSkge1xuICAgICAgICAgICAgICAvLyBJbmNsdWRlIHRoZSBiaXQgZnJvbSB0aGUgcmFuZ2UncyBlbmQgdG8gdGhlIHNlbGVjdGlvbidzIGVuZC5cbiAgICAgICAgICAgICAgbGV0IG51ZGdlZCA9IHJhbmdlLmVuZDtcbiAgICAgICAgICAgICAgY29uc3QgbGFzdENvbHVtbiA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KHJhbmdlLmVuZC5yb3cpO1xuICAgICAgICAgICAgICBpZiAocmFuZ2UuZW5kLmNvbHVtbiA9PT0gbGFzdENvbHVtbikge1xuICAgICAgICAgICAgICAgIG51ZGdlZCA9IFtyYW5nZS5lbmQucm93ICsgMSwgMF07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBuZXdSYW5nZXMucHVzaChbbnVkZ2VkLCBzZWxlY3Rpb25SYW5nZS5lbmRdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld1Jhbmdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShuZXdSYW5nZXNbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IG5ld1JhbmdlIG9mIG5ld1Jhbmdlcy5zbGljZSgxKSkge1xuICAgICAgICAgICAgICAgIGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShuZXdSYW5nZSwge3JldmVyc2VkOiBzZWxlY3Rpb24uaXNSZXZlcnNlZCgpfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdpdGhvdXQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpdGhvdXQgIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCByZXBsYWNlbWVudFJhbmdlcyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICAgIC5maWx0ZXIoZWFjaCA9PiBlYWNoICE9PSB3aXRob3V0KVxuICAgICAgICAgICAgLm1hcChlYWNoID0+IGVhY2guZ2V0QnVmZmVyUmFuZ2UoKSk7XG4gICAgICAgICAgaWYgKHJlcGxhY2VtZW50UmFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhyZXBsYWNlbWVudFJhbmdlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKSB7XG4gICAgICAgICAgLy8gQWRkIHRoaXMgcmFuZ2UgYXMgYSBuZXcsIGRpc3RpbmN0IHNlbGVjdGlvbi5cbiAgICAgICAgICBlZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UocmFuZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWRkIHx8IGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAvLyBFeHRlbmQgdGhlIGV4aXN0aW5nIHNlbGVjdGlvbiB0byBlbmNvbXBhc3MgdGhpcyByYW5nZS5cbiAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICBjb25zdCBsYXN0U2VsZWN0aW9uID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKTtcbiAgICAgICAgY29uc3QgbGFzdFNlbGVjdGlvblJhbmdlID0gbGFzdFNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpO1xuXG4gICAgICAgIC8vIFlvdSBhcmUgbm93IGVudGVyaW5nIHRoZSB3YWxsIG9mIHRlcm5lcnkgb3BlcmF0b3JzLiBUaGlzIGlzIHlvdXIgbGFzdCBleGl0IGJlZm9yZSB0aGUgdG9sbGJvb3RoXG4gICAgICAgIGNvbnN0IGlzQmVmb3JlID0gcmFuZ2Uuc3RhcnQuaXNMZXNzVGhhbihsYXN0U2VsZWN0aW9uUmFuZ2Uuc3RhcnQpO1xuICAgICAgICBjb25zdCBmYXJFZGdlID0gaXNCZWZvcmUgPyByYW5nZS5zdGFydCA6IHJhbmdlLmVuZDtcbiAgICAgICAgY29uc3QgbmV3UmFuZ2UgPSBpc0JlZm9yZSA/IFtmYXJFZGdlLCBsYXN0U2VsZWN0aW9uUmFuZ2UuZW5kXSA6IFtsYXN0U2VsZWN0aW9uUmFuZ2Uuc3RhcnQsIGZhckVkZ2VdO1xuXG4gICAgICAgIGxhc3RTZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UobmV3UmFuZ2UsIHtyZXZlcnNlZDogaXNCZWZvcmV9KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSkpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGlkQ29uZmlybSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy50b2dnbGVSb3dzKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLCB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUpO1xuICB9XG5cbiAgZGlkVG9nZ2xlU2VsZWN0aW9uTW9kZSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZEh1bmtzID0gdGhpcy5nZXRTZWxlY3RlZEh1bmtzKCk7XG4gICAgdGhpcy53aXRoU2VsZWN0aW9uTW9kZSh7XG4gICAgICBsaW5lOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGh1bmtSYW5nZXMgPSBzZWxlY3RlZEh1bmtzLm1hcChodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKGh1bmtSYW5nZXMpKTtcbiAgICAgIH0sXG4gICAgICBodW5rOiAoKSA9PiB7XG4gICAgICAgIGxldCBmaXJzdENoYW5nZVJvdyA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGNvbnN0IGh1bmsgb2Ygc2VsZWN0ZWRIdW5rcykge1xuICAgICAgICAgIGNvbnN0IFtmaXJzdENoYW5nZV0gPSBodW5rLmdldENoYW5nZXMoKTtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChmaXJzdENoYW5nZSAmJiAoIWZpcnN0Q2hhbmdlUm93IHx8IGZpcnN0Q2hhbmdlLmdldFN0YXJ0QnVmZmVyUm93KCkgPCBmaXJzdENoYW5nZVJvdykpIHtcbiAgICAgICAgICAgIGZpcnN0Q2hhbmdlUm93ID0gZmlyc3RDaGFuZ2UuZ2V0U3RhcnRCdWZmZXJSb3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2xpbmUnO1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoW1tbZmlyc3RDaGFuZ2VSb3csIDBdLCBbZmlyc3RDaGFuZ2VSb3csIEluZmluaXR5XV1dKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgZGlkVG9nZ2xlTW9kZUNoYW5nZSA9ICgpID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICBBcnJheS5mcm9tKHRoaXMuZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpKVxuICAgICAgICAuZmlsdGVyKGZwID0+IGZwLmRpZENoYW5nZUV4ZWN1dGFibGVNb2RlKCkpXG4gICAgICAgIC5tYXAodGhpcy5wcm9wcy50b2dnbGVNb2RlQ2hhbmdlKSxcbiAgICApO1xuICB9XG5cbiAgZGlkVG9nZ2xlU3ltbGlua0NoYW5nZSA9ICgpID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICBBcnJheS5mcm9tKHRoaXMuZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpKVxuICAgICAgICAuZmlsdGVyKGZwID0+IGZwLmhhc1R5cGVjaGFuZ2UoKSlcbiAgICAgICAgLm1hcCh0aGlzLnByb3BzLnRvZ2dsZVN5bWxpbmtDaGFuZ2UpLFxuICAgICk7XG4gIH1cblxuICBzZWxlY3ROZXh0SHVuaygpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IG5leHRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICAgIHRoaXMud2l0aFNlbGVjdGVkSHVua3MoaHVuayA9PiB0aGlzLmdldEh1bmtBZnRlcihodW5rKSB8fCBodW5rKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXh0UmFuZ2VzID0gQXJyYXkuZnJvbShuZXh0SHVua3MsIGh1bmsgPT4gaHVuay5nZXRSYW5nZSgpKTtcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMobmV4dFJhbmdlcyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdFByZXZpb3VzSHVuaygpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IG5leHRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICAgIHRoaXMud2l0aFNlbGVjdGVkSHVua3MoaHVuayA9PiB0aGlzLmdldEh1bmtCZWZvcmUoaHVuaykgfHwgaHVuayksXG4gICAgICApO1xuICAgICAgY29uc3QgbmV4dFJhbmdlcyA9IEFycmF5LmZyb20obmV4dEh1bmtzLCBodW5rID0+IGh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gJ2h1bmsnO1xuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5leHRSYW5nZXMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBkaWRPcGVuRmlsZSh7c2VsZWN0ZWRGaWxlUGF0Y2h9KSB7XG4gICAgY29uc3QgY3Vyc29yc0J5RmlsZVBhdGNoID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBwbGFjZWRSb3dzID0gbmV3IFNldCgpO1xuXG4gICAgICBmb3IgKGNvbnN0IGN1cnNvciBvZiBlZGl0b3IuZ2V0Q3Vyc29ycygpKSB7XG4gICAgICAgIGNvbnN0IGN1cnNvclJvdyA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLnJvdztcbiAgICAgICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KGN1cnNvclJvdyk7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRjaCA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoQXQoY3Vyc29yUm93KTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaWYgKCFodW5rKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3Um93ID0gaHVuay5nZXROZXdSb3dBdChjdXJzb3JSb3cpO1xuICAgICAgICBsZXQgbmV3Q29sdW1uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkuY29sdW1uO1xuICAgICAgICBpZiAobmV3Um93ID09PSBudWxsKSB7XG4gICAgICAgICAgbGV0IG5lYXJlc3RSb3cgPSBodW5rLmdldE5ld1N0YXJ0Um93KCk7XG4gICAgICAgICAgZm9yIChjb25zdCByZWdpb24gb2YgaHVuay5nZXRSZWdpb25zKCkpIHtcbiAgICAgICAgICAgIGlmICghcmVnaW9uLmluY2x1ZGVzQnVmZmVyUm93KGN1cnNvclJvdykpIHtcbiAgICAgICAgICAgICAgcmVnaW9uLndoZW4oe1xuICAgICAgICAgICAgICAgIHVuY2hhbmdlZDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbmVhcmVzdFJvdyArPSByZWdpb24uYnVmZmVyUm93Q291bnQoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFkZGl0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBuZWFyZXN0Um93ICs9IHJlZ2lvbi5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFwbGFjZWRSb3dzLmhhcyhuZWFyZXN0Um93KSkge1xuICAgICAgICAgICAgbmV3Um93ID0gbmVhcmVzdFJvdztcbiAgICAgICAgICAgIG5ld0NvbHVtbiA9IDA7XG4gICAgICAgICAgICBwbGFjZWRSb3dzLmFkZChuZWFyZXN0Um93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3Um93ICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gV2h5IGlzIHRoaXMgbmVlZGVkPyBJIF90aGlua18gZXZlcnl0aGluZyBpcyBpbiB0ZXJtcyBvZiBidWZmZXIgcG9zaXRpb25cbiAgICAgICAgICAvLyBzbyB0aGVyZSBzaG91bGRuJ3QgYmUgYW4gb2ZmLWJ5LW9uZSBpc3N1ZVxuICAgICAgICAgIG5ld1JvdyAtPSAxO1xuICAgICAgICAgIGNvbnN0IGN1cnNvcnMgPSBjdXJzb3JzQnlGaWxlUGF0Y2guZ2V0KGZpbGVQYXRjaCk7XG4gICAgICAgICAgaWYgKCFjdXJzb3JzKSB7XG4gICAgICAgICAgICBjdXJzb3JzQnlGaWxlUGF0Y2guc2V0KGZpbGVQYXRjaCwgW1tuZXdSb3csIG5ld0NvbHVtbl1dKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3Vyc29ycy5wdXNoKFtuZXdSb3csIG5ld0NvbHVtbl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbGVQYXRjaGVzV2l0aEN1cnNvcnMgPSBuZXcgU2V0KGN1cnNvcnNCeUZpbGVQYXRjaC5rZXlzKCkpO1xuICAgIGlmIChzZWxlY3RlZEZpbGVQYXRjaCAmJiAhZmlsZVBhdGNoZXNXaXRoQ3Vyc29ycy5oYXMoc2VsZWN0ZWRGaWxlUGF0Y2gpKSB7XG4gICAgICBjb25zdCBbZmlyc3RIdW5rXSA9IHNlbGVjdGVkRmlsZVBhdGNoLmdldEh1bmtzKCk7XG4gICAgICBjb25zdCBjdXJzb3JSb3cgPSBmaXJzdEh1bmsgPyBmaXJzdEh1bmsuZ2V0TmV3U3RhcnRSb3coKSAtIDEgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAwO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGUoc2VsZWN0ZWRGaWxlUGF0Y2gsIFtbY3Vyc29yUm93LCAwXV0sIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwZW5kaW5nID0gY3Vyc29yc0J5RmlsZVBhdGNoLnNpemUgPT09IDE7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShjdXJzb3JzQnlGaWxlUGF0Y2gsIHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgW2ZpbGVQYXRjaCwgY3Vyc29yc10gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGUoZmlsZVBhdGNoLCBjdXJzb3JzLCBwZW5kaW5nKTtcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgfVxuXG4gIGdldFNlbGVjdGVkUm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICByZXR1cm4gbmV3IFNldChcbiAgICAgICAgZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgICAgIC5tYXAoc2VsZWN0aW9uID0+IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpKVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcmFuZ2UpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJhbmdlLmdldFJvd3MoKSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5pc0NoYW5nZVJvdyhyb3cpKSB7XG4gICAgICAgICAgICAgICAgYWNjLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LCBbXSksXG4gICAgICApO1xuICAgIH0pLmdldE9yKG5ldyBTZXQoKSk7XG4gIH1cblxuICBkaWRBZGRTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgfVxuXG4gIGRpZENoYW5nZVNlbGVjdGlvblJhbmdlKGV2ZW50KSB7XG4gICAgaWYgKFxuICAgICAgIWV2ZW50IHx8XG4gICAgICBldmVudC5vbGRCdWZmZXJSYW5nZS5zdGFydC5yb3cgIT09IGV2ZW50Lm5ld0J1ZmZlclJhbmdlLnN0YXJ0LnJvdyB8fFxuICAgICAgZXZlbnQub2xkQnVmZmVyUmFuZ2UuZW5kLnJvdyAhPT0gZXZlbnQubmV3QnVmZmVyUmFuZ2UuZW5kLnJvd1xuICAgICkge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgICB9XG4gIH1cblxuICBkaWREZXN0cm95U2VsZWN0aW9uKCkge1xuICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gIH1cblxuICBkaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKSB7XG4gICAgaWYgKHRoaXMuc3VwcHJlc3NDaGFuZ2VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dEN1cnNvclJvd3MgPSB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIHJldHVybiBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLnJvdyk7XG4gICAgfSkuZ2V0T3IoW10pO1xuICAgIGNvbnN0IGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnMgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLnNwYW5zTXVsdGlwbGVGaWxlcyhuZXh0Q3Vyc29yUm93cyk7XG5cbiAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93c0NoYW5nZWQoXG4gICAgICB0aGlzLmdldFNlbGVjdGVkUm93cygpLFxuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSB8fCAnbGluZScsXG4gICAgICBoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zLFxuICAgICk7XG4gIH1cblxuICBvbGRMaW5lTnVtYmVyTGFiZWwoe2J1ZmZlclJvdywgc29mdFdyYXBwZWR9KSB7XG4gICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKGh1bmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKCcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvbGRSb3cgPSBodW5rLmdldE9sZFJvd0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKHNvZnRXcmFwcGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWQob2xkUm93ID09PSBudWxsID8gJycgOiAn4oCiJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFkKG9sZFJvdyk7XG4gIH1cblxuICBuZXdMaW5lTnVtYmVyTGFiZWwoe2J1ZmZlclJvdywgc29mdFdyYXBwZWR9KSB7XG4gICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKGh1bmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFkKCcnKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdSb3cgPSBodW5rLmdldE5ld1Jvd0F0KGJ1ZmZlclJvdyk7XG4gICAgaWYgKHNvZnRXcmFwcGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWQobmV3Um93ID09PSBudWxsID8gJycgOiAn4oCiJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhZChuZXdSb3cpO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGEgU2V0IG9mIHRoZSBIdW5rcyB0aGF0IGluY2x1ZGUgYXQgbGVhc3Qgb25lIGVkaXRvciBzZWxlY3Rpb24uIFRoZSBzZWxlY3Rpb24gbmVlZCBub3QgY29udGFpbiBhbiBhY3R1YWxcbiAgICogY2hhbmdlIHJvdy5cbiAgICovXG4gIGdldFNlbGVjdGVkSHVua3MoKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFNlbGVjdGVkSHVua3MoZWFjaCA9PiBlYWNoKTtcbiAgfVxuXG4gIHdpdGhTZWxlY3RlZEh1bmtzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKS5yZWR1Y2UoKGFjYywgcmFuZ2UpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgcmFuZ2UuZ2V0Um93cygpKSB7XG4gICAgICAgICAgY29uc3QgaHVuayA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KHJvdyk7XG4gICAgICAgICAgaWYgKCFodW5rIHx8IHNlZW4uaGFzKGh1bmspKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuLmFkZChodW5rKTtcbiAgICAgICAgICBhY2MucHVzaChjYWxsYmFjayhodW5rKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIFtdKTtcbiAgICB9KS5nZXRPcihbXSk7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBTZXQgb2YgRmlsZVBhdGNoZXMgdGhhdCBpbmNsdWRlIGF0IGxlYXN0IG9uZSBlZGl0b3Igc2VsZWN0aW9uLiBUaGUgc2VsZWN0aW9uIG5lZWQgbm90IGNvbnRhaW4gYW4gYWN0dWFsXG4gICAqIGNoYW5nZSByb3cuXG4gICAqL1xuICBnZXRTZWxlY3RlZEZpbGVQYXRjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHBhdGNoZXMgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpKSB7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJhbmdlLmdldFJvd3MoKSkge1xuICAgICAgICAgIGNvbnN0IHBhdGNoID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hBdChyb3cpO1xuICAgICAgICAgIHBhdGNoZXMuYWRkKHBhdGNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGNoZXM7XG4gICAgfSkuZ2V0T3IobmV3IFNldCgpKTtcbiAgfVxuXG4gIGdldEh1bmtCZWZvcmUoaHVuaykge1xuICAgIGNvbnN0IHByZXZSb3cgPSBodW5rLmdldFJhbmdlKCkuc3RhcnQucm93IC0gMTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQocHJldlJvdyk7XG4gIH1cblxuICBnZXRIdW5rQWZ0ZXIoaHVuaykge1xuICAgIGNvbnN0IG5leHRSb3cgPSBodW5rLmdldFJhbmdlKCkuZW5kLnJvdyArIDE7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KG5leHRSb3cpO1xuICB9XG5cbiAgaXNDaGFuZ2VSb3coYnVmZmVyUm93KSB7XG4gICAgY29uc3QgY2hhbmdlTGF5ZXJzID0gW3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0QWRkaXRpb25MYXllcigpLCB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldERlbGV0aW9uTGF5ZXIoKV07XG4gICAgcmV0dXJuIGNoYW5nZUxheWVycy5zb21lKGxheWVyID0+IGxheWVyLmZpbmRNYXJrZXJzKHtpbnRlcnNlY3RzUm93OiBidWZmZXJSb3d9KS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIHdpdGhTZWxlY3Rpb25Nb2RlKGNhbGxiYWNrcykge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gY2FsbGJhY2tzW3RoaXMucHJvcHMuc2VsZWN0aW9uTW9kZV07XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHNlbGVjdGlvbiBtb2RlOiAke3RoaXMucHJvcHMuc2VsZWN0aW9uTW9kZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICBwYWQobnVtKSB7XG4gICAgY29uc3QgbWF4RGlnaXRzID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRNYXhMaW5lTnVtYmVyV2lkdGgoKTtcbiAgICBpZiAobnVtID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gTkJTUF9DSEFSQUNURVIucmVwZWF0KG1heERpZ2l0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOQlNQX0NIQVJBQ1RFUi5yZXBlYXQobWF4RGlnaXRzIC0gbnVtLnRvU3RyaW5nKCkubGVuZ3RoKSArIG51bS50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvRmlsZSA9ICh7Y2hhbmdlZEZpbGVQYXRoLCBjaGFuZ2VkRmlsZVBvc2l0aW9ufSkgPT4ge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGUgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24oY2hhbmdlZEZpbGVQYXRoLCBjaGFuZ2VkRmlsZVBvc2l0aW9uKTtcbiAgICAgIGlmIChyb3cgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGUuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbih7cm93LCBjb2x1bW46IDB9LCB7Y2VudGVyOiB0cnVlfSk7XG4gICAgICBlLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHtyb3csIGNvbHVtbjogMH0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBtZWFzdXJlUGVyZm9ybWFuY2UoYWN0aW9uKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoKGFjdGlvbiA9PT0gJ3VwZGF0ZScgfHwgYWN0aW9uID09PSAnbW91bnQnKVxuICAgICAgJiYgcGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5TmFtZShgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1zdGFydGApLmxlbmd0aCA+IDApIHtcbiAgICAgIHBlcmZvcm1hbmNlLm1hcmsoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tZW5kYCk7XG4gICAgICBwZXJmb3JtYW5jZS5tZWFzdXJlKFxuICAgICAgICBgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWAsXG4gICAgICAgIGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LXN0YXJ0YCxcbiAgICAgICAgYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tZW5kYCk7XG4gICAgICBjb25zdCBwZXJmID0gcGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5TmFtZShgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWApWzBdO1xuICAgICAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcyhgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1zdGFydGApO1xuICAgICAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcyhgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1lbmRgKTtcbiAgICAgIHBlcmZvcm1hbmNlLmNsZWFyTWVhc3VyZXMoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gKTtcbiAgICAgIGFkZEV2ZW50KGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259YCwge1xuICAgICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgICAgZmlsZVBhdGNoZXNMaW5lQ291bnRzOiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCkubWFwKFxuICAgICAgICAgIGZwID0+IGZwLmdldFBhdGNoKCkuZ2V0Q2hhbmdlZExpbmVDb3VudCgpLFxuICAgICAgICApLFxuICAgICAgICBkdXJhdGlvbjogcGVyZi5kdXJhdGlvbixcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxXQUFBLEdBQUFELHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSSxLQUFBLEdBQUFKLE9BQUE7QUFDQSxJQUFBSyxTQUFBLEdBQUFMLE9BQUE7QUFFQSxJQUFBTSxRQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxjQUFBLEdBQUFQLE9BQUE7QUFDQSxJQUFBUSxXQUFBLEdBQUFSLE9BQUE7QUFDQSxJQUFBUyxlQUFBLEdBQUFQLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBVSxPQUFBLEdBQUFSLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBVyxZQUFBLEdBQUFULHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBWSxXQUFBLEdBQUFWLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBYSxPQUFBLEdBQUFYLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBYyxTQUFBLEdBQUFmLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBZSxvQkFBQSxHQUFBYixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQWdCLGtCQUFBLEdBQUFkLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBaUIsZUFBQSxHQUFBZixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQWtCLFVBQUEsR0FBQWhCLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBbUIsZ0JBQUEsR0FBQWpCLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBb0IsaUJBQUEsR0FBQWxCLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBcUIsa0NBQUEsR0FBQW5CLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBc0IsbUJBQUEsR0FBQXBCLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBdUIsS0FBQSxHQUFBckIsc0JBQUEsQ0FBQUYsT0FBQTtBQUF3QyxTQUFBRSx1QkFBQXNCLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFBQSxTQUFBRyx5QkFBQUgsQ0FBQSw2QkFBQUksT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRCx3QkFBQSxZQUFBQSxDQUFBSCxDQUFBLFdBQUFBLENBQUEsR0FBQU0sQ0FBQSxHQUFBRCxDQUFBLEtBQUFMLENBQUE7QUFBQSxTQUFBekIsd0JBQUF5QixDQUFBLEVBQUFLLENBQUEsU0FBQUEsQ0FBQSxJQUFBTCxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxTQUFBRCxDQUFBLGVBQUFBLENBQUEsdUJBQUFBLENBQUEseUJBQUFBLENBQUEsV0FBQUUsT0FBQSxFQUFBRixDQUFBLFFBQUFNLENBQUEsR0FBQUgsd0JBQUEsQ0FBQUUsQ0FBQSxPQUFBQyxDQUFBLElBQUFBLENBQUEsQ0FBQUMsR0FBQSxDQUFBUCxDQUFBLFVBQUFNLENBQUEsQ0FBQUUsR0FBQSxDQUFBUixDQUFBLE9BQUFTLENBQUEsS0FBQUMsU0FBQSxVQUFBQyxDQUFBLEdBQUFDLE1BQUEsQ0FBQUMsY0FBQSxJQUFBRCxNQUFBLENBQUFFLHdCQUFBLFdBQUFDLENBQUEsSUFBQWYsQ0FBQSxvQkFBQWUsQ0FBQSxPQUFBQyxjQUFBLENBQUFDLElBQUEsQ0FBQWpCLENBQUEsRUFBQWUsQ0FBQSxTQUFBRyxDQUFBLEdBQUFQLENBQUEsR0FBQUMsTUFBQSxDQUFBRSx3QkFBQSxDQUFBZCxDQUFBLEVBQUFlLENBQUEsVUFBQUcsQ0FBQSxLQUFBQSxDQUFBLENBQUFWLEdBQUEsSUFBQVUsQ0FBQSxDQUFBQyxHQUFBLElBQUFQLE1BQUEsQ0FBQUMsY0FBQSxDQUFBSixDQUFBLEVBQUFNLENBQUEsRUFBQUcsQ0FBQSxJQUFBVCxDQUFBLENBQUFNLENBQUEsSUFBQWYsQ0FBQSxDQUFBZSxDQUFBLFlBQUFOLENBQUEsQ0FBQVAsT0FBQSxHQUFBRixDQUFBLEVBQUFNLENBQUEsSUFBQUEsQ0FBQSxDQUFBYSxHQUFBLENBQUFuQixDQUFBLEVBQUFTLENBQUEsR0FBQUEsQ0FBQTtBQUFBLFNBQUFXLFFBQUFwQixDQUFBLEVBQUFLLENBQUEsUUFBQUMsQ0FBQSxHQUFBTSxNQUFBLENBQUFTLElBQUEsQ0FBQXJCLENBQUEsT0FBQVksTUFBQSxDQUFBVSxxQkFBQSxRQUFBQyxDQUFBLEdBQUFYLE1BQUEsQ0FBQVUscUJBQUEsQ0FBQXRCLENBQUEsR0FBQUssQ0FBQSxLQUFBa0IsQ0FBQSxHQUFBQSxDQUFBLENBQUFDLE1BQUEsV0FBQW5CLENBQUEsV0FBQU8sTUFBQSxDQUFBRSx3QkFBQSxDQUFBZCxDQUFBLEVBQUFLLENBQUEsRUFBQW9CLFVBQUEsT0FBQW5CLENBQUEsQ0FBQW9CLElBQUEsQ0FBQUMsS0FBQSxDQUFBckIsQ0FBQSxFQUFBaUIsQ0FBQSxZQUFBakIsQ0FBQTtBQUFBLFNBQUFzQixjQUFBNUIsQ0FBQSxhQUFBSyxDQUFBLE1BQUFBLENBQUEsR0FBQXdCLFNBQUEsQ0FBQUMsTUFBQSxFQUFBekIsQ0FBQSxVQUFBQyxDQUFBLFdBQUF1QixTQUFBLENBQUF4QixDQUFBLElBQUF3QixTQUFBLENBQUF4QixDQUFBLFFBQUFBLENBQUEsT0FBQWUsT0FBQSxDQUFBUixNQUFBLENBQUFOLENBQUEsT0FBQXlCLE9BQUEsV0FBQTFCLENBQUEsSUFBQTJCLGVBQUEsQ0FBQWhDLENBQUEsRUFBQUssQ0FBQSxFQUFBQyxDQUFBLENBQUFELENBQUEsU0FBQU8sTUFBQSxDQUFBcUIseUJBQUEsR0FBQXJCLE1BQUEsQ0FBQXNCLGdCQUFBLENBQUFsQyxDQUFBLEVBQUFZLE1BQUEsQ0FBQXFCLHlCQUFBLENBQUEzQixDQUFBLEtBQUFjLE9BQUEsQ0FBQVIsTUFBQSxDQUFBTixDQUFBLEdBQUF5QixPQUFBLFdBQUExQixDQUFBLElBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBYixDQUFBLEVBQUFLLENBQUEsRUFBQU8sTUFBQSxDQUFBRSx3QkFBQSxDQUFBUixDQUFBLEVBQUFELENBQUEsaUJBQUFMLENBQUE7QUFBQSxTQUFBZ0MsZ0JBQUFoQyxDQUFBLEVBQUFLLENBQUEsRUFBQUMsQ0FBQSxZQUFBRCxDQUFBLEdBQUE4QixjQUFBLENBQUE5QixDQUFBLE1BQUFMLENBQUEsR0FBQVksTUFBQSxDQUFBQyxjQUFBLENBQUFiLENBQUEsRUFBQUssQ0FBQSxJQUFBK0IsS0FBQSxFQUFBOUIsQ0FBQSxFQUFBbUIsVUFBQSxNQUFBWSxZQUFBLE1BQUFDLFFBQUEsVUFBQXRDLENBQUEsQ0FBQUssQ0FBQSxJQUFBQyxDQUFBLEVBQUFOLENBQUE7QUFBQSxTQUFBbUMsZUFBQTdCLENBQUEsUUFBQVksQ0FBQSxHQUFBcUIsWUFBQSxDQUFBakMsQ0FBQSx1Q0FBQVksQ0FBQSxHQUFBQSxDQUFBLEdBQUFBLENBQUE7QUFBQSxTQUFBcUIsYUFBQWpDLENBQUEsRUFBQUQsQ0FBQSwyQkFBQUMsQ0FBQSxLQUFBQSxDQUFBLFNBQUFBLENBQUEsTUFBQU4sQ0FBQSxHQUFBTSxDQUFBLENBQUFrQyxNQUFBLENBQUFDLFdBQUEsa0JBQUF6QyxDQUFBLFFBQUFrQixDQUFBLEdBQUFsQixDQUFBLENBQUFpQixJQUFBLENBQUFYLENBQUEsRUFBQUQsQ0FBQSx1Q0FBQWEsQ0FBQSxTQUFBQSxDQUFBLFlBQUF3QixTQUFBLHlFQUFBckMsQ0FBQSxHQUFBc0MsTUFBQSxHQUFBQyxNQUFBLEVBQUF0QyxDQUFBO0FBRXhDLE1BQU11QyxjQUFjLEdBQUc7RUFDckIsQ0FBQ0MsYUFBSSxDQUFDQyxLQUFLLENBQUNDLE1BQU0sR0FBRyxnQkFBZ0I7RUFDckMsQ0FBQ0YsYUFBSSxDQUFDQyxLQUFLLENBQUNFLFVBQVUsR0FBRztBQUMzQixDQUFDO0FBRWMsTUFBTUMsa0JBQWtCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBc0U5REMsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUN0QixlQUFBLHFDQTBXYyxDQUFDdUIsU0FBUyxFQUFFQyxLQUFLLEtBQUs7TUFDakQsTUFBTUMsV0FBVyxHQUFHLENBQUNGLFNBQVMsQ0FBQ0csZUFBZSxDQUFDLENBQUMsQ0FBQ0MsU0FBUyxDQUFDLENBQUM7TUFDNUQsTUFBTUMsT0FBTyxHQUFHTCxTQUFTLENBQUNNLFNBQVMsQ0FBQyxDQUFDLENBQUNDLFFBQVEsQ0FBQyxDQUFDLENBQUNGLE9BQU8sQ0FBQyxDQUFDO01BQzFELE1BQU1HLFlBQVksR0FBR1IsU0FBUyxDQUFDRyxlQUFlLENBQUMsQ0FBQyxDQUFDSyxZQUFZLENBQUMsQ0FBQztNQUMvRCxNQUFNQyxhQUFhLEdBQUdQLFdBQVcsSUFBSSxDQUFDTSxZQUFZO01BQ2xELE1BQU1FLEtBQUssR0FBR1YsU0FBUyxDQUFDVyxhQUFhLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUNDLE9BQU8sQ0FBQyxJQUFJLENBQUNkLEtBQUssQ0FBQ2UsY0FBYyxDQUFDQyxTQUFTLENBQUMsQ0FBQyxDQUFDQyxjQUFjLENBQUMsQ0FBQyxDQUFDO01BQzdHLE1BQU1DLFFBQVEsR0FBR1osT0FBTyxJQUFJSyxLQUFLLEdBQUcsT0FBTyxHQUFHLFFBQVE7TUFFdEQsT0FDRTNGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25HLE1BQUEsQ0FBQW9HLFFBQVE7UUFBQ0MsR0FBRyxFQUFFcEIsU0FBUyxDQUFDcUIsT0FBTyxDQUFDO01BQUUsR0FDakN0RyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUN2RixPQUFBLENBQUFnQixPQUFNO1FBQUMyRSxVQUFVLEVBQUMsT0FBTztRQUFDQyxXQUFXLEVBQUV2QixTQUFTLENBQUNXLGFBQWEsQ0FBQztNQUFFLEdBQ2hFNUYsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDckYsV0FBQSxDQUFBYyxPQUFVO1FBQUM2RSxJQUFJLEVBQUMsT0FBTztRQUFDUCxRQUFRLEVBQUVBLFFBQVM7UUFBQ1EsS0FBSyxFQUFFeEIsS0FBTTtRQUFDeUIsU0FBUyxFQUFDO01BQW1DLEdBQ3RHM0csTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbEYsb0JBQUEsQ0FBQVcsT0FBbUI7UUFDbEJnRixRQUFRLEVBQUUsSUFBSSxDQUFDNUIsS0FBSyxDQUFDNEIsUUFBUztRQUM5QkMsT0FBTyxFQUFFNUIsU0FBUyxDQUFDcUIsT0FBTyxDQUFDLENBQUU7UUFDN0JRLE9BQU8sRUFBRTdCLFNBQVMsQ0FBQzhCLFNBQVMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHOUIsU0FBUyxDQUFDK0IsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFLO1FBQzdFQyxhQUFhLEVBQUUsSUFBSSxDQUFDakMsS0FBSyxDQUFDaUMsYUFBYztRQUN4Q0MsaUJBQWlCLEVBQUUsSUFBSSxDQUFDbEMsS0FBSyxDQUFDa0MsaUJBQWtCO1FBQ2hEQyxjQUFjLEVBQUUsSUFBSSxDQUFDbkMsS0FBSyxDQUFDbUMsY0FBZTtRQUMxQ0MseUJBQXlCLEVBQUUsSUFBSSxDQUFDcEMsS0FBSyxDQUFDb0MseUJBQTBCO1FBRWhFQyxRQUFRLEVBQUUsSUFBSSxDQUFDckMsS0FBSyxDQUFDcUMsUUFBUztRQUU5QkMsZUFBZSxFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDQyx5QkFBeUIsQ0FBQ3RDLFNBQVMsQ0FBRTtRQUNqRXVDLG1CQUFtQixFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDeEMsS0FBSyxDQUFDd0MsbUJBQW1CLENBQUN2QyxTQUFTLENBQUU7UUFDckV3QyxRQUFRLEVBQUVBLENBQUEsS0FBTSxJQUFJLENBQUNDLFdBQVcsQ0FBQztVQUFDQyxpQkFBaUIsRUFBRTFDO1FBQVMsQ0FBQyxDQUFFO1FBQ2pFMkMsVUFBVSxFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDNUMsS0FBSyxDQUFDNEMsVUFBVSxDQUFDM0MsU0FBUyxDQUFFO1FBRW5ERSxXQUFXLEVBQUVBLFdBQVk7UUFDekIwQyxlQUFlLEVBQUVBLENBQUEsS0FBTSxJQUFJLENBQUM3QyxLQUFLLENBQUNlLGNBQWMsQ0FBQytCLGlCQUFpQixDQUFDN0MsU0FBUyxDQUFFO1FBQzlFOEMsYUFBYSxFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDL0MsS0FBSyxDQUFDZSxjQUFjLENBQUNpQyxlQUFlLENBQUMvQyxTQUFTO01BQUUsQ0FDM0UsQ0FBQyxFQUNELENBQUNFLFdBQVcsSUFBSSxJQUFJLENBQUM4Qyx1QkFBdUIsQ0FBQ2hELFNBQVMsQ0FBQyxFQUN2RCxDQUFDRSxXQUFXLElBQUksSUFBSSxDQUFDK0MsOEJBQThCLENBQUNqRCxTQUFTLENBQ3BELENBQ04sQ0FBQyxFQUVSUSxZQUFZLElBQUksSUFBSSxDQUFDMEMsY0FBYyxDQUFDbEQsU0FBUyxFQUFFaUIsUUFBUSxFQUFFaEIsS0FBSyxDQUFDLEVBQy9EUSxhQUFhLElBQUksSUFBSSxDQUFDMEMscUJBQXFCLENBQUNuRCxTQUFTLEVBQUVpQixRQUFRLEVBQUVoQixLQUFLLENBQUMsRUFFdkUsSUFBSSxDQUFDbUQsaUJBQWlCLENBQUNwRCxTQUFTLEVBQUVDLEtBQUssQ0FDaEMsQ0FBQztJQUVmLENBQUM7SUFBQXhCLGVBQUEsc0NBMlM2QixNQUFNO01BQ2xDLElBQUksSUFBSSxDQUFDc0IsS0FBSyxDQUFDbUMsY0FBYyxFQUFFO1FBQzdCLE1BQU1tQixtQkFBbUIsR0FBR0MsS0FBSyxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDckU7UUFDQSxJQUFJLElBQUksQ0FBQ3pELEtBQUssQ0FBQzRCLFFBQVEsS0FBSzhCLHdCQUFlLEVBQUU7VUFDM0MsSUFBSSxDQUFDMUQsS0FBSyxDQUFDc0MsZUFBZSxDQUFDZ0IsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBQ0ssV0FBVyxFQUFFO2NBQUNDLE9BQU8sRUFBRTtZQUFXO1VBQUMsQ0FBQyxDQUFDO1FBQzNGO01BQ0Y7SUFDRixDQUFDO0lBQUFsRixlQUFBLG9DQUUyQnVCLFNBQVMsSUFBSTtNQUN2QyxJQUFJLENBQUNELEtBQUssQ0FBQ3NDLGVBQWUsQ0FBQ3JDLFNBQVMsRUFBRTtRQUFDMEQsV0FBVyxFQUFFO01BQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFBQWpGLGVBQUEsc0NBRTZCLE1BQU07TUFDbEMsT0FBTyxJQUFJLENBQUNzQixLQUFLLENBQUM2RCxXQUFXLENBQzNCLElBQUksQ0FBQzdELEtBQUssQ0FBQzhELFlBQVksRUFDdkIsSUFBSSxDQUFDOUQsS0FBSyxDQUFDK0QsYUFBYSxFQUN4QjtRQUFDSixXQUFXLEVBQUU7VUFBQ0MsT0FBTyxFQUFFO1FBQStCO01BQUMsQ0FDMUQsQ0FBQztJQUNILENBQUM7SUFBQWxGLGVBQUEsOEJBdU5xQixNQUFNO01BQzFCLE9BQU9zRixPQUFPLENBQUNDLEdBQUcsQ0FDaEJWLEtBQUssQ0FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQ0Msc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQ3RDdkYsTUFBTSxDQUFDZ0csRUFBRSxJQUFJQSxFQUFFLENBQUNDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUMxQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ3FFLGdCQUFnQixDQUNwQyxDQUFDO0lBQ0gsQ0FBQztJQUFBM0YsZUFBQSxpQ0FFd0IsTUFBTTtNQUM3QixPQUFPc0YsT0FBTyxDQUFDQyxHQUFHLENBQ2hCVixLQUFLLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUNDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUN0Q3ZGLE1BQU0sQ0FBQ2dHLEVBQUUsSUFBSUEsRUFBRSxDQUFDSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQ2hDRixHQUFHLENBQUMsSUFBSSxDQUFDcEUsS0FBSyxDQUFDdUUsbUJBQW1CLENBQ3ZDLENBQUM7SUFDSCxDQUFDO0lBQUE3RixlQUFBLHVCQTZQYyxDQUFDO01BQUM4RixlQUFlO01BQUVDO0lBQW1CLENBQUMsS0FBSztNQUN6RDtNQUNBLElBQUksQ0FBQ0MsU0FBUyxDQUFDTixHQUFHLENBQUMxSCxDQUFDLElBQUk7UUFDdEIsTUFBTWlJLEdBQUcsR0FBRyxJQUFJLENBQUMzRSxLQUFLLENBQUNlLGNBQWMsQ0FBQzZELDJCQUEyQixDQUFDSixlQUFlLEVBQUVDLG1CQUFtQixDQUFDO1FBQ3ZHLElBQUlFLEdBQUcsS0FBSyxJQUFJLEVBQUU7VUFDaEIsT0FBTyxJQUFJO1FBQ2I7UUFFQWpJLENBQUMsQ0FBQ21JLHNCQUFzQixDQUFDO1VBQUNGLEdBQUc7VUFBRUcsTUFBTSxFQUFFO1FBQUMsQ0FBQyxFQUFFO1VBQUNDLE1BQU0sRUFBRTtRQUFJLENBQUMsQ0FBQztRQUMxRHJJLENBQUMsQ0FBQ3NJLHVCQUF1QixDQUFDO1VBQUNMLEdBQUc7VUFBRUcsTUFBTSxFQUFFO1FBQUMsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSTtNQUNiLENBQUMsQ0FBQztJQUNKLENBQUM7SUFqc0NDLElBQUFHLGlCQUFRLEVBQ04sSUFBSSxFQUNKLHNCQUFzQixFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixFQUFFLFlBQVksRUFDNUYsWUFBWSxFQUFFLHdCQUF3QixFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUM5RSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUseUJBQXlCLEVBQUUscUJBQXFCLEVBQ2xGLG9CQUFvQixFQUFFLG9CQUN4QixDQUFDO0lBRUQsSUFBSSxDQUFDQyx3QkFBd0IsR0FBRyxLQUFLO0lBQ3JDLElBQUksQ0FBQ0MsaUJBQWlCLEdBQUcsSUFBSTtJQUM3QixJQUFJLENBQUNDLGlCQUFpQixHQUFHLElBQUk7SUFDN0IsSUFBSSxDQUFDQyxPQUFPLEdBQUcsSUFBSUMsa0JBQVMsQ0FBQyxDQUFDO0lBQzlCLElBQUksQ0FBQ1osU0FBUyxHQUFHLElBQUlZLGtCQUFTLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUNDLGdCQUFnQixHQUFHLElBQUlELGtCQUFTLENBQUMsQ0FBQztJQUN2QyxJQUFJLENBQUNFLE9BQU8sR0FBRyxLQUFLO0lBRXBCLElBQUksQ0FBQ0MsSUFBSSxHQUFHLElBQUlDLDZCQUFtQixDQUFDLENBQUM7SUFFckMsSUFBSSxDQUFDRCxJQUFJLENBQUNFLEdBQUcsQ0FDWCxJQUFJLENBQUNqQixTQUFTLENBQUNrQixPQUFPLENBQUNDLE1BQU0sSUFBSTtNQUMvQixJQUFJLENBQUNOLGdCQUFnQixDQUFDTyxNQUFNLENBQUNELE1BQU0sQ0FBQ0UsVUFBVSxDQUFDLENBQUMsQ0FBQztNQUNqRCxJQUFJLElBQUksQ0FBQy9GLEtBQUssQ0FBQzBFLFNBQVMsRUFBRTtRQUN4QixJQUFJLENBQUMxRSxLQUFLLENBQUMwRSxTQUFTLENBQUNvQixNQUFNLENBQUNELE1BQU0sQ0FBQztNQUNyQztJQUNGLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQ04sZ0JBQWdCLENBQUNLLE9BQU8sQ0FBQ0ksT0FBTyxJQUFJO01BQ3ZDLElBQUksQ0FBQ2hHLEtBQUssQ0FBQ2lHLGVBQWUsSUFBSSxJQUFJLENBQUNqRyxLQUFLLENBQUNpRyxlQUFlLENBQUNILE1BQU0sQ0FBQ0UsT0FBTyxDQUFDO0lBQzFFLENBQUMsQ0FDSCxDQUFDOztJQUVEO0lBQ0EsSUFBSSxDQUFDRSxlQUFlLEdBQUcsS0FBSztJQUM1QixJQUFJQyxhQUFhLEdBQUcsSUFBSTtJQUN4QixJQUFJQyxjQUFjLEdBQUcsSUFBSTtJQUN6QixJQUFJQyxrQkFBa0IsR0FBRyxJQUFJO0lBQzdCLElBQUksQ0FBQ1osSUFBSSxDQUFDRSxHQUFHLENBQ1gsSUFBSSxDQUFDM0YsS0FBSyxDQUFDc0csaUJBQWlCLENBQUMsTUFBTTtNQUNqQyxJQUFJLENBQUNKLGVBQWUsR0FBRyxJQUFJO01BQzNCLElBQUksQ0FBQ3hCLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJO1FBQzNCUSxrQkFBa0IsR0FBRyxJQUFJLENBQUNyRyxLQUFLLENBQUNlLGNBQWMsQ0FBQ3dGLG9CQUFvQixDQUFDLElBQUksQ0FBQ3ZHLEtBQUssQ0FBQzhELFlBQVksQ0FBQztRQUM1RnFDLGFBQWEsR0FBR04sTUFBTSxDQUFDRSxVQUFVLENBQUMsQ0FBQyxDQUFDUyxZQUFZLENBQUMsQ0FBQztRQUNsREosY0FBYyxHQUFHUCxNQUFNLENBQUNFLFVBQVUsQ0FBQyxDQUFDLENBQUNVLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sSUFBSTtNQUNiLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQ3pHLEtBQUssQ0FBQzBHLGdCQUFnQixDQUFDQyxTQUFTLElBQUk7TUFDdkMsSUFBSSxDQUFDakMsU0FBUyxDQUFDTixHQUFHLENBQUN5QixNQUFNLElBQUk7UUFDM0I7UUFDQSxJQUFJUSxrQkFBa0IsS0FBSyxJQUFJLEVBQUU7VUFDL0IsTUFBTU8sa0JBQWtCLEdBQUdELFNBQVMsQ0FBQ0UseUJBQXlCLENBQUNSLGtCQUFrQixDQUFDO1VBQ2xGLElBQUksSUFBSSxDQUFDckcsS0FBSyxDQUFDK0QsYUFBYSxLQUFLLE1BQU0sRUFBRTtZQUN2QyxJQUFJLENBQUNxQixpQkFBaUIsR0FBRyxNQUFNO1lBQy9CUyxNQUFNLENBQUNpQixzQkFBc0IsQ0FBQ0Ysa0JBQWtCLENBQUM7VUFDbkQsQ0FBQyxNQUFNO1lBQ0wsTUFBTUcsU0FBUyxHQUFHLElBQUlDLEdBQUcsQ0FDdkJDLFdBQUssQ0FBQ0MsVUFBVSxDQUFDTixrQkFBa0IsQ0FBQyxDQUFDTyxPQUFPLENBQUMsQ0FBQyxDQUMzQy9DLEdBQUcsQ0FBQ08sR0FBRyxJQUFJZ0MsU0FBUyxDQUFDUyxTQUFTLENBQUN6QyxHQUFHLENBQUMsQ0FBQyxDQUNwQ3pHLE1BQU0sQ0FBQ21KLE9BQU8sQ0FDbkIsQ0FBQztZQUNDO1lBQ0YsTUFBTUMsVUFBVSxHQUFHUCxTQUFTLENBQUNRLElBQUksR0FBRyxDQUFDLEdBQ2pDaEUsS0FBSyxDQUFDQyxJQUFJLENBQUN1RCxTQUFTLEVBQUVTLElBQUksSUFBSUEsSUFBSSxDQUFDaEgsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUM5QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0QixJQUFJLENBQUM0RSxpQkFBaUIsR0FBRyxNQUFNO1lBQy9CUyxNQUFNLENBQUM0Qix1QkFBdUIsQ0FBQ0gsVUFBVSxDQUFDO1VBQzVDO1FBQ0Y7O1FBRUE7UUFDQSxJQUFJbkIsYUFBYSxLQUFLLElBQUksRUFBRTtVQUFFTixNQUFNLENBQUNFLFVBQVUsQ0FBQyxDQUFDLENBQUMyQixZQUFZLENBQUN2QixhQUFhLENBQUM7UUFBRTs7UUFFL0U7UUFDQSxJQUFJQyxjQUFjLEtBQUssSUFBSSxFQUFFO1VBQUVQLE1BQU0sQ0FBQ0UsVUFBVSxDQUFDLENBQUMsQ0FBQzRCLGFBQWEsQ0FBQ3ZCLGNBQWMsQ0FBQztRQUFFO1FBQ2xGLE9BQU8sSUFBSTtNQUNiLENBQUMsQ0FBQztNQUNGLElBQUksQ0FBQ0YsZUFBZSxHQUFHLEtBQUs7TUFDNUIsSUFBSSxDQUFDMEIscUJBQXFCLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQ0gsQ0FBQztFQUNIO0VBRUFDLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLElBQUksQ0FBQ3JDLE9BQU8sR0FBRyxJQUFJO0lBQ25CLElBQUksQ0FBQ3NDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztJQUVoQ0MsTUFBTSxDQUFDQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDQyxVQUFVLENBQUM7SUFDbkQsSUFBSSxDQUFDdkQsU0FBUyxDQUFDTixHQUFHLENBQUN5QixNQUFNLElBQUk7TUFDM0I7TUFDQSxNQUFNLENBQUNxQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUNsSSxLQUFLLENBQUNlLGNBQWMsQ0FBQ29ILGNBQWMsQ0FBQyxDQUFDO01BQy9ELE1BQU0sQ0FBQ0MsU0FBUyxDQUFDLEdBQUdGLFVBQVUsQ0FBQ0csUUFBUSxDQUFDLENBQUM7TUFDekMsSUFBSSxDQUFDRCxTQUFTLEVBQUU7UUFDZCxPQUFPLElBQUk7TUFDYjtNQUVBLElBQUksQ0FBQ2hELGlCQUFpQixHQUFHLE1BQU07TUFDL0JTLE1BQU0sQ0FBQ2lCLHNCQUFzQixDQUFDc0IsU0FBUyxDQUFDNUgsUUFBUSxDQUFDLENBQUMsQ0FBQztNQUNuRCxPQUFPLElBQUk7SUFDYixDQUFDLENBQUM7SUFFRixJQUFJLENBQUNpRixJQUFJLENBQUNFLEdBQUcsQ0FDWCxJQUFJLENBQUMzRixLQUFLLENBQUNzSSxNQUFNLENBQUNDLFdBQVcsQ0FBQywyQkFBMkIsRUFBRSxNQUFNLElBQUksQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQ0FDckYsQ0FBQztJQUVELE1BQU07TUFBQ0MsbUJBQW1CO01BQUVDO0lBQXVCLENBQUMsR0FBRyxJQUFJLENBQUMxSSxLQUFLOztJQUVqRTtJQUNBLElBQUl5SSxtQkFBbUIsSUFBSUMsdUJBQXVCLElBQUksQ0FBQyxFQUFFO01BQ3ZELElBQUksQ0FBQ0MsWUFBWSxDQUFDO1FBQ2hCbkUsZUFBZSxFQUFFaUUsbUJBQW1CO1FBQ3BDaEUsbUJBQW1CLEVBQUVpRTtNQUN2QixDQUFDLENBQUM7SUFDSjs7SUFFQTtJQUNBLElBQUksSUFBSSxDQUFDMUksS0FBSyxDQUFDNEksY0FBYyxFQUFFO01BQzdCLElBQUksQ0FBQ25ELElBQUksQ0FBQ0UsR0FBRyxDQUNYLElBQUksQ0FBQzNGLEtBQUssQ0FBQzRJLGNBQWMsQ0FBQyxJQUFJLENBQUNELFlBQVksQ0FDN0MsQ0FBQztJQUNIO0VBQ0Y7RUFFQUUsa0JBQWtCQSxDQUFDQyxTQUFTLEVBQUU7SUFDNUIsSUFBSSxDQUFDaEIsa0JBQWtCLENBQUMsUUFBUSxDQUFDO0lBRWpDLElBQUlnQixTQUFTLENBQUM3QyxlQUFlLEtBQUssSUFBSSxDQUFDakcsS0FBSyxDQUFDaUcsZUFBZSxFQUFFO01BQzVENkMsU0FBUyxDQUFDN0MsZUFBZSxJQUFJNkMsU0FBUyxDQUFDN0MsZUFBZSxDQUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO01BQ25FLElBQUksQ0FBQzlGLEtBQUssQ0FBQ2lHLGVBQWUsSUFBSSxJQUFJLENBQUNWLGdCQUFnQixDQUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ2lHLGVBQWUsQ0FBQ0gsTUFBTSxDQUFDO0lBQzVGO0lBRUEsSUFBSSxJQUFJLENBQUM5RixLQUFLLENBQUNlLGNBQWMsS0FBSytILFNBQVMsQ0FBQy9ILGNBQWMsRUFBRTtNQUMxRCxJQUFJLENBQUNxRSxpQkFBaUIsR0FBRyxJQUFJO0lBQy9CO0VBQ0Y7RUFFQTJELG9CQUFvQkEsQ0FBQSxFQUFHO0lBQ3JCaEIsTUFBTSxDQUFDaUIsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQ2YsVUFBVSxDQUFDO0lBQ3RELElBQUksQ0FBQ3hDLElBQUksQ0FBQ3dELE9BQU8sQ0FBQyxDQUFDO0lBQ25CLElBQUksQ0FBQ3pELE9BQU8sR0FBRyxLQUFLO0lBQ3BCMEQsV0FBVyxDQUFDQyxVQUFVLENBQUMsQ0FBQztJQUN4QkQsV0FBVyxDQUFDRSxhQUFhLENBQUMsQ0FBQztFQUM3QjtFQUVBQyxNQUFNQSxDQUFBLEVBQUc7SUFDUCxNQUFNQyxTQUFTLEdBQUcsSUFBQUMsbUJBQUUsRUFDbEIsc0JBQXNCLEVBQ3RCO01BQUMsQ0FBQyx5QkFBeUIsSUFBSSxDQUFDdkosS0FBSyxDQUFDaUMsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDakMsS0FBSyxDQUFDaUM7SUFBYSxDQUFDLEVBQ2pGO01BQUMsNkJBQTZCLEVBQUUsQ0FBQyxJQUFJLENBQUNqQyxLQUFLLENBQUNlLGNBQWMsQ0FBQ3lJLFVBQVUsQ0FBQztJQUFDLENBQUMsRUFDeEU7TUFBQyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUN4SixLQUFLLENBQUMrRCxhQUFhLEtBQUs7SUFBTSxDQUN4RSxDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUN5QixPQUFPLEVBQUU7TUFDaEIwRCxXQUFXLENBQUNPLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQztJQUNyRCxDQUFDLE1BQU07TUFDTFAsV0FBVyxDQUFDTyxJQUFJLENBQUMsZ0NBQWdDLENBQUM7SUFDcEQ7SUFFQSxPQUNFek8sTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQTtNQUFLUSxTQUFTLEVBQUUySCxTQUFVO01BQUNJLEdBQUcsRUFBRSxJQUFJLENBQUNyRSxPQUFPLENBQUNTO0lBQU8sR0FDakQsSUFBSSxDQUFDNkQsY0FBYyxDQUFDLENBQUMsRUFFdEIzTyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBO01BQU1RLFNBQVMsRUFBQztJQUFnQyxHQUM3QyxJQUFJLENBQUMzQixLQUFLLENBQUNlLGNBQWMsQ0FBQ3lJLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDSSxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDQyxnQkFBZ0IsQ0FBQyxDQUN6RixDQUNILENBQUM7RUFFVjtFQUVBRixjQUFjQSxDQUFBLEVBQUc7SUFDZixJQUFJLElBQUksQ0FBQzNKLEtBQUssQ0FBQzRCLFFBQVEsS0FBS2tJLHlCQUFnQixJQUFJLElBQUksQ0FBQzlKLEtBQUssQ0FBQzRCLFFBQVEsS0FBS21JLDJCQUFrQixFQUFFO01BQzFGLE9BQ0UvTyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRixTQUFBLENBQUFZLE9BQVE7UUFBQ29OLFFBQVEsRUFBRSxJQUFJLENBQUNoSyxLQUFLLENBQUNpSyxRQUFTO1FBQUNDLE1BQU0sRUFBRSxJQUFJLENBQUM3RTtNQUFRLEdBQzVEckssTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztRQUFDdkcsT0FBTyxFQUFDLHlCQUF5QjtRQUFDd0csUUFBUSxFQUFFLElBQUksQ0FBQ0M7TUFBZSxDQUFFLENBQUMsRUFDNUVyUCxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRixTQUFBLENBQUFtTyxPQUFPO1FBQUN2RyxPQUFPLEVBQUMsNkJBQTZCO1FBQUN3RyxRQUFRLEVBQUUsSUFBSSxDQUFDRTtNQUFtQixDQUFFLENBQUMsRUFDcEZ0UCxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRixTQUFBLENBQUFtTyxPQUFPO1FBQUN2RyxPQUFPLEVBQUMsb0NBQW9DO1FBQUN3RyxRQUFRLEVBQUUsSUFBSSxDQUFDRztNQUF1QixDQUFFLENBQ3RGLENBQUM7SUFFZjtJQUVBLElBQUlDLGdCQUFnQixHQUFHLElBQUk7SUFDM0IsSUFBSUMsbUJBQW1CLEdBQUcsSUFBSTtJQUU5QixJQUFJLElBQUksQ0FBQ3pLLEtBQUssQ0FBQ2UsY0FBYyxDQUFDMkosMEJBQTBCLENBQUMsQ0FBQyxFQUFFO01BQzFELE1BQU05RyxPQUFPLEdBQUcsSUFBSSxDQUFDNUQsS0FBSyxDQUFDaUMsYUFBYSxLQUFLLFVBQVUsR0FDbkQsK0JBQStCLEdBQy9CLGlDQUFpQztNQUNyQ3VJLGdCQUFnQixHQUFHeFAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztRQUFDdkcsT0FBTyxFQUFFQSxPQUFRO1FBQUN3RyxRQUFRLEVBQUUsSUFBSSxDQUFDTztNQUFvQixDQUFFLENBQUM7SUFDdEY7SUFFQSxJQUFJLElBQUksQ0FBQzNLLEtBQUssQ0FBQ2UsY0FBYyxDQUFDNkosaUJBQWlCLENBQUMsQ0FBQyxFQUFFO01BQ2pELE1BQU1oSCxPQUFPLEdBQUcsSUFBSSxDQUFDNUQsS0FBSyxDQUFDaUMsYUFBYSxLQUFLLFVBQVUsR0FDbkQsNkJBQTZCLEdBQzdCLCtCQUErQjtNQUNuQ3dJLG1CQUFtQixHQUFHelAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztRQUFDdkcsT0FBTyxFQUFFQSxPQUFRO1FBQUN3RyxRQUFRLEVBQUUsSUFBSSxDQUFDUztNQUF1QixDQUFFLENBQUM7SUFDNUY7SUFFQSxPQUNFN1AsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBWSxPQUFRO01BQUNvTixRQUFRLEVBQUUsSUFBSSxDQUFDaEssS0FBSyxDQUFDaUssUUFBUztNQUFDQyxNQUFNLEVBQUUsSUFBSSxDQUFDN0U7SUFBUSxHQUM1RHJLLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25GLFNBQUEsQ0FBQW1PLE9BQU87TUFBQ3ZHLE9BQU8sRUFBQyx5QkFBeUI7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUNDO0lBQWUsQ0FBRSxDQUFDLEVBQzVFclAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztNQUFDdkcsT0FBTyxFQUFDLDZCQUE2QjtNQUFDd0csUUFBUSxFQUFFLElBQUksQ0FBQ0U7SUFBbUIsQ0FBRSxDQUFDLEVBQ3BGdFAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztNQUFDdkcsT0FBTyxFQUFDLGNBQWM7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUNVO0lBQVcsQ0FBRSxDQUFDLEVBQzdEOVAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztNQUFDdkcsT0FBTyxFQUFDLFdBQVc7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUNXO0lBQTRCLENBQUUsQ0FBQyxFQUMzRS9QLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25GLFNBQUEsQ0FBQW1PLE9BQU87TUFBQ3ZHLE9BQU8sRUFBQywrQkFBK0I7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUNZO0lBQTRCLENBQUUsQ0FBQyxFQUMvRmhRLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25GLFNBQUEsQ0FBQW1PLE9BQU87TUFBQ3ZHLE9BQU8sRUFBQyxxQkFBcUI7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUMxSDtJQUFZLENBQUUsQ0FBQyxFQUNyRTFILE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25GLFNBQUEsQ0FBQW1PLE9BQU87TUFBQ3ZHLE9BQU8sRUFBQyxnQkFBZ0I7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUNwSyxLQUFLLENBQUNpTDtJQUFRLENBQUUsQ0FBQyxFQUNsRWpRLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25GLFNBQUEsQ0FBQW1PLE9BQU87TUFBQ3ZHLE9BQU8sRUFBQyxvQ0FBb0M7TUFBQ3dHLFFBQVEsRUFBRSxJQUFJLENBQUNHO0lBQXVCLENBQUUsQ0FBQyxFQUM5RkMsZ0JBQWdCLEVBQ2hCQyxtQkFBbUIsRUFDbkIsMEJBQTJCUyxJQUFJLENBQUNDLFNBQVMsQ0FBQyxDQUFDLElBQzFDblEsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztNQUFDdkcsT0FBTyxFQUFDLHNCQUFzQjtNQUFDd0csUUFBUSxFQUFFQSxDQUFBLEtBQU07UUFDdEQ7UUFDQWdCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ3JMLEtBQUssQ0FBQ2UsY0FBYyxDQUFDdUssY0FBYyxDQUFDLENBQUMsQ0FBQ0MsT0FBTyxDQUFDO1VBQzdEQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTTtRQUM5QixDQUFDLENBQUMsQ0FBQztNQUNMO0lBQUUsQ0FDRCxDQUFDLEVBRUgsMEJBQTJCTixJQUFJLENBQUNDLFNBQVMsQ0FBQyxDQUFDLElBQzFDblEsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkYsU0FBQSxDQUFBbU8sT0FBTztNQUFDdkcsT0FBTyxFQUFDLHdCQUF3QjtNQUFDd0csUUFBUSxFQUFFQSxDQUFBLEtBQU07UUFDeEQ7UUFDQWdCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ3JMLEtBQUssQ0FBQ2UsY0FBYyxDQUFDdUssY0FBYyxDQUFDLENBQUMsQ0FBQ0MsT0FBTyxDQUFDO1VBQzdEQyxVQUFVLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQy9ELENBQUMsQ0FBQyxDQUFDO01BQ0w7SUFBRSxDQUNELENBQUMsRUFFSCwwQkFBMkJOLElBQUksQ0FBQ0MsU0FBUyxDQUFDLENBQUMsSUFDMUNuUSxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRixTQUFBLENBQUFtTyxPQUFPO01BQUN2RyxPQUFPLEVBQUMsb0JBQW9CO01BQUN3RyxRQUFRLEVBQUVBLENBQUEsS0FBTTtRQUNwRDtRQUNBZ0IsT0FBTyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDckwsS0FBSyxDQUFDZSxjQUFjLENBQUN3SyxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQ2xEO0lBQUUsQ0FDRCxDQUVLLENBQUM7RUFFZjtFQUVBMUIsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDakIsT0FBTzdPLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUE7TUFBR1EsU0FBUyxFQUFDO0lBQTZDLDBCQUF5QixDQUFDO0VBQzdGO0VBRUFpSSxtQkFBbUJBLENBQUEsRUFBRztJQUNwQixPQUNFNU8sTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDeEYsZUFBQSxDQUFBaUIsT0FBYztNQUNiNk8sU0FBUyxFQUFFLElBQUksQ0FBQ3pMLEtBQUssQ0FBQ3lMLFNBQVU7TUFFaENDLE1BQU0sRUFBRSxJQUFJLENBQUMxTCxLQUFLLENBQUNlLGNBQWMsQ0FBQ0MsU0FBUyxDQUFDLENBQUU7TUFDOUMySyx1QkFBdUIsRUFBRSxLQUFNO01BQy9CQyxTQUFTLEVBQUUsS0FBTTtNQUNqQkMsVUFBVSxFQUFFLEtBQU07TUFDbEJDLFFBQVEsRUFBRSxJQUFLO01BQ2ZDLFdBQVcsRUFBRSxJQUFLO01BRWxCQyxlQUFlLEVBQUUsSUFBSSxDQUFDQSxlQUFnQjtNQUN0Q0MsdUJBQXVCLEVBQUUsSUFBSSxDQUFDQSx1QkFBd0I7TUFDdERDLG1CQUFtQixFQUFFLElBQUksQ0FBQ0EsbUJBQW9CO01BQzlDQyxRQUFRLEVBQUUsSUFBSSxDQUFDekgsU0FBVTtNQUN6QjBILGFBQWEsRUFBRTtJQUFLLEdBRXBCcFIsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDcEYsT0FBQSxDQUFBYSxPQUFNO01BQ0x5UCxJQUFJLEVBQUMsa0JBQWtCO01BQ3ZCQyxRQUFRLEVBQUUsQ0FBRTtNQUNaM0ssU0FBUyxFQUFDLEtBQUs7TUFDZkYsSUFBSSxFQUFDLGFBQWE7TUFDbEI4SyxPQUFPLEVBQUUsSUFBSSxDQUFDQyxrQkFBbUI7TUFDakNDLFdBQVcsRUFBRSxJQUFJLENBQUNDLHdCQUF5QjtNQUMzQ0MsV0FBVyxFQUFFLElBQUksQ0FBQ0M7SUFBeUIsQ0FDNUMsQ0FBQyxFQUNGNVIsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDcEYsT0FBQSxDQUFBYSxPQUFNO01BQ0x5UCxJQUFJLEVBQUMsa0JBQWtCO01BQ3ZCQyxRQUFRLEVBQUUsQ0FBRTtNQUNaM0ssU0FBUyxFQUFDLEtBQUs7TUFDZkYsSUFBSSxFQUFDLGFBQWE7TUFDbEI4SyxPQUFPLEVBQUUsSUFBSSxDQUFDTSxrQkFBbUI7TUFDakNKLFdBQVcsRUFBRSxJQUFJLENBQUNDLHdCQUF5QjtNQUMzQ0MsV0FBVyxFQUFFLElBQUksQ0FBQ0M7SUFBeUIsQ0FDNUMsQ0FBQyxFQUNGNVIsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDcEYsT0FBQSxDQUFBYSxPQUFNO01BQ0x5UCxJQUFJLEVBQUMscUJBQXFCO01BQzFCQyxRQUFRLEVBQUUsQ0FBRTtNQUNaM0ssU0FBUyxFQUFDLFNBQVM7TUFDbkJGLElBQUksRUFBQztJQUFXLENBQ2pCLENBQUMsRUFDRCxJQUFJLENBQUN6QixLQUFLLENBQUNzSSxNQUFNLENBQUNwTCxHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFDakRsQyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNwRixPQUFBLENBQUFhLE9BQU07TUFDTHlQLElBQUksRUFBQyxZQUFZO01BQ2pCQyxRQUFRLEVBQUUsQ0FBRTtNQUNaN0ssSUFBSSxFQUFDLGFBQWE7TUFDbEJFLFNBQVMsRUFBQyxPQUFPO01BQ2pCNEssT0FBTyxFQUFFTyxtQkFBVztNQUNwQkwsV0FBVyxFQUFFLElBQUksQ0FBQ0Msd0JBQXlCO01BQzNDQyxXQUFXLEVBQUUsSUFBSSxDQUFDQztJQUF5QixDQUM1QyxDQUNGLEVBRUEsSUFBSSxDQUFDRyxvQkFBb0IsQ0FBQyxDQUFDLEVBRTNCLElBQUksQ0FBQy9NLEtBQUssQ0FBQ2UsY0FBYyxDQUFDb0gsY0FBYyxDQUFDLENBQUMsQ0FBQy9ELEdBQUcsQ0FBQyxJQUFJLENBQUM0SSwwQkFBMEIsQ0FBQyxFQUUvRSxJQUFJLENBQUNDLHFCQUFxQixDQUN6QjFKLEtBQUssQ0FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQ3hELEtBQUssQ0FBQzhELFlBQVksRUFBRWEsR0FBRyxJQUFJc0MsV0FBSyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxDQUFDdkMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUNBLEdBQUcsRUFBRXVJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6RixxQ0FBcUMsRUFDckM7TUFBQ0MsTUFBTSxFQUFFLElBQUk7TUFBRUMsSUFBSSxFQUFFLElBQUk7TUFBRUMsSUFBSSxFQUFFO0lBQUksQ0FDdkMsQ0FBQyxFQUVBLElBQUksQ0FBQ0Msd0JBQXdCLENBQzVCLElBQUksQ0FBQ3ROLEtBQUssQ0FBQ2UsY0FBYyxDQUFDd00sZ0JBQWdCLENBQUMsQ0FBQyxFQUM1QyxrQ0FBa0MsRUFDbEM7TUFBQ0gsSUFBSSxFQUFFLElBQUk7TUFBRUMsSUFBSSxFQUFFO0lBQUksQ0FDekIsQ0FBQyxFQUNBLElBQUksQ0FBQ0Msd0JBQXdCLENBQzVCLElBQUksQ0FBQ3ROLEtBQUssQ0FBQ2UsY0FBYyxDQUFDeU0sZ0JBQWdCLENBQUMsQ0FBQyxFQUM1QyxvQ0FBb0MsRUFDcEM7TUFBQ0osSUFBSSxFQUFFLElBQUk7TUFBRUMsSUFBSSxFQUFFO0lBQUksQ0FDekIsQ0FBQyxFQUNBLElBQUksQ0FBQ0Msd0JBQXdCLENBQzVCLElBQUksQ0FBQ3ROLEtBQUssQ0FBQ2UsY0FBYyxDQUFDME0saUJBQWlCLENBQUMsQ0FBQyxFQUM3QyxzQ0FBc0MsRUFDdEM7TUFBQ0wsSUFBSSxFQUFFLElBQUk7TUFBRUMsSUFBSSxFQUFFO0lBQUksQ0FDekIsQ0FFYyxDQUFDO0VBRXJCO0VBRUFOLG9CQUFvQkEsQ0FBQSxFQUFHO0lBQ3JCLElBQUksSUFBSSxDQUFDL00sS0FBSyxDQUFDNEIsUUFBUSxLQUFLbUksMkJBQWtCLElBQzFDLElBQUksQ0FBQy9KLEtBQUssQ0FBQzBOLHFCQUFxQixFQUFFO01BQ3BDLE9BQU8sSUFBSTtJQUNiO0lBRUEsT0FBTyxJQUFJLENBQUMxTixLQUFLLENBQUMyTixvQkFBb0IsQ0FBQ3ZKLEdBQUcsQ0FBQyxDQUFDO01BQUN3SixRQUFRO01BQUVDO0lBQU0sQ0FBQyxLQUFLO01BQ2pFLE1BQU07UUFBQ0MsSUFBSTtRQUFFNU07TUFBUSxDQUFDLEdBQUcwTSxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQ3BDLElBQUksQ0FBQyxJQUFJLENBQUM1TixLQUFLLENBQUNlLGNBQWMsQ0FBQ2dOLGVBQWUsQ0FBQ0QsSUFBSSxDQUFDLEVBQUU7UUFDcEQsT0FBTyxJQUFJO01BQ2I7TUFFQSxNQUFNbkosR0FBRyxHQUFHLElBQUksQ0FBQzNFLEtBQUssQ0FBQ2UsY0FBYyxDQUFDNkQsMkJBQTJCLENBQUNrSixJQUFJLEVBQUU1TSxRQUFRLENBQUM7TUFDakYsSUFBSXlELEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDaEIsT0FBTyxJQUFJO01BQ2I7TUFFQSxNQUFNcUosYUFBYSxHQUFHLElBQUksQ0FBQ2hPLEtBQUssQ0FBQzhELFlBQVksQ0FBQzdHLEdBQUcsQ0FBQzBILEdBQUcsQ0FBQztNQUN0RCxPQUNFM0osTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDNUUsa0NBQUEsQ0FBQUssT0FBaUM7UUFDaEN5RSxHQUFHLEVBQUUsb0NBQW9Dd00sTUFBTSxDQUFDSSxFQUFFLEVBQUc7UUFDckRDLFVBQVUsRUFBRXZKLEdBQUk7UUFDaEJ3SixRQUFRLEVBQUVOLE1BQU0sQ0FBQ0ksRUFBRztRQUNwQnhDLFNBQVMsRUFBRSxJQUFJLENBQUN6TCxLQUFLLENBQUN5TCxTQUFVO1FBQ2hDMkMsUUFBUSxFQUFFLElBQUksQ0FBQ3BPLEtBQUssQ0FBQ29PLFFBQVM7UUFDOUJDLEtBQUssRUFBRSxJQUFJLENBQUNyTyxLQUFLLENBQUNxTyxLQUFNO1FBQ3hCQyxJQUFJLEVBQUUsSUFBSSxDQUFDdE8sS0FBSyxDQUFDc08sSUFBSztRQUN0QkMsTUFBTSxFQUFFLElBQUksQ0FBQ3ZPLEtBQUssQ0FBQ3VPLE1BQU87UUFDMUJDLE9BQU8sRUFBRSxJQUFJLENBQUN4TyxLQUFLLENBQUN5TyxXQUFZO1FBQ2hDQyxZQUFZLEVBQUVWLGFBQWEsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLEdBQUcsRUFBRztRQUMzRVcsTUFBTSxFQUFFLElBQUksQ0FBQzVPLFdBQVcsQ0FBQ3NNO01BQUssQ0FDL0IsQ0FBQztJQUVOLENBQUMsQ0FBQztFQUNKO0VBK0NBbEosY0FBY0EsQ0FBQ2xELFNBQVMsRUFBRWlCLFFBQVEsRUFBRTBOLFdBQVcsRUFBRTtJQUMvQyxNQUFNQyxRQUFRLEdBQUdBLENBQUEsS0FBTTtNQUNyQixJQUFBQyx1QkFBUSxFQUFDLG1CQUFtQixFQUFFO1FBQUNDLFNBQVMsRUFBRSxJQUFJLENBQUNoUCxXQUFXLENBQUNzTSxJQUFJO1FBQUUyQyxPQUFPLEVBQUU7TUFBUSxDQUFDLENBQUM7TUFDcEYsSUFBSSxDQUFDaFAsS0FBSyxDQUFDZSxjQUFjLENBQUNpQyxlQUFlLENBQUMvQyxTQUFTLENBQUM7SUFDdEQsQ0FBQztJQUNELE9BQ0VqRixNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUN2RixPQUFBLENBQUFnQixPQUFNO01BQUMyRSxVQUFVLEVBQUMsT0FBTztNQUFDQyxXQUFXLEVBQUV2QixTQUFTLENBQUNXLGFBQWEsQ0FBQztJQUFFLEdBQ2hFNUYsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDckYsV0FBQSxDQUFBYyxPQUFVO01BQ1Q2RSxJQUFJLEVBQUMsT0FBTztNQUNaQyxLQUFLLEVBQUVrTixXQUFXLEdBQUcsR0FBSTtNQUN6QjFOLFFBQVEsRUFBRUEsUUFBUztNQUNuQlMsU0FBUyxFQUFDO0lBQW1DLEdBRTdDM0csTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQTtNQUFHUSxTQUFTLEVBQUM7SUFBNkMsb0VBRXhEM0csTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxXQUFLLENBQUMsRUFDTm5HLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUE7TUFBUVEsU0FBUyxFQUFDLHFDQUFxQztNQUFDc04sT0FBTyxFQUFFSjtJQUFTLGVBQW1CLENBQzVGLENBRU8sQ0FDTixDQUFDO0VBRWI7RUFFQXpMLHFCQUFxQkEsQ0FBQ25ELFNBQVMsRUFBRWlCLFFBQVEsRUFBRTBOLFdBQVcsRUFBRTtJQUN0RCxPQUNFNVQsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDdkYsT0FBQSxDQUFBZ0IsT0FBTTtNQUFDMkUsVUFBVSxFQUFDLE9BQU87TUFBQ0MsV0FBVyxFQUFFdkIsU0FBUyxDQUFDVyxhQUFhLENBQUM7SUFBRSxHQUNoRTVGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ3JGLFdBQUEsQ0FBQWMsT0FBVTtNQUNUNkUsSUFBSSxFQUFDLE9BQU87TUFDWkMsS0FBSyxFQUFFa04sV0FBVyxHQUFHLEdBQUk7TUFDekIxTixRQUFRLEVBQUVBLFFBQVM7TUFDbkJTLFNBQVMsRUFBQztJQUFtQyxHQUU3QzNHLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUE7TUFBR1EsU0FBUyxFQUFDO0lBQWdELDRFQUUxRCxDQUVPLENBQ04sQ0FBQztFQUViO0VBRUF1Qiw4QkFBOEJBLENBQUNqRCxTQUFTLEVBQUU7SUFDeEMsSUFBSSxDQUFDQSxTQUFTLENBQUNrRSx1QkFBdUIsQ0FBQyxDQUFDLEVBQUU7TUFDeEMsT0FBTyxJQUFJO0lBQ2I7SUFFQSxNQUFNK0ssT0FBTyxHQUFHalAsU0FBUyxDQUFDa1AsVUFBVSxDQUFDLENBQUM7SUFDdEMsTUFBTUMsT0FBTyxHQUFHblAsU0FBUyxDQUFDb1AsVUFBVSxDQUFDLENBQUM7SUFFdEMsTUFBTUMsS0FBSyxHQUFHLElBQUksQ0FBQ3RQLEtBQUssQ0FBQ2lDLGFBQWEsS0FBSyxVQUFVLEdBQ2pEO01BQ0FzTixVQUFVLEVBQUUsZ0JBQWdCO01BQzVCQyxVQUFVLEVBQUU7SUFDZCxDQUFDLEdBQ0M7TUFDQUQsVUFBVSxFQUFFLGNBQWM7TUFDMUJDLFVBQVUsRUFBRTtJQUNkLENBQUM7SUFFSCxPQUNFeFUsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDakYsa0JBQUEsQ0FBQVUsT0FBaUI7TUFDaEI2UyxLQUFLLEVBQUMsYUFBYTtNQUNuQkYsVUFBVSxFQUFFRCxLQUFLLENBQUNDLFVBQVc7TUFDN0JDLFVBQVUsRUFBRUYsS0FBSyxDQUFDRSxVQUFXO01BQzdCNU4sUUFBUSxFQUFFLElBQUksQ0FBQzVCLEtBQUssQ0FBQzRCLFFBQVM7TUFDOUI4TixNQUFNLEVBQUVBLENBQUEsS0FBTSxJQUFJLENBQUMxUCxLQUFLLENBQUNxRSxnQkFBZ0IsQ0FBQ3BFLFNBQVM7SUFBRSxHQUNyRGpGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25HLE1BQUEsQ0FBQW9HLFFBQVEsNkJBRVBwRyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBO01BQU1RLFNBQVMsRUFBQztJQUFzRSxZQUM5RXBDLGNBQWMsQ0FBQzJQLE9BQU8sQ0FBQyxPQUFFbFUsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxlQUFPK04sT0FBYyxDQUNoRCxDQUFDLEVBQ1BsVSxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBO01BQU1RLFNBQVMsRUFBQztJQUFvRSxVQUM5RXBDLGNBQWMsQ0FBQzZQLE9BQU8sQ0FBQyxPQUFFcFUsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxlQUFPaU8sT0FBYyxDQUM5QyxDQUNFLENBQ08sQ0FBQztFQUV4QjtFQUVBbk0sdUJBQXVCQSxDQUFDaEQsU0FBUyxFQUFFO0lBQ2pDLElBQUksQ0FBQ0EsU0FBUyxDQUFDMFAsVUFBVSxDQUFDLENBQUMsRUFBRTtNQUMzQixPQUFPLElBQUk7SUFDYjtJQUVBLElBQUlDLE1BQU0sR0FBRzVVLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsWUFBTSxDQUFDO0lBQ3BCLElBQUlzTyxLQUFLLEdBQUcsRUFBRTtJQUNkLE1BQU1JLFVBQVUsR0FBRzVQLFNBQVMsQ0FBQzZQLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLE1BQU1DLFVBQVUsR0FBRzlQLFNBQVMsQ0FBQytQLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLElBQUlILFVBQVUsSUFBSUUsVUFBVSxFQUFFO01BQzVCSCxNQUFNLEdBQ0o1VSxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRyxNQUFBLENBQUFvRyxRQUFRLDJCQUVQcEcsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQTtRQUFNUSxTQUFTLEVBQUUsSUFBQTRILG1CQUFFLEVBQ2pCLCtCQUErQixFQUMvQiwwQ0FBMEMsRUFDMUMsd0NBQ0Y7TUFBRSxZQUNLdk8sTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxlQUFPME8sVUFBaUIsQ0FDekIsQ0FBQyxFQUNQN1UsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQTtRQUFNUSxTQUFTLEVBQUUsSUFBQTRILG1CQUFFLEVBQ2pCLCtCQUErQixFQUMvQiwwQ0FBMEMsRUFDMUMsc0NBQ0Y7TUFBRSxVQUNHdk8sTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxlQUFPNE8sVUFBaUIsQ0FDdkIsQ0FBQyxLQUNDLENBQ1g7TUFDRE4sS0FBSyxHQUFHLGlCQUFpQjtJQUMzQixDQUFDLE1BQU0sSUFBSUksVUFBVSxJQUFJLENBQUNFLFVBQVUsRUFBRTtNQUNwQ0gsTUFBTSxHQUNKNVUsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkcsTUFBQSxDQUFBb0csUUFBUSxtQkFFUHBHLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUE7UUFBTVEsU0FBUyxFQUFDO01BQXNFLFVBQ2pGM0csTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxlQUFPME8sVUFBaUIsQ0FDdkIsQ0FBQyxZQUVDLENBQ1g7TUFDREosS0FBSyxHQUFHLGlCQUFpQjtJQUMzQixDQUFDLE1BQU07TUFDTEcsTUFBTSxHQUNKNVUsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDbkcsTUFBQSxDQUFBb0csUUFBUSxtQkFFUHBHLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUE7UUFBTVEsU0FBUyxFQUFDO01BQW9FLFVBQy9FM0csTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxlQUFPNE8sVUFBaUIsQ0FDdkIsQ0FBQyxZQUVDLENBQ1g7TUFDRE4sS0FBSyxHQUFHLGlCQUFpQjtJQUMzQjtJQUVBLE1BQU1ILEtBQUssR0FBRyxJQUFJLENBQUN0UCxLQUFLLENBQUNpQyxhQUFhLEtBQUssVUFBVSxHQUNqRDtNQUNBc04sVUFBVSxFQUFFLGdCQUFnQjtNQUM1QkMsVUFBVSxFQUFFO0lBQ2QsQ0FBQyxHQUNDO01BQ0FELFVBQVUsRUFBRSxjQUFjO01BQzFCQyxVQUFVLEVBQUU7SUFDZCxDQUFDO0lBRUgsT0FDRXhVLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ2pGLGtCQUFBLENBQUFVLE9BQWlCO01BQ2hCNlMsS0FBSyxFQUFFQSxLQUFNO01BQ2JGLFVBQVUsRUFBRUQsS0FBSyxDQUFDQyxVQUFXO01BQzdCQyxVQUFVLEVBQUVGLEtBQUssQ0FBQ0UsVUFBVztNQUM3QjVOLFFBQVEsRUFBRSxJQUFJLENBQUM1QixLQUFLLENBQUM0QixRQUFTO01BQzlCOE4sTUFBTSxFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDMVAsS0FBSyxDQUFDdUUsbUJBQW1CLENBQUN0RSxTQUFTO0lBQUUsR0FDeERqRixNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRyxNQUFBLENBQUFvRyxRQUFRLFFBQ053TyxNQUNPLENBQ08sQ0FBQztFQUV4QjtFQUVBdk0saUJBQWlCQSxDQUFDcEQsU0FBUyxFQUFFMk8sV0FBVyxFQUFFO0lBQ3hDLE1BQU1xQixVQUFVLEdBQUcsSUFBSSxDQUFDalEsS0FBSyxDQUFDaUMsYUFBYSxLQUFLLFVBQVUsR0FBRyxPQUFPLEdBQUcsU0FBUztJQUNoRixNQUFNaU8sYUFBYSxHQUFHLElBQUlsSixHQUFHLENBQzNCekQsS0FBSyxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDeEQsS0FBSyxDQUFDOEQsWUFBWSxFQUFFYSxHQUFHLElBQUksSUFBSSxDQUFDM0UsS0FBSyxDQUFDZSxjQUFjLENBQUNxRyxTQUFTLENBQUN6QyxHQUFHLENBQUMsQ0FDckYsQ0FBQztJQUVELE9BQ0UzSixNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRyxNQUFBLENBQUFvRyxRQUFRLFFBQ1BwRyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUN0RixZQUFBLENBQUFlLE9BQVcsUUFDVHFELFNBQVMsQ0FBQ29JLFFBQVEsQ0FBQyxDQUFDLENBQUNqRSxHQUFHLENBQUMsQ0FBQ29ELElBQUksRUFBRXRILEtBQUssS0FBSztNQUN6QyxNQUFNaVEsaUJBQWlCLEdBQUcsSUFBSSxDQUFDblEsS0FBSyxDQUFDK0QsYUFBYSxLQUFLLE1BQU0sSUFBSW1NLGFBQWEsQ0FBQ2pULEdBQUcsQ0FBQ3VLLElBQUksQ0FBQztNQUN4RixNQUFNNEksVUFBVSxHQUFJLElBQUksQ0FBQ3BRLEtBQUssQ0FBQytELGFBQWEsS0FBSyxNQUFNLElBQUttTSxhQUFhLENBQUNqVCxHQUFHLENBQUN1SyxJQUFJLENBQUM7TUFFbkYsSUFBSTZJLFlBQVksR0FBRyxFQUFFO01BQ3JCLElBQUlGLGlCQUFpQixFQUFFO1FBQ3JCRSxZQUFZLElBQUksZUFBZTtRQUMvQixJQUFJLElBQUksQ0FBQ3JRLEtBQUssQ0FBQzhELFlBQVksQ0FBQ3lELElBQUksR0FBRyxDQUFDLEVBQUU7VUFDcEM4SSxZQUFZLElBQUksR0FBRztRQUNyQjtNQUNGLENBQUMsTUFBTTtRQUNMQSxZQUFZLElBQUksTUFBTTtRQUN0QixJQUFJSCxhQUFhLENBQUMzSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1VBQzFCOEksWUFBWSxJQUFJLEdBQUc7UUFDckI7TUFDRjtNQUVBLE1BQU1DLG9CQUFvQixHQUFHLEdBQUdMLFVBQVUsSUFBSUksWUFBWSxFQUFFO01BQzVELE1BQU1FLHFCQUFxQixHQUFHLFdBQVdGLFlBQVksRUFBRTtNQUV2RCxNQUFNRyxVQUFVLEdBQUdoSixJQUFJLENBQUNoSCxRQUFRLENBQUMsQ0FBQyxDQUFDSyxLQUFLO01BQ3hDLE1BQU00UCxVQUFVLEdBQUcsSUFBSXhKLFdBQUssQ0FBQ3VKLFVBQVUsRUFBRUEsVUFBVSxDQUFDO01BRXBELE9BQ0V4VixNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUN2RixPQUFBLENBQUFnQixPQUFNO1FBQUN5RSxHQUFHLEVBQUUsY0FBY25CLEtBQUssRUFBRztRQUFDc0IsV0FBVyxFQUFFaVAsVUFBVztRQUFDbFAsVUFBVSxFQUFDO01BQU8sR0FDN0V2RyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNyRixXQUFBLENBQUFjLE9BQVU7UUFBQzZFLElBQUksRUFBQyxPQUFPO1FBQUNDLEtBQUssRUFBRWtOLFdBQVcsR0FBRyxHQUFJO1FBQUNqTixTQUFTLEVBQUM7TUFBbUMsR0FDOUYzRyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNoRixlQUFBLENBQUFTLE9BQWM7UUFDYjhULFNBQVMsRUFBRSxJQUFJLENBQUNuTCxnQkFBaUI7UUFDakNpQyxJQUFJLEVBQUVBLElBQUs7UUFDWDRJLFVBQVUsRUFBRUEsVUFBVztRQUN2Qm5PLGFBQWEsRUFBRSxJQUFJLENBQUNqQyxLQUFLLENBQUNpQyxhQUFjO1FBQ3hDOEIsYUFBYSxFQUFDLE1BQU07UUFDcEJ1TSxvQkFBb0IsRUFBRUEsb0JBQXFCO1FBQzNDQyxxQkFBcUIsRUFBRUEscUJBQXNCO1FBRTdDbE8sUUFBUSxFQUFFLElBQUksQ0FBQ3JDLEtBQUssQ0FBQ3FDLFFBQVM7UUFDOUJzTyxPQUFPLEVBQUUsSUFBSSxDQUFDM1EsS0FBSyxDQUFDMlEsT0FBUTtRQUU1QkMsZUFBZSxFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDQyxtQkFBbUIsQ0FBQ3JKLElBQUksRUFBRTJJLGlCQUFpQixDQUFFO1FBQ3pFVyxnQkFBZ0IsRUFBRUEsQ0FBQSxLQUFNLElBQUksQ0FBQ0Msb0JBQW9CLENBQUN2SixJQUFJLEVBQUUySSxpQkFBaUIsQ0FBRTtRQUMzRWEsU0FBUyxFQUFFLElBQUksQ0FBQ0Msb0JBQXFCO1FBQ3JDclAsUUFBUSxFQUFFLElBQUksQ0FBQzVCLEtBQUssQ0FBQzRCO01BQVMsQ0FDL0IsQ0FDUyxDQUNOLENBQUM7SUFFYixDQUFDLENBQ1UsQ0FDTCxDQUFDO0VBRWY7RUFFQXFMLHFCQUFxQkEsQ0FBQ2lFLE1BQU0sRUFBRUMsU0FBUyxFQUFFO0lBQUM5RCxJQUFJO0lBQUVGLE1BQU07SUFBRUMsSUFBSTtJQUFFZ0U7RUFBUyxDQUFDLEVBQUU7SUFDeEUsSUFBSUYsTUFBTSxDQUFDMVMsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUN2QixPQUFPLElBQUk7SUFDYjtJQUVBLE1BQU02UyxNQUFNLEdBQUdELFNBQVMsSUFBSSxJQUFJOUwsa0JBQVMsQ0FBQyxDQUFDO0lBQzNDLE9BQ0V0SyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUN0RixZQUFBLENBQUFlLE9BQVc7TUFBQzBVLFdBQVcsRUFBRUQsTUFBTSxDQUFDdkw7SUFBTyxHQUNyQ29MLE1BQU0sQ0FBQzlNLEdBQUcsQ0FBQyxDQUFDbU4sS0FBSyxFQUFFclIsS0FBSyxLQUFLO01BQzVCLE9BQ0VsRixNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUN2RixPQUFBLENBQUFnQixPQUFNO1FBQ0x5RSxHQUFHLEVBQUUsUUFBUThQLFNBQVMsSUFBSWpSLEtBQUssRUFBRztRQUNsQ3NCLFdBQVcsRUFBRStQLEtBQU07UUFDbkJoUSxVQUFVLEVBQUM7TUFBTyxDQUNuQixDQUFDO0lBRU4sQ0FBQyxDQUFDLEVBQ0QsSUFBSSxDQUFDaVEsaUJBQWlCLENBQUNMLFNBQVMsRUFBRTtNQUFDOUQsSUFBSTtNQUFFRixNQUFNO01BQUVDO0lBQUksQ0FBQyxDQUM1QyxDQUFDO0VBRWxCO0VBRUFFLHdCQUF3QkEsQ0FBQ21FLEtBQUssRUFBRU4sU0FBUyxFQUFFO0lBQUM5RCxJQUFJO0lBQUVGLE1BQU07SUFBRUM7RUFBSSxDQUFDLEVBQUU7SUFDL0QsSUFBSXFFLEtBQUssQ0FBQ0MsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDaEMsT0FBTyxJQUFJO0lBQ2I7SUFFQSxPQUNFMVcsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDdEYsWUFBQSxDQUFBZSxPQUFXO01BQUMrVSxRQUFRLEVBQUVGO0lBQU0sR0FDMUIsSUFBSSxDQUFDRCxpQkFBaUIsQ0FBQ0wsU0FBUyxFQUFFO01BQUM5RCxJQUFJO01BQUVGLE1BQU07TUFBRUM7SUFBSSxDQUFDLENBQzVDLENBQUM7RUFFbEI7RUFFQW9FLGlCQUFpQkEsQ0FBQ0wsU0FBUyxFQUFFO0lBQUM5RCxJQUFJO0lBQUVGLE1BQU07SUFBRUM7RUFBSSxDQUFDLEVBQUU7SUFDakQsT0FDRXBTLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ25HLE1BQUEsQ0FBQW9HLFFBQVEsUUFDTmlNLElBQUksSUFDSHJTLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ3JGLFdBQUEsQ0FBQWMsT0FBVTtNQUNUNkUsSUFBSSxFQUFDLE1BQU07TUFDWEUsU0FBUyxFQUFFd1AsU0FBVTtNQUNyQlMsZ0JBQWdCLEVBQUU7SUFBTSxDQUN6QixDQUNGLEVBQ0F6RSxNQUFNLElBQ0xuUyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNuRyxNQUFBLENBQUFvRyxRQUFRLFFBQ1BwRyxNQUFBLENBQUE0QixPQUFBLENBQUF1RSxhQUFBLENBQUNyRixXQUFBLENBQUFjLE9BQVU7TUFDVDZFLElBQUksRUFBQyxhQUFhO01BQ2xCb1EsVUFBVSxFQUFDLGtCQUFrQjtNQUM3QmxRLFNBQVMsRUFBRXdQLFNBQVU7TUFDckJTLGdCQUFnQixFQUFFO0lBQU0sQ0FDekIsQ0FBQyxFQUNGNVcsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDckYsV0FBQSxDQUFBYyxPQUFVO01BQ1Q2RSxJQUFJLEVBQUMsYUFBYTtNQUNsQm9RLFVBQVUsRUFBQyxrQkFBa0I7TUFDN0JsUSxTQUFTLEVBQUV3UCxTQUFVO01BQ3JCUyxnQkFBZ0IsRUFBRTtJQUFNLENBQ3pCLENBQUMsRUFDRjVXLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQXVFLGFBQUEsQ0FBQ3JGLFdBQUEsQ0FBQWMsT0FBVTtNQUNUNkUsSUFBSSxFQUFDLFFBQVE7TUFDYm9RLFVBQVUsRUFBQyxxQkFBcUI7TUFDaENsUSxTQUFTLEVBQUUsd0NBQXdDd1AsU0FBUyxFQUFHO01BQy9EUyxnQkFBZ0IsRUFBRTtJQUFNLENBQ3pCLENBQ08sQ0FDWCxFQUNBeEUsSUFBSSxJQUNIcFMsTUFBQSxDQUFBNEIsT0FBQSxDQUFBdUUsYUFBQSxDQUFDckYsV0FBQSxDQUFBYyxPQUFVO01BQ1Q2RSxJQUFJLEVBQUMsYUFBYTtNQUNsQm9RLFVBQVUsRUFBQyxZQUFZO01BQ3ZCbFEsU0FBUyxFQUFFd1AsU0FBVTtNQUNyQlMsZ0JBQWdCLEVBQUU7SUFBTSxDQUN6QixDQUVLLENBQUM7RUFFZjtFQXdCQWYsbUJBQW1CQSxDQUFDckosSUFBSSxFQUFFMkksaUJBQWlCLEVBQUU7SUFDM0MsSUFBSUEsaUJBQWlCLEVBQUU7TUFDckIsT0FBTyxJQUFJLENBQUNuUSxLQUFLLENBQUM4UixVQUFVLENBQzFCLElBQUksQ0FBQzlSLEtBQUssQ0FBQzhELFlBQVksRUFDdkIsSUFBSSxDQUFDOUQsS0FBSyxDQUFDK0QsYUFBYSxFQUN4QjtRQUFDSixXQUFXLEVBQUU7TUFBUSxDQUN4QixDQUFDO0lBQ0gsQ0FBQyxNQUFNO01BQ0wsTUFBTW9PLFVBQVUsR0FBRyxJQUFJL0ssR0FBRyxDQUN4QlEsSUFBSSxDQUFDd0ssVUFBVSxDQUFDLENBQUMsQ0FDZEMsTUFBTSxDQUFDLENBQUNDLElBQUksRUFBRUMsTUFBTSxLQUFLO1FBQ3hCRCxJQUFJLENBQUM5VCxJQUFJLENBQUMsR0FBRytULE1BQU0sQ0FBQ0MsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNwQyxPQUFPRixJQUFJO01BQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FDVCxDQUFDO01BQ0QsT0FBTyxJQUFJLENBQUNsUyxLQUFLLENBQUM4UixVQUFVLENBQzFCQyxVQUFVLEVBQ1YsTUFBTSxFQUNOO1FBQUNwTyxXQUFXLEVBQUU7TUFBUSxDQUN4QixDQUFDO0lBQ0g7RUFDRjtFQUVBb04sb0JBQW9CQSxDQUFDdkosSUFBSSxFQUFFMkksaUJBQWlCLEVBQUU7SUFDNUMsSUFBSUEsaUJBQWlCLEVBQUU7TUFDckIsT0FBTyxJQUFJLENBQUNuUSxLQUFLLENBQUM2RCxXQUFXLENBQzNCLElBQUksQ0FBQzdELEtBQUssQ0FBQzhELFlBQVksRUFDdkIsSUFBSSxDQUFDOUQsS0FBSyxDQUFDK0QsYUFBYSxFQUN4QjtRQUFDSixXQUFXLEVBQUU7TUFBUSxDQUN4QixDQUFDO0lBQ0gsQ0FBQyxNQUFNO01BQ0wsTUFBTW9PLFVBQVUsR0FBRyxJQUFJL0ssR0FBRyxDQUN4QlEsSUFBSSxDQUFDd0ssVUFBVSxDQUFDLENBQUMsQ0FDZEMsTUFBTSxDQUFDLENBQUNDLElBQUksRUFBRUMsTUFBTSxLQUFLO1FBQ3hCRCxJQUFJLENBQUM5VCxJQUFJLENBQUMsR0FBRytULE1BQU0sQ0FBQ0MsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNwQyxPQUFPRixJQUFJO01BQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FDVCxDQUFDO01BQ0QsT0FBTyxJQUFJLENBQUNsUyxLQUFLLENBQUM2RCxXQUFXLENBQUNrTyxVQUFVLEVBQUUsTUFBTSxFQUFFO1FBQUNwTyxXQUFXLEVBQUU7TUFBUSxDQUFDLENBQUM7SUFDNUU7RUFDRjtFQUVBc04sb0JBQW9CQSxDQUFDb0IsS0FBSyxFQUFFN0ssSUFBSSxFQUFFO0lBQ2hDLElBQUksQ0FBQ3BDLGlCQUFpQixHQUFHLE1BQU07SUFDL0IsSUFBSSxDQUFDa04sb0JBQW9CLENBQUNELEtBQUssRUFBRTdLLElBQUksQ0FBQ2hILFFBQVEsQ0FBQyxDQUFDLENBQUM7RUFDbkQ7RUFFQWtNLHdCQUF3QkEsQ0FBQzJGLEtBQUssRUFBRTtJQUM5QixNQUFNaEYsSUFBSSxHQUFHZ0YsS0FBSyxDQUFDRSxTQUFTO0lBQzVCLElBQUlsRixJQUFJLEtBQUttRixTQUFTLElBQUlDLEtBQUssQ0FBQ3BGLElBQUksQ0FBQyxFQUFFO01BQ3JDO0lBQ0Y7SUFFQSxJQUFJLENBQUNqSSxpQkFBaUIsR0FBRyxNQUFNO0lBQy9CLElBQUksSUFBSSxDQUFDa04sb0JBQW9CLENBQUNELEtBQUssQ0FBQ0ssUUFBUSxFQUFFLENBQUMsQ0FBQ3JGLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDQSxJQUFJLEVBQUVILFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUM1RSxJQUFJLENBQUNoSSx3QkFBd0IsR0FBRyxJQUFJO0lBQ3RDO0VBQ0Y7RUFFQTBILHdCQUF3QkEsQ0FBQ3lGLEtBQUssRUFBRTtJQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDbk4sd0JBQXdCLEVBQUU7TUFDbEM7SUFDRjtJQUVBLE1BQU1tSSxJQUFJLEdBQUdnRixLQUFLLENBQUNFLFNBQVM7SUFDNUIsSUFBSSxJQUFJLENBQUNwTixpQkFBaUIsS0FBS2tJLElBQUksSUFBSUEsSUFBSSxLQUFLbUYsU0FBUyxJQUFJQyxLQUFLLENBQUNwRixJQUFJLENBQUMsRUFBRTtNQUN4RTtJQUNGO0lBQ0EsSUFBSSxDQUFDbEksaUJBQWlCLEdBQUdrSSxJQUFJO0lBRTdCLElBQUksQ0FBQ2pJLGlCQUFpQixHQUFHLE1BQU07SUFDL0IsSUFBSSxDQUFDa04sb0JBQW9CLENBQUNELEtBQUssQ0FBQ0ssUUFBUSxFQUFFLENBQUMsQ0FBQ3JGLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDQSxJQUFJLEVBQUVILFFBQVEsQ0FBQyxDQUFDLEVBQUU7TUFBQ3ZILEdBQUcsRUFBRTtJQUFJLENBQUMsQ0FBQztFQUN2RjtFQUVBc0MsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsSUFBSSxDQUFDL0Msd0JBQXdCLEdBQUcsS0FBSztFQUN2QztFQUVBb04sb0JBQW9CQSxDQUFDRCxLQUFLLEVBQUVNLFNBQVMsRUFBRUMsSUFBSSxFQUFFO0lBQzNDLElBQUlQLEtBQUssQ0FBQ1EsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUN0QixPQUFPLEtBQUs7SUFDZDtJQUVBLE1BQU1DLFNBQVMsR0FBR0MsT0FBTyxDQUFDQyxRQUFRLEtBQUssT0FBTztJQUM5QyxJQUFJWCxLQUFLLENBQUNZLE9BQU8sSUFBSSxDQUFDSCxTQUFTLEVBQUU7TUFDL0I7TUFDQSxPQUFPLEtBQUs7SUFDZDtJQUVBLE1BQU1JLE9BQU8sR0FBQTVVLGFBQUE7TUFDWHFILEdBQUcsRUFBRTtJQUFLLEdBQ1BpTixJQUFJLENBQ1I7O0lBRUQ7SUFDQSxNQUFNTyxTQUFTLEdBQUdsTSxXQUFLLENBQUNDLFVBQVUsQ0FBQ3lMLFNBQVMsQ0FBQztJQUM3QyxNQUFNcEIsS0FBSyxHQUFHLElBQUksQ0FBQzdNLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJQSxNQUFNLENBQUN1TixlQUFlLENBQUNELFNBQVMsQ0FBQyxDQUFDLENBQUNFLEtBQUssQ0FBQ0YsU0FBUyxDQUFDO0lBRTlGLElBQUlkLEtBQUssQ0FBQ2lCLE9BQU8sS0FBSSwwQkFBNEJqQixLQUFLLENBQUNZLE9BQU8sSUFBSUgsU0FBUyxDQUFDLEVBQUU7TUFDNUUsSUFBSSxDQUFDcE8sU0FBUyxDQUFDTixHQUFHLENBQUN5QixNQUFNLElBQUk7UUFDM0IsSUFBSTBOLFVBQVUsR0FBRyxLQUFLO1FBQ3RCLElBQUlDLE9BQU8sR0FBRyxJQUFJO1FBRWxCLEtBQUssTUFBTUMsU0FBUyxJQUFJNU4sTUFBTSxDQUFDNk4sYUFBYSxDQUFDLENBQUMsRUFBRTtVQUM5QyxJQUFJRCxTQUFTLENBQUNFLHFCQUFxQixDQUFDcEMsS0FBSyxDQUFDLEVBQUU7WUFDMUM7WUFDQTtZQUNBZ0MsVUFBVSxHQUFHLElBQUk7WUFDakIsTUFBTUssY0FBYyxHQUFHSCxTQUFTLENBQUNJLGNBQWMsQ0FBQyxDQUFDO1lBRWpELE1BQU1DLFNBQVMsR0FBRyxFQUFFO1lBRXBCLElBQUksQ0FBQ3ZDLEtBQUssQ0FBQzFRLEtBQUssQ0FBQ0MsT0FBTyxDQUFDOFMsY0FBYyxDQUFDL1MsS0FBSyxDQUFDLEVBQUU7Y0FDOUM7Y0FDQSxJQUFJa1QsTUFBTSxHQUFHeEMsS0FBSyxDQUFDMVEsS0FBSztjQUN4QixJQUFJMFEsS0FBSyxDQUFDMVEsS0FBSyxDQUFDaUUsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDNUIsTUFBTWtQLFVBQVUsR0FBR25PLE1BQU0sQ0FBQzdFLFNBQVMsQ0FBQyxDQUFDLENBQUNpVCxnQkFBZ0IsQ0FBQzFDLEtBQUssQ0FBQzFRLEtBQUssQ0FBQzhELEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzNFb1AsTUFBTSxHQUFHLENBQUN4QyxLQUFLLENBQUMxUSxLQUFLLENBQUM4RCxHQUFHLEdBQUcsQ0FBQyxFQUFFcVAsVUFBVSxDQUFDO2NBQzVDO2NBRUFGLFNBQVMsQ0FBQzFWLElBQUksQ0FBQyxDQUFDd1YsY0FBYyxDQUFDL1MsS0FBSyxFQUFFa1QsTUFBTSxDQUFDLENBQUM7WUFDaEQ7WUFFQSxJQUFJLENBQUN4QyxLQUFLLENBQUMyQyxHQUFHLENBQUNwVCxPQUFPLENBQUM4UyxjQUFjLENBQUNNLEdBQUcsQ0FBQyxFQUFFO2NBQzFDO2NBQ0EsSUFBSUgsTUFBTSxHQUFHeEMsS0FBSyxDQUFDMkMsR0FBRztjQUN0QixNQUFNRixVQUFVLEdBQUduTyxNQUFNLENBQUM3RSxTQUFTLENBQUMsQ0FBQyxDQUFDaVQsZ0JBQWdCLENBQUMxQyxLQUFLLENBQUMyQyxHQUFHLENBQUN2UCxHQUFHLENBQUM7Y0FDckUsSUFBSTRNLEtBQUssQ0FBQzJDLEdBQUcsQ0FBQ3BQLE1BQU0sS0FBS2tQLFVBQVUsRUFBRTtnQkFDbkNELE1BQU0sR0FBRyxDQUFDeEMsS0FBSyxDQUFDMkMsR0FBRyxDQUFDdlAsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Y0FDakM7Y0FFQW1QLFNBQVMsQ0FBQzFWLElBQUksQ0FBQyxDQUFDMlYsTUFBTSxFQUFFSCxjQUFjLENBQUNNLEdBQUcsQ0FBQyxDQUFDO1lBQzlDO1lBRUEsSUFBSUosU0FBUyxDQUFDdFYsTUFBTSxHQUFHLENBQUMsRUFBRTtjQUN4QmlWLFNBQVMsQ0FBQ1UsY0FBYyxDQUFDTCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDdEMsS0FBSyxNQUFNTSxRQUFRLElBQUlOLFNBQVMsQ0FBQ08sS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN6Q3hPLE1BQU0sQ0FBQ3lPLDBCQUEwQixDQUFDRixRQUFRLEVBQUU7a0JBQUNHLFFBQVEsRUFBRWQsU0FBUyxDQUFDZSxVQUFVLENBQUM7Z0JBQUMsQ0FBQyxDQUFDO2NBQ2pGO1lBQ0YsQ0FBQyxNQUFNO2NBQ0xoQixPQUFPLEdBQUdDLFNBQVM7WUFDckI7VUFDRjtRQUNGO1FBRUEsSUFBSUQsT0FBTyxLQUFLLElBQUksRUFBRTtVQUNwQixNQUFNaUIsaUJBQWlCLEdBQUc1TyxNQUFNLENBQUM2TixhQUFhLENBQUMsQ0FBQyxDQUM3Q3hWLE1BQU0sQ0FBQ3dXLElBQUksSUFBSUEsSUFBSSxLQUFLbEIsT0FBTyxDQUFDLENBQ2hDcFAsR0FBRyxDQUFDc1EsSUFBSSxJQUFJQSxJQUFJLENBQUNiLGNBQWMsQ0FBQyxDQUFDLENBQUM7VUFDckMsSUFBSVksaUJBQWlCLENBQUNqVyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDcUgsTUFBTSxDQUFDNEIsdUJBQXVCLENBQUNnTixpQkFBaUIsQ0FBQztVQUNuRDtRQUNGO1FBRUEsSUFBSSxDQUFDbEIsVUFBVSxFQUFFO1VBQ2Y7VUFDQTFOLE1BQU0sQ0FBQ3lPLDBCQUEwQixDQUFDL0MsS0FBSyxDQUFDO1FBQzFDO1FBRUEsT0FBTyxJQUFJO01BQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxNQUFNLElBQUkyQixPQUFPLENBQUN2TixHQUFHLElBQUkwTSxLQUFLLENBQUNzQyxRQUFRLEVBQUU7TUFDeEM7TUFDQSxJQUFJLENBQUNqUSxTQUFTLENBQUNOLEdBQUcsQ0FBQ3lCLE1BQU0sSUFBSTtRQUMzQixNQUFNK08sYUFBYSxHQUFHL08sTUFBTSxDQUFDZ1AsZ0JBQWdCLENBQUMsQ0FBQztRQUMvQyxNQUFNQyxrQkFBa0IsR0FBR0YsYUFBYSxDQUFDZixjQUFjLENBQUMsQ0FBQzs7UUFFekQ7UUFDQSxNQUFNa0IsUUFBUSxHQUFHeEQsS0FBSyxDQUFDMVEsS0FBSyxDQUFDbVUsVUFBVSxDQUFDRixrQkFBa0IsQ0FBQ2pVLEtBQUssQ0FBQztRQUNqRSxNQUFNb1UsT0FBTyxHQUFHRixRQUFRLEdBQUd4RCxLQUFLLENBQUMxUSxLQUFLLEdBQUcwUSxLQUFLLENBQUMyQyxHQUFHO1FBQ2xELE1BQU1FLFFBQVEsR0FBR1csUUFBUSxHQUFHLENBQUNFLE9BQU8sRUFBRUgsa0JBQWtCLENBQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUNZLGtCQUFrQixDQUFDalUsS0FBSyxFQUFFb1UsT0FBTyxDQUFDO1FBRW5HTCxhQUFhLENBQUNULGNBQWMsQ0FBQ0MsUUFBUSxFQUFFO1VBQUNHLFFBQVEsRUFBRVE7UUFBUSxDQUFDLENBQUM7UUFDNUQsT0FBTyxJQUFJO01BQ2IsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxNQUFNO01BQ0wsSUFBSSxDQUFDclEsU0FBUyxDQUFDTixHQUFHLENBQUN5QixNQUFNLElBQUlBLE1BQU0sQ0FBQ2lCLHNCQUFzQixDQUFDeUssS0FBSyxDQUFDLENBQUM7SUFDcEU7SUFFQSxPQUFPLElBQUk7RUFDYjtFQUVBekcsVUFBVUEsQ0FBQSxFQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUM5SyxLQUFLLENBQUM4UixVQUFVLENBQUMsSUFBSSxDQUFDOVIsS0FBSyxDQUFDOEQsWUFBWSxFQUFFLElBQUksQ0FBQzlELEtBQUssQ0FBQytELGFBQWEsQ0FBQztFQUNqRjtFQUVBd0csc0JBQXNCQSxDQUFBLEVBQUc7SUFDdkIsTUFBTTJGLGFBQWEsR0FBRyxJQUFJLENBQUNnRixnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdDLElBQUksQ0FBQ0MsaUJBQWlCLENBQUM7TUFDckI5SCxJQUFJLEVBQUVBLENBQUEsS0FBTTtRQUNWLE1BQU0rSCxVQUFVLEdBQUdsRixhQUFhLENBQUM5TCxHQUFHLENBQUNvRCxJQUFJLElBQUlBLElBQUksQ0FBQ2hILFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDNEUsaUJBQWlCLEdBQUcsTUFBTTtRQUMvQixJQUFJLENBQUNWLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJQSxNQUFNLENBQUM0Qix1QkFBdUIsQ0FBQzJOLFVBQVUsQ0FBQyxDQUFDO01BQzFFLENBQUM7TUFDRDVOLElBQUksRUFBRUEsQ0FBQSxLQUFNO1FBQ1YsSUFBSTZOLGNBQWMsR0FBR25JLFFBQVE7UUFDN0IsS0FBSyxNQUFNMUYsSUFBSSxJQUFJMEksYUFBYSxFQUFFO1VBQ2hDLE1BQU0sQ0FBQ29GLFdBQVcsQ0FBQyxHQUFHOU4sSUFBSSxDQUFDd0ssVUFBVSxDQUFDLENBQUM7VUFDdkM7VUFDQSxJQUFJc0QsV0FBVyxLQUFLLENBQUNELGNBQWMsSUFBSUMsV0FBVyxDQUFDQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUdGLGNBQWMsQ0FBQyxFQUFFO1lBQ3hGQSxjQUFjLEdBQUdDLFdBQVcsQ0FBQ0MsaUJBQWlCLENBQUMsQ0FBQztVQUNsRDtRQUNGO1FBRUEsSUFBSSxDQUFDblEsaUJBQWlCLEdBQUcsTUFBTTtRQUMvQixJQUFJLENBQUNWLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJO1VBQzNCQSxNQUFNLENBQUM0Qix1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzROLGNBQWMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDQSxjQUFjLEVBQUVuSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDbkYsT0FBTyxJQUFJO1FBQ2IsQ0FBQyxDQUFDO01BQ0o7SUFDRixDQUFDLENBQUM7RUFDSjtFQWtCQTdDLGNBQWNBLENBQUEsRUFBRztJQUNmLElBQUksQ0FBQzNGLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJO01BQzNCLE1BQU1rQixTQUFTLEdBQUcsSUFBSUMsR0FBRyxDQUN2QixJQUFJLENBQUN3TyxpQkFBaUIsQ0FBQ2hPLElBQUksSUFBSSxJQUFJLENBQUNpTyxZQUFZLENBQUNqTyxJQUFJLENBQUMsSUFBSUEsSUFBSSxDQUNoRSxDQUFDO01BQ0QsTUFBTUYsVUFBVSxHQUFHL0QsS0FBSyxDQUFDQyxJQUFJLENBQUN1RCxTQUFTLEVBQUVTLElBQUksSUFBSUEsSUFBSSxDQUFDaEgsUUFBUSxDQUFDLENBQUMsQ0FBQztNQUNqRSxJQUFJLENBQUM0RSxpQkFBaUIsR0FBRyxNQUFNO01BQy9CUyxNQUFNLENBQUM0Qix1QkFBdUIsQ0FBQ0gsVUFBVSxDQUFDO01BQzFDLE9BQU8sSUFBSTtJQUNiLENBQUMsQ0FBQztFQUNKO0VBRUFnRCxrQkFBa0JBLENBQUEsRUFBRztJQUNuQixJQUFJLENBQUM1RixTQUFTLENBQUNOLEdBQUcsQ0FBQ3lCLE1BQU0sSUFBSTtNQUMzQixNQUFNa0IsU0FBUyxHQUFHLElBQUlDLEdBQUcsQ0FDdkIsSUFBSSxDQUFDd08saUJBQWlCLENBQUNoTyxJQUFJLElBQUksSUFBSSxDQUFDa08sYUFBYSxDQUFDbE8sSUFBSSxDQUFDLElBQUlBLElBQUksQ0FDakUsQ0FBQztNQUNELE1BQU1GLFVBQVUsR0FBRy9ELEtBQUssQ0FBQ0MsSUFBSSxDQUFDdUQsU0FBUyxFQUFFUyxJQUFJLElBQUlBLElBQUksQ0FBQ2hILFFBQVEsQ0FBQyxDQUFDLENBQUM7TUFDakUsSUFBSSxDQUFDNEUsaUJBQWlCLEdBQUcsTUFBTTtNQUMvQlMsTUFBTSxDQUFDNEIsdUJBQXVCLENBQUNILFVBQVUsQ0FBQztNQUMxQyxPQUFPLElBQUk7SUFDYixDQUFDLENBQUM7RUFDSjtFQUVBNUUsV0FBV0EsQ0FBQztJQUFDQztFQUFpQixDQUFDLEVBQUU7SUFDL0IsTUFBTWdULGtCQUFrQixHQUFHLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0lBRXBDLElBQUksQ0FBQ2xSLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJO01BQzNCLE1BQU1nUSxVQUFVLEdBQUcsSUFBSTdPLEdBQUcsQ0FBQyxDQUFDO01BRTVCLEtBQUssTUFBTThPLE1BQU0sSUFBSWpRLE1BQU0sQ0FBQ2tRLFVBQVUsQ0FBQyxDQUFDLEVBQUU7UUFDeEMsTUFBTUMsU0FBUyxHQUFHRixNQUFNLENBQUNHLGlCQUFpQixDQUFDLENBQUMsQ0FBQ3RSLEdBQUc7UUFDaEQsTUFBTTZDLElBQUksR0FBRyxJQUFJLENBQUN4SCxLQUFLLENBQUNlLGNBQWMsQ0FBQ3FHLFNBQVMsQ0FBQzRPLFNBQVMsQ0FBQztRQUMzRCxNQUFNL1YsU0FBUyxHQUFHLElBQUksQ0FBQ0QsS0FBSyxDQUFDZSxjQUFjLENBQUNtVixjQUFjLENBQUNGLFNBQVMsQ0FBQztRQUNyRTtRQUNBLElBQUksQ0FBQ3hPLElBQUksRUFBRTtVQUNUO1FBQ0Y7UUFFQSxJQUFJMk8sTUFBTSxHQUFHM08sSUFBSSxDQUFDNE8sV0FBVyxDQUFDSixTQUFTLENBQUM7UUFDeEMsSUFBSUssU0FBUyxHQUFHUCxNQUFNLENBQUNHLGlCQUFpQixDQUFDLENBQUMsQ0FBQ25SLE1BQU07UUFDakQsSUFBSXFSLE1BQU0sS0FBSyxJQUFJLEVBQUU7VUFDbkIsSUFBSUcsVUFBVSxHQUFHOU8sSUFBSSxDQUFDK08sY0FBYyxDQUFDLENBQUM7VUFDdEMsS0FBSyxNQUFNQyxNQUFNLElBQUloUCxJQUFJLENBQUNpUCxVQUFVLENBQUMsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQ0QsTUFBTSxDQUFDRSxpQkFBaUIsQ0FBQ1YsU0FBUyxDQUFDLEVBQUU7Y0FDeENRLE1BQU0sQ0FBQ0csSUFBSSxDQUFDO2dCQUNWQyxTQUFTLEVBQUVBLENBQUEsS0FBTTtrQkFDZk4sVUFBVSxJQUFJRSxNQUFNLENBQUNLLGNBQWMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUNEQyxRQUFRLEVBQUVBLENBQUEsS0FBTTtrQkFDZFIsVUFBVSxJQUFJRSxNQUFNLENBQUNLLGNBQWMsQ0FBQyxDQUFDO2dCQUN2QztjQUNGLENBQUMsQ0FBQztZQUNKLENBQUMsTUFBTTtjQUNMO1lBQ0Y7VUFDRjtVQUVBLElBQUksQ0FBQ2hCLFVBQVUsQ0FBQzVZLEdBQUcsQ0FBQ3FaLFVBQVUsQ0FBQyxFQUFFO1lBQy9CSCxNQUFNLEdBQUdHLFVBQVU7WUFDbkJELFNBQVMsR0FBRyxDQUFDO1lBQ2JSLFVBQVUsQ0FBQ2xRLEdBQUcsQ0FBQzJRLFVBQVUsQ0FBQztVQUM1QjtRQUNGO1FBRUEsSUFBSUgsTUFBTSxLQUFLLElBQUksRUFBRTtVQUNuQjtVQUNBO1VBQ0FBLE1BQU0sSUFBSSxDQUFDO1VBQ1gsTUFBTVksT0FBTyxHQUFHcEIsa0JBQWtCLENBQUN6WSxHQUFHLENBQUMrQyxTQUFTLENBQUM7VUFDakQsSUFBSSxDQUFDOFcsT0FBTyxFQUFFO1lBQ1pwQixrQkFBa0IsQ0FBQzlYLEdBQUcsQ0FBQ29DLFNBQVMsRUFBRSxDQUFDLENBQUNrVyxNQUFNLEVBQUVFLFNBQVMsQ0FBQyxDQUFDLENBQUM7VUFDMUQsQ0FBQyxNQUFNO1lBQ0xVLE9BQU8sQ0FBQzNZLElBQUksQ0FBQyxDQUFDK1gsTUFBTSxFQUFFRSxTQUFTLENBQUMsQ0FBQztVQUNuQztRQUNGO01BQ0Y7TUFFQSxPQUFPLElBQUk7SUFDYixDQUFDLENBQUM7SUFFRixNQUFNVyxzQkFBc0IsR0FBRyxJQUFJaFEsR0FBRyxDQUFDMk8sa0JBQWtCLENBQUM1WCxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLElBQUk0RSxpQkFBaUIsSUFBSSxDQUFDcVUsc0JBQXNCLENBQUMvWixHQUFHLENBQUMwRixpQkFBaUIsQ0FBQyxFQUFFO01BQ3ZFLE1BQU0sQ0FBQ3lGLFNBQVMsQ0FBQyxHQUFHekYsaUJBQWlCLENBQUMwRixRQUFRLENBQUMsQ0FBQztNQUNoRCxNQUFNMk4sU0FBUyxHQUFHNU4sU0FBUyxHQUFHQSxTQUFTLENBQUNtTyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRywwQkFBMkIsQ0FBQztNQUMzRixPQUFPLElBQUksQ0FBQ3ZXLEtBQUssQ0FBQ3lDLFFBQVEsQ0FBQ0UsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDcVQsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQ3ZFLENBQUMsTUFBTTtNQUNMLE1BQU1pQixPQUFPLEdBQUd0QixrQkFBa0IsQ0FBQ3BPLElBQUksS0FBSyxDQUFDO01BQzdDLE9BQU92RCxPQUFPLENBQUNDLEdBQUcsQ0FBQ1YsS0FBSyxDQUFDQyxJQUFJLENBQUNtUyxrQkFBa0IsRUFBRTdXLEtBQUssSUFBSTtRQUN6RCxNQUFNLENBQUNtQixTQUFTLEVBQUU4VyxPQUFPLENBQUMsR0FBR2pZLEtBQUs7UUFDbEMsT0FBTyxJQUFJLENBQUNrQixLQUFLLENBQUN5QyxRQUFRLENBQUN4QyxTQUFTLEVBQUU4VyxPQUFPLEVBQUVFLE9BQU8sQ0FBQztNQUN6RCxDQUFDLENBQUMsQ0FBQztJQUNMO0VBRUY7RUFFQUMsZUFBZUEsQ0FBQSxFQUFHO0lBQ2hCLE9BQU8sSUFBSSxDQUFDeFMsU0FBUyxDQUFDTixHQUFHLENBQUN5QixNQUFNLElBQUk7TUFDbEMsT0FBTyxJQUFJbUIsR0FBRyxDQUNabkIsTUFBTSxDQUFDNk4sYUFBYSxDQUFDLENBQUMsQ0FDbkJ0UCxHQUFHLENBQUNxUCxTQUFTLElBQUlBLFNBQVMsQ0FBQ0ksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUM1QzVCLE1BQU0sQ0FBQyxDQUFDa0YsR0FBRyxFQUFFNUYsS0FBSyxLQUFLO1FBQ3RCLEtBQUssTUFBTTVNLEdBQUcsSUFBSTRNLEtBQUssQ0FBQ3BLLE9BQU8sQ0FBQyxDQUFDLEVBQUU7VUFDakMsSUFBSSxJQUFJLENBQUNpUSxXQUFXLENBQUN6UyxHQUFHLENBQUMsRUFBRTtZQUN6QndTLEdBQUcsQ0FBQy9ZLElBQUksQ0FBQ3VHLEdBQUcsQ0FBQztVQUNmO1FBQ0Y7UUFDQSxPQUFPd1MsR0FBRztNQUNaLENBQUMsRUFBRSxFQUFFLENBQ1QsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDOUQsS0FBSyxDQUFDLElBQUlyTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ3JCO0VBRUFnRixlQUFlQSxDQUFBLEVBQUc7SUFDaEIsSUFBSSxDQUFDcEUscUJBQXFCLENBQUMsQ0FBQztFQUM5QjtFQUVBcUUsdUJBQXVCQSxDQUFDb0csS0FBSyxFQUFFO0lBQzdCLElBQ0UsQ0FBQ0EsS0FBSyxJQUNOQSxLQUFLLENBQUNnRixjQUFjLENBQUN4VyxLQUFLLENBQUM4RCxHQUFHLEtBQUswTixLQUFLLENBQUNpRixjQUFjLENBQUN6VyxLQUFLLENBQUM4RCxHQUFHLElBQ2pFME4sS0FBSyxDQUFDZ0YsY0FBYyxDQUFDbkQsR0FBRyxDQUFDdlAsR0FBRyxLQUFLME4sS0FBSyxDQUFDaUYsY0FBYyxDQUFDcEQsR0FBRyxDQUFDdlAsR0FBRyxFQUM3RDtNQUNBLElBQUksQ0FBQ2lELHFCQUFxQixDQUFDLENBQUM7SUFDOUI7RUFDRjtFQUVBc0UsbUJBQW1CQSxDQUFBLEVBQUc7SUFDcEIsSUFBSSxDQUFDdEUscUJBQXFCLENBQUMsQ0FBQztFQUM5QjtFQUVBQSxxQkFBcUJBLENBQUEsRUFBRztJQUN0QixJQUFJLElBQUksQ0FBQzFCLGVBQWUsRUFBRTtNQUN4QjtJQUNGO0lBRUEsTUFBTXFSLGNBQWMsR0FBRyxJQUFJLENBQUM3UyxTQUFTLENBQUNOLEdBQUcsQ0FBQ3lCLE1BQU0sSUFBSTtNQUNsRCxPQUFPQSxNQUFNLENBQUMyUix3QkFBd0IsQ0FBQyxDQUFDLENBQUNwVCxHQUFHLENBQUNsRCxRQUFRLElBQUlBLFFBQVEsQ0FBQ3lELEdBQUcsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQzBPLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDWixNQUFNalIseUJBQXlCLEdBQUcsSUFBSSxDQUFDcEMsS0FBSyxDQUFDZSxjQUFjLENBQUMwVyxrQkFBa0IsQ0FBQ0YsY0FBYyxDQUFDO0lBRTlGLElBQUksQ0FBQ3ZYLEtBQUssQ0FBQzBYLG1CQUFtQixDQUM1QixJQUFJLENBQUNSLGVBQWUsQ0FBQyxDQUFDLEVBQ3RCLElBQUksQ0FBQzlSLGlCQUFpQixJQUFJLE1BQU0sRUFDaENoRCx5QkFDRixDQUFDO0VBQ0g7RUFFQW9LLGtCQUFrQkEsQ0FBQztJQUFDK0YsU0FBUztJQUFFeEc7RUFBVyxDQUFDLEVBQUU7SUFDM0MsTUFBTXZFLElBQUksR0FBRyxJQUFJLENBQUN4SCxLQUFLLENBQUNlLGNBQWMsQ0FBQ3FHLFNBQVMsQ0FBQ21MLFNBQVMsQ0FBQztJQUMzRCxJQUFJL0ssSUFBSSxLQUFLZ0wsU0FBUyxFQUFFO01BQ3RCLE9BQU8sSUFBSSxDQUFDbUYsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNyQjtJQUVBLE1BQU1DLE1BQU0sR0FBR3BRLElBQUksQ0FBQ3FRLFdBQVcsQ0FBQ3RGLFNBQVMsQ0FBQztJQUMxQyxJQUFJeEcsV0FBVyxFQUFFO01BQ2YsT0FBTyxJQUFJLENBQUM0TCxHQUFHLENBQUNDLE1BQU0sS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUM3QztJQUVBLE9BQU8sSUFBSSxDQUFDRCxHQUFHLENBQUNDLE1BQU0sQ0FBQztFQUN6QjtFQUVBL0ssa0JBQWtCQSxDQUFDO0lBQUMwRixTQUFTO0lBQUV4RztFQUFXLENBQUMsRUFBRTtJQUMzQyxNQUFNdkUsSUFBSSxHQUFHLElBQUksQ0FBQ3hILEtBQUssQ0FBQ2UsY0FBYyxDQUFDcUcsU0FBUyxDQUFDbUwsU0FBUyxDQUFDO0lBQzNELElBQUkvSyxJQUFJLEtBQUtnTCxTQUFTLEVBQUU7TUFDdEIsT0FBTyxJQUFJLENBQUNtRixHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ3JCO0lBRUEsTUFBTXhCLE1BQU0sR0FBRzNPLElBQUksQ0FBQzRPLFdBQVcsQ0FBQzdELFNBQVMsQ0FBQztJQUMxQyxJQUFJeEcsV0FBVyxFQUFFO01BQ2YsT0FBTyxJQUFJLENBQUM0TCxHQUFHLENBQUN4QixNQUFNLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDN0M7SUFDQSxPQUFPLElBQUksQ0FBQ3dCLEdBQUcsQ0FBQ3hCLE1BQU0sQ0FBQztFQUN6Qjs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtFQUNFakIsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDakIsT0FBTyxJQUFJLENBQUNNLGlCQUFpQixDQUFDZCxJQUFJLElBQUlBLElBQUksQ0FBQztFQUM3QztFQUVBYyxpQkFBaUJBLENBQUNwTCxRQUFRLEVBQUU7SUFDMUIsT0FBTyxJQUFJLENBQUMxRixTQUFTLENBQUNOLEdBQUcsQ0FBQ3lCLE1BQU0sSUFBSTtNQUNsQyxNQUFNaVMsSUFBSSxHQUFHLElBQUk5USxHQUFHLENBQUMsQ0FBQztNQUN0QixPQUFPbkIsTUFBTSxDQUFDa1MsdUJBQXVCLENBQUMsQ0FBQyxDQUFDOUYsTUFBTSxDQUFDLENBQUNrRixHQUFHLEVBQUU1RixLQUFLLEtBQUs7UUFDN0QsS0FBSyxNQUFNNU0sR0FBRyxJQUFJNE0sS0FBSyxDQUFDcEssT0FBTyxDQUFDLENBQUMsRUFBRTtVQUNqQyxNQUFNSyxJQUFJLEdBQUcsSUFBSSxDQUFDeEgsS0FBSyxDQUFDZSxjQUFjLENBQUNxRyxTQUFTLENBQUN6QyxHQUFHLENBQUM7VUFDckQsSUFBSSxDQUFDNkMsSUFBSSxJQUFJc1EsSUFBSSxDQUFDN2EsR0FBRyxDQUFDdUssSUFBSSxDQUFDLEVBQUU7WUFDM0I7VUFDRjtVQUVBc1EsSUFBSSxDQUFDblMsR0FBRyxDQUFDNkIsSUFBSSxDQUFDO1VBQ2QyUCxHQUFHLENBQUMvWSxJQUFJLENBQUNnTSxRQUFRLENBQUM1QyxJQUFJLENBQUMsQ0FBQztRQUMxQjtRQUNBLE9BQU8yUCxHQUFHO01BQ1osQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDOUQsS0FBSyxDQUFDLEVBQUUsQ0FBQztFQUNkOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0VBQ0U1UCxzQkFBc0JBLENBQUEsRUFBRztJQUN2QixPQUFPLElBQUksQ0FBQ2lCLFNBQVMsQ0FBQ04sR0FBRyxDQUFDeUIsTUFBTSxJQUFJO01BQ2xDLE1BQU1tUyxPQUFPLEdBQUcsSUFBSWhSLEdBQUcsQ0FBQyxDQUFDO01BQ3pCLEtBQUssTUFBTXVLLEtBQUssSUFBSTFMLE1BQU0sQ0FBQ2tTLHVCQUF1QixDQUFDLENBQUMsRUFBRTtRQUNwRCxLQUFLLE1BQU1wVCxHQUFHLElBQUk0TSxLQUFLLENBQUNwSyxPQUFPLENBQUMsQ0FBQyxFQUFFO1VBQ2pDLE1BQU04USxLQUFLLEdBQUcsSUFBSSxDQUFDalksS0FBSyxDQUFDZSxjQUFjLENBQUNtVixjQUFjLENBQUN2UixHQUFHLENBQUM7VUFDM0RxVCxPQUFPLENBQUNyUyxHQUFHLENBQUNzUyxLQUFLLENBQUM7UUFDcEI7TUFDRjtNQUNBLE9BQU9ELE9BQU87SUFDaEIsQ0FBQyxDQUFDLENBQUMzRSxLQUFLLENBQUMsSUFBSXJNLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDckI7RUFFQTBPLGFBQWFBLENBQUNsTyxJQUFJLEVBQUU7SUFDbEIsTUFBTTBRLE9BQU8sR0FBRzFRLElBQUksQ0FBQ2hILFFBQVEsQ0FBQyxDQUFDLENBQUNLLEtBQUssQ0FBQzhELEdBQUcsR0FBRyxDQUFDO0lBQzdDLE9BQU8sSUFBSSxDQUFDM0UsS0FBSyxDQUFDZSxjQUFjLENBQUNxRyxTQUFTLENBQUM4USxPQUFPLENBQUM7RUFDckQ7RUFFQXpDLFlBQVlBLENBQUNqTyxJQUFJLEVBQUU7SUFDakIsTUFBTTJRLE9BQU8sR0FBRzNRLElBQUksQ0FBQ2hILFFBQVEsQ0FBQyxDQUFDLENBQUMwVCxHQUFHLENBQUN2UCxHQUFHLEdBQUcsQ0FBQztJQUMzQyxPQUFPLElBQUksQ0FBQzNFLEtBQUssQ0FBQ2UsY0FBYyxDQUFDcUcsU0FBUyxDQUFDK1EsT0FBTyxDQUFDO0VBQ3JEO0VBRUFmLFdBQVdBLENBQUM3RSxTQUFTLEVBQUU7SUFDckIsTUFBTTZGLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQ3BZLEtBQUssQ0FBQ2UsY0FBYyxDQUFDd00sZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQ3ZOLEtBQUssQ0FBQ2UsY0FBYyxDQUFDeU0sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ2pILE9BQU80SyxZQUFZLENBQUNDLElBQUksQ0FBQzVHLEtBQUssSUFBSUEsS0FBSyxDQUFDNkcsV0FBVyxDQUFDO01BQUNDLGFBQWEsRUFBRWhHO0lBQVMsQ0FBQyxDQUFDLENBQUMvVCxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQzdGO0VBRUEyVyxpQkFBaUJBLENBQUNxRCxTQUFTLEVBQUU7SUFDM0IsTUFBTXBPLFFBQVEsR0FBR29PLFNBQVMsQ0FBQyxJQUFJLENBQUN4WSxLQUFLLENBQUMrRCxhQUFhLENBQUM7SUFDcEQ7SUFDQSxJQUFJLENBQUNxRyxRQUFRLEVBQUU7TUFDYixNQUFNLElBQUlxTyxLQUFLLENBQUMsMkJBQTJCLElBQUksQ0FBQ3pZLEtBQUssQ0FBQytELGFBQWEsRUFBRSxDQUFDO0lBQ3hFO0lBQ0EsT0FBT3FHLFFBQVEsQ0FBQyxDQUFDO0VBQ25CO0VBRUF1TixHQUFHQSxDQUFDZSxHQUFHLEVBQUU7SUFDUCxNQUFNQyxTQUFTLEdBQUcsSUFBSSxDQUFDM1ksS0FBSyxDQUFDZSxjQUFjLENBQUM2WCxxQkFBcUIsQ0FBQyxDQUFDO0lBQ25FLElBQUlGLEdBQUcsS0FBSyxJQUFJLEVBQUU7TUFDaEIsT0FBT0csdUJBQWMsQ0FBQ0MsTUFBTSxDQUFDSCxTQUFTLENBQUM7SUFDekMsQ0FBQyxNQUFNO01BQ0wsT0FBT0UsdUJBQWMsQ0FBQ0MsTUFBTSxDQUFDSCxTQUFTLEdBQUdELEdBQUcsQ0FBQ0ssUUFBUSxDQUFDLENBQUMsQ0FBQ3ZhLE1BQU0sQ0FBQyxHQUFHa2EsR0FBRyxDQUFDSyxRQUFRLENBQUMsQ0FBQztJQUNsRjtFQUNGO0VBZ0JBalIsa0JBQWtCQSxDQUFDNEgsTUFBTSxFQUFFO0lBQ3pCO0lBQ0EsSUFBSSxDQUFDQSxNQUFNLEtBQUssUUFBUSxJQUFJQSxNQUFNLEtBQUssT0FBTyxLQUN6Q3hHLFdBQVcsQ0FBQzhQLGdCQUFnQixDQUFDLHNCQUFzQnRKLE1BQU0sUUFBUSxDQUFDLENBQUNsUixNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQ2xGMEssV0FBVyxDQUFDTyxJQUFJLENBQUMsc0JBQXNCaUcsTUFBTSxNQUFNLENBQUM7TUFDcER4RyxXQUFXLENBQUMrUCxPQUFPLENBQ2pCLHNCQUFzQnZKLE1BQU0sRUFBRSxFQUM5QixzQkFBc0JBLE1BQU0sUUFBUSxFQUNwQyxzQkFBc0JBLE1BQU0sTUFBTSxDQUFDO01BQ3JDLE1BQU13SixJQUFJLEdBQUdoUSxXQUFXLENBQUM4UCxnQkFBZ0IsQ0FBQyxzQkFBc0J0SixNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM1RXhHLFdBQVcsQ0FBQ0MsVUFBVSxDQUFDLHNCQUFzQnVHLE1BQU0sUUFBUSxDQUFDO01BQzVEeEcsV0FBVyxDQUFDQyxVQUFVLENBQUMsc0JBQXNCdUcsTUFBTSxNQUFNLENBQUM7TUFDMUR4RyxXQUFXLENBQUNFLGFBQWEsQ0FBQyxzQkFBc0JzRyxNQUFNLEVBQUUsQ0FBQztNQUN6RCxJQUFBWix1QkFBUSxFQUFDLHNCQUFzQlksTUFBTSxFQUFFLEVBQUU7UUFDdkNWLE9BQU8sRUFBRSxRQUFRO1FBQ2pCbUsscUJBQXFCLEVBQUUsSUFBSSxDQUFDblosS0FBSyxDQUFDZSxjQUFjLENBQUNvSCxjQUFjLENBQUMsQ0FBQyxDQUFDL0QsR0FBRyxDQUNuRUYsRUFBRSxJQUFJQSxFQUFFLENBQUNrVixRQUFRLENBQUMsQ0FBQyxDQUFDQyxtQkFBbUIsQ0FBQyxDQUMxQyxDQUFDO1FBQ0RDLFFBQVEsRUFBRUosSUFBSSxDQUFDSTtNQUNqQixDQUFDLENBQUM7SUFDSjtFQUNGO0FBQ0Y7QUFBQ0MsT0FBQSxDQUFBM2MsT0FBQSxHQUFBZ0Qsa0JBQUE7QUFBQWxCLGVBQUEsQ0FqeUNvQmtCLGtCQUFrQixlQUNsQjtFQUNqQjtFQUNBcUMsYUFBYSxFQUFFdVgsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0VBQ3REdlgsaUJBQWlCLEVBQUVzWCxrQkFBUyxDQUFDRSxJQUFJO0VBQ2pDOVgsUUFBUSxFQUFFK1gsNEJBQWdCLENBQUNDLFVBQVU7RUFFckM7RUFDQUMsVUFBVSxFQUFFTCxrQkFBUyxDQUFDTSxNQUFNLENBQUNGLFVBQVU7RUFDdkM3WSxjQUFjLEVBQUVnWixrQ0FBc0IsQ0FBQ0gsVUFBVTtFQUNqRDdWLGFBQWEsRUFBRXlWLGtCQUFTLENBQUNDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDRyxVQUFVO0VBQzNEOVYsWUFBWSxFQUFFMFYsa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0VBQ3pDeFgseUJBQXlCLEVBQUVvWCxrQkFBUyxDQUFDRSxJQUFJLENBQUNFLFVBQVU7RUFDcER6WCxjQUFjLEVBQUVxWCxrQkFBUyxDQUFDRSxJQUFJO0VBRTlCO0VBQ0FoTSxxQkFBcUIsRUFBRThMLGtCQUFTLENBQUNFLElBQUk7RUFDckMvTCxvQkFBb0IsRUFBRTZMLGtCQUFTLENBQUNRLE9BQU8sQ0FBQ1Isa0JBQVMsQ0FBQ1MsS0FBSyxDQUFDO0lBQ3REcE0sTUFBTSxFQUFFMkwsa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0lBQ25DaE0sUUFBUSxFQUFFNEwsa0JBQVMsQ0FBQ1EsT0FBTyxDQUFDUixrQkFBUyxDQUFDTSxNQUFNLENBQUMsQ0FBQ0Y7RUFDaEQsQ0FBQyxDQUFDLENBQUM7RUFFSDtFQUNBbk8sU0FBUyxFQUFFK04sa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0VBQ3RDM1AsUUFBUSxFQUFFdVAsa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0VBQ3JDakosT0FBTyxFQUFFNkksa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0VBQ3BDdlgsUUFBUSxFQUFFbVgsa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0VBQ3JDdFIsTUFBTSxFQUFFa1Isa0JBQVMsQ0FBQ00sTUFBTSxDQUFDRixVQUFVO0VBQ25DTSxXQUFXLEVBQUVWLGtCQUFTLENBQUNNLE1BQU07RUFFN0I7RUFDQXBDLG1CQUFtQixFQUFFOEIsa0JBQVMsQ0FBQ1csSUFBSTtFQUVuQztFQUNBQyxnQkFBZ0IsRUFBRVosa0JBQVMsQ0FBQ1csSUFBSTtFQUNoQzNYLG1CQUFtQixFQUFFZ1gsa0JBQVMsQ0FBQ1csSUFBSTtFQUNuQ2xQLE9BQU8sRUFBRXVPLGtCQUFTLENBQUNXLElBQUk7RUFDdkIxWCxRQUFRLEVBQUUrVyxrQkFBUyxDQUFDVyxJQUFJO0VBQ3hCdlgsVUFBVSxFQUFFNFcsa0JBQVMsQ0FBQ1csSUFBSTtFQUMxQnJJLFVBQVUsRUFBRTBILGtCQUFTLENBQUNXLElBQUk7RUFDMUI5VixnQkFBZ0IsRUFBRW1WLGtCQUFTLENBQUNXLElBQUk7RUFDaEM1VixtQkFBbUIsRUFBRWlWLGtCQUFTLENBQUNXLElBQUk7RUFDbkM3WCxlQUFlLEVBQUVrWCxrQkFBUyxDQUFDVyxJQUFJO0VBQy9CdFcsV0FBVyxFQUFFMlYsa0JBQVMsQ0FBQ1csSUFBSTtFQUMzQjdULGlCQUFpQixFQUFFa1Qsa0JBQVMsQ0FBQ1csSUFBSTtFQUNqQ3pULGdCQUFnQixFQUFFOFMsa0JBQVMsQ0FBQ1csSUFBSTtFQUVoQztFQUNBelYsU0FBUyxFQUFFMlYsNkJBQWlCO0VBQzVCcFUsZUFBZSxFQUFFb1UsNkJBQWlCO0VBRWxDO0VBQ0F6UixjQUFjLEVBQUU0USxrQkFBUyxDQUFDVyxJQUFJO0VBQzlCMVIsbUJBQW1CLEVBQUUrUSxrQkFBUyxDQUFDYyxNQUFNO0VBQUU1Uix1QkFBdUIsRUFBRThRLGtCQUFTLENBQUNqTCxNQUFNO0VBRWhGO0VBQ0FILFFBQVEsRUFBRW1NLDRCQUFnQjtFQUMxQmxNLEtBQUssRUFBRW1MLGtCQUFTLENBQUNjLE1BQU07RUFDdkJoTSxJQUFJLEVBQUVrTCxrQkFBUyxDQUFDYyxNQUFNO0VBQ3RCL0wsTUFBTSxFQUFFaUwsa0JBQVMsQ0FBQ2pMLE1BQU07RUFDeEJFLFdBQVcsRUFBRStLLGtCQUFTLENBQUNjO0FBQ3pCLENBQUM7QUFBQTViLGVBQUEsQ0E3RGtCa0Isa0JBQWtCLGtCQStEZjtFQUNwQjBHLGlCQUFpQixFQUFFQSxDQUFBLEtBQU0sSUFBSWtVLG9CQUFVLENBQUMsQ0FBQztFQUN6QzlULGdCQUFnQixFQUFFQSxDQUFBLEtBQU0sSUFBSThULG9CQUFVLENBQUMsQ0FBQztFQUN4QzlNLHFCQUFxQixFQUFFLEtBQUs7RUFDNUJDLG9CQUFvQixFQUFFO0FBQ3hCLENBQUMiLCJpZ25vcmVMaXN0IjpbXX0=