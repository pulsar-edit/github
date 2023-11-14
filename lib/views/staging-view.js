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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2VsZWN0cm9uIiwiX2F0b20iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wcm9wVHlwZXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3BhdGgiLCJfcHJvcFR5cGVzMiIsIl9maWxlUGF0Y2hMaXN0SXRlbVZpZXciLCJfb2JzZXJ2ZU1vZGVsIiwiX21lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXciLCJfY29tcG9zaXRlTGlzdFNlbGVjdGlvbiIsIl9yZXNvbHV0aW9uUHJvZ3Jlc3MiLCJfY29tbWl0VmlldyIsIl9yZWZIb2xkZXIiLCJfY2hhbmdlZEZpbGVJdGVtIiwiX2NvbW1hbmRzIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiTWVudSIsIk1lbnVJdGVtIiwicmVtb3RlIiwiZGVib3VuY2UiLCJmbiIsIndhaXQiLCJ0aW1lb3V0IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImNhbGN1bGF0ZVRydW5jYXRlZExpc3RzIiwibGlzdHMiLCJyZWR1Y2UiLCJhY2MiLCJsaXN0Iiwic291cmNlIiwiTUFYSU1VTV9MSVNURURfRU5UUklFUyIsInNsaWNlIiwibm9vcCIsIlN0YWdpbmdWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwidW5kb0xhc3REaXNjYXJkIiwiZXZlbnRTb3VyY2UiLCJjb21tYW5kIiwiZGlzY2FyZENoYW5nZXMiLCJkaXNjYXJkQWxsIiwiaXRlbVBhdGhzIiwiZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzIiwiYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbiIsInN0YXRlIiwic2VsZWN0aW9uIiwiZ2V0QWN0aXZlTGlzdEtleSIsInNldFN0YXRlIiwicHJldlN0YXRlIiwiY29hbGVzY2UiLCJhdXRvYmluZCIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiYXRvbSIsImNvbmZpZyIsIm9ic2VydmUiLCJkZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0iLCJkaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zIiwidW5zdGFnZWRDaGFuZ2VzIiwic3RhZ2VkQ2hhbmdlcyIsIm1lcmdlQ29uZmxpY3RzIiwiQ29tcG9zaXRlTGlzdFNlbGVjdGlvbiIsImxpc3RzQnlLZXkiLCJpZEZvckl0ZW0iLCJpdGVtIiwiZmlsZVBhdGgiLCJtb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MiLCJsaXN0RWxlbWVudHNCeUl0ZW0iLCJyZWZSb290IiwiUmVmSG9sZGVyIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwic29tZSIsIm5leHRMaXN0cyIsInVwZGF0ZUxpc3RzIiwiY29tcG9uZW50RGlkTW91bnQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwibW91c2V1cCIsImFkZCIsIkRpc3Bvc2FibGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwid29ya3NwYWNlIiwib25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSIsInN5bmNXaXRoV29ya3NwYWNlIiwiaXNQb3B1bGF0ZWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJpc1JlcG9TYW1lIiwid29ya2luZ0RpcmVjdG9yeVBhdGgiLCJoYXNTZWxlY3Rpb25zUHJlc2VudCIsImdldFNlbGVjdGVkSXRlbXMiLCJzaXplIiwic2VsZWN0aW9uQ2hhbmdlZCIsImhlYWRJdGVtIiwiZ2V0SGVhZEl0ZW0iLCJlbGVtZW50Iiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsInJlbmRlciIsImNyZWF0ZUVsZW1lbnQiLCJtb2RlbCIsInJlc29sdXRpb25Qcm9ncmVzcyIsImZldGNoRGF0YSIsInJlbmRlckJvZHkiLCJzZWxlY3RlZEl0ZW1zIiwicmVmIiwic2V0dGVyIiwiY2xhc3NOYW1lIiwidGFiSW5kZXgiLCJyZW5kZXJDb21tYW5kcyIsImdldEZvY3VzQ2xhc3MiLCJyZW5kZXJBY3Rpb25zTWVudSIsImRpc2FibGVkIiwib25DbGljayIsInN0YWdlQWxsIiwibWFwIiwiZmlsZVBhdGNoIiwicmVnaXN0ZXJJdGVtRWxlbWVudCIsIm9uRG91YmxlQ2xpY2siLCJldmVudCIsImRibGNsaWNrT25JdGVtIiwib25Db250ZXh0TWVudSIsImNvbnRleHRNZW51T25JdGVtIiwib25Nb3VzZURvd24iLCJtb3VzZWRvd25Pbkl0ZW0iLCJvbk1vdXNlTW92ZSIsIm1vdXNlbW92ZU9uSXRlbSIsInNlbGVjdGVkIiwicmVuZGVyVHJ1bmNhdGVkTWVzc2FnZSIsInJlbmRlck1lcmdlQ29uZmxpY3RzIiwidW5zdGFnZUFsbCIsIkZyYWdtZW50IiwicmVnaXN0cnkiLCJjb21tYW5kcyIsInRhcmdldCIsIkNvbW1hbmQiLCJjYWxsYmFjayIsInNlbGVjdFByZXZpb3VzIiwic2VsZWN0TmV4dCIsImRpdmVJbnRvU2VsZWN0aW9uIiwic2hvd0RpZmZWaWV3Iiwic2VsZWN0QWxsIiwic2VsZWN0Rmlyc3QiLCJzZWxlY3RMYXN0IiwiY29uZmlybVNlbGVjdGVkSXRlbXMiLCJhY3RpdmF0ZU5leHRMaXN0IiwiYWN0aXZhdGVQcmV2aW91c0xpc3QiLCJvcGVuRmlsZSIsInJlc29sdmVDdXJyZW50QXNPdXJzIiwicmVzb2x2ZUN1cnJlbnRBc1RoZWlycyIsImRpc2NhcmRDaGFuZ2VzRnJvbUNvbW1hbmQiLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8iLCJkaXNjYXJkQWxsRnJvbUNvbW1hbmQiLCJ1bmRvTGFzdERpc2NhcmRGcm9tQ29tbWFuZCIsImhhc1VuZG9IaXN0b3J5Iiwic2hvd0FjdGlvbnNNZW51IiwicmVuZGVyVW5kb0J1dHRvbiIsInVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24iLCJhbnlVbnJlc29sdmVkIiwiY29uZmxpY3QiLCJwYXRoIiwiam9pbiIsImNvbmZsaWN0UGF0aCIsImdldFJlbWFpbmluZyIsImJ1bGtSZXNvbHZlRHJvcGRvd24iLCJzaG93QnVsa1Jlc29sdmVNZW51Iiwic3RhZ2VBbGxNZXJnZUNvbmZsaWN0cyIsIm1lcmdlQ29uZmxpY3QiLCJmdWxsUGF0aCIsInJlbWFpbmluZ0NvbmZsaWN0cyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsIkFycmF5IiwiZnJvbSIsImdldFNlbGVjdGVkQ29uZmxpY3RQYXRocyIsImZpbGVQYXRocyIsIm9wZW5GaWxlcyIsImFkZEV2ZW50IiwicGFja2FnZSIsImNvbXBvbmVudCIsImZpbGVDb3VudCIsInR5cGUiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsImFkdmFuY2VkIiwibmV4dCIsImFjdGl2YXRlTmV4dFNlbGVjdGlvbiIsInJldHJlYXRlZCIsImFjdGl2YXRlUHJldmlvdXNTZWxlY3Rpb24iLCJhY3RpdmF0ZUxhc3RMaXN0IiwiZW1wdHlTZWxlY3Rpb24iLCJhY3RpdmF0ZUxhc3RTZWxlY3Rpb24iLCJhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24iLCJnZXROZXh0TGlzdFVwZGF0ZVByb21pc2UiLCJnZXROZXh0VXBkYXRlUHJvbWlzZSIsInByZXNlcnZlVGFpbCIsInNlbGVjdFByZXZpb3VzSXRlbSIsInNlbGVjdE5leHRJdGVtIiwic2VsZWN0QWxsSXRlbXMiLCJzZWxlY3RGaXJzdEl0ZW0iLCJzZWxlY3RMYXN0SXRlbSIsInNlbGVjdGVkSXRlbSIsInZhbHVlcyIsInN0YWdpbmdTdGF0dXMiLCJzaG93TWVyZ2VDb25mbGljdEZpbGVGb3JQYXRoIiwiYWN0aXZhdGUiLCJzaG93RmlsZVBhdGNoSXRlbSIsImdldEFjdGl2ZVBhbmVJdGVtIiwicmVhbEl0ZW1Qcm9taXNlIiwiZ2V0UmVhbEl0ZW1Qcm9taXNlIiwicmVhbEl0ZW0iLCJpc0ZpbGVQYXRjaEl0ZW0iLCJpc01hdGNoIiwiZ2V0V29ya2luZ0RpcmVjdG9yeSIsInF1aWV0bHlTZWxlY3RJdGVtIiwiZ2V0RmlsZVBhdGgiLCJnZXRTdGFnaW5nU3RhdHVzIiwiY29uZmxpY3RQYXRocyIsImMiLCJwcmV2ZW50RGVmYXVsdCIsIm1lbnUiLCJhcHBlbmQiLCJsYWJlbCIsImNsaWNrIiwicmVzb2x2ZUFzT3VycyIsInJlc29sdmVBc1RoZWlycyIsInBvcHVwIiwiZ2V0Q3VycmVudFdpbmRvdyIsInNlbGVjdGVkSXRlbUNvdW50IiwicGx1cmFsaXphdGlvbiIsImVuYWJsZWQiLCJmaW5kSXRlbSIsImVhY2giLCJjb25zb2xlIiwibG9nIiwic2VsZWN0SXRlbSIsIm9wZW5OZXciLCJkaWRTZWxlY3RTaW5nbGVJdGVtIiwiaGFzRm9jdXMiLCJwYW5lc1dpdGhTdGFsZUl0ZW1zVG9VcGRhdGUiLCJnZXRQYW5lc1dpdGhTdGFsZVBlbmRpbmdGaWxlUGF0Y2hJdGVtIiwiYWxsIiwicGFuZSIsImFjdGl2ZVBhbmUiLCJnZXRDZW50ZXIiLCJnZXRBY3RpdmVQYW5lIiwiYWN0aXZlUGVuZGluZ0l0ZW0iLCJnZXRQZW5kaW5nSXRlbSIsImFjdGl2ZVBhbmVIYXNQZW5kaW5nRmlsZVBhdGNoSXRlbSIsImdldFJlYWxJdGVtIiwiQ2hhbmdlZEZpbGVJdGVtIiwiZ2V0UGFuZXMiLCJwZW5kaW5nSXRlbSIsImlzSW5BY3RpdmVSZXBvIiwiaXNTdGFsZSIsImNoYW5nZWRGaWxlRXhpc3RzIiwidXJpIiwiYnVpbGRVUkkiLCJjaGFuZ2VkRmlsZUl0ZW0iLCJvcGVuIiwicGVuZGluZyIsImFjdGl2YXRlUGFuZSIsImFjdGl2YXRlSXRlbSIsIml0ZW1Sb290IiwiZ2V0RWxlbWVudCIsImZvY3VzUm9vdCIsInF1ZXJ5U2VsZWN0b3IiLCJmb2N1cyIsInBhbmVGb3JJdGVtIiwicmVsYXRpdmVGaWxlUGF0aCIsImFic29sdXRlUGF0aCIsImZpbGVFeGlzdHMiLCJub3RpZmljYXRpb25NYW5hZ2VyIiwiYWRkSW5mbyIsIkZpbGUiLCJleGlzdHMiLCJsaXN0S2V5Rm9ySXRlbSIsInN0b3BQcm9wYWdhdGlvbiIsInBlcnNpc3QiLCJzaGlmdEtleSIsIm5ld0V2ZW50IiwiTW91c2VFdmVudCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInBhcmVudE5vZGUiLCJkaXNwYXRjaEV2ZW50Iiwid2luZG93cyIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsImN0cmxLZXkiLCJidXR0b24iLCJtZXRhS2V5IiwiYWRkT3JTdWJ0cmFjdFNlbGVjdGlvbiIsImhhZFNlbGVjdGlvbkluUHJvZ3Jlc3MiLCJsaXN0S2V5IiwiZ2V0Rm9jdXMiLCJyb290IiwiY29udGFpbnMiLCJnZXRPciIsIlNUQUdJTkciLCJzZXRGb2N1cyIsImFkdmFuY2VGb2N1c0Zyb20iLCJDb21taXRWaWV3IiwiZmlyc3RGb2N1cyIsInJldHJlYXRGb2N1c0Zyb20iLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIkZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlIiwic3RyaW5nIiwib2JqZWN0IiwiYm9vbCIsImZ1bmMiLCJSZXNvbHV0aW9uUHJvZ3Jlc3MiXSwic291cmNlcyI6WyJzdGFnaW5nLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcbmNvbnN0IHtNZW51LCBNZW51SXRlbX0gPSByZW1vdGU7XG5pbXBvcnQge0ZpbGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtGaWxlUGF0Y2hJdGVtUHJvcFR5cGUsIE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IEZpbGVQYXRjaExpc3RJdGVtVmlldyBmcm9tICcuL2ZpbGUtcGF0Y2gtbGlzdC1pdGVtLXZpZXcnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IE1lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXcgZnJvbSAnLi9tZXJnZS1jb25mbGljdC1saXN0LWl0ZW0tdmlldyc7XG5pbXBvcnQgQ29tcG9zaXRlTGlzdFNlbGVjdGlvbiBmcm9tICcuLi9tb2RlbHMvY29tcG9zaXRlLWxpc3Qtc2VsZWN0aW9uJztcbmltcG9ydCBSZXNvbHV0aW9uUHJvZ3Jlc3MgZnJvbSAnLi4vbW9kZWxzL2NvbmZsaWN0cy9yZXNvbHV0aW9uLXByb2dyZXNzJztcbmltcG9ydCBDb21taXRWaWV3IGZyb20gJy4vY29tbWl0LXZpZXcnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IGRlYm91bmNlID0gKGZuLCB3YWl0KSA9PiB7XG4gIGxldCB0aW1lb3V0O1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoZm4oLi4uYXJncykpO1xuICAgICAgfSwgd2FpdCk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBjYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyhsaXN0cykge1xuICByZXR1cm4gT2JqZWN0LmtleXMobGlzdHMpLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICBjb25zdCBsaXN0ID0gbGlzdHNba2V5XTtcbiAgICBhY2Muc291cmNlW2tleV0gPSBsaXN0O1xuICAgIGlmIChsaXN0Lmxlbmd0aCA8PSBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKSB7XG4gICAgICBhY2Nba2V5XSA9IGxpc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY1trZXldID0gbGlzdC5zbGljZSgwLCBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge3NvdXJjZToge319KTtcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHsgfTtcblxuY29uc3QgTUFYSU1VTV9MSVNURURfRU5UUklFUyA9IDEwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWdpbmdWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB1bnN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBzdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgbWVyZ2VDb25mbGljdHM6IFByb3BUeXBlcy5hcnJheU9mKE1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUpLFxuICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBoYXNVbmRvSGlzdG9yeTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBvcGVuRmlsZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc091cnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZUFzVGhlaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBtZXJnZUNvbmZsaWN0czogW10sXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBuZXcgUmVzb2x1dGlvblByb2dyZXNzKCksXG4gIH1cblxuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgU1RBR0lORzogU3ltYm9sKCdzdGFnaW5nJyksXG4gIH07XG5cbiAgc3RhdGljIGZpcnN0Rm9jdXMgPSBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HO1xuXG4gIHN0YXRpYyBsYXN0Rm9jdXMgPSBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdkYmxjbGlja09uSXRlbScsICdjb250ZXh0TWVudU9uSXRlbScsICdtb3VzZWRvd25Pbkl0ZW0nLCAnbW91c2Vtb3ZlT25JdGVtJywgJ21vdXNldXAnLCAncmVnaXN0ZXJJdGVtRWxlbWVudCcsXG4gICAgICAncmVuZGVyQm9keScsICdvcGVuRmlsZScsICdkaXNjYXJkQ2hhbmdlcycsICdhY3RpdmF0ZU5leHRMaXN0JywgJ2FjdGl2YXRlUHJldmlvdXNMaXN0JywgJ2FjdGl2YXRlTGFzdExpc3QnLFxuICAgICAgJ3N0YWdlQWxsJywgJ3Vuc3RhZ2VBbGwnLCAnc3RhZ2VBbGxNZXJnZUNvbmZsaWN0cycsICdkaXNjYXJkQWxsJywgJ2NvbmZpcm1TZWxlY3RlZEl0ZW1zJywgJ3NlbGVjdEFsbCcsXG4gICAgICAnc2VsZWN0Rmlyc3QnLCAnc2VsZWN0TGFzdCcsICdkaXZlSW50b1NlbGVjdGlvbicsICdzaG93RGlmZlZpZXcnLCAnc2hvd0J1bGtSZXNvbHZlTWVudScsICdzaG93QWN0aW9uc01lbnUnLFxuICAgICAgJ3Jlc29sdmVDdXJyZW50QXNPdXJzJywgJ3Jlc29sdmVDdXJyZW50QXNUaGVpcnMnLCAncXVpZXRseVNlbGVjdEl0ZW0nLCAnZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcycsXG4gICAgKTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZ2l0aHViLmtleWJvYXJkTmF2aWdhdGlvbkRlbGF5JywgdmFsdWUgPT4ge1xuICAgICAgICBpZiAodmFsdWUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSA9IHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSA9IGRlYm91bmNlKHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC4uLmNhbGN1bGF0ZVRydW5jYXRlZExpc3RzKHtcbiAgICAgICAgdW5zdGFnZWRDaGFuZ2VzOiB0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgc3RhZ2VkQ2hhbmdlczogdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBtZXJnZUNvbmZsaWN0czogdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cyxcbiAgICAgIH0pLFxuICAgICAgc2VsZWN0aW9uOiBuZXcgQ29tcG9zaXRlTGlzdFNlbGVjdGlvbih7XG4gICAgICAgIGxpc3RzQnlLZXk6IFtcbiAgICAgICAgICBbJ3Vuc3RhZ2VkJywgdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXNdLFxuICAgICAgICAgIFsnY29uZmxpY3RzJywgdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0c10sXG4gICAgICAgICAgWydzdGFnZWQnLCB0aGlzLnByb3BzLnN0YWdlZENoYW5nZXNdLFxuICAgICAgICBdLFxuICAgICAgICBpZEZvckl0ZW06IGl0ZW0gPT4gaXRlbS5maWxlUGF0aCxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMubGlzdEVsZW1lbnRzQnlJdGVtID0gbmV3IFdlYWtNYXAoKTtcbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKG5leHRQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgbGV0IG5leHRTdGF0ZSA9IHt9O1xuXG4gICAgaWYgKFxuICAgICAgWyd1bnN0YWdlZENoYW5nZXMnLCAnc3RhZ2VkQ2hhbmdlcycsICdtZXJnZUNvbmZsaWN0cyddLnNvbWUoa2V5ID0+IHByZXZTdGF0ZS5zb3VyY2Vba2V5XSAhPT0gbmV4dFByb3BzW2tleV0pXG4gICAgKSB7XG4gICAgICBjb25zdCBuZXh0TGlzdHMgPSBjYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyh7XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlczogbmV4dFByb3BzLnVuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgc3RhZ2VkQ2hhbmdlczogbmV4dFByb3BzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIG1lcmdlQ29uZmxpY3RzOiBuZXh0UHJvcHMubWVyZ2VDb25mbGljdHMsXG4gICAgICB9KTtcblxuICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAuLi5uZXh0TGlzdHMsXG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi51cGRhdGVMaXN0cyhbXG4gICAgICAgICAgWyd1bnN0YWdlZCcsIG5leHRMaXN0cy51bnN0YWdlZENoYW5nZXNdLFxuICAgICAgICAgIFsnY29uZmxpY3RzJywgbmV4dExpc3RzLm1lcmdlQ29uZmxpY3RzXSxcbiAgICAgICAgICBbJ3N0YWdlZCcsIG5leHRMaXN0cy5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgXSksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCk7XG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKSksXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmlzUG9wdWxhdGVkKHRoaXMucHJvcHMpKSB7XG4gICAgICB0aGlzLnN5bmNXaXRoV29ya3NwYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgY29uc3QgaXNSZXBvU2FtZSA9IHByZXZQcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcbiAgICBjb25zdCBoYXNTZWxlY3Rpb25zUHJlc2VudCA9XG4gICAgICBwcmV2U3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMCAmJlxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemUgPiAwO1xuICAgIGNvbnN0IHNlbGVjdGlvbkNoYW5nZWQgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbiAhPT0gcHJldlN0YXRlLnNlbGVjdGlvbjtcblxuICAgIGlmIChpc1JlcG9TYW1lICYmIGhhc1NlbGVjdGlvbnNQcmVzZW50ICYmIHNlbGVjdGlvbkNoYW5nZWQpIHtcbiAgICAgIHRoaXMuZGVib3VuY2VkRGlkQ2hhbmdlU2VsZWN0ZWRJdGVtKCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZEl0ZW0gPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRIZWFkSXRlbSgpO1xuICAgIGlmIChoZWFkSXRlbSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMubGlzdEVsZW1lbnRzQnlJdGVtLmdldChoZWFkSXRlbSk7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNQb3B1bGF0ZWQocHJldlByb3BzKSAmJiB0aGlzLmlzUG9wdWxhdGVkKHRoaXMucHJvcHMpKSB7XG4gICAgICB0aGlzLnN5bmNXaXRoV29ya3NwYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc30gZmV0Y2hEYXRhPXtub29wfT5cbiAgICAgICAge3RoaXMucmVuZGVyQm9keX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJCb2R5KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldyAke3RoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKX0tY2hhbmdlcy1mb2N1c2VkYH1cbiAgICAgICAgdGFiSW5kZXg9XCItMVwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItVW5zdGFnZWRDaGFuZ2VzICR7dGhpcy5nZXRGb2N1c0NsYXNzKCd1bnN0YWdlZCcpfWB9PlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWxpc3QtdW5vcmRlcmVkXCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPlVuc3RhZ2VkIENoYW5nZXM8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJBY3Rpb25zTWVudSgpfVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLWRvd25cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnN0YWdlQWxsfT5TdGFnZSBBbGw8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctdW5zdGFnZWRcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51bnN0YWdlZENoYW5nZXMubWFwKGZpbGVQYXRjaCA9PiAoXG4gICAgICAgICAgICAgICAgPEZpbGVQYXRjaExpc3RJdGVtVmlld1xuICAgICAgICAgICAgICAgICAga2V5PXtmaWxlUGF0Y2guZmlsZVBhdGh9XG4gICAgICAgICAgICAgICAgICByZWdpc3Rlckl0ZW1FbGVtZW50PXt0aGlzLnJlZ2lzdGVySXRlbUVsZW1lbnR9XG4gICAgICAgICAgICAgICAgICBmaWxlUGF0Y2g9e2ZpbGVQYXRjaH1cbiAgICAgICAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e2V2ZW50ID0+IHRoaXMuZGJsY2xpY2tPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbkNvbnRleHRNZW51PXtldmVudCA9PiB0aGlzLmNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMubW91c2Vkb3duT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZU1vdmU9e2V2ZW50ID0+IHRoaXMubW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkSXRlbXMuaGFzKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlck1lcmdlQ29uZmxpY3RzKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2l0aHViLVN0YWdpbmdWaWV3LWdyb3VwIGdpdGh1Yi1TdGFnZWRDaGFuZ2VzICR7dGhpcy5nZXRGb2N1c0NsYXNzKCdzdGFnZWQnKX1gfSA+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tdGFza2xpc3RcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LXRpdGxlXCI+XG4gICAgICAgICAgICAgIFN0YWdlZCBDaGFuZ2VzXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gaWNvbiBpY29uLW1vdmUtdXBcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy51bnN0YWdlQWxsfT5VbnN0YWdlIEFsbDwvYnV0dG9uPlxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWxpc3QgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3IGdpdGh1Yi1TdGFnaW5nVmlldy1zdGFnZWRcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gKFxuICAgICAgICAgICAgICAgIDxGaWxlUGF0Y2hMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgIGtleT17ZmlsZVBhdGNoLmZpbGVQYXRofVxuICAgICAgICAgICAgICAgICAgZmlsZVBhdGNoPXtmaWxlUGF0Y2h9XG4gICAgICAgICAgICAgICAgICByZWdpc3Rlckl0ZW1FbGVtZW50PXt0aGlzLnJlZ2lzdGVySXRlbUVsZW1lbnR9XG4gICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZSh0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItU3RhZ2luZ1ZpZXdcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXVwXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0UHJldmlvdXMoKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLWRvd25cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3ROZXh0KCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS1sZWZ0XCIgY2FsbGJhY2s9e3RoaXMuZGl2ZUludG9TZWxlY3Rpb259IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzaG93LWRpZmYtdmlld1wiIGNhbGxiYWNrPXt0aGlzLnNob3dEaWZmVmlld30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtdXBcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RQcmV2aW91cyh0cnVlKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtZG93blwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdE5leHQodHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LWFsbFwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdEFsbH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXRvLXRvcFwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdEZpcnN0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtdG8tYm90dG9tXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0TGFzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtdG8tdG9wXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0Rmlyc3QodHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXRvLWJvdHRvbVwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdExhc3QodHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIGNhbGxiYWNrPXt0aGlzLmNvbmZpcm1TZWxlY3RlZEl0ZW1zfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6YWN0aXZhdGUtbmV4dC1saXN0XCIgY2FsbGJhY2s9e3RoaXMuYWN0aXZhdGVOZXh0TGlzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFjdGl2YXRlLXByZXZpb3VzLWxpc3RcIiBjYWxsYmFjaz17dGhpcy5hY3RpdmF0ZVByZXZpb3VzTGlzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmp1bXAtdG8tZmlsZVwiIGNhbGxiYWNrPXt0aGlzLm9wZW5GaWxlfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cmVzb2x2ZS1maWxlLWFzLW91cnNcIiBjYWxsYmFjaz17dGhpcy5yZXNvbHZlQ3VycmVudEFzT3Vyc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtZmlsZS1hcy10aGVpcnNcIiBjYWxsYmFjaz17dGhpcy5yZXNvbHZlQ3VycmVudEFzVGhlaXJzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGlzY2FyZC1jaGFuZ2VzLWluLXNlbGVjdGVkLWZpbGVzXCIgY2FsbGJhY2s9e3RoaXMuZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTp1bmRvXCIgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvfSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdGFnZS1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLnN0YWdlQWxsfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dW5zdGFnZS1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLnVuc3RhZ2VBbGx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXNjYXJkLWFsbC1jaGFuZ2VzXCIgY2FsbGJhY2s9e3RoaXMuZGlzY2FyZEFsbEZyb21Db21tYW5kfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dW5kby1sYXN0LWRpc2NhcmQtaW4tZ2l0LXRhYlwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy51bmRvTGFzdERpc2NhcmRGcm9tQ29tbWFuZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUNvcmVVbmRvID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdjb3JlOnVuZG8nfX0pO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmQgPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1Yjp1bmRvLWxhc3QtZGlzY2FyZC1pbi1naXQtdGFiJ319KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b24gPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiAnYnV0dG9uJ30pO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUhlYWRlck1lbnUgPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSk7XG4gIH1cblxuICBkaXNjYXJkQ2hhbmdlc0Zyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMuZGlzY2FyZENoYW5nZXMoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLWNoYW5nZXMtaW4tc2VsZWN0ZWQtZmlsZXMnfX0pO1xuICB9XG5cbiAgZGlzY2FyZEFsbEZyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMuZGlzY2FyZEFsbCh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnZ2l0aHViOmRpc2NhcmQtYWxsLWNoYW5nZXMnfX0pO1xuICB9XG5cbiAgcmVuZGVyQWN0aW9uc01lbnUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCB8fCB0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uLS1pY29uT25seSBpY29uIGljb24tZWxsaXBzZXNcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2hvd0FjdGlvbnNNZW51fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVW5kb0J1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24tLWZ1bGxXaWR0aCBpY29uIGljb24taGlzdG9yeVwiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbn0+VW5kbyBEaXNjYXJkPC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRydW5jYXRlZE1lc3NhZ2UobGlzdCkge1xuICAgIGlmIChsaXN0Lmxlbmd0aCA+IE1BWElNVU1fTElTVEVEX0VOVFJJRVMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWdyb3VwLXRydW5jYXRlZE1zZ1wiPlxuICAgICAgICAgIExpc3QgdHJ1bmNhdGVkIHRvIHRoZSBmaXJzdCB7TUFYSU1VTV9MSVNURURfRU5UUklFU30gaXRlbXNcbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJNZXJnZUNvbmZsaWN0cygpIHtcbiAgICBjb25zdCBtZXJnZUNvbmZsaWN0cyA9IHRoaXMuc3RhdGUubWVyZ2VDb25mbGljdHM7XG5cbiAgICBpZiAobWVyZ2VDb25mbGljdHMgJiYgbWVyZ2VDb25mbGljdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgIGNvbnN0IHJlc29sdXRpb25Qcm9ncmVzcyA9IHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzO1xuICAgICAgY29uc3QgYW55VW5yZXNvbHZlZCA9IG1lcmdlQ29uZmxpY3RzXG4gICAgICAgIC5tYXAoY29uZmxpY3QgPT4gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIGNvbmZsaWN0LmZpbGVQYXRoKSlcbiAgICAgICAgLnNvbWUoY29uZmxpY3RQYXRoID0+IHJlc29sdXRpb25Qcm9ncmVzcy5nZXRSZW1haW5pbmcoY29uZmxpY3RQYXRoKSAhPT0gMCk7XG5cbiAgICAgIGNvbnN0IGJ1bGtSZXNvbHZlRHJvcGRvd24gPSBhbnlVbnJlc29sdmVkID8gKFxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1ibG9jayBpY29uIGljb24tZWxsaXBzZXNcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2hvd0J1bGtSZXNvbHZlTWVudX1cbiAgICAgICAgLz5cbiAgICAgICkgOiBudWxsO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItTWVyZ2VDb25mbGljdFBhdGhzICR7dGhpcy5nZXRGb2N1c0NsYXNzKCdjb25mbGljdHMnKX1gfT5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17J2dpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1pY29uIGljb24gaWNvbi1hbGVydCBzdGF0dXMtbW9kaWZpZWQnfSAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LXRpdGxlXCI+TWVyZ2UgQ29uZmxpY3RzPC9zcGFuPlxuICAgICAgICAgICAge2J1bGtSZXNvbHZlRHJvcGRvd259XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gaWNvbiBpY29uLW1vdmUtZG93blwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXthbnlVbnJlc29sdmVkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnN0YWdlQWxsTWVyZ2VDb25mbGljdHN9PlxuICAgICAgICAgICAgICBTdGFnZSBBbGxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWxpc3QgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3IGdpdGh1Yi1TdGFnaW5nVmlldy1tZXJnZVwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXJnZUNvbmZsaWN0cy5tYXAobWVyZ2VDb25mbGljdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgbWVyZ2VDb25mbGljdC5maWxlUGF0aCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPE1lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgICAga2V5PXtmdWxsUGF0aH1cbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VDb25mbGljdD17bWVyZ2VDb25mbGljdH1cbiAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nQ29uZmxpY3RzPXtyZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGZ1bGxQYXRoKX1cbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKG1lcmdlQ29uZmxpY3RzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPG5vc2NyaXB0IC8+O1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLCBpdGVtID0+IGl0ZW0uZmlsZVBhdGgpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkgIT09ICdjb25mbGljdHMnKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICB9XG5cbiAgb3BlbkZpbGUoKSB7XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuRmlsZXMoZmlsZVBhdGhzKTtcbiAgfVxuXG4gIGRpc2NhcmRDaGFuZ2VzKHtldmVudFNvdXJjZX0gPSB7fSkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgYWRkRXZlbnQoJ2Rpc2NhcmQtdW5zdGFnZWQtY2hhbmdlcycsIHtcbiAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgY29tcG9uZW50OiAnU3RhZ2luZ1ZpZXcnLFxuICAgICAgZmlsZUNvdW50OiBmaWxlUGF0aHMubGVuZ3RoLFxuICAgICAgdHlwZTogJ3NlbGVjdGVkJyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocyk7XG4gIH1cblxuICBhY3RpdmF0ZU5leHRMaXN0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBhZHZhbmNlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwcmV2U3RhdGUuc2VsZWN0aW9uLmFjdGl2YXRlTmV4dFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAocHJldlN0YXRlLnNlbGVjdGlvbiA9PT0gbmV4dCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkdmFuY2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IG5leHQuY29hbGVzY2UoKX07XG4gICAgICB9LCAoKSA9PiByZXNvbHZlKGFkdmFuY2VkKSk7XG4gICAgfSk7XG4gIH1cblxuICBhY3RpdmF0ZVByZXZpb3VzTGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgcmV0cmVhdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwcmV2U3RhdGUuc2VsZWN0aW9uLmFjdGl2YXRlUHJldmlvdXNTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXRyZWF0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogbmV4dC5jb2FsZXNjZSgpfTtcbiAgICAgIH0sICgpID0+IHJlc29sdmUocmV0cmVhdGVkKSk7XG4gICAgfSk7XG4gIH1cblxuICBhY3RpdmF0ZUxhc3RMaXN0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBlbXB0eVNlbGVjdGlvbiA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZUxhc3RTZWxlY3Rpb24oKTtcbiAgICAgICAgZW1wdHlTZWxlY3Rpb24gPSBuZXh0LmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMDtcblxuICAgICAgICBpZiAocHJldlN0YXRlLnNlbGVjdGlvbiA9PT0gbmV4dCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBuZXh0LmNvYWxlc2NlKCl9O1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZShlbXB0eVNlbGVjdGlvbikpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhZ2VBbGwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbigndW5zdGFnZWQnKTtcbiAgfVxuXG4gIHVuc3RhZ2VBbGwoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24oJ3N0YWdlZCcpO1xuICB9XG5cbiAgc3RhZ2VBbGxNZXJnZUNvbmZsaWN0cygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLm1hcChjb25mbGljdCA9PiBjb25mbGljdC5maWxlUGF0aCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihmaWxlUGF0aHMsICd1bnN0YWdlZCcpO1xuICB9XG5cbiAgZGlzY2FyZEFsbCh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBpZiAodGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubWFwKGZpbGVQYXRjaCA9PiBmaWxlUGF0Y2guZmlsZVBhdGgpO1xuICAgIGFkZEV2ZW50KCdkaXNjYXJkLXVuc3RhZ2VkLWNoYW5nZXMnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGZpbGVDb3VudDogZmlsZVBhdGhzLmxlbmd0aCxcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgZXZlbnRTb3VyY2UsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMoZmlsZVBhdGhzKTtcbiAgfVxuXG4gIGNvbmZpcm1TZWxlY3RlZEl0ZW1zID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGl0ZW1QYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKGl0ZW1QYXRocywgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpKTtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7c2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmNvYWxlc2NlKCl9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXROZXh0TGlzdFVwZGF0ZVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldE5leHRVcGRhdGVQcm9taXNlKCk7XG4gIH1cblxuICBzZWxlY3RQcmV2aW91cyhwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RQcmV2aW91c0l0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0TmV4dChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3ROZXh0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RBbGwoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEFsbEl0ZW1zKCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdEZpcnN0KHByZXNlcnZlVGFpbCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEZpcnN0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RMYXN0KHByZXNlcnZlVGFpbCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdExhc3RJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRpdmVJbnRvU2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMuc2l6ZSAhPT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXMudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG5cbiAgICBpZiAoc3RhZ2luZ1N0YXR1cyA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHthY3RpdmF0ZTogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7YWN0aXZhdGU6IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzeW5jV2l0aFdvcmtzcGFjZSgpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWFsSXRlbVByb21pc2UgPSBpdGVtLmdldFJlYWxJdGVtUHJvbWlzZSAmJiBpdGVtLmdldFJlYWxJdGVtUHJvbWlzZSgpO1xuICAgIGNvbnN0IHJlYWxJdGVtID0gYXdhaXQgcmVhbEl0ZW1Qcm9taXNlO1xuICAgIGlmICghcmVhbEl0ZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc0ZpbGVQYXRjaEl0ZW0gPSByZWFsSXRlbS5pc0ZpbGVQYXRjaEl0ZW0gJiYgcmVhbEl0ZW0uaXNGaWxlUGF0Y2hJdGVtKCk7XG4gICAgY29uc3QgaXNNYXRjaCA9IHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkgJiYgcmVhbEl0ZW0uZ2V0V29ya2luZ0RpcmVjdG9yeSgpID09PSB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuXG4gICAgaWYgKGlzRmlsZVBhdGNoSXRlbSAmJiBpc01hdGNoKSB7XG4gICAgICB0aGlzLnF1aWV0bHlTZWxlY3RJdGVtKHJlYWxJdGVtLmdldEZpbGVQYXRoKCksIHJlYWxJdGVtLmdldFN0YWdpbmdTdGF0dXMoKSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2hvd0RpZmZWaWV3KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMuc2l6ZSAhPT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXMudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG5cbiAgICBpZiAoc3RhZ2luZ1N0YXR1cyA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpKTtcbiAgICB9XG4gIH1cblxuICBzaG93QnVsa1Jlc29sdmVNZW51KGV2ZW50KSB7XG4gICAgY29uc3QgY29uZmxpY3RQYXRocyA9IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubWFwKGMgPT4gYy5maWxlUGF0aCk7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdSZXNvbHZlIEFsbCBhcyBPdXJzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnByb3BzLnJlc29sdmVBc091cnMoY29uZmxpY3RQYXRocyksXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBBbGwgYXMgVGhlaXJzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnByb3BzLnJlc29sdmVBc1RoZWlycyhjb25mbGljdFBhdGhzKSxcbiAgICB9KSk7XG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpO1xuICB9XG5cbiAgc2hvd0FjdGlvbnNNZW51KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtQ291bnQgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZTtcbiAgICBjb25zdCBwbHVyYWxpemF0aW9uID0gc2VsZWN0ZWRJdGVtQ291bnQgPiAxID8gJ3MnIDogJyc7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdEaXNjYXJkIEFsbCBDaGFuZ2VzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmRpc2NhcmRBbGwoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSksXG4gICAgICBlbmFibGVkOiB0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ0Rpc2NhcmQgQ2hhbmdlcyBpbiBTZWxlY3RlZCBGaWxlJyArIHBsdXJhbGl6YXRpb24sXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5kaXNjYXJkQ2hhbmdlcyh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KSxcbiAgICAgIGVuYWJsZWQ6ICEhKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCAmJiBzZWxlY3RlZEl0ZW1Db3VudCksXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnVW5kbyBMYXN0IERpc2NhcmQnLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pLFxuICAgICAgZW5hYmxlZDogdGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSxcbiAgICB9KSk7XG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpO1xuICB9XG5cbiAgcmVzb2x2ZUN1cnJlbnRBc091cnMoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzKHRoaXMuZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzKCkpO1xuICB9XG5cbiAgcmVzb2x2ZUN1cnJlbnRBc1RoZWlycygpIHtcbiAgICB0aGlzLnByb3BzLnJlc29sdmVBc1RoZWlycyh0aGlzLmdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpKTtcbiAgfVxuXG4gIC8vIERpcmVjdGx5IG1vZGlmeSB0aGUgc2VsZWN0aW9uIHRvIGluY2x1ZGUgb25seSB0aGUgaXRlbSBpZGVudGlmaWVkIGJ5IHRoZSBmaWxlIHBhdGggYW5kIHN0YWdpbmdTdGF0dXMgdHVwbGUuXG4gIC8vIFJlLXJlbmRlciB0aGUgY29tcG9uZW50LCBidXQgZG9uJ3Qgbm90aWZ5IGRpZFNlbGVjdFNpbmdsZUl0ZW0oKSBvciBvdGhlciBjYWxsYmFjayBmdW5jdGlvbnMuIFRoaXMgaXMgdXNlZnVsIHRvXG4gIC8vIGF2b2lkIGNpcmN1bGFyIGNhbGxiYWNrIGxvb3BzIGZvciBhY3Rpb25zIG9yaWdpbmF0aW5nIGluIEZpbGVQYXRjaFZpZXcgb3IgVGV4dEVkaXRvcnMgd2l0aCBtZXJnZSBjb25mbGljdHMuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gcHJldlN0YXRlLnNlbGVjdGlvbi5maW5kSXRlbSgoZWFjaCwga2V5KSA9PiBlYWNoLmZpbGVQYXRoID09PSBmaWxlUGF0aCAmJiBrZXkgPT09IHN0YWdpbmdTdGF0dXMpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAvLyBGSVhNRTogbWFrZSBzdGFnaW5nIHZpZXcgZGlzcGxheSBubyBzZWxlY3RlZCBpdGVtXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmxvZyhgVW5hYmxlIHRvIGZpbmQgaXRlbSBhdCBwYXRoICR7ZmlsZVBhdGh9IHdpdGggc3RhZ2luZyBzdGF0dXMgJHtzdGFnaW5nU3RhdHVzfWApO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtKX07XG4gICAgICB9LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkSXRlbXMoKSB7XG4gICAgY29uc3Qgc3RhZ2luZ1N0YXR1cyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCksIGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmlsZVBhdGg6IGl0ZW0uZmlsZVBhdGgsXG4gICAgICAgIHN0YWdpbmdTdGF0dXMsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyhvcGVuTmV3KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuZGlkU2VsZWN0U2luZ2xlSXRlbShzZWxlY3RlZEl0ZW1zWzBdLCBvcGVuTmV3KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkaWRTZWxlY3RTaW5nbGVJdGVtKHNlbGVjdGVkSXRlbSwgb3Blbk5ldyA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpID09PSAnY29uZmxpY3RzJykge1xuICAgICAgaWYgKG9wZW5OZXcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93TWVyZ2VDb25mbGljdEZpbGVGb3JQYXRoKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwge2FjdGl2YXRlOiB0cnVlfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcGVuTmV3KSB7XG4gICAgICAgIC8vIFVzZXIgZXhwbGljaXRseSBhc2tlZCB0byB2aWV3IGRpZmYsIHN1Y2ggYXMgdmlhIGNsaWNrXG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHthY3RpdmF0ZTogZmFsc2V9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZSA9IHRoaXMuZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSgpO1xuICAgICAgICBpZiAocGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBVcGRhdGUgc3RhbGUgaXRlbXMgdG8gcmVmbGVjdCBuZXcgc2VsZWN0aW9uXG4gICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlLm1hcChhc3luYyBwYW5lID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHtcbiAgICAgICAgICAgICAgYWN0aXZhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICBwYW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNlbGVjdGlvbiB3YXMgY2hhbmdlZCB2aWEga2V5Ym9hcmQgbmF2aWdhdGlvbiwgdXBkYXRlIHBlbmRpbmcgaXRlbSBpbiBhY3RpdmUgcGFuZVxuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKCk7XG4gICAgICAgICAgY29uc3QgYWN0aXZlUGVuZGluZ0l0ZW0gPSBhY3RpdmVQYW5lLmdldFBlbmRpbmdJdGVtKCk7XG4gICAgICAgICAgY29uc3QgYWN0aXZlUGFuZUhhc1BlbmRpbmdGaWxlUGF0Y2hJdGVtID0gYWN0aXZlUGVuZGluZ0l0ZW0gJiYgYWN0aXZlUGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0gJiZcbiAgICAgICAgICAgIGFjdGl2ZVBlbmRpbmdJdGVtLmdldFJlYWxJdGVtKCkgaW5zdGFuY2VvZiBDaGFuZ2VkRmlsZUl0ZW07XG4gICAgICAgICAgaWYgKGFjdGl2ZVBhbmVIYXNQZW5kaW5nRmlsZVBhdGNoSXRlbSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge1xuICAgICAgICAgICAgICBhY3RpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHBhbmU6IGFjdGl2ZVBhbmUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRQYW5lc1dpdGhTdGFsZVBlbmRpbmdGaWxlUGF0Y2hJdGVtKCkge1xuICAgIC8vIFwic3RhbGVcIiBtZWFuaW5nIHRoZXJlIGlzIG5vIGxvbmdlciBhIGNoYW5nZWQgZmlsZSBhc3NvY2lhdGVkIHdpdGggaXRlbVxuICAgIC8vIGR1ZSB0byBjaGFuZ2VzIGJlaW5nIGZ1bGx5IHN0YWdlZC91bnN0YWdlZC9zdGFzaGVkL2RlbGV0ZWQvZXRjXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLmdldFBhbmVzKCkuZmlsdGVyKHBhbmUgPT4ge1xuICAgICAgY29uc3QgcGVuZGluZ0l0ZW0gPSBwYW5lLmdldFBlbmRpbmdJdGVtKCk7XG4gICAgICBpZiAoIXBlbmRpbmdJdGVtIHx8ICFwZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGNvbnN0IHJlYWxJdGVtID0gcGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0oKTtcbiAgICAgIGlmICghKHJlYWxJdGVtIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBXZSBvbmx5IHdhbnQgdG8gdXBkYXRlIHBlbmRpbmcgZGlmZiB2aWV3cyBmb3IgY3VycmVudGx5IGFjdGl2ZSByZXBvXG4gICAgICBjb25zdCBpc0luQWN0aXZlUmVwbyA9IHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkoKSA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcbiAgICAgIGNvbnN0IGlzU3RhbGUgPSAhdGhpcy5jaGFuZ2VkRmlsZUV4aXN0cyhyZWFsSXRlbS5nZXRGaWxlUGF0aCgpLCByZWFsSXRlbS5nZXRTdGFnaW5nU3RhdHVzKCkpO1xuICAgICAgcmV0dXJuIGlzSW5BY3RpdmVSZXBvICYmIGlzU3RhbGU7XG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VkRmlsZUV4aXN0cyhmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5maW5kSXRlbSgoaXRlbSwga2V5KSA9PiB7XG4gICAgICByZXR1cm4ga2V5ID09PSBzdGFnaW5nU3RhdHVzICYmIGl0ZW0uZmlsZVBhdGggPT09IGZpbGVQYXRoO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2hvd0ZpbGVQYXRjaEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMsIHthY3RpdmF0ZSwgcGFuZX0gPSB7YWN0aXZhdGU6IGZhbHNlfSkge1xuICAgIGNvbnN0IHVyaSA9IENoYW5nZWRGaWxlSXRlbS5idWlsZFVSSShmaWxlUGF0aCwgdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gICAgY29uc3QgY2hhbmdlZEZpbGVJdGVtID0gYXdhaXQgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgIHVyaSwge3BlbmRpbmc6IHRydWUsIGFjdGl2YXRlUGFuZTogYWN0aXZhdGUsIGFjdGl2YXRlSXRlbTogYWN0aXZhdGUsIHBhbmV9LFxuICAgICk7XG4gICAgaWYgKGFjdGl2YXRlKSB7XG4gICAgICBjb25zdCBpdGVtUm9vdCA9IGNoYW5nZWRGaWxlSXRlbS5nZXRFbGVtZW50KCk7XG4gICAgICBjb25zdCBmb2N1c1Jvb3QgPSBpdGVtUm9vdC5xdWVyeVNlbGVjdG9yKCdbdGFiSW5kZXhdJyk7XG4gICAgICBpZiAoZm9jdXNSb290KSB7XG4gICAgICAgIGZvY3VzUm9vdC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzaW1wbHkgbWFrZSBpdGVtIHZpc2libGVcbiAgICAgIHRoaXMucHJvcHMud29ya3NwYWNlLnBhbmVGb3JJdGVtKGNoYW5nZWRGaWxlSXRlbSkuYWN0aXZhdGVJdGVtKGNoYW5nZWRGaWxlSXRlbSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChyZWxhdGl2ZUZpbGVQYXRoLCB7YWN0aXZhdGV9ID0ge2FjdGl2YXRlOiBmYWxzZX0pIHtcbiAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgcmVsYXRpdmVGaWxlUGF0aCk7XG4gICAgaWYgKGF3YWl0IHRoaXMuZmlsZUV4aXN0cyhhYnNvbHV0ZVBhdGgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihhYnNvbHV0ZVBhdGgsIHthY3RpdmF0ZVBhbmU6IGFjdGl2YXRlLCBhY3RpdmF0ZUl0ZW06IGFjdGl2YXRlLCBwZW5kaW5nOiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRJbmZvKCdGaWxlIGhhcyBiZWVuIGRlbGV0ZWQuJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmaWxlRXhpc3RzKGFic29sdXRlUGF0aCkge1xuICAgIHJldHVybiBuZXcgRmlsZShhYnNvbHV0ZVBhdGgpLmV4aXN0cygpO1xuICB9XG5cbiAgZGJsY2xpY2tPbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKFtpdGVtLmZpbGVQYXRoXSwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24ubGlzdEtleUZvckl0ZW0oaXRlbSkpO1xuICB9XG5cbiAgYXN5bmMgY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5oYXMoaXRlbSkpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCBldmVudC5zaGlmdEtleSksXG4gICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBuZXdFdmVudCA9IG5ldyBNb3VzZUV2ZW50KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGlmICghZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuZGlzcGF0Y2hFdmVudChuZXdFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICBjb25zdCB3aW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbiAgICBpZiAoZXZlbnQuY3RybEtleSAmJiAhd2luZG93cykgeyByZXR1cm47IH0gLy8gc2ltcGx5IG9wZW4gY29udGV4dCBtZW51XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSB0cnVlO1xuXG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgaWYgKGV2ZW50Lm1ldGFLZXkgfHwgKGV2ZW50LmN0cmxLZXkgJiYgd2luZG93cykpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmFkZE9yU3VidHJhY3RTZWxlY3Rpb24oaXRlbSksXG4gICAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCBldmVudC5zaGlmdEtleSksXG4gICAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIGl0ZW0pIHtcbiAgICBpZiAodGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RJdGVtKGl0ZW0sIHRydWUpLFxuICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtb3VzZXVwKCkge1xuICAgIGNvbnN0IGhhZFNlbGVjdGlvbkluUHJvZ3Jlc3MgPSB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcztcbiAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgICBpZiAoaGFkU2VsZWN0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhZGRFdmVudCgndW5kby1sYXN0LWRpc2NhcmQnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcy51bmRvTGFzdERpc2NhcmQoKTtcbiAgfVxuXG4gIGdldEZvY3VzQ2xhc3MobGlzdEtleSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkgPT09IGxpc3RLZXkgPyAnaXMtZm9jdXNlZCcgOiAnJztcbiAgfVxuXG4gIHJlZ2lzdGVySXRlbUVsZW1lbnQoaXRlbSwgZWxlbWVudCkge1xuICAgIHRoaXMubGlzdEVsZW1lbnRzQnlJdGVtLnNldChpdGVtLCBlbGVtZW50KTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKSA/IFN0YWdpbmdWaWV3LmZvY3VzLlNUQUdJTkcgOiBudWxsO1xuICB9XG5cbiAgc2V0Rm9jdXMoZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORykge1xuICAgICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuZm9jdXMoKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBhZHZhbmNlRm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkcpIHtcbiAgICAgIGlmIChhd2FpdCB0aGlzLmFjdGl2YXRlTmV4dExpc3QoKSkge1xuICAgICAgICAvLyBUaGVyZSB3YXMgYSBuZXh0IGxpc3QgdG8gYWN0aXZhdGUuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkc7XG4gICAgICB9XG5cbiAgICAgIC8vIFdlIHdlcmUgYWxyZWFkeSBvbiB0aGUgbGFzdCBsaXN0LlxuICAgICAgcmV0dXJuIENvbW1pdFZpZXcuZmlyc3RGb2N1cztcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIHJldHJlYXRGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IENvbW1pdFZpZXcuZmlyc3RGb2N1cykge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZUxhc3RMaXN0KCk7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgIH1cblxuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HKSB7XG4gICAgICBhd2FpdCB0aGlzLmFjdGl2YXRlUHJldmlvdXNMaXN0KCk7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkuZ2V0T3IoZmFsc2UpO1xuICB9XG5cbiAgaXNQb3B1bGF0ZWQocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGggIT0gbnVsbCAmJiAoXG4gICAgICBwcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMCB8fFxuICAgICAgcHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID4gMCB8fFxuICAgICAgcHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwXG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxTQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFFQSxJQUFBRSxLQUFBLEdBQUFGLE9BQUE7QUFDQSxJQUFBRyxNQUFBLEdBQUFDLHVCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBSyxVQUFBLEdBQUFDLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBTyxLQUFBLEdBQUFELHNCQUFBLENBQUFOLE9BQUE7QUFFQSxJQUFBUSxXQUFBLEdBQUFSLE9BQUE7QUFDQSxJQUFBUyxzQkFBQSxHQUFBSCxzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQVUsYUFBQSxHQUFBSixzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQVcsMEJBQUEsR0FBQUwsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFZLHVCQUFBLEdBQUFOLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBYSxtQkFBQSxHQUFBUCxzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQWMsV0FBQSxHQUFBUixzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQWUsVUFBQSxHQUFBVCxzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQWdCLGdCQUFBLEdBQUFWLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBaUIsU0FBQSxHQUFBYix1QkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQWtCLFFBQUEsR0FBQWxCLE9BQUE7QUFDQSxJQUFBbUIsY0FBQSxHQUFBbkIsT0FBQTtBQUEyQyxTQUFBTSx1QkFBQWMsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYs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