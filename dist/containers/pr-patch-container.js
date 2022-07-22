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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL3ByLXBhdGNoLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJQdWxsUmVxdWVzdFBhdGNoQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJtdWx0aUZpbGVQYXRjaCIsImVycm9yIiwibGFzdCIsInVybCIsInBhdGNoIiwiZXRhZyIsImNvbXBvbmVudERpZE1vdW50IiwibW91bnRlZCIsImZldGNoRGlmZiIsInN0YXRlIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiZXhwbGljaXRSZWZldGNoIiwicHJvcHMiLCJyZWZldGNoIiwicmVxdWVzdGVkVVJMQ2hhbmdlIiwiZ2V0RGlmZlVSTCIsInNldFN0YXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW5kZXIiLCJjaGlsZHJlbiIsImVuZHBvaW50IiwiZ2V0UmVzdFVSSSIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsImJ1aWxkUGF0Y2giLCJyYXdEaWZmIiwiZmlsdGVyZWQiLCJyZW1vdmVkIiwiZGlmZnMiLCJtYXAiLCJkaWZmIiwibmV3UGF0aCIsInJlcGxhY2UiLCJvbGRQYXRoIiwib3B0aW9ucyIsInByZXNlcnZlT3JpZ2luYWwiLCJsYXJnZURpZmZUaHJlc2hvbGQiLCJtZnAiLCJyZXNwb25zZSIsImhlYWRlcnMiLCJBY2NlcHQiLCJBdXRob3JpemF0aW9uIiwidG9rZW4iLCJmZXRjaCIsImVyciIsInJlcG9ydERpZmZFcnJvciIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9rIiwic3RhdHVzVGV4dCIsImdldCIsInRleHQiLCJjb25zb2xlIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIkVuZHBvaW50UHJvcFR5cGUiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEs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WUMsT0FBTyxJQUFJO0FBQzVCLFVBQUlsRCxLQUFKLEVBQVc7QUFDVDtBQUNBdUQsUUFBQUEsT0FBTyxDQUFDdkQsS0FBUixDQUFjQSxLQUFkO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDLEtBQUtNLE9BQVYsRUFBbUI7QUFDakI0QyxRQUFBQSxPQUFPO0FBQ1A7QUFDRDs7QUFFRCxXQUFLbEMsUUFBTCxDQUFjO0FBQUNoQixRQUFBQSxLQUFLLEVBQUUrQztBQUFSLE9BQWQsRUFBZ0NHLE9BQWhDO0FBQ0QsS0FaTSxDQUFQO0FBYUQ7O0FBMUpvRTs7OztnQkFBbER0RCx5QixlQUNBO0FBQ2pCO0FBQ0EwQixFQUFBQSxLQUFLLEVBQUVrQyxtQkFBVUMsTUFBVixDQUFpQkMsVUFGUDtBQUdqQm5DLEVBQUFBLElBQUksRUFBRWlDLG1CQUFVQyxNQUFWLENBQWlCQyxVQUhOO0FBSWpCbEMsRUFBQUEsTUFBTSxFQUFFZ0MsbUJBQVVoQyxNQUFWLENBQWlCa0MsVUFKUjtBQU1qQjtBQUNBdEMsRUFBQUEsUUFBUSxFQUFFdUMsNkJBQWlCRCxVQVBWO0FBUWpCZixFQUFBQSxLQUFLLEVBQUVhLG1CQUFVQyxNQUFWLENBQWlCQyxVQVJQO0FBVWpCO0FBQ0E3QyxFQUFBQSxPQUFPLEVBQUUyQyxtQkFBVUksSUFYRjtBQVlqQnZCLEVBQUFBLGtCQUFrQixFQUFFbUIsbUJBQVVoQyxNQVpiO0FBY2pCO0FBQ0FMLEVBQUFBLFFBQVEsRUFBRXFDLG1CQUFVSyxJQUFWLENBQWVIO0FBZlIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtwYXJzZSBhcyBwYXJzZURpZmZ9IGZyb20gJ3doYXQtdGhlLWRpZmYnO1xuXG5pbXBvcnQge3RvTmF0aXZlUGF0aFNlcH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge0VuZHBvaW50UHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtmaWx0ZXIgYXMgZmlsdGVyRGlmZn0gZnJvbSAnLi4vbW9kZWxzL3BhdGNoL2ZpbHRlcic7XG5pbXBvcnQge2J1aWxkTXVsdGlGaWxlUGF0Y2h9IGZyb20gJy4uL21vZGVscy9wYXRjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1bGxSZXF1ZXN0UGF0Y2hDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFB1bGwgcmVxdWVzdCBwcm9wZXJ0aWVzXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBDb25uZWN0aW9uIHByb3BlcnRpZXNcbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHRva2VuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBGZXRjaGluZyBhbmQgcGFyc2luZ1xuICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5ib29sLFxuICAgIGxhcmdlRGlmZlRocmVzaG9sZDogUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoZXJyb3Igb3IgbnVsbCwgbXVsdGlGaWxlUGF0Y2ggb3IgbnVsbClcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIG11bHRpRmlsZVBhdGNoOiBudWxsLFxuICAgIGVycm9yOiBudWxsLFxuICAgIGxhc3Q6IHt1cmw6IG51bGwsIHBhdGNoOiBudWxsLCBldGFnOiBudWxsfSxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMubW91bnRlZCA9IHRydWU7XG4gICAgdGhpcy5mZXRjaERpZmYodGhpcy5zdGF0ZS5sYXN0KTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCBleHBsaWNpdFJlZmV0Y2ggPSB0aGlzLnByb3BzLnJlZmV0Y2ggJiYgIXByZXZQcm9wcy5yZWZldGNoO1xuICAgIGNvbnN0IHJlcXVlc3RlZFVSTENoYW5nZSA9IHRoaXMuc3RhdGUubGFzdC51cmwgIT09IHRoaXMuZ2V0RGlmZlVSTCgpO1xuXG4gICAgaWYgKGV4cGxpY2l0UmVmZXRjaCB8fCByZXF1ZXN0ZWRVUkxDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IHtsYXN0fSA9IHRoaXMuc3RhdGU7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXVsdGlGaWxlUGF0Y2g6IG51bGwsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICBsYXN0OiB7dXJsOiB0aGlzLmdldERpZmZVUkwoKSwgcGF0Y2g6IG51bGwsIGV0YWc6IG51bGx9LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmZldGNoRGlmZihsYXN0KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmVycm9yLCB0aGlzLnN0YXRlLm11bHRpRmlsZVBhdGNoKTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRlIGEgdjMgR2l0SHViIEFQSSBSRVNUIFVSTCBmb3IgdGhlIHB1bGwgcmVxdWVzdCByZXNvdXJjZS5cbiAgLy8gRXhhbXBsZTogaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9hdG9tL2dpdGh1Yi9wdWxscy8xODI5XG4gIGdldERpZmZVUkwoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZW5kcG9pbnQuZ2V0UmVzdFVSSSgncmVwb3MnLCB0aGlzLnByb3BzLm93bmVyLCB0aGlzLnByb3BzLnJlcG8sICdwdWxscycsIHRoaXMucHJvcHMubnVtYmVyKTtcbiAgfVxuXG4gIGJ1aWxkUGF0Y2gocmF3RGlmZikge1xuICAgIGNvbnN0IHtmaWx0ZXJlZCwgcmVtb3ZlZH0gPSBmaWx0ZXJEaWZmKHJhd0RpZmYpO1xuICAgIGNvbnN0IGRpZmZzID0gcGFyc2VEaWZmKGZpbHRlcmVkKS5tYXAoZGlmZiA9PiB7XG4gICAgLy8gZGlmZiBjb21pbmcgZnJvbSBBUEkgd2lsbCBoYXZlIHRoZSBkZWZhdWwgZ2l0IGRpZmYgcHJlZml4ZXMgYS8gYW5kIGIvIGFuZCB1c2UgKm5peC1zdHlsZSAvIHBhdGggc2VwYXJhdG9ycy5cbiAgICAvLyBlLmcuIGEvZGlyL2ZpbGUxLmpzIGFuZCBiL2Rpci9maWxlMi5qc1xuICAgIC8vIHNlZSBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWRpZmYjX2dlbmVyYXRpbmdfcGF0Y2hlc193aXRoX3BcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRpZmYsXG4gICAgICAgIG5ld1BhdGg6IGRpZmYubmV3UGF0aCA/IHRvTmF0aXZlUGF0aFNlcChkaWZmLm5ld1BhdGgucmVwbGFjZSgvXlthfGJdXFwvLywgJycpKSA6IGRpZmYubmV3UGF0aCxcbiAgICAgICAgb2xkUGF0aDogZGlmZi5vbGRQYXRoID8gdG9OYXRpdmVQYXRoU2VwKGRpZmYub2xkUGF0aC5yZXBsYWNlKC9eW2F8Yl1cXC8vLCAnJykpIDogZGlmZi5vbGRQYXRoLFxuICAgICAgfTtcbiAgICB9KTtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgcHJlc2VydmVPcmlnaW5hbDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQsXG4gICAgfTtcbiAgICBpZiAodGhpcy5wcm9wcy5sYXJnZURpZmZUaHJlc2hvbGQpIHtcbiAgICAgIG9wdGlvbnMubGFyZ2VEaWZmVGhyZXNob2xkID0gdGhpcy5wcm9wcy5sYXJnZURpZmZUaHJlc2hvbGQ7XG4gICAgfVxuICAgIGNvbnN0IG1mcCA9IGJ1aWxkTXVsdGlGaWxlUGF0Y2goZGlmZnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtZnA7XG4gIH1cblxuICBhc3luYyBmZXRjaERpZmYobGFzdCkge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0RGlmZlVSTCgpO1xuICAgIGxldCByZXNwb25zZTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzLmRpZmYnLFxuICAgICAgICBBdXRob3JpemF0aW9uOiBgYmVhcmVyICR7dGhpcy5wcm9wcy50b2tlbn1gLFxuICAgICAgfTtcblxuICAgICAgaWYgKHVybCA9PT0gbGFzdC51cmwgJiYgbGFzdC5ldGFnICE9PSBudWxsKSB7XG4gICAgICAgIGhlYWRlcnNbJ0lmLU5vbmUtTWF0Y2gnXSA9IGxhc3QuZXRhZztcbiAgICAgIH1cblxuICAgICAgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtoZWFkZXJzfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnREaWZmRXJyb3IoYE5ldHdvcmsgZXJyb3IgZW5jb3VudGVyZWQgZmV0Y2hpbmcgdGhlIHBhdGNoOiAke2Vyci5tZXNzYWdlfS5gLCBlcnIpO1xuICAgIH1cblxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDMwNCkge1xuICAgICAgLy8gTm90IG1vZGlmaWVkLlxuICAgICAgaWYgKCF0aGlzLm1vdW50ZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtdWx0aUZpbGVQYXRjaDogbGFzdC5wYXRjaCxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgIGxhc3QsXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0RGlmZkVycm9yKGBVbmFibGUgdG8gZmV0Y2ggdGhlIGRpZmYgZm9yIHRoaXMgcHVsbCByZXF1ZXN0OiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9LmApO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBldGFnID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0VUYWcnKTtcbiAgICAgIGNvbnN0IHJhd0RpZmYgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBpZiAoIXRoaXMubW91bnRlZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbXVsdGlGaWxlUGF0Y2ggPSB0aGlzLmJ1aWxkUGF0Y2gocmF3RGlmZik7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbXVsdGlGaWxlUGF0Y2gsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICBsYXN0OiB7dXJsLCBwYXRjaDogbXVsdGlGaWxlUGF0Y2gsIGV0YWd9LFxuICAgICAgfSwgcmVzb2x2ZSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0RGlmZkVycm9yKCdVbmFibGUgdG8gcGFyc2UgdGhlIGRpZmYgZm9yIHRoaXMgcHVsbCByZXF1ZXN0LicsIGVycik7XG4gICAgfVxuICB9XG5cbiAgcmVwb3J0RGlmZkVycm9yKG1lc3NhZ2UsIGVycm9yKSB7XG4gICAgaWYgKCF0aGlzLm1vdW50ZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm1vdW50ZWQpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiBtZXNzYWdlfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==