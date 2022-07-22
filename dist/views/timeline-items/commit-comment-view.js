"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommitCommentView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _timeago = _interopRequireDefault(require("../timeago"));

var _githubDotcomMarkdown = _interopRequireDefault(require("../github-dotcom-markdown"));

var _helpers = require("../../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCommitCommentView extends _react.default.Component {
  render() {
    const comment = this.props.item;
    const author = comment.author || _helpers.GHOST_USER;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "issue"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-row"
    }, this.props.isReply ? null : /*#__PURE__*/_react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "comment"
    }), /*#__PURE__*/_react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      alt: author.login,
      title: author.login
    }), this.renderHeader(comment, author)), /*#__PURE__*/_react.default.createElement(_githubDotcomMarkdown.default, {
      html: comment.bodyHTML,
      switchToIssueish: this.props.switchToIssueish
    }));
  }

  renderHeader(comment, author) {
    if (this.props.isReply) {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "comment-message-header"
      }, author.login, " replied ", /*#__PURE__*/_react.default.createElement(_timeago.default, {
        time: comment.createdAt
      }));
    } else {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "comment-message-header"
      }, author.login, " commented ", this.renderPath(), " in", ' ', comment.commit.oid.substr(0, 7), " ", /*#__PURE__*/_react.default.createElement(_timeago.default, {
        time: comment.createdAt
      }));
    }
  }

  renderPath() {
    if (this.props.item.path) {
      return /*#__PURE__*/_react.default.createElement("span", null, "on ", /*#__PURE__*/_react.default.createElement("code", null, this.props.item.path));
    } else {
      return null;
    }
  }

}

exports.BareCommitCommentView = BareCommitCommentView;

_defineProperty(BareCommitCommentView, "propTypes", {
  item: _propTypes.default.object.isRequired,
  isReply: _propTypes.default.bool.isRequired,
  switchToIssueish: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCommitCommentView, {
  item: function () {
    const node = require("./__generated__/commitCommentView_item.graphql");

    if (node.hash && node.hash !== "f3e868b343fe8d6fee958d5339b554dc") {
      console.error("The definition of 'commitCommentView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/commitCommentView_item.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXQtY29tbWVudC12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVDb21taXRDb21tZW50VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY29tbWVudCIsInByb3BzIiwiaXRlbSIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJpc1JlcGx5IiwiYXZhdGFyVXJsIiwibG9naW4iLCJyZW5kZXJIZWFkZXIiLCJib2R5SFRNTCIsInN3aXRjaFRvSXNzdWVpc2giLCJjcmVhdGVkQXQiLCJyZW5kZXJQYXRoIiwiY29tbWl0Iiwib2lkIiwic3Vic3RyIiwicGF0aCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSxxQkFBTixTQUFvQ0MsZUFBTUMsU0FBMUMsQ0FBb0Q7QUFPekRDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLE9BQU8sR0FBRyxLQUFLQyxLQUFMLENBQVdDLElBQTNCO0FBQ0EsVUFBTUMsTUFBTSxHQUFHSCxPQUFPLENBQUNHLE1BQVIsSUFBa0JDLG1CQUFqQztBQUVBLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRyxLQUFLSCxLQUFMLENBQVdJLE9BQVgsR0FBcUIsSUFBckIsZ0JBQTRCLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxTQUFTLEVBQUMsd0JBQW5CO0FBQTRDLE1BQUEsSUFBSSxFQUFDO0FBQWpELE1BRC9CLGVBRUU7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQ0UsTUFBQSxHQUFHLEVBQUVGLE1BQU0sQ0FBQ0csU0FEZDtBQUN5QixNQUFBLEdBQUcsRUFBRUgsTUFBTSxDQUFDSSxLQURyQztBQUM0QyxNQUFBLEtBQUssRUFBRUosTUFBTSxDQUFDSTtBQUQxRCxNQUZGLEVBS0csS0FBS0MsWUFBTCxDQUFrQlIsT0FBbEIsRUFBMkJHLE1BQTNCLENBTEgsQ0FERixlQVFFLDZCQUFDLDZCQUFEO0FBQXNCLE1BQUEsSUFBSSxFQUFFSCxPQUFPLENBQUNTLFFBQXBDO0FBQThDLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS1IsS0FBTCxDQUFXUztBQUEzRSxNQVJGLENBREY7QUFZRDs7QUFFREYsRUFBQUEsWUFBWSxDQUFDUixPQUFELEVBQVVHLE1BQVYsRUFBa0I7QUFDNUIsUUFBSSxLQUFLRixLQUFMLENBQVdJLE9BQWYsRUFBd0I7QUFDdEIsMEJBQ0U7QUFBTSxRQUFBLFNBQVMsRUFBQztBQUFoQixTQUNHRixNQUFNLENBQUNJLEtBRFYsNEJBQ3lCLDZCQUFDLGdCQUFEO0FBQVMsUUFBQSxJQUFJLEVBQUVQLE9BQU8sQ0FBQ1c7QUFBdkIsUUFEekIsQ0FERjtBQUtELEtBTkQsTUFNTztBQUNMLDBCQUNFO0FBQU0sUUFBQSxTQUFTLEVBQUM7QUFBaEIsU0FDR1IsTUFBTSxDQUFDSSxLQURWLGlCQUM0QixLQUFLSyxVQUFMLEVBRDVCLFNBRUcsR0FGSCxFQUVRWixPQUFPLENBQUNhLE1BQVIsQ0FBZUMsR0FBZixDQUFtQkMsTUFBbkIsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FGUixvQkFFeUMsNkJBQUMsZ0JBQUQ7QUFBUyxRQUFBLElBQUksRUFBRWYsT0FBTyxDQUFDVztBQUF2QixRQUZ6QyxDQURGO0FBTUQ7QUFDRjs7QUFFREMsRUFBQUEsVUFBVSxHQUFHO0FBQ1gsUUFBSSxLQUFLWCxLQUFMLENBQVdDLElBQVgsQ0FBZ0JjLElBQXBCLEVBQTBCO0FBQ3hCLDBCQUFPLCtEQUFTLDJDQUFPLEtBQUtmLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQmMsSUFBdkIsQ0FBVCxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFoRHdEOzs7O2dCQUE5Q3BCLHFCLGVBQ1E7QUFDakJNLEVBQUFBLElBQUksRUFBRWUsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBRE47QUFFakJkLEVBQUFBLE9BQU8sRUFBRVksbUJBQVVHLElBQVYsQ0FBZUQsVUFGUDtBQUdqQlQsRUFBQUEsZ0JBQWdCLEVBQUVPLG1CQUFVSSxJQUFWLENBQWVGO0FBSGhCLEM7O2VBa0ROLHlDQUF3QnZCLHFCQUF4QixFQUErQztBQUM1RE0sRUFBQUEsSUFBSTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRHdELENBQS9DLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4uL3RpbWVhZ28nO1xuaW1wb3J0IEdpdGh1YkRvdGNvbU1hcmtkb3duIGZyb20gJy4uL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IHtHSE9TVF9VU0VSfSBmcm9tICcuLi8uLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVDb21taXRDb21tZW50VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzUmVwbHk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIGNvbnN0IGF1dGhvciA9IGNvbW1lbnQuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpc3N1ZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8tcm93XCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuaXNSZXBseSA/IG51bGwgOiA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cImNvbW1lbnRcIiAvPn1cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImF1dGhvci1hdmF0YXJcIlxuICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfSBhbHQ9e2F1dGhvci5sb2dpbn0gdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckhlYWRlcihjb21tZW50LCBhdXRob3IpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duIGh0bWw9e2NvbW1lbnQuYm9keUhUTUx9IHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIZWFkZXIoY29tbWVudCwgYXV0aG9yKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNSZXBseSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbWVudC1tZXNzYWdlLWhlYWRlclwiPlxuICAgICAgICAgIHthdXRob3IubG9naW59IHJlcGxpZWQgPFRpbWVhZ28gdGltZT17Y29tbWVudC5jcmVhdGVkQXR9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1lbnQtbWVzc2FnZS1oZWFkZXJcIj5cbiAgICAgICAgICB7YXV0aG9yLmxvZ2lufSBjb21tZW50ZWQge3RoaXMucmVuZGVyUGF0aCgpfSBpblxuICAgICAgICAgIHsnICd9e2NvbW1lbnQuY29tbWl0Lm9pZC5zdWJzdHIoMCwgNyl9IDxUaW1lYWdvIHRpbWU9e2NvbW1lbnQuY3JlYXRlZEF0fSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlclBhdGgoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXRlbS5wYXRoKSB7XG4gICAgICByZXR1cm4gPHNwYW4+b24gPGNvZGU+e3RoaXMucHJvcHMuaXRlbS5wYXRofTwvY29kZT48L3NwYW4+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUNvbW1pdENvbW1lbnRWaWV3LCB7XG4gIGl0ZW06IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY29tbWl0Q29tbWVudFZpZXdfaXRlbSBvbiBDb21taXRDb21tZW50IHtcbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGxvZ2luIGF2YXRhclVybFxuICAgICAgfVxuICAgICAgY29tbWl0IHsgb2lkIH1cbiAgICAgIGJvZHlIVE1MIGNyZWF0ZWRBdCBwYXRoIHBvc2l0aW9uXG4gICAgfVxuICBgLFxufSk7XG4iXX0=