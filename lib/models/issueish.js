"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = require("url");

var _moment = _interopRequireDefault(require("moment"));

var _buildStatus = require("./build-status");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Issueish {
  constructor(data) {
    const author = data.author || _helpers.GHOST_USER;
    this.number = data.number;
    this.title = data.title;
    this.url = new _url.URL(data.url);
    this.authorLogin = author.login;
    this.authorAvatarURL = new _url.URL(author.avatarUrl);
    this.createdAt = (0, _moment.default)(data.createdAt, _moment.default.ISO_8601);
    this.headRefName = data.headRefName;
    this.headRepositoryID = data.repository.id;
    this.latestCommit = null;
    this.statusContexts = [];
    this.checkRuns = [];

    if (data.commits.nodes.length > 0) {
      this.latestCommit = data.commits.nodes[0].commit;
    }

    if (this.latestCommit && this.latestCommit.status) {
      this.statusContexts = this.latestCommit.status.contexts;
    }
  }

  getNumber() {
    return this.number;
  }

  getTitle() {
    return this.title;
  }

  getGitHubURL() {
    return this.url.toString();
  }

  getAuthorLogin() {
    return this.authorLogin;
  }

  getAuthorAvatarURL(size = 32) {
    const u = new _url.URL(this.authorAvatarURL.toString());
    u.searchParams.set('s', size);
    return u.toString();
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getHeadRefName() {
    return this.headRefName;
  }

  getHeadRepositoryID() {
    return this.headRepositoryID;
  }

  getLatestCommit() {
    return this.latestCommit;
  }

  setCheckRuns(runsBySuite) {
    this.checkRuns = [];

    for (const [, runs] of runsBySuite) {
      for (const checkRun of runs) {
        this.checkRuns.push(checkRun);
      }
    }
  }

  getStatusCounts() {
    const buildStatuses = [];

    for (const context of this.statusContexts) {
      buildStatuses.push((0, _buildStatus.buildStatusFromStatusContext)(context));
    }

    for (const checkRun of this.checkRuns) {
      buildStatuses.push((0, _buildStatus.buildStatusFromCheckResult)(checkRun));
    }

    const counts = {
      pending: 0,
      failure: 0,
      success: 0,
      neutral: 0
    };

    for (const {
      classSuffix
    } of buildStatuses) {
      counts[classSuffix]++;
    }

    return counts;
  }

}

exports.default = Issueish;