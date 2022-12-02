"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCrossReferencedEventsView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _timeago = _interopRequireDefault(require("../../views/timeago"));

var _crossReferencedEventView = _interopRequireDefault(require("./cross-referenced-event-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCrossReferencedEventsView extends _react.default.Component {
  render() {
    return _react.default.createElement("div", {
      className: "timeline-item cross-referenced-events"
    }, _react.default.createElement("div", {
      className: "info-row"
    }, _react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "bookmark"
    }), _react.default.createElement("span", {
      className: "cross-referenced-event-header"
    }, this.renderSummary())), this.renderEvents());
  }

  renderSummary() {
    const first = this.props.nodes[0];

    if (this.props.nodes.length > 1) {
      return _react.default.createElement("span", null, "This was referenced ", _react.default.createElement(_timeago.default, {
        time: first.referencedAt
      }));
    } else {
      const type = {
        PullRequest: 'a pull request',
        Issue: 'an issue'
      }[first.source.__typename];
      let xrefClause = '';

      if (first.isCrossRepository) {
        const repo = first.source.repository;
        xrefClause = _react.default.createElement("span", null, "in ", _react.default.createElement("strong", null, repo.owner.login, "/", repo.name));
      }

      return _react.default.createElement("span", null, _react.default.createElement("img", {
        className: "author-avatar",
        src: first.actor.avatarUrl,
        alt: first.actor.login,
        title: first.actor.login
      }), _react.default.createElement("strong", null, first.actor.login), " referenced this from ", type, " ", xrefClause, _react.default.createElement(_timeago.default, {
        time: first.referencedAt
      }));
    }
  }

  renderEvents() {
    return this.props.nodes.map(node => {
      return _react.default.createElement(_crossReferencedEventView.default, {
        key: node.id,
        item: node
      });
    });
  }

}

exports.BareCrossReferencedEventsView = BareCrossReferencedEventsView;

_defineProperty(BareCrossReferencedEventsView, "propTypes", {
  nodes: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    referencedAt: _propTypes.default.string.isRequired,
    isCrossRepository: _propTypes.default.bool.isRequired,
    actor: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    source: _propTypes.default.shape({
      __typename: _propTypes.default.oneOf(['Issue', 'PullRequest']).isRequired,
      repository: _propTypes.default.shape({
        name: _propTypes.default.string.isRequired,
        owner: _propTypes.default.shape({
          login: _propTypes.default.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCrossReferencedEventsView, {
  nodes: function () {
    const node = require("./__generated__/crossReferencedEventsView_nodes.graphql");

    if (node.hash && node.hash !== "5bbb7b39e10559bac4af2d6f9ff7a9e2") {
      console.error("The definition of 'crossReferencedEventsView_nodes' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/crossReferencedEventsView_nodes.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jcm9zcy1yZWZlcmVuY2VkLWV2ZW50cy12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVDcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJyZW5kZXJTdW1tYXJ5IiwicmVuZGVyRXZlbnRzIiwiZmlyc3QiLCJwcm9wcyIsIm5vZGVzIiwibGVuZ3RoIiwicmVmZXJlbmNlZEF0IiwidHlwZSIsIlB1bGxSZXF1ZXN0IiwiSXNzdWUiLCJzb3VyY2UiLCJfX3R5cGVuYW1lIiwieHJlZkNsYXVzZSIsImlzQ3Jvc3NSZXBvc2l0b3J5IiwicmVwbyIsInJlcG9zaXRvcnkiLCJvd25lciIsImxvZ2luIiwibmFtZSIsImFjdG9yIiwiYXZhdGFyVXJsIiwibWFwIiwibm9kZSIsImlkIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJvbmVPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSw2QkFBTixTQUE0Q0MsZUFBTUMsU0FBbEQsQ0FBNEQ7QUF3QmpFQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxTQUFTLEVBQUMsd0JBQW5CO0FBQTRDLE1BQUEsSUFBSSxFQUFDO0FBQWpELE1BREYsRUFFRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLE9BQ0csS0FBS0MsYUFBTCxFQURILENBRkYsQ0FERixFQU9HLEtBQUtDLFlBQUwsRUFQSCxDQURGO0FBV0Q7O0FBRURELEVBQUFBLGFBQWEsR0FBRztBQUNkLFVBQU1FLEtBQUssR0FBRyxLQUFLQyxLQUFMLENBQVdDLEtBQVgs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RUFpQkdBLFVBbEJFLEVBbUJMQTtBQXBCZSxDOztlQXlFTix5Q0FBd0JoQyw2QkFBeEIsRUFBdUQ7QUFDcEVRLEVBQUFBLEtBQUs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQrRCxDQUF2RCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Z3JhcGhxbCwgY3JlYXRlRnJhZ21lbnRDb250YWluZXJ9IGZyb20gJ3JlYWN0LXJlbGF5JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uLy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuLi8uLi92aWV3cy90aW1lYWdvJztcbmltcG9ydCBDcm9zc1JlZmVyZW5jZWRFdmVudFZpZXcgZnJvbSAnLi9jcm9zcy1yZWZlcmVuY2VkLWV2ZW50LXZpZXcnO1xuXG5leHBvcnQgY2xhc3MgQmFyZUNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG5vZGVzOiBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHJlZmVyZW5jZWRBdDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBpc0Nyb3NzUmVwb3NpdG9yeTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgICAgYWN0b3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgYXZhdGFyVXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgfSksXG4gICAgICAgIHNvdXJjZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICBfX3R5cGVuYW1lOiBQcm9wVHlwZXMub25lT2YoWydJc3N1ZScsICdQdWxsUmVxdWVzdCddKS5pc1JlcXVpcmVkLFxuICAgICAgICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpbWVsaW5lLWl0ZW0gY3Jvc3MtcmVmZXJlbmNlZC1ldmVudHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmZvLXJvd1wiPlxuICAgICAgICAgIDxPY3RpY29uIGNsYXNzTmFtZT1cInByZS10aW1lbGluZS1pdGVtLWljb25cIiBpY29uPVwiYm9va21hcmtcIiAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNyb3NzLXJlZmVyZW5jZWQtZXZlbnQtaGVhZGVyXCI+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJTdW1tYXJ5KCl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRXZlbnRzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyU3VtbWFyeSgpIHtcbiAgICBjb25zdCBmaXJzdCA9IHRoaXMucHJvcHMubm9kZXNbMF07XG4gICAgaWYgKHRoaXMucHJvcHMubm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIDxzcGFuPlRoaXMgd2FzIHJlZmVyZW5jZWQgPFRpbWVhZ28gdGltZT17Zmlyc3QucmVmZXJlbmNlZEF0fSAvPjwvc3Bhbj47XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHR5cGUgPSB7XG4gICAgICAgIFB1bGxSZXF1ZXN0OiAnYSBwdWxsIHJlcXVlc3QnLFxuICAgICAgICBJc3N1ZTogJ2FuIGlzc3VlJyxcbiAgICAgIH1bZmlyc3Quc291cmNlLl9fdHlwZW5hbWVdO1xuICAgICAgbGV0IHhyZWZDbGF1c2UgPSAnJztcbiAgICAgIGlmIChmaXJzdC5pc0Nyb3NzUmVwb3NpdG9yeSkge1xuICAgICAgICBjb25zdCByZXBvID0gZmlyc3Quc291cmNlLnJlcG9zaXRvcnk7XG4gICAgICAgIHhyZWZDbGF1c2UgPSAoXG4gICAgICAgICAgPHNwYW4+aW4gPHN0cm9uZz57cmVwby5vd25lci5sb2dpbn0ve3JlcG8ubmFtZX08L3N0cm9uZz48L3NwYW4+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImF1dGhvci1hdmF0YXJcIiBzcmM9e2ZpcnN0LmFjdG9yLmF2YXRhclVybH1cbiAgICAgICAgICAgIGFsdD17Zmlyc3QuYWN0b3IubG9naW59IHRpdGxlPXtmaXJzdC5hY3Rvci5sb2dpbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzdHJvbmc+e2ZpcnN0LmFjdG9yLmxvZ2lufTwvc3Ryb25nPiByZWZlcmVuY2VkIHRoaXMgZnJvbSB7dHlwZX0ge3hyZWZDbGF1c2V9XG4gICAgICAgICAgPFRpbWVhZ28gdGltZT17Zmlyc3QucmVmZXJlbmNlZEF0fSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5ub2Rlcy5tYXAobm9kZSA9PiB7XG4gICAgICByZXR1cm4gPENyb3NzUmVmZXJlbmNlZEV2ZW50VmlldyBrZXk9e25vZGUuaWR9IGl0ZW09e25vZGV9IC8+O1xuICAgIH0pO1xuICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXcsIHtcbiAgbm9kZXM6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyBvbiBDcm9zc1JlZmVyZW5jZWRFdmVudCBAcmVsYXkocGx1cmFsOiB0cnVlKSB7XG4gICAgICBpZCByZWZlcmVuY2VkQXQgaXNDcm9zc1JlcG9zaXRvcnlcbiAgICAgIGFjdG9yIHsgbG9naW4gYXZhdGFyVXJsIH1cbiAgICAgIHNvdXJjZSB7XG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgLi4uIG9uIFJlcG9zaXRvcnlOb2RlIHtcbiAgICAgICAgICByZXBvc2l0b3J5IHtcbiAgICAgICAgICAgIG5hbWUgb3duZXIgeyBsb2dpbiB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbVxuICAgIH1cbiAgYCxcbn0pO1xuIl19