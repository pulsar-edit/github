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
        emojiButtons.push( /*#__PURE__*/_react.default.createElement("button", {
          key: content,
          className: className,
          onClick: toggle
        }, _helpers.reactionTypeToEmoji[content]));
      }

      emojiRows.push( /*#__PURE__*/_react.default.createElement("p", {
        key: row,
        className: "github-ReactionPicker-row inline-block-tight"
      }, emojiButtons));
    }

    return /*#__PURE__*/_react.default.createElement("div", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZWFjdGlvbi1waWNrZXItdmlldy5qcyJdLCJuYW1lcyI6WyJDT05URU5UX1RZUEVTIiwiT2JqZWN0Iiwia2V5cyIsInJlYWN0aW9uVHlwZVRvRW1vamkiLCJFTU9KSV9DT1VOVCIsImxlbmd0aCIsIkVNT0pJX1BFUl9ST1ciLCJFTU9KSV9ST1dTIiwiTWF0aCIsImNlaWwiLCJSZWFjdGlvblBpY2tlclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInZpZXdlclJlYWN0ZWRTZXQiLCJTZXQiLCJwcm9wcyIsInZpZXdlclJlYWN0ZWQiLCJlbW9qaVJvd3MiLCJyb3ciLCJlbW9qaUJ1dHRvbnMiLCJjb2x1bW4iLCJlbW9qaUluZGV4IiwiY29udGVudCIsInRvZ2dsZSIsImhhcyIsImFkZFJlYWN0aW9uQW5kQ2xvc2UiLCJyZW1vdmVSZWFjdGlvbkFuZENsb3NlIiwiY2xhc3NOYW1lIiwic2VsZWN0ZWQiLCJwdXNoIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIm9uZU9mIiwiZnVuYyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7O0FBRUEsTUFBTUEsYUFBYSxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUMsNEJBQVosQ0FBdEI7QUFDQSxNQUFNQyxXQUFXLEdBQUdKLGFBQWEsQ0FBQ0ssTUFBbEM7QUFDQSxNQUFNQyxhQUFhLEdBQUcsQ0FBdEI7QUFDQSxNQUFNQyxVQUFVLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVTCxXQUFXLEdBQUdFLGFBQXhCLENBQW5COztBQUVlLE1BQU1JLGtCQUFOLFNBQWlDQyxlQUFNQyxTQUF2QyxDQUFpRDtBQVc5REMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsVUFBTUMsZ0JBQWdCLEdBQUcsSUFBSUMsR0FBSixDQUFRLEtBQUtDLEtBQUwsQ0FBV0MsYUFBbkIsQ0FBekI7QUFFQSxVQUFNQyxTQUFTLEdBQUcsRUFBbEI7O0FBQ0EsU0FBSyxJQUFJQyxHQUFHLEdBQUcsQ0FBZixFQUFrQkEsR0FBRyxHQUFHWixVQUF4QixFQUFvQ1ksR0FBRyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNQyxZQUFZLEdBQUcsRUFBckI7O0FBRUEsV0FBSyxJQUFJQyxNQUFNLEdBQUcsQ0FBbEIsRUFBcUJBLE1BQU0sR0FBR2YsYUFBOUIsRUFBNkNlLE1BQU0sRUFBbkQsRUFBdUQ7QUFDckQsY0FBTUMsVUFBVSxHQUFHSCxHQUFHLEdBQUdiLGFBQU4sR0FBc0JlLE1BQXpDO0FBRUE7O0FBQ0EsWUFBSUMsVUFBVSxJQUFJdEIsYUFBYSxDQUFDSyxNQUFoQyxFQUF3QztBQUN0QztBQUNEOztBQUVELGNBQU1rQixPQUFPLEdBQUd2QixhQUFhLENBQUNzQixVQUFELENBQTdCO0FBRUEsY0FBTUUsTUFBTSxHQUFHLENBQUNWLGdCQUFnQixDQUFDVyxHQUFqQixDQUFxQkYsT0FBckIsQ0FBRCxHQUNYLE1BQU0sS0FBS1AsS0FBTCxDQUFXVSxtQkFBWCxDQUErQkgsT0FBL0IsQ0FESyxHQUVYLE1BQU0sS0FBS1AsS0FBTCxDQUFXVyxzQkFBWCxDQUFrQ0osT0FBbEMsQ0FGVjtBQUlBLGNBQU1LLFNBQVMsR0FBRyx5QkFDaEIsZ0NBRGdCLEVBRWhCLEtBRmdCLEVBR2hCO0FBQUNDLFVBQUFBLFFBQVEsRUFBRWYsZ0JBQWdCLENBQUNXLEdBQWpCLENBQXFCRixPQUFyQjtBQUFYLFNBSGdCLENBQWxCO0FBTUFILFFBQUFBLFlBQVksQ0FBQ1UsSUFBYixlQUNFO0FBQVEsVUFBQSxHQUFHLEVBQUVQLE9BQWI7QUFBc0IsVUFBQSxTQUFTLEVBQUVLLFNBQWpDO0FBQTRDLFVBQUEsT0FBTyxFQUFFSjtBQUFyRCxXQUNHckIsNkJBQW9Cb0IsT0FBcEIsQ0FESCxDQURGO0FBS0Q7O0FBRURMLE1BQUFBLFNBQVMsQ0FBQ1ksSUFBVixlQUFlO0FBQUcsUUFBQSxHQUFHLEVBQUVYLEdBQVI7QUFBYSxRQUFBLFNBQVMsRUFBQztBQUF2QixTQUF1RUMsWUFBdkUsQ0FBZjtBQUNEOztBQUVELHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHRixTQURILENBREY7QUFLRDs7QUFyRDZEOzs7O2dCQUEzQ1Isa0IsZUFDQTtBQUNqQk8sRUFBQUEsYUFBYSxFQUFFYyxtQkFBVUMsT0FBVixDQUNiRCxtQkFBVUUsS0FBVixDQUFnQmhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZQyw0QkFBWixDQUFoQixDQURhLENBREU7QUFLakI7QUFDQXVCLEVBQUFBLG1CQUFtQixFQUFFSyxtQkFBVUcsSUFBVixDQUFlQyxVQU5uQjtBQU9qQlIsRUFBQUEsc0JBQXNCLEVBQUVJLG1CQUFVRyxJQUFWLENBQWVDO0FBUHRCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHtyZWFjdGlvblR5cGVUb0Vtb2ppfSBmcm9tICcuLi9oZWxwZXJzJztcblxuY29uc3QgQ09OVEVOVF9UWVBFUyA9IE9iamVjdC5rZXlzKHJlYWN0aW9uVHlwZVRvRW1vamkpO1xuY29uc3QgRU1PSklfQ09VTlQgPSBDT05URU5UX1RZUEVTLmxlbmd0aDtcbmNvbnN0IEVNT0pJX1BFUl9ST1cgPSA0O1xuY29uc3QgRU1PSklfUk9XUyA9IE1hdGguY2VpbChFTU9KSV9DT1VOVCAvIEVNT0pJX1BFUl9ST1cpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdGlvblBpY2tlclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHZpZXdlclJlYWN0ZWQ6IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLm9uZU9mKE9iamVjdC5rZXlzKHJlYWN0aW9uVHlwZVRvRW1vamkpKSxcbiAgICApLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBhZGRSZWFjdGlvbkFuZENsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlbW92ZVJlYWN0aW9uQW5kQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgdmlld2VyUmVhY3RlZFNldCA9IG5ldyBTZXQodGhpcy5wcm9wcy52aWV3ZXJSZWFjdGVkKTtcblxuICAgIGNvbnN0IGVtb2ppUm93cyA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IEVNT0pJX1JPV1M7IHJvdysrKSB7XG4gICAgICBjb25zdCBlbW9qaUJ1dHRvbnMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgRU1PSklfUEVSX1JPVzsgY29sdW1uKyspIHtcbiAgICAgICAgY29uc3QgZW1vamlJbmRleCA9IHJvdyAqIEVNT0pJX1BFUl9ST1cgKyBjb2x1bW47XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChlbW9qaUluZGV4ID49IENPTlRFTlRfVFlQRVMubGVuZ3RoKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb250ZW50ID0gQ09OVEVOVF9UWVBFU1tlbW9qaUluZGV4XTtcblxuICAgICAgICBjb25zdCB0b2dnbGUgPSAhdmlld2VyUmVhY3RlZFNldC5oYXMoY29udGVudClcbiAgICAgICAgICA/ICgpID0+IHRoaXMucHJvcHMuYWRkUmVhY3Rpb25BbmRDbG9zZShjb250ZW50KVxuICAgICAgICAgIDogKCkgPT4gdGhpcy5wcm9wcy5yZW1vdmVSZWFjdGlvbkFuZENsb3NlKGNvbnRlbnQpO1xuXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN4KFxuICAgICAgICAgICdnaXRodWItUmVhY3Rpb25QaWNrZXItcmVhY3Rpb24nLFxuICAgICAgICAgICdidG4nLFxuICAgICAgICAgIHtzZWxlY3RlZDogdmlld2VyUmVhY3RlZFNldC5oYXMoY29udGVudCl9LFxuICAgICAgICApO1xuXG4gICAgICAgIGVtb2ppQnV0dG9ucy5wdXNoKFxuICAgICAgICAgIDxidXR0b24ga2V5PXtjb250ZW50fSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gb25DbGljaz17dG9nZ2xlfT5cbiAgICAgICAgICAgIHtyZWFjdGlvblR5cGVUb0Vtb2ppW2NvbnRlbnRdfVxuICAgICAgICAgIDwvYnV0dG9uPixcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZW1vamlSb3dzLnB1c2goPHAga2V5PXtyb3d9IGNsYXNzTmFtZT1cImdpdGh1Yi1SZWFjdGlvblBpY2tlci1yb3cgaW5saW5lLWJsb2NrLXRpZ2h0XCI+e2Vtb2ppQnV0dG9uc308L3A+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVhY3Rpb25QaWNrZXJcIj5cbiAgICAgICAge2Vtb2ppUm93c31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==