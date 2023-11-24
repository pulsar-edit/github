"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _yubikiri = _interopRequireDefault(require("yubikiri"));

var _eventKit = require("event-kit");

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _resolutionProgress = _interopRequireDefault(require("../models/conflicts/resolution-progress"));

var _editorConflictController = _interopRequireDefault(require("./editor-conflict-controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_REPO_DATA = {
  mergeConflictPaths: [],
  isRebasing: false
};
/**
 * Render an `EditorConflictController` for each `TextEditor` open on a file that contains git conflict markers.
 */

class RepositoryConflictController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "fetchData", repository => {
      return (0, _yubikiri.default)({
        workingDirectoryPath: repository.getWorkingDirectoryPath(),
        mergeConflictPaths: repository.getMergeConflicts().then(conflicts => {
          return conflicts.map(conflict => conflict.filePath);
        }),
        isRebasing: repository.isRebasing()
      });
    });

    this.state = {
      openEditors: this.props.workspace.getTextEditors()
    };
    this.subscriptions = new _eventKit.CompositeDisposable();
  }

  componentDidMount() {
    const updateState = () => {
      this.setState({
        openEditors: this.props.workspace.getTextEditors()
      });
    };

    this.subscriptions.add(this.props.workspace.observeTextEditors(updateState), this.props.workspace.onDidDestroyPaneItem(updateState), this.props.config.observe('github.graphicalConflictResolution', () => this.forceUpdate()));
  }

  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, data => this.renderWithData(data || DEFAULT_REPO_DATA));
  }

  renderWithData(repoData) {
    const conflictingEditors = this.getConflictingEditors(repoData);
    return _react.default.createElement("div", null, conflictingEditors.map(editor => _react.default.createElement(_editorConflictController.default, {
      key: editor.id,
      commands: this.props.commands,
      resolutionProgress: this.props.resolutionProgress,
      editor: editor,
      isRebase: repoData.isRebasing,
      refreshResolutionProgress: this.props.refreshResolutionProgress
    })));
  }

  getConflictingEditors(repoData) {
    if (repoData.mergeConflictPaths.length === 0 || this.state.openEditors.length === 0 || !this.props.config.get('github.graphicalConflictResolution')) {
      return [];
    }

    const commonBasePath = this.props.repository.getWorkingDirectoryPath();
    const fullMergeConflictPaths = new Set(repoData.mergeConflictPaths.map(relativePath => _path.default.join(commonBasePath, relativePath)));
    return this.state.openEditors.filter(editor => fullMergeConflictPaths.has(editor.getPath()));
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

}

exports.default = RepositoryConflictController;

_defineProperty(RepositoryConflictController, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  resolutionProgress: _propTypes.default.object.isRequired,
  repository: _propTypes.default.object.isRequired,
  refreshResolutionProgress: _propTypes.default.func
});

_defineProperty(RepositoryConflictController, "defaultProps", {
  refreshResolutionProgress: () => {},
  resolutionProgress: new _resolutionProgress.default()
});