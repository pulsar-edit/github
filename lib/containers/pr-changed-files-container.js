"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _prPatchContainer = _interopRequireDefault(require("./pr-patch-container"));

var _multiFilePatchController = _interopRequireDefault(require("../controllers/multi-file-patch-controller"));

var _loadingView = _interopRequireDefault(require("../views/loading-view"));

var _errorView = _interopRequireDefault(require("../views/error-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PullRequestChangedFilesContainer extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "renderPatchResult", (error, multiFilePatch) => {
      if (error === null && multiFilePatch === null) {
        return _react.default.createElement(_loadingView.default, null);
      }

      if (error !== null) {
        return _react.default.createElement(_errorView.default, {
          descriptions: [error]
        });
      }

      if (multiFilePatch !== this.lastPatch.patch) {
        this.lastPatch.subs.dispose();
        this.lastPatch = {
          subs: new _eventKit.CompositeDisposable(...multiFilePatch.getFilePatches().map(fp => fp.onDidChangeRenderStatus(() => this.forceUpdate()))),
          patch: multiFilePatch
        };
      }

      return _react.default.createElement(_multiFilePatchController.default, _extends({
        multiFilePatch: multiFilePatch,
        repository: this.props.localRepository,
        reviewCommentsLoading: this.props.reviewCommentsLoading,
        reviewCommentThreads: this.props.reviewCommentThreads
      }, this.props));
    });

    this.lastPatch = {
      patch: null,
      subs: new _eventKit.CompositeDisposable()
    };
  }

  componentWillUnmount() {
    this.lastPatch.subs.dispose();
  }

  render() {
    const patchProps = {
      owner: this.props.owner,
      repo: this.props.repo,
      number: this.props.number,
      endpoint: this.props.endpoint,
      token: this.props.token,
      refetch: this.props.shouldRefetch
    };
    return _react.default.createElement(_prPatchContainer.default, patchProps, this.renderPatchResult);
  }

}

exports.default = PullRequestChangedFilesContainer;

_defineProperty(PullRequestChangedFilesContainer, "propTypes", {
  // Pull request properties
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  // Connection properties
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes.default.string.isRequired,
  // Item context
  itemType: _propTypes2.ItemTypePropType.isRequired,
  // action methods
  destroy: _propTypes.default.func.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  // local repo as opposed to pull request repo
  localRepository: _propTypes.default.object.isRequired,
  workdirPath: _propTypes.default.string,
  // Review comment threads
  reviewCommentsLoading: _propTypes.default.bool.isRequired,
  reviewCommentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    thread: _propTypes.default.object.isRequired,
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
  })).isRequired,
  // refetch diff on refresh
  shouldRefetch: _propTypes.default.bool.isRequired,
  // For opening files changed tab
  initChangedFilePath: _propTypes.default.string,
  initChangedFilePosition: _propTypes.default.number,
  onOpenFilesTab: _propTypes.default.func.isRequired
});