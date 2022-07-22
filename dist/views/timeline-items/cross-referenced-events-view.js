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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "timeline-item cross-referenced-events"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-row"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "bookmark"
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "cross-referenced-event-header"
    }, this.renderSummary())), this.renderEvents());
  }

  renderSummary() {
    const first = this.props.nodes[0];

    if (this.props.nodes.length > 1) {
      return /*#__PURE__*/_react.default.createElement("span", null, "This was referenced ", /*#__PURE__*/_react.default.createElement(_timeago.default, {
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
        xrefClause = /*#__PURE__*/_react.default.createElement("span", null, "in ", /*#__PURE__*/_react.default.createElement("strong", null, repo.owner.login, "/", repo.name));
      }

      return /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("img", {
        className: "author-avatar",
        src: first.actor.avatarUrl,
        alt: first.actor.login,
        title: first.actor.login
      }), /*#__PURE__*/_react.default.createElement("strong", null, first.actor.login), " referenced this from ", type, " ", xrefClause, /*#__PURE__*/_react.default.createElement(_timeago.default, {
        time: first.referencedAt
      }));
    }
  }

  renderEvents() {
    return this.props.nodes.map(node => {
      return /*#__PURE__*/_react.default.createElement(_crossReferencedEventView.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jcm9zcy1yZWZlcmVuY2VkLWV2ZW50cy12aWV3LmpzIl0sIm5hbWVzIjpbIkJhcmVDcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJyZW5kZXJTdW1tYXJ5IiwicmVuZGVyRXZlbnRzIiwiZmlyc3QiLCJwcm9wcyIsIm5vZGVzIiwibGVuZ3RoIiwicmVmZXJlbmNlZEF0IiwidHlwZSIsIlB1bGxSZXF1ZXN0IiwiSXNzdWUiLCJzb3VyY2UiLCJfX3R5cGVuYW1lIiwieHJlZkNsYXVzZSIsImlzQ3Jvc3NSZXBvc2l0b3J5IiwicmVwbyIsInJlcG9zaXRvcnkiLCJvd25lciIsImxvZ2luIiwibmFtZSIsImFjdG9yIiwiYXZhdGFyVXJsIiwibWFwIiwibm9kZSIsImlkIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJvbmVPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7QUFFTyxNQUFNQSw2QkFBTixTQUE0Q0MsZUFBTUMsU0FBbEQsQ0FBNEQ7QUF3QmpFQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxTQUFTLEVBQUMsd0JBQW5CO0FBQTRDLE1BQUEsSUFBSSxFQUFDO0FBQWpELE1BREYsZUFFRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLE9BQ0csS0FBS0MsYUFBTCxFQURILENBRkYsQ0FERixFQU9HLEtBQUtDLFlBQUwsRUFQSCxDQURGO0FBV0Q7O0FBRURELEVBQUFBLGFBQWEsR0FBRztBQUNkLFVBQU1FLEtBQUssR0FBRyxLQUFLQyxLQUFMLENBQVdDLEtB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LEdBQWhCLEVBaUJHQSxVQWxCRSxFQW1CTEE7QUFwQmUsQzs7ZUF5RU4seUNBQXdCaEMsNkJBQXhCLEVBQXVEO0FBQ3BFUSxFQUFBQSxLQUFLO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEK0QsQ0FBdkQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi4vLi4vdmlld3MvdGltZWFnbyc7XG5pbXBvcnQgQ3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3IGZyb20gJy4vY3Jvc3MtcmVmZXJlbmNlZC1ldmVudC12aWV3JztcblxuZXhwb3J0IGNsYXNzIEJhcmVDcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBub2RlczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICByZWZlcmVuY2VkQXQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgaXNDcm9zc1JlcG9zaXRvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICAgIGFjdG9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgIGF2YXRhclVybDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIH0pLFxuICAgICAgICBzb3VyY2U6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgX190eXBlbmFtZTogUHJvcFR5cGVzLm9uZU9mKFsnSXNzdWUnLCAnUHVsbFJlcXVlc3QnXSkuaXNSZXF1aXJlZCxcbiAgICAgICAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgICAgb3duZXI6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aW1lbGluZS1pdGVtIGNyb3NzLXJlZmVyZW5jZWQtZXZlbnRzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1yb3dcIj5cbiAgICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cImJvb2ttYXJrXCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjcm9zcy1yZWZlcmVuY2VkLWV2ZW50LWhlYWRlclwiPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyU3VtbWFyeSgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlckV2ZW50cygpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclN1bW1hcnkoKSB7XG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLnByb3BzLm5vZGVzWzBdO1xuICAgIGlmICh0aGlzLnByb3BzLm5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiA8c3Bhbj5UaGlzIHdhcyByZWZlcmVuY2VkIDxUaW1lYWdvIHRpbWU9e2ZpcnN0LnJlZmVyZW5jZWRBdH0gLz48L3NwYW4+O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0eXBlID0ge1xuICAgICAgICBQdWxsUmVxdWVzdDogJ2EgcHVsbCByZXF1ZXN0JyxcbiAgICAgICAgSXNzdWU6ICdhbiBpc3N1ZScsXG4gICAgICB9W2ZpcnN0LnNvdXJjZS5fX3R5cGVuYW1lXTtcbiAgICAgIGxldCB4cmVmQ2xhdXNlID0gJyc7XG4gICAgICBpZiAoZmlyc3QuaXNDcm9zc1JlcG9zaXRvcnkpIHtcbiAgICAgICAgY29uc3QgcmVwbyA9IGZpcnN0LnNvdXJjZS5yZXBvc2l0b3J5O1xuICAgICAgICB4cmVmQ2xhdXNlID0gKFxuICAgICAgICAgIDxzcGFuPmluIDxzdHJvbmc+e3JlcG8ub3duZXIubG9naW59L3tyZXBvLm5hbWV9PC9zdHJvbmc+PC9zcGFuPlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJhdXRob3ItYXZhdGFyXCIgc3JjPXtmaXJzdC5hY3Rvci5hdmF0YXJVcmx9XG4gICAgICAgICAgICBhbHQ9e2ZpcnN0LmFjdG9yLmxvZ2lufSB0aXRsZT17Zmlyc3QuYWN0b3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3Ryb25nPntmaXJzdC5hY3Rvci5sb2dpbn08L3N0cm9uZz4gcmVmZXJlbmNlZCB0aGlzIGZyb20ge3R5cGV9IHt4cmVmQ2xhdXNlfVxuICAgICAgICAgIDxUaW1lYWdvIHRpbWU9e2ZpcnN0LnJlZmVyZW5jZWRBdH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJFdmVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubm9kZXMubWFwKG5vZGUgPT4ge1xuICAgICAgcmV0dXJuIDxDcm9zc1JlZmVyZW5jZWRFdmVudFZpZXcga2V5PXtub2RlLmlkfSBpdGVtPXtub2RlfSAvPjtcbiAgICB9KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVDcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3LCB7XG4gIG5vZGVzOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMgb24gQ3Jvc3NSZWZlcmVuY2VkRXZlbnQgQHJlbGF5KHBsdXJhbDogdHJ1ZSkge1xuICAgICAgaWQgcmVmZXJlbmNlZEF0IGlzQ3Jvc3NSZXBvc2l0b3J5XG4gICAgICBhY3RvciB7IGxvZ2luIGF2YXRhclVybCB9XG4gICAgICBzb3VyY2Uge1xuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgIC4uLiBvbiBSZXBvc2l0b3J5Tm9kZSB7XG4gICAgICAgICAgcmVwb3NpdG9yeSB7XG4gICAgICAgICAgICBuYW1lIG93bmVyIHsgbG9naW4gfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==