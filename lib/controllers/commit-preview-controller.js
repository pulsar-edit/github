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
class CommitPreviewController extends _react.default.Component {
  render() {
    return _react.default.createElement(_multiFilePatchController.default, _extends({
      surface: this.props.surfaceToCommitPreviewButton
    }, this.props));
  }
}
exports.default = CommitPreviewController;
_defineProperty(CommitPreviewController, "propTypes", {
  repository: _propTypes.default.object.isRequired,
  stagingStatus: _propTypes.default.oneOf(['staged', 'unstaged']),
  workspace: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  destroy: _propTypes.default.func.isRequired,
  undoLastDiscard: _propTypes.default.func.isRequired,
  surfaceToCommitPreviewButton: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXRQcmV2aWV3Q29udHJvbGxlciIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicHJvcHMiLCJzdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9uIiwicmVwb3NpdG9yeSIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJzdGFnaW5nU3RhdHVzIiwib25lT2YiLCJ3b3Jrc3BhY2UiLCJjb21tYW5kcyIsImtleW1hcHMiLCJ0b29sdGlwcyIsImNvbmZpZyIsImRlc3Ryb3kiLCJmdW5jIiwidW5kb0xhc3REaXNjYXJkIl0sInNvdXJjZXMiOlsiY29tbWl0LXByZXZpZXctY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IE11bHRpRmlsZVBhdGNoQ29udHJvbGxlciBmcm9tICcuL211bHRpLWZpbGUtcGF0Y2gtY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1pdFByZXZpZXdDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3RhZ2luZ1N0YXR1czogUHJvcFR5cGVzLm9uZU9mKFsnc3RhZ2VkJywgJ3Vuc3RhZ2VkJ10pLFxuXG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBrZXltYXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIGRlc3Ryb3k6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5kb0xhc3REaXNjYXJkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHN1cmZhY2VUb0NvbW1pdFByZXZpZXdCdXR0b246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNdWx0aUZpbGVQYXRjaENvbnRyb2xsZXJcbiAgICAgICAgc3VyZmFjZT17dGhpcy5wcm9wcy5zdXJmYWNlVG9Db21taXRQcmV2aWV3QnV0dG9ufVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFBcUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV0RCxNQUFNQSx1QkFBdUIsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFnQm5FQyxNQUFNLEdBQUc7SUFDUCxPQUNFLDZCQUFDLGlDQUF3QjtNQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDQyxLQUFLLENBQUNDO0lBQTZCLEdBQzdDLElBQUksQ0FBQ0QsS0FBSyxFQUNkO0VBRU47QUFDRjtBQUFDO0FBQUEsZ0JBeEJvQkosdUJBQXVCLGVBQ3ZCO0VBQ2pCTSxVQUFVLEVBQUVDLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUN2Q0MsYUFBYSxFQUFFSCxrQkFBUyxDQUFDSSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFFdERDLFNBQVMsRUFBRUwsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3RDSSxRQUFRLEVBQUVOLGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUNyQ0ssT0FBTyxFQUFFUCxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDcENNLFFBQVEsRUFBRVIsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3JDTyxNQUFNLEVBQUVULGtCQUFTLENBQUNDLE1BQU0sQ0FBQ0MsVUFBVTtFQUVuQ1EsT0FBTyxFQUFFVixrQkFBUyxDQUFDVyxJQUFJLENBQUNULFVBQVU7RUFDbENVLGVBQWUsRUFBRVosa0JBQVMsQ0FBQ1csSUFBSSxDQUFDVCxVQUFVO0VBQzFDSiw0QkFBNEIsRUFBRUUsa0JBQVMsQ0FBQ1csSUFBSSxDQUFDVDtBQUMvQyxDQUFDIn0=