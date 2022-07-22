"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _gitTabContainer = _interopRequireDefault(require("../containers/git-tab-container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitTabItem extends _react.default.Component {
  static buildURI() {
    return this.uriPattern;
  }

  constructor(props) {
    super(props);
    this.refController = new _refHolder.default();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_gitTabContainer.default, _extends({
      controllerRef: this.refController
    }, this.props));
  }

  serialize() {
    return {
      deserializer: 'GitDockItem',
      uri: this.getURI()
    };
  }

  getTitle() {
    return 'Git';
  }

  getIconName() {
    return 'git-commit';
  }

  getDefaultLocation() {
    return 'right';
  }

  getPreferredWidth() {
    return 400;
  }

  getURI() {
    return this.constructor.uriPattern;
  }

  getWorkingDirectory() {
    return this.props.repository.getWorkingDirectoryPath();
  } // Forwarded to the controller instance when one is present


  rememberLastFocus(...args) {
    return this.refController.map(c => c.rememberLastFocus(...args));
  }

  restoreFocus(...args) {
    return this.refController.map(c => c.restoreFocus(...args));
  }

  hasFocus(...args) {
    return this.refController.map(c => c.hasFocus(...args));
  }

  focus() {
    return this.refController.map(c => c.restoreFocus());
  }

  focusAndSelectStagingItem(...args) {
    return this.refController.map(c => c.focusAndSelectStagingItem(...args));
  }

  focusAndSelectCommitPreviewButton() {
    return this.refController.map(c => c.focusAndSelectCommitPreviewButton());
  }

  quietlySelectItem(...args) {
    return this.refController.map(c => c.quietlySelectItem(...args));
  }

  focusAndSelectRecentCommit() {
    return this.refController.map(c => c.focusAndSelectRecentCommit());
  }

}

exports.default = GitTabItem;

_defineProperty(GitTabItem, "propTypes", {
  repository: _propTypes.default.object.isRequired
});

_defineProperty(GitTabItem, "uriPattern", 'atom-github://dock-item/git');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9naXQtdGFiLWl0ZW0uanMiXSwibmFtZXMiOlsiR2l0VGFiSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJ1cmlQYXR0ZXJuIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlZkNvbnRyb2xsZXIiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ1cmkiLCJnZXRVUkkiLCJnZXRUaXRsZSIsImdldEljb25OYW1lIiwiZ2V0RGVmYXVsdExvY2F0aW9uIiwiZ2V0UHJlZmVycmVkV2lkdGgiLCJnZXRXb3JraW5nRGlyZWN0b3J5IiwicmVwb3NpdG9yeSIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwicmVtZW1iZXJMYXN0Rm9jdXMiLCJhcmdzIiwibWFwIiwiYyIsInJlc3RvcmVGb2N1cyIsImhhc0ZvY3VzIiwiZm9jdXMiLCJmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxVQUFOLFNBQXlCQyxlQUFNQyxTQUEvQixDQUF5QztBQU92QyxTQUFSQyxRQUFRLEdBQUc7QUFDaEIsV0FBTyxLQUFLQyxVQUFaO0FBQ0Q7O0FBRURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFFQSxTQUFLQyxhQUFMLEdBQXFCLElBQUlDLGtCQUFKLEVBQXJCO0FBQ0Q7O0FBRURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFLDZCQUFDLHdCQUFEO0FBQ0UsTUFBQSxhQUFhLEVBQUUsS0FBS0Y7QUFEdEIsT0FFTSxLQUFLRCxLQUZYLEVBREY7QUFNRDs7QUFFREksRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FBTztBQUNMQyxNQUFBQSxZQUFZLEVBQUUsYUFEVDtBQUVMQyxNQUFBQSxHQUFHLEVBQUUsS0FBS0MsTUFBTDtBQUZBLEtBQVA7QUFJRDs7QUFFREMsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxLQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLFdBQVcsR0FBRztBQUNaLFdBQU8sWUFBUDtBQUNEOztBQUVEQyxFQUFBQSxrQkFBa0IsR0FBRztBQUNuQixXQUFPLE9BQVA7QUFDRDs7QUFFREMsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsV0FBTyxHQUFQO0FBQ0Q7O0FBRURKLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQU8sS0FBS1IsV0FBTCxDQUFpQkQsVUFBeEI7QUFDRDs7QUFFRGMsRUFBQUEsbUJBQW1CLEdBQUc7QUFDcEIsV0FBTyxLQUFLWixLQUFMLENBQVdhLFVBQVgsQ0FBc0JDLHVCQUF0QixFQUFQO0FBQ0QsR0F2RHFELENBeUR0RDs7O0FBRUFDLEVBQUFBLGlCQUFpQixDQUFDLEdBQUdDLElBQUosRUFBVTtBQUN6QixXQUFPLEtBQUtmLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNILGlCQUFGLENBQW9CLEdBQUdDLElBQXZCLENBQTVCLENBQVA7QUFDRDs7QUFFREcsRUFBQUEsWUFBWSxDQUFDLEdBQUdILElBQUosRUFBVTtBQUNwQixXQUFPLEtBQUtmLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFlBQUYsQ0FBZSxHQUFHSCxJQUFsQixDQUE1QixDQUFQO0FBQ0Q7O0FBRURJLEVBQUFBLFFBQVEsQ0FBQyxHQUFHSixJQUFKLEVBQVU7QUFDaEIsV0FBTyxLQUFLZixhQUFMLENBQW1CZ0IsR0FBbkIsQ0FBdUJDLENBQUMsSUFBSUEsQ0FBQyxDQUFDRSxRQUFGLENBQVcsR0FBR0osSUFBZCxDQUE1QixDQUFQO0FBQ0Q7O0FBRURLLEVBQUFBLEtBQUssR0FBRztBQUNOLFdBQU8sS0FBS3BCLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFlBQUYsRUFBNUIsQ0FBUDtBQUNEOztBQUVERyxFQUFBQSx5QkFBeUIsQ0FBQyxHQUFHTixJQUFKLEVBQVU7QUFDakMsV0FBTyxLQUFLZixhQUFMLENBQW1CZ0IsR0FBbkIsQ0FBdUJDLENBQUMsSUFBSUEsQ0FBQyxDQUFDSSx5QkFBRixDQUE0QixHQUFHTixJQUEvQixDQUE1QixDQUFQO0FBQ0Q7O0FBRURPLEVBQUFBLGlDQUFpQyxHQUFHO0FBQ2xDLFdBQU8sS0FBS3RCLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNLLGlDQUFGLEVBQTVCLENBQVA7QUFDRDs7QUFFREMsRUFBQUEsaUJBQWlCLENBQUMsR0FBR1IsSUFBSixFQUFVO0FBQ3pCLFdBQU8sS0FBS2YsYUFBTCxDQUFtQmdCLEdBQW5CLENBQXVCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ00saUJBQUYsQ0FBb0IsR0FBR1IsSUFBdkIsQ0FBNUIsQ0FBUDtBQUNEOztBQUVEUyxFQUFBQSwwQkFBMEIsR0FBRztBQUMzQixXQUFPLEtBQUt4QixhQUFMLENBQW1CZ0IsR0FBbkIsQ0FBdUJDLENBQUMsSUFBSUEsQ0FBQyxDQUFDTywwQkFBRixFQUE1QixDQUFQO0FBQ0Q7O0FBekZxRDs7OztnQkFBbkMvQixVLGVBQ0E7QUFDakJtQixFQUFBQSxVQUFVLEVBQUVhLG1CQUFVQyxNQUFWLENBQWlCQztBQURaLEM7O2dCQURBbEMsVSxnQkFLQyw2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBHaXRUYWJDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9naXQtdGFiLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYkl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyB1cmlQYXR0ZXJuID0gJ2F0b20tZ2l0aHViOi8vZG9jay1pdGVtL2dpdCdcblxuICBzdGF0aWMgYnVpbGRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJpUGF0dGVybjtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWZDb250cm9sbGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8R2l0VGFiQ29udGFpbmVyXG4gICAgICAgIGNvbnRyb2xsZXJSZWY9e3RoaXMucmVmQ29udHJvbGxlcn1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0dpdERvY2tJdGVtJyxcbiAgICAgIHVyaTogdGhpcy5nZXRVUkkoKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdHaXQnO1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7XG4gICAgcmV0dXJuICdnaXQtY29tbWl0JztcbiAgfVxuXG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gJ3JpZ2h0JztcbiAgfVxuXG4gIGdldFByZWZlcnJlZFdpZHRoKCkge1xuICAgIHJldHVybiA0MDA7XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IudXJpUGF0dGVybjtcbiAgfVxuXG4gIGdldFdvcmtpbmdEaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5UGF0aCgpO1xuICB9XG5cbiAgLy8gRm9yd2FyZGVkIHRvIHRoZSBjb250cm9sbGVyIGluc3RhbmNlIHdoZW4gb25lIGlzIHByZXNlbnRcblxuICByZW1lbWJlckxhc3RGb2N1cyguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLnJlbWVtYmVyTGFzdEZvY3VzKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIHJlc3RvcmVGb2N1cyguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLnJlc3RvcmVGb2N1cyguLi5hcmdzKSk7XG4gIH1cblxuICBoYXNGb2N1cyguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLmhhc0ZvY3VzKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5yZXN0b3JlRm9jdXMoKSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMuZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSguLi5hcmdzKSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLmZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpKTtcbiAgfVxuXG4gIHF1aWV0bHlTZWxlY3RJdGVtKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMucXVpZXRseVNlbGVjdEl0ZW0oLi4uYXJncykpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLmZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCkpO1xuICB9XG59XG4iXX0=