"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _helpers = require("./helpers");

var _asyncQueue = _interopRequireDefault(require("./async-queue"));

var _gitShellOutStrategy = _interopRequireDefault(require("./git-shell-out-strategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  create(workingDir, options = {}) {
    return this.withStrategies([_gitShellOutStrategy.default])(workingDir, options);
  },

  withStrategies(strategies) {
    return function createForStrategies(workingDir, options = {}) {
      const parallelism = options.parallelism || Math.max(3, _os.default.cpus().length);
      const commandQueue = new _asyncQueue.default({
        parallelism
      });

      const strategyOptions = _objectSpread({}, options, {
        queue: commandQueue
      });

      const strategyInstances = strategies.map(Strategy => new Strategy(workingDir, strategyOptions));
      return (0, _helpers.firstImplementer)(...strategyInstances);
    };
  }

};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9jb21wb3NpdGUtZ2l0LXN0cmF0ZWd5LmpzIl0sIm5hbWVzIjpbImNyZWF0ZSIsIndvcmtpbmdEaXIiLCJvcHRpb25zIiwid2l0aFN0cmF0ZWdpZXMiLCJHaXRTaGVsbE91dFN0cmF0ZWd5Iiwic3RyYXRlZ2llcyIsImNyZWF0ZUZvclN0cmF0ZWdpZXMiLCJwYXJhbGxlbGlzbSIsIk1hdGgiLCJtYXgiLCJvcyIsImNwdXMiLCJsZW5ndGgiLCJjb21tYW5kUXVldWUiLCJBc3luY1F1ZXVlIiwic3RyYXRlZ3lPcHRpb25zIiwicXVldWUiLCJzdHJhdGVneUluc3RhbmNlcyIsIm1hcCIsIlN0cmF0ZWd5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxNQUFNLENBQUNDLFVBQUQsRUFBYUMsT0FBTyxHQUFHLEVBQXZCLEVBQTJCO0FBQy9CLFdBQU8sS0FBS0MsY0FBTCxDQUFvQixDQUFDQyw0QkFBRCxDQUFwQixFQUEyQ0gsVUFBM0MsRUFBdURDLE9BQXZELENBQVA7QUFDRCxHQUhZOztBQUtiQyxFQUFBQSxjQUFjLENBQUNFLFVBQUQsRUFBYTtBQUN6QixXQUFPLFNBQVNDLG1CQUFULENBQTZCTCxVQUE3QixFQUF5Q0MsT0FBTyxHQUFHLEVBQW5ELEVBQXVEO0FBQzVELFlBQU1LLFdBQVcsR0FBR0wsT0FBTyxDQUFDSyxXQUFSLElBQXVCQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlDLFlBQUdDLElBQUgsR0FBVUMsTUFBdEIsQ0FBM0M7QUFDQSxZQUFNQyxZQUFZLEdBQUcsSUFBSUMsbUJBQUosQ0FBZTtBQUFDUCxRQUFBQTtBQUFELE9BQWYsQ0FBckI7O0FBQ0EsWUFBTVEsZUFBZSxxQkFBT2IsT0FBUDtBQUFnQmMsUUFBQUEsS0FBSyxFQUFFSDtBQUF2QixRQUFyQjs7QUFFQSxZQUFNSSxpQkFBaUIsR0FBR1osVUFBVSxDQUFDYSxHQUFYLENBQWVDLFFBQVEsSUFBSSxJQUFJQSxRQUFKLENBQWFsQixVQUFiLEVBQXlCYyxlQUF6QixDQUEzQixDQUExQjtBQUNBLGFBQU8sK0JBQWlCLEdBQUdFLGlCQUFwQixDQUFQO0FBQ0QsS0FQRDtBQVFEOztBQWRZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3MgZnJvbSAnb3MnO1xuXG5pbXBvcnQge2ZpcnN0SW1wbGVtZW50ZXJ9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgQXN5bmNRdWV1ZSBmcm9tICcuL2FzeW5jLXF1ZXVlJztcbmltcG9ydCBHaXRTaGVsbE91dFN0cmF0ZWd5IGZyb20gJy4vZ2l0LXNoZWxsLW91dC1zdHJhdGVneSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY3JlYXRlKHdvcmtpbmdEaXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLndpdGhTdHJhdGVnaWVzKFtHaXRTaGVsbE91dFN0cmF0ZWd5XSkod29ya2luZ0Rpciwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgd2l0aFN0cmF0ZWdpZXMoc3RyYXRlZ2llcykge1xuICAgIHJldHVybiBmdW5jdGlvbiBjcmVhdGVGb3JTdHJhdGVnaWVzKHdvcmtpbmdEaXIsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgY29uc3QgcGFyYWxsZWxpc20gPSBvcHRpb25zLnBhcmFsbGVsaXNtIHx8IE1hdGgubWF4KDMsIG9zLmNwdXMoKS5sZW5ndGgpO1xuICAgICAgY29uc3QgY29tbWFuZFF1ZXVlID0gbmV3IEFzeW5jUXVldWUoe3BhcmFsbGVsaXNtfSk7XG4gICAgICBjb25zdCBzdHJhdGVneU9wdGlvbnMgPSB7Li4ub3B0aW9ucywgcXVldWU6IGNvbW1hbmRRdWV1ZX07XG5cbiAgICAgIGNvbnN0IHN0cmF0ZWd5SW5zdGFuY2VzID0gc3RyYXRlZ2llcy5tYXAoU3RyYXRlZ3kgPT4gbmV3IFN0cmF0ZWd5KHdvcmtpbmdEaXIsIHN0cmF0ZWd5T3B0aW9ucykpO1xuICAgICAgcmV0dXJuIGZpcnN0SW1wbGVtZW50ZXIoLi4uc3RyYXRlZ3lJbnN0YW5jZXMpO1xuICAgIH07XG4gIH0sXG59O1xuIl19