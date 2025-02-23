"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZGVmaW5lUHJvcGVydHkiLCJyIiwidCIsIl90b1Byb3BlcnR5S2V5IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImkiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJTdHJpbmciLCJOdW1iZXIiLCJFcnJvckJvdW5kYXJ5IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJoYXNFcnJvciIsImVycm9yIiwiZXJyb3JJbmZvIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJzZXRTdGF0ZSIsInJlbmRlciIsImZhbGxiYWNrIiwiY2hpbGRyZW4iLCJleHBvcnRzIiwiUHJvcFR5cGVzIiwibm9kZSIsImlzUmVxdWlyZWQiLCJhbnkiXSwic291cmNlcyI6WyJlcnJvci1ib3VuZGFyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JCb3VuZGFyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG4gICAgZmFsbGJhY2s6IFByb3BUeXBlcy5hbnksXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtoYXNFcnJvcjogZmFsc2UsIGVycm9yOiBudWxsLCBlcnJvckluZm86IG51bGx9O1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihlcnJvcikge1xuICAgIC8vIFVwZGF0ZSBzdGF0ZSBzbyB0aGUgbmV4dCByZW5kZXIgd2lsbCBzaG93IHRoZSBmYWxsYmFjayBVSS5cbiAgICByZXR1cm4ge2hhc0Vycm9yOiB0cnVlfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZENhdGNoKGVycm9yLCBlcnJvckluZm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yLFxuICAgICAgZXJyb3JJbmZvLFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yKSB7XG4gICAgICAvLyBZb3UgY2FuIHJlbmRlciBhbnkgY3VzdG9tIGZhbGxiYWNrIFVJXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5mYWxsYmFjayA/IHRoaXMucHJvcHMuZmFsbGJhY2sgOiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUFtQyxTQUFBRCx1QkFBQUcsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLEtBQUFFLE9BQUEsRUFBQUYsQ0FBQTtBQUFBLFNBQUFHLGdCQUFBSCxDQUFBLEVBQUFJLENBQUEsRUFBQUMsQ0FBQSxZQUFBRCxDQUFBLEdBQUFFLGNBQUEsQ0FBQUYsQ0FBQSxNQUFBSixDQUFBLEdBQUFPLE1BQUEsQ0FBQUMsY0FBQSxDQUFBUixDQUFBLEVBQUFJLENBQUEsSUFBQUssS0FBQSxFQUFBSixDQUFBLEVBQUFLLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFVBQUFaLENBQUEsQ0FBQUksQ0FBQSxJQUFBQyxDQUFBLEVBQUFMLENBQUE7QUFBQSxTQUFBTSxlQUFBRCxDQUFBLFFBQUFRLENBQUEsR0FBQUMsWUFBQSxDQUFBVCxDQUFBLHVDQUFBUSxDQUFBLEdBQUFBLENBQUEsR0FBQUEsQ0FBQTtBQUFBLFNBQUFDLGFBQUFULENBQUEsRUFBQUQsQ0FBQSwyQkFBQUMsQ0FBQSxLQUFBQSxDQUFBLFNBQUFBLENBQUEsTUFBQUwsQ0FBQSxHQUFBSyxDQUFBLENBQUFVLE1BQUEsQ0FBQUMsV0FBQSxrQkFBQWhCLENBQUEsUUFBQWEsQ0FBQSxHQUFBYixDQUFBLENBQUFpQixJQUFBLENBQUFaLENBQUEsRUFBQUQsQ0FBQSx1Q0FBQVMsQ0FBQSxTQUFBQSxDQUFBLFlBQUFLLFNBQUEseUVBQUFkLENBQUEsR0FBQWUsTUFBQSxHQUFBQyxNQUFBLEVBQUFmLENBQUE7QUFFcEIsTUFBTWdCLGFBQWEsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFNekRDLFdBQVdBLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUksQ0FBQ0MsS0FBSyxHQUFHO01BQUNDLFFBQVEsRUFBRSxLQUFLO01BQUVDLEtBQUssRUFBRSxJQUFJO01BQUVDLFNBQVMsRUFBRTtJQUFJLENBQUM7RUFDOUQ7RUFFQSxPQUFPQyx3QkFBd0JBLENBQUNGLEtBQUssRUFBRTtJQUNyQztJQUNBLE9BQU87TUFBQ0QsUUFBUSxFQUFFO0lBQUksQ0FBQztFQUN6QjtFQUVBSSxpQkFBaUJBLENBQUNILEtBQUssRUFBRUMsU0FBUyxFQUFFO0lBQ2xDLElBQUksQ0FBQ0csUUFBUSxDQUFDO01BQ1pKLEtBQUs7TUFDTEM7SUFDRixDQUFDLENBQUM7RUFDSjtFQUVBSSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxJQUFJLElBQUksQ0FBQ1AsS0FBSyxDQUFDQyxRQUFRLEVBQUU7TUFDdkI7TUFDQSxPQUFPLElBQUksQ0FBQ0YsS0FBSyxDQUFDUyxRQUFRLEdBQUcsSUFBSSxDQUFDVCxLQUFLLENBQUNTLFFBQVEsR0FBRyxJQUFJO0lBQ3pEO0lBRUEsT0FBTyxJQUFJLENBQUNULEtBQUssQ0FBQ1UsUUFBUTtFQUM1QjtBQUNGO0FBQUNDLE9BQUEsQ0FBQWxDLE9BQUEsR0FBQW1CLGFBQUE7QUFBQWxCLGVBQUEsQ0EvQm9Ca0IsYUFBYSxlQUNiO0VBQ2pCYyxRQUFRLEVBQUVFLGtCQUFTLENBQUNDLElBQUksQ0FBQ0MsVUFBVTtFQUNuQ0wsUUFBUSxFQUFFRyxrQkFBUyxDQUFDRztBQUN0QixDQUFDIiwiaWdub3JlTGlzdCI6W119