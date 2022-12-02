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
    return _react.default.createElement(_multiFilePatchController.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jb21taXQtcHJldmlldy1jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkNvbW1pdFByZXZpZXdDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsInN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b24iLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0YWdpbmdTdGF0dXMiLCJvbmVPZiIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwia2V5bWFwcyIsInRvb2x0aXBzIiwiY29uZmlnIiwiZGVzdHJveSIsImZ1bmMiLCJ1bmRvTGFzdERpc2NhcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFFZSxNQUFNQSx1QkFBTixTQUFzQ0MsZUFBTUMsU0FBNUMsQ0FBc0Q7QUFnQm5FQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFLDZCQUFDLGlDQUFEO0FBQ0UsTUFBQSxPQUFPLEVBQUUsS0FBS0MsS0FBTCxDQUFXQztBQUR0QixPQUVNLEtBQUtELEtBRlgsRUFERjtBQU1EOztBQXZCa0U7Ozs7Z0JBQWhESix1QixlQUNBO0FBQ2pCTSxFQUFBQSxVQUFVLEVBQUVDLG1CQUFVQyxNQUFWLENBQWlCQyxVQURaO0FBRWpCQyxFQUFBQSxhQUFhLEVBQUVILG1CQUFVSSxLQUFWLENBQWdCLENBQUMsUUFBRCxFQUFXLFVBQVgsQ0FBaEIsQ0FGRTtBQUlqQkMsRUFBQUEsU0FBUyxFQUFFTCxtQkFBVUMsTUFBVixDQUFpQkMsVUFKWDtBQUtqQkksRUFBQUEsUUFBUSxFQUFFTixtQkFBVUMsTUFBVixDQUFpQkMsVUFMVjtBQU1qQkssRUFBQUEsT0FBTyxFQUFFUCxtQkFBVUMsTUFBVixDQUFpQkMsVUFOVDtBQU9qQk0sRUFBQUEsUUFBUSxFQUFFUixtQkFBVUMsTUFBVixDQUFpQkMsVUFQVjtBQVFqQk8sRUFBQUEsTUFBTSxFQUFFVCxtQkFBVUMsTUFBVixDQUFpQkMsVUFSUjtBQVVqQlEsRUFBQUEsT0FBTyxFQUFFVixtQkFBVVcsSUFBVixDQUFlVCxVQVZQO0FBV2pCVSxFQUFBQSxlQUFlLEVBQUVaLG1CQUFVVyxJQUFWLENBQWVULFVBWGY7QUFZakJKLEVBQUFBLDRCQUE0QixFQUFFRSxtQkFBVVcsSUFBVixDQUFlVDtBQVo1QixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBNdWx0aUZpbGVQYXRjaENvbnRyb2xsZXIgZnJvbSAnLi9tdWx0aS1maWxlLXBhdGNoLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXRQcmV2aWV3Q29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHN0YWdpbmdTdGF0dXM6IFByb3BUeXBlcy5vbmVPZihbJ3N0YWdlZCcsICd1bnN0YWdlZCddKSxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICBkZXN0cm95OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyXG4gICAgICAgIHN1cmZhY2U9e3RoaXMucHJvcHMuc3VyZmFjZVRvQ29tbWl0UHJldmlld0J1dHRvbn1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==