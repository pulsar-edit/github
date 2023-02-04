"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _state = _interopRequireDefault(require("./state"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Initial state to be used when we anticipate that the workspace will contain a single project once bootstrapping
 * has completed. Presents in the UI like the Loading state.
 */
class LoadingGuess extends _state.default {
  isLoadingGuess() {
    return true;
  }
  isUndetermined() {
    return true;
  }
  showGitTabLoading() {
    return true;
  }
  showGitTabInit() {
    return false;
  }
  hasDirectory() {
    return false;
  }
}
exports.default = LoadingGuess;
_state.default.register(LoadingGuess);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJMb2FkaW5nR3Vlc3MiLCJTdGF0ZSIsImlzTG9hZGluZ0d1ZXNzIiwiaXNVbmRldGVybWluZWQiLCJzaG93R2l0VGFiTG9hZGluZyIsInNob3dHaXRUYWJJbml0IiwiaGFzRGlyZWN0b3J5IiwicmVnaXN0ZXIiXSwic291cmNlcyI6WyJsb2FkaW5nLWd1ZXNzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBJbml0aWFsIHN0YXRlIHRvIGJlIHVzZWQgd2hlbiB3ZSBhbnRpY2lwYXRlIHRoYXQgdGhlIHdvcmtzcGFjZSB3aWxsIGNvbnRhaW4gYSBzaW5nbGUgcHJvamVjdCBvbmNlIGJvb3RzdHJhcHBpbmdcbiAqIGhhcyBjb21wbGV0ZWQuIFByZXNlbnRzIGluIHRoZSBVSSBsaWtlIHRoZSBMb2FkaW5nIHN0YXRlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkaW5nR3Vlc3MgZXh0ZW5kcyBTdGF0ZSB7XG4gIGlzTG9hZGluZ0d1ZXNzKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNVbmRldGVybWluZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzaG93R2l0VGFiTG9hZGluZygpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhc0RpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuU3RhdGUucmVnaXN0ZXIoTG9hZGluZ0d1ZXNzKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFBNEI7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxZQUFZLFNBQVNDLGNBQUssQ0FBQztFQUM5Q0MsY0FBYyxHQUFHO0lBQ2YsT0FBTyxJQUFJO0VBQ2I7RUFFQUMsY0FBYyxHQUFHO0lBQ2YsT0FBTyxJQUFJO0VBQ2I7RUFFQUMsaUJBQWlCLEdBQUc7SUFDbEIsT0FBTyxJQUFJO0VBQ2I7RUFFQUMsY0FBYyxHQUFHO0lBQ2YsT0FBTyxLQUFLO0VBQ2Q7RUFFQUMsWUFBWSxHQUFHO0lBQ2IsT0FBTyxLQUFLO0VBQ2Q7QUFDRjtBQUFDO0FBRURMLGNBQUssQ0FBQ00sUUFBUSxDQUFDUCxZQUFZLENBQUMifQ==