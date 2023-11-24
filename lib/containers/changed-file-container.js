"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _yubikiri = _interopRequireDefault(require("yubikiri"));

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _loadingView = _interopRequireDefault(require("../views/loading-view"));

var _changedFileController = _interopRequireDefault(require("../controllers/changed-file-controller"));

var _patchBuffer = _interopRequireDefault(require("../models/patch/patch-buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ChangedFileContainer extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onWillUpdatePatch", cb => this.emitter.on('will-update-patch', cb));

    _defineProperty(this, "onDidUpdatePatch", cb => this.emitter.on('did-update-patch', cb));

    (0, _helpers.autobind)(this, 'fetchData', 'renderWithData');
    this.emitter = new _eventKit.Emitter();
    this.patchBuffer = new _patchBuffer.default();
    this.lastMultiFilePatch = null;
    this.sub = new _eventKit.CompositeDisposable();
    this.state = {
      renderStatusOverride: null
    };
  }

  fetchData(repository) {
    const staged = this.props.stagingStatus === 'staged';
    const builderOpts = {};

    if (this.state.renderStatusOverride !== null) {
      builderOpts.renderStatusOverrides = {
        [this.props.relPath]: this.state.renderStatusOverride
      };
    }

    if (this.props.largeDiffThreshold !== undefined) {
      builderOpts.largeDiffThreshold = this.props.largeDiffThreshold;
    }

    const before = () => this.emitter.emit('will-update-patch');

    const after = patch => this.emitter.emit('did-update-patch', patch);

    return (0, _yubikiri.default)({
      multiFilePatch: repository.getFilePatchForPath(this.props.relPath, {
        staged,
        patchBuffer: this.patchBuffer,
        builder: builderOpts,
        before,
        after
      }),
      isPartiallyStaged: repository.isPartiallyStaged(this.props.relPath),
      hasUndoHistory: repository.hasDiscardHistory(this.props.relPath)
    });
  }

  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, this.renderWithData);
  }

  renderWithData(data) {
    const currentMultiFilePatch = data && data.multiFilePatch;

    if (currentMultiFilePatch !== this.lastMultiFilePatch) {
      this.sub.dispose();
      /* istanbul ignore else */

      if (currentMultiFilePatch) {
        // Keep this component's renderStatusOverride synchronized with the FilePatch we're rendering
        this.sub = new _eventKit.CompositeDisposable(...currentMultiFilePatch.getFilePatches().map(fp => fp.onDidChangeRenderStatus(() => {
          this.setState({
            renderStatusOverride: fp.getRenderStatus()
          });
        })));
      }

      this.lastMultiFilePatch = currentMultiFilePatch;
    }

    if (this.props.repository.isLoading() || data === null) {
      return _react.default.createElement(_loadingView.default, null);
    }

    return _react.default.createElement(_changedFileController.default, _extends({
      onWillUpdatePatch: this.onWillUpdatePatch,
      onDidUpdatePatch: this.onDidUpdatePatch
    }, data, this.props));
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

}

exports.default = ChangedFileContainer;

_defineProperty(ChangedFileContainer, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  relPath: _propTypes.default.string.isRequired,
  largeDiffThreshold: _propTypes.default.number,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  destroy: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceFileAtPath: _propTypes.default.func.isRequired
});