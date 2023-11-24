"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCheckRunsAccumulator = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _propTypes2 = require("../../prop-types");

var _helpers = require("../../helpers");

var _accumulator = _interopRequireDefault(require("./accumulator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCheckRunsAccumulator extends _react.default.Component {
  render() {
    const resultBatch = this.props.checkSuite.checkRuns.edges.map(edge => edge.node);
    return _react.default.createElement(_accumulator.default, {
      relay: this.props.relay,
      resultBatch: resultBatch,
      onDidRefetch: this.props.onDidRefetch,
      pageSize: _helpers.PAGE_SIZE,
      waitTimeMs: _helpers.PAGINATION_WAIT_TIME_MS
    }, (error, checkRuns, loading) => this.props.children({
      error,
      checkRuns,
      loading
    }));
  }

}

exports.BareCheckRunsAccumulator = BareCheckRunsAccumulator;

_defineProperty(BareCheckRunsAccumulator, "propTypes", {
  // Relay props
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }),
  checkSuite: _propTypes.default.shape({
    checkRuns: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.object)
  }),
  // Render prop.
  children: _propTypes.default.func.isRequired,
  // Called when a refetch is triggered.
  onDidRefetch: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createPaginationContainer)(BareCheckRunsAccumulator, {
  checkSuite: function () {
    const node = require("./__generated__/checkRunsAccumulator_checkSuite.graphql");

    if (node.hash && node.hash !== "4a47da672423daae903769141008d468") {
      console.error("The definition of 'checkRunsAccumulator_checkSuite' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkRunsAccumulator_checkSuite.graphql");
  }
}, {
  direction: 'forward',

  /* istanbul ignore next */
  getConnectionFromProps(props) {
    return props.checkSuite.checkRuns;
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
  }) {
    return {
      id: props.checkSuite.id,
      checkRunCount: count,
      checkRunCursor: cursor
    };
  },

  query: function () {
    const node = require("./__generated__/checkRunsAccumulatorQuery.graphql");

    if (node.hash && node.hash !== "1a2443362a842b9643fe51ecc2d1b53f") {
      console.error("The definition of 'checkRunsAccumulatorQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/checkRunsAccumulatorQuery.graphql");
  }
});

exports.default = _default;