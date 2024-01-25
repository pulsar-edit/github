"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactRelay = require("react-relay");
/* istanbul ignore file */

const mutation = function () {
  const node = require("./__generated__/resolveReviewThreadMutation.graphql");
  if (node.hash && node.hash !== "6947ef6710d494dc52fba1a5b532cd76") {
    console.error("The definition of 'resolveReviewThreadMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/resolveReviewThreadMutation.graphql");
};
var _default = (environment, {
  threadID,
  viewerID,
  viewerLogin
}) => {
  const variables = {
    input: {
      threadId: threadID
    }
  };
  const optimisticResponse = {
    resolveReviewThread: {
      thread: {
        id: threadID,
        isResolved: true,
        viewerCanResolve: false,
        viewerCanUnresolve: true,
        resolvedBy: {
          id: viewerID,
          login: viewerLogin || 'you'
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3RSZWxheSIsInJlcXVpcmUiLCJtdXRhdGlvbiIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIiwiX2RlZmF1bHQiLCJlbnZpcm9ubWVudCIsInRocmVhZElEIiwidmlld2VySUQiLCJ2aWV3ZXJMb2dpbiIsInZhcmlhYmxlcyIsImlucHV0IiwidGhyZWFkSWQiLCJvcHRpbWlzdGljUmVzcG9uc2UiLCJyZXNvbHZlUmV2aWV3VGhyZWFkIiwidGhyZWFkIiwiaWQiLCJpc1Jlc29sdmVkIiwidmlld2VyQ2FuUmVzb2x2ZSIsInZpZXdlckNhblVucmVzb2x2ZSIsInJlc29sdmVkQnkiLCJsb2dpbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tbWl0TXV0YXRpb24iLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiLCJleHBvcnRzIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbInJlc29sdmUtcmV2aWV3LXRocmVhZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQge1xuICBjb21taXRNdXRhdGlvbixcbiAgZ3JhcGhxbCxcbn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbigkaW5wdXQ6IFJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCEpIHtcbiAgICByZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHRocmVhZCB7XG4gICAgICAgIGlkXG4gICAgICAgIGlzUmVzb2x2ZWRcbiAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcbiAgICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgICAgaWRcbiAgICAgICAgICBsb2dpblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHt0aHJlYWRJRCwgdmlld2VySUQsIHZpZXdlckxvZ2lufSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIHRocmVhZElkOiB0aHJlYWRJRCxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IG9wdGltaXN0aWNSZXNwb25zZSA9IHtcbiAgICByZXNvbHZlUmV2aWV3VGhyZWFkOiB7XG4gICAgICB0aHJlYWQ6IHtcbiAgICAgICAgaWQ6IHRocmVhZElELFxuICAgICAgICBpc1Jlc29sdmVkOiB0cnVlLFxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlOiBmYWxzZSxcbiAgICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlOiB0cnVlLFxuICAgICAgICByZXNvbHZlZEJ5OiB7XG4gICAgICAgICAgaWQ6IHZpZXdlcklELFxuICAgICAgICAgIGxvZ2luOiB2aWV3ZXJMb2dpbiB8fCAneW91JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIG9wdGltaXN0aWNSZXNwb25zZSxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxJQUFBQSxXQUFBLEdBQUFDLE9BQUE7QUFGQTs7QUFPQSxNQUFNQyxRQUFRLFlBQUFBLENBQUE7RUFBQSxNQUFBQyxJQUFBLEdBQUFGLE9BQUE7RUFBQSxJQUFBRSxJQUFBLENBQUFDLElBQUEsSUFBQUQsSUFBQSxDQUFBQyxJQUFBO0lBQUFDLE9BQUEsQ0FBQUMsS0FBQTtFQUFBO0VBQUEsT0FBQUwsT0FBQTtBQUFBLENBZWI7QUFBQyxJQUFBTSxRQUFBLEdBRWFBLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxRQUFRO0VBQUVDLFFBQVE7RUFBRUM7QUFBVyxDQUFDLEtBQUs7RUFDakUsTUFBTUMsU0FBUyxHQUFHO0lBQ2hCQyxLQUFLLEVBQUU7TUFDTEMsUUFBUSxFQUFFTDtJQUNaO0VBQ0YsQ0FBQztFQUVELE1BQU1NLGtCQUFrQixHQUFHO0lBQ3pCQyxtQkFBbUIsRUFBRTtNQUNuQkMsTUFBTSxFQUFFO1FBQ05DLEVBQUUsRUFBRVQsUUFBUTtRQUNaVSxVQUFVLEVBQUUsSUFBSTtRQUNoQkMsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QkMsa0JBQWtCLEVBQUUsSUFBSTtRQUN4QkMsVUFBVSxFQUFFO1VBQ1ZKLEVBQUUsRUFBRVIsUUFBUTtVQUNaYSxLQUFLLEVBQUVaLFdBQVcsSUFBSTtRQUN4QjtNQUNGO0lBQ0Y7RUFDRixDQUFDO0VBRUQsT0FBTyxJQUFJYSxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWm5CLFdBQVcsRUFDWDtNQUNFTixRQUFRO01BQ1JVLFNBQVM7TUFDVEcsa0JBQWtCO01BQ2xCYSxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUNGLENBQUM7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUFJLE9BQUEsQ0FBQUMsT0FBQSxHQUFBeEIsUUFBQSJ9