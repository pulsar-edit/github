"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The repository is too large for Atom to handle
 */
class TooLarge extends _state.default {
  isTooLarge() {
    return true;
  }

}

exports.default = TooLarge;

_state.default.register(TooLarge);