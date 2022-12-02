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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZWNlbnQtY29tbWl0cy12aWV3LmpzIl0sIm5hbWVzIjpbIlJlY2VudENvbW1pdFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsImNvbW1pdCIsImNsaXBib2FyZCIsIndyaXRlIiwic2hhIiwibWVzc2FnZVN1YmplY3QiLCJ1bmRvTGFzdENvbW1pdCIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJjb21wb25lbnREaWRNb3VudCIsImlzU2VsZWN0ZWQiLCJtYXAiLCJyb290Iiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInJlbmRlciIsImF1dGhvck1vbWVudCIsImdldEF1dGhvckRhdGUiLCJmdWxsTWVzc2FnZSIsImdldEZ1bGxNZXNzYWdlIiwic2V0dGVyIiwiaXNNb3N0UmVjZW50Iiwib3BlbkNvbW1pdCIsImNvbW1hbmRzIiwiY29weUNvbW1pdFNoYSIsImNvcHlDb21taXRTdWJqZWN0IiwicmVuZGVyQXV0aG9ycyIsImdldE1lc3NhZ2VTdWJqZWN0IiwiZm9ybWF0IiwicmVuZGVyQXV0aG9yIiwiYXV0aG9yIiwiZW1haWwiLCJnZXRFbWFpbCIsImF2YXRhclVybCIsImdldEF2YXRhclVybCIsImNvQXV0aG9ycyIsImdldENvQXV0aG9ycyIsImF1dGhvcnMiLCJnZXRBdXRob3IiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsImJvb2wiLCJSZWNlbnRDb21taXRzVmlldyIsInNlbGVjdGVkQ29tbWl0U2hhIiwicHJlc2VydmVGb2N1cyIsInNldEZvY3VzIiwiZm9jdXMiLCJSRUNFTlRfQ09NTUlUIiwiZWxlbWVudCIsImdldE9yIiwiZ2V0Rm9jdXMiLCJlIiwiY29udGFpbnMiLCJzZWxlY3ROZXh0Q29tbWl0Iiwic2VsZWN0UHJldmlvdXNDb21taXQiLCJvcGVuU2VsZWN0ZWRDb21taXQiLCJyZW5kZXJDb21taXRzIiwiY29tbWl0cyIsImxlbmd0aCIsImlzTG9hZGluZyIsImkiLCJnZXRTaGEiLCJhZHZhbmNlRm9jdXNGcm9tIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZXRyZWF0Rm9jdXNGcm9tIiwiQ29tbWl0VmlldyIsImxhc3RGb2N1cyIsImFycmF5T2YiLCJzdHJpbmciLCJTeW1ib2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLGdCQUFOLFNBQStCQyxlQUFNQyxTQUFyQyxDQUErQztBQVc3Q0MsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsMkNBbUZIQyxLQUFLLElBQUk7QUFDdkJBLE1BQUFBLEtBQUssQ0FBQ0MsZUFBTjtBQUNBLFlBQU07QUFBQ0MsUUFBQUEsTUFBRDtBQUFTQyxRQUFBQTtBQUFULFVBQXNCLEtBQUtKLEtBQWpDO0FBQ0FJLE1BQUFBLFNBQVMsQ0FBQ0MsS0FBVixDQUFnQkYsTUFBTSxDQUFDRyxHQUF2QjtBQUNELEtBdkZrQjs7QUFBQSwrQ0F5RkNMLEtBQUssSUFBSTtBQUMzQkEsTUFBQUEsS0FBSyxDQUFDQyxlQUFOO0FBQ0EsWUFBTTtBQUFDQyxRQUFBQSxNQUFEO0FBQVNDLFFBQUFBO0FBQVQsVUFBc0IsS0FBS0osS0FBakM7QUFDQUksTUFBQUEsU0FBUyxDQUFDQyxLQUFWLENBQWdCRixNQUFNLENBQUNJLGNBQXZCO0FBQ0QsS0E3RmtCOztBQUFBLDRDQStGRk4sS0FBSyxJQUFJO0FBQ3hCQSxNQUFBQSxLQUFLLENBQUNDLGVBQU47QUFDQSxXQUFLRixLQUFMLENBQVdRLGNBQVg7QUFDRCxLQWxHa0I7O0FBR2pCLFNBQUtDLE9BQUwsR0FBZSxJQUFJQyxrQkFBSixFQUFmO0FBQ0Q7O0FBRURDLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCLFFBQUks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ZUQsVUFiaEI7QUFjakJlLEVBQUFBLG9CQUFvQixFQUFFakIsbUJBQVVHLElBQVYsQ0FBZUQ7QUFkcEIsQzs7Z0JBREFHLGlCLFdBa0JKO0FBQ2JLLEVBQUFBLGFBQWEsRUFBRXVCLE1BQU0sQ0FBQyxlQUFEO0FBRFIsQzs7Z0JBbEJJNUIsaUIsZ0JBc0JDQSxpQkFBaUIsQ0FBQ0ksS0FBbEIsQ0FBd0JDLGE7O2dCQXRCekJMLGlCLGVBd0JBQSxpQkFBaUIsQ0FBQ0ksS0FBbEIsQ0FBd0JDLGEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7ZW1vamlmeX0gZnJvbSAnbm9kZS1lbW9qaSc7XG5cbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmltcG9ydCBDb21taXRWaWV3IGZyb20gJy4vY29tbWl0LXZpZXcnO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcblxuY2xhc3MgUmVjZW50Q29tbWl0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjbGlwYm9hcmQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdENvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpc01vc3RSZWNlbnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTZWxlY3RlZCkge1xuICAgICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3Quc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZChmYWxzZSkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1NlbGVjdGVkICYmICFwcmV2UHJvcHMuaXNTZWxlY3RlZCkge1xuICAgICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3Quc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZChmYWxzZSkpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBhdXRob3JNb21lbnQgPSBtb21lbnQodGhpcy5wcm9wcy5jb21taXQuZ2V0QXV0aG9yRGF0ZSgpICogMTAwMCk7XG4gICAgY29uc3QgZnVsbE1lc3NhZ2UgPSB0aGlzLnByb3BzLmNvbW1pdC5nZXRGdWxsTWVzc2FnZSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxsaVxuICAgICAgICByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1SZWNlbnRDb21taXQnLCB7XG4gICAgICAgICAgJ21vc3QtcmVjZW50JzogdGhpcy5wcm9wcy5pc01vc3RSZWNlbnQsXG4gICAgICAgICAgJ2lzLXNlbGVjdGVkJzogdGhpcy5wcm9wcy5pc1NlbGVjdGVkLFxuICAgICAgICB9KX1cbiAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vcGVuQ29tbWl0fT5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpjb3B5LWNvbW1pdC1zaGFcIiBjYWxsYmFjaz17dGhpcy5jb3B5Q29tbWl0U2hhfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y29weS1jb21taXQtc3ViamVjdFwiIGNhbGxiYWNrPXt0aGlzLmNvcHlDb21taXRTdWJqZWN0fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICB7dGhpcy5yZW5kZXJBdXRob3JzKCl9XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJlY2VudENvbW1pdC1tZXNzYWdlXCJcbiAgICAgICAgICB0aXRsZT17ZW1vamlmeShmdWxsTWVzc2FnZSl9PlxuICAgICAgICAgIHtlbW9qaWZ5KHRoaXMucHJvcHMuY29tbWl0LmdldE1lc3NhZ2VTdWJqZWN0KCkpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIHt0aGlzLnByb3BzLmlzTW9zdFJlY2VudCAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGdpdGh1Yi1SZWNlbnRDb21taXQtdW5kb0J1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnVuZG9MYXN0Q29tbWl0fT5cbiAgICAgICAgICAgIFVuZG9cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgICAgPFRpbWVhZ29cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmVjZW50Q29tbWl0LXRpbWVcIlxuICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiXG4gICAgICAgICAgdGltZT17YXV0aG9yTW9tZW50fVxuICAgICAgICAgIHRpdGxlPXthdXRob3JNb21lbnQuZm9ybWF0KCdNTU0gRG8sIFlZWVknKX1cbiAgICAgICAgLz5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckF1dGhvcihhdXRob3IpIHtcbiAgICBjb25zdCBlbWFpbCA9IGF1dGhvci5nZXRFbWFpbCgpO1xuICAgIGNvbnN0IGF2YXRhclVybCA9IGF1dGhvci5nZXRBdmF0YXJVcmwoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZWNlbnRDb21taXQtYXZhdGFyXCJcbiAgICAgICAga2V5PXtlbWFpbH1cbiAgICAgICAgc3JjPXthdmF0YXJVcmx9XG4gICAgICAgIHRpdGxlPXtlbWFpbH1cbiAgICAgICAgYWx0PXtgJHtlbWFpbH0ncyBhdmF0YXInYH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckF1dGhvcnMoKSB7XG4gICAgY29uc3QgY29BdXRob3JzID0gdGhpcy5wcm9wcy5jb21taXQuZ2V0Q29BdXRob3JzKCk7XG4gICAgY29uc3QgYXV0aG9ycyA9IFt0aGlzLnByb3BzLmNvbW1pdC5nZXRBdXRob3IoKSwgLi4uY29BdXRob3JzXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVjZW50Q29tbWl0LWF1dGhvcnNcIj5cbiAgICAgICAge2F1dGhvcnMubWFwKHRoaXMucmVuZGVyQXV0aG9yKX1cbiAgICAgIDwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgY29weUNvbW1pdFNoYSA9IGV2ZW50ID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7Y29tbWl0LCBjbGlwYm9hcmR9ID0gdGhpcy5wcm9wcztcbiAgICBjbGlwYm9hcmQud3JpdGUoY29tbWl0LnNoYSk7XG4gIH1cblxuICBjb3B5Q29tbWl0U3ViamVjdCA9IGV2ZW50ID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7Y29tbWl0LCBjbGlwYm9hcmR9ID0gdGhpcy5wcm9wcztcbiAgICBjbGlwYm9hcmQud3JpdGUoY29tbWl0Lm1lc3NhZ2VTdWJqZWN0KTtcbiAgfVxuXG4gIHVuZG9MYXN0Q29tbWl0ID0gZXZlbnQgPT4ge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMudW5kb0xhc3RDb21taXQoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNlbnRDb21taXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWwgc3RhdGVcbiAgICBjb21taXRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZENvbW1pdFNoYTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGNsaXBib2FyZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHVuZG9MYXN0Q29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0TmV4dENvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RQcmV2aW91c0NvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgUkVDRU5UX0NPTU1JVDogU3ltYm9sKCdyZWNlbnRfY29tbWl0JyksXG4gIH07XG5cbiAgc3RhdGljIGZpcnN0Rm9jdXMgPSBSZWNlbnRDb21taXRzVmlldy5mb2N1cy5SRUNFTlRfQ09NTUlUO1xuXG4gIHN0YXRpYyBsYXN0Rm9jdXMgPSBSZWNlbnRDb21taXRzVmlldy5mb2N1cy5SRUNFTlRfQ09NTUlUO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlJFQ0VOVF9DT01NSVQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSkuZ2V0T3IoZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChlID0+IGUuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKVxuICAgICAgPyB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlJFQ0VOVF9DT01NSVRcbiAgICAgIDogbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVjZW50Q29tbWl0c1wiIHRhYkluZGV4PVwiLTFcIiByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLWRvd25cIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5zZWxlY3ROZXh0Q29tbWl0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtdXBcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5zZWxlY3RQcmV2aW91c0NvbW1pdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpdmVcIiBjYWxsYmFjaz17dGhpcy5vcGVuU2VsZWN0ZWRDb21taXR9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdHMoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21taXRzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbW1pdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZWNlbnRDb21taXRzLW1lc3NhZ2VcIj5cbiAgICAgICAgICAgIFJlY2VudCBjb21taXRzXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJlY2VudENvbW1pdHMtbWVzc2FnZVwiPlxuICAgICAgICAgICAgTWFrZSB5b3VyIGZpcnN0IGNvbW1pdFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZ2l0aHViLVJlY2VudENvbW1pdHMtbGlzdFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNvbW1pdHMubWFwKChjb21taXQsIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxSZWNlbnRDb21taXRWaWV3XG4gICAgICAgICAgICAgICAga2V5PXtjb21taXQuZ2V0U2hhKCl9XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgY2xpcGJvYXJkPXt0aGlzLnByb3BzLmNsaXBib2FyZH1cbiAgICAgICAgICAgICAgICBpc01vc3RSZWNlbnQ9e2kgPT09IDB9XG4gICAgICAgICAgICAgICAgY29tbWl0PXtjb21taXR9XG4gICAgICAgICAgICAgICAgdW5kb0xhc3RDb21taXQ9e3RoaXMucHJvcHMudW5kb0xhc3RDb21taXR9XG4gICAgICAgICAgICAgICAgb3BlbkNvbW1pdD17KCkgPT4gdGhpcy5wcm9wcy5vcGVuQ29tbWl0KHtzaGE6IGNvbW1pdC5nZXRTaGEoKSwgcHJlc2VydmVGb2N1czogdHJ1ZX0pfVxuICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb21taXRTaGEgPT09IGNvbW1pdC5nZXRTaGEoKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvdWw+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5TZWxlY3RlZENvbW1pdCA9ICgpID0+IHRoaXMucHJvcHMub3BlbkNvbW1pdCh7c2hhOiB0aGlzLnByb3BzLnNlbGVjdGVkQ29tbWl0U2hhLCBwcmVzZXJ2ZUZvY3VzOiBmYWxzZX0pXG5cbiAgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5SRUNFTlRfQ09NTUlUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuY29uc3RydWN0b3IuZm9jdXMuUkVDRU5UX0NPTU1JVCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgfVxuXG4gIHJldHJlYXRGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuUkVDRU5UX0NPTU1JVCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShDb21taXRWaWV3Lmxhc3RGb2N1cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgfVxufVxuIl19