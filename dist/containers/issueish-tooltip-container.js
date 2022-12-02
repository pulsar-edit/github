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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2lzc3VlaXNoLXRvb2x0aXAtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbInR5cGVBbmRTdGF0ZVRvSWNvbiIsIklzc3VlIiwiT1BFTiIsIkNMT1NFRCIsIlB1bGxSZXF1ZXN0IiwiTUVSR0VEIiwiQmFyZUlzc3VlaXNoVG9vbHRpcENvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVzb3VyY2UiLCJwcm9wcyIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJyZXBvc2l0b3J5Iiwic3RhdGUiLCJudW1iZXIiLCJ0aXRsZSIsIl9fdHlwZW5hbWUiLCJpY29ucyIsImljb24iLCJhdmF0YXJVcmwiLCJsb2dpbiIsInRvTG93ZXJDYXNlIiwib3duZXIiLCJuYW1lIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJpc3N1ZSIsInB1bGxSZXF1ZXN0IiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxrQkFBa0IsR0FBRztBQUN6QkMsRUFBQUEsS0FBSyxFQUFFO0FBQ0xDLElBQUFBLElBQUksRUFBRSxjQUREO0FBRUxDLElBQUFBLE1BQU0sRUFBRTtBQUZILEdBRGtCO0FBS3pCQyxFQUFBQSxXQUFXLEVBQUU7QUFDWEYsSUFBQUEsSUFBSSxFQUFFLGtCQURLO0FBRVhDLElBQUFBLE1BQU0sRUFBRSxrQkFGRztBQUdYRSxJQUFBQSxNQUFNLEVBQUU7QUFIRztBQUxZLENBQTNCOztBQVlPLE1BQU1DLDRCQUFOLFNBQTJDQyxlQUFNQyxTQUFqRCxDQUEyRDtBQVFoRUMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsUUFBUSxHQUFHLEtBQUtDLEtBQUwsQ0FBV0QsUUFBNUI7QUFDQSxVQUFNRSxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0UsTUFBVCxJQUFtQkMsbUJBQWxDO0FBRUEsVUFBTTtBQUFDQyxNQUFBQSxVQUFEO0FBQWFDLE1BQUFBLEtBQWI7QUFBb0JDLE1BQUFBLE1BQXBCO0FBQTRCQyxNQUFBQSxLQUE1QjtBQUFtQ0MsTUFBQUE7QUFBbkMsUUFBaURSLFFBQXZEO0FBQ0EsVUFBTVMsS0FBSyxHQUFHbkIsa0JBQWtCLENBQUNrQixVQUFELENBQWxCLElBQWtDLEVBQWhEO0FBQ0EsVUFBTUUsSUFBSSxHQUFHRCxLQUFLLENBQUNKLEtBQUQsQ0FBTCxJQUFnQixFQUE3QjtBQUNBLFdBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQStCLE1BQUEsR0FBRyxFQUFFSCxNQUFNLENBQUNTLFNBQTNDO0FBQXNELE1BQUEsS0FBSyxFQUFFVCxNQUFNLENBQUNVLEtBQXBFO0FBQ0UsTUFBQSxHQUFHLEVBQUVWLE1BQU0sQ0FBQ1U7QUFEZCxNQURGLEVBSUU7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQWdDTCxLQUFoQyxDQUpGLENBREYsRUFPRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUFNLE1BQUEsU0FBUyxFQUFFLHlCQUFHLGdCQUFILEVBQXFCLE9BQXJCLEVBQThCRixLQUFLLENBQUNRLFdBQU4sRUFBOUI7QUFBakIsT0FDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFFSDtBQUFmLE1BREYsRUFFR0wsS0FBSyxDQUFDUSxXQUFOLEVBRkgsQ0FERixFQUtFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FDR1QsVUFBVSxDQUFDVSxLQUFYLENBQWlCRixLQURwQixPQUM0QlIsVUFBVSxDQUFDVyxJQUR2QyxPQUM4Q1QsTUFEOUMsQ0FMRixDQVBGLENBREY7QUFtQkQ7O0FBbEMrRDs7OztnQkFBckRWLDRCLGVBQ1E7QUFDakJJLEVBQUFBLFFBQVEsRUFBRWdCLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3hCQyxJQUFBQSxLQUFLLEVBQUVGLG1CQUFVQyxLQUFWLENBQWdCLEVBQWhCLENBRGlCO0FBRXhCRSxJQUFBQSxXQUFXLEVBQUVILG1CQUFVQyxLQUFWLENBQWdCLEVBQWhCO0FBRlcsR0FBaEIsRUFHUEc7QUFKYyxDOztlQW9DTix5Q0FBd0J4Qiw0QkFBeEIsRUFBc0Q7QUFDbkVJLEVBQUFBLFFBQVE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQyRCxDQUF0RCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge0dIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCB0eXBlQW5kU3RhdGVUb0ljb24gPSB7XG4gIElzc3VlOiB7XG4gICAgT1BFTjogJ2lzc3VlLW9wZW5lZCcsXG4gICAgQ0xPU0VEOiAnaXNzdWUtY2xvc2VkJyxcbiAgfSxcbiAgUHVsbFJlcXVlc3Q6IHtcbiAgICBPUEVOOiAnZ2l0LXB1bGwtcmVxdWVzdCcsXG4gICAgQ0xPU0VEOiAnZ2l0LXB1bGwtcmVxdWVzdCcsXG4gICAgTUVSR0VEOiAnZ2l0LW1lcmdlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBjbGFzcyBCYXJlSXNzdWVpc2hUb29sdGlwQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXNvdXJjZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlzc3VlOiBQcm9wVHlwZXMuc2hhcGUoe30pLFxuICAgICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7fSksXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXNvdXJjZSA9IHRoaXMucHJvcHMucmVzb3VyY2U7XG4gICAgY29uc3QgYXV0aG9yID0gcmVzb3VyY2UuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICBjb25zdCB7cmVwb3NpdG9yeSwgc3RhdGUsIG51bWJlciwgdGl0bGUsIF9fdHlwZW5hbWV9ID0gcmVzb3VyY2U7XG4gICAgY29uc3QgaWNvbnMgPSB0eXBlQW5kU3RhdGVUb0ljb25bX190eXBlbmFtZV0gfHwge307XG4gICAgY29uc3QgaWNvbiA9IGljb25zW3N0YXRlXSB8fCAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hUb29sdGlwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXNzdWVpc2gtYXZhdGFyLWFuZC10aXRsZVwiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiYXV0aG9yLWF2YXRhclwiIHNyYz17YXV0aG9yLmF2YXRhclVybH0gdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImlzc3VlaXNoLXRpdGxlXCI+e3RpdGxlfTwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlzc3VlaXNoLWJhZGdlLWFuZC1saW5rXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeCgnaXNzdWVpc2gtYmFkZ2UnLCAnYmFkZ2UnLCBzdGF0ZS50b0xvd2VyQ2FzZSgpKX0+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPXtpY29ufSAvPlxuICAgICAgICAgICAge3N0YXRlLnRvTG93ZXJDYXNlKCl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlzc3VlaXNoLWxpbmtcIj5cbiAgICAgICAgICAgIHtyZXBvc2l0b3J5Lm93bmVyLmxvZ2lufS97cmVwb3NpdG9yeS5uYW1lfSN7bnVtYmVyfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVJc3N1ZWlzaFRvb2x0aXBDb250YWluZXIsIHtcbiAgcmVzb3VyY2U6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlIG9uIFVuaWZvcm1SZXNvdXJjZUxvY2F0YWJsZSB7XG4gICAgICBfX3R5cGVuYW1lXG5cbiAgICAgIC4uLiBvbiBJc3N1ZSB7XG4gICAgICAgIHN0YXRlIG51bWJlciB0aXRsZVxuICAgICAgICByZXBvc2l0b3J5IHsgbmFtZSBvd25lciB7IGxvZ2luIH0gfVxuICAgICAgICBhdXRob3IgeyBsb2dpbiBhdmF0YXJVcmwgfVxuICAgICAgfVxuICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgICAgc3RhdGUgbnVtYmVyIHRpdGxlXG4gICAgICAgIHJlcG9zaXRvcnkgeyBuYW1lIG93bmVyIHsgbG9naW4gfSB9XG4gICAgICAgIGF1dGhvciB7IGxvZ2luIGF2YXRhclVybCB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=