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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    })); // Synchronously maintain the editor's scroll position and logical selection across buffer updates.

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
    }), stageModeCommand, stageSymlinkCommand,
    /* istanbul ignore next */
    atom.inDevMode() && _react.default.createElement(_commands.Command, {
      command: "github:inspect-patch",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(this.props.multiFilePatch.getPatchBuffer().inspect({
          layerNames: ['patch', 'hunk']
        }));
      }
    }),
    /* istanbul ignore next */
    atom.inDevMode() && _react.default.createElement(_commands.Command, {
      command: "github:inspect-regions",
      callback: () => {
        // eslint-disable-next-line no-console
        console.log(this.props.multiFilePatch.getPatchBuffer().inspect({
          layerNames: ['unchanged', 'deletion', 'addition', 'nonewline']
        }));
      }
    }),
    /* istanbul ignore next */
    atom.inDevMode() && _react.default.createElement(_commands.Command, {
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
    }, opts); // Normalize the target selection range


    const converted = _atom.Range.fromObject(rangeLike);

    const range = this.refEditor.map(editor => editor.clipBufferRange(converted)).getOr(converted);

    if (event.metaKey ||
    /* istanbul ignore next */
    event.ctrlKey && isWindows) {
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
        const lastSelectionRange = lastSelection.getBufferRange(); // You are now entering the wall of ternery operators. This is your last exit before the tollbooth

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
      const cursorRow = firstHunk ? firstHunk.getNewStartRow() - 1 :
      /* istanbul ignore next */
      0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9tdWx0aS1maWxlLXBhdGNoLXZpZXcuanMiXSwibmFtZXMiOlsiZXhlY3V0YWJsZVRleHQiLCJGaWxlIiwibW9kZXMiLCJOT1JNQUwiLCJFWEVDVVRBQkxFIiwiTXVsdGlGaWxlUGF0Y2hWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZmlsZVBhdGNoIiwiaW5kZXgiLCJpc0NvbGxhcHNlZCIsImdldFJlbmRlclN0YXR1cyIsImlzVmlzaWJsZSIsImlzRW1wdHkiLCJnZXRNYXJrZXIiLCJnZXRSYW5nZSIsImlzRXhwYW5kYWJsZSIsImlzVW5hdmFpbGFibGUiLCJhdEVuZCIsImdldFN0YXJ0UmFuZ2UiLCJzdGFydCIsImlzRXF1YWwiLCJtdWx0aUZpbGVQYXRjaCIsImdldEJ1ZmZlciIsImdldEVuZFBvc2l0aW9uIiwicG9zaXRpb24iLCJnZXRQYXRoIiwiaXRlbVR5cGUiLCJnZXRTdGF0dXMiLCJnZXROZXdQYXRoIiwic3RhZ2luZ1N0YXR1cyIsImlzUGFydGlhbGx5U3RhZ2VkIiwiaGFzVW5kb0hpc3RvcnkiLCJoYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zIiwidG9vbHRpcHMiLCJ1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uIiwiZGl2ZUludG9NaXJyb3JQYXRjaCIsImRpZE9wZW5GaWxlIiwic2VsZWN0ZWRGaWxlUGF0Y2giLCJ0b2dnbGVGaWxlIiwiY29sbGFwc2VGaWxlUGF0Y2giLCJleHBhbmRGaWxlUGF0Y2giLCJyZW5kZXJTeW1saW5rQ2hhbmdlTWV0YSIsInJlbmRlckV4ZWN1dGFibGVNb2RlQ2hhbmdlTWV0YSIsInJlbmRlckRpZmZHYXRlIiwicmVuZGVyRGlmZlVuYXZhaWxhYmxlIiwicmVuZGVySHVua0hlYWRlcnMiLCJzZWxlY3RlZEZpbGVQYXRjaGVzIiwiQXJyYXkiLCJmcm9tIiwiZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcyIsIkNoYW5nZWRGaWxlSXRlbSIsInVuZG9MYXN0RGlzY2FyZCIsImV2ZW50U291cmNlIiwiY29tbWFuZCIsImRpc2NhcmRSb3dzIiwic2VsZWN0ZWRSb3dzIiwic2VsZWN0aW9uTW9kZSIsIlByb21pc2UiLCJhbGwiLCJmaWx0ZXIiLCJmcCIsImRpZENoYW5nZUV4ZWN1dGFibGVNb2RlIiwibWFwIiwidG9nZ2xlTW9kZUNoYW5nZSIsImhhc1R5cGVjaGFuZ2UiLCJ0b2dnbGVTeW1saW5rQ2hhbmdlIiwiY2hhbmdlZEZpbGVQYXRoIiwiY2hhbmdlZEZpbGVQb3NpdGlvbiIsInJlZkVkaXRvciIsImUiLCJyb3ciLCJnZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24iLCJzY3JvbGxUb0J1ZmZlclBvc2l0aW9uIiwiY29sdW1uIiwiY2VudGVyIiwic2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJtb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MiLCJsYXN0TW91c2VNb3ZlTGluZSIsIm5leHRTZWxlY3Rpb25Nb2RlIiwicmVmUm9vdCIsIlJlZkhvbGRlciIsInJlZkVkaXRvckVsZW1lbnQiLCJtb3VudGVkIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhZGQiLCJvYnNlcnZlIiwiZWRpdG9yIiwic2V0dGVyIiwiZ2V0RWxlbWVudCIsImVsZW1lbnQiLCJyZWZJbml0aWFsRm9jdXMiLCJzdXBwcmVzc0NoYW5nZXMiLCJsYXN0U2Nyb2xsVG9wIiwibGFzdFNjcm9sbExlZnQiLCJsYXN0U2VsZWN0aW9uSW5kZXgiLCJvbldpbGxVcGRhdGVQYXRjaCIsImdldE1heFNlbGVjdGlvbkluZGV4IiwiZ2V0U2Nyb2xsVG9wIiwiZ2V0U2Nyb2xsTGVmdCIsIm9uRGlkVXBkYXRlUGF0Y2giLCJuZXh0UGF0Y2giLCJuZXh0U2VsZWN0aW9uUmFuZ2UiLCJnZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4Iiwic2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSIsIm5leHRIdW5rcyIsIlNldCIsIlJhbmdlIiwiZnJvbU9iamVjdCIsImdldFJvd3MiLCJnZXRIdW5rQXQiLCJCb29sZWFuIiwibmV4dFJhbmdlcyIsInNpemUiLCJodW5rIiwic2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMiLCJzZXRTY3JvbGxUb3AiLCJzZXRTY3JvbGxMZWZ0IiwiZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzIiwiY29tcG9uZW50RGlkTW91bnQiLCJtZWFzdXJlUGVyZm9ybWFuY2UiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZGlkTW91c2VVcCIsImZpcnN0UGF0Y2giLCJnZXRGaWxlUGF0Y2hlcyIsImZpcnN0SHVuayIsImdldEh1bmtzIiwiY29uZmlnIiwib25EaWRDaGFuZ2UiLCJmb3JjZVVwZGF0ZSIsImluaXRDaGFuZ2VkRmlsZVBhdGgiLCJpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiIsInNjcm9sbFRvRmlsZSIsIm9uT3BlbkZpbGVzVGFiIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcG9zZSIsInBlcmZvcm1hbmNlIiwiY2xlYXJNYXJrcyIsImNsZWFyTWVhc3VyZXMiLCJyZW5kZXIiLCJyb290Q2xhc3MiLCJhbnlQcmVzZW50IiwibWFyayIsInJlbmRlckNvbW1hbmRzIiwicmVuZGVyTm9uRW1wdHlQYXRjaCIsInJlbmRlckVtcHR5UGF0Y2giLCJDb21taXREZXRhaWxJdGVtIiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiY29tbWFuZHMiLCJzZWxlY3ROZXh0SHVuayIsInNlbGVjdFByZXZpb3VzSHVuayIsImRpZFRvZ2dsZVNlbGVjdGlvbk1vZGUiLCJzdGFnZU1vZGVDb21tYW5kIiwic3RhZ2VTeW1saW5rQ29tbWFuZCIsImRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlIiwiZGlkVG9nZ2xlTW9kZUNoYW5nZSIsImFueUhhdmVUeXBlY2hhbmdlIiwiZGlkVG9nZ2xlU3ltbGlua0NoYW5nZSIsImRpZENvbmZpcm0iLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8iLCJkaXNjYXJkU2VsZWN0aW9uRnJvbUNvbW1hbmQiLCJzdXJmYWNlIiwiYXRvbSIsImluRGV2TW9kZSIsImNvbnNvbGUiLCJsb2ciLCJnZXRQYXRjaEJ1ZmZlciIsImluc3BlY3QiLCJsYXllck5hbWVzIiwid29ya3NwYWNlIiwiZGlkQWRkU2VsZWN0aW9uIiwiZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UiLCJkaWREZXN0cm95U2VsZWN0aW9uIiwib2xkTGluZU51bWJlckxhYmVsIiwiZGlkTW91c2VEb3duT25MaW5lTnVtYmVyIiwiZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyIiwibmV3TGluZU51bWJlckxhYmVsIiwiZ2V0IiwiYmxhbmtMYWJlbCIsInJlbmRlclBSQ29tbWVudEljb25zIiwicmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMiLCJyZW5kZXJMaW5lRGVjb3JhdGlvbnMiLCJJbmZpbml0eSIsImd1dHRlciIsImljb24iLCJsaW5lIiwicmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyIiwiZ2V0QWRkaXRpb25MYXllciIsImdldERlbGV0aW9uTGF5ZXIiLCJnZXROb05ld2xpbmVMYXllciIsInJldmlld0NvbW1lbnRzTG9hZGluZyIsInJldmlld0NvbW1lbnRUaHJlYWRzIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJwYXRoIiwiZ2V0UGF0Y2hGb3JQYXRoIiwiaXNSb3dTZWxlY3RlZCIsImhhcyIsImlkIiwiZW5kcG9pbnQiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJ3b3JrZGlyUGF0aCIsIm5hbWUiLCJvcmRlck9mZnNldCIsInNob3dEaWZmIiwiY29tcG9uZW50IiwicGFja2FnZSIsIm9sZE1vZGUiLCJnZXRPbGRNb2RlIiwibmV3TW9kZSIsImdldE5ld01vZGUiLCJhdHRycyIsImFjdGlvbkljb24iLCJhY3Rpb25UZXh0IiwiaGFzU3ltbGluayIsImRldGFpbCIsInRpdGxlIiwib2xkU3ltbGluayIsImdldE9sZFN5bWxpbmsiLCJuZXdTeW1saW5rIiwiZ2V0TmV3U3ltbGluayIsInRvZ2dsZVZlcmIiLCJzZWxlY3RlZEh1bmtzIiwiY29udGFpbnNTZWxlY3Rpb24iLCJpc1NlbGVjdGVkIiwiYnV0dG9uU3VmZml4IiwidG9nZ2xlU2VsZWN0aW9uTGFiZWwiLCJkaXNjYXJkU2VsZWN0aW9uTGFiZWwiLCJzdGFydFBvaW50Iiwic3RhcnRSYW5nZSIsImtleW1hcHMiLCJ0b2dnbGVIdW5rU2VsZWN0aW9uIiwiZGlzY2FyZEh1bmtTZWxlY3Rpb24iLCJkaWRNb3VzZURvd25PbkhlYWRlciIsInJhbmdlcyIsImxpbmVDbGFzcyIsInJlZkhvbGRlciIsImxlbmd0aCIsImhvbGRlciIsInJhbmdlIiwicmVuZGVyRGVjb3JhdGlvbnMiLCJsYXllciIsImdldE1hcmtlckNvdW50IiwidG9nZ2xlUm93cyIsImNoYW5nZVJvd3MiLCJnZXRDaGFuZ2VzIiwicmVkdWNlIiwicm93cyIsImNoYW5nZSIsInB1c2giLCJnZXRCdWZmZXJSb3dzIiwiZXZlbnQiLCJoYW5kbGVTZWxlY3Rpb25FdmVudCIsImJ1ZmZlclJvdyIsInVuZGVmaW5lZCIsImlzTmFOIiwiZG9tRXZlbnQiLCJyYW5nZUxpa2UiLCJvcHRzIiwiYnV0dG9uIiwiaXNXaW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiY3RybEtleSIsIm9wdGlvbnMiLCJjb252ZXJ0ZWQiLCJjbGlwQnVmZmVyUmFuZ2UiLCJnZXRPciIsIm1ldGFLZXkiLCJpbnRlcnNlY3RzIiwid2l0aG91dCIsInNlbGVjdGlvbiIsImdldFNlbGVjdGlvbnMiLCJpbnRlcnNlY3RzQnVmZmVyUmFuZ2UiLCJzZWxlY3Rpb25SYW5nZSIsImdldEJ1ZmZlclJhbmdlIiwibmV3UmFuZ2VzIiwibnVkZ2VkIiwibGFzdENvbHVtbiIsImxpbmVMZW5ndGhGb3JSb3ciLCJlbmQiLCJzZXRCdWZmZXJSYW5nZSIsIm5ld1JhbmdlIiwic2xpY2UiLCJhZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSIsInJldmVyc2VkIiwiaXNSZXZlcnNlZCIsInJlcGxhY2VtZW50UmFuZ2VzIiwiZWFjaCIsInNoaWZ0S2V5IiwibGFzdFNlbGVjdGlvbiIsImdldExhc3RTZWxlY3Rpb24iLCJsYXN0U2VsZWN0aW9uUmFuZ2UiLCJpc0JlZm9yZSIsImlzTGVzc1RoYW4iLCJmYXJFZGdlIiwiZ2V0U2VsZWN0ZWRIdW5rcyIsIndpdGhTZWxlY3Rpb25Nb2RlIiwiaHVua1JhbmdlcyIsImZpcnN0Q2hhbmdlUm93IiwiZmlyc3RDaGFuZ2UiLCJnZXRTdGFydEJ1ZmZlclJvdyIsIndpdGhTZWxlY3RlZEh1bmtzIiwiZ2V0SHVua0FmdGVyIiwiZ2V0SHVua0JlZm9yZSIsImN1cnNvcnNCeUZpbGVQYXRjaCIsIk1hcCIsInBsYWNlZFJvd3MiLCJjdXJzb3IiLCJnZXRDdXJzb3JzIiwiY3Vyc29yUm93IiwiZ2V0QnVmZmVyUG9zaXRpb24iLCJnZXRGaWxlUGF0Y2hBdCIsIm5ld1JvdyIsImdldE5ld1Jvd0F0IiwibmV3Q29sdW1uIiwibmVhcmVzdFJvdyIsImdldE5ld1N0YXJ0Um93IiwicmVnaW9uIiwiZ2V0UmVnaW9ucyIsImluY2x1ZGVzQnVmZmVyUm93Iiwid2hlbiIsInVuY2hhbmdlZCIsImJ1ZmZlclJvd0NvdW50IiwiYWRkaXRpb24iLCJjdXJzb3JzIiwic2V0IiwiZmlsZVBhdGNoZXNXaXRoQ3Vyc29ycyIsImtleXMiLCJvcGVuRmlsZSIsInBlbmRpbmciLCJ2YWx1ZSIsImdldFNlbGVjdGVkUm93cyIsImFjYyIsImlzQ2hhbmdlUm93Iiwib2xkQnVmZmVyUmFuZ2UiLCJuZXdCdWZmZXJSYW5nZSIsIm5leHRDdXJzb3JSb3dzIiwiZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zIiwic3BhbnNNdWx0aXBsZUZpbGVzIiwic2VsZWN0ZWRSb3dzQ2hhbmdlZCIsInNvZnRXcmFwcGVkIiwicGFkIiwib2xkUm93IiwiZ2V0T2xkUm93QXQiLCJjYWxsYmFjayIsInNlZW4iLCJnZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyIsInBhdGNoZXMiLCJwYXRjaCIsInByZXZSb3ciLCJuZXh0Um93IiwiY2hhbmdlTGF5ZXJzIiwic29tZSIsImZpbmRNYXJrZXJzIiwiaW50ZXJzZWN0c1JvdyIsImNhbGxiYWNrcyIsIkVycm9yIiwibnVtIiwibWF4RGlnaXRzIiwiZ2V0TWF4TGluZU51bWJlcldpZHRoIiwiTkJTUF9DSEFSQUNURVIiLCJyZXBlYXQiLCJ0b1N0cmluZyIsImFjdGlvbiIsImdldEVudHJpZXNCeU5hbWUiLCJtZWFzdXJlIiwicGVyZiIsImZpbGVQYXRjaGVzTGluZUNvdW50cyIsImdldFBhdGNoIiwiZ2V0Q2hhbmdlZExpbmVDb3VudCIsImR1cmF0aW9uIiwiUHJvcFR5cGVzIiwib25lT2YiLCJib29sIiwiSXRlbVR5cGVQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJyZXBvc2l0b3J5Iiwib2JqZWN0IiwiTXVsdGlGaWxlUGF0Y2hQcm9wVHlwZSIsImFycmF5T2YiLCJzaGFwZSIsInB1bGxSZXF1ZXN0IiwiZnVuYyIsInN3aXRjaFRvSXNzdWVpc2giLCJSZWZIb2xkZXJQcm9wVHlwZSIsInN0cmluZyIsIkVuZHBvaW50UHJvcFR5cGUiLCJEaXNwb3NhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsTUFBTUEsY0FBYyxHQUFHO0FBQ3JCLEdBQUNDLGNBQUtDLEtBQUwsQ0FBV0MsTUFBWixHQUFxQixnQkFEQTtBQUVyQixHQUFDRixjQUFLQyxLQUFMLENBQVdFLFVBQVosR0FBeUI7QUFGSixDQUF2Qjs7QUFLZSxNQUFNQyxrQkFBTixTQUFpQ0MsZUFBTUMsU0FBdkMsQ0FBaUQ7QUFzRTlEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQix3REEyV1UsQ0FBQ0MsU0FBRCxFQUFZQyxLQUFaLEtBQXNCO0FBQ2pELFlBQU1DLFdBQVcs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Q047QUEyQ2pCclMsRUFBQUEsaUJBQWlCLEVBQUUwUixtQkFBVVcsSUEzQ1o7QUE0Q2pCalMsRUFBQUEsZ0JBQWdCLEVBQUVzUixtQkFBVVcsSUE1Q1g7QUE4Q2pCO0FBQ0FqVSxFQUFBQSxTQUFTLEVBQUVtVSw2QkEvQ007QUFnRGpCNVMsRUFBQUEsZUFBZSxFQUFFNFMsNkJBaERBO0FBa0RqQjtBQUNBalEsRUFBQUEsY0FBYyxFQUFFb1AsbUJBQVVXLElBbkRUO0FBb0RqQmxRLEVBQUFBLG1CQUFtQixFQUFFdVAsbUJBQVVjLE1BcERkO0FBb0RzQnBRLEVBQUFBLHVCQUF1QixFQUFFc1AsbUJBQVU1SyxNQXBEekQ7QUFzRGpCO0FBQ0FILEVBQUFBLFFBQVEsRUFBRThMLDRCQXZETztBQXdEakI3TCxFQUFBQSxLQUFLLEVBQUU4SyxtQkFBVWMsTUF4REE7QUF5RGpCM0wsRUFBQUEsSUFBSSxFQUFFNkssbUJBQVVjLE1BekRDO0FBMERqQjFMLEVBQUFBLE1BQU0sRUFBRTRLLG1CQUFVNUssTUExREQ7QUEyRGpCQyxFQUFBQSxXQUFXLEVBQUUySyxtQkFBVWM7QUEzRE4sQzs7Z0JBREF0WSxrQixrQkErREc7QUFDcEI4RixFQUFBQSxpQkFBaUIsRUFBRSxNQUFNLElBQUkwUyxvQkFBSixFQURMO0FBRXBCdFMsRUFBQUEsZ0JBQWdCLEVBQUUsTUFBTSxJQUFJc1Msb0JBQUosRUFGSjtBQUdwQnhNLEVBQUFBLHFCQUFxQixFQUFFLEtBSEg7QUFJcEJDLEVBQUFBLG9CQUFvQixFQUFFO0FBSkYsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7YXV0b2JpbmQsIE5CU1BfQ0hBUkFDVEVSLCBibGFua0xhYmVsfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7UmVmSG9sZGVyUHJvcFR5cGUsIE11bHRpRmlsZVBhdGNoUHJvcFR5cGUsIEl0ZW1UeXBlUHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL2F0b20vbWFya2VyJztcbmltcG9ydCBNYXJrZXJMYXllciBmcm9tICcuLi9hdG9tL21hcmtlci1sYXllcic7XG5pbXBvcnQgRGVjb3JhdGlvbiBmcm9tICcuLi9hdG9tL2RlY29yYXRpb24nO1xuaW1wb3J0IEd1dHRlciBmcm9tICcuLi9hdG9tL2d1dHRlcic7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBGaWxlUGF0Y2hIZWFkZXJWaWV3IGZyb20gJy4vZmlsZS1wYXRjaC1oZWFkZXItdmlldyc7XG5pbXBvcnQgRmlsZVBhdGNoTWV0YVZpZXcgZnJvbSAnLi9maWxlLXBhdGNoLW1ldGEtdmlldyc7XG5pbXBvcnQgSHVua0hlYWRlclZpZXcgZnJvbSAnLi9odW5rLWhlYWRlci12aWV3JztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IENoYW5nZWRGaWxlSXRlbSBmcm9tICcuLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbSc7XG5pbXBvcnQgQ29tbWl0RGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9jb21taXQtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IENvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21tZW50LWd1dHRlci1kZWNvcmF0aW9uLWNvbnRyb2xsZXInO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgRmlsZSBmcm9tICcuLi9tb2RlbHMvcGF0Y2gvZmlsZSc7XG5cbmNvbnN0IGV4ZWN1dGFibGVUZXh0ID0ge1xuICBbRmlsZS5tb2Rlcy5OT1JNQUxdOiAnbm9uIGV4ZWN1dGFibGUnLFxuICBbRmlsZS5tb2Rlcy5FWEVDVVRBQkxFXTogJ2V4ZWN1dGFibGUnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlGaWxlUGF0Y2hWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBCZWhhdmlvciBjb250cm9sc1xuICAgIHN0YWdpbmdTdGF0dXM6IFByb3BUeXBlcy5vbmVPZihbJ3N0YWdlZCcsICd1bnN0YWdlZCddKSxcbiAgICBpc1BhcnRpYWxseVN0YWdlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgaXRlbVR5cGU6IEl0ZW1UeXBlUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIE1vZGVsc1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBtdWx0aUZpbGVQYXRjaDogTXVsdGlGaWxlUGF0Y2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGlvbk1vZGU6IFByb3BUeXBlcy5vbmVPZihbJ2h1bmsnLCAnbGluZSddKS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkUm93czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnM6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLFxuXG4gICAgLy8gUmV2aWV3IGNvbW1lbnRzXG4gICAgcmV2aWV3Q29tbWVudHNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgICByZXZpZXdDb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5vYmplY3QsXG5cbiAgICAvLyBDYWxsYmFja3NcbiAgICBzZWxlY3RlZFJvd3NDaGFuZ2VkOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGl2ZUludG9NaXJyb3JQYXRjaDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgc3VyZmFjZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb3BlbkZpbGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIHRvZ2dsZUZpbGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIHRvZ2dsZVJvd3M6IFByb3BUeXBlcy5mdW5jLFxuICAgIHRvZ2dsZU1vZGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIHRvZ2dsZVN5bWxpbmtDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGlzY2FyZFJvd3M6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uV2lsbFVwZGF0ZVBhdGNoOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkRpZFVwZGF0ZVBhdGNoOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIC8vIEV4dGVybmFsIHJlZnNcbiAgICByZWZFZGl0b3I6IFJlZkhvbGRlclByb3BUeXBlLFxuICAgIHJlZkluaXRpYWxGb2N1czogUmVmSG9sZGVyUHJvcFR5cGUsXG5cbiAgICAvLyBmb3IgbmF2aWdhdGluZyB0aGUgUFIgY2hhbmdlZCBmaWxlcyB0YWJcbiAgICBvbk9wZW5GaWxlc1RhYjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaW5pdENoYW5nZWRGaWxlUGF0aDogUHJvcFR5cGVzLnN0cmluZywgaW5pdENoYW5nZWRGaWxlUG9zaXRpb246IFByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAvLyBmb3Igb3BlbmluZyB0aGUgcmV2aWV3cyBkb2NrIGl0ZW1cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZSxcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlcixcbiAgICB3b3JrZGlyUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25XaWxsVXBkYXRlUGF0Y2g6ICgpID0+IG5ldyBEaXNwb3NhYmxlKCksXG4gICAgb25EaWRVcGRhdGVQYXRjaDogKCkgPT4gbmV3IERpc3Bvc2FibGUoKSxcbiAgICByZXZpZXdDb21tZW50c0xvYWRpbmc6IGZhbHNlLFxuICAgIHJldmlld0NvbW1lbnRUaHJlYWRzOiBbXSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdkaWRNb3VzZURvd25PbkhlYWRlcicsICdkaWRNb3VzZURvd25PbkxpbmVOdW1iZXInLCAnZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyJywgJ2RpZE1vdXNlVXAnLFxuICAgICAgJ2RpZENvbmZpcm0nLCAnZGlkVG9nZ2xlU2VsZWN0aW9uTW9kZScsICdzZWxlY3ROZXh0SHVuaycsICdzZWxlY3RQcmV2aW91c0h1bmsnLFxuICAgICAgJ2RpZE9wZW5GaWxlJywgJ2RpZEFkZFNlbGVjdGlvbicsICdkaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZScsICdkaWREZXN0cm95U2VsZWN0aW9uJyxcbiAgICAgICdvbGRMaW5lTnVtYmVyTGFiZWwnLCAnbmV3TGluZU51bWJlckxhYmVsJyxcbiAgICApO1xuXG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3RNb3VzZU1vdmVMaW5lID0gbnVsbDtcbiAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlID0gbnVsbDtcbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3IgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3JFbGVtZW50ID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMubW91bnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLnJlZkVkaXRvci5vYnNlcnZlKGVkaXRvciA9PiB7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yRWxlbWVudC5zZXR0ZXIoZWRpdG9yLmdldEVsZW1lbnQoKSk7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnJlZkVkaXRvcikge1xuICAgICAgICAgIHRoaXMucHJvcHMucmVmRWRpdG9yLnNldHRlcihlZGl0b3IpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMucmVmRWRpdG9yRWxlbWVudC5vYnNlcnZlKGVsZW1lbnQgPT4ge1xuICAgICAgICB0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cyAmJiB0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cy5zZXR0ZXIoZWxlbWVudCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gU3luY2hyb25vdXNseSBtYWludGFpbiB0aGUgZWRpdG9yJ3Mgc2Nyb2xsIHBvc2l0aW9uIGFuZCBsb2dpY2FsIHNlbGVjdGlvbiBhY3Jvc3MgYnVmZmVyIHVwZGF0ZXMuXG4gICAgdGhpcy5zdXBwcmVzc0NoYW5nZXMgPSBmYWxzZTtcbiAgICBsZXQgbGFzdFNjcm9sbFRvcCA9IG51bGw7XG4gICAgbGV0IGxhc3RTY3JvbGxMZWZ0ID0gbnVsbDtcbiAgICBsZXQgbGFzdFNlbGVjdGlvbkluZGV4ID0gbnVsbDtcbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgdGhpcy5wcm9wcy5vbldpbGxVcGRhdGVQYXRjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3VwcHJlc3NDaGFuZ2VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgICAgbGFzdFNlbGVjdGlvbkluZGV4ID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRNYXhTZWxlY3Rpb25JbmRleCh0aGlzLnByb3BzLnNlbGVjdGVkUm93cyk7XG4gICAgICAgICAgbGFzdFNjcm9sbFRvcCA9IGVkaXRvci5nZXRFbGVtZW50KCkuZ2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgbGFzdFNjcm9sbExlZnQgPSBlZGl0b3IuZ2V0RWxlbWVudCgpLmdldFNjcm9sbExlZnQoKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMucHJvcHMub25EaWRVcGRhdGVQYXRjaChuZXh0UGF0Y2ggPT4ge1xuICAgICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChsYXN0U2VsZWN0aW9uSW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRTZWxlY3Rpb25SYW5nZSA9IG5leHRQYXRjaC5nZXRTZWxlY3Rpb25SYW5nZUZvckluZGV4KGxhc3RTZWxlY3Rpb25JbmRleCk7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlID09PSAnbGluZScpIHtcbiAgICAgICAgICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdsaW5lJztcbiAgICAgICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UobmV4dFNlbGVjdGlvblJhbmdlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5leHRIdW5rcyA9IG5ldyBTZXQoXG4gICAgICAgICAgICAgICAgUmFuZ2UuZnJvbU9iamVjdChuZXh0U2VsZWN0aW9uUmFuZ2UpLmdldFJvd3MoKVxuICAgICAgICAgICAgICAgICAgLm1hcChyb3cgPT4gbmV4dFBhdGNoLmdldEh1bmtBdChyb3cpKVxuICAgICAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICBjb25zdCBuZXh0UmFuZ2VzID0gbmV4dEh1bmtzLnNpemUgPiAwXG4gICAgICAgICAgICAgICAgPyBBcnJheS5mcm9tKG5leHRIdW5rcywgaHVuayA9PiBodW5rLmdldFJhbmdlKCkpXG4gICAgICAgICAgICAgICAgOiBbW1swLCAwXSwgWzAsIDBdXV07XG5cbiAgICAgICAgICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKG5leHRSYW5nZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGxhc3RTY3JvbGxUb3AgIT09IG51bGwpIHsgZWRpdG9yLmdldEVsZW1lbnQoKS5zZXRTY3JvbGxUb3AobGFzdFNjcm9sbFRvcCk7IH1cblxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGxhc3RTY3JvbGxMZWZ0ICE9PSBudWxsKSB7IGVkaXRvci5nZXRFbGVtZW50KCkuc2V0U2Nyb2xsTGVmdChsYXN0U2Nyb2xsTGVmdCk7IH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3VwcHJlc3NDaGFuZ2VzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRSb3dzKCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5tb3VudGVkID0gdHJ1ZTtcbiAgICB0aGlzLm1lYXN1cmVQZXJmb3JtYW5jZSgnbW91bnQnKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5kaWRNb3VzZVVwKTtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIC8vIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2ggaXMgZ3VhcmFudGVlZCB0byBjb250YWluIGF0IGxlYXN0IG9uZSBGaWxlUGF0Y2ggaWYgPEF0b21UZXh0RWRpdG9yPiBpcyByZW5kZXJlZC5cbiAgICAgIGNvbnN0IFtmaXJzdFBhdGNoXSA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKTtcbiAgICAgIGNvbnN0IFtmaXJzdEh1bmtdID0gZmlyc3RQYXRjaC5nZXRIdW5rcygpO1xuICAgICAgaWYgKCFmaXJzdEh1bmspIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShmaXJzdEh1bmsuZ2V0UmFuZ2UoKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLnByb3BzLmNvbmZpZy5vbkRpZENoYW5nZSgnZ2l0aHViLnNob3dEaWZmSWNvbkd1dHRlcicsICgpID0+IHRoaXMuZm9yY2VVcGRhdGUoKSksXG4gICAgKTtcblxuICAgIGNvbnN0IHtpbml0Q2hhbmdlZEZpbGVQYXRoLCBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbn0gPSB0aGlzLnByb3BzO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAoaW5pdENoYW5nZWRGaWxlUGF0aCAmJiBpbml0Q2hhbmdlZEZpbGVQb3NpdGlvbiA+PSAwKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvRmlsZSh7XG4gICAgICAgIGNoYW5nZWRGaWxlUGF0aDogaW5pdENoYW5nZWRGaWxlUGF0aCxcbiAgICAgICAgY2hhbmdlZEZpbGVQb3NpdGlvbjogaW5pdENoYW5nZWRGaWxlUG9zaXRpb24sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAodGhpcy5wcm9wcy5vbk9wZW5GaWxlc1RhYikge1xuICAgICAgdGhpcy5zdWJzLmFkZChcbiAgICAgICAgdGhpcy5wcm9wcy5vbk9wZW5GaWxlc1RhYih0aGlzLnNjcm9sbFRvRmlsZSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICB0aGlzLm1lYXN1cmVQZXJmb3JtYW5jZSgndXBkYXRlJyk7XG5cbiAgICBpZiAocHJldlByb3BzLnJlZkluaXRpYWxGb2N1cyAhPT0gdGhpcy5wcm9wcy5yZWZJbml0aWFsRm9jdXMpIHtcbiAgICAgIHByZXZQcm9wcy5yZWZJbml0aWFsRm9jdXMgJiYgcHJldlByb3BzLnJlZkluaXRpYWxGb2N1cy5zZXR0ZXIobnVsbCk7XG4gICAgICB0aGlzLnByb3BzLnJlZkluaXRpYWxGb2N1cyAmJiB0aGlzLnJlZkVkaXRvckVsZW1lbnQubWFwKHRoaXMucHJvcHMucmVmSW5pdGlhbEZvY3VzLnNldHRlcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2ggPT09IHByZXZQcm9wcy5tdWx0aUZpbGVQYXRjaCkge1xuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmRpZE1vdXNlVXApO1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XG4gICAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcygpO1xuICAgIHBlcmZvcm1hbmNlLmNsZWFyTWVhc3VyZXMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByb290Q2xhc3MgPSBjeChcbiAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldycsXG4gICAgICB7W2BnaXRodWItRmlsZVBhdGNoVmlldy0tJHt0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXN9YF06IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c30sXG4gICAgICB7J2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LS1ibGFuayc6ICF0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmFueVByZXNlbnQoKX0sXG4gICAgICB7J2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LS1odW5rTW9kZSc6IHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2h1bmsnfSxcbiAgICApO1xuXG4gICAgaWYgKHRoaXMubW91bnRlZCkge1xuICAgICAgcGVyZm9ybWFuY2UubWFyaygnTXVsdGlGaWxlUGF0Y2hWaWV3LXVwZGF0ZS1zdGFydCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwZXJmb3JtYW5jZS5tYXJrKCdNdWx0aUZpbGVQYXRjaFZpZXctbW91bnQtc3RhcnQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvb3RDbGFzc30gcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cblxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5hbnlQcmVzZW50KCkgPyB0aGlzLnJlbmRlck5vbkVtcHR5UGF0Y2goKSA6IHRoaXMucmVuZGVyRW1wdHlQYXRjaCgpfVxuICAgICAgICA8L21haW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IENvbW1pdERldGFpbEl0ZW0gfHwgdGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gSXNzdWVpc2hEZXRhaWxJdGVtKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdC1uZXh0LWh1bmtcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3ROZXh0SHVua30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdC1wcmV2aW91cy1odW5rXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0UHJldmlvdXNIdW5rfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLXBhdGNoLXNlbGVjdGlvbi1tb2RlXCIgY2FsbGJhY2s9e3RoaXMuZGlkVG9nZ2xlU2VsZWN0aW9uTW9kZX0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlTW9kZUNvbW1hbmQgPSBudWxsO1xuICAgIGxldCBzdGFnZVN5bWxpbmtDb21tYW5kID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmRpZEFueUNoYW5nZUV4ZWN1dGFibGVNb2RlKCkpIHtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCdcbiAgICAgICAgPyAnZ2l0aHViOnN0YWdlLWZpbGUtbW9kZS1jaGFuZ2UnXG4gICAgICAgIDogJ2dpdGh1Yjp1bnN0YWdlLWZpbGUtbW9kZS1jaGFuZ2UnO1xuICAgICAgc3RhZ2VNb2RlQ29tbWFuZCA9IDxDb21tYW5kIGNvbW1hbmQ9e2NvbW1hbmR9IGNhbGxiYWNrPXt0aGlzLmRpZFRvZ2dsZU1vZGVDaGFuZ2V9IC8+O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmFueUhhdmVUeXBlY2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCdcbiAgICAgICAgPyAnZ2l0aHViOnN0YWdlLXN5bWxpbmstY2hhbmdlJ1xuICAgICAgICA6ICdnaXRodWI6dW5zdGFnZS1zeW1saW5rLWNoYW5nZSc7XG4gICAgICBzdGFnZVN5bWxpbmtDb21tYW5kID0gPENvbW1hbmQgY29tbWFuZD17Y29tbWFuZH0gY2FsbGJhY2s9e3RoaXMuZGlkVG9nZ2xlU3ltbGlua0NoYW5nZX0gLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PXt0aGlzLnJlZlJvb3R9PlxuICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNlbGVjdC1uZXh0LWh1bmtcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3ROZXh0SHVua30gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzZWxlY3QtcHJldmlvdXMtaHVua1wiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdFByZXZpb3VzSHVua30gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIGNhbGxiYWNrPXt0aGlzLmRpZENvbmZpcm19IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnVuZG9cIiBjYWxsYmFjaz17dGhpcy51bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG99IC8+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGlzY2FyZC1zZWxlY3RlZC1saW5lc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRTZWxlY3Rpb25Gcm9tQ29tbWFuZH0gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpqdW1wLXRvLWZpbGVcIiBjYWxsYmFjaz17dGhpcy5kaWRPcGVuRmlsZX0gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdXJmYWNlXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuc3VyZmFjZX0gLz5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtcGF0Y2gtc2VsZWN0aW9uLW1vZGVcIiBjYWxsYmFjaz17dGhpcy5kaWRUb2dnbGVTZWxlY3Rpb25Nb2RlfSAvPlxuICAgICAgICB7c3RhZ2VNb2RlQ29tbWFuZH1cbiAgICAgICAge3N0YWdlU3ltbGlua0NvbW1hbmR9XG4gICAgICAgIHsvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBhdG9tLmluRGV2TW9kZSgpICYmXG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnNwZWN0LXBhdGNoXCIgY2FsbGJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldFBhdGNoQnVmZmVyKCkuaW5zcGVjdCh7XG4gICAgICAgICAgICAgIGxheWVyTmFtZXM6IFsncGF0Y2gnLCAnaHVuayddLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgICB7LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gYXRvbS5pbkRldk1vZGUoKSAmJlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6aW5zcGVjdC1yZWdpb25zXCIgY2FsbGJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldFBhdGNoQnVmZmVyKCkuaW5zcGVjdCh7XG4gICAgICAgICAgICAgIGxheWVyTmFtZXM6IFsndW5jaGFuZ2VkJywgJ2RlbGV0aW9uJywgJ2FkZGl0aW9uJywgJ25vbmV3bGluZSddLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgICB7LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gYXRvbS5pbkRldk1vZGUoKSAmJlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6aW5zcGVjdC1tZnBcIiBjYWxsYmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guaW5zcGVjdCgpKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgIDwvQ29tbWFuZHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckVtcHR5UGF0Y2goKSB7XG4gICAgcmV0dXJuIDxwIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1lc3NhZ2UgaWNvbiBpY29uLWluZm9cIj5ObyBjaGFuZ2VzIHRvIGRpc3BsYXk8L3A+O1xuICB9XG5cbiAgcmVuZGVyTm9uRW1wdHlQYXRjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG5cbiAgICAgICAgYnVmZmVyPXt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEJ1ZmZlcigpfVxuICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgIGF1dG9XaWR0aD17ZmFsc2V9XG4gICAgICAgIGF1dG9IZWlnaHQ9e2ZhbHNlfVxuICAgICAgICByZWFkT25seT17dHJ1ZX1cbiAgICAgICAgc29mdFdyYXBwZWQ9e3RydWV9XG5cbiAgICAgICAgZGlkQWRkU2VsZWN0aW9uPXt0aGlzLmRpZEFkZFNlbGVjdGlvbn1cbiAgICAgICAgZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2U9e3RoaXMuZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2V9XG4gICAgICAgIGRpZERlc3Ryb3lTZWxlY3Rpb249e3RoaXMuZGlkRGVzdHJveVNlbGVjdGlvbn1cbiAgICAgICAgcmVmTW9kZWw9e3RoaXMucmVmRWRpdG9yfVxuICAgICAgICBoaWRlRW1wdGluZXNzPXt0cnVlfT5cblxuICAgICAgICA8R3V0dGVyXG4gICAgICAgICAgbmFtZT1cIm9sZC1saW5lLW51bWJlcnNcIlxuICAgICAgICAgIHByaW9yaXR5PXsxfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIm9sZFwiXG4gICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICBsYWJlbEZuPXt0aGlzLm9sZExpbmVOdW1iZXJMYWJlbH1cbiAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5kaWRNb3VzZURvd25PbkxpbmVOdW1iZXJ9XG4gICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyfVxuICAgICAgICAvPlxuICAgICAgICA8R3V0dGVyXG4gICAgICAgICAgbmFtZT1cIm5ldy1saW5lLW51bWJlcnNcIlxuICAgICAgICAgIHByaW9yaXR5PXsyfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIm5ld1wiXG4gICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICBsYWJlbEZuPXt0aGlzLm5ld0xpbmVOdW1iZXJMYWJlbH1cbiAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5kaWRNb3VzZURvd25PbkxpbmVOdW1iZXJ9XG4gICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMuZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyfVxuICAgICAgICAvPlxuICAgICAgICA8R3V0dGVyXG4gICAgICAgICAgbmFtZT1cImdpdGh1Yi1jb21tZW50LWljb25cIlxuICAgICAgICAgIHByaW9yaXR5PXszfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImNvbW1lbnRcIlxuICAgICAgICAgIHR5cGU9XCJkZWNvcmF0ZWRcIlxuICAgICAgICAvPlxuICAgICAgICB7dGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIuc2hvd0RpZmZJY29uR3V0dGVyJykgJiYgKFxuICAgICAgICAgIDxHdXR0ZXJcbiAgICAgICAgICAgIG5hbWU9XCJkaWZmLWljb25zXCJcbiAgICAgICAgICAgIHByaW9yaXR5PXs0fVxuICAgICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImljb25zXCJcbiAgICAgICAgICAgIGxhYmVsRm49e2JsYW5rTGFiZWx9XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5kaWRNb3VzZURvd25PbkxpbmVOdW1iZXJ9XG4gICAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5kaWRNb3VzZU1vdmVPbkxpbmVOdW1iZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJQUkNvbW1lbnRJY29ucygpfVxuXG4gICAgICAgIHt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCkubWFwKHRoaXMucmVuZGVyRmlsZVBhdGNoRGVjb3JhdGlvbnMpfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlckxpbmVEZWNvcmF0aW9ucyhcbiAgICAgICAgICBBcnJheS5mcm9tKHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLCByb3cgPT4gUmFuZ2UuZnJvbU9iamVjdChbW3JvdywgMF0sIFtyb3csIEluZmluaXR5XV0pKSxcbiAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tc2VsZWN0ZWQnLFxuICAgICAgICAgIHtndXR0ZXI6IHRydWUsIGljb246IHRydWUsIGxpbmU6IHRydWV9LFxuICAgICAgICApfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zT25MYXllcihcbiAgICAgICAgICB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEFkZGl0aW9uTGF5ZXIoKSxcbiAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tYWRkZWQnLFxuICAgICAgICAgIHtpY29uOiB0cnVlLCBsaW5lOiB0cnVlfSxcbiAgICAgICAgKX1cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnNPbkxheWVyKFxuICAgICAgICAgIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RGVsZXRpb25MYXllcigpLFxuICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1saW5lLS1kZWxldGVkJyxcbiAgICAgICAgICB7aWNvbjogdHJ1ZSwgbGluZTogdHJ1ZX0sXG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRlY29yYXRpb25zT25MYXllcihcbiAgICAgICAgICB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldE5vTmV3bGluZUxheWVyKCksXG4gICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LWxpbmUtLW5vbmV3bGluZScsXG4gICAgICAgICAge2ljb246IHRydWUsIGxpbmU6IHRydWV9LFxuICAgICAgICApfVxuXG4gICAgICA8L0F0b21UZXh0RWRpdG9yPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJQUkNvbW1lbnRJY29ucygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSAhPT0gSXNzdWVpc2hEZXRhaWxJdGVtIHx8XG4gICAgICAgIHRoaXMucHJvcHMucmV2aWV3Q29tbWVudHNMb2FkaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXZpZXdDb21tZW50VGhyZWFkcy5tYXAoKHtjb21tZW50cywgdGhyZWFkfSkgPT4ge1xuICAgICAgY29uc3Qge3BhdGgsIHBvc2l0aW9ufSA9IGNvbW1lbnRzWzBdO1xuICAgICAgaWYgKCF0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldFBhdGNoRm9yUGF0aChwYXRoKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgcm93ID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRCdWZmZXJSb3dGb3JEaWZmUG9zaXRpb24ocGF0aCwgcG9zaXRpb24pO1xuICAgICAgaWYgKHJvdyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNSb3dTZWxlY3RlZCA9IHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLmhhcyhyb3cpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbW1lbnRHdXR0ZXJEZWNvcmF0aW9uQ29udHJvbGxlclxuICAgICAgICAgIGtleT17YGdpdGh1Yi1jb21tZW50LWd1dHRlci1kZWNvcmF0aW9uLSR7dGhyZWFkLmlkfWB9XG4gICAgICAgICAgY29tbWVudFJvdz17cm93fVxuICAgICAgICAgIHRocmVhZElkPXt0aHJlYWQuaWR9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgICBvd25lcj17dGhpcy5wcm9wcy5vd25lcn1cbiAgICAgICAgICByZXBvPXt0aGlzLnByb3BzLnJlcG99XG4gICAgICAgICAgbnVtYmVyPXt0aGlzLnByb3BzLm51bWJlcn1cbiAgICAgICAgICB3b3JrZGlyPXt0aGlzLnByb3BzLndvcmtkaXJQYXRofVxuICAgICAgICAgIGV4dHJhQ2xhc3Nlcz17aXNSb3dTZWxlY3RlZCA/IFsnZ2l0aHViLUZpbGVQYXRjaFZpZXctbGluZS0tc2VsZWN0ZWQnXSA6IFtdfVxuICAgICAgICAgIHBhcmVudD17dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckZpbGVQYXRjaERlY29yYXRpb25zID0gKGZpbGVQYXRjaCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpc0NvbGxhcHNlZCA9ICFmaWxlUGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNWaXNpYmxlKCk7XG4gICAgY29uc3QgaXNFbXB0eSA9IGZpbGVQYXRjaC5nZXRNYXJrZXIoKS5nZXRSYW5nZSgpLmlzRW1wdHkoKTtcbiAgICBjb25zdCBpc0V4cGFuZGFibGUgPSBmaWxlUGF0Y2guZ2V0UmVuZGVyU3RhdHVzKCkuaXNFeHBhbmRhYmxlKCk7XG4gICAgY29uc3QgaXNVbmF2YWlsYWJsZSA9IGlzQ29sbGFwc2VkICYmICFpc0V4cGFuZGFibGU7XG4gICAgY29uc3QgYXRFbmQgPSBmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpLnN0YXJ0LmlzRXF1YWwodGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRCdWZmZXIoKS5nZXRFbmRQb3NpdGlvbigpKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGlzRW1wdHkgJiYgYXRFbmQgPyAnYWZ0ZXInIDogJ2JlZm9yZSc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50IGtleT17ZmlsZVBhdGNoLmdldFBhdGgoKX0+XG4gICAgICAgIDxNYXJrZXIgaW52YWxpZGF0ZT1cIm5ldmVyXCIgYnVmZmVyUmFuZ2U9e2ZpbGVQYXRjaC5nZXRTdGFydFJhbmdlKCl9PlxuICAgICAgICAgIDxEZWNvcmF0aW9uIHR5cGU9XCJibG9ja1wiIHBvc2l0aW9uPXtwb3NpdGlvbn0gb3JkZXI9e2luZGV4fSBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1jb250cm9sQmxvY2tcIj5cbiAgICAgICAgICAgIDxGaWxlUGF0Y2hIZWFkZXJWaWV3XG4gICAgICAgICAgICAgIGl0ZW1UeXBlPXt0aGlzLnByb3BzLml0ZW1UeXBlfVxuICAgICAgICAgICAgICByZWxQYXRoPXtmaWxlUGF0Y2guZ2V0UGF0aCgpfVxuICAgICAgICAgICAgICBuZXdQYXRoPXtmaWxlUGF0Y2guZ2V0U3RhdHVzKCkgPT09ICdyZW5hbWVkJyA/IGZpbGVQYXRjaC5nZXROZXdQYXRoKCkgOiBudWxsfVxuICAgICAgICAgICAgICBzdGFnaW5nU3RhdHVzPXt0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXN9XG4gICAgICAgICAgICAgIGlzUGFydGlhbGx5U3RhZ2VkPXt0aGlzLnByb3BzLmlzUGFydGlhbGx5U3RhZ2VkfVxuICAgICAgICAgICAgICBoYXNVbmRvSGlzdG9yeT17dGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeX1cbiAgICAgICAgICAgICAgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucz17dGhpcy5wcm9wcy5oYXNNdWx0aXBsZUZpbGVTZWxlY3Rpb25zfVxuXG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuXG4gICAgICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17KCkgPT4gdGhpcy51bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgIGRpdmVJbnRvTWlycm9yUGF0Y2g9eygpID0+IHRoaXMucHJvcHMuZGl2ZUludG9NaXJyb3JQYXRjaChmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICBvcGVuRmlsZT17KCkgPT4gdGhpcy5kaWRPcGVuRmlsZSh7c2VsZWN0ZWRGaWxlUGF0Y2g6IGZpbGVQYXRjaH0pfVxuICAgICAgICAgICAgICB0b2dnbGVGaWxlPXsoKSA9PiB0aGlzLnByb3BzLnRvZ2dsZUZpbGUoZmlsZVBhdGNoKX1cblxuICAgICAgICAgICAgICBpc0NvbGxhcHNlZD17aXNDb2xsYXBzZWR9XG4gICAgICAgICAgICAgIHRyaWdnZXJDb2xsYXBzZT17KCkgPT4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5jb2xsYXBzZUZpbGVQYXRjaChmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICB0cmlnZ2VyRXhwYW5kPXsoKSA9PiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmV4cGFuZEZpbGVQYXRjaChmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHshaXNDb2xsYXBzZWQgJiYgdGhpcy5yZW5kZXJTeW1saW5rQ2hhbmdlTWV0YShmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgeyFpc0NvbGxhcHNlZCAmJiB0aGlzLnJlbmRlckV4ZWN1dGFibGVNb2RlQ2hhbmdlTWV0YShmaWxlUGF0Y2gpfVxuICAgICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgICAgPC9NYXJrZXI+XG5cbiAgICAgICAge2lzRXhwYW5kYWJsZSAmJiB0aGlzLnJlbmRlckRpZmZHYXRlKGZpbGVQYXRjaCwgcG9zaXRpb24sIGluZGV4KX1cbiAgICAgICAge2lzVW5hdmFpbGFibGUgJiYgdGhpcy5yZW5kZXJEaWZmVW5hdmFpbGFibGUoZmlsZVBhdGNoLCBwb3NpdGlvbiwgaW5kZXgpfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlckh1bmtIZWFkZXJzKGZpbGVQYXRjaCwgaW5kZXgpfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGlmZkdhdGUoZmlsZVBhdGNoLCBwb3NpdGlvbiwgb3JkZXJPZmZzZXQpIHtcbiAgICBjb25zdCBzaG93RGlmZiA9ICgpID0+IHtcbiAgICAgIGFkZEV2ZW50KCdleHBhbmQtZmlsZS1wYXRjaCcsIHtjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZSwgcGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZXhwYW5kRmlsZVBhdGNoKGZpbGVQYXRjaCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlciBpbnZhbGlkYXRlPVwibmV2ZXJcIiBidWZmZXJSYW5nZT17ZmlsZVBhdGNoLmdldFN0YXJ0UmFuZ2UoKX0+XG4gICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgdHlwZT1cImJsb2NrXCJcbiAgICAgICAgICBvcmRlcj17b3JkZXJPZmZzZXQgKyAwLjF9XG4gICAgICAgICAgcG9zaXRpb249e3Bvc2l0aW9ufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LWNvbnRyb2xCbG9ja1wiPlxuXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWVzc2FnZSBpY29uIGljb24taW5mb1wiPlxuICAgICAgICAgICAgTGFyZ2UgZGlmZnMgYXJlIGNvbGxhcHNlZCBieSBkZWZhdWx0IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LXNob3dEaWZmQnV0dG9uXCIgb25DbGljaz17c2hvd0RpZmZ9PiBMb2FkIERpZmY8L2J1dHRvbj5cbiAgICAgICAgICA8L3A+XG5cbiAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgPC9NYXJrZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRpZmZVbmF2YWlsYWJsZShmaWxlUGF0Y2gsIHBvc2l0aW9uLCBvcmRlck9mZnNldCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyIGludmFsaWRhdGU9XCJuZXZlclwiIGJ1ZmZlclJhbmdlPXtmaWxlUGF0Y2guZ2V0U3RhcnRSYW5nZSgpfT5cbiAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICB0eXBlPVwiYmxvY2tcIlxuICAgICAgICAgIG9yZGVyPXtvcmRlck9mZnNldCArIDAuMX1cbiAgICAgICAgICBwb3NpdGlvbj17cG9zaXRpb259XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udHJvbEJsb2NrXCI+XG5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXNzYWdlIGljb24gaWNvbi13YXJuaW5nXCI+XG4gICAgICAgICAgICBUaGlzIGRpZmYgaXMgdG9vIGxhcmdlIHRvIGxvYWQgYXQgYWxsLiBVc2UgdGhlIGNvbW1hbmQtbGluZSB0byB2aWV3IGl0LlxuICAgICAgICAgIDwvcD5cblxuICAgICAgICA8L0RlY29yYXRpb24+XG4gICAgICA8L01hcmtlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRXhlY3V0YWJsZU1vZGVDaGFuZ2VNZXRhKGZpbGVQYXRjaCkge1xuICAgIGlmICghZmlsZVBhdGNoLmRpZENoYW5nZUV4ZWN1dGFibGVNb2RlKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZE1vZGUgPSBmaWxlUGF0Y2guZ2V0T2xkTW9kZSgpO1xuICAgIGNvbnN0IG5ld01vZGUgPSBmaWxlUGF0Y2guZ2V0TmV3TW9kZSgpO1xuXG4gICAgY29uc3QgYXR0cnMgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCdcbiAgICAgID8ge1xuICAgICAgICBhY3Rpb25JY29uOiAnaWNvbi1tb3ZlLWRvd24nLFxuICAgICAgICBhY3Rpb25UZXh0OiAnU3RhZ2UgTW9kZSBDaGFuZ2UnLFxuICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgIGFjdGlvbkljb246ICdpY29uLW1vdmUtdXAnLFxuICAgICAgICBhY3Rpb25UZXh0OiAnVW5zdGFnZSBNb2RlIENoYW5nZScsXG4gICAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGaWxlUGF0Y2hNZXRhVmlld1xuICAgICAgICB0aXRsZT1cIk1vZGUgY2hhbmdlXCJcbiAgICAgICAgYWN0aW9uSWNvbj17YXR0cnMuYWN0aW9uSWNvbn1cbiAgICAgICAgYWN0aW9uVGV4dD17YXR0cnMuYWN0aW9uVGV4dH1cbiAgICAgICAgaXRlbVR5cGU9e3RoaXMucHJvcHMuaXRlbVR5cGV9XG4gICAgICAgIGFjdGlvbj17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVNb2RlQ2hhbmdlKGZpbGVQYXRjaCl9PlxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgRmlsZSBjaGFuZ2VkIG1vZGVcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZiBnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tcmVtb3ZlZFwiPlxuICAgICAgICAgICAgZnJvbSB7ZXhlY3V0YWJsZVRleHRbb2xkTW9kZV19IDxjb2RlPntvbGRNb2RlfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYgZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYtLWFkZGVkXCI+XG4gICAgICAgICAgICB0byB7ZXhlY3V0YWJsZVRleHRbbmV3TW9kZV19IDxjb2RlPntuZXdNb2RlfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICA8L0ZpbGVQYXRjaE1ldGFWaWV3PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJTeW1saW5rQ2hhbmdlTWV0YShmaWxlUGF0Y2gpIHtcbiAgICBpZiAoIWZpbGVQYXRjaC5oYXNTeW1saW5rKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBkZXRhaWwgPSA8ZGl2IC8+O1xuICAgIGxldCB0aXRsZSA9ICcnO1xuICAgIGNvbnN0IG9sZFN5bWxpbmsgPSBmaWxlUGF0Y2guZ2V0T2xkU3ltbGluaygpO1xuICAgIGNvbnN0IG5ld1N5bWxpbmsgPSBmaWxlUGF0Y2guZ2V0TmV3U3ltbGluaygpO1xuICAgIGlmIChvbGRTeW1saW5rICYmIG5ld1N5bWxpbmspIHtcbiAgICAgIGRldGFpbCA9IChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIFN5bWxpbmsgY2hhbmdlZFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y3goXG4gICAgICAgICAgICAnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURpZmYnLFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1mdWxsV2lkdGgnLFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmLS1yZW1vdmVkJyxcbiAgICAgICAgICApfT5cbiAgICAgICAgICAgIGZyb20gPGNvZGU+e29sZFN5bWxpbmt9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2N4KFxuICAgICAgICAgICAgJ2dpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFEaWZmJyxcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tZnVsbFdpZHRoJyxcbiAgICAgICAgICAgICdnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tYWRkZWQnLFxuICAgICAgICAgICl9PlxuICAgICAgICAgICAgdG8gPGNvZGU+e25ld1N5bWxpbmt9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj4uXG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgICAgdGl0bGUgPSAnU3ltbGluayBjaGFuZ2VkJztcbiAgICB9IGVsc2UgaWYgKG9sZFN5bWxpbmsgJiYgIW5ld1N5bWxpbmspIHtcbiAgICAgIGRldGFpbCA9IChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIFN5bWxpbmtcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZiBnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tcmVtb3ZlZFwiPlxuICAgICAgICAgICAgdG8gPGNvZGU+e29sZFN5bWxpbmt9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICBkZWxldGVkLlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICAgIHRpdGxlID0gJ1N5bWxpbmsgZGVsZXRlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRldGFpbCA9IChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgIFN5bWxpbmtcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZiBnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhRGlmZi0tYWRkZWRcIj5cbiAgICAgICAgICAgIHRvIDxjb2RlPntuZXdTeW1saW5rfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgY3JlYXRlZC5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICk7XG4gICAgICB0aXRsZSA9ICdTeW1saW5rIGNyZWF0ZWQnO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dHJzID0gdGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnXG4gICAgICA/IHtcbiAgICAgICAgYWN0aW9uSWNvbjogJ2ljb24tbW92ZS1kb3duJyxcbiAgICAgICAgYWN0aW9uVGV4dDogJ1N0YWdlIFN5bWxpbmsgQ2hhbmdlJyxcbiAgICAgIH1cbiAgICAgIDoge1xuICAgICAgICBhY3Rpb25JY29uOiAnaWNvbi1tb3ZlLXVwJyxcbiAgICAgICAgYWN0aW9uVGV4dDogJ1Vuc3RhZ2UgU3ltbGluayBDaGFuZ2UnLFxuICAgICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RmlsZVBhdGNoTWV0YVZpZXdcbiAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICBhY3Rpb25JY29uPXthdHRycy5hY3Rpb25JY29ufVxuICAgICAgICBhY3Rpb25UZXh0PXthdHRycy5hY3Rpb25UZXh0fVxuICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgYWN0aW9uPXsoKSA9PiB0aGlzLnByb3BzLnRvZ2dsZVN5bWxpbmtDaGFuZ2UoZmlsZVBhdGNoKX0+XG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICB7ZGV0YWlsfVxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgPC9GaWxlUGF0Y2hNZXRhVmlldz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySHVua0hlYWRlcnMoZmlsZVBhdGNoLCBvcmRlck9mZnNldCkge1xuICAgIGNvbnN0IHRvZ2dsZVZlcmIgPSB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMgPT09ICd1bnN0YWdlZCcgPyAnU3RhZ2UnIDogJ1Vuc3RhZ2UnO1xuICAgIGNvbnN0IHNlbGVjdGVkSHVua3MgPSBuZXcgU2V0KFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLnByb3BzLnNlbGVjdGVkUm93cywgcm93ID0+IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0SHVua0F0KHJvdykpLFxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8TWFya2VyTGF5ZXI+XG4gICAgICAgICAge2ZpbGVQYXRjaC5nZXRIdW5rcygpLm1hcCgoaHVuaywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5zU2VsZWN0aW9uID0gdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlID09PSAnbGluZScgJiYgc2VsZWN0ZWRIdW5rcy5oYXMoaHVuayk7XG4gICAgICAgICAgICBjb25zdCBpc1NlbGVjdGVkID0gKHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2h1bmsnKSAmJiBzZWxlY3RlZEh1bmtzLmhhcyhodW5rKTtcblxuICAgICAgICAgICAgbGV0IGJ1dHRvblN1ZmZpeCA9ICcnO1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgIGJ1dHRvblN1ZmZpeCArPSAnU2VsZWN0ZWQgTGluZSc7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdGVkUm93cy5zaXplID4gMSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvblN1ZmZpeCArPSAncyc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ1dHRvblN1ZmZpeCArPSAnSHVuayc7XG4gICAgICAgICAgICAgIGlmIChzZWxlY3RlZEh1bmtzLnNpemUgPiAxKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uU3VmZml4ICs9ICdzJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2dnbGVTZWxlY3Rpb25MYWJlbCA9IGAke3RvZ2dsZVZlcmJ9ICR7YnV0dG9uU3VmZml4fWA7XG4gICAgICAgICAgICBjb25zdCBkaXNjYXJkU2VsZWN0aW9uTGFiZWwgPSBgRGlzY2FyZCAke2J1dHRvblN1ZmZpeH1gO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFydFBvaW50ID0gaHVuay5nZXRSYW5nZSgpLnN0YXJ0O1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRSYW5nZSA9IG5ldyBSYW5nZShzdGFydFBvaW50LCBzdGFydFBvaW50KTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPE1hcmtlciBrZXk9e2BodW5rSGVhZGVyLSR7aW5kZXh9YH0gYnVmZmVyUmFuZ2U9e3N0YXJ0UmFuZ2V9IGludmFsaWRhdGU9XCJuZXZlclwiPlxuICAgICAgICAgICAgICAgIDxEZWNvcmF0aW9uIHR5cGU9XCJibG9ja1wiIG9yZGVyPXtvcmRlck9mZnNldCArIDAuMn0gY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctY29udHJvbEJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICA8SHVua0hlYWRlclZpZXdcbiAgICAgICAgICAgICAgICAgICAgcmVmVGFyZ2V0PXt0aGlzLnJlZkVkaXRvckVsZW1lbnR9XG4gICAgICAgICAgICAgICAgICAgIGh1bms9e2h1bmt9XG4gICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgIHN0YWdpbmdTdGF0dXM9e3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZT1cImxpbmVcIlxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTZWxlY3Rpb25MYWJlbD17dG9nZ2xlU2VsZWN0aW9uTGFiZWx9XG4gICAgICAgICAgICAgICAgICAgIGRpc2NhcmRTZWxlY3Rpb25MYWJlbD17ZGlzY2FyZFNlbGVjdGlvbkxhYmVsfVxuXG4gICAgICAgICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG5cbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2VsZWN0aW9uPXsoKSA9PiB0aGlzLnRvZ2dsZUh1bmtTZWxlY3Rpb24oaHVuaywgY29udGFpbnNTZWxlY3Rpb24pfVxuICAgICAgICAgICAgICAgICAgICBkaXNjYXJkU2VsZWN0aW9uPXsoKSA9PiB0aGlzLmRpc2NhcmRIdW5rU2VsZWN0aW9uKGh1bmssIGNvbnRhaW5zU2VsZWN0aW9uKX1cbiAgICAgICAgICAgICAgICAgICAgbW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bk9uSGVhZGVyfVxuICAgICAgICAgICAgICAgICAgICBpdGVtVHlwZT17dGhpcy5wcm9wcy5pdGVtVHlwZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9EZWNvcmF0aW9uPlxuICAgICAgICAgICAgICA8L01hcmtlcj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvTWFya2VyTGF5ZXI+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJMaW5lRGVjb3JhdGlvbnMocmFuZ2VzLCBsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb24sIHJlZkhvbGRlcn0pIHtcbiAgICBpZiAocmFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaG9sZGVyID0gcmVmSG9sZGVyIHx8IG5ldyBSZWZIb2xkZXIoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcmtlckxheWVyIGhhbmRsZUxheWVyPXtob2xkZXIuc2V0dGVyfT5cbiAgICAgICAge3Jhbmdlcy5tYXAoKHJhbmdlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TWFya2VyXG4gICAgICAgICAgICAgIGtleT17YGxpbmUtJHtsaW5lQ2xhc3N9LSR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgYnVmZmVyUmFuZ2U9e3JhbmdlfVxuICAgICAgICAgICAgICBpbnZhbGlkYXRlPVwibmV2ZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgICAge3RoaXMucmVuZGVyRGVjb3JhdGlvbnMobGluZUNsYXNzLCB7bGluZSwgZ3V0dGVyLCBpY29ufSl9XG4gICAgICA8L01hcmtlckxheWVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEZWNvcmF0aW9uc09uTGF5ZXIobGF5ZXIsIGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbn0pIHtcbiAgICBpZiAobGF5ZXIuZ2V0TWFya2VyQ291bnQoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXJrZXJMYXllciBleHRlcm5hbD17bGF5ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJEZWNvcmF0aW9ucyhsaW5lQ2xhc3MsIHtsaW5lLCBndXR0ZXIsIGljb259KX1cbiAgICAgIDwvTWFya2VyTGF5ZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRlY29yYXRpb25zKGxpbmVDbGFzcywge2xpbmUsIGd1dHRlciwgaWNvbn0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICB7bGluZSAmJiAoXG4gICAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICAgIHR5cGU9XCJsaW5lXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17bGluZUNsYXNzfVxuICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAge2d1dHRlciAmJiAoXG4gICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICAgICAgZ3V0dGVyTmFtZT1cIm9sZC1saW5lLW51bWJlcnNcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2xpbmVDbGFzc31cbiAgICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICAgICAgdHlwZT1cImxpbmUtbnVtYmVyXCJcbiAgICAgICAgICAgICAgZ3V0dGVyTmFtZT1cIm5ldy1saW5lLW51bWJlcnNcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2xpbmVDbGFzc31cbiAgICAgICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICAgICAgdHlwZT1cImd1dHRlclwiXG4gICAgICAgICAgICAgIGd1dHRlck5hbWU9XCJnaXRodWItY29tbWVudC1pY29uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgZ2l0aHViLWVkaXRvckNvbW1lbnRHdXR0ZXJJY29uIGVtcHR5ICR7bGluZUNsYXNzfWB9XG4gICAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICApfVxuICAgICAgICB7aWNvbiAmJiAoXG4gICAgICAgICAgPERlY29yYXRpb25cbiAgICAgICAgICAgIHR5cGU9XCJsaW5lLW51bWJlclwiXG4gICAgICAgICAgICBndXR0ZXJOYW1lPVwiZGlmZi1pY29uc1wiXG4gICAgICAgICAgICBjbGFzc05hbWU9e2xpbmVDbGFzc31cbiAgICAgICAgICAgIG9taXRFbXB0eUxhc3RSb3c9e2ZhbHNlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8gPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnkpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRmlsZVBhdGNoZXMgPSBBcnJheS5mcm9tKHRoaXMuZ2V0U2VsZWN0ZWRGaWxlUGF0Y2hlcygpKTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gQ2hhbmdlZEZpbGVJdGVtKSB7XG4gICAgICAgIHRoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkKHNlbGVjdGVkRmlsZVBhdGNoZXNbMF0sIHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdjb3JlOnVuZG8nfX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24gPSBmaWxlUGF0Y2ggPT4ge1xuICAgIHRoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkKGZpbGVQYXRjaCwge2V2ZW50U291cmNlOiAnYnV0dG9uJ30pO1xuICB9XG5cbiAgZGlzY2FyZFNlbGVjdGlvbkZyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRSb3dzKFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsXG4gICAgICB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUsXG4gICAgICB7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnZ2l0aHViOmRpc2NhcmQtc2VsZWN0ZWQtbGluZXMnfX0sXG4gICAgKTtcbiAgfVxuXG4gIHRvZ2dsZUh1bmtTZWxlY3Rpb24oaHVuaywgY29udGFpbnNTZWxlY3Rpb24pIHtcbiAgICBpZiAoY29udGFpbnNTZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnRvZ2dsZVJvd3MoXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzLFxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUsXG4gICAgICAgIHtldmVudFNvdXJjZTogJ2J1dHRvbid9LFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2hhbmdlUm93cyA9IG5ldyBTZXQoXG4gICAgICAgIGh1bmsuZ2V0Q2hhbmdlcygpXG4gICAgICAgICAgLnJlZHVjZSgocm93cywgY2hhbmdlKSA9PiB7XG4gICAgICAgICAgICByb3dzLnB1c2goLi4uY2hhbmdlLmdldEJ1ZmZlclJvd3MoKSk7XG4gICAgICAgICAgICByZXR1cm4gcm93cztcbiAgICAgICAgICB9LCBbXSksXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMudG9nZ2xlUm93cyhcbiAgICAgICAgY2hhbmdlUm93cyxcbiAgICAgICAgJ2h1bmsnLFxuICAgICAgICB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZGlzY2FyZEh1bmtTZWxlY3Rpb24oaHVuaywgY29udGFpbnNTZWxlY3Rpb24pIHtcbiAgICBpZiAoY29udGFpbnNTZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRSb3dzKFxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGVkUm93cyxcbiAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlLFxuICAgICAgICB7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNoYW5nZVJvd3MgPSBuZXcgU2V0KFxuICAgICAgICBodW5rLmdldENoYW5nZXMoKVxuICAgICAgICAgIC5yZWR1Y2UoKHJvd3MsIGNoYW5nZSkgPT4ge1xuICAgICAgICAgICAgcm93cy5wdXNoKC4uLmNoYW5nZS5nZXRCdWZmZXJSb3dzKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgICAgICAgfSwgW10pLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRSb3dzKGNoYW5nZVJvd3MsICdodW5rJywge2V2ZW50U291cmNlOiAnYnV0dG9uJ30pO1xuICAgIH1cbiAgfVxuXG4gIGRpZE1vdXNlRG93bk9uSGVhZGVyKGV2ZW50LCBodW5rKSB7XG4gICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvbkV2ZW50KGV2ZW50LCBodW5rLmdldFJhbmdlKCkpO1xuICB9XG5cbiAgZGlkTW91c2VEb3duT25MaW5lTnVtYmVyKGV2ZW50KSB7XG4gICAgY29uc3QgbGluZSA9IGV2ZW50LmJ1ZmZlclJvdztcbiAgICBpZiAobGluZSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKGxpbmUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdsaW5lJztcbiAgICBpZiAodGhpcy5oYW5kbGVTZWxlY3Rpb25FdmVudChldmVudC5kb21FdmVudCwgW1tsaW5lLCAwXSwgW2xpbmUsIEluZmluaXR5XV0pKSB7XG4gICAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZGlkTW91c2VNb3ZlT25MaW5lTnVtYmVyKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmUgPSBldmVudC5idWZmZXJSb3c7XG4gICAgaWYgKHRoaXMubGFzdE1vdXNlTW92ZUxpbmUgPT09IGxpbmUgfHwgbGluZSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKGxpbmUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGFzdE1vdXNlTW92ZUxpbmUgPSBsaW5lO1xuXG4gICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdsaW5lJztcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvbkV2ZW50KGV2ZW50LmRvbUV2ZW50LCBbW2xpbmUsIDBdLCBbbGluZSwgSW5maW5pdHldXSwge2FkZDogdHJ1ZX0pO1xuICB9XG5cbiAgZGlkTW91c2VVcCgpIHtcbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlU2VsZWN0aW9uRXZlbnQoZXZlbnQsIHJhbmdlTGlrZSwgb3B0cykge1xuICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1dpbmRvd3MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInO1xuICAgIGlmIChldmVudC5jdHJsS2V5ICYmICFpc1dpbmRvd3MpIHtcbiAgICAgIC8vIEFsbG93IHRoZSBjb250ZXh0IG1lbnUgdG8gb3Blbi5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgYWRkOiBmYWxzZSxcbiAgICAgIC4uLm9wdHMsXG4gICAgfTtcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgdGFyZ2V0IHNlbGVjdGlvbiByYW5nZVxuICAgIGNvbnN0IGNvbnZlcnRlZCA9IFJhbmdlLmZyb21PYmplY3QocmFuZ2VMaWtlKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4gZWRpdG9yLmNsaXBCdWZmZXJSYW5nZShjb252ZXJ0ZWQpKS5nZXRPcihjb252ZXJ0ZWQpO1xuXG4gICAgaWYgKGV2ZW50Lm1ldGFLZXkgfHwgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gKGV2ZW50LmN0cmxLZXkgJiYgaXNXaW5kb3dzKSkge1xuICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgIGxldCBpbnRlcnNlY3RzID0gZmFsc2U7XG4gICAgICAgIGxldCB3aXRob3V0ID0gbnVsbDtcblxuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpKSB7XG4gICAgICAgICAgaWYgKHNlbGVjdGlvbi5pbnRlcnNlY3RzQnVmZmVyUmFuZ2UocmFuZ2UpKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgcmFuZ2UgZnJvbSB0aGlzIHNlbGVjdGlvbiBieSB0cnVuY2F0aW5nIGl0IHRvIHRoZSBcIm5lYXIgZWRnZVwiIG9mIHRoZSByYW5nZSBhbmQgY3JlYXRpbmcgYVxuICAgICAgICAgICAgLy8gbmV3IHNlbGVjdGlvbiBmcm9tIHRoZSBcImZhciBlZGdlXCIgdG8gdGhlIHByZXZpb3VzIGVuZC4gT21pdCBlaXRoZXIgc2lkZSBpZiBpdCBpcyBlbXB0eS5cbiAgICAgICAgICAgIGludGVyc2VjdHMgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKTtcblxuICAgICAgICAgICAgY29uc3QgbmV3UmFuZ2VzID0gW107XG5cbiAgICAgICAgICAgIGlmICghcmFuZ2Uuc3RhcnQuaXNFcXVhbChzZWxlY3Rpb25SYW5nZS5zdGFydCkpIHtcbiAgICAgICAgICAgICAgLy8gSW5jbHVkZSB0aGUgYml0IGZyb20gdGhlIHNlbGVjdGlvbidzIHByZXZpb3VzIHN0YXJ0IHRvIHRoZSByYW5nZSdzIHN0YXJ0LlxuICAgICAgICAgICAgICBsZXQgbnVkZ2VkID0gcmFuZ2Uuc3RhcnQ7XG4gICAgICAgICAgICAgIGlmIChyYW5nZS5zdGFydC5jb2x1bW4gPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0Q29sdW1uID0gZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3cocmFuZ2Uuc3RhcnQucm93IC0gMSk7XG4gICAgICAgICAgICAgICAgbnVkZ2VkID0gW3JhbmdlLnN0YXJ0LnJvdyAtIDEsIGxhc3RDb2x1bW5dO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbmV3UmFuZ2VzLnB1c2goW3NlbGVjdGlvblJhbmdlLnN0YXJ0LCBudWRnZWRdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFyYW5nZS5lbmQuaXNFcXVhbChzZWxlY3Rpb25SYW5nZS5lbmQpKSB7XG4gICAgICAgICAgICAgIC8vIEluY2x1ZGUgdGhlIGJpdCBmcm9tIHRoZSByYW5nZSdzIGVuZCB0byB0aGUgc2VsZWN0aW9uJ3MgZW5kLlxuICAgICAgICAgICAgICBsZXQgbnVkZ2VkID0gcmFuZ2UuZW5kO1xuICAgICAgICAgICAgICBjb25zdCBsYXN0Q29sdW1uID0gZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3cocmFuZ2UuZW5kLnJvdyk7XG4gICAgICAgICAgICAgIGlmIChyYW5nZS5lbmQuY29sdW1uID09PSBsYXN0Q29sdW1uKSB7XG4gICAgICAgICAgICAgICAgbnVkZ2VkID0gW3JhbmdlLmVuZC5yb3cgKyAxLCAwXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG5ld1Jhbmdlcy5wdXNoKFtudWRnZWQsIHNlbGVjdGlvblJhbmdlLmVuZF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV3UmFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKG5ld1Jhbmdlc1swXSk7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgbmV3UmFuZ2Ugb2YgbmV3UmFuZ2VzLnNsaWNlKDEpKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKG5ld1JhbmdlLCB7cmV2ZXJzZWQ6IHNlbGVjdGlvbi5pc1JldmVyc2VkKCl9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2l0aG91dCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2l0aG91dCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50UmFuZ2VzID0gZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgICAgICAgLmZpbHRlcihlYWNoID0+IGVhY2ggIT09IHdpdGhvdXQpXG4gICAgICAgICAgICAubWFwKGVhY2ggPT4gZWFjaC5nZXRCdWZmZXJSYW5nZSgpKTtcbiAgICAgICAgICBpZiAocmVwbGFjZW1lbnRSYW5nZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKHJlcGxhY2VtZW50UmFuZ2VzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWludGVyc2VjdHMpIHtcbiAgICAgICAgICAvLyBBZGQgdGhpcyByYW5nZSBhcyBhIG5ldywgZGlzdGluY3Qgc2VsZWN0aW9uLlxuICAgICAgICAgIGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShyYW5nZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hZGQgfHwgZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIC8vIEV4dGVuZCB0aGUgZXhpc3Rpbmcgc2VsZWN0aW9uIHRvIGVuY29tcGFzcyB0aGlzIHJhbmdlLlxuICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICAgIGNvbnN0IGxhc3RTZWxlY3Rpb24gPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpO1xuICAgICAgICBjb25zdCBsYXN0U2VsZWN0aW9uUmFuZ2UgPSBsYXN0U2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCk7XG5cbiAgICAgICAgLy8gWW91IGFyZSBub3cgZW50ZXJpbmcgdGhlIHdhbGwgb2YgdGVybmVyeSBvcGVyYXRvcnMuIFRoaXMgaXMgeW91ciBsYXN0IGV4aXQgYmVmb3JlIHRoZSB0b2xsYm9vdGhcbiAgICAgICAgY29uc3QgaXNCZWZvcmUgPSByYW5nZS5zdGFydC5pc0xlc3NUaGFuKGxhc3RTZWxlY3Rpb25SYW5nZS5zdGFydCk7XG4gICAgICAgIGNvbnN0IGZhckVkZ2UgPSBpc0JlZm9yZSA/IHJhbmdlLnN0YXJ0IDogcmFuZ2UuZW5kO1xuICAgICAgICBjb25zdCBuZXdSYW5nZSA9IGlzQmVmb3JlID8gW2ZhckVkZ2UsIGxhc3RTZWxlY3Rpb25SYW5nZS5lbmRdIDogW2xhc3RTZWxlY3Rpb25SYW5nZS5zdGFydCwgZmFyRWRnZV07XG5cbiAgICAgICAgbGFzdFNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShuZXdSYW5nZSwge3JldmVyc2VkOiBpc0JlZm9yZX0pO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkaWRDb25maXJtKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnRvZ2dsZVJvd3ModGhpcy5wcm9wcy5zZWxlY3RlZFJvd3MsIHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSk7XG4gIH1cblxuICBkaWRUb2dnbGVTZWxlY3Rpb25Nb2RlKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSHVua3MgPSB0aGlzLmdldFNlbGVjdGVkSHVua3MoKTtcbiAgICB0aGlzLndpdGhTZWxlY3Rpb25Nb2RlKHtcbiAgICAgIGxpbmU6ICgpID0+IHtcbiAgICAgICAgY29uc3QgaHVua1JhbmdlcyA9IHNlbGVjdGVkSHVua3MubWFwKGh1bmsgPT4gaHVuay5nZXRSYW5nZSgpKTtcbiAgICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoaHVua1JhbmdlcykpO1xuICAgICAgfSxcbiAgICAgIGh1bms6ICgpID0+IHtcbiAgICAgICAgbGV0IGZpcnN0Q2hhbmdlUm93ID0gSW5maW5pdHk7XG4gICAgICAgIGZvciAoY29uc3QgaHVuayBvZiBzZWxlY3RlZEh1bmtzKSB7XG4gICAgICAgICAgY29uc3QgW2ZpcnN0Q2hhbmdlXSA9IGh1bmsuZ2V0Q2hhbmdlcygpO1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGZpcnN0Q2hhbmdlICYmICghZmlyc3RDaGFuZ2VSb3cgfHwgZmlyc3RDaGFuZ2UuZ2V0U3RhcnRCdWZmZXJSb3coKSA8IGZpcnN0Q2hhbmdlUm93KSkge1xuICAgICAgICAgICAgZmlyc3RDaGFuZ2VSb3cgPSBmaXJzdENoYW5nZS5nZXRTdGFydEJ1ZmZlclJvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnbGluZSc7XG4gICAgICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhbW1tmaXJzdENoYW5nZVJvdywgMF0sIFtmaXJzdENoYW5nZVJvdywgSW5maW5pdHldXV0pO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBkaWRUb2dnbGVNb2RlQ2hhbmdlID0gKCkgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIEFycmF5LmZyb20odGhpcy5nZXRTZWxlY3RlZEZpbGVQYXRjaGVzKCkpXG4gICAgICAgIC5maWx0ZXIoZnAgPT4gZnAuZGlkQ2hhbmdlRXhlY3V0YWJsZU1vZGUoKSlcbiAgICAgICAgLm1hcCh0aGlzLnByb3BzLnRvZ2dsZU1vZGVDaGFuZ2UpLFxuICAgICk7XG4gIH1cblxuICBkaWRUb2dnbGVTeW1saW5rQ2hhbmdlID0gKCkgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIEFycmF5LmZyb20odGhpcy5nZXRTZWxlY3RlZEZpbGVQYXRjaGVzKCkpXG4gICAgICAgIC5maWx0ZXIoZnAgPT4gZnAuaGFzVHlwZWNoYW5nZSgpKVxuICAgICAgICAubWFwKHRoaXMucHJvcHMudG9nZ2xlU3ltbGlua0NoYW5nZSksXG4gICAgKTtcbiAgfVxuXG4gIHNlbGVjdE5leHRIdW5rKCkge1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgbmV4dEh1bmtzID0gbmV3IFNldChcbiAgICAgICAgdGhpcy53aXRoU2VsZWN0ZWRIdW5rcyhodW5rID0+IHRoaXMuZ2V0SHVua0FmdGVyKGh1bmspIHx8IGh1bmspLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5leHRSYW5nZXMgPSBBcnJheS5mcm9tKG5leHRIdW5rcywgaHVuayA9PiBodW5rLmdldFJhbmdlKCkpO1xuICAgICAgdGhpcy5uZXh0U2VsZWN0aW9uTW9kZSA9ICdodW5rJztcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhuZXh0UmFuZ2VzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0UHJldmlvdXNIdW5rKCkge1xuICAgIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgbmV4dEh1bmtzID0gbmV3IFNldChcbiAgICAgICAgdGhpcy53aXRoU2VsZWN0ZWRIdW5rcyhodW5rID0+IHRoaXMuZ2V0SHVua0JlZm9yZShodW5rKSB8fCBodW5rKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXh0UmFuZ2VzID0gQXJyYXkuZnJvbShuZXh0SHVua3MsIGh1bmsgPT4gaHVuay5nZXRSYW5nZSgpKTtcbiAgICAgIHRoaXMubmV4dFNlbGVjdGlvbk1vZGUgPSAnaHVuayc7XG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMobmV4dFJhbmdlcyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGRpZE9wZW5GaWxlKHtzZWxlY3RlZEZpbGVQYXRjaH0pIHtcbiAgICBjb25zdCBjdXJzb3JzQnlGaWxlUGF0Y2ggPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHBsYWNlZFJvd3MgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGZvciAoY29uc3QgY3Vyc29yIG9mIGVkaXRvci5nZXRDdXJzb3JzKCkpIHtcbiAgICAgICAgY29uc3QgY3Vyc29yUm93ID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkucm93O1xuICAgICAgICBjb25zdCBodW5rID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQoY3Vyc29yUm93KTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGNoID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hBdChjdXJzb3JSb3cpO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBpZiAoIWh1bmspIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdSb3cgPSBodW5rLmdldE5ld1Jvd0F0KGN1cnNvclJvdyk7XG4gICAgICAgIGxldCBuZXdDb2x1bW4gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKS5jb2x1bW47XG4gICAgICAgIGlmIChuZXdSb3cgPT09IG51bGwpIHtcbiAgICAgICAgICBsZXQgbmVhcmVzdFJvdyA9IGh1bmsuZ2V0TmV3U3RhcnRSb3coKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBodW5rLmdldFJlZ2lvbnMoKSkge1xuICAgICAgICAgICAgaWYgKCFyZWdpb24uaW5jbHVkZXNCdWZmZXJSb3coY3Vyc29yUm93KSkge1xuICAgICAgICAgICAgICByZWdpb24ud2hlbih7XG4gICAgICAgICAgICAgICAgdW5jaGFuZ2VkOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBuZWFyZXN0Um93ICs9IHJlZ2lvbi5idWZmZXJSb3dDb3VudCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWRkaXRpb246ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIG5lYXJlc3RSb3cgKz0gcmVnaW9uLmJ1ZmZlclJvd0NvdW50KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXBsYWNlZFJvd3MuaGFzKG5lYXJlc3RSb3cpKSB7XG4gICAgICAgICAgICBuZXdSb3cgPSBuZWFyZXN0Um93O1xuICAgICAgICAgICAgbmV3Q29sdW1uID0gMDtcbiAgICAgICAgICAgIHBsYWNlZFJvd3MuYWRkKG5lYXJlc3RSb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdSb3cgIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBXaHkgaXMgdGhpcyBuZWVkZWQ/IEkgX3RoaW5rXyBldmVyeXRoaW5nIGlzIGluIHRlcm1zIG9mIGJ1ZmZlciBwb3NpdGlvblxuICAgICAgICAgIC8vIHNvIHRoZXJlIHNob3VsZG4ndCBiZSBhbiBvZmYtYnktb25lIGlzc3VlXG4gICAgICAgICAgbmV3Um93IC09IDE7XG4gICAgICAgICAgY29uc3QgY3Vyc29ycyA9IGN1cnNvcnNCeUZpbGVQYXRjaC5nZXQoZmlsZVBhdGNoKTtcbiAgICAgICAgICBpZiAoIWN1cnNvcnMpIHtcbiAgICAgICAgICAgIGN1cnNvcnNCeUZpbGVQYXRjaC5zZXQoZmlsZVBhdGNoLCBbW25ld1JvdywgbmV3Q29sdW1uXV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJzb3JzLnB1c2goW25ld1JvdywgbmV3Q29sdW1uXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsZVBhdGNoZXNXaXRoQ3Vyc29ycyA9IG5ldyBTZXQoY3Vyc29yc0J5RmlsZVBhdGNoLmtleXMoKSk7XG4gICAgaWYgKHNlbGVjdGVkRmlsZVBhdGNoICYmICFmaWxlUGF0Y2hlc1dpdGhDdXJzb3JzLmhhcyhzZWxlY3RlZEZpbGVQYXRjaCkpIHtcbiAgICAgIGNvbnN0IFtmaXJzdEh1bmtdID0gc2VsZWN0ZWRGaWxlUGF0Y2guZ2V0SHVua3MoKTtcbiAgICAgIGNvbnN0IGN1cnNvclJvdyA9IGZpcnN0SHVuayA/IGZpcnN0SHVuay5nZXROZXdTdGFydFJvdygpIC0gMSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIDA7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuRmlsZShzZWxlY3RlZEZpbGVQYXRjaCwgW1tjdXJzb3JSb3csIDBdXSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBlbmRpbmcgPSBjdXJzb3JzQnlGaWxlUGF0Y2guc2l6ZSA9PT0gMTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChBcnJheS5mcm9tKGN1cnNvcnNCeUZpbGVQYXRjaCwgdmFsdWUgPT4ge1xuICAgICAgICBjb25zdCBbZmlsZVBhdGNoLCBjdXJzb3JzXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuRmlsZShmaWxlUGF0Y2gsIGN1cnNvcnMsIHBlbmRpbmcpO1xuICAgICAgfSkpO1xuICAgIH1cblxuICB9XG5cbiAgZ2V0U2VsZWN0ZWRSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IHtcbiAgICAgIHJldHVybiBuZXcgU2V0KFxuICAgICAgICBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICAgICAgLm1hcChzZWxlY3Rpb24gPT4gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkpXG4gICAgICAgICAgLnJlZHVjZSgoYWNjLCByYW5nZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgcmFuZ2UuZ2V0Um93cygpKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzQ2hhbmdlUm93KHJvdykpIHtcbiAgICAgICAgICAgICAgICBhY2MucHVzaChyb3cpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sIFtdKSxcbiAgICAgICk7XG4gICAgfSkuZ2V0T3IobmV3IFNldCgpKTtcbiAgfVxuXG4gIGRpZEFkZFNlbGVjdGlvbigpIHtcbiAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkUm93cygpO1xuICB9XG5cbiAgZGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICAhZXZlbnQgfHxcbiAgICAgIGV2ZW50Lm9sZEJ1ZmZlclJhbmdlLnN0YXJ0LnJvdyAhPT0gZXZlbnQubmV3QnVmZmVyUmFuZ2Uuc3RhcnQucm93IHx8XG4gICAgICBldmVudC5vbGRCdWZmZXJSYW5nZS5lbmQucm93ICE9PSBldmVudC5uZXdCdWZmZXJSYW5nZS5lbmQucm93XG4gICAgKSB7XG4gICAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkUm93cygpO1xuICAgIH1cbiAgfVxuXG4gIGRpZERlc3Ryb3lTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZFJvd3MoKTtcbiAgfVxuXG4gIGRpZENoYW5nZVNlbGVjdGVkUm93cygpIHtcbiAgICBpZiAodGhpcy5zdXBwcmVzc0NoYW5nZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0Q3Vyc29yUm93cyA9IHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgcmV0dXJuIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKS5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24ucm93KTtcbiAgICB9KS5nZXRPcihbXSk7XG4gICAgY29uc3QgaGFzTXVsdGlwbGVGaWxlU2VsZWN0aW9ucyA9IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guc3BhbnNNdWx0aXBsZUZpbGVzKG5leHRDdXJzb3JSb3dzKTtcblxuICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRSb3dzQ2hhbmdlZChcbiAgICAgIHRoaXMuZ2V0U2VsZWN0ZWRSb3dzKCksXG4gICAgICB0aGlzLm5leHRTZWxlY3Rpb25Nb2RlIHx8ICdsaW5lJyxcbiAgICAgIGhhc011bHRpcGxlRmlsZVNlbGVjdGlvbnMsXG4gICAgKTtcbiAgfVxuXG4gIG9sZExpbmVOdW1iZXJMYWJlbCh7YnVmZmVyUm93LCBzb2Z0V3JhcHBlZH0pIHtcbiAgICBjb25zdCBodW5rID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQoYnVmZmVyUm93KTtcbiAgICBpZiAoaHVuayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWQoJycpO1xuICAgIH1cblxuICAgIGNvbnN0IG9sZFJvdyA9IGh1bmsuZ2V0T2xkUm93QXQoYnVmZmVyUm93KTtcbiAgICBpZiAoc29mdFdyYXBwZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZChvbGRSb3cgPT09IG51bGwgPyAnJyA6ICfigKInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYWQob2xkUm93KTtcbiAgfVxuXG4gIG5ld0xpbmVOdW1iZXJMYWJlbCh7YnVmZmVyUm93LCBzb2Z0V3JhcHBlZH0pIHtcbiAgICBjb25zdCBodW5rID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQoYnVmZmVyUm93KTtcbiAgICBpZiAoaHVuayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWQoJycpO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1JvdyA9IGh1bmsuZ2V0TmV3Um93QXQoYnVmZmVyUm93KTtcbiAgICBpZiAoc29mdFdyYXBwZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZChuZXdSb3cgPT09IG51bGwgPyAnJyA6ICfigKInKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFkKG5ld1Jvdyk7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gYSBTZXQgb2YgdGhlIEh1bmtzIHRoYXQgaW5jbHVkZSBhdCBsZWFzdCBvbmUgZWRpdG9yIHNlbGVjdGlvbi4gVGhlIHNlbGVjdGlvbiBuZWVkIG5vdCBjb250YWluIGFuIGFjdHVhbFxuICAgKiBjaGFuZ2Ugcm93LlxuICAgKi9cbiAgZ2V0U2VsZWN0ZWRIdW5rcygpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoU2VsZWN0ZWRIdW5rcyhlYWNoID0+IGVhY2gpO1xuICB9XG5cbiAgd2l0aFNlbGVjdGVkSHVua3MoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiB7XG4gICAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgICAgcmV0dXJuIGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpLnJlZHVjZSgoYWNjLCByYW5nZSkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByYW5nZS5nZXRSb3dzKCkpIHtcbiAgICAgICAgICBjb25zdCBodW5rID0gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQocm93KTtcbiAgICAgICAgICBpZiAoIWh1bmsgfHwgc2Vlbi5oYXMoaHVuaykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlZW4uYWRkKGh1bmspO1xuICAgICAgICAgIGFjYy5wdXNoKGNhbGxiYWNrKGh1bmspKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwgW10pO1xuICAgIH0pLmdldE9yKFtdKTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiBhIFNldCBvZiBGaWxlUGF0Y2hlcyB0aGF0IGluY2x1ZGUgYXQgbGVhc3Qgb25lIGVkaXRvciBzZWxlY3Rpb24uIFRoZSBzZWxlY3Rpb24gbmVlZCBub3QgY29udGFpbiBhbiBhY3R1YWxcbiAgICogY2hhbmdlIHJvdy5cbiAgICovXG4gIGdldFNlbGVjdGVkRmlsZVBhdGNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmRWRpdG9yLm1hcChlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcGF0Y2hlcyA9IG5ldyBTZXQoKTtcbiAgICAgIGZvciAoY29uc3QgcmFuZ2Ugb2YgZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkpIHtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgcmFuZ2UuZ2V0Um93cygpKSB7XG4gICAgICAgICAgY29uc3QgcGF0Y2ggPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaEF0KHJvdyk7XG4gICAgICAgICAgcGF0Y2hlcy5hZGQocGF0Y2gpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGF0Y2hlcztcbiAgICB9KS5nZXRPcihuZXcgU2V0KCkpO1xuICB9XG5cbiAgZ2V0SHVua0JlZm9yZShodW5rKSB7XG4gICAgY29uc3QgcHJldlJvdyA9IGh1bmsuZ2V0UmFuZ2UoKS5zdGFydC5yb3cgLSAxO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEh1bmtBdChwcmV2Um93KTtcbiAgfVxuXG4gIGdldEh1bmtBZnRlcihodW5rKSB7XG4gICAgY29uc3QgbmV4dFJvdyA9IGh1bmsuZ2V0UmFuZ2UoKS5lbmQucm93ICsgMTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRIdW5rQXQobmV4dFJvdyk7XG4gIH1cblxuICBpc0NoYW5nZVJvdyhidWZmZXJSb3cpIHtcbiAgICBjb25zdCBjaGFuZ2VMYXllcnMgPSBbdGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaC5nZXRBZGRpdGlvbkxheWVyKCksIHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RGVsZXRpb25MYXllcigpXTtcbiAgICByZXR1cm4gY2hhbmdlTGF5ZXJzLnNvbWUobGF5ZXIgPT4gbGF5ZXIuZmluZE1hcmtlcnMoe2ludGVyc2VjdHNSb3c6IGJ1ZmZlclJvd30pLmxlbmd0aCA+IDApO1xuICB9XG5cbiAgd2l0aFNlbGVjdGlvbk1vZGUoY2FsbGJhY2tzKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSBjYWxsYmFja3NbdGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlXTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gc2VsZWN0aW9uIG1vZGU6ICR7dGhpcy5wcm9wcy5zZWxlY3Rpb25Nb2RlfWApO1xuICAgIH1cbiAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgfVxuXG4gIHBhZChudW0pIHtcbiAgICBjb25zdCBtYXhEaWdpdHMgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldE1heExpbmVOdW1iZXJXaWR0aCgpO1xuICAgIGlmIChudW0gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBOQlNQX0NIQVJBQ1RFUi5yZXBlYXQobWF4RGlnaXRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE5CU1BfQ0hBUkFDVEVSLnJlcGVhdChtYXhEaWdpdHMgLSBudW0udG9TdHJpbmcoKS5sZW5ndGgpICsgbnVtLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9GaWxlID0gKHtjaGFuZ2VkRmlsZVBhdGgsIGNoYW5nZWRGaWxlUG9zaXRpb259KSA9PiB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZSA9PiB7XG4gICAgICBjb25zdCByb3cgPSB0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNoLmdldEJ1ZmZlclJvd0ZvckRpZmZQb3NpdGlvbihjaGFuZ2VkRmlsZVBhdGgsIGNoYW5nZWRGaWxlUG9zaXRpb24pO1xuICAgICAgaWYgKHJvdyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgZS5zY3JvbGxUb0J1ZmZlclBvc2l0aW9uKHtyb3csIGNvbHVtbjogMH0sIHtjZW50ZXI6IHRydWV9KTtcbiAgICAgIGUuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oe3JvdywgY29sdW1uOiAwfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIG1lYXN1cmVQZXJmb3JtYW5jZShhY3Rpb24pIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICgoYWN0aW9uID09PSAndXBkYXRlJyB8fCBhY3Rpb24gPT09ICdtb3VudCcpXG4gICAgICAmJiBwZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlOYW1lKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LXN0YXJ0YCkubGVuZ3RoID4gMCkge1xuICAgICAgcGVyZm9ybWFuY2UubWFyayhgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1lbmRgKTtcbiAgICAgIHBlcmZvcm1hbmNlLm1lYXN1cmUoXG4gICAgICAgIGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259YCxcbiAgICAgICAgYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn0tc3RhcnRgLFxuICAgICAgICBgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufS1lbmRgKTtcbiAgICAgIGNvbnN0IHBlcmYgPSBwZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlOYW1lKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259YClbMF07XG4gICAgICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LXN0YXJ0YCk7XG4gICAgICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKGBNdWx0aUZpbGVQYXRjaFZpZXctJHthY3Rpb259LWVuZGApO1xuICAgICAgcGVyZm9ybWFuY2UuY2xlYXJNZWFzdXJlcyhgTXVsdGlGaWxlUGF0Y2hWaWV3LSR7YWN0aW9ufWApO1xuICAgICAgYWRkRXZlbnQoYE11bHRpRmlsZVBhdGNoVmlldy0ke2FjdGlvbn1gLCB7XG4gICAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgICBmaWxlUGF0Y2hlc0xpbmVDb3VudHM6IHRoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKS5tYXAoXG4gICAgICAgICAgZnAgPT4gZnAuZ2V0UGF0Y2goKS5nZXRDaGFuZ2VkTGluZUNvdW50KCksXG4gICAgICAgICksXG4gICAgICAgIGR1cmF0aW9uOiBwZXJmLmR1cmF0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=