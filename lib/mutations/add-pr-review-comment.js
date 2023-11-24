"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

var _relayRuntime = require("relay-runtime");

var _moment = _interopRequireDefault(require("moment"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/addPrReviewCommentMutation.graphql");

  if (node.hash && node.hash !== "0485900371928de8c6b843560dfe441c") {
    console.error("The definition of 'addPrReviewCommentMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/addPrReviewCommentMutation.graphql");
};

let placeholderID = 0;

var _default = (environment, {
  body,
  inReplyTo,
  reviewID,
  threadID,
  viewerID,
  path,
  position
}) => {
  const variables = {
    input: {
      body,
      inReplyTo,
      pullRequestReviewId: reviewID
    }
  };
  const configs = [{
    type: 'RANGE_ADD',
    parentID: threadID,
    connectionInfo: [{
      key: 'ReviewCommentsAccumulator_comments',
      rangeBehavior: 'append'
    }],
    edgeName: 'commentEdge'
  }];

  function optimisticUpdater(store) {
    const reviewThread = store.get(threadID);

    if (!reviewThread) {
      return;
    }

    const id = `add-pr-review-comment:comment:${placeholderID++}`;
    const comment = store.create(id, 'PullRequestReviewComment');
    comment.setValue(id, 'id');
    comment.setValue(body, 'body');
    comment.setValue((0, _helpers.renderMarkdown)(body), 'bodyHTML');
    comment.setValue(false, 'isMinimized');
    comment.setValue(false, 'viewerCanMinimize');
    comment.setValue(false, 'viewerCanReact');
    comment.setValue(false, 'viewerCanUpdate');
    comment.setValue((0, _moment.default)().toISOString(), 'createdAt');
    comment.setValue(null, 'lastEditedAt');
    comment.setValue('NONE', 'authorAssociation');
    comment.setValue('https://github.com', 'url');
    comment.setValue(path, 'path');
    comment.setValue(position, 'position');
    comment.setLinkedRecords([], 'reactionGroups');
    let author;

    if (viewerID) {
      author = store.get(viewerID);
    } else {
      author = store.create(`add-pr-review-comment:author:${placeholderID++}`, 'User');
      author.setValue('...', 'login');
      author.setValue('atom://github/img/avatar.svg', 'avatarUrl');
    }

    comment.setLinkedRecord(author, 'author');

    const comments = _relayRuntime.ConnectionHandler.getConnection(reviewThread, 'ReviewCommentsAccumulator_comments');

    const edge = _relayRuntime.ConnectionHandler.createEdge(store, comments, comment, 'PullRequestReviewCommentEdge');

    _relayRuntime.ConnectionHandler.insertEdgeAfter(comments, edge);
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