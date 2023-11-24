"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _propTypes2 = require("../prop-types");

var _helpers = require("../helpers");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FilePatchListItemView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refItem = new _refHolder.default();
    this.subs = new _eventKit.CompositeDisposable(this.refItem.observe(item => this.props.registerItemElement(this.props.filePatch, item)));
  }

  render() {
    const _this$props = this.props,
          {
      filePatch,
      selected
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["filePatch", "selected"]);

    delete others.registerItemElement;
    const status = _helpers.classNameForStatus[filePatch.status];
    const className = selected ? 'is-selected' : '';
    return _react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-FilePatchListView-item is-${status} ${className}`
    }), _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${status} status-${status}`
    }), _react.default.createElement("span", {
      className: "github-FilePatchListView-path"
    }, filePatch.filePath));
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

}

exports.default = FilePatchListItemView;

_defineProperty(FilePatchListItemView, "propTypes", {
  filePatch: _propTypes2.FilePatchItemPropType.isRequired,
  selected: _propTypes.default.bool.isRequired,
  registerItemElement: _propTypes.default.func
});

_defineProperty(FilePatchListItemView, "defaultProps", {
  registerItemElement: () => {}
});