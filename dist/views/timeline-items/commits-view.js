"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommitsView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _commitView = _interopRequireDefault(require("./commit-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCommitsView extends _react.default.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "timeline-item commits"
    }, this.renderSummary(), this.renderCommits());
  }

  renderSummary() {
    if (this.props.nodes.length > 1) {
      const namesString = this.calculateNames(this.getCommits());
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "info-row"
      }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
        className: "pre-timeline-item-icon",
        icon: "repo-push"
      }), /*#__PURE__*/_react.default.createElement("span", {
        className: "comment-message-header"
      }, namesString, " added some commits..."));
    } else {
      return null;
    }
  }

  renderCommits() {
    return this.getCommits().map(commit => {
      return /*#__PURE__*/_react.default.createElement(_commitView.default, {
        key: commit.id,
        commit: commit,
        onBranch: this.props.onBranch,
        openCommit: this.props.openCommit
      });
    });
  }

  getCommits() {
    return this.props.nodes.map(n => n.commit);
  }

  calculateNames(commits) {
    let names = new Set();
    commits.forEach(commit => {
      let name = null;

      if (commit.author.user) {
        name = commit.author.user.login;
      } else if (commit.author.name) {
        name = commit.author.name;
      }

      if (name && !names.has(name)) {
        names.add(name);
      }
    });
    names = Array.from(names);

    if (names.length === 1) {
      return names[0];
    } else if (names.length === 2) {
      return `${names[0]} and ${names[1]}`;
    } else if (names.length > 2) {
      return `${names[0]}, ${names[1]}, and others`;
    } else {
      return 'Someone';
    }
  }

}

exports.BareCommitsView = BareCommitsView;

_defineProperty(BareCommitsView, "propTypes", {
  nodes: _propTypes.default.arrayOf(_propTypes.default.shape({
    commit: _propTypes.default.shape({
      author: _propTypes.default.shape({
        name: _propTypes.default.string,
        user: _propTypes.default.shape({
          login: _propTypes.default.string.isRequired
        })
      }).isRequired
    }).isRequired
  }).isRequired).isRequired,
  onBranch: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCommitsView, {
  nodes: function () {
    const node = require("./__generated__/commitsView_nodes.graphql");

    if (node.hash && node.hash !== "5b2734f1e64af2ad2c9803201a0082f3") {
      console.error("The definition of 'commitsView_nodes' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/commitsView_nodes.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXRzLXZpZXcuanMiXSwibmFtZXMiOlsiQmFyZUNvbW1pdHNWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJyZW5kZXJTdW1tYXJ5IiwicmVuZGVyQ29tbWl0cyIsInByb3BzIiwibm9kZXMiLCJsZW5ndGgiLCJuYW1lc1N0cmluZyIsImNhbGN1bGF0ZU5hbWVzIiwiZ2V0Q29tbWl0cyIsIm1hcCIsImNvbW1pdCIsImlkIiwib25CcmFuY2giLCJvcGVuQ29tbWl0IiwibiIsImNvbW1pdHMiLCJuYW1lcyIsIlNldCIsImZvckVhY2giLCJuYW1lIiwiYXV0aG9yIiwidXNlciIsImxvZ2luIiwiaGFzIiwiYWRkIiwiQXJyYXkiLCJmcm9tIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLGVBQU4sU0FBOEJDLGVBQU1DLFNBQXBDLENBQThDO0FBa0JuREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1Asd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0csS0FBS0MsYUFBTCxFQURILEVBRUcsS0FBS0MsYUFBTCxFQUZILENBREY7QUFNRDs7QUFFREQsRUFBQUEsYUFBYSxHQUFHO0FBQ2QsUUFBSSxLQUFLRSxLQUFMLENBQVdDLEtBQVgsQ0FBaUJDLE1BQWpCLEdBQTBCLENBQTlCLEVBQWlDO0FBQy9CLFlBQU1DLFdBQVcsR0FBRyxLQUFLQyxjQUFMLENBQW9CLEtBQUtDLFVBQUwsRUFBcEIsQ0FBcEI7QUFDQSwwQkFDRTtBQUFLLFFBQUEsU0FBUyxFQUFDO0FBQWYsc0JBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxRQUFBLFNBQVMsRUFBQyx3QkFBbkI7QUFBNEMsUUFBQSxJQUFJLEVBQUM7QUFB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SUFBVixDQUFlRCxVQWJSO0FBY2pCbEIsRUFBQUEsVUFBVSxFQUFFYyxtQkFBVU0sSUFBVixDQUFlRjtBQWRWLEM7O2VBc0ZOLHlDQUF3QmxDLGVBQXhCLEVBQXlDO0FBQ3RETyxFQUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEaUQsQ0FBekMsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IENvbW1pdFZpZXcgZnJvbSAnLi9jb21taXQtdmlldyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ29tbWl0c1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG5vZGVzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICBhdXRob3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgdXNlcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICkuaXNSZXF1aXJlZCxcbiAgICBvbkJyYW5jaDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpbWVsaW5lLWl0ZW0gY29tbWl0c1wiPlxuICAgICAgICB7dGhpcy5yZW5kZXJTdW1tYXJ5KCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdHMoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJTdW1tYXJ5KCkge1xuICAgIGlmICh0aGlzLnByb3BzLm5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IG5hbWVzU3RyaW5nID0gdGhpcy5jYWxjdWxhdGVOYW1lcyh0aGlzLmdldENvbW1pdHMoKSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8tcm93XCI+XG4gICAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJyZXBvLXB1c2hcIiAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1lbnQtbWVzc2FnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgIHtuYW1lc1N0cmluZ30gYWRkZWQgc29tZSBjb21taXRzLi4uXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckNvbW1pdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29tbWl0cygpLm1hcChjb21taXQgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbW1pdFZpZXcga2V5PXtjb21taXQuaWR9XG4gICAgICAgICAgY29tbWl0PXtjb21taXR9XG4gICAgICAgICAgb25CcmFuY2g9e3RoaXMucHJvcHMub25CcmFuY2h9XG4gICAgICAgICAgb3BlbkNvbW1pdD17dGhpcy5wcm9wcy5vcGVuQ29tbWl0fVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbW1pdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubm9kZXMubWFwKG4gPT4gbi5jb21taXQpO1xuICB9XG5cbiAgY2FsY3VsYXRlTmFtZXMoY29tbWl0cykge1xuICAgIGxldCBuYW1lcyA9IG5ldyBTZXQoKTtcbiAgICBjb21taXRzLmZvckVhY2goY29tbWl0ID0+IHtcbiAgICAgIGxldCBuYW1lID0gbnVsbDtcbiAgICAgIGlmIChjb21taXQuYXV0aG9yLnVzZXIpIHtcbiAgICAgICAgbmFtZSA9IGNvbW1pdC5hdXRob3IudXNlci5sb2dpbjtcbiAgICAgIH0gZWxzZSBpZiAoY29tbWl0LmF1dGhvci5uYW1lKSB7XG4gICAgICAgIG5hbWUgPSBjb21taXQuYXV0aG9yLm5hbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuYW1lICYmICFuYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbmFtZXMgPSBBcnJheS5mcm9tKG5hbWVzKTtcbiAgICBpZiAobmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gbmFtZXNbMF07XG4gICAgfSBlbHNlIGlmIChuYW1lcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiBgJHtuYW1lc1swXX0gYW5kICR7bmFtZXNbMV19YDtcbiAgICB9IGVsc2UgaWYgKG5hbWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHJldHVybiBgJHtuYW1lc1swXX0sICR7bmFtZXNbMV19LCBhbmQgb3RoZXJzYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdTb21lb25lJztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUNvbW1pdHNWaWV3LCB7XG4gIG5vZGVzOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNvbW1pdHNWaWV3X25vZGVzIG9uIFB1bGxSZXF1ZXN0Q29tbWl0IEByZWxheShwbHVyYWw6IHRydWUpIHtcbiAgICAgIGNvbW1pdCB7XG4gICAgICAgIGlkIGF1dGhvciB7IG5hbWUgdXNlciB7IGxvZ2luIH0gfVxuICAgICAgICAuLi5jb21taXRWaWV3X2NvbW1pdFxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19