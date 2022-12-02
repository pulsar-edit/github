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
    return _react.default.createElement(_githubTabHeaderView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9naXRodWItdGFiLWhlYWRlci1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkdpdGh1YlRhYkhlYWRlckNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzZXRTdGF0ZSIsImN1cnJlbnRXb3JrRGlycyIsInN0YXRlIiwiY2hhbmdpbmdMb2NrIiwibmV4dExvY2siLCJjb250ZXh0TG9ja2VkIiwic2V0Q29udGV4dExvY2siLCJjaGFuZ2luZ1dvcmtEaXIiLCJjdXJyZW50V29ya0RpciIsIlByb21pc2UiLCJyZXNvbHZlIiwiZSIsIm5leHRXb3JrRGlyIiwidGFyZ2V0IiwidmFsdWUiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiY29tcG9uZW50RGlkTW91bnQiLCJkaXNwb3NhYmxlIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsInJlc2V0V29ya0RpcnMiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJkaXNwb3NlIiwicmVuZGVyIiwidXNlciIsImdldFdvcmtEaXIiLCJnZXRDb250ZXh0TG9ja2VkIiwiaGFuZGxlV29ya0RpckNoYW5nZSIsImhhbmRsZUxvY2tUb2dnbGUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIkF1dGhvclByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsInN0cmluZyIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLHlCQUFOLFNBQXdDQyxlQUFNQyxTQUE5QyxDQUF3RDtBQWVyRUMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsMkNBK0NILE1BQU07QUFDcEIsV0FBS0MsUUFBTCxDQUFjLE9BQU87QUFD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QkFBbUIsRUFBRSxLQUFLMEIsbUJBVjVCO0FBV0UsTUFBQSxnQkFBZ0IsRUFBRSxLQUFLQztBQVh6QixNQURGO0FBZUQ7O0FBb0NESCxFQUFBQSxVQUFVLEdBQUc7QUFDWCxXQUFPLEtBQUt6QixLQUFMLENBQVdLLGVBQVgsS0FBK0IsSUFBL0IsR0FBc0MsS0FBS0wsS0FBTCxDQUFXSyxlQUFqRCxHQUFtRSxLQUFLUixLQUFMLENBQVdTLGNBQXJGO0FBQ0Q7O0FBRURvQixFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixXQUFPLEtBQUsxQixLQUFMLENBQVdDLFlBQVgsS0FBNEIsSUFBNUIsR0FBbUMsS0FBS0QsS0FBTCxDQUFXQyxZQUE5QyxHQUE2RCxLQUFLSixLQUFMLENBQVdNLGFBQS9FO0FBQ0Q7O0FBRUQwQixFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixTQUFLWixVQUFMLENBQWdCSyxPQUFoQjtBQUNEOztBQTFHb0U7Ozs7Z0JBQWxEN0IseUIsZUFDQTtBQUNqQitCLEVBQUFBLElBQUksRUFBRU0sMkJBQWVDLFVBREo7QUFHakI7QUFDQXpCLEVBQUFBLGNBQWMsRUFBRTBCLG1CQUFVQyxNQUpUO0FBS2pCOUIsRUFBQUEsYUFBYSxFQUFFNkIsbUJBQVVFLElBQVYsQ0FBZUgsVUFMYjtBQU1qQmxCLEVBQUFBLHNCQUFzQixFQUFFbUIsbUJBQVVHLElBQVYsQ0FBZUosVUFOdEI7QUFPakIzQixFQUFBQSxjQUFjLEVBQUU0QixtQkFBVUcsSUFBVixDQUFlSixVQVBkO0FBUWpCaEIsRUFBQUEsa0JBQWtCLEVBQUVpQixtQkFBVUcsSUFBVixDQUFlSixVQVJsQjtBQVVqQjtBQUNBYixFQUFBQSxtQkFBbUIsRUFBRWMsbUJBQVVHLElBQVYsQ0FBZUo7QUFYbkIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtBdXRob3JQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgR2l0aHViVGFiSGVhZGVyVmlldyBmcm9tICcuLi92aWV3cy9naXRodWItdGFiLWhlYWRlci12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViVGFiSGVhZGVyQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdXNlcjogQXV0aG9yUHJvcFR5cGUuaXNSZXF1aXJlZCxcblxuICAgIC8vIFdvcmtzcGFjZVxuICAgIGN1cnJlbnRXb3JrRGlyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBnZXRDdXJyZW50V29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBFdmVudCBIYW5kbGVyc1xuICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50V29ya0RpcnM6IFtdLFxuICAgICAgY2hhbmdpbmdMb2NrOiBudWxsLFxuICAgICAgY2hhbmdpbmdXb3JrRGlyOiBudWxsLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRXb3JrRGlyczogcHJvcHMuZ2V0Q3VycmVudFdvcmtEaXJzKCksXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZSA9IHRoaXMucHJvcHMub25EaWRDaGFuZ2VXb3JrRGlycyh0aGlzLnJlc2V0V29ya0RpcnMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGlmIChwcmV2UHJvcHMub25EaWRDaGFuZ2VXb3JrRGlycyAhPT0gdGhpcy5wcm9wcy5vbkRpZENoYW5nZVdvcmtEaXJzKSB7XG4gICAgICBpZiAodGhpcy5kaXNwb3NhYmxlKSB7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmRpc3Bvc2FibGUgPSB0aGlzLnByb3BzLm9uRGlkQ2hhbmdlV29ya0RpcnModGhpcy5yZXNldFdvcmtEaXJzKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRodWJUYWJIZWFkZXJWaWV3XG4gICAgICAgIHVzZXI9e3RoaXMucHJvcHMudXNlcn1cblxuICAgICAgICAvLyBXb3Jrc3BhY2VcbiAgICAgICAgd29ya2Rpcj17dGhpcy5nZXRXb3JrRGlyKCl9XG4gICAgICAgIHdvcmtkaXJzPXt0aGlzLnN0YXRlLmN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5nZXRDb250ZXh0TG9ja2VkKCl9XG4gICAgICAgIGNoYW5naW5nV29ya0Rpcj17dGhpcy5zdGF0ZS5jaGFuZ2luZ1dvcmtEaXIgIT09IG51bGx9XG4gICAgICAgIGNoYW5naW5nTG9jaz17dGhpcy5zdGF0ZS5jaGFuZ2luZ0xvY2sgIT09IG51bGx9XG5cbiAgICAgICAgaGFuZGxlV29ya0RpckNoYW5nZT17dGhpcy5oYW5kbGVXb3JrRGlyQ2hhbmdlfVxuICAgICAgICBoYW5kbGVMb2NrVG9nZ2xlPXt0aGlzLmhhbmRsZUxvY2tUb2dnbGV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZXNldFdvcmtEaXJzID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoKCkgPT4gKHtcbiAgICAgIGN1cnJlbnRXb3JrRGlyczogW10sXG4gICAgfSkpO1xuICB9XG5cbiAgaGFuZGxlTG9ja1RvZ2dsZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5jaGFuZ2luZ0xvY2sgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0TG9jayA9ICF0aGlzLnByb3BzLmNvbnRleHRMb2NrZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYW5naW5nTG9jazogbmV4dExvY2t9KTtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuc2V0Q29udGV4dExvY2sodGhpcy5zdGF0ZS5jaGFuZ2luZ1dvcmtEaXIgfHwgdGhpcy5wcm9wcy5jdXJyZW50V29ya0RpciwgbmV4dExvY2spO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2NoYW5naW5nTG9jazogbnVsbH0sIHJlc29sdmUpKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVXb3JrRGlyQ2hhbmdlID0gYXN5bmMgZSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY2hhbmdpbmdXb3JrRGlyICE9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFdvcmtEaXIgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hhbmdpbmdXb3JrRGlyOiBuZXh0V29ya0Rpcn0pO1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5KG5leHRXb3JrRGlyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtjaGFuZ2luZ1dvcmtEaXI6IG51bGx9LCByZXNvbHZlKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0V29ya0RpcigpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jaGFuZ2luZ1dvcmtEaXIgIT09IG51bGwgPyB0aGlzLnN0YXRlLmNoYW5naW5nV29ya0RpciA6IHRoaXMucHJvcHMuY3VycmVudFdvcmtEaXI7XG4gIH1cblxuICBnZXRDb250ZXh0TG9ja2VkKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmNoYW5naW5nTG9jayAhPT0gbnVsbCA/IHRoaXMuc3RhdGUuY2hhbmdpbmdMb2NrIDogdGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl19