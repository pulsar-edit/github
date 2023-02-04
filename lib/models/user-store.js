"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.source = void 0;
var _yubikiri = _interopRequireDefault(require("yubikiri"));
var _eventKit = require("event-kit");
var _relayNetworkLayerManager = _interopRequireDefault(require("../relay-network-layer-manager"));
var _author = _interopRequireWildcard(require("./author"));
var _keytarStrategy = require("../shared/keytar-strategy");
var _modelObserver = _interopRequireDefault(require("./model-observer"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// This is a guess about what a reasonable value is. Can adjust if performance is poor.
const MAX_COMMITS = 5000;
const source = {
  PENDING: Symbol('pending'),
  GITLOG: Symbol('git log'),
  GITHUBAPI: Symbol('github API')
};
exports.source = source;
class GraphQLCache {
  // One hour

  constructor() {
    this.bySlug = new Map();
  }
  get(remote) {
    const slug = remote.getSlug();
    const {
      ts,
      data
    } = this.bySlug.get(slug) || {
      ts: -Infinity,
      data: {}
    };
    if (Date.now() - ts > this.constructor.MAX_AGE_MS) {
      this.bySlug.delete(slug);
      return null;
    }
    return data;
  }
  set(remote, data) {
    this.bySlug.set(remote.getSlug(), {
      ts: Date.now(),
      data
    });
  }
}
_defineProperty(GraphQLCache, "MAX_AGE_MS", 3.6e6);
class UserStore {
  constructor({
    repository,
    login,
    config
  }) {
    this.emitter = new _eventKit.Emitter();
    this.subs = new _eventKit.CompositeDisposable();

    // TODO: [ku 3/2018] Consider using Dexie (indexDB wrapper) like Desktop and persist users across sessions
    this.allUsers = new Map();
    this.excludedUsers = new Set();
    this.users = [];
    this.committer = _author.nullAuthor;
    this.last = {
      source: source.PENDING,
      repository: null,
      excludedUsers: this.excludedUsers
    };
    this.cache = new GraphQLCache();
    this.repositoryObserver = new _modelObserver.default({
      fetchData: r => (0, _yubikiri.default)({
        committer: r.getCommitter(),
        authors: r.getAuthors({
          max: MAX_COMMITS
        }),
        remotes: r.getRemotes()
      }),
      didUpdate: () => this.loadUsers()
    });
    this.repositoryObserver.setActiveModel(repository);
    this.loginObserver = new _modelObserver.default({
      didUpdate: () => this.loadUsers()
    });
    this.loginObserver.setActiveModel(login);
    this.subs.add(config.observe('github.excludedUsers', value => {
      this.excludedUsers = new Set((value || '').split(/\s*,\s*/).filter(each => each.length > 0));
      return this.loadUsers();
    }));
  }
  dispose() {
    this.subs.dispose();
    this.emitter.dispose();
  }
  async loadUsers() {
    const data = this.repositoryObserver.getActiveModelData();
    if (!data) {
      return;
    }
    this.setCommitter(data.committer);
    const githubRemotes = Array.from(data.remotes).filter(remote => remote.isGithubRepo());
    if (githubRemotes.length > 0) {
      await this.loadUsersFromGraphQL(githubRemotes);
    } else {
      this.addUsers(data.authors, source.GITLOG);
    }

    // if for whatever reason, no committers can be added, fall back to
    // using git log committers as the last resort
    if (this.allUsers.size === 0) {
      this.addUsers(data.authors, source.GITLOG);
    }
  }
  loadUsersFromGraphQL(remotes) {
    return Promise.all(Array.from(remotes, remote => this.loadMentionableUsers(remote)));
  }
  async getToken(loginModel, loginAccount) {
    if (!loginModel) {
      return null;
    }
    const token = await loginModel.getToken(loginAccount);
    if (token === _keytarStrategy.UNAUTHENTICATED || token === _keytarStrategy.INSUFFICIENT || token instanceof Error) {
      return null;
    }
    return token;
  }
  async loadMentionableUsers(remote) {
    const cached = this.cache.get(remote);
    if (cached !== null) {
      this.addUsers(cached, source.GITHUBAPI);
      return;
    }
    const endpoint = remote.getEndpoint();
    const token = await this.getToken(this.loginObserver.getActiveModel(), endpoint.getLoginAccount());
    if (!token) {
      return;
    }
    const fetchQuery = _relayNetworkLayerManager.default.getFetchQuery(endpoint, token);
    let hasMore = true;
    let cursor = null;
    const remoteUsers = [];
    while (hasMore) {
      const response = await fetchQuery({
        name: 'GetMentionableUsers',
        text: `
          query GetMentionableUsers($owner: String!, $name: String!, $first: Int!, $after: String) {
            repository(owner: $owner, name: $name) {
              mentionableUsers(first: $first, after: $after) {
                nodes {
                  login
                  email
                  name
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `
      }, {
        owner: remote.getOwner(),
        name: remote.getRepo(),
        first: 100,
        after: cursor
      });

      /* istanbul ignore if */
      if (response.errors && response.errors.length > 1) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching mentionable users:\n${response.errors.map(e => e.message).join('\n')}`);
      }
      if (!response.data || !response.data.repository) {
        break;
      }
      const connection = response.data.repository.mentionableUsers;
      const authors = connection.nodes.map(node => {
        if (node.email === '') {
          node.email = `${node.login}@users.noreply.github.com`;
        }
        return new _author.default(node.email, node.name, node.login);
      });
      this.addUsers(authors, source.GITHUBAPI);
      remoteUsers.push(...authors);
      cursor = connection.pageInfo.endCursor;
      hasMore = connection.pageInfo.hasNextPage;
    }
    this.cache.set(remote, remoteUsers);
  }
  addUsers(users, nextSource) {
    let changed = false;
    if (nextSource !== this.last.source || this.repositoryObserver.getActiveModel() !== this.last.repository || this.excludedUsers !== this.last.excludedUsers) {
      changed = true;
      this.allUsers.clear();
    }
    for (const author of users) {
      if (!this.allUsers.has(author.getEmail())) {
        changed = true;
      }
      this.allUsers.set(author.getEmail(), author);
    }
    if (changed) {
      this.finalize();
    }
    this.last.source = nextSource;
    this.last.repository = this.repositoryObserver.getActiveModel();
    this.last.excludedUsers = this.excludedUsers;
  }
  finalize() {
    // TODO: [ku 3/2018] consider sorting based on most recent authors or commit frequency
    const users = [];
    for (const author of this.allUsers.values()) {
      if (author.matches(this.committer)) {
        continue;
      }
      if (author.isNoReply()) {
        continue;
      }
      if (this.excludedUsers.has(author.getEmail())) {
        continue;
      }
      users.push(author);
    }
    users.sort(_author.default.compare);
    this.users = users;
    this.didUpdate();
  }
  setRepository(repository) {
    this.repositoryObserver.setActiveModel(repository);
  }
  setLoginModel(login) {
    this.loginObserver.setActiveModel(login);
  }
  setCommitter(committer) {
    const changed = !this.committer.matches(committer);
    this.committer = committer;
    if (changed) {
      this.finalize();
    }
  }
  didUpdate() {
    this.emitter.emit('did-update', this.getUsers());
  }
  onDidUpdate(callback) {
    return this.emitter.on('did-update', callback);
  }
  getUsers() {
    return this.users;
  }
}
exports.default = UserStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNQVhfQ09NTUlUUyIsInNvdXJjZSIsIlBFTkRJTkciLCJTeW1ib2wiLCJHSVRMT0ciLCJHSVRIVUJBUEkiLCJHcmFwaFFMQ2FjaGUiLCJjb25zdHJ1Y3RvciIsImJ5U2x1ZyIsIk1hcCIsImdldCIsInJlbW90ZSIsInNsdWciLCJnZXRTbHVnIiwidHMiLCJkYXRhIiwiSW5maW5pdHkiLCJEYXRlIiwibm93IiwiTUFYX0FHRV9NUyIsImRlbGV0ZSIsInNldCIsIlVzZXJTdG9yZSIsInJlcG9zaXRvcnkiLCJsb2dpbiIsImNvbmZpZyIsImVtaXR0ZXIiLCJFbWl0dGVyIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJhbGxVc2VycyIsImV4Y2x1ZGVkVXNlcnMiLCJTZXQiLCJ1c2VycyIsImNvbW1pdHRlciIsIm51bGxBdXRob3IiLCJsYXN0IiwiY2FjaGUiLCJyZXBvc2l0b3J5T2JzZXJ2ZXIiLCJNb2RlbE9ic2VydmVyIiwiZmV0Y2hEYXRhIiwiciIsInl1YmlraXJpIiwiZ2V0Q29tbWl0dGVyIiwiYXV0aG9ycyIsImdldEF1dGhvcnMiLCJtYXgiLCJyZW1vdGVzIiwiZ2V0UmVtb3RlcyIsImRpZFVwZGF0ZSIsImxvYWRVc2VycyIsInNldEFjdGl2ZU1vZGVsIiwibG9naW5PYnNlcnZlciIsImFkZCIsIm9ic2VydmUiLCJ2YWx1ZSIsInNwbGl0IiwiZmlsdGVyIiwiZWFjaCIsImxlbmd0aCIsImRpc3Bvc2UiLCJnZXRBY3RpdmVNb2RlbERhdGEiLCJzZXRDb21taXR0ZXIiLCJnaXRodWJSZW1vdGVzIiwiQXJyYXkiLCJmcm9tIiwiaXNHaXRodWJSZXBvIiwibG9hZFVzZXJzRnJvbUdyYXBoUUwiLCJhZGRVc2VycyIsInNpemUiLCJQcm9taXNlIiwiYWxsIiwibG9hZE1lbnRpb25hYmxlVXNlcnMiLCJnZXRUb2tlbiIsImxvZ2luTW9kZWwiLCJsb2dpbkFjY291bnQiLCJ0b2tlbiIsIlVOQVVUSEVOVElDQVRFRCIsIklOU1VGRklDSUVOVCIsIkVycm9yIiwiY2FjaGVkIiwiZW5kcG9pbnQiLCJnZXRFbmRwb2ludCIsImdldEFjdGl2ZU1vZGVsIiwiZ2V0TG9naW5BY2NvdW50IiwiZmV0Y2hRdWVyeSIsIlJlbGF5TmV0d29ya0xheWVyTWFuYWdlciIsImdldEZldGNoUXVlcnkiLCJoYXNNb3JlIiwiY3Vyc29yIiwicmVtb3RlVXNlcnMiLCJyZXNwb25zZSIsIm5hbWUiLCJ0ZXh0Iiwib3duZXIiLCJnZXRPd25lciIsImdldFJlcG8iLCJmaXJzdCIsImFmdGVyIiwiZXJyb3JzIiwiY29uc29sZSIsImVycm9yIiwibWFwIiwiZSIsIm1lc3NhZ2UiLCJqb2luIiwiY29ubmVjdGlvbiIsIm1lbnRpb25hYmxlVXNlcnMiLCJub2RlcyIsIm5vZGUiLCJlbWFpbCIsIkF1dGhvciIsInB1c2giLCJwYWdlSW5mbyIsImVuZEN1cnNvciIsImhhc05leHRQYWdlIiwibmV4dFNvdXJjZSIsImNoYW5nZWQiLCJjbGVhciIsImF1dGhvciIsImhhcyIsImdldEVtYWlsIiwiZmluYWxpemUiLCJ2YWx1ZXMiLCJtYXRjaGVzIiwiaXNOb1JlcGx5Iiwic29ydCIsImNvbXBhcmUiLCJzZXRSZXBvc2l0b3J5Iiwic2V0TG9naW5Nb2RlbCIsImVtaXQiLCJnZXRVc2VycyIsIm9uRGlkVXBkYXRlIiwiY2FsbGJhY2siLCJvbiJdLCJzb3VyY2VzIjpbInVzZXItc3RvcmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IFJlbGF5TmV0d29ya0xheWVyTWFuYWdlciBmcm9tICcuLi9yZWxheS1uZXR3b3JrLWxheWVyLW1hbmFnZXInO1xuaW1wb3J0IEF1dGhvciwge251bGxBdXRob3J9IGZyb20gJy4vYXV0aG9yJztcbmltcG9ydCB7VU5BVVRIRU5USUNBVEVELCBJTlNVRkZJQ0lFTlR9IGZyb20gJy4uL3NoYXJlZC9rZXl0YXItc3RyYXRlZ3knO1xuaW1wb3J0IE1vZGVsT2JzZXJ2ZXIgZnJvbSAnLi9tb2RlbC1vYnNlcnZlcic7XG5cbi8vIFRoaXMgaXMgYSBndWVzcyBhYm91dCB3aGF0IGEgcmVhc29uYWJsZSB2YWx1ZSBpcy4gQ2FuIGFkanVzdCBpZiBwZXJmb3JtYW5jZSBpcyBwb29yLlxuY29uc3QgTUFYX0NPTU1JVFMgPSA1MDAwO1xuXG5leHBvcnQgY29uc3Qgc291cmNlID0ge1xuICBQRU5ESU5HOiBTeW1ib2woJ3BlbmRpbmcnKSxcbiAgR0lUTE9HOiBTeW1ib2woJ2dpdCBsb2cnKSxcbiAgR0lUSFVCQVBJOiBTeW1ib2woJ2dpdGh1YiBBUEknKSxcbn07XG5cbmNsYXNzIEdyYXBoUUxDYWNoZSB7XG4gIC8vIE9uZSBob3VyXG4gIHN0YXRpYyBNQVhfQUdFX01TID0gMy42ZTZcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJ5U2x1ZyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGdldChyZW1vdGUpIHtcbiAgICBjb25zdCBzbHVnID0gcmVtb3RlLmdldFNsdWcoKTtcbiAgICBjb25zdCB7dHMsIGRhdGF9ID0gdGhpcy5ieVNsdWcuZ2V0KHNsdWcpIHx8IHtcbiAgICAgIHRzOiAtSW5maW5pdHksXG4gICAgICBkYXRhOiB7fSxcbiAgICB9O1xuXG4gICAgaWYgKERhdGUubm93KCkgLSB0cyA+IHRoaXMuY29uc3RydWN0b3IuTUFYX0FHRV9NUykge1xuICAgICAgdGhpcy5ieVNsdWcuZGVsZXRlKHNsdWcpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgc2V0KHJlbW90ZSwgZGF0YSkge1xuICAgIHRoaXMuYnlTbHVnLnNldChyZW1vdGUuZ2V0U2x1ZygpLCB7dHM6IERhdGUubm93KCksIGRhdGF9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyU3RvcmUge1xuICBjb25zdHJ1Y3Rvcih7cmVwb3NpdG9yeSwgbG9naW4sIGNvbmZpZ30pIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBUT0RPOiBba3UgMy8yMDE4XSBDb25zaWRlciB1c2luZyBEZXhpZSAoaW5kZXhEQiB3cmFwcGVyKSBsaWtlIERlc2t0b3AgYW5kIHBlcnNpc3QgdXNlcnMgYWNyb3NzIHNlc3Npb25zXG4gICAgdGhpcy5hbGxVc2VycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmV4Y2x1ZGVkVXNlcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy51c2VycyA9IFtdO1xuICAgIHRoaXMuY29tbWl0dGVyID0gbnVsbEF1dGhvcjtcblxuICAgIHRoaXMubGFzdCA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLlBFTkRJTkcsXG4gICAgICByZXBvc2l0b3J5OiBudWxsLFxuICAgICAgZXhjbHVkZWRVc2VyczogdGhpcy5leGNsdWRlZFVzZXJzLFxuICAgIH07XG4gICAgdGhpcy5jYWNoZSA9IG5ldyBHcmFwaFFMQ2FjaGUoKTtcblxuICAgIHRoaXMucmVwb3NpdG9yeU9ic2VydmVyID0gbmV3IE1vZGVsT2JzZXJ2ZXIoe1xuICAgICAgZmV0Y2hEYXRhOiByID0+IHl1YmlraXJpKHtcbiAgICAgICAgY29tbWl0dGVyOiByLmdldENvbW1pdHRlcigpLFxuICAgICAgICBhdXRob3JzOiByLmdldEF1dGhvcnMoe21heDogTUFYX0NPTU1JVFN9KSxcbiAgICAgICAgcmVtb3Rlczogci5nZXRSZW1vdGVzKCksXG4gICAgICB9KSxcbiAgICAgIGRpZFVwZGF0ZTogKCkgPT4gdGhpcy5sb2FkVXNlcnMoKSxcbiAgICB9KTtcbiAgICB0aGlzLnJlcG9zaXRvcnlPYnNlcnZlci5zZXRBY3RpdmVNb2RlbChyZXBvc2l0b3J5KTtcblxuICAgIHRoaXMubG9naW5PYnNlcnZlciA9IG5ldyBNb2RlbE9ic2VydmVyKHtcbiAgICAgIGRpZFVwZGF0ZTogKCkgPT4gdGhpcy5sb2FkVXNlcnMoKSxcbiAgICB9KTtcbiAgICB0aGlzLmxvZ2luT2JzZXJ2ZXIuc2V0QWN0aXZlTW9kZWwobG9naW4pO1xuXG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIGNvbmZpZy5vYnNlcnZlKCdnaXRodWIuZXhjbHVkZWRVc2VycycsIHZhbHVlID0+IHtcbiAgICAgICAgdGhpcy5leGNsdWRlZFVzZXJzID0gbmV3IFNldChcbiAgICAgICAgICAodmFsdWUgfHwgJycpLnNwbGl0KC9cXHMqLFxccyovKS5maWx0ZXIoZWFjaCA9PiBlYWNoLmxlbmd0aCA+IDApLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkVXNlcnMoKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRVc2VycygpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5yZXBvc2l0b3J5T2JzZXJ2ZXIuZ2V0QWN0aXZlTW9kZWxEYXRhKCk7XG5cbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldENvbW1pdHRlcihkYXRhLmNvbW1pdHRlcik7XG4gICAgY29uc3QgZ2l0aHViUmVtb3RlcyA9IEFycmF5LmZyb20oZGF0YS5yZW1vdGVzKS5maWx0ZXIocmVtb3RlID0+IHJlbW90ZS5pc0dpdGh1YlJlcG8oKSk7XG5cbiAgICBpZiAoZ2l0aHViUmVtb3Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRVc2Vyc0Zyb21HcmFwaFFMKGdpdGh1YlJlbW90ZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZFVzZXJzKGRhdGEuYXV0aG9ycywgc291cmNlLkdJVExPRyk7XG4gICAgfVxuXG4gICAgLy8gaWYgZm9yIHdoYXRldmVyIHJlYXNvbiwgbm8gY29tbWl0dGVycyBjYW4gYmUgYWRkZWQsIGZhbGwgYmFjayB0b1xuICAgIC8vIHVzaW5nIGdpdCBsb2cgY29tbWl0dGVycyBhcyB0aGUgbGFzdCByZXNvcnRcbiAgICBpZiAodGhpcy5hbGxVc2Vycy5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLmFkZFVzZXJzKGRhdGEuYXV0aG9ycywgc291cmNlLkdJVExPRyk7XG4gICAgfVxuICB9XG5cbiAgbG9hZFVzZXJzRnJvbUdyYXBoUUwocmVtb3Rlcykge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIEFycmF5LmZyb20ocmVtb3RlcywgcmVtb3RlID0+IHRoaXMubG9hZE1lbnRpb25hYmxlVXNlcnMocmVtb3RlKSksXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGdldFRva2VuKGxvZ2luTW9kZWwsIGxvZ2luQWNjb3VudCkge1xuICAgIGlmICghbG9naW5Nb2RlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgbG9naW5Nb2RlbC5nZXRUb2tlbihsb2dpbkFjY291bnQpO1xuICAgIGlmICh0b2tlbiA9PT0gVU5BVVRIRU5USUNBVEVEIHx8IHRva2VuID09PSBJTlNVRkZJQ0lFTlQgfHwgdG9rZW4gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbjtcbiAgfVxuXG4gIGFzeW5jIGxvYWRNZW50aW9uYWJsZVVzZXJzKHJlbW90ZSkge1xuICAgIGNvbnN0IGNhY2hlZCA9IHRoaXMuY2FjaGUuZ2V0KHJlbW90ZSk7XG4gICAgaWYgKGNhY2hlZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5hZGRVc2VycyhjYWNoZWQsIHNvdXJjZS5HSVRIVUJBUEkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZHBvaW50ID0gcmVtb3RlLmdldEVuZHBvaW50KCk7XG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdldFRva2VuKHRoaXMubG9naW5PYnNlcnZlci5nZXRBY3RpdmVNb2RlbCgpLCBlbmRwb2ludC5nZXRMb2dpbkFjY291bnQoKSk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZldGNoUXVlcnkgPSBSZWxheU5ldHdvcmtMYXllck1hbmFnZXIuZ2V0RmV0Y2hRdWVyeShlbmRwb2ludCwgdG9rZW4pO1xuXG4gICAgbGV0IGhhc01vcmUgPSB0cnVlO1xuICAgIGxldCBjdXJzb3IgPSBudWxsO1xuICAgIGNvbnN0IHJlbW90ZVVzZXJzID0gW107XG5cbiAgICB3aGlsZSAoaGFzTW9yZSkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaFF1ZXJ5KHtcbiAgICAgICAgbmFtZTogJ0dldE1lbnRpb25hYmxlVXNlcnMnLFxuICAgICAgICB0ZXh0OiBgXG4gICAgICAgICAgcXVlcnkgR2V0TWVudGlvbmFibGVVc2Vycygkb3duZXI6IFN0cmluZyEsICRuYW1lOiBTdHJpbmchLCAkZmlyc3Q6IEludCEsICRhZnRlcjogU3RyaW5nKSB7XG4gICAgICAgICAgICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgICAgICAgICAgIG1lbnRpb25hYmxlVXNlcnMoZmlyc3Q6ICRmaXJzdCwgYWZ0ZXI6ICRhZnRlcikge1xuICAgICAgICAgICAgICAgIG5vZGVzIHtcbiAgICAgICAgICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgICAgICAgICBlbWFpbFxuICAgICAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYWdlSW5mbyB7XG4gICAgICAgICAgICAgICAgICBoYXNOZXh0UGFnZVxuICAgICAgICAgICAgICAgICAgZW5kQ3Vyc29yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBgLFxuICAgICAgfSwge1xuICAgICAgICBvd25lcjogcmVtb3RlLmdldE93bmVyKCksXG4gICAgICAgIG5hbWU6IHJlbW90ZS5nZXRSZXBvKCksXG4gICAgICAgIGZpcnN0OiAxMDAsXG4gICAgICAgIGFmdGVyOiBjdXJzb3IsXG4gICAgICB9KTtcblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAocmVzcG9uc2UuZXJyb3JzICYmIHJlc3BvbnNlLmVycm9ycy5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nIG1lbnRpb25hYmxlIHVzZXJzOlxcbiR7cmVzcG9uc2UuZXJyb3JzLm1hcChlID0+IGUubWVzc2FnZSkuam9pbignXFxuJyl9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzcG9uc2UuZGF0YSB8fCAhcmVzcG9uc2UuZGF0YS5yZXBvc2l0b3J5KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gcmVzcG9uc2UuZGF0YS5yZXBvc2l0b3J5Lm1lbnRpb25hYmxlVXNlcnM7XG4gICAgICBjb25zdCBhdXRob3JzID0gY29ubmVjdGlvbi5ub2Rlcy5tYXAobm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLmVtYWlsID09PSAnJykge1xuICAgICAgICAgIG5vZGUuZW1haWwgPSBgJHtub2RlLmxvZ2lufUB1c2Vycy5ub3JlcGx5LmdpdGh1Yi5jb21gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBdXRob3Iobm9kZS5lbWFpbCwgbm9kZS5uYW1lLCBub2RlLmxvZ2luKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRVc2VycyhhdXRob3JzLCBzb3VyY2UuR0lUSFVCQVBJKTtcbiAgICAgIHJlbW90ZVVzZXJzLnB1c2goLi4uYXV0aG9ycyk7XG5cbiAgICAgIGN1cnNvciA9IGNvbm5lY3Rpb24ucGFnZUluZm8uZW5kQ3Vyc29yO1xuICAgICAgaGFzTW9yZSA9IGNvbm5lY3Rpb24ucGFnZUluZm8uaGFzTmV4dFBhZ2U7XG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZS5zZXQocmVtb3RlLCByZW1vdGVVc2Vycyk7XG4gIH1cblxuICBhZGRVc2Vycyh1c2VycywgbmV4dFNvdXJjZSkge1xuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICBpZiAoXG4gICAgICBuZXh0U291cmNlICE9PSB0aGlzLmxhc3Quc291cmNlIHx8XG4gICAgICB0aGlzLnJlcG9zaXRvcnlPYnNlcnZlci5nZXRBY3RpdmVNb2RlbCgpICE9PSB0aGlzLmxhc3QucmVwb3NpdG9yeSB8fFxuICAgICAgdGhpcy5leGNsdWRlZFVzZXJzICE9PSB0aGlzLmxhc3QuZXhjbHVkZWRVc2Vyc1xuICAgICkge1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB0aGlzLmFsbFVzZXJzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhdXRob3Igb2YgdXNlcnMpIHtcbiAgICAgIGlmICghdGhpcy5hbGxVc2Vycy5oYXMoYXV0aG9yLmdldEVtYWlsKCkpKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5hbGxVc2Vycy5zZXQoYXV0aG9yLmdldEVtYWlsKCksIGF1dGhvcik7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICB9XG4gICAgdGhpcy5sYXN0LnNvdXJjZSA9IG5leHRTb3VyY2U7XG4gICAgdGhpcy5sYXN0LnJlcG9zaXRvcnkgPSB0aGlzLnJlcG9zaXRvcnlPYnNlcnZlci5nZXRBY3RpdmVNb2RlbCgpO1xuICAgIHRoaXMubGFzdC5leGNsdWRlZFVzZXJzID0gdGhpcy5leGNsdWRlZFVzZXJzO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgLy8gVE9ETzogW2t1IDMvMjAxOF0gY29uc2lkZXIgc29ydGluZyBiYXNlZCBvbiBtb3N0IHJlY2VudCBhdXRob3JzIG9yIGNvbW1pdCBmcmVxdWVuY3lcbiAgICBjb25zdCB1c2VycyA9IFtdO1xuICAgIGZvciAoY29uc3QgYXV0aG9yIG9mIHRoaXMuYWxsVXNlcnMudmFsdWVzKCkpIHtcbiAgICAgIGlmIChhdXRob3IubWF0Y2hlcyh0aGlzLmNvbW1pdHRlcikpIHsgY29udGludWU7IH1cbiAgICAgIGlmIChhdXRob3IuaXNOb1JlcGx5KCkpIHsgY29udGludWU7IH1cbiAgICAgIGlmICh0aGlzLmV4Y2x1ZGVkVXNlcnMuaGFzKGF1dGhvci5nZXRFbWFpbCgpKSkgeyBjb250aW51ZTsgfVxuXG4gICAgICB1c2Vycy5wdXNoKGF1dGhvcik7XG4gICAgfVxuICAgIHVzZXJzLnNvcnQoQXV0aG9yLmNvbXBhcmUpO1xuICAgIHRoaXMudXNlcnMgPSB1c2VycztcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgc2V0UmVwb3NpdG9yeShyZXBvc2l0b3J5KSB7XG4gICAgdGhpcy5yZXBvc2l0b3J5T2JzZXJ2ZXIuc2V0QWN0aXZlTW9kZWwocmVwb3NpdG9yeSk7XG4gIH1cblxuICBzZXRMb2dpbk1vZGVsKGxvZ2luKSB7XG4gICAgdGhpcy5sb2dpbk9ic2VydmVyLnNldEFjdGl2ZU1vZGVsKGxvZ2luKTtcbiAgfVxuXG4gIHNldENvbW1pdHRlcihjb21taXR0ZXIpIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gIXRoaXMuY29tbWl0dGVyLm1hdGNoZXMoY29tbWl0dGVyKTtcbiAgICB0aGlzLmNvbW1pdHRlciA9IGNvbW1pdHRlcjtcbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScsIHRoaXMuZ2V0VXNlcnMoKSk7XG4gIH1cblxuICBvbkRpZFVwZGF0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRVc2VycygpIHtcbiAgICByZXR1cm4gdGhpcy51c2VycztcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBNkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTdDO0FBQ0EsTUFBTUEsV0FBVyxHQUFHLElBQUk7QUFFakIsTUFBTUMsTUFBTSxHQUFHO0VBQ3BCQyxPQUFPLEVBQUVDLE1BQU0sQ0FBQyxTQUFTLENBQUM7RUFDMUJDLE1BQU0sRUFBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztFQUN6QkUsU0FBUyxFQUFFRixNQUFNLENBQUMsWUFBWTtBQUNoQyxDQUFDO0FBQUM7QUFFRixNQUFNRyxZQUFZLENBQUM7RUFDakI7O0VBR0FDLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQ0MsTUFBTSxHQUFHLElBQUlDLEdBQUcsRUFBRTtFQUN6QjtFQUVBQyxHQUFHLENBQUNDLE1BQU0sRUFBRTtJQUNWLE1BQU1DLElBQUksR0FBR0QsTUFBTSxDQUFDRSxPQUFPLEVBQUU7SUFDN0IsTUFBTTtNQUFDQyxFQUFFO01BQUVDO0lBQUksQ0FBQyxHQUFHLElBQUksQ0FBQ1AsTUFBTSxDQUFDRSxHQUFHLENBQUNFLElBQUksQ0FBQyxJQUFJO01BQzFDRSxFQUFFLEVBQUUsQ0FBQ0UsUUFBUTtNQUNiRCxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUM7SUFFRCxJQUFJRSxJQUFJLENBQUNDLEdBQUcsRUFBRSxHQUFHSixFQUFFLEdBQUcsSUFBSSxDQUFDUCxXQUFXLENBQUNZLFVBQVUsRUFBRTtNQUNqRCxJQUFJLENBQUNYLE1BQU0sQ0FBQ1ksTUFBTSxDQUFDUixJQUFJLENBQUM7TUFDeEIsT0FBTyxJQUFJO0lBQ2I7SUFDQSxPQUFPRyxJQUFJO0VBQ2I7RUFFQU0sR0FBRyxDQUFDVixNQUFNLEVBQUVJLElBQUksRUFBRTtJQUNoQixJQUFJLENBQUNQLE1BQU0sQ0FBQ2EsR0FBRyxDQUFD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