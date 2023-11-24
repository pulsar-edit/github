"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moment = _interopRequireDefault(require("moment"));

var _classnames = _interopRequireDefault(require("classnames"));

var _nodeEmoji = require("node-emoji");

var _commands = _interopRequireWildcard(require("../atom/commands"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _commitView = _interopRequireDefault(require("./commit-view"));

var _timeago = _interopRequireDefault(require("./timeago"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RecentCommitView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "copyCommitSha", event => {
      event.stopPropagation();
      const {
        commit,
        clipboard
      } = this.props;
      clipboard.write(commit.sha);
    });

    _defineProperty(this, "copyCommitSubject", event => {
      event.stopPropagation();
      const {
        commit,
        clipboard
      } = this.props;
      clipboard.write(commit.messageSubject);
    });

    _defineProperty(this, "undoLastCommit", event => {
      event.stopPropagation();
      this.props.undoLastCommit();
    });

    this.refRoot = new _refHolder.default();
  }

  componentDidMount() {
    if (this.props.isSelected) {
      this.refRoot.map(root => root.scrollIntoViewIfNeeded(false));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isSelected && !prevProps.isSelected) {
      this.refRoot.map(root => root.scrollIntoViewIfNeeded(false));
    }
  }

  render() {
    const authorMoment = (0, _moment.default)(this.props.commit.getAuthorDate() * 1000);
    const fullMessage = this.props.commit.getFullMessage();
    return _react.default.createElement("li", {
      ref: this.refRoot.setter,
      className: (0, _classnames.default)('github-RecentCommit', {
        'most-recent': this.props.isMostRecent,
        'is-selected': this.props.isSelected
      }),
      onClick: this.props.openCommit
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, _react.default.createElement(_commands.Command, {
      command: "github:copy-commit-sha",
      callback: this.copyCommitSha
    }), _react.default.createElement(_commands.Command, {
      command: "github:copy-commit-subject",
      callback: this.copyCommitSubject
    })), this.renderAuthors(), _react.default.createElement("span", {
      className: "github-RecentCommit-message",
      title: (0, _nodeEmoji.emojify)(fullMessage)
    }, (0, _nodeEmoji.emojify)(this.props.commit.getMessageSubject())), this.props.isMostRecent && _react.default.createElement("button", {
      className: "btn github-RecentCommit-undoButton",
      onClick: this.undoLastCommit
    }, "Undo"), _react.default.createElement(_timeago.default, {
      className: "github-RecentCommit-time",
      type: "time",
      displayStyle: "short",
      time: authorMoment,
      title: authorMoment.format('MMM Do, YYYY')
    }));
  }

  renderAuthor(author) {
    const email = author.getEmail();
    const avatarUrl = author.getAvatarUrl();
    return _react.default.createElement("img", {
      className: "github-RecentCommit-avatar",
      key: email,
      src: avatarUrl,
      title: email,
      alt: `${email}'s avatar'`
    });
  }

  renderAuthors() {
    const coAuthors = this.props.commit.getCoAuthors();
    const authors = [this.props.commit.getAuthor(), ...coAuthors];
    return _react.default.createElement("span", {
      className: "github-RecentCommit-authors"
    }, authors.map(this.renderAuthor));
  }

}

_defineProperty(RecentCommitView, "propTypes", {
  commands: _propTypes.default.object.isRequired,
  clipboard: _propTypes.default.object.isRequired,
  commit: _propTypes.default.object.isRequired,
  undoLastCommit: _propTypes.default.func.isRequired,
  isMostRecent: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired,
  isSelected: _propTypes.default.bool.isRequired
});

class RecentCommitsView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "openSelectedCommit", () => this.props.openCommit({
      sha: this.props.selectedCommitSha,
      preserveFocus: false
    }));

    this.refRoot = new _refHolder.default();
  }

  setFocus(focus) {
    if (focus === this.constructor.focus.RECENT_COMMIT) {
      return this.refRoot.map(element => {
        element.focus();
        return true;
      }).getOr(false);
    }

    return false;
  }

  getFocus(element) {
    return this.refRoot.map(e => e.contains(element)).getOr(false) ? this.constructor.focus.RECENT_COMMIT : null;
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-RecentCommits",
      tabIndex: "-1",
      ref: this.refRoot.setter
    }, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, _react.default.createElement(_commands.Command, {
      command: "core:move-down",
      callback: this.props.selectNextCommit
    }), _react.default.createElement(_commands.Command, {
      command: "core:move-up",
      callback: this.props.selectPreviousCommit
    }), _react.default.createElement(_commands.Command, {
      command: "github:dive",
      callback: this.openSelectedCommit
    })), this.renderCommits());
  }

  renderCommits() {
    if (this.props.commits.length === 0) {
      if (this.props.isLoading) {
        return _react.default.createElement("div", {
          className: "github-RecentCommits-message"
        }, "Recent commits");
      } else {
        return _react.default.createElement("div", {
          className: "github-RecentCommits-message"
        }, "Make your first commit");
      }
    } else {
      return _react.default.createElement("ul", {
        className: "github-RecentCommits-list"
      }, this.props.commits.map((commit, i) => {
        return _react.default.createElement(RecentCommitView, {
          key: commit.getSha(),
          commands: this.props.commands,
          clipboard: this.props.clipboard,
          isMostRecent: i === 0,
          commit: commit,
          undoLastCommit: this.props.undoLastCommit,
          openCommit: () => this.props.openCommit({
            sha: commit.getSha(),
            preserveFocus: true
          }),
          isSelected: this.props.selectedCommitSha === commit.getSha()
        });
      }));
    }
  }

  advanceFocusFrom(focus) {
    if (focus === this.constructor.focus.RECENT_COMMIT) {
      return Promise.resolve(this.constructor.focus.RECENT_COMMIT);
    }

    return Promise.resolve(null);
  }

  retreatFocusFrom(focus) {
    if (focus === this.constructor.focus.RECENT_COMMIT) {
      return Promise.resolve(_commitView.default.lastFocus);
    }

    return Promise.resolve(null);
  }

}

exports.default = RecentCommitsView;

_defineProperty(RecentCommitsView, "propTypes", {
  // Model state
  commits: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  selectedCommitSha: _propTypes.default.string.isRequired,
  // Atom environment
  clipboard: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  // Action methods
  undoLastCommit: _propTypes.default.func.isRequired,
  openCommit: _propTypes.default.func.isRequired,
  selectNextCommit: _propTypes.default.func.isRequired,
  selectPreviousCommit: _propTypes.default.func.isRequired
});

_defineProperty(RecentCommitsView, "focus", {
  RECENT_COMMIT: Symbol('recent_commit')
});

_defineProperty(RecentCommitsView, "firstFocus", RecentCommitsView.focus.RECENT_COMMIT);

_defineProperty(RecentCommitsView, "lastFocus", RecentCommitsView.focus.RECENT_COMMIT);