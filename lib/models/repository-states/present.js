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
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfc3RhdGUiLCJfa2V5cyIsIl9naXRTaGVsbE91dFN0cmF0ZWd5IiwiX3dvcmtzcGFjZUNoYW5nZU9ic2VydmVyIiwiX3BhdGNoIiwiX2Rpc2NhcmRIaXN0b3J5IiwiX2JyYW5jaCIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX2F1dGhvciIsIl9icmFuY2hTZXQiLCJfcmVtb3RlIiwiX3JlbW90ZVNldCIsIl9jb21taXQiLCJfb3BlcmF0aW9uU3RhdGVzIiwiX3JlcG9ydGVyUHJveHkiLCJfaGVscGVycyIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsImUiLCJXZWFrTWFwIiwiciIsInQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm93bktleXMiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwibyIsImZpbHRlciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiX3RvUHJvcGVydHlLZXkiLCJ2YWx1ZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX3RvUHJpbWl0aXZlIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJQcmVzZW50IiwiU3RhdGUiLCJjb25zdHJ1Y3RvciIsInJlcG9zaXRvcnkiLCJoaXN0b3J5IiwiY2FjaGUiLCJDYWNoZSIsImRpc2NhcmRIaXN0b3J5IiwiRGlzY2FyZEhpc3RvcnkiLCJjcmVhdGVCbG9iIiwiYmluZCIsImV4cGFuZEJsb2JUb0ZpbGUiLCJtZXJnZUZpbGUiLCJ3b3JrZGlyIiwibWF4SGlzdG9yeUxlbmd0aCIsIm9wZXJhdGlvblN0YXRlcyIsIk9wZXJhdGlvblN0YXRlcyIsImRpZFVwZGF0ZSIsImNvbW1pdE1lc3NhZ2UiLCJjb21taXRNZXNzYWdlVGVtcGxhdGUiLCJmZXRjaEluaXRpYWxNZXNzYWdlIiwidXBkYXRlSGlzdG9yeSIsInNldENvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlIiwic3VwcHJlc3NVcGRhdGUiLCJzZXRDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsIm1lcmdlTWVzc2FnZSIsImdldE1lcmdlTWVzc2FnZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZ2V0Q29tbWl0TWVzc2FnZSIsImdpdCIsImdldE9wZXJhdGlvblN0YXRlcyIsImlzUHJlc2VudCIsImRlc3Ryb3kiLCJzaG93U3RhdHVzQmFyVGlsZXMiLCJpc1B1Ymxpc2hhYmxlIiwiYWNjZXB0SW52YWxpZGF0aW9uIiwic3BlYyIsImdsb2JhbGx5IiwiaW52YWxpZGF0ZSIsImRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsImludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZSIsImV2ZW50cyIsInBhdGhzIiwibWFwIiwic3BlY2lhbCIsInBhdGgiLCJTZXQiLCJmdWxsUGF0aCIsIkZPQ1VTIiwiYWRkIiwiS2V5cyIsInN0YXR1c0J1bmRsZSIsImsiLCJmaWxlUGF0Y2giLCJlYWNoV2l0aE9wdHMiLCJzdGFnZWQiLCJpbmNsdWRlcyIsInNlZ21lbnRzIiwiam9pbiIsImZpbGVQYXRoRW5kc1dpdGgiLCJzdGFnZWRDaGFuZ2VzIiwiYWxsIiwiaW5kZXgiLCJicmFuY2hlcyIsImxhc3RDb21taXQiLCJyZWNlbnRDb21taXRzIiwiaGVhZERlc2NyaXB0aW9uIiwiYXV0aG9ycyIsInJlbW90ZXMiLCJjb25maWciLCJyZWxhdGl2ZVBhdGgiLCJyZWxhdGl2ZSIsImtleSIsImVhY2hXaXRoRmlsZU9wdHMiLCJzaXplIiwiQXJyYXkiLCJmcm9tIiwiaXNDb21taXRNZXNzYWdlQ2xlYW4iLCJ0cmltIiwidXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZSIsImV2ZW50IiwiYWN0aW9uIiwib2JzZXJ2ZUZpbGVzeXN0ZW1DaGFuZ2UiLCJyZWZyZXNoIiwiY2xlYXIiLCJpbml0IiwiY2F0Y2giLCJzdGRFcnIiLCJQcm9taXNlIiwicmVqZWN0IiwiY2xvbmUiLCJzdGFnZUZpbGVzIiwiY2FjaGVPcGVyYXRpb25LZXlzIiwidW5zdGFnZUZpbGVzIiwic3RhZ2VGaWxlc0Zyb21QYXJlbnRDb21taXQiLCJzdGFnZUZpbGVNb2RlQ2hhbmdlIiwiZmlsZVBhdGgiLCJmaWxlTW9kZSIsInN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UiLCJhcHBseVBhdGNoVG9JbmRleCIsIm11bHRpRmlsZVBhdGNoIiwiZ2V0UGF0aFNldCIsInBhdGNoU3RyIiwidG9TdHJpbmciLCJhcHBseVBhdGNoIiwiYXBwbHlQYXRjaFRvV29ya2RpciIsIndvcmtkaXJPcGVyYXRpb25LZXlzIiwiY29tbWl0Iiwib3B0aW9ucyIsImhlYWRPcGVyYXRpb25LZXlzIiwiZXhlY3V0ZVBpcGVsaW5lQWN0aW9uIiwiY29BdXRob3JzIiwib3B0cyIsImF1dGhvciIsImVtYWlsIiwiZ2V0RW1haWwiLCJuYW1lIiwiZ2V0RnVsbE5hbWUiLCJ1bnN0YWdlZEZpbGVzIiwibWVyZ2VDb25mbGljdEZpbGVzIiwiZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMiLCJ1bnN0YWdlZENvdW50IiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwicGFydGlhbCIsImFtZW5kIiwiY29BdXRob3JDb3VudCIsIm1lcmdlIiwiYnJhbmNoTmFtZSIsImFib3J0TWVyZ2UiLCJjaGVja291dFNpZGUiLCJzaWRlIiwib3Vyc1BhdGgiLCJjb21tb25CYXNlUGF0aCIsInRoZWlyc1BhdGgiLCJyZXN1bHRQYXRoIiwid3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleCIsImNvbW1vbkJhc2VTaGEiLCJvdXJzU2hhIiwidGhlaXJzU2hhIiwib25lV2l0aCIsImNoZWNrb3V0IiwicmV2aXNpb24iLCJhbGxBZ2FpbnN0Tm9uSGVhZCIsImNoZWNrb3V0UGF0aHNBdFJldmlzaW9uIiwiZmlsZU5hbWUiLCJlYWNoTm9uSGVhZFdpdGhGaWxlcyIsImNoZWNrb3V0RmlsZXMiLCJ1bmRvTGFzdENvbW1pdCIsInJlc2V0IiwidGVzdCIsImRlbGV0ZVJlZiIsImZldGNoIiwiZmluYWxSZW1vdGVOYW1lIiwicmVtb3RlTmFtZSIsInJlbW90ZSIsImdldFJlbW90ZUZvckJyYW5jaCIsImdldE5hbWUiLCJwdWxsIiwic2V0VXBzdHJlYW0iLCJlYWNoV2l0aFNldHRpbmciLCJnZXROYW1lT3IiLCJzZXRDb25maWciLCJzZXR0aW5nIiwiZ2xvYmFsIiwidW5zZXRDb25maWciLCJhYnNGaWxlUGF0aCIsInNoYSIsImNyZWF0ZURpc2NhcmRIaXN0b3J5QmxvYiIsImNyZWF0ZUhpc3RvcnlCbG9iIiwidXBkYXRlRGlzY2FyZEhpc3RvcnkiLCJsb2FkSGlzdG9yeVBheWxvYWQiLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJmaWxlUGF0aHMiLCJpc1NhZmUiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInBhcnRpYWxEaXNjYXJkRmlsZVBhdGgiLCJzbmFwc2hvdHMiLCJzYXZlRGlzY2FyZEhpc3RvcnkiLCJyZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyIsInBvcERpc2NhcmRIaXN0b3J5IiwicmVtb3ZlZCIsInBvcEhpc3RvcnkiLCJjbGVhckRpc2NhcmRIaXN0b3J5IiwiY2xlYXJIaXN0b3J5IiwiZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMiLCJ1bnRyYWNrZWRGaWxlcyIsImdldFVudHJhY2tlZEZpbGVzIiwiZmlsZXNUb1JlbW92ZSIsImZpbGVzVG9DaGVja291dCIsInBhcnRpdGlvbiIsImYiLCJhYnNQYXRoIiwiZnMiLCJyZW1vdmUiLCJnZXRTdGF0dXNCdW5kbGUiLCJnZXRPclNldCIsImJ1bmRsZSIsInJlc3VsdHMiLCJmb3JtYXRDaGFuZ2VkRmlsZXMiLCJicmFuY2giLCJlcnIiLCJMYXJnZVJlcG9FcnJvciIsInRyYW5zaXRpb25UbyIsInN0YWdlZEZpbGVzIiwiY2hhbmdlZEVudHJpZXMiLCJ1bnRyYWNrZWRFbnRyaWVzIiwicmVuYW1lZEVudHJpZXMiLCJ1bm1lcmdlZEVudHJpZXMiLCJzdGF0dXNNYXAiLCJBIiwiTSIsIkQiLCJVIiwiVCIsImVudHJ5Iiwic3RhZ2VkU3RhdHVzIiwidW5zdGFnZWRTdGF0dXMiLCJvcmlnRmlsZVBhdGgiLCJzdGF0dXNUb0hlYWQiLCJkaWZmRmlsZVN0YXR1cyIsInRhcmdldCIsIm91cnMiLCJ0aGVpcnMiLCJmaWxlIiwiZ2V0RmlsZVBhdGNoRm9yUGF0aCIsInBhdGNoQnVmZmVyIiwiYnVpbGRlciIsImJlZm9yZSIsImFmdGVyIiwiZGlmZnMiLCJnZXREaWZmc0ZvckZpbGVQYXRoIiwicGF5bG9hZCIsInBhdGNoIiwiYnVpbGRGaWxlUGF0Y2giLCJhZG9wdEJ1ZmZlciIsImJhc2VDb21taXQiLCJnZXRTdGFnZWRDaGFuZ2VzUGF0Y2giLCJidWlsZE11bHRpRmlsZVBhdGNoIiwicmVhZEZpbGVGcm9tSW5kZXgiLCJnZXRMYXN0Q29tbWl0IiwiaGVhZENvbW1pdCIsImdldEhlYWRDb21taXQiLCJ1bmJvcm5SZWYiLCJDb21taXQiLCJjcmVhdGVVbmJvcm4iLCJnZXRDb21taXQiLCJibG9iIiwicmF3Q29tbWl0IiwiZ2V0Q29tbWl0cyIsIm1heCIsInJlZiIsImluY2x1ZGVQYXRjaCIsImdldFJlY2VudENvbW1pdHMiLCJjb21taXRzIiwiaXNDb21taXRQdXNoZWQiLCJjdXJyZW50QnJhbmNoIiwiZ2V0Q3VycmVudEJyYW5jaCIsInVwc3RyZWFtIiwiZ2V0UHVzaCIsImNvbnRhaW5lZCIsImdldEJyYW5jaGVzV2l0aENvbW1pdCIsInNob3dMb2NhbCIsInNob3dSZW1vdGUiLCJwYXR0ZXJuIiwiZ2V0U2hvcnRSZWYiLCJzb21lIiwiZ2V0QXV0aG9ycyIsImF1dGhvck1hcCIsIkF1dGhvciIsImdldEJyYW5jaGVzIiwicGF5bG9hZHMiLCJCcmFuY2hTZXQiLCJudWxsQnJhbmNoIiwiQnJhbmNoIiwiY3JlYXRlUmVtb3RlVHJhY2tpbmciLCJ0cmFja2luZ1JlZiIsInJlbW90ZVJlZiIsImhlYWQiLCJnZXRIZWFkRGVzY3JpcHRpb24iLCJkZXNjcmliZUhlYWQiLCJpc01lcmdpbmciLCJnZXRHaXREaXJlY3RvcnlQYXRoIiwiaXNSZWJhc2luZyIsImdldFJlbW90ZXMiLCJyZW1vdGVzSW5mbyIsIlJlbW90ZVNldCIsInVybCIsIlJlbW90ZSIsImFkZFJlbW90ZSIsImdldEFoZWFkQ291bnQiLCJhaGVhZEJlaGluZCIsImFoZWFkIiwiZ2V0QmVoaW5kQ291bnQiLCJiZWhpbmQiLCJnZXRDb25maWciLCJvcHRpb24iLCJsb2NhbCIsImRpcmVjdEdldENvbmZpZyIsImdldEJsb2JDb250ZW50cyIsImRpcmVjdEdldEJsb2JDb250ZW50cyIsImhhc0Rpc2NhcmRIaXN0b3J5IiwiaGFzSGlzdG9yeSIsImdldERpc2NhcmRIaXN0b3J5IiwiZ2V0SGlzdG9yeSIsImdldExhc3RIaXN0b3J5U25hcHNob3RzIiwiZ2V0TGFzdFNuYXBzaG90cyIsImdldENhY2hlIiwiYm9keSIsInRoZW4iLCJyZXN1bHQiLCJleHBvcnRzIiwicmVnaXN0ZXIiLCJhcnJheSIsInByZWRpY2F0ZSIsIm1hdGNoZXMiLCJub25tYXRjaGVzIiwiaXRlbSIsInN0b3JhZ2UiLCJNYXAiLCJieUdyb3VwIiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJvcGVyYXRpb24iLCJwcmltYXJ5IiwiZ2V0UHJpbWFyeSIsImV4aXN0aW5nIiwidW5kZWZpbmVkIiwiaGl0cyIsInByb21pc2UiLCJjcmVhdGVkIiwiY3JlYXRlZEF0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJncm91cHMiLCJnZXRHcm91cHMiLCJncm91cCIsImdyb3VwU2V0IiwicmVtb3ZlRnJvbUNhY2hlIiwia2V5c0luR3JvdXAiLCJyZW1vdmVQcmltYXJ5IiwiZGVsZXRlIiwicmVtb3ZlRnJvbUdyb3VwIiwiaXRlcmF0b3IiLCJlbWl0Iiwib25EaWRVcGRhdGUiLCJjYWxsYmFjayIsIm9uIiwiZGlzcG9zZSJdLCJzb3VyY2VzIjpbInByZXNlbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5pbXBvcnQgU3RhdGUgZnJvbSAnLi9zdGF0ZSc7XG5pbXBvcnQge0tleXN9IGZyb20gJy4vY2FjaGUva2V5cyc7XG5cbmltcG9ydCB7TGFyZ2VSZXBvRXJyb3J9IGZyb20gJy4uLy4uL2dpdC1zaGVsbC1vdXQtc3RyYXRlZ3knO1xuaW1wb3J0IHtGT0NVU30gZnJvbSAnLi4vd29ya3NwYWNlLWNoYW5nZS1vYnNlcnZlcic7XG5pbXBvcnQge2J1aWxkRmlsZVBhdGNoLCBidWlsZE11bHRpRmlsZVBhdGNofSBmcm9tICcuLi9wYXRjaCc7XG5pbXBvcnQgRGlzY2FyZEhpc3RvcnkgZnJvbSAnLi4vZGlzY2FyZC1oaXN0b3J5JztcbmltcG9ydCBCcmFuY2gsIHtudWxsQnJhbmNofSBmcm9tICcuLi9icmFuY2gnO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuLi9hdXRob3InO1xuaW1wb3J0IEJyYW5jaFNldCBmcm9tICcuLi9icmFuY2gtc2V0JztcbmltcG9ydCBSZW1vdGUgZnJvbSAnLi4vcmVtb3RlJztcbmltcG9ydCBSZW1vdGVTZXQgZnJvbSAnLi4vcmVtb3RlLXNldCc7XG5pbXBvcnQgQ29tbWl0IGZyb20gJy4uL2NvbW1pdCc7XG5pbXBvcnQgT3BlcmF0aW9uU3RhdGVzIGZyb20gJy4uL29wZXJhdGlvbi1zdGF0ZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtmaWxlUGF0aEVuZHNXaXRofSBmcm9tICcuLi8uLi9oZWxwZXJzJztcblxuLyoqXG4gKiBTdGF0ZSB1c2VkIHdoZW4gdGhlIHdvcmtpbmcgZGlyZWN0b3J5IGNvbnRhaW5zIGEgdmFsaWQgZ2l0IHJlcG9zaXRvcnkgYW5kIGNhbiBiZSBpbnRlcmFjdGVkIHdpdGguIFBlcmZvcm1zXG4gKiBhY3R1YWwgZ2l0IG9wZXJhdGlvbnMsIGNhY2hpbmcgdGhlIHJlc3VsdHMsIGFuZCBicm9hZGNhc3RzIGBvbkRpZFVwZGF0ZWAgZXZlbnRzIHdoZW4gd3JpdGUgYWN0aW9ucyBhcmVcbiAqIHBlcmZvcm1lZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VudCBleHRlbmRzIFN0YXRlIHtcbiAgY29uc3RydWN0b3IocmVwb3NpdG9yeSwgaGlzdG9yeSkge1xuICAgIHN1cGVyKHJlcG9zaXRvcnkpO1xuXG4gICAgdGhpcy5jYWNoZSA9IG5ldyBDYWNoZSgpO1xuXG4gICAgdGhpcy5kaXNjYXJkSGlzdG9yeSA9IG5ldyBEaXNjYXJkSGlzdG9yeShcbiAgICAgIHRoaXMuY3JlYXRlQmxvYi5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy5leHBhbmRCbG9iVG9GaWxlLmJpbmQodGhpcyksXG4gICAgICB0aGlzLm1lcmdlRmlsZS5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy53b3JrZGlyKCksXG4gICAgICB7bWF4SGlzdG9yeUxlbmd0aDogNjB9LFxuICAgICk7XG5cbiAgICB0aGlzLm9wZXJhdGlvblN0YXRlcyA9IG5ldyBPcGVyYXRpb25TdGF0ZXMoe2RpZFVwZGF0ZTogdGhpcy5kaWRVcGRhdGUuYmluZCh0aGlzKX0pO1xuXG4gICAgdGhpcy5jb21taXRNZXNzYWdlID0gJyc7XG4gICAgdGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgPSBudWxsO1xuICAgIHRoaXMuZmV0Y2hJbml0aWFsTWVzc2FnZSgpO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgdGhpcy5kaXNjYXJkSGlzdG9yeS51cGRhdGVIaXN0b3J5KGhpc3RvcnkpO1xuICAgIH1cbiAgfVxuXG4gIHNldENvbW1pdE1lc3NhZ2UobWVzc2FnZSwge3N1cHByZXNzVXBkYXRlfSA9IHtzdXBwcmVzc1VwZGF0ZTogZmFsc2V9KSB7XG4gICAgdGhpcy5jb21taXRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICBpZiAoIXN1cHByZXNzVXBkYXRlKSB7XG4gICAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSh0ZW1wbGF0ZSkge1xuICAgIHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlID0gdGVtcGxhdGU7XG4gIH1cblxuICBhc3luYyBmZXRjaEluaXRpYWxNZXNzYWdlKCkge1xuICAgIGNvbnN0IG1lcmdlTWVzc2FnZSA9IGF3YWl0IHRoaXMucmVwb3NpdG9yeS5nZXRNZXJnZU1lc3NhZ2UoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuICAgIGlmIChtZXJnZU1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZShtZXJnZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tbWl0TWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXRNZXNzYWdlO1xuICB9XG5cbiAgZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgfVxuXG4gIGdldE9wZXJhdGlvblN0YXRlcygpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVyYXRpb25TdGF0ZXM7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2FjaGUuZGVzdHJveSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHNob3dTdGF0dXNCYXJUaWxlcygpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzUHVibGlzaGFibGUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhY2NlcHRJbnZhbGlkYXRpb24oc3BlYywge2dsb2JhbGx5fSA9IHt9KSB7XG4gICAgdGhpcy5jYWNoZS5pbnZhbGlkYXRlKHNwZWMoKSk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICBpZiAoZ2xvYmFsbHkpIHtcbiAgICAgIHRoaXMuZGlkR2xvYmFsbHlJbnZhbGlkYXRlKHNwZWMpO1xuICAgIH1cbiAgfVxuXG4gIGludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICBjb25zdCBwYXRocyA9IGV2ZW50cy5tYXAoZSA9PiBlLnNwZWNpYWwgfHwgZS5wYXRoKTtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aHNbaV07XG5cbiAgICAgIGlmIChmdWxsUGF0aCA9PT0gRk9DVVMpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhPcHRzKHtzdGFnZWQ6IGZhbHNlfSkpIHtcbiAgICAgICAgICBrZXlzLmFkZChrKTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5jbHVkZXMgPSAoLi4uc2VnbWVudHMpID0+IGZ1bGxQYXRoLmluY2x1ZGVzKHBhdGguam9pbiguLi5zZWdtZW50cykpO1xuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChmdWxsUGF0aCwgJy5naXQnLCAnaW5kZXgnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YWdlZENoYW5nZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmZpbGVQYXRjaC5hbGwpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmluZGV4LmFsbCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGZ1bGxQYXRoLCAnLmdpdCcsICdIRUFEJykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5icmFuY2hlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMubGFzdENvbW1pdCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVjZW50Q29tbWl0cyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5oZWFkRGVzY3JpcHRpb24pO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmF1dGhvcnMpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1ZGVzKCcuZ2l0JywgJ3JlZnMnLCAnaGVhZHMnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLmJyYW5jaGVzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5sYXN0Q29tbWl0KTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5yZWNlbnRDb21taXRzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5oZWFkRGVzY3JpcHRpb24pO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmF1dGhvcnMpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1ZGVzKCcuZ2l0JywgJ3JlZnMnLCAncmVtb3RlcycpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVtb3Rlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5oZWFkRGVzY3JpcHRpb24pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZnVsbFBhdGgsICcuZ2l0JywgJ2NvbmZpZycpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVtb3Rlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuY29uZmlnLmFsbCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbGUgY2hhbmdlIHdpdGhpbiB0aGUgd29ya2luZyBkaXJlY3RvcnlcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUodGhpcy53b3JrZGlyKCksIGZ1bGxQYXRoKTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIEtleXMuZmlsZVBhdGNoLmVhY2hXaXRoRmlsZU9wdHMoW3JlbGF0aXZlUGF0aF0sIFt7c3RhZ2VkOiBmYWxzZX1dKSkge1xuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgICAgfVxuICAgICAga2V5cy5hZGQoS2V5cy5zdGF0dXNCdW5kbGUpO1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGtleXMuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMuY2FjaGUuaW52YWxpZGF0ZShBcnJheS5mcm9tKGtleXMpKTtcbiAgICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgaXNDb21taXRNZXNzYWdlQ2xlYW4oKSB7XG4gICAgaWYgKHRoaXMuY29tbWl0TWVzc2FnZS50cmltKCkgPT09ICcnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21taXRNZXNzYWdlID09PSB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZXZlbnQgPSBldmVudHNbaV07XG5cbiAgICAgIGlmICghZXZlbnQucGF0aCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZXZlbnQucGF0aCwgJy5naXQnLCAnTUVSR0VfSEVBRCcpKSB7XG4gICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdjcmVhdGVkJykge1xuICAgICAgICAgIGlmICh0aGlzLmlzQ29tbWl0TWVzc2FnZUNsZWFuKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZShhd2FpdCB0aGlzLnJlcG9zaXRvcnkuZ2V0TWVyZ2VNZXNzYWdlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5hY3Rpb24gPT09ICdkZWxldGVkJykge1xuICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSB8fCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZXZlbnQucGF0aCwgJy5naXQnLCAnY29uZmlnJykpIHtcbiAgICAgICAgLy8gdGhpcyB3b24ndCBjYXRjaCBjaGFuZ2VzIG1hZGUgdG8gdGhlIHRlbXBsYXRlIGZpbGUgaXRzZWxmLi4uXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgdGhpcy5mZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpO1xuICAgICAgICBpZiAodGVtcGxhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UoJycpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlICE9PSB0ZW1wbGF0ZSkge1xuICAgICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0ZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9ic2VydmVGaWxlc3lzdGVtQ2hhbmdlKGV2ZW50cykge1xuICAgIHRoaXMuaW52YWxpZGF0ZUNhY2hlQWZ0ZXJGaWxlc3lzdGVtQ2hhbmdlKGV2ZW50cyk7XG4gICAgdGhpcy51cGRhdGVDb21taXRNZXNzYWdlQWZ0ZXJGaWxlU3lzdGVtQ2hhbmdlKGV2ZW50cyk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuY2FjaGUuY2xlYXIoKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIuaW5pdCgpLmNhdGNoKGUgPT4ge1xuICAgICAgZS5zdGRFcnIgPSAnVGhpcyBkaXJlY3RvcnkgYWxyZWFkeSBjb250YWlucyBhIGdpdCByZXBvc2l0b3J5JztcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBzdXBlci5jbG9uZSgpLmNhdGNoKGUgPT4ge1xuICAgICAgZS5zdGRFcnIgPSAnVGhpcyBkaXJlY3RvcnkgYWxyZWFkeSBjb250YWlucyBhIGdpdCByZXBvc2l0b3J5JztcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEdpdCBvcGVyYXRpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvLyBTdGFnaW5nIGFuZCB1bnN0YWdpbmdcblxuICBzdGFnZUZpbGVzKHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKHBhdGhzKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc3RhZ2VGaWxlcyhwYXRocyksXG4gICAgKTtcbiAgfVxuXG4gIHVuc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhwYXRocyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnVuc3RhZ2VGaWxlcyhwYXRocyksXG4gICAgKTtcbiAgfVxuXG4gIHN0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0KHBhdGhzKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKHBhdGhzKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkudW5zdGFnZUZpbGVzKHBhdGhzLCAnSEVBRH4nKSxcbiAgICApO1xuICB9XG5cbiAgc3RhZ2VGaWxlTW9kZUNoYW5nZShmaWxlUGF0aCwgZmlsZU1vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMoW2ZpbGVQYXRoXSksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnN0YWdlRmlsZU1vZGVDaGFuZ2UoZmlsZVBhdGgsIGZpbGVNb2RlKSxcbiAgICApO1xuICB9XG5cbiAgc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShmaWxlUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhbZmlsZVBhdGhdKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc3RhZ2VGaWxlU3ltbGlua0NoYW5nZShmaWxlUGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIGFwcGx5UGF0Y2hUb0luZGV4KG11bHRpRmlsZVBhdGNoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKEFycmF5LmZyb20obXVsdGlGaWxlUGF0Y2guZ2V0UGF0aFNldCgpKSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGNoU3RyID0gbXVsdGlGaWxlUGF0Y2gudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuYXBwbHlQYXRjaChwYXRjaFN0ciwge2luZGV4OiB0cnVlfSk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBhcHBseVBhdGNoVG9Xb3JrZGlyKG11bHRpRmlsZVBhdGNoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMud29ya2Rpck9wZXJhdGlvbktleXMoQXJyYXkuZnJvbShtdWx0aUZpbGVQYXRjaC5nZXRQYXRoU2V0KCkpKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgcGF0Y2hTdHIgPSBtdWx0aUZpbGVQYXRjaC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5hcHBseVBhdGNoKHBhdGNoU3RyKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8vIENvbW1pdHRpbmdcblxuICBjb21taXQobWVzc2FnZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICBLZXlzLmhlYWRPcGVyYXRpb25LZXlzLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ0NPTU1JVCcsIGFzeW5jIChtZXNzYWdlLCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgY29BdXRob3JzID0gb3B0aW9ucy5jb0F1dGhvcnM7XG4gICAgICAgIGNvbnN0IG9wdHMgPSAhY29BdXRob3JzID8gb3B0aW9ucyA6IHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGNvQXV0aG9yczogY29BdXRob3JzLm1hcChhdXRob3IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtlbWFpbDogYXV0aG9yLmdldEVtYWlsKCksIG5hbWU6IGF1dGhvci5nZXRGdWxsTmFtZSgpfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmNvbW1pdChtZXNzYWdlLCBvcHRzKTtcblxuICAgICAgICAvLyBDb2xsZWN0IGNvbW1pdCBtZXRhZGF0YSBtZXRyaWNzXG4gICAgICAgIC8vIG5vdGU6IGluIEdpdFNoZWxsT3V0U3RyYXRlZ3kgd2UgaGF2ZSBjb3VudGVycyBmb3IgYWxsIGdpdCBjb21tYW5kcywgaW5jbHVkaW5nIGBjb21taXRgLCBidXQgaGVyZSB3ZSBoYXZlXG4gICAgICAgIC8vICAgICAgIGFjY2VzcyB0byBhZGRpdGlvbmFsIG1ldGFkYXRhICh1bnN0YWdlZCBmaWxlIGNvdW50KSBzbyBpdCBtYWtlcyBzZW5zZSB0byBjb2xsZWN0IGNvbW1pdCBldmVudHMgaGVyZVxuICAgICAgICBjb25zdCB7dW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzZXNGb3JDaGFuZ2VkRmlsZXMoKTtcbiAgICAgICAgY29uc3QgdW5zdGFnZWRDb3VudCA9IE9iamVjdC5rZXlzKHsuLi51bnN0YWdlZEZpbGVzLCAuLi5tZXJnZUNvbmZsaWN0RmlsZXN9KS5sZW5ndGg7XG4gICAgICAgIGFkZEV2ZW50KCdjb21taXQnLCB7XG4gICAgICAgICAgcGFja2FnZTogJ2dpdGh1YicsXG4gICAgICAgICAgcGFydGlhbDogdW5zdGFnZWRDb3VudCA+IDAsXG4gICAgICAgICAgYW1lbmQ6ICEhb3B0aW9ucy5hbWVuZCxcbiAgICAgICAgICBjb0F1dGhvckNvdW50OiBjb0F1dGhvcnMgPyBjb0F1dGhvcnMubGVuZ3RoIDogMCxcbiAgICAgICAgfSk7XG4gICAgICB9LCBtZXNzYWdlLCBvcHRpb25zKSxcbiAgICApO1xuICB9XG5cbiAgLy8gTWVyZ2luZ1xuXG4gIG1lcmdlKGJyYW5jaE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICAuLi5LZXlzLmhlYWRPcGVyYXRpb25LZXlzKCksXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgIF0sXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLm1lcmdlKGJyYW5jaE5hbWUpLFxuICAgICk7XG4gIH1cblxuICBhYm9ydE1lcmdlKCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIEtleXMuZmlsZVBhdGNoLmFsbCxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICBdLFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmFib3J0TWVyZ2UoKTtcbiAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlIHx8ICcnKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIGNoZWNrb3V0U2lkZShzaWRlLCBwYXRocykge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmNoZWNrb3V0U2lkZShzaWRlLCBwYXRocyk7XG4gIH1cblxuICBtZXJnZUZpbGUob3Vyc1BhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkubWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCk7XG4gIH1cblxuICB3cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoV2l0aEZpbGVPcHRzKFtmaWxlUGF0aF0sIFt7c3RhZ2VkOiBmYWxzZX0sIHtzdGFnZWQ6IHRydWV9XSksXG4gICAgICAgIEtleXMuaW5kZXgub25lV2l0aChmaWxlUGF0aCksXG4gICAgICBdLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS53cml0ZU1lcmdlQ29uZmxpY3RUb0luZGV4KGZpbGVQYXRoLCBjb21tb25CYXNlU2hhLCBvdXJzU2hhLCB0aGVpcnNTaGEpLFxuICAgICk7XG4gIH1cblxuICAvLyBDaGVja291dFxuXG4gIGNoZWNrb3V0KHJldmlzaW9uLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIEtleXMubGFzdENvbW1pdCxcbiAgICAgICAgS2V5cy5yZWNlbnRDb21taXRzLFxuICAgICAgICBLZXlzLmF1dGhvcnMsXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhPcHRzKHtzdGFnZWQ6IHRydWV9KSxcbiAgICAgICAgS2V5cy5maWxlUGF0Y2guYWxsQWdhaW5zdE5vbkhlYWQsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgICBLZXlzLmJyYW5jaGVzLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdDSEVDS09VVCcsIChyZXZpc2lvbiwgb3B0aW9ucykgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5jaGVja291dChyZXZpc2lvbiwgb3B0aW9ucyk7XG4gICAgICB9LCByZXZpc2lvbiwgb3B0aW9ucyksXG4gICAgKTtcbiAgfVxuXG4gIGNoZWNrb3V0UGF0aHNBdFJldmlzaW9uKHBhdGhzLCByZXZpc2lvbiA9ICdIRUFEJykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIC4uLnBhdGhzLm1hcChmaWxlTmFtZSA9PiBLZXlzLmluZGV4Lm9uZVdpdGgoZmlsZU5hbWUpKSxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhGaWxlT3B0cyhwYXRocywgW3tzdGFnZWQ6IHRydWV9XSksXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hOb25IZWFkV2l0aEZpbGVzKHBhdGhzKSxcbiAgICAgIF0sXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLmNoZWNrb3V0RmlsZXMocGF0aHMsIHJldmlzaW9uKSxcbiAgICApO1xuICB9XG5cbiAgLy8gUmVzZXRcblxuICB1bmRvTGFzdENvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YWdlZENoYW5nZXMsXG4gICAgICAgIEtleXMubGFzdENvbW1pdCxcbiAgICAgICAgS2V5cy5yZWNlbnRDb21taXRzLFxuICAgICAgICBLZXlzLmF1dGhvcnMsXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhPcHRzKHtzdGFnZWQ6IHRydWV9KSxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICBdLFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkucmVzZXQoJ3NvZnQnLCAnSEVBRH4nKTtcbiAgICAgICAgICBhZGRFdmVudCgndW5kby1sYXN0LWNvbW1pdCcsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKC91bmtub3duIHJldmlzaW9uLy50ZXN0KGUuc3RkRXJyKSkge1xuICAgICAgICAgICAgLy8gSW5pdGlhbCBjb21taXRcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuZGVsZXRlUmVmKCdIRUFEJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICAvLyBSZW1vdGUgaW50ZXJhY3Rpb25zXG5cbiAgZmV0Y2goYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdGRVRDSCcsIGFzeW5jIGJyYW5jaE5hbWUgPT4ge1xuICAgICAgICBsZXQgZmluYWxSZW1vdGVOYW1lID0gb3B0aW9ucy5yZW1vdGVOYW1lO1xuICAgICAgICBpZiAoIWZpbmFsUmVtb3RlTmFtZSkge1xuICAgICAgICAgIGNvbnN0IHJlbW90ZSA9IGF3YWl0IHRoaXMuZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpO1xuICAgICAgICAgIGlmICghcmVtb3RlLmlzUHJlc2VudCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmluYWxSZW1vdGVOYW1lID0gcmVtb3RlLmdldE5hbWUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5mZXRjaChmaW5hbFJlbW90ZU5hbWUsIGJyYW5jaE5hbWUpO1xuICAgICAgfSwgYnJhbmNoTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIHB1bGwoYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgLi4uS2V5cy5oZWFkT3BlcmF0aW9uS2V5cygpLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICAgIEtleXMuYnJhbmNoZXMsXG4gICAgICBdLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ1BVTEwnLCBhc3luYyBicmFuY2hOYW1lID0+IHtcbiAgICAgICAgbGV0IGZpbmFsUmVtb3RlTmFtZSA9IG9wdGlvbnMucmVtb3RlTmFtZTtcbiAgICAgICAgaWYgKCFmaW5hbFJlbW90ZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCByZW1vdGUgPSBhd2FpdCB0aGlzLmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgICAgICAgICBpZiAoIXJlbW90ZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmFsUmVtb3RlTmFtZSA9IHJlbW90ZS5nZXROYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkucHVsbChmaW5hbFJlbW90ZU5hbWUsIGJyYW5jaE5hbWUsIG9wdGlvbnMpO1xuICAgICAgfSwgYnJhbmNoTmFtZSksXG4gICAgKTtcbiAgfVxuXG4gIHB1c2goYnJhbmNoTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5cyA9IFtcbiAgICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAob3B0aW9ucy5zZXRVcHN0cmVhbSkge1xuICAgICAgICAgIGtleXMucHVzaChLZXlzLmJyYW5jaGVzKTtcbiAgICAgICAgICBrZXlzLnB1c2goLi4uS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKGBicmFuY2guJHticmFuY2hOYW1lfS5yZW1vdGVgKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgIH0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignUFVTSCcsIGFzeW5jIChicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW90ZSA9IG9wdGlvbnMucmVtb3RlIHx8IGF3YWl0IHRoaXMuZ2V0UmVtb3RlRm9yQnJhbmNoKGJyYW5jaE5hbWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5naXQoKS5wdXNoKHJlbW90ZS5nZXROYW1lT3IoJ29yaWdpbicpLCBicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgICAgIH0sIGJyYW5jaE5hbWUsIG9wdGlvbnMpLFxuICAgICk7XG4gIH1cblxuICAvLyBDb25maWd1cmF0aW9uXG5cbiAgc2V0Q29uZmlnKHNldHRpbmcsIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKHNldHRpbmcpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5zZXRDb25maWcoc2V0dGluZywgdmFsdWUsIG9wdGlvbnMpLFxuICAgICAge2dsb2JhbGx5OiBvcHRpb25zLmdsb2JhbH0sXG4gICAgKTtcbiAgfVxuXG4gIHVuc2V0Q29uZmlnKHNldHRpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKHNldHRpbmcpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS51bnNldENvbmZpZyhzZXR0aW5nKSxcbiAgICApO1xuICB9XG5cbiAgLy8gRGlyZWN0IGJsb2IgaW50ZXJhY3Rpb25zXG5cbiAgY3JlYXRlQmxvYihvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuY3JlYXRlQmxvYihvcHRpb25zKTtcbiAgfVxuXG4gIGV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmV4cGFuZEJsb2JUb0ZpbGUoYWJzRmlsZVBhdGgsIHNoYSk7XG4gIH1cblxuICAvLyBEaXNjYXJkIGhpc3RvcnlcblxuICBjcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuY3JlYXRlSGlzdG9yeUJsb2IoKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZURpc2NhcmRIaXN0b3J5KCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSBhd2FpdCB0aGlzLmxvYWRIaXN0b3J5UGF5bG9hZCgpO1xuICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkudXBkYXRlSGlzdG9yeShoaXN0b3J5KTtcbiAgfVxuXG4gIGFzeW5jIHN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyhmaWxlUGF0aHMsIGlzU2FmZSwgZGVzdHJ1Y3RpdmVBY3Rpb24sIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3Qgc25hcHNob3RzID0gYXdhaXQgdGhpcy5kaXNjYXJkSGlzdG9yeS5zdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoXG4gICAgICBmaWxlUGF0aHMsXG4gICAgICBpc1NhZmUsXG4gICAgICBkZXN0cnVjdGl2ZUFjdGlvbixcbiAgICAgIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgsXG4gICAgKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChzbmFwc2hvdHMpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gICAgfVxuICAgIHJldHVybiBzbmFwc2hvdHM7XG4gIH1cblxuICByZXN0b3JlTGFzdERpc2NhcmRJblRlbXBGaWxlcyhpc1NhZmUsIHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkucmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIHBvcERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgY29uc3QgcmVtb3ZlZCA9IGF3YWl0IHRoaXMuZGlzY2FyZEhpc3RvcnkucG9wSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgYXdhaXQgdGhpcy5zYXZlRGlzY2FyZEhpc3RvcnkoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckRpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgdGhpcy5kaXNjYXJkSGlzdG9yeS5jbGVhckhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gIH1cblxuICBkaXNjYXJkV29ya0RpckNoYW5nZXNGb3JQYXRocyhwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICAuLi5wYXRocy5tYXAoZmlsZVBhdGggPT4gS2V5cy5maWxlUGF0Y2gub25lV2l0aChmaWxlUGF0aCwge3N0YWdlZDogZmFsc2V9KSksXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hOb25IZWFkV2l0aEZpbGVzKHBhdGhzKSxcbiAgICAgIF0sXG4gICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVudHJhY2tlZEZpbGVzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRVbnRyYWNrZWRGaWxlcygpO1xuICAgICAgICBjb25zdCBbZmlsZXNUb1JlbW92ZSwgZmlsZXNUb0NoZWNrb3V0XSA9IHBhcnRpdGlvbihwYXRocywgZiA9PiB1bnRyYWNrZWRGaWxlcy5pbmNsdWRlcyhmKSk7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuY2hlY2tvdXRGaWxlcyhmaWxlc1RvQ2hlY2tvdXQpO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChmaWxlc1RvUmVtb3ZlLm1hcChmaWxlUGF0aCA9PiB7XG4gICAgICAgICAgY29uc3QgYWJzUGF0aCA9IHBhdGguam9pbih0aGlzLndvcmtkaXIoKSwgZmlsZVBhdGgpO1xuICAgICAgICAgIHJldHVybiBmcy5yZW1vdmUoYWJzUGF0aCk7XG4gICAgICAgIH0pKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIC8vIEFjY2Vzc29ycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvLyBJbmRleCBxdWVyaWVzXG5cbiAgZ2V0U3RhdHVzQnVuZGxlKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuc3RhdHVzQnVuZGxlLCBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCB0aGlzLmdpdCgpLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5mb3JtYXRDaGFuZ2VkRmlsZXMoYnVuZGxlKTtcbiAgICAgICAgcmVzdWx0cy5icmFuY2ggPSBidW5kbGUuYnJhbmNoO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgTGFyZ2VSZXBvRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnRyYW5zaXRpb25UbygnVG9vTGFyZ2UnKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYnJhbmNoOiB7fSxcbiAgICAgICAgICAgIHN0YWdlZEZpbGVzOiB7fSxcbiAgICAgICAgICAgIHVuc3RhZ2VkRmlsZXM6IHt9LFxuICAgICAgICAgICAgbWVyZ2VDb25mbGljdEZpbGVzOiB7fSxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZm9ybWF0Q2hhbmdlZEZpbGVzKHtjaGFuZ2VkRW50cmllcywgdW50cmFja2VkRW50cmllcywgcmVuYW1lZEVudHJpZXMsIHVubWVyZ2VkRW50cmllc30pIHtcbiAgICBjb25zdCBzdGF0dXNNYXAgPSB7XG4gICAgICBBOiAnYWRkZWQnLFxuICAgICAgTTogJ21vZGlmaWVkJyxcbiAgICAgIEQ6ICdkZWxldGVkJyxcbiAgICAgIFU6ICdtb2RpZmllZCcsXG4gICAgICBUOiAndHlwZWNoYW5nZScsXG4gICAgfTtcblxuICAgIGNvbnN0IHN0YWdlZEZpbGVzID0ge307XG4gICAgY29uc3QgdW5zdGFnZWRGaWxlcyA9IHt9O1xuICAgIGNvbnN0IG1lcmdlQ29uZmxpY3RGaWxlcyA9IHt9O1xuXG4gICAgY2hhbmdlZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBpZiAoZW50cnkuc3RhZ2VkU3RhdHVzKSB7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcFtlbnRyeS5zdGFnZWRTdGF0dXNdO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnVuc3RhZ2VkU3RhdHVzKSB7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwW2VudHJ5LnVuc3RhZ2VkU3RhdHVzXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHVudHJhY2tlZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgIH0pO1xuXG4gICAgcmVuYW1lZEVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBpZiAoZW50cnkuc3RhZ2VkU3RhdHVzID09PSAnUicpIHtcbiAgICAgICAgc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5Lm9yaWdGaWxlUGF0aF0gPSBzdGF0dXNNYXAuRDtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS51bnN0YWdlZFN0YXR1cyA9PT0gJ1InKSB7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkub3JpZ0ZpbGVQYXRoXSA9IHN0YXR1c01hcC5EO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnN0YWdlZFN0YXR1cyA9PT0gJ0MnKSB7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgfVxuICAgICAgaWYgKGVudHJ5LnVuc3RhZ2VkU3RhdHVzID09PSAnQycpIHtcbiAgICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBzdGF0dXNUb0hlYWQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVubWVyZ2VkRW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge3N0YWdlZFN0YXR1cywgdW5zdGFnZWRTdGF0dXMsIGZpbGVQYXRofSA9IHVubWVyZ2VkRW50cmllc1tpXTtcbiAgICAgIGlmIChzdGFnZWRTdGF0dXMgPT09ICdVJyB8fCB1bnN0YWdlZFN0YXR1cyA9PT0gJ1UnIHx8IChzdGFnZWRTdGF0dXMgPT09ICdBJyAmJiB1bnN0YWdlZFN0YXR1cyA9PT0gJ0EnKSkge1xuICAgICAgICAvLyBTa2lwcGluZyB0aGlzIGNoZWNrIGhlcmUgYmVjYXVzZSB3ZSBvbmx5IHJ1biBhIHNpbmdsZSBgYXdhaXRgXG4gICAgICAgIC8vIGFuZCB3ZSBvbmx5IHJ1biBpdCBpbiB0aGUgbWFpbiwgc3luY2hyb25vdXMgYm9keSBvZiB0aGUgZm9yIGxvb3AuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICAgIGlmICghc3RhdHVzVG9IZWFkKSB7IHN0YXR1c1RvSGVhZCA9IGF3YWl0IHRoaXMuZ2l0KCkuZGlmZkZpbGVTdGF0dXMoe3RhcmdldDogJ0hFQUQnfSk7IH1cbiAgICAgICAgbWVyZ2VDb25mbGljdEZpbGVzW2ZpbGVQYXRoXSA9IHtcbiAgICAgICAgICBvdXJzOiBzdGF0dXNNYXBbc3RhZ2VkU3RhdHVzXSxcbiAgICAgICAgICB0aGVpcnM6IHN0YXR1c01hcFt1bnN0YWdlZFN0YXR1c10sXG4gICAgICAgICAgZmlsZTogc3RhdHVzVG9IZWFkW2ZpbGVQYXRoXSB8fCAnZXF1aXZhbGVudCcsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtzdGFnZWRGaWxlcywgdW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfTtcbiAgfVxuXG4gIGFzeW5jIGdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKCkge1xuICAgIGNvbnN0IHtzdGFnZWRGaWxlcywgdW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIHtzdGFnZWRGaWxlcywgdW5zdGFnZWRGaWxlcywgbWVyZ2VDb25mbGljdEZpbGVzfTtcbiAgfVxuXG4gIGdldEZpbGVQYXRjaEZvclBhdGgoZmlsZVBhdGgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgc3RhZ2VkOiBmYWxzZSxcbiAgICAgIHBhdGNoQnVmZmVyOiBudWxsLFxuICAgICAgYnVpbGRlcjoge30sXG4gICAgICBiZWZvcmU6ICgpID0+IHt9LFxuICAgICAgYWZ0ZXI6ICgpID0+IHt9LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5maWxlUGF0Y2gub25lV2l0aChmaWxlUGF0aCwge3N0YWdlZDogb3B0cy5zdGFnZWR9KSwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlmZnMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIHtzdGFnZWQ6IG9wdHMuc3RhZ2VkfSk7XG4gICAgICBjb25zdCBwYXlsb2FkID0gb3B0cy5iZWZvcmUoKTtcbiAgICAgIGNvbnN0IHBhdGNoID0gYnVpbGRGaWxlUGF0Y2goZGlmZnMsIG9wdHMuYnVpbGRlcik7XG4gICAgICBpZiAob3B0cy5wYXRjaEJ1ZmZlciAhPT0gbnVsbCkgeyBwYXRjaC5hZG9wdEJ1ZmZlcihvcHRzLnBhdGNoQnVmZmVyKTsgfVxuICAgICAgb3B0cy5hZnRlcihwYXRjaCwgcGF5bG9hZCk7XG4gICAgICByZXR1cm4gcGF0Y2g7XG4gICAgfSk7XG4gIH1cblxuICBnZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCBiYXNlQ29tbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5maWxlUGF0Y2gub25lV2l0aChmaWxlUGF0aCwge2Jhc2VDb21taXR9KSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwge2Jhc2VDb21taXR9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFN0YWdlZENoYW5nZXNQYXRjaChvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGJ1aWxkZXI6IHt9LFxuICAgICAgcGF0Y2hCdWZmZXI6IG51bGwsXG4gICAgICBiZWZvcmU6ICgpID0+IHt9LFxuICAgICAgYWZ0ZXI6ICgpID0+IHt9LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5zdGFnZWRDaGFuZ2VzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkaWZmcyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoKCk7XG4gICAgICBjb25zdCBwYXlsb2FkID0gb3B0cy5iZWZvcmUoKTtcbiAgICAgIGNvbnN0IHBhdGNoID0gYnVpbGRNdWx0aUZpbGVQYXRjaChkaWZmcywgb3B0cy5idWlsZGVyKTtcbiAgICAgIGlmIChvcHRzLnBhdGNoQnVmZmVyICE9PSBudWxsKSB7IHBhdGNoLmFkb3B0QnVmZmVyKG9wdHMucGF0Y2hCdWZmZXIpOyB9XG4gICAgICBvcHRzLmFmdGVyKHBhdGNoLCBwYXlsb2FkKTtcbiAgICAgIHJldHVybiBwYXRjaDtcbiAgICB9KTtcbiAgfVxuXG4gIHJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5pbmRleC5vbmVXaXRoKGZpbGVQYXRoKSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkucmVhZEZpbGVGcm9tSW5kZXgoZmlsZVBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQ29tbWl0IGFjY2Vzc1xuXG4gIGdldExhc3RDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5sYXN0Q29tbWl0LCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBoZWFkQ29tbWl0ID0gYXdhaXQgdGhpcy5naXQoKS5nZXRIZWFkQ29tbWl0KCk7XG4gICAgICByZXR1cm4gaGVhZENvbW1pdC51bmJvcm5SZWYgPyBDb21taXQuY3JlYXRlVW5ib3JuKCkgOiBuZXcgQ29tbWl0KGhlYWRDb21taXQpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29tbWl0KHNoYSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYmxvYi5vbmVXaXRoKHNoYSksIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IFtyYXdDb21taXRdID0gYXdhaXQgdGhpcy5naXQoKS5nZXRDb21taXRzKHttYXg6IDEsIHJlZjogc2hhLCBpbmNsdWRlUGF0Y2g6IHRydWV9KTtcbiAgICAgIGNvbnN0IGNvbW1pdCA9IG5ldyBDb21taXQocmF3Q29tbWl0KTtcbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSk7XG4gIH1cblxuICBnZXRSZWNlbnRDb21taXRzKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnJlY2VudENvbW1pdHMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbW1pdHMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldENvbW1pdHMoe3JlZjogJ0hFQUQnLCAuLi5vcHRpb25zfSk7XG4gICAgICByZXR1cm4gY29tbWl0cy5tYXAoY29tbWl0ID0+IG5ldyBDb21taXQoY29tbWl0KSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBpc0NvbW1pdFB1c2hlZChzaGEpIHtcbiAgICBjb25zdCBjdXJyZW50QnJhbmNoID0gYXdhaXQgdGhpcy5yZXBvc2l0b3J5LmdldEN1cnJlbnRCcmFuY2goKTtcbiAgICBjb25zdCB1cHN0cmVhbSA9IGN1cnJlbnRCcmFuY2guZ2V0UHVzaCgpO1xuICAgIGlmICghdXBzdHJlYW0uaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZWQgPSBhd2FpdCB0aGlzLmdpdCgpLmdldEJyYW5jaGVzV2l0aENvbW1pdChzaGEsIHtcbiAgICAgIHNob3dMb2NhbDogZmFsc2UsXG4gICAgICBzaG93UmVtb3RlOiB0cnVlLFxuICAgICAgcGF0dGVybjogdXBzdHJlYW0uZ2V0U2hvcnRSZWYoKSxcbiAgICB9KTtcbiAgICByZXR1cm4gY29udGFpbmVkLnNvbWUocmVmID0+IHJlZi5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIC8vIEF1dGhvciBpbmZvcm1hdGlvblxuXG4gIGdldEF1dGhvcnMob3B0aW9ucykge1xuICAgIC8vIEZvciBub3cgd2UnbGwgZG8gdGhlIG5haXZlIHRoaW5nIGFuZCBpbnZhbGlkYXRlIGFueXRpbWUgSEVBRCBtb3Zlcy4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgZ2V0IG5ldyBhdXRob3JzXG4gICAgLy8gaW50cm9kdWNlZCBieSBuZXdseSBjcmVhdGVkIGNvbW1pdHMgb3IgcHVsbGVkIGNvbW1pdHMuXG4gICAgLy8gVGhpcyBtZWFucyB0aGF0IHdlIGFyZSBjb25zdGFudGx5IHJlLWZldGNoaW5nIGRhdGEuIElmIHBlcmZvcm1hbmNlIGJlY29tZXMgYSBjb25jZXJuIHdlIGNhbiBvcHRpbWl6ZVxuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYXV0aG9ycywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYXV0aG9yTWFwID0gYXdhaXQgdGhpcy5naXQoKS5nZXRBdXRob3JzKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGF1dGhvck1hcCkubWFwKGVtYWlsID0+IG5ldyBBdXRob3IoZW1haWwsIGF1dGhvck1hcFtlbWFpbF0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEJyYW5jaGVzXG5cbiAgZ2V0QnJhbmNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5icmFuY2hlcywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZHMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldEJyYW5jaGVzKCk7XG4gICAgICBjb25zdCBicmFuY2hlcyA9IG5ldyBCcmFuY2hTZXQoKTtcbiAgICAgIGZvciAoY29uc3QgcGF5bG9hZCBvZiBwYXlsb2Fkcykge1xuICAgICAgICBsZXQgdXBzdHJlYW0gPSBudWxsQnJhbmNoO1xuICAgICAgICBpZiAocGF5bG9hZC51cHN0cmVhbSkge1xuICAgICAgICAgIHVwc3RyZWFtID0gcGF5bG9hZC51cHN0cmVhbS5yZW1vdGVOYW1lXG4gICAgICAgICAgICA/IEJyYW5jaC5jcmVhdGVSZW1vdGVUcmFja2luZyhcbiAgICAgICAgICAgICAgcGF5bG9hZC51cHN0cmVhbS50cmFja2luZ1JlZixcbiAgICAgICAgICAgICAgcGF5bG9hZC51cHN0cmVhbS5yZW1vdGVOYW1lLFxuICAgICAgICAgICAgICBwYXlsb2FkLnVwc3RyZWFtLnJlbW90ZVJlZixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogbmV3IEJyYW5jaChwYXlsb2FkLnVwc3RyZWFtLnRyYWNraW5nUmVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwdXNoID0gdXBzdHJlYW07XG4gICAgICAgIGlmIChwYXlsb2FkLnB1c2gpIHtcbiAgICAgICAgICBwdXNoID0gcGF5bG9hZC5wdXNoLnJlbW90ZU5hbWVcbiAgICAgICAgICAgID8gQnJhbmNoLmNyZWF0ZVJlbW90ZVRyYWNraW5nKFxuICAgICAgICAgICAgICBwYXlsb2FkLnB1c2gudHJhY2tpbmdSZWYsXG4gICAgICAgICAgICAgIHBheWxvYWQucHVzaC5yZW1vdGVOYW1lLFxuICAgICAgICAgICAgICBwYXlsb2FkLnB1c2gucmVtb3RlUmVmLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBuZXcgQnJhbmNoKHBheWxvYWQucHVzaC50cmFja2luZ1JlZik7XG4gICAgICAgIH1cblxuICAgICAgICBicmFuY2hlcy5hZGQobmV3IEJyYW5jaChwYXlsb2FkLm5hbWUsIHVwc3RyZWFtLCBwdXNoLCBwYXlsb2FkLmhlYWQsIHtzaGE6IHBheWxvYWQuc2hhfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJyYW5jaGVzO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SGVhZERlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuaGVhZERlc2NyaXB0aW9uLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5kZXNjcmliZUhlYWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1lcmdpbmcgYW5kIHJlYmFzaW5nIHN0YXR1c1xuXG4gIGlzTWVyZ2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5pc01lcmdpbmcodGhpcy5yZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSk7XG4gIH1cblxuICBpc1JlYmFzaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmlzUmViYXNpbmcodGhpcy5yZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSk7XG4gIH1cblxuICAvLyBSZW1vdGVzXG5cbiAgZ2V0UmVtb3RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnJlbW90ZXMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlbW90ZXNJbmZvID0gYXdhaXQgdGhpcy5naXQoKS5nZXRSZW1vdGVzKCk7XG4gICAgICByZXR1cm4gbmV3IFJlbW90ZVNldChcbiAgICAgICAgcmVtb3Rlc0luZm8ubWFwKCh7bmFtZSwgdXJsfSkgPT4gbmV3IFJlbW90ZShuYW1lLCB1cmwpKSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRSZW1vdGUobmFtZSwgdXJsKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgLi4uS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKGByZW1vdGUuJHtuYW1lfS51cmxgKSxcbiAgICAgICAgLi4uS2V5cy5jb25maWcuZWFjaFdpdGhTZXR0aW5nKGByZW1vdGUuJHtuYW1lfS5mZXRjaGApLFxuICAgICAgICBLZXlzLnJlbW90ZXMsXG4gICAgICBdLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ0FERFJFTU9URScsIGFzeW5jIChuYW1lLCB1cmwpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5hZGRSZW1vdGUobmFtZSwgdXJsKTtcbiAgICAgICAgcmV0dXJuIG5ldyBSZW1vdGUobmFtZSwgdXJsKTtcbiAgICAgIH0sIG5hbWUsIHVybCksXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGdldEFoZWFkQ291bnQoYnJhbmNoTmFtZSkge1xuICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIGJ1bmRsZS5icmFuY2guYWhlYWRCZWhpbmQuYWhlYWQ7XG4gIH1cblxuICBhc3luYyBnZXRCZWhpbmRDb3VudChicmFuY2hOYW1lKSB7XG4gICAgY29uc3QgYnVuZGxlID0gYXdhaXQgdGhpcy5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICByZXR1cm4gYnVuZGxlLmJyYW5jaC5haGVhZEJlaGluZC5iZWhpbmQ7XG4gIH1cblxuICBnZXRDb25maWcob3B0aW9uLCB7bG9jYWx9ID0ge2xvY2FsOiBmYWxzZX0pIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmNvbmZpZy5vbmVXaXRoKG9wdGlvbiwge2xvY2FsfSksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmdldENvbmZpZyhvcHRpb24sIHtsb2NhbH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGlyZWN0R2V0Q29uZmlnKGtleSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdldENvbmZpZyhrZXksIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gRGlyZWN0IGJsb2IgYWNjZXNzXG5cbiAgZ2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYmxvYi5vbmVXaXRoKHNoYSksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmdldEJsb2JDb250ZW50cyhzaGEpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlyZWN0R2V0QmxvYkNvbnRlbnRzKHNoYSkge1xuICAgIHJldHVybiB0aGlzLmdldEJsb2JDb250ZW50cyhzaGEpO1xuICB9XG5cbiAgLy8gRGlzY2FyZCBoaXN0b3J5XG5cbiAgaGFzRGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5oYXNIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgZ2V0RGlzY2FyZEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5nZXRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgZ2V0TGFzdEhpc3RvcnlTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNjYXJkSGlzdG9yeS5nZXRMYXN0U25hcHNob3RzKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICB9XG5cbiAgLy8gQ2FjaGVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDYWNoZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgfVxuXG4gIGludmFsaWRhdGUoc3BlYywgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIGJvZHkoKS50aGVuKFxuICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgdGhpcy5hY2NlcHRJbnZhbGlkYXRpb24oc3BlYywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgdGhpcy5hY2NlcHRJbnZhbGlkYXRpb24oc3BlYywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG59XG5cblN0YXRlLnJlZ2lzdGVyKFByZXNlbnQpO1xuXG5mdW5jdGlvbiBwYXJ0aXRpb24oYXJyYXksIHByZWRpY2F0ZSkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGNvbnN0IG5vbm1hdGNoZXMgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICBtYXRjaGVzLnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vbm1hdGNoZXMucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gW21hdGNoZXMsIG5vbm1hdGNoZXNdO1xufVxuXG5jbGFzcyBDYWNoZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3RvcmFnZSA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmJ5R3JvdXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgZ2V0T3JTZXQoa2V5LCBvcGVyYXRpb24pIHtcbiAgICBjb25zdCBwcmltYXJ5ID0ga2V5LmdldFByaW1hcnkoKTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuc3RvcmFnZS5nZXQocHJpbWFyeSk7XG4gICAgaWYgKGV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGV4aXN0aW5nLmhpdHMrKztcbiAgICAgIHJldHVybiBleGlzdGluZy5wcm9taXNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZWQgPSBvcGVyYXRpb24oKTtcblxuICAgIHRoaXMuc3RvcmFnZS5zZXQocHJpbWFyeSwge1xuICAgICAgY3JlYXRlZEF0OiBwZXJmb3JtYW5jZS5ub3coKSxcbiAgICAgIGhpdHM6IDAsXG4gICAgICBwcm9taXNlOiBjcmVhdGVkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JvdXBzID0ga2V5LmdldEdyb3VwcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncm91cCA9IGdyb3Vwc1tpXTtcbiAgICAgIGxldCBncm91cFNldCA9IHRoaXMuYnlHcm91cC5nZXQoZ3JvdXApO1xuICAgICAgaWYgKGdyb3VwU2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZ3JvdXBTZXQgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMuYnlHcm91cC5zZXQoZ3JvdXAsIGdyb3VwU2V0KTtcbiAgICAgIH1cbiAgICAgIGdyb3VwU2V0LmFkZChrZXkpO1xuICAgIH1cblxuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG5cbiAgICByZXR1cm4gY3JlYXRlZDtcbiAgfVxuXG4gIGludmFsaWRhdGUoa2V5cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5c1tpXS5yZW1vdmVGcm9tQ2FjaGUodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKGtleXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBrZXlzSW5Hcm91cChncm91cCkge1xuICAgIHJldHVybiB0aGlzLmJ5R3JvdXAuZ2V0KGdyb3VwKSB8fCBbXTtcbiAgfVxuXG4gIHJlbW92ZVByaW1hcnkocHJpbWFyeSkge1xuICAgIHRoaXMuc3RvcmFnZS5kZWxldGUocHJpbWFyeSk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21Hcm91cChncm91cCwga2V5KSB7XG4gICAgY29uc3QgZ3JvdXBTZXQgPSB0aGlzLmJ5R3JvdXAuZ2V0KGdyb3VwKTtcbiAgICBncm91cFNldCAmJiBncm91cFNldC5kZWxldGUoa2V5KTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcbiAgICB0aGlzLmJ5R3JvdXAuY2xlYXIoKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgZGlkVXBkYXRlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJyk7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBvbkRpZFVwZGF0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsUUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQUcsTUFBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUksS0FBQSxHQUFBSixPQUFBO0FBRUEsSUFBQUssb0JBQUEsR0FBQUwsT0FBQTtBQUNBLElBQUFNLHdCQUFBLEdBQUFOLE9B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