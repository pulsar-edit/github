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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvdW5yZXNvbHZlLXJldmlldy10aHJlYWQuanMiXSwibmFtZXMiOlsibXV0YXRpb24iLCJlbnZpcm9ubWVudCIsInRocmVhZElEIiwidmlld2VySUQiLCJ2aWV3ZXJMb2dpbiIsInZhcmlhYmxlcyIsImlucHV0IiwidGhyZWFkSWQiLCJvcHRpbWlzdGljUmVzcG9uc2UiLCJ1bnJlc29sdmVSZXZpZXdUaHJlYWQiLCJ0aHJlYWQiLCJpZCIsImlzUmVzb2x2ZWQiLCJ2aWV3ZXJDYW5SZXNvbHZlIiwidmlld2VyQ2FuVW5yZXNvbHZlIiwicmVzb2x2ZWRCeSIsImxvZ2luIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFGQTtBQUlBLE1BQU1BLFFBQVE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxDQUFkOztlQWlCZSxDQUFDQyxXQUFELEVBQWM7QUFBQ0MsRUFBQUEsUUFBRDtBQUFXQyxFQUFBQSxRQUFYO0FBQXFCQyxFQUFBQTtBQUFyQixDQUFkLEtBQW9EO0FBQ2pFLFFBQU1DLFNBQVMsR0FBRztBQUNoQkMsSUFBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLFFBQVEsRUFBRUw7QUFETDtBQURTLEdBQWxCO0FBTUEsUUFBTU0sa0JBQWtCLEdBQUc7QUFDekJDLElBQUFBLHFCQUFxQixFQUFFO0FBQ3JCQyxNQUFBQSxNQUFNLEVBQUU7QUFDTkMsUUFBQUEsRUFBRSxFQUFFVCxRQURFO0FBRU5VLFFBQUFBLFVBQVUsRUFBRSxLQUZOO0FBR05DLFFBQUFBLGdCQUFnQixFQUFFLElBSFo7QUFJTkMsUUFBQUEsa0JBQWtCLEVBQUUsS0FKZDtBQUtOQyxRQUFBQSxVQUFVLEVBQUU7QUFDVkosVUFBQUEsRUFBRSxFQUFFUixRQURNO0FBRVZhLFVBQUFBLEtBQUssRUFBRVosV0FBVyxJQUFJO0FBRlo7QUFMTjtBQURhO0FBREUsR0FBM0I7QUFlQSxTQUFPLElBQUlhLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsb0NBQ0VsQixXQURGLEVBRUU7QUFDRUQsTUFBQUEsUUFERjtBQUVFSyxNQUFBQSxTQUZGO0FBR0VHLE1BQUFBLGtCQUhGO0FBSUVZLE1BQUFBLFdBQVcsRUFBRUYsT0FKZjtBQUtFRyxNQUFBQSxPQUFPLEVBQUVGO0FBTFgsS0FGRjtBQVVELEdBWE0sQ0FBUDtBQVlELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG5pbXBvcnQge2NvbW1pdE11dGF0aW9uLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmNvbnN0IG11dGF0aW9uID0gZ3JhcGhxbGBcbiAgbXV0YXRpb24gdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24oJGlucHV0OiBVbnJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCEpIHtcbiAgICB1bnJlc29sdmVSZXZpZXdUaHJlYWQoaW5wdXQ6ICRpbnB1dCkge1xuICAgICAgdGhyZWFkIHtcbiAgICAgICAgaWRcbiAgICAgICAgaXNSZXNvbHZlZFxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlXG4gICAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxuICAgICAgICByZXNvbHZlZEJ5IHtcbiAgICAgICAgICBpZFxuICAgICAgICAgIGxvZ2luXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IChlbnZpcm9ubWVudCwge3RocmVhZElELCB2aWV3ZXJJRCwgdmlld2VyTG9naW59KSA9PiB7XG4gIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICBpbnB1dDoge1xuICAgICAgdGhyZWFkSWQ6IHRocmVhZElELFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgb3B0aW1pc3RpY1Jlc3BvbnNlID0ge1xuICAgIHVucmVzb2x2ZVJldmlld1RocmVhZDoge1xuICAgICAgdGhyZWFkOiB7XG4gICAgICAgIGlkOiB0aHJlYWRJRCxcbiAgICAgICAgaXNSZXNvbHZlZDogZmFsc2UsXG4gICAgICAgIHZpZXdlckNhblJlc29sdmU6IHRydWUsXG4gICAgICAgIHZpZXdlckNhblVucmVzb2x2ZTogZmFsc2UsXG4gICAgICAgIHJlc29sdmVkQnk6IHtcbiAgICAgICAgICBpZDogdmlld2VySUQsXG4gICAgICAgICAgbG9naW46IHZpZXdlckxvZ2luIHx8ICd5b3UnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3B0aW1pc3RpY1Jlc3BvbnNlLFxuICAgICAgICBvbkNvbXBsZXRlZDogcmVzb2x2ZSxcbiAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn07XG4iXX0=