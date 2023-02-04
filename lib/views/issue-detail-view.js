"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareIssueDetailView = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _issueTimelineController = _interopRequireDefault(require("../controllers/issue-timeline-controller"));
var _emojiReactionsController = _interopRequireDefault(require("../controllers/emoji-reactions-controller"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _issueishBadge = _interopRequireDefault(require("../views/issueish-badge"));
var _githubDotcomMarkdown = _interopRequireDefault(require("../views/github-dotcom-markdown"));
var _periodicRefresher = _interopRequireDefault(require("../periodic-refresher"));
var _reporterProxy = require("../reporter-proxy");
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareIssueDetailView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      refreshing: false
    });
    _defineProperty(this, "handleRefreshClick", e => {
      e.preventDefault();
      this.refresher.refreshNow(true);
    });
    _defineProperty(this, "recordOpenInBrowserEvent", () => {
      (0, _reporterProxy.addEvent)('open-issue-in-browser', {
        package: 'github',
        component: this.constructor.name
      });
    });
    _defineProperty(this, "refresh", () => {
      if (this.state.refreshing) {
        return;
      }
      this.setState({
        refreshing: true
      });
      this.props.relay.refetch({
        repoId: this.props.repository.id,
        issueishId: this.props.issue.id,
        timelineCount: 100,
        timelineCursor: null
      }, null, err => {
        if (err) {
          this.props.reportRelayError('Unable to refresh issue details', err);
        }
        this.setState({
          refreshing: false
        });
      }, {
        force: true
      });
    });
  }
  componentDidMount() {
    this.refresher = new _periodicRefresher.default(BareIssueDetailView, {
      interval: () => 5 * 60 * 1000,
      getCurrentId: () => this.props.issue.id,
      refresh: this.refresh,
      minimumIntervalPerId: 2 * 60 * 1000
    });
    // auto-refresh disabled for now until pagination is handled
    // this.refresher.start();
  }

  componentWillUnmount() {
    this.refresher.destroy();
  }
  renderIssueBody(issue) {
    return _react.default.createElement("div", {
      className: "github-IssueishDetailView-issueBody"
    }, _react.default.createElement(_githubDotcomMarkdown.default, {
      html: issue.bodyHTML || '<em>No description provided.</em>',
      switchToIssueish: this.props.switchToIssueish
    }), _react.default.createElement(_emojiReactionsController.default, {
      reactable: issue,
      tooltips: this.props.tooltips,
      reportRelayError: this.props.reportRelayError
    }), _react.default.createElement(_issueTimelineController.default, {
      issue: issue,
      switchToIssueish: this.props.switchToIssueish
    }));
  }
  render() {
    const repo = this.props.repository;
    const issue = this.props.issue;
    const author = issue.author || _helpers.GHOST_USER;
    return _react.default.createElement("div", {
      className: "github-IssueishDetailView native-key-bindings"
    }, _react.default.createElement("div", {
      className: "github-IssueishDetailView-container"
    }, _react.default.createElement("header", {
      className: "github-IssueishDetailView-header"
    }, _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn"
    }, _react.default.createElement("a", {
      className: "github-IssueishDetailView-avatar",
      href: author.url
    }, _react.default.createElement("img", {
      className: "github-IssueishDetailView-avatarImage",
      src: author.avatarUrl,
      title: author.login,
      alt: author.login
    }))), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerColumn is-flexible"
    }, _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow is-fullwidth"
    }, _react.default.createElement("a", {
      className: "github-IssueishDetailView-title",
      href: issue.url
    }, issue.title)), _react.default.createElement("div", {
      className: "github-IssueishDetailView-headerRow"
    }, _react.default.createElement(_issueishBadge.default, {
      className: "github-IssueishDetailView-headerBadge",
      type: issue.__typename,
      state: issue.state
    }), _react.default.createElement(_octicon.default, {
      icon: "repo-sync",
      className: (0, _classnames.default)('github-IssueishDetailView-headerRefreshButton', {
        refreshing: this.state.refreshing
      }),
      onClick: this.handleRefreshClick
    }), _react.default.createElement("a", {
      className: "github-IssueishDetailView-headerLink",
      title: "open on GitHub.com",
      href: issue.url,
      onClick: this.recordOpenInBrowserEvent
    }, repo.owner.login, "/", repo.name, "#", issue.number)))), this.renderIssueBody(issue), _react.default.createElement("footer", {
      className: "github-IssueishDetailView-footer"
    }, _react.default.createElement("a", {
      className: "github-IssueishDetailView-footerLink icon icon-mark-github",
      href: issue.url
    }, repo.owner.login, "/", repo.name, "#", issue.number))));
  }
}
exports.BareIssueDetailView = BareIssueDetailView;
_defineProperty(BareIssueDetailView, "propTypes", {
  // Relay response
  relay: _propTypes.default.shape({
    refetch: _propTypes.default.func.isRequired
  }),
  switchToIssueish: _propTypes.default.func.isRequired,
  repository: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    owner: _propTypes.default.shape({
      login: _propTypes.default.string
    })
  }),
  issue: _propTypes.default.shape({
    __typename: _propTypes.default.string.isRequired,
    id: _propTypes.default.string.isRequired,
    title: _propTypes.default.string,
    url: _propTypes.default.string.isRequired,
    bodyHTML: _propTypes.default.string,
    number: _propTypes.default.number,
    state: _propTypes.default.oneOf(['OPEN', 'CLOSED']).isRequired,
    author: _propTypes.default.shape({
      login: _propTypes.default.string.isRequired,
      avatarUrl: _propTypes.default.string.isRequired,
      url: _propTypes.default.string.isRequired
    }).isRequired,
    reactionGroups: _propTypes.default.arrayOf(_propTypes.default.shape({
      content: _propTypes.default.string.isRequired,
      users: _propTypes.default.shape({
        totalCount: _propTypes.default.number.isRequired
      }).isRequired
    })).isRequired
  }).isRequired,
  // Atom environment
  tooltips: _propTypes.default.object.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createRefetchContainer)(BareIssueDetailView, {
  repository: function () {
    const node = require("./__generated__/issueDetailView_repository.graphql");
    if (node.hash && node.hash !== "295a60f53b25b6fdb07a1539cda447f2") {
      console.error("The definition of 'issueDetailView_repository' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/issueDetailView_repository.graphql");
  },
  issue: function () {
    const node = require("./__generated__/issueDetailView_issue.graphql");
    if (node.hash && node.hash !== "f7adc2e75c1d55df78481fd359bf7180") {
      console.error("The definition of 'issueDetailView_issue' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/issueDetailView_issue.graphql");
  }
}, function () {
  const node = require("./__generated__/issueDetailViewRefetchQuery.graphql");
  if (node.hash && node.hash !== "180dc18124ae95e41044932a2daf88ad") {
    console.error("The definition of 'issueDetailViewRefetchQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
  }
  return require("./__generated__/issueDetailViewRefetchQuery.graphql");
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlSXNzdWVEZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZWZyZXNoaW5nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVmcmVzaGVyIiwicmVmcmVzaE5vdyIsImFkZEV2ZW50IiwicGFja2FnZSIsImNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwibmFtZSIsInN0YXRlIiwic2V0U3RhdGUiLCJwcm9wcyIsInJlbGF5IiwicmVmZXRjaCIsInJlcG9JZCIsInJlcG9zaXRvcnkiLCJpZCIsImlzc3VlaXNoSWQiLCJpc3N1ZSIsInRpbWVsaW5lQ291bnQiLCJ0aW1lbGluZUN1cnNvciIsImVyciIsInJlcG9ydFJlbGF5RXJyb3IiLCJmb3JjZSIsImNvbXBvbmVudERpZE1vdW50IiwiUGVyaW9kaWNSZWZyZXNoZXIiLCJpbnRlcnZhbCIsImdldEN1cnJlbnRJZCIsInJlZnJlc2giLCJtaW5pbXVtSW50ZXJ2YWxQZXJJZCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsInJlbmRlcklzc3VlQm9keSIsImJvZHlIVE1MIiwic3dpdGNoVG9Jc3N1ZWlzaCIsInRvb2x0aXBzIiwicmVuZGVyIiwicmVwbyIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJ1cmwiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInRpdGxlIiwiX190eXBlbmFtZSIsImN4IiwiaGFuZGxlUmVmcmVzaENsaWNrIiwicmVjb3JkT3BlbkluQnJvd3NlckV2ZW50Iiwib3duZXIiLCJudW1iZXIiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2YiLCJyZWFjdGlvbkdyb3VwcyIsImFycmF5T2YiLCJjb250ZW50IiwidXNlcnMiLCJ0b3RhbENvdW50Iiwib2JqZWN0IiwiY3JlYXRlUmVmZXRjaENvbnRhaW5lciJdLCJzb3VyY2VzIjpbImlzc3VlLWRldGFpbC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVJlZmV0Y2hDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBJc3N1ZVRpbWVsaW5lQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9pc3N1ZS10aW1lbGluZS1jb250cm9sbGVyJztcbmltcG9ydCBFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZW1vamktcmVhY3Rpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBJc3N1ZWlzaEJhZGdlIGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLWJhZGdlJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi92aWV3cy9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBQZXJpb2RpY1JlZnJlc2hlciBmcm9tICcuLi9wZXJpb2RpYy1yZWZyZXNoZXInO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtHSE9TVF9VU0VSfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVJc3N1ZURldGFpbFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3BvbnNlXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBpc3N1ZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgYm9keUhUTUw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBzdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICAgJ09QRU4nLCAnQ0xPU0VEJyxcbiAgICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgICBhdXRob3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICByZWFjdGlvbkdyb3VwczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgY29udGVudDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgIHVzZXJzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgdG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICAgIH0pLFxuICAgICAgKS5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIHJlZnJlc2hpbmc6IGZhbHNlLFxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoZXIgPSBuZXcgUGVyaW9kaWNSZWZyZXNoZXIoQmFyZUlzc3VlRGV0YWlsVmlldywge1xuICAgICAgaW50ZXJ2YWw6ICgpID0+IDUgKiA2MCAqIDEwMDAsXG4gICAgICBnZXRDdXJyZW50SWQ6ICgpID0+IHRoaXMucHJvcHMuaXNzdWUuaWQsXG4gICAgICByZWZyZXNoOiB0aGlzLnJlZnJlc2gsXG4gICAgICBtaW5pbXVtSW50ZXJ2YWxQZXJJZDogMiAqIDYwICogMTAwMCxcbiAgICB9KTtcbiAgICAvLyBhdXRvLXJlZnJlc2ggZGlzYWJsZWQgZm9yIG5vdyB1bnRpbCBwYWdpbmF0aW9uIGlzIGhhbmRsZWRcbiAgICAvLyB0aGlzLnJlZnJlc2hlci5zdGFydCgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgcmVuZGVySXNzdWVCb2R5KGlzc3VlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1pc3N1ZUJvZHlcIj5cbiAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgaHRtbD17aXNzdWUuYm9keUhUTUwgfHwgJzxlbT5ObyBkZXNjcmlwdGlvbiBwcm92aWRlZC48L2VtPid9XG4gICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAvPlxuICAgICAgICA8RW1vamlSZWFjdGlvbnNDb250cm9sbGVyXG4gICAgICAgICAgcmVhY3RhYmxlPXtpc3N1ZX1cbiAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgIC8+XG4gICAgICAgIDxJc3N1ZVRpbWVsaW5lQ29udHJvbGxlclxuICAgICAgICAgIGlzc3VlPXtpc3N1ZX1cbiAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcG8gPSB0aGlzLnByb3BzLnJlcG9zaXRvcnk7XG4gICAgY29uc3QgaXNzdWUgPSB0aGlzLnByb3BzLmlzc3VlO1xuICAgIGNvbnN0IGF1dGhvciA9IGlzc3VlLmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldyBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jb250YWluZXJcIj5cblxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW5cIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1hdmF0YXJcIiBocmVmPXthdXRob3IudXJsfT5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYXZhdGFySW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uIGlzLWZsZXhpYmxlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3cgaXMtZnVsbHdpZHRoXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy10aXRsZVwiIGhyZWY9e2lzc3VlLnVybH0+e2lzc3VlLnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3dcIj5cbiAgICAgICAgICAgICAgICA8SXNzdWVpc2hCYWRnZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckJhZGdlXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9e2lzc3VlLl9fdHlwZW5hbWV9XG4gICAgICAgICAgICAgICAgICBzdGF0ZT17aXNzdWUuc3RhdGV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cInJlcG8tc3luY1wiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJlZnJlc2hCdXR0b24nLCB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5yZWZyZXNoaW5nfSl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlZnJlc2hDbGlja31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIm9wZW4gb24gR2l0SHViLmNvbVwiXG4gICAgICAgICAgICAgICAgICBocmVmPXtpc3N1ZS51cmx9IG9uQ2xpY2s9e3RoaXMucmVjb3JkT3BlbkluQnJvd3NlckV2ZW50fT5cbiAgICAgICAgICAgICAgICAgIHtyZXBvLm93bmVyLmxvZ2lufS97cmVwby5uYW1lfSN7aXNzdWUubnVtYmVyfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICAgIHt0aGlzLnJlbmRlcklzc3VlQm9keShpc3N1ZSl9XG5cbiAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctZm9vdGVyXCI+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWZvb3RlckxpbmsgaWNvbiBpY29uLW1hcmstZ2l0aHViXCJcbiAgICAgICAgICAgICAgaHJlZj17aXNzdWUudXJsfT57cmVwby5vd25lci5sb2dpbn0ve3JlcG8ubmFtZX0je2lzc3VlLm51bWJlcn1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Zvb3Rlcj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVSZWZyZXNoQ2xpY2sgPSBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5yZWZyZXNoZXIucmVmcmVzaE5vdyh0cnVlKTtcbiAgfVxuXG4gIHJlY29yZE9wZW5JbkJyb3dzZXJFdmVudCA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1pc3N1ZS1pbi1icm93c2VyJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgcmVmcmVzaCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWZyZXNoaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVmcmVzaGluZzogdHJ1ZX0pO1xuICAgIHRoaXMucHJvcHMucmVsYXkucmVmZXRjaCh7XG4gICAgICByZXBvSWQ6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5pZCxcbiAgICAgIGlzc3VlaXNoSWQ6IHRoaXMucHJvcHMuaXNzdWUuaWQsXG4gICAgICB0aW1lbGluZUNvdW50OiAxMDAsXG4gICAgICB0aW1lbGluZUN1cnNvcjogbnVsbCxcbiAgICB9LCBudWxsLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZWZyZXNoIGlzc3VlIGRldGFpbHMnLCBlcnIpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVmcmVzaGluZzogZmFsc2V9KTtcbiAgICB9LCB7Zm9yY2U6IHRydWV9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWZldGNoQ29udGFpbmVyKEJhcmVJc3N1ZURldGFpbFZpZXcsIHtcbiAgcmVwb3NpdG9yeTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBpc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcbiAgICAgIGlkXG4gICAgICBuYW1lXG4gICAgICBvd25lciB7XG4gICAgICAgIGxvZ2luXG4gICAgICB9XG4gICAgfVxuICBgLFxuXG4gIGlzc3VlOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGlzc3VlRGV0YWlsVmlld19pc3N1ZSBvbiBJc3N1ZVxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgdGltZWxpbmVDb3VudDoge3R5cGU6IFwiSW50IVwifSxcbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn0sXG4gICAgKSB7XG4gICAgICBpZFxuICAgICAgX190eXBlbmFtZVxuICAgICAgdXJsXG4gICAgICBzdGF0ZVxuICAgICAgbnVtYmVyXG4gICAgICB0aXRsZVxuICAgICAgYm9keUhUTUxcbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGxvZ2luXG4gICAgICAgIGF2YXRhclVybFxuICAgICAgICB1cmxcbiAgICAgIH1cblxuICAgICAgLi4uaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUgQGFyZ3VtZW50cyh0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudCwgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvcilcbiAgICAgIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcbiAgICB9XG4gIGAsXG59LCBncmFwaHFsYFxuICBxdWVyeSBpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnlcbiAgKFxuICAgICRyZXBvSWQ6IElEISxcbiAgICAkaXNzdWVpc2hJZDogSUQhLFxuICAgICR0aW1lbGluZUNvdW50OiBJbnQhLFxuICAgICR0aW1lbGluZUN1cnNvcjogU3RyaW5nLFxuICApIHtcbiAgICByZXBvc2l0b3J5OiBub2RlKGlkOiAkcmVwb0lkKSB7XG4gICAgICAuLi5pc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeVxuICAgIH1cblxuICAgIGlzc3VlOiBub2RlKGlkOiAkaXNzdWVpc2hJZCkge1xuICAgICAgLi4uaXNzdWVEZXRhaWxWaWV3X2lzc3VlIEBhcmd1bWVudHMoXG4gICAgICAgIHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LFxuICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yLFxuICAgICAgKVxuICAgIH1cbiAgfVxuYCk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFzQztBQUFBO0FBQUE7QUFBQTtBQUUvQixNQUFNQSxtQkFBbUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEsK0JBOEMvQztNQUNOQyxVQUFVLEVBQUU7SUFDZCxDQUFDO0lBQUEsNENBNkZvQkMsQ0FBQyxJQUFJO01BQ3hCQSxDQUFDLENBQUNDLGNBQWMsRUFBRTtNQUNsQixJQUFJLENBQUNDLFNBQVMsQ0FBQ0MsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQUEsa0RBRTBCLE1BQU07TUFDL0IsSUFBQUMsdUJBQVEsRUFBQyx1QkFBdUIsRUFBRTtRQUFDQyxPQUFPLEVBQUUsUUFBUTtRQUFFQyxTQUFTLEVBQUUsSUFBSSxDQUFDQyxXQUFXLENBQUNDO01BQUksQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFBQSxpQ0FFUyxNQUFNO01BQ2QsSUFBSSxJQUFJLENBQUNDLEtBQUssQ0FBQ1YsVUFBVSxFQUFFO1FBQ3pCO01BQ0Y7TUFFQSxJQUFJLENBQUNXLFFBQVEsQ0FBQztRQUFDWCxVQUFVLEVBQUU7TUFBSSxDQUFDLENBQUM7TUFDakMsSUFBSSxDQUFDWSxLQUFLLENBQUNDLEtBQUssQ0FBQ0MsT0FBTyxDQUFDO1FBQ3ZCQyxNQUFNLEVBQUUsSUFBSSxDQUFDSCxLQUFLLENBQUNJLFVBQVUsQ0FBQ0MsRUFBRTtRQUNoQ0MsVUFBVSxFQUFFLElBQUksQ0FBQ04sS0FBSyxDQUFDTyxLQUFLLENBQUNGLEVBQUU7UUFDL0JHLGFBQWEsRUFBRSxHQUFHO1FBQ2xCQyxjQUFjLEVBQUU7TUFDbEIsQ0FBQyxFQUFFLElB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