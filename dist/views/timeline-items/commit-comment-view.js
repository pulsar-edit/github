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
    return _react.default.createElement("div", {
      className: "issue"
    }, _react.default.createElement("div", {
      className: "info-row"
    }, this.props.isReply ? null : _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "comment"
    }), _react.default.createElement("img", {
      className: "author-avatar",
      src: author.avatarUrl,
      alt: author.login,
      title: author.login
    }), this.renderHeader(comment, author)), _react.default.createElement(_githubDotcomMarkdown.default, {
      html: comment.bodyHTML,
      switchToIssueish: this.props.switchToIssueish
    }));
  }

  renderHeader(comment, author) {
    if (this.props.isReply) {
      return _react.default.createElement("span", {
        className: "comment-message-header"
      }, author.login, " replied ", _react.default.createElement(_timeago.default, {
        time: comment.createdAt
      }));
    } else {
      return _react.default.createElement("span", {
        className: "comment-message-header"
      }, author.login, " commented ", this.renderPath(), " in", ' ', comment.commit.oid.substr(0, 7), " ", _react.default.createElement(_timeago.default, {
        time: comment.createdAt
      }));
    }
  }

  renderPath() {
    if (this.props.item.path) {
      return _react.default.createElement("span", null, "on ", _react.default.createElement("code", null, this.props.item.path));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXQtY29tbWVudC12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVDb21taXRDb21tZW50VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiY29tbWVudCIsInByb3BzIiwiaXRlbSIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJpc1JlcGx5IiwiYXZhdGFyVXJsIiwibG9naW4iLCJyZW5kZXJIZWFkZXIiLCJib2R5SFRNTCIsInN3aXRjaFRvSXNzdWVpc2giLCJjcmVhdGVkQXQiLCJyZW5kZXJQYXRoIiwiY29tbWl0Iiwib2lkIiwic3Vic3RyIiwicGF0aCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSxxQkFBTixTQUFvQ0MsZUFBTUMsU0FBMUMsQ0FBb0Q7QUFPekRDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLE9BQU8sR0FBRyxLQUFLQyxLQUFMLENBQVdDLElBQTNCO0FBQ0EsVUFBTUMsTUFBTSxHQUFHSCxPQUFPLENBQUNHLE1BQVIsSUFBa0JDLG1CQUFqQztBQUVBLFdBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0csS0FBS0gsS0FBTCxDQUFXSSxPQUFYLEdBQXFCLElBQXJCLEdBQTRCLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxTQUFTLEVBQUMsd0JBQW5CO0FBQTRDLE1BQUEsSUFBSSxFQUFDO0FBQWpELE1BRC9CLEVBRUU7QUFBSyxNQUFBLFNBQVMsRUFBQyxlQUFmO0FBQ0UsTUFBQSxHQUFHLEVBQUVGLE1BQU0sQ0FBQ0csU0FEZDtBQUN5QixNQUFBLEdBQUcsRUFBRUgsTUFBTSxDQUFDSSxLQURyQztBQUM0QyxNQUFBLEtBQUssRUFBRUosTUFBTSxDQUFDSTtBQUQxRCxNQUZGLEVBS0csS0FBS0MsWUFBTCxDQUFrQlIsT0FBbEIsRUFBMkJHLE1BQTNCLENBTEgsQ0FERixFQVFFLDZCQUFDLDZCQUFEO0FBQXNCLE1BQUEsSUFBSSxFQUFFSCxPQUFPLENBQUNTLFFBQXBDO0FBQThDLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS1IsS0FBTCxDQUFXUztBQUEzRSxNQVJGLENBREY7QUFZRDs7QUFFREYsRUFBQUEsWUFBWSxDQUFDUixPQUFELEVBQVVHLE1BQVYsRUFBa0I7QUFDNUIsUUFBSSxLQUFLRixLQUFMLENBQVdJLE9BQWYsRUFBd0I7QUFDdEIsYUFDRTtBQUFNLFFBQUEsU0FBUyxFQUFDO0FBQWhCLFNBQ0dGLE1BQU0sQ0FBQ0ksS0FEVixlQUN5Qiw2QkFBQyxnQkFBRDtBQUFTLFFBQUEsSUFBSSxFQUFFUCxPQUFPLENBQUNXO0FBQXZCLFFBRHpCLENBREY7QUFLRCxLQU5ELE1BTU87QUFDTCxhQUNFO0FBQU0sUUFBQSxTQUFTLEVBQUM7QUFBaEIsU0FDR1IsTUFBTSxDQUFDSSxLQURWLGlCQUM0QixLQUFLSyxVQUFMLEVBRDVCLFNBRUcsR0FGSCxFQUVRWixPQUFPLENBQUNhLE1BQVIsQ0FBZUMsR0FBZixDQUFtQkMsTUFBbkIsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FGUixPQUV5Qyw2QkFBQyxnQkFBRDtBQUFTLFFBQUEsSUFBSSxFQUFFZixPQUFPLENBQUNXO0FBQXZCLFFBRnpDLENBREY7QUFNRDtBQUNGOztBQUVEQyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFJLEtBQUtYLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQmMsSUFBcEIsRUFBMEI7QUFDeEIsYUFBTyxrREFBUywyQ0FBTyxLQUFLZixLQUFMLENBQVdDLElBQVgsQ0FBZ0JjLElBQXZCLENBQVQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBaER3RDs7OztnQkFBOUNwQixxQixlQUNRO0FBQ2pCTSxFQUFBQSxJQUFJLEVBQUVlLG1CQUFVQyxNQUFWLENBQWlCQyxVQUROO0FBRWpCZCxFQUFBQSxPQUFPLEVBQUVZLG1CQUFVRyxJQUFWLENBQWVELFVBRlA7QUFHakJULEVBQUFBLGdCQUFnQixFQUFFTyxtQkFBVUksSUFBVixDQUFlRjtBQUhoQixDOztlQWtETix5Q0FBd0J2QixxQkFBeEIsRUFBK0M7QUFDNURNLEVBQUFBLElBQUk7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUR3RCxDQUEvQyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uLy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuLi90aW1lYWdvJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCB7R0hPU1RfVVNFUn0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ29tbWl0Q29tbWVudFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc1JlcGx5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICBjb25zdCBhdXRob3IgPSBjb21tZW50LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXNzdWVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvLXJvd1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmlzUmVwbHkgPyBudWxsIDogPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJjb21tZW50XCIgLz59XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCJcbiAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59IHRpdGxlPXthdXRob3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJIZWFkZXIoY29tbWVudCwgYXV0aG9yKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93biBodG1sPXtjb21tZW50LmJvZHlIVE1MfSBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKGNvbW1lbnQsIGF1dGhvcikge1xuICAgIGlmICh0aGlzLnByb3BzLmlzUmVwbHkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1lbnQtbWVzc2FnZS1oZWFkZXJcIj5cbiAgICAgICAgICB7YXV0aG9yLmxvZ2lufSByZXBsaWVkIDxUaW1lYWdvIHRpbWU9e2NvbW1lbnQuY3JlYXRlZEF0fSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21tZW50LW1lc3NhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAge2F1dGhvci5sb2dpbn0gY29tbWVudGVkIHt0aGlzLnJlbmRlclBhdGgoKX0gaW5cbiAgICAgICAgICB7JyAnfXtjb21tZW50LmNvbW1pdC5vaWQuc3Vic3RyKDAsIDcpfSA8VGltZWFnbyB0aW1lPXtjb21tZW50LmNyZWF0ZWRBdH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJQYXRoKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW0ucGF0aCkge1xuICAgICAgcmV0dXJuIDxzcGFuPm9uIDxjb2RlPnt0aGlzLnByb3BzLml0ZW0ucGF0aH08L2NvZGU+PC9zcGFuPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDb21taXRDb21tZW50Vmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNvbW1pdENvbW1lbnRWaWV3X2l0ZW0gb24gQ29tbWl0Q29tbWVudCB7XG4gICAgICBhdXRob3Ige1xuICAgICAgICBsb2dpbiBhdmF0YXJVcmxcbiAgICAgIH1cbiAgICAgIGNvbW1pdCB7IG9pZCB9XG4gICAgICBib2R5SFRNTCBjcmVhdGVkQXQgcGF0aCBwb3NpdGlvblxuICAgIH1cbiAgYCxcbn0pO1xuIl19