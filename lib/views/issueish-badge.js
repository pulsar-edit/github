"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const typeAndStateToIcon = {
  Issue: {
    OPEN: 'issue-opened',
    CLOSED: 'issue-closed'
  },
  PullRequest: {
    OPEN: 'git-pull-request',
    CLOSED: 'git-pull-request',
    MERGED: 'git-merge'
  }
};
class IssueishBadge extends _react.default.Component {
  render() {
    const _this$props = this.props,
      {
        type,
        state
      } = _this$props,
      others = _objectWithoutProperties(_this$props, ["type", "state"]);
    const icons = typeAndStateToIcon[type] || {};
    const icon = icons[state] || 'question';
    const {
        className
      } = others,
      otherProps = _objectWithoutProperties(others, ["className"]);
    return _react.default.createElement("span", _extends({
      className: (0, _classnames.default)(className, 'github-IssueishBadge', state.toLowerCase())
    }, otherProps), _react.default.createElement(_octicon.default, {
      icon: icon
    }), state.toLowerCase());
  }
}
exports.default = IssueishBadge;
_defineProperty(IssueishBadge, "propTypes", {
  type: _propTypes.default.oneOf(['Issue', 'PullRequest', 'Unknown']).isRequired,
  state: _propTypes.default.oneOf(['OPEN', 'CLOSED', 'MERGED', 'UNKNOWN']).isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0eXBlQW5kU3RhdGVUb0ljb24iLCJJc3N1ZSIsIk9QRU4iLCJDTE9TRUQiLCJQdWxsUmVxdWVzdCIsIk1FUkdFRCIsIklzc3VlaXNoQmFkZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidHlwZSIsInN0YXRlIiwib3RoZXJzIiwiaWNvbnMiLCJpY29uIiwiY2xhc3NOYW1lIiwib3RoZXJQcm9wcyIsImN4IiwidG9Mb3dlckNhc2UiLCJQcm9wVHlwZXMiLCJvbmVPZiIsImlzUmVxdWlyZWQiXSwic291cmNlcyI6WyJpc3N1ZWlzaC1iYWRnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuY29uc3QgdHlwZUFuZFN0YXRlVG9JY29uID0ge1xuICBJc3N1ZToge1xuICAgIE9QRU46ICdpc3N1ZS1vcGVuZWQnLFxuICAgIENMT1NFRDogJ2lzc3VlLWNsb3NlZCcsXG4gIH0sXG4gIFB1bGxSZXF1ZXN0OiB7XG4gICAgT1BFTjogJ2dpdC1wdWxsLXJlcXVlc3QnLFxuICAgIENMT1NFRDogJ2dpdC1wdWxsLXJlcXVlc3QnLFxuICAgIE1FUkdFRDogJ2dpdC1tZXJnZScsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZWlzaEJhZGdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoW1xuICAgICAgJ0lzc3VlJywgJ1B1bGxSZXF1ZXN0JywgJ1Vua25vd24nLFxuICAgIF0pLmlzUmVxdWlyZWQsXG4gICAgc3RhdGU6IFByb3BUeXBlcy5vbmVPZihbXG4gICAgICAnT1BFTicsICdDTE9TRUQnLCAnTUVSR0VEJywgJ1VOS05PV04nLFxuICAgIF0pLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3R5cGUsIHN0YXRlLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpY29ucyA9IHR5cGVBbmRTdGF0ZVRvSWNvblt0eXBlXSB8fCB7fTtcbiAgICBjb25zdCBpY29uID0gaWNvbnNbc3RhdGVdIHx8ICdxdWVzdGlvbic7XG5cbiAgICBjb25zdCB7Y2xhc3NOYW1lLCAuLi5vdGhlclByb3BzfSA9IG90aGVycztcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjeChjbGFzc05hbWUsICdnaXRodWItSXNzdWVpc2hCYWRnZScsIHN0YXRlLnRvTG93ZXJDYXNlKCkpfSB7Li4ub3RoZXJQcm9wc30+XG4gICAgICAgIDxPY3RpY29uIGljb249e2ljb259IC8+XG4gICAgICAgIHtzdGF0ZS50b0xvd2VyQ2FzZSgpfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFBc0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFdEMsTUFBTUEsa0JBQWtCLEdBQUc7RUFDekJDLEtBQUssRUFBRTtJQUNMQyxJQUFJLEVBQUUsY0FBYztJQUNwQkMsTUFBTSxFQUFFO0VBQ1YsQ0FBQztFQUNEQyxXQUFXLEVBQUU7SUFDWEYsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QkMsTUFBTSxFQUFFLGtCQUFrQjtJQUMxQkUsTUFBTSxFQUFFO0VBQ1Y7QUFDRixDQUFDO0FBRWMsTUFBTUMsYUFBYSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQVV6REMsTUFBTSxHQUFHO0lBQ1Asb0JBQWlDLElBQUksQ0FBQ0MsS0FBSztNQUFyQztRQUFDQyxJQUFJO1FBQUVDO01BQWdCLENBQUM7TUFBUEMsTUFBTTtJQUM3QixNQUFNQyxLQUFLLEdBQUdkLGtCQUFrQixDQUFDVyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsTUFBTUksSUFBSSxHQUFHRCxLQUFLLENBQUNGLEtBQUssQ0FBQyxJQUFJLFVBQVU7SUFFdkMsTUFBTTtRQUFDSTtNQUF3QixDQUFDLEdBQUdILE1BQU07TUFBcEJJLFVBQVUsNEJBQUlKLE1BQU07SUFDekMsT0FDRTtNQUFNLFNBQVMsRUFBRSxJQUFBSyxtQkFBRSxFQUFDRixTQUFTLEVBQUUsc0JBQXNCLEVBQUVKLEtBQUssQ0FBQ08sV0FBVyxFQUFFO0lBQUUsR0FBS0YsVUFBVSxHQUN6Riw2QkFBQyxnQkFBTztNQUFDLElBQUksRUFBRUY7SUFBSyxFQUFHLEVBQ3RCSCxLQUFLLENBQUNPLFdBQVcsRUFBRSxDQUNmO0VBRVg7QUFDRjtBQUFDO0FBQUEsZ0JBdkJvQmIsYUFBYSxlQUNiO0VBQ2pCSyxJQUFJLEVBQUVTLGtCQUFTLENBQUNDLEtBQUssQ0FBQyxDQUNwQixPQUFPLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FDbEMsQ0FBQyxDQUFDQyxVQUFVO0VBQ2JWLEtBQUssRUFBRVEsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDLENBQ3JCLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FDdEMsQ0FBQyxDQUFDQztBQUNMLENBQUMifQ==