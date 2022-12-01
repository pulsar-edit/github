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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    }); // auto-refresh disabled for now until pagination is handled
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZS1kZXRhaWwtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlSXNzdWVEZXRhaWxWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZWZyZXNoaW5nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVmcmVzaGVyIiwicmVmcmVzaE5vdyIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJzdGF0ZSIsInNldFN0YXRlIiwicHJvcHMiLCJyZWxheSIsInJlZmV0Y2giLCJyZXBvSWQiLCJyZXBvc2l0b3J5IiwiaWQiLCJpc3N1ZWlzaElkIiwiaXNzdWUiLCJ0aW1lbGluZUNvdW50IiwidGltZWxpbmVDdXJzb3IiLCJlcnIiLCJyZXBvcnRSZWxheUVycm9yIiwiZm9yY2UiLCJjb21wb25lbnREaWRNb3VudCIsIlBlcmlvZGljUmVmcmVzaGVyIiwiaW50ZXJ2YWwiLCJnZXRDdXJyZW50SWQiLCJyZWZyZXNoIiwibWluaW11bUludGVydmFsUGVySWQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRlc3Ryb3kiLCJyZW5kZXJJc3N1ZUJvZHkiLCJib2R5SFRNTCIsInN3aXRjaFRvSXNzdWVpc2giLCJ0b29sdGlwcyIsInJlbmRlciIsInJlcG8iLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwidXJsIiwiYXZhdGFyVXJsIiwibG9naW4iLCJ0aXRsZSIsIl9fdHlwZW5hbWUiLCJoYW5kbGVSZWZyZXNoQ2xpY2siLCJyZWNvcmRPcGVuSW5Ccm93c2VyRXZlbnQiLCJvd25lciIsIm51bWJlciIsIlByb3BUeXBlcyIsInNoYXBlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJvbmVPZiIsInJlYWN0aW9uR3JvdXBzIiwiYXJyYXlPZiIsImNvbnRlbnQiLCJ1c2VycyIsInRvdGFsQ291bnQiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFD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T2RBO0FBdEJtQixHQUFoQixFQXVCSkEsVUFwQ2M7QUFzQ2pCO0FBQ0FqQixFQUFBQSxRQUFRLEVBQUVjLG1CQUFVVyxNQUFWLENBQWlCUixVQXZDVjtBQXlDakI7QUFDQTlCLEVBQUFBLGdCQUFnQixFQUFFMkIsbUJBQVVFLElBQVYsQ0FBZUM7QUExQ2hCLEM7O2VBeUtOLHdDQUF1QnZELG1CQUF2QixFQUE0QztBQUN6RGtCLEVBQUFBLFVBQVU7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxHQUQrQztBQVd6REcsRUFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBWG9ELENBQTVDO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVJlZmV0Y2hDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBJc3N1ZVRpbWVsaW5lQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9pc3N1ZS10aW1lbGluZS1jb250cm9sbGVyJztcbmltcG9ydCBFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZW1vamktcmVhY3Rpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBJc3N1ZWlzaEJhZGdlIGZyb20gJy4uL3ZpZXdzL2lzc3VlaXNoLWJhZGdlJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuLi92aWV3cy9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBQZXJpb2RpY1JlZnJlc2hlciBmcm9tICcuLi9wZXJpb2RpYy1yZWZyZXNoZXInO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHtHSE9TVF9VU0VSfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIEJhcmVJc3N1ZURldGFpbFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3BvbnNlXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICB9KSxcbiAgICB9KSxcbiAgICBpc3N1ZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgYm9keUhUTUw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBzdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICAgJ09QRU4nLCAnQ0xPU0VEJyxcbiAgICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgICBhdXRob3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICByZWFjdGlvbkdyb3VwczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgY29udGVudDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgIHVzZXJzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgdG90YWxDb3VudDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICAgIH0pLFxuICAgICAgKS5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIHJlZnJlc2hpbmc6IGZhbHNlLFxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoZXIgPSBuZXcgUGVyaW9kaWNSZWZyZXNoZXIoQmFyZUlzc3VlRGV0YWlsVmlldywge1xuICAgICAgaW50ZXJ2YWw6ICgpID0+IDUgKiA2MCAqIDEwMDAsXG4gICAgICBnZXRDdXJyZW50SWQ6ICgpID0+IHRoaXMucHJvcHMuaXNzdWUuaWQsXG4gICAgICByZWZyZXNoOiB0aGlzLnJlZnJlc2gsXG4gICAgICBtaW5pbXVtSW50ZXJ2YWxQZXJJZDogMiAqIDYwICogMTAwMCxcbiAgICB9KTtcbiAgICAvLyBhdXRvLXJlZnJlc2ggZGlzYWJsZWQgZm9yIG5vdyB1bnRpbCBwYWdpbmF0aW9uIGlzIGhhbmRsZWRcbiAgICAvLyB0aGlzLnJlZnJlc2hlci5zdGFydCgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgcmVuZGVySXNzdWVCb2R5KGlzc3VlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1pc3N1ZUJvZHlcIj5cbiAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgaHRtbD17aXNzdWUuYm9keUhUTUwgfHwgJzxlbT5ObyBkZXNjcmlwdGlvbiBwcm92aWRlZC48L2VtPid9XG4gICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAvPlxuICAgICAgICA8RW1vamlSZWFjdGlvbnNDb250cm9sbGVyXG4gICAgICAgICAgcmVhY3RhYmxlPXtpc3N1ZX1cbiAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgIC8+XG4gICAgICAgIDxJc3N1ZVRpbWVsaW5lQ29udHJvbGxlclxuICAgICAgICAgIGlzc3VlPXtpc3N1ZX1cbiAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlcG8gPSB0aGlzLnByb3BzLnJlcG9zaXRvcnk7XG4gICAgY29uc3QgaXNzdWUgPSB0aGlzLnByb3BzLmlzc3VlO1xuICAgIGNvbnN0IGF1dGhvciA9IGlzc3VlLmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldyBuYXRpdmUta2V5LWJpbmRpbmdzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1jb250YWluZXJcIj5cblxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJDb2x1bW5cIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1hdmF0YXJcIiBocmVmPXthdXRob3IudXJsfT5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctYXZhdGFySW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgIGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyQ29sdW1uIGlzLWZsZXhpYmxlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3cgaXMtZnVsbHdpZHRoXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy10aXRsZVwiIGhyZWY9e2lzc3VlLnVybH0+e2lzc3VlLnRpdGxlfTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoRGV0YWlsVmlldy1oZWFkZXJSb3dcIj5cbiAgICAgICAgICAgICAgICA8SXNzdWVpc2hCYWRnZSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlckJhZGdlXCJcbiAgICAgICAgICAgICAgICAgIHR5cGU9e2lzc3VlLl9fdHlwZW5hbWV9XG4gICAgICAgICAgICAgICAgICBzdGF0ZT17aXNzdWUuc3RhdGV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgaWNvbj1cInJlcG8tc3luY1wiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWhlYWRlclJlZnJlc2hCdXR0b24nLCB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5yZWZyZXNoaW5nfSl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlZnJlc2hDbGlja31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctaGVhZGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIm9wZW4gb24gR2l0SHViLmNvbVwiXG4gICAgICAgICAgICAgICAgICBocmVmPXtpc3N1ZS51cmx9IG9uQ2xpY2s9e3RoaXMucmVjb3JkT3BlbkluQnJvd3NlckV2ZW50fT5cbiAgICAgICAgICAgICAgICAgIHtyZXBvLm93bmVyLmxvZ2lufS97cmVwby5uYW1lfSN7aXNzdWUubnVtYmVyfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICAgIHt0aGlzLnJlbmRlcklzc3VlQm9keShpc3N1ZSl9XG5cbiAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaERldGFpbFZpZXctZm9vdGVyXCI+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hEZXRhaWxWaWV3LWZvb3RlckxpbmsgaWNvbiBpY29uLW1hcmstZ2l0aHViXCJcbiAgICAgICAgICAgICAgaHJlZj17aXNzdWUudXJsfT57cmVwby5vd25lci5sb2dpbn0ve3JlcG8ubmFtZX0je2lzc3VlLm51bWJlcn1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Zvb3Rlcj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVSZWZyZXNoQ2xpY2sgPSBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5yZWZyZXNoZXIucmVmcmVzaE5vdyh0cnVlKTtcbiAgfVxuXG4gIHJlY29yZE9wZW5JbkJyb3dzZXJFdmVudCA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnb3Blbi1pc3N1ZS1pbi1icm93c2VyJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgcmVmcmVzaCA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWZyZXNoaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVmcmVzaGluZzogdHJ1ZX0pO1xuICAgIHRoaXMucHJvcHMucmVsYXkucmVmZXRjaCh7XG4gICAgICByZXBvSWQ6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5pZCxcbiAgICAgIGlzc3VlaXNoSWQ6IHRoaXMucHJvcHMuaXNzdWUuaWQsXG4gICAgICB0aW1lbGluZUNvdW50OiAxMDAsXG4gICAgICB0aW1lbGluZUN1cnNvcjogbnVsbCxcbiAgICB9LCBudWxsLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZWZyZXNoIGlzc3VlIGRldGFpbHMnLCBlcnIpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7cmVmcmVzaGluZzogZmFsc2V9KTtcbiAgICB9LCB7Zm9yY2U6IHRydWV9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWZldGNoQ29udGFpbmVyKEJhcmVJc3N1ZURldGFpbFZpZXcsIHtcbiAgcmVwb3NpdG9yeTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBpc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcbiAgICAgIGlkXG4gICAgICBuYW1lXG4gICAgICBvd25lciB7XG4gICAgICAgIGxvZ2luXG4gICAgICB9XG4gICAgfVxuICBgLFxuXG4gIGlzc3VlOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGlzc3VlRGV0YWlsVmlld19pc3N1ZSBvbiBJc3N1ZVxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgdGltZWxpbmVDb3VudDoge3R5cGU6IFwiSW50IVwifSxcbiAgICAgIHRpbWVsaW5lQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn0sXG4gICAgKSB7XG4gICAgICBpZFxuICAgICAgX190eXBlbmFtZVxuICAgICAgdXJsXG4gICAgICBzdGF0ZVxuICAgICAgbnVtYmVyXG4gICAgICB0aXRsZVxuICAgICAgYm9keUhUTUxcbiAgICAgIGF1dGhvciB7XG4gICAgICAgIGxvZ2luXG4gICAgICAgIGF2YXRhclVybFxuICAgICAgICB1cmxcbiAgICAgIH1cblxuICAgICAgLi4uaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUgQGFyZ3VtZW50cyh0aW1lbGluZUNvdW50OiAkdGltZWxpbmVDb3VudCwgdGltZWxpbmVDdXJzb3I6ICR0aW1lbGluZUN1cnNvcilcbiAgICAgIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcbiAgICB9XG4gIGAsXG59LCBncmFwaHFsYFxuICBxdWVyeSBpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnlcbiAgKFxuICAgICRyZXBvSWQ6IElEISxcbiAgICAkaXNzdWVpc2hJZDogSUQhLFxuICAgICR0aW1lbGluZUNvdW50OiBJbnQhLFxuICAgICR0aW1lbGluZUN1cnNvcjogU3RyaW5nLFxuICApIHtcbiAgICByZXBvc2l0b3J5OiBub2RlKGlkOiAkcmVwb0lkKSB7XG4gICAgICAuLi5pc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeVxuICAgIH1cblxuICAgIGlzc3VlOiBub2RlKGlkOiAkaXNzdWVpc2hJZCkge1xuICAgICAgLi4uaXNzdWVEZXRhaWxWaWV3X2lzc3VlIEBhcmd1bWVudHMoXG4gICAgICAgIHRpbWVsaW5lQ291bnQ6ICR0aW1lbGluZUNvdW50LFxuICAgICAgICB0aW1lbGluZUN1cnNvcjogJHRpbWVsaW5lQ3Vyc29yLFxuICAgICAgKVxuICAgIH1cbiAgfVxuYCk7XG4iXX0=