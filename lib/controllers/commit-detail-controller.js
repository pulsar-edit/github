"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _commitDetailView = _interopRequireDefault(require("../views/commit-detail-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommitDetailController extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toggleMessage", () => {
      return new Promise(resolve => {
        this.setState(prevState => ({
          messageOpen: !prevState.messageOpen
        }), resolve);
      });
    });

    this.state = {
      messageCollapsible: this.props.commit.isBodyLong(),
      messageOpen: !this.props.commit.isBodyLong()
    };
  }

  render() {
    return _react.default.createElement(_commitDetailView.default, _extends({
      messageCollapsible: this.state.messageCollapsible,
      messageOpen: this.state.messageOpen,
      toggleMessage: this.toggleMessage
    }, this.props));
  }

}

exports.default = CommitDetailController;

_defineProperty(CommitDetailController, "propTypes", _objectSpread({}, _commitDetailView.default.drilledPropTypes, {
  commit: _propTypes.default.object.isRequired
}));