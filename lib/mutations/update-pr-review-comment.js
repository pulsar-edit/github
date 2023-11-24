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
  const node = require("./__generated__/updatePrReviewCommentMutation.graphql");

  if (node.hash && node.hash !== "d7b4e823f4604a2b193a1faceb3fcfca") {
    console.error("The definition of 'updatePrReviewCommentMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/updatePrReviewCommentMutation.graphql");
};

var _default = (environment, {
  commentId,
  commentBody
}) => {
  const variables = {
    input: {
      pullRequestReviewCommentId: commentId,
      body: commentBody
    }
  };
  const optimisticResponse = {
    updatePullRequestReviewComment: {
      pullRequestReviewComment: {
        id: commentId,
        lastEditedAt: (0, _moment.default)().toISOString(),
        body: commentBody,
        bodyHTML: (0, _helpers.renderMarkdown)(commentBody)
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