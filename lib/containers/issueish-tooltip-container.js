"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueishTooltipContainer = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const typeAndStateToIcon = {
  Issue: {
    OPEN: 'issue-opened',
    CLOSED: 'issue-closed'
  },
  PullRequest: {
    OPEN: 'git-pull-request',
    CLOSED: 'git-pull-request',
    MERGED: 'git-merge'
  }
};
class BareIssueishTooltipContainer extends _react.default.Component {
  render() {
    const resource = this.props.resource;
    const author = resource.author || _helpers.GHOST_USER;
    const {
      repository,
      state,
      number,
      title,
      __typename
    } = resource;
    const icons = typeAndStateToIcon[__typename] || {};
    const icon = icons[state] || '';
    return _react.default.createElement("div", {
      className: "github-IssueishTooltip"
    }, _react.default.createElement("div", {
      className: "issueish-avatar-and-title"
    }, _react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      title: author.login,
      alt: author.login
    }), _react.default.createElement("h3", {
      className: "issueish-title"
    }, title)), _react.default.createElement("div", {
      className: "issueish-badge-and-link"
    }, _react.default.createElement("span", {
      className: (0, _classnames.default)('issueish-badge', 'badge', state.toLowerCase())
    }, _react.default.createElement(_octicon.default, {
      icon: icon
    }), state.toLowerCase()), _react.default.createElement("span", {
      className: "issueish-link"
    }, repository.owner.login, "/", repository.name, "#", number)));
  }
}
exports.BareIssueishTooltipContainer = BareIssueishTooltipContainer;
_defineProperty(BareIssueishTooltipContainer, "propTypes", {
  resource: _propTypes.default.shape({
    issue: _propTypes.default.shape({}),
    pullRequest: _propTypes.default.shape({})
  }).isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareIssueishTooltipContainer, {
  resource: function () {
    const node = require("./__generated__/issueishTooltipContainer_resource.graphql");
    if (node.hash && node.hash !== "8980fc73c7ed3f632f0612ce14f2f0d1") {
      console.error("The definition of 'issueishTooltipContainer_resource' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/issueishTooltipContainer_resource.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0eXBlQW5kU3RhdGVUb0ljb24iLCJJc3N1ZSIsIk9QRU4iLCJDTE9TRUQiLCJQdWxsUmVxdWVzdCIsIk1FUkdFRCIsIkJhcmVJc3N1ZWlzaFRvb2x0aXBDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlc291cmNlIiwicHJvcHMiLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwicmVwb3NpdG9yeSIsInN0YXRlIiwibnVtYmVyIiwidGl0bGUiLCJfX3R5cGVuYW1lIiwiaWNvbnMiLCJpY29uIiwiYXZhdGFyVXJsIiwibG9naW4iLCJjeCIsInRvTG93ZXJDYXNlIiwib3duZXIiLCJuYW1lIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJpc3N1ZSIsInB1bGxSZXF1ZXN0IiwiaXNSZXF1aXJlZCIsImNyZWF0ZUZyYWdtZW50Q29udGFpbmVyIl0sInNvdXJjZXMiOlsiaXNzdWVpc2gtdG9vbHRpcC1jb250YWluZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge0dIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCB0eXBlQW5kU3RhdGVUb0ljb24gPSB7XG4gIElzc3VlOiB7XG4gICAgT1BFTjogJ2lzc3VlLW9wZW5lZCcsXG4gICAgQ0xPU0VEOiAnaXNzdWUtY2xvc2VkJyxcbiAgfSxcbiAgUHVsbFJlcXVlc3Q6IHtcbiAgICBPUEVOOiAnZ2l0LXB1bGwtcmVxdWVzdCcsXG4gICAgQ0xPU0VEOiAnZ2l0LXB1bGwtcmVxdWVzdCcsXG4gICAgTUVSR0VEOiAnZ2l0LW1lcmdlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBjbGFzcyBCYXJlSXNzdWVpc2hUb29sdGlwQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXNvdXJjZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlzc3VlOiBQcm9wVHlwZXMuc2hhcGUoe30pLFxuICAgICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7fSksXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IHRoaXMucHJvcHMucmVzb3VyY2U7XG4gICAgY29uc3QgYXV0aG9yID0gcmVzb3VyY2UuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICBjb25zdCB7cmVwb3NpdG9yeSwgc3RhdGUsIG51bWJlciwgdGl0bGUsIF9fdHlwZW5hbWV9ID0gcmVzb3VyY2U7XG4gICAgY29uc3QgaWNvbnMgPSB0eXBlQW5kU3RhdGVUb0ljb25bX190eXBlbmFtZV0gfHwge307XG4gICAgY29uc3QgaWNvbiA9IGljb25zW3N0YXRlXSB8fCAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hUb29sdGlwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXNzdWVpc2gtYXZhdGFyLWFuZC10aXRsZVwiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiYXV0aG9yLWF2YXRhclwiIHNyYz17YXV0aG9yLmF2YXRhclVybH0gdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImlzc3VlaXNoLXRpdGxlXCI+e3RpdGxlfTwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlzc3VlaXNoLWJhZGdlLWFuZC1saW5rXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeCgnaXNzdWVpc2gtYmFkZ2UnLCAnYmFkZ2UnLCBzdGF0ZS50b0xvd2VyQ2FzZSgpKX0+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSAvPlxuICAgICAgICAgICAge3N0YXRlLnRvTG93ZXJDYXNlKCl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlzc3VlaXNoLWxpbmtcIj5cbiAgICAgICAgICAgIHtyZXBvc2l0b3J5Lm93bmVyLmxvZ2lufS97cmVwb3NpdG9yeS5uYW1lfSN7bnVtYmVyfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVJc3N1ZWlzaFRvb2x0aXBDb250YWluZXIsIHtcbiAgcmVzb3VyY2U6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlIG9uIFVuaWZvcm1SZXNvdXJjZUxvY2F0YWJsZSB7XG4gICAgICBfX3R5cGVuYW1lXG5cbiAgICAgIC4uLiBvbiBJc3N1ZSB7XG4gICAgICAgIHN0YXRlIG51bWJlciB0aXRsZVxuICAgICAgICByZXBvc2l0b3J5IHsgbmFtZSBvd25lciB7IGxvZ2luIH0gfVxuICAgICAgICBhdXRob3IgeyBsb2dpbiBhdmF0YXJVcmwgfVxuICAgICAgfVxuICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgICAgc3RhdGUgbnVtYmVyIHRpdGxlXG4gICAgICAgIHJlcG9zaXRvcnkgeyBuYW1lIG93bmVyIHsgbG9naW4gfSB9XG4gICAgICAgIGF1dGhvciB7IGxvZ2luIGF2YXRhclVybCB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFzQztBQUFBO0FBQUE7QUFBQTtBQUV0QyxNQUFNQSxrQkFBa0IsR0FBRztFQUN6QkMsS0FBSyxFQUFFO0lBQ0xDLElBQUksRUFBRSxjQUFjO0lBQ3BCQyxNQUFNLEVBQUU7RUFDVixDQUFDO0VBQ0RDLFdBQVcsRUFBRTtJQUNYRixJQUFJLEVBQUUsa0JBQWtCO0lBQ3hCQyxNQUFNLEVBQUUsa0JBQWtCO0lBQzFCRSxNQUFNLEVBQUU7RUFDVjtBQUNGLENBQUM7QUFFTSxNQUFNQyw0QkFBNEIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFRaEVDLE1BQU0sR0FBRztJQUNQLE1BQU1DLFFBQVEsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsUUFBUTtJQUNwQyxNQUFNRSxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0UsTUFBTSxJQUFJQyxtQkFBVTtJQUU1QyxNQUFNO01BQUNDLFVBQVU7TUFBRUMsS0FBSztNQUFFQyxNQUFNO01BQUVDLEtBQUs7TUFBRUM7SUFBVSxDQUFDLEdBQUdSLFFBQVE7SUFDL0QsTUFBTVMsS0FBSyxHQUFHbkIsa0JBQWtCLENBQUNrQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsTUFBTUUsSUFBSSxHQUFHRCxLQUFLLENBQUNKLEtBQUssQ0FBQyxJQUFJLEVBQUU7SUFDL0IsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUF3QixHQUNyQztNQUFLLFNBQVMsRUFBQztJQUEyQixHQUN4QztNQUFLLFNBQVMsRUFBQyxlQUFlO01BQUMsR0FBRyxFQUFFSCxNQUFNLENBQUNTLFNBQVU7TUFBQyxLQUFLLEVBQUVULE1BQU0sQ0FBQ1UsS0FBTTtNQUN4RSxHQUFHLEVBQUVWLE1BQU0sQ0FBQ1U7SUFBTSxFQUNsQixFQUNGO01BQUksU0FBUyxFQUFDO0lBQWdCLEdBQUVMLEtBQUssQ0FBTSxDQUN2QyxFQUNOO01BQUssU0FBUyxFQUFDO0lBQXlCLEdBQ3RDO01BQU0sU0FBUyxFQUFFLElBQUFNLG1CQUFFLEVBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFUixLQUFLLENBQUNTLFdBQVcsRUFBRTtJQUFFLEdBQ2xFLDZCQUFDLGdCQUFPO01BQUMsSUFBSSxFQUFFSjtJQUFLLEVBQUcsRUFDdEJMLEtBQUssQ0FBQ1MsV0FBVyxFQUFFLENBQ2YsRUFDUDtNQUFNLFNBQVMsRUFBQztJQUFlLEdBQzVCVixVQUFVLENBQUNXLEtBQUssQ0FBQ0gsS0FBSyxPQUFHUixVQUFVLENBQUNZLElBQUksT0FBR1YsTUFBTSxDQUM3QyxDQUNILENBQ0Y7RUFFVjtBQUNGO0FBQUM7QUFBQSxnQkFuQ1lWLDRCQUE0QixlQUNwQjtFQUNqQkksUUFBUSxFQUFFaUIsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQ3hCQyxLQUFLLEVBQUVGLGtCQUFTLENBQUNDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQkUsV0FBVyxFQUFFSCxrQkFBUyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ2pDLENBQUMsQ0FBQyxDQUFDRztBQUNMLENBQUM7QUFBQSxlQStCWSxJQUFBQyxtQ0FBdUIsRUFBQzFCLDRCQUE0QixFQUFFO0VBQ25FSSxRQUFRO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBZ0JWLENBQUMsQ0FBQztBQUFBIn0=