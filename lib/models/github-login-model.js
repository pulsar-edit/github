"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _eventKit = require("event-kit");
var _keytarStrategy = require("../shared/keytar-strategy");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
let instance = null;
class GithubLoginModel {
  // Be sure that we're requesting at least this many scopes on the token we grant through github.atom.io or we'll
  // give everyone a really frustrating experience ;-)

  static get() {
    if (!instance) {
      instance = new GithubLoginModel();
    }
    return instance;
  }
  constructor(Strategy) {
    this._Strategy = Strategy;
    this._strategy = null;
    this.emitter = new _eventKit.Emitter();
    this.checked = new Map();
  }
  async getStrategy() {
    if (this._strategy) {
      return this._strategy;
    }
    if (this._Strategy) {
      this._strategy = new this._Strategy();
      return this._strategy;
    }
    this._strategy = await (0, _keytarStrategy.createStrategy)();
    return this._strategy;
  }
  async getToken(account) {
    const strategy = await this.getStrategy();
    const password = await strategy.getPassword('atom-github', account);
    if (!password || password === _keytarStrategy.UNAUTHENTICATED) {
      // User is not logged in
      return _keytarStrategy.UNAUTHENTICATED;
    }
    if (/^https?:\/\//.test(account)) {
      // Avoid storing tokens in memory longer than necessary. Let's cache token scope checks by storing a set of
      // checksums instead.
      const hash = _crypto.default.createHash('md5');
      hash.update(password);
      const fingerprint = hash.digest('base64');
      const outcome = this.checked.get(fingerprint);
      if (outcome === _keytarStrategy.UNAUTHENTICATED || outcome === _keytarStrategy.INSUFFICIENT) {
        // Cached failure
        return outcome;
      } else if (!outcome) {
        // No cached outcome. Query for scopes.
        try {
          const scopes = await this.getScopes(account, password);
          if (scopes === _keytarStrategy.UNAUTHORIZED) {
            // Password is incorrect. Treat it as though you aren't authenticated at all.
            this.checked.set(fingerprint, _keytarStrategy.UNAUTHENTICATED);
            return _keytarStrategy.UNAUTHENTICATED;
          }
          const scopeSet = new Set(scopes);
          for (const scope of this.constructor.REQUIRED_SCOPES) {
            if (!scopeSet.has(scope)) {
              // Token doesn't have enough OAuth scopes, need to reauthenticate
              this.checked.set(fingerprint, _keytarStrategy.INSUFFICIENT);
              return _keytarStrategy.INSUFFICIENT;
            }
          }

          // Successfully authenticated and had all required scopes.
          this.checked.set(fingerprint, true);
        } catch (e) {
          // Most likely a network error. Do not cache the failure.
          return e;
        }
      }
    }
    return password;
  }
  async setToken(account, token) {
    const strategy = await this.getStrategy();
    await strategy.replacePassword('atom-github', account, token);
    this.didUpdate();
  }
  async removeToken(account) {
    const strategy = await this.getStrategy();
    await strategy.deletePassword('atom-github', account);
    this.didUpdate();
  }

  /* istanbul ignore next */
  async getScopes(host, token) {
    if (atom.inSpecMode()) {
      if (token === 'good-token') {
        return this.constructor.REQUIRED_SCOPES;
      }
      throw new Error('Attempt to check token scopes in specs');
    }
    let response;
    try {
      response = await fetch(host, {
        method: 'HEAD',
        headers: {
          Authorization: `bearer ${token}`
        }
      });
    } catch (e) {
      e.network = true;
      throw e;
    }
    if (response.status === 401) {
      return _keytarStrategy.UNAUTHORIZED;
    }
    if (response.status !== 200) {
      const e = new Error(`Unable to check token for OAuth scopes against ${host}`);
      e.response = response;
      e.responseText = await response.text();
      throw e;
    }
    return response.headers.get('X-OAuth-Scopes').split(/\s*,\s*/);
  }
  didUpdate() {
    this.emitter.emit('did-update');
  }
  onDidUpdate(cb) {
    return this.emitter.on('did-update', cb);
  }
  destroy() {
    this.emitter.dispose();
  }
}
exports.default = GithubLoginModel;
_defineProperty(GithubLoginModel, "REQUIRED_SCOPES", ['repo', 'read:org', 'user:email']);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpbnN0YW5jZSIsIkdpdGh1YkxvZ2luTW9kZWwiLCJnZXQiLCJjb25zdHJ1Y3RvciIsIlN0cmF0ZWd5IiwiX1N0cmF0ZWd5IiwiX3N0cmF0ZWd5IiwiZW1pdHRlciIsIkVtaXR0ZXIiLCJjaGVja2VkIiwiTWFwIiwiZ2V0U3RyYXRlZ3kiLCJjcmVhdGVTdHJhdGVneSIsImdldFRva2VuIiwiYWNjb3VudCIsInN0cmF0ZWd5IiwicGFzc3dvcmQiLCJnZXRQYXNzd29yZCIsIlVOQVVUSEVOVElDQVRFRCIsInRlc3QiLCJoYXNoIiwiY3J5cHRvIiwiY3JlYXRlSGFzaCIsInVwZGF0ZSIsImZpbmdlcnByaW50IiwiZGlnZXN0Iiwib3V0Y29tZSIsIklOU1VGRklDSUVOVCIsInNjb3BlcyIsImdldFNjb3BlcyIsIlVOQVVUSE9SSVpFRCIsInNldCIsInNjb3BlU2V0IiwiU2V0Iiwic2NvcGUiLCJSRVFVSVJFRF9TQ09QRVMiLCJoYXMiLCJlIiwic2V0VG9rZW4iLCJ0b2tlbiIsInJlcGxhY2VQYXNzd29yZCIsImRpZFVwZGF0ZSIsInJlbW92ZVRva2VuIiwiZGVsZXRlUGFzc3dvcmQiLCJob3N0IiwiYXRvbSIsImluU3BlY01vZGUiLCJFcnJvciIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsIm5ldHdvcmsiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJ0ZXh0Iiwic3BsaXQiLCJlbWl0Iiwib25EaWRVcGRhdGUiLCJjYiIsIm9uIiwiZGVzdHJveSIsImRpc3Bvc2UiXSwic291cmNlcyI6WyJnaXRodWItbG9naW4tbW9kZWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge1VOQVVUSEVOVElDQVRFRCwgSU5TVUZGSUNJRU5ULCBVTkFVVEhPUklaRUQsIGNyZWF0ZVN0cmF0ZWd5fSBmcm9tICcuLi9zaGFyZWQva2V5dGFyLXN0cmF0ZWd5JztcblxubGV0IGluc3RhbmNlID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViTG9naW5Nb2RlbCB7XG4gIC8vIEJlIHN1cmUgdGhhdCB3ZSdyZSByZXF1ZXN0aW5nIGF0IGxlYXN0IHRoaXMgbWFueSBzY29wZXMgb24gdGhlIHRva2VuIHdlIGdyYW50IHRocm91Z2ggZ2l0aHViLmF0b20uaW8gb3Igd2UnbGxcbiAgLy8gZ2l2ZSBldmVyeW9uZSBhIHJlYWxseSBmcnVzdHJhdGluZyBleHBlcmllbmNlIDstKVxuICBzdGF0aWMgUkVRVUlSRURfU0NPUEVTID0gWydyZXBvJywgJ3JlYWQ6b3JnJywgJ3VzZXI6ZW1haWwnXVxuXG4gIHN0YXRpYyBnZXQoKSB7XG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBuZXcgR2l0aHViTG9naW5Nb2RlbCgpO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihTdHJhdGVneSkge1xuICAgIHRoaXMuX1N0cmF0ZWd5ID0gU3RyYXRlZ3k7XG4gICAgdGhpcy5fc3RyYXRlZ3kgPSBudWxsO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5jaGVja2VkID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3RyYXRlZ3koKSB7XG4gICAgaWYgKHRoaXMuX3N0cmF0ZWd5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RyYXRlZ3k7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX1N0cmF0ZWd5KSB7XG4gICAgICB0aGlzLl9zdHJhdGVneSA9IG5ldyB0aGlzLl9TdHJhdGVneSgpO1xuICAgICAgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5O1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmF0ZWd5ID0gYXdhaXQgY3JlYXRlU3RyYXRlZ3koKTtcbiAgICByZXR1cm4gdGhpcy5fc3RyYXRlZ3k7XG4gIH1cblxuICBhc3luYyBnZXRUb2tlbihhY2NvdW50KSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBhd2FpdCB0aGlzLmdldFN0cmF0ZWd5KCk7XG4gICAgY29uc3QgcGFzc3dvcmQgPSBhd2FpdCBzdHJhdGVneS5nZXRQYXNzd29yZCgnYXRvbS1naXRodWInLCBhY2NvdW50KTtcbiAgICBpZiAoIXBhc3N3b3JkIHx8IHBhc3N3b3JkID09PSBVTkFVVEhFTlRJQ0FURUQpIHtcbiAgICAgIC8vIFVzZXIgaXMgbm90IGxvZ2dlZCBpblxuICAgICAgcmV0dXJuIFVOQVVUSEVOVElDQVRFRDtcbiAgICB9XG5cbiAgICBpZiAoL15odHRwcz86XFwvXFwvLy50ZXN0KGFjY291bnQpKSB7XG4gICAgICAvLyBBdm9pZCBzdG9yaW5nIHRva2VucyBpbiBtZW1vcnkgbG9uZ2VyIHRoYW4gbmVjZXNzYXJ5LiBMZXQncyBjYWNoZSB0b2tlbiBzY29wZSBjaGVja3MgYnkgc3RvcmluZyBhIHNldCBvZlxuICAgICAgLy8gY2hlY2tzdW1zIGluc3RlYWQuXG4gICAgICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpO1xuICAgICAgaGFzaC51cGRhdGUocGFzc3dvcmQpO1xuICAgICAgY29uc3QgZmluZ2VycHJpbnQgPSBoYXNoLmRpZ2VzdCgnYmFzZTY0Jyk7XG5cbiAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLmNoZWNrZWQuZ2V0KGZpbmdlcnByaW50KTtcbiAgICAgIGlmIChvdXRjb21lID09PSBVTkFVVEhFTlRJQ0FURUQgfHwgb3V0Y29tZSA9PT0gSU5TVUZGSUNJRU5UKSB7XG4gICAgICAgIC8vIENhY2hlZCBmYWlsdXJlXG4gICAgICAgIHJldHVybiBvdXRjb21lO1xuICAgICAgfSBlbHNlIGlmICghb3V0Y29tZSkge1xuICAgICAgICAvLyBObyBjYWNoZWQgb3V0Y29tZS4gUXVlcnkgZm9yIHNjb3Blcy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBzY29wZXMgPSBhd2FpdCB0aGlzLmdldFNjb3BlcyhhY2NvdW50LCBwYXNzd29yZCk7XG4gICAgICAgICAgaWYgKHNjb3BlcyA9PT0gVU5BVVRIT1JJWkVEKSB7XG4gICAgICAgICAgICAvLyBQYXNzd29yZCBpcyBpbmNvcnJlY3QuIFRyZWF0IGl0IGFzIHRob3VnaCB5b3UgYXJlbid0IGF1dGhlbnRpY2F0ZWQgYXQgYWxsLlxuICAgICAgICAgICAgdGhpcy5jaGVja2VkLnNldChmaW5nZXJwcmludCwgVU5BVVRIRU5USUNBVEVEKTtcbiAgICAgICAgICAgIHJldHVybiBVTkFVVEhFTlRJQ0FURUQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHNjb3BlU2V0ID0gbmV3IFNldChzY29wZXMpO1xuXG4gICAgICAgICAgZm9yIChjb25zdCBzY29wZSBvZiB0aGlzLmNvbnN0cnVjdG9yLlJFUVVJUkVEX1NDT1BFUykge1xuICAgICAgICAgICAgaWYgKCFzY29wZVNldC5oYXMoc2NvcGUpKSB7XG4gICAgICAgICAgICAgIC8vIFRva2VuIGRvZXNuJ3QgaGF2ZSBlbm91Z2ggT0F1dGggc2NvcGVzLCBuZWVkIHRvIHJlYXV0aGVudGljYXRlXG4gICAgICAgICAgICAgIHRoaXMuY2hlY2tlZC5zZXQoZmluZ2VycHJpbnQsIElOU1VGRklDSUVOVCk7XG4gICAgICAgICAgICAgIHJldHVybiBJTlNVRkZJQ0lFTlQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU3VjY2Vzc2Z1bGx5IGF1dGhlbnRpY2F0ZWQgYW5kIGhhZCBhbGwgcmVxdWlyZWQgc2NvcGVzLlxuICAgICAgICAgIHRoaXMuY2hlY2tlZC5zZXQoZmluZ2VycHJpbnQsIHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gTW9zdCBsaWtlbHkgYSBuZXR3b3JrIGVycm9yLiBEbyBub3QgY2FjaGUgdGhlIGZhaWx1cmUuXG4gICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH1cblxuICBhc3luYyBzZXRUb2tlbihhY2NvdW50LCB0b2tlbikge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gYXdhaXQgdGhpcy5nZXRTdHJhdGVneSgpO1xuICAgIGF3YWl0IHN0cmF0ZWd5LnJlcGxhY2VQYXNzd29yZCgnYXRvbS1naXRodWInLCBhY2NvdW50LCB0b2tlbik7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZVRva2VuKGFjY291bnQpIHtcbiAgICBjb25zdCBzdHJhdGVneSA9IGF3YWl0IHRoaXMuZ2V0U3RyYXRlZ3koKTtcbiAgICBhd2FpdCBzdHJhdGVneS5kZWxldGVQYXNzd29yZCgnYXRvbS1naXRodWInLCBhY2NvdW50KTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgYXN5bmMgZ2V0U2NvcGVzKGhvc3QsIHRva2VuKSB7XG4gICAgaWYgKGF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICBpZiAodG9rZW4gPT09ICdnb29kLXRva2VuJykge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5SRVFVSVJFRF9TQ09QRVM7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdCB0byBjaGVjayB0b2tlbiBzY29wZXMgaW4gc3BlY3MnKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaG9zdCwge1xuICAgICAgICBtZXRob2Q6ICdIRUFEJyxcbiAgICAgICAgaGVhZGVyczoge0F1dGhvcml6YXRpb246IGBiZWFyZXIgJHt0b2tlbn1gfSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUubmV0d29yayA9IHRydWU7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgcmV0dXJuIFVOQVVUSE9SSVpFRDtcbiAgICB9XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoYFVuYWJsZSB0byBjaGVjayB0b2tlbiBmb3IgT0F1dGggc2NvcGVzIGFnYWluc3QgJHtob3N0fWApO1xuICAgICAgZS5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgZS5yZXNwb25zZVRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZS5oZWFkZXJzLmdldCgnWC1PQXV0aC1TY29wZXMnKS5zcGxpdCgvXFxzKixcXHMqLyk7XG4gIH1cblxuICBkaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKTtcbiAgfVxuXG4gIG9uRGlkVXBkYXRlKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNiKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFBc0c7QUFBQTtBQUFBO0FBQUE7QUFFdEcsSUFBSUEsUUFBUSxHQUFHLElBQUk7QUFFSixNQUFNQyxnQkFBZ0IsQ0FBQztFQUNwQztFQUNBOztFQUdBLE9BQU9DLEdBQUcsR0FBRztJQUNYLElBQUksQ0FBQ0YsUUFBUSxFQUFFO01BQ2JBLFFBQVEsR0FBRyxJQUFJQyxnQkFBZ0IsRUFBRTtJQUNuQztJQUNBLE9BQU9ELFFBQVE7RUFDakI7RUFFQUcsV0FBVyxDQUFDQyxRQUFRLEVBQUU7SUFDcEIsSUFBSSxDQUFDQyxTQUFTLEdBQUdELFFBQVE7SUFDekIsSUFBSSxDQUFDRSxTQUFTLEdBQUcsSUFBSTtJQUNyQixJQUFJLENBQUNDLE9BQU8sR0FBRyxJQUFJQyxpQkFBTyxFQUFFO0lB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