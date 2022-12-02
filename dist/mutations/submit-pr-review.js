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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvc3VibWl0LXByLXJldmlldy5qcyJdLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwicmV2aWV3SUQiLCJldmVudCIsInZhcmlhYmxlcyIsImlucHV0IiwicHVsbFJlcXVlc3RSZXZpZXdJZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25Db21wbGV0ZWQiLCJvbkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBRkE7QUFJQSxNQUFNQSxRQUFRO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsQ0FBZDs7ZUFVZSxDQUFDQyxXQUFELEVBQWM7QUFBQ0MsRUFBQUEsUUFBRDtBQUFXQyxFQUFBQTtBQUFYLENBQWQsS0FBb0M7QUFDakQsUUFBTUMsU0FBUyxHQUFHO0FBQ2hCQyxJQUFBQSxLQUFLLEVBQUU7QUFDTEYsTUFBQUEsS0FESztBQUVMRyxNQUFBQSxtQkFBbUIsRUFBRUo7QUFGaEI7QUFEUyxHQUFsQjtBQU9BLFNBQU8sSUFBSUssT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxvQ0FDRVIsV0FERixFQUVFO0FBQ0VELE1BQUFBLFFBREY7QUFFRUksTUFBQUEsU0FGRjtBQUdFTSxNQUFBQSxXQUFXLEVBQUVGLE9BSGY7QUFJRUcsTUFBQUEsT0FBTyxFQUFFRjtBQUpYLEtBRkY7QUFTRCxHQVZNLENBQVA7QUFXRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IHtjb21taXRNdXRhdGlvbiwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIHN1Ym1pdFByUmV2aWV3TXV0YXRpb24oJGlucHV0OiBTdWJtaXRQdWxsUmVxdWVzdFJldmlld0lucHV0ISkge1xuICAgIHN1Ym1pdFB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IChlbnZpcm9ubWVudCwge3Jldmlld0lELCBldmVudH0pID0+IHtcbiAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgIGlucHV0OiB7XG4gICAgICBldmVudCxcbiAgICAgIHB1bGxSZXF1ZXN0UmV2aWV3SWQ6IHJldmlld0lELFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb21taXRNdXRhdGlvbihcbiAgICAgIGVudmlyb25tZW50LFxuICAgICAge1xuICAgICAgICBtdXRhdGlvbixcbiAgICAgICAgdmFyaWFibGVzLFxuICAgICAgICBvbkNvbXBsZXRlZDogcmVzb2x2ZSxcbiAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn07XG4iXX0=