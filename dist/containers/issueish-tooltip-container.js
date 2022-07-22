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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-IssueishTooltip"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "issueish-avatar-and-title"
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      title: author.login,
      alt: author.login
    }), /*#__PURE__*/_react.default.createElement("h3", {
      className: "issueish-title"
    }, title)), /*#__PURE__*/_react.default.createElement("div", {
      className: "issueish-badge-and-link"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)('issueish-badge', 'badge', state.toLowerCase())
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: icon
    }), state.toLowerCase()), /*#__PURE__*/_react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2lzc3VlaXNoLXRvb2x0aXAtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbInR5cGVBbmRTdGF0ZVRvSWNvbiIsIklzc3VlIiwiT1BFTiIsIkNMT1NFRCIsIlB1bGxSZXF1ZXN0IiwiTUVSR0VEIiwiQmFyZUlzc3VlaXNoVG9vbHRpcENvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVzb3VyY2UiLCJwcm9wcyIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJyZXBvc2l0b3J5Iiwic3RhdGUiLCJudW1iZXIiLCJ0aXRsZSIsIl9fdHlwZW5hbWUiLCJpY29ucyIsImljb24iLCJhdmF0YXJVcmwiLCJsb2dpbiIsInRvTG93ZXJDYXNlIiwib3duZXIiLCJuYW1lIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJpc3N1ZSIsInB1bGxSZXF1ZXN0IiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxrQkFBa0IsR0FBRztBQUN6QkMsRUFBQUEsS0FBSyxFQUFFO0FBQ0xDLElBQUFBLElBQUksRUFBRSxjQUREO0FBRUxDLElBQUFBLE1BQU0sRUFBRTtBQUZILEdBRGtCO0FBS3pCQyxFQUFBQSxXQUFXLEVBQUU7QUFDWEYsSUFBQUEsSUFBSSxFQUFFLGtCQURLO0FBRVhDLElBQUFBLE1BQU0sRUFBRSxrQkFGRztBQUdYRSxJQUFBQSxNQUFNLEVBQUU7QUFIRztBQUxZLENBQTNCOztBQVlPLE1BQU1DLDRCQUFOLFNBQTJDQyxlQUFNQyxTQUFqRCxDQUEyRDtBQVFoRUMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsUUFBUSxHQUFHLEtBQUtDLEtBQUwsQ0FBV0QsUUFBNUI7QUFDQSxVQUFNRSxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0UsTUFBVCxJQUFtQkMsbUJBQWxDO0FBRUEsVUFBTTtBQUFDQyxNQUFBQSxVQUFEO0FBQWFDLE1BQUFBLEtBQWI7QUFBb0JDLE1BQUFBLE1BQXBCO0FBQTRCQyxNQUFBQSxLQUE1QjtBQUFtQ0MsTUFBQUE7QUFBbkMsUUFBaURSLFFBQXZEO0FBQ0EsVUFBTVMsS0FBSyxHQUFHbkIsa0JBQWtCLENBQUNrQixVQUFELENBQWxCLElBQWtDLEVBQWhEO0FBQ0EsVUFBTUUsSUFBSSxHQUFHRCxLQUFLLENBQUNKLEtBQUQsQ0FBTCxJQUFnQixFQUE3QjtBQUNBLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQStCLE1BQUEsR0FBRyxFQUFFSCxNQUFNLENBQUNTLFNBQTNDO0FBQXNELE1BQUEsS0FBSyxFQUFFVCxNQUFNLENBQUNVLEtBQXBFO0FBQ0UsTUFBQSxHQUFHLEVBQUVWLE1BQU0sQ0FBQ1U7QUFEZCxNQURGLGVBSUU7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQWdDTCxLQUFoQyxDQUpGLENBREYsZUFPRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBTSxNQUFBLFNBQVMsRUFBRSx5QkFBRyxnQkFBSCxFQUFxQixPQUFyQixFQUE4QkYsS0FBSyxDQUFDUSxXQUFOLEVBQTlCO0FBQWpCLG9CQUNFLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUVIO0FBQWYsTUFERixFQUVHTCxLQUFLLENBQUNRLFdBQU4sRUFGSCxDQURGLGVBS0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUNHVCxVQUFVLENBQUNVLEtBQVgsQ0FBaUJGLEtBRHBCLE9BQzRCUixVQUFVLENBQUNXLElBRHZDLE9BQzhDVCxNQUQ5QyxDQUxGLENBUEYsQ0FERjtBQW1CRDs7QUFsQytEOzs7O2dCQUFyRFYsNEIsZUFDUTtBQUNqQkksRUFBQUEsUUFBUSxFQUFFZ0IsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDeEJDLElBQUFBLEtBQUssRUFBRUYsbUJBQVVDLEtBQVYsQ0FBZ0IsRUFBaEIsQ0FEaUI7QUFFeEJFLElBQUFBLFdBQVcsRUFBRUgsbUJBQVVDLEtBQVYsQ0FBZ0IsRUFBaEI7QUFGVyxHQUFoQixFQUdQRztBQUpjLEM7O2VBb0NOLHlDQUF3QnhCLDRCQUF4QixFQUFzRDtBQUNuRUksRUFBQUEsUUFBUTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRDJELENBQXRELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7R0hPU1RfVVNFUn0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmNvbnN0IHR5cGVBbmRTdGF0ZVRvSWNvbiA9IHtcbiAgSXNzdWU6IHtcbiAgICBPUEVOOiAnaXNzdWUtb3BlbmVkJyxcbiAgICBDTE9TRUQ6ICdpc3N1ZS1jbG9zZWQnLFxuICB9LFxuICBQdWxsUmVxdWVzdDoge1xuICAgIE9QRU46ICdnaXQtcHVsbC1yZXF1ZXN0JyxcbiAgICBDTE9TRUQ6ICdnaXQtcHVsbC1yZXF1ZXN0JyxcbiAgICBNRVJHRUQ6ICdnaXQtbWVyZ2UnLFxuICB9LFxufTtcblxuZXhwb3J0IGNsYXNzIEJhcmVJc3N1ZWlzaFRvb2x0aXBDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlc291cmNlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaXNzdWU6IFByb3BUeXBlcy5zaGFwZSh7fSksXG4gICAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHt9KSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy5wcm9wcy5yZXNvdXJjZTtcbiAgICBjb25zdCBhdXRob3IgPSByZXNvdXJjZS5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIGNvbnN0IHtyZXBvc2l0b3J5LCBzdGF0ZSwgbnVtYmVyLCB0aXRsZSwgX190eXBlbmFtZX0gPSByZXNvdXJjZTtcbiAgICBjb25zdCBpY29ucyA9IHR5cGVBbmRTdGF0ZVRvSWNvbltfX3R5cGVuYW1lXSB8fCB7fTtcbiAgICBjb25zdCBpY29uID0gaWNvbnNbc3RhdGVdIHx8ICcnO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaFRvb2x0aXBcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpc3N1ZWlzaC1hdmF0YXItYW5kLXRpdGxlXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgc3JjPXthdXRob3IuYXZhdGFyVXJsfSB0aXRsZT17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiaXNzdWVpc2gtdGl0bGVcIj57dGl0bGV9PC9oMz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXNzdWVpc2gtYmFkZ2UtYW5kLWxpbmtcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2N4KCdpc3N1ZWlzaC1iYWRnZScsICdiYWRnZScsIHN0YXRlLnRvTG93ZXJDYXNlKCkpfT5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249e2ljb259IC8+XG4gICAgICAgICAgICB7c3RhdGUudG9Mb3dlckNhc2UoKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaXNzdWVpc2gtbGlua1wiPlxuICAgICAgICAgICAge3JlcG9zaXRvcnkub3duZXIubG9naW59L3tyZXBvc2l0b3J5Lm5hbWV9I3tudW1iZXJ9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUlzc3VlaXNoVG9vbHRpcENvbnRhaW5lciwge1xuICByZXNvdXJjZTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2Ugb24gVW5pZm9ybVJlc291cmNlTG9jYXRhYmxlIHtcbiAgICAgIF9fdHlwZW5hbWVcblxuICAgICAgLi4uIG9uIElzc3VlIHtcbiAgICAgICAgc3RhdGUgbnVtYmVyIHRpdGxlXG4gICAgICAgIHJlcG9zaXRvcnkgeyBuYW1lIG93bmVyIHsgbG9naW4gfSB9XG4gICAgICAgIGF1dGhvciB7IGxvZ2luIGF2YXRhclVybCB9XG4gICAgICB9XG4gICAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xuICAgICAgICBzdGF0ZSBudW1iZXIgdGl0bGVcbiAgICAgICAgcmVwb3NpdG9yeSB7IG5hbWUgb3duZXIgeyBsb2dpbiB9IH1cbiAgICAgICAgYXV0aG9yIHsgbG9naW4gYXZhdGFyVXJsIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==