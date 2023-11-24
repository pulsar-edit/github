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