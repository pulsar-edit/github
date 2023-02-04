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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      return _react.default.createElement("div", {
        className: styleAsTimelineItem ? 'timeline-item' : ''
      }, this.props.nodes.map(this.renderNode));
    }
    renderNode(node, i) {
      return _react.default.createElement(Component, {
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
    return _react.default.createElement("div", {
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
        return _react.default.createElement(Component, _extends({
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
    return _react.default.createElement("div", {
      className: "github-PrTimeline-loadMore"
    }, _react.default.createElement("button", {
      className: "github-PrTimeline-loadMoreButton btn",
      onClick: this.loadMore
    }, this.props.relay.isLoading() ? _react.default.createElement(_octicon.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb2xsZWN0aW9uUmVuZGVyZXIiLCJDb21wb25lbnQiLCJzdHlsZUFzVGltZWxpbmVJdGVtIiwiR3JvdXBlZENvbXBvbmVudCIsIlJlYWN0IiwiZ2V0RnJhZ21lbnQiLCJmcmFnTmFtZSIsImFyZ3MiLCJmcmFnIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwicmVuZGVyIiwibm9kZXMiLCJtYXAiLCJyZW5kZXJOb2RlIiwibm9kZSIsImkiLCJpc3N1ZWlzaCIsInN3aXRjaFRvSXNzdWVpc2giLCJkaXNwbGF5TmFtZSIsIlByb3BUeXBlcyIsImFycmF5IiwiaXNSZXF1aXJlZCIsIm9iamVjdCIsImZ1bmMiLCJ0aW1lbGluZUl0ZW1zIiwiUHVsbFJlcXVlc3RDb21taXQiLCJDb21taXRzVmlldyIsIlB1bGxSZXF1ZXN0Q29tbWl0Q29tbWVudFRocmVhZCIsIkNvbW1pdENvbW1lbnRUaHJlYWRWaWV3IiwiSXNzdWVDb21tZW50IiwiSXNzdWVDb21tZW50VmlldyIsIk1lcmdlZEV2ZW50IiwiTWVyZ2VkRXZlbnRWaWV3IiwiSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnQiLCJIZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXciLCJDcm9zc1JlZmVyZW5jZWRFdmVudCIsIkNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXciLCJUaW1lbGluZUNvbm5lY3Rpb25Qcm9wVHlwZSIsIlJlbGF5Q29ubmVjdGlvblByb3BUeXBlIiwic2hhcGUiLCJfX3R5cGVuYW1lIiwic3RyaW5nIiwiSXNzdWVpc2hUaW1lbGluZVZpZXciLCJsb2FkTW9yZSIsInJlbGF5IiwiZm9yY2VVcGRhdGUiLCJpc3N1ZSIsInB1bGxSZXF1ZXN0IiwiZ3JvdXBlZEVkZ2VzIiwiZ3JvdXBFZGdlcyIsImVkZ2VzIiwidHlwZSIsInByb3BzRm9yQ29tbWl0cyIsIm9uQnJhbmNoIiwib3BlbkNvbW1pdCIsImN1cnNvciIsImUiLCJjb25zb2xlIiwid2FybiIsInJlbmRlckxvYWRNb3JlIiwiaGFzTW9yZSIsImlzTG9hZGluZyIsImN1cnJlbnRHcm91cCIsImxhc3RFZGdlVHlwZSIsImZvckVhY2giLCJjdXJyZW50RWRnZVR5cGUiLCJwdXNoIiwiYm9vbCJdLCJzb3VyY2VzIjpbImlzc3VlaXNoLXRpbWVsaW5lLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7UmVsYXlDb25uZWN0aW9uUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IENvbW1pdHNWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvY29tbWl0cy12aWV3LmpzJztcbmltcG9ydCBJc3N1ZUNvbW1lbnRWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvaXNzdWUtY29tbWVudC12aWV3LmpzJztcbmltcG9ydCBNZXJnZWRFdmVudFZpZXcgZnJvbSAnLi90aW1lbGluZS1pdGVtcy9tZXJnZWQtZXZlbnQtdmlldy5qcyc7XG5pbXBvcnQgSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvaGVhZC1yZWYtZm9yY2UtcHVzaGVkLWV2ZW50LXZpZXcuanMnO1xuaW1wb3J0IENyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXcgZnJvbSAnLi90aW1lbGluZS1pdGVtcy9jcm9zcy1yZWZlcmVuY2VkLWV2ZW50cy12aWV3LmpzJztcbmltcG9ydCBDb21taXRDb21tZW50VGhyZWFkVmlldyBmcm9tICcuL3RpbWVsaW5lLWl0ZW1zL2NvbW1pdC1jb21tZW50LXRocmVhZC12aWV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3Rpb25SZW5kZXJlcihDb21wb25lbnQsIHN0eWxlQXNUaW1lbGluZUl0ZW0gPSB0cnVlKSB7XG4gIHJldHVybiBjbGFzcyBHcm91cGVkQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgZGlzcGxheU5hbWUgPSBgR3JvdXBlZCgke0NvbXBvbmVudC5yZW5kZXIgPyBDb21wb25lbnQucmVuZGVyLmRpc3BsYXlOYW1lIDogQ29tcG9uZW50LmRpc3BsYXlOYW1lfSlgXG5cbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgbm9kZXM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgaXNzdWVpc2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEZyYWdtZW50KGZyYWdOYW1lLCAuLi5hcmdzKSB7XG4gICAgICBjb25zdCBmcmFnID0gZnJhZ05hbWUgPT09ICdub2RlcycgPyAnaXRlbScgOiBmcmFnTmFtZTtcbiAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0RnJhZ21lbnQoZnJhZywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJOb2RlJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtzdHlsZUFzVGltZWxpbmVJdGVtID8gJ3RpbWVsaW5lLWl0ZW0nIDogJyd9Pnt0aGlzLnByb3BzLm5vZGVzLm1hcCh0aGlzLnJlbmRlck5vZGUpfTwvZGl2PjtcbiAgICB9XG5cbiAgICByZW5kZXJOb2RlKG5vZGUsIGkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnRcbiAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgaXRlbT17bm9kZX1cbiAgICAgICAgICBpc3N1ZWlzaD17dGhpcy5wcm9wcy5pc3N1ZWlzaH1cbiAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdGltZWxpbmVJdGVtcyA9IHtcbiAgUHVsbFJlcXVlc3RDb21taXQ6IENvbW1pdHNWaWV3LFxuICBQdWxsUmVxdWVzdENvbW1pdENvbW1lbnRUaHJlYWQ6IGNvbGxlY3Rpb25SZW5kZXJlcihDb21taXRDb21tZW50VGhyZWFkVmlldywgZmFsc2UpLFxuICBJc3N1ZUNvbW1lbnQ6IGNvbGxlY3Rpb25SZW5kZXJlcihJc3N1ZUNvbW1lbnRWaWV3LCBmYWxzZSksXG4gIE1lcmdlZEV2ZW50OiBjb2xsZWN0aW9uUmVuZGVyZXIoTWVyZ2VkRXZlbnRWaWV3KSxcbiAgSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnQ6IGNvbGxlY3Rpb25SZW5kZXJlcihIZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXcpLFxuICBDcm9zc1JlZmVyZW5jZWRFdmVudDogQ3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlldyxcbn07XG5cbmNvbnN0IFRpbWVsaW5lQ29ubmVjdGlvblByb3BUeXBlID0gUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUoXG4gIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgX190eXBlbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9KSxcbikuaXNSZXF1aXJlZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVpc2hUaW1lbGluZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBpc3N1ZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRpbWVsaW5lSXRlbXM6IFRpbWVsaW5lQ29ubmVjdGlvblByb3BUeXBlLFxuICAgIH0pLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGltZWxpbmVJdGVtczogVGltZWxpbmVDb25uZWN0aW9uUHJvcFR5cGUsXG4gICAgfSksXG4gICAgb25CcmFuY2g6IFByb3BUeXBlcy5ib29sLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbkJyYW5jaDogZmFsc2UsXG4gICAgb3BlbkNvbW1pdDogKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnbG9hZE1vcmUnKTtcbiAgfVxuXG4gIGxvYWRNb3JlKCkge1xuICAgIHRoaXMucHJvcHMucmVsYXkubG9hZE1vcmUoMTAsICgpID0+IHtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNzdWVpc2ggPSB0aGlzLnByb3BzLmlzc3VlIHx8IHRoaXMucHJvcHMucHVsbFJlcXVlc3Q7XG4gICAgY29uc3QgZ3JvdXBlZEVkZ2VzID0gdGhpcy5ncm91cEVkZ2VzKGlzc3VlaXNoLnRpbWVsaW5lSXRlbXMuZWRnZXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QclRpbWVsaW5lXCI+XG4gICAgICAgIHtncm91cGVkRWRnZXMubWFwKCh7dHlwZSwgZWRnZXN9KSA9PiB7XG4gICAgICAgICAgY29uc3QgQ29tcG9uZW50ID0gdGltZWxpbmVJdGVtc1t0eXBlXTtcbiAgICAgICAgICBjb25zdCBwcm9wc0ZvckNvbW1pdHMgPSB7XG4gICAgICAgICAgICBvbkJyYW5jaDogdGhpcy5wcm9wcy5vbkJyYW5jaCxcbiAgICAgICAgICAgIG9wZW5Db21taXQ6IHRoaXMucHJvcHMub3BlbkNvbW1pdCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDb21wb25lbnRcbiAgICAgICAgICAgICAgICBrZXk9e2Ake3R5cGV9LSR7ZWRnZXNbMF0uY3Vyc29yfWB9XG4gICAgICAgICAgICAgICAgbm9kZXM9e2VkZ2VzLm1hcChlID0+IGUubm9kZSl9XG4gICAgICAgICAgICAgICAgaXNzdWVpc2g9e2lzc3VlaXNofVxuICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICB7Li4uKENvbXBvbmVudCA9PT0gQ29tbWl0c1ZpZXcgJiYgcHJvcHNGb3JDb21taXRzKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYHVucmVjb2duaXplZCB0aW1lbGluZSBldmVudCB0eXBlOiAke3R5cGV9YCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgICB7dGhpcy5yZW5kZXJMb2FkTW9yZSgpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxvYWRNb3JlKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QclRpbWVsaW5lLWxvYWRNb3JlXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVByVGltZWxpbmUtbG9hZE1vcmVCdXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5sb2FkTW9yZX0+XG4gICAgICAgICAge3RoaXMucHJvcHMucmVsYXkuaXNMb2FkaW5nKCkgPyA8T2N0aWNvbiBpY29uPVwiZWxsaXBzaXNcIiAvPiA6ICdMb2FkIE1vcmUnfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBncm91cEVkZ2VzKGVkZ2VzKSB7XG4gICAgbGV0IGN1cnJlbnRHcm91cDtcbiAgICBjb25zdCBncm91cGVkRWRnZXMgPSBbXTtcbiAgICBsZXQgbGFzdEVkZ2VUeXBlO1xuICAgIGVkZ2VzLmZvckVhY2goKHtub2RlLCBjdXJzb3J9KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RWRnZVR5cGUgPSBub2RlLl9fdHlwZW5hbWU7XG4gICAgICBpZiAoY3VycmVudEVkZ2VUeXBlID09PSBsYXN0RWRnZVR5cGUpIHtcbiAgICAgICAgY3VycmVudEdyb3VwLmVkZ2VzLnB1c2goe25vZGUsIGN1cnNvcn0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEdyb3VwID0ge1xuICAgICAgICAgIHR5cGU6IGN1cnJlbnRFZGdlVHlwZSxcbiAgICAgICAgICBlZGdlczogW3tub2RlLCBjdXJzb3J9XSxcbiAgICAgICAgfTtcbiAgICAgICAgZ3JvdXBlZEVkZ2VzLnB1c2goY3VycmVudEdyb3VwKTtcbiAgICAgIH1cbiAgICAgIGxhc3RFZGdlVHlwZSA9IGN1cnJlbnRFZGdlVHlwZTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBlZEVkZ2VzO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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