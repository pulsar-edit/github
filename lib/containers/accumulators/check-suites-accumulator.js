"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckSuitesAccumulator = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _eventKit = require("event-kit");

var _helpers = require("../../helpers");

var _propTypes2 = require("../../prop-types");

var _checkRunsAccumulator = _interopRequireDefault(require("./check-runs-accumulator"));

var _accumulator = _interopRequireDefault(require("./accumulator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCheckSuitesAccumulator extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderCheckSuites", (err, suites, loading) => {
      if (err) {
        return this.props.children({
          errors: [err],
          suites,
          runsBySuite: new Map(),
          loading
        });
      }

      return this.renderCheckSuite({
        errors: [],
        suites,
        runsBySuite: new Map(),
        loading
      }, suites);
    });
  }

  render() {
    const resultBatch = this.props.commit.checkSuites.edges.map(edge => edge.node);
    return _react.default.createElement(_accumulator.default, {
      relay: this.props.relay,
      resultBatch: resultBatch,
      onDidRefetch: this.props.onDidRefetch,
      pageSize: _helpers.PAGE_SIZE,
      waitTimeMs: _helpers.PAGINATION_WAIT_TIME_MS
    }, this.renderCheckSuites);
  }

  renderCheckSuite(payload, suites) {
    if (suites.length === 0) {
      return this.props.children(payload);
    }

    const [suite] = suites;
    return _react.default.createElement(_checkRunsAccumulator.default, {
      onDidRefetch: this.props.onDidRefetch,
      checkSuite: suite
    }, ({
      error,
      checkRuns,
      loading: runsLoading
    }) => {
      if (error) {
        payload.errors.push(error);
      }

      payload.runsBySuite.set(suite, checkRuns);
      payload.loading = payload.loading || runsLoading;
      return this.renderCheckSuite(payload, suites.slice(1));
    });
  }

}

exports.BareCheckSuitesAccumulator = BareCheckSuitesAccumulator;

_defineProperty(BareCheckSuitesAccumulator, "propTypes", {
  // Relay
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  commit: _propTypes.default.shape({
    checkSuites: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.object)
  }).isRequired,
  // Render prop. Called with (array of errors, array of check suites, map of runs per suite, loading)
  children: _propTypes.default.func.isRequired,
  // Subscribe to an event that will fire just after a Relay refetch container completes a refetch.
  onDidRefetch: _propTypes.default.func
});

_defineProperty(BareCheckSuitesAccumulator, "defaultProps", {
  onDidRefetch:
  /* istanbul ignore next */
  () => new _eventKit.Disposable()
});

var _default = (0, _reactRelay.createPaginationContainer)(BareCheckSuitesAccumulator, {
  commit: function () {
    const node = require("./__generated__/checkSuitesAccumulator_commit.graphql");

    if (node.hash && node.hash !== "582abc8127f0f2f19fb0a6a531af5e06") {
      console.error("The definition of 'checkSuitesAccumulator_commit' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkSuitesAccumulator_commit.graphql");
  }
}, {
  direction: 'forward',

  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.commit.checkSuites;
  },

  /* istanbul ignore next */
  getFragmentVariables(prevVars, totalCount) {
    return _objectSpread({}, prevVars, {
      totalCount
    });
  },

  /* istanbul ignore next */
  getVariables(props, {
    count,
    cursor
  }, fragmentVariables) {
    return {
      id: props.commit.id,
      checkSuiteCount: count,
      checkSuiteCursor: cursor,
      checkRunCount: fragmentVariables.checkRunCount
    };
  },

  query: function () {
    const node = require("./__generated__/checkSuitesAccumulatorQuery.graphql");

    if (node.hash && node.hash !== "b27827b6adb558a64ae6da715a8e438e") {
      console.error("The definition of 'checkSuitesAccumulatorQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkSuitesAccumulatorQuery.graphql");
  }
});

exports.default = _default;