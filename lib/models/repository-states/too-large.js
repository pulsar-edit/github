"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _state = _interopRequireDefault(require("./state"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The repository is too large for Atom to handle
 */
class TooLarge extends _state.default {
  isTooLarge() {
    return true;
  }
}
exports.default = TooLarge;
_state.default.register(TooLarge);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUb29MYXJnZSIsIlN0YXRlIiwiaXNUb29MYXJnZSIsInJlZ2lzdGVyIl0sInNvdXJjZXMiOlsidG9vLWxhcmdlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBUaGUgcmVwb3NpdG9yeSBpcyB0b28gbGFyZ2UgZm9yIEF0b20gdG8gaGFuZGxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb0xhcmdlIGV4dGVuZHMgU3RhdGUge1xuICBpc1Rvb0xhcmdlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKFRvb0xhcmdlKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFBNEI7QUFFNUI7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsUUFBUSxTQUFTQyxjQUFLLENBQUM7RUFDMUNDLFVBQVUsR0FBRztJQUNYLE9BQU8sSUFBSTtFQUNiO0FBQ0Y7QUFBQztBQUVERCxjQUFLLENBQUNFLFFBQVEsQ0FBQ0gsUUFBUSxDQUFDIn0=