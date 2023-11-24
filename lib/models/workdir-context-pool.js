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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    forwardEvent('onDidDestroyRepository', 'did-destroy-repository'); // Propagate global cache invalidations across all resident contexts

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