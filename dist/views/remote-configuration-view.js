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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement("details", {
      className: "github-RemoteConfiguration-details block"
    }, /*#__PURE__*/_react.default.createElement(_tabbable.TabbableSummary, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands
    }, "Advanced"), /*#__PURE__*/_react.default.createElement("main", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-RemoteConfiguration-protocol block"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-RemoteConfiguration-protocolHeading"
    }, "Protocol:"), /*#__PURE__*/_react.default.createElement("label", {
      className: httpsClassName
    }, /*#__PURE__*/_react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "protocol",
      value: "https",
      checked: this.props.currentProtocol === 'https',
      onChange: this.handleProtocolChange
    }), "HTTPS"), /*#__PURE__*/_react.default.createElement("label", {
      className: sshClassName
    }, /*#__PURE__*/_react.default.createElement(_tabbable.TabbableInput, {
      tabGroup: this.props.tabGroup,
      commands: this.props.commands,
      className: "input-radio",
      type: "radio",
      name: "protocol",
      value: "ssh",
      checked: this.props.currentProtocol === 'ssh',
      onChange: this.handleProtocolChange
    }), "SSH")), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-RemoteConfiguration-sourceRemote block"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "input-label"
    }, "Source remote name:", /*#__PURE__*/_react.default.createElement(_tabbable.TabbableTextEditor, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZW1vdGUtY29uZmlndXJhdGlvbi12aWV3LmpzIl0sIm5hbWVzIjpbIlJlbW90ZUNvbmZpZ3VyYXRpb25WaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJldmVudCIsInByb3BzIiwiZGlkQ2hhbmdlUHJvdG9jb2wiLCJ0YXJnZXQiLCJ2YWx1ZSIsInJlbmRlciIsImh0dHBzQ2xhc3NOYW1lIiwic3NoQ2xhc3NOYW1lIiwidGFiR3JvdXAiLCJjb21tYW5kcyIsImN1cnJlbnRQcm90b2NvbCIsImhhbmRsZVByb3RvY29sQ2hhbmdlIiwic291cmNlUmVtb3RlQnVmZmVyIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSx1QkFBTixTQUFzQ0MsZUFBTUMsU0FBNUMsQ0FBc0Q7QUFBQTtBQUFBOztBQUFBLGtEQTBFNUNDLEtBQUssSUFBSTtBQUM5QixXQUFLQyxLQUFMLENBQVdDLGlCQUFYLENBQTZCRixLQUFLLENBQUNHLE1BQU4sQ0FBYUMsS0FBMUM7QUFDRCxLQTVFa0U7QUFBQTs7QUFXbkVDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLGNBQWMsR0FBRyx5QkFDckIsMkNBRHFCLEVBRXJCLGtEQUZxQixFQUdyQixhQUhxQixDQUF2QjtBQU1BLFVBQU1DLFlBQVksR0FBRyx5QkFDbkIsMkNBRG1CLEVBRW5CLGdEQUZtQixFQUduQixhQUhtQixDQUFyQjtBQU1BLHdCQUNFO0FBQVMsTUFBQSxTQUFTLEVBQUM7QUFBbkIsb0JBQ0UsNkJBQUMseUJBQUQ7QUFBaUIsTUFBQSxRQUFRLEVBQUUsS0FBS04sS0FBTCxDQUFXTyxRQUF0QztBQUFnRCxNQUFBLFFBQVEsRUFBRSxLQUFLUCxLQUFMLENBQVdRO0FBQXJFLGtCQURGLGVBRUUsd0RBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQU0sTUFBQSxTQUFTLEVBQUM7QUFBaEIsbUJBREYsZUFFRTtBQUFPLE1BQUEsU0FBUyxFQUFFSDtBQUFsQixvQkFDRSw2QkFBQyx1QkFBRDtBQUNFLE1BQUEsUUFBUSxFQUFFLEtBQUtMLEtBQUwsQ0FBV08sUUFEdkI7QUFFRSxNQUFBLFFBQVEsRUFBRSxLQUFLUCxLQUFMLENBQVdRLFFBRnZCO0FBR0UsTUFBQSxTQUFTLEVBQUMsYUFIWjtBQUlFLE1BQUEsSUFBSSxFQUFDLE9BSlA7QUFLRSxNQUFBLElBQUksRUFBQyxVQUxQO0FBTUUsTUFBQSxLQUFLLEVBQUMsT0FOUjtBQU9FLE1BQUEsT0FBTyxFQUFFLEtBQUtSLEtBQUwsQ0FBV1MsZUFBWCxLQUErQixPQVAxQztBQVFFLE1BQUEsUUFBUSxFQUFFLEtBQUtDO0FBUmpCLE1BREYsVUFGRixlQWVFO0FBQU8sTUFBQSxTQUFTLEVBQUVKO0FBQWxCLG9CQUNFLDZCQUFDLHVCQUFEO0FBQ0UsTUFBQSxRQUFRLEVBQUUsS0FBS04sS0FBTCxDQUFXTyxRQUR2QjtBQUVFLE1BQUEsUUFBUSxFQUFFLEtBQUtQLEtBQUwsQ0FBV1EsUUFGdkI7QUFHRSxNQUFBLFNBQVMsRUFBQyxhQUhaO0FBSUUsTUFBQSxJQUFJLEVBQUMsT0FKUDtBQUtFLE1BQUEsSUFBSSxFQUFDLFVBTFA7QUFNRSxNQUFBLEtBQUssRUFBQyxLQU5SO0FBT0UsTUFBQSxPQUFPLEVBQUUsS0FBS1IsS0FBTCxDQUFXUyxlQUFYLEtBQStCLEtBUDFDO0FBUUUsTUFBQSxRQUFRLEVBQUUsS0FBS0M7QUFSakIsTUFERixRQWZGLENBREYsZUE4QkU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQU8sTUFBQSxTQUFTLEVBQUM7QUFBakIsMkNBQ0UsNkJBQUMsNEJBQUQ7QUFDRSxNQUFBLFFBQVEsRUFBRSxLQUFLVixLQUFMLENBQVdPLFFBRHZCO0FBRUUsTUFBQSxRQUFRLEVBQUUsS0FBS1AsS0FBTCxDQUFXUSxRQUZ2QjtBQUdFLE1BQUEsU0FBUyxFQUFDLDZDQUhaO0FBSUUsTUFBQSxJQUFJLEVBQUUsSUFKUjtBQUtFLE1BQUEsU0FBUyxFQUFFLEtBTGI7QUFNRSxNQUFBLE1BQU0sRUFBRSxLQUFLUixLQUFMLENBQVdXO0FBTnJCLE1BREYsQ0FERixDQTlCRixDQUZGLENBREY7QUFnREQ7O0FBeEVrRTs7OztnQkFBaERmLHVCLGVBQ0E7QUFDakJXLEVBQUFBLFFBQVEsRUFBRUssbUJBQVVDLE1BQVYsQ0FBaUJDLFVBRFY7QUFFakJMLEVBQUFBLGVBQWUsRUFBRUcsbUJBQVVHLEtBQVYsQ0FBZ0IsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFoQixDQUZBO0FBR2pCSixFQUFBQSxrQkFBa0IsRUFBRUMsbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSHBCO0FBSWpCYixFQUFBQSxpQkFBaUIsRUFBRVcsbUJBQVVJLElBQVYsQ0FBZUYsVUFKakI7QUFNakI7QUFDQU4sRUFBQUEsUUFBUSxFQUFFSSxtQkFBVUMsTUFBVixDQUFpQkM7QUFQVixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7VGFiYmFibGVJbnB1dCwgVGFiYmFibGVTdW1tYXJ5LCBUYWJiYWJsZVRleHRFZGl0b3J9IGZyb20gJy4vdGFiYmFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGVDb25maWd1cmF0aW9uVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGFiR3JvdXA6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50UHJvdG9jb2w6IFByb3BUeXBlcy5vbmVPZihbJ2h0dHBzJywgJ3NzaCddKSxcbiAgICBzb3VyY2VSZW1vdGVCdWZmZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBkaWRDaGFuZ2VQcm90b2NvbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGh0dHBzQ2xhc3NOYW1lID0gY3goXG4gICAgICAnZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tcHJvdG9jb2xPcHRpb24nLFxuICAgICAgJ2dpdGh1Yi1SZW1vdGVDb25maWd1cmF0aW9uLXByb3RvY29sT3B0aW9uLS1odHRwcycsXG4gICAgICAnaW5wdXQtbGFiZWwnLFxuICAgICk7XG5cbiAgICBjb25zdCBzc2hDbGFzc05hbWUgPSBjeChcbiAgICAgICdnaXRodWItUmVtb3RlQ29uZmlndXJhdGlvbi1wcm90b2NvbE9wdGlvbicsXG4gICAgICAnZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tcHJvdG9jb2xPcHRpb24tLXNzaCcsXG4gICAgICAnaW5wdXQtbGFiZWwnLFxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHMgY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tZGV0YWlscyBibG9ja1wiPlxuICAgICAgICA8VGFiYmFibGVTdW1tYXJ5IHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfSBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc30+QWR2YW5jZWQ8L1RhYmJhYmxlU3VtbWFyeT5cbiAgICAgICAgPG1haW4+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVtb3RlQ29uZmlndXJhdGlvbi1wcm90b2NvbCBibG9ja1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tcHJvdG9jb2xIZWFkaW5nXCI+UHJvdG9jb2w6PC9zcGFuPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT17aHR0cHNDbGFzc05hbWV9PlxuICAgICAgICAgICAgICA8VGFiYmFibGVJbnB1dFxuICAgICAgICAgICAgICAgIHRhYkdyb3VwPXt0aGlzLnByb3BzLnRhYkdyb3VwfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXJhZGlvXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJwcm90b2NvbFwiXG4gICAgICAgICAgICAgICAgdmFsdWU9XCJodHRwc1wiXG4gICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5wcm9wcy5jdXJyZW50UHJvdG9jb2wgPT09ICdodHRwcyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUHJvdG9jb2xDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIEhUVFBTXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT17c3NoQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgPFRhYmJhYmxlSW5wdXRcbiAgICAgICAgICAgICAgICB0YWJHcm91cD17dGhpcy5wcm9wcy50YWJHcm91cH1cbiAgICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1yYWRpb1wiXG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwicHJvdG9jb2xcIlxuICAgICAgICAgICAgICAgIHZhbHVlPVwic3NoXCJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXt0aGlzLnByb3BzLmN1cnJlbnRQcm90b2NvbCA9PT0gJ3NzaCd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUHJvdG9jb2xDaGFuZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIFNTSFxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZW1vdGVDb25maWd1cmF0aW9uLXNvdXJjZVJlbW90ZSBibG9ja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImlucHV0LWxhYmVsXCI+U291cmNlIHJlbW90ZSBuYW1lOlxuICAgICAgICAgICAgICA8VGFiYmFibGVUZXh0RWRpdG9yXG4gICAgICAgICAgICAgICAgdGFiR3JvdXA9e3RoaXMucHJvcHMudGFiR3JvdXB9XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZUNvbmZpZ3VyYXRpb24tc291cmNlUmVtb3RlTmFtZVwiXG4gICAgICAgICAgICAgICAgbWluaT17dHJ1ZX1cbiAgICAgICAgICAgICAgICBhdXRvV2lkdGg9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGJ1ZmZlcj17dGhpcy5wcm9wcy5zb3VyY2VSZW1vdGVCdWZmZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L21haW4+XG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVByb3RvY29sQ2hhbmdlID0gZXZlbnQgPT4ge1xuICAgIHRoaXMucHJvcHMuZGlkQ2hhbmdlUHJvdG9jb2woZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxufVxuIl19