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
    return /*#__PURE__*/_react.default.createElement(_accumulator.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9jaGVjay1ydW5zLWFjY3VtdWxhdG9yLmpzIl0sIm5hbWVzIjpbIkJhcmVDaGVja1J1bnNBY2N1bXVsYXRvciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicmVzdWx0QmF0Y2giLCJwcm9wcyIsImNoZWNrU3VpdGUiLCJjaGVja1J1bnMiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJub2RlIiwicmVsYXkiLCJvbkRpZFJlZmV0Y2giLCJQQUdFX1NJWkUiLCJQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyIsImVycm9yIiwibG9hZGluZyIsImNoaWxkcmVuIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJoYXNNb3JlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJsb2FkTW9yZSIsImlzTG9hZGluZyIsIm9iamVjdCIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJnZXRGcmFnbWVudFZhcmlhYmxlcyIsInByZXZWYXJzIiwidG90YWxDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwiaWQiLCJjaGVja1J1bkNvdW50IiwiY2hlY2tSdW5DdXJzb3IiLCJxdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sTUFBTUEsd0JBQU4sU0FBdUNDLGVBQU1DLFNBQTdDLENBQXVEO0FBcUI1REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsV0FBVyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQkMsU0FBdEIsQ0FBZ0NDLEtBQWhDLENBQXNDQyxHQUF0QyxDQUEwQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNDLElBQXZELENBQXBCO0FBRUEsd0JBQ0UsNkJBQUMsb0JBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRSxLQUFLTixLQUFMLENBQVdPLEtBRHBCO0FBRUUsTUFBQSxXQUFXLEVBQUVSLFdBRmY7QUFHRSxNQUFBLFlBQVksRUFBRSxLQUFLQyxLQUFMLENBQVdRLFlBSDNCO0FBSUUsTUFBQSxRQUFRLEVBQUVDLGtCQUpaO0FBS0UsTUFBQSxVQUFVLEVBQUVDO0FBTGQsT0FNRyxDQUFDQyxLQUFELEVBQVFULFNBQVIsRUFBbUJVLE9BQW5CLEtBQStCLEtBQUtaLEtBQUwsQ0FBV2EsUUFBWCxDQUFvQjtBQUFDRixNQUFBQSxLQUFEO0FBQVFULE1BQUFBLFNBQVI7QUFBbUJVLE1BQUFBO0FBQW5CLEtBQXBCLENBTmxDLENBREY7QUFVRDs7QUFsQzJEOzs7O2dCQUFqRGpCLHdCLGVBQ1E7QUFDakI7QUFDQVksRUFBQUEsS0FBSyxFQUFFTyxtQkFBVUMsS0FBVixDQUFnQjtBQUNyQkMsSUFBQUEsT0FBTyxFQUFFRixtQkFBVUcsSUFBVixDQUFlQyxVQURIO0FBRXJCQyxJQUFBQSxRQUFRLEVBQUVMLG1CQUFVRyxJQUFWLENBQWVDLFVBRko7QUFHckJFLElBQUFBLFNBQVMsRUFBRU4sbUJBQVVHLElBQVYsQ0FBZUM7QUFITCxHQUFoQixDQUZVO0FBT2pCakIsRUFBQUEsVUFBVSxFQUFFYSxtQkFBVUMsS0FBVixDQUFnQjtBQUMxQmIsSUFBQUEsU0FBUyxFQUFFLHlDQUNUWSxtQkFBVU8sTUFERDtBQURlLEdBQWhCLENBUEs7QUFhakI7QUFDQVIsRUFBQUEsUUFBUSxFQUFFQyxtQkFBVUcsSUFBVixDQUFlQyxVQWRSO0FBZ0JqQjtBQUNBVixFQUFBQSxZQUFZLEVBQUVNLG1CQUFVRyxJQUFWLENBQWVDO0FBakJaLEM7O2VBb0NOLDJDQUEwQnZCLHdCQUExQixFQUFvRDtBQUNqRU0sRUFBQUEsVUFBVTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRHVELENBQXBELEVBOEJaO0FBQ0RxQixFQUFBQSxTQUFTLEVBQUUsU0FEVjs7QUFFRDtBQUNBQyxFQUFBQSxzQkFBc0IsQ0FBQ3ZCLEtBQUQsRUFBUTtBQUM1QixXQUFPQSxLQUFLLENBQUNDLFVBQU4sQ0FBaUJDLFNBQXhCO0FBQ0QsR0FMQTs7QUFNRDtBQUNBc0IsRUFBQUEsb0JBQW9CLENBQUNDLFFBQUQsRUFBV0MsVUFBWCxFQUF1QjtBQUN6Qyw2QkFBV0QsUUFBWDtBQUFxQkMsTUFBQUE7QUFBckI7QUFDRCxHQVRBOztBQVVEO0FBQ0FDLEVBQUFBLFlBQVksQ0FBQzNCLEtBQUQsRUFBUTtBQUFDNEIsSUFBQUEsS0FBRDtBQUFRQyxJQUFBQTtBQUFSLEdBQVIsRUFBeUI7QUFDbkMsV0FBTztBQUNMQyxNQUFBQSxFQUFFLEVBQUU5QixLQUFLLENBQUNDLFVBQU4sQ0FBaUI2QixFQURoQjtBQUVMQyxNQUFBQSxhQUFhLEVBQUVILEtBRlY7QUFHTEksTUFBQUEsY0FBYyxFQUFFSDtBQUhYLEtBQVA7QUFLRCxHQWpCQTs7QUFrQkRJLEVBQUFBLEtBQUs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQWxCSixDQTlCWSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IHtSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZX0gZnJvbSAnLi4vLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge1BBR0VfU0laRSwgUEFHSU5BVElPTl9XQUlUX1RJTUVfTVN9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xuaW1wb3J0IEFjY3VtdWxhdG9yIGZyb20gJy4vYWNjdW11bGF0b3InO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNoZWNrUnVuc0FjY3VtdWxhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSBwcm9wc1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIGNoZWNrU3VpdGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjaGVja1J1bnM6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgKSxcbiAgICB9KSxcblxuICAgIC8vIFJlbmRlciBwcm9wLlxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQ2FsbGVkIHdoZW4gYSByZWZldGNoIGlzIHRyaWdnZXJlZC5cbiAgICBvbkRpZFJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVzdWx0QmF0Y2ggPSB0aGlzLnByb3BzLmNoZWNrU3VpdGUuY2hlY2tSdW5zLmVkZ2VzLm1hcChlZGdlID0+IGVkZ2Uubm9kZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFjY3VtdWxhdG9yXG4gICAgICAgIHJlbGF5PXt0aGlzLnByb3BzLnJlbGF5fVxuICAgICAgICByZXN1bHRCYXRjaD17cmVzdWx0QmF0Y2h9XG4gICAgICAgIG9uRGlkUmVmZXRjaD17dGhpcy5wcm9wcy5vbkRpZFJlZmV0Y2h9XG4gICAgICAgIHBhZ2VTaXplPXtQQUdFX1NJWkV9XG4gICAgICAgIHdhaXRUaW1lTXM9e1BBR0lOQVRJT05fV0FJVF9USU1FX01TfT5cbiAgICAgICAgeyhlcnJvciwgY2hlY2tSdW5zLCBsb2FkaW5nKSA9PiB0aGlzLnByb3BzLmNoaWxkcmVuKHtlcnJvciwgY2hlY2tSdW5zLCBsb2FkaW5nfSl9XG4gICAgICA8L0FjY3VtdWxhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcihCYXJlQ2hlY2tSdW5zQWNjdW11bGF0b3IsIHtcbiAgY2hlY2tTdWl0ZTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBjaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlIG9uIENoZWNrU3VpdGVcbiAgICBAYXJndW1lbnREZWZpbml0aW9ucyhcbiAgICAgIGNoZWNrUnVuQ291bnQ6IHt0eXBlOiBcIkludCFcIn1cbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIGlkXG4gICAgICBjaGVja1J1bnMoXG4gICAgICAgIGZpcnN0OiAkY2hlY2tSdW5Db3VudFxuICAgICAgICBhZnRlcjogJGNoZWNrUnVuQ3Vyc29yXG4gICAgICApIEBjb25uZWN0aW9uKGtleTogXCJDaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1J1bnNcIikge1xuICAgICAgICBwYWdlSW5mbyB7XG4gICAgICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgICAgICBlbmRDdXJzb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBjdXJzb3JcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgICBzdGF0dXNcbiAgICAgICAgICAgIGNvbmNsdXNpb25cblxuICAgICAgICAgICAgLi4uY2hlY2tSdW5WaWV3X2NoZWNrUnVuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSwge1xuICBkaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0Q29ubmVjdGlvbkZyb21Qcm9wcyhwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5jaGVja1N1aXRlLmNoZWNrUnVucztcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4gey4uLnByZXZWYXJzLCB0b3RhbENvdW50fTtcbiAgfSxcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHByb3BzLmNoZWNrU3VpdGUuaWQsXG4gICAgICBjaGVja1J1bkNvdW50OiBjb3VudCxcbiAgICAgIGNoZWNrUnVuQ3Vyc29yOiBjdXJzb3IsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgY2hlY2tSdW5zQWNjdW11bGF0b3JRdWVyeShcbiAgICAgICRpZDogSUQhXG4gICAgICAkY2hlY2tSdW5Db3VudDogSW50IVxuICAgICAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbiAgICApIHtcbiAgICAgIG5vZGUoaWQ6ICRpZCkge1xuICAgICAgICAuLi4gb24gQ2hlY2tTdWl0ZSB7XG4gICAgICAgICAgLi4uY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSBAYXJndW1lbnRzKFxuICAgICAgICAgICAgY2hlY2tSdW5Db3VudDogJGNoZWNrUnVuQ291bnRcbiAgICAgICAgICAgIGNoZWNrUnVuQ3Vyc29yOiAkY2hlY2tSdW5DdXJzb3JcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==