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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('github-HunkHeaderView', conditional),
      onMouseDown: this.didMouseDown
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-HunkHeaderView-title"
    }, this.props.hunk.getHeader().trim(), " ", this.props.hunk.getSectionHeading().trim()), this.renderButtons());
  }

  renderButtons() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    } else {
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
        className: "github-HunkHeaderView-stageButton",
        onClick: this.props.toggleSelection,
        onMouseDown: theBuckStopsHere
      }, /*#__PURE__*/_react.default.createElement(_keystroke.default, {
        keymaps: this.props.keymaps,
        command: "core:confirm",
        refTarget: this.props.refTarget
      }), this.props.toggleSelectionLabel), this.props.stagingStatus === 'unstaged' && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
        ref: this.refDiscardButton.setter,
        className: "icon-trashcan github-HunkHeaderView-discardButton",
        onClick: this.props.discardSelection,
        onMouseDown: theBuckStopsHere
      }), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9odW5rLWhlYWRlci12aWV3LmpzIl0sIm5hbWVzIjpbInRoZUJ1Y2tTdG9wc0hlcmUiLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsIkh1bmtIZWFkZXJWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVmRGlzY2FyZEJ1dHRvbiIsIlJlZkhvbGRlciIsInJlbmRlciIsImNvbmRpdGlvbmFsIiwiaXNTZWxlY3RlZCIsInNlbGVjdGlvbk1vZGUiLCJkaWRNb3VzZURvd24iLCJodW5rIiwiZ2V0SGVhZGVyIiwidHJpbSIsImdldFNlY3Rpb25IZWFkaW5nIiwicmVuZGVyQnV0dG9ucyIsIml0ZW1UeXBlIiwiQ29tbWl0RGV0YWlsSXRlbSIsIklzc3VlaXNoRGV0YWlsSXRlbSIsInRvZ2dsZVNlbGVjdGlvbiIsImtleW1hcHMiLCJyZWZUYXJnZXQiLCJ0b2dnbGVTZWxlY3Rpb25MYWJlbCIsInN0YWdpbmdTdGF0dXMiLCJzZXR0ZXIiLCJkaXNjYXJkU2VsZWN0aW9uIiwidG9vbHRpcHMiLCJkaXNjYXJkU2VsZWN0aW9uTGFiZWwiLCJtb3VzZURvd24iLCJSZWZIb2xkZXJQcm9wVHlwZSIsImlzUmVxdWlyZWQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJib29sIiwib25lT2YiLCJzdHJpbmciLCJmdW5jIiwiSXRlbVR5cGVQcm9wVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsU0FBU0EsZ0JBQVQsQ0FBMEJDLEtBQTFCLEVBQWlDO0FBQy9CQSxFQUFBQSxLQUFLLENBQUNDLGVBQU47QUFDRDs7QUFFYyxNQUFNQyxjQUFOLFNBQTZCQyxlQUFNQyxTQUFuQyxDQUE2QztBQW1CMURDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2pCLFVBQU1BLEtBQU47QUFD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ZjtBQU9qQlIsRUFBQUEscUJBQXFCLEVBQUVJLG1CQUFVSSxNQVBoQjtBQVNqQlQsRUFBQUEsUUFBUSxFQUFFSyxtQkFBVUMsTUFBVixDQUFpQkYsVUFUVjtBQVVqQlYsRUFBQUEsT0FBTyxFQUFFVyxtQkFBVUMsTUFBVixDQUFpQkYsVUFWVDtBQVlqQlgsRUFBQUEsZUFBZSxFQUFFWSxtQkFBVUssSUFaVjtBQWFqQlgsRUFBQUEsZ0JBQWdCLEVBQUVNLG1CQUFVSyxJQWJYO0FBY2pCUixFQUFBQSxTQUFTLEVBQUVHLG1CQUFVSyxJQUFWLENBQWVOLFVBZFQ7QUFlakJkLEVBQUFBLFFBQVEsRUFBRXFCLDZCQUFpQlA7QUFmVixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZSwgSXRlbVR5cGVQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgS2V5c3Ryb2tlIGZyb20gJy4uL2F0b20va2V5c3Ryb2tlJztcbmltcG9ydCBDb21taXREZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2NvbW1pdC1kZXRhaWwtaXRlbSc7XG5pbXBvcnQgSXNzdWVpc2hEZXRhaWxJdGVtIGZyb20gJy4uL2l0ZW1zL2lzc3VlaXNoLWRldGFpbC1pdGVtJztcblxuZnVuY3Rpb24gdGhlQnVja1N0b3BzSGVyZShldmVudCkge1xuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHVua0hlYWRlclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlZlRhcmdldDogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBodW5rOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzdGFnaW5nU3RhdHVzOiBQcm9wVHlwZXMub25lT2YoWyd1bnN0YWdlZCcsICdzdGFnZWQnXSksXG4gICAgc2VsZWN0aW9uTW9kZTogUHJvcFR5cGVzLm9uZU9mKFsnaHVuaycsICdsaW5lJ10pLmlzUmVxdWlyZWQsXG4gICAgdG9nZ2xlU2VsZWN0aW9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGlzY2FyZFNlbGVjdGlvbkxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICB0b2dnbGVTZWxlY3Rpb246IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpc2NhcmRTZWxlY3Rpb246IFByb3BUeXBlcy5mdW5jLFxuICAgIG1vdXNlRG93bjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBpdGVtVHlwZTogSXRlbVR5cGVQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdkaWRNb3VzZURvd24nLCAncmVuZGVyQnV0dG9ucycpO1xuXG4gICAgdGhpcy5yZWZEaXNjYXJkQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvbmRpdGlvbmFsID0ge1xuICAgICAgJ2dpdGh1Yi1IdW5rSGVhZGVyVmlldy0taXNTZWxlY3RlZCc6IHRoaXMucHJvcHMuaXNTZWxlY3RlZCxcbiAgICAgICdnaXRodWItSHVua0hlYWRlclZpZXctLWlzSHVua01vZGUnOiB0aGlzLnByb3BzLnNlbGVjdGlvbk1vZGUgPT09ICdodW5rJyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUh1bmtIZWFkZXJWaWV3JywgY29uZGl0aW9uYWwpfSBvbk1vdXNlRG93bj17dGhpcy5kaWRNb3VzZURvd259PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItSHVua0hlYWRlclZpZXctdGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5odW5rLmdldEhlYWRlcigpLnRyaW0oKX0ge3RoaXMucHJvcHMuaHVuay5nZXRTZWN0aW9uSGVhZGluZygpLnRyaW0oKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICB7dGhpcy5yZW5kZXJCdXR0b25zKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQnV0dG9ucygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pdGVtVHlwZSA9PT0gQ29tbWl0RGV0YWlsSXRlbSB8fCB0aGlzLnByb3BzLml0ZW1UeXBlID09PSBJc3N1ZWlzaERldGFpbEl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLUh1bmtIZWFkZXJWaWV3LXN0YWdlQnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMudG9nZ2xlU2VsZWN0aW9ufVxuICAgICAgICAgICAgb25Nb3VzZURvd249e3RoZUJ1Y2tTdG9wc0hlcmV9PlxuICAgICAgICAgICAgPEtleXN0cm9rZSBrZXltYXBzPXt0aGlzLnByb3BzLmtleW1hcHN9IGNvbW1hbmQ9XCJjb3JlOmNvbmZpcm1cIiByZWZUYXJnZXQ9e3RoaXMucHJvcHMucmVmVGFyZ2V0fSAvPlxuICAgICAgICAgICAge3RoaXMucHJvcHMudG9nZ2xlU2VsZWN0aW9uTGFiZWx9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge3RoaXMucHJvcHMuc3RhZ2luZ1N0YXR1cyA9PT0gJ3Vuc3RhZ2VkJyAmJiAoXG4gICAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICByZWY9e3RoaXMucmVmRGlzY2FyZEJ1dHRvbi5zZXR0ZXJ9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaWNvbi10cmFzaGNhbiBnaXRodWItSHVua0hlYWRlclZpZXctZGlzY2FyZEJ1dHRvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5kaXNjYXJkU2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGVCdWNrU3RvcHNIZXJlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgdGFyZ2V0PXt0aGlzLnJlZkRpc2NhcmRCdXR0b259XG4gICAgICAgICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMuZGlzY2FyZFNlbGVjdGlvbkxhYmVsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBkaWRNb3VzZURvd24oZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tb3VzZURvd24oZXZlbnQsIHRoaXMucHJvcHMuaHVuayk7XG4gIH1cbn1cbiJdfQ==