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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGUiLCJ3b3JraW5nRGlyIiwib3B0aW9ucyIsIndpdGhTdHJhdGVnaWVzIiwiR2l0U2hlbGxPdXRTdHJhdGVneSIsInN0cmF0ZWdpZXMiLCJjcmVhdGVGb3JTdHJhdGVnaWVzIiwicGFyYWxsZWxpc20iLCJNYXRoIiwibWF4Iiwib3MiLCJjcHVzIiwibGVuZ3RoIiwiY29tbWFuZFF1ZXVlIiwiQXN5bmNRdWV1ZSIsInN0cmF0ZWd5T3B0aW9ucyIsInF1ZXVlIiwic3RyYXRlZ3lJbnN0YW5jZXMiLCJtYXAiLCJTdHJhdGVneSIsImZpcnN0SW1wbGVtZW50ZXIiXSwic291cmNlcyI6WyJjb21wb3NpdGUtZ2l0LXN0cmF0ZWd5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcyBmcm9tICdvcyc7XG5cbmltcG9ydCB7Zmlyc3RJbXBsZW1lbnRlcn0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBBc3luY1F1ZXVlIGZyb20gJy4vYXN5bmMtcXVldWUnO1xuaW1wb3J0IEdpdFNoZWxsT3V0U3RyYXRlZ3kgZnJvbSAnLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjcmVhdGUod29ya2luZ0Rpciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aFN0cmF0ZWdpZXMoW0dpdFNoZWxsT3V0U3RyYXRlZ3ldKSh3b3JraW5nRGlyLCBvcHRpb25zKTtcbiAgfSxcblxuICB3aXRoU3RyYXRlZ2llcyhzdHJhdGVnaWVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUZvclN0cmF0ZWdpZXMod29ya2luZ0Rpciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICBjb25zdCBwYXJhbGxlbGlzbSA9IG9wdGlvbnMucGFyYWxsZWxpc20gfHwgTWF0aC5tYXgoMywgb3MuY3B1cygpLmxlbmd0aCk7XG4gICAgICBjb25zdCBjb21tYW5kUXVldWUgPSBuZXcgQXN5bmNRdWV1ZSh7cGFyYWxsZWxpc219KTtcbiAgICAgIGNvbnN0IHN0cmF0ZWd5T3B0aW9ucyA9IHsuLi5vcHRpb25zLCBxdWV1ZTogY29tbWFuZFF1ZXVlfTtcblxuICAgICAgY29uc3Qgc3RyYXRlZ3lJbnN0YW5jZXMgPSBzdHJhdGVnaWVzLm1hcChTdHJhdGVneSA9PiBuZXcgU3RyYXRlZ3kod29ya2luZ0Rpciwgc3RyYXRlZ3lPcHRpb25zKSk7XG4gICAgICByZXR1cm4gZmlyc3RJbXBsZW1lbnRlciguLi5zdHJhdGVneUluc3RhbmNlcyk7XG4gICAgfTtcbiAgfSxcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQTJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBRTVDO0VBQ2JBLE1BQU0sQ0FBQ0MsVUFBVSxFQUFFQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDL0IsT0FBTyxJQUFJLENBQUNDLGNBQWMsQ0FBQyxDQUFDQyw0QkFBbUIsQ0FBQyxDQUFDLENBQUNILFVBQVUsRUFBRUMsT0FBTyxDQUFDO0VBQ3hFLENBQUM7RUFFREMsY0FBYyxDQUFDRSxVQUFVLEVBQUU7SUFDekIsT0FBTyxTQUFTQyxtQkFBbUIsQ0FBQ0wsVUFBVSxFQUFFQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDNUQsTUFBTUssV0FBVyxHQUFHTCxPQUFPLENBQUNLLFdBQVcsSUFBSUMsSUFBSSxDQUFDQyxHQUFHLENBQUMsQ0FBQyxFQUFFQyxXQUFFLENBQUNDLElBQUksRUFBRSxDQUFDQyxNQUFNLENBQUM7TUFDeEUsTUFBTUMsWUFBWSxHQUFHLElBQUlDLG1CQUFVLENBQUM7UUFBQ1A7TUFBVyxDQUFDLENBQUM7TUFDbEQsTUFBTVEsZUFBZSxxQkFBT2IsT0FBTztRQUFFYyxLQUFLLEVBQUVIO01BQVksRUFBQztNQUV6RCxNQUFNSSxpQkFBaUIsR0FBR1osVUFBVSxDQUFDYSxHQUFHLENBQUNDLFFBQVEsSUFBSSxJQUFJQSxRQUFRLENBQUNsQixVQUFVLEVBQUVjLGVBQWUsQ0FBQyxDQUFDO01BQy9GLE9BQU8sSUFBQUsseUJBQWdCLEVBQUMsR0FBR0gsaUJBQWlCLENBQUM7SUFDL0MsQ0FBQztFQUNIO0FBQ0YsQ0FBQztBQUFBIn0=