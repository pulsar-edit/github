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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3F1ZXJ5c3RyaW5nIiwiX2VsZWN0cm9uIiwiX2V2ZW50S2l0IiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIm93bktleXMiLCJvYmplY3QiLCJlbnVtZXJhYmxlT25seSIsImtleXMiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwiZm9yRWFjaCIsImtleSIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiQnJvd3NlcldpbmRvdyIsInJlbW90ZSIsIldvcmtlck1hbmFnZXIiLCJnZXRJbnN0YW5jZSIsImluc3RhbmNlIiwicmVzZXQiLCJmb3JjZSIsImRlc3Ryb3kiLCJjb25zdHJ1Y3RvciIsImF1dG9iaW5kIiwid29ya2VycyIsIlNldCIsImFjdGl2ZVdvcmtlciIsImNyZWF0ZU5ld1dvcmtlciIsImlzUmVhZHkiLCJyZXF1ZXN0IiwiZGF0YSIsImRlc3Ryb3llZCIsIkVycm9yIiwib3BlcmF0aW9uIiwicmVxdWVzdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIk9wZXJhdGlvbiIsImV4ZWN1dGVPcGVyYXRpb24iLCJzZXRQcm9taXNlIiwiY2FuY2VsIiwiY2FuY2VsT3BlcmF0aW9uIiwicHJvbWlzZSIsIm9wZXJhdGlvbkNvdW50TGltaXQiLCJXb3JrZXIiLCJvbkRlc3Ryb3llZCIsIm9uQ3Jhc2hlZCIsIm9uU2ljayIsImFkZCIsImRlc3Ryb3llZFdvcmtlciIsImRlbGV0ZSIsImNyYXNoZWRXb3JrZXIiLCJnZXRBY3RpdmVXb3JrZXIiLCJnZXRPcGVyYXRpb25Db3VudExpbWl0IiwiZ2V0UmVtYWluaW5nT3BlcmF0aW9ucyIsInNpY2tXb3JrZXIiLCJhdG9tIiwiaW5TcGVjTW9kZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQiLCJjYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0IiwibGFzdFdvcmtlciIsIk1hdGgiLCJtaW4iLCJnZXRSZWFkeVByb21pc2UiLCJ3b3JrZXIiLCJleHBvcnRzIiwib3BlcmF0aW9uc0J5SWQiLCJNYXAiLCJjb21wbGV0ZWRPcGVyYXRpb25Db3VudCIsInNpY2siLCJyZW5kZXJlclByb2Nlc3MiLCJSZW5kZXJlclByb2Nlc3MiLCJsb2FkVXJsIiwiZ2V0TG9hZFVybCIsIm9uRGF0YSIsImhhbmRsZURhdGFSZWNlaXZlZCIsIm9uQ2FuY2VsbGVkIiwiaGFuZGxlQ2FuY2VsbGVkIiwib25FeGVjU3RhcnRlZCIsImhhbmRsZUV4ZWNTdGFydGVkIiwib25TcGF3bkVycm9yIiwiaGFuZGxlU3Bhd25FcnJvciIsIm9uU3RkaW5FcnJvciIsImhhbmRsZVN0ZGluRXJyb3IiLCJoYW5kbGVTaWNrIiwiaGFuZGxlQ3Jhc2hlZCIsImh0bWxQYXRoIiwicGF0aCIsImpvaW4iLCJnZXRQYWNrYWdlUm9vdCIsInJlbmRlcmVySnNQYXRoIiwicXMiLCJxdWVyeXN0cmluZyIsInN0cmluZ2lmeSIsImpzIiwibWFuYWdlcldlYkNvbnRlbnRzSWQiLCJnZXRXZWJDb250ZW50c0lkIiwiY2hhbm5lbE5hbWUiLCJnZXRDdXJyZW50V2ViQ29udGVudHMiLCJpZCIsInNldCIsIm9uQ29tcGxldGUiLCJvbk9wZXJhdGlvbkNvbXBsZXRlIiwicmVzdWx0cyIsImdldCIsImNvbXBsZXRlIiwidGltaW5nIiwidG90YWxJbnRlcm5hbFRpbWUiLCJleGVjVGltZSIsInNwYXduVGltZSIsImlwY1RpbWUiLCJnZXRFeGVjdXRpb25UaW1lIiwic2l6ZSIsIndhc0NhbmNlbGxlZCIsInNldEluUHJvZ3Jlc3MiLCJlcnIiLCJlcnJvciIsInN0ZGluIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwiZ2V0UGlkIiwicmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMiLCJtYXAiLCJnZXRQcm9taXNlIiwiY2F0Y2giLCJhbGwiLCJ3aW4iLCJzaG93IiwicHJvY2VzcyIsImVudiIsIkFUT01fR0lUSFVCX1NIT1dfUkVOREVSRVJfV0lORE9XIiwid2ViUHJlZmVyZW5jZXMiLCJub2RlSW50ZWdyYXRpb24iLCJlbmFibGVSZW1vdGVNb2R1bGUiLCJ3ZWJDb250ZW50cyIsImVtaXR0ZXIiLCJFbWl0dGVyIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWdpc3Rlckxpc3RlbmVycyIsImxvYWRVUkwiLCJvbiIsImhhbmRsZURlc3Ryb3kiLCJEaXNwb3NhYmxlIiwiaXNEZXN0cm95ZWQiLCJyZW1vdmVMaXN0ZW5lciIsInJlYWR5IiwicmVhZHlQcm9taXNlIiwicmVzb2x2ZVJlYWR5IiwiYXJncyIsImhhbmRsZU1lc3NhZ2VzIiwiZXZlbnQiLCJzb3VyY2VXZWJDb250ZW50c0lkIiwidHlwZSIsImVtaXQiLCJpcGMiLCJwaWQiLCJleGVjdXRlIiwicGF5bG9hZCIsInNlbmQiLCJkaXNwb3NlIiwiY2FuY2VsbGF0aW9uUmVzb2x2ZSIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJzdGF0dXMiLCJQRU5ESU5HIiwiY2IiLCJJTlBST0dSRVNTIiwiTmFOIiwibXV0YXRlIiwicGVyZm9ybWFuY2UiLCJub3ciLCJDT01QTEVURSIsIkNBTkNFTExFRCIsIm1lc3NhZ2UiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJzdGFjayIsImV4ZWNGbiIsIkNBTkNFTExJTkciXSwic291cmNlcyI6WyJ3b3JrZXItbWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdxdWVyeXN0cmluZyc7XG5cbmltcG9ydCB7cmVtb3RlLCBpcGNSZW5kZXJlciBhcyBpcGN9IGZyb20gJ2VsZWN0cm9uJztcbmNvbnN0IHtCcm93c2VyV2luZG93fSA9IHJlbW90ZTtcbmltcG9ydCB7RW1pdHRlciwgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtnZXRQYWNrYWdlUm9vdCwgYXV0b2JpbmR9IGZyb20gJy4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmtlck1hbmFnZXIge1xuICBzdGF0aWMgaW5zdGFuY2UgPSBudWxsO1xuXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgV29ya2VyTWFuYWdlcigpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxuXG4gIHN0YXRpYyByZXNldChmb3JjZSkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7IHRoaXMuaW5zdGFuY2UuZGVzdHJveShmb3JjZSk7IH1cbiAgICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGF1dG9iaW5kKHRoaXMsICdvbkRlc3Ryb3llZCcsICdvbkNyYXNoZWQnLCAnb25TaWNrJyk7XG5cbiAgICB0aGlzLndvcmtlcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5hY3RpdmVXb3JrZXIgPSBudWxsO1xuICAgIHRoaXMuY3JlYXRlTmV3V29ya2VyKCk7XG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlci5pc1JlYWR5KCk7XG4gIH1cblxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgdGhyb3cgbmV3IEVycm9yKCdXb3JrZXIgaXMgZGVzdHJveWVkJyk7IH1cbiAgICBsZXQgb3BlcmF0aW9uO1xuICAgIGNvbnN0IHJlcXVlc3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgb3BlcmF0aW9uID0gbmV3IE9wZXJhdGlvbihkYXRhLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlV29ya2VyLmV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKTtcbiAgICB9KTtcbiAgICBvcGVyYXRpb24uc2V0UHJvbWlzZShyZXF1ZXN0UHJvbWlzZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbmNlbDogKCkgPT4gdGhpcy5hY3RpdmVXb3JrZXIuY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbiksXG4gICAgICBwcm9taXNlOiByZXF1ZXN0UHJvbWlzZSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlTmV3V29ya2VyKHtvcGVyYXRpb25Db3VudExpbWl0fSA9IHtvcGVyYXRpb25Db3VudExpbWl0OiAxMH0pIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5hY3RpdmVXb3JrZXIgPSBuZXcgV29ya2VyKHtcbiAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQsXG4gICAgICBvbkRlc3Ryb3llZDogdGhpcy5vbkRlc3Ryb3llZCxcbiAgICAgIG9uQ3Jhc2hlZDogdGhpcy5vbkNyYXNoZWQsXG4gICAgICBvblNpY2s6IHRoaXMub25TaWNrLFxuICAgIH0pO1xuICAgIHRoaXMud29ya2Vycy5hZGQodGhpcy5hY3RpdmVXb3JrZXIpO1xuICB9XG5cbiAgb25EZXN0cm95ZWQoZGVzdHJveWVkV29ya2VyKSB7XG4gICAgdGhpcy53b3JrZXJzLmRlbGV0ZShkZXN0cm95ZWRXb3JrZXIpO1xuICB9XG5cbiAgb25DcmFzaGVkKGNyYXNoZWRXb3JrZXIpIHtcbiAgICBpZiAoY3Jhc2hlZFdvcmtlciA9PT0gdGhpcy5nZXRBY3RpdmVXb3JrZXIoKSkge1xuICAgICAgdGhpcy5jcmVhdGVOZXdXb3JrZXIoe29wZXJhdGlvbkNvdW50TGltaXQ6IGNyYXNoZWRXb3JrZXIuZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpfSk7XG4gICAgfVxuICAgIGNyYXNoZWRXb3JrZXIuZ2V0UmVtYWluaW5nT3BlcmF0aW9ucygpLmZvckVhY2gob3BlcmF0aW9uID0+IHRoaXMuYWN0aXZlV29ya2VyLmV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKSk7XG4gIH1cblxuICBvblNpY2soc2lja1dvcmtlcikge1xuICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oYFNpY2sgd29ya2VyIGRldGVjdGVkLlxuICAgICAgICBvcGVyYXRpb25Db3VudExpbWl0OiAke3NpY2tXb3JrZXIuZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpfSxcbiAgICAgICAgY29tcGxldGVkIG9wZXJhdGlvbiBjb3VudDogJHtzaWNrV29ya2VyLmdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50KCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IG9wZXJhdGlvbkNvdW50TGltaXQgPSB0aGlzLmNhbGN1bGF0ZU5ld09wZXJhdGlvbkNvdW50TGltaXQoc2lja1dvcmtlcik7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlTmV3V29ya2VyKHtvcGVyYXRpb25Db3VudExpbWl0fSk7XG4gIH1cblxuICBjYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0KGxhc3RXb3JrZXIpIHtcbiAgICBsZXQgb3BlcmF0aW9uQ291bnRMaW1pdCA9IDEwO1xuICAgIGlmIChsYXN0V29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKSA+PSBsYXN0V29ya2VyLmdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50KCkpIHtcbiAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQgPSBNYXRoLm1pbihsYXN0V29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKSAqIDIsIDEwMCk7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRpb25Db3VudExpbWl0O1xuICB9XG5cbiAgZ2V0QWN0aXZlV29ya2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlcjtcbiAgfVxuXG4gIGdldFJlYWR5UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXIuZ2V0UmVhZHlQcm9taXNlKCk7XG4gIH1cblxuICBkZXN0cm95KGZvcmNlKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMud29ya2Vycy5mb3JFYWNoKHdvcmtlciA9PiB3b3JrZXIuZGVzdHJveShmb3JjZSkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFdvcmtlciB7XG4gIHN0YXRpYyBjaGFubmVsTmFtZSA9ICdnaXRodWI6cmVuZGVyZXItaXBjJztcblxuICBjb25zdHJ1Y3Rvcih7b3BlcmF0aW9uQ291bnRMaW1pdCwgb25TaWNrLCBvbkNyYXNoZWQsIG9uRGVzdHJveWVkfSkge1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdoYW5kbGVEYXRhUmVjZWl2ZWQnLCAnb25PcGVyYXRpb25Db21wbGV0ZScsICdoYW5kbGVDYW5jZWxsZWQnLCAnaGFuZGxlRXhlY1N0YXJ0ZWQnLCAnaGFuZGxlU3Bhd25FcnJvcicsXG4gICAgICAnaGFuZGxlU3RkaW5FcnJvcicsICdoYW5kbGVTaWNrJywgJ2hhbmRsZUNyYXNoZWQnLFxuICAgICk7XG5cbiAgICB0aGlzLm9wZXJhdGlvbkNvdW50TGltaXQgPSBvcGVyYXRpb25Db3VudExpbWl0O1xuICAgIHRoaXMub25TaWNrID0gb25TaWNrO1xuICAgIHRoaXMub25DcmFzaGVkID0gb25DcmFzaGVkO1xuICAgIHRoaXMub25EZXN0cm95ZWQgPSBvbkRlc3Ryb3llZDtcblxuICAgIHRoaXMub3BlcmF0aW9uc0J5SWQgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5jb21wbGV0ZWRPcGVyYXRpb25Db3VudCA9IDA7XG4gICAgdGhpcy5zaWNrID0gZmFsc2U7XG5cbiAgICB0aGlzLnJlbmRlcmVyUHJvY2VzcyA9IG5ldyBSZW5kZXJlclByb2Nlc3Moe1xuICAgICAgbG9hZFVybDogdGhpcy5nZXRMb2FkVXJsKG9wZXJhdGlvbkNvdW50TGltaXQpLFxuICAgICAgb25EYXRhOiB0aGlzLmhhbmRsZURhdGFSZWNlaXZlZCxcbiAgICAgIG9uQ2FuY2VsbGVkOiB0aGlzLmhhbmRsZUNhbmNlbGxlZCxcbiAgICAgIG9uRXhlY1N0YXJ0ZWQ6IHRoaXMuaGFuZGxlRXhlY1N0YXJ0ZWQsXG4gICAgICBvblNwYXduRXJyb3I6IHRoaXMuaGFuZGxlU3Bhd25FcnJvcixcbiAgICAgIG9uU3RkaW5FcnJvcjogdGhpcy5oYW5kbGVTdGRpbkVycm9yLFxuICAgICAgb25TaWNrOiB0aGlzLmhhbmRsZVNpY2ssXG4gICAgICBvbkNyYXNoZWQ6IHRoaXMuaGFuZGxlQ3Jhc2hlZCxcbiAgICAgIG9uRGVzdHJveWVkOiB0aGlzLmRlc3Ryb3ksXG4gICAgfSk7XG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5pc1JlYWR5KCk7XG4gIH1cblxuICBnZXRMb2FkVXJsKG9wZXJhdGlvbkNvdW50TGltaXQpIHtcbiAgICBjb25zdCBodG1sUGF0aCA9IHBhdGguam9pbihnZXRQYWNrYWdlUm9vdCgpLCAnbGliJywgJ3JlbmRlcmVyLmh0bWwnKTtcbiAgICBjb25zdCByZW5kZXJlckpzUGF0aCA9IHBhdGguam9pbihnZXRQYWNrYWdlUm9vdCgpLCAnbGliJywgJ3dvcmtlci5qcycpO1xuICAgIGNvbnN0IHFzID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHtcbiAgICAgIGpzOiByZW5kZXJlckpzUGF0aCxcbiAgICAgIG1hbmFnZXJXZWJDb250ZW50c0lkOiB0aGlzLmdldFdlYkNvbnRlbnRzSWQoKSxcbiAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQsXG4gICAgICBjaGFubmVsTmFtZTogV29ya2VyLmNoYW5uZWxOYW1lLFxuICAgIH0pO1xuICAgIHJldHVybiBgZmlsZTovLyR7aHRtbFBhdGh9PyR7cXN9YDtcbiAgfVxuXG4gIGdldFdlYkNvbnRlbnRzSWQoKSB7XG4gICAgcmV0dXJuIHJlbW90ZS5nZXRDdXJyZW50V2ViQ29udGVudHMoKS5pZDtcbiAgfVxuXG4gIGV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgdGhpcy5vcGVyYXRpb25zQnlJZC5zZXQob3BlcmF0aW9uLmlkLCBvcGVyYXRpb24pO1xuICAgIG9wZXJhdGlvbi5vbkNvbXBsZXRlKHRoaXMub25PcGVyYXRpb25Db21wbGV0ZSk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKTtcbiAgfVxuXG4gIGNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbik7XG4gIH1cblxuICBoYW5kbGVEYXRhUmVjZWl2ZWQoe2lkLCByZXN1bHRzfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uY29tcGxldGUocmVzdWx0cywgZGF0YSA9PiB7XG4gICAgICBjb25zdCB7dGltaW5nfSA9IGRhdGE7XG4gICAgICBjb25zdCB0b3RhbEludGVybmFsVGltZSA9IHRpbWluZy5leGVjVGltZSArIHRpbWluZy5zcGF3blRpbWU7XG4gICAgICBjb25zdCBpcGNUaW1lID0gb3BlcmF0aW9uLmdldEV4ZWN1dGlvblRpbWUoKSAtIHRvdGFsSW50ZXJuYWxUaW1lO1xuICAgICAgZGF0YS50aW1pbmcuaXBjVGltZSA9IGlwY1RpbWU7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uT3BlcmF0aW9uQ29tcGxldGUob3BlcmF0aW9uKSB7XG4gICAgdGhpcy5jb21wbGV0ZWRPcGVyYXRpb25Db3VudCsrO1xuICAgIHRoaXMub3BlcmF0aW9uc0J5SWQuZGVsZXRlKG9wZXJhdGlvbi5pZCk7XG5cbiAgICBpZiAodGhpcy5zaWNrICYmIHRoaXMub3BlcmF0aW9uc0J5SWQuc2l6ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2FuY2VsbGVkKHtpZH0pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgaWYgKG9wZXJhdGlvbikge1xuICAgICAgLy8gaGFuZGxlRGF0YVJlY2VpdmVkKCkgY2FuIGJlIHJlY2VpdmVkIGJlZm9yZSBoYW5kbGVDYW5jZWxsZWQoKVxuICAgICAgb3BlcmF0aW9uLndhc0NhbmNlbGxlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV4ZWNTdGFydGVkKHtpZH0pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgb3BlcmF0aW9uLnNldEluUHJvZ3Jlc3MoKTtcbiAgfVxuXG4gIGhhbmRsZVNwYXduRXJyb3Ioe2lkLCBlcnJ9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgaGFuZGxlU3RkaW5FcnJvcih7aWQsIHN0ZGluLCBlcnJ9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgaGFuZGxlU2ljaygpIHtcbiAgICB0aGlzLnNpY2sgPSB0cnVlO1xuICAgIHRoaXMub25TaWNrKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ3Jhc2hlZCgpIHtcbiAgICB0aGlzLm9uQ3Jhc2hlZCh0aGlzKTtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldE9wZXJhdGlvbkNvdW50TGltaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlcmF0aW9uQ291bnRMaW1pdDtcbiAgfVxuXG4gIGdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmNvbXBsZXRlZE9wZXJhdGlvbkNvdW50O1xuICB9XG5cbiAgZ2V0UmVtYWluaW5nT3BlcmF0aW9ucygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLm9wZXJhdGlvbnNCeUlkLnZhbHVlcygpKTtcbiAgfVxuXG4gIGdldFBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuZ2V0UGlkKCk7XG4gIH1cblxuICBnZXRSZWFkeVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmdldFJlYWR5UHJvbWlzZSgpO1xuICB9XG5cbiAgYXN5bmMgZGVzdHJveShmb3JjZSkge1xuICAgIHRoaXMub25EZXN0cm95ZWQodGhpcyk7XG4gICAgaWYgKHRoaXMub3BlcmF0aW9uc0J5SWQuc2l6ZSA+IDAgJiYgIWZvcmNlKSB7XG4gICAgICBjb25zdCByZW1haW5pbmdPcGVyYXRpb25Qcm9taXNlcyA9IHRoaXMuZ2V0UmVtYWluaW5nT3BlcmF0aW9ucygpXG4gICAgICAgIC5tYXAob3BlcmF0aW9uID0+IG9wZXJhdGlvbi5nZXRQcm9taXNlKCkuY2F0Y2goKCkgPT4gbnVsbCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5kZXN0cm95KCk7XG4gIH1cbn1cblxuXG4vKlxuU2VuZHMgb3BlcmF0aW9ucyB0byByZW5kZXJlciBwcm9jZXNzZXNcbiovXG5leHBvcnQgY2xhc3MgUmVuZGVyZXJQcm9jZXNzIHtcbiAgY29uc3RydWN0b3Ioe2xvYWRVcmwsXG4gICAgb25EZXN0cm95ZWQsIG9uQ3Jhc2hlZCwgb25TaWNrLCBvbkRhdGEsIG9uQ2FuY2VsbGVkLCBvblNwYXduRXJyb3IsIG9uU3RkaW5FcnJvciwgb25FeGVjU3RhcnRlZH0pIHtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlRGVzdHJveScpO1xuICAgIHRoaXMub25EZXN0cm95ZWQgPSBvbkRlc3Ryb3llZDtcbiAgICB0aGlzLm9uQ3Jhc2hlZCA9IG9uQ3Jhc2hlZDtcbiAgICB0aGlzLm9uU2ljayA9IG9uU2ljaztcbiAgICB0aGlzLm9uRGF0YSA9IG9uRGF0YTtcbiAgICB0aGlzLm9uQ2FuY2VsbGVkID0gb25DYW5jZWxsZWQ7XG4gICAgdGhpcy5vblNwYXduRXJyb3IgPSBvblNwYXduRXJyb3I7XG4gICAgdGhpcy5vblN0ZGluRXJyb3IgPSBvblN0ZGluRXJyb3I7XG4gICAgdGhpcy5vbkV4ZWNTdGFydGVkID0gb25FeGVjU3RhcnRlZDtcblxuICAgIHRoaXMud2luID0gbmV3IEJyb3dzZXJXaW5kb3coe3Nob3c6ICEhcHJvY2Vzcy5lbnYuQVRPTV9HSVRIVUJfU0hPV19SRU5ERVJFUl9XSU5ET1csXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge25vZGVJbnRlZ3JhdGlvbjogdHJ1ZSwgZW5hYmxlUmVtb3RlTW9kdWxlOiB0cnVlfX0pO1xuICAgIHRoaXMud2ViQ29udGVudHMgPSB0aGlzLndpbi53ZWJDb250ZW50cztcbiAgICAvLyB0aGlzLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgIHRoaXMud2luLmxvYWRVUkwobG9hZFVybCk7XG4gICAgdGhpcy53aW4ud2ViQ29udGVudHMub24oJ2NyYXNoZWQnLCB0aGlzLmhhbmRsZURlc3Ryb3kpO1xuICAgIHRoaXMud2luLndlYkNvbnRlbnRzLm9uKCdkZXN0cm95ZWQnLCB0aGlzLmhhbmRsZURlc3Ryb3kpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy53aW4uaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICAgIHRoaXMud2luLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdjcmFzaGVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICAgICAgICB0aGlzLndpbi53ZWJDb250ZW50cy5yZW1vdmVMaXN0ZW5lcignZGVzdHJveWVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICAgICAgICB0aGlzLndpbi5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5lbWl0dGVyLFxuICAgICk7XG5cbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5yZWFkeVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHsgdGhpcy5yZXNvbHZlUmVhZHkgPSByZXNvbHZlOyB9KTtcbiAgfVxuXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHk7XG4gIH1cblxuICBoYW5kbGVEZXN0cm95KC4uLmFyZ3MpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB0aGlzLm9uQ3Jhc2hlZCguLi5hcmdzKTtcbiAgfVxuXG4gIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGhhbmRsZU1lc3NhZ2VzID0gKGV2ZW50LCB7c291cmNlV2ViQ29udGVudHNJZCwgdHlwZSwgZGF0YX0pID0+IHtcbiAgICAgIGlmIChzb3VyY2VXZWJDb250ZW50c0lkID09PSB0aGlzLndpbi53ZWJDb250ZW50cy5pZCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCh0eXBlLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaXBjLm9uKFdvcmtlci5jaGFubmVsTmFtZSwgaGFuZGxlTWVzc2FnZXMpO1xuICAgIHRoaXMuZW1pdHRlci5vbigncmVuZGVyZXItcmVhZHknLCAoe3BpZH0pID0+IHtcbiAgICAgIHRoaXMucGlkID0gcGlkO1xuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLnJlc29sdmVSZWFkeSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LWRhdGEnLCB0aGlzLm9uRGF0YSk7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtY2FuY2VsbGVkJywgdGhpcy5vbkNhbmNlbGxlZCk7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtc3Bhd24tZXJyb3InLCB0aGlzLm9uU3Bhd25FcnJvcik7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtc3RkaW4tZXJyb3InLCB0aGlzLm9uU3RkaW5FcnJvcik7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdzbG93LXNwYXducycsIHRoaXMub25TaWNrKTtcblxuICAgIC8vIG5vdCBjdXJyZW50bHkgdXNlZCB0byBhdm9pZCBjbG9nZ2luZyB1cCBpcGMgY2hhbm5lbFxuICAgIC8vIGtlZXBpbmcgaXQgYXJvdW5kIGFzIGl0J3MgcG90ZW50aWFsbHkgdXNlZnVsIGZvciBhdm9pZGluZyBkdXBsaWNhdGUgd3JpdGUgb3BlcmF0aW9ucyB1cG9uIHJlbmRlcmVyIGNyYXNoaW5nXG4gICAgdGhpcy5lbWl0dGVyLm9uKCdleGVjLXN0YXJ0ZWQnLCB0aGlzLm9uRXhlY1N0YXJ0ZWQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IGlwYy5yZW1vdmVMaXN0ZW5lcihXb3JrZXIuY2hhbm5lbE5hbWUsIGhhbmRsZU1lc3NhZ2VzKSksXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvbi5leGVjdXRlKHBheWxvYWQgPT4ge1xuICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiBudWxsOyB9XG4gICAgICByZXR1cm4gdGhpcy53ZWJDb250ZW50cy5zZW5kKFdvcmtlci5jaGFubmVsTmFtZSwge1xuICAgICAgICB0eXBlOiAnZ2l0LWV4ZWMnLFxuICAgICAgICBkYXRhOiBwYXlsb2FkLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYW5jZWxPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvbi5jYW5jZWwocGF5bG9hZCA9PiB7XG4gICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIHJldHVybiB0aGlzLndlYkNvbnRlbnRzLnNlbmQoV29ya2VyLmNoYW5uZWxOYW1lLCB7XG4gICAgICAgIHR5cGU6ICdnaXQtY2FuY2VsJyxcbiAgICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGlkKCkge1xuICAgIHJldHVybiB0aGlzLnBpZDtcbiAgfVxuXG4gIGdldFJlYWR5UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeVByb21pc2U7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIE9wZXJhdGlvbiB7XG4gIHN0YXRpYyBzdGF0dXMgPSB7XG4gICAgUEVORElORzogU3ltYm9sKCdwZW5kaW5nJyksXG4gICAgSU5QUk9HUkVTUzogU3ltYm9sKCdpbi1wcm9ncmVzcycpLFxuICAgIENPTVBMRVRFOiBTeW1ib2woJ2NvbXBsZXRlJyksXG4gICAgQ0FOQ0VMTElORzogU3ltYm9sKCdjYW5jZWxsaW5nJyksXG4gICAgQ0FOQ0VMTEVEOiBTeW1ib2woJ2NhbmNlbGVkJyksXG4gIH1cblxuICBzdGF0aWMgaWQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGEsIHJlc29sdmUsIHJlamVjdCkge1xuICAgIHRoaXMuaWQgPSBPcGVyYXRpb24uaWQrKztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgdGhpcy5wcm9taXNlID0gbnVsbDtcbiAgICB0aGlzLmNhbmNlbGxhdGlvblJlc29sdmUgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5lbmRUaW1lID0gbnVsbDtcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuUEVORElORztcbiAgICB0aGlzLnJlc3VsdHMgPSBudWxsO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gIH1cblxuICBvbkNvbXBsZXRlKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignY29tcGxldGUnLCBjYik7XG4gIH1cblxuICBzZXRQcm9taXNlKHByb21pc2UpIHtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICB9XG5cbiAgZ2V0UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlO1xuICB9XG5cbiAgc2V0SW5Qcm9ncmVzcygpIHtcbiAgICAvLyBhZnRlciBleGVjIGhhcyBiZWVuIGNhbGxlZCBidXQgYmVmb3JlIHJlc3VsdHMgYSByZWNlaXZlZFxuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5JTlBST0dSRVNTO1xuICB9XG5cbiAgZ2V0RXhlY3V0aW9uVGltZSgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRUaW1lIHx8ICF0aGlzLmVuZFRpbWUpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZFRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZShyZXN1bHRzLCBtdXRhdGUgPSBkYXRhID0+IGRhdGEpIHtcbiAgICB0aGlzLmVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzO1xuICAgIHRoaXMucmVzb2x2ZShtdXRhdGUocmVzdWx0cykpO1xuICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSgpO1xuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5DT01QTEVURTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY29tcGxldGUnLCB0aGlzKTtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgd2FzQ2FuY2VsbGVkKCkge1xuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5DQU5DRUxMRUQ7XG4gICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlKCk7XG4gIH1cblxuICBlcnJvcihyZXN1bHRzKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKHJlc3VsdHMubWVzc2FnZSwgcmVzdWx0cy5maWxlTmFtZSwgcmVzdWx0cy5saW5lTnVtYmVyKTtcbiAgICBlcnIuc3RhY2sgPSByZXN1bHRzLnN0YWNrO1xuICAgIHRoaXMucmVqZWN0KGVycik7XG4gIH1cblxuICBleGVjdXRlKGV4ZWNGbikge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIGV4ZWNGbih7Li4udGhpcy5kYXRhLCBpZDogdGhpcy5pZH0pO1xuICB9XG5cbiAgY2FuY2VsKGV4ZWNGbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5DQU5DRUxMSU5HO1xuICAgICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGV4ZWNGbih7aWQ6IHRoaXMuaWR9KTtcbiAgICB9KTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxZQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBRSxTQUFBLEdBQUFGLE9BQUE7QUFFQSxJQUFBRyxTQUFBLEdBQUFILE9BQUE7QUFFQSxJQUFBSSxRQUFBLEdBQUFKLE9BQUE7QUFBbUQsU0FBQUQsdUJBQUFNLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxRQUFBQyxNQUFBLEVBQUFDLGNBQUEsUUFBQUMsSUFBQSxHQUFBQyxNQUFBLENBQUFELElBQUEsQ0FBQUYsTUFBQSxPQUFBRyxNQUFBLENBQUFDLHFCQUFBLFFBQUFDLE9BQUEsR0FBQUYsTUFBQSxDQUFBQyxxQkFBQSxDQUFBSixNQUFBLEdBQUFDLGNBQUEsS0FBQUksT0FBQSxHQUFBQSxPQUFBLENBQUFDLE1BQUEsV0FBQUMsR0FBQSxXQUFBSixNQUFBLENBQUFLLHdCQUFBLENBQUFSLE1BQUEsRUFBQU8sR0FBQSxFQUFBRSxVQUFBLE9BQUFQLElBQUEsQ0FBQVEsSUFBQSxDQUFBQyxLQUFBLENBQUFULElBQUEsRUFBQUcsT0FBQSxZQUFBSCxJQUFBO0FBQUEsU0FBQVUsY0FBQUMsTUFBQSxhQUFBQyxDQUFBLE1BQUFBLENBQUEsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLEVBQUFGLENBQUEsVUFBQUcsTUFBQSxXQUFBRixTQUFBLENBQUFELENBQUEsSUFBQUMsU0FBQSxDQUFBRCxDQUFBLFFBQUFBLENBQUEsT0FBQWYsT0FBQSxDQUFBSSxNQUFBLENBQUFjLE1BQUEsT0FBQUMsT0FBQSxXQUFBQyxHQUFBLElBQUFDLGVBQUEsQ0FBQVAsTUFBQSxFQUFBTSxHQUFBLEVBQUFGLE1BQUEsQ0FB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