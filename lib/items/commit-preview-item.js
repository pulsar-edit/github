"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _propTypes2 = require("../prop-types");
var _commitPreviewContainer = _interopRequireDefault(require("../containers/commit-preview-container"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommitPreviewItem extends _react.default.Component {
  static buildURI(workingDirectory) {
    return `atom-github://commit-preview?workdir=${encodeURIComponent(workingDirectory)}`;
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
    return _react.default.createElement(_commitPreviewContainer.default, _extends({
      itemType: this.constructor,
      repository: repository
    }, this.props, {
      destroy: this.destroy,
      refEditor: this.refEditor,
      refInitialFocus: this.refInitialFocus
    }));
  }
  getTitle() {
    return 'Staged Changes';
  }
  getIconName() {
    return 'tasklist';
  }
  observeEmbeddedTextEditor(cb) {
    this.refEditor.map(editor => editor.isAlive() && cb(editor));
    return this.emitter.on('did-change-embedded-text-editor', cb);
  }
  getWorkingDirectory() {
    return this.props.workingDirectory;
  }
  serialize() {
    return {
      deserializer: 'CommitPreviewStub',
      uri: CommitPreviewItem.buildURI(this.props.workingDirectory)
    };
  }
  focus() {
    this.refInitialFocus.map(focusable => focusable.focus());
  }
}
exports.default = CommitPreviewItem;
_defineProperty(CommitPreviewItem, "propTypes", {
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  workingDirectory: _propTypes.default.string.isRequired,
  discardLines: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceToCommitPreviewButton: _propTypes.default.func.isRequired
});
_defineProperty(CommitPreviewItem, "uriPattern", 'atom-github://commit-preview?workdir={workingDirectory}');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXRQcmV2aWV3SXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJ3b3JraW5nRGlyZWN0b3J5IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzRGVzdHJveWVkIiwiZW1pdHRlciIsImVtaXQiLCJFbWl0dGVyIiwiaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSIsInJlZkluaXRpYWxGb2N1cyIsIlJlZkhvbGRlciIsInJlZkVkaXRvciIsIm9ic2VydmUiLCJlZGl0b3IiLCJpc0FsaXZlIiwidGVybWluYXRlUGVuZGluZ1N0YXRlIiwib25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUiLCJjYWxsYmFjayIsIm9uIiwib25EaWREZXN0cm95IiwicmVuZGVyIiwicmVwb3NpdG9yeSIsIndvcmtkaXJDb250ZXh0UG9vbCIsImdldENvbnRleHQiLCJnZXRSZXBvc2l0b3J5IiwiZGVzdHJveSIsImdldFRpdGxlIiwiZ2V0SWNvbk5hbWUiLCJvYnNlcnZlRW1iZWRkZWRUZXh0RWRpdG9yIiwiY2IiLCJtYXAiLCJnZXRXb3JraW5nRGlyZWN0b3J5Iiwic2VyaWFsaXplIiwiZGVzZXJpYWxpemVyIiwidXJpIiwiZm9jdXMiLCJmb2N1c2FibGUiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJkaXNjYXJkTGluZXMiLCJmdW5jIiwidW5kb0xhc3REaXNjYXJkIiwic3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbiJdLCJzb3VyY2VzIjpbImNvbW1pdC1wcmV2aWV3LWl0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7V29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IENvbW1pdFByZXZpZXdDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9jb21taXQtcHJldmlldy1jb250YWluZXInO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdFByZXZpZXdJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgd29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgZGlzY2FyZExpbmVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9jb21taXQtcHJldmlldz93b3JrZGlyPXt3b3JraW5nRGlyZWN0b3J5fSdcblxuICBzdGF0aWMgYnVpbGRVUkkod29ya2luZ0RpcmVjdG9yeSkge1xuICAgIHJldHVybiBgYXRvbS1naXRodWI6Ly9jb21taXQtcHJldmlldz93b3JrZGlyPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHdvcmtpbmdEaXJlY3RvcnkpfWA7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHRoaXMuaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMucmVmSW5pdGlhbEZvY3VzID0gbmV3IFJlZkhvbGRlcigpO1xuXG4gICAgdGhpcy5yZWZFZGl0b3IgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3Iub2JzZXJ2ZShlZGl0b3IgPT4ge1xuICAgICAgaWYgKGVkaXRvci5pc0FsaXZlKCkpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtZW1iZWRkZWQtdGV4dC1lZGl0b3InLCBlZGl0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGVybWluYXRlUGVuZGluZ1N0YXRlKCkge1xuICAgIGlmICghdGhpcy5oYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXRlcm1pbmF0ZS1wZW5kaW5nLXN0YXRlJyk7XG4gICAgICB0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXRlcm1pbmF0ZS1wZW5kaW5nLXN0YXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSA9ICgpID0+IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95Jyk7XG4gICAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXBvc2l0b3J5ID0gdGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2wuZ2V0Q29udGV4dCh0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnkpLmdldFJlcG9zaXRvcnkoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWl0UHJldmlld0NvbnRhaW5lclxuICAgICAgICBpdGVtVHlwZT17dGhpcy5jb25zdHJ1Y3Rvcn1cbiAgICAgICAgcmVwb3NpdG9yeT17cmVwb3NpdG9yeX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgIGRlc3Ryb3k9e3RoaXMuZGVzdHJveX1cbiAgICAgICAgcmVmRWRpdG9yPXt0aGlzLnJlZkVkaXRvcn1cbiAgICAgICAgcmVmSW5pdGlhbEZvY3VzPXt0aGlzLnJlZkluaXRpYWxGb2N1c31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnU3RhZ2VkIENoYW5nZXMnO1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7XG4gICAgcmV0dXJuICd0YXNrbGlzdCc7XG4gIH1cblxuICBvYnNlcnZlRW1iZWRkZWRUZXh0RWRpdG9yKGNiKSB7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3IuaXNBbGl2ZSgpICYmIGNiKGVkaXRvcikpO1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtZW1iZWRkZWQtdGV4dC1lZGl0b3InLCBjYik7XG4gIH1cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3Rvcnk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0NvbW1pdFByZXZpZXdTdHViJyxcbiAgICAgIHVyaTogQ29tbWl0UHJldmlld0l0ZW0uYnVpbGRVUkkodGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5KSxcbiAgICB9O1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5yZWZJbml0aWFsRm9jdXMubWFwKGZvY3VzYWJs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