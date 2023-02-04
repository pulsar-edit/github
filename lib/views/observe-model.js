"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _modelObserver = _interopRequireDefault(require("../models/model-observer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ObserveModel extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "fetchData", model => this.props.fetchData(model, ...this.props.fetchParams));
    _defineProperty(this, "didUpdate", () => {
      if (this.mounted) {
        const data = this.modelObserver.getActiveModelData();
        this.setState({
          data
        });
      }
    });
    this.state = {
      data: null
    };
    this.modelObserver = new _modelObserver.default({
      fetchData: this.fetchData,
      didUpdate: this.didUpdate
    });
  }
  componentDidMount() {
    this.mounted = true;
    this.modelObserver.setActiveModel(this.props.model);
  }
  componentDidUpdate(prevProps) {
    this.modelObserver.setActiveModel(this.props.model);
    if (!this.modelObserver.hasPendingUpdate() && prevProps.fetchParams.length !== this.props.fetchParams.length || prevProps.fetchParams.some((prevParam, i) => prevParam !== this.props.fetchParams[i])) {
      this.modelObserver.refreshModelData();
    }
  }
  render() {
    return this.props.children(this.state.data);
  }
  componentWillUnmount() {
    this.mounted = false;
    this.modelObserver.destroy();
  }
}
exports.default = ObserveModel;
_defineProperty(ObserveModel, "propTypes", {
  model: _propTypes.default.shape({
    onDidUpdate: _propTypes.default.func.isRequired
  }),
  fetchData: _propTypes.default.func.isRequired,
  fetchParams: _propTypes.default.arrayOf(_propTypes.default.any),
  children: _propTypes.default.func.isRequired
});
_defineProperty(ObserveModel, "defaultProps", {
  fetchParams: []
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJPYnNlcnZlTW9kZWwiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwibW9kZWwiLCJmZXRjaERhdGEiLCJmZXRjaFBhcmFtcyIsIm1vdW50ZWQiLCJkYXRhIiwibW9kZWxPYnNlcnZlciIsImdldEFjdGl2ZU1vZGVsRGF0YSIsInNldFN0YXRlIiwic3RhdGUiLCJNb2RlbE9ic2VydmVyIiwiZGlkVXBkYXRlIiwiY29tcG9uZW50RGlkTW91bnQiLCJzZXRBY3RpdmVNb2RlbCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImhhc1BlbmRpbmdVcGRhdGUiLCJsZW5ndGgiLCJzb21lIiwicHJldlBhcmFtIiwiaSIsInJlZnJlc2hNb2RlbERhdGEiLCJyZW5kZXIiLCJjaGlsZHJlbiIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGVzdHJveSIsIlByb3BUeXBlcyIsInNoYXBlIiwib25EaWRVcGRhdGUiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiXSwic291cmNlcyI6WyJvYnNlcnZlLW1vZGVsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgTW9kZWxPYnNlcnZlciBmcm9tICcuLi9tb2RlbHMvbW9kZWwtb2JzZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYnNlcnZlTW9kZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1vZGVsOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgb25EaWRVcGRhdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgZmV0Y2hEYXRhOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGZldGNoUGFyYW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZmV0Y2hQYXJhbXM6IFtdLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge2RhdGE6IG51bGx9O1xuICAgIHRoaXMubW9kZWxPYnNlcnZlciA9IG5ldyBNb2RlbE9ic2VydmVyKHtmZXRjaERhdGE6IHRoaXMuZmV0Y2hEYXRhLCBkaWRVcGRhdGU6IHRoaXMuZGlkVXBkYXRlfSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLm1vdW50ZWQgPSB0cnVlO1xuICAgIHRoaXMubW9kZWxPYnNlcnZlci5zZXRBY3RpdmVNb2RlbCh0aGlzLnByb3BzLm1vZGVsKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICB0aGlzLm1vZGVsT2JzZXJ2ZXIuc2V0QWN0aXZlTW9kZWwodGhpcy5wcm9wcy5tb2RlbCk7XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5tb2RlbE9ic2VydmVyLmhhc1BlbmRpbmdVcGRhdGUoKSAmJlxuICAgICAgcHJldlByb3BzLmZldGNoUGFyYW1zLmxlbmd0aCAhPT0gdGhpcy5wcm9wcy5mZXRjaFBhcmFtcy5sZW5ndGggfHxcbiAgICAgIHByZXZQcm9wcy5mZXRjaFBhcmFtcy5zb21lKChwcmV2UGFyYW0sIGkpID0+IHByZXZQYXJhbSAhPT0gdGhpcy5wcm9wcy5mZXRjaFBhcmFtc1tpXSlcbiAgICApIHtcbiAgICAgIHRoaXMubW9kZWxPYnNlcnZlci5yZWZyZXNoTW9kZWxEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgZmV0Y2hEYXRhID0gbW9kZWwgPT4gdGhpcy5wcm9wcy5mZXRjaERhdGEobW9kZWwsIC4uLnRoaXMucHJvcHMuZmV0Y2hQYXJhbXMpO1xuXG4gIGRpZFVwZGF0ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5tb3VudGVkKSB7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5tb2RlbE9ic2VydmVyLmdldEFjdGl2ZU1vZGVsRGF0YSgpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YX0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmRhdGEpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XG4gICAgdGhpcy5tb2RlbE9ic2VydmVyLmRlc3Ryb3koKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFBcUQ7QUFBQTtBQUFBO0FBQUE7QUFFdEMsTUFBTUEsWUFBWSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQWN4REMsV0FBVyxDQUFDQyxLQUFLLEVBQUVDLE9BQU8sRUFBRTtJQUMxQixLQUFLLENBQUNELEtBQUssRUFBRUMsT0FBTyxDQUFDO0lBQUMsbUNBdUJaQyxLQUFLLElBQUksSUFBSSxDQUFDRixLQUFLLENBQUNHLFNBQVMsQ0FBQ0QsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDRixLQUFLLENBQUNJLFdBQVcsQ0FBQztJQUFBLG1DQUUvRCxNQUFNO01BQ2hCLElBQUksSUFBSSxDQUFDQyxPQUFPLEVBQUU7UUFDaEIsTUFBTUMsSUFBSSxHQUFHLElBQUksQ0FBQ0MsYUFBYSxDQUFDQyxrQkFBa0IsRUFBRTtRQUNwRCxJQUFJLENBQUNDLFFBQVEsQ0FBQztVQUFDSDtRQUFJLENBQUMsQ0FBQztNQUN2QjtJQUNGLENBQUM7SUE1QkMsSUFBSSxDQUFDSSxLQUFLLEdBQUc7TUFBQ0osSUFBSSxFQUFFO0lBQUksQ0FBQztJQUN6QixJQUFJLENBQUNDLGFBQWEsR0FBRyxJQUFJSSxzQkFBYSxDQUFDO01BQUNSLFNBQVMsRUFBRSxJQUFJLENBQUNBLFNBQVM7TUFBRVMsU0FBUyxFQUFFLElBQUksQ0FBQ0E7SUFBUyxDQUFDLENBQUM7RUFDaEc7RUFFQUMsaUJBQWlCLEdBQUc7SUFDbEIsSUFBSSxDQUFDUixPQUFPLEdBQUcsSUFBSTtJQUNuQixJQUFJLENBQUNFLGFBQWEsQ0FBQ08sY0FBYyxDQUFDLElBQUksQ0FBQ2QsS0FBSyxDQUFDRSxLQUFLLENBQUM7RUFDckQ7RUFFQWEsa0JBQWtCLENBQUNDLFNBQVMsRUFBRTtJQUM1QixJQUFJLENBQUNULGFBQWEsQ0FBQ08sY0FBYyxDQUFDLElBQUksQ0FBQ2QsS0FBSyxDQUFDRSxLQUFLLENBQUM7SUFFbkQsSUFDRSxDQUFDLElBQUksQ0FBQ0ssYUFBYSxDQUFDVSxnQkFBZ0IsRUFBRSxJQUN0Q0QsU0FBUyxDQUFDWixXQUFXLENBQUNjLE1BQU0sS0FBSyxJQUFJLENBQUNsQixLQUFLLENBQUNJLFdBQVcsQ0FBQ2MsTUFBTSxJQUM5REYsU0FBUyxDQUFDWixXQUFXLENBQUNlLElBQUksQ0FBQyxDQUFDQyxTQUFTLEVBQUVDLENBQUMsS0FBS0QsU0FBUyxLQUFLLElBQUksQ0FBQ3BCLEtBQUssQ0FBQ0ksV0FBVyxDQUFDaUIsQ0FBQyxDQUFDLENBQUMsRUFDckY7TUFDQSxJQUFJLENBQUNkLGFBQWEsQ0FBQ2UsZ0JBQWdCLEVBQUU7SUFDdkM7RUFDRjtFQVdBQyxNQUFNLEdBQUc7SUFDUCxPQUFPLElBQUksQ0FBQ3ZCLEtBQUssQ0FBQ3dCLFFBQVEsQ0FBQyxJQUFJLENBQUNkLEtBQUssQ0FBQ0osSUFBSSxDQUFDO0VBQzdDO0VBRUFtQixvQkFBb0IsR0FBRztJQUNyQixJQUFJLENBQUNwQixPQUFPLEdBQUcsS0FBSztJQUNwQixJQUFJLENBQUNFLGFBQWEsQ0FBQ21CLE9BQU8sRUFBRTtFQUM5QjtBQUNGO0FBQUM7QUFBQSxnQkF2RG9COUIsWUFBWSxlQUNaO0VBQ2pCTSxLQUFLLEVBQUV5QixrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDckJDLFdBQVcsRUFBRUYsa0JBQVMsQ0FBQ0csSUFBSSxDQUFDQztFQUM5QixDQUFDLENBQUM7RUFDRjVCLFNBQVMsRUFBRXdCLGtCQUFTLENBQUNHLElBQUksQ0FBQ0MsVUFBVTtFQUNwQzNCLFdBQVcsRUFBRXVCLGtCQUFTLENBQUNLLE9BQU8sQ0FBQ0wsa0JBQVMsQ0FBQ00sR0FBRyxDQUFDO0VBQzdDVCxRQUFRLEVBQUVHLGtCQUFTLENBQUNHLElBQUksQ0FBQ0M7QUFDM0IsQ0FBQztBQUFBLGdCQVJrQm5DLFlBQVksa0JBVVQ7RUFDcEJRLFdBQVcsRUFBRTtBQUNmLENBQUMifQ==