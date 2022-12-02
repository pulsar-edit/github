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
    return _react.default.createElement("div", {
      className: "timeline-item commits"
    }, this.renderSummary(), this.renderCommits());
  }

  renderSummary() {
    if (this.props.nodes.length > 1) {
      const namesString = this.calculateNames(this.getCommits());
      return _react.default.createElement("div", {
        className: "info-row"
      }, _react.default.createElement(_octicon.default, {
        className: "pre-timeline-item-icon",
        icon: "repo-push"
      }), _react.default.createElement("span", {
        className: "comment-message-header"
      }, namesString, " added some commits..."));
    } else {
      return null;
    }
  }

  renderCommits() {
    return this.getCommits().map(commit => {
      return _react.default.createElement(_commitView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXRzLXZpZXcuanMiXSwibmFtZXMiOlsiQmFyZUNvbW1pdHNWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJyZW5kZXJTdW1tYXJ5IiwicmVuZGVyQ29tbWl0cyIsInByb3BzIiwibm9kZXMiLCJsZW5ndGgiLCJuYW1lc1N0cmluZyIsImNhbGN1bGF0ZU5hbWVzIiwiZ2V0Q29tbWl0cyIsIm1hcCIsImNvbW1pdCIsImlkIiwib25CcmFuY2giLCJvcGVuQ29tbWl0IiwibiIsImNvbW1pdHMiLCJuYW1lcyIsIlNldCIsImZvckVhY2giLCJuYW1lIiwiYXV0aG9yIiwidXNlciIsImxvZ2luIiwiaGFzIiwiYWRkIiwiQXJyYXkiLCJmcm9tIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLGVBQU4sU0FBOEJDLGVBQU1DLFNBQXBDLENBQThDO0FBa0JuREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRyxLQUFLQyxhQUFMLEVBREgsRUFFRyxLQUFLQyxhQUFMLEVBRkgsQ0FERjtBQU1EOztBQUVERCxFQUFBQSxhQUFhLEdBQUc7QUFDZCxRQUFJLEtBQUtFLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQkMsTUFBakIsR0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsWUFBTUMsV0FBVyxHQUFHLEtBQUtDLGNBQUwsQ0FBb0IsS0FBS0MsVUFBTCxFQUFwQixDQUFwQjtBQUNBLGFBQ0U7QUFBSyxRQUFBLFNBQVMsRUFBQztBQUFmLFNBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxRQUFBLFNBQVMsRUFBQyx3QkFBbkI7QUFBNEMsUUFBQSxJQUFJLEVBQUM7QUFBakQs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LENBQWVELFVBYlI7QUFjakJsQixFQUFBQSxVQUFVLEVBQUVjLG1CQUFVTSxJQUFWLENBQWVGO0FBZFYsQzs7ZUFzRk4seUNBQXdCbEMsZUFBeEIsRUFBeUM7QUFDdERPLEVBQUFBLEtBQUs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQURpRCxDQUF6QyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uLy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgQ29tbWl0VmlldyBmcm9tICcuL2NvbW1pdC12aWV3JztcblxuZXhwb3J0IGNsYXNzIEJhcmVDb21taXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbm9kZXM6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgY29tbWl0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgIGF1dGhvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICB1c2VyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgKS5pc1JlcXVpcmVkLFxuICAgIG9uQnJhbmNoOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGltZWxpbmUtaXRlbSBjb21taXRzXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlclN1bW1hcnkoKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWl0cygpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclN1bW1hcnkoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgbmFtZXNTdHJpbmcgPSB0aGlzLmNhbGN1bGF0ZU5hbWVzKHRoaXMuZ2V0Q29tbWl0cygpKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1yb3dcIj5cbiAgICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cInJlcG8tcHVzaFwiIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbWVudC1tZXNzYWdlLWhlYWRlclwiPlxuICAgICAgICAgICAge25hbWVzU3RyaW5nfSBhZGRlZCBzb21lIGNvbW1pdHMuLi5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQ29tbWl0cygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21taXRzKCkubWFwKGNvbW1pdCA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tbWl0VmlldyBrZXk9e2NvbW1pdC5pZH1cbiAgICAgICAgICBjb21taXQ9e2NvbW1pdH1cbiAgICAgICAgICBvbkJyYW5jaD17dGhpcy5wcm9wcy5vbkJyYW5jaH1cbiAgICAgICAgICBvcGVuQ29tbWl0PXt0aGlzLnByb3BzLm9wZW5Db21taXR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29tbWl0cygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5ub2Rlcy5tYXAobiA9PiBuLmNvbW1pdCk7XG4gIH1cblxuICBjYWxjdWxhdGVOYW1lcyhjb21taXRzKSB7XG4gICAgbGV0IG5hbWVzID0gbmV3IFNldCgpO1xuICAgIGNvbW1pdHMuZm9yRWFjaChjb21taXQgPT4ge1xuICAgICAgbGV0IG5hbWUgPSBudWxsO1xuICAgICAgaWYgKGNvbW1pdC5hdXRob3IudXNlcikge1xuICAgICAgICBuYW1lID0gY29tbWl0LmF1dGhvci51c2VyLmxvZ2luO1xuICAgICAgfSBlbHNlIGlmIChjb21taXQuYXV0aG9yLm5hbWUpIHtcbiAgICAgICAgbmFtZSA9IGNvbW1pdC5hdXRob3IubmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5hbWUgJiYgIW5hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICBuYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBuYW1lcyA9IEFycmF5LmZyb20obmFtZXMpO1xuICAgIGlmIChuYW1lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBuYW1lc1swXTtcbiAgICB9IGVsc2UgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIGAke25hbWVzWzBdfSBhbmQgJHtuYW1lc1sxXX1gO1xuICAgIH0gZWxzZSBpZiAobmFtZXMubGVuZ3RoID4gMikge1xuICAgICAgcmV0dXJuIGAke25hbWVzWzBdfSwgJHtuYW1lc1sxXX0sIGFuZCBvdGhlcnNgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ1NvbWVvbmUnO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ29tbWl0c1ZpZXcsIHtcbiAgbm9kZXM6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY29tbWl0c1ZpZXdfbm9kZXMgb24gUHVsbFJlcXVlc3RDb21taXQgQHJlbGF5KHBsdXJhbDogdHJ1ZSkge1xuICAgICAgY29tbWl0IHtcbiAgICAgICAgaWQgYXV0aG9yIHsgbmFtZSB1c2VyIHsgbG9naW4gfSB9XG4gICAgICAgIC4uLmNvbW1pdFZpZXdfY29tbWl0XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=