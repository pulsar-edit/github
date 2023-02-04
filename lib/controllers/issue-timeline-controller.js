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
  issue: function () {
    const node = require("./__generated__/issueTimelineController_issue.graphql");
    if (node.hash && node.hash !== "d8cfa7a752ac7094c36e60da5e1ff895") {
      console.error("The definition of 'issueTimelineController_issue' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/issueTimelineController_issue.graphql");
  }
}, {
  direction: 'forward',
  getConnectionFromProps(props) {
    return props.issue.timeline;
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
      url: props.issue.url,
      timelineCount: count,
      timelineCursor: cursor
    };
  },
  query: function () {
    const node = require("./__generated__/issueTimelineControllerQuery.graphql");
    if (node.hash && node.hash !== "5a04d82da4187ed75fb5e133f79b4ab4") {
      console.error("The definition of 'issueTimelineControllerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/issueTimelineControllerQuery.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyIiwiSXNzdWVpc2hUaW1lbGluZVZpZXciLCJpc3N1ZSIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJwcm9wcyIsInRpbWVsaW5lIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJ0aW1lbGluZUNvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJmcmFnbWVudFZhcmlhYmxlcyIsInVybCIsInRpbWVsaW5lQ3Vyc29yIiwicXVlcnkiXSwic291cmNlcyI6WyJpc3N1ZS10aW1lbGluZS1jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgSXNzdWVpc2hUaW1lbGluZVZpZXcgZnJvbSAnLi4vdmlld3MvaXNzdWVpc2gtdGltZWxpbmUtdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoSXNzdWVpc2hUaW1lbGluZVZpZXcsIHtcbiAgaXNzdWU6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUgb24gSXNzdWVcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIHRpbWVsaW5lQ291bnQ6IHt0eXBlOiBcIkludCFcIn0sXG4gICAgICB0aW1lbGluZUN1cnNvcjoge3R5cGU6IFwiU3RyaW5nXCJ9XG4gICAgKSB7XG4gICAgICB1cmxcbiAgICAgIHRpbWVsaW5lSXRlbXMoXG4gICAgICAgIGZpcnN0OiAkdGltZWxpbmVDb3VudCwgYWZ0ZXI6ICR0aW1lbGluZUN1cnNvclxuICAgICAgKSBAY29ubmVjdGlvbihrZXk6IFwiSXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfdGltZWxpbmVJdGVtc1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHsgZW5kQ3Vyc29yIGhhc05leHRQYWdlIH1cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgICAgLi4uaXNzdWVDb21tZW50Vmlld19pdGVtXG4gICAgICAgICAgICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5pc3N1ZS50aW1lbGluZTtcbiAgfSxcbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucHJldlZhcnMsXG4gICAgICB0aW1lbGluZUNvdW50OiB0b3RhbENvdW50LFxuICAgIH07XG4gIH0sXG4gIGdldFZhcmlhYmxlcyhwcm9wcywge2NvdW50LCBjdXJzb3J9LCBmcmFnbWVudFZhcmlhYmxlcykge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6IHByb3BzLmlzc3VlLnVybCxcbiAgICAgIHRpbWVsaW5lQ291bnQ6IGNvdW50LFxuICAgICAgdGltZWxpbmVDdXJzb3I6IGN1cnNvcixcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5KCR0aW1lbGluZUNvdW50OiBJbnQhLCAkdGltZWxpbmVDdXJzb3I6IFN0cmluZywgJHVybDogVVJJISkge1xuICAgICAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgICAgIC4uLiBvbiBJc3N1ZSB7XG4gICAgICAgICAgLi4uaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUgQGFyZ3VtZW50cyh0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudCwgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBO0FBQW1FO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBRXBELElBQUFBLHFDQUF5QixFQUFDQyw2QkFBb0IsRUFBRTtFQUM3REMsS0FBSztJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQXNCUCxDQUFDLEVBQUU7RUFDREMsU0FBUyxFQUFFLFNBQVM7RUFDcEJDLHNCQUFzQixDQUFDQyxLQUFLLEVBQUU7SUFDNUIsT0FBT0EsS0FBSyxDQUFDSCxLQUFLLENBQUNJLFFBQVE7RUFDN0IsQ0FBQztFQUNEQyxvQkFBb0IsQ0FBQ0MsUUFBUSxFQUFFQyxVQUFVLEVBQUU7SUFDekMseUJBQ0tELFFBQVE7TUFDWEUsYUFBYSxFQUFFRDtJQUFVO0VBRTdCLENBQUM7RUFDREUsWUFBWSxDQUFDTixLQUFLLEVBQUU7SUFBQ08sS0FBSztJQUFFQztFQUFNLENBQUMsRUFBRUMsaUJBQWlCLEVBQUU7SUFDdEQsT0FBTztNQUNMQyxHQUFHLEVBQUVWLEtBQUssQ0FBQ0gsS0FBSyxDQUFDYSxHQUFHO01BQ3BCTCxhQUFhLEVBQUVFLEtBQUs7TUFDcEJJLGNBQWMsRUFBRUg7SUFDbEIsQ0FBQztFQUNILENBQUM7RUFDREksS0FBSztJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQVNQLENBQUMsQ0FBQztBQUFBIn0=