"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _yubikiri = _interopRequireDefault(require("yubikiri"));

var _commit = require("../models/commit");

var _branch = require("../models/branch");

var _observeModel = _interopRequireDefault(require("../views/observe-model"));

var _gitTabController = _interopRequireDefault(require("../controllers/git-tab-controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_REPO_DATA = {
  repository: null,
  username: '',
  email: '',
  lastCommit: _commit.nullCommit,
  recentCommits: [],
  isMerging: false,
  isRebasing: false,
  hasUndoHistory: false,
  currentBranch: _branch.nullBranch,
  unstagedChanges: [],
  stagedChanges: [],
  mergeConflicts: [],
  workingDirectoryPath: null,
  mergeMessage: null,
  fetchInProgress: true
};

class GitTabContainer extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "fetchData", repository => {
      return (0, _yubikiri.default)({
        repository,
        username: repository.getConfig('user.name').then(n => n || ''),
        email: repository.getConfig('user.email').then(n => n || ''),
        lastCommit: repository.getLastCommit(),
        recentCommits: repository.getRecentCommits({
          max: 10
        }),
        isMerging: repository.isMerging(),
        isRebasing: repository.isRebasing(),
        hasUndoHistory: repository.hasDiscardHistory(),
        currentBranch: repository.getCurrentBranch(),
        unstagedChanges: repository.getUnstagedChanges(),
        stagedChanges: repository.getStagedChanges(),
        mergeConflicts: repository.getMergeConflicts(),
        workingDirectoryPath: repository.getWorkingDirectoryPath(),
        mergeMessage: async query => {
          const isMerging = await query.isMerging;
          return isMerging ? repository.getMergeMessage() : null;
        },
        fetchInProgress: false
      });
    });
  }

  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, data => {
      const dataProps = data || DEFAULT_REPO_DATA;
      return _react.default.createElement(_gitTabController.default, _extends({}, dataProps, this.props, {
        repositoryDrift: this.props.repository !== dataProps.repository
      }));
    });
  }

}

exports.default = GitTabContainer;

_defineProperty(GitTabContainer, "propTypes", {
  repository: _propTypes.default.object.isRequired
});