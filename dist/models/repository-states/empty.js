"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The working directory exists, but contains no git repository yet.
 */
class Empty extends _state.default {
  isEmpty() {
    return true;
  }

  init() {
    return this.transitionTo('Initializing');
  }

  clone(remoteUrl, sourceRemoteName) {
    return this.transitionTo('Cloning', remoteUrl, sourceRemoteName);
  }

  showGitTabInit() {
    return true;
  }

}

exports.default = Empty;

_state.default.register(Empty);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvZW1wdHkuanMiXSwibmFtZXMiOlsiRW1wdHkiLCJTdGF0ZSIsImlzRW1wdHkiLCJpbml0IiwidHJhbnNpdGlvblRvIiwiY2xvbmUiLCJyZW1vdGVVcmwiLCJzb3VyY2VSZW1vdGVOYW1lIiwic2hvd0dpdFRhYkluaXQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUE7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsS0FBTixTQUFvQkMsY0FBcEIsQ0FBMEI7QUFDdkNDLEVBQUFBLE9BQU8sR0FBRztBQUNSLFdBQU8sSUFBUDtBQUNEOztBQUVEQyxFQUFBQSxJQUFJLEdBQUc7QUFDTCxXQUFPLEtBQUtDLFlBQUwsQ0FBa0IsY0FBbEIsQ0FBUDtBQUNEOztBQUVEQyxFQUFBQSxLQUFLLENBQUNDLFNBQUQsRUFBWUMsZ0JBQVosRUFBOEI7QUFDakMsV0FBTyxLQUFLSCxZQUFMLENBQWtCLFNBQWxCLEVBQTZCRSxTQUE3QixFQUF3Q0MsZ0JBQXhDLENBQVA7QUFDRDs7QUFFREMsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsV0FBTyxJQUFQO0FBQ0Q7O0FBZnNDOzs7O0FBa0J6Q1AsZUFBTVEsUUFBTixDQUFlVCxLQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuXG4vKipcbiAqIFRoZSB3b3JraW5nIGRpcmVjdG9yeSBleGlzdHMsIGJ1dCBjb250YWlucyBubyBnaXQgcmVwb3NpdG9yeSB5ZXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5IGV4dGVuZHMgU3RhdGUge1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uVG8oJ0luaXRpYWxpemluZycpO1xuICB9XG5cbiAgY2xvbmUocmVtb3RlVXJsLCBzb3VyY2VSZW1vdGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvblRvKCdDbG9uaW5nJywgcmVtb3RlVXJsLCBzb3VyY2VSZW1vdGVOYW1lKTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKEVtcHR5KTtcbiJdfQ==