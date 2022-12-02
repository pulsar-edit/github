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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NvbW1pdC1kZXRhaWwtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkNvbW1pdERldGFpbENvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInJlcG9zaXRvcnkiLCJjb21taXQiLCJnZXRDb21taXQiLCJzaGEiLCJjdXJyZW50QnJhbmNoIiwiZ2V0Q3VycmVudEJyYW5jaCIsImN1cnJlbnRSZW1vdGUiLCJxdWVyeSIsImdldFJlbW90ZUZvckJyYW5jaCIsImdldE5hbWUiLCJpc0NvbW1pdFB1c2hlZCIsImRhdGEiLCJjdXJyZW50Q29tbWl0IiwibGFzdENvbW1pdCIsInN1YiIsImRpc3Bvc2UiLCJpc1ByZXNlbnQiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiZ2V0TXVsdGlGaWxlRGlmZiIsImdldEZpbGVQYXRjaGVzIiwibWFwIiwiZnAiLCJvbkRpZENoYW5nZVJlbmRlclN0YXR1cyIsImZvcmNlVXBkYXRlIiwiaXNMb2FkaW5nIiwicmVuZGVyIiwiZmV0Y2hEYXRhIiwicmVuZGVyUmVzdWx0IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiaXRlbVR5cGUiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEscUJBQU4sU0FBb0NDLGVBQU1DLFNBQTFDLENBQW9EO0FBT2pFQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQix1Q0FPUEMsVUFBVSxJQUFJO0FBQ3hCLGFBQU8sdUJBQVM7QUFDZEMsUUFBQUEsTUFBTSxFQUFFRCxVQUFVLENBQUNFLFNBQVgsQ0FBcUIsS0FBS0gsS0FBTCxDQUFXSSxHQUFoQyxDQURNO0FBRWRDLFFBQUFBLGFBQWEsRUFBRUosVUFBVSxDQUFDSyxnQkFBWCxFQUZEO0FBR2RDLFFBQUFBLGFBQWEsRUFBRSxNQUFNQyxLQUFOLElBQWVQLFVBQVUsQ0FBQ1Esa0JBQVgsQ0FBOEIsQ0FBQyxNQUFNRCxLQUFLLENBQUNILGFBQWIsRUFBNEJLLE9BQTVCLEVBQTlCLENBSGhCO0FBSWRDLFFBQUFBLGNBQWMsRUFBRVYsVUFBVSxDQUFDVSxjQUFYLENBQTBCLEtBQUtYLEtBQUwsQ0FBV0ksR0FBckM7QUFKRixPQUFULENBQVA7QUFNRCxLQWRrQjs7QUFBQSwwQ0F3QkpRLElBQUksSUFBSTtBQUNyQixZQUFNQyxhQUFhLEdBQUdELElBQUksSUFBSUEsSUFBSSxDQUFDVixNQUFuQzs7QUFDQSxVQUFJVyxhQUFhLEtBQUssS0FBS0MsVUFBM0IsRUFBdUM7QUFDckMsYUFBS0MsR0FBTCxDQUFTQyxPQUFUOztBQUNBLFlBQUlILGFBQWEsSUFBSUEsYUFBYSxDQUFDSSxTQUFkLEVBQXJCLEVBQWdEO0FBQzlDLGVBQUtGLEdBQUwsR0FBVyxJQUFJRyw2QkFBSixDQUNULEdBQUdMLGFBQWEsQ0FBQ00sZ0JBQWQsR0FBaUNDLGNBQWpDLEdBQWtEQyxHQUFsRCxDQUFzREMsRUFBRSxJQUFJQSxFQUFFLENBQUNDLHVCQUFILENBQTJCLE1BQU07QUFDOUYsaUJBQUtDLFdBQUw7QUFDRCxXQUY4RCxDQUE1RCxDQURNLENBQVg7QUFLRDs7QUFDRCxhQUFLVixVQUFMLEdBQWtCRCxhQUFsQjtBQUNEOztBQUVELFVBQUksS0FBS2IsS0FBTCxDQUFXQyxVQUFYLENBQXNCd0IsU0FBdEIsTUFBcUNiLElBQUksS0FBSyxJQUE5QyxJQUFzRCxDQUFDQSxJQUFJLENBQUNWLE1BQUwsQ0FBWWUsU0FBWixFQUEzRCxFQUFvRjtBQUNsRixlQUFPLDZCQUFDLG9CQUFELE9BQVA7QUFDRDs7QUFFRCxhQUNFLDZCQUFDLCtCQUFELGVBQ01MLElBRE4sRUFFTSxLQUFLWixLQUZYLEVBREY7QUFNRCxLQWhEa0I7O0FBR2pCLFNBQUtjLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLQyxHQUFMLEdBQVcsSUFBSUcsNkJBQUosRUFBWDtBQUNEOztBQVdEUSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFLDZCQUFDLHFCQUFEO0FBQWMsTUFBQSxLQUFLLEVBQUUsS0FBSzFCLEtBQUwsQ0FBV0MsVUFBaEM7QUFBNEMsTUFBQSxTQUFTLEVBQUUsS0FBSzBCO0FBQTVELE9BQ0csS0FBS0MsWUFEUixDQURGO0FBS0Q7O0FBNEJEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixTQUFLZCxHQUFMLENBQVNDLE9BQVQ7QUFDRDs7QUEzRGdFOzs7O2dCQUE5Q3BCLHFCLGVBQ0E7QUFDakJLLEVBQUFBLFVBQVUsRUFBRTZCLG1CQUFVQyxNQUFWLENBQWlCQyxVQURaO0FBRWpCNUIsRUFBQUEsR0FBRyxFQUFFMEIsbUJBQVVHLE1BQVYsQ0FBaUJELFVBRkw7QUFHakJFLEVBQUFBLFFBQVEsRUFBRUosbUJBQVVLLElBQVYsQ0FBZUg7QUFIUixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeXViaWtpcmkgZnJvbSAneXViaWtpcmknO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IExvYWRpbmdWaWV3IGZyb20gJy4uL3ZpZXdzL2xvYWRpbmctdmlldyc7XG5pbXBvcnQgQ29tbWl0RGV0YWlsQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21taXQtZGV0YWlsLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXREZXRhaWxDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzaGE6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBpdGVtVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5sYXN0Q29tbWl0ID0gbnVsbDtcbiAgICB0aGlzLnN1YiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBmZXRjaERhdGEgPSByZXBvc2l0b3J5ID0+IHtcbiAgICByZXR1cm4geXViaWtpcmkoe1xuICAgICAgY29tbWl0OiByZXBvc2l0b3J5LmdldENvbW1pdCh0aGlzLnByb3BzLnNoYSksXG4gICAgICBjdXJyZW50QnJhbmNoOiByZXBvc2l0b3J5LmdldEN1cnJlbnRCcmFuY2goKSxcbiAgICAgIGN1cnJlbnRSZW1vdGU6IGFzeW5jIHF1ZXJ5ID0+IHJlcG9zaXRvcnkuZ2V0UmVtb3RlRm9yQnJhbmNoKChhd2FpdCBxdWVyeS5jdXJyZW50QnJhbmNoKS5nZXROYW1lKCkpLFxuICAgICAgaXNDb21taXRQdXNoZWQ6IHJlcG9zaXRvcnkuaXNDb21taXRQdXNoZWQodGhpcy5wcm9wcy5zaGEpLFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9PlxuICAgICAgICB7dGhpcy5yZW5kZXJSZXN1bHR9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVzdWx0ID0gZGF0YSA9PiB7XG4gICAgY29uc3QgY3VycmVudENvbW1pdCA9IGRhdGEgJiYgZGF0YS5jb21taXQ7XG4gICAgaWYgKGN1cnJlbnRDb21taXQgIT09IHRoaXMubGFzdENvbW1pdCkge1xuICAgICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICAgICAgaWYgKGN1cnJlbnRDb21taXQgJiYgY3VycmVudENvbW1pdC5pc1ByZXNlbnQoKSkge1xuICAgICAgICB0aGlzLnN1YiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgICAgIC4uLmN1cnJlbnRDb21taXQuZ2V0TXVsdGlGaWxlRGlmZigpLmdldEZpbGVQYXRjaGVzKCkubWFwKGZwID0+IGZwLm9uRGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICB9KSksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmxhc3RDb21taXQgPSBjdXJyZW50Q29tbWl0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNMb2FkaW5nKCkgfHwgZGF0YSA9PT0gbnVsbCB8fCAhZGF0YS5jb21taXQuaXNQcmVzZW50KCkpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZ1ZpZXcgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXREZXRhaWxDb250cm9sbGVyXG4gICAgICAgIHsuLi5kYXRhfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3ViLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl19