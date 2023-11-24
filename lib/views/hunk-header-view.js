"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _helpers = require("../helpers");

var _propTypes2 = require("../prop-types");

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _tooltip = _interopRequireDefault(require("../atom/tooltip"));

var _keystroke = _interopRequireDefault(require("../atom/keystroke"));

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function theBuckStopsHere(event) {
  event.stopPropagation();
}

class HunkHeaderView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'didMouseDown', 'renderButtons');
    this.refDiscardButton = new _refHolder.default();
  }

  render() {
    const conditional = {
      'github-HunkHeaderView--isSelected': this.props.isSelected,
      'github-HunkHeaderView--isHunkMode': this.props.selectionMode === 'hunk'
    };
    return _react.default.createElement("div", {
      className: (0, _classnames.default)('github-HunkHeaderView', conditional),
      onMouseDown: this.didMouseDown
    }, _react.default.createElement("span", {
      className: "github-HunkHeaderView-title"
    }, this.props.hunk.getHeader().trim(), " ", this.props.hunk.getSectionHeading().trim()), this.renderButtons());
  }

  renderButtons() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    } else {
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement("button", {
        className: "github-HunkHeaderView-stageButton",
        onClick: this.props.toggleSelection,
        onMouseDown: theBuckStopsHere
      }, _react.default.createElement(_keystroke.default, {
        keymaps: this.props.keymaps,
        command: "core:confirm",
        refTarget: this.props.refTarget
      }), this.props.toggleSelectionLabel), this.props.stagingStatus === 'unstaged' && _react.default.createElement(_react.Fragment, null, _react.default.createElement("button", {
        ref: this.refDiscardButton.setter,
        className: "icon-trashcan github-HunkHeaderView-discardButton",
        onClick: this.props.discardSelection,
        onMouseDown: theBuckStopsHere
      }), _react.default.createElement(_tooltip.default, {
        manager: this.props.tooltips,
        target: this.refDiscardButton,
        title: this.props.discardSelectionLabel
      })));
    }
  }

  didMouseDown(event) {
    return this.props.mouseDown(event, this.props.hunk);
  }

}

exports.default = HunkHeaderView;

_defineProperty(HunkHeaderView, "propTypes", {
  refTarget: _propTypes2.RefHolderPropType.isRequired,
  hunk: _propTypes.default.object.isRequired,
  isSelected: _propTypes.default.bool.isRequired,
  stagingStatus: _propTypes.default.oneOf(['unstaged', 'staged']),
  selectionMode: _propTypes.default.oneOf(['hunk', 'line']).isRequired,
  toggleSelectionLabel: _propTypes.default.string,
  discardSelectionLabel: _propTypes.default.string,
  tooltips: _propTypes.default.object.isRequired,
  keymaps: _propTypes.default.object.isRequired,
  toggleSelection: _propTypes.default.func,
  discardSelection: _propTypes.default.func,
  mouseDown: _propTypes.default.func.isRequired,
  itemType: _propTypes2.ItemTypePropType.isRequired
});