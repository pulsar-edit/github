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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "commit-comment-thread timeline-item"
    }, item.comments.edges.map((edge, i) => /*#__PURE__*/_react.default.createElement(_commitCommentView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jb21taXQtY29tbWVudC10aHJlYWQtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlQ29tbWl0Q29tbWVudFRocmVhZFZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsIml0ZW0iLCJwcm9wcyIsImNvbW1lbnRzIiwiZWRnZXMiLCJtYXAiLCJlZGdlIiwiaSIsIm5vZGUiLCJpZCIsInN3aXRjaFRvSXNzdWVpc2giLCJQcm9wVHlwZXMiLCJzaGFwZSIsImNvbW1pdCIsIm9pZCIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwib2JqZWN0IiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFTyxNQUFNQSwyQkFBTixTQUEwQ0MsZUFBTUMsU0FBaEQsQ0FBMEQ7QUFpQi9EQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNO0FBQUNDLE1BQUFBO0FBQUQsUUFBUyxLQUFLQyxLQUFwQjtBQUNBLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHRCxJQUFJLENBQUNFLFFBQUwsQ0FBY0MsS0FBZCxDQUFvQkMsR0FBcEIsQ0FBd0IsQ0FBQ0MsSUFBRCxFQUFPQyxDQUFQLGtCQUN2Qiw2QkFBQywwQkFBRDtBQUNFLE1BQUEsT0FBTyxFQUFFQSxDQUFDLEtBQUssQ0FEakI7QUFFRSxNQUFBLEdBQUcsRUFBRUQsSUFBSSxDQUFDRSxJQUFMLENBQVVDLEVBRmpCO0FBR0UsTUFBQSxJQUFJLEVBQUVILElBQUksQ0FBQ0UsSUFIYjtBQUlFLE1BQUEsZ0JBQWdCLEVBQUUsS0FBS04sS0FBTCxDQUFXUTtBQUovQixNQURELENBREgsQ0FERjtBQVlEOztBQS9COEQ7Ozs7Z0JBQXBEYiwyQixlQUNRO0FBQ2pCSSxFQUFBQSxJQUFJLEVBQUVVLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3BCQyxJQUFBQSxNQUFNLEVBQUVGLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3RCRSxNQUFBQSxHQUFHLEVBQUVILG1CQUFVSSxNQUFWLENBQWlCQztBQURBLEtBQWhCLEVBRUxBLFVBSGlCO0FBSXBCYixJQUFBQSxRQUFRLEVBQUVRLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3hCUixNQUFBQSxLQUFLLEVBQUVPLG1CQUFVTSxPQUFWLENBQ0xOLG1CQUFVQyxLQUFWLENBQWdCO0FBQ2RKLFFBQUFBLElBQUksRUFBRUcsbUJBQVVPLE1BQVYsQ0FBaUJGO0FBRFQsT0FBaEIsRUFFR0EsVUFIRSxFQUlMQTtBQUxzQixLQUFoQixFQU1QQTtBQVZpQixHQUFoQixFQVdIQSxVQVpjO0FBYWpCTixFQUFBQSxnQkFBZ0IsRUFBRUMsbUJBQVVRLElBQVYsQ0FBZUg7QUFiaEIsQzs7ZUFrQ04seUNBQXdCbkIsMkJBQXhCLEVBQXFEO0FBQ2xFSSxFQUFBQSxJQUFJO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEOEQsQ0FBckQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgQ29tbWl0Q29tbWVudFZpZXcgZnJvbSAnLi9jb21taXQtY29tbWVudC12aWV3JztcblxuZXhwb3J0IGNsYXNzIEJhcmVDb21taXRDb21tZW50VGhyZWFkVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbW1pdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgb2lkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGVkZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgbm9kZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICAgICkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBzd2l0Y2hUb0lzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpdGVtfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tbWl0LWNvbW1lbnQtdGhyZWFkIHRpbWVsaW5lLWl0ZW1cIj5cbiAgICAgICAge2l0ZW0uY29tbWVudHMuZWRnZXMubWFwKChlZGdlLCBpKSA9PiAoXG4gICAgICAgICAgPENvbW1pdENvbW1lbnRWaWV3XG4gICAgICAgICAgICBpc1JlcGx5PXtpICE9PSAwfVxuICAgICAgICAgICAga2V5PXtlZGdlLm5vZGUuaWR9XG4gICAgICAgICAgICBpdGVtPXtlZGdlLm5vZGV9XG4gICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLnN3aXRjaFRvSXNzdWVpc2h9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUNvbW1pdENvbW1lbnRUaHJlYWRWaWV3LCB7XG4gIGl0ZW06IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSBvbiBQdWxsUmVxdWVzdENvbW1pdENvbW1lbnRUaHJlYWQge1xuICAgICAgY29tbWl0IHsgb2lkIH1cbiAgICAgIGNvbW1lbnRzKGZpcnN0OiAxMDApIHtcbiAgICAgICAgZWRnZXMge1xuICAgICAgICAgIG5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICAgIC4uLmNvbW1pdENvbW1lbnRWaWV3X2l0ZW1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==