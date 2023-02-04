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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlQ3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJ4cmVmIiwicHJvcHMiLCJpdGVtIiwicmVwbyIsInNvdXJjZSIsInJlcG9zaXRvcnkiLCJyZXBvTGFiZWwiLCJvd25lciIsImxvZ2luIiwibmFtZSIsInRpdGxlIiwidXJsIiwiZ2V0SXNzdWVpc2hOdW1iZXJEaXNwbGF5IiwiaXNQcml2YXRlIiwiX190eXBlbmFtZSIsImlzc3VlU3RhdGUiLCJwclN0YXRlIiwiaXNDcm9zc1JlcG9zaXRvcnkiLCJudW1iZXIiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImlkIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJvbmVPZiIsImNyZWF0ZUZyYWdtZW50Q29udGFpbmVyIl0sInNvdXJjZXMiOlsiY3Jvc3MtcmVmZXJlbmNlZC1ldmVudC12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2dyYXBocWwsIGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyfSBmcm9tICdyZWFjdC1yZWxheSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi8uLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IElzc3VlaXNoQmFkZ2UgZnJvbSAnLi4vLi4vdmlld3MvaXNzdWVpc2gtYmFkZ2UnO1xuaW1wb3J0IElzc3VlaXNoTGluayBmcm9tICcuLi8uLi92aWV3cy9pc3N1ZWlzaC1saW5rJztcblxuZXhwb3J0IGNsYXNzIEJhcmVDcm9zc1JlZmVyZW5jZWRFdmVudFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGl0ZW06IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaXNDcm9zc1JlcG9zaXRvcnk6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICBzb3VyY2U6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIF9fdHlwZW5hbWU6IFByb3BUeXBlcy5vbmVPZihbJ0lzc3VlJywgJ1B1bGxSZXF1ZXN0J10pLmlzUmVxdWlyZWQsXG4gICAgICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgaXNzdWVTdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFsnT1BFTicsICdDTE9TRUQnXSksXG4gICAgICAgIHByU3RhdGU6IFByb3BUeXBlcy5vbmVPZihbJ09QRU4nLCAnQ0xPU0VEJywgJ01FUkdFRCddKSxcbiAgICAgICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgaXNQcml2YXRlOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgICAgICAgIG93bmVyOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICAgfSkuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHhyZWYgPSB0aGlzLnByb3BzLml0ZW07XG4gICAgY29uc3QgcmVwbyA9IHhyZWYuc291cmNlLnJlcG9zaXRvcnk7XG4gICAgY29uc3QgcmVwb0xhYmVsID0gYCR7cmVwby5vd25lci5sb2dpbn0vJHtyZXBvLm5hbWV9YDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjcm9zcy1yZWZlcmVuY2VkLWV2ZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3Jvc3MtcmVmZXJlbmNlZC1ldmVudC1sYWJlbFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNyb3NzLXJlZmVyZW5jZWQtZXZlbnQtbGFiZWwtdGl0bGVcIj57eHJlZi5zb3VyY2UudGl0bGV9PC9zcGFuPlxuICAgICAgICAgIDxJc3N1ZWlzaExpbmsgdXJsPXt4cmVmLnNvdXJjZS51cmx9IGNsYXNzTmFtZT1cImNyb3NzLXJlZmVyZW5jZWQtZXZlbnQtbGFiZWwtbnVtYmVyXCI+XG4gICAgICAgICAgICB7dGhpcy5nZXRJc3N1ZWlzaE51bWJlckRpc3BsYXkoeHJlZil9XG4gICAgICAgICAgPC9Jc3N1ZWlzaExpbms+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7cmVwby5pc1ByaXZhdGVcbiAgICAgICAgICA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3Jvc3MtcmVmZXJlbmNlZC1ldmVudC1wcml2YXRlXCI+XG4gICAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJsb2NrXCIgdGl0bGU9e2BPbmx5IHBlb3BsZSB3aG8gY2FuIHNlZSAke3JlcG9MYWJlbH0gd2lsbCBzZWUgdGhpcyByZWZlcmVuY2UuYH0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAnJ31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjcm9zcy1yZWZlcmVuY2VkLWV2ZW50LXN0YXRlXCI+XG4gICAgICAgICAgPElzc3VlaXNoQmFkZ2UgdHlwZT17eHJlZi5zb3VyY2UuX190eXBlbmFtZX0gc3RhdGU9e3hyZWYuc291cmNlLmlzc3VlU3RhdGUgfHwgeHJlZi5zb3VyY2UucHJTdGF0ZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZ2V0SXNzdWVpc2hOdW1iZXJEaXNwbGF5KHhyZWYpIHtcbiAgICBjb25zdCB7c291cmNlfSA9IHhyZWY7XG4gICAgaWYgKCF4cmVmLmlzQ3Jvc3NSZXBvc2l0b3J5KSB7XG4gICAgICByZXR1cm4gYCMke3NvdXJjZS5udW1iZXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qge3JlcG9zaXRvcnl9ID0gc291cmNlO1xuICAgICAgcmV0dXJuIGAke3JlcG9zaXRvcnkub3duZXIubG9naW59LyR7cmVwb3NpdG9yeS5uYW1lfSMke3NvdXJjZS5udW1iZXJ9YDtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlQ3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3LCB7XG4gIGl0ZW06IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0gb24gQ3Jvc3NSZWZlcmVuY2VkRXZlbnQge1xuICAgICAgaWQgaXNDcm9zc1JlcG9zaXRvcnlcbiAgICAgIHNvdXJjZSB7XG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgLi4uIG9uIElzc3VlIHsgbnVtYmVyIHRpdGxlIHVybCBpc3N1ZVN0YXRlOnN0YXRlIH1cbiAgICAgICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHsgbnVtYmVyIHRpdGxlIHVybCBwclN0YXRlOnN0YXRlIH1cbiAgICAgICAgLi4uIG9uIFJlcG9zaXRvcnlOb2RlIHtcbiAgICAgICAgICByZXBvc2l0b3J5IHtcbiAgICAgICAgICAgIG5hbWUgaXNQcml2YXRlIG93bmVyIHsgbG9naW4gfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgYCxcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBcUQ7QUFBQTtBQUFBO0FBQUE7QUFFOUMsTUFBTUEsNEJBQTRCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBdUJoRUMsTUFBTSxHQUFHO0lBQ1AsTUFBTUMsSUFBSSxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxJQUFJO0lBQzVCLE1BQU1DLElBQUksR0FBR0gsSUFBSSxDQUFDSSxNQUFNLENBQUNDLFVBQVU7SUFDbkMsTUFBTUMsU0FBUyxHQUFJLEdBQUVILElBQUksQ0FBQ0ksS0FBSyxDQUFDQyxLQUFNLElBQUdMLElBQUksQ0FBQ00sSUFBSyxFQUFDO0lBQ3BELE9BQ0U7TUFBSyxTQUFTLEVBQUM7SUFBd0IsR0FDckM7TUFBSyxTQUFTLEVBQUM7SUFBOEIsR0FDM0M7TUFBTSxTQUFTLEVBQUM7SUFBb0MsR0FBRVQsSUFBSSxDQUFDSSxNQUFNLENBQUNNLEtBQUssQ0FBUSxFQUMvRSw2QkFBQyxxQkFBWTtNQUFDLEdBQUcsRUFBRVYsSUFBSSxDQUFDSSxNQUFNLENBQUNPLEdBQUk7TUFBQyxTQUFTLEVBQUM7SUFBcUMsR0FDaEYsSUFBSSxDQUFDQyx3QkFBd0IsQ0FBQ1osSUFBSSxDQUFDLENBQ3ZCLENBQ1gsRUFDTEcsSUFBSSxDQUFDVSxTQUFTLEdBRVg7TUFBSyxTQUFTLEVBQUM7SUFBZ0MsR0FDN0MsNkJBQUMsZ0JBQU87TUFBQyxJQUFJLEVBQUMsTUFBTTtNQUFDLEtBQUssRUFBRywyQkFBMEJQLFNBQVU7SUFBMkIsRUFBRyxDQUMzRixHQUNKLEVBQUUsRUFDUjtNQUFLLFNBQVMsRUFBQztJQUE4QixHQUMzQyw2QkFBQyxzQkFBYTtNQUFDLElBQUksRUFBRU4sSUFBSSxDQUFDSSxNQUFNLENBQUNVLFVBQVc7TUFBQyxLQUFLLEVBQUVkLElBQUksQ0FBQ0ksTUFBTSxDQUFDVyxVQUFVLElBQUlmLElBQUksQ0FBQ0ksTUFBTSxDQUFDWTtJQUFRLEVBQUcsQ0FDakcsQ0FDRjtFQUVWO0VBRUFKLHdCQUF3QixDQUFDWixJQUFJLEVBQUU7SUFDN0IsTUFBTTtNQUFDSTtJQUFNLENBQUMsR0FBR0osSUFBSTtJQUNyQixJQUFJLENBQUNBLElBQUksQ0FBQ2lCLGlCQUFpQixFQUFFO01BQzNCLE9BQVEsSUFBR2IsTUFBTSxDQUFDYyxNQUFPLEVBQUM7SUFDNUIsQ0FBQyxNQUFNO01BQ0wsTUFBTTtRQUFDYjtNQUFVLENBQUMsR0FBR0QsTUFBTTtNQUMzQixPQUFRLEdBQUVDLFVBQVUsQ0FBQ0UsS0FBSyxDQUFDQyxLQUFNLElBQUdILFVBQVUsQ0FBQ0ksSUFBSyxJQUFHTCxNQUFNLENBQUNjLE1BQU8sRUFBQztJQUN4RTtFQUNGO0FBRUY7QUFBQztBQUFBLGdCQTFEWXRCLDRCQUE0QixlQUNwQjtFQUNqQk0sSUFBSSxFQUFFaUIsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQ3BCQyxFQUFFLEVBQUVGLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0MsVUFBVTtJQUMvQk4saUJBQWlCLEVBQUVFLGtCQUFTLENBQUNLLElBQUksQ0FBQ0QsVUFBVTtJQUM1Q25CLE1BQU0sRUFBRWUsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQ3RCTixVQUFVLEVBQUVLLGtCQUFTLENBQUNNLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDRixVQUFVO01BQ2hFTCxNQUFNLEVBQUVDLGtCQUFTLENBQUNELE1BQU0sQ0FBQ0ssVUFBVTtNQUNuQ2IsS0FBSyxFQUFFUyxrQkFBUyxDQUFDRyxNQUFNLENBQUNDLFVBQVU7TUFDbENaLEdBQUcsRUFBRVEsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO01BQ2hDUixVQUFVLEVBQUVJLGtCQUFTLENBQUNNLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztNQUMvQ1QsT0FBTyxFQUFFRyxrQkFBUyxDQUFDTSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ3REcEIsVUFBVSxFQUFFYyxrQkFBUyxDQUFDQyxLQUFLLENBQUM7UUFDMUJYLElBQUksRUFBRVUsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO1FBQ2pDVixTQUFTLEVBQUVNLGtCQUFTLENBQUNLLElBQUksQ0FBQ0QsVUFBVTtRQUNwQ2hCLEtBQUssRUFBRVksa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO1VBQ3JCWixLQUFLLEVBQUVXLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0M7UUFDMUIsQ0FBQyxDQUFDLENBQUNBO01BQ0wsQ0FBQyxDQUFDLENBQUNBO0lBQ0wsQ0FBQyxDQUFDLENBQUNBO0VBQ0wsQ0FBQyxDQUFDLENBQUNBO0FBQ0wsQ0FBQztBQUFBLGVBdUNZLElBQUFHLG1DQUF1QixFQUFDOUIsNEJBQTRCLEVBQUU7RUFDbkVNLElBQUk7SUFBQTtJQUFBO01BQUE7SUFBQTtJQUFBO0VBQUE7QUFlTixDQUFDLENBQUM7QUFBQSJ9