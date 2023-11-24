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