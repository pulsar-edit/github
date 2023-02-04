"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _propTypes2 = require("../prop-types");
var _commitDetailContainer = _interopRequireDefault(require("../containers/commit-detail-container"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommitDetailItem extends _react.default.Component {
  static buildURI(workingDirectory, sha) {
    return `atom-github://commit-detail?workdir=${encodeURIComponent(workingDirectory)}&sha=${encodeURIComponent(sha)}`;
  }
  constructor(props) {
    super(props);
    _defineProperty(this, "destroy", () => {
      /* istanbul ignore else */
      if (!this.isDestroyed) {
        this.emitter.emit('did-destroy');
        this.isDestroyed = true;
      }
    });
    this.emitter = new _eventKit.Emitter();
    this.isDestroyed = false;
    this.hasTerminatedPendingState = false;
    this.shouldFocus = true;
    this.refInitialFocus = new _refHolder.default();
    this.refEditor = new _refHolder.default();
    this.refEditor.observe(editor => {
      if (editor.isAlive()) {
        this.emitter.emit('did-change-embedded-text-editor', editor);
      }
    });
  }
  terminatePendingState() {
    if (!this.hasTerminatedPendingState) {
      this.emitter.emit('did-terminate-pending-state');
      this.hasTerminatedPendingState = true;
    }
  }
  onDidTerminatePendingState(callback) {
    return this.emitter.on('did-terminate-pending-state', callback);
  }
  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }
  render() {
    const repository = this.props.workdirContextPool.getContext(this.props.workingDirectory).getRepository();
    return _react.default.createElement(_commitDetailContainer.default, _extends({
      itemType: this.constructor,
      repository: repository
    }, this.props, {
      destroy: this.destroy,
      refEditor: this.refEditor,
      refInitialFocus: this.refInitialFocus
    }));
  }
  getTitle() {
    return `Commit: ${this.props.sha}`;
  }
  getIconName() {
    return 'git-commit';
  }
  observeEmbeddedTextEditor(cb) {
    this.refEditor.map(editor => editor.isAlive() && cb(editor));
    return this.emitter.on('did-change-embedded-text-editor', cb);
  }
  getWorkingDirectory() {
    return this.props.workingDirectory;
  }
  getSha() {
    return this.props.sha;
  }
  serialize() {
    return {
      deserializer: 'CommitDetailStub',
      uri: CommitDetailItem.buildURI(this.props.workingDirectory, this.props.sha)
    };
  }
  preventFocus() {
    this.shouldFocus = false;
  }
  focus() {
    this.refInitialFocus.getPromise().then(focusable => {
      if (!this.shouldFocus) {
        return;
      }
      focusable.focus();
    });
  }
}
exports.default = CommitDetailItem;
_defineProperty(CommitDetailItem, "propTypes", {
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  workingDirectory: _propTypes.default.string.isRequired,
  sha: _propTypes.default.string.isRequired
});
_defineProperty(CommitDetailItem, "uriPattern", 'atom-github://commit-detail?workdir={workingDirectory}&sha={sha}');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXREZXRhaWxJdGVtIiwiUmVhY3QiLCJDb21wb25lbnQiLCJidWlsZFVSSSIsIndvcmtpbmdEaXJlY3RvcnkiLCJzaGEiLCJlbmNvZGVVUklDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXNEZXN0cm95ZWQiLCJlbWl0dGVyIiwiZW1pdCIsIkVtaXR0ZXIiLCJoYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlIiwic2hvdWxkRm9jdXMiLCJyZWZJbml0aWFsRm9jdXMiLCJSZWZIb2xkZXIiLCJyZWZFZGl0b3IiLCJvYnNlcnZlIiwiZWRpdG9yIiwiaXNBbGl2ZSIsInRlcm1pbmF0ZVBlbmRpbmdTdGF0ZSIsIm9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIiwiY2FsbGJhY2siLCJvbiIsIm9uRGlkRGVzdHJveSIsInJlbmRlciIsInJlcG9zaXRvcnkiLCJ3b3JrZGlyQ29udGV4dFBvb2wiLCJnZXRDb250ZXh0IiwiZ2V0UmVwb3NpdG9yeSIsImRlc3Ryb3kiLCJnZXRUaXRsZSIsImdldEljb25OYW1lIiwib2JzZXJ2ZUVtYmVkZGVkVGV4dEVkaXRvciIsImNiIiwibWFwIiwiZ2V0V29ya2luZ0RpcmVjdG9yeSIsImdldFNoYSIsInNlcmlhbGl6ZSIsImRlc2VyaWFsaXplciIsInVyaSIsInByZXZlbnRGb2N1cyIsImZvY3VzIiwiZ2V0UHJvbWlzZSIsInRoZW4iLCJmb2N1c2FibGUiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciXSwic291cmNlcyI6WyJjb21taXQtZGV0YWlsLWl0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7V29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IENvbW1pdERldGFpbENvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2NvbW1pdC1kZXRhaWwtY29udGFpbmVyJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXREZXRhaWxJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgd29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHNoYTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9jb21taXQtZGV0YWlsP3dvcmtkaXI9e3dvcmtpbmdEaXJlY3Rvcnl9JnNoYT17c2hhfSdcblxuICBzdGF0aWMgYnVpbGRVUkkod29ya2luZ0RpcmVjdG9yeSwgc2hhKSB7XG4gICAgcmV0dXJuIGBhdG9tLWdpdGh1YjovL2NvbW1pdC1kZXRhaWw/d29ya2Rpcj0ke2VuY29kZVVSSUNvbXBvbmVudCh3b3JraW5nRGlyZWN0b3J5KX0mc2hhPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHNoYSl9YDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5oYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5zaG91bGRGb2N1cyA9IHRydWU7XG4gICAgdGhpcy5yZWZJbml0aWFsRm9jdXMgPSBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgICB0aGlzLnJlZkVkaXRvciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvci5vYnNlcnZlKGVkaXRvciA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmlzQWxpdmUoKSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1lbWJlZGRlZC10ZXh0LWVkaXRvcicsIGVkaXRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdGVybWluYXRlLXBlbmRpbmctc3RhdGUnKTtcbiAgICAgIHRoaXMuaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgb25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdGVybWluYXRlLXBlbmRpbmctc3RhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95ID0gKCkgPT4ge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKTtcbiAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkRGVzdHJveShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbC5nZXRDb250ZXh0KHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeSkuZ2V0UmVwb3NpdG9yeSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXREZXRhaWxDb250YWluZXJcbiAgICAgICAgaXRlbVR5cGU9e3RoaXMuY29uc3RydWN0b3J9XG4gICAgICAgIHJlcG9zaXRvcnk9e3JlcG9zaXRvcnl9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICBkZXN0cm95PXt0aGlzLmRlc3Ryb3l9XG4gICAgICAgIHJlZkVkaXRvcj17dGhpcy5yZWZFZGl0b3J9XG4gICAgICAgIHJlZkluaXRpYWxGb2N1cz17dGhpcy5yZWZJbml0aWFsRm9jdXN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gYENvbW1pdDogJHt0aGlzLnByb3BzLnNoYX1gO1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7XG4gICAgcmV0dXJuICdnaXQtY29tbWl0JztcbiAgfVxuXG4gIG9ic2VydmVFbWJlZGRlZFRleHRFZGl0b3IoY2IpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5pc0FsaXZlKCkgJiYgY2IoZWRpdG9yKSk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1lbWJlZGRlZC10ZXh0LWVkaXRvcicsIGNiKTtcbiAgfVxuXG4gIGdldFdvcmtpbmdEaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeTtcbiAgfVxuXG4gIGdldFNoYSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zaGE7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0NvbW1pdERldGFpbFN0dWInLFxuICAgICAgdXJpOiBDb21taXREZXRhaWxJdGVtLmJ1aWxkVVJJKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeSwgdGhpcy5wcm9wcy5zaGEpLFxuICAgIH07XG4gIH1cblxuICBwcmV2ZW50Rm9jdXMoKSB7XG4gICAgdGhpcy5zaG91bGRGb2N1cyA9IGZhbHNlO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5yZWZJbml0aWFsRm9jdXMuZ2V0UHJvbWlzZSgpLnRoZW4oZm9jdXNhYmxlID0+IHtcbiAgICAgIGlmICghdGhpcy5zaG91bGRGb2N1cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvY3VzYWJsZS5mb2N1cygpO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUE2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTlCLE1BQU1BLGdCQUFnQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQVM1RCxPQUFPQyxRQUFRLENBQUNDLGdCQUFnQixFQUFFQyxHQUFHLEVBQUU7SUFDckMsT0FBUSx1Q0FBc0NDLGtCQUFrQixDQUFDRixnQkFBZ0IsQ0FBRSxRQUFPRSxrQkFBa0IsQ0FBQ0QsR0FBRyxDQUFFLEVBQUM7RUFDckg7RUFFQUUsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyxpQ0EyQkwsTUFBTTtNQUNkO01BQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ0MsV0FBVyxFQUFFO1FBQ3JCLElBQUksQ0FBQ0MsT0FBTyxDQUFDQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ2hDLElBQUksQ0FBQ0YsV0FBVyxHQUFHLElBQUk7TUFDekI7SUFDRixDQUFDO0lBL0JDLElBQUksQ0FBQ0MsT0FBTyxHQUFHLElBQUlFLGlCQUFPLEVBQUU7SUFDNUIsSUFBSSxDQUFDSCxXQUFXLEdBQUcsS0FBSztJQUN4QixJQUFJLENBQUNJLHlCQUF5QixHQUFHLEtBQUs7SUFDdEMsSUFBSSxDQUFDQyxXQUFXLEdBQUcsSUFBSTtJQUN2QixJQUFJLENBQUNDLGVBQWUsR0FBRyxJQUFJQyxrQkFBUyxFQUFFO0lBRXRDLElBQUksQ0FBQ0MsU0FBUyxHQUFHLElBQUlELGtCQUFTLEVBQUU7SUFDaEMsSUFB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