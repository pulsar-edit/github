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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    } // If you commit on GitHub online the committer details would be:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXQtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlQ29tbWl0VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicHJvcHMiLCJvcGVuQ29tbWl0Iiwic2hhIiwiY29tbWl0IiwiYXV0aG9yZWRCeUNvbW1pdHRlciIsImNvbW1pdHRlciIsImVtYWlsIiwibmFtZSIsInVzZXIiLCJyZW5kZXJDb21taXR0ZXIiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInJlbmRlciIsImF1dGhvciIsIm9uQnJhbmNoIiwibWVzc2FnZSIsIl9faHRtbCIsIm1lc3NhZ2VIZWFkbGluZUhUTUwiLCJvcGVuQ29tbWl0RGV0YWlsSXRlbSIsImNvbW1pdFVybCIsInNsaWNlIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBQUE7QUFBQTs7QUFBQSxrREEyQjNCLE1BQU0sS0FBS0MsS0FBTCxDQUFXQyxVQUFYLENBQXNCO0FBQUNDLE1BQUFBLEdBQUcsRUFBRSxLQUFLRixLQUFMLENBQVdHLE1BQVgsQ0FBa0JEO0FBQXhCLEtBQXRCLENBM0JxQjtBQUFBOztBQU9sREUsRUFBQUEsbUJBQW1CLENBQUNELE1BQUQsRUFBUztBQUMxQixRQUFJQSxNQUFNLENBQUNDLG1CQUFYLEVBQWdDO0FBQzlCLGFBQU8sSUFBUDtBQUNELEtBSHlCLENBSTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBSUQsTUFBTSxDQUFDRSxTQUFQLENBQWlCQyxLQUFqQixLQUEyQixvQkFBL0IsRUFBcUQ7QUFDbkQsYUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsUUFBSUgsTUFBTSxDQUFDRSxTQUFQLENBQWlCRSxJQUFqQixLQUEwQixRQUExQixJ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cWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNvbW1pdFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uQnJhbmNoOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBhdXRob3JlZEJ5Q29tbWl0dGVyKGNvbW1pdCkge1xuICAgIGlmIChjb21taXQuYXV0aG9yZWRCeUNvbW1pdHRlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIElmIHlvdSBjb21taXQgb24gR2l0SHViIG9ubGluZSB0aGUgY29tbWl0dGVyIGRldGFpbHMgd291bGQgYmU6XG4gICAgLy9cbiAgICAvLyAgICBuYW1lOiBcIkdpdEh1YlwiXG4gICAgLy8gICAgZW1haWw6IFwibm9yZXBseUBnaXRodWIuY29tXCJcbiAgICAvLyAgICB1c2VyOiBudWxsXG4gICAgLy9cbiAgICBpZiAoY29tbWl0LmNvbW1pdHRlci5lbWFpbCA9PT0gJ25vcmVwbHlAZ2l0aHViLmNvbScpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoY29tbWl0LmNvbW1pdHRlci5uYW1lID09PSAnR2l0SHViJyAmJiBjb21taXQuY29tbWl0dGVyLnVzZXIgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG9wZW5Db21taXREZXRhaWxJdGVtID0gKCkgPT4gdGhpcy5wcm9wcy5vcGVuQ29tbWl0KHtzaGE6IHRoaXMucHJvcHMuY29tbWl0LnNoYX0pXG5cbiAgcmVuZGVyQ29tbWl0dGVyKGNvbW1pdCkge1xuICAgIGlmICghdGhpcy5hdXRob3JlZEJ5Q29tbWl0dGVyKGNvbW1pdCkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxpbWdcbiAgICAgICAgICBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgYWx0PVwiYXV0aG9yJ3MgYXZhdGFyXCIgc3JjPXtjb21taXQuY29tbWl0dGVyLmF2YXRhclVybH1cbiAgICAgICAgICB0aXRsZT17Y29tbWl0LmNvbW1pdHRlci51c2VyID8gY29tbWl0LmNvbW1pdHRlci51c2VyLmxvZ2luIDogY29tbWl0LmNvbW1pdHRlci5uYW1lfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvbW1pdCA9IHRoaXMucHJvcHMuY29tbWl0O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1pdFwiPlxuICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cImdpdC1jb21taXRcIiAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21taXQtYXV0aG9yXCI+XG4gICAgICAgICAgPGltZ1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aG9yLWF2YXRhclwiIGFsdD1cImF1dGhvcidzIGF2YXRhclwiIHNyYz17Y29tbWl0LmF1dGhvci5hdmF0YXJVcmx9XG4gICAgICAgICAgICB0aXRsZT17Y29tbWl0LmF1dGhvci51c2VyID8gY29tbWl0LmF1dGhvci51c2VyLmxvZ2luIDogY29tbWl0LmF1dGhvci5uYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29tbWl0dGVyKGNvbW1pdCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29tbWl0LW1lc3NhZ2UtaGVhZGxpbmVcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5vbkJyYW5jaFxuICAgICAgICAgICAgPyAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJvcGVuLWNvbW1pdC1kZXRhaWwtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICB0aXRsZT17Y29tbWl0Lm1lc3NhZ2V9XG4gICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IGNvbW1pdC5tZXNzYWdlSGVhZGxpbmVIVE1MfX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5Db21taXREZXRhaWxJdGVtfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiAoXG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgdGl0bGU9e2NvbW1pdC5tZXNzYWdlfVxuICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBjb21taXQubWVzc2FnZUhlYWRsaW5lSFRNTH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICA8L3A+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cImNvbW1pdC1zaGFcIiBocmVmPXtjb21taXQuY29tbWl0VXJsfT57Y29tbWl0LnNoYS5zbGljZSgwLCA4KX08L2E+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDb21taXRWaWV3LCB7XG4gIGNvbW1pdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBjb21taXRWaWV3X2NvbW1pdCBvbiBDb21taXQge1xuICAgICAgYXV0aG9yIHtcbiAgICAgICAgbmFtZSBhdmF0YXJVcmxcbiAgICAgICAgdXNlciB7XG4gICAgICAgICAgbG9naW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29tbWl0dGVyIHtcbiAgICAgICAgbmFtZSBhdmF0YXJVcmxcbiAgICAgICAgdXNlciB7XG4gICAgICAgICAgbG9naW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXV0aG9yZWRCeUNvbW1pdHRlclxuICAgICAgc2hhOm9pZCBtZXNzYWdlIG1lc3NhZ2VIZWFkbGluZUhUTUwgY29tbWl0VXJsXG4gICAgfVxuICBgLFxufSk7XG4iXX0=