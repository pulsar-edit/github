"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndpoint = getEndpoint;
exports.DOTCOM = void 0;

// API endpoint for a GitHub instance, either dotcom or an Enterprise installation.
class Endpoint {
  constructor(host, apiHost, apiRouteParts) {
    this.host = host;
    this.apiHost = apiHost;
    this.apiRoute = apiRouteParts.map(encodeURIComponent).join('/');
  }

  getRestURI(...parts) {
    const sep = parts.length > 0 ? '/' : '';
    return this.getRestRoot() + sep + parts.map(encodeURIComponent).join('/');
  }

  getGraphQLRoot() {
    return this.getRestURI('graphql');
  }

  getRestRoot() {
    const sep = this.apiRoute !== '' ? '/' : '';
    return `https://${this.apiHost}${sep}${this.apiRoute}`;
  }

  getHost() {
    return this.host;
  }

  getLoginAccount() {
    return `https://${this.apiHost}`;
  }

} // API endpoint for GitHub.com


const DOTCOM = new Endpoint('github.com', 'api.github.com', []);
exports.DOTCOM = DOTCOM;

function getEndpoint(host) {
  if (host === 'github.com') {
    return DOTCOM;
  } else {
    return new Endpoint(host, host, ['api', 'v3']);
  }
}