"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/deletePrReviewMutation.graphql");

  if (node.hash && node.hash !== "768b81334e225cb5d15c0508d2bd4b1f") {
    console.error("The definition of 'deletePrReviewMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/deletePrReviewMutation.graphql");
};

var _default = (environment, {
  reviewID,
  pullRequestID
}) => {
  const variables = {
    input: {
      pullRequestReviewId: reviewID
    }
  };
  const configs = [{
    type: 'NODE_DELETE',
    deletedIDFieldName: 'id'
  }, {
    type: 'RANGE_DELETE',
    parentID: pullRequestID,
    connectionKeys: [{
      key: 'ReviewSummariesAccumulator_reviews'
    }],
    pathToConnection: ['pullRequest', 'reviews'],
    deletedIDFieldName: 'id'
  }];
  return new Promise((resolve, reject) => {
    (0, _reactRelay.commitMutation)(environment, {
      mutation,
      variables,
      configs,
      onCompleted: resolve,
      onError: reject
    });
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvZGVsZXRlLXByLXJldmlldy5qcyJdLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwicmV2aWV3SUQiLCJwdWxsUmVxdWVzdElEIiwidmFyaWFibGVzIiwiaW5wdXQiLCJwdWxsUmVxdWVzdFJldmlld0lkIiwiY29uZmlncyIsInR5cGUiLCJkZWxldGVkSURGaWVsZE5hbWUiLCJwYXJlbnRJRCIsImNvbm5lY3Rpb25LZXlzIiwia2V5IiwicGF0aFRvQ29ubmVjdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25Db21wbGV0ZWQiLCJvbkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBRkE7QUFJQSxNQUFNQSxRQUFRO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsQ0FBZDs7ZUFVZSxDQUFDQyxXQUFELEVBQWM7QUFBQ0MsRUFBQUEsUUFBRDtBQUFXQyxFQUFBQTtBQUFYLENBQWQsS0FBNEM7QUFDekQsUUFBTUMsU0FBUyxHQUFHO0FBQ2hCQyxJQUFBQSxLQUFLLEVBQUU7QUFBQ0MsTUFBQUEsbUJBQW1CLEVBQUVKO0FBQXRCO0FBRFMsR0FBbEI7QUFJQSxRQUFNSyxPQUFPLEdBQUcsQ0FDZDtBQUNFQyxJQUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUZ0QixHQURjLEVBS2Q7QUFDRUQsSUFBQUEsSUFBSSxFQUFFLGNBRFI7QUFFRUUsSUFBQUEsUUFBUSxFQUFFUCxhQUZaO0FBR0VRLElBQUFBLGNBQWMsRUFBRSxDQUFDO0FBQUNDLE1BQUFBLEdBQUcsRUFBRTtBQUFOLEtBQUQsQ0FIbEI7QUFJRUMsSUFBQUEsZ0JBQWdCLEVBQUUsQ0FBQyxhQUFELEVBQWdCLFNBQWhCLENBSnBCO0FBS0VKLElBQUFBLGtCQUFrQixFQUFFO0FBTHRCLEdBTGMsQ0FBaEI7QUFjQSxTQUFPLElBQUlLLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsb0NBQ0VmLFdBREYsRUFFRTtBQUNFRCxNQUFBQSxRQURGO0FBRUVJLE1BQUFBLFNBRkY7QUFHRUcsTUFBQUEsT0FIRjtBQUlFVSxNQUFBQSxXQUFXLEVBQUVGLE9BSmY7QUFLRUcsTUFBQUEsT0FBTyxFQUFFRjtBQUxYLEtBRkY7QUFVRCxHQVhNLENBQVA7QUFZRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IHtjb21taXRNdXRhdGlvbiwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIGRlbGV0ZVByUmV2aWV3TXV0YXRpb24oJGlucHV0OiBEZWxldGVQdWxsUmVxdWVzdFJldmlld0lucHV0ISkge1xuICAgIGRlbGV0ZVB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IChlbnZpcm9ubWVudCwge3Jldmlld0lELCBwdWxsUmVxdWVzdElEfSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtwdWxsUmVxdWVzdFJldmlld0lkOiByZXZpZXdJRH0sXG4gIH07XG5cbiAgY29uc3QgY29uZmlncyA9IFtcbiAgICB7XG4gICAgICB0eXBlOiAnTk9ERV9ERUxFVEUnLFxuICAgICAgZGVsZXRlZElERmllbGROYW1lOiAnaWQnLFxuICAgIH0sXG4gICAge1xuICAgICAgdHlwZTogJ1JBTkdFX0RFTEVURScsXG4gICAgICBwYXJlbnRJRDogcHVsbFJlcXVlc3RJRCxcbiAgICAgIGNvbm5lY3Rpb25LZXlzOiBbe2tleTogJ1Jldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3Jldmlld3MnfV0sXG4gICAgICBwYXRoVG9Db25uZWN0aW9uOiBbJ3B1bGxSZXF1ZXN0JywgJ3Jldmlld3MnXSxcbiAgICAgIGRlbGV0ZWRJREZpZWxkTmFtZTogJ2lkJyxcbiAgICB9LFxuICBdO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgY29uZmlncyxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl19