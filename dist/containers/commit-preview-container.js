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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
        return /*#__PURE__*/_react.default.createElement(_loadingView.default, null);
      }

      return /*#__PURE__*/_react.default.createElement(_commitPreviewController.default, _extends({
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
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2NvbW1pdC1wcmV2aWV3LWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJDb21taXRQcmV2aWV3Q29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVwb3NpdG9yeSIsImJ1aWxkZXJPcHRzIiwicmVuZGVyU3RhdHVzT3ZlcnJpZGVzIiwic3RhdGUiLCJsYXJnZURpZmZUaHJlc2hvbGQiLCJ1bmRlZmluZWQiLCJiZWZvcmUiLCJlbWl0dGVyIiwiZW1pdCIsImFmdGVyIiwicGF0Y2giLCJtdWx0aUZpbGVQYXRjaCIsImdldFN0YWdlZENoYW5nZXNQYXRjaCIsInBhdGNoQnVmZmVyIiwiYnVpbGRlciIsImRhdGEiLCJjdXJyZW50TXVsdGlGaWxlUGF0Y2giLCJsYXN0TXVsdGlGaWxlUGF0Y2giLCJzdWIiLCJkaXNwb3NlIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImdldEZpbGVQYXRjaGVzIiwibWFwIiwiZnAiLCJvbkRpZENoYW5nZVJlbmRlclN0YXR1cyIsInNldFN0YXRlIiwicHJldlN0YXRlIiwiZ2V0UGF0aCIsImdldFJlbmRlclN0YXR1cyIsImlzTG9hZGluZyIsIm9uV2lsbFVwZGF0ZVBhdGNoIiwib25EaWRVcGRhdGVQYXRjaCIsImNiIiwib24iLCJFbWl0dGVyIiwiUGF0Y2hCdWZmZXIiLCJyZW5kZXIiLCJmZXRjaERhdGEiLCJyZW5kZXJSZXN1bHQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJudW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsc0JBQU4sU0FBcUNDLGVBQU1DLFNBQTNDLENBQXFEO0FBTWxFQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxL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QUNFLDZCQUFDLHFCQUFEO0FBQWMsTUFBQSxLQUFLLEVBQUUsS0FBS3JDLEtBQUwsQ0FBV0MsVUFBaEM7QUFBNEMsTUFBQSxTQUFTLEVBQUUsS0FBS3FDO0FBQTVELE9BQ0csS0FBS0MsWUFEUixDQURGO0FBS0Q7O0FBc0NEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQixTQUFLckIsR0FBTCxDQUFTQyxPQUFUO0FBQ0Q7O0FBckZpRTs7OztnQkFBL0N4QixzQixlQUNBO0FBQ2pCSyxFQUFBQSxVQUFVLEVBQUV3QyxtQkFBVUMsTUFBVixDQUFpQkMsVUFEWjtBQUVqQnRDLEVBQUFBLGtCQUFrQixFQUFFb0MsbUJBQVVHO0FBRmIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBMb2FkaW5nVmlldyBmcm9tICcuLi92aWV3cy9sb2FkaW5nLXZpZXcnO1xuaW1wb3J0IENvbW1pdFByZXZpZXdDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2NvbW1pdC1wcmV2aWV3LWNvbnRyb2xsZXInO1xuaW1wb3J0IFBhdGNoQnVmZmVyIGZyb20gJy4uL21vZGVscy9wYXRjaC9wYXRjaC1idWZmZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21taXRQcmV2aWV3Q29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbGFyZ2VEaWZmVGhyZXNob2xkOiBQcm9wVHlwZXMubnVtYmVyLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgdGhpcy5wYXRjaEJ1ZmZlciA9IG5ldyBQYXRjaEJ1ZmZlcigpO1xuXG4gICAgdGhpcy5sYXN0TXVsdGlGaWxlUGF0Y2ggPSBudWxsO1xuICAgIHRoaXMuc3ViID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7cmVuZGVyU3RhdHVzT3ZlcnJpZGVzOiB7fX07XG4gIH1cblxuICBmZXRjaERhdGEgPSByZXBvc2l0b3J5ID0+IHtcbiAgICBjb25zdCBidWlsZGVyT3B0cyA9IHtyZW5kZXJTdGF0dXNPdmVycmlkZXM6IHRoaXMuc3RhdGUucmVuZGVyU3RhdHVzT3ZlcnJpZGVzfTtcblxuICAgIGlmICh0aGlzLnByb3BzLmxhcmdlRGlmZlRocmVzaG9sZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBidWlsZGVyT3B0cy5sYXJnZURpZmZUaHJlc2hvbGQgPSB0aGlzLnByb3BzLmxhcmdlRGlmZlRocmVzaG9sZDtcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmUgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnd2lsbC11cGRhdGUtcGF0Y2gnKTtcbiAgICBjb25zdCBhZnRlciA9IHBhdGNoID0+IHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLXBhdGNoJywgcGF0Y2gpO1xuXG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIG11bHRpRmlsZVBhdGNoOiByZXBvc2l0b3J5LmdldFN0YWdlZENoYW5nZXNQYXRjaCh7XG4gICAgICAgIHBhdGNoQnVmZmVyOiB0aGlzLnBhdGNoQnVmZmVyLFxuICAgICAgICBidWlsZGVyOiBidWlsZGVyT3B0cyxcbiAgICAgICAgYmVmb3JlLFxuICAgICAgICBhZnRlcixcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9PlxuICAgICAgICB7dGhpcy5yZW5kZXJSZXN1bHR9XG4gICAgICA8L09ic2VydmVNb2RlbD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVzdWx0ID0gZGF0YSA9PiB7XG4gICAgY29uc3QgY3VycmVudE11bHRpRmlsZVBhdGNoID0gZGF0YSAmJiBkYXRhLm11bHRpRmlsZVBhdGNoO1xuICAgIGlmIChjdXJyZW50TXVsdGlGaWxlUGF0Y2ggIT09IHRoaXMubGFzdE11bHRpRmlsZVBhdGNoKSB7XG4gICAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gICAgICBpZiAoY3VycmVudE11bHRpRmlsZVBhdGNoKSB7XG4gICAgICAgIHRoaXMuc3ViID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAgICAgLi4uY3VycmVudE11bHRpRmlsZVBhdGNoLmdldEZpbGVQYXRjaGVzKCkubWFwKGZwID0+IGZwLm9uRGlkQ2hhbmdlUmVuZGVyU3RhdHVzKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZW5kZXJTdGF0dXNPdmVycmlkZXM6IHtcbiAgICAgICAgICAgICAgICAgIC4uLnByZXZTdGF0ZS5yZW5kZXJTdGF0dXNPdmVycmlkZXMsXG4gICAgICAgICAgICAgICAgICBbZnAuZ2V0UGF0aCgpXTogZnAuZ2V0UmVuZGVyU3RhdHVzKCksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubGFzdE11bHRpRmlsZVBhdGNoID0gY3VycmVudE11bHRpRmlsZVBhdGNoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnJlcG9zaXRvcnkuaXNMb2FkaW5nKCkgfHwgZGF0YSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nVmlldyAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPENvbW1pdFByZXZpZXdDb250cm9sbGVyXG4gICAgICAgIHN0YWdpbmdTdGF0dXM9eydzdGFnZWQnfVxuICAgICAgICBvbldpbGxVcGRhdGVQYXRjaD17dGhpcy5vbldpbGxVcGRhdGVQYXRjaH1cbiAgICAgICAgb25EaWRVcGRhdGVQYXRjaD17dGhpcy5vbkRpZFVwZGF0ZVBhdGNofVxuICAgICAgICB7Li4uZGF0YX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1Yi5kaXNwb3NlKCk7XG4gIH1cblxuICBvbldpbGxVcGRhdGVQYXRjaCA9IGNiID0+IHRoaXMuZW1pdHRlci5vbignd2lsbC11cGRhdGUtcGF0Y2gnLCBjYik7XG5cbiAgb25EaWRVcGRhdGVQYXRjaCA9IGNiID0+IHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1wYXRjaCcsIGNiKTtcbn1cbiJdfQ==