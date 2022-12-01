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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9oZWFkLXJlZi1mb3JjZS1wdXNoZWQtZXZlbnQtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJhY3RvciIsImJlZm9yZUNvbW1pdCIsImFmdGVyQ29tbWl0IiwiY3JlYXRlZEF0IiwicHJvcHMiLCJpdGVtIiwiaGVhZFJlZk5hbWUiLCJoZWFkUmVwb3NpdG9yeU93bmVyIiwicmVwb3NpdG9yeSIsImlzc3VlaXNoIiwiYnJhbmNoUHJlZml4IiwibG9naW4iLCJvd25lciIsImF2YXRhclVybCIsInJlbmRlckNvbW1pdCIsImNvbW1pdCIsImRlc2NyaXB0aW9uIiwib2lkIiwic2xpY2UiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBRU8sTUFBTUEsK0JBQU4sU0FBOENDLGVBQU1DLFNBQXBELENBQThEO0FBNEJuRUMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTTtBQUFDQyxNQUFBQSxLQUFEO0FBQVFDLE1BQUFBLFlBQVI7QUFBc0JDLE1BQUFBLFdBQXRCO0FBQW1DQyxNQUFBQTtBQUFuQyxRQUFnRCxLQUFLQyxLQUFMLENBQVdDLElBQWpFO0FBQ0EsVUFBTTtBQUFDQyxNQUFBQSxXQUFEO0FBQWNDLE1BQUFBLG1CQUFkO0FBQW1DQyxNQUFBQTtBQUFuQyxRQUFpRCxLQUFLSixLQUFMLENBQVdLLFFBQWxFO0FBQ0EsVUFBTUMsWUFBWSxHQUFHSCxtQkFBbUIsQ0FBQ0ksS0FBcEIsS0FBOEJILFVBQVUsQ0FBQ0ksS0FBWCxDQUFpQkQsS0FBL0MsR0FBd0QsR0FBRUosbUJBQW1CLENBQUNJLEtBQU0sR0FBcEYsR0FBeUYsRUFBOUc7QUFDQSxXQUNFO0FBQUssTUFBQSxT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ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi4vdGltZWFnbyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgYWN0b3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBiZWZvcmVDb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG9pZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBhZnRlckNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgb2lkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZWRBdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgaXNzdWVpc2g6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoZWFkUmVmTmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGVhZFJlcG9zaXRvcnlPd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgb3duZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7YWN0b3IsIGJlZm9yZUNvbW1pdCwgYWZ0ZXJDb21taXQsIGNyZWF0ZWRBdH0gPSB0aGlzLnByb3BzLml0ZW07XG4gICAgY29uc3Qge2hlYWRSZWZOYW1lLCBoZWFkUmVwb3NpdG9yeU93bmVyLCByZXBvc2l0b3J5fSA9IHRoaXMucHJvcHMuaXNzdWVpc2g7XG4gICAgY29uc3QgYnJhbmNoUHJlZml4ID0gaGVhZFJlcG9zaXRvcnlPd25lci5sb2dpbiAhPT0gcmVwb3NpdG9yeS5vd25lci5sb2dpbiA/IGAke2hlYWRSZXBvc2l0b3J5T3duZXIubG9naW59OmAgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkLXJlZi1mb3JjZS1wdXNoZWQtZXZlbnRcIj5cbiAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJyZXBvLWZvcmNlLXB1c2hcIiAvPlxuICAgICAgICB7YWN0b3IgJiYgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgc3JjPXthY3Rvci5hdmF0YXJVcmx9IGFsdD17YWN0b3IubG9naW59IHRpdGxlPXthY3Rvci5sb2dpbn0gLz59XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhlYWQtcmVmLWZvcmNlLXB1c2hlZC1ldmVudC1oZWFkZXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1c2VybmFtZVwiPnthY3RvciA/IGFjdG9yLmxvZ2luIDogJ3NvbWVvbmUnfTwvc3Bhbj4gZm9yY2UtcHVzaGVkXG4gICAgICAgICAgdGhlIHticmFuY2hQcmVmaXggKyBoZWFkUmVmTmFtZX0gYnJhbmNoXG4gICAgICAgICAgZnJvbSB7dGhpcy5yZW5kZXJDb21taXQoYmVmb3JlQ29tbWl0LCAnYW4gb2xkIGNvbW1pdCcpfSB0b1xuICAgICAgICAgIHsnICd9e3RoaXMucmVuZGVyQ29tbWl0KGFmdGVyQ29tbWl0LCAnYSBuZXcgY29tbWl0Jyl9IGF0IDxUaW1lYWdvIHRpbWU9e2NyZWF0ZWRBdH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1pdChjb21taXQsIGRlc2NyaXB0aW9uKSB7XG4gICAgaWYgKCFjb21taXQpIHtcbiAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwic2hhXCI+e2NvbW1pdC5vaWQuc2xpY2UoMCwgOCl9PC9zcGFuPjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3LCB7XG4gIGlzc3VlaXNoOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICBoZWFkUmVmTmFtZVxuICAgICAgaGVhZFJlcG9zaXRvcnlPd25lciB7IGxvZ2luIH1cbiAgICAgIHJlcG9zaXRvcnkgeyBvd25lciB7IGxvZ2luIH0gfVxuICAgIH1cbiAgYCxcblxuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtIG9uIEhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50IHtcbiAgICAgIGFjdG9yIHsgYXZhdGFyVXJsIGxvZ2luIH1cbiAgICAgIGJlZm9yZUNvbW1pdCB7IG9pZCB9XG4gICAgICBhZnRlckNvbW1pdCB7IG9pZCB9XG4gICAgICBjcmVhdGVkQXRcbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==