"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactRelay = require("react-relay");
var _issueishTimelineView = _interopRequireDefault(require("../views/issueish-timeline-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var _default = (0, _reactRelay.createPaginationContainer)(_issueishTimelineView.default, {
  pullRequest: function () {
    const node = require("./__generated__/prTimelineController_pullRequest.graphql");
    if (node.hash && node.hash !== "048c72a9c157a3d7c9fdc301905a1eeb") {
      console.error("The definition of 'prTimelineController_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/prTimelineController_pullRequest.graphql");
  }
}, {
  direction: 'forward',
  getConnectionFromProps(props) {
    return props.pullRequest.timeline;
  },
  getFragmentVariables(prevVars, totalCount) {
    return _objectSpread({}, prevVars, {
      timelineCount: totalCount
    });
  },
  getVariables(props, {
    count,
    cursor
  }, fragmentVariables) {
    return {
      url: props.pullRequest.url,
      timelineCount: count,
      timelineCursor: cursor
    };
  },
  query: function () {
    const node = require("./__generated__/prTimelineControllerQuery.graphql");
    if (node.hash && node.hash !== "9666ee294586973cd7b27193e460c2e1") {
      console.error("The definition of 'prTimelineControllerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/prTimelineControllerQuery.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyIiwiSXNzdWVpc2hUaW1lbGluZVZpZXciLCJwdWxsUmVxdWVzdCIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJwcm9wcyIsInRpbWVsaW5lIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJ0aW1lbGluZUNvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJmcmFnbWVudFZhcmlhYmxlcyIsInVybCIsInRpbWVsaW5lQ3Vyc29yIiwicXVlcnkiXSwic291cmNlcyI6WyJwci10aW1lbGluZS1jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgSXNzdWVpc2hUaW1lbGluZVZpZXcgZnJvbSAnLi4vdmlld3MvaXNzdWVpc2gtdGltZWxpbmUtdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoSXNzdWVpc2hUaW1lbGluZVZpZXcsIHtcbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJUaW1lbGluZUNvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3RcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIHRpbWVsaW5lQ291bnQ6IHt0eXBlOiBcIkludCFcIn0sXG4gICAgICB0aW1lbGluZUN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICB1cmxcbiAgICAgIC4uLmhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaFxuICAgICAgdGltZWxpbmVJdGVtcyhmaXJzdDogJHRpbWVsaW5lQ291bnQsIGFmdGVyOiAkdGltZWxpbmVDdXJzb3IpXG4gICAgICBAY29ubmVjdGlvbihrZXk6IFwicHJUaW1lbGluZUNvbnRhaW5lcl90aW1lbGluZUl0ZW1zXCIpIHtcbiAgICAgICAgcGFnZUluZm8geyBlbmRDdXJzb3IgaGFzTmV4dFBhZ2UgfVxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgICAuLi5jb21taXRzVmlld19ub2Rlc1xuICAgICAgICAgICAgLi4uaXNzdWVDb21tZW50Vmlld19pdGVtXG4gICAgICAgICAgICAuLi5tZXJnZWRFdmVudFZpZXdfaXRlbVxuICAgICAgICAgICAgLi4uaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW1cbiAgICAgICAgICAgIC4uLmNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW1cbiAgICAgICAgICAgIC4uLmNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnB1bGxSZXF1ZXN0LnRpbWVsaW5lO1xuICB9LFxuICBnZXRGcmFnbWVudFZhcmlhYmxlcyhwcmV2VmFycywgdG90YWxDb3VudCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5wcmV2VmFycyxcbiAgICAgIHRpbWVsaW5lQ291bnQ6IHRvdGFsQ291bnQsXG4gICAgfTtcbiAgfSxcbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0sIGZyYWdtZW50VmFyaWFibGVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogcHJvcHMucHVsbFJlcXVlc3QudXJsLFxuICAgICAgdGltZWxpbmVDb3VudDogY291bnQsXG4gICAgICB0aW1lbGluZUN1cnNvcjogY3Vyc29yLFxuICAgIH07XG4gIH0sXG4gIHF1ZXJ5OiBncmFwaHFsYFxuICAgIHF1ZXJ5IHByVGltZWxpbmVDb250cm9sbGVyUXVlcnkoJHRpbWVsaW5lQ291bnQ6IEludCEsICR0aW1lbGluZUN1cnNvcjogU3RyaW5nLCAkdXJsOiBVUkkhKSB7XG4gICAgICByZXNvdXJjZSh1cmw6ICR1cmwpIHtcbiAgICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgICAgICAuLi5wclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgdGltZWxpbmVDb3VudDogJHRpbWVsaW5lQ291bnQsXG4gICAgICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUE7QUFBbUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFFcEQsSUFBQUEscUNBQXlCLEVBQUNDLDZCQUFvQixFQUFFO0VBQzdEQyxXQUFXO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBMEJiLENBQUMsRUFBRTtFQUNEQyxTQUFTLEVBQUUsU0FBUztFQUNwQkMsc0JBQXNCLENBQUNDLEtBQUssRUFBRTtJQUM1QixPQUFPQSxLQUFLLENBQUNILFdBQVcsQ0FBQ0ksUUFBUTtFQUNuQyxDQUFDO0VBQ0RDLG9CQUFvQixDQUFDQyxRQUFRLEVBQUVDLFVBQVUsRUFBRTtJQUN6Qyx5QkFDS0QsUUFBUTtNQUNYRSxhQUFhLEVBQUVEO0lBQVU7RUFFN0IsQ0FBQztFQUNERSxZQUFZLENBQUNOLEtBQUssRUFBRTtJQUFDTyxLQUFLO0lBQUVDO0VBQU0sQ0FBQyxFQUFFQyxpQkFBaUIsRUFBRTtJQUN0RCxPQUFPO01BQ0xDLEdBQUcsRUFBRVYsS0FBSyxDQUFDSCxXQUFXLENBQUNhLEdBQUc7TUFDMUJMLGFBQWEsRUFBRUUsS0FBSztNQUNwQkksY0FBYyxFQUFFSDtJQUNsQixDQUFDO0VBQ0gsQ0FBQztFQUNESSxLQUFLO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBWVAsQ0FBQyxDQUFDO0FBQUEifQ==