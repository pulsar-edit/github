"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _state = _interopRequireDefault(require("./state"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The package is being cleaned up or the context is being disposed some other way.
 */
class Destroyed extends _state.default {
  start() {
    this.didDestroy();
    this.repository.git.destroy && this.repository.git.destroy();
    this.repository.emitter.dispose();
  }
  isDestroyed() {
    return true;
  }
  destroy() {
    // No-op to destroy twice
  }
}
exports.default = Destroyed;
_state.default.register(Destroyed);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEZXN0cm95ZWQiLCJTdGF0ZSIsInN0YXJ0IiwiZGlkRGVzdHJveSIsInJlcG9zaXRvcnkiLCJnaXQiLCJkZXN0cm95IiwiZW1pdHRlciIsImRpc3Bvc2UiLCJpc0Rlc3Ryb3llZCIsInJlZ2lzdGVyIl0sInNvdXJjZXMiOlsiZGVzdHJveWVkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBUaGUgcGFja2FnZSBpcyBiZWluZyBjbGVhbmVkIHVwIG9yIHRoZSBjb250ZXh0IGlzIGJlaW5nIGRpc3Bvc2VkIHNvbWUgb3RoZXIgd2F5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZXN0cm95ZWQgZXh0ZW5kcyBTdGF0ZSB7XG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuZGlkRGVzdHJveSgpO1xuICAgIHRoaXMucmVwb3NpdG9yeS5naXQuZGVzdHJveSAmJiB0aGlzLnJlcG9zaXRvcnkuZ2l0LmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlcG9zaXRvcnkuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cblxuICBpc0Rlc3Ryb3llZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gTm8tb3AgdG8gZGVzdHJveSB0d2ljZVxuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKERlc3Ryb3llZCk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQTRCO0FBRTVCO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLFNBQVMsU0FBU0MsY0FBSyxDQUFDO0VBQzNDQyxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUNDLFVBQVUsRUFBRTtJQUNqQixJQUFJLENBQUNDLFVBQVUsQ0FBQ0MsR0FBRyxDQUFDQyxPQUFPLElBQUksSUFBSSxDQUFDRixVQUFVLENBQUNDLEdBQUcsQ0FBQ0MsT0FBTyxFQUFFO0lBQzVELElBQUksQ0FBQ0YsVUFBVSxDQUFDRyxPQUFPLENBQUNDLE9BQU8sRUFBRTtFQUNuQztFQUVBQyxXQUFXLEdBQUc7SUFDWixPQUFPLElBQUk7RUFDYjtFQUVBSCxPQUFPLEdBQUc7SUFDUjtFQUFBO0FBRUo7QUFBQztBQUVETCxjQUFLLENBQUNTLFFBQVEsQ0FBQ1YsU0FBUyxDQUFDIn0=