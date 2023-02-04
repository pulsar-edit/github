"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _yubikiri = _interopRequireDefault(require("yubikiri"));
var _eventKit = require("event-kit");
var _observeModel = _interopRequireDefault(require("../views/observe-model"));
var _loadingView = _interopRequireDefault(require("../views/loading-view"));
var _commitDetailController = _interopRequireDefault(require("../controllers/commit-detail-controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommitDetailContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "fetchData", repository => {
      return (0, _yubikiri.default)({
        commit: repository.getCommit(this.props.sha),
        currentBranch: repository.getCurrentBranch(),
        currentRemote: async query => repository.getRemoteForBranch((await query.currentBranch).getName()),
        isCommitPushed: repository.isCommitPushed(this.props.sha)
      });
    });
    _defineProperty(this, "renderResult", data => {
      const currentCommit = data && data.commit;
      if (currentCommit !== this.lastCommit) {
        this.sub.dispose();
        if (currentCommit && currentCommit.isPresent()) {
          this.sub = new _eventKit.CompositeDisposable(...currentCommit.getMultiFileDiff().getFilePatches().map(fp => fp.onDidChangeRenderStatus(() => {
            this.forceUpdate();
          })));
        }
        this.lastCommit = currentCommit;
      }
      if (this.props.repository.isLoading() || data === null || !data.commit.isPresent()) {
        return _react.default.createElement(_loadingView.default, null);
      }
      return _react.default.createElement(_commitDetailController.default, _extends({}, data, this.props));
    });
    this.lastCommit = null;
    this.sub = new _eventKit.CompositeDisposable();
  }
  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, this.renderResult);
  }
  componentWillUnmount() {
    this.sub.dispose();
  }
}
exports.default = CommitDetailContainer;
_defineProperty(CommitDetailContainer, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  sha: _propTypes.default.string.isRequired,
  itemType: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXREZXRhaWxDb250YWluZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZXBvc2l0b3J5IiwieXViaWtpcmkiLCJjb21taXQiLCJnZXRDb21taXQiLCJzaGEiLCJjdXJyZW50QnJhbmNoIiwiZ2V0Q3VycmVudEJyYW5jaCIsImN1cnJlbnRSZW1vdGUiLCJxdWVyeSIsImdldFJlbW90ZUZvckJyYW5jaCIsImdldE5hbWUiLCJpc0NvbW1pdFB1c2hlZCIsImRhdGEiLCJjdXJyZW50Q29tbWl0IiwibGFzdENvbW1pdCIsInN1YiIsImRpc3Bvc2UiLCJpc1ByZXNlbnQiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiZ2V0TXVsdGlGaWxlRGlmZiIsImdldEZpbGVQYXRjaGVzIiwibWFwIiwiZnAiLCJvbkRpZENoYW5nZVJlbmRlclN0YXR1cyIsImZvcmNlVXBkYXRlIiwiaXNMb2FkaW5nIiwicmVuZGVyIiwiZmV0Y2hEYXRhIiwicmVuZGVyUmVzdWx0IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiaXRlbVR5cGUiLCJmdW5jIl0sInNvdXJjZXMiOlsiY29tbWl0LWRldGFpbC1jb250YWluZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IExvYWRpbmdWaWV3IGZyb20gJy4uL3ZpZXdzL2xvYWRpbmctdmlldyc7XG5pbXBvcnQgQ29tbWl0RGV0YWlsQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21taXQtZGV0YWlsLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXREZXRhaWxDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzaGE6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBpdGVtVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5sYXN0Q29tbWl0ID0gbnVsbDtcbiAgICB0aGlzLnN1YiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBmZXRjaERhdGEgPSByZXBvc2l0b3J5ID0+IHtcbiAgICByZXR1cm4geXViaWtpcmkoe1xuICAgICAgY29tbWl0OiByZXBvc2l0b3J5LmdldENvbW1pdCh0aGlzLnByb3BzLnNoYSksXG4gICAgICBjdXJyZW50QnJhbmNoOiByZXBvc2l0b3J5LmdldEN1cnJlbnRCcmFuY2goKSxcbiAgICAgIGN1cnJlbnRSZW1vdGU6IGFzeW5jIHF1ZXJ5ID0+IHJlcG9zaXRvcnkuZ2V0UmVtb3RlRm9yQnJhbmNoKChhd2FpdCBxdWVyeS5jdXJyZW50QnJhbmNoKS5nZXROYW1lKCkpLFxuICAgICAgaXNDb21taXRQdXNoZWQ6IHJlcG9zaXRvcnkuaXNDb21taXRQdXNoZWQodGhpcy5wcm9wcy5zaGEpLFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9PlxuICAgICAgICB7dGhpcy5yZW5kZXJSZXN1bHR9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVzdWx0ID0gZGF0YSA9PiB7XG4gICAgY29uc3QgY3VycmVudENvbW1pdCA9IGRhdGEgJiYgZGF0YS5jb21taXQ7XG4gICAgaWYgKGN1cnJlbnRDb21taXQgIT09IHRoaXMubGFzdENvbW1pdCkge1xuICAgICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICAgICAgaWYgKGN1cnJlbnRDb21taXQgJiYgY3VycmVudENvbW1pdC5pc1ByZXNlbnQoKSkge1xuICAgICAgICB0aGlzLnN1YiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgICAgIC4uLmN1cnJlbnRDb21taXQuZ2V0TXVsdGlGaWxlRGlmZigpLmdldEZpbGVQYXRjaGVzKCkubWFwKGZwID0+IGZwLm9uRGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICB9KSksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmxhc3RDb21taXQgPSBjdXJyZW50Q29tbWl0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNMb2FkaW5nKCkgfHwgZGF0YSA9PT0gbnVsbCB8fCAhZGF0YS5jb21taXQuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZ1ZpZXcgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXREZXRhaWxDb250cm9sbGVyXG4gICAgICAgIHsuLi5kYXRhfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUE2RTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTlELE1BQU1BLHFC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