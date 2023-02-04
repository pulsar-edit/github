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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtdXRhdGlvbiIsImVudmlyb25tZW50IiwibmFtZSIsIm93bmVySUQiLCJ2aXNpYmlsaXR5IiwidmFyaWFibGVzIiwiaW5wdXQiLCJvd25lcklkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjb21taXRNdXRhdGlvbiIsIm9uQ29tcGxldGVkIiwib25FcnJvciJdLCJzb3VyY2VzIjpbImNyZWF0ZS1yZXBvc2l0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbmltcG9ydCB7Y29tbWl0TXV0YXRpb24sIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuY29uc3QgbXV0YXRpb24gPSBncmFwaHFsYFxuICBtdXRhdGlvbiBjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb24oJGlucHV0OiBDcmVhdGVSZXBvc2l0b3J5SW5wdXQhKSB7XG4gICAgY3JlYXRlUmVwb3NpdG9yeShpbnB1dDogJGlucHV0KSB7XG4gICAgICByZXBvc2l0b3J5IHtcbiAgICAgICAgc3NoVXJsXG4gICAgICAgIHVybFxuICAgICAgfVxuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgKGVudmlyb25tZW50LCB7bmFtZSwgb3duZXJJRCwgdmlzaWJpbGl0eX0pID0+IHtcbiAgY29uc3QgdmFyaWFibGVzID0ge1xuICAgIGlucHV0OiB7XG4gICAgICBuYW1lLFxuICAgICAgb3duZXJJZDogb3duZXJJRCxcbiAgICAgIHZpc2liaWxpdHksXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbW1pdE11dGF0aW9uKFxuICAgICAgZW52aXJvbm1lbnQsXG4gICAgICB7XG4gICAgICAgIG11dGF0aW9uLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIG9uQ29tcGxldGVkOiByZXNvbHZlLFxuICAgICAgICBvbkVycm9yOiByZWplY3QsXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7QUFGQTs7QUFJQSxNQUFNQSxRQUFRO0VBQUE7RUFBQTtJQUFBO0VBQUE7RUFBQTtBQUFBLENBU2I7QUFBQyxlQUVhLENBQUNDLFdBQVcsRUFBRTtFQUFDQyxJQUFJO0VBQUVDLE9BQU87RUFBRUM7QUFBVSxDQUFDLEtBQUs7RUFDM0QsTUFBTUMsU0FBUyxHQUFHO0lBQ2hCQyxLQUFLLEVBQUU7TUFDTEosSUFBSTtNQUNKSyxPQUFPLEVBQUVKLE9BQU87TUFDaEJDO0lBQ0Y7RUFDRixDQUFDO0VBRUQsT0FBTyxJQUFJSSxPQUFPLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDdEMsSUFBQUMsMEJBQWMsRUFDWlYsV0FBVyxFQUNYO01BQ0VELFFBQVE7TUFDUkssU0FBUztNQUNUTyxXQUFXLEVBQUVILE9BQU87TUFDcEJJLE9BQU8sRUFBRUg7SUFDWCxDQUFDLENBQ0Y7RUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBQUEifQ==