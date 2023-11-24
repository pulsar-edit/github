"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReviewsFooterView extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "logStartReviewClick", () => {
      (0, _reporterProxy.addEvent)('start-pr-review', {
        package: 'github',
        component: this.constructor.name
      });
    });
  }

  render() {
    return _react.default.createElement("footer", {
      className: "github-ReviewsFooterView-footer"
    }, _react.default.createElement("span", {
      className: "github-ReviewsFooterView-footerTitle"
    }, "Reviews"), _react.default.createElement("span", {
      className: "github-ReviewsFooterView"
    }, _react.default.createElement("span", {
      className: "github-ReviewsFooterView-commentCount"
    }, "Resolved", ' ', _react.default.createElement("span", {
      className: "github-ReviewsFooterView-commentsResolved"
    }, this.props.commentsResolved), ' ', "of", ' ', _react.default.createElement("span", {
      className: "github-ReviewsFooterView-totalComments"
    }, this.props.totalComments), ' ', "comments"), _react.default.createElement("progress", {
      className: "github-ReviewsFooterView-progessBar",
      value: this.props.commentsResolved,
      max: this.props.totalComments
    }, ' ', "comments", ' ')), _react.default.createElement("button", {
      className: "github-ReviewsFooterView-openReviewsButton btn btn-primary",
      onClick: this.props.openReviews
    }, "See reviews"), _react.default.createElement("a", {
      href: this.props.pullRequestURL,
      className: "github-ReviewsFooterView-reviewChangesButton btn",
      onClick: this.logStartReviewClick
    }, "Start a new review"));
  }

}

exports.default = ReviewsFooterView;

_defineProperty(ReviewsFooterView, "propTypes", {
  commentsResolved: _propTypes.default.number.isRequired,
  totalComments: _propTypes.default.number.isRequired,
  pullRequestURL: _propTypes.default.string.isRequired,
  // Controller actions
  openReviews: _propTypes.default.func.isRequired
});