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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2V2ZW50S2l0IiwiX2ZzRXh0cmEiLCJfc3RhdGUiLCJfa2V5cyIsIl9naXRTaGVsbE91dFN0cmF0ZWd5IiwiX3dvcmtzcGFjZUNoYW5nZU9ic2VydmVyIiwiX3BhdGNoIiwiX2Rpc2NhcmRIaXN0b3J5IiwiX2JyYW5jaCIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX2F1dGhvciIsIl9icmFuY2hTZXQiLCJfcmVtb3RlIiwiX3JlbW90ZVNldCIsIl9jb21taXQiLCJfb3BlcmF0aW9uU3RhdGVzIiwiX3JlcG9ydGVyUHJveHkiLCJfaGVscGVycyIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJrZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9scyIsImZpbHRlciIsInN5bSIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImFyZyIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsImlucHV0IiwiaGludCIsInByaW0iLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsInVuZGVmaW5lZCIsInJlcyIsIlR5cGVFcnJvciIsIk51bWJlciIsIlByZXNlbnQiLCJTdGF0ZSIsImNvbnN0cnVjdG9yIiwicmVwb3NpdG9yeSIsImhpc3RvcnkiLCJDYWNoZSIsImRpc2NhcmRIaXN0b3J5IiwiRGlzY2FyZEhpc3RvcnkiLCJjcmVhdGVCbG9iIiwiYmluZCIsImV4cGFuZEJsb2JUb0ZpbGUiLCJtZXJnZUZpbGUiLCJ3b3JrZGlyIiwibWF4SGlzdG9yeUxlbmd0aCIsIm9wZXJhdGlvblN0YXRlcyIsIk9wZXJhdGlvblN0YXRlcyIsImRpZFVwZGF0ZSIsImNvbW1pdE1lc3NhZ2UiLCJjb21taXRNZXNzYWdlVGVtcGxhdGUiLCJmZXRjaEluaXRpYWxNZXNzYWdlIiwidXBkYXRlSGlzdG9yeSIsInNldENvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlIiwic3VwcHJlc3NVcGRhdGUiLCJzZXRDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsIm1lcmdlTWVzc2FnZSIsImdldE1lcmdlTWVzc2FnZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwiZ2V0Q29tbWl0TWVzc2FnZSIsImdpdCIsImdldE9wZXJhdGlvblN0YXRlcyIsImlzUHJlc2VudCIsImRlc3Ryb3kiLCJzaG93U3RhdHVzQmFyVGlsZXMiLCJpc1B1Ymxpc2hhYmxlIiwiYWNjZXB0SW52YWxpZGF0aW9uIiwic3BlYyIsImdsb2JhbGx5IiwiaW52YWxpZGF0ZSIsImRpZEdsb2JhbGx5SW52YWxpZGF0ZSIsImludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZSIsImV2ZW50cyIsInBhdGhzIiwibWFwIiwiZSIsInNwZWNpYWwiLCJwYXRoIiwiU2V0IiwiZnVsbFBhdGgiLCJGT0NVUyIsImFkZCIsIktleXMiLCJzdGF0dXNCdW5kbGUiLCJrIiwiZmlsZVBhdGNoIiwiZWFjaFdpdGhPcHRzIiwic3RhZ2VkIiwiaW5jbHVkZXMiLCJzZWdtZW50cyIsImpvaW4iLCJmaWxlUGF0aEVuZHNXaXRoIiwic3RhZ2VkQ2hhbmdlcyIsImFsbCIsImluZGV4IiwiYnJhbmNoZXMiLCJsYXN0Q29tbWl0IiwicmVjZW50Q29tbWl0cyIsImhlYWREZXNjcmlwdGlvbiIsImF1dGhvcnMiLCJyZW1vdGVzIiwiY29uZmlnIiwicmVsYXRpdmVQYXRoIiwicmVsYXRpdmUiLCJlYWNoV2l0aEZpbGVPcHRzIiwic2l6ZSIsIkFycmF5IiwiZnJvbSIsImlzQ29tbWl0TWVzc2FnZUNsZWFuIiwidHJpbSIsInVwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UiLCJldmVudCIsImFjdGlvbiIsIm9ic2VydmVGaWxlc3lzdGVtQ2hhbmdlIiwicmVmcmVzaCIsImNsZWFyIiwiaW5pdCIsImNhdGNoIiwic3RkRXJyIiwiUHJvbWlzZSIsInJlamVjdCIsImNsb25lIiwic3RhZ2VGaWxlcyIsImNhY2hlT3BlcmF0aW9uS2V5cyIsInVuc3RhZ2VGaWxlcyIsInN0YWdlRmlsZXNGcm9tUGFyZW50Q29tbWl0Iiwic3RhZ2VGaWxlTW9kZUNoYW5nZSIsImZpbGVQYXRoIiwiZmlsZU1vZGUiLCJzdGFnZUZpbGVTeW1saW5rQ2hhbmdlIiwiYXBwbHlQYXRjaFRvSW5kZXgiLCJtdWx0aUZpbGVQYXRjaCIsImdldFBhdGhTZXQiLCJwYXRjaFN0ciIsInRvU3RyaW5nIiwiYXBwbHlQYXRjaCIsImFwcGx5UGF0Y2hUb1dvcmtkaXIiLCJ3b3JrZGlyT3BlcmF0aW9uS2V5cyIsImNvbW1pdCIsIm9wdGlvbnMiLCJoZWFkT3BlcmF0aW9uS2V5cyIsImV4ZWN1dGVQaXBlbGluZUFjdGlvbiIsImNvQXV0aG9ycyIsIm9wdHMiLCJhdXRob3IiLCJlbWFpbCIsImdldEVtYWlsIiwibmFtZSIsImdldEZ1bGxOYW1lIiwidW5zdGFnZWRGaWxlcyIsIm1lcmdlQ29uZmxpY3RGaWxlcyIsImdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzIiwidW5zdGFnZWRDb3VudCIsImFkZEV2ZW50IiwicGFja2FnZSIsInBhcnRpYWwiLCJhbWVuZCIsImNvQXV0aG9yQ291bnQiLCJtZXJnZSIsImJyYW5jaE5hbWUiLCJhYm9ydE1lcmdlIiwiY2hlY2tvdXRTaWRlIiwic2lkZSIsIm91cnNQYXRoIiwiY29tbW9uQmFzZVBhdGgiLCJ0aGVpcnNQYXRoIiwicmVzdWx0UGF0aCIsIndyaXRlTWVyZ2VDb25mbGljdFRvSW5kZXgiLCJjb21tb25CYXNlU2hhIiwib3Vyc1NoYSIsInRoZWlyc1NoYSIsIm9uZVdpdGgiLCJjaGVja291dCIsInJldmlzaW9uIiwiYWxsQWdhaW5zdE5vbkhlYWQiLCJjaGVja291dFBhdGhzQXRSZXZpc2lvbiIsImZpbGVOYW1lIiwiZWFjaE5vbkhlYWRXaXRoRmlsZXMiLCJjaGVja291dEZpbGVzIiwidW5kb0xhc3RDb21taXQiLCJyZXNldCIsInRlc3QiLCJkZWxldGVSZWYiLCJmZXRjaCIsImZpbmFsUmVtb3RlTmFtZSIsInJlbW90ZU5hbWUiLCJyZW1vdGUiLCJnZXRSZW1vdGVGb3JCcmFuY2giLCJnZXROYW1lIiwicHVsbCIsInNldFVwc3RyZWFtIiwiZWFjaFdpdGhTZXR0aW5nIiwiZ2V0TmFtZU9yIiwic2V0Q29uZmlnIiwic2V0dGluZyIsImdsb2JhbCIsInVuc2V0Q29uZmlnIiwiYWJzRmlsZVBhdGgiLCJzaGEiLCJjcmVhdGVEaXNjYXJkSGlzdG9yeUJsb2IiLCJjcmVhdGVIaXN0b3J5QmxvYiIsInVwZGF0ZURpc2NhcmRIaXN0b3J5IiwibG9hZEhpc3RvcnlQYXlsb2FkIiwic3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzIiwiZmlsZVBhdGhzIiwiaXNTYWZlIiwiZGVzdHJ1Y3RpdmVBY3Rpb24iLCJwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoIiwic25hcHNob3RzIiwic2F2ZURpc2NhcmRIaXN0b3J5IiwicmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMiLCJwb3BEaXNjYXJkSGlzdG9yeSIsInJlbW92ZWQiLCJwb3BIaXN0b3J5IiwiY2xlYXJEaXNjYXJkSGlzdG9yeSIsImNsZWFySGlzdG9yeSIsImRpc2NhcmRXb3JrRGlyQ2hhbmdlc0ZvclBhdGhzIiwidW50cmFja2VkRmlsZXMiLCJnZXRVbnRyYWNrZWRGaWxlcyIsImZpbGVzVG9SZW1vdmUiLCJmaWxlc1RvQ2hlY2tvdXQiLCJwYXJ0aXRpb24iLCJmIiwiYWJzUGF0aCIsImZzIiwicmVtb3ZlIiwiZ2V0U3RhdHVzQnVuZGxlIiwiZ2V0T3JTZXQiLCJidW5kbGUiLCJyZXN1bHRzIiwiZm9ybWF0Q2hhbmdlZEZpbGVzIiwiYnJhbmNoIiwiZXJyIiwiTGFyZ2VSZXBvRXJyb3IiLCJ0cmFuc2l0aW9uVG8iLCJzdGFnZWRGaWxlcyIsImNoYW5nZWRFbnRyaWVzIiwidW50cmFja2VkRW50cmllcyIsInJlbmFtZWRFbnRyaWVzIiwidW5tZXJnZWRFbnRyaWVzIiwic3RhdHVzTWFwIiwiQSIsIk0iLCJEIiwiVSIsIlQiLCJlbnRyeSIsInN0YWdlZFN0YXR1cyIsInVuc3RhZ2VkU3RhdHVzIiwib3JpZ0ZpbGVQYXRoIiwic3RhdHVzVG9IZWFkIiwiZGlmZkZpbGVTdGF0dXMiLCJvdXJzIiwidGhlaXJzIiwiZmlsZSIsImdldEZpbGVQYXRjaEZvclBhdGgiLCJwYXRjaEJ1ZmZlciIsImJ1aWxkZXIiLCJiZWZvcmUiLCJhZnRlciIsImRpZmZzIiwiZ2V0RGlmZnNGb3JGaWxlUGF0aCIsInBheWxvYWQiLCJwYXRjaCIsImJ1aWxkRmlsZVBhdGNoIiwiYWRvcHRCdWZmZXIiLCJiYXNlQ29tbWl0IiwiZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoIiwiYnVpbGRNdWx0aUZpbGVQYXRjaCIsInJlYWRGaWxlRnJvbUluZGV4IiwiZ2V0TGFzdENvbW1pdCIsImhlYWRDb21taXQiLCJnZXRIZWFkQ29tbWl0IiwidW5ib3JuUmVmIiwiQ29tbWl0IiwiY3JlYXRlVW5ib3JuIiwiZ2V0Q29tbWl0IiwiYmxvYiIsInJhd0NvbW1pdCIsImdldENvbW1pdHMiLCJtYXgiLCJyZWYiLCJpbmNsdWRlUGF0Y2giLCJnZXRSZWNlbnRDb21taXRzIiwiY29tbWl0cyIsImlzQ29tbWl0UHVzaGVkIiwiY3VycmVudEJyYW5jaCIsImdldEN1cnJlbnRCcmFuY2giLCJ1cHN0cmVhbSIsImdldFB1c2giLCJjb250YWluZWQiLCJnZXRCcmFuY2hlc1dpdGhDb21taXQiLCJzaG93TG9jYWwiLCJzaG93UmVtb3RlIiwicGF0dGVybiIsImdldFNob3J0UmVmIiwic29tZSIsImdldEF1dGhvcnMiLCJhdXRob3JNYXAiLCJBdXRob3IiLCJnZXRCcmFuY2hlcyIsInBheWxvYWRzIiwiQnJhbmNoU2V0IiwibnVsbEJyYW5jaCIsIkJyYW5jaCIsImNyZWF0ZVJlbW90ZVRyYWNraW5nIiwidHJhY2tpbmdSZWYiLCJyZW1vdGVSZWYiLCJoZWFkIiwiZ2V0SGVhZERlc2NyaXB0aW9uIiwiZGVzY3JpYmVIZWFkIiwiaXNNZXJnaW5nIiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsImlzUmViYXNpbmciLCJnZXRSZW1vdGVzIiwicmVtb3Rlc0luZm8iLCJSZW1vdGVTZXQiLCJ1cmwiLCJSZW1vdGUiLCJhZGRSZW1vdGUiLCJnZXRBaGVhZENvdW50IiwiYWhlYWRCZWhpbmQiLCJhaGVhZCIsImdldEJlaGluZENvdW50IiwiYmVoaW5kIiwiZ2V0Q29uZmlnIiwib3B0aW9uIiwibG9jYWwiLCJkaXJlY3RHZXRDb25maWciLCJnZXRCbG9iQ29udGVudHMiLCJkaXJlY3RHZXRCbG9iQ29udGVudHMiLCJoYXNEaXNjYXJkSGlzdG9yeSIsImhhc0hpc3RvcnkiLCJnZXREaXNjYXJkSGlzdG9yeSIsImdldEhpc3RvcnkiLCJnZXRMYXN0SGlzdG9yeVNuYXBzaG90cyIsImdldExhc3RTbmFwc2hvdHMiLCJnZXRDYWNoZSIsImJvZHkiLCJ0aGVuIiwicmVzdWx0IiwiZXhwb3J0cyIsInJlZ2lzdGVyIiwiYXJyYXkiLCJwcmVkaWNhdGUiLCJtYXRjaGVzIiwibm9ubWF0Y2hlcyIsIml0ZW0iLCJzdG9yYWdlIiwiTWFwIiwiYnlHcm91cCIsImVtaXR0ZXIiLCJFbWl0dGVyIiwib3BlcmF0aW9uIiwicHJpbWFyeSIsImdldFByaW1hcnkiLCJleGlzdGluZyIsImhpdHMiLCJwcm9taXNlIiwiY3JlYXRlZCIsImNyZWF0ZWRBdCIsInBlcmZvcm1hbmNlIiwibm93IiwiZ3JvdXBzIiwiZ2V0R3JvdXBzIiwiZ3JvdXAiLCJncm91cFNldCIsInJlbW92ZUZyb21DYWNoZSIsImtleXNJbkdyb3VwIiwicmVtb3ZlUHJpbWFyeSIsImRlbGV0ZSIsInJlbW92ZUZyb21Hcm91cCIsIml0ZXJhdG9yIiwiZW1pdCIsIm9uRGlkVXBkYXRlIiwiY2FsbGJhY2siLCJvbiIsImRpc3Bvc2UiXSwic291cmNlcyI6WyJwcmVzZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuaW1wb3J0IHtLZXlzfSBmcm9tICcuL2NhY2hlL2tleXMnO1xuXG5pbXBvcnQge0xhcmdlUmVwb0Vycm9yfSBmcm9tICcuLi8uLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcbmltcG9ydCB7Rk9DVVN9IGZyb20gJy4uL3dvcmtzcGFjZS1jaGFuZ2Utb2JzZXJ2ZXInO1xuaW1wb3J0IHtidWlsZEZpbGVQYXRjaCwgYnVpbGRNdWx0aUZpbGVQYXRjaH0gZnJvbSAnLi4vcGF0Y2gnO1xuaW1wb3J0IERpc2NhcmRIaXN0b3J5IGZyb20gJy4uL2Rpc2NhcmQtaGlzdG9yeSc7XG5pbXBvcnQgQnJhbmNoLCB7bnVsbEJyYW5jaH0gZnJvbSAnLi4vYnJhbmNoJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi4vYXV0aG9yJztcbmltcG9ydCBCcmFuY2hTZXQgZnJvbSAnLi4vYnJhbmNoLXNldCc7XG5pbXBvcnQgUmVtb3RlIGZyb20gJy4uL3JlbW90ZSc7XG5pbXBvcnQgUmVtb3RlU2V0IGZyb20gJy4uL3JlbW90ZS1zZXQnO1xuaW1wb3J0IENvbW1pdCBmcm9tICcuLi9jb21taXQnO1xuaW1wb3J0IE9wZXJhdGlvblN0YXRlcyBmcm9tICcuLi9vcGVyYXRpb24tc3RhdGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uLy4uL3JlcG9ydGVyLXByb3h5JztcbmltcG9ydCB7ZmlsZVBhdGhFbmRzV2l0aH0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5cbi8qKlxuICogU3RhdGUgdXNlZCB3aGVuIHRoZSB3b3JraW5nIGRpcmVjdG9yeSBjb250YWlucyBhIHZhbGlkIGdpdCByZXBvc2l0b3J5IGFuZCBjYW4gYmUgaW50ZXJhY3RlZCB3aXRoLiBQZXJmb3Jtc1xuICogYWN0dWFsIGdpdCBvcGVyYXRpb25zLCBjYWNoaW5nIHRoZSByZXN1bHRzLCBhbmQgYnJvYWRjYXN0cyBgb25EaWRVcGRhdGVgIGV2ZW50cyB3aGVuIHdyaXRlIGFjdGlvbnMgYXJlXG4gKiBwZXJmb3JtZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbnQgZXh0ZW5kcyBTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHJlcG9zaXRvcnksIGhpc3RvcnkpIHtcbiAgICBzdXBlcihyZXBvc2l0b3J5KTtcblxuICAgIHRoaXMuY2FjaGUgPSBuZXcgQ2FjaGUoKTtcblxuICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkgPSBuZXcgRGlzY2FyZEhpc3RvcnkoXG4gICAgICB0aGlzLmNyZWF0ZUJsb2IuYmluZCh0aGlzKSxcbiAgICAgIHRoaXMuZXhwYW5kQmxvYlRvRmlsZS5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy5tZXJnZUZpbGUuYmluZCh0aGlzKSxcbiAgICAgIHRoaXMud29ya2RpcigpLFxuICAgICAge21heEhpc3RvcnlMZW5ndGg6IDYwfSxcbiAgICApO1xuXG4gICAgdGhpcy5vcGVyYXRpb25TdGF0ZXMgPSBuZXcgT3BlcmF0aW9uU3RhdGVzKHtkaWRVcGRhdGU6IHRoaXMuZGlkVXBkYXRlLmJpbmQodGhpcyl9KTtcblxuICAgIHRoaXMuY29tbWl0TWVzc2FnZSA9ICcnO1xuICAgIHRoaXMuY29tbWl0TWVzc2FnZVRlbXBsYXRlID0gbnVsbDtcbiAgICB0aGlzLmZldGNoSW5pdGlhbE1lc3NhZ2UoKTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkudXBkYXRlSGlzdG9yeShoaXN0b3J5KTtcbiAgICB9XG4gIH1cblxuICBzZXRDb21taXRNZXNzYWdlKG1lc3NhZ2UsIHtzdXBwcmVzc1VwZGF0ZX0gPSB7c3VwcHJlc3NVcGRhdGU6IGZhbHNlfSkge1xuICAgIHRoaXMuY29tbWl0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgaWYgKCFzdXBwcmVzc1VwZGF0ZSkge1xuICAgICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBzZXRDb21taXRNZXNzYWdlVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgICB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hJbml0aWFsTWVzc2FnZSgpIHtcbiAgICBjb25zdCBtZXJnZU1lc3NhZ2UgPSBhd2FpdCB0aGlzLnJlcG9zaXRvcnkuZ2V0TWVyZ2VNZXNzYWdlKCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCB0aGlzLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cbiAgICBpZiAobWVyZ2VNZXNzYWdlKSB7XG4gICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UobWVyZ2VNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbW1pdE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0TWVzc2FnZTtcbiAgfVxuXG4gIGZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gIH1cblxuICBnZXRPcGVyYXRpb25TdGF0ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlcmF0aW9uU3RhdGVzO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNhY2hlLmRlc3Ryb3koKTtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gIH1cblxuICBzaG93U3RhdHVzQmFyVGlsZXMoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1B1Ymxpc2hhYmxlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMsIHtnbG9iYWxseX0gPSB7fSkge1xuICAgIHRoaXMuY2FjaGUuaW52YWxpZGF0ZShzcGVjKCkpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgaWYgKGdsb2JhbGx5KSB7XG4gICAgICB0aGlzLmRpZEdsb2JhbGx5SW52YWxpZGF0ZShzcGVjKTtcbiAgICB9XG4gIH1cblxuICBpbnZhbGlkYXRlQ2FjaGVBZnRlckZpbGVzeXN0ZW1DaGFuZ2UoZXZlbnRzKSB7XG4gICAgY29uc3QgcGF0aHMgPSBldmVudHMubWFwKGUgPT4gZS5zcGVjaWFsIHx8IGUucGF0aCk7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGhzW2ldO1xuXG4gICAgICBpZiAoZnVsbFBhdGggPT09IEZPQ1VTKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIEtleXMuZmlsZVBhdGNoLmVhY2hXaXRoT3B0cyh7c3RhZ2VkOiBmYWxzZX0pKSB7XG4gICAgICAgICAga2V5cy5hZGQoayk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluY2x1ZGVzID0gKC4uLnNlZ21lbnRzKSA9PiBmdWxsUGF0aC5pbmNsdWRlcyhwYXRoLmpvaW4oLi4uc2VnbWVudHMpKTtcblxuICAgICAgaWYgKGZpbGVQYXRoRW5kc1dpdGgoZnVsbFBhdGgsICcuZ2l0JywgJ2luZGV4JykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5zdGFnZWRDaGFuZ2VzKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5maWxlUGF0Y2guYWxsKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5pbmRleC5hbGwpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZVBhdGhFbmRzV2l0aChmdWxsUGF0aCwgJy5naXQnLCAnSEVBRCcpKSB7XG4gICAgICAgIGtleXMuYWRkKEtleXMuYnJhbmNoZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmxhc3RDb21taXQpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlY2VudENvbW1pdHMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaGVhZERlc2NyaXB0aW9uKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5hdXRob3JzKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlcygnLmdpdCcsICdyZWZzJywgJ2hlYWRzJykpIHtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5icmFuY2hlcyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMubGFzdENvbW1pdCk7XG4gICAgICAgIGtleXMuYWRkKEtleXMucmVjZW50Q29tbWl0cyk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaGVhZERlc2NyaXB0aW9uKTtcbiAgICAgICAga2V5cy5hZGQoS2V5cy5hdXRob3JzKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlcygnLmdpdCcsICdyZWZzJywgJ3JlbW90ZXMnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlbW90ZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGtleXMuYWRkKEtleXMuaGVhZERlc2NyaXB0aW9uKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGZ1bGxQYXRoLCAnLmdpdCcsICdjb25maWcnKSkge1xuICAgICAgICBrZXlzLmFkZChLZXlzLnJlbW90ZXMpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLmNvbmZpZy5hbGwpO1xuICAgICAgICBrZXlzLmFkZChLZXlzLnN0YXR1c0J1bmRsZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGaWxlIGNoYW5nZSB3aXRoaW4gdGhlIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHRoaXMud29ya2RpcigpLCBmdWxsUGF0aCk7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBLZXlzLmZpbGVQYXRjaC5lYWNoV2l0aEZpbGVPcHRzKFtyZWxhdGl2ZVBhdGhdLCBbe3N0YWdlZDogZmFsc2V9XSkpIHtcbiAgICAgICAga2V5cy5hZGQoa2V5KTtcbiAgICAgIH1cbiAgICAgIGtleXMuYWRkKEtleXMuc3RhdHVzQnVuZGxlKTtcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChrZXlzLnNpemUgPiAwKSB7XG4gICAgICB0aGlzLmNhY2hlLmludmFsaWRhdGUoQXJyYXkuZnJvbShrZXlzKSk7XG4gICAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ29tbWl0TWVzc2FnZUNsZWFuKCkge1xuICAgIGlmICh0aGlzLmNvbW1pdE1lc3NhZ2UudHJpbSgpID09PSAnJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tbWl0TWVzc2FnZSA9PT0gdGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUNvbW1pdE1lc3NhZ2VBZnRlckZpbGVTeXN0ZW1DaGFuZ2UoZXZlbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnRzW2ldO1xuXG4gICAgICBpZiAoIWV2ZW50LnBhdGgpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGV2ZW50LnBhdGgsICcuZ2l0JywgJ01FUkdFX0hFQUQnKSkge1xuICAgICAgICBpZiAoZXZlbnQuYWN0aW9uID09PSAnY3JlYXRlZCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0NvbW1pdE1lc3NhZ2VDbGVhbigpKSB7XG4gICAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UoYXdhaXQgdGhpcy5yZXBvc2l0b3J5LmdldE1lcmdlTWVzc2FnZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYWN0aW9uID09PSAnZGVsZXRlZCcpIHtcbiAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGhpcy5jb21taXRNZXNzYWdlVGVtcGxhdGUgfHwgJycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUGF0aEVuZHNXaXRoKGV2ZW50LnBhdGgsICcuZ2l0JywgJ2NvbmZpZycpKSB7XG4gICAgICAgIC8vIHRoaXMgd29uJ3QgY2F0Y2ggY2hhbmdlcyBtYWRlIHRvIHRoZSB0ZW1wbGF0ZSBmaWxlIGl0c2VsZi4uLlxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUoKTtcbiAgICAgICAgaWYgKHRlbXBsYXRlID09PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5zZXRDb21taXRNZXNzYWdlKCcnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSAhPT0gdGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLnNldENvbW1pdE1lc3NhZ2UodGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZVRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvYnNlcnZlRmlsZXN5c3RlbUNoYW5nZShldmVudHMpIHtcbiAgICB0aGlzLmludmFsaWRhdGVDYWNoZUFmdGVyRmlsZXN5c3RlbUNoYW5nZShldmVudHMpO1xuICAgIHRoaXMudXBkYXRlQ29tbWl0TWVzc2FnZUFmdGVyRmlsZVN5c3RlbUNoYW5nZShldmVudHMpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmNhY2hlLmNsZWFyKCk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLmluaXQoKS5jYXRjaChlID0+IHtcbiAgICAgIGUuc3RkRXJyID0gJ1RoaXMgZGlyZWN0b3J5IGFscmVhZHkgY29udGFpbnMgYSBnaXQgcmVwb3NpdG9yeSc7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG4gICAgfSk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gc3VwZXIuY2xvbmUoKS5jYXRjaChlID0+IHtcbiAgICAgIGUuc3RkRXJyID0gJ1RoaXMgZGlyZWN0b3J5IGFscmVhZHkgY29udGFpbnMgYSBnaXQgcmVwb3NpdG9yeSc7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBHaXQgb3BlcmF0aW9ucyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gU3RhZ2luZyBhbmQgdW5zdGFnaW5nXG5cbiAgc3RhZ2VGaWxlcyhwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhwYXRocyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnN0YWdlRmlsZXMocGF0aHMpLFxuICAgICk7XG4gIH1cblxuICB1bnN0YWdlRmlsZXMocGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMocGF0aHMpLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS51bnN0YWdlRmlsZXMocGF0aHMpLFxuICAgICk7XG4gIH1cblxuICBzdGFnZUZpbGVzRnJvbVBhcmVudENvbW1pdChwYXRocykge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhwYXRocyksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnVuc3RhZ2VGaWxlcyhwYXRocywgJ0hFQUR+JyksXG4gICAgKTtcbiAgfVxuXG4gIHN0YWdlRmlsZU1vZGVDaGFuZ2UoZmlsZVBhdGgsIGZpbGVNb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY2FjaGVPcGVyYXRpb25LZXlzKFtmaWxlUGF0aF0pLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5zdGFnZUZpbGVNb2RlQ2hhbmdlKGZpbGVQYXRoLCBmaWxlTW9kZSksXG4gICAgKTtcbiAgfVxuXG4gIHN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gS2V5cy5jYWNoZU9wZXJhdGlvbktleXMoW2ZpbGVQYXRoXSksXG4gICAgICAoKSA9PiB0aGlzLmdpdCgpLnN0YWdlRmlsZVN5bWxpbmtDaGFuZ2UoZmlsZVBhdGgpLFxuICAgICk7XG4gIH1cblxuICBhcHBseVBhdGNoVG9JbmRleChtdWx0aUZpbGVQYXRjaCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLmNhY2hlT3BlcmF0aW9uS2V5cyhBcnJheS5mcm9tKG11bHRpRmlsZVBhdGNoLmdldFBhdGhTZXQoKSkpLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXRjaFN0ciA9IG11bHRpRmlsZVBhdGNoLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLmFwcGx5UGF0Y2gocGF0Y2hTdHIsIHtpbmRleDogdHJ1ZX0pO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXBwbHlQYXRjaFRvV29ya2RpcihtdWx0aUZpbGVQYXRjaCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBLZXlzLndvcmtkaXJPcGVyYXRpb25LZXlzKEFycmF5LmZyb20obXVsdGlGaWxlUGF0Y2guZ2V0UGF0aFNldCgpKSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGNoU3RyID0gbXVsdGlGaWxlUGF0Y2gudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuYXBwbHlQYXRjaChwYXRjaFN0cik7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICAvLyBDb21taXR0aW5nXG5cbiAgY29tbWl0KG1lc3NhZ2UsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgS2V5cy5oZWFkT3BlcmF0aW9uS2V5cyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdDT01NSVQnLCBhc3luYyAobWVzc2FnZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvQXV0aG9ycyA9IG9wdGlvbnMuY29BdXRob3JzO1xuICAgICAgICBjb25zdCBvcHRzID0gIWNvQXV0aG9ycyA/IG9wdGlvbnMgOiB7XG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICBjb0F1dGhvcnM6IGNvQXV0aG9ycy5tYXAoYXV0aG9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7ZW1haWw6IGF1dGhvci5nZXRFbWFpbCgpLCBuYW1lOiBhdXRob3IuZ2V0RnVsbE5hbWUoKX07XG4gICAgICAgICAgfSksXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5jb21taXQobWVzc2FnZSwgb3B0cyk7XG5cbiAgICAgICAgLy8gQ29sbGVjdCBjb21taXQgbWV0YWRhdGEgbWV0cmljc1xuICAgICAgICAvLyBub3RlOiBpbiBHaXRTaGVsbE91dFN0cmF0ZWd5IHdlIGhhdmUgY291bnRlcnMgZm9yIGFsbCBnaXQgY29tbWFuZHMsIGluY2x1ZGluZyBgY29tbWl0YCwgYnV0IGhlcmUgd2UgaGF2ZVxuICAgICAgICAvLyAgICAgICBhY2Nlc3MgdG8gYWRkaXRpb25hbCBtZXRhZGF0YSAodW5zdGFnZWQgZmlsZSBjb3VudCkgc28gaXQgbWFrZXMgc2Vuc2UgdG8gY29sbGVjdCBjb21taXQgZXZlbnRzIGhlcmVcbiAgICAgICAgY29uc3Qge3Vuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c2VzRm9yQ2hhbmdlZEZpbGVzKCk7XG4gICAgICAgIGNvbnN0IHVuc3RhZ2VkQ291bnQgPSBPYmplY3Qua2V5cyh7Li4udW5zdGFnZWRGaWxlcywgLi4ubWVyZ2VDb25mbGljdEZpbGVzfSkubGVuZ3RoO1xuICAgICAgICBhZGRFdmVudCgnY29tbWl0Jywge1xuICAgICAgICAgIHBhY2thZ2U6ICdnaXRodWInLFxuICAgICAgICAgIHBhcnRpYWw6IHVuc3RhZ2VkQ291bnQgPiAwLFxuICAgICAgICAgIGFtZW5kOiAhIW9wdGlvbnMuYW1lbmQsXG4gICAgICAgICAgY29BdXRob3JDb3VudDogY29BdXRob3JzID8gY29BdXRob3JzLmxlbmd0aCA6IDAsXG4gICAgICAgIH0pO1xuICAgICAgfSwgbWVzc2FnZSwgb3B0aW9ucyksXG4gICAgKTtcbiAgfVxuXG4gIC8vIE1lcmdpbmdcblxuICBtZXJnZShicmFuY2hOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgLi4uS2V5cy5oZWFkT3BlcmF0aW9uS2V5cygpLFxuICAgICAgICBLZXlzLmluZGV4LmFsbCxcbiAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICBdLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5tZXJnZShicmFuY2hOYW1lKSxcbiAgICApO1xuICB9XG5cbiAgYWJvcnRNZXJnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBLZXlzLmZpbGVQYXRjaC5hbGwsXG4gICAgICAgIEtleXMuaW5kZXguYWxsLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQoKS5hYm9ydE1lcmdlKCk7XG4gICAgICAgIHRoaXMuc2V0Q29tbWl0TWVzc2FnZSh0aGlzLmNvbW1pdE1lc3NhZ2VUZW1wbGF0ZSB8fCAnJyk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBjaGVja291dFNpZGUoc2lkZSwgcGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5jaGVja291dFNpZGUoc2lkZSwgcGF0aHMpO1xuICB9XG5cbiAgbWVyZ2VGaWxlKG91cnNQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCkge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLm1lcmdlRmlsZShvdXJzUGF0aCwgY29tbW9uQmFzZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpO1xuICB9XG5cbiAgd3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICAgICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhGaWxlT3B0cyhbZmlsZVBhdGhdLCBbe3N0YWdlZDogZmFsc2V9LCB7c3RhZ2VkOiB0cnVlfV0pLFxuICAgICAgICBLZXlzLmluZGV4Lm9uZVdpdGgoZmlsZVBhdGgpLFxuICAgICAgXSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkud3JpdGVNZXJnZUNvbmZsaWN0VG9JbmRleChmaWxlUGF0aCwgY29tbW9uQmFzZVNoYSwgb3Vyc1NoYSwgdGhlaXJzU2hhKSxcbiAgICApO1xuICB9XG5cbiAgLy8gQ2hlY2tvdXRcblxuICBjaGVja291dChyZXZpc2lvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBLZXlzLmxhc3RDb21taXQsXG4gICAgICAgIEtleXMucmVjZW50Q29tbWl0cyxcbiAgICAgICAgS2V5cy5hdXRob3JzLFxuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoT3B0cyh7c3RhZ2VkOiB0cnVlfSksXG4gICAgICAgIEtleXMuZmlsZVBhdGNoLmFsbEFnYWluc3ROb25IZWFkLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgICAgS2V5cy5icmFuY2hlcyxcbiAgICAgIF0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignQ0hFQ0tPVVQnLCAocmV2aXNpb24sIG9wdGlvbnMpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuY2hlY2tvdXQocmV2aXNpb24sIG9wdGlvbnMpO1xuICAgICAgfSwgcmV2aXNpb24sIG9wdGlvbnMpLFxuICAgICk7XG4gIH1cblxuICBjaGVja291dFBhdGhzQXRSZXZpc2lvbihwYXRocywgcmV2aXNpb24gPSAnSEVBRCcpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICAuLi5wYXRocy5tYXAoZmlsZU5hbWUgPT4gS2V5cy5pbmRleC5vbmVXaXRoKGZpbGVOYW1lKSksXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoRmlsZU9wdHMocGF0aHMsIFt7c3RhZ2VkOiB0cnVlfV0pLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoTm9uSGVhZFdpdGhGaWxlcyhwYXRocyksXG4gICAgICBdLFxuICAgICAgKCkgPT4gdGhpcy5naXQoKS5jaGVja291dEZpbGVzKHBhdGhzLCByZXZpc2lvbiksXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJlc2V0XG5cbiAgdW5kb0xhc3RDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IFtcbiAgICAgICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICAgICAgICBLZXlzLmxhc3RDb21taXQsXG4gICAgICAgIEtleXMucmVjZW50Q29tbWl0cyxcbiAgICAgICAgS2V5cy5hdXRob3JzLFxuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoT3B0cyh7c3RhZ2VkOiB0cnVlfSksXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgXSxcbiAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLnJlc2V0KCdzb2Z0JywgJ0hFQUR+Jyk7XG4gICAgICAgICAgYWRkRXZlbnQoJ3VuZG8tbGFzdC1jb21taXQnLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmICgvdW5rbm93biByZXZpc2lvbi8udGVzdChlLnN0ZEVycikpIHtcbiAgICAgICAgICAgIC8vIEluaXRpYWwgY29tbWl0XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmRlbGV0ZVJlZignSEVBRCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgLy8gUmVtb3RlIGludGVyYWN0aW9uc1xuXG4gIGZldGNoKGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIEtleXMuc3RhdHVzQnVuZGxlLFxuICAgICAgICBLZXlzLmhlYWREZXNjcmlwdGlvbixcbiAgICAgIF0sXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gICAgICAoKSA9PiB0aGlzLmV4ZWN1dGVQaXBlbGluZUFjdGlvbignRkVUQ0gnLCBhc3luYyBicmFuY2hOYW1lID0+IHtcbiAgICAgICAgbGV0IGZpbmFsUmVtb3RlTmFtZSA9IG9wdGlvbnMucmVtb3RlTmFtZTtcbiAgICAgICAgaWYgKCFmaW5hbFJlbW90ZU5hbWUpIHtcbiAgICAgICAgICBjb25zdCByZW1vdGUgPSBhd2FpdCB0aGlzLmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgICAgICAgICBpZiAoIXJlbW90ZS5pc1ByZXNlbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmFsUmVtb3RlTmFtZSA9IHJlbW90ZS5nZXROYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZmV0Y2goZmluYWxSZW1vdGVOYW1lLCBicmFuY2hOYW1lKTtcbiAgICAgIH0sIGJyYW5jaE5hbWUpLFxuICAgICk7XG4gIH1cblxuICBwdWxsKGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIC4uLktleXMuaGVhZE9wZXJhdGlvbktleXMoKSxcbiAgICAgICAgS2V5cy5pbmRleC5hbGwsXG4gICAgICAgIEtleXMuaGVhZERlc2NyaXB0aW9uLFxuICAgICAgICBLZXlzLmJyYW5jaGVzLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdQVUxMJywgYXN5bmMgYnJhbmNoTmFtZSA9PiB7XG4gICAgICAgIGxldCBmaW5hbFJlbW90ZU5hbWUgPSBvcHRpb25zLnJlbW90ZU5hbWU7XG4gICAgICAgIGlmICghZmluYWxSZW1vdGVOYW1lKSB7XG4gICAgICAgICAgY29uc3QgcmVtb3RlID0gYXdhaXQgdGhpcy5nZXRSZW1vdGVGb3JCcmFuY2goYnJhbmNoTmFtZSk7XG4gICAgICAgICAgaWYgKCFyZW1vdGUuaXNQcmVzZW50KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbFJlbW90ZU5hbWUgPSByZW1vdGUuZ2V0TmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdpdCgpLnB1bGwoZmluYWxSZW1vdGVOYW1lLCBicmFuY2hOYW1lLCBvcHRpb25zKTtcbiAgICAgIH0sIGJyYW5jaE5hbWUpLFxuICAgICk7XG4gIH1cblxuICBwdXNoKGJyYW5jaE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBbXG4gICAgICAgICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgICAgICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuc2V0VXBzdHJlYW0pIHtcbiAgICAgICAgICBrZXlzLnB1c2goS2V5cy5icmFuY2hlcyk7XG4gICAgICAgICAga2V5cy5wdXNoKC4uLktleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhgYnJhbmNoLiR7YnJhbmNoTmFtZX0ucmVtb3RlYCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICB9LFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuICAgICAgKCkgPT4gdGhpcy5leGVjdXRlUGlwZWxpbmVBY3Rpb24oJ1BVU0gnLCBhc3luYyAoYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICBjb25zdCByZW1vdGUgPSBvcHRpb25zLnJlbW90ZSB8fCBhd2FpdCB0aGlzLmdldFJlbW90ZUZvckJyYW5jaChicmFuY2hOYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkucHVzaChyZW1vdGUuZ2V0TmFtZU9yKCdvcmlnaW4nKSwgYnJhbmNoTmFtZSwgb3B0aW9ucyk7XG4gICAgICB9LCBicmFuY2hOYW1lLCBvcHRpb25zKSxcbiAgICApO1xuICB9XG5cbiAgLy8gQ29uZmlndXJhdGlvblxuXG4gIHNldENvbmZpZyhzZXR0aW5nLCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhzZXR0aW5nKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkuc2V0Q29uZmlnKHNldHRpbmcsIHZhbHVlLCBvcHRpb25zKSxcbiAgICAgIHtnbG9iYWxseTogb3B0aW9ucy5nbG9iYWx9LFxuICAgICk7XG4gIH1cblxuICB1bnNldENvbmZpZyhzZXR0aW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShcbiAgICAgICgpID0+IEtleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhzZXR0aW5nKSxcbiAgICAgICgpID0+IHRoaXMuZ2l0KCkudW5zZXRDb25maWcoc2V0dGluZyksXG4gICAgKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBibG9iIGludGVyYWN0aW9uc1xuXG4gIGNyZWF0ZUJsb2Iob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdpdCgpLmNyZWF0ZUJsb2Iob3B0aW9ucyk7XG4gIH1cblxuICBleHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5leHBhbmRCbG9iVG9GaWxlKGFic0ZpbGVQYXRoLCBzaGEpO1xuICB9XG5cbiAgLy8gRGlzY2FyZCBoaXN0b3J5XG5cbiAgY3JlYXRlRGlzY2FyZEhpc3RvcnlCbG9iKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5LmNyZWF0ZUhpc3RvcnlCbG9iKCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVEaXNjYXJkSGlzdG9yeSgpIHtcbiAgICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgdGhpcy5sb2FkSGlzdG9yeVBheWxvYWQoKTtcbiAgICB0aGlzLmRpc2NhcmRIaXN0b3J5LnVwZGF0ZUhpc3RvcnkoaGlzdG9yeSk7XG4gIH1cblxuICBhc3luYyBzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMoZmlsZVBhdGhzLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IHNuYXBzaG90cyA9IGF3YWl0IHRoaXMuZGlzY2FyZEhpc3Rvcnkuc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKFxuICAgICAgZmlsZVBhdGhzLFxuICAgICAgaXNTYWZlLFxuICAgICAgZGVzdHJ1Y3RpdmVBY3Rpb24sXG4gICAgICBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoLFxuICAgICk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoc25hcHNob3RzKSB7XG4gICAgICBhd2FpdCB0aGlzLnNhdmVEaXNjYXJkSGlzdG9yeSgpO1xuICAgIH1cbiAgICByZXR1cm4gc25hcHNob3RzO1xuICB9XG5cbiAgcmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmRpc2NhcmRIaXN0b3J5LnJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzKGlzU2FmZSwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gIH1cblxuICBhc3luYyBwb3BEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IHJlbW92ZWQgPSBhd2FpdCB0aGlzLmRpc2NhcmRIaXN0b3J5LnBvcEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZURpc2NhcmRIaXN0b3J5KCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJEaXNjYXJkSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIHRoaXMuZGlzY2FyZEhpc3RvcnkuY2xlYXJIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIHJldHVybiB0aGlzLnNhdmVEaXNjYXJkSGlzdG9yeSgpO1xuICB9XG5cbiAgZGlzY2FyZFdvcmtEaXJDaGFuZ2VzRm9yUGF0aHMocGF0aHMpIHtcbiAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKFxuICAgICAgKCkgPT4gW1xuICAgICAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgICAgICAgLi4ucGF0aHMubWFwKGZpbGVQYXRoID0+IEtleXMuZmlsZVBhdGNoLm9uZVdpdGgoZmlsZVBhdGgsIHtzdGFnZWQ6IGZhbHNlfSkpLFxuICAgICAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoTm9uSGVhZFdpdGhGaWxlcyhwYXRocyksXG4gICAgICBdLFxuICAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB1bnRyYWNrZWRGaWxlcyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0VW50cmFja2VkRmlsZXMoKTtcbiAgICAgICAgY29uc3QgW2ZpbGVzVG9SZW1vdmUsIGZpbGVzVG9DaGVja291dF0gPSBwYXJ0aXRpb24ocGF0aHMsIGYgPT4gdW50cmFja2VkRmlsZXMuaW5jbHVkZXMoZikpO1xuICAgICAgICBhd2FpdCB0aGlzLmdpdCgpLmNoZWNrb3V0RmlsZXMoZmlsZXNUb0NoZWNrb3V0KTtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoZmlsZXNUb1JlbW92ZS5tYXAoZmlsZVBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IGFic1BhdGggPSBwYXRoLmpvaW4odGhpcy53b3JrZGlyKCksIGZpbGVQYXRoKTtcbiAgICAgICAgICByZXR1cm4gZnMucmVtb3ZlKGFic1BhdGgpO1xuICAgICAgICB9KSk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICAvLyBBY2Nlc3NvcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gSW5kZXggcXVlcmllc1xuXG4gIGdldFN0YXR1c0J1bmRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLnN0YXR1c0J1bmRsZSwgYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gYXdhaXQgdGhpcy5naXQoKS5nZXRTdGF0dXNCdW5kbGUoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZm9ybWF0Q2hhbmdlZEZpbGVzKGJ1bmRsZSk7XG4gICAgICAgIHJlc3VsdHMuYnJhbmNoID0gYnVuZGxlLmJyYW5jaDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIExhcmdlUmVwb0Vycm9yKSB7XG4gICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG8oJ1Rvb0xhcmdlJyk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJyYW5jaDoge30sXG4gICAgICAgICAgICBzdGFnZWRGaWxlczoge30sXG4gICAgICAgICAgICB1bnN0YWdlZEZpbGVzOiB7fSxcbiAgICAgICAgICAgIG1lcmdlQ29uZmxpY3RGaWxlczoge30sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZvcm1hdENoYW5nZWRGaWxlcyh7Y2hhbmdlZEVudHJpZXMsIHVudHJhY2tlZEVudHJpZXMsIHJlbmFtZWRFbnRyaWVzLCB1bm1lcmdlZEVudHJpZXN9KSB7XG4gICAgY29uc3Qgc3RhdHVzTWFwID0ge1xuICAgICAgQTogJ2FkZGVkJyxcbiAgICAgIE06ICdtb2RpZmllZCcsXG4gICAgICBEOiAnZGVsZXRlZCcsXG4gICAgICBVOiAnbW9kaWZpZWQnLFxuICAgICAgVDogJ3R5cGVjaGFuZ2UnLFxuICAgIH07XG5cbiAgICBjb25zdCBzdGFnZWRGaWxlcyA9IHt9O1xuICAgIGNvbnN0IHVuc3RhZ2VkRmlsZXMgPSB7fTtcbiAgICBjb25zdCBtZXJnZUNvbmZsaWN0RmlsZXMgPSB7fTtcblxuICAgIGNoYW5nZWRFbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgaWYgKGVudHJ5LnN0YWdlZFN0YXR1cykge1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXBbZW50cnkuc3RhZ2VkU3RhdHVzXTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS51bnN0YWdlZFN0YXR1cykge1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcFtlbnRyeS51bnN0YWdlZFN0YXR1c107XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB1bnRyYWNrZWRFbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgdW5zdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICB9KTtcblxuICAgIHJlbmFtZWRFbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgaWYgKGVudHJ5LnN0YWdlZFN0YXR1cyA9PT0gJ1InKSB7XG4gICAgICAgIHN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5vcmlnRmlsZVBhdGhdID0gc3RhdHVzTWFwLkQ7XG4gICAgICB9XG4gICAgICBpZiAoZW50cnkudW5zdGFnZWRTdGF0dXMgPT09ICdSJykge1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5LmZpbGVQYXRoXSA9IHN0YXR1c01hcC5BO1xuICAgICAgICB1bnN0YWdlZEZpbGVzW2VudHJ5Lm9yaWdGaWxlUGF0aF0gPSBzdGF0dXNNYXAuRDtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS5zdGFnZWRTdGF0dXMgPT09ICdDJykge1xuICAgICAgICBzdGFnZWRGaWxlc1tlbnRyeS5maWxlUGF0aF0gPSBzdGF0dXNNYXAuQTtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS51bnN0YWdlZFN0YXR1cyA9PT0gJ0MnKSB7XG4gICAgICAgIHVuc3RhZ2VkRmlsZXNbZW50cnkuZmlsZVBhdGhdID0gc3RhdHVzTWFwLkE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3RhdHVzVG9IZWFkO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bm1lcmdlZEVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHtzdGFnZWRTdGF0dXMsIHVuc3RhZ2VkU3RhdHVzLCBmaWxlUGF0aH0gPSB1bm1lcmdlZEVudHJpZXNbaV07XG4gICAgICBpZiAoc3RhZ2VkU3RhdHVzID09PSAnVScgfHwgdW5zdGFnZWRTdGF0dXMgPT09ICdVJyB8fCAoc3RhZ2VkU3RhdHVzID09PSAnQScgJiYgdW5zdGFnZWRTdGF0dXMgPT09ICdBJykpIHtcbiAgICAgICAgLy8gU2tpcHBpbmcgdGhpcyBjaGVjayBoZXJlIGJlY2F1c2Ugd2Ugb25seSBydW4gYSBzaW5nbGUgYGF3YWl0YFxuICAgICAgICAvLyBhbmQgd2Ugb25seSBydW4gaXQgaW4gdGhlIG1haW4sIHN5bmNocm9ub3VzIGJvZHkgb2YgdGhlIGZvciBsb29wLlxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBpZiAoIXN0YXR1c1RvSGVhZCkgeyBzdGF0dXNUb0hlYWQgPSBhd2FpdCB0aGlzLmdpdCgpLmRpZmZGaWxlU3RhdHVzKHt0YXJnZXQ6ICdIRUFEJ30pOyB9XG4gICAgICAgIG1lcmdlQ29uZmxpY3RGaWxlc1tmaWxlUGF0aF0gPSB7XG4gICAgICAgICAgb3Vyczogc3RhdHVzTWFwW3N0YWdlZFN0YXR1c10sXG4gICAgICAgICAgdGhlaXJzOiBzdGF0dXNNYXBbdW5zdGFnZWRTdGF0dXNdLFxuICAgICAgICAgIGZpbGU6IHN0YXR1c1RvSGVhZFtmaWxlUGF0aF0gfHwgJ2VxdWl2YWxlbnQnLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc307XG4gIH1cblxuICBhc3luYyBnZXRTdGF0dXNlc0ZvckNoYW5nZWRGaWxlcygpIHtcbiAgICBjb25zdCB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc30gPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiB7c3RhZ2VkRmlsZXMsIHVuc3RhZ2VkRmlsZXMsIG1lcmdlQ29uZmxpY3RGaWxlc307XG4gIH1cblxuICBnZXRGaWxlUGF0Y2hGb3JQYXRoKGZpbGVQYXRoLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHN0YWdlZDogZmFsc2UsXG4gICAgICBwYXRjaEJ1ZmZlcjogbnVsbCxcbiAgICAgIGJ1aWxkZXI6IHt9LFxuICAgICAgYmVmb3JlOiAoKSA9PiB7fSxcbiAgICAgIGFmdGVyOiAoKSA9PiB7fSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuZmlsZVBhdGNoLm9uZVdpdGgoZmlsZVBhdGgsIHtzdGFnZWQ6IG9wdHMuc3RhZ2VkfSksIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRpZmZzID0gYXdhaXQgdGhpcy5naXQoKS5nZXREaWZmc0ZvckZpbGVQYXRoKGZpbGVQYXRoLCB7c3RhZ2VkOiBvcHRzLnN0YWdlZH0pO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IG9wdHMuYmVmb3JlKCk7XG4gICAgICBjb25zdCBwYXRjaCA9IGJ1aWxkRmlsZVBhdGNoKGRpZmZzLCBvcHRzLmJ1aWxkZXIpO1xuICAgICAgaWYgKG9wdHMucGF0Y2hCdWZmZXIgIT09IG51bGwpIHsgcGF0Y2guYWRvcHRCdWZmZXIob3B0cy5wYXRjaEJ1ZmZlcik7IH1cbiAgICAgIG9wdHMuYWZ0ZXIocGF0Y2gsIHBheWxvYWQpO1xuICAgICAgcmV0dXJuIHBhdGNoO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlmZnNGb3JGaWxlUGF0aChmaWxlUGF0aCwgYmFzZUNvbW1pdCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuZmlsZVBhdGNoLm9uZVdpdGgoZmlsZVBhdGgsIHtiYXNlQ29tbWl0fSksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLmdldERpZmZzRm9yRmlsZVBhdGgoZmlsZVBhdGgsIHtiYXNlQ29tbWl0fSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTdGFnZWRDaGFuZ2VzUGF0Y2gob3B0aW9ucykge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBidWlsZGVyOiB7fSxcbiAgICAgIHBhdGNoQnVmZmVyOiBudWxsLFxuICAgICAgYmVmb3JlOiAoKSA9PiB7fSxcbiAgICAgIGFmdGVyOiAoKSA9PiB7fSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuc3RhZ2VkQ2hhbmdlcywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGlmZnMgPSBhd2FpdCB0aGlzLmdpdCgpLmdldFN0YWdlZENoYW5nZXNQYXRjaCgpO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IG9wdHMuYmVmb3JlKCk7XG4gICAgICBjb25zdCBwYXRjaCA9IGJ1aWxkTXVsdGlGaWxlUGF0Y2goZGlmZnMsIG9wdHMuYnVpbGRlcik7XG4gICAgICBpZiAob3B0cy5wYXRjaEJ1ZmZlciAhPT0gbnVsbCkgeyBwYXRjaC5hZG9wdEJ1ZmZlcihvcHRzLnBhdGNoQnVmZmVyKTsgfVxuICAgICAgb3B0cy5hZnRlcihwYXRjaCwgcGF5bG9hZCk7XG4gICAgICByZXR1cm4gcGF0Y2g7XG4gICAgfSk7XG4gIH1cblxuICByZWFkRmlsZUZyb21JbmRleChmaWxlUGF0aCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuaW5kZXgub25lV2l0aChmaWxlUGF0aCksICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdpdCgpLnJlYWRGaWxlRnJvbUluZGV4KGZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENvbW1pdCBhY2Nlc3NcblxuICBnZXRMYXN0Q29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMubGFzdENvbW1pdCwgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaGVhZENvbW1pdCA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0SGVhZENvbW1pdCgpO1xuICAgICAgcmV0dXJuIGhlYWRDb21taXQudW5ib3JuUmVmID8gQ29tbWl0LmNyZWF0ZVVuYm9ybigpIDogbmV3IENvbW1pdChoZWFkQ29tbWl0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbW1pdChzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmJsb2Iub25lV2l0aChzaGEpLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBbcmF3Q29tbWl0XSA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0Q29tbWl0cyh7bWF4OiAxLCByZWY6IHNoYSwgaW5jbHVkZVBhdGNoOiB0cnVlfSk7XG4gICAgICBjb25zdCBjb21taXQgPSBuZXcgQ29tbWl0KHJhd0NvbW1pdCk7XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVjZW50Q29tbWl0cyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5yZWNlbnRDb21taXRzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjb21taXRzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRDb21taXRzKHtyZWY6ICdIRUFEJywgLi4ub3B0aW9uc30pO1xuICAgICAgcmV0dXJuIGNvbW1pdHMubWFwKGNvbW1pdCA9PiBuZXcgQ29tbWl0KGNvbW1pdCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgaXNDb21taXRQdXNoZWQoc2hhKSB7XG4gICAgY29uc3QgY3VycmVudEJyYW5jaCA9IGF3YWl0IHRoaXMucmVwb3NpdG9yeS5nZXRDdXJyZW50QnJhbmNoKCk7XG4gICAgY29uc3QgdXBzdHJlYW0gPSBjdXJyZW50QnJhbmNoLmdldFB1c2goKTtcbiAgICBpZiAoIXVwc3RyZWFtLmlzUHJlc2VudCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVkID0gYXdhaXQgdGhpcy5naXQoKS5nZXRCcmFuY2hlc1dpdGhDb21taXQoc2hhLCB7XG4gICAgICBzaG93TG9jYWw6IGZhbHNlLFxuICAgICAgc2hvd1JlbW90ZTogdHJ1ZSxcbiAgICAgIHBhdHRlcm46IHVwc3RyZWFtLmdldFNob3J0UmVmKCksXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRhaW5lZC5zb21lKHJlZiA9PiByZWYubGVuZ3RoID4gMCk7XG4gIH1cblxuICAvLyBBdXRob3IgaW5mb3JtYXRpb25cblxuICBnZXRBdXRob3JzKG9wdGlvbnMpIHtcbiAgICAvLyBGb3Igbm93IHdlJ2xsIGRvIHRoZSBuYWl2ZSB0aGluZyBhbmQgaW52YWxpZGF0ZSBhbnl0aW1lIEhFQUQgbW92ZXMuIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGdldCBuZXcgYXV0aG9yc1xuICAgIC8vIGludHJvZHVjZWQgYnkgbmV3bHkgY3JlYXRlZCBjb21taXRzIG9yIHB1bGxlZCBjb21taXRzLlxuICAgIC8vIFRoaXMgbWVhbnMgdGhhdCB3ZSBhcmUgY29uc3RhbnRseSByZS1mZXRjaGluZyBkYXRhLiBJZiBwZXJmb3JtYW5jZSBiZWNvbWVzIGEgY29uY2VybiB3ZSBjYW4gb3B0aW1pemVcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmF1dGhvcnMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGF1dGhvck1hcCA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0QXV0aG9ycyhvcHRpb25zKTtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhdXRob3JNYXApLm1hcChlbWFpbCA9PiBuZXcgQXV0aG9yKGVtYWlsLCBhdXRob3JNYXBbZW1haWxdKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBCcmFuY2hlc1xuXG4gIGdldEJyYW5jaGVzKCkge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE9yU2V0KEtleXMuYnJhbmNoZXMsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBheWxvYWRzID0gYXdhaXQgdGhpcy5naXQoKS5nZXRCcmFuY2hlcygpO1xuICAgICAgY29uc3QgYnJhbmNoZXMgPSBuZXcgQnJhbmNoU2V0KCk7XG4gICAgICBmb3IgKGNvbnN0IHBheWxvYWQgb2YgcGF5bG9hZHMpIHtcbiAgICAgICAgbGV0IHVwc3RyZWFtID0gbnVsbEJyYW5jaDtcbiAgICAgICAgaWYgKHBheWxvYWQudXBzdHJlYW0pIHtcbiAgICAgICAgICB1cHN0cmVhbSA9IHBheWxvYWQudXBzdHJlYW0ucmVtb3RlTmFtZVxuICAgICAgICAgICAgPyBCcmFuY2guY3JlYXRlUmVtb3RlVHJhY2tpbmcoXG4gICAgICAgICAgICAgIHBheWxvYWQudXBzdHJlYW0udHJhY2tpbmdSZWYsXG4gICAgICAgICAgICAgIHBheWxvYWQudXBzdHJlYW0ucmVtb3RlTmFtZSxcbiAgICAgICAgICAgICAgcGF5bG9hZC51cHN0cmVhbS5yZW1vdGVSZWYsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICA6IG5ldyBCcmFuY2gocGF5bG9hZC51cHN0cmVhbS50cmFja2luZ1JlZik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHVzaCA9IHVwc3RyZWFtO1xuICAgICAgICBpZiAocGF5bG9hZC5wdXNoKSB7XG4gICAgICAgICAgcHVzaCA9IHBheWxvYWQucHVzaC5yZW1vdGVOYW1lXG4gICAgICAgICAgICA/IEJyYW5jaC5jcmVhdGVSZW1vdGVUcmFja2luZyhcbiAgICAgICAgICAgICAgcGF5bG9hZC5wdXNoLnRyYWNraW5nUmVmLFxuICAgICAgICAgICAgICBwYXlsb2FkLnB1c2gucmVtb3RlTmFtZSxcbiAgICAgICAgICAgICAgcGF5bG9hZC5wdXNoLnJlbW90ZVJlZixcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogbmV3IEJyYW5jaChwYXlsb2FkLnB1c2gudHJhY2tpbmdSZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJhbmNoZXMuYWRkKG5ldyBCcmFuY2gocGF5bG9hZC5uYW1lLCB1cHN0cmVhbSwgcHVzaCwgcGF5bG9hZC5oZWFkLCB7c2hhOiBwYXlsb2FkLnNoYX0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBicmFuY2hlcztcbiAgICB9KTtcbiAgfVxuXG4gIGdldEhlYWREZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmhlYWREZXNjcmlwdGlvbiwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2l0KCkuZGVzY3JpYmVIZWFkKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXJnaW5nIGFuZCByZWJhc2luZyBzdGF0dXNcblxuICBpc01lcmdpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2l0KCkuaXNNZXJnaW5nKHRoaXMucmVwb3NpdG9yeS5nZXRHaXREaXJlY3RvcnlQYXRoKCkpO1xuICB9XG5cbiAgaXNSZWJhc2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5naXQoKS5pc1JlYmFzaW5nKHRoaXMucmVwb3NpdG9yeS5nZXRHaXREaXJlY3RvcnlQYXRoKCkpO1xuICB9XG5cbiAgLy8gUmVtb3Rlc1xuXG4gIGdldFJlbW90ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5yZW1vdGVzLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZW1vdGVzSW5mbyA9IGF3YWl0IHRoaXMuZ2l0KCkuZ2V0UmVtb3RlcygpO1xuICAgICAgcmV0dXJuIG5ldyBSZW1vdGVTZXQoXG4gICAgICAgIHJlbW90ZXNJbmZvLm1hcCgoe25hbWUsIHVybH0pID0+IG5ldyBSZW1vdGUobmFtZSwgdXJsKSksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkUmVtb3RlKG5hbWUsIHVybCkge1xuICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoXG4gICAgICAoKSA9PiBbXG4gICAgICAgIC4uLktleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhgcmVtb3RlLiR7bmFtZX0udXJsYCksXG4gICAgICAgIC4uLktleXMuY29uZmlnLmVhY2hXaXRoU2V0dGluZyhgcmVtb3RlLiR7bmFtZX0uZmV0Y2hgKSxcbiAgICAgICAgS2V5cy5yZW1vdGVzLFxuICAgICAgXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgICAgICgpID0+IHRoaXMuZXhlY3V0ZVBpcGVsaW5lQWN0aW9uKCdBRERSRU1PVEUnLCBhc3luYyAobmFtZSwgdXJsKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0KCkuYWRkUmVtb3RlKG5hbWUsIHVybCk7XG4gICAgICAgIHJldHVybiBuZXcgUmVtb3RlKG5hbWUsIHVybCk7XG4gICAgICB9LCBuYW1lLCB1cmwpLFxuICAgICk7XG4gIH1cblxuICBhc3luYyBnZXRBaGVhZENvdW50KGJyYW5jaE5hbWUpIHtcbiAgICBjb25zdCBidW5kbGUgPSBhd2FpdCB0aGlzLmdldFN0YXR1c0J1bmRsZSgpO1xuICAgIHJldHVybiBidW5kbGUuYnJhbmNoLmFoZWFkQmVoaW5kLmFoZWFkO1xuICB9XG5cbiAgYXN5bmMgZ2V0QmVoaW5kQ291bnQoYnJhbmNoTmFtZSkge1xuICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHRoaXMuZ2V0U3RhdHVzQnVuZGxlKCk7XG4gICAgcmV0dXJuIGJ1bmRsZS5icmFuY2guYWhlYWRCZWhpbmQuYmVoaW5kO1xuICB9XG5cbiAgZ2V0Q29uZmlnKG9wdGlvbiwge2xvY2FsfSA9IHtsb2NhbDogZmFsc2V9KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0T3JTZXQoS2V5cy5jb25maWcub25lV2l0aChvcHRpb24sIHtsb2NhbH0pLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5nZXRDb25maWcob3B0aW9uLCB7bG9jYWx9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpcmVjdEdldENvbmZpZyhrZXksIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb25maWcoa2V5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIERpcmVjdCBibG9iIGFjY2Vzc1xuXG4gIGdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRPclNldChLZXlzLmJsb2Iub25lV2l0aChzaGEpLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5naXQoKS5nZXRCbG9iQ29udGVudHMoc2hhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpcmVjdEdldEJsb2JDb250ZW50cyhzaGEpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRCbG9iQ29udGVudHMoc2hhKTtcbiAgfVxuXG4gIC8vIERpc2NhcmQgaGlzdG9yeVxuXG4gIGhhc0Rpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuaGFzSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldERpc2NhcmRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuZ2V0SGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIGdldExhc3RIaXN0b3J5U25hcHNob3RzKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzY2FyZEhpc3RvcnkuZ2V0TGFzdFNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgfVxuXG4gIC8vIENhY2hlXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q2FjaGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gIH1cblxuICBpbnZhbGlkYXRlKHNwZWMsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBib2R5KCkudGhlbihcbiAgICAgIHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMuYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGVyciA9PiB7XG4gICAgICAgIHRoaXMuYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG5TdGF0ZS5yZWdpc3RlcihQcmVzZW50KTtcblxuZnVuY3Rpb24gcGFydGl0aW9uKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IFtdO1xuICBjb25zdCBub25tYXRjaGVzID0gW107XG4gIGFycmF5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgbWF0Y2hlcy5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBub25tYXRjaGVzLnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIFttYXRjaGVzLCBub25tYXRjaGVzXTtcbn1cblxuY2xhc3MgQ2FjaGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ieUdyb3VwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIGdldE9yU2V0KGtleSwgb3BlcmF0aW9uKSB7XG4gICAgY29uc3QgcHJpbWFyeSA9IGtleS5nZXRQcmltYXJ5KCk7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLnN0b3JhZ2UuZ2V0KHByaW1hcnkpO1xuICAgIGlmIChleGlzdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBleGlzdGluZy5oaXRzKys7XG4gICAgICByZXR1cm4gZXhpc3RpbmcucHJvbWlzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVkID0gb3BlcmF0aW9uKCk7XG5cbiAgICB0aGlzLnN0b3JhZ2Uuc2V0KHByaW1hcnksIHtcbiAgICAgIGNyZWF0ZWRBdDogcGVyZm9ybWFuY2Uubm93KCksXG4gICAgICBoaXRzOiAwLFxuICAgICAgcHJvbWlzZTogY3JlYXRlZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwcyA9IGtleS5nZXRHcm91cHMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZ3JvdXAgPSBncm91cHNbaV07XG4gICAgICBsZXQgZ3JvdXBTZXQgPSB0aGlzLmJ5R3JvdXAuZ2V0KGdyb3VwKTtcbiAgICAgIGlmIChncm91cFNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGdyb3VwU2V0ID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmJ5R3JvdXAuc2V0KGdyb3VwLCBncm91cFNldCk7XG4gICAgICB9XG4gICAgICBncm91cFNldC5hZGQoa2V5KTtcbiAgICB9XG5cbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIGNyZWF0ZWQ7XG4gIH1cblxuICBpbnZhbGlkYXRlKGtleXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXNbaV0ucmVtb3ZlRnJvbUNhY2hlKHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChrZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAga2V5c0luR3JvdXAoZ3JvdXApIHtcbiAgICByZXR1cm4gdGhpcy5ieUdyb3VwLmdldChncm91cCkgfHwgW107XG4gIH1cblxuICByZW1vdmVQcmltYXJ5KHByaW1hcnkpIHtcbiAgICB0aGlzLnN0b3JhZ2UuZGVsZXRlKHByaW1hcnkpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICByZW1vdmVGcm9tR3JvdXAoZ3JvdXAsIGtleSkge1xuICAgIGNvbnN0IGdyb3VwU2V0ID0gdGhpcy5ieUdyb3VwLmdldChncm91cCk7XG4gICAgZ3JvdXBTZXQgJiYgZ3JvdXBTZXQuZGVsZXRlKGtleSk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgdGhpcy5ieUdyb3VwLmNsZWFyKCk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIGRpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFNBQUEsR0FBQUQsT0FB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