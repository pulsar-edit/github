"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

/* istanbul ignore file */
const mutation = function () {
  const node = require("./__generated__/createRepositoryMutation.graphql");

  if (node.hash && node.hash !== "e8f154d9f35411a15f77583bb44f7ed5") {
    console.error("The definition of 'createRepositoryMutation' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }

  return require("./__generated__/createRepositoryMutation.graphql");
};

var _default = (environment, {
  name,
  ownerID,
  visibility
}) => {
  const variables = {
    input: {
      name,
      ownerId: ownerID,
      visibility
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