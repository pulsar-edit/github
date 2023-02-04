"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _helpers = require("../helpers");
var _propTypes2 = require("../prop-types");
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _tooltip = _interopRequireDefault(require("../atom/tooltip"));
var _keystroke = _interopRequireDefault(require("../atom/keystroke"));
var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));
var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function theBuckStopsHere(event) {
  event.stopPropagation();
}
class HunkHeaderView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'didMouseDown', 'renderButtons');
    this.refDiscardButton = new _refHolder.default();
  }
  render() {
    const conditional = {
      'github-HunkHeaderView--isSelected': this.props.isSelected,
      'github-HunkHeaderView--isHunkMode': this.props.selectionMode === 'hunk'
    };
    return _react.default.createElement("div", {
      className: (0, _classnames.default)('github-HunkHeaderView', conditional),
      onMouseDown: this.didMouseDown
    }, _react.default.createElement("span", {
      className: "github-HunkHeaderView-title"
    }, this.props.hunk.getHeader().trim(), " ", this.props.hunk.getSectionHeading().trim()), this.renderButtons());
  }
  renderButtons() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    } else {
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement("button", {
        className: "github-HunkHeaderView-stageButton",
        onClick: this.props.toggleSelection,
        onMouseDown: theBuckStopsHere
      }, _react.default.createElement(_keystroke.default, {
        keymaps: this.props.keymaps,
        command: "core:confirm",
        refTarget: this.props.refTarget
      }), this.props.toggleSelectionLabel), this.props.stagingStatus === 'unstaged' && _react.default.createElement(_react.Fragment, null, _react.default.createElement("button", {
        ref: this.refDiscardButton.setter,
        className: "icon-trashcan github-HunkHeaderView-discardButton",
        onClick: this.props.discardSelection,
        onMouseDown: theBuckStopsHere
      }), _react.default.createElement(_tooltip.default, {
        manager: this.props.tooltips,
        target: this.refDiscardButton,
        title: this.props.discardSelectionLabel
      })));
    }
  }
  didMouseDown(event) {
    return this.props.mouseDown(event, this.props.hunk);
  }
}
exports.default = HunkHeaderView;
_defineProperty(HunkHeaderView, "propTypes", {
  refTarget: _propTypes2.RefHolderPropType.isRequired,
  hunk: _propTypes.default.object.isRequired,
  isSelected: _propTypes.default.bool.isRequired,
  stagingStatus: _propTypes.default.oneOf(['unstaged', 'staged']),
  selectionMode: _propTypes.default.oneOf(['hunk', 'line']).isRequired,
  toggleSelectionLabel: _propTypes.default.string,
  discardSelectionLabel: _propTypes.default.string,
  tooltips: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  toggleSelection: _propTypes.default.func,
  discardSelection: _propTypes.default.func,
  mouseDown: _propTypes.default.func.isRequired,
  itemType: _propTypes2.ItemTypePropType.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0aGVCdWNrU3RvcHNIZXJlIiwiZXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJIdW5rSGVhZGVyVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwicmVmRGlzY2FyZEJ1dHRvbiIsIlJlZkhvbGRlciIsInJlbmRlciIsImNvbmRpdGlvbmFsIiwiaXNTZWxlY3RlZCIsInNlbGVjdGlvbk1vZGUiLCJjeCIsImRpZE1vdXNlRG93biIsImh1bmsiLCJnZXRIZWFkZXIiLCJ0cmltIiwiZ2V0U2VjdGlvbkhlYWRpbmciLCJyZW5kZXJCdXR0b25zIiwiaXRlbVR5cGUiLCJDb21taXREZXRhaWxJdGVtIiwiSXNzdWVpc2hEZXRhaWxJdGVtIiwidG9nZ2xlU2VsZWN0aW9uIiwia2V5bWFwcyIsInJlZlRhcmdldCIsInRvZ2dsZVNlbGVjdGlvbkxhYmVsIiwic3RhZ2luZ1N0YXR1cyIsInNldHRlciIsImRpc2NhcmRTZWxlY3Rpb24iLCJ0b29sdGlwcyIsImRpc2NhcmRTZWxlY3Rpb25MYWJlbCIsIm1vdXNlRG93biIsIlJlZkhvbGRlclByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImJvb2wiLCJvbmVPZiIsInN0cmluZyIsImZ1bmMiLCJJdGVtVHlwZVByb3BUeXBlIl0sInNvdXJjZXMiOlsiaHVuay1oZWFkZXItdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlLCBJdGVtVHlwZVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vYXRvbS90b29sdGlwJztcbmltcG9ydCBLZXlzdHJva2UgZnJvbSAnLi4vYXRvbS9rZXlzdHJva2UnO1xuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuXG5mdW5jdGlvbiB0aGVCdWNrU3RvcHNIZXJlKGV2ZW50KSB7XG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdW5rSGVhZGVyVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVmVGFyZ2V0OiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGh1bms6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHN0YWdpbmdTdGF0dXM6IFByb3BUeXBlcy5vbmVPZihbJ3Vuc3RhZ2VkJywgJ3N0YWdlZCddKSxcbiAgICBzZWxlY3Rpb25Nb2RlOiBQcm9wVHlwZXMub25lT2YoWydodW5rJywgJ2xpbmUnXSkuaXNSZXF1aXJlZCxcbiAgICB0b2dnbGVTZWxlY3Rpb25MYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNjYXJkU2VsZWN0aW9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGtleW1hcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIHRvZ2dsZVNlbGVjdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGlzY2FyZFNlbGVjdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbW91c2VEb3duOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2RpZE1vdXNlRG93bicsICdyZW5kZXJCdXR0b25zJyk7XG5cbiAgICB0aGlzLnJlZkRpc2NhcmRCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29uZGl0aW9uYWwgPSB7XG4gICAgICAnZ2l0aHViLUh1bmtIZWFkZXJWaWV3LS1pc1NlbGVjdGVkJzogdGhpcy5wcm9wcy5pc1NlbGVjdGVkLFxuICAgICAgJ2dpdGh1Yi1IdW5rSGVhZGVyVmlldy0taXNIdW5rTW9kZSc6IHRoaXMucHJvcHMuc2VsZWN0aW9uTW9kZSA9PT0gJ2h1bmsnLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2N4KCdnaXRodWItSHVua0hlYWRlclZpZXcnLCBjb25kaXRpb25hbCl9IG9uTW91c2VEb3duPXt0aGlzLmRpZE1vdXNlRG93bn0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1IdW5rSGVhZGVyVmlldy10aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmh1bmsuZ2V0SGVhZGVyKCkudHJpbSgpfSB7dGhpcy5wcm9wcy5odW5rLmdldFNlY3Rpb25IZWFkaW5nKCkudHJpbSgpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIHt0aGlzLnJlbmRlckJ1dHRvbnMoKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJCdXR0b25zKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDb21taXREZXRhaWxJdGVtIHx8IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IElzc3VlaXNoRGV0YWlsSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItSHVua0hlYWRlclZpZXctc3RhZ2VCdXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy50b2dnbGVTZWxlY3Rpb259XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17dGhlQnVja1N0b3BzSGVyZX0+XG4gICAgICAgICAgICA8S2V5c3Ryb2tlIGtleW1hcHM9e3RoaXMucHJvcHMua2V5bWFwc30gY29tbWFuZD1cImNvcmU6Y29uZmlybVwiIHJlZlRhcmdldD17dGhpcy5wcm9wcy5yZWZUYXJnZXR9IC8+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy50b2dnbGVTZWxlY3Rpb25MYWJlbH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5zdGFnaW5nU3RhdHVzID09PSAndW5zdGFnZWQnICYmIChcbiAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHJlZj17dGhpcy5yZWZEaXNjYXJkQnV0dG9uLnNldHRlcn1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uLXRyYXNoY2FuIGdpdGh1Yi1IdW5rSGVhZGVyVmlldy1kaXNjYXJkQnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmRpc2NhcmRTZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd249e3RoZUJ1Y2tTdG9wc0hlcmV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICB0YXJnZXQ9e3RoaXMucmVmRGlzY2FyZEJ1dHRvbn1cbiAgICAgICAgICAgICAgICB0aXRsZT17dGhpcy5wcm9wcy5kaXNjYXJkU2VsZWN0aW9uTGFiZWx9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGRpZE1vdXNlRG93bihldmVudCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLm1vdXNlRG93bihldmVudCwgdGhpcy5wcm9wcy5odW5rKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUErRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFL0QsU0FBU0EsZ0JBQWdCLENBQUNDLEtBQUssRUFBRTtFQUMvQkEsS0FBSyxDQUFDQyxlQUFlLEVBQUU7QUFDekI7QUFFZSxNQUFNQyxjQUFjLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBbUIxREMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFDWixJQUFBQyxpQkFBUSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDO0lBRS9DLElBQUksQ0FBQ0MsZ0JBQWdCLEdBQUcsSUFBSUMsa0JBQVMsRUFBRTtFQUN6QztFQUVBQyxNQUFNLEdBQUc7SUFDUCxNQUFNQyxXQUFXLEdBQUc7TUFDbEIsbUNBQW1DLEVBQUUsSUFBSSxDQUFDTCxLQUFLLENBQUNNLFVBQVU7TUFDMUQsbUNBQW1DLEVBQUUsSUFBSSxDQUFDTixLQUFLLENBQUNPLGFBQWEsS0FBSztJQUNwRSxDQUFDO0lBRUQsT0FDRTtNQUFLLFNBQVMsRUFBRSxJQUFBQyxtQkFBRSxFQUFDLHVCQUF1QixFQUFFSCxXQUFXLENBQUU7TUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDSTtJQUFhLEdBQ3ZGO01BQU0sU0FB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