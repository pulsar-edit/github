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
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement("div", {
      className: "github-PrCommitsView-commitWrapper"
    }, this.renderCommits()), this.renderLoadMore());
  }

  renderLoadMore() {
    if (!this.props.relay.hasMore()) {
      return null;
    }

    return _react.default.createElement("button", {
      className: "github-PrCommitsView-load-more-button btn",
      onClick: this.loadMore
    }, "Load more");
  }

  renderCommits() {
    return this.props.pullRequest.commits.edges.map(edge => {
      const commit = edge.node.commit;
      return _react.default.createElement(_prCommitView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1jb21taXRzLXZpZXcuanMiXSwibmFtZXMiOlsiUHJDb21taXRzVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImxvYWRNb3JlIiwicmVsYXkiLCJQQUdFX1NJWkUiLCJmb3JjZVVwZGF0ZSIsInJlbmRlciIsInJlbmRlckNvbW1pdHMiLCJyZW5kZXJMb2FkTW9yZSIsImhhc01vcmUiLCJwdWxsUmVxdWVzdCIsImNvbW1pdHMiLCJlZGdlcyIsIm1hcCIsImVkZ2UiLCJjb21taXQiLCJub2RlIiwiaWQiLCJvbkJyYW5jaCIsIm9wZW5Db21taXQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiaXNMb2FkaW5nIiwic3RyaW5nIiwiYm9vbCIsImRpcmVjdGlvbiIsImdldENvbm5lY3Rpb25Gcm9tUHJvcHMiLCJnZXRGcmFnbWVudFZhcmlhYmxlcyIsInByZXZWYXJzIiwidG90YWxDb3VudCIsImNvbW1pdENvdW50IiwiZ2V0VmFyaWFibGVzIiwiY291bnQiLCJjdXJzb3IiLCJmcmFnbWVudFZhcmlhYmxlcyIsImNvbW1pdEN1cnNvciIsInVybCIsInF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBRU8sTUFBTUEsYUFBTixTQUE0QkMsZUFBTUMsU0FBbEMsQ0FBNEM7QUFvQmpEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsMkJBQVMsSUFBVCxFQUFlLFVBQWY7QUFDRDs7QUFFREMsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsU0FBS0QsS0FBTCxDQUFXRSxLQUFYLENBQWlCRCxRQUFqQixDQUEwQkUsa0JBQTFCLEVBQXFDLE1BQU07QUFDekMsV0FBS0MsV0FBTDtBQUNELEtBRkQ7QUFHQSxTQUFLQSxXQUFMO0FBQ0Q7O0FBRURDLEVB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QUFBQTs7QUFBQTtBQUFBO0FBbEJKLENBeEJZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IHtSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUHJDb21taXRWaWV3IGZyb20gJy4vcHItY29tbWl0LXZpZXcnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBQQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgUHJDb21taXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbW1pdHM6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgIGNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICB9KSxcbiAgICBvbkJyYW5jaDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2xvYWRNb3JlJyk7XG4gIH1cblxuICBsb2FkTW9yZSgpIHtcbiAgICB0aGlzLnByb3BzLnJlbGF5LmxvYWRNb3JlKFBBR0VfU0laRSwgKCkgPT4ge1xuICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdHNWaWV3LWNvbW1pdFdyYXBwZXJcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21taXRzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJMb2FkTW9yZSgpfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTG9hZE1vcmUoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlbGF5Lmhhc01vcmUoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdHNWaWV3LWxvYWQtbW9yZS1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5sb2FkTW9yZX0+TG9hZCBtb3JlPC9idXR0b24+O1xuICB9XG5cbiAgcmVuZGVyQ29tbWl0cygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5jb21taXRzLmVkZ2VzLm1hcChlZGdlID0+IHtcbiAgICAgIGNvbnN0IGNvbW1pdCA9IGVkZ2Uubm9kZS5jb21taXQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UHJDb21taXRWaWV3XG4gICAgICAgICAga2V5PXtjb21taXQuaWR9XG4gICAgICAgICAgaXRlbT17Y29tbWl0fVxuICAgICAgICAgIG9uQnJhbmNoPXt0aGlzLnByb3BzLm9uQnJhbmNofVxuICAgICAgICAgIG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH1cbiAgICAgICAgLz4pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoUHJDb21taXRzVmlldywge1xuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICBjb21taXRDb3VudDoge3R5cGU6IFwiSW50IVwiLCBkZWZhdWx0VmFsdWU6IDEwMH0sXG4gICAgICBjb21taXRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgdXJsXG4gICAgICBjb21taXRzKFxuICAgICAgICBmaXJzdDogJGNvbW1pdENvdW50LCBhZnRlcjogJGNvbW1pdEN1cnNvclxuICAgICAgKSBAY29ubmVjdGlvbihrZXk6IFwicHJDb21taXRzVmlld19jb21taXRzXCIpIHtcbiAgICAgICAgcGFnZUluZm8geyBlbmRDdXJzb3IgaGFzTmV4dFBhZ2UgfVxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBjb21taXQge1xuICAgICAgICAgICAgICBpZFxuICAgICAgICAgICAgICAuLi5wckNvbW1pdFZpZXdfaXRlbVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMucHVsbFJlcXVlc3QuY29tbWl0cztcbiAgfSxcbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucHJldlZhcnMsXG4gICAgICBjb21taXRDb3VudDogdG90YWxDb3VudCxcbiAgICB9O1xuICB9LFxuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSwgZnJhZ21lbnRWYXJpYWJsZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tbWl0Q291bnQ6IGNvdW50LFxuICAgICAgY29tbWl0Q3Vyc29yOiBjdXJzb3IsXG4gICAgICB1cmw6IHByb3BzLnB1bGxSZXF1ZXN0LnVybCxcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSBwckNvbW1pdHNWaWV3UXVlcnkoJGNvbW1pdENvdW50OiBJbnQhLCAkY29tbWl0Q3Vyc29yOiBTdHJpbmcsICR1cmw6IFVSSSEpIHtcbiAgICAgICAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgICAgICAgIC4uLnByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhjb21taXRDb3VudDogJGNvbW1pdENvdW50LCBjb21taXRDdXJzb3I6ICRjb21taXRDdXJzb3IpXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl19