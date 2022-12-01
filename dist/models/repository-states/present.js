"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _eventKit = require("event-kit");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _state = _interopRequireDefault(require("./state"));

var _keys = require("./cache/keys");

var _gitShellOutStrategy = require("../../git-shell-out-strategy");

var _workspaceChangeObserver = require("../workspace-change-observer");

var _patch = require("../patch");

var _discardHistory = _interopRequireDefault(require("../discard-history"));

var _branch = _interopRequireWildcard(require("../branch"));

var _author = _interopRequireDefault(require("../author"));

var _branchSet = _interopRequireDefault(require("../branch-set"));

var _remote = _interopRequireDefault(require("../remote"));

var _remoteSet = _interopRequireDefault(require("../remote-set"));

var _commit = _interopRequireDefault(require("../commit"));

var _operationStates = _interopRequireDefault(require("../operation-states"));

var _reporterProxy = require("../../reporter-proxy");

var _helpers = require("../../helpers");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * State used when the working directory contains a valid git repository and can be interacted with. Performs
 * actual git operations, caching the results, and broadcasts `onDidUpdate` events when write actions are
 * performed.
 */
class Present extends _state.default {
  constructor(repository, history) {
    super(repository);
    this.cache = new Cache();
    this.discardHistory = new _discardHistory.default(this.createBlob.bind(this), this.expandBlobToFile.bind(this), this.mergeFile.bind(this), this.workdir(), {
      maxHistoryLength: 60
    });
    this.operationStates = new _operationStates.default({
      didUpdate: this.didUpdate.bind(this)
    });
    this.commitMessage = '';
    this.commitMessageTemplate = null;
    this.fetchInitialMessage();
    /* istanbul ignore else */

    if (history) {
      this.discardHistory.updateHistory(history);
    }
  }

  setCommitMessage(message, {
    suppressUpdate
  } = {
    suppressUpdate: false
  }) {
    this.commitMessage = message;

    if (!suppressUpdate) {
      this.didUpdate();
    }
  }

  setCommitMessageTemplate(template) {
    this.commitMessageTemplate = template;
  }

  async fetchInitialMessage() {
    const mergeMessage = await this.repository.getMergeMessage();
    const template = await this.fetchCommitMessageTemplate();

    if (template) {
      this.commitMessageTemplate = template;
    }

    if (mergeMessage) {
      this.setCommitMessage(mergeMessage);
    } else if (template) {
      this.setCommitMessage(template);
    }
  }

  getCommitMessage() {
    return this.commitMessage;
  }

  fetchCommitMessageTemplate() {
    return this.git().fetchCommitMessageTemplate();
  }

  getOperationStates() {
    return this.operationStates;
  }

  isPresent() {
    return true;
  }

  destroy() {
    this.cache.destroy();
    super.destroy();
  }

  showStatusBarTiles() {
    return true;
  }

  isPublishable() {
    return true;
  }

  acceptInvalidation(spec, {
    globally
  } = {}) {
    this.cache.invalidate(spec());
    this.didUpdate();

    if (globally) {
      this.didGloballyInvalidate(spec);
    }
  }

  invalidateCacheAfterFilesystemChange(events) {
    const paths = events.map(e => e.special || e.path);
    const keys = new Set();

    for (let i = 0; i < paths.length; i++) {
      const fullPath = paths[i];

      if (fullPath === _workspaceChangeObserver.FOCUS) {
        keys.add(_keys.Keys.statusBundle);

        for (const k of _keys.Keys.filePatch.eachWithOpts({
          staged: false
        })) {
          keys.add(k);
        }

        continue;
      }

      const includes = (...segments) => fullPath.includes(_path.default.join(...segments));

      if ((0, _helpers.filePathEndsWith)(fullPath, '.git', 'index')) {
        keys.add(_keys.Keys.stagedChanges);
        keys.add(_keys.Keys.filePatch.all);
        keys.add(_keys.Keys.index.all);
        keys.add(_keys.Keys.statusBundle);
        continue;
      }

      if ((0, _helpers.filePathEndsWith)(fullPath, '.git', 'HEAD')) {
        keys.add(_keys.Keys.branches);
        keys.add(_keys.Keys.lastCommit);
        keys.add(_keys.Keys.recentCommits);
        keys.add(_keys.Keys.statusBundle);
        keys.add(_keys.Keys.headDescription);
        keys.add(_keys.Keys.authors);
        continue;
      }

      if (includes('.git', 'refs', 'heads')) {
        keys.add(_keys.Keys.branches);
        keys.add(_keys.Keys.lastCommit);
        keys.add(_keys.Keys.recentCommits);
        keys.add(_keys.Keys.headDescription);
        keys.add(_keys.Keys.authors);
        continue;
      }

      if (includes('.git', 'refs', 'remotes')) {
        keys.add(_keys.Keys.remotes);
        keys.add(_keys.Keys.statusBundle);
        keys.add(_keys.Keys.headDescription);
        continue;
      }

      if ((0, _helpers.filePathEndsWith)(fullPath, '.git', 'config')) {
        keys.add(_keys.Keys.remotes);
        keys.add(_keys.Keys.config.all);
        keys.add(_keys.Keys.statusBundle);
        continue;
      } // File change within the working directory


      const relativePath = _path.default.relative(this.workdir(), fullPath);

      for (const key of _keys.Keys.filePatch.eachWithFileOpts([relativePath], [{
        staged: false
      }])) {
        keys.add(key);
      }

      keys.add(_keys.Keys.statusBundle);
    }
    /* istanbul ignore else */


    if (keys.size > 0) {
      this.cache.invalidate(Array.from(keys));
      this.didUpdate();
    }
  }

  isCommitMessageClean() {
    if (this.commitMessage.trim() === '') {
      return true;
    } else if (this.commitMessageTemplate) {
      return this.commitMessage === this.commitMessageTemplate;
    }

    return false;
  }

  async updateCommitMessageAfterFileSystemChange(events) {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      if (!event.path) {
        continue;
      }

      if ((0, _helpers.filePathEndsWith)(event.path, '.git', 'MERGE_HEAD')) {
        if (event.action === 'created') {
          if (this.isCommitMessageClean()) {
            this.setCommitMessage(await this.repository.getMergeMessage());
          }
        } else if (event.action === 'deleted') {
          this.setCommitMessage(this.commitMessageTemplate || '');
        }
      }

      if ((0, _helpers.filePathEndsWith)(event.path, '.git', 'config')) {
        // this won't catch changes made to the template file itself...
        const template = await this.fetchCommitMessageTemplate();

        if (template === null) {
          this.setCommitMessage('');
        } else if (this.commitMessageTemplate !== template) {
          this.setCommitMessage(template);
        }

        this.setCommitMessageTemplate(template);
      }
    }
  }

  observeFilesystemChange(events) {
    this.invalidateCacheAfterFilesystemChange(events);
    this.updateCommitMessageAfterFileSystemChange(events);
  }

  refresh() {
    this.cache.clear();
    this.didUpdate();
  }

  init() {
    return super.init().catch(e => {
      e.stdErr = 'This directory already contains a git repository';
      return Promise.reject(e);
    });
  }

  clone() {
    return super.clone().catch(e => {
      e.stdErr = 'This directory already contains a git repository';
      return Promise.reject(e);
    });
  } // Git operations ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Staging and unstaging


  stageFiles(paths) {
    return this.invalidate(() => _keys.Keys.cacheOperationKeys(paths), () => this.git().stageFiles(paths));
  }

  unstageFiles(paths) {
    return this.invalidate(() => _keys.Keys.cacheOperationKeys(paths), () => this.git().unstageFiles(paths));
  }

  stageFilesFromParentCommit(paths) {
    return this.invalidate(() => _keys.Keys.cacheOperationKeys(paths), () => this.git().unstageFiles(paths, 'HEAD~'));
  }

  stageFileModeChange(filePath, fileMode) {
    return this.invalidate(() => _keys.Keys.cacheOperationKeys([filePath]), () => this.git().stageFileModeChange(filePath, fileMode));
  }

  stageFileSymlinkChange(filePath) {
    return this.invalidate(() => _keys.Keys.cacheOperationKeys([filePath]), () => this.git().stageFileSymlinkChange(filePath));
  }

  applyPatchToIndex(multiFilePatch) {
    return this.invalidate(() => _keys.Keys.cacheOperationKeys(Array.from(multiFilePatch.getPathSet())), () => {
      const patchStr = multiFilePatch.toString();
      return this.git().applyPatch(patchStr, {
        index: true
      });
    });
  }

  applyPatchToWorkdir(multiFilePatch) {
    return this.invalidate(() => _keys.Keys.workdirOperationKeys(Array.from(multiFilePatch.getPathSet())), () => {
      const patchStr = multiFilePatch.toString();
      return this.git().applyPatch(patchStr);
    });
  } // Committing


  commit(message, options) {
    return this.invalidate(_keys.Keys.headOperationKeys, // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('COMMIT', async (message, options = {}) => {
      const coAuthors = options.coAuthors;
      const opts = !coAuthors ? options : _objectSpread({}, options, {
        coAuthors: coAuthors.map(author => {
          return {
            email: author.getEmail(),
            name: author.getFullName()
          };
        })
      });
      await this.git().commit(message, opts); // Collect commit metadata metrics
      // note: in GitShellOutStrategy we have counters for all git commands, including `commit`, but here we have
      //       access to additional metadata (unstaged file count) so it makes sense to collect commit events here

      const {
        unstagedFiles,
        mergeConflictFiles
      } = await this.getStatusesForChangedFiles();
      const unstagedCount = Object.keys(_objectSpread({}, unstagedFiles, {}, mergeConflictFiles)).length;
      (0, _reporterProxy.addEvent)('commit', {
        package: 'github',
        partial: unstagedCount > 0,
        amend: !!options.amend,
        coAuthorCount: coAuthors ? coAuthors.length : 0
      });
    }, message, options));
  } // Merging


  merge(branchName) {
    return this.invalidate(() => [..._keys.Keys.headOperationKeys(), _keys.Keys.index.all, _keys.Keys.headDescription], () => this.git().merge(branchName));
  }

  abortMerge() {
    return this.invalidate(() => [_keys.Keys.statusBundle, _keys.Keys.stagedChanges, _keys.Keys.filePatch.all, _keys.Keys.index.all], async () => {
      await this.git().abortMerge();
      this.setCommitMessage(this.commitMessageTemplate || '');
    });
  }

  checkoutSide(side, paths) {
    return this.git().checkoutSide(side, paths);
  }

  mergeFile(oursPath, commonBasePath, theirsPath, resultPath) {
    return this.git().mergeFile(oursPath, commonBasePath, theirsPath, resultPath);
  }

  writeMergeConflictToIndex(filePath, commonBaseSha, oursSha, theirsSha) {
    return this.invalidate(() => [_keys.Keys.statusBundle, _keys.Keys.stagedChanges, ..._keys.Keys.filePatch.eachWithFileOpts([filePath], [{
      staged: false
    }, {
      staged: true
    }]), _keys.Keys.index.oneWith(filePath)], () => this.git().writeMergeConflictToIndex(filePath, commonBaseSha, oursSha, theirsSha));
  } // Checkout


  checkout(revision, options = {}) {
    return this.invalidate(() => [_keys.Keys.stagedChanges, _keys.Keys.lastCommit, _keys.Keys.recentCommits, _keys.Keys.authors, _keys.Keys.statusBundle, _keys.Keys.index.all, ..._keys.Keys.filePatch.eachWithOpts({
      staged: true
    }), _keys.Keys.filePatch.allAgainstNonHead, _keys.Keys.headDescription, _keys.Keys.branches], // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('CHECKOUT', (revision, options) => {
      return this.git().checkout(revision, options);
    }, revision, options));
  }

  checkoutPathsAtRevision(paths, revision = 'HEAD') {
    return this.invalidate(() => [_keys.Keys.statusBundle, _keys.Keys.stagedChanges, ...paths.map(fileName => _keys.Keys.index.oneWith(fileName)), ..._keys.Keys.filePatch.eachWithFileOpts(paths, [{
      staged: true
    }]), ..._keys.Keys.filePatch.eachNonHeadWithFiles(paths)], () => this.git().checkoutFiles(paths, revision));
  } // Reset


  undoLastCommit() {
    return this.invalidate(() => [_keys.Keys.stagedChanges, _keys.Keys.lastCommit, _keys.Keys.recentCommits, _keys.Keys.authors, _keys.Keys.statusBundle, _keys.Keys.index.all, ..._keys.Keys.filePatch.eachWithOpts({
      staged: true
    }), _keys.Keys.headDescription], async () => {
      try {
        await this.git().reset('soft', 'HEAD~');
        (0, _reporterProxy.addEvent)('undo-last-commit', {
          package: 'github'
        });
      } catch (e) {
        if (/unknown revision/.test(e.stdErr)) {
          // Initial commit
          await this.git().deleteRef('HEAD');
        } else {
          throw e;
        }
      }
    });
  } // Remote interactions


  fetch(branchName, options = {}) {
    return this.invalidate(() => [_keys.Keys.statusBundle, _keys.Keys.headDescription], // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('FETCH', async branchName => {
      let finalRemoteName = options.remoteName;

      if (!finalRemoteName) {
        const remote = await this.getRemoteForBranch(branchName);

        if (!remote.isPresent()) {
          return null;
        }

        finalRemoteName = remote.getName();
      }

      return this.git().fetch(finalRemoteName, branchName);
    }, branchName));
  }

  pull(branchName, options = {}) {
    return this.invalidate(() => [..._keys.Keys.headOperationKeys(), _keys.Keys.index.all, _keys.Keys.headDescription, _keys.Keys.branches], // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('PULL', async branchName => {
      let finalRemoteName = options.remoteName;

      if (!finalRemoteName) {
        const remote = await this.getRemoteForBranch(branchName);

        if (!remote.isPresent()) {
          return null;
        }

        finalRemoteName = remote.getName();
      }

      return this.git().pull(finalRemoteName, branchName, options);
    }, branchName));
  }

  push(branchName, options = {}) {
    return this.invalidate(() => {
      const keys = [_keys.Keys.statusBundle, _keys.Keys.headDescription];

      if (options.setUpstream) {
        keys.push(_keys.Keys.branches);
        keys.push(..._keys.Keys.config.eachWithSetting(`branch.${branchName}.remote`));
      }

      return keys;
    }, // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('PUSH', async (branchName, options) => {
      const remote = options.remote || (await this.getRemoteForBranch(branchName));
      return this.git().push(remote.getNameOr('origin'), branchName, options);
    }, branchName, options));
  } // Configuration


  setConfig(setting, value, options = {}) {
    return this.invalidate(() => _keys.Keys.config.eachWithSetting(setting), () => this.git().setConfig(setting, value, options), {
      globally: options.global
    });
  }

  unsetConfig(setting) {
    return this.invalidate(() => _keys.Keys.config.eachWithSetting(setting), () => this.git().unsetConfig(setting));
  } // Direct blob interactions


  createBlob(options) {
    return this.git().createBlob(options);
  }

  expandBlobToFile(absFilePath, sha) {
    return this.git().expandBlobToFile(absFilePath, sha);
  } // Discard history


  createDiscardHistoryBlob() {
    return this.discardHistory.createHistoryBlob();
  }

  async updateDiscardHistory() {
    const history = await this.loadHistoryPayload();
    this.discardHistory.updateHistory(history);
  }

  async storeBeforeAndAfterBlobs(filePaths, isSafe, destructiveAction, partialDiscardFilePath = null) {
    const snapshots = await this.discardHistory.storeBeforeAndAfterBlobs(filePaths, isSafe, destructiveAction, partialDiscardFilePath);
    /* istanbul ignore else */

    if (snapshots) {
      await this.saveDiscardHistory();
    }

    return snapshots;
  }

  restoreLastDiscardInTempFiles(isSafe, partialDiscardFilePath = null) {
    return this.discardHistory.restoreLastDiscardInTempFiles(isSafe, partialDiscardFilePath);
  }

  async popDiscardHistory(partialDiscardFilePath = null) {
    const removed = await this.discardHistory.popHistory(partialDiscardFilePath);

    if (removed) {
      await this.saveDiscardHistory();
    }
  }

  clearDiscardHistory(partialDiscardFilePath = null) {
    this.discardHistory.clearHistory(partialDiscardFilePath);
    return this.saveDiscardHistory();
  }

  discardWorkDirChangesForPaths(paths) {
    return this.invalidate(() => [_keys.Keys.statusBundle, ...paths.map(filePath => _keys.Keys.filePatch.oneWith(filePath, {
      staged: false
    })), ..._keys.Keys.filePatch.eachNonHeadWithFiles(paths)], async () => {
      const untrackedFiles = await this.git().getUntrackedFiles();
      const [filesToRemove, filesToCheckout] = partition(paths, f => untrackedFiles.includes(f));
      await this.git().checkoutFiles(filesToCheckout);
      await Promise.all(filesToRemove.map(filePath => {
        const absPath = _path.default.join(this.workdir(), filePath);

        return _fsExtra.default.remove(absPath);
      }));
    });
  } // Accessors /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Index queries


  getStatusBundle() {
    return this.cache.getOrSet(_keys.Keys.statusBundle, async () => {
      try {
        const bundle = await this.git().getStatusBundle();
        const results = await this.formatChangedFiles(bundle);
        results.branch = bundle.branch;
        return results;
      } catch (err) {
        if (err instanceof _gitShellOutStrategy.LargeRepoError) {
          this.transitionTo('TooLarge');
          return {
            branch: {},
            stagedFiles: {},
            unstagedFiles: {},
            mergeConflictFiles: {}
          };
        } else {
          throw err;
        }
      }
    });
  }

  async formatChangedFiles({
    changedEntries,
    untrackedEntries,
    renamedEntries,
    unmergedEntries
  }) {
    const statusMap = {
      A: 'added',
      M: 'modified',
      D: 'deleted',
      U: 'modified',
      T: 'typechange'
    };
    const stagedFiles = {};
    const unstagedFiles = {};
    const mergeConflictFiles = {};
    changedEntries.forEach(entry => {
      if (entry.stagedStatus) {
        stagedFiles[entry.filePath] = statusMap[entry.stagedStatus];
      }

      if (entry.unstagedStatus) {
        unstagedFiles[entry.filePath] = statusMap[entry.unstagedStatus];
      }
    });
    untrackedEntries.forEach(entry => {
      unstagedFiles[entry.filePath] = statusMap.A;
    });
    renamedEntries.forEach(entry => {
      if (entry.stagedStatus === 'R') {
        stagedFiles[entry.filePath] = statusMap.A;
        stagedFiles[entry.origFilePath] = statusMap.D;
      }

      if (entry.unstagedStatus === 'R') {
        unstagedFiles[entry.filePath] = statusMap.A;
        unstagedFiles[entry.origFilePath] = statusMap.D;
      }

      if (entry.stagedStatus === 'C') {
        stagedFiles[entry.filePath] = statusMap.A;
      }

      if (entry.unstagedStatus === 'C') {
        unstagedFiles[entry.filePath] = statusMap.A;
      }
    });
    let statusToHead;

    for (let i = 0; i < unmergedEntries.length; i++) {
      const {
        stagedStatus,
        unstagedStatus,
        filePath
      } = unmergedEntries[i];

      if (stagedStatus === 'U' || unstagedStatus === 'U' || stagedStatus === 'A' && unstagedStatus === 'A') {
        // Skipping this check here because we only run a single `await`
        // and we only run it in the main, synchronous body of the for loop.
        // eslint-disable-next-line no-await-in-loop
        if (!statusToHead) {
          statusToHead = await this.git().diffFileStatus({
            target: 'HEAD'
          });
        }

        mergeConflictFiles[filePath] = {
          ours: statusMap[stagedStatus],
          theirs: statusMap[unstagedStatus],
          file: statusToHead[filePath] || 'equivalent'
        };
      }
    }

    return {
      stagedFiles,
      unstagedFiles,
      mergeConflictFiles
    };
  }

  async getStatusesForChangedFiles() {
    const {
      stagedFiles,
      unstagedFiles,
      mergeConflictFiles
    } = await this.getStatusBundle();
    return {
      stagedFiles,
      unstagedFiles,
      mergeConflictFiles
    };
  }

  getFilePatchForPath(filePath, options) {
    const opts = _objectSpread({
      staged: false,
      patchBuffer: null,
      builder: {},
      before: () => {},
      after: () => {}
    }, options);

    return this.cache.getOrSet(_keys.Keys.filePatch.oneWith(filePath, {
      staged: opts.staged
    }), async () => {
      const diffs = await this.git().getDiffsForFilePath(filePath, {
        staged: opts.staged
      });
      const payload = opts.before();
      const patch = (0, _patch.buildFilePatch)(diffs, opts.builder);

      if (opts.patchBuffer !== null) {
        patch.adoptBuffer(opts.patchBuffer);
      }

      opts.after(patch, payload);
      return patch;
    });
  }

  getDiffsForFilePath(filePath, baseCommit) {
    return this.cache.getOrSet(_keys.Keys.filePatch.oneWith(filePath, {
      baseCommit
    }), () => {
      return this.git().getDiffsForFilePath(filePath, {
        baseCommit
      });
    });
  }

  getStagedChangesPatch(options) {
    const opts = _objectSpread({
      builder: {},
      patchBuffer: null,
      before: () => {},
      after: () => {}
    }, options);

    return this.cache.getOrSet(_keys.Keys.stagedChanges, async () => {
      const diffs = await this.git().getStagedChangesPatch();
      const payload = opts.before();
      const patch = (0, _patch.buildMultiFilePatch)(diffs, opts.builder);

      if (opts.patchBuffer !== null) {
        patch.adoptBuffer(opts.patchBuffer);
      }

      opts.after(patch, payload);
      return patch;
    });
  }

  readFileFromIndex(filePath) {
    return this.cache.getOrSet(_keys.Keys.index.oneWith(filePath), () => {
      return this.git().readFileFromIndex(filePath);
    });
  } // Commit access


  getLastCommit() {
    return this.cache.getOrSet(_keys.Keys.lastCommit, async () => {
      const headCommit = await this.git().getHeadCommit();
      return headCommit.unbornRef ? _commit.default.createUnborn() : new _commit.default(headCommit);
    });
  }

  getCommit(sha) {
    return this.cache.getOrSet(_keys.Keys.blob.oneWith(sha), async () => {
      const [rawCommit] = await this.git().getCommits({
        max: 1,
        ref: sha,
        includePatch: true
      });
      const commit = new _commit.default(rawCommit);
      return commit;
    });
  }

  getRecentCommits(options) {
    return this.cache.getOrSet(_keys.Keys.recentCommits, async () => {
      const commits = await this.git().getCommits(_objectSpread({
        ref: 'HEAD'
      }, options));
      return commits.map(commit => new _commit.default(commit));
    });
  }

  async isCommitPushed(sha) {
    const currentBranch = await this.repository.getCurrentBranch();
    const upstream = currentBranch.getPush();

    if (!upstream.isPresent()) {
      return false;
    }

    const contained = await this.git().getBranchesWithCommit(sha, {
      showLocal: false,
      showRemote: true,
      pattern: upstream.getShortRef()
    });
    return contained.some(ref => ref.length > 0);
  } // Author information


  getAuthors(options) {
    // For now we'll do the naive thing and invalidate anytime HEAD moves. This ensures that we get new authors
    // introduced by newly created commits or pulled commits.
    // This means that we are constantly re-fetching data. If performance becomes a concern we can optimize
    return this.cache.getOrSet(_keys.Keys.authors, async () => {
      const authorMap = await this.git().getAuthors(options);
      return Object.keys(authorMap).map(email => new _author.default(email, authorMap[email]));
    });
  } // Branches


  getBranches() {
    return this.cache.getOrSet(_keys.Keys.branches, async () => {
      const payloads = await this.git().getBranches();
      const branches = new _branchSet.default();

      for (const payload of payloads) {
        let upstream = _branch.nullBranch;

        if (payload.upstream) {
          upstream = payload.upstream.remoteName ? _branch.default.createRemoteTracking(payload.upstream.trackingRef, payload.upstream.remoteName, payload.upstream.remoteRef) : new _branch.default(payload.upstream.trackingRef);
        }

        let push = upstream;

        if (payload.push) {
          push = payload.push.remoteName ? _branch.default.createRemoteTracking(payload.push.trackingRef, payload.push.remoteName, payload.push.remoteRef) : new _branch.default(payload.push.trackingRef);
        }

        branches.add(new _branch.default(payload.name, upstream, push, payload.head, {
          sha: payload.sha
        }));
      }

      return branches;
    });
  }

  getHeadDescription() {
    return this.cache.getOrSet(_keys.Keys.headDescription, () => {
      return this.git().describeHead();
    });
  } // Merging and rebasing status


  isMerging() {
    return this.git().isMerging(this.repository.getGitDirectoryPath());
  }

  isRebasing() {
    return this.git().isRebasing(this.repository.getGitDirectoryPath());
  } // Remotes


  getRemotes() {
    return this.cache.getOrSet(_keys.Keys.remotes, async () => {
      const remotesInfo = await this.git().getRemotes();
      return new _remoteSet.default(remotesInfo.map(({
        name,
        url
      }) => new _remote.default(name, url)));
    });
  }

  addRemote(name, url) {
    return this.invalidate(() => [..._keys.Keys.config.eachWithSetting(`remote.${name}.url`), ..._keys.Keys.config.eachWithSetting(`remote.${name}.fetch`), _keys.Keys.remotes], // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('ADDREMOTE', async (name, url) => {
      await this.git().addRemote(name, url);
      return new _remote.default(name, url);
    }, name, url));
  }

  async getAheadCount(branchName) {
    const bundle = await this.getStatusBundle();
    return bundle.branch.aheadBehind.ahead;
  }

  async getBehindCount(branchName) {
    const bundle = await this.getStatusBundle();
    return bundle.branch.aheadBehind.behind;
  }

  getConfig(option, {
    local
  } = {
    local: false
  }) {
    return this.cache.getOrSet(_keys.Keys.config.oneWith(option, {
      local
    }), () => {
      return this.git().getConfig(option, {
        local
      });
    });
  }

  directGetConfig(key, options) {
    return this.getConfig(key, options);
  } // Direct blob access


  getBlobContents(sha) {
    return this.cache.getOrSet(_keys.Keys.blob.oneWith(sha), () => {
      return this.git().getBlobContents(sha);
    });
  }

  directGetBlobContents(sha) {
    return this.getBlobContents(sha);
  } // Discard history


  hasDiscardHistory(partialDiscardFilePath = null) {
    return this.discardHistory.hasHistory(partialDiscardFilePath);
  }

  getDiscardHistory(partialDiscardFilePath = null) {
    return this.discardHistory.getHistory(partialDiscardFilePath);
  }

  getLastHistorySnapshots(partialDiscardFilePath = null) {
    return this.discardHistory.getLastSnapshots(partialDiscardFilePath);
  } // Cache

  /* istanbul ignore next */


  getCache() {
    return this.cache;
  }

  invalidate(spec, body, options = {}) {
    return body().then(result => {
      this.acceptInvalidation(spec, options);
      return result;
    }, err => {
      this.acceptInvalidation(spec, options);
      return Promise.reject(err);
    });
  }

}

exports.default = Present;

_state.default.register(Present);

function partition(array, predicate) {
  const matches = [];
  const nonmatches = [];
  array.forEach(item => {
    if (predicate(item)) {
      matches.push(item);
    } else {
      nonmatches.push(item);
    }
  });
  return [matches, nonmatches];
}

class Cache {
  constructor() {
    this.storage = new Map();
    this.byGroup = new Map();
    this.emitter = new _eventKit.Emitter();
  }

  getOrSet(key, operation) {
    const primary = key.getPrimary();
    const existing = this.storage.get(primary);

    if (existing !== undefined) {
      existing.hits++;
      return existing.promise;
    }

    const created = operation();
    this.storage.set(primary, {
      createdAt: performance.now(),
      hits: 0,
      promise: created
    });
    const groups = key.getGroups();

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      let groupSet = this.byGroup.get(group);

      if (groupSet === undefined) {
        groupSet = new Set();
        this.byGroup.set(group, groupSet);
      }

      groupSet.add(key);
    }

    this.didUpdate();
    return created;
  }

  invalidate(keys) {
    for (let i = 0; i < keys.length; i++) {
      keys[i].removeFromCache(this);
    }

    if (keys.length > 0) {
      this.didUpdate();
    }
  }

  keysInGroup(group) {
    return this.byGroup.get(group) || [];
  }

  removePrimary(primary) {
    this.storage.delete(primary);
    this.didUpdate();
  }

  removeFromGroup(group, key) {
    const groupSet = this.byGroup.get(group);
    groupSet && groupSet.delete(key);
    this.didUpdate();
  }
  /* istanbul ignore next */


  [Symbol.iterator]() {
    return this.storage[Symbol.iterator]();
  }

  clear() {
    this.storage.clear();
    this.byGroup.clear();
    this.didUpdate();
  }

  didUpdate() {
    this.emitter.emit('did-update');
  }
  /* istanbul ignore next */


  onDidUpdate(callback) {
    return this.emitter.on('did-update', callback);
  }

  destroy() {
    this.emitter.dispose();
  }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvcHJlc2VudC5qcyJdLCJuYW1lcyI6WyJQcmVzZW50IiwiU3RhdGUiLCJjb25zdHJ1Y3RvciIsInJlcG9zaXRvcnkiLCJoaXN0b3J5IiwiY2FjaGUiLCJDYWNoZSIsImRpc2NhcmRIaXN0b3J5IiwiRGlzY2FyZEhpc3RvcnkiLCJjcmVhdGVCbG9iIiwiYmluZCIsImV4cGFuZEJsb2JUb0ZpbGUiLCJtZXJnZUZpbGUiLCJ3b3JrZGlyIiwibWF4SGlzdG9yeUxlbmd0aCIsIm9wZXJhdGlvblN0YXRlcyIsIk9wZXJhdGlvblN0YXRlcyIsImRpZFVwZGF0ZSIsImNvbW1pdE1lc3NhZ2UiLCJjb21taXRNZXNzYWdlVGVtcGxhdGUiLCJmZXRjaEluaXRpYWxNZXNzYWdlIiwidXBkYXRlSGlzdG9yeSIsInNldENvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlIiwic3VwcHJlc3NVcGRhdGUiLCJzZXRDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsIm1lcmdlTWVzc2FnZSIsImdldE1lcmdlTWVzc2FnZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZ2V0Q29tbWl0TWVzc2FnZSIsImdpdCIsImdldE9wZXJhdGlvblN0YXRlcyIsImlzUHJlc2VudCIsImRlc3Ryb3kiLCJzaG93U3RhdHVzQmFyVGlsZXMiLCJpc1B1Ymxpc2hhYmxlIiwiYWNjZXB0SW52YWxpZGF0aW9uIiwic3BlYyIsImdsb2JhbGx5IiwiaW52YWxpZGF0ZSIsImRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsImludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZSIsImV2ZW50cyIsInBhdGhzIiwibWFwIiwiZSIsInNwZWNpYWwiLCJwYXRoIiwia2V5cyIsIlNldCIsImkiLCJsZW5ndGgiLCJmdWxsUGF0aCIsIkZPQ1VTIiwiYWRkIiwiS2V5cyIsInN0YXR1c0J1bmRsZSIsImsiLCJmaWxlUGF0Y2giLCJlYWNoV2l0aE9wdHMiLCJzdGFnZWQiLCJpbmNsdWRlcyIsInNlZ21lbnRzIiwiam9pbiIsInN0YWdlZENoYW5nZXMiLCJhbGwiLCJpbmRleCIsImJyYW5jaGVzIiwibGFzdENvbW1pdCIsInJlY2VudENvbW1pdHMiLCJoZWFkRGVzY3JpcHRpb24iLCJhdXRob3JzIiwicmVtb3RlcyIsImNvbmZpZyIsInJlbGF0aXZlUGF0aCIsInJlbGF0aXZlIiwia2V5IiwiZWFjaFdpdGhGaWxlT3B0cyIsInNpemUiLCJBcnJheSIsImZyb20iLCJpc0NvbW1pdE1lc3NhZ2VDbGVhbiIsInRyaW0iLCJ1cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlIiwiZXZlbnQiLCJhY3Rpb24iLCJvYnNlcnZlRmlsZXN5c3RlbUNoYW5nZSIsInJlZnJlc2giLCJjbGVhciIsImluaXQiLCJjYXRjaCIsInN0ZEVyciIsIlByb21pc2UiLCJyZWplY3QiLCJjbG9uZSIsInN0YWdlRmlsZXMiLCJjYWNoZU9wZXJhdGlvbktleXMiLCJ1bnN0YWdlRmlsZXMiLCJzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdCIsInN0YWdlRmlsZU1vZGVDaGFuZ2UiLCJmaWxlUGF0aCIsImZpbGVNb2RlIiwic3RhZ2VGaWxlU3ltbGlua0NoYW5nZSIsImFwcGx5UGF0Y2hUb0luZGV4IiwibXVsdGlGaWxlUGF0Y2giLCJnZXRQYXRoU2V0IiwicGF0Y2hTdHIiLCJ0b1N0cmluZyIsImFwcGx5UGF0Y2giLCJhcHBseVBhdGNoVG9Xb3JrZGlyIiwid29ya2Rpck9wZXJhdGlvbktleXMiLCJjb21taXQiLCJvcHRpb25zIiwiaGVhZE9wZXJhdGlvbktleXMiLCJleGVjdXRlUGlwZWxpbmVBY3Rpb24iLCJjb0F1dGhvcnMiLCJvcHRzIiwiYXV0aG9yIiwiZW1haWwiLCJnZXRFbWFpbCIsIm5hbWUiLCJnZXRGdWxsTmFtZSIsInVuc3RhZ2VkRmlsZXMiLCJtZXJnZUNvbmZsaWN0RmlsZXMiLCJnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcyIsInVuc3RhZ2VkQ291bnQiLCJPYmplY3QiLCJwYWNrYWdlIiwicGFydGlhbCIsImFtZW5kIiwiY29BdXRob3JDb3VudCIsIm1lcmdlIiwiYnJhbmNoTmFtZSIsImFib3J0TWVyZ2UiLCJjaGVja291dFNpZGUiLCJzaWRlIiwib3Vyc1BhdGgiLCJjb21tb25CYXNlUGF0aCIsInRoZWlyc1BhdGgiLCJyZXN1bHRQYXRoIiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsImNvbW1vbkJhc2VTaGEiLCJvdXJzU2hhIiwidGhlaXJzU2hhIiwib25lV2l0aCIsImNoZWNrb3V0IiwicmV2aXNpb24iLCJhbGxBZ2FpbnN0Tm9uSGVhZCIsImNoZWNrb3V0UGF0aHNBdFJldmlzaW9uIiwiZmlsZU5hbWUiLCJlYWNoTm9uSGVhZFdpdGhGaWxlcyIsImNoZWNrb3V0RmlsZXMiLCJ1bmRvTGFzdENvbW1pdCIsInJlc2V0IiwidGVzdCIsImRlbGV0ZVJlZiIsImZldGNoIiwiZmluYWxSZW1vdGVOYW1lIiwicmVtb3RlTmFtZSIsInJlbW90ZSIsImdldFJlbW90ZUZvckJyYW5jaCIsImdldE5hbWUiLCJwdWxsIiwicHVzaCIsInNldFVwc3RyZWFtIiwiZWFjaFdpdGhTZXR0aW5nIiwiZ2V0TmFtZU9yIiwic2V0Q29uZmlnIiwic2V0dGluZyIsInZhbHVlIiwiZ2xvYmFsIiwidW5zZXRDb25maWciLCJhYnNGaWxlUGF0aCIsInNoYSIsImNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYiIsImNyZWF0ZUhpc3RvcnlCbG9iIiwidXBkYXRlRGlzY2FyZEhpc3RvcnkiLCJsb2FkSGlzdG9yeVBheWxvYWQiLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJmaWxlUGF0aHMiLCJpc1NhZmUiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJzbmFwc2hvdHMiLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInBvcERpc2NhcmRIaXN0b3J5IiwicmVtb3ZlZCIsInBvcEhpc3RvcnkiLCJjbGVhckRpc2NhcmRIaXN0b3J5IiwiY2xlYXJIaXN0b3J5IiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJ1bnRyYWNrZWRGaWxlcyIsImdldFVudHJhY2tlZEZpbGVzIiwiZmlsZXNUb1JlbW92ZSIsImZpbGVzVG9DaGVja291dCIsInBhcnRpdGlvbiIsImYiLCJhYnNQYXRoIiwiZnMiLCJyZW1vdmUiLCJnZXRTdGF0dXNCdW5kbGUiLCJnZXRPclNldCIsImJ1bmRsZSIsInJlc3VsdHMiLCJmb3JtYXRDaGFuZ2VkRmlsZXMiLCJicmFuY2giLCJlcnIiLCJMYXJnZVJlcG9FcnJvciIsInRyYW5zaXRpb25UbyIsInN0YWdlZEZpbGVzIiwiY2hhbmdlZEVudHJpZXMiLCJ1bnRyYWNrZWRFbnRyaWVzIiwicmVuYW1lZEVudHJpZXMiLCJ1bm1lcmdlZEVudHJpZXMiLCJzdGF0dXNNYXAiLCJBIiwiTSIsIkQiLCJVIiwiVCIsImZvckVhY2giLCJlbnRyeSIsInN0YWdlZFN0YXR1cyIsInVuc3RhZ2VkU3RhdHVzIiwib3JpZ0ZpbGVQYXRoIiwic3RhdHVzVG9IZWFkIiwiZGlmZkZpbGVTdGF0dXMiLCJ0YXJnZXQiLCJvdXJzIiwidGhlaXJzIiwiZmlsZSIsImdldEZpbGVQYXRjaEZvclBhdGgiLCJwYXRjaEJ1ZmZlciIsImJ1aWxkZXIiLCJiZWZvcmUiLCJhZnRlciIsImRpZmZzIiwiZ2V0RGlmZnNGb3JGaWxlUGF0aCIsInBheWxvYWQiLCJwYXRjaCIsImFkb3B0QnVmZmVyIiwiYmFzZUNvbW1pdCIsImdldFN0YWdlZENoYW5nZXNQYXRjaCIsInJlYWRGaWxlRnJvbUluZGV4IiwiZ2V0TGFzdENvbW1pdCIsImhlYWRDb21taXQiLCJnZXRIZWFkQ29tbWl0IiwidW5ib3JuUmVmIiwiQ29tbWl0IiwiY3JlYXRlVW5ib3JuIiwiZ2V0Q29tbWl0IiwiYmxvYiIsInJhd0NvbW1pdCIsImdldENvbW1pdHMiLCJtYXgiLCJyZWYiLCJpbmNsdWRlUGF0Y2giLCJnZXRSZWNlbnRDb21taXRzIiwiY29tbWl0cyIsImlzQ29tbWl0UHVzaGVkIiwiY3VycmVudEJyYW5jaCIsImdldEN1cnJlbnRCcmFuY2giLCJ1cHN0cmVhbSIsImdldFB1c2giLCJjb250YWluZWQiLCJnZXRCcmFuY2hlc1dpdGhDb21taXQiLCJzaG93TG9jYWwiLCJzaG93UmVtb3RlIiwicGF0dGVybiIsImdldFNob3J0UmVmIiwic29tZSIsImdldEF1dGhvcnMiLCJhdXRob3JNYXAiLCJBdXRob3IiLCJnZXRCcmFuY2hlcyIsInBheWxvYWRzIiwiQnJhbmNoU2V0IiwibnVsbEJyYW5jaCIsIkJyYW5jaCIsImNyZWF0ZVJlbW90ZVRyYWNraW5nIiwidHJhY2tpbmdSZWYiLCJyZW1vdGVSZWYiLCJoZWFkIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiZGVzY3JpYmVIZWFkIiwiaXNNZXJnaW5nIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsImlzUmViYXNpbmciLCJnZXRSZW1vdGVzIiwicmVtb3Rlc0luZm8iLCJSZW1vdGVTZXQiLCJ1cmwiLCJSZW1vdGUiLCJhZGRSZW1vdGUiLCJnZXRBaGVhZENvdW50IiwiYWhlYWRCZWhpbmQiLCJhaGVhZCIsImdldEJlaGluZENvdW50IiwiYmVoaW5kIiwiZ2V0Q29uZmlnIiwib3B0aW9uIiwibG9jYWwiLCJkaXJlY3RHZXRDb25maWciLCJnZXRCbG9iQ29udGVudHMiLCJkaXJlY3RHZXRCbG9iQ29udGVudHMiLCJoYXNEaXNjYXJkSGlzdG9yeSIsImhhc0hpc3RvcnkiLCJnZXREaXNjYXJkSGlzdG9yeSIsImdldEhpc3RvcnkiLCJnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyIsImdldExhc3RTbmFwc2hvdHMiLCJnZXRDYWNoZSIsImJvZHkiLCJ0aGVuIiwicmVzdWx0IiwicmVnaXN0ZXIiLCJhcnJheSIsInByZWRpY2F0ZSIsIm1hdGNoZXMiLCJub25tYXRjaGVzIiwiaXRlbSIsInN0b3JhZ2UiLCJNYXAiLCJieUdyb3VwIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJvcGVyYXRpb24iLCJwcmltYXJ5IiwiZ2V0UHJpbWFyeSIsImV4aXN0aW5nIiwiZ2V0IiwidW5kZWZpbmVkIiwiaGl0cyIsInByb21pc2UiLCJjcmVhdGVkIiwic2V0IiwiY3JlYXRlZEF0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJncm91cHMiLCJnZXRHcm91cHMiLCJncm91cCIsImdyb3VwU2V0IiwicmVtb3ZlRnJvbUNhY2hlIiwia2V5c0luR3JvdXAiLCJyZW1vdmVQcmltYXJ5IiwiZGVsZXRlIiwicmVtb3ZlRnJvbUdyb3VwIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJlbWl0Iiwib25EaWRVcGRhdGUiLCJjYWxsYmFjayIsIm9uIiwiZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxPQUFOLFNBQXNCQyxjQUF0QixDQUE0QjtBQUN6Q0MsRUFBQUEsV0FBVyxDQUFDQyxVQUFELEVBQWFDLE9BQWIsRUFBc0I7QUFDL0IsVUFBTUQsVUFBTjtBQUVBLFNBQUtFLEtBQUwsR0FBYSxJQUFJQyxLQUFKLEVBQWI7QUFFQSxTQUFLQyxjQUFMLEdBQXNCLElBQUlDLHVCQUFKLENBQ3BCLEtBQUtDLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLElBQXJCLENBRG9CLEVBRXBCLEtBQUtDLGdCQUFMLENBQXNCRCxJQUF0QixDQUEyQixJQUEzQixDQUZvQixFQUdwQixLQUFLRSxTQUFMLENBQWVGLElBQWYsQ0FBb0IsSUFBcEIsQ0FIb0IsRUFJcEIsS0FBS0csT0FBTCxFQUpvQixFQUtwQjtBQUFDQyxNQUFBQSxnQkFBZ0IsRUFBRTtBQUFuQixLQUxvQixDQUF0QjtBQVFBLFNBQUtDLGVBQUwsR0FBdUIsSUFBSUMsd0JBQUosQ0FBb0I7QUFBQ0MsTUFBQUEs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QWF5QixNQUFiLENBQW9CbkIsT0FBcEI7QUFDQSxTQUFLeFQsU0FBTDtBQUNEOztBQUVENFUsRUFBQUEsZUFBZSxDQUFDTixLQUFELEVBQVExUSxHQUFSLEVBQWE7QUFDMUIsVUFBTTJRLFFBQVEsR0FBRyxLQUFLbkIsT0FBTCxDQUFhTyxHQUFiLENBQWlCVyxLQUFqQixDQUFqQjtBQUNBQyxJQUFBQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0ksTUFBVCxDQUFnQi9RLEdBQWhCLENBQVo7QUFDQSxTQUFLNUQsU0FBTDtBQUNEO0FBRUQ7OztBQUNnQixHQUFmNlUsTUFBTSxDQUFDQyxRQUFRLElBQUk7QUFDbEIsV0FBTyxLQUFLNUIsT0FBTCxDQUFhMkIsTUFBTSxDQUFDQyxRQUFwQixHQUFQO0FBQ0Q7O0FBRUR0USxFQUFBQSxLQUFLLEdBQUc7QUFDTixTQUFLME8sT0FBTCxDQUFhMU8sS0FBYjtBQUNBLFNBQUs0TyxPQUFMLENBQWE1TyxLQUFiO0FBQ0EsU0FBS3hFLFNBQUw7QUFDRDs7QUFFREEsRUFBQUEsU0FBUyxHQUFHO0FBQ1YsU0FBS3FULE9BQUwsQ0FBYTBCLElBQWIsQ0FBa0IsWUFBbEI7QUFDRDtBQUVEOzs7QUFDQUMsRUFBQUEsV0FBVyxDQUFDQyxRQUFELEVBQVc7QUFDcEIsV0FBTyxLQUFLNUIsT0FBTCxDQUFhNkIsRUFBYixDQUFnQixZQUFoQixFQUE4QkQsUUFBOUIsQ0FBUDtBQUNEOztBQUVEaFUsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsU0FBS29TLE9BQUwsQ0FBYThCLE9BQWI7QUFDRDs7QUF2RlMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5cbmltcG9ydCBTdGF0ZSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7S2V5c30gZnJvbSAnLi9jYWNoZS9rZXlzJztcblxuaW1wb3J0IHtMYXJnZVJlcG9FcnJvcn0gZnJvbSAnLi4vLi4vZ2l0LXNoZWxsLW91dC1zdHJhdGVneSc7XG5pbXBvcnQge0ZPQ1VTfSBmcm9tICcuLi93b3Jrc3BhY2UtY2hhbmdlLW9ic2VydmVyJztcbmltcG9ydCB7YnVpbGRGaWxlUGF0Y2gsIGJ1aWxkTXVsdGlGaWxlUGF0Y2h9IGZyb20gJy4uL3BhdGNoJztcbmltcG9ydCBEaXNjYXJkSGlzdG9yeSBmcm9tICcuLi9kaXNjYXJkLWhpc3RvcnknO1xuaW1wb3J0IEJyYW5jaCwge251bGxCcmFuY2h9IGZyb20gJy4uL2JyYW5jaCc7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4uL2F1dGhvcic7XG5pbXBvcnQgQnJhbmNoU2V0IGZyb20gJy4uL2JyYW5jaC1zZXQnO1xuaW1wb3J0IFJlbW90ZSBmcm9tICcuLi9yZW1vdGUnO1xuaW1wb3J0IFJlbW90ZVNldCBmcm9tICcuLi9yZW1vdGUtc2V0JztcbmltcG9ydCBDb21taXQgZnJvbSAnLi4vY29tbWl0JztcbmltcG9ydCBPcGVyYXRpb25TdGF0ZXMgZnJvbSAnLi4vb3BlcmF0aW9uLXN0YXRlcyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi8uLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge2ZpbGVQYXRoRW5kc1dpdGh9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuXG4vKipcbiAqIFN0YXRlIHVzZWQgd2hlbiB0aGUgd29ya2luZyBkaXJlY3RvcnkgY29udGFpbnMgYSB2YWxpZCBnaXQgcmVwb3NpdG9yeSBhbmQgY2FuIGJlIGludGVyYWN0ZWQgd2l0aC4gUGVyZm9ybXNcbiAqIGFjdHVhbCBnaXQgb3BlcmF0aW9ucywgY2FjaGluZyB0aGUgcmVzdWx0cywgYW5kIGJyb2FkY2FzdHMgYG9uRGlkVXBkYXRlYCBldmVudHMgd2hlbiB3cml0ZSBhY3Rpb25zIGFyZVxuICogcGVyZm9ybWVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVzZW50IGV4dGVuZHMgU3RhdGUge1xuICBjb25zdHJ1Y3RvcihyZXBvc2l0b3J5LCBoaXN0b3J5KSB7XG4gICAgc3VwZXIocmVwb3NpdG9yeSk7XG5cbiAgICB0aGlzLmNhY2hlID0gbmV3IENhY2hlKCk7XG5cbiAgICB0aGlzLmRpc2NhcmRIaXN0b3J5ID0gbmV3IERpc2NhcmRIaXN0b3J5KFxuICAgICAgdGhpcy5jcmVhdGVCbG9iLmJpbmQodGhpcyksXG4gICAgICB0aGlzLmV4cGFuZEJsb2JUb0ZpbGUuYmluZCh0aGlzKSxcbiAgICAgIHRoaXMubWVyZ2VGaWxlLmJpbmQodGhpcyksXG4gICAgICB0aGlzLndvcmtkaXIoKSxcbiAgICAgIHttYXhIaXN0b3J5TGVuZ3RoOiA2MH0sXG4gICAgKTtcblxuICAgIHRoaXMub3BlcmF0aW9uU3RhdGVzID0gbmV3IE9wZXJhdGlvblN0YXRlcyh7ZGlkVXBkYXRlOiB0aGlzLmRpZFVwZGF0ZS5iaW5kKHRoaXMpfSk7XG5cbiAgICB0aGlzLmNvbW1pdE1lc3NhZ2UgPSAnJztcbiAgICB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSA9IG51bGw7XG4gICAgdGhpcy5mZXRjaEluaXRpYWxNZXNzYWdlKCk7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICB0aGlzLmRpc2NhcmRIaXN0b3J5LnVwZGF0ZUhpc3RvcnkoaGlzdG9yeSk7XG4gICAgfVxuICB9XG5cbiAgc2V0Q29tbWl0TWVzc2FnZShtZXNzYWdlLCB7c3VwcHJlc3NVcGRhdGV9ID0ge3N1cHByZXNzVXBkYXRlOiBmYWxzZX0pIHtcbiAgICB0aGlzLmNvbW1pdE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGlmICghc3VwcHJlc3NVcGRhdGUpIHtcbiAgICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0Q29tbWl0TWVzc2FnZVRlbXBsYXRlKHRlbXBsYXRlKSB7XG4gICAgdGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoSW5pdGlhbE1lc3NhZ2UoKSB7XG4gICAgY29uc3QgbWVyZ2VNZXNzYWdlID0gYXdhaXQgdGhpcy5yZXBvc2l0b3J5LmdldE1lcmdlTWVzc2FnZSgpO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5mZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgdGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG4gICAgaWYgKG1lcmdlTWVzc2FnZSkge1xuICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKG1lcmdlTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKHRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb21taXRNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdE1lc3NhZ2U7XG4gIH1cblxuICBmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5mZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpO1xuICB9XG5cbiAgZ2V0T3BlcmF0aW9uU3RhdGVzKCkge1xuICAgIHJldHVybiB0aGlzLm9wZXJhdGlvblN0YXRlcztcbiAgfVxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jYWNoZS5kZXN0cm95KCk7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgc2hvd1N0YXR1c0JhclRpbGVzKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNQdWJsaXNoYWJsZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFjY2VwdEludmFsaWRhdGlvbihzcGVjLCB7Z2xvYmFsbHl9ID0ge30pIHtcbiAgICB0aGlzLmNhY2hlLmludmFsaWRhdGUoc3BlYygpKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIGlmIChnbG9iYWxseSkge1xuICAgICAgdGhpcy5kaWRHbG9iYWxseUludmFsaWRhdGUoc3BlYyk7XG4gICAgfVxuICB9XG5cbiAgaW52YWxpZGF0ZUNhY2hlQWZ0ZXJGaWxlc3lzdGVtQ2hhbmdlKGV2ZW50cykge1xuICAgIGNvbnN0IHBhdGhzID0gZXZlbnRzLm1hcChlID0+IGUuc3BlY2lhbCB8fCBlLnBhdGgpO1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoc1tpXTtcblxuICAgICAgaWYgKGZ1bGxQYXRoID09PSBGT0NVUykge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBLZXlzLmZpbGVQYXRjaC5lYWNoV2l0aE9wdHMoe3N0YWdlZDogZmFsc2V9KSkge1xuICAgICAgICAgIGtleXMuYWRkKGspO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbmNsdWRlcyA9ICguLi5zZWdtZW50cykgPT4gZnVsbFBhdGguaW5jbHVkZXMocGF0aC5qb2luKC4uLnNlZ21lbnRzKSk7XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGZ1bGxQYXRoLCAnLmdpdCcsICdpbmRleCcpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhZ2VkQ2hhbmdlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuZmlsZVBhdGNoLmFsbCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaW5kZXguYWxsKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZnVsbFBhdGgsICcuZ2l0JywgJ0hFQUQnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLmJyYW5jaGVzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5sYXN0Q29tbWl0KTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5yZWNlbnRDb21taXRzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmhlYWREZXNjcmlwdGlvbik7XG4gICAgICAgIGtleXMuYWRkKEtleXMuYXV0aG9ycyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZXMoJy5naXQnLCAncmVmcycsICdoZWFkcycpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMuYnJhbmNoZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmxhc3RDb21taXQpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlY2VudENvbW1pdHMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmhlYWREZXNjcmlwdGlvbik7XG4gICAgICAgIGtleXMuYWRkKEtleXMuYXV0aG9ycyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZXMoJy5naXQnLCAncmVmcycsICdyZW1vdGVzJykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5yZW1vdGVzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmhlYWREZXNjcmlwdGlvbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChmdWxsUGF0aCwgJy5naXQnLCAnY29uZmlnJykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5yZW1vdGVzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5jb25maWcuYWxsKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlsZSBjaGFuZ2Ugd2l0aGluIHRoZSB3b3JraW5nIGRpcmVjdG9yeVxuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZSh0aGlzLndvcmtkaXIoKSwgZnVsbFBhdGgpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhGaWxlT3B0cyhbcmVsYXRpdmVQYXRoXSwgW3tzdGFnZWQ6IGZhbHNlfV0pKSB7XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgICB9XG4gICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgfVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoa2V5cy5zaXplID4gMCkge1xuICAgICAgdGhpcy5jYWNoZS5pbnZhbGlkYXRlKEFycmF5LmZyb20oa2V5cykpO1xuICAgICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBpc0NvbW1pdE1lc3NhZ2VDbGVhbigpIHtcbiAgICBpZiAodGhpcy5jb21taXRNZXNzYWdlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbW1pdE1lc3NhZ2UgPT09IHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyB1cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlKGV2ZW50cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBldmVudCA9IGV2ZW50c1tpXTtcblxuICAgICAgaWYgKCFldmVudC5wYXRoKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChldmVudC5wYXRoLCAnLmdpdCcsICdNRVJHRV9IRUFEJykpIHtcbiAgICAgICAgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ2NyZWF0ZWQnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNDb21taXRNZXNzYWdlQ2xlYW4oKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKGF3YWl0IHRoaXMucmVwb3NpdG9yeS5nZXRNZXJnZU1lc3NhZ2UoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ2RlbGV0ZWQnKSB7XG4gICAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlIHx8ICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChldmVudC5wYXRoLCAnLmdpdCcsICdjb25maWcnKSkge1xuICAgICAgICAvLyB0aGlzIHdvbid0IGNhdGNoIGNoYW5nZXMgbWFkZSB0byB0aGUgdGVtcGxhdGUgZmlsZSBpdHNlbGYuLi5cbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSgnJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgIT09IHRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKHRlbXBsYXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSh0ZW1wbGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UoZXZlbnRzKSB7XG4gICAgdGhpcy5pbnZhbGlkYXRlQ2FjaGVBZnRlckZpbGVzeXN0ZW1DaGFuZ2UoZXZlbnRzKTtcbiAgICB0aGlzLnVwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UoZXZlbnRzKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgdGhpcy5jYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHJldHVybiBzdXBlci5pbml0KCkuY2F0Y2goZSA9PiB7XG4gICAgICBlLnN0ZEVyciA9ICdUaGlzIGRpcmVjdG9yeSBhbHJlYWR5IGNvbnRhaW5zIGEgZ2l0IHJlcG9zaXRvcnknO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmNsb25lKCkuY2F0Y2goZSA9PiB7XG4gICAgICBlLnN0ZEVyciA9ICdUaGlzIGRpcmVjdG9yeSBhbHJlYWR5IGNvbnRhaW5zIGEgZ2l0IHJlcG9zaXRvcnknO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gR2l0IG9wZXJhdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIC8vIFN0YWdpbmcgYW5kIHVuc3RhZ2luZ1xuXG4gIHN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMocGF0aHMpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5zdGFnZUZpbGVzKHBhdGhzKSxcbiAgICApO1xuICB9XG5cbiAgdW5zdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKHBhdGhzKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkudW5zdGFnZUZpbGVzKHBhdGhzKSxcbiAgICApO1xuICB9XG5cbiAgc3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQocGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMocGF0aHMpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS51bnN0YWdlRmlsZXMocGF0aHMsICdIRUFEficpLFxuICAgICk7XG4gIH1cblxuICBzdGFnZUZpbGVNb2RlQ2hhbmdlKGZpbGVQYXRoLCBmaWxlTW9kZSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhbZmlsZVBhdGhdKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc3RhZ2VGaWxlTW9kZUNoYW5nZShmaWxlUGF0aCwgZmlsZU1vZGUpLFxuICAgICk7XG4gIH1cblxuICBzdGFnZUZpbGVTeW1saW5rQ2hhbmdlKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKFtmaWxlUGF0aF0pLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5zdGFnZUZpbGVTeW1saW5rQ2hhbmdlKGZpbGVQYXRoKSxcbiAgICApO1xuICB9XG5cbiAgYXBwbHlQYXRjaFRvSW5kZXgobXVsdGlGaWxlUGF0Y2gpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMoQXJyYXkuZnJvbShtdWx0aUZpbGVQYXRjaC5nZXRQYXRoU2V0KCkpKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgcGF0Y2hTdHIgPSBtdWx0aUZpbGVQYXRjaC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5hcHBseVBhdGNoKHBhdGNoU3RyLCB7aW5kZXg6IHRydWV9KTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2hUb1dvcmtkaXIobXVsdGlGaWxlUGF0Y2gpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy53b3JrZGlyT3BlcmF0aW9uS2V5cyhBcnJheS5mcm9tKG11bHRpRmlsZVBhdGNoLmdldFBhdGhTZXQoKSkpLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXRjaFN0ciA9IG11bHRpRmlsZVBhdGNoLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLmFwcGx5UGF0Y2gocGF0Y2hTdHIpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgLy8gQ29tbWl0dGluZ1xuXG4gIGNvbW1pdChtZXNzYWdlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgIEtleXMuaGVhZE9wZXJhdGlvbktleXMsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignQ09NTUlUJywgYXN5bmMgKG1lc3NhZ2UsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICBjb25zdCBjb0F1dGhvcnMgPSBvcHRpb25zLmNvQXV0aG9ycztcbiAgICAgICAgY29uc3Qgb3B0cyA9ICFjb0F1dGhvcnMgPyBvcHRpb25zIDoge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgY29BdXRob3JzOiBjb0F1dGhvcnMubWFwKGF1dGhvciA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge2VtYWlsOiBhdXRob3IuZ2V0RW1haWwoKSwgbmFtZTogYXV0aG9yLmdldEZ1bGxOYW1lKCl9O1xuICAgICAgICAgIH0pLFxuICAgICAgICB9O1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuY29tbWl0KG1lc3NhZ2UsIG9wdHMpO1xuXG4gICAgICAgIC8vIENvbGxlY3QgY29tbWl0IG1ldGFkYXRhIG1ldHJpY3NcbiAgICAgICAgLy8gbm90ZTogaW4gR2l0U2hlbGxPdXRTdHJhdGVneSB3ZSBoYXZlIGNvdW50ZXJzIGZvciBhbGwgZ2l0IGNvbW1hbmRzLCBpbmNsdWRpbmcgYGNvbW1pdGAsIGJ1dCBoZXJlIHdlIGhhdmVcbiAgICAgICAgLy8gICAgICAgYWNjZXNzIHRvIGFkZGl0aW9uYWwgbWV0YWRhdGEgKHVuc3RhZ2VkIGZpbGUgY291bnQpIHNvIGl0IG1ha2VzIHNlbnNlIHRvIGNvbGxlY3QgY29tbWl0IGV2ZW50cyBoZXJlXG4gICAgICAgIGNvbnN0IHt1bnN0YWdlZEZpbGVzLCBtZXJnZUNvbmZsaWN0RmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcygpO1xuICAgICAgICBjb25zdCB1bnN0YWdlZENvdW50ID0gT2JqZWN0LmtleXMoey4uLnVuc3RhZ2VkRmlsZXMsIC4uLm1lcmdlQ29uZmxpY3RGaWxlc30pLmxlbmd0aDtcbiAgICAgICAgYWRkRXZlbnQoJ2NvbW1pdCcsIHtcbiAgICAgICAgICBwYWNrYWdlOiAnZ2l0aHViJyxcbiAgICAgICAgICBwYXJ0aWFsOiB1bnN0YWdlZENvdW50ID4gMCxcbiAgICAgICAgICBhbWVuZDogISFvcHRpb25zLmFtZW5kLFxuICAgICAgICAgIGNvQXV0aG9yQ291bnQ6IGNvQXV0aG9ycyA/IGNvQXV0aG9ycy5sZW5ndGggOiAwLFxuICAgICAgICB9KTtcbiAgICAgIH0sIG1lc3NhZ2UsIG9wdGlvbnMpLFxuICAgICk7XG4gIH1cblxuICAvLyBNZXJnaW5nXG5cbiAgbWVyZ2UoYnJhbmNoTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIC4uLktleXMuaGVhZE9wZXJhdGlvbktleXMoKSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgXSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkubWVyZ2UoYnJhbmNoTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIGFib3J0TWVyZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgS2V5cy5maWxlUGF0Y2guYWxsLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgIF0sXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuYWJvcnRNZXJnZSgpO1xuICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgfHwgJycpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgY2hlY2tvdXRTaWRlKHNpZGUsIHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuY2hlY2tvdXRTaWRlKHNpZGUsIHBhdGhzKTtcbiAgfVxuXG4gIG1lcmdlRmlsZShvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5tZXJnZUZpbGUob3Vyc1BhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoKTtcbiAgfVxuXG4gIHdyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgoZmlsZVBhdGgsIGNvbW1vbkJhc2VTaGEsIG91cnNTaGEsIHRoZWlyc1NoYSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoRmlsZU9wdHMoW2ZpbGVQYXRoXSwgW3tzdGFnZWQ6IGZhbHNlfSwge3N0YWdlZDogdHJ1ZX1dKSxcbiAgICAgICAgS2V5cy5pbmRleC5vbmVXaXRoKGZpbGVQYXRoKSxcbiAgICAgIF0sXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgoZmlsZVBhdGgsIGNvbW1vbkJhc2VTaGEsIG91cnNTaGEsIHRoZWlyc1NoYSksXG4gICAgKTtcbiAgfVxuXG4gIC8vIENoZWNrb3V0XG5cbiAgY2hlY2tvdXQocmV2aXNpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgS2V5cy5sYXN0Q29tbWl0LFxuICAgICAgICBLZXlzLnJlY2VudENvbW1pdHMsXG4gICAgICAgIEtleXMuYXV0aG9ycyxcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoV2l0aE9wdHMoe3N0YWdlZDogdHJ1ZX0pLFxuICAgICAgICBLZXlzLmZpbGVQYXRjaC5hbGxBZ2FpbnN0Tm9uSGVhZCxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICAgIEtleXMuYnJhbmNoZXMsXG4gICAgICBdLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ0NIRUNLT1VUJywgKHJldmlzaW9uLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLmNoZWNrb3V0KHJldmlzaW9uLCBvcHRpb25zKTtcbiAgICAgIH0sIHJldmlzaW9uLCBvcHRpb25zKSxcbiAgICApO1xuICB9XG5cbiAgY2hlY2tvdXRQYXRoc0F0UmV2aXNpb24ocGF0aHMsIHJldmlzaW9uID0gJ0hFQUQnKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgLi4ucGF0aHMubWFwKGZpbGVOYW1lID0+IEtleXMuaW5kZXgub25lV2l0aChmaWxlTmFtZSkpLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoV2l0aEZpbGVPcHRzKHBhdGhzLCBbe3N0YWdlZDogdHJ1ZX1dKSxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaE5vbkhlYWRXaXRoRmlsZXMocGF0aHMpLFxuICAgICAgXSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuY2hlY2tvdXRGaWxlcyhwYXRocywgcmV2aXNpb24pLFxuICAgICk7XG4gIH1cblxuICAvLyBSZXNldFxuXG4gIHVuZG9MYXN0Q29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgS2V5cy5sYXN0Q29tbWl0LFxuICAgICAgICBLZXlzLnJlY2VudENvbW1pdHMsXG4gICAgICAgIEtleXMuYXV0aG9ycyxcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoV2l0aE9wdHMoe3N0YWdlZDogdHJ1ZX0pLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgIF0sXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5yZXNldCgnc29mdCcsICdIRUFEficpO1xuICAgICAgICAgIGFkZEV2ZW50KCd1bmRvLWxhc3QtY29tbWl0Jywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoL3Vua25vd24gcmV2aXNpb24vLnRlc3QoZS5zdGRFcnIpKSB7XG4gICAgICAgICAgICAvLyBJbml0aWFsIGNvbW1pdFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5kZWxldGVSZWYoJ0hFQUQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJlbW90ZSBpbnRlcmFjdGlvbnNcblxuICBmZXRjaChicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICBdLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ0ZFVENIJywgYXN5bmMgYnJhbmNoTmFtZSA9PiB7XG4gICAgICAgIGxldCBmaW5hbFJlbW90ZU5hbWUgPSBvcHRpb25zLnJlbW90ZU5hbWU7XG4gICAgICAgIGlmICghZmluYWxSZW1vdGVOYW1lKSB7XG4gICAgICAgICAgY29uc3QgcmVtb3RlID0gYXdhaXQgdGhpcy5nZXRSZW1vdGVGb3JCcmFuY2goYnJhbmNoTmFtZSk7XG4gICAgICAgICAgaWYgKCFyZW1vdGUuaXNQcmVzZW50KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbFJlbW90ZU5hbWUgPSByZW1vdGUuZ2V0TmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLmZldGNoKGZpbmFsUmVtb3RlTmFtZSwgYnJhbmNoTmFtZSk7XG4gICAgICB9LCBicmFuY2hOYW1lKSxcbiAgICApO1xuICB9XG5cbiAgcHVsbChicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICAuLi5LZXlzLmhlYWRPcGVyYXRpb25LZXlzKCksXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgICAgS2V5cy5icmFuY2hlcyxcbiAgICAgIF0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignUFVMTCcsIGFzeW5jIGJyYW5jaE5hbWUgPT4ge1xuICAgICAgICBsZXQgZmluYWxSZW1vdGVOYW1lID0gb3B0aW9ucy5yZW1vdGVOYW1lO1xuICAgICAgICBpZiAoIWZpbmFsUmVtb3RlTmFtZSkge1xuICAgICAgICAgIGNvbnN0IHJlbW90ZSA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpO1xuICAgICAgICAgIGlmICghcmVtb3RlLmlzUHJlc2VudCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmluYWxSZW1vdGVOYW1lID0gcmVtb3RlLmdldE5hbWUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5wdWxsKGZpbmFsUmVtb3RlTmFtZSwgYnJhbmNoTmFtZSwgb3B0aW9ucyk7XG4gICAgICB9LCBicmFuY2hOYW1lKSxcbiAgICApO1xuICB9XG5cbiAgcHVzaChicmFuY2hOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBrZXlzID0gW1xuICAgICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgICBdO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnNldFVwc3RyZWFtKSB7XG4gICAgICAgICAga2V5cy5wdXNoKEtleXMuYnJhbmNoZXMpO1xuICAgICAgICAgIGtleXMucHVzaCguLi5LZXlzLmNvbmZpZy5lYWNoV2l0aFNldHRpbmcoYGJyYW5jaC4ke2JyYW5jaE5hbWV9LnJlbW90ZWApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgfSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdQVVNIJywgYXN5bmMgKGJyYW5jaE5hbWUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3RlID0gb3B0aW9ucy5yZW1vdGUgfHwgYXdhaXQgdGhpcy5nZXRSZW1vdGVGb3JCcmFuY2goYnJhbmNoTmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLnB1c2gocmVtb3RlLmdldE5hbWVPcignb3JpZ2luJyksIGJyYW5jaE5hbWUsIG9wdGlvbnMpO1xuICAgICAgfSwgYnJhbmNoTmFtZSwgb3B0aW9ucyksXG4gICAgKTtcbiAgfVxuXG4gIC8vIENvbmZpZ3VyYXRpb25cblxuICBzZXRDb25maWcoc2V0dGluZywgdmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNvbmZpZy5lYWNoV2l0aFNldHRpbmcoc2V0dGluZyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnNldENvbmZpZyhzZXR0aW5nLCB2YWx1ZSwgb3B0aW9ucyksXG4gICAgICB7Z2xvYmFsbHk6IG9wdGlvbnMuZ2xvYmFsfSxcbiAgICApO1xuICB9XG5cbiAgdW5zZXRDb25maWcoc2V0dGluZykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNvbmZpZy5lYWNoV2l0aFNldHRpbmcoc2V0dGluZyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnVuc2V0Q29uZmlnKHNldHRpbmcpLFxuICAgICk7XG4gIH1cblxuICAvLyBEaXJlY3QgYmxvYiBpbnRlcmFjdGlvbnNcblxuICBjcmVhdGVCbG9iKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5jcmVhdGVCbG9iKG9wdGlvbnMpO1xuICB9XG5cbiAgZXhwYW5kQmxvYlRvRmlsZShhYnNGaWxlUGF0aCwgc2hhKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuZXhwYW5kQmxvYlRvRmlsZShhYnNGaWxlUGF0aCwgc2hhKTtcbiAgfVxuXG4gIC8vIERpc2NhcmQgaGlzdG9yeVxuXG4gIGNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYigpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5jcmVhdGVIaXN0b3J5QmxvYigpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRGlzY2FyZEhpc3RvcnkoKSB7XG4gICAgY29uc3QgaGlzdG9yeSA9IGF3YWl0IHRoaXMubG9hZEhpc3RvcnlQYXlsb2FkKCk7XG4gICAgdGhpcy5kaXNjYXJkSGlzdG9yeS51cGRhdGVIaXN0b3J5KGhpc3RvcnkpO1xuICB9XG5cbiAgYXN5bmMgc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKGZpbGVQYXRocywgaXNTYWZlLCBkZXN0cnVjdGl2ZUFjdGlvbiwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCBzbmFwc2hvdHMgPSBhd2FpdCB0aGlzLmRpc2NhcmRIaXN0b3J5LnN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhcbiAgICAgIGZpbGVQYXRocyxcbiAgICAgIGlzU2FmZSxcbiAgICAgIGRlc3RydWN0aXZlQWN0aW9uLFxuICAgICAgcGFydGlhbERpc2NhcmRGaWxlUGF0aCxcbiAgICApO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKHNuYXBzaG90cykge1xuICAgICAgYXdhaXQgdGhpcy5zYXZlRGlzY2FyZEhpc3RvcnkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNuYXBzaG90cztcbiAgfVxuXG4gIHJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzKGlzU2FmZSwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5yZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyhpc1NhZmUsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgYXN5bmMgcG9wRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBjb25zdCByZW1vdmVkID0gYXdhaXQgdGhpcy5kaXNjYXJkSGlzdG9yeS5wb3BIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICBhd2FpdCB0aGlzLnNhdmVEaXNjYXJkSGlzdG9yeSgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICB0aGlzLmRpc2NhcmRIaXN0b3J5LmNsZWFySGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICByZXR1cm4gdGhpcy5zYXZlRGlzY2FyZEhpc3RvcnkoKTtcbiAgfVxuXG4gIGRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIC4uLnBhdGhzLm1hcChmaWxlUGF0aCA9PiBLZXlzLmZpbGVQYXRjaC5vbmVXaXRoKGZpbGVQYXRoLCB7c3RhZ2VkOiBmYWxzZX0pKSxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaE5vbkhlYWRXaXRoRmlsZXMocGF0aHMpLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdW50cmFja2VkRmlsZXMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldFVudHJhY2tlZEZpbGVzKCk7XG4gICAgICAgIGNvbnN0IFtmaWxlc1RvUmVtb3ZlLCBmaWxlc1RvQ2hlY2tvdXRdID0gcGFydGl0aW9uKHBhdGhzLCBmID0+IHVudHJhY2tlZEZpbGVzLmluY2x1ZGVzKGYpKTtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5jaGVja291dEZpbGVzKGZpbGVzVG9DaGVja291dCk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGZpbGVzVG9SZW1vdmUubWFwKGZpbGVQYXRoID0+IHtcbiAgICAgICAgICBjb25zdCBhYnNQYXRoID0gcGF0aC5qb2luKHRoaXMud29ya2RpcigpLCBmaWxlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuIGZzLnJlbW92ZShhYnNQYXRoKTtcbiAgICAgICAgfSkpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgLy8gQWNjZXNzb3JzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIC8vIEluZGV4IHF1ZXJpZXNcblxuICBnZXRTdGF0dXNCdW5kbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5zdGF0dXNCdW5kbGUsIGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmZvcm1hdENoYW5nZWRGaWxlcyhidW5kbGUpO1xuICAgICAgICByZXN1bHRzLmJyYW5jaCA9IGJ1bmRsZS5icmFuY2g7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBMYXJnZVJlcG9FcnJvcikge1xuICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvKCdUb29MYXJnZScpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBicmFuY2g6IHt9LFxuICAgICAgICAgICAgc3RhZ2VkRmlsZXM6IHt9LFxuICAgICAgICAgICAgdW5zdGFnZWRGaWxlczoge30sXG4gICAgICAgICAgICBtZXJnZUNvbmZsaWN0RmlsZXM6IHt9LFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBmb3JtYXRDaGFuZ2VkRmlsZXMoe2NoYW5nZWRFbnRyaWVzLCB1bnRyYWNrZWRFbnRyaWVzLCByZW5hbWVkRW50cmllcywgdW5tZXJnZWRFbnRyaWVzfSkge1xuICAgIGNvbnN0IHN0YXR1c01hcCA9IHtcbiAgICAgIEE6ICdhZGRlZCcsXG4gICAgICBNOiAnbW9kaWZpZWQnLFxuICAgICAgRDogJ2RlbGV0ZWQnLFxuICAgICAgVTogJ21vZGlmaWVkJyxcbiAgICAgIFQ6ICd0eXBlY2hhbmdlJyxcbiAgICB9O1xuXG4gICAgY29uc3Qgc3RhZ2VkRmlsZXMgPSB7fTtcbiAgICBjb25zdCB1bnN0YWdlZEZpbGVzID0ge307XG4gICAgY29uc3QgbWVyZ2VDb25mbGljdEZpbGVzID0ge307XG5cbiAgICBjaGFuZ2VkRW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGlmIChlbnRyeS5zdGFnZWRTdGF0dXMpIHtcbiAgICAgICAgc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwW2VudHJ5LnN0YWdlZFN0YXR1c107XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkudW5zdGFnZWRTdGF0dXMpIHtcbiAgICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXBbZW50cnkudW5zdGFnZWRTdGF0dXNdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdW50cmFja2VkRW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgfSk7XG5cbiAgICByZW5hbWVkRW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGlmIChlbnRyeS5zdGFnZWRTdGF0dXMgPT09ICdSJykge1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICAgICAgc3RhZ2VkRmlsZXNbZW50cnkub3JpZ0ZpbGVQYXRoXSA9IHN0YXR1c01hcC5EO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnVuc3RhZ2VkU3RhdHVzID09PSAnUicpIHtcbiAgICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5vcmlnRmlsZVBhdGhdID0gc3RhdHVzTWFwLkQ7XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkuc3RhZ2VkU3RhdHVzID09PSAnQycpIHtcbiAgICAgICAgc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkudW5zdGFnZWRTdGF0dXMgPT09ICdDJykge1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHN0YXR1c1RvSGVhZDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5tZXJnZWRFbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB7c3RhZ2VkU3RhdHVzLCB1bnN0YWdlZFN0YXR1cywgZmlsZVBhdGh9ID0gdW5tZXJnZWRFbnRyaWVzW2ldO1xuICAgICAgaWYgKHN0YWdlZFN0YXR1cyA9PT0gJ1UnIHx8IHVuc3RhZ2VkU3RhdHVzID09PSAnVScgfHwgKHN0YWdlZFN0YXR1cyA9PT0gJ0EnICYmIHVuc3RhZ2VkU3RhdHVzID09PSAnQScpKSB7XG4gICAgICAgIC8vIFNraXBwaW5nIHRoaXMgY2hlY2sgaGVyZSBiZWNhdXNlIHdlIG9ubHkgcnVuIGEgc2luZ2xlIGBhd2FpdGBcbiAgICAgICAgLy8gYW5kIHdlIG9ubHkgcnVuIGl0IGluIHRoZSBtYWluLCBzeW5jaHJvbm91cyBib2R5IG9mIHRoZSBmb3IgbG9vcC5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgICAgaWYgKCFzdGF0dXNUb0hlYWQpIHsgc3RhdHVzVG9IZWFkID0gYXdhaXQgdGhpcy5naXQoKS5kaWZmRmlsZVN0YXR1cyh7dGFyZ2V0OiAnSEVBRCd9KTsgfVxuICAgICAgICBtZXJnZUNvbmZsaWN0RmlsZXNbZmlsZVBhdGhdID0ge1xuICAgICAgICAgIG91cnM6IHN0YXR1c01hcFtzdGFnZWRTdGF0dXNdLFxuICAgICAgICAgIHRoZWlyczogc3RhdHVzTWFwW3Vuc3RhZ2VkU3RhdHVzXSxcbiAgICAgICAgICBmaWxlOiBzdGF0dXNUb0hlYWRbZmlsZVBhdGhdIHx8ICdlcXVpdmFsZW50JyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3N0YWdlZEZpbGVzLCB1bnN0YWdlZEZpbGVzLCBtZXJnZUNvbmZsaWN0RmlsZXN9O1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMoKSB7XG4gICAgY29uc3Qge3N0YWdlZEZpbGVzLCB1bnN0YWdlZEZpbGVzLCBtZXJnZUNvbmZsaWN0RmlsZXN9ID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4ge3N0YWdlZEZpbGVzLCB1bnN0YWdlZEZpbGVzLCBtZXJnZUNvbmZsaWN0RmlsZXN9O1xuICB9XG5cbiAgZ2V0RmlsZVBhdGNoRm9yUGF0aChmaWxlUGF0aCwgb3B0aW9ucykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBzdGFnZWQ6IGZhbHNlLFxuICAgICAgcGF0Y2hCdWZmZXI6IG51bGwsXG4gICAgICBidWlsZGVyOiB7fSxcbiAgICAgIGJlZm9yZTogKCkgPT4ge30sXG4gICAgICBhZnRlcjogKCkgPT4ge30sXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmZpbGVQYXRjaC5vbmVXaXRoKGZpbGVQYXRoLCB7c3RhZ2VkOiBvcHRzLnN0YWdlZH0pLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkaWZmcyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwge3N0YWdlZDogb3B0cy5zdGFnZWR9KTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBvcHRzLmJlZm9yZSgpO1xuICAgICAgY29uc3QgcGF0Y2ggPSBidWlsZEZpbGVQYXRjaChkaWZmcywgb3B0cy5idWlsZGVyKTtcbiAgICAgIGlmIChvcHRzLnBhdGNoQnVmZmVyICE9PSBudWxsKSB7IHBhdGNoLmFkb3B0QnVmZmVyKG9wdHMucGF0Y2hCdWZmZXIpOyB9XG4gICAgICBvcHRzLmFmdGVyKHBhdGNoLCBwYXlsb2FkKTtcbiAgICAgIHJldHVybiBwYXRjaDtcbiAgICB9KTtcbiAgfVxuXG4gIGdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIGJhc2VDb21taXQpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmZpbGVQYXRjaC5vbmVXaXRoKGZpbGVQYXRoLCB7YmFzZUNvbW1pdH0pLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5nZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCB7YmFzZUNvbW1pdH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoKG9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgYnVpbGRlcjoge30sXG4gICAgICBwYXRjaEJ1ZmZlcjogbnVsbCxcbiAgICAgIGJlZm9yZTogKCkgPT4ge30sXG4gICAgICBhZnRlcjogKCkgPT4ge30sXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnN0YWdlZENoYW5nZXMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRpZmZzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRTdGFnZWRDaGFuZ2VzUGF0Y2goKTtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBvcHRzLmJlZm9yZSgpO1xuICAgICAgY29uc3QgcGF0Y2ggPSBidWlsZE11bHRpRmlsZVBhdGNoKGRpZmZzLCBvcHRzLmJ1aWxkZXIpO1xuICAgICAgaWYgKG9wdHMucGF0Y2hCdWZmZXIgIT09IG51bGwpIHsgcGF0Y2guYWRvcHRCdWZmZXIob3B0cy5wYXRjaEJ1ZmZlcik7IH1cbiAgICAgIG9wdHMuYWZ0ZXIocGF0Y2gsIHBheWxvYWQpO1xuICAgICAgcmV0dXJuIHBhdGNoO1xuICAgIH0pO1xuICB9XG5cbiAgcmVhZEZpbGVGcm9tSW5kZXgoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmluZGV4Lm9uZVdpdGgoZmlsZVBhdGgpLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5yZWFkRmlsZUZyb21JbmRleChmaWxlUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBDb21taXQgYWNjZXNzXG5cbiAgZ2V0TGFzdENvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmxhc3RDb21taXQsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGhlYWRDb21taXQgPSBhd2FpdCB0aGlzLmdpdCgpLmdldEhlYWRDb21taXQoKTtcbiAgICAgIHJldHVybiBoZWFkQ29tbWl0LnVuYm9yblJlZiA/IENvbW1pdC5jcmVhdGVVbmJvcm4oKSA6IG5ldyBDb21taXQoaGVhZENvbW1pdCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDb21taXQoc2hhKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5ibG9iLm9uZVdpdGgoc2hhKSwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgW3Jhd0NvbW1pdF0gPSBhd2FpdCB0aGlzLmdpdCgpLmdldENvbW1pdHMoe21heDogMSwgcmVmOiBzaGEsIGluY2x1ZGVQYXRjaDogdHJ1ZX0pO1xuICAgICAgY29uc3QgY29tbWl0ID0gbmV3IENvbW1pdChyYXdDb21taXQpO1xuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJlY2VudENvbW1pdHMob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMucmVjZW50Q29tbWl0cywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY29tbWl0cyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0Q29tbWl0cyh7cmVmOiAnSEVBRCcsIC4uLm9wdGlvbnN9KTtcbiAgICAgIHJldHVybiBjb21taXRzLm1hcChjb21taXQgPT4gbmV3IENvbW1pdChjb21taXQpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGlzQ29tbWl0UHVzaGVkKHNoYSkge1xuICAgIGNvbnN0IGN1cnJlbnRCcmFuY2ggPSBhd2FpdCB0aGlzLnJlcG9zaXRvcnkuZ2V0Q3VycmVudEJyYW5jaCgpO1xuICAgIGNvbnN0IHVwc3RyZWFtID0gY3VycmVudEJyYW5jaC5nZXRQdXNoKCk7XG4gICAgaWYgKCF1cHN0cmVhbS5pc1ByZXNlbnQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lZCA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0QnJhbmNoZXNXaXRoQ29tbWl0KHNoYSwge1xuICAgICAgc2hvd0xvY2FsOiBmYWxzZSxcbiAgICAgIHNob3dSZW1vdGU6IHRydWUsXG4gICAgICBwYXR0ZXJuOiB1cHN0cmVhbS5nZXRTaG9ydFJlZigpLFxuICAgIH0pO1xuICAgIHJldHVybiBjb250YWluZWQuc29tZShyZWYgPT4gcmVmLmxlbmd0aCA+IDApO1xuICB9XG5cbiAgLy8gQXV0aG9yIGluZm9ybWF0aW9uXG5cbiAgZ2V0QXV0aG9ycyhvcHRpb25zKSB7XG4gICAgLy8gRm9yIG5vdyB3ZSdsbCBkbyB0aGUgbmFpdmUgdGhpbmcgYW5kIGludmFsaWRhdGUgYW55dGltZSBIRUFEIG1vdmVzLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBnZXQgbmV3IGF1dGhvcnNcbiAgICAvLyBpbnRyb2R1Y2VkIGJ5IG5ld2x5IGNyZWF0ZWQgY29tbWl0cyBvciBwdWxsZWQgY29tbWl0cy5cbiAgICAvLyBUaGlzIG1lYW5zIHRoYXQgd2UgYXJlIGNvbnN0YW50bHkgcmUtZmV0Y2hpbmcgZGF0YS4gSWYgcGVyZm9ybWFuY2UgYmVjb21lcyBhIGNvbmNlcm4gd2UgY2FuIG9wdGltaXplXG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5hdXRob3JzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBhdXRob3JNYXAgPSBhd2FpdCB0aGlzLmdpdCgpLmdldEF1dGhvcnMob3B0aW9ucyk7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXV0aG9yTWFwKS5tYXAoZW1haWwgPT4gbmV3IEF1dGhvcihlbWFpbCwgYXV0aG9yTWFwW2VtYWlsXSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQnJhbmNoZXNcblxuICBnZXRCcmFuY2hlcygpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmJyYW5jaGVzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkcyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0QnJhbmNoZXMoKTtcbiAgICAgIGNvbnN0IGJyYW5jaGVzID0gbmV3IEJyYW5jaFNldCgpO1xuICAgICAgZm9yIChjb25zdCBwYXlsb2FkIG9mIHBheWxvYWRzKSB7XG4gICAgICAgIGxldCB1cHN0cmVhbSA9IG51bGxCcmFuY2g7XG4gICAgICAgIGlmIChwYXlsb2FkLnVwc3RyZWFtKSB7XG4gICAgICAgICAgdXBzdHJlYW0gPSBwYXlsb2FkLnVwc3RyZWFtLnJlbW90ZU5hbWVcbiAgICAgICAgICAgID8gQnJhbmNoLmNyZWF0ZVJlbW90ZVRyYWNraW5nKFxuICAgICAgICAgICAgICBwYXlsb2FkLnVwc3RyZWFtLnRyYWNraW5nUmVmLFxuICAgICAgICAgICAgICBwYXlsb2FkLnVwc3RyZWFtLnJlbW90ZU5hbWUsXG4gICAgICAgICAgICAgIHBheWxvYWQudXBzdHJlYW0ucmVtb3RlUmVmLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBuZXcgQnJhbmNoKHBheWxvYWQudXBzdHJlYW0udHJhY2tpbmdSZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHB1c2ggPSB1cHN0cmVhbTtcbiAgICAgICAgaWYgKHBheWxvYWQucHVzaCkge1xuICAgICAgICAgIHB1c2ggPSBwYXlsb2FkLnB1c2gucmVtb3RlTmFtZVxuICAgICAgICAgICAgPyBCcmFuY2guY3JlYXRlUmVtb3RlVHJhY2tpbmcoXG4gICAgICAgICAgICAgIHBheWxvYWQucHVzaC50cmFja2luZ1JlZixcbiAgICAgICAgICAgICAgcGF5bG9hZC5wdXNoLnJlbW90ZU5hbWUsXG4gICAgICAgICAgICAgIHBheWxvYWQucHVzaC5yZW1vdGVSZWYsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICA6IG5ldyBCcmFuY2gocGF5bG9hZC5wdXNoLnRyYWNraW5nUmVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyYW5jaGVzLmFkZChuZXcgQnJhbmNoKHBheWxvYWQubmFtZSwgdXBzdHJlYW0sIHB1c2gsIHBheWxvYWQuaGVhZCwge3NoYTogcGF5bG9hZC5zaGF9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnJhbmNoZXM7XG4gICAgfSk7XG4gIH1cblxuICBnZXRIZWFkRGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5oZWFkRGVzY3JpcHRpb24sICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmRlc2NyaWJlSGVhZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWVyZ2luZyBhbmQgcmViYXNpbmcgc3RhdHVzXG5cbiAgaXNNZXJnaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmlzTWVyZ2luZyh0aGlzLnJlcG9zaXRvcnkuZ2V0R2l0RGlyZWN0b3J5UGF0aCgpKTtcbiAgfVxuXG4gIGlzUmViYXNpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuaXNSZWJhc2luZyh0aGlzLnJlcG9zaXRvcnkuZ2V0R2l0RGlyZWN0b3J5UGF0aCgpKTtcbiAgfVxuXG4gIC8vIFJlbW90ZXNcblxuICBnZXRSZW1vdGVzKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMucmVtb3RlcywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVtb3Rlc0luZm8gPSBhd2FpdCB0aGlzLmdpdCgpLmdldFJlbW90ZXMoKTtcbiAgICAgIHJldHVybiBuZXcgUmVtb3RlU2V0KFxuICAgICAgICByZW1vdGVzSW5mby5tYXAoKHtuYW1lLCB1cmx9KSA9PiBuZXcgUmVtb3RlKG5hbWUsIHVybCkpLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZFJlbW90ZShuYW1lLCB1cmwpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICAuLi5LZXlzLmNvbmZpZy5lYWNoV2l0aFNldHRpbmcoYHJlbW90ZS4ke25hbWV9LnVybGApLFxuICAgICAgICAuLi5LZXlzLmNvbmZpZy5lYWNoV2l0aFNldHRpbmcoYHJlbW90ZS4ke25hbWV9LmZldGNoYCksXG4gICAgICAgIEtleXMucmVtb3RlcyxcbiAgICAgIF0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignQUREUkVNT1RFJywgYXN5bmMgKG5hbWUsIHVybCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmFkZFJlbW90ZShuYW1lLCB1cmwpO1xuICAgICAgICByZXR1cm4gbmV3IFJlbW90ZShuYW1lLCB1cmwpO1xuICAgICAgfSwgbmFtZSwgdXJsKSxcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWhlYWRDb3VudChicmFuY2hOYW1lKSB7XG4gICAgY29uc3QgYnVuZGxlID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gYnVuZGxlLmJyYW5jaC5haGVhZEJlaGluZC5haGVhZDtcbiAgfVxuXG4gIGFzeW5jIGdldEJlaGluZENvdW50KGJyYW5jaE5hbWUpIHtcbiAgICBjb25zdCBidW5kbGUgPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBidW5kbGUuYnJhbmNoLmFoZWFkQmVoaW5kLmJlaGluZDtcbiAgfVxuXG4gIGdldENvbmZpZyhvcHRpb24sIHtsb2NhbH0gPSB7bG9jYWw6IGZhbHNlfSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuY29uZmlnLm9uZVdpdGgob3B0aW9uLCB7bG9jYWx9KSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZ2V0Q29uZmlnKG9wdGlvbiwge2xvY2FsfSk7XG4gICAgfSk7XG4gIH1cblxuICBkaXJlY3RHZXRDb25maWcoa2V5LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29uZmlnKGtleSwgb3B0aW9ucyk7XG4gIH1cblxuICAvLyBEaXJlY3QgYmxvYiBhY2Nlc3NcblxuICBnZXRCbG9iQ29udGVudHMoc2hhKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5ibG9iLm9uZVdpdGgoc2hhKSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZ2V0QmxvYkNvbnRlbnRzKHNoYSk7XG4gICAgfSk7XG4gIH1cblxuICBkaXJlY3RHZXRCbG9iQ29udGVudHMoc2hhKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QmxvYkNvbnRlbnRzKHNoYSk7XG4gIH1cblxuICAvLyBEaXNjYXJkIGhpc3RvcnlcblxuICBoYXNEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5Lmhhc0hpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICBnZXREaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5LmdldEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICBnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5LmdldExhc3RTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICAvLyBDYWNoZVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldENhY2hlKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlO1xuICB9XG5cbiAgaW52YWxpZGF0ZShzcGVjLCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gYm9keSgpLnRoZW4oXG4gICAgICByZXN1bHQgPT4ge1xuICAgICAgICB0aGlzLmFjY2VwdEludmFsaWRhdGlvbihzcGVjLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICB0aGlzLmFjY2VwdEludmFsaWRhdGlvbihzcGVjLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9LFxuICAgICk7XG4gIH1cbn1cblxuU3RhdGUucmVnaXN0ZXIoUHJlc2VudCk7XG5cbmZ1bmN0aW9uIHBhcnRpdGlvbihhcnJheSwgcHJlZGljYXRlKSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBbXTtcbiAgY29uc3Qgbm9ubWF0Y2hlcyA9IFtdO1xuICBhcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgIG1hdGNoZXMucHVzaChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9ubWF0Y2hlcy5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBbbWF0Y2hlcywgbm9ubWF0Y2hlc107XG59XG5cbmNsYXNzIENhY2hlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdG9yYWdlID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYnlHcm91cCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gIH1cblxuICBnZXRPclNldChrZXksIG9wZXJhdGlvbikge1xuICAgIGNvbnN0IHByaW1hcnkgPSBrZXkuZ2V0UHJpbWFyeSgpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5zdG9yYWdlLmdldChwcmltYXJ5KTtcbiAgICBpZiAoZXhpc3RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZXhpc3RpbmcuaGl0cysrO1xuICAgICAgcmV0dXJuIGV4aXN0aW5nLnByb21pc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlZCA9IG9wZXJhdGlvbigpO1xuXG4gICAgdGhpcy5zdG9yYWdlLnNldChwcmltYXJ5LCB7XG4gICAgICBjcmVhdGVkQXQ6IHBlcmZvcm1hbmNlLm5vdygpLFxuICAgICAgaGl0czogMCxcbiAgICAgIHByb21pc2U6IGNyZWF0ZWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBncm91cHMgPSBrZXkuZ2V0R3JvdXBzKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gZ3JvdXBzW2ldO1xuICAgICAgbGV0IGdyb3VwU2V0ID0gdGhpcy5ieUdyb3VwLmdldChncm91cCk7XG4gICAgICBpZiAoZ3JvdXBTZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBncm91cFNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5ieUdyb3VwLnNldChncm91cCwgZ3JvdXBTZXQpO1xuICAgICAgfVxuICAgICAgZ3JvdXBTZXQuYWRkKGtleSk7XG4gICAgfVxuXG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcblxuICAgIHJldHVybiBjcmVhdGVkO1xuICB9XG5cbiAgaW52YWxpZGF0ZShrZXlzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlzW2ldLnJlbW92ZUZyb21DYWNoZSh0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAoa2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGtleXNJbkdyb3VwKGdyb3VwKSB7XG4gICAgcmV0dXJuIHRoaXMuYnlHcm91cC5nZXQoZ3JvdXApIHx8IFtdO1xuICB9XG5cbiAgcmVtb3ZlUHJpbWFyeShwcmltYXJ5KSB7XG4gICAgdGhpcy5zdG9yYWdlLmRlbGV0ZShwcmltYXJ5KTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgcmVtb3ZlRnJvbUdyb3VwKGdyb3VwLCBrZXkpIHtcbiAgICBjb25zdCBncm91cFNldCA9IHRoaXMuYnlHcm91cC5nZXQoZ3JvdXApO1xuICAgIGdyb3VwU2V0ICYmIGdyb3VwU2V0LmRlbGV0ZShrZXkpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc3RvcmFnZS5jbGVhcigpO1xuICAgIHRoaXMuYnlHcm91cC5jbGVhcigpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICBkaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl19