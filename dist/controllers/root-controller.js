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
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, this.renderCommands(), this.renderStatusBarTile(), this.renderPaneItems(), this.renderDialogs(), this.renderConflictResolver(), this.renderCommentDecorations());
  }

  renderCommands() {
    const devMode = global.atom && global.atom.inDevMode();
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-workspace"
    }, devMode && /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:install-react-dev-tools",
      callback: this.installReactDevTools
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:toggle-commit-preview",
      callback: this.toggleCommitPreviewItem
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:logout",
      callback: this.clearGithubToken
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:show-waterfall-diagnostics",
      callback: this.showWaterfallDiagnostics
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:show-cache-diagnostics",
      callback: this.showCacheDiagnostics
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:toggle-git-tab",
      callback: this.gitTabTracker.toggle
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:toggle-git-tab-focus",
      callback: this.gitTabTracker.toggleFocus
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:toggle-github-tab",
      callback: this.githubTabTracker.toggle
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:toggle-github-tab-focus",
      callback: this.githubTabTracker.toggleFocus
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:initialize",
      callback: () => this.openInitializeDialog()
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:clone",
      callback: () => this.openCloneDialog()
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:open-issue-or-pull-request",
      callback: () => this.openIssueishDialog()
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:open-commit",
      callback: () => this.openCommitDialog()
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:create-repository",
      callback: () => this.openCreateDialog()
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:view-unstaged-changes-for-current-file",
      callback: this.viewUnstagedChangesForCurrentFile
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:view-staged-changes-for-current-file",
      callback: this.viewStagedChangesForCurrentFile
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:close-all-diff-views",
      callback: this.destroyFilePatchPaneItems
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:close-empty-diff-views",
      callback: this.destroyEmptyFilePatchPaneItems
    })), /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, data => {
      if (!data || !data.isPublishable || !data.remotes.filter(r => r.isGithubRepo()).isEmpty()) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_commands.default, {
        registry: this.props.commands,
        target: "atom-workspace"
      }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
        command: "github:publish-repository",
        callback: () => this.openPublishDialog(this.props.repository)
      }));
    }));
  }

  renderStatusBarTile() {
    return /*#__PURE__*/_react.default.createElement(_statusBar.default, {
      statusBar: this.props.statusBar,
      onConsumeStatusBar: sb => this.onConsumeStatusBar(sb),
      className: "github-StatusBarTileController"
    }, /*#__PURE__*/_react.default.createElement(_statusBarTileController.default, {
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
    return /*#__PURE__*/_react.default.createElement(_dialogsController.default, {
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

    return /*#__PURE__*/_react.default.createElement(_commentDecorationsContainer.default, {
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

    return /*#__PURE__*/_react.default.createElement(_repositoryConflictController.default, {
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
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _gitTabItem.default.uriPattern,
      className: "github-Git-root"
    }, ({
      itemHolder
    }) => /*#__PURE__*/_react.default.createElement(_gitTabItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _githubTabItem.default.uriPattern,
      className: "github-GitHub-root"
    }, ({
      itemHolder
    }) => /*#__PURE__*/_react.default.createElement(_githubTabItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _changedFileItem.default.uriPattern
    }, ({
      itemHolder,
      params
    }) => /*#__PURE__*/_react.default.createElement(_changedFileItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _commitPreviewItem.default.uriPattern,
      className: "github-CommitPreview-root"
    }, ({
      itemHolder,
      params
    }) => /*#__PURE__*/_react.default.createElement(_commitPreviewItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _commitDetailItem.default.uriPattern,
      className: "github-CommitDetail-root"
    }, ({
      itemHolder,
      params
    }) => /*#__PURE__*/_react.default.createElement(_commitDetailItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _issueishDetailItem.default.uriPattern
    }, ({
      itemHolder,
      params,
      deserialized
    }) => /*#__PURE__*/_react.default.createElement(_issueishDetailItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _reviewsItem.default.uriPattern
    }, ({
      itemHolder,
      params
    }) => /*#__PURE__*/_react.default.createElement(_reviewsItem.default, {
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
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _gitTimingsView.default.uriPattern
    }, ({
      itemHolder
    }) => /*#__PURE__*/_react.default.createElement(_gitTimingsView.default, {
      ref: itemHolder.setter
    })), /*#__PURE__*/_react.default.createElement(_paneItem.default, {
      workspace: this.props.workspace,
      uriPattern: _gitCacheView.default.uriPattern
    }, ({
      itemHolder
    }) => /*#__PURE__*/_react.default.createElement(_gitCacheView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yb290LWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiUm9vdENvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwicmVwb3NpdG9yeSIsImlzUHVibGlzaGFibGUiLCJyZW1vdGVzIiwiZ2V0UmVtb3RlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0U3RhdGUiLCJkaWFsb2dSZXF1ZXN0IiwiZGlhbG9nUmVxdWVzdHMiLCJudWxsIiwiZGlyUGF0aCIsImFjdGl2ZUVkaXRvciIsIndvcmtzcGFjZSIsImdldEFjdGl2ZVRleHRFZGl0b3IiLCJwcm9qZWN0UGF0aCIsInByb2plY3QiLCJyZWxhdGl2aXplUGF0aCIsImdldFBhdGgiLCJkaXJlY3RvcmllcyIsImdldERpcmVjdG9yaWVzIiwid2l0aFJlcG9zaXRvcmllcyIsImFsbCIsIm1hcCIsImQiLCJyZXBvc2l0b3J5Rm9yRGlyZWN0b3J5IiwiZmlyc3RVbmluaXRpYWxpemVkIiwiZmluZCIsInIiLCJjb25maWciLCJnZXQiLCJpbml0Iiwib25Qcm9ncmVzc2luZ0FjY2VwdCIsImNob3NlblBhdGgiLCJpbml0aWFsaXplIiwiY2xvc2VEaWFsb2ciLCJvbkNhbmNlbCIsIm9wdHMiLCJjbG9uZSIsInVybCIsInF1ZXJ5IiwicmVqZWN0IiwiY3JlZGVudGlhbCIsInJlc3VsdCIsImlzc3VlaXNoIiwid29ya2RpciIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwiY29tbWl0IiwicmVmIiwiY3JlYXRlIiwiZG90Y29tIiwicmVsYXlFbnZpcm9ubWVudCIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEVudmlyb25tZW50Rm9ySG9zdCIsInB1Ymxpc2giLCJsb2NhbERpciIsInRvZ2dsZSIsIkNvbW1pdFByZXZpZXdJdGVtIiwiYnVpbGRVUkkiLCJmaWxlUGF0aCIsInN0YWdpbmdTdGF0dXMiLCJnaXRUYWIiLCJnaXRUYWJUcmFja2VyIiwiZ2V0Q29tcG9uZW50IiwiZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSIsImZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbiIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiZnJpZW5kbHlNZXNzYWdlIiwiZXJyIiwiZGlzbWlzc2FibGUiLCJuZXR3b3JrIiwiaWNvbiIsImRlc2NyaXB0aW9uIiwicmVzcG9uc2VUZXh0IiwiZGV0YWlsIiwiZXJyb3JzIiwiZSIsIm1lc3NhZ2UiLCJqb2luIiwic3RhY2siLCJub3RpZmljYXRpb25NYW5hZ2VyIiwiYWRkRXJyb3IiLCJzdGF0ZSIsIlRhYlRyYWNrZXIiLCJ1cmkiLCJHaXRUYWJJdGVtIiwiZ2V0V29ya3NwYWNlIiwiZ2l0aHViVGFiVHJhY2tlciIsIkdpdEh1YlRhYkl0ZW0iLCJzdWJzY3JpcHRpb24iLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwib25QdWxsRXJyb3IiLCJlbnN1cmVWaXNpYmxlIiwiY29tbWFuZHMiLCJvbkRpZERpc3BhdGNoIiwiZXZlbnQiLCJ0eXBlIiwic3RhcnRzV2l0aCIsImNvbnRleHRDb21tYW5kIiwicGFja2FnZSIsImNvbW1hbmQiLCJjb21wb25lbnREaWRNb3VudCIsIm9wZW5UYWJzIiwicmVuZGVyIiwicmVuZGVyQ29tbWFuZHMiLCJyZW5kZXJTdGF0dXNCYXJUaWxlIiwicmVuZGVyUGFuZUl0ZW1zIiwicmVuZGVyRGlhbG9ncyIsInJlbmRlckNvbmZsaWN0UmVzb2x2ZXIiLCJyZW5kZXJDb21tZW50RGVjb3JhdGlvbnMiLCJkZXZNb2RlIiwiZ2xvYmFsIiwiYXRvbSIsImluRGV2TW9kZSIsImluc3RhbGxSZWFjdERldlRvb2xzIiwidG9nZ2xlQ29tbWl0UHJldmlld0l0ZW0iLCJjbGVhckdpdGh1YlRva2VuIiwic2hvd1dhdGVyZmFsbERpYWdub3N0aWNzIiwic2hvd0NhY2hlRGlhZ25vc3RpY3MiLCJ0b2dnbGVGb2N1cyIsIm9wZW5Jbml0aWFsaXplRGlhbG9nIiwib3BlbkNsb25lRGlhbG9nIiwib3Blbklzc3VlaXNoRGlhbG9nIiwib3BlbkNvbW1pdERpYWxvZyIsIm9wZW5DcmVhdGVEaWFsb2ciLCJ2aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUiLCJ2aWV3U3RhZ2VkQ2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsImRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcyIsImZldGNoRGF0YSIsImRhdGEiLCJmaWx0ZXIiLCJpc0dpdGh1YlJlcG8iLCJpc0VtcHR5Iiwib3BlblB1Ymxpc2hEaWFsb2ciLCJzdGF0dXNCYXIiLCJzYiIsIm9uQ29uc3VtZVN0YXR1c0JhciIsInBpcGVsaW5lTWFuYWdlciIsInRvb2x0aXBzIiwiY29uZmlybSIsImxvZ2luTW9kZWwiLCJjdXJyZW50V2luZG93IiwicmVwb3J0UmVsYXlFcnJvciIsInJlc29sdXRpb25Qcm9ncmVzcyIsInJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MiLCJ3b3JrZGlyQ29udGV4dFBvb2wiLCJnZXRDdXJyZW50V29ya0RpcnMiLCJiaW5kIiwib25EaWRDaGFuZ2VXb3JrRGlycyIsIm9uRGlkQ2hhbmdlUG9vbENvbnRleHRzIiwidXJpUGF0dGVybiIsIml0ZW1Ib2xkZXIiLCJzZXR0ZXIiLCJncmFtbWFycyIsIm9wZW5GaWxlcyIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwidW5kb0xhc3REaXNjYXJkIiwiY3VycmVudFdvcmtEaXIiLCJjb250ZXh0TG9ja2VkIiwiY2hhbmdlV29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwiQ2hhbmdlZEZpbGVJdGVtIiwicGFyYW1zIiwicGF0aCIsInJlbFBhdGgiLCJ3b3JraW5nRGlyZWN0b3J5Iiwia2V5bWFwcyIsImRpc2NhcmRMaW5lcyIsInN1cmZhY2VGcm9tRmlsZUF0UGF0aCIsInN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b24iLCJDb21taXREZXRhaWxJdGVtIiwic2hhIiwic3VyZmFjZVRvUmVjZW50Q29tbWl0IiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwiZGVzZXJpYWxpemVkIiwiaG9zdCIsIm93bmVyIiwicmVwbyIsInBhcnNlSW50IiwiaXNzdWVpc2hOdW1iZXIiLCJpbml0U2VsZWN0ZWRUYWIiLCJSZXZpZXdzSXRlbSIsIm51bWJlciIsIkdpdFRpbWluZ3NWaWV3IiwiR2l0Q2FjaGVWaWV3Iiwic3RhcnRPcGVuIiwiZW5zdXJlUmVuZGVyZWQiLCJzdGFydFJldmVhbGVkIiwiZG9ja3MiLCJTZXQiLCJwYW5lQ29udGFpbmVyRm9yVVJJIiwiY29udGFpbmVyIiwic2hvdyIsImRvY2siLCJkZXZUb29sc05hbWUiLCJkZXZUb29scyIsInJlcXVpcmUiLCJpbnN0YWxsRXh0ZW5zaW9uIiwiUkVBQ1RfREVWRUxPUEVSX1RPT0xTIiwiaWQiLCJhZGRTdWNjZXNzIiwiY3Jvc3NVbnppcE5hbWUiLCJ1bnppcCIsImV4dGVuc2lvbkZvbGRlciIsInJlbW90ZSIsImFwcCIsImV4dGVuc2lvbkZpbGUiLCJmcyIsImVuc3VyZURpciIsImRpcm5hbWUiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkJ1ZmZlciIsImZyb20iLCJhcnJheUJ1ZmZlciIsIndyaXRlRmlsZSIsImV4aXN0cyIsImRlZmF1bHQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJjb21wb25lbnREaWRVcGRhdGUiLCJkaXNhYmxlR2l0SW5mb1RpbGUiLCJyZW1vdmVUb2tlbiIsIm9wZW4iLCJvbmx5U3RhZ2VkIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJ2aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlIiwiZWRpdG9yIiwiYWJzRmlsZVBhdGgiLCJyZWFscGF0aCIsInJlcG9QYXRoIiwibm90aWZpY2F0aW9uIiwiYWRkSW5mbyIsImJ1dHRvbnMiLCJjbGFzc05hbWUiLCJ0ZXh0Iiwib25EaWRDbGljayIsImRpc21pc3MiLCJjcmVhdGVkUGF0aCIsImluaXRpYWxpemVSZXBvIiwic2xpY2UiLCJsZW5ndGgiLCJzcGxpdERpcmVjdGlvbiIsInBhbmUiLCJnZXRBY3RpdmVQYW5lIiwic3BsaXRSaWdodCIsInNwbGl0RG93biIsImxpbmVOdW0iLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInJvdyIsIml0ZW0iLCJwZW5kaW5nIiwiYWN0aXZhdGVQYW5lIiwiYWN0aXZhdGVJdGVtIiwiZ2V0UmVhbEl0ZW1Qcm9taXNlIiwiZ2V0RmlsZVBhdGNoTG9hZGVkUHJvbWlzZSIsImdvVG9EaWZmTGluZSIsImZvY3VzIiwiRXJyb3IiLCJmaWxlUGF0aHMiLCJhYnNvbHV0ZVBhdGgiLCJnZXRVbnNhdmVkRmlsZXMiLCJ3b3JrZGlyUGF0aCIsImlzTW9kaWZpZWRCeVBhdGgiLCJNYXAiLCJnZXRUZXh0RWRpdG9ycyIsImZvckVhY2giLCJzZXQiLCJpc01vZGlmaWVkIiwiZW5zdXJlTm9VbnNhdmVkRmlsZXMiLCJ1bnNhdmVkRmlsZXMiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyIsIm11bHRpRmlsZVBhdGNoIiwibGluZXMiLCJnZXRGaWxlUGF0Y2hlcyIsImRpc2NhcmRGaWxlUGF0Y2giLCJnZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyIsImFwcGx5UGF0Y2hUb1dvcmtkaXIiLCJnZXRGaWxlUGF0aHNGb3JMYXN0RGlzY2FyZCIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJsYXN0U25hcHNob3RzIiwiZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMiLCJzbmFwc2hvdCIsInJlc3VsdHMiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzIiwiR2l0RXJyb3IiLCJzdGRFcnIiLCJtYXRjaCIsImNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzIiwiY29uc29sZSIsImVycm9yIiwiY29uZmxpY3RzIiwiY29uZmxpY3QiLCJwcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyIsInByb21wdEFib3V0Q29uZmxpY3RzIiwiY29uZmxpY3RlZEZpbGVzIiwiY2hvaWNlIiwiZGV0YWlsZWRNZXNzYWdlIiwib3BlbkNvbmZsaWN0c0luTmV3RWRpdG9ycyIsInJlc3VsdFBhdGgiLCJjbGVhckRpc2NhcmRIaXN0b3J5IiwiZmlsZVBhdGhzU3RyIiwicHJvbWlzZXMiLCJkZWxldGVkIiwidGhlaXJzU2hhIiwiY29tbW9uQmFzZVNoYSIsImN1cnJlbnRTaGEiLCJyZW1vdmUiLCJjb3B5Iiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsInBvcERpc2NhcmRIaXN0b3J5IiwicmVzdWx0UGF0aHMiLCJlZGl0b3JQcm9taXNlcyIsImZ1bGxQYXRoIiwicmVhZFN0cmVhbSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJlbmNvZGluZyIsIkNvbmZsaWN0IiwiY291bnRGcm9tU3RyZWFtIiwidGhlbiIsImNvdW50IiwicmVwb3J0TWFya2VyQ291bnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZGVzZXJpYWxpemVycyIsImZ1bmMiLCJXb3JrZGlyQ29udGV4dFBvb2xQcm9wVHlwZSIsInN3aXRjaGJvYXJkIiwiaW5zdGFuY2VPZiIsIlN3aXRjaGJvYXJkIiwic3RyaW5nIiwiYm9vbCIsIm5hbWUiLCJmb2N1c1RvUmVzdG9yZSIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsInNob3VsZFJlc3RvcmVGb2N1cyIsIndhc1JlbmRlcmVkIiwiaXNSZW5kZXJlZCIsIndhc1Zpc2libGUiLCJpc1Zpc2libGUiLCJyZXZlYWwiLCJoaWRlIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiaGFkRm9jdXMiLCJoYXNGb2N1cyIsImdldENlbnRlciIsImFjdGl2YXRlIiwic2VhcmNoQWxsUGFuZXMiLCJyZXN0b3JlRm9jdXMiLCJnZXRJdGVtIiwicGFuZUZvclVSSSIsInBhbmVJdGVtIiwiaXRlbUZvclVSSSIsImdldFJlYWxJdGVtIiwiZ2V0RE9NRWxlbWVudCIsImdldEVsZW1lbnQiLCJnZXRQYW5lQ29udGFpbmVycyIsInNvbWUiLCJn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TUQ7O0FBRUQ0USxFQUFBQSxRQUFRLEdBQUc7QUFDVCxVQUFNaUIsSUFBSSxHQUFHLEtBQUtQLGFBQUwsRUFBYjtBQUNBLFdBQU9PLElBQUksSUFBSUEsSUFBSSxDQUFDQyxRQUFMLENBQWM5QixRQUFRLENBQUNDLGFBQXZCLENBQWY7QUFDRDs7QUFsSWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnLi4vYXRvbS9zdGF0dXMtYmFyJztcbmltcG9ydCBQYW5lSXRlbSBmcm9tICcuLi9hdG9tL3BhbmUtaXRlbSc7XG5pbXBvcnQge29wZW5Jc3N1ZWlzaEl0ZW19IGZyb20gJy4uL3ZpZXdzL29wZW4taXNzdWVpc2gtZGlhbG9nJztcbmltcG9ydCB7b3BlbkNvbW1pdERldGFpbEl0ZW19IGZyb20gJy4uL3ZpZXdzL29wZW4tY29tbWl0LWRpYWxvZyc7XG5pbXBvcnQge2NyZWF0ZVJlcG9zaXRvcnksIHB1Ymxpc2hSZXBvc2l0b3J5fSBmcm9tICcuLi92aWV3cy9jcmVhdGUtZGlhbG9nJztcbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBDaGFuZ2VkRmlsZUl0ZW0gZnJvbSAnLi4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nO1xuaW1wb3J0IElzc3VlaXNoRGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9pc3N1ZWlzaC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgQ29tbWl0RGV0YWlsSXRlbSBmcm9tICcuLi9pdGVtcy9jb21taXQtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IENvbW1pdFByZXZpZXdJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1wcmV2aWV3LWl0ZW0nO1xuaW1wb3J0IEdpdFRhYkl0ZW0gZnJvbSAnLi4vaXRlbXMvZ2l0LXRhYi1pdGVtJztcbmltcG9ydCBHaXRIdWJUYWJJdGVtIGZyb20gJy4uL2l0ZW1zL2dpdGh1Yi10YWItaXRlbSc7XG5pbXBvcnQgUmV2aWV3c0l0ZW0gZnJvbSAnLi4vaXRlbXMvcmV2aWV3cy1pdGVtJztcbmltcG9ydCBDb21tZW50RGVjb3JhdGlvbnNDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9jb21tZW50LWRlY29yYXRpb25zLWNvbnRhaW5lcic7XG5pbXBvcnQgRGlhbG9nc0NvbnRyb2xsZXIsIHtkaWFsb2dSZXF1ZXN0c30gZnJvbSAnLi9kaWFsb2dzLWNvbnRyb2xsZXInO1xuaW1wb3J0IFN0YXR1c0JhclRpbGVDb250cm9sbGVyIGZyb20gJy4vc3RhdHVzLWJhci10aWxlLWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlcG9zaXRvcnlDb25mbGljdENvbnRyb2xsZXIgZnJvbSAnLi9yZXBvc2l0b3J5LWNvbmZsaWN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IEdpdENhY2hlVmlldyBmcm9tICcuLi92aWV3cy9naXQtY2FjaGUtdmlldyc7XG5pbXBvcnQgR2l0VGltaW5nc1ZpZXcgZnJvbSAnLi4vdmlld3MvZ2l0LXRpbWluZ3Mtdmlldyc7XG5pbXBvcnQgQ29uZmxpY3QgZnJvbSAnLi4vbW9kZWxzL2NvbmZsaWN0cy9jb25mbGljdCc7XG5pbXBvcnQge2dldEVuZHBvaW50fSBmcm9tICcuLi9tb2RlbHMvZW5kcG9pbnQnO1xuaW1wb3J0IFN3aXRjaGJvYXJkIGZyb20gJy4uL3N3aXRjaGJvYXJkJztcbmltcG9ydCB7V29ya2RpckNvbnRleHRQb29sUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zLCBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMsIGF1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7R2l0RXJyb3J9IGZyb20gJy4uL2dpdC1zaGVsbC1vdXQtc3RyYXRlZ3knO1xuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyLCBhZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb290Q29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gQXRvbSBlbnZpb3JubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgZGVzZXJpYWxpemVyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBncmFtbWFyczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHByb2plY3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRXaW5kb3c6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIE1vZGVsc1xuICAgIGxvZ2luTW9kZWw6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyQ29udGV4dFBvb2w6IFdvcmtkaXJDb250ZXh0UG9vbFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHN0YXR1c0JhcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzd2l0Y2hib2FyZDogUHJvcFR5cGVzLmluc3RhbmNlT2YoU3dpdGNoYm9hcmQpLFxuICAgIHBpcGVsaW5lTWFuYWdlcjogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIGN1cnJlbnRXb3JrRGlyOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLy8gR2l0IGFjdGlvbnNcbiAgICBpbml0aWFsaXplOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNsb25lOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ29udHJvbFxuICAgIGNvbnRleHRMb2NrZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb250ZXh0TG9jazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdGFydE9wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIHN0YXJ0UmV2ZWFsZWQ6IFByb3BUeXBlcy5ib29sLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzd2l0Y2hib2FyZDogbmV3IFN3aXRjaGJvYXJkKCksXG4gICAgc3RhcnRPcGVuOiBmYWxzZSxcbiAgICBzdGFydFJldmVhbGVkOiBmYWxzZSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgICdpbnN0YWxsUmVhY3REZXZUb29scycsICdjbGVhckdpdGh1YlRva2VuJyxcbiAgICAgICdzaG93V2F0ZXJmYWxsRGlhZ25vc3RpY3MnLCAnc2hvd0NhY2hlRGlhZ25vc3RpY3MnLFxuICAgICAgJ2Rlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMnLCAnZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zJyxcbiAgICAgICdxdWlldGx5U2VsZWN0SXRlbScsICd2aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUnLFxuICAgICAgJ3ZpZXdTdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGUnLCAnb3BlbkZpbGVzJywgJ2dldFVuc2F2ZWRGaWxlcycsICdlbnN1cmVOb1Vuc2F2ZWRGaWxlcycsXG4gICAgICAnZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMnLCAnZGlzY2FyZExpbmVzJywgJ3VuZG9MYXN0RGlzY2FyZCcsICdyZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzJyxcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGRpYWxvZ1JlcXVlc3Q6IGRpYWxvZ1JlcXVlc3RzLm51bGwsXG4gICAgfTtcblxuICAgIHRoaXMuZ2l0VGFiVHJhY2tlciA9IG5ldyBUYWJUcmFja2VyKCdnaXQnLCB7XG4gICAgICB1cmk6IEdpdFRhYkl0ZW0uYnVpbGRVUkkoKSxcbiAgICAgIGdldFdvcmtzcGFjZTogKCkgPT4gdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLmdpdGh1YlRhYlRyYWNrZXIgPSBuZXcgVGFiVHJhY2tlcignZ2l0aHViJywge1xuICAgICAgdXJpOiBHaXRIdWJUYWJJdGVtLmJ1aWxkVVJJKCksXG4gICAgICBnZXRXb3Jrc3BhY2U6ICgpID0+IHRoaXMucHJvcHMud29ya3NwYWNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucHJvcHMucmVwb3NpdG9yeS5vblB1bGxFcnJvcih0aGlzLmdpdFRhYlRyYWNrZXIuZW5zdXJlVmlzaWJsZSksXG4gICAgKTtcblxuICAgIHRoaXMucHJvcHMuY29tbWFuZHMub25EaWREaXNwYXRjaChldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQudHlwZSAmJiBldmVudC50eXBlLnN0YXJ0c1dpdGgoJ2dpdGh1YjonKVxuICAgICAgICAmJiBldmVudC5kZXRhaWwgJiYgZXZlbnQuZGV0YWlsWzBdICYmIGV2ZW50LmRldGFpbFswXS5jb250ZXh0Q29tbWFuZCkge1xuICAgICAgICBhZGRFdmVudCgnY29udGV4dC1tZW51LWFjdGlvbicsIHtcbiAgICAgICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgICAgICBjb21tYW5kOiBldmVudC50eXBlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMub3BlblRhYnMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJTdGF0dXNCYXJUaWxlKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclBhbmVJdGVtcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJEaWFsb2dzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbmZsaWN0UmVzb2x2ZXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWVudERlY29yYXRpb25zKCl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICBjb25zdCBkZXZNb2RlID0gZ2xvYmFsLmF0b20gJiYgZ2xvYmFsLmF0b20uaW5EZXZNb2RlKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAge2Rldk1vZGUgJiYgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjppbnN0YWxsLXJlYWN0LWRldi10b29sc1wiIGNhbGxiYWNrPXt0aGlzLmluc3RhbGxSZWFjdERldlRvb2xzfSAvPn1cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1jb21taXQtcHJldmlld1wiIGNhbGxiYWNrPXt0aGlzLnRvZ2dsZUNvbW1pdFByZXZpZXdJdGVtfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6bG9nb3V0XCIgY2FsbGJhY2s9e3RoaXMuY2xlYXJHaXRodWJUb2tlbn0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnNob3ctd2F0ZXJmYWxsLWRpYWdub3N0aWNzXCIgY2FsbGJhY2s9e3RoaXMuc2hvd1dhdGVyZmFsbERpYWdub3N0aWNzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c2hvdy1jYWNoZS1kaWFnbm9zdGljc1wiIGNhbGxiYWNrPXt0aGlzLnNob3dDYWNoZURpYWdub3N0aWNzfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6dG9nZ2xlLWdpdC10YWJcIiBjYWxsYmFjaz17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXQtdGFiLWZvY3VzXCIgY2FsbGJhY2s9e3RoaXMuZ2l0VGFiVHJhY2tlci50b2dnbGVGb2N1c30gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnRvZ2dsZS1naXRodWItdGFiXCIgY2FsbGJhY2s9e3RoaXMuZ2l0aHViVGFiVHJhY2tlci50b2dnbGV9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjp0b2dnbGUtZ2l0aHViLXRhYi1mb2N1c1wiIGNhbGxiYWNrPXt0aGlzLmdpdGh1YlRhYlRyYWNrZXIudG9nZ2xlRm9jdXN9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjppbml0aWFsaXplXCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkluaXRpYWxpemVEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmNsb25lXCIgY2FsbGJhY2s9eygpID0+IHRoaXMub3BlbkNsb25lRGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpvcGVuLWlzc3VlLW9yLXB1bGwtcmVxdWVzdFwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5Jc3N1ZWlzaERpYWxvZygpfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6b3Blbi1jb21taXRcIiBjYWxsYmFjaz17KCkgPT4gdGhpcy5vcGVuQ29tbWl0RGlhbG9nKCl9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpjcmVhdGUtcmVwb3NpdG9yeVwiIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5DcmVhdGVEaWFsb2coKX0gLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1Yjp2aWV3LXVuc3RhZ2VkLWNoYW5nZXMtZm9yLWN1cnJlbnQtZmlsZVwiXG4gICAgICAgICAgICBjYWxsYmFjaz17dGhpcy52aWV3VW5zdGFnZWRDaGFuZ2VzRm9yQ3VycmVudEZpbGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1Yjp2aWV3LXN0YWdlZC1jaGFuZ2VzLWZvci1jdXJyZW50LWZpbGVcIlxuICAgICAgICAgICAgY2FsbGJhY2s9e3RoaXMudmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxDb21tYW5kXG4gICAgICAgICAgICBjb21tYW5kPVwiZ2l0aHViOmNsb3NlLWFsbC1kaWZmLXZpZXdzXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLmRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q29tbWFuZFxuICAgICAgICAgICAgY29tbWFuZD1cImdpdGh1YjpjbG9zZS1lbXB0eS1kaWZmLXZpZXdzXCJcbiAgICAgICAgICAgIGNhbGxiYWNrPXt0aGlzLmRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9PlxuICAgICAgICAgIHtkYXRhID0+IHtcbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5pc1B1Ymxpc2hhYmxlIHx8ICFkYXRhLnJlbW90ZXMuZmlsdGVyKHIgPT4gci5pc0dpdGh1YlJlcG8oKSkuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cImF0b20td29ya3NwYWNlXCI+XG4gICAgICAgICAgICAgICAgPENvbW1hbmRcbiAgICAgICAgICAgICAgICAgIGNvbW1hbmQ9XCJnaXRodWI6cHVibGlzaC1yZXBvc2l0b3J5XCJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrPXsoKSA9PiB0aGlzLm9wZW5QdWJsaXNoRGlhbG9nKHRoaXMucHJvcHMucmVwb3NpdG9yeSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJTdGF0dXNCYXJUaWxlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3RhdHVzQmFyXG4gICAgICAgIHN0YXR1c0Jhcj17dGhpcy5wcm9wcy5zdGF0dXNCYXJ9XG4gICAgICAgIG9uQ29uc3VtZVN0YXR1c0Jhcj17c2IgPT4gdGhpcy5vbkNvbnN1bWVTdGF0dXNCYXIoc2IpfVxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhdHVzQmFyVGlsZUNvbnRyb2xsZXJcIj5cbiAgICAgICAgPFN0YXR1c0JhclRpbGVDb250cm9sbGVyXG4gICAgICAgICAgcGlwZWxpbmVNYW5hZ2VyPXt0aGlzLnByb3BzLnBpcGVsaW5lTWFuYWdlcn1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyPXt0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXJ9XG4gICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgIHRvZ2dsZUdpdFRhYj17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZX1cbiAgICAgICAgICB0b2dnbGVHaXRodWJUYWI9e3RoaXMuZ2l0aHViVGFiVHJhY2tlci50b2dnbGV9XG4gICAgICAgIC8+XG4gICAgICA8L1N0YXR1c0Jhcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGlhbG9ncygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERpYWxvZ3NDb250cm9sbGVyXG4gICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgcmVxdWVzdD17dGhpcy5zdGF0ZS5kaWFsb2dSZXF1ZXN0fVxuXG4gICAgICAgIGN1cnJlbnRXaW5kb3c9e3RoaXMucHJvcHMuY3VycmVudFdpbmRvd31cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tZW50RGVjb3JhdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1lbnREZWNvcmF0aW9uc0NvbnRhaW5lclxuICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgbG9jYWxSZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG4gICAgICAgIGxvZ2luTW9kZWw9e3RoaXMucHJvcHMubG9naW5Nb2RlbH1cbiAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29uZmxpY3RSZXNvbHZlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucmVwb3NpdG9yeSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxSZXBvc2l0b3J5Q29uZmxpY3RDb250cm9sbGVyXG4gICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgcmVzb2x1dGlvblByb2dyZXNzPXt0aGlzLnByb3BzLnJlc29sdXRpb25Qcm9ncmVzc31cbiAgICAgICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclBhbmVJdGVtcygpIHtcbiAgICBjb25zdCB7d29ya2RpckNvbnRleHRQb29sfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZ2V0Q3VycmVudFdvcmtEaXJzID0gd29ya2RpckNvbnRleHRQb29sLmdldEN1cnJlbnRXb3JrRGlycy5iaW5kKHdvcmtkaXJDb250ZXh0UG9vbCk7XG4gICAgY29uc3Qgb25EaWRDaGFuZ2VXb3JrRGlycyA9IHdvcmtkaXJDb250ZXh0UG9vbC5vbkRpZENoYW5nZVBvb2xDb250ZXh0cy5iaW5kKHdvcmtkaXJDb250ZXh0UG9vbCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0dpdFRhYkl0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItR2l0LXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gKFxuICAgICAgICAgICAgPEdpdFRhYkl0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI9e3RoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlcn1cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGdyYW1tYXJzPXt0aGlzLnByb3BzLmdyYW1tYXJzfVxuICAgICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnByb3BzLnByb2plY3R9XG4gICAgICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeT17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIG9wZW5Jbml0aWFsaXplRGlhbG9nPXt0aGlzLm9wZW5Jbml0aWFsaXplRGlhbG9nfVxuICAgICAgICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICAgICAgICBlbnN1cmVHaXRUYWI9e3RoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVWaXNpYmxlfVxuICAgICAgICAgICAgICBvcGVuRmlsZXM9e3RoaXMub3BlbkZpbGVzfVxuICAgICAgICAgICAgICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocz17dGhpcy5kaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRoc31cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICAgICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcz17dGhpcy5yZWZyZXNoUmVzb2x1dGlvblByb2dyZXNzfVxuICAgICAgICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXtnZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e29uRGlkQ2hhbmdlV29ya0RpcnN9XG4gICAgICAgICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtHaXRIdWJUYWJJdGVtLnVyaVBhdHRlcm59XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdEh1Yi1yb290XCI+XG4gICAgICAgICAgeyh7aXRlbUhvbGRlcn0pID0+IChcbiAgICAgICAgICAgIDxHaXRIdWJUYWJJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG4gICAgICAgICAgICAgIHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICAgICAgbG9naW5Nb2RlbD17dGhpcy5wcm9wcy5sb2dpbk1vZGVsfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjdXJyZW50V29ya0Rpcj17dGhpcy5wcm9wcy5jdXJyZW50V29ya0Rpcn1cbiAgICAgICAgICAgICAgZ2V0Q3VycmVudFdvcmtEaXJzPXtnZXRDdXJyZW50V29ya0RpcnN9XG4gICAgICAgICAgICAgIG9uRGlkQ2hhbmdlV29ya0RpcnM9e29uRGlkQ2hhbmdlV29ya0RpcnN9XG4gICAgICAgICAgICAgIGNvbnRleHRMb2NrZWQ9e3RoaXMucHJvcHMuY29udGV4dExvY2tlZH1cbiAgICAgICAgICAgICAgY2hhbmdlV29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICBzZXRDb250ZXh0TG9jaz17dGhpcy5wcm9wcy5zZXRDb250ZXh0TG9ja31cbiAgICAgICAgICAgICAgb3BlbkNyZWF0ZURpYWxvZz17dGhpcy5vcGVuQ3JlYXRlRGlhbG9nfVxuICAgICAgICAgICAgICBvcGVuUHVibGlzaERpYWxvZz17dGhpcy5vcGVuUHVibGlzaERpYWxvZ31cbiAgICAgICAgICAgICAgb3BlbkNsb25lRGlhbG9nPXt0aGlzLm9wZW5DbG9uZURpYWxvZ31cbiAgICAgICAgICAgICAgb3BlbkdpdFRhYj17dGhpcy5naXRUYWJUcmFja2VyLnRvZ2dsZUZvY3VzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0NoYW5nZWRGaWxlSXRlbS51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8Q2hhbmdlZEZpbGVJdGVtXG4gICAgICAgICAgICAgIHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9XG5cbiAgICAgICAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLnByb3BzLndvcmtkaXJDb250ZXh0UG9vbH1cbiAgICAgICAgICAgICAgcmVsUGF0aD17cGF0aC5qb2luKC4uLnBhcmFtcy5yZWxQYXRoKX1cbiAgICAgICAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17cGFyYW1zLndvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgICAgICAgIHN0YWdpbmdTdGF0dXM9e3BhcmFtcy5zdGFnaW5nU3RhdHVzfVxuXG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuXG4gICAgICAgICAgICAgIGRpc2NhcmRMaW5lcz17dGhpcy5kaXNjYXJkTGluZXN9XG4gICAgICAgICAgICAgIHVuZG9MYXN0RGlzY2FyZD17dGhpcy51bmRvTGFzdERpc2NhcmR9XG4gICAgICAgICAgICAgIHN1cmZhY2VGaWxlQXRQYXRoPXt0aGlzLnN1cmZhY2VGcm9tRmlsZUF0UGF0aH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9QYW5lSXRlbT5cbiAgICAgICAgPFBhbmVJdGVtXG4gICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICB1cmlQYXR0ZXJuPXtDb21taXRQcmV2aWV3SXRlbS51cmlQYXR0ZXJufVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXRQcmV2aWV3LXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8Q29tbWl0UHJldmlld0l0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICB3b3JraW5nRGlyZWN0b3J5PXtwYXJhbXMud29ya2luZ0RpcmVjdG9yeX1cbiAgICAgICAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc31cbiAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG5cbiAgICAgICAgICAgICAgZGlzY2FyZExpbmVzPXt0aGlzLmRpc2NhcmRMaW5lc31cbiAgICAgICAgICAgICAgdW5kb0xhc3REaXNjYXJkPXt0aGlzLnVuZG9MYXN0RGlzY2FyZH1cbiAgICAgICAgICAgICAgc3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbj17dGhpcy5zdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9ufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW1cbiAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgIHVyaVBhdHRlcm49e0NvbW1pdERldGFpbEl0ZW0udXJpUGF0dGVybn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsLXJvb3RcIj5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8Q29tbWl0RGV0YWlsSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXJDb250ZXh0UG9vbD17dGhpcy5wcm9wcy53b3JrZGlyQ29udGV4dFBvb2x9XG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICBzaGE9e3BhcmFtcy5zaGF9XG4gICAgICAgICAgICAgIHN1cmZhY2VDb21taXQ9e3RoaXMuc3VyZmFjZVRvUmVjZW50Q29tbWl0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj17SXNzdWVpc2hEZXRhaWxJdGVtLnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXIsIHBhcmFtcywgZGVzZXJpYWxpemVkfSkgPT4gKFxuICAgICAgICAgICAgPElzc3VlaXNoRGV0YWlsSXRlbVxuICAgICAgICAgICAgICByZWY9e2l0ZW1Ib2xkZXIuc2V0dGVyfVxuXG4gICAgICAgICAgICAgIGhvc3Q9e3BhcmFtcy5ob3N0fVxuICAgICAgICAgICAgICBvd25lcj17cGFyYW1zLm93bmVyfVxuICAgICAgICAgICAgICByZXBvPXtwYXJhbXMucmVwb31cbiAgICAgICAgICAgICAgaXNzdWVpc2hOdW1iZXI9e3BhcnNlSW50KHBhcmFtcy5pc3N1ZWlzaE51bWJlciwgMTApfVxuXG4gICAgICAgICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk9e3BhcmFtcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIGluaXRTZWxlY3RlZFRhYj17ZGVzZXJpYWxpemVkLmluaXRTZWxlY3RlZFRhYn1cblxuICAgICAgICAgICAgICB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAga2V5bWFwcz17dGhpcy5wcm9wcy5rZXltYXBzfVxuICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cblxuICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtSZXZpZXdzSXRlbS51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyLCBwYXJhbXN9KSA9PiAoXG4gICAgICAgICAgICA8UmV2aWV3c0l0ZW1cbiAgICAgICAgICAgICAgcmVmPXtpdGVtSG9sZGVyLnNldHRlcn1cblxuICAgICAgICAgICAgICBob3N0PXtwYXJhbXMuaG9zdH1cbiAgICAgICAgICAgICAgb3duZXI9e3BhcmFtcy5vd25lcn1cbiAgICAgICAgICAgICAgcmVwbz17cGFyYW1zLnJlcG99XG4gICAgICAgICAgICAgIG51bWJlcj17cGFyc2VJbnQocGFyYW1zLm51bWJlciwgMTApfVxuXG4gICAgICAgICAgICAgIHdvcmtkaXI9e3BhcmFtcy53b3JrZGlyfVxuICAgICAgICAgICAgICB3b3JrZGlyQ29udGV4dFBvb2w9e3RoaXMucHJvcHMud29ya2RpckNvbnRleHRQb29sfVxuICAgICAgICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLnByb3BzLmxvZ2luTW9kZWx9XG4gICAgICAgICAgICAgIHdvcmtzcGFjZT17dGhpcy5wcm9wcy53b3Jrc3BhY2V9XG4gICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICAgIDxQYW5lSXRlbSB3b3Jrc3BhY2U9e3RoaXMucHJvcHMud29ya3NwYWNlfSB1cmlQYXR0ZXJuPXtHaXRUaW1pbmdzVmlldy51cmlQYXR0ZXJufT5cbiAgICAgICAgICB7KHtpdGVtSG9sZGVyfSkgPT4gPEdpdFRpbWluZ3NWaWV3IHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9IC8+fVxuICAgICAgICA8L1BhbmVJdGVtPlxuICAgICAgICA8UGFuZUl0ZW0gd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX0gdXJpUGF0dGVybj17R2l0Q2FjaGVWaWV3LnVyaVBhdHRlcm59PlxuICAgICAgICAgIHsoe2l0ZW1Ib2xkZXJ9KSA9PiA8R2l0Q2FjaGVWaWV3IHJlZj17aXRlbUhvbGRlci5zZXR0ZXJ9IHJlcG9zaXRvcnk9e3RoaXMucHJvcHMucmVwb3NpdG9yeX0gLz59XG4gICAgICAgIDwvUGFuZUl0ZW0+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICBmZXRjaERhdGEgPSByZXBvc2l0b3J5ID0+IHl1YmlraXJpKHtcbiAgICBpc1B1Ymxpc2hhYmxlOiByZXBvc2l0b3J5LmlzUHVibGlzaGFibGUoKSxcbiAgICByZW1vdGVzOiByZXBvc2l0b3J5LmdldFJlbW90ZXMoKSxcbiAgfSk7XG5cbiAgYXN5bmMgb3BlblRhYnMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RhcnRPcGVuKSB7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHRoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVSZW5kZXJlZChmYWxzZSksXG4gICAgICAgIHRoaXMuZ2l0aHViVGFiVHJhY2tlci5lbnN1cmVSZW5kZXJlZChmYWxzZSksXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGFydFJldmVhbGVkKSB7XG4gICAgICBjb25zdCBkb2NrcyA9IG5ldyBTZXQoXG4gICAgICAgIFtHaXRUYWJJdGVtLmJ1aWxkVVJJKCksIEdpdEh1YlRhYkl0ZW0uYnVpbGRVUkkoKV1cbiAgICAgICAgICAubWFwKHVyaSA9PiB0aGlzLnByb3BzLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9yVVJJKHVyaSkpXG4gICAgICAgICAgLmZpbHRlcihjb250YWluZXIgPT4gY29udGFpbmVyICYmICh0eXBlb2YgY29udGFpbmVyLnNob3cpID09PSAnZnVuY3Rpb24nKSxcbiAgICAgICk7XG5cbiAgICAgIGZvciAoY29uc3QgZG9jayBvZiBkb2Nrcykge1xuICAgICAgICBkb2NrLnNob3coKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBpbnN0YWxsUmVhY3REZXZUb29scygpIHtcbiAgICAvLyBQcmV2ZW50IGVsZWN0cm9uLWxpbmsgZnJvbSBhdHRlbXB0aW5nIHRvIGRlc2NlbmQgaW50byBlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXIsIHdoaWNoIGlzIG5vdCBhdmFpbGFibGVcbiAgICAvLyB3aGVuIHdlJ3JlIGJ1bmRsZWQgaW4gQXRvbS5cbiAgICBjb25zdCBkZXZUb29sc05hbWUgPSAnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJztcbiAgICBjb25zdCBkZXZUb29scyA9IHJlcXVpcmUoZGV2VG9vbHNOYW1lKTtcblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMuaW5zdGFsbEV4dGVuc2lvbihkZXZUb29scy5SRUFDVF9ERVZFTE9QRVJfVE9PTFMuaWQpLFxuICAgICAgLy8gcmVsYXkgZGV2ZWxvcGVyIHRvb2xzIGV4dGVuc2lvbiBpZFxuICAgICAgdGhpcy5pbnN0YWxsRXh0ZW5zaW9uKCduY2Vkb2JwZ25ta2hjbW5ua2NpbW5vYnBmZXBpZGFkbCcpLFxuICAgIF0pO1xuXG4gICAgdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZFN1Y2Nlc3MoJ/CfjIggUmVsb2FkIHlvdXIgd2luZG93IHRvIHN0YXJ0IHVzaW5nIHRoZSBSZWFjdC9SZWxheSBkZXYgdG9vbHMhJyk7XG4gIH1cblxuICBhc3luYyBpbnN0YWxsRXh0ZW5zaW9uKGlkKSB7XG4gICAgY29uc3QgZGV2VG9vbHNOYW1lID0gJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcic7XG4gICAgY29uc3QgZGV2VG9vbHMgPSByZXF1aXJlKGRldlRvb2xzTmFtZSk7XG5cbiAgICBjb25zdCBjcm9zc1VuemlwTmFtZSA9ICdjcm9zcy11bnppcCc7XG4gICAgY29uc3QgdW56aXAgPSByZXF1aXJlKGNyb3NzVW56aXBOYW1lKTtcblxuICAgIGNvbnN0IHVybCA9XG4gICAgICAnaHR0cHM6Ly9jbGllbnRzMi5nb29nbGUuY29tL3NlcnZpY2UvdXBkYXRlMi9jcng/JyArXG4gICAgICBgcmVzcG9uc2U9cmVkaXJlY3QmeD1pZCUzRCR7aWR9JTI2dWMmcHJvZHZlcnNpb249MzJgO1xuICAgIGNvbnN0IGV4dGVuc2lvbkZvbGRlciA9IHBhdGgucmVzb2x2ZShyZW1vdGUuYXBwLmdldFBhdGgoJ3VzZXJEYXRhJyksIGBleHRlbnNpb25zLyR7aWR9YCk7XG4gICAgY29uc3QgZXh0ZW5zaW9uRmlsZSA9IGAke2V4dGVuc2lvbkZvbGRlcn0uY3J4YDtcbiAgICBhd2FpdCBmcy5lbnN1cmVEaXIocGF0aC5kaXJuYW1lKGV4dGVuc2lvbkZpbGUpKTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge21ldGhvZDogJ0dFVCd9KTtcbiAgICBjb25zdCBib2R5ID0gQnVmZmVyLmZyb20oYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSk7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKGV4dGVuc2lvbkZpbGUsIGJvZHkpO1xuXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdW56aXAoZXh0ZW5zaW9uRmlsZSwgZXh0ZW5zaW9uRm9sZGVyLCBhc3luYyBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyICYmICFhd2FpdCBmcy5leGlzdHMocGF0aC5qb2luKGV4dGVuc2lvbkZvbGRlciwgJ21hbmlmZXN0Lmpzb24nKSkpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgYXdhaXQgZnMuZW5zdXJlRGlyKGV4dGVuc2lvbkZvbGRlciwgMG83NTUpO1xuICAgIGF3YWl0IGRldlRvb2xzLmRlZmF1bHQoaWQpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm9uUHVsbEVycm9yKCgpID0+IHRoaXMuZ2l0VGFiVHJhY2tlci5lbnN1cmVWaXNpYmxlKCkpLFxuICAgICk7XG4gIH1cblxuICBvbkNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgaWYgKHN0YXR1c0Jhci5kaXNhYmxlR2l0SW5mb1RpbGUpIHtcbiAgICAgIHN0YXR1c0Jhci5kaXNhYmxlR2l0SW5mb1RpbGUoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckdpdGh1YlRva2VuKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmxvZ2luTW9kZWwucmVtb3ZlVG9rZW4oJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nKTtcbiAgfVxuXG4gIGNsb3NlRGlhbG9nID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0OiBkaWFsb2dSZXF1ZXN0cy5udWxsfSwgcmVzb2x2ZSkpO1xuXG4gIG9wZW5Jbml0aWFsaXplRGlhbG9nID0gYXN5bmMgZGlyUGF0aCA9PiB7XG4gICAgaWYgKCFkaXJQYXRoKSB7XG4gICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSB0aGlzLnByb3BzLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICBpZiAoYWN0aXZlRWRpdG9yKSB7XG4gICAgICAgIGNvbnN0IFtwcm9qZWN0UGF0aF0gPSB0aGlzLnByb3BzLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYWN0aXZlRWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICAgIGRpclBhdGggPSBwcm9qZWN0UGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZGlyUGF0aCkge1xuICAgICAgY29uc3QgZGlyZWN0b3JpZXMgPSB0aGlzLnByb3BzLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKTtcbiAgICAgIGNvbnN0IHdpdGhSZXBvc2l0b3JpZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgZGlyZWN0b3JpZXMubWFwKGFzeW5jIGQgPT4gW2QsIGF3YWl0IHRoaXMucHJvcHMucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGQpXSksXG4gICAgICApO1xuICAgICAgY29uc3QgZmlyc3RVbmluaXRpYWxpemVkID0gd2l0aFJlcG9zaXRvcmllcy5maW5kKChbZCwgcl0pID0+ICFyKTtcbiAgICAgIGlmIChmaXJzdFVuaW5pdGlhbGl6ZWQgJiYgZmlyc3RVbmluaXRpYWxpemVkWzBdKSB7XG4gICAgICAgIGRpclBhdGggPSBmaXJzdFVuaW5pdGlhbGl6ZWRbMF0uZ2V0UGF0aCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZGlyUGF0aCkge1xuICAgICAgZGlyUGF0aCA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnY29yZS5wcm9qZWN0SG9tZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5pbml0KHtkaXJQYXRofSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIGNob3NlblBhdGggPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5pbml0aWFsaXplKGNob3NlblBhdGgpO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNsb25lRGlhbG9nID0gb3B0cyA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNsb25lKG9wdHMpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyAodXJsLCBjaG9zZW5QYXRoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLmNsb25lKHVybCwgY2hvc2VuUGF0aCk7XG4gICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgfSk7XG4gICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbCh0aGlzLmNsb3NlRGlhbG9nKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe2RpYWxvZ1JlcXVlc3R9LCByZXNvbHZlKSk7XG4gIH1cblxuICBvcGVuQ3JlZGVudGlhbHNEaWFsb2cgPSBxdWVyeSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5jcmVkZW50aWFsKHF1ZXJ5KTtcbiAgICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZXN1bHQgPT4ge1xuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICAgIH0pO1xuICAgICAgZGlhbG9nUmVxdWVzdC5vbkNhbmNlbChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgICBhd2FpdCB0aGlzLmNsb3NlRGlhbG9nKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0pO1xuICAgIH0pO1xuICB9XG5cbiAgb3Blbklzc3VlaXNoRGlhbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IGRpYWxvZ1JlcXVlc3QgPSBkaWFsb2dSZXF1ZXN0cy5pc3N1ZWlzaCgpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyB1cmwgPT4ge1xuICAgICAgYXdhaXQgb3Blbklzc3VlaXNoSXRlbSh1cmwsIHtcbiAgICAgICAgd29ya3NwYWNlOiB0aGlzLnByb3BzLndvcmtzcGFjZSxcbiAgICAgICAgd29ya2RpcjogdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIG9wZW5Db21taXREaWFsb2cgPSAoKSA9PiB7XG4gICAgY29uc3QgZGlhbG9nUmVxdWVzdCA9IGRpYWxvZ1JlcXVlc3RzLmNvbW1pdCgpO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZWYgPT4ge1xuICAgICAgYXdhaXQgb3BlbkNvbW1pdERldGFpbEl0ZW0ocmVmLCB7XG4gICAgICAgIHdvcmtzcGFjZTogdGhpcy5wcm9wcy53b3Jrc3BhY2UsXG4gICAgICAgIHJlcG9zaXRvcnk6IHRoaXMucHJvcHMucmVwb3NpdG9yeSxcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlbkNyZWF0ZURpYWxvZyA9ICgpID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMuY3JlYXRlKCk7XG4gICAgZGlhbG9nUmVxdWVzdC5vblByb2dyZXNzaW5nQWNjZXB0KGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICBjb25zdCBkb3Rjb20gPSBnZXRFbmRwb2ludCgnZ2l0aHViLmNvbScpO1xuICAgICAgY29uc3QgcmVsYXlFbnZpcm9ubWVudCA9IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlci5nZXRFbnZpcm9ubWVudEZvckhvc3QoZG90Y29tKTtcblxuICAgICAgYXdhaXQgY3JlYXRlUmVwb3NpdG9yeShyZXN1bHQsIHtjbG9uZTogdGhpcy5wcm9wcy5jbG9uZSwgcmVsYXlFbnZpcm9ubWVudH0pO1xuICAgICAgYXdhaXQgdGhpcy5jbG9zZURpYWxvZygpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25DYW5jZWwodGhpcy5jbG9zZURpYWxvZyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtkaWFsb2dSZXF1ZXN0fSwgcmVzb2x2ZSkpO1xuICB9XG5cbiAgb3BlblB1Ymxpc2hEaWFsb2cgPSByZXBvc2l0b3J5ID0+IHtcbiAgICBjb25zdCBkaWFsb2dSZXF1ZXN0ID0gZGlhbG9nUmVxdWVzdHMucHVibGlzaCh7bG9jYWxEaXI6IHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKX0pO1xuICAgIGRpYWxvZ1JlcXVlc3Qub25Qcm9ncmVzc2luZ0FjY2VwdChhc3luYyByZXN1bHQgPT4ge1xuICAgICAgY29uc3QgZG90Y29tID0gZ2V0RW5kcG9pbnQoJ2dpdGh1Yi5jb20nKTtcbiAgICAgIGNvbnN0IHJlbGF5RW52aXJvbm1lbnQgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RW52aXJvbm1lbnRGb3JIb3N0KGRvdGNvbSk7XG5cbiAgICAgIGF3YWl0IHB1Ymxpc2hSZXBvc2l0b3J5KHJlc3VsdCwge3JlcG9zaXRvcnksIHJlbGF5RW52aXJvbm1lbnR9KTtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VEaWFsb2coKTtcbiAgICB9KTtcbiAgICBkaWFsb2dSZXF1ZXN0Lm9uQ2FuY2VsKHRoaXMuY2xvc2VEaWFsb2cpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gdGhpcy5zZXRTdGF0ZSh7ZGlhbG9nUmVxdWVzdH0sIHJlc29sdmUpKTtcbiAgfVxuXG4gIHRvZ2dsZUNvbW1pdFByZXZpZXdJdGVtID0gKCkgPT4ge1xuICAgIGNvbnN0IHdvcmtkaXIgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2UudG9nZ2xlKENvbW1pdFByZXZpZXdJdGVtLmJ1aWxkVVJJKHdvcmtkaXIpKTtcbiAgfVxuXG4gIHNob3dXYXRlcmZhbGxEaWFnbm9zdGljcygpIHtcbiAgICB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKEdpdFRpbWluZ3NWaWV3LmJ1aWxkVVJJKCkpO1xuICB9XG5cbiAgc2hvd0NhY2hlRGlhZ25vc3RpY3MoKSB7XG4gICAgdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihHaXRDYWNoZVZpZXcuYnVpbGRVUkkoKSk7XG4gIH1cblxuICBzdXJmYWNlRnJvbUZpbGVBdFBhdGggPSAoZmlsZVBhdGgsIHN0YWdpbmdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIuZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gIH1cblxuICBzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uID0gKCkgPT4ge1xuICAgIGNvbnN0IGdpdFRhYiA9IHRoaXMuZ2l0VGFiVHJhY2tlci5nZXRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gZ2l0VGFiICYmIGdpdFRhYi5mb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKTtcbiAgfVxuXG4gIHN1cmZhY2VUb1JlY2VudENvbW1pdCA9ICgpID0+IHtcbiAgICBjb25zdCBnaXRUYWIgPSB0aGlzLmdpdFRhYlRyYWNrZXIuZ2V0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIGdpdFRhYiAmJiBnaXRUYWIuZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKTtcbiAgfVxuXG4gIGRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMoKSB7XG4gICAgZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZDogZmFsc2V9LCB0aGlzLnByb3BzLndvcmtzcGFjZSk7XG4gIH1cblxuICBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMoKSB7XG4gICAgZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zKHRoaXMucHJvcHMud29ya3NwYWNlKTtcbiAgfVxuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKSB7XG4gICAgY29uc3QgZ2l0VGFiID0gdGhpcy5naXRUYWJUcmFja2VyLmdldENvbXBvbmVudCgpO1xuICAgIHJldHVybiBnaXRUYWIgJiYgZ2l0VGFiLnF1aWV0bHlTZWxlY3RJdGVtKGZpbGVQYXRoLCBzdGFnaW5nU3RhdHVzKTtcbiAgfVxuXG4gIGFzeW5jIHZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGUoc3RhZ2luZ1N0YXR1cykge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMucHJvcHMud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvci5nZXRQYXRoKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBhYnNGaWxlUGF0aCA9IGF3YWl0IGZzLnJlYWxwYXRoKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgIGNvbnN0IHJlcG9QYXRoID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCk7XG4gICAgaWYgKHJlcG9QYXRoID09PSBudWxsKSB7XG4gICAgICBjb25zdCBbcHJvamVjdFBhdGhdID0gdGhpcy5wcm9wcy5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gdGhpcy5wcm9wcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEluZm8oXG4gICAgICAgIFwiSG1tLCB0aGVyZSdzIG5vdGhpbmcgdG8gY29tcGFyZSB0aGlzIGZpbGUgdG9cIixcbiAgICAgICAge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnWW91IGNhbiBjcmVhdGUgYSBHaXQgcmVwb3NpdG9yeSB0byB0cmFjayBjaGFuZ2VzIHRvIHRoZSBmaWxlcyBpbiB5b3VyIHByb2plY3QuJyxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBidXR0b25zOiBbe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgIHRleHQ6ICdDcmVhdGUgYSByZXBvc2l0b3J5IG5vdycsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWRQYXRoID0gYXdhaXQgdGhpcy5pbml0aWFsaXplUmVwbyhwcm9qZWN0UGF0aCk7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIGNvbmZpcm1lZCByZXBvc2l0b3J5IGNyZWF0aW9uIGZvciB0aGlzIHByb2plY3QgcGF0aCxcbiAgICAgICAgICAgICAgLy8gcmV0cnkgdGhlIG9wZXJhdGlvbiB0aGF0IGdvdCB0aGVtIGhlcmUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICAgICAgICAgIGlmIChjcmVhdGVkUGF0aCA9PT0gcHJvamVjdFBhdGgpIHsgdGhpcy52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKHN0YWdpbmdTdGF0dXMpOyB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGFic0ZpbGVQYXRoLnN0YXJ0c1dpdGgocmVwb1BhdGgpKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGFic0ZpbGVQYXRoLnNsaWNlKHJlcG9QYXRoLmxlbmd0aCArIDEpO1xuICAgICAgdGhpcy5xdWlldGx5U2VsZWN0SXRlbShmaWxlUGF0aCwgc3RhZ2luZ1N0YXR1cyk7XG4gICAgICBjb25zdCBzcGxpdERpcmVjdGlvbiA9IHRoaXMucHJvcHMuY29uZmlnLmdldCgnZ2l0aHViLnZpZXdDaGFuZ2VzRm9yQ3VycmVudEZpbGVEaWZmUGFuZVNwbGl0RGlyZWN0aW9uJyk7XG4gICAgICBjb25zdCBwYW5lID0gdGhpcy5wcm9wcy53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgaWYgKHNwbGl0RGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgIHBhbmUuc3BsaXRSaWdodCgpO1xuICAgICAgfSBlbHNlIGlmIChzcGxpdERpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XG4gICAgICAgIHBhbmUuc3BsaXREb3duKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBsaW5lTnVtID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMTtcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKFxuICAgICAgICBDaGFuZ2VkRmlsZUl0ZW0uYnVpbGRVUkkoZmlsZVBhdGgsIHJlcG9QYXRoLCBzdGFnaW5nU3RhdHVzKSxcbiAgICAgICAge3BlbmRpbmc6IHRydWUsIGFjdGl2YXRlUGFuZTogdHJ1ZSwgYWN0aXZhdGVJdGVtOiB0cnVlfSxcbiAgICAgICk7XG4gICAgICBhd2FpdCBpdGVtLmdldFJlYWxJdGVtUHJvbWlzZSgpO1xuICAgICAgYXdhaXQgaXRlbS5nZXRGaWxlUGF0Y2hMb2FkZWRQcm9taXNlKCk7XG4gICAgICBpdGVtLmdvVG9EaWZmTGluZShsaW5lTnVtKTtcbiAgICAgIGl0ZW0uZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Fic0ZpbGVQYXRofSBkb2VzIG5vdCBiZWxvbmcgdG8gcmVwbyAke3JlcG9QYXRofWApO1xuICAgIH1cbiAgfVxuXG4gIHZpZXdVbnN0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKCd1bnN0YWdlZCcpO1xuICB9XG5cbiAgdmlld1N0YWdlZENoYW5nZXNGb3JDdXJyZW50RmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3Q2hhbmdlc0ZvckN1cnJlbnRGaWxlKCdzdGFnZWQnKTtcbiAgfVxuXG4gIG9wZW5GaWxlcyhmaWxlUGF0aHMsIHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoZmlsZVBhdGhzLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLmpvaW4ocmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpLCBmaWxlUGF0aCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihhYnNvbHV0ZVBhdGgsIHtwZW5kaW5nOiBmaWxlUGF0aHMubGVuZ3RoID09PSAxfSk7XG4gICAgfSkpO1xuICB9XG5cbiAgZ2V0VW5zYXZlZEZpbGVzKGZpbGVQYXRocywgd29ya2RpclBhdGgpIHtcbiAgICBjb25zdCBpc01vZGlmaWVkQnlQYXRoID0gbmV3IE1hcCgpO1xuICAgIHRoaXMucHJvcHMud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChlZGl0b3IgPT4ge1xuICAgICAgaXNNb2RpZmllZEJ5UGF0aC5zZXQoZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmlzTW9kaWZpZWQoKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbGVQYXRocy5maWx0ZXIoZmlsZVBhdGggPT4ge1xuICAgICAgY29uc3QgYWJzRmlsZVBhdGggPSBwYXRoLmpvaW4od29ya2RpclBhdGgsIGZpbGVQYXRoKTtcbiAgICAgIHJldHVybiBpc01vZGlmaWVkQnlQYXRoLmdldChhYnNGaWxlUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICBlbnN1cmVOb1Vuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsIG1lc3NhZ2UsIHdvcmtkaXJQYXRoID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCkpIHtcbiAgICBjb25zdCB1bnNhdmVkRmlsZXMgPSB0aGlzLmdldFVuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsIHdvcmtkaXJQYXRoKS5tYXAoZmlsZVBhdGggPT4gYFxcYCR7ZmlsZVBhdGh9XFxgYCkuam9pbignPGJyPicpO1xuICAgIGlmICh1bnNhdmVkRmlsZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYFlvdSBoYXZlIHVuc2F2ZWQgY2hhbmdlcyBpbjo8YnI+JHt1bnNhdmVkRmlsZXN9LmAsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhmaWxlUGF0aHMpIHtcbiAgICBjb25zdCBkZXN0cnVjdGl2ZUFjdGlvbiA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMoZmlsZVBhdGhzKTtcbiAgICB9O1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkuc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKFxuICAgICAgZmlsZVBhdGhzLFxuICAgICAgKCkgPT4gdGhpcy5lbnN1cmVOb1Vuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsICdDYW5ub3QgZGlzY2FyZCBjaGFuZ2VzIGluIHNlbGVjdGVkIGZpbGVzLicpLFxuICAgICAgZGVzdHJ1Y3RpdmVBY3Rpb24sXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGRpc2NhcmRMaW5lcyhtdWx0aUZpbGVQYXRjaCwgbGluZXMsIHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICAvLyAoa3V5Y2hhY28pIEZvciBub3cgd2Ugb25seSBzdXBwb3J0IGRpc2NhcmRpbmcgcm93cyBmb3IgTXVsdGlGaWxlUGF0Y2hlcyB0aGF0IGNvbnRhaW4gYSBzaW5nbGUgZmlsZSBwYXRjaFxuICAgIC8vIFRoZSBvbmx5IHdheSB0byBhY2Nlc3MgdGhpcyBtZXRob2QgZnJvbSB0aGUgVUkgaXMgdG8gYmUgaW4gYSBDaGFuZ2VkRmlsZUl0ZW0sIHdoaWNoIG9ubHkgaGFzIGEgc2luZ2xlIGZpbGUgcGF0Y2hcbiAgICBpZiAobXVsdGlGaWxlUGF0Y2guZ2V0RmlsZVBhdGNoZXMoKS5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSBtdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpWzBdLmdldFBhdGgoKTtcbiAgICBjb25zdCBkZXN0cnVjdGl2ZUFjdGlvbiA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRpc2NhcmRGaWxlUGF0Y2ggPSBtdWx0aUZpbGVQYXRjaC5nZXRVbnN0YWdlUGF0Y2hGb3JMaW5lcyhsaW5lcyk7XG4gICAgICBhd2FpdCByZXBvc2l0b3J5LmFwcGx5UGF0Y2hUb1dvcmtkaXIoZGlzY2FyZEZpbGVQYXRjaCk7XG4gICAgfTtcbiAgICByZXR1cm4gYXdhaXQgcmVwb3NpdG9yeS5zdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoXG4gICAgICBbZmlsZVBhdGhdLFxuICAgICAgKCkgPT4gdGhpcy5lbnN1cmVOb1Vuc2F2ZWRGaWxlcyhbZmlsZVBhdGhdLCAnQ2Fubm90IGRpc2NhcmQgbGluZXMuJywgcmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpKSxcbiAgICAgIGRlc3RydWN0aXZlQWN0aW9uLFxuICAgICAgZmlsZVBhdGgsXG4gICAgKTtcbiAgfVxuXG4gIGdldEZpbGVQYXRoc0Zvckxhc3REaXNjYXJkKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgbGV0IGxhc3RTbmFwc2hvdHMgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgaWYgKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpIHtcbiAgICAgIGxhc3RTbmFwc2hvdHMgPSBsYXN0U25hcHNob3RzID8gW2xhc3RTbmFwc2hvdHNdIDogW107XG4gICAgfVxuICAgIHJldHVybiBsYXN0U25hcHNob3RzLm1hcChzbmFwc2hvdCA9PiBzbmFwc2hvdC5maWxlUGF0aCk7XG4gIH1cblxuICBhc3luYyB1bmRvTGFzdERpc2NhcmQocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwsIHJlcG9zaXRvcnkgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkpIHtcbiAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLmdldEZpbGVQYXRoc0Zvckxhc3REaXNjYXJkKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgcmVwb3NpdG9yeS5yZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyhcbiAgICAgICAgKCkgPT4gdGhpcy5lbnN1cmVOb1Vuc2F2ZWRGaWxlcyhmaWxlUGF0aHMsICdDYW5ub3QgdW5kbyBsYXN0IGRpc2NhcmQuJyksXG4gICAgICAgIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgsXG4gICAgICApO1xuICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuICAgICAgYXdhaXQgdGhpcy5wcm9jZWVkT3JQcm9tcHRCYXNlZE9uUmVzdWx0cyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEdpdEVycm9yICYmIGUuc3RkRXJyLm1hdGNoKC9mYXRhbDogTm90IGEgdmFsaWQgb2JqZWN0IG5hbWUvKSkge1xuICAgICAgICB0aGlzLmNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzKGZpbGVQYXRocywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByb2NlZWRPclByb21wdEJhc2VkT25SZXN1bHRzKHJlc3VsdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3QgY29uZmxpY3RzID0gcmVzdWx0cy5maWx0ZXIoKHtjb25mbGljdH0pID0+IGNvbmZsaWN0KTtcbiAgICBpZiAoY29uZmxpY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9tcHRBYm91dENvbmZsaWN0cyhyZXN1bHRzLCBjb25mbGljdHMsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByb21wdEFib3V0Q29uZmxpY3RzKHJlc3VsdHMsIGNvbmZsaWN0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBjb25mbGljdGVkRmlsZXMgPSBjb25mbGljdHMubWFwKCh7ZmlsZVBhdGh9KSA9PiBgXFx0JHtmaWxlUGF0aH1gKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBjaG9pY2UgPSB0aGlzLnByb3BzLmNvbmZpcm0oe1xuICAgICAgbWVzc2FnZTogJ1VuZG9pbmcgd2lsbCByZXN1bHQgaW4gY29uZmxpY3RzLi4uJyxcbiAgICAgIGRldGFpbGVkTWVzc2FnZTogYGZvciB0aGUgZm9sbG93aW5nIGZpbGVzOlxcbiR7Y29uZmxpY3RlZEZpbGVzfVxcbmAgK1xuICAgICAgICAnV291bGQgeW91IGxpa2UgdG8gYXBwbHkgdGhlIGNoYW5nZXMgd2l0aCBtZXJnZSBjb25mbGljdCBtYXJrZXJzLCAnICtcbiAgICAgICAgJ29yIG9wZW4gdGhlIHRleHQgd2l0aCBtZXJnZSBjb25mbGljdCBtYXJrZXJzIGluIGEgbmV3IGZpbGU/JyxcbiAgICAgIGJ1dHRvbnM6IFsnTWVyZ2Ugd2l0aCBjb25mbGljdCBtYXJrZXJzJywgJ09wZW4gaW4gbmV3IGZpbGUnLCAnQ2FuY2VsJ10sXG4gICAgfSk7XG4gICAgaWYgKGNob2ljZSA9PT0gMCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9jZWVkV2l0aExhc3REaXNjYXJkVW5kbyhyZXN1bHRzLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGNob2ljZSA9PT0gMSkge1xuICAgICAgYXdhaXQgdGhpcy5vcGVuQ29uZmxpY3RzSW5OZXdFZGl0b3JzKGNvbmZsaWN0cy5tYXAoKHtyZXN1bHRQYXRofSkgPT4gcmVzdWx0UGF0aCkpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFuVXBIaXN0b3J5Rm9yRmlsZVBhdGhzKGZpbGVQYXRocywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICB0aGlzLnByb3BzLnJlcG9zaXRvcnkuY2xlYXJEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBjb25zdCBmaWxlUGF0aHNTdHIgPSBmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IGBcXGAke2ZpbGVQYXRofVxcYGApLmpvaW4oJzxicj4nKTtcbiAgICB0aGlzLnByb3BzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoXG4gICAgICAnRGlzY2FyZCBoaXN0b3J5IGhhcyBleHBpcmVkLicsXG4gICAgICB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBgQ2Fubm90IHVuZG8gZGlzY2FyZCBmb3I8YnI+JHtmaWxlUGF0aHNTdHJ9PGJyPlN0YWxlIGRpc2NhcmQgaGlzdG9yeSBoYXMgYmVlbiBkZWxldGVkLmAsXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VlZFdpdGhMYXN0RGlzY2FyZFVuZG8ocmVzdWx0cywgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IHJlc3VsdHMubWFwKGFzeW5jIHJlc3VsdCA9PiB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIHJlc3VsdFBhdGgsIGRlbGV0ZWQsIGNvbmZsaWN0LCB0aGVpcnNTaGEsIGNvbW1vbkJhc2VTaGEsIGN1cnJlbnRTaGF9ID0gcmVzdWx0O1xuICAgICAgY29uc3QgYWJzRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksIGZpbGVQYXRoKTtcbiAgICAgIGlmIChkZWxldGVkICYmIHJlc3VsdFBhdGggPT09IG51bGwpIHtcbiAgICAgICAgYXdhaXQgZnMucmVtb3ZlKGFic0ZpbGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGZzLmNvcHkocmVzdWx0UGF0aCwgYWJzRmlsZVBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbmZsaWN0KSB7XG4gICAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVwb3NpdG9yeS53cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBjdXJyZW50U2hhLCB0aGVpcnNTaGEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBhd2FpdCB0aGlzLnByb3BzLnJlcG9zaXRvcnkucG9wRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICBhc3luYyBvcGVuQ29uZmxpY3RzSW5OZXdFZGl0b3JzKHJlc3VsdFBhdGhzKSB7XG4gICAgY29uc3QgZWRpdG9yUHJvbWlzZXMgPSByZXN1bHRQYXRocy5tYXAocmVzdWx0UGF0aCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53b3Jrc3BhY2Uub3BlbihyZXN1bHRQYXRoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwoZWRpdG9yUHJvbWlzZXMpO1xuICB9XG5cbiAgcmVwb3J0UmVsYXlFcnJvciA9IChmcmllbmRseU1lc3NhZ2UsIGVycikgPT4ge1xuICAgIGNvbnN0IG9wdHMgPSB7ZGlzbWlzc2FibGU6IHRydWV9O1xuXG4gICAgaWYgKGVyci5uZXR3b3JrKSB7XG4gICAgICAvLyBPZmZsaW5lXG4gICAgICBvcHRzLmljb24gPSAnYWxpZ25tZW50LXVuYWxpZ24nO1xuICAgICAgb3B0cy5kZXNjcmlwdGlvbiA9IFwiSXQgbG9va3MgbGlrZSB5b3UncmUgb2ZmbGluZSByaWdodCBub3cuXCI7XG4gICAgfSBlbHNlIGlmIChlcnIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAvLyBUcmFuc2llbnQgZXJyb3IgbGlrZSBhIDUwMCBmcm9tIHRoZSBBUElcbiAgICAgIG9wdHMuZGVzY3JpcHRpb24gPSAnVGhlIEdpdEh1YiBBUEkgcmVwb3J0ZWQgYSBwcm9ibGVtLic7XG4gICAgICBvcHRzLmRldGFpbCA9IGVyci5yZXNwb25zZVRleHQ7XG4gICAgfSBlbHNlIGlmIChlcnIuZXJyb3JzKSB7XG4gICAgICAvLyBHcmFwaFFMIGVycm9yc1xuICAgICAgb3B0cy5kZXRhaWwgPSBlcnIuZXJyb3JzLm1hcChlID0+IGUubWVzc2FnZSkuam9pbignXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMuZGV0YWlsID0gZXJyLnN0YWNrO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihmcmllbmRseU1lc3NhZ2UsIG9wdHMpO1xuICB9XG5cbiAgLypcbiAgICogQXN5bmNocm9ub3VzbHkgY291bnQgdGhlIGNvbmZsaWN0IG1hcmtlcnMgcHJlc2VudCBpbiBhIGZpbGUgc3BlY2lmaWVkIGJ5IGZ1bGwgcGF0aC5cbiAgICovXG4gIHJlZnJlc2hSZXNvbHV0aW9uUHJvZ3Jlc3MoZnVsbFBhdGgpIHtcbiAgICBjb25zdCByZWFkU3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShmdWxsUGF0aCwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBDb25mbGljdC5jb3VudEZyb21TdHJlYW0ocmVhZFN0cmVhbSkudGhlbihjb3VudCA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzLnJlcG9ydE1hcmtlckNvdW50KGZ1bGxQYXRoLCBjb3VudCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBUYWJUcmFja2VyIHtcbiAgY29uc3RydWN0b3IobmFtZSwge2dldFdvcmtzcGFjZSwgdXJpfSkge1xuICAgIGF1dG9iaW5kKHRoaXMsICd0b2dnbGUnLCAndG9nZ2xlRm9jdXMnLCAnZW5zdXJlVmlzaWJsZScpO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICB0aGlzLmdldFdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZTtcbiAgICB0aGlzLnVyaSA9IHVyaTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBmb2N1c1RvUmVzdG9yZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IHNob3VsZFJlc3RvcmVGb2N1cyA9IGZhbHNlO1xuXG4gICAgLy8gUmVuZGVyZWQgPT4gdGhlIGRvY2sgaXRlbSBpcyBiZWluZyByZW5kZXJlZCwgd2hldGhlciBvciBub3QgdGhlIGRvY2sgaXMgdmlzaWJsZSBvciB0aGUgaXRlbVxuICAgIC8vICAgaXMgdmlzaWJsZSB3aXRoaW4gaXRzIGRvY2suXG4gICAgLy8gVmlzaWJsZSA9PiB0aGUgaXRlbSBpcyBhY3RpdmUgYW5kIHRoZSBkb2NrIGl0ZW0gaXMgYWN0aXZlIHdpdGhpbiBpdHMgZG9jay5cbiAgICBjb25zdCB3YXNSZW5kZXJlZCA9IHRoaXMuaXNSZW5kZXJlZCgpO1xuICAgIGNvbnN0IHdhc1Zpc2libGUgPSB0aGlzLmlzVmlzaWJsZSgpO1xuXG4gICAgaWYgKCF3YXNSZW5kZXJlZCB8fCAhd2FzVmlzaWJsZSkge1xuICAgICAgLy8gTm90IHJlbmRlcmVkLCBvciByZW5kZXJlZCBidXQgbm90IGFuIGFjdGl2ZSBpdGVtIGluIGEgdmlzaWJsZSBkb2NrLlxuICAgICAgYXdhaXQgdGhpcy5yZXZlYWwoKTtcbiAgICAgIHNob3VsZFJlc3RvcmVGb2N1cyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbmRlcmVkIGFuZCBhbiBhY3RpdmUgaXRlbSB3aXRoaW4gYSB2aXNpYmxlIGRvY2suXG4gICAgICBhd2FpdCB0aGlzLmhpZGUoKTtcbiAgICAgIHNob3VsZFJlc3RvcmVGb2N1cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRSZXN0b3JlRm9jdXMpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gZm9jdXNUb1Jlc3RvcmUuZm9jdXMoKSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdG9nZ2xlRm9jdXMoKSB7XG4gICAgY29uc3QgaGFkRm9jdXMgPSB0aGlzLmhhc0ZvY3VzKCk7XG4gICAgYXdhaXQgdGhpcy5lbnN1cmVWaXNpYmxlKCk7XG5cbiAgICBpZiAoaGFkRm9jdXMpIHtcbiAgICAgIGxldCB3b3Jrc3BhY2UgPSB0aGlzLmdldFdvcmtzcGFjZSgpO1xuICAgICAgaWYgKHdvcmtzcGFjZS5nZXRDZW50ZXIpIHtcbiAgICAgICAgd29ya3NwYWNlID0gd29ya3NwYWNlLmdldENlbnRlcigpO1xuICAgICAgfVxuICAgICAgd29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZW5zdXJlVmlzaWJsZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgIGF3YWl0IHRoaXMucmV2ZWFsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZW5zdXJlUmVuZGVyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V29ya3NwYWNlKCkub3Blbih0aGlzLnVyaSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlLCBhY3RpdmF0ZUl0ZW06IGZhbHNlLCBhY3RpdmF0ZVBhbmU6IGZhbHNlfSk7XG4gIH1cblxuICByZXZlYWwoKSB7XG4gICAgaW5jcmVtZW50Q291bnRlcihgJHt0aGlzLm5hbWV9LXRhYi1vcGVuYCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V29ya3NwYWNlKCkub3Blbih0aGlzLnVyaSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlLCBhY3RpdmF0ZUl0ZW06IHRydWUsIGFjdGl2YXRlUGFuZTogdHJ1ZX0pO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpbmNyZW1lbnRDb3VudGVyKGAke3RoaXMubmFtZX0tdGFiLWNsb3NlYCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V29ya3NwYWNlKCkuaGlkZSh0aGlzLnVyaSk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLmdldENvbXBvbmVudCgpLnJlc3RvcmVGb2N1cygpO1xuICB9XG5cbiAgZ2V0SXRlbSgpIHtcbiAgICBjb25zdCBwYW5lID0gdGhpcy5nZXRXb3Jrc3BhY2UoKS5wYW5lRm9yVVJJKHRoaXMudXJpKTtcbiAgICBpZiAoIXBhbmUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBhbmVJdGVtID0gcGFuZS5pdGVtRm9yVVJJKHRoaXMudXJpKTtcbiAgICBpZiAoIXBhbmVJdGVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFuZUl0ZW07XG4gIH1cblxuICBnZXRDb21wb25lbnQoKSB7XG4gICAgY29uc3QgcGFuZUl0ZW0gPSB0aGlzLmdldEl0ZW0oKTtcbiAgICBpZiAoIXBhbmVJdGVtKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKCgodHlwZW9mIHBhbmVJdGVtLmdldFJlYWxJdGVtKSAhPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBwYW5lSXRlbS5nZXRSZWFsSXRlbSgpO1xuICB9XG5cbiAgZ2V0RE9NRWxlbWVudCgpIHtcbiAgICBjb25zdCBwYW5lSXRlbSA9IHRoaXMuZ2V0SXRlbSgpO1xuICAgIGlmICghcGFuZUl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKCh0eXBlb2YgcGFuZUl0ZW0uZ2V0RWxlbWVudCkgIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFuZUl0ZW0uZ2V0RWxlbWVudCgpO1xuICB9XG5cbiAgaXNSZW5kZXJlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLmdldFdvcmtzcGFjZSgpLnBhbmVGb3JVUkkodGhpcy51cmkpO1xuICB9XG5cbiAgaXNWaXNpYmxlKCkge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IHRoaXMuZ2V0V29ya3NwYWNlKCk7XG4gICAgcmV0dXJuIHdvcmtzcGFjZS5nZXRQYW5lQ29udGFpbmVycygpXG4gICAgICAuZmlsdGVyKGNvbnRhaW5lciA9PiBjb250YWluZXIgPT09IHdvcmtzcGFjZS5nZXRDZW50ZXIoKSB8fCBjb250YWluZXIuaXNWaXNpYmxlKCkpXG4gICAgICAuc29tZShjb250YWluZXIgPT4gY29udGFpbmVyLmdldFBhbmVzKCkuc29tZShwYW5lID0+IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHBhbmUuZ2V0QWN0aXZlSXRlbSgpO1xuICAgICAgICByZXR1cm4gaXRlbSAmJiBpdGVtLmdldFVSSSAmJiBpdGVtLmdldFVSSSgpID09PSB0aGlzLnVyaTtcbiAgICAgIH0pKTtcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmdldERPTUVsZW1lbnQoKTtcbiAgICByZXR1cm4gcm9vdCAmJiByb290LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICB9XG59XG4iXX0=