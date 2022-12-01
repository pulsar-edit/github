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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvdG9vLWxhcmdlLmpzIl0sIm5hbWVzIjpbIlRvb0xhcmdlIiwiU3RhdGUiLCJpc1Rvb0xhcmdlIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLFFBQU4sU0FBdUJDLGNBQXZCLENBQTZCO0FBQzFDQyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxXQUFPLElBQVA7QUFDRDs7QUFIeUM7Ozs7QUFNNUNELGVBQU1FLFFBQU4sQ0FBZUgsUUFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBUaGUgcmVwb3NpdG9yeSBpcyB0b28gbGFyZ2UgZm9yIEF0b20gdG8gaGFuZGxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb0xhcmdlIGV4dGVuZHMgU3RhdGUge1xuICBpc1Rvb0xhcmdlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKFRvb0xhcmdlKTtcbiJdfQ==