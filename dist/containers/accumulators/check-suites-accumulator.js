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
    return /*#__PURE__*/_react.default.createElement(_accumulator.default, {
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
    return /*#__PURE__*/_react.default.createElement(_checkRunsAccumulator.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9jaGVjay1zdWl0ZXMtYWNjdW11bGF0b3IuanMiXSwibmFtZXMiOlsiQmFyZUNoZWNrU3VpdGVzQWNjdW11bGF0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImVyciIsInN1aXRlcyIsImxvYWRpbmciLCJwcm9wcyIsImNoaWxkcmVuIiwiZXJyb3JzIiwicnVuc0J5U3VpdGUiLCJNYXAiLCJyZW5kZXJDaGVja1N1aXRlIiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJjb21taXQiLCJjaGVja1N1aXRlcyIsImVkZ2VzIiwibWFwIiwiZWRnZSIsIm5vZGUiLCJyZWxheSIsIm9uRGlkUmVmZXRjaCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwicmVuZGVyQ2hlY2tTdWl0ZXMiLCJwYXlsb2FkIiwibGVuZ3RoIiwic3VpdGUiLCJlcnJvciIsImNoZWNrUnVucyIsInJ1bnNMb2FkaW5nIiwicHVzaCIsInNldCIsInNsaWNlIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJoYXNNb3JlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJsb2FkTW9yZSIsImlzTG9hZGluZyIsIm9iamVjdCIsIkRpc3Bvc2FibGUiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJnZXRWYXJpYWJsZXMiLCJjb3VudCIsImN1cnNvciIsImZyYWdtZW50VmFyaWFibGVzIiwiaWQiLCJjaGVja1N1aXRlQ291bnQiLCJjaGVja1N1aXRlQ3Vyc29yIiwiY2hlY2tSdW5Db3VudCIsInF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFTyxNQUFNQSwwQkFBTixTQUF5Q0MsZUFBTUMsU0FBL0MsQ0FBeUQ7QUFBQTtB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JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtQQUdFX1NJWkUsIFBBR0lOQVRJT05fV0FJVF9USU1FX01TfSBmcm9tICcuLi8uLi9oZWxwZXJzJztcbmltcG9ydCB7UmVsYXlDb25uZWN0aW9uUHJvcFR5cGV9IGZyb20gJy4uLy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IENoZWNrUnVuc0FjY3VtdWxhdG9yIGZyb20gJy4vY2hlY2stcnVucy1hY2N1bXVsYXRvcic7XG5pbXBvcnQgQWNjdW11bGF0b3IgZnJvbSAnLi9hY2N1bXVsYXRvcic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ2hlY2tTdWl0ZXNBY2N1bXVsYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXlcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhc01vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBsb2FkTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlzTG9hZGluZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNoZWNrU3VpdGVzOiBSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZShcbiAgICAgICAgUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICksXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIFJlbmRlciBwcm9wLiBDYWxsZWQgd2l0aCAoYXJyYXkgb2YgZXJyb3JzLCBhcnJheSBvZiBjaGVjayBzdWl0ZXMsIG1hcCBvZiBydW5zIHBlciBzdWl0ZSwgbG9hZGluZylcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIFN1YnNjcmliZSB0byBhbiBldmVudCB0aGF0IHdpbGwgZmlyZSBqdXN0IGFmdGVyIGEgUmVsYXkgcmVmZXRjaCBjb250YWluZXIgY29tcGxldGVzIGEgcmVmZXRjaC5cbiAgICBvbkRpZFJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbkRpZFJlZmV0Y2g6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICgpID0+IG5ldyBEaXNwb3NhYmxlKCksXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVzdWx0QmF0Y2ggPSB0aGlzLnByb3BzLmNvbW1pdC5jaGVja1N1aXRlcy5lZGdlcy5tYXAoZWRnZSA9PiBlZGdlLm5vZGUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBY2N1bXVsYXRvclxuICAgICAgICByZWxheT17dGhpcy5wcm9wcy5yZWxheX1cbiAgICAgICAgcmVzdWx0QmF0Y2g9e3Jlc3VsdEJhdGNofVxuICAgICAgICBvbkRpZFJlZmV0Y2g9e3RoaXMucHJvcHMub25EaWRSZWZldGNofVxuICAgICAgICBwYWdlU2l6ZT17UEFHRV9TSVpFfVxuICAgICAgICB3YWl0VGltZU1zPXtQQUdJTkFUSU9OX1dBSVRfVElNRV9NU30+XG4gICAgICAgIHt0aGlzLnJlbmRlckNoZWNrU3VpdGVzfVxuICAgICAgPC9BY2N1bXVsYXRvcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ2hlY2tTdWl0ZXMgPSAoZXJyLCBzdWl0ZXMsIGxvYWRpbmcpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbih7XG4gICAgICAgIGVycm9yczogW2Vycl0sXG4gICAgICAgIHN1aXRlcyxcbiAgICAgICAgcnVuc0J5U3VpdGU6IG5ldyBNYXAoKSxcbiAgICAgICAgbG9hZGluZyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlbmRlckNoZWNrU3VpdGUoe2Vycm9yczogW10sIHN1aXRlcywgcnVuc0J5U3VpdGU6IG5ldyBNYXAoKSwgbG9hZGluZ30sIHN1aXRlcyk7XG4gIH1cblxuICByZW5kZXJDaGVja1N1aXRlKHBheWxvYWQsIHN1aXRlcykge1xuICAgIGlmIChzdWl0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbihwYXlsb2FkKTtcbiAgICB9XG5cbiAgICBjb25zdCBbc3VpdGVdID0gc3VpdGVzO1xuICAgIHJldHVybiAoXG4gICAgICA8Q2hlY2tSdW5zQWNjdW11bGF0b3JcbiAgICAgICAgb25EaWRSZWZldGNoPXt0aGlzLnByb3BzLm9uRGlkUmVmZXRjaH1cbiAgICAgICAgY2hlY2tTdWl0ZT17c3VpdGV9PlxuICAgICAgICB7KHtlcnJvciwgY2hlY2tSdW5zLCBsb2FkaW5nOiBydW5zTG9hZGluZ30pID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHBheWxvYWQuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBheWxvYWQucnVuc0J5U3VpdGUuc2V0KHN1aXRlLCBjaGVja1J1bnMpO1xuICAgICAgICAgIHBheWxvYWQubG9hZGluZyA9IHBheWxvYWQubG9hZGluZyB8fCBydW5zTG9hZGluZztcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDaGVja1N1aXRlKHBheWxvYWQsIHN1aXRlcy5zbGljZSgxKSk7XG4gICAgICAgIH19XG4gICAgICA8L0NoZWNrUnVuc0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlQ2hlY2tTdWl0ZXNBY2N1bXVsYXRvciwge1xuICBjb21taXQ6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQgb24gQ29tbWl0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICBjaGVja1N1aXRlQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrU3VpdGVDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICAgY2hlY2tSdW5Db3VudDoge3R5cGU6IFwiSW50IVwifVxuICAgICAgY2hlY2tSdW5DdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgaWRcbiAgICAgIGNoZWNrU3VpdGVzKFxuICAgICAgICBmaXJzdDogJGNoZWNrU3VpdGVDb3VudFxuICAgICAgICBhZnRlcjogJGNoZWNrU3VpdGVDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcIkNoZWNrU3VpdGVBY2N1bXVsYXRvcl9jaGVja1N1aXRlc1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHtcbiAgICAgICAgICBoYXNOZXh0UGFnZVxuICAgICAgICAgIGVuZEN1cnNvclxuICAgICAgICB9XG5cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIHN0YXR1c1xuICAgICAgICAgICAgY29uY2x1c2lvblxuXG4gICAgICAgICAgICAuLi5jaGVja1N1aXRlVmlld19jaGVja1N1aXRlXG4gICAgICAgICAgICAuLi5jaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlIEBhcmd1bWVudHMoXG4gICAgICAgICAgICAgIGNoZWNrUnVuQ291bnQ6ICRjaGVja1J1bkNvdW50XG4gICAgICAgICAgICAgIGNoZWNrUnVuQ3Vyc29yOiAkY2hlY2tSdW5DdXJzb3JcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLmNvbW1pdC5jaGVja1N1aXRlcztcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4gey4uLnByZXZWYXJzLCB0b3RhbENvdW50fTtcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0sIGZyYWdtZW50VmFyaWFibGVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBwcm9wcy5jb21taXQuaWQsXG4gICAgICBjaGVja1N1aXRlQ291bnQ6IGNvdW50LFxuICAgICAgY2hlY2tTdWl0ZUN1cnNvcjogY3Vyc29yLFxuICAgICAgY2hlY2tSdW5Db3VudDogZnJhZ21lbnRWYXJpYWJsZXMuY2hlY2tSdW5Db3VudCxcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yUXVlcnkoXG4gICAgICAkaWQ6IElEIVxuICAgICAgJGNoZWNrU3VpdGVDb3VudDogSW50IVxuICAgICAgJGNoZWNrU3VpdGVDdXJzb3I6IFN0cmluZ1xuICAgICAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgICApIHtcbiAgICAgIG5vZGUoaWQ6ICRpZCkge1xuICAgICAgICAuLi4gb24gQ29tbWl0IHtcbiAgICAgICAgICAuLi5jaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCBAYXJndW1lbnRzKFxuICAgICAgICAgICAgY2hlY2tTdWl0ZUNvdW50OiAkY2hlY2tTdWl0ZUNvdW50XG4gICAgICAgICAgICBjaGVja1N1aXRlQ3Vyc29yOiAkY2hlY2tTdWl0ZUN1cnNvclxuICAgICAgICAgICAgY2hlY2tSdW5Db3VudDogJGNoZWNrUnVuQ291bnRcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==