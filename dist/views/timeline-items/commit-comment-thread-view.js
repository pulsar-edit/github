"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCommitCommentThreadView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _commitCommentView = _interopRequireDefault(require("./commit-comment-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCommitCommentThreadView extends _react.default.Component {
  render() {
    const {
      item
    } = this.props;
    return _react.default.createElement("div", {
      className: "commit-comment-thread timeline-item"
    }, item.comments.edges.map((edge, i) => _react.default.createElement(_commitCommentView.default, {
      isReply: i !== 0,
      key: edge.node.id,
      item: edge.node,
      switchToIssueish: this.props.switchToIssueish
    })));
  }

}

exports.BareCommitCommentThreadView = BareCommitCommentThreadView;

_defineProperty(BareCommitCommentThreadView, "propTypes", {
  item: _propTypes.default.shape({
    commit: _propTypes.default.shape({
      oid: _propTypes.default.string.isRequired
    }).isRequired,
    comments: _propTypes.default.shape({
      edges: _propTypes.default.arrayOf(_propTypes.default.shape({
        node: _propTypes.default.object.isRequired
      }).isRequired).isRequired
    }).isRequired
  }).isRequired,
  switchToIssueish: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCommitCommentThreadView, {
  item: function () {
    const node = require("./__generated__/commitCommentThreadView_item.graphql");

    if (node.hash && node.hash !== "2f881b33df634a755a5d66b192c2791b") {
      console.error("The definition of 'commitCommentThreadView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/commitCommentThreadView_item.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXQtY29tbWVudC10aHJlYWQtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlQ29tbWl0Q29tbWVudFRocmVhZFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsIml0ZW0iLCJwcm9wcyIsImNvbW1lbnRzIiwiZWRnZXMiLCJtYXAiLCJlZGdlIiwiaSIsIm5vZGUiLCJpZCIsInN3aXRjaFRvSXNzdWVpc2giLCJQcm9wVHlwZXMiLCJzaGFwZSIsImNvbW1pdCIsIm9pZCIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwib2JqZWN0IiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFTyxNQUFNQSwyQkFBTixTQUEwQ0MsZUFBTUMsU0FBaEQsQ0FBMEQ7QUFpQi9EQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNO0FBQUNDLE1BQUFBO0FBQUQsUUFBUyxLQUFLQyxLQUFwQjtBQUNBLFdBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0dELElBQUksQ0FBQ0UsUUFBTCxDQUFjQyxLQUFkLENBQW9CQyxHQUFwQixDQUF3QixDQUFDQyxJQUFELEVBQU9DLENBQVAsS0FDdkIsNkJBQUMsMEJBQUQ7QUFDRSxNQUFBLE9BQU8sRUFBRUEsQ0FBQyxLQUFLLENBRGpCO0FBRUUsTUFBQSxHQUFHLEVBQUVELElBQUksQ0FBQ0UsSUFBTCxDQUFVQyxFQUZqQjtBQUdFLE1BQUEsSUFBSSxFQUFFSCxJQUFJLENBQUNFLElBSGI7QUFJRSxNQUFBLGdCQUFnQixFQUFFLEtBQUtOLEtBQUwsQ0FBV1E7QUFKL0IsTUFERCxDQURILENBREY7QUFZRDs7QUEvQjhEOzs7O2dCQUFwRGIsMkIsZUFDUTtBQUNqQkksRUFBQUEsSUFBSSxFQUFFVSxtQkFBVUMsS0FBVixDQUFnQjtBQUNwQkMsSUFBQUEsTUFBTSxFQUFFRixtQkFBVUMsS0FBVixDQUFnQjtBQUN0QkUsTUFBQUEsR0FBRyxFQUFFSCxtQkFBVUksTUFBVixDQUFpQkM7QUFEQSxLQUFoQixFQUVMQSxVQUhpQjtBQUlwQmIsSUFBQUEsUUFBUSxFQUFFUSxtQkFBVUMsS0FBVixDQUFnQjtBQUN4QlIsTUFBQUEsS0FBSyxFQUFFTyxtQkFBVU0sT0FBVixDQUNMTixtQkFBVUMsS0FBVixDQUFnQjtBQUNkSixRQUFBQSxJQUFJLEVBQUVHLG1CQUFVTyxNQUFWLENBQWlCRjtBQURULE9BQWhCLEVBRUdBLFVBSEUsRUFJTEE7QUFMc0IsS0FBaEIsRUFNUEE7QUFWaUIsR0FBaEIsRUFXSEEsVUFaYztBQWFqQk4sRUFBQUEsZ0JBQWdCLEVBQUVDLG1CQUFVUSxJQUFWLENBQWVIO0FBYmhCLEM7O2VBa0NOLHlDQUF3Qm5CLDJCQUF4QixFQUFxRDtBQUNsRUksRUFBQUEsSUFBSTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRDhELENBQXJELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IENvbW1pdENvbW1lbnRWaWV3IGZyb20gJy4vY29tbWl0LWNvbW1lbnQtdmlldyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ29tbWl0Q29tbWVudFRocmVhZFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBjb21taXQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG9pZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBlZGdlczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIG5vZGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgICApLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgc3dpdGNoVG9Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7aXRlbX0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1pdC1jb21tZW50LXRocmVhZCB0aW1lbGluZS1pdGVtXCI+XG4gICAgICAgIHtpdGVtLmNvbW1lbnRzLmVkZ2VzLm1hcCgoZWRnZSwgaSkgPT4gKFxuICAgICAgICAgIDxDb21taXRDb21tZW50Vmlld1xuICAgICAgICAgICAgaXNSZXBseT17aSAhPT0gMH1cbiAgICAgICAgICAgIGtleT17ZWRnZS5ub2RlLmlkfVxuICAgICAgICAgICAgaXRlbT17ZWRnZS5ub2RlfVxuICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5zd2l0Y2hUb0lzc3VlaXNofVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDb21taXRDb21tZW50VGhyZWFkVmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0gb24gUHVsbFJlcXVlc3RDb21taXRDb21tZW50VGhyZWFkIHtcbiAgICAgIGNvbW1pdCB7IG9pZCB9XG4gICAgICBjb21tZW50cyhmaXJzdDogMTAwKSB7XG4gICAgICAgIGVkZ2VzIHtcbiAgICAgICAgICBub2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgICAuLi5jb21taXRDb21tZW50Vmlld19pdGVtXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBgLFxufSk7XG4iXX0=