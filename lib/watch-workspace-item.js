"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchWorkspaceItem = watchWorkspaceItem;
var _atom = require("atom");
var _uriPattern = _interopRequireDefault(require("./atom/uri-pattern"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ItemWatcher {
  constructor(workspace, pattern, component, stateKey) {
    _defineProperty(this, "updateActiveState", () => {
      const wasActive = this.activeItem;
      this.activeItem = this.isActiveItem();
      // Update the component's state if it's changed as a result
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJdGVtV2F0Y2hlciIsImNvbnN0cnVjdG9yIiwid29ya3NwYWNlIiwicGF0dGVybiIsImNvbXBvbmVudCIsInN0YXRlS2V5Iiwid2FzQWN0aXZlIiwiYWN0aXZlSXRlbSIsImlzQWN0aXZlSXRlbSIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJpdGVtIiwiZ2V0VVJJIiwibWF0Y2hlcyIsIm9rIiwiVVJJUGF0dGVybiIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwicGFuZSIsImdldFBhbmVzIiwiaXRlbU1hdGNoZXMiLCJnZXRBY3RpdmVJdGVtIiwic2V0SW5pdGlhbFN0YXRlIiwic3RhdGUiLCJzdWJzY3JpYmVUb1dvcmtzcGFjZSIsImRpc3Bvc2UiLCJnZXRDZW50ZXIiLCJvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIiwidXBkYXRlQWN0aXZlU3RhdGUiLCJzZXRQYXR0ZXJuIiwid2F0Y2hXb3Jrc3BhY2VJdGVtIl0sInNvdXJjZXMiOlsid2F0Y2gtd29ya3NwYWNlLWl0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IFVSSVBhdHRlcm4gZnJvbSAnLi9hdG9tL3VyaS1wYXR0ZXJuJztcblxuY2xhc3MgSXRlbVdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3b3Jrc3BhY2UsIHBhdHRlcm4sIGNvbXBvbmVudCwgc3RhdGVLZXkpIHtcbiAgICB0aGlzLndvcmtzcGFjZSA9IHdvcmtzcGFjZTtcbiAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuIGluc3RhbmNlb2YgVVJJUGF0dGVybiA/IHBhdHRlcm4gOiBuZXcgVVJJUGF0dGVybihwYXR0ZXJuKTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgICB0aGlzLnN0YXRlS2V5ID0gc3RhdGVLZXk7XG5cbiAgICB0aGlzLmFjdGl2ZUl0ZW0gPSB0aGlzLmlzQWN0aXZlSXRlbSgpO1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBpc0FjdGl2ZUl0ZW0oKSB7XG4gICAgZm9yIChjb25zdCBwYW5lIG9mIHRoaXMud29ya3NwYWNlLmdldFBhbmVzKCkpIHtcbiAgICAgIGlmICh0aGlzLml0ZW1NYXRjaGVzKHBhbmUuZ2V0QWN0aXZlSXRlbSgpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIGlmICghdGhpcy5jb21wb25lbnQuc3RhdGUpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50LnN0YXRlID0ge307XG4gICAgfVxuICAgIHRoaXMuY29tcG9uZW50LnN0YXRlW3RoaXMuc3RhdGVLZXldID0gdGhpcy5hY3RpdmVJdGVtO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3Vic2NyaWJlVG9Xb3Jrc3BhY2UoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMud29ya3NwYWNlLmdldENlbnRlcigpLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0odGhpcy51cGRhdGVBY3RpdmVTdGF0ZSksXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZUFjdGl2ZVN0YXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHdhc0FjdGl2ZSA9IHRoaXMuYWN0aXZlSXRlbTtcblxuICAgIHRoaXMuYWN0aXZlSXRlbSA9IHRoaXMuaXNBY3RpdmVJdGVtKCk7XG4gICAgLy8gVXBkYXRlIHRoZSBjb21wb25lbnQncyBzdGF0ZSBpZiBpdCdzIGNoYW5nZWQgYXMgYSByZXN1bHRcbiAgICBpZiAod2FzQWN0aXZlICYmICF0aGlzLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuY29tcG9uZW50LnNldFN0YXRlKHtbdGhpcy5zdGF0ZUtleV06IGZhbHNlfSwgcmVzb2x2ZSkpO1xuICAgIH0gZWxzZSBpZiAoIXdhc0FjdGl2ZSAmJiB0aGlzLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuY29tcG9uZW50LnNldFN0YXRlKHtbdGhpcy5zdGF0ZUtleV06IHRydWV9LCByZXNvbHZlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH1cblxuICBzZXRQYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuIGluc3RhbmNlb2YgVVJJUGF0dGVybiA/IHBhdHRlcm4gOiBuZXcgVVJJUGF0dGVybihwYXR0ZXJuKTtcblxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUFjdGl2ZVN0YXRlKCk7XG4gIH1cblxuICBpdGVtTWF0Y2hlcyA9IGl0ZW0gPT4gaXRlbSAmJiBpdGVtLmdldFVSSSAmJiB0aGlzLnBhdHRlcm4ubWF0Y2hlcyhpdGVtLmdldFVSSSgpKS5vaygpXG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YXRjaFdvcmtzcGFjZUl0ZW0od29ya3NwYWNlLCBwYXR0ZXJuLCBjb21wb25lbnQsIHN0YXRlS2V5KSB7XG4gIHJldHVybiBuZXcgSXRlbVdhdGNoZXIod29ya3NwYWNlLCBwYXR0ZXJuLCBjb21wb25lbnQsIHN0YXRlS2V5KVxuICAgIC5zZXRJbml0aWFsU3RhdGUoKVxuICAgIC5zdWJzY3JpYmVUb1dvcmtzcGFjZSgpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBO0FBQTRDO0FBQUE7QUFBQTtBQUFBO0FBRTVDLE1BQU1BLFdBQVcsQ0FBQztFQUNoQkMsV0FBVyxDQUFDQyxTQUFTLEVBQUVDLE9BQU8sRUFBRUMsU0FBUyxFQUFFQyxRQUFR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