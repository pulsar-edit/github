"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _compareSets = _interopRequireDefault(require("compare-sets"));
var _eventKit = require("event-kit");
var _workdirContext = _interopRequireDefault(require("./workdir-context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Manage a WorkdirContext for each open directory.
 */
class WorkdirContextPool {
  /**
   * Options will be passed to each `WorkdirContext` as it is created.
   */
  constructor(options = {}) {
    this.options = options;
    this.contexts = new Map();
    this.emitter = new _eventKit.Emitter();
  }
  size() {
    return this.contexts.size;
  }

  /**
   * Access the context mapped to a known directory.
   */
  getContext(directory) {
    const {
      pipelineManager
    } = this.options;
    return this.contexts.get(directory) || _workdirContext.default.absent({
      pipelineManager
    });
  }

  /**
   * Return a WorkdirContext whose Repository has at least one remote configured to push to the named GitHub repository.
   * Returns a null context if zero or more than one contexts match.
   */
  async getMatchingContext(host, owner, repo) {
    const matches = await Promise.all(this.withResidentContexts(async (_workdir, context) => {
      const match = await context.getRepository().hasGitHubRemote(host, owner, repo);
      return match ? context : null;
    }));
    const filtered = matches.filter(Boolean);
    return filtered.length === 1 ? filtered[0] : _workdirContext.default.absent(_objectSpread({}, this.options));
  }
  add(directory, options = {}, silenceEmitter = false) {
    if (this.contexts.has(directory)) {
      return this.getContext(directory);
    }
    const context = new _workdirContext.default(directory, _objectSpread({}, this.options, {}, options));
    this.contexts.set(directory, context);
    const disposable = context.subs;
    const forwardEvent = (subMethod, emitEventName) => {
      const emit = () => this.emitter.emit(emitEventName, context);
      disposable.add(context[subMethod](emit));
    };
    forwardEvent('onDidStartObserver', 'did-start-observer');
    forwardEvent('onDidChangeWorkdirOrHead', 'did-change-workdir-or-head');
    forwardEvent('onDidChangeRepositoryState', 'did-change-repository-state');
    forwardEvent('onDidUpdateRepository', 'did-update-repository');
    forwardEvent('onDidDestroyRepository', 'did-destroy-repository');

    // Propagate global cache invalidations across all resident contexts
    disposable.add(context.getRepository().onDidGloballyInvalidate(spec => {
      this.withResidentContexts((_workdir, eachContext) => {
        if (eachContext !== context) {
          eachContext.getRepository().acceptInvalidation(spec);
        }
      });
    }));
    if (!silenceEmitter) {
      this.emitter.emit('did-change-contexts', {
        added: new Set([directory])
      });
    }
    return context;
  }
  replace(directory, options = {}, silenceEmitter = false) {
    this.remove(directory, true);
    this.add(directory, options, true);
    if (!silenceEmitter) {
      this.emitter.emit('did-change-contexts', {
        altered: new Set([directory])
      });
    }
  }
  remove(directory, silenceEmitter = false) {
    const existing = this.contexts.get(directory);
    this.contexts.delete(directory);
    if (existing) {
      existing.destroy();
      if (!silenceEmitter) {
        this.emitter.emit('did-change-contexts', {
          removed: new Set([directory])
        });
      }
    }
  }
  set(directories, options = {}) {
    const previous = new Set(this.contexts.keys());
    const {
      added,
      removed
    } = (0, _compareSets.default)(previous, directories);
    for (const directory of added) {
      this.add(directory, options, true);
    }
    for (const directory of removed) {
      this.remove(directory, true);
    }
    if (added.size !== 0 || removed.size !== 0) {
      this.emitter.emit('did-change-contexts', {
        added,
        removed
      });
    }
  }
  getCurrentWorkDirs() {
    return this.contexts.keys();
  }
  withResidentContexts(callback) {
    const results = [];
    for (const [workdir, context] of this.contexts) {
      results.push(callback(workdir, context));
    }
    return results;
  }
  onDidStartObserver(callback) {
    return this.emitter.on('did-start-observer', callback);
  }
  onDidChangePoolContexts(callback) {
    return this.emitter.on('did-change-contexts', callback);
  }
  onDidChangeWorkdirOrHead(callback) {
    return this.emitter.on('did-change-workdir-or-head', callback);
  }
  onDidChangeRepositoryState(callback) {
    return this.emitter.on('did-change-repository-state', callback);
  }
  onDidUpdateRepository(callback) {
    return this.emitter.on('did-update-repository', callback);
  }
  onDidDestroyRepository(callback) {
    return this.emitter.on('did-destroy-repository', callback);
  }
  clear() {
    const workdirs = new Set();
    this.withResidentContexts(workdir => {
      this.remove(workdir, true);
      workdirs.add(workdir);
    });
    _workdirContext.default.destroyAbsent();
    if (workdirs.size !== 0) {
      this.emitter.emit('did-change-contexts', {
        removed: workdirs
      });
    }
  }
}
exports.default = WorkdirContextPool;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXb3JrZGlyQ29udGV4dFBvb2wiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJjb250ZXh0cyIsIk1hcCIsImVtaXR0ZXIiLCJFbWl0dGVyIiwic2l6ZSIsImdldENvbnRleHQiLCJkaXJlY3RvcnkiLCJwaXBlbGluZU1hbmFnZXIiLCJnZXQiLCJXb3JrZGlyQ29udGV4dCIsImFic2VudCIsImdldE1hdGNoaW5nQ29udGV4dCIsImhvc3QiLCJvd25lciIsInJlcG8iLCJtYXRjaGVzIiwiUHJvbWlzZSIsImFsbCIsIndpdGhSZXNpZGVudENvbnRleHRzIiwiX3dvcmtkaXIiLCJjb250ZXh0IiwibWF0Y2giLCJnZXRSZXBvc2l0b3J5IiwiaGFzR2l0SHViUmVtb3RlIiwiZmlsdGVyZWQiLCJmaWx0ZXIiLCJCb29sZWFuIiwibGVuZ3RoIiwiYWRkIiwic2lsZW5jZUVtaXR0ZXIiLCJoYXMiLCJzZXQiLCJkaXNwb3NhYmxlIiwic3VicyIsImZvcndhcmRFdmVudCIsInN1Yk1ldGhvZCIsImVtaXRFdmVudE5hbWUiLCJlbWl0Iiwib25EaWRHbG9iYWxseUludmFsaWRhdGUiLCJzcGVjIiwiZWFjaENvbnRleHQiLCJhY2NlcHRJbnZhbGlkYXRpb24iLCJhZGRlZCIsIlNldCIsInJlcGxhY2UiLCJyZW1vdmUiLCJhbHRlcmVkIiwiZXhpc3RpbmciLCJkZWxldGUiLCJkZXN0cm95IiwicmVtb3ZlZCIsImRpcmVjdG9yaWVzIiwicHJldmlvdXMiLCJrZXlzIiwiY29tcGFyZVNldHMiLCJnZXRDdXJyZW50V29ya0RpcnMiLCJjYWxsYmFjayIsInJlc3VsdHMiLCJ3b3JrZGlyIiwicHVzaCIsIm9uRGlkU3RhcnRPYnNlcnZlciIsIm9uIiwib25EaWRDaGFuZ2VQb29sQ29udGV4dHMiLCJvbkRpZENoYW5nZVdvcmtkaXJPckhlYWQiLCJvbkRpZENoYW5nZVJlcG9zaXRvcnlTdGF0ZSIsIm9uRGlkVXBkYXRlUmVwb3NpdG9yeSIsIm9uRGlkRGVzdHJveVJlcG9zaXRvcnkiLCJjbGVhciIsIndvcmtkaXJzIiwiZGVzdHJveUFic2VudCJdLCJzb3VyY2VzIjpbIndvcmtkaXItY29udGV4dC1wb29sLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb21wYXJlU2V0cyBmcm9tICdjb21wYXJlLXNldHMnO1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgV29ya2RpckNvbnRleHQgZnJvbSAnLi93b3JrZGlyLWNvbnRleHQnO1xuXG4vKipcbiAqIE1hbmFnZSBhIFdvcmtkaXJDb250ZXh0IGZvciBlYWNoIG9wZW4gZGlyZWN0b3J5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZGlyQ29udGV4dFBvb2wge1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIHdpbGwgYmUgcGFzc2VkIHRvIGVhY2ggYFdvcmtkaXJDb250ZXh0YCBhcyBpdCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuY29udGV4dHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dHMuc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2Nlc3MgdGhlIGNvbnRleHQgbWFwcGVkIHRvIGEga25vd24gZGlyZWN0b3J5LlxuICAgKi9cbiAgZ2V0Q29udGV4dChkaXJlY3RvcnkpIHtcbiAgICBjb25zdCB7cGlwZWxpbmVNYW5hZ2VyfSA9IHRoaXMub3B0aW9ucztcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0cy5nZXQoZGlyZWN0b3J5KSB8fCBXb3JrZGlyQ29udGV4dC5hYnNlbnQoe3BpcGVsaW5lTWFuYWdlcn0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIFdvcmtkaXJDb250ZXh0IHdob3NlIFJlcG9zaXRvcnkgaGFzIGF0IGxlYXN0IG9uZSByZW1vdGUgY29uZmlndXJlZCB0byBwdXNoIHRvIHRoZSBuYW1lZCBHaXRIdWIgcmVwb3NpdG9yeS5cbiAgICogUmV0dXJucyBhIG51bGwgY29udGV4dCBpZiB6ZXJvIG9yIG1vcmUgdGhhbiBvbmUgY29udGV4dHMgbWF0Y2guXG4gICAqL1xuICBhc3luYyBnZXRNYXRjaGluZ0NvbnRleHQoaG9zdCwgb3duZXIsIHJlcG8pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLndpdGhSZXNpZGVudENvbnRleHRzKGFzeW5jIChfd29ya2RpciwgY29udGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGF3YWl0IGNvbnRleHQuZ2V0UmVwb3NpdG9yeSgpLmhhc0dpdEh1YlJlbW90ZShob3N0LCBvd25lciwgcmVwbyk7XG4gICAgICAgIHJldHVybiBtYXRjaCA/IGNvbnRleHQgOiBudWxsO1xuICAgICAgfSksXG4gICAgKTtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IG1hdGNoZXMuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIGZpbHRlcmVkLmxlbmd0aCA9PT0gMSA/IGZpbHRlcmVkWzBdIDogV29ya2RpckNvbnRleHQuYWJzZW50KHsuLi50aGlzLm9wdGlvbnN9KTtcbiAgfVxuXG4gIGFkZChkaXJlY3RvcnksIG9wdGlvbnMgPSB7fSwgc2lsZW5jZUVtaXR0ZXIgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmNvbnRleHRzLmhhcyhkaXJlY3RvcnkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250ZXh0KGRpcmVjdG9yeSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBXb3JrZGlyQ29udGV4dChkaXJlY3RvcnksIHsuLi50aGlzLm9wdGlvbnMsIC4uLm9wdGlvbnN9KTtcbiAgICB0aGlzLmNvbnRleHRzLnNldChkaXJlY3RvcnksIGNvbnRleHQpO1xuXG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IGNvbnRleHQuc3VicztcblxuICAgIGNvbnN0IGZvcndhcmRFdmVudCA9IChzdWJNZXRob2QsIGVtaXRFdmVudE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGVtaXQgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdChlbWl0RXZlbnROYW1lLCBjb250ZXh0KTtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKGNvbnRleHRbc3ViTWV0aG9kXShlbWl0KSk7XG4gICAgfTtcblxuICAgIGZvcndhcmRFdmVudCgnb25EaWRTdGFydE9ic2VydmVyJywgJ2RpZC1zdGFydC1vYnNlcnZlcicpO1xuICAgIGZvcndhcmRFdmVudCgnb25EaWRDaGFuZ2VXb3JrZGlyT3JIZWFkJywgJ2RpZC1jaGFuZ2Utd29ya2Rpci1vci1oZWFkJyk7XG4gICAgZm9yd2FyZEV2ZW50KCdvbkRpZENoYW5nZVJlcG9zaXRvcnlTdGF0ZScsICdkaWQtY2hhbmdlLXJlcG9zaXRvcnktc3RhdGUnKTtcbiAgICBmb3J3YXJkRXZlbnQoJ29uRGlkVXBkYXRlUmVwb3NpdG9yeScsICdkaWQtdXBkYXRlLXJlcG9zaXRvcnknKTtcbiAgICBmb3J3YXJkRXZlbnQoJ29uRGlkRGVzdHJveVJlcG9zaXRvcnknLCAnZGlkLWRlc3Ryb3ktcmVwb3NpdG9yeScpO1xuXG4gICAgLy8gUHJvcGFnYXRlIGdsb2JhbCBjYWNoZSBpbnZhbGlkYXRpb25zIGFjcm9zcyBhbGwgcmVzaWRlbnQgY29udGV4dHNcbiAgICBkaXNwb3NhYmxlLmFkZChjb250ZXh0LmdldFJlcG9zaXRvcnkoKS5vbkRpZEdsb2JhbGx5SW52YWxpZGF0ZShzcGVjID0+IHtcbiAgICAgIHRoaXMud2l0aFJlc2lkZW50Q29udGV4dHMoKF93b3JrZGlyLCBlYWNoQ29udGV4dCkgPT4ge1xuICAgICAgICBpZiAoZWFjaENvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAgICAgICBlYWNoQ29udGV4dC5nZXRSZXBvc2l0b3J5KCkuYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICBpZiAoIXNpbGVuY2VFbWl0dGVyKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb250ZXh0cycsIHthZGRlZDogbmV3IFNldChbZGlyZWN0b3J5XSl9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIHJlcGxhY2UoZGlyZWN0b3J5LCBvcHRpb25zID0ge30sIHNpbGVuY2VFbWl0dGVyID0gZmFsc2UpIHtcbiAgICB0aGlzLnJlbW92ZShkaXJlY3RvcnksIHRydWUpO1xuICAgIHRoaXMuYWRkKGRpcmVjdG9yeSwgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICBpZiAoIXNpbGVuY2VFbWl0dGVyKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb250ZXh0cycsIHthbHRlcmVkOiBuZXcgU2V0KFtkaXJlY3RvcnldKX0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShkaXJlY3RvcnksIHNpbGVuY2VFbWl0dGVyID0gZmFsc2UpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuY29udGV4dHMuZ2V0KGRpcmVjdG9yeSk7XG4gICAgdGhpcy5jb250ZXh0cy5kZWxldGUoZGlyZWN0b3J5KTtcblxuICAgIGlmIChleGlzdGluZykge1xuICAgICAgZXhpc3RpbmcuZGVzdHJveSgpO1xuXG4gICAgICBpZiAoIXNpbGVuY2VFbWl0dGVyKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbnRleHRzJywge3JlbW92ZWQ6IG5ldyBTZXQoW2RpcmVjdG9yeV0pfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0KGRpcmVjdG9yaWVzLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBwcmV2aW91cyA9IG5ldyBTZXQodGhpcy5jb250ZXh0cy5rZXlzKCkpO1xuICAgIGNvbnN0IHthZGRlZCwgcmVtb3ZlZH0gPSBjb21wYXJlU2V0cyhwcmV2aW91cywgZGlyZWN0b3JpZXMpO1xuXG4gICAgZm9yIChjb25zdCBkaXJlY3Rvcnkgb2YgYWRkZWQpIHtcbiAgICAgIHRoaXMuYWRkKGRpcmVjdG9yeSwgb3B0aW9ucywgdHJ1ZSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZGlyZWN0b3J5IG9mIHJlbW92ZWQpIHtcbiAgICAgIHRoaXMucmVtb3ZlKGRpcmVjdG9yeSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGFkZGVkLnNpemUgIT09IDAgfHwgcmVtb3ZlZC5zaXplICE9PSAwKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb250ZXh0cycsIHthZGRlZCwgcmVtb3ZlZH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEN1cnJlbnRXb3JrRGlycygpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0cy5rZXlzKCk7XG4gIH1cblxuICB3aXRoUmVzaWRlbnRDb250ZXh0cyhjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFt3b3JrZGlyLCBjb250ZXh0XSBvZiB0aGlzLmNvbnRleHRzKSB7XG4gICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2sod29ya2RpciwgY29udGV4dCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIG9uRGlkU3RhcnRPYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zdGFydC1vYnNlcnZlcicsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlUG9vbENvbnRleHRzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1jb250ZXh0cycsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlV29ya2Rpck9ySGVhZChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utd29ya2Rpci1vci1oZWFkJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VSZXBvc2l0b3J5U3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXJlcG9zaXRvcnktc3RhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZFVwZGF0ZVJlcG9zaXRvcnkoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLXJlcG9zaXRvcnknLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZERlc3Ryb3lSZXBvc2l0b3J5KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3ktcmVwb3NpdG9yeScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGNvbnN0IHdvcmtkaXJzID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy53aXRoUmVzaWRlbnRDb250ZXh0cyh3b3JrZGlyID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlKHdvcmtkaXIsIHRydWUpO1xuICAgICAgd29ya2RpcnMuYWRkKHdvcmtkaXIpO1xuICAgIH0pO1xuXG4gICAgV29ya2RpckNvbnRleHQuZGVzdHJveUFic2VudCgpO1xuXG4gICAgaWYgKHdvcmtkaXJzLnNpemUgIT09IDApIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbnRleHRzJywge3JlbW92ZWQ6IHdvcmtkaXJzfSk7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUErQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFL0M7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsa0JBQWtCLENBQUM7RUFFdEM7QUFDRjtBQUNBO0VBQ0VDLFdBQVcsQ0FBQ0MsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3hCLElBQUksQ0FBQ0EsT0FBTyxHQUFHQSxPQUFPO0lBRXRCLElBQUksQ0FBQ0MsUUFBUSxHQUFHLElBQUlDLEdBQUcsRUFB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