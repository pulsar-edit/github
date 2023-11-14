"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _path = _interopRequireDefault(require("path"));
var _electron = require("electron");
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
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
    const extensionFolder = _path.default.resolve(_electron.remote.app.getPath('userData'), `extensions/${id}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZnNFeHRyYSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3BhdGgiLCJfZWxlY3Ryb24iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9wcm9wVHlwZXMiLCJfZXZlbnRLaXQiLCJfeXViaWtpcmkiLCJfc3RhdHVzQmFyIiwiX3BhbmVJdGVtIiwiX29wZW5Jc3N1ZWlzaERpYWxvZyIsIl9vcGVuQ29tbWl0RGlhbG9nIiwiX2NyZWF0ZURpYWxvZyIsIl9vYnNlcnZlTW9kZWwiLCJfY29tbWFuZHMiLCJfY2hhbmdlZEZpbGVJdGVtIiwiX2lzc3VlaXNoRGV0YWlsSXRlbSIsIl9jb21taXREZXRhaWxJdGVtIiwiX2NvbW1pdFByZXZpZXdJdGVtIiwiX2dpdFRhYkl0ZW0iLCJfZ2l0aHViVGFiSXRlbSIsIl9yZXZpZXdzSXRlbSIsIl9jb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIiLCJfZGlhbG9nc0NvbnRyb2xsZXIiLCJfc3RhdHVzQmFyVGlsZUNvbnRyb2xsZXIiLCJfcmVwb3NpdG9yeUNvbmZsaWN0Q29udHJvbGxlciIsIl9yZWxheU5ldHdvcmtMYXllck1hbmFnZXIiLCJfZ2l0Q2FjaGVWaWV3IiwiX2dpdFRpbWluZ3NWaWV3IiwiX2NvbmZsaWN0IiwiX2VuZHBvaW50IiwiX3N3aXRjaGJvYXJkIiwiX3Byb3BUeXBlczIiLCJfaGVscGVycyIsIl9naXRTaGVsbE91dFN0cmF0ZWd5IiwiX3JlcG9ydGVyUHJveHkiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJuIiwiX19wcm90b19fIiwiYSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwidSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImkiLCJzZXQiLCJvYmoiLCJfZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiUm9vdENvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwicmVwb3NpdG9yeSIsInl1YmlraXJpIiwiaXNQdWJsaXNoYWJsZSIsInJlbW90ZXMiLCJnZXRSZW1vdGVzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRTdGF0ZSIsImRpYWxvZ1JlcXVlc3QiLCJkaWFsb2dSZXF1ZXN0cyIsIm51bGwiLCJkaXJQYXRoIiwiYWN0aXZlRWRpdG9yIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsInByb2plY3RQYXRoIiwicHJvamVjdCIsInJlbGF0aXZpemVQYXRoIiwiZ2V0UGF0aCIsImRpcmVjdG9yaWVzIiwiZ2V0RGlyZWN0b3JpZXMiLCJ3aXRoUmVwb3NpdG9yaWVzIiwiYWxsIiwibWFwIiwiZCIsInJlcG9zaXRvcnlGb3JEaXJlY3RvcnkiLCJmaXJzdFVuaW5pdGlhbGl6ZWQiLCJmaW5kIiwiY29uZmlnIiwiaW5pdCIsIm9uUHJvZ3Jlc3NpbmdBY2NlcHQiLCJjaG9zZW5QYXRoIiwiaW5pdGlhbGl6ZSIsImNsb3NlRGlhbG9nIiwib25DYW5jZWwiLCJvcHRzIiwiY2xvbmUiLCJ1cmwiLCJxdWVyeSIsInJlamVjdCIsImNyZWRlbnRpYWwiLCJyZXN1bHQiLCJpc3N1ZWlzaCIsIm9wZW5Jc3N1ZWlzaEl0ZW0iLCJ3b3JrZGlyIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJjb21taXQiLCJyZWYiLCJvcGVuQ29tbWl0RGV0YWlsSXRlbSIsImNyZWF0ZSIsImRvdGNvbSIsImdldEVuZHBvaW50IiwicmVsYXlFbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsImNyZWF0ZVJlcG9zaXRvcnkiLCJwdWJsaXNoIiwibG9jYWxEaXIiLCJwdWJsaXNoUmVwb3NpdG9yeSIsInRvZ2dsZSIsIkNvbW1pdFByZXZpZXdJdGVtIiwiYnVpbGRVUkkiLCJmaWxlUGF0aCIsInN0YWdpbmdTdGF0dXMiLCJnaXRUYWIiLCJnaXRUYWJUcmFja2VyIiwiZ2V0Q29tcG9uZW50IiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsImZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbiIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiZnJpZW5kbHlNZXNzYWdlIiwiZXJyIiwiZGlzbWlzc2FibGUiLCJuZXR3b3JrIiwiaWNvbiIsImRlc2NyaXB0aW9uIiwicmVzcG9uc2VUZXh0IiwiZGV0YWlsIiwiZXJyb3JzIiwibWVzc2FnZSIsImpvaW4iLCJzdGFjayIsIm5vdGlmaWNhdGlvbk1hbmFnZXIiLCJhZGRFcnJvciIsImF1dG9iaW5kIiwic3RhdGUiLCJUYWJUcmFja2VyIiwidXJpIiwiR2l0VGFiSXRlbSIsImdldFdvcmtzcGFjZSIsImdpdGh1YlRhYlRyYWNrZXIiLCJHaXRIdWJUYWJJdGVtIiwic3Vic2NyaXB0aW9uIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsIm9uUHVsbEVycm9yIiwiZW5zdXJlVmlzaWJsZSIsImNvbW1hbmRzIiwib25EaWREaXNwYXRjaCIsImV2ZW50IiwidHlwZSIsInN0YXJ0c1dpdGgiLCJjb250ZXh0Q29tbWFuZCIsImFkZEV2ZW50IiwicGFja2FnZSIsImNvbW1hbmQiLCJjb21wb25lbnREaWRNb3VudCIsIm9wZW5UYWJzIiwicmVuZGVyIiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwicmVuZGVyQ29tbWFuZHMiLCJyZW5kZXJTdGF0dXNCYXJUaWxlIiwicmVuZGVyUGFuZUl0ZW1zIiwicmVuZGVyRGlhbG9ncyIsInJlbmRlckNvbmZsaWN0UmVzb2x2ZXIiLCJyZW5kZXJDb21tZW50RGVjb3JhdGlvbnMiLCJkZXZNb2RlIiwiZ2xvYmFsIiwiYXRvbSIsImluRGV2TW9kZSIsInJlZ2lzdHJ5IiwidGFyZ2V0IiwiQ29tbWFuZCIsImNhbGxiYWNrIiwiaW5zdGFsbFJlYWN0RGV2VG9vbHMiLCJ0b2dnbGVDb21taXRQcmV2aWV3SXRlbSIsImNsZWFyR2l0aHViVG9rZW4iLCJzaG93V2F0ZXJmYWxsRGlhZ25vc3RpY3MiLCJzaG93Q2FjaGVEaWFnbm9zdGljcyIsInRvZ2dsZUZvY3VzIiwib3BlbkluaXRpYWxpemVEaWFsb2ciLCJvcGVuQ2xvbmVEaWFsb2ciLCJvcGVuSXNzdWVpc2hEaWFsb2ciLCJvcGVuQ29tbWl0RGlhbG9nIiwib3BlbkNyZWF0ZURpYWxvZyIsInZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSIsInZpZXdTdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUiLCJkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zIiwiZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zIiwibW9kZWwiLCJmZXRjaERhdGEiLCJkYXRhIiwiZmlsdGVyIiwiaXNHaXRodWJSZXBvIiwiaXNFbXB0eSIsIm9wZW5QdWJsaXNoRGlhbG9nIiwic3RhdHVzQmFyIiwib25Db25zdW1lU3RhdHVzQmFyIiwic2IiLCJjbGFzc05hbWUiLCJwaXBlbGluZU1hbmFnZXIiLCJ0b29sdGlwcyIsImNvbmZpcm0iLCJ0b2dnbGVHaXRUYWIiLCJ0b2dnbGVHaXRodWJUYWIiLCJsb2dpbk1vZGVsIiwicmVxdWVzdCIsImN1cnJlbnRXaW5kb3ciLCJsb2NhbFJlcG9zaXRvcnkiLCJyZXBvcnRSZWxheUVycm9yIiwicmVzb2x1dGlvblByb2dyZXNzIiwicmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyIsIndvcmtkaXJDb250ZXh0UG9vbCIsImdldEN1cnJlbnRXb3JrRGlycyIsImJpbmQiLCJvbkRpZENoYW5nZVdvcmtEaXJzIiwib25EaWRDaGFuZ2VQb29sQ29udGV4dHMiLCJ1cmlQYXR0ZXJuIiwiaXRlbUhvbGRlciIsInNldHRlciIsImdyYW1tYXJzIiwiZW5zdXJlR2l0VGFiIiwib3BlbkZpbGVzIiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJ1bmRvTGFzdERpc2NhcmQiLCJjdXJyZW50V29ya0RpciIsImNvbnRleHRMb2NrZWQiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwic2V0Q29udGV4dExvY2siLCJvcGVuR2l0VGFiIiwiQ2hhbmdlZEZpbGVJdGVtIiwicGFyYW1zIiwicmVsUGF0aCIsInBhdGgiLCJ3b3JraW5nRGlyZWN0b3J5Iiwia2V5bWFwcyIsImRpc2NhcmRMaW5lcyIsInN1cmZhY2VGaWxlQXRQYXRoIiwic3VyZmFjZUZyb21GaWxlQXRQYXRoIiwic3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbiIsIkNvbW1pdERldGFpbEl0ZW0iLCJzaGEiLCJzdXJmYWNlQ29tbWl0Iiwic3VyZmFjZVRvUmVjZW50Q29tbWl0IiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiZGVzZXJpYWxpemVkIiwiaG9zdCIsIm93bmVyIiwicmVwbyIsImlzc3VlaXNoTnVtYmVyIiwicGFyc2VJbnQiLCJpbml0U2VsZWN0ZWRUYWIiLCJSZXZpZXdzSXRlbSIsIm51bWJlciIsIkdpdFRpbWluZ3NWaWV3IiwiR2l0Q2FjaGVWaWV3Iiwic3RhcnRPcGVuIiwiZW5zdXJlUmVuZGVyZWQiLCJzdGFydFJldmVhbGVkIiwiZG9ja3MiLCJTZXQiLCJwYW5lQ29udGFpbmVyRm9yVVJJIiwiY29udGFpbmVyIiwic2hvdyIsImRvY2siLCJkZXZUb29sc05hbWUiLCJkZXZUb29scyIsImluc3RhbGxFeHRlbnNpb24iLCJSRUFDVF9ERVZFTE9QRVJfVE9PTFMiLCJpZCIsImFkZFN1Y2Nlc3MiLCJjcm9zc1VuemlwTmFtZSIsInVuemlwIiwiZXh0ZW5zaW9uRm9sZGVyIiwicmVtb3RlIiwiYXBwIiwiZXh0ZW5zaW9uRmlsZSIsImZzIiwiZW5zdXJlRGlyIiwiZGlybmFtZSIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5IiwiQnVmZmVyIiwiZnJvbSIsImFycmF5QnVmZmVyIiwid3JpdGVGaWxlIiwiZXhpc3RzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwiZGlzYWJsZUdpdEluZm9UaWxlIiwicmVtb3ZlVG9rZW4iLCJvcGVuIiwib25seVN0YWdlZCIsInF1aWV0bHlTZWxlY3RJdGVtIiwidmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZSIsImVkaXRvciIsImFic0ZpbGVQYXRoIiwicmVhbHBhdGgiLCJyZXBvUGF0aCIsIm5vdGlmaWNhdGlvbiIsImFkZEluZm8iLCJidXR0b25zIiwidGV4dCIsIm9uRGlkQ2xpY2siLCJkaXNtaXNzIiwiY3JlYXRlZFBhdGgiLCJpbml0aWFsaXplUmVwbyIsInNsaWNlIiwibGVuZ3RoIiwic3BsaXREaXJlY3Rpb24iLCJwYW5lIiwiZ2V0QWN0aXZlUGFuZSIsInNwbGl0UmlnaHQiLCJzcGxpdERvd24iLCJsaW5lTnVtIiwiZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJyb3ciLCJpdGVtIiwicGVuZGluZyIsImFjdGl2YXRlUGFuZSIsImFjdGl2YXRlSXRlbSIsImdldFJlYWxJdGVtUHJvbWlzZSIsImdldEZpbGVQYXRjaExvYWRlZFByb21pc2UiLCJnb1RvRGlmZkxpbmUiLCJmb2N1cyIsIkVycm9yIiwiZmlsZVBhdGhzIiwiYWJzb2x1dGVQYXRoIiwiZ2V0VW5zYXZlZEZpbGVzIiwid29ya2RpclBhdGgiLCJpc01vZGlmaWVkQnlQYXRoIiwiTWFwIiwiZ2V0VGV4dEVkaXRvcnMiLCJmb3JFYWNoIiwiaXNNb2RpZmllZCIsImVuc3VyZU5vVW5zYXZlZEZpbGVzIiwidW5zYXZlZEZpbGVzIiwiZGVzdHJ1Y3RpdmVBY3Rpb24iLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJtdWx0aUZpbGVQYXRjaCIsImxpbmVzIiwiZ2V0RmlsZVBhdGNoZXMiLCJkaXNjYXJkRmlsZVBhdGNoIiwiZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMiLCJhcHBseVBhdGNoVG9Xb3JrZGlyIiwiZ2V0RmlsZVBhdGhzRm9yTGFzdERpc2NhcmQiLCJwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoIiwibGFzdFNuYXBzaG90cyIsImdldExhc3RIaXN0b3J5U25hcHNob3RzIiwic25hcHNob3QiLCJyZXN1bHRzIiwicmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMiLCJwcm9jZWVkT3JQcm9tcHRCYXNlZE9uUmVzdWx0cyIsIkdpdEVycm9yIiwic3RkRXJyIiwibWF0Y2giLCJjbGVhblVwSGlzdG9yeUZvckZpbGVQYXRocyIsImNvbnNvbGUiLCJlcnJvciIsImNvbmZsaWN0cyIsImNvbmZsaWN0IiwicHJvY2VlZFdpdGhMYXN0RGlzY2FyZFVuZG8iLCJwcm9tcHRBYm91dENvbmZsaWN0cyIsImNvbmZsaWN0ZWRGaWxlcyIsImNob2ljZSIsImRldGFpbGVkTWVzc2FnZSIsIm9wZW5Db25mbGljdHNJbk5ld0VkaXRvcnMiLCJyZXN1bHRQYXRoIiwiY2xlYXJEaXNjYXJkSGlzdG9yeSIsImZpbGVQYXRoc1N0ciIsInByb21pc2VzIiwiZGVsZXRlZCIsInRoZWlyc1NoYSIsImNvbW1vbkJhc2VTaGEiLCJjdXJyZW50U2hhIiwicmVtb3ZlIiwiY29weSIsIndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgiLCJwb3BEaXNjYXJkSGlzdG9yeSIsInJlc3VsdFBhdGhzIiwiZWRpdG9yUHJvbWlzZXMiLCJmdWxsUGF0aCIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwiZW5jb2RpbmciLCJDb25mbGljdCIsImNvdW50RnJvbVN0cmVhbSIsInRoZW4iLCJjb3VudCIsInJlcG9ydE1hcmtlckNvdW50IiwiZXhwb3J0cyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJkZXNlcmlhbGl6ZXJzIiwiZnVuYyIsIldvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlIiwic3dpdGNoYm9hcmQiLCJpbnN0YW5jZU9mIiwiU3dpdGNoYm9hcmQiLCJzdHJpbmciLCJib29sIiwibmFtZSIsImZvY3VzVG9SZXN0b3JlIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50Iiwic2hvdWxkUmVzdG9yZUZvY3VzIiwid2FzUmVuZGVyZWQiLCJpc1JlbmRlcmVkIiwid2FzVmlzaWJsZSIsImlzVmlzaWJsZSIsInJldmVhbCIsImhpZGUiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJoYWRGb2N1cyIsImhhc0ZvY3VzIiwiZ2V0Q2VudGVyIiwiYWN0aXZhdGUiLCJzZWFyY2hBbGxQYW5lcyIsImluY3JlbWVudENvdW50ZXIiLCJyZXN0b3JlRm9jdXMiLCJnZXRJdGVtIiwicGFuZUZvclVSSSIsInBhbmVJdGVtIiwiaXRlbUZvclVSSSIsImdldFJlYWxJdGVtIiwiZ2V0RE9NRWxlbWVudCIsImdldEVsZW1lbnQiLCJnZXRQYW5lQ29udGFpbmVycyIsInNvbWUiLCJnZXRQYW5lcyIsImdldEFjdGl2ZUl0ZW0iLCJnZXRVUkkiLCJyb290IiwiY29udGFpbnMiXSwic291cmNlcyI6WyJyb290LWNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuXG5pbXBvcnQgU3RhdHVzQmFyIGZyb20gJy4uL2F0b20vc3RhdHVzLWJhcic7XG5pbXBvcnQgUGFuZUl0ZW0gZnJvbSAnLi4vYXRvbS9wYW5lLWl0ZW0nO1xuaW1wb3J0IHtvcGVuSXNzdWVpc2hJdGVtfSBmcm9tICcuLi92aWV3cy9vcGVuLWlzc3VlaXNoLWRpYWxvZyc7XG5pbXBvcnQge29wZW5Db21taXREZXRhaWxJdGVtfSBmcm9tICcuLi92aWV3cy9vcGVuLWNvbW1pdC1kaWFsb2cnO1xuaW1wb3J0IHtjcmVhdGVSZXBvc2l0b3J5LCBwdWJsaXNoUmVwb3NpdG9yeX0gZnJvbSAnLi4vdmlld3MvY3JlYXRlLWRpYWxvZyc7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgQ2hhbmdlZEZpbGVJdGVtIGZyb20gJy4uL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCBDb21taXRQcmV2aWV3SXRlbSBmcm9tICcuLi9pdGVtcy9jb21taXQtcHJldmlldy1pdGVtJztcbmltcG9ydCBHaXRUYWJJdGVtIGZyb20gJy4uL2l0ZW1zL2dpdC10YWItaXRlbSc7XG5pbXBvcnQgR2l0SHViVGFiSXRlbSBmcm9tICcuLi9pdGVtcy9naXRodWItdGFiLWl0ZW0nO1xuaW1wb3J0IFJldmlld3NJdGVtIGZyb20gJy4uL2l0ZW1zL3Jldmlld3MtaXRlbSc7XG5pbXBvcnQgQ29tbWVudERlY29yYXRpb25zQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvY29tbWVudC1kZWNvcmF0aW9ucy1jb250YWluZXInO1xuaW1wb3J0IERpYWxvZ3NDb250cm9sbGVyLCB7ZGlhbG9nUmVxdWVzdHN9IGZyb20gJy4vZGlhbG9ncy1jb250cm9sbGVyJztcbmltcG9ydCBTdGF0dXNCYXJUaWxlQ29udHJvbGxlciBmcm9tICcuL3N0YXR1cy1iYXItdGlsZS1jb250cm9sbGVyJztcbmltcG9ydCBSZXBvc2l0b3J5Q29uZmxpY3RDb250cm9sbGVyIGZyb20gJy4vcmVwb3NpdG9yeS1jb25mbGljdC1jb250cm9sbGVyJztcbmltcG9ydCBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIgZnJvbSAnLi4vcmVsYXktbmV0d29yay1sYXllci1tYW5hZ2VyJztcbmltcG9ydCBHaXRDYWNoZVZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0LWNhY2hlLXZpZXcnO1xuaW1wb3J0IEdpdFRpbWluZ3NWaWV3IGZyb20gJy4uL3ZpZXdzL2dpdC10aW1pbmdzLXZpZXcnO1xuaW1wb3J0IENvbmZsaWN0IGZyb20gJy4uL21vZGVscy9jb25mbGljdHMvY29uZmxpY3QnO1xuaW1wb3J0IHtnZXRFbmRwb2ludH0gZnJvbSAnLi4vbW9kZWxzL2VuZHBvaW50JztcbmltcG9ydCBTd2l0Y2hib2FyZCBmcm9tICcuLi9zd2l0Y2hib2FyZCc7XG5pbXBvcnQge1dvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7ZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcywgZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zLCBhdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge0dpdEVycm9yfSBmcm9tICcuLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcbmltcG9ydCB7aW5jcmVtZW50Q291bnRlciwgYWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9vdENvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIEF0b20gZW52aW9ybm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGRlc2VyaWFsaXplcnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBub3RpZmljYXRpb25NYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZ3JhbW1hcnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwcm9qZWN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50V2luZG93OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBNb2RlbHNcbiAgICBsb2dpbk1vZGVsOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgd29ya2RpckNvbnRleHRQb29sOiBXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICByZXNvbHV0aW9uUHJvZ3Jlc3M6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzdGF0dXNCYXI6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgc3dpdGNoYm9hcmQ6IFByb3BUeXBlcy5pbnN0YW5jZU9mKFN3aXRjaGJvYXJkKSxcbiAgICBwaXBlbGluZU1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QsXG5cbiAgICBjdXJyZW50V29ya0RpcjogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8vIEdpdCBhY3Rpb25zXG4gICAgaW5pdGlhbGl6ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjbG9uZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIENvbnRyb2xcbiAgICBjb250ZXh0TG9ja2VkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2V0Q29udGV4dExvY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3RhcnRPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzdGFydFJldmVhbGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc3dpdGNoYm9hcmQ6IG5ldyBTd2l0Y2hib2FyZCgpLFxuICAgIHN0YXJ0T3BlbjogZmFsc2UsXG4gICAgc3RhcnRSZXZlYWxlZDogZmFsc2UsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZChcbiAgICAgIHRoaXMsXG4gICAgICAnaW5zdGFsbFJlYWN0RGV2VG9vbHMnLCAnY2xlYXJHaXRodWJUb2tlbicsXG4gICAgICAnc2hvd1dhdGVyZmFsbERpYWdub3N0aWNzJywgJ3Nob3dDYWNoZURpYWdub3N0aWNzJyxcbiAgICAgICdkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zJywgJ2Rlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcycsXG4gICAgICAncXVpZXRseVNlbGVjdEl0ZW0nLCAndmlld1Vuc3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlJyxcbiAgICAgICd2aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlJywgJ29wZW5GaWxlcycsICdnZXRVbnNhdmVkRmlsZXMnLCAnZW5zdXJlTm9VbnNhdmVkRmlsZXMnLFxuICAgICAgJ2Rpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzJywgJ2Rpc2NhcmRMaW5lcycsICd1bmRvTGFzdERpc2NhcmQnLCAncmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcycsXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkaWFsb2dSZXF1ZXN0OiBkaWFsb2dSZXF1ZXN0cy5udWxsLFxuICAgIH07XG5cbiAgICB0aGlzLmdpdFRhYlRyYWNrZXIgPSBuZXcgVGFiVHJhY2tlcignZ2l0Jywge1xuICAgICAgdXJpOiBHaXRUYWJJdGVtLmJ1aWxkVVJJKCksXG4gICAgICBnZXRXb3Jrc3BhY2U6ICgpID0+IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5naXRodWJUYWJUcmFja2VyID0gbmV3IFRhYlRyYWNrZXIoJ2dpdGh1YicsIHtcbiAgICAgIHVyaTogR2l0SHViVGFiSXRlbS5idWlsZFVSSSgpLFxuICAgICAgZ2V0V29ya3NwYWNlOiAoKSA9PiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLnByb3BzLnJlcG9zaXRvcnkub25QdWxsRXJyb3IodGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVZpc2libGUpLFxuICAgICk7XG5cbiAgICB0aGlzLnByb3BzLmNvbW1hbmRzLm9uRGlkRGlzcGF0Y2goZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgJiYgZXZlbnQudHlwZS5zdGFydHNXaXRoKCdnaXRodWI6JylcbiAgICAgICAgJiYgZXZlbnQuZGV0YWlsICYmIGV2ZW50LmRldGFpbFswXSAmJiBldmVudC5kZXRhaWxbMF0uY29udGV4dENvbW1hbmQpIHtcbiAgICAgICAgYWRkRXZlbnQoJ2NvbnRleHQtbWVudS1hY3Rpb24nLCB7XG4gICAgICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICAgICAgY29tbWFuZDogZXZlbnQudHlwZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm9wZW5UYWJzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAge3RoaXMucmVuZGVyU3RhdHVzQmFyVGlsZSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJQYW5lSXRlbXMoKX1cbiAgICAgICAge3RoaXMucmVuZGVyRGlhbG9ncygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb25mbGljdFJlc29sdmVyKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1lbnREZWNvcmF0aW9ucygpfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgY29uc3QgZGV2TW9kZSA9IGdsb2JhbC5hdG9tICYmIGdsb2JhbC5hdG9tLmluRGV2TW9kZSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgIHtkZXZNb2RlICYmIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6aW5zdGFsbC1yZWFjdC1kZXYtdG9vbHNcIiBjYWxsYmFjaz17dGhpcy5pbnN0YWxsUmVhY3REZXZUb29sc30gLz59XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtY29tbWl0LXByZXZpZXdcIiBjYWxsYmFjaz17dGhpcy50b2dnbGVDb21taXRQcmV2aWV3SXRlbX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmxvZ291dFwiIGNhbGxiYWNrPXt0aGlzLmNsZWFyR2l0aHViVG9rZW59IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzaG93LXdhdGVyZmFsbC1kaWFnbm9zdGljc1wiIGNhbGxiYWNrPXt0aGlzLnNob3dXYXRlcmZhbGxEaWFnbm9zdGljc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNob3ctY2FjaGUtZGlhZ25vc3RpY3NcIiBjYWxsYmFjaz17dGhpcy5zaG93Q2FjaGVEaWFnbm9zdGljc30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXQtdGFiXCIgY2FsbGJhY2s9e3RoaXMuZ2l0VGFiVHJhY2tlci50b2dnbGV9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZ2l0LXRhYi1mb2N1c1wiIGNhbGxiYWNrPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlRm9jdXN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZ2l0aHViLXRhYlwiIGNhbGxiYWNrPXt0aGlzLmdpdGh1YlRhYlRyYWNrZXIudG9nZ2xlfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdGh1Yi10YWItZm9jdXNcIiBjYWxsYmFjaz17dGhpcy5naXRodWJUYWJUcmFja2VyLnRvZ2dsZUZvY3VzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6aW5pdGlhbGl6ZVwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5Jbml0aWFsaXplRGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpjbG9uZVwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5DbG9uZURpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6b3Blbi1pc3N1ZS1vci1wdWxsLXJlcXVlc3RcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuSXNzdWVpc2hEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOm9wZW4tY29tbWl0XCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkNvbW1pdERpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y3JlYXRlLXJlcG9zaXRvcnlcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuQ3JlYXRlRGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6dmlldy11bnN0YWdlZC1jaGFuZ2VzLWZvci1jdXJyZW50LWZpbGVcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudmlld1Vuc3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6dmlldy1zdGFnZWQtY2hhbmdlcy1mb3ItY3VycmVudC1maWxlXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLnZpZXdTdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1YjpjbG9zZS1hbGwtZGlmZi12aWV3c1wiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy5kZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6Y2xvc2UtZW1wdHktZGlmZi12aWV3c1wiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy5kZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hEYXRhfT5cbiAgICAgICAgICB7ZGF0YSA9PiB7XG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEuaXNQdWJsaXNoYWJsZSB8fCAhZGF0YS5yZW1vdGVzLmZpbHRlcihyID0+IHIuaXNHaXRodWJSZXBvKCkpLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXdvcmtzcGFjZVwiPlxuICAgICAgICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOnB1Ymxpc2gtcmVwb3NpdG9yeVwiXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuUHVibGlzaERpYWxvZyh0aGlzLnByb3BzLnJlcG9zaXRvcnkpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH19XG4gICAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU3RhdHVzQmFyVGlsZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YXR1c0JhclxuICAgICAgICBzdGF0dXNCYXI9e3RoaXMucHJvcHMuc3RhdHVzQmFyfVxuICAgICAgICBvbkNvbnN1bWVTdGF0dXNCYXI9e3NiID0+IHRoaXMub25Db25zdW1lU3RhdHVzQmFyKHNiKX1cbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YXR1c0JhclRpbGVDb250cm9sbGVyXCI+XG4gICAgICAgIDxTdGF0dXNCYXJUaWxlQ29udHJvbGxlclxuICAgICAgICAgIHBpcGVsaW5lTWFuYWdlcj17dGhpcy5wcm9wcy5waXBlbGluZU1hbmFnZXJ9XG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICB0b2dnbGVHaXRUYWI9e3RoaXMuZ2l0VGFiVHJhY2tlci50b2dnbGV9XG4gICAgICAgICAgdG9nZ2xlR2l0aHViVGFiPXt0aGlzLmdpdGh1YlRhYlRyYWNrZXIudG9nZ2xlfVxuICAgICAgICAvPlxuICAgICAgPC9TdGF0dXNCYXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRpYWxvZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dzQ29udHJvbGxlclxuICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgIHJlcXVlc3Q9e3RoaXMuc3RhdGUuZGlhbG9nUmVxdWVzdH1cblxuICAgICAgICBjdXJyZW50V2luZG93PXt0aGlzLnByb3BzLmN1cnJlbnRXaW5kb3d9XG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWVudERlY29yYXRpb25zKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXJcbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGxvY2FsUmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbmZsaWN0UmVzb2x2ZXIoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8UmVwb3NpdG9yeUNvbmZsaWN0Q29udHJvbGxlclxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIHJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgIHJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJQYW5lSXRlbXMoKSB7XG4gICAgY29uc3Qge3dvcmtkaXJDb250ZXh0UG9vbH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGdldEN1cnJlbnRXb3JrRGlycyA9IHdvcmtkaXJDb250ZXh0UG9vbC5nZXRDdXJyZW50V29ya0RpcnMuYmluZCh3b3JrZGlyQ29udGV4dFBvb2wpO1xuICAgIGNvbnN0IG9uRGlkQ2hhbmdlV29ya0RpcnMgPSB3b3JrZGlyQ29udGV4dFBvb2wub25EaWRDaGFuZ2VQb29sQ29udGV4dHMuYmluZCh3b3JrZGlyQ29udGV4dFBvb2wpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtHaXRUYWJJdGVtLnVyaVBhdHRlcm59XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdC1yb290XCI+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlcn0pID0+IChcbiAgICAgICAgICAgIDxHaXRUYWJJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBncmFtbWFycz17dGhpcy5wcm9wcy5ncmFtbWFyc31cbiAgICAgICAgICAgICAgcHJvamVjdD17dGhpcy5wcm9wcy5wcm9qZWN0fVxuICAgICAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICAgICAgICBvcGVuSW5pdGlhbGl6ZURpYWxvZz17dGhpcy5vcGVuSW5pdGlhbGl6ZURpYWxvZ31cbiAgICAgICAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgICAgICAgZW5zdXJlR2l0VGFiPXt0aGlzLmdpdFRhYlRyYWNrZXIuZW5zdXJlVmlzaWJsZX1cbiAgICAgICAgICAgICAgb3BlbkZpbGVzPXt0aGlzLm9wZW5GaWxlc31cbiAgICAgICAgICAgICAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHM9e3RoaXMuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHN9XG4gICAgICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgICAgICAgIHJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgICAgICAgY3VycmVudFdvcmtEaXI9e3RoaXMucHJvcHMuY3VycmVudFdvcmtEaXJ9XG4gICAgICAgICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17Z2V0Q3VycmVudFdvcmtEaXJzfVxuICAgICAgICAgICAgICBvbkRpZENoYW5nZVdvcmtEaXJzPXtvbkRpZENoYW5nZVdvcmtEaXJzfVxuICAgICAgICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17R2l0SHViVGFiSXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRIdWItcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiAoXG4gICAgICAgICAgICA8R2l0SHViVGFiSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuICAgICAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY3VycmVudFdvcmtEaXI9e3RoaXMucHJvcHMuY3VycmVudFdvcmtEaXJ9XG4gICAgICAgICAgICAgIGdldEN1cnJlbnRXb3JrRGlycz17Z2V0Q3VycmVudFdvcmtEaXJzfVxuICAgICAgICAgICAgICBvbkRpZENoYW5nZVdvcmtEaXJzPXtvbkRpZENoYW5nZVdvcmtEaXJzfVxuICAgICAgICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLnByb3BzLmNvbnRleHRMb2NrZWR9XG4gICAgICAgICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e3RoaXMucHJvcHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgc2V0Q29udGV4dExvY2s9e3RoaXMucHJvcHMuc2V0Q29udGV4dExvY2t9XG4gICAgICAgICAgICAgIG9wZW5DcmVhdGVEaWFsb2c9e3RoaXMub3BlbkNyZWF0ZURpYWxvZ31cbiAgICAgICAgICAgICAgb3BlblB1Ymxpc2hEaWFsb2c9e3RoaXMub3BlblB1Ymxpc2hEaWFsb2d9XG4gICAgICAgICAgICAgIG9wZW5DbG9uZURpYWxvZz17dGhpcy5vcGVuQ2xvbmVEaWFsb2d9XG4gICAgICAgICAgICAgIG9wZW5HaXRUYWI9e3RoaXMuZ2l0VGFiVHJhY2tlci50b2dnbGVGb2N1c31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtDaGFuZ2VkRmlsZUl0ZW0udXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zfSkgPT4gKFxuICAgICAgICAgICAgPENoYW5nZWRGaWxlSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIHJlbFBhdGg9e3BhdGguam9pbiguLi5wYXJhbXMucmVsUGF0aCl9XG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICBzdGFnaW5nU3RhdHVzPXtwYXJhbXMuc3RhZ2luZ1N0YXR1c31cblxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICBkaXNjYXJkTGluZXM9e3RoaXMuZGlzY2FyZExpbmVzfVxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICAgICAgICBzdXJmYWNlRmlsZUF0UGF0aD17dGhpcy5zdXJmYWNlRnJvbUZpbGVBdFBhdGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17Q29tbWl0UHJldmlld0l0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0UHJldmlldy1yb290XCI+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zfSkgPT4gKFxuICAgICAgICAgICAgPENvbW1pdFByZXZpZXdJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIGRpc2NhcmRMaW5lcz17dGhpcy5kaXNjYXJkTGluZXN9XG4gICAgICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgICAgICAgIHN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b249e3RoaXMuc3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtDb21taXREZXRhaWxJdGVtLnVyaVBhdHRlcm59XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbC1yb290XCI+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zfSkgPT4gKFxuICAgICAgICAgICAgPENvbW1pdERldGFpbEl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXtwYXJhbXMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgICAgICAgc2hhPXtwYXJhbXMuc2hhfVxuICAgICAgICAgICAgICBzdXJmYWNlQ29tbWl0PXt0aGlzLnN1cmZhY2VUb1JlY2VudENvbW1pdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IHVyaVBhdHRlcm49e0lzc3VlaXNoRGV0YWlsSXRlbS51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXMsIGRlc2VyaWFsaXplZH0pID0+IChcbiAgICAgICAgICAgIDxJc3N1ZWlzaERldGFpbEl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICBob3N0PXtwYXJhbXMuaG9zdH1cbiAgICAgICAgICAgICAgb3duZXI9e3BhcmFtcy5vd25lcn1cbiAgICAgICAgICAgICAgcmVwbz17cGFyYW1zLnJlcG99XG4gICAgICAgICAgICAgIGlzc3VlaXNoTnVtYmVyPXtwYXJzZUludChwYXJhbXMuaXNzdWVpc2hOdW1iZXIsIDEwKX1cblxuICAgICAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXtwYXJhbXMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICAgICAgICBpbml0U2VsZWN0ZWRUYWI9e2Rlc2VyaWFsaXplZC5pbml0U2VsZWN0ZWRUYWJ9XG5cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj17UmV2aWV3c0l0ZW0udXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zfSkgPT4gKFxuICAgICAgICAgICAgPFJldmlld3NJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgaG9zdD17cGFyYW1zLmhvc3R9XG4gICAgICAgICAgICAgIG93bmVyPXtwYXJhbXMub3duZXJ9XG4gICAgICAgICAgICAgIHJlcG89e3BhcmFtcy5yZXBvfVxuICAgICAgICAgICAgICBudW1iZXI9e3BhcnNlSW50KHBhcmFtcy5udW1iZXIsIDEwKX1cblxuICAgICAgICAgICAgICB3b3JrZGlyPXtwYXJhbXMud29ya2Rpcn1cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj17R2l0VGltaW5nc1ZpZXcudXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlcn0pID0+IDxHaXRUaW1pbmdzVmlldyByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfSAvPn1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IHVyaVBhdHRlcm49e0dpdENhY2hlVmlldy51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gPEdpdENhY2hlVmlldyByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfSByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IC8+fVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgZmV0Y2hEYXRhID0gcmVwb3NpdG9yeSA9PiB5dWJpa2lyaSh7XG4gICAgaXNQdWJsaXNoYWJsZTogcmVwb3NpdG9yeS5pc1B1Ymxpc2hhYmxlKCksXG4gICAgcmVtb3RlczogcmVwb3NpdG9yeS5nZXRSZW1vdGVzKCksXG4gIH0pO1xuXG4gIGFzeW5jIG9wZW5UYWJzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN0YXJ0T3Blbikge1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICB0aGlzLmdpdFRhYlRyYWNrZXIuZW5zdXJlUmVuZGVyZWQoZmFsc2UpLFxuICAgICAgICB0aGlzLmdpdGh1YlRhYlRyYWNrZXIuZW5zdXJlUmVuZGVyZWQoZmFsc2UpLFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc3RhcnRSZXZlYWxlZCkge1xuICAgICAgY29uc3QgZG9ja3MgPSBuZXcgU2V0KFxuICAgICAgICBbR2l0VGFiSXRlbS5idWlsZFVSSSgpLCBHaXRIdWJUYWJJdGVtLmJ1aWxkVVJJKCldXG4gICAgICAgICAgLm1hcCh1cmkgPT4gdGhpcy5wcm9wcy53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvclVSSSh1cmkpKVxuICAgICAgICAgIC5maWx0ZXIoY29udGFpbmVyID0+IGNvbnRhaW5lciAmJiAodHlwZW9mIGNvbnRhaW5lci5zaG93KSA9PT0gJ2Z1bmN0aW9uJyksXG4gICAgICApO1xuXG4gICAgICBmb3IgKGNvbnN0IGRvY2sgb2YgZG9ja3MpIHtcbiAgICAgICAgZG9jay5zaG93KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5zdGFsbFJlYWN0RGV2VG9vbHMoKSB7XG4gICAgLy8gUHJldmVudCBlbGVjdHJvbi1saW5rIGZyb20gYXR0ZW1wdGluZyB0byBkZXNjZW5kIGludG8gZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyLCB3aGljaCBpcyBub3QgYXZhaWxhYmxlXG4gICAgLy8gd2hlbiB3ZSdyZSBidW5kbGVkIGluIEF0b20uXG4gICAgY29uc3QgZGV2VG9vbHNOYW1lID0gJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcic7XG4gICAgY29uc3QgZGV2VG9vbHMgPSByZXF1aXJlKGRldlRvb2xzTmFtZSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmluc3RhbGxFeHRlbnNpb24oZGV2VG9vbHMuUkVBQ1RfREVWRUxPUEVSX1RPT0xTLmlkKSxcbiAgICAgIC8vIHJlbGF5IGRldmVsb3BlciB0b29scyBleHRlbnNpb24gaWRcbiAgICAgIHRoaXMuaW5zdGFsbEV4dGVuc2lvbignbmNlZG9icGdubWtoY21ubmtjaW1ub2JwZmVwaWRhZGwnKSxcbiAgICBdKTtcblxuICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRTdWNjZXNzKCfwn4yIIFJlbG9hZCB5b3VyIHdpbmRvdyB0byBzdGFydCB1c2luZyB0aGUgUmVhY3QvUmVsYXkgZGV2IHRvb2xzIScpO1xuICB9XG5cbiAgYXN5bmMgaW5zdGFsbEV4dGVuc2lvbihpZCkge1xuICAgIGNvbnN0IGRldlRvb2xzTmFtZSA9ICdlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXInO1xuICAgIGNvbnN0IGRldlRvb2xzID0gcmVxdWlyZShkZXZUb29sc05hbWUpO1xuXG4gICAgY29uc3QgY3Jvc3NVbnppcE5hbWUgPSAnY3Jvc3MtdW56aXAnO1xuICAgIGNvbnN0IHVuemlwID0gcmVxdWlyZShjcm9zc1VuemlwTmFtZSk7XG5cbiAgICBjb25zdCB1cmwgPVxuICAgICAgJ2h0dHBzOi8vY2xpZW50czIuZ29vZ2xlLmNvbS9zZXJ2aWNlL3VwZGF0ZTIvY3J4PycgK1xuICAgICAgYHJlc3BvbnNlPXJlZGlyZWN0Jng9aWQlM0Qke2lkfSUyNnVjJnByb2R2ZXJzaW9uPTMyYDtcbiAgICBjb25zdCBleHRlbnNpb25Gb2xkZXIgPSBwYXRoLnJlc29sdmUocmVtb3RlLmFwcC5nZXRQYXRoKCd1c2VyRGF0YScpLCBgZXh0ZW5zaW9ucy8ke2lkfWApO1xuICAgIGNvbnN0IGV4dGVuc2lvbkZpbGUgPSBgJHtleHRlbnNpb25Gb2xkZXJ9LmNyeGA7XG4gICAgYXdhaXQgZnMuZW5zdXJlRGlyKHBhdGguZGlybmFtZShleHRlbnNpb25GaWxlKSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHttZXRob2Q6ICdHRVQnfSk7XG4gICAgY29uc3QgYm9keSA9IEJ1ZmZlci5mcm9tKGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpO1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShleHRlbnNpb25GaWxlLCBib2R5KTtcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHVuemlwKGV4dGVuc2lvbkZpbGUsIGV4dGVuc2lvbkZvbGRlciwgYXN5bmMgZXJyID0+IHtcbiAgICAgICAgaWYgKGVyciAmJiAhYXdhaXQgZnMuZXhpc3RzKHBhdGguam9pbihleHRlbnNpb25Gb2xkZXIsICdtYW5pZmVzdC5qc29uJykpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGF3YWl0IGZzLmVuc3VyZURpcihleHRlbnNpb25Gb2xkZXIsIDBvNzU1KTtcbiAgICBhd2FpdCBkZXZUb29scy5kZWZhdWx0KGlkKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5vblB1bGxFcnJvcigoKSA9PiB0aGlzLmdpdFRhYlRyYWNrZXIuZW5zdXJlVmlzaWJsZSgpKSxcbiAgICApO1xuICB9XG5cbiAgb25Db25zdW1lU3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIGlmIChzdGF0dXNCYXIuZGlzYWJsZUdpdEluZm9UaWxlKSB7XG4gICAgICBzdGF0dXNCYXIuZGlzYWJsZUdpdEluZm9UaWxlKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJHaXRodWJUb2tlbigpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5sb2dpbk1vZGVsLnJlbW92ZVRva2VuKCdodHRwczovL2FwaS5naXRodWIuY29tJyk7XG4gIH1cblxuICBjbG9zZURpYWxvZyA9ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdDogZGlhbG9nUmVxdWVzdHMubnVsbH0sIHJlc29sdmUpKTtcblxuICBvcGVuSW5pdGlhbGl6ZURpYWxvZyA9IGFzeW5jIGRpclBhdGggPT4ge1xuICAgIGlmICghZGlyUGF0aCkge1xuICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgaWYgKGFjdGl2ZUVkaXRvcikge1xuICAgICAgICBjb25zdCBbcHJvamVjdFBhdGhdID0gdGhpcy5wcm9wcy5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGFjdGl2ZUVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgICAgICBkaXJQYXRoID0gcHJvamVjdFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWRpclBhdGgpIHtcbiAgICAgIGNvbnN0IGRpcmVjdG9yaWVzID0gdGhpcy5wcm9wcy5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCk7XG4gICAgICBjb25zdCB3aXRoUmVwb3NpdG9yaWVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIGRpcmVjdG9yaWVzLm1hcChhc3luYyBkID0+IFtkLCBhd2FpdCB0aGlzLnByb3BzLnByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeShkKV0pLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZpcnN0VW5pbml0aWFsaXplZCA9IHdpdGhSZXBvc2l0b3JpZXMuZmluZCgoW2QsIHJdKSA9PiAhcik7XG4gICAgICBpZiAoZmlyc3RVbmluaXRpYWxpemVkICYmIGZpcnN0VW5pbml0aWFsaXplZFswXSkge1xuICAgICAgICBkaXJQYXRoID0gZmlyc3RVbmluaXRpYWxpemVkWzBdLmdldFBhdGgoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWRpclBhdGgpIHtcbiAgICAgIGRpclBhdGggPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2NvcmUucHJvamVjdEhvbWUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuaW5pdCh7ZGlyUGF0aH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyBjaG9zZW5QYXRoID0+IHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuaW5pdGlhbGl6ZShjaG9zZW5QYXRoKTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5DbG9uZURpYWxvZyA9IG9wdHMgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5jbG9uZShvcHRzKTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgKHVybCwgY2hvc2VuUGF0aCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5jbG9uZSh1cmwsIGNob3NlblBhdGgpO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNyZWRlbnRpYWxzRGlhbG9nID0gcXVlcnkgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY3JlZGVudGlhbChxdWVyeSk7XG4gICAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgICB9KTtcbiAgICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwoYXN5bmMgKCkgPT4ge1xuICAgICAgICByZWplY3QoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9wZW5Jc3N1ZWlzaERpYWxvZyA9ICgpID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuaXNzdWVpc2goKTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgdXJsID0+IHtcbiAgICAgIGF3YWl0IG9wZW5Jc3N1ZWlzaEl0ZW0odXJsLCB7XG4gICAgICAgIHdvcmtzcGFjZTogdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgICAgIHdvcmtkaXI6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLFxuICAgICAgfSk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ29tbWl0RGlhbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5jb21taXQoKTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgcmVmID0+IHtcbiAgICAgIGF3YWl0IG9wZW5Db21taXREZXRhaWxJdGVtKHJlZiwge1xuICAgICAgICB3b3Jrc3BhY2U6IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgICAgICByZXBvc2l0b3J5OiB0aGlzLnByb3BzLnJlcG9zaXRvcnksXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5DcmVhdGVEaWFsb2cgPSAoKSA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNyZWF0ZSgpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZXN1bHQgPT4ge1xuICAgICAgY29uc3QgZG90Y29tID0gZ2V0RW5kcG9pbnQoJ2dpdGh1Yi5jb20nKTtcbiAgICAgIGNvbnN0IHJlbGF5RW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KGRvdGNvbSk7XG5cbiAgICAgIGF3YWl0IGNyZWF0ZVJlcG9zaXRvcnkocmVzdWx0LCB7Y2xvbmU6IHRoaXMucHJvcHMuY2xvbmUsIHJlbGF5RW52aXJvbm1lbnR9KTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5QdWJsaXNoRGlhbG9nID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLnB1Ymxpc2goe2xvY2FsRGlyOiByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCl9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IGRvdGNvbSA9IGdldEVuZHBvaW50KCdnaXRodWIuY29tJyk7XG4gICAgICBjb25zdCByZWxheUVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdChkb3Rjb20pO1xuXG4gICAgICBhd2FpdCBwdWJsaXNoUmVwb3NpdG9yeShyZXN1bHQsIHtyZXBvc2l0b3J5LCByZWxheUVudmlyb25tZW50fSk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICB0b2dnbGVDb21taXRQcmV2aWV3SXRlbSA9ICgpID0+IHtcbiAgICBjb25zdCB3b3JrZGlyID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLnRvZ2dsZShDb21taXRQcmV2aWV3SXRlbS5idWlsZFVSSSh3b3JrZGlyKSk7XG4gIH1cblxuICBzaG93V2F0ZXJmYWxsRGlhZ25vc3RpY3MoKSB7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihHaXRUaW1pbmdzVmlldy5idWlsZFVSSSgpKTtcbiAgfVxuXG4gIHNob3dDYWNoZURpYWdub3N0aWNzKCkge1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oR2l0Q2FjaGVWaWV3LmJ1aWxkVVJJKCkpO1xuICB9XG5cbiAgc3VyZmFjZUZyb21GaWxlQXRQYXRoID0gKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSA9PiB7XG4gICAgY29uc3QgZ2l0VGFiID0gdGhpcy5naXRUYWJUcmFja2VyLmdldENvbXBvbmVudCgpO1xuICAgIHJldHVybiBnaXRUYWIgJiYgZ2l0VGFiLmZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICB9XG5cbiAgc3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbiA9ICgpID0+IHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIuZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCk7XG4gIH1cblxuICBzdXJmYWNlVG9SZWNlbnRDb21taXQgPSAoKSA9PiB7XG4gICAgY29uc3QgZ2l0VGFiID0gdGhpcy5naXRUYWJUcmFja2VyLmdldENvbXBvbmVudCgpO1xuICAgIHJldHVybiBnaXRUYWIgJiYgZ2l0VGFiLmZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCk7XG4gIH1cblxuICBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zKCkge1xuICAgIGRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWQ6IGZhbHNlfSwgdGhpcy5wcm9wcy53b3Jrc3BhY2UpO1xuICB9XG5cbiAgZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zKCkge1xuICAgIGRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcyh0aGlzLnByb3BzLndvcmtzcGFjZSk7XG4gIH1cblxuICBxdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gIH1cblxuICBhc3luYyB2aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKHN0YWdpbmdTdGF0dXMpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IuZ2V0UGF0aCgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYWJzRmlsZVBhdGggPSBhd2FpdCBmcy5yZWFscGF0aChlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICBjb25zdCByZXBvUGF0aCA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICAgIGlmIChyZXBvUGF0aCA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgW3Byb2plY3RQYXRoXSA9IHRoaXMucHJvcHMucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRJbmZvKFxuICAgICAgICBcIkhtbSwgdGhlcmUncyBub3RoaW5nIHRvIGNvbXBhcmUgdGhpcyBmaWxlIHRvXCIsXG4gICAgICAgIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1lvdSBjYW4gY3JlYXRlIGEgR2l0IHJlcG9zaXRvcnkgdG8gdHJhY2sgY2hhbmdlcyB0byB0aGUgZmlsZXMgaW4geW91ciBwcm9qZWN0LicsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICAgICAgICB0ZXh0OiAnQ3JlYXRlIGEgcmVwb3NpdG9yeSBub3cnLFxuICAgICAgICAgICAgb25EaWRDbGljazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpO1xuICAgICAgICAgICAgICBjb25zdCBjcmVhdGVkUGF0aCA9IGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVJlcG8ocHJvamVjdFBhdGgpO1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBjb25maXJtZWQgcmVwb3NpdG9yeSBjcmVhdGlvbiBmb3IgdGhpcyBwcm9qZWN0IHBhdGgsXG4gICAgICAgICAgICAgIC8vIHJldHJ5IHRoZSBvcGVyYXRpb24gdGhhdCBnb3QgdGhlbSBoZXJlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgICAgICAgICBpZiAoY3JlYXRlZFBhdGggPT09IHByb2plY3RQYXRoKSB7IHRoaXMudmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZShzdGFnaW5nU3RhdHVzKTsgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChhYnNGaWxlUGF0aC5zdGFydHNXaXRoKHJlcG9QYXRoKSkge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBhYnNGaWxlUGF0aC5zbGljZShyZXBvUGF0aC5sZW5ndGggKyAxKTtcbiAgICAgIHRoaXMucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICAgICAgY29uc3Qgc3BsaXREaXJlY3Rpb24gPSB0aGlzLnByb3BzLmNvbmZpZy5nZXQoJ2dpdGh1Yi52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlRGlmZlBhbmVTcGxpdERpcmVjdGlvbicpO1xuICAgICAgY29uc3QgcGFuZSA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKTtcbiAgICAgIGlmIChzcGxpdERpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBwYW5lLnNwbGl0UmlnaHQoKTtcbiAgICAgIH0gZWxzZSBpZiAoc3BsaXREaXJlY3Rpb24gPT09ICdkb3duJykge1xuICAgICAgICBwYW5lLnNwbGl0RG93bigpO1xuICAgICAgfVxuICAgICAgY29uc3QgbGluZU51bSA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyArIDE7XG4gICAgICBjb25zdCBpdGVtID0gYXdhaXQgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihcbiAgICAgICAgQ2hhbmdlZEZpbGVJdGVtLmJ1aWxkVVJJKGZpbGVQYXRoLCByZXBvUGF0aCwgc3RhZ2luZ1N0YXR1cyksXG4gICAgICAgIHtwZW5kaW5nOiB0cnVlLCBhY3RpdmF0ZVBhbmU6IHRydWUsIGFjdGl2YXRlSXRlbTogdHJ1ZX0sXG4gICAgICApO1xuICAgICAgYXdhaXQgaXRlbS5nZXRSZWFsSXRlbVByb21pc2UoKTtcbiAgICAgIGF3YWl0IGl0ZW0uZ2V0RmlsZVBhdGNoTG9hZGVkUHJvbWlzZSgpO1xuICAgICAgaXRlbS5nb1RvRGlmZkxpbmUobGluZU51bSk7XG4gICAgICBpdGVtLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHthYnNGaWxlUGF0aH0gZG9lcyBub3QgYmVsb25nIHRvIHJlcG8gJHtyZXBvUGF0aH1gKTtcbiAgICB9XG4gIH1cblxuICB2aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZSgndW5zdGFnZWQnKTtcbiAgfVxuXG4gIHZpZXdTdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZSgnc3RhZ2VkJyk7XG4gIH1cblxuICBvcGVuRmlsZXMoZmlsZVBhdGhzLCByZXBvc2l0b3J5ID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4ge1xuICAgICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5qb2luKHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSwgZmlsZVBhdGgpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oYWJzb2x1dGVQYXRoLCB7cGVuZGluZzogZmlsZVBhdGhzLmxlbmd0aCA9PT0gMX0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIGdldFVuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsIHdvcmtkaXJQYXRoKSB7XG4gICAgY29uc3QgaXNNb2RpZmllZEJ5UGF0aCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goZWRpdG9yID0+IHtcbiAgICAgIGlzTW9kaWZpZWRCeVBhdGguc2V0KGVkaXRvci5nZXRQYXRoKCksIGVkaXRvci5pc01vZGlmaWVkKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBmaWxlUGF0aHMuZmlsdGVyKGZpbGVQYXRoID0+IHtcbiAgICAgIGNvbnN0IGFic0ZpbGVQYXRoID0gcGF0aC5qb2luKHdvcmtkaXJQYXRoLCBmaWxlUGF0aCk7XG4gICAgICByZXR1cm4gaXNNb2RpZmllZEJ5UGF0aC5nZXQoYWJzRmlsZVBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgZW5zdXJlTm9VbnNhdmVkRmlsZXMoZmlsZVBhdGhzLCBtZXNzYWdlLCB3b3JrZGlyUGF0aCA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpKSB7XG4gICAgY29uc3QgdW5zYXZlZEZpbGVzID0gdGhpcy5nZXRVbnNhdmVkRmlsZXMoZmlsZVBhdGhzLCB3b3JrZGlyUGF0aCkubWFwKGZpbGVQYXRoID0+IGBcXGAke2ZpbGVQYXRofVxcYGApLmpvaW4oJzxicj4nKTtcbiAgICBpZiAodW5zYXZlZEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICB7XG4gICAgICAgICAgZGVzY3JpcHRpb246IGBZb3UgaGF2ZSB1bnNhdmVkIGNoYW5nZXMgaW46PGJyPiR7dW5zYXZlZEZpbGVzfS5gLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMoZmlsZVBhdGhzKSB7XG4gICAgY29uc3QgZGVzdHJ1Y3RpdmVBY3Rpb24gPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocyk7XG4gICAgfTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhcbiAgICAgIGZpbGVQYXRocyxcbiAgICAgICgpID0+IHRoaXMuZW5zdXJlTm9VbnNhdmVkRmlsZXMoZmlsZVBhdGhzLCAnQ2Fubm90IGRpc2NhcmQgY2hhbmdlcyBpbiBzZWxlY3RlZCBmaWxlcy4nKSxcbiAgICAgIGRlc3RydWN0aXZlQWN0aW9uLFxuICAgICk7XG4gIH1cblxuICBhc3luYyBkaXNjYXJkTGluZXMobXVsdGlGaWxlUGF0Y2gsIGxpbmVzLCByZXBvc2l0b3J5ID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7XG4gICAgLy8gKGt1eWNoYWNvKSBGb3Igbm93IHdlIG9ubHkgc3VwcG9ydCBkaXNjYXJkaW5nIHJvd3MgZm9yIE11bHRpRmlsZVBhdGNoZXMgdGhhdCBjb250YWluIGEgc2luZ2xlIGZpbGUgcGF0Y2hcbiAgICAvLyBUaGUgb25seSB3YXkgdG8gYWNjZXNzIHRoaXMgbWV0aG9kIGZyb20gdGhlIFVJIGlzIHRvIGJlIGluIGEgQ2hhbmdlZEZpbGVJdGVtLCB3aGljaCBvbmx5IGhhcyBhIHNpbmdsZSBmaWxlIHBhdGNoXG4gICAgaWYgKG11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCkubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gbXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKVswXS5nZXRQYXRoKCk7XG4gICAgY29uc3QgZGVzdHJ1Y3RpdmVBY3Rpb24gPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkaXNjYXJkRmlsZVBhdGNoID0gbXVsdGlGaWxlUGF0Y2guZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMobGluZXMpO1xuICAgICAgYXdhaXQgcmVwb3NpdG9yeS5hcHBseVBhdGNoVG9Xb3JrZGlyKGRpc2NhcmRGaWxlUGF0Y2gpO1xuICAgIH07XG4gICAgcmV0dXJuIGF3YWl0IHJlcG9zaXRvcnkuc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKFxuICAgICAgW2ZpbGVQYXRoXSxcbiAgICAgICgpID0+IHRoaXMuZW5zdXJlTm9VbnNhdmVkRmlsZXMoW2ZpbGVQYXRoXSwgJ0Nhbm5vdCBkaXNjYXJkIGxpbmVzLicsIHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSksXG4gICAgICBkZXN0cnVjdGl2ZUFjdGlvbixcbiAgICAgIGZpbGVQYXRoLFxuICAgICk7XG4gIH1cblxuICBnZXRGaWxlUGF0aHNGb3JMYXN0RGlzY2FyZChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGxldCBsYXN0U25hcHNob3RzID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldExhc3RIaXN0b3J5U25hcHNob3RzKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIGlmIChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKSB7XG4gICAgICBsYXN0U25hcHNob3RzID0gbGFzdFNuYXBzaG90cyA/IFtsYXN0U25hcHNob3RzXSA6IFtdO1xuICAgIH1cbiAgICByZXR1cm4gbGFzdFNuYXBzaG90cy5tYXAoc25hcHNob3QgPT4gc25hcHNob3QuZmlsZVBhdGgpO1xuICB9XG5cbiAgYXN5bmMgdW5kb0xhc3REaXNjYXJkKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsLCByZXBvc2l0b3J5ID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7XG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5nZXRGaWxlUGF0aHNGb3JMYXN0RGlzY2FyZChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHJlcG9zaXRvcnkucmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoXG4gICAgICAgICgpID0+IHRoaXMuZW5zdXJlTm9VbnNhdmVkRmlsZXMoZmlsZVBhdGhzLCAnQ2Fubm90IHVuZG8gbGFzdCBkaXNjYXJkLicpLFxuICAgICAgICBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoLFxuICAgICAgKTtcbiAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cbiAgICAgIGF3YWl0IHRoaXMucHJvY2VlZE9yUHJvbXB0QmFzZWRPblJlc3VsdHMocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBHaXRFcnJvciAmJiBlLnN0ZEVyci5tYXRjaCgvZmF0YWw6IE5vdCBhIHZhbGlkIG9iamVjdCBuYW1lLykpIHtcbiAgICAgICAgdGhpcy5jbGVhblVwSGlzdG9yeUZvckZpbGVQYXRocyhmaWxlUGF0aHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBwcm9jZWVkT3JQcm9tcHRCYXNlZE9uUmVzdWx0cyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IGNvbmZsaWN0cyA9IHJlc3VsdHMuZmlsdGVyKCh7Y29uZmxpY3R9KSA9PiBjb25mbGljdCk7XG4gICAgaWYgKGNvbmZsaWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvY2VlZFdpdGhMYXN0RGlzY2FyZFVuZG8ocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvbXB0QWJvdXRDb25mbGljdHMocmVzdWx0cywgY29uZmxpY3RzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBwcm9tcHRBYm91dENvbmZsaWN0cyhyZXN1bHRzLCBjb25mbGljdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3QgY29uZmxpY3RlZEZpbGVzID0gY29uZmxpY3RzLm1hcCgoe2ZpbGVQYXRofSkgPT4gYFxcdCR7ZmlsZVBhdGh9YCkuam9pbignXFxuJyk7XG4gICAgY29uc3QgY2hvaWNlID0gdGhpcy5wcm9wcy5jb25maXJtKHtcbiAgICAgIG1lc3NhZ2U6ICdVbmRvaW5nIHdpbGwgcmVzdWx0IGluIGNvbmZsaWN0cy4uLicsXG4gICAgICBkZXRhaWxlZE1lc3NhZ2U6IGBmb3IgdGhlIGZvbGxvd2luZyBmaWxlczpcXG4ke2NvbmZsaWN0ZWRGaWxlc31cXG5gICtcbiAgICAgICAgJ1dvdWxkIHlvdSBsaWtlIHRvIGFwcGx5IHRoZSBjaGFuZ2VzIHdpdGggbWVyZ2UgY29uZmxpY3QgbWFya2VycywgJyArXG4gICAgICAgICdvciBvcGVuIHRoZSB0ZXh0IHdpdGggbWVyZ2UgY29uZmxpY3QgbWFya2VycyBpbiBhIG5ldyBmaWxlPycsXG4gICAgICBidXR0b25zOiBbJ01lcmdlIHdpdGggY29uZmxpY3QgbWFya2VycycsICdPcGVuIGluIG5ldyBmaWxlJywgJ0NhbmNlbCddLFxuICAgIH0pO1xuICAgIGlmIChjaG9pY2UgPT09IDApIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvY2VlZFdpdGhMYXN0RGlzY2FyZFVuZG8ocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgfSBlbHNlIGlmIChjaG9pY2UgPT09IDEpIHtcbiAgICAgIGF3YWl0IHRoaXMub3BlbkNvbmZsaWN0c0luTmV3RWRpdG9ycyhjb25mbGljdHMubWFwKCh7cmVzdWx0UGF0aH0pID0+IHJlc3VsdFBhdGgpKTtcbiAgICB9XG4gIH1cblxuICBjbGVhblVwSGlzdG9yeUZvckZpbGVQYXRocyhmaWxlUGF0aHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmNsZWFyRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgY29uc3QgZmlsZVBhdGhzU3RyID0gZmlsZVBhdGhzLm1hcChmaWxlUGF0aCA9PiBgXFxgJHtmaWxlUGF0aH1cXGBgKS5qb2luKCc8YnI+Jyk7XG4gICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKFxuICAgICAgJ0Rpc2NhcmQgaGlzdG9yeSBoYXMgZXhwaXJlZC4nLFxuICAgICAge1xuICAgICAgICBkZXNjcmlwdGlvbjogYENhbm5vdCB1bmRvIGRpc2NhcmQgZm9yPGJyPiR7ZmlsZVBhdGhzU3RyfTxicj5TdGFsZSBkaXNjYXJkIGhpc3RvcnkgaGFzIGJlZW4gZGVsZXRlZC5gLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHByb2NlZWRXaXRoTGFzdERpc2NhcmRVbmRvKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSByZXN1bHRzLm1hcChhc3luYyByZXN1bHQgPT4ge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCByZXN1bHRQYXRoLCBkZWxldGVkLCBjb25mbGljdCwgdGhlaXJzU2hhLCBjb21tb25CYXNlU2hhLCBjdXJyZW50U2hhfSA9IHJlc3VsdDtcbiAgICAgIGNvbnN0IGFic0ZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCBmaWxlUGF0aCk7XG4gICAgICBpZiAoZGVsZXRlZCAmJiByZXN1bHRQYXRoID09PSBudWxsKSB7XG4gICAgICAgIGF3YWl0IGZzLnJlbW92ZShhYnNGaWxlUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBmcy5jb3B5KHJlc3VsdFBhdGgsIGFic0ZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb25mbGljdCkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkud3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgY3VycmVudFNoYSwgdGhlaXJzU2hhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LnBvcERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgYXN5bmMgb3BlbkNvbmZsaWN0c0luTmV3RWRpdG9ycyhyZXN1bHRQYXRocykge1xuICAgIGNvbnN0IGVkaXRvclByb21pc2VzID0gcmVzdWx0UGF0aHMubWFwKHJlc3VsdFBhdGggPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4ocmVzdWx0UGF0aCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKGVkaXRvclByb21pc2VzKTtcbiAgfVxuXG4gIHJlcG9ydFJlbGF5RXJyb3IgPSAoZnJpZW5kbHlNZXNzYWdlLCBlcnIpID0+IHtcbiAgICBjb25zdCBvcHRzID0ge2Rpc21pc3NhYmxlOiB0cnVlfTtcblxuICAgIGlmIChlcnIubmV0d29yaykge1xuICAgICAgLy8gT2ZmbGluZVxuICAgICAgb3B0cy5pY29uID0gJ2FsaWdubWVudC11bmFsaWduJztcbiAgICAgIG9wdHMuZGVzY3JpcHRpb24gPSBcIkl0IGxvb2tzIGxpa2UgeW91J3JlIG9mZmxpbmUgcmlnaHQgbm93LlwiO1xuICAgIH0gZWxzZSBpZiAoZXJyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgLy8gVHJhbnNpZW50IGVycm9yIGxpa2UgYSA1MDAgZnJvbSB0aGUgQVBJXG4gICAgICBvcHRzLmRlc2NyaXB0aW9uID0gJ1RoZSBHaXRIdWIgQVBJIHJlcG9ydGVkIGEgcHJvYmxlbS4nO1xuICAgICAgb3B0cy5kZXRhaWwgPSBlcnIucmVzcG9uc2VUZXh0O1xuICAgIH0gZWxzZSBpZiAoZXJyLmVycm9ycykge1xuICAgICAgLy8gR3JhcGhRTCBlcnJvcnNcbiAgICAgIG9wdHMuZGV0YWlsID0gZXJyLmVycm9ycy5tYXAoZSA9PiBlLm1lc3NhZ2UpLmpvaW4oJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLmRldGFpbCA9IGVyci5zdGFjaztcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoZnJpZW5kbHlNZXNzYWdlLCBvcHRzKTtcbiAgfVxuXG4gIC8qXG4gICAqIEFzeW5jaHJvbm91c2x5IGNvdW50IHRoZSBjb25mbGljdCBtYXJrZXJzIHByZXNlbnQgaW4gYSBmaWxlIHNwZWNpZmllZCBieSBmdWxsIHBhdGguXG4gICAqL1xuICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzKGZ1bGxQYXRoKSB7XG4gICAgY29uc3QgcmVhZFN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZnVsbFBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgQ29uZmxpY3QuY291bnRGcm9tU3RyZWFtKHJlYWRTdHJlYW0pLnRoZW4oY291bnQgPT4ge1xuICAgICAgICB0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzcy5yZXBvcnRNYXJrZXJDb3VudChmdWxsUGF0aCwgY291bnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgVGFiVHJhY2tlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHtnZXRXb3Jrc3BhY2UsIHVyaX0pIHtcbiAgICBhdXRvYmluZCh0aGlzLCAndG9nZ2xlJywgJ3RvZ2dsZUZvY3VzJywgJ2Vuc3VyZVZpc2libGUnKTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXG4gICAgdGhpcy5nZXRXb3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2U7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gIH1cblxuICBhc3luYyB0b2dnbGUoKSB7XG4gICAgY29uc3QgZm9jdXNUb1Jlc3RvcmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGxldCBzaG91bGRSZXN0b3JlRm9jdXMgPSBmYWxzZTtcblxuICAgIC8vIFJlbmRlcmVkID0+IHRoZSBkb2NrIGl0ZW0gaXMgYmVpbmcgcmVuZGVyZWQsIHdoZXRoZXIgb3Igbm90IHRoZSBkb2NrIGlzIHZpc2libGUgb3IgdGhlIGl0ZW1cbiAgICAvLyAgIGlzIHZpc2libGUgd2l0aGluIGl0cyBkb2NrLlxuICAgIC8vIFZpc2libGUgPT4gdGhlIGl0ZW0gaXMgYWN0aXZlIGFuZCB0aGUgZG9jayBpdGVtIGlzIGFjdGl2ZSB3aXRoaW4gaXRzIGRvY2suXG4gICAgY29uc3Qgd2FzUmVuZGVyZWQgPSB0aGlzLmlzUmVuZGVyZWQoKTtcbiAgICBjb25zdCB3YXNWaXNpYmxlID0gdGhpcy5pc1Zpc2libGUoKTtcblxuICAgIGlmICghd2FzUmVuZGVyZWQgfHwgIXdhc1Zpc2libGUpIHtcbiAgICAgIC8vIE5vdCByZW5kZXJlZCwgb3IgcmVuZGVyZWQgYnV0IG5vdCBhbiBhY3RpdmUgaXRlbSBpbiBhIHZpc2libGUgZG9jay5cbiAgICAgIGF3YWl0IHRoaXMucmV2ZWFsKCk7XG4gICAgICBzaG91bGRSZXN0b3JlRm9jdXMgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZW5kZXJlZCBhbmQgYW4gYWN0aXZlIGl0ZW0gd2l0aGluIGEgdmlzaWJsZSBkb2NrLlxuICAgICAgYXdhaXQgdGhpcy5oaWRlKCk7XG4gICAgICBzaG91bGRSZXN0b3JlRm9jdXMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkUmVzdG9yZUZvY3VzKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGZvY3VzVG9SZXN0b3JlLmZvY3VzKCkpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZUZvY3VzKCkge1xuICAgIGNvbnN0IGhhZEZvY3VzID0gdGhpcy5oYXNGb2N1cygpO1xuICAgIGF3YWl0IHRoaXMuZW5zdXJlVmlzaWJsZSgpO1xuXG4gICAgaWYgKGhhZEZvY3VzKSB7XG4gICAgICBsZXQgd29ya3NwYWNlID0gdGhpcy5nZXRXb3Jrc3BhY2UoKTtcbiAgICAgIGlmICh3b3Jrc3BhY2UuZ2V0Q2VudGVyKSB7XG4gICAgICAgIHdvcmtzcGFjZSA9IHdvcmtzcGFjZS5nZXRDZW50ZXIoKTtcbiAgICAgIH1cbiAgICAgIHdvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGVuc3VyZVZpc2libGUoKSB7XG4gICAgaWYgKCF0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnJldmVhbCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGVuc3VyZVJlbmRlcmVkKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdvcmtzcGFjZSgpLm9wZW4odGhpcy51cmksIHtzZWFyY2hBbGxQYW5lczogdHJ1ZSwgYWN0aXZhdGVJdGVtOiBmYWxzZSwgYWN0aXZhdGVQYW5lOiBmYWxzZX0pO1xuICB9XG5cbiAgcmV2ZWFsKCkge1xuICAgIGluY3JlbWVudENvdW50ZXIoYCR7dGhpcy5uYW1lfS10YWItb3BlbmApO1xuICAgIHJldHVybiB0aGlzLmdldFdvcmtzcGFjZSgpLm9wZW4odGhpcy51cmksIHtzZWFyY2hBbGxQYW5lczogdHJ1ZSwgYWN0aXZhdGVJdGVtOiB0cnVlLCBhY3RpdmF0ZVBhbmU6IHRydWV9KTtcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcihgJHt0aGlzLm5hbWV9LXRhYi1jbG9zZWApO1xuICAgIHJldHVybiB0aGlzLmdldFdvcmtzcGFjZSgpLmhpZGUodGhpcy51cmkpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5nZXRDb21wb25lbnQoKS5yZXN0b3JlRm9jdXMoKTtcbiAgfVxuXG4gIGdldEl0ZW0oKSB7XG4gICAgY29uc3QgcGFuZSA9IHRoaXMuZ2V0V29ya3NwYWNlKCkucGFuZUZvclVSSSh0aGlzLnVyaSk7XG4gICAgaWYgKCFwYW5lKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5lSXRlbSA9IHBhbmUuaXRlbUZvclVSSSh0aGlzLnVyaSk7XG4gICAgaWYgKCFwYW5lSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhbmVJdGVtO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50KCkge1xuICAgIGNvbnN0IHBhbmVJdGVtID0gdGhpcy5nZXRJdGVtKCk7XG4gICAgaWYgKCFwYW5lSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICgoKHR5cGVvZiBwYW5lSXRlbS5nZXRSZWFsSXRlbSkgIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFuZUl0ZW0uZ2V0UmVhbEl0ZW0oKTtcbiAgfVxuXG4gIGdldERPTUVsZW1lbnQoKSB7XG4gICAgY29uc3QgcGFuZUl0ZW0gPSB0aGlzLmdldEl0ZW0oKTtcbiAgICBpZiAoIXBhbmVJdGVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCgodHlwZW9mIHBhbmVJdGVtLmdldEVsZW1lbnQpICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhbmVJdGVtLmdldEVsZW1lbnQoKTtcbiAgfVxuXG4gIGlzUmVuZGVyZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5nZXRXb3Jrc3BhY2UoKS5wYW5lRm9yVVJJKHRoaXMudXJpKTtcbiAgfVxuXG4gIGlzVmlzaWJsZSgpIHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSB0aGlzLmdldFdvcmtzcGFjZSgpO1xuICAgIHJldHVybiB3b3Jrc3BhY2UuZ2V0UGFuZUNvbnRhaW5lcnMoKVxuICAgICAgLmZpbHRlcihjb250YWluZXIgPT4gY29udGFpbmVyID09PSB3b3Jrc3BhY2UuZ2V0Q2VudGVyKCkgfHwgY29udGFpbmVyLmlzVmlzaWJsZSgpKVxuICAgICAgLnNvbWUoY29udGFpbmVyID0+IGNvbnRhaW5lci5nZXRQYW5lcygpLnNvbWUocGFuZSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBwYW5lLmdldEFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgcmV0dXJuIGl0ZW0gJiYgaXRlbS5nZXRVUkkgJiYgaXRlbS5nZXRVUkkoKSA9PT0gdGhpcy51cmk7XG4gICAgICB9KSk7XG4gIH1cblxuICBoYXNGb2N1cygpIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5nZXRET01FbGVtZW50KCk7XG4gICAgcmV0dXJuIHJvb3QgJiYgcm9vdC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxRQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxTQUFBLEdBQUFGLE9BQUE7QUFFQSxJQUFBRyxNQUFBLEdBQUFDLHVCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBSyxVQUFBLEdBQUFOLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTSxTQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxTQUFBLEdBQUFSLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBUSxVQUFBLEdBQUFULHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUyxTQUFBLEdBQUFWLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVSxtQkFBQSxHQUFBVixPQUFBO0FBQ0EsSUFBQVcsaUJBQUEsR0FBQVgsT0FBQTtBQUNBLElBQUFZLGFBQUEsR0FBQVosT0FBQTtBQUNB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