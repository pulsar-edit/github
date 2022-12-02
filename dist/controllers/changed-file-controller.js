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
    return _react.default.createElement(_multiFilePatchController.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jaGFuZ2VkLWZpbGUtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJDaGFuZ2VkRmlsZUNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInByb3BzIiwic3VyZmFjZUZpbGVBdFBhdGgiLCJyZWxQYXRoIiwic3RhZ2luZ1N0YXR1cyIsInJlbmRlciIsInN1cmZhY2UiLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwic3RyaW5nIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwidG9vbHRpcHMiLCJjb25maWciLCJkZXN0cm95IiwiZnVuYyIsInVuZG9MYXN0RGlzY2FyZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7OztBQUVlLE1BQU1BLHFCQUFOLFNBQW9DQyxlQUFNQyxTQUExQyxDQUFvRDtBQUFBO0FBQUE7O0FBQUEscUNBMEJ2RCxNQUFNLEtBQUtDLEtBQUwsQ0FBV0MsaUJBQVgsQ0FBNkIsS0FBS0QsS0FBTCxDQUFXRSxPQUF4QyxFQUFpRCxLQUFLRixLQUFMLENBQVdHLGFBQTVELENBMUJpRDtBQUFBOztBQWlCakVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0UsNkJBQUMsaUNBQUQ7QUFDRSxNQUFBLE9BQU8sRUFBRSxLQUFLQztBQURoQixPQUVNLEtBQUtMLEtBRlgsRUFERjtBQU1EOztBQXhCZ0U7Ozs7Z0JBQTlDSCxxQixlQUNBO0FBQ2pCUyxFQUFBQSxVQUFVLEVBQUVDLG1CQUFVQyxNQUFWLENBQWlCQyxVQURaO0FBRWpCTixFQUFBQSxhQUFhLEVBQUVJLG1CQUFVRyxLQUFWLENBQWdCLENBQUMsUUFBRCxFQUFXLFVBQVgsQ0FBaEIsQ0FGRTtBQUdqQlIsRUFBQUEsT0FBTyxFQUFFSyxtQkFBVUksTUFBVixDQUFpQkYsVUFIVDtBQUtqQkcsRUFBQUEsU0FBUyxFQUFFTCxtQkFBVUMsTUFBVixDQUFpQkMsVUFMWDtBQU1qQkksRUFBQUEsUUFBUSxFQUFFTixtQkFBVUMsTUFBVixDQUFpQkMsVUFOVjtBQU9qQkssRUFBQUEsT0FBTyxFQUFFUCxtQkFBVUMsTUFBVixDQUFpQkMsVUFQVDtBQVFqQk0sRUFBQUEsUUFBUSxFQUFFUixtQkFBVUMsTUFBVixDQUFpQkMsVUFSVjtBQVNqQk8sRUFBQUEsTUFBTSxFQUFFVCxtQkFBVUMsTUFBVixDQUFpQkMsVUFUUjtBQVdqQlEsRUFBQUEsT0FBTyxFQUFFVixtQkFBVVcsSUFBVixDQUFlVCxVQVhQO0FBWWpCVSxFQUFBQSxlQUFlLEVBQUVaLG1CQUFVVyxJQUFWLENBQWVULFVBWmY7QUFhakJSLEVBQUFBLGlCQUFpQixFQUFFTSxtQkFBVVcsSUFBVixDQUFlVDtBQWJqQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBNdWx0aUZpbGVQYXRjaENvbnRyb2xsZXIgZnJvbSAnLi9tdWx0aS1maWxlLXBhdGNoLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFuZ2VkRmlsZUNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWydzdGFnZWQnLCAndW5zdGFnZWQnXSksXG4gICAgcmVsUGF0aDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHN1cmZhY2VGaWxlQXRQYXRoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyXG4gICAgICAgIHN1cmZhY2U9e3RoaXMuc3VyZmFjZX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBzdXJmYWNlID0gKCkgPT4gdGhpcy5wcm9wcy5zdXJmYWNlRmlsZUF0UGF0aCh0aGlzLnByb3BzLnJlbFBhdGgsIHRoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cylcbn1cbiJdfQ==