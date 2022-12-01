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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL3VzZXItbWVudGlvbi10b29sdGlwLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJCYXJlVXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJvd25lciIsInByb3BzIiwicmVwb3NpdG9yeU93bmVyIiwibG9naW4iLCJjb21wYW55IiwicmVwb3NpdG9yaWVzIiwibWVtYmVyc1dpdGhSb2xlIiwiYXZhdGFyVXJsIiwidG90YWxDb3VudCIsImNsZWFyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLE1BQU1BLCtCQUFOLFNBQThDQyxlQUFNQyxTQUFwRCxDQUE4RDtBQW1CbkVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLEtBQUssR0FBRyxLQUFLQyxLQUFMLENBQVdDLGVBQXpCO0FBQ0EsVUFBTTtBQUFDQyxNQUFBQSxLQUFEO0FBQVFDLE1BQUFBLE9BQVI7QUFBaUJDLE1BQUFBLFlBQWpCO0FBQStCQyxNQUFBQTtBQUEvQixRQUFrRE4sS0FBeEQ7QUFDQSxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUssTUFBQSxHQUFHLEVBQUMsMkJBQVQ7QUFBcUMsTUFBQSxHQUFHLEVBQUVBLEtBQUssQ0FBQ087QUFBaEQsTUFERixDQURGLEVBSUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBQztBQUFkLE1BREYsRUFDNEIsNkNBQVNKLEtBQVQsQ0FENUIsQ0FERixFQUlHQyxPQUFPLElBQUksMENBQUssNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBQztBQUFkLE1BQUwsRUFBaUMsMkNBQU9BLE9BQVAsQ0FBakMsQ0FKZCxFQUtHRSxlQUFlLElBQ2QsMENBQUssNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBQztBQUFkLE1BQUwsRUFBb0MsMkNBQU9BLGVBQWUsQ0FBQ0UsVUFBdkIsYUFBcEMsQ0FOSixFQVFFLDBDQUFLLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUM7QUFBZCxNQUFMLEVBQTRCLDJDQUFPSCxZQUFZLENBQUNHLFVBQXBCLGtCQUE1QixDQVJGLENBSkYsRUFjRTtBQUFLLE1BQUEsS0FBSyxFQUFFO0FBQUNDLFFBQUFBLEtBQUssRUFBRTtBQUFSO0FBQVosTUFkRixDQURGO0FBa0JEOztBQXhDa0U7Ozs7Z0JBQXhEYiwrQixlQUNRO0FBQ2pCTSxFQUFBQSxlQUFlLEVBQUVRLG1CQUFVQyxLQUFWLENBQWdCO0FBQy9CUixJQUFBQSxLQUFLLEVBQUVPLG1CQUFVRSxNQUFWLENBQWlCQyxVQURPO0FBRS9CTixJQUFBQSxTQUFTLEVBQUVHLG1CQUFVRSxNQUFWLENBQWlCQyxVQUZHO0FBRy9CUixJQUFBQSxZQUFZLEVBQUVLLG1CQUFVQyxLQUFWLENBQWdCO0FBQzVCSCxNQUFBQSxVQUFVLEVBQUVFLG1CQUFVSSxNQUFWLENBQWlCRDtBQURELEtBQWhCLEVBRVhBLFVBTDRCO0FBTy9CO0FBQ0FULElBQUFBLE9BQU8sRUFBRU0sbUJBQVVFLE1BUlk7QUFVL0I7QUFDQU4sSUFBQUEsZUFBZSxFQUFFSSxtQkFBVUMsS0FBVixDQUFnQjtBQUMvQkgsTUFBQUEsVUFBVSxFQUFFRSxtQkFBVUksTUFBVixDQUFpQkQ7QUFERSxLQUFoQjtBQVhjLEdBQWhCLEVBY2RBO0FBZmMsQzs7ZUEwQ04seUNBQXdCakIsK0JBQXhCLEVBQXlEO0FBQ3RFTSxFQUFBQSxlQUFlO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEdUQsQ0FBekQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgY2xhc3MgQmFyZVVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeU93bmVyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgcmVwb3NpdG9yaWVzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICB0b3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgICAvLyBVc2Vyc1xuICAgICAgY29tcGFueTogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgICAgLy8gT3JnYW5pemF0aW9uc1xuICAgICAgbWVtYmVyc1dpdGhSb2xlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICB0b3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG93bmVyID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5T3duZXI7XG4gICAgY29uc3Qge2xvZ2luLCBjb21wYW55LCByZXBvc2l0b3JpZXMsIG1lbWJlcnNXaXRoUm9sZX0gPSBvd25lcjtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItVXNlck1lbnRpb25Ub29sdGlwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVVzZXJNZW50aW9uVG9vbHRpcC1hdmF0YXJcIj5cbiAgICAgICAgICA8aW1nIGFsdD1cInJlcG9zaXRvcnkgb3duZXIncyBhdmF0YXJcIiBzcmM9e293bmVyLmF2YXRhclVybH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVVzZXJNZW50aW9uVG9vbHRpcC1pbmZvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItVXNlck1lbnRpb25Ub29sdGlwLWluZm8tdXNlcm5hbWVcIj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJtZW50aW9uXCIgLz48c3Ryb25nPntsb2dpbn08L3N0cm9uZz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7Y29tcGFueSAmJiA8ZGl2PjxPY3RpY29uIGljb249XCJicmllZmNhc2VcIiAvPjxzcGFuPntjb21wYW55fTwvc3Bhbj48L2Rpdj59XG4gICAgICAgICAge21lbWJlcnNXaXRoUm9sZSAmJiAoXG4gICAgICAgICAgICA8ZGl2PjxPY3RpY29uIGljb249XCJvcmdhbml6YXRpb25cIiAvPjxzcGFuPnttZW1iZXJzV2l0aFJvbGUudG90YWxDb3VudH0gbWVtYmVyczwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXY+PE9jdGljb24gaWNvbj1cInJlcG9cIiAvPjxzcGFuPntyZXBvc2l0b3JpZXMudG90YWxDb3VudH0gcmVwb3NpdG9yaWVzPC9zcGFuPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e2NsZWFyOiAnYm90aCd9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlVXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyLCB7XG4gIHJlcG9zaXRvcnlPd25lcjogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyIG9uIFJlcG9zaXRvcnlPd25lciB7XG4gICAgICBsb2dpblxuICAgICAgYXZhdGFyVXJsXG4gICAgICByZXBvc2l0b3JpZXMgeyB0b3RhbENvdW50IH1cbiAgICAgIC4uLiBvbiBVc2VyIHtcbiAgICAgICAgY29tcGFueVxuICAgICAgfVxuICAgICAgLi4uIG9uIE9yZ2FuaXphdGlvbiB7XG4gICAgICAgIG1lbWJlcnNXaXRoUm9sZSB7XG4gICAgICAgICAgdG90YWxDb3VudFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=