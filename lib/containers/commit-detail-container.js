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