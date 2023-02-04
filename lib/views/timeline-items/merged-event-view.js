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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlTWVyZ2VkRXZlbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJhY3RvciIsIm1lcmdlUmVmTmFtZSIsImNyZWF0ZWRBdCIsInByb3BzIiwiaXRlbSIsImF2YXRhclVybCIsImxvZ2luIiwicmVuZGVyQ29tbWl0IiwiY29tbWl0Iiwib2lkIiwic2xpY2UiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciJdLCJzb3VyY2VzIjpbIm1lcmdlZC1ldmVudC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi4vLi4vdmlld3MvdGltZWFnbyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlTWVyZ2VkRXZlbnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgYWN0b3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBsb2dpbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBjb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG9pZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICBtZXJnZVJlZk5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGNyZWF0ZWRBdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2FjdG9yLCBtZXJnZVJlZk5hbWUsIGNyZWF0ZWRBdH0gPSB0aGlzLnByb3BzLml0ZW07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVyZ2VkLWV2ZW50XCI+XG4gICAgICAgIDxPY3RpY29uIGNsYXNzTmFtZT1cInByZS10aW1lbGluZS1pdGVtLWljb25cIiBpY29uPVwiZ2l0LW1lcmdlXCIgLz5cbiAgICAgICAge2FjdG9yICYmIDxpbWcgY2xhc3NOYW1lPVwiYXV0aG9yLWF2YXRhclwiIHNyYz17YWN0b3IuYXZhdGFyVXJsfSBhbHQ9e2FjdG9yLmxvZ2lufSB0aXRsZT17YWN0b3IubG9naW59IC8+fVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtZXJnZWQtZXZlbnQtaGVhZGVyXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXNlcm5hbWVcIj57YWN0b3IgPyBhY3Rvci5sb2dpbiA6ICdzb21lb25lJ308L3NwYW4+IG1lcmdlZHsnICd9XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29tbWl0KCl9IGludG9cbiAgICAgICAgICB7JyAnfTxzcGFuIGNsYXNzTmFtZT1cIm1lcmdlLXJlZlwiPnttZXJnZVJlZk5hbWV9PC9zcGFuPiBvbiA8VGltZWFnbyB0aW1lPXtjcmVhdGVkQXR9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21taXQoKSB7XG4gICAgY29uc3Qge2NvbW1pdH0gPSB0aGlzLnByb3BzLml0ZW07XG4gICAgaWYgKCFjb21taXQpIHtcbiAgICAgIHJldHVybiAnYSBjb21taXQnO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIGNvbW1pdCA8c3BhbiBjbGFzc05hbWU9XCJzaGFcIj57Y29tbWl0Lm9pZC5zbGljZSgwLCA4KX08L3NwYW4+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZU1lcmdlZEV2ZW50Vmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IG1lcmdlZEV2ZW50Vmlld19pdGVtIG9uIE1lcmdlZEV2ZW50IHtcbiAgICAgIGFjdG9yIHtcbiAgICAgICAgYXZhdGFyVXJsIGxvZ2luXG4gICAgICB9XG4gICAgICBjb21taXQgeyBvaWQgfVxuICAgICAgbWVyZ2VSZWZOYW1lXG4gICAgICBjcmVhdGVkQXRcbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUEwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFbkMsTUFBTUEsbUJBQW1CLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBZXZEQyxNQUFNLEdBQUc7SUFDUCxNQUFNO01BQUNDLEtBQUs7TUFBRUMsWUFBWTtNQUFFQztJQUFTLENBQUMsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsSUFBSTtJQUN4RCxPQUNFO01BQUssU0FBUyxFQUFDO0lBQWMsR0FDM0IsNkJBQUMsZ0JBQU87TUFBQyxTQUFTLEVBQUMsd0JBQXdCO01BQUMsSUFBSSxFQUFDO0lBQVcsRUFBRyxFQUM5REosS0FBSyxJQUFJO01BQUssU0FBUyxFQUFDLGVBQWU7TUFBQyxHQUFHLEVBQUVBLEtBQUssQ0FBQ0ssU0FBVTtNQUFDLEdBQUcsRUFBRUwsS0FBSyxDQUFDTSxLQUFNO01BQUMsS0FBSyxFQUFFTixLQUFLLENBQUNNO0lBQU0sRUFBRyxFQUN2RztNQUFNLFNBQVMsRUFBQztJQUFxQixHQUNuQztNQUFNLFNBQVMsRUFBQztJQUFVLEdBQUVOLEtBQUssR0FBR0EsS0FBSyxDQUFDTSxLQUFLLEdBQUcsU0FBUyxDQUFRLGFBQVEsR0FBRyxFQUM3RSxJQUFJLENBQUNDLFlBQVksRUFBRSxXQUNuQixHQUFHLEVBQUM7TUFBTSxTQUFTLEVBQUM7SUFBVyxHQUFFTixZQUFZLENBQVEsVUFBSSw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBRUM7SUFBVSxFQUFHLENBQ2pGLENBQ0g7RUFFVjtFQUVBSyxZQUFZLEdBQUc7SUFDYixNQUFNO01BQUNDO0lBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQ0wsS0FBSyxDQUFDQyxJQUFJO0lBQ2hDLElBQUksQ0FBQ0ksTUFBTSxFQUFFO01BQ1gsT0FBTyxVQUFVO0lBQ25CO0lBRUEsT0FDRSw2QkFBQyxlQUFRLG1CQUNBO01BQU0sU0FBUyxFQUFDO0lBQUssR0FBRUEsTUFBTSxDQUFDQyxHQUFHLENBQUNDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQVEsQ0FDbkQ7RUFFZjtBQUNGO0FBQUM7QUFBQSxnQkExQ1lkLG1CQUFtQixlQUNYO0VBQ2pCUSxJQUFJLEVBQUVPLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUNwQlosS0FBSyxFQUFFVyxrQkFBUyxDQUFDQyxLQUFLLENBQUM7TUFDckJQLFNBQVMsRUFBRU0sa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDQyxVQUFVO01BQ3RDUixLQUFLLEVBQUVLLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7SUFDMUIsQ0FBQyxDQUFDO0lBQ0ZOLE1BQU0sRUFBRUcsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQ3RCSCxHQUFHLEVBQUVFLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7SUFDeEIsQ0FBQyxDQUFDO0lBQ0ZiLFlBQVksRUFBRVUsa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDQyxVQUFVO0lBQ3pDWixTQUFTLEVBQUVTLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7RUFDOUIsQ0FBQyxDQUFDLENBQUNBO0FBQ0wsQ0FBQztBQUFBLGVBK0JZLElBQUFDLG1DQUF1QixFQUFDbkIsbUJBQW1CLEVBQUU7RUFDMURRLElBQUk7SUFBQTtJQUFBO01BQUE7SUFBQTtJQUFBO0VBQUE7QUFVTixDQUFDLENBQUM7QUFBQSJ9