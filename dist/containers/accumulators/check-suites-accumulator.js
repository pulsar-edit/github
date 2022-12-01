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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9jaGVjay1zdWl0ZXMtYWNjdW11bGF0b3IuanMiXSwibmFtZXMiOlsiQmFyZUNoZWNrU3VpdGVzQWNjdW11bGF0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImVyciIsInN1aXRlcyIsImxvYWRpbmciLCJwcm9wcyIsImNoaWxkcmVuIiwiZXJyb3JzIiwicnVuc0J5U3VpdGUiLCJNYXAiLCJyZW5kZXJDaGVja1N1aXRlIiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJjb21taXQiLCJjaGVja1N1aXRlcyIsImVkZ2VzIiwibWFwIiwiZWRnZSIsIm5vZGUiLCJyZWxheSIsIm9uRGlkUmVmZXRjaCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwicmVuZGVyQ2hlY2tTdWl0ZXMiLCJwYXlsb2FkIiwibGVuZ3RoIiwic3VpdGUiLCJlcnJvciIsImNoZWNrUnVucyIsInJ1bnNMb2FkaW5nIiwicHVzaCIsInNldCIsInNsaWNlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJoYXNNb3JlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJsb2FkTW9yZSIsImlzTG9hZGluZyIsIm9iamVjdCIsIkRpc3Bvc2FibGUiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJnZXRWYXJpYWJsZXMiLCJjb3VudCIsImN1cnNvciIsImZyYWdtZW50VmFyaWFibGVzIiwiaWQiLCJjaGVja1N1aXRlQ291bnQiLCJjaGVja1N1aXRlQ3Vyc29yIiwiY2hlY2tSdW5Db3VudCIsInF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFTyxNQUFNQSwwQkFBTixTQUF5Q0MsZUFBTUMsU0FBL0MsQ0FBeUQ7QUFBQTtB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XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQge0Rpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7UEFHRV9TSVpFLCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQge1JlbGF5Q29ubmVjdGlvblByb3BUeXBlfSBmcm9tICcuLi8uLi9wcm9wLXR5cGVzJztcbmltcG9ydCBDaGVja1J1bnNBY2N1bXVsYXRvciBmcm9tICcuL2NoZWNrLXJ1bnMtYWNjdW11bGF0b3InO1xuaW1wb3J0IEFjY3VtdWxhdG9yIGZyb20gJy4vYWNjdW11bGF0b3InO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNoZWNrU3VpdGVzQWNjdW11bGF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5XG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBjb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjaGVja1N1aXRlczogUmVsYXlDb25uZWN0aW9uUHJvcFR5cGUoXG4gICAgICAgIFByb3BUeXBlcy5vYmplY3QsXG4gICAgICApLFxuICAgIH0pLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBSZW5kZXIgcHJvcC4gQ2FsbGVkIHdpdGggKGFycmF5IG9mIGVycm9ycywgYXJyYXkgb2YgY2hlY2sgc3VpdGVzLCBtYXAgb2YgcnVucyBwZXIgc3VpdGUsIGxvYWRpbmcpXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gYW4gZXZlbnQgdGhhdCB3aWxsIGZpcmUganVzdCBhZnRlciBhIFJlbGF5IHJlZmV0Y2ggY29udGFpbmVyIGNvbXBsZXRlcyBhIHJlZmV0Y2guXG4gICAgb25EaWRSZWZldGNoOiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgb25EaWRSZWZldGNoOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoKSA9PiBuZXcgRGlzcG9zYWJsZSgpLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEJhdGNoID0gdGhpcy5wcm9wcy5jb21taXQuY2hlY2tTdWl0ZXMuZWRnZXMubWFwKGVkZ2UgPT4gZWRnZS5ub2RlKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8QWNjdW11bGF0b3JcbiAgICAgICAgcmVsYXk9e3RoaXMucHJvcHMucmVsYXl9XG4gICAgICAgIHJlc3VsdEJhdGNoPXtyZXN1bHRCYXRjaH1cbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgcGFnZVNpemU9e1BBR0VfU0laRX1cbiAgICAgICAgd2FpdFRpbWVNcz17UEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDaGVja1N1aXRlc31cbiAgICAgIDwvQWNjdW11bGF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNoZWNrU3VpdGVzID0gKGVyciwgc3VpdGVzLCBsb2FkaW5nKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW4oe1xuICAgICAgICBlcnJvcnM6IFtlcnJdLFxuICAgICAgICBzdWl0ZXMsXG4gICAgICAgIHJ1bnNCeVN1aXRlOiBuZXcgTWFwKCksXG4gICAgICAgIGxvYWRpbmcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZW5kZXJDaGVja1N1aXRlKHtlcnJvcnM6IFtdLCBzdWl0ZXMsIHJ1bnNCeVN1aXRlOiBuZXcgTWFwKCksIGxvYWRpbmd9LCBzdWl0ZXMpO1xuICB9XG5cbiAgcmVuZGVyQ2hlY2tTdWl0ZShwYXlsb2FkLCBzdWl0ZXMpIHtcbiAgICBpZiAoc3VpdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW4ocGF5bG9hZCk7XG4gICAgfVxuXG4gICAgY29uc3QgW3N1aXRlXSA9IHN1aXRlcztcbiAgICByZXR1cm4gKFxuICAgICAgPENoZWNrUnVuc0FjY3VtdWxhdG9yXG4gICAgICAgIG9uRGlkUmVmZXRjaD17dGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2h9XG4gICAgICAgIGNoZWNrU3VpdGU9e3N1aXRlfT5cbiAgICAgICAgeyh7ZXJyb3IsIGNoZWNrUnVucywgbG9hZGluZzogcnVuc0xvYWRpbmd9KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwYXlsb2FkLnJ1bnNCeVN1aXRlLnNldChzdWl0ZSwgY2hlY2tSdW5zKTtcbiAgICAgICAgICBwYXlsb2FkLmxvYWRpbmcgPSBwYXlsb2FkLmxvYWRpbmcgfHwgcnVuc0xvYWRpbmc7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ2hlY2tTdWl0ZShwYXlsb2FkLCBzdWl0ZXMuc2xpY2UoMSkpO1xuICAgICAgICB9fVxuICAgICAgPC9DaGVja1J1bnNBY2N1bXVsYXRvcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoQmFyZUNoZWNrU3VpdGVzQWNjdW11bGF0b3IsIHtcbiAgY29tbWl0OiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0IG9uIENvbW1pdFxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiB7dHlwZTogXCJJbnQhXCJ9XG4gICAgICBjaGVja1N1aXRlQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICAgIGNoZWNrUnVuQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIGlkXG4gICAgICBjaGVja1N1aXRlcyhcbiAgICAgICAgZmlyc3Q6ICRjaGVja1N1aXRlQ291bnRcbiAgICAgICAgYWZ0ZXI6ICRjaGVja1N1aXRlQ3Vyc29yXG4gICAgICApIEBjb25uZWN0aW9uKGtleTogXCJDaGVja1N1aXRlQWNjdW11bGF0b3JfY2hlY2tTdWl0ZXNcIikge1xuICAgICAgICBwYWdlSW5mbyB7XG4gICAgICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgICAgICBlbmRDdXJzb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBjdXJzb3JcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgICBzdGF0dXNcbiAgICAgICAgICAgIGNvbmNsdXNpb25cblxuICAgICAgICAgICAgLi4uY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZVxuICAgICAgICAgICAgLi4uY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSBAYXJndW1lbnRzKFxuICAgICAgICAgICAgICBjaGVja1J1bkNvdW50OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICAgICAgICBjaGVja1J1bkN1cnNvcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5jb21taXQuY2hlY2tTdWl0ZXM7XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldEZyYWdtZW50VmFyaWFibGVzKHByZXZWYXJzLCB0b3RhbENvdW50KSB7XG4gICAgcmV0dXJuIHsuLi5wcmV2VmFycywgdG90YWxDb3VudH07XG4gIH0sXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGdldFZhcmlhYmxlcyhwcm9wcywge2NvdW50LCBjdXJzb3J9LCBmcmFnbWVudFZhcmlhYmxlcykge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogcHJvcHMuY29tbWl0LmlkLFxuICAgICAgY2hlY2tTdWl0ZUNvdW50OiBjb3VudCxcbiAgICAgIGNoZWNrU3VpdGVDdXJzb3I6IGN1cnNvcixcbiAgICAgIGNoZWNrUnVuQ291bnQ6IGZyYWdtZW50VmFyaWFibGVzLmNoZWNrUnVuQ291bnQsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgY2hlY2tTdWl0ZXNBY2N1bXVsYXRvclF1ZXJ5KFxuICAgICAgJGlkOiBJRCFcbiAgICAgICRjaGVja1N1aXRlQ291bnQ6IEludCFcbiAgICAgICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgICAgICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICAgKSB7XG4gICAgICBub2RlKGlkOiAkaWQpIHtcbiAgICAgICAgLi4uIG9uIENvbW1pdCB7XG4gICAgICAgICAgLi4uY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQgQGFyZ3VtZW50cyhcbiAgICAgICAgICAgIGNoZWNrU3VpdGVDb3VudDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogJGNoZWNrU3VpdGVDdXJzb3JcbiAgICAgICAgICAgIGNoZWNrUnVuQ291bnQ6ICRjaGVja1J1bkNvdW50XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=