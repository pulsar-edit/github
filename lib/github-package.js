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

    this.renderFn(_react.default.createElement(_rootController.default, {
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