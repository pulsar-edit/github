"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareEmojiReactionsView = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _classnames = _interopRequireDefault(require("classnames"));

var _reactionPickerController = _interopRequireDefault(require("../controllers/reaction-picker-controller"));

var _tooltip = _interopRequireDefault(require("../atom/tooltip"));

var _refHolder = _interopRequireDefault(require("../models/ref-holder"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BareEmojiReactionsView extends _react.default.Component {
  constructor(props) {
    super(props);
    this.refAddButton = new _refHolder.default();
    this.refTooltip = new _refHolder.default();
  }

  render() {
    const viewerReacted = this.props.reactable.reactionGroups.filter(group => group.viewerHasReacted).map(group => group.content);
    const {
      reactionGroups
    } = this.props.reactable;
    const showAddButton = reactionGroups.length === 0 || reactionGroups.some(g => g.users.totalCount === 0);
    return _react.default.createElement("div", {
      className: "github-EmojiReactions btn-toolbar"
    }, showAddButton && _react.default.createElement("div", {
      className: "btn-group"
    }, _react.default.createElement("button", {
      className: "github-EmojiReactions-add btn icon icon-smiley",
      ref: this.refAddButton.setter,
      disabled: !this.props.reactable.viewerCanReact
    }), _react.default.createElement(_tooltip.default, {
      manager: this.props.tooltips,
      target: this.refAddButton,
      trigger: "click",
      className: "github-Popover",
      refTooltip: this.refTooltip
    }, _react.default.createElement(_reactionPickerController.default, {
      viewerReacted: viewerReacted,
      addReaction: this.props.addReaction,
      removeReaction: this.props.removeReaction,
      tooltipHolder: this.refTooltip
    }))), _react.default.createElement("div", {
      className: "btn-group"
    }, this.props.reactable.reactionGroups.map(group => {
      const emoji = _helpers.reactionTypeToEmoji[group.content];

      if (!emoji) {
        return null;
      }

      if (group.users.totalCount === 0) {
        return null;
      }

      const className = (0, _classnames.default)('github-EmojiReactions-group', 'btn', group.content.toLowerCase(), {
        selected: group.viewerHasReacted
      });
      const toggle = !group.viewerHasReacted ? () => this.props.addReaction(group.content) : () => this.props.removeReaction(group.content);
      const disabled = !this.props.reactable.viewerCanReact;
      return _react.default.createElement("button", {
        key: group.content,
        className: className,
        onClick: toggle,
        disabled: disabled
      }, _helpers.reactionTypeToEmoji[group.content], " \xA0 ", group.users.totalCount);
    })));
  }

}

exports.BareEmojiReactionsView = BareEmojiReactionsView;

_defineProperty(BareEmojiReactionsView, "propTypes", {
  // Relay response
  reactable: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    reactionGroups: _propTypes.default.arrayOf(_propTypes.default.shape({
      content: _propTypes.default.string.isRequired,
      viewerHasReacted: _propTypes.default.bool.isRequired,
      users: _propTypes.default.shape({
        totalCount: _propTypes.default.number.isRequired
      }).isRequired
    })).isRequired,
    viewerCanReact: _propTypes.default.bool.isRequired
  }).isRequired,
  // Atom environment
  tooltips: _propTypes.default.object.isRequired,
  // Action methods
  addReaction: _propTypes.default.func.isRequired,
  removeReaction: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BareEmojiReactionsView, {
  reactable: function () {
    const node = require("./__generated__/emojiReactionsView_reactable.graphql");

    if (node.hash && node.hash !== "fde156007f42d841401632fce79875d5") {
      console.error("The definition of 'emojiReactionsView_reactable' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/emojiReactionsView_reactable.graphql");
  }
});

exports.default = _default;