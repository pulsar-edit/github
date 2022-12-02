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
    return _react.default.createElement(_gitTabContainer.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9naXQtdGFiLWl0ZW0uanMiXSwibmFtZXMiOlsiR2l0VGFiSXRlbSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJ1cmlQYXR0ZXJuIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlZkNvbnRyb2xsZXIiLCJSZWZIb2xkZXIiLCJyZW5kZXIiLCJzZXJpYWxpemUiLCJkZXNlcmlhbGl6ZXIiLCJ1cmkiLCJnZXRVUkkiLCJnZXRUaXRsZSIsImdldEljb25OYW1lIiwiZ2V0RGVmYXVsdExvY2F0aW9uIiwiZ2V0UHJlZmVycmVkV2lkdGgiLCJnZXRXb3JraW5nRGlyZWN0b3J5IiwicmVwb3NpdG9yeSIsImdldFdvcmtpbmdEaXJlY3RvcnlQYXRoIiwicmVtZW1iZXJMYXN0Rm9jdXMiLCJhcmdzIiwibWFwIiwiYyIsInJlc3RvcmVGb2N1cyIsImhhc0ZvY3VzIiwiZm9jdXMiLCJmb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtIiwiZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uIiwicXVpZXRseVNlbGVjdEl0ZW0iLCJmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxVQUFOLFNBQXlCQyxlQUFNQyxTQUEvQixDQUF5QztBQU92QyxTQUFSQyxRQUFRLEdBQUc7QUFDaEIsV0FBTyxLQUFLQyxVQUFaO0FBQ0Q7O0FBRURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFFQSxTQUFLQyxhQUFMLEdBQXFCLElBQUlDLGtCQUFKLEVBQXJCO0FBQ0Q7O0FBRURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0UsNkJBQUMsd0JBQUQ7QUFDRSxNQUFBLGFBQWEsRUFBRSxLQUFLRjtBQUR0QixPQUVNLEtBQUtELEtBRlgsRUFERjtBQU1EOztBQUVESSxFQUFBQSxTQUFTLEdBQUc7QUFDVixXQUFPO0FBQ0xDLE1BQUFBLFlBQVksRUFBRSxhQURUO0FBRUxDLE1BQUFBLEdBQUcsRUFBRSxLQUFLQyxNQUFMO0FBRkEsS0FBUDtBQUlEOztBQUVEQyxFQUFBQSxRQUFRLEdBQUc7QUFDVCxXQUFPLEtBQVA7QUFDRDs7QUFFREMsRUFBQUEsV0FBVyxHQUFHO0FBQ1osV0FBTyxZQUFQO0FBQ0Q7O0FBRURDLEVBQUFBLGtCQUFrQixHQUFHO0FBQ25CLFdBQU8sT0FBUDtBQUNEOztBQUVEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixXQUFPLEdBQVA7QUFDRDs7QUFFREosRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FBTyxLQUFLUixXQUFMLENBQWlCRCxVQUF4QjtBQUNEOztBQUVEYyxFQUFBQSxtQkFBbUIsR0FBRztBQUNwQixXQUFPLEtBQUtaLEtBQUwsQ0FBV2EsVUFBWCxDQUFzQkMsdUJBQXRCLEVBQVA7QUFDRCxHQXZEcUQsQ0F5RHREOzs7QUFFQUMsRUFBQUEsaUJBQWlCLENBQUMsR0FBR0MsSUFBSixFQUFVO0FBQ3pCLFdBQU8sS0FBS2YsYUFBTCxDQUFtQmdCLEdBQW5CLENBQXVCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0gsaUJBQUYsQ0FBb0IsR0FBR0MsSUFBdkIsQ0FBNUIsQ0FBUDtBQUNEOztBQUVERyxFQUFBQSxZQUFZLENBQUMsR0FBR0gsSUFBSixFQUFVO0FBQ3BCLFdBQU8sS0FBS2YsYUFBTCxDQUFtQmdCLEdBQW5CLENBQXVCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0MsWUFBRixDQUFlLEdBQUdILElBQWxCLENBQTVCLENBQVA7QUFDRDs7QUFFREksRUFBQUEsUUFBUSxDQUFDLEdBQUdKLElBQUosRUFBVTtBQUNoQixXQUFPLEtBQUtmLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNFLFFBQUYsQ0FBVyxHQUFHSixJQUFkLENBQTVCLENBQVA7QUFDRDs7QUFFREssRUFBQUEsS0FBSyxHQUFHO0FBQ04sV0FBTyxLQUFLcEIsYUFBTCxDQUFtQmdCLEdBQW5CLENBQXVCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0MsWUFBRixFQUE1QixDQUFQO0FBQ0Q7O0FBRURHLEVBQUFBLHlCQUF5QixDQUFDLEdBQUdOLElBQUosRUFBVTtBQUNqQyxXQUFPLEtBQUtmLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNJLHlCQUFGLENBQTRCLEdBQUdOLElBQS9CLENBQTVCLENBQVA7QUFDRDs7QUFFRE8sRUFBQUEsaUNBQWlDLEdBQUc7QUFDbEMsV0FBTyxLQUFLdEIsYUFBTCxDQUFtQmdCLEdBQW5CLENBQXVCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0ssaUNBQUYsRUFBNUIsQ0FBUDtBQUNEOztBQUVEQyxFQUFBQSxpQkFBaUIsQ0FBQyxHQUFHUixJQUFKLEVBQVU7QUFDekIsV0FBTyxLQUFLZixhQUFMLENBQW1CZ0IsR0FBbkIsQ0FBdUJDLENBQUMsSUFBSUEsQ0FBQyxDQUFDTSxpQkFBRixDQUFvQixHQUFHUixJQUF2QixDQUE1QixDQUFQO0FBQ0Q7O0FBRURTLEVBQUFBLDBCQUEwQixHQUFHO0FBQzNCLFdBQU8sS0FBS3hCLGFBQUwsQ0FBbUJnQixHQUFuQixDQUF1QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNPLDBCQUFGLEVBQTVCLENBQVA7QUFDRDs7QUF6RnFEOzs7O2dCQUFuQy9CLFUsZUFDQTtBQUNqQm1CLEVBQUFBLFVBQVUsRUFBRWEsbUJBQVVDLE1BQVYsQ0FBaUJDO0FBRFosQzs7Z0JBREFsQyxVLGdCQUtDLDZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IEdpdFRhYkNvbnRhaW5lciBmcm9tICcuLi9jb250YWluZXJzL2dpdC10YWItY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0VGFiSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9kb2NrLWl0ZW0vZ2l0J1xuXG4gIHN0YXRpYyBidWlsZFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmlQYXR0ZXJuO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZkNvbnRyb2xsZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHaXRUYWJDb250YWluZXJcbiAgICAgICAgY29udHJvbGxlclJlZj17dGhpcy5yZWZDb250cm9sbGVyfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnR2l0RG9ja0l0ZW0nLFxuICAgICAgdXJpOiB0aGlzLmdldFVSSSgpLFxuICAgIH07XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0dpdCc7XG4gIH1cblxuICBnZXRJY29uTmFtZSgpIHtcbiAgICByZXR1cm4gJ2dpdC1jb21taXQnO1xuICB9XG5cbiAgZ2V0RGVmYXVsdExvY2F0aW9uKCkge1xuICAgIHJldHVybiAncmlnaHQnO1xuICB9XG5cbiAgZ2V0UHJlZmVycmVkV2lkdGgoKSB7XG4gICAgcmV0dXJuIDQwMDtcbiAgfVxuXG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci51cmlQYXR0ZXJuO1xuICB9XG5cbiAgZ2V0V29ya2luZ0RpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCk7XG4gIH1cblxuICAvLyBGb3J3YXJkZWQgdG8gdGhlIGNvbnRyb2xsZXIgaW5zdGFuY2Ugd2hlbiBvbmUgaXMgcHJlc2VudFxuXG4gIHJlbWVtYmVyTGFzdEZvY3VzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMucmVtZW1iZXJMYXN0Rm9jdXMoLi4uYXJncykpO1xuICB9XG5cbiAgcmVzdG9yZUZvY3VzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMucmVzdG9yZUZvY3VzKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIGhhc0ZvY3VzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMuaGFzRm9jdXMoLi4uYXJncykpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLnJlc3RvcmVGb2N1cygpKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5mb2N1c0FuZFNlbGVjdFN0YWdpbmdJdGVtKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0Q29tbWl0UHJldmlld0J1dHRvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMuZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkpO1xuICB9XG5cbiAgcXVpZXRseVNlbGVjdEl0ZW0oLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5xdWlldGx5U2VsZWN0SXRlbSguLi5hcmdzKSk7XG4gIH1cblxuICBmb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMuZm9jdXNBbmRTZWxlY3RSZWNlbnRDb21taXQoKSk7XG4gIH1cbn1cbiJdfQ==