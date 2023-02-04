"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _tabbable = require("./tabbable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class RemoteConfigurationView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleProtocolChange", event => {
      this.props.didChangeProtocol(event.target.value);
    });
  }
  render() {
    const httpsClassName = (0, _classnames.default)('github-RemoteConfiguration-protocolOption', 'github-RemoteConfiguration-protocolOption--https', 'input-label');
    const sshClassName = (0, _classnames.default)('github-RemoteConfiguration-protocolOption', 'github-RemoteConfiguration-protocolOption--ssh', 'input-label');
    return _react.default.createElement("details", {
      className: "github-RemoteConfiguration-details block"
    }, _react.default.createElement(_tabbable.TabbableSummary, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands
    }, "Advanced"), _react.default.createElement("main", null, _react.default.createElement("div", {
      className: "github-RemoteConfiguration-protocol block"
    }, _react.default.createElement("span", {
      className: "github-RemoteConfiguration-protocolHeading"
    }, "Protocol:"), _react.default.createElement("label", {
      className: httpsClassName
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "protocol",
      value: "https",
      checked: this.props.currentProtocol === 'https',
      onChange: this.handleProtocolChange
    }), "HTTPS"), _react.default.createElement("label", {
      className: sshClassName
    }, _react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "protocol",
      value: "ssh",
      checked: this.props.currentProtocol === 'ssh',
      onChange: this.handleProtocolChange
    }), "SSH")), _react.default.createElement("div", {
      className: "github-RemoteConfiguration-sourceRemote block"
    }, _react.default.createElement("label", {
      className: "input-label"
    }, "Source remote name:", _react.default.createElement(_tabbable.TabbableTextEditor, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "github-RemoteConfiguration-sourceRemoteName",
      mini: true,
      autoWidth: false,
      buffer: this.props.sourceRemoteBuffer
    })))));
  }
}
exports.default = RemoteConfigurationView;
_defineProperty(RemoteConfigurationView, "propTypes", {
  tabGroup: _propTypes.default.object.isRequired,
  currentProtocol: _propTypes.default.oneOf(['https', 'ssh']),
  sourceRemoteBuffer: _propTypes.default.object.isRequired,
  didChangeProtocol: _propTypes.default.func.isRequired,
  // Atom environment
  commands: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZW1vdGVDb25maWd1cmF0aW9uVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZXZlbnQiLCJwcm9wcyIsImRpZENoYW5nZVByb3RvY29sIiwidGFyZ2V0IiwidmFsdWUiLCJyZW5kZXIiLCJodHRwc0NsYXNzTmFtZSIsImN4Iiwic3NoQ2xhc3NOYW1lIiwidGFiR3JvdXAiLCJjb21tYW5kcyIsImN1cnJlbnRQcm90b2NvbCIsImhhbmRsZVByb3RvY29sQ2hhbmdlIiwic291cmNlUmVtb3RlQnVmZmVyIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwiZnVuYyJdLCJzb3VyY2VzIjpbInJlbW90ZS1jb25maWd1cmF0aW9uLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7VGFiYmFibGVJbnB1dCwgVGFiYmFibGVTdW1tYXJ5LCBUYWJiYWJsZVRleHRFZGl0b3J9IGZyb20gJy4vdGFiYmFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGVDb25maWd1cmF0aW9uVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGFiR3JvdXA6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50UHJvdG9jb2w6IFByb3BUeXBlcy5vbmVPZihbJ2h0dHBzJywgJ3NzaCddKSxcbiAgICBzb3VyY2VSZW1vdGVCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBkaWRDaGFuZ2VQcm90b2NvbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGh0dHBzQ2xhc3NOYW1lID0gY3goXG4gICAgICAnZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tcHJvdG9jb2xPcHRpb24nLFxuICAgICAgJ2dpdGh1Yi1SZW1vdGVDb25maWd1cmF0aW9uLXByb3RvY29sT3B0aW9uLS1odHRwcycsXG4gICAgICAnaW5wdXQtbGFiZWwnLFxuICAgICk7XG5cbiAgICBjb25zdCBzc2hDbGFzc05hbWUgPSBjeChcbiAgICAgICdnaXRodWItUmVtb3RlQ29uZmlndXJhdGlvbi1wcm90b2NvbE9wdGlvbicsXG4gICAgICAnZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tcHJvdG9jb2xPcHRpb24tLXNzaCcsXG4gICAgICAnaW5wdXQtbGFiZWwnLFxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHMgY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tZGV0YWlscyBibG9ja1wiPlxuICAgICAgICA8VGFiYmFibGVTdW1tYXJ5IHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfSBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc30+QWR2YW5jZWQ8L1RhYmJhYmxlU3VtbWFyeT5cbiAgICAgICAgPG1haW4+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVtb3RlQ29uZmlndXJhdGlvbi1wcm90b2NvbCBibG9ja1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tcHJvdG9jb2xIZWFkaW5nXCI+UHJvdG9jb2w6PC9zcGFuPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT17aHR0cHNDbGFzc05hbWV9PlxuICAgICAgICAgICAgICA8VGFiYmFibGVJbnB1dFxuICAgICAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXJhZGlvXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJwcm90b2NvbFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9XCJodHRwc1wiXG4gICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5wcm9wcy5jdXJyZW50UHJvdG9jb2wgPT09ICdodHRwcyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUHJvdG9jb2xDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIEhUVFBTXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT17c3NoQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgPFRhYmJhYmxlSW5wdXRcbiAgICAgICAgICAgICAgICB0YWJHcm91cD17dGhpcy5wcm9wcy50YWJHcm91cH1cbiAgICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1yYWRpb1wiXG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwicHJvdG9jb2xcIlxuICAgICAgICAgICAgICAgIHZhbHVlPVwic3NoXCJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXt0aGlzLnByb3BzLmN1cnJlbnRQcm90b2NvbCA9PT0gJ3NzaCd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUHJvdG9jb2xDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIFNTSFxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZW1vdGVDb25maWd1cmF0aW9uLXNvdXJjZVJlbW90ZSBibG9ja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+U291cmNlIHJlbW90ZSBuYW1lOlxuICAgICAgICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tc291cmNlUmVtb3RlTmFtZVwiXG4gICAgICAgICAgICAgICAgbWluaT17dHJ1ZX1cbiAgICAgICAgICAgICAgICBhdXRvV2lkdGg9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5zb3VyY2VSZW1vdGVCdWZmZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L21haW4+XG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVByb3RvY29sQ2hhbmdlID0gZXZlbnQgPT4ge1xuICAgIHRoaXMucHJvcHMuZGlkQ2hhbmdlUHJvdG9jb2woZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUE4RTtBQUFBO0FBQUE7QUFBQTtBQUUvRCxNQUFNQSx1QkFBdUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEsOENBMEU1Q0MsS0FBSyxJQUFJO01BQzlCLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxpQkFBaUIsQ0FBQ0YsS0FBSyxDQUFDRyxNQUFNLENBQUNDLEtBQUssQ0FBQztJQUNsRCxDQUFDO0VBQUE7RUFqRURDLE1BQU0sR0FBRztJQUNQ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