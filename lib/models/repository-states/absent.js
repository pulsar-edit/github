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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBYnNlbnQiLCJTdGF0ZSIsImlzQWJzZW50Iiwic2hvd0dpdFRhYkluaXQiLCJoYXNEaXJlY3RvcnkiLCJyZWdpc3RlciJdLCJzb3VyY2VzIjpbImFic2VudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RhdGUgZnJvbSAnLi9zdGF0ZSc7XG5cbi8qKlxuICogTm8gd29ya2luZyBkaXJlY3RvcnkgaXMgYXZhaWxhYmxlIGluIHRoZSB3b3Jrc3BhY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFic2VudCBleHRlbmRzIFN0YXRlIHtcbiAgaXNBYnNlbnQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzaG93R2l0VGFiSW5pdCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGhhc0RpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuU3RhdGUucmVnaXN0ZXIoQWJzZW50KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFBNEI7QUFFNUI7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsTUFBTSxTQUFTQyxjQUFLLENBQUM7RUFDeENDLFFBQVEsR0FBRztJQUNULE9BQU8sSUFBSTtFQUNiO0VBRUFDLGNBQWMsR0FBRztJQUNmLE9BQU8sSUFBSTtFQUNiO0VBRUFDLFlBQVksR0FBRztJQUNiLE9BQU8sS0FBSztFQUNkO0FBQ0Y7QUFBQztBQUVESCxjQUFLLENBQUNJLFFBQVEsQ0FBQ0wsTUFBTSxDQUFDIn0=