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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3RSZWxheSIsInJlcXVpcmUiLCJtdXRhdGlvbiIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIiwiX2RlZmF1bHQiLCJlbnZpcm9ubWVudCIsIm5hbWUiLCJvd25lcklEIiwidmlzaWJpbGl0eSIsInZhcmlhYmxlcyIsImlucHV0Iiwib3duZXJJZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29tbWl0TXV0YXRpb24iLCJvbkNvbXBsZXRlZCIsIm9uRXJyb3IiLCJleHBvcnRzIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbImNyZWF0ZS1yZXBvc2l0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7Y29tbWl0TXV0YXRpb24sIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuY29uc3QgbXV0YXRpb24gPSBncmFwaHFsYFxuICBtdXRhdGlvbiBjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb24oJGlucHV0OiBDcmVhdGVSZXBvc2l0b3J5SW5wdXQhKSB7XG4gICAgY3JlYXRlUmVwb3NpdG9yeShpbnB1dDogJGlucHV0KSB7XG4gICAgICByZXBvc2l0b3J5IHtcbiAgICAgICAgc3NoVXJsXG4gICAgICAgIHVybFxuICAgICAgfVxuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgKGVudmlyb25tZW50LCB7bmFtZSwgb3duZXJJRCwgdmlzaWJpbGl0eX0pID0+IHtcbiAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgIGlucHV0OiB7XG4gICAgICBuYW1lLFxuICAgICAgb3duZXJJZDogb3duZXJJRCxcbiAgICAgIHZpc2liaWxpdHksXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIG9uQ29tcGxldGVkOiByZXNvbHZlLFxuICAgICAgICBvbkVycm9yOiByZWplY3QsXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBQUEsV0FBQSxHQUFBQyxPQUFBO0FBRkE7O0FBSUEsTUFBTUMsUUFBUSxZQUFBQSxDQUFBO0VBQUEsTUFBQUMsSUFBQSxHQUFBRixPQUFBO0VBQUEsSUFBQUUsSUFBQSxDQUFBQyxJQUFBLElBQUFELElBQUEsQ0FBQUMsSUFBQTtJQUFBQyxPQUFBLENBQUFDLEtBQUE7RUFBQTtFQUFBLE9BQUFMLE9BQUE7QUFBQSxDQVNiO0FBQUMsSUFBQU0sUUFBQSxHQUVhQSxDQUFDQyxXQUFXLEVBQUU7RUFBQ0MsSUFBSTtFQUFFQyxPQUFPO0VBQUVDO0FBQVUsQ0FBQyxLQUFLO0VBQzNELE1BQU1DLFNBQVMsR0FBRztJQUNoQkMsS0FBSyxFQUFFO01BQ0xKLElBQUk7TUFDSkssT0FBTyxFQUFFSixPQUFPO01BQ2hCQztJQUNGO0VBQ0YsQ0FBQztFQUVELE9BQU8sSUFBSUksT0FBTyxDQUFDLENBQUNDLE9BQU8sRUFBRUMsTUFBTSxLQUFLO0lBQ3RDLElBQUFDLDBCQUFjLEVBQ1pWLFdBQVcsRUFDWDtNQUNFTixRQUFRO01BQ1JVLFNBQVM7TUFDVE8sV0FBVyxFQUFFSCxPQUFPO01BQ3BCSSxPQUFPLEVBQUVIO0lBQ1gsQ0FBQyxDQUNGO0VBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUFBSSxPQUFBLENBQUFDLE9BQUEsR0FBQWYsUUFBQSJ9