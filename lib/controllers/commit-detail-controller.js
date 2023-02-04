"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _commitDetailView = _interopRequireDefault(require("../views/commit-detail-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CommitDetailController extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "toggleMessage", () => {
      return new Promise(resolve => {
        this.setState(prevState => ({
          messageOpen: !prevState.messageOpen
        }), resolve);
      });
    });
    this.state = {
      messageCollapsible: this.props.commit.isBodyLong(),
      messageOpen: !this.props.commit.isBodyLong()
    };
  }
  render() {
    return _react.default.createElement(_commitDetailView.default, _extends({
      messageCollapsible: this.state.messageCollapsible,
      messageOpen: this.state.messageOpen,
      toggleMessage: this.toggleMessage
    }, this.props));
  }
}
exports.default = CommitDetailController;
_defineProperty(CommitDetailController, "propTypes", _objectSpread({}, _commitDetailView.default.drilledPropTypes, {
  commit: _propTypes.default.object.isRequired
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb21taXREZXRhaWxDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRTdGF0ZSIsInByZXZTdGF0ZSIsIm1lc3NhZ2VPcGVuIiwic3RhdGUiLCJtZXNzYWdlQ29sbGFwc2libGUiLCJjb21taXQiLCJpc0JvZHlMb25nIiwicmVuZGVyIiwidG9nZ2xlTWVzc2FnZSIsIkNvbW1pdERldGFpbFZpZXciLCJkcmlsbGVkUHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbImNvbW1pdC1kZXRhaWwtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IENvbW1pdERldGFpbFZpZXcgZnJvbSAnLi4vdmlld3MvY29tbWl0LWRldGFpbC12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWl0RGV0YWlsQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLi4uQ29tbWl0RGV0YWlsVmlldy5kcmlsbGVkUHJvcFR5cGVzLFxuXG4gICAgY29tbWl0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZXNzYWdlQ29sbGFwc2libGU6IHRoaXMucHJvcHMuY29tbWl0LmlzQm9keUxvbmcoKSxcbiAgICAgIG1lc3NhZ2VPcGVuOiAhdGhpcy5wcm9wcy5jb21taXQuaXNCb2R5TG9uZygpLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb21taXREZXRhaWxWaWV3XG4gICAgICAgIG1lc3NhZ2VDb2xsYXBzaWJsZT17dGhpcy5zdGF0ZS5tZXNzYWdlQ29sbGFwc2libGV9XG4gICAgICAgIG1lc3NhZ2VPcGVuPXt0aGlzLnN0YXRlLm1lc3NhZ2VPcGVufVxuICAgICAgICB0b2dnbGVNZXNzYWdlPXt0aGlzLnRvZ2dsZU1lc3NhZ2V9XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgdG9nZ2xlTWVzc2FnZSA9ICgpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe21lc3NhZ2VPcGVuOiAhcHJldlN0YXRlLm1lc3NhZ2VPcGVufSksIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUEyRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUU1QyxNQUFNQSxzQkFBc0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFPbEVDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsdUNBbUJDLE1BQU07TUFDcEIsT0FBTyxJQUFJQyxPQUFPLENBQUNDLE9BQU8sSUFBSTtRQUM1QixJQUFJLENBQUNDLFFBQVEsQ0FBQ0MsU0FBUyxLQUFLO1VBQUNDLFdBQVcsRUFBRSxDQUFDRCxTQUFTLENBQUNDO1FBQVcsQ0FBQyxDQUFDLEVBQUVILE9BQU8sQ0FBQztNQUM5RSxDQUFDLENBQUM7SUFDSixDQUFDO0lBckJDLElBQUksQ0FBQ0ksS0FBSyxHQUFHO01BQ1hDLGtCQUFrQixFQUFFLElBQUksQ0FBQ1AsS0FBSyxDQUFDUSxNQUFNLENBQUNDLFVBQVUsRUFBRTtNQUNsREosV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDTCxLQUFLLENBQUNRLE1BQU0sQ0FBQ0MsVUFBVTtJQUM1QyxDQUFDO0VBQ0g7RUFFQUMsTUFBTSxHQUFHO0lBQ1AsT0FDRSw2QkFBQyx5QkFBZ0I7TUFDZixrQkFBa0IsRUFBRSxJQUFJLENBQUNKLEtBQUssQ0FBQ0Msa0JBQW1CO01BQ2xELFdBQVcsRUFBRSxJQUFJLENBQUNELEtBQUssQ0FBQ0QsV0FBWTtNQUNwQyxhQUFhLEVBQUUsSUFBSSxDQUFDTTtJQUFjLEdBQzlCLElBQUksQ0FBQ1gsS0FBSyxFQUNkO0VBRU47QUFPRjtBQUFDO0FBQUEsZ0JBaENvQkosc0JBQXNCLGlDQUVwQ2dCLHlCQUFnQixDQUFDQyxnQkFBZ0I7RUFFcENMLE1BQU0sRUFBRU0sa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQztBQUFVIn0=