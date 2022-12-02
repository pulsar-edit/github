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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9jb21taXQtZGV0YWlsLWl0ZW0uanMiXSwibmFtZXMiOlsiQ29tbWl0RGV0YWlsSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJ3b3JraW5nRGlyZWN0b3J5Iiwic2hhIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlzRGVzdHJveWVkIiwiZW1pdHRlciIsImVtaXQiLCJFbWl0dGVyIiwiaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSIsInNob3VsZEZvY3VzIiwicmVmSW5pdGlhbEZvY3VzIiwiUmVmSG9sZGVyIiwicmVmRWRpdG9yIiwib2JzZXJ2ZSIsImVkaXRvciIsImlzQWxpdmUiLCJ0ZXJtaW5hdGVQZW5kaW5nU3RhdGUiLCJvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZSIsImNhbGxiYWNrIiwib24iLCJvbkRpZERlc3Ryb3kiLCJyZW5kZXIiLCJyZXBvc2l0b3J5Iiwid29ya2RpckNvbnRleHRQb29sIiwiZ2V0Q29udGV4dCIsImdldFJlcG9zaXRvcnkiLCJkZXN0cm95IiwiZ2V0VGl0bGUiLCJnZXRJY29uTmFtZSIsIm9ic2VydmVFbWJlZGRlZFRleHRFZGl0b3IiLCJjYiIsIm1hcCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJnZXRTaGEiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ1cmkiLCJwcmV2ZW50Rm9jdXMiLCJmb2N1cyIsImdldFByb21pc2UiLCJ0aGVuIiwiZm9jdXNhYmxlIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJpc1JlcXVpcmVkIiwiUHJvcFR5cGVzIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sU0FBK0JDLGVBQU1DLFNBQXJDLENBQStDO0FBUzdDLFNBQVJDLFFBQVEsQ0FBQ0MsZ0JBQUQsRUFBbUJDLEdB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RztBQUNWLFdBQU87QUFDTEMsTUFBQUEsWUFBWSxFQUFFLGtCQURUO0FBRUxDLE1BQUFBLEdBQUcsRUFBRXpDLGdCQUFnQixDQUFDRyxRQUFqQixDQUEwQixLQUFLSyxLQUFMLENBQVdKLGdCQUFyQyxFQUF1RCxLQUFLSSxLQUFMLENBQVdILEdBQWxFO0FBRkEsS0FBUDtBQUlEOztBQUVEcUMsRUFBQUEsWUFBWSxHQUFHO0FBQ2IsU0FBSzVCLFdBQUwsR0FBbUIsS0FBbkI7QUFDRDs7QUFFRDZCLEVBQUFBLEtBQUssR0FBRztBQUNOLFNBQUs1QixlQUFMLENBQXFCNkIsVUFBckIsR0FBa0NDLElBQWxDLENBQXVDQyxTQUFTLElBQUk7QUFDbEQsVUFBSSxDQUFDLEtBQUtoQyxXQUFWLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRURnQyxNQUFBQSxTQUFTLENBQUNILEtBQVY7QUFDRCxLQU5EO0FBT0Q7O0FBNUcyRDs7OztnQkFBekMzQyxnQixlQUNBO0FBQ2pCNEIsRUFBQUEsa0JBQWtCLEVBQUVtQix1Q0FBMkJDLFVBRDlCO0FBRWpCNUMsRUFBQUEsZ0JBQWdCLEVBQUU2QyxtQkFBVUMsTUFBVixDQUFpQkYsVUFGbEI7QUFHakIzQyxFQUFBQSxHQUFHLEVBQUU0QyxtQkFBVUMsTUFBVixDQUFpQkY7QUFITCxDOztnQkFEQWhELGdCLGdCQU9DLGtFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7V29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IENvbW1pdERldGFpbENvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2NvbW1pdC1kZXRhaWwtY29udGFpbmVyJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXREZXRhaWxJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgd29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHNoYTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9jb21taXQtZGV0YWlsP3dvcmtkaXI9e3dvcmtpbmdEaXJlY3Rvcnl9JnNoYT17c2hhfSdcblxuICBzdGF0aWMgYnVpbGRVUkkod29ya2luZ0RpcmVjdG9yeSwgc2hhKSB7XG4gICAgcmV0dXJuIGBhdG9tLWdpdGh1YjovL2NvbW1pdC1kZXRhaWw/d29ya2Rpcj0ke2VuY29kZVVSSUNvbXBvbmVudCh3b3JraW5nRGlyZWN0b3J5KX0mc2hhPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHNoYSl9YDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5oYXNUZXJtaW5hdGVkUGVuZGluZ1N0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5zaG91bGRGb2N1cyA9IHRydWU7XG4gICAgdGhpcy5yZWZJbml0aWFsRm9jdXMgPSBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgICB0aGlzLnJlZkVkaXRvciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZkVkaXRvci5vYnNlcnZlKGVkaXRvciA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmlzQWxpdmUoKSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1lbWJlZGRlZC10ZXh0LWVkaXRvcicsIGVkaXRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdGVybWluYXRlLXBlbmRpbmctc3RhdGUnKTtcbiAgICAgIHRoaXMuaGFzVGVybWluYXRlZFBlbmRpbmdTdGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgb25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdGVybWluYXRlLXBlbmRpbmctc3RhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95ID0gKCkgPT4ge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKTtcbiAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uRGlkRGVzdHJveShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbC5nZXRDb250ZXh0KHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeSkuZ2V0UmVwb3NpdG9yeSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXREZXRhaWxDb250YWluZXJcbiAgICAgICAgaXRlbVR5cGU9e3RoaXMuY29uc3RydWN0b3J9XG4gICAgICAgIHJlcG9zaXRvcnk9e3JlcG9zaXRvcnl9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICBkZXN0cm95PXt0aGlzLmRlc3Ryb3l9XG4gICAgICAgIHJlZkVkaXRvcj17dGhpcy5yZWZFZGl0b3J9XG4gICAgICAgIHJlZkluaXRpYWxGb2N1cz17dGhpcy5yZWZJbml0aWFsRm9jdXN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gYENvbW1pdDogJHt0aGlzLnByb3BzLnNoYX1gO1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7XG4gICAgcmV0dXJuICdnaXQtY29tbWl0JztcbiAgfVxuXG4gIG9ic2VydmVFbWJlZGRlZFRleHRFZGl0b3IoY2IpIHtcbiAgICB0aGlzLnJlZkVkaXRvci5tYXAoZWRpdG9yID0+IGVkaXRvci5pc0FsaXZlKCkgJiYgY2IoZWRpdG9yKSk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1lbWJlZGRlZC10ZXh0LWVkaXRvcicsIGNiKTtcbiAgfVxuXG4gIGdldFdvcmtpbmdEaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeTtcbiAgfVxuXG4gIGdldFNoYSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zaGE7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0NvbW1pdERldGFpbFN0dWInLFxuICAgICAgdXJpOiBDb21taXREZXRhaWxJdGVtLmJ1aWxkVVJJKHRoaXMucHJvcHMud29ya2luZ0RpcmVjdG9yeSwgdGhpcy5wcm9wcy5zaGEpLFxuICAgIH07XG4gIH1cblxuICBwcmV2ZW50Rm9jdXMoKSB7XG4gICAgdGhpcy5zaG91bGRGb2N1cyA9IGZhbHNlO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5yZWZJbml0aWFsRm9jdXMuZ2V0UHJvbWlzZSgpLnRoZW4oZm9jdXNhYmxlID0+IHtcbiAgICAgIGlmICghdGhpcy5zaG91bGRGb2N1cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvY3VzYWJsZS5mb2N1cygpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=