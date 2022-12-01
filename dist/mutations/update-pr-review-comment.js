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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvdXBkYXRlLXByLXJldmlldy1jb21tZW50LmpzIl0sIm5hbWVzIjpbIm11dGF0aW9uIiwiZW52aXJvbm1lbnQiLCJjb21tZW50SWQiLCJjb21tZW50Qm9keSIsInZhcmlhYmxlcyIsImlucHV0IiwicHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SWQiLCJib2R5Iiwib3B0aW1pc3RpY1Jlc3BvbnNlIiwidXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50IiwicHVsbFJlcXVlc3RSZXZpZXdDb21tZW50IiwiaWQiLCJsYXN0RWRpdGVkQXQiLCJ0b0lTT1N0cmluZyIsImJvZHlIVE1MIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFFQTs7OztBQUxBO0FBT0EsTUFBTUEsUUFBUTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLENBQWQ7O2VBYWUsQ0FBQ0MsV0FBRCxFQUFjO0FBQUNDLEVBQUFBLFNBQUQ7QUFBWUMsRUFBQUE7QUFBWixDQUFkLEtBQTJDO0FBQ3hELFFBQU1DLFNBQVMsR0FBRztBQUNoQkMsSUFBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLDBCQUEwQixFQUFFSixTQUR2QjtBQUVMSyxNQUFBQSxJQUFJLEVBQUVKO0FBRkQ7QUFEUyxHQUFsQjtBQU9BLFFBQU1LLGtCQUFrQixHQUFHO0FBQ3pCQyxJQUFBQSw4QkFBOEIsRUFBRTtBQUM5QkMsTUFBQUEsd0JBQXdCLEVBQUU7QUFDeEJDLFFBQUFBLEVBQUUsRUFBRVQsU0FEb0I7QUFFeEJVLFFBQUFBLFlBQVksRUFBRSx1QkFBU0MsV0FBVCxFQUZVO0FBR3hCTixRQUFBQSxJQUFJLEVBQUVKLFdBSGtCO0FBSXhCVyxRQUFBQSxRQUFRLEVBQUUsNkJBQWVYLFdBQWY7QUFKYztBQURJO0FBRFAsR0FBM0I7QUFXQSxTQUFPLElBQUlZLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsb0NBQ0VoQixXQURGLEVBRUU7QUFDRUQsTUFBQUEsUUFERjtBQUVFSSxNQUFBQSxTQUZGO0FBR0VJLE1BQUFBLGtCQUhGO0FBSUVVLE1BQUFBLFdBQVcsRUFBRUYsT0FKZjtBQUtFRyxNQUFBQSxPQUFPLEVBQUVGO0FBTFgsS0FGRjtBQVVELEdBWE0sQ0FBUDtBQVlELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQge2NvbW1pdE11dGF0aW9uLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7cmVuZGVyTWFya2Rvd259IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uKCRpbnB1dDogVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SW5wdXQhKSB7XG4gICAgdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50KGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCB7XG4gICAgICAgIGlkXG4gICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICBib2R5XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHtjb21tZW50SWQsIGNvbW1lbnRCb2R5fSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElkOiBjb21tZW50SWQsXG4gICAgICBib2R5OiBjb21tZW50Qm9keSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IG9wdGltaXN0aWNSZXNwb25zZSA9IHtcbiAgICB1cGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnQ6IHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDoge1xuICAgICAgICBpZDogY29tbWVudElkLFxuICAgICAgICBsYXN0RWRpdGVkQXQ6IG1vbWVudCgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGJvZHk6IGNvbW1lbnRCb2R5LFxuICAgICAgICBib2R5SFRNTDogcmVuZGVyTWFya2Rvd24oY29tbWVudEJvZHkpLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3B0aW1pc3RpY1Jlc3BvbnNlLFxuICAgICAgICBvbkNvbXBsZXRlZDogcmVzb2x2ZSxcbiAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn07XG4iXX0=