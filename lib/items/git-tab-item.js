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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
  }

  // Forwarded to the controller instance when one is present

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJHaXRUYWJJdGVtIiwiUmVhY3QiLCJDb21wb25lbnQiLCJidWlsZFVSSSIsInVyaVBhdHRlcm4iLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmQ29udHJvbGxlciIsIlJlZkhvbGRlciIsInJlbmRlciIsInNlcmlhbGl6ZSIsImRlc2VyaWFsaXplciIsInVyaSIsImdldFVSSSIsImdldFRpdGxlIiwiZ2V0SWNvbk5hbWUiLCJnZXREZWZhdWx0TG9jYXRpb24iLCJnZXRQcmVmZXJyZWRXaWR0aCIsImdldFdvcmtpbmdEaXJlY3RvcnkiLCJyZXBvc2l0b3J5IiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJyZW1lbWJlckxhc3RGb2N1cyIsImFyZ3MiLCJtYXAiLCJjIiwicmVzdG9yZUZvY3VzIiwiaGFzRm9jdXMiLCJmb2N1cyIsImZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0iLCJmb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24iLCJxdWlldGx5U2VsZWN0SXRlbSIsImZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbImdpdC10YWItaXRlbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgR2l0VGFiQ29udGFpbmVyIGZyb20gJy4uL2NvbnRhaW5lcnMvZ2l0LXRhYi1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRUYWJJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBzdGF0aWMgdXJpUGF0dGVybiA9ICdhdG9tLWdpdGh1YjovL2RvY2staXRlbS9naXQnXG5cbiAgc3RhdGljIGJ1aWxkVVJJKCkge1xuICAgIHJldHVybiB0aGlzLnVyaVBhdHRlcm47XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmQ29udHJvbGxlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEdpdFRhYkNvbnRhaW5lclxuICAgICAgICBjb250cm9sbGVyUmVmPXt0aGlzLnJlZkNvbnRyb2xsZXJ9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdHaXREb2NrSXRlbScsXG4gICAgICB1cmk6IHRoaXMuZ2V0VVJJKCksXG4gICAgfTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnR2l0JztcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiAnZ2l0LWNvbW1pdCc7XG4gIH1cblxuICBnZXREZWZhdWx0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuICdyaWdodCc7XG4gIH1cblxuICBnZXRQcmVmZXJyZWRXaWR0aCgpIHtcbiAgICByZXR1cm4gNDAwO1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnVyaVBhdHRlcm47XG4gIH1cblxuICBnZXRXb3JraW5nRGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKTtcbiAgfVxuXG4gIC8vIEZvcndhcmRlZCB0byB0aGUgY29udHJvbGxlciBpbnN0YW5jZSB3aGVuIG9uZSBpcyBwcmVzZW50XG5cbiAgcmVtZW1iZXJMYXN0Rm9jdXMoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5yZW1lbWJlckxhc3RGb2N1cyguLi5hcmdzKSk7XG4gIH1cblxuICByZXN0b3JlRm9jdXMoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5yZXN0b3JlRm9jdXMoLi4uYXJncykpO1xuICB9XG5cbiAgaGFzRm9jdXMoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5oYXNGb2N1cyguLi5hcmdzKSk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yZWZDb250cm9sbGVyLm1hcChjID0+IGMucmVzdG9yZUZvY3VzKCkpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RTdGFnaW5nSXRlbSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLmZvY3VzQW5kU2VsZWN0U3RhZ2luZ0l0ZW0oLi4uYXJncykpO1xuICB9XG5cbiAgZm9jdXNBbmRTZWxlY3RDb21taXRQcmV2aWV3QnV0dG9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5mb2N1c0FuZFNlbGVjdENvbW1pdFByZXZpZXdCdXR0b24oKSk7XG4gIH1cblxuICBxdWlldGx5U2VsZWN0SXRlbSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmQ29udHJvbGxlci5tYXAoYyA9PiBjLnF1aWV0bHlTZWxlY3RJdGVtKC4uLmFyZ3MpKTtcbiAgfVxuXG4gIGZvY3VzQW5kU2VsZWN0UmVjZW50Q29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLnJlZkNvbnRyb2xsZXIubWFwKGMgPT4gYy5mb2N1c0FuZFNlbGVjdFJlY2VudENvbW1pdCgpKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUE4RDtBQUFBO0FBQUE7QUFBQTtBQUFB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