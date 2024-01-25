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
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2VsZWN0cm9uIiwiX2F0b20iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wcm9wVHlwZXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3BhdGgiLCJfcHJvcFR5cGVzMiIsIl9maWxlUGF0Y2hMaXN0SXRlbVZpZXciLCJfb2JzZXJ2ZU1vZGVsIiwiX21lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXciLCJfY29tcG9zaXRlTGlzdFNlbGVjdGlvbiIsIl9yZXNvbHV0aW9uUHJvZ3Jlc3MiLCJfY29tbWl0VmlldyIsIl9yZWZIb2xkZXIiLCJfY2hhbmdlZEZpbGVJdGVtIiwiX2NvbW1hbmRzIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJNZW51IiwiTWVudUl0ZW0iLCJyZW1vdGUiLCJkZWJvdW5jZSIsImZuIiwid2FpdCIsInRpbWVvdXQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMiLCJsaXN0cyIsInJlZHVjZSIsImFjYyIsImxpc3QiLCJzb3VyY2UiLCJNQVhJTVVNX0xJU1RFRF9FTlRSSUVTIiwic2xpY2UiLCJub29wIiwiU3RhZ2luZ1ZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ1bmRvTGFzdERpc2NhcmQiLCJldmVudFNvdXJjZSIsImNvbW1hbmQiLCJkaXNjYXJkQ2hhbmdlcyIsImRpc2NhcmRBbGwiLCJpdGVtUGF0aHMiLCJnZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMiLCJhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uIiwic3RhdGUiLCJzZWxlY3Rpb24iLCJnZXRBY3RpdmVMaXN0S2V5Iiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJjb2FsZXNjZSIsImF1dG9iaW5kIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhdG9tIiwiY29uZmlnIiwib2JzZXJ2ZSIsImRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSIsImRpZENoYW5nZVNlbGVjdGVkSXRlbXMiLCJ1bnN0YWdlZENoYW5nZXMiLCJzdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJDb21wb3NpdGVMaXN0U2VsZWN0aW9uIiwibGlzdHNCeUtleSIsImlkRm9ySXRlbSIsIml0ZW0iLCJmaWxlUGF0aCIsIm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxpc3RFbGVtZW50c0J5SXRlbSIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJuZXh0UHJvcHMiLCJuZXh0U3RhdGUiLCJzb21lIiwibmV4dExpc3RzIiwidXBkYXRlTGlzdHMiLCJjb21wb25lbnREaWRNb3VudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJtb3VzZXVwIiwiYWRkIiwiRGlzcG9zYWJsZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3b3Jrc3BhY2UiLCJvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIiwic3luY1dpdGhXb3Jrc3BhY2UiLCJpc1BvcHVsYXRlZCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImlzUmVwb1NhbWUiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImhhc1NlbGVjdGlvbnNQcmVzZW50IiwiZ2V0U2VsZWN0ZWRJdGVtcyIsInNpemUiLCJzZWxlY3Rpb25DaGFuZ2VkIiwiaGVhZEl0ZW0iLCJnZXRIZWFkSXRlbSIsImVsZW1lbnQiLCJzY3JvbGxJbnRvVmlld0lmTmVlZGVkIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIm1vZGVsIiwicmVzb2x1dGlvblByb2dyZXNzIiwiZmV0Y2hEYXRhIiwicmVuZGVyQm9keSIsInNlbGVjdGVkSXRlbXMiLCJyZWYiLCJzZXR0ZXIiLCJjbGFzc05hbWUiLCJ0YWJJbmRleCIsInJlbmRlckNvbW1hbmRzIiwiZ2V0Rm9jdXNDbGFzcyIsInJlbmRlckFjdGlvbnNNZW51IiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwic3RhZ2VBbGwiLCJtYXAiLCJmaWxlUGF0Y2giLCJyZWdpc3Rlckl0ZW1FbGVtZW50Iiwib25Eb3VibGVDbGljayIsImV2ZW50IiwiZGJsY2xpY2tPbkl0ZW0iLCJvbkNvbnRleHRNZW51IiwiY29udGV4dE1lbnVPbkl0ZW0iLCJvbk1vdXNlRG93biIsIm1vdXNlZG93bk9uSXRlbSIsIm9uTW91c2VNb3ZlIiwibW91c2Vtb3ZlT25JdGVtIiwic2VsZWN0ZWQiLCJyZW5kZXJUcnVuY2F0ZWRNZXNzYWdlIiwicmVuZGVyTWVyZ2VDb25mbGljdHMiLCJ1bnN0YWdlQWxsIiwiRnJhZ21lbnQiLCJyZWdpc3RyeSIsImNvbW1hbmRzIiwidGFyZ2V0IiwiQ29tbWFuZCIsImNhbGxiYWNrIiwic2VsZWN0UHJldmlvdXMiLCJzZWxlY3ROZXh0IiwiZGl2ZUludG9TZWxlY3Rpb24iLCJzaG93RGlmZlZpZXciLCJzZWxlY3RBbGwiLCJzZWxlY3RGaXJzdCIsInNlbGVjdExhc3QiLCJjb25maXJtU2VsZWN0ZWRJdGVtcyIsImFjdGl2YXRlTmV4dExpc3QiLCJhY3RpdmF0ZVByZXZpb3VzTGlzdCIsIm9wZW5GaWxlIiwicmVzb2x2ZUN1cnJlbnRBc091cnMiLCJyZXNvbHZlQ3VycmVudEFzVGhlaXJzIiwiZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZCIsInVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyIsImRpc2NhcmRBbGxGcm9tQ29tbWFuZCIsInVuZG9MYXN0RGlzY2FyZEZyb21Db21tYW5kIiwiaGFzVW5kb0hpc3RvcnkiLCJzaG93QWN0aW9uc01lbnUiLCJyZW5kZXJVbmRvQnV0dG9uIiwidW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbiIsImFueVVucmVzb2x2ZWQiLCJjb25mbGljdCIsInBhdGgiLCJqb2luIiwiY29uZmxpY3RQYXRoIiwiZ2V0UmVtYWluaW5nIiwiYnVsa1Jlc29sdmVEcm9wZG93biIsInNob3dCdWxrUmVzb2x2ZU1lbnUiLCJzdGFnZUFsbE1lcmdlQ29uZmxpY3RzIiwibWVyZ2VDb25mbGljdCIsImZ1bGxQYXRoIiwicmVtYWluaW5nQ29uZmxpY3RzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiQXJyYXkiLCJmcm9tIiwiZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzIiwiZmlsZVBhdGhzIiwib3BlbkZpbGVzIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiZmlsZUNvdW50IiwidHlwZSIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwiYWR2YW5jZWQiLCJuZXh0IiwiYWN0aXZhdGVOZXh0U2VsZWN0aW9uIiwicmV0cmVhdGVkIiwiYWN0aXZhdGVQcmV2aW91c1NlbGVjdGlvbiIsImFjdGl2YXRlTGFzdExpc3QiLCJlbXB0eVNlbGVjdGlvbiIsImFjdGl2YXRlTGFzdFNlbGVjdGlvbiIsImF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiIsImdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSIsImdldE5leHRVcGRhdGVQcm9taXNlIiwicHJlc2VydmVUYWlsIiwic2VsZWN0UHJldmlvdXNJdGVtIiwic2VsZWN0TmV4dEl0ZW0iLCJzZWxlY3RBbGxJdGVtcyIsInNlbGVjdEZpcnN0SXRlbSIsInNlbGVjdExhc3RJdGVtIiwic2VsZWN0ZWRJdGVtIiwidmFsdWVzIiwic3RhZ2luZ1N0YXR1cyIsInNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgiLCJhY3RpdmF0ZSIsInNob3dGaWxlUGF0Y2hJdGVtIiwiZ2V0QWN0aXZlUGFuZUl0ZW0iLCJyZWFsSXRlbVByb21pc2UiLCJnZXRSZWFsSXRlbVByb21pc2UiLCJyZWFsSXRlbSIsImlzRmlsZVBhdGNoSXRlbSIsImlzTWF0Y2giLCJnZXRXb3JraW5nRGlyZWN0b3J5IiwicXVpZXRseVNlbGVjdEl0ZW0iLCJnZXRGaWxlUGF0aCIsImdldFN0YWdpbmdTdGF0dXMiLCJjb25mbGljdFBhdGhzIiwiYyIsInByZXZlbnREZWZhdWx0IiwibWVudSIsImFwcGVuZCIsImxhYmVsIiwiY2xpY2siLCJyZXNvbHZlQXNPdXJzIiwicmVzb2x2ZUFzVGhlaXJzIiwicG9wdXAiLCJnZXRDdXJyZW50V2luZG93Iiwic2VsZWN0ZWRJdGVtQ291bnQiLCJwbHVyYWxpemF0aW9uIiwiZW5hYmxlZCIsImZpbmRJdGVtIiwiZWFjaCIsImNvbnNvbGUiLCJsb2ciLCJzZWxlY3RJdGVtIiwib3Blbk5ldyIsImRpZFNlbGVjdFNpbmdsZUl0ZW0iLCJoYXNGb2N1cyIsInBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZSIsImdldFBhbmVzV2l0aFN0YWxlUGVuZGluZ0ZpbGVQYXRjaEl0ZW0iLCJhbGwiLCJwYW5lIiwiYWN0aXZlUGFuZSIsImdldENlbnRlciIsImdldEFjdGl2ZVBhbmUiLCJhY3RpdmVQZW5kaW5nSXRlbSIsImdldFBlbmRpbmdJdGVtIiwiYWN0aXZlUGFuZUhhc1BlbmRpbmdGaWxlUGF0Y2hJdGVtIiwiZ2V0UmVhbEl0ZW0iLCJDaGFuZ2VkRmlsZUl0ZW0iLCJnZXRQYW5lcyIsInBlbmRpbmdJdGVtIiwiaXNJbkFjdGl2ZVJlcG8iLCJpc1N0YWxlIiwiY2hhbmdlZEZpbGVFeGlzdHMiLCJ1cmkiLCJidWlsZFVSSSIsImNoYW5nZWRGaWxlSXRlbSIsIm9wZW4iLCJwZW5kaW5nIiwiYWN0aXZhdGVQYW5lIiwiYWN0aXZhdGVJdGVtIiwiaXRlbVJvb3QiLCJnZXRFbGVtZW50IiwiZm9jdXNSb290IiwicXVlcnlTZWxlY3RvciIsImZvY3VzIiwicGFuZUZvckl0ZW0iLCJyZWxhdGl2ZUZpbGVQYXRoIiwiYWJzb2x1dGVQYXRoIiwiZmlsZUV4aXN0cyIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJhZGRJbmZvIiwiRmlsZSIsImV4aXN0cyIsImxpc3RLZXlGb3JJdGVtIiwic3RvcFByb3BhZ2F0aW9uIiwicGVyc2lzdCIsInNoaWZ0S2V5IiwibmV3RXZlbnQiLCJNb3VzZUV2ZW50IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicGFyZW50Tm9kZSIsImRpc3BhdGNoRXZlbnQiLCJ3aW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiY3RybEtleSIsImJ1dHRvbiIsIm1ldGFLZXkiLCJhZGRPclN1YnRyYWN0U2VsZWN0aW9uIiwiaGFkU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxpc3RLZXkiLCJnZXRGb2N1cyIsInJvb3QiLCJjb250YWlucyIsImdldE9yIiwiU1RBR0lORyIsInNldEZvY3VzIiwiYWR2YW5jZUZvY3VzRnJvbSIsIkNvbW1pdFZpZXciLCJmaXJzdEZvY3VzIiwicmV0cmVhdEZvY3VzRnJvbSIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwiRmlsZVBhdGNoSXRlbVByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIk1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUiLCJzdHJpbmciLCJvYmplY3QiLCJib29sIiwiZnVuYyIsIlJlc29sdXRpb25Qcm9ncmVzcyJdLCJzb3VyY2VzIjpbInN0YWdpbmctdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuY29uc3Qge01lbnUsIE1lbnVJdGVtfSA9IHJlbW90ZTtcbmltcG9ydCB7RmlsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge0ZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSwgTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgRmlsZVBhdGNoTGlzdEl0ZW1WaWV3IGZyb20gJy4vZmlsZS1wYXRjaC1saXN0LWl0ZW0tdmlldyc7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4vb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQgTWVyZ2VDb25mbGljdExpc3RJdGVtVmlldyBmcm9tICcuL21lcmdlLWNvbmZsaWN0LWxpc3QtaXRlbS12aWV3JztcbmltcG9ydCBDb21wb3NpdGVMaXN0U2VsZWN0aW9uIGZyb20gJy4uL21vZGVscy9jb21wb3NpdGUtbGlzdC1zZWxlY3Rpb24nO1xuaW1wb3J0IFJlc29sdXRpb25Qcm9ncmVzcyBmcm9tICcuLi9tb2RlbHMvY29uZmxpY3RzL3Jlc29sdXRpb24tcHJvZ3Jlc3MnO1xuaW1wb3J0IENvbW1pdFZpZXcgZnJvbSAnLi9jb21taXQtdmlldyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBDaGFuZ2VkRmlsZUl0ZW0gZnJvbSAnLi4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuY29uc3QgZGVib3VuY2UgPSAoZm4sIHdhaXQpID0+IHtcbiAgbGV0IHRpbWVvdXQ7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShmbiguLi5hcmdzKSk7XG4gICAgICB9LCB3YWl0KTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVRydW5jYXRlZExpc3RzKGxpc3RzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhsaXN0cykucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgIGNvbnN0IGxpc3QgPSBsaXN0c1trZXldO1xuICAgIGFjYy5zb3VyY2Vba2V5XSA9IGxpc3Q7XG4gICAgaWYgKGxpc3QubGVuZ3RoIDw9IE1BWElNVU1fTElTVEVEX0VOVFJJRVMpIHtcbiAgICAgIGFjY1trZXldID0gbGlzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjW2tleV0gPSBsaXN0LnNsaWNlKDAsIE1BWElNVU1fTElTVEVEX0VOVFJJRVMpO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7c291cmNlOiB7fX0pO1xufVxuXG5jb25zdCBub29wID0gKCkgPT4geyB9O1xuXG5jb25zdCBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTID0gMTAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhZ2luZ1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHVuc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIHN0YWdlZENoYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKEZpbGVQYXRjaEl0ZW1Qcm9wVHlwZSkuaXNSZXF1aXJlZCxcbiAgICBtZXJnZUNvbmZsaWN0czogUHJvcFR5cGVzLmFycmF5T2YoTWVyZ2VDb25mbGljdEl0ZW1Qcm9wVHlwZSksXG4gICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGhhc1VuZG9IaXN0b3J5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9wZW5GaWxlczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZUFzT3VyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNUaGVpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIG1lcmdlQ29uZmxpY3RzOiBbXSxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IG5ldyBSZXNvbHV0aW9uUHJvZ3Jlc3MoKSxcbiAgfVxuXG4gIHN0YXRpYyBmb2N1cyA9IHtcbiAgICBTVEFHSU5HOiBTeW1ib2woJ3N0YWdpbmcnKSxcbiAgfTtcblxuICBzdGF0aWMgZmlyc3RGb2N1cyA9IFN0YWdpbmdWaWV3LmZvY3VzLlNUQUdJTkc7XG5cbiAgc3RhdGljIGxhc3RGb2N1cyA9IFN0YWdpbmdWaWV3LmZvY3VzLlNUQUdJTkc7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2RibGNsaWNrT25JdGVtJywgJ2NvbnRleHRNZW51T25JdGVtJywgJ21vdXNlZG93bk9uSXRlbScsICdtb3VzZW1vdmVPbkl0ZW0nLCAnbW91c2V1cCcsICdyZWdpc3Rlckl0ZW1FbGVtZW50JyxcbiAgICAgICdyZW5kZXJCb2R5JywgJ29wZW5GaWxlJywgJ2Rpc2NhcmRDaGFuZ2VzJywgJ2FjdGl2YXRlTmV4dExpc3QnLCAnYWN0aXZhdGVQcmV2aW91c0xpc3QnLCAnYWN0aXZhdGVMYXN0TGlzdCcsXG4gICAgICAnc3RhZ2VBbGwnLCAndW5zdGFnZUFsbCcsICdzdGFnZUFsbE1lcmdlQ29uZmxpY3RzJywgJ2Rpc2NhcmRBbGwnLCAnY29uZmlybVNlbGVjdGVkSXRlbXMnLCAnc2VsZWN0QWxsJyxcbiAgICAgICdzZWxlY3RGaXJzdCcsICdzZWxlY3RMYXN0JywgJ2RpdmVJbnRvU2VsZWN0aW9uJywgJ3Nob3dEaWZmVmlldycsICdzaG93QnVsa1Jlc29sdmVNZW51JywgJ3Nob3dBY3Rpb25zTWVudScsXG4gICAgICAncmVzb2x2ZUN1cnJlbnRBc091cnMnLCAncmVzb2x2ZUN1cnJlbnRBc1RoZWlycycsICdxdWlldGx5U2VsZWN0SXRlbScsICdkaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zJyxcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdnaXRodWIua2V5Ym9hcmROYXZpZ2F0aW9uRGVsYXknLCB2YWx1ZSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuZGVib3VuY2VkRGlkQ2hhbmdlU2VsZWN0ZWRJdGVtID0gdGhpcy5kaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGVib3VuY2VkRGlkQ2hhbmdlU2VsZWN0ZWRJdGVtID0gZGVib3VuY2UodGhpcy5kaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLi4uY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMoe1xuICAgICAgICB1bnN0YWdlZENoYW5nZXM6IHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBzdGFnZWRDaGFuZ2VzOiB0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIG1lcmdlQ29uZmxpY3RzOiB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLFxuICAgICAgfSksXG4gICAgICBzZWxlY3Rpb246IG5ldyBDb21wb3NpdGVMaXN0U2VsZWN0aW9uKHtcbiAgICAgICAgbGlzdHNCeUtleTogW1xuICAgICAgICAgIFsndW5zdGFnZWQnLCB0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlc10sXG4gICAgICAgICAgWydjb25mbGljdHMnLCB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzXSxcbiAgICAgICAgICBbJ3N0YWdlZCcsIHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlc10sXG4gICAgICAgIF0sXG4gICAgICAgIGlkRm9ySXRlbTogaXRlbSA9PiBpdGVtLmZpbGVQYXRoLFxuICAgICAgfSksXG4gICAgfTtcblxuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG4gICAgdGhpcy5saXN0RWxlbWVudHNCeUl0ZW0gPSBuZXcgV2Vha01hcCgpO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMobmV4dFByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBsZXQgbmV4dFN0YXRlID0ge307XG5cbiAgICBpZiAoXG4gICAgICBbJ3Vuc3RhZ2VkQ2hhbmdlcycsICdzdGFnZWRDaGFuZ2VzJywgJ21lcmdlQ29uZmxpY3RzJ10uc29tZShrZXkgPT4gcHJldlN0YXRlLnNvdXJjZVtrZXldICE9PSBuZXh0UHJvcHNba2V5XSlcbiAgICApIHtcbiAgICAgIGNvbnN0IG5leHRMaXN0cyA9IGNhbGN1bGF0ZVRydW5jYXRlZExpc3RzKHtcbiAgICAgICAgdW5zdGFnZWRDaGFuZ2VzOiBuZXh0UHJvcHMudW5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBzdGFnZWRDaGFuZ2VzOiBuZXh0UHJvcHMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgbWVyZ2VDb25mbGljdHM6IG5leHRQcm9wcy5tZXJnZUNvbmZsaWN0cyxcbiAgICAgIH0pO1xuXG4gICAgICBuZXh0U3RhdGUgPSB7XG4gICAgICAgIC4uLm5leHRMaXN0cyxcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnVwZGF0ZUxpc3RzKFtcbiAgICAgICAgICBbJ3Vuc3RhZ2VkJywgbmV4dExpc3RzLnVuc3RhZ2VkQ2hhbmdlc10sXG4gICAgICAgICAgWydjb25mbGljdHMnLCBuZXh0TGlzdHMubWVyZ2VDb25mbGljdHNdLFxuICAgICAgICAgIFsnc3RhZ2VkJywgbmV4dExpc3RzLnN0YWdlZENoYW5nZXNdLFxuICAgICAgICBdKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKTtcbiAgICB0aGlzLnN1YnMuYWRkKFxuICAgICAgbmV3IERpc3Bvc2FibGUoKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNldXApKSxcbiAgICAgIHRoaXMucHJvcHMud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oKCkgPT4ge1xuICAgICAgICB0aGlzLnN5bmNXaXRoV29ya3NwYWNlKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgaWYgKHRoaXMuaXNQb3B1bGF0ZWQodGhpcy5wcm9wcykpIHtcbiAgICAgIHRoaXMuc3luY1dpdGhXb3Jrc3BhY2UoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBjb25zdCBpc1JlcG9TYW1lID0gcHJldlByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoID09PSB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICAgIGNvbnN0IGhhc1NlbGVjdGlvbnNQcmVzZW50ID1cbiAgICAgIHByZXZTdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemUgPiAwICYmXG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDA7XG4gICAgY29uc3Qgc2VsZWN0aW9uQ2hhbmdlZCA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uICE9PSBwcmV2U3RhdGUuc2VsZWN0aW9uO1xuXG4gICAgaWYgKGlzUmVwb1NhbWUgJiYgaGFzU2VsZWN0aW9uc1ByZXNlbnQgJiYgc2VsZWN0aW9uQ2hhbmdlZCkge1xuICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0oKTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkSXRlbSA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEhlYWRJdGVtKCk7XG4gICAgaWYgKGhlYWRJdGVtKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5saXN0RWxlbWVudHNCeUl0ZW0uZ2V0KGhlYWRJdGVtKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1BvcHVsYXRlZChwcmV2UHJvcHMpICYmIHRoaXMuaXNQb3B1bGF0ZWQodGhpcy5wcm9wcykpIHtcbiAgICAgIHRoaXMuc3luY1dpdGhXb3Jrc3BhY2UoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfSBmZXRjaERhdGE9e25vb3B9PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb2R5fVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckJvZHkoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj17dGhpcy5yZWZSb290LnNldHRlcn1cbiAgICAgICAgY2xhc3NOYW1lPXtgZ2l0aHViLVN0YWdpbmdWaWV3ICR7dGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpfS1jaGFuZ2VzLWZvY3VzZWRgfVxuICAgICAgICB0YWJJbmRleD1cIi0xXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2l0aHViLVN0YWdpbmdWaWV3LWdyb3VwIGdpdGh1Yi1VbnN0YWdlZENoYW5nZXMgJHt0aGlzLmdldEZvY3VzQ2xhc3MoJ3Vuc3RhZ2VkJyl9YH0+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbGlzdC11bm9yZGVyZWRcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LXRpdGxlXCI+VW5zdGFnZWQgQ2hhbmdlczwvc3Bhbj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckFjdGlvbnNNZW51KCl9XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gaWNvbiBpY29uLW1vdmUtZG93blwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc3RhZ2VBbGx9PlN0YWdlIEFsbDwvYnV0dG9uPlxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWxpc3QgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3IGdpdGh1Yi1TdGFnaW5nVmlldy11bnN0YWdlZFwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVuc3RhZ2VkQ2hhbmdlcy5tYXAoZmlsZVBhdGNoID0+IChcbiAgICAgICAgICAgICAgICA8RmlsZVBhdGNoTGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICBrZXk9e2ZpbGVQYXRjaC5maWxlUGF0aH1cbiAgICAgICAgICAgICAgICAgIHJlZ2lzdGVySXRlbUVsZW1lbnQ9e3RoaXMucmVnaXN0ZXJJdGVtRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgIGZpbGVQYXRjaD17ZmlsZVBhdGNofVxuICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMoZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRydW5jYXRlZE1lc3NhZ2UodGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyTWVyZ2VDb25mbGljdHMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLVN0YWdlZENoYW5nZXMgJHt0aGlzLmdldEZvY3VzQ2xhc3MoJ3N0YWdlZCcpfWB9ID5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi10YXNrbGlzdFwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctdGl0bGVcIj5cbiAgICAgICAgICAgICAgU3RhZ2VkIENoYW5nZXNcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBpY29uIGljb24tbW92ZS11cFwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnVuc3RhZ2VBbGx9PlVuc3RhZ2UgQWxsPC9idXR0b24+XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctbGlzdCBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgZ2l0aHViLVN0YWdpbmdWaWV3LXN0YWdlZFwiPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlLnN0YWdlZENoYW5nZXMubWFwKGZpbGVQYXRjaCA9PiAoXG4gICAgICAgICAgICAgICAgPEZpbGVQYXRjaExpc3RJdGVtVmlld1xuICAgICAgICAgICAgICAgICAga2V5PXtmaWxlUGF0Y2guZmlsZVBhdGh9XG4gICAgICAgICAgICAgICAgICBmaWxlUGF0Y2g9e2ZpbGVQYXRjaH1cbiAgICAgICAgICAgICAgICAgIHJlZ2lzdGVySXRlbUVsZW1lbnQ9e3RoaXMucmVnaXN0ZXJJdGVtRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e2V2ZW50ID0+IHRoaXMuZGJsY2xpY2tPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbkNvbnRleHRNZW51PXtldmVudCA9PiB0aGlzLmNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMubW91c2Vkb3duT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZU1vdmU9e2V2ZW50ID0+IHRoaXMubW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkSXRlbXMuaGFzKGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1TdGFnaW5nVmlld1wiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtdXBcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RQcmV2aW91cygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtZG93blwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdE5leHQoKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLWxlZnRcIiBjYWxsYmFjaz17dGhpcy5kaXZlSW50b1NlbGVjdGlvbn0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNob3ctZGlmZi12aWV3XCIgY2FsbGJhY2s9e3RoaXMuc2hvd0RpZmZWaWV3fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC11cFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdFByZXZpb3VzKHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC1kb3duXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0TmV4dCh0cnVlKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtYWxsXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0QWxsfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtdG8tdG9wXCIgY2FsbGJhY2s9e3RoaXMuc2VsZWN0Rmlyc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS10by1ib3R0b21cIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RMYXN0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC10by10b3BcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RGaXJzdCh0cnVlKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpzZWxlY3QtdG8tYm90dG9tXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0TGFzdCh0cnVlKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTpjb25maXJtXCIgY2FsbGJhY2s9e3RoaXMuY29uZmlybVNlbGVjdGVkSXRlbXN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjphY3RpdmF0ZS1uZXh0LWxpc3RcIiBjYWxsYmFjaz17dGhpcy5hY3RpdmF0ZU5leHRMaXN0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6YWN0aXZhdGUtcHJldmlvdXMtbGlzdFwiIGNhbGxiYWNrPXt0aGlzLmFjdGl2YXRlUHJldmlvdXNMaXN0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6anVtcC10by1maWxlXCIgY2FsbGJhY2s9e3RoaXMub3BlbkZpbGV9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpyZXNvbHZlLWZpbGUtYXMtb3Vyc1wiIGNhbGxiYWNrPXt0aGlzLnJlc29sdmVDdXJyZW50QXNPdXJzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cmVzb2x2ZS1maWxlLWFzLXRoZWlyc1wiIGNhbGxiYWNrPXt0aGlzLnJlc29sdmVDdXJyZW50QXNUaGVpcnN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXNjYXJkLWNoYW5nZXMtaW4tc2VsZWN0ZWQtZmlsZXNcIiBjYWxsYmFjaz17dGhpcy5kaXNjYXJkQ2hhbmdlc0Zyb21Db21tYW5kfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnVuZG9cIiBjYWxsYmFjaz17dGhpcy51bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG99IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnN0YWdlLWFsbC1jaGFuZ2VzXCIgY2FsbGJhY2s9e3RoaXMuc3RhZ2VBbGx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp1bnN0YWdlLWFsbC1jaGFuZ2VzXCIgY2FsbGJhY2s9e3RoaXMudW5zdGFnZUFsbH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpc2NhcmQtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy5kaXNjYXJkQWxsRnJvbUNvbW1hbmR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp1bmRvLWxhc3QtZGlzY2FyZC1pbi1naXQtdGFiXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21Db21tYW5kfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQ29yZVVuZG8gPSAoKSA9PiB7XG4gICAgdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2NvcmU6dW5kbyd9fSk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnZ2l0aHViOnVuZG8tbGFzdC1kaXNjYXJkLWluLWdpdC10YWInfX0pO1xuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbiA9ICgpID0+IHtcbiAgICB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6ICdidXR0b24nfSk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tSGVhZGVyTWVudSA9ICgpID0+IHtcbiAgICB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KTtcbiAgfVxuXG4gIGRpc2NhcmRDaGFuZ2VzRnJvbUNvbW1hbmQgPSAoKSA9PiB7XG4gICAgdGhpcy5kaXNjYXJkQ2hhbmdlcyh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnZ2l0aHViOmRpc2NhcmQtY2hhbmdlcy1pbi1zZWxlY3RlZC1maWxlcyd9fSk7XG4gIH1cblxuICBkaXNjYXJkQWxsRnJvbUNvbW1hbmQgPSAoKSA9PiB7XG4gICAgdGhpcy5kaXNjYXJkQWxsKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6ZGlzY2FyZC1hbGwtY2hhbmdlcyd9fSk7XG4gIH1cblxuICByZW5kZXJBY3Rpb25zTWVudSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoIHx8IHRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24tLWljb25Pbmx5IGljb24gaWNvbi1lbGxpcHNlc1wiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5zaG93QWN0aW9uc01lbnV9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJVbmRvQnV0dG9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbi0tZnVsbFdpZHRoIGljb24gaWNvbi1oaXN0b3J5XCJcbiAgICAgICAgb25DbGljaz17dGhpcy51bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9ufT5VbmRvIERpc2NhcmQ8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVHJ1bmNhdGVkTWVzc2FnZShsaXN0KSB7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gTUFYSU1VTV9MSVNURURfRU5UUklFUykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAtdHJ1bmNhdGVkTXNnXCI+XG4gICAgICAgICAgTGlzdCB0cnVuY2F0ZWQgdG8gdGhlIGZpcnN0IHtNQVhJTVVNX0xJU1RFRF9FTlRSSUVTfSBpdGVtc1xuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlck1lcmdlQ29uZmxpY3RzKCkge1xuICAgIGNvbnN0IG1lcmdlQ29uZmxpY3RzID0gdGhpcy5zdGF0ZS5tZXJnZUNvbmZsaWN0cztcblxuICAgIGlmIChtZXJnZUNvbmZsaWN0cyAmJiBtZXJnZUNvbmZsaWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgICAgY29uc3QgcmVzb2x1dGlvblByb2dyZXNzID0gdGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3M7XG4gICAgICBjb25zdCBhbnlVbnJlc29sdmVkID0gbWVyZ2VDb25mbGljdHNcbiAgICAgICAgLm1hcChjb25mbGljdCA9PiBwYXRoLmpvaW4odGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCwgY29uZmxpY3QuZmlsZVBhdGgpKVxuICAgICAgICAuc29tZShjb25mbGljdFBhdGggPT4gcmVzb2x1dGlvblByb2dyZXNzLmdldFJlbWFpbmluZyhjb25mbGljdFBhdGgpICE9PSAwKTtcblxuICAgICAgY29uc3QgYnVsa1Jlc29sdmVEcm9wZG93biA9IGFueVVucmVzb2x2ZWQgPyAoXG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWJsb2NrIGljb24gaWNvbi1lbGxpcHNlc1wiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5zaG93QnVsa1Jlc29sdmVNZW51fVxuICAgICAgICAvPlxuICAgICAgKSA6IG51bGw7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2l0aHViLVN0YWdpbmdWaWV3LWdyb3VwIGdpdGh1Yi1NZXJnZUNvbmZsaWN0UGF0aHMgJHt0aGlzLmdldEZvY3VzQ2xhc3MoJ2NvbmZsaWN0cycpfWB9PlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXsnZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWljb24gaWNvbiBpY29uLWFsZXJ0IHN0YXR1cy1tb2RpZmllZCd9IC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctdGl0bGVcIj5NZXJnZSBDb25mbGljdHM8L3NwYW4+XG4gICAgICAgICAgICB7YnVsa1Jlc29sdmVEcm9wZG93bn1cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBpY29uIGljb24tbW92ZS1kb3duXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2FueVVucmVzb2x2ZWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc3RhZ2VBbGxNZXJnZUNvbmZsaWN0c30+XG4gICAgICAgICAgICAgIFN0YWdlIEFsbFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctbGlzdCBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgZ2l0aHViLVN0YWdpbmdWaWV3LW1lcmdlXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1lcmdlQ29uZmxpY3RzLm1hcChtZXJnZUNvbmZsaWN0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbih0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLCBtZXJnZUNvbmZsaWN0LmZpbGVQYXRoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8TWVyZ2VDb25mbGljdExpc3RJdGVtVmlld1xuICAgICAgICAgICAgICAgICAgICBrZXk9e2Z1bGxQYXRofVxuICAgICAgICAgICAgICAgICAgICBtZXJnZUNvbmZsaWN0PXttZXJnZUNvbmZsaWN0fVxuICAgICAgICAgICAgICAgICAgICByZW1haW5pbmdDb25mbGljdHM9e3Jlc29sdXRpb25Qcm9ncmVzcy5nZXRSZW1haW5pbmcoZnVsbFBhdGgpfVxuICAgICAgICAgICAgICAgICAgICByZWdpc3Rlckl0ZW1FbGVtZW50PXt0aGlzLnJlZ2lzdGVySXRlbUVsZW1lbnR9XG4gICAgICAgICAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e2V2ZW50ID0+IHRoaXMuZGJsY2xpY2tPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbkNvbnRleHRNZW51PXtldmVudCA9PiB0aGlzLmNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2V2ZW50ID0+IHRoaXMubW91c2Vkb3duT25JdGVtKGV2ZW50LCBtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU1vdmU9e2V2ZW50ID0+IHRoaXMubW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBtZXJnZUNvbmZsaWN0KX1cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkSXRlbXMuaGFzKG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRydW5jYXRlZE1lc3NhZ2UobWVyZ2VDb25mbGljdHMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8bm9zY3JpcHQgLz47XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCksIGl0ZW0gPT4gaXRlbS5maWxlUGF0aCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSAhPT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gIH1cblxuICBvcGVuRmlsZSgpIHtcbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5GaWxlcyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgZGlzY2FyZENoYW5nZXMoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgICBhZGRFdmVudCgnZGlzY2FyZC11bnN0YWdlZC1jaGFuZ2VzJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBmaWxlQ291bnQ6IGZpbGVQYXRocy5sZW5ndGgsXG4gICAgICB0eXBlOiAnc2VsZWN0ZWQnLFxuICAgICAgZXZlbnRTb3VyY2UsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMoZmlsZVBhdGhzKTtcbiAgfVxuXG4gIGFjdGl2YXRlTmV4dExpc3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IGFkdmFuY2VkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uYWN0aXZhdGVOZXh0U2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChwcmV2U3RhdGUuc2VsZWN0aW9uID09PSBuZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgYWR2YW5jZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogbmV4dC5jb2FsZXNjZSgpfTtcbiAgICAgIH0sICgpID0+IHJlc29sdmUoYWR2YW5jZWQpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFjdGl2YXRlUHJldmlvdXNMaXN0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCByZXRyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uYWN0aXZhdGVQcmV2aW91c1NlbGVjdGlvbigpO1xuICAgICAgICBpZiAocHJldlN0YXRlLnNlbGVjdGlvbiA9PT0gbmV4dCkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHJlYXRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBuZXh0LmNvYWxlc2NlKCl9O1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZShyZXRyZWF0ZWQpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFjdGl2YXRlTGFzdExpc3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IGVtcHR5U2VsZWN0aW9uID0gZmFsc2U7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwcmV2U3RhdGUuc2VsZWN0aW9uLmFjdGl2YXRlTGFzdFNlbGVjdGlvbigpO1xuICAgICAgICBlbXB0eVNlbGVjdGlvbiA9IG5leHQuZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemUgPiAwO1xuXG4gICAgICAgIGlmIChwcmV2U3RhdGUuc2VsZWN0aW9uID09PSBuZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IG5leHQuY29hbGVzY2UoKX07XG4gICAgICB9LCAoKSA9PiByZXNvbHZlKGVtcHR5U2VsZWN0aW9uKSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFnZUFsbCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uKCd1bnN0YWdlZCcpO1xuICB9XG5cbiAgdW5zdGFnZUFsbCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbignc3RhZ2VkJyk7XG4gIH1cblxuICBzdGFnZUFsbE1lcmdlQ29uZmxpY3RzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubWFwKGNvbmZsaWN0ID0+IGNvbmZsaWN0LmZpbGVQYXRoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uKGZpbGVQYXRocywgJ3Vuc3RhZ2VkJyk7XG4gIH1cblxuICBkaXNjYXJkQWxsKHtldmVudFNvdXJjZX0gPSB7fSkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5tYXAoZmlsZVBhdGNoID0+IGZpbGVQYXRjaC5maWxlUGF0aCk7XG4gICAgYWRkRXZlbnQoJ2Rpc2NhcmQtdW5zdGFnZWQtY2hhbmdlcycsIHtcbiAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgY29tcG9uZW50OiAnU3RhZ2luZ1ZpZXcnLFxuICAgICAgZmlsZUNvdW50OiBmaWxlUGF0aHMubGVuZ3RoLFxuICAgICAgdHlwZTogJ2FsbCcsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgY29uZmlybVNlbGVjdGVkSXRlbXMgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaXRlbVBhdGhzID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgICBhd2FpdCB0aGlzLnByb3BzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oaXRlbVBhdGhzLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uY29hbGVzY2UoKX0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0TmV4dFVwZGF0ZVByb21pc2UoKTtcbiAgfVxuXG4gIHNlbGVjdFByZXZpb3VzKHByZXNlcnZlVGFpbCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdFByZXZpb3VzSXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3ROZXh0KHByZXNlcnZlVGFpbCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdE5leHRJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdEFsbCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0QWxsSXRlbXMoKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0Rmlyc3QocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0Rmlyc3RJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdExhc3QocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0TGFzdEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGl2ZUludG9TZWxlY3Rpb24oKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5zaXplICE9PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtcy52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgY29uc3Qgc3RhZ2luZ1N0YXR1cyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKTtcblxuICAgIGlmIChzdGFnaW5nU3RhdHVzID09PSAnY29uZmxpY3RzJykge1xuICAgICAgdGhpcy5zaG93TWVyZ2VDb25mbGljdEZpbGVGb3JQYXRoKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwge2FjdGl2YXRlOiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHthY3RpdmF0ZTogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN5bmNXaXRoV29ya3NwYWNlKCkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuICAgIGlmICghaXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWxJdGVtUHJvbWlzZSA9IGl0ZW0uZ2V0UmVhbEl0ZW1Qcm9taXNlICYmIGl0ZW0uZ2V0UmVhbEl0ZW1Qcm9taXNlKCk7XG4gICAgY29uc3QgcmVhbEl0ZW0gPSBhd2FpdCByZWFsSXRlbVByb21pc2U7XG4gICAgaWYgKCFyZWFsSXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRmlsZVBhdGNoSXRlbSA9IHJlYWxJdGVtLmlzRmlsZVBhdGNoSXRlbSAmJiByZWFsSXRlbS5pc0ZpbGVQYXRjaEl0ZW0oKTtcbiAgICBjb25zdCBpc01hdGNoID0gcmVhbEl0ZW0uZ2V0V29ya2luZ0RpcmVjdG9yeSAmJiByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5KCkgPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG5cbiAgICBpZiAoaXNGaWxlUGF0Y2hJdGVtICYmIGlzTWF0Y2gpIHtcbiAgICAgIHRoaXMucXVpZXRseVNlbGVjdEl0ZW0ocmVhbEl0ZW0uZ2V0RmlsZVBhdGgoKSwgcmVhbEl0ZW0uZ2V0U3RhZ2luZ1N0YXR1cygpKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzaG93RGlmZlZpZXcoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5zaXplICE9PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtcy52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgY29uc3Qgc3RhZ2luZ1N0YXR1cyA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKTtcblxuICAgIGlmIChzdGFnaW5nU3RhdHVzID09PSAnY29uZmxpY3RzJykge1xuICAgICAgdGhpcy5zaG93TWVyZ2VDb25mbGljdEZpbGVGb3JQYXRoKHNlbGVjdGVkSXRlbS5maWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dCdWxrUmVzb2x2ZU1lbnUoZXZlbnQpIHtcbiAgICBjb25zdCBjb25mbGljdFBhdGhzID0gdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5tYXAoYyA9PiBjLmZpbGVQYXRoKTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1Jlc29sdmUgQWxsIGFzIE91cnMnLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMucHJvcHMucmVzb2x2ZUFzT3Vycyhjb25mbGljdFBhdGhzKSxcbiAgICB9KSk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdSZXNvbHZlIEFsbCBhcyBUaGVpcnMnLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMucHJvcHMucmVzb2x2ZUFzVGhlaXJzKGNvbmZsaWN0UGF0aHMpLFxuICAgIH0pKTtcblxuICAgIG1lbnUucG9wdXAocmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKSk7XG4gIH1cblxuICBzaG93QWN0aW9uc01lbnUoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1Db3VudCA9IHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5zaXplO1xuICAgIGNvbnN0IHBsdXJhbGl6YXRpb24gPSBzZWxlY3RlZEl0ZW1Db3VudCA+IDEgPyAncycgOiAnJztcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ0Rpc2NhcmQgQWxsIENoYW5nZXMnLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZGlzY2FyZEFsbCh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KSxcbiAgICAgIGVuYWJsZWQ6IHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA+IDAsXG4gICAgfSkpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnRGlzY2FyZCBDaGFuZ2VzIGluIFNlbGVjdGVkIEZpbGUnICsgcGx1cmFsaXphdGlvbixcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmRpc2NhcmRDaGFuZ2VzKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pLFxuICAgICAgZW5hYmxlZDogISEodGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoICYmIHNlbGVjdGVkSXRlbUNvdW50KSxcbiAgICB9KSk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdVbmRvIExhc3QgRGlzY2FyZCcsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy51bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSksXG4gICAgICBlbmFibGVkOiB0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5LFxuICAgIH0pKTtcblxuICAgIG1lbnUucG9wdXAocmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKSk7XG4gIH1cblxuICByZXNvbHZlQ3VycmVudEFzT3VycygpIHtcbiAgICB0aGlzLnByb3BzLnJlc29sdmVBc091cnModGhpcy5nZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMoKSk7XG4gIH1cblxuICByZXNvbHZlQ3VycmVudEFzVGhlaXJzKCkge1xuICAgIHRoaXMucHJvcHMucmVzb2x2ZUFzVGhlaXJzKHRoaXMuZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzKCkpO1xuICB9XG5cbiAgLy8gRGlyZWN0bHkgbW9kaWZ5IHRoZSBzZWxlY3Rpb24gdG8gaW5jbHVkZSBvbmx5IHRoZSBpdGVtIGlkZW50aWZpZWQgYnkgdGhlIGZpbGUgcGF0aCBhbmQgc3RhZ2luZ1N0YXR1cyB0dXBsZS5cbiAgLy8gUmUtcmVuZGVyIHRoZSBjb21wb25lbnQsIGJ1dCBkb24ndCBub3RpZnkgZGlkU2VsZWN0U2luZ2xlSXRlbSgpIG9yIG90aGVyIGNhbGxiYWNrIGZ1bmN0aW9ucy4gVGhpcyBpcyB1c2VmdWwgdG9cbiAgLy8gYXZvaWQgY2lyY3VsYXIgY2FsbGJhY2sgbG9vcHMgZm9yIGFjdGlvbnMgb3JpZ2luYXRpbmcgaW4gRmlsZVBhdGNoVmlldyBvciBUZXh0RWRpdG9ycyB3aXRoIG1lcmdlIGNvbmZsaWN0cy5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBwcmV2U3RhdGUuc2VsZWN0aW9uLmZpbmRJdGVtKChlYWNoLCBrZXkpID0+IGVhY2guZmlsZVBhdGggPT09IGZpbGVQYXRoICYmIGtleSA9PT0gc3RhZ2luZ1N0YXR1cyk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgIC8vIEZJWE1FOiBtYWtlIHN0YWdpbmcgdmlldyBkaXNwbGF5IG5vIHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGNvbnNvbGUubG9nKGBVbmFibGUgdG8gZmluZCBpdGVtIGF0IHBhdGggJHtmaWxlUGF0aH0gd2l0aCBzdGFnaW5nIHN0YXR1cyAke3N0YWdpbmdTdGF0dXN9YCk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RJdGVtKGl0ZW0pfTtcbiAgICAgIH0sIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRJdGVtcygpIHtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSwgaXRlbSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmaWxlUGF0aDogaXRlbS5maWxlUGF0aCxcbiAgICAgICAgc3RhZ2luZ1N0YXR1cyxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBkaWRDaGFuZ2VTZWxlY3RlZEl0ZW1zKG9wZW5OZXcpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5kaWRTZWxlY3RTaW5nbGVJdGVtKHNlbGVjdGVkSXRlbXNbMF0sIG9wZW5OZXcpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpZFNlbGVjdFNpbmdsZUl0ZW0oc2VsZWN0ZWRJdGVtLCBvcGVuTmV3ID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMuaGFzRm9jdXMoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCkgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICBpZiAob3Blbk5ldykge1xuICAgICAgICBhd2FpdCB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB7YWN0aXZhdGU6IHRydWV9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wZW5OZXcpIHtcbiAgICAgICAgLy8gVXNlciBleHBsaWNpdGx5IGFza2VkIHRvIHZpZXcgZGlmZiwgc3VjaCBhcyB2aWEgY2xpY2tcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge2FjdGl2YXRlOiBmYWxzZX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGFuZXNXaXRoU3RhbGVJdGVtc1RvVXBkYXRlID0gdGhpcy5nZXRQYW5lc1dpdGhTdGFsZVBlbmRpbmdGaWxlUGF0Y2hJdGVtKCk7XG4gICAgICAgIGlmIChwYW5lc1dpdGhTdGFsZUl0ZW1zVG9VcGRhdGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIFVwZGF0ZSBzdGFsZSBpdGVtcyB0byByZWZsZWN0IG5ldyBzZWxlY3Rpb25cbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwYW5lc1dpdGhTdGFsZUl0ZW1zVG9VcGRhdGUubWFwKGFzeW5jIHBhbmUgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge1xuICAgICAgICAgICAgICBhY3RpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIHBhbmUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2VsZWN0aW9uIHdhcyBjaGFuZ2VkIHZpYSBrZXlib2FyZCBuYXZpZ2F0aW9uLCB1cGRhdGUgcGVuZGluZyBpdGVtIGluIGFjdGl2ZSBwYW5lXG4gICAgICAgICAgY29uc3QgYWN0aXZlUGFuZSA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKTtcbiAgICAgICAgICBjb25zdCBhY3RpdmVQZW5kaW5nSXRlbSA9IGFjdGl2ZVBhbmUuZ2V0UGVuZGluZ0l0ZW0oKTtcbiAgICAgICAgICBjb25zdCBhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0gPSBhY3RpdmVQZW5kaW5nSXRlbSAmJiBhY3RpdmVQZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSAmJlxuICAgICAgICAgICAgYWN0aXZlUGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0oKSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbTtcbiAgICAgICAgICBpZiAoYWN0aXZlUGFuZUhhc1BlbmRpbmdGaWxlUGF0Y2hJdGVtKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7XG4gICAgICAgICAgICAgIGFjdGl2YXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgcGFuZTogYWN0aXZlUGFuZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFBhbmVzV2l0aFN0YWxlUGVuZGluZ0ZpbGVQYXRjaEl0ZW0oKSB7XG4gICAgLy8gXCJzdGFsZVwiIG1lYW5pbmcgdGhlcmUgaXMgbm8gbG9uZ2VyIGEgY2hhbmdlZCBmaWxlIGFzc29jaWF0ZWQgd2l0aCBpdGVtXG4gICAgLy8gZHVlIHRvIGNoYW5nZXMgYmVpbmcgZnVsbHkgc3RhZ2VkL3Vuc3RhZ2VkL3N0YXNoZWQvZGVsZXRlZC9ldGNcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0UGFuZXMoKS5maWx0ZXIocGFuZSA9PiB7XG4gICAgICBjb25zdCBwZW5kaW5nSXRlbSA9IHBhbmUuZ2V0UGVuZGluZ0l0ZW0oKTtcbiAgICAgIGlmICghcGVuZGluZ0l0ZW0gfHwgIXBlbmRpbmdJdGVtLmdldFJlYWxJdGVtKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgY29uc3QgcmVhbEl0ZW0gPSBwZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSgpO1xuICAgICAgaWYgKCEocmVhbEl0ZW0gaW5zdGFuY2VvZiBDaGFuZ2VkRmlsZUl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG9ubHkgd2FudCB0byB1cGRhdGUgcGVuZGluZyBkaWZmIHZpZXdzIGZvciBjdXJyZW50bHkgYWN0aXZlIHJlcG9cbiAgICAgIGNvbnN0IGlzSW5BY3RpdmVSZXBvID0gcmVhbEl0ZW0uZ2V0V29ya2luZ0RpcmVjdG9yeSgpID09PSB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoO1xuICAgICAgY29uc3QgaXNTdGFsZSA9ICF0aGlzLmNoYW5nZWRGaWxlRXhpc3RzKHJlYWxJdGVtLmdldEZpbGVQYXRoKCksIHJlYWxJdGVtLmdldFN0YWdpbmdTdGF0dXMoKSk7XG4gICAgICByZXR1cm4gaXNJbkFjdGl2ZVJlcG8gJiYgaXNTdGFsZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNoYW5nZWRGaWxlRXhpc3RzKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmZpbmRJdGVtKChpdGVtLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBrZXkgPT09IHN0YWdpbmdTdGF0dXMgJiYgaXRlbS5maWxlUGF0aCA9PT0gZmlsZVBhdGg7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBzaG93RmlsZVBhdGNoSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cywge2FjdGl2YXRlLCBwYW5lfSA9IHthY3RpdmF0ZTogZmFsc2V9KSB7XG4gICAgY29uc3QgdXJpID0gQ2hhbmdlZEZpbGVJdGVtLmJ1aWxkVVJJKGZpbGVQYXRoLCB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgICBjb25zdCBjaGFuZ2VkRmlsZUl0ZW0gPSBhd2FpdCB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKFxuICAgICAgdXJpLCB7cGVuZGluZzogdHJ1ZSwgYWN0aXZhdGVQYW5lOiBhY3RpdmF0ZSwgYWN0aXZhdGVJdGVtOiBhY3RpdmF0ZSwgcGFuZX0sXG4gICAgKTtcbiAgICBpZiAoYWN0aXZhdGUpIHtcbiAgICAgIGNvbnN0IGl0ZW1Sb290ID0gY2hhbmdlZEZpbGVJdGVtLmdldEVsZW1lbnQoKTtcbiAgICAgIGNvbnN0IGZvY3VzUm9vdCA9IGl0ZW1Sb290LnF1ZXJ5U2VsZWN0b3IoJ1t0YWJJbmRleF0nKTtcbiAgICAgIGlmIChmb2N1c1Jvb3QpIHtcbiAgICAgICAgZm9jdXNSb290LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNpbXBseSBtYWtlIGl0ZW0gdmlzaWJsZVxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UucGFuZUZvckl0ZW0oY2hhbmdlZEZpbGVJdGVtKS5hY3RpdmF0ZUl0ZW0oY2hhbmdlZEZpbGVJdGVtKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzaG93TWVyZ2VDb25mbGljdEZpbGVGb3JQYXRoKHJlbGF0aXZlRmlsZVBhdGgsIHthY3RpdmF0ZX0gPSB7YWN0aXZhdGU6IGZhbHNlfSkge1xuICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IHBhdGguam9pbih0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLCByZWxhdGl2ZUZpbGVQYXRoKTtcbiAgICBpZiAoYXdhaXQgdGhpcy5maWxlRXhpc3RzKGFic29sdXRlUGF0aCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKGFic29sdXRlUGF0aCwge2FjdGl2YXRlUGFuZTogYWN0aXZhdGUsIGFjdGl2YXRlSXRlbTogYWN0aXZhdGUsIHBlbmRpbmc6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEluZm8oJ0ZpbGUgaGFzIGJlZW4gZGVsZXRlZC4nKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZpbGVFeGlzdHMoYWJzb2x1dGVQYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBGaWxlKGFic29sdXRlUGF0aCkuZXhpc3RzKCk7XG4gIH1cblxuICBkYmxjbGlja09uSXRlbShldmVudCwgaXRlbSkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oW2l0ZW0uZmlsZVBhdGhdLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5saXN0S2V5Rm9ySXRlbShpdGVtKSk7XG4gIH1cblxuICBhc3luYyBjb250ZXh0TWVudU9uSXRlbShldmVudCwgaXRlbSkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLmhhcyhpdGVtKSkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RJdGVtKGl0ZW0sIGV2ZW50LnNoaWZ0S2V5KSxcbiAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5ld0V2ZW50ID0gbmV3IE1vdXNlRXZlbnQoZXZlbnQudHlwZSwgZXZlbnQpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKCFldmVudC50YXJnZXQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50Tm9kZS5kaXNwYXRjaEV2ZW50KG5ld0V2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1vdXNlZG93bk9uSXRlbShldmVudCwgaXRlbSkge1xuICAgIGNvbnN0IHdpbmRvd3MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInO1xuICAgIGlmIChldmVudC5jdHJsS2V5ICYmICF3aW5kb3dzKSB7IHJldHVybjsgfSAvLyBzaW1wbHkgb3BlbiBjb250ZXh0IG1lbnVcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwKSB7XG4gICAgICB0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IHRydWU7XG5cbiAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBpZiAoZXZlbnQubWV0YUtleSB8fCAoZXZlbnQuY3RybEtleSAmJiB3aW5kb3dzKSkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uYWRkT3JTdWJ0cmFjdFNlbGVjdGlvbihpdGVtKSxcbiAgICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RJdGVtKGl0ZW0sIGV2ZW50LnNoaWZ0S2V5KSxcbiAgICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1vdXNlbW92ZU9uSXRlbShldmVudCwgaXRlbSkge1xuICAgIGlmICh0aGlzLm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgdHJ1ZSksXG4gICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1vdXNldXAoKSB7XG4gICAgY29uc3QgaGFkU2VsZWN0aW9uSW5Qcm9ncmVzcyA9IHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzO1xuICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICAgIGlmIChoYWRTZWxlY3Rpb25JblByb2dyZXNzKSB7XG4gICAgICB0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXModHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgdW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZX0gPSB7fSkge1xuICAgIGlmICghdGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFkZEV2ZW50KCd1bmRvLWxhc3QtZGlzY2FyZCcsIHtcbiAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgY29tcG9uZW50OiAnU3RhZ2luZ1ZpZXcnLFxuICAgICAgZXZlbnRTb3VyY2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLnByb3BzLnVuZG9MYXN0RGlzY2FyZCgpO1xuICB9XG5cbiAgZ2V0Rm9jdXNDbGFzcyhsaXN0S2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSA9PT0gbGlzdEtleSA/ICdpcy1mb2N1c2VkJyA6ICcnO1xuICB9XG5cbiAgcmVnaXN0ZXJJdGVtRWxlbWVudChpdGVtLCBlbGVtZW50KSB7XG4gICAgdGhpcy5saXN0RWxlbWVudHNCeUl0ZW0uc2V0KGl0ZW0sIGVsZW1lbnQpO1xuICB9XG5cbiAgZ2V0Rm9jdXMoZWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5jb250YWlucyhlbGVtZW50KSkuZ2V0T3IoZmFsc2UpID8gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORyA6IG51bGw7XG4gIH1cblxuICBzZXRGb2N1cyhmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HKSB7XG4gICAgICB0aGlzLnJlZlJvb3QubWFwKHJvb3QgPT4gcm9vdC5mb2N1cygpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIGFkdmFuY2VGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORykge1xuICAgICAgaWYgKGF3YWl0IHRoaXMuYWN0aXZhdGVOZXh0TGlzdCgpKSB7XG4gICAgICAgIC8vIFRoZXJlIHdhcyBhIG5leHQgbGlzdCB0byBhY3RpdmF0ZS5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICAgIH1cblxuICAgICAgLy8gV2Ugd2VyZSBhbHJlYWR5IG9uIHRoZSBsYXN0IGxpc3QuXG4gICAgICByZXR1cm4gQ29tbWl0Vmlldy5maXJzdEZvY3VzO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXN5bmMgcmV0cmVhdEZvY3VzRnJvbShmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gQ29tbWl0Vmlldy5maXJzdEZvY3VzKSB7XG4gICAgICBhd2FpdCB0aGlzLmFjdGl2YXRlTGFzdExpc3QoKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkc7XG4gICAgfVxuXG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkcpIHtcbiAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGVQcmV2aW91c0xpc3QoKTtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKS5nZXRPcihmYWxzZSk7XG4gIH1cblxuICBpc1BvcHVsYXRlZChwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aCAhPSBudWxsICYmIChcbiAgICAgIHByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPiAwIHx8XG4gICAgICBwcm9wcy5tZXJnZUNvbmZsaWN0cy5sZW5ndGggPiAwIHx8XG4gICAgICBwcm9wcy5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA+IDBcbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUNBLElBQUFDLFNBQUEsR0FBQUQsT0FBQTtBQUVBLElBQUFFLEtBQUEsR0FBQUYsT0FBQTtBQUNBLElBQUFHLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUosT0FBQTtBQUNBLElBQUFLLFVBQUEsR0FBQUMsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFPLEtBQUEsR0FBQUQsc0JBQUEsQ0FBQU4sT0FBQTtBQUVBLElBQUFRLFdBQUEsR0FBQVIsT0FBQTtBQUNBLElBQUFTLHNCQUFBLEdBQUFILHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBVSxhQUFBLEdBQUFKLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBVywwQkFBQSxHQUFBTCxzQkFBQSxDQUFBTixPQUFBO0FBQ0EsSUFBQVksdUJBQUEsR0FBQU4sc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFhLG1CQUFBLEdBQUFQLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBYyxXQUFBLEdBQUFSLHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBZSxVQUFBLEdBQUFULHNCQUFBLENBQUFOLE9BQUE7QUFDQSxJQUFBZ0IsZ0JBQUEsR0FBQVYsc0JBQUEsQ0FBQU4sT0FBQTtBQUNBLElBQUFpQixTQUFBLEdBQUFiLHVCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBa0IsUUFBQSxHQUFBbEIsT0FBQTtBQUNBLElBQUFtQixjQUFBLEdBQUFuQixPQUFBO0FBQTJDLFNBQUFNLHVCQUFBYyxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBQUEsU0FBQUcseUJBQUFDLENBQUEsNkJBQUFDLE9BQUEsbUJBQUFD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