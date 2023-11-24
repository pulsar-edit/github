"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

var _repository = _interopRequireDefault(require("./repository"));

var _resolutionProgress = _interopRequireDefault(require("./conflicts/resolution-progress"));

var _fileSystemChangeObserver = _interopRequireDefault(require("./file-system-change-observer"));

var _workspaceChangeObserver = _interopRequireDefault(require("./workspace-change-observer"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRepoSym = Symbol('createRepo');
let absentWorkdirContext;
/*
 * Bundle of model objects associated with a git working directory.
 *
 * Provides synchronous access to each model in the form of a getter method that returns the model or `null` if it
 * has not yet been initialized, and asynchronous access in the form of a Promise generation method that will resolve
 * once the model is available. Initializes the platform-appropriate change observer and proxies select filesystem
 * change events.
 */

class WorkdirContext {
  /*
   * Available options:
   * - `options.window`: Browser window global, used on Linux by the WorkspaceChangeObserver.
   * - `options.workspace`: Atom's workspace singleton, used on Linux by the WorkspaceChangeObserver.
   * - `options.promptCallback`: Callback used to collect information interactively through Atom.
   */
  constructor(directory, options = {}) {
    (0, _helpers.autobind)(this, 'repositoryChangedState');
    this.directory = directory;
    const {
      window: theWindow,
      workspace,
      promptCallback,
      pipelineManager
    } = options;

    this.repository = (options[createRepoSym] || (() => new _repository.default(directory, null, {
      pipelineManager
    })))();

    this.destroyed = false;
    this.emitter = new _eventKit.Emitter();
    this.subs = new _eventKit.CompositeDisposable();
    this.observer = this.useWorkspaceChangeObserver() ? new _workspaceChangeObserver.default(theWindow, workspace, this.repository) : new _fileSystemChangeObserver.default(this.repository);
    this.resolutionProgress = new _resolutionProgress.default();

    if (promptCallback) {
      this.repository.setPromptCallback(promptCallback);
    } // Wire up event forwarding among models


    this.subs.add(this.repository.onDidChangeState(this.repositoryChangedState));
    this.subs.add(this.observer.onDidChange(events => {
      this.repository.observeFilesystemChange(events);
    }));
    this.subs.add(this.observer.onDidChangeWorkdirOrHead(() => this.emitter.emit('did-change-workdir-or-head'))); // If a pre-loaded Repository was provided, broadcast an initial state change event.

    this.repositoryChangedState({
      from: null,
      to: this.repository.state
    });
  }

  static absent(options) {
    if (!absentWorkdirContext) {
      absentWorkdirContext = new AbsentWorkdirContext(options);
    }

    return absentWorkdirContext;
  }

  static destroyAbsent() {
    if (absentWorkdirContext) {
      absentWorkdirContext.destroy();
      absentWorkdirContext = null;
    }
  }

  static guess(options, pipelineManager) {
    const projectPathCount = options.projectPathCount || 0;
    const initPathCount = options.initPathCount || 0;
    const createRepo = projectPathCount === 1 || projectPathCount === 0 && initPathCount === 1 ? () => _repository.default.loadingGuess({
      pipelineManager
    }) : () => _repository.default.absentGuess({
      pipelineManager
    });
    return new WorkdirContext(null, {
      [createRepoSym]: createRepo
    });
  }
  /**
   * Respond to changes in `Repository` state. Load resolution progress and start the change observer when it becomes
   * present. Stop the change observer when it is destroyed. Re-broadcast the event to context subscribers
   * regardless.
   *
   * The ResolutionProgress will be loaded before the change event is re-broadcast, but change observer modifications
   * will not be complete.
   */


  repositoryChangedState(payload) {
    if (this.destroyed) {
      return;
    }

    if (this.repository.isPresent()) {
      this.observer.start().then(() => this.emitter.emit('did-start-observer'));
    } else if (this.repository.isDestroyed()) {
      this.emitter.emit('did-destroy-repository');
      this.observer.destroy();
    }

    this.emitter.emit('did-change-repository-state', payload);
  }

  isPresent() {
    return true;
  }

  isDestroyed() {
    return this.destroyed;
  }

  useWorkspaceChangeObserver() {
    return !!process.env.ATOM_GITHUB_WORKSPACE_OBSERVER || process.platform === 'linux';
  } // Event subscriptions


  onDidStartObserver(callback) {
    return this.emitter.on('did-start-observer', callback);
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
  /**
   * Return a Promise that will resolve the next time that a Repository transitions to the requested state. Most
   * useful for test cases; most callers should prefer subscribing to `onDidChangeRepositoryState`.
   */


  getRepositoryStatePromise(stateName) {
    return new Promise(resolve => {
      const sub = this.onDidChangeRepositoryState(() => {
        if (this.repository.isInState(stateName)) {
          resolve();
          sub.dispose();
        }
      });
    });
  }
  /**
   * Return a Promise that will resolve the next time that a ChangeObserver successfully starts. Most useful for
   * test cases.
   */


  getObserverStartedPromise() {
    return new Promise(resolve => {
      const sub = this.onDidStartObserver(() => {
        resolve();
        sub.dispose();
      });
    });
  }

  getWorkingDirectory() {
    return this.directory;
  }

  getRepository() {
    return this.repository;
  }

  getChangeObserver() {
    return this.observer;
  }

  getResolutionProgress() {
    return this.resolutionProgress;
  }
  /*
   * Cleanly destroy any models that need to be cleaned, including stopping the filesystem watcher.
   */


  async destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.subs.dispose();
    this.repository.destroy();
    this.emitter.dispose();
    await this.observer.destroy();
  }

}

exports.default = WorkdirContext;

class AbsentWorkdirContext extends WorkdirContext {
  constructor(options) {
    super(null, {
      [createRepoSym]: () => _repository.default.absent(options)
    });
  }

  isPresent() {
    return false;
  }

}