"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _branchView = _interopRequireDefault(require("../views/branch-view"));
var _branchMenuView = _interopRequireDefault(require("../views/branch-menu-view"));
var _pushPullView = _interopRequireDefault(require("../views/push-pull-view"));
var _changedFilesCountView = _interopRequireDefault(require("../views/changed-files-count-view"));
var _githubTileView = _interopRequireDefault(require("../views/github-tile-view"));
var _tooltip = _interopRequireDefault(require("../atom/tooltip"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _observeModel = _interopRequireDefault(require("../views/observe-model"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _yubikiri = _interopRequireDefault(require("yubikiri"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class StatusBarTileController extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "fetchData", repository => {
      return (0, _yubikiri.default)({
        currentBranch: repository.getCurrentBranch(),
        branches: repository.getBranches(),
        statusesForChangedFiles: repository.getStatusesForChangedFiles(),
        currentRemote: async query => repository.getRemoteForBranch((await query.currentBranch).getName()),
        aheadCount: async query => repository.getAheadCount((await query.currentBranch).getName()),
        behindCount: async query => repository.getBehindCount((await query.currentBranch).getName()),
        originExists: async () => (await repository.getRemotes()).withName('origin').isPresent()
      });
    });
    _defineProperty(this, "handleOpenGitTimingsView", e => {
      e && e.preventDefault();
      this.props.workspace.open('atom-github://debug/timings');
    });
    _defineProperty(this, "checkout", (branchName, options) => {
      return this.props.repository.checkout(branchName, options);
    });
    this.refBranchViewRoot = new _refHolder.default();
  }
  getChangedFilesCount(data) {
    const {
      stagedFiles,
      unstagedFiles,
      mergeConflictFiles
    } = data.statusesForChangedFiles;
    const changedFiles = new Set();
    for (const filePath in unstagedFiles) {
      changedFiles.add(filePath);
    }
    for (const filePath in stagedFiles) {
      changedFiles.add(filePath);
    }
    for (const filePath in mergeConflictFiles) {
      changedFiles.add(filePath);
    }
    return changedFiles.size;
  }
  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, data => data ? this.renderWithData(data) : null);
  }
  renderWithData(data) {
    let changedFilesCount, mergeConflictsPresent;
    if (data.statusesForChangedFiles) {
      changedFilesCount = this.getChangedFilesCount(data);
      mergeConflictsPresent = Object.keys(data.statusesForChangedFiles.mergeConflictFiles).length > 0;
    }
    const repoProps = {
      repository: this.props.repository,
      currentBranch: data.currentBranch,
      branches: data.branches,
      currentRemote: data.currentRemote,
      aheadCount: data.aheadCount,
      behindCount: data.behindCount,
      originExists: data.originExists,
      changedFilesCount,
      mergeConflictsPresent
    };
    return _react.default.createElement(_react.Fragment, null, this.renderTiles(repoProps), _react.default.createElement(_githubTileView.default, {
      didClick: this.props.toggleGithubTab
    }), _react.default.createElement(_changedFilesCountView.default, {
      didClick: this.props.toggleGitTab,
      changedFilesCount: repoProps.changedFilesCount,
      mergeConflictsPresent: repoProps.mergeConflictsPresent
    }));
  }
  renderTiles(repoProps) {
    if (!this.props.repository.showStatusBarTiles()) {
      return null;
    }
    const operationStates = this.props.repository.getOperationStates();
    const pushInProgress = operationStates.isPushInProgress();
    const pullInProgress = operationStates.isPullInProgress();
    const fetchInProgress = operationStates.isFetchInProgress();
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, _react.default.createElement(_commands.Command, {
      command: "github:fetch",
      callback: this.fetch(repoProps)
    }), _react.default.createElement(_commands.Command, {
      command: "github:pull",
      callback: this.pull(repoProps)
    }), _react.default.createElement(_commands.Command, {
      command: "github:push",
      callback: () => this.push(repoProps)({
        force: false,
        setUpstream: !repoProps.currentRemote.isPresent()
      })
    }), _react.default.createElement(_commands.Command, {
      command: "github:force-push",
      callback: () => this.push(repoProps)({
        force: true,
        setUpstream: !repoProps.currentRemote.isPresent()
      })
    })), _react.default.createElement(_branchView.default, {
      refRoot: this.refBranchViewRoot.setter,
      workspace: this.props.workspace,
      checkout: this.checkout,
      currentBranch: repoProps.currentBranch
    }), _react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refBranchViewRoot,
      trigger: "click",
      className: "github-StatusBarTileController-tooltipMenu"
    }, _react.default.createElement(_branchMenuView.default, {
      workspace: this.props.workspace,
      notificationManager: this.props.notificationManager,
      commands: this.props.commands,
      checkout: this.checkout,
      branches: repoProps.branches,
      currentBranch: repoProps.currentBranch
    })), _react.default.createElement(_pushPullView.default, {
      isSyncing: fetchInProgress || pullInProgress || pushInProgress,
      isFetching: fetchInProgress,
      isPulling: pullInProgress,
      isPushing: pushInProgress,
      push: this.push(repoProps),
      pull: this.pull(repoProps),
      fetch: this.fetch(repoProps),
      tooltipManager: this.props.tooltips,
      currentBranch: repoProps.currentBranch,
      currentRemote: repoProps.currentRemote,
      behindCount: repoProps.behindCount,
      aheadCount: repoProps.aheadCount,
      originExists: repoProps.originExists
    }));
  }
  push(data) {
    return ({
      force,
      setUpstream
    } = {}) => {
      return this.props.repository.push(data.currentBranch.getName(), {
        force,
        setUpstream,
        refSpec: data.currentBranch.getRefSpec('PUSH')
      });
    };
  }
  pull(data) {
    return () => {
      return this.props.repository.pull(data.currentBranch.getName(), {
        refSpec: data.currentBranch.getRefSpec('PULL')
      });
    };
  }
  fetch(data) {
    return () => {
      const upstream = data.currentBranch.getUpstream();
      return this.props.repository.fetch(upstream.getRemoteRef(), {
        remoteName: upstream.getRemoteName()
      });
    };
  }
}
exports.default = StatusBarTileController;
_defineProperty(StatusBarTileController, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  notificationManager: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  repository: _propTypes.default.object.isRequired,
  toggleGitTab: _propTypes.default.func,
  toggleGithubTab: _propTypes.default.func
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTdGF0dXNCYXJUaWxlQ29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlcG9zaXRvcnkiLCJ5dWJpa2lyaSIsImN1cnJlbnRCcmFuY2giLCJnZXRDdXJyZW50QnJhbmNoIiwiYnJhbmNoZXMiLCJnZXRCcmFuY2hlcyIsInN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzIiwiZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMiLCJjdXJyZW50UmVtb3RlIiwicXVlcnkiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJnZXROYW1lIiwiYWhlYWRDb3VudCIsImdldEFoZWFkQ291bnQiLCJiZWhpbmRDb3VudCIsImdldEJlaGluZENvdW50Iiwib3JpZ2luRXhpc3RzIiwiZ2V0UmVtb3RlcyIsIndpdGhOYW1lIiwiaXNQcmVzZW50IiwiZSIsInByZXZlbnREZWZhdWx0Iiwid29ya3NwYWNlIiwib3BlbiIsImJyYW5jaE5hbWUiLCJvcHRpb25zIiwiY2hlY2tvdXQiLCJyZWZCcmFuY2hWaWV3Um9vdCIsIlJlZkhvbGRlciIsImdldENoYW5nZWRGaWxlc0NvdW50IiwiZGF0YSIsInN0YWdlZEZpbGVzIiwidW5zdGFnZWRGaWxlcyIsIm1lcmdlQ29uZmxpY3RGaWxlcyIsImNoYW5nZWRGaWxlcyIsIlNldCIsImZpbGVQYXRoIiwiYWRkIiwic2l6ZSIsInJlbmRlciIsImZldGNoRGF0YSIsInJlbmRlcldpdGhEYXRhIiwiY2hhbmdlZEZpbGVzQ291bnQiLCJtZXJnZUNvbmZsaWN0c1ByZXNlbnQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwicmVwb1Byb3BzIiwicmVuZGVyVGlsZXMiLCJ0b2dnbGVHaXRodWJUYWIiLCJ0b2dnbGVHaXRUYWIiLCJzaG93U3RhdHVzQmFyVGlsZXMiLCJvcGVyYXRpb25TdGF0ZXMiLCJnZXRPcGVyYXRpb25TdGF0ZXMiLCJwdXNoSW5Qcm9ncmVzcyIsImlzUHVzaEluUHJvZ3Jlc3MiLCJwdWxsSW5Qcm9ncmVzcyIsImlzUHVsbEluUHJvZ3Jlc3MiLCJmZXRjaEluUHJvZ3Jlc3MiLCJpc0ZldGNoSW5Qcm9ncmVzcyIsImNvbW1hbmRzIiwiZmV0Y2giLCJwdWxsIiwicHVzaCIsImZvcmNlIiwic2V0VXBzdHJlYW0iLCJzZXR0ZXIiLCJ0b29sdGlwcyIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJyZWZTcGVjIiwiZ2V0UmVmU3BlYyIsInVwc3RyZWFtIiwiZ2V0VXBzdHJlYW0iLCJnZXRSZW1vdGVSZWYiLCJyZW1vdGVOYW1lIiwiZ2V0UmVtb3RlTmFtZSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJjb25maXJtIiwiZnVuYyJdLCJzb3VyY2VzIjpbInN0YXR1cy1iYXItdGlsZS1jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgQnJhbmNoVmlldyBmcm9tICcuLi92aWV3cy9icmFuY2gtdmlldyc7XG5pbXBvcnQgQnJhbmNoTWVudVZpZXcgZnJvbSAnLi4vdmlld3MvYnJhbmNoLW1lbnUtdmlldyc7XG5pbXBvcnQgUHVzaFB1bGxWaWV3IGZyb20gJy4uL3ZpZXdzL3B1c2gtcHVsbC12aWV3JztcbmltcG9ydCBDaGFuZ2VkRmlsZXNDb3VudFZpZXcgZnJvbSAnLi4vdmlld3MvY2hhbmdlZC1maWxlcy1jb3VudC12aWV3JztcbmltcG9ydCBHaXRodWJUaWxlVmlldyBmcm9tICcuLi92aWV3cy9naXRodWItdGlsZS12aWV3JztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0JhclRpbGVDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvZ2dsZUdpdFRhYjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlR2l0aHViVGFiOiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZCcmFuY2hWaWV3Um9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIGdldENoYW5nZWRGaWxlc0NvdW50KGRhdGEpIHtcbiAgICBjb25zdCB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc30gPSBkYXRhLnN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzO1xuICAgIGNvbnN0IGNoYW5nZWRGaWxlcyA9IG5ldyBTZXQoKTtcblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGggaW4gdW5zdGFnZWRGaWxlcykge1xuICAgICAgY2hhbmdlZEZpbGVzLmFkZChmaWxlUGF0aCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmlsZVBhdGggaW4gc3RhZ2VkRmlsZXMpIHtcbiAgICAgIGNoYW5nZWRGaWxlcy5hZGQoZmlsZVBhdGgpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIGluIG1lcmdlQ29uZmxpY3RGaWxlcykge1xuICAgICAgY2hhbmdlZEZpbGVzLmFkZChmaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZWRGaWxlcy5zaXplO1xuICB9XG5cbiAgZmV0Y2hEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIGN1cnJlbnRCcmFuY2g6IHJlcG9zaXRvcnkuZ2V0Q3VycmVudEJyYW5jaCgpLFxuICAgICAgYnJhbmNoZXM6IHJlcG9zaXRvcnkuZ2V0QnJhbmNoZXMoKSxcbiAgICAgIHN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzOiByZXBvc2l0b3J5LmdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKCksXG4gICAgICBjdXJyZW50UmVtb3RlOiBhc3luYyBxdWVyeSA9PiByZXBvc2l0b3J5LmdldFJlbW90ZUZvckJyYW5jaCgoYXdhaXQgcXVlcnkuY3VycmVudEJyYW5jaCkuZ2V0TmFtZSgpKSxcbiAgICAgIGFoZWFkQ291bnQ6IGFzeW5jIHF1ZXJ5ID0+IHJlcG9zaXRvcnkuZ2V0QWhlYWRDb3VudCgoYXdhaXQgcXVlcnkuY3VycmVudEJyYW5jaCkuZ2V0TmFtZSgpKSxcbiAgICAgIGJlaGluZENvdW50OiBhc3luYyBxdWVyeSA9PiByZXBvc2l0b3J5LmdldEJlaGluZENvdW50KChhd2FpdCBxdWVyeS5jdXJyZW50QnJhbmNoKS5nZXROYW1lKCkpLFxuICAgICAgb3JpZ2luRXhpc3RzOiBhc3luYyAoKSA9PiAoYXdhaXQgcmVwb3NpdG9yeS5nZXRSZW1vdGVzKCkpLndpdGhOYW1lKCdvcmlnaW4nKS5pc1ByZXNlbnQoKSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hEYXRhfT5cbiAgICAgICAge2RhdGEgPT4gKGRhdGEgPyB0aGlzLnJlbmRlcldpdGhEYXRhKGRhdGEpIDogbnVsbCl9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyV2l0aERhdGEoZGF0YSkge1xuICAgIGxldCBjaGFuZ2VkRmlsZXNDb3VudCwgbWVyZ2VDb25mbGljdHNQcmVzZW50O1xuICAgIGlmIChkYXRhLnN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKSB7XG4gICAgICBjaGFuZ2VkRmlsZXNDb3VudCA9IHRoaXMuZ2V0Q2hhbmdlZEZpbGVzQ291bnQoZGF0YSk7XG4gICAgICBtZXJnZUNvbmZsaWN0c1ByZXNlbnQgPSBPYmplY3Qua2V5cyhkYXRhLnN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzLm1lcmdlQ29uZmxpY3RGaWxlcykubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBjb25zdCByZXBvUHJvcHMgPSB7XG4gICAgICByZXBvc2l0b3J5OiB0aGlzLnByb3BzLnJlcG9zaXRvcnksXG4gICAgICBjdXJyZW50QnJhbmNoOiBkYXRhLmN1cnJlbnRCcmFuY2gsXG4gICAgICBicmFuY2hlczogZGF0YS5icmFuY2hlcyxcbiAgICAgIGN1cnJlbnRSZW1vdGU6IGRhdGEuY3VycmVudFJlbW90ZSxcbiAgICAgIGFoZWFkQ291bnQ6IGRhdGEuYWhlYWRDb3VudCxcbiAgICAgIGJlaGluZENvdW50OiBkYXRhLmJlaGluZENvdW50LFxuICAgICAgb3JpZ2luRXhpc3RzOiBkYXRhLm9yaWdpbkV4aXN0cyxcbiAgICAgIGNoYW5nZWRGaWxlc0NvdW50LFxuICAgICAgbWVyZ2VDb25mbGljdHNQcmVzZW50LFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICB7dGhpcy5yZW5kZXJUaWxlcyhyZXBvUHJvcHMpfVxuICAgICAgICA8R2l0aHViVGlsZVZpZXcgZGlkQ2xpY2s9e3RoaXMucHJvcHMudG9nZ2xlR2l0aHViVGFifSAvPlxuICAgICAgICA8Q2hhbmdlZEZpbGVzQ291bnRWaWV3XG4gICAgICAgICAgZGlkQ2xpY2s9e3RoaXMucHJvcHMudG9nZ2xlR2l0VGFifVxuICAgICAgICAgIGNoYW5nZWRGaWxlc0NvdW50PXtyZXBvUHJvcHMuY2hhbmdlZEZpbGVzQ291bnR9XG4gICAgICAgICAgbWVyZ2VDb25mbGljdHNQcmVzZW50PXtyZXBvUHJvcHMubWVyZ2VDb25mbGljdHNQcmVzZW50fVxuICAgICAgICAvPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVGlsZXMocmVwb1Byb3BzKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkuc2hvd1N0YXR1c0JhclRpbGVzKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZXJhdGlvblN0YXRlcyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKTtcbiAgICBjb25zdCBwdXNoSW5Qcm9ncmVzcyA9IG9wZXJhdGlvblN0YXRlcy5pc1B1c2hJblByb2dyZXNzKCk7XG4gICAgY29uc3QgcHVsbEluUHJvZ3Jlc3MgPSBvcGVyYXRpb25TdGF0ZXMuaXNQdWxsSW5Qcm9ncmVzcygpO1xuICAgIGNvbnN0IGZldGNoSW5Qcm9ncmVzcyA9IG9wZXJhdGlvblN0YXRlcy5pc0ZldGNoSW5Qcm9ncmVzcygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6ZmV0Y2hcIiBjYWxsYmFjaz17dGhpcy5mZXRjaChyZXBvUHJvcHMpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cHVsbFwiIGNhbGxiYWNrPXt0aGlzLnB1bGwocmVwb1Byb3BzKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1YjpwdXNoXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnB1c2gocmVwb1Byb3BzKSh7Zm9yY2U6IGZhbHNlLCBzZXRVcHN0cmVhbTogIXJlcG9Qcm9wcy5jdXJyZW50UmVtb3RlLmlzUHJlc2VudCgpfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1Yjpmb3JjZS1wdXNoXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXsoKSA9PiB0aGlzLnB1c2gocmVwb1Byb3BzKSh7Zm9yY2U6IHRydWUsIHNldFVwc3RyZWFtOiAhcmVwb1Byb3BzLmN1cnJlbnRSZW1vdGUuaXNQcmVzZW50KCl9KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8QnJhbmNoVmlld1xuICAgICAgICAgIHJlZlJvb3Q9e3RoaXMucmVmQnJhbmNoVmlld1Jvb3Quc2V0dGVyfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgY2hlY2tvdXQ9e3RoaXMuY2hlY2tvdXR9XG4gICAgICAgICAgY3VycmVudEJyYW5jaD17cmVwb1Byb3BzLmN1cnJlbnRCcmFuY2h9XG4gICAgICAgIC8+XG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmQnJhbmNoVmlld1Jvb3R9XG4gICAgICAgICAgdHJpZ2dlcj1cImNsaWNrXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhdHVzQmFyVGlsZUNvbnRyb2xsZXItdG9vbHRpcE1lbnVcIj5cbiAgICAgICAgICA8QnJhbmNoTWVudVZpZXdcbiAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgIGNoZWNrb3V0PXt0aGlzLmNoZWNrb3V0fVxuICAgICAgICAgICAgYnJhbmNoZXM9e3JlcG9Qcm9wcy5icmFuY2hlc31cbiAgICAgICAgICAgIGN1cnJlbnRCcmFuY2g9e3JlcG9Qcm9wcy5jdXJyZW50QnJhbmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgPFB1c2hQdWxsVmlld1xuICAgICAgICAgIGlzU3luY2luZz17ZmV0Y2hJblByb2dyZXNzIHx8IHB1bGxJblByb2dyZXNzIHx8IHB1c2hJblByb2dyZXNzfVxuICAgICAgICAgIGlzRmV0Y2hpbmc9e2ZldGNoSW5Qcm9ncmVzc31cbiAgICAgICAgICBpc1B1bGxpbmc9e3B1bGxJblByb2dyZXNzfVxuICAgICAgICAgIGlzUHVzaGluZz17cHVzaEluUHJvZ3Jlc3N9XG4gICAgICAgICAgcHVzaD17dGhpcy5wdXNoKHJlcG9Qcm9wcyl9XG4gICAgICAgICAgcHVsbD17dGhpcy5wdWxsKHJlcG9Qcm9wcyl9XG4gICAgICAgICAgZmV0Y2g9e3RoaXMuZmV0Y2gocmVwb1Byb3BzKX1cbiAgICAgICAgICB0b29sdGlwTWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICBjdXJyZW50QnJhbmNoPXtyZXBvUHJvcHMuY3VycmVudEJyYW5jaH1cbiAgICAgICAgICBjdXJyZW50UmVtb3RlPXtyZXBvUHJvcHMuY3VycmVudFJlbW90ZX1cbiAgICAgICAgICBiZWhpbmRDb3VudD17cmVwb1Byb3BzLmJlaGluZENvdW50fVxuICAgICAgICAgIGFoZWFkQ291bnQ9e3JlcG9Qcm9wcy5haGVhZENvdW50fVxuICAgICAgICAgIG9yaWdpbkV4aXN0cz17cmVwb1Byb3BzLm9yaWdpbkV4aXN0c31cbiAgICAgICAgLz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZU9wZW5HaXRUaW1pbmdzVmlldyA9IGUgPT4ge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oJ2F0b20tZ2l0aHViOi8vZGVidWcvdGltaW5ncycpO1xuICB9XG5cbiAgY2hlY2tvdXQgPSAoYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY2hlY2tvdXQoYnJhbmNoTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdXNoKGRhdGEpIHtcbiAgICByZXR1cm4gKHtmb3JjZSwgc2V0VXBzdHJlYW19ID0ge30pID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkucHVzaChkYXRhLmN1cnJlbnRCcmFuY2guZ2V0TmFtZSgpLCB7XG4gICAgICAgIGZvcmNlLFxuICAgICAgICBzZXRVcHN0cmVhbSxcbiAgICAgICAgcmVmU3BlYzogZGF0YS5jdXJyZW50QnJhbmNoLmdldFJlZlNwZWMoJ1BVU0gnKSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBwdWxsKGRhdGEpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5wdWxsKGRhdGEuY3VycmVudEJyYW5jaC5nZXROYW1lKCksIHtcbiAgICAgICAgcmVmU3BlYzogZGF0YS5jdXJyZW50QnJhbmNoLmdldFJlZlNwZWMoJ1BVTEwnKSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBmZXRjaChkYXRhKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IHVwc3RyZWFtID0gZGF0YS5jdXJyZW50QnJhbmNoLmdldFVwc3RyZWFtKCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmZldGNoKHVwc3RyZWFtLmdldFJlbW90ZVJlZigpLCB7XG4gICAgICAgIHJlbW90ZU5hbWU6IHVwc3RyZWFtLmdldFJlbW90ZU5hbWUoKSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQWdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVqQixNQUFNQSx1QkFBdUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFZbkVDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsbUNBc0JIQyxVQUFVLElBQUk7TUFDeEIsT0FBTyxJQUFBQyxpQkFBUSxFQUFDO1FBQ2RDLGFBQWEsRUFBRUYsVUFBVSxDQUFDRyxnQkFBZ0IsRUFBRTtRQUM1Q0MsUUFBUSxFQUFFSixVQUFVLENBQUNLLFdBQVcsRUFBRTtRQUNsQ0MsdUJBQXVCLEVBQUVOLFVBQVUsQ0FBQ08sMEJBQTBCLEVBQUU7UUFDaEVDLGFBQWEsRUFBRSxNQUFNQyxLQUFLLElBQUlULFVBQVUsQ0FBQ1Usa0JBQWtCLENBQUMsQ0FBQyxNQUFNRCxLQUFLLENBQUNQLGFBQWEsRUFBRVMsT0FBTyxFQUFFLENBQUM7UUFDbEdDLFVBQVUsRUFBRSxNQUFNSCxLQUFLLElBQUlULFVBQVUsQ0FBQ2EsYUFBYSxDQUFDLENBQUMsTUFBTUosS0FBSyxDQUFDUCxhQUFhLEVBQUVTLE9BQU8sRUFBRSxDQUFDO1FBQzFGRyxXQUFXLEVBQUUsTUFBTUwsS0FBSyxJQUFJVCxVQUFVLENBQUNlLGNBQWMsQ0FBQyxDQUFDLE1BQU1OLEtBQUssQ0FBQ1AsYUFBYSxFQUFFUyxPQUFPLEVBQUUsQ0FBQztRQUM1RkssWUFBWSxFQUFFLFlBQVksQ0FBQyxNQUFNaEIsVUFBVSxDQUFDaUIsVUFBVSxFQUFFLEVBQUVDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQ0MsU0FBUztNQUN4RixDQUFDLENBQUM7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