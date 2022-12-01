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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2dpdC10YWItY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfUkVQT19EQVRBIiwicmVwb3NpdG9yeSIsInVzZXJuYW1lIiwiZW1haWwiLCJsYXN0Q29tbWl0IiwibnVsbENvbW1pdCIsInJlY2VudENvbW1pdHMiLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiaGFzVW5kb0hpc3RvcnkiLCJjdXJyZW50QnJhbmNoIiwibnVsbEJyYW5jaCIsInVuc3RhZ2VkQ2hhbmdlcyIsInN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwibWVyZ2VNZXNzYWdlIiwiZmV0Y2hJblByb2dyZXNzIiwiR2l0VGFiQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJnZXRDb25maWciLCJ0aGVuIiwibiIsImdldExhc3RDb21taXQiLCJnZXRSZWNlbnRDb21taXRzIiwibWF4IiwiaGFzRGlzY2FyZEhpc3RvcnkiLCJnZXRDdXJyZW50QnJhbmNoIiwiZ2V0VW5zdGFnZWRDaGFuZ2VzIiwiZ2V0U3RhZ2VkQ2hhbmdlcyIsImdldE1lcmdlQ29uZmxpY3RzIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJxdWVyeSIsImdldE1lcmdlTWVzc2FnZSIsInJlbmRlciIsInByb3BzIiwiZmV0Y2hEYXRhIiwiZGF0YSIsImRhdGFQcm9wcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxpQkFBaUIsR0FBRztBQUN4QkMsRUFBQUEsVUFBVSxFQUFFLElBRFk7QUFFeEJDLEVBQUFBLFFBQVEsRUFBRSxFQUZjO0FBR3hCQyxFQUFBQSxLQUFLLEVBQUUsRUFIaUI7QUFJeEJDLEVBQUFBLFVBQVUsRUFBRUMsa0JBSlk7QUFLeEJDLEVB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O1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCB7bnVsbENvbW1pdH0gZnJvbSAnLi4vbW9kZWxzL2NvbW1pdCc7XG5pbXBvcnQge251bGxCcmFuY2h9IGZyb20gJy4uL21vZGVscy9icmFuY2gnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBHaXRUYWJDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2dpdC10YWItY29udHJvbGxlcic7XG5cbmNvbnN0IERFRkFVTFRfUkVQT19EQVRBID0ge1xuICByZXBvc2l0b3J5OiBudWxsLFxuICB1c2VybmFtZTogJycsXG4gIGVtYWlsOiAnJyxcbiAgbGFzdENvbW1pdDogbnVsbENvbW1pdCxcbiAgcmVjZW50Q29tbWl0czogW10sXG4gIGlzTWVyZ2luZzogZmFsc2UsXG4gIGlzUmViYXNpbmc6IGZhbHNlLFxuICBoYXNVbmRvSGlzdG9yeTogZmFsc2UsXG4gIGN1cnJlbnRCcmFuY2g6IG51bGxCcmFuY2gsXG4gIHVuc3RhZ2VkQ2hhbmdlczogW10sXG4gIHN0YWdlZENoYW5nZXM6IFtdLFxuICBtZXJnZUNvbmZsaWN0czogW10sXG4gIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiBudWxsLFxuICBtZXJnZU1lc3NhZ2U6IG51bGwsXG4gIGZldGNoSW5Qcm9ncmVzczogdHJ1ZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYkNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgZmV0Y2hEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIHJlcG9zaXRvcnksXG4gICAgICB1c2VybmFtZTogcmVwb3NpdG9yeS5nZXRDb25maWcoJ3VzZXIubmFtZScpLnRoZW4obiA9PiBuIHx8ICcnKSxcbiAgICAgIGVtYWlsOiByZXBvc2l0b3J5LmdldENvbmZpZygndXNlci5lbWFpbCcpLnRoZW4obiA9PiBuIHx8ICcnKSxcbiAgICAgIGxhc3RDb21taXQ6IHJlcG9zaXRvcnkuZ2V0TGFzdENvbW1pdCgpLFxuICAgICAgcmVjZW50Q29tbWl0czogcmVwb3NpdG9yeS5nZXRSZWNlbnRDb21taXRzKHttYXg6IDEwfSksXG4gICAgICBpc01lcmdpbmc6IHJlcG9zaXRvcnkuaXNNZXJnaW5nKCksXG4gICAgICBpc1JlYmFzaW5nOiByZXBvc2l0b3J5LmlzUmViYXNpbmcoKSxcbiAgICAgIGhhc1VuZG9IaXN0b3J5OiByZXBvc2l0b3J5Lmhhc0Rpc2NhcmRIaXN0b3J5KCksXG4gICAgICBjdXJyZW50QnJhbmNoOiByZXBvc2l0b3J5LmdldEN1cnJlbnRCcmFuY2goKSxcbiAgICAgIHVuc3RhZ2VkQ2hhbmdlczogcmVwb3NpdG9yeS5nZXRVbnN0YWdlZENoYW5nZXMoKSxcbiAgICAgIHN0YWdlZENoYW5nZXM6IHJlcG9zaXRvcnkuZ2V0U3RhZ2VkQ2hhbmdlcygpLFxuICAgICAgbWVyZ2VDb25mbGljdHM6IHJlcG9zaXRvcnkuZ2V0TWVyZ2VDb25mbGljdHMoKSxcbiAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgICBtZXJnZU1lc3NhZ2U6IGFzeW5jIHF1ZXJ5ID0+IHtcbiAgICAgICAgY29uc3QgaXNNZXJnaW5nID0gYXdhaXQgcXVlcnkuaXNNZXJnaW5nO1xuICAgICAgICByZXR1cm4gaXNNZXJnaW5nID8gcmVwb3NpdG9yeS5nZXRNZXJnZU1lc3NhZ2UoKSA6IG51bGw7XG4gICAgICB9LFxuICAgICAgZmV0Y2hJblByb2dyZXNzOiBmYWxzZSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hEYXRhfT5cbiAgICAgICAge2RhdGEgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGFQcm9wcyA9IGRhdGEgfHwgREVGQVVMVF9SRVBPX0RBVEE7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEdpdFRhYkNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgey4uLmRhdGFQcm9wc31cbiAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlEcmlmdD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5ICE9PSBkYXRhUHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==