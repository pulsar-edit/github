"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

var _moment = _interopRequireDefault(require("moment"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/updatePrReviewSummaryMutation.graphql");

  if (node.hash && node.hash !== "ce6fa7b9b5a5709f8cc8001aa7ba8a15") {
    console.error("The definition of 'updatePrReviewSummaryMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/updatePrReviewSummaryMutation.graphql");
};

var _default = (environment, {
  reviewId,
  reviewBody
}) => {
  const variables = {
    input: {
      pullRequestReviewId: reviewId,
      body: reviewBody
    }
  };
  const optimisticResponse = {
    updatePullRequestReview: {
      pullRequestReview: {
        id: reviewId,
        lastEditedAt: (0, _moment.default)().toISOString(),
        body: reviewBody,
        bodyHTML: (0, _helpers.renderMarkdown)(reviewBody)
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