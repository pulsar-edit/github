"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _githubLoginView = _interopRequireDefault(require("./github-login-view"));
var _errorView = _interopRequireDefault(require("./error-view"));
var _offlineView = _interopRequireDefault(require("./offline-view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class QueryErrorView extends _react.default.Component {
  render() {
    const e = this.props.error;
    if (e.response) {
      switch (e.response.status) {
        case 401:
          return this.render401();
        case 200:
          // Do the default
          break;
        default:
          return this.renderUnknown(e.response, e.responseText);
      }
    }
    if (e.errors) {
      return this.renderGraphQLErrors(e.errors);
    }
    if (e.network) {
      return this.renderNetworkError();
    }
    return _react.default.createElement(_errorView.default, _extends({
      title: e.message,
      descriptions: [e.stack],
      preformatted: true
    }, this.errorViewProps()));
  }
  renderGraphQLErrors(errors) {
    return _react.default.createElement(_errorView.default, _extends({
      title: "Query errors reported",
      descriptions: errors.map(e => e.message)
    }, this.errorViewProps()));
  }
  renderNetworkError() {
    return _react.default.createElement(_offlineView.default, {
      retry: this.props.retry
    });
  }
  render401() {
    return _react.default.createElement("div", {
      className: "github-GithubLoginView-Container"
    }, _react.default.createElement(_githubLoginView.default, {
      onLogin: this.props.login
    }, _react.default.createElement("p", null, "The API endpoint returned a unauthorized error. Please try to re-authenticate with the endpoint.")));
  }
  renderUnknown(response, text) {
    return _react.default.createElement(_errorView.default, _extends({
      title: `Received an error response: ${response.status}`,
      descriptions: [text],
      preformatted: true
    }, this.errorViewProps()));
  }
  errorViewProps() {
    return {
      retry: this.props.retry,
      logout: this.props.logout
    };
  }
}
exports.default = QueryErrorView;
_defineProperty(QueryErrorView, "propTypes", {
  error: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    message: _propTypes.default.string.isRequired,
    stack: _propTypes.default.string.isRequired,
    response: _propTypes.default.shape({
      status: _propTypes.default.number.isRequired
    }),
    responseText: _propTypes.default.string,
    errors: _propTypes.default.arrayOf(_propTypes.default.shape({
      message: _propTypes.default.string.isRequired
    }))
  }).isRequired,
  login: _propTypes.default.func.isRequired,
  retry: _propTypes.default.func,
  logout: _propTypes.default.func
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJRdWVyeUVycm9yVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwiZSIsInByb3BzIiwiZXJyb3IiLCJyZXNwb25zZSIsInN0YXR1cyIsInJlbmRlcjQwMSIsInJlbmRlclVua25vd24iLCJyZXNwb25zZVRleHQiLCJlcnJvcnMiLCJyZW5kZXJHcmFwaFFMRXJyb3JzIiwibmV0d29yayIsInJlbmRlck5ldHdvcmtFcnJvciIsIm1lc3NhZ2UiLCJzdGFjayIsImVycm9yVmlld1Byb3BzIiwibWFwIiwicmV0cnkiLCJsb2dpbiIsInRleHQiLCJsb2dvdXQiLCJQcm9wVHlwZXMiLCJzaGFwZSIsIm5hbWUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibnVtYmVyIiwiYXJyYXlPZiIsImZ1bmMiXSwic291cmNlcyI6WyJxdWVyeS1lcnJvci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgR2l0aHViTG9naW5WaWV3IGZyb20gJy4vZ2l0aHViLWxvZ2luLXZpZXcnO1xuaW1wb3J0IEVycm9yVmlldyBmcm9tICcuL2Vycm9yLXZpZXcnO1xuaW1wb3J0IE9mZmxpbmVWaWV3IGZyb20gJy4vb2ZmbGluZS12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVycm9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgc3RhY2s6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHJlc3BvbnNlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBzdGF0dXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVzcG9uc2VUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgZXJyb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBtZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSksXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBsb2dpbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXRyeTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbG9nb3V0OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBlID0gdGhpcy5wcm9wcy5lcnJvcjtcblxuICAgIGlmIChlLnJlc3BvbnNlKSB7XG4gICAgICBzd2l0Y2ggKGUucmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICBjYXNlIDQwMTogcmV0dXJuIHRoaXMucmVuZGVyNDAxKCk7XG4gICAgICBjYXNlIDIwMDpcbiAgICAgICAgLy8gRG8gdGhlIGRlZmF1bHRcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiByZXR1cm4gdGhpcy5yZW5kZXJVbmtub3duKGUucmVzcG9uc2UsIGUucmVzcG9uc2VUZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZS5lcnJvcnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckdyYXBoUUxFcnJvcnMoZS5lcnJvcnMpO1xuICAgIH1cblxuICAgIGlmIChlLm5ldHdvcmspIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlck5ldHdvcmtFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8RXJyb3JWaWV3XG4gICAgICAgIHRpdGxlPXtlLm1lc3NhZ2V9XG4gICAgICAgIGRlc2NyaXB0aW9ucz17W2Uuc3RhY2tdfVxuICAgICAgICBwcmVmb3JtYXR0ZWQ9e3RydWV9XG4gICAgICAgIHsuLi50aGlzLmVycm9yVmlld1Byb3BzKCl9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJHcmFwaFFMRXJyb3JzKGVycm9ycykge1xuICAgIHJldHVybiAoXG4gICAgICA8RXJyb3JWaWV3XG4gICAgICAgIHRpdGxlPVwiUXVlcnkgZXJyb3JzIHJlcG9ydGVkXCJcbiAgICAgICAgZGVzY3JpcHRpb25zPXtlcnJvcnMubWFwKGUgPT4gZS5tZXNzYWdlKX1cbiAgICAgICAgey4uLnRoaXMuZXJyb3JWaWV3UHJvcHMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck5ldHdvcmtFcnJvcigpIHtcbiAgICByZXR1cm4gPE9mZmxpbmVWaWV3IHJldHJ5PXt0aGlzLnByb3BzLnJldHJ5fSAvPjtcbiAgfVxuXG4gIHJlbmRlcjQwMSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0aHViTG9naW5WaWV3LUNvbnRhaW5lclwiPlxuICAgICAgICA8R2l0aHViTG9naW5WaWV3IG9uTG9naW49e3RoaXMucHJvcHMubG9naW59PlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgVGhlIEFQSSBlbmRwb2ludCByZXR1cm5lZCBhIHVuYXV0aG9yaXplZCBlcnJvci4gUGxlYXNlIHRyeSB0byByZS1hdXRoZW50aWNhdGUgd2l0aCB0aGUgZW5kcG9pbnQuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L0dpdGh1YkxvZ2luVmlldz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJVbmtub3duKHJlc3BvbnNlLCB0ZXh0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxFcnJvclZpZXdcbiAgICAgICAgdGl0bGU9e2BSZWNlaXZlZCBhbiBlcnJvciByZXNwb25zZTogJHtyZXNwb25zZS5zdGF0dXN9YH1cbiAgICAgICAgZGVzY3JpcHRpb25zPXtbdGV4dF19XG4gICAgICAgIHByZWZvcm1hdHRlZD17dHJ1ZX1cbiAgICAgICAgey4uLnRoaXMuZXJyb3JWaWV3UHJvcHMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGVycm9yVmlld1Byb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXRyeTogdGhpcy5wcm9wcy5yZXRyeSxcbiAgICAgIGxvZ291dDogdGhpcy5wcm9wcy5sb2dvdXQsXG4gICAgfTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQXlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFMUIsTUFBTUEsY0FBYyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQW1CMURDLE1BQU0sR0FBRztJQUNQLE1BQU1DLENBQUMsR0FBRyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsS0FBSztJQUUxQixJQUFJRixDQUFDLENBQUNHLFFBQVEsRUFBRTtNQUNkLFFBQVFILENBQUMsQ0FBQ0csUUFBUSxDQUFDQyxNQUFNO1FBQ3pCLEtBQUssR0FBRztVQUFFLE9BQU8sSUFBSSxDQUFDQyxTQUFTLEVBQUU7UUFDakMsS0FBSyxHQUFHO1VBQ047VUFDQTtRQUNGO1VBQVMsT0FBTyxJQUFJLENBQUNDLGFBQWEsQ0FBQ04sQ0FBQyxDQUFDRyxRQUFRLEVBQUVILENBQUMsQ0FBQ08sWUFBWSxDQUFDO01BQUM7SUFFakU7SUFFQSxJQUFJUCxDQUFDLENBQUNRLE1BQU0sRUFBRTtNQUNaLE9BQU8sSUFBSSxDQUFDQyxtQkFBbUIsQ0FBQ1QsQ0FBQyxDQUFDUSxNQUFNLENBQUM7SUFDM0M7SUFFQSxJQUFJUixDQUFDLENBQUNVLE9BQU8sRUFBRTtNQUNiLE9BQU8sSUFBSSxDQUFDQyxrQkFBa0IsRUFBRTtJQUNsQztJQUVBLE9BQ0UsNkJBQUMsa0JBQVM7TUFDUixLQUFLLEVBQUVYLENBQUMsQ0FBQ1ksT0FBUTtNQUNqQixZQUFZLEVBQUUsQ0FBQ1osQ0FBQyxDQUFDYSxLQUFLLENBQUU7TUFDeEIsWUFBWSxFQUFFO0lBQUssR0FDZixJQUFJLENBQUNDLGNBQWMsRUFBRSxFQUN6QjtFQUVOO0VBRUFMLG1CQUFtQixDQUFDRCxNQUFNLEVBQUU7SUFDMUIsT0FDRSw2QkFBQyxrQkFBUztNQUNSLEtBQUssRUFBQyx1QkFBdUI7TUFDN0IsWUFBWSxFQUFFQSxNQUFNLENBQUNPLEdBQUcsQ0FBQ2YsQ0FBQyxJQUFJQSxDQUFDLENBQUNZLE9BQU87SUFBRSxHQUNyQyxJQUFJLENBQUNFLGNBQWMsRUFBRSxFQUN6QjtFQUVOO0VBRUFILGtCQUFrQixHQUFHO0lBQ25CLE9BQU8sNkJBQUMsb0JBQVc7TUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDVixLQUFLLENBQUNlO0lBQU0sRUFBRztFQUNqRDtFQUVBWCxTQUFTLEdBQUc7SUFDVixPQUNFO01BQUssU0FBUyxFQUFDO0lBQWtDLEdBQy9DLDZCQUFDLHdCQUFlO01BQUMsT0FBTyxFQUFFLElBQUksQ0FBQ0osS0FBSyxDQUFDZ0I7SUFBTSxHQUN6QywySUFFSSxDQUNZLENBQ2Q7RUFFVjtFQUVBWCxhQUFhLENBQUNILFFBQVEsRUFBRWUsSUFBSSxFQUFFO0lBQzVCLE9BQ0UsNkJBQUMsa0JBQVM7TUFDUixLQUFLLEVBQUcsK0JBQThCZixRQUFRLENBQUNDLE1BQU8sRUFBRTtNQUN4RCxZQUFZLEVBQUUsQ0FBQ2MsSUFBSSxDQUFFO01BQ3JCLFlBQVksRUFBRTtJQUFLLEdBQ2YsSUFBSSxDQUFDSixjQUFjLEVBQUUsRUFDekI7RUFFTjtFQUVBQSxjQUFjLEdBQUc7SUFDZixPQUFPO01BQ0xFLEtBQUssRUFBRSxJQUFJLENBQUNmLEtBQUssQ0FBQ2UsS0FBSztNQUN2QkcsTUFBTSxFQUFFLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ2tCO0lBQ3JCLENBQUM7RUFDSDtBQUNGO0FBQUM7QUFBQSxnQkE3Rm9CdkIsY0FBYyxlQUNkO0VBQ2pCTSxLQUFLLEVBQUVrQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDckJDLElBQUksRUFBRUYsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO0lBQ2pDWixPQUFPLEVBQUVRLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0MsVUFBVTtJQUNwQ1gsS0FBSyxFQUFFTyxrQkFBUyxDQUFDRyxNQUFNLENBQUNDLFVBQVU7SUFDbENyQixRQUFRLEVBQUVpQixrQkFBUyxDQUFDQyxLQUFLLENBQUM7TUFDeEJqQixNQUFNLEVBQUVnQixrQkFBUyxDQUFDSyxNQUFNLENBQUNEO0lBQzNCLENBQUMsQ0FBQztJQUNGakIsWUFBWSxFQUFFYSxrQkFBUyxDQUFDRyxNQUFNO0lBQzlCZixNQUFNLEVBQUVZLGtCQUFTLENBQUNNLE9BQU8sQ0FBQ04sa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO01BQ3hDVCxPQUFPLEVBQUVRLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0M7SUFDNUIsQ0FBQyxDQUFDO0VBQ0osQ0FBQyxDQUFDLENBQUNBLFVBQVU7RUFDYlAsS0FBSyxFQUFFRyxrQkFBUyxDQUFDTyxJQUFJLENBQUNILFVBQVU7RUFDaENSLEtBQUssRUFBRUksa0JBQVMsQ0FBQ08sSUFBSTtFQUNyQlIsTUFBTSxFQUFFQyxrQkFBUyxDQUFDTztBQUNwQixDQUFDIn0=