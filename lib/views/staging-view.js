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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
  }

  // Directly modify the selection to include only the item identified by the file path and stagingStatus tuple.
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
      }
      // We only want to update pending diff views for currently active repo
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
      }

      // We were already on the last list.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2VsZWN0cm9uIiwiX2F0b20iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wcm9wVHlwZXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3BhdGgiLCJfcHJvcFR5cGVzMiIsIl9maWxlUGF0Y2hMaXN0SXRlbVZpZXciLCJfb2JzZXJ2ZU1vZGVsIiwiX21lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXciLCJfY29tcG9zaXRlTGlzdFNlbGVjdGlvbiIsIl9yZXNvbHV0aW9uUHJvZ3Jlc3MiLCJfY29tbWl0VmlldyIsIl9yZWZIb2xkZXIiLCJfY2hhbmdlZEZpbGVJdGVtIiwiX2NvbW1hbmRzIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9scyIsImZpbHRlciIsInN5bSIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsIlR5cGVFcnJvciIsIk51bWJlciIsIk1lbnUiLCJNZW51SXRlbSIsInJlbW90ZSIsImRlYm91bmNlIiwiZm4iLCJ3YWl0IiwidGltZW91dCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJjYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyIsImxpc3RzIiwicmVkdWNlIiwiYWNjIiwibGlzdCIsIk1BWElNVU1fTElTVEVEX0VOVFJJRVMiLCJzbGljZSIsIm5vb3AiLCJTdGFnaW5nVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInVuZG9MYXN0RGlzY2FyZCIsImV2ZW50U291cmNlIiwiY29tbWFuZCIsImRpc2NhcmRDaGFuZ2VzIiwiZGlzY2FyZEFsbCIsIml0ZW1QYXRocyIsImdldFNlbGVjdGVkSXRlbUZpbGVQYXRocyIsImF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24iLCJzdGF0ZSIsInNlbGVjdGlvbiIsImdldEFjdGl2ZUxpc3RLZXkiLCJzZXRTdGF0ZSIsInByZXZTdGF0ZSIsImNvYWxlc2NlIiwiYXV0b2JpbmQiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImF0b20iLCJjb25maWciLCJvYnNlcnZlIiwiZGVib3VuY2VkRGlkQ2hhbmdlU2VsZWN0ZWRJdGVtIiwiZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyIsInVuc3RhZ2VkQ2hhbmdlcyIsInN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsIkNvbXBvc2l0ZUxpc3RTZWxlY3Rpb24iLCJsaXN0c0J5S2V5IiwiaWRGb3JJdGVtIiwiaXRlbSIsImZpbGVQYXRoIiwibW91c2VTZWxlY3Rpb25JblByb2dyZXNzIiwibGlzdEVsZW1lbnRzQnlJdGVtIiwicmVmUm9vdCIsIlJlZkhvbGRlciIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsIm5leHRQcm9wcyIsIm5leHRTdGF0ZSIsInNvbWUiLCJuZXh0TGlzdHMiLCJ1cGRhdGVMaXN0cyIsImNvbXBvbmVudERpZE1vdW50Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vdXNldXAiLCJhZGQiLCJEaXNwb3NhYmxlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIndvcmtzcGFjZSIsIm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0iLCJzeW5jV2l0aFdvcmtzcGFjZSIsImlzUG9wdWxhdGVkIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiaXNSZXBvU2FtZSIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwiaGFzU2VsZWN0aW9uc1ByZXNlbnQiLCJnZXRTZWxlY3RlZEl0ZW1zIiwic2l6ZSIsInNlbGVjdGlvbkNoYW5nZWQiLCJoZWFkSXRlbSIsImdldEhlYWRJdGVtIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3SWZOZWVkZWQiLCJyZW5kZXIiLCJjcmVhdGVFbGVtZW50IiwibW9kZWwiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJmZXRjaERhdGEiLCJyZW5kZXJCb2R5Iiwic2VsZWN0ZWRJdGVtcyIsInJlZiIsInNldHRlciIsImNsYXNzTmFtZSIsInRhYkluZGV4IiwicmVuZGVyQ29tbWFuZHMiLCJnZXRGb2N1c0NsYXNzIiwicmVuZGVyQWN0aW9uc01lbnUiLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJzdGFnZUFsbCIsIm1hcCIsImZpbGVQYXRjaCIsInJlZ2lzdGVySXRlbUVsZW1lbnQiLCJvbkRvdWJsZUNsaWNrIiwiZXZlbnQiLCJkYmxjbGlja09uSXRlbSIsIm9uQ29udGV4dE1lbnUiLCJjb250ZXh0TWVudU9uSXRlbSIsIm9uTW91c2VEb3duIiwibW91c2Vkb3duT25JdGVtIiwib25Nb3VzZU1vdmUiLCJtb3VzZW1vdmVPbkl0ZW0iLCJzZWxlY3RlZCIsInJlbmRlclRydW5jYXRlZE1lc3NhZ2UiLCJyZW5kZXJNZXJnZUNvbmZsaWN0cyIsInVuc3RhZ2VBbGwiLCJGcmFnbWVudCIsInJlZ2lzdHJ5IiwiY29tbWFuZHMiLCJDb21tYW5kIiwiY2FsbGJhY2siLCJzZWxlY3RQcmV2aW91cyIsInNlbGVjdE5leHQiLCJkaXZlSW50b1NlbGVjdGlvbiIsInNob3dEaWZmVmlldyIsInNlbGVjdEFsbCIsInNlbGVjdEZpcnN0Iiwic2VsZWN0TGFzdCIsImNvbmZpcm1TZWxlY3RlZEl0ZW1zIiwiYWN0aXZhdGVOZXh0TGlzdCIsImFjdGl2YXRlUHJldmlvdXNMaXN0Iiwib3BlbkZpbGUiLCJyZXNvbHZlQ3VycmVudEFzT3VycyIsInJlc29sdmVDdXJyZW50QXNUaGVpcnMiLCJkaXNjYXJkQ2hhbmdlc0Zyb21Db21tYW5kIiwidW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvIiwiZGlzY2FyZEFsbEZyb21Db21tYW5kIiwidW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmQiLCJoYXNVbmRvSGlzdG9yeSIsInNob3dBY3Rpb25zTWVudSIsInJlbmRlclVuZG9CdXR0b24iLCJ1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uIiwiYW55VW5yZXNvbHZlZCIsImNvbmZsaWN0IiwicGF0aCIsImpvaW4iLCJjb25mbGljdFBhdGgiLCJnZXRSZW1haW5pbmciLCJidWxrUmVzb2x2ZURyb3Bkb3duIiwic2hvd0J1bGtSZXNvbHZlTWVudSIsInN0YWdlQWxsTWVyZ2VDb25mbGljdHMiLCJtZXJnZUNvbmZsaWN0IiwiZnVsbFBhdGgiLCJyZW1haW5pbmdDb25mbGljdHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJBcnJheSIsImZyb20iLCJnZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMiLCJmaWxlUGF0aHMiLCJvcGVuRmlsZXMiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJmaWxlQ291bnQiLCJ0eXBlIiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJhZHZhbmNlZCIsIm5leHQiLCJhY3RpdmF0ZU5leHRTZWxlY3Rpb24iLCJyZXRyZWF0ZWQiLCJhY3RpdmF0ZVByZXZpb3VzU2VsZWN0aW9uIiwiYWN0aXZhdGVMYXN0TGlzdCIsImVtcHR5U2VsZWN0aW9uIiwiYWN0aXZhdGVMYXN0U2VsZWN0aW9uIiwiYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uIiwiZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlIiwiZ2V0TmV4dFVwZGF0ZVByb21pc2UiLCJwcmVzZXJ2ZVRhaWwiLCJzZWxlY3RQcmV2aW91c0l0ZW0iLCJzZWxlY3ROZXh0SXRlbSIsInNlbGVjdEFsbEl0ZW1zIiwic2VsZWN0Rmlyc3RJdGVtIiwic2VsZWN0TGFzdEl0ZW0iLCJzZWxlY3RlZEl0ZW0iLCJ2YWx1ZXMiLCJzdGFnaW5nU3RhdHVzIiwic2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aCIsImFjdGl2YXRlIiwic2hvd0ZpbGVQYXRjaEl0ZW0iLCJnZXRBY3RpdmVQYW5lSXRlbSIsInJlYWxJdGVtUHJvbWlzZSIsImdldFJlYWxJdGVtUHJvbWlzZSIsInJlYWxJdGVtIiwiaXNGaWxlUGF0Y2hJdGVtIiwiaXNNYXRjaCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJxdWlldGx5U2VsZWN0SXRlbSIsImdldEZpbGVQYXRoIiwiZ2V0U3RhZ2luZ1N0YXR1cyIsImNvbmZsaWN0UGF0aHMiLCJjIiwicHJldmVudERlZmF1bHQiLCJtZW51IiwiYXBwZW5kIiwibGFiZWwiLCJjbGljayIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJwb3B1cCIsImdldEN1cnJlbnRXaW5kb3ciLCJzZWxlY3RlZEl0ZW1Db3VudCIsInBsdXJhbGl6YXRpb24iLCJlbmFibGVkIiwiZmluZEl0ZW0iLCJlYWNoIiwiY29uc29sZSIsImxvZyIsInNlbGVjdEl0ZW0iLCJvcGVuTmV3IiwiZGlkU2VsZWN0U2luZ2xlSXRlbSIsImhhc0ZvY3VzIiwicGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlIiwiZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSIsImFsbCIsInBhbmUiLCJhY3RpdmVQYW5lIiwiZ2V0Q2VudGVyIiwiZ2V0QWN0aXZlUGFuZSIsImFjdGl2ZVBlbmRpbmdJdGVtIiwiZ2V0UGVuZGluZ0l0ZW0iLCJhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsIkNoYW5nZWRGaWxlSXRlbSIsImdldFBhbmVzIiwicGVuZGluZ0l0ZW0iLCJpc0luQWN0aXZlUmVwbyIsImlzU3RhbGUiLCJjaGFuZ2VkRmlsZUV4aXN0cyIsInVyaSIsImJ1aWxkVVJJIiwiY2hhbmdlZEZpbGVJdGVtIiwib3BlbiIsInBlbmRpbmciLCJhY3RpdmF0ZVBhbmUiLCJhY3RpdmF0ZUl0ZW0iLCJpdGVtUm9vdCIsImdldEVsZW1lbnQiLCJmb2N1c1Jvb3QiLCJxdWVyeVNlbGVjdG9yIiwiZm9jdXMiLCJwYW5lRm9ySXRlbSIsInJlbGF0aXZlRmlsZVBhdGgiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlRXhpc3RzIiwibm90aWZpY2F0aW9uTWFuYWdlciIsImFkZEluZm8iLCJGaWxlIiwiZXhpc3RzIiwibGlzdEtleUZvckl0ZW0iLCJzdG9wUHJvcGFnYXRpb24iLCJwZXJzaXN0Iiwic2hpZnRLZXkiLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJwYXJlbnROb2RlIiwiZGlzcGF0Y2hFdmVudCIsIndpbmRvd3MiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJjdHJsS2V5IiwiYnV0dG9uIiwibWV0YUtleSIsImFkZE9yU3VidHJhY3RTZWxlY3Rpb24iLCJoYWRTZWxlY3Rpb25JblByb2dyZXNzIiwibGlzdEtleSIsImdldEZvY3VzIiwicm9vdCIsImNvbnRhaW5zIiwiZ2V0T3IiLCJTVEFHSU5HIiwic2V0Rm9jdXMiLCJhZHZhbmNlRm9jdXNGcm9tIiwiQ29tbWl0VmlldyIsImZpcnN0Rm9jdXMiLCJyZXRyZWF0Rm9jdXNGcm9tIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsImFycmF5T2YiLCJGaWxlUGF0Y2hJdGVtUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSIsInN0cmluZyIsImJvb2wiLCJmdW5jIiwiUmVzb2x1dGlvblByb2dyZXNzIl0sInNvdXJjZXMiOlsic3RhZ2luZy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5jb25zdCB7TWVudSwgTWVudUl0ZW19ID0gcmVtb3RlO1xuaW1wb3J0IHtGaWxlfSBmcm9tICdhdG9tJztcbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RmlsZVBhdGNoSXRlbVByb3BUeXBlLCBNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBGaWxlUGF0Y2hMaXN0SXRlbVZpZXcgZnJvbSAnLi9maWxlLXBhdGNoLWxpc3QtaXRlbS12aWV3JztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3IGZyb20gJy4vbWVyZ2UtY29uZmxpY3QtbGlzdC1pdGVtLXZpZXcnO1xuaW1wb3J0IENvbXBvc2l0ZUxpc3RTZWxlY3Rpb24gZnJvbSAnLi4vbW9kZWxzL2NvbXBvc2l0ZS1saXN0LXNlbGVjdGlvbic7XG5pbXBvcnQgUmVzb2x1dGlvblByb2dyZXNzIGZyb20gJy4uL21vZGVscy9jb25mbGljdHMvcmVzb2x1dGlvbi1wcm9ncmVzcyc7XG5pbXBvcnQgQ29tbWl0VmlldyBmcm9tICcuL2NvbW1pdC12aWV3JztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IENoYW5nZWRGaWxlSXRlbSBmcm9tICcuLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbSc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBkZWJvdW5jZSA9IChmbiwgd2FpdCkgPT4ge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKGZuKC4uLmFyZ3MpKTtcbiAgICAgIH0sIHdhaXQpO1xuICAgIH0pO1xuICB9O1xufTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMobGlzdHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RzKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgY29uc3QgbGlzdCA9IGxpc3RzW2tleV07XG4gICAgYWNjLnNvdXJjZVtrZXldID0gbGlzdDtcbiAgICBpZiAobGlzdC5sZW5ndGggPD0gTUFYSU1VTV9MSVNURURfRU5UUklFUykge1xuICAgICAgYWNjW2tleV0gPSBsaXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2Nba2V5XSA9IGxpc3Quc2xpY2UoMCwgTUFYSU1VTV9MSVNURURfRU5UUklFUyk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH0sIHtzb3VyY2U6IHt9fSk7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7IH07XG5cbmNvbnN0IE1BWElNVU1fTElTVEVEX0VOVFJJRVMgPSAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnaW5nVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdW5zdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlKSxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNPdXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc1RoZWlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbWVyZ2VDb25mbGljdHM6IFtdLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogbmV3IFJlc29sdXRpb25Qcm9ncmVzcygpLFxuICB9XG5cbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIFNUQUdJTkc6IFN5bWJvbCgnc3RhZ2luZycpLFxuICB9O1xuXG4gIHN0YXRpYyBmaXJzdEZvY3VzID0gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORztcblxuICBzdGF0aWMgbGFzdEZvY3VzID0gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORztcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnZGJsY2xpY2tPbkl0ZW0nLCAnY29udGV4dE1lbnVPbkl0ZW0nLCAnbW91c2Vkb3duT25JdGVtJywgJ21vdXNlbW92ZU9uSXRlbScsICdtb3VzZXVwJywgJ3JlZ2lzdGVySXRlbUVsZW1lbnQnLFxuICAgICAgJ3JlbmRlckJvZHknLCAnb3BlbkZpbGUnLCAnZGlzY2FyZENoYW5nZXMnLCAnYWN0aXZhdGVOZXh0TGlzdCcsICdhY3RpdmF0ZVByZXZpb3VzTGlzdCcsICdhY3RpdmF0ZUxhc3RMaXN0JyxcbiAgICAgICdzdGFnZUFsbCcsICd1bnN0YWdlQWxsJywgJ3N0YWdlQWxsTWVyZ2VDb25mbGljdHMnLCAnZGlzY2FyZEFsbCcsICdjb25maXJtU2VsZWN0ZWRJdGVtcycsICdzZWxlY3RBbGwnLFxuICAgICAgJ3NlbGVjdEZpcnN0JywgJ3NlbGVjdExhc3QnLCAnZGl2ZUludG9TZWxlY3Rpb24nLCAnc2hvd0RpZmZWaWV3JywgJ3Nob3dCdWxrUmVzb2x2ZU1lbnUnLCAnc2hvd0FjdGlvbnNNZW51JyxcbiAgICAgICdyZXNvbHZlQ3VycmVudEFzT3VycycsICdyZXNvbHZlQ3VycmVudEFzVGhlaXJzJywgJ3F1aWV0bHlTZWxlY3RJdGVtJywgJ2RpZENoYW5nZVNlbGVjdGVkSXRlbXMnLFxuICAgICk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2dpdGh1Yi5rZXlib2FyZE5hdmlnYXRpb25EZWxheScsIHZhbHVlID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0gPSB0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0gPSBkZWJvdW5jZSh0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXMsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAuLi5jYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyh7XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlczogdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMsXG4gICAgICAgIHN0YWdlZENoYW5nZXM6IHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgbWVyZ2VDb25mbGljdHM6IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMsXG4gICAgICB9KSxcbiAgICAgIHNlbGVjdGlvbjogbmV3IENvbXBvc2l0ZUxpc3RTZWxlY3Rpb24oe1xuICAgICAgICBsaXN0c0J5S2V5OiBbXG4gICAgICAgICAgWyd1bnN0YWdlZCcsIHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgICBbJ2NvbmZsaWN0cycsIHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHNdLFxuICAgICAgICAgIFsnc3RhZ2VkJywgdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgXSxcbiAgICAgICAgaWRGb3JJdGVtOiBpdGVtID0+IGl0ZW0uZmlsZVBhdGgsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbSA9IG5ldyBXZWFrTWFwKCk7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhuZXh0UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGxldCBuZXh0U3RhdGUgPSB7fTtcblxuICAgIGlmIChcbiAgICAgIFsndW5zdGFnZWRDaGFuZ2VzJywgJ3N0YWdlZENoYW5nZXMnLCAnbWVyZ2VDb25mbGljdHMnXS5zb21lKGtleSA9PiBwcmV2U3RhdGUuc291cmNlW2tleV0gIT09IG5leHRQcm9wc1trZXldKVxuICAgICkge1xuICAgICAgY29uc3QgbmV4dExpc3RzID0gY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMoe1xuICAgICAgICB1bnN0YWdlZENoYW5nZXM6IG5leHRQcm9wcy51bnN0YWdlZENoYW5nZXMsXG4gICAgICAgIHN0YWdlZENoYW5nZXM6IG5leHRQcm9wcy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBtZXJnZUNvbmZsaWN0czogbmV4dFByb3BzLm1lcmdlQ29uZmxpY3RzLFxuICAgICAgfSk7XG5cbiAgICAgIG5leHRTdGF0ZSA9IHtcbiAgICAgICAgLi4ubmV4dExpc3RzLFxuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24udXBkYXRlTGlzdHMoW1xuICAgICAgICAgIFsndW5zdGFnZWQnLCBuZXh0TGlzdHMudW5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgICBbJ2NvbmZsaWN0cycsIG5leHRMaXN0cy5tZXJnZUNvbmZsaWN0c10sXG4gICAgICAgICAgWydzdGFnZWQnLCBuZXh0TGlzdHMuc3RhZ2VkQ2hhbmdlc10sXG4gICAgICAgIF0pLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNldXApO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCkpLFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3luY1dpdGhXb3Jrc3BhY2UoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc1BvcHVsYXRlZCh0aGlzLnByb3BzKSkge1xuICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGNvbnN0IGlzUmVwb1NhbWUgPSBwcmV2UHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGggPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgY29uc3QgaGFzU2VsZWN0aW9uc1ByZXNlbnQgPVxuICAgICAgcHJldlN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDAgJiZcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMDtcbiAgICBjb25zdCBzZWxlY3Rpb25DaGFuZ2VkID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24gIT09IHByZXZTdGF0ZS5zZWxlY3Rpb247XG5cbiAgICBpZiAoaXNSZXBvU2FtZSAmJiBoYXNTZWxlY3Rpb25zUHJlc2VudCAmJiBzZWxlY3Rpb25DaGFuZ2VkKSB7XG4gICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRJdGVtID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0SGVhZEl0ZW0oKTtcbiAgICBpZiAoaGVhZEl0ZW0pIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbS5nZXQoaGVhZEl0ZW0pO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzUG9wdWxhdGVkKHByZXZQcm9wcykgJiYgdGhpcy5pc1BvcHVsYXRlZCh0aGlzLnByb3BzKSkge1xuICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9IGZldGNoRGF0YT17bm9vcH0+XG4gICAgICAgIHt0aGlzLnJlbmRlckJvZHl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQm9keSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfVxuICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXcgJHt0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCl9LWNoYW5nZXMtZm9jdXNlZGB9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLVVuc3RhZ2VkQ2hhbmdlcyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygndW5zdGFnZWQnKX1gfT5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1saXN0LXVub3JkZXJlZFwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctdGl0bGVcIj5VbnN0YWdlZCBDaGFuZ2VzPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQWN0aW9uc01lbnUoKX1cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBpY29uIGljb24tbW92ZS1kb3duXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zdGFnZUFsbH0+U3RhZ2UgQWxsPC9idXR0b24+XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctbGlzdCBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgZ2l0aHViLVN0YWdpbmdWaWV3LXVuc3RhZ2VkXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUudW5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gKFxuICAgICAgICAgICAgICAgIDxGaWxlUGF0Y2hMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgIGtleT17ZmlsZVBhdGNoLmZpbGVQYXRofVxuICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgZmlsZVBhdGNoPXtmaWxlUGF0Y2h9XG4gICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZSh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJNZXJnZUNvbmZsaWN0cygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItU3RhZ2VkQ2hhbmdlcyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygnc3RhZ2VkJyl9YH0gPlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRhc2tsaXN0XCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICBTdGFnZWQgQ2hhbmdlc1xuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLXVwXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudW5zdGFnZUFsbH0+VW5zdGFnZSBBbGw8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctc3RhZ2VkXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RhZ2VkQ2hhbmdlcy5tYXAoZmlsZVBhdGNoID0+IChcbiAgICAgICAgICAgICAgICA8RmlsZVBhdGNoTGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICBrZXk9e2ZpbGVQYXRjaC5maWxlUGF0aH1cbiAgICAgICAgICAgICAgICAgIGZpbGVQYXRjaD17ZmlsZVBhdGNofVxuICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMoZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRydW5jYXRlZE1lc3NhZ2UodGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLVN0YWdpbmdWaWV3XCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS11cFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdFByZXZpb3VzKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS1kb3duXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0TmV4dCgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtbGVmdFwiIGNhbGxiYWNrPXt0aGlzLmRpdmVJbnRvU2VsZWN0aW9ufSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy1kaWZmLXZpZXdcIiBjYWxsYmFjaz17dGhpcy5zaG93RGlmZlZpZXd9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXVwXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0UHJldmlvdXModHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LWRvd25cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3ROZXh0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC1hbGxcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RBbGx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS10by10b3BcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RGaXJzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXRvLWJvdHRvbVwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdExhc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXRvLXRvcFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdEZpcnN0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC10by1ib3R0b21cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RMYXN0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiBjYWxsYmFjaz17dGhpcy5jb25maXJtU2VsZWN0ZWRJdGVtc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFjdGl2YXRlLW5leHQtbGlzdFwiIGNhbGxiYWNrPXt0aGlzLmFjdGl2YXRlTmV4dExpc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjphY3RpdmF0ZS1wcmV2aW91cy1saXN0XCIgY2FsbGJhY2s9e3RoaXMuYWN0aXZhdGVQcmV2aW91c0xpc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpqdW1wLXRvLWZpbGVcIiBjYWxsYmFjaz17dGhpcy5vcGVuRmlsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtZmlsZS1hcy1vdXJzXCIgY2FsbGJhY2s9e3RoaXMucmVzb2x2ZUN1cnJlbnRBc091cnN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpyZXNvbHZlLWZpbGUtYXMtdGhlaXJzXCIgY2FsbGJhY2s9e3RoaXMucmVzb2x2ZUN1cnJlbnRBc1RoZWlyc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpc2NhcmQtY2hhbmdlcy1pbi1zZWxlY3RlZC1maWxlc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRDaGFuZ2VzRnJvbUNvbW1hbmR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6dW5kb1wiIGNhbGxiYWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kb30gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3RhZ2UtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy5zdGFnZUFsbH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnVuc3RhZ2UtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy51bnN0YWdlQWxsfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGlzY2FyZC1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRBbGxGcm9tQ29tbWFuZH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnVuZG8tbGFzdC1kaXNjYXJkLWluLWdpdC10YWJcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyA9ICgpID0+IHtcbiAgICB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnY29yZTp1bmRvJ319KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6dW5kby1sYXN0LWRpc2NhcmQtaW4tZ2l0LXRhYid9fSk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21IZWFkZXJNZW51ID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pO1xuICB9XG5cbiAgZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2NhcmRDaGFuZ2VzKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6ZGlzY2FyZC1jaGFuZ2VzLWluLXNlbGVjdGVkLWZpbGVzJ319KTtcbiAgfVxuXG4gIGRpc2NhcmRBbGxGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2NhcmRBbGwoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLWFsbC1jaGFuZ2VzJ319KTtcbiAgfVxuXG4gIHJlbmRlckFjdGlvbnNNZW51KCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggfHwgdGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbi0taWNvbk9ubHkgaWNvbiBpY29uLWVsbGlwc2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNob3dBY3Rpb25zTWVudX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclVuZG9CdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uLS1mdWxsV2lkdGggaWNvbiBpY29uLWhpc3RvcnlcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b259PlVuZG8gRGlzY2FyZDwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKGxpc3QpIHtcbiAgICBpZiAobGlzdC5sZW5ndGggPiBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cC10cnVuY2F0ZWRNc2dcIj5cbiAgICAgICAgICBMaXN0IHRydW5jYXRlZCB0byB0aGUgZmlyc3Qge01BWElNVU1fTElTVEVEX0VOVFJJRVN9IGl0ZW1zXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTWVyZ2VDb25mbGljdHMoKSB7XG4gICAgY29uc3QgbWVyZ2VDb25mbGljdHMgPSB0aGlzLnN0YXRlLm1lcmdlQ29uZmxpY3RzO1xuXG4gICAgaWYgKG1lcmdlQ29uZmxpY3RzICYmIG1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgICBjb25zdCByZXNvbHV0aW9uUHJvZ3Jlc3MgPSB0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzcztcbiAgICAgIGNvbnN0IGFueVVucmVzb2x2ZWQgPSBtZXJnZUNvbmZsaWN0c1xuICAgICAgICAubWFwKGNvbmZsaWN0ID0+IHBhdGguam9pbih0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLCBjb25mbGljdC5maWxlUGF0aCkpXG4gICAgICAgIC5zb21lKGNvbmZsaWN0UGF0aCA9PiByZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGNvbmZsaWN0UGF0aCkgIT09IDApO1xuXG4gICAgICBjb25zdCBidWxrUmVzb2x2ZURyb3Bkb3duID0gYW55VW5yZXNvbHZlZCA/IChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgaWNvbiBpY29uLWVsbGlwc2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNob3dCdWxrUmVzb2x2ZU1lbnV9XG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLU1lcmdlQ29uZmxpY3RQYXRocyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygnY29uZmxpY3RzJyl9YH0+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tYWxlcnQgc3RhdHVzLW1vZGlmaWVkJ30gLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPk1lcmdlIENvbmZsaWN0czwvc3Bhbj5cbiAgICAgICAgICAgIHtidWxrUmVzb2x2ZURyb3Bkb3dufVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLWRvd25cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17YW55VW5yZXNvbHZlZH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zdGFnZUFsbE1lcmdlQ29uZmxpY3RzfT5cbiAgICAgICAgICAgICAgU3RhZ2UgQWxsXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctbWVyZ2VcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWVyZ2VDb25mbGljdHMubWFwKG1lcmdlQ29uZmxpY3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIG1lcmdlQ29uZmxpY3QuZmlsZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICAgIGtleT17ZnVsbFBhdGh9XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlQ29uZmxpY3Q9e21lcmdlQ29uZmxpY3R9XG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0NvbmZsaWN0cz17cmVzb2x1dGlvblByb2dyZXNzLmdldFJlbWFpbmluZyhmdWxsUGF0aCl9XG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVySXRlbUVsZW1lbnQ9e3RoaXMucmVnaXN0ZXJJdGVtRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMobWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZShtZXJnZUNvbmZsaWN0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxub3NjcmlwdCAvPjtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSwgaXRlbSA9PiBpdGVtLmZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpICE9PSAnY29uZmxpY3RzJykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgfVxuXG4gIG9wZW5GaWxlKCkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGVzKGZpbGVQYXRocyk7XG4gIH1cblxuICBkaXNjYXJkQ2hhbmdlcyh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIGFkZEV2ZW50KCdkaXNjYXJkLXVuc3RhZ2VkLWNoYW5nZXMnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGZpbGVDb3VudDogZmlsZVBhdGhzLmxlbmd0aCxcbiAgICAgIHR5cGU6ICdzZWxlY3RlZCcsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgYWN0aXZhdGVOZXh0TGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgYWR2YW5jZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZU5leHRTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBhZHZhbmNlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBuZXh0LmNvYWxlc2NlKCl9O1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZShhZHZhbmNlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWN0aXZhdGVQcmV2aW91c0xpc3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IHJldHJlYXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZVByZXZpb3VzU2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChwcmV2U3RhdGUuc2VsZWN0aW9uID09PSBuZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0cmVhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IG5leHQuY29hbGVzY2UoKX07XG4gICAgICB9LCAoKSA9PiByZXNvbHZlKHJldHJlYXRlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWN0aXZhdGVMYXN0TGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgZW1wdHlTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uYWN0aXZhdGVMYXN0U2VsZWN0aW9uKCk7XG4gICAgICAgIGVtcHR5U2VsZWN0aW9uID0gbmV4dC5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDA7XG5cbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogbmV4dC5jb2FsZXNjZSgpfTtcbiAgICAgIH0sICgpID0+IHJlc29sdmUoZW1wdHlTZWxlY3Rpb24pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YWdlQWxsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24oJ3Vuc3RhZ2VkJyk7XG4gIH1cblxuICB1bnN0YWdlQWxsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uKCdzdGFnZWQnKTtcbiAgfVxuXG4gIHN0YWdlQWxsTWVyZ2VDb25mbGljdHMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5tYXAoY29uZmxpY3QgPT4gY29uZmxpY3QuZmlsZVBhdGgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oZmlsZVBhdGhzLCAndW5zdGFnZWQnKTtcbiAgfVxuXG4gIGRpc2NhcmRBbGwoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gZmlsZVBhdGNoLmZpbGVQYXRoKTtcbiAgICBhZGRFdmVudCgnZGlzY2FyZC11bnN0YWdlZC1jaGFuZ2VzJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBmaWxlQ291bnQ6IGZpbGVQYXRocy5sZW5ndGgsXG4gICAgICB0eXBlOiAnYWxsJyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocyk7XG4gIH1cblxuICBjb25maXJtU2VsZWN0ZWRJdGVtcyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpdGVtUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIGF3YWl0IHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihpdGVtUGF0aHMsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe3NlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5jb2FsZXNjZSgpfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXROZXh0VXBkYXRlUHJvbWlzZSgpO1xuICB9XG5cbiAgc2VsZWN0UHJldmlvdXMocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0UHJldmlvdXNJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdE5leHQocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0TmV4dEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RBbGxJdGVtcygpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RGaXJzdChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RGaXJzdEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0TGFzdChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RMYXN0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkaXZlSW50b1NlbGVjdGlvbigpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLnNpemUgIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuXG4gICAgaWYgKHN0YWdpbmdTdGF0dXMgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB7YWN0aXZhdGU6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge2FjdGl2YXRlOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3luY1dpdGhXb3Jrc3BhY2UoKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVhbEl0ZW1Qcm9taXNlID0gaXRlbS5nZXRSZWFsSXRlbVByb21pc2UgJiYgaXRlbS5nZXRSZWFsSXRlbVByb21pc2UoKTtcbiAgICBjb25zdCByZWFsSXRlbSA9IGF3YWl0IHJlYWxJdGVtUHJvbWlzZTtcbiAgICBpZiAoIXJlYWxJdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNGaWxlUGF0Y2hJdGVtID0gcmVhbEl0ZW0uaXNGaWxlUGF0Y2hJdGVtICYmIHJlYWxJdGVtLmlzRmlsZVBhdGNoSXRlbSgpO1xuICAgIGNvbnN0IGlzTWF0Y2ggPSByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5ICYmIHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkoKSA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcblxuICAgIGlmIChpc0ZpbGVQYXRjaEl0ZW0gJiYgaXNNYXRjaCkge1xuICAgICAgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShyZWFsSXRlbS5nZXRGaWxlUGF0aCgpLCByZWFsSXRlbS5nZXRTdGFnaW5nU3RhdHVzKCkpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNob3dEaWZmVmlldygpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLnNpemUgIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuXG4gICAgaWYgKHN0YWdpbmdTdGF0dXMgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0J1bGtSZXNvbHZlTWVudShldmVudCkge1xuICAgIGNvbnN0IGNvbmZsaWN0UGF0aHMgPSB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLm1hcChjID0+IGMuZmlsZVBhdGgpO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBBbGwgYXMgT3VycycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzKGNvbmZsaWN0UGF0aHMpLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1Jlc29sdmUgQWxsIGFzIFRoZWlycycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnMoY29uZmxpY3RQYXRocyksXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHNob3dBY3Rpb25zTWVudShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbUNvdW50ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemU7XG4gICAgY29uc3QgcGx1cmFsaXphdGlvbiA9IHNlbGVjdGVkSXRlbUNvdW50ID4gMSA/ICdzJyA6ICcnO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnRGlzY2FyZCBBbGwgQ2hhbmdlcycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5kaXNjYXJkQWxsKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pLFxuICAgICAgZW5hYmxlZDogdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMCxcbiAgICB9KSk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdEaXNjYXJkIENoYW5nZXMgaW4gU2VsZWN0ZWQgRmlsZScgKyBwbHVyYWxpemF0aW9uLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZGlzY2FyZENoYW5nZXMoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSksXG4gICAgICBlbmFibGVkOiAhISh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggJiYgc2VsZWN0ZWRJdGVtQ291bnQpLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1VuZG8gTGFzdCBEaXNjYXJkJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KSxcbiAgICAgIGVuYWJsZWQ6IHRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnksXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHJlc29sdmVDdXJyZW50QXNPdXJzKCkge1xuICAgIHRoaXMucHJvcHMucmVzb2x2ZUFzT3Vycyh0aGlzLmdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpKTtcbiAgfVxuXG4gIHJlc29sdmVDdXJyZW50QXNUaGVpcnMoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnModGhpcy5nZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMoKSk7XG4gIH1cblxuICAvLyBEaXJlY3RseSBtb2RpZnkgdGhlIHNlbGVjdGlvbiB0byBpbmNsdWRlIG9ubHkgdGhlIGl0ZW0gaWRlbnRpZmllZCBieSB0aGUgZmlsZSBwYXRoIGFuZCBzdGFnaW5nU3RhdHVzIHR1cGxlLlxuICAvLyBSZS1yZW5kZXIgdGhlIGNvbXBvbmVudCwgYnV0IGRvbid0IG5vdGlmeSBkaWRTZWxlY3RTaW5nbGVJdGVtKCkgb3Igb3RoZXIgY2FsbGJhY2sgZnVuY3Rpb25zLiBUaGlzIGlzIHVzZWZ1bCB0b1xuICAvLyBhdm9pZCBjaXJjdWxhciBjYWxsYmFjayBsb29wcyBmb3IgYWN0aW9ucyBvcmlnaW5hdGluZyBpbiBGaWxlUGF0Y2hWaWV3IG9yIFRleHRFZGl0b3JzIHdpdGggbWVyZ2UgY29uZmxpY3RzLlxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uZmluZEl0ZW0oKGVhY2gsIGtleSkgPT4gZWFjaC5maWxlUGF0aCA9PT0gZmlsZVBhdGggJiYga2V5ID09PSBzdGFnaW5nU3RhdHVzKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgLy8gRklYTUU6IG1ha2Ugc3RhZ2luZyB2aWV3IGRpc3BsYXkgbm8gc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5sb2coYFVuYWJsZSB0byBmaW5kIGl0ZW0gYXQgcGF0aCAke2ZpbGVQYXRofSB3aXRoIHN0YWdpbmcgc3RhdHVzICR7c3RhZ2luZ1N0YXR1c31gKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSl9O1xuICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEl0ZW1zKCkge1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLCBpdGVtID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZpbGVQYXRoOiBpdGVtLmZpbGVQYXRoLFxuICAgICAgICBzdGFnaW5nU3RhdHVzLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpZENoYW5nZVNlbGVjdGVkSXRlbXMob3Blbk5ldykge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLmRpZFNlbGVjdFNpbmdsZUl0ZW0oc2VsZWN0ZWRJdGVtc1swXSwgb3Blbk5ldyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlkU2VsZWN0U2luZ2xlSXRlbShzZWxlY3RlZEl0ZW0sIG9wZW5OZXcgPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIGlmIChvcGVuTmV3KSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHthY3RpdmF0ZTogdHJ1ZX0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3Blbk5ldykge1xuICAgICAgICAvLyBVc2VyIGV4cGxpY2l0bHkgYXNrZWQgdG8gdmlldyBkaWZmLCBzdWNoIGFzIHZpYSBjbGlja1xuICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7YWN0aXZhdGU6IGZhbHNlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwYW5lc1dpdGhTdGFsZUl0ZW1zVG9VcGRhdGUgPSB0aGlzLmdldFBhbmVzV2l0aFN0YWxlUGVuZGluZ0ZpbGVQYXRjaEl0ZW0oKTtcbiAgICAgICAgaWYgKHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIHN0YWxlIGl0ZW1zIHRvIHJlZmxlY3QgbmV3IHNlbGVjdGlvblxuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZS5tYXAoYXN5bmMgcGFuZSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7XG4gICAgICAgICAgICAgIGFjdGl2YXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgcGFuZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZWxlY3Rpb24gd2FzIGNoYW5nZWQgdmlhIGtleWJvYXJkIG5hdmlnYXRpb24sIHVwZGF0ZSBwZW5kaW5nIGl0ZW0gaW4gYWN0aXZlIHBhbmVcbiAgICAgICAgICBjb25zdCBhY3RpdmVQYW5lID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBlbmRpbmdJdGVtID0gYWN0aXZlUGFuZS5nZXRQZW5kaW5nSXRlbSgpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBhbmVIYXNQZW5kaW5nRmlsZVBhdGNoSXRlbSA9IGFjdGl2ZVBlbmRpbmdJdGVtICYmIGFjdGl2ZVBlbmRpbmdJdGVtLmdldFJlYWxJdGVtICYmXG4gICAgICAgICAgICBhY3RpdmVQZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSgpIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtO1xuICAgICAgICAgIGlmIChhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHtcbiAgICAgICAgICAgICAgYWN0aXZhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICBwYW5lOiBhY3RpdmVQYW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSgpIHtcbiAgICAvLyBcInN0YWxlXCIgbWVhbmluZyB0aGVyZSBpcyBubyBsb25nZXIgYSBjaGFuZ2VkIGZpbGUgYXNzb2NpYXRlZCB3aXRoIGl0ZW1cbiAgICAvLyBkdWUgdG8gY2hhbmdlcyBiZWluZyBmdWxseSBzdGFnZWQvdW5zdGFnZWQvc3Rhc2hlZC9kZWxldGVkL2V0Y1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRQYW5lcygpLmZpbHRlcihwYW5lID0+IHtcbiAgICAgIGNvbnN0IHBlbmRpbmdJdGVtID0gcGFuZS5nZXRQZW5kaW5nSXRlbSgpO1xuICAgICAgaWYgKCFwZW5kaW5nSXRlbSB8fCAhcGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBjb25zdCByZWFsSXRlbSA9IHBlbmRpbmdJdGVtLmdldFJlYWxJdGVtKCk7XG4gICAgICBpZiAoIShyZWFsSXRlbSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gV2Ugb25seSB3YW50IHRvIHVwZGF0ZSBwZW5kaW5nIGRpZmYgdmlld3MgZm9yIGN1cnJlbnRseSBhY3RpdmUgcmVwb1xuICAgICAgY29uc3QgaXNJbkFjdGl2ZVJlcG8gPSByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5KCkgPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgICBjb25zdCBpc1N0YWxlID0gIXRoaXMuY2hhbmdlZEZpbGVFeGlzdHMocmVhbEl0ZW0uZ2V0RmlsZVBhdGgoKSwgcmVhbEl0ZW0uZ2V0U3RhZ2luZ1N0YXR1cygpKTtcbiAgICAgIHJldHVybiBpc0luQWN0aXZlUmVwbyAmJiBpc1N0YWxlO1xuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlZEZpbGVFeGlzdHMoZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZmluZEl0ZW0oKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIGtleSA9PT0gc3RhZ2luZ1N0YXR1cyAmJiBpdGVtLmZpbGVQYXRoID09PSBmaWxlUGF0aDtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNob3dGaWxlUGF0Y2hJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzLCB7YWN0aXZhdGUsIHBhbmV9ID0ge2FjdGl2YXRlOiBmYWxzZX0pIHtcbiAgICBjb25zdCB1cmkgPSBDaGFuZ2VkRmlsZUl0ZW0uYnVpbGRVUkkoZmlsZVBhdGgsIHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICAgIGNvbnN0IGNoYW5nZWRGaWxlSXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICB1cmksIHtwZW5kaW5nOiB0cnVlLCBhY3RpdmF0ZVBhbmU6IGFjdGl2YXRlLCBhY3RpdmF0ZUl0ZW06IGFjdGl2YXRlLCBwYW5lfSxcbiAgICApO1xuICAgIGlmIChhY3RpdmF0ZSkge1xuICAgICAgY29uc3QgaXRlbVJvb3QgPSBjaGFuZ2VkRmlsZUl0ZW0uZ2V0RWxlbWVudCgpO1xuICAgICAgY29uc3QgZm9jdXNSb290ID0gaXRlbVJvb3QucXVlcnlTZWxlY3RvcignW3RhYkluZGV4XScpO1xuICAgICAgaWYgKGZvY3VzUm9vdCkge1xuICAgICAgICBmb2N1c1Jvb3QuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2ltcGx5IG1ha2UgaXRlbSB2aXNpYmxlXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5wYW5lRm9ySXRlbShjaGFuZ2VkRmlsZUl0ZW0pLmFjdGl2YXRlSXRlbShjaGFuZ2VkRmlsZUl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgocmVsYXRpdmVGaWxlUGF0aCwge2FjdGl2YXRlfSA9IHthY3RpdmF0ZTogZmFsc2V9KSB7XG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIHJlbGF0aXZlRmlsZVBhdGgpO1xuICAgIGlmIChhd2FpdCB0aGlzLmZpbGVFeGlzdHMoYWJzb2x1dGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oYWJzb2x1dGVQYXRoLCB7YWN0aXZhdGVQYW5lOiBhY3RpdmF0ZSwgYWN0aXZhdGVJdGVtOiBhY3RpdmF0ZSwgcGVuZGluZzogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkSW5mbygnRmlsZSBoYXMgYmVlbiBkZWxldGVkLicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgZmlsZUV4aXN0cyhhYnNvbHV0ZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IEZpbGUoYWJzb2x1dGVQYXRoKS5leGlzdHMoKTtcbiAgfVxuXG4gIGRibGNsaWNrT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihbaXRlbS5maWxlUGF0aF0sIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmxpc3RLZXlGb3JJdGVtKGl0ZW0pKTtcbiAgfVxuXG4gIGFzeW5jIGNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuaGFzKGl0ZW0pKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgZXZlbnQuc2hpZnRLZXkpLFxuICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudChldmVudC50eXBlLCBldmVudCk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50LnRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQobmV3RXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2Vkb3duT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgY29uc3Qgd2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgIXdpbmRvd3MpIHsgcmV0dXJuOyB9IC8vIHNpbXBseSBvcGVuIGNvbnRleHQgbWVudVxuICAgIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGlmIChldmVudC5tZXRhS2V5IHx8IChldmVudC5jdHJsS2V5ICYmIHdpbmRvd3MpKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5hZGRPclN1YnRyYWN0U2VsZWN0aW9uKGl0ZW0pLFxuICAgICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgZXZlbnQuc2hpZnRLZXkpLFxuICAgICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgaWYgKHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCB0cnVlKSxcbiAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2V1cCgpIHtcbiAgICBjb25zdCBoYWRTZWxlY3Rpb25JblByb2dyZXNzID0gdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3M7XG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gICAgaWYgKGhhZFNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyh0cnVlKTtcbiAgICB9XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYWRkRXZlbnQoJ3VuZG8tbGFzdC1kaXNjYXJkJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkKCk7XG4gIH1cblxuICBnZXRGb2N1c0NsYXNzKGxpc3RLZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpID09PSBsaXN0S2V5ID8gJ2lzLWZvY3VzZWQnIDogJyc7XG4gIH1cblxuICByZWdpc3Rlckl0ZW1FbGVtZW50KGl0ZW0sIGVsZW1lbnQpIHtcbiAgICB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbS5zZXQoaXRlbSwgZWxlbWVudCk7XG4gIH1cblxuICBnZXRGb2N1cyhlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkgPyBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HIDogbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkcpIHtcbiAgICAgIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmZvY3VzKCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HKSB7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5hY3RpdmF0ZU5leHRMaXN0KCkpIHtcbiAgICAgICAgLy8gVGhlcmUgd2FzIGEgbmV4dCBsaXN0IHRvIGFjdGl2YXRlLlxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSB3ZXJlIGFscmVhZHkgb24gdGhlIGxhc3QgbGlzdC5cbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZpcnN0Rm9jdXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhc3luYyByZXRyZWF0Rm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZpcnN0Rm9jdXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGVMYXN0TGlzdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORykge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZVByZXZpb3VzTGlzdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGlzUG9wdWxhdGVkKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoICE9IG51bGwgJiYgKFxuICAgICAgcHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA+IDAgfHxcbiAgICAgIHByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDAgfHxcbiAgICAgIHByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMFxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsU0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBO0FBRUEsSUFBQUUsS0FBQSxHQUFBRixPQUFBO0FBQ0EsSUFBQUcsTUFBQSxHQUFBQyx1QkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQUssVUFBQSxHQUFBQyxzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQU8sS0FBQSxHQUFBRCxzQkFBQSxDQUFBTixPQUFBO0FBRUEsSUFBQVEsV0FBQSxHQUFBUixPQUFBO0FBQ0EsSUFBQVMsc0JBQUEsR0FBQUgsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFVLGFBQUEsR0FBQUosc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFXLDBCQUFBLEdBQUFMLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBWSx1QkFBQSxHQUFBTixzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQWEsbUJBQUEsR0FBQVAsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFjLFdBQUEsR0FBQVIsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFlLFVBQUEsR0FBQVQsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFnQixnQkFBQSxHQUFBVixzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQWlCLFNBQUEsR0FBQWIsdUJBQUEsQ0FBQUosT0FBQTtBQUNBLElBQUFrQixRQUFBLEdBQUFsQixPQUFBO0FBQ0EsSUFBQW1CLGNBQUEsR0FB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