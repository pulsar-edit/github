"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BareEmojiReactionsController = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireDefault(require("react"));
var _reactRelay = require("react-relay");
var _emojiReactionsView = _interopRequireDefault(require("../views/emoji-reactions-view"));
var _addReaction = _interopRequireDefault(require("../mutations/add-reaction"));
var _removeReaction = _interopRequireDefault(require("../mutations/remove-reaction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class BareEmojiReactionsController extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "addReaction", async content => {
      try {
        await (0, _addReaction.default)(this.props.relay.environment, this.props.reactable.id, content);
      } catch (err) {
        this.props.reportRelayError('Unable to add reaction emoji', err);
      }
    });
    _defineProperty(this, "removeReaction", async content => {
      try {
        await (0, _removeReaction.default)(this.props.relay.environment, this.props.reactable.id, content);
      } catch (err) {
        this.props.reportRelayError('Unable to remove reaction emoji', err);
      }
    });
  }
  render() {
    return _react.default.createElement(_emojiReactionsView.default, _extends({
      addReaction: this.addReaction,
      removeReaction: this.removeReaction
    }, this.props));
  }
}
exports.BareEmojiReactionsController = BareEmojiReactionsController;
_defineProperty(BareEmojiReactionsController, "propTypes", {
  relay: _propTypes.default.shape({
    environment: _propTypes.default.object.isRequired
  }).isRequired,
  reactable: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired
  }).isRequired,
  // Atom environment
  tooltips: _propTypes.default.object.isRequired,
  // Action methods
  reportRelayError: _propTypes.default.func.isRequired
});
var _default = (0, _reactRelay.createFragmentContainer)(BareEmojiReactionsController, {
  reactable: function () {
    const node = require("./__generated__/emojiReactionsController_reactable.graphql");
    if (node.hash && node.hash !== "cfdd39cd7aa02bce0bdcd52bc0154223") {
      console.error("The definition of 'emojiReactionsController_reactable' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }
    return require("./__generated__/emojiReactionsController_reactable.graphql");
  }
});
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCYXJlRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb250ZW50IiwiYWRkUmVhY3Rpb25NdXRhdGlvbiIsInByb3BzIiwicmVsYXkiLCJlbnZpcm9ubWVudCIsInJlYWN0YWJsZSIsImlkIiwiZXJyIiwicmVwb3J0UmVsYXlFcnJvciIsInJlbW92ZVJlYWN0aW9uTXV0YXRpb24iLCJyZW5kZXIiLCJhZGRSZWFjdGlvbiIsInJlbW92ZVJlYWN0aW9uIiwiUHJvcFR5cGVzIiwic2hhcGUiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwidG9vbHRpcHMiLCJmdW5jIiwiY3JlYXRlRnJhZ21lbnRDb250YWluZXIiXSwic291cmNlcyI6WyJlbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRDb250YWluZXIsIGdyYXBocWx9IGZyb20gJ3JlYWN0LXJlbGF5JztcblxuaW1wb3J0IEVtb2ppUmVhY3Rpb25zVmlldyBmcm9tICcuLi92aWV3cy9lbW9qaS1yZWFjdGlvbnMtdmlldyc7XG5pbXBvcnQgYWRkUmVhY3Rpb25NdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvYWRkLXJlYWN0aW9uJztcbmltcG9ydCByZW1vdmVSZWFjdGlvbk11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9yZW1vdmUtcmVhY3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgQmFyZUVtb2ppUmVhY3Rpb25zQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmVhY3RhYmxlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxFbW9qaVJlYWN0aW9uc1ZpZXdcbiAgICAgICAgYWRkUmVhY3Rpb249e3RoaXMuYWRkUmVhY3Rpb259XG4gICAgICAgIHJlbW92ZVJlYWN0aW9uPXt0aGlzLnJlbW92ZVJlYWN0aW9ufVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGFkZFJlYWN0aW9uID0gYXN5bmMgY29udGVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFkZFJlYWN0aW9uTXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwgdGhpcy5wcm9wcy5yZWFjdGFibGUuaWQsIGNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gYWRkIHJlYWN0aW9uIGVtb2ppJywgZXJyKTtcbiAgICB9XG4gIH07XG5cbiAgcmVtb3ZlUmVhY3Rpb24gPSBhc3luYyBjb250ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcmVtb3ZlUmVhY3Rpb25NdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB0aGlzLnByb3BzLnJlYWN0YWJsZS5pZCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byByZW1vdmUgcmVhY3Rpb24gZW1vamknLCBlcnIpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRnJhZ21lbnRDb250YWluZXIoQmFyZUVtb2ppUmVhY3Rpb25zQ29udHJvbGxlciwge1xuICByZWFjdGFibGU6IGdyYXBocWxgXG4gICAgZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICAgICAgaWRcbiAgICAgIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcbiAgICB9XG4gIGAsXG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQWtFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFM0QsTUFBTUEsNEJBQTRCLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBQUE7SUFBQTtJQUFBLHFDQTBCbEQsTUFBTUMsT0FBTyxJQUFJO01BQzdCLElBQUk7UUFDRixNQUFNLElBQUFDLG9CQUFtQixFQUFDLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxLQUFLLENBQUNDLFdBQVcsRUFBRSxJQUFJLENBQUNGLEtBQUssQ0FBQ0csU0FBUyxDQUFDQyxFQUFFLEVBQUVOLE9BQU8sQ0FBQztNQUMzRixDQUFDLENBQUMsT0FBT08sR0FBRyxFQUFFO1FBQ1osSUFBSSxDQUFDTCxLQUFLLENBQUNNLGdCQUFnQixDQUFDLDhCQUE4QixFQUFFRCxHQUFHLENBQUM7TUFDbEU7SUFDRixDQUFDO0lBQUEsd0NBRWdCLE1BQU1QLE9BQU8sSUFBSTtNQUNoQyxJQUFJO1FBQ0YsTUFBTSxJQUFBUyx1QkFBc0IsRUFBQyxJQUFJLENBQUNQLEtBQUssQ0FBQ0MsS0FBSyxDQUFDQyxXQUFXLEVBQUUsSUFBSSxDQUFDRixLQUFLLENBQUNHLFNBQVMsQ0FBQ0MsRUFBRSxFQUFFTixPQUFPLENBQUM7TUFDOUYsQ0FBQyxDQUFDLE9BQU9PLEdBQUcsRUFBRTtRQUNaLElBQUksQ0FBQ0wsS0FBSyxDQUFDTSxnQkFBZ0IsQ0FBQyxpQ0FBaUMsRUFBRUQsR0FBRyxDQUFDO01BQ3JFO0lBQ0YsQ0FBQztFQUFBO0VBeEJERyxNQUFNLEdBQUc7SUFDUCxPQUNFLDZCQUFDLDJCQUFrQjtNQUNqQixXQUFXLEVBQUUsSUFBSSxDQUFDQyxXQUFZO01BQzlCLGNBQWMsRUFBRSxJQUFJLENBQUNDO0lBQWUsR0FDaEMsSUFBSSxDQUFDVixLQUFLLEVBQ2Q7RUFFTjtBQWlCRjtBQUFDO0FBQUEsZ0JBekNZTCw0QkFBNEIsZUFDcEI7RUFDakJNLEtBQUssRUFBRVUsa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQ3JCVixXQUFXLEVBQUVTLGtCQUFTLENBQUNFLE1BQU0sQ0FBQ0M7RUFDaEMsQ0FBQyxDQUFDLENBQUNBLFVBQVU7RUFDYlgsU0FBUyxFQUFFUSxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDekJSLEVBQUUsRUFBRU8sa0JBQVMsQ0FBQ0ksTUFBTSxDQUFDRDtFQUN2QixDQUFDLENBQUMsQ0FBQ0EsVUFBVTtFQUViO0VBQ0FFLFFBQVEsRUFBRUwsa0JBQVMsQ0FBQ0UsTUFBTSxDQUFDQyxVQUFVO0VBRXJDO0VBQ0FSLGdCQUFnQixFQUFFSyxrQkFBUyxDQUFDTSxJQUFJLENBQUNIO0FBQ25DLENBQUM7QUFBQSxlQTZCWSxJQUFBSSxtQ0FBdUIsRUFBQ3ZCLDRCQUE0QixFQUFFO0VBQ25FUSxTQUFTO0lBQUE7SUFBQTtNQUFBO0lBQUE7SUFBQTtFQUFBO0FBTVgsQ0FBQyxDQUFDO0FBQUEifQ==