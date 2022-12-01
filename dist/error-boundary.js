"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9lcnJvci1ib3VuZGFyeS5qcyJdLCJuYW1lcyI6WyJFcnJvckJvdW5kYXJ5IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJoYXNFcnJvciIsImVycm9yIiwiZXJyb3JJbmZvIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJzZXRTdGF0ZSIsInJlbmRlciIsImZhbGxiYWNrIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJub2RlIiwiaXNSZXF1aXJlZCIsImFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxhQUFOLFNBQTRCQyxlQUFNQyxTQUFsQyxDQUE0QztBQU16REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUFDQyxNQUFBQSxRQUFRLEVBQUUsS0FBWDtBQUFrQkMsTUFBQUEsS0FBSyxFQUFFLElBQXpCO0FBQStCQyxNQUFBQSxTQUFTLEVBQUU7QUFBMUMsS0FBYjtBQUNEOztBQUU4QixTQUF4QkMsd0JBQXdCLENBQUNGLEtBQUQsRUFBUTtBQUNyQztBQUNBLFdBQU87QUFBQ0QsTUFBQUEsUUFBUSxFQUFFO0FBQVgsS0FBUDtBQUNEOztBQUVESSxFQUFBQSxpQkFBaUIsQ0FBQ0gsS0FBRCxFQUFRQyxTQUFSLEVBQW1CO0FBQ2xDLFNBQUtHLFFBQUwsQ0FBYztBQUNaSixNQUFBQSxLQURZO0FBRVpDLE1BQUFBO0FBRlksS0FBZDtBQUlEOztBQUVESSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJLEtBQUtQLEtBQUwsQ0FBV0MsUUFBZixFQUF5QjtBQUN2QjtBQUNBLGFBQU8sS0FBS0YsS0FBTCxDQUFXUyxRQUFYLEdBQXNCLEtBQUtULEtBQUwsQ0FBV1MsUUFBakMsR0FBNEMsSUFBbkQ7QUFDRDs7QUFFRCxXQUFPLEtBQUtULEtBQUwsQ0FBV1UsUUFBbEI7QUFDRDs7QUE5QndEOzs7O2dCQUF0Q2QsYSxlQUNBO0FBQ2pCYyxFQUFBQSxRQUFRLEVBQUVDLG1CQUFVQyxJQUFWLENBQWVDLFVBRFI7QUFFakJKLEVBQUFBLFFBQVEsRUFBRUUsbUJBQVVHO0FBRkgsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvckJvdW5kYXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcbiAgICBmYWxsYmFjazogUHJvcFR5cGVzLmFueSxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge2hhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwsIGVycm9ySW5mbzogbnVsbH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKGVycm9yKSB7XG4gICAgLy8gVXBkYXRlIHN0YXRlIHNvIHRoZSBuZXh0IHJlbmRlciB3aWxsIHNob3cgdGhlIGZhbGxiYWNrIFVJLlxuICAgIHJldHVybiB7aGFzRXJyb3I6IHRydWV9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkQ2F0Y2goZXJyb3IsIGVycm9ySW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3IsXG4gICAgICBlcnJvckluZm8sXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzRXJyb3IpIHtcbiAgICAgIC8vIFlvdSBjYW4gcmVuZGVyIGFueSBjdXN0b20gZmFsbGJhY2sgVUlcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmZhbGxiYWNrID8gdGhpcy5wcm9wcy5mYWxsYmFjayA6IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG4gIH1cbn1cbiJdfQ==