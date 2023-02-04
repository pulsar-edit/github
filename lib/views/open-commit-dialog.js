"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openCommitDetailItem = openCommitDetailItem;
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _atom = require("atom");
var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));
var _gitShellOutStrategy = require("../git-shell-out-strategy");
var _dialogView = _interopRequireDefault(require("./dialog-view"));
var _tabGroup = _interopRequireDefault(require("../tab-group"));
var _tabbable = require("./tabbable");
var _reporterProxy = require("../reporter-proxy");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class OpenCommitDialog extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "accept", () => {
      const ref = this.ref.getText();
      if (ref.length === 0) {
        return Promise.resolve();
      }
      return this.props.request.accept(ref);
    });
    _defineProperty(this, "didChangeRef", () => {
      const enabled = !this.ref.isEmpty();
      if (this.state.acceptEnabled !== enabled) {
        this.setState({
          acceptEnabled: enabled
        });
      }
    });
    this.ref = new _atom.TextBuffer();
    this.sub = this.ref.onDidChange(this.didChangeRef);
    this.state = {
      acceptEnabled: false
    };
    this.tabGroup = new _tabGroup.default();
  }
  render() {
    return _react.default.createElement(_dialogView.default, {
      acceptEnabled: this.state.acceptEnabled,
      acceptClassName: "icon icon-commit",
      acceptText: "Open commit",
      accept: this.accept,
      cancel: this.props.request.cancel,
      tabGroup: this.tabGroup,
      inProgress: this.props.inProgress,
      error: this.props.error,
      workspace: this.props.workspace,
      commands: this.props.commands
    }, _react.default.createElement("label", {
      className: "github-DialogLabel github-CommitRef"
    }, "Commit sha or ref:", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.tabGroup,
      commands: this.props.commands,
      autofocus: true,
      mini: true,
      buffer: this.ref
    })));
  }
  componentDidMount() {
    this.tabGroup.autofocus();
  }
  componentWillUnmount() {
    this.sub.dispose();
  }
}
exports.default = OpenCommitDialog;
_defineProperty(OpenCommitDialog, "propTypes", {
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
async function openCommitDetailItem(ref, {
  workspace,
  repository
}) {
  try {
    await repository.getCommit(ref);
  } catch (error) {
    if (error instanceof _gitShellOutStrategy.GitError && error.code === 128) {
      error.userMessage = 'There is no commit associated with that reference.';
    }
    throw error;
  }
  const item = await workspace.open(_commitDetailItem.default.buildURI(repository.getWorkingDirectoryPath(), ref), {
    searchAllPanes: true
  });
  (0, _reporterProxy.addEvent)('open-commit-in-pane', {
    package: 'github',
    from: OpenCommitDialog.name
  });
  return item;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJPcGVuQ29tbWl0RGlhbG9nIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmIiwiZ2V0VGV4dCIsImxlbmd0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVxdWVzdCIsImFjY2VwdCIsImVuYWJsZWQiLCJpc0VtcHR5Iiwic3RhdGUiLCJhY2NlcHRFbmFibGVkIiwic2V0U3RhdGUiLCJUZXh0QnVmZmVyIiwic3ViIiwib25EaWRDaGFuZ2UiLCJkaWRDaGFuZ2VSZWYiLCJ0YWJHcm91cCIsIlRhYkdyb3VwIiwicmVuZGVyIiwiY2FuY2VsIiwiaW5Qcm9ncmVzcyIsImVycm9yIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJjb21wb25lbnREaWRNb3VudCIsImF1dG9mb2N1cyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsIlByb3BUeXBlcyIsInNoYXBlIiwiZ2V0UGFyYW1zIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJib29sIiwiaW5zdGFuY2VPZiIsIkVycm9yIiwib2JqZWN0Iiwib3BlbkNvbW1pdERldGFpbEl0ZW0iLCJyZXBvc2l0b3J5IiwiZ2V0Q29tbWl0IiwiR2l0RXJyb3IiLCJjb2RlIiwidXNlck1lc3NhZ2UiLCJpdGVtIiwib3BlbiIsIkNvbW1pdERldGFpbEl0ZW0iLCJidWlsZFVSSSIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwic2VhcmNoQWxsUGFuZXMiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJmcm9tIiwibmFtZSJdLCJzb3VyY2VzIjpbIm9wZW4tY29tbWl0LWRpYWxvZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQge0dpdEVycm9yfSBmcm9tICcuLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcbmltcG9ydCBEaWFsb2dWaWV3IGZyb20gJy4vZGlhbG9nLXZpZXcnO1xuaW1wb3J0IFRhYkdyb3VwIGZyb20gJy4uL3RhYi1ncm91cCc7XG5pbXBvcnQge1RhYmJhYmxlVGV4dEVkaXRvcn0gZnJvbSAnLi90YWJiYWJsZSc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZW5Db21taXREaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsXG4gICAgcmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldFBhcmFtczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGFjY2VwdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGNhbmNlbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGluUHJvZ3Jlc3M6IFByb3BUeXBlcy5ib29sLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihFcnJvciksXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWYgPSBuZXcgVGV4dEJ1ZmZlcigpO1xuICAgIHRoaXMuc3ViID0gdGhpcy5yZWYub25EaWRDaGFuZ2UodGhpcy5kaWRDaGFuZ2VSZWYpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGFjY2VwdEVuYWJsZWQ6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLnRhYkdyb3VwID0gbmV3IFRhYkdyb3VwKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dWaWV3XG4gICAgICAgIGFjY2VwdEVuYWJsZWQ9e3RoaXMuc3RhdGUuYWNjZXB0RW5hYmxlZH1cbiAgICAgICAgYWNjZXB0Q2xhc3NOYW1lPVwiaWNvbiBpY29uLWNvbW1pdFwiXG4gICAgICAgIGFjY2VwdFRleHQ9XCJPcGVuIGNvbW1pdFwiXG4gICAgICAgIGFjY2VwdD17dGhpcy5hY2NlcHR9XG4gICAgICAgIGNhbmNlbD17dGhpcy5wcm9wcy5yZXF1ZXN0LmNhbmNlbH1cbiAgICAgICAgdGFiR3JvdXA9e3RoaXMudGFiR3JvdXB9XG4gICAgICAgIGluUHJvZ3Jlc3M9e3RoaXMucHJvcHMuaW5Qcm9ncmVzc31cbiAgICAgICAgZXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfT5cblxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZ2l0aHViLURpYWxvZ0xhYmVsIGdpdGh1Yi1Db21taXRSZWZcIj5cbiAgICAgICAgICBDb21taXQgc2hhIG9yIHJlZjpcbiAgICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgICB0YWJHcm91cD17dGhpcy50YWJHcm91cH1cbiAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgYXV0b2ZvY3VzXG4gICAgICAgICAgICBtaW5pXG4gICAgICAgICAgICBidWZmZXI9e3RoaXMucmVmfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgIDwvRGlhbG9nVmlldz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50YWJHcm91cC5hdXRvZm9jdXMoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGFjY2VwdCA9ICgpID0+IHtcbiAgICBjb25zdCByZWYgPSB0aGlzLnJlZi5nZXRUZXh0KCk7XG4gICAgaWYgKHJlZi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXF1ZXN0LmFjY2VwdChyZWYpO1xuICB9XG5cbiAgZGlkQ2hhbmdlUmVmID0gKCkgPT4ge1xuICAgIGNvbnN0IGVuYWJsZWQgPSAhdGhpcy5yZWYuaXNFbXB0eSgpO1xuICAgIGlmICh0aGlzLnN0YXRlLmFjY2VwdEVuYWJsZWQgIT09IGVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FjY2VwdEVuYWJsZWQ6IGVuYWJsZWR9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5Db21taXREZXRhaWxJdGVtKHJlZiwge3dvcmtzcGFjZSwgcmVwb3NpdG9yeX0pIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCByZXBvc2l0b3J5LmdldENvbW1pdChyZWYpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEdpdEVycm9yICYmIGVycm9yLmNvZGUgPT09IDEyOCkge1xuICAgICAgZXJyb3IudXNlck1lc3NhZ2UgPSAnVGhlcmUgaXMgbm8gY29tbWl0IGFzc29jaWF0ZWQgd2l0aCB0aGF0IHJlZmVyZW5jZS4nO1xuICAgIH1cblxuICAgIHRocm93IGVycm9yO1xuICB9XG5cbiAgY29uc3QgaXRlbSA9IGF3YWl0IHdvcmtzcGFjZS5vcGVuKFxuICAgIENvbW1pdERldGFpbEl0ZW0uYnVpbGRVUkkocmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCByZWYpLFxuICAgIHtzZWFyY2hBbGxQYW5lczogdHJ1ZX0sXG4gICk7XG4gIGFkZEV2ZW50KCdvcGVuLWNvbW1pdC1pbi1wYW5lJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiBPcGVuQ29tbWl0RGlhbG9nLm5hbWV9KTtcbiAgcmV0dXJuIGl0ZW07XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBMkM7QUFBQTtBQUFBO0FBQUE7QUFFNUIsTUFBTUEsZ0JBQWdCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBZ0I1REMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyxnQ0FpRE4sTUFBTTtNQUNiLE1BQU1DLEdBQUcsR0FBRyxJQUFJLENBQUNBLEdBQUcsQ0FBQ0MsT0FBTyxFQUFFO01BQzlCLElBQUlELEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNwQixPQUFPQyxPQUFPLENBQUNDLE9BQU8sRUFBRTtNQUMxQjtNQUVBLE9BQU8sSUFBSSxDQUFDTCxLQUFLLENBQUNNLE9BQU8sQ0FBQ0MsTUFBTSxDQUFDTixHQUFHLENBQUM7SUFDdkMsQ0FBQztJQUFBLHNDQUVjLE1BQU07TUFDbkIsTUFBTU8sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDUCxHQUFHLENBQUNRLE9BQU8sRUFBRTtNQUNuQyxJQUFJLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxhQUFhLEtBQUtILE9BQU8sRUFBRTtRQUN4QyxJQUFJLENBQUNJLFFBQVEsQ0FBQztVQUFDRCxhQUFhLEVBQUVIO1FBQU8sQ0FBQyxDQUFDO01BQ3pDO0lBQ0YsQ0FBQztJQTdEQyxJQUFJLENBQUNQLEdBQUcsR0FBRyxJQUFJWSxnQkFBVSxFQUFFO0lBQzNCLElBQUksQ0FBQ0MsR0FBRyxHQUFHLElBQUksQ0FBQ2IsR0FBRyxDQUFDYyxXQUFXLENBQUMsSUFBSSxDQUFDQyxZQUFZLENBQUM7SUFFbEQsSUFBSSxDQUFDTixLQUFLLEdBQUc7TUFDWEMsYUFBYSxF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