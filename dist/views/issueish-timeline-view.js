"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectionRenderer = collectionRenderer;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _commitsView = _interopRequireDefault(require("./timeline-items/commits-view.js"));

var _issueCommentView = _interopRequireDefault(require("./timeline-items/issue-comment-view.js"));

var _mergedEventView = _interopRequireDefault(require("./timeline-items/merged-event-view.js"));

var _headRefForcePushedEventView = _interopRequireDefault(require("./timeline-items/head-ref-force-pushed-event-view.js"));

var _crossReferencedEventsView = _interopRequireDefault(require("./timeline-items/cross-referenced-events-view.js"));

var _commitCommentThreadView = _interopRequireDefault(require("./timeline-items/commit-comment-thread-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function collectionRenderer(Component, styleAsTimelineItem = true) {
  var _class;

  return _class = class GroupedComponent extends _react.default.Component {
    static getFragment(fragName, ...args) {
      const frag = fragName === 'nodes' ? 'item' : fragName;
      return Component.getFragment(frag, ...args);
    }

    constructor(props) {
      super(props);
      (0, _helpers.autobind)(this, 'renderNode');
    }

    render() {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: styleAsTimelineItem ? 'timeline-item' : ''
      }, this.props.nodes.map(this.renderNode));
    }

    renderNode(node, i) {
      return /*#__PURE__*/_react.default.createElement(Component, {
        key: i,
        item: node,
        issueish: this.props.issueish,
        switchToIssueish: this.props.switchToIssueish
      });
    }

  }, _defineProperty(_class, "displayName", `Grouped(${Component.render ? Component.render.displayName : Component.displayName})`), _defineProperty(_class, "propTypes", {
    nodes: _propTypes.default.array.isRequired,
    issueish: _propTypes.default.object.isRequired,
    switchToIssueish: _propTypes.default.func.isRequired
  }), _class;
}

const timelineItems = {
  PullRequestCommit: _commitsView.default,
  PullRequestCommitCommentThread: collectionRenderer(_commitCommentThreadView.default, false),
  IssueComment: collectionRenderer(_issueCommentView.default, false),
  MergedEvent: collectionRenderer(_mergedEventView.default),
  HeadRefForcePushedEvent: collectionRenderer(_headRefForcePushedEventView.default),
  CrossReferencedEvent: _crossReferencedEventsView.default
};
const TimelineConnectionPropType = (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.shape({
  __typename: _propTypes.default.string.isRequired
})).isRequired;

class IssueishTimelineView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'loadMore');
  }

  loadMore() {
    this.props.relay.loadMore(10, () => {
      this.forceUpdate();
    });
    this.forceUpdate();
  }

  render() {
    const issueish = this.props.issue || this.props.pullRequest;
    const groupedEdges = this.groupEdges(issueish.timelineItems.edges);
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-PrTimeline"
    }, groupedEdges.map(({
      type,
      edges
    }) => {
      const Component = timelineItems[type];
      const propsForCommits = {
        onBranch: this.props.onBranch,
        openCommit: this.props.openCommit
      };

      if (Component) {
        return /*#__PURE__*/_react.default.createElement(Component, _extends({
          key: `${type}-${edges[0].cursor}`,
          nodes: edges.map(e => e.node),
          issueish: issueish,
          switchToIssueish: this.props.switchToIssueish
        }, Component === _commitsView.default && propsForCommits));
      } else {
        // eslint-disable-next-line no-console
        console.warn(`unrecognized timeline event type: ${type}`);
        return null;
      }
    }), this.renderLoadMore());
  }

  renderLoadMore() {
    if (!this.props.relay.hasMore()) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-PrTimeline-loadMore"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "github-PrTimeline-loadMoreButton btn",
      onClick: this.loadMore
    }, this.props.relay.isLoading() ? /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "ellipsis"
    }) : 'Load More'));
  }

  groupEdges(edges) {
    let currentGroup;
    const groupedEdges = [];
    let lastEdgeType;
    edges.forEach(({
      node,
      cursor
    }) => {
      const currentEdgeType = node.__typename;

      if (currentEdgeType === lastEdgeType) {
        currentGroup.edges.push({
          node,
          cursor
        });
      } else {
        currentGroup = {
          type: currentEdgeType,
          edges: [{
            node,
            cursor
          }]
        };
        groupedEdges.push(currentGroup);
      }

      lastEdgeType = currentEdgeType;
    });
    return groupedEdges;
  }

}

exports.default = IssueishTimelineView;

_defineProperty(IssueishTimelineView, "propTypes", {
  switchToIssueish: _propTypes.default.func.isRequired,
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  issue: _propTypes.default.shape({
    timelineItems: TimelineConnectionPropType
  }),
  pullRequest: _propTypes.default.shape({
    timelineItems: TimelineConnectionPropType
  }),
  onBranch: _propTypes.default.bool,
  openCommit: _propTypes.default.func
});

_defineProperty(IssueishTimelineView, "defaultProps", {
  onBranch: false,
  openCommit: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC10aW1lbGluZS12aWV3LmpzIl0sIm5hbWVzIjpbImNvbGxlY3Rpb25SZW5kZXJlciIsIkNvbXBvbmVudCIsInN0eWxlQXNUaW1lbGluZUl0ZW0iLCJHcm91cGVkQ29tcG9uZW50IiwiUmVhY3QiLCJnZXRGcmFnbWVudCIsImZyYWdOYW1lIiwiYXJncyIsImZyYWciLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVuZGVyIiwibm9kZXMiLCJtYXAiLCJyZW5kZXJOb2RlIiwibm9kZSIsImkiLCJpc3N1ZWlzaCIsInN3aXRjaFRvSXNzdWVpc2giLCJkaXNwbGF5TmFtZSIsIlByb3BUeXBlcyIsImFycmF5IiwiaXNSZXF1aXJlZCIsIm9iamVjdCIsImZ1bmMiLCJ0aW1lbGluZUl0ZW1zIiwiUHVsbFJlcXVlc3RDb21taXQiLCJDb21taXRzVmlldyIsIlB1bGxSZXF1ZXN0Q29tbWl0Q29tbWVudFRocmVhZCIsIkNvbW1pdENvbW1lbnRUaHJlYWRWaWV3IiwiSXNzdWVDb21tZW50IiwiSXNzdWVDb21tZW50VmlldyIsIk1lcmdlZEV2ZW50IiwiTWVyZ2VkRXZlbnRWaWV3IiwiSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnQiLCJIZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXciLCJDcm9zc1JlZmVyZW5jZWRFdmVudCIsIkNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXciLCJUaW1lbGluZUNvbm5lY3Rpb25Qcm9wVHlwZSIsInNoYXBlIiwiX190eXBlbmFtZSIsInN0cmluZyIsIklzc3VlaXNoVGltZWxpbmVWaWV3IiwibG9hZE1vcmUiLCJyZWxheSIsImZvcmNlVXBkYXRlIiwiaXNzdWUiLCJwdWxsUmVxdWVzdCIsImdyb3VwZWRFZGdlcyIsImdyb3VwRWRnZXMiLCJlZGdlcyIsInR5cGUiLCJwcm9wc0ZvckNvbW1pdHMiLCJvbkJyYW5jaCIsIm9wZW5Db21taXQiLCJjdXJzb3IiLCJlIiwiY29uc29sZSIsIndhcm4iLCJyZW5kZXJMb2FkTW9yZSIsImhhc01vcmUiLCJpc0xvYWRpbmciLCJjdXJyZW50R3JvdXAiLCJsYXN0RWRnZVR5cGUiLCJmb3JFYWNoIiwiY3VycmVudEVkZ2VUeXBlIiwicHVzaCIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRU8sU0FBU0Esa0JBQVQsQ0FBNEJDLFNBQTVCLEVBQXVDQyxtQkFBbUIsR0FBRyxJQUE3RCxFQUFtRTtBQUFBOztBQUN4RSxrQkFBTyxNQUFNQyxnQkFBTixTQUErQkMsZUFBTUgsU0FBckMsQ0FBK0M7QUFTbEMsV0FBWEksV0FBVyxDQUFDQyxRQUFELEVBQVcsR0FBR0MsSUFBZCxFQUFvQjtBQUNwQyxZQUFNQyxJQUFJLEdBQUdGLFFBQVEsS0FBSyxPQUFiLEdBQXVCLE1BQXZCLEdBQWdDQSxRQUE3QztBQUNBLGFBQU9MLFNBQVMsQ0FBQ0ksV0FBVixDQUFzQkcsSUFBdEIsRUFBNEIsR0FBR0QsSUFBL0IsQ0FBUDtBQUNEOztBQUVERSxJQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixZQUFNQSxLQUFOO0FBQ0EsNkJBQVMsSUFBVCxFQUFlLFlBQWY7QUFDRDs7QUFFREMsSUFBQUEsTUFBTSxHQUFHO0FBQ1AsMEJBQU87QUFBSyxRQUFBLFNBQVMsRUFBRVQsbUJBQW1CLEdBQUcsZUFBSCxHQUFxQjtBQUF4RCxTQUE2RCxLQUFLUSxLQUFMLENBQVdFLEtBQVgsQ0FBaUJDLEdBQWpCLENBQXFCLEtBQUtDLFVBQTFCLENBQTdELENBQVA7QUFDRDs7QUFFREEsSUFBQUEsVUFBVSxDQUFDQyxJQUFELEVBQU9DLENBQVAsRUFBVTtBQUNsQiwwQkFDRSw2QkFBQyxTQUFEO0FBQ0UsUUFBQSxHQUFHLEVBQUVBLENBRFA7QUFFRSxRQUFBLElBQUksRUFBRUQsSUFGUjtBQUdFLFFBQUEsUUFBUSxFQUFFLEtBQUtMLEtBQUwsQ0FBV08sUUFIdkI7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RE87QUFFYmYsVUFBQUEsS0FBSyxFQUFFLENBQUM7QUFBQ25DLFlBQUFBLElBQUQ7QUFBT3dDLFlBQUFBO0FBQVAsV0FBRDtBQUZNLFNBQWY7QUFJQVAsUUFBQUEsWUFBWSxDQUFDa0IsSUFBYixDQUFrQkosWUFBbEI7QUFDRDs7QUFDREMsTUFBQUEsWUFBWSxHQUFHRSxlQUFmO0FBQ0QsS0FaRDtBQWFBLFdBQU9qQixZQUFQO0FBQ0Q7O0FBbkcrRDs7OztnQkFBN0NOLG9CLGVBQ0E7QUFDakJ4QixFQUFBQSxnQkFBZ0IsRUFBRUUsbUJBQVVJLElBQVYsQ0FBZUYsVUFEaEI7QUFFakJzQixFQUFBQSxLQUFLLEVBQUV4QixtQkFBVW1CLEtBQVYsQ0FBZ0I7QUFDckJxQixJQUFBQSxPQUFPLEVBQUV4QyxtQkFBVUksSUFBVixDQUFlRixVQURIO0FBRXJCcUIsSUFBQUEsUUFBUSxFQUFFdkIsbUJBQVVJLElBQVYsQ0FBZUYsVUFGSjtBQUdyQnVDLElBQUFBLFNBQVMsRUFBRXpDLG1CQUFVSSxJQUFWLENBQWVGO0FBSEwsR0FBaEIsRUFJSkEsVUFOYztBQU9qQndCLEVBQUFBLEtBQUssRUFBRTFCLG1CQUFVbUIsS0FBVixDQUFnQjtBQUNyQmQsSUFBQUEsYUFBYSxFQUFFYTtBQURNLEdBQWhCLENBUFU7QUFVakJTLEVBQUFBLFdBQVcsRUFBRTNCLG1CQUFVbUIsS0FBVixDQUFnQjtBQUMzQmQsSUFBQUEsYUFBYSxFQUFFYTtBQURZLEdBQWhCLENBVkk7QUFhakJlLEVBQUFBLFFBQVEsRUFBRWpDLG1CQUFVK0MsSUFiSDtBQWNqQmIsRUFBQUEsVUFBVSxFQUFFbEMsbUJBQVVJO0FBZEwsQzs7Z0JBREFrQixvQixrQkFrQkc7QUFDcEJXLEVBQUFBLFFBQVEsRUFBRSxLQURVO0FBRXBCQyxFQUFBQSxVQUFVLEVBQUUsTUFBTSxDQUFFO0FBRkEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBDb21taXRzVmlldyBmcm9tICcuL3RpbWVsaW5lLWl0ZW1zL2NvbW1pdHMtdmlldy5qcyc7XG5pbXBvcnQgSXNzdWVDb21tZW50VmlldyBmcm9tICcuL3RpbWVsaW5lLWl0ZW1zL2lzc3VlLWNvbW1lbnQtdmlldy5qcyc7XG5pbXBvcnQgTWVyZ2VkRXZlbnRWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvbWVyZ2VkLWV2ZW50LXZpZXcuanMnO1xuaW1wb3J0IEhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50VmlldyBmcm9tICcuL3RpbWVsaW5lLWl0ZW1zL2hlYWQtcmVmLWZvcmNlLXB1c2hlZC1ldmVudC12aWV3LmpzJztcbmltcG9ydCBDcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvY3Jvc3MtcmVmZXJlbmNlZC1ldmVudHMtdmlldy5qcyc7XG5pbXBvcnQgQ29tbWl0Q29tbWVudFRocmVhZFZpZXcgZnJvbSAnLi90aW1lbGluZS1pdGVtcy9jb21taXQtY29tbWVudC10aHJlYWQtdmlldyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0aW9uUmVuZGVyZXIoQ29tcG9uZW50LCBzdHlsZUFzVGltZWxpbmVJdGVtID0gdHJ1ZSkge1xuICByZXR1cm4gY2xhc3MgR3JvdXBlZENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgc3RhdGljIGRpc3BsYXlOYW1lID0gYEdyb3VwZWQoJHtDb21wb25lbnQucmVuZGVyID8gQ29tcG9uZW50LnJlbmRlci5kaXNwbGF5TmFtZSA6IENvbXBvbmVudC5kaXNwbGF5TmFtZX0pYFxuXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIG5vZGVzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgIGlzc3VlaXNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRGcmFnbWVudChmcmFnTmFtZSwgLi4uYXJncykge1xuICAgICAgY29uc3QgZnJhZyA9IGZyYWdOYW1lID09PSAnbm9kZXMnID8gJ2l0ZW0nIDogZnJhZ05hbWU7XG4gICAgICByZXR1cm4gQ29tcG9uZW50LmdldEZyYWdtZW50KGZyYWcsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcyk7XG4gICAgICBhdXRvYmluZCh0aGlzLCAncmVuZGVyTm9kZScpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17c3R5bGVBc1RpbWVsaW5lSXRlbSA/ICd0aW1lbGluZS1pdGVtJyA6ICcnfT57dGhpcy5wcm9wcy5ub2Rlcy5tYXAodGhpcy5yZW5kZXJOb2RlKX08L2Rpdj47XG4gICAgfVxuXG4gICAgcmVuZGVyTm9kZShub2RlLCBpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tcG9uZW50XG4gICAgICAgICAga2V5PXtpfVxuICAgICAgICAgIGl0ZW09e25vZGV9XG4gICAgICAgICAgaXNzdWVpc2g9e3RoaXMucHJvcHMuaXNzdWVpc2h9XG4gICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHRpbWVsaW5lSXRlbXMgPSB7XG4gIFB1bGxSZXF1ZXN0Q29tbWl0OiBDb21taXRzVmlldyxcbiAgUHVsbFJlcXVlc3RDb21taXRDb21tZW50VGhyZWFkOiBjb2xsZWN0aW9uUmVuZGVyZXIoQ29tbWl0Q29tbWVudFRocmVhZFZpZXcsIGZhbHNlKSxcbiAgSXNzdWVDb21tZW50OiBjb2xsZWN0aW9uUmVuZGVyZXIoSXNzdWVDb21tZW50VmlldywgZmFsc2UpLFxuICBNZXJnZWRFdmVudDogY29sbGVjdGlvblJlbmRlcmVyKE1lcmdlZEV2ZW50VmlldyksXG4gIEhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50OiBjb2xsZWN0aW9uUmVuZGVyZXIoSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3KSxcbiAgQ3Jvc3NSZWZlcmVuY2VkRXZlbnQ6IENyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXcsXG59O1xuXG5jb25zdCBUaW1lbGluZUNvbm5lY3Rpb25Qcm9wVHlwZSA9IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfSksXG4pLmlzUmVxdWlyZWQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlaXNoVGltZWxpbmVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgaXNzdWU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aW1lbGluZUl0ZW1zOiBUaW1lbGluZUNvbm5lY3Rpb25Qcm9wVHlwZSxcbiAgICB9KSxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRpbWVsaW5lSXRlbXM6IFRpbWVsaW5lQ29ubmVjdGlvblByb3BUeXBlLFxuICAgIH0pLFxuICAgIG9uQnJhbmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBvcGVuQ29tbWl0OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25CcmFuY2g6IGZhbHNlLFxuICAgIG9wZW5Db21taXQ6ICgpID0+IHt9LFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2xvYWRNb3JlJyk7XG4gIH1cblxuICBsb2FkTW9yZSgpIHtcbiAgICB0aGlzLnByb3BzLnJlbGF5LmxvYWRNb3JlKDEwLCAoKSA9PiB7XG4gICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgfSk7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzc3VlaXNoID0gdGhpcy5wcm9wcy5pc3N1ZSB8fCB0aGlzLnByb3BzLnB1bGxSZXF1ZXN0O1xuICAgIGNvbnN0IGdyb3VwZWRFZGdlcyA9IHRoaXMuZ3JvdXBFZGdlcyhpc3N1ZWlzaC50aW1lbGluZUl0ZW1zLmVkZ2VzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUHJUaW1lbGluZVwiPlxuICAgICAgICB7Z3JvdXBlZEVkZ2VzLm1hcCgoe3R5cGUsIGVkZ2VzfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IENvbXBvbmVudCA9IHRpbWVsaW5lSXRlbXNbdHlwZV07XG4gICAgICAgICAgY29uc3QgcHJvcHNGb3JDb21taXRzID0ge1xuICAgICAgICAgICAgb25CcmFuY2g6IHRoaXMucHJvcHMub25CcmFuY2gsXG4gICAgICAgICAgICBvcGVuQ29tbWl0OiB0aGlzLnByb3BzLm9wZW5Db21taXQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Q29tcG9uZW50XG4gICAgICAgICAgICAgICAga2V5PXtgJHt0eXBlfS0ke2VkZ2VzWzBdLmN1cnNvcn1gfVxuICAgICAgICAgICAgICAgIG5vZGVzPXtlZGdlcy5tYXAoZSA9PiBlLm5vZGUpfVxuICAgICAgICAgICAgICAgIGlzc3VlaXNoPXtpc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgICAgICAgey4uLihDb21wb25lbnQgPT09IENvbW1pdHNWaWV3ICYmIHByb3BzRm9yQ29tbWl0cyl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS53YXJuKGB1bnJlY29nbml6ZWQgdGltZWxpbmUgZXZlbnQgdHlwZTogJHt0eXBlfWApO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgICAge3RoaXMucmVuZGVyTG9hZE1vcmUoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJMb2FkTW9yZSgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucmVsYXkuaGFzTW9yZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUHJUaW1lbGluZS1sb2FkTW9yZVwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1QclRpbWVsaW5lLWxvYWRNb3JlQnV0dG9uIGJ0blwiIG9uQ2xpY2s9e3RoaXMubG9hZE1vcmV9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlbGF5LmlzTG9hZGluZygpID8gPE9jdGljb24gaWNvbj1cImVsbGlwc2lzXCIgLz4gOiAnTG9hZCBNb3JlJ31cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZ3JvdXBFZGdlcyhlZGdlcykge1xuICAgIGxldCBjdXJyZW50R3JvdXA7XG4gICAgY29uc3QgZ3JvdXBlZEVkZ2VzID0gW107XG4gICAgbGV0IGxhc3RFZGdlVHlwZTtcbiAgICBlZGdlcy5mb3JFYWNoKCh7bm9kZSwgY3Vyc29yfSkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEVkZ2VUeXBlID0gbm9kZS5fX3R5cGVuYW1lO1xuICAgICAgaWYgKGN1cnJlbnRFZGdlVHlwZSA9PT0gbGFzdEVkZ2VUeXBlKSB7XG4gICAgICAgIGN1cnJlbnRHcm91cC5lZGdlcy5wdXNoKHtub2RlLCBjdXJzb3J9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRHcm91cCA9IHtcbiAgICAgICAgICB0eXBlOiBjdXJyZW50RWRnZVR5cGUsXG4gICAgICAgICAgZWRnZXM6IFt7bm9kZSwgY3Vyc29yfV0sXG4gICAgICAgIH07XG4gICAgICAgIGdyb3VwZWRFZGdlcy5wdXNoKGN1cnJlbnRHcm91cCk7XG4gICAgICB9XG4gICAgICBsYXN0RWRnZVR5cGUgPSBjdXJyZW50RWRnZVR5cGU7XG4gICAgfSk7XG4gICAgcmV0dXJuIGdyb3VwZWRFZGdlcztcbiAgfVxufVxuIl19