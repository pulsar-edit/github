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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9wci10aW1lbGluZS1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIklzc3VlaXNoVGltZWxpbmVWaWV3IiwicHVsbFJlcXVlc3QiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwicHJvcHMiLCJ0aW1lbGluZSIsImdldEZyYWdtZW50VmFyaWFibGVzIiwicHJldlZhcnMiLCJ0b3RhbENvdW50IiwidGltZWxpbmVDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwiZnJhZ21lbnRWYXJpYWJsZXMiLCJ1cmwiLCJ0aW1lbGluZUN1cnNvciIsInF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7ZUFFZSwyQ0FBMEJBLDZCQUExQixFQUFnRDtBQUM3REMsRUFBQUEsV0FBVztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRGtELENBQWhELEVBMkJaO0FBQ0RDLEVBQUFBLFNBQVMsRUFBRSxTQURWOztBQUVEQyxFQUFBQSxzQkFBc0IsQ0FBQ0MsS0FBRCxFQUFRO0FBQzVCLFdBQU9BLEtBQUssQ0FBQ0gsV0FBTixDQUFrQkksUUFBekI7QUFDRCxHQUpBOztBQUtEQyxFQUFBQSxvQkFBb0IsQ0FBQ0MsUUFBRCxFQUFXQyxVQUFYLEVBQXVCO0FBQ3pDLDZCQUNLRCxRQURMO0FBRUVFLE1BQUFBLGFBQWEsRUFBRUQ7QUFGakI7QUFJRCxHQVZBOztBQVdERSxFQUFBQSxZQUFZLENBQUNOLEtBQUQsRUFBUTtBQUFDTyxJQUFBQSxLQUFEO0FBQVFDLElBQUFBO0FBQVIsR0FBUixFQUF5QkMsaUJBQXpCLEVBQTRDO0FBQ3RELFdBQU87QUFDTEMsTUFBQUEsR0FBRyxFQUFFVixLQUFLLENBQUNILFdBQU4sQ0FBa0JhLEdBRGxCO0FBRUxMLE1BQUFBLGFBQWEsRUFBRUUsS0FGVjtBQUdMSSxNQUFBQSxjQUFjLEVBQUVIO0FBSFgsS0FBUDtBQUtELEdBakJBOztBQWtCREksRUFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBbEJKLENBM0JZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2dyYXBocWwsIGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IElzc3VlaXNoVGltZWxpbmVWaWV3IGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLXRpbWVsaW5lLXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyKElzc3VlaXNoVGltZWxpbmVWaWV3LCB7XG4gIHB1bGxSZXF1ZXN0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByVGltZWxpbmVDb250cm9sbGVyX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICB0aW1lbGluZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9LFxuICAgICAgdGltZWxpbmVDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgdXJsXG4gICAgICAuLi5oZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXNzdWVpc2hcbiAgICAgIHRpbWVsaW5lSXRlbXMoZmlyc3Q6ICR0aW1lbGluZUNvdW50LCBhZnRlcjogJHRpbWVsaW5lQ3Vyc29yKVxuICAgICAgQGNvbm5lY3Rpb24oa2V5OiBcInByVGltZWxpbmVDb250YWluZXJfdGltZWxpbmVJdGVtc1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHsgZW5kQ3Vyc29yIGhhc05leHRQYWdlIH1cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgICAgLi4uY29tbWl0c1ZpZXdfbm9kZXNcbiAgICAgICAgICAgIC4uLmlzc3VlQ29tbWVudFZpZXdfaXRlbVxuICAgICAgICAgICAgLi4ubWVyZ2VkRXZlbnRWaWV3X2l0ZW1cbiAgICAgICAgICAgIC4uLmhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtXG4gICAgICAgICAgICAuLi5jb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtXG4gICAgICAgICAgICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5wdWxsUmVxdWVzdC50aW1lbGluZTtcbiAgfSxcbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucHJldlZhcnMsXG4gICAgICB0aW1lbGluZUNvdW50OiB0b3RhbENvdW50LFxuICAgIH07XG4gIH0sXG4gIGdldFZhcmlhYmxlcyhwcm9wcywge2NvdW50LCBjdXJzb3J9LCBmcmFnbWVudFZhcmlhYmxlcykge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6IHByb3BzLnB1bGxSZXF1ZXN0LnVybCxcbiAgICAgIHRpbWVsaW5lQ291bnQ6IGNvdW50LFxuICAgICAgdGltZWxpbmVDdXJzb3I6IGN1cnNvcixcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSBwclRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5KCR0aW1lbGluZUNvdW50OiBJbnQhLCAkdGltZWxpbmVDdXJzb3I6IFN0cmluZywgJHVybDogVVJJISkge1xuICAgICAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgICAgIC4uLiBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICAgICAgLi4ucHJUaW1lbGluZUNvbnRyb2xsZXJfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LFxuICAgICAgICAgICAgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19