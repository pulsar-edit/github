"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _atom = require("atom");
var _author = require("../models/author");
var _gitTabHeaderView = _interopRequireDefault(require("../views/git-tab-header-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class GitTabHeaderController extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleLockToggle", async () => {
      if (this.state.changingLock !== null) {
        return;
      }
      const nextLock = !this.props.contextLocked;
      try {
        this.setState({
          changingLock: nextLock
        });
        await this.props.setContextLock(this.getWorkDir(), nextLock);
      } finally {
        await new Promise(resolve => this.setState({
          changingLock: null
        }, resolve));
      }
    });
    _defineProperty(this, "handleWorkDirSelect", async e => {
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
    _defineProperty(this, "resetWorkDirs", () => {
      this.setState(() => ({
        currentWorkDirs: []
      }));
    });
    _defineProperty(this, "updateCommitter", async () => {
      const committer = (await this.props.getCommitter()) || _author.nullAuthor;
      if (this._isMounted) {
        this.setState({
          committer
        });
      }
    });
    this._isMounted = false;
    this.state = {
      currentWorkDirs: [],
      committer: _author.nullAuthor,
      changingLock: null,
      changingWorkDir: null
    };
    this.disposable = new _atom.CompositeDisposable();
  }
  static getDerivedStateFromProps(props) {
    return {
      currentWorkDirs: props.getCurrentWorkDirs()
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.disposable.add(this.props.onDidChangeWorkDirs(this.resetWorkDirs));
    this.disposable.add(this.props.onDidUpdateRepo(this.updateCommitter));
    this.updateCommitter();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.onDidChangeWorkDirs !== this.props.onDidChangeWorkDirs || prevProps.onDidUpdateRepo !== this.props.onDidUpdateRepo) {
      this.disposable.dispose();
      this.disposable = new _atom.CompositeDisposable();
      this.disposable.add(this.props.onDidChangeWorkDirs(this.resetWorkDirs));
      this.disposable.add(this.props.onDidUpdateRepo(this.updateCommitter));
    }
    if (prevProps.getCommitter !== this.props.getCommitter) {
      this.updateCommitter();
    }
  }
  render() {
    return _react.default.createElement(_gitTabHeaderView.default, {
      committer: this.state.committer

      // Workspace
      ,
      workdir: this.getWorkDir(),
      workdirs: this.state.currentWorkDirs,
      contextLocked: this.getLocked(),
      changingWorkDir: this.state.changingWorkDir !== null,
      changingLock: this.state.changingLock !== null

      // Event Handlers
      ,
      handleAvatarClick: this.props.onDidClickAvatar,
      handleWorkDirSelect: this.handleWorkDirSelect,
      handleLockToggle: this.handleLockToggle
    });
  }
  getWorkDir() {
    return this.state.changingWorkDir !== null ? this.state.changingWorkDir : this.props.currentWorkDir;
  }
  getLocked() {
    return this.state.changingLock !== null ? this.state.changingLock : this.props.contextLocked;
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.disposable.dispose();
  }
}
exports.default = GitTabHeaderController;
_defineProperty(GitTabHeaderController, "propTypes", {
  getCommitter: _propTypes.default.func.isRequired,
  // Workspace
  currentWorkDir: _propTypes.default.string,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  // Event Handlers
  onDidClickAvatar: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  onDidUpdateRepo: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRUYWJIZWFkZXJDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJjaGFuZ2luZ0xvY2siLCJuZXh0TG9jayIsImNvbnRleHRMb2NrZWQiLCJzZXRTdGF0ZSIsInNldENvbnRleHRMb2NrIiwiZ2V0V29ya0RpciIsIlByb21pc2UiLCJyZXNvbHZlIiwiZSIsImNoYW5naW5nV29ya0RpciIsIm5leHRXb3JrRGlyIiwidGFyZ2V0IiwidmFsdWUiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5IiwiY3VycmVudFdvcmtEaXJzIiwiY29tbWl0dGVyIiwiZ2V0Q29tbWl0dGVyIiwibnVsbEF1dGhvciIsIl9pc01vdW50ZWQiLCJkaXNwb3NhYmxlIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsImdldEN1cnJlbnRXb3JrRGlycyIsImNvbXBvbmVudERpZE1vdW50IiwiYWRkIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsInJlc2V0V29ya0RpcnMiLCJvbkRpZFVwZGF0ZVJlcG8iLCJ1cGRhdGVDb21taXR0ZXIiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJkaXNwb3NlIiwicmVuZGVyIiwiZ2V0TG9ja2VkIiwib25EaWRDbGlja0F2YXRhciIsImhhbmRsZVdvcmtEaXJTZWxlY3QiLCJoYW5kbGVMb2NrVG9nZ2xlIiwiY3VycmVudFdvcmtEaXIiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiYm9vbCJdLCJzb3VyY2VzIjpbImdpdC10YWItaGVhZGVyLWNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtudWxsQXV0aG9yfSBmcm9tICcuLi9tb2RlbHMvYXV0aG9yJztcbmltcG9ydCBHaXRUYWJIZWFkZXJWaWV3IGZyb20gJy4uL3ZpZXdzL2dpdC10YWItaGVhZGVyLXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRUYWJIZWFkZXJDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBnZXRDb21taXR0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBXb3Jrc3BhY2VcbiAgICBjdXJyZW50V29ya0RpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBnZXRDdXJyZW50V29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICBvbkRpZENsaWNrQXZhdGFyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25EaWRVcGRhdGVSZXBvOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGN1cnJlbnRXb3JrRGlyczogW10sXG4gICAgICBjb21taXR0ZXI6IG51bGxBdXRob3IsXG4gICAgICBjaGFuZ2luZ0xvY2s6IG51bGwsXG4gICAgICBjaGFuZ2luZ1dvcmtEaXI6IG51bGwsXG4gICAgfTtcbiAgICB0aGlzLmRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50V29ya0RpcnM6IHByb3BzLmdldEN1cnJlbnRXb3JrRGlycygpLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9pc01vdW50ZWQgPSB0cnVlO1xuICAgIHRoaXMuZGlzcG9zYWJsZS5hZGQodGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzKHRoaXMucmVzZXRXb3JrRGlycykpO1xuICAgIHRoaXMuZGlzcG9zYWJsZS5hZGQodGhpcy5wcm9wcy5vbkRpZFVwZGF0ZVJlcG8odGhpcy51cGRhdGVDb21taXR0ZXIpKTtcbiAgICB0aGlzLnVwZGF0ZUNvbW1pdHRlcigpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHByZXZQcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzICE9PSB0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnNcbiAgICAgIHx8IHByZXZQcm9wcy5vbkRpZFVwZGF0ZVJlcG8gIT09IHRoaXMucHJvcHMub25EaWRVcGRhdGVSZXBvXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZS5hZGQodGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzKHRoaXMucmVzZXRXb3JrRGlycykpO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlLmFkZCh0aGlzLnByb3BzLm9uRGlkVXBkYXRlUmVwbyh0aGlzLnVwZGF0ZUNvbW1pdHRlcikpO1xuICAgIH1cbiAgICBpZiAocHJldlByb3BzLmdldENvbW1pdHRlciAhPT0gdGhpcy5wcm9wcy5nZXRDb21taXR0ZXIpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29tbWl0dGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0VGFiSGVhZGVyVmlld1xuICAgICAgICBjb21taXR0ZXI9e3RoaXMuc3RhdGUuY29tbWl0dGVyfVxuXG4gICAgICAgIC8vIFdvcmtzcGFjZVxuICAgICAgICB3b3JrZGlyPXt0aGlzLmdldFdvcmtEaXIoKX1cbiAgICAgICAgd29ya2RpcnM9e3RoaXMuc3RhdGUuY3VycmVudFdvcmtEaXJzfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLmdldExvY2tlZCgpfVxuICAgICAgICBjaGFuZ2luZ1dvcmtEaXI9e3RoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyICE9PSBudWxsfVxuICAgICAgICBjaGFuZ2luZ0xvY2s9e3RoaXMuc3RhdGUuY2hhbmdpbmdMb2NrICE9PSBudWxsfVxuXG4gICAgICAgIC8vIEV2ZW50IEhhbmRsZXJzXG4gICAgICAgIGhhbmRsZUF2YXRhckNsaWNrPXt0aGlzLnByb3BzLm9uRGlkQ2xpY2tBdmF0YXJ9XG4gICAgICAgIGhhbmRsZVdvcmtEaXJTZWxlY3Q9e3RoaXMuaGFuZGxlV29ya0RpclNlbGVjdH1cbiAgICAgICAgaGFuZGxlTG9ja1RvZ2dsZT17dGhpcy5oYW5kbGVMb2NrVG9nZ2xlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTG9ja1RvZ2dsZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5jaGFuZ2luZ0xvY2sgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0TG9jayA9ICF0aGlzLnByb3BzLmNvbnRleHRMb2NrZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYW5naW5nTG9jazogbmV4dExvY2t9KTtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuc2V0Q29udGV4dExvY2sodGhpcy5nZXRXb3JrRGlyKCksIG5leHRMb2NrKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtjaGFuZ2luZ0xvY2s6IG51bGx9LCByZXNvbHZlKSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlV29ya0RpclNlbGVjdCA9IGFzeW5jIGUgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLmNoYW5naW5nV29ya0RpciAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRXb3JrRGlyID0gZS50YXJnZXQudmFsdWU7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYW5naW5nV29ya0RpcjogbmV4dFdvcmtEaXJ9KTtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeShuZXh0V29ya0Rpcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y2hhbmdpbmdXb3JrRGlyOiBudWxsfSwgcmVzb2x2ZSkpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0V29ya0RpcnMgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSgoKSA9PiAoe1xuICAgICAgY3VycmVudFdvcmtEaXJzOiBbXSxcbiAgICB9KSk7XG4gIH1cblxuICB1cGRhdGVDb21taXR0ZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29tbWl0dGVyID0gYXdhaXQgdGhpcy5wcm9wcy5nZXRDb21taXR0ZXIoKSB8fCBudWxsQXV0aG9yO1xuICAgIGlmICh0aGlzLl9pc01vdW50ZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NvbW1pdHRlcn0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFdvcmtEaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyICE9PSBudWxsID8gdGhpcy5zdGF0ZS5jaGFuZ2luZ1dvcmtEaXIgOiB0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyO1xuICB9XG5cbiAgZ2V0TG9ja2VkKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmNoYW5naW5nTG9jayAhPT0gbnVsbCA/IHRoaXMuc3RhdGUuY2hhbmdpbmdMb2NrIDogdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQTREO0FBQUE7QUFBQTtBQUFBO0FBRTdDLE1BQU1BLHNCQUFzQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWlCbEVDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsMENBMkRJLFlBQVk7TUFDN0IsSUFBSSxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsWUFBWSxLQUFLLElBQUksRUFBRTtRQUNwQztNQUNGO01BRUEsTUFBTUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDSCxLQUFLLENBQUNJLGFBQWE7TUFDMUMsSUFBSTtRQUNGLElBQUksQ0FBQ0MsUUFBUSxDQUFDO1VBQUNILFlBQVksRUFBRUM7UUFBUSxDQUFDLENBQUM7UUFDdkMsTUFBTSxJQUFJLENBQUNILEtBQUssQ0FBQ00sY0FBYyxDQUFDLElBQUksQ0FBQ0MsVUFBVSxFQUFFLEVBQUVKLFFBQVEsQ0FBQztNQUM5RCxDQUFDLFNBQVM7UUFDUixNQUFNLElBQUlLLE9BQU8sQ0FBQ0MsT0FBTyxJQUFJLElBQUksQ0FBQ0osUUFBUSxDQUFDO1VBQUNILFlBQVksRUFBRTtRQUFJLENBQUMsRUFBRU8sT0FBTyxDQUFDLENBQUM7TUFDNUU7SUFDRixDQUFD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