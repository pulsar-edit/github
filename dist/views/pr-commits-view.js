"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PrCommitsView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _propTypes2 = require("../prop-types");

var _prCommitView = _interopRequireDefault(require("./pr-commit-view"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PrCommitsView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'loadMore');
  }

  loadMore() {
    this.props.relay.loadMore(_helpers.PAGE_SIZE, () => {
      this.forceUpdate();
    });
    this.forceUpdate();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-PrCommitsView-commitWrapper"
    }, this.renderCommits()), this.renderLoadMore());
  }

  renderLoadMore() {
    if (!this.props.relay.hasMore()) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("button", {
      className: "github-PrCommitsView-load-more-button btn",
      onClick: this.loadMore
    }, "Load more");
  }

  renderCommits() {
    return this.props.pullRequest.commits.edges.map(edge => {
      const commit = edge.node.commit;
      return /*#__PURE__*/_react.default.createElement(_prCommitView.default, {
        key: commit.id,
        item: commit,
        onBranch: this.props.onBranch,
        openCommit: this.props.openCommit
      });
    });
  }

}

exports.PrCommitsView = PrCommitsView;

_defineProperty(PrCommitsView, "propTypes", {
  relay: _propTypes.default.shape({
    hasMore: _propTypes.default.func.isRequired,
    loadMore: _propTypes.default.func.isRequired,
    isLoading: _propTypes.default.func.isRequired
  }).isRequired,
  pullRequest: _propTypes.default.shape({
    commits: (0, _propTypes2.RelayConnectionPropType)(_propTypes.default.shape({
      commit: _propTypes.default.shape({
        id: _propTypes.default.string.isRequired
      })
    }))
  }),
  onBranch: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createPaginationContainer)(PrCommitsView, {
  pullRequest: function () {
    const node = require("./__generated__/prCommitsView_pullRequest.graphql");

    if (node.hash && node.hash !== "4945c525c20aac5e24befbe8b217c2c9") {
      console.error("The definition of 'prCommitsView_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/prCommitsView_pullRequest.graphql");
  }
}, {
  direction: 'forward',

  getConnectionFromProps(props) {
    return props.pullRequest.commits;
  },

  getFragmentVariables(prevVars, totalCount) {
    return _objectSpread({}, prevVars, {
      commitCount: totalCount
    });
  },

  getVariables(props, {
    count,
    cursor
  }, fragmentVariables) {
    return {
      commitCount: count,
      commitCursor: cursor,
      url: props.pullRequest.url
    };
  },

  query: function () {
    const node = require("./__generated__/prCommitsViewQuery.graphql");

    if (node.hash && node.hash !== "5fae6bf54831a4d4a70eda4117e56b7f") {
      console.error("The definition of 'prCommitsViewQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/prCommitsViewQuery.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1jb21taXRzLXZpZXcuanMiXSwibmFtZXMiOlsiUHJDb21taXRzVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImxvYWRNb3JlIiwicmVsYXkiLCJQQUdFX1NJWkUiLCJmb3JjZVVwZGF0ZSIsInJlbmRlciIsInJlbmRlckNvbW1pdHMiLCJyZW5kZXJMb2FkTW9yZSIsImhhc01vcmUiLCJwdWxsUmVxdWVzdCIsImNvbW1pdHMiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJjb21taXQiLCJub2RlIiwiaWQiLCJvbkJyYW5jaCIsIm9wZW5Db21taXQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiaXNMb2FkaW5nIiwic3RyaW5nIiwiYm9vbCIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJnZXRGcmFnbWVudFZhcmlhYmxlcyIsInByZXZWYXJzIiwidG90YWxDb3VudCIsImNvbW1pdENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJmcmFnbWVudFZhcmlhYmxlcyIsImNvbW1pdEN1cnNvciIsInVybCIsInF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRU8sTUFBTUEsYUFBTixTQUE0QkMsZUFBTUMsU0FBbEMsQ0FBNEM7QUFvQmpEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsMkJBQVMsSUFBVCxFQUFlLFVBQWY7QUFDRDs7QUFFREMsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsU0FBS0QsS0FBTCxDQUFXRSxLQUFYLENBQWlCRCxRQUFqQixDQUEwQkUsa0JBQTFCLEVBQXFDLE1BQU07QUFDekMsV0FBS0MsV0FBTDtBQUNELEtBRkQ7QUFHQSxTQUFLQSxXQUFMO0FBQ0Q7O0FBRURDLEVB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QUFBO0FBQUE7O0FBQUE7QUFBQTtBQWxCSixDQXhCWSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCB7UmVsYXlDb25uZWN0aW9uUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFByQ29tbWl0VmlldyBmcm9tICcuL3ByLWNvbW1pdC12aWV3JztcblxuaW1wb3J0IHthdXRvYmluZCwgUEFHRV9TSVpFfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGNsYXNzIFByQ29tbWl0c1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjb21taXRzOiBSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZShcbiAgICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICBjb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgfSksXG4gICAgb25CcmFuY2g6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb3BlbkNvbW1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdsb2FkTW9yZScpO1xuICB9XG5cbiAgbG9hZE1vcmUoKSB7XG4gICAgdGhpcy5wcm9wcy5yZWxheS5sb2FkTW9yZShQQUdFX1NJWkUsICgpID0+IHtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRzVmlldy1jb21taXRXcmFwcGVyXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29tbWl0cygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyTG9hZE1vcmUoKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckxvYWRNb3JlKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5yZWxheS5oYXNNb3JlKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRzVmlldy1sb2FkLW1vcmUtYnV0dG9uIGJ0blwiIG9uQ2xpY2s9e3RoaXMubG9hZE1vcmV9PkxvYWQgbW9yZTwvYnV0dG9uPjtcbiAgfVxuXG4gIHJlbmRlckNvbW1pdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucHVsbFJlcXVlc3QuY29tbWl0cy5lZGdlcy5tYXAoZWRnZSA9PiB7XG4gICAgICBjb25zdCBjb21taXQgPSBlZGdlLm5vZGUuY29tbWl0O1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFByQ29tbWl0Vmlld1xuICAgICAgICAgIGtleT17Y29tbWl0LmlkfVxuICAgICAgICAgIGl0ZW09e2NvbW1pdH1cbiAgICAgICAgICBvbkJyYW5jaD17dGhpcy5wcm9wcy5vbkJyYW5jaH1cbiAgICAgICAgICBvcGVuQ29tbWl0PXt0aGlzLnByb3BzLm9wZW5Db21taXR9XG4gICAgICAgIC8+KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQYWdpbmF0aW9uQ29udGFpbmVyKFByQ29tbWl0c1ZpZXcsIHtcbiAgcHVsbFJlcXVlc3Q6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgcHJDb21taXRzVmlld19wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdFxuICAgIEBhcmd1bWVudERlZmluaXRpb25zKFxuICAgICAgY29tbWl0Q291bnQ6IHt0eXBlOiBcIkludCFcIiwgZGVmYXVsdFZhbHVlOiAxMDB9LFxuICAgICAgY29tbWl0Q3Vyc29yOiB7dHlwZTogXCJTdHJpbmdcIn1cbiAgICApIHtcbiAgICAgIHVybFxuICAgICAgY29tbWl0cyhcbiAgICAgICAgZmlyc3Q6ICRjb21taXRDb3VudCwgYWZ0ZXI6ICRjb21taXRDdXJzb3JcbiAgICAgICkgQGNvbm5lY3Rpb24oa2V5OiBcInByQ29tbWl0c1ZpZXdfY29tbWl0c1wiKSB7XG4gICAgICAgIHBhZ2VJbmZvIHsgZW5kQ3Vyc29yIGhhc05leHRQYWdlIH1cbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIGN1cnNvclxuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgY29tbWl0IHtcbiAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgICAgLi4ucHJDb21taXRWaWV3X2l0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59LCB7XG4gIGRpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICBnZXRDb25uZWN0aW9uRnJvbVByb3BzKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnB1bGxSZXF1ZXN0LmNvbW1pdHM7XG4gIH0sXG4gIGdldEZyYWdtZW50VmFyaWFibGVzKHByZXZWYXJzLCB0b3RhbENvdW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnByZXZWYXJzLFxuICAgICAgY29tbWl0Q291bnQ6IHRvdGFsQ291bnQsXG4gICAgfTtcbiAgfSxcbiAgZ2V0VmFyaWFibGVzKHByb3BzLCB7Y291bnQsIGN1cnNvcn0sIGZyYWdtZW50VmFyaWFibGVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbW1pdENvdW50OiBjb3VudCxcbiAgICAgIGNvbW1pdEN1cnNvcjogY3Vyc29yLFxuICAgICAgdXJsOiBwcm9wcy5wdWxsUmVxdWVzdC51cmwsXG4gICAgfTtcbiAgfSxcbiAgcXVlcnk6IGdyYXBocWxgXG4gICAgcXVlcnkgcHJDb21taXRzVmlld1F1ZXJ5KCRjb21taXRDb3VudDogSW50ISwgJGNvbW1pdEN1cnNvcjogU3RyaW5nLCAkdXJsOiBVUkkhKSB7XG4gICAgICAgIHJlc291cmNlKHVybDogJHVybCkge1xuICAgICAgICAgIC4uLiBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICAgICAgICAuLi5wckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0IEBhcmd1bWVudHMoY29tbWl0Q291bnQ6ICRjb21taXRDb3VudCwgY29tbWl0Q3Vyc29yOiAkY29tbWl0Q3Vyc29yKVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==