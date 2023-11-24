"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

var _relayRuntime = require("relay-runtime");

var _helpers = require("../helpers");

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/addPrReviewMutation.graphql");

  if (node.hash && node.hash !== "d2960bba4729b6c3e91e249ea582fec1") {
    console.error("The definition of 'addPrReviewMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/addPrReviewMutation.graphql");
};

let placeholderID = 0;

var _default = (environment, {
  body,
  event,
  pullRequestID,
  viewerID
}) => {
  const variables = {
    input: {
      pullRequestId: pullRequestID
    }
  };

  if (body) {
    variables.input.body = body;
  }

  if (event) {
    variables.input.event = event;
  }

  const configs = [{
    type: 'RANGE_ADD',
    parentID: pullRequestID,
    connectionInfo: [{
      key: 'ReviewSummariesAccumulator_reviews',
      rangeBehavior: 'append'
    }],
    edgeName: 'reviewEdge'
  }];

  function optimisticUpdater(store) {
    const pullRequest = store.get(pullRequestID);

    if (!pullRequest) {
      return;
    }

    const id = `add-pr-review:review:${placeholderID++}`;
    const review = store.create(id, 'PullRequestReview');
    review.setValue(id, 'id');
    review.setValue('PENDING', 'state');
    review.setValue(body, 'body');
    review.setValue(body ? (0, _helpers.renderMarkdown)(body) : '...', 'bodyHTML');
    review.setLinkedRecords([], 'reactionGroups');
    review.setValue(false, 'viewerCanReact');
    review.setValue(false, 'viewerCanUpdate');
    let author;

    if (viewerID) {
      author = store.get(viewerID);
    } else {
      author = store.create(`add-pr-review-comment:author:${placeholderID++}`, 'User');
      author.setValue('...', 'login');
      author.setValue('atom://github/img/avatar.svg', 'avatarUrl');
    }

    review.setLinkedRecord(author, 'author');

    const reviews = _relayRuntime.ConnectionHandler.getConnection(pullRequest, 'ReviewSummariesAccumulator_reviews');

    const edge = _relayRuntime.ConnectionHandler.createEdge(store, reviews, review, 'PullRequestReviewEdge');

    _relayRuntime.ConnectionHandler.insertEdgeAfter(reviews, edge);
  }

  return new Promise((resolve, reject) => {
    (0, _reactRelay.commitMutation)(environment, {
      mutation,
      variables,
      configs,
      optimisticUpdater,
      onCompleted: resolve,
      onError: reject
    });
  });
};

exports.default = _default;