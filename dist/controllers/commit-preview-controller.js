"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _multiFilePatchController = _interopRequireDefault(require("./multi-file-patch-controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommitPreviewController extends _react.default.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement(_multiFilePatchController.default, _extends({
      surface: this.props.surfaceToCommitPreviewButton
    }, this.props));
  }

}

exports.default = CommitPreviewController;

_defineProperty(CommitPreviewController, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  destroy: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceToCommitPreviewButton: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jb21taXQtcHJldmlldy1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkNvbW1pdFByZXZpZXdDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsInN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b24iLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0YWdpbmdTdGF0dXMiLCJvbmVPZiIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwia2V5bWFwcyIsInRvb2x0aXBzIiwiY29uZmlnIiwiZGVzdHJveSIsImZ1bmMiLCJ1bmRvTGFzdERpc2NhcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFFZSxNQUFNQSx1QkFBTixTQUFzQ0MsZUFBTUMsU0FBNUMsQ0FBc0Q7QUFnQm5FQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRSw2QkFBQyxpQ0FBRDtBQUNFLE1BQUEsT0FBTyxFQUFFLEtBQUtDLEtBQUwsQ0FBV0M7QUFEdEIsT0FFTSxLQUFLRCxLQUZYLEVBREY7QUFNRDs7QUF2QmtFOzs7O2dCQUFoREosdUIsZUFDQTtBQUNqQk0sRUFBQUEsVUFBVSxFQUFFQyxtQkFBVUMsTUFBVixDQUFpQkMsVUFEWjtBQUVqQkMsRUFBQUEsYUFBYSxFQUFFSCxtQkFBVUksS0FBVixDQUFnQixDQUFDLFFBQUQsRUFBVyxVQUFYLENBQWhCLENBRkU7QUFJakJDLEVBQUFBLFNBQVMsRUFBRUwsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSlg7QUFLakJJLEVBQUFBLFFBQVEsRUFBRU4sbUJBQVVDLE1BQVYsQ0FBaUJDLFVBTFY7QUFNakJLLEVBQUFBLE9BQU8sRUFBRVAsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBTlQ7QUFPakJNLEVBQUFBLFFBQVEsRUFBRVIsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBUFY7QUFRakJPLEVBQUFBLE1BQU0sRUFBRVQsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBUlI7QUFVakJRLEVBQUFBLE9BQU8sRUFBRVYsbUJBQVVXLElBQVYsQ0FBZVQsVUFWUDtBQVdqQlUsRUFBQUEsZUFBZSxFQUFFWixtQkFBVVcsSUFBVixDQUFlVCxVQVhmO0FBWWpCSixFQUFBQSw0QkFBNEIsRUFBRUUsbUJBQVVXLElBQVYsQ0FBZVQ7QUFaNUIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyIGZyb20gJy4vbXVsdGktZmlsZS1wYXRjaC1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0UHJldmlld0NvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWydzdGFnZWQnLCAndW5zdGFnZWQnXSksXG5cbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgZGVzdHJveTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bmRvTGFzdERpc2NhcmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE11bHRpRmlsZVBhdGNoQ29udHJvbGxlclxuICAgICAgICBzdXJmYWNlPXt0aGlzLnByb3BzLnN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b259XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG4iXX0=