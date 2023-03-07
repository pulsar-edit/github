"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareMergedEventView = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _octicon = _interopRequireDefault(require("../../atom/octicon"));
var _timeago = _interopRequireDefault(require("../../views/timeago"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareMergedEventView extends _react.default.Component {
  render() {
    const {
      actor,
      mergeRefName,
      createdAt
    } = this.props.item;
    return _react.default.createElement("div", {
      className: "merged-event"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "git-merge"
    }), actor && _react.default.createElement("img", {
      className: "author-avatar",
      src: actor.avatarUrl,
      alt: actor.login,
      title: actor.login
    }), _react.default.createElement("span", {
      className: "merged-event-header"
    }, _react.default.createElement("span", {
      className: "username"
    }, actor ? actor.login : 'someone'), " merged", ' ', this.renderCommit(), " into", ' ', _react.default.createElement("span", {
      className: "merge-ref"
    }, mergeRefName), " on ", _react.default.createElement(_timeago.default, {
      time: createdAt
    })));
  }
  renderCommit() {
    const {
      commit
    } = this.props.item;
    if (!commit) {
      return 'a commit';
    }
    return _react.default.createElement(_react.Fragment, null, "commit ", _react.default.createElement("span", {
      className: "sha"
    }, commit.oid.slice(0, 8)));
  }
}
exports.BareMergedEventView = BareMergedEventView;
_defineProperty(BareMergedEventView, "propTypes", {
  item: _propTypes.default.shape({
    actor: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    commit: _propTypes.default.shape({
      oid: _propTypes.default.string.isRequired
    }),
    mergeRefName: _propTypes.default.string.isRequired,
    createdAt: _propTypes.default.string.isRequired
  }).isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareMergedEventView, {
  item: function () {
    const node = require("./__generated__/mergedEventView_item.graphql");
    if (node.hash && node.hash !== "d265decf08c14d96c2ec47fd5852a956") {
      console.error("The definition of 'mergedEventView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/mergedEventView_item.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcmVhY3RSZWxheSIsIl9wcm9wVHlwZXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX29jdGljb24iLCJfdGltZWFnbyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJfZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiQmFyZU1lcmdlZEV2ZW50VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiYWN0b3IiLCJtZXJnZVJlZk5hbWUiLCJjcmVhdGVkQXQiLCJwcm9wcyIsIml0ZW0iLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaWNvbiIsInNyYyIsImF2YXRhclVybCIsImFsdCIsImxvZ2luIiwidGl0bGUiLCJyZW5kZXJDb21taXQiLCJ0aW1lIiwiY29tbWl0IiwiRnJhZ21lbnQiLCJvaWQiLCJzbGljZSIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJfZGVmYXVsdCIsImNyZWF0ZUZyYWdtZW50Q29udGFpbmVyIiwibm9kZSIsImhhc2giLCJjb25zb2xlIiwiZXJyb3IiXSwic291cmNlcyI6WyJtZXJnZWQtZXZlbnQtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4uLy4uL3ZpZXdzL3RpbWVhZ28nO1xuXG5leHBvcnQgY2xhc3MgQmFyZU1lcmdlZEV2ZW50VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGFjdG9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgY29tbWl0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBvaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgbWVyZ2VSZWZOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBjcmVhdGVkQXQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHthY3RvciwgbWVyZ2VSZWZOYW1lLCBjcmVhdGVkQXR9ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lcmdlZC1ldmVudFwiPlxuICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cImdpdC1tZXJnZVwiIC8+XG4gICAgICAgIHthY3RvciAmJiA8aW1nIGNsYXNzTmFtZT1cImF1dGhvci1hdmF0YXJcIiBzcmM9e2FjdG9yLmF2YXRhclVybH0gYWx0PXthY3Rvci5sb2dpbn0gdGl0bGU9e2FjdG9yLmxvZ2lufSAvPn1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWVyZ2VkLWV2ZW50LWhlYWRlclwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVzZXJuYW1lXCI+e2FjdG9yID8gYWN0b3IubG9naW4gOiAnc29tZW9uZSd9PC9zcGFuPiBtZXJnZWR7JyAnfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdCgpfSBpbnRvXG4gICAgICAgICAgeycgJ308c3BhbiBjbGFzc05hbWU9XCJtZXJnZS1yZWZcIj57bWVyZ2VSZWZOYW1lfTwvc3Bhbj4gb24gPFRpbWVhZ28gdGltZT17Y3JlYXRlZEF0fSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWl0KCkge1xuICAgIGNvbnN0IHtjb21taXR9ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIGlmICghY29tbWl0KSB7XG4gICAgICByZXR1cm4gJ2EgY29tbWl0JztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICBjb21taXQgPHNwYW4gY2xhc3NOYW1lPVwic2hhXCI+e2NvbW1pdC5vaWQuc2xpY2UoMCwgOCl9PC9zcGFuPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVNZXJnZWRFdmVudFZpZXcsIHtcbiAgaXRlbTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBtZXJnZWRFdmVudFZpZXdfaXRlbSBvbiBNZXJnZWRFdmVudCB7XG4gICAgICBhY3RvciB7XG4gICAgICAgIGF2YXRhclVybCBsb2dpblxuICAgICAgfVxuICAgICAgY29tbWl0IHsgb2lkIH1cbiAgICAgIG1lcmdlUmVmTmFtZVxuICAgICAgY3JlYXRlZEF0XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFdBQUEsR0FBQUQsT0FBQTtBQUNBLElBQUFFLFVBQUEsR0FBQUMsc0JBQUEsQ0FBQUgsT0FBQTtBQUVBLElBQUFJLFFBQUEsR0FBQUQsc0JBQUEsQ0FBQUgsT0FBQTtBQUNBLElBQUFLLFFBQUEsR0FBQUYsc0JBQUEsQ0FBQUgsT0FBQTtBQUEwQyxTQUFBRyx1QkFBQUcsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFHLHlCQUFBQyxXQUFBLGVBQUFDLE9BQUEsa0NBQUFDLGlCQUFBLE9BQUFELE9BQUEsUUFBQUUsZ0JBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxXQUFBLFdBQUFBLFdBQUEsR0FBQUcsZ0JBQUEsR0FBQUQsaUJBQUEsS0FBQUYsV0FBQTtBQUFBLFNBQUFYLHdCQUFBTyxHQUFBLEVBQUFJLFdBQUEsU0FBQUEsV0FBQSxJQUFBSixHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxXQUFBRCxHQUFBLFFBQUFBLEdBQUEsb0JBQUFBLEdBQUEsd0JBQUFBLEdBQUEsNEJBQUFFLE9BQUEsRUFBQUYsR0FBQSxVQUFBUSxLQUFBLEdBQUFMLHdCQUFBLENBQUFDLFdBQUEsT0FBQUksS0FBQSxJQUFBQSxLQUFBLENBQUFDLEdBQUEsQ0FBQVQsR0FBQSxZQUFBUSxLQUFBLENBQUFFLEdBQUEsQ0FBQVYsR0FBQSxTQUFBVyxNQUFBLFdBQUFDLHFCQUFBLEdBQUFDLE1BQUEsQ0FBQUMsY0FBQSxJQUFBRCxNQUFBLENBQUFFLHdCQUFBLFdBQUFDLEdBQUEsSUFBQWhCLEdBQUEsUUFBQWdCLEdBQUEsa0JBQUFILE1BQUEsQ0FBQUksU0FBQSxDQUFBQyxjQUFBLENBQUFDLElBQUEsQ0FBQW5CLEdBQUEsRUFBQWdCLEdBQUEsU0FBQUksSUFBQSxHQUFBUixxQkFBQSxHQUFBQyxNQUFBLENBQUFFLHdCQUFBLENBQUFmLEdBQUEsRUFBQWdCLEdBQUEsY0FBQUksSUFBQSxLQUFBQSxJQUFBLENBQUFWLEdBQUEsSUFBQVUsSUFBQSxDQUFBQyxHQUFBLEtBQUFSLE1BQUEsQ0FBQUMsY0FBQSxDQUFBSCxNQUFBLEVBQUFLLEdBQUEsRUFBQUksSUFBQSxZQUFBVCxNQUFBLENBQUFLLEdBQUEsSUFBQWhCLEdBQUEsQ0FBQWdCLEdBQUEsU0FBQUwsTUFBQSxDQUFBVCxPQUFBLEdBQUFGLEdBQUEsTUFBQVEsS0FBQSxJQUFBQSxLQUFBLENBQUFhLEdBQUEsQ0FBQXJCLEdBQUEsRUFBQVcsTUFBQSxZQUFBQSxNQUFBO0FBQUEsU0FBQVcsZ0JBQUF0QixHQUFBLEVBQUFnQixHQUFBLEVBQUFPLEtBQUEsSUFBQVAsR0FBQSxHQUFBUSxjQUFBLENBQUFSLEdBQUEsT0FBQUEsR0FBQSxJQUFBaEIsR0FBQSxJQUFBYSxNQUFBLENBQUFDLGNBQUEsQ0FBQWQsR0FBQSxFQUFBZ0IsR0FBQSxJQUFBTyxLQUFBLEVBQUFBLEtBQUEsRUFBQUUsVUFBQSxRQUFBQyxZQUFBLFFBQUFDLFFBQUEsb0JBQUEzQixHQUFBLENBQUFnQixHQUFBLElBQUFPLEtBQUEsV0FBQXZCLEdBQUE7QUFBQSxTQUFBd0IsZUFBQUksR0FBQSxRQUFBWixHQUFBLEdBQUFhLFlBQUEsQ0FBQUQsR0FBQSwyQkFBQVosR0FBQSxnQkFBQUEsR0FBQSxHQUFBYyxNQUFBLENBQUFkLEdBQUE7QUFBQSxTQUFBYSxhQUFBRSxLQUFBLEVBQUFDLElBQUEsZUFBQUQsS0FBQSxpQkFBQUEsS0FBQSxrQkFBQUEsS0FBQSxNQUFBRSxJQUFBLEdBQUFGLEtBQUEsQ0FBQUcsTUFBQSxDQUFBQyxXQUFBLE9BQUFGLElBQUEsS0FBQUcsU0FBQSxRQUFBQyxHQUFBLEdBQUFKLElBQUEsQ0FBQWQsSUFBQSxDQUFBWSxLQUFBLEVBQUFDLElBQUEsMkJBQUFLLEdBQUEsc0JBQUFBLEdBQUEsWUFBQUMsU0FBQSw0REFBQU4sSUFBQSxnQkFBQUYsTUFBQSxHQUFBUyxNQUFBLEVBQUFSLEtBQUE7QUFFbkMsTUFBTVMsbUJBQW1CLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBZXZEQyxNQUFNQSxDQUFBLEVBQUc7SUFDUCxNQUFNO01BQUNDLEtBQUs7TUFBRUMsWUFBWTtNQUFFQztJQUFTLENBQUMsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsSUFBSTtJQUN4RCxPQUNFeEQsTUFBQSxDQUFBVSxPQUFBLENBQUErQyxhQUFBO01BQUtDLFNBQVMsRUFBQztJQUFjLEdBQzNCMUQsTUFBQSxDQUFBVSxPQUFBLENBQUErQyxhQUFBLENBQUNuRCxRQUFBLENBQUFJLE9BQU87TUFBQ2dELFNBQVMsRUFBQyx3QkFBd0I7TUFBQ0MsSUFBSSxFQUFDO0lBQVcsRUFBRyxFQUM5RFAsS0FBSyxJQUFJcEQsTUFBQSxDQUFBVSxPQUFBLENBQUErQyxhQUFBO01BQUtDLFNBQVMsRUFBQyxlQUFlO01BQUNFLEdBQUcsRUFBRVIsS0FBSyxDQUFDUyxTQUFVO01BQUNDLEdBQUcsRUFBRVYsS0FBSyxDQUFDVyxLQUFNO01BQUNDLEtBQUssRUFBRVosS0FBSyxDQUFDVztJQUFNLEVBQUcsRUFDdkcvRCxNQUFBLENBQUFVLE9BQUEsQ0FBQStDLGFBQUE7TUFBTUMsU0FBUyxFQUFDO0lBQXFCLEdBQ25DMUQsTUFBQSxDQUFBVSxPQUFBLENBQUErQyxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUFVLEdBQUVOLEtBQUssR0FBR0EsS0FBSyxDQUFDVyxLQUFLLEdBQUcsU0FBUyxDQUFRLGFBQVEsR0FBRyxFQUM3RSxJQUFJLENBQUNFLFlBQVksRUFBRSxXQUNuQixHQUFHLEVBQUNqRSxNQUFBLENBQUFVLE9BQUEsQ0FBQStDLGFBQUE7TUFBTUMsU0FBUyxFQUFDO0lBQVcsR0FBRUwsWUFBWSxDQUFRLFVBQUlyRCxNQUFBLENBQUFVLE9BQUEsQ0FBQStDLGFBQUEsQ0FBQ2xELFFBQUEsQ0FBQUcsT0FBTztNQUFDd0QsSUFBSSxFQUFFWjtJQUFVLEVBQUcsQ0FDakYsQ0FDSDtFQUVWO0VBRUFXLFlBQVlBLENBQUEsRUFBRztJQUNiLE1BQU07TUFBQ0U7SUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDWixLQUFLLENBQUNDLElBQUk7SUFDaEMsSUFBSSxDQUFDVyxNQUFNLEVBQUU7TUFDWCxPQUFPLFVBQVU7SUFDbkI7SUFFQSxPQUNFbkUsTUFBQSxDQUFBVSxPQUFBLENBQUErQyxhQUFBLENBQUN6RCxNQUFBLENBQUFvRSxRQUFRLG1CQUNBcEUsTUFBQSxDQUFBVSxPQUFBLENBQUErQyxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUFLLEdBQUVTLE1BQU0sQ0FBQ0UsR0FBRyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFRLENBQ25EO0VBRWY7QUFDRjtBQUFDQyxPQUFBLENBQUF2QixtQkFBQSxHQUFBQSxtQkFBQTtBQUFBbEIsZUFBQSxDQTFDWWtCLG1CQUFtQixlQUNYO0VBQ2pCUSxJQUFJLEVBQUVnQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDcEJyQixLQUFLLEVBQUVvQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7TUFDckJaLFNBQVMsRUFBRVcsa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDQyxVQUFVO01BQ3RDWixLQUFLLEVBQUVTLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7SUFDMUIsQ0FBQyxDQUFDO0lBQ0ZSLE1BQU0sRUFBRUssa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQ3RCSixHQUFHLEVBQUVHLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7SUFDeEIsQ0FBQyxDQUFDO0lBQ0Z0QixZQUFZLEVBQUVtQixrQkFBUyxDQUFDRSxNQUFNLENBQUNDLFVBQVU7SUFDekNyQixTQUFTLEVBQUVrQixrQkFBUyxDQUFDRSxNQUFNLENBQUNDO0VBQzlCLENBQUMsQ0FBQyxDQUFDQTtBQUNMLENBQUM7QUFBQSxJQUFBQyxRQUFBLEdBK0JZLElBQUFDLG1DQUF1QixFQUFDN0IsbUJBQW1CLEVBQUU7RUFDMURRLElBQUksV0FBQUEsQ0FBQTtJQUFBLE1BQUFzQixJQUFBLEdBQUE1RSxPQUFBO0lBQUEsSUFBQTRFLElBQUEsQ0FBQUMsSUFBQSxJQUFBRCxJQUFBLENBQUFDLElBQUE7TUFBQUMsT0FBQSxDQUFBQyxLQUFBO0lBQUE7SUFBQSxPQUFBL0UsT0FBQTtFQUFBO0FBVU4sQ0FBQyxDQUFDO0FBQUFxRSxPQUFBLENBQUE3RCxPQUFBLEdBQUFrRSxRQUFBIn0=