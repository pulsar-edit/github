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