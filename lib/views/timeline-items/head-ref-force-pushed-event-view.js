"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareHeadRefForcePushedEventView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../../atom/octicon"));
var _timeago = _interopRequireDefault(require("../timeago"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareHeadRefForcePushedEventView extends _react.default.Component {
  render() {
    const {
      actor,
      beforeCommit,
      afterCommit,
      createdAt
    } = this.props.item;
    const {
      headRefName,
      headRepositoryOwner,
      repository
    } = this.props.issueish;
    const branchPrefix = headRepositoryOwner.login !== repository.owner.login ? `${headRepositoryOwner.login}:` : '';
    return _react.default.createElement("div", {
      className: "head-ref-force-pushed-event"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "repo-force-push"
    }), actor && _react.default.createElement("img", {
      className: "author-avatar",
      src: actor.avatarUrl,
      alt: actor.login,
      title: actor.login
    }), _react.default.createElement("span", {
      className: "head-ref-force-pushed-event-header"
    }, _react.default.createElement("span", {
      className: "username"
    }, actor ? actor.login : 'someone'), " force-pushed the ", branchPrefix + headRefName, " branch from ", this.renderCommit(beforeCommit, 'an old commit'), " to", ' ', this.renderCommit(afterCommit, 'a new commit'), " at ", _react.default.createElement(_timeago.default, {
      time: createdAt
    })));
  }
  renderCommit(commit, description) {
    if (!commit) {
      return description;
    }
    return _react.default.createElement("span", {
      className: "sha"
    }, commit.oid.slice(0, 8));
  }
}
exports.BareHeadRefForcePushedEventView = BareHeadRefForcePushedEventView;
_defineProperty(BareHeadRefForcePushedEventView, "propTypes", {
  item: _propTypes.default.shape({
    actor: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    beforeCommit: _propTypes.default.shape({
      oid: _propTypes.default.string.isRequired
    }),
    afterCommit: _propTypes.default.shape({
      oid: _propTypes.default.string.isRequired
    }),
    createdAt: _propTypes.default.string.isRequired
  }).isRequired,
  issueish: _propTypes.default.shape({
    headRefName: _propTypes.default.string.isRequired,
    headRepositoryOwner: _propTypes.default.shape({
      login: _propTypes.default.string.isRequired
    }),
    repository: _propTypes.default.shape({
      owner: _propTypes.default.shape({
        login: _propTypes.default.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareHeadRefForcePushedEventView, {
  issueish: function () {
    const node = require("./__generated__/headRefForcePushedEventView_issueish.graphql");
    if (node.hash && node.hash !== "4c639070afc4a02cedf062d836d0dd7f") {
      console.error("The definition of 'headRefForcePushedEventView_issueish' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/headRefForcePushedEventView_issueish.graphql");
  },
  item: function () {
    const node = require("./__generated__/headRefForcePushedEventView_item.graphql");
    if (node.hash && node.hash !== "fc403545674c57c1997c870805101ffb") {
      console.error("The definition of 'headRefForcePushedEventView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/headRefForcePushedEventView_item.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJhY3RvciIsImJlZm9yZUNvbW1pdCIsImFmdGVyQ29tbWl0IiwiY3JlYXRlZEF0IiwicHJvcHMiLCJpdGVtIiwiaGVhZFJlZk5hbWUiLCJoZWFkUmVwb3NpdG9yeU93bmVyIiwicmVwb3NpdG9yeSIsImlzc3VlaXNoIiwiYnJhbmNoUHJlZml4IiwibG9naW4iLCJvd25lciIsImF2YXRhclVybCIsInJlbmRlckNvbW1pdCIsImNvbW1pdCIsImRlc2NyaXB0aW9uIiwib2lkIiwic2xpY2UiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciJdLCJzb3VyY2VzIjpbImhlYWQtcmVmLWZvcmNlLXB1c2hlZC1ldmVudC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi4vdGltZWFnbyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgYWN0b3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBiZWZvcmVDb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG9pZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBhZnRlckNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgb2lkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZWRBdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgaXNzdWVpc2g6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoZWFkUmVmTmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGVhZFJlcG9zaXRvcnlPd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgb3duZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7YWN0b3IsIGJlZm9yZUNvbW1pdCwgYWZ0ZXJDb21taXQsIGNyZWF0ZWRBdH0gPSB0aGlzLnByb3BzLml0ZW07XG4gICAgY29uc3Qge2hlYWRSZWZOYW1lLCBoZWFkUmVwb3NpdG9yeU93bmVyLCByZXBvc2l0b3J5fSA9IHRoaXMucHJvcHMuaXNzdWVpc2g7XG4gICAgY29uc3QgYnJhbmNoUHJlZml4ID0gaGVhZFJlcG9zaXRvcnlPd25lci5sb2dpbiAhPT0gcmVwb3NpdG9yeS5vd25lci5sb2dpbiA/IGAke2hlYWRSZXBvc2l0b3J5T3duZXIubG9naW59OmAgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkLXJlZi1mb3JjZS1wdXNoZWQtZXZlbnRcIj5cbiAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJyZXBvLWZvcmNlLXB1c2hcIiAvPlxuICAgICAgICB7YWN0b3IgJiYgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgc3JjPXthY3Rvci5hdmF0YXJVcmx9IGFsdD17YWN0b3IubG9naW59IHRpdGxlPXthY3Rvci5sb2dpbn0gLz59XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhlYWQtcmVmLWZvcmNlLXB1c2hlZC1ldmVudC1oZWFkZXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1c2VybmFtZVwiPnthY3RvciA/IGFjdG9yLmxvZ2luIDogJ3NvbWVvbmUnfTwvc3Bhbj4gZm9yY2UtcHVzaGVkXG4gICAgICAgICAgdGhlIHticmFuY2hQcmVmaXggKyBoZWFkUmVmTmFtZX0gYnJhbmNoXG4gICAgICAgICAgZnJvbSB7dGhpcy5yZW5kZXJDb21taXQoYmVmb3JlQ29tbWl0LCAnYW4gb2xkIGNvbW1pdCcpfSB0b1xuICAgICAgICAgIHsnICd9e3RoaXMucmVuZGVyQ29tbWl0KGFmdGVyQ29tbWl0LCAnYSBuZXcgY29tbWl0Jyl9IGF0IDxUaW1lYWdvIHRpbWU9e2NyZWF0ZWRBdH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1pdChjb21taXQsIGRlc2NyaXB0aW9uKSB7XG4gICAgaWYgKCFjb21taXQpIHtcbiAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwic2hhXCI+e2NvbW1pdC5vaWQuc2xpY2UoMCwgOCl9PC9zcGFuPjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3LCB7XG4gIGlzc3VlaXNoOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICBoZWFkUmVmTmFtZVxuICAgICAgaGVhZFJlcG9zaXRvcnlPd25lciB7IGxvZ2luIH1cbiAgICAgIHJlcG9zaXRvcnkgeyBvd25lciB7IGxvZ2luIH0gfVxuICAgIH1cbiAgYCxcblxuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtIG9uIEhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50IHtcbiAgICAgIGFjdG9yIHsgYXZhdGFyVXJsIGxvZ2luIH1cbiAgICAgIGJlZm9yZUNvbW1pdCB7IG9pZCB9XG4gICAgICBhZnRlckNvbW1pdCB7IG9pZCB9XG4gICAgICBjcmVhdGVkQXRcbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFpQztBQUFBO0FBQUE7QUFBQTtBQUUxQixNQUFNQSwrQkFBK0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUE0Qm5FQyxNQUFNLEdBQUc7SUFDUCxNQUFNO01BQUNDLEtBQUs7TUFBRUMsWUFBWTtNQUFFQyxXQUFXO01BQUVDO0lBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxJQUFJO0lBQ3JFLE1BQU07TUFBQ0MsV0FBVztNQUFFQyxtQkFBbUI7TUFBRUM7SUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDSixLQUFLLENBQUNLLFFBQVE7SUFDMUUsTUFBTUMsWUFBWSxHQUFHSCxtQkFBbUIsQ0FBQ0ksS0FBSyxLQUFLSCxVQUFVLENBQUNJLEtBQUssQ0FBQ0QsS0FBSyxHQUFJLEdBQUVKLG1CQUFtQixDQUFDSSxLQUFNLEdBQUUs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