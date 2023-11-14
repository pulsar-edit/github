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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3F1ZXJ5c3RyaW5nIiwiX2VsZWN0cm9uIiwiX2V2ZW50S2l0IiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIm93bktleXMiLCJlIiwiciIsInQiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiQnJvd3NlcldpbmRvdyIsInJlbW90ZSIsIldvcmtlck1hbmFnZXIiLCJnZXRJbnN0YW5jZSIsImluc3RhbmNlIiwicmVzZXQiLCJmb3JjZSIsImRlc3Ryb3kiLCJjb25zdHJ1Y3RvciIsImF1dG9iaW5kIiwid29ya2VycyIsIlNldCIsImFjdGl2ZVdvcmtlciIsImNyZWF0ZU5ld1dvcmtlciIsImlzUmVhZHkiLCJyZXF1ZXN0IiwiZGF0YSIsImRlc3Ryb3llZCIsIkVycm9yIiwib3BlcmF0aW9uIiwicmVxdWVzdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIk9wZXJhdGlvbiIsImV4ZWN1dGVPcGVyYXRpb24iLCJzZXRQcm9taXNlIiwiY2FuY2VsIiwiY2FuY2VsT3BlcmF0aW9uIiwicHJvbWlzZSIsIm9wZXJhdGlvbkNvdW50TGltaXQiLCJXb3JrZXIiLCJvbkRlc3Ryb3llZCIsIm9uQ3Jhc2hlZCIsIm9uU2ljayIsImFkZCIsImRlc3Ryb3llZFdvcmtlciIsImRlbGV0ZSIsImNyYXNoZWRXb3JrZXIiLCJnZXRBY3RpdmVXb3JrZXIiLCJnZXRPcGVyYXRpb25Db3VudExpbWl0IiwiZ2V0UmVtYWluaW5nT3BlcmF0aW9ucyIsInNpY2tXb3JrZXIiLCJhdG9tIiwiaW5TcGVjTW9kZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQiLCJjYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0IiwibGFzdFdvcmtlciIsIk1hdGgiLCJtaW4iLCJnZXRSZWFkeVByb21pc2UiLCJ3b3JrZXIiLCJleHBvcnRzIiwib3BlcmF0aW9uc0J5SWQiLCJNYXAiLCJjb21wbGV0ZWRPcGVyYXRpb25Db3VudCIsInNpY2siLCJyZW5kZXJlclByb2Nlc3MiLCJSZW5kZXJlclByb2Nlc3MiLCJsb2FkVXJsIiwiZ2V0TG9hZFVybCIsIm9uRGF0YSIsImhhbmRsZURhdGFSZWNlaXZlZCIsIm9uQ2FuY2VsbGVkIiwiaGFuZGxlQ2FuY2VsbGVkIiwib25FeGVjU3RhcnRlZCIsImhhbmRsZUV4ZWNTdGFydGVkIiwib25TcGF3bkVycm9yIiwiaGFuZGxlU3Bhd25FcnJvciIsIm9uU3RkaW5FcnJvciIsImhhbmRsZVN0ZGluRXJyb3IiLCJoYW5kbGVTaWNrIiwiaGFuZGxlQ3Jhc2hlZCIsImh0bWxQYXRoIiwicGF0aCIsImpvaW4iLCJnZXRQYWNrYWdlUm9vdCIsInJlbmRlcmVySnNQYXRoIiwicXMiLCJxdWVyeXN0cmluZyIsInN0cmluZ2lmeSIsImpzIiwibWFuYWdlcldlYkNvbnRlbnRzSWQiLCJnZXRXZWJDb250ZW50c0lkIiwiY2hhbm5lbE5hbWUiLCJnZXRDdXJyZW50V2ViQ29udGVudHMiLCJpZCIsInNldCIsIm9uQ29tcGxldGUiLCJvbk9wZXJhdGlvbkNvbXBsZXRlIiwicmVzdWx0cyIsImdldCIsImNvbXBsZXRlIiwidGltaW5nIiwidG90YWxJbnRlcm5hbFRpbWUiLCJleGVjVGltZSIsInNwYXduVGltZSIsImlwY1RpbWUiLCJnZXRFeGVjdXRpb25UaW1lIiwic2l6ZSIsIndhc0NhbmNlbGxlZCIsInNldEluUHJvZ3Jlc3MiLCJlcnIiLCJlcnJvciIsInN0ZGluIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwiZ2V0UGlkIiwicmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMiLCJtYXAiLCJnZXRQcm9taXNlIiwiY2F0Y2giLCJhbGwiLCJ3aW4iLCJzaG93IiwicHJvY2VzcyIsImVudiIsIkFUT01fR0lUSFVCX1NIT1dfUkVOREVSRVJfV0lORE9XIiwid2ViUHJlZmVyZW5jZXMiLCJub2RlSW50ZWdyYXRpb24iLCJlbmFibGVSZW1vdGVNb2R1bGUiLCJ3ZWJDb250ZW50cyIsImVtaXR0ZXIiLCJFbWl0dGVyIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWdpc3Rlckxpc3RlbmVycyIsImxvYWRVUkwiLCJvbiIsImhhbmRsZURlc3Ryb3kiLCJEaXNwb3NhYmxlIiwiaXNEZXN0cm95ZWQiLCJyZW1vdmVMaXN0ZW5lciIsInJlYWR5IiwicmVhZHlQcm9taXNlIiwicmVzb2x2ZVJlYWR5IiwiYXJncyIsImhhbmRsZU1lc3NhZ2VzIiwiZXZlbnQiLCJzb3VyY2VXZWJDb250ZW50c0lkIiwidHlwZSIsImVtaXQiLCJpcGMiLCJwaWQiLCJleGVjdXRlIiwicGF5bG9hZCIsInNlbmQiLCJkaXNwb3NlIiwiY2FuY2VsbGF0aW9uUmVzb2x2ZSIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJzdGF0dXMiLCJQRU5ESU5HIiwiY2IiLCJJTlBST0dSRVNTIiwiTmFOIiwibXV0YXRlIiwicGVyZm9ybWFuY2UiLCJub3ciLCJDT01QTEVURSIsIkNBTkNFTExFRCIsIm1lc3NhZ2UiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJzdGFjayIsImV4ZWNGbiIsIkNBTkNFTExJTkciXSwic291cmNlcyI6WyJ3b3JrZXItbWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdxdWVyeXN0cmluZyc7XG5cbmltcG9ydCB7cmVtb3RlLCBpcGNSZW5kZXJlciBhcyBpcGN9IGZyb20gJ2VsZWN0cm9uJztcbmNvbnN0IHtCcm93c2VyV2luZG93fSA9IHJlbW90ZTtcbmltcG9ydCB7RW1pdHRlciwgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtnZXRQYWNrYWdlUm9vdCwgYXV0b2JpbmR9IGZyb20gJy4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmtlck1hbmFnZXIge1xuICBzdGF0aWMgaW5zdGFuY2UgPSBudWxsO1xuXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgV29ya2VyTWFuYWdlcigpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgfVxuXG4gIHN0YXRpYyByZXNldChmb3JjZSkge1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB7IHRoaXMuaW5zdGFuY2UuZGVzdHJveShmb3JjZSk7IH1cbiAgICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGF1dG9iaW5kKHRoaXMsICdvbkRlc3Ryb3llZCcsICdvbkNyYXNoZWQnLCAnb25TaWNrJyk7XG5cbiAgICB0aGlzLndvcmtlcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5hY3RpdmVXb3JrZXIgPSBudWxsO1xuICAgIHRoaXMuY3JlYXRlTmV3V29ya2VyKCk7XG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlci5pc1JlYWR5KCk7XG4gIH1cblxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgdGhyb3cgbmV3IEVycm9yKCdXb3JrZXIgaXMgZGVzdHJveWVkJyk7IH1cbiAgICBsZXQgb3BlcmF0aW9uO1xuICAgIGNvbnN0IHJlcXVlc3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgb3BlcmF0aW9uID0gbmV3IE9wZXJhdGlvbihkYXRhLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlV29ya2VyLmV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKTtcbiAgICB9KTtcbiAgICBvcGVyYXRpb24uc2V0UHJvbWlzZShyZXF1ZXN0UHJvbWlzZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbmNlbDogKCkgPT4gdGhpcy5hY3RpdmVXb3JrZXIuY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbiksXG4gICAgICBwcm9taXNlOiByZXF1ZXN0UHJvbWlzZSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlTmV3V29ya2VyKHtvcGVyYXRpb25Db3VudExpbWl0fSA9IHtvcGVyYXRpb25Db3VudExpbWl0OiAxMH0pIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5hY3RpdmVXb3JrZXIgPSBuZXcgV29ya2VyKHtcbiAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQsXG4gICAgICBvbkRlc3Ryb3llZDogdGhpcy5vbkRlc3Ryb3llZCxcbiAgICAgIG9uQ3Jhc2hlZDogdGhpcy5vbkNyYXNoZWQsXG4gICAgICBvblNpY2s6IHRoaXMub25TaWNrLFxuICAgIH0pO1xuICAgIHRoaXMud29ya2Vycy5hZGQodGhpcy5hY3RpdmVXb3JrZXIpO1xuICB9XG5cbiAgb25EZXN0cm95ZWQoZGVzdHJveWVkV29ya2VyKSB7XG4gICAgdGhpcy53b3JrZXJzLmRlbGV0ZShkZXN0cm95ZWRXb3JrZXIpO1xuICB9XG5cbiAgb25DcmFzaGVkKGNyYXNoZWRXb3JrZXIpIHtcbiAgICBpZiAoY3Jhc2hlZFdvcmtlciA9PT0gdGhpcy5nZXRBY3RpdmVXb3JrZXIoKSkge1xuICAgICAgdGhpcy5jcmVhdGVOZXdXb3JrZXIoe29wZXJhdGlvbkNvdW50TGltaXQ6IGNyYXNoZWRXb3JrZXIuZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpfSk7XG4gICAgfVxuICAgIGNyYXNoZWRXb3JrZXIuZ2V0UmVtYWluaW5nT3BlcmF0aW9ucygpLmZvckVhY2gob3BlcmF0aW9uID0+IHRoaXMuYWN0aXZlV29ya2VyLmV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKSk7XG4gIH1cblxuICBvblNpY2soc2lja1dvcmtlcikge1xuICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oYFNpY2sgd29ya2VyIGRldGVjdGVkLlxuICAgICAgICBvcGVyYXRpb25Db3VudExpbWl0OiAke3NpY2tXb3JrZXIuZ2V0T3BlcmF0aW9uQ291bnRMaW1pdCgpfSxcbiAgICAgICAgY29tcGxldGVkIG9wZXJhdGlvbiBjb3VudDogJHtzaWNrV29ya2VyLmdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50KCl9YCk7XG4gICAgfVxuICAgIGNvbnN0IG9wZXJhdGlvbkNvdW50TGltaXQgPSB0aGlzLmNhbGN1bGF0ZU5ld09wZXJhdGlvbkNvdW50TGltaXQoc2lja1dvcmtlcik7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlTmV3V29ya2VyKHtvcGVyYXRpb25Db3VudExpbWl0fSk7XG4gIH1cblxuICBjYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0KGxhc3RXb3JrZXIpIHtcbiAgICBsZXQgb3BlcmF0aW9uQ291bnRMaW1pdCA9IDEwO1xuICAgIGlmIChsYXN0V29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKSA+PSBsYXN0V29ya2VyLmdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50KCkpIHtcbiAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQgPSBNYXRoLm1pbihsYXN0V29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKSAqIDIsIDEwMCk7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRpb25Db3VudExpbWl0O1xuICB9XG5cbiAgZ2V0QWN0aXZlV29ya2VyKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlcjtcbiAgfVxuXG4gIGdldFJlYWR5UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXIuZ2V0UmVhZHlQcm9taXNlKCk7XG4gIH1cblxuICBkZXN0cm95KGZvcmNlKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMud29ya2Vycy5mb3JFYWNoKHdvcmtlciA9PiB3b3JrZXIuZGVzdHJveShmb3JjZSkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFdvcmtlciB7XG4gIHN0YXRpYyBjaGFubmVsTmFtZSA9ICdnaXRodWI6cmVuZGVyZXItaXBjJztcblxuICBjb25zdHJ1Y3Rvcih7b3BlcmF0aW9uQ291bnRMaW1pdCwgb25TaWNrLCBvbkNyYXNoZWQsIG9uRGVzdHJveWVkfSkge1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdoYW5kbGVEYXRhUmVjZWl2ZWQnLCAnb25PcGVyYXRpb25Db21wbGV0ZScsICdoYW5kbGVDYW5jZWxsZWQnLCAnaGFuZGxlRXhlY1N0YXJ0ZWQnLCAnaGFuZGxlU3Bhd25FcnJvcicsXG4gICAgICAnaGFuZGxlU3RkaW5FcnJvcicsICdoYW5kbGVTaWNrJywgJ2hhbmRsZUNyYXNoZWQnLFxuICAgICk7XG5cbiAgICB0aGlzLm9wZXJhdGlvbkNvdW50TGltaXQgPSBvcGVyYXRpb25Db3VudExpbWl0O1xuICAgIHRoaXMub25TaWNrID0gb25TaWNrO1xuICAgIHRoaXMub25DcmFzaGVkID0gb25DcmFzaGVkO1xuICAgIHRoaXMub25EZXN0cm95ZWQgPSBvbkRlc3Ryb3llZDtcblxuICAgIHRoaXMub3BlcmF0aW9uc0J5SWQgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5jb21wbGV0ZWRPcGVyYXRpb25Db3VudCA9IDA7XG4gICAgdGhpcy5zaWNrID0gZmFsc2U7XG5cbiAgICB0aGlzLnJlbmRlcmVyUHJvY2VzcyA9IG5ldyBSZW5kZXJlclByb2Nlc3Moe1xuICAgICAgbG9hZFVybDogdGhpcy5nZXRMb2FkVXJsKG9wZXJhdGlvbkNvdW50TGltaXQpLFxuICAgICAgb25EYXRhOiB0aGlzLmhhbmRsZURhdGFSZWNlaXZlZCxcbiAgICAgIG9uQ2FuY2VsbGVkOiB0aGlzLmhhbmRsZUNhbmNlbGxlZCxcbiAgICAgIG9uRXhlY1N0YXJ0ZWQ6IHRoaXMuaGFuZGxlRXhlY1N0YXJ0ZWQsXG4gICAgICBvblNwYXduRXJyb3I6IHRoaXMuaGFuZGxlU3Bhd25FcnJvcixcbiAgICAgIG9uU3RkaW5FcnJvcjogdGhpcy5oYW5kbGVTdGRpbkVycm9yLFxuICAgICAgb25TaWNrOiB0aGlzLmhhbmRsZVNpY2ssXG4gICAgICBvbkNyYXNoZWQ6IHRoaXMuaGFuZGxlQ3Jhc2hlZCxcbiAgICAgIG9uRGVzdHJveWVkOiB0aGlzLmRlc3Ryb3ksXG4gICAgfSk7XG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5pc1JlYWR5KCk7XG4gIH1cblxuICBnZXRMb2FkVXJsKG9wZXJhdGlvbkNvdW50TGltaXQpIHtcbiAgICBjb25zdCBodG1sUGF0aCA9IHBhdGguam9pbihnZXRQYWNrYWdlUm9vdCgpLCAnbGliJywgJ3JlbmRlcmVyLmh0bWwnKTtcbiAgICBjb25zdCByZW5kZXJlckpzUGF0aCA9IHBhdGguam9pbihnZXRQYWNrYWdlUm9vdCgpLCAnbGliJywgJ3dvcmtlci5qcycpO1xuICAgIGNvbnN0IHFzID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHtcbiAgICAgIGpzOiByZW5kZXJlckpzUGF0aCxcbiAgICAgIG1hbmFnZXJXZWJDb250ZW50c0lkOiB0aGlzLmdldFdlYkNvbnRlbnRzSWQoKSxcbiAgICAgIG9wZXJhdGlvbkNvdW50TGltaXQsXG4gICAgICBjaGFubmVsTmFtZTogV29ya2VyLmNoYW5uZWxOYW1lLFxuICAgIH0pO1xuICAgIHJldHVybiBgZmlsZTovLyR7aHRtbFBhdGh9PyR7cXN9YDtcbiAgfVxuXG4gIGdldFdlYkNvbnRlbnRzSWQoKSB7XG4gICAgcmV0dXJuIHJlbW90ZS5nZXRDdXJyZW50V2ViQ29udGVudHMoKS5pZDtcbiAgfVxuXG4gIGV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgdGhpcy5vcGVyYXRpb25zQnlJZC5zZXQob3BlcmF0aW9uLmlkLCBvcGVyYXRpb24pO1xuICAgIG9wZXJhdGlvbi5vbkNvbXBsZXRlKHRoaXMub25PcGVyYXRpb25Db21wbGV0ZSk7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKTtcbiAgfVxuXG4gIGNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbik7XG4gIH1cblxuICBoYW5kbGVEYXRhUmVjZWl2ZWQoe2lkLCByZXN1bHRzfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uY29tcGxldGUocmVzdWx0cywgZGF0YSA9PiB7XG4gICAgICBjb25zdCB7dGltaW5nfSA9IGRhdGE7XG4gICAgICBjb25zdCB0b3RhbEludGVybmFsVGltZSA9IHRpbWluZy5leGVjVGltZSArIHRpbWluZy5zcGF3blRpbWU7XG4gICAgICBjb25zdCBpcGNUaW1lID0gb3BlcmF0aW9uLmdldEV4ZWN1dGlvblRpbWUoKSAtIHRvdGFsSW50ZXJuYWxUaW1lO1xuICAgICAgZGF0YS50aW1pbmcuaXBjVGltZSA9IGlwY1RpbWU7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uT3BlcmF0aW9uQ29tcGxldGUob3BlcmF0aW9uKSB7XG4gICAgdGhpcy5jb21wbGV0ZWRPcGVyYXRpb25Db3VudCsrO1xuICAgIHRoaXMub3BlcmF0aW9uc0J5SWQuZGVsZXRlKG9wZXJhdGlvbi5pZCk7XG5cbiAgICBpZiAodGhpcy5zaWNrICYmIHRoaXMub3BlcmF0aW9uc0J5SWQuc2l6ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2FuY2VsbGVkKHtpZH0pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgaWYgKG9wZXJhdGlvbikge1xuICAgICAgLy8gaGFuZGxlRGF0YVJlY2VpdmVkKCkgY2FuIGJlIHJlY2VpdmVkIGJlZm9yZSBoYW5kbGVDYW5jZWxsZWQoKVxuICAgICAgb3BlcmF0aW9uLndhc0NhbmNlbGxlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUV4ZWNTdGFydGVkKHtpZH0pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgb3BlcmF0aW9uLnNldEluUHJvZ3Jlc3MoKTtcbiAgfVxuXG4gIGhhbmRsZVNwYXduRXJyb3Ioe2lkLCBlcnJ9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgaGFuZGxlU3RkaW5FcnJvcih7aWQsIHN0ZGluLCBlcnJ9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgaGFuZGxlU2ljaygpIHtcbiAgICB0aGlzLnNpY2sgPSB0cnVlO1xuICAgIHRoaXMub25TaWNrKHRoaXMpO1xuICB9XG5cbiAgaGFuZGxlQ3Jhc2hlZCgpIHtcbiAgICB0aGlzLm9uQ3Jhc2hlZCh0aGlzKTtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldE9wZXJhdGlvbkNvdW50TGltaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlcmF0aW9uQ291bnRMaW1pdDtcbiAgfVxuXG4gIGdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmNvbXBsZXRlZE9wZXJhdGlvbkNvdW50O1xuICB9XG5cbiAgZ2V0UmVtYWluaW5nT3BlcmF0aW9ucygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLm9wZXJhdGlvbnNCeUlkLnZhbHVlcygpKTtcbiAgfVxuXG4gIGdldFBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuZ2V0UGlkKCk7XG4gIH1cblxuICBnZXRSZWFkeVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmdldFJlYWR5UHJvbWlzZSgpO1xuICB9XG5cbiAgYXN5bmMgZGVzdHJveShmb3JjZSkge1xuICAgIHRoaXMub25EZXN0cm95ZWQodGhpcyk7XG4gICAgaWYgKHRoaXMub3BlcmF0aW9uc0J5SWQuc2l6ZSA+IDAgJiYgIWZvcmNlKSB7XG4gICAgICBjb25zdCByZW1haW5pbmdPcGVyYXRpb25Qcm9taXNlcyA9IHRoaXMuZ2V0UmVtYWluaW5nT3BlcmF0aW9ucygpXG4gICAgICAgIC5tYXAob3BlcmF0aW9uID0+IG9wZXJhdGlvbi5nZXRQcm9taXNlKCkuY2F0Y2goKCkgPT4gbnVsbCkpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5kZXN0cm95KCk7XG4gIH1cbn1cblxuXG4vKlxuU2VuZHMgb3BlcmF0aW9ucyB0byByZW5kZXJlciBwcm9jZXNzZXNcbiovXG5leHBvcnQgY2xhc3MgUmVuZGVyZXJQcm9jZXNzIHtcbiAgY29uc3RydWN0b3Ioe2xvYWRVcmwsXG4gICAgb25EZXN0cm95ZWQsIG9uQ3Jhc2hlZCwgb25TaWNrLCBvbkRhdGEsIG9uQ2FuY2VsbGVkLCBvblNwYXduRXJyb3IsIG9uU3RkaW5FcnJvciwgb25FeGVjU3RhcnRlZH0pIHtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlRGVzdHJveScpO1xuICAgIHRoaXMub25EZXN0cm95ZWQgPSBvbkRlc3Ryb3llZDtcbiAgICB0aGlzLm9uQ3Jhc2hlZCA9IG9uQ3Jhc2hlZDtcbiAgICB0aGlzLm9uU2ljayA9IG9uU2ljaztcbiAgICB0aGlzLm9uRGF0YSA9IG9uRGF0YTtcbiAgICB0aGlzLm9uQ2FuY2VsbGVkID0gb25DYW5jZWxsZWQ7XG4gICAgdGhpcy5vblNwYXduRXJyb3IgPSBvblNwYXduRXJyb3I7XG4gICAgdGhpcy5vblN0ZGluRXJyb3IgPSBvblN0ZGluRXJyb3I7XG4gICAgdGhpcy5vbkV4ZWNTdGFydGVkID0gb25FeGVjU3RhcnRlZDtcblxuICAgIHRoaXMud2luID0gbmV3IEJyb3dzZXJXaW5kb3coe3Nob3c6ICEhcHJvY2Vzcy5lbnYuQVRPTV9HSVRIVUJfU0hPV19SRU5ERVJFUl9XSU5ET1csXG4gICAgICB3ZWJQcmVmZXJlbmNlczoge25vZGVJbnRlZ3JhdGlvbjogdHJ1ZSwgZW5hYmxlUmVtb3RlTW9kdWxlOiB0cnVlfX0pO1xuICAgIHRoaXMud2ViQ29udGVudHMgPSB0aGlzLndpbi53ZWJDb250ZW50cztcbiAgICAvLyB0aGlzLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgIHRoaXMud2luLmxvYWRVUkwobG9hZFVybCk7XG4gICAgdGhpcy53aW4ud2ViQ29udGVudHMub24oJ2NyYXNoZWQnLCB0aGlzLmhhbmRsZURlc3Ryb3kpO1xuICAgIHRoaXMud2luLndlYkNvbnRlbnRzLm9uKCdkZXN0cm95ZWQnLCB0aGlzLmhhbmRsZURlc3Ryb3kpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy53aW4uaXNEZXN0cm95ZWQoKSkge1xuICAgICAgICAgIHRoaXMud2luLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdjcmFzaGVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICAgICAgICB0aGlzLndpbi53ZWJDb250ZW50cy5yZW1vdmVMaXN0ZW5lcignZGVzdHJveWVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICAgICAgICB0aGlzLndpbi5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5lbWl0dGVyLFxuICAgICk7XG5cbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5yZWFkeVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHsgdGhpcy5yZXNvbHZlUmVhZHkgPSByZXNvbHZlOyB9KTtcbiAgfVxuXG4gIGlzUmVhZHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHk7XG4gIH1cblxuICBoYW5kbGVEZXN0cm95KC4uLmFyZ3MpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB0aGlzLm9uQ3Jhc2hlZCguLi5hcmdzKTtcbiAgfVxuXG4gIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGhhbmRsZU1lc3NhZ2VzID0gKGV2ZW50LCB7c291cmNlV2ViQ29udGVudHNJZCwgdHlwZSwgZGF0YX0pID0+IHtcbiAgICAgIGlmIChzb3VyY2VXZWJDb250ZW50c0lkID09PSB0aGlzLndpbi53ZWJDb250ZW50cy5pZCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCh0eXBlLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaXBjLm9uKFdvcmtlci5jaGFubmVsTmFtZSwgaGFuZGxlTWVzc2FnZXMpO1xuICAgIHRoaXMuZW1pdHRlci5vbigncmVuZGVyZXItcmVhZHknLCAoe3BpZH0pID0+IHtcbiAgICAgIHRoaXMucGlkID0gcGlkO1xuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLnJlc29sdmVSZWFkeSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LWRhdGEnLCB0aGlzLm9uRGF0YSk7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtY2FuY2VsbGVkJywgdGhpcy5vbkNhbmNlbGxlZCk7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtc3Bhd24tZXJyb3InLCB0aGlzLm9uU3Bhd25FcnJvcik7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdnaXQtc3RkaW4tZXJyb3InLCB0aGlzLm9uU3RkaW5FcnJvcik7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdzbG93LXNwYXducycsIHRoaXMub25TaWNrKTtcblxuICAgIC8vIG5vdCBjdXJyZW50bHkgdXNlZCB0byBhdm9pZCBjbG9nZ2luZyB1cCBpcGMgY2hhbm5lbFxuICAgIC8vIGtlZXBpbmcgaXQgYXJvdW5kIGFzIGl0J3MgcG90ZW50aWFsbHkgdXNlZnVsIGZvciBhdm9pZGluZyBkdXBsaWNhdGUgd3JpdGUgb3BlcmF0aW9ucyB1cG9uIHJlbmRlcmVyIGNyYXNoaW5nXG4gICAgdGhpcy5lbWl0dGVyLm9uKCdleGVjLXN0YXJ0ZWQnLCB0aGlzLm9uRXhlY1N0YXJ0ZWQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IGlwYy5yZW1vdmVMaXN0ZW5lcihXb3JrZXIuY2hhbm5lbE5hbWUsIGhhbmRsZU1lc3NhZ2VzKSksXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGVPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvbi5leGVjdXRlKHBheWxvYWQgPT4ge1xuICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiBudWxsOyB9XG4gICAgICByZXR1cm4gdGhpcy53ZWJDb250ZW50cy5zZW5kKFdvcmtlci5jaGFubmVsTmFtZSwge1xuICAgICAgICB0eXBlOiAnZ2l0LWV4ZWMnLFxuICAgICAgICBkYXRhOiBwYXlsb2FkLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYW5jZWxPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvbi5jYW5jZWwocGF5bG9hZCA9PiB7XG4gICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIHJldHVybiB0aGlzLndlYkNvbnRlbnRzLnNlbmQoV29ya2VyLmNoYW5uZWxOYW1lLCB7XG4gICAgICAgIHR5cGU6ICdnaXQtY2FuY2VsJyxcbiAgICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGlkKCkge1xuICAgIHJldHVybiB0aGlzLnBpZDtcbiAgfVxuXG4gIGdldFJlYWR5UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeVByb21pc2U7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIE9wZXJhdGlvbiB7XG4gIHN0YXRpYyBzdGF0dXMgPSB7XG4gICAgUEVORElORzogU3ltYm9sKCdwZW5kaW5nJyksXG4gICAgSU5QUk9HUkVTUzogU3ltYm9sKCdpbi1wcm9ncmVzcycpLFxuICAgIENPTVBMRVRFOiBTeW1ib2woJ2NvbXBsZXRlJyksXG4gICAgQ0FOQ0VMTElORzogU3ltYm9sKCdjYW5jZWxsaW5nJyksXG4gICAgQ0FOQ0VMTEVEOiBTeW1ib2woJ2NhbmNlbGVkJyksXG4gIH1cblxuICBzdGF0aWMgaWQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGEsIHJlc29sdmUsIHJlamVjdCkge1xuICAgIHRoaXMuaWQgPSBPcGVyYXRpb24uaWQrKztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgdGhpcy5wcm9taXNlID0gbnVsbDtcbiAgICB0aGlzLmNhbmNlbGxhdGlvblJlc29sdmUgPSAoKSA9PiB7fTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5lbmRUaW1lID0gbnVsbDtcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuUEVORElORztcbiAgICB0aGlzLnJlc3VsdHMgPSBudWxsO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gIH1cblxuICBvbkNvbXBsZXRlKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignY29tcGxldGUnLCBjYik7XG4gIH1cblxuICBzZXRQcm9taXNlKHByb21pc2UpIHtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICB9XG5cbiAgZ2V0UHJvbWlzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlO1xuICB9XG5cbiAgc2V0SW5Qcm9ncmVzcygpIHtcbiAgICAvLyBhZnRlciBleGVjIGhhcyBiZWVuIGNhbGxlZCBidXQgYmVmb3JlIHJlc3VsdHMgYSByZWNlaXZlZFxuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5JTlBST0dSRVNTO1xuICB9XG5cbiAgZ2V0RXhlY3V0aW9uVGltZSgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRUaW1lIHx8ICF0aGlzLmVuZFRpbWUpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZFRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZShyZXN1bHRzLCBtdXRhdGUgPSBkYXRhID0+IGRhdGEpIHtcbiAgICB0aGlzLmVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzO1xuICAgIHRoaXMucmVzb2x2ZShtdXRhdGUocmVzdWx0cykpO1xuICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSgpO1xuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5DT01QTEVURTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY29tcGxldGUnLCB0aGlzKTtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgd2FzQ2FuY2VsbGVkKCkge1xuICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5DQU5DRUxMRUQ7XG4gICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlKCk7XG4gIH1cblxuICBlcnJvcihyZXN1bHRzKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKHJlc3VsdHMubWVzc2FnZSwgcmVzdWx0cy5maWxlTmFtZSwgcmVzdWx0cy5saW5lTnVtYmVyKTtcbiAgICBlcnIuc3RhY2sgPSByZXN1bHRzLnN0YWNrO1xuICAgIHRoaXMucmVqZWN0KGVycik7XG4gIH1cblxuICBleGVjdXRlKGV4ZWNGbikge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIGV4ZWNGbih7Li4udGhpcy5kYXRhLCBpZDogdGhpcy5pZH0pO1xuICB9XG5cbiAgY2FuY2VsKGV4ZWNGbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzID0gT3BlcmF0aW9uLnN0YXR1cy5DQU5DRUxMSU5HO1xuICAgICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGV4ZWNGbih7aWQ6IHRoaXMuaWR9KTtcbiAg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