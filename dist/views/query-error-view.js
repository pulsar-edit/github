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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9xdWVyeS1lcnJvci12aWV3LmpzIl0sIm5hbWVzIjpbIlF1ZXJ5RXJyb3JWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJlIiwicHJvcHMiLCJlcnJvciIsInJlc3BvbnNlIiwic3RhdHVzIiwicmVuZGVyNDAxIiwicmVuZGVyVW5rbm93biIsInJlc3BvbnNlVGV4dCIsImVycm9ycyIsInJlbmRlckdyYXBoUUxFcnJvcnMiLCJuZXR3b3JrIiwicmVuZGVyTmV0d29ya0Vycm9yIiwibWVzc2FnZSIsInN0YWNrIiwiZXJyb3JWaWV3UHJvcHMiLCJtYXAiLCJyZXRyeSIsImxvZ2luIiwidGV4dCIsImxvZ291dCIsIlByb3BUeXBlcyIsInNoYXBlIiwibmFtZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJudW1iZXIiLCJhcnJheU9mIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVlLE1BQU1BLGNBQU4sU0FBNkJDLGVBQU1DLFNBQW5DLENBQTZDO0FBbUIxREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsQ0FBQyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsS0FBckI7O0FBRUEsUUFBSUYsQ0FBQyxDQUFDRyxRQUFOLEVBQWdCO0FBQ2QsY0FBUUgsQ0FBQyxDQUFDRyxRQUFGLENBQVdDLE1BQW5CO0FBQ0EsYUFBSyxHQUFMO0FBQVUsaUJBQU8sS0FBS0MsU0FBTCxFQUFQOztBQUNWLGFBQUssR0FBTDtBQUNFO0FBQ0E7O0FBQ0Y7QUFBUyxpQkFBTyxLQUFLQyxhQUFMLENBQW1CTixDQUFDLENBQUNHLFFBQXJCLEVBQStCSCxDQUFDLENBQUNPLFlBQWpDLENBQVA7QUFMVDtBQU9EOztBQUVELFFBQUlQLENBQUMsQ0FBQ1EsTUFBTixFQUFjO0FBQ1osYUFBTyxLQUFLQyxtQkFBTCxDQUF5QlQsQ0FBQyxDQUFDUSxNQUEzQixDQUFQO0FBQ0Q7O0FBRUQsUUFBSVIsQ0FBQyxDQUFDVSxPQUFOLEVBQWU7QUFDYixhQUFPLEtBQUtDLGtCQUFMLEVBQVA7QUFDRDs7QUFFRCxXQUNFLDZCQUFDLGtCQUFEO0FBQ0UsTUFBQSxLQUFLLEVBQUVYLENBQUMsQ0FBQ1ksT0FEWDtBQUVFLE1BQUEsWUFBWSxFQUFFLENBQUNaLENBQUMsQ0FBQ2EsS0FBSCxDQUZoQjtBQUdFLE1BQUEsWUFBWSxFQUFFO0FBSGhCLE9BSU0sS0FBS0MsY0FBTCxFQUpOLEVBREY7QUFRRDs7QUFFREwsRUFBQUEsbUJBQW1CLENBQUNELE1BQUQsRUFBUztBQUMxQixXQUNFLDZCQUFDLGtCQUFEO0FBQ0UsTUFBQSxLQUFLLEVBQUMsdUJBRFI7QUFFRSxNQUFBLFlBQVksRUFBRUEsTUFBTSxDQUFDTyxHQUFQLENBQVdmLENBQUMsSUFBSUEsQ0FBQyxDQUFDWSxPQUFsQjtBQUZoQixPQUdNLEtBQUtFLGNBQUwsRUFITixFQURGO0FBT0Q7O0FBRURILEVBQUFBLGtCQUFrQixHQUFHO0FBQ25CLFdBQU8sNkJBQUMsb0JBQUQ7QUFBYSxNQUFBLEtBQUssRUFBRSxLQUFLVixLQUFMLENBQVdlO0FBQS9CLE1BQVA7QUFDRDs7QUFFRFgsRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRSw2QkFBQyx3QkFBRDtBQUFpQixNQUFBLE9BQU8sRUFBRSxLQUFLSixLQUFMLENBQVdnQjtBQUFyQyxPQUNFLDJJQURGLENBREYsQ0FERjtBQVNEOztBQUVEWCxFQUFBQSxhQUFhLENBQUNILFFBQUQsRUFBV2UsSUFBWCxFQUFpQjtBQUM1QixXQUNFLDZCQUFDLGtCQUFEO0FBQ0UsTUFBQSxLQUFLLEVBQUcsK0JBQThCZixRQUFRLENBQUNDLE1BQU8sRUFEeEQ7QUFFRSxNQUFBLFlBQVksRUFBRSxDQUFDYyxJQUFELENBRmhCO0FBR0UsTUFBQSxZQUFZLEVBQUU7QUFIaEIsT0FJTSxLQUFLSixjQUFMLEVBSk4sRUFERjtBQVFEOztBQUVEQSxFQUFBQSxjQUFjLEdBQUc7QUFDZixXQUFPO0FBQ0xFLE1BQUFBLEtBQUssRUFBRSxLQUFLZixLQUFMLENBQVdlLEtBRGI7QUFFTEcsTUFBQUEsTUFBTSxFQUFFLEtBQUtsQixLQUFMLENBQVdrQjtBQUZkLEtBQVA7QUFJRDs7QUE1RnlEOzs7O2dCQUF2Q3ZCLGMsZUFDQTtBQUNqQk0sRUFBQUEsS0FBSyxFQUFFa0IsbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDckJDLElBQUFBLElBQUksRUFBRUYsbUJBQVVHLE1BQVYsQ0FBaUJDLFVBREY7QUFFckJaLElBQUFBLE9BQU8sRUFBRVEsbUJBQVVHLE1BQVYsQ0FBaUJDLFVBRkw7QUFHckJYLElBQUFBLEtBQUssRUFBRU8sbUJBQVVHLE1BQVYsQ0FBaUJDLFVBSEg7QUFJckJyQixJQUFBQSxRQUFRLEVBQUVpQixtQkFBVUMsS0FBVixDQUFnQjtBQUN4QmpCLE1BQUFBLE1BQU0sRUFBRWdCLG1CQUFVSyxNQUFWLENBQWlCRDtBQURELEtBQWhCLENBSlc7QUFPckJqQixJQUFBQSxZQUFZLEVBQUVhLG1CQUFVRyxNQVBIO0FBUXJCZixJQUFBQSxNQUFNLEVBQUVZLG1CQUFVTSxPQUFWLENBQWtCTixtQkFBVUMsS0FBVixDQUFnQjtBQUN4Q1QsTUFBQUEsT0FBTyxFQUFFUSxtQkFBVUcsTUFBVixDQUFpQkM7QUFEYyxLQUFoQixDQUFsQjtBQVJhLEdBQWhCLEVBV0pBLFVBWmM7QUFhakJQLEVBQUFBLEtBQUssRUFBRUcsbUJBQVVPLElBQVYsQ0FBZUgsVUFiTDtBQWNqQlIsRUFBQUEsS0FBSyxFQUFFSSxtQkFBVU8sSUFkQTtBQWVqQlIsRUFBQUEsTUFBTSxFQUFFQyxtQkFBVU87QUFmRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBHaXRodWJMb2dpblZpZXcgZnJvbSAnLi9naXRodWItbG9naW4tdmlldyc7XG5pbXBvcnQgRXJyb3JWaWV3IGZyb20gJy4vZXJyb3Itdmlldyc7XG5pbXBvcnQgT2ZmbGluZVZpZXcgZnJvbSAnLi9vZmZsaW5lLXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeUVycm9yVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZXJyb3I6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBtZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBzdGFjazogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgcmVzcG9uc2U6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHN0YXR1czogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgfSksXG4gICAgICByZXNwb25zZVRleHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBlcnJvcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIH0pKSxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGxvZ2luOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJldHJ5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2dvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGUgPSB0aGlzLnByb3BzLmVycm9yO1xuXG4gICAgaWYgKGUucmVzcG9uc2UpIHtcbiAgICAgIHN3aXRjaCAoZS5yZXNwb25zZS5zdGF0dXMpIHtcbiAgICAgIGNhc2UgNDAxOiByZXR1cm4gdGhpcy5yZW5kZXI0MDEoKTtcbiAgICAgIGNhc2UgMjAwOlxuICAgICAgICAvLyBEbyB0aGUgZGVmYXVsdFxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB0aGlzLnJlbmRlclVua25vd24oZS5yZXNwb25zZSwgZS5yZXNwb25zZVRleHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlLmVycm9ycykge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyR3JhcGhRTEVycm9ycyhlLmVycm9ycyk7XG4gICAgfVxuXG4gICAgaWYgKGUubmV0d29yaykge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTmV0d29ya0Vycm9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxFcnJvclZpZXdcbiAgICAgICAgdGl0bGU9e2UubWVzc2FnZX1cbiAgICAgICAgZGVzY3JpcHRpb25zPXtbZS5zdGFja119XG4gICAgICAgIHByZWZvcm1hdHRlZD17dHJ1ZX1cbiAgICAgICAgey4uLnRoaXMuZXJyb3JWaWV3UHJvcHMoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckdyYXBoUUxFcnJvcnMoZXJyb3JzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxFcnJvclZpZXdcbiAgICAgICAgdGl0bGU9XCJRdWVyeSBlcnJvcnMgcmVwb3J0ZWRcIlxuICAgICAgICBkZXNjcmlwdGlvbnM9e2Vycm9ycy5tYXAoZSA9PiBlLm1lc3NhZ2UpfVxuICAgICAgICB7Li4udGhpcy5lcnJvclZpZXdQcm9wcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTmV0d29ya0Vycm9yKCkge1xuICAgIHJldHVybiA8T2ZmbGluZVZpZXcgcmV0cnk9e3RoaXMucHJvcHMucmV0cnl9IC8+O1xuICB9XG5cbiAgcmVuZGVyNDAxKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRodWJMb2dpblZpZXctQ29udGFpbmVyXCI+XG4gICAgICAgIDxHaXRodWJMb2dpblZpZXcgb25Mb2dpbj17dGhpcy5wcm9wcy5sb2dpbn0+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICBUaGUgQVBJIGVuZHBvaW50IHJldHVybmVkIGEgdW5hdXRob3JpemVkIGVycm9yLiBQbGVhc2UgdHJ5IHRvIHJlLWF1dGhlbnRpY2F0ZSB3aXRoIHRoZSBlbmRwb2ludC5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvR2l0aHViTG9naW5WaWV3PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclVua25vd24ocmVzcG9uc2UsIHRleHQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEVycm9yVmlld1xuICAgICAgICB0aXRsZT17YFJlY2VpdmVkIGFuIGVycm9yIHJlc3BvbnNlOiAke3Jlc3BvbnNlLnN0YXR1c31gfVxuICAgICAgICBkZXNjcmlwdGlvbnM9e1t0ZXh0XX1cbiAgICAgICAgcHJlZm9ybWF0dGVkPXt0cnVlfVxuICAgICAgICB7Li4udGhpcy5lcnJvclZpZXdQcm9wcygpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgZXJyb3JWaWV3UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJldHJ5OiB0aGlzLnByb3BzLnJldHJ5LFxuICAgICAgbG9nb3V0OiB0aGlzLnByb3BzLmxvZ291dCxcbiAgICB9O1xuICB9XG59XG4iXX0=