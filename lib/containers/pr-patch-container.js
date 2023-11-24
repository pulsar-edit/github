"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _whatTheDiff = require("what-the-diff");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _filter = require("../models/patch/filter");

var _patch = require("../models/patch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PullRequestPatchContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      multiFilePatch: null,
      error: null,
      last: {
        url: null,
        patch: null,
        etag: null
      }
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.fetchDiff(this.state.last);
  }

  componentDidUpdate(prevProps) {
    const explicitRefetch = this.props.refetch && !prevProps.refetch;
    const requestedURLChange = this.state.last.url !== this.getDiffURL();

    if (explicitRefetch || requestedURLChange) {
      const {
        last
      } = this.state;
      this.setState({
        multiFilePatch: null,
        error: null,
        last: {
          url: this.getDiffURL(),
          patch: null,
          etag: null
        }
      });
      this.fetchDiff(last);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return this.props.children(this.state.error, this.state.multiFilePatch);
  } // Generate a v3 GitHub API REST URL for the pull request resource.
  // Example: https://api.github.com/repos/atom/github/pulls/1829


  getDiffURL() {
    return this.props.endpoint.getRestURI('repos', this.props.owner, this.props.repo, 'pulls', this.props.number);
  }

  buildPatch(rawDiff) {
    const {
      filtered,
      removed
    } = (0, _filter.filter)(rawDiff);
    const diffs = (0, _whatTheDiff.parse)(filtered).map(diff => {
      // diff coming from API will have the defaul git diff prefixes a/ and b/ and use *nix-style / path separators.
      // e.g. a/dir/file1.js and b/dir/file2.js
      // see https://git-scm.com/docs/git-diff#_generating_patches_with_p
      return _objectSpread({}, diff, {
        newPath: diff.newPath ? (0, _helpers.toNativePathSep)(diff.newPath.replace(/^[a|b]\//, '')) : diff.newPath,
        oldPath: diff.oldPath ? (0, _helpers.toNativePathSep)(diff.oldPath.replace(/^[a|b]\//, '')) : diff.oldPath
      });
    });
    const options = {
      preserveOriginal: true,
      removed
    };

    if (this.props.largeDiffThreshold) {
      options.largeDiffThreshold = this.props.largeDiffThreshold;
    }

    const mfp = (0, _patch.buildMultiFilePatch)(diffs, options);
    return mfp;
  }

  async fetchDiff(last) {
    const url = this.getDiffURL();
    let response;

    try {
      const headers = {
        Accept: 'application/vnd.github.v3.diff',
        Authorization: `bearer ${this.props.token}`
      };

      if (url === last.url && last.etag !== null) {
        headers['If-None-Match'] = last.etag;
      }

      response = await fetch(url, {
        headers
      });
    } catch (err) {
      return this.reportDiffError(`Network error encountered fetching the patch: ${err.message}.`, err);
    }

    if (response.status === 304) {
      // Not modified.
      if (!this.mounted) {
        return null;
      }

      return new Promise(resolve => this.setState({
        multiFilePatch: last.patch,
        error: null,
        last
      }));
    }

    if (!response.ok) {
      return this.reportDiffError(`Unable to fetch the diff for this pull request: ${response.statusText}.`);
    }

    try {
      const etag = response.headers.get('ETag');
      const rawDiff = await response.text();

      if (!this.mounted) {
        return null;
      }

      const multiFilePatch = this.buildPatch(rawDiff);
      return new Promise(resolve => this.setState({
        multiFilePatch,
        error: null,
        last: {
          url,
          patch: multiFilePatch,
          etag
        }
      }, resolve));
    } catch (err) {
      return this.reportDiffError('Unable to parse the diff for this pull request.', err);
    }
  }

  reportDiffError(message, error) {
    if (!this.mounted) {
      return null;
    }

    return new Promise(resolve => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      if (!this.mounted) {
        resolve();
        return;
      }

      this.setState({
        error: message
      }, resolve);
    });
  }

}

exports.default = PullRequestPatchContainer;

_defineProperty(PullRequestPatchContainer, "propTypes", {
  // Pull request properties
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  // Connection properties
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes.default.string.isRequired,
  // Fetching and parsing
  refetch: _propTypes.default.bool,
  largeDiffThreshold: _propTypes.default.number,
  // Render prop. Called with (error or null, multiFilePatch or null)
  children: _propTypes.default.func.isRequired
});