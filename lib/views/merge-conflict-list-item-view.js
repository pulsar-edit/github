"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MergeConflictListItemView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refItem = new _refHolder.default();
    this.subs = new _eventKit.CompositeDisposable(this.refItem.observe(item => this.props.registerItemElement(this.props.mergeConflict, item)));
  }

  render() {
    const _this$props = this.props,
          {
      mergeConflict,
      selected
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["mergeConflict", "selected"]);

    delete others.remainingConflicts;
    delete others.registerItemElement;
    const fileStatus = _helpers.classNameForStatus[mergeConflict.status.file];
    const oursStatus = _helpers.classNameForStatus[mergeConflict.status.ours];
    const theirsStatus = _helpers.classNameForStatus[mergeConflict.status.theirs];
    const className = selected ? 'is-selected' : '';
    return _react.default.createElement("div", _extends({
      ref: this.refItem.setter
    }, others, {
      className: `github-MergeConflictListView-item is-${fileStatus} ${className}`
    }), _react.default.createElement("div", {
      className: "github-FilePatchListView-item github-FilePatchListView-pathItem"
    }, _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${fileStatus} status-${fileStatus}`
    }), _react.default.createElement("span", {
      className: "github-FilePatchListView-path"
    }, mergeConflict.filePath), _react.default.createElement("span", {
      className: 'github-FilePatchListView ours-theirs-info'
    }, _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${oursStatus}`
    }), _react.default.createElement("span", {
      className: `github-FilePatchListView-icon icon icon-diff-${theirsStatus}`
    }))), _react.default.createElement("div", {
      className: "github-FilePatchListView-item github-FilePatchListView-resolutionItem"
    }, this.renderRemainingConflicts()));
  }

  renderRemainingConflicts() {
    if (this.props.remainingConflicts === 0) {
      return _react.default.createElement("span", {
        className: "icon icon-check github-RemainingConflicts text-success"
      }, "ready");
    } else if (this.props.remainingConflicts !== undefined) {
      const pluralConflicts = this.props.remainingConflicts === 1 ? '' : 's';
      return _react.default.createElement("span", {
        className: "github-RemainingConflicts text-warning"
      }, this.props.remainingConflicts, " conflict", pluralConflicts, " remaining");
    } else {
      return _react.default.createElement("span", {
        className: "github-RemainingConflicts text-subtle"
      }, "calculating");
    }
  }

  componentWillUnmount() {
    this.subs.dispose();
  }

}

exports.default = MergeConflictListItemView;

_defineProperty(MergeConflictListItemView, "propTypes", {
  mergeConflict: _propTypes2.MergeConflictItemPropType.isRequired,
  selected: _propTypes.default.bool.isRequired,
  remainingConflicts: _propTypes.default.number,
  registerItemElement: _propTypes.default.func.isRequired
});