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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC10aW1lbGluZS12aWV3LmpzIl0sIm5hbWVzIjpbImNvbGxlY3Rpb25SZW5kZXJlciIsIkNvbXBvbmVudCIsInN0eWxlQXNUaW1lbGluZUl0ZW0iLCJHcm91cGVkQ29tcG9uZW50IiwiUmVhY3QiLCJnZXRGcmFnbWVudCIsImZyYWdOYW1lIiwiYXJncyIsImZyYWciLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVuZGVyIiwibm9kZXMiLCJtYXAiLCJyZW5kZXJOb2RlIiwibm9kZSIsImkiLCJpc3N1ZWlzaCIsInN3aXRjaFRvSXNzdWVpc2giLCJkaXNwbGF5TmFtZSIsIlByb3BUeXBlcyIsImFycmF5IiwiaXNSZXF1aXJlZCIsIm9iamVjdCIsImZ1bmMiLCJ0aW1lbGluZUl0ZW1zIiwiUHVsbFJlcXVlc3RDb21taXQiLCJDb21taXRzVmlldyIsIlB1bGxSZXF1ZXN0Q29tbWl0Q29tbWVudFRocmVhZCIsIkNvbW1pdENvbW1lbnRUaHJlYWRWaWV3IiwiSXNzdWVDb21tZW50IiwiSXNzdWVDb21tZW50VmlldyIsIk1lcmdlZEV2ZW50IiwiTWVyZ2VkRXZlbnRWaWV3IiwiSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnQiLCJIZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXciLCJDcm9zc1JlZmVyZW5jZWRFdmVudCIsIkNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXciLCJUaW1lbGluZUNvbm5lY3Rpb25Qcm9wVHlwZSIsInNoYXBlIiwiX190eXBlbmFtZSIsInN0cmluZyIsIklzc3VlaXNoVGltZWxpbmVWaWV3IiwibG9hZE1vcmUiLCJyZWxheSIsImZvcmNlVXBkYXRlIiwiaXNzdWUiLCJwdWxsUmVxdWVzdCIsImdyb3VwZWRFZGdlcyIsImdyb3VwRWRnZXMiLCJlZGdlcyIsInR5cGUiLCJwcm9wc0ZvckNvbW1pdHMiLCJvbkJyYW5jaCIsIm9wZW5Db21taXQiLCJjdXJzb3IiLCJlIiwiY29uc29sZSIsIndhcm4iLCJyZW5kZXJMb2FkTW9yZSIsImhhc01vcmUiLCJpc0xvYWRpbmciLCJjdXJyZW50R3JvdXAiLCJsYXN0RWRnZVR5cGUiLCJmb3JFYWNoIiwiY3VycmVudEVkZ2VUeXBlIiwicHVzaCIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRU8sU0FBU0Esa0JBQVQsQ0FBNEJDLFNBQTVCLEVBQXVDQyxtQkFBbUIsR0FBRyxJQUE3RCxFQUFtRTtBQUFBOztBQUN4RSxrQkFBTyxNQUFNQyxnQkFBTixTQUErQkMsZUFBTUgsU0FBckMsQ0FBK0M7QUFTbEMsV0FBWEksV0FBVyxDQUFDQyxRQUFELEVBQVcsR0FBR0MsSUFBZCxFQUFvQjtBQUNwQyxZQUFNQyxJQUFJLEdBQUdGLFFBQVEsS0FBSyxPQUFiLEdBQXVCLE1BQXZCLEdBQWdDQSxRQUE3QztBQUNBLGFBQU9MLFNBQVMsQ0FBQ0ksV0FBVixDQUFzQkcsSUFBdEIsRUFBNEIsR0FBR0QsSUFBL0IsQ0FBUDtBQUNEOztBQUVERSxJQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixZQUFNQSxLQUFOO0FBQ0EsNkJBQVMsSUFBVCxFQUFlLFlBQWY7QUFDRDs7QUFFREMsSUFBQUEsTUFBTSxHQUFHO0FBQ1AsYUFBTztBQUFLLFFBQUEsU0FBUyxFQUFFVCxtQkFBbUIsR0FBRyxlQUFILEdBQXFCO0FBQXhELFNBQTZELEtBQUtRLEtBQUwsQ0FBV0UsS0FBWCxDQUFpQkMsR0FBakIsQ0FBcUIsS0FBS0MsVUFBMUIsQ0FBN0QsQ0FBUDtBQUNEOztBQUVEQSxJQUFBQSxVQUFVLENBQUNDLElBQUQsRUFBT0MsQ0FBUCxFQUFVO0FBQ2xCLGFBQ0UsNkJBQUMsU0FBRDtBQUNFLFFBQUEsR0FBRyxFQUFFQSxDQURQO0FBRUUsUUFBQSxJQUFJLEVBQUVELElBRlI7QUFHRSxRQUFBLFFBQVEsRUFBRSxLQUFLTCxLQUFMLENBQVdPLFFBSHZCO0FB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ZixVQUFBQSxLQUFLLEVBQUUsQ0FBQztBQUFDbkMsWUFBQUEsSUFBRDtBQUFPd0MsWUFBQUE7QUFBUCxXQUFEO0FBRk0sU0FBZjtBQUlBUCxRQUFBQSxZQUFZLENBQUNrQixJQUFiLENBQWtCSixZQUFsQjtBQUNEOztBQUNEQyxNQUFBQSxZQUFZLEdBQUdFLGVBQWY7QUFDRCxLQVpEO0FBYUEsV0FBT2pCLFlBQVA7QUFDRDs7QUFuRytEOzs7O2dCQUE3Q04sb0IsZUFDQTtBQUNqQnhCLEVBQUFBLGdCQUFnQixFQUFFRSxtQkFBVUksSUFBVixDQUFlRixVQURoQjtBQUVqQnNCLEVBQUFBLEtBQUssRUFBRXhCLG1CQUFVbUIsS0FBVixDQUFnQjtBQUNyQnFCLElBQUFBLE9BQU8sRUFBRXhDLG1CQUFVSSxJQUFWLENBQWVGLFVBREg7QUFFckJxQixJQUFBQSxRQUFRLEVBQUV2QixtQkFBVUksSUFBVixDQUFlRixVQUZKO0FBR3JCdUMsSUFBQUEsU0FBUyxFQUFFekMsbUJBQVVJLElBQVYsQ0FBZUY7QUFITCxHQUFoQixFQUlKQSxVQU5jO0FBT2pCd0IsRUFBQUEsS0FBSyxFQUFFMUIsbUJBQVVtQixLQUFWLENBQWdCO0FBQ3JCZCxJQUFBQSxhQUFhLEVBQUVhO0FBRE0sR0FBaEIsQ0FQVTtBQVVqQlMsRUFBQUEsV0FBVyxFQUFFM0IsbUJBQVVtQixLQUFWLENBQWdCO0FBQzNCZCxJQUFBQSxhQUFhLEVBQUVhO0FBRFksR0FBaEIsQ0FWSTtBQWFqQmUsRUFBQUEsUUFBUSxFQUFFakMsbUJBQVUrQyxJQWJIO0FBY2pCYixFQUFBQSxVQUFVLEVBQUVsQyxtQkFBVUk7QUFkTCxDOztnQkFEQWtCLG9CLGtCQWtCRztBQUNwQlcsRUFBQUEsUUFBUSxFQUFFLEtBRFU7QUFFcEJDLEVBQUFBLFVBQVUsRUFBRSxNQUFNLENBQUU7QUFGQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7UmVsYXlDb25uZWN0aW9uUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IENvbW1pdHNWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvY29tbWl0cy12aWV3LmpzJztcbmltcG9ydCBJc3N1ZUNvbW1lbnRWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvaXNzdWUtY29tbWVudC12aWV3LmpzJztcbmltcG9ydCBNZXJnZWRFdmVudFZpZXcgZnJvbSAnLi90aW1lbGluZS1pdGVtcy9tZXJnZWQtZXZlbnQtdmlldy5qcyc7XG5pbXBvcnQgSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3IGZyb20gJy4vdGltZWxpbmUtaXRlbXMvaGVhZC1yZWYtZm9yY2UtcHVzaGVkLWV2ZW50LXZpZXcuanMnO1xuaW1wb3J0IENyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXcgZnJvbSAnLi90aW1lbGluZS1pdGVtcy9jcm9zcy1yZWZlcmVuY2VkLWV2ZW50cy12aWV3LmpzJztcbmltcG9ydCBDb21taXRDb21tZW50VGhyZWFkVmlldyBmcm9tICcuL3RpbWVsaW5lLWl0ZW1zL2NvbW1pdC1jb21tZW50LXRocmVhZC12aWV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3Rpb25SZW5kZXJlcihDb21wb25lbnQsIHN0eWxlQXNUaW1lbGluZUl0ZW0gPSB0cnVlKSB7XG4gIHJldHVybiBjbGFzcyBHcm91cGVkQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgZGlzcGxheU5hbWUgPSBgR3JvdXBlZCgke0NvbXBvbmVudC5yZW5kZXIgPyBDb21wb25lbnQucmVuZGVyLmRpc3BsYXlOYW1lIDogQ29tcG9uZW50LmRpc3BsYXlOYW1lfSlgXG5cbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgbm9kZXM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgaXNzdWVpc2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfVxuXG4gICAgc3RhdGljIGdldEZyYWdtZW50KGZyYWdOYW1lLCAuLi5hcmdzKSB7XG4gICAgICBjb25zdCBmcmFnID0gZnJhZ05hbWUgPT09ICdub2RlcycgPyAnaXRlbScgOiBmcmFnTmFtZTtcbiAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0RnJhZ21lbnQoZnJhZywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJOb2RlJyk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtzdHlsZUFzVGltZWxpbmVJdGVtID8gJ3RpbWVsaW5lLWl0ZW0nIDogJyd9Pnt0aGlzLnByb3BzLm5vZGVzLm1hcCh0aGlzLnJlbmRlck5vZGUpfTwvZGl2PjtcbiAgICB9XG5cbiAgICByZW5kZXJOb2RlKG5vZGUsIGkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb21wb25lbnRcbiAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgaXRlbT17bm9kZX1cbiAgICAgICAgICBpc3N1ZWlzaD17dGhpcy5wcm9wcy5pc3N1ZWlzaH1cbiAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdGltZWxpbmVJdGVtcyA9IHtcbiAgUHVsbFJlcXVlc3RDb21taXQ6IENvbW1pdHNWaWV3LFxuICBQdWxsUmVxdWVzdENvbW1pdENvbW1lbnRUaHJlYWQ6IGNvbGxlY3Rpb25SZW5kZXJlcihDb21taXRDb21tZW50VGhyZWFkVmlldywgZmFsc2UpLFxuICBJc3N1ZUNvbW1lbnQ6IGNvbGxlY3Rpb25SZW5kZXJlcihJc3N1ZUNvbW1lbnRWaWV3LCBmYWxzZSksXG4gIE1lcmdlZEV2ZW50OiBjb2xsZWN0aW9uUmVuZGVyZXIoTWVyZ2VkRXZlbnRWaWV3KSxcbiAgSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnQ6IGNvbGxlY3Rpb25SZW5kZXJlcihIZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXcpLFxuICBDcm9zc1JlZmVyZW5jZWRFdmVudDogQ3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlldyxcbn07XG5cbmNvbnN0IFRpbWVsaW5lQ29ubmVjdGlvblByb3BUeXBlID0gUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUoXG4gIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgX190eXBlbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9KSxcbikuaXNSZXF1aXJlZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVpc2hUaW1lbGluZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBpc3N1ZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRpbWVsaW5lSXRlbXM6IFRpbWVsaW5lQ29ubmVjdGlvblByb3BUeXBlLFxuICAgIH0pLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGltZWxpbmVJdGVtczogVGltZWxpbmVDb25uZWN0aW9uUHJvcFR5cGUsXG4gICAgfSksXG4gICAgb25CcmFuY2g6IFByb3BUeXBlcy5ib29sLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbkJyYW5jaDogZmFsc2UsXG4gICAgb3BlbkNvbW1pdDogKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnbG9hZE1vcmUnKTtcbiAgfVxuXG4gIGxvYWRNb3JlKCkge1xuICAgIHRoaXMucHJvcHMucmVsYXkubG9hZE1vcmUoMTAsICgpID0+IHtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNzdWVpc2ggPSB0aGlzLnByb3BzLmlzc3VlIHx8IHRoaXMucHJvcHMucHVsbFJlcXVlc3Q7XG4gICAgY29uc3QgZ3JvdXBlZEVkZ2VzID0gdGhpcy5ncm91cEVkZ2VzKGlzc3VlaXNoLnRpbWVsaW5lSXRlbXMuZWRnZXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QclRpbWVsaW5lXCI+XG4gICAgICAgIHtncm91cGVkRWRnZXMubWFwKCh7dHlwZSwgZWRnZXN9KSA9PiB7XG4gICAgICAgICAgY29uc3QgQ29tcG9uZW50ID0gdGltZWxpbmVJdGVtc1t0eXBlXTtcbiAgICAgICAgICBjb25zdCBwcm9wc0ZvckNvbW1pdHMgPSB7XG4gICAgICAgICAgICBvbkJyYW5jaDogdGhpcy5wcm9wcy5vbkJyYW5jaCxcbiAgICAgICAgICAgIG9wZW5Db21taXQ6IHRoaXMucHJvcHMub3BlbkNvbW1pdCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDb21wb25lbnRcbiAgICAgICAgICAgICAgICBrZXk9e2Ake3R5cGV9LSR7ZWRnZXNbMF0uY3Vyc29yfWB9XG4gICAgICAgICAgICAgICAgbm9kZXM9e2VkZ2VzLm1hcChlID0+IGUubm9kZSl9XG4gICAgICAgICAgICAgICAgaXNzdWVpc2g9e2lzc3VlaXNofVxuICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICB7Li4uKENvbXBvbmVudCA9PT0gQ29tbWl0c1ZpZXcgJiYgcHJvcHNGb3JDb21taXRzKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYHVucmVjb2duaXplZCB0aW1lbGluZSBldmVudCB0eXBlOiAke3R5cGV9YCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgICB7dGhpcy5yZW5kZXJMb2FkTW9yZSgpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxvYWRNb3JlKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QclRpbWVsaW5lLWxvYWRNb3JlXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVByVGltZWxpbmUtbG9hZE1vcmVCdXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5sb2FkTW9yZX0+XG4gICAgICAgICAge3RoaXMucHJvcHMucmVsYXkuaXNMb2FkaW5nKCkgPyA8T2N0aWNvbiBpY29uPVwiZWxsaXBzaXNcIiAvPiA6ICdMb2FkIE1vcmUnfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBncm91cEVkZ2VzKGVkZ2VzKSB7XG4gICAgbGV0IGN1cnJlbnRHcm91cDtcbiAgICBjb25zdCBncm91cGVkRWRnZXMgPSBbXTtcbiAgICBsZXQgbGFzdEVkZ2VUeXBlO1xuICAgIGVkZ2VzLmZvckVhY2goKHtub2RlLCBjdXJzb3J9KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RWRnZVR5cGUgPSBub2RlLl9fdHlwZW5hbWU7XG4gICAgICBpZiAoY3VycmVudEVkZ2VUeXBlID09PSBsYXN0RWRnZVR5cGUpIHtcbiAgICAgICAgY3VycmVudEdyb3VwLmVkZ2VzLnB1c2goe25vZGUsIGN1cnNvcn0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEdyb3VwID0ge1xuICAgICAgICAgIHR5cGU6IGN1cnJlbnRFZGdlVHlwZSxcbiAgICAgICAgICBlZGdlczogW3tub2RlLCBjdXJzb3J9XSxcbiAgICAgICAgfTtcbiAgICAgICAgZ3JvdXBlZEVkZ2VzLnB1c2goY3VycmVudEdyb3VwKTtcbiAgICAgIH1cbiAgICAgIGxhc3RFZGdlVHlwZSA9IGN1cnJlbnRFZGdlVHlwZTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBlZEVkZ2VzO1xuICB9XG59XG4iXX0=