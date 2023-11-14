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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfc3RhdGUiLCJfa2V5cyIsIl9naXRTaGVsbE91dFN0cmF0ZWd5IiwiX3dvcmtzcGFjZUNoYW5nZU9ic2VydmVyIiwiX3BhdGNoIiwiX2Rpc2NhcmRIaXN0b3J5IiwiX2JyYW5jaCIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX2F1dGhvciIsIl9icmFuY2hTZXQiLCJfcmVtb3RlIiwiX3JlbW90ZVNldCIsIl9jb21taXQiLCJfb3BlcmF0aW9uU3RhdGVzIiwiX3JlcG9ydGVyUHJveHkiLCJfaGVscGVycyIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsImUiLCJXZWFrTWFwIiwiciIsInQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm9iaiIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiUHJlc2VudCIsIlN0YXRlIiwiY29uc3RydWN0b3IiLCJyZXBvc2l0b3J5IiwiaGlzdG9yeSIsImNhY2hlIiwiQ2FjaGUiLCJkaXNjYXJkSGlzdG9yeSIsIkRpc2NhcmRIaXN0b3J5IiwiY3JlYXRlQmxvYiIsImJpbmQiLCJleHBhbmRCbG9iVG9GaWxlIiwibWVyZ2VGaWxlIiwid29ya2RpciIsIm1heEhpc3RvcnlMZW5ndGgiLCJvcGVyYXRpb25TdGF0ZXMiLCJPcGVyYXRpb25TdGF0ZXMiLCJkaWRVcGRhdGUiLCJjb21taXRNZXNzYWdlIiwiY29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZmV0Y2hJbml0aWFsTWVzc2FnZSIsInVwZGF0ZUhpc3RvcnkiLCJzZXRDb21taXRNZXNzYWdlIiwibWVzc2FnZSIsInN1cHByZXNzVXBkYXRlIiwic2V0Q29tbWl0TWVzc2FnZVRlbXBsYXRlIiwidGVtcGxhdGUiLCJtZXJnZU1lc3NhZ2UiLCJnZXRNZXJnZU1lc3NhZ2UiLCJmZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSIsImdldENvbW1pdE1lc3NhZ2UiLCJnaXQiLCJnZXRPcGVyYXRpb25TdGF0ZXMiLCJpc1ByZXNlbnQiLCJkZXN0cm95Iiwic2hvd1N0YXR1c0JhclRpbGVzIiwiaXNQdWJsaXNoYWJsZSIsImFjY2VwdEludmFsaWRhdGlvbiIsInNwZWMiLCJnbG9iYWxseSIsImludmFsaWRhdGUiLCJkaWRHbG9iYWxseUludmFsaWRhdGUiLCJpbnZhbGlkYXRlQ2FjaGVBZnRlckZpbGVzeXN0ZW1DaGFuZ2UiLCJldmVudHMiLCJwYXRocyIsIm1hcCIsInNwZWNpYWwiLCJwYXRoIiwiU2V0IiwiZnVsbFBhdGgiLCJGT0NVUyIsImFkZCIsIktleXMiLCJzdGF0dXNCdW5kbGUiLCJrIiwiZmlsZVBhdGNoIiwiZWFjaFdpdGhPcHRzIiwic3RhZ2VkIiwiaW5jbHVkZXMiLCJzZWdtZW50cyIsImpvaW4iLCJmaWxlUGF0aEVuZHNXaXRoIiwic3RhZ2VkQ2hhbmdlcyIsImFsbCIsImluZGV4IiwiYnJhbmNoZXMiLCJsYXN0Q29tbWl0IiwicmVjZW50Q29tbWl0cyIsImhlYWREZXNjcmlwdGlvbiIsImF1dGhvcnMiLCJyZW1vdGVzIiwiY29uZmlnIiwicmVsYXRpdmVQYXRoIiwicmVsYXRpdmUiLCJlYWNoV2l0aEZpbGVPcHRzIiwic2l6ZSIsIkFycmF5IiwiZnJvbSIsImlzQ29tbWl0TWVzc2FnZUNsZWFuIiwidHJpbSIsInVwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UiLCJldmVudCIsImFjdGlvbiIsIm9ic2VydmVGaWxlc3lzdGVtQ2hhbmdlIiwicmVmcmVzaCIsImNsZWFyIiwiaW5pdCIsImNhdGNoIiwic3RkRXJyIiwiUHJvbWlzZSIsInJlamVjdCIsImNsb25lIiwic3RhZ2VGaWxlcyIsImNhY2hlT3BlcmF0aW9uS2V5cyIsInVuc3RhZ2VGaWxlcyIsInN0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0Iiwic3RhZ2VGaWxlTW9kZUNoYW5nZSIsImZpbGVQYXRoIiwiZmlsZU1vZGUiLCJzdGFnZUZpbGVTeW1saW5rQ2hhbmdlIiwiYXBwbHlQYXRjaFRvSW5kZXgiLCJtdWx0aUZpbGVQYXRjaCIsImdldFBhdGhTZXQiLCJwYXRjaFN0ciIsInRvU3RyaW5nIiwiYXBwbHlQYXRjaCIsImFwcGx5UGF0Y2hUb1dvcmtkaXIiLCJ3b3JrZGlyT3BlcmF0aW9uS2V5cyIsImNvbW1pdCIsIm9wdGlvbnMiLCJoZWFkT3BlcmF0aW9uS2V5cyIsImV4ZWN1dGVQaXBlbGluZUFjdGlvbiIsImNvQXV0aG9ycyIsIm9wdHMiLCJhdXRob3IiLCJlbWFpbCIsImdldEVtYWlsIiwibmFtZSIsImdldEZ1bGxOYW1lIiwidW5zdGFnZWRGaWxlcyIsIm1lcmdlQ29uZmxpY3RGaWxlcyIsImdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzIiwidW5zdGFnZWRDb3VudCIsImFkZEV2ZW50IiwicGFja2FnZSIsInBhcnRpYWwiLCJhbWVuZCIsImNvQXV0aG9yQ291bnQiLCJtZXJnZSIsImJyYW5jaE5hbWUiLCJhYm9ydE1lcmdlIiwiY2hlY2tvdXRTaWRlIiwic2lkZSIsIm91cnNQYXRoIiwiY29tbW9uQmFzZVBhdGgiLCJ0aGVpcnNQYXRoIiwicmVzdWx0UGF0aCIsIndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgiLCJjb21tb25CYXNlU2hhIiwib3Vyc1NoYSIsInRoZWlyc1NoYSIsIm9uZVdpdGgiLCJjaGVja291dCIsInJldmlzaW9uIiwiYWxsQWdhaW5zdE5vbkhlYWQiLCJjaGVja291dFBhdGhzQXRSZXZpc2lvbiIsImZpbGVOYW1lIiwiZWFjaE5vbkhlYWRXaXRoRmlsZXMiLCJjaGVja291dEZpbGVzIiwidW5kb0xhc3RDb21taXQiLCJyZXNldCIsInRlc3QiLCJkZWxldGVSZWYiLCJmZXRjaCIsImZpbmFsUmVtb3RlTmFtZSIsInJlbW90ZU5hbWUiLCJyZW1vdGUiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJnZXROYW1lIiwicHVsbCIsInNldFVwc3RyZWFtIiwiZWFjaFdpdGhTZXR0aW5nIiwiZ2V0TmFtZU9yIiwic2V0Q29uZmlnIiwic2V0dGluZyIsImdsb2JhbCIsInVuc2V0Q29uZmlnIiwiYWJzRmlsZVBhdGgiLCJzaGEiLCJjcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IiLCJjcmVhdGVIaXN0b3J5QmxvYiIsInVwZGF0ZURpc2NhcmRIaXN0b3J5IiwibG9hZEhpc3RvcnlQYXlsb2FkIiwic3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzIiwiZmlsZVBhdGhzIiwiaXNTYWZlIiwiZGVzdHJ1Y3RpdmVBY3Rpb24iLCJwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoIiwic25hcHNob3RzIiwic2F2ZURpc2NhcmRIaXN0b3J5IiwicmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMiLCJwb3BEaXNjYXJkSGlzdG9yeSIsInJlbW92ZWQiLCJwb3BIaXN0b3J5IiwiY2xlYXJEaXNjYXJkSGlzdG9yeSIsImNsZWFySGlzdG9yeSIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwidW50cmFja2VkRmlsZXMiLCJnZXRVbnRyYWNrZWRGaWxlcyIsImZpbGVzVG9SZW1vdmUiLCJmaWxlc1RvQ2hlY2tvdXQiLCJwYXJ0aXRpb24iLCJmIiwiYWJzUGF0aCIsImZzIiwicmVtb3ZlIiwiZ2V0U3RhdHVzQnVuZGxlIiwiZ2V0T3JTZXQiLCJidW5kbGUiLCJyZXN1bHRzIiwiZm9ybWF0Q2hhbmdlZEZpbGVzIiwiYnJhbmNoIiwiZXJyIiwiTGFyZ2VSZXBvRXJyb3IiLCJ0cmFuc2l0aW9uVG8iLCJzdGFnZWRGaWxlcyIsImNoYW5nZWRFbnRyaWVzIiwidW50cmFja2VkRW50cmllcyIsInJlbmFtZWRFbnRyaWVzIiwidW5tZXJnZWRFbnRyaWVzIiwic3RhdHVzTWFwIiwiQSIsIk0iLCJEIiwiVSIsIlQiLCJlbnRyeSIsInN0YWdlZFN0YXR1cyIsInVuc3RhZ2VkU3RhdHVzIiwib3JpZ0ZpbGVQYXRoIiwic3RhdHVzVG9IZWFkIiwiZGlmZkZpbGVTdGF0dXMiLCJ0YXJnZXQiLCJvdXJzIiwidGhlaXJzIiwiZmlsZSIsImdldEZpbGVQYXRjaEZvclBhdGgiLCJwYXRjaEJ1ZmZlciIsImJ1aWxkZXIiLCJiZWZvcmUiLCJhZnRlciIsImRpZmZzIiwiZ2V0RGlmZnNGb3JGaWxlUGF0aCIsInBheWxvYWQiLCJwYXRjaCIsImJ1aWxkRmlsZVBhdGNoIiwiYWRvcHRCdWZmZXIiLCJiYXNlQ29tbWl0IiwiZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoIiwiYnVpbGRNdWx0aUZpbGVQYXRjaCIsInJlYWRGaWxlRnJvbUluZGV4IiwiZ2V0TGFzdENvbW1pdCIsImhlYWRDb21taXQiLCJnZXRIZWFkQ29tbWl0IiwidW5ib3JuUmVmIiwiQ29tbWl0IiwiY3JlYXRlVW5ib3JuIiwiZ2V0Q29tbWl0IiwiYmxvYiIsInJhd0NvbW1pdCIsImdldENvbW1pdHMiLCJtYXgiLCJyZWYiLCJpbmNsdWRlUGF0Y2giLCJnZXRSZWNlbnRDb21taXRzIiwiY29tbWl0cyIsImlzQ29tbWl0UHVzaGVkIiwiY3VycmVudEJyYW5jaCIsImdldEN1cnJlbnRCcmFuY2giLCJ1cHN0cmVhbSIsImdldFB1c2giLCJjb250YWluZWQiLCJnZXRCcmFuY2hlc1dpdGhDb21taXQiLCJzaG93TG9jYWwiLCJzaG93UmVtb3RlIiwicGF0dGVybiIsImdldFNob3J0UmVmIiwic29tZSIsImdldEF1dGhvcnMiLCJhdXRob3JNYXAiLCJBdXRob3IiLCJnZXRCcmFuY2hlcyIsInBheWxvYWRzIiwiQnJhbmNoU2V0IiwibnVsbEJyYW5jaCIsIkJyYW5jaCIsImNyZWF0ZVJlbW90ZVRyYWNraW5nIiwidHJhY2tpbmdSZWYiLCJyZW1vdGVSZWYiLCJoZWFkIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiZGVzY3JpYmVIZWFkIiwiaXNNZXJnaW5nIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsImlzUmViYXNpbmciLCJnZXRSZW1vdGVzIiwicmVtb3Rlc0luZm8iLCJSZW1vdGVTZXQiLCJ1cmwiLCJSZW1vdGUiLCJhZGRSZW1vdGUiLCJnZXRBaGVhZENvdW50IiwiYWhlYWRCZWhpbmQiLCJhaGVhZCIsImdldEJlaGluZENvdW50IiwiYmVoaW5kIiwiZ2V0Q29uZmlnIiwib3B0aW9uIiwibG9jYWwiLCJkaXJlY3RHZXRDb25maWciLCJnZXRCbG9iQ29udGVudHMiLCJkaXJlY3RHZXRCbG9iQ29udGVudHMiLCJoYXNEaXNjYXJkSGlzdG9yeSIsImhhc0hpc3RvcnkiLCJnZXREaXNjYXJkSGlzdG9yeSIsImdldEhpc3RvcnkiLCJnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyIsImdldExhc3RTbmFwc2hvdHMiLCJnZXRDYWNoZSIsImJvZHkiLCJ0aGVuIiwicmVzdWx0IiwiZXhwb3J0cyIsInJlZ2lzdGVyIiwiYXJyYXkiLCJwcmVkaWNhdGUiLCJtYXRjaGVzIiwibm9ubWF0Y2hlcyIsIml0ZW0iLCJzdG9yYWdlIiwiTWFwIiwiYnlHcm91cCIsImVtaXR0ZXIiLCJFbWl0dGVyIiwib3BlcmF0aW9uIiwicHJpbWFyeSIsImdldFByaW1hcnkiLCJleGlzdGluZyIsImhpdHMiLCJwcm9taXNlIiwiY3JlYXRlZCIsImNyZWF0ZWRBdCIsInBlcmZvcm1hbmNlIiwibm93IiwiZ3JvdXBzIiwiZ2V0R3JvdXBzIiwiZ3JvdXAiLCJncm91cFNldCIsInJlbW92ZUZyb21DYWNoZSIsImtleXNJbkdyb3VwIiwicmVtb3ZlUHJpbWFyeSIsImRlbGV0ZSIsInJlbW92ZUZyb21Hcm91cCIsIml0ZXJhdG9yIiwiZW1pdCIsIm9uRGlkVXBkYXRlIiwiY2FsbGJhY2siLCJvbiIsImRpc3Bvc2UiXSwic291cmNlcyI6WyJwcmVzZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuaW1wb3J0IHtLZXlzfSBmcm9tICcuL2NhY2hlL2tleXMnO1xuXG5pbXBvcnQge0xhcmdlUmVwb0Vycm9yfSBmcm9tICcuLi8uLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcbmltcG9ydCB7Rk9DVVN9IGZyb20gJy4uL3dvcmtzcGFjZS1jaGFuZ2Utb2JzZXJ2ZXInO1xuaW1wb3J0IHtidWlsZEZpbGVQYXRjaCwgYnVpbGRNdWx0aUZpbGVQYXRjaH0gZnJvbSAnLi4vcGF0Y2gnO1xuaW1wb3J0IERpc2NhcmRIaXN0b3J5IGZyb20gJy4uL2Rpc2NhcmQtaGlzdG9yeSc7XG5pbXBvcnQgQnJhbmNoLCB7bnVsbEJyYW5jaH0gZnJvbSAnLi4vYnJhbmNoJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi4vYXV0aG9yJztcbmltcG9ydCBCcmFuY2hTZXQgZnJvbSAnLi4vYnJhbmNoLXNldCc7XG5pbXBvcnQgUmVtb3RlIGZyb20gJy4uL3JlbW90ZSc7XG5pbXBvcnQgUmVtb3RlU2V0IGZyb20gJy4uL3JlbW90ZS1zZXQnO1xuaW1wb3J0IENvbW1pdCBmcm9tICcuLi9jb21taXQnO1xuaW1wb3J0IE9wZXJhdGlvblN0YXRlcyBmcm9tICcuLi9vcGVyYXRpb24tc3RhdGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uLy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7ZmlsZVBhdGhFbmRzV2l0aH0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5cbi8qKlxuICogU3RhdGUgdXNlZCB3aGVuIHRoZSB3b3JraW5nIGRpcmVjdG9yeSBjb250YWlucyBhIHZhbGlkIGdpdCByZXBvc2l0b3J5IGFuZCBjYW4gYmUgaW50ZXJhY3RlZCB3aXRoLiBQZXJmb3Jtc1xuICogYWN0dWFsIGdpdCBvcGVyYXRpb25zLCBjYWNoaW5nIHRoZSByZXN1bHRzLCBhbmQgYnJvYWRjYXN0cyBgb25EaWRVcGRhdGVgIGV2ZW50cyB3aGVuIHdyaXRlIGFjdGlvbnMgYXJlXG4gKiBwZXJmb3JtZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbnQgZXh0ZW5kcyBTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHJlcG9zaXRvcnksIGhpc3RvcnkpIHtcbiAgICBzdXBlcihyZXBvc2l0b3J5KTtcblxuICAgIHRoaXMuY2FjaGUgPSBuZXcgQ2FjaGUoKTtcblxuICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkgPSBuZXcgRGlzY2FyZEhpc3RvcnkoXG4gICAgICB0aGlzLmNyZWF0ZUJsb2IuYmluZCh0aGlzKSxcbiAgICAgIHRoaXMuZXhwYW5kQmxvYlRvRmlsZS5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy5tZXJnZUZpbGUuYmluZCh0aGlzKSxcbiAgICAgIHRoaXMud29ya2RpcigpLFxuICAgICAge21heEhpc3RvcnlMZW5ndGg6IDYwfSxcbiAgICApO1xuXG4gICAgdGhpcy5vcGVyYXRpb25TdGF0ZXMgPSBuZXcgT3BlcmF0aW9uU3RhdGVzKHtkaWRVcGRhdGU6IHRoaXMuZGlkVXBkYXRlLmJpbmQodGhpcyl9KTtcblxuICAgIHRoaXMuY29tbWl0TWVzc2FnZSA9ICcnO1xuICAgIHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlID0gbnVsbDtcbiAgICB0aGlzLmZldGNoSW5pdGlhbE1lc3NhZ2UoKTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkudXBkYXRlSGlzdG9yeShoaXN0b3J5KTtcbiAgICB9XG4gIH1cblxuICBzZXRDb21taXRNZXNzYWdlKG1lc3NhZ2UsIHtzdXBwcmVzc1VwZGF0ZX0gPSB7c3VwcHJlc3NVcGRhdGU6IGZhbHNlfSkge1xuICAgIHRoaXMuY29tbWl0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgaWYgKCFzdXBwcmVzc1VwZGF0ZSkge1xuICAgICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBzZXRDb21taXRNZXNzYWdlVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgICB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hJbml0aWFsTWVzc2FnZSgpIHtcbiAgICBjb25zdCBtZXJnZU1lc3NhZ2UgPSBhd2FpdCB0aGlzLnJlcG9zaXRvcnkuZ2V0TWVyZ2VNZXNzYWdlKCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cbiAgICBpZiAobWVyZ2VNZXNzYWdlKSB7XG4gICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UobWVyZ2VNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbW1pdE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0TWVzc2FnZTtcbiAgfVxuXG4gIGZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gIH1cblxuICBnZXRPcGVyYXRpb25TdGF0ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlcmF0aW9uU3RhdGVzO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNhY2hlLmRlc3Ryb3koKTtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gIH1cblxuICBzaG93U3RhdHVzQmFyVGlsZXMoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1B1Ymxpc2hhYmxlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMsIHtnbG9iYWxseX0gPSB7fSkge1xuICAgIHRoaXMuY2FjaGUuaW52YWxpZGF0ZShzcGVjKCkpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgaWYgKGdsb2JhbGx5KSB7XG4gICAgICB0aGlzLmRpZEdsb2JhbGx5SW52YWxpZGF0ZShzcGVjKTtcbiAgICB9XG4gIH1cblxuICBpbnZhbGlkYXRlQ2FjaGVBZnRlckZpbGVzeXN0ZW1DaGFuZ2UoZXZlbnRzKSB7XG4gICAgY29uc3QgcGF0aHMgPSBldmVudHMubWFwKGUgPT4gZS5zcGVjaWFsIHx8IGUucGF0aCk7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGhzW2ldO1xuXG4gICAgICBpZiAoZnVsbFBhdGggPT09IEZPQ1VTKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIEtleXMuZmlsZVBhdGNoLmVhY2hXaXRoT3B0cyh7c3RhZ2VkOiBmYWxzZX0pKSB7XG4gICAgICAgICAga2V5cy5hZGQoayk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluY2x1ZGVzID0gKC4uLnNlZ21lbnRzKSA9PiBmdWxsUGF0aC5pbmNsdWRlcyhwYXRoLmpvaW4oLi4uc2VnbWVudHMpKTtcblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZnVsbFBhdGgsICcuZ2l0JywgJ2luZGV4JykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGFnZWRDaGFuZ2VzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5maWxlUGF0Y2guYWxsKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5pbmRleC5hbGwpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChmdWxsUGF0aCwgJy5naXQnLCAnSEVBRCcpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMuYnJhbmNoZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmxhc3RDb21taXQpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlY2VudENvbW1pdHMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaGVhZERlc2NyaXB0aW9uKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5hdXRob3JzKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlcygnLmdpdCcsICdyZWZzJywgJ2hlYWRzJykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5icmFuY2hlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMubGFzdENvbW1pdCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVjZW50Q29tbWl0cyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaGVhZERlc2NyaXB0aW9uKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5hdXRob3JzKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlcygnLmdpdCcsICdyZWZzJywgJ3JlbW90ZXMnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlbW90ZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaGVhZERlc2NyaXB0aW9uKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGZ1bGxQYXRoLCAnLmdpdCcsICdjb25maWcnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlbW90ZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmNvbmZpZy5hbGwpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGaWxlIGNoYW5nZSB3aXRoaW4gdGhlIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHRoaXMud29ya2RpcigpLCBmdWxsUGF0aCk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBLZXlzLmZpbGVQYXRjaC5lYWNoV2l0aEZpbGVPcHRzKFtyZWxhdGl2ZVBhdGhdLCBbe3N0YWdlZDogZmFsc2V9XSkpIHtcbiAgICAgICAga2V5cy5hZGQoa2V5KTtcbiAgICAgIH1cbiAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChrZXlzLnNpemUgPiAwKSB7XG4gICAgICB0aGlzLmNhY2hlLmludmFsaWRhdGUoQXJyYXkuZnJvbShrZXlzKSk7XG4gICAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ29tbWl0TWVzc2FnZUNsZWFuKCkge1xuICAgIGlmICh0aGlzLmNvbW1pdE1lc3NhZ2UudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWl0TWVzc2FnZSA9PT0gdGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UoZXZlbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnRzW2ldO1xuXG4gICAgICBpZiAoIWV2ZW50LnBhdGgpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGV2ZW50LnBhdGgsICcuZ2l0JywgJ01FUkdFX0hFQUQnKSkge1xuICAgICAgICBpZiAoZXZlbnQuYWN0aW9uID09PSAnY3JlYXRlZCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0NvbW1pdE1lc3NhZ2VDbGVhbigpKSB7XG4gICAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UoYXdhaXQgdGhpcy5yZXBvc2l0b3J5LmdldE1lcmdlTWVzc2FnZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYWN0aW9uID09PSAnZGVsZXRlZCcpIHtcbiAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgfHwgJycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGV2ZW50LnBhdGgsICcuZ2l0JywgJ2NvbmZpZycpKSB7XG4gICAgICAgIC8vIHRoaXMgd29uJ3QgY2F0Y2ggY2hhbmdlcyBtYWRlIHRvIHRoZSB0ZW1wbGF0ZSBmaWxlIGl0c2VsZi4uLlxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgICAgICAgaWYgKHRlbXBsYXRlID09PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKCcnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSAhPT0gdGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZVRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvYnNlcnZlRmlsZXN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICB0aGlzLmludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZShldmVudHMpO1xuICAgIHRoaXMudXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZShldmVudHMpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmNhY2hlLmNsZWFyKCk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKS5jYXRjaChlID0+IHtcbiAgICAgIGUuc3RkRXJyID0gJ1RoaXMgZGlyZWN0b3J5IGFscmVhZHkgY29udGFpbnMgYSBnaXQgcmVwb3NpdG9yeSc7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG4gICAgfSk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gc3VwZXIuY2xvbmUoKS5jYXRjaChlID0+IHtcbiAgICAgIGUuc3RkRXJyID0gJ1RoaXMgZGlyZWN0b3J5IGFscmVhZHkgY29udGFpbnMgYSBnaXQgcmVwb3NpdG9yeSc7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBHaXQgb3BlcmF0aW9ucyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gU3RhZ2luZyBhbmQgdW5zdGFnaW5nXG5cbiAgc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhwYXRocyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnN0YWdlRmlsZXMocGF0aHMpLFxuICAgICk7XG4gIH1cblxuICB1bnN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMocGF0aHMpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS51bnN0YWdlRmlsZXMocGF0aHMpLFxuICAgICk7XG4gIH1cblxuICBzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdChwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhwYXRocyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnVuc3RhZ2VGaWxlcyhwYXRocywgJ0hFQUR+JyksXG4gICAgKTtcbiAgfVxuXG4gIHN0YWdlRmlsZU1vZGVDaGFuZ2UoZmlsZVBhdGgsIGZpbGVNb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKFtmaWxlUGF0aF0pLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5zdGFnZUZpbGVNb2RlQ2hhbmdlKGZpbGVQYXRoLCBmaWxlTW9kZSksXG4gICAgKTtcbiAgfVxuXG4gIHN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMoW2ZpbGVQYXRoXSksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UoZmlsZVBhdGgpLFxuICAgICk7XG4gIH1cblxuICBhcHBseVBhdGNoVG9JbmRleChtdWx0aUZpbGVQYXRjaCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhBcnJheS5mcm9tKG11bHRpRmlsZVBhdGNoLmdldFBhdGhTZXQoKSkpLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXRjaFN0ciA9IG11bHRpRmlsZVBhdGNoLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLmFwcGx5UGF0Y2gocGF0Y2hTdHIsIHtpbmRleDogdHJ1ZX0pO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXBwbHlQYXRjaFRvV29ya2RpcihtdWx0aUZpbGVQYXRjaCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLndvcmtkaXJPcGVyYXRpb25LZXlzKEFycmF5LmZyb20obXVsdGlGaWxlUGF0Y2guZ2V0UGF0aFNldCgpKSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGNoU3RyID0gbXVsdGlGaWxlUGF0Y2gudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuYXBwbHlQYXRjaChwYXRjaFN0cik7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICAvLyBDb21taXR0aW5nXG5cbiAgY29tbWl0KG1lc3NhZ2UsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgS2V5cy5oZWFkT3BlcmF0aW9uS2V5cyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdDT01NSVQnLCBhc3luYyAobWVzc2FnZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvQXV0aG9ycyA9IG9wdGlvbnMuY29BdXRob3JzO1xuICAgICAgICBjb25zdCBvcHRzID0gIWNvQXV0aG9ycyA/IG9wdGlvbnMgOiB7XG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICBjb0F1dGhvcnM6IGNvQXV0aG9ycy5tYXAoYXV0aG9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7ZW1haWw6IGF1dGhvci5nZXRFbWFpbCgpLCBuYW1lOiBhdXRob3IuZ2V0RnVsbE5hbWUoKX07XG4gICAgICAgICAgfSksXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5jb21taXQobWVzc2FnZSwgb3B0cyk7XG5cbiAgICAgICAgLy8gQ29sbGVjdCBjb21taXQgbWV0YWRhdGEgbWV0cmljc1xuICAgICAgICAvLyBub3RlOiBpbiBHaXRTaGVsbE91dFN0cmF0ZWd5IHdlIGhhdmUgY291bnRlcnMgZm9yIGFsbCBnaXQgY29tbWFuZHMsIGluY2x1ZGluZyBgY29tbWl0YCwgYnV0IGhlcmUgd2UgaGF2ZVxuICAgICAgICAvLyAgICAgICBhY2Nlc3MgdG8gYWRkaXRpb25hbCBtZXRhZGF0YSAodW5zdGFnZWQgZmlsZSBjb3VudCkgc28gaXQgbWFrZXMgc2Vuc2UgdG8gY29sbGVjdCBjb21taXQgZXZlbnRzIGhlcmVcbiAgICAgICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKCk7XG4gICAgICAgIGNvbnN0IHVuc3RhZ2VkQ291bnQgPSBPYmplY3Qua2V5cyh7Li4udW5zdGFnZWRGaWxlcywgLi4ubWVyZ2VDb25mbGljdEZpbGVzfSkubGVuZ3RoO1xuICAgICAgICBhZGRFdmVudCgnY29tbWl0Jywge1xuICAgICAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgICAgIHBhcnRpYWw6IHVuc3RhZ2VkQ291bnQgPiAwLFxuICAgICAgICAgIGFtZW5kOiAhIW9wdGlvbnMuYW1lbmQsXG4gICAgICAgICAgY29BdXRob3JDb3VudDogY29BdXRob3JzID8gY29BdXRob3JzLmxlbmd0aCA6IDAsXG4gICAgICAgIH0pO1xuICAgICAgfSwgbWVzc2FnZSwgb3B0aW9ucyksXG4gICAgKTtcbiAgfVxuXG4gIC8vIE1lcmdpbmdcblxuICBtZXJnZShicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgLi4uS2V5cy5oZWFkT3BlcmF0aW9uS2V5cygpLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICBdLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5tZXJnZShicmFuY2hOYW1lKSxcbiAgICApO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBLZXlzLmZpbGVQYXRjaC5hbGwsXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5hYm9ydE1lcmdlKCk7XG4gICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSB8fCAnJyk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBjaGVja291dFNpZGUoc2lkZSwgcGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5jaGVja291dFNpZGUoc2lkZSwgcGF0aHMpO1xuICB9XG5cbiAgbWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLm1lcmdlRmlsZShvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpO1xuICB9XG5cbiAgd3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhGaWxlT3B0cyhbZmlsZVBhdGhdLCBbe3N0YWdlZDogZmFsc2V9LCB7c3RhZ2VkOiB0cnVlfV0pLFxuICAgICAgICBLZXlzLmluZGV4Lm9uZVdpdGgoZmlsZVBhdGgpLFxuICAgICAgXSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkud3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSxcbiAgICApO1xuICB9XG5cbiAgLy8gQ2hlY2tvdXRcblxuICBjaGVja291dChyZXZpc2lvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBLZXlzLmxhc3RDb21taXQsXG4gICAgICAgIEtleXMucmVjZW50Q29tbWl0cyxcbiAgICAgICAgS2V5cy5hdXRob3JzLFxuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoT3B0cyh7c3RhZ2VkOiB0cnVlfSksXG4gICAgICAgIEtleXMuZmlsZVBhdGNoLmFsbEFnYWluc3ROb25IZWFkLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgICAgS2V5cy5icmFuY2hlcyxcbiAgICAgIF0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignQ0hFQ0tPVVQnLCAocmV2aXNpb24sIG9wdGlvbnMpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuY2hlY2tvdXQocmV2aXNpb24sIG9wdGlvbnMpO1xuICAgICAgfSwgcmV2aXNpb24sIG9wdGlvbnMpLFxuICAgICk7XG4gIH1cblxuICBjaGVja291dFBhdGhzQXRSZXZpc2lvbihwYXRocywgcmV2aXNpb24gPSAnSEVBRCcpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICAuLi5wYXRocy5tYXAoZmlsZU5hbWUgPT4gS2V5cy5pbmRleC5vbmVXaXRoKGZpbGVOYW1lKSksXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoRmlsZU9wdHMocGF0aHMsIFt7c3RhZ2VkOiB0cnVlfV0pLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoTm9uSGVhZFdpdGhGaWxlcyhwYXRocyksXG4gICAgICBdLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5jaGVja291dEZpbGVzKHBhdGhzLCByZXZpc2lvbiksXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJlc2V0XG5cbiAgdW5kb0xhc3RDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBLZXlzLmxhc3RDb21taXQsXG4gICAgICAgIEtleXMucmVjZW50Q29tbWl0cyxcbiAgICAgICAgS2V5cy5hdXRob3JzLFxuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoT3B0cyh7c3RhZ2VkOiB0cnVlfSksXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLnJlc2V0KCdzb2Z0JywgJ0hFQUR+Jyk7XG4gICAgICAgICAgYWRkRXZlbnQoJ3VuZG8tbGFzdC1jb21taXQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmICgvdW5rbm93biByZXZpc2lvbi8udGVzdChlLnN0ZEVycikpIHtcbiAgICAgICAgICAgIC8vIEluaXRpYWwgY29tbWl0XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmRlbGV0ZVJlZignSEVBRCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgLy8gUmVtb3RlIGludGVyYWN0aW9uc1xuXG4gIGZldGNoKGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgIF0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignRkVUQ0gnLCBhc3luYyBicmFuY2hOYW1lID0+IHtcbiAgICAgICAgbGV0IGZpbmFsUmVtb3RlTmFtZSA9IG9wdGlvbnMucmVtb3RlTmFtZTtcbiAgICAgICAgaWYgKCFmaW5hbFJlbW90ZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCByZW1vdGUgPSBhd2FpdCB0aGlzLmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgICAgICAgICBpZiAoIXJlbW90ZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmFsUmVtb3RlTmFtZSA9IHJlbW90ZS5nZXROYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZmV0Y2goZmluYWxSZW1vdGVOYW1lLCBicmFuY2hOYW1lKTtcbiAgICAgIH0sIGJyYW5jaE5hbWUpLFxuICAgICk7XG4gIH1cblxuICBwdWxsKGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIC4uLktleXMuaGVhZE9wZXJhdGlvbktleXMoKSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgICBLZXlzLmJyYW5jaGVzLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdQVUxMJywgYXN5bmMgYnJhbmNoTmFtZSA9PiB7XG4gICAgICAgIGxldCBmaW5hbFJlbW90ZU5hbWUgPSBvcHRpb25zLnJlbW90ZU5hbWU7XG4gICAgICAgIGlmICghZmluYWxSZW1vdGVOYW1lKSB7XG4gICAgICAgICAgY29uc3QgcmVtb3RlID0gYXdhaXQgdGhpcy5nZXRSZW1vdGVGb3JCcmFuY2goYnJhbmNoTmFtZSk7XG4gICAgICAgICAgaWYgKCFyZW1vdGUuaXNQcmVzZW50KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbFJlbW90ZU5hbWUgPSByZW1vdGUuZ2V0TmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLnB1bGwoZmluYWxSZW1vdGVOYW1lLCBicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgICAgIH0sIGJyYW5jaE5hbWUpLFxuICAgICk7XG4gIH1cblxuICBwdXNoKGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBbXG4gICAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuc2V0VXBzdHJlYW0pIHtcbiAgICAgICAgICBrZXlzLnB1c2goS2V5cy5icmFuY2hlcyk7XG4gICAgICAgICAga2V5cy5wdXNoKC4uLktleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhgYnJhbmNoLiR7YnJhbmNoTmFtZX0ucmVtb3RlYCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICB9LFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ1BVU0gnLCBhc3luYyAoYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICBjb25zdCByZW1vdGUgPSBvcHRpb25zLnJlbW90ZSB8fCBhd2FpdCB0aGlzLmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkucHVzaChyZW1vdGUuZ2V0TmFtZU9yKCdvcmlnaW4nKSwgYnJhbmNoTmFtZSwgb3B0aW9ucyk7XG4gICAgICB9LCBicmFuY2hOYW1lLCBvcHRpb25zKSxcbiAgICApO1xuICB9XG5cbiAgLy8gQ29uZmlndXJhdGlvblxuXG4gIHNldENvbmZpZyhzZXR0aW5nLCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhzZXR0aW5nKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc2V0Q29uZmlnKHNldHRpbmcsIHZhbHVlLCBvcHRpb25zKSxcbiAgICAgIHtnbG9iYWxseTogb3B0aW9ucy5nbG9iYWx9LFxuICAgICk7XG4gIH1cblxuICB1bnNldENvbmZpZyhzZXR0aW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhzZXR0aW5nKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkudW5zZXRDb25maWcoc2V0dGluZyksXG4gICAgKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBibG9iIGludGVyYWN0aW9uc1xuXG4gIGNyZWF0ZUJsb2Iob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmNyZWF0ZUJsb2Iob3B0aW9ucyk7XG4gIH1cblxuICBleHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5leHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpO1xuICB9XG5cbiAgLy8gRGlzY2FyZCBoaXN0b3J5XG5cbiAgY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5LmNyZWF0ZUhpc3RvcnlCbG9iKCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVEaXNjYXJkSGlzdG9yeSgpIHtcbiAgICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgdGhpcy5sb2FkSGlzdG9yeVBheWxvYWQoKTtcbiAgICB0aGlzLmRpc2NhcmRIaXN0b3J5LnVwZGF0ZUhpc3RvcnkoaGlzdG9yeSk7XG4gIH1cblxuICBhc3luYyBzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoZmlsZVBhdGhzLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IHNuYXBzaG90cyA9IGF3YWl0IHRoaXMuZGlzY2FyZEhpc3Rvcnkuc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKFxuICAgICAgZmlsZVBhdGhzLFxuICAgICAgaXNTYWZlLFxuICAgICAgZGVzdHJ1Y3RpdmVBY3Rpb24sXG4gICAgICBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoLFxuICAgICk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoc25hcHNob3RzKSB7XG4gICAgICBhd2FpdCB0aGlzLnNhdmVEaXNjYXJkSGlzdG9yeSgpO1xuICAgIH1cbiAgICByZXR1cm4gc25hcHNob3RzO1xuICB9XG5cbiAgcmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5LnJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzKGlzU2FmZSwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICBhc3luYyBwb3BEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IHJlbW92ZWQgPSBhd2FpdCB0aGlzLmRpc2NhcmRIaXN0b3J5LnBvcEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkuY2xlYXJIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIHJldHVybiB0aGlzLnNhdmVEaXNjYXJkSGlzdG9yeSgpO1xuICB9XG5cbiAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMocGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgLi4ucGF0aHMubWFwKGZpbGVQYXRoID0+IEtleXMuZmlsZVBhdGNoLm9uZVdpdGgoZmlsZVBhdGgsIHtzdGFnZWQ6IGZhbHNlfSkpLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoTm9uSGVhZFdpdGhGaWxlcyhwYXRocyksXG4gICAgICBdLFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB1bnRyYWNrZWRGaWxlcyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0VW50cmFja2VkRmlsZXMoKTtcbiAgICAgICAgY29uc3QgW2ZpbGVzVG9SZW1vdmUsIGZpbGVzVG9DaGVja291dF0gPSBwYXJ0aXRpb24ocGF0aHMsIGYgPT4gdW50cmFja2VkRmlsZXMuaW5jbHVkZXMoZikpO1xuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmNoZWNrb3V0RmlsZXMoZmlsZXNUb0NoZWNrb3V0KTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZmlsZXNUb1JlbW92ZS5tYXAoZmlsZVBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IGFic1BhdGggPSBwYXRoLmpvaW4odGhpcy53b3JrZGlyKCksIGZpbGVQYXRoKTtcbiAgICAgICAgICByZXR1cm4gZnMucmVtb3ZlKGFic1BhdGgpO1xuICAgICAgICB9KSk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICAvLyBBY2Nlc3NvcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gSW5kZXggcXVlcmllc1xuXG4gIGdldFN0YXR1c0J1bmRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnN0YXR1c0J1bmRsZSwgYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgdGhpcy5naXQoKS5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZm9ybWF0Q2hhbmdlZEZpbGVzKGJ1bmRsZSk7XG4gICAgICAgIHJlc3VsdHMuYnJhbmNoID0gYnVuZGxlLmJyYW5jaDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIExhcmdlUmVwb0Vycm9yKSB7XG4gICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8oJ1Rvb0xhcmdlJyk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJyYW5jaDoge30sXG4gICAgICAgICAgICBzdGFnZWRGaWxlczoge30sXG4gICAgICAgICAgICB1bnN0YWdlZEZpbGVzOiB7fSxcbiAgICAgICAgICAgIG1lcmdlQ29uZmxpY3RGaWxlczoge30sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZvcm1hdENoYW5nZWRGaWxlcyh7Y2hhbmdlZEVudHJpZXMsIHVudHJhY2tlZEVudHJpZXMsIHJlbmFtZWRFbnRyaWVzLCB1bm1lcmdlZEVudHJpZXN9KSB7XG4gICAgY29uc3Qgc3RhdHVzTWFwID0ge1xuICAgICAgQTogJ2FkZGVkJyxcbiAgICAgIE06ICdtb2RpZmllZCcsXG4gICAgICBEOiAnZGVsZXRlZCcsXG4gICAgICBVOiAnbW9kaWZpZWQnLFxuICAgICAgVDogJ3R5cGVjaGFuZ2UnLFxuICAgIH07XG5cbiAgICBjb25zdCBzdGFnZWRGaWxlcyA9IHt9O1xuICAgIGNvbnN0IHVuc3RhZ2VkRmlsZXMgPSB7fTtcbiAgICBjb25zdCBtZXJnZUNvbmZsaWN0RmlsZXMgPSB7fTtcblxuICAgIGNoYW5nZWRFbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgaWYgKGVudHJ5LnN0YWdlZFN0YXR1cykge1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXBbZW50cnkuc3RhZ2VkU3RhdHVzXTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS51bnN0YWdlZFN0YXR1cykge1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcFtlbnRyeS51bnN0YWdlZFN0YXR1c107XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB1bnRyYWNrZWRFbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICB9KTtcblxuICAgIHJlbmFtZWRFbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgaWYgKGVudHJ5LnN0YWdlZFN0YXR1cyA9PT0gJ1InKSB7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5vcmlnRmlsZVBhdGhdID0gc3RhdHVzTWFwLkQ7XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkudW5zdGFnZWRTdGF0dXMgPT09ICdSJykge1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5Lm9yaWdGaWxlUGF0aF0gPSBzdGF0dXNNYXAuRDtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5zdGFnZWRTdGF0dXMgPT09ICdDJykge1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS51bnN0YWdlZFN0YXR1cyA9PT0gJ0MnKSB7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3RhdHVzVG9IZWFkO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bm1lcmdlZEVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHtzdGFnZWRTdGF0dXMsIHVuc3RhZ2VkU3RhdHVzLCBmaWxlUGF0aH0gPSB1bm1lcmdlZEVudHJpZXNbaV07XG4gICAgICBpZiAoc3RhZ2VkU3RhdHVzID09PSAnVScgfHwgdW5zdGFnZWRTdGF0dXMgPT09ICdVJyB8fCAoc3RhZ2VkU3RhdHVzID09PSAnQScgJiYgdW5zdGFnZWRTdGF0dXMgPT09ICdBJykpIHtcbiAgICAgICAgLy8gU2tpcHBpbmcgdGhpcyBjaGVjayBoZXJlIGJlY2F1c2Ugd2Ugb25seSBydW4gYSBzaW5nbGUgYGF3YWl0YFxuICAgICAgICAvLyBhbmQgd2Ugb25seSBydW4gaXQgaW4gdGhlIG1haW4sIHN5bmNocm9ub3VzIGJvZHkgb2YgdGhlIGZvciBsb29wLlxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBpZiAoIXN0YXR1c1RvSGVhZCkgeyBzdGF0dXNUb0hlYWQgPSBhd2FpdCB0aGlzLmdpdCgpLmRpZmZGaWxlU3RhdHVzKHt0YXJnZXQ6ICdIRUFEJ30pOyB9XG4gICAgICAgIG1lcmdlQ29uZmxpY3RGaWxlc1tmaWxlUGF0aF0gPSB7XG4gICAgICAgICAgb3Vyczogc3RhdHVzTWFwW3N0YWdlZFN0YXR1c10sXG4gICAgICAgICAgdGhlaXJzOiBzdGF0dXNNYXBbdW5zdGFnZWRTdGF0dXNdLFxuICAgICAgICAgIGZpbGU6IHN0YXR1c1RvSGVhZFtmaWxlUGF0aF0gfHwgJ2VxdWl2YWxlbnQnLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc307XG4gIH1cblxuICBhc3luYyBnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcygpIHtcbiAgICBjb25zdCB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc307XG4gIH1cblxuICBnZXRGaWxlUGF0Y2hGb3JQYXRoKGZpbGVQYXRoLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHN0YWdlZDogZmFsc2UsXG4gICAgICBwYXRjaEJ1ZmZlcjogbnVsbCxcbiAgICAgIGJ1aWxkZXI6IHt9LFxuICAgICAgYmVmb3JlOiAoKSA9PiB7fSxcbiAgICAgIGFmdGVyOiAoKSA9PiB7fSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuZmlsZVBhdGNoLm9uZVdpdGgoZmlsZVBhdGgsIHtzdGFnZWQ6IG9wdHMuc3RhZ2VkfSksIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRpZmZzID0gYXdhaXQgdGhpcy5naXQoKS5nZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCB7c3RhZ2VkOiBvcHRzLnN0YWdlZH0pO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IG9wdHMuYmVmb3JlKCk7XG4gICAgICBjb25zdCBwYXRjaCA9IGJ1aWxkRmlsZVBhdGNoKGRpZmZzLCBvcHRzLmJ1aWxkZXIpO1xuICAgICAgaWYgKG9wdHMucGF0Y2hCdWZmZXIgIT09IG51bGwpIHsgcGF0Y2guYWRvcHRCdWZmZXIob3B0cy5wYXRjaEJ1ZmZlcik7IH1cbiAgICAgIG9wdHMuYWZ0ZXIocGF0Y2gsIHBheWxvYWQpO1xuICAgICAgcmV0dXJuIHBhdGNoO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwgYmFzZUNvbW1pdCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuZmlsZVBhdGNoLm9uZVdpdGgoZmlsZVBhdGgsIHtiYXNlQ29tbWl0fSksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIHtiYXNlQ29tbWl0fSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTdGFnZWRDaGFuZ2VzUGF0Y2gob3B0aW9ucykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBidWlsZGVyOiB7fSxcbiAgICAgIHBhdGNoQnVmZmVyOiBudWxsLFxuICAgICAgYmVmb3JlOiAoKSA9PiB7fSxcbiAgICAgIGFmdGVyOiAoKSA9PiB7fSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuc3RhZ2VkQ2hhbmdlcywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlmZnMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldFN0YWdlZENoYW5nZXNQYXRjaCgpO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IG9wdHMuYmVmb3JlKCk7XG4gICAgICBjb25zdCBwYXRjaCA9IGJ1aWxkTXVsdGlGaWxlUGF0Y2goZGlmZnMsIG9wdHMuYnVpbGRlcik7XG4gICAgICBpZiAob3B0cy5wYXRjaEJ1ZmZlciAhPT0gbnVsbCkgeyBwYXRjaC5hZG9wdEJ1ZmZlcihvcHRzLnBhdGNoQnVmZmVyKTsgfVxuICAgICAgb3B0cy5hZnRlcihwYXRjaCwgcGF5bG9hZCk7XG4gICAgICByZXR1cm4gcGF0Y2g7XG4gICAgfSk7XG4gIH1cblxuICByZWFkRmlsZUZyb21JbmRleChmaWxlUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuaW5kZXgub25lV2l0aChmaWxlUGF0aCksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLnJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENvbW1pdCBhY2Nlc3NcblxuICBnZXRMYXN0Q29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMubGFzdENvbW1pdCwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGVhZENvbW1pdCA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0SGVhZENvbW1pdCgpO1xuICAgICAgcmV0dXJuIGhlYWRDb21taXQudW5ib3JuUmVmID8gQ29tbWl0LmNyZWF0ZVVuYm9ybigpIDogbmV3IENvbW1pdChoZWFkQ29tbWl0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbW1pdChzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmJsb2Iub25lV2l0aChzaGEpLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBbcmF3Q29tbWl0XSA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0Q29tbWl0cyh7bWF4OiAxLCByZWY6IHNoYSwgaW5jbHVkZVBhdGNoOiB0cnVlfSk7XG4gICAgICBjb25zdCBjb21taXQgPSBuZXcgQ29tbWl0KHJhd0NvbW1pdCk7XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVjZW50Q29tbWl0cyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5yZWNlbnRDb21taXRzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb21taXRzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRDb21taXRzKHtyZWY6ICdIRUFEJywgLi4ub3B0aW9uc30pO1xuICAgICAgcmV0dXJuIGNvbW1pdHMubWFwKGNvbW1pdCA9PiBuZXcgQ29tbWl0KGNvbW1pdCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaXNDb21taXRQdXNoZWQoc2hhKSB7XG4gICAgY29uc3QgY3VycmVudEJyYW5jaCA9IGF3YWl0IHRoaXMucmVwb3NpdG9yeS5nZXRDdXJyZW50QnJhbmNoKCk7XG4gICAgY29uc3QgdXBzdHJlYW0gPSBjdXJyZW50QnJhbmNoLmdldFB1c2goKTtcbiAgICBpZiAoIXVwc3RyZWFtLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVkID0gYXdhaXQgdGhpcy5naXQoKS5nZXRCcmFuY2hlc1dpdGhDb21taXQoc2hhLCB7XG4gICAgICBzaG93TG9jYWw6IGZhbHNlLFxuICAgICAgc2hvd1JlbW90ZTogdHJ1ZSxcbiAgICAgIHBhdHRlcm46IHVwc3RyZWFtLmdldFNob3J0UmVmKCksXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRhaW5lZC5zb21lKHJlZiA9PiByZWYubGVuZ3RoID4gMCk7XG4gIH1cblxuICAvLyBBdXRob3IgaW5mb3JtYXRpb25cblxuICBnZXRBdXRob3JzKG9wdGlvbnMpIHtcbiAgICAvLyBGb3Igbm93IHdlJ2xsIGRvIHRoZSBuYWl2ZSB0aGluZyBhbmQgaW52YWxpZGF0ZSBhbnl0aW1lIEhFQUQgbW92ZXMuIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGdldCBuZXcgYXV0aG9yc1xuICAgIC8vIGludHJvZHVjZWQgYnkgbmV3bHkgY3JlYXRlZCBjb21taXRzIG9yIHB1bGxlZCBjb21taXRzLlxuICAgIC8vIFRoaXMgbWVhbnMgdGhhdCB3ZSBhcmUgY29uc3RhbnRseSByZS1mZXRjaGluZyBkYXRhLiBJZiBwZXJmb3JtYW5jZSBiZWNvbWVzIGEgY29uY2VybiB3ZSBjYW4gb3B0aW1pemVcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmF1dGhvcnMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGF1dGhvck1hcCA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0QXV0aG9ycyhvcHRpb25zKTtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhdXRob3JNYXApLm1hcChlbWFpbCA9PiBuZXcgQXV0aG9yKGVtYWlsLCBhdXRob3JNYXBbZW1haWxdKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBCcmFuY2hlc1xuXG4gIGdldEJyYW5jaGVzKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYnJhbmNoZXMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWRzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRCcmFuY2hlcygpO1xuICAgICAgY29uc3QgYnJhbmNoZXMgPSBuZXcgQnJhbmNoU2V0KCk7XG4gICAgICBmb3IgKGNvbnN0IHBheWxvYWQgb2YgcGF5bG9hZHMpIHtcbiAgICAgICAgbGV0IHVwc3RyZWFtID0gbnVsbEJyYW5jaDtcbiAgICAgICAgaWYgKHBheWxvYWQudXBzdHJlYW0pIHtcbiAgICAgICAgICB1cHN0cmVhbSA9IHBheWxvYWQudXBzdHJlYW0ucmVtb3RlTmFtZVxuICAgICAgICAgICAgPyBCcmFuY2guY3JlYXRlUmVtb3RlVHJhY2tpbmcoXG4gICAgICAgICAgICAgIHBheWxvYWQudXBzdHJlYW0udHJhY2tpbmdSZWYsXG4gICAgICAgICAgICAgIHBheWxvYWQudXBzdHJlYW0ucmVtb3RlTmFtZSxcbiAgICAgICAgICAgICAgcGF5bG9hZC51cHN0cmVhbS5yZW1vdGVSZWYsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICA6IG5ldyBCcmFuY2gocGF5bG9hZC51cHN0cmVhbS50cmFja2luZ1JlZik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHVzaCA9IHVwc3RyZWFtO1xuICAgICAgICBpZiAocGF5bG9hZC5wdXNoKSB7XG4gICAgICAgICAgcHVzaCA9IHBheWxvYWQucHVzaC5yZW1vdGVOYW1lXG4gICAgICAgICAgICA/IEJyYW5jaC5jcmVhdGVSZW1vdGVUcmFja2luZyhcbiAgICAgICAgICAgICAgcGF5bG9hZC5wdXNoLnRyYWNraW5nUmVmLFxuICAgICAgICAgICAgICBwYXlsb2FkLnB1c2gucmVtb3RlTmFtZSxcbiAgICAgICAgICAgICAgcGF5bG9hZC5wdXNoLnJlbW90ZVJlZixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogbmV3IEJyYW5jaChwYXlsb2FkLnB1c2gudHJhY2tpbmdSZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJhbmNoZXMuYWRkKG5ldyBCcmFuY2gocGF5bG9hZC5uYW1lLCB1cHN0cmVhbSwgcHVzaCwgcGF5bG9hZC5oZWFkLCB7c2hhOiBwYXlsb2FkLnNoYX0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBicmFuY2hlcztcbiAgICB9KTtcbiAgfVxuXG4gIGdldEhlYWREZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmhlYWREZXNjcmlwdGlvbiwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZGVzY3JpYmVIZWFkKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXJnaW5nIGFuZCByZWJhc2luZyBzdGF0dXNcblxuICBpc01lcmdpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuaXNNZXJnaW5nKHRoaXMucmVwb3NpdG9yeS5nZXRHaXREaXJlY3RvcnlQYXRoKCkpO1xuICB9XG5cbiAgaXNSZWJhc2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5pc1JlYmFzaW5nKHRoaXMucmVwb3NpdG9yeS5nZXRHaXREaXJlY3RvcnlQYXRoKCkpO1xuICB9XG5cbiAgLy8gUmVtb3Rlc1xuXG4gIGdldFJlbW90ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5yZW1vdGVzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZW1vdGVzSW5mbyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0UmVtb3RlcygpO1xuICAgICAgcmV0dXJuIG5ldyBSZW1vdGVTZXQoXG4gICAgICAgIHJlbW90ZXNJbmZvLm1hcCgoe25hbWUsIHVybH0pID0+IG5ldyBSZW1vdGUobmFtZSwgdXJsKSksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkUmVtb3RlKG5hbWUsIHVybCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIC4uLktleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhgcmVtb3RlLiR7bmFtZX0udXJsYCksXG4gICAgICAgIC4uLktleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhgcmVtb3RlLiR7bmFtZX0uZmV0Y2hgKSxcbiAgICAgICAgS2V5cy5yZW1vdGVzLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdBRERSRU1PVEUnLCBhc3luYyAobmFtZSwgdXJsKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuYWRkUmVtb3RlKG5hbWUsIHVybCk7XG4gICAgICAgIHJldHVybiBuZXcgUmVtb3RlKG5hbWUsIHVybCk7XG4gICAgICB9LCBuYW1lLCB1cmwpLFxuICAgICk7XG4gIH1cblxuICBhc3luYyBnZXRBaGVhZENvdW50KGJyYW5jaE5hbWUpIHtcbiAgICBjb25zdCBidW5kbGUgPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBidW5kbGUuYnJhbmNoLmFoZWFkQmVoaW5kLmFoZWFkO1xuICB9XG5cbiAgYXN5bmMgZ2V0QmVoaW5kQ291bnQoYnJhbmNoTmFtZSkge1xuICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIGJ1bmRsZS5icmFuY2guYWhlYWRCZWhpbmQuYmVoaW5kO1xuICB9XG5cbiAgZ2V0Q29uZmlnKG9wdGlvbiwge2xvY2FsfSA9IHtsb2NhbDogZmFsc2V9KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5jb25maWcub25lV2l0aChvcHRpb24sIHtsb2NhbH0pLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5nZXRDb25maWcob3B0aW9uLCB7bG9jYWx9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpcmVjdEdldENvbmZpZyhrZXksIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb25maWcoa2V5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBibG9iIGFjY2Vzc1xuXG4gIGdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmJsb2Iub25lV2l0aChzaGEpLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5nZXRCbG9iQ29udGVudHMoc2hhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpcmVjdEdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRCbG9iQ29udGVudHMoc2hhKTtcbiAgfVxuXG4gIC8vIERpc2NhcmQgaGlzdG9yeVxuXG4gIGhhc0Rpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuaGFzSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuZ2V0SGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldExhc3RIaXN0b3J5U25hcHNob3RzKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuZ2V0TGFzdFNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIC8vIENhY2hlXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gIH1cblxuICBpbnZhbGlkYXRlKHNwZWMsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBib2R5KCkudGhlbihcbiAgICAgIHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMuYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGVyciA9PiB7XG4gICAgICAgIHRoaXMuYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5TdGF0ZS5yZWdpc3RlcihQcmVzZW50KTtcblxuZnVuY3Rpb24gcGFydGl0aW9uKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IFtdO1xuICBjb25zdCBub25tYXRjaGVzID0gW107XG4gIGFycmF5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgbWF0Y2hlcy5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBub25tYXRjaGVzLnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFttYXRjaGVzLCBub25tYXRjaGVzXTtcbn1cblxuY2xhc3MgQ2FjaGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ieUdyb3VwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIGdldE9yU2V0KGtleSwgb3BlcmF0aW9uKSB7XG4gICAgY29uc3QgcHJpbWFyeSA9IGtleS5nZXRQcmltYXJ5KCk7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLnN0b3JhZ2UuZ2V0KHByaW1hcnkpO1xuICAgIGlmIChleGlzdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBleGlzdGluZy5oaXRzKys7XG4gICAgICByZXR1cm4gZXhpc3RpbmcucHJvbWlzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVkID0gb3BlcmF0aW9uKCk7XG5cbiAgICB0aGlzLnN0b3JhZ2Uuc2V0KHByaW1hcnksIHtcbiAgICAgIGNyZWF0ZWRBdDogcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICBoaXRzOiAwLFxuICAgICAgcHJvbWlzZTogY3JlYXRlZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwcyA9IGtleS5nZXRHcm91cHMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZ3JvdXAgPSBncm91cHNbaV07XG4gICAgICBsZXQgZ3JvdXBTZXQgPSB0aGlzLmJ5R3JvdXAuZ2V0KGdyb3VwKTtcbiAgICAgIGlmIChncm91cFNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGdyb3VwU2V0ID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmJ5R3JvdXAuc2V0KGdyb3VwLCBncm91cFNldCk7XG4gICAgICB9XG4gICAgICBncm91cFNldC5hZGQoa2V5KTtcbiAgICB9XG5cbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIGNyZWF0ZWQ7XG4gIH1cblxuICBpbnZhbGlkYXRlKGtleXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXNbaV0ucmVtb3ZlRnJvbUNhY2hlKHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChrZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAga2V5c0luR3JvdXAoZ3JvdXApIHtcbiAgICByZXR1cm4gdGhpcy5ieUdyb3VwLmdldChncm91cCkgfHwgW107XG4gIH1cblxuICByZW1vdmVQcmltYXJ5KHByaW1hcnkpIHtcbiAgICB0aGlzLnN0b3JhZ2UuZGVsZXRlKHByaW1hcnkpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICByZW1vdmVGcm9tR3JvdXAoZ3JvdXAsIGtleSkge1xuICAgIGNvbnN0IGdyb3VwU2V0ID0gdGhpcy5ieUdyb3VwLmdldChncm91cCk7XG4gICAgZ3JvdXBTZXQgJiYgZ3JvdXBTZXQuZGVsZXRlKGtleSk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgdGhpcy5ieUdyb3VwLmNsZWFyKCk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIGRpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFNBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFHLE1BQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLEtBQUEsR0FBQUosT0FBQTtB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