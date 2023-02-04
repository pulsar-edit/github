"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _propTypes2 = require("../prop-types");
var _helpers = require("../helpers");
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class FilePatchListItemView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refItem = new _refHolder.default();
    this.subs = new _eventKit.CompositeDisposable(this.refItem.observe(item => this.props.registerItemElement(this.props.filePatch, item)));
  }
  render() {
    const _this$props = this.props,
      {
        filePatch,
        selected
      } = _this$props,
      others = _objectWithoutProperties(_this$props, ["filePatch", "selected"]);
    delete others.registerItemElement;
    const status = _helpers.classNameForStatus[filePatch.status];
    const className = selected ? 'is-selected' : '';
    return _react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-FilePatchListView-item is-${status} ${className}`
    }), _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${status} status-${status}`
    }), _react.default.createElement("span", {
      className: "github-FilePatchListView-path"
    }, filePatch.filePath));
  }
  componentWillUnmount() {
    this.subs.dispose();
  }
}
exports.default = FilePatchListItemView;
_defineProperty(FilePatchListItemView, "propTypes", {
  filePatch: _propTypes2.FilePatchItemPropType.isRequired,
  selected: _propTypes.default.bool.isRequired,
  registerItemElement: _propTypes.default.func
});
_defineProperty(FilePatchListItemView, "defaultProps", {
  registerItemElement: () => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlUGF0Y2hMaXN0SXRlbVZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZWZJdGVtIiwiUmVmSG9sZGVyIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJvYnNlcnZlIiwiaXRlbSIsInJlZ2lzdGVySXRlbUVsZW1lbnQiLCJmaWxlUGF0Y2giLCJyZW5kZXIiLCJzZWxlY3RlZCIsIm90aGVycyIsInN0YXR1cyIsImNsYXNzTmFtZUZvclN0YXR1cyIsImNsYXNzTmFtZSIsInNldHRlciIsImZpbGVQYXRoIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwiRmlsZVBhdGNoSXRlbVByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIlByb3BUeXBlcyIsImJvb2wiLCJmdW5jIl0sInNvdXJjZXMiOlsiZmlsZS1wYXRjaC1saXN0LWl0ZW0tdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtGaWxlUGF0Y2hJdGVtUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjbGFzc05hbWVGb3JTdGF0dXN9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbGVQYXRjaExpc3RJdGVtVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZmlsZVBhdGNoOiBGaWxlUGF0Y2hJdGVtUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICByZWdpc3Rlckl0ZW1FbGVtZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgcmVnaXN0ZXJJdGVtRWxlbWVudDogKCkgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVmSXRlbSA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIHRoaXMucmVmSXRlbS5vYnNlcnZlKGl0ZW0gPT4gdGhpcy5wcm9wcy5yZWdpc3Rlckl0ZW1FbGVtZW50KHRoaXMucHJvcHMuZmlsZVBhdGNoLCBpdGVtKSksXG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGNoLCBzZWxlY3RlZCwgLi4ub3RoZXJzfSA9IHRoaXMucHJvcHM7XG4gICAgZGVsZXRlIG90aGVycy5yZWdpc3Rlckl0ZW1FbGVtZW50O1xuICAgIGNvbnN0IHN0YXR1cyA9IGNsYXNzTmFtZUZvclN0YXR1c1tmaWxlUGF0Y2guc3RhdHVzXTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBzZWxlY3RlZCA/ICdpcy1zZWxlY3RlZCcgOiAnJztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj17dGhpcy5yZWZJdGVtLnNldHRlcn0gey4uLm90aGVyc30gY2xhc3NOYW1lPXtgZ2l0aHViLUZpbGVQYXRjaExpc3RWaWV3LWl0ZW0gaXMtJHtzdGF0dXN9ICR7Y2xhc3NOYW1lfWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItRmlsZVBhdGNoTGlzdFZpZXctaWNvbiBpY29uIGljb24tZGlmZi0ke3N0YXR1c30gc3RhdHVzLSR7c3RhdHVzfWB9IC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hMaXN0Vmlldy1wYXRoXCI+e2ZpbGVQYXRjaC5maWxlUGF0aH08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBNkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFOUIsTUFBTUEscUJBQXFCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBV2pFQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUVaLElBQUksQ0FBQ0MsT0FBTyxHQUFHLElBQUlDLGtCQUFTLEVBQUU7SUFDOUIsSUFBSSxDQUFDQyxJQUFJLEdBQUcsSUFBSUMsNkJBQW1CLENBQ2pDLElBQUksQ0FBQ0gsT0FBTyxDQUFDSSxPQUFPLENBQUNDLElBQUksSUFBSSxJQUFJLENBQUNOLEtBQUssQ0FBQ08sbUJBQW1CLENBQUMsSUFBSSxDQUFDUCxLQUFLLENBQUNRLFNBQVMsRUFBRUYsSUFBSSxDQUFDLENBQUMsQ0FDekY7RUFDSDtFQUVBRyxNQUFNLEdBQUc7SUFDUCxvQkFBeUMsSUFBSSxDQUFDVCxLQUFLO01BQTdDO1FBQUNRLFNBQVM7UUFBRUU7TUFBbUIsQ0FBQztNQUFQQyxNQUFNO0lBQ3JDLE9BQU9BLE1BQU0sQ0FBQ0osbUJBQW1CO0lBQ2pDLE1BQU1LLE1BQU0sR0FBR0MsMkJBQWtCLENBQUNMLFNBQVMsQ0FBQ0ksTUFBTSxDQUFDO0lBQ25ELE1BQU1FLFNBQVMsR0FBR0osUUFBUSxHQUFHLGFBQWEsR0FBRyxFQUFFO0lBRS9DLE9BQ0U7TUFBSyxHQUFHLEVBQUUsSUFBSSxDQUFDVCxPQUFPLENBQUNjO0lBQU8sR0FBS0osTUFBTTtNQUFFLFNBQVMsRUFBRyxvQ0FBbUNDLE1BQU8sSUFBR0UsU0FBVTtJQUFFLElBQzlHO01BQU0sU0FBUyxFQUFHLGdEQUErQ0YsTUFBTyxXQUFVQSxNQUFPO0lBQUUsRUFBRyxFQUM5RjtNQUFNLFNBQVMsRUFBQztJQUErQixHQUFFSixTQUFTLENBQUNRLFFBQVEsQ0FBUSxDQUN2RTtFQUVWO0VBRUFDLG9CQUFvQixHQUFHO0lBQ3JCLElBQUksQ0FBQ2QsSUFBSSxDQUFDZSxPQUFPLEVBQUU7RUFDckI7QUFDRjtBQUFDO0FBQUEsZ0JBckNvQnRCLHFCQUFxQixlQUNyQjtFQUNqQlksU0FBUyxFQUFFVyxpQ0FBcUIsQ0FBQ0MsVUFBVTtFQUMzQ1YsUUFBUSxFQUFFVyxrQkFBUyxDQUFDQyxJQUFJLENBQUNGLFVBQVU7RUFDbkNiLG1CQUFtQixFQUFFYyxrQkFBUyxDQUFDRTtBQUNqQyxDQUFDO0FBQUEsZ0JBTGtCM0IscUJBQXFCLGtCQU9sQjtFQUNwQlcsbUJBQW1CLEVBQUUsTUFBTSxDQUFDO0FBQzlCLENBQUMifQ==