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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZW51IiwiTWVudUl0ZW0iLCJyZW1vdGUiLCJkZWJvdW5jZSIsImZuIiwid2FpdCIsInRpbWVvdXQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMiLCJsaXN0cyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2MiLCJrZXkiLCJsaXN0Iiwic291cmNlIiwibGVuZ3RoIiwiTUFYSU1VTV9MSVNURURfRU5UUklFUyIsInNsaWNlIiwibm9vcCIsIlN0YWdpbmdWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwidW5kb0xhc3REaXNjYXJkIiwiZXZlbnRTb3VyY2UiLCJjb21tYW5kIiwiZGlzY2FyZENoYW5nZXMiLCJkaXNjYXJkQWxsIiwiaXRlbVBhdGhzIiwiZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzIiwiYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbiIsInN0YXRlIiwic2VsZWN0aW9uIiwiZ2V0QWN0aXZlTGlzdEtleSIsInNldFN0YXRlIiwicHJldlN0YXRlIiwiY29hbGVzY2UiLCJhdXRvYmluZCIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiYXRvbSIsImNvbmZpZyIsIm9ic2VydmUiLCJ2YWx1ZSIsImRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSIsImRpZENoYW5nZVNlbGVjdGVkSXRlbXMiLCJ1bnN0YWdlZENoYW5nZXMiLCJzdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJDb21wb3NpdGVMaXN0U2VsZWN0aW9uIiwibGlzdHNCeUtleSIsImlkRm9ySXRlbSIsIml0ZW0iLCJmaWxlUGF0aCIsIm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxpc3RFbGVtZW50c0J5SXRlbSIsIldlYWtNYXAiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwic29tZSIsIm5leHRMaXN0cyIsInVwZGF0ZUxpc3RzIiwiY29tcG9uZW50RGlkTW91bnQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwibW91c2V1cCIsImFkZCIsIkRpc3Bvc2FibGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwid29ya3NwYWNlIiwib25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSIsInN5bmNXaXRoV29ya3NwYWNlIiwiaXNQb3B1bGF0ZWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJpc1JlcG9TYW1lIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJoYXNTZWxlY3Rpb25zUHJlc2VudCIsImdldFNlbGVjdGVkSXRlbXMiLCJzaXplIiwic2VsZWN0aW9uQ2hhbmdlZCIsImhlYWRJdGVtIiwiZ2V0SGVhZEl0ZW0iLCJlbGVtZW50IiwiZ2V0Iiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsInJlbmRlciIsInJlc29sdXRpb25Qcm9ncmVzcyIsInJlbmRlckJvZHkiLCJzZWxlY3RlZEl0ZW1zIiwic2V0dGVyIiwicmVuZGVyQ29tbWFuZHMiLCJnZXRGb2N1c0NsYXNzIiwicmVuZGVyQWN0aW9uc01lbnUiLCJzdGFnZUFsbCIsIm1hcCIsImZpbGVQYXRjaCIsInJlZ2lzdGVySXRlbUVsZW1lbnQiLCJldmVudCIsImRibGNsaWNrT25JdGVtIiwiY29udGV4dE1lbnVPbkl0ZW0iLCJtb3VzZWRvd25Pbkl0ZW0iLCJtb3VzZW1vdmVPbkl0ZW0iLCJoYXMiLCJyZW5kZXJUcnVuY2F0ZWRNZXNzYWdlIiwicmVuZGVyTWVyZ2VDb25mbGljdHMiLCJ1bnN0YWdlQWxsIiwiY29tbWFuZHMiLCJzZWxlY3RQcmV2aW91cyIsInNlbGVjdE5leHQiLCJkaXZlSW50b1NlbGVjdGlvbiIsInNob3dEaWZmVmlldyIsInNlbGVjdEFsbCIsInNlbGVjdEZpcnN0Iiwic2VsZWN0TGFzdCIsImNvbmZpcm1TZWxlY3RlZEl0ZW1zIiwiYWN0aXZhdGVOZXh0TGlzdCIsImFjdGl2YXRlUHJldmlvdXNMaXN0Iiwib3BlbkZpbGUiLCJyZXNvbHZlQ3VycmVudEFzT3VycyIsInJlc29sdmVDdXJyZW50QXNUaGVpcnMiLCJkaXNjYXJkQ2hhbmdlc0Zyb21Db21tYW5kIiwidW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvIiwiZGlzY2FyZEFsbEZyb21Db21tYW5kIiwidW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmQiLCJoYXNVbmRvSGlzdG9yeSIsInNob3dBY3Rpb25zTWVudSIsInJlbmRlclVuZG9CdXR0b24iLCJ1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uIiwiYW55VW5yZXNvbHZlZCIsImNvbmZsaWN0IiwicGF0aCIsImpvaW4iLCJjb25mbGljdFBhdGgiLCJnZXRSZW1haW5pbmciLCJidWxrUmVzb2x2ZURyb3Bkb3duIiwic2hvd0J1bGtSZXNvbHZlTWVudSIsInN0YWdlQWxsTWVyZ2VDb25mbGljdHMiLCJtZXJnZUNvbmZsaWN0IiwiZnVsbFBhdGgiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJBcnJheSIsImZyb20iLCJnZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMiLCJmaWxlUGF0aHMiLCJvcGVuRmlsZXMiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJmaWxlQ291bnQiLCJ0eXBlIiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJhZHZhbmNlZCIsIm5leHQiLCJhY3RpdmF0ZU5leHRTZWxlY3Rpb24iLCJyZXRyZWF0ZWQiLCJhY3RpdmF0ZVByZXZpb3VzU2VsZWN0aW9uIiwiYWN0aXZhdGVMYXN0TGlzdCIsImVtcHR5U2VsZWN0aW9uIiwiYWN0aXZhdGVMYXN0U2VsZWN0aW9uIiwiYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uIiwiZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlIiwiZ2V0TmV4dFVwZGF0ZVByb21pc2UiLCJwcmVzZXJ2ZVRhaWwiLCJzZWxlY3RQcmV2aW91c0l0ZW0iLCJzZWxlY3ROZXh0SXRlbSIsInNlbGVjdEFsbEl0ZW1zIiwic2VsZWN0Rmlyc3RJdGVtIiwic2VsZWN0TGFzdEl0ZW0iLCJzZWxlY3RlZEl0ZW0iLCJ2YWx1ZXMiLCJzdGFnaW5nU3RhdHVzIiwic2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aCIsImFjdGl2YXRlIiwic2hvd0ZpbGVQYXRjaEl0ZW0iLCJnZXRBY3RpdmVQYW5lSXRlbSIsInJlYWxJdGVtUHJvbWlzZSIsImdldFJlYWxJdGVtUHJvbWlzZSIsInJlYWxJdGVtIiwiaXNGaWxlUGF0Y2hJdGVtIiwiaXNNYXRjaCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJxdWlldGx5U2VsZWN0SXRlbSIsImdldEZpbGVQYXRoIiwiZ2V0U3RhZ2luZ1N0YXR1cyIsImNvbmZsaWN0UGF0aHMiLCJjIiwicHJldmVudERlZmF1bHQiLCJtZW51IiwiYXBwZW5kIiwibGFiZWwiLCJjbGljayIsInJlc29sdmVBc091cnMiLCJyZXNvbHZlQXNUaGVpcnMiLCJwb3B1cCIsImdldEN1cnJlbnRXaW5kb3ciLCJzZWxlY3RlZEl0ZW1Db3VudCIsInBsdXJhbGl6YXRpb24iLCJlbmFibGVkIiwiZmluZEl0ZW0iLCJlYWNoIiwiY29uc29sZSIsImxvZyIsInNlbGVjdEl0ZW0iLCJvcGVuTmV3IiwiZGlkU2VsZWN0U2luZ2xlSXRlbSIsImhhc0ZvY3VzIiwicGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlIiwiZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSIsImFsbCIsInBhbmUiLCJhY3RpdmVQYW5lIiwiZ2V0Q2VudGVyIiwiZ2V0QWN0aXZlUGFuZSIsImFjdGl2ZVBlbmRpbmdJdGVtIiwiZ2V0UGVuZGluZ0l0ZW0iLCJhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsIkNoYW5nZWRGaWxlSXRlbSIsImdldFBhbmVzIiwiZmlsdGVyIiwicGVuZGluZ0l0ZW0iLCJpc0luQWN0aXZlUmVwbyIsImlzU3RhbGUiLCJjaGFuZ2VkRmlsZUV4aXN0cyIsInVyaSIsImJ1aWxkVVJJIiwiY2hhbmdlZEZpbGVJdGVtIiwib3BlbiIsInBlbmRpbmciLCJhY3RpdmF0ZVBhbmUiLCJhY3RpdmF0ZUl0ZW0iLCJpdGVtUm9vdCIsImdldEVsZW1lbnQiLCJmb2N1c1Jvb3QiLCJxdWVyeVNlbGVjdG9yIiwiZm9jdXMiLCJwYW5lRm9ySXRlbSIsInJlbGF0aXZlRmlsZVBhdGgiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlRXhpc3RzIiwibm90aWZpY2F0aW9uTWFuYWdlciIsImFkZEluZm8iLCJGaWxlIiwiZXhpc3RzIiwibGlzdEtleUZvckl0ZW0iLCJzdG9wUHJvcGFnYXRpb24iLCJwZXJzaXN0Iiwic2hpZnRLZXkiLCJuZXdFdmVudCIsIk1vdXNlRXZlbnQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwiZGlzcGF0Y2hFdmVudCIsIndpbmRvd3MiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJjdHJsS2V5IiwiYnV0dG9uIiwibWV0YUtleSIsImFkZE9yU3VidHJhY3RTZWxlY3Rpb24iLCJoYWRTZWxlY3Rpb25JblByb2dyZXNzIiwibGlzdEtleSIsInNldCIsImdldEZvY3VzIiwicm9vdCIsImNvbnRhaW5zIiwiZ2V0T3IiLCJTVEFHSU5HIiwic2V0Rm9jdXMiLCJhZHZhbmNlRm9jdXNGcm9tIiwiQ29tbWl0VmlldyIsImZpcnN0Rm9jdXMiLCJyZXRyZWF0Rm9jdXNGcm9tIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIkZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlIiwic3RyaW5nIiwib2JqZWN0IiwiYm9vbCIsImZ1bmMiLCJSZXNvbHV0aW9uUHJvZ3Jlc3MiLCJTeW1ib2wiXSwic291cmNlcyI6WyJzdGFnaW5nLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcbmNvbnN0IHtNZW51LCBNZW51SXRlbX0gPSByZW1vdGU7XG5pbXBvcnQge0ZpbGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtGaWxlUGF0Y2hJdGVtUHJvcFR5cGUsIE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IEZpbGVQYXRjaExpc3RJdGVtVmlldyBmcm9tICcuL2ZpbGUtcGF0Y2gtbGlzdC1pdGVtLXZpZXcnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IE1lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXcgZnJvbSAnLi9tZXJnZS1jb25mbGljdC1saXN0LWl0ZW0tdmlldyc7XG5pbXBvcnQgQ29tcG9zaXRlTGlzdFNlbGVjdGlvbiBmcm9tICcuLi9tb2RlbHMvY29tcG9zaXRlLWxpc3Qtc2VsZWN0aW9uJztcbmltcG9ydCBSZXNvbHV0aW9uUHJvZ3Jlc3MgZnJvbSAnLi4vbW9kZWxzL2NvbmZsaWN0cy9yZXNvbHV0aW9uLXByb2dyZXNzJztcbmltcG9ydCBDb21taXRWaWV3IGZyb20gJy4vY29tbWl0LXZpZXcnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IGRlYm91bmNlID0gKGZuLCB3YWl0KSA9PiB7XG4gIGxldCB0aW1lb3V0O1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoZm4oLi4uYXJncykpO1xuICAgICAgfSwgd2FpdCk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBjYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyhsaXN0cykge1xuICByZXR1cm4gT2JqZWN0LmtleXMobGlzdHMpLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICBjb25zdCBsaXN0ID0gbGlzdHNba2V5XTtcbiAgICBhY2Muc291cmNlW2tleV0gPSBsaXN0O1xuICAgIGlmIChsaXN0Lmxlbmd0aCA8PSBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKSB7XG4gICAgICBhY2Nba2V5XSA9IGxpc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY1trZXldID0gbGlzdC5zbGljZSgwLCBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge3NvdXJjZToge319KTtcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHsgfTtcblxuY29uc3QgTUFYSU1VTV9MSVNURURfRU5UUklFUyA9IDEwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWdpbmdWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB1bnN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBzdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgbWVyZ2VDb25mbGljdHM6IFByb3BUeXBlcy5hcnJheU9mKE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUpLFxuICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBvcGVuRmlsZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc091cnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZUFzVGhlaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBtZXJnZUNvbmZsaWN0czogW10sXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBuZXcgUmVzb2x1dGlvblByb2dyZXNzKCksXG4gIH1cblxuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgU1RBR0lORzogU3ltYm9sKCdzdGFnaW5nJyksXG4gIH07XG5cbiAgc3RhdGljIGZpcnN0Rm9jdXMgPSBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HO1xuXG4gIHN0YXRpYyBsYXN0Rm9jdXMgPSBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdkYmxjbGlja09uSXRlbScsICdjb250ZXh0TWVudU9uSXRlbScsICdtb3VzZWRvd25Pbkl0ZW0nLCAnbW91c2Vtb3ZlT25JdGVtJywgJ21vdXNldXAnLCAncmVnaXN0ZXJJdGVtRWxlbWVudCcsXG4gICAgICAncmVuZGVyQm9keScsICdvcGVuRmlsZScsICdkaXNjYXJkQ2hhbmdlcycsICdhY3RpdmF0ZU5leHRMaXN0JywgJ2FjdGl2YXRlUHJldmlvdXNMaXN0JywgJ2FjdGl2YXRlTGFzdExpc3QnLFxuICAgICAgJ3N0YWdlQWxsJywgJ3Vuc3RhZ2VBbGwnLCAnc3RhZ2VBbGxNZXJnZUNvbmZsaWN0cycsICdkaXNjYXJkQWxsJywgJ2NvbmZpcm1TZWxlY3RlZEl0ZW1zJywgJ3NlbGVjdEFsbCcsXG4gICAgICAnc2VsZWN0Rmlyc3QnLCAnc2VsZWN0TGFzdCcsICdkaXZlSW50b1NlbGVjdGlvbicsICdzaG93RGlmZlZpZXcnLCAnc2hvd0J1bGtSZXNvbHZlTWVudScsICdzaG93QWN0aW9uc01lbnUnLFxuICAgICAgJ3Jlc29sdmVDdXJyZW50QXNPdXJzJywgJ3Jlc29sdmVDdXJyZW50QXNUaGVpcnMnLCAncXVpZXRseVNlbGVjdEl0ZW0nLCAnZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcycsXG4gICAgKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZ2l0aHViLmtleWJvYXJkTmF2aWdhdGlvbkRlbGF5JywgdmFsdWUgPT4ge1xuICAgICAgICBpZiAodmFsdWUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSA9IHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSA9IGRlYm91bmNlKHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC4uLmNhbGN1bGF0ZVRydW5jYXRlZExpc3RzKHtcbiAgICAgICAgdW5zdGFnZWRDaGFuZ2VzOiB0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgc3RhZ2VkQ2hhbmdlczogdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBtZXJnZUNvbmZsaWN0czogdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cyxcbiAgICAgIH0pLFxuICAgICAgc2VsZWN0aW9uOiBuZXcgQ29tcG9zaXRlTGlzdFNlbGVjdGlvbih7XG4gICAgICAgIGxpc3RzQnlLZXk6IFtcbiAgICAgICAgICBbJ3Vuc3RhZ2VkJywgdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXNdLFxuICAgICAgICAgIFsnY29uZmxpY3RzJywgdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c10sXG4gICAgICAgICAgWydzdGFnZWQnLCB0aGlzLnByb3BzLnN0YWdlZENoYW5nZXNdLFxuICAgICAgICBdLFxuICAgICAgICBpZEZvckl0ZW06IGl0ZW0gPT4gaXRlbS5maWxlUGF0aCxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMubGlzdEVsZW1lbnRzQnlJdGVtID0gbmV3IFdlYWtNYXAoKTtcbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKG5leHRQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgbGV0IG5leHRTdGF0ZSA9IHt9O1xuXG4gICAgaWYgKFxuICAgICAgWyd1bnN0YWdlZENoYW5nZXMnLCAnc3RhZ2VkQ2hhbmdlcycsICdtZXJnZUNvbmZsaWN0cyddLnNvbWUoa2V5ID0+IHByZXZTdGF0ZS5zb3VyY2Vba2V5XSAhPT0gbmV4dFByb3BzW2tleV0pXG4gICAgKSB7XG4gICAgICBjb25zdCBuZXh0TGlzdHMgPSBjYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyh7XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlczogbmV4dFByb3BzLnVuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgc3RhZ2VkQ2hhbmdlczogbmV4dFByb3BzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIG1lcmdlQ29uZmxpY3RzOiBuZXh0UHJvcHMubWVyZ2VDb25mbGljdHMsXG4gICAgICB9KTtcblxuICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAuLi5uZXh0TGlzdHMsXG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi51cGRhdGVMaXN0cyhbXG4gICAgICAgICAgWyd1bnN0YWdlZCcsIG5leHRMaXN0cy51bnN0YWdlZENoYW5nZXNdLFxuICAgICAgICAgIFsnY29uZmxpY3RzJywgbmV4dExpc3RzLm1lcmdlQ29uZmxpY3RzXSxcbiAgICAgICAgICBbJ3N0YWdlZCcsIG5leHRMaXN0cy5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgXSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCk7XG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKSksXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmlzUG9wdWxhdGVkKHRoaXMucHJvcHMpKSB7XG4gICAgICB0aGlzLnN5bmNXaXRoV29ya3NwYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgY29uc3QgaXNSZXBvU2FtZSA9IHByZXZQcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcbiAgICBjb25zdCBoYXNTZWxlY3Rpb25zUHJlc2VudCA9XG4gICAgICBwcmV2U3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMCAmJlxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemUgPiAwO1xuICAgIGNvbnN0IHNlbGVjdGlvbkNoYW5nZWQgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbiAhPT0gcHJldlN0YXRlLnNlbGVjdGlvbjtcblxuICAgIGlmIChpc1JlcG9TYW1lICYmIGhhc1NlbGVjdGlvbnNQcmVzZW50ICYmIHNlbGVjdGlvbkNoYW5nZWQpIHtcbiAgICAgIHRoaXMuZGVib3VuY2VkRGlkQ2hhbmdlU2VsZWN0ZWRJdGVtKCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZEl0ZW0gPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRIZWFkSXRlbSgpO1xuICAgIGlmIChoZWFkSXRlbSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMubGlzdEVsZW1lbnRzQnlJdGVtLmdldChoZWFkSXRlbSk7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNQb3B1bGF0ZWQocHJldlByb3BzKSAmJiB0aGlzLmlzUG9wdWxhdGVkKHRoaXMucHJvcHMpKSB7XG4gICAgICB0aGlzLnN5bmNXaXRoV29ya3NwYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc30gZmV0Y2hEYXRhPXtub29wfT5cbiAgICAgICAge3RoaXMucmVuZGVyQm9keX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJCb2R5KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldyAke3RoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKX0tY2hhbmdlcy1mb2N1c2VkYH1cbiAgICAgICAgdGFiSW5kZXg9XCItMVwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItVW5zdGFnZWRDaGFuZ2VzICR7dGhpcy5nZXRGb2N1c0NsYXNzKCd1bnN0YWdlZCcpfWB9PlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWxpc3QtdW5vcmRlcmVkXCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPlVuc3RhZ2VkIENoYW5nZXM8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJBY3Rpb25zTWVudSgpfVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLWRvd25cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnN0YWdlQWxsfT5TdGFnZSBBbGw8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctdW5zdGFnZWRcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51bnN0YWdlZENoYW5nZXMubWFwKGZpbGVQYXRjaCA9PiAoXG4gICAgICAgICAgICAgICAgPEZpbGVQYXRjaExpc3RJdGVtVmlld1xuICAgICAgICAgICAgICAgICAga2V5PXtmaWxlUGF0Y2guZmlsZVBhdGh9XG4gICAgICAgICAgICAgICAgICByZWdpc3Rlckl0ZW1FbGVtZW50PXt0aGlzLnJlZ2lzdGVySXRlbUVsZW1lbnR9XG4gICAgICAgICAgICAgICAgICBmaWxlUGF0Y2g9e2ZpbGVQYXRjaH1cbiAgICAgICAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e2V2ZW50ID0+IHRoaXMuZGJsY2xpY2tPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbkNvbnRleHRNZW51PXtldmVudCA9PiB0aGlzLmNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMubW91c2Vkb3duT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZU1vdmU9e2V2ZW50ID0+IHRoaXMubW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkSXRlbXMuaGFzKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlck1lcmdlQ29uZmxpY3RzKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2l0aHViLVN0YWdpbmdWaWV3LWdyb3VwIGdpdGh1Yi1TdGFnZWRDaGFuZ2VzICR7dGhpcy5nZXRGb2N1c0NsYXNzKCdzdGFnZWQnKX1gfSA+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdGFza2xpc3RcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LXRpdGxlXCI+XG4gICAgICAgICAgICAgIFN0YWdlZCBDaGFuZ2VzXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gaWNvbiBpY29uLW1vdmUtdXBcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy51bnN0YWdlQWxsfT5VbnN0YWdlIEFsbDwvYnV0dG9uPlxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWxpc3QgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3IGdpdGh1Yi1TdGFnaW5nVmlldy1zdGFnZWRcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gKFxuICAgICAgICAgICAgICAgIDxGaWxlUGF0Y2hMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgIGtleT17ZmlsZVBhdGNoLmZpbGVQYXRofVxuICAgICAgICAgICAgICAgICAgZmlsZVBhdGNoPXtmaWxlUGF0Y2h9XG4gICAgICAgICAgICAgICAgICByZWdpc3Rlckl0ZW1FbGVtZW50PXt0aGlzLnJlZ2lzdGVySXRlbUVsZW1lbnR9XG4gICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZSh0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItU3RhZ2luZ1ZpZXdcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXVwXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0UHJldmlvdXMoKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLWRvd25cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3ROZXh0KCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS1sZWZ0XCIgY2FsbGJhY2s9e3RoaXMuZGl2ZUludG9TZWxlY3Rpb259IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzaG93LWRpZmYtdmlld1wiIGNhbGxiYWNrPXt0aGlzLnNob3dEaWZmVmlld30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtdXBcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RQcmV2aW91cyh0cnVlKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtZG93blwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdE5leHQodHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LWFsbFwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdEFsbH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXRvLXRvcFwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdEZpcnN0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtdG8tYm90dG9tXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0TGFzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtdG8tdG9wXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0Rmlyc3QodHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXRvLWJvdHRvbVwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdExhc3QodHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIGNhbGxiYWNrPXt0aGlzLmNvbmZpcm1TZWxlY3RlZEl0ZW1zfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6YWN0aXZhdGUtbmV4dC1saXN0XCIgY2FsbGJhY2s9e3RoaXMuYWN0aXZhdGVOZXh0TGlzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFjdGl2YXRlLXByZXZpb3VzLWxpc3RcIiBjYWxsYmFjaz17dGhpcy5hY3RpdmF0ZVByZXZpb3VzTGlzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmp1bXAtdG8tZmlsZVwiIGNhbGxiYWNrPXt0aGlzLm9wZW5GaWxlfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cmVzb2x2ZS1maWxlLWFzLW91cnNcIiBjYWxsYmFjaz17dGhpcy5yZXNvbHZlQ3VycmVudEFzT3Vyc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtZmlsZS1hcy10aGVpcnNcIiBjYWxsYmFjaz17dGhpcy5yZXNvbHZlQ3VycmVudEFzVGhlaXJzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGlzY2FyZC1jaGFuZ2VzLWluLXNlbGVjdGVkLWZpbGVzXCIgY2FsbGJhY2s9e3RoaXMuZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTp1bmRvXCIgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvfSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdGFnZS1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLnN0YWdlQWxsfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dW5zdGFnZS1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLnVuc3RhZ2VBbGx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXNjYXJkLWFsbC1jaGFuZ2VzXCIgY2FsbGJhY2s9e3RoaXMuZGlzY2FyZEFsbEZyb21Db21tYW5kfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dW5kby1sYXN0LWRpc2NhcmQtaW4tZ2l0LXRhYlwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy51bmRvTGFzdERpc2NhcmRGcm9tQ29tbWFuZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdjb3JlOnVuZG8nfX0pO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmQgPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1Yjp1bmRvLWxhc3QtZGlzY2FyZC1pbi1naXQtdGFiJ319KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24gPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiAnYnV0dG9uJ30pO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUhlYWRlck1lbnUgPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSk7XG4gIH1cblxuICBkaXNjYXJkQ2hhbmdlc0Zyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMuZGlzY2FyZENoYW5nZXMoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLWNoYW5nZXMtaW4tc2VsZWN0ZWQtZmlsZXMnfX0pO1xuICB9XG5cbiAgZGlzY2FyZEFsbEZyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMuZGlzY2FyZEFsbCh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnZ2l0aHViOmRpc2NhcmQtYWxsLWNoYW5nZXMnfX0pO1xuICB9XG5cbiAgcmVuZGVyQWN0aW9uc01lbnUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCB8fCB0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uLS1pY29uT25seSBpY29uIGljb24tZWxsaXBzZXNcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2hvd0FjdGlvbnNNZW51fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVW5kb0J1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24tLWZ1bGxXaWR0aCBpY29uIGljb24taGlzdG9yeVwiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbn0+VW5kbyBEaXNjYXJkPC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRydW5jYXRlZE1lc3NhZ2UobGlzdCkge1xuICAgIGlmIChsaXN0Lmxlbmd0aCA+IE1BWElNVU1fTElTVEVEX0VOVFJJRVMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWdyb3VwLXRydW5jYXRlZE1zZ1wiPlxuICAgICAgICAgIExpc3QgdHJ1bmNhdGVkIHRvIHRoZSBmaXJzdCB7TUFYSU1VTV9MSVNURURfRU5UUklFU30gaXRlbXNcbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJNZXJnZUNvbmZsaWN0cygpIHtcbiAgICBjb25zdCBtZXJnZUNvbmZsaWN0cyA9IHRoaXMuc3RhdGUubWVyZ2VDb25mbGljdHM7XG5cbiAgICBpZiAobWVyZ2VDb25mbGljdHMgJiYgbWVyZ2VDb25mbGljdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgIGNvbnN0IHJlc29sdXRpb25Qcm9ncmVzcyA9IHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzO1xuICAgICAgY29uc3QgYW55VW5yZXNvbHZlZCA9IG1lcmdlQ29uZmxpY3RzXG4gICAgICAgIC5tYXAoY29uZmxpY3QgPT4gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIGNvbmZsaWN0LmZpbGVQYXRoKSlcbiAgICAgICAgLnNvbWUoY29uZmxpY3RQYXRoID0+IHJlc29sdXRpb25Qcm9ncmVzcy5nZXRSZW1haW5pbmcoY29uZmxpY3RQYXRoKSAhPT0gMCk7XG5cbiAgICAgIGNvbnN0IGJ1bGtSZXNvbHZlRHJvcGRvd24gPSBhbnlVbnJlc29sdmVkID8gKFxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1ibG9jayBpY29uIGljb24tZWxsaXBzZXNcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2hvd0J1bGtSZXNvbHZlTWVudX1cbiAgICAgICAgLz5cbiAgICAgICkgOiBudWxsO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItTWVyZ2VDb25mbGljdFBhdGhzICR7dGhpcy5nZXRGb2N1c0NsYXNzKCdjb25mbGljdHMnKX1gfT5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17J2dpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1pY29uIGljb24gaWNvbi1hbGVydCBzdGF0dXMtbW9kaWZpZWQnfSAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LXRpdGxlXCI+TWVyZ2UgQ29uZmxpY3RzPC9zcGFuPlxuICAgICAgICAgICAge2J1bGtSZXNvbHZlRHJvcGRvd259XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gaWNvbiBpY29uLW1vdmUtZG93blwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXthbnlVbnJlc29sdmVkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnN0YWdlQWxsTWVyZ2VDb25mbGljdHN9PlxuICAgICAgICAgICAgICBTdGFnZSBBbGxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWxpc3QgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3IGdpdGh1Yi1TdGFnaW5nVmlldy1tZXJnZVwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXJnZUNvbmZsaWN0cy5tYXAobWVyZ2VDb25mbGljdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgbWVyZ2VDb25mbGljdC5maWxlUGF0aCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPE1lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgICAga2V5PXtmdWxsUGF0aH1cbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VDb25mbGljdD17bWVyZ2VDb25mbGljdH1cbiAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nQ29uZmxpY3RzPXtyZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGZ1bGxQYXRoKX1cbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKG1lcmdlQ29uZmxpY3RzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPG5vc2NyaXB0IC8+O1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLCBpdGVtID0+IGl0ZW0uZmlsZVBhdGgpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkgIT09ICdjb25mbGljdHMnKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICB9XG5cbiAgb3BlbkZpbGUoKSB7XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuRmlsZXMoZmlsZVBhdGhzKTtcbiAgfVxuXG4gIGRpc2NhcmRDaGFuZ2VzKHtldmVudFNvdXJjZX0gPSB7fSkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgYWRkRXZlbnQoJ2Rpc2NhcmQtdW5zdGFnZWQtY2hhbmdlcycsIHtcbiAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgY29tcG9uZW50OiAnU3RhZ2luZ1ZpZXcnLFxuICAgICAgZmlsZUNvdW50OiBmaWxlUGF0aHMubGVuZ3RoLFxuICAgICAgdHlwZTogJ3NlbGVjdGVkJyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocyk7XG4gIH1cblxuICBhY3RpdmF0ZU5leHRMaXN0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBhZHZhbmNlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwcmV2U3RhdGUuc2VsZWN0aW9uLmFjdGl2YXRlTmV4dFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAocHJldlN0YXRlLnNlbGVjdGlvbiA9PT0gbmV4dCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkdmFuY2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IG5leHQuY29hbGVzY2UoKX07XG4gICAgICB9LCAoKSA9PiByZXNvbHZlKGFkdmFuY2VkKSk7XG4gICAgfSk7XG4gIH1cblxuICBhY3RpdmF0ZVByZXZpb3VzTGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgcmV0cmVhdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwcmV2U3RhdGUuc2VsZWN0aW9uLmFjdGl2YXRlUHJldmlvdXNTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXRyZWF0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogbmV4dC5jb2FsZXNjZSgpfTtcbiAgICAgIH0sICgpID0+IHJlc29sdmUocmV0cmVhdGVkKSk7XG4gICAgfSk7XG4gIH1cblxuICBhY3RpdmF0ZUxhc3RMaXN0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBlbXB0eVNlbGVjdGlvbiA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZUxhc3RTZWxlY3Rpb24oKTtcbiAgICAgICAgZW1wdHlTZWxlY3Rpb24gPSBuZXh0LmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMDtcblxuICAgICAgICBpZiAocHJldlN0YXRlLnNlbGVjdGlvbiA9PT0gbmV4dCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBuZXh0LmNvYWxlc2NlKCl9O1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZShlbXB0eVNlbGVjdGlvbikpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhZ2VBbGwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbigndW5zdGFnZWQnKTtcbiAgfVxuXG4gIHVuc3RhZ2VBbGwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24oJ3N0YWdlZCcpO1xuICB9XG5cbiAgc3RhZ2VBbGxNZXJnZUNvbmZsaWN0cygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLm1hcChjb25mbGljdCA9PiBjb25mbGljdC5maWxlUGF0aCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihmaWxlUGF0aHMsICd1bnN0YWdlZCcpO1xuICB9XG5cbiAgZGlzY2FyZEFsbCh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBpZiAodGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubWFwKGZpbGVQYXRjaCA9PiBmaWxlUGF0Y2guZmlsZVBhdGgpO1xuICAgIGFkZEV2ZW50KCdkaXNjYXJkLXVuc3RhZ2VkLWNoYW5nZXMnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGZpbGVDb3VudDogZmlsZVBhdGhzLmxlbmd0aCxcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgZXZlbnRTb3VyY2UsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMoZmlsZVBhdGhzKTtcbiAgfVxuXG4gIGNvbmZpcm1TZWxlY3RlZEl0ZW1zID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGl0ZW1QYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKGl0ZW1QYXRocywgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7c2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmNvYWxlc2NlKCl9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXROZXh0TGlzdFVwZGF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldE5leHRVcGRhdGVQcm9taXNlKCk7XG4gIH1cblxuICBzZWxlY3RQcmV2aW91cyhwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RQcmV2aW91c0l0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0TmV4dChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3ROZXh0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RBbGwoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEFsbEl0ZW1zKCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdEZpcnN0KHByZXNlcnZlVGFpbCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEZpcnN0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RMYXN0KHByZXNlcnZlVGFpbCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdExhc3RJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRpdmVJbnRvU2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMuc2l6ZSAhPT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXMudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG5cbiAgICBpZiAoc3RhZ2luZ1N0YXR1cyA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHthY3RpdmF0ZTogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7YWN0aXZhdGU6IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzeW5jV2l0aFdvcmtzcGFjZSgpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWFsSXRlbVByb21pc2UgPSBpdGVtLmdldFJlYWxJdGVtUHJvbWlzZSAmJiBpdGVtLmdldFJlYWxJdGVtUHJvbWlzZSgpO1xuICAgIGNvbnN0IHJlYWxJdGVtID0gYXdhaXQgcmVhbEl0ZW1Qcm9taXNlO1xuICAgIGlmICghcmVhbEl0ZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc0ZpbGVQYXRjaEl0ZW0gPSByZWFsSXRlbS5pc0ZpbGVQYXRjaEl0ZW0gJiYgcmVhbEl0ZW0uaXNGaWxlUGF0Y2hJdGVtKCk7XG4gICAgY29uc3QgaXNNYXRjaCA9IHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkgJiYgcmVhbEl0ZW0uZ2V0V29ya2luZ0RpcmVjdG9yeSgpID09PSB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuXG4gICAgaWYgKGlzRmlsZVBhdGNoSXRlbSAmJiBpc01hdGNoKSB7XG4gICAgICB0aGlzLnF1aWV0bHlTZWxlY3RJdGVtKHJlYWxJdGVtLmdldEZpbGVQYXRoKCksIHJlYWxJdGVtLmdldFN0YWdpbmdTdGF0dXMoKSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2hvd0RpZmZWaWV3KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMuc2l6ZSAhPT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXMudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG5cbiAgICBpZiAoc3RhZ2luZ1N0YXR1cyA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpKTtcbiAgICB9XG4gIH1cblxuICBzaG93QnVsa1Jlc29sdmVNZW51KGV2ZW50KSB7XG4gICAgY29uc3QgY29uZmxpY3RQYXRocyA9IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubWFwKGMgPT4gYy5maWxlUGF0aCk7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdSZXNvbHZlIEFsbCBhcyBPdXJzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnByb3BzLnJlc29sdmVBc091cnMoY29uZmxpY3RQYXRocyksXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBBbGwgYXMgVGhlaXJzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnByb3BzLnJlc29sdmVBc1RoZWlycyhjb25mbGljdFBhdGhzKSxcbiAgICB9KSk7XG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpO1xuICB9XG5cbiAgc2hvd0FjdGlvbnNNZW51KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtQ291bnQgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZTtcbiAgICBjb25zdCBwbHVyYWxpemF0aW9uID0gc2VsZWN0ZWRJdGVtQ291bnQgPiAxID8gJ3MnIDogJyc7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdEaXNjYXJkIEFsbCBDaGFuZ2VzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmRpc2NhcmRBbGwoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSksXG4gICAgICBlbmFibGVkOiB0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ0Rpc2NhcmQgQ2hhbmdlcyBpbiBTZWxlY3RlZCBGaWxlJyArIHBsdXJhbGl6YXRpb24sXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5kaXNjYXJkQ2hhbmdlcyh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KSxcbiAgICAgIGVuYWJsZWQ6ICEhKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCAmJiBzZWxlY3RlZEl0ZW1Db3VudCksXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnVW5kbyBMYXN0IERpc2NhcmQnLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pLFxuICAgICAgZW5hYmxlZDogdGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSxcbiAgICB9KSk7XG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpO1xuICB9XG5cbiAgcmVzb2x2ZUN1cnJlbnRBc091cnMoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzKHRoaXMuZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzKCkpO1xuICB9XG5cbiAgcmVzb2x2ZUN1cnJlbnRBc1RoZWlycygpIHtcbiAgICB0aGlzLnByb3BzLnJlc29sdmVBc1RoZWlycyh0aGlzLmdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpKTtcbiAgfVxuXG4gIC8vIERpcmVjdGx5IG1vZGlmeSB0aGUgc2VsZWN0aW9uIHRvIGluY2x1ZGUgb25seSB0aGUgaXRlbSBpZGVudGlmaWVkIGJ5IHRoZSBmaWxlIHBhdGggYW5kIHN0YWdpbmdTdGF0dXMgdHVwbGUuXG4gIC8vIFJlLXJlbmRlciB0aGUgY29tcG9uZW50LCBidXQgZG9uJ3Qgbm90aWZ5IGRpZFNlbGVjdFNpbmdsZUl0ZW0oKSBvciBvdGhlciBjYWxsYmFjayBmdW5jdGlvbnMuIFRoaXMgaXMgdXNlZnVsIHRvXG4gIC8vIGF2b2lkIGNpcmN1bGFyIGNhbGxiYWNrIGxvb3BzIGZvciBhY3Rpb25zIG9yaWdpbmF0aW5nIGluIEZpbGVQYXRjaFZpZXcgb3IgVGV4dEVkaXRvcnMgd2l0aCBtZXJnZSBjb25mbGljdHMuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gcHJldlN0YXRlLnNlbGVjdGlvbi5maW5kSXRlbSgoZWFjaCwga2V5KSA9PiBlYWNoLmZpbGVQYXRoID09PSBmaWxlUGF0aCAmJiBrZXkgPT09IHN0YWdpbmdTdGF0dXMpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAvLyBGSVhNRTogbWFrZSBzdGFnaW5nIHZpZXcgZGlzcGxheSBubyBzZWxlY3RlZCBpdGVtXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmxvZyhgVW5hYmxlIHRvIGZpbmQgaXRlbSBhdCBwYXRoICR7ZmlsZVBhdGh9IHdpdGggc3RhZ2luZyBzdGF0dXMgJHtzdGFnaW5nU3RhdHVzfWApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtKX07XG4gICAgICB9LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkSXRlbXMoKSB7XG4gICAgY29uc3Qgc3RhZ2luZ1N0YXR1cyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCksIGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmlsZVBhdGg6IGl0ZW0uZmlsZVBhdGgsXG4gICAgICAgIHN0YWdpbmdTdGF0dXMsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyhvcGVuTmV3KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuZGlkU2VsZWN0U2luZ2xlSXRlbShzZWxlY3RlZEl0ZW1zWzBdLCBvcGVuTmV3KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkaWRTZWxlY3RTaW5nbGVJdGVtKHNlbGVjdGVkSXRlbSwgb3Blbk5ldyA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpID09PSAnY29uZmxpY3RzJykge1xuICAgICAgaWYgKG9wZW5OZXcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93TWVyZ2VDb25mbGljdEZpbGVGb3JQYXRoKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwge2FjdGl2YXRlOiB0cnVlfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcGVuTmV3KSB7XG4gICAgICAgIC8vIFVzZXIgZXhwbGljaXRseSBhc2tlZCB0byB2aWV3IGRpZmYsIHN1Y2ggYXMgdmlhIGNsaWNrXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHthY3RpdmF0ZTogZmFsc2V9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZSA9IHRoaXMuZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSgpO1xuICAgICAgICBpZiAocGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBVcGRhdGUgc3RhbGUgaXRlbXMgdG8gcmVmbGVjdCBuZXcgc2VsZWN0aW9uXG4gICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlLm1hcChhc3luYyBwYW5lID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHtcbiAgICAgICAgICAgICAgYWN0aXZhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICBwYW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNlbGVjdGlvbiB3YXMgY2hhbmdlZCB2aWEga2V5Ym9hcmQgbmF2aWdhdGlvbiwgdXBkYXRlIHBlbmRpbmcgaXRlbSBpbiBhY3RpdmUgcGFuZVxuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKCk7XG4gICAgICAgICAgY29uc3QgYWN0aXZlUGVuZGluZ0l0ZW0gPSBhY3RpdmVQYW5lLmdldFBlbmRpbmdJdGVtKCk7XG4gICAgICAgICAgY29uc3QgYWN0aXZlUGFuZUhhc1BlbmRpbmdGaWxlUGF0Y2hJdGVtID0gYWN0aXZlUGVuZGluZ0l0ZW0gJiYgYWN0aXZlUGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0gJiZcbiAgICAgICAgICAgIGFjdGl2ZVBlbmRpbmdJdGVtLmdldFJlYWxJdGVtKCkgaW5zdGFuY2VvZiBDaGFuZ2VkRmlsZUl0ZW07XG4gICAgICAgICAgaWYgKGFjdGl2ZVBhbmVIYXNQZW5kaW5nRmlsZVBhdGNoSXRlbSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge1xuICAgICAgICAgICAgICBhY3RpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHBhbmU6IGFjdGl2ZVBhbmUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRQYW5lc1dpdGhTdGFsZVBlbmRpbmdGaWxlUGF0Y2hJdGVtKCkge1xuICAgIC8vIFwic3RhbGVcIiBtZWFuaW5nIHRoZXJlIGlzIG5vIGxvbmdlciBhIGNoYW5nZWQgZmlsZSBhc3NvY2lhdGVkIHdpdGggaXRlbVxuICAgIC8vIGR1ZSB0byBjaGFuZ2VzIGJlaW5nIGZ1bGx5IHN0YWdlZC91bnN0YWdlZC9zdGFzaGVkL2RlbGV0ZWQvZXRjXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLmdldFBhbmVzKCkuZmlsdGVyKHBhbmUgPT4ge1xuICAgICAgY29uc3QgcGVuZGluZ0l0ZW0gPSBwYW5lLmdldFBlbmRpbmdJdGVtKCk7XG4gICAgICBpZiAoIXBlbmRpbmdJdGVtIHx8ICFwZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGNvbnN0IHJlYWxJdGVtID0gcGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0oKTtcbiAgICAgIGlmICghKHJlYWxJdGVtIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBXZSBvbmx5IHdhbnQgdG8gdXBkYXRlIHBlbmRpbmcgZGlmZiB2aWV3cyBmb3IgY3VycmVudGx5IGFjdGl2ZSByZXBvXG4gICAgICBjb25zdCBpc0luQWN0aXZlUmVwbyA9IHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkoKSA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcbiAgICAgIGNvbnN0IGlzU3RhbGUgPSAhdGhpcy5jaGFuZ2VkRmlsZUV4aXN0cyhyZWFsSXRlbS5nZXRGaWxlUGF0aCgpLCByZWFsSXRlbS5nZXRTdGFnaW5nU3RhdHVzKCkpO1xuICAgICAgcmV0dXJuIGlzSW5BY3RpdmVSZXBvICYmIGlzU3RhbGU7XG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VkRmlsZUV4aXN0cyhmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5maW5kSXRlbSgoaXRlbSwga2V5KSA9PiB7XG4gICAgICByZXR1cm4ga2V5ID09PSBzdGFnaW5nU3RhdHVzICYmIGl0ZW0uZmlsZVBhdGggPT09IGZpbGVQYXRoO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2hvd0ZpbGVQYXRjaEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMsIHthY3RpdmF0ZSwgcGFuZX0gPSB7YWN0aXZhdGU6IGZhbHNlfSkge1xuICAgIGNvbnN0IHVyaSA9IENoYW5nZWRGaWxlSXRlbS5idWlsZFVSSShmaWxlUGF0aCwgdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gICAgY29uc3QgY2hhbmdlZEZpbGVJdGVtID0gYXdhaXQgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgIHVyaSwge3BlbmRpbmc6IHRydWUsIGFjdGl2YXRlUGFuZTogYWN0aXZhdGUsIGFjdGl2YXRlSXRlbTogYWN0aXZhdGUsIHBhbmV9LFxuICAgICk7XG4gICAgaWYgKGFjdGl2YXRlKSB7XG4gICAgICBjb25zdCBpdGVtUm9vdCA9IGNoYW5nZWRGaWxlSXRlbS5nZXRFbGVtZW50KCk7XG4gICAgICBjb25zdCBmb2N1c1Jvb3QgPSBpdGVtUm9vdC5xdWVyeVNlbGVjdG9yKCdbdGFiSW5kZXhdJyk7XG4gICAgICBpZiAoZm9jdXNSb290KSB7XG4gICAgICAgIGZvY3VzUm9vdC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzaW1wbHkgbWFrZSBpdGVtIHZpc2libGVcbiAgICAgIHRoaXMucHJvcHMud29ya3NwYWNlLnBhbmVGb3JJdGVtKGNoYW5nZWRGaWxlSXRlbSkuYWN0aXZhdGVJdGVtKGNoYW5nZWRGaWxlSXRlbSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChyZWxhdGl2ZUZpbGVQYXRoLCB7YWN0aXZhdGV9ID0ge2FjdGl2YXRlOiBmYWxzZX0pIHtcbiAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgcmVsYXRpdmVGaWxlUGF0aCk7XG4gICAgaWYgKGF3YWl0IHRoaXMuZmlsZUV4aXN0cyhhYnNvbHV0ZVBhdGgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihhYnNvbHV0ZVBhdGgsIHthY3RpdmF0ZVBhbmU6IGFjdGl2YXRlLCBhY3RpdmF0ZUl0ZW06IGFjdGl2YXRlLCBwZW5kaW5nOiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRJbmZvKCdGaWxlIGhhcyBiZWVuIGRlbGV0ZWQuJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmaWxlRXhpc3RzKGFic29sdXRlUGF0aCkge1xuICAgIHJldHVybiBuZXcgRmlsZShhYnNvbHV0ZVBhdGgpLmV4aXN0cygpO1xuICB9XG5cbiAgZGJsY2xpY2tPbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKFtpdGVtLmZpbGVQYXRoXSwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24ubGlzdEtleUZvckl0ZW0oaXRlbSkpO1xuICB9XG5cbiAgYXN5bmMgY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5oYXMoaXRlbSkpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCBldmVudC5zaGlmdEtleSksXG4gICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXdFdmVudCA9IG5ldyBNb3VzZUV2ZW50KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGlmICghZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICBjb25zdCB3aW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbiAgICBpZiAoZXZlbnQuY3RybEtleSAmJiAhd2luZG93cykgeyByZXR1cm47IH0gLy8gc2ltcGx5IG9wZW4gY29udGV4dCBtZW51XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuXG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgaWYgKGV2ZW50Lm1ldGFLZXkgfHwgKGV2ZW50LmN0cmxLZXkgJiYgd2luZG93cykpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmFkZE9yU3VidHJhY3RTZWxlY3Rpb24oaXRlbSksXG4gICAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCBldmVudC5zaGlmdEtleSksXG4gICAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICBpZiAodGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RJdGVtKGl0ZW0sIHRydWUpLFxuICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtb3VzZXVwKCkge1xuICAgIGNvbnN0IGhhZFNlbGVjdGlvbkluUHJvZ3Jlc3MgPSB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcztcbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgICBpZiAoaGFkU2VsZWN0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhZGRFdmVudCgndW5kby1sYXN0LWRpc2NhcmQnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmQoKTtcbiAgfVxuXG4gIGdldEZvY3VzQ2xhc3MobGlzdEtleSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkgPT09IGxpc3RLZXkgPyAnaXMtZm9jdXNlZCcgOiAnJztcbiAgfVxuXG4gIHJlZ2lzdGVySXRlbUVsZW1lbnQoaXRlbSwgZWxlbWVudCkge1xuICAgIHRoaXMubGlzdEVsZW1lbnRzQnlJdGVtLnNldChpdGVtLCBlbGVtZW50KTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSA/IFN0YWdpbmdWaWV3LmZvY3VzLlNUQUdJTkcgOiBudWxsO1xuICB9XG5cbiAgc2V0Rm9jdXMoZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORykge1xuICAgICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuZm9jdXMoKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBhZHZhbmNlRm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkcpIHtcbiAgICAgIGlmIChhd2FpdCB0aGlzLmFjdGl2YXRlTmV4dExpc3QoKSkge1xuICAgICAgICAvLyBUaGVyZSB3YXMgYSBuZXh0IGxpc3QgdG8gYWN0aXZhdGUuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkc7XG4gICAgICB9XG5cbiAgICAgIC8vIFdlIHdlcmUgYWxyZWFkeSBvbiB0aGUgbGFzdCBsaXN0LlxuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZmlyc3RGb2N1cztcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIHJldHJlYXRGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZmlyc3RGb2N1cykge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZUxhc3RMaXN0KCk7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HKSB7XG4gICAgICBhd2FpdCB0aGlzLmFjdGl2YXRlUHJldmlvdXNMaXN0KCk7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgaXNQb3B1bGF0ZWQocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGggIT0gbnVsbCAmJiAoXG4gICAgICBwcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMCB8fFxuICAgICAgcHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID4gMCB8fFxuICAgICAgcHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwXG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdz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