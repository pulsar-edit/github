"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareMergedEventView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRelay = require("react-relay");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../../atom/octicon"));

var _timeago = _interopRequireDefault(require("../../views/timeago"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareMergedEventView extends _react.default.Component {
  render() {
    const {
      actor,
      mergeRefName,
      createdAt
    } = this.props.item;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "merged-event"
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      className: "pre-timeline-item-icon",
      icon: "git-merge"
    }), actor && /*#__PURE__*/_react.default.createElement("img", {
      className: "author-avatar",
      src: actor.avatarUrl,
      alt: actor.login,
      title: actor.login
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "merged-event-header"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "username"
    }, actor ? actor.login : 'someone'), " merged", ' ', this.renderCommit(), " into", ' ', /*#__PURE__*/_react.default.createElement("span", {
      className: "merge-ref"
    }, mergeRefName), " on ", /*#__PURE__*/_react.default.createElement(_timeago.default, {
      time: createdAt
    })));
  }

  renderCommit() {
    const {
      commit
    } = this.props.item;

    if (!commit) {
      return 'a commit';
    }

    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, "commit ", /*#__PURE__*/_react.default.createElement("span", {
      className: "sha"
    }, commit.oid.slice(0, 8)));
  }

}

exports.BareMergedEventView = BareMergedEventView;

_defineProperty(BareMergedEventView, "propTypes", {
  item: _propTypes.default.shape({
    actor: _propTypes.default.shape({
      avatarUrl: _propTypes.default.string.isRequired,
      login: _propTypes.default.string.isRequired
    }),
    commit: _propTypes.default.shape({
      oid: _propTypes.default.string.isRequired
    }),
    mergeRefName: _propTypes.default.string.isRequired,
    createdAt: _propTypes.default.string.isRequired
  }).isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareMergedEventView, {
  item: function () {
    const node = require("./__generated__/mergedEventView_item.graphql");

    if (node.hash && node.hash !== "d265decf08c14d96c2ec47fd5852a956") {
      console.error("The definition of 'mergedEventView_item' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/mergedEventView_item.graphql");
  }
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9tZXJnZWQtZXZlbnQtdmlldy5qcyJdLCJuYW1lcyI6WyJCYXJlTWVyZ2VkRXZlbnRWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJhY3RvciIsIm1lcmdlUmVmTmFtZSIsImNyZWF0ZWRBdCIsInByb3BzIiwiaXRlbSIsImF2YXRhclVybCIsImxvZ2luIiwicmVuZGVyQ29tbWl0IiwiY29tbWl0Iiwib2lkIiwic2xpY2UiLCJQcm9wVHlwZXMiLCJzaGFwZSIsInN0cmluZyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLE1BQU1BLG1CQUFOLFNBQWtDQyxlQUFNQyxTQUF4QyxDQUFrRDtBQWV2REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTTtBQUFDQyxNQUFBQSxLQUFEO0FBQVFDLE1BQUFBLFlBQVI7QUFBc0JDLE1BQUFBO0FBQXRCLFFBQW1DLEtBQUtDLEtBQUwsQ0FBV0MsSUFBcEQ7QUFDQSx3QkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLFNBQVMsRUFBQyx3QkFBbkI7QUFBNEMsTUFBQSxJQUFJLEVBQUM7QUFBakQsTUFERixFQUVHSixLQUFLLGlCQUFJO0FBQUssTUFBQSxTQUFTLEVBQUMsZUFBZjtBQUErQixNQUFBLEdBQUcsRUFBRUEsS0FBSyxDQUFDSyxTQUExQztBQUFxRCxNQUFBLEdBQUcsRUFBRUwsS0FBSyxDQUFDTSxLQUFoRTtBQUF1RSxNQUFBLEtBQUssRUFBRU4sS0FBSyxDQUFDTTtBQUFwRixNQUZaLGVBR0U7QUFBTSxNQUFBLFNBQVMsRUFBQztBQUFoQixvQkFDRTtBQUFNLE1BQUEsU0FBUyxFQUFDO0FBQWhCLE9BQTRCTixLQUFLLEdBQUdBLEtBQUssQ0FBQ00sS0FBVCxHQUFpQixTQUFsRCxDQURGLGFBQzZFLEdBRDdFLEVBRUcsS0FBS0MsWUFBTCxFQUZILFdBR0csR0FISCxlQUdPO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBNkJOLFlBQTdCLENBSFAsdUJBRzRELDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUVDO0FBQWYsTUFINUQsQ0FIRixDQURGO0FBV0Q7O0FBRURLLEVBQUFBLFlBQVksR0FBRztBQUNiLFVBQU07QUFBQ0MsTUFBQUE7QUFBRCxRQUFXLEtBQUtMLEtBQUwsQ0FBV0MsSUFBNUI7O0FBQ0EsUUFBSSxDQUFDSSxNQUFMLEVBQWE7QUFDWCxhQUFPLFVBQVA7QUFDRDs7QUFFRCx3QkFDRSw2QkFBQyxlQUFELGdDQUNTO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsT0FBdUJBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQXZCLENBRFQsQ0FERjtBQUtEOztBQXpDc0Q7Ozs7Z0JBQTVDZCxtQixlQUNRO0FBQ2pCUSxFQUFBQSxJQUFJLEVBQUVPLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3BCWixJQUFBQSxLQUFLLEVBQUVXLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCUCxNQUFBQSxTQUFTLEVBQUVNLG1CQUFVRSxNQUFWLENBQWlCQyxVQURQO0FBRXJCUixNQUFBQSxLQUFLLEVBQUVLLG1CQUFVRSxNQUFWLENBQWlCQztBQUZILEtBQWhCLENBRGE7QUFLcEJOLElBQUFBLE1BQU0sRUFBRUcsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDdEJILE1BQUFBLEdBQUcsRUFBRUUsbUJBQVVFLE1BQVYsQ0FBaUJDO0FBREEsS0FBaEIsQ0FMWTtBQVFwQmIsSUFBQUEsWUFBWSxFQUFFVSxtQkFBVUUsTUFBVixDQUFpQkMsVUFSWDtBQVNwQlosSUFBQUEsU0FBUyxFQUFFUyxtQkFBVUUsTUFBVixDQUFpQkM7QUFUUixHQUFoQixFQVVIQTtBQVhjLEM7O2VBMkNOLHlDQUF3QmxCLG1CQUF4QixFQUE2QztBQUMxRFEsRUFBQUEsSUFBSTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBRHNELENBQTdDLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtncmFwaHFsLCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcn0gZnJvbSAncmVhY3QtcmVsYXknO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4uLy4uL3ZpZXdzL3RpbWVhZ28nO1xuXG5leHBvcnQgY2xhc3MgQmFyZU1lcmdlZEV2ZW50VmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaXRlbTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGFjdG9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBhdmF0YXJVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbG9naW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgY29tbWl0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBvaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgbWVyZ2VSZWZOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBjcmVhdGVkQXQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHthY3RvciwgbWVyZ2VSZWZOYW1lLCBjcmVhdGVkQXR9ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lcmdlZC1ldmVudFwiPlxuICAgICAgICA8T2N0aWNvbiBjbGFzc05hbWU9XCJwcmUtdGltZWxpbmUtaXRlbS1pY29uXCIgaWNvbj1cImdpdC1tZXJnZVwiIC8+XG4gICAgICAgIHthY3RvciAmJiA8aW1nIGNsYXNzTmFtZT1cImF1dGhvci1hdmF0YXJcIiBzcmM9e2FjdG9yLmF2YXRhclVybH0gYWx0PXthY3Rvci5sb2dpbn0gdGl0bGU9e2FjdG9yLmxvZ2lufSAvPn1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWVyZ2VkLWV2ZW50LWhlYWRlclwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInVzZXJuYW1lXCI+e2FjdG9yID8gYWN0b3IubG9naW4gOiAnc29tZW9uZSd9PC9zcGFuPiBtZXJnZWR7JyAnfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbW1pdCgpfSBpbnRvXG4gICAgICAgICAgeycgJ308c3BhbiBjbGFzc05hbWU9XCJtZXJnZS1yZWZcIj57bWVyZ2VSZWZOYW1lfTwvc3Bhbj4gb24gPFRpbWVhZ28gdGltZT17Y3JlYXRlZEF0fSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWl0KCkge1xuICAgIGNvbnN0IHtjb21taXR9ID0gdGhpcy5wcm9wcy5pdGVtO1xuICAgIGlmICghY29tbWl0KSB7XG4gICAgICByZXR1cm4gJ2EgY29tbWl0JztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICBjb21taXQgPHNwYW4gY2xhc3NOYW1lPVwic2hhXCI+e2NvbW1pdC5vaWQuc2xpY2UoMCwgOCl9PC9zcGFuPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVNZXJnZWRFdmVudFZpZXcsIHtcbiAgaXRlbTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBtZXJnZWRFdmVudFZpZXdfaXRlbSBvbiBNZXJnZWRFdmVudCB7XG4gICAgICBhY3RvciB7XG4gICAgICAgIGF2YXRhclVybCBsb2dpblxuICAgICAgfVxuICAgICAgY29tbWl0IHsgb2lkIH1cbiAgICAgIG1lcmdlUmVmTmFtZVxuICAgICAgY3JlYXRlZEF0XG4gICAgfVxuICBgLFxufSk7XG4iXX0=