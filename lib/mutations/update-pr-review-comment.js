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
  const node = require("./__generated__/updatePrReviewCommentMutation.graphql");
  if (node.hash && node.hash !== "d7b4e823f4604a2b193a1faceb3fcfca") {
    console.error("The definition of 'updatePrReviewCommentMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/updatePrReviewCommentMutation.graphql");
};
var _default = (environment, {
  commentId,
  commentBody
}) => {
  const variables = {
    input: {
      pullRequestReviewCommentId: commentId,
      body: commentBody
    }
  };
  const optimisticResponse = {
    updatePullRequestReviewComment: {
      pullRequestReviewComment: {
        id: commentId,
        lastEditedAt: (0, _moment.default)().toISOString(),
        body: commentBody,
        bodyHTML: (0, _helpers.renderMarkdown)(commentBody)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwiY29tbWVudElkIiwiY29tbWVudEJvZHkiLCJ2YXJpYWJsZXMiLCJpbnB1dCIsInB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElkIiwiYm9keSIsIm9wdGltaXN0aWNSZXNwb25zZSIsInVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCIsInB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCIsImlkIiwibGFzdEVkaXRlZEF0IiwibW9tZW50IiwidG9JU09TdHJpbmciLCJib2R5SFRNTCIsInJlbmRlck1hcmtkb3duIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb21taXRNdXRhdGlvbiIsIm9uQ29tcGxldGVkIiwib25FcnJvciJdLCJzb3VyY2VzIjpbInVwZGF0ZS1wci1yZXZpZXctY29tbWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQge2NvbW1pdE11dGF0aW9uLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7cmVuZGVyTWFya2Rvd259IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uKCRpbnB1dDogVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SW5wdXQhKSB7XG4gICAgdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50KGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCB7XG4gICAgICAgIGlkXG4gICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICBib2R5XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHtjb21tZW50SWQsIGNvbW1lbnRCb2R5fSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElkOiBjb21tZW50SWQsXG4gICAgICBib2R5OiBjb21tZW50Qm9keSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IG9wdGltaXN0aWNSZXNwb25zZSA9IHtcbiAgICB1cGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnQ6IHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDoge1xuICAgICAgICBpZDogY29tbWVudElkLFxuICAgICAgICBsYXN0RWRpdGVkQXQ6IG1vbWVudCgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGJvZHk6IGNvbW1lbnRCb2R5LFxuICAgICAgICBib2R5SFRNTDogcmVuZGVyTWFya2Rvd24oY29tbWVudEJvZHkpLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3B0aW1pc3RpY1Jlc3BvbnNlLFxuICAgICAgICBvbkNvbXBsZXRlZDogcmVzb2x2ZSxcbiAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFFQTtBQUEwQztBQUwxQzs7QUFPQSxNQUFNQSxRQUFRO0VBQUE7RUFBQTtJQUFBO0VBQUE7RUFBQTtBQUFBLENBV2I7QUFBQyxlQUVhLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxTQUFTO0VBQUVDO0FBQVcsQ0FBQyxLQUFLO0VBQ3hELE1BQU1DLFNBQVMsR0FBRztJQUNoQkMsS0FBSyxFQUFFO01BQ0xDLDBCQUEwQixFQUFFSixTQUFTO01BQ3JDSyxJQUFJLEVBQUVKO0lBQ1I7RUFDRixDQUFDO0VBRUQsTUFBTUssa0JBQWtCLEdBQUc7SUFDekJDLDhCQUE4QixFQUFFO01BQzlCQyx3QkFBd0IsRUFBRTtRQUN4QkMsRUFBRSxFQUFFVCxTQUFTO1FBQ2JVLFlBQVksRUFBRSxJQUFBQyxlQUFNLEdBQUUsQ0FBQ0MsV0FBVyxFQUFFO1FBQ3BDUCxJQUFJLEVBQUVKLFdBQVc7UUFDakJZLFFBQVEsRUFBRSxJQUFBQyx1QkFBYyxFQUFDYixXQUFXO01BQ3RDO0lBQ0Y7RUFDRixDQUFDO0VBRUQsT0FBTyxJQUFJYyxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWm5CLFdBQVcsRUFDWDtNQUNFRCxRQUFRO01BQ1JJLFNBQVM7TUFDVEksa0JBQWtCO01BQ2xCYSxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUFDLENBQ0Y7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUEifQ==