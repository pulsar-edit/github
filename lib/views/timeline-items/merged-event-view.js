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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfcmVhY3RSZWxheSIsIl9wcm9wVHlwZXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX29jdGljb24iLCJfdGltZWFnbyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwiZSIsIldlYWtNYXAiLCJyIiwidCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIk51bWJlciIsIkJhcmVNZXJnZWRFdmVudFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsImFjdG9yIiwibWVyZ2VSZWZOYW1lIiwiY3JlYXRlZEF0IiwicHJvcHMiLCJpdGVtIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImljb24iLCJzcmMiLCJhdmF0YXJVcmwiLCJhbHQiLCJsb2dpbiIsInRpdGxlIiwicmVuZGVyQ29tbWl0IiwidGltZSIsImNvbW1pdCIsIkZyYWdtZW50Iiwib2lkIiwic2xpY2UiLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiX2RlZmF1bHQiLCJjcmVhdGVGcmFnbWVudENvbnRhaW5lciIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIl0sInNvdXJjZXMiOlsibWVyZ2VkLWV2ZW50LXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uLy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuLi8uLi92aWV3cy90aW1lYWdvJztcblxuZXhwb3J0IGNsYXNzIEJhcmVNZXJnZWRFdmVudFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBhY3RvcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICAgIGNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgb2lkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICAgIG1lcmdlUmVmTmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgY3JlYXRlZEF0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7YWN0b3IsIG1lcmdlUmVmTmFtZSwgY3JlYXRlZEF0fSA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXJnZWQtZXZlbnRcIj5cbiAgICAgICAgPE9jdGljb24gY2xhc3NOYW1lPVwicHJlLXRpbWVsaW5lLWl0ZW0taWNvblwiIGljb249XCJnaXQtbWVyZ2VcIiAvPlxuICAgICAgICB7YWN0b3IgJiYgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgc3JjPXthY3Rvci5hdmF0YXJVcmx9IGFsdD17YWN0b3IubG9naW59IHRpdGxlPXthY3Rvci5sb2dpbn0gLz59XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1lcmdlZC1ldmVudC1oZWFkZXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1c2VybmFtZVwiPnthY3RvciA/IGFjdG9yLmxvZ2luIDogJ3NvbWVvbmUnfTwvc3Bhbj4gbWVyZ2VkeycgJ31cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21taXQoKX0gaW50b1xuICAgICAgICAgIHsnICd9PHNwYW4gY2xhc3NOYW1lPVwibWVyZ2UtcmVmXCI+e21lcmdlUmVmTmFtZX08L3NwYW4+IG9uIDxUaW1lYWdvIHRpbWU9e2NyZWF0ZWRBdH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1pdCgpIHtcbiAgICBjb25zdCB7Y29tbWl0fSA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICBpZiAoIWNvbW1pdCkge1xuICAgICAgcmV0dXJuICdhIGNvbW1pdCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgY29tbWl0IDxzcGFuIGNsYXNzTmFtZT1cInNoYVwiPntjb21taXQub2lkLnNsaWNlKDAsIDgpfTwvc3Bhbj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlTWVyZ2VkRXZlbnRWaWV3LCB7XG4gIGl0ZW06IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgbWVyZ2VkRXZlbnRWaWV3X2l0ZW0gb24gTWVyZ2VkRXZlbnQge1xuICAgICAgYWN0b3Ige1xuICAgICAgICBhdmF0YXJVcmwgbG9naW5cbiAgICAgIH1cbiAgICAgIGNvbW1pdCB7IG9pZCB9XG4gICAgICBtZXJnZVJlZk5hbWVcbiAgICAgIGNyZWF0ZWRBdFxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxXQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxVQUFBLEdBQUFDLHNCQUFBLENBQUFILE9BQUE7QUFFQSxJQUFBSSxRQUFBLEdBQUFELHNCQUFBLENBQUFILE9BQUE7QUFDQSxJQUFBSyxRQUFBLEdBQUFGLHNCQUFBLENBQUFILE9BQUE7QUFBMEMsU0FBQUcsdUJBQUFHLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyx5QkFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSxDQUFBQyxDQUFBLFdBQUFBLENBQUEsR0FBQUcsQ0FBQSxHQUFBRCxDQUFBLEtBQUFGLENBQUE7QUFBQSxTQUFBWCx3QkFBQVcsQ0FBQSxFQUFBRSxDQUFBLFNBQUFBLENBQUEsSUFBQUYsQ0FBQSxJQUFBQSxDQUFBLENBQUFILFVBQUEsU0FBQUcsQ0FBQSxlQUFBQSxDQUFBLHVCQUFBQSxDQUFBLHlCQUFBQSxDQUFBLFdBQUFGLE9BQUEsRUFBQUUsQ0FBQSxRQUFBRyxDQUFBLEdBQUFKLHdCQUFBLENBQUFHLENBQUEsT0FBQUMsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLEdBQUEsQ0FBQUosQ0FBQSxVQUFBRyxDQUFBLENBQUFFLEdBQUEsQ0FBQUwsQ0FBQSxPQUFBTSxDQUFBLEtBQUFDLFNBQUEsVUFBQUMsQ0FBQSxHQUFBQyxNQUFBLENBQUFDLGNBQUEsSUFBQUQsTUFBQSxDQUFBRSx3QkFBQSxXQUFBQyxDQUFBLElBQUFaLENBQUEsb0JBQUFZLENBQUEsSUFBQUgsTUFB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