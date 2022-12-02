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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    this.webContents = this.win.webContents; // this.webContents.openDevTools();

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
    this.emitter.on('slow-spawns', this.onSick); // not currently used to avoid clogging up ipc channel
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi93b3JrZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJCcm93c2VyV2luZG93IiwicmVtb3RlIiwiV29ya2VyTWFuYWdlciIsImdldEluc3RhbmNlIiwiaW5zdGFuY2UiLCJyZXNldCIsImZvcmNlIiwiZGVzdHJveSIsImNvbnN0cnVjdG9yIiwid29ya2VycyIsIlNldCIsImFjdGl2ZVdvcmtlciIsImNyZWF0ZU5ld1dvcmtlciIsImlzUmVhZHkiLCJyZXF1ZXN0IiwiZGF0YSIsImRlc3Ryb3llZCIsIkVycm9yIiwib3BlcmF0aW9uIiwicmVxdWVzdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIk9wZXJhdGlvbiIsImV4ZWN1dGVPcGVyYXRpb24iLCJzZXRQcm9taXNlIiwiY2FuY2VsIiwiY2FuY2VsT3BlcmF0aW9uIiwicHJvbWlzZSIsIm9wZXJhdGlvbkNvdW50TGltaXQiLCJXb3JrZXIiLCJvbkRlc3Ryb3llZCIsIm9uQ3Jhc2hlZCIsIm9uU2ljayIsImFkZCIsImRlc3Ryb3llZFdvcmtlciIsImRlbGV0ZSIsImNyYXNoZWRXb3JrZXIiLCJnZXRBY3RpdmVXb3JrZXIiLCJnZXRPcGVyYXRpb25Db3VudExpbWl0IiwiZ2V0UmVtYWluaW5nT3BlcmF0aW9ucyIsImZvckVhY2giLCJzaWNrV29ya2VyIiwiYXRvbSIsImluU3BlY01vZGUiLCJjb25zb2xlIiwid2FybiIsImdldENvbXBsZXRlZE9wZXJhdGlvbkNvdW50IiwiY2FsY3VsYXRlTmV3T3BlcmF0aW9uQ291bnRMaW1pdCIsImxhc3RXb3JrZXIiLCJNYXRoIiwibWluIiwiZ2V0UmVhZHlQcm9taXNlIiwid29ya2VyIiwib3BlcmF0aW9uc0J5SWQiLCJNYXAiLCJjb21wbGV0ZWRPcGVyYXRpb25Db3VudCIsInNpY2siLCJyZW5kZXJlclByb2Nlc3MiLCJSZW5kZXJlclByb2Nlc3MiLCJsb2FkVXJsIiwiZ2V0TG9hZFVybCIsIm9uRGF0YSIsImhhbmRsZURhdGFSZWNlaXZlZCIsIm9uQ2FuY2VsbGVkIiwiaGFuZGxlQ2FuY2VsbGVkIiwib25FeGVjU3RhcnRlZCIsImhhbmRsZUV4ZWNTdGFydGVkIiwib25TcGF3bkVycm9yIiwiaGFuZGxlU3Bhd25FcnJvciIsIm9uU3RkaW5FcnJvciIsImhhbmRsZVN0ZGluRXJyb3IiLCJoYW5kbGVTaWNrIiwiaGFuZGxlQ3Jhc2hlZCIsImh0bWxQYXRoIiwicGF0aCIsImpvaW4iLCJyZW5kZXJlckpzUGF0aCIsInFzIiwicXVlcnlzdHJpbmciLCJzdHJpbmdpZnkiLCJqcyIsIm1hbmFnZXJXZWJDb250ZW50c0lkIiwiZ2V0V2ViQ29udGVudHNJZCIsImNoYW5uZWxOYW1lIiwiZ2V0Q3VycmVudFdlYkNvbnRlbnRzIiwiaWQiLCJzZXQiLCJvbkNvbXBsZXRlIiwib25PcGVyYXRpb25Db21wbGV0ZSIsInJlc3VsdHMiLCJnZXQiLCJjb21wbGV0ZSIsInRpbWluZyIsInRvdGFsSW50ZXJuYWxUaW1lIiwiZXhlY1RpbWUiLCJzcGF3blRpbWUiLCJpcGNUaW1lIiwiZ2V0RXhlY3V0aW9uVGltZSIsInNpemUiLCJ3YXNDYW5jZWxsZWQiLCJzZXRJblByb2dyZXNzIiwiZXJyIiwiZXJyb3IiLCJzdGRpbiIsIkFycmF5IiwiZnJvbSIsInZhbHVlcyIsImdldFBpZCIsInJlbWFpbmluZ09wZXJhdGlvblByb21pc2VzIiwibWFwIiwiZ2V0UHJvbWlzZSIsImNhdGNoIiwiYWxsIiwid2luIiwic2hvdyIsInByb2Nlc3MiLCJlbnYiLCJBVE9NX0dJVEhVQl9TSE9XX1JFTkRFUkVSX1dJTkRPVyIsIndlYlByZWZlcmVuY2VzIiwibm9kZUludGVncmF0aW9uIiwiZW5hYmxlUmVtb3RlTW9kdWxlIiwid2ViQ29udGVudHMiLCJlbWl0dGVyIiwiRW1pdHRlciIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwicmVnaXN0ZXJMaXN0ZW5lcnMiLCJsb2FkVVJMIiwib24iLCJoYW5kbGVEZXN0cm95IiwiRGlzcG9zYWJsZSIsImlzRGVzdHJveWVkIiwicmVtb3ZlTGlzdGVuZXIiLCJyZWFkeSIsInJlYWR5UHJvbWlzZSIsInJlc29sdmVSZWFkeSIsImFyZ3MiLCJoYW5kbGVNZXNzYWdlcyIsImV2ZW50Iiwic291cmNlV2ViQ29udGVudHNJZCIsInR5cGUiLCJlbWl0IiwiaXBjIiwicGlkIiwiZXhlY3V0ZSIsInBheWxvYWQiLCJzZW5kIiwiZGlzcG9zZSIsImNhbmNlbGxhdGlvblJlc29sdmUiLCJzdGFydFRpbWUiLCJlbmRUaW1lIiwic3RhdHVzIiwiUEVORElORyIsImNiIiwiSU5QUk9HUkVTUyIsIk5hTiIsIm11dGF0ZSIsInBlcmZvcm1hbmNlIiwibm93IiwiQ09NUExFVEUiLCJDQU5DRUxMRUQiLCJtZXNzYWdlIiwiZmlsZU5hbWUiLCJsaW5lTnVtYmVyIiwic3RhY2siLCJleGVjRm4iLCJDQU5DRUxMSU5HIiwiU3ltYm9sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7QUFIQSxNQUFNO0FBQUNBLEVBQUFBO0FBQUQsSUFBa0JDLGdCQUF4Qjs7QUFLZSxNQUFNQyxhQUFOLENBQW9CO0FBR2YsU0FBWEMsV0FBVyxHQUFHO0FBQ25CLFFBQUksQ0FBQyxLQUFLQyxRQUFWLEVBQW9CO0FBQ2xCLFdBQUtBLFFBQUwsR0FBZ0IsSUFBSUYsYUFBSixFQUFoQjtBQUNEOztBQUNELFdBQU8sS0FBS0UsUUFBWjtBQUNEOztBQUVXLFNBQUxDLEtBQUssQ0FBQ0MsS0FBRCxFQUFRO0FBQ2xCLFFBQUksS0FBS0YsUUFBVCxFQUFtQjtBQUFFLFdBQUtBLFFBQUwsQ0FBY0csT0FBZCxDQUFzQkQsS0FBdEI7QUFBK0I7O0FBQ3BELFNBQUtGLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDs7QUFFREksRUFBQUEsV0FBVyxHQUFHO0FBQ1osMkJBQVMsSUFBVCxFQUFlLGFBQWYsRUFBOEIsV0FBOUIsRUFBMkMsUUFBM0M7QUFFQSxTQUFLQyxPQUFMLEdBQWUsSUFBSUMsR0FBSixFQUFmO0FBQ0EsU0FB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S0Q7O0FBbkZvQjs7OztnQkFBVi9ELFMsWUFDSztBQUNka0ksRUFBQUEsT0FBTyxFQUFFZSxNQUFNLENBQUMsU0FBRCxDQUREO0FBRWRiLEVBQUFBLFVBQVUsRUFBRWEsTUFBTSxDQUFDLGFBQUQsQ0FGSjtBQUdkUixFQUFBQSxRQUFRLEVBQUVRLE1BQU0sQ0FBQyxVQUFELENBSEY7QUFJZEQsRUFBQUEsVUFBVSxFQUFFQyxNQUFNLENBQUMsWUFBRCxDQUpKO0FBS2RQLEVBQUFBLFNBQVMsRUFBRU8sTUFBTSxDQUFDLFVBQUQ7QUFMSCxDOztnQkFETGpKLFMsUUFTQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAncXVlcnlzdHJpbmcnO1xuXG5pbXBvcnQge3JlbW90ZSwgaXBjUmVuZGVyZXIgYXMgaXBjfSBmcm9tICdlbGVjdHJvbic7XG5jb25zdCB7QnJvd3NlcldpbmRvd30gPSByZW1vdGU7XG5pbXBvcnQge0VtaXR0ZXIsIERpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7Z2V0UGFja2FnZVJvb3QsIGF1dG9iaW5kfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZXJNYW5hZ2VyIHtcbiAgc3RhdGljIGluc3RhbmNlID0gbnVsbDtcblxuICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IFdvcmtlck1hbmFnZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gIH1cblxuICBzdGF0aWMgcmVzZXQoZm9yY2UpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZSkgeyB0aGlzLmluc3RhbmNlLmRlc3Ryb3koZm9yY2UpOyB9XG4gICAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBhdXRvYmluZCh0aGlzLCAnb25EZXN0cm95ZWQnLCAnb25DcmFzaGVkJywgJ29uU2ljaycpO1xuXG4gICAgdGhpcy53b3JrZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuYWN0aXZlV29ya2VyID0gbnVsbDtcbiAgICB0aGlzLmNyZWF0ZU5ld1dvcmtlcigpO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXIuaXNSZWFkeSgpO1xuICB9XG5cbiAgcmVxdWVzdChkYXRhKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHRocm93IG5ldyBFcnJvcignV29ya2VyIGlzIGRlc3Ryb3llZCcpOyB9XG4gICAgbGV0IG9wZXJhdGlvbjtcbiAgICBjb25zdCByZXF1ZXN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIG9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb24oZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmtlci5leGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbik7XG4gICAgfSk7XG4gICAgb3BlcmF0aW9uLnNldFByb21pc2UocmVxdWVzdFByb21pc2UpO1xuICAgIHJldHVybiB7XG4gICAgICBjYW5jZWw6ICgpID0+IHRoaXMuYWN0aXZlV29ya2VyLmNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pLFxuICAgICAgcHJvbWlzZTogcmVxdWVzdFByb21pc2UsXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZU5ld1dvcmtlcih7b3BlcmF0aW9uQ291bnRMaW1pdH0gPSB7b3BlcmF0aW9uQ291bnRMaW1pdDogMTB9KSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybjsgfVxuICAgIHRoaXMuYWN0aXZlV29ya2VyID0gbmV3IFdvcmtlcih7XG4gICAgICBvcGVyYXRpb25Db3VudExpbWl0LFxuICAgICAgb25EZXN0cm95ZWQ6IHRoaXMub25EZXN0cm95ZWQsXG4gICAgICBvbkNyYXNoZWQ6IHRoaXMub25DcmFzaGVkLFxuICAgICAgb25TaWNrOiB0aGlzLm9uU2ljayxcbiAgICB9KTtcbiAgICB0aGlzLndvcmtlcnMuYWRkKHRoaXMuYWN0aXZlV29ya2VyKTtcbiAgfVxuXG4gIG9uRGVzdHJveWVkKGRlc3Ryb3llZFdvcmtlcikge1xuICAgIHRoaXMud29ya2Vycy5kZWxldGUoZGVzdHJveWVkV29ya2VyKTtcbiAgfVxuXG4gIG9uQ3Jhc2hlZChjcmFzaGVkV29ya2VyKSB7XG4gICAgaWYgKGNyYXNoZWRXb3JrZXIgPT09IHRoaXMuZ2V0QWN0aXZlV29ya2VyKCkpIHtcbiAgICAgIHRoaXMuY3JlYXRlTmV3V29ya2VyKHtvcGVyYXRpb25Db3VudExpbWl0OiBjcmFzaGVkV29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKX0pO1xuICAgIH1cbiAgICBjcmFzaGVkV29ya2VyLmdldFJlbWFpbmluZ09wZXJhdGlvbnMoKS5mb3JFYWNoKG9wZXJhdGlvbiA9PiB0aGlzLmFjdGl2ZVdvcmtlci5leGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbikpO1xuICB9XG5cbiAgb25TaWNrKHNpY2tXb3JrZXIpIHtcbiAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBTaWNrIHdvcmtlciBkZXRlY3RlZC5cbiAgICAgICAgb3BlcmF0aW9uQ291bnRMaW1pdDogJHtzaWNrV29ya2VyLmdldE9wZXJhdGlvbkNvdW50TGltaXQoKX0sXG4gICAgICAgIGNvbXBsZXRlZCBvcGVyYXRpb24gY291bnQ6ICR7c2lja1dvcmtlci5nZXRDb21wbGV0ZWRPcGVyYXRpb25Db3VudCgpfWApO1xuICAgIH1cbiAgICBjb25zdCBvcGVyYXRpb25Db3VudExpbWl0ID0gdGhpcy5jYWxjdWxhdGVOZXdPcGVyYXRpb25Db3VudExpbWl0KHNpY2tXb3JrZXIpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZU5ld1dvcmtlcih7b3BlcmF0aW9uQ291bnRMaW1pdH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlTmV3T3BlcmF0aW9uQ291bnRMaW1pdChsYXN0V29ya2VyKSB7XG4gICAgbGV0IG9wZXJhdGlvbkNvdW50TGltaXQgPSAxMDtcbiAgICBpZiAobGFzdFdvcmtlci5nZXRPcGVyYXRpb25Db3VudExpbWl0KCkgPj0gbGFzdFdvcmtlci5nZXRDb21wbGV0ZWRPcGVyYXRpb25Db3VudCgpKSB7XG4gICAgICBvcGVyYXRpb25Db3VudExpbWl0ID0gTWF0aC5taW4obGFzdFdvcmtlci5nZXRPcGVyYXRpb25Db3VudExpbWl0KCkgKiAyLCAxMDApO1xuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0aW9uQ291bnRMaW1pdDtcbiAgfVxuXG4gIGdldEFjdGl2ZVdvcmtlcigpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JrZXI7XG4gIH1cblxuICBnZXRSZWFkeVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29ya2VyLmdldFJlYWR5UHJvbWlzZSgpO1xuICB9XG5cbiAgZGVzdHJveShmb3JjZSkge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLndvcmtlcnMuZm9yRWFjaCh3b3JrZXIgPT4gd29ya2VyLmRlc3Ryb3koZm9yY2UpKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBXb3JrZXIge1xuICBzdGF0aWMgY2hhbm5lbE5hbWUgPSAnZ2l0aHViOnJlbmRlcmVyLWlwYyc7XG5cbiAgY29uc3RydWN0b3Ioe29wZXJhdGlvbkNvdW50TGltaXQsIG9uU2ljaywgb25DcmFzaGVkLCBvbkRlc3Ryb3llZH0pIHtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnaGFuZGxlRGF0YVJlY2VpdmVkJywgJ29uT3BlcmF0aW9uQ29tcGxldGUnLCAnaGFuZGxlQ2FuY2VsbGVkJywgJ2hhbmRsZUV4ZWNTdGFydGVkJywgJ2hhbmRsZVNwYXduRXJyb3InLFxuICAgICAgJ2hhbmRsZVN0ZGluRXJyb3InLCAnaGFuZGxlU2ljaycsICdoYW5kbGVDcmFzaGVkJyxcbiAgICApO1xuXG4gICAgdGhpcy5vcGVyYXRpb25Db3VudExpbWl0ID0gb3BlcmF0aW9uQ291bnRMaW1pdDtcbiAgICB0aGlzLm9uU2ljayA9IG9uU2ljaztcbiAgICB0aGlzLm9uQ3Jhc2hlZCA9IG9uQ3Jhc2hlZDtcbiAgICB0aGlzLm9uRGVzdHJveWVkID0gb25EZXN0cm95ZWQ7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnNCeUlkID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuY29tcGxldGVkT3BlcmF0aW9uQ291bnQgPSAwO1xuICAgIHRoaXMuc2ljayA9IGZhbHNlO1xuXG4gICAgdGhpcy5yZW5kZXJlclByb2Nlc3MgPSBuZXcgUmVuZGVyZXJQcm9jZXNzKHtcbiAgICAgIGxvYWRVcmw6IHRoaXMuZ2V0TG9hZFVybChvcGVyYXRpb25Db3VudExpbWl0KSxcbiAgICAgIG9uRGF0YTogdGhpcy5oYW5kbGVEYXRhUmVjZWl2ZWQsXG4gICAgICBvbkNhbmNlbGxlZDogdGhpcy5oYW5kbGVDYW5jZWxsZWQsXG4gICAgICBvbkV4ZWNTdGFydGVkOiB0aGlzLmhhbmRsZUV4ZWNTdGFydGVkLFxuICAgICAgb25TcGF3bkVycm9yOiB0aGlzLmhhbmRsZVNwYXduRXJyb3IsXG4gICAgICBvblN0ZGluRXJyb3I6IHRoaXMuaGFuZGxlU3RkaW5FcnJvcixcbiAgICAgIG9uU2ljazogdGhpcy5oYW5kbGVTaWNrLFxuICAgICAgb25DcmFzaGVkOiB0aGlzLmhhbmRsZUNyYXNoZWQsXG4gICAgICBvbkRlc3Ryb3llZDogdGhpcy5kZXN0cm95LFxuICAgIH0pO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlclByb2Nlc3MuaXNSZWFkeSgpO1xuICB9XG5cbiAgZ2V0TG9hZFVybChvcGVyYXRpb25Db3VudExpbWl0KSB7XG4gICAgY29uc3QgaHRtbFBhdGggPSBwYXRoLmpvaW4oZ2V0UGFja2FnZVJvb3QoKSwgJ2xpYicsICdyZW5kZXJlci5odG1sJyk7XG4gICAgY29uc3QgcmVuZGVyZXJKc1BhdGggPSBwYXRoLmpvaW4oZ2V0UGFja2FnZVJvb3QoKSwgJ2xpYicsICd3b3JrZXIuanMnKTtcbiAgICBjb25zdCBxcyA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh7XG4gICAgICBqczogcmVuZGVyZXJKc1BhdGgsXG4gICAgICBtYW5hZ2VyV2ViQ29udGVudHNJZDogdGhpcy5nZXRXZWJDb250ZW50c0lkKCksXG4gICAgICBvcGVyYXRpb25Db3VudExpbWl0LFxuICAgICAgY2hhbm5lbE5hbWU6IFdvcmtlci5jaGFubmVsTmFtZSxcbiAgICB9KTtcbiAgICByZXR1cm4gYGZpbGU6Ly8ke2h0bWxQYXRofT8ke3FzfWA7XG4gIH1cblxuICBnZXRXZWJDb250ZW50c0lkKCkge1xuICAgIHJldHVybiByZW1vdGUuZ2V0Q3VycmVudFdlYkNvbnRlbnRzKCkuaWQ7XG4gIH1cblxuICBleGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHRoaXMub3BlcmF0aW9uc0J5SWQuc2V0KG9wZXJhdGlvbi5pZCwgb3BlcmF0aW9uKTtcbiAgICBvcGVyYXRpb24ub25Db21wbGV0ZSh0aGlzLm9uT3BlcmF0aW9uQ29tcGxldGUpO1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5leGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbik7XG4gIH1cblxuICBjYW5jZWxPcGVyYXRpb24ob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmNhbmNlbE9wZXJhdGlvbihvcGVyYXRpb24pO1xuICB9XG5cbiAgaGFuZGxlRGF0YVJlY2VpdmVkKHtpZCwgcmVzdWx0c30pIHtcbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvbnNCeUlkLmdldChpZCk7XG4gICAgb3BlcmF0aW9uLmNvbXBsZXRlKHJlc3VsdHMsIGRhdGEgPT4ge1xuICAgICAgY29uc3Qge3RpbWluZ30gPSBkYXRhO1xuICAgICAgY29uc3QgdG90YWxJbnRlcm5hbFRpbWUgPSB0aW1pbmcuZXhlY1RpbWUgKyB0aW1pbmcuc3Bhd25UaW1lO1xuICAgICAgY29uc3QgaXBjVGltZSA9IG9wZXJhdGlvbi5nZXRFeGVjdXRpb25UaW1lKCkgLSB0b3RhbEludGVybmFsVGltZTtcbiAgICAgIGRhdGEudGltaW5nLmlwY1RpbWUgPSBpcGNUaW1lO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBvbk9wZXJhdGlvbkNvbXBsZXRlKG9wZXJhdGlvbikge1xuICAgIHRoaXMuY29tcGxldGVkT3BlcmF0aW9uQ291bnQrKztcbiAgICB0aGlzLm9wZXJhdGlvbnNCeUlkLmRlbGV0ZShvcGVyYXRpb24uaWQpO1xuXG4gICAgaWYgKHRoaXMuc2ljayAmJiB0aGlzLm9wZXJhdGlvbnNCeUlkLnNpemUgPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNhbmNlbGxlZCh7aWR9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIGlmIChvcGVyYXRpb24pIHtcbiAgICAgIC8vIGhhbmRsZURhdGFSZWNlaXZlZCgpIGNhbiBiZSByZWNlaXZlZCBiZWZvcmUgaGFuZGxlQ2FuY2VsbGVkKClcbiAgICAgIG9wZXJhdGlvbi53YXNDYW5jZWxsZWQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFeGVjU3RhcnRlZCh7aWR9KSB7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25zQnlJZC5nZXQoaWQpO1xuICAgIG9wZXJhdGlvbi5zZXRJblByb2dyZXNzKCk7XG4gIH1cblxuICBoYW5kbGVTcGF3bkVycm9yKHtpZCwgZXJyfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIGhhbmRsZVN0ZGluRXJyb3Ioe2lkLCBzdGRpbiwgZXJyfSkge1xuICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uc0J5SWQuZ2V0KGlkKTtcbiAgICBvcGVyYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIGhhbmRsZVNpY2soKSB7XG4gICAgdGhpcy5zaWNrID0gdHJ1ZTtcbiAgICB0aGlzLm9uU2ljayh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUNyYXNoZWQoKSB7XG4gICAgdGhpcy5vbkNyYXNoZWQodGhpcyk7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBnZXRPcGVyYXRpb25Db3VudExpbWl0KCkge1xuICAgIHJldHVybiB0aGlzLm9wZXJhdGlvbkNvdW50TGltaXQ7XG4gIH1cblxuICBnZXRDb21wbGV0ZWRPcGVyYXRpb25Db3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21wbGV0ZWRPcGVyYXRpb25Db3VudDtcbiAgfVxuXG4gIGdldFJlbWFpbmluZ09wZXJhdGlvbnMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5vcGVyYXRpb25zQnlJZC52YWx1ZXMoKSk7XG4gIH1cblxuICBnZXRQaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZXJQcm9jZXNzLmdldFBpZCgpO1xuICB9XG5cbiAgZ2V0UmVhZHlQcm9taXNlKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVyUHJvY2Vzcy5nZXRSZWFkeVByb21pc2UoKTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koZm9yY2UpIHtcbiAgICB0aGlzLm9uRGVzdHJveWVkKHRoaXMpO1xuICAgIGlmICh0aGlzLm9wZXJhdGlvbnNCeUlkLnNpemUgPiAwICYmICFmb3JjZSkge1xuICAgICAgY29uc3QgcmVtYWluaW5nT3BlcmF0aW9uUHJvbWlzZXMgPSB0aGlzLmdldFJlbWFpbmluZ09wZXJhdGlvbnMoKVxuICAgICAgICAubWFwKG9wZXJhdGlvbiA9PiBvcGVyYXRpb24uZ2V0UHJvbWlzZSgpLmNhdGNoKCgpID0+IG51bGwpKTtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHJlbWFpbmluZ09wZXJhdGlvblByb21pc2VzKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlclByb2Nlc3MuZGVzdHJveSgpO1xuICB9XG59XG5cblxuLypcblNlbmRzIG9wZXJhdGlvbnMgdG8gcmVuZGVyZXIgcHJvY2Vzc2VzXG4qL1xuZXhwb3J0IGNsYXNzIFJlbmRlcmVyUHJvY2VzcyB7XG4gIGNvbnN0cnVjdG9yKHtsb2FkVXJsLFxuICAgIG9uRGVzdHJveWVkLCBvbkNyYXNoZWQsIG9uU2ljaywgb25EYXRhLCBvbkNhbmNlbGxlZCwgb25TcGF3bkVycm9yLCBvblN0ZGluRXJyb3IsIG9uRXhlY1N0YXJ0ZWR9KSB7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZURlc3Ryb3knKTtcbiAgICB0aGlzLm9uRGVzdHJveWVkID0gb25EZXN0cm95ZWQ7XG4gICAgdGhpcy5vbkNyYXNoZWQgPSBvbkNyYXNoZWQ7XG4gICAgdGhpcy5vblNpY2sgPSBvblNpY2s7XG4gICAgdGhpcy5vbkRhdGEgPSBvbkRhdGE7XG4gICAgdGhpcy5vbkNhbmNlbGxlZCA9IG9uQ2FuY2VsbGVkO1xuICAgIHRoaXMub25TcGF3bkVycm9yID0gb25TcGF3bkVycm9yO1xuICAgIHRoaXMub25TdGRpbkVycm9yID0gb25TdGRpbkVycm9yO1xuICAgIHRoaXMub25FeGVjU3RhcnRlZCA9IG9uRXhlY1N0YXJ0ZWQ7XG5cbiAgICB0aGlzLndpbiA9IG5ldyBCcm93c2VyV2luZG93KHtzaG93OiAhIXByb2Nlc3MuZW52LkFUT01fR0lUSFVCX1NIT1dfUkVOREVSRVJfV0lORE9XLFxuICAgICAgd2ViUHJlZmVyZW5jZXM6IHtub2RlSW50ZWdyYXRpb246IHRydWUsIGVuYWJsZVJlbW90ZU1vZHVsZTogdHJ1ZX19KTtcbiAgICB0aGlzLndlYkNvbnRlbnRzID0gdGhpcy53aW4ud2ViQ29udGVudHM7XG4gICAgLy8gdGhpcy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICB0aGlzLndpbi5sb2FkVVJMKGxvYWRVcmwpO1xuICAgIHRoaXMud2luLndlYkNvbnRlbnRzLm9uKCdjcmFzaGVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICB0aGlzLndpbi53ZWJDb250ZW50cy5vbignZGVzdHJveWVkJywgdGhpcy5oYW5kbGVEZXN0cm95KTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMud2luLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgICAgICB0aGlzLndpbi53ZWJDb250ZW50cy5yZW1vdmVMaXN0ZW5lcignY3Jhc2hlZCcsIHRoaXMuaGFuZGxlRGVzdHJveSk7XG4gICAgICAgICAgdGhpcy53aW4ud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2Rlc3Ryb3llZCcsIHRoaXMuaGFuZGxlRGVzdHJveSk7XG4gICAgICAgICAgdGhpcy53aW4uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZW1pdHRlcixcbiAgICApO1xuXG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMucmVhZHlQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7IHRoaXMucmVzb2x2ZVJlYWR5ID0gcmVzb2x2ZTsgfSk7XG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5O1xuICB9XG5cbiAgaGFuZGxlRGVzdHJveSguLi5hcmdzKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgdGhpcy5vbkNyYXNoZWQoLi4uYXJncyk7XG4gIH1cblxuICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICBjb25zdCBoYW5kbGVNZXNzYWdlcyA9IChldmVudCwge3NvdXJjZVdlYkNvbnRlbnRzSWQsIHR5cGUsIGRhdGF9KSA9PiB7XG4gICAgICBpZiAoc291cmNlV2ViQ29udGVudHNJZCA9PT0gdGhpcy53aW4ud2ViQ29udGVudHMuaWQpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQodHlwZSwgZGF0YSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlwYy5vbihXb3JrZXIuY2hhbm5lbE5hbWUsIGhhbmRsZU1lc3NhZ2VzKTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3JlbmRlcmVyLXJlYWR5JywgKHtwaWR9KSA9PiB7XG4gICAgICB0aGlzLnBpZCA9IHBpZDtcbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgdGhpcy5yZXNvbHZlUmVhZHkoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2dpdC1kYXRhJywgdGhpcy5vbkRhdGEpO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LWNhbmNlbGxlZCcsIHRoaXMub25DYW5jZWxsZWQpO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LXNwYXduLWVycm9yJywgdGhpcy5vblNwYXduRXJyb3IpO1xuICAgIHRoaXMuZW1pdHRlci5vbignZ2l0LXN0ZGluLWVycm9yJywgdGhpcy5vblN0ZGluRXJyb3IpO1xuICAgIHRoaXMuZW1pdHRlci5vbignc2xvdy1zcGF3bnMnLCB0aGlzLm9uU2ljayk7XG5cbiAgICAvLyBub3QgY3VycmVudGx5IHVzZWQgdG8gYXZvaWQgY2xvZ2dpbmcgdXAgaXBjIGNoYW5uZWxcbiAgICAvLyBrZWVwaW5nIGl0IGFyb3VuZCBhcyBpdCdzIHBvdGVudGlhbGx5IHVzZWZ1bCBmb3IgYXZvaWRpbmcgZHVwbGljYXRlIHdyaXRlIG9wZXJhdGlvbnMgdXBvbiByZW5kZXJlciBjcmFzaGluZ1xuICAgIHRoaXMuZW1pdHRlci5vbignZXhlYy1zdGFydGVkJywgdGhpcy5vbkV4ZWNTdGFydGVkKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiBpcGMucmVtb3ZlTGlzdGVuZXIoV29ya2VyLmNoYW5uZWxOYW1lLCBoYW5kbGVNZXNzYWdlcykpLFxuICAgICk7XG4gIH1cblxuICBleGVjdXRlT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBvcGVyYXRpb24uZXhlY3V0ZShwYXlsb2FkID0+IHtcbiAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgcmV0dXJuIHRoaXMud2ViQ29udGVudHMuc2VuZChXb3JrZXIuY2hhbm5lbE5hbWUsIHtcbiAgICAgICAgdHlwZTogJ2dpdC1leGVjJyxcbiAgICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY2FuY2VsT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBvcGVyYXRpb24uY2FuY2VsKHBheWxvYWQgPT4ge1xuICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiBudWxsOyB9XG4gICAgICByZXR1cm4gdGhpcy53ZWJDb250ZW50cy5zZW5kKFdvcmtlci5jaGFubmVsTmFtZSwge1xuICAgICAgICB0eXBlOiAnZ2l0LWNhbmNlbCcsXG4gICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5waWQ7XG4gIH1cblxuICBnZXRSZWFkeVByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHlQcm9taXNlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBPcGVyYXRpb24ge1xuICBzdGF0aWMgc3RhdHVzID0ge1xuICAgIFBFTkRJTkc6IFN5bWJvbCgncGVuZGluZycpLFxuICAgIElOUFJPR1JFU1M6IFN5bWJvbCgnaW4tcHJvZ3Jlc3MnKSxcbiAgICBDT01QTEVURTogU3ltYm9sKCdjb21wbGV0ZScpLFxuICAgIENBTkNFTExJTkc6IFN5bWJvbCgnY2FuY2VsbGluZycpLFxuICAgIENBTkNFTExFRDogU3ltYm9sKCdjYW5jZWxlZCcpLFxuICB9XG5cbiAgc3RhdGljIGlkID0gMDtcblxuICBjb25zdHJ1Y3RvcihkYXRhLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICB0aGlzLmlkID0gT3BlcmF0aW9uLmlkKys7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgIHRoaXMucHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5jYW5jZWxsYXRpb25SZXNvbHZlID0gKCkgPT4ge307XG4gICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuZW5kVGltZSA9IG51bGw7XG4gICAgdGhpcy5zdGF0dXMgPSBPcGVyYXRpb24uc3RhdHVzLlBFTkRJTkc7XG4gICAgdGhpcy5yZXN1bHRzID0gbnVsbDtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgb25Db21wbGV0ZShjYikge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2NvbXBsZXRlJywgY2IpO1xuICB9XG5cbiAgc2V0UHJvbWlzZShwcm9taXNlKSB7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgfVxuXG4gIGdldFByb21pc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZTtcbiAgfVxuXG4gIHNldEluUHJvZ3Jlc3MoKSB7XG4gICAgLy8gYWZ0ZXIgZXhlYyBoYXMgYmVlbiBjYWxsZWQgYnV0IGJlZm9yZSByZXN1bHRzIGEgcmVjZWl2ZWRcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuSU5QUk9HUkVTUztcbiAgfVxuXG4gIGdldEV4ZWN1dGlvblRpbWUoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSB8fCAhdGhpcy5lbmRUaW1lKSB7XG4gICAgICByZXR1cm4gTmFOO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmRUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUocmVzdWx0cywgbXV0YXRlID0gZGF0YSA9PiBkYXRhKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0cztcbiAgICB0aGlzLnJlc29sdmUobXV0YXRlKHJlc3VsdHMpKTtcbiAgICB0aGlzLmNhbmNlbGxhdGlvblJlc29sdmUoKTtcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuQ09NUExFVEU7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NvbXBsZXRlJywgdGhpcyk7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHdhc0NhbmNlbGxlZCgpIHtcbiAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuQ0FOQ0VMTEVEO1xuICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSgpO1xuICB9XG5cbiAgZXJyb3IocmVzdWx0cykge1xuICAgIHRoaXMuZW5kVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihyZXN1bHRzLm1lc3NhZ2UsIHJlc3VsdHMuZmlsZU5hbWUsIHJlc3VsdHMubGluZU51bWJlcik7XG4gICAgZXJyLnN0YWNrID0gcmVzdWx0cy5zdGFjaztcbiAgICB0aGlzLnJlamVjdChlcnIpO1xuICB9XG5cbiAgZXhlY3V0ZShleGVjRm4pIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHJldHVybiBleGVjRm4oey4uLnRoaXMuZGF0YSwgaWQ6IHRoaXMuaWR9KTtcbiAgfVxuXG4gIGNhbmNlbChleGVjRm4pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnN0YXR1cyA9IE9wZXJhdGlvbi5zdGF0dXMuQ0FOQ0VMTElORztcbiAgICAgIHRoaXMuY2FuY2VsbGF0aW9uUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBleGVjRm4oe2lkOiB0aGlzLmlkfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==