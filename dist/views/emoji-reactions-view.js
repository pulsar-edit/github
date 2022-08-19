"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareEmojiReactionsView = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _classnames = _interopRequireDefault(require("classnames"));

var _reactionPickerController = _interopRequireDefault(require("../controllers/reaction-picker-controller"));

var _tooltip = _interopRequireDefault(require("../atom/tooltip"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareEmojiReactionsView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refAddButton = new _refHolder.default();
    this.refTooltip = new _refHolder.default();
  }

  render() {
    const viewerReacted = this.props.reactable.reactionGroups.filter(group => group.viewerHasReacted).map(group => group.content);
    const {
      reactionGroups
    } = this.props.reactable;
    const showAddButton = reactionGroups.length === 0 || reactionGroups.some(g => g.users.totalCount === 0);
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-EmojiReactions btn-toolbar"
    }, showAddButton && /*#__PURE__*/_react.default.createElement("div", {
      className: "btn-group"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "github-EmojiReactions-add btn icon icon-smiley",
      ref: this.refAddButton.setter,
      disabled: !this.props.reactable.viewerCanReact
    }), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refAddButton,
      trigger: "click",
      className: "github-Popover",
      refTooltip: this.refTooltip
    }, /*#__PURE__*/_react.default.createElement(_reactionPickerController.default, {
      viewerReacted: viewerReacted,
      addReaction: this.props.addReaction,
      removeReaction: this.props.removeReaction,
      tooltipHolder: this.refTooltip
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "btn-group"
    }, this.props.reactable.reactionGroups.map(group => {
      const emoji = _helpers.reactionTypeToEmoji[group.content];

      if (!emoji) {
        return null;
      }

      if (group.users.totalCount === 0) {
        return null;
      }

      const className = (0, _classnames.default)('github-EmojiReactions-group', 'btn', group.content.toLowerCase(), {
        selected: group.viewerHasReacted
      });
      const toggle = !group.viewerHasReacted ? () => this.props.addReaction(group.content) : () => this.props.removeReaction(group.content);
      const disabled = !this.props.reactable.viewerCanReact;
      return /*#__PURE__*/_react.default.createElement("button", {
        key: group.content,
        className: className,
        onClick: toggle,
        disabled: disabled
      }, _helpers.reactionTypeToEmoji[group.content], " \xA0 ", group.users.totalCount);
    })));
  }

}

exports.BareEmojiReactionsView = BareEmojiReactionsView;

_defineProperty(BareEmojiReactionsView, "propTypes", {
  // Relay response
  reactable: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    reactionGroups: _propTypes.default.arrayOf(_propTypes.default.shape({
      content: _propTypes.default.string.isRequired,
      viewerHasReacted: _propTypes.default.bool.isRequired,
      users: _propTypes.default.shape({
        totalCount: _propTypes.default.number.isRequired
      }).isRequired
    })).isRequired,
    viewerCanReact: _propTypes.default.bool.isRequired
  }).isRequired,
  // Atom environment
  tooltips: _propTypes.default.object.isRequired,
  // Action methods
  addReaction: _propTypes.default.func.isRequired,
  removeReaction: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareEmojiReactionsView, {
  reactable: function () {
    const node = require("./__generated__/emojiReactionsView_reactable.graphql");

    if (node.hash && node.hash !== "fde156007f42d841401632fce79875d5") {
      console.error("The definition of 'emojiReactionsView_reactable' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/emojiReactionsView_reactable.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9lbW9qaS1yZWFjdGlvbnMtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlRW1vamlSZWFjdGlvbnNWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmQWRkQnV0dG9uIiwiUmVmSG9sZGVyIiwicmVmVG9vbHRpcCIsInJlbmRlciIsInZpZXdlclJlYWN0ZWQiLCJyZWFjdGFibGUiLCJyZWFjdGlvbkdyb3VwcyIsImZpbHRlciIsImdyb3VwIiwidmlld2VySGFzUmVhY3RlZCIsIm1hcCIsImNvbnRlbnQiLCJzaG93QWRkQnV0dG9uIiwibGVuZ3RoIiwic29tZSIsImciLCJ1c2VycyIsInRvdGFsQ291bnQiLCJzZXR0ZXIiLCJ2aWV3ZXJDYW5SZWFjdCIsInRvb2x0aXBzIiwiYWRkUmVhY3Rpb24iLCJyZW1vdmVSZWFjdGlvbiIsImVtb2ppIiwicmVhY3Rpb25UeXBlVG9FbW9qaSIsImNsYXNzTmFtZSIsInRvTG93ZXJDYXNlIiwic2VsZWN0ZWQiLCJ0b2dnbGUiLCJkaXNhYmxlZCIsIlByb3BUeXBlcyIsInNoYXBlIiwiaWQiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImJvb2wiLCJudW1iZXIiLCJvYmplY3QiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLHNCQUFOLFNBQXFDQyxlQUFNQyxTQUEzQyxDQUFxRDtBQXlCMURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFFQSxTQUFLQyxZQUFMLEdBQW9CLElBQUlDLGtCQUFKLEVBQXBCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixJQUFJRCxrQkFBSixFQUFsQjtBQUNEOztBQUVERSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxVQUFNQyxhQUFhLEdBQUcsS0FBS0wsS0FBTCxDQUFXTSxTQUFYLENBQXFCQyxjQUFyQixDQUNuQkMsTUFEbUIsQ0FDWkMsS0FBSyxJQUFJQSxLQUFLLENBQUNDLGdCQURILEVBRW5CQyxHQUZtQixDQUVmRixLQUFLLElBQUlBLEtBQUssQ0FBQ0csT0FGQSxDQUF0QjtBQUdBLFVBQU07QUFBQ0wsTUFBQUE7QUFBRCxRQUFtQixLQUFLUCxLQUFMLENBQVdNLFNBQXBDO0FBQ0EsVUFBTU8sYUFBYSxHQUFHTixjQUFjLENBQUNPLE1BQWYsS0FBMEIsQ0FBMUIsSUFBK0JQLGNBQWMsQ0FBQ1EsSUFBZixDQUFvQkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEtBQUYsQ0FBUUMsVUFBUixLQUF1QixDQUFoRCxDQUFyRDtBQUVBLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHTCxhQUFhLGlCQUNaO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUNFLE1BQUEsU0FBUyxFQUFDLGdEQURaO0FBRUUsTUFBQSxHQUFHLEVBQUUsS0FBS1osWUFBTCxDQUFrQmtCLE1BRnpCO0FBR0UsTUFBQSxRQUFRLEVBQUUsQ0FBQyxLQUFLbkIsS0FBTCxDQUFXTSxTQUFYLENBQXFCYztBQUhsQyxNQURGLGVBTUUsNkJBQUMsZ0JBQUQ7QUFDRSxNQUFBLE9BQU8sRUFBRSxLQUFLcEIsS0FBTCxDQUFXcUIsUUFEdEI7QUFFRSxNQUFBLE1BQU0sRUFBRSxLQUFLcEIsWUFGZjtBQUdFLE1BQUEsT0FBTyxFQUFDLE9BSFY7QUFJRSxNQUFBLFNBQVMsRUFBQyxnQkFKWjtBQUtFLE1BQUEsVUFBVSxFQUFFLEtBQUtFO0FBTG5CLG9CQU1FLDZCQUFDLGlDQUFEO0FBQ0UsTUFBQSxhQUFhLEVBQUVFLGFBRGpCO0FBRUUsTUFBQSxXQUFXLEVBQUUsS0FBS0wsS0FBTCxDQUFXc0IsV0FGMUI7QUFHRSxNQUFBLGNBQWMsRUFBRSxLQUFLdEIsS0FBTCxDQUFXdUIsY0FIN0I7QUFJRSxNQUFBLGFBQWEsRUFBRSxLQUFLcEI7QUFKdEIsTUFORixDQU5GLENBRkosZUF1QkU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0csS0FBS0gsS0FBTCxDQUFXTSxTQUFYLENBQXFCQyxjQUFyQixDQUFvQ0ksR0FBcEMsQ0FBd0NGLEtBQUssSUFBSTtBQUNoRCxZQUFNZSxLQUFLLEdBQUdDLDZCQUFvQmhCLEtBQUssQ0FBQ0csT0FBMUIsQ0FBZDs7QUFDQSxVQUFJLENBQUNZLEtBQUwsRUFBWTtBQUNWLGVBQU8sSUFBUDtBQUNEOztBQUNELFVBQUlmLEtBQUssQ0FBQ1EsS0FBTixDQUFZQyxVQUFaLEtBQTJCLENBQS9CLEVBQWtDO0FBQ2hDLGVBQU8sSUFBUDtBQUNEOztBQUVELFlBQU1RLFNBQVMsR0FBRyx5QkFDaEIsNkJBRGdCLEVBRWhCLEtBRmdCLEVBR2hCakIsS0FBSyxDQUFDRyxPQUFOLENBQWNlLFdBQWQsRUFIZ0IsRUFJaEI7QUFBQ0MsUUFBQUEsUUFBUSxFQUFFbkIsS0FBSyxDQUFDQztBQUFqQixPQUpnQixDQUFsQjtBQU9BLFlBQU1tQixNQUFNLEdBQUcsQ0FBQ3BCLEtBQUssQ0FBQ0MsZ0JBQVAsR0FDWCxNQUFNLEtBQUtWLEtBQUwsQ0FBV3NCLFdBQVgsQ0FBdUJiLEtBQUssQ0FBQ0csT0FBN0IsQ0FESyxHQUVYLE1BQU0sS0FBS1osS0FBTCxDQUFXdUIsY0FBWCxDQUEwQmQsS0FBSyxDQUFDRyxPQUFoQyxDQUZWO0FBSUEsWUFBTWtCLFFBQVEsR0FBRyxDQUFDLEtBQUs5QixLQUFMLENBQVdNLFNBQVgsQ0FBcUJjLGNBQXZDO0FBRUEsMEJBQ0U7QUFBUSxRQUFBLEdBQUcsRUFBRVgsS0FBSyxDQUFDRyxPQUFuQjtBQUE0QixRQUFBLFNBQVMsRUFBRWMsU0FBdkM7QUFBa0QsUUFBQSxPQUFPLEVBQUVHLE1BQTNEO0FBQW1FLFFBQUEsUUFBUSxFQUFFQztBQUE3RSxTQUNHTCw2QkFBb0JoQixLQUFLLENBQUNHLE9BQTFCLENBREgsWUFDK0NILEtBQUssQ0FBQ1EsS0FBTixDQUFZQyxVQUQzRCxDQURGO0FBS0QsS0EzQkEsQ0FESCxDQXZCRixDQURGO0FBd0REOztBQS9GeUQ7Ozs7Z0JBQS9DdEIsc0IsZUFDUTtBQUNqQjtBQUNBVSxFQUFBQSxTQUFTLEVBQUV5QixtQkFBVUMsS0FBVixDQUFnQjtBQUN6QkMsSUFBQUEsRUFBRSxFQUFFRixtQkFBVUcsTUFBVixDQUFpQkMsVUFESTtBQUV6QjVCLElBQUFBLGNBQWMsRUFBRXdCLG1CQUFVSyxPQUFWLENBQ2RMLG1CQUFVQyxLQUFWLENBQWdCO0FBQ2RwQixNQUFBQSxPQUFPLEVBQUVtQixtQkFBVUcsTUFBVixDQUFpQkMsVUFEWjtBQUVkekIsTUFBQUEsZ0JBQWdCLEVBQUVxQixtQkFBVU0sSUFBVixDQUFlRixVQUZuQjtBQUdkbEIsTUFBQUEsS0FBSyxFQUFFYyxtQkFBVUMsS0FBVixDQUFnQjtBQUNyQmQsUUFBQUEsVUFBVSxFQUFFYSxtQkFBVU8sTUFBVixDQUFpQkg7QUFEUixPQUFoQixFQUVKQTtBQUxXLEtBQWhCLENBRGMsRUFRZEEsVUFWdUI7QUFXekJmLElBQUFBLGNBQWMsRUFBRVcsbUJBQVVNLElBQVYsQ0FBZUY7QUFYTixHQUFoQixFQVlSQSxVQWRjO0FBZ0JqQjtBQUNBZCxFQUFBQSxRQUFRLEVBQUVVLG1CQUFVUSxNQUFWLENBQWlCSixVQWpCVjtBQW1CakI7QUFDQWIsRUFBQUEsV0FBVyxFQUFFUyxtQkFBVVMsSUFBVixDQUFlTCxVQXBCWDtBQXFCakJaLEVBQUFBLGNBQWMsRUFBRVEsbUJBQVVTLElBQVYsQ0FBZUw7QUFyQmQsQzs7ZUFpR04seUNBQXdCdkMsc0JBQXhCLEVBQWdEO0FBQzdEVSxFQUFBQSxTQUFTO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEb0QsQ0FBaEQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgUmVhY3Rpb25QaWNrZXJDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL3JlYWN0aW9uLXBpY2tlci1jb250cm9sbGVyJztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7cmVhY3Rpb25UeXBlVG9FbW9qaX0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlRW1vamlSZWFjdGlvbnNWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSByZXNwb25zZVxuICAgIHJlYWN0YWJsZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICByZWFjdGlvbkdyb3VwczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgY29udGVudDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgIHZpZXdlckhhc1JlYWN0ZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICAgICAgdXNlcnM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICB0b3RhbENvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgICAgfSksXG4gICAgICApLmlzUmVxdWlyZWQsXG4gICAgICB2aWV3ZXJDYW5SZWFjdDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIGFkZFJlYWN0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlbW92ZVJlYWN0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZkFkZEJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlZlRvb2x0aXAgPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgdmlld2VyUmVhY3RlZCA9IHRoaXMucHJvcHMucmVhY3RhYmxlLnJlYWN0aW9uR3JvdXBzXG4gICAgICAuZmlsdGVyKGdyb3VwID0+IGdyb3VwLnZpZXdlckhhc1JlYWN0ZWQpXG4gICAgICAubWFwKGdyb3VwID0+IGdyb3VwLmNvbnRlbnQpO1xuICAgIGNvbnN0IHtyZWFjdGlvbkdyb3Vwc30gPSB0aGlzLnByb3BzLnJlYWN0YWJsZTtcbiAgICBjb25zdCBzaG93QWRkQnV0dG9uID0gcmVhY3Rpb25Hcm91cHMubGVuZ3RoID09PSAwIHx8IHJlYWN0aW9uR3JvdXBzLnNvbWUoZyA9PiBnLnVzZXJzLnRvdGFsQ291bnQgPT09IDApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUVtb2ppUmVhY3Rpb25zIGJ0bi10b29sYmFyXCI+XG4gICAgICAgIHtzaG93QWRkQnV0dG9uICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItRW1vamlSZWFjdGlvbnMtYWRkIGJ0biBpY29uIGljb24tc21pbGV5XCJcbiAgICAgICAgICAgICAgcmVmPXt0aGlzLnJlZkFkZEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5wcm9wcy5yZWFjdGFibGUudmlld2VyQ2FuUmVhY3R9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkFkZEJ1dHRvbn1cbiAgICAgICAgICAgICAgdHJpZ2dlcj1cImNsaWNrXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVBvcG92ZXJcIlxuICAgICAgICAgICAgICByZWZUb29sdGlwPXt0aGlzLnJlZlRvb2x0aXB9PlxuICAgICAgICAgICAgICA8UmVhY3Rpb25QaWNrZXJDb250cm9sbGVyXG4gICAgICAgICAgICAgICAgdmlld2VyUmVhY3RlZD17dmlld2VyUmVhY3RlZH1cbiAgICAgICAgICAgICAgICBhZGRSZWFjdGlvbj17dGhpcy5wcm9wcy5hZGRSZWFjdGlvbn1cbiAgICAgICAgICAgICAgICByZW1vdmVSZWFjdGlvbj17dGhpcy5wcm9wcy5yZW1vdmVSZWFjdGlvbn1cbiAgICAgICAgICAgICAgICB0b29sdGlwSG9sZGVyPXt0aGlzLnJlZlRvb2x0aXB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMucmVhY3RhYmxlLnJlYWN0aW9uR3JvdXBzLm1hcChncm91cCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbW9qaSA9IHJlYWN0aW9uVHlwZVRvRW1vamlbZ3JvdXAuY29udGVudF07XG4gICAgICAgICAgICBpZiAoIWVtb2ppKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyb3VwLnVzZXJzLnRvdGFsQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN4KFxuICAgICAgICAgICAgICAnZ2l0aHViLUVtb2ppUmVhY3Rpb25zLWdyb3VwJyxcbiAgICAgICAgICAgICAgJ2J0bicsXG4gICAgICAgICAgICAgIGdyb3VwLmNvbnRlbnQudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAge3NlbGVjdGVkOiBncm91cC52aWV3ZXJIYXNSZWFjdGVkfSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRvZ2dsZSA9ICFncm91cC52aWV3ZXJIYXNSZWFjdGVkXG4gICAgICAgICAgICAgID8gKCkgPT4gdGhpcy5wcm9wcy5hZGRSZWFjdGlvbihncm91cC5jb250ZW50KVxuICAgICAgICAgICAgICA6ICgpID0+IHRoaXMucHJvcHMucmVtb3ZlUmVhY3Rpb24oZ3JvdXAuY29udGVudCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpc2FibGVkID0gIXRoaXMucHJvcHMucmVhY3RhYmxlLnZpZXdlckNhblJlYWN0O1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17Z3JvdXAuY29udGVudH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IG9uQ2xpY2s9e3RvZ2dsZX0gZGlzYWJsZWQ9e2Rpc2FibGVkfT5cbiAgICAgICAgICAgICAgICB7cmVhY3Rpb25UeXBlVG9FbW9qaVtncm91cC5jb250ZW50XX0gJm5ic3A7IHtncm91cC51c2Vycy50b3RhbENvdW50fVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlRW1vamlSZWFjdGlvbnNWaWV3LCB7XG4gIHJlYWN0YWJsZTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gICAgICBpZFxuICAgICAgcmVhY3Rpb25Hcm91cHMge1xuICAgICAgICBjb250ZW50XG4gICAgICAgIHZpZXdlckhhc1JlYWN0ZWRcbiAgICAgICAgdXNlcnMge1xuICAgICAgICAgIHRvdGFsQ291bnRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlld2VyQ2FuUmVhY3RcbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==