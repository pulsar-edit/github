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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJERUZBVUxUX1JFUE9fREFUQSIsInJlcG9zaXRvcnkiLCJ1c2VybmFtZSIsImVtYWlsIiwibGFzdENvbW1pdCIsIm51bGxDb21taXQiLCJyZWNlbnRDb21taXRzIiwiaXNNZXJnaW5nIiwiaXNSZWJhc2luZyIsImhhc1VuZG9IaXN0b3J5IiwiY3VycmVudEJyYW5jaCIsIm51bGxCcmFuY2giLCJ1bnN0YWdlZENoYW5nZXMiLCJzdGFnZWRDaGFuZ2VzIiwibWVyZ2VDb25mbGljdHMiLCJ3b3JraW5nRGlyZWN0b3J5UGF0aCIsIm1lcmdlTWVzc2FnZSIsImZldGNoSW5Qcm9ncmVzcyIsIkdpdFRhYkNvbnRhaW5lciIsIlJlYWN0IiwiQ29tcG9uZW50IiwieXViaWtpcmkiLCJnZXRDb25maWciLCJ0aGVuIiwibiIsImdldExhc3RDb21taXQiLCJnZXRSZWNlbnRDb21taXRzIiwibWF4IiwiaGFzRGlzY2FyZEhpc3RvcnkiLCJnZXRDdXJyZW50QnJhbmNoIiwiZ2V0VW5zdGFnZWRDaGFuZ2VzIiwiZ2V0U3RhZ2VkQ2hhbmdlcyIsImdldE1lcmdlQ29uZmxpY3RzIiwiZ2V0V29ya2luZ0RpcmVjdG9yeVBhdGgiLCJxdWVyeSIsImdldE1lcmdlTWVzc2FnZSIsInJlbmRlciIsInByb3BzIiwiZmV0Y2hEYXRhIiwiZGF0YSIsImRhdGFQcm9wcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiXSwic291cmNlcyI6WyJnaXQtdGFiLWNvbnRhaW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB5dWJpa2lyaSBmcm9tICd5dWJpa2lyaSc7XG5cbmltcG9ydCB7bnVsbENvbW1pdH0gZnJvbSAnLi4vbW9kZWxzL2NvbW1pdCc7XG5pbXBvcnQge251bGxCcmFuY2h9IGZyb20gJy4uL21vZGVscy9icmFuY2gnO1xuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuLi92aWV3cy9vYnNlcnZlLW1vZGVsJztcbmltcG9ydCBHaXRUYWJDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2dpdC10YWItY29udHJvbGxlcic7XG5cbmNvbnN0IERFRkFVTFRfUkVQT19EQVRBID0ge1xuICByZXBvc2l0b3J5OiBudWxsLFxuICB1c2VybmFtZTogJycsXG4gIGVtYWlsOiAnJyxcbiAgbGFzdENvbW1pdDogbnVsbENvbW1pdCxcbiAgcmVjZW50Q29tbWl0czogW10sXG4gIGlzTWVyZ2luZzogZmFsc2UsXG4gIGlzUmViYXNpbmc6IGZhbHNlLFxuICBoYXNVbmRvSGlzdG9yeTogZmFsc2UsXG4gIGN1cnJlbnRCcmFuY2g6IG51bGxCcmFuY2gsXG4gIHVuc3RhZ2VkQ2hhbmdlczogW10sXG4gIHN0YWdlZENoYW5nZXM6IFtdLFxuICBtZXJnZUNvbmZsaWN0czogW10sXG4gIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiBudWxsLFxuICBtZXJnZU1lc3NhZ2U6IG51bGwsXG4gIGZldGNoSW5Qcm9ncmVzczogdHJ1ZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRhYkNvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgZmV0Y2hEYXRhID0gcmVwb3NpdG9yeSA9PiB7XG4gICAgcmV0dXJuIHl1YmlraXJpKHtcbiAgICAgIHJlcG9zaXRvcnksXG4gICAgICB1c2VybmFtZTogcmVwb3NpdG9yeS5nZXRDb25maWcoJ3VzZXIubmFtZScpLnRoZW4obiA9PiBuIHx8ICcnKSxcbiAgICAgIGVtYWlsOiByZXBvc2l0b3J5LmdldENvbmZpZygndXNlci5lbWFpbCcpLnRoZW4obiA9PiBuIHx8ICcnKSxcbiAgICAgIGxhc3RDb21taXQ6IHJlcG9zaXRvcnkuZ2V0TGFzdENvbW1pdCgpLFxuICAgICAgcmVjZW50Q29tbWl0czogcmVwb3NpdG9yeS5nZXRSZWNlbnRDb21taXRzKHttYXg6IDEwfSksXG4gICAgICBpc01lcmdpbmc6IHJlcG9zaXRvcnkuaXNNZXJnaW5nKCksXG4gICAgICBpc1JlYmFzaW5nOiByZXBvc2l0b3J5LmlzUmViYXNpbmcoKSxcbiAgICAgIGhhc1VuZG9IaXN0b3J5OiByZXBvc2l0b3J5Lmhhc0Rpc2NhcmRIaXN0b3J5KCksXG4gICAgICBjdXJyZW50QnJhbmNoOiByZXBvc2l0b3J5LmdldEN1cnJlbnRCcmFuY2goKSxcbiAgICAgIHVuc3RhZ2VkQ2hhbmdlczogcmVwb3NpdG9yeS5nZXRVbnN0YWdlZENoYW5nZXMoKSxcbiAgICAgIHN0YWdlZENoYW5nZXM6IHJlcG9zaXRvcnkuZ2V0U3RhZ2VkQ2hhbmdlcygpLFxuICAgICAgbWVyZ2VDb25mbGljdHM6IHJlcG9zaXRvcnkuZ2V0TWVyZ2VDb25mbGljdHMoKSxcbiAgICAgIHdvcmtpbmdEaXJlY3RvcnlQYXRoOiByZXBvc2l0b3J5LmdldFdvcmtpbmdEaXJlY3RvcnlQYXRoKCksXG4gICAgICBtZXJnZU1lc3NhZ2U6IGFzeW5jIHF1ZXJ5ID0+IHtcbiAgICAgICAgY29uc3QgaXNNZXJnaW5nID0gYXdhaXQgcXVlcnkuaXNNZXJnaW5nO1xuICAgICAgICByZXR1cm4gaXNNZXJnaW5nID8gcmVwb3NpdG9yeS5nZXRNZXJnZU1lc3NhZ2UoKSA6IG51bGw7XG4gICAgICB9LFxuICAgICAgZmV0Y2hJblByb2dyZXNzOiBmYWxzZSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hEYXRhfT5cbiAgICAgICAge2RhdGEgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGFQcm9wcyA9IGRhdGEgfHwgREVGQVVMVF9SRVBPX0RBVEE7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEdpdFRhYkNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgey4uLmRhdGFQcm9wc31cbiAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlEcmlmdD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5ICE9PSBkYXRhUHJvcHMucmVwb3NpdG9yeX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBaUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVqRSxNQUFNQSxpQkFBaUIsR0FBRztFQUN4QkMsVUFBVSxFQUFFLElBQUk7RUFDaEJDLFFBQVEsRUFBRSxFQUFFO0VBQ1pDLEtBQUssRUFBRSxFQUFFO0VBQ1RDLFVBQVUsRUFBRUMsa0JBQVU7RUFDdEJDLGFBQWEsRUFBRSxFQUFFO0VBQ2pCQyxTQUFTLEVBQUUsS0FBSztFQUNoQkMsVUFBVSxFQUFFLEtBQUs7RUFDakJDLGNBQWMsRUFBRSxLQUFLO0VBQ3JCQyxhQUFhLEVBQUVDLGtCQUFVO0VBQ3pCQyxlQUFlLEVBQUUsRUFBRTtFQUNuQkMsYUFBYSxFQUFFLEVBQUU7RUFDakJDLGNBQWMsRUFBRSxFQUFFO0VBQ2xCQyxvQkFBb0IsRUFBRSxJQUFJO0VBQzFCQyxZQUFZLEVBQUUsSUFBSTtFQUNsQkMsZUFBZSxFQUFFO0FBQ25CLENBQUM7QUFFYyxNQUFNQyxlQUFlLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBQUE7SUFBQTtJQUFBLG1DQUsvQ25CLFVBQVUsSUFBSTtNQUN4QixPQUFPLElBQUFvQixpQkFBUSxFQUFDO1FBQ2RwQixVQUFVO1FBQ1ZDLFFBQVEsRUFBRUQsVUFBVSxDQUFDcUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDQyxJQUFJLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5RHJCLEtBQUssRUFBRUYsVUFBVSxDQUFDcUIsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDQyxJQUFJLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1RHBCLFVBQVUsRUFBRUgsVUFBVSxDQUFDd0IsYUFBYSxFQUFFO1FBQ3RDbkIsYUFBYSxFQUFFTCxVQUFVLENBQUN5QixnQkFBZ0IsQ0FBQztVQUFDQyxHQUFHLEVBQUU7UUFBRSxDQUFDLENBQUM7UUFDckRwQixTQUFTLEVBQUVOLFVBQVUsQ0FBQ00sU0FBUyxFQUFFO1FBQ2pDQyxVQUFVLEVBQUVQLFVBQVUsQ0FBQ08sVUFBVSxFQUFFO1FBQ25DQyxjQUFjLEVBQUVSLFVBQVUsQ0FBQzJCLGlCQUFpQixFQUFFO1FBQzlDbEIsYUFBYSxFQUFFVCxVQUFVLENBQUM0QixnQkFBZ0IsRUFBRTtRQUM1Q2pCLGVBQWUsRUFBRVgsVUFBVSxDQUFDNkIsa0JBQWtCLEVBQUU7UUFDaERqQixhQUFhLEVBQUVaLFVBQVUsQ0FBQzhCLGdCQUFnQixFQUFFO1FBQzVDakIsY0FBYyxFQUFFYixVQUFVLENBQUMrQixpQkFBaUIsRUFBRTtRQUM5Q2pCLG9CQUFvQixFQUFFZCxVQUFVLENBQUNnQyx1QkFBdUIsRUFBRTtRQUMxRGpCLFlBQVksRUFBRSxNQUFNa0IsS0FBSyxJQUFJO1VBQzNCLE1BQU0zQixTQUFTLEdBQUcsTUFBTTJCLEtBQUssQ0FBQzNCLFNBQVM7VUFDdkMsT0FBT0EsU0FBUyxHQUFHTixVQUFVLENBQUNrQyxlQUFlLEVBQUUsR0FBRyxJQUFJO1FBQ3hELENBQUM7UUFDRGxCLGVBQWUsRUFBRTtNQUNuQixDQUFDLENBQUM7SUFDSixDQUFDO0VBQUE7RUFFRG1CLE1BQU0sR0FBRztJQUNQLE9BQ0UsNkJBQUMscUJBQVk7TUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDQyxLQUFLLENBQUNwQyxVQUFXO01BQUMsU0FBUyxFQUFFLElBQUksQ0FBQ3FDO0lBQVUsR0FDbkVDLElBQUksSUFBSTtNQUNQLE1BQU1DLFNBQVMsR0FBR0QsSUFBSSxJQUFJdkMsaUJBQWlCO01BRTNDLE9BQ0UsNkJBQUMseUJBQWdCLGVBQ1h3QyxTQUFTLEVBQ1QsSUFBSSxDQUFDSCxLQUFLO1FBQ2QsZUFBZSxFQUFFLElBQUksQ0FBQ0EsS0FBSyxDQUFDcEMsVUFBVSxLQUFLdUMsU0FBUyxDQUFDdkM7TUFBVyxHQUNoRTtJQUVOLENBQUMsQ0FDWTtFQUVuQjtBQUNGO0FBQUM7QUFBQSxnQkE3Q29CaUIsZUFBZSxlQUNmO0VBQ2pCakIsVUFBVSxFQUFFd0Msa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQztBQUMvQixDQUFDIn0=