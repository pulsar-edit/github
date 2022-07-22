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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareIssueCommentView extends _react.default.Component {
  render() {
    const comment = this.props.item;
    const author = comment.author || _helpers.GHOST_USER;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "issue timeline-item"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-row"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "comment"
    }), /*#__PURE__*/_react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      alt: author.login,
      title: author.login
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "comment-message-header"
    }, author.login, " commented", ' ', /*#__PURE__*/_react.default.createElement("a", {
      href: comment.url
    }, /*#__PURE__*/_react.default.createElement(_timeago.default, {
      time: comment.createdAt
    })))), /*#__PURE__*/_react.default.createElement(_githubDotcomMarkdown.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9pc3N1ZS1jb21tZW50LXZpZXcuanMiXSwibmFtZXMiOlsiQmFyZUlzc3VlQ29tbWVudFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNvbW1lbnQiLCJwcm9wcyIsIml0ZW0iLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwiYXZhdGFyVXJsIiwibG9naW4iLCJ1cmwiLCJjcmVhdGVkQXQiLCJib2R5SFRNTCIsInN3aXRjaFRvSXNzdWVpc2giLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInNoYXBlIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLG9CQUFOLFNBQW1DQyxlQUFNQyxTQUF6QyxDQUFtRDtBQWN4REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsT0FBTyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsSUFBM0I7QUFDQSxVQUFNQyxNQUFNLEdBQUdILE9BQU8sQ0FBQ0csTUFBUixJQUFrQkMsbUJBQWpDO0FBRUEsd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsU0FBUyxFQUFDLHdCQUFuQjtBQUE0QyxNQUFBLElBQUksRUFBQztBQUFqRCxNQURGLGVBRUU7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQStCLE1BQUEsR0FBRyxFQUFFRCxNQUFNLENBQUNFLFNBQTNDO0FBQ0UsTUFBQSxHQUFHLEVBQUVGLE1BQU0sQ0FBQ0csS0FEZDtBQUNxQixNQUFBLEtBQUssRUFBRUgsTUFBTSxDQUFDRztBQURuQyxNQUZGLGVBS0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUNHSCxNQUFNLENBQUNHLEtBRFYsZ0JBRUcsR0FGSCxlQUVPO0FBQUcsTUFBQSxJQUFJLEVBQUVOLE9BQU8sQ0FBQ087QUFBakIsb0JBQXNCLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUVQLE9BQU8sQ0FBQ1E7QUFBdkIsTUFBdEIsQ0FGUCxDQUxGLENBREYsZUFXRSw2QkFBQyw2QkFBRDtBQUFzQixNQUFBLElBQUksRUFBRVIsT0FBTyxDQUFDUyxRQUFwQztBQUE4QyxNQUFBLGdCQUFnQixFQUFFLEtBQUtSLEtBQUwsQ0FBV1M7QUFBM0UsTUFYRixDQURGO0FBZUQ7O0FBakN1RDs7OztnQkFBN0NkLG9CLGVBQ1E7QUFDakJjLEVBQUFBLGdCQUFnQixFQUFFQyxtQkFBVUMsSUFBVixDQUFlQyxVQURoQjtBQUVqQlgsRUFBQUEsSUFBSSxFQUFFUyxtQkFBVUcsS0FBVixDQUFnQjtBQUNwQlgsSUFBQUEsTUFBTSxFQUFFUSxtQkFBVUcsS0FBVixDQUFnQjtBQUN0QlQsTUFBQUEsU0FBUyxFQUFFTSxtQkFBVUksTUFBVixDQUFpQkYsVUFETjtBQUV0QlAsTUFBQUEsS0FBSyxFQUFFSyxtQkFBVUksTUFBVixDQUFpQkY7QUFGRixLQUFoQixDQURZO0FBS3BCSixJQUFBQSxRQUFRLEVBQUVFLG1CQUFVSSxNQUFWLENBQWlCRixVQUxQO0FBTXBCTCxJQUFBQSxTQUFTLEVBQUVHLG1CQUFVSSxNQUFWLENBQWlCRixVQU5SO0FBT3BCTixJQUFBQSxHQUFHLEVBQUVJLG1CQUFVSSxNQUFWLENBQWlCRjtBQVBGLEdBQWhCLEVBUUhBO0FBVmMsQzs7ZUFtQ04seUNBQXdCakIsb0JBQXhCLEVBQThDO0FBQzNETSxFQUFBQSxJQUFJO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEdUQsQ0FBOUMsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi4vdGltZWFnbyc7XG5pbXBvcnQgR2l0aHViRG90Y29tTWFya2Rvd24gZnJvbSAnLi4vZ2l0aHViLWRvdGNvbS1tYXJrZG93bic7XG5pbXBvcnQge0dIT1NUX1VTRVJ9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUlzc3VlQ29tbWVudFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaXRlbTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGF1dGhvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICAgIGJvZHlIVE1MOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBjcmVhdGVkQXQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICBjb25zdCBhdXRob3IgPSBjb21tZW50LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXNzdWUgdGltZWxpbmUtaXRlbVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8tcm93XCI+XG4gICAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJjb21tZW50XCIgLz5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImF1dGhvci1hdmF0YXJcIiBzcmM9e2F1dGhvci5hdmF0YXJVcmx9XG4gICAgICAgICAgICBhbHQ9e2F1dGhvci5sb2dpbn0gdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1lbnQtbWVzc2FnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgIHthdXRob3IubG9naW59IGNvbW1lbnRlZFxuICAgICAgICAgICAgeycgJ308YSBocmVmPXtjb21tZW50LnVybH0+PFRpbWVhZ28gdGltZT17Y29tbWVudC5jcmVhdGVkQXR9IC8+PC9hPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93biBodG1sPXtjb21tZW50LmJvZHlIVE1MfSBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVJc3N1ZUNvbW1lbnRWaWV3LCB7XG4gIGl0ZW06IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgaXNzdWVDb21tZW50Vmlld19pdGVtIG9uIElzc3VlQ29tbWVudCB7XG4gICAgICBhdXRob3Ige1xuICAgICAgICBhdmF0YXJVcmwgbG9naW5cbiAgICAgIH1cbiAgICAgIGJvZHlIVE1MIGNyZWF0ZWRBdCB1cmxcbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==