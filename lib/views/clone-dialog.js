"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _atom = require("atom");
var _url = _interopRequireDefault(require("url"));
var _path = _interopRequireDefault(require("path"));
var _tabGroup = _interopRequireDefault(require("../tab-group"));
var _dialogView = _interopRequireDefault(require("./dialog-view"));
var _tabbable = require("./tabbable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CloneDialog extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "accept", () => {
      const sourceURL = this.sourceURL.getText();
      const destinationPath = this.destinationPath.getText();
      if (sourceURL === '' || destinationPath === '') {
        return Promise.resolve();
      }
      return this.props.request.accept(sourceURL, destinationPath);
    });
    _defineProperty(this, "didChangeSourceUrl", () => {
      if (!this.destinationPathModified) {
        const name = _path.default.basename(_url.default.parse(this.sourceURL.getText()).pathname, '.git') || '';
        if (name.length > 0) {
          const proposedPath = _path.default.join(this.props.config.get('core.projectHome'), name);
          this.destinationPath.setText(proposedPath);
          this.destinationPathModified = false;
        }
      }
      this.setAcceptEnablement();
    });
    _defineProperty(this, "didChangeDestinationPath", () => {
      this.destinationPathModified = true;
      this.setAcceptEnablement();
    });
    _defineProperty(this, "setAcceptEnablement", () => {
      const enabled = !this.sourceURL.isEmpty() && !this.destinationPath.isEmpty();
      if (enabled !== this.state.acceptEnabled) {
        this.setState({
          acceptEnabled: enabled
        });
      }
    });
    const params = this.props.request.getParams();
    this.sourceURL = new _atom.TextBuffer({
      text: params.sourceURL
    });
    this.destinationPath = new _atom.TextBuffer({
      text: params.destPath || this.props.config.get('core.projectHome')
    });
    this.destinationPathModified = false;
    this.state = {
      acceptEnabled: false
    };
    this.subs = new _eventKit.CompositeDisposable(this.sourceURL.onDidChange(this.didChangeSourceUrl), this.destinationPath.onDidChange(this.didChangeDestinationPath));
    this.tabGroup = new _tabGroup.default();
  }
  render() {
    return _react.default.createElement(_dialogView.default, {
      progressMessage: "cloning...",
      acceptEnabled: this.state.acceptEnabled,
      acceptClassNames: "icon icon-repo-clone",
      acceptText: "Clone",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Clone from", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      className: "github-Clone-sourceURL",
      mini: true,
      readOnly: this.props.inProgress,
      buffer: this.sourceURL
    })), _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "To directory", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      className: "github-Clone-destinationPath",
      mini: true,
      readOnly: this.props.inProgress,
      buffer: this.destinationPath
    })));
  }
  componentDidMount() {
    this.tabGroup.autofocus();
  }
}
exports.default = CloneDialog;
_defineProperty(CloneDialog, "propTypes", {
  // Model
  request: _propTypes.default.shape({
    getParams: _propTypes.default.func.isRequired,
    accept: _propTypes.default.func.isRequired,
    cancel: _propTypes.default.func.isRequired
  }).isRequired,
  inProgress: _propTypes.default.bool,
  error: _propTypes.default.instanceOf(Error),
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDbG9uZURpYWxvZyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInNvdXJjZVVSTCIsImdldFRleHQiLCJkZXN0aW5hdGlvblBhdGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlcXVlc3QiLCJhY2NlcHQiLCJkZXN0aW5hdGlvblBhdGhNb2RpZmllZCIsIm5hbWUiLCJwYXRoIiwiYmFzZW5hbWUiLCJ1cmwiLCJwYXJzZSIsInBhdGhuYW1lIiwibGVuZ3RoIiwicHJvcG9zZWRQYXRoIiwiam9pbiIsImNvbmZpZyIsImdldCIsInNldFRleHQiLCJzZXRBY2NlcHRFbmFibGVtZW50IiwiZW5hYmxlZCIsImlzRW1wdHkiLCJzdGF0ZSIsImFjY2VwdEVuYWJsZWQiLCJzZXRTdGF0ZSIsInBhcmFtcyIsImdldFBhcmFtcyIsIlRleHRCdWZmZXIiLCJ0ZXh0IiwiZGVzdFBhdGgiLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsIm9uRGlkQ2hhbmdlIiwiZGlkQ2hhbmdlU291cmNlVXJsIiwiZGlkQ2hhbmdlRGVzdGluYXRpb25QYXRoIiwidGFiR3JvdXAiLCJUYWJHcm91cCIsInJlbmRlciIsImNhbmNlbCIsImluUHJvZ3Jlc3MiLCJlcnJvciIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwiY29tcG9uZW50RGlkTW91bnQiLCJhdXRvZm9jdXMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImluc3RhbmNlT2YiLCJFcnJvciIsIm9iamVjdCJdLCJzb3VyY2VzIjpbImNsb25lLWRpYWxvZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IFRhYkdyb3VwIGZyb20gJy4uL3RhYi1ncm91cCc7XG5pbXBvcnQgRGlhbG9nVmlldyBmcm9tICcuL2RpYWxvZy12aWV3JztcbmltcG9ydCB7VGFiYmFibGVUZXh0RWRpdG9yfSBmcm9tICcuL3RhYmJhYmxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xvbmVEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldFBhcmFtczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGFjY2VwdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5wcm9wcy5yZXF1ZXN0LmdldFBhcmFtcygpO1xuICAgIHRoaXMuc291cmNlVVJMID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IHBhcmFtcy5zb3VyY2VVUkx9KTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aCA9IG5ldyBUZXh0QnVmZmVyKHtcbiAgICAgIHRleHQ6IHBhcmFtcy5kZXN0UGF0aCB8fCB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2NvcmUucHJvamVjdEhvbWUnKSxcbiAgICB9KTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aE1vZGlmaWVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYWNjZXB0RW5hYmxlZDogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5zb3VyY2VVUkwub25EaWRDaGFuZ2UodGhpcy5kaWRDaGFuZ2VTb3VyY2VVcmwpLFxuICAgICAgdGhpcy5kZXN0aW5hdGlvblBhdGgub25EaWRDaGFuZ2UodGhpcy5kaWRDaGFuZ2VEZXN0aW5hdGlvblBhdGgpLFxuICAgICk7XG5cbiAgICB0aGlzLnRhYkdyb3VwID0gbmV3IFRhYkdyb3VwKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dWaWV3XG4gICAgICAgIHByb2dyZXNzTWVzc2FnZT1cImNsb25pbmcuLi5cIlxuICAgICAgICBhY2NlcHRFbmFibGVkPXt0aGlzLnN0YXRlLmFjY2VwdEVuYWJsZWR9XG4gICAgICAgIGFjY2VwdENsYXNzTmFtZXM9XCJpY29uIGljb24tcmVwby1jbG9uZVwiXG4gICAgICAgIGFjY2VwdFRleHQ9XCJDbG9uZVwiXG4gICAgICAgIGFjY2VwdD17dGhpcy5hY2NlcHR9XG4gICAgICAgIGNhbmNlbD17dGhpcy5wcm9wcy5yZXF1ZXN0LmNhbmNlbH1cbiAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgIGluUHJvZ3Jlc3M9e3RoaXMucHJvcHMuaW5Qcm9ncmVzc31cbiAgICAgICAgZXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfT5cblxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0xhYmVsXCI+XG4gICAgICAgICAgQ2xvbmUgZnJvbVxuICAgICAgICAgIDxUYWJiYWJsZVRleHRFZGl0b3JcbiAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICBhdXRvZm9jdXNcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1DbG9uZS1zb3VyY2VVUkxcIlxuICAgICAgICAgICAgbWluaVxuICAgICAgICAgICAgcmVhZE9ubHk9e3RoaXMucHJvcHMuaW5Qcm9ncmVzc31cbiAgICAgICAgICAgIGJ1ZmZlcj17dGhpcy5zb3VyY2VVUkx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dMYWJlbFwiPlxuICAgICAgICAgIFRvIGRpcmVjdG9yeVxuICAgICAgICAgIDxUYWJiYWJsZVRleHRFZGl0b3JcbiAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ2xvbmUtZGVzdGluYXRpb25QYXRoXCJcbiAgICAgICAgICAgIG1pbmlcbiAgICAgICAgICAgIHJlYWRPbmx5PXt0aGlzLnByb3BzLmluUHJvZ3Jlc3N9XG4gICAgICAgICAgICBidWZmZXI9e3RoaXMuZGVzdGluYXRpb25QYXRofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgIDwvRGlhbG9nVmlldz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50YWJHcm91cC5hdXRvZm9jdXMoKTtcbiAgfVxuXG4gIGFjY2VwdCA9ICgpID0+IHtcbiAgICBjb25zdCBzb3VyY2VVUkwgPSB0aGlzLnNvdXJjZVVSTC5nZXRUZXh0KCk7XG4gICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gdGhpcy5kZXN0aW5hdGlvblBhdGguZ2V0VGV4dCgpO1xuICAgIGlmIChzb3VyY2VVUkwgPT09ICcnIHx8IGRlc3RpbmF0aW9uUGF0aCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXF1ZXN0LmFjY2VwdChzb3VyY2VVUkwsIGRlc3RpbmF0aW9uUGF0aCk7XG4gIH1cblxuICBkaWRDaGFuZ2VTb3VyY2VVcmwgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uUGF0aE1vZGlmaWVkKSB7XG4gICAgICBjb25zdCBuYW1lID0gcGF0aC5iYXNlbmFtZSh1cmwucGFyc2UodGhpcy5zb3VyY2VVUkwuZ2V0VGV4dCgpKS5wYXRobmFtZSwgJy5naXQnKSB8fCAnJztcblxuICAgICAgaWYgKG5hbWUubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwcm9wb3NlZFBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5jb25maWcuZ2V0KCdjb3JlLnByb2plY3RIb21lJyksIG5hbWUpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aC5zZXRUZXh0KHByb3Bvc2VkUGF0aCk7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25QYXRoTW9kaWZpZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldEFjY2VwdEVuYWJsZW1lbnQoKTtcbiAgfVxuXG4gIGRpZENoYW5nZURlc3RpbmF0aW9uUGF0aCA9ICgpID0+IHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uUGF0aE1vZGlmaWVkID0gdHJ1ZTtcbiAgICB0aGlzLnNldEFjY2VwdEVuYWJsZW1lbnQoKTtcbiAgfVxuXG4gIHNldEFjY2VwdEVuYWJsZW1lbnQgPSAoKSA9PiB7XG4gICAgY29uc3QgZW5hYmxlZCA9ICF0aGlzLnNvdXJjZVVSTC5pc0VtcHR5KCkgJiYgIXRoaXMuZGVzdGluYXRpb25QYXRoLmlzRW1wdHkoKTtcbiAgICBpZiAoZW5hYmxlZCAhPT0gdGhpcy5zdGF0ZS5hY2NlcHRFbmFibGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHthY2NlcHRFbmFibGVkOiBlbmFibGVkfSk7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUE4QztBQUFBO0FBQUE7QUFBQTtBQUUvQixNQUFNQSxXQUFXLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBaUJ2REMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyxnQ0FvRU4sTUFBTTtNQUNiLE1BQU1DLFNBQVMsR0FBRyxJQUFJLENBQUNBLFNBQVMsQ0FBQ0MsT0FBTyxFQUFFO01BQzFDLE1BQU1DLGVBQWUsR0FBRyxJQUFJLENBQUNBLGVBQWUsQ0FBQ0QsT0FBTyxFQUFFO01BQ3RELElBQUlELFNBQVMsS0FBSyxFQUFFLElBQUlFLGVBQWUsS0FBSyxFQUFFLEVBQUU7UUFDOUMsT0FBT0MsT0FBTyxDQUFDQyxPQUFPLEVBQUU7TUFDMUI7TUFFQSxPQUFPLElBQUksQ0FBQ0wsS0FBSyxDQUFDTSxPQUFPLENBQUNDLE1BQU0sQ0FBQ04sU0FBUyxFQUFFRSxlQUFlLENBQUM7SUFDOUQsQ0FBQztJQUFBLDRDQUVvQixNQUFNO01BQ3pCLElBQUksQ0FBQyxJQUFJLENBQUNLLHVCQUF1QixFQUFFO1FBQ2pDLE1BQU1DLElBQUksR0FBR0MsYUFBSSxDQUFDQyxRQUFRLENBQUNDLFlBQUcsQ0FBQ0MsS0FBSyxDQUFDLElBQUksQ0FBQ1osU0FBUyxDQUFDQyxPQUFPLEVBQUUsQ0FBQyxDQUFDWSxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtRQUV0RixJQUFJTCxJQUFJLENBQUNNLE1BQU0sR0FBRyxD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