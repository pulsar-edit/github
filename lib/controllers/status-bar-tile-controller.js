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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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