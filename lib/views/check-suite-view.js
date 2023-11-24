"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckSuiteView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _checkRunView = _interopRequireDefault(require("./check-run-view"));

var _buildStatus = require("../models/build-status");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCheckSuiteView extends _react.default.Component {
  render() {
    const {
      icon,
      classSuffix
    } = (0, _buildStatus.buildStatusFromCheckResult)(this.props.checkSuite);
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("li", {
      className: "github-PrStatuses-list-item"
    }, _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-icon"
    }, _react.default.createElement(_octicon.default, {
      icon: icon,
      className: `github-PrStatuses--${classSuffix}`
    })), this.props.checkSuite.app && _react.default.createElement("span", {
      className: "github-PrStatuses-list-item-context"
    }, _react.default.createElement("strong", null, this.props.checkSuite.app.name))), this.props.checkRuns.map(run => _react.default.createElement(_checkRunView.default, {
      key: run.id,
      checkRun: run,
      switchToIssueish: this.props.switchToIssueish
    })));
  }

}

exports.BareCheckSuiteView = BareCheckSuiteView;

_defineProperty(BareCheckSuiteView, "propTypes", {
  // Relay
  checkSuite: _propTypes.default.shape({
    app: _propTypes.default.shape({
      name: _propTypes.default.string.isRequired
    }),
    status: _propTypes.default.oneOf(['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'REQUESTED']).isRequired,
    conclusion: _propTypes.default.oneOf(['ACTION_REQUIRED', 'TIMED_OUT', 'CANCELLED', 'FAILURE', 'SUCCESS', 'NEUTRAL'])
  }).isRequired,
  checkRuns: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  })).isRequired,
  // Actions
  switchToIssueish: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCheckSuiteView, {
  checkSuite: function () {
    const node = require("./__generated__/checkSuiteView_checkSuite.graphql");

    if (node.hash && node.hash !== "ab1475671a1bc4196d67bfa75ad41446") {
      console.error("The definition of 'checkSuiteView_checkSuite' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkSuiteView_checkSuite.graphql");
  }
});

exports.default = _default;