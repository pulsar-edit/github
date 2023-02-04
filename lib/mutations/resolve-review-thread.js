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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwidGhyZWFkSUQiLCJ2aWV3ZXJJRCIsInZpZXdlckxvZ2luIiwidmFyaWFibGVzIiwiaW5wdXQiLCJ0aHJlYWRJZCIsIm9wdGltaXN0aWNSZXNwb25zZSIsInJlc29sdmVSZXZpZXdUaHJlYWQiLCJ0aHJlYWQiLCJpZCIsImlzUmVzb2x2ZWQiLCJ2aWV3ZXJDYW5SZXNvbHZlIiwidmlld2VyQ2FuVW5yZXNvbHZlIiwicmVzb2x2ZWRCeSIsImxvZ2luIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb21taXRNdXRhdGlvbiIsIm9uQ29tcGxldGVkIiwib25FcnJvciJdLCJzb3VyY2VzIjpbInJlc29sdmUtcmV2aWV3LXRocmVhZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQge1xuICBjb21taXRNdXRhdGlvbixcbiAgZ3JhcGhxbCxcbn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbigkaW5wdXQ6IFJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCEpIHtcbiAgICByZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHRocmVhZCB7XG4gICAgICAgIGlkXG4gICAgICAgIGlzUmVzb2x2ZWRcbiAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcbiAgICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgICAgaWRcbiAgICAgICAgICBsb2dpblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHt0aHJlYWRJRCwgdmlld2VySUQsIHZpZXdlckxvZ2lufSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIHRocmVhZElkOiB0aHJlYWRJRCxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IG9wdGltaXN0aWNSZXNwb25zZSA9IHtcbiAgICByZXNvbHZlUmV2aWV3VGhyZWFkOiB7XG4gICAgICB0aHJlYWQ6IHtcbiAgICAgICAgaWQ6IHRocmVhZElELFxuICAgICAgICBpc1Jlc29sdmVkOiB0cnVlLFxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlOiBmYWxzZSxcbiAgICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlOiB0cnVlLFxuICAgICAgICByZXNvbHZlZEJ5OiB7XG4gICAgICAgICAgaWQ6IHZpZXdlcklELFxuICAgICAgICAgIGxvZ2luOiB2aWV3ZXJMb2dpbiB8fCAneW91JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIG9wdGltaXN0aWNSZXNwb25zZSxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTtBQUZBOztBQU9BLE1BQU1BLFFBQVE7RUFBQTtFQUFBO0lBQUE7RUFBQTtFQUFBO0FBQUEsQ0FlYjtBQUFDLGVBRWEsQ0FBQ0MsV0FBVyxFQUFFO0VBQUNDLFFBQVE7RUFBRUMsUUFBUTtFQUFFQztBQUFXLENBQUMsS0FBSztFQUNqRSxNQUFNQyxTQUFTLEdBQUc7SUFDaEJDLEtBQUssRUFBRTtNQUNMQyxRQUFRLEVBQUVMO0lBQ1o7RUFDRixDQUFDO0VBRUQsTUFBTU0sa0JBQWtCLEdBQUc7SUFDekJDLG1CQUFtQixFQUFFO01BQ25CQyxNQUFNLEVBQUU7UUFDTkMsRUFBRSxFQUFFVCxRQUFRO1FBQ1pVLFVBQVUsRUFBRSxJQUFJO1FBQ2hCQyxnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCQyxrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCQyxVQUFVLEVBQUU7VUFDVkosRUFBRSxFQUFFUixRQUFRO1VBQ1phLEtBQUssRUFBRVosV0FBVyxJQUFJO1FBQ3hCO01BQ0Y7SUFDRjtFQUNGLENBQUM7RUFFRCxPQUFPLElBQUlhLE9BQU8sQ0FBQyxDQUFDQyxPQUFPLEVBQUVDLE1BQU0sS0FBSztJQUN0QyxJQUFBQywwQkFBYyxFQUNabkIsV0FBVyxFQUNYO01BQ0VELFFBQVE7TUFDUkssU0FBUztNQUNURyxrQkFBa0I7TUFDbEJhLFdBQVcsRUFBRUgsT0FBTztNQUNwQkksT0FBTyxFQUFFSDtJQUNYLENBQUMsQ0FDRjtFQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFBQSJ9