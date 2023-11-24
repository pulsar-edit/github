"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FilePatchMetaView extends _react.default.Component {
  renderMetaControls() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "github-FilePatchView-metaControls"
    }, _react.default.createElement("button", {
      className: (0, _classnames.default)('github-FilePatchView-metaButton', 'icon', this.props.actionIcon),
      onClick: this.props.action
    }, this.props.actionText));
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-FilePatchView-meta"
    }, _react.default.createElement("div", {
      className: "github-FilePatchView-metaContainer"
    }, _react.default.createElement("header", {
      className: "github-FilePatchView-metaHeader"
    }, _react.default.createElement("h3", {
      className: "github-FilePatchView-metaTitle"
    }, this.props.title), this.renderMetaControls()), _react.default.createElement("div", {
      className: "github-FilePatchView-metaDetails"
    }, this.props.children)));
  }

}

exports.default = FilePatchMetaView;

_defineProperty(FilePatchMetaView, "propTypes", {
  title: _propTypes.default.string.isRequired,
  actionIcon: _propTypes.default.string.isRequired,
  actionText: _propTypes.default.string.isRequired,
  action: _propTypes.default.func.isRequired,
  children: _propTypes.default.element.isRequired,
  itemType: _propTypes2.ItemTypePropType.isRequired
});