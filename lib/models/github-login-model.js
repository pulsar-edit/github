"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _eventKit = require("event-kit");

var _keytarStrategy = require("../shared/keytar-strategy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
          } // Successfully authenticated and had all required scopes.


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