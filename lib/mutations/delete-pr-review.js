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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwicmV2aWV3SUQiLCJwdWxsUmVxdWVzdElEIiwidmFyaWFibGVzIiwiaW5wdXQiLCJwdWxsUmVxdWVzdFJldmlld0lkIiwiY29uZmlncyIsInR5cGUiLCJkZWxldGVkSURGaWVsZE5hbWUiLCJwYXJlbnRJRCIsImNvbm5lY3Rpb25LZXlzIiwia2V5IiwicGF0aFRvQ29ubmVjdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tbWl0TXV0YXRpb24iLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiXSwic291cmNlcyI6WyJkZWxldGUtcHItcmV2aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7Y29tbWl0TXV0YXRpb24sIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuY29uc3QgbXV0YXRpb24gPSBncmFwaHFsYFxuICBtdXRhdGlvbiBkZWxldGVQclJldmlld011dGF0aW9uKCRpbnB1dDogRGVsZXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCEpIHtcbiAgICBkZWxldGVQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XG4gICAgICBwdWxsUmVxdWVzdFJldmlldyB7XG4gICAgICAgIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHtyZXZpZXdJRCwgcHVsbFJlcXVlc3RJRH0pID0+IHtcbiAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgIGlucHV0OiB7cHVsbFJlcXVlc3RSZXZpZXdJZDogcmV2aWV3SUR9LFxuICB9O1xuXG4gIGNvbnN0IGNvbmZpZ3MgPSBbXG4gICAge1xuICAgICAgdHlwZTogJ05PREVfREVMRVRFJyxcbiAgICAgIGRlbGV0ZWRJREZpZWxkTmFtZTogJ2lkJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdSQU5HRV9ERUxFVEUnLFxuICAgICAgcGFyZW50SUQ6IHB1bGxSZXF1ZXN0SUQsXG4gICAgICBjb25uZWN0aW9uS2V5czogW3trZXk6ICdSZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9yZXZpZXdzJ31dLFxuICAgICAgcGF0aFRvQ29ubmVjdGlvbjogWydwdWxsUmVxdWVzdCcsICdyZXZpZXdzJ10sXG4gICAgICBkZWxldGVkSURGaWVsZE5hbWU6ICdpZCcsXG4gICAgfSxcbiAgXTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIGNvbmZpZ3MsXG4gICAgICAgIG9uQ29tcGxldGVkOiByZXNvbHZlLFxuICAgICAgICBvbkVycm9yOiByZWplY3QsXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7QUFGQTs7QUFJQSxNQUFNQSxRQUFRO0VBQUE7RUFBQTtJQUFBO0VBQUE7RUFBQTtBQUFBLENBUWI7QUFBQyxlQUVhLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxRQUFRO0VBQUVDO0FBQWEsQ0FBQyxLQUFLO0VBQ3pELE1BQU1DLFNBQVMsR0FBRztJQUNoQkMsS0FBSyxFQUFFO01BQUNDLG1CQUFtQixFQUFFSjtJQUFRO0VBQ3ZDLENBQUM7RUFFRCxNQUFNSyxPQUFPLEdBQUcsQ0FDZDtJQUNFQyxJQUFJLEVBQUUsYUFBYTtJQUNuQkMsa0JBQWtCLEVBQUU7RUFDdEIsQ0FBQyxFQUNEO0lBQ0VELElBQUksRUFBRSxjQUFjO0lBQ3BCRSxRQUFRLEVBQUVQLGFBQWE7SUFDdkJRLGNBQWMsRUFBRSxDQUFDO01BQUNDLEdBQUcsRUFBRTtJQUFvQyxDQUFDLENBQUM7SUFDN0RDLGdCQUFnQixFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQztJQUM1Q0osa0JBQWtCLEVBQUU7RUFDdEIsQ0FBQyxDQUNGO0VBRUQsT0FBTyxJQUFJSyxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWmhCLFdBQVcsRUFDWDtNQUNFRCxRQUFRO01BQ1JJLFNBQVM7TUFDVEcsT0FBTztNQUNQVyxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUFDLENBQ0Y7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUEifQ==