"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));
var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class FilePatchMetaView extends _react.default.Component {
  renderMetaControls() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    }
    return _react.default.createElement("div", {
      className: "github-FilePatchView-metaControls"
    }, _react.default.createElement("button", {
      className: (0, _classnames.default)('github-FilePatchView-metaButton', 'icon', this.props.actionIcon),
      onClick: this.props.action
    }, this.props.actionText));
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-FilePatchView-meta"
    }, _react.default.createElement("div", {
      className: "github-FilePatchView-metaContainer"
    }, _react.default.createElement("header", {
      className: "github-FilePatchView-metaHeader"
    }, _react.default.createElement("h3", {
      className: "github-FilePatchView-metaTitle"
    }, this.props.title), this.renderMetaControls()), _react.default.createElement("div", {
      className: "github-FilePatchView-metaDetails"
    }, this.props.children)));
  }
}
exports.default = FilePatchMetaView;
_defineProperty(FilePatchMetaView, "propTypes", {
  title: _propTypes.default.string.isRequired,
  actionIcon: _propTypes.default.string.isRequired,
  actionText: _propTypes.default.string.isRequired,
  action: _propTypes.default.func.isRequired,
  children: _propTypes.default.element.isRequired,
  itemType: _propTypes2.ItemTypePropType.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlUGF0Y2hNZXRhVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyTWV0YUNvbnRyb2xzIiwicHJvcHMiLCJpdGVtVHlwZSIsIkNvbW1pdERldGFpbEl0ZW0iLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJjeCIsImFjdGlvbkljb24iLCJhY3Rpb24iLCJhY3Rpb25UZXh0IiwicmVuZGVyIiwidGl0bGUiLCJjaGlsZHJlbiIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJmdW5jIiwiZWxlbWVudCIsIkl0ZW1UeXBlUHJvcFR5cGUiXSwic291cmNlcyI6WyJmaWxlLXBhdGNoLW1ldGEtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IHtJdGVtVHlwZVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZVBhdGNoTWV0YVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgYWN0aW9uSWNvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGFjdGlvblRleHQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIGFjdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgcmVuZGVyTWV0YUNvbnRyb2xzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDb21taXREZXRhaWxJdGVtIHx8IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IElzc3VlaXNoRGV0YWlsSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFDb250cm9sc1wiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YUJ1dHRvbicsICdpY29uJywgdGhpcy5wcm9wcy5hY3Rpb25JY29uKX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmFjdGlvbn0+XG4gICAgICAgICAge3RoaXMucHJvcHMuYWN0aW9uVGV4dH1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhQ29udGFpbmVyXCI+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhSGVhZGVyXCI+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YVRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlck1ldGFDb250cm9scygpfVxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURldGFpbHNcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQStDO0FBQUE7QUFBQTtBQUFBO0FBRWhDLE1BQU1BLGlCQUFpQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQVk3REMsa0JBQWtCLEdBQUc7SUFDbkIsSUFBSSxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsUUFBUSxLQUFLQyx5QkFBZ0IsSUFBSSxJQUFJLENBQUNGLEtBQUssQ0FBQ0MsUUFBUSxLQUFLRSwyQkFBa0IsRUFBRTtNQUMxRixPQUFPLElBQUk7SUFDYjtJQUNBLE9BQ0U7TUFBSyxTQUFTLEVBQUM7SUFBbUMsR0FDaEQ7TUFDRSxTQUFTLEVBQUUsSUFBQUMsbUJBQUUsRUFBQyxpQ0FBaUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDSixLQUFLLENBQUNLLFVBQVUsQ0FBRTtNQUNoRixPQUFPLEVBQUUsSUFBSSxDQUFDTCxLQUFLLENBQUNNO0lBQU8sR0FDMUIsSUFBSSxDQUFDTixLQUFLLENBQUNPLFVBQVUsQ0FDZixDQUNMO0VBRVY7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FDRTtNQUFLLFNBQVMsRUFBQztJQUEyQixHQUN4QztNQUFLLFNBQVMsRUFBQztJQUFvQyxHQUNqRDtNQUFRLFNBQVMsRUFBQztJQUFpQyxHQUNqRDtNQUFJLFNBQVMsRUFBQztJQUFnQyxHQUFFLElBQUksQ0FBQ1IsS0FBSyxDQUFDUyxLQUFLLENBQU0sRUFDckUsSUFBSSxDQUFDVixrQkFBa0IsRUFBRSxDQUNuQixFQUNUO01BQUssU0FBUyxFQUFDO0lBQWtDLEdBQzlDLElBQUksQ0FBQ0MsS0FBSyxDQUFDVSxRQUFRLENBQ2hCLENBQ0YsQ0FDRjtFQUVWO0FBQ0Y7QUFBQztBQUFBLGdCQTFDb0JkLGlCQUFpQixlQUNqQjtFQUNqQmEsS0FBSyxFQUFFRSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDbENSLFVBQVUsRUFBRU0sa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3ZDTixVQUFVLEVBQUVJLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUV2Q1AsTUFBTSxFQUFFSyxrQkFBUyxDQUFDRyxJQUFJLENBQUNELFVBQVU7RUFFakNILFFBQVEsRUFBRUMsa0JBQVMsQ0FBQ0ksT0FBTyxDQUFDRixVQUFVO0VBQ3RDWixRQUFRLEVBQUVlLDRCQUFnQixDQUFDSDtBQUM3QixDQUFDIn0=