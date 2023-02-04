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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDT05URU5UX1RZUEVTIiwiT2JqZWN0Iiwia2V5cyIsInJlYWN0aW9uVHlwZVRvRW1vamkiLCJFTU9KSV9DT1VOVCIsImxlbmd0aCIsIkVNT0pJX1BFUl9ST1ciLCJFTU9KSV9ST1dTIiwiTWF0aCIsImNlaWwiLCJSZWFjdGlvblBpY2tlclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInZpZXdlclJlYWN0ZWRTZXQiLCJTZXQiLCJwcm9wcyIsInZpZXdlclJlYWN0ZWQiLCJlbW9qaVJvd3MiLCJyb3ciLCJlbW9qaUJ1dHRvbnMiLCJjb2x1bW4iLCJlbW9qaUluZGV4IiwiY29udGVudCIsInRvZ2dsZSIsImhhcyIsImFkZFJlYWN0aW9uQW5kQ2xvc2UiLCJyZW1vdmVSZWFjdGlvbkFuZENsb3NlIiwiY2xhc3NOYW1lIiwiY3giLCJzZWxlY3RlZCIsInB1c2giLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwib25lT2YiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbInJlYWN0aW9uLXBpY2tlci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQge3JlYWN0aW9uVHlwZVRvRW1vaml9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBDT05URU5UX1RZUEVTID0gT2JqZWN0LmtleXMocmVhY3Rpb25UeXBlVG9FbW9qaSk7XG5jb25zdCBFTU9KSV9DT1VOVCA9IENPTlRFTlRfVFlQRVMubGVuZ3RoO1xuY29uc3QgRU1PSklfUEVSX1JPVyA9IDQ7XG5jb25zdCBFTU9KSV9ST1dTID0gTWF0aC5jZWlsKEVNT0pJX0NPVU5UIC8gRU1PSklfUEVSX1JPVyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWN0aW9uUGlja2VyVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdmlld2VyUmVhY3RlZDogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMub25lT2YoT2JqZWN0LmtleXMocmVhY3Rpb25UeXBlVG9FbW9qaSkpLFxuICAgICksXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIGFkZFJlYWN0aW9uQW5kQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVtb3ZlUmVhY3Rpb25BbmRDbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB2aWV3ZXJSZWFjdGVkU2V0ID0gbmV3IFNldCh0aGlzLnByb3BzLnZpZXdlclJlYWN0ZWQpO1xuXG4gICAgY29uc3QgZW1vamlSb3dzID0gW107XG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgRU1PSklfUk9XUzsgcm93KyspIHtcbiAgICAgIGNvbnN0IGVtb2ppQnV0dG9ucyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBjb2x1bW4gPSAwOyBjb2x1bW4gPCBFTU9KSV9QRVJfUk9XOyBjb2x1bW4rKykge1xuICAgICAgICBjb25zdCBlbW9qaUluZGV4ID0gcm93ICogRU1PSklfUEVSX1JPVyArIGNvbHVtbjtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKGVtb2ppSW5kZXggPj0gQ09OVEVOVF9UWVBFUy5sZW5ndGgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBDT05URU5UX1RZUEVTW2Vtb2ppSW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IHRvZ2dsZSA9ICF2aWV3ZXJSZWFjdGVkU2V0Lmhhcyhjb250ZW50KVxuICAgICAgICAgID8gKCkgPT4gdGhpcy5wcm9wcy5hZGRSZWFjdGlvbkFuZENsb3NlKGNvbnRlbnQpXG4gICAgICAgICAgOiAoKSA9PiB0aGlzLnByb3BzLnJlbW92ZVJlYWN0aW9uQW5kQ2xvc2UoY29udGVudCk7XG5cbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gY3goXG4gICAgICAgICAgJ2dpdGh1Yi1SZWFjdGlvblBpY2tlci1yZWFjdGlvbicsXG4gICAgICAgICAgJ2J0bicsXG4gICAgICAgICAge3NlbGVjdGVkOiB2aWV3ZXJSZWFjdGVkU2V0Lmhhcyhjb250ZW50KX0sXG4gICAgICAgICk7XG5cbiAgICAgICAgZW1vamlCdXR0b25zLnB1c2goXG4gICAgICAgICAgPGJ1dHRvbiBrZXk9e2NvbnRlbnR9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBvbkNsaWNrPXt0b2dnbGV9PlxuICAgICAgICAgICAge3JlYWN0aW9uVHlwZVRvRW1vamlbY29udGVudF19XG4gICAgICAgICAgPC9idXR0b24+LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBlbW9qaVJvd3MucHVzaCg8cCBrZXk9e3Jvd30gY2xhc3NOYW1lPVwiZ2l0aHViLVJlYWN0aW9uUGlja2VyLXJvdyBpbmxpbmUtYmxvY2stdGlnaHRcIj57ZW1vamlCdXR0b25zfTwvcD4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZWFjdGlvblBpY2tlclwiPlxuICAgICAgICB7ZW1vamlSb3dzfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUErQztBQUFBO0FBQUE7QUFBQTtBQUUvQyxNQUFNQSxhQUFhLEdBQUdDLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDQyw0QkFBbUIsQ0FBQztBQUN0RCxNQUFNQyxXQUFXLEdBQUdKLGFBQWEsQ0FBQ0ssTUFBTTtBQUN4QyxNQUFNQyxhQUFhLEdBQUcsQ0FBQztBQUN2QixNQUFNQyxVQUFVLEdBQUdDLElBQUksQ0FBQ0MsSUFBSSxDQUFDTCxXQUFXLEdBQUdFLGFBQWEsQ0FBQztBQUUxQyxNQUFNSSxrQkFBa0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFXOURDLE1BQU0sR0FBRztJQUNQLE1BQU1DLGdCQUFnQixHQUFHLElBQUlDLEdBQUcsQ0FBQyxJQUFJLENBQUNDLEtBQUssQ0FBQ0MsYUFBYSxDQUFDO0lBRTFELE1BQU1DLFNBQVMsR0FBRyxFQUFFO0lBQ3BCLEtBQUssSUFBSUMsR0FBRyxHQUFHLENBQUMsRUFBRUEsR0FBRyxHQUFHWixVQUFVLEVBQUVZLEdBQUcsRUFBRSxFQUFFO01BQ3pDLE1BQU1DLFlBQVksR0FBRyxFQUFFO01BRXZCLEtBQUssSUFBSUMsTUFBTSxHQUFHLENBQUMsRUFBRUEsTUFBTSxHQUFHZixhQUFhLEVBQUVlLE1BQU0sRUFBRSxFQUFFO1FBQ3JELE1BQU1DLFVBQVUsR0FBR0gsR0FBRyxHQUFHYixhQUFhLEdBQUdlLE1BQU07O1FBRS9DO1FBQ0EsSUFBSUMsVUFBVSxJQUFJdEIsYUFBYSxDQUFDSyxNQUFNLEVBQUU7VUFDdEM7UUFDRjtRQUVBLE1BQU1rQixPQUFPLEdBQUd2QixhQUFhLENBQUNzQixVQUFVLENBQUM7UUFFekMsTUFBTUUsTUFBTSxHQUFHLENBQUNWLGdCQUFnQixDQUFDVyxHQUFHLENBQUNGLE9BQU8sQ0FBQyxHQUN6QyxNQUFNLElBQUksQ0FBQ1AsS0FBSyxDQUFDVSxtQkFBbUIsQ0FBQ0gsT0FBTyxDQUFDLEdBQzdDLE1BQU0sSUFBSSxDQUFDUCxLQUFLLENBQUNXLHNCQUFzQixDQUFDSixPQUFPLENBQUM7UUFFcEQsTUFBTUssU0FBUyxHQUFHLElBQUFDLG1CQUFFLEVBQ2xCLGdDQUFnQyxFQUNoQyxLQUFLLEVBQ0w7VUFBQ0MsUUFBUSxFQUFFaEIsZ0JBQWdCLENBQUNXLEdBQUcsQ0FBQ0YsT0FBTztRQUFDLENBQUMsQ0FDMUM7UUFFREgsWUFBWSxDQUFDVyxJQUFJLENBQ2Y7VUFBUSxHQUFHLEVBQUVSLE9BQVE7VUFBQyxTQUFTLEVBQUVLLFNBQVU7VUFBQyxPQUFPLEVBQUVKO1FBQU8sR0FDekRyQiw0QkFBbUIsQ0FBQ29CLE9BQU8sQ0FBQyxDQUN0QixDQUNWO01BQ0g7TUFFQUwsU0FBUyxDQUFDYSxJQUFJLENBQUM7UUFBRyxHQUFHLEVBQUVaLEdBQUk7UUFBQyxTQUFTLEVBQUM7TUFBOEMsR0FBRUMsWUFBWSxDQUFLLENBQUM7SUFDMUc7SUFFQSxPQUNFO01BQUssU0FBUyxFQUFDO0lBQXVCLEdBQ25DRixTQUFTLENBQ047RUFFVjtBQUNGO0FBQUM7QUFBQSxnQkF0RG9CUixrQkFBa0IsZUFDbEI7RUFDakJPLGFBQWEsRUFBRWUsa0JBQVMsQ0FBQ0MsT0FBTyxDQUM5QkQsa0JBQVMsQ0FBQ0UsS0FBSyxDQUFDakMsTUFBTSxDQUFDQyxJQUFJLENBQUNDLDRCQUFtQixDQUFDLENBQUMsQ0FDbEQ7RUFFRDtFQUNBdUIsbUJBQW1CLEVBQUVNLGtCQUFTLENBQUNHLElBQUksQ0FBQ0MsVUFBVTtFQUM5Q1Qsc0JBQXNCLEVBQUVLLGtCQUFTLENBQUNHLElBQUksQ0FBQ0M7QUFDekMsQ0FBQyJ9