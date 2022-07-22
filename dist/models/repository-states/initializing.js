"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Git is asynchronously initializing a new repository in this working directory.
 */
class Initializing extends _state.default {
  async start() {
    await this.doInit(this.workdir());
    await this.transitionTo('Loading');
  }

  showGitTabLoading() {
    return true;
  }

  directInit(workdir) {
    return this.git().init(workdir);
  }

}

exports.default = Initializing;

_state.default.register(Initializing);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvaW5pdGlhbGl6aW5nLmpzIl0sIm5hbWVzIjpbIkluaXRpYWxpemluZyIsIlN0YXRlIiwic3RhcnQiLCJkb0luaXQiLCJ3b3JrZGlyIiwidHJhbnNpdGlvblRvIiwic2hvd0dpdFRhYkxvYWRpbmciLCJkaXJlY3RJbml0IiwiZ2l0IiwiaW5pdCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxZQUFOLFNBQTJCQyxjQUEzQixDQUFpQztBQUNuQyxRQUFMQyxLQUFLLEdBQUc7QUFDWixVQUFNLEtBQUtDLE1BQUwsQ0FBWSxLQUFLQyxPQUFMLEVBQVosQ0FBTjtBQUVBLFVBQU0sS0FBS0MsWUFBTCxDQUFrQixTQUFsQixDQUFOO0FBQ0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCLFdBQU8sSUFBUDtBQUNEOztBQUVEQyxFQUFBQSxVQUFVLENBQUNILE9BQUQsRUFBVTtBQUNsQixXQUFPLEtBQUtJLEdBQUwsR0FBV0MsSUFBWCxDQUFnQkwsT0FBaEIsQ0FBUDtBQUNEOztBQWI2Qzs7OztBQWdCaERILGVBQU1TLFFBQU4sQ0FBZVYsWUFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcblxuLyoqXG4gKiBHaXQgaXMgYXN5bmNocm9ub3VzbHkgaW5pdGlhbGl6aW5nIGEgbmV3IHJlcG9zaXRvcnkgaW4gdGhpcyB3b3JraW5nIGRpcmVjdG9yeS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5pdGlhbGl6aW5nIGV4dGVuZHMgU3RhdGUge1xuICBhc3luYyBzdGFydCgpIHtcbiAgICBhd2FpdCB0aGlzLmRvSW5pdCh0aGlzLndvcmtkaXIoKSk7XG5cbiAgICBhd2FpdCB0aGlzLnRyYW5zaXRpb25UbygnTG9hZGluZycpO1xuICB9XG5cbiAgc2hvd0dpdFRhYkxvYWRpbmcoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkaXJlY3RJbml0KHdvcmtkaXIpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5pbml0KHdvcmtkaXIpO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKEluaXRpYWxpemluZyk7XG4iXX0=