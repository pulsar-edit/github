"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareUserMentionTooltipContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareUserMentionTooltipContainer extends _react.default.Component {
  render() {
    const owner = this.props.repositoryOwner;
    const {
      login,
      company,
      repositories,
      membersWithRole
    } = owner;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-UserMentionTooltip"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-UserMentionTooltip-avatar"
    }, /*#__PURE__*/_react.default.createElement("img", {
      alt: "repository owner's avatar",
      src: owner.avatarUrl
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-UserMentionTooltip-info"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-UserMentionTooltip-info-username"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "mention"
    }), /*#__PURE__*/_react.default.createElement("strong", null, login)), company && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "briefcase"
    }), /*#__PURE__*/_react.default.createElement("span", null, company)), membersWithRole && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "organization"
    }), /*#__PURE__*/_react.default.createElement("span", null, membersWithRole.totalCount, " members")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "repo"
    }), /*#__PURE__*/_react.default.createElement("span", null, repositories.totalCount, " repositories"))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        clear: 'both'
      }
    }));
  }

}

exports.BareUserMentionTooltipContainer = BareUserMentionTooltipContainer;

_defineProperty(BareUserMentionTooltipContainer, "propTypes", {
  repositoryOwner: _propTypes.default.shape({
    login: _propTypes.default.string.isRequired,
    avatarUrl: _propTypes.default.string.isRequired,
    repositories: _propTypes.default.shape({
      totalCount: _propTypes.default.number.isRequired
    }).isRequired,
    // Users
    company: _propTypes.default.string,
    // Organizations
    membersWithRole: _propTypes.default.shape({
      totalCount: _propTypes.default.number.isRequired
    })
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareUserMentionTooltipContainer, {
  repositoryOwner: function () {
    const node = require("./__generated__/userMentionTooltipContainer_repositoryOwner.graphql");

    if (node.hash && node.hash !== "3ee858460adcfbee1dfc27cf8dc46332") {
      console.error("The definition of 'userMentionTooltipContainer_repositoryOwner' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/userMentionTooltipContainer_repositoryOwner.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL3VzZXItbWVudGlvbi10b29sdGlwLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJCYXJlVXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJvd25lciIsInByb3BzIiwicmVwb3NpdG9yeU93bmVyIiwibG9naW4iLCJjb21wYW55IiwicmVwb3NpdG9yaWVzIiwibWVtYmVyc1dpdGhSb2xlIiwiYXZhdGFyVXJsIiwidG90YWxDb3VudCIsImNsZWFyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLE1BQU1BLCtCQUFOLFNBQThDQyxlQUFNQyxTQUFwRCxDQUE4RDtBQW1CbkVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLEtBQUssR0FBRyxLQUFLQyxLQUFMLENBQVdDLGVBQXpCO0FBQ0EsVUFBTTtBQUFDQyxNQUFBQSxLQUFEO0FBQVFDLE1BQUFBLE9BQVI7QUFBaUJDLE1BQUFBLFlBQWpCO0FBQStCQyxNQUFBQTtBQUEvQixRQUFrRE4sS0FBeEQ7QUFDQSx3QkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQUssTUFBQSxHQUFHLEVBQUMsMkJBQVQ7QUFBcUMsTUFBQSxHQUFHLEVBQUVBLEtBQUssQ0FBQ087QUFBaEQsTUFERixDQURGLGVBSUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFDO0FBQWQsTUFERixlQUM0Qiw2Q0FBU0osS0FBVCxDQUQ1QixDQURGLEVBSUdDLE9BQU8saUJBQUksdURBQUssNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBQztBQUFkLE1BQUwsZUFBaUMsMkNBQU9BLE9BQVAsQ0FBakMsQ0FKZCxFQUtHRSxlQUFlLGlCQUNkLHVEQUFLLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUM7QUFBZCxNQUFMLGVBQW9DLDJDQUFPQSxlQUFlLENBQUNFLFVBQXZCLGFBQXBDLENBTkosZUFRRSx1REFBSyw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsSUFBSSxFQUFDO0FBQWQsTUFBTCxlQUE0QiwyQ0FBT0gsWUFBWSxDQUFDRyxVQUFwQixrQkFBNUIsQ0FSRixDQUpGLGVBY0U7QUFBSyxNQUFBLEtBQUssRUFBRTtBQUFDQyxRQUFBQSxLQUFLLEVBQUU7QUFBUjtBQUFaLE1BZEYsQ0FERjtBQWtCRDs7QUF4Q2tFOzs7O2dCQUF4RGIsK0IsZUFDUTtBQUNqQk0sRUFBQUEsZUFBZSxFQUFFUSxtQkFBVUMsS0FBVixDQUFnQjtBQUMvQlIsSUFBQUEsS0FBSyxFQUFFTyxtQkFBVUUsTUFBVixDQUFpQkMsVUFETztBQUUvQk4sSUFBQUEsU0FBUyxFQUFFRyxtQkFBVUUsTUFBVixDQUFpQkMsVUFGRztBQUcvQlIsSUFBQUEsWUFBWSxFQUFFSyxtQkFBVUMsS0FBVixDQUFnQjtBQUM1QkgsTUFBQUEsVUFBVSxFQUFFRSxtQkFBVUksTUFBVixDQUFpQkQ7QUFERCxLQUFoQixFQUVYQSxVQUw0QjtBQU8vQjtBQUNBVCxJQUFBQSxPQUFPLEVBQUVNLG1CQUFVRSxNQVJZO0FBVS9CO0FBQ0FOLElBQUFBLGVBQWUsRUFBRUksbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDL0JILE1BQUFBLFVBQVUsRUFBRUUsbUJBQVVJLE1BQVYsQ0FBaUJEO0FBREUsS0FBaEI7QUFYYyxHQUFoQixFQWNkQTtBQWZjLEM7O2VBMENOLHlDQUF3QmpCLCtCQUF4QixFQUF5RDtBQUN0RU0sRUFBQUEsZUFBZTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRHVELENBQXpELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuZXhwb3J0IGNsYXNzIEJhcmVVc2VyTWVudGlvblRvb2x0aXBDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnlPd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHJlcG9zaXRvcmllczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgdG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcblxuICAgICAgLy8gVXNlcnNcbiAgICAgIGNvbXBhbnk6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAgIC8vIE9yZ2FuaXphdGlvbnNcbiAgICAgIG1lbWJlcnNXaXRoUm9sZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgdG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBvd25lciA9IHRoaXMucHJvcHMucmVwb3NpdG9yeU93bmVyO1xuICAgIGNvbnN0IHtsb2dpbiwgY29tcGFueSwgcmVwb3NpdG9yaWVzLCBtZW1iZXJzV2l0aFJvbGV9ID0gb3duZXI7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVVzZXJNZW50aW9uVG9vbHRpcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Vc2VyTWVudGlvblRvb2x0aXAtYXZhdGFyXCI+XG4gICAgICAgICAgPGltZyBhbHQ9XCJyZXBvc2l0b3J5IG93bmVyJ3MgYXZhdGFyXCIgc3JjPXtvd25lci5hdmF0YXJVcmx9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Vc2VyTWVudGlvblRvb2x0aXAtaW5mb1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVVzZXJNZW50aW9uVG9vbHRpcC1pbmZvLXVzZXJuYW1lXCI+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwibWVudGlvblwiIC8+PHN0cm9uZz57bG9naW59PC9zdHJvbmc+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2NvbXBhbnkgJiYgPGRpdj48T2N0aWNvbiBpY29uPVwiYnJpZWZjYXNlXCIgLz48c3Bhbj57Y29tcGFueX08L3NwYW4+PC9kaXY+fVxuICAgICAgICAgIHttZW1iZXJzV2l0aFJvbGUgJiYgKFxuICAgICAgICAgICAgPGRpdj48T2N0aWNvbiBpY29uPVwib3JnYW5pemF0aW9uXCIgLz48c3Bhbj57bWVtYmVyc1dpdGhSb2xlLnRvdGFsQ291bnR9IG1lbWJlcnM8L3NwYW4+PC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8ZGl2PjxPY3RpY29uIGljb249XCJyZXBvXCIgLz48c3Bhbj57cmVwb3NpdG9yaWVzLnRvdGFsQ291bnR9IHJlcG9zaXRvcmllczwvc3Bhbj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tjbGVhcjogJ2JvdGgnfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZVVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciwge1xuICByZXBvc2l0b3J5T3duZXI6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lciBvbiBSZXBvc2l0b3J5T3duZXIge1xuICAgICAgbG9naW5cbiAgICAgIGF2YXRhclVybFxuICAgICAgcmVwb3NpdG9yaWVzIHsgdG90YWxDb3VudCB9XG4gICAgICAuLi4gb24gVXNlciB7XG4gICAgICAgIGNvbXBhbnlcbiAgICAgIH1cbiAgICAgIC4uLiBvbiBPcmdhbml6YXRpb24ge1xuICAgICAgICBtZW1iZXJzV2l0aFJvbGUge1xuICAgICAgICAgIHRvdGFsQ291bnRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19