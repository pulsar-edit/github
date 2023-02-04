"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _atom = require("atom");
var _tabGroup = _interopRequireDefault(require("../tab-group"));
var _tabbable = require("./tabbable");
var _dialogView = _interopRequireDefault(require("./dialog-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class InitDialog extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "accept", () => {
      const destPath = this.destinationPath.getText();
      if (destPath.length === 0) {
        return Promise.resolve();
      }
      return this.props.request.accept(destPath);
    });
    _defineProperty(this, "setAcceptEnablement", () => {
      const enablement = !this.destinationPath.isEmpty();
      if (enablement !== this.state.acceptEnabled) {
        this.setState({
          acceptEnabled: enablement
        });
      }
    });
    this.tabGroup = new _tabGroup.default();
    this.destinationPath = new _atom.TextBuffer({
      text: this.props.request.getParams().dirPath
    });
    this.sub = this.destinationPath.onDidChange(this.setAcceptEnablement);
    this.state = {
      acceptEnabled: !this.destinationPath.isEmpty()
    };
  }
  render() {
    return _react.default.createElement(_dialogView.default, {
      progressMessage: "Initializing...",
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-repo-create",
      acceptText: "Init",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel"
    }, "Initialize git repository in directory", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      preselect: true,
      readOnly: this.props.inProgress,
      buffer: this.destinationPath
    })));
  }
  componentDidMount() {
    this.tabGroup.autofocus();
  }
  componentWillUnmount() {
    this.sub.dispose();
  }
}
exports.default = InitDialog;
_defineProperty(InitDialog, "propTypes", {
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
  commands: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJbml0RGlhbG9nIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZGVzdFBhdGgiLCJkZXN0aW5hdGlvblBhdGgiLCJnZXRUZXh0IiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXF1ZXN0IiwiYWNjZXB0IiwiZW5hYmxlbWVudCIsImlzRW1wdHkiLCJzdGF0ZSIsImFjY2VwdEVuYWJsZWQiLCJzZXRTdGF0ZSIsInRhYkdyb3VwIiwiVGFiR3JvdXAiLCJUZXh0QnVmZmVyIiwidGV4dCIsImdldFBhcmFtcyIsImRpclBhdGgiLCJzdWIiLCJvbkRpZENoYW5nZSIsInNldEFjY2VwdEVuYWJsZW1lbnQiLCJyZW5kZXIiLCJjYW5jZWwiLCJpblByb2dyZXNzIiwiZXJyb3IiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImNvbXBvbmVudERpZE1vdW50IiwiYXV0b2ZvY3VzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpbnN0YW5jZU9mIiwiRXJyb3IiLCJvYmplY3QiXSwic291cmNlcyI6WyJpbml0LWRpYWxvZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBUYWJHcm91cCBmcm9tICcuLi90YWItZ3JvdXAnO1xuaW1wb3J0IHtUYWJiYWJsZVRleHRFZGl0b3J9IGZyb20gJy4vdGFiYmFibGUnO1xuaW1wb3J0IERpYWxvZ1ZpZXcgZnJvbSAnLi9kaWFsb2ctdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluaXREaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldFBhcmFtczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGFjY2VwdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy50YWJHcm91cCA9IG5ldyBUYWJHcm91cCgpO1xuXG4gICAgdGhpcy5kZXN0aW5hdGlvblBhdGggPSBuZXcgVGV4dEJ1ZmZlcih7XG4gICAgICB0ZXh0OiB0aGlzLnByb3BzLnJlcXVlc3QuZ2V0UGFyYW1zKCkuZGlyUGF0aCxcbiAgICB9KTtcblxuICAgIHRoaXMuc3ViID0gdGhpcy5kZXN0aW5hdGlvblBhdGgub25EaWRDaGFuZ2UodGhpcy5zZXRBY2NlcHRFbmFibGVtZW50KTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhY2NlcHRFbmFibGVkOiAhdGhpcy5kZXN0aW5hdGlvblBhdGguaXNFbXB0eSgpLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dWaWV3XG4gICAgICAgIHByb2dyZXNzTWVzc2FnZT1cIkluaXRpYWxpemluZy4uLlwiXG4gICAgICAgIGFjY2VwdEVuYWJsZWQ9e3RoaXMuc3RhdGUuYWNjZXB0RW5hYmxlZH1cbiAgICAgICAgYWNjZXB0Q2xhc3NOYW1lPVwiaWNvbiBpY29uLXJlcG8tY3JlYXRlXCJcbiAgICAgICAgYWNjZXB0VGV4dD1cIkluaXRcIlxuICAgICAgICBhY2NlcHQ9e3RoaXMuYWNjZXB0fVxuICAgICAgICBjYW5jZWw9e3RoaXMucHJvcHMucmVxdWVzdC5jYW5jZWx9XG4gICAgICAgIHRhYkdyb3VwPXt0aGlzLnRhYkdyb3VwfVxuICAgICAgICBpblByb2dyZXNzPXt0aGlzLnByb3BzLmluUHJvZ3Jlc3N9XG4gICAgICAgIGVycm9yPXt0aGlzLnByb3BzLmVycm9yfVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc30+XG5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImdpdGh1Yi1EaWFsb2dMYWJlbFwiPlxuICAgICAgICAgIEluaXRpYWxpemUgZ2l0IHJlcG9zaXRvcnkgaW4gZGlyZWN0b3J5XG4gICAgICAgICAgPFRhYmJhYmxlVGV4dEVkaXRvclxuICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgIGF1dG9mb2N1c1xuICAgICAgICAgICAgbWluaVxuICAgICAgICAgICAgcHJlc2VsZWN0XG4gICAgICAgICAgICByZWFkT25seT17dGhpcy5wcm9wcy5pblByb2dyZXNzfVxuICAgICAgICAgICAgYnVmZmVyPXt0aGlzLmRlc3RpbmF0aW9uUGF0aH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICA8L0RpYWxvZ1ZpZXc+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudGFiR3JvdXAuYXV0b2ZvY3VzKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gIH1cblxuICBhY2NlcHQgPSAoKSA9PiB7XG4gICAgY29uc3QgZGVzdFBhdGggPSB0aGlzLmRlc3RpbmF0aW9uUGF0aC5nZXRUZXh0KCk7XG4gICAgaWYgKGRlc3RQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcXVlc3QuYWNjZXB0KGRlc3RQYXRoKTtcbiAgfVxuXG4gIHNldEFjY2VwdEVuYWJsZW1lbnQgPSAoKSA9PiB7XG4gICAgY29uc3QgZW5hYmxlbWVudCA9ICF0aGlzLmRlc3RpbmF0aW9uUGF0aC5pc0VtcHR5KCk7XG4gICAgaWYgKGVuYWJsZW1lbnQgIT09IHRoaXMuc3RhdGUuYWNjZXB0RW5hYmxlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7YWNjZXB0RW5hYmxlZDogZW5hYmxlbWVudH0pO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBdUM7QUFBQTtBQUFBO0FBQUE7QUFFeEIsTUFBTUEsVUFBVSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWdCdERDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsZ0NBdUROLE1BQU07TUFDYixNQUFNQyxRQUFRLEdBQUcsSUFBSSxDQUFDQyxlQUFlLENBQUNDLE9BQU8sRUFBRTtNQUMvQyxJQUFJRixRQUFRLENBQUNHLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDekIsT0FBT0MsT0FBTyxDQUFDQyxPQUFPLEVBQUU7TUFDMUI7TUFFQSxPQUFPLElBQUksQ0FBQ04sS0FBSyxDQUFDTyxPQUFPLENBQUNDLE1BQU0sQ0FBQ1AsUUFBUSxDQUFDO0lBQzVDLENBQUM7SUFBQSw2Q0FFcUIsTUFBTTtNQUMxQixNQUFNUSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUNQLGVBQWUsQ0FBQ1EsT0FBTyxFQUFFO01BQ2xELElBQUlE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