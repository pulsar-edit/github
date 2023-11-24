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