"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/removeReactionMutation.graphql");

  if (node.hash && node.hash !== "f20b76a0ff63579992f4631894495523") {
    console.error("The definition of 'removeReactionMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/removeReactionMutation.graphql");
};

var _default = (environment, subjectId, content) => {
  const variables = {
    input: {
      content,
      subjectId
    }
  };

  function optimisticUpdater(store) {
    const subject = store.get(subjectId);
    const reactionGroups = subject.getLinkedRecords('reactionGroups') || [];
    const reactionGroup = reactionGroups.find(group => group.getValue('content') === content);

    if (!reactionGroup) {
      return;
    }

    reactionGroup.setValue(false, 'viewerHasReacted');
    const conn = reactionGroup.getLinkedRecord('users');
    conn.setValue(conn.getValue('totalCount') - 1, 'totalCount');
  }

  return new Promise((resolve, reject) => {
    (0, _reactRelay.commitMutation)(environment, {
      mutation,
      variables,
      optimisticUpdater,
      onCompleted: resolve,
      onError: reject
    });
  });
};

exports.default = _default;