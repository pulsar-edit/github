"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LoadingView extends _react.default.Component {
  render() {
    return _react.default.createElement("div", {
      className: "github-Loader"
    }, _react.default.createElement("span", {
      className: "github-Spinner"
    }));
  }

}

exports.default = LoadingView;