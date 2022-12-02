"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * No working directory is available in the workspace.
 */
class Absent extends _state.default {
  isAbsent() {
    return true;
  }

  showGitTabInit() {
    return true;
  }

  hasDirectory() {
    return false;
  }

}

exports.default = Absent;

_state.default.register(Absent);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvYWJzZW50LmpzIl0sIm5hbWVzIjpbIkFic2VudCIsIlN0YXRlIiwiaXNBYnNlbnQiLCJzaG93R2l0VGFiSW5pdCIsImhhc0RpcmVjdG9yeSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxNQUFOLFNBQXFCQyxjQUFyQixDQUEyQjtBQUN4Q0MsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxJQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLGNBQWMsR0FBRztBQUNmLFdBQU8sSUFBUDtBQUNEOztBQUVEQyxFQUFBQSxZQUFZLEdBQUc7QUFDYixXQUFPLEtBQVA7QUFDRDs7QUFYdUM7Ozs7QUFjMUNILGVBQU1JLFFBQU4sQ0FBZUwsTUFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBObyB3b3JraW5nIGRpcmVjdG9yeSBpcyBhdmFpbGFibGUgaW4gdGhlIHdvcmtzcGFjZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJzZW50IGV4dGVuZHMgU3RhdGUge1xuICBpc0Fic2VudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaGFzRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5TdGF0ZS5yZWdpc3RlcihBYnNlbnQpO1xuIl19