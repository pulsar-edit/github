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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9pc3N1ZS1jb21tZW50LXZpZXcuanMiXSwibmFtZXMiOlsiQmFyZUlzc3VlQ29tbWVudFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImNvbW1lbnQiLCJwcm9wcyIsIml0ZW0iLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwiYXZhdGFyVXJsIiwibG9naW4iLCJ1cmwiLCJjcmVhdGVkQXQiLCJib2R5SFRNTCIsInN3aXRjaFRvSXNzdWVpc2giLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsInNoYXBlIiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLG9CQUFOLFNBQW1DQyxlQUFNQyxTQUF6QyxDQUFtRDtBQWN4REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsT0FBTyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsSUFBM0I7QUFDQSxVQUFNQyxNQUFNLEdBQUdILE9BQU8sQ0FBQ0csTUFBUixJQUFrQkMsbUJBQWpDO0FBRUEsV0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRSw2QkFBQyxnQkFBRDtBQUFTLE1BQUEsU0FBUyxFQUFDLHdCQUFuQjtBQUE0QyxNQUFBLElBQUksRUFBQztBQUFqRCxNQURGLEVBRUU7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQStCLE1BQUEsR0FBRyxFQUFFRCxNQUFNLENBQUNFLFNBQTNDO0FBQ0UsTUFBQSxHQUFHLEVBQUVGLE1BQU0sQ0FBQ0csS0FEZDtBQUNxQixNQUFBLEtBQUssRUFBRUgsTUFBTSxDQUFDRztBQURuQyxNQUZGLEVBS0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixPQUNHSCxNQUFNLENBQUNHLEtBRFYsZ0JBRUcsR0FGSCxFQUVPO0FBQUcsTUFBQSxJQUFJLEVBQUVOLE9BQU8sQ0FBQ087QUFBakIsT0FBc0IsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBRVAsT0FBTyxDQUFDUTtBQUF2QixNQUF0QixDQUZQLENBTEYsQ0FERixFQVdFLDZCQUFDLDZCQUFEO0FBQXNCLE1BQUEsSUFBSSxFQUFFUixPQUFPLENBQUNTLFFBQXBDO0FBQThDLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS1IsS0FBTCxDQUFXUztBQUEzRSxNQVhGLENBREY7QUFlRDs7QUFqQ3VEOzs7O2dCQUE3Q2Qsb0IsZUFDUTtBQUNqQmMsRUFBQUEsZ0JBQWdCLEVBQUVDLG1CQUFVQyxJQUFWLENBQWVDLFVBRGhCO0FBRWpCWCxFQUFBQSxJQUFJLEVBQUVTLG1CQUFVRyxLQUFWLENBQWdCO0FBQ3BCWCxJQUFBQSxNQUFNLEVBQUVRLG1CQUFVRyxLQUFWLENBQWdCO0FBQ3RCVCxNQUFBQSxTQUFTLEVBQUVNLG1CQUFVSSxNQUFWLENBQWlCRixVQUROO0FBRXRCUCxNQUFBQSxLQUFLLEVBQUVLLG1CQUFVSSxNQUFWLENBQWlCRjtBQUZGLEtBQWhCLENBRFk7QUFLcEJKLElBQUFBLFFBQVEsRUFBRUUsbUJBQVVJLE1BQVYsQ0FBaUJGLFVBTFA7QUFNcEJMLElBQUFBLFNBQVMsRUFBRUcsbUJBQVVJLE1BQVYsQ0FBaUJGLFVBTlI7QUFPcEJOLElBQUFBLEdBQUcsRUFBRUksbUJBQVVJLE1BQVYsQ0FBaUJGO0FBUEYsR0FBaEIsRUFRSEE7QUFWYyxDOztlQW1DTix5Q0FBd0JqQixvQkFBeEIsRUFBOEM7QUFDM0RNLEVBQUFBLElBQUk7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUR1RCxDQUE5QyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uLy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuLi90aW1lYWdvJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCB7R0hPU1RfVVNFUn0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlSXNzdWVDb21tZW50VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgYXV0aG9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgYm9keUhUTUw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGNyZWF0ZWRBdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIGNvbnN0IGF1dGhvciA9IGNvbW1lbnQuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpc3N1ZSB0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1yb3dcIj5cbiAgICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cImNvbW1lbnRcIiAvPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiYXV0aG9yLWF2YXRhclwiIHNyYz17YXV0aG9yLmF2YXRhclVybH1cbiAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufSB0aXRsZT17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbWVudC1tZXNzYWdlLWhlYWRlclwiPlxuICAgICAgICAgICAge2F1dGhvci5sb2dpbn0gY29tbWVudGVkXG4gICAgICAgICAgICB7JyAnfTxhIGhyZWY9e2NvbW1lbnQudXJsfT48VGltZWFnbyB0aW1lPXtjb21tZW50LmNyZWF0ZWRBdH0gLz48L2E+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duIGh0bWw9e2NvbW1lbnQuYm9keUhUTUx9IHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUlzc3VlQ29tbWVudFZpZXcsIHtcbiAgaXRlbTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0gb24gSXNzdWVDb21tZW50IHtcbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGF2YXRhclVybCBsb2dpblxuICAgICAgfVxuICAgICAgYm9keUhUTUwgY3JlYXRlZEF0IHVybFxuICAgIH1cbiAgYCxcbn0pO1xuIl19