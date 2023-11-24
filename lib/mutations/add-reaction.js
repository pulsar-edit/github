"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/addReactionMutation.graphql");

  if (node.hash && node.hash !== "fc238aed25f2d7e854162002cb00b57f") {
    console.error("The definition of 'addReactionMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/addReactionMutation.graphql");
};

let placeholderID = 0;

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
      const group = store.create(`add-reaction:reaction-group:${placeholderID++}`, 'ReactionGroup');
      group.setValue(true, 'viewerHasReacted');
      group.setValue(content, 'content');
      const conn = store.create(`add-reaction:reacting-user-conn:${placeholderID++}`, 'ReactingUserConnection');
      conn.setValue(1, 'totalCount');
      group.setLinkedRecord(conn, 'users');
      subject.setLinkedRecords([...reactionGroups, group], 'reactionGroups');
      return;
    }

    reactionGroup.setValue(true, 'viewerHasReacted');
    const conn = reactionGroup.getLinkedRecord('users');
    conn.setValue(conn.getValue('totalCount') + 1, 'totalCount');
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