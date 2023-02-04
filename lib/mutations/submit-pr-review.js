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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwicmV2aWV3SUQiLCJldmVudCIsInZhcmlhYmxlcyIsImlucHV0IiwicHVsbFJlcXVlc3RSZXZpZXdJZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tbWl0TXV0YXRpb24iLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiXSwic291cmNlcyI6WyJzdWJtaXQtcHItcmV2aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7Y29tbWl0TXV0YXRpb24sIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuY29uc3QgbXV0YXRpb24gPSBncmFwaHFsYFxuICBtdXRhdGlvbiBzdWJtaXRQclJldmlld011dGF0aW9uKCRpbnB1dDogU3VibWl0UHVsbFJlcXVlc3RSZXZpZXdJbnB1dCEpIHtcbiAgICBzdWJtaXRQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XG4gICAgICBwdWxsUmVxdWVzdFJldmlldyB7XG4gICAgICAgIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHtyZXZpZXdJRCwgZXZlbnR9KSA9PiB7XG4gIGNvbnN0IHZhcmlhYmxlcyA9IHtcbiAgICBpbnB1dDoge1xuICAgICAgZXZlbnQsXG4gICAgICBwdWxsUmVxdWVzdFJldmlld0lkOiByZXZpZXdJRCxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTtBQUZBOztBQUlBLE1BQU1BLFFBQVE7RUFBQTtFQUFBO0lBQUE7RUFBQTtFQUFBO0FBQUEsQ0FRYjtBQUFDLGVBRWEsQ0FBQ0MsV0FBVyxFQUFFO0VBQUNDLFFBQVE7RUFBRUM7QUFBSyxDQUFDLEtBQUs7RUFDakQsTUFBTUMsU0FBUyxHQUFHO0lBQ2hCQyxLQUFLLEVBQUU7TUFDTEYsS0FBSztNQUNMRyxtQkFBbUIsRUFBRUo7SUFDdkI7RUFDRixDQUFDO0VBRUQsT0FBTyxJQUFJSyxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWlQsV0FBVyxFQUNYO01BQ0VELFFBQVE7TUFDUkksU0FBUztNQUNUTyxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUFDLENBQ0Y7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUEifQ==