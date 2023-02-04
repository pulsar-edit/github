"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _multiFilePatchController = _interopRequireDefault(require("./multi-file-patch-controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ChangedFileController extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "surface", () => this.props.surfaceFileAtPath(this.props.relPath, this.props.stagingStatus));
  }
  render() {
    return _react.default.createElement(_multiFilePatchController.default, _extends({
      surface: this.surface
    }, this.props));
  }
}
exports.default = ChangedFileController;
_defineProperty(ChangedFileController, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  relPath: _propTypes.default.string.isRequired,
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  destroy: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceFileAtPath: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDaGFuZ2VkRmlsZUNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsInByb3BzIiwic3VyZmFjZUZpbGVBdFBhdGgiLCJyZWxQYXRoIiwic3RhZ2luZ1N0YXR1cyIsInJlbmRlciIsInN1cmZhY2UiLCJyZXBvc2l0b3J5IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIm9uZU9mIiwic3RyaW5nIiwid29ya3NwYWNlIiwiY29tbWFuZHMiLCJrZXltYXBzIiwidG9vbHRpcHMiLCJjb25maWciLCJkZXN0cm95IiwiZnVuYyIsInVuZG9MYXN0RGlzY2FyZCJdLCJzb3VyY2VzIjpbImNoYW5nZWQtZmlsZS1jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTXVsdGlGaWxlUGF0Y2hDb250cm9sbGVyIGZyb20gJy4vbXVsdGktZmlsZS1wYXRjaC1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbmdlZEZpbGVDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3RhZ2luZ1N0YXR1czogUHJvcFR5cGVzLm9uZU9mKFsnc3RhZ2VkJywgJ3Vuc3RhZ2VkJ10pLFxuICAgIHJlbFBhdGg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAga2V5bWFwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICBkZXN0cm95OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVuZG9MYXN0RGlzY2FyZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzdXJmYWNlRmlsZUF0UGF0aDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE11bHRpRmlsZVBhdGNoQ29udHJvbGxlclxuICAgICAgICBzdXJmYWNlPXt0aGlzLnN1cmZhY2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgc3VyZmFjZSA9ICgpID0+IHRoaXMucHJvcHMuc3VyZmFjZUZpbGVBdFBhdGgodGhpcy5wcm9wcy5yZWxQYXRoLCB0aGlzLnByb3BzLnN0YWdpbmdTdGF0dXMpXG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUFxRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXRELE1BQU1BLHFCQUFxQixTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQUFBO0lBQUE7SUFBQSxpQ0EwQnZELE1BQU0sSUFBSSxDQUFDQyxLQUFLLENBQUNDLGlCQUFpQixDQUFDLElBQUksQ0FBQ0QsS0FBSyxDQUFDRSxPQUFPLEVBQUUsSUFBSSxDQUFDRixLQUFLLENBQUNHLGFBQWEsQ0FBQztFQUFBO0VBVDFGQyxNQUFNLEdBQUc7SUFDUCxPQUNFLDZCQUFDLGlDQUF3QjtNQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDQztJQUFRLEdBQ2xCLElBQUksQ0FBQ0wsS0FBSyxFQUNkO0VBRU47QUFHRjtBQUFDO0FBQUEsZ0JBM0JvQkgscUJBQXFCLGVBQ3JCO0VBQ2pCUyxVQUFVLEVBQUVDLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUN2Q04sYUFBYSxFQUFFSSxrQkFBUyxDQUFDRyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDdERSLE9BQU8sRUFBRUssa0JBQVMsQ0FBQ0ksTUFBTSxDQUFDRixVQUFVO0VBRXBDRyxTQUFTLEVBQUVMLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUN0Q0ksUUFBUSxFQUFFTixrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDckNLLE9BQU8sRUFBRVAsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3BDTSxRQUFRLEVBQUVSLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUNyQ08sTUFBTSxFQUFFVCxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFFbkNRLE9BQU8sRUFBRVYsa0JBQVMsQ0FBQ1csSUFBSSxDQUFDVCxVQUFVO0VBQ2xDVSxlQUFlLEVBQUVaLGtCQUFTLENBQUNXLElBQUksQ0FBQ1QsVUFBVTtFQUMxQ1IsaUJBQWlCLEVBQUVNLGtCQUFTLENBQUNXLElBQUksQ0FBQ1Q7QUFDcEMsQ0FBQyJ9