"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class SimpleTooltip extends _react.default.Component {
  componentDidMount() {
    this.disposable = this.props.tooltips.add(_reactDom.default.findDOMNode(this.child), {
      title: () => this.props.title
    });
  }
  componentWillUnmount() {
    this.disposable.dispose();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.disposable.dispose();
      this.disposable = this.props.tooltips.add(_reactDom.default.findDOMNode(this.child), {
        title: () => this.props.title
      });
    }
  }
  render() {
    const child = _react.default.Children.only(this.props.children);
    return _react.default.cloneElement(child, {
      ref: e => {
        this.child = e;
      }
    });
  }
}
exports.default = SimpleTooltip;
_defineProperty(SimpleTooltip, "propTypes", {
  tooltips: _propTypes.default.object.isRequired,
  children: _propTypes.default.node.isRequired,
  title: _propTypes.default.string.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTaW1wbGVUb29sdGlwIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb21wb25lbnREaWRNb3VudCIsImRpc3Bvc2FibGUiLCJwcm9wcyIsInRvb2x0aXBzIiwiYWRkIiwiUmVhY3RET00iLCJmaW5kRE9NTm9kZSIsImNoaWxkIiwidGl0bGUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJyZW5kZXIiLCJDaGlsZHJlbiIsIm9ubHkiLCJjaGlsZHJlbiIsImNsb25lRWxlbWVudCIsInJlZiIsImUiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwibm9kZSIsInN0cmluZyJdLCJzb3VyY2VzIjpbInNpbXBsZS10b29sdGlwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZVRvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZSA9IHRoaXMucHJvcHMudG9vbHRpcHMuYWRkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMuY2hpbGQpLCB7dGl0bGU6ICgpID0+IHRoaXMucHJvcHMudGl0bGV9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgaWYgKHByZXZQcm9wcy50aXRsZSAhPT0gdGhpcy5wcm9wcy50aXRsZSkge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZSA9IHRoaXMucHJvcHMudG9vbHRpcHMuYWRkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMuY2hpbGQpLCB7dGl0bGU6ICgpID0+IHRoaXMucHJvcHMudGl0bGV9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY2hpbGQgPSBSZWFjdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHtyZWY6IGUgPT4geyB0aGlzLmNoaWxkID0gZTsgfX0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUVwQixNQUFNQSxhQUFhLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBT3pEQyxpQkFBaUIsR0FBRztJQUNsQixJQUFJLENBQUNDLFVBQVUsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsUUFBUSxDQUFDQyxHQUFHLENBQUNDLGlCQUFRLENBQUNDLFdBQVcsQ0FBQyxJQUFJLENBQUNDLEtBQUssQ0FBQyxFQUFFO01BQUNDLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQ04sS0FBSyxDQUFDTTtJQUFLLENBQUMsQ0FBQztFQUM5RztFQUVBQyxvQkFBb0IsR0FBRztJQUNyQixJQUFJLENBQUNSLFVBQVUsQ0FBQ1MsT0FBTyxFQUFFO0VBQzNCO0VBRUFDLGtCQUFrQixDQUFDQyxTQUFTLEVBQUU7SUFDNUIsSUFBSUEsU0FBUyxDQUFDSixLQUFLLEtBQUssSUFBSSxDQUFDTixLQUFLLENBQUNNLEtBQUssRUFBRTtNQUN4QyxJQUFJLENBQUNQLFVBQVUsQ0FBQ1MsT0FBTyxFQUFFO01BQ3pCLElBQUksQ0FBQ1QsVUFBVSxHQUFHLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxRQUFRLENBQUNDLEdBQUcsQ0FBQ0MsaUJBQVEsQ0FBQ0MsV0FBVyxDQUFDLElBQUksQ0FBQ0MsS0FBSyxDQUFDLEVBQUU7UUFBQ0MsS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDTixLQUFLLENBQUNNO01BQUssQ0FBQyxDQUFDO0lBQzlHO0VBQ0Y7RUFFQUssTUFBTSxHQUFHO0lBQ1AsTUFBTU4sS0FBSyxHQUFHVCxjQUFLLENBQUNnQixRQUFRLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUNiLEtBQUssQ0FBQ2MsUUFBUSxDQUFDO0lBQ3RELE9BQU9sQixjQUFLLENBQUNtQixZQUFZLENBQUNWLEtBQUssRUFBRTtNQUFDVyxHQUFHLEVBQUVDLENBQUMsSUFBSTtRQUFFLElBQUksQ0FBQ1osS0FBSyxHQUFHWSxDQUFDO01BQUU7SUFBQyxDQUFDLENBQUM7RUFDbkU7QUFDRjtBQUFDO0FBQUEsZ0JBMUJvQnRCLGFBQWEsZUFDYjtFQUNqQk0sUUFBUSxFQUFFaUIsa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVO0VBQ3JDTixRQUFRLEVBQUVJLGtCQUFTLENBQUNHLElBQUksQ0FBQ0QsVUFBVTtFQUNuQ2QsS0FBSyxFQUFFWSxrQkFBUyxDQUFDSSxNQUFNLENBQUNGO0FBQzFCLENBQUMifQ==