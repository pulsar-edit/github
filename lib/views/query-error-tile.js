"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class QueryErrorTile extends _react.default.Component {
  componentDidMount() {
    // eslint-disable-next-line no-console
    console.error('Error encountered in subquery', this.props.error);
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-QueryErrorTile"
    }, _react.default.createElement("div", {
      className: "github-QueryErrorTile-messages"
    }, this.renderMessages()));
  }

  renderMessages() {
    if (this.props.error.errors) {
      return this.props.error.errors.map((error, index) => {
        return this.renderMessage(error.message, index, 'alert');
      });
    }

    if (this.props.error.response) {
      return this.renderMessage(this.props.error.responseText, '0', 'alert');
    }

    if (this.props.error.network) {
      return this.renderMessage('Offline', '0', 'alignment-unalign');
    }

    return this.renderMessage(this.props.error.toString(), '0', 'alert');
  }

  renderMessage(body, key, icon) {
    return _react.default.createElement("p", {
      key: key,
      className: "github-QueryErrorTile-message"
    }, _react.default.createElement(_octicon.default, {
      icon: icon
    }), body);
  }

}

exports.default = QueryErrorTile;

_defineProperty(QueryErrorTile, "propTypes", {
  error: _propTypes.default.shape({
    response: _propTypes.default.shape({
      status: _propTypes.default.number.isRequired
    }),
    responseText: _propTypes.default.string,
    network: _propTypes.default.bool,
    errors: _propTypes.default.arrayOf(_propTypes.default.shape({
      message: _propTypes.default.string.isRequired
    }))
  }).isRequired
});