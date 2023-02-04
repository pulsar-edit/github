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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBYnNlbnRHdWVzcyIsIlN0YXRlIiwiaXNBYnNlbnRHdWVzcyIsImlzVW5kZXRlcm1pbmVkIiwic2hvd0dpdFRhYkxvYWRpbmciLCJzaG93R2l0VGFiSW5pdCIsImhhc0RpcmVjdG9yeSIsInJlZ2lzdGVyIl0sInNvdXJjZXMiOlsiYWJzZW50LWd1ZXNzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBJbml0aWFsIHN0YXRlIHRvIGJlIHVzZWQgd2hlbiB3ZSBhbnRpY2lwYXRlIHRoYXQgdGhlIHdvcmtzcGFjZSB3aWxsIGNvbnRhaW4gemVybyBvciBtYW55IHByb2plY3RzIG9uY2UgYm9vdHN0cmFwcGluZ1xuICogaGFzIGNvbXBsZXRlZC4gUHJlc2VudHMgaW4gdGhlIFVJIGxpa2UgdGhlIEFic2VudCBzdGF0ZSwgYnV0IGlzIFwic3RpY2t5XCIgZHVyaW5nIHRoZSBpbml0aWFsIHBhY2thZ2UgYWN0aXZhdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJzZW50R3Vlc3MgZXh0ZW5kcyBTdGF0ZSB7XG4gIGlzQWJzZW50R3Vlc3MoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1VuZGV0ZXJtaW5lZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJMb2FkaW5nKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaGFzRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5TdGF0ZS5yZWdpc3RlcihBYnNlbnRHdWVzcyk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQTRCO0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsV0FBVyxTQUFTQyxjQUFLLENBQUM7RUFDN0NDLGFBQWEsR0FBRztJQUNkLE9BQU8sSUFBSTtFQUNiO0VBRUFDLGNBQWMsR0FBRztJQUNmLE9BQU8sSUFBSTtFQUNiO0VBRUFDLGlCQUFpQixHQUFHO0lBQ2xCLE9BQU8sS0FBSztFQUNkO0VBRUFDLGNBQWMsR0FBRztJQUNmLE9BQU8sSUFBSTtFQUNiO0VBRUFDLFlBQVksR0FBRztJQUNiLE9BQU8sS0FBSztFQUNkO0FBQ0Y7QUFBQztBQUVETCxjQUFLLENBQUNNLFFBQVEsQ0FBQ1AsV0FBVyxDQUFDIn0=