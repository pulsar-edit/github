"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactionPickerView = _interopRequireDefault(require("../views/reaction-picker-view"));

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReactionPickerController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "addReactionAndClose", async content => {
      await this.props.addReaction(content);
      (0, _reporterProxy.addEvent)('add-emoji-reaction', {
        package: 'github'
      });
      this.props.tooltipHolder.map(tooltip => tooltip.dispose());
    });

    _defineProperty(this, "removeReactionAndClose", async content => {
      await this.props.removeReaction(content);
      (0, _reporterProxy.addEvent)('remove-emoji-reaction', {
        package: 'github'
      });
      this.props.tooltipHolder.map(tooltip => tooltip.dispose());
    });
  }

  render() {
    return _react.default.createElement(_reactionPickerView.default, _extends({
      addReactionAndClose: this.addReactionAndClose,
      removeReactionAndClose: this.removeReactionAndClose
    }, this.props));
  }

}

exports.default = ReactionPickerController;

_defineProperty(ReactionPickerController, "propTypes", {
  addReaction: _propTypes.default.func.isRequired,
  removeReaction: _propTypes.default.func.isRequired,
  tooltipHolder: _propTypes2.RefHolderPropType.isRequired
});