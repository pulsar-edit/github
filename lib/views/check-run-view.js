"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckRunView = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _githubDotcomMarkdown = _interopRequireDefault(require("./github-dotcom-markdown"));

var _buildStatus = require("../models/build-status");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCheckRunView extends _react.default.Component {
  render() {
    const {
      checkRun
    } = this.props;
    const {
      icon,
      classSuffix
    } = (0, _buildStatus.buildStatusFromCheckResult)(checkRun);
    return _react.default.createElement("li", {
      className: "github-PrStatuses-list-item github-PrStatuses-list-item--checkRun"
    }, _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, _react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), _react.default.createElement("a", {
      className: "github-PrStatuses-list-item-name",
      href: checkRun.permalink
    }, checkRun.name), _react.default.createElement("div", {
      className: "github-PrStatuses-list-item-context"
    }, checkRun.title && _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-title"
    }, checkRun.title), checkRun.summary && _react.default.createElement(_githubDotcomMarkdown.default, {
      className: "github-PrStatuses-list-item-summary",
      switchToIssueish: this.props.switchToIssueish,
      markdown: checkRun.summary
    })), checkRun.detailsUrl && _react.default.createElement("a", {
      className: "github-PrStatuses-list-item-details-link",
      href: checkRun.detailsUrl
    }, "Details"));
  }

}

exports.BareCheckRunView = BareCheckRunView;

_defineProperty(BareCheckRunView, "propTypes", {
  // Relay
  checkRun: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    status: _propTypes.default.oneOf(['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'REQUESTED']).isRequired,
    conclusion: _propTypes.default.oneOf(['ACTION_REQUIRED', 'TIMED_OUT', 'CANCELLED', 'FAILURE', 'SUCCESS', 'NEUTRAL']),
    title: _propTypes.default.string,
    detailsUrl: _propTypes.default.string
  }).isRequired,
  // Actions
  switchToIssueish: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCheckRunView, {
  checkRun: function () {
    const node = require("./__generated__/checkRunView_checkRun.graphql");

    if (node.hash && node.hash !== "7135f882a3513e65b0a52393a0cc8b40") {
      console.error("The definition of 'checkRunView_checkRun' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkRunView_checkRun.graphql");
  }
});

exports.default = _default;