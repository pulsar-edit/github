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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const remote = require('@electron/remote');
const {
  BrowserWindow
} = remote;
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
    return remote.getCurrentWebContents().id;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3F1ZXJ5c3RyaW5nIiwiX2VsZWN0cm9uIiwiX2V2ZW50S2l0IiwiX2hlbHBlcnMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwiciIsInQiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsInZhbHVlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiU3RyaW5nIiwiTnVtYmVyIiwicmVtb3RlIiwiQnJvd3NlcldpbmRvdyIsIldvcmtlck1hbmFnZXIiLCJnZXRJbnN0YW5jZSIsImluc3RhbmNlIiwicmVzZXQiLCJmb3JjZSIsImRlc3Ryb3kiLCJjb25zdHJ1Y3RvciIsImF1dG9iaW5kIiwid29ya2VycyIsIlNldCIsImFjdGl2ZVdvcmtlciIsImNyZWF0ZU5ld1dvcmtlciIsImlzUmVhZHkiLCJyZXF1ZXN0IiwiZGF0YSIsImRlc3Ryb3llZCIsIkVycm9yIiwib3BlcmF0aW9uIiwicmVxdWVzdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIk9wZXJhdGlvbiIsImV4ZWN1dGVPcGVyYXRpb24iLCJzZXRQcm9taXNlIiwiY2FuY2VsIiwiY2FuY2VsT3BlcmF0aW9uIiwicHJvbWlzZSIsIm9wZXJhdGlvbkNvdW50TGltaXQiLCJXb3JrZXIiLCJvbkRlc3Ryb3llZCIsIm9uQ3Jhc2hlZCIsIm9uU2ljayIsImFkZCIsImRlc3Ryb3llZFdvcmtlciIsImRlbGV0ZSIsImNyYXNoZWRXb3JrZXIiLCJnZXRBY3RpdmVXb3JrZXIiLCJnZXRPcGVyYXRpb25Db3VudExpbWl0IiwiZ2V0UmVtYWluaW5nT3BlcmF0aW9ucyIsInNpY2tXb3JrZXIiLCJhdG9tIiwiaW5TcGVjTW9kZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0Q29tcGxldGVkT3BlcmF0aW9uQ291bnQiLCJjYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0IiwibGFzdFdvcmtlciIsIk1hdGgiLCJtaW4iLCJnZXRSZWFkeVByb21pc2UiLCJ3b3JrZXIiLCJleHBvcnRzIiwib3BlcmF0aW9uc0J5SWQiLCJNYXAiLCJjb21wbGV0ZWRPcGVyYXRpb25Db3VudCIsInNpY2siLCJyZW5kZXJlclByb2Nlc3MiLCJSZW5kZXJlclByb2Nlc3MiLCJsb2FkVXJsIiwiZ2V0TG9hZFVybCIsIm9uRGF0YSIsImhhbmRsZURhdGFSZWNlaXZlZCIsIm9uQ2FuY2VsbGVkIiwiaGFuZGxlQ2FuY2VsbGVkIiwib25FeGVjU3RhcnRlZCIsImhhbmRsZUV4ZWNTdGFydGVkIiwib25TcGF3bkVycm9yIiwiaGFuZGxlU3Bhd25FcnJvciIsIm9uU3RkaW5FcnJvciIsImhhbmRsZVN0ZGluRXJyb3IiLCJoYW5kbGVTaWNrIiwiaGFuZGxlQ3Jhc2hlZCIsImh0bWxQYXRoIiwicGF0aCIsImpvaW4iLCJnZXRQYWNrYWdlUm9vdCIsInJlbmRlcmVySnNQYXRoIiwicXMiLCJxdWVyeXN0cmluZyIsInN0cmluZ2lmeSIsImpzIiwibWFuYWdlcldlYkNvbnRlbnRzSWQiLCJnZXRXZWJDb250ZW50c0lkIiwiY2hhbm5lbE5hbWUiLCJnZXRDdXJyZW50V2ViQ29udGVudHMiLCJpZCIsInNldCIsIm9uQ29tcGxldGUiLCJvbk9wZXJhdGlvbkNvbXBsZXRlIiwicmVzdWx0cyIsImdldCIsImNvbXBsZXRlIiwidGltaW5nIiwidG90YWxJbnRlcm5hbFRpbWUiLCJleGVjVGltZSIsInNwYXduVGltZSIsImlwY1RpbWUiLCJnZXRFeGVjdXRpb25UaW1lIiwic2l6ZSIsIndhc0NhbmNlbGxlZCIsInNldEluUHJvZ3Jlc3MiLCJlcnIiLCJlcnJvciIsInN0ZGluIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwiZ2V0UGlkIiwicmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMiLCJtYXAiLCJnZXRQcm9taXNlIiwiY2F0Y2giLCJhbGwiLCJ3aW4iLCJzaG93IiwicHJvY2VzcyIsImVudiIsIkFUT01fR0lUSFVCX1NIT1dfUkVOREVSRVJfV0lORE9XIiwid2ViUHJlZmVyZW5jZXMiLCJub2RlSW50ZWdyYXRpb24iLCJlbmFibGVSZW1vdGVNb2R1bGUiLCJ3ZWJDb250ZW50cyIsImVtaXR0ZXIiLCJFbWl0dGVyIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZWdpc3Rlckxpc3RlbmVycyIsImxvYWRVUkwiLCJvbiIsImhhbmRsZURlc3Ryb3kiLCJEaXNwb3NhYmxlIiwiaXNEZXN0cm95ZWQiLCJyZW1vdmVMaXN0ZW5lciIsInJlYWR5IiwicmVhZHlQcm9taXNlIiwicmVzb2x2ZVJlYWR5IiwiYXJncyIsImhhbmRsZU1lc3NhZ2VzIiwiZXZlbnQiLCJzb3VyY2VXZWJDb250ZW50c0lkIiwidHlwZSIsImVtaXQiLCJpcGMiLCJwaWQiLCJleGVjdXRlIiwicGF5bG9hZCIsInNlbmQiLCJkaXNwb3NlIiwiY2FuY2VsbGF0aW9uUmVzb2x2ZSIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJzdGF0dXMiLCJQRU5ESU5HIiwiY2IiLCJJTlBST0dSRVNTIiwiTmFOIiwibXV0YXRlIiwicGVyZm9ybWFuY2UiLCJub3ciLCJDT01QTEVURSIsIkNBTkNFTExFRCIsIm1lc3NhZ2UiLCJmaWxlTmFtZSIsImxpbmVOdW1iZXIiLCJzdGFjayIsImV4ZWNGbiIsIkNBTkNFTExJTkciXSwic291cmNlcyI6WyJ3b3JrZXItbWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBxdWVyeXN0cmluZyBmcm9tICdxdWVyeXN0cmluZyc7XG5cbmltcG9ydCB7aXBjUmVuZGVyZXIgYXMgaXBjfSBmcm9tICdlbGVjdHJvbic7XG5jb25zdCByZW1vdGUgPSByZXF1aXJlKCdAZWxlY3Ryb24vcmVtb3RlJyk7XG5jb25zdCB7QnJvd3NlcldpbmRvd30gPSByZW1vdGU7XG5pbXBvcnQge0VtaXR0ZXIsIERpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7Z2V0UGFja2FnZVJvb3QsIGF1dG9iaW5kfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZXJNYW5hZ2VyIHtcbiAgc3RhdGljIGluc3RhbmNlID0gbnVsbDtcblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IFdvcmtlck1hbmFnZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cblxuICBzdGF0aWMgcmVzZXQoZm9yY2UpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkgeyB0aGlzLmluc3RhbmNlLmRlc3Ryb3koZm9yY2UpOyB9XG4gICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBhdXRvYmluZCh0aGlzLCAnb25EZXN0cm95ZWQnLCAnb25DcmFzaGVkJywgJ29uU2ljaycpO1xuXG4gICAgdGhpcy53b3JrZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuYWN0aXZlV29ya2VyID0gbnVsbDtcbiAgICB0aGlzLmNyZWF0ZU5ld1dvcmtlcigpO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXIuaXNSZWFkeSgpO1xuICB9XG5cbiAgcmVxdWVzdChkYXRhKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHRocm93IG5ldyBFcnJvcignV29ya2VyIGlzIGRlc3Ryb3llZCcpOyB9XG4gICAgbGV0IG9wZXJhdGlvbjtcbiAgICBjb25zdCByZXF1ZXN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIG9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb24oZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlci5leGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbik7XG4gICAgfSk7XG4gICAgb3BlcmF0aW9uLnNldFByb21pc2UocmVxdWVzdFByb21pc2UpO1xuICAgIHJldHVybiB7XG4gICAgICBjYW5jZWw6ICgpID0+IHRoaXMuYWN0aXZlV29ya2VyLmNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pLFxuICAgICAgcHJvbWlzZTogcmVxdWVzdFByb21pc2UsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZU5ld1dvcmtlcih7b3BlcmF0aW9uQ291bnRMaW1pdH0gPSB7b3BlcmF0aW9uQ291bnRMaW1pdDogMTB9KSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybjsgfVxuICAgIHRoaXMuYWN0aXZlV29ya2VyID0gbmV3IFdvcmtlcih7XG4gICAgICBvcGVyYXRpb25Db3VudExpbWl0LFxuICAgICAgb25EZXN0cm95ZWQ6IHRoaXMub25EZXN0cm95ZWQsXG4gICAgICBvbkNyYXNoZWQ6IHRoaXMub25DcmFzaGVkLFxuICAgICAgb25TaWNrOiB0aGlzLm9uU2ljayxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtlcnMuYWRkKHRoaXMuYWN0aXZlV29ya2VyKTtcbiAgfVxuXG4gIG9uRGVzdHJveWVkKGRlc3Ryb3llZFdvcmtlcikge1xuICAgIHRoaXMud29ya2Vycy5kZWxldGUoZGVzdHJveWVkV29ya2VyKTtcbiAgfVxuXG4gIG9uQ3Jhc2hlZChjcmFzaGVkV29ya2VyKSB7XG4gICAgaWYgKGNyYXNoZWRXb3JrZXIgPT09IHRoaXMuZ2V0QWN0aXZlV29ya2VyKCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlTmV3V29ya2VyKHtvcGVyYXRpb25Db3VudExpbWl0OiBjcmFzaGVkV29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKX0pO1xuICAgIH1cbiAgICBjcmFzaGVkV29ya2VyLmdldFJlbWFpbmluZ09wZXJhdGlvbnMoKS5mb3JFYWNoKG9wZXJhdGlvbiA9PiB0aGlzLmFjdGl2ZVdvcmtlci5leGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbikpO1xuICB9XG5cbiAgb25TaWNrKHNpY2tXb3JrZXIpIHtcbiAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBTaWNrIHdvcmtlciBkZXRlY3RlZC5cbiAgICAgICAgb3BlcmF0aW9uQ291bnRMaW1pdDogJHtzaWNrV29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKX0sXG4gICAgICAgIGNvbXBsZXRlZCBvcGVyYXRpb24gY291bnQ6ICR7c2lja1dvcmtlci5nZXRDb21wbGV0ZWRPcGVyYXRpb25Db3VudCgpfWApO1xuICAgIH1cbiAgICBjb25zdCBvcGVyYXRpb25Db3VudExpbWl0ID0gdGhpcy5jYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0KHNpY2tXb3JrZXIpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZU5ld1dvcmtlcih7b3BlcmF0aW9uQ291bnRMaW1pdH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlTmV3T3BlcmF0aW9uQ291bnRMaW1pdChsYXN0V29ya2VyKSB7XG4gICAgbGV0IG9wZXJhdGlvbkNvdW50TGltaXQgPSAxMDtcbiAgICBpZiAobGFzdFdvcmtlci5nZXRPcGVyYXRpb25Db3VudExpbWl0KCkgPj0gbGFzdFdvcmtlci5nZXRDb21wbGV0ZWRPcGVyYXRpb25Db3VudCgpKSB7XG4gICAgICBvcGVyYXRpb25Db3VudExpbWl0ID0gTWF0aC5taW4obGFzdFdvcmtlci5nZXRPcGVyYXRpb25Db3VudExpbWl0KCkgKiAyLCAxMDApO1xuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9uQ291bnRMaW1pdDtcbiAgfVxuXG4gIGdldEFjdGl2ZVdvcmtlcigpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXI7XG4gIH1cblxuICBnZXRSZWFkeVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29ya2VyLmdldFJlYWR5UHJvbWlzZSgpO1xuICB9XG5cbiAgZGVzdHJveShmb3JjZSkge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLndvcmtlcnMuZm9yRWFjaCh3b3JrZXIgPT4gd29ya2VyLmRlc3Ryb3koZm9yY2UpKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBXb3JrZXIge1xuICBzdGF0aWMgY2hhbm5lbE5hbWUgPSAnZ2l0aHViOnJlbmRlcmVyLWlwYyc7XG5cbiAgY29uc3RydWN0b3Ioe29wZXJhdGlvbkNvdW50TGltaXQsIG9uU2ljaywgb25DcmFzaGVkLCBvbkRlc3Ryb3llZH0pIHtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnaGFuZGxlRGF0YVJlY2VpdmVkJywgJ29uT3BlcmF0aW9uQ29tcGxldGUnLCAnaGFuZGxlQ2FuY2VsbGVkJywgJ2hhbmRsZUV4ZWNTdGFydGVkJywgJ2hhbmRsZVNwYXduRXJyb3InLFxuICAgICAgJ2hhbmRsZVN0ZGluRXJyb3InLCAnaGFuZGxlU2ljaycsICdoYW5kbGVDcmFzaGVkJyxcbiAgICApO1xuXG4gICAgdGhpcy5vcGVyYXRpb25Db3VudExpbWl0ID0gb3BlcmF0aW9uQ291bnRMaW1pdDtcbiAgICB0aGlzLm9uU2ljayA9IG9uU2ljaztcbiAgICB0aGlzLm9uQ3Jhc2hlZCA9IG9uQ3Jhc2hlZDtcbiAgICB0aGlzLm9uRGVzdHJveWVkID0gb25EZXN0cm95ZWQ7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnNCeUlkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuY29tcGxldGVkT3BlcmF0aW9uQ291bnQgPSAwO1xuICAgIHRoaXMuc2ljayA9IGZhbHNlO1xuXG4gICAgdGhpcy5yZW5kZXJlclByb2Nlc3MgPSBuZXcgUmVuZGVyZXJQcm9jZXNzKHtcbiAgICAgIGxvYWRVcmw6IHRoaXMuZ2V0TG9hZFVybChvcGVyYXRpb25Db3VudExpbWl0KSxcbiAgICAgIG9uRGF0YTogdGhpcy5oYW5kbGVEYXRhUmVjZWl2ZWQsXG4gICAgICBvbkNhbmNlbGxlZDogdGhpcy5oYW5kbGVDYW5jZWxsZWQsXG4gICAgICBvbkV4ZWNTdGFydGVkOiB0aGlzLmhhbmRsZUV4ZWNTdGFydGVkLFxuICAgICAgb25TcGF3bkVycm9yOiB0aGlzLmhhbmRsZVNwYXduRXJyb3IsXG4gICAgICBvblN0ZGluRXJyb3I6IHRoaXMuaGFuZGxlU3RkaW5FcnJvcixcbiAgICAgIG9uU2ljazogdGhpcy5oYW5kbGVTaWNrLFxuICAgICAgb25DcmFzaGVkOiB0aGlzLmhhbmRsZUNyYXNoZWQsXG4gICAgICBvbkRlc3Ryb3llZDogdGhpcy5kZXN0cm95LFxuICAgIH0pO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuaXNSZWFkeSgpO1xuICB9XG5cbiAgZ2V0TG9hZFVybChvcGVyYXRpb25Db3VudExpbWl0KSB7XG4gICAgY29uc3QgaHRtbFBhdGggPSBwYXRoLmpvaW4oZ2V0UGFja2FnZVJvb3QoKSwgJ2xpYicsICdyZW5kZXJlci5odG1sJyk7XG4gICAgY29uc3QgcmVuZGVyZXJKc1BhdGggPSBwYXRoLmpvaW4oZ2V0UGFja2FnZVJvb3QoKSwgJ2xpYicsICd3b3JrZXIuanMnKTtcbiAgICBjb25zdCBxcyA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh7XG4gICAgICBqczogcmVuZGVyZXJKc1BhdGgsXG4gICAgICBtYW5hZ2VyV2ViQ29udGVudHNJZDogdGhpcy5nZXRXZWJDb250ZW50c0lkKCksXG4gICAgICBvcGVyYXRpb25Db3VudExpbWl0LFxuICAgICAgY2hhbm5lbE5hbWU6IFdvcmtlci5jaGFubmVsTmFtZSxcbiAgICB9KTtcbiAgICByZXR1cm4gYGZpbGU6Ly8ke2h0bWxQYXRofT8ke3FzfWA7XG4gIH1cblxuICBnZXRXZWJDb250ZW50c0lkKCkge1xuICAgIHJldHVybiByZW1vdGUuZ2V0Q3VycmVudFdlYkNvbnRlbnRzKCkuaWQ7XG4gIH1cblxuICBleGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHRoaXMub3BlcmF0aW9uc0J5SWQuc2V0KG9wZXJhdGlvbi5pZCwgb3BlcmF0aW9uKTtcbiAgICBvcGVyYXRpb24ub25Db21wbGV0ZSh0aGlzLm9uT3BlcmF0aW9uQ29tcGxldGUpO1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5leGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbik7XG4gIH1cblxuICBjYW5jZWxPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pO1xuICB9XG5cbiAgaGFuZGxlRGF0YVJlY2VpdmVkKHtpZCwgcmVzdWx0c30pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgb3BlcmF0aW9uLmNvbXBsZXRlKHJlc3VsdHMsIGRhdGEgPT4ge1xuICAgICAgY29uc3Qge3RpbWluZ30gPSBkYXRhO1xuICAgICAgY29uc3QgdG90YWxJbnRlcm5hbFRpbWUgPSB0aW1pbmcuZXhlY1RpbWUgKyB0aW1pbmcuc3Bhd25UaW1lO1xuICAgICAgY29uc3QgaXBjVGltZSA9IG9wZXJhdGlvbi5nZXRFeGVjdXRpb25UaW1lKCkgLSB0b3RhbEludGVybmFsVGltZTtcbiAgICAgIGRhdGEudGltaW5nLmlwY1RpbWUgPSBpcGNUaW1lO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBvbk9wZXJhdGlvbkNvbXBsZXRlKG9wZXJhdGlvbikge1xuICAgIHRoaXMuY29tcGxldGVkT3BlcmF0aW9uQ291bnQrKztcbiAgICB0aGlzLm9wZXJhdGlvbnNCeUlkLmRlbGV0ZShvcGVyYXRpb24uaWQpO1xuXG4gICAgaWYgKHRoaXMuc2ljayAmJiB0aGlzLm9wZXJhdGlvbnNCeUlkLnNpemUgPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNhbmNlbGxlZCh7aWR9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIGlmIChvcGVyYXRpb24pIHtcbiAgICAgIC8vIGhhbmRsZURhdGFSZWNlaXZlZCgpIGNhbiBiZSByZWNlaXZlZCBiZWZvcmUgaGFuZGxlQ2FuY2VsbGVkKClcbiAgICAgIG9wZXJhdGlvbi53YXNDYW5jZWxsZWQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFeGVjU3RhcnRlZCh7aWR9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5zZXRJblByb2dyZXNzKCk7XG4gIH1cblxuICBoYW5kbGVTcGF3bkVycm9yKHtpZCwgZXJyfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIGhhbmRsZVN0ZGluRXJyb3Ioe2lkLCBzdGRpbiwgZXJyfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIGhhbmRsZVNpY2soKSB7XG4gICAgdGhpcy5zaWNrID0gdHJ1ZTtcbiAgICB0aGlzLm9uU2ljayh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNyYXNoZWQoKSB7XG4gICAgdGhpcy5vbkNyYXNoZWQodGhpcyk7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBnZXRPcGVyYXRpb25Db3VudExpbWl0KCkge1xuICAgIHJldHVybiB0aGlzLm9wZXJhdGlvbkNvdW50TGltaXQ7XG4gIH1cblxuICBnZXRDb21wbGV0ZWRPcGVyYXRpb25Db3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21wbGV0ZWRPcGVyYXRpb25Db3VudDtcbiAgfVxuXG4gIGdldFJlbWFpbmluZ09wZXJhdGlvbnMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5vcGVyYXRpb25zQnlJZC52YWx1ZXMoKSk7XG4gIH1cblxuICBnZXRQaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmdldFBpZCgpO1xuICB9XG5cbiAgZ2V0UmVhZHlQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5nZXRSZWFkeVByb21pc2UoKTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koZm9yY2UpIHtcbiAgICB0aGlzLm9uRGVzdHJveWVkKHRoaXMpO1xuICAgIGlmICh0aGlzLm9wZXJhdGlvbnNCeUlkLnNpemUgPiAwICYmICFmb3JjZSkge1xuICAgICAgY29uc3QgcmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMgPSB0aGlzLmdldFJlbWFpbmluZ09wZXJhdGlvbnMoKVxuICAgICAgICAubWFwKG9wZXJhdGlvbiA9PiBvcGVyYXRpb24uZ2V0UHJvbWlzZSgpLmNhdGNoKCgpID0+IG51bGwpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHJlbWFpbmluZ09wZXJhdGlvblByb21pc2VzKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlclByb2Nlc3MuZGVzdHJveSgpO1xuICB9XG59XG5cblxuLypcblNlbmRzIG9wZXJhdGlvbnMgdG8gcmVuZGVyZXIgcHJvY2Vzc2VzXG4qL1xuZXhwb3J0IGNsYXNzIFJlbmRlcmVyUHJvY2VzcyB7XG4gIGNvbnN0cnVjdG9yKHtsb2FkVXJsLFxuICAgIG9uRGVzdHJveWVkLCBvbkNyYXNoZWQsIG9uU2ljaywgb25EYXRhLCBvbkNhbmNlbGxlZCwgb25TcGF3bkVycm9yLCBvblN0ZGluRXJyb3IsIG9uRXhlY1N0YXJ0ZWR9KSB7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZURlc3Ryb3knKTtcbiAgICB0aGlzLm9uRGVzdHJveWVkID0gb25EZXN0cm95ZWQ7XG4gICAgdGhpcy5vbkNyYXNoZWQgPSBvbkNyYXNoZWQ7XG4gICAgdGhpcy5vblNpY2sgPSBvblNpY2s7XG4gICAgdGhpcy5vbkRhdGEgPSBvbkRhdGE7XG4gICAgdGhpcy5vbkNhbmNlbGxlZCA9IG9uQ2FuY2VsbGVkO1xuICAgIHRoaXMub25TcGF3bkVycm9yID0gb25TcGF3bkVycm9yO1xuICAgIHRoaXMub25TdGRpbkVycm9yID0gb25TdGRpbkVycm9yO1xuICAgIHRoaXMub25FeGVjU3RhcnRlZCA9IG9uRXhlY1N0YXJ0ZWQ7XG5cbiAgICB0aGlzLndpbiA9IG5ldyBCcm93c2VyV2luZG93KHtzaG93OiAhIXByb2Nlc3MuZW52LkFUT01fR0lUSFVCX1NIT1dfUkVOREVSRVJfV0lORE9XLFxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtub2RlSW50ZWdyYXRpb246IHRydWUsIGVuYWJsZVJlbW90ZU1vZHVsZTogdHJ1ZX19KTtcbiAgICB0aGlzLndlYkNvbnRlbnRzID0gdGhpcy53aW4ud2ViQ29udGVudHM7XG4gICAgLy8gdGhpcy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICB0aGlzLndpbi5sb2FkVVJMKGxvYWRVcmwpO1xuICAgIHRoaXMud2luLndlYkNvbnRlbnRzLm9uKCdjcmFzaGVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICB0aGlzLndpbi53ZWJDb250ZW50cy5vbignZGVzdHJveWVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMud2luLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICB0aGlzLndpbi53ZWJDb250ZW50cy5yZW1vdmVMaXN0ZW5lcignY3Jhc2hlZCcsIHRoaXMuaGFuZGxlRGVzdHJveSk7XG4gICAgICAgICAgdGhpcy53aW4ud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2Rlc3Ryb3llZCcsIHRoaXMuaGFuZGxlRGVzdHJveSk7XG4gICAgICAgICAgdGhpcy53aW4uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZW1pdHRlcixcbiAgICApO1xuXG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMucmVhZHlQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7IHRoaXMucmVzb2x2ZVJlYWR5ID0gcmVzb2x2ZTsgfSk7XG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5O1xuICB9XG5cbiAgaGFuZGxlRGVzdHJveSguLi5hcmdzKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgdGhpcy5vbkNyYXNoZWQoLi4uYXJncyk7XG4gIH1cblxuICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICBjb25zdCBoYW5kbGVNZXNzYWdlcyA9IChldmVudCwge3NvdXJjZVdlYkNvbnRlbnRzSWQsIHR5cGUsIGRhdGF9KSA9PiB7XG4gICAgICBpZiAoc291cmNlV2ViQ29udGVudHNJZCA9PT0gdGhpcy53aW4ud2ViQ29udGVudHMuaWQpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQodHlwZSwgZGF0YSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlwYy5vbihXb3JrZXIuY2hhbm5lbE5hbWUsIGhhbmRsZU1lc3NhZ2VzKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3JlbmRlcmVyLXJlYWR5JywgKHtwaWR9KSA9PiB7XG4gICAgICB0aGlzLnBpZCA9IHBpZDtcbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgdGhpcy5yZXNvbHZlUmVhZHkoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2dpdC1kYXRhJywgdGhpcy5vbkRhdGEpO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LWNhbmNlbGxlZCcsIHRoaXMub25DYW5jZWxsZWQpO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LXNwYXduLWVycm9yJywgdGhpcy5vblNwYXduRXJyb3IpO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LXN0ZGluLWVycm9yJywgdGhpcy5vblN0ZGluRXJyb3IpO1xuICAgIHRoaXMuZW1pdHRlci5vbignc2xvdy1zcGF3bnMnLCB0aGlzLm9uU2ljayk7XG5cbiAgICAvLyBub3QgY3VycmVudGx5IHVzZWQgdG8gYXZvaWQgY2xvZ2dpbmcgdXAgaXBjIGNoYW5uZWxcbiAgICAvLyBrZWVwaW5nIGl0IGFyb3VuZCBhcyBpdCdzIHBvdGVudGlhbGx5IHVzZWZ1bCBmb3IgYXZvaWRpbmcgZHVwbGljYXRlIHdyaXRlIG9wZXJhdGlvbnMgdXBvbiByZW5kZXJlciBjcmFzaGluZ1xuICAgIHRoaXMuZW1pdHRlci5vbignZXhlYy1zdGFydGVkJywgdGhpcy5vbkV4ZWNTdGFydGVkKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiBpcGMucmVtb3ZlTGlzdGVuZXIoV29ya2VyLmNoYW5uZWxOYW1lLCBoYW5kbGVNZXNzYWdlcykpLFxuICAgICk7XG4gIH1cblxuICBleGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBvcGVyYXRpb24uZXhlY3V0ZShwYXlsb2FkID0+IHtcbiAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgcmV0dXJuIHRoaXMud2ViQ29udGVudHMuc2VuZChXb3JrZXIuY2hhbm5lbE5hbWUsIHtcbiAgICAgICAgdHlwZTogJ2dpdC1leGVjJyxcbiAgICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBvcGVyYXRpb24uY2FuY2VsKHBheWxvYWQgPT4ge1xuICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiBudWxsOyB9XG4gICAgICByZXR1cm4gdGhpcy53ZWJDb250ZW50cy5zZW5kKFdvcmtlci5jaGFubmVsTmFtZSwge1xuICAgICAgICB0eXBlOiAnZ2l0LWNhbmNlbCcsXG4gICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5waWQ7XG4gIH1cblxuICBnZXRSZWFkeVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHlQcm9taXNlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBPcGVyYXRpb24ge1xuICBzdGF0aWMgc3RhdHVzID0ge1xuICAgIFBFTkRJTkc6IFN5bWJvbCgncGVuZGluZycpLFxuICAgIElOUFJPR1JFU1M6IFN5bWJvbCgnaW4tcHJvZ3Jlc3MnKSxcbiAgICBDT01QTEVURTogU3ltYm9sKCdjb21wbGV0ZScpLFxuICAgIENBTkNFTExJTkc6IFN5bWJvbCgnY2FuY2VsbGluZycpLFxuICAgIENBTkNFTExFRDogU3ltYm9sKCdjYW5jZWxlZCcpLFxuICB9XG5cbiAgc3RhdGljIGlkID0gMDtcblxuICBjb25zdHJ1Y3RvcihkYXRhLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICB0aGlzLmlkID0gT3BlcmF0aW9uLmlkKys7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgIHRoaXMucHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlID0gKCkgPT4ge307XG4gICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuZW5kVGltZSA9IG51bGw7XG4gICAgdGhpcy5zdGF0dXMgPSBPcGVyYXRpb24uc3RhdHVzLlBFTkRJTkc7XG4gICAgdGhpcy5yZXN1bHRzID0gbnVsbDtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgb25Db21wbGV0ZShjYikge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2NvbXBsZXRlJywgY2IpO1xuICB9XG5cbiAgc2V0UHJvbWlzZShwcm9taXNlKSB7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgfVxuXG4gIGdldFByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZTtcbiAgfVxuXG4gIHNldEluUHJvZ3Jlc3MoKSB7XG4gICAgLy8gYWZ0ZXIgZXhlYyBoYXMgYmVlbiBjYWxsZWQgYnV0IGJlZm9yZSByZXN1bHRzIGEgcmVjZWl2ZWRcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuSU5QUk9HUkVTUztcbiAgfVxuXG4gIGdldEV4ZWN1dGlvblRpbWUoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSB8fCAhdGhpcy5lbmRUaW1lKSB7XG4gICAgICByZXR1cm4gTmFOO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmRUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUocmVzdWx0cywgbXV0YXRlID0gZGF0YSA9PiBkYXRhKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0cztcbiAgICB0aGlzLnJlc29sdmUobXV0YXRlKHJlc3VsdHMpKTtcbiAgICB0aGlzLmNhbmNlbGxhdGlvblJlc29sdmUoKTtcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuQ09NUExFVEU7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NvbXBsZXRlJywgdGhpcyk7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHdhc0NhbmNlbGxlZCgpIHtcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuQ0FOQ0VMTEVEO1xuICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSgpO1xuICB9XG5cbiAgZXJyb3IocmVzdWx0cykge1xuICAgIHRoaXMuZW5kVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihyZXN1bHRzLm1lc3NhZ2UsIHJlc3VsdHMuZmlsZU5hbWUsIHJlc3VsdHMubGluZU51bWJlcik7XG4gICAgZXJyLnN0YWNrID0gcmVzdWx0cy5zdGFjaztcbiAgICB0aGlzLnJlamVjdChlcnIpO1xuICB9XG5cbiAgZXhlY3V0ZShleGVjRm4pIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHJldHVybiBleGVjRm4oey4uLnRoaXMuZGF0YSwgaWQ6IHRoaXMuaWR9KTtcbiAgfVxuXG4gIGNhbmNlbChleGVjRm4pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuQ0FOQ0VMTElORztcbiAgICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBleGVjRm4oe2lkOiB0aGlzLmlkfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJd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