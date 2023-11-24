"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("util"));

var _branch = require("./branch");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Store and index a set of Branches in a repository.
class BranchSet {
  constructor(all = []) {
    this.all = [];
    this.head = _branch.nullBranch;
    this.byUpstreamRef = new Map();
    this.byPushRef = new Map();

    for (const branch of all) {
      this.add(branch);
    }
  }

  add(branch) {
    this.all.push(branch);

    if (branch.isHead()) {
      this.head = branch;
    }

    const u = branch.getUpstream();

    if (u.isPresent() && u.isRemoteTracking()) {
      const k = `${u.getRemoteName()}\0${u.getRemoteRef()}`;
      (0, _helpers.pushAtKey)(this.byUpstreamRef, k, branch);
    }

    const p = branch.getPush();

    if (p.isPresent() && p.isRemoteTracking()) {
      const k = `${p.getRemoteName()}\0${p.getRemoteRef()}`;
      (0, _helpers.pushAtKey)(this.byPushRef, k, branch);
    }
  }

  getNames() {
    return this.all.map(branch => branch.getName());
  } // Return the HEAD branch, or `nullBranch` if HEAD is not a branch. This can happen if HEAD is unborn (the repository
  // was just initialized) or if HEAD is detached.


  getHeadBranch() {
    return this.head;
  } // Return an Array of Branches that would be updated from a given remote ref with a `git pull`. This corresponds with
  // git's notion of an _upstream_ and takes into account the current `branch.remote` setting and `remote.<name>.fetch`
  // refspec.


  getPullTargets(remoteName, remoteRefName) {
    return this.byUpstreamRef.get(`${remoteName}\0${remoteRefName}`) || [];
  } // Return an Array of Branches that will update a given remote ref on an unqualified `git push`. This accounts for
  // the current `branch.pushRemote` setting and `remote.<name>.push` refspec.


  getPushSources(remoteName, remoteRefName) {
    return this.byPushRef.get(`${remoteName}\0${remoteRefName}`) || [];
  }

  inspect(depth, options) {
    return `BranchSet {${_util.default.inspect(this.all)}}`;
  }

}

exports.default = BranchSet;