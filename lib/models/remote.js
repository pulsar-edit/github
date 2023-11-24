"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullRemote = exports.default = void 0;

var _endpoint = require("./endpoint");

class Remote {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    const {
      isGithubRepo,
      domain,
      protocol,
      owner,
      repo
    } = githubInfoFromRemote(url);
    this.githubRepo = isGithubRepo;
    this.domain = domain;
    this.protocol = protocol;
    this.owner = owner;
    this.repo = repo;
  }

  getName() {
    return this.name;
  }

  getUrl() {
    return this.url;
  }

  isGithubRepo() {
    return this.githubRepo;
  }

  getProtocol() {
    return this.protocol;
  }

  getDomain() {
    return this.domain;
  }

  getOwner() {
    return this.owner;
  }

  getRepo() {
    return this.repo;
  }

  getNameOr() {
    return this.getName();
  }

  getSlug() {
    if (this.owner === null || this.repo === null) {
      return null;
    }

    return `${this.owner}/${this.repo}`;
  }

  getEndpoint() {
    return this.domain === null ? null : (0, _endpoint.getEndpoint)(this.domain);
  }

  getEndpointOrDotcom() {
    return this.getEndpoint() || _endpoint.DOTCOM;
  }

  isPresent() {
    return true;
  }

}

exports.default = Remote;

function githubInfoFromRemote(remoteUrl) {
  if (!remoteUrl) {
    return {
      isGithubRepo: false,
      domain: null,
      owner: null,
      repo: null
    };
  } //             proto         login   domain           owner    repo


  const regex = /(?:(.+):\/\/)?(?:.+@)?(github\.com)[:/]\/?([^/]+)\/(.+)/;
  const match = remoteUrl.match(regex);

  if (match) {
    return {
      isGithubRepo: true,
      protocol: match[1] || 'ssh',
      domain: match[2],
      owner: match[3],
      repo: match[4].replace(/\.git$/, '')
    };
  } else {
    return {
      isGithubRepo: false,
      protocol: null,
      domain: null,
      owner: null,
      repo: null
    };
  }
}

const nullRemote = {
  getName() {
    return '';
  },

  getUrl() {
    return '';
  },

  isGithubRepo() {
    return false;
  },

  getDomain() {
    return null;
  },

  getProtocol() {
    return null;
  },

  getOwner() {
    return null;
  },

  getRepo() {
    return null;
  },

  getNameOr(fallback) {
    return fallback;
  },

  getSlug() {
    return null;
  },

  getEndpoint() {
    return null;
  },

  getEndpointOrDotcom() {
    return _endpoint.DOTCOM;
  },

  isPresent() {
    return false;
  }

};
exports.nullRemote = nullRemote;