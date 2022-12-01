"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareCrossReferencedEventView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _issueishBadge = _interopRequireDefault(require("../../views/issueish-badge"));

var _issueishLink = _interopRequireDefault(require("../../views/issueish-link"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareCrossReferencedEventView extends _react.default.Component {
  render() {
    const xref = this.props.item;
    const repo = xref.source.repository;
    const repoLabel = `${repo.owner.login}/${repo.name}`;
    return _react.default.createElement("div", {
      className: "cross-referenced-event"
    }, _react.default.createElement("div", {
      className: "cross-referenced-event-label"
    }, _react.default.createElement("span", {
      className: "cross-referenced-event-label-title"
    }, xref.source.title), _react.default.createElement(_issueishLink.default, {
      url: xref.source.url,
      className: "cross-referenced-event-label-number"
    }, this.getIssueishNumberDisplay(xref))), repo.isPrivate ? _react.default.createElement("div", {
      className: "cross-referenced-event-private"
    }, _react.default.createElement(_octicon.default, {
      icon: "lock",
      title: `Only people who can see ${repoLabel} will see this reference.`
    })) : '', _react.default.createElement("div", {
      className: "cross-referenced-event-state"
    }, _react.default.createElement(_issueishBadge.default, {
      type: xref.source.__typename,
      state: xref.source.issueState || xref.source.prState
    })));
  }

  getIssueishNumberDisplay(xref) {
    const {
      source
    } = xref;

    if (!xref.isCrossRepository) {
      return `#${source.number}`;
    } else {
      const {
        repository
      } = source;
      return `${repository.owner.login}/${repository.name}#${source.number}`;
    }
  }

}

exports.BareCrossReferencedEventView = BareCrossReferencedEventView;

_defineProperty(BareCrossReferencedEventView, "propTypes", {
  item: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    isCrossRepository: _propTypes.default.bool.isRequired,
    source: _propTypes.default.shape({
      __typename: _propTypes.default.oneOf(['Issue', 'PullRequest']).isRequired,
      number: _propTypes.default.number.isRequired,
      title: _propTypes.default.string.isRequired,
      url: _propTypes.default.string.isRequired,
      issueState: _propTypes.default.oneOf(['OPEN', 'CLOSED']),
      prState: _propTypes.default.oneOf(['OPEN', 'CLOSED', 'MERGED']),
      repository: _propTypes.default.shape({
        name: _propTypes.default.string.isRequired,
        isPrivate: _propTypes.default.bool.isRequired,
        owner: _propTypes.default.shape({
          login: _propTypes.default.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareCrossReferencedEventView, {
  item: function () {
    const node = require("./__generated__/crossReferencedEventView_item.graphql");

    if (node.hash && node.hash !== "b90b8c9f0acee56516e7413263cf7f51") {
      console.error("The definition of 'crossReferencedEventView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/crossReferencedEventView_item.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9jcm9zcy1yZWZlcmVuY2VkLWV2ZW50LXZpZXcuanMiXSwibmFtZXMiOlsiQmFyZUNyb3NzUmVmZXJlbmNlZEV2ZW50VmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwieHJlZiIsInByb3BzIiwiaXRlbSIsInJlcG8iLCJzb3VyY2UiLCJyZXBvc2l0b3J5IiwicmVwb0xhYmVsIiwib3duZXIiLCJsb2dpbiIsIm5hbWUiLCJ0aXRsZSIsInVybCIsImdldElzc3VlaXNoTnVtYmVyRGlzcGxheSIsImlzUHJpdmF0ZSIsIl9fdHlwZW5hbWUiLCJpc3N1ZVN0YXRlIiwicHJTdGF0ZSIsImlzQ3Jvc3NSZXBvc2l0b3J5IiwibnVtYmVyIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJpZCIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJib29sIiwib25lT2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sTUFBTUEsNEJBQU4sU0FBMkNDLGVBQU1DLFNBQWpELENBQTJEO0FBdUJoRUMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsSUFBSSxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsSUFBeEI7QUFDQSxVQUFNQyxJQUFJLEdBQUdILElBQUksQ0FBQ0ksTUFBTCxDQUFZQyxVQUF6QjtBQUNBLFVBQU1DLFNBQVMsR0FBSSxHQUFFSCxJQUFJLENBQUNJLEtBQUwsQ0FBV0MsS0FBTSxJQUFHTCxJQUFJLENBQUNNLElBQUssRUFBbkQ7QUFDQSxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBc0RULElBQUksQ0FBQ0ksTUFBTCxDQUFZTSxLQUFsRSxDQURGLEVBRUUsNkJBQUMscUJBQUQ7QUFBYyxNQUFBLEdBQUcsRUFB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bSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBJc3N1ZWlzaEJhZGdlIGZyb20gJy4uLy4uL3ZpZXdzL2lzc3VlaXNoLWJhZGdlJztcbmltcG9ydCBJc3N1ZWlzaExpbmsgZnJvbSAnLi4vLi4vdmlld3MvaXNzdWVpc2gtbGluayc7XG5cbmV4cG9ydCBjbGFzcyBCYXJlQ3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBpdGVtOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlzQ3Jvc3NSZXBvc2l0b3J5OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgc291cmNlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBfX3R5cGVuYW1lOiBQcm9wVHlwZXMub25lT2YoWydJc3N1ZScsICdQdWxsUmVxdWVzdCddKS5pc1JlcXVpcmVkLFxuICAgICAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIGlzc3VlU3RhdGU6IFByb3BUeXBlcy5vbmVPZihbJ09QRU4nLCAnQ0xPU0VEJ10pLFxuICAgICAgICBwclN0YXRlOiBQcm9wVHlwZXMub25lT2YoWydPUEVOJywgJ0NMT1NFRCcsICdNRVJHRUQnXSksXG4gICAgICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgIGlzUHJpdmF0ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgICAgICBvd25lcjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIGxvZ2luOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB4cmVmID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIGNvbnN0IHJlcG8gPSB4cmVmLnNvdXJjZS5yZXBvc2l0b3J5O1xuICAgIGNvbnN0IHJlcG9MYWJlbCA9IGAke3JlcG8ub3duZXIubG9naW59LyR7cmVwby5uYW1lfWA7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3Jvc3MtcmVmZXJlbmNlZC1ldmVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNyb3NzLXJlZmVyZW5jZWQtZXZlbnQtbGFiZWxcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjcm9zcy1yZWZlcmVuY2VkLWV2ZW50LWxhYmVsLXRpdGxlXCI+e3hyZWYuc291cmNlLnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICA8SXNzdWVpc2hMaW5rIHVybD17eHJlZi5zb3VyY2UudXJsfSBjbGFzc05hbWU9XCJjcm9zcy1yZWZlcmVuY2VkLWV2ZW50LWxhYmVsLW51bWJlclwiPlxuICAgICAgICAgICAge3RoaXMuZ2V0SXNzdWVpc2hOdW1iZXJEaXNwbGF5KHhyZWYpfVxuICAgICAgICAgIDwvSXNzdWVpc2hMaW5rPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3JlcG8uaXNQcml2YXRlXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNyb3NzLXJlZmVyZW5jZWQtZXZlbnQtcHJpdmF0ZVwiPlxuICAgICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwibG9ja1wiIHRpdGxlPXtgT25seSBwZW9wbGUgd2hvIGNhbiBzZWUgJHtyZXBvTGFiZWx9IHdpbGwgc2VlIHRoaXMgcmVmZXJlbmNlLmB9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogJyd9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3Jvc3MtcmVmZXJlbmNlZC1ldmVudC1zdGF0ZVwiPlxuICAgICAgICAgIDxJc3N1ZWlzaEJhZGdlIHR5cGU9e3hyZWYuc291cmNlLl9fdHlwZW5hbWV9IHN0YXRlPXt4cmVmLnNvdXJjZS5pc3N1ZVN0YXRlIHx8IHhyZWYuc291cmNlLnByU3RhdGV9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGdldElzc3VlaXNoTnVtYmVyRGlzcGxheSh4cmVmKSB7XG4gICAgY29uc3Qge3NvdXJjZX0gPSB4cmVmO1xuICAgIGlmICgheHJlZi5pc0Nyb3NzUmVwb3NpdG9yeSkge1xuICAgICAgcmV0dXJuIGAjJHtzb3VyY2UubnVtYmVyfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHtyZXBvc2l0b3J5fSA9IHNvdXJjZTtcbiAgICAgIHJldHVybiBgJHtyZXBvc2l0b3J5Lm93bmVyLmxvZ2lufS8ke3JlcG9zaXRvcnkubmFtZX0jJHtzb3VyY2UubnVtYmVyfWA7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlldywge1xuICBpdGVtOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcbiAgICAgIGlkIGlzQ3Jvc3NSZXBvc2l0b3J5XG4gICAgICBzb3VyY2Uge1xuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgIC4uLiBvbiBJc3N1ZSB7IG51bWJlciB0aXRsZSB1cmwgaXNzdWVTdGF0ZTpzdGF0ZSB9XG4gICAgICAgIC4uLiBvbiBQdWxsUmVxdWVzdCB7IG51bWJlciB0aXRsZSB1cmwgcHJTdGF0ZTpzdGF0ZSB9XG4gICAgICAgIC4uLiBvbiBSZXBvc2l0b3J5Tm9kZSB7XG4gICAgICAgICAgcmVwb3NpdG9yeSB7XG4gICAgICAgICAgICBuYW1lIGlzUHJpdmF0ZSBvd25lciB7IGxvZ2luIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIGAsXG59KTtcbiJdfQ==