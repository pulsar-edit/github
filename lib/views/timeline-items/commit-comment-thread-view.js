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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ29tbWl0Q29tbWVudFRocmVhZFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsIml0ZW0iLCJwcm9wcyIsImNvbW1lbnRzIiwiZWRnZXMiLCJtYXAiLCJlZGdlIiwiaSIsIm5vZGUiLCJpZCIsInN3aXRjaFRvSXNzdWVpc2giLCJQcm9wVHlwZXMiLCJzaGFwZSIsImNvbW1pdCIsIm9pZCIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwib2JqZWN0IiwiZnVuYyIsImNyZWF0ZUZyYWdtZW50Q29udGFpbmVyIl0sInNvdXJjZXMiOlsiY29tbWl0LWNvbW1lbnQtdGhyZWFkLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBDb21taXRDb21tZW50VmlldyBmcm9tICcuL2NvbW1pdC1jb21tZW50LXZpZXcnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNvbW1pdENvbW1lbnRUaHJlYWRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgY29tbWl0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBvaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgZWRnZXM6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICBub2RlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgICAgKS5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHN3aXRjaFRvSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2l0ZW19ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb21taXQtY29tbWVudC10aHJlYWQgdGltZWxpbmUtaXRlbVwiPlxuICAgICAgICB7aXRlbS5jb21tZW50cy5lZGdlcy5tYXAoKGVkZ2UsIGkpID0+IChcbiAgICAgICAgICA8Q29tbWl0Q29tbWVudFZpZXdcbiAgICAgICAgICAgIGlzUmVwbHk9e2kgIT09IDB9XG4gICAgICAgICAgICBrZXk9e2VkZ2Uubm9kZS5pZH1cbiAgICAgICAgICAgIGl0ZW09e2VkZ2Uubm9kZX1cbiAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMuc3dpdGNoVG9Jc3N1ZWlzaH1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ29tbWl0Q29tbWVudFRocmVhZFZpZXcsIHtcbiAgaXRlbTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtIG9uIFB1bGxSZXF1ZXN0Q29tbWl0Q29tbWVudFRocmVhZCB7XG4gICAgICBjb21taXQgeyBvaWQgfVxuICAgICAgY29tbWVudHMoZmlyc3Q6IDEwMCkge1xuICAgICAgICBlZGdlcyB7XG4gICAgICAgICAgbm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgICAgLi4uY29tbWl0Q29tbWVudFZpZXdfaXRlbVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUFzRDtBQUFBO0FBQUE7QUFBQTtBQUUvQyxNQUFNQSwyQkFBMkIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFpQi9EQyxNQUFNLEdBQUc7SUFDUCxNQUFNO01BQUNDO0lBQUksQ0FBQyxHQUFHLElBQUksQ0FBQ0MsS0FBSztJQUN6QixPQUNFO01BQUssU0FBUyxFQUFDO0lBQXFDLEdBQ2pERCxJQUFJLENBQUNFLFFBQVEsQ0FBQ0MsS0FBSyxDQUFDQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxFQUFFQyxDQUFDLEtBQy9CLDZCQUFDLDBCQUFpQjtNQUNoQixPQUFPLEVBQUVBLENBQUMsS0FBSyxDQUFFO01BQ2pCLEdBQUcsRUFBRUQsSUFBSSxDQUFDRSxJQUFJLENBQUNDLEVBQUc7TUFDbEIsSUFBSSxFQUFFSCxJQUFJLENBQUNFLElBQUs7TUFDaEIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDTixLQUFLLENBQUNRO0lBQWlCLEVBRWpELENBQUMsQ0FDRTtFQUVWO0FBQ0Y7QUFBQztBQUFBLGdCQWhDWWIsMkJBQTJCLGVBQ25CO0VBQ2pCSSxJQUFJLEVBQUVVLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUNwQkMsTUFBTSxFQUFFRixrQkFBUyxDQUFDQyxLQUFLLENBQUM7TUFDdEJFLEdBQUcsRUFBRUgsa0JBQVMsQ0FBQ0ksTUFBTSxDQUFDQztJQUN4QixDQUFDLENBQUMsQ0FBQ0EsVUFBVTtJQUNiYixRQUFRLEVBQUVRLGtCQUFTLENBQUNDLEtBQUssQ0FBQztNQUN4QlIsS0FBSyxFQUFFTyxrQkFBUyxDQUFDTSxPQUFPLENBQ3RCTixrQkFBUyxDQUFDQyxLQUFLLENBQUM7UUFDZEosSUFBSSxFQUFFRyxrQkFBUyxDQUFDTyxNQUFNLENBQUNGO01BQ3pCLENBQUMsQ0FBQyxDQUFDQSxVQUFVLENBQ2QsQ0FBQ0E7SUFDSixDQUFDLENBQUMsQ0FBQ0E7RUFDTCxDQUFDLENBQUMsQ0FBQ0EsVUFBVTtFQUNiTixnQkFBZ0IsRUFBRUMsa0JBQVMsQ0FBQ1EsSUFBSSxDQUFDSDtBQUNuQyxDQUFDO0FBQUEsZUFvQlksSUFBQUksbUNBQXVCLEVBQUN2QiwyQkFBMkIsRUFBRTtFQUNsRUksSUFBSTtJQUFBO0lBQUE7TUFBQTtJQUFBO0lBQUE7RUFBQTtBQWFOLENBQUMsQ0FBQztBQUFBIn0=