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
    return /*#__PURE__*/_react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchData
    }, data => {
      const dataProps = data || DEFAULT_REPO_DATA;
      return /*#__PURE__*/_react.default.createElement(_gitTabController.default, _extends({}, dataProps, this.props, {
        repositoryDrift: this.props.repository !== dataProps.repository
      }));
    });
  }

}

exports.default = GitTabContainer;

_defineProperty(GitTabContainer, "propTypes", {
  repository: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250YWluZXJzL2dpdC10YWItY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfUkVQT19EQVRBIiwicmVwb3NpdG9yeSIsInVzZXJuYW1lIiwiZW1haWwiLCJsYXN0Q29tbWl0IiwibnVsbENvbW1pdCIsInJlY2VudENvbW1pdHMiLCJpc01lcmdpbmciLCJpc1JlYmFzaW5nIiwiaGFzVW5kb0hpc3RvcnkiLCJjdXJyZW50QnJhbmNoIiwibnVsbEJyYW5jaCIsInVuc3RhZ2VkQ2hhbmdlcyIsInN0YWdlZENoYW5nZXMiLCJtZXJnZUNvbmZsaWN0cyIsIndvcmtpbmdEaXJlY3RvcnlQYXRoIiwibWVyZ2VNZXNzYWdlIiwiZmV0Y2hJblByb2dyZXNzIiwiR2l0VGFiQ29udGFpbmVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJnZXRDb25maWciLCJ0aGVuIiwibiIsImdldExhc3RDb21taXQiLCJnZXRSZWNlbnRDb21taXRzIiwibWF4IiwiaGFzRGlzY2FyZEhpc3RvcnkiLCJnZXRDdXJyZW50QnJhbmNoIiwiZ2V0VW5zdGFnZWRDaGFuZ2VzIiwiZ2V0U3RhZ2VkQ2hhbmdlcyIsImdldE1lcmdlQ29uZmxpY3RzIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJxdWVyeSIsImdldE1lcmdlTWVzc2FnZSIsInJlbmRlciIsInByb3BzIiwiZmV0Y2hEYXRhIiwiZGF0YSIsImRhdGFQcm9wcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxpQkFBaUIsR0FBRztBQUN4QkMsRUFBQUEsVUFBVSxFQUFFLElBRFk7QUFFeEJDLEVBQUFBLFFBQVEsRUFBRSxFQUZjO0FBR3hCQyxFQUFBQSxLQUFLLEVBQUUsRUFIaUI7QUFJeEJDLEVBQUFBLFVBQVUsRUFBRUMsa0JBSlk7QUFLeEJDLEVBQUFBLGFBQWEsRUFBRSxFQUxTO0FBTXhCQyxFQUFBQSxTQUFTLEVBQUUsS0FOYTtBQU94QkMsRUFBQUEsVUFBVSxFQUFFLEtBUFk7QUFReEJDLEVBQUFBLGNBQWMsRUFBRSxLQVJRO0FBU3hCQyxFQUFBQSxhQUFhLEVBQUVDLGtCQVRTO0FBVXhCQyxFQUFBQSxlQUFlLEVBQUUsRUFWTztBQVd4QkMsRUFBQUEsYUFBYSxFQUFFLEVBWFM7QUFZeEJDLEVBQUFBLGNBQWMsRUFBRSxFQVpRO0FBYXhCQyxFQUFBQSxvQkFBb0IsRUFBRSxJQWJFO0FBY3hCQyxFQUFBQSxZQUFZLEVBQUUsSUFkVTtBQWV4QkMsRUFBQUEsZUFBZSxFQUFFO0FBZk8sQ0FBMUI7O0FBa0JlLE1BQU1DLGVBQU4sU0FBOEJDLGVBQU1DLFNBQXBDLENBQThDO0FBQUE7QUFBQTs7QUFBQSx1Q0FLL0NuQixVQUFVLElBQUk7QUFDeEIsYUFBTyx1QkFBUztBQUNkQSxRQUFBQSxVQURjO0FBRWRDLFFBQUFBLFFBQVEsRUFBRUQsVUFBVSxDQUFDb0IsU0FBWCxDQUFxQixXQUFyQixFQUFrQ0MsSUFBbEMsQ0FBdUNDLENBQUMsSUFBSUEsQ0FBQyxJQUFJLEVBQWpELENBRkk7QUFHZHBCLFFBQUFBLEtBQUssRUFBRUYsVUFBVSxDQUFDb0IsU0FBWCxDQUFxQixZQUFyQixFQUFtQ0MsSUFBbkMsQ0FBd0NDLENBQUMsSUFBSUEsQ0FBQyxJQUFJLEVBQWxELENBSE87QUFJZG5CLFFBQUFBLFVBQVUsRUFBRUgsVUFBVSxDQUFDdUIsYUFBWCxFQUpFO0FBS2RsQixRQUFBQSxhQUFhLEVBQUVMLFVBQVUsQ0FBQ3dCLGdCQUFYLENBQTRCO0FBQUNDLFVBQUFBLEdBQUcsRUFBRTtBQUFOLFNBQTVCLENBTEQ7QUFNZG5CLFFBQUFBLFNBQVMsRUFBRU4sVUFBVSxDQUFDTSxTQUFYLEVBTkc7QUFPZEMsUUFBQUEsVUFBVSxFQUFFUCxVQUFVLENBQUNPLFVBQVgsRUFQRTtBQVFkQyxRQUFBQSxjQUFjLEVBQUVSLFVBQVUsQ0FBQzBCLGlCQUFYLEVBUkY7QUFTZGpCLFFBQUFBLGFBQWEsRUFBRVQsVUFBVSxDQUFDMkIsZ0JBQVgsRUFURDtBQVVkaEIsUUFBQUEsZUFBZSxFQUFFWCxVQUFVLENBQUM0QixrQkFBWCxFQVZIO0FBV2RoQixRQUFBQSxhQUFhLEVBQUVaLFVBQVUsQ0FBQzZCLGdCQUFYLEVBWEQ7QUFZZGhCLFFBQUFBLGNBQWMsRUFBRWIsVUFBVSxDQUFDOEIsaUJBQVgsRUFaRjtBQWFkaEIsUUFBQUEsb0JBQW9CLEVBQUVkLFVBQVUsQ0FBQytCLHVCQUFYLEVBYlI7QUFjZGhCLFFBQUFBLFlBQVksRUFBRSxNQUFNaUIsS0FBTixJQUFlO0FBQzNCLGdCQUFNMUIsU0FBUyxHQUFHLE1BQU0wQixLQUFLLENBQUMxQixTQUE5QjtBQUNBLGlCQUFPQSxTQUFTLEdBQUdOLFVBQVUsQ0FBQ2lDLGVBQVgsRUFBSCxHQUFrQyxJQUFsRDtBQUNELFNBakJhO0FBa0JkakIsUUFBQUEsZUFBZSxFQUFFO0FBbEJILE9BQVQsQ0FBUDtBQW9CRCxLQTFCMEQ7QUFBQTs7QUE0QjNEa0IsRUFBQUEsTUFBTSxHQUFHO0FBQ1Asd0JBQ0UsNkJBQUMscUJBQUQ7QUFBYyxNQUFBLEtBQUssRUFBRSxLQUFLQyxLQUFMLENBQVduQyxVQUFoQztBQUE0QyxNQUFBLFNBQVMsRUFBRSxLQUFLb0M7QUFBNUQsT0FDR0MsSUFBSSxJQUFJO0FBQ1AsWUFBTUMsU0FBUyxHQUFHRCxJQUFJLElBQUl0QyxpQkFBMUI7QUFFQSwwQkFDRSw2QkFBQyx5QkFBRCxlQUNNdUMsU0FETixFQUVNLEtBQUtILEtBRlg7QUFHRSxRQUFBLGVBQWUsRUFBRSxLQUFLQSxLQUFMLENBQVduQyxVQUFYLEtBQTBCc0MsU0FBUyxDQUFDdEM7QUFIdkQsU0FERjtBQU9ELEtBWEgsQ0FERjtBQWVEOztBQTVDMEQ7Ozs7Z0JBQXhDaUIsZSxlQUNBO0FBQ2pCakIsRUFBQUEsVUFBVSxFQUFFdUMsbUJBQVVDLE1BQVYsQ0FBaUJDO0FBRFosQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHl1YmlraXJpIGZyb20gJ3l1YmlraXJpJztcblxuaW1wb3J0IHtudWxsQ29tbWl0fSBmcm9tICcuLi9tb2RlbHMvY29tbWl0JztcbmltcG9ydCB7bnVsbEJyYW5jaH0gZnJvbSAnLi4vbW9kZWxzL2JyYW5jaCc7XG5pbXBvcnQgT2JzZXJ2ZU1vZGVsIGZyb20gJy4uL3ZpZXdzL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IEdpdFRhYkNvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZ2l0LXRhYi1jb250cm9sbGVyJztcblxuY29uc3QgREVGQVVMVF9SRVBPX0RBVEEgPSB7XG4gIHJlcG9zaXRvcnk6IG51bGwsXG4gIHVzZXJuYW1lOiAnJyxcbiAgZW1haWw6ICcnLFxuICBsYXN0Q29tbWl0OiBudWxsQ29tbWl0LFxuICByZWNlbnRDb21taXRzOiBbXSxcbiAgaXNNZXJnaW5nOiBmYWxzZSxcbiAgaXNSZWJhc2luZzogZmFsc2UsXG4gIGhhc1VuZG9IaXN0b3J5OiBmYWxzZSxcbiAgY3VycmVudEJyYW5jaDogbnVsbEJyYW5jaCxcbiAgdW5zdGFnZWRDaGFuZ2VzOiBbXSxcbiAgc3RhZ2VkQ2hhbmdlczogW10sXG4gIG1lcmdlQ29uZmxpY3RzOiBbXSxcbiAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IG51bGwsXG4gIG1lcmdlTWVzc2FnZTogbnVsbCxcbiAgZmV0Y2hJblByb2dyZXNzOiB0cnVlLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0VGFiQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBmZXRjaERhdGEgPSByZXBvc2l0b3J5ID0+IHtcbiAgICByZXR1cm4geXViaWtpcmkoe1xuICAgICAgcmVwb3NpdG9yeSxcbiAgICAgIHVzZXJuYW1lOiByZXBvc2l0b3J5LmdldENvbmZpZygndXNlci5uYW1lJykudGhlbihuID0+IG4gfHwgJycpLFxuICAgICAgZW1haWw6IHJlcG9zaXRvcnkuZ2V0Q29uZmlnKCd1c2VyLmVtYWlsJykudGhlbihuID0+IG4gfHwgJycpLFxuICAgICAgbGFzdENvbW1pdDogcmVwb3NpdG9yeS5nZXRMYXN0Q29tbWl0KCksXG4gICAgICByZWNlbnRDb21taXRzOiByZXBvc2l0b3J5LmdldFJlY2VudENvbW1pdHMoe21heDogMTB9KSxcbiAgICAgIGlzTWVyZ2luZzogcmVwb3NpdG9yeS5pc01lcmdpbmcoKSxcbiAgICAgIGlzUmViYXNpbmc6IHJlcG9zaXRvcnkuaXNSZWJhc2luZygpLFxuICAgICAgaGFzVW5kb0hpc3Rvcnk6IHJlcG9zaXRvcnkuaGFzRGlzY2FyZEhpc3RvcnkoKSxcbiAgICAgIGN1cnJlbnRCcmFuY2g6IHJlcG9zaXRvcnkuZ2V0Q3VycmVudEJyYW5jaCgpLFxuICAgICAgdW5zdGFnZWRDaGFuZ2VzOiByZXBvc2l0b3J5LmdldFVuc3RhZ2VkQ2hhbmdlcygpLFxuICAgICAgc3RhZ2VkQ2hhbmdlczogcmVwb3NpdG9yeS5nZXRTdGFnZWRDaGFuZ2VzKCksXG4gICAgICBtZXJnZUNvbmZsaWN0czogcmVwb3NpdG9yeS5nZXRNZXJnZUNvbmZsaWN0cygpLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeVBhdGg6IHJlcG9zaXRvcnkuZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgoKSxcbiAgICAgIG1lcmdlTWVzc2FnZTogYXN5bmMgcXVlcnkgPT4ge1xuICAgICAgICBjb25zdCBpc01lcmdpbmcgPSBhd2FpdCBxdWVyeS5pc01lcmdpbmc7XG4gICAgICAgIHJldHVybiBpc01lcmdpbmcgPyByZXBvc2l0b3J5LmdldE1lcmdlTWVzc2FnZSgpIDogbnVsbDtcbiAgICAgIH0sXG4gICAgICBmZXRjaEluUHJvZ3Jlc3M6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8T2JzZXJ2ZU1vZGVsIG1vZGVsPXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9IGZldGNoRGF0YT17dGhpcy5mZXRjaERhdGF9PlxuICAgICAgICB7ZGF0YSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YVByb3BzID0gZGF0YSB8fCBERUZBVUxUX1JFUE9fREFUQTtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8R2l0VGFiQ29udHJvbGxlclxuICAgICAgICAgICAgICB7Li4uZGF0YVByb3BzfVxuICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgcmVwb3NpdG9yeURyaWZ0PXt0aGlzLnByb3BzLnJlcG9zaXRvcnkgIT09IGRhdGFQcm9wcy5yZXBvc2l0b3J5fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9fVxuICAgICAgPC9PYnNlcnZlTW9kZWw+XG4gICAgKTtcbiAgfVxufVxuIl19