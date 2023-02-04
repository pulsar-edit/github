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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWNlbnRDb21taXRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiZXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJjb21taXQiLCJjbGlwYm9hcmQiLCJ3cml0ZSIsInNoYSIsIm1lc3NhZ2VTdWJqZWN0IiwidW5kb0xhc3RDb21taXQiLCJyZWZSb290IiwiUmVmSG9sZGVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJpc1NlbGVjdGVkIiwibWFwIiwicm9vdCIsInNjcm9sbEludG9WaWV3SWZOZWVkZWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJyZW5kZXIiLCJhdXRob3JNb21lbnQiLCJtb21lbnQiLCJnZXRBdXRob3JEYXRlIiwiZnVsbE1lc3NhZ2UiLCJnZXRGdWxsTWVzc2FnZSIsInNldHRlciIsImN4IiwiaXNNb3N0UmVjZW50Iiwib3BlbkNvbW1pdCIsImNvbW1hbmRzIiwiY29weUNvbW1pdFNoYSIsImNvcHlDb21taXRTdWJqZWN0IiwicmVuZGVyQXV0aG9ycyIsImVtb2ppZnkiLCJnZXRNZXNzYWdlU3ViamVjdCIsImZvcm1hdCIsInJlbmRlckF1dGhvciIsImF1dGhvciIsImVtYWlsIiwiZ2V0RW1haWwiLCJhdmF0YXJVcmwiLCJnZXRBdmF0YXJVcmwiLCJjb0F1dGhvcnMiLCJnZXRDb0F1dGhvcnMiLCJhdXRob3JzIiwiZ2V0QXV0aG9yIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJib29sIiwiUmVjZW50Q29tbWl0c1ZpZXciLCJzZWxlY3RlZENvbW1pdFNoYSIsInByZXNlcnZlRm9jdXMiLCJzZXRGb2N1cyIsImZvY3VzIiwiUkVDRU5UX0NPTU1JVCIsImVsZW1lbnQiLCJnZXRPciIsImdldEZvY3VzIiwiZSIsImNvbnRhaW5zIiwic2VsZWN0TmV4dENvbW1pdCIsInNlbGVjdFByZXZpb3VzQ29tbWl0Iiwib3BlblNlbGVjdGVkQ29tbWl0IiwicmVuZGVyQ29tbWl0cyIsImNvbW1pdHMiLCJsZW5ndGgiLCJpc0xvYWRpbmciLCJpIiwiZ2V0U2hhIiwiYWR2YW5jZUZvY3VzRnJvbSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmV0cmVhdEZvY3VzRnJvbSIsIkNvbW1pdFZpZXciLCJsYXN0Rm9jdXMiLCJhcnJheU9mIiwic3RyaW5nIiwiU3ltYm9sIl0sInNvdXJjZXMiOlsicmVjZW50LWNvbW1pdHMtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7ZW1vamlmeX0gZnJvbSAnbm9kZS1lbW9qaSc7XG5cbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmltcG9ydCBDb21taXRWaWV3IGZyb20gJy4vY29tbWl0LXZpZXcnO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcblxuY2xhc3MgUmVjZW50Q29tbWl0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjbGlwYm9hcmQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21taXQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdENvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpc01vc3RSZWNlbnQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZSb290ID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNTZWxlY3RlZCkge1xuICAgICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3Quc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZChmYWxzZSkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc1NlbGVjdGVkICYmICFwcmV2UHJvcHMuaXNTZWxlY3RlZCkge1xuICAgICAgdGhpcy5yZWZSb290Lm1hcChyb290ID0+IHJvb3Quc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZChmYWxzZSkpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBhdXRob3JNb21lbnQgPSBtb21lbnQodGhpcy5wcm9wcy5jb21taXQuZ2V0QXV0aG9yRGF0ZSgpICogMTAwMCk7XG4gICAgY29uc3QgZnVsbE1lc3NhZ2UgPSB0aGlzLnByb3BzLmNvbW1pdC5nZXRGdWxsTWVzc2FnZSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxsaVxuICAgICAgICByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1SZWNlbnRDb21taXQnLCB7XG4gICAgICAgICAgJ21vc3QtcmVjZW50JzogdGhpcy5wcm9wcy5pc01vc3RSZWNlbnQsXG4gICAgICAgICAgJ2lzLXNlbGVjdGVkJzogdGhpcy5wcm9wcy5pc1NlbGVjdGVkLFxuICAgICAgICB9KX1cbiAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5vcGVuQ29tbWl0fT5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjpjb3B5LWNvbW1pdC1zaGFcIiBjYWxsYmFjaz17dGhpcy5jb3B5Q29tbWl0U2hhfSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6Y29weS1jb21taXQtc3ViamVjdFwiIGNhbGxiYWNrPXt0aGlzLmNvcHlDb21taXRTdWJqZWN0fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICB7dGhpcy5yZW5kZXJBdXRob3JzKCl9XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJlY2VudENvbW1pdC1tZXNzYWdlXCJcbiAgICAgICAgICB0aXRsZT17ZW1vamlmeShmdWxsTWVzc2FnZSl9PlxuICAgICAgICAgIHtlbW9qaWZ5KHRoaXMucHJvcHMuY29tbWl0LmdldE1lc3NhZ2VTdWJqZWN0KCkpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIHt0aGlzLnByb3BzLmlzTW9zdFJlY2VudCAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGdpdGh1Yi1SZWNlbnRDb21taXQtdW5kb0J1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnVuZG9MYXN0Q29tbWl0fT5cbiAgICAgICAgICAgIFVuZG9cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgICAgPFRpbWVhZ29cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmVjZW50Q29tbWl0LXRpbWVcIlxuICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiXG4gICAgICAgICAgdGltZT17YXV0aG9yTW9tZW50fVxuICAgICAgICAgIHRpdGxlPXthdXRob3JNb21lbnQuZm9ybWF0KCdNTU0gRG8sIFlZWVknKX1cbiAgICAgICAgLz5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckF1dGhvcihhdXRob3IpIHtcbiAgICBjb25zdCBlbWFpbCA9IGF1dGhvci5nZXRFbWFpbCgpO1xuICAgIGNvbnN0IGF2YXRhclVybCA9IGF1dGhvci5nZXRBdmF0YXJVcmwoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZWNlbnRDb21taXQtYXZhdGFyXCJcbiAgICAgICAga2V5PXtlbWFpbH1cbiAgICAgICAgc3JjPXthdmF0YXJVcmx9XG4gICAgICAgIHRpdGxlPXtlbWFpbH1cbiAgICAgICAgYWx0PXtgJHtlbWFpbH0ncyBhdmF0YXInYH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckF1dGhvcnMoKSB7XG4gICAgY29uc3QgY29BdXRob3JzID0gdGhpcy5wcm9wcy5jb21taXQuZ2V0Q29BdXRob3JzKCk7XG4gICAgY29uc3QgYXV0aG9ycyA9IFt0aGlzLnByb3BzLmNvbW1pdC5nZXRBdXRob3IoKSwgLi4uY29BdXRob3JzXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmVjZW50Q29tbWl0LWF1dGhvcnNcIj5cbiAgICAgICAge2F1dGhvcnMubWFwKHRoaXMucmVuZGVyQXV0aG9yKX1cbiAgICAgIDwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgY29weUNvbW1pdFNoYSA9IGV2ZW50ID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7Y29tbWl0LCBjbGlwYm9hcmR9ID0gdGhpcy5wcm9wcztcbiAgICBjbGlwYm9hcmQud3JpdGUoY29tbWl0LnNoYSk7XG4gIH1cblxuICBjb3B5Q29tbWl0U3ViamVjdCA9IGV2ZW50ID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7Y29tbWl0LCBjbGlwYm9hcmR9ID0gdGhpcy5wcm9wcztcbiAgICBjbGlwYm9hcmQud3JpdGUoY29tbWl0Lm1lc3NhZ2VTdWJqZWN0KTtcbiAgfVxuXG4gIHVuZG9MYXN0Q29tbWl0ID0gZXZlbnQgPT4ge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMudW5kb0xhc3RDb21taXQoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNlbnRDb21taXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gTW9kZWwgc3RhdGVcbiAgICBjb21taXRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZENvbW1pdFNoYTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIGNsaXBib2FyZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHVuZG9MYXN0Q29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0TmV4dENvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RQcmV2aW91c0NvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBzdGF0aWMgZm9jdXMgPSB7XG4gICAgUkVDRU5UX0NPTU1JVDogU3ltYm9sKCdyZWNlbnRfY29tbWl0JyksXG4gIH07XG5cbiAgc3RhdGljIGZpcnN0Rm9jdXMgPSBSZWNlbnRDb21taXRzVmlldy5mb2N1cy5SRUNFTlRfQ09NTUlUO1xuXG4gIHN0YXRpYyBsYXN0Rm9jdXMgPSBSZWNlbnRDb21taXRzVmlldy5mb2N1cy5SRUNFTlRfQ09NTUlUO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHNldEZvY3VzKGZvY3VzKSB7XG4gICAgaWYgKGZvY3VzID09PSB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlJFQ0VOVF9DT01NSVQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZlJvb3QubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSkuZ2V0T3IoZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldEZvY3VzKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZSb290Lm1hcChlID0+IGUuY29udGFpbnMoZWxlbWVudCkpLmdldE9yKGZhbHNlKVxuICAgICAgPyB0aGlzLmNvbnN0cnVjdG9yLmZvY3VzLlJFQ0VOVF9DT01NSVRcbiAgICAgIDogbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVjZW50Q29tbWl0c1wiIHRhYkluZGV4PVwiLTFcIiByZWY9e3RoaXMucmVmUm9vdC5zZXR0ZXJ9PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiY29yZTptb3ZlLWRvd25cIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5zZWxlY3ROZXh0Q29tbWl0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJjb3JlOm1vdmUtdXBcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5zZWxlY3RQcmV2aW91c0NvbW1pdH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmRpdmVcIiBjYWxsYmFjaz17dGhpcy5vcGVuU2VsZWN0ZWRDb21taXR9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdHMoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21taXRzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbW1pdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZWNlbnRDb21taXRzLW1lc3NhZ2VcIj5cbiAgICAgICAgICAgIFJlY2VudCBjb21taXRzXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJlY2VudENvbW1pdHMtbWVzc2FnZVwiPlxuICAgICAgICAgICAgTWFrZSB5b3VyIGZpcnN0IGNvbW1pdFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZ2l0aHViLVJlY2VudENvbW1pdHMtbGlzdFwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNvbW1pdHMubWFwKChjb21taXQsIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxSZWNlbnRDb21taXRWaWV3XG4gICAgICAgICAgICAgICAga2V5PXtjb21taXQuZ2V0U2hhKCl9XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgY2xpcGJvYXJkPXt0aGlzLnByb3BzLmNsaXBib2FyZH1cbiAgICAgICAgICAgICAgICBpc01vc3RSZWNlbnQ9e2kgPT09IDB9XG4gICAgICAgICAgICAgICAgY29tbWl0PXtjb21taXR9XG4gICAgICAgICAgICAgICAgdW5kb0xhc3RDb21taXQ9e3RoaXMucHJvcHMudW5kb0xhc3RDb21taXR9XG4gICAgICAgICAgICAgICAgb3BlbkNvbW1pdD17KCkgPT4gdGhpcy5wcm9wcy5vcGVuQ29tbWl0KHtzaGE6IGNvbW1pdC5nZXRTaGEoKSwgcHJlc2VydmVGb2N1czogdHJ1ZX0pfVxuICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb21taXRTaGEgPT09IGNvbW1pdC5nZXRTaGEoKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvdWw+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5TZWxlY3RlZENvbW1pdCA9ICgpID0+IHRoaXMucHJvcHMub3BlbkNvbW1pdCh7c2hhOiB0aGlzLnByb3BzLnNlbGVjdGVkQ29tbWl0U2hhLCBwcmVzZXJ2ZUZvY3VzOiBmYWxzZX0pXG5cbiAgYWR2YW5jZUZvY3VzRnJvbShmb2N1cykge1xuICAgIGlmIChmb2N1cyA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5mb2N1cy5SRUNFTlRfQ09NTUlUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuY29uc3RydWN0b3IuZm9jdXMuUkVDRU5UX0NPTU1JVCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgfVxuXG4gIHJldHJlYXRGb2N1c0Zyb20oZm9jdXMpIHtcbiAgICBpZiAoZm9jdXMgPT09IHRoaXMuY29uc3RydWN0b3IuZm9jdXMuUkVDRU5UX0NPTU1JVCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShDb21taXRWaWV3Lmxhc3RGb2N1cyk7XG4gICAgfVxuXG4gICAgcmV0dXJu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