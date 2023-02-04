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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSb290Q29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJyZXBvc2l0b3J5IiwieXViaWtpcmkiLCJpc1B1Ymxpc2hhYmxlIiwicmVtb3RlcyIsImdldFJlbW90ZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFN0YXRlIiwiZGlhbG9nUmVxdWVzdCIsImRpYWxvZ1JlcXVlc3RzIiwibnVsbCIsImRpclBhdGgiLCJhY3RpdmVFZGl0b3IiLCJ3b3Jrc3BhY2UiLCJnZXRBY3RpdmVUZXh0RWRpdG9yIiwicHJvamVjdFBhdGgiLCJwcm9qZWN0IiwicmVsYXRpdml6ZVBhdGgiLCJnZXRQYXRoIiwiZGlyZWN0b3JpZXMiLCJnZXREaXJlY3RvcmllcyIsIndpdGhSZXBvc2l0b3JpZXMiLCJhbGwiLCJtYXAiLCJkIiwicmVwb3NpdG9yeUZvckRpcmVjdG9yeSIsImZpcnN0VW5pbml0aWFsaXplZCIsImZpbmQiLCJyIiwiY29uZmlnIiwiZ2V0IiwiaW5pdCIsIm9uUHJvZ3Jlc3NpbmdBY2NlcHQiLCJjaG9zZW5QYXRoIiwiaW5pdGlhbGl6ZSIsImNsb3NlRGlhbG9nIiwib25DYW5jZWwiLCJvcHRzIiwiY2xvbmUiLCJ1cmwiLCJxdWVyeSIsInJlamVjdCIsImNyZWRlbnRpYWwiLCJyZXN1bHQiLCJpc3N1ZWlzaCIsIm9wZW5Jc3N1ZWlzaEl0ZW0iLCJ3b3JrZGlyIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJjb21taXQiLCJyZWYiLCJvcGVuQ29tbWl0RGV0YWlsSXRlbSIsImNyZWF0ZSIsImRvdGNvbSIsImdldEVuZHBvaW50IiwicmVsYXlFbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsImNyZWF0ZVJlcG9zaXRvcnkiLCJwdWJsaXNoIiwibG9jYWxEaXIiLCJwdWJsaXNoUmVwb3NpdG9yeSIsInRvZ2dsZSIsIkNvbW1pdFByZXZpZXdJdGVtIiwiYnVpbGRVUkkiLCJmaWxlUGF0aCIsInN0YWdpbmdTdGF0dXMiLCJnaXRUYWIiLCJnaXRUYWJUcmFja2VyIiwiZ2V0Q29tcG9uZW50IiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsImZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbiIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiZnJpZW5kbHlNZXNzYWdlIiwiZXJyIiwiZGlzbWlzc2FibGUiLCJuZXR3b3JrIiwiaWNvbiIsImRlc2NyaXB0aW9uIiwicmVzcG9uc2VUZXh0IiwiZGV0YWlsIiwiZXJyb3JzIiwiZSIsIm1lc3NhZ2UiLCJqb2luIiwic3RhY2siLCJub3RpZmljYXRpb25NYW5hZ2VyIiwiYWRkRXJyb3IiLCJhdXRvYmluZCIsInN0YXRlIiwiVGFiVHJhY2tlciIsInVyaSIsIkdpdFRhYkl0ZW0iLCJnZXRXb3Jrc3BhY2UiLCJnaXRodWJUYWJUcmFja2VyIiwiR2l0SHViVGFiSXRlbSIsInN1YnNjcmlwdGlvbiIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJvblB1bGxFcnJvciIsImVuc3VyZVZpc2libGUiLCJjb21tYW5kcyIsIm9uRGlkRGlzcGF0Y2giLCJldmVudCIsInR5cGUiLCJzdGFydHNXaXRoIiwiY29udGV4dENvbW1hbmQiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21tYW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJvcGVuVGFicyIsInJlbmRlciIsInJlbmRlckNvbW1hbmRzIiwicmVuZGVyU3RhdHVzQmFyVGlsZSIsInJlbmRlclBhbmVJdGVtcyIsInJlbmRlckRpYWxvZ3MiLCJyZW5kZXJDb25mbGljdFJlc29sdmVyIiwicmVuZGVyQ29tbWVudERlY29yYXRpb25zIiwiZGV2TW9kZSIsImdsb2JhbCIsImF0b20iLCJpbkRldk1vZGUiLCJpbnN0YWxsUmVhY3REZXZUb29scyIsInRvZ2dsZUNvbW1pdFByZXZpZXdJdGVtIiwiY2xlYXJHaXRodWJUb2tlbiIsInNob3dXYXRlcmZhbGxEaWFnbm9zdGljcyIsInNob3dDYWNoZURpYWdub3N0aWNzIiwidG9nZ2xlRm9jdXMiLCJvcGVuSW5pdGlhbGl6ZURpYWxvZyIsIm9wZW5DbG9uZURpYWxvZyIsIm9wZW5Jc3N1ZWlzaERpYWxvZyIsIm9wZW5Db21taXREaWFsb2ciLCJvcGVuQ3JlYXRlRGlhbG9nIiwidmlld1Vuc3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwidmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSIsImRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMiLCJkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMiLCJmZXRjaERhdGEiLCJkYXRhIiwiZmlsdGVyIiwiaXNHaXRodWJSZXBvIiwiaXNFbXB0eSIsIm9wZW5QdWJsaXNoRGlhbG9nIiwic3RhdHVzQmFyIiwic2IiLCJvbkNvbnN1bWVTdGF0dXNCYXIiLCJwaXBlbGluZU1hbmFnZXIiLCJ0b29sdGlwcyIsImNvbmZpcm0iLCJsb2dpbk1vZGVsIiwiY3VycmVudFdpbmRvdyIsInJlcG9ydFJlbGF5RXJyb3IiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzIiwid29ya2RpckNvbnRleHRQb29sIiwiZ2V0Q3VycmVudFdvcmtEaXJzIiwiYmluZCIsIm9uRGlkQ2hhbmdlV29ya0RpcnMiLCJvbkRpZENoYW5nZVBvb2xDb250ZXh0cyIsInVyaVBhdHRlcm4iLCJpdGVtSG9sZGVyIiwic2V0dGVyIiwiZ3JhbW1hcnMiLCJvcGVuRmlsZXMiLCJkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyIsInVuZG9MYXN0RGlzY2FyZCIsImN1cnJlbnRXb3JrRGlyIiwiY29udGV4dExvY2tlZCIsImNoYW5nZVdvcmtpbmdEaXJlY3RvcnkiLCJzZXRDb250ZXh0TG9jayIsIkNoYW5nZWRGaWxlSXRlbSIsInBhcmFtcyIsInBhdGgiLCJyZWxQYXRoIiwid29ya2luZ0RpcmVjdG9yeSIsImtleW1hcHMiLCJkaXNjYXJkTGluZXMiLCJzdXJmYWNlRnJvbUZpbGVBdFBhdGgiLCJzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uIiwiQ29tbWl0RGV0YWlsSXRlbSIsInNoYSIsInN1cmZhY2VUb1JlY2VudENvbW1pdCIsIklzc3VlaXNoRGV0YWlsSXRlbSIsImRlc2VyaWFsaXplZCIsImhvc3QiLCJvd25lciIsInJlcG8iLCJwYXJzZUludCIsImlzc3VlaXNoTnVtYmVyIiwiaW5pdFNlbGVjdGVkVGFiIiwiUmV2aWV3c0l0ZW0iLCJudW1iZXIiLCJHaXRUaW1pbmdzVmlldyIsIkdpdENhY2hlVmlldyIsInN0YXJ0T3BlbiIsImVuc3VyZVJlbmRlcmVkIiwic3RhcnRSZXZlYWxlZCIsImRvY2tzIiwiU2V0IiwicGFuZUNvbnRhaW5lckZvclVSSSIsImNvbnRhaW5lciIsInNob3ciLCJkb2NrIiwiZGV2VG9vbHNOYW1lIiwiZGV2VG9vbHMiLCJyZXF1aXJlIiwiaW5zdGFsbEV4dGVuc2lvbiIsIlJFQUNUX0RFVkVMT1BFUl9UT09MUyIsImlkIiwiYWRkU3VjY2VzcyIsImNyb3NzVW56aXBOYW1lIiwidW56aXAiLCJleHRlbnNpb25Gb2xkZXIiLCJyZW1vdGUiLCJhcHAiLCJleHRlbnNpb25GaWxlIiwiZnMiLCJlbnN1cmVEaXIiLCJkaXJuYW1lIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJCdWZmZXIiLCJmcm9tIiwiYXJyYXlCdWZmZXIiLCJ3cml0ZUZpbGUiLCJleGlzdHMiLCJkZWZhdWx0IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwiZGlzYWJsZUdpdEluZm9UaWxlIiwicmVtb3ZlVG9rZW4iLCJvcGVuIiwib25seVN0YWdlZCIsInF1aWV0bHlTZWxlY3RJdGVtIiwidmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZSIsImVkaXRvciIsImFic0ZpbGVQYXRoIiwicmVhbHBhdGgiLCJyZXBvUGF0aCIsIm5vdGlmaWNhdGlvbiIsImFkZEluZm8iLCJidXR0b25zIiwiY2xhc3NOYW1lIiwidGV4dCIsIm9uRGlkQ2xpY2siLCJkaXNtaXNzIiwiY3JlYXRlZFBhdGgiLCJpbml0aWFsaXplUmVwbyIsInNsaWNlIiwibGVuZ3RoIiwic3BsaXREaXJlY3Rpb24iLCJwYW5lIiwiZ2V0QWN0aXZlUGFuZSIsInNwbGl0UmlnaHQiLCJzcGxpdERvd24iLCJsaW5lTnVtIiwiZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24iLCJyb3ciLCJpdGVtIiwicGVuZGluZyIsImFjdGl2YXRlUGFuZSIsImFjdGl2YXRlSXRlbSIsImdldFJlYWxJdGVtUHJvbWlzZSIsImdldEZpbGVQYXRjaExvYWRlZFByb21pc2UiLCJnb1RvRGlmZkxpbmUiLCJmb2N1cyIsIkVycm9yIiwiZmlsZVBhdGhzIiwiYWJzb2x1dGVQYXRoIiwiZ2V0VW5zYXZlZEZpbGVzIiwid29ya2RpclBhdGgiLCJpc01vZGlmaWVkQnlQYXRoIiwiTWFwIiwiZ2V0VGV4dEVkaXRvcnMiLCJmb3JFYWNoIiwic2V0IiwiaXNNb2RpZmllZCIsImVuc3VyZU5vVW5zYXZlZEZpbGVzIiwidW5zYXZlZEZpbGVzIiwiZGVzdHJ1Y3RpdmVBY3Rpb24iLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJtdWx0aUZpbGVQYXRjaCIsImxpbmVzIiwiZ2V0RmlsZVBhdGNoZXMiLCJkaXNjYXJkRmlsZVBhdGNoIiwiZ2V0VW5zdGFnZVBhdGNoRm9yTGluZXMiLCJhcHBseVBhdGNoVG9Xb3JrZGlyIiwiZ2V0RmlsZVBhdGhzRm9yTGFzdERpc2NhcmQiLCJwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoIiwibGFzdFNuYXBzaG90cyIsImdldExhc3RIaXN0b3J5U25hcHNob3RzIiwic25hcHNob3QiLCJyZXN1bHRzIiwicmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMiLCJwcm9jZWVkT3JQcm9tcHRCYXNlZE9uUmVzdWx0cyIsIkdpdEVycm9yIiwic3RkRXJyIiwibWF0Y2giLCJjbGVhblVwSGlzdG9yeUZvckZpbGVQYXRocyIsImNvbnNvbGUiLCJlcnJvciIsImNvbmZsaWN0cyIsImNvbmZsaWN0IiwicHJvY2VlZFdpdGhMYXN0RGlzY2FyZFVuZG8iLCJwcm9tcHRBYm91dENvbmZsaWN0cyIsImNvbmZsaWN0ZWRGaWxlcyIsImNob2ljZSIsImRldGFpbGVkTWVzc2FnZSIsIm9wZW5Db25mbGljdHNJbk5ld0VkaXRvcnMiLCJyZXN1bHRQYXRoIiwiY2xlYXJEaXNjYXJkSGlzdG9yeSIsImZpbGVQYXRoc1N0ciIsInByb21pc2VzIiwiZGVsZXRlZCIsInRoZWlyc1NoYSIsImNvbW1vbkJhc2VTaGEiLCJjdXJyZW50U2hhIiwicmVtb3ZlIiwiY29weSIsIndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgiLCJwb3BEaXNjYXJkSGlzdG9yeSIsInJlc3VsdFBhdGhzIiwiZWRpdG9yUHJvbWlzZXMiLCJmdWxsUGF0aCIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwiZW5jb2RpbmciLCJDb25mbGljdCIsImNvdW50RnJvbVN0cmVhbSIsInRoZW4iLCJjb3VudCIsInJlcG9ydE1hcmtlckNvdW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImRlc2VyaWFsaXplcnMiLCJmdW5jIiwiV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUiLCJzd2l0Y2hib2FyZCIsImluc3RhbmNlT2YiLCJTd2l0Y2hib2FyZCIsInN0cmluZyIsImJvb2wiLCJuYW1lIiwiZm9jdXNUb1Jlc3RvcmUiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJzaG91bGRSZXN0b3JlRm9jdXMiLCJ3YXNSZW5kZXJlZCIsImlzUmVuZGVyZWQiLCJ3YXNWaXNpYmxlIiwiaXNWaXNpYmxlIiwicmV2ZWFsIiwiaGlkZSIsInByb2Nlc3MiLCJuZXh0VGljayIsImhhZEZvY3VzIiwiaGFzRm9jdXMiLCJnZXRDZW50ZXIiLCJhY3RpdmF0ZSIsInNlYXJjaEFsbFBhbmVzIiwiaW5jcmVtZW50Q291bnRlciIsInJlc3RvcmVGb2N1cyIsImdldEl0ZW0iLCJwYW5lRm9yVVJJIiwicGFuZUl0ZW0iLCJpdGVtRm9yVVJJIiwiZ2V0UmVhbEl0ZW0iLCJnZXRET01FbGVtZW50IiwiZ2V0RWxlbWVudCIsImdldFBhbmVDb250YWluZXJzIiwic29tZSIsImdldFBhbmVzIiwiZ2V0QWN0aXZlSXRlbSIsImdldFVSSSIsInJvb3QiLCJjb250YWlucyJdLCJzb3VyY2VzIjpbInJvb3QtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnLi4vYXRvbS9zdGF0dXMtYmFyJztcbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi9hdG9tL3BhbmUtaXRlbSc7XG5pbXBvcnQge29wZW5Jc3N1ZWlzaEl0ZW19IGZyb20gJy4uL3ZpZXdzL29wZW4taXNzdWVpc2gtZGlhbG9nJztcbmltcG9ydCB7b3BlbkNvbW1pdERldGFpbEl0ZW19IGZyb20gJy4uL3ZpZXdzL29wZW4tY29tbWl0LWRpYWxvZyc7XG5pbXBvcnQge2NyZWF0ZVJlcG9zaXRvcnksIHB1Ymxpc2hSZXBvc2l0b3J5fSBmcm9tICcuLi92aWV3cy9jcmVhdGUtZGlhbG9nJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBDaGFuZ2VkRmlsZUl0ZW0gZnJvbSAnLi4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ29tbWl0RGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9jb21taXQtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IENvbW1pdFByZXZpZXdJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1wcmV2aWV3LWl0ZW0nO1xuaW1wb3J0IEdpdFRhYkl0ZW0gZnJvbSAnLi4vaXRlbXMvZ2l0LXRhYi1pdGVtJztcbmltcG9ydCBHaXRIdWJUYWJJdGVtIGZyb20gJy4uL2l0ZW1zL2dpdGh1Yi10YWItaXRlbSc7XG5pbXBvcnQgUmV2aWV3c0l0ZW0gZnJvbSAnLi4vaXRlbXMvcmV2aWV3cy1pdGVtJztcbmltcG9ydCBDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9jb21tZW50LWRlY29yYXRpb25zLWNvbnRhaW5lcic7XG5pbXBvcnQgRGlhbG9nc0NvbnRyb2xsZXIsIHtkaWFsb2dSZXF1ZXN0c30gZnJvbSAnLi9kaWFsb2dzLWNvbnRyb2xsZXInO1xuaW1wb3J0IFN0YXR1c0JhclRpbGVDb250cm9sbGVyIGZyb20gJy4vc3RhdHVzLWJhci10aWxlLWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlcG9zaXRvcnlDb25mbGljdENvbnRyb2xsZXIgZnJvbSAnLi9yZXBvc2l0b3J5LWNvbmZsaWN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IEdpdENhY2hlVmlldyBmcm9tICcuLi92aWV3cy9naXQtY2FjaGUtdmlldyc7XG5pbXBvcnQgR2l0VGltaW5nc1ZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0LXRpbWluZ3Mtdmlldyc7XG5pbXBvcnQgQ29uZmxpY3QgZnJvbSAnLi4vbW9kZWxzL2NvbmZsaWN0cy9jb25mbGljdCc7XG5pbXBvcnQge2dldEVuZHBvaW50fSBmcm9tICcuLi9tb2RlbHMvZW5kcG9pbnQnO1xuaW1wb3J0IFN3aXRjaGJvYXJkIGZyb20gJy4uL3N3aXRjaGJvYXJkJztcbmltcG9ydCB7V29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zLCBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMsIGF1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7R2l0RXJyb3J9IGZyb20gJy4uL2dpdC1zaGVsbC1vdXQtc3RyYXRlZ3knO1xuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyLCBhZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb290Q29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQXRvbSBlbnZpb3JubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZGVzZXJpYWxpemVyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBncmFtbWFyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb2plY3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRXaW5kb3c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIE1vZGVsc1xuICAgIGxvZ2luTW9kZWw6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHN0YXR1c0JhcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzd2l0Y2hib2FyZDogUHJvcFR5cGVzLmluc3RhbmNlT2YoU3dpdGNoYm9hcmQpLFxuICAgIHBpcGVsaW5lTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIGN1cnJlbnRXb3JrRGlyOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gR2l0IGFjdGlvbnNcbiAgICBpbml0aWFsaXplOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNsb25lOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29udHJvbFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdGFydE9wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIHN0YXJ0UmV2ZWFsZWQ6IFByb3BUeXBlcy5ib29sLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzd2l0Y2hib2FyZDogbmV3IFN3aXRjaGJvYXJkKCksXG4gICAgc3RhcnRPcGVuOiBmYWxzZSxcbiAgICBzdGFydFJldmVhbGVkOiBmYWxzZSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdpbnN0YWxsUmVhY3REZXZUb29scycsICdjbGVhckdpdGh1YlRva2VuJyxcbiAgICAgICdzaG93V2F0ZXJmYWxsRGlhZ25vc3RpY3MnLCAnc2hvd0NhY2hlRGlhZ25vc3RpY3MnLFxuICAgICAgJ2Rlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMnLCAnZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zJyxcbiAgICAgICdxdWlldGx5U2VsZWN0SXRlbScsICd2aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUnLFxuICAgICAgJ3ZpZXdTdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUnLCAnb3BlbkZpbGVzJywgJ2dldFVuc2F2ZWRGaWxlcycsICdlbnN1cmVOb1Vuc2F2ZWRGaWxlcycsXG4gICAgICAnZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMnLCAnZGlzY2FyZExpbmVzJywgJ3VuZG9MYXN0RGlzY2FyZCcsICdyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzJyxcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRpYWxvZ1JlcXVlc3Q6IGRpYWxvZ1JlcXVlc3RzLm51bGwsXG4gICAgfTtcblxuICAgIHRoaXMuZ2l0VGFiVHJhY2tlciA9IG5ldyBUYWJUcmFja2VyKCdnaXQnLCB7XG4gICAgICB1cmk6IEdpdFRhYkl0ZW0uYnVpbGRVUkkoKSxcbiAgICAgIGdldFdvcmtzcGFjZTogKCkgPT4gdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLmdpdGh1YlRhYlRyYWNrZXIgPSBuZXcgVGFiVHJhY2tlcignZ2l0aHViJywge1xuICAgICAgdXJpOiBHaXRIdWJUYWJJdGVtLmJ1aWxkVVJJKCksXG4gICAgICBnZXRXb3Jrc3BhY2U6ICgpID0+IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5vblB1bGxFcnJvcih0aGlzLmdpdFRhYlRyYWNrZXIuZW5zdXJlVmlzaWJsZSksXG4gICAgKTtcblxuICAgIHRoaXMucHJvcHMuY29tbWFuZHMub25EaWREaXNwYXRjaChldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQudHlwZSAmJiBldmVudC50eXBlLnN0YXJ0c1dpdGgoJ2dpdGh1YjonKVxuICAgICAgICAmJiBldmVudC5kZXRhaWwgJiYgZXZlbnQuZGV0YWlsWzBdICYmIGV2ZW50LmRldGFpbFswXS5jb250ZXh0Q29tbWFuZCkge1xuICAgICAgICBhZGRFdmVudCgnY29udGV4dC1tZW51LWFjdGlvbicsIHtcbiAgICAgICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgICAgICBjb21tYW5kOiBldmVudC50eXBlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMub3BlblRhYnMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJTdGF0dXNCYXJUaWxlKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclBhbmVJdGVtcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJEaWFsb2dzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbmZsaWN0UmVzb2x2ZXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWVudERlY29yYXRpb25zKCl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICBjb25zdCBkZXZNb2RlID0gZ2xvYmFsLmF0b20gJiYgZ2xvYmFsLmF0b20uaW5EZXZNb2RlKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAge2Rldk1vZGUgJiYgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnN0YWxsLXJlYWN0LWRldi10b29sc1wiIGNhbGxiYWNrPXt0aGlzLmluc3RhbGxSZWFjdERldlRvb2xzfSAvPn1cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1jb21taXQtcHJldmlld1wiIGNhbGxiYWNrPXt0aGlzLnRvZ2dsZUNvbW1pdFByZXZpZXdJdGVtfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6bG9nb3V0XCIgY2FsbGJhY2s9e3RoaXMuY2xlYXJHaXRodWJUb2tlbn0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNob3ctd2F0ZXJmYWxsLWRpYWdub3N0aWNzXCIgY2FsbGJhY2s9e3RoaXMuc2hvd1dhdGVyZmFsbERpYWdub3N0aWNzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy1jYWNoZS1kaWFnbm9zdGljc1wiIGNhbGxiYWNrPXt0aGlzLnNob3dDYWNoZURpYWdub3N0aWNzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdC10YWJcIiBjYWxsYmFjaz17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXQtdGFiLWZvY3VzXCIgY2FsbGJhY2s9e3RoaXMuZ2l0VGFiVHJhY2tlci50b2dnbGVGb2N1c30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXRodWItdGFiXCIgY2FsbGJhY2s9e3RoaXMuZ2l0aHViVGFiVHJhY2tlci50b2dnbGV9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZ2l0aHViLXRhYi1mb2N1c1wiIGNhbGxiYWNrPXt0aGlzLmdpdGh1YlRhYlRyYWNrZXIudG9nZ2xlRm9jdXN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjppbml0aWFsaXplXCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkluaXRpYWxpemVEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNsb25lXCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkNsb25lRGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpvcGVuLWlzc3VlLW9yLXB1bGwtcmVxdWVzdFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5Jc3N1ZWlzaERpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6b3Blbi1jb21taXRcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuQ29tbWl0RGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpjcmVhdGUtcmVwb3NpdG9yeVwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5DcmVhdGVEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1Yjp2aWV3LXVuc3RhZ2VkLWNoYW5nZXMtZm9yLWN1cnJlbnQtZmlsZVwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy52aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1Yjp2aWV3LXN0YWdlZC1jaGFuZ2VzLWZvci1jdXJyZW50LWZpbGVcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOmNsb3NlLWFsbC1kaWZmLXZpZXdzXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLmRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1YjpjbG9zZS1lbXB0eS1kaWZmLXZpZXdzXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLmRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9PlxuICAgICAgICAgIHtkYXRhID0+IHtcbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5pc1B1Ymxpc2hhYmxlIHx8ICFkYXRhLnJlbW90ZXMuZmlsdGVyKHIgPT4gci5pc0dpdGh1YlJlcG8oKSkuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6cHVibGlzaC1yZXBvc2l0b3J5XCJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5QdWJsaXNoRGlhbG9nKHRoaXMucHJvcHMucmVwb3NpdG9yeSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJTdGF0dXNCYXJUaWxlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3RhdHVzQmFyXG4gICAgICAgIHN0YXR1c0Jhcj17dGhpcy5wcm9wcy5zdGF0dXNCYXJ9XG4gICAgICAgIG9uQ29uc3VtZVN0YXR1c0Jhcj17c2IgPT4gdGhpcy5vbkNvbnN1bWVTdGF0dXNCYXIoc2IpfVxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhdHVzQmFyVGlsZUNvbnRyb2xsZXJcIj5cbiAgICAgICAgPFN0YXR1c0JhclRpbGVDb250cm9sbGVyXG4gICAgICAgICAgcGlwZWxpbmVNYW5hZ2VyPXt0aGlzLnByb3BzLnBpcGVsaW5lTWFuYWdlcn1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgIHRvZ2dsZUdpdFRhYj17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZX1cbiAgICAgICAgICB0b2dnbGVHaXRodWJUYWI9e3RoaXMuZ2l0aHViVGFiVHJhY2tlci50b2dnbGV9XG4gICAgICAgIC8+XG4gICAgICA8L1N0YXR1c0Jhcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGlhbG9ncygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERpYWxvZ3NDb250cm9sbGVyXG4gICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgcmVxdWVzdD17dGhpcy5zdGF0ZS5kaWFsb2dSZXF1ZXN0fVxuXG4gICAgICAgIGN1cnJlbnRXaW5kb3c9e3RoaXMucHJvcHMuY3VycmVudFdpbmRvd31cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tZW50RGVjb3JhdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lclxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29uZmxpY3RSZXNvbHZlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxSZXBvc2l0b3J5Q29uZmxpY3RDb250cm9sbGVyXG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclBhbmVJdGVtcygpIHtcbiAgICBjb25zdCB7d29ya2RpckNvbnRleHRQb29sfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZ2V0Q3VycmVudFdvcmtEaXJzID0gd29ya2RpckNvbnRleHRQb29sLmdldEN1cnJlbnRXb3JrRGlycy5iaW5kKHdvcmtkaXJDb250ZXh0UG9vbCk7XG4gICAgY29uc3Qgb25EaWRDaGFuZ2VXb3JrRGlycyA9IHdvcmtkaXJDb250ZXh0UG9vbC5vbkRpZENoYW5nZVBvb2xDb250ZXh0cy5iaW5kKHdvcmtkaXJDb250ZXh0UG9vbCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0dpdFRhYkl0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItR2l0LXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gKFxuICAgICAgICAgICAgPEdpdFRhYkl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGdyYW1tYXJzPXt0aGlzLnByb3BzLmdyYW1tYXJzfVxuICAgICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnByb3BzLnByb2plY3R9XG4gICAgICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nPXt0aGlzLm9wZW5Jbml0aWFsaXplRGlhbG9nfVxuICAgICAgICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICAgICAgICBlbnN1cmVHaXRUYWI9e3RoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVWaXNpYmxlfVxuICAgICAgICAgICAgICBvcGVuRmlsZXM9e3RoaXMub3BlbkZpbGVzfVxuICAgICAgICAgICAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocz17dGhpcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoc31cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICAgICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXtnZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e29uRGlkQ2hhbmdlV29ya0RpcnN9XG4gICAgICAgICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtHaXRIdWJUYWJJdGVtLnVyaVBhdHRlcm59XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdEh1Yi1yb290XCI+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlcn0pID0+IChcbiAgICAgICAgICAgIDxHaXRIdWJUYWJJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG4gICAgICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXtnZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e29uRGlkQ2hhbmdlV29ya0RpcnN9XG4gICAgICAgICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cbiAgICAgICAgICAgICAgb3BlbkNyZWF0ZURpYWxvZz17dGhpcy5vcGVuQ3JlYXRlRGlhbG9nfVxuICAgICAgICAgICAgICBvcGVuUHVibGlzaERpYWxvZz17dGhpcy5vcGVuUHVibGlzaERpYWxvZ31cbiAgICAgICAgICAgICAgb3BlbkNsb25lRGlhbG9nPXt0aGlzLm9wZW5DbG9uZURpYWxvZ31cbiAgICAgICAgICAgICAgb3BlbkdpdFRhYj17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZUZvY3VzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0NoYW5nZWRGaWxlSXRlbS51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8Q2hhbmdlZEZpbGVJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgcmVsUGF0aD17cGF0aC5qb2luKC4uLnBhcmFtcy5yZWxQYXRoKX1cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHN0YWdpbmdTdGF0dXM9e3BhcmFtcy5zdGFnaW5nU3RhdHVzfVxuXG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIGRpc2NhcmRMaW5lcz17dGhpcy5kaXNjYXJkTGluZXN9XG4gICAgICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgICAgICAgIHN1cmZhY2VGaWxlQXRQYXRoPXt0aGlzLnN1cmZhY2VGcm9tRmlsZUF0UGF0aH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtDb21taXRQcmV2aWV3SXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRQcmV2aWV3LXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8Q29tbWl0UHJldmlld0l0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXtwYXJhbXMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgICAgICAgZGlzY2FyZExpbmVzPXt0aGlzLmRpc2NhcmRMaW5lc31cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICAgICAgc3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbj17dGhpcy5zdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0NvbW1pdERldGFpbEl0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsLXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8Q29tbWl0RGV0YWlsSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICBzaGE9e3BhcmFtcy5zaGF9XG4gICAgICAgICAgICAgIHN1cmZhY2VDb21taXQ9e3RoaXMuc3VyZmFjZVRvUmVjZW50Q29tbWl0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj17SXNzdWVpc2hEZXRhaWxJdGVtLnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtcywgZGVzZXJpYWxpemVkfSkgPT4gKFxuICAgICAgICAgICAgPElzc3VlaXNoRGV0YWlsSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIGhvc3Q9e3BhcmFtcy5ob3N0fVxuICAgICAgICAgICAgICBvd25lcj17cGFyYW1zLm93bmVyfVxuICAgICAgICAgICAgICByZXBvPXtwYXJhbXMucmVwb31cbiAgICAgICAgICAgICAgaXNzdWVpc2hOdW1iZXI9e3BhcnNlSW50KHBhcmFtcy5pc3N1ZWlzaE51bWJlciwgMTApfVxuXG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIGluaXRTZWxlY3RlZFRhYj17ZGVzZXJpYWxpemVkLmluaXRTZWxlY3RlZFRhYn1cblxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtSZXZpZXdzSXRlbS51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8UmV2aWV3c0l0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICBob3N0PXtwYXJhbXMuaG9zdH1cbiAgICAgICAgICAgICAgb3duZXI9e3BhcmFtcy5vd25lcn1cbiAgICAgICAgICAgICAgcmVwbz17cGFyYW1zLnJlcG99XG4gICAgICAgICAgICAgIG51bWJlcj17cGFyc2VJbnQocGFyYW1zLm51bWJlciwgMTApfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXI9e3BhcmFtcy53b3JrZGlyfVxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtHaXRUaW1pbmdzVmlldy51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gPEdpdFRpbWluZ3NWaWV3IHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9IC8+fVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj17R2l0Q2FjaGVWaWV3LnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiA8R2l0Q2FjaGVWaWV3IHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9IHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX0gLz59XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICBmZXRjaERhdGEgPSByZXBvc2l0b3J5ID0+IHl1YmlraXJpKHtcbiAgICBpc1B1Ymxpc2hhYmxlOiByZXBvc2l0b3J5LmlzUHVibGlzaGFibGUoKSxcbiAgICByZW1vdGVzOiByZXBvc2l0b3J5LmdldFJlbW90ZXMoKSxcbiAgfSk7XG5cbiAgYXN5bmMgb3BlblRhYnMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RhcnRPcGVuKSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHRoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVSZW5kZXJlZChmYWxzZSksXG4gICAgICAgIHRoaXMuZ2l0aHViVGFiVHJhY2tlci5lbnN1cmVSZW5kZXJlZChmYWxzZSksXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGFydFJldmVhbGVkKSB7XG4gICAgICBjb25zdCBkb2NrcyA9IG5ldyBTZXQoXG4gICAgICAgIFtHaXRUYWJJdGVtLmJ1aWxkVVJJKCksIEdpdEh1YlRhYkl0ZW0uYnVpbGRVUkkoKV1cbiAgICAgICAgICAubWFwKHVyaSA9PiB0aGlzLnByb3BzLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9yVVJJKHVyaSkpXG4gICAgICAgICAgLmZpbHRlcihjb250YWluZXIgPT4gY29udGFpbmVyICYmICh0eXBlb2YgY29udGFpbmVyLnNob3cpID09PSAnZnVuY3Rpb24nKSxcbiAgICAgICk7XG5cbiAgICAgIGZvciAoY29uc3QgZG9jayBvZiBkb2Nrcykge1xuICAgICAgICBkb2NrLnNob3coKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBpbnN0YWxsUmVhY3REZXZUb29scygpIHtcbiAgICAvLyBQcmV2ZW50IGVsZWN0cm9uLWxpbmsgZnJvbSBhdHRlbXB0aW5nIHRvIGRlc2NlbmQgaW50byBlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXIsIHdoaWNoIGlzIG5vdCBhdmFpbGFibGVcbiAgICAvLyB3aGVuIHdlJ3JlIGJ1bmRsZWQgaW4gQXRvbS5cbiAgICBjb25zdCBkZXZUb29sc05hbWUgPSAnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJztcbiAgICBjb25zdCBkZXZUb29scyA9IHJlcXVpcmUoZGV2VG9vbHNOYW1lKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuaW5zdGFsbEV4dGVuc2lvbihkZXZUb29scy5SRUFDVF9ERVZFTE9QRVJfVE9PTFMuaWQpLFxuICAgICAgLy8gcmVsYXkgZGV2ZWxvcGVyIHRvb2xzIGV4dGVuc2lvbiBpZFxuICAgICAgdGhpcy5pbnN0YWxsRXh0ZW5zaW9uKCduY2Vkb2JwZ25ta2hjbW5ua2NpbW5vYnBmZXBpZGFkbCcpLFxuICAgIF0pO1xuXG4gICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZFN1Y2Nlc3MoJ/CfjIggUmVsb2FkIHlvdXIgd2luZG93IHRvIHN0YXJ0IHVzaW5nIHRoZSBSZWFjdC9SZWxheSBkZXYgdG9vbHMhJyk7XG4gIH1cblxuICBhc3luYyBpbnN0YWxsRXh0ZW5zaW9uKGlkKSB7XG4gICAgY29uc3QgZGV2VG9vbHNOYW1lID0gJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcic7XG4gICAgY29uc3QgZGV2VG9vbHMgPSByZXF1aXJlKGRldlRvb2xzTmFtZSk7XG5cbiAgICBjb25zdCBjcm9zc1VuemlwTmFtZSA9ICdjcm9zcy11bnppcCc7XG4gICAgY29uc3QgdW56aXAgPSByZXF1aXJlKGNyb3NzVW56aXBOYW1lKTtcblxuICAgIGNvbnN0IHVybCA9XG4gICAgICAnaHR0cHM6Ly9jbGllbnRzMi5nb29nbGUuY29tL3NlcnZpY2UvdXBkYXRlMi9jcng/JyArXG4gICAgICBgcmVzcG9uc2U9cmVkaXJlY3QmeD1pZCUzRCR7aWR9JTI2dWMmcHJvZHZlcnNpb249MzJgO1xuICAgIGNvbnN0IGV4dGVuc2lvbkZvbGRlciA9IHBhdGgucmVzb2x2ZShyZW1vdGUuYXBwLmdldFBhdGgoJ3VzZXJEYXRhJyksIGBleHRlbnNpb25zLyR7aWR9YCk7XG4gICAgY29uc3QgZXh0ZW5zaW9uRmlsZSA9IGAke2V4dGVuc2lvbkZvbGRlcn0uY3J4YDtcbiAgICBhd2FpdCBmcy5lbnN1cmVEaXIocGF0aC5kaXJuYW1lKGV4dGVuc2lvbkZpbGUpKTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge21ldGhvZDogJ0dFVCd9KTtcbiAgICBjb25zdCBib2R5ID0gQnVmZmVyLmZyb20oYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSk7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKGV4dGVuc2lvbkZpbGUsIGJvZHkpO1xuXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdW56aXAoZXh0ZW5zaW9uRmlsZSwgZXh0ZW5zaW9uRm9sZGVyLCBhc3luYyBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyICYmICFhd2FpdCBmcy5leGlzdHMocGF0aC5qb2luKGV4dGVuc2lvbkZvbGRlciwgJ21hbmlmZXN0Lmpzb24nKSkpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgZnMuZW5zdXJlRGlyKGV4dGVuc2lvbkZvbGRlciwgMG83NTUpO1xuICAgIGF3YWl0IGRldlRvb2xzLmRlZmF1bHQoaWQpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm9uUHVsbEVycm9yKCgpID0+IHRoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVWaXNpYmxlKCkpLFxuICAgICk7XG4gIH1cblxuICBvbkNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgaWYgKHN0YXR1c0Jhci5kaXNhYmxlR2l0SW5mb1RpbGUpIHtcbiAgICAgIHN0YXR1c0Jhci5kaXNhYmxlR2l0SW5mb1RpbGUoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckdpdGh1YlRva2VuKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmxvZ2luTW9kZWwucmVtb3ZlVG9rZW4oJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nKTtcbiAgfVxuXG4gIGNsb3NlRGlhbG9nID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0OiBkaWFsb2dSZXF1ZXN0cy5udWxsfSwgcmVzb2x2ZSkpO1xuXG4gIG9wZW5Jbml0aWFsaXplRGlhbG9nID0gYXN5bmMgZGlyUGF0aCA9PiB7XG4gICAgaWYgKCFkaXJQYXRoKSB7XG4gICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICBpZiAoYWN0aXZlRWRpdG9yKSB7XG4gICAgICAgIGNvbnN0IFtwcm9qZWN0UGF0aF0gPSB0aGlzLnByb3BzLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYWN0aXZlRWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICAgIGRpclBhdGggPSBwcm9qZWN0UGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZGlyUGF0aCkge1xuICAgICAgY29uc3QgZGlyZWN0b3JpZXMgPSB0aGlzLnByb3BzLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKTtcbiAgICAgIGNvbnN0IHdpdGhSZXBvc2l0b3JpZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgZGlyZWN0b3JpZXMubWFwKGFzeW5jIGQgPT4gW2QsIGF3YWl0IHRoaXMucHJvcHMucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGQpXSksXG4gICAgICApO1xuICAgICAgY29uc3QgZmlyc3RVbmluaXRpYWxpemVkID0gd2l0aFJlcG9zaXRvcmllcy5maW5kKChbZCwgcl0pID0+ICFyKTtcbiAgICAgIGlmIChmaXJzdFVuaW5pdGlhbGl6ZWQgJiYgZmlyc3RVbmluaXRpYWxpemVkWzBdKSB7XG4gICAgICAgIGRpclBhdGggPSBmaXJzdFVuaW5pdGlhbGl6ZWRbMF0uZ2V0UGF0aCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZGlyUGF0aCkge1xuICAgICAgZGlyUGF0aCA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnY29yZS5wcm9qZWN0SG9tZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5pbml0KHtkaXJQYXRofSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIGNob3NlblBhdGggPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5pbml0aWFsaXplKGNob3NlblBhdGgpO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNsb25lRGlhbG9nID0gb3B0cyA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNsb25lKG9wdHMpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyAodXJsLCBjaG9zZW5QYXRoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLmNsb25lKHVybCwgY2hvc2VuUGF0aCk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ3JlZGVudGlhbHNEaWFsb2cgPSBxdWVyeSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5jcmVkZW50aWFsKHF1ZXJ5KTtcbiAgICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICAgIH0pO1xuICAgICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0pO1xuICAgIH0pO1xuICB9XG5cbiAgb3Blbklzc3VlaXNoRGlhbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5pc3N1ZWlzaCgpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyB1cmwgPT4ge1xuICAgICAgYXdhaXQgb3Blbklzc3VlaXNoSXRlbSh1cmwsIHtcbiAgICAgICAgd29ya3NwYWNlOiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICAgICAgd29ya2RpcjogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5Db21taXREaWFsb2cgPSAoKSA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNvbW1pdCgpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZWYgPT4ge1xuICAgICAgYXdhaXQgb3BlbkNvbW1pdERldGFpbEl0ZW0ocmVmLCB7XG4gICAgICAgIHdvcmtzcGFjZTogdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgICAgIHJlcG9zaXRvcnk6IHRoaXMucHJvcHMucmVwb3NpdG9yeSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNyZWF0ZURpYWxvZyA9ICgpID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY3JlYXRlKCk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICBjb25zdCBkb3Rjb20gPSBnZXRFbmRwb2ludCgnZ2l0aHViLmNvbScpO1xuICAgICAgY29uc3QgcmVsYXlFbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QoZG90Y29tKTtcblxuICAgICAgYXdhaXQgY3JlYXRlUmVwb3NpdG9yeShyZXN1bHQsIHtjbG9uZTogdGhpcy5wcm9wcy5jbG9uZSwgcmVsYXlFbnZpcm9ubWVudH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlblB1Ymxpc2hEaWFsb2cgPSByZXBvc2l0b3J5ID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMucHVibGlzaCh7bG9jYWxEaXI6IHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKX0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZXN1bHQgPT4ge1xuICAgICAgY29uc3QgZG90Y29tID0gZ2V0RW5kcG9pbnQoJ2dpdGh1Yi5jb20nKTtcbiAgICAgIGNvbnN0IHJlbGF5RW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KGRvdGNvbSk7XG5cbiAgICAgIGF3YWl0IHB1Ymxpc2hSZXBvc2l0b3J5KHJlc3VsdCwge3JlcG9zaXRvcnksIHJlbGF5RW52aXJvbm1lbnR9KTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIHRvZ2dsZUNvbW1pdFByZXZpZXdJdGVtID0gKCkgPT4ge1xuICAgIGNvbnN0IHdvcmtkaXIgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2UudG9nZ2xlKENvbW1pdFByZXZpZXdJdGVtLmJ1aWxkVVJJKHdvcmtkaXIpKTtcbiAgfVxuXG4gIHNob3dXYXRlcmZhbGxEaWFnbm9zdGljcygpIHtcbiAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKEdpdFRpbWluZ3NWaWV3LmJ1aWxkVVJJKCkpO1xuICB9XG5cbiAgc2hvd0NhY2hlRGlhZ25vc3RpY3MoKSB7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihHaXRDYWNoZVZpZXcuYnVpbGRVUkkoKSk7XG4gIH1cblxuICBzdXJmYWNlRnJvbUZpbGVBdFBhdGggPSAoZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIuZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gIH1cblxuICBzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uID0gKCkgPT4ge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5mb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKTtcbiAgfVxuXG4gIHN1cmZhY2VUb1JlY2VudENvbW1pdCA9ICgpID0+IHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIuZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKTtcbiAgfVxuXG4gIGRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMoKSB7XG4gICAgZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZDogZmFsc2V9LCB0aGlzLnByb3BzLndvcmtzcGFjZSk7XG4gIH1cblxuICBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMoKSB7XG4gICAgZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zKHRoaXMucHJvcHMud29ya3NwYWNlKTtcbiAgfVxuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgY29uc3QgZ2l0VGFiID0gdGhpcy5naXRUYWJUcmFja2VyLmdldENvbXBvbmVudCgpO1xuICAgIHJldHVybiBnaXRUYWIgJiYgZ2l0VGFiLnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgfVxuXG4gIGFzeW5jIHZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoc3RhZ2luZ1N0YXR1cykge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvci5nZXRQYXRoKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBhYnNGaWxlUGF0aCA9IGF3YWl0IGZzLnJlYWxwYXRoKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgIGNvbnN0IHJlcG9QYXRoID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCk7XG4gICAgaWYgKHJlcG9QYXRoID09PSBudWxsKSB7XG4gICAgICBjb25zdCBbcHJvamVjdFBhdGhdID0gdGhpcy5wcm9wcy5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEluZm8oXG4gICAgICAgIFwiSG1tLCB0aGVyZSdzIG5vdGhpbmcgdG8gY29tcGFyZSB0aGlzIGZpbGUgdG9cIixcbiAgICAgICAge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnWW91IGNhbiBjcmVhdGUgYSBHaXQgcmVwb3NpdG9yeSB0byB0cmFjayBjaGFuZ2VzIHRvIHRoZSBmaWxlcyBpbiB5b3VyIHByb2plY3QuJyxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBidXR0b25zOiBbe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgIHRleHQ6ICdDcmVhdGUgYSByZXBvc2l0b3J5IG5vdycsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWRQYXRoID0gYXdhaXQgdGhpcy5pbml0aWFsaXplUmVwbyhwcm9qZWN0UGF0aCk7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIGNvbmZpcm1lZCByZXBvc2l0b3J5IGNyZWF0aW9uIGZvciB0aGlzIHByb2plY3QgcGF0aCxcbiAgICAgICAgICAgICAgLy8gcmV0cnkgdGhlIG9wZXJhdGlvbiB0aGF0IGdvdCB0aGVtIGhlcmUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICAgICAgICAgIGlmIChjcmVhdGVkUGF0aCA9PT0gcHJvamVjdFBhdGgpIHsgdGhpcy52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKHN0YWdpbmdTdGF0dXMpOyB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGFic0ZpbGVQYXRoLnN0YXJ0c1dpdGgocmVwb1BhdGgpKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGFic0ZpbGVQYXRoLnNsaWNlKHJlcG9QYXRoLmxlbmd0aCArIDEpO1xuICAgICAgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gICAgICBjb25zdCBzcGxpdERpcmVjdGlvbiA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGVEaWZmUGFuZVNwbGl0RGlyZWN0aW9uJyk7XG4gICAgICBjb25zdCBwYW5lID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgaWYgKHNwbGl0RGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgIHBhbmUuc3BsaXRSaWdodCgpO1xuICAgICAgfSBlbHNlIGlmIChzcGxpdERpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XG4gICAgICAgIHBhbmUuc3BsaXREb3duKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBsaW5lTnVtID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKFxuICAgICAgICBDaGFuZ2VkRmlsZUl0ZW0uYnVpbGRVUkkoZmlsZVBhdGgsIHJlcG9QYXRoLCBzdGFnaW5nU3RhdHVzKSxcbiAgICAgICAge3BlbmRpbmc6IHRydWUsIGFjdGl2YXRlUGFuZTogdHJ1ZSwgYWN0aXZhdGVJdGVtOiB0cnVlfSxcbiAgICAgICk7XG4gICAgICBhd2FpdCBpdGVtLmdldFJlYWxJdGVtUHJvbWlzZSgpO1xuICAgICAgYXdhaXQgaXRlbS5nZXRGaWxlUGF0Y2hMb2FkZWRQcm9taXNlKCk7XG4gICAgICBpdGVtLmdvVG9EaWZmTGluZShsaW5lTnVtKTtcbiAgICAgIGl0ZW0uZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Fic0ZpbGVQYXRofSBkb2VzIG5vdCBiZWxvbmcgdG8gcmVwbyAke3JlcG9QYXRofWApO1xuICAgIH1cbiAgfVxuXG4gIHZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKCd1bnN0YWdlZCcpO1xuICB9XG5cbiAgdmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKCdzdGFnZWQnKTtcbiAgfVxuXG4gIG9wZW5GaWxlcyhmaWxlUGF0aHMsIHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoZmlsZVBhdGhzLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLmpvaW4ocmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCBmaWxlUGF0aCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihhYnNvbHV0ZVBhdGgsIHtwZW5kaW5nOiBmaWxlUGF0aHMubGVuZ3RoID09PSAxfSk7XG4gICAgfSkpO1xuICB9XG5cbiAgZ2V0VW5zYXZlZEZpbGVzKGZpbGVQYXRocywgd29ya2RpclBhdGgpIHtcbiAgICBjb25zdCBpc01vZGlmaWVkQnlQYXRoID0gbmV3IE1hcCgpO1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChlZGl0b3IgPT4ge1xuICAgICAgaXNNb2RpZmllZEJ5UGF0aC5zZXQoZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmlzTW9kaWZpZWQoKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbGVQYXRocy5maWx0ZXIoZmlsZVBhdGggPT4ge1xuICAgICAgY29uc3QgYWJzRmlsZVBhdGggPSBwYXRoLmpvaW4od29ya2RpclBhdGgsIGZpbGVQYXRoKTtcbiAgICAgIHJldHVybiBpc01vZGlmaWVkQnlQYXRoLmdldChhYnNGaWxlUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICBlbnN1cmVOb1Vuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsIG1lc3NhZ2UsIHdvcmtkaXJQYXRoID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpIHtcbiAgICBjb25zdCB1bnNhdmVkRmlsZXMgPSB0aGlzLmdldFVuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsIHdvcmtkaXJQYXRoKS5tYXAoZmlsZVBhdGggPT4gYFxcYCR7ZmlsZVBhdGh9XFxgYCkuam9pbignPGJyPicpO1xuICAgIGlmICh1bnNhdmVkRmlsZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYFlvdSBoYXZlIHVuc2F2ZWQgY2hhbmdlcyBpbjo8YnI+JHt1bnNhdmVkRmlsZXN9LmAsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpIHtcbiAgICBjb25zdCBkZXN0cnVjdGl2ZUFjdGlvbiA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMoZmlsZVBhdGhzKTtcbiAgICB9O1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKFxuICAgICAgZmlsZVBhdGhzLFxuICAgICAgKCkgPT4gdGhpcy5lbnN1cmVOb1Vuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsICdDYW5ub3QgZGlzY2FyZCBjaGFuZ2VzIGluIHNlbGVjdGVkIGZpbGVzLicpLFxuICAgICAgZGVzdHJ1Y3RpdmVBY3Rpb24sXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGRpc2NhcmRMaW5lcyhtdWx0aUZpbGVQYXRjaCwgbGluZXMsIHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICAvLyAoa3V5Y2hhY28pIEZvciBub3cgd2Ugb25seSBzdXBwb3J0IGRpc2NhcmRpbmcgcm93cyBmb3IgTXVsdGlGaWxlUGF0Y2hlcyB0aGF0IGNvbnRhaW4gYSBzaW5nbGUgZmlsZSBwYXRjaFxuICAgIC8vIFRoZSBvbmx5IHdheSB0byBhY2Nlc3MgdGhpcyBtZXRob2QgZnJvbSB0aGUgVUkgaXMgdG8gYmUgaW4gYSBDaGFuZ2VkRmlsZUl0ZW0sIHdoaWNoIG9ubHkgaGFzIGEgc2luZ2xlIGZpbGUgcGF0Y2hcbiAgICBpZiAobXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKS5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSBtdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpWzBdLmdldFBhdGgoKTtcbiAgICBjb25zdCBkZXN0cnVjdGl2ZUFjdGlvbiA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRpc2NhcmRGaWxlUGF0Y2ggPSBtdWx0aUZpbGVQYXRjaC5nZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhsaW5lcyk7XG4gICAgICBhd2FpdCByZXBvc2l0b3J5LmFwcGx5UGF0Y2hUb1dvcmtkaXIoZGlzY2FyZEZpbGVQYXRjaCk7XG4gICAgfTtcbiAgICByZXR1cm4gYXdhaXQgcmVwb3NpdG9yeS5zdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoXG4gICAgICBbZmlsZVBhdGhdLFxuICAgICAgKCkgPT4gdGhpcy5lbnN1cmVOb1Vuc2F2ZWRGaWxlcyhbZmlsZVBhdGhdLCAnQ2Fubm90IGRpc2NhcmQgbGluZXMuJywgcmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpKSxcbiAgICAgIGRlc3RydWN0aXZlQWN0aW9uLFxuICAgICAgZmlsZVBhdGgsXG4gICAgKTtcbiAgfVxuXG4gIGdldEZpbGVQYXRoc0Zvckxhc3REaXNjYXJkKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgbGV0IGxhc3RTbmFwc2hvdHMgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgaWYgKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpIHtcbiAgICAgIGxhc3RTbmFwc2hvdHMgPSBsYXN0U25hcHNob3RzID8gW2xhc3RTbmFwc2hvdHNdIDogW107XG4gICAgfVxuICAgIHJldHVybiBsYXN0U25hcHNob3RzLm1hcChzbmFwc2hvdCA9PiBzbmFwc2hvdC5maWxlUGF0aCk7XG4gIH1cblxuICBhc3luYyB1bmRvTGFzdERpc2NhcmQocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwsIHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLmdldEZpbGVQYXRoc0Zvckxhc3REaXNjYXJkKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcmVwb3NpdG9yeS5yZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyhcbiAgICAgICAgKCkgPT4gdGhpcy5lbnN1cmVOb1Vuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsICdDYW5ub3QgdW5kbyBsYXN0IGRpc2NhcmQuJyksXG4gICAgICAgIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgsXG4gICAgICApO1xuICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuICAgICAgYXdhaXQgdGhpcy5wcm9jZWVkT3JQcm9tcHRCYXNlZE9uUmVzdWx0cyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEdpdEVycm9yICYmIGUuc3RkRXJyLm1hdGNoKC9mYXRhbDogTm90IGEgdmFsaWQgb2JqZWN0IG5hbWUvKSkge1xuICAgICAgICB0aGlzLmNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzKGZpbGVQYXRocywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3QgY29uZmxpY3RzID0gcmVzdWx0cy5maWx0ZXIoKHtjb25mbGljdH0pID0+IGNvbmZsaWN0KTtcbiAgICBpZiAoY29uZmxpY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9tcHRBYm91dENvbmZsaWN0cyhyZXN1bHRzLCBjb25mbGljdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByb21wdEFib3V0Q29uZmxpY3RzKHJlc3VsdHMsIGNvbmZsaWN0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBjb25mbGljdGVkRmlsZXMgPSBjb25mbGljdHMubWFwKCh7ZmlsZVBhdGh9KSA9PiBgXFx0JHtmaWxlUGF0aH1gKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgbWVzc2FnZTogJ1VuZG9pbmcgd2lsbCByZXN1bHQgaW4gY29uZmxpY3RzLi4uJyxcbiAgICAgIGRldGFpbGVkTWVzc2FnZTogYGZvciB0aGUgZm9sbG93aW5nIGZpbGVzOlxcbiR7Y29uZmxpY3RlZEZpbGVzfVxcbmAgK1xuICAgICAgICAnV291bGQgeW91IGxpa2UgdG8gYXBwbHkgdGhlIGNoYW5nZXMgd2l0aCBtZXJnZSBjb25mbGljdCBtYXJrZXJzLCAnICtcbiAgICAgICAgJ29yIG9wZW4gdGhlIHRleHQgd2l0aCBtZXJnZSBjb25mbGljdCBtYXJrZXJzIGluIGEgbmV3IGZpbGU/JyxcbiAgICAgIGJ1dHRvbnM6IFsnTWVyZ2Ugd2l0aCBjb25mbGljdCBtYXJrZXJzJywgJ09wZW4gaW4gbmV3IGZpbGUnLCAnQ2FuY2VsJ10sXG4gICAgfSk7XG4gICAgaWYgKGNob2ljZSA9PT0gMCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGNob2ljZSA9PT0gMSkge1xuICAgICAgYXdhaXQgdGhpcy5vcGVuQ29uZmxpY3RzSW5OZXdFZGl0b3JzKGNvbmZsaWN0cy5tYXAoKHtyZXN1bHRQYXRofSkgPT4gcmVzdWx0UGF0aCkpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzKGZpbGVQYXRocywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY2xlYXJEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBjb25zdCBmaWxlUGF0aHNTdHIgPSBmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IGBcXGAke2ZpbGVQYXRofVxcYGApLmpvaW4oJzxicj4nKTtcbiAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoXG4gICAgICAnRGlzY2FyZCBoaXN0b3J5IGhhcyBleHBpcmVkLicsXG4gICAgICB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBgQ2Fubm90IHVuZG8gZGlzY2FyZCBmb3I8YnI+JHtmaWxlUGF0aHNTdHJ9PGJyPlN0YWxlIGRpc2NhcmQgaGlzdG9yeSBoYXMgYmVlbiBkZWxldGVkLmAsXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VlZFdpdGhMYXN0RGlzY2FyZFVuZG8ocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IHJlc3VsdHMubWFwKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIHJlc3VsdFBhdGgsIGRlbGV0ZWQsIGNvbmZsaWN0LCB0aGVpcnNTaGEsIGNvbW1vbkJhc2VTaGEsIGN1cnJlbnRTaGF9ID0gcmVzdWx0O1xuICAgICAgY29uc3QgYWJzRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksIGZpbGVQYXRoKTtcbiAgICAgIGlmIChkZWxldGVkICYmIHJlc3VsdFBhdGggPT09IG51bGwpIHtcbiAgICAgICAgYXdhaXQgZnMucmVtb3ZlKGFic0ZpbGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGZzLmNvcHkocmVzdWx0UGF0aCwgYWJzRmlsZVBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZsaWN0KSB7XG4gICAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS53cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBjdXJyZW50U2hhLCB0aGVpcnNTaGEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkucG9wRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICBhc3luYyBvcGVuQ29uZmxpY3RzSW5OZXdFZGl0b3JzKHJlc3VsdFBhdGhzKSB7XG4gICAgY29uc3QgZWRpdG9yUHJvbWlzZXMgPSByZXN1bHRQYXRocy5tYXAocmVzdWx0UGF0aCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihyZXN1bHRQYXRoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwoZWRpdG9yUHJvbWlzZXMpO1xuICB9XG5cbiAgcmVwb3J0UmVsYXlFcnJvciA9IChmcmllbmRseU1lc3NhZ2UsIGVycikgPT4ge1xuICAgIGNvbnN0IG9wdHMgPSB7ZGlzbWlzc2FibGU6IHRydWV9O1xuXG4gICAgaWYgKGVyci5uZXR3b3JrKSB7XG4gICAgICAvLyBPZmZsaW5lXG4gICAgICBvcHRzLmljb24gPSAnYWxpZ25tZW50LXVuYWxpZ24nO1xuICAgICAgb3B0cy5kZXNjcmlwdGlvbiA9IFwiSXQgbG9va3MgbGlrZSB5b3UncmUgb2ZmbGluZSByaWdodCBub3cuXCI7XG4gICAgfSBlbHNlIGlmIChlcnIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAvLyBUcmFuc2llbnQgZXJyb3IgbGlrZSBhIDUwMCBmcm9tIHRoZSBBUElcbiAgICAgIG9wdHMuZGVzY3JpcHRpb24gPSAnVGhlIEdpdEh1YiBBUEkgcmVwb3J0ZWQgYSBwcm9ibGVtLic7XG4gICAgICBvcHRzLmRldGFpbCA9IGVyci5yZXNwb25zZVRleHQ7XG4gICAgfSBlbHNlIGlmIChlcnIuZXJyb3JzKSB7XG4gICAgICAvLyBHcmFwaFFMIGVycm9yc1xuICAgICAgb3B0cy5kZXRhaWwgPSBlcnIuZXJyb3JzLm1hcChlID0+IGUubWVzc2FnZSkuam9pbignXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMuZGV0YWlsID0gZXJyLnN0YWNrO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihmcmllbmRseU1lc3NhZ2UsIG9wdHMpO1xuICB9XG5cbiAgLypcbiAgICogQXN5bmNocm9ub3VzbHkgY291bnQgdGhlIGNvbmZsaWN0IG1hcmtlcnMgcHJlc2VudCBpbiBhIGZpbGUgc3BlY2lmaWVkIGJ5IGZ1bGwgcGF0aC5cbiAgICovXG4gIHJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZnVsbFBhdGgpIHtcbiAgICBjb25zdCByZWFkU3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmdWxsUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBDb25mbGljdC5jb3VudEZyb21TdHJlYW0ocmVhZFN0cmVhbSkudGhlbihjb3VudCA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzLnJlcG9ydE1hcmtlckNvdW50KGZ1bGxQYXRoLCBjb3VudCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBUYWJUcmFja2VyIHtcbiAgY29uc3RydWN0b3IobmFtZSwge2dldFdvcmtzcGFjZSwgdXJpfSkge1xuICAgIGF1dG9iaW5kKHRoaXMsICd0b2dnbGUnLCAndG9nZ2xlRm9jdXMnLCAnZW5zdXJlVmlzaWJsZScpO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICB0aGlzLmdldFdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZTtcbiAgICB0aGlzLnVyaSA9IHVyaTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBmb2N1c1RvUmVzdG9yZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IHNob3VsZFJlc3RvcmVGb2N1cyA9IGZhbHNlO1xuXG4gICAgLy8gUmVuZGVyZWQgPT4gdGhlIGRvY2sgaXRlbSBpcyBiZWluZyByZW5kZXJlZCwgd2hldGhlciBvciBub3QgdGhlIGRvY2sgaXMgdmlzaWJsZSBvciB0aGUgaXRlbVxuICAgIC8vICAgaXMgdmlzaWJsZSB3aXRoaW4gaXRzIGRvY2suXG4gICAgLy8gVmlzaWJsZSA9PiB0aGUgaXRlbSBpcyBhY3RpdmUgYW5kIHRoZSBkb2NrIGl0ZW0gaXMgYWN0aXZlIHdpdGhpbiBpdHMgZG9jay5cbiAgICBjb25zdCB3YXNSZW5kZXJlZCA9IHRoaXMuaXNSZW5kZXJlZCgpO1xuICAgIGNvbnN0IHdhc1Zpc2libGUgPSB0aGlzLmlzVmlzaWJsZSgpO1xuXG4gICAgaWYgKCF3YXNSZW5kZXJlZCB8fCAhd2FzVmlzaWJsZSkge1xuICAgICAgLy8gTm90IHJlbmRlcmVkLCBvciByZW5kZXJlZCBidXQgbm90IGFuIGFjdGl2ZSBpdGVtIGluIGEgdmlzaWJsZSBkb2NrLlxuICAgICAgYXdhaXQgdGhpcy5yZXZlYWwoKTtcbiAgICAgIHNob3VsZFJlc3RvcmVGb2N1cyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbmRlcmVkIGFuZCBhbiBhY3RpdmUgaXRlbSB3aXRoaW4gYSB2aXNpYmxlIGRvY2suXG4gICAgICBhd2FpdCB0aGlzLmhpZGUoKTtcbiAgICAgIHNob3VsZFJlc3RvcmVGb2N1cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRSZXN0b3JlRm9jdXMpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gZm9jdXNUb1Jlc3RvcmUuZm9jdXMoKSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdG9nZ2xlRm9jdXMoKSB7XG4gICAgY29uc3QgaGFkRm9jdXMgPSB0aGlzLmhhc0ZvY3VzKCk7XG4gICAgYXdhaXQgdGhpcy5lbnN1cmVWaXNpYmxlKCk7XG5cbiAgICBpZiAoaGFkRm9jdXMpIHtcbiAgICAgIGxldCB3b3Jrc3BhY2UgPSB0aGlzLmdldFdvcmtzcGFjZSgpO1xuICAgICAgaWYgKHdvcmtzcGFjZS5nZXRDZW50ZXIpIHtcbiAgICAgICAgd29ya3NwYWNlID0gd29ya3NwYWNlLmdldENlbnRlcigpO1xuICAgICAgfVxuICAgICAgd29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZW5zdXJlVmlzaWJsZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgIGF3YWl0IHRoaXMucmV2ZWFsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZW5zdXJlUmVuZGVyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V29ya3NwYWNlKCkub3Blbih0aGlzLnVyaSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlLCBhY3RpdmF0ZUl0ZW06IGZhbHNlLCBhY3RpdmF0ZVBhbmU6IGZhbHNlfSk7XG4gIH1cblxuICByZXZlYWwoKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcihgJHt0aGlzLm5hbWV9LXRhYi1vcGVuYCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V29ya3NwYWNlKCkub3Blbih0aGlzLnVyaSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlLCBhY3RpdmF0ZUl0ZW06IHRydWUsIGFjdGl2YXRlUGFuZTogdHJ1ZX0pO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKGAke3RoaXMubmFtZX0tdGFiLWNsb3NlYCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V29ya3NwYWNlKCkuaGlkZSh0aGlzLnVyaSk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLmdldENvbXBvbmVudCgpLnJlc3RvcmVGb2N1cygpO1xuICB9XG5cbiAgZ2V0SXRlbSgpIHtcbiAgICBjb25zdCBwYW5lID0gdGhpcy5nZXRXb3Jrc3BhY2UoKS5wYW5lRm9yVVJJKHRoaXMudXJpKTtcbiAgICBpZiAoIXBhbmUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBhbmVJdGVtID0gcGFuZS5pdGVtRm9yVVJJKHRoaXMudXJpKTtcbiAgICBpZiAoIXBhbmVJdGVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFuZUl0ZW07XG4gIH1cblxuICBnZXRDb21wb25lbnQoKSB7XG4gICAgY29uc3QgcGFuZUl0ZW0gPSB0aGlzLmdldEl0ZW0oKTtcbiAgICBpZiAoIXBhbmVJdGVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCgodHlwZW9mIHBhbmVJdGVtLmdldFJlYWxJdGVtKSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwYW5lSXRlbS5nZXRSZWFsSXRlbSgpO1xuICB9XG5cbiAgZ2V0RE9NRWxlbWVudCgpIHtcbiAgICBjb25zdCBwYW5lSXRlbSA9IHRoaXMuZ2V0SXRlbSgpO1xuICAgIGlmICghcGFuZUl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKCh0eXBlb2YgcGFuZUl0ZW0uZ2V0RWxlbWVudCkgIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFuZUl0ZW0uZ2V0RWxlbWVudCgpO1xuICB9XG5cbiAgaXNSZW5kZXJlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLmdldFdvcmtzcGFjZSgpLnBhbmVGb3JVUkkodGhpcy51cmkpO1xuICB9XG5cbiAgaXNWaXNpYmxlKCkge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IHRoaXMuZ2V0V29ya3NwYWNlKCk7XG4gICAgcmV0dXJuIHdvcmtzcGFjZS5nZXRQYW5lQ29udGFpbmVycygpXG4gICAgICAuZmlsdGVyKGNvbnRhaW5lciA9PiBjb250YWluZXIgPT09IHdvcmtzcGFjZS5nZXRDZW50ZXIoKSB8fCBjb250YWluZXIuaXNWaXNpYmxlKCkpXG4gICAgICAuc29tZShjb250YWluZXIgPT4gY29udGFpbmVyLmdldFBhbmVzKCkuc29tZShwYW5lID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHBhbmUuZ2V0QWN0aXZlSXRlbSgpO1xuICAgICAgICByZXR1cm4gaXRlbSAmJiBpdGVtLmdldFVSSSAmJiBpdGVtLmdldFVSSSgpID09PSB0aGlzLnVyaTtcbiAgICAgIH0pKTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmdldERPTUVsZW1lbnQoKTtcbiAgICByZXR1cm4gcm9vdCAmJiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBNkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTlDLE1BQU1BLGNBQWMsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUE0QzFEQyxXQUFXLENBQUNDLEtBQUssRUFBRUMsT0FBTyxFQUFFO0lBQzFCLEtBQUssQ0FBQ0QsS0FBSyxFQUFFQyxPQUFPLENBQUM7SUFBQyxtQ0FnWFpDLFVBQVUsSUFBSSxJQUFBQyxpQkFBUSxFQUFDO01BQ2pDQyxhQUFhLEVBQUVGLFVBQVUsQ0FBQ0UsYUFBYSxFQUFFO01BQ3pDQyxPQUFPLEVBQUVILFVBQVUsQ0FBQ0ksVUFBVTtJQUNoQyxDQUFDLENBQUM7SUFBQSxxQ0EwRlksTUFBTSxJQUFJQyxPQUFPLENBQUNDLE9BQU8sSUFBSSxJQUFJLENBQUNDLFFBQVEsQ0FBQztNQUFDQyxhQUFhLEVBQUVDLGlDQUFjLENBQUNDO0lBQUksQ0FBQyxFQUFFSixPQUFPLENBQUMsQ0FBQztJQUFBLDhDQUVqRixNQUFNSyxPQUFPLElBQUk7TUFDdEMsSUFBSSxDQUFDQSxPQUFPLEVBQUU7UUFDWixNQUFNQyxZQUFZLEdBQUcsSUFBSSxDQUFDZCxLQUFLLENBQUNlLFNBQVMsQ0FBQ0MsbUJBQW1CLEVBQUU7UUFDL0QsSUFBSUYsWUFBWSxFQUFFO1VBQ2hCLE1BQU0sQ0FBQ0csV0FBVyxDQUFDLEdB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