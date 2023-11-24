"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FOCUS = void 0;

var _path = _interopRequireDefault(require("path"));

var _eventKit = require("event-kit");

var _atom = require("atom");

var _eventLogger = _interopRequireDefault(require("./event-logger"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FOCUS = Symbol('focus');
exports.FOCUS = FOCUS;

class WorkspaceChangeObserver {
  constructor(window, workspace, repository) {
    (0, _helpers.autobind)(this, 'observeTextEditor');
    this.window = window;
    this.repository = repository;
    this.workspace = workspace;
    this.observedBuffers = new WeakSet();
    this.emitter = new _eventKit.Emitter();
    this.disposables = new _eventKit.CompositeDisposable();
    this.logger = new _eventLogger.default('workspace watcher');
    this.started = false;
  }

  async start() {
    const focusHandler = event => {
      if (this.repository) {
        this.logger.showFocusEvent();
        this.didChange([{
          special: FOCUS
        }]);
      }
    };

    this.window.addEventListener('focus', focusHandler);
    this.disposables.add(this.workspace.observeTextEditors(this.observeTextEditor), new _eventKit.Disposable(() => this.window.removeEventListener('focus', focusHandler)));
    await this.watchActiveRepositoryGitDirectory();
    this.started = true;
    return this;
  }

  async destroy() {
    this.started = false;
    this.observedBuffers = new WeakSet();
    this.emitter.dispose();
    this.disposables.dispose();
    await this.stopCurrentFileWatcher();
  }

  isStarted() {
    return this.started;
  }

  didChange(payload) {
    this.emitter.emit('did-change', payload);
  }

  didChangeWorkdirOrHead() {
    this.emitter.emit('did-change-workdir-or-head');
  }

  onDidChange(callback) {
    return this.emitter.on('did-change', callback);
  }

  onDidChangeWorkdirOrHead(callback) {
    return this.emitter.on('did-change-workdir-or-head', callback);
  }

  getRepository() {
    return this.repository;
  }

  async watchActiveRepositoryGitDirectory() {
    const repository = this.getRepository();
    const gitDirectoryPath = repository.getGitDirectoryPath();
    const basenamesOfInterest = ['config', 'index', 'HEAD', 'MERGE_HEAD'];
    const workdirOrHeadBasenames = ['config', 'index'];

    const eventPaths = event => {
      const ps = [event.path];

      if (event.oldPath) {
        ps.push(event.oldPath);
      }

      return ps;
    };

    const acceptEvent = event => {
      return eventPaths(event).some(eventPath => {
        return basenamesOfInterest.includes(_path.default.basename(eventPath)) || _path.default.dirname(eventPath).includes(_path.default.join('.git', 'refs'));
      });
    };

    const isWorkdirOrHeadEvent = event => {
      return eventPaths(event).some(eventPath => workdirOrHeadBasenames.includes(_path.default.basename(eventPath)));
    };

    this.currentFileWatcher = await (0, _atom.watchPath)(gitDirectoryPath, {}, events => {
      const filteredEvents = events.filter(acceptEvent);

      if (filteredEvents.length) {
        this.logger.showEvents(filteredEvents);
        this.didChange(filteredEvents);

        if (filteredEvents.some(isWorkdirOrHeadEvent)) {
          this.logger.showWorkdirOrHeadEvents();
          this.didChangeWorkdirOrHead();
        }
      }
    });
    this.currentFileWatcher.onDidError(error => {
      const workingDirectory = repository.getWorkingDirectoryPath(); // eslint-disable-next-line no-console

      console.warn(`Error in WorkspaceChangeObserver in ${workingDirectory}:`, error);
      this.stopCurrentFileWatcher();
    });
    this.logger.showStarted(gitDirectoryPath, 'workspace emulated');
  }

  stopCurrentFileWatcher() {
    if (this.currentFileWatcher) {
      this.currentFileWatcher.dispose();
      this.currentFileWatcher = null;
      this.logger.showStopped();
    }

    return Promise.resolve();
  }

  activeRepositoryContainsPath(filePath) {
    const repository = this.getRepository();

    if (filePath && repository) {
      return filePath.indexOf(repository.getWorkingDirectoryPath()) !== -1;
    } else {
      return false;
    }
  }

  observeTextEditor(editor) {
    const buffer = editor.getBuffer();

    if (!this.observedBuffers.has(buffer)) {
      let lastPath = buffer.getPath();

      const didChange = () => {
        const currentPath = buffer.getPath();
        const events = currentPath === lastPath ? [{
          action: 'modified',
          path: currentPath
        }] : [{
          action: 'renamed',
          path: currentPath,
          oldPath: lastPath
        }];
        lastPath = currentPath;
        this.logger.showEvents(events);
        this.didChange(events);
      };

      this.observedBuffers.add(buffer);
      const disposables = new _eventKit.CompositeDisposable(buffer.onDidSave(() => {
        if (this.activeRepositoryContainsPath(buffer.getPath())) {
          didChange();
        }
      }), buffer.onDidReload(() => {
        if (this.activeRepositoryContainsPath(buffer.getPath())) {
          didChange();
        }
      }), buffer.onDidDestroy(() => {
        if (this.activeRepositoryContainsPath(buffer.getPath())) {
          didChange();
        }

        disposables.dispose();
      }));
      this.disposables.add(disposables);
    }
  }

}

exports.default = WorkspaceChangeObserver;