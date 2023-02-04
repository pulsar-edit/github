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
var _commitPreviewController = _interopRequireDefault(require("../controllers/commit-preview-controller"));
var _patchBuffer = _interopRequireDefault(require("../models/patch/patch-buffer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommitPreviewContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "fetchData", repository => {
      const builderOpts = {
        renderStatusOverrides: this.state.renderStatusOverrides
      };
      if (this.props.largeDiffThreshold !== undefined) {
        builderOpts.largeDiffThreshold = this.props.largeDiffThreshold;
      }
      const before = () => this.emitter.emit('will-update-patch');
      const after = patch => this.emitter.emit('did-update-patch', patch);
      return (0, _yubikiri.default)({
        multiFilePatch: repository.getStagedChangesPatch({
          patchBuffer: this.patchBuffer,
          builder: builderOpts,
          before,
          after
        })
      });
    });
    _defineProperty(this, "renderResult", data => {
      const currentMultiFilePatch = data && data.multiFilePatch;
      if (currentMultiFilePatch !== this.lastMultiFilePatch) {
        this.sub.dispose();
        if (currentMultiFilePatch) {
          this.sub = new _eventKit.CompositeDisposable(...currentMultiFilePatch.getFilePatches().map(fp => fp.onDidChangeRenderStatus(() => {
            this.setState(prevState => {
              return {
                renderStatusOverrides: _objectSpread({}, prevState.renderStatusOverrides, {
                  [fp.getPath()]: fp.getRenderStatus()
                })
              };
            });
          })));
        }
        this.lastMultiFilePatch = currentMultiFilePatch;
      }
      if (this.props.repository.isLoading() || data === null) {
        return _react.default.createElement(_loadingView.default, null);
      }
      return _react.default.createElement(_commitPreviewController.default, _extends({
        stagingStatus: 'staged',
        onWillUpdatePatch: this.onWillUpdatePatch,
        onDidUpdatePatch: this.onDidUpdatePatch
      }, data, this.props));
    });
    _defineProperty(this, "onWillUpdatePatch", cb => this.emitter.on('will-update-patch', cb));
    _defineProperty(this, "onDidUpdatePatch", cb => this.emitter.on('did-update-patch', cb));
    this.emitter = new _eventKit.Emitter();
    this.patchBuffer = new _patchBuffer.default();
    this.lastMultiFilePatch = null;
    this.sub = new _eventKit.CompositeDisposable();
    this.state = {
      renderStatusOverrides: {}
    };
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
exports.default = CommitPreviewContainer;
_defineProperty(CommitPreviewContainer, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  largeDiffThreshold: _propTypes.default.number
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXRQcmV2aWV3Q29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVwb3NpdG9yeSIsImJ1aWxkZXJPcHRzIiwicmVuZGVyU3RhdHVzT3ZlcnJpZGVzIiwic3RhdGUiLCJsYXJnZURpZmZUaHJlc2hvbGQiLCJ1bmRlZmluZWQiLCJiZWZvcmUiLCJlbWl0dGVyIiwiZW1pdCIsImFmdGVyIiwicGF0Y2giLCJ5dWJpa2lyaSIsIm11bHRpRmlsZVBhdGNoIiwiZ2V0U3RhZ2VkQ2hhbmdlc1BhdGNoIiwicGF0Y2hCdWZmZXIiLCJidWlsZGVyIiwiZGF0YSIsImN1cnJlbnRNdWx0aUZpbGVQYXRjaCIsImxhc3RNdWx0aUZpbGVQYXRjaCIsInN1YiIsImRpc3Bvc2UiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiZ2V0RmlsZVBhdGNoZXMiLCJtYXAiLCJmcCIsIm9uRGlkQ2hhbmdlUmVuZGVyU3RhdHVzIiwic2V0U3RhdGUiLCJwcmV2U3RhdGUiLCJnZXRQYXRoIiwiZ2V0UmVuZGVyU3RhdHVzIiwiaXNMb2FkaW5nIiwib25XaWxsVXBkYXRlUGF0Y2giLCJvbkRpZFVwZGF0ZVBhdGNoIiwiY2IiLCJvbiIsIkVtaXR0ZXIiLCJQYXRjaEJ1ZmZlciIsInJlbmRlciIsImZldGNoRGF0YSIsInJlbmRlclJlc3VsdCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm51bWJlciJdLCJzb3VyY2VzIjpbImNvbW1pdC1wcmV2aWV3LWNvbnRhaW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCBPYnNlcnZlTW9kZWwgZnJvbSAnLi4vdmlld3Mvb2JzZXJ2ZS1tb2RlbCc7XG5pbXBvcnQgTG9hZGluZ1ZpZXcgZnJvbSAnLi4vdmlld3MvbG9hZGluZy12aWV3JztcbmltcG9ydCBDb21taXRQcmV2aWV3Q29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9jb21taXQtcHJldmlldy1jb250cm9sbGVyJztcbmltcG9ydCBQYXRjaEJ1ZmZlciBmcm9tICcuLi9tb2RlbHMvcGF0Y2gvcGF0Y2gtYnVmZmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0UHJldmlld0NvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGxhcmdlRGlmZlRocmVzaG9sZDogUHJvcFR5cGVzLm51bWJlcixcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMucGF0Y2hCdWZmZXIgPSBuZXcgUGF0Y2hCdWZmZXIoKTtcblxuICAgIHRoaXMubGFzdE11bHRpRmlsZVBhdGNoID0gbnVsbDtcbiAgICB0aGlzLnN1YiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge3JlbmRlclN0YXR1c092ZXJyaWRlczoge319O1xuICB9XG5cbiAgZmV0Y2hEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgY29uc3QgYnVpbGRlck9wdHMgPSB7cmVuZGVyU3RhdHVzT3ZlcnJpZGVzOiB0aGlzLnN0YXRlLnJlbmRlclN0YXR1c092ZXJyaWRlc307XG5cbiAgICBpZiAodGhpcy5wcm9wcy5sYXJnZURpZmZUaHJlc2hvbGQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYnVpbGRlck9wdHMubGFyZ2VEaWZmVGhyZXNob2xkID0gdGhpcy5wcm9wcy5sYXJnZURpZmZUaHJlc2hvbGQ7XG4gICAgfVxuXG4gICAgY29uc3QgYmVmb3JlID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ3dpbGwtdXBkYXRlLXBhdGNoJyk7XG4gICAgY29uc3QgYWZ0ZXIgPSBwYXRjaCA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1wYXRjaCcsIHBhdGNoKTtcblxuICAgIHJldHVybiB5dWJpa2lyaSh7XG4gICAgICBtdWx0aUZpbGVQYXRjaDogcmVwb3NpdG9yeS5nZXRTdGFnZWRDaGFuZ2VzUGF0Y2goe1xuICAgICAgICBwYXRjaEJ1ZmZlcjogdGhpcy5wYXRjaEJ1ZmZlcixcbiAgICAgICAgYnVpbGRlcjogYnVpbGRlck9wdHMsXG4gICAgICAgIGJlZm9yZSxcbiAgICAgICAgYWZ0ZXIsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hEYXRhfT5cbiAgICAgICAge3RoaXMucmVuZGVyUmVzdWx0fVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlc3VsdCA9IGRhdGEgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRNdWx0aUZpbGVQYXRjaCA9IGRhdGEgJiYgZGF0YS5tdWx0aUZpbGVQYXRjaDtcbiAgICBpZiAoY3VycmVudE11bHRpRmlsZVBhdGNoICE9PSB0aGlzLmxhc3RNdWx0aUZpbGVQYXRjaCkge1xuICAgICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICAgICAgaWYgKGN1cnJlbnRNdWx0aUZpbGVQYXRjaCkge1xuICAgICAgICB0aGlzLnN1YiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgICAgIC4uLmN1cnJlbnRNdWx0aUZpbGVQYXRjaC5nZXRGaWxlUGF0Y2hlcygpLm1hcChmcCA9PiBmcC5vbkRpZENoYW5nZVJlbmRlclN0YXR1cygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVuZGVyU3RhdHVzT3ZlcnJpZGVzOiB7XG4gICAgICAgICAgICAgICAgICAuLi5wcmV2U3RhdGUucmVuZGVyU3RhdHVzT3ZlcnJpZGVzLFxuICAgICAgICAgICAgICAgICAgW2ZwLmdldFBhdGgoKV06IGZwLmdldFJlbmRlclN0YXR1cygpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmxhc3RNdWx0aUZpbGVQYXRjaCA9IGN1cnJlbnRNdWx0aUZpbGVQYXRjaDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZXBvc2l0b3J5LmlzTG9hZGluZygpIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZ1ZpZXcgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXRQcmV2aWV3Q29udHJvbGxlclxuICAgICAgICBzdGFnaW5nU3RhdHVzPXsnc3RhZ2VkJ31cbiAgICAgICAgb25XaWxsVXBkYXRlUGF0Y2g9e3RoaXMub25XaWxsVXBkYXRlUGF0Y2h9XG4gICAgICAgIG9uRGlkVXBkYXRlUGF0Y2g9e3RoaXMub25EaWRVcGRhdGVQYXRjaH1cbiAgICAgICAgey4uLmRhdGF9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWIuZGlzcG9zZSgpO1xuICB9XG5cbiAgb25XaWxsVXBkYXRlUGF0Y2ggPSBjYiA9PiB0aGlzLmVtaXR0ZXIub24oJ3dpbGwtdXBkYXRlLXBhdGNoJywgY2IpO1xuXG4gIG9uRGlkVXBkYXRlUGF0Y2ggPSBjYiA9PiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtcGF0Y2gnLCBjYik7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBdUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFeEMsTUFBTUEsc0JBQXNCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBTWxFQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUFDLG1DQVlIQyxVQUFVLElBQUk7TUFDeEIsTUFBTUMsV0FBVyxHQUFHO1FBQUNDLHFCQUFxQixFQUFFLElBQUksQ0FBQ0MsS0FBSyxDQUFDRDtNQUFxQixDQUFDO01BRTdFLElBQUksSUFBSSxDQUFDSCxLQUFLLENBQUNLLGtCQUFrQixLQUFLQyxTQUFTLEVBQUU7UUFDL0NKLFdBQVcsQ0FBQ0csa0JBQWtCLEdBQUcsSUFBSSxDQUFDTCxLQUFLLENBQUNLLGtCQUFrQjtNQUNoRTtNQUVBLE1BQU1FLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQ0MsT0FBTyxDQUFDQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7TUFDM0QsTUFBTUMsS0FBSyxHQUFHQyxLQUFLLElBQUksSUFBSSxDQUFDSCxPQUFPLENBQUNDLElBQUksQ0FBQyxrQkFBa0IsRUFBRUUsS0FBSyxDQUFDO01BRW5FLE9BQU8sSUFBQUMsaUJBQVEsRUFBQztRQUNkQyxjQUFjLEVBQUVaLFVBQVUsQ0FBQ2EscUJBQXFCLENBQUM7VUFDL0NDLFdBQVcsRUFBRSxJQUFJLENBQUNBLFdBQVc7VUFDN0JDLE9BQU8sRUFBRWQsV0FBVztVQUNwQkssTUFBTTtVQUNORztRQUNGLENBQUM7TUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBQUEsc0NBVWNPLElBQUksSUFBSTtNQUNyQixNQUFNQyxxQkFBcUIsR0FBR0QsSUFBSSxJQUFJQSxJQUFJLENBQUNKLGNBQWM7TUFD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