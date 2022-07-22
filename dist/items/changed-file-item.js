"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

var _changedFileContainer = _interopRequireDefault(require("../containers/changed-file-container"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ChangedFileItem extends _react.default.Component {
  static buildURI(relPath, workingDirectory, stagingStatus) {
    return 'atom-github://file-patch/' + encodeURIComponent(relPath) + `?workdir=${encodeURIComponent(workingDirectory)}` + `&stagingStatus=${encodeURIComponent(stagingStatus)}`;
  }

  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'destroy');
    this.emitter = new _eventKit.Emitter();
    this.isDestroyed = false;
    this.hasTerminatedPendingState = false;
    this.refEditor = new _refHolder.default();
    this.refEditor.observe(editor => {
      if (editor.isAlive()) {
        this.emitter.emit('did-change-embedded-text-editor', editor);
      }
    });
  }

  getTitle() {
    let title = this.props.stagingStatus === 'staged' ? 'Staged' : 'Unstaged';
    title += ' Changes: ';
    title += this.props.relPath;
    return title;
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

  destroy() {
    /* istanbul ignore else */
    if (!this.isDestroyed) {
      this.emitter.emit('did-destroy');
      this.isDestroyed = true;
    }
  }

  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }

  render() {
    const repository = this.props.workdirContextPool.getContext(this.props.workingDirectory).getRepository();
    return /*#__PURE__*/_react.default.createElement(_changedFileContainer.default, _extends({
      itemType: this.constructor,
      repository: repository,
      destroy: this.destroy,
      refEditor: this.refEditor
    }, this.props));
  }

  observeEmbeddedTextEditor(cb) {
    this.refEditor.map(editor => editor.isAlive() && cb(editor));
    return this.emitter.on('did-change-embedded-text-editor', cb);
  }

  serialize() {
    return {
      deserializer: 'FilePatchControllerStub',
      uri: ChangedFileItem.buildURI(this.props.relPath, this.props.workingDirectory, this.props.stagingStatus)
    };
  }

  getStagingStatus() {
    return this.props.stagingStatus;
  }

  getFilePath() {
    return this.props.relPath;
  }

  getWorkingDirectory() {
    return this.props.workingDirectory;
  }

  isFilePatchItem() {
    return true;
  }

}

exports.default = ChangedFileItem;

_defineProperty(ChangedFileItem, "propTypes", {
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  relPath: _propTypes.default.string.isRequired,
  workingDirectory: _propTypes.default.string.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  discardLines: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceFileAtPath: _propTypes.default.func.isRequired
});

_defineProperty(ChangedFileItem, "uriPattern", 'atom-github://file-patch/{relPath...}?workdir={workingDirectory}&stagingStatus={stagingStatus}');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbS5qcyJdLCJuYW1lcyI6WyJDaGFuZ2VkRmlsZUl0ZW0iLCJSZWFjdCIsIkNvbXBvbmVudCIsImJ1aWxkVVJJIiwicmVsUGF0aCIsIndvcmtpbmdEaXJlY3RvcnkiLCJzdGFnaW5nU3RhdHVzIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImVtaXR0ZXIiLCJFbWl0dGVyIiwiaXNEZXN0cm95ZWQiLCJoYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlIiwicmVmRWRpdG9yIiwiUmVmSG9sZGVyIiwib2JzZXJ2ZSIsImVkaXRvciIsImlzQWxpdmUiLCJlbWl0IiwiZ2V0VGl0bGUiLCJ0aXRsZSIsInRlcm1pbmF0ZVBlbmRpbmdTdGF0ZSIsIm9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIiwiY2FsbGJhY2siLCJvbiIsImRlc3Ryb3kiLCJvbkRpZERlc3Ryb3kiLCJyZW5kZXIiLCJyZXBvc2l0b3J5Iiwid29ya2RpckNvbnRleHRQb29sIiwiZ2V0Q29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJvYnNlcnZlRW1iZWRkZWRUZXh0RWRpdG9yIiwiY2IiLCJtYXAiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ1cmkiLCJnZXRTdGFnaW5nU3RhdHVzIiwiZ2V0RmlsZVBhdGgiLCJnZXRXb3JraW5nRGlyZWN0b3J5IiwiaXNGaWxlUGF0Y2hJdGVtIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwib25lT2YiLCJ3b3Jrc3BhY2UiLCJvYmplY3QiLCJjb21tYW5kcyIsImtleW1hcHMiLCJ0b29sdGlwcyIsImNvbmZpZyIsImRpc2NhcmRMaW5lcyIsImZ1bmMiLCJ1bmRvTGFzdERpc2NhcmQiLCJzdXJmYWNlRmlsZUF0UGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztB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UyxFQUFBQSxNQUFNLEVBQUVSLG1CQUFVSSxNQUFWLENBQWlCTCxVQVhSO0FBYWpCVSxFQUFBQSxZQUFZLEVBQUVULG1CQUFVVSxJQUFWLENBQWVYLFVBYlo7QUFjakJZLEVBQUFBLGVBQWUsRUFBRVgsbUJBQVVVLElBQVYsQ0FBZVgsVUFkZjtBQWVqQmEsRUFBQUEsaUJBQWlCLEVBQUVaLG1CQUFVVSxJQUFWLENBQWVYO0FBZmpCLEM7O2dCQURBNUMsZSxnQkFtQkMsZ0ciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBDaGFuZ2VkRmlsZUNvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2NoYW5nZWQtZmlsZS1jb250YWluZXInO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5nZWRGaWxlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya2RpckNvbnRleHRQb29sOiBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgcmVsUGF0aDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWydzdGFnZWQnLCAndW5zdGFnZWQnXSksXG5cbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgZGlzY2FyZExpbmVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdXJmYWNlRmlsZUF0UGF0aDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyB1cmlQYXR0ZXJuID0gJ2F0b20tZ2l0aHViOi8vZmlsZS1wYXRjaC97cmVsUGF0aC4uLn0/d29ya2Rpcj17d29ya2luZ0RpcmVjdG9yeX0mc3RhZ2luZ1N0YXR1cz17c3RhZ2luZ1N0YXR1c30nXG5cbiAgc3RhdGljIGJ1aWxkVVJJKHJlbFBhdGgsIHdvcmtpbmdEaXJlY3RvcnksIHN0YWdpbmdTdGF0dXMpIHtcbiAgICByZXR1cm4gJ2F0b20tZ2l0aHViOi8vZmlsZS1wYXRjaC8nICtcbiAgICAgIGVuY29kZVVSSUNvbXBvbmVudChyZWxQYXRoKSArXG4gICAgICBgP3dvcmtkaXI9JHtlbmNvZGVVUklDb21wb25lbnQod29ya2luZ0RpcmVjdG9yeSl9YCArXG4gICAgICBgJnN0YWdpbmdTdGF0dXM9JHtlbmNvZGVVUklDb21wb25lbnQoc3RhZ2luZ1N0YXR1cyl9YDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdkZXN0cm95Jyk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMucmVmRWRpdG9yID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVmRWRpdG9yLm9ic2VydmUoZWRpdG9yID0+IHtcbiAgICAgIGlmIChlZGl0b3IuaXNBbGl2ZSgpKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWVtYmVkZGVkLXRleHQtZWRpdG9yJywgZWRpdG9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIGxldCB0aXRsZSA9IHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3N0YWdlZCcgPyAnU3RhZ2VkJyA6ICdVbnN0YWdlZCc7XG4gICAgdGl0bGUgKz0gJyBDaGFuZ2VzOiAnO1xuICAgIHRpdGxlICs9IHRoaXMucHJvcHMucmVsUGF0aDtcbiAgICByZXR1cm4gdGl0bGU7XG4gIH1cblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdGVybWluYXRlLXBlbmRpbmctc3RhdGUnKTtcbiAgICAgIHRoaXMuaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgb25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdGVybWluYXRlLXBlbmRpbmctc3RhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKTtcbiAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkRGVzdHJveShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbC5nZXRDb250ZXh0KHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeSkuZ2V0UmVwb3NpdG9yeSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDaGFuZ2VkRmlsZUNvbnRhaW5lclxuICAgICAgICBpdGVtVHlwZT17dGhpcy5jb25zdHJ1Y3Rvcn1cbiAgICAgICAgcmVwb3NpdG9yeT17cmVwb3NpdG9yeX1cbiAgICAgICAgZGVzdHJveT17dGhpcy5kZXN0cm95fVxuICAgICAgICByZWZFZGl0b3I9e3RoaXMucmVmRWRpdG9yfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIG9ic2VydmVFbWJlZGRlZFRleHRFZGl0b3IoY2IpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5pc0FsaXZlKCkgJiYgY2IoZWRpdG9yKSk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1lbWJlZGRlZC10ZXh0LWVkaXRvcicsIGNiKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnRmlsZVBhdGNoQ29udHJvbGxlclN0dWInLFxuICAgICAgdXJpOiBDaGFuZ2VkRmlsZUl0ZW0uYnVpbGRVUkkodGhpcy5wcm9wcy5yZWxQYXRoLCB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnksIHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyksXG4gICAgfTtcbiAgfVxuXG4gIGdldFN0YWdpbmdTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cztcbiAgfVxuXG4gIGdldEZpbGVQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlbFBhdGg7XG4gIH1cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3Rvcnk7XG4gIH1cblxuICBpc0ZpbGVQYXRjaEl0ZW0oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==