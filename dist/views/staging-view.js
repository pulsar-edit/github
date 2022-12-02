"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

var _electron = require("electron");

var _atom = require("atom");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _path = _interopRequireDefault(require("path"));

var _propTypes2 = require("../prop-types");

var _filePatchListItemView = _interopRequireDefault(require("./file-patch-list-item-view"));

var _observeModel = _interopRequireDefault(require("./observe-model"));

var _mergeConflictListItemView = _interopRequireDefault(require("./merge-conflict-list-item-view"));

var _compositeListSelection = _interopRequireDefault(require("../models/composite-list-selection"));

var _resolutionProgress = _interopRequireDefault(require("../models/conflicts/resolution-progress"));

var _commitView = _interopRequireDefault(require("./commit-view"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _changedFileItem = _interopRequireDefault(require("../items/changed-file-item"));

var _commands = _interopRequireWildcard(require("../atom/commands"));

var _helpers = require("../helpers");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  Menu,
  MenuItem
} = _electron.remote;

const debounce = (fn, wait) => {
  let timeout;
  return (...args) => {
    return new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        resolve(fn(...args));
      }, wait);
    });
  };
};

function calculateTruncatedLists(lists) {
  return Object.keys(lists).reduce((acc, key) => {
    const list = lists[key];
    acc.source[key] = list;

    if (list.length <= MAXIMUM_LISTED_ENTRIES) {
      acc[key] = list;
    } else {
      acc[key] = list.slice(0, MAXIMUM_LISTED_ENTRIES);
    }

    return acc;
  }, {
    source: {}
  });
}

const noop = () => {};

const MAXIMUM_LISTED_ENTRIES = 1000;

class StagingView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "undoLastDiscardFromCoreUndo", () => {
      this.undoLastDiscard({
        eventSource: {
          command: 'core:undo'
        }
      });
    });

    _defineProperty(this, "undoLastDiscardFromCommand", () => {
      this.undoLastDiscard({
        eventSource: {
          command: 'github:undo-last-discard-in-git-tab'
        }
      });
    });

    _defineProperty(this, "undoLastDiscardFromButton", () => {
      this.undoLastDiscard({
        eventSource: 'button'
      });
    });

    _defineProperty(this, "undoLastDiscardFromHeaderMenu", () => {
      this.undoLastDiscard({
        eventSource: 'header-menu'
      });
    });

    _defineProperty(this, "discardChangesFromCommand", () => {
      this.discardChanges({
        eventSource: {
          command: 'github:discard-changes-in-selected-files'
        }
      });
    });

    _defineProperty(this, "discardAllFromCommand", () => {
      this.discardAll({
        eventSource: {
          command: 'github:discard-all-changes'
        }
      });
    });

    _defineProperty(this, "confirmSelectedItems", async () => {
      const itemPaths = this.getSelectedItemFilePaths();
      await this.props.attemptFileStageOperation(itemPaths, this.state.selection.getActiveListKey());
      await new Promise(resolve => {
        this.setState(prevState => ({
          selection: prevState.selection.coalesce()
        }), resolve);
      });
    });

    (0, _helpers.autobind)(this, 'dblclickOnItem', 'contextMenuOnItem', 'mousedownOnItem', 'mousemoveOnItem', 'mouseup', 'registerItemElement', 'renderBody', 'openFile', 'discardChanges', 'activateNextList', 'activatePreviousList', 'activateLastList', 'stageAll', 'unstageAll', 'stageAllMergeConflicts', 'discardAll', 'confirmSelectedItems', 'selectAll', 'selectFirst', 'selectLast', 'diveIntoSelection', 'showDiffView', 'showBulkResolveMenu', 'showActionsMenu', 'resolveCurrentAsOurs', 'resolveCurrentAsTheirs', 'quietlySelectItem', 'didChangeSelectedItems');
    this.subs = new _eventKit.CompositeDisposable(atom.config.observe('github.keyboardNavigationDelay', value => {
      if (value === 0) {
        this.debouncedDidChangeSelectedItem = this.didChangeSelectedItems;
      } else {
        this.debouncedDidChangeSelectedItem = debounce(this.didChangeSelectedItems, value);
      }
    }));
    this.state = _objectSpread({}, calculateTruncatedLists({
      unstagedChanges: this.props.unstagedChanges,
      stagedChanges: this.props.stagedChanges,
      mergeConflicts: this.props.mergeConflicts
    }), {
      selection: new _compositeListSelection.default({
        listsByKey: [['unstaged', this.props.unstagedChanges], ['conflicts', this.props.mergeConflicts], ['staged', this.props.stagedChanges]],
        idForItem: item => item.filePath
      })
    });
    this.mouseSelectionInProgress = false;
    this.listElementsByItem = new WeakMap();
    this.refRoot = new _refHolder.default();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = {};

    if (['unstagedChanges', 'stagedChanges', 'mergeConflicts'].some(key => prevState.source[key] !== nextProps[key])) {
      const nextLists = calculateTruncatedLists({
        unstagedChanges: nextProps.unstagedChanges,
        stagedChanges: nextProps.stagedChanges,
        mergeConflicts: nextProps.mergeConflicts
      });
      nextState = _objectSpread({}, nextLists, {
        selection: prevState.selection.updateLists([['unstaged', nextLists.unstagedChanges], ['conflicts', nextLists.mergeConflicts], ['staged', nextLists.stagedChanges]])
      });
    }

    return nextState;
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.mouseup);
    this.subs.add(new _eventKit.Disposable(() => window.removeEventListener('mouseup', this.mouseup)), this.props.workspace.onDidChangeActivePaneItem(() => {
      this.syncWithWorkspace();
    }));

    if (this.isPopulated(this.props)) {
      this.syncWithWorkspace();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isRepoSame = prevProps.workingDirectoryPath === this.props.workingDirectoryPath;
    const hasSelectionsPresent = prevState.selection.getSelectedItems().size > 0 && this.state.selection.getSelectedItems().size > 0;
    const selectionChanged = this.state.selection !== prevState.selection;

    if (isRepoSame && hasSelectionsPresent && selectionChanged) {
      this.debouncedDidChangeSelectedItem();
    }

    const headItem = this.state.selection.getHeadItem();

    if (headItem) {
      const element = this.listElementsByItem.get(headItem);

      if (element) {
        element.scrollIntoViewIfNeeded();
      }
    }

    if (!this.isPopulated(prevProps) && this.isPopulated(this.props)) {
      this.syncWithWorkspace();
    }
  }

  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.resolutionProgress,
      fetchData: noop
    }, this.renderBody);
  }

  renderBody() {
    const selectedItems = this.state.selection.getSelectedItems();
    return _react.default.createElement("div", {
      ref: this.refRoot.setter,
      className: `github-StagingView ${this.state.selection.getActiveListKey()}-changes-focused`,
      tabIndex: "-1"
    }, this.renderCommands(), _react.default.createElement("div", {
      className: `github-StagingView-group github-UnstagedChanges ${this.getFocusClass('unstaged')}`
    }, _react.default.createElement("header", {
      className: "github-StagingView-header"
    }, _react.default.createElement("span", {
      className: "icon icon-list-unordered"
    }), _react.default.createElement("span", {
      className: "github-StagingView-title"
    }, "Unstaged Changes"), this.renderActionsMenu(), _react.default.createElement("button", {
      className: "github-StagingView-headerButton icon icon-move-down",
      disabled: this.props.unstagedChanges.length === 0,
      onClick: this.stageAll
    }, "Stage All")), _react.default.createElement("div", {
      className: "github-StagingView-list github-FilePatchListView github-StagingView-unstaged"
    }, this.state.unstagedChanges.map(filePatch => _react.default.createElement(_filePatchListItemView.default, {
      key: filePatch.filePath,
      registerItemElement: this.registerItemElement,
      filePatch: filePatch,
      onDoubleClick: event => this.dblclickOnItem(event, filePatch),
      onContextMenu: event => this.contextMenuOnItem(event, filePatch),
      onMouseDown: event => this.mousedownOnItem(event, filePatch),
      onMouseMove: event => this.mousemoveOnItem(event, filePatch),
      selected: selectedItems.has(filePatch)
    }))), this.renderTruncatedMessage(this.props.unstagedChanges)), this.renderMergeConflicts(), _react.default.createElement("div", {
      className: `github-StagingView-group github-StagedChanges ${this.getFocusClass('staged')}`
    }, _react.default.createElement("header", {
      className: "github-StagingView-header"
    }, _react.default.createElement("span", {
      className: "icon icon-tasklist"
    }), _react.default.createElement("span", {
      className: "github-StagingView-title"
    }, "Staged Changes"), _react.default.createElement("button", {
      className: "github-StagingView-headerButton icon icon-move-up",
      disabled: this.props.stagedChanges.length === 0,
      onClick: this.unstageAll
    }, "Unstage All")), _react.default.createElement("div", {
      className: "github-StagingView-list github-FilePatchListView github-StagingView-staged"
    }, this.state.stagedChanges.map(filePatch => _react.default.createElement(_filePatchListItemView.default, {
      key: filePatch.filePath,
      filePatch: filePatch,
      registerItemElement: this.registerItemElement,
      onDoubleClick: event => this.dblclickOnItem(event, filePatch),
      onContextMenu: event => this.contextMenuOnItem(event, filePatch),
      onMouseDown: event => this.mousedownOnItem(event, filePatch),
      onMouseMove: event => this.mousemoveOnItem(event, filePatch),
      selected: selectedItems.has(filePatch)
    }))), this.renderTruncatedMessage(this.props.stagedChanges)));
  }

  renderCommands() {
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-StagingView"
    }, _react.default.createElement(_commands.Command, {
      command: "core:move-up",
      callback: () => this.selectPrevious()
    }), _react.default.createElement(_commands.Command, {
      command: "core:move-down",
      callback: () => this.selectNext()
    }), _react.default.createElement(_commands.Command, {
      command: "core:move-left",
      callback: this.diveIntoSelection
    }), _react.default.createElement(_commands.Command, {
      command: "github:show-diff-view",
      callback: this.showDiffView
    }), _react.default.createElement(_commands.Command, {
      command: "core:select-up",
      callback: () => this.selectPrevious(true)
    }), _react.default.createElement(_commands.Command, {
      command: "core:select-down",
      callback: () => this.selectNext(true)
    }), _react.default.createElement(_commands.Command, {
      command: "core:select-all",
      callback: this.selectAll
    }), _react.default.createElement(_commands.Command, {
      command: "core:move-to-top",
      callback: this.selectFirst
    }), _react.default.createElement(_commands.Command, {
      command: "core:move-to-bottom",
      callback: this.selectLast
    }), _react.default.createElement(_commands.Command, {
      command: "core:select-to-top",
      callback: () => this.selectFirst(true)
    }), _react.default.createElement(_commands.Command, {
      command: "core:select-to-bottom",
      callback: () => this.selectLast(true)
    }), _react.default.createElement(_commands.Command, {
      command: "core:confirm",
      callback: this.confirmSelectedItems
    }), _react.default.createElement(_commands.Command, {
      command: "github:activate-next-list",
      callback: this.activateNextList
    }), _react.default.createElement(_commands.Command, {
      command: "github:activate-previous-list",
      callback: this.activatePreviousList
    }), _react.default.createElement(_commands.Command, {
      command: "github:jump-to-file",
      callback: this.openFile
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-file-as-ours",
      callback: this.resolveCurrentAsOurs
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-file-as-theirs",
      callback: this.resolveCurrentAsTheirs
    }), _react.default.createElement(_commands.Command, {
      command: "github:discard-changes-in-selected-files",
      callback: this.discardChangesFromCommand
    }), _react.default.createElement(_commands.Command, {
      command: "core:undo",
      callback: this.undoLastDiscardFromCoreUndo
    })), _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, _react.default.createElement(_commands.Command, {
      command: "github:stage-all-changes",
      callback: this.stageAll
    }), _react.default.createElement(_commands.Command, {
      command: "github:unstage-all-changes",
      callback: this.unstageAll
    }), _react.default.createElement(_commands.Command, {
      command: "github:discard-all-changes",
      callback: this.discardAllFromCommand
    }), _react.default.createElement(_commands.Command, {
      command: "github:undo-last-discard-in-git-tab",
      callback: this.undoLastDiscardFromCommand
    })));
  }

  renderActionsMenu() {
    if (this.props.unstagedChanges.length || this.props.hasUndoHistory) {
      return _react.default.createElement("button", {
        className: "github-StagingView-headerButton github-StagingView-headerButton--iconOnly icon icon-ellipses",
        onClick: this.showActionsMenu
      });
    } else {
      return null;
    }
  }

  renderUndoButton() {
    return _react.default.createElement("button", {
      className: "github-StagingView-headerButton github-StagingView-headerButton--fullWidth icon icon-history",
      onClick: this.undoLastDiscardFromButton
    }, "Undo Discard");
  }

  renderTruncatedMessage(list) {
    if (list.length > MAXIMUM_LISTED_ENTRIES) {
      return _react.default.createElement("div", {
        className: "github-StagingView-group-truncatedMsg"
      }, "List truncated to the first ", MAXIMUM_LISTED_ENTRIES, " items");
    } else {
      return null;
    }
  }

  renderMergeConflicts() {
    const mergeConflicts = this.state.mergeConflicts;

    if (mergeConflicts && mergeConflicts.length > 0) {
      const selectedItems = this.state.selection.getSelectedItems();
      const resolutionProgress = this.props.resolutionProgress;
      const anyUnresolved = mergeConflicts.map(conflict => _path.default.join(this.props.workingDirectoryPath, conflict.filePath)).some(conflictPath => resolutionProgress.getRemaining(conflictPath) !== 0);
      const bulkResolveDropdown = anyUnresolved ? _react.default.createElement("span", {
        className: "inline-block icon icon-ellipses",
        onClick: this.showBulkResolveMenu
      }) : null;
      return _react.default.createElement("div", {
        className: `github-StagingView-group github-MergeConflictPaths ${this.getFocusClass('conflicts')}`
      }, _react.default.createElement("header", {
        className: "github-StagingView-header"
      }, _react.default.createElement("span", {
        className: 'github-FilePatchListView-icon icon icon-alert status-modified'
      }), _react.default.createElement("span", {
        className: "github-StagingView-title"
      }, "Merge Conflicts"), bulkResolveDropdown, _react.default.createElement("button", {
        className: "github-StagingView-headerButton icon icon-move-down",
        disabled: anyUnresolved,
        onClick: this.stageAllMergeConflicts
      }, "Stage All")), _react.default.createElement("div", {
        className: "github-StagingView-list github-FilePatchListView github-StagingView-merge"
      }, mergeConflicts.map(mergeConflict => {
        const fullPath = _path.default.join(this.props.workingDirectoryPath, mergeConflict.filePath);

        return _react.default.createElement(_mergeConflictListItemView.default, {
          key: fullPath,
          mergeConflict: mergeConflict,
          remainingConflicts: resolutionProgress.getRemaining(fullPath),
          registerItemElement: this.registerItemElement,
          onDoubleClick: event => this.dblclickOnItem(event, mergeConflict),
          onContextMenu: event => this.contextMenuOnItem(event, mergeConflict),
          onMouseDown: event => this.mousedownOnItem(event, mergeConflict),
          onMouseMove: event => this.mousemoveOnItem(event, mergeConflict),
          selected: selectedItems.has(mergeConflict)
        });
      })), this.renderTruncatedMessage(mergeConflicts));
    } else {
      return _react.default.createElement("noscript", null);
    }
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

  getSelectedItemFilePaths() {
    return Array.from(this.state.selection.getSelectedItems(), item => item.filePath);
  }

  getSelectedConflictPaths() {
    if (this.state.selection.getActiveListKey() !== 'conflicts') {
      return [];
    }

    return this.getSelectedItemFilePaths();
  }

  openFile() {
    const filePaths = this.getSelectedItemFilePaths();
    return this.props.openFiles(filePaths);
  }

  discardChanges({
    eventSource
  } = {}) {
    const filePaths = this.getSelectedItemFilePaths();
    (0, _reporterProxy.addEvent)('discard-unstaged-changes', {
      package: 'github',
      component: 'StagingView',
      fileCount: filePaths.length,
      type: 'selected',
      eventSource
    });
    return this.props.discardWorkDirChangesForPaths(filePaths);
  }

  activateNextList() {
    return new Promise(resolve => {
      let advanced = false;
      this.setState(prevState => {
        const next = prevState.selection.activateNextSelection();

        if (prevState.selection === next) {
          return {};
        }

        advanced = true;
        return {
          selection: next.coalesce()
        };
      }, () => resolve(advanced));
    });
  }

  activatePreviousList() {
    return new Promise(resolve => {
      let retreated = false;
      this.setState(prevState => {
        const next = prevState.selection.activatePreviousSelection();

        if (prevState.selection === next) {
          return {};
        }

        retreated = true;
        return {
          selection: next.coalesce()
        };
      }, () => resolve(retreated));
    });
  }

  activateLastList() {
    return new Promise(resolve => {
      let emptySelection = false;
      this.setState(prevState => {
        const next = prevState.selection.activateLastSelection();
        emptySelection = next.getSelectedItems().size > 0;

        if (prevState.selection === next) {
          return {};
        }

        return {
          selection: next.coalesce()
        };
      }, () => resolve(emptySelection));
    });
  }

  stageAll() {
    if (this.props.unstagedChanges.length === 0) {
      return null;
    }

    return this.props.attemptStageAllOperation('unstaged');
  }

  unstageAll() {
    if (this.props.stagedChanges.length === 0) {
      return null;
    }

    return this.props.attemptStageAllOperation('staged');
  }

  stageAllMergeConflicts() {
    if (this.props.mergeConflicts.length === 0) {
      return null;
    }

    const filePaths = this.props.mergeConflicts.map(conflict => conflict.filePath);
    return this.props.attemptFileStageOperation(filePaths, 'unstaged');
  }

  discardAll({
    eventSource
  } = {}) {
    if (this.props.unstagedChanges.length === 0) {
      return null;
    }

    const filePaths = this.props.unstagedChanges.map(filePatch => filePatch.filePath);
    (0, _reporterProxy.addEvent)('discard-unstaged-changes', {
      package: 'github',
      component: 'StagingView',
      fileCount: filePaths.length,
      type: 'all',
      eventSource
    });
    return this.props.discardWorkDirChangesForPaths(filePaths);
  }

  getNextListUpdatePromise() {
    return this.state.selection.getNextUpdatePromise();
  }

  selectPrevious(preserveTail = false) {
    return new Promise(resolve => {
      this.setState(prevState => ({
        selection: prevState.selection.selectPreviousItem(preserveTail).coalesce()
      }), resolve);
    });
  }

  selectNext(preserveTail = false) {
    return new Promise(resolve => {
      this.setState(prevState => ({
        selection: prevState.selection.selectNextItem(preserveTail).coalesce()
      }), resolve);
    });
  }

  selectAll() {
    return new Promise(resolve => {
      this.setState(prevState => ({
        selection: prevState.selection.selectAllItems().coalesce()
      }), resolve);
    });
  }

  selectFirst(preserveTail = false) {
    return new Promise(resolve => {
      this.setState(prevState => ({
        selection: prevState.selection.selectFirstItem(preserveTail).coalesce()
      }), resolve);
    });
  }

  selectLast(preserveTail = false) {
    return new Promise(resolve => {
      this.setState(prevState => ({
        selection: prevState.selection.selectLastItem(preserveTail).coalesce()
      }), resolve);
    });
  }

  async diveIntoSelection() {
    const selectedItems = this.state.selection.getSelectedItems();

    if (selectedItems.size !== 1) {
      return;
    }

    const selectedItem = selectedItems.values().next().value;
    const stagingStatus = this.state.selection.getActiveListKey();

    if (stagingStatus === 'conflicts') {
      this.showMergeConflictFileForPath(selectedItem.filePath, {
        activate: true
      });
    } else {
      await this.showFilePatchItem(selectedItem.filePath, this.state.selection.getActiveListKey(), {
        activate: true
      });
    }
  }

  async syncWithWorkspace() {
    const item = this.props.workspace.getActivePaneItem();

    if (!item) {
      return;
    }

    const realItemPromise = item.getRealItemPromise && item.getRealItemPromise();
    const realItem = await realItemPromise;

    if (!realItem) {
      return;
    }

    const isFilePatchItem = realItem.isFilePatchItem && realItem.isFilePatchItem();
    const isMatch = realItem.getWorkingDirectory && realItem.getWorkingDirectory() === this.props.workingDirectoryPath;

    if (isFilePatchItem && isMatch) {
      this.quietlySelectItem(realItem.getFilePath(), realItem.getStagingStatus());
    }
  }

  async showDiffView() {
    const selectedItems = this.state.selection.getSelectedItems();

    if (selectedItems.size !== 1) {
      return;
    }

    const selectedItem = selectedItems.values().next().value;
    const stagingStatus = this.state.selection.getActiveListKey();

    if (stagingStatus === 'conflicts') {
      this.showMergeConflictFileForPath(selectedItem.filePath);
    } else {
      await this.showFilePatchItem(selectedItem.filePath, this.state.selection.getActiveListKey());
    }
  }

  showBulkResolveMenu(event) {
    const conflictPaths = this.props.mergeConflicts.map(c => c.filePath);
    event.preventDefault();
    const menu = new Menu();
    menu.append(new MenuItem({
      label: 'Resolve All as Ours',
      click: () => this.props.resolveAsOurs(conflictPaths)
    }));
    menu.append(new MenuItem({
      label: 'Resolve All as Theirs',
      click: () => this.props.resolveAsTheirs(conflictPaths)
    }));
    menu.popup(_electron.remote.getCurrentWindow());
  }

  showActionsMenu(event) {
    event.preventDefault();
    const menu = new Menu();
    const selectedItemCount = this.state.selection.getSelectedItems().size;
    const pluralization = selectedItemCount > 1 ? 's' : '';
    menu.append(new MenuItem({
      label: 'Discard All Changes',
      click: () => this.discardAll({
        eventSource: 'header-menu'
      }),
      enabled: this.props.unstagedChanges.length > 0
    }));
    menu.append(new MenuItem({
      label: 'Discard Changes in Selected File' + pluralization,
      click: () => this.discardChanges({
        eventSource: 'header-menu'
      }),
      enabled: !!(this.props.unstagedChanges.length && selectedItemCount)
    }));
    menu.append(new MenuItem({
      label: 'Undo Last Discard',
      click: () => this.undoLastDiscard({
        eventSource: 'header-menu'
      }),
      enabled: this.props.hasUndoHistory
    }));
    menu.popup(_electron.remote.getCurrentWindow());
  }

  resolveCurrentAsOurs() {
    this.props.resolveAsOurs(this.getSelectedConflictPaths());
  }

  resolveCurrentAsTheirs() {
    this.props.resolveAsTheirs(this.getSelectedConflictPaths());
  } // Directly modify the selection to include only the item identified by the file path and stagingStatus tuple.
  // Re-render the component, but don't notify didSelectSingleItem() or other callback functions. This is useful to
  // avoid circular callback loops for actions originating in FilePatchView or TextEditors with merge conflicts.


  quietlySelectItem(filePath, stagingStatus) {
    return new Promise(resolve => {
      this.setState(prevState => {
        const item = prevState.selection.findItem((each, key) => each.filePath === filePath && key === stagingStatus);

        if (!item) {
          // FIXME: make staging view display no selected item
          // eslint-disable-next-line no-console
          console.log(`Unable to find item at path ${filePath} with staging status ${stagingStatus}`);
          return null;
        }

        return {
          selection: prevState.selection.selectItem(item)
        };
      }, resolve);
    });
  }

  getSelectedItems() {
    const stagingStatus = this.state.selection.getActiveListKey();
    return Array.from(this.state.selection.getSelectedItems(), item => {
      return {
        filePath: item.filePath,
        stagingStatus
      };
    });
  }

  didChangeSelectedItems(openNew) {
    const selectedItems = Array.from(this.state.selection.getSelectedItems());

    if (selectedItems.length === 1) {
      this.didSelectSingleItem(selectedItems[0], openNew);
    }
  }

  async didSelectSingleItem(selectedItem, openNew = false) {
    if (!this.hasFocus()) {
      return;
    }

    if (this.state.selection.getActiveListKey() === 'conflicts') {
      if (openNew) {
        await this.showMergeConflictFileForPath(selectedItem.filePath, {
          activate: true
        });
      }
    } else {
      if (openNew) {
        // User explicitly asked to view diff, such as via click
        await this.showFilePatchItem(selectedItem.filePath, this.state.selection.getActiveListKey(), {
          activate: false
        });
      } else {
        const panesWithStaleItemsToUpdate = this.getPanesWithStalePendingFilePatchItem();

        if (panesWithStaleItemsToUpdate.length > 0) {
          // Update stale items to reflect new selection
          await Promise.all(panesWithStaleItemsToUpdate.map(async pane => {
            await this.showFilePatchItem(selectedItem.filePath, this.state.selection.getActiveListKey(), {
              activate: false,
              pane
            });
          }));
        } else {
          // Selection was changed via keyboard navigation, update pending item in active pane
          const activePane = this.props.workspace.getCenter().getActivePane();
          const activePendingItem = activePane.getPendingItem();

          const activePaneHasPendingFilePatchItem = activePendingItem && activePendingItem.getRealItem && activePendingItem.getRealItem() instanceof _changedFileItem.default;

          if (activePaneHasPendingFilePatchItem) {
            await this.showFilePatchItem(selectedItem.filePath, this.state.selection.getActiveListKey(), {
              activate: false,
              pane: activePane
            });
          }
        }
      }
    }
  }

  getPanesWithStalePendingFilePatchItem() {
    // "stale" meaning there is no longer a changed file associated with item
    // due to changes being fully staged/unstaged/stashed/deleted/etc
    return this.props.workspace.getPanes().filter(pane => {
      const pendingItem = pane.getPendingItem();

      if (!pendingItem || !pendingItem.getRealItem) {
        return false;
      }

      const realItem = pendingItem.getRealItem();

      if (!(realItem instanceof _changedFileItem.default)) {
        return false;
      } // We only want to update pending diff views for currently active repo


      const isInActiveRepo = realItem.getWorkingDirectory() === this.props.workingDirectoryPath;
      const isStale = !this.changedFileExists(realItem.getFilePath(), realItem.getStagingStatus());
      return isInActiveRepo && isStale;
    });
  }

  changedFileExists(filePath, stagingStatus) {
    return this.state.selection.findItem((item, key) => {
      return key === stagingStatus && item.filePath === filePath;
    });
  }

  async showFilePatchItem(filePath, stagingStatus, {
    activate,
    pane
  } = {
    activate: false
  }) {
    const uri = _changedFileItem.default.buildURI(filePath, this.props.workingDirectoryPath, stagingStatus);

    const changedFileItem = await this.props.workspace.open(uri, {
      pending: true,
      activatePane: activate,
      activateItem: activate,
      pane
    });

    if (activate) {
      const itemRoot = changedFileItem.getElement();
      const focusRoot = itemRoot.querySelector('[tabIndex]');

      if (focusRoot) {
        focusRoot.focus();
      }
    } else {
      // simply make item visible
      this.props.workspace.paneForItem(changedFileItem).activateItem(changedFileItem);
    }
  }

  async showMergeConflictFileForPath(relativeFilePath, {
    activate
  } = {
    activate: false
  }) {
    const absolutePath = _path.default.join(this.props.workingDirectoryPath, relativeFilePath);

    if (await this.fileExists(absolutePath)) {
      return this.props.workspace.open(absolutePath, {
        activatePane: activate,
        activateItem: activate,
        pending: true
      });
    } else {
      this.props.notificationManager.addInfo('File has been deleted.');
      return null;
    }
  }

  fileExists(absolutePath) {
    return new _atom.File(absolutePath).exists();
  }

  dblclickOnItem(event, item) {
    return this.props.attemptFileStageOperation([item.filePath], this.state.selection.listKeyForItem(item));
  }

  async contextMenuOnItem(event, item) {
    if (!this.state.selection.getSelectedItems().has(item)) {
      event.stopPropagation();
      event.persist();
      await new Promise(resolve => {
        this.setState(prevState => ({
          selection: prevState.selection.selectItem(item, event.shiftKey)
        }), resolve);
      });
      const newEvent = new MouseEvent(event.type, event);
      requestAnimationFrame(() => {
        if (!event.target.parentNode) {
          return;
        }

        event.target.parentNode.dispatchEvent(newEvent);
      });
    }
  }

  async mousedownOnItem(event, item) {
    const windows = process.platform === 'win32';

    if (event.ctrlKey && !windows) {
      return;
    } // simply open context menu


    if (event.button === 0) {
      this.mouseSelectionInProgress = true;
      event.persist();
      await new Promise(resolve => {
        if (event.metaKey || event.ctrlKey && windows) {
          this.setState(prevState => ({
            selection: prevState.selection.addOrSubtractSelection(item)
          }), resolve);
        } else {
          this.setState(prevState => ({
            selection: prevState.selection.selectItem(item, event.shiftKey)
          }), resolve);
        }
      });
    }
  }

  async mousemoveOnItem(event, item) {
    if (this.mouseSelectionInProgress) {
      await new Promise(resolve => {
        this.setState(prevState => ({
          selection: prevState.selection.selectItem(item, true)
        }), resolve);
      });
    }
  }

  async mouseup() {
    const hadSelectionInProgress = this.mouseSelectionInProgress;
    this.mouseSelectionInProgress = false;
    await new Promise(resolve => {
      this.setState(prevState => ({
        selection: prevState.selection.coalesce()
      }), resolve);
    });

    if (hadSelectionInProgress) {
      this.didChangeSelectedItems(true);
    }
  }

  undoLastDiscard({
    eventSource
  } = {}) {
    if (!this.props.hasUndoHistory) {
      return;
    }

    (0, _reporterProxy.addEvent)('undo-last-discard', {
      package: 'github',
      component: 'StagingView',
      eventSource
    });
    this.props.undoLastDiscard();
  }

  getFocusClass(listKey) {
    return this.state.selection.getActiveListKey() === listKey ? 'is-focused' : '';
  }

  registerItemElement(item, element) {
    this.listElementsByItem.set(item, element);
  }

  getFocus(element) {
    return this.refRoot.map(root => root.contains(element)).getOr(false) ? StagingView.focus.STAGING : null;
  }

  setFocus(focus) {
    if (focus === this.constructor.focus.STAGING) {
      this.refRoot.map(root => root.focus());
      return true;
    }

    return false;
  }

  async advanceFocusFrom(focus) {
    if (focus === this.constructor.focus.STAGING) {
      if (await this.activateNextList()) {
        // There was a next list to activate.
        return this.constructor.focus.STAGING;
      } // We were already on the last list.


      return _commitView.default.firstFocus;
    }

    return null;
  }

  async retreatFocusFrom(focus) {
    if (focus === _commitView.default.firstFocus) {
      await this.activateLastList();
      return this.constructor.focus.STAGING;
    }

    if (focus === this.constructor.focus.STAGING) {
      await this.activatePreviousList();
      return this.constructor.focus.STAGING;
    }

    return false;
  }

  hasFocus() {
    return this.refRoot.map(root => root.contains(document.activeElement)).getOr(false);
  }

  isPopulated(props) {
    return props.workingDirectoryPath != null && (props.unstagedChanges.length > 0 || props.mergeConflicts.length > 0 || props.stagedChanges.length > 0);
  }

}

exports.default = StagingView;

_defineProperty(StagingView, "propTypes", {
  unstagedChanges: _propTypes.default.arrayOf(_propTypes2.FilePatchItemPropType).isRequired,
  stagedChanges: _propTypes.default.arrayOf(_propTypes2.FilePatchItemPropType).isRequired,
  mergeConflicts: _propTypes.default.arrayOf(_propTypes2.MergeConflictItemPropType),
  workingDirectoryPath: _propTypes.default.string,
  resolutionProgress: _propTypes.default.object,
  hasUndoHistory: _propTypes.default.bool.isRequired,
  commands: _propTypes.default.object.isRequired,
  notificationManager: _propTypes.default.object.isRequired,
  workspace: _propTypes.default.object.isRequired,
  openFiles: _propTypes.default.func.isRequired,
  attemptFileStageOperation: _propTypes.default.func.isRequired,
  discardWorkDirChangesForPaths: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  attemptStageAllOperation: _propTypes.default.func.isRequired,
  resolveAsOurs: _propTypes.default.func.isRequired,
  resolveAsTheirs: _propTypes.default.func.isRequired
});

_defineProperty(StagingView, "defaultProps", {
  mergeConflicts: [],
  resolutionProgress: new _resolutionProgress.default()
});

_defineProperty(StagingView, "focus", {
  STAGING: Symbol('staging')
});

_defineProperty(StagingView, "firstFocus", StagingView.focus.STAGING);

_defineProperty(StagingView, "lastFocus", StagingView.focus.STAGING);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9zdGFnaW5nLXZpZXcuanMiXSwibmFtZXMiOlsiTWVudSIsIk1lbnVJdGVtIiwicmVtb3RlIiwiZGVib3VuY2UiLCJmbiIsIndhaXQiLCJ0aW1lb3V0IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImNhbGN1bGF0ZVRydW5jYXRlZExpc3RzIiwibGlzdHMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjIiwia2V5IiwibGlzdCIsInNvdXJjZSIsImxlbmd0aCIsIk1BWElNVU1fTElTVEVEX0VOVFJJRVMiLCJzbGljZSIsIm5vb3AiLCJTdGFnaW5nVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInVuZG9MYXN0RGlzY2FyZCIsImV2ZW50U291cmNlIiwiY29tbWFuZCIsImRpc2NhcmRDaGFuZ2VzIiwiZGlzY2FyZEFsbCIsIml0ZW1QYXRocyIsImdldFNlbGVjdGVkSXRlbUZpbGVQYXRocyIsImF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24iLCJzdGF0ZSIsInNlbGVjdGlvbiIsImdldEFjdGl2ZUxpc3RLZXkiLCJzZXRTdGF0ZSIsInByZXZTdGF0ZSIsImNvYWxlc2NlIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhdG9tIiwiY29uZmlnIiwib2JzZXJ2ZSIsInZhbHVlIiwiZGVib3VuY2VkRGlkQ2hhbmdlU2VsZWN0ZWRJdGVtIiwiZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyIsInVuc3RhZ2VkQ2hhbmdlcyIsInN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsIkNvbXBvc2l0ZUxpc3RTZWxlY3Rpb24iLCJsaXN0c0J5S2V5IiwiaWRGb3JJdGVtIiwiaXRlbSIsImZpbGVQYXRoIiwibW91c2VTZWxlY3Rpb25JblByb2dyZXNzIiwibGlzdEVsZW1lbnRzQnlJdGVtIiwiV2Vha01hcCIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJuZXh0UHJvcHMiLCJuZXh0U3RhdGUiLCJzb21lIiwibmV4dExpc3RzIiwidXBkYXRlTGlzdHMiLCJjb21wb25lbnREaWRNb3VudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJtb3VzZXVwIiwiYWRkIiwiRGlzcG9zYWJsZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3b3Jrc3BhY2UiLCJvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIiwic3luY1dpdGhXb3Jrc3BhY2UiLCJpc1BvcHVsYXRlZCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImlzUmVwb1NhbWUiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImhhc1NlbGVjdGlvbnNQcmVzZW50IiwiZ2V0U2VsZWN0ZWRJdGVtcyIsInNpemUiLCJzZWxlY3Rpb25DaGFuZ2VkIiwiaGVhZEl0ZW0iLCJnZXRIZWFkSXRlbSIsImVsZW1lbnQiLCJnZXQiLCJzY3JvbGxJbnRvVmlld0lmTmVlZGVkIiwicmVuZGVyIiwicmVzb2x1dGlvblByb2dyZXNzIiwicmVuZGVyQm9keSIsInNlbGVjdGVkSXRlbXMiLCJzZXR0ZXIiLCJyZW5kZXJDb21tYW5kcyIsImdldEZvY3VzQ2xhc3MiLCJyZW5kZXJBY3Rpb25zTWVudSIsInN0YWdlQWxsIiwibWFwIiwiZmlsZVBhdGNoIiwicmVnaXN0ZXJJdGVtRWxlbWVudCIsImV2ZW50IiwiZGJsY2xpY2tPbkl0ZW0iLCJjb250ZXh0TWVudU9uSXRlbSIsIm1vdXNlZG93bk9uSXRlbSIsIm1vdXNlbW92ZU9uSXRlbSIsImhhcyIsInJlbmRlclRydW5jYXRlZE1lc3NhZ2UiLCJyZW5kZXJNZXJnZUNvbmZsaWN0cyIsInVuc3RhZ2VBbGwiLCJjb21tYW5kcyIsInNlbGVjdFByZXZpb3VzIiwic2VsZWN0TmV4dCIsImRpdmVJbnRvU2VsZWN0aW9uIiwic2hvd0RpZmZWaWV3Iiwic2VsZWN0QWxsIiwic2VsZWN0Rmlyc3QiLCJzZWxlY3RMYXN0IiwiY29uZmlybVNlbGVjdGVkSXRlbXMiLCJhY3RpdmF0ZU5leHRMaXN0IiwiYWN0aXZhdGVQcmV2aW91c0xpc3QiLCJvcGVuRmlsZSIsInJlc29sdmVDdXJyZW50QXNPdXJzIiwicmVzb2x2ZUN1cnJlbnRBc1RoZWlycyIsImRpc2NhcmRDaGFuZ2VzRnJvbUNvbW1hbmQiLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8iLCJkaXNjYXJkQWxsRnJvbUNvbW1hbmQiLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29tbWFuZCIsImhhc1VuZG9IaXN0b3J5Iiwic2hvd0FjdGlvbnNNZW51IiwicmVuZGVyVW5kb0J1dHRvbiIsInVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24iLCJhbnlVbnJlc29sdmVkIiwiY29uZmxpY3QiLCJwYXRoIiwiam9pbiIsImNvbmZsaWN0UGF0aCIsImdldFJlbWFpbmluZyIsImJ1bGtSZXNvbHZlRHJvcGRvd24iLCJzaG93QnVsa1Jlc29sdmVNZW51Iiwic3RhZ2VBbGxNZXJnZUNvbmZsaWN0cyIsIm1lcmdlQ29uZmxpY3QiLCJmdWxsUGF0aCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsIkFycmF5IiwiZnJvbSIsImdldFNlbGVjdGVkQ29uZmxpY3RQYXRocyIsImZpbGVQYXRocyIsIm9wZW5GaWxlcyIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJmaWxlQ291bnQiLCJ0eXBlIiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJhZHZhbmNlZCIsIm5leHQiLCJhY3RpdmF0ZU5leHRTZWxlY3Rpb24iLCJyZXRyZWF0ZWQiLCJhY3RpdmF0ZVByZXZpb3VzU2VsZWN0aW9uIiwiYWN0aXZhdGVMYXN0TGlzdCIsImVtcHR5U2VsZWN0aW9uIiwiYWN0aXZhdGVMYXN0U2VsZWN0aW9uIiwiYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uIiwiZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlIiwiZ2V0TmV4dFVwZGF0ZVByb21pc2UiLCJwcmVzZXJ2ZVRhaWwiLCJzZWxlY3RQcmV2aW91c0l0ZW0iLCJzZWxlY3ROZXh0SXRlbSIsInNlbGVjdEFsbEl0ZW1zIiwic2VsZWN0Rmlyc3RJdGVtIiwic2VsZWN0TGFzdEl0ZW0iLCJzZWxlY3RlZEl0ZW0iLCJ2YWx1ZXMiLCJzdGFnaW5nU3RhdHVzIiwic2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aCIsImFjdGl2YXRlIiwic2hvd0ZpbGVQYXRjaEl0ZW0iLCJnZXRBY3RpdmVQYW5lSXRlbSIsInJlYWxJdGVtUHJvbWlzZSIsImdldFJlYWxJdGVtUHJvbWlzZSIsInJlYWxJdGVtIiwiaXNGaWxlUGF0Y2hJdGVtIiwiaXNNYXRjaCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJxdWlldGx5U2VsZWN0SXRlbSIsImdldEZpbGVQYXRoIiwiZ2V0U3RhZ2luZ1N0YXR1cyIsImNvbmZsaWN0UGF0aHMiLCJjIiwicHJldmVudERlZmF1bHQiLCJtZW51IiwiYXBwZW5kIiwibGFiZWwiLCJjbGljayIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJwb3B1cCIsImdldEN1cnJlbnRXaW5kb3ciLCJzZWxlY3RlZEl0ZW1Db3VudCIsInBsdXJhbGl6YXRpb24iLCJlbmFibGVkIiwiZmluZEl0ZW0iLCJlYWNoIiwiY29uc29sZSIsImxvZyIsInNlbGVjdEl0ZW0iLCJvcGVuTmV3IiwiZGlkU2VsZWN0U2luZ2xlSXRlbSIsImhhc0ZvY3VzIiwicGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlIiwiZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSIsImFsbCIsInBhbmUiLCJhY3RpdmVQYW5lIiwiZ2V0Q2VudGVyIiwiZ2V0QWN0aXZlUGFuZSIsImFjdGl2ZVBlbmRpbmdJdGVtIiwiZ2V0UGVuZGluZ0l0ZW0iLCJhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsIkNoYW5nZWRGaWxlSXRlbSIsImdldFBhbmVzIiwiZmlsdGVyIiwicGVuZGluZ0l0ZW0iLCJpc0luQWN0aXZlUmVwbyIsImlzU3RhbGUiLCJjaGFuZ2VkRmlsZUV4aXN0cyIsInVyaSIsImJ1aWxkVVJJIiwiY2hhbmdlZEZpbGVJdGVtIiwib3BlbiIsInBlbmRpbmciLCJhY3RpdmF0ZVBhbmUiLCJhY3RpdmF0ZUl0ZW0iLCJpdGVtUm9vdCIsImdldEVsZW1lbnQiLCJmb2N1c1Jvb3QiLCJxdWVyeVNlbGVjdG9yIiwiZm9jdXMiLCJwYW5lRm9ySXRlbSIsInJlbGF0aXZlRmlsZVBhdGgiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlRXhpc3RzIiwibm90aWZpY2F0aW9uTWFuYWdlciIsImFkZEluZm8iLCJGaWxlIiwiZXhpc3RzIiwibGlzdEtleUZvckl0ZW0iLCJzdG9wUHJvcGFnYXRpb24iLCJwZXJzaXN0Iiwic2hpZnRLZXkiLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwiZGlzcGF0Y2hFdmVudCIsIndpbmRvd3MiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJjdHJsS2V5IiwiYnV0dG9uIiwibWV0YUtleSIsImFkZE9yU3VidHJhY3RTZWxlY3Rpb24iLCJoYWRTZWxlY3Rpb25JblByb2dyZXNzIiwibGlzdEtleSIsInNldCIsImdldEZvY3VzIiwicm9vdCIsImNvbnRhaW5zIiwiZ2V0T3IiLCJTVEFHSU5HIiwic2V0Rm9jdXMiLCJhZHZhbmNlRm9jdXNGcm9tIiwiQ29tbWl0VmlldyIsImZpcnN0Rm9jdXMiLCJyZXRyZWF0Rm9jdXNGcm9tIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIkZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlIiwic3RyaW5nIiwib2JqZWN0IiwiYm9vbCIsImZ1bmMiLCJSZXNvbHV0aW9uUHJvZ3Jlc3MiLCJTeW1ib2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFqQkEsTUFBTTtBQUFDQSxFQUFBQSxJQUFEO0FBQU9DLEVBQUFBO0FBQVAsSUFBbUJDLGdCQUF6Qjs7QUFtQkEsTUFBTUMsUUFBUSxHQUFHLENBQUNDLEVBQUQsRUFBS0MsSUFBTCxLQUFjO0FBQzdCLE1BQUlDLE9BQUo7QUFDQSxTQUFPLENBQUMsR0FBR0MsSUFBSixLQUFhO0FBQ2xCLFdBQU8sSUFBSUMsT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDNUJDLE1BQUFBLFlBQVksQ0FBQ0osT0FBRCxDQUFaO0FBQ0FBLE1BQUFBLE9BQU8sR0FBR0ssVUFBVSxDQUFDLE1BQU07QUFDekJGLFFBQUFBLE9BQU8sQ0FBQ0wsRUFBRSxDQUFDLEdBQUdHLElBQUosQ0FBSCxDQUFQO0FBQ0QsT0FGbUIsRUFFakJGLElBRmlCLENBQXBCO0FBR0QsS0FMTSxDQUFQO0FBTUQsR0FQRDtBQVFELENBVkQ7O0FBWUEsU0FBU08sdUJBQVQsQ0FBaUNDLEtBQWpDLEVBQXdDO0FBQ3RDLFNBQU9DLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZRixLQUFaLEVBQW1CRyxNQUFuQixDQUEwQixDQUFDQyxHQUFELEVBQU1DLEdBQU4sS0FBYztBQUM3QyxVQUFNQyxJQUFJLEdBQUdOLEtBQUssQ0FBQ0ssR0FBRCxDQUFsQjtBQUNBRCxJQUFBQSxHQUFHLENBQUNHLE1BQUosQ0FBV0YsR0FBWCxJQUFrQkMsSUFBbEI7O0FBQ0EsUUFBSUEsSUFBSSxDQUFDRSxNQUFMLElBQWVDLHNCQUFuQixFQUEyQztBQUN6Q0wsTUFBQUEsR0FBRyxDQUFDQyxHQUFELENBQUgsR0FBV0MsSUFBWDtBQUNELEtBRkQsTUFFTztBQUNMRixNQUFBQSxHQUFHLENBQUNDLEdBQUQsQ0FBSCxHQUFXQyxJQUFJLENBQUNJLEtBQUwsQ0FBVyxDQUFYLEVBQWNELHNCQUFkLENBQVg7QUFDRDs7QUFDRCxXQUFPTCxHQUFQO0FBQ0QsR0FUTSxFQVNKO0FBQUNHLElBQUFBLE1BQU0sRUFBRTtBQUFULEdBVEksQ0FBUDtBQVVEOztBQUVELE1BQU1JLElBQUksR0FBRyxNQUFNLENBQUcsQ0FBdEI7O0FBRUEsTUFBTUYsc0JBQXNCLEdBQUcsSUFBL0I7O0FBRWUsTUFBTUcsV0FBTixTQUEwQkMsZUFBTUMsU0FBaEMsQ0FBMEM7QUFpQ3ZEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQix5REEyTlcsTUFBTTtBQUNsQyxXQUFLQyxlQUFMLENBQXFCO0FBQUNDLFFBQUFBLFdBQVcsRUFBRTtBQUFDQyxVQUFBQSxPQUFPLEVBQUU7QUFBVjtBQUFkLE9BQXJCO0FBQ0QsS0E3TmtCOztBQUFBLHdEQStOVSxNQUFNO0FBQ2pDLFdBQUtGLGVBQUwsQ0FBcUI7QUFBQ0MsUUFBQUEsV0FBVyxFQUFFO0FBQUNDLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBQWQsT0FBckI7QUFDRCxLQWpPa0I7O0FBQUEsdURBbU9TLE1BQU07QUFDaEMsV0FBS0YsZUFBTCxDQUFxQjtBQUFDQyxRQUFBQSxXQUFXLEVBQUU7QUFBZCxPQUFyQjtBQUNELEtBck9rQjs7QUFBQSwyREF1T2EsTUFBTTtBQUNwQyxXQUFLRCxlQUFMLENBQXFCO0FBQUNDLFFBQUFBLFdBQVcsRUFBRTtBQUFkLE9BQXJCO0FBQ0QsS0F6T2tCOztBQUFBLHVEQTJPUyxNQUFNO0FBQ2hDLFdBQUtFLGNBQUwsQ0FBb0I7QUFBQ0YsUUFBQUEsV0FBVyxFQUFFO0FBQUNDLFVBQUFBLE9BQU8sRUFBRTtBQUFWO0FBQWQsT0FBcEI7QUFDRCxLQTdPa0I7O0FBQUEsbURBK09LLE1BQU07QUFDNUIsV0FBS0UsVUFBTCxDQUFnQjtBQUFDSCxRQUFBQSxXQUFXLEVBQUU7QUFBQ0MsVUFBQUEsT0FBTyxFQUFFO0FBQVY7QUFBZCxPQUFoQjtBQUNELEtBalBrQjs7QUFBQSxrREEwYkksWUFBWTtBQUNqQyxZQUFNRyxTQUFTLEdBQUcsS0FBS0Msd0JBQUwsRUFBbEI7QUFDQSxZQUFNLEtBQUtQLEtBQUwsQ0FBV1EseUJBQVgsQ0FBcUNGLFNBQXJDLEVBQWdELEtBQUtHLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkMsZ0JBQXJCLEVBQWhELENBQU47QUFDQSxZQUFNLElBQUloQyxPQUFKLENBQVlDLE9BQU8sSUFBSTtBQUMzQixhQUFLZ0MsUUFBTCxDQUFjQyxTQUFTLEtBQUs7QUFBQ0gsVUFBQUEsU0FBUyxFQUFFRyxTQUFTLENBQUNILFNBQVYsQ0FBb0JJLFFBQXBCO0FBQVosU0FBTCxDQUF2QixFQUEwRWxDLE9BQTFFO0FBQ0QsT0FGSyxDQUFOO0FBR0QsS0FoY2tCOztBQUVqQiwyQkFDRSxJQURGLEVBRUUsZ0JBRkYsRUFFb0IsbUJBRnBCLEVBRXlDLGlCQUZ6QyxFQUU0RCxpQkFGNUQsRUFFK0UsU0FGL0UsRUFFMEYscUJBRjFGLEVBR0UsWUFIRixFQUdnQixVQUhoQixFQUc0QixnQkFINUIsRUFHOEMsa0JBSDlDLEVBR2tFLHNCQUhsRSxFQUcwRixrQkFIMUYsRUFJRSxVQUpGLEVBSWMsWUFKZCxFQUk0Qix3QkFKNUIsRUFJc0QsWUFKdEQsRUFJb0Usc0JBSnBFLEVBSTRGLFdBSjVGLEVBS0UsYUFMRixFQUtpQixZQUxqQixFQUsrQixtQkFML0IsRUFLb0QsY0FMcEQsRUFLb0UscUJBTHBFLEVBSzJGLGlCQUwzRixFQU1FLHNCQU5GLEVBTTBCLHdCQU4xQixFQU1vRCxtQkFOcEQsRUFNeUUsd0JBTnpFO0FBU0EsU0FBS21DLElBQUwsR0FBWSxJQUFJQyw2QkFBSixDQUNWQyxJQUFJLENBQUNDLE1BQUwsQ0FBWUMsT0FBWixDQUFvQixnQ0FBcEIsRUFBc0RDLEtBQUssSUFBSTtBQUM3RCxVQUFJQSxLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUNmLGFBQUtDLDhCQUFMLEdBQXNDLEtBQUtDLHNCQUEzQztBQUNELE9BRkQsTUFFTztBQUNMLGFBQUtELDhCQUFMLEdBQXNDL0MsUUFBUSxDQUFDLEtBQUtnRCxzQkFBTixFQUE4QkYsS0FBOUIsQ0FBOUM7QUFDRDtBQUNGLEtBTkQsQ0FEVSxDQUFaO0FBVUEsU0FBS1gsS0FBTCxxQkFDSzFCLHVCQUF1QixDQUFDO0FBQ3pCd0MsTUFBQUEsZUFBZSxFQUFFLEtBQUt2QixLQUFMLENBQVd1QixlQURIO0FBRXpCQyxNQUFBQSxhQUFhLEVBQUUsS0FBS3hCLEtBQUwsQ0FBV3dCLGFBRkQ7QUFHekJDLE1BQUFBLGNBQWMsRUFBRSxLQUFLekIsS0FBTCxDQUFXeUI7QUFIRixLQUFELENBRDVCO0FBTUVmLE1BQUFBLFNBQVMsRUFBRSxJQUFJZ0IsK0JBQUosQ0FBMkI7QUFDcENDLFFBQUFBLFVBQVUsRUFBRSxDQUNWLENBQUMsVUFBRCxFQUFhLEtBQUszQixLQUFMLENBQVd1QixlQUF4QixDQURVLEVBRVYsQ0FBQyxXQUFELEVBQWMsS0FBS3ZCLEtBQUwsQ0FBV3lCLGNBQXpCLENBRlUsRUFHVixDQUFDLFFBQUQsRUFBVyxLQUFLekIsS0FBTCxDQUFXd0IsYUFBdEIsQ0FIVSxDQUR3QjtBQU1wQ0ksUUFBQUEsU0FBUyxFQUFFQyxJQUFJLElBQUlBLElBQUksQ0FBQ0M7QUFOWSxPQUEzQjtBQU5iO0FBZ0JBLFNBQUtDLHdCQUFMLEdBQWdDLEtBQWhDO0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsSUFBSUMsT0FBSixFQUExQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJQyxrQkFBSixFQUFmO0FBQ0Q7O0FBRThCLFNBQXhCQyx3QkFBd0IsQ0FBQ0MsU0FBRCxFQUFZeEIsU0FBWixFQUF1QjtBQUNwRCxRQUFJeUIsU0FBUyxHQUFHLEVBQWhCOztBQUVBLFFBQ0UsQ0FBQyxpQkFBRCxFQUFvQixlQUFwQixFQUFxQyxnQkFBckMsRUFBdURDLElBQXZELENBQTREbEQsR0FBRyxJQUFJd0IsU0FBUyxDQUFDdEIsTUFBVixDQUFpQkYsR0FBakIsTUFBMEJnRCxTQUFTLENBQUNoRCxHQUFELENBQXRHLENBREYsRUFFRTtBQUNBLFlBQU1tRCxTQUFTLEdBQUd6RCx1QkFBdUIsQ0FBQztBQUN4Q3dDLFFBQUFBLGVBQWUsRUFBRWMsU0FBUyxDQUFDZCxlQURhO0FBRXhDQyxRQUFBQSxhQUFhLEVBQUVhLFNBQVMsQ0FBQ2IsYUFGZTtBQUd4Q0MsUUFBQUEsY0FBYyxFQUFFWSxTQUFTLENBQUNaO0FBSGMsT0FBRCxDQUF6QztBQU1BYSxNQUFBQSxTQUFTLHFCQUNKRSxTQURJO0FBRVA5QixRQUFBQSxTQUFTLEVBQUVHLFNBQVMsQ0FBQ0gsU0FBVixDQUFvQitCLFdBQXBCLENBQWdDLENBQ3pDLENBQUMsVUFBRCxFQUFhRCxTQUFTLENBQUNqQixlQUF2QixDQUR5QyxFQUV6QyxDQUFDLFdBQUQsRUFBY2lCLFNBQVMsQ0FBQ2YsY0FBeEIsQ0FGeUMsRUFHekMsQ0FBQyxRQUFELEVBQVdlLFNBQVMsQ0FBQ2hCLGFBQXJCLENBSHlDLENBQWhDO0FBRkosUUFBVDtBQVFEOztBQUVELFdBQU9jLFNBQVA7QUFDRDs7QUFFREksRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEJDLElBQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsS0FBS0MsT0FBeEM7QUFDQSxTQUFLOUIsSUFBTCxDQUFVK0IsR0FBVixDQUNFLElBQUlDLG9CQUFKLENBQWUsTUFBTUosTUFBTSxDQUFDSyxtQkFBUCxDQUEyQixTQUEzQixFQUFzQyxLQUFLSCxPQUEzQyxDQUFyQixDQURGLEVBRUUsS0FBSzdDLEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUJDLHlCQUFyQixDQUErQyxNQUFNO0FBQ25ELFdBQUtDLGlCQUFMO0FBQ0QsS0FGRCxDQUZGOztBQU9BLFFBQUksS0FBS0MsV0FBTCxDQUFpQixLQUFLcEQsS0FBdEIsQ0FBSixFQUFrQztBQUNoQyxXQUFLbUQsaUJBQUw7QUFDRDtBQUNGOztBQUVERSxFQUFBQSxrQkFBa0IsQ0FBQ0MsU0FBRCxFQUFZekMsU0FBWixFQUF1QjtBQUN2QyxVQUFNMEMsVUFBVSxHQUFHRCxTQUFTLENBQUNFLG9CQUFWLEtBQW1DLEtBQUt4RCxLQUFMLENBQVd3RCxvQkFBakU7QUFDQSxVQUFNQyxvQkFBb0IsR0FDeEI1QyxTQUFTLENBQUNILFNBQVYsQ0FBb0JnRCxnQkFBcEIsR0FBdUNDLElBQXZDLEdBQThDLENBQTlDLElBQ0EsS0FBS2xELEtBQUwsQ0FBV0MsU0FBWCxDQUFxQmdELGdCQUFyQixHQUF3Q0MsSUFBeEMsR0FBK0MsQ0FGakQ7QUFHQSxVQUFNQyxnQkFBZ0IsR0FBRyxLQUFLbkQsS0FBTCxDQUFXQyxTQUFYLEtBQXlCRyxTQUFTLENBQUNILFNBQTVEOztBQUVBLFFBQUk2QyxVQUFVLElBQUlFLG9CQUFkLElBQXNDRyxnQkFBMUMsRUFBNEQ7QUFDMUQsV0FBS3ZDLDhCQUFMO0FBQ0Q7O0FBRUQsVUFBTXdDLFFBQVEsR0FBRyxLQUFLcEQsS0FBTCxDQUFXQyxTQUFYLENBQXFCb0QsV0FBckIsRUFBakI7O0FBQ0EsUUFBSUQsUUFBSixFQUFjO0FBQ1osWUFBTUUsT0FBTyxHQUFHLEtBQUsvQixrQkFBTCxDQUF3QmdDLEdBQXhCLENBQTRCSCxRQUE1QixDQUFoQjs7QUFDQSxVQUFJRSxPQUFKLEVBQWE7QUFDWEEsUUFBQUEsT0FBTyxDQUFDRSxzQkFBUjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxDQUFDLEtBQUtiLFdBQUwsQ0FBaUJFLFNBQWpCLENBQUQsSUFBZ0MsS0FBS0YsV0FBTCxDQUFpQixLQUFLcEQsS0FBdEIsQ0FBcEMsRUFBa0U7QUFDaEUsV0FBS21ELGlCQUFMO0FBQ0Q7QUFDRjs7QUFFRGUsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FDRSw2QkFBQyxxQkFBRDtBQUFjLE1BQUEsS0FBSyxFQUFFLEtBQUtsRSxLQUFMLENBQVdtRSxrQkFBaEM7QUFBb0QsTUFBQSxTQUFTLEVBQUV4RTtBQUEvRCxPQUNHLEtBQUt5RSxVQURSLENBREY7QUFLRDs7QUFFREEsRUFBQUEsVUFBVSxHQUFHO0FBQ1gsVUFBTUMsYUFBYSxHQUFHLEtBQUs1RCxLQUFMLENBQVdDLFNBQVgsQ0FBcUJnRCxnQkFBckIsRUFBdEI7QUFFQSxXQUNFO0FBQ0UsTUFBQSxHQUFHLEVBQUUsS0FBS3hCLE9BQUwsQ0FBYW9DLE1BRHBCO0FBRUUsTUFBQSxTQUFTLEVBQUcsc0JBQXFCLEtBQUs3RCxLQUFMLENBQVdDLFNBQVgsQ0FBcUJDLGdCQUFyQixFQUF3QyxrQkFGM0U7QUFHRSxNQUFBLFFBQVEsRUFBQztBQUhYLE9BSUcsS0FBSzRELGNBQUwsRUFKSCxFQUtFO0FBQUssTUFBQSxTQUFTLEVBQUcsbURBQWtELEtBQUtDLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBK0I7QUFBbEcsT0FDRTtBQUFRLE1BQUEsU0FBUyxFQUFDO0FBQWxCLE9BQ0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixNQURGLEVBRUU7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQiwwQkFGRixFQUdHLEtBQUtDLGlCQUFMLEVBSEgsRUFJRTtBQUNFLE1BQUEsU0FBUyxFQUFDLHFEQURaO0FBRUUsTUFBQSxRQUFRLEVBQUUsS0FBS3pFLEtBQUwsQ0FBV3VCLGVBQVgsQ0FBMkIvQixNQUEzQixLQUFzQyxDQUZsRDtBQUdFLE1BQUEsT0FBTyxFQUFFLEtBQUtrRjtBQUhoQixtQkFKRixDQURGLEVBVUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BRUksS0FBS2pFLEtBQUwsQ0FBV2MsZUFBWCxDQUEyQm9ELEdBQTNCLENBQStCQyxTQUFTLElBQ3RDLDZCQUFDLDhCQUFEO0FBQ0UsTUFBQSxHQUFHLEVBQUVBLFNBQVMsQ0FBQzlDLFFBRGpCO0FBRUUsTUFBQSxtQkFBbUIsRUFBRSxLQUFLK0MsbUJBRjVCO0FBR0UsTUFBQSxTQUFTLEVBQUVELFNBSGI7QUFJRSxNQUFBLGFBQWEsRUFBRUUsS0FBSyxJQUFJLEtBQUtDLGNBQUwsQ0FBb0JELEtBQXBCLEVBQTJCRixTQUEzQixDQUoxQjtBQUtFLE1BQUEsYUFBYSxFQUFFRSxLQUFLLElBQUksS0FBS0UsaUJBQUwsQ0FBdUJGLEtBQXZCLEVBQThCRixTQUE5QixDQUwxQjtBQU1FLE1BQUEsV0FBVyxFQUFFRSxLQUFLLElBQUksS0FBS0csZUFBTCxDQUFxQkgsS0FBckIsRUFBNEJGLFNBQTVCLENBTnhCO0FBT0UsTUFBQSxXQUFXLEVBQUVFLEtBQUssSUFBSSxLQUFLSSxlQUFMLENBQXFCSixLQUFyQixFQUE0QkYsU0FBNUIsQ0FQeEI7QUFRRSxNQUFBLFFBQVEsRUFBRVAsYUFBYSxDQUFDYyxHQUFkLENBQWtCUCxTQUFsQjtBQVJaLE1BREYsQ0FGSixDQVZGLEVBMEJHLEtBQUtRLHNCQUFMLENBQTRCLEtBQUtwRixLQUFMLENBQVd1QixlQUF2QyxDQTFCSCxDQUxGLEVBaUNHLEtBQUs4RCxvQkFBTCxFQWpDSCxFQWtDRTtBQUFLLE1BQUEsU0FBUyxFQUFHLGlEQUFnRCxLQUFLYixhQUFMLENBQW1CLFFBQW5CLENBQTZCO0FBQTlGLE9BQ0U7QUFBUSxNQUFBLFNBQVMsRUFBQztBQUFsQixPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsTUFERixFQUVFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsd0JBRkYsRUFLRTtBQUFRLE1BQUEsU0FBUyxFQUFDLG1EQUFsQjtBQUNFLE1BQUEsUUFBUSxFQUFFLEtBQUt4RSxLQUFMLENBQVd3QixhQUFYLENBQXlCaEMsTUFBekIsS0FBb0MsQ0FEaEQ7QUFFRSxNQUFBLE9BQU8sRUFBRSxLQUFLOEY7QUFGaEIscUJBTEYsQ0FERixFQVVFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUVJLEtBQUs3RSxLQUFMLENBQVdlLGFBQVgsQ0FBeUJtRCxHQUF6QixDQUE2QkMsU0FBUyxJQUNwQyw2QkFBQyw4QkFBRDtBQUNFLE1BQUEsR0FBRyxFQUFFQSxTQUFTLENBQUM5QyxRQURqQjtBQUVFLE1BQUEsU0FBUyxFQUFFOEMsU0FGYjtBQUdFLE1BQUEsbUJBQW1CLEVBQUUsS0FBS0MsbUJBSDVCO0FBSUUsTUFBQSxhQUFhLEVBQUVDLEtBQUssSUFBSSxLQUFLQyxjQUFMLENBQW9CRCxLQUFwQixFQUEyQkYsU0FBM0IsQ0FKMUI7QUFLRSxNQUFBLGFBQWEsRUFBRUUsS0FBSyxJQUFJLEtBQUtFLGlCQUFMLENBQXVCRixLQUF2QixFQUE4QkYsU0FBOUIsQ0FMMUI7QUFNRSxNQUFBLFdBQVcsRUFBRUUsS0FBSyxJQUFJLEtBQUtHLGVBQUwsQ0FBcUJILEtBQXJCLEVBQTRCRixTQUE1QixDQU54QjtBQU9FLE1BQUEsV0FBVyxFQUFFRSxLQUFLLElBQUksS0FBS0ksZUFBTCxDQUFxQkosS0FBckIsRUFBNEJGLFNBQTVCLENBUHhCO0FBUUUsTUFBQSxRQUFRLEVBQUVQLGFBQWEsQ0FBQ2MsR0FBZCxDQUFrQlAsU0FBbEI7QUFSWixNQURGLENBRkosQ0FWRixFQTBCRyxLQUFLUSxzQkFBTCxDQUE0QixLQUFLcEYsS0FBTCxDQUFXd0IsYUFBdkMsQ0ExQkgsQ0FsQ0YsQ0FERjtBQWlFRDs7QUFFRCtDLEVBQUFBLGNBQWMsR0FBRztBQUNmLFdBQ0UsNkJBQUMsZUFBRCxRQUNFLDZCQUFDLGlCQUFEO0FBQVUsTUFBQSxRQUFRLEVBQUUsS0FBS3ZFLEtBQUwsQ0FBV3VGLFFBQS9CO0FBQXlDLE1BQUEsTUFBTSxFQUFDO0FBQWhELE9BQ0UsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxjQUFqQjtBQUFnQyxNQUFBLFFBQVEsRUFBRSxNQUFNLEtBQUtDLGNBQUw7QUFBaEQsTUFERixFQUVFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsZ0JBQWpCO0FBQWtDLE1BQUEsUUFBUSxFQUFFLE1BQU0sS0FBS0MsVUFBTDtBQUFsRCxNQUZGLEVBR0UsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxnQkFBakI7QUFBa0MsTUFBQSxRQUFRLEVBQUUsS0FBS0M7QUFBakQsTUFIRixFQUlFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsdUJBQWpCO0FBQXlDLE1BQUEsUUFBUSxFQUFFLEtBQUtDO0FBQXhELE1BSkYsRUFLRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLGdCQUFqQjtBQUFrQyxNQUFBLFFBQVEsRUFBRSxNQUFNLEtBQUtILGNBQUwsQ0FBb0IsSUFBcEI7QUFBbEQsTUFMRixFQU1FLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsa0JBQWpCO0FBQW9DLE1BQUEsUUFBUSxFQUFFLE1BQU0sS0FBS0MsVUFBTCxDQUFnQixJQUFoQjtBQUFwRCxNQU5GLEVBT0UsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxpQkFBakI7QUFBbUMsTUFBQSxRQUFRLEVBQUUsS0FBS0c7QUFBbEQsTUFQRixFQVFFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsa0JBQWpCO0FBQW9DLE1BQUEsUUFBUSxFQUFFLEtBQUtDO0FBQW5ELE1BUkYsRUFTRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHFCQUFqQjtBQUF1QyxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQUF0RCxNQVRGLEVBVUUsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxvQkFBakI7QUFBc0MsTUFBQSxRQUFRLEVBQUUsTUFBTSxLQUFLRCxXQUFMLENBQWlCLElBQWpCO0FBQXRELE1BVkYsRUFXRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHVCQUFqQjtBQUF5QyxNQUFBLFFBQVEsRUFBRSxNQUFNLEtBQUtDLFVBQUwsQ0FBZ0IsSUFBaEI7QUFBekQsTUFYRixFQVlFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsY0FBakI7QUFBZ0MsTUFBQSxRQUFRLEVBQUUsS0FBS0M7QUFBL0MsTUFaRixFQWFFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsMkJBQWpCO0FBQTZDLE1BQUEsUUFBUSxFQUFFLEtBQUtDO0FBQTVELE1BYkYsRUFjRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLCtCQUFqQjtBQUFpRCxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQUFoRSxNQWRGLEVBZUUsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxxQkFBakI7QUFBdUMsTUFBQSxRQUFRLEVBQUUsS0FBS0M7QUFBdEQsTUFmRixFQWdCRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLDZCQUFqQjtBQUErQyxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQUE5RCxNQWhCRixFQWlCRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLCtCQUFqQjtBQUFpRCxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQUFoRSxNQWpCRixFQWtCRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLDBDQUFqQjtBQUE0RCxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQUEzRSxNQWxCRixFQW1CRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLFdBQWpCO0FBQTZCLE1BQUEsUUFBUSxFQUFFLEtBQUtDO0FBQTVDLE1BbkJGLENBREYsRUFzQkUsNkJBQUMsaUJBQUQ7QUFBVSxNQUFBLFFBQVEsRUFBRSxLQUFLdEcsS0FBTCxDQUFXdUYsUUFBL0I7QUFBeUMsTUFBQSxNQUFNLEVBQUM7QUFBaEQsT0FDRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLDBCQUFqQjtBQUE0QyxNQUFBLFFBQVEsRUFBRSxLQUFLYjtBQUEzRCxNQURGLEVBRUUsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyw0QkFBakI7QUFBOEMsTUFBQSxRQUFRLEVBQUUsS0FBS1k7QUFBN0QsTUFGRixFQUdFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsNEJBQWpCO0FBQThDLE1BQUEsUUFBUSxFQUFFLEtBQUtpQjtBQUE3RCxNQUhGLEVBSUUsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQyxxQ0FBakI7QUFDRSxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQURqQixNQUpGLENBdEJGLENBREY7QUFpQ0Q7O0FBMEJEL0IsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsUUFBSSxLQUFLekUsS0FBTCxDQUFXdUIsZUFBWCxDQUEyQi9CLE1BQTNCLElBQXFDLEtBQUtRLEtBQUwsQ0FBV3lHLGNBQXBELEVBQW9FO0FBQ2xFLGFBQ0U7QUFDRSxRQUFBLFNBQVMsRUFBQyw4RkFEWjtBQUVFLFFBQUEsT0FBTyxFQUFFLEtBQUtDO0FBRmhCLFFBREY7QUFNRCxLQVBELE1BT087QUFDTCxhQUFPLElBQVA7QUFDRDtBQUNGOztBQUVEQyxFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixXQUNFO0FBQVEsTUFBQSxTQUFTLEVBQUMsOEZBQWxCO0FBQ0UsTUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFEaEIsc0JBREY7QUFJRDs7QUFFRHhCLEVBQUFBLHNCQUFzQixDQUFDOUYsSUFBRCxFQUFPO0FBQzNCLFFBQUlBLElBQUksQ0FBQ0UsTUFBTCxHQUFjQyxzQkFBbEIsRUFBMEM7QUFDeEMsYUFDRTtBQUFLLFFBQUEsU0FBUyxFQUFDO0FBQWYseUNBQytCQSxzQkFEL0IsV0FERjtBQUtELEtBTkQsTUFNTztBQUNMLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBRUQ0RixFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixVQUFNNUQsY0FBYyxHQUFHLEtBQUtoQixLQUFMLENBQVdnQixjQUFsQzs7QUFFQSxRQUFJQSxjQUFjLElBQUlBLGNBQWMsQ0FBQ2pDLE1BQWYsR0FBd0IsQ0FBOUMsRUFBaUQ7QUFDL0MsWUFBTTZFLGFBQWEsR0FBRyxLQUFLNUQsS0FBTCxDQUFXQyxTQUFYLENBQXFCZ0QsZ0JBQXJCLEVBQXRCO0FBQ0EsWUFBTVMsa0JBQWtCLEdBQUcsS0FBS25FLEtBQUwsQ0FBV21FLGtCQUF0QztBQUNBLFlBQU0wQyxhQUFhLEdBQUdwRixjQUFjLENBQ2pDa0QsR0FEbUIsQ0FDZm1DLFFBQVEsSUFBSUMsY0FBS0MsSUFBTCxDQUFVLEtBQUtoSCxLQUFMLENBQVd3RCxvQkFBckIsRUFBMkNzRCxRQUFRLENBQUNoRixRQUFwRCxDQURHLEVBRW5CUyxJQUZtQixDQUVkMEUsWUFBWSxJQUFJOUMsa0JBQWtCLENBQUMrQyxZQUFuQixDQUFnQ0QsWUFBaEMsTUFBa0QsQ0FGcEQsQ0FBdEI7QUFJQSxZQUFNRSxtQkFBbUIsR0FBR04sYUFBYSxHQUN2QztBQUNFLFFBQUEsU0FBUyxFQUFDLGlDQURaO0FBRUUsUUFBQSxPQUFPLEVBQUUsS0FBS087QUFGaEIsUUFEdUMsR0FLckMsSUFMSjtBQU9BLGFBQ0U7QUFBSyxRQUFBLFNBQVMsRUFBRyxzREFBcUQsS0FBSzVDLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBZ0M7QUFBdEcsU0FDRTtBQUFRLFFBQUEsU0FBUyxFQUFDO0FBQWxCLFNBQ0U7QUFBTSxRQUFBLFNBQVMsRUFBRTtBQUFqQixRQURGLEVBRUU7QUFBTSxRQUFBLFNBQVMsRUFBQztBQUFoQiwyQkFGRixFQUdHMkMsbUJBSEgsRUFJRTtBQUNFLFFBQUEsU0FBUyxFQUFDLHFEQURaO0FBRUUsUUFBQSxRQUFRLEVBQUVOLGFBRlo7QUFHRSxRQUFBLE9BQU8sRUFBRSxLQUFLUTtBQUhoQixxQkFKRixDQURGLEVBWUU7QUFBSyxRQUFBLFNBQVMsRUFBQztBQUFmLFNBRUk1RixjQUFjLENBQUNrRCxHQUFmLENBQW1CMkMsYUFBYSxJQUFJO0FBQ2xDLGNBQU1DLFFBQVEsR0FBR1IsY0FBS0MsSUFBTCxDQUFVLEtBQUtoSCxLQUFMLENBQVd3RCxvQkFBckIsRUFBMkM4RCxhQUFhLENBQUN4RixRQUF6RCxDQUFqQjs7QUFFQSxlQUNFLDZCQUFDLGtDQUFEO0FBQ0UsVUFBQSxHQUFHLEVBQUV5RixRQURQO0FBRUUsVUFBQSxhQUFhLEVBQUVELGFBRmpCO0FBR0UsVUFBQSxrQkFBa0IsRUFBRW5ELGtCQUFrQixDQUFDK0MsWUFBbkIsQ0FBZ0NLLFFBQWhDLENBSHRCO0FBSUUsVUFBQSxtQkFBbUIsRUFBRSxLQUFLMUMsbUJBSjVCO0FBS0UsVUFBQSxhQUFhLEVBQUVDLEtBQUssSUFBSSxLQUFLQyxjQUFMLENBQW9CRCxLQUFwQixFQUEyQndDLGFBQTNCLENBTDFCO0FBTUUsVUFBQSxhQUFhLEVBQUV4QyxLQUFLLElBQUksS0FBS0UsaUJBQUwsQ0FBdUJGLEtBQXZCLEVBQThCd0MsYUFBOUIsQ0FOMUI7QUFPRSxVQUFBLFdBQVcsRUFBRXhDLEtBQUssSUFBSSxLQUFLRyxlQUFMLENBQXFCSCxLQUFyQixFQUE0QndDLGFBQTVCLENBUHhCO0FBUUUsVUFBQSxXQUFXLEVBQUV4QyxLQUFLLElBQUksS0FBS0ksZUFBTCxDQUFxQkosS0FBckIsRUFBNEJ3QyxhQUE1QixDQVJ4QjtBQVNFLFVBQUEsUUFBUSxFQUFFakQsYUFBYSxDQUFDYyxHQUFkLENBQWtCbUMsYUFBbEI7QUFUWixVQURGO0FBYUQsT0FoQkQsQ0FGSixDQVpGLEVBaUNHLEtBQUtsQyxzQkFBTCxDQUE0QjNELGNBQTVCLENBakNILENBREY7QUFxQ0QsS0FuREQsTUFtRE87QUFDTCxhQUFPLDhDQUFQO0FBQ0Q7QUFDRjs7QUFFRCtGLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUt6RyxJQUFMLENBQVUwRyxPQUFWO0FBQ0Q7O0FBRURsSCxFQUFBQSx3QkFBd0IsR0FBRztBQUN6QixXQUFPbUgsS0FBSyxDQUFDQyxJQUFOLENBQVcsS0FBS2xILEtBQUwsQ0FBV0MsU0FBWCxDQUFxQmdELGdCQUFyQixFQUFYLEVBQW9EN0IsSUFBSSxJQUFJQSxJQUFJLENBQUNDLFFBQWpFLENBQVA7QUFDRDs7QUFFRDhGLEVBQUFBLHdCQUF3QixHQUFHO0FBQ3pCLFFBQUksS0FBS25ILEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkMsZ0JBQXJCLE9BQTRDLFdBQWhELEVBQTZEO0FBQzNELGFBQU8sRUFBUDtBQUNEOztBQUNELFdBQU8sS0FBS0osd0JBQUwsRUFBUDtBQUNEOztBQUVEMkYsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsVUFBTTJCLFNBQVMsR0FBRyxLQUFLdEgsd0JBQUwsRUFBbEI7QUFDQSxXQUFPLEtBQUtQLEtBQUwsQ0FBVzhILFNBQVgsQ0FBcUJELFNBQXJCLENBQVA7QUFDRDs7QUFFRHpILEVBQUFBLGNBQWMsQ0FBQztBQUFDRixJQUFBQTtBQUFELE1BQWdCLEVBQWpCLEVBQXFCO0FBQ2pDLFVBQU0ySCxTQUFTLEdBQUcsS0FBS3RILHdCQUFMLEVBQWxCO0FBQ0EsaUNBQVMsMEJBQVQsRUFBcUM7QUFDbkN3SCxNQUFBQSxPQUFPLEVBQUUsUUFEMEI7QUFFbkNDLE1BQUFBLFNBQVMsRUFBRSxhQUZ3QjtBQUduQ0MsTUFBQUEsU0FBUyxFQUFFSixTQUFTLENBQUNySSxNQUhjO0FBSW5DMEksTUFBQUEsSUFBSSxFQUFFLFVBSjZCO0FBS25DaEksTUFBQUE7QUFMbUMsS0FBckM7QUFPQSxXQUFPLEtBQUtGLEtBQUwsQ0FBV21JLDZCQUFYLENBQXlDTixTQUF6QyxDQUFQO0FBQ0Q7O0FBRUQ3QixFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixXQUFPLElBQUlySCxPQUFKLENBQVlDLE9BQU8sSUFBSTtBQUM1QixVQUFJd0osUUFBUSxHQUFHLEtBQWY7QUFFQSxXQUFLeEgsUUFBTCxDQUFjQyxTQUFTLElBQUk7QUFDekIsY0FBTXdILElBQUksR0FBR3hILFNBQVMsQ0FBQ0gsU0FBVixDQUFvQjRILHFCQUFwQixFQUFiOztBQUNBLFlBQUl6SCxTQUFTLENBQUNILFNBQVYsS0FBd0IySCxJQUE1QixFQUFrQztBQUNoQyxpQkFBTyxFQUFQO0FBQ0Q7O0FBRURELFFBQUFBLFFBQVEsR0FBRyxJQUFYO0FBQ0EsZUFBTztBQUFDMUgsVUFBQUEsU0FBUyxFQUFFMkgsSUFBSSxDQUFDdkgsUUFBTDtBQUFaLFNBQVA7QUFDRCxPQVJELEVBUUcsTUFBTWxDLE9BQU8sQ0FBQ3dKLFFBQUQsQ0FSaEI7QUFTRCxLQVpNLENBQVA7QUFhRDs7QUFFRG5DLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFdBQU8sSUFBSXRILE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzVCLFVBQUkySixTQUFTLEdBQUcsS0FBaEI7QUFDQSxXQUFLM0gsUUFBTCxDQUFjQyxTQUFTLElBQUk7QUFDekIsY0FBTXdILElBQUksR0FBR3hILFNBQVMsQ0FBQ0gsU0FBVixDQUFvQjhILHlCQUFwQixFQUFiOztBQUNBLFlBQUkzSCxTQUFTLENBQUNILFNBQVYsS0FBd0IySCxJQUE1QixFQUFrQztBQUNoQyxpQkFBTyxFQUFQO0FBQ0Q7O0FBRURFLFFBQUFBLFNBQVMsR0FBRyxJQUFaO0FBQ0EsZUFBTztBQUFDN0gsVUFBQUEsU0FBUyxFQUFFMkgsSUFBSSxDQUFDdkgsUUFBTDtBQUFaLFNBQVA7QUFDRCxPQVJELEVBUUcsTUFBTWxDLE9BQU8sQ0FBQzJKLFNBQUQsQ0FSaEI7QUFTRCxLQVhNLENBQVA7QUFZRDs7QUFFREUsRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakIsV0FBTyxJQUFJOUosT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDNUIsVUFBSThKLGNBQWMsR0FBRyxLQUFyQjtBQUNBLFdBQUs5SCxRQUFMLENBQWNDLFNBQVMsSUFBSTtBQUN6QixjQUFNd0gsSUFBSSxHQUFHeEgsU0FBUyxDQUFDSCxTQUFWLENBQW9CaUkscUJBQXBCLEVBQWI7QUFDQUQsUUFBQUEsY0FBYyxHQUFHTCxJQUFJLENBQUMzRSxnQkFBTCxHQUF3QkMsSUFBeEIsR0FBK0IsQ0FBaEQ7O0FBRUEsWUFBSTlDLFNBQVMsQ0FBQ0gsU0FBVixLQUF3QjJILElBQTVCLEVBQWtDO0FBQ2hDLGlCQUFPLEVBQVA7QUFDRDs7QUFFRCxlQUFPO0FBQUMzSCxVQUFBQSxTQUFTLEVBQUUySCxJQUFJLENBQUN2SCxRQUFMO0FBQVosU0FBUDtBQUNELE9BVEQsRUFTRyxNQUFNbEMsT0FBTyxDQUFDOEosY0FBRCxDQVRoQjtBQVVELEtBWk0sQ0FBUDtBQWFEOztBQUVEaEUsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsUUFBSSxLQUFLMUUsS0FBTCxDQUFXdUIsZUFBWCxDQUEyQi9CLE1BQTNCLEtBQXNDLENBQTFDLEVBQTZDO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBQzdELFdBQU8sS0FBS1EsS0FBTCxDQUFXNEksd0JBQVgsQ0FBb0MsVUFBcEMsQ0FBUDtBQUNEOztBQUVEdEQsRUFBQUEsVUFBVSxHQUFHO0FBQ1gsUUFBSSxLQUFLdEYsS0FBTCxDQUFXd0IsYUFBWCxDQUF5QmhDLE1BQXpCLEtBQW9DLENBQXhDLEVBQTJDO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBQzNELFdBQU8sS0FBS1EsS0FBTCxDQUFXNEksd0JBQVgsQ0FBb0MsUUFBcEMsQ0FBUDtBQUNEOztBQUVEdkIsRUFBQUEsc0JBQXNCLEdBQUc7QUFDdkIsUUFBSSxLQUFLckgsS0FBTCxDQUFXeUIsY0FBWCxDQUEwQmpDLE1BQTFCLEtBQXFDLENBQXpDLEVBQTRDO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBQzVELFVBQU1xSSxTQUFTLEdBQUcsS0FBSzdILEtBQUwsQ0FBV3lCLGNBQVgsQ0FBMEJrRCxHQUExQixDQUE4Qm1DLFFBQVEsSUFBSUEsUUFBUSxDQUFDaEYsUUFBbkQsQ0FBbEI7QUFDQSxXQUFPLEtBQUs5QixLQUFMLENBQVdRLHlCQUFYLENBQXFDcUgsU0FBckMsRUFBZ0QsVUFBaEQsQ0FBUDtBQUNEOztBQUVEeEgsRUFBQUEsVUFBVSxDQUFDO0FBQUNILElBQUFBO0FBQUQsTUFBZ0IsRUFBakIsRUFBcUI7QUFDN0IsUUFBSSxLQUFLRixLQUFMLENBQVd1QixlQUFYLENBQTJCL0IsTUFBM0IsS0FBc0MsQ0FBMUMsRUFBNkM7QUFBRSxhQUFPLElBQVA7QUFBYzs7QUFDN0QsVUFBTXFJLFNBQVMsR0FBRyxLQUFLN0gsS0FBTCxDQUFXdUIsZUFBWCxDQUEyQm9ELEdBQTNCLENBQStCQyxTQUFTLElBQUlBLFNBQVMsQ0FBQzlDLFFBQXRELENBQWxCO0FBQ0EsaUNBQVMsMEJBQVQsRUFBcUM7QUFDbkNpRyxNQUFBQSxPQUFPLEVBQUUsUUFEMEI7QUFFbkNDLE1BQUFBLFNBQVMsRUFBRSxhQUZ3QjtBQUduQ0MsTUFBQUEsU0FBUyxFQUFFSixTQUFTLENBQUNySSxNQUhjO0FBSW5DMEksTUFBQUEsSUFBSSxFQUFFLEtBSjZCO0FBS25DaEksTUFBQUE7QUFMbUMsS0FBckM7QUFPQSxXQUFPLEtBQUtGLEtBQUwsQ0FBV21JLDZCQUFYLENBQXlDTixTQUF6QyxDQUFQO0FBQ0Q7O0FBVURnQixFQUFBQSx3QkFBd0IsR0FBRztBQUN6QixXQUFPLEtBQUtwSSxLQUFMLENBQVdDLFNBQVgsQ0FBcUJvSSxvQkFBckIsRUFBUDtBQUNEOztBQUVEdEQsRUFBQUEsY0FBYyxDQUFDdUQsWUFBWSxHQUFHLEtBQWhCLEVBQXVCO0FBQ25DLFdBQU8sSUFBSXBLLE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzVCLFdBQUtnQyxRQUFMLENBQWNDLFNBQVMsS0FBSztBQUMxQkgsUUFBQUEsU0FBUyxFQUFFRyxTQUFTLENBQUNILFNBQVYsQ0FBb0JzSSxrQkFBcEIsQ0FBdUNELFlBQXZDLEVBQXFEakksUUFBckQ7QUFEZSxPQUFMLENBQXZCLEVBRUlsQyxPQUZKO0FBR0QsS0FKTSxDQUFQO0FBS0Q7O0FBRUQ2RyxFQUFBQSxVQUFVLENBQUNzRCxZQUFZLEdBQUcsS0FBaEIsRUFBdUI7QUFDL0IsV0FBTyxJQUFJcEssT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDNUIsV0FBS2dDLFFBQUwsQ0FBY0MsU0FBUyxLQUFLO0FBQzFCSCxRQUFBQSxTQUFTLEVBQUVHLFNBQVMsQ0FBQ0gsU0FBVixDQUFvQnVJLGNBQXBCLENBQW1DRixZQUFuQyxFQUFpRGpJLFFBQWpEO0FBRGUsT0FBTCxDQUF2QixFQUVJbEMsT0FGSjtBQUdELEtBSk0sQ0FBUDtBQUtEOztBQUVEZ0gsRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FBTyxJQUFJakgsT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDNUIsV0FBS2dDLFFBQUwsQ0FBY0MsU0FBUyxLQUFLO0FBQzFCSCxRQUFBQSxTQUFTLEVBQUVHLFNBQVMsQ0FBQ0gsU0FBVixDQUFvQndJLGNBQXBCLEdBQXFDcEksUUFBckM7QUFEZSxPQUFMLENBQXZCLEVBRUlsQyxPQUZKO0FBR0QsS0FKTSxDQUFQO0FBS0Q7O0FBRURpSCxFQUFBQSxXQUFXLENBQUNrRCxZQUFZLEdBQUcsS0FBaEIsRUFBdUI7QUFDaEMsV0FBTyxJQUFJcEssT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDNUIsV0FBS2dDLFFBQUwsQ0FBY0MsU0FBUyxLQUFLO0FBQzFCSCxRQUFBQSxTQUFTLEVBQUVHLFNBQVMsQ0FBQ0gsU0FBVixDQUFvQnlJLGVBQXBCLENBQW9DSixZQUFwQyxFQUFrRGpJLFFBQWxEO0FBRGUsT0FBTCxDQUF2QixFQUVJbEMsT0FGSjtBQUdELEtBSk0sQ0FBUDtBQUtEOztBQUVEa0gsRUFBQUEsVUFBVSxDQUFDaUQsWUFBWSxHQUFHLEtBQWhCLEVBQXVCO0FBQy9CLFdBQU8sSUFBSXBLLE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzVCLFdBQUtnQyxRQUFMLENBQWNDLFNBQVMsS0FBSztBQUMxQkgsUUFBQUEsU0FBUyxFQUFFRyxTQUFTLENBQUNILFNBQVYsQ0FBb0IwSSxjQUFwQixDQUFtQ0wsWUFBbkMsRUFBaURqSSxRQUFqRDtBQURlLE9BQUwsQ0FBdkIsRUFFSWxDLE9BRko7QUFHRCxLQUpNLENBQVA7QUFLRDs7QUFFc0IsUUFBakI4RyxpQkFBaUIsR0FBRztBQUN4QixVQUFNckIsYUFBYSxHQUFHLEtBQUs1RCxLQUFMLENBQVdDLFNBQVgsQ0FBcUJnRCxnQkFBckIsRUFBdEI7O0FBQ0EsUUFBSVcsYUFBYSxDQUFDVixJQUFkLEtBQXVCLENBQTNCLEVBQThCO0FBQzVCO0FBQ0Q7O0FBRUQsVUFBTTBGLFlBQVksR0FBR2hGLGFBQWEsQ0FBQ2lGLE1BQWQsR0FBdUJqQixJQUF2QixHQUE4QmpILEtBQW5EO0FBQ0EsVUFBTW1JLGFBQWEsR0FBRyxLQUFLOUksS0FBTCxDQUFXQyxTQUFYLENBQXFCQyxnQkFBckIsRUFBdEI7O0FBRUEsUUFBSTRJLGFBQWEsS0FBSyxXQUF0QixFQUFtQztBQUNqQyxXQUFLQyw0QkFBTCxDQUFrQ0gsWUFBWSxDQUFDdkgsUUFBL0MsRUFBeUQ7QUFBQzJILFFBQUFBLFFBQVEsRUFBRTtBQUFYLE9BQXpEO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxLQUFLQyxpQkFBTCxDQUF1QkwsWUFBWSxDQUFDdkgsUUFBcEMsRUFBOEMsS0FBS3JCLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkMsZ0JBQXJCLEVBQTlDLEVBQXVGO0FBQUM4SSxRQUFBQSxRQUFRLEVBQUU7QUFBWCxPQUF2RixDQUFOO0FBQ0Q7QUFDRjs7QUFFc0IsUUFBakJ0RyxpQkFBaUIsR0FBRztBQUN4QixVQUFNdEIsSUFBSSxHQUFHLEtBQUs3QixLQUFMLENBQVdpRCxTQUFYLENBQXFCMEcsaUJBQXJCLEVBQWI7O0FBQ0EsUUFBSSxDQUFDOUgsSUFBTCxFQUFXO0FBQ1Q7QUFDRDs7QUFFRCxVQUFNK0gsZUFBZSxHQUFHL0gsSUFBSSxDQUFDZ0ksa0JBQUwsSUFBMkJoSSxJQUFJLENBQUNnSSxrQkFBTCxFQUFuRDtBQUNBLFVBQU1DLFFBQVEsR0FBRyxNQUFNRixlQUF2Qjs7QUFDQSxRQUFJLENBQUNFLFFBQUwsRUFBZTtBQUNiO0FBQ0Q7O0FBRUQsVUFBTUMsZUFBZSxHQUFHRCxRQUFRLENBQUNDLGVBQVQsSUFBNEJELFFBQVEsQ0FBQ0MsZUFBVCxFQUFwRDtBQUNBLFVBQU1DLE9BQU8sR0FBR0YsUUFBUSxDQUFDRyxtQkFBVCxJQUFnQ0gsUUFBUSxDQUFDRyxtQkFBVCxPQUFtQyxLQUFLakssS0FBTCxDQUFXd0Qsb0JBQTlGOztBQUVBLFFBQUl1RyxlQUFlLElBQUlDLE9BQXZCLEVBQWdDO0FBQzlCLFdBQUtFLGlCQUFMLENBQXVCSixRQUFRLENBQUNLLFdBQVQsRUFBdkIsRUFBK0NMLFFBQVEsQ0FBQ00sZ0JBQVQsRUFBL0M7QUFDRDtBQUNGOztBQUVpQixRQUFaekUsWUFBWSxHQUFHO0FBQ25CLFVBQU10QixhQUFhLEdBQUcsS0FBSzVELEtBQUwsQ0FBV0MsU0FBWCxDQUFxQmdELGdCQUFyQixFQUF0Qjs7QUFDQSxRQUFJVyxhQUFhLENBQUNWLElBQWQsS0FBdUIsQ0FBM0IsRUFBOEI7QUFDNUI7QUFDRDs7QUFFRCxVQUFNMEYsWUFBWSxHQUFHaEYsYUFBYSxDQUFDaUYsTUFBZCxHQUF1QmpCLElBQXZCLEdBQThCakgsS0FBbkQ7QUFDQSxVQUFNbUksYUFBYSxHQUFHLEtBQUs5SSxLQUFMLENBQVdDLFNBQVgsQ0FBcUJDLGdCQUFyQixFQUF0Qjs7QUFFQSxRQUFJNEksYUFBYSxLQUFLLFdBQXRCLEVBQW1DO0FBQ2pDLFdBQUtDLDRCQUFMLENBQWtDSCxZQUFZLENBQUN2SCxRQUEvQztBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sS0FBSzRILGlCQUFMLENBQXVCTCxZQUFZLENBQUN2SCxRQUFwQyxFQUE4QyxLQUFLckIsS0FBTCxDQUFXQyxTQUFYLENBQXFCQyxnQkFBckIsRUFBOUMsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUR5RyxFQUFBQSxtQkFBbUIsQ0FBQ3RDLEtBQUQsRUFBUTtBQUN6QixVQUFNdUYsYUFBYSxHQUFHLEtBQUtySyxLQUFMLENBQVd5QixjQUFYLENBQTBCa0QsR0FBMUIsQ0FBOEIyRixDQUFDLElBQUlBLENBQUMsQ0FBQ3hJLFFBQXJDLENBQXRCO0FBRUFnRCxJQUFBQSxLQUFLLENBQUN5RixjQUFOO0FBRUEsVUFBTUMsSUFBSSxHQUFHLElBQUlyTSxJQUFKLEVBQWI7QUFFQXFNLElBQUFBLElBQUksQ0FBQ0MsTUFBTCxDQUFZLElBQUlyTSxRQUFKLENBQWE7QUFDdkJzTSxNQUFBQSxLQUFLLEVBQUUscUJBRGdCO0FBRXZCQyxNQUFBQSxLQUFLLEVBQUUsTUFBTSxLQUFLM0ssS0FBTCxDQUFXNEssYUFBWCxDQUF5QlAsYUFBekI7QUFGVSxLQUFiLENBQVo7QUFLQUcsSUFBQUEsSUFBSSxDQUFDQyxNQUFMLENBQVksSUFBSXJNLFFBQUosQ0FBYTtBQUN2QnNNLE1BQUFBLEtBQUssRUFBRSx1QkFEZ0I7QUFFdkJDLE1BQUFBLEtBQUssRUFBRSxNQUFNLEtBQUszSyxLQUFMLENBQVc2SyxlQUFYLENBQTJCUixhQUEzQjtBQUZVLEtBQWIsQ0FBWjtBQUtBRyxJQUFBQSxJQUFJLENBQUNNLEtBQUwsQ0FBV3pNLGlCQUFPME0sZ0JBQVAsRUFBWDtBQUNEOztBQUVEckUsRUFBQUEsZUFBZSxDQUFDNUIsS0FBRCxFQUFRO0FBQ3JCQSxJQUFBQSxLQUFLLENBQUN5RixjQUFOO0FBRUEsVUFBTUMsSUFBSSxHQUFHLElBQUlyTSxJQUFKLEVBQWI7QUFFQSxVQUFNNk0saUJBQWlCLEdBQUcsS0FBS3ZLLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQmdELGdCQUFyQixHQUF3Q0MsSUFBbEU7QUFDQSxVQUFNc0gsYUFBYSxHQUFHRCxpQkFBaUIsR0FBRyxDQUFwQixHQUF3QixHQUF4QixHQUE4QixFQUFwRDtBQUVBUixJQUFBQSxJQUFJLENBQUNDLE1BQUwsQ0FBWSxJQUFJck0sUUFBSixDQUFhO0FBQ3ZCc00sTUFBQUEsS0FBSyxFQUFFLHFCQURnQjtBQUV2QkMsTUFBQUEsS0FBSyxFQUFFLE1BQU0sS0FBS3RLLFVBQUwsQ0FBZ0I7QUFBQ0gsUUFBQUEsV0FBVyxFQUFFO0FBQWQsT0FBaEIsQ0FGVTtBQUd2QmdMLE1BQUFBLE9BQU8sRUFBRSxLQUFLbEwsS0FBTCxDQUFXdUIsZUFBWCxDQUEyQi9CLE1BQTNCLEdBQW9DO0FBSHRCLEtBQWIsQ0FBWjtBQU1BZ0wsSUFBQUEsSUFBSSxDQUFDQyxNQUFMLENBQVksSUFBSXJNLFFBQUosQ0FBYTtBQUN2QnNNLE1BQUFBLEtBQUssRUFBRSxxQ0FBcUNPLGFBRHJCO0FBRXZCTixNQUFBQSxLQUFLLEVBQUUsTUFBTSxLQUFLdkssY0FBTCxDQUFvQjtBQUFDRixRQUFBQSxXQUFXLEVBQUU7QUFBZCxPQUFwQixDQUZVO0FBR3ZCZ0wsTUFBQUEsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLbEwsS0FBTCxDQUFXdUIsZUFBWCxDQUEyQi9CLE1BQTNCLElBQXFDd0wsaUJBQXZDO0FBSGEsS0FBYixDQUFaO0FBTUFSLElBQUFBLElBQUksQ0FBQ0MsTUFBTCxDQUFZLElBQUlyTSxRQUFKLENBQWE7QUFDdkJzTSxNQUFBQSxLQUFLLEVBQUUsbUJBRGdCO0FBRXZCQyxNQUFBQSxLQUFLLEVBQUUsTUFBTSxLQUFLMUssZUFBTCxDQUFxQjtBQUFDQyxRQUFBQSxXQUFXLEVBQUU7QUFBZCxPQUFyQixDQUZVO0FBR3ZCZ0wsTUFBQUEsT0FBTyxFQUFFLEtBQUtsTCxLQUFMLENBQVd5RztBQUhHLEtBQWIsQ0FBWjtBQU1BK0QsSUFBQUEsSUFBSSxDQUFDTSxLQUFMLENBQVd6TSxpQkFBTzBNLGdCQUFQLEVBQVg7QUFDRDs7QUFFRDVFLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUtuRyxLQUFMLENBQVc0SyxhQUFYLENBQXlCLEtBQUtoRCx3QkFBTCxFQUF6QjtBQUNEOztBQUVEeEIsRUFBQUEsc0JBQXNCLEdBQUc7QUFDdkIsU0FBS3BHLEtBQUwsQ0FBVzZLLGVBQVgsQ0FBMkIsS0FBS2pELHdCQUFMLEVBQTNCO0FBQ0QsR0ExbkJzRCxDQTRuQnZEO0FBQ0E7QUFDQTs7O0FBQ0FzQyxFQUFBQSxpQkFBaUIsQ0FBQ3BJLFFBQUQsRUFBV3lILGFBQVgsRUFBMEI7QUFDekMsV0FBTyxJQUFJNUssT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDNUIsV0FBS2dDLFFBQUwsQ0FBY0MsU0FBUyxJQUFJO0FBQ3pCLGNBQU1nQixJQUFJLEdBQUdoQixTQUFTLENBQUNILFNBQVYsQ0FBb0J5SyxRQUFwQixDQUE2QixDQUFDQyxJQUFELEVBQU8vTCxHQUFQLEtBQWUrTCxJQUFJLENBQUN0SixRQUFMLEtBQWtCQSxRQUFsQixJQUE4QnpDLEdBQUcsS0FBS2tLLGFBQWxGLENBQWI7O0FBQ0EsWUFBSSxDQUFDMUgsSUFBTCxFQUFXO0FBQ1Q7QUFDQTtBQUNBd0osVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQWEsK0JBQThCeEosUUFBUyx3QkFBdUJ5SCxhQUFjLEVBQXpGO0FBQ0EsaUJBQU8sSUFBUDtBQUNEOztBQUVELGVBQU87QUFBQzdJLFVBQUFBLFNBQVMsRUFBRUcsU0FBUyxDQUFDSCxTQUFWLENBQW9CNkssVUFBcEIsQ0FBK0IxSixJQUEvQjtBQUFaLFNBQVA7QUFDRCxPQVZELEVBVUdqRCxPQVZIO0FBV0QsS0FaTSxDQUFQO0FBYUQ7O0FBRUQ4RSxFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixVQUFNNkYsYUFBYSxHQUFHLEtBQUs5SSxLQUFMLENBQVdDLFNBQVgsQ0FBcUJDLGdCQUFyQixFQUF0QjtBQUNBLFdBQU8rRyxLQUFLLENBQUNDLElBQU4sQ0FBVyxLQUFLbEgsS0FBTCxDQUFXQyxTQUFYLENBQXFCZ0QsZ0JBQXJCLEVBQVgsRUFBb0Q3QixJQUFJLElBQUk7QUFDakUsYUFBTztBQUNMQyxRQUFBQSxRQUFRLEVBQUVELElBQUksQ0FBQ0MsUUFEVjtBQUVMeUgsUUFBQUE7QUFGSyxPQUFQO0FBSUQsS0FMTSxDQUFQO0FBTUQ7O0FBRURqSSxFQUFBQSxzQkFBc0IsQ0FBQ2tLLE9BQUQsRUFBVTtBQUM5QixVQUFNbkgsYUFBYSxHQUFHcUQsS0FBSyxDQUFDQyxJQUFOLENBQVcsS0FBS2xILEtBQUwsQ0FBV0MsU0FBWCxDQUFxQmdELGdCQUFyQixFQUFYLENBQXRCOztBQUNBLFFBQUlXLGFBQWEsQ0FBQzdFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsV0FBS2lNLG1CQUFMLENBQXlCcEgsYUFBYSxDQUFDLENBQUQsQ0FBdEMsRUFBMkNtSCxPQUEzQztBQUNEO0FBQ0Y7O0FBRXdCLFFBQW5CQyxtQkFBbUIsQ0FBQ3BDLFlBQUQsRUFBZW1DLE9BQU8sR0FBRyxLQUF6QixFQUFnQztBQUN2RCxRQUFJLENBQUMsS0FBS0UsUUFBTCxFQUFMLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLakwsS0FBTCxDQUFXQyxTQUFYLENBQXFCQyxnQkFBckIsT0FBNEMsV0FBaEQsRUFBNkQ7QUFDM0QsVUFBSTZLLE9BQUosRUFBYTtBQUNYLGNBQU0sS0FBS2hDLDRCQUFMLENBQWtDSCxZQUFZLENBQUN2SCxRQUEvQyxFQUF5RDtBQUFDMkgsVUFBQUEsUUFBUSxFQUFFO0FBQVgsU0FBekQsQ0FBTjtBQUNEO0FBQ0YsS0FKRCxNQUlPO0FBQ0wsVUFBSStCLE9BQUosRUFBYTtBQUNYO0FBQ0EsY0FBTSxLQUFLOUIsaUJBQUwsQ0FBdUJMLFlBQVksQ0FBQ3ZILFFBQXBDLEVBQThDLEtBQUtyQixLQUFMLENBQVdDLFNBQVgsQ0FBcUJDLGdCQUFyQixFQUE5QyxFQUF1RjtBQUFDOEksVUFBQUEsUUFBUSxFQUFFO0FBQVgsU0FBdkYsQ0FBTjtBQUNELE9BSEQsTUFHTztBQUNMLGNBQU1rQywyQkFBMkIsR0FBRyxLQUFLQyxxQ0FBTCxFQUFwQzs7QUFDQSxZQUFJRCwyQkFBMkIsQ0FBQ25NLE1BQTVCLEdBQXFDLENBQXpDLEVBQTRDO0FBQzFDO0FBQ0EsZ0JBQU1iLE9BQU8sQ0FBQ2tOLEdBQVIsQ0FBWUYsMkJBQTJCLENBQUNoSCxHQUE1QixDQUFnQyxNQUFNbUgsSUFBTixJQUFjO0FBQzlELGtCQUFNLEtBQUtwQyxpQkFBTCxDQUF1QkwsWUFBWSxDQUFDdkgsUUFBcEMsRUFBOEMsS0FBS3JCLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkMsZ0JBQXJCLEVBQTlDLEVBQXVGO0FBQzNGOEksY0FBQUEsUUFBUSxFQUFFLEtBRGlGO0FBRTNGcUMsY0FBQUE7QUFGMkYsYUFBdkYsQ0FBTjtBQUlELFdBTGlCLENBQVosQ0FBTjtBQU1ELFNBUkQsTUFRTztBQUNMO0FBQ0EsZ0JBQU1DLFVBQVUsR0FBRyxLQUFLL0wsS0FBTCxDQUFXaUQsU0FBWCxDQUFxQitJLFNBQXJCLEdBQWlDQyxhQUFqQyxFQUFuQjtBQUNBLGdCQUFNQyxpQkFBaUIsR0FBR0gsVUFBVSxDQUFDSSxjQUFYLEVBQTFCOztBQUNBLGdCQUFNQyxpQ0FBaUMsR0FBR0YsaUJBQWlCLElBQUlBLGlCQUFpQixDQUFDRyxXQUF2QyxJQUN4Q0gsaUJBQWlCLENBQUNHLFdBQWxCLGNBQTJDQyx3QkFEN0M7O0FBRUEsY0FBSUYsaUNBQUosRUFBdUM7QUFDckMsa0JBQU0sS0FBSzFDLGlCQUFMLENBQXVCTCxZQUFZLENBQUN2SCxRQUFwQyxFQUE4QyxLQUFLckIsS0FBTCxDQUFXQyxTQUFYLENBQXFCQyxnQkFBckIsRUFBOUMsRUFBdUY7QUFDM0Y4SSxjQUFBQSxRQUFRLEVBQUUsS0FEaUY7QUFFM0ZxQyxjQUFBQSxJQUFJLEVBQUVDO0FBRnFGLGFBQXZGLENBQU47QUFJRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGOztBQUVESCxFQUFBQSxxQ0FBcUMsR0FBRztBQUN0QztBQUNBO0FBQ0EsV0FBTyxLQUFLNUwsS0FBTCxDQUFXaUQsU0FBWCxDQUFxQnNKLFFBQXJCLEdBQWdDQyxNQUFoQyxDQUF1Q1YsSUFBSSxJQUFJO0FBQ3BELFlBQU1XLFdBQVcsR0FBR1gsSUFBSSxDQUFDSyxjQUFMLEVBQXBCOztBQUNBLFVBQUksQ0FBQ00sV0FBRCxJQUFnQixDQUFDQSxXQUFXLENBQUNKLFdBQWpDLEVBQThDO0FBQUUsZUFBTyxLQUFQO0FBQWU7O0FBQy9ELFlBQU12QyxRQUFRLEdBQUcyQyxXQUFXLENBQUNKLFdBQVosRUFBakI7O0FBQ0EsVUFBSSxFQUFFdkMsUUFBUSxZQUFZd0Msd0JBQXRCLENBQUosRUFBNEM7QUFDMUMsZUFBTyxLQUFQO0FBQ0QsT0FObUQsQ0FPcEQ7OztBQUNBLFlBQU1JLGNBQWMsR0FBRzVDLFFBQVEsQ0FBQ0csbUJBQVQsT0FBbUMsS0FBS2pLLEtBQUwsQ0FBV3dELG9CQUFyRTtBQUNBLFlBQU1tSixPQUFPLEdBQUcsQ0FBQyxLQUFLQyxpQkFBTCxDQUF1QjlDLFFBQVEsQ0FBQ0ssV0FBVCxFQUF2QixFQUErQ0wsUUFBUSxDQUFDTSxnQkFBVCxFQUEvQyxDQUFqQjtBQUNBLGFBQU9zQyxjQUFjLElBQUlDLE9BQXpCO0FBQ0QsS0FYTSxDQUFQO0FBWUQ7O0FBRURDLEVBQUFBLGlCQUFpQixDQUFDOUssUUFBRCxFQUFXeUgsYUFBWCxFQUEwQjtBQUN6QyxXQUFPLEtBQUs5SSxLQUFMLENBQVdDLFNBQVgsQ0FBcUJ5SyxRQUFyQixDQUE4QixDQUFDdEosSUFBRCxFQUFPeEMsR0FBUCxLQUFlO0FBQ2xELGFBQU9BLEdBQUcsS0FBS2tLLGFBQVIsSUFBeUIxSCxJQUFJLENBQUNDLFFBQUwsS0FBa0JBLFFBQWxEO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRXNCLFFBQWpCNEgsaUJBQWlCLENBQUM1SCxRQUFELEVBQVd5SCxhQUFYLEVBQTBCO0FBQUNFLElBQUFBLFFBQUQ7QUFBV3FDLElBQUFBO0FBQVgsTUFBbUI7QUFBQ3JDLElBQUFBLFFBQVEsRUFBRTtBQUFYLEdBQTdDLEVBQWdFO0FBQ3JGLFVBQU1vRCxHQUFHLEdBQUdQLHlCQUFnQlEsUUFBaEIsQ0FBeUJoTCxRQUF6QixFQUFtQyxLQUFLOUIsS0FBTCxDQUFXd0Qsb0JBQTlDLEVBQW9FK0YsYUFBcEUsQ0FBWjs7QUFDQSxVQUFNd0QsZUFBZSxHQUFHLE1BQU0sS0FBSy9NLEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUIrSixJQUFyQixDQUM1QkgsR0FENEIsRUFDdkI7QUFBQ0ksTUFBQUEsT0FBTyxFQUFFLElBQVY7QUFBZ0JDLE1BQUFBLFlBQVksRUFBRXpELFFBQTlCO0FBQXdDMEQsTUFBQUEsWUFBWSxFQUFFMUQsUUFBdEQ7QUFBZ0VxQyxNQUFBQTtBQUFoRSxLQUR1QixDQUE5Qjs7QUFHQSxRQUFJckMsUUFBSixFQUFjO0FBQ1osWUFBTTJELFFBQVEsR0FBR0wsZUFBZSxDQUFDTSxVQUFoQixFQUFqQjtBQUNBLFlBQU1DLFNBQVMsR0FBR0YsUUFBUSxDQUFDRyxhQUFULENBQXVCLFlBQXZCLENBQWxCOztBQUNBLFVBQUlELFNBQUosRUFBZTtBQUNiQSxRQUFBQSxTQUFTLENBQUNFLEtBQVY7QUFDRDtBQUNGLEtBTkQsTUFNTztBQUNMO0FBQ0EsV0FBS3hOLEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUJ3SyxXQUFyQixDQUFpQ1YsZUFBakMsRUFBa0RJLFlBQWxELENBQStESixlQUEvRDtBQUNEO0FBQ0Y7O0FBRWlDLFFBQTVCdkQsNEJBQTRCLENBQUNrRSxnQkFBRCxFQUFtQjtBQUFDakUsSUFBQUE7QUFBRCxNQUFhO0FBQUNBLElBQUFBLFFBQVEsRUFBRTtBQUFYLEdBQWhDLEVBQW1EO0FBQ25GLFVBQU1rRSxZQUFZLEdBQUc1RyxjQUFLQyxJQUFMLENBQVUsS0FBS2hILEtBQUwsQ0FBV3dELG9CQUFyQixFQUEyQ2tLLGdCQUEzQyxDQUFyQjs7QUFDQSxRQUFJLE1BQU0sS0FBS0UsVUFBTCxDQUFnQkQsWUFBaEIsQ0FBVixFQUF5QztBQUN2QyxhQUFPLEtBQUszTixLQUFMLENBQVdpRCxTQUFYLENBQXFCK0osSUFBckIsQ0FBMEJXLFlBQTFCLEVBQXdDO0FBQUNULFFBQUFBLFlBQVksRUFBRXpELFFBQWY7QUFBeUIwRCxRQUFBQSxZQUFZLEVBQUUxRCxRQUF2QztBQUFpRHdELFFBQUFBLE9BQU8sRUFBRTtBQUExRCxPQUF4QyxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS2pOLEtBQUwsQ0FBVzZOLG1CQUFYLENBQStCQyxPQUEvQixDQUF1Qyx3QkFBdkM7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNGOztBQUVERixFQUFBQSxVQUFVLENBQUNELFlBQUQsRUFBZTtBQUN2QixXQUFPLElBQUlJLFVBQUosQ0FBU0osWUFBVCxFQUF1QkssTUFBdkIsRUFBUDtBQUNEOztBQUVEakosRUFBQUEsY0FBYyxDQUFDRCxLQUFELEVBQVFqRCxJQUFSLEVBQWM7QUFDMUIsV0FBTyxLQUFLN0IsS0FBTCxDQUFXUSx5QkFBWCxDQUFxQyxDQUFDcUIsSUFBSSxDQUFDQyxRQUFOLENBQXJDLEVBQXNELEtBQUtyQixLQUFMLENBQVdDLFNBQVgsQ0FBcUJ1TixjQUFyQixDQUFvQ3BNLElBQXBDLENBQXRELENBQVA7QUFDRDs7QUFFc0IsUUFBakJtRCxpQkFBaUIsQ0FBQ0YsS0FBRCxFQUFRakQsSUFBUixFQUFjO0FBQ25DLFFBQUksQ0FBQyxLQUFLcEIsS0FBTCxDQUFXQyxTQUFYLENBQXFCZ0QsZ0JBQXJCLEdBQXdDeUIsR0FBeEMsQ0FBNEN0RCxJQUE1QyxDQUFMLEVBQXdEO0FBQ3REaUQsTUFBQUEsS0FBSyxDQUFDb0osZUFBTjtBQUVBcEosTUFBQUEsS0FBSyxDQUFDcUosT0FBTjtBQUNBLFlBQU0sSUFBSXhQLE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzNCLGFBQUtnQyxRQUFMLENBQWNDLFNBQVMsS0FBSztBQUMxQkgsVUFBQUEsU0FBUyxFQUFFRyxTQUFTLENBQUNILFNBQVYsQ0FBb0I2SyxVQUFwQixDQUErQjFKLElBQS9CLEVBQXFDaUQsS0FBSyxDQUFDc0osUUFBM0M7QUFEZSxTQUFMLENBQXZCLEVBRUl4UCxPQUZKO0FBR0QsT0FKSyxDQUFOO0FBTUEsWUFBTXlQLFFBQVEsR0FBRyxJQUFJQyxVQUFKLENBQWV4SixLQUFLLENBQUNvRCxJQUFyQixFQUEyQnBELEtBQTNCLENBQWpCO0FBQ0F5SixNQUFBQSxxQkFBcUIsQ0FBQyxNQUFNO0FBQzFCLFlBQUksQ0FBQ3pKLEtBQUssQ0FBQzBKLE1BQU4sQ0FBYUMsVUFBbEIsRUFBOEI7QUFDNUI7QUFDRDs7QUFDRDNKLFFBQUFBLEtBQUssQ0FBQzBKLE1BQU4sQ0FBYUMsVUFBYixDQUF3QkMsYUFBeEIsQ0FBc0NMLFFBQXRDO0FBQ0QsT0FMb0IsQ0FBckI7QUFNRDtBQUNGOztBQUVvQixRQUFmcEosZUFBZSxDQUFDSCxLQUFELEVBQVFqRCxJQUFSLEVBQWM7QUFDakMsVUFBTThNLE9BQU8sR0FBR0MsT0FBTyxDQUFDQyxRQUFSLEtBQXFCLE9BQXJDOztBQUNBLFFBQUkvSixLQUFLLENBQUNnSyxPQUFOLElBQWlCLENBQUNILE9BQXRCLEVBQStCO0FBQUU7QUFBUyxLQUZULENBRVU7OztBQUMzQyxRQUFJN0osS0FBSyxDQUFDaUssTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUN0QixXQUFLaE4sd0JBQUwsR0FBZ0MsSUFBaEM7QUFFQStDLE1BQUFBLEtBQUssQ0FBQ3FKLE9BQU47QUFDQSxZQUFNLElBQUl4UCxPQUFKLENBQVlDLE9BQU8sSUFBSTtBQUMzQixZQUFJa0csS0FBSyxDQUFDa0ssT0FBTixJQUFrQmxLLEtBQUssQ0FBQ2dLLE9BQU4sSUFBaUJILE9BQXZDLEVBQWlEO0FBQy9DLGVBQUsvTixRQUFMLENBQWNDLFNBQVMsS0FBSztBQUMxQkgsWUFBQUEsU0FBUyxFQUFFRyxTQUFTLENBQUNILFNBQVYsQ0FBb0J1TyxzQkFBcEIsQ0FBMkNwTixJQUEzQztBQURlLFdBQUwsQ0FBdkIsRUFFSWpELE9BRko7QUFHRCxTQUpELE1BSU87QUFDTCxlQUFLZ0MsUUFBTCxDQUFjQyxTQUFTLEtBQUs7QUFDMUJILFlBQUFBLFNBQVMsRUFBRUcsU0FBUyxDQUFDSCxTQUFWLENBQW9CNkssVUFBcEIsQ0FBK0IxSixJQUEvQixFQUFxQ2lELEtBQUssQ0FBQ3NKLFFBQTNDO0FBRGUsV0FBTCxDQUF2QixFQUVJeFAsT0FGSjtBQUdEO0FBQ0YsT0FWSyxDQUFOO0FBV0Q7QUFDRjs7QUFFb0IsUUFBZnNHLGVBQWUsQ0FBQ0osS0FBRCxFQUFRakQsSUFBUixFQUFjO0FBQ2pDLFFBQUksS0FBS0Usd0JBQVQsRUFBbUM7QUFDakMsWUFBTSxJQUFJcEQsT0FBSixDQUFZQyxPQUFPLElBQUk7QUFDM0IsYUFBS2dDLFFBQUwsQ0FBY0MsU0FBUyxLQUFLO0FBQzFCSCxVQUFBQSxTQUFTLEVBQUVHLFNBQVMsQ0FBQ0gsU0FBVixDQUFvQjZLLFVBQXBCLENBQStCMUosSUFBL0IsRUFBcUMsSUFBckM7QUFEZSxTQUFMLENBQXZCLEVBRUlqRCxPQUZKO0FBR0QsT0FKSyxDQUFOO0FBS0Q7QUFDRjs7QUFFWSxRQUFQaUUsT0FBTyxHQUFHO0FBQ2QsVUFBTXFNLHNCQUFzQixHQUFHLEtBQUtuTix3QkFBcEM7QUFDQSxTQUFLQSx3QkFBTCxHQUFnQyxLQUFoQztBQUVBLFVBQU0sSUFBSXBELE9BQUosQ0FBWUMsT0FBTyxJQUFJO0FBQzNCLFdBQUtnQyxRQUFMLENBQWNDLFNBQVMsS0FBSztBQUMxQkgsUUFBQUEsU0FBUyxFQUFFRyxTQUFTLENBQUNILFNBQVYsQ0FBb0JJLFFBQXBCO0FBRGUsT0FBTCxDQUF2QixFQUVJbEMsT0FGSjtBQUdELEtBSkssQ0FBTjs7QUFLQSxRQUFJc1Esc0JBQUosRUFBNEI7QUFDMUIsV0FBSzVOLHNCQUFMLENBQTRCLElBQTVCO0FBQ0Q7QUFDRjs7QUFFRHJCLEVBQUFBLGVBQWUsQ0FBQztBQUFDQyxJQUFBQTtBQUFELE1BQWdCLEVBQWpCLEVBQXFCO0FBQ2xDLFFBQUksQ0FBQyxLQUFLRixLQUFMLENBQVd5RyxjQUFoQixFQUFnQztBQUM5QjtBQUNEOztBQUVELGlDQUFTLG1CQUFULEVBQThCO0FBQzVCc0IsTUFBQUEsT0FBTyxFQUFFLFFBRG1CO0FBRTVCQyxNQUFBQSxTQUFTLEVBQUUsYUFGaUI7QUFHNUI5SCxNQUFBQTtBQUg0QixLQUE5QjtBQU1BLFNBQUtGLEtBQUwsQ0FBV0MsZUFBWDtBQUNEOztBQUVEdUUsRUFBQUEsYUFBYSxDQUFDMkssT0FBRCxFQUFVO0FBQ3JCLFdBQU8sS0FBSzFPLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkMsZ0JBQXJCLE9BQTRDd08sT0FBNUMsR0FBc0QsWUFBdEQsR0FBcUUsRUFBNUU7QUFDRDs7QUFFRHRLLEVBQUFBLG1CQUFtQixDQUFDaEQsSUFBRCxFQUFPa0MsT0FBUCxFQUFnQjtBQUNqQyxTQUFLL0Isa0JBQUwsQ0FBd0JvTixHQUF4QixDQUE0QnZOLElBQTVCLEVBQWtDa0MsT0FBbEM7QUFDRDs7QUFFRHNMLEVBQUFBLFFBQVEsQ0FBQ3RMLE9BQUQsRUFBVTtBQUNoQixXQUFPLEtBQUs3QixPQUFMLENBQWF5QyxHQUFiLENBQWlCMkssSUFBSSxJQUFJQSxJQUFJLENBQUNDLFFBQUwsQ0FBY3hMLE9BQWQsQ0FBekIsRUFBaUR5TCxLQUFqRCxDQUF1RCxLQUF2RCxJQUFnRTVQLFdBQVcsQ0FBQzROLEtBQVosQ0FBa0JpQyxPQUFsRixHQUE0RixJQUFuRztBQUNEOztBQUVEQyxFQUFBQSxRQUFRLENBQUNsQyxLQUFELEVBQVE7QUFDZCxRQUFJQSxLQUFLLEtBQUssS0FBS3pOLFdBQUwsQ0FBaUJ5TixLQUFqQixDQUF1QmlDLE9BQXJDLEVBQThDO0FBQzVDLFdBQUt2TixPQUFMLENBQWF5QyxHQUFiLENBQWlCMkssSUFBSSxJQUFJQSxJQUFJLENBQUM5QixLQUFMLEVBQXpCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFQO0FBQ0Q7O0FBRXFCLFFBQWhCbUMsZ0JBQWdCLENBQUNuQyxLQUFELEVBQVE7QUFDNUIsUUFBSUEsS0FBSyxLQUFLLEtBQUt6TixXQUFMLENBQWlCeU4sS0FBakIsQ0FBdUJpQyxPQUFyQyxFQUE4QztBQUM1QyxVQUFJLE1BQU0sS0FBS3pKLGdCQUFMLEVBQVYsRUFBbUM7QUFDakM7QUFDQSxlQUFPLEtBQUtqRyxXQUFMLENBQWlCeU4sS0FBakIsQ0FBdUJpQyxPQUE5QjtBQUNELE9BSjJDLENBTTVDOzs7QUFDQSxhQUFPRyxvQkFBV0MsVUFBbEI7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRDs7QUFFcUIsUUFBaEJDLGdCQUFnQixDQUFDdEMsS0FBRCxFQUFRO0FBQzVCLFFBQUlBLEtBQUssS0FBS29DLG9CQUFXQyxVQUF6QixFQUFxQztBQUNuQyxZQUFNLEtBQUtwSCxnQkFBTCxFQUFOO0FBQ0EsYUFBTyxLQUFLMUksV0FBTCxDQUFpQnlOLEtBQWpCLENBQXVCaUMsT0FBOUI7QUFDRDs7QUFFRCxRQUFJakMsS0FBSyxLQUFLLEtBQUt6TixXQUFMLENBQWlCeU4sS0FBakIsQ0FBdUJpQyxPQUFyQyxFQUE4QztBQUM1QyxZQUFNLEtBQUt4SixvQkFBTCxFQUFOO0FBQ0EsYUFBTyxLQUFLbEcsV0FBTCxDQUFpQnlOLEtBQWpCLENBQXVCaUMsT0FBOUI7QUFDRDs7QUFFRCxXQUFPLEtBQVA7QUFDRDs7QUFFRC9ELEVBQUFBLFFBQVEsR0FBRztBQUNULFdBQU8sS0FBS3hKLE9BQUwsQ0FBYXlDLEdBQWIsQ0FBaUIySyxJQUFJLElBQUlBLElBQUksQ0FBQ0MsUUFBTCxDQUFjUSxRQUFRLENBQUNDLGFBQXZCLENBQXpCLEVBQWdFUixLQUFoRSxDQUFzRSxLQUF0RSxDQUFQO0FBQ0Q7O0FBRURwTSxFQUFBQSxXQUFXLENBQUNwRCxLQUFELEVBQVE7QUFDakIsV0FBT0EsS0FBSyxDQUFDd0Qsb0JBQU4sSUFBOEIsSUFBOUIsS0FDTHhELEtBQUssQ0FBQ3VCLGVBQU4sQ0FBc0IvQixNQUF0QixHQUErQixDQUEvQixJQUNBUSxLQUFLLENBQUN5QixjQUFOLENBQXFCakMsTUFBckIsR0FBOEIsQ0FEOUIsSUFFQVEsS0FBSyxDQUFDd0IsYUFBTixDQUFvQmhDLE1BQXBCLEdBQTZCLENBSHhCLENBQVA7QUFLRDs7QUE3NEJzRDs7OztnQkFBcENJLFcsZUFDQTtBQUNqQjJCLEVBQUFBLGVBQWUsRUFBRTBPLG1CQUFVQyxPQUFWLENBQWtCQyxpQ0FBbEIsRUFBeUNDLFVBRHpDO0FBRWpCNU8sRUFBQUEsYUFBYSxFQUFFeU8sbUJBQVVDLE9BQVYsQ0FBa0JDLGlDQUFsQixFQUF5Q0MsVUFGdkM7QUFHakIzTyxFQUFBQSxjQUFjLEVBQUV3TyxtQkFBVUMsT0FBVixDQUFrQkcscUNBQWxCLENBSEM7QUFJakI3TSxFQUFBQSxvQkFBb0IsRUFBRXlNLG1CQUFVSyxNQUpmO0FBS2pCbk0sRUFBQUEsa0JBQWtCLEVBQUU4TCxtQkFBVU0sTUFMYjtBQU1qQjlKLEVBQUFBLGNBQWMsRUFBRXdKLG1CQUFVTyxJQUFWLENBQWVKLFVBTmQ7QUFPakI3SyxFQUFBQSxRQUFRLEVBQUUwSyxtQkFBVU0sTUFBVixDQUFpQkgsVUFQVjtBQVFqQnZDLEVBQUFBLG1CQUFtQixFQUFFb0MsbUJBQVVNLE1BQVYsQ0FBaUJILFVBUnJCO0FBU2pCbk4sRUFBQUEsU0FBUyxFQUFFZ04sbUJBQVVNLE1BQVYsQ0FBaUJILFVBVFg7QUFVakJ0SSxFQUFBQSxTQUFTLEVBQUVtSSxtQkFBVVEsSUFBVixDQUFlTCxVQVZUO0FBV2pCNVAsRUFBQUEseUJBQXlCLEVBQUV5UCxtQkFBVVEsSUFBVixDQUFlTCxVQVh6QjtBQVlqQmpJLEVBQUFBLDZCQUE2QixFQUFFOEgsbUJBQVVRLElBQVYsQ0FBZUwsVUFaN0I7QUFhakJuUSxFQUFBQSxlQUFlLEVBQUVnUSxtQkFBVVEsSUFBVixDQUFlTCxVQWJmO0FBY2pCeEgsRUFBQUEsd0JBQXdCLEVBQUVxSCxtQkFBVVEsSUFBVixDQUFlTCxVQWR4QjtBQWVqQnhGLEVBQUFBLGFBQWEsRUFBRXFGLG1CQUFVUSxJQUFWLENBQWVMLFVBZmI7QUFnQmpCdkYsRUFBQUEsZUFBZSxFQUFFb0YsbUJBQVVRLElBQVYsQ0FBZUw7QUFoQmYsQzs7Z0JBREF4USxXLGtCQW9CRztBQUNwQjZCLEVBQUFBLGNBQWMsRUFBRSxFQURJO0FBRXBCMEMsRUFBQUEsa0JBQWtCLEVBQUUsSUFBSXVNLDJCQUFKO0FBRkEsQzs7Z0JBcEJIOVEsVyxXQXlCSjtBQUNiNlAsRUFBQUEsT0FBTyxFQUFFa0IsTUFBTSxDQUFDLFNBQUQ7QUFERixDOztnQkF6QkkvUSxXLGdCQTZCQ0EsV0FBVyxDQUFDNE4sS0FBWixDQUFrQmlDLE87O2dCQTdCbkI3UCxXLGVBK0JBQSxXQUFXLENBQUM0TixLQUFaLENBQWtCaUMsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5jb25zdCB7TWVudSwgTWVudUl0ZW19ID0gcmVtb3RlO1xuaW1wb3J0IHtGaWxlfSBmcm9tICdhdG9tJztcbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RmlsZVBhdGNoSXRlbVByb3BUeXBlLCBNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBGaWxlUGF0Y2hMaXN0SXRlbVZpZXcgZnJvbSAnLi9maWxlLXBhdGNoLWxpc3QtaXRlbS12aWV3JztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3IGZyb20gJy4vbWVyZ2UtY29uZmxpY3QtbGlzdC1pdGVtLXZpZXcnO1xuaW1wb3J0IENvbXBvc2l0ZUxpc3RTZWxlY3Rpb24gZnJvbSAnLi4vbW9kZWxzL2NvbXBvc2l0ZS1saXN0LXNlbGVjdGlvbic7XG5pbXBvcnQgUmVzb2x1dGlvblByb2dyZXNzIGZyb20gJy4uL21vZGVscy9jb25mbGljdHMvcmVzb2x1dGlvbi1wcm9ncmVzcyc7XG5pbXBvcnQgQ29tbWl0VmlldyBmcm9tICcuL2NvbW1pdC12aWV3JztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IENoYW5nZWRGaWxlSXRlbSBmcm9tICcuLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbSc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBkZWJvdW5jZSA9IChmbiwgd2FpdCkgPT4ge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKGZuKC4uLmFyZ3MpKTtcbiAgICAgIH0sIHdhaXQpO1xuICAgIH0pO1xuICB9O1xufTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMobGlzdHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RzKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgY29uc3QgbGlzdCA9IGxpc3RzW2tleV07XG4gICAgYWNjLnNvdXJjZVtrZXldID0gbGlzdDtcbiAgICBpZiAobGlzdC5sZW5ndGggPD0gTUFYSU1VTV9MSVNURURfRU5UUklFUykge1xuICAgICAgYWNjW2tleV0gPSBsaXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2Nba2V5XSA9IGxpc3Quc2xpY2UoMCwgTUFYSU1VTV9MSVNURURfRU5UUklFUyk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH0sIHtzb3VyY2U6IHt9fSk7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7IH07XG5cbmNvbnN0IE1BWElNVU1fTElTVEVEX0VOVFJJRVMgPSAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnaW5nVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdW5zdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlKSxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNPdXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc1RoZWlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbWVyZ2VDb25mbGljdHM6IFtdLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogbmV3IFJlc29sdXRpb25Qcm9ncmVzcygpLFxuICB9XG5cbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIFNUQUdJTkc6IFN5bWJvbCgnc3RhZ2luZycpLFxuICB9O1xuXG4gIHN0YXRpYyBmaXJzdEZvY3VzID0gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORztcblxuICBzdGF0aWMgbGFzdEZvY3VzID0gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORztcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnZGJsY2xpY2tPbkl0ZW0nLCAnY29udGV4dE1lbnVPbkl0ZW0nLCAnbW91c2Vkb3duT25JdGVtJywgJ21vdXNlbW92ZU9uSXRlbScsICdtb3VzZXVwJywgJ3JlZ2lzdGVySXRlbUVsZW1lbnQnLFxuICAgICAgJ3JlbmRlckJvZHknLCAnb3BlbkZpbGUnLCAnZGlzY2FyZENoYW5nZXMnLCAnYWN0aXZhdGVOZXh0TGlzdCcsICdhY3RpdmF0ZVByZXZpb3VzTGlzdCcsICdhY3RpdmF0ZUxhc3RMaXN0JyxcbiAgICAgICdzdGFnZUFsbCcsICd1bnN0YWdlQWxsJywgJ3N0YWdlQWxsTWVyZ2VDb25mbGljdHMnLCAnZGlzY2FyZEFsbCcsICdjb25maXJtU2VsZWN0ZWRJdGVtcycsICdzZWxlY3RBbGwnLFxuICAgICAgJ3NlbGVjdEZpcnN0JywgJ3NlbGVjdExhc3QnLCAnZGl2ZUludG9TZWxlY3Rpb24nLCAnc2hvd0RpZmZWaWV3JywgJ3Nob3dCdWxrUmVzb2x2ZU1lbnUnLCAnc2hvd0FjdGlvbnNNZW51JyxcbiAgICAgICdyZXNvbHZlQ3VycmVudEFzT3VycycsICdyZXNvbHZlQ3VycmVudEFzVGhlaXJzJywgJ3F1aWV0bHlTZWxlY3RJdGVtJywgJ2RpZENoYW5nZVNlbGVjdGVkSXRlbXMnLFxuICAgICk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2dpdGh1Yi5rZXlib2FyZE5hdmlnYXRpb25EZWxheScsIHZhbHVlID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0gPSB0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0gPSBkZWJvdW5jZSh0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXMsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAuLi5jYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyh7XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlczogdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMsXG4gICAgICAgIHN0YWdlZENoYW5nZXM6IHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgbWVyZ2VDb25mbGljdHM6IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMsXG4gICAgICB9KSxcbiAgICAgIHNlbGVjdGlvbjogbmV3IENvbXBvc2l0ZUxpc3RTZWxlY3Rpb24oe1xuICAgICAgICBsaXN0c0J5S2V5OiBbXG4gICAgICAgICAgWyd1bnN0YWdlZCcsIHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgICBbJ2NvbmZsaWN0cycsIHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHNdLFxuICAgICAgICAgIFsnc3RhZ2VkJywgdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgXSxcbiAgICAgICAgaWRGb3JJdGVtOiBpdGVtID0+IGl0ZW0uZmlsZVBhdGgsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbSA9IG5ldyBXZWFrTWFwKCk7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhuZXh0UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGxldCBuZXh0U3RhdGUgPSB7fTtcblxuICAgIGlmIChcbiAgICAgIFsndW5zdGFnZWRDaGFuZ2VzJywgJ3N0YWdlZENoYW5nZXMnLCAnbWVyZ2VDb25mbGljdHMnXS5zb21lKGtleSA9PiBwcmV2U3RhdGUuc291cmNlW2tleV0gIT09IG5leHRQcm9wc1trZXldKVxuICAgICkge1xuICAgICAgY29uc3QgbmV4dExpc3RzID0gY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMoe1xuICAgICAgICB1bnN0YWdlZENoYW5nZXM6IG5leHRQcm9wcy51bnN0YWdlZENoYW5nZXMsXG4gICAgICAgIHN0YWdlZENoYW5nZXM6IG5leHRQcm9wcy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBtZXJnZUNvbmZsaWN0czogbmV4dFByb3BzLm1lcmdlQ29uZmxpY3RzLFxuICAgICAgfSk7XG5cbiAgICAgIG5leHRTdGF0ZSA9IHtcbiAgICAgICAgLi4ubmV4dExpc3RzLFxuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24udXBkYXRlTGlzdHMoW1xuICAgICAgICAgIFsndW5zdGFnZWQnLCBuZXh0TGlzdHMudW5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgICBbJ2NvbmZsaWN0cycsIG5leHRMaXN0cy5tZXJnZUNvbmZsaWN0c10sXG4gICAgICAgICAgWydzdGFnZWQnLCBuZXh0TGlzdHMuc3RhZ2VkQ2hhbmdlc10sXG4gICAgICAgIF0pLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNldXApO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCkpLFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3luY1dpdGhXb3Jrc3BhY2UoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc1BvcHVsYXRlZCh0aGlzLnByb3BzKSkge1xuICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGNvbnN0IGlzUmVwb1NhbWUgPSBwcmV2UHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGggPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgY29uc3QgaGFzU2VsZWN0aW9uc1ByZXNlbnQgPVxuICAgICAgcHJldlN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDAgJiZcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMDtcbiAgICBjb25zdCBzZWxlY3Rpb25DaGFuZ2VkID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24gIT09IHByZXZTdGF0ZS5zZWxlY3Rpb247XG5cbiAgICBpZiAoaXNSZXBvU2FtZSAmJiBoYXNTZWxlY3Rpb25zUHJlc2VudCAmJiBzZWxlY3Rpb25DaGFuZ2VkKSB7XG4gICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRJdGVtID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0SGVhZEl0ZW0oKTtcbiAgICBpZiAoaGVhZEl0ZW0pIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbS5nZXQoaGVhZEl0ZW0pO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzUG9wdWxhdGVkKHByZXZQcm9wcykgJiYgdGhpcy5pc1BvcHVsYXRlZCh0aGlzLnByb3BzKSkge1xuICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9IGZldGNoRGF0YT17bm9vcH0+XG4gICAgICAgIHt0aGlzLnJlbmRlckJvZHl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQm9keSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfVxuICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXcgJHt0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCl9LWNoYW5nZXMtZm9jdXNlZGB9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLVVuc3RhZ2VkQ2hhbmdlcyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygndW5zdGFnZWQnKX1gfT5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1saXN0LXVub3JkZXJlZFwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctdGl0bGVcIj5VbnN0YWdlZCBDaGFuZ2VzPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQWN0aW9uc01lbnUoKX1cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBpY29uIGljb24tbW92ZS1kb3duXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zdGFnZUFsbH0+U3RhZ2UgQWxsPC9idXR0b24+XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctbGlzdCBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgZ2l0aHViLVN0YWdpbmdWaWV3LXVuc3RhZ2VkXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUudW5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gKFxuICAgICAgICAgICAgICAgIDxGaWxlUGF0Y2hMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgIGtleT17ZmlsZVBhdGNoLmZpbGVQYXRofVxuICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgZmlsZVBhdGNoPXtmaWxlUGF0Y2h9XG4gICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZSh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJNZXJnZUNvbmZsaWN0cygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItU3RhZ2VkQ2hhbmdlcyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygnc3RhZ2VkJyl9YH0gPlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRhc2tsaXN0XCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICBTdGFnZWQgQ2hhbmdlc1xuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLXVwXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudW5zdGFnZUFsbH0+VW5zdGFnZSBBbGw8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctc3RhZ2VkXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RhZ2VkQ2hhbmdlcy5tYXAoZmlsZVBhdGNoID0+IChcbiAgICAgICAgICAgICAgICA8RmlsZVBhdGNoTGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICBrZXk9e2ZpbGVQYXRjaC5maWxlUGF0aH1cbiAgICAgICAgICAgICAgICAgIGZpbGVQYXRjaD17ZmlsZVBhdGNofVxuICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMoZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRydW5jYXRlZE1lc3NhZ2UodGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLVN0YWdpbmdWaWV3XCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS11cFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdFByZXZpb3VzKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS1kb3duXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0TmV4dCgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtbGVmdFwiIGNhbGxiYWNrPXt0aGlzLmRpdmVJbnRvU2VsZWN0aW9ufSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy1kaWZmLXZpZXdcIiBjYWxsYmFjaz17dGhpcy5zaG93RGlmZlZpZXd9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXVwXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0UHJldmlvdXModHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LWRvd25cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3ROZXh0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC1hbGxcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RBbGx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS10by10b3BcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RGaXJzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXRvLWJvdHRvbVwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdExhc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXRvLXRvcFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdEZpcnN0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC10by1ib3R0b21cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RMYXN0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiBjYWxsYmFjaz17dGhpcy5jb25maXJtU2VsZWN0ZWRJdGVtc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFjdGl2YXRlLW5leHQtbGlzdFwiIGNhbGxiYWNrPXt0aGlzLmFjdGl2YXRlTmV4dExpc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjphY3RpdmF0ZS1wcmV2aW91cy1saXN0XCIgY2FsbGJhY2s9e3RoaXMuYWN0aXZhdGVQcmV2aW91c0xpc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpqdW1wLXRvLWZpbGVcIiBjYWxsYmFjaz17dGhpcy5vcGVuRmlsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtZmlsZS1hcy1vdXJzXCIgY2FsbGJhY2s9e3RoaXMucmVzb2x2ZUN1cnJlbnRBc091cnN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpyZXNvbHZlLWZpbGUtYXMtdGhlaXJzXCIgY2FsbGJhY2s9e3RoaXMucmVzb2x2ZUN1cnJlbnRBc1RoZWlyc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpc2NhcmQtY2hhbmdlcy1pbi1zZWxlY3RlZC1maWxlc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRDaGFuZ2VzRnJvbUNvbW1hbmR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6dW5kb1wiIGNhbGxiYWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kb30gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3RhZ2UtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy5zdGFnZUFsbH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnVuc3RhZ2UtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy51bnN0YWdlQWxsfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGlzY2FyZC1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRBbGxGcm9tQ29tbWFuZH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnVuZG8tbGFzdC1kaXNjYXJkLWluLWdpdC10YWJcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyA9ICgpID0+IHtcbiAgICB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnY29yZTp1bmRvJ319KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6dW5kby1sYXN0LWRpc2NhcmQtaW4tZ2l0LXRhYid9fSk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21IZWFkZXJNZW51ID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pO1xuICB9XG5cbiAgZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2NhcmRDaGFuZ2VzKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6ZGlzY2FyZC1jaGFuZ2VzLWluLXNlbGVjdGVkLWZpbGVzJ319KTtcbiAgfVxuXG4gIGRpc2NhcmRBbGxGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2NhcmRBbGwoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLWFsbC1jaGFuZ2VzJ319KTtcbiAgfVxuXG4gIHJlbmRlckFjdGlvbnNNZW51KCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggfHwgdGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbi0taWNvbk9ubHkgaWNvbiBpY29uLWVsbGlwc2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNob3dBY3Rpb25zTWVudX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclVuZG9CdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uLS1mdWxsV2lkdGggaWNvbiBpY29uLWhpc3RvcnlcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b259PlVuZG8gRGlzY2FyZDwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKGxpc3QpIHtcbiAgICBpZiAobGlzdC5sZW5ndGggPiBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cC10cnVuY2F0ZWRNc2dcIj5cbiAgICAgICAgICBMaXN0IHRydW5jYXRlZCB0byB0aGUgZmlyc3Qge01BWElNVU1fTElTVEVEX0VOVFJJRVN9IGl0ZW1zXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTWVyZ2VDb25mbGljdHMoKSB7XG4gICAgY29uc3QgbWVyZ2VDb25mbGljdHMgPSB0aGlzLnN0YXRlLm1lcmdlQ29uZmxpY3RzO1xuXG4gICAgaWYgKG1lcmdlQ29uZmxpY3RzICYmIG1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgICBjb25zdCByZXNvbHV0aW9uUHJvZ3Jlc3MgPSB0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzcztcbiAgICAgIGNvbnN0IGFueVVucmVzb2x2ZWQgPSBtZXJnZUNvbmZsaWN0c1xuICAgICAgICAubWFwKGNvbmZsaWN0ID0+IHBhdGguam9pbih0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLCBjb25mbGljdC5maWxlUGF0aCkpXG4gICAgICAgIC5zb21lKGNvbmZsaWN0UGF0aCA9PiByZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGNvbmZsaWN0UGF0aCkgIT09IDApO1xuXG4gICAgICBjb25zdCBidWxrUmVzb2x2ZURyb3Bkb3duID0gYW55VW5yZXNvbHZlZCA/IChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgaWNvbiBpY29uLWVsbGlwc2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNob3dCdWxrUmVzb2x2ZU1lbnV9XG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLU1lcmdlQ29uZmxpY3RQYXRocyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygnY29uZmxpY3RzJyl9YH0+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tYWxlcnQgc3RhdHVzLW1vZGlmaWVkJ30gLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPk1lcmdlIENvbmZsaWN0czwvc3Bhbj5cbiAgICAgICAgICAgIHtidWxrUmVzb2x2ZURyb3Bkb3dufVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLWRvd25cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17YW55VW5yZXNvbHZlZH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zdGFnZUFsbE1lcmdlQ29uZmxpY3RzfT5cbiAgICAgICAgICAgICAgU3RhZ2UgQWxsXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctbWVyZ2VcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWVyZ2VDb25mbGljdHMubWFwKG1lcmdlQ29uZmxpY3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIG1lcmdlQ29uZmxpY3QuZmlsZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICAgIGtleT17ZnVsbFBhdGh9XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlQ29uZmxpY3Q9e21lcmdlQ29uZmxpY3R9XG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0NvbmZsaWN0cz17cmVzb2x1dGlvblByb2dyZXNzLmdldFJlbWFpbmluZyhmdWxsUGF0aCl9XG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVySXRlbUVsZW1lbnQ9e3RoaXMucmVnaXN0ZXJJdGVtRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMobWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZShtZXJnZUNvbmZsaWN0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxub3NjcmlwdCAvPjtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSwgaXRlbSA9PiBpdGVtLmZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpICE9PSAnY29uZmxpY3RzJykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgfVxuXG4gIG9wZW5GaWxlKCkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGVzKGZpbGVQYXRocyk7XG4gIH1cblxuICBkaXNjYXJkQ2hhbmdlcyh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIGFkZEV2ZW50KCdkaXNjYXJkLXVuc3RhZ2VkLWNoYW5nZXMnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGZpbGVDb3VudDogZmlsZVBhdGhzLmxlbmd0aCxcbiAgICAgIHR5cGU6ICdzZWxlY3RlZCcsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgYWN0aXZhdGVOZXh0TGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgYWR2YW5jZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZU5leHRTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBhZHZhbmNlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBuZXh0LmNvYWxlc2NlKCl9O1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZShhZHZhbmNlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWN0aXZhdGVQcmV2aW91c0xpc3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IHJldHJlYXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZVByZXZpb3VzU2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChwcmV2U3RhdGUuc2VsZWN0aW9uID09PSBuZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0cmVhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IG5leHQuY29hbGVzY2UoKX07XG4gICAgICB9LCAoKSA9PiByZXNvbHZlKHJldHJlYXRlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWN0aXZhdGVMYXN0TGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgZW1wdHlTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uYWN0aXZhdGVMYXN0U2VsZWN0aW9uKCk7XG4gICAgICAgIGVtcHR5U2VsZWN0aW9uID0gbmV4dC5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDA7XG5cbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogbmV4dC5jb2FsZXNjZSgpfTtcbiAgICAgIH0sICgpID0+IHJlc29sdmUoZW1wdHlTZWxlY3Rpb24pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YWdlQWxsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24oJ3Vuc3RhZ2VkJyk7XG4gIH1cblxuICB1bnN0YWdlQWxsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uKCdzdGFnZWQnKTtcbiAgfVxuXG4gIHN0YWdlQWxsTWVyZ2VDb25mbGljdHMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5tYXAoY29uZmxpY3QgPT4gY29uZmxpY3QuZmlsZVBhdGgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oZmlsZVBhdGhzLCAndW5zdGFnZWQnKTtcbiAgfVxuXG4gIGRpc2NhcmRBbGwoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gZmlsZVBhdGNoLmZpbGVQYXRoKTtcbiAgICBhZGRFdmVudCgnZGlzY2FyZC11bnN0YWdlZC1jaGFuZ2VzJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBmaWxlQ291bnQ6IGZpbGVQYXRocy5sZW5ndGgsXG4gICAgICB0eXBlOiAnYWxsJyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocyk7XG4gIH1cblxuICBjb25maXJtU2VsZWN0ZWRJdGVtcyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpdGVtUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIGF3YWl0IHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihpdGVtUGF0aHMsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe3NlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5jb2FsZXNjZSgpfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXROZXh0VXBkYXRlUHJvbWlzZSgpO1xuICB9XG5cbiAgc2VsZWN0UHJldmlvdXMocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0UHJldmlvdXNJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdE5leHQocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0TmV4dEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RBbGxJdGVtcygpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RGaXJzdChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RGaXJzdEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0TGFzdChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RMYXN0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkaXZlSW50b1NlbGVjdGlvbigpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLnNpemUgIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuXG4gICAgaWYgKHN0YWdpbmdTdGF0dXMgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB7YWN0aXZhdGU6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge2FjdGl2YXRlOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3luY1dpdGhXb3Jrc3BhY2UoKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVhbEl0ZW1Qcm9taXNlID0gaXRlbS5nZXRSZWFsSXRlbVByb21pc2UgJiYgaXRlbS5nZXRSZWFsSXRlbVByb21pc2UoKTtcbiAgICBjb25zdCByZWFsSXRlbSA9IGF3YWl0IHJlYWxJdGVtUHJvbWlzZTtcbiAgICBpZiAoIXJlYWxJdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNGaWxlUGF0Y2hJdGVtID0gcmVhbEl0ZW0uaXNGaWxlUGF0Y2hJdGVtICYmIHJlYWxJdGVtLmlzRmlsZVBhdGNoSXRlbSgpO1xuICAgIGNvbnN0IGlzTWF0Y2ggPSByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5ICYmIHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkoKSA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcblxuICAgIGlmIChpc0ZpbGVQYXRjaEl0ZW0gJiYgaXNNYXRjaCkge1xuICAgICAgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShyZWFsSXRlbS5nZXRGaWxlUGF0aCgpLCByZWFsSXRlbS5nZXRTdGFnaW5nU3RhdHVzKCkpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNob3dEaWZmVmlldygpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLnNpemUgIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuXG4gICAgaWYgKHN0YWdpbmdTdGF0dXMgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0J1bGtSZXNvbHZlTWVudShldmVudCkge1xuICAgIGNvbnN0IGNvbmZsaWN0UGF0aHMgPSB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLm1hcChjID0+IGMuZmlsZVBhdGgpO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBBbGwgYXMgT3VycycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzKGNvbmZsaWN0UGF0aHMpLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1Jlc29sdmUgQWxsIGFzIFRoZWlycycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnMoY29uZmxpY3RQYXRocyksXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHNob3dBY3Rpb25zTWVudShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbUNvdW50ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemU7XG4gICAgY29uc3QgcGx1cmFsaXphdGlvbiA9IHNlbGVjdGVkSXRlbUNvdW50ID4gMSA/ICdzJyA6ICcnO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnRGlzY2FyZCBBbGwgQ2hhbmdlcycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5kaXNjYXJkQWxsKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pLFxuICAgICAgZW5hYmxlZDogdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMCxcbiAgICB9KSk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdEaXNjYXJkIENoYW5nZXMgaW4gU2VsZWN0ZWQgRmlsZScgKyBwbHVyYWxpemF0aW9uLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZGlzY2FyZENoYW5nZXMoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSksXG4gICAgICBlbmFibGVkOiAhISh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggJiYgc2VsZWN0ZWRJdGVtQ291bnQpLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1VuZG8gTGFzdCBEaXNjYXJkJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KSxcbiAgICAgIGVuYWJsZWQ6IHRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnksXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHJlc29sdmVDdXJyZW50QXNPdXJzKCkge1xuICAgIHRoaXMucHJvcHMucmVzb2x2ZUFzT3Vycyh0aGlzLmdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpKTtcbiAgfVxuXG4gIHJlc29sdmVDdXJyZW50QXNUaGVpcnMoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnModGhpcy5nZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMoKSk7XG4gIH1cblxuICAvLyBEaXJlY3RseSBtb2RpZnkgdGhlIHNlbGVjdGlvbiB0byBpbmNsdWRlIG9ubHkgdGhlIGl0ZW0gaWRlbnRpZmllZCBieSB0aGUgZmlsZSBwYXRoIGFuZCBzdGFnaW5nU3RhdHVzIHR1cGxlLlxuICAvLyBSZS1yZW5kZXIgdGhlIGNvbXBvbmVudCwgYnV0IGRvbid0IG5vdGlmeSBkaWRTZWxlY3RTaW5nbGVJdGVtKCkgb3Igb3RoZXIgY2FsbGJhY2sgZnVuY3Rpb25zLiBUaGlzIGlzIHVzZWZ1bCB0b1xuICAvLyBhdm9pZCBjaXJjdWxhciBjYWxsYmFjayBsb29wcyBmb3IgYWN0aW9ucyBvcmlnaW5hdGluZyBpbiBGaWxlUGF0Y2hWaWV3IG9yIFRleHRFZGl0b3JzIHdpdGggbWVyZ2UgY29uZmxpY3RzLlxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uZmluZEl0ZW0oKGVhY2gsIGtleSkgPT4gZWFjaC5maWxlUGF0aCA9PT0gZmlsZVBhdGggJiYga2V5ID09PSBzdGFnaW5nU3RhdHVzKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgLy8gRklYTUU6IG1ha2Ugc3RhZ2luZyB2aWV3IGRpc3BsYXkgbm8gc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5sb2coYFVuYWJsZSB0byBmaW5kIGl0ZW0gYXQgcGF0aCAke2ZpbGVQYXRofSB3aXRoIHN0YWdpbmcgc3RhdHVzICR7c3RhZ2luZ1N0YXR1c31gKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSl9O1xuICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEl0ZW1zKCkge1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLCBpdGVtID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZpbGVQYXRoOiBpdGVtLmZpbGVQYXRoLFxuICAgICAgICBzdGFnaW5nU3RhdHVzLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpZENoYW5nZVNlbGVjdGVkSXRlbXMob3Blbk5ldykge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLmRpZFNlbGVjdFNpbmdsZUl0ZW0oc2VsZWN0ZWRJdGVtc1swXSwgb3Blbk5ldyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlkU2VsZWN0U2luZ2xlSXRlbShzZWxlY3RlZEl0ZW0sIG9wZW5OZXcgPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIGlmIChvcGVuTmV3KSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHthY3RpdmF0ZTogdHJ1ZX0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3Blbk5ldykge1xuICAgICAgICAvLyBVc2VyIGV4cGxpY2l0bHkgYXNrZWQgdG8gdmlldyBkaWZmLCBzdWNoIGFzIHZpYSBjbGlja1xuICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7YWN0aXZhdGU6IGZhbHNlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwYW5lc1dpdGhTdGFsZUl0ZW1zVG9VcGRhdGUgPSB0aGlzLmdldFBhbmVzV2l0aFN0YWxlUGVuZGluZ0ZpbGVQYXRjaEl0ZW0oKTtcbiAgICAgICAgaWYgKHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIHN0YWxlIGl0ZW1zIHRvIHJlZmxlY3QgbmV3IHNlbGVjdGlvblxuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZS5tYXAoYXN5bmMgcGFuZSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7XG4gICAgICAgICAgICAgIGFjdGl2YXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgcGFuZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZWxlY3Rpb24gd2FzIGNoYW5nZWQgdmlhIGtleWJvYXJkIG5hdmlnYXRpb24sIHVwZGF0ZSBwZW5kaW5nIGl0ZW0gaW4gYWN0aXZlIHBhbmVcbiAgICAgICAgICBjb25zdCBhY3RpdmVQYW5lID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBlbmRpbmdJdGVtID0gYWN0aXZlUGFuZS5nZXRQZW5kaW5nSXRlbSgpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBhbmVIYXNQZW5kaW5nRmlsZVBhdGNoSXRlbSA9IGFjdGl2ZVBlbmRpbmdJdGVtICYmIGFjdGl2ZVBlbmRpbmdJdGVtLmdldFJlYWxJdGVtICYmXG4gICAgICAgICAgICBhY3RpdmVQZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSgpIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtO1xuICAgICAgICAgIGlmIChhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHtcbiAgICAgICAgICAgICAgYWN0aXZhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICBwYW5lOiBhY3RpdmVQYW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSgpIHtcbiAgICAvLyBcInN0YWxlXCIgbWVhbmluZyB0aGVyZSBpcyBubyBsb25nZXIgYSBjaGFuZ2VkIGZpbGUgYXNzb2NpYXRlZCB3aXRoIGl0ZW1cbiAgICAvLyBkdWUgdG8gY2hhbmdlcyBiZWluZyBmdWxseSBzdGFnZWQvdW5zdGFnZWQvc3Rhc2hlZC9kZWxldGVkL2V0Y1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRQYW5lcygpLmZpbHRlcihwYW5lID0+IHtcbiAgICAgIGNvbnN0IHBlbmRpbmdJdGVtID0gcGFuZS5nZXRQZW5kaW5nSXRlbSgpO1xuICAgICAgaWYgKCFwZW5kaW5nSXRlbSB8fCAhcGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBjb25zdCByZWFsSXRlbSA9IHBlbmRpbmdJdGVtLmdldFJlYWxJdGVtKCk7XG4gICAgICBpZiAoIShyZWFsSXRlbSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gV2Ugb25seSB3YW50IHRvIHVwZGF0ZSBwZW5kaW5nIGRpZmYgdmlld3MgZm9yIGN1cnJlbnRseSBhY3RpdmUgcmVwb1xuICAgICAgY29uc3QgaXNJbkFjdGl2ZVJlcG8gPSByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5KCkgPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgICBjb25zdCBpc1N0YWxlID0gIXRoaXMuY2hhbmdlZEZpbGVFeGlzdHMocmVhbEl0ZW0uZ2V0RmlsZVBhdGgoKSwgcmVhbEl0ZW0uZ2V0U3RhZ2luZ1N0YXR1cygpKTtcbiAgICAgIHJldHVybiBpc0luQWN0aXZlUmVwbyAmJiBpc1N0YWxlO1xuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlZEZpbGVFeGlzdHMoZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZmluZEl0ZW0oKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIGtleSA9PT0gc3RhZ2luZ1N0YXR1cyAmJiBpdGVtLmZpbGVQYXRoID09PSBmaWxlUGF0aDtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNob3dGaWxlUGF0Y2hJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzLCB7YWN0aXZhdGUsIHBhbmV9ID0ge2FjdGl2YXRlOiBmYWxzZX0pIHtcbiAgICBjb25zdCB1cmkgPSBDaGFuZ2VkRmlsZUl0ZW0uYnVpbGRVUkkoZmlsZVBhdGgsIHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICAgIGNvbnN0IGNoYW5nZWRGaWxlSXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICB1cmksIHtwZW5kaW5nOiB0cnVlLCBhY3RpdmF0ZVBhbmU6IGFjdGl2YXRlLCBhY3RpdmF0ZUl0ZW06IGFjdGl2YXRlLCBwYW5lfSxcbiAgICApO1xuICAgIGlmIChhY3RpdmF0ZSkge1xuICAgICAgY29uc3QgaXRlbVJvb3QgPSBjaGFuZ2VkRmlsZUl0ZW0uZ2V0RWxlbWVudCgpO1xuICAgICAgY29uc3QgZm9jdXNSb290ID0gaXRlbVJvb3QucXVlcnlTZWxlY3RvcignW3RhYkluZGV4XScpO1xuICAgICAgaWYgKGZvY3VzUm9vdCkge1xuICAgICAgICBmb2N1c1Jvb3QuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2ltcGx5IG1ha2UgaXRlbSB2aXNpYmxlXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5wYW5lRm9ySXRlbShjaGFuZ2VkRmlsZUl0ZW0pLmFjdGl2YXRlSXRlbShjaGFuZ2VkRmlsZUl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgocmVsYXRpdmVGaWxlUGF0aCwge2FjdGl2YXRlfSA9IHthY3RpdmF0ZTogZmFsc2V9KSB7XG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIHJlbGF0aXZlRmlsZVBhdGgpO1xuICAgIGlmIChhd2FpdCB0aGlzLmZpbGVFeGlzdHMoYWJzb2x1dGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oYWJzb2x1dGVQYXRoLCB7YWN0aXZhdGVQYW5lOiBhY3RpdmF0ZSwgYWN0aXZhdGVJdGVtOiBhY3RpdmF0ZSwgcGVuZGluZzogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkSW5mbygnRmlsZSBoYXMgYmVlbiBkZWxldGVkLicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgZmlsZUV4aXN0cyhhYnNvbHV0ZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IEZpbGUoYWJzb2x1dGVQYXRoKS5leGlzdHMoKTtcbiAgfVxuXG4gIGRibGNsaWNrT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihbaXRlbS5maWxlUGF0aF0sIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmxpc3RLZXlGb3JJdGVtKGl0ZW0pKTtcbiAgfVxuXG4gIGFzeW5jIGNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuaGFzKGl0ZW0pKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgZXZlbnQuc2hpZnRLZXkpLFxuICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudChldmVudC50eXBlLCBldmVudCk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50LnRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQobmV3RXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2Vkb3duT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgY29uc3Qgd2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgIXdpbmRvd3MpIHsgcmV0dXJuOyB9IC8vIHNpbXBseSBvcGVuIGNvbnRleHQgbWVudVxuICAgIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGlmIChldmVudC5tZXRhS2V5IHx8IChldmVudC5jdHJsS2V5ICYmIHdpbmRvd3MpKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5hZGRPclN1YnRyYWN0U2VsZWN0aW9uKGl0ZW0pLFxuICAgICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgZXZlbnQuc2hpZnRLZXkpLFxuICAgICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgaWYgKHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCB0cnVlKSxcbiAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2V1cCgpIHtcbiAgICBjb25zdCBoYWRTZWxlY3Rpb25JblByb2dyZXNzID0gdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3M7XG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gICAgaWYgKGhhZFNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyh0cnVlKTtcbiAgICB9XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYWRkRXZlbnQoJ3VuZG8tbGFzdC1kaXNjYXJkJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkKCk7XG4gIH1cblxuICBnZXRGb2N1c0NsYXNzKGxpc3RLZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpID09PSBsaXN0S2V5ID8gJ2lzLWZvY3VzZWQnIDogJyc7XG4gIH1cblxuICByZWdpc3Rlckl0ZW1FbGVtZW50KGl0ZW0sIGVsZW1lbnQpIHtcbiAgICB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbS5zZXQoaXRlbSwgZWxlbWVudCk7XG4gIH1cblxuICBnZXRGb2N1cyhlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkgPyBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HIDogbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkcpIHtcbiAgICAgIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmZvY3VzKCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HKSB7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5hY3RpdmF0ZU5leHRMaXN0KCkpIHtcbiAgICAgICAgLy8gVGhlcmUgd2FzIGEgbmV4dCBsaXN0IHRvIGFjdGl2YXRlLlxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSB3ZXJlIGFscmVhZHkgb24gdGhlIGxhc3QgbGlzdC5cbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZpcnN0Rm9jdXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhc3luYyByZXRyZWF0Rm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZpcnN0Rm9jdXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGVMYXN0TGlzdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORykge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZVByZXZpb3VzTGlzdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGlzUG9wdWxhdGVkKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoICE9IG51bGwgJiYgKFxuICAgICAgcHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA+IDAgfHxcbiAgICAgIHByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDAgfHxcbiAgICAgIHByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMFxuICAgICk7XG4gIH1cbn1cbiJdfQ==