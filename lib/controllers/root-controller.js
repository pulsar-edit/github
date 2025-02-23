"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _path = _interopRequireDefault(require("path"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _yubikiri = _interopRequireDefault(require("yubikiri"));
var _statusBar = _interopRequireDefault(require("../atom/status-bar"));
var _paneItem = _interopRequireDefault(require("../atom/pane-item"));
var _openIssueishDialog = require("../views/open-issueish-dialog");
var _openCommitDialog = require("../views/open-commit-dialog");
var _createDialog = require("../views/create-dialog");
var _observeModel = _interopRequireDefault(require("../views/observe-model"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _changedFileItem = _interopRequireDefault(require("../items/changed-file-item"));
var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));
var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));
var _commitPreviewItem = _interopRequireDefault(require("../items/commit-preview-item"));
var _gitTabItem = _interopRequireDefault(require("../items/git-tab-item"));
var _githubTabItem = _interopRequireDefault(require("../items/github-tab-item"));
var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));
var _commentDecorationsContainer = _interopRequireDefault(require("../containers/comment-decorations-container"));
var _dialogsController = _interopRequireWildcard(require("./dialogs-controller"));
var _statusBarTileController = _interopRequireDefault(require("./status-bar-tile-controller"));
var _repositoryConflictController = _interopRequireDefault(require("./repository-conflict-controller"));
var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));
var _gitCacheView = _interopRequireDefault(require("../views/git-cache-view"));
var _gitTimingsView = _interopRequireDefault(require("../views/git-timings-view"));
var _conflict = _interopRequireDefault(require("../models/conflicts/conflict"));
var _endpoint = require("../models/endpoint");
var _switchboard = _interopRequireDefault(require("../switchboard"));
var _propTypes2 = require("../prop-types");
var _helpers = require("../helpers");
var _gitShellOutStrategy = require("../git-shell-out-strategy");
var _reporterProxy = require("../reporter-proxy");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const remote = require('@electron/remote');
class RootController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "fetchData", repository => (0, _yubikiri.default)({
      isPublishable: repository.isPublishable(),
      remotes: repository.getRemotes()
    }));
    _defineProperty(this, "closeDialog", () => new Promise(resolve => this.setState({
      dialogRequest: _dialogsController.dialogRequests.null
    }, resolve)));
    _defineProperty(this, "openInitializeDialog", async dirPath => {
      if (!dirPath) {
        const activeEditor = this.props.workspace.getActiveTextEditor();
        if (activeEditor) {
          const [projectPath] = this.props.project.relativizePath(activeEditor.getPath());
          if (projectPath) {
            dirPath = projectPath;
          }
        }
      }
      if (!dirPath) {
        const directories = this.props.project.getDirectories();
        const withRepositories = await Promise.all(directories.map(async d => [d, await this.props.project.repositoryForDirectory(d)]));
        const firstUninitialized = withRepositories.find(([d, r]) => !r);
        if (firstUninitialized && firstUninitialized[0]) {
          dirPath = firstUninitialized[0].getPath();
        }
      }
      if (!dirPath) {
        dirPath = this.props.config.get('core.projectHome');
      }
      const dialogRequest = _dialogsController.dialogRequests.init({
        dirPath
      });
      dialogRequest.onProgressingAccept(async chosenPath => {
        await this.props.initialize(chosenPath);
        await this.closeDialog();
      });
      dialogRequest.onCancel(this.closeDialog);
      return new Promise(resolve => this.setState({
        dialogRequest
      }, resolve));
    });
    _defineProperty(this, "openCloneDialog", opts => {
      const dialogRequest = _dialogsController.dialogRequests.clone(opts);
      dialogRequest.onProgressingAccept(async (url, chosenPath) => {
        await this.props.clone(url, chosenPath);
        await this.closeDialog();
      });
      dialogRequest.onCancel(this.closeDialog);
      return new Promise(resolve => this.setState({
        dialogRequest
      }, resolve));
    });
    _defineProperty(this, "openCredentialsDialog", query => {
      return new Promise((resolve, reject) => {
        const dialogRequest = _dialogsController.dialogRequests.credential(query);
        dialogRequest.onProgressingAccept(async result => {
          resolve(result);
          await this.closeDialog();
        });
        dialogRequest.onCancel(async () => {
          reject();
          await this.closeDialog();
        });
        this.setState({
          dialogRequest
        });
      });
    });
    _defineProperty(this, "openIssueishDialog", () => {
      const dialogRequest = _dialogsController.dialogRequests.issueish();
      dialogRequest.onProgressingAccept(async url => {
        await (0, _openIssueishDialog.openIssueishItem)(url, {
          workspace: this.props.workspace,
          workdir: this.props.repository.getWorkingDirectoryPath()
        });
        await this.closeDialog();
      });
      dialogRequest.onCancel(this.closeDialog);
      return new Promise(resolve => this.setState({
        dialogRequest
      }, resolve));
    });
    _defineProperty(this, "openCommitDialog", () => {
      const dialogRequest = _dialogsController.dialogRequests.commit();
      dialogRequest.onProgressingAccept(async ref => {
        await (0, _openCommitDialog.openCommitDetailItem)(ref, {
          workspace: this.props.workspace,
          repository: this.props.repository
        });
        await this.closeDialog();
      });
      dialogRequest.onCancel(this.closeDialog);
      return new Promise(resolve => this.setState({
        dialogRequest
      }, resolve));
    });
    _defineProperty(this, "openCreateDialog", () => {
      const dialogRequest = _dialogsController.dialogRequests.create();
      dialogRequest.onProgressingAccept(async result => {
        const dotcom = (0, _endpoint.getEndpoint)('github.com');
        const relayEnvironment = _relayNetworkLayerManager.default.getEnvironmentForHost(dotcom);
        await (0, _createDialog.createRepository)(result, {
          clone: this.props.clone,
          relayEnvironment
        });
        await this.closeDialog();
      });
      dialogRequest.onCancel(this.closeDialog);
      return new Promise(resolve => this.setState({
        dialogRequest
      }, resolve));
    });
    _defineProperty(this, "openPublishDialog", repository => {
      const dialogRequest = _dialogsController.dialogRequests.publish({
        localDir: repository.getWorkingDirectoryPath()
      });
      dialogRequest.onProgressingAccept(async result => {
        const dotcom = (0, _endpoint.getEndpoint)('github.com');
        const relayEnvironment = _relayNetworkLayerManager.default.getEnvironmentForHost(dotcom);
        await (0, _createDialog.publishRepository)(result, {
          repository,
          relayEnvironment
        });
        await this.closeDialog();
      });
      dialogRequest.onCancel(this.closeDialog);
      return new Promise(resolve => this.setState({
        dialogRequest
      }, resolve));
    });
    _defineProperty(this, "toggleCommitPreviewItem", () => {
      const workdir = this.props.repository.getWorkingDirectoryPath();
      return this.props.workspace.toggle(_commitPreviewItem.default.buildURI(workdir));
    });
    _defineProperty(this, "surfaceFromFileAtPath", (filePath, stagingStatus) => {
      const gitTab = this.gitTabTracker.getComponent();
      return gitTab && gitTab.focusAndSelectStagingItem(filePath, stagingStatus);
    });
    _defineProperty(this, "surfaceToCommitPreviewButton", () => {
      const gitTab = this.gitTabTracker.getComponent();
      return gitTab && gitTab.focusAndSelectCommitPreviewButton();
    });
    _defineProperty(this, "surfaceToRecentCommit", () => {
      const gitTab = this.gitTabTracker.getComponent();
      return gitTab && gitTab.focusAndSelectRecentCommit();
    });
    _defineProperty(this, "reportRelayError", (friendlyMessage, err) => {
      const opts = {
        dismissable: true
      };
      if (err.network) {
        // Offline
        opts.icon = 'alignment-unalign';
        opts.description = "It looks like you're offline right now.";
      } else if (err.responseText) {
        // Transient error like a 500 from the API
        opts.description = 'The GitHub API reported a problem.';
        opts.detail = err.responseText;
      } else if (err.errors) {
        // GraphQL errors
        opts.detail = err.errors.map(e => e.message).join('\n');
      } else {
        opts.detail = err.stack;
      }
      this.props.notificationManager.addError(friendlyMessage, opts);
    });
    (0, _helpers.autobind)(this, 'installReactDevTools', 'clearGithubToken', 'showWaterfallDiagnostics', 'showCacheDiagnostics', 'destroyFilePatchPaneItems', 'destroyEmptyFilePatchPaneItems', 'quietlySelectItem', 'viewUnstagedChangesForCurrentFile', 'viewStagedChangesForCurrentFile', 'openFiles', 'getUnsavedFiles', 'ensureNoUnsavedFiles', 'discardWorkDirChangesForPaths', 'discardLines', 'undoLastDiscard', 'refreshResolutionProgress');
    this.state = {
      dialogRequest: _dialogsController.dialogRequests.null
    };
    this.gitTabTracker = new TabTracker('git', {
      uri: _gitTabItem.default.buildURI(),
      getWorkspace: () => this.props.workspace
    });
    this.githubTabTracker = new TabTracker('github', {
      uri: _githubTabItem.default.buildURI(),
      getWorkspace: () => this.props.workspace
    });
    this.subscription = new _eventKit.CompositeDisposable(this.props.repository.onPullError(this.gitTabTracker.ensureVisible));
    this.props.commands.onDidDispatch(event => {
      if (event.type && event.type.startsWith('github:') && event.detail && event.detail[0] && event.detail[0].contextCommand) {
        (0, _reporterProxy.addEvent)('context-menu-action', {
          package: 'github',
          command: event.type
        });
      }
    });
  }
  componentDidMount() {
    this.openTabs();
  }
  render() {
    return _react.default.createElement(_react.Fragment, null, this.renderCommands(), this.renderStatusBarTile(), this.renderPaneItems(), this.renderDialogs(), this.renderConflictResolver(), this.renderCommentDecorations());
  }
  renderCommands() {
    const devMode = global.atom && global.atom.inDevMode();
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, devMode && _react.default.createElement(_commands.Command, {
      command: "github:install-react-dev-tools",
      callback: this.installReactDevTools
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-commit-preview",
      callback: this.toggleCommitPreviewItem
    }), _react.default.createElement(_commands.Command, {
      command: "github:logout",
      callback: this.clearGithubToken
    }), _react.default.createElement(_commands.Command, {
      command: "github:show-waterfall-diagnostics",
      callback: this.showWaterfallDiagnostics
    }), _react.default.createElement(_commands.Command, {
      command: "github:show-cache-diagnostics",
      callback: this.showCacheDiagnostics
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-git-tab",
      callback: this.gitTabTracker.toggle
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-git-tab-focus",
      callback: this.gitTabTracker.toggleFocus
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-github-tab",
      callback: this.githubTabTracker.toggle
    }), _react.default.createElement(_commands.Command, {
      command: "github:toggle-github-tab-focus",
      callback: this.githubTabTracker.toggleFocus
    }), _react.default.createElement(_commands.Command, {
      command: "github:initialize",
      callback: () => this.openInitializeDialog()
    }), _react.default.createElement(_commands.Command, {
      command: "github:clone",
      callback: () => this.openCloneDialog()
    }), _react.default.createElement(_commands.Command, {
      command: "github:open-issue-or-pull-request",
      callback: () => this.openIssueishDialog()
    }), _react.default.createElement(_commands.Command, {
      command: "github:open-commit",
      callback: () => this.openCommitDialog()
    }), _react.default.createElement(_commands.Command, {
      command: "github:create-repository",
      callback: () => this.openCreateDialog()
    }), _react.default.createElement(_commands.Command, {
      command: "github:view-unstaged-changes-for-current-file",
      callback: this.viewUnstagedChangesForCurrentFile
    }), _react.default.createElement(_commands.Command, {
      command: "github:view-staged-changes-for-current-file",
      callback: this.viewStagedChangesForCurrentFile
    }), _react.default.createElement(_commands.Command, {
      command: "github:close-all-diff-views",
      callback: this.destroyFilePatchPaneItems
    }), _react.default.createElement(_commands.Command, {
      command: "github:close-empty-diff-views",
      callback: this.destroyEmptyFilePatchPaneItems
    })), _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, data => {
      if (!data || !data.isPublishable || !data.remotes.filter(r => r.isGithubRepo()).isEmpty()) {
        return null;
      }
      return _react.default.createElement(_commands.default, {
        registry: this.props.commands,
        target: "atom-workspace"
      }, _react.default.createElement(_commands.Command, {
        command: "github:publish-repository",
        callback: () => this.openPublishDialog(this.props.repository)
      }));
    }));
  }
  renderStatusBarTile() {
    return _react.default.createElement(_statusBar.default, {
      statusBar: this.props.statusBar,
      onConsumeStatusBar: sb => this.onConsumeStatusBar(sb),
      className: "github-StatusBarTileController"
    }, _react.default.createElement(_statusBarTileController.default, {
      pipelineManager: this.props.pipelineManager,
      workspace: this.props.workspace,
      repository: this.props.repository,
      commands: this.props.commands,
      notificationManager: this.props.notificationManager,
      tooltips: this.props.tooltips,
      confirm: this.props.confirm,
      toggleGitTab: this.gitTabTracker.toggle,
      toggleGithubTab: this.githubTabTracker.toggle
    }));
  }
  renderDialogs() {
    return _react.default.createElement(_dialogsController.default, {
      loginModel: this.props.loginModel,
      request: this.state.dialogRequest,
      currentWindow: this.props.currentWindow,
      workspace: this.props.workspace,
      commands: this.props.commands,
      config: this.props.config
    });
  }
  renderCommentDecorations() {
    if (!this.props.repository) {
      return null;
    }
    return _react.default.createElement(_commentDecorationsContainer.default, {
      workspace: this.props.workspace,
      commands: this.props.commands,
      localRepository: this.props.repository,
      loginModel: this.props.loginModel,
      reportRelayError: this.reportRelayError
    });
  }
  renderConflictResolver() {
    if (!this.props.repository) {
      return null;
    }
    return _react.default.createElement(_repositoryConflictController.default, {
      workspace: this.props.workspace,
      config: this.props.config,
      repository: this.props.repository,
      resolutionProgress: this.props.resolutionProgress,
      refreshResolutionProgress: this.refreshResolutionProgress,
      commands: this.props.commands
    });
  }
  renderPaneItems() {
    const {
      workdirContextPool
    } = this.props;
    const getCurrentWorkDirs = workdirContextPool.getCurrentWorkDirs.bind(workdirContextPool);
    const onDidChangeWorkDirs = workdirContextPool.onDidChangePoolContexts.bind(workdirContextPool);
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _gitTabItem.default.uriPattern,
      className: "github-Git-root"
    }, ({
      itemHolder
    }) => _react.default.createElement(_gitTabItem.default, {
      ref: itemHolder.setter,
      workspace: this.props.workspace,
      commands: this.props.commands,
      notificationManager: this.props.notificationManager,
      tooltips: this.props.tooltips,
      grammars: this.props.grammars,
      project: this.props.project,
      confirm: this.props.confirm,
      config: this.props.config,
      repository: this.props.repository,
      loginModel: this.props.loginModel,
      openInitializeDialog: this.openInitializeDialog,
      resolutionProgress: this.props.resolutionProgress,
      ensureGitTab: this.gitTabTracker.ensureVisible,
      openFiles: this.openFiles,
      discardWorkDirChangesForPaths: this.discardWorkDirChangesForPaths,
      undoLastDiscard: this.undoLastDiscard,
      refreshResolutionProgress: this.refreshResolutionProgress,
      currentWorkDir: this.props.currentWorkDir,
      getCurrentWorkDirs: getCurrentWorkDirs,
      onDidChangeWorkDirs: onDidChangeWorkDirs,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _githubTabItem.default.uriPattern,
      className: "github-GitHub-root"
    }, ({
      itemHolder
    }) => _react.default.createElement(_githubTabItem.default, {
      ref: itemHolder.setter,
      repository: this.props.repository,
      loginModel: this.props.loginModel,
      workspace: this.props.workspace,
      currentWorkDir: this.props.currentWorkDir,
      getCurrentWorkDirs: getCurrentWorkDirs,
      onDidChangeWorkDirs: onDidChangeWorkDirs,
      contextLocked: this.props.contextLocked,
      changeWorkingDirectory: this.props.changeWorkingDirectory,
      setContextLock: this.props.setContextLock,
      openCreateDialog: this.openCreateDialog,
      openPublishDialog: this.openPublishDialog,
      openCloneDialog: this.openCloneDialog,
      openGitTab: this.gitTabTracker.toggleFocus
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _changedFileItem.default.uriPattern
    }, ({
      itemHolder,
      params
    }) => _react.default.createElement(_changedFileItem.default, {
      ref: itemHolder.setter,
      workdirContextPool: this.props.workdirContextPool,
      relPath: _path.default.join(...params.relPath),
      workingDirectory: params.workingDirectory,
      stagingStatus: params.stagingStatus,
      tooltips: this.props.tooltips,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      workspace: this.props.workspace,
      config: this.props.config,
      discardLines: this.discardLines,
      undoLastDiscard: this.undoLastDiscard,
      surfaceFileAtPath: this.surfaceFromFileAtPath
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _commitPreviewItem.default.uriPattern,
      className: "github-CommitPreview-root"
    }, ({
      itemHolder,
      params
    }) => _react.default.createElement(_commitPreviewItem.default, {
      ref: itemHolder.setter,
      workdirContextPool: this.props.workdirContextPool,
      workingDirectory: params.workingDirectory,
      workspace: this.props.workspace,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      tooltips: this.props.tooltips,
      config: this.props.config,
      discardLines: this.discardLines,
      undoLastDiscard: this.undoLastDiscard,
      surfaceToCommitPreviewButton: this.surfaceToCommitPreviewButton
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _commitDetailItem.default.uriPattern,
      className: "github-CommitDetail-root"
    }, ({
      itemHolder,
      params
    }) => _react.default.createElement(_commitDetailItem.default, {
      ref: itemHolder.setter,
      workdirContextPool: this.props.workdirContextPool,
      workingDirectory: params.workingDirectory,
      workspace: this.props.workspace,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      tooltips: this.props.tooltips,
      config: this.props.config,
      sha: params.sha,
      surfaceCommit: this.surfaceToRecentCommit
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _issueishDetailItem.default.uriPattern
    }, ({
      itemHolder,
      params,
      deserialized
    }) => _react.default.createElement(_issueishDetailItem.default, {
      ref: itemHolder.setter,
      host: params.host,
      owner: params.owner,
      repo: params.repo,
      issueishNumber: parseInt(params.issueishNumber, 10),
      workingDirectory: params.workingDirectory,
      workdirContextPool: this.props.workdirContextPool,
      loginModel: this.props.loginModel,
      initSelectedTab: deserialized.initSelectedTab,
      workspace: this.props.workspace,
      commands: this.props.commands,
      keymaps: this.props.keymaps,
      tooltips: this.props.tooltips,
      config: this.props.config,
      reportRelayError: this.reportRelayError
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _reviewsItem.default.uriPattern
    }, ({
      itemHolder,
      params
    }) => _react.default.createElement(_reviewsItem.default, {
      ref: itemHolder.setter,
      host: params.host,
      owner: params.owner,
      repo: params.repo,
      number: parseInt(params.number, 10),
      workdir: params.workdir,
      workdirContextPool: this.props.workdirContextPool,
      loginModel: this.props.loginModel,
      workspace: this.props.workspace,
      tooltips: this.props.tooltips,
      config: this.props.config,
      commands: this.props.commands,
      confirm: this.props.confirm,
      reportRelayError: this.reportRelayError
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _gitTimingsView.default.uriPattern
    }, ({
      itemHolder
    }) => _react.default.createElement(_gitTimingsView.default, {
      ref: itemHolder.setter
    })), _react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _gitCacheView.default.uriPattern
    }, ({
      itemHolder
    }) => _react.default.createElement(_gitCacheView.default, {
      ref: itemHolder.setter,
      repository: this.props.repository
    })));
  }
  async openTabs() {
    if (this.props.startOpen) {
      await Promise.all([this.gitTabTracker.ensureRendered(false), this.githubTabTracker.ensureRendered(false)]);
    }
    if (this.props.startRevealed) {
      const docks = new Set([_gitTabItem.default.buildURI(), _githubTabItem.default.buildURI()].map(uri => this.props.workspace.paneContainerForURI(uri)).filter(container => container && typeof container.show === 'function'));
      for (const dock of docks) {
        dock.show();
      }
    }
  }
  async installReactDevTools() {
    // Prevent electron-link from attempting to descend into electron-devtools-installer, which is not available
    // when we're bundled in Atom.
    const devToolsName = 'electron-devtools-installer';
    const devTools = require(devToolsName);
    await Promise.all([this.installExtension(devTools.REACT_DEVELOPER_TOOLS.id),
    // relay developer tools extension id
    this.installExtension('ncedobpgnmkhcmnnkcimnobpfepidadl')]);
    this.props.notificationManager.addSuccess('🌈 Reload your window to start using the React/Relay dev tools!');
  }
  async installExtension(id) {
    const devToolsName = 'electron-devtools-installer';
    const devTools = require(devToolsName);
    const crossUnzipName = 'cross-unzip';
    const unzip = require(crossUnzipName);
    const url = 'https://clients2.google.com/service/update2/crx?' + `response=redirect&x=id%3D${id}%26uc&prodversion=32`;
    const extensionFolder = _path.default.resolve(remote.app.getPath('userData'), `extensions/${id}`);
    const extensionFile = `${extensionFolder}.crx`;
    await _fsExtra.default.ensureDir(_path.default.dirname(extensionFile));
    const response = await fetch(url, {
      method: 'GET'
    });
    const body = Buffer.from(await response.arrayBuffer());
    await _fsExtra.default.writeFile(extensionFile, body);
    await new Promise((resolve, reject) => {
      unzip(extensionFile, extensionFolder, async err => {
        if (err && !(await _fsExtra.default.exists(_path.default.join(extensionFolder, 'manifest.json')))) {
          reject(err);
        }
        resolve();
      });
    });
    await _fsExtra.default.ensureDir(extensionFolder, 0o755);
    await devTools.default(id);
  }
  componentWillUnmount() {
    this.subscription.dispose();
  }
  componentDidUpdate() {
    this.subscription.dispose();
    this.subscription = new _eventKit.CompositeDisposable(this.props.repository.onPullError(() => this.gitTabTracker.ensureVisible()));
  }
  onConsumeStatusBar(statusBar) {
    if (statusBar.disableGitInfoTile) {
      statusBar.disableGitInfoTile();
    }
  }
  clearGithubToken() {
    return this.props.loginModel.removeToken('https://api.github.com');
  }
  showWaterfallDiagnostics() {
    this.props.workspace.open(_gitTimingsView.default.buildURI());
  }
  showCacheDiagnostics() {
    this.props.workspace.open(_gitCacheView.default.buildURI());
  }
  destroyFilePatchPaneItems() {
    (0, _helpers.destroyFilePatchPaneItems)({
      onlyStaged: false
    }, this.props.workspace);
  }
  destroyEmptyFilePatchPaneItems() {
    (0, _helpers.destroyEmptyFilePatchPaneItems)(this.props.workspace);
  }
  quietlySelectItem(filePath, stagingStatus) {
    const gitTab = this.gitTabTracker.getComponent();
    return gitTab && gitTab.quietlySelectItem(filePath, stagingStatus);
  }
  async viewChangesForCurrentFile(stagingStatus) {
    const editor = this.props.workspace.getActiveTextEditor();
    if (!editor.getPath()) {
      return;
    }
    const absFilePath = await _fsExtra.default.realpath(editor.getPath());
    const repoPath = this.props.repository.getWorkingDirectoryPath();
    if (repoPath === null) {
      const [projectPath] = this.props.project.relativizePath(editor.getPath());
      const notification = this.props.notificationManager.addInfo("Hmm, there's nothing to compare this file to", {
        description: 'You can create a Git repository to track changes to the files in your project.',
        dismissable: true,
        buttons: [{
          className: 'btn btn-primary',
          text: 'Create a repository now',
          onDidClick: async () => {
            notification.dismiss();
            const createdPath = await this.initializeRepo(projectPath);
            // If the user confirmed repository creation for this project path,
            // retry the operation that got them here in the first place
            if (createdPath === projectPath) {
              this.viewChangesForCurrentFile(stagingStatus);
            }
          }
        }]
      });
      return;
    }
    if (absFilePath.startsWith(repoPath)) {
      const filePath = absFilePath.slice(repoPath.length + 1);
      this.quietlySelectItem(filePath, stagingStatus);
      const splitDirection = this.props.config.get('github.viewChangesForCurrentFileDiffPaneSplitDirection');
      const pane = this.props.workspace.getActivePane();
      if (splitDirection === 'right') {
        pane.splitRight();
      } else if (splitDirection === 'down') {
        pane.splitDown();
      }
      const lineNum = editor.getCursorBufferPosition().row + 1;
      const item = await this.props.workspace.open(_changedFileItem.default.buildURI(filePath, repoPath, stagingStatus), {
        pending: true,
        activatePane: true,
        activateItem: true
      });
      await item.getRealItemPromise();
      await item.getFilePatchLoadedPromise();
      item.goToDiffLine(lineNum);
      item.focus();
    } else {
      throw new Error(`${absFilePath} does not belong to repo ${repoPath}`);
    }
  }
  viewUnstagedChangesForCurrentFile() {
    return this.viewChangesForCurrentFile('unstaged');
  }
  viewStagedChangesForCurrentFile() {
    return this.viewChangesForCurrentFile('staged');
  }
  openFiles(filePaths, repository = this.props.repository) {
    return Promise.all(filePaths.map(filePath => {
      const absolutePath = _path.default.join(repository.getWorkingDirectoryPath(), filePath);
      return this.props.workspace.open(absolutePath, {
        pending: filePaths.length === 1
      });
    }));
  }
  getUnsavedFiles(filePaths, workdirPath) {
    const isModifiedByPath = new Map();
    this.props.workspace.getTextEditors().forEach(editor => {
      isModifiedByPath.set(editor.getPath(), editor.isModified());
    });
    return filePaths.filter(filePath => {
      const absFilePath = _path.default.join(workdirPath, filePath);
      return isModifiedByPath.get(absFilePath);
    });
  }
  ensureNoUnsavedFiles(filePaths, message, workdirPath = this.props.repository.getWorkingDirectoryPath()) {
    const unsavedFiles = this.getUnsavedFiles(filePaths, workdirPath).map(filePath => `\`${filePath}\``).join('<br>');
    if (unsavedFiles.length) {
      this.props.notificationManager.addError(message, {
        description: `You have unsaved changes in:<br>${unsavedFiles}.`,
        dismissable: true
      });
      return false;
    } else {
      return true;
    }
  }
  async discardWorkDirChangesForPaths(filePaths) {
    const destructiveAction = () => {
      return this.props.repository.discardWorkDirChangesForPaths(filePaths);
    };
    return await this.props.repository.storeBeforeAndAfterBlobs(filePaths, () => this.ensureNoUnsavedFiles(filePaths, 'Cannot discard changes in selected files.'), destructiveAction);
  }
  async discardLines(multiFilePatch, lines, repository = this.props.repository) {
    // (kuychaco) For now we only support discarding rows for MultiFilePatches that contain a single file patch
    // The only way to access this method from the UI is to be in a ChangedFileItem, which only has a single file patch
    if (multiFilePatch.getFilePatches().length !== 1) {
      return Promise.resolve(null);
    }
    const filePath = multiFilePatch.getFilePatches()[0].getPath();
    const destructiveAction = async () => {
      const discardFilePatch = multiFilePatch.getUnstagePatchForLines(lines);
      await repository.applyPatchToWorkdir(discardFilePatch);
    };
    return await repository.storeBeforeAndAfterBlobs([filePath], () => this.ensureNoUnsavedFiles([filePath], 'Cannot discard lines.', repository.getWorkingDirectoryPath()), destructiveAction, filePath);
  }
  getFilePathsForLastDiscard(partialDiscardFilePath = null) {
    let lastSnapshots = this.props.repository.getLastHistorySnapshots(partialDiscardFilePath);
    if (partialDiscardFilePath) {
      lastSnapshots = lastSnapshots ? [lastSnapshots] : [];
    }
    return lastSnapshots.map(snapshot => snapshot.filePath);
  }
  async undoLastDiscard(partialDiscardFilePath = null, repository = this.props.repository) {
    const filePaths = this.getFilePathsForLastDiscard(partialDiscardFilePath);
    try {
      const results = await repository.restoreLastDiscardInTempFiles(() => this.ensureNoUnsavedFiles(filePaths, 'Cannot undo last discard.'), partialDiscardFilePath);
      if (results.length === 0) {
        return;
      }
      await this.proceedOrPromptBasedOnResults(results, partialDiscardFilePath);
    } catch (e) {
      if (e instanceof _gitShellOutStrategy.GitError && e.stdErr.match(/fatal: Not a valid object name/)) {
        this.cleanUpHistoryForFilePaths(filePaths, partialDiscardFilePath);
      } else {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }
  async proceedOrPromptBasedOnResults(results, partialDiscardFilePath = null) {
    const conflicts = results.filter(({
      conflict
    }) => conflict);
    if (conflicts.length === 0) {
      await this.proceedWithLastDiscardUndo(results, partialDiscardFilePath);
    } else {
      await this.promptAboutConflicts(results, conflicts, partialDiscardFilePath);
    }
  }
  async promptAboutConflicts(results, conflicts, partialDiscardFilePath = null) {
    const conflictedFiles = conflicts.map(({
      filePath
    }) => `\t${filePath}`).join('\n');
    const choice = this.props.confirm({
      message: 'Undoing will result in conflicts...',
      detailedMessage: `for the following files:\n${conflictedFiles}\n` + 'Would you like to apply the changes with merge conflict markers, ' + 'or open the text with merge conflict markers in a new file?',
      buttons: ['Merge with conflict markers', 'Open in new file', 'Cancel']
    });
    if (choice === 0) {
      await this.proceedWithLastDiscardUndo(results, partialDiscardFilePath);
    } else if (choice === 1) {
      await this.openConflictsInNewEditors(conflicts.map(({
        resultPath
      }) => resultPath));
    }
  }
  cleanUpHistoryForFilePaths(filePaths, partialDiscardFilePath = null) {
    this.props.repository.clearDiscardHistory(partialDiscardFilePath);
    const filePathsStr = filePaths.map(filePath => `\`${filePath}\``).join('<br>');
    this.props.notificationManager.addError('Discard history has expired.', {
      description: `Cannot undo discard for<br>${filePathsStr}<br>Stale discard history has been deleted.`,
      dismissable: true
    });
  }
  async proceedWithLastDiscardUndo(results, partialDiscardFilePath = null) {
    const promises = results.map(async result => {
      const {
        filePath,
        resultPath,
        deleted,
        conflict,
        theirsSha,
        commonBaseSha,
        currentSha
      } = result;
      const absFilePath = _path.default.join(this.props.repository.getWorkingDirectoryPath(), filePath);
      if (deleted && resultPath === null) {
        await _fsExtra.default.remove(absFilePath);
      } else {
        await _fsExtra.default.copy(resultPath, absFilePath);
      }
      if (conflict) {
        await this.props.repository.writeMergeConflictToIndex(filePath, commonBaseSha, currentSha, theirsSha);
      }
    });
    await Promise.all(promises);
    await this.props.repository.popDiscardHistory(partialDiscardFilePath);
  }
  async openConflictsInNewEditors(resultPaths) {
    const editorPromises = resultPaths.map(resultPath => {
      return this.props.workspace.open(resultPath);
    });
    return await Promise.all(editorPromises);
  }
  /*
   * Asynchronously count the conflict markers present in a file specified by full path.
   */
  refreshResolutionProgress(fullPath) {
    const readStream = _fsExtra.default.createReadStream(fullPath, {
      encoding: 'utf8'
    });
    return new Promise(resolve => {
      _conflict.default.countFromStream(readStream).then(count => {
        this.props.resolutionProgress.reportMarkerCount(fullPath, count);
      });
    });
  }
}
exports.default = RootController;
_defineProperty(RootController, "propTypes", {
  // Atom enviornment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  deserializers: _propTypes.default.object.isRequired,
  notificationManager: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  grammars: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  project: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  currentWindow: _propTypes.default.object.isRequired,
  // Models
  loginModel: _propTypes.default.object.isRequired,
  workdirContextPool: _propTypes2.WorkdirContextPoolPropType.isRequired,
  repository: _propTypes.default.object.isRequired,
  resolutionProgress: _propTypes.default.object.isRequired,
  statusBar: _propTypes.default.object,
  switchboard: _propTypes.default.instanceOf(_switchboard.default),
  pipelineManager: _propTypes.default.object,
  currentWorkDir: _propTypes.default.string,
  // Git actions
  initialize: _propTypes.default.func.isRequired,
  clone: _propTypes.default.func.isRequired,
  // Control
  contextLocked: _propTypes.default.bool.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  startOpen: _propTypes.default.bool,
  startRevealed: _propTypes.default.bool
});
_defineProperty(RootController, "defaultProps", {
  switchboard: new _switchboard.default(),
  startOpen: false,
  startRevealed: false
});
class TabTracker {
  constructor(name, {
    getWorkspace,
    uri
  }) {
    (0, _helpers.autobind)(this, 'toggle', 'toggleFocus', 'ensureVisible');
    this.name = name;
    this.getWorkspace = getWorkspace;
    this.uri = uri;
  }
  async toggle() {
    const focusToRestore = document.activeElement;
    let shouldRestoreFocus = false;

    // Rendered => the dock item is being rendered, whether or not the dock is visible or the item
    //   is visible within its dock.
    // Visible => the item is active and the dock item is active within its dock.
    const wasRendered = this.isRendered();
    const wasVisible = this.isVisible();
    if (!wasRendered || !wasVisible) {
      // Not rendered, or rendered but not an active item in a visible dock.
      await this.reveal();
      shouldRestoreFocus = true;
    } else {
      // Rendered and an active item within a visible dock.
      await this.hide();
      shouldRestoreFocus = false;
    }
    if (shouldRestoreFocus) {
      process.nextTick(() => focusToRestore.focus());
    }
  }
  async toggleFocus() {
    const hadFocus = this.hasFocus();
    await this.ensureVisible();
    if (hadFocus) {
      let workspace = this.getWorkspace();
      if (workspace.getCenter) {
        workspace = workspace.getCenter();
      }
      workspace.getActivePane().activate();
    } else {
      this.focus();
    }
  }
  async ensureVisible() {
    if (!this.isVisible()) {
      await this.reveal();
      return true;
    }
    return false;
  }
  ensureRendered() {
    return this.getWorkspace().open(this.uri, {
      searchAllPanes: true,
      activateItem: false,
      activatePane: false
    });
  }
  reveal() {
    (0, _reporterProxy.incrementCounter)(`${this.name}-tab-open`);
    return this.getWorkspace().open(this.uri, {
      searchAllPanes: true,
      activateItem: true,
      activatePane: true
    });
  }
  hide() {
    (0, _reporterProxy.incrementCounter)(`${this.name}-tab-close`);
    return this.getWorkspace().hide(this.uri);
  }
  focus() {
    this.getComponent().restoreFocus();
  }
  getItem() {
    const pane = this.getWorkspace().paneForURI(this.uri);
    if (!pane) {
      return null;
    }
    const paneItem = pane.itemForURI(this.uri);
    if (!paneItem) {
      return null;
    }
    return paneItem;
  }
  getComponent() {
    const paneItem = this.getItem();
    if (!paneItem) {
      return null;
    }
    if (typeof paneItem.getRealItem !== 'function') {
      return null;
    }
    return paneItem.getRealItem();
  }
  getDOMElement() {
    const paneItem = this.getItem();
    if (!paneItem) {
      return null;
    }
    if (typeof paneItem.getElement !== 'function') {
      return null;
    }
    return paneItem.getElement();
  }
  isRendered() {
    return !!this.getWorkspace().paneForURI(this.uri);
  }
  isVisible() {
    const workspace = this.getWorkspace();
    return workspace.getPaneContainers().filter(container => container === workspace.getCenter() || container.isVisible()).some(container => container.getPanes().some(pane => {
      const item = pane.getActiveItem();
      return item && item.getURI && item.getURI() === this.uri;
    }));
  }
  hasFocus() {
    const root = this.getDOMElement();
    return root && root.contains(document.activeElement);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnNFeHRyYSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3BhdGgiLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wcm9wVHlwZXMiLCJfZXZlbnRLaXQiLCJfeXViaWtpcmkiLCJfc3RhdHVzQmFyIiwiX3BhbmVJdGVtIiwiX29wZW5Jc3N1ZWlzaERpYWxvZyIsIl9vcGVuQ29tbWl0RGlhbG9nIiwiX2NyZWF0ZURpYWxvZyIsIl9vYnNlcnZlTW9kZWwiLCJfY29tbWFuZHMiLCJfY2hhbmdlZEZpbGVJdGVtIiwiX2lzc3VlaXNoRGV0YWlsSXRlbSIsIl9jb21taXREZXRhaWxJdGVtIiwiX2NvbW1pdFByZXZpZXdJdGVtIiwiX2dpdFRhYkl0ZW0iLCJfZ2l0aHViVGFiSXRlbSIsIl9yZXZpZXdzSXRlbSIsIl9jb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIiLCJfZGlhbG9nc0NvbnRyb2xsZXIiLCJfc3RhdHVzQmFyVGlsZUNvbnRyb2xsZXIiLCJfcmVwb3NpdG9yeUNvbmZsaWN0Q29udHJvbGxlciIsIl9yZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJfZ2l0Q2FjaGVWaWV3IiwiX2dpdFRpbWluZ3NWaWV3IiwiX2NvbmZsaWN0IiwiX2VuZHBvaW50IiwiX3N3aXRjaGJvYXJkIiwiX3Byb3BUeXBlczIiLCJfaGVscGVycyIsIl9naXRTaGVsbE91dFN0cmF0ZWd5IiwiX3JlcG9ydGVyUHJveHkiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJuIiwiX19wcm90b19fIiwiYSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImkiLCJzZXQiLCJfZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsInZhbHVlIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJyZW1vdGUiLCJSb290Q29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJyZXBvc2l0b3J5IiwieXViaWtpcmkiLCJpc1B1Ymxpc2hhYmxlIiwicmVtb3RlcyIsImdldFJlbW90ZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFN0YXRlIiwiZGlhbG9nUmVxdWVzdCIsImRpYWxvZ1JlcXVlc3RzIiwibnVsbCIsImRpclBhdGgiLCJhY3RpdmVFZGl0b3IiLCJ3b3Jrc3BhY2UiLCJnZXRBY3RpdmVUZXh0RWRpdG9yIiwicHJvamVjdFBhdGgiLCJwcm9qZWN0IiwicmVsYXRpdml6ZVBhdGgiLCJnZXRQYXRoIiwiZGlyZWN0b3JpZXMiLCJnZXREaXJlY3RvcmllcyIsIndpdGhSZXBvc2l0b3JpZXMiLCJhbGwiLCJtYXAiLCJkIiwicmVwb3NpdG9yeUZvckRpcmVjdG9yeSIsImZpcnN0VW5pbml0aWFsaXplZCIsImZpbmQiLCJjb25maWciLCJpbml0Iiwib25Qcm9ncmVzc2luZ0FjY2VwdCIsImNob3NlblBhdGgiLCJpbml0aWFsaXplIiwiY2xvc2VEaWFsb2ciLCJvbkNhbmNlbCIsIm9wdHMiLCJjbG9uZSIsInVybCIsInF1ZXJ5IiwicmVqZWN0IiwiY3JlZGVudGlhbCIsInJlc3VsdCIsImlzc3VlaXNoIiwib3Blbklzc3VlaXNoSXRlbSIsIndvcmtkaXIiLCJnZXRXb3JraW5nRGlyZWN0b3J5UGF0aCIsImNvbW1pdCIsInJlZiIsIm9wZW5Db21taXREZXRhaWxJdGVtIiwiY3JlYXRlIiwiZG90Y29tIiwiZ2V0RW5kcG9pbnQiLCJyZWxheUVudmlyb25tZW50IiwiUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIiwiZ2V0RW52aXJvbm1lbnRGb3JIb3N0IiwiY3JlYXRlUmVwb3NpdG9yeSIsInB1Ymxpc2giLCJsb2NhbERpciIsInB1Ymxpc2hSZXBvc2l0b3J5IiwidG9nZ2xlIiwiQ29tbWl0UHJldmlld0l0ZW0iLCJidWlsZFVSSSIsImZpbGVQYXRoIiwic3RhZ2luZ1N0YXR1cyIsImdpdFRhYiIsImdpdFRhYlRyYWNrZXIiLCJnZXRDb21wb25lbnQiLCJmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwiZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQiLCJmcmllbmRseU1lc3NhZ2UiLCJlcnIiLCJkaXNtaXNzYWJsZSIsIm5ldHdvcmsiLCJpY29uIiwiZGVzY3JpcHRpb24iLCJyZXNwb25zZVRleHQiLCJkZXRhaWwiLCJlcnJvcnMiLCJtZXNzYWdlIiwiam9pbiIsInN0YWNrIiwibm90aWZpY2F0aW9uTWFuYWdlciIsImFkZEVycm9yIiwiYXV0b2JpbmQiLCJzdGF0ZSIsIlRhYlRyYWNrZXIiLCJ1cmkiLCJHaXRUYWJJdGVtIiwiZ2V0V29ya3NwYWNlIiwiZ2l0aHViVGFiVHJhY2tlciIsIkdpdEh1YlRhYkl0ZW0iLCJzdWJzY3JpcHRpb24iLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib25QdWxsRXJyb3IiLCJlbnN1cmVWaXNpYmxlIiwiY29tbWFuZHMiLCJvbkRpZERpc3BhdGNoIiwiZXZlbnQiLCJ0eXBlIiwic3RhcnRzV2l0aCIsImNvbnRleHRDb21tYW5kIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tbWFuZCIsImNvbXBvbmVudERpZE1vdW50Iiwib3BlblRhYnMiLCJyZW5kZXIiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJyZW5kZXJDb21tYW5kcyIsInJlbmRlclN0YXR1c0JhclRpbGUiLCJyZW5kZXJQYW5lSXRlbXMiLCJyZW5kZXJEaWFsb2dzIiwicmVuZGVyQ29uZmxpY3RSZXNvbHZlciIsInJlbmRlckNvbW1lbnREZWNvcmF0aW9ucyIsImRldk1vZGUiLCJnbG9iYWwiLCJhdG9tIiwiaW5EZXZNb2RlIiwicmVnaXN0cnkiLCJ0YXJnZXQiLCJDb21tYW5kIiwiY2FsbGJhY2siLCJpbnN0YWxsUmVhY3REZXZUb29scyIsInRvZ2dsZUNvbW1pdFByZXZpZXdJdGVtIiwiY2xlYXJHaXRodWJUb2tlbiIsInNob3dXYXRlcmZhbGxEaWFnbm9zdGljcyIsInNob3dDYWNoZURpYWdub3N0aWNzIiwidG9nZ2xlRm9jdXMiLCJvcGVuSW5pdGlhbGl6ZURpYWxvZyIsIm9wZW5DbG9uZURpYWxvZyIsIm9wZW5Jc3N1ZWlzaERpYWxvZyIsIm9wZW5Db21taXREaWFsb2ciLCJvcGVuQ3JlYXRlRGlhbG9nIiwidmlld1Vuc3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwidmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSIsImRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMiLCJkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMiLCJtb2RlbCIsImZldGNoRGF0YSIsImRhdGEiLCJmaWx0ZXIiLCJpc0dpdGh1YlJlcG8iLCJpc0VtcHR5Iiwib3BlblB1Ymxpc2hEaWFsb2ciLCJzdGF0dXNCYXIiLCJvbkNvbnN1bWVTdGF0dXNCYXIiLCJzYiIsImNsYXNzTmFtZSIsInBpcGVsaW5lTWFuYWdlciIsInRvb2x0aXBzIiwiY29uZmlybSIsInRvZ2dsZUdpdFRhYiIsInRvZ2dsZUdpdGh1YlRhYiIsImxvZ2luTW9kZWwiLCJyZXF1ZXN0IiwiY3VycmVudFdpbmRvdyIsImxvY2FsUmVwb3NpdG9yeSIsInJlcG9ydFJlbGF5RXJyb3IiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzIiwid29ya2RpckNvbnRleHRQb29sIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiYmluZCIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJvbkRpZENoYW5nZVBvb2xDb250ZXh0cyIsInVyaVBhdHRlcm4iLCJpdGVtSG9sZGVyIiwic2V0dGVyIiwiZ3JhbW1hcnMiLCJlbnN1cmVHaXRUYWIiLCJvcGVuRmlsZXMiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsInVuZG9MYXN0RGlzY2FyZCIsImN1cnJlbnRXb3JrRGlyIiwiY29udGV4dExvY2tlZCIsImNoYW5nZVdvcmtpbmdEaXJlY3RvcnkiLCJzZXRDb250ZXh0TG9jayIsIm9wZW5HaXRUYWIiLCJDaGFuZ2VkRmlsZUl0ZW0iLCJwYXJhbXMiLCJyZWxQYXRoIiwicGF0aCIsIndvcmtpbmdEaXJlY3RvcnkiLCJrZXltYXBzIiwiZGlzY2FyZExpbmVzIiwic3VyZmFjZUZpbGVBdFBhdGgiLCJzdXJmYWNlRnJvbUZpbGVBdFBhdGgiLCJzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uIiwiQ29tbWl0RGV0YWlsSXRlbSIsInNoYSIsInN1cmZhY2VDb21taXQiLCJzdXJmYWNlVG9SZWNlbnRDb21taXQiLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJkZXNlcmlhbGl6ZWQiLCJob3N0Iiwib3duZXIiLCJyZXBvIiwiaXNzdWVpc2hOdW1iZXIiLCJwYXJzZUludCIsImluaXRTZWxlY3RlZFRhYiIsIlJldmlld3NJdGVtIiwibnVtYmVyIiwiR2l0VGltaW5nc1ZpZXciLCJHaXRDYWNoZVZpZXciLCJzdGFydE9wZW4iLCJlbnN1cmVSZW5kZXJlZCIsInN0YXJ0UmV2ZWFsZWQiLCJkb2NrcyIsIlNldCIsInBhbmVDb250YWluZXJGb3JVUkkiLCJjb250YWluZXIiLCJzaG93IiwiZG9jayIsImRldlRvb2xzTmFtZSIsImRldlRvb2xzIiwiaW5zdGFsbEV4dGVuc2lvbiIsIlJFQUNUX0RFVkVMT1BFUl9UT09MUyIsImlkIiwiYWRkU3VjY2VzcyIsImNyb3NzVW56aXBOYW1lIiwidW56aXAiLCJleHRlbnNpb25Gb2xkZXIiLCJhcHAiLCJleHRlbnNpb25GaWxlIiwiZnMiLCJlbnN1cmVEaXIiLCJkaXJuYW1lIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJCdWZmZXIiLCJmcm9tIiwiYXJyYXlCdWZmZXIiLCJ3cml0ZUZpbGUiLCJleGlzdHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJjb21wb25lbnREaWRVcGRhdGUiLCJkaXNhYmxlR2l0SW5mb1RpbGUiLCJyZW1vdmVUb2tlbiIsIm9wZW4iLCJvbmx5U3RhZ2VkIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJ2aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwiZWRpdG9yIiwiYWJzRmlsZVBhdGgiLCJyZWFscGF0aCIsInJlcG9QYXRoIiwibm90aWZpY2F0aW9uIiwiYWRkSW5mbyIsImJ1dHRvbnMiLCJ0ZXh0Iiwib25EaWRDbGljayIsImRpc21pc3MiLCJjcmVhdGVkUGF0aCIsImluaXRpYWxpemVSZXBvIiwic2xpY2UiLCJsZW5ndGgiLCJzcGxpdERpcmVjdGlvbiIsInBhbmUiLCJnZXRBY3RpdmVQYW5lIiwic3BsaXRSaWdodCIsInNwbGl0RG93biIsImxpbmVOdW0iLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInJvdyIsIml0ZW0iLCJwZW5kaW5nIiwiYWN0aXZhdGVQYW5lIiwiYWN0aXZhdGVJdGVtIiwiZ2V0UmVhbEl0ZW1Qcm9taXNlIiwiZ2V0RmlsZVBhdGNoTG9hZGVkUHJvbWlzZSIsImdvVG9EaWZmTGluZSIsImZvY3VzIiwiRXJyb3IiLCJmaWxlUGF0aHMiLCJhYnNvbHV0ZVBhdGgiLCJnZXRVbnNhdmVkRmlsZXMiLCJ3b3JrZGlyUGF0aCIsImlzTW9kaWZpZWRCeVBhdGgiLCJNYXAiLCJnZXRUZXh0RWRpdG9ycyIsImZvckVhY2giLCJpc01vZGlmaWVkIiwiZW5zdXJlTm9VbnNhdmVkRmlsZXMiLCJ1bnNhdmVkRmlsZXMiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyIsIm11bHRpRmlsZVBhdGNoIiwibGluZXMiLCJnZXRGaWxlUGF0Y2hlcyIsImRpc2NhcmRGaWxlUGF0Y2giLCJnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImFwcGx5UGF0Y2hUb1dvcmtkaXIiLCJnZXRGaWxlUGF0aHNGb3JMYXN0RGlzY2FyZCIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJsYXN0U25hcHNob3RzIiwiZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMiLCJzbmFwc2hvdCIsInJlc3VsdHMiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzIiwiR2l0RXJyb3IiLCJzdGRFcnIiLCJtYXRjaCIsImNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzIiwiY29uc29sZSIsImVycm9yIiwiY29uZmxpY3RzIiwiY29uZmxpY3QiLCJwcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyIsInByb21wdEFib3V0Q29uZmxpY3RzIiwiY29uZmxpY3RlZEZpbGVzIiwiY2hvaWNlIiwiZGV0YWlsZWRNZXNzYWdlIiwib3BlbkNvbmZsaWN0c0luTmV3RWRpdG9ycyIsInJlc3VsdFBhdGgiLCJjbGVhckRpc2NhcmRIaXN0b3J5IiwiZmlsZVBhdGhzU3RyIiwicHJvbWlzZXMiLCJkZWxldGVkIiwidGhlaXJzU2hhIiwiY29tbW9uQmFzZVNoYSIsImN1cnJlbnRTaGEiLCJyZW1vdmUiLCJjb3B5Iiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsInBvcERpc2NhcmRIaXN0b3J5IiwicmVzdWx0UGF0aHMiLCJlZGl0b3JQcm9taXNlcyIsImZ1bGxQYXRoIiwicmVhZFN0cmVhbSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJlbmNvZGluZyIsIkNvbmZsaWN0IiwiY291bnRGcm9tU3RyZWFtIiwidGhlbiIsImNvdW50IiwicmVwb3J0TWFya2VyQ291bnQiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImRlc2VyaWFsaXplcnMiLCJmdW5jIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJzd2l0Y2hib2FyZCIsImluc3RhbmNlT2YiLCJTd2l0Y2hib2FyZCIsInN0cmluZyIsImJvb2wiLCJuYW1lIiwiZm9jdXNUb1Jlc3RvcmUiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJzaG91bGRSZXN0b3JlRm9jdXMiLCJ3YXNSZW5kZXJlZCIsImlzUmVuZGVyZWQiLCJ3YXNWaXNpYmxlIiwiaXNWaXNpYmxlIiwicmV2ZWFsIiwiaGlkZSIsInByb2Nlc3MiLCJuZXh0VGljayIsImhhZEZvY3VzIiwiaGFzRm9jdXMiLCJnZXRDZW50ZXIiLCJhY3RpdmF0ZSIsInNlYXJjaEFsbFBhbmVzIiwiaW5jcmVtZW50Q291bnRlciIsInJlc3RvcmVGb2N1cyIsImdldEl0ZW0iLCJwYW5lRm9yVVJJIiwicGFuZUl0ZW0iLCJpdGVtRm9yVVJJIiwiZ2V0UmVhbEl0ZW0iLCJnZXRET01FbGVtZW50IiwiZ2V0RWxlbWVudCIsImdldFBhbmVDb250YWluZXJzIiwic29tZSIsImdldFBhbmVzIiwiZ2V0QWN0aXZlSXRlbSIsImdldFVSSSIsInJvb3QiLCJjb250YWlucyJdLCJzb3VyY2VzIjpbInJvb3QtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5jb25zdCByZW1vdGUgPSByZXF1aXJlKCdAZWxlY3Ryb24vcmVtb3RlJyk7XG5cbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcblxuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuLi9hdG9tL3N0YXR1cy1iYXInO1xuaW1wb3J0IFBhbmVJdGVtIGZyb20gJy4uL2F0b20vcGFuZS1pdGVtJztcbmltcG9ydCB7b3Blbklzc3VlaXNoSXRlbX0gZnJvbSAnLi4vdmlld3Mvb3Blbi1pc3N1ZWlzaC1kaWFsb2cnO1xuaW1wb3J0IHtvcGVuQ29tbWl0RGV0YWlsSXRlbX0gZnJvbSAnLi4vdmlld3Mvb3Blbi1jb21taXQtZGlhbG9nJztcbmltcG9ydCB7Y3JlYXRlUmVwb3NpdG9yeSwgcHVibGlzaFJlcG9zaXRvcnl9IGZyb20gJy4uL3ZpZXdzL2NyZWF0ZS1kaWFsb2cnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IENoYW5nZWRGaWxlSXRlbSBmcm9tICcuLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbSc7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ29tbWl0UHJldmlld0l0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LXByZXZpZXctaXRlbSc7XG5pbXBvcnQgR2l0VGFiSXRlbSBmcm9tICcuLi9pdGVtcy9naXQtdGFiLWl0ZW0nO1xuaW1wb3J0IEdpdEh1YlRhYkl0ZW0gZnJvbSAnLi4vaXRlbXMvZ2l0aHViLXRhYi1pdGVtJztcbmltcG9ydCBSZXZpZXdzSXRlbSBmcm9tICcuLi9pdGVtcy9yZXZpZXdzLWl0ZW0nO1xuaW1wb3J0IENvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2NvbW1lbnQtZGVjb3JhdGlvbnMtY29udGFpbmVyJztcbmltcG9ydCBEaWFsb2dzQ29udHJvbGxlciwge2RpYWxvZ1JlcXVlc3RzfSBmcm9tICcuL2RpYWxvZ3MtY29udHJvbGxlcic7XG5pbXBvcnQgU3RhdHVzQmFyVGlsZUNvbnRyb2xsZXIgZnJvbSAnLi9zdGF0dXMtYmFyLXRpbGUtY29udHJvbGxlcic7XG5pbXBvcnQgUmVwb3NpdG9yeUNvbmZsaWN0Q29udHJvbGxlciBmcm9tICcuL3JlcG9zaXRvcnktY29uZmxpY3QtY29udHJvbGxlcic7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQgR2l0Q2FjaGVWaWV3IGZyb20gJy4uL3ZpZXdzL2dpdC1jYWNoZS12aWV3JztcbmltcG9ydCBHaXRUaW1pbmdzVmlldyBmcm9tICcuLi92aWV3cy9naXQtdGltaW5ncy12aWV3JztcbmltcG9ydCBDb25mbGljdCBmcm9tICcuLi9tb2RlbHMvY29uZmxpY3RzL2NvbmZsaWN0JztcbmltcG9ydCB7Z2V0RW5kcG9pbnR9IGZyb20gJy4uL21vZGVscy9lbmRwb2ludCc7XG5pbXBvcnQgU3dpdGNoYm9hcmQgZnJvbSAnLi4vc3dpdGNoYm9hcmQnO1xuaW1wb3J0IHtXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2Rlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMsIGRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcywgYXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtHaXRFcnJvcn0gZnJvbSAnLi4vZ2l0LXNoZWxsLW91dC1zdHJhdGVneSc7XG5pbXBvcnQge2luY3JlbWVudENvdW50ZXIsIGFkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvb3RDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBBdG9tIGVudmlvcm5tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBkZXNlcmlhbGl6ZXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGdyYW1tYXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHJvamVjdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudFdpbmRvdzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTW9kZWxzXG4gICAgbG9naW5Nb2RlbDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXJDb250ZXh0UG9vbDogV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3RhdHVzQmFyOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHN3aXRjaGJvYXJkOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihTd2l0Y2hib2FyZCksXG4gICAgcGlwZWxpbmVNYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgY3VycmVudFdvcmtEaXI6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvLyBHaXQgYWN0aW9uc1xuICAgIGluaXRpYWxpemU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2xvbmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDb250cm9sXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHN0YXJ0T3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gICAgc3RhcnRSZXZlYWxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHN3aXRjaGJvYXJkOiBuZXcgU3dpdGNoYm9hcmQoKSxcbiAgICBzdGFydE9wZW46IGZhbHNlLFxuICAgIHN0YXJ0UmV2ZWFsZWQ6IGZhbHNlLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2luc3RhbGxSZWFjdERldlRvb2xzJywgJ2NsZWFyR2l0aHViVG9rZW4nLFxuICAgICAgJ3Nob3dXYXRlcmZhbGxEaWFnbm9zdGljcycsICdzaG93Q2FjaGVEaWFnbm9zdGljcycsXG4gICAgICAnZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcycsICdkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMnLFxuICAgICAgJ3F1aWV0bHlTZWxlY3RJdGVtJywgJ3ZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZScsXG4gICAgICAndmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZScsICdvcGVuRmlsZXMnLCAnZ2V0VW5zYXZlZEZpbGVzJywgJ2Vuc3VyZU5vVW5zYXZlZEZpbGVzJyxcbiAgICAgICdkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocycsICdkaXNjYXJkTGluZXMnLCAndW5kb0xhc3REaXNjYXJkJywgJ3JlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MnLFxuICAgICk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlhbG9nUmVxdWVzdDogZGlhbG9nUmVxdWVzdHMubnVsbCxcbiAgICB9O1xuXG4gICAgdGhpcy5naXRUYWJUcmFja2VyID0gbmV3IFRhYlRyYWNrZXIoJ2dpdCcsIHtcbiAgICAgIHVyaTogR2l0VGFiSXRlbS5idWlsZFVSSSgpLFxuICAgICAgZ2V0V29ya3NwYWNlOiAoKSA9PiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZ2l0aHViVGFiVHJhY2tlciA9IG5ldyBUYWJUcmFja2VyKCdnaXRodWInLCB7XG4gICAgICB1cmk6IEdpdEh1YlRhYkl0ZW0uYnVpbGRVUkkoKSxcbiAgICAgIGdldFdvcmtzcGFjZTogKCkgPT4gdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm9uUHVsbEVycm9yKHRoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVWaXNpYmxlKSxcbiAgICApO1xuXG4gICAgdGhpcy5wcm9wcy5jb21tYW5kcy5vbkRpZERpc3BhdGNoKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlICYmIGV2ZW50LnR5cGUuc3RhcnRzV2l0aCgnZ2l0aHViOicpXG4gICAgICAgICYmIGV2ZW50LmRldGFpbCAmJiBldmVudC5kZXRhaWxbMF0gJiYgZXZlbnQuZGV0YWlsWzBdLmNvbnRleHRDb21tYW5kKSB7XG4gICAgICAgIGFkZEV2ZW50KCdjb250ZXh0LW1lbnUtYWN0aW9uJywge1xuICAgICAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgICAgIGNvbW1hbmQ6IGV2ZW50LnR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5vcGVuVGFicygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclN0YXR1c0JhclRpbGUoKX1cbiAgICAgICAge3RoaXMucmVuZGVyUGFuZUl0ZW1zKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRpYWxvZ3MoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29uZmxpY3RSZXNvbHZlcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tZW50RGVjb3JhdGlvbnMoKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIGNvbnN0IGRldk1vZGUgPSBnbG9iYWwuYXRvbSAmJiBnbG9iYWwuYXRvbS5pbkRldk1vZGUoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICB7ZGV2TW9kZSAmJiA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3RhbGwtcmVhY3QtZGV2LXRvb2xzXCIgY2FsbGJhY2s9e3RoaXMuaW5zdGFsbFJlYWN0RGV2VG9vbHN9IC8+fVxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWNvbW1pdC1wcmV2aWV3XCIgY2FsbGJhY2s9e3RoaXMudG9nZ2xlQ29tbWl0UHJldmlld0l0ZW19IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpsb2dvdXRcIiBjYWxsYmFjaz17dGhpcy5jbGVhckdpdGh1YlRva2VufSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy13YXRlcmZhbGwtZGlhZ25vc3RpY3NcIiBjYWxsYmFjaz17dGhpcy5zaG93V2F0ZXJmYWxsRGlhZ25vc3RpY3N9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzaG93LWNhY2hlLWRpYWdub3N0aWNzXCIgY2FsbGJhY2s9e3RoaXMuc2hvd0NhY2hlRGlhZ25vc3RpY3N9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZ2l0LXRhYlwiIGNhbGxiYWNrPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdC10YWItZm9jdXNcIiBjYWxsYmFjaz17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZUZvY3VzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdGh1Yi10YWJcIiBjYWxsYmFjaz17dGhpcy5naXRodWJUYWJUcmFja2VyLnRvZ2dsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXRodWItdGFiLWZvY3VzXCIgY2FsbGJhY2s9e3RoaXMuZ2l0aHViVGFiVHJhY2tlci50b2dnbGVGb2N1c30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluaXRpYWxpemVcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuSW5pdGlhbGl6ZURpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y2xvbmVcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuQ2xvbmVEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOm9wZW4taXNzdWUtb3ItcHVsbC1yZXF1ZXN0XCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3Blbklzc3VlaXNoRGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpvcGVuLWNvbW1pdFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5Db21taXREaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNyZWF0ZS1yZXBvc2l0b3J5XCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkNyZWF0ZURpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOnZpZXctdW5zdGFnZWQtY2hhbmdlcy1mb3ItY3VycmVudC1maWxlXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLnZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOnZpZXctc3RhZ2VkLWNoYW5nZXMtZm9yLWN1cnJlbnQtZmlsZVwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy52aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6Y2xvc2UtYWxsLWRpZmYtdmlld3NcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMuZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOmNsb3NlLWVtcHR5LWRpZmYtdmlld3NcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMuZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMucmVwb3NpdG9yeX0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoRGF0YX0+XG4gICAgICAgICAge2RhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLmlzUHVibGlzaGFibGUgfHwgIWRhdGEucmVtb3Rlcy5maWx0ZXIociA9PiByLmlzR2l0aHViUmVwbygpKS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1YjpwdWJsaXNoLXJlcG9zaXRvcnlcIlxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlblB1Ymxpc2hEaWFsb2codGhpcy5wcm9wcy5yZXBvc2l0b3J5KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9fVxuICAgICAgICA8L09ic2VydmVNb2RlbD5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclN0YXR1c0JhclRpbGUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGF0dXNCYXJcbiAgICAgICAgc3RhdHVzQmFyPXt0aGlzLnByb3BzLnN0YXR1c0Jhcn1cbiAgICAgICAgb25Db25zdW1lU3RhdHVzQmFyPXtzYiA9PiB0aGlzLm9uQ29uc3VtZVN0YXR1c0JhcihzYil9XG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGF0dXNCYXJUaWxlQ29udHJvbGxlclwiPlxuICAgICAgICA8U3RhdHVzQmFyVGlsZUNvbnRyb2xsZXJcbiAgICAgICAgICBwaXBlbGluZU1hbmFnZXI9e3RoaXMucHJvcHMucGlwZWxpbmVNYW5hZ2VyfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgdG9nZ2xlR2l0VGFiPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlfVxuICAgICAgICAgIHRvZ2dsZUdpdGh1YlRhYj17dGhpcy5naXRodWJUYWJUcmFja2VyLnRvZ2dsZX1cbiAgICAgICAgLz5cbiAgICAgIDwvU3RhdHVzQmFyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEaWFsb2dzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RGlhbG9nc0NvbnRyb2xsZXJcbiAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICByZXF1ZXN0PXt0aGlzLnN0YXRlLmRpYWxvZ1JlcXVlc3R9XG5cbiAgICAgICAgY3VycmVudFdpbmRvdz17dGhpcy5wcm9wcy5jdXJyZW50V2luZG93fVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1lbnREZWNvcmF0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWVudERlY29yYXRpb25zQ29udGFpbmVyXG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb25mbGljdFJlc29sdmVyKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJlcG9zaXRvcnlDb25mbGljdENvbnRyb2xsZXJcbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUGFuZUl0ZW1zKCkge1xuICAgIGNvbnN0IHt3b3JrZGlyQ29udGV4dFBvb2x9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBnZXRDdXJyZW50V29ya0RpcnMgPSB3b3JrZGlyQ29udGV4dFBvb2wuZ2V0Q3VycmVudFdvcmtEaXJzLmJpbmQod29ya2RpckNvbnRleHRQb29sKTtcbiAgICBjb25zdCBvbkRpZENoYW5nZVdvcmtEaXJzID0gd29ya2RpckNvbnRleHRQb29sLm9uRGlkQ2hhbmdlUG9vbENvbnRleHRzLmJpbmQod29ya2RpckNvbnRleHRQb29sKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17R2l0VGFiSXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQtcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiAoXG4gICAgICAgICAgICA8R2l0VGFiSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgZ3JhbW1hcnM9e3RoaXMucHJvcHMuZ3JhbW1hcnN9XG4gICAgICAgICAgICAgIHByb2plY3Q9e3RoaXMucHJvcHMucHJvamVjdH1cbiAgICAgICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgb3BlbkluaXRpYWxpemVEaWFsb2c9e3RoaXMub3BlbkluaXRpYWxpemVEaWFsb2d9XG4gICAgICAgICAgICAgIHJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGVuc3VyZUdpdFRhYj17dGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVZpc2libGV9XG4gICAgICAgICAgICAgIG9wZW5GaWxlcz17dGhpcy5vcGVuRmlsZXN9XG4gICAgICAgICAgICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzPXt0aGlzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzfVxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICAgICAgICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e2dldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17b25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgICAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0dpdEh1YlRhYkl0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gKFxuICAgICAgICAgICAgPEdpdEh1YlRhYkl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e2dldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17b25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgICAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICAgICAgICBvcGVuQ3JlYXRlRGlhbG9nPXt0aGlzLm9wZW5DcmVhdGVEaWFsb2d9XG4gICAgICAgICAgICAgIG9wZW5QdWJsaXNoRGlhbG9nPXt0aGlzLm9wZW5QdWJsaXNoRGlhbG9nfVxuICAgICAgICAgICAgICBvcGVuQ2xvbmVEaWFsb2c9e3RoaXMub3BlbkNsb25lRGlhbG9nfVxuICAgICAgICAgICAgICBvcGVuR2l0VGFiPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlRm9jdXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17Q2hhbmdlZEZpbGVJdGVtLnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxDaGFuZ2VkRmlsZUl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICByZWxQYXRoPXtwYXRoLmpvaW4oLi4ucGFyYW1zLnJlbFBhdGgpfVxuICAgICAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXtwYXJhbXMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgc3RhZ2luZ1N0YXR1cz17cGFyYW1zLnN0YWdpbmdTdGF0dXN9XG5cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgICAgICAgZGlzY2FyZExpbmVzPXt0aGlzLmRpc2NhcmRMaW5lc31cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICAgICAgc3VyZmFjZUZpbGVBdFBhdGg9e3RoaXMuc3VyZmFjZUZyb21GaWxlQXRQYXRofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0NvbW1pdFByZXZpZXdJdGVtLnVyaVBhdHRlcm59XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFByZXZpZXctcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxDb21taXRQcmV2aWV3SXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICBkaXNjYXJkTGluZXM9e3RoaXMuZGlzY2FyZExpbmVzfVxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICAgICAgICBzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uPXt0aGlzLnN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17Q29tbWl0RGV0YWlsSXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWwtcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxDb21taXREZXRhaWxJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIHNoYT17cGFyYW1zLnNoYX1cbiAgICAgICAgICAgICAgc3VyZmFjZUNvbW1pdD17dGhpcy5zdXJmYWNlVG9SZWNlbnRDb21taXR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtJc3N1ZWlzaERldGFpbEl0ZW0udXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zLCBkZXNlcmlhbGl6ZWR9KSA9PiAoXG4gICAgICAgICAgICA8SXNzdWVpc2hEZXRhaWxJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgaG9zdD17cGFyYW1zLmhvc3R9XG4gICAgICAgICAgICAgIG93bmVyPXtwYXJhbXMub3duZXJ9XG4gICAgICAgICAgICAgIHJlcG89e3BhcmFtcy5yZXBvfVxuICAgICAgICAgICAgICBpc3N1ZWlzaE51bWJlcj17cGFyc2VJbnQocGFyYW1zLmlzc3VlaXNoTnVtYmVyLCAxMCl9XG5cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgaW5pdFNlbGVjdGVkVGFiPXtkZXNlcmlhbGl6ZWQuaW5pdFNlbGVjdGVkVGFifVxuXG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IHVyaVBhdHRlcm49e1Jldmlld3NJdGVtLnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxSZXZpZXdzSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIGhvc3Q9e3BhcmFtcy5ob3N0fVxuICAgICAgICAgICAgICBvd25lcj17cGFyYW1zLm93bmVyfVxuICAgICAgICAgICAgICByZXBvPXtwYXJhbXMucmVwb31cbiAgICAgICAgICAgICAgbnVtYmVyPXtwYXJzZUludChwYXJhbXMubnVtYmVyLCAxMCl9XG5cbiAgICAgICAgICAgICAgd29ya2Rpcj17cGFyYW1zLndvcmtkaXJ9XG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IHVyaVBhdHRlcm49e0dpdFRpbWluZ3NWaWV3LnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiA8R2l0VGltaW5nc1ZpZXcgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn0gLz59XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtHaXRDYWNoZVZpZXcudXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlcn0pID0+IDxHaXRDYWNoZVZpZXcgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn0gcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSAvPn1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIGZldGNoRGF0YSA9IHJlcG9zaXRvcnkgPT4geXViaWtpcmkoe1xuICAgIGlzUHVibGlzaGFibGU6IHJlcG9zaXRvcnkuaXNQdWJsaXNoYWJsZSgpLFxuICAgIHJlbW90ZXM6IHJlcG9zaXRvcnkuZ2V0UmVtb3RlcygpLFxuICB9KTtcblxuICBhc3luYyBvcGVuVGFicygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zdGFydE9wZW4pIHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgdGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVJlbmRlcmVkKGZhbHNlKSxcbiAgICAgICAgdGhpcy5naXRodWJUYWJUcmFja2VyLmVuc3VyZVJlbmRlcmVkKGZhbHNlKSxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnN0YXJ0UmV2ZWFsZWQpIHtcbiAgICAgIGNvbnN0IGRvY2tzID0gbmV3IFNldChcbiAgICAgICAgW0dpdFRhYkl0ZW0uYnVpbGRVUkkoKSwgR2l0SHViVGFiSXRlbS5idWlsZFVSSSgpXVxuICAgICAgICAgIC5tYXAodXJpID0+IHRoaXMucHJvcHMud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JVUkkodXJpKSlcbiAgICAgICAgICAuZmlsdGVyKGNvbnRhaW5lciA9PiBjb250YWluZXIgJiYgKHR5cGVvZiBjb250YWluZXIuc2hvdykgPT09ICdmdW5jdGlvbicpLFxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBkb2NrIG9mIGRvY2tzKSB7XG4gICAgICAgIGRvY2suc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluc3RhbGxSZWFjdERldlRvb2xzKCkge1xuICAgIC8vIFByZXZlbnQgZWxlY3Ryb24tbGluayBmcm9tIGF0dGVtcHRpbmcgdG8gZGVzY2VuZCBpbnRvIGVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlciwgd2hpY2ggaXMgbm90IGF2YWlsYWJsZVxuICAgIC8vIHdoZW4gd2UncmUgYnVuZGxlZCBpbiBBdG9tLlxuICAgIGNvbnN0IGRldlRvb2xzTmFtZSA9ICdlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXInO1xuICAgIGNvbnN0IGRldlRvb2xzID0gcmVxdWlyZShkZXZUb29sc05hbWUpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5pbnN0YWxsRXh0ZW5zaW9uKGRldlRvb2xzLlJFQUNUX0RFVkVMT1BFUl9UT09MUy5pZCksXG4gICAgICAvLyByZWxheSBkZXZlbG9wZXIgdG9vbHMgZXh0ZW5zaW9uIGlkXG4gICAgICB0aGlzLmluc3RhbGxFeHRlbnNpb24oJ25jZWRvYnBnbm1raGNtbm5rY2ltbm9icGZlcGlkYWRsJyksXG4gICAgXSk7XG5cbiAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkU3VjY2Vzcygn8J+MiCBSZWxvYWQgeW91ciB3aW5kb3cgdG8gc3RhcnQgdXNpbmcgdGhlIFJlYWN0L1JlbGF5IGRldiB0b29scyEnKTtcbiAgfVxuXG4gIGFzeW5jIGluc3RhbGxFeHRlbnNpb24oaWQpIHtcbiAgICBjb25zdCBkZXZUb29sc05hbWUgPSAnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJztcbiAgICBjb25zdCBkZXZUb29scyA9IHJlcXVpcmUoZGV2VG9vbHNOYW1lKTtcblxuICAgIGNvbnN0IGNyb3NzVW56aXBOYW1lID0gJ2Nyb3NzLXVuemlwJztcbiAgICBjb25zdCB1bnppcCA9IHJlcXVpcmUoY3Jvc3NVbnppcE5hbWUpO1xuXG4gICAgY29uc3QgdXJsID1cbiAgICAgICdodHRwczovL2NsaWVudHMyLmdvb2dsZS5jb20vc2VydmljZS91cGRhdGUyL2NyeD8nICtcbiAgICAgIGByZXNwb25zZT1yZWRpcmVjdCZ4PWlkJTNEJHtpZH0lMjZ1YyZwcm9kdmVyc2lvbj0zMmA7XG4gICAgY29uc3QgZXh0ZW5zaW9uRm9sZGVyID0gcGF0aC5yZXNvbHZlKHJlbW90ZS5hcHAuZ2V0UGF0aCgndXNlckRhdGEnKSwgYGV4dGVuc2lvbnMvJHtpZH1gKTtcbiAgICBjb25zdCBleHRlbnNpb25GaWxlID0gYCR7ZXh0ZW5zaW9uRm9sZGVyfS5jcnhgO1xuICAgIGF3YWl0IGZzLmVuc3VyZURpcihwYXRoLmRpcm5hbWUoZXh0ZW5zaW9uRmlsZSkpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7bWV0aG9kOiAnR0VUJ30pO1xuICAgIGNvbnN0IGJvZHkgPSBCdWZmZXIuZnJvbShhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpKTtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoZXh0ZW5zaW9uRmlsZSwgYm9keSk7XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB1bnppcChleHRlbnNpb25GaWxlLCBleHRlbnNpb25Gb2xkZXIsIGFzeW5jIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIgJiYgIWF3YWl0IGZzLmV4aXN0cyhwYXRoLmpvaW4oZXh0ZW5zaW9uRm9sZGVyLCAnbWFuaWZlc3QuanNvbicpKSkge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBmcy5lbnN1cmVEaXIoZXh0ZW5zaW9uRm9sZGVyLCAwbzc1NSk7XG4gICAgYXdhaXQgZGV2VG9vbHMuZGVmYXVsdChpZCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLnByb3BzLnJlcG9zaXRvcnkub25QdWxsRXJyb3IoKCkgPT4gdGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVZpc2libGUoKSksXG4gICAgKTtcbiAgfVxuXG4gIG9uQ29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXIpIHtcbiAgICBpZiAoc3RhdHVzQmFyLmRpc2FibGVHaXRJbmZvVGlsZSkge1xuICAgICAgc3RhdHVzQmFyLmRpc2FibGVHaXRJbmZvVGlsZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyR2l0aHViVG9rZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubG9naW5Nb2RlbC5yZW1vdmVUb2tlbignaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbScpO1xuICB9XG5cbiAgY2xvc2VEaWFsb2cgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3Q6IGRpYWxvZ1JlcXVlc3RzLm51bGx9LCByZXNvbHZlKSk7XG5cbiAgb3BlbkluaXRpYWxpemVEaWFsb2cgPSBhc3luYyBkaXJQYXRoID0+IHtcbiAgICBpZiAoIWRpclBhdGgpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgIGlmIChhY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgY29uc3QgW3Byb2plY3RQYXRoXSA9IHRoaXMucHJvcHMucHJvamVjdC5yZWxhdGl2aXplUGF0aChhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICAgICAgZGlyUGF0aCA9IHByb2plY3RQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFkaXJQYXRoKSB7XG4gICAgICBjb25zdCBkaXJlY3RvcmllcyA9IHRoaXMucHJvcHMucHJvamVjdC5nZXREaXJlY3RvcmllcygpO1xuICAgICAgY29uc3Qgd2l0aFJlcG9zaXRvcmllcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBkaXJlY3Rvcmllcy5tYXAoYXN5bmMgZCA9PiBbZCwgYXdhaXQgdGhpcy5wcm9wcy5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZCldKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBmaXJzdFVuaW5pdGlhbGl6ZWQgPSB3aXRoUmVwb3NpdG9yaWVzLmZpbmQoKFtkLCByXSkgPT4gIXIpO1xuICAgICAgaWYgKGZpcnN0VW5pbml0aWFsaXplZCAmJiBmaXJzdFVuaW5pdGlhbGl6ZWRbMF0pIHtcbiAgICAgICAgZGlyUGF0aCA9IGZpcnN0VW5pbml0aWFsaXplZFswXS5nZXRQYXRoKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFkaXJQYXRoKSB7XG4gICAgICBkaXJQYXRoID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdjb3JlLnByb2plY3RIb21lJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmluaXQoe2RpclBhdGh9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgY2hvc2VuUGF0aCA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLmluaXRpYWxpemUoY2hvc2VuUGF0aCk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ2xvbmVEaWFsb2cgPSBvcHRzID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY2xvbmUob3B0cyk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jICh1cmwsIGNob3NlblBhdGgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuY2xvbmUodXJsLCBjaG9zZW5QYXRoKTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5DcmVkZW50aWFsc0RpYWxvZyA9IHF1ZXJ5ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNyZWRlbnRpYWwocXVlcnkpO1xuICAgICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgICAgfSk7XG4gICAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSk7XG4gICAgfSk7XG4gIH1cblxuICBvcGVuSXNzdWVpc2hEaWFsb2cgPSAoKSA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmlzc3VlaXNoKCk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHVybCA9PiB7XG4gICAgICBhd2FpdCBvcGVuSXNzdWVpc2hJdGVtKHVybCwge1xuICAgICAgICB3b3Jrc3BhY2U6IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgICAgICB3b3JrZGlyOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNvbW1pdERpYWxvZyA9ICgpID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY29tbWl0KCk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlZiA9PiB7XG4gICAgICBhd2FpdCBvcGVuQ29tbWl0RGV0YWlsSXRlbShyZWYsIHtcbiAgICAgICAgd29ya3NwYWNlOiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICAgICAgcmVwb3NpdG9yeTogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LFxuICAgICAgfSk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ3JlYXRlRGlhbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5jcmVhdGUoKTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IGRvdGNvbSA9IGdldEVuZHBvaW50KCdnaXRodWIuY29tJyk7XG4gICAgICBjb25zdCByZWxheUVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdChkb3Rjb20pO1xuXG4gICAgICBhd2FpdCBjcmVhdGVSZXBvc2l0b3J5KHJlc3VsdCwge2Nsb25lOiB0aGlzLnByb3BzLmNsb25lLCByZWxheUVudmlyb25tZW50fSk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuUHVibGlzaERpYWxvZyA9IHJlcG9zaXRvcnkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5wdWJsaXNoKHtsb2NhbERpcjogcmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICBjb25zdCBkb3Rjb20gPSBnZXRFbmRwb2ludCgnZ2l0aHViLmNvbScpO1xuICAgICAgY29uc3QgcmVsYXlFbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QoZG90Y29tKTtcblxuICAgICAgYXdhaXQgcHVibGlzaFJlcG9zaXRvcnkocmVzdWx0LCB7cmVwb3NpdG9yeSwgcmVsYXlFbnZpcm9ubWVudH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgdG9nZ2xlQ29tbWl0UHJldmlld0l0ZW0gPSAoKSA9PiB7XG4gICAgY29uc3Qgd29ya2RpciA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS50b2dnbGUoQ29tbWl0UHJldmlld0l0ZW0uYnVpbGRVUkkod29ya2RpcikpO1xuICB9XG5cbiAgc2hvd1dhdGVyZmFsbERpYWdub3N0aWNzKCkge1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oR2l0VGltaW5nc1ZpZXcuYnVpbGRVUkkoKSk7XG4gIH1cblxuICBzaG93Q2FjaGVEaWFnbm9zdGljcygpIHtcbiAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKEdpdENhY2hlVmlldy5idWlsZFVSSSgpKTtcbiAgfVxuXG4gIHN1cmZhY2VGcm9tRmlsZUF0UGF0aCA9IChmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5mb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgfVxuXG4gIHN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b24gPSAoKSA9PiB7XG4gICAgY29uc3QgZ2l0VGFiID0gdGhpcy5naXRUYWJUcmFja2VyLmdldENvbXBvbmVudCgpO1xuICAgIHJldHVybiBnaXRUYWIgJiYgZ2l0VGFiLmZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpO1xuICB9XG5cbiAgc3VyZmFjZVRvUmVjZW50Q29tbWl0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5mb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpO1xuICB9XG5cbiAgZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcygpIHtcbiAgICBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkOiBmYWxzZX0sIHRoaXMucHJvcHMud29ya3NwYWNlKTtcbiAgfVxuXG4gIGRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcygpIHtcbiAgICBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXModGhpcy5wcm9wcy53b3Jrc3BhY2UpO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICB9XG5cbiAgYXN5bmMgdmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZShzdGFnaW5nU3RhdHVzKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmICghZWRpdG9yLmdldFBhdGgoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGFic0ZpbGVQYXRoID0gYXdhaXQgZnMucmVhbHBhdGgoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgY29uc3QgcmVwb1BhdGggPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgICBpZiAocmVwb1BhdGggPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtwcm9qZWN0UGF0aF0gPSB0aGlzLnByb3BzLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkSW5mbyhcbiAgICAgICAgXCJIbW0sIHRoZXJlJ3Mgbm90aGluZyB0byBjb21wYXJlIHRoaXMgZmlsZSB0b1wiLFxuICAgICAgICB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdZb3UgY2FuIGNyZWF0ZSBhIEdpdCByZXBvc2l0b3J5IHRvIHRyYWNrIGNoYW5nZXMgdG8gdGhlIGZpbGVzIGluIHlvdXIgcHJvamVjdC4nLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgdGV4dDogJ0NyZWF0ZSBhIHJlcG9zaXRvcnkgbm93JyxcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgY29uc3QgY3JlYXRlZFBhdGggPSBhd2FpdCB0aGlzLmluaXRpYWxpemVSZXBvKHByb2plY3RQYXRoKTtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgY29uZmlybWVkIHJlcG9zaXRvcnkgY3JlYXRpb24gZm9yIHRoaXMgcHJvamVjdCBwYXRoLFxuICAgICAgICAgICAgICAvLyByZXRyeSB0aGUgb3BlcmF0aW9uIHRoYXQgZ290IHRoZW0gaGVyZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgICAgICAgICAgaWYgKGNyZWF0ZWRQYXRoID09PSBwcm9qZWN0UGF0aCkgeyB0aGlzLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoc3RhZ2luZ1N0YXR1cyk7IH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoYWJzRmlsZVBhdGguc3RhcnRzV2l0aChyZXBvUGF0aCkpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gYWJzRmlsZVBhdGguc2xpY2UocmVwb1BhdGgubGVuZ3RoICsgMSk7XG4gICAgICB0aGlzLnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgICAgIGNvbnN0IHNwbGl0RGlyZWN0aW9uID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIudmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZURpZmZQYW5lU3BsaXREaXJlY3Rpb24nKTtcbiAgICAgIGNvbnN0IHBhbmUgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gICAgICBpZiAoc3BsaXREaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgcGFuZS5zcGxpdFJpZ2h0KCk7XG4gICAgICB9IGVsc2UgaWYgKHNwbGl0RGlyZWN0aW9uID09PSAnZG93bicpIHtcbiAgICAgICAgcGFuZS5zcGxpdERvd24oKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxpbmVOdW0gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICAgIENoYW5nZWRGaWxlSXRlbS5idWlsZFVSSShmaWxlUGF0aCwgcmVwb1BhdGgsIHN0YWdpbmdTdGF0dXMpLFxuICAgICAgICB7cGVuZGluZzogdHJ1ZSwgYWN0aXZhdGVQYW5lOiB0cnVlLCBhY3RpdmF0ZUl0ZW06IHRydWV9LFxuICAgICAgKTtcbiAgICAgIGF3YWl0IGl0ZW0uZ2V0UmVhbEl0ZW1Qcm9taXNlKCk7XG4gICAgICBhd2FpdCBpdGVtLmdldEZpbGVQYXRjaExvYWRlZFByb21pc2UoKTtcbiAgICAgIGl0ZW0uZ29Ub0RpZmZMaW5lKGxpbmVOdW0pO1xuICAgICAgaXRlbS5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7YWJzRmlsZVBhdGh9IGRvZXMgbm90IGJlbG9uZyB0byByZXBvICR7cmVwb1BhdGh9YCk7XG4gICAgfVxuICB9XG5cbiAgdmlld1Vuc3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoJ3Vuc3RhZ2VkJyk7XG4gIH1cblxuICB2aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoJ3N0YWdlZCcpO1xuICB9XG5cbiAgb3BlbkZpbGVzKGZpbGVQYXRocywgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IHtcbiAgICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IHBhdGguam9pbihyZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksIGZpbGVQYXRoKTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKGFic29sdXRlUGF0aCwge3BlbmRpbmc6IGZpbGVQYXRocy5sZW5ndGggPT09IDF9KTtcbiAgICB9KSk7XG4gIH1cblxuICBnZXRVbnNhdmVkRmlsZXMoZmlsZVBhdGhzLCB3b3JrZGlyUGF0aCkge1xuICAgIGNvbnN0IGlzTW9kaWZpZWRCeVBhdGggPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKGVkaXRvciA9PiB7XG4gICAgICBpc01vZGlmaWVkQnlQYXRoLnNldChlZGl0b3IuZ2V0UGF0aCgpLCBlZGl0b3IuaXNNb2RpZmllZCgpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmlsZVBhdGhzLmZpbHRlcihmaWxlUGF0aCA9PiB7XG4gICAgICBjb25zdCBhYnNGaWxlUGF0aCA9IHBhdGguam9pbih3b3JrZGlyUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgcmV0dXJuIGlzTW9kaWZpZWRCeVBhdGguZ2V0KGFic0ZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGVuc3VyZU5vVW5zYXZlZEZpbGVzKGZpbGVQYXRocywgbWVzc2FnZSwgd29ya2RpclBhdGggPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkge1xuICAgIGNvbnN0IHVuc2F2ZWRGaWxlcyA9IHRoaXMuZ2V0VW5zYXZlZEZpbGVzKGZpbGVQYXRocywgd29ya2RpclBhdGgpLm1hcChmaWxlUGF0aCA9PiBgXFxgJHtmaWxlUGF0aH1cXGBgKS5qb2luKCc8YnI+Jyk7XG4gICAgaWYgKHVuc2F2ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzIGluOjxicj4ke3Vuc2F2ZWRGaWxlc30uYCxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocykge1xuICAgIGNvbnN0IGRlc3RydWN0aXZlQWN0aW9uID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpO1xuICAgIH07XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoXG4gICAgICBmaWxlUGF0aHMsXG4gICAgICAoKSA9PiB0aGlzLmVuc3VyZU5vVW5zYXZlZEZpbGVzKGZpbGVQYXRocywgJ0Nhbm5vdCBkaXNjYXJkIGNoYW5nZXMgaW4gc2VsZWN0ZWQgZmlsZXMuJyksXG4gICAgICBkZXN0cnVjdGl2ZUFjdGlvbixcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgZGlzY2FyZExpbmVzKG11bHRpRmlsZVBhdGNoLCBsaW5lcywgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgIC8vIChrdXljaGFjbykgRm9yIG5vdyB3ZSBvbmx5IHN1cHBvcnQgZGlzY2FyZGluZyByb3dzIGZvciBNdWx0aUZpbGVQYXRjaGVzIHRoYXQgY29udGFpbiBhIHNpbmdsZSBmaWxlIHBhdGNoXG4gICAgLy8gVGhlIG9ubHkgd2F5IHRvIGFjY2VzcyB0aGlzIG1ldGhvZCBmcm9tIHRoZSBVSSBpcyB0byBiZSBpbiBhIENoYW5nZWRGaWxlSXRlbSwgd2hpY2ggb25seSBoYXMgYSBzaW5nbGUgZmlsZSBwYXRjaFxuICAgIGlmIChtdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IG11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKClbMF0uZ2V0UGF0aCgpO1xuICAgIGNvbnN0IGRlc3RydWN0aXZlQWN0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlzY2FyZEZpbGVQYXRjaCA9IG11bHRpRmlsZVBhdGNoLmdldFVuc3RhZ2VQYXRjaEZvckxpbmVzKGxpbmVzKTtcbiAgICAgIGF3YWl0IHJlcG9zaXRvcnkuYXBwbHlQYXRjaFRvV29ya2RpcihkaXNjYXJkRmlsZVBhdGNoKTtcbiAgICB9O1xuICAgIHJldHVybiBhd2FpdCByZXBvc2l0b3J5LnN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhcbiAgICAgIFtmaWxlUGF0aF0sXG4gICAgICAoKSA9PiB0aGlzLmVuc3VyZU5vVW5zYXZlZEZpbGVzKFtmaWxlUGF0aF0sICdDYW5ub3QgZGlzY2FyZCBsaW5lcy4nLCByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpLFxuICAgICAgZGVzdHJ1Y3RpdmVBY3Rpb24sXG4gICAgICBmaWxlUGF0aCxcbiAgICApO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGhzRm9yTGFzdERpc2NhcmQocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBsZXQgbGFzdFNuYXBzaG90cyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRMYXN0SGlzdG9yeVNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgbGFzdFNuYXBzaG90cyA9IGxhc3RTbmFwc2hvdHMgPyBbbGFzdFNuYXBzaG90c10gOiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RTbmFwc2hvdHMubWFwKHNuYXBzaG90ID0+IHNuYXBzaG90LmZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIHVuZG9MYXN0RGlzY2FyZChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCwgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0RmlsZVBhdGhzRm9yTGFzdERpc2NhcmQocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCByZXBvc2l0b3J5LnJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzKFxuICAgICAgICAoKSA9PiB0aGlzLmVuc3VyZU5vVW5zYXZlZEZpbGVzKGZpbGVQYXRocywgJ0Nhbm5vdCB1bmRvIGxhc3QgZGlzY2FyZC4nKSxcbiAgICAgICAgcGFydGlhbERpc2NhcmRGaWxlUGF0aCxcbiAgICAgICk7XG4gICAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgICBhd2FpdCB0aGlzLnByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgR2l0RXJyb3IgJiYgZS5zdGRFcnIubWF0Y2goL2ZhdGFsOiBOb3QgYSB2YWxpZCBvYmplY3QgbmFtZS8pKSB7XG4gICAgICAgIHRoaXMuY2xlYW5VcEhpc3RvcnlGb3JGaWxlUGF0aHMoZmlsZVBhdGhzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcHJvY2VlZE9yUHJvbXB0QmFzZWRPblJlc3VsdHMocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSByZXN1bHRzLmZpbHRlcigoe2NvbmZsaWN0fSkgPT4gY29uZmxpY3QpO1xuICAgIGlmIChjb25mbGljdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb2NlZWRXaXRoTGFzdERpc2NhcmRVbmRvKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnByb21wdEFib3V0Q29uZmxpY3RzKHJlc3VsdHMsIGNvbmZsaWN0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcHJvbXB0QWJvdXRDb25mbGljdHMocmVzdWx0cywgY29uZmxpY3RzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IGNvbmZsaWN0ZWRGaWxlcyA9IGNvbmZsaWN0cy5tYXAoKHtmaWxlUGF0aH0pID0+IGBcXHQke2ZpbGVQYXRofWApLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGNob2ljZSA9IHRoaXMucHJvcHMuY29uZmlybSh7XG4gICAgICBtZXNzYWdlOiAnVW5kb2luZyB3aWxsIHJlc3VsdCBpbiBjb25mbGljdHMuLi4nLFxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiBgZm9yIHRoZSBmb2xsb3dpbmcgZmlsZXM6XFxuJHtjb25mbGljdGVkRmlsZXN9XFxuYCArXG4gICAgICAgICdXb3VsZCB5b3UgbGlrZSB0byBhcHBseSB0aGUgY2hhbmdlcyB3aXRoIG1lcmdlIGNvbmZsaWN0IG1hcmtlcnMsICcgK1xuICAgICAgICAnb3Igb3BlbiB0aGUgdGV4dCB3aXRoIG1lcmdlIGNvbmZsaWN0IG1hcmtlcnMgaW4gYSBuZXcgZmlsZT8nLFxuICAgICAgYnV0dG9uczogWydNZXJnZSB3aXRoIGNvbmZsaWN0IG1hcmtlcnMnLCAnT3BlbiBpbiBuZXcgZmlsZScsICdDYW5jZWwnXSxcbiAgICB9KTtcbiAgICBpZiAoY2hvaWNlID09PSAwKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb2NlZWRXaXRoTGFzdERpc2NhcmRVbmRvKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoY2hvaWNlID09PSAxKSB7XG4gICAgICBhd2FpdCB0aGlzLm9wZW5Db25mbGljdHNJbk5ld0VkaXRvcnMoY29uZmxpY3RzLm1hcCgoe3Jlc3VsdFBhdGh9KSA9PiByZXN1bHRQYXRoKSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYW5VcEhpc3RvcnlGb3JGaWxlUGF0aHMoZmlsZVBhdGhzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5jbGVhckRpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIGNvbnN0IGZpbGVQYXRoc1N0ciA9IGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4gYFxcYCR7ZmlsZVBhdGh9XFxgYCkuam9pbignPGJyPicpO1xuICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihcbiAgICAgICdEaXNjYXJkIGhpc3RvcnkgaGFzIGV4cGlyZWQuJyxcbiAgICAgIHtcbiAgICAgICAgZGVzY3JpcHRpb246IGBDYW5ub3QgdW5kbyBkaXNjYXJkIGZvcjxicj4ke2ZpbGVQYXRoc1N0cn08YnI+U3RhbGUgZGlzY2FyZCBoaXN0b3J5IGhhcyBiZWVuIGRlbGV0ZWQuYCxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBhc3luYyBwcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gcmVzdWx0cy5tYXAoYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IHtmaWxlUGF0aCwgcmVzdWx0UGF0aCwgZGVsZXRlZCwgY29uZmxpY3QsIHRoZWlyc1NoYSwgY29tbW9uQmFzZVNoYSwgY3VycmVudFNoYX0gPSByZXN1bHQ7XG4gICAgICBjb25zdCBhYnNGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSwgZmlsZVBhdGgpO1xuICAgICAgaWYgKGRlbGV0ZWQgJiYgcmVzdWx0UGF0aCA9PT0gbnVsbCkge1xuICAgICAgICBhd2FpdCBmcy5yZW1vdmUoYWJzRmlsZVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgZnMuY29weShyZXN1bHRQYXRoLCBhYnNGaWxlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmxpY3QpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgoZmlsZVBhdGgsIGNvbW1vbkJhc2VTaGEsIGN1cnJlbnRTaGEsIHRoZWlyc1NoYSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5wb3BEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5Db25mbGljdHNJbk5ld0VkaXRvcnMocmVzdWx0UGF0aHMpIHtcbiAgICBjb25zdCBlZGl0b3JQcm9taXNlcyA9IHJlc3VsdFBhdGhzLm1hcChyZXN1bHRQYXRoID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKHJlc3VsdFBhdGgpO1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChlZGl0b3JQcm9taXNlcyk7XG4gIH1cblxuICByZXBvcnRSZWxheUVycm9yID0gKGZyaWVuZGx5TWVzc2FnZSwgZXJyKSA9PiB7XG4gICAgY29uc3Qgb3B0cyA9IHtkaXNtaXNzYWJsZTogdHJ1ZX07XG5cbiAgICBpZiAoZXJyLm5ldHdvcmspIHtcbiAgICAgIC8vIE9mZmxpbmVcbiAgICAgIG9wdHMuaWNvbiA9ICdhbGlnbm1lbnQtdW5hbGlnbic7XG4gICAgICBvcHRzLmRlc2NyaXB0aW9uID0gXCJJdCBsb29rcyBsaWtlIHlvdSdyZSBvZmZsaW5lIHJpZ2h0IG5vdy5cIjtcbiAgICB9IGVsc2UgaWYgKGVyci5yZXNwb25zZVRleHQpIHtcbiAgICAgIC8vIFRyYW5zaWVudCBlcnJvciBsaWtlIGEgNTAwIGZyb20gdGhlIEFQSVxuICAgICAgb3B0cy5kZXNjcmlwdGlvbiA9ICdUaGUgR2l0SHViIEFQSSByZXBvcnRlZCBhIHByb2JsZW0uJztcbiAgICAgIG9wdHMuZGV0YWlsID0gZXJyLnJlc3BvbnNlVGV4dDtcbiAgICB9IGVsc2UgaWYgKGVyci5lcnJvcnMpIHtcbiAgICAgIC8vIEdyYXBoUUwgZXJyb3JzXG4gICAgICBvcHRzLmRldGFpbCA9IGVyci5lcnJvcnMubWFwKGUgPT4gZS5tZXNzYWdlKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy5kZXRhaWwgPSBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKGZyaWVuZGx5TWVzc2FnZSwgb3B0cyk7XG4gIH1cblxuICAvKlxuICAgKiBBc3luY2hyb25vdXNseSBjb3VudCB0aGUgY29uZmxpY3QgbWFya2VycyBwcmVzZW50IGluIGEgZmlsZSBzcGVjaWZpZWQgYnkgZnVsbCBwYXRoLlxuICAgKi9cbiAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmdWxsUGF0aCkge1xuICAgIGNvbnN0IHJlYWRTdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGZ1bGxQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIENvbmZsaWN0LmNvdW50RnJvbVN0cmVhbShyZWFkU3RyZWFtKS50aGVuKGNvdW50ID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3MucmVwb3J0TWFya2VyQ291bnQoZnVsbFBhdGgsIGNvdW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFRhYlRyYWNrZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lLCB7Z2V0V29ya3NwYWNlLCB1cml9KSB7XG4gICAgYXV0b2JpbmQodGhpcywgJ3RvZ2dsZScsICd0b2dnbGVGb2N1cycsICdlbnN1cmVWaXNpYmxlJyk7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIHRoaXMuZ2V0V29ya3NwYWNlID0gZ2V0V29ya3NwYWNlO1xuICAgIHRoaXMudXJpID0gdXJpO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlKCkge1xuICAgIGNvbnN0IGZvY3VzVG9SZXN0b3JlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBsZXQgc2hvdWxkUmVzdG9yZUZvY3VzID0gZmFsc2U7XG5cbiAgICAvLyBSZW5kZXJlZCA9PiB0aGUgZG9jayBpdGVtIGlzIGJlaW5nIHJlbmRlcmVkLCB3aGV0aGVyIG9yIG5vdCB0aGUgZG9jayBpcyB2aXNpYmxlIG9yIHRoZSBpdGVtXG4gICAgLy8gICBpcyB2aXNpYmxlIHdpdGhpbiBpdHMgZG9jay5cbiAgICAvLyBWaXNpYmxlID0+IHRoZSBpdGVtIGlzIGFjdGl2ZSBhbmQgdGhlIGRvY2sgaXRlbSBpcyBhY3RpdmUgd2l0aGluIGl0cyBkb2NrLlxuICAgIGNvbnN0IHdhc1JlbmRlcmVkID0gdGhpcy5pc1JlbmRlcmVkKCk7XG4gICAgY29uc3Qgd2FzVmlzaWJsZSA9IHRoaXMuaXNWaXNpYmxlKCk7XG5cbiAgICBpZiAoIXdhc1JlbmRlcmVkIHx8ICF3YXNWaXNpYmxlKSB7XG4gICAgICAvLyBOb3QgcmVuZGVyZWQsIG9yIHJlbmRlcmVkIGJ1dCBub3QgYW4gYWN0aXZlIGl0ZW0gaW4gYSB2aXNpYmxlIGRvY2suXG4gICAgICBhd2FpdCB0aGlzLnJldmVhbCgpO1xuICAgICAgc2hvdWxkUmVzdG9yZUZvY3VzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVuZGVyZWQgYW5kIGFuIGFjdGl2ZSBpdGVtIHdpdGhpbiBhIHZpc2libGUgZG9jay5cbiAgICAgIGF3YWl0IHRoaXMuaGlkZSgpO1xuICAgICAgc2hvdWxkUmVzdG9yZUZvY3VzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFJlc3RvcmVGb2N1cykge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBmb2N1c1RvUmVzdG9yZS5mb2N1cygpKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB0b2dnbGVGb2N1cygpIHtcbiAgICBjb25zdCBoYWRGb2N1cyA9IHRoaXMuaGFzRm9jdXMoKTtcbiAgICBhd2FpdCB0aGlzLmVuc3VyZVZpc2libGUoKTtcblxuICAgIGlmIChoYWRGb2N1cykge1xuICAgICAgbGV0IHdvcmtzcGFjZSA9IHRoaXMuZ2V0V29ya3NwYWNlKCk7XG4gICAgICBpZiAod29ya3NwYWNlLmdldENlbnRlcikge1xuICAgICAgICB3b3Jrc3BhY2UgPSB3b3Jrc3BhY2UuZ2V0Q2VudGVyKCk7XG4gICAgICB9XG4gICAgICB3b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBlbnN1cmVWaXNpYmxlKCkge1xuICAgIGlmICghdGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgYXdhaXQgdGhpcy5yZXZlYWwoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBlbnN1cmVSZW5kZXJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRXb3Jrc3BhY2UoKS5vcGVuKHRoaXMudXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWUsIGFjdGl2YXRlSXRlbTogZmFsc2UsIGFjdGl2YXRlUGFuZTogZmFsc2V9KTtcbiAgfVxuXG4gIHJldmVhbCgpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKGAke3RoaXMubmFtZX0tdGFiLW9wZW5gKTtcbiAgICByZXR1cm4gdGhpcy5nZXRXb3Jrc3BhY2UoKS5vcGVuKHRoaXMudXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWUsIGFjdGl2YXRlSXRlbTogdHJ1ZSwgYWN0aXZhdGVQYW5lOiB0cnVlfSk7XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGluY3JlbWVudENvdW50ZXIoYCR7dGhpcy5uYW1lfS10YWItY2xvc2VgKTtcbiAgICByZXR1cm4gdGhpcy5nZXRXb3Jrc3BhY2UoKS5oaWRlKHRoaXMudXJpKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuZ2V0Q29tcG9uZW50KCkucmVzdG9yZUZvY3VzKCk7XG4gIH1cblxuICBnZXRJdGVtKCkge1xuICAgIGNvbnN0IHBhbmUgPSB0aGlzLmdldFdvcmtzcGFjZSgpLnBhbmVGb3JVUkkodGhpcy51cmkpO1xuICAgIGlmICghcGFuZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcGFuZUl0ZW0gPSBwYW5lLml0ZW1Gb3JVUkkodGhpcy51cmkpO1xuICAgIGlmICghcGFuZUl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwYW5lSXRlbTtcbiAgfVxuXG4gIGdldENvbXBvbmVudCgpIHtcbiAgICBjb25zdCBwYW5lSXRlbSA9IHRoaXMuZ2V0SXRlbSgpO1xuICAgIGlmICghcGFuZUl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKCh0eXBlb2YgcGFuZUl0ZW0uZ2V0UmVhbEl0ZW0pICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhbmVJdGVtLmdldFJlYWxJdGVtKCk7XG4gIH1cblxuICBnZXRET01FbGVtZW50KCkge1xuICAgIGNvbnN0IHBhbmVJdGVtID0gdGhpcy5nZXRJdGVtKCk7XG4gICAgaWYgKCFwYW5lSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICgoKHR5cGVvZiBwYW5lSXRlbS5nZXRFbGVtZW50KSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwYW5lSXRlbS5nZXRFbGVtZW50KCk7XG4gIH1cblxuICBpc1JlbmRlcmVkKCkge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0V29ya3NwYWNlKCkucGFuZUZvclVSSSh0aGlzLnVyaSk7XG4gIH1cblxuICBpc1Zpc2libGUoKSB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gdGhpcy5nZXRXb3Jrc3BhY2UoKTtcbiAgICByZXR1cm4gd29ya3NwYWNlLmdldFBhbmVDb250YWluZXJzKClcbiAgICAgIC5maWx0ZXIoY29udGFpbmVyID0+IGNvbnRhaW5lciA9PT0gd29ya3NwYWNlLmdldENlbnRlcigpIHx8IGNvbnRhaW5lci5pc1Zpc2libGUoKSlcbiAgICAgIC5zb21lKGNvbnRhaW5lciA9PiBjb250YWluZXIuZ2V0UGFuZXMoKS5zb21lKHBhbmUgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gcGFuZS5nZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgIHJldHVybiBpdGVtICYmIGl0ZW0uZ2V0VVJJICYmIGl0ZW0uZ2V0VVJJKCkgPT09IHRoaXMudXJpO1xuICAgICAgfSkpO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuZ2V0RE9NRWxlbWVudCgpO1xuICAgIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsUUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsS0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBR0EsSUFBQUUsTUFBQSxHQUFBQyx1QkFBQSxDQUFBSCxPQUFBO0FBQ0EsSUFBQUksVUFBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssU0FBQSxHQUFBTCxPQUFBO0FBQ0EsSUFBQU0sU0FBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQU8sVUFBQSxHQUFBUixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVEsU0FBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVMsbUJBQUEsR0FBQVQsT0FBQTtBQUNBLElBQUFVLGlCQUFBLEdBQUFWLE9BQUE7QUFDQSxJQUFBVyxhQUFBLEdBQUFYLE9BQUE7QUFDQSxJQUFBWSxhQUFBLEdBQUFiLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYSxTQUFBLEdBQUFWLHVCQUFBLENBQUFILE9BQUE7QUFDQSxJQUFBYyxnQkFBQSxHQUFBZixz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