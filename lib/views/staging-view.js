"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventKit = require("event-kit");
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const remote = require('@electron/remote');
const {
  Menu,
  MenuItem
} = remote;
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
    menu.popup(remote.getCurrentWindow());
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
    menu.popup(remote.getCurrentWindow());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRLaXQiLCJyZXF1aXJlIiwiX2F0b20iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wcm9wVHlwZXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3BhdGgiLCJfcHJvcFR5cGVzMiIsIl9maWxlUGF0Y2hMaXN0SXRlbVZpZXciLCJfb2JzZXJ2ZU1vZGVsIiwiX21lcmdlQ29uZmxpY3RMaXN0SXRlbVZpZXciLCJfY29tcG9zaXRlTGlzdFNlbGVjdGlvbiIsIl9yZXNvbHV0aW9uUHJvZ3Jlc3MiLCJfY29tbWl0VmlldyIsIl9yZWZIb2xkZXIiLCJfY2hhbmdlZEZpbGVJdGVtIiwiX2NvbW1hbmRzIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiX3RvUHJvcGVydHlLZXkiLCJ2YWx1ZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJyZW1vdGUiLCJNZW51IiwiTWVudUl0ZW0iLCJkZWJvdW5jZSIsImZuIiwid2FpdCIsInRpbWVvdXQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMiLCJsaXN0cyIsInJlZHVjZSIsImFjYyIsImtleSIsImxpc3QiLCJzb3VyY2UiLCJNQVhJTVVNX0xJU1RFRF9FTlRSSUVTIiwic2xpY2UiLCJub29wIiwiU3RhZ2luZ1ZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ1bmRvTGFzdERpc2NhcmQiLCJldmVudFNvdXJjZSIsImNvbW1hbmQiLCJkaXNjYXJkQ2hhbmdlcyIsImRpc2NhcmRBbGwiLCJpdGVtUGF0aHMiLCJnZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMiLCJhdHRlbXB0RmlsZVN0YWdlT3BlcmF0aW9uIiwic3RhdGUiLCJzZWxlY3Rpb24iLCJnZXRBY3RpdmVMaXN0S2V5Iiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJjb2FsZXNjZSIsImF1dG9iaW5kIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhdG9tIiwiY29uZmlnIiwib2JzZXJ2ZSIsImRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSIsImRpZENoYW5nZVNlbGVjdGVkSXRlbXMiLCJ1bnN0YWdlZENoYW5nZXMiLCJzdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJDb21wb3NpdGVMaXN0U2VsZWN0aW9uIiwibGlzdHNCeUtleSIsImlkRm9ySXRlbSIsIml0ZW0iLCJmaWxlUGF0aCIsIm1vdXNlU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxpc3RFbGVtZW50c0J5SXRlbSIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJuZXh0UHJvcHMiLCJuZXh0U3RhdGUiLCJzb21lIiwibmV4dExpc3RzIiwidXBkYXRlTGlzdHMiLCJjb21wb25lbnREaWRNb3VudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJtb3VzZXVwIiwiYWRkIiwiRGlzcG9zYWJsZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ3b3Jrc3BhY2UiLCJvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIiwic3luY1dpdGhXb3Jrc3BhY2UiLCJpc1BvcHVsYXRlZCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImlzUmVwb1NhbWUiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsImhhc1NlbGVjdGlvbnNQcmVzZW50IiwiZ2V0U2VsZWN0ZWRJdGVtcyIsInNpemUiLCJzZWxlY3Rpb25DaGFuZ2VkIiwiaGVhZEl0ZW0iLCJnZXRIZWFkSXRlbSIsImVsZW1lbnQiLCJzY3JvbGxJbnRvVmlld0lmTmVlZGVkIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIm1vZGVsIiwicmVzb2x1dGlvblByb2dyZXNzIiwiZmV0Y2hEYXRhIiwicmVuZGVyQm9keSIsInNlbGVjdGVkSXRlbXMiLCJyZWYiLCJzZXR0ZXIiLCJjbGFzc05hbWUiLCJ0YWJJbmRleCIsInJlbmRlckNvbW1hbmRzIiwiZ2V0Rm9jdXNDbGFzcyIsInJlbmRlckFjdGlvbnNNZW51IiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwic3RhZ2VBbGwiLCJtYXAiLCJmaWxlUGF0Y2giLCJyZWdpc3Rlckl0ZW1FbGVtZW50Iiwib25Eb3VibGVDbGljayIsImV2ZW50IiwiZGJsY2xpY2tPbkl0ZW0iLCJvbkNvbnRleHRNZW51IiwiY29udGV4dE1lbnVPbkl0ZW0iLCJvbk1vdXNlRG93biIsIm1vdXNlZG93bk9uSXRlbSIsIm9uTW91c2VNb3ZlIiwibW91c2Vtb3ZlT25JdGVtIiwic2VsZWN0ZWQiLCJyZW5kZXJUcnVuY2F0ZWRNZXNzYWdlIiwicmVuZGVyTWVyZ2VDb25mbGljdHMiLCJ1bnN0YWdlQWxsIiwiRnJhZ21lbnQiLCJyZWdpc3RyeSIsImNvbW1hbmRzIiwidGFyZ2V0IiwiQ29tbWFuZCIsImNhbGxiYWNrIiwic2VsZWN0UHJldmlvdXMiLCJzZWxlY3ROZXh0IiwiZGl2ZUludG9TZWxlY3Rpb24iLCJzaG93RGlmZlZpZXciLCJzZWxlY3RBbGwiLCJzZWxlY3RGaXJzdCIsInNlbGVjdExhc3QiLCJjb25maXJtU2VsZWN0ZWRJdGVtcyIsImFjdGl2YXRlTmV4dExpc3QiLCJhY3RpdmF0ZVByZXZpb3VzTGlzdCIsIm9wZW5GaWxlIiwicmVzb2x2ZUN1cnJlbnRBc091cnMiLCJyZXNvbHZlQ3VycmVudEFzVGhlaXJzIiwiZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZCIsInVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyIsImRpc2NhcmRBbGxGcm9tQ29tbWFuZCIsInVuZG9MYXN0RGlzY2FyZEZyb21Db21tYW5kIiwiaGFzVW5kb0hpc3RvcnkiLCJzaG93QWN0aW9uc01lbnUiLCJyZW5kZXJVbmRvQnV0dG9uIiwidW5kb0xhc3REaXNjYXJkRnJvbUJ1dHRvbiIsImFueVVucmVzb2x2ZWQiLCJjb25mbGljdCIsInBhdGgiLCJqb2luIiwiY29uZmxpY3RQYXRoIiwiZ2V0UmVtYWluaW5nIiwiYnVsa1Jlc29sdmVEcm9wZG93biIsInNob3dCdWxrUmVzb2x2ZU1lbnUiLCJzdGFnZUFsbE1lcmdlQ29uZmxpY3RzIiwibWVyZ2VDb25mbGljdCIsImZ1bGxQYXRoIiwicmVtYWluaW5nQ29uZmxpY3RzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiQXJyYXkiLCJmcm9tIiwiZ2V0U2VsZWN0ZWRDb25mbGljdFBhdGhzIiwiZmlsZVBhdGhzIiwib3BlbkZpbGVzIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiZmlsZUNvdW50IiwidHlwZSIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwiYWR2YW5jZWQiLCJuZXh0IiwiYWN0aXZhdGVOZXh0U2VsZWN0aW9uIiwicmV0cmVhdGVkIiwiYWN0aXZhdGVQcmV2aW91c1NlbGVjdGlvbiIsImFjdGl2YXRlTGFzdExpc3QiLCJlbXB0eVNlbGVjdGlvbiIsImFjdGl2YXRlTGFzdFNlbGVjdGlvbiIsImF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbiIsImdldE5leHRMaXN0VXBkYXRlUHJvbWlzZSIsImdldE5leHRVcGRhdGVQcm9taXNlIiwicHJlc2VydmVUYWlsIiwic2VsZWN0UHJldmlvdXNJdGVtIiwic2VsZWN0TmV4dEl0ZW0iLCJzZWxlY3RBbGxJdGVtcyIsInNlbGVjdEZpcnN0SXRlbSIsInNlbGVjdExhc3RJdGVtIiwic2VsZWN0ZWRJdGVtIiwidmFsdWVzIiwic3RhZ2luZ1N0YXR1cyIsInNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgiLCJhY3RpdmF0ZSIsInNob3dGaWxlUGF0Y2hJdGVtIiwiZ2V0QWN0aXZlUGFuZUl0ZW0iLCJyZWFsSXRlbVByb21pc2UiLCJnZXRSZWFsSXRlbVByb21pc2UiLCJyZWFsSXRlbSIsImlzRmlsZVBhdGNoSXRlbSIsImlzTWF0Y2giLCJnZXRXb3JraW5nRGlyZWN0b3J5IiwicXVpZXRseVNlbGVjdEl0ZW0iLCJnZXRGaWxlUGF0aCIsImdldFN0YWdpbmdTdGF0dXMiLCJjb25mbGljdFBhdGhzIiwiYyIsInByZXZlbnREZWZhdWx0IiwibWVudSIsImFwcGVuZCIsImxhYmVsIiwiY2xpY2siLCJyZXNvbHZlQXNPdXJzIiwicmVzb2x2ZUFzVGhlaXJzIiwicG9wdXAiLCJnZXRDdXJyZW50V2luZG93Iiwic2VsZWN0ZWRJdGVtQ291bnQiLCJwbHVyYWxpemF0aW9uIiwiZW5hYmxlZCIsImZpbmRJdGVtIiwiZWFjaCIsImNvbnNvbGUiLCJsb2ciLCJzZWxlY3RJdGVtIiwib3Blbk5ldyIsImRpZFNlbGVjdFNpbmdsZUl0ZW0iLCJoYXNGb2N1cyIsInBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZSIsImdldFBhbmVzV2l0aFN0YWxlUGVuZGluZ0ZpbGVQYXRjaEl0ZW0iLCJhbGwiLCJwYW5lIiwiYWN0aXZlUGFuZSIsImdldENlbnRlciIsImdldEFjdGl2ZVBhbmUiLCJhY3RpdmVQZW5kaW5nSXRlbSIsImdldFBlbmRpbmdJdGVtIiwiYWN0aXZlUGFuZUhhc1BlbmRpbmdGaWxlUGF0Y2hJdGVtIiwiZ2V0UmVhbEl0ZW0iLCJDaGFuZ2VkRmlsZUl0ZW0iLCJnZXRQYW5lcyIsInBlbmRpbmdJdGVtIiwiaXNJbkFjdGl2ZVJlcG8iLCJpc1N0YWxlIiwiY2hhbmdlZEZpbGVFeGlzdHMiLCJ1cmkiLCJidWlsZFVSSSIsImNoYW5nZWRGaWxlSXRlbSIsIm9wZW4iLCJwZW5kaW5nIiwiYWN0aXZhdGVQYW5lIiwiYWN0aXZhdGVJdGVtIiwiaXRlbVJvb3QiLCJnZXRFbGVtZW50IiwiZm9jdXNSb290IiwicXVlcnlTZWxlY3RvciIsImZvY3VzIiwicGFuZUZvckl0ZW0iLCJyZWxhdGl2ZUZpbGVQYXRoIiwiYWJzb2x1dGVQYXRoIiwiZmlsZUV4aXN0cyIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJhZGRJbmZvIiwiRmlsZSIsImV4aXN0cyIsImxpc3RLZXlGb3JJdGVtIiwic3RvcFByb3BhZ2F0aW9uIiwicGVyc2lzdCIsInNoaWZ0S2V5IiwibmV3RXZlbnQiLCJNb3VzZUV2ZW50IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicGFyZW50Tm9kZSIsImRpc3BhdGNoRXZlbnQiLCJ3aW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiY3RybEtleSIsImJ1dHRvbiIsIm1ldGFLZXkiLCJhZGRPclN1YnRyYWN0U2VsZWN0aW9uIiwiaGFkU2VsZWN0aW9uSW5Qcm9ncmVzcyIsImxpc3RLZXkiLCJnZXRGb2N1cyIsInJvb3QiLCJjb250YWlucyIsImdldE9yIiwiU1RBR0lORyIsInNldEZvY3VzIiwiYWR2YW5jZUZvY3VzRnJvbSIsIkNvbW1pdFZpZXciLCJmaXJzdEZvY3VzIiwicmV0cmVhdEZvY3VzRnJvbSIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwiRmlsZVBhdGNoSXRlbVByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIk1lcmdlQ29uZmxpY3RJdGVtUHJvcFR5cGUiLCJzdHJpbmciLCJvYmplY3QiLCJib29sIiwiZnVuYyIsIlJlc29sdXRpb25Qcm9ncmVzcyJdLCJzb3VyY2VzIjpbInN0YWdpbmctdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5jb25zdCByZW1vdGUgPSByZXF1aXJlKCdAZWxlY3Ryb24vcmVtb3RlJyk7XG5jb25zdCB7TWVudSwgTWVudUl0ZW19ID0gcmVtb3RlO1xuaW1wb3J0IHtGaWxlfSBmcm9tICdhdG9tJztcbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RmlsZVBhdGNoSXRlbVByb3BUeXBlLCBNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBGaWxlUGF0Y2hMaXN0SXRlbVZpZXcgZnJvbSAnLi9maWxlLXBhdGNoLWxpc3QtaXRlbS12aWV3JztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3IGZyb20gJy4vbWVyZ2UtY29uZmxpY3QtbGlzdC1pdGVtLXZpZXcnO1xuaW1wb3J0IENvbXBvc2l0ZUxpc3RTZWxlY3Rpb24gZnJvbSAnLi4vbW9kZWxzL2NvbXBvc2l0ZS1saXN0LXNlbGVjdGlvbic7XG5pbXBvcnQgUmVzb2x1dGlvblByb2dyZXNzIGZyb20gJy4uL21vZGVscy9jb25mbGljdHMvcmVzb2x1dGlvbi1wcm9ncmVzcyc7XG5pbXBvcnQgQ29tbWl0VmlldyBmcm9tICcuL2NvbW1pdC12aWV3JztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IENoYW5nZWRGaWxlSXRlbSBmcm9tICcuLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbSc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBkZWJvdW5jZSA9IChmbiwgd2FpdCkgPT4ge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKGZuKC4uLmFyZ3MpKTtcbiAgICAgIH0sIHdhaXQpO1xuICAgIH0pO1xuICB9O1xufTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMobGlzdHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RzKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgY29uc3QgbGlzdCA9IGxpc3RzW2tleV07XG4gICAgYWNjLnNvdXJjZVtrZXldID0gbGlzdDtcbiAgICBpZiAobGlzdC5sZW5ndGggPD0gTUFYSU1VTV9MSVNURURfRU5UUklFUykge1xuICAgICAgYWNjW2tleV0gPSBsaXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2Nba2V5XSA9IGxpc3Quc2xpY2UoMCwgTUFYSU1VTV9MSVNURURfRU5UUklFUyk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG4gIH0sIHtzb3VyY2U6IHt9fSk7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7IH07XG5cbmNvbnN0IE1BWElNVU1fTElTVEVEX0VOVFJJRVMgPSAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnaW5nVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdW5zdGFnZWRDaGFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihGaWxlUGF0Y2hJdGVtUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgc3RhZ2VkQ2hhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoRmlsZVBhdGNoSXRlbVByb3BUeXBlKS5pc1JlcXVpcmVkLFxuICAgIG1lcmdlQ29uZmxpY3RzOiBQcm9wVHlwZXMuYXJyYXlPZihNZXJnZUNvbmZsaWN0SXRlbVByb3BUeXBlKSxcbiAgICB3b3JraW5nRGlyZWN0b3J5UGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgaGFzVW5kb0hpc3Rvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb3BlbkZpbGVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGF0dGVtcHRTdGFnZUFsbE9wZXJhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlQXNPdXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVBc1RoZWlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbWVyZ2VDb25mbGljdHM6IFtdLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogbmV3IFJlc29sdXRpb25Qcm9ncmVzcygpLFxuICB9XG5cbiAgc3RhdGljIGZvY3VzID0ge1xuICAgIFNUQUdJTkc6IFN5bWJvbCgnc3RhZ2luZycpLFxuICB9O1xuXG4gIHN0YXRpYyBmaXJzdEZvY3VzID0gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORztcblxuICBzdGF0aWMgbGFzdEZvY3VzID0gU3RhZ2luZ1ZpZXcuZm9jdXMuU1RBR0lORztcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnZGJsY2xpY2tPbkl0ZW0nLCAnY29udGV4dE1lbnVPbkl0ZW0nLCAnbW91c2Vkb3duT25JdGVtJywgJ21vdXNlbW92ZU9uSXRlbScsICdtb3VzZXVwJywgJ3JlZ2lzdGVySXRlbUVsZW1lbnQnLFxuICAgICAgJ3JlbmRlckJvZHknLCAnb3BlbkZpbGUnLCAnZGlzY2FyZENoYW5nZXMnLCAnYWN0aXZhdGVOZXh0TGlzdCcsICdhY3RpdmF0ZVByZXZpb3VzTGlzdCcsICdhY3RpdmF0ZUxhc3RMaXN0JyxcbiAgICAgICdzdGFnZUFsbCcsICd1bnN0YWdlQWxsJywgJ3N0YWdlQWxsTWVyZ2VDb25mbGljdHMnLCAnZGlzY2FyZEFsbCcsICdjb25maXJtU2VsZWN0ZWRJdGVtcycsICdzZWxlY3RBbGwnLFxuICAgICAgJ3NlbGVjdEZpcnN0JywgJ3NlbGVjdExhc3QnLCAnZGl2ZUludG9TZWxlY3Rpb24nLCAnc2hvd0RpZmZWaWV3JywgJ3Nob3dCdWxrUmVzb2x2ZU1lbnUnLCAnc2hvd0FjdGlvbnNNZW51JyxcbiAgICAgICdyZXNvbHZlQ3VycmVudEFzT3VycycsICdyZXNvbHZlQ3VycmVudEFzVGhlaXJzJywgJ3F1aWV0bHlTZWxlY3RJdGVtJywgJ2RpZENoYW5nZVNlbGVjdGVkSXRlbXMnLFxuICAgICk7XG5cbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2dpdGh1Yi5rZXlib2FyZE5hdmlnYXRpb25EZWxheScsIHZhbHVlID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0gPSB0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kZWJvdW5jZWREaWRDaGFuZ2VTZWxlY3RlZEl0ZW0gPSBkZWJvdW5jZSh0aGlzLmRpZENoYW5nZVNlbGVjdGVkSXRlbXMsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAuLi5jYWxjdWxhdGVUcnVuY2F0ZWRMaXN0cyh7XG4gICAgICAgIHVuc3RhZ2VkQ2hhbmdlczogdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMsXG4gICAgICAgIHN0YWdlZENoYW5nZXM6IHRoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgbWVyZ2VDb25mbGljdHM6IHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMsXG4gICAgICB9KSxcbiAgICAgIHNlbGVjdGlvbjogbmV3IENvbXBvc2l0ZUxpc3RTZWxlY3Rpb24oe1xuICAgICAgICBsaXN0c0J5S2V5OiBbXG4gICAgICAgICAgWyd1bnN0YWdlZCcsIHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgICBbJ2NvbmZsaWN0cycsIHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHNdLFxuICAgICAgICAgIFsnc3RhZ2VkJywgdGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgXSxcbiAgICAgICAgaWRGb3JJdGVtOiBpdGVtID0+IGl0ZW0uZmlsZVBhdGgsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbSA9IG5ldyBXZWFrTWFwKCk7XG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhuZXh0UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGxldCBuZXh0U3RhdGUgPSB7fTtcblxuICAgIGlmIChcbiAgICAgIFsndW5zdGFnZWRDaGFuZ2VzJywgJ3N0YWdlZENoYW5nZXMnLCAnbWVyZ2VDb25mbGljdHMnXS5zb21lKGtleSA9PiBwcmV2U3RhdGUuc291cmNlW2tleV0gIT09IG5leHRQcm9wc1trZXldKVxuICAgICkge1xuICAgICAgY29uc3QgbmV4dExpc3RzID0gY2FsY3VsYXRlVHJ1bmNhdGVkTGlzdHMoe1xuICAgICAgICB1bnN0YWdlZENoYW5nZXM6IG5leHRQcm9wcy51bnN0YWdlZENoYW5nZXMsXG4gICAgICAgIHN0YWdlZENoYW5nZXM6IG5leHRQcm9wcy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBtZXJnZUNvbmZsaWN0czogbmV4dFByb3BzLm1lcmdlQ29uZmxpY3RzLFxuICAgICAgfSk7XG5cbiAgICAgIG5leHRTdGF0ZSA9IHtcbiAgICAgICAgLi4ubmV4dExpc3RzLFxuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24udXBkYXRlTGlzdHMoW1xuICAgICAgICAgIFsndW5zdGFnZWQnLCBuZXh0TGlzdHMudW5zdGFnZWRDaGFuZ2VzXSxcbiAgICAgICAgICBbJ2NvbmZsaWN0cycsIG5leHRMaXN0cy5tZXJnZUNvbmZsaWN0c10sXG4gICAgICAgICAgWydzdGFnZWQnLCBuZXh0TGlzdHMuc3RhZ2VkQ2hhbmdlc10sXG4gICAgICAgIF0pLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNldXApO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCkpLFxuICAgICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3luY1dpdGhXb3Jrc3BhY2UoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc1BvcHVsYXRlZCh0aGlzLnByb3BzKSkge1xuICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGNvbnN0IGlzUmVwb1NhbWUgPSBwcmV2UHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGggPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgY29uc3QgaGFzU2VsZWN0aW9uc1ByZXNlbnQgPVxuICAgICAgcHJldlN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDAgJiZcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKS5zaXplID4gMDtcbiAgICBjb25zdCBzZWxlY3Rpb25DaGFuZ2VkID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24gIT09IHByZXZTdGF0ZS5zZWxlY3Rpb247XG5cbiAgICBpZiAoaXNSZXBvU2FtZSAmJiBoYXNTZWxlY3Rpb25zUHJlc2VudCAmJiBzZWxlY3Rpb25DaGFuZ2VkKSB7XG4gICAgICB0aGlzLmRlYm91bmNlZERpZENoYW5nZVNlbGVjdGVkSXRlbSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRJdGVtID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0SGVhZEl0ZW0oKTtcbiAgICBpZiAoaGVhZEl0ZW0pIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbS5nZXQoaGVhZEl0ZW0pO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzUG9wdWxhdGVkKHByZXZQcm9wcykgJiYgdGhpcy5pc1BvcHVsYXRlZCh0aGlzLnByb3BzKSkge1xuICAgICAgdGhpcy5zeW5jV2l0aFdvcmtzcGFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9IGZldGNoRGF0YT17bm9vcH0+XG4gICAgICAgIHt0aGlzLnJlbmRlckJvZHl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQm9keSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfVxuICAgICAgICBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXcgJHt0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCl9LWNoYW5nZXMtZm9jdXNlZGB9XG4gICAgICAgIHRhYkluZGV4PVwiLTFcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLVVuc3RhZ2VkQ2hhbmdlcyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygndW5zdGFnZWQnKX1gfT5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1saXN0LXVub3JkZXJlZFwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctdGl0bGVcIj5VbnN0YWdlZCBDaGFuZ2VzPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQWN0aW9uc01lbnUoKX1cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBpY29uIGljb24tbW92ZS1kb3duXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zdGFnZUFsbH0+U3RhZ2UgQWxsPC9idXR0b24+XG4gICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctbGlzdCBnaXRodWItRmlsZVBhdGNoTGlzdFZpZXcgZ2l0aHViLVN0YWdpbmdWaWV3LXVuc3RhZ2VkXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUudW5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gKFxuICAgICAgICAgICAgICAgIDxGaWxlUGF0Y2hMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgICAgICAgIGtleT17ZmlsZVBhdGNoLmZpbGVQYXRofVxuICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgZmlsZVBhdGNoPXtmaWxlUGF0Y2h9XG4gICAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtldmVudCA9PiB0aGlzLmRibGNsaWNrT25JdGVtKGV2ZW50LCBmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZXZlbnQgPT4gdGhpcy5jb250ZXh0TWVudU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtldmVudCA9PiB0aGlzLm1vdXNlZG93bk9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlPXtldmVudCA9PiB0aGlzLm1vdXNlbW92ZU9uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEl0ZW1zLmhhcyhmaWxlUGF0Y2gpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZSh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJNZXJnZUNvbmZsaWN0cygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cCBnaXRodWItU3RhZ2VkQ2hhbmdlcyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygnc3RhZ2VkJyl9YH0gPlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRhc2tsaXN0XCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICBTdGFnZWQgQ2hhbmdlc1xuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLXVwXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudW5zdGFnZUFsbH0+VW5zdGFnZSBBbGw8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctc3RhZ2VkXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RhZ2VkQ2hhbmdlcy5tYXAoZmlsZVBhdGNoID0+IChcbiAgICAgICAgICAgICAgICA8RmlsZVBhdGNoTGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICBrZXk9e2ZpbGVQYXRjaC5maWxlUGF0aH1cbiAgICAgICAgICAgICAgICAgIGZpbGVQYXRjaD17ZmlsZVBhdGNofVxuICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJJdGVtRWxlbWVudD17dGhpcy5yZWdpc3Rlckl0ZW1FbGVtZW50fVxuICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIGZpbGVQYXRjaCl9XG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMoZmlsZVBhdGNoKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRydW5jYXRlZE1lc3NhZ2UodGhpcy5wcm9wcy5zdGFnZWRDaGFuZ2VzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLVN0YWdpbmdWaWV3XCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS11cFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdFByZXZpb3VzKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS1kb3duXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0TmV4dCgpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtbGVmdFwiIGNhbGxiYWNrPXt0aGlzLmRpdmVJbnRvU2VsZWN0aW9ufSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy1kaWZmLXZpZXdcIiBjYWxsYmFjaz17dGhpcy5zaG93RGlmZlZpZXd9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXVwXCIgY2FsbGJhY2s9eygpID0+IHRoaXMuc2VsZWN0UHJldmlvdXModHJ1ZSl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LWRvd25cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3ROZXh0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC1hbGxcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RBbGx9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6bW92ZS10by10b3BcIiBjYWxsYmFjaz17dGhpcy5zZWxlY3RGaXJzdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLXRvLWJvdHRvbVwiIGNhbGxiYWNrPXt0aGlzLnNlbGVjdExhc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6c2VsZWN0LXRvLXRvcFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnNlbGVjdEZpcnN0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOnNlbGVjdC10by1ib3R0b21cIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5zZWxlY3RMYXN0KHRydWUpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiBjYWxsYmFjaz17dGhpcy5jb25maXJtU2VsZWN0ZWRJdGVtc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmFjdGl2YXRlLW5leHQtbGlzdFwiIGNhbGxiYWNrPXt0aGlzLmFjdGl2YXRlTmV4dExpc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjphY3RpdmF0ZS1wcmV2aW91cy1saXN0XCIgY2FsbGJhY2s9e3RoaXMuYWN0aXZhdGVQcmV2aW91c0xpc3R9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpqdW1wLXRvLWZpbGVcIiBjYWxsYmFjaz17dGhpcy5vcGVuRmlsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtZmlsZS1hcy1vdXJzXCIgY2FsbGJhY2s9e3RoaXMucmVzb2x2ZUN1cnJlbnRBc091cnN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpyZXNvbHZlLWZpbGUtYXMtdGhlaXJzXCIgY2FsbGJhY2s9e3RoaXMucmVzb2x2ZUN1cnJlbnRBc1RoZWlyc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpc2NhcmQtY2hhbmdlcy1pbi1zZWxlY3RlZC1maWxlc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRDaGFuZ2VzRnJvbUNvbW1hbmR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImNvcmU6dW5kb1wiIGNhbGxiYWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kb30gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3RhZ2UtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy5zdGFnZUFsbH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnVuc3RhZ2UtYWxsLWNoYW5nZXNcIiBjYWxsYmFjaz17dGhpcy51bnN0YWdlQWxsfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZGlzY2FyZC1hbGwtY2hhbmdlc1wiIGNhbGxiYWNrPXt0aGlzLmRpc2NhcmRBbGxGcm9tQ29tbWFuZH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnVuZG8tbGFzdC1kaXNjYXJkLWluLWdpdC10YWJcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudW5kb0xhc3REaXNjYXJkRnJvbUNvbW1hbmR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db3JlVW5kbyA9ICgpID0+IHtcbiAgICB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6IHtjb21tYW5kOiAnY29yZTp1bmRvJ319KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21Db21tYW5kID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6dW5kby1sYXN0LWRpc2NhcmQtaW4tZ2l0LXRhYid9fSk7XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmRGcm9tQnV0dG9uID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2J1dHRvbid9KTtcbiAgfVxuXG4gIHVuZG9MYXN0RGlzY2FyZEZyb21IZWFkZXJNZW51ID0gKCkgPT4ge1xuICAgIHRoaXMudW5kb0xhc3REaXNjYXJkKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pO1xuICB9XG5cbiAgZGlzY2FyZENoYW5nZXNGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2NhcmRDaGFuZ2VzKHtldmVudFNvdXJjZToge2NvbW1hbmQ6ICdnaXRodWI6ZGlzY2FyZC1jaGFuZ2VzLWluLXNlbGVjdGVkLWZpbGVzJ319KTtcbiAgfVxuXG4gIGRpc2NhcmRBbGxGcm9tQ29tbWFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmRpc2NhcmRBbGwoe2V2ZW50U291cmNlOiB7Y29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLWFsbC1jaGFuZ2VzJ319KTtcbiAgfVxuXG4gIHJlbmRlckFjdGlvbnNNZW51KCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggfHwgdGhpcy5wcm9wcy5oYXNVbmRvSGlzdG9yeSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1oZWFkZXJCdXR0b24gZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbi0taWNvbk9ubHkgaWNvbiBpY29uLWVsbGlwc2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNob3dBY3Rpb25zTWVudX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclVuZG9CdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVN0YWdpbmdWaWV3LWhlYWRlckJ1dHRvbiBnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uLS1mdWxsV2lkdGggaWNvbiBpY29uLWhpc3RvcnlcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLnVuZG9MYXN0RGlzY2FyZEZyb21CdXR0b259PlVuZG8gRGlzY2FyZDwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUcnVuY2F0ZWRNZXNzYWdlKGxpc3QpIHtcbiAgICBpZiAobGlzdC5sZW5ndGggPiBNQVhJTVVNX0xJU1RFRF9FTlRSSUVTKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1ncm91cC10cnVuY2F0ZWRNc2dcIj5cbiAgICAgICAgICBMaXN0IHRydW5jYXRlZCB0byB0aGUgZmlyc3Qge01BWElNVU1fTElTVEVEX0VOVFJJRVN9IGl0ZW1zXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTWVyZ2VDb25mbGljdHMoKSB7XG4gICAgY29uc3QgbWVyZ2VDb25mbGljdHMgPSB0aGlzLnN0YXRlLm1lcmdlQ29uZmxpY3RzO1xuXG4gICAgaWYgKG1lcmdlQ29uZmxpY3RzICYmIG1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgICBjb25zdCByZXNvbHV0aW9uUHJvZ3Jlc3MgPSB0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzcztcbiAgICAgIGNvbnN0IGFueVVucmVzb2x2ZWQgPSBtZXJnZUNvbmZsaWN0c1xuICAgICAgICAubWFwKGNvbmZsaWN0ID0+IHBhdGguam9pbih0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoLCBjb25mbGljdC5maWxlUGF0aCkpXG4gICAgICAgIC5zb21lKGNvbmZsaWN0UGF0aCA9PiByZXNvbHV0aW9uUHJvZ3Jlc3MuZ2V0UmVtYWluaW5nKGNvbmZsaWN0UGF0aCkgIT09IDApO1xuXG4gICAgICBjb25zdCBidWxrUmVzb2x2ZURyb3Bkb3duID0gYW55VW5yZXNvbHZlZCA/IChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgaWNvbiBpY29uLWVsbGlwc2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNob3dCdWxrUmVzb2x2ZU1lbnV9XG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BnaXRodWItU3RhZ2luZ1ZpZXctZ3JvdXAgZ2l0aHViLU1lcmdlQ29uZmxpY3RQYXRocyAke3RoaXMuZ2V0Rm9jdXNDbGFzcygnY29uZmxpY3RzJyl9YH0+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9eydnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tYWxlcnQgc3RhdHVzLW1vZGlmaWVkJ30gLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy10aXRsZVwiPk1lcmdlIENvbmZsaWN0czwvc3Bhbj5cbiAgICAgICAgICAgIHtidWxrUmVzb2x2ZURyb3Bkb3dufVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhZ2luZ1ZpZXctaGVhZGVyQnV0dG9uIGljb24gaWNvbi1tb3ZlLWRvd25cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17YW55VW5yZXNvbHZlZH1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zdGFnZUFsbE1lcmdlQ29uZmxpY3RzfT5cbiAgICAgICAgICAgICAgU3RhZ2UgQWxsXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1TdGFnaW5nVmlldy1saXN0IGdpdGh1Yi1GaWxlUGF0Y2hMaXN0VmlldyBnaXRodWItU3RhZ2luZ1ZpZXctbWVyZ2VcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWVyZ2VDb25mbGljdHMubWFwKG1lcmdlQ29uZmxpY3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIG1lcmdlQ29uZmxpY3QuZmlsZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxNZXJnZUNvbmZsaWN0TGlzdEl0ZW1WaWV3XG4gICAgICAgICAgICAgICAgICAgIGtleT17ZnVsbFBhdGh9XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlQ29uZmxpY3Q9e21lcmdlQ29uZmxpY3R9XG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0NvbmZsaWN0cz17cmVzb2x1dGlvblByb2dyZXNzLmdldFJlbWFpbmluZyhmdWxsUGF0aCl9XG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVySXRlbUVsZW1lbnQ9e3RoaXMucmVnaXN0ZXJJdGVtRWxlbWVudH1cbiAgICAgICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17ZXZlbnQgPT4gdGhpcy5kYmxjbGlja09uSXRlbShldmVudCwgbWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e2V2ZW50ID0+IHRoaXMuY29udGV4dE1lbnVPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZXZlbnQgPT4gdGhpcy5tb3VzZWRvd25Pbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZT17ZXZlbnQgPT4gdGhpcy5tb3VzZW1vdmVPbkl0ZW0oZXZlbnQsIG1lcmdlQ29uZmxpY3QpfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRJdGVtcy5oYXMobWVyZ2VDb25mbGljdCl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyVHJ1bmNhdGVkTWVzc2FnZShtZXJnZUNvbmZsaWN0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxub3NjcmlwdCAvPjtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSwgaXRlbSA9PiBpdGVtLmZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpICE9PSAnY29uZmxpY3RzJykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRTZWxlY3RlZEl0ZW1GaWxlUGF0aHMoKTtcbiAgfVxuXG4gIG9wZW5GaWxlKCkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtRmlsZVBhdGhzKCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMub3BlbkZpbGVzKGZpbGVQYXRocyk7XG4gIH1cblxuICBkaXNjYXJkQ2hhbmdlcyh7ZXZlbnRTb3VyY2V9ID0ge30pIHtcbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIGFkZEV2ZW50KCdkaXNjYXJkLXVuc3RhZ2VkLWNoYW5nZXMnLCB7XG4gICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgIGNvbXBvbmVudDogJ1N0YWdpbmdWaWV3JyxcbiAgICAgIGZpbGVDb3VudDogZmlsZVBhdGhzLmxlbmd0aCxcbiAgICAgIHR5cGU6ICdzZWxlY3RlZCcsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpO1xuICB9XG5cbiAgYWN0aXZhdGVOZXh0TGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgYWR2YW5jZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZU5leHRTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBhZHZhbmNlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBuZXh0LmNvYWxlc2NlKCl9O1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZShhZHZhbmNlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWN0aXZhdGVQcmV2aW91c0xpc3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IHJldHJlYXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4ge1xuICAgICAgICBjb25zdCBuZXh0ID0gcHJldlN0YXRlLnNlbGVjdGlvbi5hY3RpdmF0ZVByZXZpb3VzU2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChwcmV2U3RhdGUuc2VsZWN0aW9uID09PSBuZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0cmVhdGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHtzZWxlY3Rpb246IG5leHQuY29hbGVzY2UoKX07XG4gICAgICB9LCAoKSA9PiByZXNvbHZlKHJldHJlYXRlZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWN0aXZhdGVMYXN0TGlzdCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgZW1wdHlTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uYWN0aXZhdGVMYXN0U2VsZWN0aW9uKCk7XG4gICAgICAgIGVtcHR5U2VsZWN0aW9uID0gbmV4dC5nZXRTZWxlY3RlZEl0ZW1zKCkuc2l6ZSA+IDA7XG5cbiAgICAgICAgaWYgKHByZXZTdGF0ZS5zZWxlY3Rpb24gPT09IG5leHQpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3NlbGVjdGlvbjogbmV4dC5jb2FsZXNjZSgpfTtcbiAgICAgIH0sICgpID0+IHJlc29sdmUoZW1wdHlTZWxlY3Rpb24pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YWdlQWxsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdHRlbXB0U3RhZ2VBbGxPcGVyYXRpb24oJ3Vuc3RhZ2VkJyk7XG4gIH1cblxuICB1bnN0YWdlQWxsKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdFN0YWdlQWxsT3BlcmF0aW9uKCdzdGFnZWQnKTtcbiAgfVxuXG4gIHN0YWdlQWxsTWVyZ2VDb25mbGljdHMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubWVyZ2VDb25mbGljdHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5wcm9wcy5tZXJnZUNvbmZsaWN0cy5tYXAoY29uZmxpY3QgPT4gY29uZmxpY3QuZmlsZVBhdGgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmF0dGVtcHRGaWxlU3RhZ2VPcGVyYXRpb24oZmlsZVBhdGhzLCAndW5zdGFnZWQnKTtcbiAgfVxuXG4gIGRpc2NhcmRBbGwoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMucHJvcHMudW5zdGFnZWRDaGFuZ2VzLm1hcChmaWxlUGF0Y2ggPT4gZmlsZVBhdGNoLmZpbGVQYXRoKTtcbiAgICBhZGRFdmVudCgnZGlzY2FyZC11bnN0YWdlZC1jaGFuZ2VzJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBmaWxlQ291bnQ6IGZpbGVQYXRocy5sZW5ndGgsXG4gICAgICB0eXBlOiAnYWxsJyxcbiAgICAgIGV2ZW50U291cmNlLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocyk7XG4gIH1cblxuICBjb25maXJtU2VsZWN0ZWRJdGVtcyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpdGVtUGF0aHMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbUZpbGVQYXRocygpO1xuICAgIGF3YWl0IHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihpdGVtUGF0aHMsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe3NlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5jb2FsZXNjZSgpfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmV4dExpc3RVcGRhdGVQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXROZXh0VXBkYXRlUHJvbWlzZSgpO1xuICB9XG5cbiAgc2VsZWN0UHJldmlvdXMocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0UHJldmlvdXNJdGVtKHByZXNlcnZlVGFpbCkuY29hbGVzY2UoKSxcbiAgICAgIH0pLCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdE5leHQocHJlc2VydmVUYWlsID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0TmV4dEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RBbGxJdGVtcygpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxlY3RGaXJzdChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RGaXJzdEl0ZW0ocHJlc2VydmVUYWlsKS5jb2FsZXNjZSgpLFxuICAgICAgfSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0TGFzdChwcmVzZXJ2ZVRhaWwgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5zZWxlY3RMYXN0SXRlbShwcmVzZXJ2ZVRhaWwpLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkaXZlSW50b1NlbGVjdGlvbigpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLnNpemUgIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuXG4gICAgaWYgKHN0YWdpbmdTdGF0dXMgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB7YWN0aXZhdGU6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSwge2FjdGl2YXRlOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3luY1dpdGhXb3Jrc3BhY2UoKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVhbEl0ZW1Qcm9taXNlID0gaXRlbS5nZXRSZWFsSXRlbVByb21pc2UgJiYgaXRlbS5nZXRSZWFsSXRlbVByb21pc2UoKTtcbiAgICBjb25zdCByZWFsSXRlbSA9IGF3YWl0IHJlYWxJdGVtUHJvbWlzZTtcbiAgICBpZiAoIXJlYWxJdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNGaWxlUGF0Y2hJdGVtID0gcmVhbEl0ZW0uaXNGaWxlUGF0Y2hJdGVtICYmIHJlYWxJdGVtLmlzRmlsZVBhdGNoSXRlbSgpO1xuICAgIGNvbnN0IGlzTWF0Y2ggPSByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5ICYmIHJlYWxJdGVtLmdldFdvcmtpbmdEaXJlY3RvcnkoKSA9PT0gdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5UGF0aDtcblxuICAgIGlmIChpc0ZpbGVQYXRjaEl0ZW0gJiYgaXNNYXRjaCkge1xuICAgICAgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShyZWFsSXRlbS5nZXRGaWxlUGF0aCgpLCByZWFsSXRlbS5nZXRTdGFnaW5nU3RhdHVzKCkpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNob3dEaWZmVmlldygpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLnNpemUgIT09IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICBjb25zdCBzdGFnaW5nU3RhdHVzID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpO1xuXG4gICAgaWYgKHN0YWdpbmdTdGF0dXMgPT09ICdjb25mbGljdHMnKSB7XG4gICAgICB0aGlzLnNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgoc2VsZWN0ZWRJdGVtLmZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zaG93RmlsZVBhdGNoSXRlbShzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0J1bGtSZXNvbHZlTWVudShldmVudCkge1xuICAgIGNvbnN0IGNvbmZsaWN0UGF0aHMgPSB0aGlzLnByb3BzLm1lcmdlQ29uZmxpY3RzLm1hcChjID0+IGMuZmlsZVBhdGgpO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUmVzb2x2ZSBBbGwgYXMgT3VycycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5wcm9wcy5yZXNvbHZlQXNPdXJzKGNvbmZsaWN0UGF0aHMpLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1Jlc29sdmUgQWxsIGFzIFRoZWlycycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnMoY29uZmxpY3RQYXRocyksXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHNob3dBY3Rpb25zTWVudShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbUNvdW50ID0gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLnNpemU7XG4gICAgY29uc3QgcGx1cmFsaXphdGlvbiA9IHNlbGVjdGVkSXRlbUNvdW50ID4gMSA/ICdzJyA6ICcnO1xuXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnRGlzY2FyZCBBbGwgQ2hhbmdlcycsXG4gICAgICBjbGljazogKCkgPT4gdGhpcy5kaXNjYXJkQWxsKHtldmVudFNvdXJjZTogJ2hlYWRlci1tZW51J30pLFxuICAgICAgZW5hYmxlZDogdGhpcy5wcm9wcy51bnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMCxcbiAgICB9KSk7XG5cbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgbGFiZWw6ICdEaXNjYXJkIENoYW5nZXMgaW4gU2VsZWN0ZWQgRmlsZScgKyBwbHVyYWxpemF0aW9uLFxuICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZGlzY2FyZENoYW5nZXMoe2V2ZW50U291cmNlOiAnaGVhZGVyLW1lbnUnfSksXG4gICAgICBlbmFibGVkOiAhISh0aGlzLnByb3BzLnVuc3RhZ2VkQ2hhbmdlcy5sZW5ndGggJiYgc2VsZWN0ZWRJdGVtQ291bnQpLFxuICAgIH0pKTtcblxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ1VuZG8gTGFzdCBEaXNjYXJkJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnVuZG9MYXN0RGlzY2FyZCh7ZXZlbnRTb3VyY2U6ICdoZWFkZXItbWVudSd9KSxcbiAgICAgIGVuYWJsZWQ6IHRoaXMucHJvcHMuaGFzVW5kb0hpc3RvcnksXG4gICAgfSkpO1xuXG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfVxuXG4gIHJlc29sdmVDdXJyZW50QXNPdXJzKCkge1xuICAgIHRoaXMucHJvcHMucmVzb2x2ZUFzT3Vycyh0aGlzLmdldFNlbGVjdGVkQ29uZmxpY3RQYXRocygpKTtcbiAgfVxuXG4gIHJlc29sdmVDdXJyZW50QXNUaGVpcnMoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXNvbHZlQXNUaGVpcnModGhpcy5nZXRTZWxlY3RlZENvbmZsaWN0UGF0aHMoKSk7XG4gIH1cblxuICAvLyBEaXJlY3RseSBtb2RpZnkgdGhlIHNlbGVjdGlvbiB0byBpbmNsdWRlIG9ubHkgdGhlIGl0ZW0gaWRlbnRpZmllZCBieSB0aGUgZmlsZSBwYXRoIGFuZCBzdGFnaW5nU3RhdHVzIHR1cGxlLlxuICAvLyBSZS1yZW5kZXIgdGhlIGNvbXBvbmVudCwgYnV0IGRvbid0IG5vdGlmeSBkaWRTZWxlY3RTaW5nbGVJdGVtKCkgb3Igb3RoZXIgY2FsbGJhY2sgZnVuY3Rpb25zLiBUaGlzIGlzIHVzZWZ1bCB0b1xuICAvLyBhdm9pZCBjaXJjdWxhciBjYWxsYmFjayBsb29wcyBmb3IgYWN0aW9ucyBvcmlnaW5hdGluZyBpbiBGaWxlUGF0Y2hWaWV3IG9yIFRleHRFZGl0b3JzIHdpdGggbWVyZ2UgY29uZmxpY3RzLlxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHByZXZTdGF0ZS5zZWxlY3Rpb24uZmluZEl0ZW0oKGVhY2gsIGtleSkgPT4gZWFjaC5maWxlUGF0aCA9PT0gZmlsZVBhdGggJiYga2V5ID09PSBzdGFnaW5nU3RhdHVzKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgLy8gRklYTUU6IG1ha2Ugc3RhZ2luZyB2aWV3IGRpc3BsYXkgbm8gc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5sb2coYFVuYWJsZSB0byBmaW5kIGl0ZW0gYXQgcGF0aCAke2ZpbGVQYXRofSB3aXRoIHN0YWdpbmcgc3RhdHVzICR7c3RhZ2luZ1N0YXR1c31gKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7c2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSl9O1xuICAgICAgfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEl0ZW1zKCkge1xuICAgIGNvbnN0IHN0YWdpbmdTdGF0dXMgPSB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0U2VsZWN0ZWRJdGVtcygpLCBpdGVtID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZpbGVQYXRoOiBpdGVtLmZpbGVQYXRoLFxuICAgICAgICBzdGFnaW5nU3RhdHVzLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpZENoYW5nZVNlbGVjdGVkSXRlbXMob3Blbk5ldykge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSBBcnJheS5mcm9tKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldFNlbGVjdGVkSXRlbXMoKSk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLmRpZFNlbGVjdFNpbmdsZUl0ZW0oc2VsZWN0ZWRJdGVtc1swXSwgb3Blbk5ldyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlkU2VsZWN0U2luZ2xlSXRlbShzZWxlY3RlZEl0ZW0sIG9wZW5OZXcgPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uLmdldEFjdGl2ZUxpc3RLZXkoKSA9PT0gJ2NvbmZsaWN0cycpIHtcbiAgICAgIGlmIChvcGVuTmV3KSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd01lcmdlQ29uZmxpY3RGaWxlRm9yUGF0aChzZWxlY3RlZEl0ZW0uZmlsZVBhdGgsIHthY3RpdmF0ZTogdHJ1ZX0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3Blbk5ldykge1xuICAgICAgICAvLyBVc2VyIGV4cGxpY2l0bHkgYXNrZWQgdG8gdmlldyBkaWZmLCBzdWNoIGFzIHZpYSBjbGlja1xuICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7YWN0aXZhdGU6IGZhbHNlfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwYW5lc1dpdGhTdGFsZUl0ZW1zVG9VcGRhdGUgPSB0aGlzLmdldFBhbmVzV2l0aFN0YWxlUGVuZGluZ0ZpbGVQYXRjaEl0ZW0oKTtcbiAgICAgICAgaWYgKHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIHN0YWxlIGl0ZW1zIHRvIHJlZmxlY3QgbmV3IHNlbGVjdGlvblxuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHBhbmVzV2l0aFN0YWxlSXRlbXNUb1VwZGF0ZS5tYXAoYXN5bmMgcGFuZSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNob3dGaWxlUGF0Y2hJdGVtKHNlbGVjdGVkSXRlbS5maWxlUGF0aCwgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpLCB7XG4gICAgICAgICAgICAgIGFjdGl2YXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgcGFuZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZWxlY3Rpb24gd2FzIGNoYW5nZWQgdmlhIGtleWJvYXJkIG5hdmlnYXRpb24sIHVwZGF0ZSBwZW5kaW5nIGl0ZW0gaW4gYWN0aXZlIHBhbmVcbiAgICAgICAgICBjb25zdCBhY3RpdmVQYW5lID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBlbmRpbmdJdGVtID0gYWN0aXZlUGFuZS5nZXRQZW5kaW5nSXRlbSgpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZVBhbmVIYXNQZW5kaW5nRmlsZVBhdGNoSXRlbSA9IGFjdGl2ZVBlbmRpbmdJdGVtICYmIGFjdGl2ZVBlbmRpbmdJdGVtLmdldFJlYWxJdGVtICYmXG4gICAgICAgICAgICBhY3RpdmVQZW5kaW5nSXRlbS5nZXRSZWFsSXRlbSgpIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtO1xuICAgICAgICAgIGlmIChhY3RpdmVQYW5lSGFzUGVuZGluZ0ZpbGVQYXRjaEl0ZW0pIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2hvd0ZpbGVQYXRjaEl0ZW0oc2VsZWN0ZWRJdGVtLmZpbGVQYXRoLCB0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRBY3RpdmVMaXN0S2V5KCksIHtcbiAgICAgICAgICAgICAgYWN0aXZhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICBwYW5lOiBhY3RpdmVQYW5lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZXNXaXRoU3RhbGVQZW5kaW5nRmlsZVBhdGNoSXRlbSgpIHtcbiAgICAvLyBcInN0YWxlXCIgbWVhbmluZyB0aGVyZSBpcyBubyBsb25nZXIgYSBjaGFuZ2VkIGZpbGUgYXNzb2NpYXRlZCB3aXRoIGl0ZW1cbiAgICAvLyBkdWUgdG8gY2hhbmdlcyBiZWluZyBmdWxseSBzdGFnZWQvdW5zdGFnZWQvc3Rhc2hlZC9kZWxldGVkL2V0Y1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRQYW5lcygpLmZpbHRlcihwYW5lID0+IHtcbiAgICAgIGNvbnN0IHBlbmRpbmdJdGVtID0gcGFuZS5nZXRQZW5kaW5nSXRlbSgpO1xuICAgICAgaWYgKCFwZW5kaW5nSXRlbSB8fCAhcGVuZGluZ0l0ZW0uZ2V0UmVhbEl0ZW0pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBjb25zdCByZWFsSXRlbSA9IHBlbmRpbmdJdGVtLmdldFJlYWxJdGVtKCk7XG4gICAgICBpZiAoIShyZWFsSXRlbSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gV2Ugb25seSB3YW50IHRvIHVwZGF0ZSBwZW5kaW5nIGRpZmYgdmlld3MgZm9yIGN1cnJlbnRseSBhY3RpdmUgcmVwb1xuICAgICAgY29uc3QgaXNJbkFjdGl2ZVJlcG8gPSByZWFsSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5KCkgPT09IHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGg7XG4gICAgICBjb25zdCBpc1N0YWxlID0gIXRoaXMuY2hhbmdlZEZpbGVFeGlzdHMocmVhbEl0ZW0uZ2V0RmlsZVBhdGgoKSwgcmVhbEl0ZW0uZ2V0U3RhZ2luZ1N0YXR1cygpKTtcbiAgICAgIHJldHVybiBpc0luQWN0aXZlUmVwbyAmJiBpc1N0YWxlO1xuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlZEZpbGVFeGlzdHMoZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZmluZEl0ZW0oKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIGtleSA9PT0gc3RhZ2luZ1N0YXR1cyAmJiBpdGVtLmZpbGVQYXRoID09PSBmaWxlUGF0aDtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNob3dGaWxlUGF0Y2hJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzLCB7YWN0aXZhdGUsIHBhbmV9ID0ge2FjdGl2YXRlOiBmYWxzZX0pIHtcbiAgICBjb25zdCB1cmkgPSBDaGFuZ2VkRmlsZUl0ZW0uYnVpbGRVUkkoZmlsZVBhdGgsIHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICAgIGNvbnN0IGNoYW5nZWRGaWxlSXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICB1cmksIHtwZW5kaW5nOiB0cnVlLCBhY3RpdmF0ZVBhbmU6IGFjdGl2YXRlLCBhY3RpdmF0ZUl0ZW06IGFjdGl2YXRlLCBwYW5lfSxcbiAgICApO1xuICAgIGlmIChhY3RpdmF0ZSkge1xuICAgICAgY29uc3QgaXRlbVJvb3QgPSBjaGFuZ2VkRmlsZUl0ZW0uZ2V0RWxlbWVudCgpO1xuICAgICAgY29uc3QgZm9jdXNSb290ID0gaXRlbVJvb3QucXVlcnlTZWxlY3RvcignW3RhYkluZGV4XScpO1xuICAgICAgaWYgKGZvY3VzUm9vdCkge1xuICAgICAgICBmb2N1c1Jvb3QuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2ltcGx5IG1ha2UgaXRlbSB2aXNpYmxlXG4gICAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5wYW5lRm9ySXRlbShjaGFuZ2VkRmlsZUl0ZW0pLmFjdGl2YXRlSXRlbShjaGFuZ2VkRmlsZUl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNob3dNZXJnZUNvbmZsaWN0RmlsZUZvclBhdGgocmVsYXRpdmVGaWxlUGF0aCwge2FjdGl2YXRlfSA9IHthY3RpdmF0ZTogZmFsc2V9KSB7XG4gICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeVBhdGgsIHJlbGF0aXZlRmlsZVBhdGgpO1xuICAgIGlmIChhd2FpdCB0aGlzLmZpbGVFeGlzdHMoYWJzb2x1dGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oYWJzb2x1dGVQYXRoLCB7YWN0aXZhdGVQYW5lOiBhY3RpdmF0ZSwgYWN0aXZhdGVJdGVtOiBhY3RpdmF0ZSwgcGVuZGluZzogdHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkSW5mbygnRmlsZSBoYXMgYmVlbiBkZWxldGVkLicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgZmlsZUV4aXN0cyhhYnNvbHV0ZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IEZpbGUoYWJzb2x1dGVQYXRoKS5leGlzdHMoKTtcbiAgfVxuXG4gIGRibGNsaWNrT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYXR0ZW1wdEZpbGVTdGFnZU9wZXJhdGlvbihbaXRlbS5maWxlUGF0aF0sIHRoaXMuc3RhdGUuc2VsZWN0aW9uLmxpc3RLZXlGb3JJdGVtKGl0ZW0pKTtcbiAgfVxuXG4gIGFzeW5jIGNvbnRleHRNZW51T25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbi5nZXRTZWxlY3RlZEl0ZW1zKCkuaGFzKGl0ZW0pKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgZXZlbnQuc2hpZnRLZXkpLFxuICAgICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbmV3RXZlbnQgPSBuZXcgTW91c2VFdmVudChldmVudC50eXBlLCBldmVudCk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpZiAoIWV2ZW50LnRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQobmV3RXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2Vkb3duT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgY29uc3Qgd2luZG93cyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgIXdpbmRvd3MpIHsgcmV0dXJuOyB9IC8vIHNpbXBseSBvcGVuIGNvbnRleHQgbWVudVxuICAgIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgICAgIHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGlmIChldmVudC5tZXRhS2V5IHx8IChldmVudC5jdHJsS2V5ICYmIHdpbmRvd3MpKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICAgIHNlbGVjdGlvbjogcHJldlN0YXRlLnNlbGVjdGlvbi5hZGRPclN1YnRyYWN0U2VsZWN0aW9uKGl0ZW0pLFxuICAgICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLnNlbGVjdEl0ZW0oaXRlbSwgZXZlbnQuc2hpZnRLZXkpLFxuICAgICAgICAgIH0pLCByZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2Vtb3ZlT25JdGVtKGV2ZW50LCBpdGVtKSB7XG4gICAgaWYgKHRoaXMubW91c2VTZWxlY3Rpb25JblByb2dyZXNzKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBzZWxlY3Rpb246IHByZXZTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0SXRlbShpdGVtLCB0cnVlKSxcbiAgICAgICAgfSksIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbW91c2V1cCgpIHtcbiAgICBjb25zdCBoYWRTZWxlY3Rpb25JblByb2dyZXNzID0gdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3M7XG4gICAgdGhpcy5tb3VzZVNlbGVjdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgc2VsZWN0aW9uOiBwcmV2U3RhdGUuc2VsZWN0aW9uLmNvYWxlc2NlKCksXG4gICAgICB9KSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gICAgaWYgKGhhZFNlbGVjdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlU2VsZWN0ZWRJdGVtcyh0cnVlKTtcbiAgICB9XG4gIH1cblxuICB1bmRvTGFzdERpc2NhcmQoe2V2ZW50U291cmNlfSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmhhc1VuZG9IaXN0b3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYWRkRXZlbnQoJ3VuZG8tbGFzdC1kaXNjYXJkJywge1xuICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICBjb21wb25lbnQ6ICdTdGFnaW5nVmlldycsXG4gICAgICBldmVudFNvdXJjZSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMudW5kb0xhc3REaXNjYXJkKCk7XG4gIH1cblxuICBnZXRGb2N1c0NsYXNzKGxpc3RLZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZ2V0QWN0aXZlTGlzdEtleSgpID09PSBsaXN0S2V5ID8gJ2lzLWZvY3VzZWQnIDogJyc7XG4gIH1cblxuICByZWdpc3Rlckl0ZW1FbGVtZW50KGl0ZW0sIGVsZW1lbnQpIHtcbiAgICB0aGlzLmxpc3RFbGVtZW50c0J5SXRlbS5zZXQoaXRlbSwgZWxlbWVudCk7XG4gIH1cblxuICBnZXRGb2N1cyhlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmNvbnRhaW5zKGVsZW1lbnQpKS5nZXRPcihmYWxzZSkgPyBTdGFnaW5nVmlldy5mb2N1cy5TVEFHSU5HIDogbnVsbDtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlNUQUdJTkcpIHtcbiAgICAgIHRoaXMucmVmUm9vdC5tYXAocm9vdCA9PiByb290LmZvY3VzKCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HKSB7XG4gICAgICBpZiAoYXdhaXQgdGhpcy5hY3RpdmF0ZU5leHRMaXN0KCkpIHtcbiAgICAgICAgLy8gVGhlcmUgd2FzIGEgbmV4dCBsaXN0IHRvIGFjdGl2YXRlLlxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5TVEFHSU5HO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSB3ZXJlIGFscmVhZHkgb24gdGhlIGxhc3QgbGlzdC5cbiAgICAgIHJldHVybiBDb21taXRWaWV3LmZpcnN0Rm9jdXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhc3luYyByZXRyZWF0Rm9jdXNGcm9tKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSBDb21taXRWaWV3LmZpcnN0Rm9jdXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGVMYXN0TGlzdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICB9XG5cbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORykge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZVByZXZpb3VzTGlzdCgpO1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9jdXMuU1RBR0lORztcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpLmdldE9yKGZhbHNlKTtcbiAgfVxuXG4gIGlzUG9wdWxhdGVkKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLndvcmtpbmdEaXJlY3RvcnlQYXRoICE9IG51bGwgJiYgKFxuICAgICAgcHJvcHMudW5zdGFnZWRDaGFuZ2VzLmxlbmd0aCA+IDAgfHxcbiAgICAgIHByb3BzLm1lcmdlQ29uZmxpY3RzLmxlbmd0aCA+IDAgfHxcbiAgICAgIHByb3BzLnN0YWdlZENoYW5nZXMubGVuZ3RoID4gMFxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsU0FBQSxHQUFBQyxPQUFBO0FBR0EsSUFBQUMsS0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsTUFBQSxHQUFBQyx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUksVUFBQSxHQUFBQyxzQkFBQSxDQUFBTCxPQUFBO0FBQ0EsSUFBQU0sS0FBQSxHQUFBRCxzQkFBQSxDQUFBTCxPQUFBO0FBRUEsSUFBQU8sV0FBQSxHQUFBUCxPQUFBO0FBQ0EsSUFBQVEsc0JBQUEsR0FBQUgsc0JBQUEsQ0FBQUwsT0FBQTtBQUNBLElBQUFTLGFBQUEsR0FBQUosc0JBQUEsQ0FBQUwsT0FBQTtBQUNBLElBQUFVLDBCQUFBLEdBQUFMLHNCQUFBLENBQUFMLE9BQUE7QUFDQSxJQUFBVyx1QkFBQSxHQUFBTixzQkFBQSxDQUFBTCxPQUFBO0FBQ0EsSUFBQVksbUJBQUEsR0FBQVAsc0JBQUEsQ0FBQUwsT0FBQTtBQUNBLElBQUFhLFdBQUEsR0FBQVIsc0JBQUEsQ0FBQUwsT0FBQTtBQUNBLElBQUFjLFVBQUEsR0FBQVQsc0JBQUEsQ0FBQUwsT0FBQTtBQUNBLElBQUFlLGdCQUFBLEdBQUFWLHNCQUFBLENBQUFMLE9BQUE7QUFDQSxJQUFBZ0IsU0FBQSxHQUFBYix1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQWlCLFFBQUEsR0FBQWpCLE9BQUE7QUFDQSxJQUFBa0IsY0FBQSxHQUFBbEIsT0FBQTtBQUEyQyxTQUFBSyx1QkFBQWMsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLEtBQUFFLE9BQUEsRUFBQUYsQ0FBQTtBQUFBLFNBQUFHLHlCQUFBSCxDQUFBLDZCQUFBSSxPQUFBLG1CQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFELHdC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