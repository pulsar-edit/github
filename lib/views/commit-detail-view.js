"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _nodeEmoji = require("node-emoji");
var _moment = _interopRequireDefault(require("moment"));
var _multiFilePatchController = _interopRequireDefault(require("../controllers/multi-file-patch-controller"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommitDetailView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refRoot = new _refHolder.default();
  }
  render() {
    const commit = this.props.commit;
    return _react.default.createElement("div", {
      className: "github-CommitDetailView",
      ref: this.refRoot.setter
    }, this.renderCommands(), _react.default.createElement("div", {
      className: "github-CommitDetailView-header native-key-bindings",
      tabIndex: "-1"
    }, _react.default.createElement("div", {
      className: "github-CommitDetailView-commit"
    }, _react.default.createElement("h3", {
      className: "github-CommitDetailView-title"
    }, (0, _nodeEmoji.emojify)(commit.getMessageSubject())), _react.default.createElement("div", {
      className: "github-CommitDetailView-meta"
    }, this.renderAuthors(), _react.default.createElement("span", {
      className: "github-CommitDetailView-metaText"
    }, this.getAuthorInfo(), " committed ", this.humanizeTimeSince(commit.getAuthorDate())), _react.default.createElement("div", {
      className: "github-CommitDetailView-sha"
    }, this.renderDotComLink())), this.renderShowMoreButton(), this.renderCommitMessageBody())), _react.default.createElement(_multiFilePatchController.default, _extends({
      multiFilePatch: commit.getMultiFileDiff(),
      surface: this.props.surfaceCommit
    }, this.props)));
  }
  renderCommands() {
    return _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, _react.default.createElement(_commands.Command, {
      command: "github:surface",
      callback: this.props.surfaceCommit
    }));
  }
  renderCommitMessageBody() {
    const collapsed = this.props.messageCollapsible && !this.props.messageOpen;
    return _react.default.createElement("pre", {
      className: "github-CommitDetailView-moreText"
    }, collapsed ? this.props.commit.abbreviatedBody() : this.props.commit.getMessageBody());
  }
  renderShowMoreButton() {
    if (!this.props.messageCollapsible) {
      return null;
    }
    const buttonText = this.props.messageOpen ? 'Show Less' : 'Show More';
    return _react.default.createElement("button", {
      className: "github-CommitDetailView-moreButton",
      onClick: this.props.toggleMessage
    }, buttonText);
  }
  humanizeTimeSince(date) {
    return (0, _moment.default)(date * 1000).fromNow();
  }
  renderDotComLink() {
    const remote = this.props.currentRemote;
    const sha = this.props.commit.getSha();
    if (remote.isGithubRepo() && this.props.isCommitPushed) {
      const repoUrl = `https://github.com/${remote.getOwner()}/${remote.getRepo()}`;
      return _react.default.createElement("a", {
        href: `${repoUrl}/commit/${sha}`,
        title: `open commit ${sha} on GitHub.com`
      }, sha);
    } else {
      return _react.default.createElement("span", null, sha);
    }
  }
  getAuthorInfo() {
    const commit = this.props.commit;
    const coAuthorCount = commit.getCoAuthors().length;
    if (coAuthorCount === 0) {
      return commit.getAuthorName();
    } else if (coAuthorCount === 1) {
      return `${commit.getAuthorName()} and ${commit.getCoAuthors()[0].getFullName()}`;
    } else {
      return `${commit.getAuthorName()} and ${coAuthorCount} others`;
    }
  }
  renderAuthor(author) {
    const email = author.getEmail();
    const avatarUrl = author.getAvatarUrl();
    return _react.default.createElement("img", {
      className: "github-CommitDetailView-avatar github-RecentCommit-avatar",
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
      className: "github-CommitDetailView-authors github-RecentCommit-authors"
    }, authors.map(this.renderAuthor));
  }
}
exports.default = CommitDetailView;
_defineProperty(CommitDetailView, "drilledPropTypes", {
  // Model properties
  repository: _propTypes.default.object.isRequired,
  commit: _propTypes.default.object.isRequired,
  currentRemote: _propTypes.default.object.isRequired,
  isCommitPushed: _propTypes.default.bool.isRequired,
  itemType: _propTypes.default.func.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  // Action functions
  destroy: _propTypes.default.func.isRequired,
  surfaceCommit: _propTypes.default.func.isRequired
});
_defineProperty(CommitDetailView, "propTypes", _objectSpread({}, CommitDetailView.drilledPropTypes, {
  // Controller state
  messageCollapsible: _propTypes.default.bool.isRequired,
  messageOpen: _propTypes.default.bool.isRequired,
  // Action functions
  toggleMessage: _propTypes.default.func.isRequired
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXREZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmUm9vdCIsIlJlZkhvbGRlciIsInJlbmRlciIsImNvbW1pdCIsInNldHRlciIsInJlbmRlckNvbW1hbmRzIiwiZW1vamlmeSIsImdldE1lc3NhZ2VTdWJqZWN0IiwicmVuZGVyQXV0aG9ycyIsImdldEF1dGhvckluZm8iLCJodW1hbml6ZVRpbWVTaW5jZSIsImdldEF1dGhvckRhdGUiLCJyZW5kZXJEb3RDb21MaW5rIiwicmVuZGVyU2hvd01vcmVCdXR0b24iLCJyZW5kZXJDb21taXRNZXNzYWdlQm9keSIsImdldE11bHRpRmlsZURpZmYiLCJzdXJmYWNlQ29tbWl0IiwiY29tbWFuZHMiLCJjb2xsYXBzZWQiLCJtZXNzYWdlQ29sbGFwc2libGUiLCJtZXNzYWdlT3BlbiIsImFiYnJldmlhdGVkQm9keSIsImdldE1lc3NhZ2VCb2R5IiwiYnV0dG9uVGV4dCIsInRvZ2dsZU1lc3NhZ2UiLCJkYXRlIiwibW9tZW50IiwiZnJvbU5vdyIsInJlbW90ZSIsImN1cnJlbnRSZW1vdGUiLCJzaGEiLCJnZXRTaGEiLCJpc0dpdGh1YlJlcG8iLCJpc0NvbW1pdFB1c2hlZCIsInJlcG9VcmwiLCJnZXRPd25lciIsImdldFJlcG8iLCJjb0F1dGhvckNvdW50IiwiZ2V0Q29BdXRob3JzIiwibGVuZ3RoIiwiZ2V0QXV0aG9yTmFtZSIsImdldEZ1bGxOYW1lIiwicmVuZGVyQXV0aG9yIiwiYXV0aG9yIiwiZW1haWwiLCJnZXRFbWFpbCIsImF2YXRhclVybCIsImdldEF2YXRhclVybCIsImNvQXV0aG9ycyIsImF1dGhvcnMiLCJnZXRBdXRob3IiLCJtYXAiLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpdGVtVHlwZSIsImZ1bmMiLCJ3b3Jrc3BhY2UiLCJrZXltYXBzIiwidG9vbHRpcHMiLCJjb25maWciLCJkZXN0cm95IiwiZHJpbGxlZFByb3BUeXBlcyJdLCJzb3VyY2VzIjpbImNvbW1pdC1kZXRhaWwtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7ZW1vamlmeX0gZnJvbSAnbm9kZS1lbW9qaSc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCBNdWx0aUZpbGVQYXRjaENvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvbXVsdGktZmlsZS1wYXRjaC1jb250cm9sbGVyJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdERldGFpbFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZHJpbGxlZFByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbCBwcm9wZXJ0aWVzXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRSZW1vdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc0NvbW1pdFB1c2hlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpdGVtVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIGZ1bmN0aW9uc1xuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3VyZmFjZUNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLi4uQ29tbWl0RGV0YWlsVmlldy5kcmlsbGVkUHJvcFR5cGVzLFxuXG4gICAgLy8gQ29udHJvbGxlciBzdGF0ZVxuICAgIG1lc3NhZ2VDb2xsYXBzaWJsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBtZXNzYWdlT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBmdW5jdGlvbnNcbiAgICB0b2dnbGVNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWl0ID0gdGhpcy5wcm9wcy5jb21taXQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlld1wiIHJlZj17dGhpcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctaGVhZGVyIG5hdGl2ZS1rZXktYmluZGluZ3NcIiB0YWJJbmRleD1cIi0xXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1jb21taXRcIj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICB7ZW1vamlmeShjb21taXQuZ2V0TWVzc2FnZVN1YmplY3QoKSl9XG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1tZXRhXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckF1dGhvcnMoKX1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctbWV0YVRleHRcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXRBdXRob3JJbmZvKCl9IGNvbW1pdHRlZCB7dGhpcy5odW1hbml6ZVRpbWVTaW5jZShjb21taXQuZ2V0QXV0aG9yRGF0ZSgpKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LXNoYVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckRvdENvbUxpbmsoKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlclNob3dNb3JlQnV0dG9uKCl9XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21taXRNZXNzYWdlQm9keSgpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPE11bHRpRmlsZVBhdGNoQ29udHJvbGxlclxuICAgICAgICAgIG11bHRpRmlsZVBhdGNoPXtjb21taXQuZ2V0TXVsdGlGaWxlRGlmZigpfVxuICAgICAgICAgIHN1cmZhY2U9e3RoaXMucHJvcHMuc3VyZmFjZUNvbW1pdH1cbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VyZmFjZVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLnN1cmZhY2VDb21taXR9IC8+XG4gICAgICA8L0NvbW1hbmRzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21taXRNZXNzYWdlQm9keSgpIHtcbiAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLnByb3BzLm1lc3NhZ2VDb2xsYXBzaWJsZSAmJiAhdGhpcy5wcm9wcy5tZXNzYWdlT3BlbjtcblxuICAgIHJldHVybiAoXG4gICAgICA8cHJlIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LW1vcmVUZXh0XCI+XG4gICAgICAgIHtjb2xsYXBzZWQgPyB0aGlzLnByb3BzLmNvbW1pdC5hYmJyZXZpYXRlZEJvZHkoKSA6IHRoaXMucHJvcHMuY29tbWl0LmdldE1lc3NhZ2VCb2R5KCl9XG4gICAgICA8L3ByZT5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU2hvd01vcmVCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm1lc3NhZ2VDb2xsYXBzaWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYnV0dG9uVGV4dCA9IHRoaXMucHJvcHMubWVzc2FnZU9wZW4gPyAnU2hvdyBMZXNzJyA6ICdTaG93IE1vcmUnO1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LW1vcmVCdXR0b25cIiBvbkNsaWNrPXt0aGlzLnByb3BzLnRvZ2dsZU1lc3NhZ2V9PntidXR0b25UZXh0fTwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICBodW1hbml6ZVRpbWVTaW5jZShkYXRlKSB7XG4gICAgcmV0dXJuIG1vbWVudChkYXRlICogMTAwMCkuZnJvbU5vdygpO1xuICB9XG5cbiAgcmVuZGVyRG90Q29tTGluaygpIHtcbiAgICBjb25zdCByZW1vdGUgPSB0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGU7XG4gICAgY29uc3Qgc2hhID0gdGhpcy5wcm9wcy5jb21taXQuZ2V0U2hhKCk7XG4gICAgaWYgKHJlbW90ZS5pc0dpdGh1YlJlcG8oKSAmJiB0aGlzLnByb3BzLmlzQ29tbWl0UHVzaGVkKSB7XG4gICAgICBjb25zdCByZXBvVXJsID0gYGh0dHBzOi8vZ2l0aHViLmNvbS8ke3JlbW90ZS5nZXRPd25lcigpfS8ke3JlbW90ZS5nZXRSZXBvKCl9YDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxhIGhyZWY9e2Ake3JlcG9Vcmx9L2NvbW1pdC8ke3NoYX1gfVxuICAgICAgICAgIHRpdGxlPXtgb3BlbiBjb21taXQgJHtzaGF9IG9uIEdpdEh1Yi5jb21gfT5cbiAgICAgICAgICB7c2hhfVxuICAgICAgICA8L2E+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKDxzcGFuPntzaGF9PC9zcGFuPik7XG4gICAgfVxuICB9XG5cbiAgZ2V0QXV0aG9ySW5mbygpIHtcbiAgICBjb25zdCBjb21taXQgPSB0aGlzLnByb3BzLmNvbW1pdDtcbiAgICBjb25zdCBjb0F1dGhvckNvdW50ID0gY29tbWl0LmdldENvQXV0aG9ycygpLmxlbmd0aDtcbiAgICBpZiAoY29BdXRob3JDb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbW1pdC5nZXRBdXRob3JOYW1lKCk7XG4gICAgfSBlbHNlIGlmIChjb0F1dGhvckNvdW50ID09PSAxKSB7XG4gICAgICByZXR1cm4gYCR7Y29tbWl0LmdldEF1dGhvck5hbWUoKX0gYW5kICR7Y29tbWl0LmdldENvQXV0aG9ycygpWzBdLmdldEZ1bGxOYW1lKCl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbW1pdC5nZXRBdXRob3JOYW1lKCl9IGFuZCAke2NvQXV0aG9yQ291bnR9IG90aGVyc2A7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQXV0aG9yKGF1dGhvcikge1xuICAgIGNvbnN0IGVtYWlsID0gYXV0aG9yLmdldEVtYWlsKCk7XG4gICAgY29uc3QgYXZhdGFyVXJsID0gYXV0aG9yLmdldEF2YXRhclVybCgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctYXZhdGFyIGdpdGh1Yi1SZWNlbnRDb21taXQtYXZhdGFyXCJcbiAgICAgICAga2V5PXtlbWFpbH1cbiAgICAgICAgc3JjPXthdmF0YXJVcmx9XG4gICAgICAgIHRpdGxlPXtlbWFpbH1cbiAgICAgICAgYWx0PXtgJHtlbWFpbH0ncyBhdmF0YXInYH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckF1dGhvcnMoKSB7XG4gICAgY29uc3QgY29BdXRob3JzID0gdGhpcy5wcm9wcy5jb21taXQuZ2V0Q29BdXRob3JzKCk7XG4gICAgY29uc3QgYXV0aG9ycyA9IFt0aGlzLnByb3BzLmNvbW1pdC5nZXRBdXRob3IoKSwgLi4uY29BdXRob3JzXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1hdXRob3JzIGdpdGh1Yi1SZWNlbnRDb21taXQtYXV0aG9yc1wiPlxuICAgICAgICB7YXV0aG9ycy5tYXAodGhpcy5yZW5kZXJBdXRob3IpfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBNkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTlCLE1BQU1BLGdCQUFnQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWdDNURDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pC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