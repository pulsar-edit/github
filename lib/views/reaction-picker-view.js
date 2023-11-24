"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CONTENT_TYPES = Object.keys(_helpers.reactionTypeToEmoji);
const EMOJI_COUNT = CONTENT_TYPES.length;
const EMOJI_PER_ROW = 4;
const EMOJI_ROWS = Math.ceil(EMOJI_COUNT / EMOJI_PER_ROW);

class ReactionPickerView extends _react.default.Component {
  render() {
    const viewerReactedSet = new Set(this.props.viewerReacted);
    const emojiRows = [];

    for (let row = 0; row < EMOJI_ROWS; row++) {
      const emojiButtons = [];

      for (let column = 0; column < EMOJI_PER_ROW; column++) {
        const emojiIndex = row * EMOJI_PER_ROW + column;
        /* istanbul ignore if */

        if (emojiIndex >= CONTENT_TYPES.length) {
          break;
        }

        const content = CONTENT_TYPES[emojiIndex];
        const toggle = !viewerReactedSet.has(content) ? () => this.props.addReactionAndClose(content) : () => this.props.removeReactionAndClose(content);
        const className = (0, _classnames.default)('github-ReactionPicker-reaction', 'btn', {
          selected: viewerReactedSet.has(content)
        });
        emojiButtons.push(_react.default.createElement("button", {
          key: content,
          className: className,
          onClick: toggle
        }, _helpers.reactionTypeToEmoji[content]));
      }

      emojiRows.push(_react.default.createElement("p", {
        key: row,
        className: "github-ReactionPicker-row inline-block-tight"
      }, emojiButtons));
    }

    return _react.default.createElement("div", {
      className: "github-ReactionPicker"
    }, emojiRows);
  }

}

exports.default = ReactionPickerView;

_defineProperty(ReactionPickerView, "propTypes", {
  viewerReacted: _propTypes.default.arrayOf(_propTypes.default.oneOf(Object.keys(_helpers.reactionTypeToEmoji))),
  // Action methods
  addReactionAndClose: _propTypes.default.func.isRequired,
  removeReactionAndClose: _propTypes.default.func.isRequired
});