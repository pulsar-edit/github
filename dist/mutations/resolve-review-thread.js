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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvcmVzb2x2ZS1yZXZpZXctdGhyZWFkLmpzIl0sIm5hbWVzIjpbIm11dGF0aW9uIiwiZW52aXJvbm1lbnQiLCJ0aHJlYWRJRCIsInZpZXdlcklEIiwidmlld2VyTG9naW4iLCJ2YXJpYWJsZXMiLCJpbnB1dCIsInRocmVhZElkIiwib3B0aW1pc3RpY1Jlc3BvbnNlIiwicmVzb2x2ZVJldmlld1RocmVhZCIsInRocmVhZCIsImlkIiwiaXNSZXNvbHZlZCIsInZpZXdlckNhblJlc29sdmUiLCJ2aWV3ZXJDYW5VbnJlc29sdmUiLCJyZXNvbHZlZEJ5IiwibG9naW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uQ29tcGxldGVkIiwib25FcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUZBO0FBT0EsTUFBTUEsUUFBUTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLENBQWQ7O2VBaUJlLENBQUNDLFdBQUQsRUFBYztBQUFDQyxFQUFBQSxRQUFEO0FBQVdDLEVBQUFBLFFBQVg7QUFBcUJDLEVBQUFBO0FBQXJCLENBQWQsS0FBb0Q7QUFDakUsUUFBTUMsU0FBUyxHQUFHO0FBQ2hCQyxJQUFBQSxLQUFLLEVBQUU7QUFDTEMsTUFBQUEsUUFBUSxFQUFFTDtBQURMO0FBRFMsR0FBbEI7QUFNQSxRQUFNTSxrQkFBa0IsR0FBRztBQUN6QkMsSUFBQUEsbUJBQW1CLEVBQUU7QUFDbkJDLE1BQUFBLE1BQU0sRUFBRTtBQUNOQyxRQUFBQSxFQUFFLEVBQUVULFFBREU7QUFFTlUsUUFBQUEsVUFBVSxFQUFFLElBRk47QUFHTkMsUUFBQUEsZ0JBQWdCLEVBQUUsS0FIWjtBQUlOQyxRQUFBQSxrQkFBa0IsRUFBRSxJQUpkO0FBS05DLFFBQUFBLFVBQVUsRUFBRTtBQUNWSixVQUFBQSxFQUFFLEVBQUVSLFFBRE07QUFFVmEsVUFBQUEsS0FBSyxFQUFFWixXQUFXLElBQUk7QUFGWjtBQUxOO0FBRFc7QUFESSxHQUEzQjtBQWVBLFNBQU8sSUFBSWEsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxvQ0FDRWxCLFdBREYsRUFFRTtBQUNFRCxNQUFBQSxRQURGO0FBRUVLLE1BQUFBLFNBRkY7QUFHRUcsTUFBQUEsa0JBSEY7QUFJRVksTUFBQUEsV0FBVyxFQUFFRixPQUpmO0FBS0VHLE1BQUFBLE9BQU8sRUFBRUY7QUFMWCxLQUZGO0FBVUQsR0FYTSxDQUFQO0FBWUQsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7XG4gIGNvbW1pdE11dGF0aW9uLFxuICBncmFwaHFsLFxufSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmNvbnN0IG11dGF0aW9uID0gZ3JhcGhxbGBcbiAgbXV0YXRpb24gcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKCRpbnB1dDogUmVzb2x2ZVJldmlld1RocmVhZElucHV0ISkge1xuICAgIHJlc29sdmVSZXZpZXdUaHJlYWQoaW5wdXQ6ICRpbnB1dCkge1xuICAgICAgdGhyZWFkIHtcbiAgICAgICAgaWRcbiAgICAgICAgaXNSZXNvbHZlZFxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlXG4gICAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxuICAgICAgICByZXNvbHZlZEJ5IHtcbiAgICAgICAgICBpZFxuICAgICAgICAgIGxvZ2luXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IChlbnZpcm9ubWVudCwge3RocmVhZElELCB2aWV3ZXJJRCwgdmlld2VyTG9naW59KSA9PiB7XG4gIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICBpbnB1dDoge1xuICAgICAgdGhyZWFkSWQ6IHRocmVhZElELFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgb3B0aW1pc3RpY1Jlc3BvbnNlID0ge1xuICAgIHJlc29sdmVSZXZpZXdUaHJlYWQ6IHtcbiAgICAgIHRocmVhZDoge1xuICAgICAgICBpZDogdGhyZWFkSUQsXG4gICAgICAgIGlzUmVzb2x2ZWQ6IHRydWUsXG4gICAgICAgIHZpZXdlckNhblJlc29sdmU6IGZhbHNlLFxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmU6IHRydWUsXG4gICAgICAgIHJlc29sdmVkQnk6IHtcbiAgICAgICAgICBpZDogdmlld2VySUQsXG4gICAgICAgICAgbG9naW46IHZpZXdlckxvZ2luIHx8ICd5b3UnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb3B0aW1pc3RpY1Jlc3BvbnNlLFxuICAgICAgICBvbkNvbXBsZXRlZDogcmVzb2x2ZSxcbiAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn07XG4iXX0=