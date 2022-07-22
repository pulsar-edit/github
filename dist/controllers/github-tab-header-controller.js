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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement(_githubTabHeaderView.default, {
      user: this.props.user // Workspace
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9naXRodWItdGFiLWhlYWRlci1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkdpdGh1YlRhYkhlYWRlckNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzZXRTdGF0ZSIsImN1cnJlbnRXb3JrRGlycyIsInN0YXRlIiwiY2hhbmdpbmdMb2NrIiwibmV4dExvY2siLCJjb250ZXh0TG9ja2VkIiwic2V0Q29udGV4dExvY2siLCJjaGFuZ2luZ1dvcmtEaXIiLCJjdXJyZW50V29ya0RpciIsIlByb21pc2UiLCJyZXNvbHZlIiwiZSIsIm5leHRXb3JrRGlyIiwidGFyZ2V0IiwidmFsdWUiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiY29tcG9uZW50RGlkTW91bnQiLCJkaXNwb3NhYmxlIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsInJlc2V0V29ya0RpcnMiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJkaXNwb3NlIiwicmVuZGVyIiwidXNlciIsImdldFdvcmtEaXIiLCJnZXRDb250ZXh0TG9ja2VkIiwiaGFuZGxlV29ya0RpckNoYW5nZSIsImhhbmRsZUxvY2tUb2dnbGUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIkF1dGhvclByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLHlCQUFOLFNBQXdDQyxlQUFNQyxTQUE5QyxDQUF3RDtBQWVyRUMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsMkNBK0NILE1BQU07QUFDcEIsV0FBS0MsUUFBTCxDQUFjLE9BQU87QUFD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bUJBQW1CLEVBQUUsS0FBSzBCLG1CQVY1QjtBQVdFLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS0M7QUFYekIsTUFERjtBQWVEOztBQW9DREgsRUFBQUEsVUFBVSxHQUFHO0FBQ1gsV0FBTyxLQUFLekIsS0FBTCxDQUFXSyxlQUFYLEtBQStCLElBQS9CLEdBQXNDLEtBQUtMLEtBQUwsQ0FBV0ssZUFBakQsR0FBbUUsS0FBS1IsS0FBTCxDQUFXUyxjQUFyRjtBQUNEOztBQUVEb0IsRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakIsV0FBTyxLQUFLMUIsS0FBTCxDQUFXQyxZQUFYLEtBQTRCLElBQTVCLEdBQW1DLEtBQUtELEtBQUwsQ0FBV0MsWUFBOUMsR0FBNkQsS0FBS0osS0FBTCxDQUFXTSxhQUEvRTtBQUNEOztBQUVEMEIsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckIsU0FBS1osVUFBTCxDQUFnQkssT0FBaEI7QUFDRDs7QUExR29FOzs7O2dCQUFsRDdCLHlCLGVBQ0E7QUFDakIrQixFQUFBQSxJQUFJLEVBQUVNLDJCQUFlQyxVQURKO0FBR2pCO0FBQ0F6QixFQUFBQSxjQUFjLEVBQUUwQixtQkFBVUMsTUFKVDtBQUtqQjlCLEVBQUFBLGFBQWEsRUFBRTZCLG1CQUFVRSxJQUFWLENBQWVILFVBTGI7QUFNakJsQixFQUFBQSxzQkFBc0IsRUFBRW1CLG1CQUFVRyxJQUFWLENBQWVKLFVBTnRCO0FBT2pCM0IsRUFBQUEsY0FBYyxFQUFFNEIsbUJBQVVHLElBQVYsQ0FBZUosVUFQZDtBQVFqQmhCLEVBQUFBLGtCQUFrQixFQUFFaUIsbUJBQVVHLElBQVYsQ0FBZUosVUFSbEI7QUFVakI7QUFDQWIsRUFBQUEsbUJBQW1CLEVBQUVjLG1CQUFVRyxJQUFWLENBQWVKO0FBWG5CLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7QXV0aG9yUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IEdpdGh1YlRhYkhlYWRlclZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0aHViLXRhYi1oZWFkZXItdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YlRhYkhlYWRlckNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHVzZXI6IEF1dGhvclByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBXb3Jrc3BhY2VcbiAgICBjdXJyZW50V29ya0RpcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZ2V0Q3VycmVudFdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gRXZlbnQgSGFuZGxlcnNcbiAgICBvbkRpZENoYW5nZVdvcmtEaXJzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY3VycmVudFdvcmtEaXJzOiBbXSxcbiAgICAgIGNoYW5naW5nTG9jazogbnVsbCxcbiAgICAgIGNoYW5naW5nV29ya0RpcjogbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50V29ya0RpcnM6IHByb3BzLmdldEN1cnJlbnRXb3JrRGlycygpLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGUgPSB0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnModGhpcy5yZXNldFdvcmtEaXJzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAocHJldlByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnMgIT09IHRoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlycykge1xuICAgICAgaWYgKHRoaXMuZGlzcG9zYWJsZSkge1xuICAgICAgICB0aGlzLmRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5kaXNwb3NhYmxlID0gdGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzKHRoaXMucmVzZXRXb3JrRGlycyk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0aHViVGFiSGVhZGVyVmlld1xuICAgICAgICB1c2VyPXt0aGlzLnByb3BzLnVzZXJ9XG5cbiAgICAgICAgLy8gV29ya3NwYWNlXG4gICAgICAgIHdvcmtkaXI9e3RoaXMuZ2V0V29ya0RpcigpfVxuICAgICAgICB3b3JrZGlycz17dGhpcy5zdGF0ZS5jdXJyZW50V29ya0RpcnN9XG4gICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMuZ2V0Q29udGV4dExvY2tlZCgpfVxuICAgICAgICBjaGFuZ2luZ1dvcmtEaXI9e3RoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyICE9PSBudWxsfVxuICAgICAgICBjaGFuZ2luZ0xvY2s9e3RoaXMuc3RhdGUuY2hhbmdpbmdMb2NrICE9PSBudWxsfVxuXG4gICAgICAgIGhhbmRsZVdvcmtEaXJDaGFuZ2U9e3RoaXMuaGFuZGxlV29ya0RpckNoYW5nZX1cbiAgICAgICAgaGFuZGxlTG9ja1RvZ2dsZT17dGhpcy5oYW5kbGVMb2NrVG9nZ2xlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVzZXRXb3JrRGlycyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKCgpID0+ICh7XG4gICAgICBjdXJyZW50V29ya0RpcnM6IFtdLFxuICAgIH0pKTtcbiAgfVxuXG4gIGhhbmRsZUxvY2tUb2dnbGUgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY2hhbmdpbmdMb2NrICE9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dExvY2sgPSAhdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjaGFuZ2luZ0xvY2s6IG5leHRMb2NrfSk7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnNldENvbnRleHRMb2NrKHRoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyIHx8IHRoaXMucHJvcHMuY3VycmVudFdvcmtEaXIsIG5leHRMb2NrKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtjaGFuZ2luZ0xvY2s6IG51bGx9LCByZXNvbHZlKSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlV29ya0RpckNoYW5nZSA9IGFzeW5jIGUgPT4ge1xuICAgIGlmICh0aGlzLnN0YXRlLmNoYW5naW5nV29ya0RpciAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRXb3JrRGlyID0gZS50YXJnZXQudmFsdWU7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYW5naW5nV29ya0RpcjogbmV4dFdvcmtEaXJ9KTtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeShuZXh0V29ya0Rpcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7Y2hhbmdpbmdXb3JrRGlyOiBudWxsfSwgcmVzb2x2ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGdldFdvcmtEaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyICE9PSBudWxsID8gdGhpcy5zdGF0ZS5jaGFuZ2luZ1dvcmtEaXIgOiB0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyO1xuICB9XG5cbiAgZ2V0Q29udGV4dExvY2tlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jaGFuZ2luZ0xvY2sgIT09IG51bGwgPyB0aGlzLnN0YXRlLmNoYW5naW5nTG9jayA6IHRoaXMucHJvcHMuY29udGV4dExvY2tlZDtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==