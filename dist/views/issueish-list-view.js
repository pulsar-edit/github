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

      return /*#__PURE__*/_react.default.createElement("button", {
        className: "btn btn-primary btn-sm github-IssueishList-openReviewsButton",
        onClick: this.openReviews
      }, "See reviews");
    });

    _defineProperty(this, "openReviews", e => {
      e.stopPropagation();
      this.props.openReviews(this.props.issueishes[0]);
    });

    _defineProperty(this, "renderIssueish", issueish => {
      return /*#__PURE__*/_react.default.createElement(_checkSuitesAccumulator.default, {
        commit: issueish.getLatestCommit()
      }, ({
        runsBySuite
      }) => {
        issueish.setCheckRuns(runsBySuite);
        return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("img", {
          className: "github-IssueishList-item github-IssueishList-item--avatar",
          src: issueish.getAuthorAvatarURL(32),
          title: issueish.getAuthorLogin(),
          alt: issueish.getAuthorLogin()
        }), /*#__PURE__*/_react.default.createElement("span", {
          className: "github-IssueishList-item github-IssueishList-item--title"
        }, issueish.getTitle()), /*#__PURE__*/_react.default.createElement("span", {
          className: "github-IssueishList-item github-IssueishList-item--number"
        }, "#", issueish.getNumber()), this.renderStatusSummary(issueish.getStatusCounts()), /*#__PURE__*/_react.default.createElement(_timeago.default, {
          time: issueish.getCreatedAt(),
          displayStyle: "short",
          className: "github-IssueishList-item github-IssueishList-item--age"
        }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
          icon: "ellipses",
          className: "github-IssueishList-item github-IssueishList-item--menu",
          onClick: event => this.showActionsMenu(event, issueish)
        }));
      });
    });

    _defineProperty(this, "renderLoadingTile", () => {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-IssueishList-loading"
      }, "Loading");
    });

    _defineProperty(this, "renderEmptyTile", () => {
      if (this.props.error) {
        return /*#__PURE__*/_react.default.createElement(_queryErrorTile.default, {
          error: this.props.error
        });
      }

      if (this.props.emptyComponent) {
        const EmptyComponent = this.props.emptyComponent;
        return /*#__PURE__*/_react.default.createElement(EmptyComponent, null);
      }

      return null;
    });

    _defineProperty(this, "renderMoreTile", () => {
      /* eslint-disable jsx-a11y/anchor-is-valid */
      if (this.props.onMoreClick) {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: "github-IssueishList-more"
        }, /*#__PURE__*/_react.default.createElement("a", {
          onClick: this.props.onMoreClick
        }, "More..."));
      }

      return null;
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_accordion.default, {
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
      return /*#__PURE__*/_react.default.createElement(_octicon.default, {
        className: "github-IssueishList-item github-IssueishList-item--status",
        icon: "dash"
      });
    }

    if (statusCounts.success > 0 && statusCounts.failure === 0 && statusCounts.pending === 0) {
      return /*#__PURE__*/_react.default.createElement(_octicon.default, {
        className: "github-IssueishList-item github-IssueishList-item--status",
        icon: "check"
      });
    }

    if (statusCounts.success === 0 && statusCounts.failure > 0 && statusCounts.pending === 0) {
      return /*#__PURE__*/_react.default.createElement(_octicon.default, {
        className: "github-IssueishList-item github-IssueishList-item--status",
        icon: "x"
      });
    }

    return /*#__PURE__*/_react.default.createElement(_statusDonutChart.default, _extends({}, statusCounts, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9pc3N1ZWlzaC1saXN0LXZpZXcuanMiXSwibmFtZXMiOlsiSXNzdWVpc2hMaXN0VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicHJvcHMiLCJuZWVkUmV2aWV3c0J1dHRvbiIsImlzc3VlaXNoZXMiLCJsZW5ndGgiLCJvcGVuUmV2aWV3cyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc3N1ZWlzaCIsImdldExhdGVzdENvbW1pdCIsInJ1bnNCeVN1aXRlIiwic2V0Q2hlY2tSdW5zIiwiZ2V0QXV0aG9yQXZhdGFyVVJMIiwiZ2V0QXV0aG9yTG9naW4iLCJnZXRUaXRsZSIsImdldE51bWJlciIsInJlbmRlclN0YXR1c1N1bW1hcnkiLCJnZXRTdGF0dXNDb3VudHMiLCJnZXRDcmVhdGVkQXQiLCJldmVudCIsInNob3dBY3Rpb25zTWVudSIsImVycm9yIiwiZW1wdHlDb21wb25lbnQiLCJFbXB0eUNvbXBvbmVudCIsIm9uTW9yZUNsaWNrIiwicmVuZGVyIiwidGl0bGUiLCJpc0xvYWRpbmciLCJ0b3RhbCIsInJlbmRlckxvYWRpbmdUaWxlIiwicmVuZGVyRW1wdHlUaWxlIiwicmVuZGVyTW9yZVRpbGUiLCJyZW5kZXJSZXZpZXdzQnV0dG9uIiwib25Jc3N1ZWlzaENsaWNrIiwicmVuZGVySXNzdWVpc2giLCJwcmV2ZW50RGVmYXVsdCIsInN0YXR1c0NvdW50cyIsImV2ZXJ5Iiwia2luZCIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwicGVuZGluZyIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJib29sIiwibnVtYmVyIiwiYXJyYXlPZiIsIklzc3VlaXNoUHJvcFR5cGUiLCJyZXBvc2l0b3J5Iiwic2hhcGUiLCJkZWZhdWx0QnJhbmNoUmVmIiwicHJlZml4IiwibmFtZSIsImZ1bmMiLCJvcGVuT25HaXRIdWIiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sU0FBK0JDLGVBQU1DLFNBQXJDLENBQStDO0FBQUE7QUFBQTs7QUFBQSxpREEwQ3RDLE1BQU07QUFDMUIsVUFBSSxDQUFDLEtBQUtDLEtBQUwsQ0FBV0MsaUJBQVosSUFBaUMsS0FBS0QsS0FBTCxDQUFXRSxVQUFYLENBQXNCQyxNQUF0QixHQUErQixDQUFwRSxFQUF1RTtBQUNyRSxlQUFPLElBQVA7QUFDRDs7QUFDRCwwQkFDRTtBQUNFLFFBQUEsU0FBUyxFQUFDLDhEQURaO0FBRUUsUUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFGaEIsdUJBREY7QUFPRCxLQXJEMkQ7O0FBQUEseUNBdUQ5Q0MsQ0FBQyxJQUFJO0FBQ2pCQSxNQUFBQSxDQUFDLENBQUNDLGVBQUY7QUFDQSxXQUFLTixLQUFMLENBQVdJLFdBQVgsQ0FBdUIsS0FBS0osS0FBTCxDQUFXRSxVQUFYLENBQXNCLENBQXRCLENBQXZCO0FBQ0QsS0ExRDJEOztBQUFBLDRDQTREM0NLLFFBQVEsSUFBSTtBQUMzQiwwQkFDRSw2QkFBQywrQkFBRDtBQUF3QixRQUFBLE1BQU0sRUFBRUEsUUFBUSxDQUFDQyxlQUFUO0FBQWhDLFNBQ0csQ0FBQztBQUFDQyxRQUFBQTtBQUFELE9BQUQsS0FBbUI7QUFDbEJGLFFBQUFBLFFBQVEsQ0FBQ0csWUFBVCxDQUFzQkQsV0FBdEI7QUFFQSw0QkFDRSw2QkFBQyxlQUFELHFCQUNFO0FBQ0UsVUFBQSxTQUFTLEVBQUMsMkRBRFo7QUFFRSxVQUFBLEdBQUcsRUFBRUYsUUFBUSxDQUFDSSxrQkFBVCxDQUE0QixFQUE1QixDQUZQO0FBR0UsVUFBQSxLQUFLLEVBQUVKLFFBQVEsQ0FBQ0ssY0FBVCxFQUhUO0FBSUUsVUFBQSxHQUFHLEVBQUVMLFFBQVEsQ0FBQ0ssY0FBVDtBQUpQLFVBREYsZUFPRTtBQUFNLFVBQUEsU0FBUyxFQUFDO0FBQWhCLFdBQ0dMLFFBQVEsQ0FBQ00sUUFBVCxFQURILENBUEYsZUFVRTtBQUFNLFVBQUEsU0FBUyxFQUFDO0FBQWhCLGdCQUNJTixRQUFRLENBQUNPLFNBQVQsRUFESixDQVZGLEVBYUcsS0FBS0MsbUJBQUwsQ0FBeUJSLFFBQVEsQ0FBQ1MsZUFBVCxFQUF6QixDQWJILGVBY0UsNkJBQUMsZ0JBQUQ7QUFDRSxVQUFBLElBQUksRUFBRVQsUUFBUSxDQUFDVSxZQUFULEVBRFI7QUFFRSxVQUFBLFlBQVksRUFBQyxPQUZmO0FBR0UsVUFBQSxTQUFTLEVBQUM7QUFIWixVQWRGLGVBbUJFLDZCQUFDLGdCQUFEO0FBQVMsVUFBQSxJQUFJLEVBQUMsVUFBZDtBQUNFLFVBQUEsU0FBUyxFQUFDLHlEQURaO0FBRUUsVUFBQSxPQUFPLEVBQUVDLEtBQUssSUFBSSxLQUFLQyxlQUFMLENBQXFCRCxLQUFyQixFQUE0QlgsUUFBNUI7QUFGcEIsVUFuQkYsQ0FERjtBQTBCRCxPQTlCSCxDQURGO0FBa0NELEtBL0YyRDs7QUFBQSwrQ0F3SHhDLE1BQU07QUFDeEIsMEJBQ0U7QUFBSyxRQUFBLFNBQVMsRUFBQztBQUFmLG1CQURGO0FBS0QsS0E5SDJEOztBQUFBLDZDQWdJMUMsTUFBTTtBQUN0QixVQUFJLEtBQUtQLEtBQUwsQ0FBV29CLEtBQWYsRUFBc0I7QUFDcEIsNEJBQU8sNkJBQUMsdUJBQUQ7QUFBZ0IsVUFBQSxLQUFLLEVBQUUsS0FBS3BCLEtBQUwsQ0FBV29CO0FBQWxDLFVBQVA7QUFDRDs7QUFFRCxVQUFJLEtBQUtwQixLQUFMLENBQVdxQixjQUFmLEVBQStCO0FBQzdCLGNBQU1DLGNBQWMsR0FBRyxLQUFLdEIsS0FBTCxDQUFXcUIsY0FBbEM7QUFDQSw0QkFBTyw2QkFBQyxjQUFELE9BQVA7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRCxLQTNJMkQ7O0FBQUEsNENBNkkzQyxNQUFNO0FBQ3JCO0FBQ0EsVUFBSSxLQUFLckIsS0FBTCxDQUFXdUIsV0FBZixFQUE0QjtBQUMxQiw0QkFDRTtBQUFLLFVBQUEsU0FBUyxFQUFDO0FBQWYsd0JBQ0U7QUFBRyxVQUFBLE9BQU8sRUFBRSxLQUFLdkIsS0FBTCxDQUFXdUI7QUFBdkIscUJBREYsQ0FERjtBQU9EOztBQUVELGFBQU8sSUFBUDtBQUNELEtBMUoyRDtBQUFBOztBQXlCNURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFLDZCQUFDLGtCQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUUsS0FBS3hCLEtBQUwsQ0FBV3lCLEtBRHhCO0FBRUUsTUFBQSxTQUFTLEVBQUUsS0FBS3pCLEtBQUwsQ0FBVzBCLFNBRnhCO0FBR0UsTUFBQSxPQUFPLEVBQUUsS0FBSzFCLEtBQUwsQ0FBV0UsVUFIdEI7QUFJRSxNQUFBLEtBQUssRUFBRSxLQUFLRixLQUFMLENBQVcyQixLQUpwQjtBQUtFLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS0MsaUJBTHpCO0FBTUUsTUFBQSxjQUFjLEVBQUUsS0FBS0MsZUFOdkI7QUFPRSxNQUFBLGFBQWEsRUFBRSxLQUFLQyxjQVB0QjtBQVFFLE1BQUEsYUFBYSxFQUFFLEtBQUtDLG1CQVJ0QjtBQVNFLE1BQUEsV0FBVyxFQUFFLEtBQUsvQixLQUFMLENBQVdnQztBQVQxQixPQVVHLEtBQUtDLGNBVlIsQ0FERjtBQWNEOztBQXlERGQsRUFBQUEsZUFBZSxDQUFDRCxLQUFELEVBQVFYLFFBQVIsRUFBa0I7QUFDL0JXLElBQUFBLEtBQUssQ0FBQ2dCLGNBQU47QUFDQWhCLElBQUFBLEtBQUssQ0FBQ1osZUFBTjtBQUVBLFNBQUtOLEtBQUwsQ0FBV21CLGVBQVgsQ0FBMkJaLFFBQTNCO0FBQ0Q7O0FBRURRLEVBQUFBLG1CQUFtQixDQUFDb0IsWUFBRCxFQUFlO0FBQ2hDLFFBQUksQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixTQUF2QixFQUFrQ0MsS0FBbEMsQ0FBd0NDLElBQUksSUFBSUYsWUFBWSxDQUFDRSxJQUFELENBQVosS0FBdUIsQ0FBdkUsQ0FBSixFQUErRTtBQUM3RSwwQkFBTyw2QkFBQyxnQkFBRDtBQUFTLFFBQUEsU0FBUyxFQUFDLDJEQUFuQjtBQUErRSxRQUFBLElBQUksRUFBQztBQUFwRixRQUFQO0FBQ0Q7O0FBRUQsUUFBSUYsWUFBWSxDQUFDRyxPQUFiLEdBQXVCLENBQXZCLElBQTRCSCxZQUFZLENBQUNJLE9BQWIsS0FBeUIsQ0FBckQsSUFBMERKLFlBQVksQ0FBQ0ssT0FBYixLQUF5QixDQUF2RixFQUEwRjtBQUN4RiwwQkFBTyw2QkFBQyxnQkFBRDtBQUFTLFFBQUEsU0FBUyxFQUFDLDJEQUFuQjtBQUErRSxRQUFBLElBQUksRUFBQztBQUFwRixRQUFQO0FBQ0Q7O0FBRUQsUUFBSUwsWUFBWSxDQUFDRyxPQUFiLEtBQXlCLENBQXpCLElBQThCSCxZQUFZLENBQUNJLE9BQWIsR0FBdUIsQ0FBckQsSUFBMERKLFlBQVksQ0FBQ0ssT0FBYixLQUF5QixDQUF2RixFQUEwRjtBQUN4RiwwQkFBTyw2QkFBQyxnQkFBRDtBQUFTLFFBQUEsU0FBUyxFQUFDLDJEQUFuQjtBQUErRSxRQUFBLElBQUksRUFBQztBQUFwRixRQUFQO0FBQ0Q7O0FBRUQsd0JBQU8sNkJBQUMseUJBQUQsZUFBc0JMLFlBQXRCO0FBQW9DLE1BQUEsU0FBUyxFQUFDO0FBQTlDLE9BQVA7QUFDRDs7QUF0SDJEOzs7O2dCQUF6Q3RDLGdCLGVBQ0E7QUFDakI0QixFQUFBQSxLQUFLLEVBQUVnQixtQkFBVUMsTUFBVixDQUFpQkMsVUFEUDtBQUVqQmpCLEVBQUFBLFNBQVMsRUFBRWUsbUJBQVVHLElBQVYsQ0FBZUQsVUFGVDtBQUdqQmhCLEVBQUFBLEtBQUssRUFBRWMsbUJBQVVJLE1BQVYsQ0FBaUJGLFVBSFA7QUFJakJ6QyxFQUFBQSxVQUFVLEVBQUV1QyxtQkFBVUssT0FBVixDQUFrQkMsNEJBQWxCLEVBQW9DSixVQUovQjtBQU1qQkssRUFBQUEsVUFBVSxFQUFFUCxtQkFBVVEsS0FBVixDQUFnQjtBQUMxQkMsSUFBQUEsZ0JBQWdCLEVBQUVULG1CQUFVUSxLQUFWLENBQWdCO0FBQ2hDRSxNQUFBQSxNQUFNLEVBQUVWLG1CQUFVQyxNQUFWLENBQWlCQyxVQURPO0FBRWhDUyxNQUFBQSxJQUFJLEVBQUVYLG1CQUFVQyxNQUFWLENBQWlCQztBQUZTLEtBQWhCO0FBRFEsR0FBaEIsQ0FOSztBQWFqQjFDLEVBQUFBLGlCQUFpQixFQUFFd0MsbUJBQVVHLElBYlo7QUFjakJaLEVBQUFBLGVBQWUsRUFBRVMsbUJBQVVZLElBQVYsQ0FBZVYsVUFkZjtBQWVqQnBCLEVBQUFBLFdBQVcsRUFBRWtCLG1CQUFVWSxJQWZOO0FBZ0JqQmpELEVBQUFBLFdBQVcsRUFBRXFDLG1CQUFVWSxJQUFWLENBQWVWLFVBaEJYO0FBaUJqQlcsRUFBQUEsWUFBWSxFQUFFYixtQkFBVVksSUFBVixDQUFlVixVQWpCWjtBQWtCakJ4QixFQUFBQSxlQUFlLEVBQUVzQixtQkFBVVksSUFBVixDQUFlVixVQWxCZjtBQW9CakJ0QixFQUFBQSxjQUFjLEVBQUVvQixtQkFBVVksSUFwQlQ7QUFxQmpCakMsRUFBQUEsS0FBSyxFQUFFcUIsbUJBQVVjO0FBckJBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtJc3N1ZWlzaFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcbmltcG9ydCBTdGF0dXNEb251dENoYXJ0IGZyb20gJy4vc3RhdHVzLWRvbnV0LWNoYXJ0JztcbmltcG9ydCBDaGVja1N1aXRlc0FjY3VtdWxhdG9yIGZyb20gJy4uL2NvbnRhaW5lcnMvYWNjdW11bGF0b3JzL2NoZWNrLXN1aXRlcy1hY2N1bXVsYXRvcic7XG5pbXBvcnQgUXVlcnlFcnJvclRpbGUgZnJvbSAnLi9xdWVyeS1lcnJvci10aWxlJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlaXNoTGlzdFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaXNzdWVpc2hlczogUHJvcFR5cGVzLmFycmF5T2YoSXNzdWVpc2hQcm9wVHlwZSkuaXNSZXF1aXJlZCxcblxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBkZWZhdWx0QnJhbmNoUmVmOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBwcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSksXG5cbiAgICBuZWVkUmV2aWV3c0J1dHRvbjogUHJvcFR5cGVzLmJvb2wsXG4gICAgb25Jc3N1ZWlzaENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uTW9yZUNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvcGVuUmV2aWV3czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuT25HaXRIdWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd0FjdGlvbnNNZW51OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgZW1wdHlDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGVycm9yOiBQcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QWNjb3JkaW9uXG4gICAgICAgIGxlZnRUaXRsZT17dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgcmVzdWx0cz17dGhpcy5wcm9wcy5pc3N1ZWlzaGVzfVxuICAgICAgICB0b3RhbD17dGhpcy5wcm9wcy50b3RhbH1cbiAgICAgICAgbG9hZGluZ0NvbXBvbmVudD17dGhpcy5yZW5kZXJMb2FkaW5nVGlsZX1cbiAgICAgICAgZW1wdHlDb21wb25lbnQ9e3RoaXMucmVuZGVyRW1wdHlUaWxlfVxuICAgICAgICBtb3JlQ29tcG9uZW50PXt0aGlzLnJlbmRlck1vcmVUaWxlfVxuICAgICAgICByZXZpZXdzQnV0dG9uPXt0aGlzLnJlbmRlclJldmlld3NCdXR0b259XG4gICAgICAgIG9uQ2xpY2tJdGVtPXt0aGlzLnByb3BzLm9uSXNzdWVpc2hDbGlja30+XG4gICAgICAgIHt0aGlzLnJlbmRlcklzc3VlaXNofVxuICAgICAgPC9BY2NvcmRpb24+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld3NCdXR0b24gPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm5lZWRSZXZpZXdzQnV0dG9uIHx8IHRoaXMucHJvcHMuaXNzdWVpc2hlcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBnaXRodWItSXNzdWVpc2hMaXN0LW9wZW5SZXZpZXdzQnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17dGhpcy5vcGVuUmV2aWV3c30+XG4gICAgICAgIFNlZSByZXZpZXdzXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbiAgb3BlblJldmlld3MgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMub3BlblJldmlld3ModGhpcy5wcm9wcy5pc3N1ZWlzaGVzWzBdKTtcbiAgfVxuXG4gIHJlbmRlcklzc3VlaXNoID0gaXNzdWVpc2ggPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8Q2hlY2tTdWl0ZXNBY2N1bXVsYXRvciBjb21taXQ9e2lzc3VlaXNoLmdldExhdGVzdENvbW1pdCgpfT5cbiAgICAgICAgeyh7cnVuc0J5U3VpdGV9KSA9PiB7XG4gICAgICAgICAgaXNzdWVpc2guc2V0Q2hlY2tSdW5zKHJ1bnNCeVN1aXRlKTtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1hdmF0YXJcIlxuICAgICAgICAgICAgICAgIHNyYz17aXNzdWVpc2guZ2V0QXV0aG9yQXZhdGFyVVJMKDMyKX1cbiAgICAgICAgICAgICAgICB0aXRsZT17aXNzdWVpc2guZ2V0QXV0aG9yTG9naW4oKX1cbiAgICAgICAgICAgICAgICBhbHQ9e2lzc3VlaXNoLmdldEF1dGhvckxvZ2luKCl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbSBnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0tLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAge2lzc3VlaXNoLmdldFRpdGxlKCl9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tbnVtYmVyXCI+XG4gICAgICAgICAgICAgICAgI3tpc3N1ZWlzaC5nZXROdW1iZXIoKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTdGF0dXNTdW1tYXJ5KGlzc3VlaXNoLmdldFN0YXR1c0NvdW50cygpKX1cbiAgICAgICAgICAgICAgPFRpbWVhZ29cbiAgICAgICAgICAgICAgICB0aW1lPXtpc3N1ZWlzaC5nZXRDcmVhdGVkQXQoKX1cbiAgICAgICAgICAgICAgICBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tYWdlXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImVsbGlwc2VzXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1tZW51XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtldmVudCA9PiB0aGlzLnNob3dBY3Rpb25zTWVudShldmVudCwgaXNzdWVpc2gpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICApO1xuICAgICAgICB9fVxuICAgICAgPC9DaGVja1N1aXRlc0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cblxuICBzaG93QWN0aW9uc01lbnUoZXZlbnQsIGlzc3VlaXNoKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMucHJvcHMuc2hvd0FjdGlvbnNNZW51KGlzc3VlaXNoKTtcbiAgfVxuXG4gIHJlbmRlclN0YXR1c1N1bW1hcnkoc3RhdHVzQ291bnRzKSB7XG4gICAgaWYgKFsnc3VjY2VzcycsICdmYWlsdXJlJywgJ3BlbmRpbmcnXS5ldmVyeShraW5kID0+IHN0YXR1c0NvdW50c1traW5kXSA9PT0gMCkpIHtcbiAgICAgIHJldHVybiA8T2N0aWNvbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1zdGF0dXNcIiBpY29uPVwiZGFzaFwiIC8+O1xuICAgIH1cblxuICAgIGlmIChzdGF0dXNDb3VudHMuc3VjY2VzcyA+IDAgJiYgc3RhdHVzQ291bnRzLmZhaWx1cmUgPT09IDAgJiYgc3RhdHVzQ291bnRzLnBlbmRpbmcgPT09IDApIHtcbiAgICAgIHJldHVybiA8T2N0aWNvbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1zdGF0dXNcIiBpY29uPVwiY2hlY2tcIiAvPjtcbiAgICB9XG5cbiAgICBpZiAoc3RhdHVzQ291bnRzLnN1Y2Nlc3MgPT09IDAgJiYgc3RhdHVzQ291bnRzLmZhaWx1cmUgPiAwICYmIHN0YXR1c0NvdW50cy5wZW5kaW5nID09PSAwKSB7XG4gICAgICByZXR1cm4gPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tc3RhdHVzXCIgaWNvbj1cInhcIiAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gPFN0YXR1c0RvbnV0Q2hhcnQgey4uLnN0YXR1c0NvdW50c30gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tc3RhdHVzXCIgLz47XG4gIH1cblxuICByZW5kZXJMb2FkaW5nVGlsZSA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWxvYWRpbmdcIj5cbiAgICAgICAgTG9hZGluZ1xuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckVtcHR5VGlsZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvcikge1xuICAgICAgcmV0dXJuIDxRdWVyeUVycm9yVGlsZSBlcnJvcj17dGhpcy5wcm9wcy5lcnJvcn0gLz47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZW1wdHlDb21wb25lbnQpIHtcbiAgICAgIGNvbnN0IEVtcHR5Q29tcG9uZW50ID0gdGhpcy5wcm9wcy5lbXB0eUNvbXBvbmVudDtcbiAgICAgIHJldHVybiA8RW1wdHlDb21wb25lbnQgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZW5kZXJNb3JlVGlsZSA9ICgpID0+IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBqc3gtYTExeS9hbmNob3ItaXMtdmFsaWQgKi9cbiAgICBpZiAodGhpcy5wcm9wcy5vbk1vcmVDbGljaykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LW1vcmVcIj5cbiAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLnByb3BzLm9uTW9yZUNsaWNrfT5cbiAgICAgICAgICAgIE1vcmUuLi5cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19