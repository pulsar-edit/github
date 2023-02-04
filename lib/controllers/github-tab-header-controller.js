"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _propTypes2 = require("../prop-types");
var _githubTabHeaderView = _interopRequireDefault(require("../views/github-tab-header-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GithubTabHeaderController extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "resetWorkDirs", () => {
      this.setState(() => ({
        currentWorkDirs: []
      }));
    });
    _defineProperty(this, "handleLockToggle", async () => {
      if (this.state.changingLock !== null) {
        return;
      }
      const nextLock = !this.props.contextLocked;
      try {
        this.setState({
          changingLock: nextLock
        });
        await this.props.setContextLock(this.state.changingWorkDir || this.props.currentWorkDir, nextLock);
      } finally {
        await new Promise(resolve => this.setState({
          changingLock: null
        }, resolve));
      }
    });
    _defineProperty(this, "handleWorkDirChange", async e => {
      if (this.state.changingWorkDir !== null) {
        return;
      }
      const nextWorkDir = e.target.value;
      try {
        this.setState({
          changingWorkDir: nextWorkDir
        });
        await this.props.changeWorkingDirectory(nextWorkDir);
      } finally {
        await new Promise(resolve => this.setState({
          changingWorkDir: null
        }, resolve));
      }
    });
    this.state = {
      currentWorkDirs: [],
      changingLock: null,
      changingWorkDir: null
    };
  }
  static getDerivedStateFromProps(props) {
    return {
      currentWorkDirs: props.getCurrentWorkDirs()
    };
  }
  componentDidMount() {
    this.disposable = this.props.onDidChangeWorkDirs(this.resetWorkDirs);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.onDidChangeWorkDirs !== this.props.onDidChangeWorkDirs) {
      if (this.disposable) {
        this.disposable.dispose();
      }
      this.disposable = this.props.onDidChangeWorkDirs(this.resetWorkDirs);
    }
  }
  render() {
    return _react.default.createElement(_githubTabHeaderView.default, {
      user: this.props.user

      // Workspace
      ,
      workdir: this.getWorkDir(),
      workdirs: this.state.currentWorkDirs,
      contextLocked: this.getContextLocked(),
      changingWorkDir: this.state.changingWorkDir !== null,
      changingLock: this.state.changingLock !== null,
      handleWorkDirChange: this.handleWorkDirChange,
      handleLockToggle: this.handleLockToggle
    });
  }
  getWorkDir() {
    return this.state.changingWorkDir !== null ? this.state.changingWorkDir : this.props.currentWorkDir;
  }
  getContextLocked() {
    return this.state.changingLock !== null ? this.state.changingLock : this.props.contextLocked;
  }
  componentWillUnmount() {
    this.disposable.dispose();
  }
}
exports.default = GithubTabHeaderController;
_defineProperty(GithubTabHeaderController, "propTypes", {
  user: _propTypes2.AuthorPropType.isRequired,
  // Workspace
  currentWorkDir: _propTypes.default.string,
  contextLocked: _propTypes.default.bool.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  // Event Handlers
  onDidChangeWorkDirs: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRodWJUYWJIZWFkZXJDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic2V0U3RhdGUiLCJjdXJyZW50V29ya0RpcnMiLCJzdGF0ZSIsImNoYW5naW5nTG9jayIsIm5leHRMb2NrIiwiY29udGV4dExvY2tlZCIsInNldENvbnRleHRMb2NrIiwiY2hhbmdpbmdXb3JrRGlyIiwiY3VycmVudFdvcmtEaXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsImUiLCJuZXh0V29ya0RpciIsInRhcmdldCIsInZhbHVlIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsImdldEN1cnJlbnRXb3JrRGlycyIsImNvbXBvbmVudERpZE1vdW50IiwiZGlzcG9zYWJsZSIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJyZXNldFdvcmtEaXJzIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiZGlzcG9zZSIsInJlbmRlciIsInVzZXIiLCJnZXRXb3JrRGlyIiwiZ2V0Q29udGV4dExvY2tlZCIsImhhbmRsZVdvcmtEaXJDaGFuZ2UiLCJoYW5kbGVMb2NrVG9nZ2xlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJBdXRob3JQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJib29sIiwiZnVuYyJdLCJzb3VyY2VzIjpbImdpdGh1Yi10YWItaGVhZGVyLWNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0F1dGhvclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBHaXRodWJUYWJIZWFkZXJWaWV3IGZyb20gJy4uL3ZpZXdzL2dpdGh1Yi10YWItaGVhZGVyLXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRodWJUYWJIZWFkZXJDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB1c2VyOiBBdXRob3JQcm9wVHlwZS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gV29ya3NwYWNlXG4gICAgY3VycmVudFdvcmtEaXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGdldEN1cnJlbnRXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgb25EaWRDaGFuZ2VXb3JrRGlyczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGN1cnJlbnRXb3JrRGlyczogW10sXG4gICAgICBjaGFuZ2luZ0xvY2s6IG51bGwsXG4gICAgICBjaGFuZ2luZ1dvcmtEaXI6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFdvcmtEaXJzOiBwcm9wcy5nZXRDdXJyZW50V29ya0RpcnMoKSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlID0gdGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzKHRoaXMucmVzZXRXb3JrRGlycyk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKHByZXZQcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzICE9PSB0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnMpIHtcbiAgICAgIGlmICh0aGlzLmRpc3Bvc2FibGUpIHtcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGlzcG9zYWJsZSA9IHRoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlycyh0aGlzLnJlc2V0V29ya0RpcnMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdGh1YlRhYkhlYWRlclZpZXdcbiAgICAgICAgdXNlcj17dGhpcy5wcm9wcy51c2VyfVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICB3b3JrZGlyPXt0aGlzLmdldFdvcmtEaXIoKX1cbiAgICAgICAgd29ya2RpcnM9e3RoaXMuc3RhdGUuY3VycmVudFdvcmtEaXJzfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLmdldENvbnRleHRMb2NrZWQoKX1cbiAgICAgICAgY2hhbmdpbmdXb3JrRGlyPXt0aGlzLnN0YXRlLmNoYW5naW5nV29ya0RpciAhPT0gbnVsbH1cbiAgICAgICAgY2hhbmdpbmdMb2NrPXt0aGlzLnN0YXRlLmNoYW5naW5nTG9jayAhPT0gbnVsbH1cblxuICAgICAgICBoYW5kbGVXb3JrRGlyQ2hhbmdlPXt0aGlzLmhhbmRsZVdvcmtEaXJDaGFuZ2V9XG4gICAgICAgIGhhbmRsZUxvY2tUb2dnbGU9e3RoaXMuaGFuZGxlTG9ja1RvZ2dsZX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlc2V0V29ya0RpcnMgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSgoKSA9PiAoe1xuICAgICAgY3VycmVudFdvcmtEaXJzOiBbXSxcbiAgICB9KSk7XG4gIH1cblxuICBoYW5kbGVMb2NrVG9nZ2xlID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLmNoYW5naW5nTG9jayAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRMb2NrID0gIXRoaXMucHJvcHMuY29udGV4dExvY2tlZDtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hhbmdpbmdMb2NrOiBuZXh0TG9ja30pO1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5zZXRDb250ZXh0TG9jayh0aGlzLnN0YXRlLmNoYW5naW5nV29ya0RpciB8fCB0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyLCBuZXh0TG9jayk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y2hhbmdpbmdMb2NrOiBudWxsfSwgcmVzb2x2ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVdvcmtEaXJDaGFuZ2UgPSBhc3luYyBlID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5jaGFuZ2luZ1dvcmtEaXIgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0V29ya0RpciA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjaGFuZ2luZ1dvcmtEaXI6IG5leHRXb3JrRGlyfSk7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3RvcnkobmV4dFdvcmtEaXIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2NoYW5naW5nV29ya0RpcjogbnVsbH0sIHJlc29sdmUpKTtcbiAgICB9XG4gIH1cblxuICBnZXRXb3JrRGlyKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmNoYW5naW5nV29ya0RpciAhPT0gbnVsbCA/IHRoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyIDogdGhpcy5wcm9wcy5jdXJyZW50V29ya0RpcjtcbiAgfVxuXG4gIGdldENvbnRleHRMb2NrZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY2hhbmdpbmdMb2NrICE9PSBudWxsID8gdGhpcy5zdGF0ZS5jaGFuZ2luZ0xvY2sgOiB0aGlzLnByb3BzLmNvbnRleHRMb2NrZWQ7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQWtFO0FBQUE7QUFBQTtBQUFBO0FBRW5ELE1BQU1BLHlCQUF5QixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWVyRUMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFBQyx1Q0E4Q0MsTUFBTTtNQUNwQixJQUFJLENBQUNDLFFBQVEsQ0FBQyxPQUFPO1FBQ25CQyxlQUFlLEVBQUU7TUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUEsMENBRWtCLFlBQVk7TUFDN0IsSUFBSSxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsWUFBWSxLQUFLLElBQUksRUFBRTtRQUNwQztNQUNGO01BRUEsTUFBTUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDTCxLQUFLLENBQUNNLGFBQWE7TUFDMUMsSUFBSTtRQUNGLElBQUksQ0FBQ0wsUUFBUSxDQUFDO1VBQUNHLFlBQVksRUFBRUM7UUFBUSxDQUFDLENBQUM7UUFDdkMsTUFBTSxJQUFJLENBQUNMLEtBQUssQ0FBQ08sY0FBYyxDQUFDLElBQUksQ0FBQ0osS0FBSyxDQUFDSyxlQUFlLElBQUksSUFBSSxDQUFDUixLQUFLLENBQUNTLGNBQWMsRUFBRUosUUFBUSxDQUFDO01BQ3BHLENBQUMsU0FBUztRQUNSLE1BQU0sSUFBSUssT0FBTyxDQUFDQyxPQUFPLElBQUksSUFBSSxDQUFDVixRQUFRLENBQUM7VUFBQ0csWUFBWSxFQUFFO1FBQUksQ0FBQyxFQUFFTyxPQUFPLENBQUMs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