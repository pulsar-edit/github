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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFbXB0eSIsIlN0YXRlIiwiaXNFbXB0eSIsImluaXQiLCJ0cmFuc2l0aW9uVG8iLCJjbG9uZSIsInJlbW90ZVVybCIsInNvdXJjZVJlbW90ZU5hbWUiLCJzaG93R2l0VGFiSW5pdCIsInJlZ2lzdGVyIl0sInNvdXJjZXMiOlsiZW1wdHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuXG4vKipcbiAqIFRoZSB3b3JraW5nIGRpcmVjdG9yeSBleGlzdHMsIGJ1dCBjb250YWlucyBubyBnaXQgcmVwb3NpdG9yeSB5ZXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5IGV4dGVuZHMgU3RhdGUge1xuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uVG8oJ0luaXRpYWxpemluZycpO1xuICB9XG5cbiAgY2xvbmUocmVtb3RlVXJsLCBzb3VyY2VSZW1vdGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvblRvKCdDbG9uaW5nJywgcmVtb3RlVXJsLCBzb3VyY2VSZW1vdGVOYW1lKTtcbiAgfVxuXG4gIHNob3dHaXRUYWJJbml0KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKEVtcHR5KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFBNEI7QUFFNUI7QUFDQTtBQUNBO0FBQ2UsTUFBTUEsS0FBSyxTQUFTQyxjQUFLLENBQUM7RUFDdkNDLE9BQU8sR0FBRztJQUNSLE9BQU8sSUFBSTtFQUNiO0VBRUFDLElBQUksR0FBRztJQUNMLE9BQU8sSUFBSSxDQUFDQyxZQUFZLENBQUMsY0FBYyxDQUFDO0VBQzFDO0VBRUFDLEtBQUssQ0FBQ0MsU0FBUyxFQUFFQyxnQkFBZ0IsRUFBRTtJQUNqQyxPQUFPLElBQUksQ0FBQ0gsWUFBWSxDQUFDLFNBQVMsRUFBRUUsU0FBUyxFQUFFQyxnQkFBZ0IsQ0FBQztFQUNsRTtFQUVBQyxjQUFjLEdBQUc7SUFDZixPQUFPLElBQUk7RUFDYjtBQUNGO0FBQUM7QUFFRFAsY0FBSyxDQUFDUSxRQUFRLENBQUNULEtBQUssQ0FBQyJ9