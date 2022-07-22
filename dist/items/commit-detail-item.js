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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement(_commitDetailContainer.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9jb21taXQtZGV0YWlsLWl0ZW0uanMiXSwibmFtZXMiOlsiQ29tbWl0RGV0YWlsSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJ3b3JraW5nRGlyZWN0b3J5Iiwic2hhIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzRGVzdHJveWVkIiwiZW1pdHRlciIsImVtaXQiLCJFbWl0dGVyIiwiaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSIsInNob3VsZEZvY3VzIiwicmVmSW5pdGlhbEZvY3VzIiwiUmVmSG9sZGVyIiwicmVmRWRpdG9yIiwib2JzZXJ2ZSIsImVkaXRvciIsImlzQWxpdmUiLCJ0ZXJtaW5hdGVQZW5kaW5nU3RhdGUiLCJvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZSIsImNhbGxiYWNrIiwib24iLCJvbkRpZERlc3Ryb3kiLCJyZW5kZXIiLCJyZXBvc2l0b3J5Iiwid29ya2RpckNvbnRleHRQb29sIiwiZ2V0Q29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJkZXN0cm95IiwiZ2V0VGl0bGUiLCJnZXRJY29uTmFtZSIsIm9ic2VydmVFbWJlZGRlZFRleHRFZGl0b3IiLCJjYiIsIm1hcCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJnZXRTaGEiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ1cmkiLCJwcmV2ZW50Rm9jdXMiLCJmb2N1cyIsImdldFByb21pc2UiLCJ0aGVuIiwiZm9jdXNhYmxlIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sU0FBK0JDLGVBQU1DLFNBQXJDLENBQStDO0FBUzdDLFNBQVJDLFFBQVEsQ0FBQ0MsZ0JBQUQsRUFBbUJDLEdB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QUc7QUFDVixXQUFPO0FBQ0xDLE1BQUFBLFlBQVksRUFBRSxrQkFEVDtBQUVMQyxNQUFBQSxHQUFHLEVBQUV6QyxnQkFBZ0IsQ0FBQ0csUUFBakIsQ0FBMEIsS0FBS0ssS0FBTCxDQUFXSixnQkFBckMsRUFBdUQsS0FBS0ksS0FBTCxDQUFXSCxHQUFsRTtBQUZBLEtBQVA7QUFJRDs7QUFFRHFDLEVBQUFBLFlBQVksR0FBRztBQUNiLFNBQUs1QixXQUFMLEdBQW1CLEtBQW5CO0FBQ0Q7O0FBRUQ2QixFQUFBQSxLQUFLLEdBQUc7QUFDTixTQUFLNUIsZUFBTCxDQUFxQjZCLFVBQXJCLEdBQWtDQyxJQUFsQyxDQUF1Q0MsU0FBUyxJQUFJO0FBQ2xELFVBQUksQ0FBQyxLQUFLaEMsV0FBVixFQUF1QjtBQUNyQjtBQUNEOztBQUVEZ0MsTUFBQUEsU0FBUyxDQUFDSCxLQUFWO0FBQ0QsS0FORDtBQU9EOztBQTVHMkQ7Ozs7Z0JBQXpDM0MsZ0IsZUFDQTtBQUNqQjRCLEVBQUFBLGtCQUFrQixFQUFFbUIsdUNBQTJCQyxVQUQ5QjtBQUVqQjVDLEVBQUFBLGdCQUFnQixFQUFFNkMsbUJBQVVDLE1BQVYsQ0FBaUJGLFVBRmxCO0FBR2pCM0MsRUFBQUEsR0FBRyxFQUFFNEMsbUJBQVVDLE1BQVYsQ0FBaUJGO0FBSEwsQzs7Z0JBREFoRCxnQixnQkFPQyxrRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge1dvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBDb21taXREZXRhaWxDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9jb21taXQtZGV0YWlsLWNvbnRhaW5lcic7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0RGV0YWlsSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgd29ya2RpckNvbnRleHRQb29sOiBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBzaGE6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyB1cmlQYXR0ZXJuID0gJ2F0b20tZ2l0aHViOi8vY29tbWl0LWRldGFpbD93b3JrZGlyPXt3b3JraW5nRGlyZWN0b3J5fSZzaGE9e3NoYX0nXG5cbiAgc3RhdGljIGJ1aWxkVVJJKHdvcmtpbmdEaXJlY3RvcnksIHNoYSkge1xuICAgIHJldHVybiBgYXRvbS1naXRodWI6Ly9jb21taXQtZGV0YWlsP3dvcmtkaXI9JHtlbmNvZGVVUklDb21wb25lbnQod29ya2luZ0RpcmVjdG9yeSl9JnNoYT0ke2VuY29kZVVSSUNvbXBvbmVudChzaGEpfWA7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHRoaXMuaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuc2hvdWxkRm9jdXMgPSB0cnVlO1xuICAgIHRoaXMucmVmSW5pdGlhbEZvY3VzID0gbmV3IFJlZkhvbGRlcigpO1xuXG4gICAgdGhpcy5yZWZFZGl0b3IgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZWZFZGl0b3Iub2JzZXJ2ZShlZGl0b3IgPT4ge1xuICAgICAgaWYgKGVkaXRvci5pc0FsaXZlKCkpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtZW1iZWRkZWQtdGV4dC1lZGl0b3InLCBlZGl0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGVybWluYXRlUGVuZGluZ1N0YXRlKCkge1xuICAgIGlmICghdGhpcy5oYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXRlcm1pbmF0ZS1wZW5kaW5nLXN0YXRlJyk7XG4gICAgICB0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXRlcm1pbmF0ZS1wZW5kaW5nLXN0YXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSA9ICgpID0+IHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95Jyk7XG4gICAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXBvc2l0b3J5ID0gdGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2wuZ2V0Q29udGV4dCh0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnkpLmdldFJlcG9zaXRvcnkoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWl0RGV0YWlsQ29udGFpbmVyXG4gICAgICAgIGl0ZW1UeXBlPXt0aGlzLmNvbnN0cnVjdG9yfVxuICAgICAgICByZXBvc2l0b3J5PXtyZXBvc2l0b3J5fVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgZGVzdHJveT17dGhpcy5kZXN0cm95fVxuICAgICAgICByZWZFZGl0b3I9e3RoaXMucmVmRWRpdG9yfVxuICAgICAgICByZWZJbml0aWFsRm9jdXM9e3RoaXMucmVmSW5pdGlhbEZvY3VzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuIGBDb21taXQ6ICR7dGhpcy5wcm9wcy5zaGF9YDtcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiAnZ2l0LWNvbW1pdCc7XG4gIH1cblxuICBvYnNlcnZlRW1iZWRkZWRUZXh0RWRpdG9yKGNiKSB7XG4gICAgdGhpcy5yZWZFZGl0b3IubWFwKGVkaXRvciA9PiBlZGl0b3IuaXNBbGl2ZSgpICYmIGNiKGVkaXRvcikpO1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtZW1iZWRkZWQtdGV4dC1lZGl0b3InLCBjYik7XG4gIH1cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtpbmdEaXJlY3Rvcnk7XG4gIH1cblxuICBnZXRTaGEoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2hhO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdDb21taXREZXRhaWxTdHViJyxcbiAgICAgIHVyaTogQ29tbWl0RGV0YWlsSXRlbS5idWlsZFVSSSh0aGlzLnByb3BzLndvcmtpbmdEaXJlY3RvcnksIHRoaXMucHJvcHMuc2hhKSxcbiAgICB9O1xuICB9XG5cbiAgcHJldmVudEZvY3VzKCkge1xuICAgIHRoaXMuc2hvdWxkRm9jdXMgPSBmYWxzZTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMucmVmSW5pdGlhbEZvY3VzLmdldFByb21pc2UoKS50aGVuKGZvY3VzYWJsZSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2hvdWxkRm9jdXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb2N1c2FibGUuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19