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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJJc3N1ZWlzaExpc3RWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJwcm9wcyIsIm5lZWRSZXZpZXdzQnV0dG9uIiwiaXNzdWVpc2hlcyIsImxlbmd0aCIsIm9wZW5SZXZpZXdzIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsImlzc3VlaXNoIiwiZ2V0TGF0ZXN0Q29tbWl0IiwicnVuc0J5U3VpdGUiLCJzZXRDaGVja1J1bnMiLCJnZXRBdXRob3JBdmF0YXJVUkwiLCJnZXRBdXRob3JMb2dpbiIsImdldFRpdGxlIiwiZ2V0TnVtYmVyIiwicmVuZGVyU3RhdHVzU3VtbWFyeSIsImdldFN0YXR1c0NvdW50cyIsImdldENyZWF0ZWRBdCIsImV2ZW50Iiwic2hvd0FjdGlvbnNNZW51IiwiZXJyb3IiLCJlbXB0eUNvbXBvbmVudCIsIkVtcHR5Q29tcG9uZW50Iiwib25Nb3JlQ2xpY2siLCJyZW5kZXIiLCJ0aXRsZSIsImlzTG9hZGluZyIsInRvdGFsIiwicmVuZGVyTG9hZGluZ1RpbGUiLCJyZW5kZXJFbXB0eVRpbGUiLCJyZW5kZXJNb3JlVGlsZSIsInJlbmRlclJldmlld3NCdXR0b24iLCJvbklzc3VlaXNoQ2xpY2siLCJyZW5kZXJJc3N1ZWlzaCIsInByZXZlbnREZWZhdWx0Iiwic3RhdHVzQ291bnRzIiwiZXZlcnkiLCJraW5kIiwic3VjY2VzcyIsImZhaWx1cmUiLCJwZW5kaW5nIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJudW1iZXIiLCJhcnJheU9mIiwiSXNzdWVpc2hQcm9wVHlwZSIsInJlcG9zaXRvcnkiLCJzaGFwZSIsImRlZmF1bHRCcmFuY2hSZWYiLCJwcmVmaXgiLCJuYW1lIiwiZnVuYyIsIm9wZW5PbkdpdEh1YiIsIm9iamVjdCJdLCJzb3VyY2VzIjpbImlzc3VlaXNoLWxpc3Qtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtJc3N1ZWlzaFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcbmltcG9ydCBTdGF0dXNEb251dENoYXJ0IGZyb20gJy4vc3RhdHVzLWRvbnV0LWNoYXJ0JztcbmltcG9ydCBDaGVja1N1aXRlc0FjY3VtdWxhdG9yIGZyb20gJy4uL2NvbnRhaW5lcnMvYWNjdW11bGF0b3JzL2NoZWNrLXN1aXRlcy1hY2N1bXVsYXRvcic7XG5pbXBvcnQgUXVlcnlFcnJvclRpbGUgZnJvbSAnLi9xdWVyeS1lcnJvci10aWxlJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlaXNoTGlzdFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaXNzdWVpc2hlczogUHJvcFR5cGVzLmFycmF5T2YoSXNzdWVpc2hQcm9wVHlwZSkuaXNSZXF1aXJlZCxcblxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBkZWZhdWx0QnJhbmNoUmVmOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBwcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgfSksXG5cbiAgICBuZWVkUmV2aWV3c0J1dHRvbjogUHJvcFR5cGVzLmJvb2wsXG4gICAgb25Jc3N1ZWlzaENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uTW9yZUNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvcGVuUmV2aWV3czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuT25HaXRIdWI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd0FjdGlvbnNNZW51OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgZW1wdHlDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGVycm9yOiBQcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QWNjb3JkaW9uXG4gICAgICAgIGxlZnRUaXRsZT17dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgaXNMb2FkaW5nPXt0aGlzLnByb3BzLmlzTG9hZGluZ31cbiAgICAgICAgcmVzdWx0cz17dGhpcy5wcm9wcy5pc3N1ZWlzaGVzfVxuICAgICAgICB0b3RhbD17dGhpcy5wcm9wcy50b3RhbH1cbiAgICAgICAgbG9hZGluZ0NvbXBvbmVudD17dGhpcy5yZW5kZXJMb2FkaW5nVGlsZX1cbiAgICAgICAgZW1wdHlDb21wb25lbnQ9e3RoaXMucmVuZGVyRW1wdHlUaWxlfVxuICAgICAgICBtb3JlQ29tcG9uZW50PXt0aGlzLnJlbmRlck1vcmVUaWxlfVxuICAgICAgICByZXZpZXdzQnV0dG9uPXt0aGlzLnJlbmRlclJldmlld3NCdXR0b259XG4gICAgICAgIG9uQ2xpY2tJdGVtPXt0aGlzLnByb3BzLm9uSXNzdWVpc2hDbGlja30+XG4gICAgICAgIHt0aGlzLnJlbmRlcklzc3VlaXNofVxuICAgICAgPC9BY2NvcmRpb24+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld3NCdXR0b24gPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnByb3BzLm5lZWRSZXZpZXdzQnV0dG9uIHx8IHRoaXMucHJvcHMuaXNzdWVpc2hlcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBnaXRodWItSXNzdWVpc2hMaXN0LW9wZW5SZXZpZXdzQnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17dGhpcy5vcGVuUmV2aWV3c30+XG4gICAgICAgIFNlZSByZXZpZXdzXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG5cbiAgb3BlblJldmlld3MgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMub3BlblJldmlld3ModGhpcy5wcm9wcy5pc3N1ZWlzaGVzWzBdKTtcbiAgfVxuXG4gIHJlbmRlcklzc3VlaXNoID0gaXNzdWVpc2ggPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8Q2hlY2tTdWl0ZXNBY2N1bXVsYXRvciBjb21taXQ9e2lzc3VlaXNoLmdldExhdGVzdENvbW1pdCgpfT5cbiAgICAgICAgeyh7cnVuc0J5U3VpdGV9KSA9PiB7XG4gICAgICAgICAgaXNzdWVpc2guc2V0Q2hlY2tSdW5zKHJ1bnNCeVN1aXRlKTtcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1hdmF0YXJcIlxuICAgICAgICAgICAgICAgIHNyYz17aXNzdWVpc2guZ2V0QXV0aG9yQXZhdGFyVVJMKDMyKX1cbiAgICAgICAgICAgICAgICB0aXRsZT17aXNzdWVpc2guZ2V0QXV0aG9yTG9naW4oKX1cbiAgICAgICAgICAgICAgICBhbHQ9e2lzc3VlaXNoLmdldEF1dGhvckxvZ2luKCl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbSBnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0tLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAge2lzc3VlaXNoLmdldFRpdGxlKCl9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tbnVtYmVyXCI+XG4gICAgICAgICAgICAgICAgI3tpc3N1ZWlzaC5nZXROdW1iZXIoKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJTdGF0dXNTdW1tYXJ5KGlzc3VlaXNoLmdldFN0YXR1c0NvdW50cygpKX1cbiAgICAgICAgICAgICAgPFRpbWVhZ29cbiAgICAgICAgICAgICAgICB0aW1lPXtpc3N1ZWlzaC5nZXRDcmVhdGVkQXQoKX1cbiAgICAgICAgICAgICAgICBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tYWdlXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cImVsbGlwc2VzXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1tZW51XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtldmVudCA9PiB0aGlzLnNob3dBY3Rpb25zTWVudShldmVudCwgaXNzdWVpc2gpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICApO1xuICAgICAgICB9fVxuICAgICAgPC9DaGVja1N1aXRlc0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cblxuICBzaG93QWN0aW9uc01lbnUoZXZlbnQsIGlzc3VlaXNoKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMucHJvcHMuc2hvd0FjdGlvbnNNZW51KGlzc3VlaXNoKTtcbiAgfVxuXG4gIHJlbmRlclN0YXR1c1N1bW1hcnkoc3RhdHVzQ291bnRzKSB7XG4gICAgaWYgKFsnc3VjY2VzcycsICdmYWlsdXJlJywgJ3BlbmRpbmcnXS5ldmVyeShraW5kID0+IHN0YXR1c0NvdW50c1traW5kXSA9PT0gMCkpIHtcbiAgICAgIHJldHVybiA8T2N0aWNvbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1zdGF0dXNcIiBpY29uPVwiZGFzaFwiIC8+O1xuICAgIH1cblxuICAgIGlmIChzdGF0dXNDb3VudHMuc3VjY2VzcyA+IDAgJiYgc3RhdHVzQ291bnRzLmZhaWx1cmUgPT09IDAgJiYgc3RhdHVzQ291bnRzLnBlbmRpbmcgPT09IDApIHtcbiAgICAgIHJldHVybiA8T2N0aWNvbiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWl0ZW0gZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtLS1zdGF0dXNcIiBpY29uPVwiY2hlY2tcIiAvPjtcbiAgICB9XG5cbiAgICBpZiAoc3RhdHVzQ291bnRzLnN1Y2Nlc3MgPT09IDAgJiYgc3RhdHVzQ291bnRzLmZhaWx1cmUgPiAwICYmIHN0YXR1c0NvdW50cy5wZW5kaW5nID09PSAwKSB7XG4gICAgICByZXR1cm4gPE9jdGljb24gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tc3RhdHVzXCIgaWNvbj1cInhcIiAvPjtcbiAgICB9XG5cbiAgICByZXR1cm4gPFN0YXR1c0RvbnV0Q2hhcnQgey4uLnN0YXR1c0NvdW50c30gY2xhc3NOYW1lPVwiZ2l0aHViLUlzc3VlaXNoTGlzdC1pdGVtIGdpdGh1Yi1Jc3N1ZWlzaExpc3QtaXRlbS0tc3RhdHVzXCIgLz47XG4gIH1cblxuICByZW5kZXJMb2FkaW5nVGlsZSA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LWxvYWRpbmdcIj5cbiAgICAgICAgTG9hZGluZ1xuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckVtcHR5VGlsZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvcikge1xuICAgICAgcmV0dXJuIDxRdWVyeUVycm9yVGlsZSBlcnJvcj17dGhpcy5wcm9wcy5lcnJvcn0gLz47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuZW1wdHlDb21wb25lbnQpIHtcbiAgICAgIGNvbnN0IEVtcHR5Q29tcG9uZW50ID0gdGhpcy5wcm9wcy5lbXB0eUNvbXBvbmVudDtcbiAgICAgIHJldHVybiA8RW1wdHlDb21wb25lbnQgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZW5kZXJNb3JlVGlsZSA9ICgpID0+IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBqc3gtYTExeS9hbmNob3ItaXMtdmFsaWQgKi9cbiAgICBpZiAodGhpcy5wcm9wcy5vbk1vcmVDbGljaykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItSXNzdWVpc2hMaXN0LW1vcmVcIj5cbiAgICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLnByb3BzLm9uTW9yZUNsaWNrfT5cbiAgICAgICAgICAgIE1vcmUuLi5cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFB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