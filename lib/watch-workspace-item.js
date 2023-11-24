"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchWorkspaceItem = watchWorkspaceItem;

var _atom = require("atom");

var _uriPattern = _interopRequireDefault(require("./atom/uri-pattern"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ItemWatcher {
  constructor(workspace, pattern, component, stateKey) {
    _defineProperty(this, "updateActiveState", () => {
      const wasActive = this.activeItem;
      this.activeItem = this.isActiveItem(); // Update the component's state if it's changed as a result

      if (wasActive && !this.activeItem) {
        return new Promise(resolve => this.component.setState({
          [this.stateKey]: false
        }, resolve));
      } else if (!wasActive && this.activeItem) {
        return new Promise(resolve => this.component.setState({
          [this.stateKey]: true
        }, resolve));
      } else {
        return Promise.resolve();
      }
    });

    _defineProperty(this, "itemMatches", item => item && item.getURI && this.pattern.matches(item.getURI()).ok());

    this.workspace = workspace;
    this.pattern = pattern instanceof _uriPattern.default ? pattern : new _uriPattern.default(pattern);
    this.component = component;
    this.stateKey = stateKey;
    this.activeItem = this.isActiveItem();
    this.subs = new _atom.CompositeDisposable();
  }

  isActiveItem() {
    for (const pane of this.workspace.getPanes()) {
      if (this.itemMatches(pane.getActiveItem())) {
        return true;
      }
    }

    return false;
  }

  setInitialState() {
    if (!this.component.state) {
      this.component.state = {};
    }

    this.component.state[this.stateKey] = this.activeItem;
    return this;
  }

  subscribeToWorkspace() {
    this.subs.dispose();
    this.subs = new _atom.CompositeDisposable(this.workspace.getCenter().onDidChangeActivePaneItem(this.updateActiveState));
    return this;
  }

  setPattern(pattern) {
    this.pattern = pattern instanceof _uriPattern.default ? pattern : new _uriPattern.default(pattern);
    return this.updateActiveState();
  }

  dispose() {
    this.subs.dispose();
  }

}

function watchWorkspaceItem(workspace, pattern, component, stateKey) {
  return new ItemWatcher(workspace, pattern, component, stateKey).setInitialState().subscribeToWorkspace();
}