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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQckNvbW1pdHNWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYXV0b2JpbmQiLCJsb2FkTW9yZSIsInJlbGF5IiwiUEFHRV9TSVpFIiwiZm9yY2VVcGRhdGUiLCJyZW5kZXIiLCJyZW5kZXJDb21taXRzIiwicmVuZGVyTG9hZE1vcmUiLCJoYXNNb3JlIiwicHVsbFJlcXVlc3QiLCJjb21taXRzIiwiZWRnZXMiLCJtYXAiLCJlZGdlIiwiY29tbWl0Iiwibm9kZSIsImlkIiwib25CcmFuY2giLCJvcGVuQ29tbWl0IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImlzTG9hZGluZyIsIlJlbGF5Q29ubmVjdGlvblByb3BUeXBlIiwic3RyaW5nIiwiYm9vbCIsImNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIiLCJkaXJlY3Rpb24iLCJnZXRDb25uZWN0aW9uRnJvbVByb3BzIiwiZ2V0RnJhZ21lbnRWYXJpYWJsZXMiLCJwcmV2VmFycyIsInRvdGFsQ291bnQiLCJjb21taXRDb3VudCIsImdldFZhcmlhYmxlcyIsImNvdW50IiwiY3Vyc29yIiwiZnJhZ21lbnRWYXJpYWJsZXMiLCJjb21taXRDdXJzb3IiLCJ1cmwiLCJxdWVyeSJdLCJzb3VyY2VzIjpbInByLWNvbW1pdHMtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlUGFnaW5hdGlvbkNvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IHtSZWxheUNvbm5lY3Rpb25Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUHJDb21taXRWaWV3IGZyb20gJy4vcHItY29tbWl0LXZpZXcnO1xuXG5pbXBvcnQge2F1dG9iaW5kLCBQQUdFX1NJWkV9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgUHJDb21taXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXNNb3JlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbW1pdHM6IFJlbGF5Q29ubmVjdGlvblByb3BUeXBlKFxuICAgICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgIGNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICB9KSxcbiAgICBvbkJyYW5jaDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvcGVuQ29tbWl0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2xvYWRNb3JlJyk7XG4gIH1cblxuICBsb2FkTW9yZSgpIHtcbiAgICB0aGlzLnByb3BzLnJlbGF5LmxvYWRNb3JlKFBBR0VfU0laRSwgKCkgPT4ge1xuICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdHNWaWV3LWNvbW1pdFdyYXBwZXJcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21taXRzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJMb2FkTW9yZSgpfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTG9hZE1vcmUoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnJlbGF5Lmhhc01vcmUoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdHNWaWV3LWxvYWQtbW9yZS1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5sb2FkTW9yZX0+TG9hZCBtb3JlPC9idXR0b24+O1xuICB9XG5cbiAgcmVuZGVyQ29tbWl0cygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wdWxsUmVxdWVzdC5jb21taXRzLmVkZ2VzLm1hcChlZGdlID0+IHtcbiAgICAgIGNvbnN0IGNvbW1pdCA9IGVkZ2Uubm9kZS5jb21taXQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UHJDb21taXRWaWV3XG4gICAgICAgICAga2V5PXtjb21taXQuaWR9XG4gICAgICAgICAgaXRlbT17Y29tbWl0fVxuICAgICAgICAgIG9uQnJhbmNoPXt0aGlzLnByb3BzLm9uQnJhbmNofVxuICAgICAgICAgIG9wZW5Db21taXQ9e3RoaXMucHJvcHMub3BlbkNvbW1pdH1cbiAgICAgICAgLz4pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBhZ2luYXRpb25Db250YWluZXIoUHJDb21taXRzVmlldywge1xuICBwdWxsUmVxdWVzdDogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0XG4gICAgQGFyZ3VtZW50RGVmaW5pdGlvbnMoXG4gICAgICBjb21taXRDb3VudDoge3R5cGU6IFwiSW50IVwiLCBkZWZhdWx0VmFsdWU6IDEwMH0sXG4gICAgICBjb21taXRDdXJzb3I6IHt0eXBlOiBcIlN0cmluZ1wifVxuICAgICkge1xuICAgICAgdXJsXG4gICAgICBjb21taXRzKFxuICAgICAgICBmaXJzdDogJGNvbW1pdENvdW50LCBhZnRlcjogJGNvbW1pdEN1cnNvclxuICAgICAgKSBAY29ubmVjdGlvbihrZXk6IFwicHJDb21taXRzVmlld19jb21taXRzXCIpIHtcbiAgICAgICAgcGFnZUluZm8geyBlbmRDdXJzb3IgaGFzTmV4dFBhZ2UgfVxuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBjb21taXQge1xuICAgICAgICAgICAgICBpZFxuICAgICAgICAgICAgICAuLi5wckNvbW1pdFZpZXdfaXRlbVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0sIHtcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gIGdldENvbm5lY3Rpb25Gcm9tUHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMucHVsbFJlcXVlc3QuY29tbWl0cztcbiAgfSxcbiAgZ2V0RnJhZ21lbnRWYXJpYWJsZXMocHJldlZhcnMsIHRvdGFsQ291bnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ucHJldlZhcnMsXG4gICAgICBjb21taXRDb3VudDogdG90YWxDb3VudCxcbiAgICB9O1xuICB9LFxuICBnZXRWYXJpYWJsZXMocHJvcHMsIHtjb3VudCwgY3Vyc29yfSwgZnJhZ21lbnRWYXJpYWJsZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tbWl0Q291bnQ6IGNvdW50LFxuICAgICAgY29tbWl0Q3Vyc29yOiBjdXJzb3IsXG4gICAgICB1cmw6IHByb3BzLnB1bGxSZXF1ZXN0LnVybCxcbiAgICB9O1xuICB9LFxuICBxdWVyeTogZ3JhcGhxbGBcbiAgICBxdWVyeSBwckNvbW1pdHNWaWV3UXVlcnkoJGNvbW1pdENvdW50OiBJbnQhLCAkY29tbWl0Q3Vyc29yOiBTdHJpbmcsICR1cmw6IFVSSSEpIHtcbiAgICAgICAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgICAgICAgIC4uLnByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QgQGFyZ3VtZW50cyhjb21taXRDb3VudDogJGNvbW1pdENvdW50LCBjb21taXRDdXJzb3I6ICRjb21taXRDdXJzb3IpXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBK0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV4QyxNQUFNQSxhQUFhLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBb0JqREMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFDWixJQUFBQyxpQkFBUSxFQUFDLElBQUksRUFBRSxVQUFVLENBQUM7RUFDNUI7RUFFQUMsUUFBUSxHQUFHO0lBQ1QsSUFBSSxDQUFDRixLQUFLLENBQUNHLEtBQUssQ0FBQ0QsUUFBUSxDQUFDRSxrQkFBUyxFQUFFLE1BQU07TUFDekMsSUFBSSxDQUFDQyxXQUFXLEVBQUU7SUFDcEIsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDQSxXQUFXLEVBQUU7RUFDcEI7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FDRSw2QkFBQyxlQUFRLFFBQ1A7TUFBSyxTQUFTLEVBQUM7SUFBb0MsR0FDaEQsSUFBSSxDQUFDQyxhQUFhLEVBQUUsQ0FDakIsRUFDTCxJQUFJLENBQUNDLGNBQWMsRUFBRSxDQUNiO0VBRWY7RUFFQUEsY0FBYyxHQUFHO0lBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQ1IsS0FBSyxDQUFDRyxLQUFLLENBQUNNLE9BQU8sRUFBRSxFQUFFO01BQy9C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