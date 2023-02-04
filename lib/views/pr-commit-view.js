"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PrCommitView = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _nodeEmoji = require("node-emoji");
var _moment = _interopRequireDefault(require("moment"));
var _reactRelay = require("react-relay");
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const avatarAltText = 'committer avatar';
class PrCommitView extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "openCommitDetailItem", () => this.props.openCommit({
      sha: this.props.item.sha
    }));
    this.state = {
      showMessageBody: false
    };
    (0, _helpers.autobind)(this, 'toggleShowCommitMessageBody', 'humanizeTimeSince');
  }
  toggleShowCommitMessageBody() {
    this.setState({
      showMessageBody: !this.state.showMessageBody
    });
  }
  humanizeTimeSince(date) {
    return (0, _moment.default)(date).fromNow();
  }
  render() {
    const {
      messageHeadline,
      messageBody,
      shortSha,
      url
    } = this.props.item;
    const {
      avatarUrl,
      name,
      date
    } = this.props.item.committer;
    return _react.default.createElement("div", {
      className: "github-PrCommitView-container"
    }, _react.default.createElement("div", {
      className: "github-PrCommitView-commit"
    }, _react.default.createElement("h3", {
      className: "github-PrCommitView-title"
    }, this.props.onBranch ? _react.default.createElement("button", {
      className: "github-PrCommitView-messageHeadline is-button",
      onClick: this.openCommitDetailItem
    }, (0, _nodeEmoji.emojify)(messageHeadline)) : _react.default.createElement("span", {
      className: "github-PrCommitView-messageHeadline"
    }, (0, _nodeEmoji.emojify)(messageHeadline)), messageBody ? _react.default.createElement("button", {
      className: "github-PrCommitView-moreButton",
      onClick: this.toggleShowCommitMessageBody
    }, this.state.showMessageBody ? 'hide' : 'show', " more...") : null), _react.default.createElement("div", {
      className: "github-PrCommitView-meta"
    }, _react.default.createElement("img", {
      className: "github-PrCommitView-avatar",
      src: avatarUrl,
      alt: avatarAltText,
      title: avatarAltText
    }), _react.default.createElement("span", {
      className: "github-PrCommitView-metaText"
    }, name, " committed ", this.humanizeTimeSince(date))), this.state.showMessageBody ? _react.default.createElement("pre", {
      className: "github-PrCommitView-moreText"
    }, (0, _nodeEmoji.emojify)(messageBody)) : null), _react.default.createElement("div", {
      className: "github-PrCommitView-sha"
    }, _react.default.createElement("a", {
      href: url,
      title: `open commit ${shortSha} on GitHub.com`
    }, shortSha)));
  }
}
exports.PrCommitView = PrCommitView;
_defineProperty(PrCommitView, "propTypes", {
  item: _propTypes.default.shape({
    committer: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired,
      date: _propTypes.default.string.isRequired
    }).isRequired,
    messageBody: _propTypes.default.string,
    messageHeadline: _propTypes.default.string.isRequired,
    shortSha: _propTypes.default.string.isRequired,
    sha: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired,
  onBranch: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(PrCommitView, {
  item: function () {
    const node = require("./__generated__/prCommitView_item.graphql");
    if (node.hash && node.hash !== "2bd193bec5d758f465d9428ff3cd8a09") {
      console.error("The definition of 'prCommitView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/prCommitView_item.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhdmF0YXJBbHRUZXh0IiwiUHJDb21taXRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwib3BlbkNvbW1pdCIsInNoYSIsIml0ZW0iLCJzdGF0ZSIsInNob3dNZXNzYWdlQm9keSIsImF1dG9iaW5kIiwidG9nZ2xlU2hvd0NvbW1pdE1lc3NhZ2VCb2R5Iiwic2V0U3RhdGUiLCJodW1hbml6ZVRpbWVTaW5jZSIsImRhdGUiLCJtb21lbnQiLCJmcm9tTm93IiwicmVuZGVyIiwibWVzc2FnZUhlYWRsaW5lIiwibWVzc2FnZUJvZHkiLCJzaG9ydFNoYSIsInVybCIsImF2YXRhclVybCIsIm5hbWUiLCJjb21taXR0ZXIiLCJvbkJyYW5jaCIsIm9wZW5Db21taXREZXRhaWxJdGVtIiwiZW1vamlmeSIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiXSwic291cmNlcyI6WyJwci1jb21taXQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7ZW1vamlmeX0gZnJvbSAnbm9kZS1lbW9qaSc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBhdmF0YXJBbHRUZXh0ID0gJ2NvbW1pdHRlciBhdmF0YXInO1xuXG5leHBvcnQgY2xhc3MgUHJDb21taXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY29tbWl0dGVyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBkYXRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgbWVzc2FnZUJvZHk6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBtZXNzYWdlSGVhZGxpbmU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHNob3J0U2hhOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBzaGE6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgb25CcmFuY2g6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7c2hvd01lc3NhZ2VCb2R5OiBmYWxzZX07XG4gICAgYXV0b2JpbmQodGhpcywgJ3RvZ2dsZVNob3dDb21taXRNZXNzYWdlQm9keScsICdodW1hbml6ZVRpbWVTaW5jZScpO1xuICB9XG5cbiAgdG9nZ2xlU2hvd0NvbW1pdE1lc3NhZ2VCb2R5KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dNZXNzYWdlQm9keTogIXRoaXMuc3RhdGUuc2hvd01lc3NhZ2VCb2R5fSk7XG4gIH1cblxuICBodW1hbml6ZVRpbWVTaW5jZShkYXRlKSB7XG4gICAgcmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XG4gIH1cblxuICBvcGVuQ29tbWl0RGV0YWlsSXRlbSA9ICgpID0+IHRoaXMucHJvcHMub3BlbkNvbW1pdCh7c2hhOiB0aGlzLnByb3BzLml0ZW0uc2hhfSlcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21lc3NhZ2VIZWFkbGluZSwgbWVzc2FnZUJvZHksIHNob3J0U2hhLCB1cmx9ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIGNvbnN0IHthdmF0YXJVcmwsIG5hbWUsIGRhdGV9ID0gdGhpcy5wcm9wcy5pdGVtLmNvbW1pdHRlcjtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRWaWV3LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctY29tbWl0XCI+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctdGl0bGVcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm9uQnJhbmNoXG4gICAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1tZXNzYWdlSGVhZGxpbmUgaXMtYnV0dG9uXCIgb25DbGljaz17dGhpcy5vcGVuQ29tbWl0RGV0YWlsSXRlbX0+XG4gICAgICAgICAgICAgICAgICB7ZW1vamlmeShtZXNzYWdlSGVhZGxpbmUpfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1tZXNzYWdlSGVhZGxpbmVcIj57ZW1vamlmeShtZXNzYWdlSGVhZGxpbmUpfTwvc3Bhbj5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHttZXNzYWdlQm9keSA/XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRWaWV3LW1vcmVCdXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlU2hvd0NvbW1pdE1lc3NhZ2VCb2R5fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5zaG93TWVzc2FnZUJvZHkgPyAnaGlkZScgOiAnc2hvdyd9IG1vcmUuLi5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgICA8L2gzPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1tZXRhXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctYXZhdGFyXCJcbiAgICAgICAgICAgICAgc3JjPXthdmF0YXJVcmx9XG4gICAgICAgICAgICAgIGFsdD17YXZhdGFyQWx0VGV4dH0gdGl0bGU9e2F2YXRhckFsdFRleHR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1tZXRhVGV4dFwiPlxuICAgICAgICAgICAgICB7bmFtZX0gY29tbWl0dGVkIHt0aGlzLmh1bWFuaXplVGltZVNpbmNlKGRhdGUpfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHt0aGlzLnN0YXRlLnNob3dNZXNzYWdlQm9keSA/IDxwcmUgY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1tb3JlVGV4dFwiPlxuICAgICAgICAgICAge2Vtb2ppZnkobWVzc2FnZUJvZHkpfTwvcHJlPiA6IG51bGx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctc2hhXCI+XG4gICAgICAgICAgPGEgaHJlZj17dXJsfVxuICAgICAgICAgICAgdGl0bGU9e2BvcGVuIGNvbW1pdCAke3Nob3J0U2hhfSBvbiBHaXRIdWIuY29tYH0+XG4gICAgICAgICAgICB7c2hvcnRTaGF9XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoUHJDb21taXRWaWV3LCB7XG4gIGl0ZW06IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJDb21taXRWaWV3X2l0ZW0gb24gQ29tbWl0IHtcbiAgICAgIGNvbW1pdHRlciB7XG4gICAgICAgIGF2YXRhclVybFxuICAgICAgICBuYW1lXG4gICAgICAgIGRhdGVcbiAgICAgIH1cbiAgICAgIG1lc3NhZ2VIZWFkbGluZVxuICAgICAgbWVzc2FnZUJvZHlcbiAgICAgIHNob3J0U2hhOiBhYmJyZXZpYXRlZE9pZFxuICAgICAgc2hhOiBvaWRcbiAgICAgIHVybFxuICAgIH1gLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFvQztBQUFBO0FBQUE7QUFBQTtBQUVwQyxNQUFNQSxhQUFhLEdBQUcsa0JBQWtCO0FBRWpDLE1BQU1DLFlBQVksU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFrQmhEQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUFDLDhDQWFRLE1BQU0sSUFBSSxDQUFDQSxLQUFLLENBQUNDLFVBQVUsQ0FBQztNQUFDQyxHQUFHLEVBQUUsSUFBSSxDQUFDRixLQUFLLENBQUNHLElBQUksQ0FBQ0Q7SUFBRyxDQUFDLENBQUM7SUFaNUUsSUFBSSxDQUFDRSxLQUFLLEdBQUc7TUFBQ0MsZUFBZSxFQUFFO0lBQUssQ0FBQztJQUNyQyxJQUFBQyxpQkFBUSxFQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRSxtQkFBbUIsQ0FBQztFQUNwRTtFQUVBQywyQkFBMkIsR0FBRztJQUM1QixJQUFJLENBQUNDLFFBQVEsQ0FBQztNQUFDSCxlQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUNELEtBQUssQ0FBQ0M7SUFBZSxDQUFDLENB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