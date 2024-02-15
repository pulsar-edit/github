"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactRelay = require("react-relay");
/* istanbul ignore file */

const mutation = function () {
  const node = require("./__generated__/unresolveReviewThreadMutation.graphql");
  if (node.hash && node.hash !== "8b1105e1a3db0455c522c7e5dc69b436") {
    console.error("The definition of 'unresolveReviewThreadMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/unresolveReviewThreadMutation.graphql");
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
    unresolveReviewThread: {
      thread: {
        id: threadID,
        isResolved: false,
        viewerCanResolve: true,
        viewerCanUnresolve: false,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3RSZWxheSIsInJlcXVpcmUiLCJtdXRhdGlvbiIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIiwiX2RlZmF1bHQiLCJlbnZpcm9ubWVudCIsInRocmVhZElEIiwidmlld2VySUQiLCJ2aWV3ZXJMb2dpbiIsInZhcmlhYmxlcyIsImlucHV0IiwidGhyZWFkSWQiLCJvcHRpbWlzdGljUmVzcG9uc2UiLCJ1bnJlc29sdmVSZXZpZXdUaHJlYWQiLCJ0aHJlYWQiLCJpZCIsImlzUmVzb2x2ZWQiLCJ2aWV3ZXJDYW5SZXNvbHZlIiwidmlld2VyQ2FuVW5yZXNvbHZlIiwicmVzb2x2ZWRCeSIsImxvZ2luIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb21taXRNdXRhdGlvbiIsIm9uQ29tcGxldGVkIiwib25FcnJvciIsImV4cG9ydHMiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsidW5yZXNvbHZlLXJldmlldy10aHJlYWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IHtjb21taXRNdXRhdGlvbiwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIHVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKCRpbnB1dDogVW5yZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXQhKSB7XG4gICAgdW5yZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHRocmVhZCB7XG4gICAgICAgIGlkXG4gICAgICAgIGlzUmVzb2x2ZWRcbiAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcbiAgICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgICAgaWRcbiAgICAgICAgICBsb2dpblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHt0aHJlYWRJRCwgdmlld2VySUQsIHZpZXdlckxvZ2lufSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIHRocmVhZElkOiB0aHJlYWRJRCxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IG9wdGltaXN0aWNSZXNwb25zZSA9IHtcbiAgICB1bnJlc29sdmVSZXZpZXdUaHJlYWQ6IHtcbiAgICAgIHRocmVhZDoge1xuICAgICAgICBpZDogdGhyZWFkSUQsXG4gICAgICAgIGlzUmVzb2x2ZWQ6IGZhbHNlLFxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlOiB0cnVlLFxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmU6IGZhbHNlLFxuICAgICAgICByZXNvbHZlZEJ5OiB7XG4gICAgICAgICAgaWQ6IHZpZXdlcklELFxuICAgICAgICAgIGxvZ2luOiB2aWV3ZXJMb2dpbiB8fCAneW91JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIG9wdGltaXN0aWNSZXNwb25zZSxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxJQUFBQSxXQUFBLEdBQUFDLE9BQUE7QUFGQTs7QUFJQSxNQUFNQyxRQUFRLFlBQUFBLENBQUE7RUFBQSxNQUFBQyxJQUFBLEdBQUFGLE9BQUE7RUFBQSxJQUFBRSxJQUFBLENBQUFDLElBQUEsSUFBQUQsSUFBQSxDQUFBQyxJQUFBO0lBQUFDLE9BQUEsQ0FBQUMsS0FBQTtFQUFBO0VBQUEsT0FBQUwsT0FBQTtBQUFBLENBZWI7QUFBQyxJQUFBTSxRQUFBLEdBRWFBLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxRQUFRO0VBQUVDLFFBQVE7RUFBRUM7QUFBVyxDQUFDLEtBQUs7RUFDakUsTUFBTUMsU0FBUyxHQUFHO0lBQ2hCQyxLQUFLLEVBQUU7TUFDTEMsUUFBUSxFQUFFTDtJQUNaO0VBQ0YsQ0FBQztFQUVELE1BQU1NLGtCQUFrQixHQUFHO0lBQ3pCQyxxQkFBcUIsRUFBRTtNQUNyQkMsTUFBTSxFQUFFO1FBQ05DLEVBQUUsRUFBRVQsUUFBUTtRQUNaVSxVQUFVLEVBQUUsS0FBSztRQUNqQkMsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QkMsa0JBQWtCLEVBQUUsS0FBSztRQUN6QkMsVUFBVSxFQUFFO1VBQ1ZKLEVBQUUsRUFBRVIsUUFBUTtVQUNaYSxLQUFLLEVBQUVaLFdBQVcsSUFBSTtRQUN4QjtNQUNGO0lBQ0Y7RUFDRixDQUFDO0VBRUQsT0FBTyxJQUFJYSxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWm5CLFdBQVcsRUFDWDtNQUNFTixRQUFRO01BQ1JVLFNBQVM7TUFDVEcsa0JBQWtCO01BQ2xCYSxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUNGLENBQUM7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUFJLE9BQUEsQ0FBQUMsT0FBQSxHQUFBeEIsUUFBQSJ9