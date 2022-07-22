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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvYnJhbmNoLXNldC5qcyJdLCJuYW1lcyI6WyJCcmFuY2hTZXQiLCJjb25zdHJ1Y3RvciIsImFsbCIsImhlYWQiLCJudWxsQnJhbmNoIiwiYnlVcHN0cmVhbVJlZiIsIk1hcCIsImJ5UHVzaFJlZiIsImJyYW5jaCIsImFkZCIsInB1c2giLCJpc0hlYWQiLCJ1IiwiZ2V0VXBzdHJlYW0iLCJpc1ByZXNlbnQiLCJpc1JlbW90ZVRyYWNraW5nIiwiayIsImdldFJlbW90ZU5hbWUiLCJnZXRSZW1vdGVSZWYiLCJwIiwiZ2V0UHVzaCIsImdldE5hbWVzIiwibWFwIiwiZ2V0TmFtZSIsImdldEhlYWRCcmFuY2giLCJnZXRQdWxsVGFyZ2V0cyIsInJlbW90ZU5hbWUiLCJyZW1vdGVSZWZOYW1lIiwiZ2V0IiwiZ2V0UHVzaFNvdXJjZXMiLCJpbnNwZWN0IiwiZGVwdGgiLCJvcHRpb25zIiwidXRpbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOzs7O0FBRUE7QUFDZSxNQUFNQSxTQUFOLENBQWdCO0FBQzdCQyxFQUFBQSxXQUFXLENBQUNDLEdBQUcsR0FBRyxFQUFQLEVBQVc7QUFDcEIsU0FBS0EsR0FBTCxHQUFXLEVBQVg7QUFDQSxTQUFLQyxJQUFMLEdBQVlDLGtCQUFaO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixJQUFJQyxHQUFKLEVBQXJCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFJRCxHQUFKLEVBQWpCOztBQUNBLFNBQUssTUFBTUUsTUFBWCxJQUFxQk4sR0FBckIsRUFBMEI7QUFDeEIsV0FBS08sR0FBTCxDQUFTRCxNQUFUO0FBQ0Q7QUFDRjs7QUFFREMsRUFBQUEsR0FBRyxDQUFDRCxNQUFELEVBQVM7QUFDVixTQUFLTixHQUFMLENBQVNRLElBQVQsQ0FBY0YsTUFBZDs7QUFFQSxRQUFJQSxNQUFNLENBQUNHLE1BQVAsRUFBSixFQUFxQjtBQUNuQixXQUFLUixJQUFMLEdBQVlLLE1BQVo7QUFDRDs7QUFFRCxVQUFNSSxDQUFDLEdBQUdKLE1BQU0sQ0FBQ0ssV0FBUCxFQUFWOztBQUNBLFFBQUlELENBQUMsQ0FBQ0UsU0FBRixNQUFpQkYsQ0FBQyxDQUFDRyxnQkFBRixFQUFyQixFQUEyQztBQUN6QyxZQUFNQyxDQUFDLEdBQUksR0FBRUosQ0FBQyxDQUFDSyxhQUFGLEVBQWtCLEtBQUlMLENBQUMsQ0FBQ00sWUFBRixFQUFpQixFQUFwRDtBQUNBLDhCQUFVLEtBQUtiLGFBQWYsRUFBOEJXLENBQTlCLEVBQWlDUixNQUFqQztBQUNEOztBQUVELFVBQU1XLENBQUMsR0FBR1gsTUFBTSxDQUFDWSxPQUFQLEVBQVY7O0FBQ0EsUUFBSUQsQ0FBQyxDQUFDTCxTQUFGLE1BQWlCSyxDQUFDLENBQUNKLGdCQUFGLEVBQXJCLEVBQTJDO0FBQ3pDLFlBQU1DLENBQUMsR0FBSSxHQUFFRyxDQUFDLENBQUNGLGFBQUYsRUFBa0IsS0FBSUUsQ0FBQyxDQUFDRCxZQUFGLEVBQWlCLEVBQXBEO0FBQ0EsOEJBQVUsS0FBS1gsU0FBZixFQUEwQlMsQ0FBMUIsRUFBNkJSLE1BQTdCO0FBQ0Q7QUFDRjs7QUFFRGEsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxLQUFLbkIsR0FBTCxDQUFTb0IsR0FBVCxDQUFhZCxNQUFNLElBQUlBLE1BQU0sQ0FBQ2UsT0FBUCxFQUF2QixDQUFQO0FBQ0QsR0FqQzRCLENBbUM3QjtBQUNBOzs7QUFDQUMsRUFBQUEsYUFBYSxHQUFHO0FBQ2QsV0FBTyxLQUFLckIsSUFBWjtBQUNELEdBdkM0QixDQXlDN0I7QUFDQTtBQUNBOzs7QUFDQXNCLEVBQUFBLGNBQWMsQ0FBQ0MsVUFBRCxFQUFhQyxhQUFiLEVBQTRCO0FBQ3hDLFdBQU8sS0FBS3RCLGFBQUwsQ0FBbUJ1QixHQUFuQixDQUF3QixHQUFFRixVQUFXLEtBQUlDLGFBQWMsRUFBdkQsS0FBNkQsRUFBcEU7QUFDRCxHQTlDNEIsQ0FnRDdCO0FBQ0E7OztBQUNBRSxFQUFBQSxjQUFjLENBQUNILFVBQUQsRUFBYUMsYUFBYixFQUE0QjtBQUN4QyxXQUFPLEtBQUtwQixTQUFMLENBQWVxQixHQUFmLENBQW9CLEdBQUVGLFVBQVcsS0FBSUMsYUFBYyxFQUFuRCxLQUF5RCxFQUFoRTtBQUNEOztBQUVERyxFQUFBQSxPQUFPLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFpQjtBQUN0QixXQUFRLGNBQWFDLGNBQUtILE9BQUwsQ0FBYSxLQUFLNUIsR0FBbEIsQ0FBdUIsR0FBNUM7QUFDRDs7QUF4RDRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5cbmltcG9ydCB7bnVsbEJyYW5jaH0gZnJvbSAnLi9icmFuY2gnO1xuaW1wb3J0IHtwdXNoQXRLZXl9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG4vLyBTdG9yZSBhbmQgaW5kZXggYSBzZXQgb2YgQnJhbmNoZXMgaW4gYSByZXBvc2l0b3J5LlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJhbmNoU2V0IHtcbiAgY29uc3RydWN0b3IoYWxsID0gW10pIHtcbiAgICB0aGlzLmFsbCA9IFtdO1xuICAgIHRoaXMuaGVhZCA9IG51bGxCcmFuY2g7XG4gICAgdGhpcy5ieVVwc3RyZWFtUmVmID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYnlQdXNoUmVmID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgYnJhbmNoIG9mIGFsbCkge1xuICAgICAgdGhpcy5hZGQoYnJhbmNoKTtcbiAgICB9XG4gIH1cblxuICBhZGQoYnJhbmNoKSB7XG4gICAgdGhpcy5hbGwucHVzaChicmFuY2gpO1xuXG4gICAgaWYgKGJyYW5jaC5pc0hlYWQoKSkge1xuICAgICAgdGhpcy5oZWFkID0gYnJhbmNoO1xuICAgIH1cblxuICAgIGNvbnN0IHUgPSBicmFuY2guZ2V0VXBzdHJlYW0oKTtcbiAgICBpZiAodS5pc1ByZXNlbnQoKSAmJiB1LmlzUmVtb3RlVHJhY2tpbmcoKSkge1xuICAgICAgY29uc3QgayA9IGAke3UuZ2V0UmVtb3RlTmFtZSgpfVxcMCR7dS5nZXRSZW1vdGVSZWYoKX1gO1xuICAgICAgcHVzaEF0S2V5KHRoaXMuYnlVcHN0cmVhbVJlZiwgaywgYnJhbmNoKTtcbiAgICB9XG5cbiAgICBjb25zdCBwID0gYnJhbmNoLmdldFB1c2goKTtcbiAgICBpZiAocC5pc1ByZXNlbnQoKSAmJiBwLmlzUmVtb3RlVHJhY2tpbmcoKSkge1xuICAgICAgY29uc3QgayA9IGAke3AuZ2V0UmVtb3RlTmFtZSgpfVxcMCR7cC5nZXRSZW1vdGVSZWYoKX1gO1xuICAgICAgcHVzaEF0S2V5KHRoaXMuYnlQdXNoUmVmLCBrLCBicmFuY2gpO1xuICAgIH1cbiAgfVxuXG4gIGdldE5hbWVzKCkge1xuICAgIHJldHVybiB0aGlzLmFsbC5tYXAoYnJhbmNoID0+IGJyYW5jaC5nZXROYW1lKCkpO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBIRUFEIGJyYW5jaCwgb3IgYG51bGxCcmFuY2hgIGlmIEhFQUQgaXMgbm90IGEgYnJhbmNoLiBUaGlzIGNhbiBoYXBwZW4gaWYgSEVBRCBpcyB1bmJvcm4gKHRoZSByZXBvc2l0b3J5XG4gIC8vIHdhcyBqdXN0IGluaXRpYWxpemVkKSBvciBpZiBIRUFEIGlzIGRldGFjaGVkLlxuICBnZXRIZWFkQnJhbmNoKCkge1xuICAgIHJldHVybiB0aGlzLmhlYWQ7XG4gIH1cblxuICAvLyBSZXR1cm4gYW4gQXJyYXkgb2YgQnJhbmNoZXMgdGhhdCB3b3VsZCBiZSB1cGRhdGVkIGZyb20gYSBnaXZlbiByZW1vdGUgcmVmIHdpdGggYSBgZ2l0IHB1bGxgLiBUaGlzIGNvcnJlc3BvbmRzIHdpdGhcbiAgLy8gZ2l0J3Mgbm90aW9uIG9mIGFuIF91cHN0cmVhbV8gYW5kIHRha2VzIGludG8gYWNjb3VudCB0aGUgY3VycmVudCBgYnJhbmNoLnJlbW90ZWAgc2V0dGluZyBhbmQgYHJlbW90ZS48bmFtZT4uZmV0Y2hgXG4gIC8vIHJlZnNwZWMuXG4gIGdldFB1bGxUYXJnZXRzKHJlbW90ZU5hbWUsIHJlbW90ZVJlZk5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5ieVVwc3RyZWFtUmVmLmdldChgJHtyZW1vdGVOYW1lfVxcMCR7cmVtb3RlUmVmTmFtZX1gKSB8fCBbXTtcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBBcnJheSBvZiBCcmFuY2hlcyB0aGF0IHdpbGwgdXBkYXRlIGEgZ2l2ZW4gcmVtb3RlIHJlZiBvbiBhbiB1bnF1YWxpZmllZCBgZ2l0IHB1c2hgLiBUaGlzIGFjY291bnRzIGZvclxuICAvLyB0aGUgY3VycmVudCBgYnJhbmNoLnB1c2hSZW1vdGVgIHNldHRpbmcgYW5kIGByZW1vdGUuPG5hbWU+LnB1c2hgIHJlZnNwZWMuXG4gIGdldFB1c2hTb3VyY2VzKHJlbW90ZU5hbWUsIHJlbW90ZVJlZk5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5ieVB1c2hSZWYuZ2V0KGAke3JlbW90ZU5hbWV9XFwwJHtyZW1vdGVSZWZOYW1lfWApIHx8IFtdO1xuICB9XG5cbiAgaW5zcGVjdChkZXB0aCwgb3B0aW9ucykge1xuICAgIHJldHVybiBgQnJhbmNoU2V0IHske3V0aWwuaW5zcGVjdCh0aGlzLmFsbCl9fWA7XG4gIH1cbn1cbiJdfQ==