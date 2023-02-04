"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactionPickerView = _interopRequireDefault(require("../views/reaction-picker-view"));
var _propTypes2 = require("../prop-types");
var _reporterProxy = require("../reporter-proxy");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ReactionPickerController extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "addReactionAndClose", async content => {
      await this.props.addReaction(content);
      (0, _reporterProxy.addEvent)('add-emoji-reaction', {
        package: 'github'
      });
      this.props.tooltipHolder.map(tooltip => tooltip.dispose());
    });
    _defineProperty(this, "removeReactionAndClose", async content => {
      await this.props.removeReaction(content);
      (0, _reporterProxy.addEvent)('remove-emoji-reaction', {
        package: 'github'
      });
      this.props.tooltipHolder.map(tooltip => tooltip.dispose());
    });
  }
  render() {
    return _react.default.createElement(_reactionPickerView.default, _extends({
      addReactionAndClose: this.addReactionAndClose,
      removeReactionAndClose: this.removeReactionAndClose
    }, this.props));
  }
}
exports.default = ReactionPickerController;
_defineProperty(ReactionPickerController, "propTypes", {
  addReaction: _propTypes.default.func.isRequired,
  removeReaction: _propTypes.default.func.isRequired,
  tooltipHolder: _propTypes2.RefHolderPropType.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdGlvblBpY2tlckNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnRlbnQiLCJwcm9wcyIsImFkZFJlYWN0aW9uIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwidG9vbHRpcEhvbGRlciIsIm1hcCIsInRvb2x0aXAiLCJkaXNwb3NlIiwicmVtb3ZlUmVhY3Rpb24iLCJyZW5kZXIiLCJhZGRSZWFjdGlvbkFuZENsb3NlIiwicmVtb3ZlUmVhY3Rpb25BbmRDbG9zZSIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwic291cmNlcyI6WyJyZWFjdGlvbi1waWNrZXItY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IFJlYWN0aW9uUGlja2VyVmlldyBmcm9tICcuLi92aWV3cy9yZWFjdGlvbi1waWNrZXItdmlldyc7XG5pbXBvcnQge1JlZkhvbGRlclByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhY3Rpb25QaWNrZXJDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBhZGRSZWFjdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZW1vdmVSZWFjdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIHRvb2x0aXBIb2xkZXI6IFJlZkhvbGRlclByb3BUeXBlLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWFjdGlvblBpY2tlclZpZXdcbiAgICAgICAgYWRkUmVhY3Rpb25BbmRDbG9zZT17dGhpcy5hZGRSZWFjdGlvbkFuZENsb3NlfVxuICAgICAgICByZW1vdmVSZWFjdGlvbkFuZENsb3NlPXt0aGlzLnJlbW92ZVJlYWN0aW9uQW5kQ2xvc2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgYWRkUmVhY3Rpb25BbmRDbG9zZSA9IGFzeW5jIGNvbnRlbnQgPT4ge1xuICAgIGF3YWl0IHRoaXMucHJvcHMuYWRkUmVhY3Rpb24oY29udGVudCk7XG4gICAgYWRkRXZlbnQoJ2FkZC1lbW9qaS1yZWFjdGlvbicsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIHRoaXMucHJvcHMudG9vbHRpcEhvbGRlci5tYXAodG9vbHRpcCA9PiB0b29sdGlwLmRpc3Bvc2UoKSk7XG4gIH1cblxuICByZW1vdmVSZWFjdGlvbkFuZENsb3NlID0gYXN5bmMgY29udGVudCA9PiB7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5yZW1vdmVSZWFjdGlvbihjb250ZW50KTtcbiAgICBhZGRFdmVudCgncmVtb3ZlLWVtb2ppLXJlYWN0aW9uJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgdGhpcy5wcm9wcy50b29sdGlwSG9sZGVyLm1hcCh0b29sdGlwID0+IHRvb2x0aXAuZGlzcG9zZSgpKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQTJDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFNUIsTUFBTUEsd0JBQXdCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBQUE7SUFBQTtJQUFBLDZDQWtCOUMsTUFBTUMsT0FBTyxJQUFJO01BQ3JDLE1BQU0sSUFBSSxDQUFDQyxLQUFLLENBQUNDLFdBQVcsQ0FBQ0YsT0FBTyxDQUFDO01BQ3JDLElBQUFHLHVCQUFRLEVBQUMsb0JBQW9CLEVBQUU7UUFBQ0MsT0FBTyxFQUFFO01BQVEsQ0FBQyxDQUFDO01BQ25ELElBQUksQ0FBQ0gsS0FBSyxDQUFDSSxhQUFhLENBQUNDLEdBQUcsQ0FBQ0MsT0FBTyxJQUFJQSxPQUFPLENBQUNDLE9BQU8sRUFBRSxDQUFDO0lBQzVELENBQUM7SUFBQSxnREFFd0IsTUFBTVIsT0FBTyxJQUFJO01BQ3hDLE1BQU0sSUFBSSxDQUFDQyxLQUFLLENBQUNRLGNBQWMsQ0FBQ1QsT0FBTyxDQUFDO01BQ3hDLElBQUFHLHVCQUFRLEVBQUMsdUJBQXVCLEVBQUU7UUFBQ0MsT0FBTyxFQUFFO01BQVEsQ0FBQyxDQUFDO01BQ3RELElBQUksQ0FBQ0gsS0FBSyxDQUFDSSxhQUFhLENBQUNDLEdBQUcsQ0FBQ0MsT0FBTyxJQUFJQSxPQUFPLENBQUNDLE9BQU8sRUFBRSxDQUFDO0lBQzVELENBQUM7RUFBQTtFQXBCREUsTUFBTSxHQUFHO0lBQ1AsT0FDRSw2QkFBQywyQkFBa0I7TUFDakIsbUJBQW1CLEVBQUUsSUFBSSxDQUFDQyxtQkFBb0I7TUFDOUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDQztJQUF1QixHQUNoRCxJQUFJLENBQUNYLEtBQUssRUFDZDtFQUVOO0FBYUY7QUFBQztBQUFBLGdCQTdCb0JKLHdCQUF3QixlQUN4QjtFQUNqQkssV0FBVyxFQUFFVyxrQkFBUyxDQUFDQyxJQUFJLENBQUNDLFVBQVU7RUFDdENOLGNBQWMsRUFBRUksa0JBQVMsQ0FBQ0MsSUFBSSxDQUFDQyxVQUFVO0VBRXpDVixhQUFhLEVBQUVXLDZCQUFpQixDQUFDRDtBQUNuQyxDQUFDIn0=