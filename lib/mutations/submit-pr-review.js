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