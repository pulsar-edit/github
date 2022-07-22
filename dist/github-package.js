"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _helpers = require("./helpers");

var _workdirCache = _interopRequireDefault(require("./models/workdir-cache"));

var _workdirContext = _interopRequireDefault(require("./models/workdir-context"));

var _workdirContextPool = _interopRequireDefault(require("./models/workdir-context-pool"));

var _repository = _interopRequireDefault(require("./models/repository"));

var _styleCalculator = _interopRequireDefault(require("./models/style-calculator"));

var _githubLoginModel = _interopRequireDefault(require("./models/github-login-model"));

var _rootController = _interopRequireDefault(require("./controllers/root-controller"));

var _stubItem = _interopRequireDefault(require("./items/stub-item"));

var _switchboard = _interopRequireDefault(require("./switchboard"));

var _yardstick = _interopRequireDefault(require("./yardstick"));

var _gitTimingsView = _interopRequireDefault(require("./views/git-timings-view"));

var _contextMenuInterceptor = _interopRequireDefault(require("./context-menu-interceptor"));

var _asyncQueue = _interopRequireDefault(require("./async-queue"));

var _workerManager = _interopRequireDefault(require("./worker-manager"));

var _getRepoPipelineManager = _interopRequireDefault(require("./get-repo-pipeline-manager"));

var _reporterProxy = require("./reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultState = {
  newProject: true,
  activeRepositoryPath: null,
  contextLocked: false
};

class GithubPackage {
  constructor({
    workspace,
    project,
    commands,
    notificationManager,
    tooltips,
    styles,
    grammars,
    keymaps,
    config,
    deserializers,
    confirm,
    getLoadSettings,
    currentWindow,
    configDirPath,
    renderFn,
    loginModel
  }) {
    _defineProperty(this, "handleActivePaneItemChange", () => {
      if (this.lockedContext) {
        return;
      }

      const itemPath = pathForPaneItem(this.workspace.getCenter().getActivePaneItem());
      this.scheduleActiveContextUpdate({
        usePath: itemPath,
        lock: false
      });
    });

    _defineProperty(this, "handleProjectPathsChange", () => {
      this.scheduleActiveContextUpdate();
    });

    _defineProperty(this, "initialize", async projectPath => {
      await _fsExtra.default.mkdirs(projectPath);
      const repository = this.contextPool.add(projectPath).getRepository();
      await repository.init();
      this.workdirCache.invalidate();

      if (!this.project.contains(projectPath)) {
        this.project.addPath(projectPath);
      }

      await this.refreshAtomGitRepository(projectPath);
      await this.scheduleActiveContextUpdate();
    });

    _defineProperty(this, "clone", async (remoteUrl, projectPath, sourceRemoteName = 'origin') => {
      const context = this.contextPool.getContext(projectPath);
      let repository;

      if (context.isPresent()) {
        repository = context.getRepository();
        await repository.clone(remoteUrl, sourceRemoteName);
        repository.destroy();
      } else {
        repository = new _repository.default(projectPath, null, {
          pipelineManager: this.pipelineManager
        });
        await repository.clone(remoteUrl, sourceRemoteName);
      }

      this.workdirCache.invalidate();
      this.project.addPath(projectPath);
      await this.scheduleActiveContextUpdate();

      _reporterProxy.reporterProxy.addEvent('clone-repository', {
        project: 'github'
      });
    });

    (0, _helpers.autobind)(this, 'consumeStatusBar', 'createGitTimingsView', 'createIssueishPaneItemStub', 'createDockItemStub', 'createFilePatchControllerStub', 'destroyGitTabItem', 'destroyGithubTabItem', 'getRepositoryForWorkdir', 'scheduleActiveContextUpdate');
    this.workspace = workspace;
    this.project = project;
    this.commands = commands;
    this.deserializers = deserializers;
    this.notificationManager = notificationManager;
    this.tooltips = tooltips;
    this.config = config;
    this.styles = styles;
    this.grammars = grammars;
    this.keymaps = keymaps;
    this.configPath = _path.default.join(configDirPath, 'github.cson');
    this.currentWindow = currentWindow;
    this.styleCalculator = new _styleCalculator.default(this.styles, this.config);
    this.confirm = confirm;
    this.startOpen = false;
    this.activated = false;
    const criteria = {
      projectPathCount: this.project.getPaths().length,
      initPathCount: (getLoadSettings().initialPaths || []).length
    };
    this.pipelineManager = (0, _getRepoPipelineManager.default)({
      confirm,
      notificationManager,
      workspace
    });
    this.activeContextQueue = new _asyncQueue.default();
    this.guessedContext = _workdirContext.default.guess(criteria, this.pipelineManager);
    this.activeContext = this.guessedContext;
    this.lockedContext = null;
    this.workdirCache = new _workdirCache.default();
    this.contextPool = new _workdirContextPool.default({
      window,
      workspace,
      promptCallback: query => this.controller.openCredentialsDialog(query),
      pipelineManager: this.pipelineManager
    });
    this.switchboard = new _switchboard.default();
    this.loginModel = loginModel || new _githubLoginModel.default();

    this.renderFn = renderFn || ((component, node, callback) => {
      return _reactDom.default.render(component, node, callback);
    }); // Handle events from all resident contexts.


    this.subscriptions = new _eventKit.CompositeDisposable(this.contextPool.onDidChangeWorkdirOrHead(context => {
      this.refreshAtomGitRepository(context.getWorkingDirectory());
    }), this.contextPool.onDidUpdateRepository(context => {
      this.switchboard.didUpdateRepository(context.getRepository());
    }), this.contextPool.onDidDestroyRepository(context => {
      if (context === this.activeContext) {
        this.setActiveContext(_workdirContext.default.absent({
          pipelineManager: this.pipelineManager
        }));
      }
    }), _contextMenuInterceptor.default);
    this.setupYardstick();
  }

  setupYardstick() {
    const stagingSeries = ['stageLine', 'stageHunk', 'unstageLine', 'unstageHunk'];
    this.subscriptions.add( // Staging and unstaging operations
    this.switchboard.onDidBeginStageOperation(payload => {
      if (payload.stage && payload.line) {
        _yardstick.default.begin('stageLine');
      } else if (payload.stage && payload.hunk) {
        _yardstick.default.begin('stageHunk');
      } else if (payload.stage && payload.file) {
        _yardstick.default.begin('stageFile');
      } else if (payload.stage && payload.mode) {
        _yardstick.default.begin('stageMode');
      } else if (payload.stage && payload.symlink) {
        _yardstick.default.begin('stageSymlink');
      } else if (payload.unstage && payload.line) {
        _yardstick.default.begin('unstageLine');
      } else if (payload.unstage && payload.hunk) {
        _yardstick.default.begin('unstageHunk');
      } else if (payload.unstage && payload.file) {
        _yardstick.default.begin('unstageFile');
      } else if (payload.unstage && payload.mode) {
        _yardstick.default.begin('unstageMode');
      } else if (payload.unstage && payload.symlink) {
        _yardstick.default.begin('unstageSymlink');
      }
    }), this.switchboard.onDidUpdateRepository(() => {
      _yardstick.default.mark(stagingSeries, 'update-repository');
    }), this.switchboard.onDidFinishRender(context => {
      if (context === 'RootController.showFilePatchForPath') {
        _yardstick.default.finish(stagingSeries);
      }
    }), // Active context changes
    this.switchboard.onDidScheduleActiveContextUpdate(() => {
      _yardstick.default.begin('activeContextChange');
    }), this.switchboard.onDidBeginActiveContextUpdate(() => {
      _yardstick.default.mark('activeContextChange', 'queue-wait');
    }), this.switchboard.onDidFinishContextChangeRender(() => {
      _yardstick.default.mark('activeContextChange', 'render');
    }), this.switchboard.onDidFinishActiveContextUpdate(() => {
      _yardstick.default.finish('activeContextChange');
    }));
  }

  async activate(state = {}) {
    const savedState = _objectSpread({}, defaultState, {}, state);

    const firstRun = !(await (0, _helpers.fileExists)(this.configPath));
    const newProject = savedState.firstRun !== undefined ? savedState.firstRun : savedState.newProject;
    this.startOpen = firstRun || newProject;
    this.startRevealed = firstRun && !this.config.get('welcome.showOnStartup');

    if (firstRun) {
      await _fsExtra.default.writeFile(this.configPath, '# Store non-visible GitHub package state.\n', {
        encoding: 'utf8'
      });
    }

    const hasSelectedFiles = event => {
      return !!event.target.closest('.github-FilePatchListView').querySelector('.is-selected');
    };

    this.subscriptions.add(this.workspace.getCenter().onDidChangeActivePaneItem(this.handleActivePaneItemChange), this.project.onDidChangePaths(this.handleProjectPathsChange), this.styleCalculator.startWatching('github-package-styles', ['editor.fontSize', 'editor.fontFamily', 'editor.lineHeight', 'editor.tabLength'], config => `
          .github-HunkView-line {
            font-family: ${config.get('editor.fontFamily')};
            line-height: ${config.get('editor.lineHeight')};
            tab-size: ${config.get('editor.tabLength')}
          }
        `), atom.contextMenu.add({
      '.github-UnstagedChanges .github-FilePatchListView': [{
        label: 'Stage',
        command: 'core:confirm',
        shouldDisplay: hasSelectedFiles
      }, {
        type: 'separator',
        shouldDisplay: hasSelectedFiles
      }, {
        label: 'Discard Changes',
        command: 'github:discard-changes-in-selected-files',
        shouldDisplay: hasSelectedFiles
      }],
      '.github-StagedChanges .github-FilePatchListView': [{
        label: 'Unstage',
        command: 'core:confirm',
        shouldDisplay: hasSelectedFiles
      }],
      '.github-MergeConflictPaths .github-FilePatchListView': [{
        label: 'Stage',
        command: 'core:confirm',
        shouldDisplay: hasSelectedFiles
      }, {
        type: 'separator',
        shouldDisplay: hasSelectedFiles
      }, {
        label: 'Resolve File As Ours',
        command: 'github:resolve-file-as-ours',
        shouldDisplay: hasSelectedFiles
      }, {
        label: 'Resolve File As Theirs',
        command: 'github:resolve-file-as-theirs',
        shouldDisplay: hasSelectedFiles
      }]
    }));
    this.activated = true;
    this.scheduleActiveContextUpdate({
      usePath: savedState.activeRepositoryPath,
      lock: savedState.contextLocked
    });
    this.rerender();
  }

  serialize() {
    return {
      activeRepositoryPath: this.getActiveWorkdir(),
      contextLocked: Boolean(this.lockedContext),
      newProject: false
    };
  }

  rerender(callback) {
    if (this.workspace.isDestroyed()) {
      return;
    }

    if (!this.activated) {
      return;
    }

    if (!this.element) {
      this.element = document.createElement('div');
      this.subscriptions.add(new _eventKit.Disposable(() => {
        _reactDom.default.unmountComponentAtNode(this.element);

        delete this.element;
      }));
    }

    const changeWorkingDirectory = workingDirectory => {
      return this.scheduleActiveContextUpdate({
        usePath: workingDirectory
      });
    };

    const setContextLock = (workingDirectory, lock) => {
      return this.scheduleActiveContextUpdate({
        usePath: workingDirectory,
        lock
      });
    };

    this.renderFn( /*#__PURE__*/_react.default.createElement(_rootController.default, {
      ref: c => {
        this.controller = c;
      },
      workspace: this.workspace,
      deserializers: this.deserializers,
      commands: this.commands,
      notificationManager: this.notificationManager,
      tooltips: this.tooltips,
      grammars: this.grammars,
      keymaps: this.keymaps,
      config: this.config,
      project: this.project,
      confirm: this.confirm,
      currentWindow: this.currentWindow,
      workdirContextPool: this.contextPool,
      loginModel: this.loginModel,
      repository: this.getActiveRepository(),
      resolutionProgress: this.getActiveResolutionProgress(),
      statusBar: this.statusBar,
      initialize: this.initialize,
      clone: this.clone,
      switchboard: this.switchboard,
      startOpen: this.startOpen,
      startRevealed: this.startRevealed,
      removeFilePatchItem: this.removeFilePatchItem,
      currentWorkDir: this.getActiveWorkdir(),
      contextLocked: this.lockedContext !== null,
      changeWorkingDirectory: changeWorkingDirectory,
      setContextLock: setContextLock
    }), this.element, callback);
  }

  async deactivate() {
    this.subscriptions.dispose();
    this.contextPool.clear();

    _workerManager.default.reset(false);

    if (this.guessedContext) {
      this.guessedContext.destroy();
      this.guessedContext = null;
    }

    await _yardstick.default.flush();
  }

  consumeStatusBar(statusBar) {
    this.statusBar = statusBar;
    this.rerender();
  }

  consumeReporter(reporter) {
    _reporterProxy.reporterProxy.setReporter(reporter);
  }

  createGitTimingsView() {
    return _stubItem.default.create('git-timings-view', {
      title: 'GitHub Package Timings View'
    }, _gitTimingsView.default.buildURI());
  }

  createIssueishPaneItemStub({
    uri,
    selectedTab
  }) {
    return _stubItem.default.create('issueish-detail-item', {
      title: 'Issueish',
      initSelectedTab: selectedTab
    }, uri);
  }

  createDockItemStub({
    uri
  }) {
    let item;

    switch (uri) {
      // always return an empty stub
      // but only set it as the active item for a tab type
      // if it doesn't already exist
      case 'atom-github://dock-item/git':
        item = this.createGitStub(uri);
        this.gitTabStubItem = this.gitTabStubItem || item;
        break;

      case 'atom-github://dock-item/github':
        item = this.createGitHubStub(uri);
        this.githubTabStubItem = this.githubTabStubItem || item;
        break;

      default:
        throw new Error(`Invalid DockItem stub URI: ${uri}`);
    }

    if (this.controller) {
      this.rerender();
    }

    return item;
  }

  createGitStub(uri) {
    return _stubItem.default.create('git', {
      title: 'Git'
    }, uri);
  }

  createGitHubStub(uri) {
    return _stubItem.default.create('github', {
      title: 'GitHub'
    }, uri);
  }

  createFilePatchControllerStub({
    uri
  } = {}) {
    const item = _stubItem.default.create('git-file-patch-controller', {
      title: 'Diff'
    }, uri);

    if (this.controller) {
      this.rerender();
    }

    return item;
  }

  createCommitPreviewStub({
    uri
  }) {
    const item = _stubItem.default.create('git-commit-preview', {
      title: 'Commit preview'
    }, uri);

    if (this.controller) {
      this.rerender();
    }

    return item;
  }

  createCommitDetailStub({
    uri
  }) {
    const item = _stubItem.default.create('git-commit-detail', {
      title: 'Commit'
    }, uri);

    if (this.controller) {
      this.rerender();
    }

    return item;
  }

  createReviewsStub({
    uri
  }) {
    const item = _stubItem.default.create('github-reviews', {
      title: 'Reviews'
    }, uri);

    if (this.controller) {
      this.rerender();
    }

    return item;
  }

  destroyGitTabItem() {
    if (this.gitTabStubItem) {
      this.gitTabStubItem.destroy();
      this.gitTabStubItem = null;

      if (this.controller) {
        this.rerender();
      }
    }
  }

  destroyGithubTabItem() {
    if (this.githubTabStubItem) {
      this.githubTabStubItem.destroy();
      this.githubTabStubItem = null;

      if (this.controller) {
        this.rerender();
      }
    }
  }

  getRepositoryForWorkdir(projectPath) {
    const loadingGuessRepo = _repository.default.loadingGuess({
      pipelineManager: this.pipelineManager
    });

    return this.guessedContext ? loadingGuessRepo : this.contextPool.getContext(projectPath).getRepository();
  }

  getActiveWorkdir() {
    return this.activeContext.getWorkingDirectory();
  }

  getActiveRepository() {
    return this.activeContext.getRepository();
  }

  getActiveResolutionProgress() {
    return this.activeContext.getResolutionProgress();
  }

  getContextPool() {
    return this.contextPool;
  }

  getSwitchboard() {
    return this.switchboard;
  }
  /**
   * Enqueue a request to modify the active context.
   *
   * options:
   *   usePath - Path of the context to use as the next context, if it is present in the pool.
   *   lock - True or false to lock the ultimately chosen context. Omit to preserve the current lock state.
   *
   * This method returns a Promise that resolves when the requested context update has completed. Note that it's
   * *possible* for the active context after resolution to differ from a requested `usePath`, if the workdir
   * containing `usePath` is no longer a viable option, such as if it belongs to a project that is no longer present.
   */


  async scheduleActiveContextUpdate(options = {}) {
    this.switchboard.didScheduleActiveContextUpdate();
    await this.activeContextQueue.push(this.updateActiveContext.bind(this, options), {
      parallel: false
    });
  }
  /**
   * Derive the git working directory context that should be used for the package's git operations based on the current
   * state of the Atom workspace. In priority, this prefers:
   *
   * - When activating: the working directory that was active when the package was last serialized, if it still a viable
   *   option. (usePath)
   * - The working directory chosen by the user from the context tile on the git or GitHub tabs. (usePath)
   * - The working directory containing the path of the active pane item.
   * - A git working directory corresponding to "first" project, if any projects are open.
   * - The current context, unchanged, which may be a `NullWorkdirContext`.
   *
   * First updates the pool of resident contexts to match all git working directories that correspond to open
   * projects and pane items.
   */


  async getNextContext(usePath = null) {
    // Internal utility function to normalize paths not contained within a git
    // working tree.
    const workdirForNonGitPath = async sourcePath => {
      const containingRoot = this.project.getDirectories().find(root => root.contains(sourcePath));

      if (containingRoot) {
        return containingRoot.getPath();
        /* istanbul ignore else */
      } else if (!(await _fsExtra.default.stat(sourcePath)).isDirectory()) {
        return _path.default.dirname(sourcePath);
      } else {
        return sourcePath;
      }
    }; // Internal utility function to identify the working directory to use for
    // an arbitrary (file or directory) path.


    const workdirForPath = async sourcePath => {
      return (await Promise.all([this.workdirCache.find(sourcePath), workdirForNonGitPath(sourcePath)])).find(Boolean);
    }; // Identify paths that *could* contribute a git working directory to the pool. This is drawn from
    // the roots of open projects, the currently locked context if one is present, and the path of the
    // open workspace item.


    const candidatePaths = new Set(this.project.getPaths());

    if (this.lockedContext) {
      const lockedRepo = this.lockedContext.getRepository();
      /* istanbul ignore else */

      if (lockedRepo) {
        candidatePaths.add(lockedRepo.getWorkingDirectoryPath());
      }
    }

    const activeItemPath = pathForPaneItem(this.workspace.getCenter().getActivePaneItem());

    if (activeItemPath) {
      candidatePaths.add(activeItemPath);
    }

    let activeItemWorkdir = null;
    let firstProjectWorkdir = null; // Convert the candidate paths into the set of viable git working directories, by means of a cached
    // `git rev-parse` call. Candidate paths that are not contained within a git working directory will
    // be preserved as-is within the pool, to allow users to initialize them.

    const workdirs = new Set(await Promise.all(Array.from(candidatePaths, async candidatePath => {
      const workdir = await workdirForPath(candidatePath); // Note the workdirs associated with the active pane item and the first open project so we can
      // prefer them later.

      if (candidatePath === activeItemPath) {
        activeItemWorkdir = workdir;
      } else if (candidatePath === this.project.getPaths()[0]) {
        firstProjectWorkdir = workdir;
      }

      return workdir;
    }))); // Update pool with the identified projects.

    this.contextPool.set(workdirs); // 1 - Explicitly requested workdir. This is either selected by the user from a context tile or
    //     deserialized from package state. Choose this context only if it still exists in the pool.

    if (usePath) {
      // Normalize usePath in a similar fashion to the way we do activeItemPath.
      let useWorkdir = usePath;

      if (usePath === activeItemPath) {
        useWorkdir = activeItemWorkdir;
      } else if (usePath === this.project.getPaths()[0]) {
        useWorkdir = firstProjectWorkdir;
      } else {
        useWorkdir = await workdirForPath(usePath);
      }

      const stateContext = this.contextPool.getContext(useWorkdir);

      if (stateContext.isPresent()) {
        return stateContext;
      }
    } // 2 - Use the currently locked context, if one is present.


    if (this.lockedContext) {
      return this.lockedContext;
    } // 3 - Follow the active workspace pane item.


    if (activeItemWorkdir) {
      return this.contextPool.getContext(activeItemWorkdir);
    } // 4 - The first open project.


    if (firstProjectWorkdir) {
      return this.contextPool.getContext(firstProjectWorkdir);
    } // No projects. Revert to the absent context unless we've guessed that more projects are on the way.


    if (this.project.getPaths().length === 0 && !this.activeContext.getRepository().isUndetermined()) {
      return _workdirContext.default.absent({
        pipelineManager: this.pipelineManager
      });
    } // It is only possible to reach here if there there was no preferred directory, there are no project paths, and the
    // the active context's repository is not undetermined. Preserve the existing active context.


    return this.activeContext;
  }
  /**
   * Modify the active context and re-render the React tree. This should only be done as part of the
   * context update queue; use scheduleActiveContextUpdate() to do this.
   *
   * nextActiveContext - The WorkdirContext to make active next, as derived from the current workspace
   *   state by getNextContext(). This may be absent or undetermined.
   * lock - If true, also set this context as the "locked" one and engage the context lock if it isn't
   *   already. If false, clear any existing context lock. If null or undefined, leave the lock in its
   *   existing state.
   */


  setActiveContext(nextActiveContext, lock) {
    if (nextActiveContext !== this.activeContext) {
      if (this.activeContext === this.guessedContext) {
        this.guessedContext.destroy();
        this.guessedContext = null;
      }

      this.activeContext = nextActiveContext;

      if (lock === true) {
        this.lockedContext = this.activeContext;
      } else if (lock === false) {
        this.lockedContext = null;
      }

      this.rerender(() => {
        this.switchboard.didFinishContextChangeRender();
        this.switchboard.didFinishActiveContextUpdate();
      });
    } else if ((lock === true || lock === false) && lock !== (this.lockedContext !== null)) {
      if (lock) {
        this.lockedContext = this.activeContext;
      } else {
        this.lockedContext = null;
      }

      this.rerender(() => {
        this.switchboard.didFinishContextChangeRender();
        this.switchboard.didFinishActiveContextUpdate();
      });
    } else {
      this.switchboard.didFinishActiveContextUpdate();
    }
  }
  /**
   * Derive the next active context with getNextContext(), then enact the context change with setActiveContext().
   *
   * options:
   *   usePath - Path of the context to use as the next context, if it is present in the pool.
   *   lock - True or false to lock the ultimately chosen context. Omit to preserve the current lock state.
   */


  async updateActiveContext(options) {
    if (this.workspace.isDestroyed()) {
      return;
    }

    this.switchboard.didBeginActiveContextUpdate();
    const nextActiveContext = await this.getNextContext(options.usePath);
    this.setActiveContext(nextActiveContext, options.lock);
  }

  async refreshAtomGitRepository(workdir) {
    const directory = this.project.getDirectoryForProjectPath(workdir);

    if (!directory) {
      return;
    }

    const atomGitRepo = await this.project.repositoryForDirectory(directory);

    if (atomGitRepo) {
      await atomGitRepo.refreshStatus();
    }
  }

}

exports.default = GithubPackage;

function pathForPaneItem(paneItem) {
  if (!paneItem) {
    return null;
  } // Likely GitHub package provided pane item


  if (typeof paneItem.getWorkingDirectory === 'function') {
    return paneItem.getWorkingDirectory();
  } // TextEditor-like


  if (typeof paneItem.getPath === 'function') {
    return paneItem.getPath();
  } // Oh well


  return null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9naXRodWItcGFja2FnZS5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0U3RhdGUiLCJuZXdQcm9qZWN0IiwiYWN0aXZlUmVwb3NpdG9yeVBhdGgiLCJjb250ZXh0TG9ja2VkIiwiR2l0aHViUGFja2FnZSIsImNvbnN0cnVjdG9yIiwid29ya3NwYWNlIiwicHJvamVjdCIsImNvbW1hbmRzIiwibm90aWZpY2F0aW9uTWFuYWdlciIsInRvb2x0aXBzIiwic3R5bGVzIiwiZ3JhbW1hcnMiLCJrZXltYXBzIiwiY29uZmlnIiwiZGVzZXJpYWxpemVycyIsImNvbmZpcm0iLCJnZXRMb2FkU2V0dGluZ3MiLCJjdXJyZW50V2luZG93IiwiY29uZmlnRGlyUGF0aCIsInJlbmRlckZuIiwibG9naW5Nb2RlbCIsImxvY2tlZENvbnRleHQiLCJpdGVtUGF0aCIsInBhdGhGb3JQYW5lSXRlbSIsImdldENlbnRlciIsImdldEFjdGl2ZVBhbmVJdGVtIiwic2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlIiwidXNlUGF0aCIsImxvY2siLCJwcm9qZWN0UGF0aCIsImZzIiwibWtkaXJzIiwicmVwb3NpdG9yeSIsImNvbnRleHRQb29sIiwiYWRkIiwiZ2V0UmVwb3NpdG9yeSIsImluaXQiLCJ3b3JrZGlyQ2FjaGUiLCJpbnZhbGlkYXRlIiwiY29udGFpbnMiLCJhZGRQYXRoIiwicmVmcmVzaEF0b21HaXRSZXBvc2l0b3J5IiwicmVtb3RlVXJsIiwic291cmNlUmVtb3RlTmFtZSIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwiaXNQcmVzZW50IiwiY2xvbmUiLCJkZXN0cm95IiwiUmVwb3NpdG9yeSIsInBpcGVsaW5lTWFuYWdlciIsInJlcG9ydGVyUHJveHkiLCJhZGRFdmVudCIsImNvbmZpZ1BhdGgiLCJwYXRoIiwiam9pbiIsInN0eWxlQ2FsY3VsYXRvciIsIlN0eWxlQ2FsY3VsYXRvciIsInN0YXJ0T3BlbiIsImFjdGl2YXRlZCIsImNyaXRlcmlhIiwicHJvamVjdFBhdGhDb3VudCIsImdldFBhdGhzIiwibGVuZ3RoIiwiaW5pdFBhdGhDb3VudCIsImluaXRpYWxQYXRocyIsImFjdGl2ZUNvbnRleHRRdWV1ZSIsIkFzeW5jUXVldWUiLCJndWVzc2VkQ29udGV4dCIsIldvcmtkaXJDb250ZXh0IiwiZ3Vlc3MiLCJhY3RpdmVDb250ZXh0IiwiV29ya2RpckNhY2hlIiwiV29ya2RpckNvbnRleHRQb29sIiwid2luZG93IiwicHJvbXB0Q2FsbGJhY2siLCJxdWVyeSIsImNvbnRyb2xsZXIiLCJvcGVuQ3JlZGVudGlhbHNEaWFsb2ciLCJzd2l0Y2hib2FyZCIsIlN3aXRjaGJvYXJkIiwiR2l0aHViTG9naW5Nb2RlbCIsImNvbXBvbmVudCIsIm5vZGUiLCJjYWxsYmFjayIsIlJlYWN0RG9tIiwicmVuZGVyIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJvbkRpZENoYW5nZVdvcmtkaXJPckhlYWQiLCJnZXRXb3JraW5nRGlyZWN0b3J5Iiwib25EaWRVcGRhdGVSZXBvc2l0b3J5IiwiZGlkVXBkYXRlUmVwb3NpdG9yeSIsIm9uRGlkRGVzdHJveVJlcG9zaXRvcnkiLCJzZXRBY3RpdmVDb250ZXh0IiwiYWJzZW50IiwiQ29udGV4dE1lbnVJbnRlcmNlcHRvciIsInNldHVwWWFyZHN0aWNrIiwic3RhZ2luZ1NlcmllcyIsIm9uRGlkQmVnaW5TdGFnZU9wZXJhdGlvbiIsInBheWxvYWQiLCJzdGFnZSIsImxpbmUiLCJ5YXJkc3RpY2siLCJiZWdpbiIsImh1bmsiLCJmaWxlIiwibW9kZSIsInN5bWxpbmsiLCJ1bnN0YWdlIiwibWFyayIsIm9uRGlkRmluaXNoUmVuZGVyIiwiZmluaXNoIiwib25EaWRTY2hlZHVsZUFjdGl2ZUNvbnRleHRVcGRhdGUiLCJvbkRpZEJlZ2luQWN0aXZlQ29udGV4dFVwZGF0ZSIsIm9uRGlkRmluaXNoQ29udGV4dENoYW5nZVJlbmRlciIsIm9uRGlkRmluaXNoQWN0aXZlQ29udGV4dFVwZGF0ZSIsImFjdGl2YXRlIiwic3RhdGUiLCJzYXZlZFN0YXRlIiwiZmlyc3RSdW4iLCJ1bmRlZmluZWQiLCJzdGFydFJldmVhbGVkIiwiZ2V0Iiwid3JpdGVGaWxlIiwiZW5jb2RpbmciLCJoYXNTZWxlY3RlZEZpbGVzIiwiZXZlbnQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwicXVlcnlTZWxlY3RvciIsIm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0iLCJoYW5kbGVBY3RpdmVQYW5lSXRlbUNoYW5nZSIsIm9uRGlkQ2hhbmdlUGF0aHMiLCJoYW5kbGVQcm9qZWN0UGF0aHNDaGFuZ2UiLCJzdGFydFdhdGNoaW5nIiwiYXRvbSIsImNvbnRleHRNZW51IiwibGFiZWwiLCJjb21tYW5kIiwic2hvdWxkRGlzcGxheSIsInR5cGUiLCJyZXJlbmRlciIsInNlcmlhbGl6ZSIsImdldEFjdGl2ZVdvcmtkaXIiLCJCb29sZWFuIiwiaXNEZXN0cm95ZWQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiRGlzcG9zYWJsZSIsInVubW91bnRDb21wb25lbnRBdE5vZGUiLCJjaGFuZ2VXb3JraW5nRGlyZWN0b3J5Iiwid29ya2luZ0RpcmVjdG9yeSIsInNldENvbnRleHRMb2NrIiwiYyIsImdldEFjdGl2ZVJlcG9zaXRvcnkiLCJnZXRBY3RpdmVSZXNvbHV0aW9uUHJvZ3Jlc3MiLCJzdGF0dXNCYXIiLCJpbml0aWFsaXplIiwicmVtb3ZlRmlsZVBhdGNoSXRlbSIsImRlYWN0aXZhdGUiLCJkaXNwb3NlIiwiY2xlYXIiLCJXb3JrZXJNYW5hZ2VyIiwicmVzZXQiLCJmbHVzaCIsImNvbnN1bWVTdGF0dXNCYXIiLCJjb25zdW1lUmVwb3J0ZXIiLCJyZXBvcnRlciIsInNldFJlcG9ydGVyIiwiY3JlYXRlR2l0VGltaW5nc1ZpZXciLCJTdHViSXRlbSIsImNyZWF0ZSIsInRpdGxlIiwiR2l0VGltaW5nc1ZpZXciLCJidWlsZFVSSSIsImNyZWF0ZUlzc3VlaXNoUGFuZUl0ZW1TdHViIiwidXJpIiwic2VsZWN0ZWRUYWIiLCJpbml0U2VsZWN0ZWRUYWIiLCJjcmVhdGVEb2NrSXRlbVN0dWIiLCJpdGVtIiwiY3JlYXRlR2l0U3R1YiIsImdpdFRhYlN0dWJJdGVtIiwiY3JlYXRlR2l0SHViU3R1YiIsImdpdGh1YlRhYlN0dWJJdGVtIiwiRXJyb3IiLCJjcmVhdGVGaWxlUGF0Y2hDb250cm9sbGVyU3R1YiIsImNyZWF0ZUNvbW1pdFByZXZpZXdTdHViIiwiY3JlYXRlQ29tbWl0RGV0YWlsU3R1YiIsImNyZWF0ZVJldmlld3NTdHViIiwiZGVzdHJveUdpdFRhYkl0ZW0iLCJkZXN0cm95R2l0aHViVGFiSXRlbSIsImdldFJlcG9zaXRvcnlGb3JXb3JrZGlyIiwibG9hZGluZ0d1ZXNzUmVwbyIsImxvYWRpbmdHdWVzcyIsImdldFJlc29sdXRpb25Qcm9ncmVzcyIsImdldENvbnRleHRQb29sIiwiZ2V0U3dpdGNoYm9hcmQiLCJvcHRpb25zIiwiZGlkU2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlIiwicHVzaCIsInVwZGF0ZUFjdGl2ZUNvbnRleHQiLCJiaW5kIiwicGFyYWxsZWwiLCJnZXROZXh0Q29udGV4dCIsIndvcmtkaXJGb3JOb25HaXRQYXRoIiwic291cmNlUGF0aCIsImNvbnRhaW5pbmdSb290IiwiZ2V0RGlyZWN0b3JpZXMiLCJmaW5kIiwicm9vdCIsImdldFBhdGgiLCJzdGF0IiwiaXNEaXJlY3RvcnkiLCJkaXJuYW1lIiwid29ya2RpckZvclBhdGgiLCJQcm9taXNlIiwiYWxsIiwiY2FuZGlkYXRlUGF0aHMiLCJTZXQiLCJsb2NrZWRSZXBvIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJhY3RpdmVJdGVtUGF0aCIsImFjdGl2ZUl0ZW1Xb3JrZGlyIiwiZmlyc3RQcm9qZWN0V29ya2RpciIsIndvcmtkaXJzIiwiQXJyYXkiLCJmcm9tIiwiY2FuZGlkYXRlUGF0aCIsIndvcmtkaXIiLCJzZXQiLCJ1c2VXb3JrZGlyIiwic3RhdGVDb250ZXh0IiwiaXNVbmRldGVybWluZWQiLCJuZXh0QWN0aXZlQ29udGV4dCIsImRpZEZpbmlzaENvbnRleHRDaGFuZ2VSZW5kZXIiLCJkaWRGaW5pc2hBY3RpdmVDb250ZXh0VXBkYXRlIiwiZGlkQmVnaW5BY3RpdmVDb250ZXh0VXBkYXRlIiwiZGlyZWN0b3J5IiwiZ2V0RGlyZWN0b3J5Rm9yUHJvamVjdFBhdGgiLCJhdG9tR2l0UmVwbyIsInJlcG9zaXRvcnlGb3JEaXJlY3RvcnkiLCJyZWZyZXNoU3RhdHVzIiwicGFuZUl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsVUFBVSxFQUFFLElBRE87QUFFbkJDLEVBQUFBLG9CQUFvQixFQUFFLElBRkg7QUFHbkJDLEVBQUFBLGFBQWEsRUFBRTtBQUhJLENBQXJCOztBQU1lLE1BQU1DLGFBQU4sQ0FBb0I7QUFDakNDLEVBQUFBLFdBQVcsQ0FBQztBQUNWQyxJQUFBQSxTQURVO0FBQ0NDLElBQUFBLE9BREQ7QUFDVUMsSUFBQUEsUUFEVjtBQUNvQkMsSUFBQUEsbUJBRHBCO0FBQ3lDQyxJQUFBQSxRQUR6QztBQUNtREMsSUFBQUEsTUFEbkQ7QUFDMkRDLElBQUFBLFFBRDNEO0FBRVZDLElBQUFBLE9BRlU7QUFFREMsSUFBQUEsTUFGQztBQUVPQyxJQUFBQSxhQUZQO0FBR1ZDLElBQUFBLE9BSFU7QUFHREMsSUFBQUEsZUFIQztBQUdnQkMsSUFBQUEsYUFIaEI7QUFJVkMsSUFBQUEsYUFKVTtBQUtWQyxJQUFBQSxRQUxVO0FBS0FDLElBQUFBO0FBTEEsR0FBRCxFQU1SO0FBQUEsd0RBbU4wQixNQUFNO0FBQ2pDLFVBQUksS0FBS0MsYUFBVCxFQUF3QjtBQUN0QjtBQUNEOztBQUVELFlBQU1DLFFBQVEsR0FBR0MsZUFBZSxDQUFDLEtBQUtsQixTQUFMLENBQWVtQixT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QW1DO0FBQ2pDLE1BQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2IsV0FBTyxJQUFQO0FBQ0QsR0FIZ0MsQ0FLakM7OztBQUNBLE1BQUksT0FBT0EsUUFBUSxDQUFDM0osbUJBQWhCLEtBQXdDLFVBQTVDLEVBQXdEO0FBQ3RELFdBQU8ySixRQUFRLENBQUMzSixtQkFBVCxFQUFQO0FBQ0QsR0FSZ0MsQ0FVakM7OztBQUNBLE1BQUksT0FBTzJKLFFBQVEsQ0FBQ2hDLE9BQWhCLEtBQTRCLFVBQWhDLEVBQTRDO0FBQzFDLFdBQU9nQyxRQUFRLENBQUNoQyxPQUFULEVBQVA7QUFDRCxHQWJnQyxDQWVqQzs7O0FBQ0EsU0FBTyxJQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERvbSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQge2ZpbGVFeGlzdHMsIGF1dG9iaW5kfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IFdvcmtkaXJDYWNoZSBmcm9tICcuL21vZGVscy93b3JrZGlyLWNhY2hlJztcbmltcG9ydCBXb3JrZGlyQ29udGV4dCBmcm9tICcuL21vZGVscy93b3JrZGlyLWNvbnRleHQnO1xuaW1wb3J0IFdvcmtkaXJDb250ZXh0UG9vbCBmcm9tICcuL21vZGVscy93b3JrZGlyLWNvbnRleHQtcG9vbCc7XG5pbXBvcnQgUmVwb3NpdG9yeSBmcm9tICcuL21vZGVscy9yZXBvc2l0b3J5JztcbmltcG9ydCBTdHlsZUNhbGN1bGF0b3IgZnJvbSAnLi9tb2RlbHMvc3R5bGUtY2FsY3VsYXRvcic7XG5pbXBvcnQgR2l0aHViTG9naW5Nb2RlbCBmcm9tICcuL21vZGVscy9naXRodWItbG9naW4tbW9kZWwnO1xuaW1wb3J0IFJvb3RDb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlcnMvcm9vdC1jb250cm9sbGVyJztcbmltcG9ydCBTdHViSXRlbSBmcm9tICcuL2l0ZW1zL3N0dWItaXRlbSc7XG5pbXBvcnQgU3dpdGNoYm9hcmQgZnJvbSAnLi9zd2l0Y2hib2FyZCc7XG5pbXBvcnQgeWFyZHN0aWNrIGZyb20gJy4veWFyZHN0aWNrJztcbmltcG9ydCBHaXRUaW1pbmdzVmlldyBmcm9tICcuL3ZpZXdzL2dpdC10aW1pbmdzLXZpZXcnO1xuaW1wb3J0IENvbnRleHRNZW51SW50ZXJjZXB0b3IgZnJvbSAnLi9jb250ZXh0LW1lbnUtaW50ZXJjZXB0b3InO1xuaW1wb3J0IEFzeW5jUXVldWUgZnJvbSAnLi9hc3luYy1xdWV1ZSc7XG5pbXBvcnQgV29ya2VyTWFuYWdlciBmcm9tICcuL3dvcmtlci1tYW5hZ2VyJztcbmltcG9ydCBnZXRSZXBvUGlwZWxpbmVNYW5hZ2VyIGZyb20gJy4vZ2V0LXJlcG8tcGlwZWxpbmUtbWFuYWdlcic7XG5pbXBvcnQge3JlcG9ydGVyUHJveHl9IGZyb20gJy4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gIG5ld1Byb2plY3Q6IHRydWUsXG4gIGFjdGl2ZVJlcG9zaXRvcnlQYXRoOiBudWxsLFxuICBjb250ZXh0TG9ja2VkOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YlBhY2thZ2Uge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgd29ya3NwYWNlLCBwcm9qZWN0LCBjb21tYW5kcywgbm90aWZpY2F0aW9uTWFuYWdlciwgdG9vbHRpcHMsIHN0eWxlcywgZ3JhbW1hcnMsXG4gICAga2V5bWFwcywgY29uZmlnLCBkZXNlcmlhbGl6ZXJzLFxuICAgIGNvbmZpcm0sIGdldExvYWRTZXR0aW5ncywgY3VycmVudFdpbmRvdyxcbiAgICBjb25maWdEaXJQYXRoLFxuICAgIHJlbmRlckZuLCBsb2dpbk1vZGVsLFxuICB9KSB7XG4gICAgYXV0b2JpbmQoXG4gICAgICB0aGlzLFxuICAgICAgJ2NvbnN1bWVTdGF0dXNCYXInLCAnY3JlYXRlR2l0VGltaW5nc1ZpZXcnLCAnY3JlYXRlSXNzdWVpc2hQYW5lSXRlbVN0dWInLCAnY3JlYXRlRG9ja0l0ZW1TdHViJyxcbiAgICAgICdjcmVhdGVGaWxlUGF0Y2hDb250cm9sbGVyU3R1YicsICdkZXN0cm95R2l0VGFiSXRlbScsICdkZXN0cm95R2l0aHViVGFiSXRlbScsXG4gICAgICAnZ2V0UmVwb3NpdG9yeUZvcldvcmtkaXInLCAnc2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlJyxcbiAgICApO1xuXG4gICAgdGhpcy53b3Jrc3BhY2UgPSB3b3Jrc3BhY2U7XG4gICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcbiAgICB0aGlzLmNvbW1hbmRzID0gY29tbWFuZHM7XG4gICAgdGhpcy5kZXNlcmlhbGl6ZXJzID0gZGVzZXJpYWxpemVycztcbiAgICB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIgPSBub3RpZmljYXRpb25NYW5hZ2VyO1xuICAgIHRoaXMudG9vbHRpcHMgPSB0b29sdGlwcztcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnN0eWxlcyA9IHN0eWxlcztcbiAgICB0aGlzLmdyYW1tYXJzID0gZ3JhbW1hcnM7XG4gICAgdGhpcy5rZXltYXBzID0ga2V5bWFwcztcbiAgICB0aGlzLmNvbmZpZ1BhdGggPSBwYXRoLmpvaW4oY29uZmlnRGlyUGF0aCwgJ2dpdGh1Yi5jc29uJyk7XG4gICAgdGhpcy5jdXJyZW50V2luZG93ID0gY3VycmVudFdpbmRvdztcblxuICAgIHRoaXMuc3R5bGVDYWxjdWxhdG9yID0gbmV3IFN0eWxlQ2FsY3VsYXRvcih0aGlzLnN0eWxlcywgdGhpcy5jb25maWcpO1xuICAgIHRoaXMuY29uZmlybSA9IGNvbmZpcm07XG4gICAgdGhpcy5zdGFydE9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLmFjdGl2YXRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3JpdGVyaWEgPSB7XG4gICAgICBwcm9qZWN0UGF0aENvdW50OiB0aGlzLnByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGgsXG4gICAgICBpbml0UGF0aENvdW50OiAoZ2V0TG9hZFNldHRpbmdzKCkuaW5pdGlhbFBhdGhzIHx8IFtdKS5sZW5ndGgsXG4gICAgfTtcblxuICAgIHRoaXMucGlwZWxpbmVNYW5hZ2VyID0gZ2V0UmVwb1BpcGVsaW5lTWFuYWdlcih7Y29uZmlybSwgbm90aWZpY2F0aW9uTWFuYWdlciwgd29ya3NwYWNlfSk7XG5cbiAgICB0aGlzLmFjdGl2ZUNvbnRleHRRdWV1ZSA9IG5ldyBBc3luY1F1ZXVlKCk7XG4gICAgdGhpcy5ndWVzc2VkQ29udGV4dCA9IFdvcmtkaXJDb250ZXh0Lmd1ZXNzKGNyaXRlcmlhLCB0aGlzLnBpcGVsaW5lTWFuYWdlcik7XG4gICAgdGhpcy5hY3RpdmVDb250ZXh0ID0gdGhpcy5ndWVzc2VkQ29udGV4dDtcbiAgICB0aGlzLmxvY2tlZENvbnRleHQgPSBudWxsO1xuICAgIHRoaXMud29ya2RpckNhY2hlID0gbmV3IFdvcmtkaXJDYWNoZSgpO1xuICAgIHRoaXMuY29udGV4dFBvb2wgPSBuZXcgV29ya2RpckNvbnRleHRQb29sKHtcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdvcmtzcGFjZSxcbiAgICAgIHByb21wdENhbGxiYWNrOiBxdWVyeSA9PiB0aGlzLmNvbnRyb2xsZXIub3BlbkNyZWRlbnRpYWxzRGlhbG9nKHF1ZXJ5KSxcbiAgICAgIHBpcGVsaW5lTWFuYWdlcjogdGhpcy5waXBlbGluZU1hbmFnZXIsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN3aXRjaGJvYXJkID0gbmV3IFN3aXRjaGJvYXJkKCk7XG5cbiAgICB0aGlzLmxvZ2luTW9kZWwgPSBsb2dpbk1vZGVsIHx8IG5ldyBHaXRodWJMb2dpbk1vZGVsKCk7XG4gICAgdGhpcy5yZW5kZXJGbiA9IHJlbmRlckZuIHx8ICgoY29tcG9uZW50LCBub2RlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgcmV0dXJuIFJlYWN0RG9tLnJlbmRlcihjb21wb25lbnQsIG5vZGUsIGNhbGxiYWNrKTtcbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSBldmVudHMgZnJvbSBhbGwgcmVzaWRlbnQgY29udGV4dHMuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLmNvbnRleHRQb29sLm9uRGlkQ2hhbmdlV29ya2Rpck9ySGVhZChjb250ZXh0ID0+IHtcbiAgICAgICAgdGhpcy5yZWZyZXNoQXRvbUdpdFJlcG9zaXRvcnkoY29udGV4dC5nZXRXb3JraW5nRGlyZWN0b3J5KCkpO1xuICAgICAgfSksXG4gICAgICB0aGlzLmNvbnRleHRQb29sLm9uRGlkVXBkYXRlUmVwb3NpdG9yeShjb250ZXh0ID0+IHtcbiAgICAgICAgdGhpcy5zd2l0Y2hib2FyZC5kaWRVcGRhdGVSZXBvc2l0b3J5KGNvbnRleHQuZ2V0UmVwb3NpdG9yeSgpKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5jb250ZXh0UG9vbC5vbkRpZERlc3Ryb3lSZXBvc2l0b3J5KGNvbnRleHQgPT4ge1xuICAgICAgICBpZiAoY29udGV4dCA9PT0gdGhpcy5hY3RpdmVDb250ZXh0KSB7XG4gICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb250ZXh0KFdvcmtkaXJDb250ZXh0LmFic2VudCh7cGlwZWxpbmVNYW5hZ2VyOiB0aGlzLnBpcGVsaW5lTWFuYWdlcn0pKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBDb250ZXh0TWVudUludGVyY2VwdG9yLFxuICAgICk7XG5cbiAgICB0aGlzLnNldHVwWWFyZHN0aWNrKCk7XG4gIH1cblxuICBzZXR1cFlhcmRzdGljaygpIHtcbiAgICBjb25zdCBzdGFnaW5nU2VyaWVzID0gWydzdGFnZUxpbmUnLCAnc3RhZ2VIdW5rJywgJ3Vuc3RhZ2VMaW5lJywgJ3Vuc3RhZ2VIdW5rJ107XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgLy8gU3RhZ2luZyBhbmQgdW5zdGFnaW5nIG9wZXJhdGlvbnNcbiAgICAgIHRoaXMuc3dpdGNoYm9hcmQub25EaWRCZWdpblN0YWdlT3BlcmF0aW9uKHBheWxvYWQgPT4ge1xuICAgICAgICBpZiAocGF5bG9hZC5zdGFnZSAmJiBwYXlsb2FkLmxpbmUpIHtcbiAgICAgICAgICB5YXJkc3RpY2suYmVnaW4oJ3N0YWdlTGluZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHBheWxvYWQuc3RhZ2UgJiYgcGF5bG9hZC5odW5rKSB7XG4gICAgICAgICAgeWFyZHN0aWNrLmJlZ2luKCdzdGFnZUh1bmsnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXlsb2FkLnN0YWdlICYmIHBheWxvYWQuZmlsZSkge1xuICAgICAgICAgIHlhcmRzdGljay5iZWdpbignc3RhZ2VGaWxlJyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGF5bG9hZC5zdGFnZSAmJiBwYXlsb2FkLm1vZGUpIHtcbiAgICAgICAgICB5YXJkc3RpY2suYmVnaW4oJ3N0YWdlTW9kZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHBheWxvYWQuc3RhZ2UgJiYgcGF5bG9hZC5zeW1saW5rKSB7XG4gICAgICAgICAgeWFyZHN0aWNrLmJlZ2luKCdzdGFnZVN5bWxpbmsnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXlsb2FkLnVuc3RhZ2UgJiYgcGF5bG9hZC5saW5lKSB7XG4gICAgICAgICAgeWFyZHN0aWNrLmJlZ2luKCd1bnN0YWdlTGluZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHBheWxvYWQudW5zdGFnZSAmJiBwYXlsb2FkLmh1bmspIHtcbiAgICAgICAgICB5YXJkc3RpY2suYmVnaW4oJ3Vuc3RhZ2VIdW5rJyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGF5bG9hZC51bnN0YWdlICYmIHBheWxvYWQuZmlsZSkge1xuICAgICAgICAgIHlhcmRzdGljay5iZWdpbigndW5zdGFnZUZpbGUnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXlsb2FkLnVuc3RhZ2UgJiYgcGF5bG9hZC5tb2RlKSB7XG4gICAgICAgICAgeWFyZHN0aWNrLmJlZ2luKCd1bnN0YWdlTW9kZScpO1xuICAgICAgICB9IGVsc2UgaWYgKHBheWxvYWQudW5zdGFnZSAmJiBwYXlsb2FkLnN5bWxpbmspIHtcbiAgICAgICAgICB5YXJkc3RpY2suYmVnaW4oJ3Vuc3RhZ2VTeW1saW5rJyk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5zd2l0Y2hib2FyZC5vbkRpZFVwZGF0ZVJlcG9zaXRvcnkoKCkgPT4ge1xuICAgICAgICB5YXJkc3RpY2subWFyayhzdGFnaW5nU2VyaWVzLCAndXBkYXRlLXJlcG9zaXRvcnknKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5zd2l0Y2hib2FyZC5vbkRpZEZpbmlzaFJlbmRlcihjb250ZXh0ID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQgPT09ICdSb290Q29udHJvbGxlci5zaG93RmlsZVBhdGNoRm9yUGF0aCcpIHtcbiAgICAgICAgICB5YXJkc3RpY2suZmluaXNoKHN0YWdpbmdTZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9KSxcblxuICAgICAgLy8gQWN0aXZlIGNvbnRleHQgY2hhbmdlc1xuICAgICAgdGhpcy5zd2l0Y2hib2FyZC5vbkRpZFNjaGVkdWxlQWN0aXZlQ29udGV4dFVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIHlhcmRzdGljay5iZWdpbignYWN0aXZlQ29udGV4dENoYW5nZScpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnN3aXRjaGJvYXJkLm9uRGlkQmVnaW5BY3RpdmVDb250ZXh0VXBkYXRlKCgpID0+IHtcbiAgICAgICAgeWFyZHN0aWNrLm1hcmsoJ2FjdGl2ZUNvbnRleHRDaGFuZ2UnLCAncXVldWUtd2FpdCcpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnN3aXRjaGJvYXJkLm9uRGlkRmluaXNoQ29udGV4dENoYW5nZVJlbmRlcigoKSA9PiB7XG4gICAgICAgIHlhcmRzdGljay5tYXJrKCdhY3RpdmVDb250ZXh0Q2hhbmdlJywgJ3JlbmRlcicpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnN3aXRjaGJvYXJkLm9uRGlkRmluaXNoQWN0aXZlQ29udGV4dFVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIHlhcmRzdGljay5maW5pc2goJ2FjdGl2ZUNvbnRleHRDaGFuZ2UnKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZShzdGF0ZSA9IHt9KSB7XG4gICAgY29uc3Qgc2F2ZWRTdGF0ZSA9IHsuLi5kZWZhdWx0U3RhdGUsIC4uLnN0YXRlfTtcblxuICAgIGNvbnN0IGZpcnN0UnVuID0gIWF3YWl0IGZpbGVFeGlzdHModGhpcy5jb25maWdQYXRoKTtcbiAgICBjb25zdCBuZXdQcm9qZWN0ID0gc2F2ZWRTdGF0ZS5maXJzdFJ1biAhPT0gdW5kZWZpbmVkID8gc2F2ZWRTdGF0ZS5maXJzdFJ1biA6IHNhdmVkU3RhdGUubmV3UHJvamVjdDtcblxuICAgIHRoaXMuc3RhcnRPcGVuID0gZmlyc3RSdW4gfHwgbmV3UHJvamVjdDtcbiAgICB0aGlzLnN0YXJ0UmV2ZWFsZWQgPSBmaXJzdFJ1biAmJiAhdGhpcy5jb25maWcuZ2V0KCd3ZWxjb21lLnNob3dPblN0YXJ0dXAnKTtcblxuICAgIGlmIChmaXJzdFJ1bikge1xuICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKHRoaXMuY29uZmlnUGF0aCwgJyMgU3RvcmUgbm9uLXZpc2libGUgR2l0SHViIHBhY2thZ2Ugc3RhdGUuXFxuJywge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYXNTZWxlY3RlZEZpbGVzID0gZXZlbnQgPT4ge1xuICAgICAgcmV0dXJuICEhZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5naXRodWItRmlsZVBhdGNoTGlzdFZpZXcnKS5xdWVyeVNlbGVjdG9yKCcuaXMtc2VsZWN0ZWQnKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMud29ya3NwYWNlLmdldENlbnRlcigpLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0odGhpcy5oYW5kbGVBY3RpdmVQYW5lSXRlbUNoYW5nZSksXG4gICAgICB0aGlzLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyh0aGlzLmhhbmRsZVByb2plY3RQYXRoc0NoYW5nZSksXG4gICAgICB0aGlzLnN0eWxlQ2FsY3VsYXRvci5zdGFydFdhdGNoaW5nKFxuICAgICAgICAnZ2l0aHViLXBhY2thZ2Utc3R5bGVzJyxcbiAgICAgICAgWydlZGl0b3IuZm9udFNpemUnLCAnZWRpdG9yLmZvbnRGYW1pbHknLCAnZWRpdG9yLmxpbmVIZWlnaHQnLCAnZWRpdG9yLnRhYkxlbmd0aCddLFxuICAgICAgICBjb25maWcgPT4gYFxuICAgICAgICAgIC5naXRodWItSHVua1ZpZXctbGluZSB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogJHtjb25maWcuZ2V0KCdlZGl0b3IuZm9udEZhbWlseScpfTtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAke2NvbmZpZy5nZXQoJ2VkaXRvci5saW5lSGVpZ2h0Jyl9O1xuICAgICAgICAgICAgdGFiLXNpemU6ICR7Y29uZmlnLmdldCgnZWRpdG9yLnRhYkxlbmd0aCcpfVxuICAgICAgICAgIH1cbiAgICAgICAgYCxcbiAgICAgICksXG4gICAgICBhdG9tLmNvbnRleHRNZW51LmFkZCh7XG4gICAgICAgICcuZ2l0aHViLVVuc3RhZ2VkQ2hhbmdlcyAuZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnU3RhZ2UnLFxuICAgICAgICAgICAgY29tbWFuZDogJ2NvcmU6Y29uZmlybScsXG4gICAgICAgICAgICBzaG91bGREaXNwbGF5OiBoYXNTZWxlY3RlZEZpbGVzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3NlcGFyYXRvcicsXG4gICAgICAgICAgICBzaG91bGREaXNwbGF5OiBoYXNTZWxlY3RlZEZpbGVzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEaXNjYXJkIENoYW5nZXMnLFxuICAgICAgICAgICAgY29tbWFuZDogJ2dpdGh1YjpkaXNjYXJkLWNoYW5nZXMtaW4tc2VsZWN0ZWQtZmlsZXMnLFxuICAgICAgICAgICAgc2hvdWxkRGlzcGxheTogaGFzU2VsZWN0ZWRGaWxlcyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnLmdpdGh1Yi1TdGFnZWRDaGFuZ2VzIC5naXRodWItRmlsZVBhdGNoTGlzdFZpZXcnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdVbnN0YWdlJyxcbiAgICAgICAgICAgIGNvbW1hbmQ6ICdjb3JlOmNvbmZpcm0nLFxuICAgICAgICAgICAgc2hvdWxkRGlzcGxheTogaGFzU2VsZWN0ZWRGaWxlcyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnLmdpdGh1Yi1NZXJnZUNvbmZsaWN0UGF0aHMgLmdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1N0YWdlJyxcbiAgICAgICAgICAgIGNvbW1hbmQ6ICdjb3JlOmNvbmZpcm0nLFxuICAgICAgICAgICAgc2hvdWxkRGlzcGxheTogaGFzU2VsZWN0ZWRGaWxlcyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdzZXBhcmF0b3InLFxuICAgICAgICAgICAgc2hvdWxkRGlzcGxheTogaGFzU2VsZWN0ZWRGaWxlcyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVzb2x2ZSBGaWxlIEFzIE91cnMnLFxuICAgICAgICAgICAgY29tbWFuZDogJ2dpdGh1YjpyZXNvbHZlLWZpbGUtYXMtb3VycycsXG4gICAgICAgICAgICBzaG91bGREaXNwbGF5OiBoYXNTZWxlY3RlZEZpbGVzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdSZXNvbHZlIEZpbGUgQXMgVGhlaXJzJyxcbiAgICAgICAgICAgIGNvbW1hbmQ6ICdnaXRodWI6cmVzb2x2ZS1maWxlLWFzLXRoZWlycycsXG4gICAgICAgICAgICBzaG91bGREaXNwbGF5OiBoYXNTZWxlY3RlZEZpbGVzLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgdGhpcy5hY3RpdmF0ZWQgPSB0cnVlO1xuICAgIHRoaXMuc2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlKHtcbiAgICAgIHVzZVBhdGg6IHNhdmVkU3RhdGUuYWN0aXZlUmVwb3NpdG9yeVBhdGgsXG4gICAgICBsb2NrOiBzYXZlZFN0YXRlLmNvbnRleHRMb2NrZWQsXG4gICAgfSk7XG4gICAgdGhpcy5yZXJlbmRlcigpO1xuICB9XG5cbiAgaGFuZGxlQWN0aXZlUGFuZUl0ZW1DaGFuZ2UgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMubG9ja2VkQ29udGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1QYXRoID0gcGF0aEZvclBhbmVJdGVtKHRoaXMud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmVJdGVtKCkpO1xuICAgIHRoaXMuc2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlKHtcbiAgICAgIHVzZVBhdGg6IGl0ZW1QYXRoLFxuICAgICAgbG9jazogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVQcm9qZWN0UGF0aHNDaGFuZ2UgPSAoKSA9PiB7XG4gICAgdGhpcy5zY2hlZHVsZUFjdGl2ZUNvbnRleHRVcGRhdGUoKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aXZlUmVwb3NpdG9yeVBhdGg6IHRoaXMuZ2V0QWN0aXZlV29ya2RpcigpLFxuICAgICAgY29udGV4dExvY2tlZDogQm9vbGVhbih0aGlzLmxvY2tlZENvbnRleHQpLFxuICAgICAgbmV3UHJvamVjdDogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHJlcmVuZGVyKGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIFJlYWN0RG9tLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5lbGVtZW50KTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudDtcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5ID0gd29ya2luZ0RpcmVjdG9yeSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZUFjdGl2ZUNvbnRleHRVcGRhdGUoe3VzZVBhdGg6IHdvcmtpbmdEaXJlY3Rvcnl9KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0Q29udGV4dExvY2sgPSAod29ya2luZ0RpcmVjdG9yeSwgbG9jaykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlKHt1c2VQYXRoOiB3b3JraW5nRGlyZWN0b3J5LCBsb2NrfSk7XG4gICAgfTtcblxuICAgIHRoaXMucmVuZGVyRm4oXG4gICAgICA8Um9vdENvbnRyb2xsZXJcbiAgICAgICAgcmVmPXtjID0+IHsgdGhpcy5jb250cm9sbGVyID0gYzsgfX1cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLndvcmtzcGFjZX1cbiAgICAgICAgZGVzZXJpYWxpemVycz17dGhpcy5kZXNlcmlhbGl6ZXJzfVxuICAgICAgICBjb21tYW5kcz17dGhpcy5jb21tYW5kc31cbiAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcj17dGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyfVxuICAgICAgICB0b29sdGlwcz17dGhpcy50b29sdGlwc31cbiAgICAgICAgZ3JhbW1hcnM9e3RoaXMuZ3JhbW1hcnN9XG4gICAgICAgIGtleW1hcHM9e3RoaXMua2V5bWFwc31cbiAgICAgICAgY29uZmlnPXt0aGlzLmNvbmZpZ31cbiAgICAgICAgcHJvamVjdD17dGhpcy5wcm9qZWN0fVxuICAgICAgICBjb25maXJtPXt0aGlzLmNvbmZpcm19XG4gICAgICAgIGN1cnJlbnRXaW5kb3c9e3RoaXMuY3VycmVudFdpbmRvd31cbiAgICAgICAgd29ya2RpckNvbnRleHRQb29sPXt0aGlzLmNvbnRleHRQb29sfVxuICAgICAgICBsb2dpbk1vZGVsPXt0aGlzLmxvZ2luTW9kZWx9XG4gICAgICAgIHJlcG9zaXRvcnk9e3RoaXMuZ2V0QWN0aXZlUmVwb3NpdG9yeSgpfVxuICAgICAgICByZXNvbHV0aW9uUHJvZ3Jlc3M9e3RoaXMuZ2V0QWN0aXZlUmVzb2x1dGlvblByb2dyZXNzKCl9XG4gICAgICAgIHN0YXR1c0Jhcj17dGhpcy5zdGF0dXNCYXJ9XG4gICAgICAgIGluaXRpYWxpemU9e3RoaXMuaW5pdGlhbGl6ZX1cbiAgICAgICAgY2xvbmU9e3RoaXMuY2xvbmV9XG4gICAgICAgIHN3aXRjaGJvYXJkPXt0aGlzLnN3aXRjaGJvYXJkfVxuICAgICAgICBzdGFydE9wZW49e3RoaXMuc3RhcnRPcGVufVxuICAgICAgICBzdGFydFJldmVhbGVkPXt0aGlzLnN0YXJ0UmV2ZWFsZWR9XG4gICAgICAgIHJlbW92ZUZpbGVQYXRjaEl0ZW09e3RoaXMucmVtb3ZlRmlsZVBhdGNoSXRlbX1cbiAgICAgICAgY3VycmVudFdvcmtEaXI9e3RoaXMuZ2V0QWN0aXZlV29ya2RpcigpfVxuICAgICAgICBjb250ZXh0TG9ja2VkPXt0aGlzLmxvY2tlZENvbnRleHQgIT09IG51bGx9XG4gICAgICAgIGNoYW5nZVdvcmtpbmdEaXJlY3Rvcnk9e2NoYW5nZVdvcmtpbmdEaXJlY3Rvcnl9XG4gICAgICAgIHNldENvbnRleHRMb2NrPXtzZXRDb250ZXh0TG9ja31cbiAgICAgIC8+LCB0aGlzLmVsZW1lbnQsIGNhbGxiYWNrLFxuICAgICk7XG4gIH1cblxuICBhc3luYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5jb250ZXh0UG9vbC5jbGVhcigpO1xuICAgIFdvcmtlck1hbmFnZXIucmVzZXQoZmFsc2UpO1xuICAgIGlmICh0aGlzLmd1ZXNzZWRDb250ZXh0KSB7XG4gICAgICB0aGlzLmd1ZXNzZWRDb250ZXh0LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZ3Vlc3NlZENvbnRleHQgPSBudWxsO1xuICAgIH1cbiAgICBhd2FpdCB5YXJkc3RpY2suZmx1c2goKTtcbiAgfVxuXG4gIGNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXIgPSBzdGF0dXNCYXI7XG4gICAgdGhpcy5yZXJlbmRlcigpO1xuICB9XG5cbiAgY29uc3VtZVJlcG9ydGVyKHJlcG9ydGVyKSB7XG4gICAgcmVwb3J0ZXJQcm94eS5zZXRSZXBvcnRlcihyZXBvcnRlcik7XG4gIH1cblxuICBjcmVhdGVHaXRUaW1pbmdzVmlldygpIHtcbiAgICByZXR1cm4gU3R1Ykl0ZW0uY3JlYXRlKCdnaXQtdGltaW5ncy12aWV3Jywge1xuICAgICAgdGl0bGU6ICdHaXRIdWIgUGFja2FnZSBUaW1pbmdzIFZpZXcnLFxuICAgIH0sIEdpdFRpbWluZ3NWaWV3LmJ1aWxkVVJJKCkpO1xuICB9XG5cbiAgY3JlYXRlSXNzdWVpc2hQYW5lSXRlbVN0dWIoe3VyaSwgc2VsZWN0ZWRUYWJ9KSB7XG4gICAgcmV0dXJuIFN0dWJJdGVtLmNyZWF0ZSgnaXNzdWVpc2gtZGV0YWlsLWl0ZW0nLCB7XG4gICAgICB0aXRsZTogJ0lzc3VlaXNoJyxcbiAgICAgIGluaXRTZWxlY3RlZFRhYjogc2VsZWN0ZWRUYWIsXG4gICAgfSwgdXJpKTtcbiAgfVxuXG4gIGNyZWF0ZURvY2tJdGVtU3R1Yih7dXJpfSkge1xuICAgIGxldCBpdGVtO1xuICAgIHN3aXRjaCAodXJpKSB7XG4gICAgLy8gYWx3YXlzIHJldHVybiBhbiBlbXB0eSBzdHViXG4gICAgLy8gYnV0IG9ubHkgc2V0IGl0IGFzIHRoZSBhY3RpdmUgaXRlbSBmb3IgYSB0YWIgdHlwZVxuICAgIC8vIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdFxuICAgIGNhc2UgJ2F0b20tZ2l0aHViOi8vZG9jay1pdGVtL2dpdCc6XG4gICAgICBpdGVtID0gdGhpcy5jcmVhdGVHaXRTdHViKHVyaSk7XG4gICAgICB0aGlzLmdpdFRhYlN0dWJJdGVtID0gdGhpcy5naXRUYWJTdHViSXRlbSB8fCBpdGVtO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYXRvbS1naXRodWI6Ly9kb2NrLWl0ZW0vZ2l0aHViJzpcbiAgICAgIGl0ZW0gPSB0aGlzLmNyZWF0ZUdpdEh1YlN0dWIodXJpKTtcbiAgICAgIHRoaXMuZ2l0aHViVGFiU3R1Ykl0ZW0gPSB0aGlzLmdpdGh1YlRhYlN0dWJJdGVtIHx8IGl0ZW07XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIERvY2tJdGVtIHN0dWIgVVJJOiAke3VyaX1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnJlcmVuZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgY3JlYXRlR2l0U3R1Yih1cmkpIHtcbiAgICByZXR1cm4gU3R1Ykl0ZW0uY3JlYXRlKCdnaXQnLCB7XG4gICAgICB0aXRsZTogJ0dpdCcsXG4gICAgfSwgdXJpKTtcbiAgfVxuXG4gIGNyZWF0ZUdpdEh1YlN0dWIodXJpKSB7XG4gICAgcmV0dXJuIFN0dWJJdGVtLmNyZWF0ZSgnZ2l0aHViJywge1xuICAgICAgdGl0bGU6ICdHaXRIdWInLFxuICAgIH0sIHVyaSk7XG4gIH1cblxuICBjcmVhdGVGaWxlUGF0Y2hDb250cm9sbGVyU3R1Yih7dXJpfSA9IHt9KSB7XG4gICAgY29uc3QgaXRlbSA9IFN0dWJJdGVtLmNyZWF0ZSgnZ2l0LWZpbGUtcGF0Y2gtY29udHJvbGxlcicsIHtcbiAgICAgIHRpdGxlOiAnRGlmZicsXG4gICAgfSwgdXJpKTtcbiAgICBpZiAodGhpcy5jb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnJlcmVuZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgY3JlYXRlQ29tbWl0UHJldmlld1N0dWIoe3VyaX0pIHtcbiAgICBjb25zdCBpdGVtID0gU3R1Ykl0ZW0uY3JlYXRlKCdnaXQtY29tbWl0LXByZXZpZXcnLCB7XG4gICAgICB0aXRsZTogJ0NvbW1pdCBwcmV2aWV3JyxcbiAgICB9LCB1cmkpO1xuICAgIGlmICh0aGlzLmNvbnRyb2xsZXIpIHtcbiAgICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBjcmVhdGVDb21taXREZXRhaWxTdHViKHt1cml9KSB7XG4gICAgY29uc3QgaXRlbSA9IFN0dWJJdGVtLmNyZWF0ZSgnZ2l0LWNvbW1pdC1kZXRhaWwnLCB7XG4gICAgICB0aXRsZTogJ0NvbW1pdCcsXG4gICAgfSwgdXJpKTtcbiAgICBpZiAodGhpcy5jb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnJlcmVuZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgY3JlYXRlUmV2aWV3c1N0dWIoe3VyaX0pIHtcbiAgICBjb25zdCBpdGVtID0gU3R1Ykl0ZW0uY3JlYXRlKCdnaXRodWItcmV2aWV3cycsIHtcbiAgICAgIHRpdGxlOiAnUmV2aWV3cycsXG4gICAgfSwgdXJpKTtcbiAgICBpZiAodGhpcy5jb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnJlcmVuZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgZGVzdHJveUdpdFRhYkl0ZW0oKSB7XG4gICAgaWYgKHRoaXMuZ2l0VGFiU3R1Ykl0ZW0pIHtcbiAgICAgIHRoaXMuZ2l0VGFiU3R1Ykl0ZW0uZGVzdHJveSgpO1xuICAgICAgdGhpcy5naXRUYWJTdHViSXRlbSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5jb250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95R2l0aHViVGFiSXRlbSgpIHtcbiAgICBpZiAodGhpcy5naXRodWJUYWJTdHViSXRlbSkge1xuICAgICAgdGhpcy5naXRodWJUYWJTdHViSXRlbS5kZXN0cm95KCk7XG4gICAgICB0aGlzLmdpdGh1YlRhYlN0dWJJdGVtID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5yZXJlbmRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemUgPSBhc3luYyBwcm9qZWN0UGF0aCA9PiB7XG4gICAgYXdhaXQgZnMubWtkaXJzKHByb2plY3RQYXRoKTtcblxuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSB0aGlzLmNvbnRleHRQb29sLmFkZChwcm9qZWN0UGF0aCkuZ2V0UmVwb3NpdG9yeSgpO1xuICAgIGF3YWl0IHJlcG9zaXRvcnkuaW5pdCgpO1xuICAgIHRoaXMud29ya2RpckNhY2hlLmludmFsaWRhdGUoKTtcblxuICAgIGlmICghdGhpcy5wcm9qZWN0LmNvbnRhaW5zKHByb2plY3RQYXRoKSkge1xuICAgICAgdGhpcy5wcm9qZWN0LmFkZFBhdGgocHJvamVjdFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMucmVmcmVzaEF0b21HaXRSZXBvc2l0b3J5KHByb2plY3RQYXRoKTtcbiAgICBhd2FpdCB0aGlzLnNjaGVkdWxlQWN0aXZlQ29udGV4dFVwZGF0ZSgpO1xuICB9XG5cbiAgY2xvbmUgPSBhc3luYyAocmVtb3RlVXJsLCBwcm9qZWN0UGF0aCwgc291cmNlUmVtb3RlTmFtZSA9ICdvcmlnaW4nKSA9PiB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dFBvb2wuZ2V0Q29udGV4dChwcm9qZWN0UGF0aCk7XG4gICAgbGV0IHJlcG9zaXRvcnk7XG4gICAgaWYgKGNvbnRleHQuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJlcG9zaXRvcnkgPSBjb250ZXh0LmdldFJlcG9zaXRvcnkoKTtcbiAgICAgIGF3YWl0IHJlcG9zaXRvcnkuY2xvbmUocmVtb3RlVXJsLCBzb3VyY2VSZW1vdGVOYW1lKTtcbiAgICAgIHJlcG9zaXRvcnkuZGVzdHJveSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBvc2l0b3J5ID0gbmV3IFJlcG9zaXRvcnkocHJvamVjdFBhdGgsIG51bGwsIHtwaXBlbGluZU1hbmFnZXI6IHRoaXMucGlwZWxpbmVNYW5hZ2VyfSk7XG4gICAgICBhd2FpdCByZXBvc2l0b3J5LmNsb25lKHJlbW90ZVVybCwgc291cmNlUmVtb3RlTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy53b3JrZGlyQ2FjaGUuaW52YWxpZGF0ZSgpO1xuICAgIHRoaXMucHJvamVjdC5hZGRQYXRoKHByb2plY3RQYXRoKTtcbiAgICBhd2FpdCB0aGlzLnNjaGVkdWxlQWN0aXZlQ29udGV4dFVwZGF0ZSgpO1xuXG4gICAgcmVwb3J0ZXJQcm94eS5hZGRFdmVudCgnY2xvbmUtcmVwb3NpdG9yeScsIHtwcm9qZWN0OiAnZ2l0aHViJ30pO1xuICB9XG5cbiAgZ2V0UmVwb3NpdG9yeUZvcldvcmtkaXIocHJvamVjdFBhdGgpIHtcbiAgICBjb25zdCBsb2FkaW5nR3Vlc3NSZXBvID0gUmVwb3NpdG9yeS5sb2FkaW5nR3Vlc3Moe3BpcGVsaW5lTWFuYWdlcjogdGhpcy5waXBlbGluZU1hbmFnZXJ9KTtcbiAgICByZXR1cm4gdGhpcy5ndWVzc2VkQ29udGV4dCA/IGxvYWRpbmdHdWVzc1JlcG8gOiB0aGlzLmNvbnRleHRQb29sLmdldENvbnRleHQocHJvamVjdFBhdGgpLmdldFJlcG9zaXRvcnkoKTtcbiAgfVxuXG4gIGdldEFjdGl2ZVdvcmtkaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlQ29udGV4dC5nZXRXb3JraW5nRGlyZWN0b3J5KCk7XG4gIH1cblxuICBnZXRBY3RpdmVSZXBvc2l0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUNvbnRleHQuZ2V0UmVwb3NpdG9yeSgpO1xuICB9XG5cbiAgZ2V0QWN0aXZlUmVzb2x1dGlvblByb2dyZXNzKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUNvbnRleHQuZ2V0UmVzb2x1dGlvblByb2dyZXNzKCk7XG4gIH1cblxuICBnZXRDb250ZXh0UG9vbCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0UG9vbDtcbiAgfVxuXG4gIGdldFN3aXRjaGJvYXJkKCkge1xuICAgIHJldHVybiB0aGlzLnN3aXRjaGJvYXJkO1xuICB9XG5cbiAgLyoqXG4gICAqIEVucXVldWUgYSByZXF1ZXN0IHRvIG1vZGlmeSB0aGUgYWN0aXZlIGNvbnRleHQuXG4gICAqXG4gICAqIG9wdGlvbnM6XG4gICAqICAgdXNlUGF0aCAtIFBhdGggb2YgdGhlIGNvbnRleHQgdG8gdXNlIGFzIHRoZSBuZXh0IGNvbnRleHQsIGlmIGl0IGlzIHByZXNlbnQgaW4gdGhlIHBvb2wuXG4gICAqICAgbG9jayAtIFRydWUgb3IgZmFsc2UgdG8gbG9jayB0aGUgdWx0aW1hdGVseSBjaG9zZW4gY29udGV4dC4gT21pdCB0byBwcmVzZXJ2ZSB0aGUgY3VycmVudCBsb2NrIHN0YXRlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHJlcXVlc3RlZCBjb250ZXh0IHVwZGF0ZSBoYXMgY29tcGxldGVkLiBOb3RlIHRoYXQgaXQnc1xuICAgKiAqcG9zc2libGUqIGZvciB0aGUgYWN0aXZlIGNvbnRleHQgYWZ0ZXIgcmVzb2x1dGlvbiB0byBkaWZmZXIgZnJvbSBhIHJlcXVlc3RlZCBgdXNlUGF0aGAsIGlmIHRoZSB3b3JrZGlyXG4gICAqIGNvbnRhaW5pbmcgYHVzZVBhdGhgIGlzIG5vIGxvbmdlciBhIHZpYWJsZSBvcHRpb24sIHN1Y2ggYXMgaWYgaXQgYmVsb25ncyB0byBhIHByb2plY3QgdGhhdCBpcyBubyBsb25nZXIgcHJlc2VudC5cbiAgICovXG4gIGFzeW5jIHNjaGVkdWxlQWN0aXZlQ29udGV4dFVwZGF0ZShvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnN3aXRjaGJvYXJkLmRpZFNjaGVkdWxlQWN0aXZlQ29udGV4dFVwZGF0ZSgpO1xuICAgIGF3YWl0IHRoaXMuYWN0aXZlQ29udGV4dFF1ZXVlLnB1c2godGhpcy51cGRhdGVBY3RpdmVDb250ZXh0LmJpbmQodGhpcywgb3B0aW9ucyksIHtwYXJhbGxlbDogZmFsc2V9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXJpdmUgdGhlIGdpdCB3b3JraW5nIGRpcmVjdG9yeSBjb250ZXh0IHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSBwYWNrYWdlJ3MgZ2l0IG9wZXJhdGlvbnMgYmFzZWQgb24gdGhlIGN1cnJlbnRcbiAgICogc3RhdGUgb2YgdGhlIEF0b20gd29ya3NwYWNlLiBJbiBwcmlvcml0eSwgdGhpcyBwcmVmZXJzOlxuICAgKlxuICAgKiAtIFdoZW4gYWN0aXZhdGluZzogdGhlIHdvcmtpbmcgZGlyZWN0b3J5IHRoYXQgd2FzIGFjdGl2ZSB3aGVuIHRoZSBwYWNrYWdlIHdhcyBsYXN0IHNlcmlhbGl6ZWQsIGlmIGl0IHN0aWxsIGEgdmlhYmxlXG4gICAqICAgb3B0aW9uLiAodXNlUGF0aClcbiAgICogLSBUaGUgd29ya2luZyBkaXJlY3RvcnkgY2hvc2VuIGJ5IHRoZSB1c2VyIGZyb20gdGhlIGNvbnRleHQgdGlsZSBvbiB0aGUgZ2l0IG9yIEdpdEh1YiB0YWJzLiAodXNlUGF0aClcbiAgICogLSBUaGUgd29ya2luZyBkaXJlY3RvcnkgY29udGFpbmluZyB0aGUgcGF0aCBvZiB0aGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgICogLSBBIGdpdCB3b3JraW5nIGRpcmVjdG9yeSBjb3JyZXNwb25kaW5nIHRvIFwiZmlyc3RcIiBwcm9qZWN0LCBpZiBhbnkgcHJvamVjdHMgYXJlIG9wZW4uXG4gICAqIC0gVGhlIGN1cnJlbnQgY29udGV4dCwgdW5jaGFuZ2VkLCB3aGljaCBtYXkgYmUgYSBgTnVsbFdvcmtkaXJDb250ZXh0YC5cbiAgICpcbiAgICogRmlyc3QgdXBkYXRlcyB0aGUgcG9vbCBvZiByZXNpZGVudCBjb250ZXh0cyB0byBtYXRjaCBhbGwgZ2l0IHdvcmtpbmcgZGlyZWN0b3JpZXMgdGhhdCBjb3JyZXNwb25kIHRvIG9wZW5cbiAgICogcHJvamVjdHMgYW5kIHBhbmUgaXRlbXMuXG4gICAqL1xuICBhc3luYyBnZXROZXh0Q29udGV4dCh1c2VQYXRoID0gbnVsbCkge1xuICAgIC8vIEludGVybmFsIHV0aWxpdHkgZnVuY3Rpb24gdG8gbm9ybWFsaXplIHBhdGhzIG5vdCBjb250YWluZWQgd2l0aGluIGEgZ2l0XG4gICAgLy8gd29ya2luZyB0cmVlLlxuICAgIGNvbnN0IHdvcmtkaXJGb3JOb25HaXRQYXRoID0gYXN5bmMgc291cmNlUGF0aCA9PiB7XG4gICAgICBjb25zdCBjb250YWluaW5nUm9vdCA9IHRoaXMucHJvamVjdC5nZXREaXJlY3RvcmllcygpLmZpbmQocm9vdCA9PiByb290LmNvbnRhaW5zKHNvdXJjZVBhdGgpKTtcbiAgICAgIGlmIChjb250YWluaW5nUm9vdCkge1xuICAgICAgICByZXR1cm4gY29udGFpbmluZ1Jvb3QuZ2V0UGF0aCgpO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIH0gZWxzZSBpZiAoIShhd2FpdCBmcy5zdGF0KHNvdXJjZVBhdGgpKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmRpcm5hbWUoc291cmNlUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc291cmNlUGF0aDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWwgdXRpbGl0eSBmdW5jdGlvbiB0byBpZGVudGlmeSB0aGUgd29ya2luZyBkaXJlY3RvcnkgdG8gdXNlIGZvclxuICAgIC8vIGFuIGFyYml0cmFyeSAoZmlsZSBvciBkaXJlY3RvcnkpIHBhdGguXG4gICAgY29uc3Qgd29ya2RpckZvclBhdGggPSBhc3luYyBzb3VyY2VQYXRoID0+IHtcbiAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICB0aGlzLndvcmtkaXJDYWNoZS5maW5kKHNvdXJjZVBhdGgpLFxuICAgICAgICB3b3JrZGlyRm9yTm9uR2l0UGF0aChzb3VyY2VQYXRoKSxcbiAgICAgIF0pKS5maW5kKEJvb2xlYW4pO1xuICAgIH07XG5cbiAgICAvLyBJZGVudGlmeSBwYXRocyB0aGF0ICpjb3VsZCogY29udHJpYnV0ZSBhIGdpdCB3b3JraW5nIGRpcmVjdG9yeSB0byB0aGUgcG9vbC4gVGhpcyBpcyBkcmF3biBmcm9tXG4gICAgLy8gdGhlIHJvb3RzIG9mIG9wZW4gcHJvamVjdHMsIHRoZSBjdXJyZW50bHkgbG9ja2VkIGNvbnRleHQgaWYgb25lIGlzIHByZXNlbnQsIGFuZCB0aGUgcGF0aCBvZiB0aGVcbiAgICAvLyBvcGVuIHdvcmtzcGFjZSBpdGVtLlxuICAgIGNvbnN0IGNhbmRpZGF0ZVBhdGhzID0gbmV3IFNldCh0aGlzLnByb2plY3QuZ2V0UGF0aHMoKSk7XG4gICAgaWYgKHRoaXMubG9ja2VkQ29udGV4dCkge1xuICAgICAgY29uc3QgbG9ja2VkUmVwbyA9IHRoaXMubG9ja2VkQ29udGV4dC5nZXRSZXBvc2l0b3J5KCk7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKGxvY2tlZFJlcG8pIHtcbiAgICAgICAgY2FuZGlkYXRlUGF0aHMuYWRkKGxvY2tlZFJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFjdGl2ZUl0ZW1QYXRoID0gcGF0aEZvclBhbmVJdGVtKHRoaXMud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmVJdGVtKCkpO1xuICAgIGlmIChhY3RpdmVJdGVtUGF0aCkge1xuICAgICAgY2FuZGlkYXRlUGF0aHMuYWRkKGFjdGl2ZUl0ZW1QYXRoKTtcbiAgICB9XG5cbiAgICBsZXQgYWN0aXZlSXRlbVdvcmtkaXIgPSBudWxsO1xuICAgIGxldCBmaXJzdFByb2plY3RXb3JrZGlyID0gbnVsbDtcblxuICAgIC8vIENvbnZlcnQgdGhlIGNhbmRpZGF0ZSBwYXRocyBpbnRvIHRoZSBzZXQgb2YgdmlhYmxlIGdpdCB3b3JraW5nIGRpcmVjdG9yaWVzLCBieSBtZWFucyBvZiBhIGNhY2hlZFxuICAgIC8vIGBnaXQgcmV2LXBhcnNlYCBjYWxsLiBDYW5kaWRhdGUgcGF0aHMgdGhhdCBhcmUgbm90IGNvbnRhaW5lZCB3aXRoaW4gYSBnaXQgd29ya2luZyBkaXJlY3Rvcnkgd2lsbFxuICAgIC8vIGJlIHByZXNlcnZlZCBhcy1pcyB3aXRoaW4gdGhlIHBvb2wsIHRvIGFsbG93IHVzZXJzIHRvIGluaXRpYWxpemUgdGhlbS5cbiAgICBjb25zdCB3b3JrZGlycyA9IG5ldyBTZXQoXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgQXJyYXkuZnJvbShjYW5kaWRhdGVQYXRocywgYXN5bmMgY2FuZGlkYXRlUGF0aCA9PiB7XG4gICAgICAgICAgY29uc3Qgd29ya2RpciA9IGF3YWl0IHdvcmtkaXJGb3JQYXRoKGNhbmRpZGF0ZVBhdGgpO1xuXG4gICAgICAgICAgLy8gTm90ZSB0aGUgd29ya2RpcnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGFuZCB0aGUgZmlyc3Qgb3BlbiBwcm9qZWN0IHNvIHdlIGNhblxuICAgICAgICAgIC8vIHByZWZlciB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChjYW5kaWRhdGVQYXRoID09PSBhY3RpdmVJdGVtUGF0aCkge1xuICAgICAgICAgICAgYWN0aXZlSXRlbVdvcmtkaXIgPSB3b3JrZGlyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2FuZGlkYXRlUGF0aCA9PT0gdGhpcy5wcm9qZWN0LmdldFBhdGhzKClbMF0pIHtcbiAgICAgICAgICAgIGZpcnN0UHJvamVjdFdvcmtkaXIgPSB3b3JrZGlyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB3b3JrZGlyO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKTtcblxuICAgIC8vIFVwZGF0ZSBwb29sIHdpdGggdGhlIGlkZW50aWZpZWQgcHJvamVjdHMuXG4gICAgdGhpcy5jb250ZXh0UG9vbC5zZXQod29ya2RpcnMpO1xuXG4gICAgLy8gMSAtIEV4cGxpY2l0bHkgcmVxdWVzdGVkIHdvcmtkaXIuIFRoaXMgaXMgZWl0aGVyIHNlbGVjdGVkIGJ5IHRoZSB1c2VyIGZyb20gYSBjb250ZXh0IHRpbGUgb3JcbiAgICAvLyAgICAgZGVzZXJpYWxpemVkIGZyb20gcGFja2FnZSBzdGF0ZS4gQ2hvb3NlIHRoaXMgY29udGV4dCBvbmx5IGlmIGl0IHN0aWxsIGV4aXN0cyBpbiB0aGUgcG9vbC5cbiAgICBpZiAodXNlUGF0aCkge1xuICAgICAgLy8gTm9ybWFsaXplIHVzZVBhdGggaW4gYSBzaW1pbGFyIGZhc2hpb24gdG8gdGhlIHdheSB3ZSBkbyBhY3RpdmVJdGVtUGF0aC5cbiAgICAgIGxldCB1c2VXb3JrZGlyID0gdXNlUGF0aDtcbiAgICAgIGlmICh1c2VQYXRoID09PSBhY3RpdmVJdGVtUGF0aCkge1xuICAgICAgICB1c2VXb3JrZGlyID0gYWN0aXZlSXRlbVdvcmtkaXI7XG4gICAgICB9IGVsc2UgaWYgKHVzZVBhdGggPT09IHRoaXMucHJvamVjdC5nZXRQYXRocygpWzBdKSB7XG4gICAgICAgIHVzZVdvcmtkaXIgPSBmaXJzdFByb2plY3RXb3JrZGlyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlV29ya2RpciA9IGF3YWl0IHdvcmtkaXJGb3JQYXRoKHVzZVBhdGgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdGF0ZUNvbnRleHQgPSB0aGlzLmNvbnRleHRQb29sLmdldENvbnRleHQodXNlV29ya2Rpcik7XG4gICAgICBpZiAoc3RhdGVDb250ZXh0LmlzUHJlc2VudCgpKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZUNvbnRleHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gMiAtIFVzZSB0aGUgY3VycmVudGx5IGxvY2tlZCBjb250ZXh0LCBpZiBvbmUgaXMgcHJlc2VudC5cbiAgICBpZiAodGhpcy5sb2NrZWRDb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2NrZWRDb250ZXh0O1xuICAgIH1cblxuICAgIC8vIDMgLSBGb2xsb3cgdGhlIGFjdGl2ZSB3b3Jrc3BhY2UgcGFuZSBpdGVtLlxuICAgIGlmIChhY3RpdmVJdGVtV29ya2Rpcikge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dFBvb2wuZ2V0Q29udGV4dChhY3RpdmVJdGVtV29ya2Rpcik7XG4gICAgfVxuXG4gICAgLy8gNCAtIFRoZSBmaXJzdCBvcGVuIHByb2plY3QuXG4gICAgaWYgKGZpcnN0UHJvamVjdFdvcmtkaXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHRQb29sLmdldENvbnRleHQoZmlyc3RQcm9qZWN0V29ya2Rpcik7XG4gICAgfVxuXG4gICAgLy8gTm8gcHJvamVjdHMuIFJldmVydCB0byB0aGUgYWJzZW50IGNvbnRleHQgdW5sZXNzIHdlJ3ZlIGd1ZXNzZWQgdGhhdCBtb3JlIHByb2plY3RzIGFyZSBvbiB0aGUgd2F5LlxuICAgIGlmICh0aGlzLnByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGggPT09IDAgJiYgIXRoaXMuYWN0aXZlQ29udGV4dC5nZXRSZXBvc2l0b3J5KCkuaXNVbmRldGVybWluZWQoKSkge1xuICAgICAgcmV0dXJuIFdvcmtkaXJDb250ZXh0LmFic2VudCh7cGlwZWxpbmVNYW5hZ2VyOiB0aGlzLnBpcGVsaW5lTWFuYWdlcn0pO1xuICAgIH1cblxuICAgIC8vIEl0IGlzIG9ubHkgcG9zc2libGUgdG8gcmVhY2ggaGVyZSBpZiB0aGVyZSB0aGVyZSB3YXMgbm8gcHJlZmVycmVkIGRpcmVjdG9yeSwgdGhlcmUgYXJlIG5vIHByb2plY3QgcGF0aHMsIGFuZCB0aGVcbiAgICAvLyB0aGUgYWN0aXZlIGNvbnRleHQncyByZXBvc2l0b3J5IGlzIG5vdCB1bmRldGVybWluZWQuIFByZXNlcnZlIHRoZSBleGlzdGluZyBhY3RpdmUgY29udGV4dC5cbiAgICByZXR1cm4gdGhpcy5hY3RpdmVDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGlmeSB0aGUgYWN0aXZlIGNvbnRleHQgYW5kIHJlLXJlbmRlciB0aGUgUmVhY3QgdHJlZS4gVGhpcyBzaG91bGQgb25seSBiZSBkb25lIGFzIHBhcnQgb2YgdGhlXG4gICAqIGNvbnRleHQgdXBkYXRlIHF1ZXVlOyB1c2Ugc2NoZWR1bGVBY3RpdmVDb250ZXh0VXBkYXRlKCkgdG8gZG8gdGhpcy5cbiAgICpcbiAgICogbmV4dEFjdGl2ZUNvbnRleHQgLSBUaGUgV29ya2RpckNvbnRleHQgdG8gbWFrZSBhY3RpdmUgbmV4dCwgYXMgZGVyaXZlZCBmcm9tIHRoZSBjdXJyZW50IHdvcmtzcGFjZVxuICAgKiAgIHN0YXRlIGJ5IGdldE5leHRDb250ZXh0KCkuIFRoaXMgbWF5IGJlIGFic2VudCBvciB1bmRldGVybWluZWQuXG4gICAqIGxvY2sgLSBJZiB0cnVlLCBhbHNvIHNldCB0aGlzIGNvbnRleHQgYXMgdGhlIFwibG9ja2VkXCIgb25lIGFuZCBlbmdhZ2UgdGhlIGNvbnRleHQgbG9jayBpZiBpdCBpc24ndFxuICAgKiAgIGFscmVhZHkuIElmIGZhbHNlLCBjbGVhciBhbnkgZXhpc3RpbmcgY29udGV4dCBsb2NrLiBJZiBudWxsIG9yIHVuZGVmaW5lZCwgbGVhdmUgdGhlIGxvY2sgaW4gaXRzXG4gICAqICAgZXhpc3Rpbmcgc3RhdGUuXG4gICAqL1xuICBzZXRBY3RpdmVDb250ZXh0KG5leHRBY3RpdmVDb250ZXh0LCBsb2NrKSB7XG4gICAgaWYgKG5leHRBY3RpdmVDb250ZXh0ICE9PSB0aGlzLmFjdGl2ZUNvbnRleHQpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbnRleHQgPT09IHRoaXMuZ3Vlc3NlZENvbnRleHQpIHtcbiAgICAgICAgdGhpcy5ndWVzc2VkQ29udGV4dC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZ3Vlc3NlZENvbnRleHQgPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5hY3RpdmVDb250ZXh0ID0gbmV4dEFjdGl2ZUNvbnRleHQ7XG4gICAgICBpZiAobG9jayA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmxvY2tlZENvbnRleHQgPSB0aGlzLmFjdGl2ZUNvbnRleHQ7XG4gICAgICB9IGVsc2UgaWYgKGxvY2sgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubG9ja2VkQ29udGV4dCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVyZW5kZXIoKCkgPT4ge1xuICAgICAgICB0aGlzLnN3aXRjaGJvYXJkLmRpZEZpbmlzaENvbnRleHRDaGFuZ2VSZW5kZXIoKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hib2FyZC5kaWRGaW5pc2hBY3RpdmVDb250ZXh0VXBkYXRlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKChsb2NrID09PSB0cnVlIHx8IGxvY2sgPT09IGZhbHNlKSAmJiBsb2NrICE9PSAodGhpcy5sb2NrZWRDb250ZXh0ICE9PSBudWxsKSkge1xuICAgICAgaWYgKGxvY2spIHtcbiAgICAgICAgdGhpcy5sb2NrZWRDb250ZXh0ID0gdGhpcy5hY3RpdmVDb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2NrZWRDb250ZXh0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXJlbmRlcigoKSA9PiB7XG4gICAgICAgIHRoaXMuc3dpdGNoYm9hcmQuZGlkRmluaXNoQ29udGV4dENoYW5nZVJlbmRlcigpO1xuICAgICAgICB0aGlzLnN3aXRjaGJvYXJkLmRpZEZpbmlzaEFjdGl2ZUNvbnRleHRVcGRhdGUoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN3aXRjaGJvYXJkLmRpZEZpbmlzaEFjdGl2ZUNvbnRleHRVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVyaXZlIHRoZSBuZXh0IGFjdGl2ZSBjb250ZXh0IHdpdGggZ2V0TmV4dENvbnRleHQoKSwgdGhlbiBlbmFjdCB0aGUgY29udGV4dCBjaGFuZ2Ugd2l0aCBzZXRBY3RpdmVDb250ZXh0KCkuXG4gICAqXG4gICAqIG9wdGlvbnM6XG4gICAqICAgdXNlUGF0aCAtIFBhdGggb2YgdGhlIGNvbnRleHQgdG8gdXNlIGFzIHRoZSBuZXh0IGNvbnRleHQsIGlmIGl0IGlzIHByZXNlbnQgaW4gdGhlIHBvb2wuXG4gICAqICAgbG9jayAtIFRydWUgb3IgZmFsc2UgdG8gbG9jayB0aGUgdWx0aW1hdGVseSBjaG9zZW4gY29udGV4dC4gT21pdCB0byBwcmVzZXJ2ZSB0aGUgY3VycmVudCBsb2NrIHN0YXRlLlxuICAgKi9cbiAgYXN5bmMgdXBkYXRlQWN0aXZlQ29udGV4dChvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmlzRGVzdHJveWVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN3aXRjaGJvYXJkLmRpZEJlZ2luQWN0aXZlQ29udGV4dFVwZGF0ZSgpO1xuXG4gICAgY29uc3QgbmV4dEFjdGl2ZUNvbnRleHQgPSBhd2FpdCB0aGlzLmdldE5leHRDb250ZXh0KG9wdGlvbnMudXNlUGF0aCk7XG4gICAgdGhpcy5zZXRBY3RpdmVDb250ZXh0KG5leHRBY3RpdmVDb250ZXh0LCBvcHRpb25zLmxvY2spO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaEF0b21HaXRSZXBvc2l0b3J5KHdvcmtkaXIpIHtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSB0aGlzLnByb2plY3QuZ2V0RGlyZWN0b3J5Rm9yUHJvamVjdFBhdGgod29ya2Rpcik7XG4gICAgaWYgKCFkaXJlY3RvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdG9tR2l0UmVwbyA9IGF3YWl0IHRoaXMucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGRpcmVjdG9yeSk7XG4gICAgaWYgKGF0b21HaXRSZXBvKSB7XG4gICAgICBhd2FpdCBhdG9tR2l0UmVwby5yZWZyZXNoU3RhdHVzKCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhdGhGb3JQYW5lSXRlbShwYW5lSXRlbSkge1xuICBpZiAoIXBhbmVJdGVtKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBMaWtlbHkgR2l0SHViIHBhY2thZ2UgcHJvdmlkZWQgcGFuZSBpdGVtXG4gIGlmICh0eXBlb2YgcGFuZUl0ZW0uZ2V0V29ya2luZ0RpcmVjdG9yeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBwYW5lSXRlbS5nZXRXb3JraW5nRGlyZWN0b3J5KCk7XG4gIH1cblxuICAvLyBUZXh0RWRpdG9yLWxpa2VcbiAgaWYgKHR5cGVvZiBwYW5lSXRlbS5nZXRQYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHBhbmVJdGVtLmdldFBhdGgoKTtcbiAgfVxuXG4gIC8vIE9oIHdlbGxcbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=