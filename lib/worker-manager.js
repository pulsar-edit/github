"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Operation = exports.RendererProcess = exports.Worker = exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _querystring = _interopRequireDefault(require("querystring"));
var _electron = require("electron");
var _eventKit = require("event-kit");
var _helpers = require("./helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const {
  BrowserWindow
} = _electron.remote;
class WorkerManager {
  static getInstance() {
    if (!this.instance) {
      this.instance = new WorkerManager();
    }
    return this.instance;
  }
  static reset(force) {
    if (this.instance) {
      this.instance.destroy(force);
    }
    this.instance = null;
  }
  constructor() {
    (0, _helpers.autobind)(this, 'onDestroyed', 'onCrashed', 'onSick');
    this.workers = new Set();
    this.activeWorker = null;
    this.createNewWorker();
  }
  isReady() {
    return this.activeWorker.isReady();
  }
  request(data) {
    if (this.destroyed) {
      throw new Error('Worker is destroyed');
    }
    let operation;
    const requestPromise = new Promise((resolve, reject) => {
      operation = new Operation(data, resolve, reject);
      return this.activeWorker.executeOperation(operation);
    });
    operation.setPromise(requestPromise);
    return {
      cancel: () => this.activeWorker.cancelOperation(operation),
      promise: requestPromise
    };
  }
  createNewWorker({
    operationCountLimit
  } = {
    operationCountLimit: 10
  }) {
    if (this.destroyed) {
      return;
    }
    this.activeWorker = new Worker({
      operationCountLimit,
      onDestroyed: this.onDestroyed,
      onCrashed: this.onCrashed,
      onSick: this.onSick
    });
    this.workers.add(this.activeWorker);
  }
  onDestroyed(destroyedWorker) {
    this.workers.delete(destroyedWorker);
  }
  onCrashed(crashedWorker) {
    if (crashedWorker === this.getActiveWorker()) {
      this.createNewWorker({
        operationCountLimit: crashedWorker.getOperationCountLimit()
      });
    }
    crashedWorker.getRemainingOperations().forEach(operation => this.activeWorker.executeOperation(operation));
  }
  onSick(sickWorker) {
    if (!atom.inSpecMode()) {
      // eslint-disable-next-line no-console
      console.warn(`Sick worker detected.
        operationCountLimit: ${sickWorker.getOperationCountLimit()},
        completed operation count: ${sickWorker.getCompletedOperationCount()}`);
    }
    const operationCountLimit = this.calculateNewOperationCountLimit(sickWorker);
    return this.createNewWorker({
      operationCountLimit
    });
  }
  calculateNewOperationCountLimit(lastWorker) {
    let operationCountLimit = 10;
    if (lastWorker.getOperationCountLimit() >= lastWorker.getCompletedOperationCount()) {
      operationCountLimit = Math.min(lastWorker.getOperationCountLimit() * 2, 100);
    }
    return operationCountLimit;
  }
  getActiveWorker() {
    return this.activeWorker;
  }
  getReadyPromise() {
    return this.activeWorker.getReadyPromise();
  }
  destroy(force) {
    this.destroyed = true;
    this.workers.forEach(worker => worker.destroy(force));
  }
}
exports.default = WorkerManager;
_defineProperty(WorkerManager, "instance", null);
class Worker {
  constructor({
    operationCountLimit,
    onSick,
    onCrashed,
    onDestroyed
  }) {
    (0, _helpers.autobind)(this, 'handleDataReceived', 'onOperationComplete', 'handleCancelled', 'handleExecStarted', 'handleSpawnError', 'handleStdinError', 'handleSick', 'handleCrashed');
    this.operationCountLimit = operationCountLimit;
    this.onSick = onSick;
    this.onCrashed = onCrashed;
    this.onDestroyed = onDestroyed;
    this.operationsById = new Map();
    this.completedOperationCount = 0;
    this.sick = false;
    this.rendererProcess = new RendererProcess({
      loadUrl: this.getLoadUrl(operationCountLimit),
      onData: this.handleDataReceived,
      onCancelled: this.handleCancelled,
      onExecStarted: this.handleExecStarted,
      onSpawnError: this.handleSpawnError,
      onStdinError: this.handleStdinError,
      onSick: this.handleSick,
      onCrashed: this.handleCrashed,
      onDestroyed: this.destroy
    });
  }
  isReady() {
    return this.rendererProcess.isReady();
  }
  getLoadUrl(operationCountLimit) {
    const htmlPath = _path.default.join((0, _helpers.getPackageRoot)(), 'lib', 'renderer.html');
    const rendererJsPath = _path.default.join((0, _helpers.getPackageRoot)(), 'lib', 'worker.js');
    const qs = _querystring.default.stringify({
      js: rendererJsPath,
      managerWebContentsId: this.getWebContentsId(),
      operationCountLimit,
      channelName: Worker.channelName
    });
    return `file://${htmlPath}?${qs}`;
  }
  getWebContentsId() {
    return _electron.remote.getCurrentWebContents().id;
  }
  executeOperation(operation) {
    this.operationsById.set(operation.id, operation);
    operation.onComplete(this.onOperationComplete);
    return this.rendererProcess.executeOperation(operation);
  }
  cancelOperation(operation) {
    return this.rendererProcess.cancelOperation(operation);
  }
  handleDataReceived({
    id,
    results
  }) {
    const operation = this.operationsById.get(id);
    operation.complete(results, data => {
      const {
        timing
      } = data;
      const totalInternalTime = timing.execTime + timing.spawnTime;
      const ipcTime = operation.getExecutionTime() - totalInternalTime;
      data.timing.ipcTime = ipcTime;
      return data;
    });
  }
  onOperationComplete(operation) {
    this.completedOperationCount++;
    this.operationsById.delete(operation.id);
    if (this.sick && this.operationsById.size === 0) {
      this.destroy();
    }
  }
  handleCancelled({
    id
  }) {
    const operation = this.operationsById.get(id);
    if (operation) {
      // handleDataReceived() can be received before handleCancelled()
      operation.wasCancelled();
    }
  }
  handleExecStarted({
    id
  }) {
    const operation = this.operationsById.get(id);
    operation.setInProgress();
  }
  handleSpawnError({
    id,
    err
  }) {
    const operation = this.operationsById.get(id);
    operation.error(err);
  }
  handleStdinError({
    id,
    stdin,
    err
  }) {
    const operation = this.operationsById.get(id);
    operation.error(err);
  }
  handleSick() {
    this.sick = true;
    this.onSick(this);
  }
  handleCrashed() {
    this.onCrashed(this);
    this.destroy();
  }
  getOperationCountLimit() {
    return this.operationCountLimit;
  }
  getCompletedOperationCount() {
    return this.completedOperationCount;
  }
  getRemainingOperations() {
    return Array.from(this.operationsById.values());
  }
  getPid() {
    return this.rendererProcess.getPid();
  }
  getReadyPromise() {
    return this.rendererProcess.getReadyPromise();
  }
  async destroy(force) {
    this.onDestroyed(this);
    if (this.operationsById.size > 0 && !force) {
      const remainingOperationPromises = this.getRemainingOperations().map(operation => operation.getPromise().catch(() => null));
      await Promise.all(remainingOperationPromises);
    }
    this.rendererProcess.destroy();
  }
}

/*
Sends operations to renderer processes
*/
exports.Worker = Worker;
_defineProperty(Worker, "channelName", 'github:renderer-ipc');
class RendererProcess {
  constructor({
    loadUrl,
    onDestroyed,
    onCrashed,
    onSick,
    onData,
    onCancelled,
    onSpawnError,
    onStdinError,
    onExecStarted
  }) {
    (0, _helpers.autobind)(this, 'handleDestroy');
    this.onDestroyed = onDestroyed;
    this.onCrashed = onCrashed;
    this.onSick = onSick;
    this.onData = onData;
    this.onCancelled = onCancelled;
    this.onSpawnError = onSpawnError;
    this.onStdinError = onStdinError;
    this.onExecStarted = onExecStarted;
    this.win = new BrowserWindow({
      show: !!process.env.ATOM_GITHUB_SHOW_RENDERER_WINDOW,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
      }
    });
    this.webContents = this.win.webContents;
    // this.webContents.openDevTools();

    this.emitter = new _eventKit.Emitter();
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.registerListeners();
    this.win.loadURL(loadUrl);
    this.win.webContents.on('crashed', this.handleDestroy);
    this.win.webContents.on('destroyed', this.handleDestroy);
    this.subscriptions.add(new _eventKit.Disposable(() => {
      if (!this.win.isDestroyed()) {
        this.win.webContents.removeListener('crashed', this.handleDestroy);
        this.win.webContents.removeListener('destroyed', this.handleDestroy);
        this.win.destroy();
      }
    }), this.emitter);
    this.ready = false;
    this.readyPromise = new Promise(resolve => {
      this.resolveReady = resolve;
    });
  }
  isReady() {
    return this.ready;
  }
  handleDestroy(...args) {
    this.destroy();
    this.onCrashed(...args);
  }
  registerListeners() {
    const handleMessages = (event, {
      sourceWebContentsId,
      type,
      data
    }) => {
      if (sourceWebContentsId === this.win.webContents.id) {
        this.emitter.emit(type, data);
      }
    };
    _electron.ipcRenderer.on(Worker.channelName, handleMessages);
    this.emitter.on('renderer-ready', ({
      pid
    }) => {
      this.pid = pid;
      this.ready = true;
      this.resolveReady();
    });
    this.emitter.on('git-data', this.onData);
    this.emitter.on('git-cancelled', this.onCancelled);
    this.emitter.on('git-spawn-error', this.onSpawnError);
    this.emitter.on('git-stdin-error', this.onStdinError);
    this.emitter.on('slow-spawns', this.onSick);

    // not currently used to avoid clogging up ipc channel
    // keeping it around as it's potentially useful for avoiding duplicate write operations upon renderer crashing
    this.emitter.on('exec-started', this.onExecStarted);
    this.subscriptions.add(new _eventKit.Disposable(() => _electron.ipcRenderer.removeListener(Worker.channelName, handleMessages)));
  }
  executeOperation(operation) {
    return operation.execute(payload => {
      if (this.destroyed) {
        return null;
      }
      return this.webContents.send(Worker.channelName, {
        type: 'git-exec',
        data: payload
      });
    });
  }
  cancelOperation(operation) {
    return operation.cancel(payload => {
      if (this.destroyed) {
        return null;
      }
      return this.webContents.send(Worker.channelName, {
        type: 'git-cancel',
        data: payload
      });
    });
  }
  getPid() {
    return this.pid;
  }
  getReadyPromise() {
    return this.readyPromise;
  }
  destroy() {
    this.destroyed = true;
    this.subscriptions.dispose();
  }
}
exports.RendererProcess = RendererProcess;
class Operation {
  constructor(data, resolve, reject) {
    this.id = Operation.id++;
    this.data = data;
    this.resolve = resolve;
    this.reject = reject;
    this.promise = null;
    this.cancellationResolve = () => {};
    this.startTime = null;
    this.endTime = null;
    this.status = Operation.status.PENDING;
    this.results = null;
    this.emitter = new _eventKit.Emitter();
  }
  onComplete(cb) {
    return this.emitter.on('complete', cb);
  }
  setPromise(promise) {
    this.promise = promise;
  }
  getPromise() {
    return this.promise;
  }
  setInProgress() {
    // after exec has been called but before results a received
    this.status = Operation.status.INPROGRESS;
  }
  getExecutionTime() {
    if (!this.startTime || !this.endTime) {
      return NaN;
    } else {
      return this.endTime - this.startTime;
    }
  }
  complete(results, mutate = data => data) {
    this.endTime = performance.now();
    this.results = results;
    this.resolve(mutate(results));
    this.cancellationResolve();
    this.status = Operation.status.COMPLETE;
    this.emitter.emit('complete', this);
    this.emitter.dispose();
  }
  wasCancelled() {
    this.status = Operation.status.CANCELLED;
    this.cancellationResolve();
  }
  error(results) {
    this.endTime = performance.now();
    const err = new Error(results.message, results.fileName, results.lineNumber);
    err.stack = results.stack;
    this.reject(err);
  }
  execute(execFn) {
    this.startTime = performance.now();
    return execFn(_objectSpread({}, this.data, {
      id: this.id
    }));
  }
  cancel(execFn) {
    return new Promise(resolve => {
      this.status = Operation.status.CANCELLING;
      this.cancellationResolve = resolve;
      execFn({
        id: this.id
      });
    });
  }
}
exports.Operation = Operation;
_defineProperty(Operation, "status", {
  PENDING: Symbol('pending'),
  INPROGRESS: Symbol('in-progress'),
  COMPLETE: Symbol('complete'),
  CANCELLING: Symbol('cancelling'),
  CANCELLED: Symbol('canceled')
});
_defineProperty(Operation, "id", 0);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCcm93c2VyV2luZG93IiwicmVtb3RlIiwiV29ya2VyTWFuYWdlciIsImdldEluc3RhbmNlIiwiaW5zdGFuY2UiLCJyZXNldCIsImZvcmNlIiwiZGVzdHJveSIsImNvbnN0cnVjdG9yIiwiYXV0b2JpbmQiLCJ3b3JrZXJzIiwiU2V0IiwiYWN0aXZlV29ya2VyIiwiY3JlYXRlTmV3V29ya2VyIiwiaXNSZWFkeSIsInJlcXVlc3QiLCJkYXRhIiwiZGVzdHJveWVkIiwiRXJyb3IiLCJvcGVyYXRpb24iLCJyZXF1ZXN0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiT3BlcmF0aW9uIiwiZXhlY3V0ZU9wZXJhdGlvbiIsInNldFByb21pc2UiLCJjYW5jZWwiLCJjYW5jZWxPcGVyYXRpb24iLCJwcm9taXNlIiwib3BlcmF0aW9uQ291bnRMaW1pdCIsIldvcmtlciIsIm9uRGVzdHJveWVkIiwib25DcmFzaGVkIiwib25TaWNrIiwiYWRkIiwiZGVzdHJveWVkV29ya2VyIiwiZGVsZXRlIiwiY3Jhc2hlZFdvcmtlciIsImdldEFjdGl2ZVdvcmtlciIsImdldE9wZXJhdGlvbkNvdW50TGltaXQiLCJnZXRSZW1haW5pbmdPcGVyYXRpb25zIiwiZm9yRWFjaCIsInNpY2tXb3JrZXIiLCJhdG9tIiwiaW5TcGVjTW9kZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQiLCJjYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0IiwibGFzdFdvcmtlciIsIk1hdGgiLCJtaW4iLCJnZXRSZWFkeVByb21pc2UiLCJ3b3JrZXIiLCJvcGVyYXRpb25zQnlJZCIsIk1hcCIsImNvbXBsZXRlZE9wZXJhdGlvbkNvdW50Iiwic2ljayIsInJlbmRlcmVyUHJvY2VzcyIsIlJlbmRlcmVyUHJvY2VzcyIsImxvYWRVcmwiLCJnZXRMb2FkVXJsIiwib25EYXRhIiwiaGFuZGxlRGF0YVJlY2VpdmVkIiwib25DYW5jZWxsZWQiLCJoYW5kbGVDYW5jZWxsZWQiLCJvbkV4ZWNTdGFydGVkIiwiaGFuZGxlRXhlY1N0YXJ0ZWQiLCJvblNwYXduRXJyb3IiLCJoYW5kbGVTcGF3bkVycm9yIiwib25TdGRpbkVycm9yIiwiaGFuZGxlU3RkaW5FcnJvciIsImhhbmRsZVNpY2siLCJoYW5kbGVDcmFzaGVkIiwiaHRtbFBhdGgiLCJwYXRoIiwiam9pbiIsImdldFBhY2thZ2VSb290IiwicmVuZGVyZXJKc1BhdGgiLCJxcyIsInF1ZXJ5c3RyaW5nIiwic3RyaW5naWZ5IiwianMiLCJtYW5hZ2VyV2ViQ29udGVudHNJZCIsImdldFdlYkNvbnRlbnRzSWQiLCJjaGFubmVsTmFtZSIsImdldEN1cnJlbnRXZWJDb250ZW50cyIsImlkIiwic2V0Iiwib25Db21wbGV0ZSIsIm9uT3BlcmF0aW9uQ29tcGxldGUiLCJyZXN1bHRzIiwiZ2V0IiwiY29tcGxldGUiLCJ0aW1pbmciLCJ0b3RhbEludGVybmFsVGltZSIsImV4ZWNUaW1lIiwic3Bhd25UaW1lIiwiaXBjVGltZSIsImdldEV4ZWN1dGlvblRpbWUiLCJzaXplIiwid2FzQ2FuY2VsbGVkIiwic2V0SW5Qcm9ncmVzcyIsImVyciIsImVycm9yIiwic3RkaW4iLCJBcnJheSIsImZyb20iLCJ2YWx1ZXMiLCJnZXRQaWQiLCJyZW1haW5pbmdPcGVyYXRpb25Qcm9taXNlcyIsIm1hcCIsImdldFByb21pc2UiLCJjYXRjaCIsImFsbCIsIndpbiIsInNob3ciLCJwcm9jZXNzIiwiZW52IiwiQVRPTV9HSVRIVUJfU0hPV19SRU5ERVJFUl9XSU5ET1ciLCJ3ZWJQcmVmZXJlbmNlcyIsIm5vZGVJbnRlZ3JhdGlvbiIsImVuYWJsZVJlbW90ZU1vZHVsZSIsIndlYkNvbnRlbnRzIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsInJlZ2lzdGVyTGlzdGVuZXJzIiwibG9hZFVSTCIsIm9uIiwiaGFuZGxlRGVzdHJveSIsIkRpc3Bvc2FibGUiLCJpc0Rlc3Ryb3llZCIsInJlbW92ZUxpc3RlbmVyIiwicmVhZHkiLCJyZWFkeVByb21pc2UiLCJyZXNvbHZlUmVhZHkiLCJhcmdzIiwiaGFuZGxlTWVzc2FnZXMiLCJldmVudCIsInNvdXJjZVdlYkNvbnRlbnRzSWQiLCJ0eXBlIiwiZW1pdCIsImlwYyIsInBpZCIsImV4ZWN1dGUiLCJwYXlsb2FkIiwic2VuZCIsImRpc3Bvc2UiLCJjYW5jZWxsYXRpb25SZXNvbHZlIiwic3RhcnRUaW1lIiwiZW5kVGltZSIsInN0YXR1cyIsIlBFTkRJTkciLCJjYiIsIklOUFJPR1JFU1MiLCJOYU4iLCJtdXRhdGUiLCJwZXJmb3JtYW5jZSIsIm5vdyIsIkNPTVBMRVRFIiwiQ0FOQ0VMTEVEIiwibWVzc2FnZSIsImZpbGVOYW1lIiwibGluZU51bWJlciIsInN0YWNrIiwiZXhlY0ZuIiwiQ0FOQ0VMTElORyIsIlN5bWJvbCJdLCJzb3VyY2VzIjpbIndvcmtlci1tYW5hZ2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuaW1wb3J0IHtyZW1vdGUsIGlwY1JlbmRlcmVyIGFzIGlwY30gZnJvbSAnZWxlY3Ryb24nO1xuY29uc3Qge0Jyb3dzZXJXaW5kb3d9ID0gcmVtb3RlO1xuaW1wb3J0IHtFbWl0dGVyLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2dldFBhY2thZ2VSb290LCBhdXRvYmluZH0gZnJvbSAnLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ya2VyTWFuYWdlciB7XG4gIHN0YXRpYyBpbnN0YW5jZSA9IG51bGw7XG5cbiAgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBXb3JrZXJNYW5hZ2VyKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICB9XG5cbiAgc3RhdGljIHJlc2V0KGZvcmNlKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UpIHsgdGhpcy5pbnN0YW5jZS5kZXN0cm95KGZvcmNlKTsgfVxuICAgIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgYXV0b2JpbmQodGhpcywgJ29uRGVzdHJveWVkJywgJ29uQ3Jhc2hlZCcsICdvblNpY2snKTtcblxuICAgIHRoaXMud29ya2VycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmFjdGl2ZVdvcmtlciA9IG51bGw7XG4gICAgdGhpcy5jcmVhdGVOZXdXb3JrZXIoKTtcbiAgfVxuXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29ya2VyLmlzUmVhZHkoKTtcbiAgfVxuXG4gIHJlcXVlc3QoZGF0YSkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1dvcmtlciBpcyBkZXN0cm95ZWQnKTsgfVxuICAgIGxldCBvcGVyYXRpb247XG4gICAgY29uc3QgcmVxdWVzdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBvcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9uKGRhdGEsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXIuZXhlY3V0ZU9wZXJhdGlvbihvcGVyYXRpb24pO1xuICAgIH0pO1xuICAgIG9wZXJhdGlvbi5zZXRQcm9taXNlKHJlcXVlc3RQcm9taXNlKTtcbiAgICByZXR1cm4ge1xuICAgICAgY2FuY2VsOiAoKSA9PiB0aGlzLmFjdGl2ZVdvcmtlci5jYW5jZWxPcGVyYXRpb24ob3BlcmF0aW9uKSxcbiAgICAgIHByb21pc2U6IHJlcXVlc3RQcm9taXNlLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVOZXdXb3JrZXIoe29wZXJhdGlvbkNvdW50TGltaXR9ID0ge29wZXJhdGlvbkNvdW50TGltaXQ6IDEwfSkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLmFjdGl2ZVdvcmtlciA9IG5ldyBXb3JrZXIoe1xuICAgICAgb3BlcmF0aW9uQ291bnRMaW1pdCxcbiAgICAgIG9uRGVzdHJveWVkOiB0aGlzLm9uRGVzdHJveWVkLFxuICAgICAgb25DcmFzaGVkOiB0aGlzLm9uQ3Jhc2hlZCxcbiAgICAgIG9uU2ljazogdGhpcy5vblNpY2ssXG4gICAgfSk7XG4gICAgdGhpcy53b3JrZXJzLmFkZCh0aGlzLmFjdGl2ZVdvcmtlcik7XG4gIH1cblxuICBvbkRlc3Ryb3llZChkZXN0cm95ZWRXb3JrZXIpIHtcbiAgICB0aGlzLndvcmtlcnMuZGVsZXRlKGRlc3Ryb3llZFdvcmtlcik7XG4gIH1cblxuICBvbkNyYXNoZWQoY3Jhc2hlZFdvcmtlcikge1xuICAgIGlmIChjcmFzaGVkV29ya2VyID09PSB0aGlzLmdldEFjdGl2ZVdvcmtlcigpKSB7XG4gICAgICB0aGlzLmNyZWF0ZU5ld1dvcmtlcih7b3BlcmF0aW9uQ291bnRMaW1pdDogY3Jhc2hlZFdvcmtlci5nZXRPcGVyYXRpb25Db3VudExpbWl0KCl9KTtcbiAgICB9XG4gICAgY3Jhc2hlZFdvcmtlci5nZXRSZW1haW5pbmdPcGVyYXRpb25zKCkuZm9yRWFjaChvcGVyYXRpb24gPT4gdGhpcy5hY3RpdmVXb3JrZXIuZXhlY3V0ZU9wZXJhdGlvbihvcGVyYXRpb24pKTtcbiAgfVxuXG4gIG9uU2ljayhzaWNrV29ya2VyKSB7XG4gICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihgU2ljayB3b3JrZXIgZGV0ZWN0ZWQuXG4gICAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQ6ICR7c2lja1dvcmtlci5nZXRPcGVyYXRpb25Db3VudExpbWl0KCl9LFxuICAgICAgICBjb21wbGV0ZWQgb3BlcmF0aW9uIGNvdW50OiAke3NpY2tXb3JrZXIuZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQoKX1gKTtcbiAgICB9XG4gICAgY29uc3Qgb3BlcmF0aW9uQ291bnRMaW1pdCA9IHRoaXMuY2FsY3VsYXRlTmV3T3BlcmF0aW9uQ291bnRMaW1pdChzaWNrV29ya2VyKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVOZXdXb3JrZXIoe29wZXJhdGlvbkNvdW50TGltaXR9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZU5ld09wZXJhdGlvbkNvdW50TGltaXQobGFzdFdvcmtlcikge1xuICAgIGxldCBvcGVyYXRpb25Db3VudExpbWl0ID0gMTA7XG4gICAgaWYgKGxhc3RXb3JrZXIuZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpID49IGxhc3RXb3JrZXIuZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQoKSkge1xuICAgICAgb3BlcmF0aW9uQ291bnRMaW1pdCA9IE1hdGgubWluKGxhc3RXb3JrZXIuZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpICogMiwgMTAwKTtcbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGlvbkNvdW50TGltaXQ7XG4gIH1cblxuICBnZXRBY3RpdmVXb3JrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29ya2VyO1xuICB9XG5cbiAgZ2V0UmVhZHlQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlci5nZXRSZWFkeVByb21pc2UoKTtcbiAgfVxuXG4gIGRlc3Ryb3koZm9yY2UpIHtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy53b3JrZXJzLmZvckVhY2god29ya2VyID0+IHdvcmtlci5kZXN0cm95KGZvcmNlKSk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgV29ya2VyIHtcbiAgc3RhdGljIGNoYW5uZWxOYW1lID0gJ2dpdGh1YjpyZW5kZXJlci1pcGMnO1xuXG4gIGNvbnN0cnVjdG9yKHtvcGVyYXRpb25Db3VudExpbWl0LCBvblNpY2ssIG9uQ3Jhc2hlZCwgb25EZXN0cm95ZWR9KSB7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2hhbmRsZURhdGFSZWNlaXZlZCcsICdvbk9wZXJhdGlvbkNvbXBsZXRlJywgJ2hhbmRsZUNhbmNlbGxlZCcsICdoYW5kbGVFeGVjU3RhcnRlZCcsICdoYW5kbGVTcGF3bkVycm9yJyxcbiAgICAgICdoYW5kbGVTdGRpbkVycm9yJywgJ2hhbmRsZVNpY2snLCAnaGFuZGxlQ3Jhc2hlZCcsXG4gICAgKTtcblxuICAgIHRoaXMub3BlcmF0aW9uQ291bnRMaW1pdCA9IG9wZXJhdGlvbkNvdW50TGltaXQ7XG4gICAgdGhpcy5vblNpY2sgPSBvblNpY2s7XG4gICAgdGhpcy5vbkNyYXNoZWQgPSBvbkNyYXNoZWQ7XG4gICAgdGhpcy5vbkRlc3Ryb3llZCA9IG9uRGVzdHJveWVkO1xuXG4gICAgdGhpcy5vcGVyYXRpb25zQnlJZCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmNvbXBsZXRlZE9wZXJhdGlvbkNvdW50ID0gMDtcbiAgICB0aGlzLnNpY2sgPSBmYWxzZTtcblxuICAgIHRoaXMucmVuZGVyZXJQcm9jZXNzID0gbmV3IFJlbmRlcmVyUHJvY2Vzcyh7XG4gICAgICBsb2FkVXJsOiB0aGlzLmdldExvYWRVcmwob3BlcmF0aW9uQ291bnRMaW1pdCksXG4gICAgICBvbkRhdGE6IHRoaXMuaGFuZGxlRGF0YVJlY2VpdmVkLFxuICAgICAgb25DYW5jZWxsZWQ6IHRoaXMuaGFuZGxlQ2FuY2VsbGVkLFxuICAgICAgb25FeGVjU3RhcnRlZDogdGhpcy5oYW5kbGVFeGVjU3RhcnRlZCxcbiAgICAgIG9uU3Bhd25FcnJvcjogdGhpcy5oYW5kbGVTcGF3bkVycm9yLFxuICAgICAgb25TdGRpbkVycm9yOiB0aGlzLmhhbmRsZVN0ZGluRXJyb3IsXG4gICAgICBvblNpY2s6IHRoaXMuaGFuZGxlU2ljayxcbiAgICAgIG9uQ3Jhc2hlZDogdGhpcy5oYW5kbGVDcmFzaGVkLFxuICAgICAgb25EZXN0cm95ZWQ6IHRoaXMuZGVzdHJveSxcbiAgICB9KTtcbiAgfVxuXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmlzUmVhZHkoKTtcbiAgfVxuXG4gIGdldExvYWRVcmwob3BlcmF0aW9uQ291bnRMaW1pdCkge1xuICAgIGNvbnN0IGh0bWxQYXRoID0gcGF0aC5qb2luKGdldFBhY2thZ2VSb290KCksICdsaWInLCAncmVuZGVyZXIuaHRtbCcpO1xuICAgIGNvbnN0IHJlbmRlcmVySnNQYXRoID0gcGF0aC5qb2luKGdldFBhY2thZ2VSb290KCksICdsaWInLCAnd29ya2VyLmpzJyk7XG4gICAgY29uc3QgcXMgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkoe1xuICAgICAganM6IHJlbmRlcmVySnNQYXRoLFxuICAgICAgbWFuYWdlcldlYkNvbnRlbnRzSWQ6IHRoaXMuZ2V0V2ViQ29udGVudHNJZCgpLFxuICAgICAgb3BlcmF0aW9uQ291bnRMaW1pdCxcbiAgICAgIGNoYW5uZWxOYW1lOiBXb3JrZXIuY2hhbm5lbE5hbWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIGBmaWxlOi8vJHtodG1sUGF0aH0/JHtxc31gO1xuICB9XG5cbiAgZ2V0V2ViQ29udGVudHNJZCgpIHtcbiAgICByZXR1cm4gcmVtb3RlLmdldEN1cnJlbnRXZWJDb250ZW50cygpLmlkO1xuICB9XG5cbiAgZXhlY3V0ZU9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICB0aGlzLm9wZXJhdGlvbnNCeUlkLnNldChvcGVyYXRpb24uaWQsIG9wZXJhdGlvbik7XG4gICAgb3BlcmF0aW9uLm9uQ29tcGxldGUodGhpcy5vbk9wZXJhdGlvbkNvbXBsZXRlKTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuZXhlY3V0ZU9wZXJhdGlvbihvcGVyYXRpb24pO1xuICB9XG5cbiAgY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5jYW5jZWxPcGVyYXRpb24ob3BlcmF0aW9uKTtcbiAgfVxuXG4gIGhhbmRsZURhdGFSZWNlaXZlZCh7aWQsIHJlc3VsdHN9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5jb21wbGV0ZShyZXN1bHRzLCBkYXRhID0+IHtcbiAgICAgIGNvbnN0IHt0aW1pbmd9ID0gZGF0YTtcbiAgICAgIGNvbnN0IHRvdGFsSW50ZXJuYWxUaW1lID0gdGltaW5nLmV4ZWNUaW1lICsgdGltaW5nLnNwYXduVGltZTtcbiAgICAgIGNvbnN0IGlwY1RpbWUgPSBvcGVyYXRpb24uZ2V0RXhlY3V0aW9uVGltZSgpIC0gdG90YWxJbnRlcm5hbFRpbWU7XG4gICAgICBkYXRhLnRpbWluZy5pcGNUaW1lID0gaXBjVGltZTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pO1xuICB9XG5cbiAgb25PcGVyYXRpb25Db21wbGV0ZShvcGVyYXRpb24pIHtcbiAgICB0aGlzLmNvbXBsZXRlZE9wZXJhdGlvbkNvdW50Kys7XG4gICAgdGhpcy5vcGVyYXRpb25zQnlJZC5kZWxldGUob3BlcmF0aW9uLmlkKTtcblxuICAgIGlmICh0aGlzLnNpY2sgJiYgdGhpcy5vcGVyYXRpb25zQnlJZC5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDYW5jZWxsZWQoe2lkfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBpZiAob3BlcmF0aW9uKSB7XG4gICAgICAvLyBoYW5kbGVEYXRhUmVjZWl2ZWQoKSBjYW4gYmUgcmVjZWl2ZWQgYmVmb3JlIGhhbmRsZUNhbmNlbGxlZCgpXG4gICAgICBvcGVyYXRpb24ud2FzQ2FuY2VsbGVkKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRXhlY1N0YXJ0ZWQoe2lkfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uc2V0SW5Qcm9ncmVzcygpO1xuICB9XG5cbiAgaGFuZGxlU3Bhd25FcnJvcih7aWQsIGVycn0pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgb3BlcmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBoYW5kbGVTdGRpbkVycm9yKHtpZCwgc3RkaW4sIGVycn0pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgb3BlcmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBoYW5kbGVTaWNrKCkge1xuICAgIHRoaXMuc2ljayA9IHRydWU7XG4gICAgdGhpcy5vblNpY2sodGhpcyk7XG4gIH1cblxuICBoYW5kbGVDcmFzaGVkKCkge1xuICAgIHRoaXMub25DcmFzaGVkKHRoaXMpO1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVyYXRpb25Db3VudExpbWl0O1xuICB9XG5cbiAgZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGxldGVkT3BlcmF0aW9uQ291bnQ7XG4gIH1cblxuICBnZXRSZW1haW5pbmdPcGVyYXRpb25zKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMub3BlcmF0aW9uc0J5SWQudmFsdWVzKCkpO1xuICB9XG5cbiAgZ2V0UGlkKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5nZXRQaWQoKTtcbiAgfVxuXG4gIGdldFJlYWR5UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuZ2V0UmVhZHlQcm9taXNlKCk7XG4gIH1cblxuICBhc3luYyBkZXN0cm95KGZvcmNlKSB7XG4gICAgdGhpcy5vbkRlc3Ryb3llZCh0aGlzKTtcbiAgICBpZiAodGhpcy5vcGVyYXRpb25zQnlJZC5zaXplID4gMCAmJiAhZm9yY2UpIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZ09wZXJhdGlvblByb21pc2VzID0gdGhpcy5nZXRSZW1haW5pbmdPcGVyYXRpb25zKClcbiAgICAgICAgLm1hcChvcGVyYXRpb24gPT4gb3BlcmF0aW9uLmdldFByb21pc2UoKS5jYXRjaCgoKSA9PiBudWxsKSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChyZW1haW5pbmdPcGVyYXRpb25Qcm9taXNlcyk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXJQcm9jZXNzLmRlc3Ryb3koKTtcbiAgfVxufVxuXG5cbi8qXG5TZW5kcyBvcGVyYXRpb25zIHRvIHJlbmRlcmVyIHByb2Nlc3Nlc1xuKi9cbmV4cG9ydCBjbGFzcyBSZW5kZXJlclByb2Nlc3Mge1xuICBjb25zdHJ1Y3Rvcih7bG9hZFVybCxcbiAgICBvbkRlc3Ryb3llZCwgb25DcmFzaGVkLCBvblNpY2ssIG9uRGF0YSwgb25DYW5jZWxsZWQsIG9uU3Bhd25FcnJvciwgb25TdGRpbkVycm9yLCBvbkV4ZWNTdGFydGVkfSkge1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVEZXN0cm95Jyk7XG4gICAgdGhpcy5vbkRlc3Ryb3llZCA9IG9uRGVzdHJveWVkO1xuICAgIHRoaXMub25DcmFzaGVkID0gb25DcmFzaGVkO1xuICAgIHRoaXMub25TaWNrID0gb25TaWNrO1xuICAgIHRoaXMub25EYXRhID0gb25EYXRhO1xuICAgIHRoaXMub25DYW5jZWxsZWQgPSBvbkNhbmNlbGxlZDtcbiAgICB0aGlzLm9uU3Bhd25FcnJvciA9IG9uU3Bhd25FcnJvcjtcbiAgICB0aGlzLm9uU3RkaW5FcnJvciA9IG9uU3RkaW5FcnJvcjtcbiAgICB0aGlzLm9uRXhlY1N0YXJ0ZWQgPSBvbkV4ZWNTdGFydGVkO1xuXG4gICAgdGhpcy53aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7c2hvdzogISFwcm9jZXNzLmVudi5BVE9NX0dJVEhVQl9TSE9XX1JFTkRFUkVSX1dJTkRPVyxcbiAgICAgIHdlYlByZWZlcmVuY2VzOiB7bm9kZUludGVncmF0aW9uOiB0cnVlLCBlbmFibGVSZW1vdGVNb2R1bGU6IHRydWV9fSk7XG4gICAgdGhpcy53ZWJDb250ZW50cyA9IHRoaXMud2luLndlYkNvbnRlbnRzO1xuICAgIC8vIHRoaXMud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuXG4gICAgdGhpcy53aW4ubG9hZFVSTChsb2FkVXJsKTtcbiAgICB0aGlzLndpbi53ZWJDb250ZW50cy5vbignY3Jhc2hlZCcsIHRoaXMuaGFuZGxlRGVzdHJveSk7XG4gICAgdGhpcy53aW4ud2ViQ29udGVudHMub24oJ2Rlc3Ryb3llZCcsIHRoaXMuaGFuZGxlRGVzdHJveSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLndpbi5pc0Rlc3Ryb3llZCgpKSB7XG4gICAgICAgICAgdGhpcy53aW4ud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2NyYXNoZWQnLCB0aGlzLmhhbmRsZURlc3Ryb3kpO1xuICAgICAgICAgIHRoaXMud2luLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdkZXN0cm95ZWQnLCB0aGlzLmhhbmRsZURlc3Ryb3kpO1xuICAgICAgICAgIHRoaXMud2luLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmVtaXR0ZXIsXG4gICAgKTtcblxuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLnJlYWR5UHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4geyB0aGlzLnJlc29sdmVSZWFkeSA9IHJlc29sdmU7IH0pO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeTtcbiAgfVxuXG4gIGhhbmRsZURlc3Ryb3koLi4uYXJncykge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMub25DcmFzaGVkKC4uLmFyZ3MpO1xuICB9XG5cbiAgcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgaGFuZGxlTWVzc2FnZXMgPSAoZXZlbnQsIHtzb3VyY2VXZWJDb250ZW50c0lkLCB0eXBlLCBkYXRhfSkgPT4ge1xuICAgICAgaWYgKHNvdXJjZVdlYkNvbnRlbnRzSWQgPT09IHRoaXMud2luLndlYkNvbnRlbnRzLmlkKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KHR5cGUsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpcGMub24oV29ya2VyLmNoYW5uZWxOYW1lLCBoYW5kbGVNZXNzYWdlcyk7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdyZW5kZXJlci1yZWFkeScsICh7cGlkfSkgPT4ge1xuICAgICAgdGhpcy5waWQgPSBwaWQ7XG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVzb2x2ZVJlYWR5KCk7XG4gICAgfSk7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtZGF0YScsIHRoaXMub25EYXRhKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2dpdC1jYW5jZWxsZWQnLCB0aGlzLm9uQ2FuY2VsbGVkKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2dpdC1zcGF3bi1lcnJvcicsIHRoaXMub25TcGF3bkVycm9yKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2dpdC1zdGRpbi1lcnJvcicsIHRoaXMub25TdGRpbkVycm9yKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3Nsb3ctc3Bhd25zJywgdGhpcy5vblNpY2spO1xuXG4gICAgLy8gbm90IGN1cnJlbnRseSB1c2VkIHRvIGF2b2lkIGNsb2dnaW5nIHVwIGlwYyBjaGFubmVsXG4gICAgLy8ga2VlcGluZyBpdCBhcm91bmQgYXMgaXQncyBwb3RlbnRpYWxseSB1c2VmdWwgZm9yIGF2b2lkaW5nIGR1cGxpY2F0ZSB3cml0ZSBvcGVyYXRpb25zIHVwb24gcmVuZGVyZXIgY3Jhc2hpbmdcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2V4ZWMtc3RhcnRlZCcsIHRoaXMub25FeGVjU3RhcnRlZCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgbmV3IERpc3Bvc2FibGUoKCkgPT4gaXBjLnJlbW92ZUxpc3RlbmVyKFdvcmtlci5jaGFubmVsTmFtZSwgaGFuZGxlTWVzc2FnZXMpKSxcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZU9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gb3BlcmF0aW9uLmV4ZWN1dGUocGF5bG9hZCA9PiB7XG4gICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIHJldHVybiB0aGlzLndlYkNvbnRlbnRzLnNlbmQoV29ya2VyLmNoYW5uZWxOYW1lLCB7XG4gICAgICAgIHR5cGU6ICdnaXQtZXhlYycsXG4gICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gb3BlcmF0aW9uLmNhbmNlbChwYXlsb2FkID0+IHtcbiAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgcmV0dXJuIHRoaXMud2ViQ29udGVudHMuc2VuZChXb3JrZXIuY2hhbm5lbE5hbWUsIHtcbiAgICAgICAgdHlwZTogJ2dpdC1jYW5jZWwnLFxuICAgICAgICBkYXRhOiBwYXlsb2FkLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGlkO1xuICB9XG5cbiAgZ2V0UmVhZHlQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5UHJvbWlzZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgT3BlcmF0aW9uIHtcbiAgc3RhdGljIHN0YXR1cyA9IHtcbiAgICBQRU5ESU5HOiBTeW1ib2woJ3BlbmRpbmcnKSxcbiAgICBJTlBST0dSRVNTOiBTeW1ib2woJ2luLXByb2dyZXNzJyksXG4gICAgQ09NUExFVEU6IFN5bWJvbCgnY29tcGxldGUnKSxcbiAgICBDQU5DRUxMSU5HOiBTeW1ib2woJ2NhbmNlbGxpbmcnKSxcbiAgICBDQU5DRUxMRUQ6IFN5bWJvbCgnY2FuY2VsZWQnKSxcbiAgfVxuXG4gIHN0YXRpYyBpZCA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdGhpcy5pZCA9IE9wZXJhdGlvbi5pZCsrO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB0aGlzLnJlamVjdCA9IHJlamVjdDtcbiAgICB0aGlzLnByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSA9ICgpID0+IHt9O1xuICAgIHRoaXMuc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLmVuZFRpbWUgPSBudWxsO1xuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5QRU5ESU5HO1xuICAgIHRoaXMucmVzdWx0cyA9IG51bGw7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIG9uQ29tcGxldGUoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdjb21wbGV0ZScsIGNiKTtcbiAgfVxuXG4gIHNldFByb21pc2UocHJvbWlzZSkge1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gIH1cblxuICBnZXRQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnByb21pc2U7XG4gIH1cblxuICBzZXRJblByb2dyZXNzKCkge1xuICAgIC8vIGFmdGVyIGV4ZWMgaGFzIGJlZW4gY2FsbGVkIGJ1dCBiZWZvcmUgcmVzdWx0cyBhIHJlY2VpdmVkXG4gICAgdGhpcy5zdGF0dXMgPSBPcGVyYXRpb24uc3RhdHVzLklOUFJPR1JFU1M7XG4gIH1cblxuICBnZXRFeGVjdXRpb25UaW1lKCkge1xuICAgIGlmICghdGhpcy5zdGFydFRpbWUgfHwgIXRoaXMuZW5kVGltZSkge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZW5kVGltZSAtIHRoaXMuc3RhcnRUaW1lO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKHJlc3VsdHMsIG11dGF0ZSA9IGRhdGEgPT4gZGF0YSkge1xuICAgIHRoaXMuZW5kVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMucmVzdWx0cyA9IHJlc3VsdHM7XG4gICAgdGhpcy5yZXNvbHZlKG11dGF0ZShyZXN1bHRzKSk7XG4gICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlKCk7XG4gICAgdGhpcy5zdGF0dXMgPSBPcGVyYXRpb24uc3RhdHVzLkNPTVBMRVRFO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjb21wbGV0ZScsIHRoaXMpO1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cblxuICB3YXNDYW5jZWxsZWQoKSB7XG4gICAgdGhpcy5zdGF0dXMgPSBPcGVyYXRpb24uc3RhdHVzLkNBTkNFTExFRDtcbiAgICB0aGlzLmNhbmNlbGxhdGlvblJlc29sdmUoKTtcbiAgfVxuXG4gIGVycm9yKHJlc3VsdHMpIHtcbiAgICB0aGlzLmVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IocmVzdWx0cy5tZXNzYWdlLCByZXN1bHRzLmZpbGVOYW1lLCByZXN1bHRzLmxpbmVOdW1iZXIpO1xuICAgIGVyci5zdGFjayA9IHJlc3VsdHMuc3RhY2s7XG4gICAgdGhpcy5yZWplY3QoZXJyKTtcbiAgfVxuXG4gIGV4ZWN1dGUoZXhlY0ZuKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICByZXR1cm4gZXhlY0ZuKHsuLi50aGlzLmRhdGEsIGlkOiB0aGlzLmlkfSk7XG4gIH1cblxuICBjYW5jZWwoZXhlY0ZuKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zdGF0dXMgPSBPcGVyYXRpb24uc3RhdHVzLkNBTkNFTExJTkc7XG4gICAgICB0aGlzLmNhbmNlbGxhdGlvblJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgZXhlY0ZuKHtpZDogdGhpcy5pZH0pO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFBbUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSG5ELE1BQU07RUFBQ0E7QUFBYSxDQUFDLEdBQUdDLGdCQUFNO0FBS2YsTUFBTUMsYUFBYSxDQUFDO0VBR2pDLE9BQU9DLFdBQVcsR0FBRztJQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDQyxRQUFRLEVBQUU7TUFDbEIsSUFBSSxDQUFDQSxRQUFRLEdBQUcsSUFBSUYsYUFBYSxFQUFFO0lBQ3JDO0lBQ0EsT0FBTyxJQUFJLENBQUNFLFFBQVE7RUFDdEI7RUFFQSxPQUFPQyxLQUFLLENBQUNDLEtBQUssRUFBRTtJQUNsQixJQUFJLElBQUksQ0FBQ0YsUUFBUSxFQUFFO01BQUUsSUFBSSxDQUFDQSxRQUFRLENBQUNHLE9BQU8sQ0FBQ0QsS0FBSyxDQUFDO0lBQUU7SUFDbkQsSUFBSSxDQUFDRixRQUFRLEdBQUcsSUFBSTtFQUN0QjtFQUVBSSxXQUFXLEdBQUc7SUFDWixJQUFBQyxpQkFBUSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQztJQUVwRCxJQUFJLENBQUNDLE9BQU8sR0FB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