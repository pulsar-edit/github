"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInQiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiciIsImUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJFcnJvckJvdW5kYXJ5IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJoYXNFcnJvciIsImVycm9yIiwiZXJyb3JJbmZvIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJzZXRTdGF0ZSIsInJlbmRlciIsImZhbGxiYWNrIiwiY2hpbGRyZW4iLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwibm9kZSIsImlzUmVxdWlyZWQiLCJhbnkiXSwic291cmNlcyI6WyJlcnJvci1ib3VuZGFyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JCb3VuZGFyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgZmFsbGJhY2s6IFByb3BUeXBlcy5hbnksXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtoYXNFcnJvcjogZmFsc2UsIGVycm9yOiBudWxsLCBlcnJvckluZm86IG51bGx9O1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnJvcikge1xuICAgIC8vIFVwZGF0ZSBzdGF0ZSBzbyB0aGUgbmV4dCByZW5kZXIgd2lsbCBzaG93IHRoZSBmYWxsYmFjayBVSS5cbiAgICByZXR1cm4ge2hhc0Vycm9yOiB0cnVlfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZENhdGNoKGVycm9yLCBlcnJvckluZm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yLFxuICAgICAgZXJyb3JJbmZvLFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yKSB7XG4gICAgICAvLyBZb3UgY2FuIHJlbmRlciBhbnkgY3VzdG9tIGZhbGxiYWNrIFVJXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5mYWxsYmFjayA/IHRoaXMucHJvcHMuZmFsbGJhY2sgOiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUFtQyxTQUFBRCx1QkFBQUcsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFHLGdCQUFBSCxHQUFBLEVBQUFJLEdBQUEsRUFBQUMsS0FBQSxJQUFBRCxHQUFBLEdBQUFFLGNBQUEsQ0FBQUYsR0FBQSxPQUFBQSxHQUFBLElBQUFKLEdBQUEsSUFBQU8sTUFBQSxDQUFBQyxjQUFBLENBQUFSLEdBQUEsRUFBQUksR0FBQSxJQUFBQyxLQUFBLEVBQUFBLEtBQUEsRUFBQUksVUFBQSxRQUFBQyxZQUFBLFFBQUFDLFFBQUEsb0JBQUFYLEdBQUEsQ0FBQUksR0FBQSxJQUFBQyxLQUFBLFdBQUFMLEdBQUE7QUFBQSxTQUFBTSxlQUFBTSxDQUFBLFFBQUFDLENBQUEsR0FBQUMsWUFBQSxDQUFBRixDQUFBLHVDQUFBQyxDQUFBLEdBQUFBLENBQUEsR0FBQUUsTUFBQSxDQUFBRixDQUFBO0FBQUEsU0FBQUMsYUFBQUYsQ0FBQSxFQUFBSSxDQUFBLDJCQUFBSixDQUFBLEtBQUFBLENBQUEsU0FBQUEsQ0FBQSxNQUFBSyxDQUFBLEdBQUFMLENBQUEsQ0FBQU0sTUFBQSxDQUFBQyxXQUFBLGtCQUFBRixDQUFBLFFBQUFKLENBQUEsR0FBQUksQ0FBQSxDQUFBRyxJQUFBLENBQUFSLENBQUEsRUFBQUksQ0FBQSx1Q0FBQUgsQ0FBQSxTQUFBQSxDQUFBLFlBQUFRLFNBQUEseUVBQUFMLENBQUEsR0FBQUQsTUFBQSxHQUFBTyxNQUFBLEVBQUFWLENBQUE7QUFFcEIsTUFBTVcsYUFBYSxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQU16REMsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQ1osSUFBSSxDQUFDQyxLQUFLLEdBQUc7TUFBQ0MsUUFBUSxFQUFFLEtBQUs7TUFBRUMsS0FBSyxFQUFFLElBQUk7TUFBRUMsU0FBUyxFQUFFO0lBQUksQ0FBQztFQUM5RDtFQUVBLE9BQU9DLHdCQUF3QkEsQ0FBQ0YsS0FBSyxFQUFFO0lBQ3JDO0lBQ0EsT0FBTztNQUFDRCxRQUFRLEVBQUU7SUFBSSxDQUFDO0VBQ3pCO0VBRUFJLGlCQUFpQkEsQ0FBQ0gsS0FBSyxFQUFFQyxTQUFTLEVBQUU7SUFDbEMsSUFBSSxDQUFDRyxRQUFRLENBQUM7TUFDWkosS0FBSztNQUNMQztJQUNGLENBQUMsQ0FBQztFQUNKO0VBRUFJLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUksSUFBSSxDQUFDUCxLQUFLLENBQUNDLFFBQVEsRUFBRTtNQUN2QjtNQUNBLE9BQU8sSUFBSSxDQUFDRixLQUFLLENBQUNTLFFBQVEsR0FBRyxJQUFJLENBQUNULEtBQUssQ0FBQ1MsUUFBUSxHQUFHLElBQUk7SUFDekQ7SUFFQSxPQUFPLElBQUksQ0FBQ1QsS0FBSyxDQUFDVSxRQUFRO0VBQzVCO0FBQ0Y7QUFBQ0MsT0FBQSxDQUFBcEMsT0FBQSxHQUFBcUIsYUFBQTtBQUFBcEIsZUFBQSxDQS9Cb0JvQixhQUFhLGVBQ2I7RUFDakJjLFFBQVEsRUFBRUUsa0JBQVMsQ0FBQ0MsSUFBSSxDQUFDQyxVQUFVO0VBQ25DTCxRQUFRLEVBQUVHLGtCQUFTLENBQUNHO0FBQ3RCLENBQUMifQ==