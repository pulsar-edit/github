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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      }

      // File change within the working directory
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
  }

  // Git operations ////////////////////////////////////////////////////////////////////////////////////////////////////

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
  }

  // Committing

  commit(message, options) {
    return this.invalidate(_keys.Keys.headOperationKeys,
    // eslint-disable-next-line no-shadow
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
      await this.git().commit(message, opts);

      // Collect commit metadata metrics
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
  }

  // Merging

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
  }

  // Checkout

  checkout(revision, options = {}) {
    return this.invalidate(() => [_keys.Keys.stagedChanges, _keys.Keys.lastCommit, _keys.Keys.recentCommits, _keys.Keys.authors, _keys.Keys.statusBundle, _keys.Keys.index.all, ..._keys.Keys.filePatch.eachWithOpts({
      staged: true
    }), _keys.Keys.filePatch.allAgainstNonHead, _keys.Keys.headDescription, _keys.Keys.branches],
    // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('CHECKOUT', (revision, options) => {
      return this.git().checkout(revision, options);
    }, revision, options));
  }
  checkoutPathsAtRevision(paths, revision = 'HEAD') {
    return this.invalidate(() => [_keys.Keys.statusBundle, _keys.Keys.stagedChanges, ...paths.map(fileName => _keys.Keys.index.oneWith(fileName)), ..._keys.Keys.filePatch.eachWithFileOpts(paths, [{
      staged: true
    }]), ..._keys.Keys.filePatch.eachNonHeadWithFiles(paths)], () => this.git().checkoutFiles(paths, revision));
  }

  // Reset

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
  }

  // Remote interactions

  fetch(branchName, options = {}) {
    return this.invalidate(() => [_keys.Keys.statusBundle, _keys.Keys.headDescription],
    // eslint-disable-next-line no-shadow
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
    return this.invalidate(() => [..._keys.Keys.headOperationKeys(), _keys.Keys.index.all, _keys.Keys.headDescription, _keys.Keys.branches],
    // eslint-disable-next-line no-shadow
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
    },
    // eslint-disable-next-line no-shadow
    () => this.executePipelineAction('PUSH', async (branchName, options) => {
      const remote = options.remote || (await this.getRemoteForBranch(branchName));
      return this.git().push(remote.getNameOr('origin'), branchName, options);
    }, branchName, options));
  }

  // Configuration

  setConfig(setting, value, options = {}) {
    return this.invalidate(() => _keys.Keys.config.eachWithSetting(setting), () => this.git().setConfig(setting, value, options), {
      globally: options.global
    });
  }
  unsetConfig(setting) {
    return this.invalidate(() => _keys.Keys.config.eachWithSetting(setting), () => this.git().unsetConfig(setting));
  }

  // Direct blob interactions

  createBlob(options) {
    return this.git().createBlob(options);
  }
  expandBlobToFile(absFilePath, sha) {
    return this.git().expandBlobToFile(absFilePath, sha);
  }

  // Discard history

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
  }

  // Accessors /////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  }

  // Commit access

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
  }

  // Author information

  getAuthors(options) {
    // For now we'll do the naive thing and invalidate anytime HEAD moves. This ensures that we get new authors
    // introduced by newly created commits or pulled commits.
    // This means that we are constantly re-fetching data. If performance becomes a concern we can optimize
    return this.cache.getOrSet(_keys.Keys.authors, async () => {
      const authorMap = await this.git().getAuthors(options);
      return Object.keys(authorMap).map(email => new _author.default(email, authorMap[email]));
    });
  }

  // Branches

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
  }

  // Merging and rebasing status

  isMerging() {
    return this.git().isMerging(this.repository.getGitDirectoryPath());
  }
  isRebasing() {
    return this.git().isRebasing(this.repository.getGitDirectoryPath());
  }

  // Remotes

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
    return this.invalidate(() => [..._keys.Keys.config.eachWithSetting(`remote.${name}.url`), ..._keys.Keys.config.eachWithSetting(`remote.${name}.fetch`), _keys.Keys.remotes],
    // eslint-disable-next-line no-shadow
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
  }

  // Direct blob access

  getBlobContents(sha) {
    return this.cache.getOrSet(_keys.Keys.blob.oneWith(sha), () => {
      return this.git().getBlobContents(sha);
    });
  }
  directGetBlobContents(sha) {
    return this.getBlobContents(sha);
  }

  // Discard history

  hasDiscardHistory(partialDiscardFilePath = null) {
    return this.discardHistory.hasHistory(partialDiscardFilePath);
  }
  getDiscardHistory(partialDiscardFilePath = null) {
    return this.discardHistory.getHistory(partialDiscardFilePath);
  }
  getLastHistorySnapshots(partialDiscardFilePath = null) {
    return this.discardHistory.getLastSnapshots(partialDiscardFilePath);
  }

  // Cache

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQcmVzZW50IiwiU3RhdGUiLCJjb25zdHJ1Y3RvciIsInJlcG9zaXRvcnkiLCJoaXN0b3J5IiwiY2FjaGUiLCJDYWNoZSIsImRpc2NhcmRIaXN0b3J5IiwiRGlzY2FyZEhpc3RvcnkiLCJjcmVhdGVCbG9iIiwiYmluZCIsImV4cGFuZEJsb2JUb0ZpbGUiLCJtZXJnZUZpbGUiLCJ3b3JrZGlyIiwibWF4SGlzdG9yeUxlbmd0aCIsIm9wZXJhdGlvblN0YXRlcyIsIk9wZXJhdGlvblN0YXRlcyIsImRpZFVwZGF0ZSIsImNvbW1pdE1lc3NhZ2UiLCJjb21taXRNZXNzYWdlVGVtcGxhdGUiLCJmZXRjaEluaXRpYWxNZXNzYWdlIiwidXBkYXRlSGlzdG9yeSIsInNldENvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlIiwic3VwcHJlc3NVcGRhdGUiLCJzZXRDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsIm1lcmdlTWVzc2FnZSIsImdldE1lcmdlTWVzc2FnZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZ2V0Q29tbWl0TWVzc2FnZSIsImdpdCIsImdldE9wZXJhdGlvblN0YXRlcyIsImlzUHJlc2VudCIsImRlc3Ryb3kiLCJzaG93U3RhdHVzQmFyVGlsZXMiLCJpc1B1Ymxpc2hhYmxlIiwiYWNjZXB0SW52YWxpZGF0aW9uIiwic3BlYyIsImdsb2JhbGx5IiwiaW52YWxpZGF0ZSIsImRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsImludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZSIsImV2ZW50cyIsInBhdGhzIiwibWFwIiwiZSIsInNwZWNpYWwiLCJwYXRoIiwia2V5cyIsIlNldCIsImkiLCJsZW5ndGgiLCJmdWxsUGF0aCIsIkZPQ1VTIiwiYWRkIiwiS2V5cyIsInN0YXR1c0J1bmRsZSIsImsiLCJmaWxlUGF0Y2giLCJlYWNoV2l0aE9wdHMiLCJzdGFnZWQiLCJpbmNsdWRlcyIsInNlZ21lbnRzIiwiam9pbiIsImZpbGVQYXRoRW5kc1dpdGgiLCJzdGFnZWRDaGFuZ2VzIiwiYWxsIiwiaW5kZXgiLCJicmFuY2hlcyIsImxhc3RDb21taXQiLCJyZWNlbnRDb21taXRzIiwiaGVhZERlc2NyaXB0aW9uIiwiYXV0aG9ycyIsInJlbW90ZXMiLCJjb25maWciLCJyZWxhdGl2ZVBhdGgiLCJyZWxhdGl2ZSIsImtleSIsImVhY2hXaXRoRmlsZU9wdHMiLCJzaXplIiwiQXJyYXkiLCJmcm9tIiwiaXNDb21taXRNZXNzYWdlQ2xlYW4iLCJ0cmltIiwidXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZSIsImV2ZW50IiwiYWN0aW9uIiwib2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UiLCJyZWZyZXNoIiwiY2xlYXIiLCJpbml0IiwiY2F0Y2giLCJzdGRFcnIiLCJQcm9taXNlIiwicmVqZWN0IiwiY2xvbmUiLCJzdGFnZUZpbGVzIiwiY2FjaGVPcGVyYXRpb25LZXlzIiwidW5zdGFnZUZpbGVzIiwic3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQiLCJzdGFnZUZpbGVNb2RlQ2hhbmdlIiwiZmlsZVBhdGgiLCJmaWxlTW9kZSIsInN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UiLCJhcHBseVBhdGNoVG9JbmRleCIsIm11bHRpRmlsZVBhdGNoIiwiZ2V0UGF0aFNldCIsInBhdGNoU3RyIiwidG9TdHJpbmciLCJhcHBseVBhdGNoIiwiYXBwbHlQYXRjaFRvV29ya2RpciIsIndvcmtkaXJPcGVyYXRpb25LZXlzIiwiY29tbWl0Iiwib3B0aW9ucyIsImhlYWRPcGVyYXRpb25LZXlzIiwiZXhlY3V0ZVBpcGVsaW5lQWN0aW9uIiwiY29BdXRob3JzIiwib3B0cyIsImF1dGhvciIsImVtYWlsIiwiZ2V0RW1haWwiLCJuYW1lIiwiZ2V0RnVsbE5hbWUiLCJ1bnN0YWdlZEZpbGVzIiwibWVyZ2VDb25mbGljdEZpbGVzIiwiZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMiLCJ1bnN0YWdlZENvdW50IiwiT2JqZWN0IiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwicGFydGlhbCIsImFtZW5kIiwiY29BdXRob3JDb3VudCIsIm1lcmdlIiwiYnJhbmNoTmFtZSIsImFib3J0TWVyZ2UiLCJjaGVja291dFNpZGUiLCJzaWRlIiwib3Vyc1BhdGgiLCJjb21tb25CYXNlUGF0aCIsInRoZWlyc1BhdGgiLCJyZXN1bHRQYXRoIiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsImNvbW1vbkJhc2VTaGEiLCJvdXJzU2hhIiwidGhlaXJzU2hhIiwib25lV2l0aCIsImNoZWNrb3V0IiwicmV2aXNpb24iLCJhbGxBZ2FpbnN0Tm9uSGVhZCIsImNoZWNrb3V0UGF0aHNBdFJldmlzaW9uIiwiZmlsZU5hbWUiLCJlYWNoTm9uSGVhZFdpdGhGaWxlcyIsImNoZWNrb3V0RmlsZXMiLCJ1bmRvTGFzdENvbW1pdCIsInJlc2V0IiwidGVzdCIsImRlbGV0ZVJlZiIsImZldGNoIiwiZmluYWxSZW1vdGVOYW1lIiwicmVtb3RlTmFtZSIsInJlbW90ZSIsImdldFJlbW90ZUZvckJyYW5jaCIsImdldE5hbWUiLCJwdWxsIiwicHVzaCIsInNldFVwc3RyZWFtIiwiZWFjaFdpdGhTZXR0aW5nIiwiZ2V0TmFtZU9yIiwic2V0Q29uZmlnIiwic2V0dGluZyIsInZhbHVlIiwiZ2xvYmFsIiwidW5zZXRDb25maWciLCJhYnNGaWxlUGF0aCIsInNoYSIsImNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYiIsImNyZWF0ZUhpc3RvcnlCbG9iIiwidXBkYXRlRGlzY2FyZEhpc3RvcnkiLCJsb2FkSGlzdG9yeVBheWxvYWQiLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJmaWxlUGF0aHMiLCJpc1NhZmUiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJzbmFwc2hvdHMiLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInBvcERpc2NhcmRIaXN0b3J5IiwicmVtb3ZlZCIsInBvcEhpc3RvcnkiLCJjbGVhckRpc2NhcmRIaXN0b3J5IiwiY2xlYXJIaXN0b3J5IiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJ1bnRyYWNrZWRGaWxlcyIsImdldFVudHJhY2tlZEZpbGVzIiwiZmlsZXNUb1JlbW92ZSIsImZpbGVzVG9DaGVja291dCIsInBhcnRpdGlvbiIsImYiLCJhYnNQYXRoIiwiZnMiLCJyZW1vdmUiLCJnZXRTdGF0dXNCdW5kbGUiLCJnZXRPclNldCIsImJ1bmRsZSIsInJlc3VsdHMiLCJmb3JtYXRDaGFuZ2VkRmlsZXMiLCJicmFuY2giLCJlcnIiLCJMYXJnZVJlcG9FcnJvciIsInRyYW5zaXRpb25UbyIsInN0YWdlZEZpbGVzIiwiY2hhbmdlZEVudHJpZXMiLCJ1bnRyYWNrZWRFbnRyaWVzIiwicmVuYW1lZEVudHJpZXMiLCJ1bm1lcmdlZEVudHJpZXMiLCJzdGF0dXNNYXAiLCJBIiwiTSIsIkQiLCJVIiwiVCIsImZvckVhY2giLCJlbnRyeSIsInN0YWdlZFN0YXR1cyIsInVuc3RhZ2VkU3RhdHVzIiwib3JpZ0ZpbGVQYXRoIiwic3RhdHVzVG9IZWFkIiwiZGlmZkZpbGVTdGF0dXMiLCJ0YXJnZXQiLCJvdXJzIiwidGhlaXJzIiwiZmlsZSIsImdldEZpbGVQYXRjaEZvclBhdGgiLCJwYXRjaEJ1ZmZlciIsImJ1aWxkZXIiLCJiZWZvcmUiLCJhZnRlciIsImRpZmZzIiwiZ2V0RGlmZnNGb3JGaWxlUGF0aCIsInBheWxvYWQiLCJwYXRjaCIsImJ1aWxkRmlsZVBhdGNoIiwiYWRvcHRCdWZmZXIiLCJiYXNlQ29tbWl0IiwiZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoIiwiYnVpbGRNdWx0aUZpbGVQYXRjaCIsInJlYWRGaWxlRnJvbUluZGV4IiwiZ2V0TGFzdENvbW1pdCIsImhlYWRDb21taXQiLCJnZXRIZWFkQ29tbWl0IiwidW5ib3JuUmVmIiwiQ29tbWl0IiwiY3JlYXRlVW5ib3JuIiwiZ2V0Q29tbWl0IiwiYmxvYiIsInJhd0NvbW1pdCIsImdldENvbW1pdHMiLCJtYXgiLCJyZWYiLCJpbmNsdWRlUGF0Y2giLCJnZXRSZWNlbnRDb21taXRzIiwiY29tbWl0cyIsImlzQ29tbWl0UHVzaGVkIiwiY3VycmVudEJyYW5jaCIsImdldEN1cnJlbnRCcmFuY2giLCJ1cHN0cmVhbSIsImdldFB1c2giLCJjb250YWluZWQiLCJnZXRCcmFuY2hlc1dpdGhDb21taXQiLCJzaG93TG9jYWwiLCJzaG93UmVtb3RlIiwicGF0dGVybiIsImdldFNob3J0UmVmIiwic29tZSIsImdldEF1dGhvcnMiLCJhdXRob3JNYXAiLCJBdXRob3IiLCJnZXRCcmFuY2hlcyIsInBheWxvYWRzIiwiQnJhbmNoU2V0IiwibnVsbEJyYW5jaCIsIkJyYW5jaCIsImNyZWF0ZVJlbW90ZVRyYWNraW5nIiwidHJhY2tpbmdSZWYiLCJyZW1vdGVSZWYiLCJoZWFkIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiZGVzY3JpYmVIZWFkIiwiaXNNZXJnaW5nIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsImlzUmViYXNpbmciLCJnZXRSZW1vdGVzIiwicmVtb3Rlc0luZm8iLCJSZW1vdGVTZXQiLCJ1cmwiLCJSZW1vdGUiLCJhZGRSZW1vdGUiLCJnZXRBaGVhZENvdW50IiwiYWhlYWRCZWhpbmQiLCJhaGVhZCIsImdldEJlaGluZENvdW50IiwiYmVoaW5kIiwiZ2V0Q29uZmlnIiwib3B0aW9uIiwibG9jYWwiLCJkaXJlY3RHZXRDb25maWciLCJnZXRCbG9iQ29udGVudHMiLCJkaXJlY3RHZXRCbG9iQ29udGVudHMiLCJoYXNEaXNjYXJkSGlzdG9yeSIsImhhc0hpc3RvcnkiLCJnZXREaXNjYXJkSGlzdG9yeSIsImdldEhpc3RvcnkiLCJnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyIsImdldExhc3RTbmFwc2hvdHMiLCJnZXRDYWNoZSIsImJvZHkiLCJ0aGVuIiwicmVzdWx0IiwicmVnaXN0ZXIiLCJhcnJheSIsInByZWRpY2F0ZSIsIm1hdGNoZXMiLCJub25tYXRjaGVzIiwiaXRlbSIsInN0b3JhZ2UiLCJNYXAiLCJieUdyb3VwIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJvcGVyYXRpb24iLCJwcmltYXJ5IiwiZ2V0UHJpbWFyeSIsImV4aXN0aW5nIiwiZ2V0IiwidW5kZWZpbmVkIiwiaGl0cyIsInByb21pc2UiLCJjcmVhdGVkIiwic2V0IiwiY3JlYXRlZEF0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJncm91cHMiLCJnZXRHcm91cHMiLCJncm91cCIsImdyb3VwU2V0IiwicmVtb3ZlRnJvbUNhY2hlIiwia2V5c0luR3JvdXAiLCJyZW1vdmVQcmltYXJ5IiwiZGVsZXRlIiwicmVtb3ZlRnJvbUdyb3VwIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJlbWl0Iiwib25EaWRVcGRhdGUiLCJjYWxsYmFjayIsIm9uIiwiZGlzcG9zZSJdLCJzb3VyY2VzIjpbInByZXNlbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5pbXBvcnQgU3RhdGUgZnJvbSAnLi9zdGF0ZSc7XG5pbXBvcnQge0tleXN9IGZyb20gJy4vY2FjaGUva2V5cyc7XG5cbmltcG9ydCB7TGFyZ2VSZXBvRXJyb3J9IGZyb20gJy4uLy4uL2dpdC1zaGVsbC1vdXQtc3RyYXRlZ3knO1xuaW1wb3J0IHtGT0NVU30gZnJvbSAnLi4vd29ya3NwYWNlLWNoYW5nZS1vYnNlcnZlcic7XG5pbXBvcnQge2J1aWxkRmlsZVBhdGNoLCBidWlsZE11bHRpRmlsZVBhdGNofSBmcm9tICcuLi9wYXRjaCc7XG5pbXBvcnQgRGlzY2FyZEhpc3RvcnkgZnJvbSAnLi4vZGlzY2FyZC1oaXN0b3J5JztcbmltcG9ydCBCcmFuY2gsIHtudWxsQnJhbmNofSBmcm9tICcuLi9icmFuY2gnO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuLi9hdXRob3InO1xuaW1wb3J0IEJyYW5jaFNldCBmcm9tICcuLi9icmFuY2gtc2V0JztcbmltcG9ydCBSZW1vdGUgZnJvbSAnLi4vcmVtb3RlJztcbmltcG9ydCBSZW1vdGVTZXQgZnJvbSAnLi4vcmVtb3RlLXNldCc7XG5pbXBvcnQgQ29tbWl0IGZyb20gJy4uL2NvbW1pdCc7XG5pbXBvcnQgT3BlcmF0aW9uU3RhdGVzIGZyb20gJy4uL29wZXJhdGlvbi1zdGF0ZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtmaWxlUGF0aEVuZHNXaXRofSBmcm9tICcuLi8uLi9oZWxwZXJzJztcblxuLyoqXG4gKiBTdGF0ZSB1c2VkIHdoZW4gdGhlIHdvcmtpbmcgZGlyZWN0b3J5IGNvbnRhaW5zIGEgdmFsaWQgZ2l0IHJlcG9zaXRvcnkgYW5kIGNhbiBiZSBpbnRlcmFjdGVkIHdpdGguIFBlcmZvcm1zXG4gKiBhY3R1YWwgZ2l0IG9wZXJhdGlvbnMsIGNhY2hpbmcgdGhlIHJlc3VsdHMsIGFuZCBicm9hZGNhc3RzIGBvbkRpZFVwZGF0ZWAgZXZlbnRzIHdoZW4gd3JpdGUgYWN0aW9ucyBhcmVcbiAqIHBlcmZvcm1lZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VudCBleHRlbmRzIFN0YXRlIHtcbiAgY29uc3RydWN0b3IocmVwb3NpdG9yeSwgaGlzdG9yeSkge1xuICAgIHN1cGVyKHJlcG9zaXRvcnkpO1xuXG4gICAgdGhpcy5jYWNoZSA9IG5ldyBDYWNoZSgpO1xuXG4gICAgdGhpcy5kaXNjYXJkSGlzdG9yeSA9IG5ldyBEaXNjYXJkSGlzdG9yeShcbiAgICAgIHRoaXMuY3JlYXRlQmxvYi5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy5leHBhbmRCbG9iVG9GaWxlLmJpbmQodGhpcyksXG4gICAgICB0aGlzLm1lcmdlRmlsZS5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy53b3JrZGlyKCksXG4gICAgICB7bWF4SGlzdG9yeUxlbmd0aDogNjB9LFxuICAgICk7XG5cbiAgICB0aGlzLm9wZXJhdGlvblN0YXRlcyA9IG5ldyBPcGVyYXRpb25TdGF0ZXMoe2RpZFVwZGF0ZTogdGhpcy5kaWRVcGRhdGUuYmluZCh0aGlzKX0pO1xuXG4gICAgdGhpcy5jb21taXRNZXNzYWdlID0gJyc7XG4gICAgdGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgPSBudWxsO1xuICAgIHRoaXMuZmV0Y2hJbml0aWFsTWVzc2FnZSgpO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgdGhpcy5kaXNjYXJkSGlzdG9yeS51cGRhdGVIaXN0b3J5KGhpc3RvcnkpO1xuICAgIH1cbiAgfVxuXG4gIHNldENvbW1pdE1lc3NhZ2UobWVzc2FnZSwge3N1cHByZXNzVXBkYXRlfSA9IHtzdXBwcmVzc1VwZGF0ZTogZmFsc2V9KSB7XG4gICAgdGhpcy5jb21taXRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICBpZiAoIXN1cHByZXNzVXBkYXRlKSB7XG4gICAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSh0ZW1wbGF0ZSkge1xuICAgIHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlID0gdGVtcGxhdGU7XG4gIH1cblxuICBhc3luYyBmZXRjaEluaXRpYWxNZXNzYWdlKCkge1xuICAgIGNvbnN0IG1lcmdlTWVzc2FnZSA9IGF3YWl0IHRoaXMucmVwb3NpdG9yeS5nZXRNZXJnZU1lc3NhZ2UoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuICAgIGlmIChtZXJnZU1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZShtZXJnZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tbWl0TWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXRNZXNzYWdlO1xuICB9XG5cbiAgZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgfVxuXG4gIGdldE9wZXJhdGlvblN0YXRlcygpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVyYXRpb25TdGF0ZXM7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2FjaGUuZGVzdHJveSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHNob3dTdGF0dXNCYXJUaWxlcygpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzUHVibGlzaGFibGUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhY2NlcHRJbnZhbGlkYXRpb24oc3BlYywge2dsb2JhbGx5fSA9IHt9KSB7XG4gICAgdGhpcy5jYWNoZS5pbnZhbGlkYXRlKHNwZWMoKSk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICBpZiAoZ2xvYmFsbHkpIHtcbiAgICAgIHRoaXMuZGlkR2xvYmFsbHlJbnZhbGlkYXRlKHNwZWMpO1xuICAgIH1cbiAgfVxuXG4gIGludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICBjb25zdCBwYXRocyA9IGV2ZW50cy5tYXAoZSA9PiBlLnNwZWNpYWwgfHwgZS5wYXRoKTtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aHNbaV07XG5cbiAgICAgIGlmIChmdWxsUGF0aCA9PT0gRk9DVVMpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhPcHRzKHtzdGFnZWQ6IGZhbHNlfSkpIHtcbiAgICAgICAgICBrZXlzLmFkZChrKTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5jbHVkZXMgPSAoLi4uc2VnbWVudHMpID0+IGZ1bGxQYXRoLmluY2x1ZGVzKHBhdGguam9pbiguLi5zZWdtZW50cykpO1xuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChmdWxsUGF0aCwgJy5naXQnLCAnaW5kZXgnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YWdlZENoYW5nZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmZpbGVQYXRjaC5hbGwpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmluZGV4LmFsbCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGZ1bGxQYXRoLCAnLmdpdCcsICdIRUFEJykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5icmFuY2hlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMubGFzdENvbW1pdCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVjZW50Q29tbWl0cyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5oZWFkRGVzY3JpcHRpb24pO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmF1dGhvcnMpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1ZGVzKCcuZ2l0JywgJ3JlZnMnLCAnaGVhZHMnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLmJyYW5jaGVzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5sYXN0Q29tbWl0KTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5yZWNlbnRDb21taXRzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5oZWFkRGVzY3JpcHRpb24pO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmF1dGhvcnMpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1ZGVzKCcuZ2l0JywgJ3JlZnMnLCAncmVtb3RlcycpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVtb3Rlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5oZWFkRGVzY3JpcHRpb24pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZnVsbFBhdGgsICcuZ2l0JywgJ2NvbmZpZycpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVtb3Rlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuY29uZmlnLmFsbCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbGUgY2hhbmdlIHdpdGhpbiB0aGUgd29ya2luZyBkaXJlY3RvcnlcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUodGhpcy53b3JrZGlyKCksIGZ1bGxQYXRoKTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIEtleXMuZmlsZVBhdGNoLmVhY2hXaXRoRmlsZU9wdHMoW3JlbGF0aXZlUGF0aF0sIFt7c3RhZ2VkOiBmYWxzZX1dKSkge1xuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgICAgfVxuICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGtleXMuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMuY2FjaGUuaW52YWxpZGF0ZShBcnJheS5mcm9tKGtleXMpKTtcbiAgICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgaXNDb21taXRNZXNzYWdlQ2xlYW4oKSB7XG4gICAgaWYgKHRoaXMuY29tbWl0TWVzc2FnZS50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21taXRNZXNzYWdlID09PSB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZXZlbnQgPSBldmVudHNbaV07XG5cbiAgICAgIGlmICghZXZlbnQucGF0aCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZXZlbnQucGF0aCwgJy5naXQnLCAnTUVSR0VfSEVBRCcpKSB7XG4gICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdjcmVhdGVkJykge1xuICAgICAgICAgIGlmICh0aGlzLmlzQ29tbWl0TWVzc2FnZUNsZWFuKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZShhd2FpdCB0aGlzLnJlcG9zaXRvcnkuZ2V0TWVyZ2VNZXNzYWdlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5hY3Rpb24gPT09ICdkZWxldGVkJykge1xuICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSB8fCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZXZlbnQucGF0aCwgJy5naXQnLCAnY29uZmlnJykpIHtcbiAgICAgICAgLy8gdGhpcyB3b24ndCBjYXRjaCBjaGFuZ2VzIG1hZGUgdG8gdGhlIHRlbXBsYXRlIGZpbGUgaXRzZWxmLi4uXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5mZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpO1xuICAgICAgICBpZiAodGVtcGxhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UoJycpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlICE9PSB0ZW1wbGF0ZSkge1xuICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0ZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9ic2VydmVGaWxlc3lzdGVtQ2hhbmdlKGV2ZW50cykge1xuICAgIHRoaXMuaW52YWxpZGF0ZUNhY2hlQWZ0ZXJGaWxlc3lzdGVtQ2hhbmdlKGV2ZW50cyk7XG4gICAgdGhpcy51cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlKGV2ZW50cyk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuY2FjaGUuY2xlYXIoKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgpLmNhdGNoKGUgPT4ge1xuICAgICAgZS5zdGRFcnIgPSAnVGhpcyBkaXJlY3RvcnkgYWxyZWFkeSBjb250YWlucyBhIGdpdCByZXBvc2l0b3J5JztcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBzdXBlci5jbG9uZSgpLmNhdGNoKGUgPT4ge1xuICAgICAgZS5zdGRFcnIgPSAnVGhpcyBkaXJlY3RvcnkgYWxyZWFkeSBjb250YWlucyBhIGdpdCByZXBvc2l0b3J5JztcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEdpdCBvcGVyYXRpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvLyBTdGFnaW5nIGFuZCB1bnN0YWdpbmdcblxuICBzdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKHBhdGhzKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc3RhZ2VGaWxlcyhwYXRocyksXG4gICAgKTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhwYXRocyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnVuc3RhZ2VGaWxlcyhwYXRocyksXG4gICAgKTtcbiAgfVxuXG4gIHN0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0KHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKHBhdGhzKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkudW5zdGFnZUZpbGVzKHBhdGhzLCAnSEVBRH4nKSxcbiAgICApO1xuICB9XG5cbiAgc3RhZ2VGaWxlTW9kZUNoYW5nZShmaWxlUGF0aCwgZmlsZU1vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMoW2ZpbGVQYXRoXSksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnN0YWdlRmlsZU1vZGVDaGFuZ2UoZmlsZVBhdGgsIGZpbGVNb2RlKSxcbiAgICApO1xuICB9XG5cbiAgc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShmaWxlUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhbZmlsZVBhdGhdKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShmaWxlUGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2hUb0luZGV4KG11bHRpRmlsZVBhdGNoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKEFycmF5LmZyb20obXVsdGlGaWxlUGF0Y2guZ2V0UGF0aFNldCgpKSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGNoU3RyID0gbXVsdGlGaWxlUGF0Y2gudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuYXBwbHlQYXRjaChwYXRjaFN0ciwge2luZGV4OiB0cnVlfSk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBhcHBseVBhdGNoVG9Xb3JrZGlyKG11bHRpRmlsZVBhdGNoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMud29ya2Rpck9wZXJhdGlvbktleXMoQXJyYXkuZnJvbShtdWx0aUZpbGVQYXRjaC5nZXRQYXRoU2V0KCkpKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgcGF0Y2hTdHIgPSBtdWx0aUZpbGVQYXRjaC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5hcHBseVBhdGNoKHBhdGNoU3RyKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8vIENvbW1pdHRpbmdcblxuICBjb21taXQobWVzc2FnZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICBLZXlzLmhlYWRPcGVyYXRpb25LZXlzLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ0NPTU1JVCcsIGFzeW5jIChtZXNzYWdlLCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgY29BdXRob3JzID0gb3B0aW9ucy5jb0F1dGhvcnM7XG4gICAgICAgIGNvbnN0IG9wdHMgPSAhY29BdXRob3JzID8gb3B0aW9ucyA6IHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGNvQXV0aG9yczogY29BdXRob3JzLm1hcChhdXRob3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtlbWFpbDogYXV0aG9yLmdldEVtYWlsKCksIG5hbWU6IGF1dGhvci5nZXRGdWxsTmFtZSgpfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmNvbW1pdChtZXNzYWdlLCBvcHRzKTtcblxuICAgICAgICAvLyBDb2xsZWN0IGNvbW1pdCBtZXRhZGF0YSBtZXRyaWNzXG4gICAgICAgIC8vIG5vdGU6IGluIEdpdFNoZWxsT3V0U3RyYXRlZ3kgd2UgaGF2ZSBjb3VudGVycyBmb3IgYWxsIGdpdCBjb21tYW5kcywgaW5jbHVkaW5nIGBjb21taXRgLCBidXQgaGVyZSB3ZSBoYXZlXG4gICAgICAgIC8vICAgICAgIGFjY2VzcyB0byBhZGRpdGlvbmFsIG1ldGFkYXRhICh1bnN0YWdlZCBmaWxlIGNvdW50KSBzbyBpdCBtYWtlcyBzZW5zZSB0byBjb2xsZWN0IGNvbW1pdCBldmVudHMgaGVyZVxuICAgICAgICBjb25zdCB7dW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMoKTtcbiAgICAgICAgY29uc3QgdW5zdGFnZWRDb3VudCA9IE9iamVjdC5rZXlzKHsuLi51bnN0YWdlZEZpbGVzLCAuLi5tZXJnZUNvbmZsaWN0RmlsZXN9KS5sZW5ndGg7XG4gICAgICAgIGFkZEV2ZW50KCdjb21taXQnLCB7XG4gICAgICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICAgICAgcGFydGlhbDogdW5zdGFnZWRDb3VudCA+IDAsXG4gICAgICAgICAgYW1lbmQ6ICEhb3B0aW9ucy5hbWVuZCxcbiAgICAgICAgICBjb0F1dGhvckNvdW50OiBjb0F1dGhvcnMgPyBjb0F1dGhvcnMubGVuZ3RoIDogMCxcbiAgICAgICAgfSk7XG4gICAgICB9LCBtZXNzYWdlLCBvcHRpb25zKSxcbiAgICApO1xuICB9XG5cbiAgLy8gTWVyZ2luZ1xuXG4gIG1lcmdlKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICAuLi5LZXlzLmhlYWRPcGVyYXRpb25LZXlzKCksXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgIF0sXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLm1lcmdlKGJyYW5jaE5hbWUpLFxuICAgICk7XG4gIH1cblxuICBhYm9ydE1lcmdlKCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIEtleXMuZmlsZVBhdGNoLmFsbCxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICBdLFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmFib3J0TWVyZ2UoKTtcbiAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlIHx8ICcnKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIGNoZWNrb3V0U2lkZShzaWRlLCBwYXRocykge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmNoZWNrb3V0U2lkZShzaWRlLCBwYXRocyk7XG4gIH1cblxuICBtZXJnZUZpbGUob3Vyc1BhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkubWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCk7XG4gIH1cblxuICB3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoV2l0aEZpbGVPcHRzKFtmaWxlUGF0aF0sIFt7c3RhZ2VkOiBmYWxzZX0sIHtzdGFnZWQ6IHRydWV9XSksXG4gICAgICAgIEtleXMuaW5kZXgub25lV2l0aChmaWxlUGF0aCksXG4gICAgICBdLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS53cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpLFxuICAgICk7XG4gIH1cblxuICAvLyBDaGVja291dFxuXG4gIGNoZWNrb3V0KHJldmlzaW9uLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIEtleXMubGFzdENvbW1pdCxcbiAgICAgICAgS2V5cy5yZWNlbnRDb21taXRzLFxuICAgICAgICBLZXlzLmF1dGhvcnMsXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhPcHRzKHtzdGFnZWQ6IHRydWV9KSxcbiAgICAgICAgS2V5cy5maWxlUGF0Y2guYWxsQWdhaW5zdE5vbkhlYWQsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgICBLZXlzLmJyYW5jaGVzLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdDSEVDS09VVCcsIChyZXZpc2lvbiwgb3B0aW9ucykgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5jaGVja291dChyZXZpc2lvbiwgb3B0aW9ucyk7XG4gICAgICB9LCByZXZpc2lvbiwgb3B0aW9ucyksXG4gICAgKTtcbiAgfVxuXG4gIGNoZWNrb3V0UGF0aHNBdFJldmlzaW9uKHBhdGhzLCByZXZpc2lvbiA9ICdIRUFEJykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIC4uLnBhdGhzLm1hcChmaWxlTmFtZSA9PiBLZXlzLmluZGV4Lm9uZVdpdGgoZmlsZU5hbWUpKSxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhGaWxlT3B0cyhwYXRocywgW3tzdGFnZWQ6IHRydWV9XSksXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hOb25IZWFkV2l0aEZpbGVzKHBhdGhzKSxcbiAgICAgIF0sXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLmNoZWNrb3V0RmlsZXMocGF0aHMsIHJldmlzaW9uKSxcbiAgICApO1xuICB9XG5cbiAgLy8gUmVzZXRcblxuICB1bmRvTGFzdENvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIEtleXMubGFzdENvbW1pdCxcbiAgICAgICAgS2V5cy5yZWNlbnRDb21taXRzLFxuICAgICAgICBLZXlzLmF1dGhvcnMsXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhPcHRzKHtzdGFnZWQ6IHRydWV9KSxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICBdLFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkucmVzZXQoJ3NvZnQnLCAnSEVBRH4nKTtcbiAgICAgICAgICBhZGRFdmVudCgndW5kby1sYXN0LWNvbW1pdCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKC91bmtub3duIHJldmlzaW9uLy50ZXN0KGUuc3RkRXJyKSkge1xuICAgICAgICAgICAgLy8gSW5pdGlhbCBjb21taXRcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuZGVsZXRlUmVmKCdIRUFEJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICAvLyBSZW1vdGUgaW50ZXJhY3Rpb25zXG5cbiAgZmV0Y2goYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdGRVRDSCcsIGFzeW5jIGJyYW5jaE5hbWUgPT4ge1xuICAgICAgICBsZXQgZmluYWxSZW1vdGVOYW1lID0gb3B0aW9ucy5yZW1vdGVOYW1lO1xuICAgICAgICBpZiAoIWZpbmFsUmVtb3RlTmFtZSkge1xuICAgICAgICAgIGNvbnN0IHJlbW90ZSA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpO1xuICAgICAgICAgIGlmICghcmVtb3RlLmlzUHJlc2VudCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmluYWxSZW1vdGVOYW1lID0gcmVtb3RlLmdldE5hbWUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5mZXRjaChmaW5hbFJlbW90ZU5hbWUsIGJyYW5jaE5hbWUpO1xuICAgICAgfSwgYnJhbmNoTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIHB1bGwoYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgLi4uS2V5cy5oZWFkT3BlcmF0aW9uS2V5cygpLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICAgIEtleXMuYnJhbmNoZXMsXG4gICAgICBdLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ1BVTEwnLCBhc3luYyBicmFuY2hOYW1lID0+IHtcbiAgICAgICAgbGV0IGZpbmFsUmVtb3RlTmFtZSA9IG9wdGlvbnMucmVtb3RlTmFtZTtcbiAgICAgICAgaWYgKCFmaW5hbFJlbW90ZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCByZW1vdGUgPSBhd2FpdCB0aGlzLmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgICAgICAgICBpZiAoIXJlbW90ZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmFsUmVtb3RlTmFtZSA9IHJlbW90ZS5nZXROYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkucHVsbChmaW5hbFJlbW90ZU5hbWUsIGJyYW5jaE5hbWUsIG9wdGlvbnMpO1xuICAgICAgfSwgYnJhbmNoTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIHB1c2goYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5cyA9IFtcbiAgICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAob3B0aW9ucy5zZXRVcHN0cmVhbSkge1xuICAgICAgICAgIGtleXMucHVzaChLZXlzLmJyYW5jaGVzKTtcbiAgICAgICAgICBrZXlzLnB1c2goLi4uS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKGBicmFuY2guJHticmFuY2hOYW1lfS5yZW1vdGVgKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgIH0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignUFVTSCcsIGFzeW5jIChicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW90ZSA9IG9wdGlvbnMucmVtb3RlIHx8IGF3YWl0IHRoaXMuZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5wdXNoKHJlbW90ZS5nZXROYW1lT3IoJ29yaWdpbicpLCBicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgICAgIH0sIGJyYW5jaE5hbWUsIG9wdGlvbnMpLFxuICAgICk7XG4gIH1cblxuICAvLyBDb25maWd1cmF0aW9uXG5cbiAgc2V0Q29uZmlnKHNldHRpbmcsIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKHNldHRpbmcpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5zZXRDb25maWcoc2V0dGluZywgdmFsdWUsIG9wdGlvbnMpLFxuICAgICAge2dsb2JhbGx5OiBvcHRpb25zLmdsb2JhbH0sXG4gICAgKTtcbiAgfVxuXG4gIHVuc2V0Q29uZmlnKHNldHRpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKHNldHRpbmcpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS51bnNldENvbmZpZyhzZXR0aW5nKSxcbiAgICApO1xuICB9XG5cbiAgLy8gRGlyZWN0IGJsb2IgaW50ZXJhY3Rpb25zXG5cbiAgY3JlYXRlQmxvYihvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuY3JlYXRlQmxvYihvcHRpb25zKTtcbiAgfVxuXG4gIGV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSk7XG4gIH1cblxuICAvLyBEaXNjYXJkIGhpc3RvcnlcblxuICBjcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuY3JlYXRlSGlzdG9yeUJsb2IoKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSBhd2FpdCB0aGlzLmxvYWRIaXN0b3J5UGF5bG9hZCgpO1xuICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkudXBkYXRlSGlzdG9yeShoaXN0b3J5KTtcbiAgfVxuXG4gIGFzeW5jIHN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhmaWxlUGF0aHMsIGlzU2FmZSwgZGVzdHJ1Y3RpdmVBY3Rpb24sIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3Qgc25hcHNob3RzID0gYXdhaXQgdGhpcy5kaXNjYXJkSGlzdG9yeS5zdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoXG4gICAgICBmaWxlUGF0aHMsXG4gICAgICBpc1NhZmUsXG4gICAgICBkZXN0cnVjdGl2ZUFjdGlvbixcbiAgICAgIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgsXG4gICAgKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChzbmFwc2hvdHMpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gICAgfVxuICAgIHJldHVybiBzbmFwc2hvdHM7XG4gIH1cblxuICByZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyhpc1NhZmUsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkucmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIHBvcERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3QgcmVtb3ZlZCA9IGF3YWl0IHRoaXMuZGlzY2FyZEhpc3RvcnkucG9wSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgYXdhaXQgdGhpcy5zYXZlRGlzY2FyZEhpc3RvcnkoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckRpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgdGhpcy5kaXNjYXJkSGlzdG9yeS5jbGVhckhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gIH1cblxuICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICAuLi5wYXRocy5tYXAoZmlsZVBhdGggPT4gS2V5cy5maWxlUGF0Y2gub25lV2l0aChmaWxlUGF0aCwge3N0YWdlZDogZmFsc2V9KSksXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hOb25IZWFkV2l0aEZpbGVzKHBhdGhzKSxcbiAgICAgIF0sXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVudHJhY2tlZEZpbGVzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRVbnRyYWNrZWRGaWxlcygpO1xuICAgICAgICBjb25zdCBbZmlsZXNUb1JlbW92ZSwgZmlsZXNUb0NoZWNrb3V0XSA9IHBhcnRpdGlvbihwYXRocywgZiA9PiB1bnRyYWNrZWRGaWxlcy5pbmNsdWRlcyhmKSk7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuY2hlY2tvdXRGaWxlcyhmaWxlc1RvQ2hlY2tvdXQpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChmaWxlc1RvUmVtb3ZlLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICAgICAgY29uc3QgYWJzUGF0aCA9IHBhdGguam9pbih0aGlzLndvcmtkaXIoKSwgZmlsZVBhdGgpO1xuICAgICAgICAgIHJldHVybiBmcy5yZW1vdmUoYWJzUGF0aCk7XG4gICAgICAgIH0pKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8vIEFjY2Vzc29ycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvLyBJbmRleCBxdWVyaWVzXG5cbiAgZ2V0U3RhdHVzQnVuZGxlKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuc3RhdHVzQnVuZGxlLCBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCB0aGlzLmdpdCgpLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5mb3JtYXRDaGFuZ2VkRmlsZXMoYnVuZGxlKTtcbiAgICAgICAgcmVzdWx0cy5icmFuY2ggPSBidW5kbGUuYnJhbmNoO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgTGFyZ2VSZXBvRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnRyYW5zaXRpb25UbygnVG9vTGFyZ2UnKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYnJhbmNoOiB7fSxcbiAgICAgICAgICAgIHN0YWdlZEZpbGVzOiB7fSxcbiAgICAgICAgICAgIHVuc3RhZ2VkRmlsZXM6IHt9LFxuICAgICAgICAgICAgbWVyZ2VDb25mbGljdEZpbGVzOiB7fSxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZm9ybWF0Q2hhbmdlZEZpbGVzKHtjaGFuZ2VkRW50cmllcywgdW50cmFja2VkRW50cmllcywgcmVuYW1lZEVudHJpZXMsIHVubWVyZ2VkRW50cmllc30pIHtcbiAgICBjb25zdCBzdGF0dXNNYXAgPSB7XG4gICAgICBBOiAnYWRkZWQnLFxuICAgICAgTTogJ21vZGlmaWVkJyxcbiAgICAgIEQ6ICdkZWxldGVkJyxcbiAgICAgIFU6ICdtb2RpZmllZCcsXG4gICAgICBUOiAndHlwZWNoYW5nZScsXG4gICAgfTtcblxuICAgIGNvbnN0IHN0YWdlZEZpbGVzID0ge307XG4gICAgY29uc3QgdW5zdGFnZWRGaWxlcyA9IHt9O1xuICAgIGNvbnN0IG1lcmdlQ29uZmxpY3RGaWxlcyA9IHt9O1xuXG4gICAgY2hhbmdlZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBpZiAoZW50cnkuc3RhZ2VkU3RhdHVzKSB7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcFtlbnRyeS5zdGFnZWRTdGF0dXNdO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnVuc3RhZ2VkU3RhdHVzKSB7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwW2VudHJ5LnVuc3RhZ2VkU3RhdHVzXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHVudHJhY2tlZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgIH0pO1xuXG4gICAgcmVuYW1lZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBpZiAoZW50cnkuc3RhZ2VkU3RhdHVzID09PSAnUicpIHtcbiAgICAgICAgc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5Lm9yaWdGaWxlUGF0aF0gPSBzdGF0dXNNYXAuRDtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS51bnN0YWdlZFN0YXR1cyA9PT0gJ1InKSB7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkub3JpZ0ZpbGVQYXRoXSA9IHN0YXR1c01hcC5EO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnN0YWdlZFN0YXR1cyA9PT0gJ0MnKSB7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnVuc3RhZ2VkU3RhdHVzID09PSAnQycpIHtcbiAgICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBzdGF0dXNUb0hlYWQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVubWVyZ2VkRW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge3N0YWdlZFN0YXR1cywgdW5zdGFnZWRTdGF0dXMsIGZpbGVQYXRofSA9IHVubWVyZ2VkRW50cmllc1tpXTtcbiAgICAgIGlmIChzdGFnZWRTdGF0dXMgPT09ICdVJyB8fCB1bnN0YWdlZFN0YXR1cyA9PT0gJ1UnIHx8IChzdGFnZWRTdGF0dXMgPT09ICdBJyAmJiB1bnN0YWdlZFN0YXR1cyA9PT0gJ0EnKSkge1xuICAgICAgICAvLyBTa2lwcGluZyB0aGlzIGNoZWNrIGhlcmUgYmVjYXVzZSB3ZSBvbmx5IHJ1biBhIHNpbmdsZSBgYXdhaXRgXG4gICAgICAgIC8vIGFuZCB3ZSBvbmx5IHJ1biBpdCBpbiB0aGUgbWFpbiwgc3luY2hyb25vdXMgYm9keSBvZiB0aGUgZm9yIGxvb3AuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgIGlmICghc3RhdHVzVG9IZWFkKSB7IHN0YXR1c1RvSGVhZCA9IGF3YWl0IHRoaXMuZ2l0KCkuZGlmZkZpbGVTdGF0dXMoe3RhcmdldDogJ0hFQUQnfSk7IH1cbiAgICAgICAgbWVyZ2VDb25mbGljdEZpbGVzW2ZpbGVQYXRoXSA9IHtcbiAgICAgICAgICBvdXJzOiBzdGF0dXNNYXBbc3RhZ2VkU3RhdHVzXSxcbiAgICAgICAgICB0aGVpcnM6IHN0YXR1c01hcFt1bnN0YWdlZFN0YXR1c10sXG4gICAgICAgICAgZmlsZTogc3RhdHVzVG9IZWFkW2ZpbGVQYXRoXSB8fCAnZXF1aXZhbGVudCcsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtzdGFnZWRGaWxlcywgdW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfTtcbiAgfVxuXG4gIGFzeW5jIGdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKCkge1xuICAgIGNvbnN0IHtzdGFnZWRGaWxlcywgdW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIHtzdGFnZWRGaWxlcywgdW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaEZvclBhdGgoZmlsZVBhdGgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgc3RhZ2VkOiBmYWxzZSxcbiAgICAgIHBhdGNoQnVmZmVyOiBudWxsLFxuICAgICAgYnVpbGRlcjoge30sXG4gICAgICBiZWZvcmU6ICgpID0+IHt9LFxuICAgICAgYWZ0ZXI6ICgpID0+IHt9LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5maWxlUGF0Y2gub25lV2l0aChmaWxlUGF0aCwge3N0YWdlZDogb3B0cy5zdGFnZWR9KSwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlmZnMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIHtzdGFnZWQ6IG9wdHMuc3RhZ2VkfSk7XG4gICAgICBjb25zdCBwYXlsb2FkID0gb3B0cy5iZWZvcmUoKTtcbiAgICAgIGNvbnN0IHBhdGNoID0gYnVpbGRGaWxlUGF0Y2goZGlmZnMsIG9wdHMuYnVpbGRlcik7XG4gICAgICBpZiAob3B0cy5wYXRjaEJ1ZmZlciAhPT0gbnVsbCkgeyBwYXRjaC5hZG9wdEJ1ZmZlcihvcHRzLnBhdGNoQnVmZmVyKTsgfVxuICAgICAgb3B0cy5hZnRlcihwYXRjaCwgcGF5bG9hZCk7XG4gICAgICByZXR1cm4gcGF0Y2g7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCBiYXNlQ29tbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5maWxlUGF0Y2gub25lV2l0aChmaWxlUGF0aCwge2Jhc2VDb21taXR9KSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwge2Jhc2VDb21taXR9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFN0YWdlZENoYW5nZXNQYXRjaChvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGJ1aWxkZXI6IHt9LFxuICAgICAgcGF0Y2hCdWZmZXI6IG51bGwsXG4gICAgICBiZWZvcmU6ICgpID0+IHt9LFxuICAgICAgYWZ0ZXI6ICgpID0+IHt9LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5zdGFnZWRDaGFuZ2VzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkaWZmcyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoKCk7XG4gICAgICBjb25zdCBwYXlsb2FkID0gb3B0cy5iZWZvcmUoKTtcbiAgICAgIGNvbnN0IHBhdGNoID0gYnVpbGRNdWx0aUZpbGVQYXRjaChkaWZmcywgb3B0cy5idWlsZGVyKTtcbiAgICAgIGlmIChvcHRzLnBhdGNoQnVmZmVyICE9PSBudWxsKSB7IHBhdGNoLmFkb3B0QnVmZmVyKG9wdHMucGF0Y2hCdWZmZXIpOyB9XG4gICAgICBvcHRzLmFmdGVyKHBhdGNoLCBwYXlsb2FkKTtcbiAgICAgIHJldHVybiBwYXRjaDtcbiAgICB9KTtcbiAgfVxuXG4gIHJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5pbmRleC5vbmVXaXRoKGZpbGVQYXRoKSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkucmVhZEZpbGVGcm9tSW5kZXgoZmlsZVBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQ29tbWl0IGFjY2Vzc1xuXG4gIGdldExhc3RDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5sYXN0Q29tbWl0LCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBoZWFkQ29tbWl0ID0gYXdhaXQgdGhpcy5naXQoKS5nZXRIZWFkQ29tbWl0KCk7XG4gICAgICByZXR1cm4gaGVhZENvbW1pdC51bmJvcm5SZWYgPyBDb21taXQuY3JlYXRlVW5ib3JuKCkgOiBuZXcgQ29tbWl0KGhlYWRDb21taXQpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29tbWl0KHNoYSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYmxvYi5vbmVXaXRoKHNoYSksIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IFtyYXdDb21taXRdID0gYXdhaXQgdGhpcy5naXQoKS5nZXRDb21taXRzKHttYXg6IDEsIHJlZjogc2hhLCBpbmNsdWRlUGF0Y2g6IHRydWV9KTtcbiAgICAgIGNvbnN0IGNvbW1pdCA9IG5ldyBDb21taXQocmF3Q29tbWl0KTtcbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSk7XG4gIH1cblxuICBnZXRSZWNlbnRDb21taXRzKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnJlY2VudENvbW1pdHMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbW1pdHMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldENvbW1pdHMoe3JlZjogJ0hFQUQnLCAuLi5vcHRpb25zfSk7XG4gICAgICByZXR1cm4gY29tbWl0cy5tYXAoY29tbWl0ID0+IG5ldyBDb21taXQoY29tbWl0KSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBpc0NvbW1pdFB1c2hlZChzaGEpIHtcbiAgICBjb25zdCBjdXJyZW50QnJhbmNoID0gYXdhaXQgdGhpcy5yZXBvc2l0b3J5LmdldEN1cnJlbnRCcmFuY2goKTtcbiAgICBjb25zdCB1cHN0cmVhbSA9IGN1cnJlbnRCcmFuY2guZ2V0UHVzaCgpO1xuICAgIGlmICghdXBzdHJlYW0uaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZWQgPSBhd2FpdCB0aGlzLmdpdCgpLmdldEJyYW5jaGVzV2l0aENvbW1pdChzaGEsIHtcbiAgICAgIHNob3dMb2NhbDogZmFsc2UsXG4gICAgICBzaG93UmVtb3RlOiB0cnVlLFxuICAgICAgcGF0dGVybjogdXBzdHJlYW0uZ2V0U2hvcnRSZWYoKSxcbiAgICB9KTtcbiAgICByZXR1cm4gY29udGFpbmVkLnNvbWUocmVmID0+IHJlZi5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIC8vIEF1dGhvciBpbmZvcm1hdGlvblxuXG4gIGdldEF1dGhvcnMob3B0aW9ucykge1xuICAgIC8vIEZvciBub3cgd2UnbGwgZG8gdGhlIG5haXZlIHRoaW5nIGFuZCBpbnZhbGlkYXRlIGFueXRpbWUgSEVBRCBtb3Zlcy4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgZ2V0IG5ldyBhdXRob3JzXG4gICAgLy8gaW50cm9kdWNlZCBieSBuZXdseSBjcmVhdGVkIGNvbW1pdHMgb3IgcHVsbGVkIGNvbW1pdHMuXG4gICAgLy8gVGhpcyBtZWFucyB0aGF0IHdlIGFyZSBjb25zdGFudGx5IHJlLWZldGNoaW5nIGRhdGEuIElmIHBlcmZvcm1hbmNlIGJlY29tZXMgYSBjb25jZXJuIHdlIGNhbiBvcHRpbWl6ZVxuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYXV0aG9ycywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYXV0aG9yTWFwID0gYXdhaXQgdGhpcy5naXQoKS5nZXRBdXRob3JzKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF1dGhvck1hcCkubWFwKGVtYWlsID0+IG5ldyBBdXRob3IoZW1haWwsIGF1dGhvck1hcFtlbWFpbF0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEJyYW5jaGVzXG5cbiAgZ2V0QnJhbmNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5icmFuY2hlcywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZHMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldEJyYW5jaGVzKCk7XG4gICAgICBjb25zdCBicmFuY2hlcyA9IG5ldyBCcmFuY2hTZXQoKTtcbiAgICAgIGZvciAoY29uc3QgcGF5bG9hZCBvZiBwYXlsb2Fkcykge1xuICAgICAgICBsZXQgdXBzdHJlYW0gPSBudWxsQnJhbmNoO1xuICAgICAgICBpZiAocGF5bG9hZC51cHN0cmVhbSkge1xuICAgICAgICAgIHVwc3RyZWFtID0gcGF5bG9hZC51cHN0cmVhbS5yZW1vdGVOYW1lXG4gICAgICAgICAgICA/IEJyYW5jaC5jcmVhdGVSZW1vdGVUcmFja2luZyhcbiAgICAgICAgICAgICAgcGF5bG9hZC51cHN0cmVhbS50cmFja2luZ1JlZixcbiAgICAgICAgICAgICAgcGF5bG9hZC51cHN0cmVhbS5yZW1vdGVOYW1lLFxuICAgICAgICAgICAgICBwYXlsb2FkLnVwc3RyZWFtLnJlbW90ZVJlZixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogbmV3IEJyYW5jaChwYXlsb2FkLnVwc3RyZWFtLnRyYWNraW5nUmVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwdXNoID0gdXBzdHJlYW07XG4gICAgICAgIGlmIChwYXlsb2FkLnB1c2gpIHtcbiAgICAgICAgICBwdXNoID0gcGF5bG9hZC5wdXNoLnJlbW90ZU5hbWVcbiAgICAgICAgICAgID8gQnJhbmNoLmNyZWF0ZVJlbW90ZVRyYWNraW5nKFxuICAgICAgICAgICAgICBwYXlsb2FkLnB1c2gudHJhY2tpbmdSZWYsXG4gICAgICAgICAgICAgIHBheWxvYWQucHVzaC5yZW1vdGVOYW1lLFxuICAgICAgICAgICAgICBwYXlsb2FkLnB1c2gucmVtb3RlUmVmLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBuZXcgQnJhbmNoKHBheWxvYWQucHVzaC50cmFja2luZ1JlZik7XG4gICAgICAgIH1cblxuICAgICAgICBicmFuY2hlcy5hZGQobmV3IEJyYW5jaChwYXlsb2FkLm5hbWUsIHVwc3RyZWFtLCBwdXNoLCBwYXlsb2FkLmhlYWQsIHtzaGE6IHBheWxvYWQuc2hhfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJyYW5jaGVzO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SGVhZERlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuaGVhZERlc2NyaXB0aW9uLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5kZXNjcmliZUhlYWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lcmdpbmcgYW5kIHJlYmFzaW5nIHN0YXR1c1xuXG4gIGlzTWVyZ2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5pc01lcmdpbmcodGhpcy5yZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSk7XG4gIH1cblxuICBpc1JlYmFzaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmlzUmViYXNpbmcodGhpcy5yZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSk7XG4gIH1cblxuICAvLyBSZW1vdGVzXG5cbiAgZ2V0UmVtb3RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnJlbW90ZXMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlbW90ZXNJbmZvID0gYXdhaXQgdGhpcy5naXQoKS5nZXRSZW1vdGVzKCk7XG4gICAgICByZXR1cm4gbmV3IFJlbW90ZVNldChcbiAgICAgICAgcmVtb3Rlc0luZm8ubWFwKCh7bmFtZSwgdXJsfSkgPT4gbmV3IFJlbW90ZShuYW1lLCB1cmwpKSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRSZW1vdGUobmFtZSwgdXJsKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgLi4uS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKGByZW1vdGUuJHtuYW1lfS51cmxgKSxcbiAgICAgICAgLi4uS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKGByZW1vdGUuJHtuYW1lfS5mZXRjaGApLFxuICAgICAgICBLZXlzLnJlbW90ZXMsXG4gICAgICBdLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ0FERFJFTU9URScsIGFzeW5jIChuYW1lLCB1cmwpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5hZGRSZW1vdGUobmFtZSwgdXJsKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSZW1vdGUobmFtZSwgdXJsKTtcbiAgICAgIH0sIG5hbWUsIHVybCksXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGdldEFoZWFkQ291bnQoYnJhbmNoTmFtZSkge1xuICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIGJ1bmRsZS5icmFuY2guYWhlYWRCZWhpbmQuYWhlYWQ7XG4gIH1cblxuICBhc3luYyBnZXRCZWhpbmRDb3VudChicmFuY2hOYW1lKSB7XG4gICAgY29uc3QgYnVuZGxlID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gYnVuZGxlLmJyYW5jaC5haGVhZEJlaGluZC5iZWhpbmQ7XG4gIH1cblxuICBnZXRDb25maWcob3B0aW9uLCB7bG9jYWx9ID0ge2xvY2FsOiBmYWxzZX0pIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmNvbmZpZy5vbmVXaXRoKG9wdGlvbiwge2xvY2FsfSksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmdldENvbmZpZyhvcHRpb24sIHtsb2NhbH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGlyZWN0R2V0Q29uZmlnKGtleSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdldENvbmZpZyhrZXksIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gRGlyZWN0IGJsb2IgYWNjZXNzXG5cbiAgZ2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYmxvYi5vbmVXaXRoKHNoYSksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmdldEJsb2JDb250ZW50cyhzaGEpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlyZWN0R2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiB0aGlzLmdldEJsb2JDb250ZW50cyhzaGEpO1xuICB9XG5cbiAgLy8gRGlzY2FyZCBoaXN0b3J5XG5cbiAgaGFzRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5oYXNIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgZ2V0RGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5nZXRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5nZXRMYXN0U25hcHNob3RzKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgLy8gQ2FjaGVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgfVxuXG4gIGludmFsaWRhdGUoc3BlYywgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIGJvZHkoKS50aGVuKFxuICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgdGhpcy5hY2NlcHRJbnZhbGlkYXRpb24oc3BlYywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgdGhpcy5hY2NlcHRJbnZhbGlkYXRpb24oc3BlYywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKFByZXNlbnQpO1xuXG5mdW5jdGlvbiBwYXJ0aXRpb24oYXJyYXksIHByZWRpY2F0ZSkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGNvbnN0IG5vbm1hdGNoZXMgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICBtYXRjaGVzLnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vbm1hdGNoZXMucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gW21hdGNoZXMsIG5vbm1hdGNoZXNdO1xufVxuXG5jbGFzcyBDYWNoZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3RvcmFnZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJ5R3JvdXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgZ2V0T3JTZXQoa2V5LCBvcGVyYXRpb24pIHtcbiAgICBjb25zdCBwcmltYXJ5ID0ga2V5LmdldFByaW1hcnkoKTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuc3RvcmFnZS5nZXQocHJpbWFyeSk7XG4gICAgaWYgKGV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGV4aXN0aW5nLmhpdHMrKztcbiAgICAgIHJldHVybiBleGlzdGluZy5wcm9taXNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZWQgPSBvcGVyYXRpb24oKTtcblxuICAgIHRoaXMuc3RvcmFnZS5zZXQocHJpbWFyeSwge1xuICAgICAgY3JlYXRlZEF0OiBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICAgIGhpdHM6IDAsXG4gICAgICBwcm9taXNlOiBjcmVhdGVkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JvdXBzID0ga2V5LmdldEdyb3VwcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncm91cCA9IGdyb3Vwc1tpXTtcbiAgICAgIGxldCBncm91cFNldCA9IHRoaXMuYnlHcm91cC5nZXQoZ3JvdXApO1xuICAgICAgaWYgKGdyb3VwU2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZ3JvdXBTZXQgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuYnlHcm91cC5zZXQoZ3JvdXAsIGdyb3VwU2V0KTtcbiAgICAgIH1cbiAgICAgIGdyb3VwU2V0LmFkZChrZXkpO1xuICAgIH1cblxuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG5cbiAgICByZXR1cm4gY3JlYXRlZDtcbiAgfVxuXG4gIGludmFsaWRhdGUoa2V5cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5c1tpXS5yZW1vdmVGcm9tQ2FjaGUodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKGtleXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBrZXlzSW5Hcm91cChncm91cCkge1xuICAgIHJldHVybiB0aGlzLmJ5R3JvdXAuZ2V0KGdyb3VwKSB8fCBbXTtcbiAgfVxuXG4gIHJlbW92ZVByaW1hcnkocHJpbWFyeSkge1xuICAgIHRoaXMuc3RvcmFnZS5kZWxldGUocHJpbWFyeSk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21Hcm91cChncm91cCwga2V5KSB7XG4gICAgY29uc3QgZ3JvdXBTZXQgPSB0aGlzLmJ5R3JvdXAuZ2V0KGdyb3VwKTtcbiAgICBncm91cFNldCAmJiBncm91cFNldC5kZWxldGUoa2V5KTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcbiAgICB0aGlzLmJ5R3JvdXAuY2xlYXIoKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgZGlkVXBkYXRlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJyk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBvbkRpZFVwZGF0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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