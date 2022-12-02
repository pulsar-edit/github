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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvbG9hZGluZy1ndWVzcy5qcyJdLCJuYW1lcyI6WyJMb2FkaW5nR3Vlc3MiLCJTdGF0ZSIsImlzTG9hZGluZ0d1ZXNzIiwiaXNVbmRldGVybWluZWQiLCJzaG93R2l0VGFiTG9hZGluZyIsInNob3dHaXRUYWJJbml0IiwiaGFzRGlyZWN0b3J5IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsWUFBTixTQUEyQkMsY0FBM0IsQ0FBaUM7QUFDOUNDLEVBQUFBLGNBQWMsR0FBRztBQUNmLFdBQU8sSUFBUDtBQUNEOztBQUVEQyxFQUFBQSxjQUFjLEdBQUc7QUFDZixXQUFPLElBQVA7QUFDRDs7QUFFREMsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLGNBQWMsR0FBRztBQUNmLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxFQUFBQSxZQUFZLEdBQUc7QUFDYixXQUFPLEtBQVA7QUFDRDs7QUFuQjZDOzs7O0FBc0JoREwsZUFBTU0sUUFBTixDQUFlUCxZQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuXG4vKipcbiAqIEluaXRpYWwgc3RhdGUgdG8gYmUgdXNlZCB3aGVuIHdlIGFudGljaXBhdGUgdGhhdCB0aGUgd29ya3NwYWNlIHdpbGwgY29udGFpbiBhIHNpbmdsZSBwcm9qZWN0IG9uY2UgYm9vdHN0cmFwcGluZ1xuICogaGFzIGNvbXBsZXRlZC4gUHJlc2VudHMgaW4gdGhlIFVJIGxpa2UgdGhlIExvYWRpbmcgc3RhdGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmdHdWVzcyBleHRlbmRzIFN0YXRlIHtcbiAgaXNMb2FkaW5nR3Vlc3MoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1VuZGV0ZXJtaW5lZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJMb2FkaW5nKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc2hvd0dpdFRhYkluaXQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFzRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5TdGF0ZS5yZWdpc3RlcihMb2FkaW5nR3Vlc3MpO1xuIl19