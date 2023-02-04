"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommitView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareCommitView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "openCommitDetailItem", () => this.props.openCommit({
      sha: this.props.commit.sha
    }));
  }
  authoredByCommitter(commit) {
    if (commit.authoredByCommitter) {
      return true;
    }
    // If you commit on GitHub online the committer details would be:
    //
    //    name: "GitHub"
    //    email: "noreply@github.com"
    //    user: null
    //
    if (commit.committer.email === 'noreply@github.com') {
      return true;
    }
    if (commit.committer.name === 'GitHub' && commit.committer.user === null) {
      return true;
    }
    return false;
  }
  renderCommitter(commit) {
    if (!this.authoredByCommitter(commit)) {
      return _react.default.createElement("img", {
        className: "author-avatar",
        alt: "author's avatar",
        src: commit.committer.avatarUrl,
        title: commit.committer.user ? commit.committer.user.login : commit.committer.name
      });
    } else {
      return null;
    }
  }
  render() {
    const commit = this.props.commit;
    return _react.default.createElement("div", {
      className: "commit"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "git-commit"
    }), _react.default.createElement("span", {
      className: "commit-author"
    }, _react.default.createElement("img", {
      className: "author-avatar",
      alt: "author's avatar",
      src: commit.author.avatarUrl,
      title: commit.author.user ? commit.author.user.login : commit.author.name
    }), this.renderCommitter(commit)), _react.default.createElement("p", {
      className: "commit-message-headline"
    }, this.props.onBranch ? _react.default.createElement("button", {
      className: "open-commit-detail-button",
      title: commit.message,
      dangerouslySetInnerHTML: {
        __html: commit.messageHeadlineHTML
      },
      onClick: this.openCommitDetailItem
    }) : _react.default.createElement("span", {
      title: commit.message,
      dangerouslySetInnerHTML: {
        __html: commit.messageHeadlineHTML
      }
    })), _react.default.createElement("a", {
      className: "commit-sha",
      href: commit.commitUrl
    }, commit.sha.slice(0, 8)));
  }
}
exports.BareCommitView = BareCommitView;
_defineProperty(BareCommitView, "propTypes", {
  commit: _propTypes.default.object.isRequired,
  onBranch: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareCommitView, {
  commit: function () {
    const node = require("./__generated__/commitView_commit.graphql");
    if (node.hash && node.hash !== "9d2823ee95f39173f656043ddfc8d47c") {
      console.error("The definition of 'commitView_commit' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/commitView_commit.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ29tbWl0VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicHJvcHMiLCJvcGVuQ29tbWl0Iiwic2hhIiwiY29tbWl0IiwiYXV0aG9yZWRCeUNvbW1pdHRlciIsImNvbW1pdHRlciIsImVtYWlsIiwibmFtZSIsInVzZXIiLCJyZW5kZXJDb21taXR0ZXIiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInJlbmRlciIsImF1dGhvciIsIm9uQnJhbmNoIiwibWVzc2FnZSIsIl9faHRtbCIsIm1lc3NhZ2VIZWFkbGluZUhUTUwiLCJvcGVuQ29tbWl0RGV0YWlsSXRlbSIsImNvbW1pdFVybCIsInNsaWNlIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiXSwic291cmNlcyI6WyJjb21taXQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcblxuZXhwb3J0IGNsYXNzIEJhcmVDb21taXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBvbkJyYW5jaDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgYXV0aG9yZWRCeUNvbW1pdHRlcihjb21taXQpIHtcbiAgICBpZiAoY29tbWl0LmF1dGhvcmVkQnlDb21taXR0ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBJZiB5b3UgY29tbWl0IG9uIEdpdEh1YiBvbmxpbmUgdGhlIGNvbW1pdHRlciBkZXRhaWxzIHdvdWxkIGJlOlxuICAgIC8vXG4gICAgLy8gICAgbmFtZTogXCJHaXRIdWJcIlxuICAgIC8vICAgIGVtYWlsOiBcIm5vcmVwbHlAZ2l0aHViLmNvbVwiXG4gICAgLy8gICAgdXNlcjogbnVsbFxuICAgIC8vXG4gICAgaWYgKGNvbW1pdC5jb21taXR0ZXIuZW1haWwgPT09ICdub3JlcGx5QGdpdGh1Yi5jb20nKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNvbW1pdC5jb21taXR0ZXIubmFtZSA9PT0gJ0dpdEh1YicgJiYgY29tbWl0LmNvbW1pdHRlci51c2VyID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvcGVuQ29tbWl0RGV0YWlsSXRlbSA9ICgpID0+IHRoaXMucHJvcHMub3BlbkNvbW1pdCh7c2hhOiB0aGlzLnByb3BzLmNvbW1pdC5zaGF9KVxuXG4gIHJlbmRlckNvbW1pdHRlcihjb21taXQpIHtcbiAgICBpZiAoIXRoaXMuYXV0aG9yZWRCeUNvbW1pdHRlcihjb21taXQpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8aW1nXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aG9yLWF2YXRhclwiIGFsdD1cImF1dGhvcidzIGF2YXRhclwiIHNyYz17Y29tbWl0LmNvbW1pdHRlci5hdmF0YXJVcmx9XG4gICAgICAgICAgdGl0bGU9e2NvbW1pdC5jb21taXR0ZXIudXNlciA/IGNvbW1pdC5jb21taXR0ZXIudXNlci5sb2dpbiA6IGNvbW1pdC5jb21taXR0ZXIubmFtZX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb21taXQgPSB0aGlzLnByb3BzLmNvbW1pdDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb21taXRcIj5cbiAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJnaXQtY29tbWl0XCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbWl0LWF1dGhvclwiPlxuICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImF1dGhvci1hdmF0YXJcIiBhbHQ9XCJhdXRob3IncyBhdmF0YXJcIiBzcmM9e2NvbW1pdC5hdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgdGl0bGU9e2NvbW1pdC5hdXRob3IudXNlciA/IGNvbW1pdC5hdXRob3IudXNlci5sb2dpbiA6IGNvbW1pdC5hdXRob3IubmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdHRlcihjb21taXQpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbW1pdC1tZXNzYWdlLWhlYWRsaW5lXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMub25CcmFuY2hcbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwib3Blbi1jb21taXQtZGV0YWlsLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgdGl0bGU9e2NvbW1pdC5tZXNzYWdlfVxuICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBjb21taXQubWVzc2FnZUhlYWRsaW5lSFRNTH19XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5vcGVuQ29tbWl0RGV0YWlsSXRlbX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHRpdGxlPXtjb21taXQubWVzc2FnZX1cbiAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogY29tbWl0Lm1lc3NhZ2VIZWFkbGluZUhUTUx9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgPC9wPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJjb21taXQtc2hhXCIgaHJlZj17Y29tbWl0LmNvbW1pdFVybH0+e2NvbW1pdC5zaGEuc2xpY2UoMCwgOCl9PC9hPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ29tbWl0Vmlldywge1xuICBjb21taXQ6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY29tbWl0Vmlld19jb21taXQgb24gQ29tbWl0IHtcbiAgICAgIGF1dGhvciB7XG4gICAgICAgIG5hbWUgYXZhdGFyVXJsXG4gICAgICAgIHVzZXIge1xuICAgICAgICAgIGxvZ2luXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbW1pdHRlciB7XG4gICAgICAgIG5hbWUgYXZhdGFyVXJsXG4gICAgICAgIHVzZXIge1xuICAgICAgICAgIGxvZ2luXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF1dGhvcmVkQnlDb21taXR0ZXJcbiAgICAgIHNoYTpvaWQgbWVzc2FnZSBtZXNzYWdlSGVhZGxpbmVIVE1MIGNvbW1pdFVybFxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUF5QztBQUFBO0FBQUE7QUFBQTtBQUVsQyxNQUFNQSxjQUFjLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBQUE7SUFBQTtJQUFBLDhDQTJCM0IsTUFBTSxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsVUFBVSxDQUFDO01BQUNDLEdBQUcsRUFBRSxJQUFJLENBQUNGLEtBQUssQ0FBQ0cs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