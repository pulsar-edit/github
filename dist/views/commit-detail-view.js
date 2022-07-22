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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitDetailView",
      ref: this.refRoot.setter
    }, this.renderCommands(), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitDetailView-header native-key-bindings",
      tabIndex: "-1"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitDetailView-commit"
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: "github-CommitDetailView-title"
    }, (0, _nodeEmoji.emojify)(commit.getMessageSubject())), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitDetailView-meta"
    }, this.renderAuthors(), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-CommitDetailView-metaText"
    }, this.getAuthorInfo(), " committed ", this.humanizeTimeSince(commit.getAuthorDate())), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-CommitDetailView-sha"
    }, this.renderDotComLink())), this.renderShowMoreButton(), this.renderCommitMessageBody())), /*#__PURE__*/_react.default.createElement(_multiFilePatchController.default, _extends({
      multiFilePatch: commit.getMultiFileDiff(),
      surface: this.props.surfaceCommit
    }, this.props)));
  }

  renderCommands() {
    return /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.refRoot
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:surface",
      callback: this.props.surfaceCommit
    }));
  }

  renderCommitMessageBody() {
    const collapsed = this.props.messageCollapsible && !this.props.messageOpen;
    return /*#__PURE__*/_react.default.createElement("pre", {
      className: "github-CommitDetailView-moreText"
    }, collapsed ? this.props.commit.abbreviatedBody() : this.props.commit.getMessageBody());
  }

  renderShowMoreButton() {
    if (!this.props.messageCollapsible) {
      return null;
    }

    const buttonText = this.props.messageOpen ? 'Show Less' : 'Show More';
    return /*#__PURE__*/_react.default.createElement("button", {
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
      return /*#__PURE__*/_react.default.createElement("a", {
        href: `${repoUrl}/commit/${sha}`,
        title: `open commit ${sha} on GitHub.com`
      }, sha);
    } else {
      return /*#__PURE__*/_react.default.createElement("span", null, sha);
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
    return /*#__PURE__*/_react.default.createElement("img", {
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
    return /*#__PURE__*/_react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9jb21taXQtZGV0YWlsLXZpZXcuanMiXSwibmFtZXMiOlsiQ29tbWl0RGV0YWlsVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlZlJvb3QiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJjb21taXQiLCJzZXR0ZXIiLCJyZW5kZXJDb21tYW5kcyIsImdldE1lc3NhZ2VTdWJqZWN0IiwicmVuZGVyQXV0aG9ycyIsImdldEF1dGhvckluZm8iLCJodW1hbml6ZVRpbWVTaW5jZSIsImdldEF1dGhvckRhdGUiLCJyZW5kZXJEb3RDb21MaW5rIiwicmVuZGVyU2hvd01vcmVCdXR0b24iLCJyZW5kZXJDb21taXRNZXNzYWdlQm9keSIsImdldE11bHRpRmlsZURpZmYiLCJzdXJmYWNlQ29tbWl0IiwiY29tbWFuZHMiLCJjb2xsYXBzZWQiLCJtZXNzYWdlQ29sbGFwc2libGUiLCJtZXNzYWdlT3BlbiIsImFiYnJldmlhdGVkQm9keSIsImdldE1lc3NhZ2VCb2R5IiwiYnV0dG9uVGV4dCIsInRvZ2dsZU1lc3NhZ2UiLCJkYXRlIiwiZnJvbU5vdyIsInJlbW90ZSIsImN1cnJlbnRSZW1vdGUiLCJzaGEiLCJnZXRTaGEiLCJpc0dpdGh1YlJlcG8iLCJpc0NvbW1pdFB1c2hlZCIsInJlcG9VcmwiLCJnZXRPd25lciIsImdldFJlcG8iLCJjb0F1dGhvckNvdW50IiwiZ2V0Q29BdXRob3JzIiwibGVuZ3RoIiwiZ2V0QXV0aG9yTmFtZSIsImdldEZ1bGxOYW1lIiwicmVuZGVyQXV0aG9yIiwiYXV0aG9yIiwiZW1haWwiLCJnZXRFbWFpbCIsImF2YXRhclVybCIsImdldEF2YXRhclVybCIsImNvQXV0aG9ycyIsImF1dGhvcnMiLCJnZXRBdXRob3IiLCJtYXAiLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJpdGVtVHlwZSIsImZ1bmMiLCJ3b3Jrc3BhY2UiLCJr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RUFBRU4sbUJBQVVDLE1BQVYsQ0FBaUJDLFVBVEo7QUFVeEJyQyxFQUFBQSxRQUFRLEVBQUVtQyxtQkFBVUMsTUFBVixDQUFpQkMsVUFWSDtBQVd4QkssRUFBQUEsT0FBTyxFQUFFUCxtQkFBVUMsTUFBVixDQUFpQkMsVUFYRjtBQVl4Qk0sRUFBQUEsUUFBUSxFQUFFUixtQkFBVUMsTUFBVixDQUFpQkMsVUFaSDtBQWF4Qk8sRUFBQUEsTUFBTSxFQUFFVCxtQkFBVUMsTUFBVixDQUFpQkMsVUFiRDtBQWV4QjtBQUNBUSxFQUFBQSxPQUFPLEVBQUVWLG1CQUFVSyxJQUFWLENBQWVILFVBaEJBO0FBaUJ4QnRDLEVBQUFBLGFBQWEsRUFBRW9DLG1CQUFVSyxJQUFWLENBQWVIO0FBakJOLEM7O2dCQURQMUQsZ0IsaUNBc0JkQSxnQkFBZ0IsQ0FBQ21FLGdCO0FBRXBCO0FBQ0E1QyxFQUFBQSxrQkFBa0IsRUFBRWlDLG1CQUFVRyxJQUFWLENBQWVELFU7QUFDbkNsQyxFQUFBQSxXQUFXLEVBQUVnQyxtQkFBVUcsSUFBVixDQUFlRCxVO0FBRTVCO0FBQ0E5QixFQUFBQSxhQUFhLEVBQUU0QixtQkFBVUssSUFBVixDQUFlSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtlbW9qaWZ5fSBmcm9tICdub2RlLWVtb2ppJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IE11bHRpRmlsZVBhdGNoQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9tdWx0aS1maWxlLXBhdGNoLWNvbnRyb2xsZXInO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0RGV0YWlsVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBkcmlsbGVkUHJvcFR5cGVzID0ge1xuICAgIC8vIE1vZGVsIHByb3BlcnRpZXNcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWl0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY3VycmVudFJlbW90ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzQ29tbWl0UHVzaGVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1UeXBlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gZnVuY3Rpb25zXG4gICAgZGVzdHJveTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdXJmYWNlQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAuLi5Db21taXREZXRhaWxWaWV3LmRyaWxsZWRQcm9wVHlwZXMsXG5cbiAgICAvLyBDb250cm9sbGVyIHN0YXRlXG4gICAgbWVzc2FnZUNvbGxhcHNpYmxlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG1lc3NhZ2VPcGVuOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIGZ1bmN0aW9uc1xuICAgIHRvZ2dsZU1lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmUm9vdCA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb21taXQgPSB0aGlzLnByb3BzLmNvbW1pdDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3XCIgcmVmPXt0aGlzLnJlZlJvb3Quc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1oZWFkZXIgbmF0aXZlLWtleS1iaW5kaW5nc1wiIHRhYkluZGV4PVwiLTFcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LWNvbW1pdFwiPlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LXRpdGxlXCI+XG4gICAgICAgICAgICAgIHtlbW9qaWZ5KGNvbW1pdC5nZXRNZXNzYWdlU3ViamVjdCgpKX1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LW1ldGFcIj5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXV0aG9ycygpfVxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1tZXRhVGV4dFwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLmdldEF1dGhvckluZm8oKX0gY29tbWl0dGVkIHt0aGlzLmh1bWFuaXplVGltZVNpbmNlKGNvbW1pdC5nZXRBdXRob3JEYXRlKCkpfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctc2hhXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucmVuZGVyRG90Q29tTGluaygpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyU2hvd01vcmVCdXR0b24oKX1cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdE1lc3NhZ2VCb2R5KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8TXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyXG4gICAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e2NvbW1pdC5nZXRNdWx0aUZpbGVEaWZmKCl9XG4gICAgICAgICAgc3VyZmFjZT17dGhpcy5wcm9wcy5zdXJmYWNlQ29tbWl0fVxuICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yZWZSb290fT5cbiAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdXJmYWNlXCIgY2FsbGJhY2s9e3RoaXMucHJvcHMuc3VyZmFjZUNvbW1pdH0gLz5cbiAgICAgIDwvQ29tbWFuZHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1pdE1lc3NhZ2VCb2R5KCkge1xuICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMucHJvcHMubWVzc2FnZUNvbGxhcHNpYmxlICYmICF0aGlzLnByb3BzLm1lc3NhZ2VPcGVuO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxwcmUgY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctbW9yZVRleHRcIj5cbiAgICAgICAge2NvbGxhcHNlZCA/IHRoaXMucHJvcHMuY29tbWl0LmFiYnJldmlhdGVkQm9keSgpIDogdGhpcy5wcm9wcy5jb21taXQuZ2V0TWVzc2FnZUJvZHkoKX1cbiAgICAgIDwvcHJlPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJTaG93TW9yZUJ1dHRvbigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMubWVzc2FnZUNvbGxhcHNpYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBidXR0b25UZXh0ID0gdGhpcy5wcm9wcy5tZXNzYWdlT3BlbiA/ICdTaG93IExlc3MnIDogJ1Nob3cgTW9yZSc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLUNvbW1pdERldGFpbFZpZXctbW9yZUJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMucHJvcHMudG9nZ2xlTWVzc2FnZX0+e2J1dHRvblRleHR9PC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIGh1bWFuaXplVGltZVNpbmNlKGRhdGUpIHtcbiAgICByZXR1cm4gbW9tZW50KGRhdGUgKiAxMDAwKS5mcm9tTm93KCk7XG4gIH1cblxuICByZW5kZXJEb3RDb21MaW5rKCkge1xuICAgIGNvbnN0IHJlbW90ZSA9IHRoaXMucHJvcHMuY3VycmVudFJlbW90ZTtcbiAgICBjb25zdCBzaGEgPSB0aGlzLnByb3BzLmNvbW1pdC5nZXRTaGEoKTtcbiAgICBpZiAocmVtb3RlLmlzR2l0aHViUmVwbygpICYmIHRoaXMucHJvcHMuaXNDb21taXRQdXNoZWQpIHtcbiAgICAgIGNvbnN0IHJlcG9VcmwgPSBgaHR0cHM6Ly9naXRodWIuY29tLyR7cmVtb3RlLmdldE93bmVyKCl9LyR7cmVtb3RlLmdldFJlcG8oKX1gO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGEgaHJlZj17YCR7cmVwb1VybH0vY29tbWl0LyR7c2hhfWB9XG4gICAgICAgICAgdGl0bGU9e2BvcGVuIGNvbW1pdCAke3NoYX0gb24gR2l0SHViLmNvbWB9PlxuICAgICAgICAgIHtzaGF9XG4gICAgICAgIDwvYT5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoPHNwYW4+e3NoYX08L3NwYW4+KTtcbiAgICB9XG4gIH1cblxuICBnZXRBdXRob3JJbmZvKCkge1xuICAgIGNvbnN0IGNvbW1pdCA9IHRoaXMucHJvcHMuY29tbWl0O1xuICAgIGNvbnN0IGNvQXV0aG9yQ291bnQgPSBjb21taXQuZ2V0Q29BdXRob3JzKCkubGVuZ3RoO1xuICAgIGlmIChjb0F1dGhvckNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gY29tbWl0LmdldEF1dGhvck5hbWUoKTtcbiAgICB9IGVsc2UgaWYgKGNvQXV0aG9yQ291bnQgPT09IDEpIHtcbiAgICAgIHJldHVybiBgJHtjb21taXQuZ2V0QXV0aG9yTmFtZSgpfSBhbmQgJHtjb21taXQuZ2V0Q29BdXRob3JzKClbMF0uZ2V0RnVsbE5hbWUoKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYCR7Y29tbWl0LmdldEF1dGhvck5hbWUoKX0gYW5kICR7Y29BdXRob3JDb3VudH0gb3RoZXJzYDtcbiAgICB9XG4gIH1cblxuICByZW5kZXJBdXRob3IoYXV0aG9yKSB7XG4gICAgY29uc3QgZW1haWwgPSBhdXRob3IuZ2V0RW1haWwoKTtcbiAgICBjb25zdCBhdmF0YXJVcmwgPSBhdXRob3IuZ2V0QXZhdGFyVXJsKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItQ29tbWl0RGV0YWlsVmlldy1hdmF0YXIgZ2l0aHViLVJlY2VudENvbW1pdC1hdmF0YXJcIlxuICAgICAgICBrZXk9e2VtYWlsfVxuICAgICAgICBzcmM9e2F2YXRhclVybH1cbiAgICAgICAgdGl0bGU9e2VtYWlsfVxuICAgICAgICBhbHQ9e2Ake2VtYWlsfSdzIGF2YXRhcidgfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQXV0aG9ycygpIHtcbiAgICBjb25zdCBjb0F1dGhvcnMgPSB0aGlzLnByb3BzLmNvbW1pdC5nZXRDb0F1dGhvcnMoKTtcbiAgICBjb25zdCBhdXRob3JzID0gW3RoaXMucHJvcHMuY29tbWl0LmdldEF1dGhvcigpLCAuLi5jb0F1dGhvcnNdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Db21taXREZXRhaWxWaWV3LWF1dGhvcnMgZ2l0aHViLVJlY2VudENvbW1pdC1hdXRob3JzXCI+XG4gICAgICAgIHthdXRob3JzLm1hcCh0aGlzLnJlbmRlckF1dGhvcil9XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxufVxuIl19