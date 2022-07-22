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

class ChangedFileController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "surface", () => this.props.surfaceFileAtPath(this.props.relPath, this.props.stagingStatus));
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_multiFilePatchController.default, _extends({
      surface: this.surface
    }, this.props));
  }

}

exports.default = ChangedFileController;

_defineProperty(ChangedFileController, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  relPath: _propTypes.default.string.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  destroy: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceFileAtPath: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jaGFuZ2VkLWZpbGUtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJDaGFuZ2VkRmlsZUNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInByb3BzIiwic3VyZmFjZUZpbGVBdFBhdGgiLCJyZWxQYXRoIiwic3RhZ2luZ1N0YXR1cyIsInJlbmRlciIsInN1cmZhY2UiLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwic3RyaW5nIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwidG9vbHRpcHMiLCJjb25maWciLCJkZXN0cm95IiwiZnVuYyIsInVuZG9MYXN0RGlzY2FyZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7OztBQUVlLE1BQU1BLHFCQUFOLFNBQW9DQyxlQUFNQyxTQUExQyxDQUFvRDtBQUFBO0FBQUE7O0FBQUEscUNBMEJ2RCxNQUFNLEtBQUtDLEtBQUwsQ0FBV0MsaUJBQVgsQ0FBNkIsS0FBS0QsS0FBTCxDQUFXRSxPQUF4QyxFQUFpRCxLQUFLRixLQUFMLENBQVdHLGFBQTVELENBMUJpRDtBQUFBOztBQWlCakVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFLDZCQUFDLGlDQUFEO0FBQ0UsTUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFEaEIsT0FFTSxLQUFLTCxLQUZYLEVBREY7QUFNRDs7QUF4QmdFOzs7O2dCQUE5Q0gscUIsZUFDQTtBQUNqQlMsRUFBQUEsVUFBVSxFQUFFQyxtQkFBVUMsTUFBVixDQUFpQkMsVUFEWjtBQUVqQk4sRUFBQUEsYUFBYSxFQUFFSSxtQkFBVUcsS0FBVixDQUFnQixDQUFDLFFBQUQsRUFBVyxVQUFYLENBQWhCLENBRkU7QUFHakJSLEVBQUFBLE9BQU8sRUFBRUssbUJBQVVJLE1BQVYsQ0FBaUJGLFVBSFQ7QUFLakJHLEVBQUFBLFNBQVMsRUFBRUwsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBTFg7QUFNakJJLEVBQUFBLFFBQVEsRUFBRU4sbUJBQVVDLE1BQVYsQ0FBaUJDLFVBTlY7QUFPakJLLEVBQUFBLE9BQU8sRUFBRVAsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBUFQ7QUFRakJNLEVBQUFBLFFBQVEsRUFBRVIsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBUlY7QUFTakJPLEVBQUFBLE1BQU0sRUFBRVQsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBVFI7QUFXakJRLEVBQUFBLE9BQU8sRUFBRVYsbUJBQVVXLElBQVYsQ0FBZVQsVUFYUDtBQVlqQlUsRUFBQUEsZUFBZSxFQUFFWixtQkFBVVcsSUFBVixDQUFlVCxVQVpmO0FBYWpCUixFQUFBQSxpQkFBaUIsRUFBRU0sbUJBQVVXLElBQVYsQ0FBZVQ7QUFiakIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyIGZyb20gJy4vbXVsdGktZmlsZS1wYXRjaC1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbmdlZEZpbGVDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3RhZ2luZ1N0YXR1czogUHJvcFR5cGVzLm9uZU9mKFsnc3RhZ2VkJywgJ3Vuc3RhZ2VkJ10pLFxuICAgIHJlbFBhdGg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICBkZXN0cm95OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdXJmYWNlRmlsZUF0UGF0aDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE11bHRpRmlsZVBhdGNoQ29udHJvbGxlclxuICAgICAgICBzdXJmYWNlPXt0aGlzLnN1cmZhY2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgc3VyZmFjZSA9ICgpID0+IHRoaXMucHJvcHMuc3VyZmFjZUZpbGVBdFBhdGgodGhpcy5wcm9wcy5yZWxQYXRoLCB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMpXG59XG4iXX0=