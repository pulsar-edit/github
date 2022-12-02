"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _accordion = _interopRequireDefault(require("./accordion"));

var _timeago = _interopRequireDefault(require("./timeago"));

var _statusDonutChart = _interopRequireDefault(require("./status-donut-chart"));

var _checkSuitesAccumulator = _interopRequireDefault(require("../containers/accumulators/check-suites-accumulator"));

var _queryErrorTile = _interopRequireDefault(require("./query-error-tile"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IssueishListView extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderReviewsButton", () => {
      if (!this.props.needReviewsButton || this.props.issueishes.length < 1) {
        return null;
      }

      return _react.default.createElement("button", {
        className: "btn btn-primary btn-sm github-IssueishList-openReviewsButton",
        onClick: this.openReviews
      }, "See reviews");
    });

    _defineProperty(this, "openReviews", e => {
      e.stopPropagation();
      this.props.openReviews(this.props.issueishes[0]);
    });

    _defineProperty(this, "renderIssueish", issueish => {
      return _react.default.createElement(_checkSuitesAccumulator.default, {
        commit: issueish.getLatestCommit()
      }, ({
        runsBySuite
      }) => {
        issueish.setCheckRuns(runsBySuite);
        return _react.default.createElement(_react.Fragment, null, _react.default.createElement("img", {
          className: "github-IssueishList-item github-IssueishList-item--avatar",
          src: issueish.getAuthorAvatarURL(32),
          title: issueish.getAuthorLogin(),
          alt: issueish.getAuthorLogin()
        }), _react.default.createElement("span", {
          className: "github-IssueishList-item github-IssueishList-item--title"
        }, issueish.getTitle()), _react.default.createElement("span", {
          className: "github-IssueishList-item github-IssueishList-item--number"
        }, "#", issueish.getNumber()), this.renderStatusSummary(issueish.getStatusCounts()), _react.default.createElement(_timeago.default, {
          time: issueish.getCreatedAt(),
          displayStyle: "short",
          className: "github-IssueishList-item github-IssueishList-item--age"
        }), _react.default.createElement(_octicon.default, {
          icon: "ellipses",
          className: "github-IssueishList-item github-IssueishList-item--menu",
          onClick: event => this.showActionsMenu(event, issueish)
        }));
      });
    });

    _defineProperty(this, "renderLoadingTile", () => {
      return _react.default.createElement("div", {
        className: "github-IssueishList-loading"
      }, "Loading");
    });

    _defineProperty(this, "renderEmptyTile", () => {
      if (this.props.error) {
        return _react.default.createElement(_queryErrorTile.default, {
          error: this.props.error
        });
      }

      if (this.props.emptyComponent) {
        const EmptyComponent = this.props.emptyComponent;
        return _react.default.createElement(EmptyComponent, null);
      }

      return null;
    });

    _defineProperty(this, "renderMoreTile", () => {
      /* eslint-disable jsx-a11y/anchor-is-valid */
      if (this.props.onMoreClick) {
        return _react.default.createElement("div", {
          className: "github-IssueishList-more"
        }, _react.default.createElement("a", {
          onClick: this.props.onMoreClick
        }, "More..."));
      }

      return null;
    });
  }

  render() {
    return _react.default.createElement(_accordion.default, {
      leftTitle: this.props.title,
      isLoading: this.props.isLoading,
      results: this.props.issueishes,
      total: this.props.total,
      loadingComponent: this.renderLoadingTile,
      emptyComponent: this.renderEmptyTile,
      moreComponent: this.renderMoreTile,
      reviewsButton: this.renderReviewsButton,
      onClickItem: this.props.onIssueishClick
    }, this.renderIssueish);
  }

  showActionsMenu(event, issueish) {
    event.preventDefault();
    event.stopPropagation();
    this.props.showActionsMenu(issueish);
  }

  renderStatusSummary(statusCounts) {
    if (['success', 'failure', 'pending'].every(kind => statusCounts[kind] === 0)) {
      return _react.default.createElement(_octicon.default, {
        className: "github-IssueishList-item github-IssueishList-item--status",
        icon: "dash"
      });
    }

    if (statusCounts.success > 0 && statusCounts.failure === 0 && statusCounts.pending === 0) {
      return _react.default.createElement(_octicon.default, {
        className: "github-IssueishList-item github-IssueishList-item--status",
        icon: "check"
      });
    }

    if (statusCounts.success === 0 && statusCounts.failure > 0 && statusCounts.pending === 0) {
      return _react.default.createElement(_octicon.default, {
        className: "github-IssueishList-item github-IssueishList-item--status",
        icon: "x"
      });
    }

    return _react.default.createElement(_statusDonutChart.default, _extends({}, statusCounts, {
      className: "github-IssueishList-item github-IssueishList-item--status"
    }));
  }

}

exports.default = IssueishListView;

_defineProperty(IssueishListView, "propTypes", {
  title: _propTypes.default.string.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  total: _propTypes.default.number.isRequired,
  issueishes: _propTypes.default.arrayOf(_propTypes2.IssueishPropType).isRequired,
  repository: _propTypes.default.shape({
    defaultBranchRef: _propTypes.default.shape({
      prefix: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired
    })
  }),
  needReviewsButton: _propTypes.default.bool,
  onIssueishClick: _propTypes.default.func.isRequired,
  onMoreClick: _propTypes.default.func,
  openReviews: _propTypes.default.func.isRequired,
  openOnGitHub: _propTypes.default.func.isRequired,
  showActionsMenu: _propTypes.default.func.isRequired,
  emptyComponent: _propTypes.default.func,
  error: _propTypes.default.object
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC1saXN0LXZpZXcuanMiXSwibmFtZXMiOlsiSXNzdWVpc2hMaXN0VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicHJvcHMiLCJuZWVkUmV2aWV3c0J1dHRvbiIsImlzc3VlaXNoZXMiLCJsZW5ndGgiLCJvcGVuUmV2aWV3cyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc3N1ZWlzaCIsImdldExhdGVzdENvbW1pdCIsInJ1bnNCeVN1aXRlIiwic2V0Q2hlY2tSdW5zIiwiZ2V0QXV0aG9yQXZhdGFyVVJMIiwiZ2V0QXV0aG9yTG9naW4iLCJnZXRUaXRsZSIsImdldE51bWJlciIsInJlbmRlclN0YXR1c1N1bW1hcnkiLCJnZXRTdGF0dXNDb3VudHMiLCJnZXRDcmVhdGVkQXQiLCJldmVudCIsInNob3dBY3Rpb25zTWVudSIsImVycm9yIiwiZW1wdHlDb21wb25lbnQiLCJFbXB0eUNvbXBvbmVudCIsIm9uTW9yZUNsaWNrIiwicmVuZGVyIiwidGl0bGUiLCJpc0xvYWRpbmciLCJ0b3RhbCIsInJlbmRlckxvYWRpbmdUaWxlIiwicmVuZGVyRW1wdHlUaWxlIiwicmVuZGVyTW9yZVRpbGUiLCJyZW5kZXJSZXZpZXdzQnV0dG9uIiwib25Jc3N1ZWlzaENsaWNrIiwicmVuZGVySXNzdWVpc2giLCJwcmV2ZW50RGVmYXVsdCIsInN0YXR1c0NvdW50cyIsImV2ZXJ5Iiwia2luZCIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwicGVuZGluZyIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJib29sIiwibnVtYmVyIiwiYXJyYXlPZiIsIklzc3VlaXNoUHJvcFR5cGUiLCJyZXBvc2l0b3J5Iiwic2hhcGUiLCJkZWZhdWx0QnJhbmNoUmVmIiwicHJlZml4IiwibmFtZSIsImZ1bmMiLCJvcGVuT25HaXRIdWIiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFD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QyxFQUFBQSxpQkFBaUIsRUFBRXdDLG1CQUFVRyxJQWJaO0FBY2pCWixFQUFBQSxlQUFlLEVBQUVTLG1CQUFVWSxJQUFWLENBQWVWLFVBZGY7QUFlakJwQixFQUFBQSxXQUFXLEVBQUVrQixtQkFBVVksSUFmTjtBQWdCakJqRCxFQUFBQSxXQUFXLEVBQUVxQyxtQkFBVVksSUFBVixDQUFlVixVQWhCWDtBQWlCakJXLEVBQUFBLFlBQVksRUFBRWIsbUJBQVVZLElBQVYsQ0FBZVYsVUFqQlo7QUFrQmpCeEIsRUFBQUEsZUFBZSxFQUFFc0IsbUJBQVVZLElBQVYsQ0FBZVYsVUFsQmY7QUFvQmpCdEIsRUFBQUEsY0FBYyxFQUFFb0IsbUJBQVVZLElBcEJUO0FBcUJqQmpDLEVBQUFBLEtBQUssRUFBRXFCLG1CQUFVYztBQXJCQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7SXNzdWVpc2hQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4vdGltZWFnbyc7XG5pbXBvcnQgU3RhdHVzRG9udXRDaGFydCBmcm9tICcuL3N0YXR1cy1kb251dC1jaGFydCc7XG5pbXBvcnQgQ2hlY2tTdWl0ZXNBY2N1bXVsYXRvciBmcm9tICcuLi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9jaGVjay1zdWl0ZXMtYWNjdW11bGF0b3InO1xuaW1wb3J0IFF1ZXJ5RXJyb3JUaWxlIGZyb20gJy4vcXVlcnktZXJyb3ItdGlsZSc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaExpc3RWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGlzc3VlaXNoZXM6IFByb3BUeXBlcy5hcnJheU9mKElzc3VlaXNoUHJvcFR5cGUpLmlzUmVxdWlyZWQsXG5cbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZGVmYXVsdEJyYW5jaFJlZjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgcHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgIH0pLFxuXG4gICAgbmVlZFJldmlld3NCdXR0b246IFByb3BUeXBlcy5ib29sLFxuICAgIG9uSXNzdWVpc2hDbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbk1vcmVDbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb3BlblJldmlld3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3Blbk9uR2l0SHViOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dBY3Rpb25zTWVudTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIGVtcHR5Q29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBlcnJvcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEFjY29yZGlvblxuICAgICAgICBsZWZ0VGl0bGU9e3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgIGlzTG9hZGluZz17dGhpcy5wcm9wcy5pc0xvYWRpbmd9XG4gICAgICAgIHJlc3VsdHM9e3RoaXMucHJvcHMuaXNzdWVpc2hlc31cbiAgICAgICAgdG90YWw9e3RoaXMucHJvcHMudG90YWx9XG4gICAgICAgIGxvYWRpbmdDb21wb25lbnQ9e3RoaXMucmVuZGVyTG9hZGluZ1RpbGV9XG4gICAgICAgIGVtcHR5Q29tcG9uZW50PXt0aGlzLnJlbmRlckVtcHR5VGlsZX1cbiAgICAgICAgbW9yZUNvbXBvbmVudD17dGhpcy5yZW5kZXJNb3JlVGlsZX1cbiAgICAgICAgcmV2aWV3c0J1dHRvbj17dGhpcy5yZW5kZXJSZXZpZXdzQnV0dG9ufVxuICAgICAgICBvbkNsaWNrSXRlbT17dGhpcy5wcm9wcy5vbklzc3VlaXNoQ2xpY2t9PlxuICAgICAgICB7dGhpcy5yZW5kZXJJc3N1ZWlzaH1cbiAgICAgIDwvQWNjb3JkaW9uPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdzQnV0dG9uID0gKCkgPT4ge1xuICAgIGlmICghdGhpcy5wcm9wcy5uZWVkUmV2aWV3c0J1dHRvbiB8fCB0aGlzLnByb3BzLmlzc3VlaXNoZXMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gZ2l0aHViLUlzc3VlaXNoTGlzdC1vcGVuUmV2aWV3c0J1dHRvblwiXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlblJldmlld3N9PlxuICAgICAgICBTZWUgcmV2aWV3c1xuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIG9wZW5SZXZpZXdzID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLnByb3BzLm9wZW5SZXZpZXdzKHRoaXMucHJvcHMuaXNzdWVpc2hlc1swXSk7XG4gIH1cblxuICByZW5kZXJJc3N1ZWlzaCA9IGlzc3VlaXNoID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPENoZWNrU3VpdGVzQWNjdW11bGF0b3IgY29tbWl0PXtpc3N1ZWlzaC5nZXRMYXRlc3RDb21taXQoKX0+XG4gICAgICAgIHsoe3J1bnNCeVN1aXRlfSkgPT4ge1xuICAgICAgICAgIGlzc3VlaXNoLnNldENoZWNrUnVucyhydW5zQnlTdWl0ZSk7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tYXZhdGFyXCJcbiAgICAgICAgICAgICAgICBzcmM9e2lzc3VlaXNoLmdldEF1dGhvckF2YXRhclVSTCgzMil9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2lzc3VlaXNoLmdldEF1dGhvckxvZ2luKCl9XG4gICAgICAgICAgICAgICAgYWx0PXtpc3N1ZWlzaC5nZXRBdXRob3JMb2dpbigpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHtpc3N1ZWlzaC5nZXRUaXRsZSgpfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbSBnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0tLW51bWJlclwiPlxuICAgICAgICAgICAgICAgICN7aXNzdWVpc2guZ2V0TnVtYmVyKCl9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyU3RhdHVzU3VtbWFyeShpc3N1ZWlzaC5nZXRTdGF0dXNDb3VudHMoKSl9XG4gICAgICAgICAgICAgIDxUaW1lYWdvXG4gICAgICAgICAgICAgICAgdGltZT17aXNzdWVpc2guZ2V0Q3JlYXRlZEF0KCl9XG4gICAgICAgICAgICAgICAgZGlzcGxheVN0eWxlPVwic2hvcnRcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbSBnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0tLWFnZVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJlbGxpcHNlc1wiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tbWVudVwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17ZXZlbnQgPT4gdGhpcy5zaG93QWN0aW9uc01lbnUoZXZlbnQsIGlzc3VlaXNoKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgKTtcbiAgICAgICAgfX1cbiAgICAgIDwvQ2hlY2tTdWl0ZXNBY2N1bXVsYXRvcj5cbiAgICApO1xuICB9XG5cbiAgc2hvd0FjdGlvbnNNZW51KGV2ZW50LCBpc3N1ZWlzaCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnByb3BzLnNob3dBY3Rpb25zTWVudShpc3N1ZWlzaCk7XG4gIH1cblxuICByZW5kZXJTdGF0dXNTdW1tYXJ5KHN0YXR1c0NvdW50cykge1xuICAgIGlmIChbJ3N1Y2Nlc3MnLCAnZmFpbHVyZScsICdwZW5kaW5nJ10uZXZlcnkoa2luZCA9PiBzdGF0dXNDb3VudHNba2luZF0gPT09IDApKSB7XG4gICAgICByZXR1cm4gPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tc3RhdHVzXCIgaWNvbj1cImRhc2hcIiAvPjtcbiAgICB9XG5cbiAgICBpZiAoc3RhdHVzQ291bnRzLnN1Y2Nlc3MgPiAwICYmIHN0YXR1c0NvdW50cy5mYWlsdXJlID09PSAwICYmIHN0YXR1c0NvdW50cy5wZW5kaW5nID09PSAwKSB7XG4gICAgICByZXR1cm4gPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tc3RhdHVzXCIgaWNvbj1cImNoZWNrXCIgLz47XG4gICAgfVxuXG4gICAgaWYgKHN0YXR1c0NvdW50cy5zdWNjZXNzID09PSAwICYmIHN0YXR1c0NvdW50cy5mYWlsdXJlID4gMCAmJiBzdGF0dXNDb3VudHMucGVuZGluZyA9PT0gMCkge1xuICAgICAgcmV0dXJuIDxPY3RpY29uIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbSBnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0tLXN0YXR1c1wiIGljb249XCJ4XCIgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIDxTdGF0dXNEb251dENoYXJ0IHsuLi5zdGF0dXNDb3VudHN9IGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbSBnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0tLXN0YXR1c1wiIC8+O1xuICB9XG5cbiAgcmVuZGVyTG9hZGluZ1RpbGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1sb2FkaW5nXCI+XG4gICAgICAgIExvYWRpbmdcbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJFbXB0eVRpbGUgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMuZXJyb3IpIHtcbiAgICAgIHJldHVybiA8UXVlcnlFcnJvclRpbGUgZXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9IC8+O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmVtcHR5Q29tcG9uZW50KSB7XG4gICAgICBjb25zdCBFbXB0eUNvbXBvbmVudCA9IHRoaXMucHJvcHMuZW1wdHlDb21wb25lbnQ7XG4gICAgICByZXR1cm4gPEVtcHR5Q29tcG9uZW50IC8+O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmVuZGVyTW9yZVRpbGUgPSAoKSA9PiB7XG4gICAgLyogZXNsaW50LWRpc2FibGUganN4LWExMXkvYW5jaG9yLWlzLXZhbGlkICovXG4gICAgaWYgKHRoaXMucHJvcHMub25Nb3JlQ2xpY2spIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1tb3JlXCI+XG4gICAgICAgICAgPGEgb25DbGljaz17dGhpcy5wcm9wcy5vbk1vcmVDbGlja30+XG4gICAgICAgICAgICBNb3JlLi4uXG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==