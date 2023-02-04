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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwicmV2aWV3SWQiLCJyZXZpZXdCb2R5IiwidmFyaWFibGVzIiwiaW5wdXQiLCJwdWxsUmVxdWVzdFJldmlld0lkIiwiYm9keSIsIm9wdGltaXN0aWNSZXNwb25zZSIsInVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3IiwicHVsbFJlcXVlc3RSZXZpZXciLCJpZCIsImxhc3RFZGl0ZWRBdCIsIm1vbWVudCIsInRvSVNPU3RyaW5nIiwiYm9keUhUTUwiLCJyZW5kZXJNYXJrZG93biIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tbWl0TXV0YXRpb24iLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiXSwic291cmNlcyI6WyJ1cGRhdGUtcHItcmV2aWV3LXN1bW1hcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IHtjb21taXRNdXRhdGlvbiwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQge3JlbmRlck1hcmtkb3dufSBmcm9tICcuLi9oZWxwZXJzJztcblxuY29uc3QgbXV0YXRpb24gPSBncmFwaHFsYFxuICBtdXRhdGlvbiB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbigkaW5wdXQ6IFVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhKSB7XG4gICAgdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXcoaW5wdXQ6ICRpbnB1dCkge1xuICAgICAgcHVsbFJlcXVlc3RSZXZpZXcge1xuICAgICAgICBpZFxuICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgYm9keVxuICAgICAgICBib2R5SFRNTFxuICAgICAgfVxuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgKGVudmlyb25tZW50LCB7cmV2aWV3SWQsIHJldmlld0JvZHl9KSA9PiB7XG4gIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICBpbnB1dDoge1xuICAgICAgcHVsbFJlcXVlc3RSZXZpZXdJZDogcmV2aWV3SWQsXG4gICAgICBib2R5OiByZXZpZXdCb2R5LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgb3B0aW1pc3RpY1Jlc3BvbnNlID0ge1xuICAgIHVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3OiB7XG4gICAgICBwdWxsUmVxdWVzdFJldmlldzoge1xuICAgICAgICBpZDogcmV2aWV3SWQsXG4gICAgICAgIGxhc3RFZGl0ZWRBdDogbW9tZW50KCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgYm9keTogcmV2aWV3Qm9keSxcbiAgICAgICAgYm9keUhUTUw6IHJlbmRlck1hcmtkb3duKHJldmlld0JvZHkpLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3B0aW1pc3RpY1Jlc3BvbnNlLFxuICAgICAgICBvbkNvbXBsZXRlZDogcmVzb2x2ZSxcbiAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFFQTtBQUEwQztBQUwxQzs7QUFPQSxNQUFNQSxRQUFRO0VBQUE7RUFBQTtJQUFBO0VBQUE7RUFBQTtBQUFBLENBV2I7QUFBQyxlQUVhLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxRQUFRO0VBQUVDO0FBQVUsQ0FBQyxLQUFLO0VBQ3RELE1BQU1DLFNBQVMsR0FBRztJQUNoQkMsS0FBSyxFQUFFO01BQ0xDLG1CQUFtQixFQUFFSixRQUFRO01BQzdCSyxJQUFJLEVBQUVKO0lBQ1I7RUFDRixDQUFDO0VBRUQsTUFBTUssa0JBQWtCLEdBQUc7SUFDekJDLHVCQUF1QixFQUFFO01BQ3ZCQyxpQkFBaUIsRUFBRTtRQUNqQkMsRUFBRSxFQUFFVCxRQUFRO1FBQ1pVLFlBQVksRUFBRSxJQUFBQyxlQUFNLEdBQUUsQ0FBQ0MsV0FBVyxFQUFFO1FBQ3BDUCxJQUFJLEVBQUVKLFVBQVU7UUFDaEJZLFFBQVEsRUFBRSxJQUFBQyx1QkFBYyxFQUFDYixVQUFVO01BQ3JDO0lBQ0Y7RUFDRixDQUFDO0VBRUQsT0FBTyxJQUFJYyxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWm5CLFdBQVcsRUFDWDtNQUNFRCxRQUFRO01BQ1JJLFNBQVM7TUFDVEksa0JBQWtCO01BQ2xCYSxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUFDLENBQ0Y7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUEifQ==