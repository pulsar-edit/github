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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9pc3N1ZS10aW1lbGluZS1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIklzc3VlaXNoVGltZWxpbmVWaWV3IiwiaXNzdWUiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwicHJvcHMiLCJ0aW1lbGluZSIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwidGltZWxpbmVDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwiZnJhZ21lbnRWYXJpYWJsZXMiLCJ1cmwiLCJ0aW1lbGluZUN1cnNvciIsInF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7ZUFFZSwyQ0FBMEJBLDZCQUExQixFQUFnRDtBQUM3REMsRUFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRHdELENBQWhELEVBdUJaO0FBQ0RDLEVBQUFBLFNBQVMsRUFBRSxTQURWOztBQUVEQyxFQUFBQSxzQkFBc0IsQ0FBQ0MsS0FBRCxFQUFRO0FBQzVCLFdBQU9BLEtBQUssQ0FBQ0gsS0FBTixDQUFZSSxRQUFuQjtBQUNELEdBSkE7O0FBS0RDLEVBQUFBLG9CQUFvQixDQUFDQyxRQUFELEVBQVdDLFVBQVgsRUFBdUI7QUFDekMsNkJBQ0tELFFBREw7QUFFRUUsTUFBQUEsYUFBYSxFQUFFRDtBQUZqQjtBQUlELEdBVkE7O0FBV0RFLEVBQUFBLFlBQVksQ0FBQ04sS0FBRCxFQUFRO0FBQUNPLElBQUFBLEtBQUQ7QUFBUUMsSUFBQUE7QUFBUixHQUFSLEVBQXlCQyxpQkFBekIsRUFBNEM7QUFDdEQsV0FBTztBQUNMQyxNQUFBQSxHQUFHLEVBQUVWLEtBQUssQ0FBQ0gsS0FBTixDQUFZYSxHQURaO0FBRUxMLE1BQUFBLGFBQWEsRUFBRUUsS0FGVjtBQUdMSSxNQUFBQSxjQUFjLEVBQUVIO0FBSFgsS0FBUDtBQUtELEdBakJBOztBQWtCREksRUFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBbEJKLENBdkJZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2dyYXBocWwsIGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IElzc3VlaXNoVGltZWxpbmVWaWV3IGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLXRpbWVsaW5lLXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyKElzc3VlaXNoVGltZWxpbmVWaWV3LCB7XG4gIGlzc3VlOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlIG9uIElzc3VlXG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICB0aW1lbGluZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9LFxuICAgICAgdGltZWxpbmVDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgdXJsXG4gICAgICB0aW1lbGluZUl0ZW1zKFxuICAgICAgICBmaXJzdDogJHRpbWVsaW5lQ291bnQsIGFmdGVyOiAkdGltZWxpbmVDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIklzc3VlVGltZWxpbmVDb250cm9sbGVyX3RpbWVsaW5lSXRlbXNcIikge1xuICAgICAgICBwYWdlSW5mbyB7IGVuZEN1cnNvciBoYXNOZXh0UGFnZSB9XG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBjdXJzb3JcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgICAgIC4uLmlzc3VlQ29tbWVudFZpZXdfaXRlbVxuICAgICAgICAgICAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMuaXNzdWUudGltZWxpbmU7XG4gIH0sXG4gIGdldEZyYWdtZW50VmFyaWFibGVzKHByZXZWYXJzLCB0b3RhbENvdW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnByZXZWYXJzLFxuICAgICAgdGltZWxpbmVDb3VudDogdG90YWxDb3VudCxcbiAgICB9O1xuICB9LFxuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSwgZnJhZ21lbnRWYXJpYWJsZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiBwcm9wcy5pc3N1ZS51cmwsXG4gICAgICB0aW1lbGluZUNvdW50OiBjb3VudCxcbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiBjdXJzb3IsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJRdWVyeSgkdGltZWxpbmVDb3VudDogSW50ISwgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmcsICR1cmw6IFVSSSEpIHtcbiAgICAgIHJlc291cmNlKHVybDogJHVybCkge1xuICAgICAgICAuLi4gb24gSXNzdWUge1xuICAgICAgICAgIC4uLmlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlIEBhcmd1bWVudHModGltZWxpbmVDb3VudDogJHRpbWVsaW5lQ291bnQsIHRpbWVsaW5lQ3Vyc29yOiAkdGltZWxpbmVDdXJzb3IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==