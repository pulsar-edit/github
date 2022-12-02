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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tdXRhdGlvbnMvY3JlYXRlLXJlcG9zaXRvcnkuanMiXSwibmFtZXMiOlsibXV0YXRpb24iLCJlbnZpcm9ubWVudCIsIm5hbWUiLCJvd25lcklEIiwidmlzaWJpbGl0eSIsInZhcmlhYmxlcyIsImlucHV0Iiwib3duZXJJZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25Db21wbGV0ZWQiLCJvbkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBRkE7QUFJQSxNQUFNQSxRQUFRO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsQ0FBZDs7ZUFXZSxDQUFDQyxXQUFELEVBQWM7QUFBQ0MsRUFBQUEsSUFBRDtBQUFPQyxFQUFBQSxPQUFQO0FBQWdCQyxFQUFBQTtBQUFoQixDQUFkLEtBQThDO0FBQzNELFFBQU1DLFNBQVMsR0FBRztBQUNoQkMsSUFBQUEsS0FBSyxFQUFFO0FBQ0xKLE1BQUFBLElBREs7QUFFTEssTUFBQUEsT0FBTyxFQUFFSixPQUZKO0FBR0xDLE1BQUFBO0FBSEs7QUFEUyxHQUFsQjtBQVFBLFNBQU8sSUFBSUksT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxvQ0FDRVQsV0FERixFQUVFO0FBQ0VELE1BQUFBLFFBREY7QUFFRUssTUFBQUEsU0FGRjtBQUdFTSxNQUFBQSxXQUFXLEVBQUVGLE9BSGY7QUFJRUcsTUFBQUEsT0FBTyxFQUFFRjtBQUpYLEtBRkY7QUFTRCxHQVZNLENBQVA7QUFXRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuaW1wb3J0IHtjb21taXRNdXRhdGlvbiwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5jb25zdCBtdXRhdGlvbiA9IGdyYXBocWxgXG4gIG11dGF0aW9uIGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvbigkaW5wdXQ6IENyZWF0ZVJlcG9zaXRvcnlJbnB1dCEpIHtcbiAgICBjcmVhdGVSZXBvc2l0b3J5KGlucHV0OiAkaW5wdXQpIHtcbiAgICAgIHJlcG9zaXRvcnkge1xuICAgICAgICBzc2hVcmxcbiAgICAgICAgdXJsXG4gICAgICB9XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCAoZW52aXJvbm1lbnQsIHtuYW1lLCBvd25lcklELCB2aXNpYmlsaXR5fSkgPT4ge1xuICBjb25zdCB2YXJpYWJsZXMgPSB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIG5hbWUsXG4gICAgICBvd25lcklkOiBvd25lcklELFxuICAgICAgdmlzaWJpbGl0eSxcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29tbWl0TXV0YXRpb24oXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIHtcbiAgICAgICAgbXV0YXRpb24sXG4gICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgb25Db21wbGV0ZWQ6IHJlc29sdmUsXG4gICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59O1xuIl19