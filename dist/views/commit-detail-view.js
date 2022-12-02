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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jb21taXQtZGV0YWlsLXZpZXcuanMiXSwibmFtZXMiOlsiQ29tbWl0RGV0YWlsVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJjb21taXQiLCJzZXR0ZXIiLCJyZW5kZXJDb21tYW5kcyIsImdldE1lc3NhZ2VTdWJqZWN0IiwicmVuZGVyQXV0aG9ycyIsImdldEF1dGhvckluZm8iLCJodW1hbml6ZVRpbWVTaW5jZSIsImdldEF1dGhvckRhdGUiLCJyZW5kZXJEb3RDb21MaW5rIiwicmVuZGVyU2hvd01vcmVCdXR0b24iLCJyZW5kZXJDb21taXRNZXNzYWdlQm9keSIsImdldE11bHRpRmlsZURpZmYiLCJzdXJmYWNlQ29tbWl0IiwiY29tbWFuZHMiLCJjb2xsYXBzZWQiLCJtZXNzYWdlQ29sbGFwc2libGUiLCJtZXNzYWdlT3BlbiIsImFiYnJldmlhdGVkQm9keSIsImdldE1lc3NhZ2VCb2R5IiwiYnV0dG9uVGV4dCIsInRvZ2dsZU1lc3NhZ2UiLCJkYXRlIiwiZnJvbU5vdyIsInJlbW90ZSIsImN1cnJlbnRSZW1vdGUiLCJzaGEiLCJnZXRTaGEiLCJpc0dpdGh1YlJlcG8iLCJpc0NvbW1pdFB1c2hlZCIsInJlcG9VcmwiLCJnZXRPd25lciIsImdldFJlcG8iLCJjb0F1dGhvckNvdW50IiwiZ2V0Q29BdXRob3JzIiwibGVuZ3RoIiwiZ2V0QXV0aG9yTmFtZSIsImdldEZ1bGxOYW1lIiwicmVuZGVyQXV0aG9yIiwiYXV0aG9yIiwiZW1haWwiLCJnZXRFbWFpbCIsImF2YXRhclVybCIsImdldEF2YXRhclVybCIsImNvQXV0aG9ycyIsImF1dGhvcnMiLCJnZXRBdXRob3IiLCJtYXAiLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpdGVtVHlwZSIsImZ1bmMiLCJ3b3Jrc3BhY2UiLCJr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QyxNQUFWLENBQWlCQyxVQVRKO0FBVXhCckMsRUFBQUEsUUFBUSxFQUFFbUMsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBVkg7QUFXeEJLLEVBQUFBLE9BQU8sRUFBRVAsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBWEY7QUFZeEJNLEVBQUFBLFFBQVEsRUFBRVIsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBWkg7QUFheEJPLEVBQUFBLE1BQU0sRUFBRVQsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBYkQ7QUFleEI7QUFDQVEsRUFBQUEsT0FBTyxFQUFFVixtQkFBVUssSUFBVixDQUFlSCxVQWhCQTtBQWlCeEJ0QyxFQUFBQSxhQUFhLEVBQUVvQyxtQkFBVUssSUFBVixDQUFlSDtBQWpCTixDOztnQkFEUDFELGdCLGlDQXNCZEEsZ0JBQWdCLENBQUNtRSxnQjtBQUVwQjtBQUNBNUMsRUFBQUEsa0JBQWtCLEVBQUVpQyxtQkFBVUcsSUFBVixDQUFlRCxVO0FBQ25DbEMsRUFBQUEsV0FBVyxFQUFFZ0MsbUJBQVVHLElBQVYsQ0FBZUQsVTtBQUU1QjtBQUNBOUIsRUFBQUEsYUFBYSxFQUFFNEIsbUJBQVVLLElBQVYsQ0FBZUgiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7ZW1vamlmeX0gZnJvbSAnbm9kZS1lbW9qaSc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCBNdWx0aUZpbGVQYXRjaENvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvbXVsdGktZmlsZS1wYXRjaC1jb250cm9sbGVyJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdERldGFpbFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZHJpbGxlZFByb3BUeXBlcyA9IHtcbiAgICAvLyBNb2RlbCBwcm9wZXJ0aWVzXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRSZW1vdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc0NvbW1pdFB1c2hlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBpdGVtVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIGZ1bmN0aW9uc1xuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3VyZmFjZUNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLi4uQ29tbWl0RGV0YWlsVmlldy5kcmlsbGVkUHJvcFR5cGVzLFxuXG4gICAgLy8gQ29udHJvbGxlciBzdGF0ZVxuICAgIG1lc3NhZ2VDb2xsYXBzaWJsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBtZXNzYWdlT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBmdW5jdGlvbnNcbiAgICB0b2dnbGVNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZlJvb3QgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWl0ID0gdGhpcy5wcm9wcy5jb21taXQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlld1wiIHJlZj17dGhpcy5yZWZSb290LnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctaGVhZGVyIG5hdGl2ZS1rZXktYmluZGluZ3NcIiB0YWJJbmRleD1cIi0xXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1jb21taXRcIj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy10aXRsZVwiPlxuICAgICAgICAgICAgICB7ZW1vamlmeShjb21taXQuZ2V0TWVzc2FnZVN1YmplY3QoKSl9XG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1tZXRhXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckF1dGhvcnMoKX1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctbWV0YVRleHRcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXRBdXRob3JJbmZvKCl9IGNvbW1pdHRlZCB7dGhpcy5odW1hbml6ZVRpbWVTaW5jZShjb21taXQuZ2V0QXV0aG9yRGF0ZSgpKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LXNoYVwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckRvdENvbUxpbmsoKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlclNob3dNb3JlQnV0dG9uKCl9XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21taXRNZXNzYWdlQm9keSgpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPE11bHRpRmlsZVBhdGNoQ29udHJvbGxlclxuICAgICAgICAgIG11bHRpRmlsZVBhdGNoPXtjb21taXQuZ2V0TXVsdGlGaWxlRGlmZigpfVxuICAgICAgICAgIHN1cmZhY2U9e3RoaXMucHJvcHMuc3VyZmFjZUNvbW1pdH1cbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucmVmUm9vdH0+XG4gICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VyZmFjZVwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLnN1cmZhY2VDb21taXR9IC8+XG4gICAgICA8L0NvbW1hbmRzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21taXRNZXNzYWdlQm9keSgpIHtcbiAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLnByb3BzLm1lc3NhZ2VDb2xsYXBzaWJsZSAmJiAhdGhpcy5wcm9wcy5tZXNzYWdlT3BlbjtcblxuICAgIHJldHVybiAoXG4gICAgICA8cHJlIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LW1vcmVUZXh0XCI+XG4gICAgICAgIHtjb2xsYXBzZWQgPyB0aGlzLnByb3BzLmNvbW1pdC5hYmJyZXZpYXRlZEJvZHkoKSA6IHRoaXMucHJvcHMuY29tbWl0LmdldE1lc3NhZ2VCb2R5KCl9XG4gICAgICA8L3ByZT5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU2hvd01vcmVCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm1lc3NhZ2VDb2xsYXBzaWJsZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYnV0dG9uVGV4dCA9IHRoaXMucHJvcHMubWVzc2FnZU9wZW4gPyAnU2hvdyBMZXNzJyA6ICdTaG93IE1vcmUnO1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LW1vcmVCdXR0b25cIiBvbkNsaWNrPXt0aGlzLnByb3BzLnRvZ2dsZU1lc3NhZ2V9PntidXR0b25UZXh0fTwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICBodW1hbml6ZVRpbWVTaW5jZShkYXRlKSB7XG4gICAgcmV0dXJuIG1vbWVudChkYXRlICogMTAwMCkuZnJvbU5vdygpO1xuICB9XG5cbiAgcmVuZGVyRG90Q29tTGluaygpIHtcbiAgICBjb25zdCByZW1vdGUgPSB0aGlzLnByb3BzLmN1cnJlbnRSZW1vdGU7XG4gICAgY29uc3Qgc2hhID0gdGhpcy5wcm9wcy5jb21taXQuZ2V0U2hhKCk7XG4gICAgaWYgKHJlbW90ZS5pc0dpdGh1YlJlcG8oKSAmJiB0aGlzLnByb3BzLmlzQ29tbWl0UHVzaGVkKSB7XG4gICAgICBjb25zdCByZXBvVXJsID0gYGh0dHBzOi8vZ2l0aHViLmNvbS8ke3JlbW90ZS5nZXRPd25lcigpfS8ke3JlbW90ZS5nZXRSZXBvKCl9YDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxhIGhyZWY9e2Ake3JlcG9Vcmx9L2NvbW1pdC8ke3NoYX1gfVxuICAgICAgICAgIHRpdGxlPXtgb3BlbiBjb21taXQgJHtzaGF9IG9uIEdpdEh1Yi5jb21gfT5cbiAgICAgICAgICB7c2hhfVxuICAgICAgICA8L2E+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKDxzcGFuPntzaGF9PC9zcGFuPik7XG4gICAgfVxuICB9XG5cbiAgZ2V0QXV0aG9ySW5mbygpIHtcbiAgICBjb25zdCBjb21taXQgPSB0aGlzLnByb3BzLmNvbW1pdDtcbiAgICBjb25zdCBjb0F1dGhvckNvdW50ID0gY29tbWl0LmdldENvQXV0aG9ycygpLmxlbmd0aDtcbiAgICBpZiAoY29BdXRob3JDb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbW1pdC5nZXRBdXRob3JOYW1lKCk7XG4gICAgfSBlbHNlIGlmIChjb0F1dGhvckNvdW50ID09PSAxKSB7XG4gICAgICByZXR1cm4gYCR7Y29tbWl0LmdldEF1dGhvck5hbWUoKX0gYW5kICR7Y29tbWl0LmdldENvQXV0aG9ycygpWzBdLmdldEZ1bGxOYW1lKCl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2NvbW1pdC5nZXRBdXRob3JOYW1lKCl9IGFuZCAke2NvQXV0aG9yQ291bnR9IG90aGVyc2A7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQXV0aG9yKGF1dGhvcikge1xuICAgIGNvbnN0IGVtYWlsID0gYXV0aG9yLmdldEVtYWlsKCk7XG4gICAgY29uc3QgYXZhdGFyVXJsID0gYXV0aG9yLmdldEF2YXRhclVybCgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctYXZhdGFyIGdpdGh1Yi1SZWNlbnRDb21taXQtYXZhdGFyXCJcbiAgICAgICAga2V5PXtlbWFpbH1cbiAgICAgICAgc3JjPXthdmF0YXJVcmx9XG4gICAgICAgIHRpdGxlPXtlbWFpbH1cbiAgICAgICAgYWx0PXtgJHtlbWFpbH0ncyBhdmF0YXInYH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckF1dGhvcnMoKSB7XG4gICAgY29uc3QgY29BdXRob3JzID0gdGhpcy5wcm9wcy5jb21taXQuZ2V0Q29BdXRob3JzKCk7XG4gICAgY29uc3QgYXV0aG9ycyA9IFt0aGlzLnByb3BzLmNvbW1pdC5nZXRBdXRob3IoKSwgLi4uY29BdXRob3JzXTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1hdXRob3JzIGdpdGh1Yi1SZWNlbnRDb21taXQtYXV0aG9yc1wiPlxuICAgICAgICB7YXV0aG9ycy5tYXAodGhpcy5yZW5kZXJBdXRob3IpfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==