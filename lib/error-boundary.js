"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ErrorBoundary extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true
    };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback ? this.props.fallback : null;
    }
    return this.props.children;
  }
}
exports.default = ErrorBoundary;
_defineProperty(ErrorBoundary, "propTypes", {
  children: _propTypes.default.node.isRequired,
  fallback: _propTypes.default.any
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFcnJvckJvdW5kYXJ5IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJoYXNFcnJvciIsImVycm9yIiwiZXJyb3JJbmZvIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJzZXRTdGF0ZSIsInJlbmRlciIsImZhbGxiYWNrIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJub2RlIiwiaXNSZXF1aXJlZCIsImFueSJdLCJzb3VyY2VzIjpbImVycm9yLWJvdW5kYXJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvckJvdW5kYXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcbiAgICBmYWxsYmFjazogUHJvcFR5cGVzLmFueSxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge2hhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwsIGVycm9ySW5mbzogbnVsbH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKGVycm9yKSB7XG4gICAgLy8gVXBkYXRlIHN0YXRlIHNvIHRoZSBuZXh0IHJlbmRlciB3aWxsIHNob3cgdGhlIGZhbGxiYWNrIFVJLlxuICAgIHJldHVybiB7aGFzRXJyb3I6IHRydWV9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkQ2F0Y2goZXJyb3IsIGVycm9ySW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3IsXG4gICAgICBlcnJvckluZm8sXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzRXJyb3IpIHtcbiAgICAgIC8vIFlvdSBjYW4gcmVuZGVyIGFueSBjdXN0b20gZmFsbGJhY2sgVUlcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmZhbGxiYWNrID8gdGhpcy5wcm9wcy5mYWxsYmFjayA6IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUFtQztBQUFBO0FBQUE7QUFBQTtBQUVwQixNQUFNQSxhQUFhLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBTXpEQyxXQUFXLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUksQ0FBQ0MsS0FBSyxHQUFHO01BQUNDLFFBQVEsRUFBRSxLQUFLO01BQUVDLEtBQUssRUFBRSxJQUFJO01BQUVDLFNBQVMsRUFBRTtJQUFJLENBQUM7RUFDOUQ7RUFFQSxPQUFPQyx3QkFBd0IsQ0FBQ0YsS0FBSyxFQUFFO0lBQ3JDO0lBQ0EsT0FBTztNQUFDRCxRQUFRLEVBQUU7SUFBSSxDQUFDO0VBQ3pCO0VBRUFJLGlCQUFpQixDQUFDSCxLQUFLLEVBQUVDLFNBQVMsRUFBRTtJQUNsQyxJQUFJLENBQUNHLFFBQVEsQ0FBQztNQUNaSixLQUFLO01BQ0xDO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFFQUksTUFBTSxHQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUNQLEtBQUssQ0FBQ0MsUUFBUSxFQUFFO01BQ3ZCO01BQ0EsT0FBTyxJQUFJLENBQUNGLEtBQUssQ0FBQ1MsUUFBUSxHQUFHLElBQUksQ0FBQ1QsS0FBSyxDQUFDUyxRQUFRLEdBQUcsSUFBSTtJQUN6RDtJQUVBLE9BQU8sSUFBSSxDQUFDVCxLQUFLLENBQUNVLFFBQVE7RUFDNUI7QUFDRjtBQUFDO0FBQUEsZ0JBL0JvQmQsYUFBYSxlQUNiO0VBQ2pCYyxRQUFRLEVBQUVDLGtCQUFTLENBQUNDLElBQUksQ0FBQ0MsVUFBVTtFQUNuQ0osUUFBUSxFQUFFRSxrQkFBUyxDQUFDRztBQUN0QixDQUFDIn0=