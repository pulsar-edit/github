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