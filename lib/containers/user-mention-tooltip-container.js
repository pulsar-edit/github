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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareUserMentionTooltipContainer extends _react.default.Component {
  render() {
    const owner = this.props.repositoryOwner;
    const {
      login,
      company,
      repositories,
      membersWithRole
    } = owner;
    return _react.default.createElement("div", {
      className: "github-UserMentionTooltip"
    }, _react.default.createElement("div", {
      className: "github-UserMentionTooltip-avatar"
    }, _react.default.createElement("img", {
      alt: "repository owner's avatar",
      src: owner.avatarUrl
    })), _react.default.createElement("div", {
      className: "github-UserMentionTooltip-info"
    }, _react.default.createElement("div", {
      className: "github-UserMentionTooltip-info-username"
    }, _react.default.createElement(_octicon.default, {
      icon: "mention"
    }), _react.default.createElement("strong", null, login)), company && _react.default.createElement("div", null, _react.default.createElement(_octicon.default, {
      icon: "briefcase"
    }), _react.default.createElement("span", null, company)), membersWithRole && _react.default.createElement("div", null, _react.default.createElement(_octicon.default, {
      icon: "organization"
    }), _react.default.createElement("span", null, membersWithRole.totalCount, " members")), _react.default.createElement("div", null, _react.default.createElement(_octicon.default, {
      icon: "repo"
    }), _react.default.createElement("span", null, repositories.totalCount, " repositories"))), _react.default.createElement("div", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlVXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJvd25lciIsInByb3BzIiwicmVwb3NpdG9yeU93bmVyIiwibG9naW4iLCJjb21wYW55IiwicmVwb3NpdG9yaWVzIiwibWVtYmVyc1dpdGhSb2xlIiwiYXZhdGFyVXJsIiwidG90YWxDb3VudCIsImNsZWFyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibnVtYmVyIiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiXSwic291cmNlcyI6WyJ1c2VyLW1lbnRpb24tdG9vbHRpcC1jb250YWluZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlVXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5T3duZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICByZXBvc2l0b3JpZXM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHRvdGFsQ291bnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG5cbiAgICAgIC8vIFVzZXJzXG4gICAgICBjb21wYW55OiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgICAvLyBPcmdhbml6YXRpb25zXG4gICAgICBtZW1iZXJzV2l0aFJvbGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHRvdGFsQ291bnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgb3duZXIgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnlPd25lcjtcbiAgICBjb25zdCB7bG9naW4sIGNvbXBhbnksIHJlcG9zaXRvcmllcywgbWVtYmVyc1dpdGhSb2xlfSA9IG93bmVyO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Vc2VyTWVudGlvblRvb2x0aXBcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItVXNlck1lbnRpb25Ub29sdGlwLWF2YXRhclwiPlxuICAgICAgICAgIDxpbWcgYWx0PVwicmVwb3NpdG9yeSBvd25lcidzIGF2YXRhclwiIHNyYz17b3duZXIuYXZhdGFyVXJsfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItVXNlck1lbnRpb25Ub29sdGlwLWluZm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Vc2VyTWVudGlvblRvb2x0aXAtaW5mby11c2VybmFtZVwiPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cIm1lbnRpb25cIiAvPjxzdHJvbmc+e2xvZ2lufTwvc3Ryb25nPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtjb21wYW55ICYmIDxkaXY+PE9jdGljb24gaWNvbj1cImJyaWVmY2FzZVwiIC8+PHNwYW4+e2NvbXBhbnl9PC9zcGFuPjwvZGl2Pn1cbiAgICAgICAgICB7bWVtYmVyc1dpdGhSb2xlICYmIChcbiAgICAgICAgICAgIDxkaXY+PE9jdGljb24gaWNvbj1cIm9yZ2FuaXphdGlvblwiIC8+PHNwYW4+e21lbWJlcnNXaXRoUm9sZS50b3RhbENvdW50fSBtZW1iZXJzPC9zcGFuPjwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPGRpdj48T2N0aWNvbiBpY29uPVwicmVwb1wiIC8+PHNwYW4+e3JlcG9zaXRvcmllcy50b3RhbENvdW50fSByZXBvc2l0b3JpZXM8L3NwYW4+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7Y2xlYXI6ICdib3RoJ319IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVVc2VyTWVudGlvblRvb2x0aXBDb250YWluZXIsIHtcbiAgcmVwb3NpdG9yeU93bmVyOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIgb24gUmVwb3NpdG9yeU93bmVyIHtcbiAgICAgIGxvZ2luXG4gICAgICBhdmF0YXJVcmxcbiAgICAgIHJlcG9zaXRvcmllcyB7IHRvdGFsQ291bnQgfVxuICAgICAgLi4uIG9uIFVzZXIge1xuICAgICAgICBjb21wYW55XG4gICAgICB9XG4gICAgICAuLi4gb24gT3JnYW5pemF0aW9uIHtcbiAgICAgICAgbWVtYmVyc1dpdGhSb2xlIHtcbiAgICAgICAgICB0b3RhbENvdW50XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFBc0M7QUFBQTtBQUFBO0FBQUE7QUFFL0IsTUFBTUEsK0JBQStCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBbUJuRUMsTUFBTSxHQUFHO0lBQ1AsTUFBTUMsS0FBSyxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxlQUFlO0lBQ3hDLE1BQU07TUFBQ0MsS0FBSztNQUFFQyxPQUFPO01BQUVDLFlBQVk7TUFBRUM7SUFBZSxDQUFDLEdBQUdOLEtBQUs7SUFDN0QsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUEyQixHQUN4QztNQUFLLFNBQVMsRUFBQztJQUFrQyxHQUMvQztNQUFLLEdBQUcsRUFBQywyQkFBMkI7TUFBQyxHQUFHLEVBQUVBLEtBQUssQ0FBQ087SUFBVSxFQUFHLENBQ3pELEVBQ047TUFBSyxTQUFTLEVBQUM7SUFBZ0MsR0FDN0M7TUFBSyxTQUFTLEVBQUM7SUFBeUMsR0FDdEQsNkJBQUMsZ0JBQU87TUFBQyxJQUFJLEVBQUM7SUFBUyxFQUFHLCtDQUFTSixLQUFLLENBQVUsQ0FDOUMsRUFDTEMsT0FBTyxJQUFJLDBDQUFLLDZCQUFDLGdCQUFPO01BQUMsSUFBSSxFQUFDO0lBQVcsRUFBRyw2Q0FBT0EsT0FBTyxDQUFRLENBQU0sRUFDeEVFLGVBQWUsSUFDZCwwQ0FBSyw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBQztJQUFjLEVBQUcsNkNBQU9BLGVBQWUsQ0FBQ0UsVUFBVSxhQUFnQixDQUN0RixFQUNELDBDQUFLLDZCQUFDLGdCQUFPO01BQUMsSUFBSSxFQUFDO0lBQU0sRUFBRyw2Q0FBT0gsWUFBWSxDQUFDRyxVQUFVLGtCQUFxQixDQUFNLENBQ2pGLEVBQ047TUFBSyxLQUFLLEVBQUU7UUFBQ0MsS0FBSyxFQUFFO01BQU07SUFBRSxFQUFHLENBQzNCO0VBRVY7QUFDRjtBQUFDO0FBQUEsZ0JBekNZYiwrQkFBK0IsZUFDdkI7RUFDakJNLGVBQWUsRUFBRVEsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQy9CUixLQUFLLEVBQUVPLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0MsVUFBVTtJQUNsQ04sU0FBUyxFQUFFRyxrQkFBUyxDQUFDRSxNQUFNLENBQUNDLFVBQVU7SUFDdENSLFlBQVksRUFBRUssa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQzVCSCxVQUFVLEVBQUVFLGtCQUFTLENBQUNJLE1BQU0sQ0FBQ0Q7SUFDL0IsQ0FBQyxDQUFDLENBQUNBLFVBQVU7SUFFYjtJQUNBVCxPQUFPLEVBQUVNLGtCQUFTLENBQUNFLE1BQU07SUFFekI7SUFDQU4sZUFBZSxFQUFFSSxrQkFBUyxDQUFDQyxLQUFLLENBQUM7TUFDL0JILFVBQVUsRUFBRUUsa0JBQVMsQ0FBQ0ksTUFBTSxDQUFDRDtJQUMvQixDQUFDO0VBQ0gsQ0FBQyxDQUFDLENBQUNBO0FBQ0wsQ0FBQztBQUFBLGVBMEJZLElBQUFFLG1DQUF1QixFQUFDbkIsK0JBQStCLEVBQUU7RUFDdEVNLGVBQWU7SUFBQTtJQUFBO01BQUE7SUFBQTtJQUFBO0VBQUE7QUFlakIsQ0FBQyxDQUFDO0FBQUEifQ==