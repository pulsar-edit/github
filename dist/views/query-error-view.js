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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    return /*#__PURE__*/_react.default.createElement(_errorView.default, _extends({
      title: e.message,
      descriptions: [e.stack],
      preformatted: true
    }, this.errorViewProps()));
  }

  renderGraphQLErrors(errors) {
    return /*#__PURE__*/_react.default.createElement(_errorView.default, _extends({
      title: "Query errors reported",
      descriptions: errors.map(e => e.message)
    }, this.errorViewProps()));
  }

  renderNetworkError() {
    return /*#__PURE__*/_react.default.createElement(_offlineView.default, {
      retry: this.props.retry
    });
  }

  render401() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GithubLoginView-Container"
    }, /*#__PURE__*/_react.default.createElement(_githubLoginView.default, {
      onLogin: this.props.login
    }, /*#__PURE__*/_react.default.createElement("p", null, "The API endpoint returned a unauthorized error. Please try to re-authenticate with the endpoint.")));
  }

  renderUnknown(response, text) {
    return /*#__PURE__*/_react.default.createElement(_errorView.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9xdWVyeS1lcnJvci12aWV3LmpzIl0sIm5hbWVzIjpbIlF1ZXJ5RXJyb3JWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJlIiwicHJvcHMiLCJlcnJvciIsInJlc3BvbnNlIiwic3RhdHVzIiwicmVuZGVyNDAxIiwicmVuZGVyVW5rbm93biIsInJlc3BvbnNlVGV4dCIsImVycm9ycyIsInJlbmRlckdyYXBoUUxFcnJvcnMiLCJuZXR3b3JrIiwicmVuZGVyTmV0d29ya0Vycm9yIiwibWVzc2FnZSIsInN0YWNrIiwiZXJyb3JWaWV3UHJvcHMiLCJtYXAiLCJyZXRyeSIsImxvZ2luIiwidGV4dCIsImxvZ291dCIsIlByb3BUeXBlcyIsInNoYXBlIiwibmFtZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJudW1iZXIiLCJhcnJheU9mIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVlLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBbUIxREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsQ0FBQyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsS0FBckI7O0FBRUEsUUFBSUYsQ0FBQyxDQUFDRyxRQUFOLEVBQWdCO0FBQ2QsY0FBUUgsQ0FBQyxDQUFDRyxRQUFGLENBQVdDLE1BQW5CO0FBQ0EsYUFBSyxHQUFMO0FBQVUsaUJBQU8sS0FBS0MsU0FBTCxFQUFQOztBQUNWLGFBQUssR0FBTDtBQUNFO0FBQ0E7O0FBQ0Y7QUFBUyxpQkFBTyxLQUFLQyxhQUFMLENBQW1CTixDQUFDLENBQUNHLFFBQXJCLEVBQStCSCxDQUFDLENBQUNPLFlBQWpDLENBQVA7QUFMVDtBQU9EOztBQUVELFFBQUlQLENBQUMsQ0FBQ1EsTUFBTixFQUFjO0FBQ1osYUFBTyxLQUFLQyxtQkFBTCxDQUF5QlQsQ0FBQyxDQUFDUSxNQUEzQixDQUFQO0FBQ0Q7O0FBRUQsUUFBSVIsQ0FBQyxDQUFDVSxPQUFOLEVBQWU7QUFDYixhQUFPLEtBQUtDLGtCQUFMLEVBQVA7QUFDRDs7QUFFRCx3QkFDRSw2QkFBQyxrQkFBRDtBQUNFLE1BQUEsS0FBSyxFQUFFWCxDQUFDLENBQUNZLE9BRFg7QUFFRSxNQUFBLFlBQVksRUFBRSxDQUFDWixDQUFDLENBQUNhLEtBQUgsQ0FGaEI7QUFHRSxNQUFBLFlBQVksRUFBRTtBQUhoQixPQUlNLEtBQUtDLGNBQUwsRUFKTixFQURGO0FBUUQ7O0FBRURMLEVBQUFBLG1CQUFtQixDQUFDRCxNQUFELEVBQVM7QUFDMUIsd0JBQ0UsNkJBQUMsa0JBQUQ7QUFDRSxNQUFBLEtBQUssRUFBQyx1QkFEUjtBQUVFLE1BQUEsWUFBWSxFQUFFQSxNQUFNLENBQUNPLEdBQVAsQ0FBV2YsQ0FBQyxJQUFJQSxDQUFDLENBQUNZLE9BQWxCO0FBRmhCLE9BR00sS0FBS0UsY0FBTCxFQUhOLEVBREY7QUFPRDs7QUFFREgsRUFBQUEsa0JBQWtCLEdBQUc7QUFDbkIsd0JBQU8sNkJBQUMsb0JBQUQ7QUFBYSxNQUFBLEtBQUssRUFBRSxLQUFLVixLQUFMLENBQVdlO0FBQS9CLE1BQVA7QUFDRDs7QUFFRFgsRUFBQUEsU0FBUyxHQUFHO0FBQ1Ysd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLDZCQUFDLHdCQUFEO0FBQWlCLE1BQUEsT0FBTyxFQUFFLEtBQUtKLEtBQUwsQ0FBV2dCO0FBQXJDLG9CQUNFLDJJQURGLENBREYsQ0FERjtBQVNEOztBQUVEWCxFQUFBQSxhQUFhLENBQUNILFFBQUQsRUFBV2UsSUFBWCxFQUFpQjtBQUM1Qix3QkFDRSw2QkFBQyxrQkFBRDtBQUNFLE1BQUEsS0FBSyxFQUFHLCtCQUE4QmYsUUFBUSxDQUFDQyxNQUFPLEVBRHhEO0FBRUUsTUFBQSxZQUFZLEVBQUUsQ0FBQ2MsSUFBRCxDQUZoQjtBQUdFLE1BQUEsWUFBWSxFQUFFO0FBSGhCLE9BSU0sS0FBS0osY0FBTCxFQUpOLEVBREY7QUFRRDs7QUFFREEsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsV0FBTztBQUNMRSxNQUFBQSxLQUFLLEVBQUUsS0FBS2YsS0FBTCxDQUFXZSxLQURiO0FBRUxHLE1BQUFBLE1BQU0sRUFBRSxLQUFLbEIsS0FBTCxDQUFXa0I7QUFGZCxLQUFQO0FBSUQ7O0FBNUZ5RDs7OztnQkFBdkN2QixjLGVBQ0E7QUFDakJNLEVBQUFBLEtBQUssRUFBRWtCLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCQyxJQUFBQSxJQUFJLEVBQUVGLG1CQUFVRyxNQUFWLENBQWlCQyxVQURGO0FBRXJCWixJQUFBQSxPQUFPLEVBQUVRLG1CQUFVRyxNQUFWLENBQWlCQyxVQUZMO0FBR3JCWCxJQUFBQSxLQUFLLEVBQUVPLG1CQUFVRyxNQUFWLENBQWlCQyxVQUhIO0FBSXJCckIsSUFBQUEsUUFBUSxFQUFFaUIsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDeEJqQixNQUFBQSxNQUFNLEVBQUVnQixtQkFBVUssTUFBVixDQUFpQkQ7QUFERCxLQUFoQixDQUpXO0FBT3JCakIsSUFBQUEsWUFBWSxFQUFFYSxtQkFBVUcsTUFQSDtBQVFyQmYsSUFBQUEsTUFBTSxFQUFFWSxtQkFBVU0sT0FBVixDQUFrQk4sbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDeENULE1BQUFBLE9BQU8sRUFBRVEsbUJBQVVHLE1BQVYsQ0FBaUJDO0FBRGMsS0FBaEIsQ0FBbEI7QUFSYSxHQUFoQixFQVdKQSxVQVpjO0FBYWpCUCxFQUFBQSxLQUFLLEVBQUVHLG1CQUFVTyxJQUFWLENBQWVILFVBYkw7QUFjakJSLEVBQUFBLEtBQUssRUFBRUksbUJBQVVPLElBZEE7QUFlakJSLEVBQUFBLE1BQU0sRUFBRUMsbUJBQVVPO0FBZkQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgR2l0aHViTG9naW5WaWV3IGZyb20gJy4vZ2l0aHViLWxvZ2luLXZpZXcnO1xuaW1wb3J0IEVycm9yVmlldyBmcm9tICcuL2Vycm9yLXZpZXcnO1xuaW1wb3J0IE9mZmxpbmVWaWV3IGZyb20gJy4vb2ZmbGluZS12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVycm9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgc3RhY2s6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIHJlc3BvbnNlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBzdGF0dXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIH0pLFxuICAgICAgcmVzcG9uc2VUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgZXJyb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBtZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KSksXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBsb2dpbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXRyeTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbG9nb3V0OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBlID0gdGhpcy5wcm9wcy5lcnJvcjtcblxuICAgIGlmIChlLnJlc3BvbnNlKSB7XG4gICAgICBzd2l0Y2ggKGUucmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICBjYXNlIDQwMTogcmV0dXJuIHRoaXMucmVuZGVyNDAxKCk7XG4gICAgICBjYXNlIDIwMDpcbiAgICAgICAgLy8gRG8gdGhlIGRlZmF1bHRcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OiByZXR1cm4gdGhpcy5yZW5kZXJVbmtub3duKGUucmVzcG9uc2UsIGUucmVzcG9uc2VUZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZS5lcnJvcnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckdyYXBoUUxFcnJvcnMoZS5lcnJvcnMpO1xuICAgIH1cblxuICAgIGlmIChlLm5ldHdvcmspIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlck5ldHdvcmtFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8RXJyb3JWaWV3XG4gICAgICAgIHRpdGxlPXtlLm1lc3NhZ2V9XG4gICAgICAgIGRlc2NyaXB0aW9ucz17W2Uuc3RhY2tdfVxuICAgICAgICBwcmVmb3JtYXR0ZWQ9e3RydWV9XG4gICAgICAgIHsuLi50aGlzLmVycm9yVmlld1Byb3BzKCl9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJHcmFwaFFMRXJyb3JzKGVycm9ycykge1xuICAgIHJldHVybiAoXG4gICAgICA8RXJyb3JWaWV3XG4gICAgICAgIHRpdGxlPVwiUXVlcnkgZXJyb3JzIHJlcG9ydGVkXCJcbiAgICAgICAgZGVzY3JpcHRpb25zPXtlcnJvcnMubWFwKGUgPT4gZS5tZXNzYWdlKX1cbiAgICAgICAgey4uLnRoaXMuZXJyb3JWaWV3UHJvcHMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck5ldHdvcmtFcnJvcigpIHtcbiAgICByZXR1cm4gPE9mZmxpbmVWaWV3IHJldHJ5PXt0aGlzLnByb3BzLnJldHJ5fSAvPjtcbiAgfVxuXG4gIHJlbmRlcjQwMSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0aHViTG9naW5WaWV3LUNvbnRhaW5lclwiPlxuICAgICAgICA8R2l0aHViTG9naW5WaWV3IG9uTG9naW49e3RoaXMucHJvcHMubG9naW59PlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgVGhlIEFQSSBlbmRwb2ludCByZXR1cm5lZCBhIHVuYXV0aG9yaXplZCBlcnJvci4gUGxlYXNlIHRyeSB0byByZS1hdXRoZW50aWNhdGUgd2l0aCB0aGUgZW5kcG9pbnQuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L0dpdGh1YkxvZ2luVmlldz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJVbmtub3duKHJlc3BvbnNlLCB0ZXh0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxFcnJvclZpZXdcbiAgICAgICAgdGl0bGU9e2BSZWNlaXZlZCBhbiBlcnJvciByZXNwb25zZTogJHtyZXNwb25zZS5zdGF0dXN9YH1cbiAgICAgICAgZGVzY3JpcHRpb25zPXtbdGV4dF19XG4gICAgICAgIHByZWZvcm1hdHRlZD17dHJ1ZX1cbiAgICAgICAgey4uLnRoaXMuZXJyb3JWaWV3UHJvcHMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGVycm9yVmlld1Byb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXRyeTogdGhpcy5wcm9wcy5yZXRyeSxcbiAgICAgIGxvZ291dDogdGhpcy5wcm9wcy5sb2dvdXQsXG4gICAgfTtcbiAgfVxufVxuIl19