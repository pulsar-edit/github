"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

var _moment = _interopRequireDefault(require("moment"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/updatePrReviewSummaryMutation.graphql");

  if (node.hash && node.hash !== "ce6fa7b9b5a5709f8cc8001aa7ba8a15") {
    console.error("The definition of 'updatePrReviewSummaryMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/updatePrReviewSummaryMutation.graphql");
};

var _default = (environment, {
  reviewId,
  reviewBody
}) => {
  const variables = {
    input: {
      pullRequestReviewId: reviewId,
      body: reviewBody
    }
  };
  const optimisticResponse = {
    updatePullRequestReview: {
      pullRequestReview: {
        id: reviewId,
        lastEditedAt: (0, _moment.default)().toISOString(),
        body: reviewBody,
        bodyHTML: (0, _helpers.renderMarkdown)(reviewBody)
      }
    }
  };
  return new Promise((resolve, reject) => {
    (0, _reactRelay.commitMutation)(environment, {
      mutation,
      variables,
      optimisticResponse,
      onCompleted: resolve,
      onError: reject
    });
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvdXBkYXRlLXByLXJldmlldy1zdW1tYXJ5LmpzIl0sIm5hbWVzIjpbIm11dGF0aW9uIiwiZW52aXJvbm1lbnQiLCJyZXZpZXdJZCIsInJldmlld0JvZHkiLCJ2YXJpYWJsZXMiLCJpbnB1dCIsInB1bGxSZXF1ZXN0UmV2aWV3SWQiLCJib2R5Iiwib3B0aW1pc3RpY1Jlc3BvbnNlIiwidXBkYXRlUHVsbFJlcXVlc3RSZXZpZXciLCJwdWxsUmVxdWVzdFJldmlldyIsImlkIiwibGFzdEVkaXRlZEF0IiwidG9JU09TdHJpbmciLCJib2R5SFRNTCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25Db21wbGV0ZWQiLCJvbkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7QUFMQTtBQU9BLE1BQU1BLFFBQVE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxDQUFkOztlQWFlLENBQUNDLFdBQUQsRUFBYztBQUFDQyxFQUFBQSxRQUFEO0FBQVdDLEVBQUFBO0FBQVgsQ0FBZCxLQUF5QztBQUN0RCxRQUFNQyxTQUFTLEdBQUc7QUFDaEJDLElBQUFBLEtBQUssRUFBRTtBQUNMQyxNQUFBQSxtQkFBbUIsRUFBRUosUUFEaEI7QUFFTEssTUFBQUEsSUFBSSxFQUFFSjtBQUZEO0FBRFMsR0FBbEI7QUFPQSxRQUFNSyxrQkFBa0IsR0FBRztBQUN6QkMsSUFBQUEsdUJBQXVCLEVBQUU7QUFDdkJDLE1BQUFBLGlCQUFpQixFQUFFO0FBQ2pCQyxRQUFBQSxFQUFFLEVBQUVULFFBRGE7QUFFakJVLFFBQUFBLFlBQVksRUFBRSx1QkFBU0MsV0FBVCxFQUZHO0FBR2pCTixRQUFBQSxJQUFJLEVBQUVKLFVBSFc7QUFJakJXLFFBQUFBLFFBQVEsRUFBRSw2QkFBZVgsVUFBZjtBQUpPO0FBREk7QUFEQSxHQUEzQjtBQVdBLFNBQU8sSUFBSVksT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxvQ0FDRWhCLFdBREYsRUFFRTtBQUNFRCxNQUFBQSxRQURGO0FBRUVJLE1BQUFBLFNBRkY7QUFHRUksTUFBQUEsa0JBSEY7QUFJRVUsTUFBQUEsV0FBVyxFQUFFRixPQUpmO0FBS0VHLE1BQUFBLE9BQU8sRUFBRUY7QUFMWCxLQUZGO0FBVUQsR0FYTSxDQUFQO0FBWUQsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7Y29tbWl0TXV0YXRpb24sIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHtyZW5kZXJNYXJrZG93bn0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmNvbnN0IG11dGF0aW9uID0gZ3JhcGhxbGBcbiAgbXV0YXRpb24gdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24oJGlucHV0OiBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0lucHV0ISkge1xuICAgIHVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcbiAgICAgICAgaWRcbiAgICAgICAgbGFzdEVkaXRlZEF0XG4gICAgICAgIGJvZHlcbiAgICAgICAgYm9keUhUTUxcbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IChlbnZpcm9ubWVudCwge3Jldmlld0lkLCByZXZpZXdCb2R5fSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3SWQ6IHJldmlld0lkLFxuICAgICAgYm9keTogcmV2aWV3Qm9keSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IG9wdGltaXN0aWNSZXNwb25zZSA9IHtcbiAgICB1cGRhdGVQdWxsUmVxdWVzdFJldmlldzoge1xuICAgICAgcHVsbFJlcXVlc3RSZXZpZXc6IHtcbiAgICAgICAgaWQ6IHJldmlld0lkLFxuICAgICAgICBsYXN0RWRpdGVkQXQ6IG1vbWVudCgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGJvZHk6IHJldmlld0JvZHksXG4gICAgICAgIGJvZHlIVE1MOiByZW5kZXJNYXJrZG93bihyZXZpZXdCb2R5KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIG9wdGltaXN0aWNSZXNwb25zZSxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl19