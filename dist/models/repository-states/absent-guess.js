"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initial state to be used when we anticipate that the workspace will contain zero or many projects once bootstrapping
 * has completed. Presents in the UI like the Absent state, but is "sticky" during the initial package activation.
 */
class AbsentGuess extends _state.default {
  isAbsentGuess() {
    return true;
  }

  isUndetermined() {
    return true;
  }

  showGitTabLoading() {
    return false;
  }

  showGitTabInit() {
    return true;
  }

  hasDirectory() {
    return false;
  }

}

exports.default = AbsentGuess;

_state.default.register(AbsentGuess);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvYWJzZW50LWd1ZXNzLmpzIl0sIm5hbWVzIjpbIkFic2VudEd1ZXNzIiwiU3RhdGUiLCJpc0Fic2VudEd1ZXNzIiwiaXNVbmRldGVybWluZWQiLCJzaG93R2l0VGFiTG9hZGluZyIsInNob3dHaXRUYWJJbml0IiwiaGFzRGlyZWN0b3J5IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsV0FBTixTQUEwQkMsY0FBMUIsQ0FBZ0M7QUFDN0NDLEVBQUFBLGFBQWEsR0FBRztBQUNkLFdBQU8sSUFBUDtBQUNEOztBQUVEQyxFQUFBQSxjQUFjLEdBQUc7QUFDZixXQUFPLElBQVA7QUFDRDs7QUFFREMsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsV0FBTyxLQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLGNBQWMsR0FBRztBQUNmLFdBQU8sSUFBUDtBQUNEOztBQUVEQyxFQUFBQSxZQUFZLEdBQUc7QUFDYixXQUFPLEtBQVA7QUFDRDs7QUFuQjRDOzs7O0FBc0IvQ0wsZUFBTU0sUUFBTixDQUFlUCxXQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuXG4vKipcbiAqIEluaXRpYWwgc3RhdGUgdG8gYmUgdXNlZCB3aGVuIHdlIGFudGljaXBhdGUgdGhhdCB0aGUgd29ya3NwYWNlIHdpbGwgY29udGFpbiB6ZXJvIG9yIG1hbnkgcHJvamVjdHMgb25jZSBib290c3RyYXBwaW5nXG4gKiBoYXMgY29tcGxldGVkLiBQcmVzZW50cyBpbiB0aGUgVUkgbGlrZSB0aGUgQWJzZW50IHN0YXRlLCBidXQgaXMgXCJzdGlja3lcIiBkdXJpbmcgdGhlIGluaXRpYWwgcGFja2FnZSBhY3RpdmF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYnNlbnRHdWVzcyBleHRlbmRzIFN0YXRlIHtcbiAgaXNBYnNlbnRHdWVzcygpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzVW5kZXRlcm1pbmVkKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc2hvd0dpdFRhYkxvYWRpbmcoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2hvd0dpdFRhYkluaXQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBoYXNEaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKEFic2VudEd1ZXNzKTtcbiJdfQ==