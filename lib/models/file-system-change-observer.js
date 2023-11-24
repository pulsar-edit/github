"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

var _atom = require("atom");

var _path = _interopRequireDefault(require("path"));

var _eventLogger = _interopRequireDefault(require("./event-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FileSystemChangeObserver {
  constructor(repository) {
    this.emitter = new _eventKit.Emitter();
    this.repository = repository;
    this.logger = new _eventLogger.default('fs watcher');
    this.started = false;
  }

  async start() {
    await this.watchRepository();
    this.started = true;
    return this;
  }

  async destroy() {
    this.started = false;
    this.emitter.dispose();
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

  async watchRepository() {
    const allPaths = event => {
      const ps = [event.path];

      if (event.oldPath) {
        ps.push(event.oldPath);
      }

      return ps;
    };

    const isNonGitFile = event => allPaths(event).some(eventPath => !eventPath.split(_path.default.sep).includes('.git'));

    const isWatchedGitFile = event => allPaths(event).some(eventPath => {
      return ['config', 'index', 'HEAD', 'MERGE_HEAD'].includes(_path.default.basename(eventPath)) || _path.default.dirname(eventPath).includes(_path.default.join('.git', 'refs'));
    });

    const handleEvents = events => {
      const filteredEvents = events.filter(e => isNonGitFile(e) || isWatchedGitFile(e));

      if (filteredEvents.length) {
        this.logger.showEvents(filteredEvents);
        this.didChange(filteredEvents);
        const workdirOrHeadEvent = filteredEvents.find(event => {
          return allPaths(event).every(eventPath => !['config', 'index'].includes(_path.default.basename(eventPath)));
        });

        if (workdirOrHeadEvent) {
          this.logger.showWorkdirOrHeadEvents();
          this.didChangeWorkdirOrHead();
        }
      }
    };

    this.currentFileWatcher = await (0, _atom.watchPath)(this.repository.getWorkingDirectoryPath(), {}, handleEvents);
    this.logger.showStarted(this.repository.getWorkingDirectoryPath(), 'Atom watchPath');
  }

  stopCurrentFileWatcher() {
    if (this.currentFileWatcher) {
      this.currentFileWatcher.dispose();
      this.logger.showStopped();
    }

    return Promise.resolve();
  }

}

exports.default = FileSystemChangeObserver;