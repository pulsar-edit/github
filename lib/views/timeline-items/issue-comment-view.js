"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueCommentView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../../atom/octicon"));
var _timeago = _interopRequireDefault(require("../timeago"));
var _githubDotcomMarkdown = _interopRequireDefault(require("../github-dotcom-markdown"));
var _helpers = require("../../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareIssueCommentView extends _react.default.Component {
  render() {
    const comment = this.props.item;
    const author = comment.author || _helpers.GHOST_USER;
    return _react.default.createElement("div", {
      className: "issue timeline-item"
    }, _react.default.createElement("div", {
      className: "info-row"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "comment"
    }), _react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      alt: author.login,
      title: author.login
    }), _react.default.createElement("span", {
      className: "comment-message-header"
    }, author.login, " commented", ' ', _react.default.createElement("a", {
      href: comment.url
    }, _react.default.createElement(_timeago.default, {
      time: comment.createdAt
    })))), _react.default.createElement(_githubDotcomMarkdown.default, {
      html: comment.bodyHTML,
      switchToIssueish: this.props.switchToIssueish
    }));
  }
}
exports.BareIssueCommentView = BareIssueCommentView;
_defineProperty(BareIssueCommentView, "propTypes", {
  switchToIssueish: _propTypes.default.func.isRequired,
  item: _propTypes.default.shape({
    author: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    bodyHTML: _propTypes.default.string.isRequired,
    createdAt: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareIssueCommentView, {
  item: function () {
    const node = require("./__generated__/issueCommentView_item.graphql");
    if (node.hash && node.hash !== "adc36c52f51de14256693ab9e4eb84bb") {
      console.error("The definition of 'issueCommentView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/issueCommentView_item.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlSXNzdWVDb21tZW50VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY29tbWVudCIsInByb3BzIiwiaXRlbSIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInVybCIsImNyZWF0ZWRBdCIsImJvZHlIVE1MIiwic3dpdGNoVG9Jc3N1ZWlzaCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic2hhcGUiLCJzdHJpbmciLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciJdLCJzb3VyY2VzIjpbImlzc3VlLWNvbW1lbnQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4uL3RpbWVhZ28nO1xuaW1wb3J0IEdpdGh1YkRvdGNvbU1hcmtkb3duIGZyb20gJy4uL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IHtHSE9TVF9VU0VSfSBmcm9tICcuLi8uLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVJc3N1ZUNvbW1lbnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGl0ZW06IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBhdXRob3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBib2R5SFRNTDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgY3JlYXRlZEF0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgY29uc3QgYXV0aG9yID0gY29tbWVudC5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImlzc3VlIHRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvLXJvd1wiPlxuICAgICAgICAgIDxPY3RpY29uIGNsYXNzTmFtZT1cInByZS10aW1lbGluZS1pdGVtLWljb25cIiBpY29uPVwiY29tbWVudFwiIC8+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgc3JjPXthdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgYWx0PXthdXRob3IubG9naW59IHRpdGxlPXthdXRob3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tZW50LW1lc3NhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICB7YXV0aG9yLmxvZ2lufSBjb21tZW50ZWRcbiAgICAgICAgICAgIHsnICd9PGEgaHJlZj17Y29tbWVudC51cmx9PjxUaW1lYWdvIHRpbWU9e2NvbW1lbnQuY3JlYXRlZEF0fSAvPjwvYT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8R2l0aHViRG90Y29tTWFya2Rvd24gaHRtbD17Y29tbWVudC5ib2R5SFRNTH0gc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlSXNzdWVDb21tZW50Vmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGlzc3VlQ29tbWVudFZpZXdfaXRlbSBvbiBJc3N1ZUNvbW1lbnQge1xuICAgICAgYXV0aG9yIHtcbiAgICAgICAgYXZhdGFyVXJsIGxvZ2luXG4gICAgICB9XG4gICAgICBib2R5SFRNTCBjcmVhdGVkQXQgdXJsXG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQXlDO0FBQUE7QUFBQTtBQUFBO0FBRWxDLE1BQU1BLG9CQUFvQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWN4REMsTUFBTSxHQUFHO0lBQ1AsTUFBTUMsT0FBTyxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxJQUFJO0lBQy9CLE1BQU1DLE1BQU0sR0FBR0gsT0FBTyxDQUFDRyxNQUFNLElBQUlDLG1CQUFVO0lBRTNDLE9BQ0U7TUFBSyxTQUFTLEVBQUM7SUFBcUIsR0FDbEM7TUFBSyxTQUFTLEVBQUM7SUFBVSxHQUN2Qiw2QkFBQyxnQkFBTztNQUFDLFNBQVMsRUFBQyx3QkFBd0I7TUFBQyxJQUFJLEVBQUM7SUFBUyxFQUFHLEVBQzdEO01BQUssU0FBUyxFQUFDLGVBQWU7TUFBQyxHQUFHLEVBQUVELE1BQU0sQ0FBQ0UsU0FBVTtNQUNuRCxHQUFHLEVBQUVGLE1BQU0sQ0FBQ0csS0FBTTtNQUFDLEtBQUssRUFBRUgsTUFBTSxDQUFDRztJQUFNLEVBQ3ZDLEVBQ0Y7TUFBTSxTQUFTLEVBQUM7SUFBd0IsR0FDckNILE1BQU0sQ0FBQ0csS0FBSyxnQkFDWixHQUFHLEVBQUM7TUFBRyxJQUFJLEVBQUVOLE9BQU8sQ0FBQ087SUFBSSxHQUFDLDZCQUFDLGdCQUFPO01BQUMsSUFBSSxFQUFFUCxPQUFPLENBQUNRO0lBQVUsRUFBRyxDQUFJLENBQzlELENBQ0gsRUFDTiw2QkFBQyw2QkFBb0I7TUFBQyxJQUFJLEVBQUVSLE9BQU8sQ0FBQ1MsUUFBUztNQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQ1IsS0FBSyxDQUFDUztJQUFpQixFQUFHLENBQzNGO0VBRVY7QUFDRjtBQUFDO0FBQUEsZ0JBbENZZCxvQkFBb0IsZUFDWjtFQUNqQmMsZ0JBQWdCLEVBQUVDLGtCQUFTLENBQUNDLElBQUksQ0FBQ0MsVUFBVTtFQUMzQ1gsSUFBSSxFQUFFUyxrQkFBUyxDQUFDRyxLQUFLLENBQUM7SUFDcEJYLE1BQU0sRUFBRVEsa0JBQVMsQ0FBQ0csS0FBSyxDQUFDO01BQ3RCVCxTQUFTLEVBQUVNLGtCQUFTLENBQUNJLE1BQU0sQ0FBQ0YsVUFBVTtNQUN0Q1AsS0FBSyxFQUFFSyxrQkFBUyxDQUFDSSxNQUFNLENBQUNGO0lBQzFCLENBQUMsQ0FBQztJQUNGSixRQUFRLEVBQUVFLGtCQUFTLENBQUNJLE1BQU0sQ0FBQ0YsVUFBVTtJQUNyQ0wsU0FBUyxFQUFFRyxrQkFBUyxDQUFDSSxNQUFNLENBQUNGLFVBQVU7SUFDdENOLEdBQUcsRUFBRUksa0JBQVMsQ0FBQ0ksTUFBTSxDQUFDRjtFQUN4QixDQUFDLENBQUMsQ0FBQ0E7QUFDTCxDQUFDO0FBQUEsZUF3QlksSUFBQUcsbUNBQXVCLEVBQUNwQixvQkFBb0IsRUFBRTtFQUMzRE0sSUFBSTtJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQVFOLENBQUMsQ0FBQztBQUFBIn0=