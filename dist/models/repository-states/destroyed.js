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

  destroy() {// No-op to destroy twice
  }

}

exports.default = Destroyed;

_state.default.register(Destroyed);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvZGVzdHJveWVkLmpzIl0sIm5hbWVzIjpbIkRlc3Ryb3llZCIsIlN0YXRlIiwic3RhcnQiLCJkaWREZXN0cm95IiwicmVwb3NpdG9yeSIsImdpdCIsImRlc3Ryb3kiLCJlbWl0dGVyIiwiZGlzcG9zZSIsImlzRGVzdHJveWVkIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLFNBQU4sU0FBd0JDLGNBQXhCLENBQThCO0FBQzNDQyxFQUFBQSxLQUFLLEdBQUc7QUFDTixTQUFLQyxVQUFMO0FBQ0EsU0FBS0MsVUFBTCxDQUFnQkMsR0FBaEIsQ0FBb0JDLE9BQXBCLElBQStCLEtBQUtGLFVBQUwsQ0FBZ0JDLEdBQWhCLENBQW9CQyxPQUFwQixFQUEvQjtBQUNBLFNBQUtGLFVBQUwsQ0FBZ0JHLE9BQWhCLENBQXdCQyxPQUF4QjtBQUNEOztBQUVEQyxFQUFBQSxXQUFXLEdBQUc7QUFDWixXQUFPLElBQVA7QUFDRDs7QUFFREgsRUFBQUEsT0FBTyxHQUFHLENBQ1I7QUFDRDs7QUFiMEM7Ozs7QUFnQjdDTCxlQUFNUyxRQUFOLENBQWVWLFNBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RhdGUgZnJvbSAnLi9zdGF0ZSc7XG5cbi8qKlxuICogVGhlIHBhY2thZ2UgaXMgYmVpbmcgY2xlYW5lZCB1cCBvciB0aGUgY29udGV4dCBpcyBiZWluZyBkaXNwb3NlZCBzb21lIG90aGVyIHdheS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVzdHJveWVkIGV4dGVuZHMgU3RhdGUge1xuICBzdGFydCgpIHtcbiAgICB0aGlzLmRpZERlc3Ryb3koKTtcbiAgICB0aGlzLnJlcG9zaXRvcnkuZ2l0LmRlc3Ryb3kgJiYgdGhpcy5yZXBvc2l0b3J5LmdpdC5kZXN0cm95KCk7XG4gICAgdGhpcy5yZXBvc2l0b3J5LmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgaXNEZXN0cm95ZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8vIE5vLW9wIHRvIGRlc3Ryb3kgdHdpY2VcbiAgfVxufVxuXG5TdGF0ZS5yZWdpc3RlcihEZXN0cm95ZWQpO1xuIl19