"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactRelay = require("react-relay");
/* istanbul ignore file */

const mutation = function () {
  const node = require("./__generated__/submitPrReviewMutation.graphql");
  if (node.hash && node.hash !== "c52752b3b2cde11e6c86d574ffa967a0") {
    console.error("The definition of 'submitPrReviewMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/submitPrReviewMutation.graphql");
};
var _default = (environment, {
  reviewID,
  event
}) => {
  const variables = {
    input: {
      event,
      pullRequestReviewId: reviewID
    }
  };
  return new Promise((resolve, reject) => {
    (0, _reactRelay.commitMutation)(environment, {
      mutation,
      variables,
      onCompleted: resolve,
      onError: reject
    });
  });
};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3RSZWxheSIsInJlcXVpcmUiLCJtdXRhdGlvbiIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIiwiX2RlZmF1bHQiLCJlbnZpcm9ubWVudCIsInJldmlld0lEIiwiZXZlbnQiLCJ2YXJpYWJsZXMiLCJpbnB1dCIsInB1bGxSZXF1ZXN0UmV2aWV3SWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbW1pdE11dGF0aW9uIiwib25Db21wbGV0ZWQiLCJvbkVycm9yIiwiZXhwb3J0cyIsImRlZmF1bHQiXSwic291cmNlcyI6WyJzdWJtaXQtcHItcmV2aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7Y29tbWl0TXV0YXRpb24sIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuY29uc3QgbXV0YXRpb24gPSBncmFwaHFsYFxuICBtdXRhdGlvbiBzdWJtaXRQclJldmlld011dGF0aW9uKCRpbnB1dDogU3VibWl0UHVsbFJlcXVlc3RSZXZpZXdJbnB1dCEpIHtcbiAgICBzdWJtaXRQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XG4gICAgICBwdWxsUmVxdWVzdFJldmlldyB7XG4gICAgICAgIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHtyZXZpZXdJRCwgZXZlbnR9KSA9PiB7XG4gIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICBpbnB1dDoge1xuICAgICAgZXZlbnQsXG4gICAgICBwdWxsUmVxdWVzdFJldmlld0lkOiByZXZpZXdJRCxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxJQUFBQSxXQUFBLEdBQUFDLE9BQUE7QUFGQTs7QUFJQSxNQUFNQyxRQUFRLFlBQUFBLENBQUE7RUFBQSxNQUFBQyxJQUFBLEdBQUFGLE9BQUE7RUFBQSxJQUFBRSxJQUFBLENBQUFDLElBQUEsSUFBQUQsSUFBQSxDQUFBQyxJQUFBO0lBQUFDLE9BQUEsQ0FBQUMsS0FBQTtFQUFBO0VBQUEsT0FBQUwsT0FBQTtBQUFBLENBUWI7QUFBQyxJQUFBTSxRQUFBLEdBRWFBLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxRQUFRO0VBQUVDO0FBQUssQ0FBQyxLQUFLO0VBQ2pELE1BQU1DLFNBQVMsR0FBRztJQUNoQkMsS0FBSyxFQUFFO01BQ0xGLEtBQUs7TUFDTEcsbUJBQW1CLEVBQUVKO0lBQ3ZCO0VBQ0YsQ0FBQztFQUVELE9BQU8sSUFBSUssT0FBTyxDQUFDLENBQUNDLE9BQU8sRUFBRUMsTUFBTSxLQUFLO0lBQ3RDLElBQUFDLDBCQUFjLEVBQ1pULFdBQVcsRUFDWDtNQUNFTixRQUFRO01BQ1JTLFNBQVM7TUFDVE8sV0FBVyxFQUFFSCxPQUFPO01BQ3BCSSxPQUFPLEVBQUVIO0lBQ1gsQ0FDRixDQUFDO0VBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUFBSSxPQUFBLENBQUFDLE9BQUEsR0FBQWQsUUFBQSJ9