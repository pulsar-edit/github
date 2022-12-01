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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    await Promise.all([this.installExtension(devTools.REACT_DEVELOPER_TOOLS.id), // relay developer tools extension id
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
            const createdPath = await this.initializeRepo(projectPath); // If the user confirmed repository creation for this project path,
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
    let shouldRestoreFocus = false; // Rendered => the dock item is being rendered, whether or not the dock is visible or the item
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yb290LWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiUm9vdENvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwicmVwb3NpdG9yeSIsImlzUHVibGlzaGFibGUiLCJyZW1vdGVzIiwiZ2V0UmVtb3RlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJkaWFsb2dSZXF1ZXN0IiwiZGlhbG9nUmVxdWVzdHMiLCJudWxsIiwiZGlyUGF0aCIsImFjdGl2ZUVkaXRvciIsIndvcmtzcGFjZSIsImdldEFjdGl2ZVRleHRFZGl0b3IiLCJwcm9qZWN0UGF0aCIsInByb2plY3QiLCJyZWxhdGl2aXplUGF0aCIsImdldFBhdGgiLCJkaXJlY3RvcmllcyIsImdldERpcmVjdG9yaWVzIiwid2l0aFJlcG9zaXRvcmllcyIsImFsbCIsIm1hcCIsImQiLCJyZXBvc2l0b3J5Rm9yRGlyZWN0b3J5IiwiZmlyc3RVbmluaXRpYWxpemVkIiwiZmluZCIsInIiLCJjb25maWciLCJnZXQiLCJpbml0Iiwib25Qcm9ncmVzc2luZ0FjY2VwdCIsImNob3NlblBhdGgiLCJpbml0aWFsaXplIiwiY2xvc2VEaWFsb2ciLCJvbkNhbmNlbCIsIm9wdHMiLCJjbG9uZSIsInVybCIsInF1ZXJ5IiwicmVqZWN0IiwiY3JlZGVudGlhbCIsInJlc3VsdCIsImlzc3VlaXNoIiwid29ya2RpciIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiY29tbWl0IiwicmVmIiwiY3JlYXRlIiwiZG90Y29tIiwicmVsYXlFbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsInB1Ymxpc2giLCJsb2NhbERpciIsInRvZ2dsZSIsIkNvbW1pdFByZXZpZXdJdGVtIiwiYnVpbGRVUkkiLCJmaWxlUGF0aCIsInN0YWdpbmdTdGF0dXMiLCJnaXRUYWIiLCJnaXRUYWJUcmFja2VyIiwiZ2V0Q29tcG9uZW50IiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsImZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbiIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiZnJpZW5kbHlNZXNzYWdlIiwiZXJyIiwiZGlzbWlzc2FibGUiLCJuZXR3b3JrIiwiaWNvbiIsImRlc2NyaXB0aW9uIiwicmVzcG9uc2VUZXh0IiwiZGV0YWlsIiwiZXJyb3JzIiwiZSIsIm1lc3NhZ2UiLCJqb2luIiwic3RhY2siLCJub3RpZmljYXRpb25NYW5hZ2VyIiwiYWRkRXJyb3IiLCJzdGF0ZSIsIlRhYlRyYWNrZXIiLCJ1cmkiLCJHaXRUYWJJdGVtIiwiZ2V0V29ya3NwYWNlIiwiZ2l0aHViVGFiVHJhY2tlciIsIkdpdEh1YlRhYkl0ZW0iLCJzdWJzY3JpcHRpb24iLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib25QdWxsRXJyb3IiLCJlbnN1cmVWaXNpYmxlIiwiY29tbWFuZHMiLCJvbkRpZERpc3BhdGNoIiwiZXZlbnQiLCJ0eXBlIiwic3RhcnRzV2l0aCIsImNvbnRleHRDb21tYW5kIiwicGFja2FnZSIsImNvbW1hbmQiLCJjb21wb25lbnREaWRNb3VudCIsIm9wZW5UYWJzIiwicmVuZGVyIiwicmVuZGVyQ29tbWFuZHMiLCJyZW5kZXJTdGF0dXNCYXJUaWxlIiwicmVuZGVyUGFuZUl0ZW1zIiwicmVuZGVyRGlhbG9ncyIsInJlbmRlckNvbmZsaWN0UmVzb2x2ZXIiLCJyZW5kZXJDb21tZW50RGVjb3JhdGlvbnMiLCJkZXZNb2RlIiwiZ2xvYmFsIiwiYXRvbSIsImluRGV2TW9kZSIsImluc3RhbGxSZWFjdERldlRvb2xzIiwidG9nZ2xlQ29tbWl0UHJldmlld0l0ZW0iLCJjbGVhckdpdGh1YlRva2VuIiwic2hvd1dhdGVyZmFsbERpYWdub3N0aWNzIiwic2hvd0NhY2hlRGlhZ25vc3RpY3MiLCJ0b2dnbGVGb2N1cyIsIm9wZW5Jbml0aWFsaXplRGlhbG9nIiwib3BlbkNsb25lRGlhbG9nIiwib3Blbklzc3VlaXNoRGlhbG9nIiwib3BlbkNvbW1pdERpYWxvZyIsIm9wZW5DcmVhdGVEaWFsb2ciLCJ2aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUiLCJ2aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsImRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcyIsImZldGNoRGF0YSIsImRhdGEiLCJmaWx0ZXIiLCJpc0dpdGh1YlJlcG8iLCJpc0VtcHR5Iiwib3BlblB1Ymxpc2hEaWFsb2ciLCJzdGF0dXNCYXIiLCJzYiIsIm9uQ29uc3VtZVN0YXR1c0JhciIsInBpcGVsaW5lTWFuYWdlciIsInRvb2x0aXBzIiwiY29uZmlybSIsImxvZ2luTW9kZWwiLCJjdXJyZW50V2luZG93IiwicmVwb3J0UmVsYXlFcnJvciIsInJlc29sdXRpb25Qcm9ncmVzcyIsInJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MiLCJ3b3JrZGlyQ29udGV4dFBvb2wiLCJnZXRDdXJyZW50V29ya0RpcnMiLCJiaW5kIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsIm9uRGlkQ2hhbmdlUG9vbENvbnRleHRzIiwidXJpUGF0dGVybiIsIml0ZW1Ib2xkZXIiLCJzZXR0ZXIiLCJncmFtbWFycyIsIm9wZW5GaWxlcyIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwidW5kb0xhc3REaXNjYXJkIiwiY3VycmVudFdvcmtEaXIiLCJjb250ZXh0TG9ja2VkIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwiQ2hhbmdlZEZpbGVJdGVtIiwicGFyYW1zIiwicGF0aCIsInJlbFBhdGgiLCJ3b3JraW5nRGlyZWN0b3J5Iiwia2V5bWFwcyIsImRpc2NhcmRMaW5lcyIsInN1cmZhY2VGcm9tRmlsZUF0UGF0aCIsInN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b24iLCJDb21taXREZXRhaWxJdGVtIiwic2hhIiwic3VyZmFjZVRvUmVjZW50Q29tbWl0IiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiZGVzZXJpYWxpemVkIiwiaG9zdCIsIm93bmVyIiwicmVwbyIsInBhcnNlSW50IiwiaXNzdWVpc2hOdW1iZXIiLCJpbml0U2VsZWN0ZWRUYWIiLCJSZXZpZXdzSXRlbSIsIm51bWJlciIsIkdpdFRpbWluZ3NWaWV3IiwiR2l0Q2FjaGVWaWV3Iiwic3RhcnRPcGVuIiwiZW5zdXJlUmVuZGVyZWQiLCJzdGFydFJldmVhbGVkIiwiZG9ja3MiLCJTZXQiLCJwYW5lQ29udGFpbmVyRm9yVVJJIiwiY29udGFpbmVyIiwic2hvdyIsImRvY2siLCJkZXZUb29sc05hbWUiLCJkZXZUb29scyIsInJlcXVpcmUiLCJpbnN0YWxsRXh0ZW5zaW9uIiwiUkVBQ1RfREVWRUxPUEVSX1RPT0xTIiwiaWQiLCJhZGRTdWNjZXNzIiwiY3Jvc3NVbnppcE5hbWUiLCJ1bnppcCIsImV4dGVuc2lvbkZvbGRlciIsInJlbW90ZSIsImFwcCIsImV4dGVuc2lvbkZpbGUiLCJmcyIsImVuc3VyZURpciIsImRpcm5hbWUiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkJ1ZmZlciIsImZyb20iLCJhcnJheUJ1ZmZlciIsIndyaXRlRmlsZSIsImV4aXN0cyIsImRlZmF1bHQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJjb21wb25lbnREaWRVcGRhdGUiLCJkaXNhYmxlR2l0SW5mb1RpbGUiLCJyZW1vdmVUb2tlbiIsIm9wZW4iLCJvbmx5U3RhZ2VkIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJ2aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwiZWRpdG9yIiwiYWJzRmlsZVBhdGgiLCJyZWFscGF0aCIsInJlcG9QYXRoIiwibm90aWZpY2F0aW9uIiwiYWRkSW5mbyIsImJ1dHRvbnMiLCJjbGFzc05hbWUiLCJ0ZXh0Iiwib25EaWRDbGljayIsImRpc21pc3MiLCJjcmVhdGVkUGF0aCIsImluaXRpYWxpemVSZXBvIiwic2xpY2UiLCJsZW5ndGgiLCJzcGxpdERpcmVjdGlvbiIsInBhbmUiLCJnZXRBY3RpdmVQYW5lIiwic3BsaXRSaWdodCIsInNwbGl0RG93biIsImxpbmVOdW0iLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInJvdyIsIml0ZW0iLCJwZW5kaW5nIiwiYWN0aXZhdGVQYW5lIiwiYWN0aXZhdGVJdGVtIiwiZ2V0UmVhbEl0ZW1Qcm9taXNlIiwiZ2V0RmlsZVBhdGNoTG9hZGVkUHJvbWlzZSIsImdvVG9EaWZmTGluZSIsImZvY3VzIiwiRXJyb3IiLCJmaWxlUGF0aHMiLCJhYnNvbHV0ZVBhdGgiLCJnZXRVbnNhdmVkRmlsZXMiLCJ3b3JrZGlyUGF0aCIsImlzTW9kaWZpZWRCeVBhdGgiLCJNYXAiLCJnZXRUZXh0RWRpdG9ycyIsImZvckVhY2giLCJzZXQiLCJpc01vZGlmaWVkIiwiZW5zdXJlTm9VbnNhdmVkRmlsZXMiLCJ1bnNhdmVkRmlsZXMiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyIsIm11bHRpRmlsZVBhdGNoIiwibGluZXMiLCJnZXRGaWxlUGF0Y2hlcyIsImRpc2NhcmRGaWxlUGF0Y2giLCJnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImFwcGx5UGF0Y2hUb1dvcmtkaXIiLCJnZXRGaWxlUGF0aHNGb3JMYXN0RGlzY2FyZCIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJsYXN0U25hcHNob3RzIiwiZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMiLCJzbmFwc2hvdCIsInJlc3VsdHMiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzIiwiR2l0RXJyb3IiLCJzdGRFcnIiLCJtYXRjaCIsImNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzIiwiY29uc29sZSIsImVycm9yIiwiY29uZmxpY3RzIiwiY29uZmxpY3QiLCJwcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyIsInByb21wdEFib3V0Q29uZmxpY3RzIiwiY29uZmxpY3RlZEZpbGVzIiwiY2hvaWNlIiwiZGV0YWlsZWRNZXNzYWdlIiwib3BlbkNvbmZsaWN0c0luTmV3RWRpdG9ycyIsInJlc3VsdFBhdGgiLCJjbGVhckRpc2NhcmRIaXN0b3J5IiwiZmlsZVBhdGhzU3RyIiwicHJvbWlzZXMiLCJkZWxldGVkIiwidGhlaXJzU2hhIiwiY29tbW9uQmFzZVNoYSIsImN1cnJlbnRTaGEiLCJyZW1vdmUiLCJjb3B5Iiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsInBvcERpc2NhcmRIaXN0b3J5IiwicmVzdWx0UGF0aHMiLCJlZGl0b3JQcm9taXNlcyIsImZ1bGxQYXRoIiwicmVhZFN0cmVhbSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJlbmNvZGluZyIsIkNvbmZsaWN0IiwiY291bnRGcm9tU3RyZWFtIiwidGhlbiIsImNvdW50IiwicmVwb3J0TWFya2VyQ291bnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZGVzZXJpYWxpemVycyIsImZ1bmMiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsInN3aXRjaGJvYXJkIiwiaW5zdGFuY2VPZiIsIlN3aXRjaGJvYXJkIiwic3RyaW5nIiwiYm9vbCIsIm5hbWUiLCJmb2N1c1RvUmVzdG9yZSIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsInNob3VsZFJlc3RvcmVGb2N1cyIsIndhc1JlbmRlcmVkIiwiaXNSZW5kZXJlZCIsIndhc1Zpc2libGUiLCJpc1Zpc2libGUiLCJyZXZlYWwiLCJoaWRlIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiaGFkRm9jdXMiLCJoYXNGb2N1cyIsImdldENlbnRlciIsImFjdGl2YXRlIiwic2VhcmNoQWxsUGFuZXMiLCJyZXN0b3JlRm9jdXMiLCJnZXRJdGVtIiwicGFuZUZvclVSSSIsInBhbmVJdGVtIiwiaXRlbUZvclVSSSIsImdldFJlYWxJdGVtIiwiZ2V0RE9NRWxlbWVudCIsImdldEVsZW1lbnQiLCJnZXRQYW5lQ29udGFpbmVycyIsInNvbWUiLCJn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R0FBRztBQUNULFVBQU1pQixJQUFJLEdBQUcsS0FBS1AsYUFBTCxFQUFiO0FBQ0EsV0FBT08sSUFBSSxJQUFJQSxJQUFJLENBQUNDLFFBQUwsQ0FBYzlCLFFBQVEsQ0FBQ0MsYUFBdkIsQ0FBZjtBQUNEOztBQWxJYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcblxuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuLi9hdG9tL3N0YXR1cy1iYXInO1xuaW1wb3J0IFBhbmVJdGVtIGZyb20gJy4uL2F0b20vcGFuZS1pdGVtJztcbmltcG9ydCB7b3Blbklzc3VlaXNoSXRlbX0gZnJvbSAnLi4vdmlld3Mvb3Blbi1pc3N1ZWlzaC1kaWFsb2cnO1xuaW1wb3J0IHtvcGVuQ29tbWl0RGV0YWlsSXRlbX0gZnJvbSAnLi4vdmlld3Mvb3Blbi1jb21taXQtZGlhbG9nJztcbmltcG9ydCB7Y3JlYXRlUmVwb3NpdG9yeSwgcHVibGlzaFJlcG9zaXRvcnl9IGZyb20gJy4uL3ZpZXdzL2NyZWF0ZS1kaWFsb2cnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IENoYW5nZWRGaWxlSXRlbSBmcm9tICcuLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbSc7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ29tbWl0UHJldmlld0l0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LXByZXZpZXctaXRlbSc7XG5pbXBvcnQgR2l0VGFiSXRlbSBmcm9tICcuLi9pdGVtcy9naXQtdGFiLWl0ZW0nO1xuaW1wb3J0IEdpdEh1YlRhYkl0ZW0gZnJvbSAnLi4vaXRlbXMvZ2l0aHViLXRhYi1pdGVtJztcbmltcG9ydCBSZXZpZXdzSXRlbSBmcm9tICcuLi9pdGVtcy9yZXZpZXdzLWl0ZW0nO1xuaW1wb3J0IENvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2NvbW1lbnQtZGVjb3JhdGlvbnMtY29udGFpbmVyJztcbmltcG9ydCBEaWFsb2dzQ29udHJvbGxlciwge2RpYWxvZ1JlcXVlc3RzfSBmcm9tICcuL2RpYWxvZ3MtY29udHJvbGxlcic7XG5pbXBvcnQgU3RhdHVzQmFyVGlsZUNvbnRyb2xsZXIgZnJvbSAnLi9zdGF0dXMtYmFyLXRpbGUtY29udHJvbGxlcic7XG5pbXBvcnQgUmVwb3NpdG9yeUNvbmZsaWN0Q29udHJvbGxlciBmcm9tICcuL3JlcG9zaXRvcnktY29uZmxpY3QtY29udHJvbGxlcic7XG5pbXBvcnQgUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyIGZyb20gJy4uL3JlbGF5LW5ldHdvcmstbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQgR2l0Q2FjaGVWaWV3IGZyb20gJy4uL3ZpZXdzL2dpdC1jYWNoZS12aWV3JztcbmltcG9ydCBHaXRUaW1pbmdzVmlldyBmcm9tICcuLi92aWV3cy9naXQtdGltaW5ncy12aWV3JztcbmltcG9ydCBDb25mbGljdCBmcm9tICcuLi9tb2RlbHMvY29uZmxpY3RzL2NvbmZsaWN0JztcbmltcG9ydCB7Z2V0RW5kcG9pbnR9IGZyb20gJy4uL21vZGVscy9lbmRwb2ludCc7XG5pbXBvcnQgU3dpdGNoYm9hcmQgZnJvbSAnLi4vc3dpdGNoYm9hcmQnO1xuaW1wb3J0IHtXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2Rlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMsIGRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcywgYXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtHaXRFcnJvcn0gZnJvbSAnLi4vZ2l0LXNoZWxsLW91dC1zdHJhdGVneSc7XG5pbXBvcnQge2luY3JlbWVudENvdW50ZXIsIGFkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvb3RDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBBdG9tIGVudmlvcm5tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBkZXNlcmlhbGl6ZXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbm90aWZpY2F0aW9uTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGdyYW1tYXJzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHJvamVjdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudFdpbmRvdzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gTW9kZWxzXG4gICAgbG9naW5Nb2RlbDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXJDb250ZXh0UG9vbDogV29ya2RpckNvbnRleHRQb29sUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3RhdHVzQmFyOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHN3aXRjaGJvYXJkOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihTd2l0Y2hib2FyZCksXG4gICAgcGlwZWxpbmVNYW5hZ2VyOiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgY3VycmVudFdvcmtEaXI6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvLyBHaXQgYWN0aW9uc1xuICAgIGluaXRpYWxpemU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2xvbmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDb250cm9sXG4gICAgY29udGV4dExvY2tlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbnRleHRMb2NrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHN0YXJ0T3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gICAgc3RhcnRSZXZlYWxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHN3aXRjaGJvYXJkOiBuZXcgU3dpdGNoYm9hcmQoKSxcbiAgICBzdGFydE9wZW46IGZhbHNlLFxuICAgIHN0YXJ0UmV2ZWFsZWQ6IGZhbHNlLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2luc3RhbGxSZWFjdERldlRvb2xzJywgJ2NsZWFyR2l0aHViVG9rZW4nLFxuICAgICAgJ3Nob3dXYXRlcmZhbGxEaWFnbm9zdGljcycsICdzaG93Q2FjaGVEaWFnbm9zdGljcycsXG4gICAgICAnZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcycsICdkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMnLFxuICAgICAgJ3F1aWV0bHlTZWxlY3RJdGVtJywgJ3ZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZScsXG4gICAgICAndmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZScsICdvcGVuRmlsZXMnLCAnZ2V0VW5zYXZlZEZpbGVzJywgJ2Vuc3VyZU5vVW5zYXZlZEZpbGVzJyxcbiAgICAgICdkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocycsICdkaXNjYXJkTGluZXMnLCAndW5kb0xhc3REaXNjYXJkJywgJ3JlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MnLFxuICAgICk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGlhbG9nUmVxdWVzdDogZGlhbG9nUmVxdWVzdHMubnVsbCxcbiAgICB9O1xuXG4gICAgdGhpcy5naXRUYWJUcmFja2VyID0gbmV3IFRhYlRyYWNrZXIoJ2dpdCcsIHtcbiAgICAgIHVyaTogR2l0VGFiSXRlbS5idWlsZFVSSSgpLFxuICAgICAgZ2V0V29ya3NwYWNlOiAoKSA9PiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZ2l0aHViVGFiVHJhY2tlciA9IG5ldyBUYWJUcmFja2VyKCdnaXRodWInLCB7XG4gICAgICB1cmk6IEdpdEh1YlRhYkl0ZW0uYnVpbGRVUkkoKSxcbiAgICAgIGdldFdvcmtzcGFjZTogKCkgPT4gdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm9uUHVsbEVycm9yKHRoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVWaXNpYmxlKSxcbiAgICApO1xuXG4gICAgdGhpcy5wcm9wcy5jb21tYW5kcy5vbkRpZERpc3BhdGNoKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlICYmIGV2ZW50LnR5cGUuc3RhcnRzV2l0aCgnZ2l0aHViOicpXG4gICAgICAgICYmIGV2ZW50LmRldGFpbCAmJiBldmVudC5kZXRhaWxbMF0gJiYgZXZlbnQuZGV0YWlsWzBdLmNvbnRleHRDb21tYW5kKSB7XG4gICAgICAgIGFkZEV2ZW50KCdjb250ZXh0LW1lbnUtYWN0aW9uJywge1xuICAgICAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgICAgIGNvbW1hbmQ6IGV2ZW50LnR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5vcGVuVGFicygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclN0YXR1c0JhclRpbGUoKX1cbiAgICAgICAge3RoaXMucmVuZGVyUGFuZUl0ZW1zKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckRpYWxvZ3MoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29uZmxpY3RSZXNvbHZlcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tZW50RGVjb3JhdGlvbnMoKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIGNvbnN0IGRldk1vZGUgPSBnbG9iYWwuYXRvbSAmJiBnbG9iYWwuYXRvbS5pbkRldk1vZGUoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICB7ZGV2TW9kZSAmJiA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluc3RhbGwtcmVhY3QtZGV2LXRvb2xzXCIgY2FsbGJhY2s9e3RoaXMuaW5zdGFsbFJlYWN0RGV2VG9vbHN9IC8+fVxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWNvbW1pdC1wcmV2aWV3XCIgY2FsbGJhY2s9e3RoaXMudG9nZ2xlQ29tbWl0UHJldmlld0l0ZW19IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpsb2dvdXRcIiBjYWxsYmFjaz17dGhpcy5jbGVhckdpdGh1YlRva2VufSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy13YXRlcmZhbGwtZGlhZ25vc3RpY3NcIiBjYWxsYmFjaz17dGhpcy5zaG93V2F0ZXJmYWxsRGlhZ25vc3RpY3N9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzaG93LWNhY2hlLWRpYWdub3N0aWNzXCIgY2FsbGJhY2s9e3RoaXMuc2hvd0NhY2hlRGlhZ25vc3RpY3N9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZ2l0LXRhYlwiIGNhbGxiYWNrPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdC10YWItZm9jdXNcIiBjYWxsYmFjaz17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZUZvY3VzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdGh1Yi10YWJcIiBjYWxsYmFjaz17dGhpcy5naXRodWJUYWJUcmFja2VyLnRvZ2dsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXRodWItdGFiLWZvY3VzXCIgY2FsbGJhY2s9e3RoaXMuZ2l0aHViVGFiVHJhY2tlci50b2dnbGVGb2N1c30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmluaXRpYWxpemVcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuSW5pdGlhbGl6ZURpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y2xvbmVcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuQ2xvbmVEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOm9wZW4taXNzdWUtb3ItcHVsbC1yZXF1ZXN0XCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3Blbklzc3VlaXNoRGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpvcGVuLWNvbW1pdFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5Db21taXREaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNyZWF0ZS1yZXBvc2l0b3J5XCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkNyZWF0ZURpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOnZpZXctdW5zdGFnZWQtY2hhbmdlcy1mb3ItY3VycmVudC1maWxlXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLnZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOnZpZXctc3RhZ2VkLWNoYW5nZXMtZm9yLWN1cnJlbnQtZmlsZVwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy52aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6Y2xvc2UtYWxsLWRpZmYtdmlld3NcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMuZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOmNsb3NlLWVtcHR5LWRpZmYtdmlld3NcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMuZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxPYnNlcnZlTW9kZWwgbW9kZWw9e3RoaXMucHJvcHMucmVwb3NpdG9yeX0gZmV0Y2hEYXRhPXt0aGlzLmZldGNoRGF0YX0+XG4gICAgICAgICAge2RhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLmlzUHVibGlzaGFibGUgfHwgIWRhdGEucmVtb3Rlcy5maWx0ZXIociA9PiByLmlzR2l0aHViUmVwbygpKS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiYXRvbS13b3Jrc3BhY2VcIj5cbiAgICAgICAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1YjpwdWJsaXNoLXJlcG9zaXRvcnlcIlxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlblB1Ymxpc2hEaWFsb2codGhpcy5wcm9wcy5yZXBvc2l0b3J5KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9fVxuICAgICAgICA8L09ic2VydmVNb2RlbD5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclN0YXR1c0JhclRpbGUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGF0dXNCYXJcbiAgICAgICAgc3RhdHVzQmFyPXt0aGlzLnByb3BzLnN0YXR1c0Jhcn1cbiAgICAgICAgb25Db25zdW1lU3RhdHVzQmFyPXtzYiA9PiB0aGlzLm9uQ29uc3VtZVN0YXR1c0JhcihzYil9XG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1TdGF0dXNCYXJUaWxlQ29udHJvbGxlclwiPlxuICAgICAgICA8U3RhdHVzQmFyVGlsZUNvbnRyb2xsZXJcbiAgICAgICAgICBwaXBlbGluZU1hbmFnZXI9e3RoaXMucHJvcHMucGlwZWxpbmVNYW5hZ2VyfVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgdG9nZ2xlR2l0VGFiPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlfVxuICAgICAgICAgIHRvZ2dsZUdpdGh1YlRhYj17dGhpcy5naXRodWJUYWJUcmFja2VyLnRvZ2dsZX1cbiAgICAgICAgLz5cbiAgICAgIDwvU3RhdHVzQmFyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJEaWFsb2dzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RGlhbG9nc0NvbnRyb2xsZXJcbiAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICByZXF1ZXN0PXt0aGlzLnN0YXRlLmRpYWxvZ1JlcXVlc3R9XG5cbiAgICAgICAgY3VycmVudFdpbmRvdz17dGhpcy5wcm9wcy5jdXJyZW50V2luZG93fVxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1lbnREZWNvcmF0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWVudERlY29yYXRpb25zQ29udGFpbmVyXG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICBsb2NhbFJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb25mbGljdFJlc29sdmVyKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZXBvc2l0b3J5KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJlcG9zaXRvcnlDb25mbGljdENvbnRyb2xsZXJcbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUGFuZUl0ZW1zKCkge1xuICAgIGNvbnN0IHt3b3JrZGlyQ29udGV4dFBvb2x9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBnZXRDdXJyZW50V29ya0RpcnMgPSB3b3JrZGlyQ29udGV4dFBvb2wuZ2V0Q3VycmVudFdvcmtEaXJzLmJpbmQod29ya2RpckNvbnRleHRQb29sKTtcbiAgICBjb25zdCBvbkRpZENoYW5nZVdvcmtEaXJzID0gd29ya2RpckNvbnRleHRQb29sLm9uRGlkQ2hhbmdlUG9vbENvbnRleHRzLmJpbmQod29ya2RpckNvbnRleHRQb29sKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17R2l0VGFiSXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1HaXQtcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiAoXG4gICAgICAgICAgICA8R2l0VGFiSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgZ3JhbW1hcnM9e3RoaXMucHJvcHMuZ3JhbW1hcnN9XG4gICAgICAgICAgICAgIHByb2plY3Q9e3RoaXMucHJvcHMucHJvamVjdH1cbiAgICAgICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgb3BlbkluaXRpYWxpemVEaWFsb2c9e3RoaXMub3BlbkluaXRpYWxpemVEaWFsb2d9XG4gICAgICAgICAgICAgIHJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGVuc3VyZUdpdFRhYj17dGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVZpc2libGV9XG4gICAgICAgICAgICAgIG9wZW5GaWxlcz17dGhpcy5vcGVuRmlsZXN9XG4gICAgICAgICAgICAgIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzPXt0aGlzLmRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzfVxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICAgICAgICByZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e2dldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17b25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgICAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0dpdEh1YlRhYkl0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gKFxuICAgICAgICAgICAgPEdpdEh1YlRhYkl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGN1cnJlbnRXb3JrRGlyPXt0aGlzLnByb3BzLmN1cnJlbnRXb3JrRGlyfVxuICAgICAgICAgICAgICBnZXRDdXJyZW50V29ya0RpcnM9e2dldEN1cnJlbnRXb3JrRGlyc31cbiAgICAgICAgICAgICAgb25EaWRDaGFuZ2VXb3JrRGlycz17b25EaWRDaGFuZ2VXb3JrRGlyc31cbiAgICAgICAgICAgICAgY29udGV4dExvY2tlZD17dGhpcy5wcm9wcy5jb250ZXh0TG9ja2VkfVxuICAgICAgICAgICAgICBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5PXt0aGlzLnByb3BzLmNoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHNldENvbnRleHRMb2NrPXt0aGlzLnByb3BzLnNldENvbnRleHRMb2NrfVxuICAgICAgICAgICAgICBvcGVuQ3JlYXRlRGlhbG9nPXt0aGlzLm9wZW5DcmVhdGVEaWFsb2d9XG4gICAgICAgICAgICAgIG9wZW5QdWJsaXNoRGlhbG9nPXt0aGlzLm9wZW5QdWJsaXNoRGlhbG9nfVxuICAgICAgICAgICAgICBvcGVuQ2xvbmVEaWFsb2c9e3RoaXMub3BlbkNsb25lRGlhbG9nfVxuICAgICAgICAgICAgICBvcGVuR2l0VGFiPXt0aGlzLmdpdFRhYlRyYWNrZXIudG9nZ2xlRm9jdXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17Q2hhbmdlZEZpbGVJdGVtLnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxDaGFuZ2VkRmlsZUl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICByZWxQYXRoPXtwYXRoLmpvaW4oLi4ucGFyYW1zLnJlbFBhdGgpfVxuICAgICAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXtwYXJhbXMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgc3RhZ2luZ1N0YXR1cz17cGFyYW1zLnN0YWdpbmdTdGF0dXN9XG5cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgICAgICAgZGlzY2FyZExpbmVzPXt0aGlzLmRpc2NhcmRMaW5lc31cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICAgICAgc3VyZmFjZUZpbGVBdFBhdGg9e3RoaXMuc3VyZmFjZUZyb21GaWxlQXRQYXRofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0NvbW1pdFByZXZpZXdJdGVtLnVyaVBhdHRlcm59XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdFByZXZpZXctcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxDb21taXRQcmV2aWV3SXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICBkaXNjYXJkTGluZXM9e3RoaXMuZGlzY2FyZExpbmVzfVxuICAgICAgICAgICAgICB1bmRvTGFzdERpc2NhcmQ9e3RoaXMudW5kb0xhc3REaXNjYXJkfVxuICAgICAgICAgICAgICBzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uPXt0aGlzLnN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbVxuICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgdXJpUGF0dGVybj17Q29tbWl0RGV0YWlsSXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWwtcm9vdFwiPlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxDb21taXREZXRhaWxJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIHNoYT17cGFyYW1zLnNoYX1cbiAgICAgICAgICAgICAgc3VyZmFjZUNvbW1pdD17dGhpcy5zdXJmYWNlVG9SZWNlbnRDb21taXR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtJc3N1ZWlzaERldGFpbEl0ZW0udXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlciwgcGFyYW1zLCBkZXNlcmlhbGl6ZWR9KSA9PiAoXG4gICAgICAgICAgICA8SXNzdWVpc2hEZXRhaWxJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgaG9zdD17cGFyYW1zLmhvc3R9XG4gICAgICAgICAgICAgIG93bmVyPXtwYXJhbXMub3duZXJ9XG4gICAgICAgICAgICAgIHJlcG89e3BhcmFtcy5yZXBvfVxuICAgICAgICAgICAgICBpc3N1ZWlzaE51bWJlcj17cGFyc2VJbnQocGFyYW1zLmlzc3VlaXNoTnVtYmVyLCAxMCl9XG5cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgaW5pdFNlbGVjdGVkVGFiPXtkZXNlcmlhbGl6ZWQuaW5pdFNlbGVjdGVkVGFifVxuXG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IHVyaVBhdHRlcm49e1Jldmlld3NJdGVtLnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtc30pID0+IChcbiAgICAgICAgICAgIDxSZXZpZXdzSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIGhvc3Q9e3BhcmFtcy5ob3N0fVxuICAgICAgICAgICAgICBvd25lcj17cGFyYW1zLm93bmVyfVxuICAgICAgICAgICAgICByZXBvPXtwYXJhbXMucmVwb31cbiAgICAgICAgICAgICAgbnVtYmVyPXtwYXJzZUludChwYXJhbXMubnVtYmVyLCAxMCl9XG5cbiAgICAgICAgICAgICAgd29ya2Rpcj17cGFyYW1zLndvcmtkaXJ9XG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9IHVyaVBhdHRlcm49e0dpdFRpbWluZ3NWaWV3LnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiA8R2l0VGltaW5nc1ZpZXcgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn0gLz59XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtHaXRDYWNoZVZpZXcudXJpUGF0dGVybn0+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlcn0pID0+IDxHaXRDYWNoZVZpZXcgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn0gcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSAvPn1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIGZldGNoRGF0YSA9IHJlcG9zaXRvcnkgPT4geXViaWtpcmkoe1xuICAgIGlzUHVibGlzaGFibGU6IHJlcG9zaXRvcnkuaXNQdWJsaXNoYWJsZSgpLFxuICAgIHJlbW90ZXM6IHJlcG9zaXRvcnkuZ2V0UmVtb3RlcygpLFxuICB9KTtcblxuICBhc3luYyBvcGVuVGFicygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zdGFydE9wZW4pIHtcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgdGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVJlbmRlcmVkKGZhbHNlKSxcbiAgICAgICAgdGhpcy5naXRodWJUYWJUcmFja2VyLmVuc3VyZVJlbmRlcmVkKGZhbHNlKSxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnN0YXJ0UmV2ZWFsZWQpIHtcbiAgICAgIGNvbnN0IGRvY2tzID0gbmV3IFNldChcbiAgICAgICAgW0dpdFRhYkl0ZW0uYnVpbGRVUkkoKSwgR2l0SHViVGFiSXRlbS5idWlsZFVSSSgpXVxuICAgICAgICAgIC5tYXAodXJpID0+IHRoaXMucHJvcHMud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JVUkkodXJpKSlcbiAgICAgICAgICAuZmlsdGVyKGNvbnRhaW5lciA9PiBjb250YWluZXIgJiYgKHR5cGVvZiBjb250YWluZXIuc2hvdykgPT09ICdmdW5jdGlvbicpLFxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCBkb2NrIG9mIGRvY2tzKSB7XG4gICAgICAgIGRvY2suc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluc3RhbGxSZWFjdERldlRvb2xzKCkge1xuICAgIC8vIFByZXZlbnQgZWxlY3Ryb24tbGluayBmcm9tIGF0dGVtcHRpbmcgdG8gZGVzY2VuZCBpbnRvIGVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlciwgd2hpY2ggaXMgbm90IGF2YWlsYWJsZVxuICAgIC8vIHdoZW4gd2UncmUgYnVuZGxlZCBpbiBBdG9tLlxuICAgIGNvbnN0IGRldlRvb2xzTmFtZSA9ICdlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXInO1xuICAgIGNvbnN0IGRldlRvb2xzID0gcmVxdWlyZShkZXZUb29sc05hbWUpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5pbnN0YWxsRXh0ZW5zaW9uKGRldlRvb2xzLlJFQUNUX0RFVkVMT1BFUl9UT09MUy5pZCksXG4gICAgICAvLyByZWxheSBkZXZlbG9wZXIgdG9vbHMgZXh0ZW5zaW9uIGlkXG4gICAgICB0aGlzLmluc3RhbGxFeHRlbnNpb24oJ25jZWRvYnBnbm1raGNtbm5rY2ltbm9icGZlcGlkYWRsJyksXG4gICAgXSk7XG5cbiAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkU3VjY2Vzcygn8J+MiCBSZWxvYWQgeW91ciB3aW5kb3cgdG8gc3RhcnQgdXNpbmcgdGhlIFJlYWN0L1JlbGF5IGRldiB0b29scyEnKTtcbiAgfVxuXG4gIGFzeW5jIGluc3RhbGxFeHRlbnNpb24oaWQpIHtcbiAgICBjb25zdCBkZXZUb29sc05hbWUgPSAnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJztcbiAgICBjb25zdCBkZXZUb29scyA9IHJlcXVpcmUoZGV2VG9vbHNOYW1lKTtcblxuICAgIGNvbnN0IGNyb3NzVW56aXBOYW1lID0gJ2Nyb3NzLXVuemlwJztcbiAgICBjb25zdCB1bnppcCA9IHJlcXVpcmUoY3Jvc3NVbnppcE5hbWUpO1xuXG4gICAgY29uc3QgdXJsID1cbiAgICAgICdodHRwczovL2NsaWVudHMyLmdvb2dsZS5jb20vc2VydmljZS91cGRhdGUyL2NyeD8nICtcbiAgICAgIGByZXNwb25zZT1yZWRpcmVjdCZ4PWlkJTNEJHtpZH0lMjZ1YyZwcm9kdmVyc2lvbj0zMmA7XG4gICAgY29uc3QgZXh0ZW5zaW9uRm9sZGVyID0gcGF0aC5yZXNvbHZlKHJlbW90ZS5hcHAuZ2V0UGF0aCgndXNlckRhdGEnKSwgYGV4dGVuc2lvbnMvJHtpZH1gKTtcbiAgICBjb25zdCBleHRlbnNpb25GaWxlID0gYCR7ZXh0ZW5zaW9uRm9sZGVyfS5jcnhgO1xuICAgIGF3YWl0IGZzLmVuc3VyZURpcihwYXRoLmRpcm5hbWUoZXh0ZW5zaW9uRmlsZSkpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7bWV0aG9kOiAnR0VUJ30pO1xuICAgIGNvbnN0IGJvZHkgPSBCdWZmZXIuZnJvbShhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpKTtcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoZXh0ZW5zaW9uRmlsZSwgYm9keSk7XG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB1bnppcChleHRlbnNpb25GaWxlLCBleHRlbnNpb25Gb2xkZXIsIGFzeW5jIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIgJiYgIWF3YWl0IGZzLmV4aXN0cyhwYXRoLmpvaW4oZXh0ZW5zaW9uRm9sZGVyLCAnbWFuaWZlc3QuanNvbicpKSkge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBmcy5lbnN1cmVEaXIoZXh0ZW5zaW9uRm9sZGVyLCAwbzc1NSk7XG4gICAgYXdhaXQgZGV2VG9vbHMuZGVmYXVsdChpZCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLnByb3BzLnJlcG9zaXRvcnkub25QdWxsRXJyb3IoKCkgPT4gdGhpcy5naXRUYWJUcmFja2VyLmVuc3VyZVZpc2libGUoKSksXG4gICAgKTtcbiAgfVxuXG4gIG9uQ29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXIpIHtcbiAgICBpZiAoc3RhdHVzQmFyLmRpc2FibGVHaXRJbmZvVGlsZSkge1xuICAgICAgc3RhdHVzQmFyLmRpc2FibGVHaXRJbmZvVGlsZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyR2l0aHViVG9rZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubG9naW5Nb2RlbC5yZW1vdmVUb2tlbignaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbScpO1xuICB9XG5cbiAgY2xvc2VEaWFsb2cgPSAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3Q6IGRpYWxvZ1JlcXVlc3RzLm51bGx9LCByZXNvbHZlKSk7XG5cbiAgb3BlbkluaXRpYWxpemVEaWFsb2cgPSBhc3luYyBkaXJQYXRoID0+IHtcbiAgICBpZiAoIWRpclBhdGgpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgIGlmIChhY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgY29uc3QgW3Byb2plY3RQYXRoXSA9IHRoaXMucHJvcHMucHJvamVjdC5yZWxhdGl2aXplUGF0aChhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICAgICAgZGlyUGF0aCA9IHByb2plY3RQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFkaXJQYXRoKSB7XG4gICAgICBjb25zdCBkaXJlY3RvcmllcyA9IHRoaXMucHJvcHMucHJvamVjdC5nZXREaXJlY3RvcmllcygpO1xuICAgICAgY29uc3Qgd2l0aFJlcG9zaXRvcmllcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBkaXJlY3Rvcmllcy5tYXAoYXN5bmMgZCA9PiBbZCwgYXdhaXQgdGhpcy5wcm9wcy5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZCldKSxcbiAgICAgICk7XG4gICAgICBjb25zdCBmaXJzdFVuaW5pdGlhbGl6ZWQgPSB3aXRoUmVwb3NpdG9yaWVzLmZpbmQoKFtkLCByXSkgPT4gIXIpO1xuICAgICAgaWYgKGZpcnN0VW5pbml0aWFsaXplZCAmJiBmaXJzdFVuaW5pdGlhbGl6ZWRbMF0pIHtcbiAgICAgICAgZGlyUGF0aCA9IGZpcnN0VW5pbml0aWFsaXplZFswXS5nZXRQYXRoKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFkaXJQYXRoKSB7XG4gICAgICBkaXJQYXRoID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdjb3JlLnByb2plY3RIb21lJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmluaXQoe2RpclBhdGh9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgY2hvc2VuUGF0aCA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLmluaXRpYWxpemUoY2hvc2VuUGF0aCk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ2xvbmVEaWFsb2cgPSBvcHRzID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY2xvbmUob3B0cyk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jICh1cmwsIGNob3NlblBhdGgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMuY2xvbmUodXJsLCBjaG9zZW5QYXRoKTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5DcmVkZW50aWFsc0RpYWxvZyA9IHF1ZXJ5ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNyZWRlbnRpYWwocXVlcnkpO1xuICAgICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgICAgfSk7XG4gICAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSk7XG4gICAgfSk7XG4gIH1cblxuICBvcGVuSXNzdWVpc2hEaWFsb2cgPSAoKSA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmlzc3VlaXNoKCk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHVybCA9PiB7XG4gICAgICBhd2FpdCBvcGVuSXNzdWVpc2hJdGVtKHVybCwge1xuICAgICAgICB3b3Jrc3BhY2U6IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgICAgICB3b3JrZGlyOiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNvbW1pdERpYWxvZyA9ICgpID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY29tbWl0KCk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlZiA9PiB7XG4gICAgICBhd2FpdCBvcGVuQ29tbWl0RGV0YWlsSXRlbShyZWYsIHtcbiAgICAgICAgd29ya3NwYWNlOiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICAgICAgcmVwb3NpdG9yeTogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LFxuICAgICAgfSk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ3JlYXRlRGlhbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5jcmVhdGUoKTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uUHJvZ3Jlc3NpbmdBY2NlcHQoYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IGRvdGNvbSA9IGdldEVuZHBvaW50KCdnaXRodWIuY29tJyk7XG4gICAgICBjb25zdCByZWxheUVudmlyb25tZW50ID0gUmVsYXlOZXR3b3JrTGF5ZXJNYW5hZ2VyLmdldEVudmlyb25tZW50Rm9ySG9zdChkb3Rjb20pO1xuXG4gICAgICBhd2FpdCBjcmVhdGVSZXBvc2l0b3J5KHJlc3VsdCwge2Nsb25lOiB0aGlzLnByb3BzLmNsb25lLCByZWxheUVudmlyb25tZW50fSk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuUHVibGlzaERpYWxvZyA9IHJlcG9zaXRvcnkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5wdWJsaXNoKHtsb2NhbERpcjogcmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICBjb25zdCBkb3Rjb20gPSBnZXRFbmRwb2ludCgnZ2l0aHViLmNvbScpO1xuICAgICAgY29uc3QgcmVsYXlFbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QoZG90Y29tKTtcblxuICAgICAgYXdhaXQgcHVibGlzaFJlcG9zaXRvcnkocmVzdWx0LCB7cmVwb3NpdG9yeSwgcmVsYXlFbnZpcm9ubWVudH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgdG9nZ2xlQ29tbWl0UHJldmlld0l0ZW0gPSAoKSA9PiB7XG4gICAgY29uc3Qgd29ya2RpciA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS50b2dnbGUoQ29tbWl0UHJldmlld0l0ZW0uYnVpbGRVUkkod29ya2RpcikpO1xuICB9XG5cbiAgc2hvd1dhdGVyZmFsbERpYWdub3N0aWNzKCkge1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oR2l0VGltaW5nc1ZpZXcuYnVpbGRVUkkoKSk7XG4gIH1cblxuICBzaG93Q2FjaGVEaWFnbm9zdGljcygpIHtcbiAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKEdpdENhY2hlVmlldy5idWlsZFVSSSgpKTtcbiAgfVxuXG4gIHN1cmZhY2VGcm9tRmlsZUF0UGF0aCA9IChmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5mb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgfVxuXG4gIHN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b24gPSAoKSA9PiB7XG4gICAgY29uc3QgZ2l0VGFiID0gdGhpcy5naXRUYWJUcmFja2VyLmdldENvbXBvbmVudCgpO1xuICAgIHJldHVybiBnaXRUYWIgJiYgZ2l0VGFiLmZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpO1xuICB9XG5cbiAgc3VyZmFjZVRvUmVjZW50Q29tbWl0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5mb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpO1xuICB9XG5cbiAgZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcygpIHtcbiAgICBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkOiBmYWxzZX0sIHRoaXMucHJvcHMud29ya3NwYWNlKTtcbiAgfVxuXG4gIGRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcygpIHtcbiAgICBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXModGhpcy5wcm9wcy53b3Jrc3BhY2UpO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpIHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIucXVpZXRseVNlbGVjdEl0ZW0oZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpO1xuICB9XG5cbiAgYXN5bmMgdmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZShzdGFnaW5nU3RhdHVzKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmICghZWRpdG9yLmdldFBhdGgoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGFic0ZpbGVQYXRoID0gYXdhaXQgZnMucmVhbHBhdGgoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgY29uc3QgcmVwb1BhdGggPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgICBpZiAocmVwb1BhdGggPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IFtwcm9qZWN0UGF0aF0gPSB0aGlzLnByb3BzLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkSW5mbyhcbiAgICAgICAgXCJIbW0sIHRoZXJlJ3Mgbm90aGluZyB0byBjb21wYXJlIHRoaXMgZmlsZSB0b1wiLFxuICAgICAgICB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdZb3UgY2FuIGNyZWF0ZSBhIEdpdCByZXBvc2l0b3J5IHRvIHRyYWNrIGNoYW5nZXMgdG8gdGhlIGZpbGVzIGluIHlvdXIgcHJvamVjdC4nLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgdGV4dDogJ0NyZWF0ZSBhIHJlcG9zaXRvcnkgbm93JyxcbiAgICAgICAgICAgIG9uRGlkQ2xpY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgY29uc3QgY3JlYXRlZFBhdGggPSBhd2FpdCB0aGlzLmluaXRpYWxpemVSZXBvKHByb2plY3RQYXRoKTtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgY29uZmlybWVkIHJlcG9zaXRvcnkgY3JlYXRpb24gZm9yIHRoaXMgcHJvamVjdCBwYXRoLFxuICAgICAgICAgICAgICAvLyByZXRyeSB0aGUgb3BlcmF0aW9uIHRoYXQgZ290IHRoZW0gaGVyZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgICAgICAgICAgaWYgKGNyZWF0ZWRQYXRoID09PSBwcm9qZWN0UGF0aCkgeyB0aGlzLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoc3RhZ2luZ1N0YXR1cyk7IH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoYWJzRmlsZVBhdGguc3RhcnRzV2l0aChyZXBvUGF0aCkpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gYWJzRmlsZVBhdGguc2xpY2UocmVwb1BhdGgubGVuZ3RoICsgMSk7XG4gICAgICB0aGlzLnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgICAgIGNvbnN0IHNwbGl0RGlyZWN0aW9uID0gdGhpcy5wcm9wcy5jb25maWcuZ2V0KCdnaXRodWIudmlld0NoYW5nZXNGb3JDdXJyZW50RmlsZURpZmZQYW5lU3BsaXREaXJlY3Rpb24nKTtcbiAgICAgIGNvbnN0IHBhbmUgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gICAgICBpZiAoc3BsaXREaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgcGFuZS5zcGxpdFJpZ2h0KCk7XG4gICAgICB9IGVsc2UgaWYgKHNwbGl0RGlyZWN0aW9uID09PSAnZG93bicpIHtcbiAgICAgICAgcGFuZS5zcGxpdERvd24oKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxpbmVOdW0gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IHRoaXMucHJvcHMud29ya3NwYWNlLm9wZW4oXG4gICAgICAgIENoYW5nZWRGaWxlSXRlbS5idWlsZFVSSShmaWxlUGF0aCwgcmVwb1BhdGgsIHN0YWdpbmdTdGF0dXMpLFxuICAgICAgICB7cGVuZGluZzogdHJ1ZSwgYWN0aXZhdGVQYW5lOiB0cnVlLCBhY3RpdmF0ZUl0ZW06IHRydWV9LFxuICAgICAgKTtcbiAgICAgIGF3YWl0IGl0ZW0uZ2V0UmVhbEl0ZW1Qcm9taXNlKCk7XG4gICAgICBhd2FpdCBpdGVtLmdldEZpbGVQYXRjaExvYWRlZFByb21pc2UoKTtcbiAgICAgIGl0ZW0uZ29Ub0RpZmZMaW5lKGxpbmVOdW0pO1xuICAgICAgaXRlbS5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7YWJzRmlsZVBhdGh9IGRvZXMgbm90IGJlbG9uZyB0byByZXBvICR7cmVwb1BhdGh9YCk7XG4gICAgfVxuICB9XG5cbiAgdmlld1Vuc3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoJ3Vuc3RhZ2VkJyk7XG4gIH1cblxuICB2aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoJ3N0YWdlZCcpO1xuICB9XG5cbiAgb3BlbkZpbGVzKGZpbGVQYXRocywgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IHtcbiAgICAgIGNvbnN0IGFic29sdXRlUGF0aCA9IHBhdGguam9pbihyZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksIGZpbGVQYXRoKTtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKGFic29sdXRlUGF0aCwge3BlbmRpbmc6IGZpbGVQYXRocy5sZW5ndGggPT09IDF9KTtcbiAgICB9KSk7XG4gIH1cblxuICBnZXRVbnNhdmVkRmlsZXMoZmlsZVBhdGhzLCB3b3JrZGlyUGF0aCkge1xuICAgIGNvbnN0IGlzTW9kaWZpZWRCeVBhdGggPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKGVkaXRvciA9PiB7XG4gICAgICBpc01vZGlmaWVkQnlQYXRoLnNldChlZGl0b3IuZ2V0UGF0aCgpLCBlZGl0b3IuaXNNb2RpZmllZCgpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmlsZVBhdGhzLmZpbHRlcihmaWxlUGF0aCA9PiB7XG4gICAgICBjb25zdCBhYnNGaWxlUGF0aCA9IHBhdGguam9pbih3b3JrZGlyUGF0aCwgZmlsZVBhdGgpO1xuICAgICAgcmV0dXJuIGlzTW9kaWZpZWRCeVBhdGguZ2V0KGFic0ZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGVuc3VyZU5vVW5zYXZlZEZpbGVzKGZpbGVQYXRocywgbWVzc2FnZSwgd29ya2RpclBhdGggPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSkge1xuICAgIGNvbnN0IHVuc2F2ZWRGaWxlcyA9IHRoaXMuZ2V0VW5zYXZlZEZpbGVzKGZpbGVQYXRocywgd29ya2RpclBhdGgpLm1hcChmaWxlUGF0aCA9PiBgXFxgJHtmaWxlUGF0aH1cXGBgKS5qb2luKCc8YnI+Jyk7XG4gICAgaWYgKHVuc2F2ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBgWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzIGluOjxicj4ke3Vuc2F2ZWRGaWxlc30uYCxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKGZpbGVQYXRocykge1xuICAgIGNvbnN0IGRlc3RydWN0aXZlQWN0aW9uID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpO1xuICAgIH07XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5zdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoXG4gICAgICBmaWxlUGF0aHMsXG4gICAgICAoKSA9PiB0aGlzLmVuc3VyZU5vVW5zYXZlZEZpbGVzKGZpbGVQYXRocywgJ0Nhbm5vdCBkaXNjYXJkIGNoYW5nZXMgaW4gc2VsZWN0ZWQgZmlsZXMuJyksXG4gICAgICBkZXN0cnVjdGl2ZUFjdGlvbixcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgZGlzY2FyZExpbmVzKG11bHRpRmlsZVBhdGNoLCBsaW5lcywgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgIC8vIChrdXljaGFjbykgRm9yIG5vdyB3ZSBvbmx5IHN1cHBvcnQgZGlzY2FyZGluZyByb3dzIGZvciBNdWx0aUZpbGVQYXRjaGVzIHRoYXQgY29udGFpbiBhIHNpbmdsZSBmaWxlIHBhdGNoXG4gICAgLy8gVGhlIG9ubHkgd2F5IHRvIGFjY2VzcyB0aGlzIG1ldGhvZCBmcm9tIHRoZSBVSSBpcyB0byBiZSBpbiBhIENoYW5nZWRGaWxlSXRlbSwgd2hpY2ggb25seSBoYXMgYSBzaW5nbGUgZmlsZSBwYXRjaFxuICAgIGlmIChtdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IG11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKClbMF0uZ2V0UGF0aCgpO1xuICAgIGNvbnN0IGRlc3RydWN0aXZlQWN0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlzY2FyZEZpbGVQYXRjaCA9IG11bHRpRmlsZVBhdGNoLmdldFVuc3RhZ2VQYXRjaEZvckxpbmVzKGxpbmVzKTtcbiAgICAgIGF3YWl0IHJlcG9zaXRvcnkuYXBwbHlQYXRjaFRvV29ya2RpcihkaXNjYXJkRmlsZVBhdGNoKTtcbiAgICB9O1xuICAgIHJldHVybiBhd2FpdCByZXBvc2l0b3J5LnN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhcbiAgICAgIFtmaWxlUGF0aF0sXG4gICAgICAoKSA9PiB0aGlzLmVuc3VyZU5vVW5zYXZlZEZpbGVzKFtmaWxlUGF0aF0sICdDYW5ub3QgZGlzY2FyZCBsaW5lcy4nLCByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpLFxuICAgICAgZGVzdHJ1Y3RpdmVBY3Rpb24sXG4gICAgICBmaWxlUGF0aCxcbiAgICApO1xuICB9XG5cbiAgZ2V0RmlsZVBhdGhzRm9yTGFzdERpc2NhcmQocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBsZXQgbGFzdFNuYXBzaG90cyA9IHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRMYXN0SGlzdG9yeVNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgbGFzdFNuYXBzaG90cyA9IGxhc3RTbmFwc2hvdHMgPyBbbGFzdFNuYXBzaG90c10gOiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RTbmFwc2hvdHMubWFwKHNuYXBzaG90ID0+IHNuYXBzaG90LmZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIHVuZG9MYXN0RGlzY2FyZChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCwgcmVwb3NpdG9yeSA9IHRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuZ2V0RmlsZVBhdGhzRm9yTGFzdERpc2NhcmQocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCByZXBvc2l0b3J5LnJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzKFxuICAgICAgICAoKSA9PiB0aGlzLmVuc3VyZU5vVW5zYXZlZEZpbGVzKGZpbGVQYXRocywgJ0Nhbm5vdCB1bmRvIGxhc3QgZGlzY2FyZC4nKSxcbiAgICAgICAgcGFydGlhbERpc2NhcmRGaWxlUGF0aCxcbiAgICAgICk7XG4gICAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgICBhd2FpdCB0aGlzLnByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgR2l0RXJyb3IgJiYgZS5zdGRFcnIubWF0Y2goL2ZhdGFsOiBOb3QgYSB2YWxpZCBvYmplY3QgbmFtZS8pKSB7XG4gICAgICAgIHRoaXMuY2xlYW5VcEhpc3RvcnlGb3JGaWxlUGF0aHMoZmlsZVBhdGhzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcHJvY2VlZE9yUHJvbXB0QmFzZWRPblJlc3VsdHMocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBjb25mbGljdHMgPSByZXN1bHRzLmZpbHRlcigoe2NvbmZsaWN0fSkgPT4gY29uZmxpY3QpO1xuICAgIGlmIChjb25mbGljdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb2NlZWRXaXRoTGFzdERpc2NhcmRVbmRvKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnByb21wdEFib3V0Q29uZmxpY3RzKHJlc3VsdHMsIGNvbmZsaWN0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcHJvbXB0QWJvdXRDb25mbGljdHMocmVzdWx0cywgY29uZmxpY3RzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IGNvbmZsaWN0ZWRGaWxlcyA9IGNvbmZsaWN0cy5tYXAoKHtmaWxlUGF0aH0pID0+IGBcXHQke2ZpbGVQYXRofWApLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGNob2ljZSA9IHRoaXMucHJvcHMuY29uZmlybSh7XG4gICAgICBtZXNzYWdlOiAnVW5kb2luZyB3aWxsIHJlc3VsdCBpbiBjb25mbGljdHMuLi4nLFxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiBgZm9yIHRoZSBmb2xsb3dpbmcgZmlsZXM6XFxuJHtjb25mbGljdGVkRmlsZXN9XFxuYCArXG4gICAgICAgICdXb3VsZCB5b3UgbGlrZSB0byBhcHBseSB0aGUgY2hhbmdlcyB3aXRoIG1lcmdlIGNvbmZsaWN0IG1hcmtlcnMsICcgK1xuICAgICAgICAnb3Igb3BlbiB0aGUgdGV4dCB3aXRoIG1lcmdlIGNvbmZsaWN0IG1hcmtlcnMgaW4gYSBuZXcgZmlsZT8nLFxuICAgICAgYnV0dG9uczogWydNZXJnZSB3aXRoIGNvbmZsaWN0IG1hcmtlcnMnLCAnT3BlbiBpbiBuZXcgZmlsZScsICdDYW5jZWwnXSxcbiAgICB9KTtcbiAgICBpZiAoY2hvaWNlID09PSAwKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb2NlZWRXaXRoTGFzdERpc2NhcmRVbmRvKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSBpZiAoY2hvaWNlID09PSAxKSB7XG4gICAgICBhd2FpdCB0aGlzLm9wZW5Db25mbGljdHNJbk5ld0VkaXRvcnMoY29uZmxpY3RzLm1hcCgoe3Jlc3VsdFBhdGh9KSA9PiByZXN1bHRQYXRoKSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYW5VcEhpc3RvcnlGb3JGaWxlUGF0aHMoZmlsZVBhdGhzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5jbGVhckRpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIGNvbnN0IGZpbGVQYXRoc1N0ciA9IGZpbGVQYXRocy5tYXAoZmlsZVBhdGggPT4gYFxcYCR7ZmlsZVBhdGh9XFxgYCkuam9pbignPGJyPicpO1xuICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihcbiAgICAgICdEaXNjYXJkIGhpc3RvcnkgaGFzIGV4cGlyZWQuJyxcbiAgICAgIHtcbiAgICAgICAgZGVzY3JpcHRpb246IGBDYW5ub3QgdW5kbyBkaXNjYXJkIGZvcjxicj4ke2ZpbGVQYXRoc1N0cn08YnI+U3RhbGUgZGlzY2FyZCBoaXN0b3J5IGhhcyBiZWVuIGRlbGV0ZWQuYCxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBhc3luYyBwcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gcmVzdWx0cy5tYXAoYXN5bmMgcmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IHtmaWxlUGF0aCwgcmVzdWx0UGF0aCwgZGVsZXRlZCwgY29uZmxpY3QsIHRoZWlyc1NoYSwgY29tbW9uQmFzZVNoYSwgY3VycmVudFNoYX0gPSByZXN1bHQ7XG4gICAgICBjb25zdCBhYnNGaWxlUGF0aCA9IHBhdGguam9pbih0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSwgZmlsZVBhdGgpO1xuICAgICAgaWYgKGRlbGV0ZWQgJiYgcmVzdWx0UGF0aCA9PT0gbnVsbCkge1xuICAgICAgICBhd2FpdCBmcy5yZW1vdmUoYWJzRmlsZVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgZnMuY29weShyZXN1bHRQYXRoLCBhYnNGaWxlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmxpY3QpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvc2l0b3J5LndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgoZmlsZVBhdGgsIGNvbW1vbkJhc2VTaGEsIGN1cnJlbnRTaGEsIHRoZWlyc1NoYSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS5wb3BEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5Db25mbGljdHNJbk5ld0VkaXRvcnMocmVzdWx0UGF0aHMpIHtcbiAgICBjb25zdCBlZGl0b3JQcm9taXNlcyA9IHJlc3VsdFBhdGhzLm1hcChyZXN1bHRQYXRoID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKHJlc3VsdFBhdGgpO1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChlZGl0b3JQcm9taXNlcyk7XG4gIH1cblxuICByZXBvcnRSZWxheUVycm9yID0gKGZyaWVuZGx5TWVzc2FnZSwgZXJyKSA9PiB7XG4gICAgY29uc3Qgb3B0cyA9IHtkaXNtaXNzYWJsZTogdHJ1ZX07XG5cbiAgICBpZiAoZXJyLm5ldHdvcmspIHtcbiAgICAgIC8vIE9mZmxpbmVcbiAgICAgIG9wdHMuaWNvbiA9ICdhbGlnbm1lbnQtdW5hbGlnbic7XG4gICAgICBvcHRzLmRlc2NyaXB0aW9uID0gXCJJdCBsb29rcyBsaWtlIHlvdSdyZSBvZmZsaW5lIHJpZ2h0IG5vdy5cIjtcbiAgICB9IGVsc2UgaWYgKGVyci5yZXNwb25zZVRleHQpIHtcbiAgICAgIC8vIFRyYW5zaWVudCBlcnJvciBsaWtlIGEgNTAwIGZyb20gdGhlIEFQSVxuICAgICAgb3B0cy5kZXNjcmlwdGlvbiA9ICdUaGUgR2l0SHViIEFQSSByZXBvcnRlZCBhIHByb2JsZW0uJztcbiAgICAgIG9wdHMuZGV0YWlsID0gZXJyLnJlc3BvbnNlVGV4dDtcbiAgICB9IGVsc2UgaWYgKGVyci5lcnJvcnMpIHtcbiAgICAgIC8vIEdyYXBoUUwgZXJyb3JzXG4gICAgICBvcHRzLmRldGFpbCA9IGVyci5lcnJvcnMubWFwKGUgPT4gZS5tZXNzYWdlKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy5kZXRhaWwgPSBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKGZyaWVuZGx5TWVzc2FnZSwgb3B0cyk7XG4gIH1cblxuICAvKlxuICAgKiBBc3luY2hyb25vdXNseSBjb3VudCB0aGUgY29uZmxpY3QgbWFya2VycyBwcmVzZW50IGluIGEgZmlsZSBzcGVjaWZpZWQgYnkgZnVsbCBwYXRoLlxuICAgKi9cbiAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyhmdWxsUGF0aCkge1xuICAgIGNvbnN0IHJlYWRTdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGZ1bGxQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIENvbmZsaWN0LmNvdW50RnJvbVN0cmVhbShyZWFkU3RyZWFtKS50aGVuKGNvdW50ID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXNvbHV0aW9uUHJvZ3Jlc3MucmVwb3J0TWFya2VyQ291bnQoZnVsbFBhdGgsIGNvdW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFRhYlRyYWNrZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lLCB7Z2V0V29ya3NwYWNlLCB1cml9KSB7XG4gICAgYXV0b2JpbmQodGhpcywgJ3RvZ2dsZScsICd0b2dnbGVGb2N1cycsICdlbnN1cmVWaXNpYmxlJyk7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIHRoaXMuZ2V0V29ya3NwYWNlID0gZ2V0V29ya3NwYWNlO1xuICAgIHRoaXMudXJpID0gdXJpO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlKCkge1xuICAgIGNvbnN0IGZvY3VzVG9SZXN0b3JlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBsZXQgc2hvdWxkUmVzdG9yZUZvY3VzID0gZmFsc2U7XG5cbiAgICAvLyBSZW5kZXJlZCA9PiB0aGUgZG9jayBpdGVtIGlzIGJlaW5nIHJlbmRlcmVkLCB3aGV0aGVyIG9yIG5vdCB0aGUgZG9jayBpcyB2aXNpYmxlIG9yIHRoZSBpdGVtXG4gICAgLy8gICBpcyB2aXNpYmxlIHdpdGhpbiBpdHMgZG9jay5cbiAgICAvLyBWaXNpYmxlID0+IHRoZSBpdGVtIGlzIGFjdGl2ZSBhbmQgdGhlIGRvY2sgaXRlbSBpcyBhY3RpdmUgd2l0aGluIGl0cyBkb2NrLlxuICAgIGNvbnN0IHdhc1JlbmRlcmVkID0gdGhpcy5pc1JlbmRlcmVkKCk7XG4gICAgY29uc3Qgd2FzVmlzaWJsZSA9IHRoaXMuaXNWaXNpYmxlKCk7XG5cbiAgICBpZiAoIXdhc1JlbmRlcmVkIHx8ICF3YXNWaXNpYmxlKSB7XG4gICAgICAvLyBOb3QgcmVuZGVyZWQsIG9yIHJlbmRlcmVkIGJ1dCBub3QgYW4gYWN0aXZlIGl0ZW0gaW4gYSB2aXNpYmxlIGRvY2suXG4gICAgICBhd2FpdCB0aGlzLnJldmVhbCgpO1xuICAgICAgc2hvdWxkUmVzdG9yZUZvY3VzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVuZGVyZWQgYW5kIGFuIGFjdGl2ZSBpdGVtIHdpdGhpbiBhIHZpc2libGUgZG9jay5cbiAgICAgIGF3YWl0IHRoaXMuaGlkZSgpO1xuICAgICAgc2hvdWxkUmVzdG9yZUZvY3VzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFJlc3RvcmVGb2N1cykge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBmb2N1c1RvUmVzdG9yZS5mb2N1cygpKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB0b2dnbGVGb2N1cygpIHtcbiAgICBjb25zdCBoYWRGb2N1cyA9IHRoaXMuaGFzRm9jdXMoKTtcbiAgICBhd2FpdCB0aGlzLmVuc3VyZVZpc2libGUoKTtcblxuICAgIGlmIChoYWRGb2N1cykge1xuICAgICAgbGV0IHdvcmtzcGFjZSA9IHRoaXMuZ2V0V29ya3NwYWNlKCk7XG4gICAgICBpZiAod29ya3NwYWNlLmdldENlbnRlcikge1xuICAgICAgICB3b3Jrc3BhY2UgPSB3b3Jrc3BhY2UuZ2V0Q2VudGVyKCk7XG4gICAgICB9XG4gICAgICB3b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBlbnN1cmVWaXNpYmxlKCkge1xuICAgIGlmICghdGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgYXdhaXQgdGhpcy5yZXZlYWwoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBlbnN1cmVSZW5kZXJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRXb3Jrc3BhY2UoKS5vcGVuKHRoaXMudXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWUsIGFjdGl2YXRlSXRlbTogZmFsc2UsIGFjdGl2YXRlUGFuZTogZmFsc2V9KTtcbiAgfVxuXG4gIHJldmVhbCgpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKGAke3RoaXMubmFtZX0tdGFiLW9wZW5gKTtcbiAgICByZXR1cm4gdGhpcy5nZXRXb3Jrc3BhY2UoKS5vcGVuKHRoaXMudXJpLCB7c2VhcmNoQWxsUGFuZXM6IHRydWUsIGFjdGl2YXRlSXRlbTogdHJ1ZSwgYWN0aXZhdGVQYW5lOiB0cnVlfSk7XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGluY3JlbWVudENvdW50ZXIoYCR7dGhpcy5uYW1lfS10YWItY2xvc2VgKTtcbiAgICByZXR1cm4gdGhpcy5nZXRXb3Jrc3BhY2UoKS5oaWRlKHRoaXMudXJpKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuZ2V0Q29tcG9uZW50KCkucmVzdG9yZUZvY3VzKCk7XG4gIH1cblxuICBnZXRJdGVtKCkge1xuICAgIGNvbnN0IHBhbmUgPSB0aGlzLmdldFdvcmtzcGFjZSgpLnBhbmVGb3JVUkkodGhpcy51cmkpO1xuICAgIGlmICghcGFuZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcGFuZUl0ZW0gPSBwYW5lLml0ZW1Gb3JVUkkodGhpcy51cmkpO1xuICAgIGlmICghcGFuZUl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwYW5lSXRlbTtcbiAgfVxuXG4gIGdldENvbXBvbmVudCgpIHtcbiAgICBjb25zdCBwYW5lSXRlbSA9IHRoaXMuZ2V0SXRlbSgpO1xuICAgIGlmICghcGFuZUl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKCh0eXBlb2YgcGFuZUl0ZW0uZ2V0UmVhbEl0ZW0pICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhbmVJdGVtLmdldFJlYWxJdGVtKCk7XG4gIH1cblxuICBnZXRET01FbGVtZW50KCkge1xuICAgIGNvbnN0IHBhbmVJdGVtID0gdGhpcy5nZXRJdGVtKCk7XG4gICAgaWYgKCFwYW5lSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICgoKHR5cGVvZiBwYW5lSXRlbS5nZXRFbGVtZW50KSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwYW5lSXRlbS5nZXRFbGVtZW50KCk7XG4gIH1cblxuICBpc1JlbmRlcmVkKCkge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0V29ya3NwYWNlKCkucGFuZUZvclVSSSh0aGlzLnVyaSk7XG4gIH1cblxuICBpc1Zpc2libGUoKSB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gdGhpcy5nZXRXb3Jrc3BhY2UoKTtcbiAgICByZXR1cm4gd29ya3NwYWNlLmdldFBhbmVDb250YWluZXJzKClcbiAgICAgIC5maWx0ZXIoY29udGFpbmVyID0+IGNvbnRhaW5lciA9PT0gd29ya3NwYWNlLmdldENlbnRlcigpIHx8IGNvbnRhaW5lci5pc1Zpc2libGUoKSlcbiAgICAgIC5zb21lKGNvbnRhaW5lciA9PiBjb250YWluZXIuZ2V0UGFuZXMoKS5zb21lKHBhbmUgPT4ge1xuICAgICAgICBjb25zdCBpdGVtID0gcGFuZS5nZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgIHJldHVybiBpdGVtICYmIGl0ZW0uZ2V0VVJJICYmIGl0ZW0uZ2V0VVJJKCkgPT09IHRoaXMudXJpO1xuICAgICAgfSkpO1xuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuZ2V0RE9NRWxlbWVudCgpO1xuICAgIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gIH1cbn1cbiJdfQ==