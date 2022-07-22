"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _electron = require("electron");

var _reporterProxy = require("../reporter-proxy");

var _propTypes2 = require("../prop-types");

var _issueishSearchesController = _interopRequireDefault(require("./issueish-searches-controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RemoteController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onCreatePr", async () => {
      const currentBranch = this.props.branches.getHeadBranch();
      const upstream = currentBranch.getUpstream();

      if (!upstream.isPresent() || this.props.aheadCount > 0) {
        await this.props.onPushBranch();
      }

      let createPrUrl = 'https://github.com/';
      createPrUrl += this.props.remote.getOwner() + '/' + this.props.remote.getRepo();
      createPrUrl += '/compare/' + encodeURIComponent(currentBranch.getName());
      createPrUrl += '?expand=1';
      await _electron.shell.openExternal(createPrUrl);
      (0, _reporterProxy.incrementCounter)('create-pull-request');
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_issueishSearchesController.default, {
      endpoint: this.props.endpoint,
      token: this.props.token,
      workingDirectory: this.props.workingDirectory,
      repository: this.props.repository,
      workspace: this.props.workspace,
      remote: this.props.remote,
      remotes: this.props.remotes,
      branches: this.props.branches,
      aheadCount: this.props.aheadCount,
      pushInProgress: this.props.pushInProgress,
      onCreatePr: this.onCreatePr
    });
  }

}

exports.default = RemoteController;

_defineProperty(RemoteController, "propTypes", {
  // Relay payload
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    defaultBranchRef: _propTypes.default.shape({
      prefix: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired
    })
  }),
  // Connection
  endpoint: _propTypes2.EndpointPropType.isRequired,
  token: _propTypes2.TokenPropType.isRequired,
  // Repository derived attributes
  workingDirectory: _propTypes.default.string,
  workspace: _propTypes.default.object.isRequired,
  remote: _propTypes2.RemotePropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  aheadCount: _propTypes.default.number,
  pushInProgress: _propTypes.default.bool.isRequired,
  // Actions
  onPushBranch: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yZW1vdGUtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJSZW1vdGVDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjdXJyZW50QnJhbmNoIiwicHJvcHMiLCJicmFuY2hlcyIsImdldEhlYWRCcmFuY2giLCJ1cHN0cmVhbSIsImdldFVwc3RyZWFtIiwiaXNQcmVzZW50IiwiYWhlYWRDb3VudCIsIm9uUHVzaEJyYW5jaCIsImNyZWF0ZVByVXJsIiwicmVtb3RlIiwiZ2V0T3duZXIiLCJnZXRSZXBvIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZ2V0TmFtZSIsInNoZWxsIiwib3BlbkV4dGVybmFsIiwicmVuZGVyIiwiZW5kcG9pbnQiLCJ0b2tlbiIsIndvcmtpbmdEaXJlY3RvcnkiLCJyZXBvc2l0b3J5Iiwid29ya3NwYWNlIiwicmVtb3RlcyIsInB1c2hJblByb2dyZXNzIiwib25DcmVhdGVQciIsIlByb3BUeXBlcyIsInNoYXBlIiwiaWQiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiZGVmYXVsdEJyYW5jaFJlZiIsInByZWZpeCIsIm5hbWUiLCJFbmRwb2ludFByb3BUeXBlIiwiVG9rZW5Qcm9wVHlwZSIsIm9iamVjdCIsIlJlbW90ZVByb3BUeXBlIiwiUmVtb3RlU2V0UHJvcFR5cGUiLCJCcmFuY2hTZXRQcm9wVHlwZSIsIm51bWJlciIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGdCQUFOLFNBQStCQyxlQUFNQyxTQUFyQyxDQUErQztBQUFBO0FBQUE7O0FBQUEsd0NBaUQvQyxZQUFZO0FBQ3ZCLFlBQU1DLGFBQWEsR0FBRyxLQUFLQyxLQUFMLENBQVdDLFFBQVgsQ0FBb0JDLGFBQXBCLEVBQXRCO0FBQ0EsWUFBTUMsUUFBUSxHQUFHSixhQUFhLENBQUNLLFdBQWQsRUFBakI7O0FBQ0EsVUFBSSxDQUFDRCxRQUFRLENBQUNFLFNBQVQsRUFBRCxJQUF5QixLQUFLTCxLQUFMLENBQVdNLFVBQVgsR0FBd0IsQ0FBckQsRUFBd0Q7QUFDdEQsY0FBTSxLQUFLTixLQUFMLENBQVdPLFlBQVgsRUFBTjtBQUNEOztBQUVELFVBQUlDLFdBQVcsR0FBRyxxQkFBbEI7QUFDQUEsTUFBQUEsV0FBVyxJQUFJLEtBQUtSLEtBQUwsQ0FBV1MsTUFBWCxDQUFrQkMsUUFBbEIsS0FBK0IsR0FBL0IsR0FBcUMsS0FBS1YsS0FBTCxDQUFXUyxNQUFYLENBQWtCRSxPQUFsQixFQUFwRDtBQUNBSCxNQUFBQSxXQUFXLElBQUksY0FBY0ksa0JBQWtCLENBQUNiLGFBQWEsQ0FBQ2MsT0FBZCxFQUFELENBQS9DO0FBQ0FMLE1BQUFBLFdBQVcsSUFBSSxXQUFmO0FBRUEsWUFBTU0sZ0JBQU1DLFlBQU4sQ0FBbUJQLFdBQW5CLENBQU47QUFDQSwyQ0FBaUIscUJBQWpCO0FBQ0QsS0EvRDJEO0FBQUE7O0FBNEI1RFEsRUFBQUEsTUFBTSxHQUFHO0FBQ1Asd0JBQ0UsNkJBQUMsbUNBQUQ7QUFDRSxNQUFBLFFBQVEsRUFBRSxLQUFLaEIsS0FBTCxDQUFXaUIsUUFEdkI7QUFFRSxNQUFBLEtBQUssRUFBRSxLQUFLakIsS0FBTCxDQUFXa0IsS0FGcEI7QUFJRSxNQUFBLGdCQUFnQixFQUFFLEtBQUtsQixLQUFMLENBQVdtQixnQkFKL0I7QUFLRSxNQUFBLFVBQVUsRUFBRSxLQUFLbkIsS0FBTCxDQUFXb0IsVUFMekI7QUFPRSxNQUFBLFNBQVMsRUFBRSxLQUFLcEIsS0FBTCxDQUFXcUIsU0FQeEI7QUFRRSxNQUFBLE1BQU0sRUFBRSxLQUFLckIsS0FBTCxDQUFXUyxNQVJyQjtBQVNFLE1BQUEsT0FBTyxFQUFFLEtBQUtULEtBQUwsQ0FBV3NCLE9BVHRCO0FBVUUsTUFBQSxRQUFRLEVBQUUsS0FBS3RCLEtBQUwsQ0FBV0MsUUFWdkI7QUFXRSxNQUFBLFVBQVUsRUFBRSxLQUFLRCxLQUFMLENBQVdNLFVBWHpCO0FBWUUsTUFBQSxjQUFjLEVBQUUsS0FBS04sS0FBTCxDQUFXdUIsY0FaN0I7QUFjRSxNQUFBLFVBQVUsRUFBRSxLQUFLQztBQWRuQixNQURGO0FBa0JEOztBQS9DMkQ7Ozs7Z0JBQXpDNUIsZ0IsZUFDQTtBQUNqQjtBQUNBd0IsRUFBQUEsVUFBVSxFQUFFSyxtQkFBVUMsS0FBVixDQUFnQjtBQUMxQkMsSUFBQUEsRUFBRSxFQUFFRixtQkFBVUcsTUFBVixDQUFpQkMsVUFESztBQUUxQkMsSUFBQUEsZ0JBQWdCLEVBQUVMLG1CQUFVQyxLQUFWLENBQWdCO0FBQ2hDSyxNQUFBQSxNQUFNLEVBQUVOLG1CQUFVRyxNQUFWLENBQWlCQyxVQURPO0FBRWhDRyxNQUFBQSxJQUFJLEVBQUVQLG1CQUFVRyxNQUFWLENBQWlCQztBQUZTLEtBQWhCO0FBRlEsR0FBaEIsQ0FGSztBQVVqQjtBQUNBWixFQUFBQSxRQUFRLEVBQUVnQiw2QkFBaUJKLFVBWFY7QUFZakJYLEVBQUFBLEtBQUssRUFBRWdCLDBCQUFjTCxVQVpKO0FBY2pCO0FBQ0FWLEVBQUFBLGdCQUFnQixFQUFFTSxtQkFBVUcsTUFmWDtBQWdCakJQLEVBQUFBLFNBQVMsRUFBRUksbUJBQVVVLE1BQVYsQ0FBaUJOLFVBaEJYO0FBaUJqQnBCLEVBQUFBLE1BQU0sRUFBRTJCLDJCQUFlUCxVQWpCTjtBQWtCakJQLEVBQUFBLE9BQU8sRUFBRWUsOEJBQWtCUixVQWxCVjtBQW1CakI1QixFQUFBQSxRQUFRLEVBQUVxQyw4QkFBa0JULFVBbkJYO0FBb0JqQnZCLEVBQUFBLFVBQVUsRUFBRW1CLG1CQUFVYyxNQXBCTDtBQXFCakJoQixFQUFBQSxjQUFjLEVBQUVFLG1CQUFVZSxJQUFWLENBQWVYLFVBckJkO0FBdUJqQjtBQUNBdEIsRUFBQUEsWUFBWSxFQUFFa0IsbUJBQVVnQixJQUFWLENBQWVaO0FBeEJaLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7c2hlbGx9IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IHtpbmNyZW1lbnRDb3VudGVyfSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge1JlbW90ZVByb3BUeXBlLCBSZW1vdGVTZXRQcm9wVHlwZSwgQnJhbmNoU2V0UHJvcFR5cGUsIEVuZHBvaW50UHJvcFR5cGUsIFRva2VuUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IElzc3VlaXNoU2VhcmNoZXNDb250cm9sbGVyIGZyb20gJy4vaXNzdWVpc2gtc2VhcmNoZXMtY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZUNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHBheWxvYWRcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRlZmF1bHRCcmFuY2hSZWY6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHByZWZpeDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSxcbiAgICB9KSxcblxuICAgIC8vIENvbm5lY3Rpb25cbiAgICBlbmRwb2ludDogRW5kcG9pbnRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHRva2VuOiBUb2tlblByb3BUeXBlLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBSZXBvc2l0b3J5IGRlcml2ZWQgYXR0cmlidXRlc1xuICAgIHdvcmtpbmdEaXJlY3Rvcnk6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVtb3RlOiBSZW1vdGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYnJhbmNoZXM6IEJyYW5jaFNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgYWhlYWRDb3VudDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBwdXNoSW5Qcm9ncmVzczogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbnNcbiAgICBvblB1c2hCcmFuY2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJc3N1ZWlzaFNlYXJjaGVzQ29udHJvbGxlclxuICAgICAgICBlbmRwb2ludD17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgdG9rZW49e3RoaXMucHJvcHMudG9rZW59XG5cbiAgICAgICAgd29ya2luZ0RpcmVjdG9yeT17dGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5fVxuICAgICAgICByZXBvc2l0b3J5PXt0aGlzLnByb3BzLnJlcG9zaXRvcnl9XG5cbiAgICAgICAgd29ya3NwYWNlPXt0aGlzLnByb3BzLndvcmtzcGFjZX1cbiAgICAgICAgcmVtb3RlPXt0aGlzLnByb3BzLnJlbW90ZX1cbiAgICAgICAgcmVtb3Rlcz17dGhpcy5wcm9wcy5yZW1vdGVzfVxuICAgICAgICBicmFuY2hlcz17dGhpcy5wcm9wcy5icmFuY2hlc31cbiAgICAgICAgYWhlYWRDb3VudD17dGhpcy5wcm9wcy5haGVhZENvdW50fVxuICAgICAgICBwdXNoSW5Qcm9ncmVzcz17dGhpcy5wcm9wcy5wdXNoSW5Qcm9ncmVzc31cblxuICAgICAgICBvbkNyZWF0ZVByPXt0aGlzLm9uQ3JlYXRlUHJ9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBvbkNyZWF0ZVByID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRCcmFuY2ggPSB0aGlzLnByb3BzLmJyYW5jaGVzLmdldEhlYWRCcmFuY2goKTtcbiAgICBjb25zdCB1cHN0cmVhbSA9IGN1cnJlbnRCcmFuY2guZ2V0VXBzdHJlYW0oKTtcbiAgICBpZiAoIXVwc3RyZWFtLmlzUHJlc2VudCgpIHx8IHRoaXMucHJvcHMuYWhlYWRDb3VudCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMub25QdXNoQnJhbmNoKCk7XG4gICAgfVxuXG4gICAgbGV0IGNyZWF0ZVByVXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS8nO1xuICAgIGNyZWF0ZVByVXJsICs9IHRoaXMucHJvcHMucmVtb3RlLmdldE93bmVyKCkgKyAnLycgKyB0aGlzLnByb3BzLnJlbW90ZS5nZXRSZXBvKCk7XG4gICAgY3JlYXRlUHJVcmwgKz0gJy9jb21wYXJlLycgKyBlbmNvZGVVUklDb21wb25lbnQoY3VycmVudEJyYW5jaC5nZXROYW1lKCkpO1xuICAgIGNyZWF0ZVByVXJsICs9ICc/ZXhwYW5kPTEnO1xuXG4gICAgYXdhaXQgc2hlbGwub3BlbkV4dGVybmFsKGNyZWF0ZVByVXJsKTtcbiAgICBpbmNyZW1lbnRDb3VudGVyKCdjcmVhdGUtcHVsbC1yZXF1ZXN0Jyk7XG4gIH1cbn1cbiJdfQ==