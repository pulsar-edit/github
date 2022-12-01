"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PrCommitView = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _nodeEmoji = require("node-emoji");

var _moment = _interopRequireDefault(require("moment"));

var _reactRelay = require("react-relay");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const avatarAltText = 'committer avatar';

class PrCommitView extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "openCommitDetailItem", () => this.props.openCommit({
      sha: this.props.item.sha
    }));

    this.state = {
      showMessageBody: false
    };
    (0, _helpers.autobind)(this, 'toggleShowCommitMessageBody', 'humanizeTimeSince');
  }

  toggleShowCommitMessageBody() {
    this.setState({
      showMessageBody: !this.state.showMessageBody
    });
  }

  humanizeTimeSince(date) {
    return (0, _moment.default)(date).fromNow();
  }

  render() {
    const {
      messageHeadline,
      messageBody,
      shortSha,
      url
    } = this.props.item;
    const {
      avatarUrl,
      name,
      date
    } = this.props.item.committer;
    return _react.default.createElement("div", {
      className: "github-PrCommitView-container"
    }, _react.default.createElement("div", {
      className: "github-PrCommitView-commit"
    }, _react.default.createElement("h3", {
      className: "github-PrCommitView-title"
    }, this.props.onBranch ? _react.default.createElement("button", {
      className: "github-PrCommitView-messageHeadline is-button",
      onClick: this.openCommitDetailItem
    }, (0, _nodeEmoji.emojify)(messageHeadline)) : _react.default.createElement("span", {
      className: "github-PrCommitView-messageHeadline"
    }, (0, _nodeEmoji.emojify)(messageHeadline)), messageBody ? _react.default.createElement("button", {
      className: "github-PrCommitView-moreButton",
      onClick: this.toggleShowCommitMessageBody
    }, this.state.showMessageBody ? 'hide' : 'show', " more...") : null), _react.default.createElement("div", {
      className: "github-PrCommitView-meta"
    }, _react.default.createElement("img", {
      className: "github-PrCommitView-avatar",
      src: avatarUrl,
      alt: avatarAltText,
      title: avatarAltText
    }), _react.default.createElement("span", {
      className: "github-PrCommitView-metaText"
    }, name, " committed ", this.humanizeTimeSince(date))), this.state.showMessageBody ? _react.default.createElement("pre", {
      className: "github-PrCommitView-moreText"
    }, (0, _nodeEmoji.emojify)(messageBody)) : null), _react.default.createElement("div", {
      className: "github-PrCommitView-sha"
    }, _react.default.createElement("a", {
      href: url,
      title: `open commit ${shortSha} on GitHub.com`
    }, shortSha)));
  }

}

exports.PrCommitView = PrCommitView;

_defineProperty(PrCommitView, "propTypes", {
  item: _propTypes.default.shape({
    committer: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      name: _propTypes.default.string.isRequired,
      date: _propTypes.default.string.isRequired
    }).isRequired,
    messageBody: _propTypes.default.string,
    messageHeadline: _propTypes.default.string.isRequired,
    shortSha: _propTypes.default.string.isRequired,
    sha: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired,
  onBranch: _propTypes.default.bool.isRequired,
  openCommit: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(PrCommitView, {
  item: function () {
    const node = require("./__generated__/prCommitView_item.graphql");

    if (node.hash && node.hash !== "2bd193bec5d758f465d9428ff3cd8a09") {
      console.error("The definition of 'prCommitView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/prCommitView_item.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9wci1jb21taXQtdmlldy5qcyJdLCJuYW1lcyI6WyJhdmF0YXJBbHRUZXh0IiwiUHJDb21taXRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwib3BlbkNvbW1pdCIsInNoYSIsIml0ZW0iLCJzdGF0ZSIsInNob3dNZXNzYWdlQm9keSIsInRvZ2dsZVNob3dDb21taXRNZXNzYWdlQm9keSIsInNldFN0YXRlIiwiaHVtYW5pemVUaW1lU2luY2UiLCJkYXRlIiwiZnJvbU5vdyIsInJlbmRlciIsIm1lc3NhZ2VIZWFkbGluZSIsIm1lc3NhZ2VCb2R5Iiwic2hvcnRTaGEiLCJ1cmwiLCJhdmF0YXJVcmwiLCJuYW1lIiwiY29tbWl0dGVyIiwib25CcmFuY2giLCJvcGVuQ29tbWl0RGV0YWlsSXRlbSIsIlByb3BUeXBlcyIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBLE1BQU1BLGFBQWEsR0FBRyxrQkFBdEI7O0FBRU8sTUFBTUMsWUFBTixTQUEyQkMsZUFBTUMsU0FBakMsQ0FBMkM7QUFrQmhEQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNqQixVQUFNQSxLQUFOOztBQURpQixrREFjSSxNQUFNLEtBQUtBLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQjtBQUFDQyxNQUFBQSxHQUFHLEVBQUUsS0FBS0YsS0FBTCxDQUFXRyxJQUFYLENBQWdCRDtBQUF0QixLQUF0QixDQWRWOztBQUVqQixTQUFLRSxLQUFMLEdBQWE7QUFBQ0MsTUFBQUEsZUFBZSxFQUFFO0FBQWxCLEtBQWI7QUFDQSwyQkFBUyxJQUFULEVBQWUsNkJBQWYsRUFBOEMsbUJBQTlDO0FBQ0Q7O0FBRURDLEVBQUFBLDJCQUEyQixHQUFHO0FBQzVCLFNBQUtDLFFBQUwsQ0FBYztBQUFD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akJMLEVBQUFBLFFBQVEsRUFBRUUsbUJBQVVJLElBQVYsQ0FBZUQsVUFiUjtBQWNqQnZCLEVBQUFBLFVBQVUsRUFBRW9CLG1CQUFVSyxJQUFWLENBQWVGO0FBZFYsQzs7ZUErRU4seUNBQXdCNUIsWUFBeEIsRUFBc0M7QUFDbkRPLEVBQUFBLElBQUk7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQrQyxDQUF0QyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2Vtb2ppZnl9IGZyb20gJ25vZGUtZW1vamknO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuY29uc3QgYXZhdGFyQWx0VGV4dCA9ICdjb21taXR0ZXIgYXZhdGFyJztcblxuZXhwb3J0IGNsYXNzIFByQ29tbWl0VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGNvbW1pdHRlcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgZGF0ZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIG1lc3NhZ2VCb2R5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgbWVzc2FnZUhlYWRsaW5lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBzaG9ydFNoYTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgc2hhOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIG9uQnJhbmNoOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG9wZW5Db21taXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge3Nob3dNZXNzYWdlQm9keTogZmFsc2V9O1xuICAgIGF1dG9iaW5kKHRoaXMsICd0b2dnbGVTaG93Q29tbWl0TWVzc2FnZUJvZHknLCAnaHVtYW5pemVUaW1lU2luY2UnKTtcbiAgfVxuXG4gIHRvZ2dsZVNob3dDb21taXRNZXNzYWdlQm9keSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaG93TWVzc2FnZUJvZHk6ICF0aGlzLnN0YXRlLnNob3dNZXNzYWdlQm9keX0pO1xuICB9XG5cbiAgaHVtYW5pemVUaW1lU2luY2UoZGF0ZSkge1xuICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZnJvbU5vdygpO1xuICB9XG5cbiAgb3BlbkNvbW1pdERldGFpbEl0ZW0gPSAoKSA9PiB0aGlzLnByb3BzLm9wZW5Db21taXQoe3NoYTogdGhpcy5wcm9wcy5pdGVtLnNoYX0pXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttZXNzYWdlSGVhZGxpbmUsIG1lc3NhZ2VCb2R5LCBzaG9ydFNoYSwgdXJsfSA9IHRoaXMucHJvcHMuaXRlbTtcbiAgICBjb25zdCB7YXZhdGFyVXJsLCBuYW1lLCBkYXRlfSA9IHRoaXMucHJvcHMuaXRlbS5jb21taXR0ZXI7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRWaWV3LWNvbW1pdFwiPlxuICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRWaWV3LXRpdGxlXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5vbkJyYW5jaFxuICAgICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctbWVzc2FnZUhlYWRsaW5lIGlzLWJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMub3BlbkNvbW1pdERldGFpbEl0ZW19PlxuICAgICAgICAgICAgICAgICAge2Vtb2ppZnkobWVzc2FnZUhlYWRsaW5lKX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctbWVzc2FnZUhlYWRsaW5lXCI+e2Vtb2ppZnkobWVzc2FnZUhlYWRsaW5lKX08L3NwYW4+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB7bWVzc2FnZUJvZHkgP1xuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVByQ29tbWl0Vmlldy1tb3JlQnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVNob3dDb21taXRNZXNzYWdlQm9keX0+XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuc2hvd01lc3NhZ2VCb2R5ID8gJ2hpZGUnIDogJ3Nob3cnfSBtb3JlLi4uXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA6IG51bGx9XG4gICAgICAgICAgPC9oMz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctbWV0YVwiPlxuICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRWaWV3LWF2YXRhclwiXG4gICAgICAgICAgICAgIHNyYz17YXZhdGFyVXJsfVxuICAgICAgICAgICAgICBhbHQ9e2F2YXRhckFsdFRleHR9IHRpdGxlPXthdmF0YXJBbHRUZXh0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctbWV0YVRleHRcIj5cbiAgICAgICAgICAgICAge25hbWV9IGNvbW1pdHRlZCB7dGhpcy5odW1hbml6ZVRpbWVTaW5jZShkYXRlKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5zaG93TWVzc2FnZUJvZHkgPyA8cHJlIGNsYXNzTmFtZT1cImdpdGh1Yi1QckNvbW1pdFZpZXctbW9yZVRleHRcIj5cbiAgICAgICAgICAgIHtlbW9qaWZ5KG1lc3NhZ2VCb2R5KX08L3ByZT4gOiBudWxsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUHJDb21taXRWaWV3LXNoYVwiPlxuICAgICAgICAgIDxhIGhyZWY9e3VybH1cbiAgICAgICAgICAgIHRpdGxlPXtgb3BlbiBjb21taXQgJHtzaG9ydFNoYX0gb24gR2l0SHViLmNvbWB9PlxuICAgICAgICAgICAge3Nob3J0U2hhfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKFByQ29tbWl0Vmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IHByQ29tbWl0Vmlld19pdGVtIG9uIENvbW1pdCB7XG4gICAgICBjb21taXR0ZXIge1xuICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgbmFtZVxuICAgICAgICBkYXRlXG4gICAgICB9XG4gICAgICBtZXNzYWdlSGVhZGxpbmVcbiAgICAgIG1lc3NhZ2VCb2R5XG4gICAgICBzaG9ydFNoYTogYWJicmV2aWF0ZWRPaWRcbiAgICAgIHNoYTogb2lkXG4gICAgICB1cmxcbiAgICB9YCxcbn0pO1xuIl19