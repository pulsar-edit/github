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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ29tbWl0c1ZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlbmRlclN1bW1hcnkiLCJyZW5kZXJDb21taXRzIiwicHJvcHMiLCJub2RlcyIsImxlbmd0aCIsIm5hbWVzU3RyaW5nIiwiY2FsY3VsYXRlTmFtZXMiLCJnZXRDb21taXRzIiwibWFwIiwiY29tbWl0IiwiaWQiLCJvbkJyYW5jaCIsIm9wZW5Db21taXQiLCJuIiwiY29tbWl0cyIsIm5hbWVzIiwiU2V0IiwiZm9yRWFjaCIsIm5hbWUiLCJhdXRob3IiLCJ1c2VyIiwibG9naW4iLCJoYXMiLCJhZGQiLCJBcnJheSIsImZyb20iLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiYm9vbCIsImZ1bmMiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciJdLCJzb3VyY2VzIjpbImNvbW1pdHMtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBDb21taXRWaWV3IGZyb20gJy4vY29tbWl0LXZpZXcnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNvbW1pdHNWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBub2RlczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBjb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgYXV0aG9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIHVzZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICApLmlzUmVxdWlyZWQsXG4gICAgb25CcmFuY2g6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aW1lbGluZS1pdGVtIGNvbW1pdHNcIj5cbiAgICAgICAge3RoaXMucmVuZGVyU3VtbWFyeSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb21taXRzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU3VtbWFyeSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5ub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBuYW1lc1N0cmluZyA9IHRoaXMuY2FsY3VsYXRlTmFtZXModGhpcy5nZXRDb21taXRzKCkpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvLXJvd1wiPlxuICAgICAgICAgIDxPY3RpY29uIGNsYXNzTmFtZT1cInByZS10aW1lbGluZS1pdGVtLWljb25cIiBpY29uPVwicmVwby1wdXNoXCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tZW50LW1lc3NhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICB7bmFtZXNTdHJpbmd9IGFkZGVkIHNvbWUgY29tbWl0cy4uLlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb21taXRzKCkge1xuICAgIHJldHVybiB0aGlzLmdldENvbW1pdHMoKS5tYXAoY29tbWl0ID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21taXRWaWV3IGtleT17Y29tbWl0LmlkfVxuICAgICAgICAgIGNvbW1pdD17Y29tbWl0fVxuICAgICAgICAgIG9uQnJhbmNoPXt0aGlzLnByb3BzLm9uQnJhbmNofVxuICAgICAgICAgIG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDb21taXRzKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLm5vZGVzLm1hcChuID0+IG4uY29tbWl0KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZU5hbWVzKGNvbW1pdHMpIHtcbiAgICBsZXQgbmFtZXMgPSBuZXcgU2V0KCk7XG4gICAgY29tbWl0cy5mb3JFYWNoKGNvbW1pdCA9PiB7XG4gICAgICBsZXQgbmFtZSA9IG51bGw7XG4gICAgICBpZiAoY29tbWl0LmF1dGhvci51c2VyKSB7XG4gICAgICAgIG5hbWUgPSBjb21taXQuYXV0aG9yLnVzZXIubG9naW47XG4gICAgICB9IGVsc2UgaWYgKGNvbW1pdC5hdXRob3IubmFtZSkge1xuICAgICAgICBuYW1lID0gY29tbWl0LmF1dGhvci5uYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAobmFtZSAmJiAhbmFtZXMuaGFzKG5hbWUpKSB7XG4gICAgICAgIG5hbWVzLmFkZChuYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG5hbWVzID0gQXJyYXkuZnJvbShuYW1lcyk7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIG5hbWVzWzBdO1xuICAgIH0gZWxzZSBpZiAobmFtZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gYCR7bmFtZXNbMF19IGFuZCAke25hbWVzWzFdfWA7XG4gICAgfSBlbHNlIGlmIChuYW1lcy5sZW5ndGggPiAyKSB7XG4gICAgICByZXR1cm4gYCR7bmFtZXNbMF19LCAke25hbWVzWzFdfSwgYW5kIG90aGVyc2A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnU29tZW9uZSc7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDb21taXRzVmlldywge1xuICBub2RlczogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBjb21taXRzVmlld19ub2RlcyBvbiBQdWxsUmVxdWVzdENvbW1pdCBAcmVsYXkocGx1cmFsOiB0cnVlKSB7XG4gICAgICBjb21taXQge1xuICAgICAgICBpZCBhdXRob3IgeyBuYW1lIHVzZXIgeyBsb2dpbiB9IH1cbiAgICAgICAgLi4uY29tbWl0Vmlld19jb21taXRcbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUF1QztBQUFBO0FBQUE7QUFBQTtBQUVoQyxNQUFNQSxlQUFlLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBa0JuREMsTUFBTSxHQUFHO0lBQ1AsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUF1QixHQUNuQyxJQUFJLENBQUNDLGFBQWEsRUFBRSxFQUNwQixJQUFJLENBQUNDLGFBQWEsRUFBRSxDQUNqQjtFQUVWO0VBRUFELGFBQWEsR0FBRztJQUNkLElBQUksSUFBSSxDQUFDRSxLQUFLLENBQUNDLEtBQUssQ0FBQ0MsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUMvQixNQUFNQyxXQUFXLEdBQUcsSUFBSSxDQUFDQyxjQUFjLENBQUMsSUFBSSxDQUFDQyxVQUFVLEVBQUUsQ0FBQztNQUMxRCxPQUNFO1FBQUssU0FBUyxFQUFDO01BQVUsR0FDdkIsNkJBQUMsZ0JBQU87UUFBQyxTQUFTLEVBQUMsd0JBQXdCO1FBQUMsSUFBSSxFQUFDO01BQVcsRUFBRyxFQUMvRDtRQUFNLFNBQVMsRUFBQztNQUF3QixHQUNyQ0YsV0FBVywyQkFDUCxDQUNIO0lBRVYsQ0FBQyxNQUFNO01BQ0wsT0FBTyxJQUFJO0lBQ2I7RUFDRjtFQUVBSixhQUFhLEdBQUc7SUFDZCxPQUFPLElBQUksQ0FBQ00sVUFBVSxFQUFFLENBQUNDLEdBQUcsQ0FBQ0MsTUFBTSxJQUFJO01BQ3JDLE9BQ0UsNkJBQUMsbUJBQVU7UUFBQyxHQUFHLEVBQUVBLE1BQU0sQ0FBQ0MsRUFBRztRQUN6QixNQUFNLEVBQUVELE1BQU87UUFDZixRQUFRLEVBQUUsSUFBSSxDQUFDUCxLQUFLLENBQUNTLFFBQVM7UUFDOUIsVUFBVSxFQUFFLElBQUksQ0FBQ1QsS0FBSyxDQUFDVTtNQUFXLEVBQ2xDO0lBRU4sQ0FBQyxDQUFDO0VBQ0o7RUFFQUwsVUFBVSxHQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUNMLEtBQUssQ0FBQ0MsS0FBSyxDQUFDSyxHQUFHLENBQUNLLENBQUMsSUFBSUEsQ0FBQyxDQUFDSixNQUFNLENBQUM7RUFDNUM7RUFFQUgsY0FBYyxDQUFDUSxPQUFPLEVBQUU7SUFDdEIsSUFBSUMsS0FBSyxHQUFHLElBQUlDLEdBQUcsRUFBRTtJQUNyQkYsT0FBTyxDQUFDRyxPQUFPLENBQUNSLE1BQU0sSUFBSTtNQUN4QixJQUFJUyxJQUFJLEdBQUcsSUFBSTtNQUNmLElBQUlULE1BQU0sQ0FBQ1UsTUFBTSxDQUFDQyxJQUFJLEVBQUU7UUFDdEJGLElBQUksR0FBR1QsTUFBTSxDQUFDVSxNQUFNLENBQUNDLElBQUksQ0FBQ0MsS0FBSztNQUNqQyxDQUFDLE1BQU0sSUFBSVosTUFBTSxDQUFDVSxNQUFNLENBQUNELElBQUksRUFBRTtRQUM3QkEsSUFBSSxHQUFHVCxNQUFNLENBQUNVLE1BQU0sQ0FBQ0QsSUFBSTtNQUMzQjtNQUVBLElBQUlBLElBQUksSUFBSSxDQUFDSCxLQUFLLENBQUNPLEdBQUcsQ0FBQ0osSUFBSSxDQUFDLEVBQUU7UUFDNUJILEtBQUssQ0FBQ1EsR0FBRyxDQUFDTCxJQUFJLENBQUM7TUFDakI7SUFDRixDQUFDLENBQUM7SUFFRkgsS0FBSyxHQUFHUyxLQUFLLENBQUNDLElBQUksQ0FBQ1YsS0FBSyxDQUFDO0lBQ3pCLElBQUlBLEtBQUssQ0FBQ1gsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUN0QixPQUFPVyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUMsTUFBTSxJQUFJQSxLQUFLLENBQUNYLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDN0IsT0FBUSxHQUFFVyxLQUFLLENBQUMsQ0FBQyxDQUFFLFFBQU9BLEtBQUssQ0FBQyxDQUFDLENBQUUsRUFBQztJQUN0QyxDQUFDLE1BQU0sSUFBSUEsS0FBSyxDQUFDWCxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQzNCLE9BQVEsR0FBRVcsS0FBSyxDQUFDLENBQUMsQ0FBRSxLQUFJQSxLQUFLLENBQUMsQ0FBQyxDQUFFLGNBQWE7SUFDL0MsQ0FBQyxNQUFNO01BQ0wsT0FBTyxTQUFTO0lBQ2xCO0VBQ0Y7QUFDRjtBQUFDO0FBQUEsZ0JBckZZbkIsZUFBZSxlQUNQO0VBQ2pCTyxLQUFLLEVBQUV1QixrQkFBUyxDQUFDQyxPQUFPLENBQ3RCRCxrQkFBUyxDQUFDRSxLQUFLLENBQUM7SUFDZG5CLE1BQU0sRUFBRWlCLGtCQUFTLENBQUNFLEtBQUssQ0FBQztNQUN0QlQsTUFBTSxFQUFFTyxrQkFBUyxDQUFDRSxLQUFLLENBQUM7UUFDdEJWLElBQUksRUFBRVEsa0JBQVMsQ0FBQ0csTUFBTTtRQUN0QlQsSUFBSSxFQUFFTSxrQkFBUyxDQUFDRSxLQUFLLENBQUM7VUFDcEJQLEtBQUssRUFBRUssa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQztRQUMxQixDQUFDO01BQ0gsQ0FBQyxDQUFDLENBQUNBO0lBQ0wsQ0FBQyxDQUFDLENBQUNBO0VBQ0wsQ0FBQyxDQUFDLENBQUNBLFVBQVUsQ0FDZCxDQUFDQSxVQUFVO0VBQ1puQixRQUFRLEVBQUVlLGtCQUFTLENBQUNLLElBQUksQ0FBQ0QsVUFBVTtFQUNuQ2xCLFVBQVUsRUFBRWMsa0JBQVMsQ0FBQ00sSUFBSSxDQUFDRjtBQUM3QixDQUFDO0FBQUEsZUF1RVksSUFBQUcsbUNBQXVCLEVBQUNyQyxlQUFlLEVBQUU7RUFDdERPLEtBQUs7SUFBQTtJQUFBO01BQUE7SUFBQTtJQUFBO0VBQUE7QUFRUCxDQUFDLENBQUM7QUFBQSJ9