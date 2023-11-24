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